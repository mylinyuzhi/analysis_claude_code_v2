
// @from(Ln 483345, Col 0)
function trK(q) {
    let K = s(51),
        {
            source: _,
            agents: z,
            runningByType: Y,
            usedThisSession: A,
            onSelect: O,
            onCreateNew: w,
            changes: $
        } = q,
        [j, H] = Q7.useState(null),
        [J, X] = Q7.useState(!0),
        {
            headerFocused: M,
            focusHeader: P
        } = uX(),
        W;
    if (K[0] !== z || K[1] !== _ || K[2] !== A) {
        q: {
            let C = [...z].sort(Xo8);
            if (_ !== "all" || !A || A.size === 0) {
                W = C;
                break q
            }
            let x;
            if (K[4] !== A) x = (B, m) => {
                let S = A.has(B.agentType) ? 0 : 1,
                    F = A.has(m.agentType) ? 0 : 1;
                return S - F
            },
            K[4] = A,
            K[5] = x;
            else x = K[5];W = C.sort(x)
        }
        K[0] = z,
        K[1] = _,
        K[2] = A,
        K[3] = W
    }
    else W = K[3];
    let D = W,
        Z = M || J ? null : j,
        G;
    if (K[6] !== D || K[7] !== _) {
        q: {
            let C = D.filter(VnY);
            if (_ === "all") {
                G = s_8.filter(TnY).flatMap((x) => {
                    let {
                        source: B
                    } = x;
                    return C.filter((m) => m.source === B)
                });
                break q
            }
            G = C
        }
        K[6] = D,
        K[7] = _,
        K[8] = G
    }
    else G = K[8];
    let f = G,
        v, V;
    if (K[9] !== J || K[10] !== w || K[11] !== f || K[12] !== j) v = () => {
        if (!j && !J && f.length > 0)
            if (w) X(!0);
            else H(f[0] || null)
    }, V = [f, j, J, w], K[9] = J, K[10] = w, K[11] = f, K[12] = j, K[13] = v, K[14] = V;
    else v = K[13], V = K[14];
    Q7.useEffect(v, V);
    let k;
    if (K[15] !== P || K[16] !== M || K[17] !== J || K[18] !== w || K[19] !== O || K[20] !== f || K[21] !== j) k = (C) => {
        if (M) return;
        if (C.key === "return") {
            if (C.preventDefault(), J && w) w();
            else if (j) O(j);
            return
        }
        if (C.key !== "up" && C.key !== "down") return;
        C.preventDefault();
        let x = !!w,
            B = f.length + (x ? 1 : 0);
        if (B === 0) return;
        let m = 0;
        if (!J && j) {
            let F = f.findIndex((U) => U.agentType === j.agentType && U.source === j.source);
            if (F >= 0) m = x ? F + 1 : F
        }
        if (C.key === "up" && m === 0) {
            P();
            return
        }
        let S = C.key === "up" ? m - 1 : Math.min(m + 1, B - 1);
        if (x && S === 0) X(!0), H(null);
        else {
            let F = x ? S - 1 : S,
                U = f[F];
            if (U) X(!1), H(U)
        }
    }, K[15] = P, K[16] = M, K[17] = J, K[18] = w, K[19] = O, K[20] = f, K[21] = j, K[22] = k;
    else k = K[22];
    let N = k,
        R, h;
    if (K[23] !== Z || K[24] !== $ || K[25] !== N || K[26] !== M || K[27] !== J || K[28] !== w || K[29] !== Y || K[30] !== D || K[31] !== _) {
        h = Symbol.for("react.early_return_sentinel");
        q: {
            let C = D.filter(vnY);
            if (!D.length || _ !== "built-in" && !D.some(GnY)) {
                let S;
                if (K[34] !== M || K[35] !== J || K[36] !== w) S = w && Q7.createElement(u, null, Q7.createElement(arK, {
                    active: J && !M
                })), K[34] = M, K[35] = J, K[36] = w, K[37] = S;
                else S = K[37];
                let F, U, g;
                if (K[38] === Symbol.for("react.memo_cache_sentinel")) g = Q7.createElement(T, {
                    dimColor: !0
                }, "No agents found. Create specialized subagents that Claude can delegate to."), F = Q7.createElement(T, {
                    dimColor: !0
                }, "Each subagent has its own context window, custom system prompt, and specific tools."), U = Q7.createElement(T, {
                    dimColor: !0
                }, "Try creating: Code Reviewer, Code Simplifier, Security Reviewer, Tech Lead, or UX Reviewer."), K[38] = F, K[39] = U, K[40] = g;
                else F = K[38], U = K[39], g = K[40];
                let c = _ !== "built-in" && C.length > 0 && Q7.createElement(Q7.Fragment, null, Q7.createElement(zA, null), Q7.createElement(srK, {
                        agents: C,
                        runningByType: Y
                    })),
                    n;
                if (K[41] !== N || K[42] !== c || K[43] !== S) n = Q7.createElement(u, {
                    flexDirection: "column",
                    gap: 1,
                    tabIndex: 0,
                    autoFocus: !0,
                    onKeyDown: N
                }, S, g, F, U, c), K[41] = N, K[42] = c, K[43] = S, K[44] = n;
                else n = K[44];
                h = n;
                break q
            }
            let B;
            if (K[45] !== $) B = $ && $.length > 0 && Q7.createElement(u, {
                marginBottom: 1
            }, Q7.createElement(T, {
                dimColor: !0
            }, $.at(-1))),
            K[45] = $,
            K[46] = B;
            else B = K[46];
            let m;
            if (K[47] !== M || K[48] !== J || K[49] !== w) m = w && Q7.createElement(u, {
                marginBottom: 1
            }, Q7.createElement(arK, {
                active: J && !M
            })),
            K[47] = M,
            K[48] = J,
            K[49] = w,
            K[50] = m;
            else m = K[50];R = Q7.createElement(u, {
                flexDirection: "column",
                tabIndex: 0,
                autoFocus: !0,
                onKeyDown: N
            }, B, m, _ === "all" ? Q7.createElement(Q7.Fragment, null, s_8.filter(fnY).map((S) => {
                let {
                    label: F,
                    source: U
                } = S;
                return Q7.createElement(knY, {
                    key: U,
                    title: F,
                    agents: D.filter((g) => g.source === U),
                    activeSelection: Z,
                    runningByType: Y
                })
            }), C.length > 0 && Q7.createElement(u, {
                flexDirection: "column",
                marginBottom: 1,
                paddingLeft: 2
            }, Q7.createElement(T, {
                dimColor: !0
            }, Q7.createElement(T, {
                bold: !0
            }, "Built-in agents"), " (always available)"), C.map((S) => Q7.createElement(t_8, {
                key: `${S.agentType}-${S.source}`,
                agent: S,
                activeSelection: Z,
                runningByType: Y
            })))) : _ === "built-in" ? Q7.createElement(Q7.Fragment, null, Q7.createElement(T, {
                dimColor: !0,
                italic: !0
            }, "Built-in agents are provided by default and cannot be modified."), Q7.createElement(u, {
                marginTop: 1,
                flexDirection: "column"
            }, D.map((S) => Q7.createElement(t_8, {
                key: `${S.agentType}-${S.source}`,
                agent: S,
                activeSelection: Z,
                runningByType: Y
            })))) : Q7.createElement(Q7.Fragment, null, D.filter(ZnY).map((S) => Q7.createElement(t_8, {
                key: `${S.agentType}-${S.source}`,
                agent: S,
                activeSelection: Z,
                runningByType: Y
            })), C.length > 0 && Q7.createElement(Q7.Fragment, null, Q7.createElement(zA, null), Q7.createElement(srK, {
                agents: C,
                runningByType: Y
            }))))
        }
        K[23] = Z, K[24] = $, K[25] = N, K[26] = M, K[27] = J, K[28] = w, K[29] = Y, K[30] = D, K[31] = _, K[32] = R, K[33] = h
    } else R = K[32], h = K[33];
    if (h !== Symbol.for("react.early_return_sentinel")) return h;
    return R
}
// @from(Ln 483561, Col 0)
function ZnY(q) {
    return q.source !== "built-in"
}
// @from(Ln 483565, Col 0)
function fnY(q) {
    return q.source !== "built-in"
}
// @from(Ln 483569, Col 0)
function GnY(q) {
    return q.source !== "built-in"
}
// @from(Ln 483573, Col 0)
function vnY(q) {
    return q.source === "built-in"
}
// @from(Ln 483577, Col 0)
function TnY(q) {
    return q.source !== "built-in"
}
// @from(Ln 483581, Col 0)
function VnY(q) {
    return q.source !== "built-in"
}
// @from(Ln 483585, Col 0)
function arK(q) {
    let K = s(8),
        {
            active: _
        } = q,
        z = _ ? "suggestion" : void 0,
        Y = _ ? `${e6.pointer} ` : "  ",
        A;
    if (K[0] !== z || K[1] !== Y) A = Q7.createElement(T, {
        color: z
    }, Y), K[0] = z, K[1] = Y, K[2] = A;
    else A = K[2];
    let O = _ ? "suggestion" : void 0,
        w;
    if (K[3] !== O) w = Q7.createElement(T, {
        color: O
    }, "Create new agent"), K[3] = O, K[4] = w;
    else w = K[4];
    let $;
    if (K[5] !== A || K[6] !== w) $ = Q7.createElement(u, null, A, w), K[5] = A, K[6] = w, K[7] = $;
    else $ = K[7];
    return $
}
// @from(Ln 483609, Col 0)
function t_8(q) {
    let K = s(32),
        {
            agent: _,
            activeSelection: z,
            runningByType: Y
        } = q,
        A = _.source === "built-in",
        O = !A && z?.agentType === _.agentType && z?.source === _.source,
        w = _.overriddenBy || null,
        $ = !!w,
        j = A || $,
        H = !A && O ? "suggestion" : void 0,
        J;
    if (K[0] !== _) J = Ho8(_), K[0] = _, K[1] = J;
    else J = K[1];
    let X = J,
        M;
    if (K[2] !== _.agentType || K[3] !== $ || K[4] !== Y) M = $ ? 0 : Y?.get(_.agentType) ?? 0, K[2] = _.agentType, K[3] = $, K[4] = Y, K[5] = M;
    else M = K[5];
    let P = M,
        W = j && !O,
        D = A ? "" : O ? `${e6.pointer} ` : "  ",
        Z;
    if (K[6] !== W || K[7] !== D || K[8] !== H) Z = Q7.createElement(T, {
        dimColor: W,
        color: H
    }, D), K[6] = W, K[7] = D, K[8] = H, K[9] = Z;
    else Z = K[9];
    let G = j && !O,
        f;
    if (K[10] !== _.agentType || K[11] !== G || K[12] !== H) f = Q7.createElement(T, {
        dimColor: G,
        color: H
    }, _.agentType), K[10] = _.agentType, K[11] = G, K[12] = H, K[13] = f;
    else f = K[13];
    let v;
    if (K[14] !== X || K[15] !== H) v = X && Q7.createElement(T, {
        dimColor: !0,
        color: H
    }, " · ", X), K[14] = X, K[15] = H, K[16] = v;
    else v = K[16];
    let V;
    if (K[17] !== _.memory || K[18] !== H) V = _.memory && Q7.createElement(T, {
        dimColor: !0,
        color: H
    }, " · ", _.memory, " memory"), K[17] = _.memory, K[18] = H, K[19] = V;
    else V = K[19];
    let k;
    if (K[20] !== P) k = P > 0 && Q7.createElement(T, {
        color: "success"
    }, " ", $9, " ", P, " running"), K[20] = P, K[21] = k;
    else k = K[21];
    let N;
    if (K[22] !== O || K[23] !== w) N = w && Q7.createElement(T, {
        dimColor: !O,
        color: O ? "warning" : void 0
    }, " ", e6.warning, " shadowed by ", Jo8(w)), K[22] = O, K[23] = w, K[24] = N;
    else N = K[24];
    let R;
    if (K[25] !== k || K[26] !== N || K[27] !== Z || K[28] !== f || K[29] !== v || K[30] !== V) R = Q7.createElement(u, null, Z, f, v, V, k, N), K[25] = k, K[26] = N, K[27] = Z, K[28] = f, K[29] = v, K[30] = V, K[31] = R;
    else R = K[31];
    return R
}
// @from(Ln 483674, Col 0)
function srK(q) {
    let K = s(8),
        {
            agents: _,
            runningByType: z
        } = q,
        Y;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = Q7.createElement(T, {
        bold: !0,
        dimColor: !0
    }, "Built-in (always available):"), K[0] = Y;
    else Y = K[0];
    let A;
    if (K[1] !== _ || K[2] !== z) {
        let w;
        if (K[4] !== z) w = ($) => Q7.createElement(t_8, {
            key: `${$.agentType}-${$.source}`,
            agent: $,
            activeSelection: null,
            runningByType: z
        }), K[4] = z, K[5] = w;
        else w = K[5];
        A = _.map(w), K[1] = _, K[2] = z, K[3] = A
    } else A = K[3];
    let O;
    if (K[6] !== A) O = Q7.createElement(u, {
        flexDirection: "column",
        marginBottom: 1,
        paddingLeft: 2
    }, Y, A), K[6] = A, K[7] = O;
    else O = K[7];
    return O
}
// @from(Ln 483708, Col 0)
function knY(q) {
    let K = s(18),
        {
            title: _,
            agents: z,
            activeSelection: Y,
            runningByType: A
        } = q;
    if (!z.length) return null;
    let O = z[0]?.baseDir,
        w;
    if (K[0] !== _) w = Q7.createElement(T, {
        bold: !0,
        dimColor: !0
    }, _), K[0] = _, K[1] = w;
    else w = K[1];
    let $ = O ?? !1,
        j;
    if (K[2] !== O || K[3] !== $) j = Q7.createElement(CP6, {
        when: $
    }, O), K[2] = O, K[3] = $, K[4] = j;
    else j = K[4];
    let H;
    if (K[5] !== w || K[6] !== j) H = Q7.createElement(u, {
        paddingLeft: 2
    }, w, j), K[5] = w, K[6] = j, K[7] = H;
    else H = K[7];
    let J;
    if (K[8] !== Y || K[9] !== z || K[10] !== A) {
        let M;
        if (K[12] !== Y || K[13] !== A) M = (P) => Q7.createElement(t_8, {
            key: `${P.agentType}-${P.source}`,
            agent: P,
            activeSelection: Y,
            runningByType: A
        }), K[12] = Y, K[13] = A, K[14] = M;
        else M = K[14];
        J = z.map(M), K[8] = Y, K[9] = z, K[10] = A, K[11] = J
    } else J = K[11];
    let X;
    if (K[15] !== H || K[16] !== J) X = Q7.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, H, J), K[15] = H, K[16] = J, K[17] = X;
    else X = K[17];
    return X
}
// @from(Ln 483755, Col 4)
Q7
// @from(Ln 483756, Col 4)
erK = L(() => {
    o6();
    Qq();
    A3();
    g6();
    Mo8();
    Xi8();
    VR();
    BT();
    Q7 = K6(P6(), 1)
})
// @from(Ln 483768, Col 0)
function qoK() {
    let q = s(14),
        {
            goNext: K,
            goBack: _,
            updateWizardData: z,
            wizardData: Y
        } = QK(),
        A;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) A = {
        context: "Confirmation"
    }, q[0] = A;
    else A = q[0];
    G1("confirm:no", _, A);
    let O;
    if (q[1] !== K || q[2] !== z || q[3] !== Y.agentType || q[4] !== Y.location || q[5] !== Y.selectedModel || q[6] !== Y.selectedTools || q[7] !== Y.systemPrompt || q[8] !== Y.whenToUse) O = (J) => {
        z({
            selectedColor: J,
            finalAgent: {
                agentType: Y.agentType,
                whenToUse: Y.whenToUse,
                getSystemPrompt: () => Y.systemPrompt,
                tools: Y.selectedTools,
                ...Y.selectedModel && {
                    model: Y.selectedModel
                },
                ...J && {
                    color: J
                },
                source: Y.location
            }
        }), K()
    }, q[1] = K, q[2] = z, q[3] = Y.agentType, q[4] = Y.location, q[5] = Y.selectedModel, q[6] = Y.selectedTools, q[7] = Y.systemPrompt, q[8] = Y.whenToUse, q[9] = O;
    else O = q[9];
    let w = O,
        $;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) $ = zz6.default.createElement(z1, null, zz6.default.createElement(A8, {
        chord: ["up", "down"],
        format: {
            arrowSep: ""
        },
        action: "navigate"
    }), zz6.default.createElement(A8, {
        chord: "enter",
        action: "select"
    }), zz6.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })), q[10] = $;
    else $ = q[10];
    let j = Y.agentType || "agent",
        H;
    if (q[11] !== w || q[12] !== j) H = zz6.default.createElement(HK, {
        subtitle: "Choose background color",
        footerText: $
    }, zz6.default.createElement(u, null, zz6.default.createElement(Zo8, {
        agentName: j,
        currentColor: "automatic",
        onConfirm: w
    }))), q[11] = w, q[12] = j, q[13] = H;
    else H = q[13];
    return H
}
// @from(Ln 483833, Col 4)
zz6
// @from(Ln 483834, Col 4)
KoK = L(() => {
    o6();
    g6();
    C7();
    bK();
    Nq();
    u7();
    xA();
    Kw();
    Xj7();
    zz6 = K6(P6(), 1)
})
// @from(Ln 483847, Col 0)
function Dj7(q) {
    if (!q) return "Agent type is required";
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/.test(q)) return "Agent type must start and end with alphanumeric characters and contain only letters, numbers, and hyphens";
    if (q.length < 3) return "Agent type must be at least 3 characters long";
    if (q.length > 50) return "Agent type must be less than 50 characters";
    return null
}
// @from(Ln 483855, Col 0)
function _oK(q, K, _) {
    let z = [],
        Y = [];
    if (!q.agentType) z.push("Agent type is required");
    else {
        let O = Dj7(q.agentType);
        if (O) z.push(O);
        let w = _.find(($) => $.agentType === q.agentType && $.source !== q.source);
        if (w) z.push(`Agent type "${q.agentType}" already exists in ${vo8(w.source)}`)
    }
    if (!q.whenToUse) z.push("Description (description) is required");
    else if (q.whenToUse.length < 10) Y.push("Description should be more descriptive (at least 10 characters)");
    else if (q.whenToUse.length > 5000) Y.push("Description is very long (over 5000 characters)");
    if (q.tools !== void 0 && !Array.isArray(q.tools)) z.push("Tools must be an array");
    else {
        if (q.tools === void 0) Y.push("Agent has access to all tools");
        else if (q.tools.length === 0) Y.push("No tools selected - agent will have very limited capabilities");
        let O = lt(q, K, !1);
        if (O.invalidTools.length > 0) z.push(`Invalid tools: ${O.invalidTools.join(", ")}`)
    }
    let A = q.getSystemPrompt();
    if (!A) z.push("System prompt is required");
    else if (A.length < 20) z.push("System prompt is too short (minimum 20 characters)");
    else if (A.length > 1e4) Y.push("System prompt is very long (over 10,000 characters)");
    return {
        isValid: z.length === 0,
        errors: z,
        warnings: Y
    }
}
// @from(Ln 483885, Col 4)
Zj7 = L(() => {
    k96();
    Wj7()
})
// @from(Ln 483890, Col 0)
function zoK(q) {
    let K = s(88),
        {
            tools: _,
            existingAgents: z,
            onSave: Y,
            onSaveAndEdit: A,
            error: O
        } = q,
        {
            goBack: w,
            wizardData: $
        } = QK(),
        j;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) j = {
        context: "Confirmation"
    }, K[0] = j;
    else j = K[0];
    G1("confirm:no", w, j);
    let H;
    if (K[1] !== Y || K[2] !== A) H = (A6) => {
        if (A6.key === "return") {
            A6.preventDefault(), Y();
            return
        }
        if (A6.ctrl || A6.meta) return;
        if (A6.key === "s") A6.preventDefault(), Y();
        else if (A6.key === "e") A6.preventDefault(), A()
    }, K[1] = Y, K[2] = A, K[3] = H;
    else H = K[3];
    let J = H,
        X = $.finalAgent,
        M, P, W, D, Z, G, f, v, V, k, N, R, h, C, x, B, m, S, F;
    if (K[4] !== X || K[5] !== z || K[6] !== J || K[7] !== _ || K[8] !== $.location) {
        let A6 = _oK(X, _, z),
            e;
        if (K[28] !== X) e = j4(X.getSystemPrompt(), 240), K[28] = X, K[29] = e;
        else e = K[29];
        let i = e,
            O6;
        if (K[30] !== X.whenToUse) O6 = j4(X.whenToUse, 240), K[30] = X.whenToUse, K[31] = O6;
        else O6 = K[31];
        let J6 = O6,
            $6 = ynY,
            H6;
        if (K[32] !== X.memory) H6 = x3() ? l_.default.createElement(T, null, l_.default.createElement(T, {
            bold: !0
        }, "Memory"), ": ", Do8(X.memory)) : null, K[32] = X.memory, K[33] = H6;
        else H6 = K[33];
        let q6 = H6;
        if (P = HK, N = "Confirm and save", K[34] === Symbol.for("react.memo_cache_sentinel")) R = l_.default.createElement(z1, null, l_.default.createElement(A8, {
            chord: ["s", "enter"],
            action: "save"
        }), l_.default.createElement(A8, {
            chord: "e",
            action: "edit in your editor"
        }), l_.default.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        })), K[34] = R;
        else R = K[34];
        M = u, h = "column", C = 0, x = !0, B = J;
        let o;
        if (K[35] === Symbol.for("react.memo_cache_sentinel")) o = l_.default.createElement(T, {
            bold: !0
        }, "Name"), K[35] = o;
        else o = K[35];
        if (K[36] !== X.agentType) m = l_.default.createElement(T, null, o, ": ", X.agentType), K[36] = X.agentType, K[37] = m;
        else m = K[37];
        let _6;
        if (K[38] === Symbol.for("react.memo_cache_sentinel")) _6 = l_.default.createElement(T, {
            bold: !0
        }, "Location"), K[38] = _6;
        else _6 = K[38];
        let r;
        if (K[39] !== X.agentType || K[40] !== $.location) r = prK({
            source: $.location,
            agentType: X.agentType
        }), K[39] = X.agentType, K[40] = $.location, K[41] = r;
        else r = K[41];
        if (K[42] !== r) S = l_.default.createElement(T, null, _6, ":", " ", r), K[42] = r, K[43] = S;
        else S = K[43];
        let t;
        if (K[44] === Symbol.for("react.memo_cache_sentinel")) t = l_.default.createElement(T, {
            bold: !0
        }, "Tools"), K[44] = t;
        else t = K[44];
        let Y6;
        if (K[45] !== X.tools) Y6 = $6(X.tools), K[45] = X.tools, K[46] = Y6;
        else Y6 = K[46];
        if (K[47] !== Y6) F = l_.default.createElement(T, null, t, ": ", Y6), K[47] = Y6, K[48] = F;
        else F = K[48];
        let X6;
        if (K[49] === Symbol.for("react.memo_cache_sentinel")) X6 = l_.default.createElement(T, {
            bold: !0
        }, "Model"), K[49] = X6;
        else X6 = K[49];
        let M6;
        if (K[50] !== X.model) M6 = _g8(X.model), K[50] = X.model, K[51] = M6;
        else M6 = K[51];
        if (K[52] !== M6) W = l_.default.createElement(T, null, X6, ": ", M6), K[52] = M6, K[53] = W;
        else W = K[53];
        if (D = q6, K[54] === Symbol.for("react.memo_cache_sentinel")) Z = l_.default.createElement(u, {
            marginTop: 1
        }, l_.default.createElement(T, null, l_.default.createElement(T, {
            bold: !0
        }, "Description"), " (tells Claude when to use this agent):")), K[54] = Z;
        else Z = K[54];
        if (K[55] !== J6) G = l_.default.createElement(u, {
            marginLeft: 2,
            marginTop: 1
        }, l_.default.createElement(T, null, J6)), K[55] = J6, K[56] = G;
        else G = K[56];
        if (K[57] === Symbol.for("react.memo_cache_sentinel")) f = l_.default.createElement(u, {
            marginTop: 1
        }, l_.default.createElement(T, null, l_.default.createElement(T, {
            bold: !0
        }, "System prompt"), ":")), K[57] = f;
        else f = K[57];
        if (K[58] !== i) v = l_.default.createElement(u, {
            marginLeft: 2,
            marginTop: 1
        }, l_.default.createElement(T, null, i)), K[58] = i, K[59] = v;
        else v = K[59];
        V = A6.warnings.length > 0 && l_.default.createElement(u, {
            marginTop: 1,
            flexDirection: "column"
        }, l_.default.createElement(T, {
            color: "warning"
        }, "Warnings:"), A6.warnings.map(EnY)), k = A6.errors.length > 0 && l_.default.createElement(u, {
            marginTop: 1,
            flexDirection: "column"
        }, l_.default.createElement(T, {
            color: "error"
        }, "Errors:"), A6.errors.map(NnY)), K[4] = X, K[5] = z, K[6] = J, K[7] = _, K[8] = $.location, K[9] = M, K[10] = P, K[11] = W, K[12] = D, K[13] = Z, K[14] = G, K[15] = f, K[16] = v, K[17] = V, K[18] = k, K[19] = N, K[20] = R, K[21] = h, K[22] = C, K[23] = x, K[24] = B, K[25] = m, K[26] = S, K[27] = F
    } else M = K[9], P = K[10], W = K[11], D = K[12], Z = K[13], G = K[14], f = K[15], v = K[16], V = K[17], k = K[18], N = K[19], R = K[20], h = K[21], C = K[22], x = K[23], B = K[24], m = K[25], S = K[26], F = K[27];
    let U;
    if (K[60] !== O) U = O && l_.default.createElement(u, {
        marginTop: 1
    }, l_.default.createElement(T, {
        color: "error"
    }, O)), K[60] = O, K[61] = U;
    else U = K[61];
    let g;
    if (K[62] === Symbol.for("react.memo_cache_sentinel")) g = l_.default.createElement(T, {
        bold: !0
    }, "s"), K[62] = g;
    else g = K[62];
    let c;
    if (K[63] === Symbol.for("react.memo_cache_sentinel")) c = l_.default.createElement(T, {
        bold: !0
    }, "Enter"), K[63] = c;
    else c = K[63];
    let n;
    if (K[64] === Symbol.for("react.memo_cache_sentinel")) n = l_.default.createElement(u, {
        marginTop: 2
    }, l_.default.createElement(T, {
        color: "success"
    }, "Press ", g, " or ", c, " to save,", " ", l_.default.createElement(T, {
        bold: !0
    }, "e"), " to save and edit")), K[64] = n;
    else n = K[64];
    let l;
    if (K[65] !== M || K[66] !== W || K[67] !== D || K[68] !== Z || K[69] !== G || K[70] !== f || K[71] !== v || K[72] !== V || K[73] !== k || K[74] !== U || K[75] !== h || K[76] !== C || K[77] !== x || K[78] !== B || K[79] !== m || K[80] !== S || K[81] !== F) l = l_.default.createElement(M, {
        flexDirection: h,
        tabIndex: C,
        autoFocus: x,
        onKeyDown: B
    }, m, S, F, W, D, Z, G, f, v, V, k, U, n), K[65] = M, K[66] = W, K[67] = D, K[68] = Z, K[69] = G, K[70] = f, K[71] = v, K[72] = V, K[73] = k, K[74] = U, K[75] = h, K[76] = C, K[77] = x, K[78] = B, K[79] = m, K[80] = S, K[81] = F, K[82] = l;
    else l = K[82];
    let z6;
    if (K[83] !== P || K[84] !== N || K[85] !== R || K[86] !== l) z6 = l_.default.createElement(P, {
        subtitle: N,
        footerText: R
    }, l), K[83] = P, K[84] = N, K[85] = R, K[86] = l, K[87] = z6;
    else z6 = K[87];
    return z6
}
// @from(Ln 484071, Col 0)
function NnY(q, K) {
    return l_.default.createElement(T, {
        key: K,
        color: "error"
    }, " ", "• ", q)
}
// @from(Ln 484078, Col 0)
function EnY(q, K) {
    return l_.default.createElement(T, {
        key: K,
        dimColor: !0
    }, " ", "• ", q)
}
// @from(Ln 484085, Col 0)
function ynY(q) {
    if (q === void 0) return "All tools";
    if (q.length === 0) return "None";
    if (q.length === 1) return q[0] || "None";
    if (q.length === 2) return q.join(" and ");
    return `${q.slice(0,-1).join(", ")}, and ${q.at(-1)}`
}
// @from(Ln 484092, Col 4)
l_
// @from(Ln 484093, Col 4)
YoK = L(() => {
    o6();
    g6();
    C7();
    VY();
    pp();
    c7();
    Z96();
    bK();
    Nq();
    u7();
    xA();
    Kw();
    Zu6();
    Zj7();
    l_ = K6(P6(), 1)
})
// @from(Ln 484111, Col 0)
function AoK({
    tools: q,
    existingAgents: K,
    onComplete: _
}) {
    let {
        wizardData: z
    } = QK(), [Y, A] = Yz6.useState(null), O = R7(), w = Yz6.useCallback(async (H) => {
        if (!z?.finalAgent) return;
        try {
            if (await grK(z.location, z.finalAgent.agentType, z.finalAgent.whenToUse, z.finalAgent.tools, z.finalAgent.getSystemPrompt(), !0, z.finalAgent.color, z.finalAgent.model, z.finalAgent.memory), O((X) => {
                    if (!z.finalAgent) return X;
                    let M = X.agentDefinitions.allAgents.concat(z.finalAgent);
                    return {
                        ...X,
                        agentDefinitions: {
                            ...X.agentDefinitions,
                            activeAgents: zT(M),
                            allAgents: M
                        }
                    }
                }), H) {
                let X = Jj7({
                    source: z.location,
                    agentType: z.finalAgent.agentType
                });
                await xS(X)
            }
            d("tengu_agent_created", {
                agent_type: z.finalAgent.agentType,
                generation_method: z.wasGenerated ? "generated" : "manual",
                source: z.location,
                tool_count: z.finalAgent.tools?.length ?? "all",
                has_custom_model: !!z.finalAgent.model,
                has_custom_color: !!z.finalAgent.color,
                has_memory: !!z.finalAgent.memory,
                memory_scope: z.finalAgent.memory ?? "none",
                ...H ? {
                    opened_in_editor: !0
                } : {}
            });
            let J = H ? `Created agent: ${Y8.bold(z.finalAgent.agentType)} and opened in editor. If you made edits, restart to load the latest version.` : `Created agent: ${Y8.bold(z.finalAgent.agentType)}`;
            _(J)
        } catch (J) {
            A(J instanceof Error ? J.message : "Failed to save agent")
        }
    }, [z, _, O]), $ = Yz6.useCallback(() => w(!1), [w]), j = Yz6.useCallback(() => w(!0), [w]);
    return Yz6.default.createElement(zoK, {
        tools: q,
        existingAgents: K,
        onSave: $,
        onSaveAndEdit: j,
        error: Y
    })
}
// @from(Ln 484166, Col 4)
Yz6
// @from(Ln 484167, Col 4)
OoK = L(() => {
    Y3();
    C8();
    N7();
    cP();
    uS();
    xA();
    Zu6();
    YoK();
    Yz6 = K6(P6(), 1)
})
// @from(Ln 484179, Col 0)
function woK() {
    let q = s(18),
        {
            goNext: K,
            goBack: _,
            updateWizardData: z,
            wizardData: Y
        } = QK(),
        [A, O] = hG.useState(Y.whenToUse || ""),
        [w, $] = hG.useState(A.length),
        [j, H] = hG.useState(null),
        J;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Settings"
    }, q[0] = J;
    else J = q[0];
    G1("confirm:no", _, J);
    let X;
    if (q[1] !== A) X = async () => {
        let k = await ML(A);
        if (k.content !== null) O(k.content), $(k.content.length)
    }, q[1] = A, q[2] = X;
    else X = q[2];
    let M = X,
        P;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) P = {
        context: "Chat"
    }, q[3] = P;
    else P = q[3];
    G1("chat:externalEditor", M, P);
    let W;
    if (q[4] !== K || q[5] !== z) W = (k) => {
        let N = k.trim();
        if (!N) {
            H("Description is required");
            return
        }
        H(null), z({
            whenToUse: N
        }), K()
    }, q[4] = K, q[5] = z, q[6] = W;
    else W = q[6];
    let D = W,
        Z;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) Z = hG.default.createElement(z1, null, hG.default.createElement(T, null, "Type to enter text"), hG.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    }), hG.default.createElement(v1, {
        action: "chat:externalEditor",
        context: "Chat",
        fallback: "ctrl+g",
        description: "open in editor"
    }), hG.default.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), q[7] = Z;
    else Z = q[7];
    let G;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) G = hG.default.createElement(T, null, "When should Claude use this agent?"), q[8] = G;
    else G = q[8];
    let f;
    if (q[9] !== w || q[10] !== D || q[11] !== A) f = hG.default.createElement(u, {
        marginTop: 1
    }, hG.default.createElement(l4, {
        value: A,
        onChange: O,
        onSubmit: D,
        placeholder: "e.g., use this agent after you're done writing code...",
        columns: 80,
        cursorOffset: w,
        onChangeCursorOffset: $,
        focus: !0,
        showCursor: !0
    })), q[9] = w, q[10] = D, q[11] = A, q[12] = f;
    else f = q[12];
    let v;
    if (q[13] !== j) v = j && hG.default.createElement(u, {
        marginTop: 1
    }, hG.default.createElement(T, {
        color: "error"
    }, j)), q[13] = j, q[14] = v;
    else v = q[14];
    let V;
    if (q[15] !== f || q[16] !== v) V = hG.default.createElement(HK, {
        subtitle: "Description (tell Claude when to use this agent)",
        footerText: Z
    }, hG.default.createElement(u, {
        flexDirection: "column"
    }, G, f, v)), q[15] = f, q[16] = v, q[17] = V;
    else V = q[17];
    return V
}
// @from(Ln 484273, Col 4)
hG
// @from(Ln 484274, Col 4)
$oK = L(() => {
    o6();
    g6();
    C7();
    uS();
    bK();
    Nq();
    u7();
    NY();
    xA();
    Kw();
    hG = K6(P6(), 1)
})
// @from(Ln 484287, Col 0)
async function HoK(q, K, _, z) {
    let Y = _.length > 0 ? `

IMPORTANT: The following identifiers already exist and must NOT be used: ${_.join(", ")}` : "",
        A = `Create an agent configuration based on this request: "${q}".${Y}
  Return ONLY the JSON object, no other text.`,
        O = t8({
            content: A
        }),
        w = await $2(),
        $ = Ac8([O], w),
        j = x3() ? joK + LnY : joK,
        X = (await JW6({
            messages: K0($),
            systemPrompt: sK([j]),
            thinkingConfig: {
                type: "disabled"
            },
            tools: [],
            signal: z,
            options: {
                getToolPermissionContext: async () => MD(),
                model: K,
                toolChoice: void 0,
                agents: [],
                isNonInteractiveSession: !1,
                hasAppendSystemPrompt: !1,
                querySource: "agent_creation",
                mcpTools: []
            }
        })).message.content.filter((P) => P.type === "text").map((P) => P.text).join(`
`),
        M;
    try {
        M = n8(X.trim())
    } catch {
        let P = X.match(/\{[\s\S]*\}/);
        if (!P) throw Error("No JSON object found in response");
        M = n8(P[0])
    }
    if (!M.identifier || !M.whenToUse || !M.systemPrompt) throw Error("Invalid agent configuration generated");
    return d("tengu_agent_definition_generated", {
        agent_identifier: M.identifier
    }), {
        identifier: M.identifier,
        whenToUse: M.whenToUse,
        systemPrompt: M.systemPrompt
    }
}
// @from(Ln 484336, Col 4)
joK
// @from(Ln 484336, Col 9)
LnY = `

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
// @from(Ln 484357, Col 4)
JoK = L(() => {
    hk();
    O2();
    gq();
    sY();
    cM6();
    _7();
    VY();
    C8();
    e8();
    joK = `You are an elite AI agent architect specializing in crafting high-performance agent configurations. Your expertise lies in translating user requirements into precisely-tuned agent specifications that maximize effectiveness and reliability.

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
      Since a significant piece of code was written, use the ${T4} tool to launch the test-runner agent to run the tests.
      </commentary>
      assistant: "Now let me use the test-runner agent to run the tests"
    </example>
    - <example>
      Context: User is creating an agent to respond to the word "hello" with a friendly jok.
      user: "Hello"
      assistant: "I'm going to use the ${T4} tool to launch the greeting-responder agent to respond with a friendly joke"
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
// @from(Ln 484441, Col 0)
function XoK() {
    let {
        updateWizardData: q,
        goBack: K,
        goToStep: _,
        wizardData: z
    } = QK(), [Y, A] = i$.useState(z.generationPrompt || ""), [O, w] = i$.useState(!1), [$, j] = i$.useState(null), [H, J] = i$.useState(Y.length), X = s2(), M = i$.useRef(null), P = i$.useCallback(() => {
        if (M.current) M.current.abort(), M.current = null, w(!1), j("Generation cancelled")
    }, []);
    G1("confirm:no", P, {
        context: "Settings",
        isActive: O
    });
    let W = i$.useCallback(async () => {
        let f = await ML(Y);
        if (f.content !== null) A(f.content), J(f.content.length)
    }, [Y]);
    G1("chat:externalEditor", W, {
        context: "Chat",
        isActive: !O
    });
    let D = i$.useCallback(() => {
        q({
            generationPrompt: "",
            agentType: "",
            systemPrompt: "",
            whenToUse: "",
            generatedAgent: void 0,
            wasGenerated: !1
        }), A(""), j(null), K()
    }, [q, K]);
    G1("confirm:no", D, {
        context: "Settings",
        isActive: !O
    });
    let Z = async () => {
        let f = Y.trim();
        if (!f) {
            j("Please describe what the agent should do");
            return
        }
        j(null), w(!0), q({
            generationPrompt: f,
            isGenerating: !0
        });
        let v = F5();
        M.current = v;
        try {
            let V = await HoK(f, X, [], v.signal);
            q({
                agentType: V.identifier,
                whenToUse: V.whenToUse,
                systemPrompt: V.systemPrompt,
                generatedAgent: V,
                isGenerating: !1,
                wasGenerated: !0
            }), _(6)
        } catch (V) {
            if (V instanceof r_);
            else if (V instanceof Error && !V.message.includes("No assistant message found")) j(V.message || "Failed to generate agent");
            q({
                isGenerating: !1
            })
        } finally {
            w(!1), M.current = null
        }
    }, G = "Describe what this agent should do and when it should be used (be comprehensive for best results)";
    if (O) return i$.default.createElement(HK, {
        subtitle: G,
        footerText: i$.default.createElement(v1, {
            action: "confirm:no",
            context: "Settings",
            fallback: "Esc",
            description: "cancel"
        })
    }, i$.default.createElement(u, {
        flexDirection: "row",
        alignItems: "center"
    }, i$.default.createElement(Y5, null), i$.default.createElement(T, {
        color: "suggestion"
    }, " Generating agent from description...")));
    return i$.default.createElement(HK, {
        subtitle: G,
        footerText: i$.default.createElement(z1, null, i$.default.createElement(v1, {
            action: "confirm:yes",
            context: "Confirmation",
            fallback: "Enter",
            description: "submit"
        }), i$.default.createElement(v1, {
            action: "chat:externalEditor",
            context: "Chat",
            fallback: "ctrl+g",
            description: "open in editor"
        }), i$.default.createElement(v1, {
            action: "confirm:no",
            context: "Settings",
            fallback: "Esc",
            description: "go back"
        }))
    }, i$.default.createElement(u, {
        flexDirection: "column"
    }, $ && i$.default.createElement(u, {
        marginBottom: 1
    }, i$.default.createElement(T, {
        color: "error"
    }, $)), i$.default.createElement(l4, {
        value: Y,
        onChange: A,
        onSubmit: Z,
        placeholder: "e.g., Help me write unit tests for my code...",
        columns: 80,
        cursorOffset: H,
        onChangeCursorOffset: J,
        focus: !0,
        showCursor: !0
    })))
}
// @from(Ln 484558, Col 4)
i$
// @from(Ln 484559, Col 4)
MoK = L(() => {
    eG();
    oy();
    g6();
    C7();
    x$();
    uS();
    bK();
    Nq();
    Ej();
    NY();
    xA();
    Kw();
    JoK();
    i$ = K6(P6(), 1)
})
// @from(Ln 484576, Col 0)
function PoK() {
    let q = s(11),
        {
            goNext: K,
            updateWizardData: _,
            cancel: z
        } = QK(),
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = {
        label: "Project (.claude/agents/)",
        value: "projectSettings"
    }, q[0] = Y;
    else Y = q[0];
    let A;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) A = [Y, {
        label: "Personal (~/.claude/agents/)",
        value: "userSettings"
    }], q[1] = A;
    else A = q[1];
    let O = A,
        w;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) w = Az6.default.createElement(z1, null, Az6.default.createElement(A8, {
        chord: ["up", "down"],
        format: {
            arrowSep: ""
        },
        action: "navigate"
    }), Az6.default.createElement(A8, {
        chord: "enter",
        action: "select"
    }), Az6.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })), q[2] = w;
    else w = q[2];
    let $;
    if (q[3] !== K || q[4] !== _) $ = (J) => {
        _({
            location: J
        }), K()
    }, q[3] = K, q[4] = _, q[5] = $;
    else $ = q[5];
    let j;
    if (q[6] !== z) j = () => z(), q[6] = z, q[7] = j;
    else j = q[7];
    let H;
    if (q[8] !== $ || q[9] !== j) H = Az6.default.createElement(HK, {
        subtitle: "Choose location",
        footerText: w
    }, Az6.default.createElement(u, null, Az6.default.createElement(A1, {
        key: "location-select",
        options: O,
        onChange: $,
        onCancel: j
    }))), q[8] = $, q[9] = j, q[10] = H;
    else H = q[10];
    return H
}
// @from(Ln 484636, Col 4)
Az6
// @from(Ln 484637, Col 4)
WoK = L(() => {
    o6();
    g6();
    bK();
    gK();
    Nq();
    u7();
    xA();
    Kw();
    Az6 = K6(P6(), 1)
})
// @from(Ln 484649, Col 0)
function DoK() {
    let q = s(13),
        {
            goNext: K,
            goBack: _,
            updateWizardData: z,
            wizardData: Y
        } = QK(),
        A;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) A = {
        context: "Confirmation"
    }, q[0] = A;
    else A = q[0];
    G1("confirm:no", _, A);
    let O = Y.location === "userSettings",
        w;
    if (q[1] !== O) w = O ? [{
        label: "User scope (~/.claude/agent-memory/) (Recommended)",
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
        label: "Project scope (.claude/agent-memory/) (Recommended)",
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
    }], q[1] = O, q[2] = w;
    else w = q[2];
    let $ = w,
        j;
    if (q[3] !== K || q[4] !== z || q[5] !== Y.finalAgent || q[6] !== Y.systemPrompt) j = (M) => {
        let P = M === "none" ? void 0 : M,
            W = Y.finalAgent?.agentType;
        z({
            selectedMemory: P,
            finalAgent: Y.finalAgent ? {
                ...Y.finalAgent,
                memory: P,
                getSystemPrompt: x3() && P && W ? () => Y.systemPrompt + `

` + mH6(W, P) : () => Y.systemPrompt
            } : void 0
        }), K()
    }, q[3] = K, q[4] = z, q[5] = Y.finalAgent, q[6] = Y.systemPrompt, q[7] = j;
    else j = q[7];
    let H = j,
        J;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) J = Oz6.default.createElement(z1, null, Oz6.default.createElement(A8, {
        chord: ["up", "down"],
        format: {
            arrowSep: ""
        },
        action: "navigate"
    }), Oz6.default.createElement(A8, {
        chord: "enter",
        action: "select"
    }), Oz6.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })), q[8] = J;
    else J = q[8];
    let X;
    if (q[9] !== _ || q[10] !== H || q[11] !== $) X = Oz6.default.createElement(HK, {
        subtitle: "Configure agent memory",
        footerText: J
    }, Oz6.default.createElement(u, null, Oz6.default.createElement(A1, {
        key: "memory-select",
        options: $,
        onChange: H,
        onCancel: _
    }))), q[9] = _, q[10] = H, q[11] = $, q[12] = X;
    else X = q[12];
    return X
}
// @from(Ln 484739, Col 4)
Oz6
// @from(Ln 484740, Col 4)
ZoK = L(() => {
    o6();
    g6();
    C7();
    VY();
    pp();
    bK();
    gK();
    Nq();
    u7();
    xA();
    Kw();
    Oz6 = K6(P6(), 1)
})
// @from(Ln 484755, Col 0)
function foK() {
    let q = s(11),
        {
            goNext: K,
            goBack: _,
            updateWizardData: z,
            goToStep: Y
        } = QK(),
        A;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) A = [{
        label: "Generate with Claude (recommended)",
        value: "generate"
    }, {
        label: "Manual configuration",
        value: "manual"
    }], q[0] = A;
    else A = q[0];
    let O = A,
        w;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) w = wz6.default.createElement(z1, null, wz6.default.createElement(A8, {
        chord: ["up", "down"],
        format: {
            arrowSep: ""
        },
        action: "navigate"
    }), wz6.default.createElement(A8, {
        chord: "enter",
        action: "select"
    }), wz6.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })), q[1] = w;
    else w = q[1];
    let $;
    if (q[2] !== K || q[3] !== Y || q[4] !== z) $ = (J) => {
        let X = J;
        if (z({
                method: X,
                wasGenerated: X === "generate"
            }), X === "generate") K();
        else Y(3)
    }, q[2] = K, q[3] = Y, q[4] = z, q[5] = $;
    else $ = q[5];
    let j;
    if (q[6] !== _) j = () => _(), q[6] = _, q[7] = j;
    else j = q[7];
    let H;
    if (q[8] !== $ || q[9] !== j) H = wz6.default.createElement(HK, {
        subtitle: "Creation method",
        footerText: w
    }, wz6.default.createElement(u, null, wz6.default.createElement(A1, {
        key: "method-select",
        options: O,
        onChange: $,
        onCancel: j
    }))), q[8] = $, q[9] = j, q[10] = H;
    else H = q[10];
    return H
}
// @from(Ln 484816, Col 4)
wz6
// @from(Ln 484817, Col 4)
GoK = L(() => {
    o6();
    g6();
    bK();
    gK();
    Nq();
    u7();
    xA();
    Kw();
    wz6 = K6(P6(), 1)
})
// @from(Ln 484829, Col 0)
function voK() {
    let q = s(8),
        {
            goNext: K,
            goBack: _,
            updateWizardData: z,
            wizardData: Y
        } = QK(),
        A;
    if (q[0] !== K || q[1] !== z) A = (j) => {
        z({
            selectedModel: j
        }), K()
    }, q[0] = K, q[1] = z, q[2] = A;
    else A = q[2];
    let O = A,
        w;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) w = XW6.default.createElement(z1, null, XW6.default.createElement(A8, {
        chord: ["up", "down"],
        format: {
            arrowSep: ""
        },
        action: "navigate"
    }), XW6.default.createElement(A8, {
        chord: "enter",
        action: "select"
    }), XW6.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })), q[3] = w;
    else w = q[3];
    let $;
    if (q[4] !== _ || q[5] !== O || q[6] !== Y.selectedModel) $ = XW6.default.createElement(HK, {
        subtitle: "Select model",
        footerText: w
    }, XW6.default.createElement(fo8, {
        initialModel: Y.selectedModel,
        onComplete: O,
        onCancel: _
    })), q[4] = _, q[5] = O, q[6] = Y.selectedModel, q[7] = $;
    else $ = q[7];
    return $
}
// @from(Ln 484874, Col 4)
XW6
// @from(Ln 484875, Col 4)
ToK = L(() => {
    o6();
    bK();
    Nq();
    u7();
    xA();
    Kw();
    Mj7();
    XW6 = K6(P6(), 1)
})
// @from(Ln 484886, Col 0)
function VoK() {
    let q = s(20),
        {
            goNext: K,
            goBack: _,
            updateWizardData: z,
            wizardData: Y
        } = QK(),
        [A, O] = PZ.useState(Y.systemPrompt || ""),
        [w, $] = PZ.useState(A.length),
        [j, H] = PZ.useState(null),
        J;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Settings"
    }, q[0] = J;
    else J = q[0];
    G1("confirm:no", _, J);
    let X;
    if (q[1] !== A) X = async () => {
        let N = await ML(A);
        if (N.content !== null) O(N.content), $(N.content.length)
    }, q[1] = A, q[2] = X;
    else X = q[2];
    let M = X,
        P;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) P = {
        context: "Chat"
    }, q[3] = P;
    else P = q[3];
    G1("chat:externalEditor", M, P);
    let W;
    if (q[4] !== K || q[5] !== A || q[6] !== z) W = () => {
        let N = A.trim();
        if (!N) {
            H("System prompt is required");
            return
        }
        H(null), z({
            systemPrompt: N
        }), K()
    }, q[4] = K, q[5] = A, q[6] = z, q[7] = W;
    else W = q[7];
    let D = W,
        Z;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) Z = PZ.default.createElement(z1, null, PZ.default.createElement(T, null, "Type to enter text"), PZ.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    }), PZ.default.createElement(v1, {
        action: "chat:externalEditor",
        context: "Chat",
        fallback: "ctrl+g",
        description: "open in editor"
    }), PZ.default.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), q[8] = Z;
    else Z = q[8];
    let G, f;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) G = PZ.default.createElement(T, null, "Enter the system prompt for your agent:"), f = PZ.default.createElement(T, {
        dimColor: !0
    }, "Be comprehensive for best results"), q[9] = G, q[10] = f;
    else G = q[9], f = q[10];
    let v;
    if (q[11] !== w || q[12] !== D || q[13] !== A) v = PZ.default.createElement(u, {
        marginTop: 1
    }, PZ.default.createElement(l4, {
        value: A,
        onChange: O,
        onSubmit: D,
        placeholder: "You are a helpful code reviewer who...",
        columns: 80,
        cursorOffset: w,
        onChangeCursorOffset: $,
        focus: !0,
        showCursor: !0
    })), q[11] = w, q[12] = D, q[13] = A, q[14] = v;
    else v = q[14];
    let V;
    if (q[15] !== j) V = j && PZ.default.createElement(u, {
        marginTop: 1
    }, PZ.default.createElement(T, {
        color: "error"
    }, j)), q[15] = j, q[16] = V;
    else V = q[16];
    let k;
    if (q[17] !== v || q[18] !== V) k = PZ.default.createElement(HK, {
        subtitle: "System prompt",
        footerText: Z
    }, PZ.default.createElement(u, {
        flexDirection: "column"
    }, G, f, v, V)), q[17] = v, q[18] = V, q[19] = k;
    else k = q[19];
    return k
}
// @from(Ln 484982, Col 4)
PZ
// @from(Ln 484983, Col 4)
koK = L(() => {
    o6();
    g6();
    C7();
    uS();
    bK();
    Nq();
    u7();
    NY();
    xA();
    Kw();
    PZ = K6(P6(), 1)
})
// @from(Ln 484997, Col 0)
function NoK(q) {
    let K = s(10),
        {
            tools: _
        } = q,
        {
            goNext: z,
            goBack: Y,
            updateWizardData: A,
            wizardData: O
        } = QK(),
        w;
    if (K[0] !== z || K[1] !== A) w = (M) => {
        A({
            selectedTools: M
        }), z()
    }, K[0] = z, K[1] = A, K[2] = w;
    else w = K[2];
    let $ = w,
        j = O.selectedTools,
        H;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) H = MW6.default.createElement(A8, {
        chord: "enter",
        action: "toggle selection"
    }), K[3] = H;
    else H = K[3];
    let J;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) J = MW6.default.createElement(z1, null, H, MW6.default.createElement(A8, {
        chord: ["up", "down"],
        format: {
            arrowSep: ""
        },
        action: "navigate"
    }), MW6.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })), K[4] = J;
    else J = K[4];
    let X;
    if (K[5] !== Y || K[6] !== $ || K[7] !== j || K[8] !== _) X = MW6.default.createElement(HK, {
        subtitle: "Select tools",
        footerText: J
    }, MW6.default.createElement(Go8, {
        tools: _,
        initialTools: j,
        onComplete: $,
        onCancel: Y
    })), K[5] = Y, K[6] = $, K[7] = j, K[8] = _, K[9] = X;
    else X = K[9];
    return X
}
// @from(Ln 485050, Col 4)
MW6
// @from(Ln 485051, Col 4)
EoK = L(() => {
    o6();
    bK();
    Nq();
    u7();
    xA();
    Kw();
    Pj7();
    MW6 = K6(P6(), 1)
})
// @from(Ln 485062, Col 0)
function yoK(q) {
    let K = s(15),
        {
            goNext: _,
            goBack: z,
            updateWizardData: Y,
            wizardData: A
        } = QK(),
        [O, w] = dT.useState(A.agentType || ""),
        [$, j] = dT.useState(null),
        [H, J] = dT.useState(O.length),
        X;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) X = {
        context: "Settings"
    }, K[0] = X;
    else X = K[0];
    G1("confirm:no", z, X);
    let M;
    if (K[1] !== _ || K[2] !== Y) M = (v) => {
        let V = v.trim(),
            k = Dj7(V);
        if (k) {
            j(k);
            return
        }
        j(null), Y({
            agentType: V
        }), _()
    }, K[1] = _, K[2] = Y, K[3] = M;
    else M = K[3];
    let P = M,
        W;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) W = dT.default.createElement(z1, null, dT.default.createElement(T, null, "Type to enter text"), dT.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    }), dT.default.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), K[4] = W;
    else W = K[4];
    let D;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) D = dT.default.createElement(T, null, "Enter a unique identifier for your agent:"), K[5] = D;
    else D = K[5];
    let Z;
    if (K[6] !== O || K[7] !== H || K[8] !== P) Z = dT.default.createElement(u, {
        marginTop: 1
    }, dT.default.createElement(l4, {
        value: O,
        onChange: w,
        onSubmit: P,
        placeholder: "e.g., test-runner, tech-lead, etc",
        columns: 60,
        cursorOffset: H,
        onChangeCursorOffset: J,
        focus: !0,
        showCursor: !0
    })), K[6] = O, K[7] = H, K[8] = P, K[9] = Z;
    else Z = K[9];
    let G;
    if (K[10] !== $) G = $ && dT.default.createElement(u, {
        marginTop: 1
    }, dT.default.createElement(T, {
        color: "error"
    }, $)), K[10] = $, K[11] = G;
    else G = K[11];
    let f;
    if (K[12] !== Z || K[13] !== G) f = dT.default.createElement(HK, {
        subtitle: "Agent type (identifier)",
        footerText: W
    }, dT.default.createElement(u, {
        flexDirection: "column"
    }, D, Z, G)), K[12] = Z, K[13] = G, K[14] = f;
    else f = K[14];
    return f
}
// @from(Ln 485139, Col 4)
dT
// @from(Ln 485140, Col 4)
LoK = L(() => {
    o6();
    g6();
    C7();
    bK();
    Nq();
    u7();
    NY();
    xA();
    Kw();
    Zj7();
    dT = K6(P6(), 1)
})
// @from(Ln 485154, Col 0)
function hoK(q) {
    let K = s(17),
        {
            tools: _,
            existingAgents: z,
            onComplete: Y,
            onCancel: A
        } = q,
        O;
    if (K[0] !== z) O = () => e_8.default.createElement(yoK, {
        existingAgents: z
    }), K[0] = z, K[1] = O;
    else O = K[1];
    let w;
    if (K[2] !== _) w = () => e_8.default.createElement(NoK, {
        tools: _
    }), K[2] = _, K[3] = w;
    else w = K[3];
    let $;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) $ = x3() ? [DoK] : [], K[4] = $;
    else $ = K[4];
    let j;
    if (K[5] !== z || K[6] !== Y || K[7] !== _) j = () => e_8.default.createElement(AoK, {
        tools: _,
        existingAgents: z,
        onComplete: Y
    }), K[5] = z, K[6] = Y, K[7] = _, K[8] = j;
    else j = K[8];
    let H;
    if (K[9] !== O || K[10] !== w || K[11] !== j) H = [PoK, foK, XoK, O, VoK, woK, w, voK, qoK, ...$, j], K[9] = O, K[10] = w, K[11] = j, K[12] = H;
    else H = K[12];
    let J = H,
        X;
    if (K[13] === Symbol.for("react.memo_cache_sentinel")) X = {}, K[13] = X;
    else X = K[13];
    let M;
    if (K[14] !== A || K[15] !== J) M = e_8.default.createElement(LX6, {
        steps: J,
        initialData: X,
        onComplete: hnY,
        onCancel: A,
        title: "Create new agent",
        showStepCounter: !1
    }), K[14] = A, K[15] = J, K[16] = M;
    else M = K[16];
    return M
}
// @from(Ln 485202, Col 0)
function hnY() {}
// @from(Ln 485203, Col 4)
e_8
// @from(Ln 485204, Col 4)
RoK = L(() => {
    o6();
    VY();
    xA();
    KoK();
    OoK();
    $oK();
    MoK();
    WoK();
    ZoK();
    GoK();
    ToK();
    koK();
    EoK();
    LoK();
    e_8 = K6(P6(), 1)
})
// @from(Ln 485222, Col 0)
function RnY(q) {
    return q.type === "local_agent" && q.agentType !== "main-session" && q.status !== "completed" && q.status !== "failed" && q.status !== "killed"
}
// @from(Ln 485226, Col 0)
function SnY(q) {
    return q.type === "local_agent" && q.agentType !== "main-session" && (q.status === "completed" || q.status === "failed" || q.status === "killed")
}
// @from(Ln 485230, Col 0)
function CnY(q) {
    let K = q.result?.content?.[0]?.text ?? q.error ?? q.description;
    return j4(oY(K), 60)
}
// @from(Ln 485235, Col 0)
function SoK(q) {
    let K = s(49),
        {
            onExit: _
        } = q,
        z = M8(BnY),
        Y = M8(mnY),
        A = R7(),
        {
            headerFocused: O,
            focusHeader: w
        } = uX(),
        [$, j] = vu6.useState(),
        [, H] = vu6.useState(0),
        J;
    if (K[0] !== Y) {
        J = new Map;
        for (let [n, l] of Y) J.set(l, n);
        K[0] = Y, K[1] = J
    } else J = K[1];
    let X = J,
        M;
    if (K[2] !== z) M = Object.values(z).filter(RnY).sort(unY), K[2] = z, K[3] = M;
    else M = K[3];
    let P = M,
        W;
    if (K[4] !== z) W = Object.values(z).filter(SnY).sort(xnY).slice(0, 5), K[4] = z, K[5] = W;
    else W = K[5];
    let D = W,
        Z;
    if (K[6] !== D || K[7] !== P) Z = [...P, ...D], K[6] = D, K[7] = P, K[8] = Z;
    else Z = K[8];
    let G = Z,
        f;
    if (K[9] !== P.length || K[10] !== H) f = () => {
        if (P.length === 0) return;
        let n = setInterval(bnY, 1000, H);
        return () => clearInterval(n)
    }, K[9] = P.length, K[10] = H, K[11] = f;
    else f = K[11];
    let v;
    if (K[12] !== P.length) v = [P.length], K[12] = P.length, K[13] = v;
    else v = K[13];
    vu6.useEffect(f, v);
    let V = G.findIndex((n) => n.id === $),
        k = V >= 0 ? G[V] : $ === void 0 ? G[0] : void 0,
        N, R;
    if (K[14] !== k || K[15] !== $) N = () => {
        if (k && k.id !== $) j(k.id)
    }, R = [k, $], K[14] = k, K[15] = $, K[16] = N, K[17] = R;
    else N = K[16], R = K[17];
    vu6.useEffect(N, R);
    let h;
    if (K[18] !== G || K[19] !== w || K[20] !== O || K[21] !== _ || K[22] !== k || K[23] !== $ || K[24] !== V || K[25] !== A) h = (n) => {
        if (O) return;
        if ($ !== void 0 && V < 0) {
            if (n.key === "up" || n.key === "down") n.preventDefault(), j(G[0]?.id);
            return
        }
        let l = V < 0 ? 0 : V;
        if (n.key === "up") {
            if (n.preventDefault(), l === 0 || G.length === 0) w();
            else j(G[l - 1]?.id);
            return
        }
        if (n.key === "down") {
            n.preventDefault(), j(G[Math.min(l + 1, G.length - 1)]?.id);
            return
        }
        if (!k) return;
        if (n.key === "return") {
            n.preventDefault(), VG(k.id, A), _();
            return
        }
        if (n.key === "x" && k.status === "running") n.preventDefault(), k.abortController?.abort()
    }, K[18] = G, K[19] = w, K[20] = O, K[21] = _, K[22] = k, K[23] = $, K[24] = V, K[25] = A, K[26] = h;
    else h = K[26];
    let C = h,
        x;
    if (K[27] !== O || K[28] !== X || K[29] !== k?.id) x = (n) => {
        let l = n.id === k?.id && !O,
            z6 = X.get(n.id),
            A6 = j4(n.progress?.summary || n.description, 50),
            e = C5(Math.max(0, Date.now() - n.startTime - (n.totalPausedMs ?? 0))),
            i = n.progress?.tokenCount;
        return P_.createElement(u, {
            key: n.id
        }, P_.createElement(T, {
            color: l ? "suggestion" : void 0
        }, l ? `${e6.pointer} ` : "  ", P_.createElement(T, {
            color: "success"
        }, qg7), " ", P_.createElement(T, {
            bold: !0
        }, z6 || n.agentType), z6 && P_.createElement(T, {
            dimColor: !0
        }, " · ", n.agentType), P_.createElement(T, {
            dimColor: !0
        }, " · ", A6), P_.createElement(T, {
            dimColor: !0
        }, " · ", e), i !== void 0 && i > 0 && P_.createElement(T, {
            dimColor: !0
        }, " · ", iK(i), " tokens"), l && P_.createElement(T, {
            dimColor: !0
        }, " · x to stop")))
    }, K[27] = O, K[28] = X, K[29] = k?.id, K[30] = x;
    else x = K[30];
    let B = x,
        m;
    if (K[31] !== O || K[32] !== X || K[33] !== k?.id) m = (n) => {
        let l = n.id === k?.id && !O,
            z6 = X.get(n.id);
        return P_.createElement(u, {
            key: n.id
        }, P_.createElement(T, {
            color: l ? "suggestion" : void 0,
            dimColor: !l
        }, l ? `${e6.pointer} ` : "  ", P_.createElement(D4, {
            status: n.status === "completed" ? "success" : "error",
            withSpace: !0
        }), P_.createElement(T, {
            bold: !0
        }, z6 || n.agentType), P_.createElement(T, {
            dimColor: !0
        }, " · ", CnY(n))))
    }, K[31] = O, K[32] = X, K[33] = k?.id, K[34] = m;
    else m = K[34];
    let S = m,
        F;
    if (K[35] !== G.length) F = G.length === 0 && P_.createElement(T, {
        dimColor: !0
    }, "No subagents are currently running."), K[35] = G.length, K[36] = F;
    else F = K[36];
    let U;
    if (K[37] !== B || K[38] !== P) U = P.map(B), K[37] = B, K[38] = P, K[39] = U;
    else U = K[39];
    let g;
    if (K[40] !== D || K[41] !== S || K[42] !== P.length) g = D.length > 0 && P_.createElement(P_.Fragment, null, P_.createElement(u, {
        marginTop: P.length > 0 ? 1 : 0
    }, P_.createElement(T, {
        bold: !0,
        dimColor: !0
    }, "Recently completed")), D.map(S)), K[40] = D, K[41] = S, K[42] = P.length, K[43] = g;
    else g = K[43];
    let c;
    if (K[44] !== C || K[45] !== F || K[46] !== U || K[47] !== g) c = P_.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: C
    }, F, U, g), K[44] = C, K[45] = F, K[46] = U, K[47] = g, K[48] = c;
    else c = K[48];
    return c
}
// @from(Ln 485389, Col 0)
function bnY(q) {
    return q(InY)
}
// @from(Ln 485393, Col 0)
function InY(q) {
    return q + 1
}
// @from(Ln 485397, Col 0)
function xnY(q, K) {
    return (K.endTime ?? 0) - (q.endTime ?? 0)
}
// @from(Ln 485401, Col 0)
function unY(q, K) {
    return q.startTime - K.startTime
}
// @from(Ln 485405, Col 0)
function mnY(q) {
    return q.agentNameRegistry
}
// @from(Ln 485409, Col 0)
function BnY(q) {
    return q.tasks
}
// @from(Ln 485412, Col 4)
P_
// @from(Ln 485412, Col 8)
vu6
// @from(Ln 485413, Col 4)
CoK = L(() => {
    o6();
    Qq();
    A3();
    g6();
    N7();
    Ru();
    c7();
    U86();
    Y2();
    BT();
    P_ = K6(P6(), 1), vu6 = K6(P6(), 1)
})
// @from(Ln 485427, Col 0)
function fj7(q) {
    switch (q.type) {
        case "local_agent":
            return q.agentType !== "main-session";
        case "in_process_teammate":
        case "local_workflow":
        case "remote_agent":
            return !0;
        default:
            return !1
    }
}
// @from(Ln 485439, Col 4)
pnY
// @from(Ln 485439, Col 9)
Gj7
// @from(Ln 485440, Col 4)
boK = L(() => {
    o6();
    W_8();
    I4();
    lB();
    g6();
    N7();
    Ru();
    $S();
    vM();
    c7();
    D18();
    BT();
    Bd();
    pnY = K6(P6(), 1), Gj7 = K6(P6(), 1)
})
// @from(Ln 485457, Col 0)
function IoK(q) {
    let K = s(220),
        {
            tools: _,
            onExit: z,
            toolUseContext: Y
        } = q,
        A;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) A = {
        mode: "list-agents",
        source: "all"
    }, K[0] = A;
    else A = K[0];
    let [O, w] = Tu6.useState(A), [$, j] = Tu6.useState("running"), H = M8(snY), J = M8(anY), X = M8(onY), M = M8(rnY), P = M8(inY), W = R7(), {
        columns: D
    } = s1(), {
        allAgents: Z,
        activeAgents: G
    } = H, f;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) f = [], K[1] = f;
    else f = K[1];
    let [v, V] = Tu6.useState(f), [k, N] = Tu6.useState(""), [R, h] = Tu6.useState(0), C, x, B;
    if (K[2] !== M) {
        C = new Map, x = 0, B = 0;
        for (let r of Object.values(M)) {
            if (r.status === "completed" || r.status === "failed" || r.status === "killed") continue;
            if (fj7(r)) {
                if (B++, r.type === "local_agent") C.set(r.agentType, (C.get(r.agentType) ?? 0) + 1), x++
            }
        }
        K[2] = M, K[3] = C, K[4] = x, K[5] = B
    } else C = K[3], x = K[4], B = K[5];
    let m = x,
        S;
    if (K[6] !== C || K[7] !== m) S = {
        runningByType: C,
        runningCount: m
    }, K[6] = C, K[7] = m, K[8] = S;
    else S = K[8];
    let {
        runningByType: F,
        runningCount: U
    } = S, g = $o8(_, J, X), c = $3(void 0, void 0, O.mode === "list-agents"), n;
    if (K[9] !== Z) n = Z.filter(nnY), K[9] = Z, K[10] = n;
    else n = K[10];
    let l;
    if (K[11] !== Z) l = Z.filter(lnY), K[11] = Z, K[12] = l;
    else l = K[12];
    let z6;
    if (K[13] !== Z) z6 = Z.filter(cnY), K[13] = Z, K[14] = z6;
    else z6 = K[14];
    let A6;
    if (K[15] !== Z) A6 = Z.filter(dnY), K[15] = Z, K[16] = A6;
    else A6 = K[16];
    let e;
    if (K[17] !== Z) e = Z.filter(QnY), K[17] = Z, K[18] = e;
    else e = K[18];
    let i;
    if (K[19] !== Z) i = Z.filter(UnY), K[19] = Z, K[20] = i;
    else i = K[20];
    let O6;
    if (K[21] !== Z) O6 = Z.filter(gnY), K[21] = Z, K[22] = O6;
    else O6 = K[22];
    let J6;
    if (K[23] !== Z || K[24] !== i || K[25] !== O6 || K[26] !== n || K[27] !== l || K[28] !== z6 || K[29] !== A6 || K[30] !== e) J6 = {
        "built-in": n,
        userSettings: l,
        projectSettings: z6,
        policySettings: A6,
        localSettings: e,
        flagSettings: i,
        plugin: O6,
        all: Z
    }, K[23] = Z, K[24] = i, K[25] = O6, K[26] = n, K[27] = l, K[28] = z6, K[29] = A6, K[30] = e, K[31] = J6;
    else J6 = K[31];
    let $6 = J6,
        H6;
    if (K[32] === Symbol.for("react.memo_cache_sentinel")) H6 = (r) => {
        V((t) => [...t, r]), w({
            mode: "list-agents",
            source: "all"
        })
    }, K[32] = H6;
    else H6 = K[32];
    let q6 = H6,
        o;
    if (K[33] !== W) o = async (r) => {
        try {
            await QrK(r), W((t) => {
                let Y6 = t.agentDefinitions.allAgents.filter((X6) => !(X6.agentType === r.agentType && X6.source === r.source));
                return {
                    ...t,
                    agentDefinitions: {
                        ...t.agentDefinitions,
                        allAgents: Y6,
                        activeAgents: zT(Y6)
                    }
                }
            }), V((t) => [...t, `Deleted agent: ${Y8.bold(r.agentType)}`]), w({
                mode: "list-agents",
                source: "all"
            })
        } catch (t) {
            j6(r1(t))
        }
    }, K[33] = W, K[34] = o;
    else o = K[34];
    let _6 = o;
    switch (O.mode) {
        case "task-detail": {
            let r;
            if (K[35] === Symbol.for("react.memo_cache_sentinel")) r = () => w({
                mode: "list-agents",
                source: "all"
            }), K[35] = r;
            else r = K[35];
            let t;
            if (K[36] !== z) t = (X6) => {
                if (X6 === "Viewing teammate" || X6 === "Viewing leader") z(void 0, {
                    display: "skip"
                });
                else w({
                    mode: "list-agents",
                    source: "all"
                })
            }, K[36] = z, K[37] = t;
            else t = K[37];
            let Y6;
            if (K[38] !== O.taskId || K[39] !== t || K[40] !== Y) Y6 = t7.createElement(Xu6, {
                toolUseContext: Y,
                initialDetailTaskId: O.taskId,
                onBack: r,
                onDone: t
            }), K[38] = O.taskId, K[39] = t, K[40] = Y, K[41] = Y6;
            else Y6 = K[41];
            return Y6
        }
        case "list-agents": {
            let r;
            if (K[42] !== $6 || K[43] !== O.source) r = O.source === "all" ? [...$6["built-in"], ...$6.userSettings, ...$6.projectSettings, ...$6.localSettings, ...$6.policySettings, ...$6.flagSettings, ...$6.plugin] : $6[O.source], K[42] = $6, K[43] = O.source, K[44] = r;
            else r = K[44];
            let t = r,
                Y6;
            if (K[45] !== G || K[46] !== t) Y6 = jo8(t, G), K[45] = G, K[46] = t, K[47] = Y6;
            else Y6 = K[47];
            let M6 = Y6,
                W6;
            if (K[48] !== v || K[49] !== z) W6 = () => {
                let q8 = v.length > 0 ? `Agent changes:
${v.join(`
`)}` : void 0;
                z(q8 ?? "Agents dialog dismissed", {
                    display: v.length === 0 ? "system" : void 0
                })
            }, K[48] = v, K[49] = z, K[50] = W6;
            else W6 = K[50];
            let V6 = W6,
                f6 = U > 0 ? `Running (${U})` : "Running",
                G6;
            if (K[51] !== z) G6 = t7.createElement(SoK, {
                onExit: () => z(void 0, {
                    display: "skip"
                })
            }), K[51] = z, K[52] = G6;
            else G6 = K[52];
            let k6;
            if (K[53] !== f6 || K[54] !== G6) k6 = t7.createElement($O, {
                title: f6,
                id: "running"
            }, G6), K[53] = f6, K[54] = G6, K[55] = k6;
            else k6 = K[55];
            let T6;
            if (K[56] !== O) T6 = (q8) => w({
                mode: "agent-menu",
                agent: q8,
                previousMode: O
            }), K[56] = O, K[57] = T6;
            else T6 = K[57];
            let v6;
            if (K[58] === Symbol.for("react.memo_cache_sentinel")) v6 = () => w({
                mode: "create-agent"
            }), K[58] = v6;
            else v6 = K[58];
            let L6;
            if (K[59] !== v || K[60] !== O.source || K[61] !== M6 || K[62] !== F || K[63] !== T6 || K[64] !== P) L6 = t7.createElement($O, {
                title: "Library",
                id: "definitions"
            }, t7.createElement(trK, {
                source: O.source,
                agents: M6,
                runningByType: F,
                usedThisSession: P,
                onSelect: T6,
                onCreateNew: v6,
                changes: v
            })), K[59] = v, K[60] = O.source, K[61] = M6, K[62] = F, K[63] = T6, K[64] = P, K[65] = L6;
            else L6 = K[65];
            let y6;
            if (K[66] !== $ || K[67] !== k6 || K[68] !== L6) y6 = t7.createElement(JL, {
                title: "Agents",
                color: "permission",
                navFromContent: !0,
                selectedTab: $,
                onTabChange: j
            }, k6, L6), K[66] = $, K[67] = k6, K[68] = L6, K[69] = y6;
            else y6 = K[69];
            let c6 = c.pending ? `Press ${c.keyName} again to exit` : `${zO1}/${aF7} switch tabs · ${oF7}${zX8} navigate · Enter select · Esc close`,
                Z8;
            if (K[70] !== c6) Z8 = t7.createElement(u, {
                marginTop: 1
            }, t7.createElement(T, {
                dimColor: !0
            }, c6)), K[70] = c6, K[71] = Z8;
            else Z8 = K[71];
            let N8;
            if (K[72] !== y6 || K[73] !== Z8) N8 = t7.createElement(A_, {
                color: "permission"
            }, y6, Z8), K[72] = y6, K[73] = Z8, K[74] = N8;
            else N8 = K[74];
            let R6;
            if (K[75] !== V6) R6 = t7.createElement(tnY, {
                onCancel: V6
            }), K[75] = V6, K[76] = R6;
            else R6 = K[76];
            let p6;
            if (K[77] !== N8 || K[78] !== R6) p6 = t7.createElement(t7.Fragment, null, N8, R6), K[77] = N8, K[78] = R6, K[79] = p6;
            else p6 = K[79];
            return p6
        }
        case "create-agent": {
            let r;
            if (K[80] === Symbol.for("react.memo_cache_sentinel")) r = () => w({
                mode: "list-agents",
                source: "all"
            }), K[80] = r;
            else r = K[80];
            let t;
            if (K[81] !== G || K[82] !== g) t = t7.createElement(hoK, {
                tools: g,
                existingAgents: G,
                onComplete: q6,
                onCancel: r
            }), K[81] = G, K[82] = g, K[83] = t;
            else t = K[83];
            return t
        }
        case "agent-menu": {
            let r;
            if (K[84] !== Z || K[85] !== O.agent.agentType || K[86] !== O.agent.source) {
                let a6;
                if (K[88] !== O.agent.agentType || K[89] !== O.agent.source) a6 = (D8) => D8.agentType === O.agent.agentType && D8.source === O.agent.source, K[88] = O.agent.agentType, K[89] = O.agent.source, K[90] = a6;
                else a6 = K[90];
                r = Z.find(a6), K[84] = Z, K[85] = O.agent.agentType, K[86] = O.agent.source, K[87] = r
            } else r = K[87];
            let Y6 = r || O.agent,
                X6 = Y6.source !== "built-in" && Y6.source !== "plugin" && Y6.source !== "flagSettings",
                M6;
            if (K[91] !== Y6.agentType || K[92] !== F) M6 = F.get(Y6.agentType) ?? 0, K[91] = Y6.agentType, K[92] = F, K[93] = M6;
            else M6 = K[93];
            let W6 = M6,
                V6;
            if (K[94] === Symbol.for("react.memo_cache_sentinel")) V6 = {
                label: "Run agent",
                value: "run"
            }, K[94] = V6;
            else V6 = K[94];
            let f6;
            if (K[95] !== W6) f6 = W6 > 0 ? [{
                label: "View running instance",
                value: "view-running"
            }] : [], K[95] = W6, K[96] = f6;
            else f6 = K[96];
            let G6;
            if (K[97] === Symbol.for("react.memo_cache_sentinel")) G6 = {
                label: "View agent",
                value: "view"
            }, K[97] = G6;
            else G6 = K[97];
            let k6;
            if (K[98] !== X6) k6 = X6 ? [{
                label: "Edit agent",
                value: "edit"
            }, {
                label: "Delete agent",
                value: "delete"
            }] : [], K[98] = X6, K[99] = k6;
            else k6 = K[99];
            let T6;
            if (K[100] === Symbol.for("react.memo_cache_sentinel")) T6 = {
                label: "Back",
                value: "back"
            }, K[100] = T6;
            else T6 = K[100];
            let v6;
            if (K[101] !== f6 || K[102] !== k6) v6 = [V6, ...f6, G6, ...k6, T6], K[101] = f6, K[102] = k6, K[103] = v6;
            else v6 = K[103];
            let L6 = v6,
                y6;
            if (K[104] !== Y6 || K[105] !== O || K[106] !== z || K[107] !== W || K[108] !== M) y6 = (a6) => {
                q: switch (a6) {
                    case "run": {
                        N(""), h(0), w({
                            mode: "run-agent",
                            agent: Y6,
                            previousMode: O
                        });
                        break q
                    }
                    case "view-running": {
                        let D8 = Object.values(M).find((Q6) => Q6.type === "local_agent" && Q6.agentType === Y6.agentType && Q6.status !== "completed" && Q6.status !== "failed" && Q6.status !== "killed");
                        if (D8) VG(D8.id, W), z(void 0, {
                            display: "skip"
                        });
                        break q
                    }
                    case "view": {
                        w({
                            mode: "view-agent",
                            agent: Y6,
                            previousMode: O.previousMode
                        });
                        break q
                    }
                    case "edit": {
                        w({
                            mode: "edit-agent",
                            agent: Y6,
                            previousMode: O
                        });
                        break q
                    }
                    case "delete": {
                        w({
                            mode: "delete-confirm",
                            agent: Y6,
                            previousMode: O
                        });
                        break q
                    }
                    case "back":
                        w(O.previousMode)
                }
            }, K[104] = Y6, K[105] = O, K[106] = z, K[107] = W, K[108] = M, K[109] = y6;
            else y6 = K[109];
            let c6 = y6,
                Z8;
            if (K[110] !== O.previousMode) Z8 = () => w(O.previousMode), K[110] = O.previousMode, K[111] = Z8;
            else Z8 = K[111];
            let N8;
            if (K[112] !== O.previousMode) N8 = () => w(O.previousMode), K[112] = O.previousMode, K[113] = N8;
            else N8 = K[113];
            let R6;
            if (K[114] !== c6 || K[115] !== L6 || K[116] !== N8) R6 = t7.createElement(A1, {
                options: L6,
                onChange: c6,
                onCancel: N8
            }), K[114] = c6, K[115] = L6, K[116] = N8, K[117] = R6;
            else R6 = K[117];
            let p6;
            if (K[118] !== v) p6 = v.length > 0 && t7.createElement(u, {
                marginTop: 1
            }, t7.createElement(T, {
                dimColor: !0
            }, v.at(-1))), K[118] = v, K[119] = p6;
            else p6 = K[119];
            let q8;
            if (K[120] !== R6 || K[121] !== p6) q8 = t7.createElement(u, {
                flexDirection: "column"
            }, R6, p6), K[120] = R6, K[121] = p6, K[122] = q8;
            else q8 = K[122];
            let L8;
            if (K[123] !== O.agent.agentType || K[124] !== Z8 || K[125] !== q8) L8 = t7.createElement(R1, {
                title: O.agent.agentType,
                onCancel: Z8,
                hideInputGuide: !0
            }, q8), K[123] = O.agent.agentType, K[124] = Z8, K[125] = q8, K[126] = L8;
            else L8 = K[126];
            let w8;
            if (K[127] === Symbol.for("react.memo_cache_sentinel")) w8 = t7.createElement(Gu6, null), K[127] = w8;
            else w8 = K[127];
            let x8;
            if (K[128] !== L8) x8 = t7.createElement(t7.Fragment, null, L8, w8), K[128] = L8, K[129] = x8;
            else x8 = K[129];
            return x8
        }
        case "view-agent": {
            let r;
            if (K[130] !== Z || K[131] !== O.agent) {
                let k6;
                if (K[133] !== O.agent) k6 = (T6) => T6.agentType === O.agent.agentType && T6.source === O.agent.source, K[133] = O.agent, K[134] = k6;
                else k6 = K[134];
                r = Z.find(k6), K[130] = Z, K[131] = O.agent, K[132] = r
            } else r = K[132];
            let Y6 = r || O.agent,
                X6;
            if (K[135] !== Y6 || K[136] !== O.previousMode) X6 = () => w({
                mode: "agent-menu",
                agent: Y6,
                previousMode: O.previousMode
            }), K[135] = Y6, K[136] = O.previousMode, K[137] = X6;
            else X6 = K[137];
            let M6;
            if (K[138] !== Y6 || K[139] !== O.previousMode) M6 = () => w({
                mode: "agent-menu",
                agent: Y6,
                previousMode: O.previousMode
            }), K[138] = Y6, K[139] = O.previousMode, K[140] = M6;
            else M6 = K[140];
            let W6;
            if (K[141] !== Y6 || K[142] !== Z || K[143] !== g || K[144] !== M6) W6 = t7.createElement(crK, {
                agent: Y6,
                tools: g,
                allAgents: Z,
                onBack: M6
            }), K[141] = Y6, K[142] = Z, K[143] = g, K[144] = M6, K[145] = W6;
            else W6 = K[145];
            let V6;
            if (K[146] !== Y6.agentType || K[147] !== X6 || K[148] !== W6) V6 = t7.createElement(R1, {
                title: Y6.agentType,
                onCancel: X6,
                hideInputGuide: !0
            }, W6), K[146] = Y6.agentType, K[147] = X6, K[148] = W6, K[149] = V6;
            else V6 = K[149];
            let f6;
            if (K[150] === Symbol.for("react.memo_cache_sentinel")) f6 = t7.createElement(Gu6, {
                instructions: "Press Enter or Esc to go back"
            }), K[150] = f6;
            else f6 = K[150];
            let G6;
            if (K[151] !== V6) G6 = t7.createElement(t7.Fragment, null, V6, f6), K[151] = V6, K[152] = G6;
            else G6 = K[152];
            return G6
        }
        case "delete-confirm": {
            let r;
            if (K[153] === Symbol.for("react.memo_cache_sentinel")) r = [{
                label: "Yes, delete",
                value: "yes"
            }, {
                label: "No, cancel",
                value: "no"
            }], K[153] = r;
            else r = K[153];
            let t = r,
                Y6;
            if (K[154] !== O) Y6 = () => {
                if ("previousMode" in O) w(O.previousMode)
            }, K[154] = O, K[155] = Y6;
            else Y6 = K[155];
            let X6;
            if (K[156] !== O.agent.agentType) X6 = t7.createElement(T, null, "Are you sure you want to delete the agent", " ", t7.createElement(T, {
                bold: !0
            }, O.agent.agentType), "?"), K[156] = O.agent.agentType, K[157] = X6;
            else X6 = K[157];
            let M6;
            if (K[158] !== O.agent.source) M6 = t7.createElement(u, {
                marginTop: 1
            }, t7.createElement(T, {
                dimColor: !0
            }, "Source: ", O.agent.source)), K[158] = O.agent.source, K[159] = M6;
            else M6 = K[159];
            let W6;
            if (K[160] !== _6 || K[161] !== O) W6 = (y6) => {
                if (y6 === "yes") _6(O.agent);
                else if ("previousMode" in O) w(O.previousMode)
            }, K[160] = _6, K[161] = O, K[162] = W6;
            else W6 = K[162];
            let V6;
            if (K[163] !== O) V6 = () => {
                if ("previousMode" in O) w(O.previousMode)
            }, K[163] = O, K[164] = V6;
            else V6 = K[164];
            let f6;
            if (K[165] !== W6 || K[166] !== V6) f6 = t7.createElement(u, {
                marginTop: 1
            }, t7.createElement(A1, {
                options: t,
                onChange: W6,
                onCancel: V6
            })), K[165] = W6, K[166] = V6, K[167] = f6;
            else f6 = K[167];
            let G6;
            if (K[168] !== Y6 || K[169] !== X6 || K[170] !== M6 || K[171] !== f6) G6 = t7.createElement(R1, {
                title: "Delete agent",
                onCancel: Y6,
                color: "error"
            }, X6, M6, f6), K[168] = Y6, K[169] = X6, K[170] = M6, K[171] = f6, K[172] = G6;
            else G6 = K[172];
            let k6;
            if (K[173] === Symbol.for("react.memo_cache_sentinel")) k6 = t7.createElement(A8, {
                chord: ["up", "down"],
                format: {
                    arrowSep: ""
                },
                action: "navigate"
            }), K[173] = k6;
            else k6 = K[173];
            let T6;
            if (K[174] === Symbol.for("react.memo_cache_sentinel")) T6 = t7.createElement(A8, {
                chord: "enter",
                action: "select"
            }), K[174] = T6;
            else T6 = K[174];
            let v6;
            if (K[175] === Symbol.for("react.memo_cache_sentinel")) v6 = t7.createElement(Gu6, {
                instructions: t7.createElement(T, null, "Press", " ", k6, ", ", T6, ", ", t7.createElement(A8, {
                    chord: "escape",
                    action: "cancel"
                }))
            }), K[175] = v6;
            else v6 = K[175];
            let L6;
            if (K[176] !== G6) L6 = t7.createElement(t7.Fragment, null, G6, v6), K[176] = G6, K[177] = L6;
            else L6 = K[177];
            return L6
        }
        case "run-agent": {
            let r = O.agent,
                t = `Run ${r.agentType}`,
                Y6;
            if (K[178] !== O.previousMode) Y6 = () => w(O.previousMode), K[178] = O.previousMode, K[179] = Y6;
            else Y6 = K[179];
            let X6;
            if (K[180] !== r.agentType || K[181] !== z) X6 = (k6) => {
                let T6 = k6.trim();
                if (!T6) return;
                z(void 0, {
                    display: "skip",
                    nextInput: `@agent-${r.agentType} ${T6}`,
                    submitNextInput: !0
                })
            }, K[180] = r.agentType, K[181] = z, K[182] = X6;
            else X6 = K[182];
            let M6;
            if (K[183] !== O.previousMode) M6 = () => w(O.previousMode), K[183] = O.previousMode, K[184] = M6;
            else M6 = K[184];
            let W6;
            if (K[185] !== D || K[186] !== R || K[187] !== k || K[188] !== X6 || K[189] !== M6) W6 = t7.createElement(u, {
                marginTop: 1
            }, t7.createElement(l4, {
                value: k,
                onChange: N,
                onSubmit: X6,
                onExit: M6,
                focus: !0,
                showCursor: !0,
                columns: D,
                cursorOffset: R,
                onChangeCursorOffset: h,
                placeholder: "Describe the task…"
            })), K[185] = D, K[186] = R, K[187] = k, K[188] = X6, K[189] = M6, K[190] = W6;
            else W6 = K[190];
            let V6;
            if (K[191] !== t || K[192] !== Y6 || K[193] !== W6) V6 = t7.createElement(R1, {
                title: t,
                subtitle: "Enter a prompt for this subagent",
                onCancel: Y6,
                isCancelActive: !1,
                hideInputGuide: !0
            }, W6), K[191] = t, K[192] = Y6, K[193] = W6, K[194] = V6;
            else V6 = K[194];
            let f6;
            if (K[195] === Symbol.for("react.memo_cache_sentinel")) f6 = t7.createElement(Gu6, {
                instructions: "Enter to run · Esc to go back"
            }), K[195] = f6;
            else f6 = K[195];
            let G6;
            if (K[196] !== V6) G6 = t7.createElement(t7.Fragment, null, V6, f6), K[196] = V6, K[197] = G6;
            else G6 = K[197];
            return G6
        }
        case "edit-agent": {
            let r;
            if (K[198] !== Z || K[199] !== O.agent) {
                let v6;
                if (K[201] !== O.agent) v6 = (L6) => L6.agentType === O.agent.agentType && L6.source === O.agent.source, K[201] = O.agent, K[202] = v6;
                else v6 = K[202];
                r = Z.find(v6), K[198] = Z, K[199] = O.agent, K[200] = r
            } else r = K[200];
            let Y6 = r || O.agent,
                X6 = `Edit agent: ${Y6.agentType}`,
                M6;
            if (K[203] !== O.previousMode) M6 = () => w(O.previousMode), K[203] = O.previousMode, K[204] = M6;
            else M6 = K[204];
            let W6, V6;
            if (K[205] !== O.previousMode) W6 = (v6) => {
                q6(v6), w(O.previousMode)
            }, V6 = () => w(O.previousMode), K[205] = O.previousMode, K[206] = W6, K[207] = V6;
            else W6 = K[206], V6 = K[207];
            let f6;
            if (K[208] !== Y6 || K[209] !== g || K[210] !== W6 || K[211] !== V6) f6 = t7.createElement(irK, {
                agent: Y6,
                tools: g,
                onSaved: W6,
                onBack: V6
            }), K[208] = Y6, K[209] = g, K[210] = W6, K[211] = V6, K[212] = f6;
            else f6 = K[212];
            let G6;
            if (K[213] !== X6 || K[214] !== M6 || K[215] !== f6) G6 = t7.createElement(R1, {
                title: X6,
                onCancel: M6,
                hideInputGuide: !0
            }, f6), K[213] = X6, K[214] = M6, K[215] = f6, K[216] = G6;
            else G6 = K[216];
            let k6;
            if (K[217] === Symbol.for("react.memo_cache_sentinel")) k6 = t7.createElement(Gu6, null), K[217] = k6;
            else k6 = K[217];
            let T6;
            if (K[218] !== G6) T6 = t7.createElement(t7.Fragment, null, G6, k6), K[218] = G6, K[219] = T6;
            else T6 = K[219];
            return T6
        }
        default:
            return null
    }
}
// @from(Ln 486074, Col 0)
function gnY(q) {
    return q.source === "plugin"
}
// @from(Ln 486078, Col 0)
function UnY(q) {
    return q.source === "flagSettings"
}
// @from(Ln 486082, Col 0)
function QnY(q) {
    return q.source === "localSettings"
}
// @from(Ln 486086, Col 0)
function dnY(q) {
    return q.source === "policySettings"
}
// @from(Ln 486090, Col 0)
function cnY(q) {
    return q.source === "projectSettings"
}
// @from(Ln 486094, Col 0)
function lnY(q) {
    return q.source === "userSettings"
}
// @from(Ln 486098, Col 0)
function nnY(q) {
    return q.source === "built-in"
}
// @from(Ln 486102, Col 0)
function inY(q) {
    return q.agentTypesInvokedThisSession
}
// @from(Ln 486106, Col 0)
function rnY(q) {
    return q.tasks
}
// @from(Ln 486110, Col 0)
function onY(q) {
    return q.toolPermissionContext
}
// @from(Ln 486114, Col 0)
function anY(q) {
    return q.mcp.tools
}
// @from(Ln 486118, Col 0)
function snY(q) {
    return q.agentDefinitions
}
// @from(Ln 486122, Col 0)
function tnY(q) {
    let K = s(1),
        {
            onCancel: _
        } = q,
        z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = {
        context: "Confirmation"
    }, K[0] = z;
    else z = K[0];
    return G1("confirm:no", _, z), null
}
// @from(Ln 486134, Col 4)
t7
// @from(Ln 486134, Col 8)
Tu6
// @from(Ln 486135, Col 4)
xoK = L(() => {
    o6();
    Y3();
    A3();
    C$();
    Hj7();
    I4();
    g6();
    C7();
    N7();
    Ru();
    Mo8();
    cP();
    m8();
    U8();
    gK();
    S4();
    u7();
    DJ();
    BT();
    NY();
    sr8();
    lrK();
    rrK();
    orK();
    erK();
    Zu6();
    RoK();
    CoK();
    boK();
    t7 = K6(P6(), 1), Tu6 = K6(P6(), 1)
})
// @from(Ln 486167, Col 4)
uoK = {}
// @from(Ln 486171, Col 0)
async function enY(q, K) {
    let z = K.getAppState().toolPermissionContext,
        Y = YZ(z);
    return vj7.createElement(IoK, {
        tools: Y,
        onExit: q,
        toolUseContext: K
    })
}
// @from(Ln 486180, Col 4)
vj7
// @from(Ln 486181, Col 4)
moK = L(() => {
    xoK();
    $0();
    vj7 = K6(P6(), 1)
})
// @from(Ln 486186, Col 4)
qiY
// @from(Ln 486186, Col 9)
BoK
// @from(Ln 486187, Col 4)
poK = L(() => {
    qiY = {
        type: "local-jsx",
        name: "agents",
        description: "Manage agent configurations",
        load: () => Promise.resolve().then(() => (moK(), uoK))
    }, BoK = qiY
})
// @from(Ln 486195, Col 4)
FoK = {}
// @from(Ln 486199, Col 0)
async function KiY(q, K, _) {
    return Tj7.createElement(VFK, {
        onComplete: q,
        args: _
    })
}
// @from(Ln 486205, Col 4)
Tj7
// @from(Ln 486206, Col 4)
goK = L(() => {
    vw7();
    Tj7 = K6(P6(), 1)
})
// @from(Ln 486210, Col 4)
_iY
// @from(Ln 486210, Col 9)
UoK
// @from(Ln 486211, Col 4)
QoK = L(() => {
    _iY = {
        type: "local-jsx",
        name: "plugin",
        aliases: ["plugins", "marketplace"],
        description: "Manage Claude Code plugins",
        immediate: !0,
        load: () => Promise.resolve().then(() => (goK(), FoK))
    }, UoK = _iY
})
// @from(Ln 486221, Col 4)
ziY
// @from(Ln 486221, Col 9)
YiY
// @from(Ln 486222, Col 4)
doK = L(() => {
    p7();
    ziY = C6(() => y.object({
        entries: y.record(y.string(), y.string())
    })), YiY = C6(() => y.object({
        userId: y.string(),
        version: y.number(),
        lastModified: y.string(),
        checksum: y.string(),
        content: ziY()
    }))
})
// @from(Ln 486234, Col 4)
Vj7 = L(() => {
    y8();
    z3();
    T7();
    PM();
    h1();
    VA();
    m8();
    pK();
    x9();
    _X8();
    a1();
    Li();
    B1();
    C8();
    Z36();
    doK()
})
// @from(Ln 486252, Col 4)
To8
// @from(Ln 486253, Col 4)
kj7 = L(() => {
    nH();
    To8 = l5()
})