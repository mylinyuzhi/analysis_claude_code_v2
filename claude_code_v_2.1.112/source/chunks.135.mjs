
// @from(Ln 338424, Col 0)
function nAK({
    teammate: q,
    isLast: K,
    isSelected: _,
    isForegrounded: z,
    allIdle: Y,
    showPreview: A
}) {
    let [O] = EC6.useState(() => q.spinnerVerb ?? LJ(AJ6())), [w] = EC6.useState(() => q.pastTenseVerb ?? LJ(nh6)), $ = _ || z, j = $ ? K ? "╘═" : "╞═" : K ? "└─" : "├─", H = KG(q.identity.color), {
        columns: J
    } = s1(), X = EC6.useRef(null), M = EC6.useRef(null);
    if (q.isIdle && X.current === null) X.current = Date.now();
    else if (!q.isIdle) X.current = null;
    if (!Y && M.current !== null) M.current = null;
    let P = RF(X.current ?? Date.now(), q.isIdle && !Y);
    if (Y && M.current === null) M.current = C5(Math.max(0, Date.now() - q.startTime - (q.totalPausedMs ?? 0)));
    let W = Y ? M.current ?? (() => {
            throw Error(`frozenDurationRef is null for idle teammate ${q.identity.agentName}`)
        })() : P,
        D = 8,
        Z = `@${q.identity.agentName}`,
        G = N1(Z),
        f = q.progress?.toolUseCount ?? 0,
        v = q.progress?.tokenCount ?? 0,
        V = ` · ${f} tool ${f===1?"use":"uses"} · ${iK(v)} tokens`,
        k = N1(V),
        N = ` · ${g48}`,
        R = N1(N),
        C = N1(" · enter to view"),
        x = 25,
        B = J - D - G - 2,
        m = J >= 60 && B >= x,
        S = m ? G + 2 : 0,
        F = J - D - S,
        U = _ && !z && F > C + k + x + 5,
        g = $ && F > R + (U ? C : 0) + k + x + 5,
        c = F > k + x + 5,
        n = (c ? k : 0) + (g ? R : 0) + (U ? C : 0),
        l = Math.max(x, F - n - 1),
        z6 = (() => {
            let i = q.progress?.recentActivities;
            if (i && i.length > 0) {
                let J6 = kC6(i);
                if (J6) return j4(J6, l)
            }
            let O6 = q.progress?.lastActivity?.activityDescription;
            if (O6) return j4(O6, l);
            return O
        })(),
        A6 = A ? Z8Y(q.messages) : [],
        e = K ? "   " : "│  ";
    return L_.createElement(u, {
        flexDirection: "column"
    }, L_.createElement(u, {
        paddingLeft: 3
    }, L_.createElement(T, {
        color: _ ? "suggestion" : void 0,
        bold: _
    }, _ ? e6.pointer : " "), L_.createElement(T, {
        dimColor: !_
    }, j, " "), m && L_.createElement(T, {
        color: _ ? "suggestion" : H
    }, "@", q.identity.agentName), m && L_.createElement(T, {
        dimColor: !_
    }, ": "), L_.createElement(f8Y, {
        teammate: q,
        allIdle: Y,
        pastTenseVerb: w,
        displayTime: W,
        idleElapsedTime: P,
        isHighlighted: $,
        activityText: z6
    }), c && L_.createElement(T, {
        dimColor: !0
    }, " ", "· ", f, " tool ", f === 1 ? "use" : "uses", " ·", " ", iK(v), " tokens"), g && L_.createElement(T, {
        dimColor: !0
    }, " · ", g48), U && L_.createElement(T, {
        dimColor: !0
    }, " · ", L_.createElement(A8, {
        chord: "enter",
        action: "view",
        format: {
            keyCase: "lower"
        }
    }))), A6.map((i, O6) => L_.createElement(u, {
        key: O6,
        paddingLeft: 3
    }, L_.createElement(T, {
        dimColor: !0
    }, " "), L_.createElement(T, {
        dimColor: !0
    }, e, " "), L_.createElement(T, {
        dimColor: !0
    }, i))))
}
// @from(Ln 338520, Col 0)
function f8Y(q) {
    let K = s(9),
        {
            teammate: _,
            allIdle: z,
            pastTenseVerb: Y,
            displayTime: A,
            idleElapsedTime: O,
            isHighlighted: w,
            activityText: $
        } = q;
    if (_.shutdownRequested) {
        let J;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) J = L_.createElement(T, {
            dimColor: !0
        }, "[stopping]"), K[0] = J;
        else J = K[0];
        return J
    }
    if (_.awaitingPlanApproval) {
        let J;
        if (K[1] === Symbol.for("react.memo_cache_sentinel")) J = L_.createElement(T, {
            color: "warning"
        }, "[awaiting approval]"), K[1] = J;
        else J = K[1];
        return J
    }
    if (_.isIdle) {
        if (z) {
            let X;
            if (K[2] !== A || K[3] !== Y) X = L_.createElement(T, {
                dimColor: !0
            }, Y, " for ", A), K[2] = A, K[3] = Y, K[4] = X;
            else X = K[4];
            return X
        }
        let J;
        if (K[5] !== O) J = L_.createElement(T, {
            dimColor: !0
        }, "Idle for ", O), K[5] = O, K[6] = J;
        else J = K[6];
        return J
    }
    if (w) return null;
    let j = $?.endsWith("…") ? $ : `${$}…`,
        H;
    if (K[7] !== j) H = L_.createElement(T, {
        dimColor: !0
    }, j), K[7] = j, K[8] = H;
    else H = K[8];
    return H
}
// @from(Ln 338572, Col 4)
L_
// @from(Ln 338572, Col 8)
EC6
// @from(Ln 338573, Col 4)
iAK = L(() => {
    o6();
    Qq();
    uc();
    pI8();
    FI8();
    NC6();
    I4();
    n5();
    g6();
    Bt();
    c7();
    pt();
    u7();
    L_ = K6(P6(), 1), EC6 = K6(P6(), 1)
})
// @from(Ln 338590, Col 0)
function CF8(q) {
    let K = s(61),
        {
            selectedIndex: _,
            isInSelectionMode: z,
            allIdle: Y,
            leaderVerb: A,
            leaderTokenCount: O,
            leaderIdleText: w
        } = q,
        $ = M8(T8Y),
        j = M8(v8Y),
        H = M8(G8Y),
        J, X, M, P, W, D, Z;
    if (K[0] !== Y || K[1] !== z || K[2] !== w || K[3] !== O || K[4] !== A || K[5] !== _ || K[6] !== H || K[7] !== $ || K[8] !== j) {
        Z = Symbol.for("react.early_return_sentinel");
        q: {
            let v = qt($);
            if (v.length === 0) {
                Z = null;
                break q
            }
            let V = j === void 0,
                k = z && _ === -1,
                N = V || k;X = z === !0 && _ === v.length,
            J = u,
            M = "column",
            P = 1;
            let R = k ? "suggestion" : void 0,
                h = k ? e6.pointer : " ",
                C;
            if (K[16] !== N || K[17] !== R || K[18] !== h) C = qz.createElement(T, {
                color: R,
                bold: N
            }, h),
            K[16] = N,
            K[17] = R,
            K[18] = h,
            K[19] = C;
            else C = K[19];
            let x = !N,
                B = N ? "╒═" : "┌─",
                m;
            if (K[20] !== N || K[21] !== B || K[22] !== x) m = qz.createElement(T, {
                dimColor: x,
                bold: N
            }, B, " "),
            K[20] = N,
            K[21] = B,
            K[22] = x,
            K[23] = m;
            else m = K[23];
            let S = k ? "suggestion" : "cyan_FOR_SUBAGENTS_ONLY",
                F;
            if (K[24] !== N || K[25] !== S) F = qz.createElement(T, {
                bold: N,
                color: S
            }, "team-lead"),
            K[24] = N,
            K[25] = S,
            K[26] = F;
            else F = K[26];
            let U;
            if (K[27] !== V || K[28] !== A) U = !V && A && qz.createElement(T, {
                dimColor: !0
            }, ": ", A, "…"),
            K[27] = V,
            K[28] = A,
            K[29] = U;
            else U = K[29];
            let g;
            if (K[30] !== V || K[31] !== w || K[32] !== A) g = !V && !A && w && qz.createElement(T, {
                dimColor: !0
            }, ": ", w),
            K[30] = V,
            K[31] = w,
            K[32] = A,
            K[33] = g;
            else g = K[33];
            let c;
            if (K[34] !== N || K[35] !== O) c = O !== void 0 && O > 0 && qz.createElement(T, {
                dimColor: !N
            }, " ", "· ", iK(O), " tokens"),
            K[34] = N,
            K[35] = O,
            K[36] = c;
            else c = K[36];
            let n;
            if (K[37] !== N) n = N && qz.createElement(T, {
                dimColor: !0
            }, " · ", g48),
            K[37] = N,
            K[38] = n;
            else n = K[38];
            let l;
            if (K[39] !== V || K[40] !== k) l = k && !V && qz.createElement(T, {
                dimColor: !0
            }, " · ", qz.createElement(A8, {
                chord: "enter",
                action: "view",
                format: {
                    keyCase: "lower"
                }
            })),
            K[39] = V,
            K[40] = k,
            K[41] = l;
            else l = K[41];
            if (K[42] !== m || K[43] !== F || K[44] !== U || K[45] !== g || K[46] !== c || K[47] !== n || K[48] !== l || K[49] !== C) W = qz.createElement(u, {
                paddingLeft: 3
            }, C, m, F, U, g, c, n, l),
            K[42] = m,
            K[43] = F,
            K[44] = U,
            K[45] = g,
            K[46] = c,
            K[47] = n,
            K[48] = l,
            K[49] = C,
            K[50] = W;
            else W = K[50];D = v.map((z6, A6) => qz.createElement(nAK, {
                key: z6.id,
                teammate: z6,
                isLast: !z && A6 === v.length - 1,
                isSelected: z && _ === A6,
                isForegrounded: j === z6.id,
                allIdle: Y,
                showPreview: H
            }))
        }
        K[0] = Y, K[1] = z, K[2] = w, K[3] = O, K[4] = A, K[5] = _, K[6] = H, K[7] = $, K[8] = j, K[9] = J, K[10] = X, K[11] = M, K[12] = P, K[13] = W, K[14] = D, K[15] = Z
    } else J = K[9], X = K[10], M = K[11], P = K[12], W = K[13], D = K[14], Z = K[15];
    if (Z !== Symbol.for("react.early_return_sentinel")) return Z;
    let G;
    if (K[51] !== X || K[52] !== z) G = z && qz.createElement(V8Y, {
        isSelected: X
    }), K[51] = X, K[52] = z, K[53] = G;
    else G = K[53];
    let f;
    if (K[54] !== J || K[55] !== M || K[56] !== P || K[57] !== W || K[58] !== D || K[59] !== G) f = qz.createElement(J, {
        flexDirection: M,
        marginTop: P
    }, W, D, G), K[54] = J, K[55] = M, K[56] = P, K[57] = W, K[58] = D, K[59] = G, K[60] = f;
    else f = K[60];
    return f
}
// @from(Ln 338737, Col 0)
function G8Y(q) {
    return q.showTeammateMessagePreview
}
// @from(Ln 338741, Col 0)
function v8Y(q) {
    return q.viewingAgentTaskId
}
// @from(Ln 338745, Col 0)
function T8Y(q) {
    return q.tasks
}
// @from(Ln 338749, Col 0)
function V8Y(q) {
    let K = s(18),
        {
            isSelected: _
        } = q,
        z = _ ? "suggestion" : void 0,
        Y = _ ? e6.pointer : " ",
        A;
    if (K[0] !== _ || K[1] !== z || K[2] !== Y) A = qz.createElement(T, {
        color: z,
        bold: _
    }, Y), K[0] = _, K[1] = z, K[2] = Y, K[3] = A;
    else A = K[3];
    let O = !_,
        w = _ ? "╘═" : "└─",
        $;
    if (K[4] !== _ || K[5] !== O || K[6] !== w) $ = qz.createElement(T, {
        dimColor: O,
        bold: _
    }, w, " "), K[4] = _, K[5] = O, K[6] = w, K[7] = $;
    else $ = K[7];
    let j = !_,
        H;
    if (K[8] !== _ || K[9] !== j) H = qz.createElement(T, {
        dimColor: j,
        bold: _
    }, "hide"), K[8] = _, K[9] = j, K[10] = H;
    else H = K[10];
    let J;
    if (K[11] !== _) J = _ && qz.createElement(T, {
        dimColor: !0
    }, " · ", qz.createElement(A8, {
        chord: "enter",
        action: "collapse",
        format: {
            keyCase: "lower"
        }
    })), K[11] = _, K[12] = J;
    else J = K[12];
    let X;
    if (K[13] !== A || K[14] !== $ || K[15] !== H || K[16] !== J) X = qz.createElement(u, {
        paddingLeft: 3
    }, A, $, H, J), K[13] = A, K[14] = $, K[15] = H, K[16] = J, K[17] = X;
    else X = K[17];
    return X
}
// @from(Ln 338795, Col 4)
qz
// @from(Ln 338796, Col 4)
rAK = L(() => {
    o6();
    Qq();
    g6();
    N7();
    hx();
    c7();
    u7();
    iAK();
    qz = K6(P6(), 1)
})
// @from(Ln 338808, Col 0)
function sAK(q) {
    let {
        mode: K,
        overrideMessage: _,
        overrideColor: z,
        overrideShimmerColor: Y
    } = FAK(), A = M8(($) => $.isBriefOnly), O = M8(($) => $.viewingAgentTaskId), w = ix.useMemo(() => S6(process.env.CLAUDE_CODE_BRIEF), []);
    if ((aG() || cL() && (w || u8("tengu_kairos_brief", !1))) && A && !O) return hq.createElement(N8Y, {
        mode: K,
        overrideMessage: _
    });
    return hq.createElement(k8Y, {
        ...q,
        mode: K,
        overrideMessage: _,
        overrideColor: z,
        overrideShimmerColor: Y
    })
}
// @from(Ln 338828, Col 0)
function k8Y({
    mode: q,
    loadingStartTimeRef: K,
    totalPausedMsRef: _,
    pauseStartTimeRef: z,
    responseLengthRef: Y,
    overrideColor: A,
    overrideShimmerColor: O,
    overrideMessage: w,
    spinnerSuffix: $,
    verbose: j,
    hasActiveTools: H = !1,
    leaderIsIdle: J = !1
}) {
    let X = iO(),
        M = X.prefersReducedMotion ?? !1,
        P = M8((W6) => W6.spinnerTip),
        W = M8((W6) => W6.tasks),
        D = M8((W6) => W6.viewingAgentTaskId),
        Z = M8((W6) => W6.expandedView),
        G = Z === "tasks",
        f = Z === "teammates",
        v = M8((W6) => W6.selectedIPAgentIndex),
        V = M8((W6) => W6.viewSelectionMode),
        k = D ? dp({
            viewingAgentTaskId: D,
            tasks: W
        }) : void 0,
        {
            columns: N
        } = s1(),
        R = I48(),
        [h, C] = ix.useState(null),
        x = ix.useRef(null);
    ix.useEffect(() => {
        let W6 = null,
            V6 = null;
        if (q === "thinking") {
            if (x.current === null) x.current = Date.now(), C("thinking")
        } else if (x.current !== null) {
            let f6 = Date.now() - x.current,
                G6 = Date.now() - x.current,
                k6 = Math.max(0, 2000 - G6);
            x.current = null;
            let T6 = () => {
                C(f6), V6 = setTimeout(C, 2000, null)
            };
            if (k6 > 0) W6 = setTimeout(T6, k6);
            else T6()
        }
        return () => {
            if (W6) clearTimeout(W6);
            if (V6) clearTimeout(V6)
        }
    }, [q]);
    let B = R?.find((W6) => W6.status !== "pending" && W6.status !== "completed"),
        m = S8Y(R),
        [S] = ix.useState(() => LJ(AJ6())),
        F = w ?? B?.activeForm ?? B?.subject ?? S,
        g = (k && !k.isIdle ? k.spinnerVerb ?? S : F) + "…";
    ix.useEffect(() => {
        let W6 = "spinner-" + q;
        return mt.startCLIActivity(W6), () => {
            mt.endCLIActivity(W6)
        }
    }, [q]);
    let c = M8((W6) => W6.effortValue),
        n = jy6(G5(), c),
        l = wJ6(W).filter((W6) => W6.status === "running"),
        z6 = l.length > 0,
        A6 = z6 && l.every((W6) => W6.isIdle),
        e = 0;
    if (!f) {
        for (let W6 of Object.values(W))
            if (EJ(W6) && W6.status === "running") {
                if (W6.progress?.tokenCount) e += W6.progress.tokenCount
            }
    }
    let i = z.current !== null ? z.current - K.current - _.current : Date.now() - K.current - _.current,
        O6 = Math.round(Y.current / 4),
        J6 = "claude",
        $6 = "claudeShimmer",
        H6 = A ?? J6,
        q6 = O ?? $6,
        o = null;
    if (J && z6 && !k) return hq.createElement(u, {
        flexDirection: "column",
        width: "100%",
        alignItems: "flex-start"
    }, hq.createElement(u, {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 1,
        width: "100%"
    }, hq.createElement(T, {
        dimColor: !0
    }, EV, " Idle", !A6 && " · teammates running")), f && hq.createElement(CF8, {
        selectedIndex: v,
        isInSelectionMode: V === "selecting-agent",
        allIdle: A6,
        leaderTokenCount: O6,
        leaderIdleText: "Idle"
    }));
    if (k?.isIdle) {
        let W6 = A6 ? `${EV} Worked for ${C5(Date.now()-k.startTime)}` : `${EV} Idle`;
        return hq.createElement(u, {
            flexDirection: "column",
            width: "100%",
            alignItems: "flex-start"
        }, hq.createElement(u, {
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 1,
            width: "100%"
        }, hq.createElement(T, {
            dimColor: !0
        }, W6)), f && z6 && hq.createElement(CF8, {
            selectedIndex: v,
            isInSelectionMode: V === "selecting-agent",
            allIdle: A6,
            leaderVerb: J ? void 0 : F,
            leaderIdleText: J ? "Idle" : void 0,
            leaderTokenCount: O6
        }))
    }
    let _6 = !1,
        r = X.spinnerTipsEnabled !== !1,
        t = r && i > 1800000,
        Y6 = r && i > 30000 && !H8().btwUseCount,
        X6 = _6 ? void 0 : t && !m ? "Use /clear to start fresh when switching topics and free up context" : Y6 && !m ? "Use /btw to ask a quick side question without interrupting Claude's current work" : P,
        M6 = null;
    return hq.createElement(u, {
        flexDirection: "column",
        width: "100%",
        alignItems: "flex-start"
    }, hq.createElement(cAK, {
        mode: q,
        reducedMotion: M,
        hasActiveTools: H,
        responseLengthRef: Y,
        message: g,
        messageColor: H6,
        shimmerColor: q6,
        overrideColor: A,
        loadingStartTimeRef: K,
        totalPausedMsRef: _,
        pauseStartTimeRef: z,
        spinnerSuffix: $,
        verbose: j,
        columns: N,
        hasRunningTeammates: z6,
        teammateTokens: e,
        foregroundedTeammate: k,
        leaderIsIdle: J,
        thinkingStatus: h,
        effortSuffix: n
    }), f && z6 ? hq.createElement(CF8, {
        selectedIndex: v,
        isInSelectionMode: V === "selecting-agent",
        allIdle: A6,
        leaderVerb: J ? void 0 : F,
        leaderIdleText: J ? "Idle" : void 0,
        leaderTokenCount: O6
    }) : G && R && R.length > 0 ? hq.createElement(u, {
        width: "100%",
        flexDirection: "column"
    }, hq.createElement(_1, null, hq.createElement(NF8, {
        tasks: R
    }))) : m || X6 || M6 ? hq.createElement(u, {
        width: "100%",
        flexDirection: "column"
    }, M6 && hq.createElement(_1, null, hq.createElement(T, {
        dimColor: !0
    }, M6)), (m || X6) && hq.createElement(_1, null, hq.createElement(T, {
        dimColor: !0
    }, m ? `Next: ${m.subject}` : `Tip: ${X6}`))) : null)
}
// @from(Ln 339006, Col 0)
function N8Y(q) {
    let K = s(31),
        {
            mode: _,
            overrideMessage: z
        } = q,
        A = iO().prefersReducedMotion ?? !1,
        [O] = ix.useState(L8Y),
        w = z ?? O,
        $ = M8(y8Y),
        j, H;
    if (K[0] !== _) j = () => {
        let U = "spinner-" + _;
        return mt.startCLIActivity(U), () => {
            mt.endCLIActivity(U)
        }
    }, H = [_], K[0] = _, K[1] = j, K[2] = H;
    else j = K[1], H = K[2];
    ix.useEffect(j, H);
    let [, J] = _O(A ? null : 120), X = M8(E8Y), M = $ === "reconnecting" || $ === "disconnected", P = $ === "reconnecting" ? "Reconnecting" : "Disconnected", W = Math.floor(J / 300) % 3, D;
    if (K[3] !== W || K[4] !== A) D = A ? "…  " : ".".repeat(W + 1).padEnd(3), K[3] = W, K[4] = A, K[5] = D;
    else D = K[5];
    let Z = D,
        G;
    if (K[6] !== w) G = N1(w), K[6] = w, K[7] = G;
    else G = K[7];
    let f = G,
        v;
    if (K[8] !== A || K[9] !== M || K[10] !== J || K[11] !== w || K[12] !== f) {
        let U = A || M ? -100 : RAK(Math.floor(J / hAK), f);
        v = GF8(w, U), K[8] = A, K[9] = M, K[10] = J, K[11] = w, K[12] = f, K[13] = v
    } else v = K[13];
    let {
        before: V,
        shimmer: k,
        after: N
    } = v, {
        columns: R
    } = s1(), h = X > 0 ? `${X} in background` : "", C;
    if (K[14] !== P || K[15] !== M || K[16] !== f) C = M ? N1(P) : f, K[14] = P, K[15] = M, K[16] = f, K[17] = C;
    else C = K[17];
    let x = C + 3,
        B = Math.max(1, R - 2 - x - N1(h)),
        m;
    if (K[18] !== N || K[19] !== V || K[20] !== P || K[21] !== Z || K[22] !== k || K[23] !== M) m = M ? hq.createElement(T, {
        color: "error"
    }, P + Z) : hq.createElement(hq.Fragment, null, V ? hq.createElement(T, {
        dimColor: !0
    }, V) : null, k ? hq.createElement(T, null, k) : null, N ? hq.createElement(T, {
        dimColor: !0
    }, N) : null, hq.createElement(T, {
        dimColor: !0
    }, Z)), K[18] = N, K[19] = V, K[20] = P, K[21] = Z, K[22] = k, K[23] = M, K[24] = m;
    else m = K[24];
    let S;
    if (K[25] !== B || K[26] !== h) S = h ? hq.createElement(hq.Fragment, null, hq.createElement(T, null, " ".repeat(B)), hq.createElement(T, {
        color: "subtle"
    }, h)) : null, K[25] = B, K[26] = h, K[27] = S;
    else S = K[27];
    let F;
    if (K[28] !== m || K[29] !== S) F = hq.createElement(u, {
        flexDirection: "row",
        width: "100%",
        marginTop: 1,
        paddingLeft: 2
    }, m, S), K[28] = m, K[29] = S, K[30] = F;
    else F = K[30];
    return F
}
// @from(Ln 339076, Col 0)
function E8Y(q) {
    return w7(Object.values(q.tasks), yH) + q.remoteBackgroundTaskCount
}
// @from(Ln 339080, Col 0)
function y8Y(q) {
    return q.remoteConnectionStatus
}
// @from(Ln 339084, Col 0)
function L8Y() {
    return LJ(AJ6()) ?? "Working"
}
// @from(Ln 339088, Col 0)
function tAK() {
    let q = s(9),
        K = M8(R8Y),
        _ = M8(h8Y),
        {
            columns: z
        } = s1(),
        O = K === "reconnecting" || K === "disconnected" ? K === "reconnecting" ? "Reconnecting…" : "Disconnected" : "",
        w = _ > 0 ? `${_} in background` : "";
    if (!O && !w) {
        let X;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) X = hq.createElement(u, {
            height: 2
        }), q[0] = X;
        else X = q[0];
        return X
    }
    let $ = Math.max(1, z - 2 - N1(O) - N1(w)),
        j;
    if (q[1] !== O) j = O ? hq.createElement(T, {
        color: "error"
    }, O) : null, q[1] = O, q[2] = j;
    else j = q[2];
    let H;
    if (q[3] !== $ || q[4] !== w) H = w ? hq.createElement(hq.Fragment, null, hq.createElement(T, null, " ".repeat($)), hq.createElement(T, {
        color: "subtle"
    }, w)) : null, q[3] = $, q[4] = w, q[5] = H;
    else H = q[5];
    let J;
    if (q[6] !== j || q[7] !== H) J = hq.createElement(u, {
        marginTop: 1,
        paddingLeft: 2
    }, hq.createElement(T, null, j, H)), q[6] = j, q[7] = H, q[8] = J;
    else J = q[8];
    return J
}
// @from(Ln 339125, Col 0)
function h8Y(q) {
    return w7(Object.values(q.tasks), yH) + q.remoteBackgroundTaskCount
}
// @from(Ln 339129, Col 0)
function R8Y(q) {
    return q.remoteConnectionStatus
}
// @from(Ln 339133, Col 0)
function Y5() {
    let q = s(8),
        _ = iO().prefersReducedMotion ?? !1,
        [z, Y] = _O(_ ? null : 120);
    if (_) {
        let j;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) j = hq.createElement(T, {
            color: "text"
        }, "●"), q[0] = j;
        else j = q[0];
        let H;
        if (q[1] !== z) H = hq.createElement(u, {
            ref: z,
            flexWrap: "wrap",
            height: 1,
            width: 2
        }, j), q[1] = z, q[2] = H;
        else H = q[2];
        return H
    }
    let A = Math.floor(Y / 120) % aAK.length,
        O = aAK[A],
        w;
    if (q[3] !== O) w = hq.createElement(T, {
        color: "text"
    }, O), q[3] = O, q[4] = w;
    else w = q[4];
    let $;
    if (q[5] !== z || q[6] !== w) $ = hq.createElement(u, {
        ref: z,
        flexWrap: "wrap",
        height: 1,
        width: 2
    }, w), q[5] = z, q[6] = w, q[7] = $;
    else $ = q[7];
    return $
}
// @from(Ln 339171, Col 0)
function S8Y(q) {
    if (!q) return;
    let K = q.filter((z) => z.status === "pending");
    if (K.length === 0) return;
    let _ = new Set(q.filter((z) => z.status !== "completed").map((z) => z.id));
    return K.find((z) => !z.blockedBy.some((Y) => _.has(Y))) ?? K[0]
}
// @from(Ln 339178, Col 4)
hq
// @from(Ln 339178, Col 8)
ix
// @from(Ln 339178, Col 12)
oAK
// @from(Ln 339178, Col 17)
aAK
// @from(Ln 339179, Col 4)
Ej = L(() => {
    o6();
    g6();
    $96();
    y8();
    B1();
    Q8();
    uc();
    c7();
    C17();
    pI8();
    GK();
    b17();
    yF8();
    N7();
    I4();
    n5();
    pAK();
    p48();
    lAK();
    tE();
    hx();
    hf();
    Sq();
    kh6();
    A3();
    y8();
    rAK();
    g6();
    h1();
    hq = K6(P6(), 1), ix = K6(P6(), 1), oAK = bE6(), aAK = [...oAK, ...[...oAK].reverse()]
})
// @from(Ln 339212, Col 0)
function p17(q) {
    let K = eD8(q),
        _ = (z) => ({
            needle: qA[z].firstParty,
            fallback: MT6(qA[z].bedrock, K)
        });
    return {
        sonnet: _(TQ),
        opus: _(vQ),
        haiku: _(VQ)
    }
}
// @from(Ln 339224, Col 0)
async function eAK(q) {
    if (q.authMethod === "bearer") return I8Y(q);
    try {
        let K = await qOK(q),
            z = {
                ...await iv6(),
                region: q.region,
                ...K && {
                    credentials: K
                }
            },
            {
                STSClient: Y,
                GetCallerIdentityCommand: A
            } = await Promise.resolve().then(() => K6(FG1(), 1)),
            O = await new Y(z).send(new A({})),
            w = O.Arn ?? O.UserId ?? "(unknown)",
            {
                BedrockClient: $,
                ListInferenceProfilesCommand: j
            } = await Promise.resolve().then(() => K6(Nl6(), 1)),
            H = new $(z),
            J = [],
            X;
        do {
            let M = await H.send(new j({
                ...X && {
                    nextToken: X
                },
                typeEquals: "SYSTEM_DEFINED"
            }));
            for (let P of M.inferenceProfileSummaries ?? [])
                if (P.inferenceProfileId?.includes("anthropic")) J.push(P.inferenceProfileId);
            X = M.nextToken
        } while (X);
        return {
            status: "ok",
            identity: w,
            profiles: J
        }
    } catch (K) {
        return {
            status: "error",
            ...x8Y(K, q)
        }
    }
}
// @from(Ln 339271, Col 0)
async function yC6(q, K) {
    let _;
    try {
        _ = await C8Y(q)
    } catch {
        return {
            ok: !1,
            reason: "auth"
        }
    }
    try {
        return await _.messages.create({
            model: K.replace(/\[1m\]$/i, ""),
            max_tokens: 1,
            messages: [{
                role: "user",
                content: "."
            }]
        }), {
            ok: !0
        }
    } catch (z) {
        let Y = z?.status;
        if (Y === 401) return {
            ok: !1,
            reason: "auth"
        };
        if (Y === 403) return {
            ok: !1,
            reason: "permission"
        };
        if (Y === 400 || Y === 404) return {
            ok: !1,
            reason: "model"
        };
        if (Y === 429) return {
            ok: !0
        };
        if (Y === void 0) return {
            ok: !1,
            reason: "network"
        };
        return {
            ok: !1,
            reason: "other"
        }
    }
}
// @from(Ln 339319, Col 0)
async function C8Y(q) {
    let [{
        AnthropicBedrock: K
    }, {
        getProxyFetchOptions: _
    }] = await Promise.all([Promise.resolve().then(() => (Sn6(), Rn6)), Promise.resolve().then(() => (_M(), Al6))]), z = {
        awsRegion: q.region,
        maxRetries: 0,
        fetchOptions: _()
    }, Y = await b8Y(q);
    switch (Y.kind) {
        case "bearer":
            return new K({
                ...z,
                apiKey: Y.token
            });
        case "sigv4":
            return new K({
                ...z,
                awsAccessKey: Y.accessKeyId,
                awsSecretKey: Y.secretAccessKey,
                awsSessionToken: Y.sessionToken
            });
        case "default":
            return new K(z)
    }
}
// @from(Ln 339346, Col 0)
async function b8Y(q) {
    if (q.authMethod === "bearer") return {
        kind: "bearer",
        token: q.bearerToken
    };
    let K = await qOK(q);
    if (!K) return {
        kind: "default"
    };
    let _ = await K();
    return {
        kind: "sigv4",
        accessKeyId: _.accessKeyId,
        secretAccessKey: _.secretAccessKey,
        sessionToken: _.sessionToken
    }
}
// @from(Ln 339363, Col 0)
async function I8Y(q) {
    let K = p17(q.region).haiku.fallback,
        _ = await yC6(q, K);
    if (_.ok) return {
        status: "ok",
        identity: "Bedrock API key",
        profiles: [],
        note: `Test request to ${K} succeeded.`
    };
    switch (_.reason) {
        case "auth":
            return {
                status: "error", error: "Invalid Bedrock API key. Check the key and try again."
            };
        case "permission":
            return {
                status: "error", error: "API key was rejected. Your IAM policy may be missing bedrock:CallWithBearerToken or bedrock:InvokeModel."
            };
        case "model":
            return {
                status: "ok", identity: "Bedrock API key", profiles: [], note: `The key works, but ${K} is not enabled in your account. Pin a model you have access to on the next step.`
            };
        case "network":
            return {
                status: "error", error: `Could not reach Bedrock in region "${q.region}". Check the region name and your network.`
            };
        case "other":
            return {
                status: "error", error: "The test request failed. Check the key and region."
            }
    }
}
// @from(Ln 339395, Col 0)
async function qOK(q) {
    switch (q.authMethod) {
        case "profile": {
            let {
                fromNodeProviderChain: K
            } = await Promise.resolve().then(() => K6(LT6(), 1));
            return K({
                profile: q.awsProfile,
                ignoreCache: !0
            })
        }
        case "accessKey":
            return async () => ({
                accessKeyId: q.accessKeyId,
                secretAccessKey: q.secretAccessKey,
                ...q.sessionToken && {
                    sessionToken: q.sessionToken
                }
            });
        case "environment":
            return;
        default:
            return
    }
}
// @from(Ln 339421, Col 0)
function x8Y(q, K) {
    let _ = q,
        z = _?.name ?? "Error",
        Y = _?.message ?? String(q),
        A = K.authMethod === "profile" ? `aws sso login --profile ${K.awsProfile}` : void 0;
    switch (z) {
        case "CredentialsProviderError":
            return K.authMethod === "profile" ? {
                error: `Could not load credentials for profile "${K.awsProfile}". If this is an SSO profile, run:`,
                command: A
            } : {
                error: `No AWS credentials found. ${Y}`
            };
        case "ExpiredTokenException":
        case "TokenRefreshRequired":
            return K.authMethod === "profile" ? {
                error: "SSO session expired. Run:",
                command: A
            } : {
                error: `Credentials expired. ${Y}`
            };
        case "ForbiddenException":
            return K.authMethod === "profile" ? {
                error: `SSO portal denied access to the role for profile "${K.awsProfile}". The permission set may have been revoked — check your AWS access portal.`
            } : {
                error: `Forbidden. ${Y}`
            };
        case "AccessDeniedException":
            return {
                error: `Access denied. Your IAM role needs bedrock:ListInferenceProfiles permission. ${Y}`
            };
        case "UnrecognizedClientException":
        case "InvalidSignatureException":
            return {
                error: `Invalid credentials. ${Y}`
            };
        case "UnknownEndpoint":
        case "ENOTFOUND":
            return {
                error: `Cannot reach AWS in region "${K.region}". Check the region name and your network.`
            };
        default:
            return {
                error: `${z}: ${Y}`
            }
    }
}
// @from(Ln 339468, Col 4)
F17 = L(() => {
    n76();
    i76();
    Sq();
    _M()
})
// @from(Ln 339475, Col 0)
function m8Y(q) {
    return /\[1m\]$/i.test(q) ? q : `${q}[1m]`
}
// @from(Ln 339479, Col 0)
function _OK() {
    let {
        goBack: q,
        goNext: K,
        updateWizardData: _,
        wizardData: z
    } = QK(), Y = z.discoveredProfiles ?? [], A = m3.useMemo(() => p17(z.region), [z.region]), O = m3.useMemo(() => Object.fromEntries(H96.map((G) => [G, process.env[u8Y[G]]?.trim() || void 0])), []), w = () => Object.fromEntries(H96.map((G) => [G, O[G] ?? l76(Y, A[G].needle) ?? A[G].fallback])), [$, j] = m3.useState(w), [H, J] = m3.useState({
        sonnet: "pending",
        opus: "pending",
        haiku: "pending"
    }), [X, M] = m3.useState("summary");
    if (m3.useEffect(() => {
            let G = !1;
            return J((f) => ({
                ...f,
                sonnet: "pending"
            })), yC6(z, $.sonnet).then((f) => {
                if (!G) J((v) => ({
                    ...v,
                    sonnet: f
                }))
            }), () => {
                G = !0
            }
        }, [$.sonnet]), m3.useEffect(() => {
            let G = !1;
            return J((f) => ({
                ...f,
                opus: "pending"
            })), yC6(z, $.opus).then((f) => {
                if (!G) J((v) => ({
                    ...v,
                    opus: f
                }))
            }), () => {
                G = !0
            }
        }, [$.opus]), m3.useEffect(() => {
            let G = !1;
            return J((f) => ({
                ...f,
                haiku: "pending"
            })), yC6(z, $.haiku).then((f) => {
                if (!G) J((v) => ({
                    ...v,
                    haiku: f
                }))
            }), () => {
                G = !0
            }
        }, [$.haiku]), X !== "summary") {
        let G = X.picking;
        return m3.default.createElement(B8Y, {
            key: G,
            tier: G,
            wizardData: z,
            profiles: Y,
            fallback: A[G].fallback,
            current: $[G],
            existingPin: O[G],
            onPick: (f) => {
                j((k) => ({
                    ...k,
                    [G]: f
                }));
                let v = H96.indexOf(G),
                    V = H96[v + 1];
                M(V ? {
                    picking: V
                } : "summary")
            },
            onCancel: () => M("summary")
        })
    }
    let W = H96.every((G) => H[G] !== "pending") && H96.some((G) => H[G] !== "pending" && H[G].ok),
        D = W && H96.some((G) => {
            let f = H[G];
            return f !== "pending" && f.ok && vo($[G])
        }),
        Z = (G) => {
            if (G === "manual") {
                M({
                    picking: "sonnet"
                });
                return
            }
            if (G === "pin" || G === "pin1m") {
                let f = (v) => {
                    let V = H[v];
                    if (V === "pending" || !V.ok) return;
                    let k = $[v];
                    return G === "pin1m" && vo(k) ? m8Y(k) : k
                };
                _({
                    pinSonnet: f("sonnet"),
                    pinOpus: f("opus"),
                    pinHaiku: f("haiku")
                })
            } else _({
                pinSonnet: void 0,
                pinOpus: void 0,
                pinHaiku: void 0
            });
            K()
        };
    return m3.default.createElement(HK, {
        subtitle: "Pin model versions"
    }, m3.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, m3.default.createElement(T, null, "Without pinning, Claude Code uses its built-in defaults. When a new model ships, your install will try to call it even if your account has not yet enabled it — Claude Code will fail to connect to Bedrock until you enable the model or pin to one you have."), m3.default.createElement(u, {
        flexDirection: "column"
    }, m3.default.createElement(T, {
        dimColor: !0
    }, "Each candidate is tested with a one-token request:"), H96.map((G) => m3.default.createElement(F8Y, {
        key: G,
        label: IF8[G],
        modelId: $[G],
        state: H[G]
    }))), m3.default.createElement(A1, {
        options: [...W ? [{
            label: "Pin the working models",
            value: "pin"
        }] : [], ...D ? [{
            label: "Pin the working models with 1M context",
            value: "pin1m"
        }] : [], {
            label: "Choose different models…",
            value: "manual"
        }, {
            label: "Skip — use Claude Code defaults (auto-updates)",
            value: "skip"
        }],
        onChange: Z,
        onCancel: q
    })))
}
// @from(Ln 339617, Col 0)
function B8Y({
    tier: q,
    wizardData: K,
    profiles: _,
    fallback: z,
    current: Y,
    existingPin: A,
    onPick: O,
    onCancel: w
}) {
    let $ = m3.useMemo(() => {
            let D = _.filter((Z) => Z.toLowerCase().includes(q)).sort().reverse();
            for (let Z of [z, Y, A])
                if (Z && !D.includes(Z)) D.push(Z);
            return D
        }, [_, q, z, Y, A]),
        [j, H] = m3.useState(() => Object.fromEntries($.map((D) => [D, "pending"])));
    m3.useEffect(() => {
        let D = !1;
        for (let Z of $) yC6(K, Z).then((G) => {
            if (!D) H((f) => ({
                ...f,
                [Z]: G
            }))
        });
        return () => {
            D = !0
        }
    }, []);
    let J = $.every((D) => j[D] !== "pending"),
        X = (D) => {
            let Z = j[D];
            return Z !== void 0 && Z !== "pending" && Z.ok
        },
        M = m3.useMemo(() => {
            if (!J) return $;
            return [...$].sort((D, Z) => (X(D) ? 0 : 1) - (X(Z) ? 0 : 1))
        }, [$, j, J]),
        P = M.map((D) => ({
            value: D,
            label: m3.default.createElement(p8Y, {
                id: D,
                state: j[D] ?? "pending",
                suffix: D === A ? "(currently pinned)" : D === z ? "(built-in default)" : D === Y ? "(selected)" : void 0
            })
        })),
        W = w7(_, (D) => D.toLowerCase().includes(q));
    return m3.default.createElement(HK, {
        subtitle: `Pin ${IF8[q]} model`
    }, m3.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, m3.default.createElement(T, {
        dimColor: !0
    }, W > 0 ? `${W} ${IF8[q]} ${O7(W,"profile")} in your account · each tested with a one-token request.` : `No ${IF8[q]} profiles found in your account.`), m3.default.createElement(A1, {
        key: J ? "settled" : "pending",
        options: P,
        defaultValue: J ? M.find(X) : Y,
        onChange: O,
        onCancel: w
    })))
}
// @from(Ln 339680, Col 0)
function p8Y(q) {
    let K = s(19),
        {
            id: _,
            state: z,
            suffix: Y
        } = q;
    if (z === "pending") {
        let H;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) H = m3.default.createElement(D4, {
            status: "pending",
            withSpace: !0
        }), K[0] = H;
        else H = K[0];
        let J;
        if (K[1] !== Y) J = Y && m3.default.createElement(T, {
            dimColor: !0
        }, " ", Y), K[1] = Y, K[2] = J;
        else J = K[2];
        let X;
        if (K[3] !== _ || K[4] !== J) X = m3.default.createElement(T, null, H, _, J), K[3] = _, K[4] = J, K[5] = X;
        else X = K[5];
        return X
    }
    if (z.ok) {
        let H;
        if (K[6] === Symbol.for("react.memo_cache_sentinel")) H = m3.default.createElement(D4, {
            status: "success",
            withSpace: !0
        }), K[6] = H;
        else H = K[6];
        let J;
        if (K[7] !== Y) J = Y && m3.default.createElement(T, {
            dimColor: !0
        }, " ", Y), K[7] = Y, K[8] = J;
        else J = K[8];
        let X;
        if (K[9] !== _ || K[10] !== J) X = m3.default.createElement(T, null, H, _, J), K[9] = _, K[10] = J, K[11] = X;
        else X = K[11];
        return X
    }
    let A;
    if (K[12] === Symbol.for("react.memo_cache_sentinel")) A = m3.default.createElement(D4, {
        status: "error",
        withSpace: !0
    }), K[12] = A;
    else A = K[12];
    let O = Y && ` ${Y}`,
        w = KOK[z.reason],
        $;
    if (K[13] !== w) $ = m3.default.createElement(T, {
        color: "error"
    }, "(", w, ")"), K[13] = w, K[14] = $;
    else $ = K[14];
    let j;
    if (K[15] !== _ || K[16] !== O || K[17] !== $) j = m3.default.createElement(T, {
        dimColor: !0
    }, A, _, O, " ", $), K[15] = _, K[16] = O, K[17] = $, K[18] = j;
    else j = K[18];
    return j
}
// @from(Ln 339742, Col 0)
function F8Y(q) {
    let K = s(26),
        {
            label: _,
            modelId: z,
            state: Y
        } = q;
    if (Y === "pending") {
        let J, X;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) J = m3.default.createElement(T, null, "  "), X = m3.default.createElement(Y5, null), K[0] = J, K[1] = X;
        else J = K[0], X = K[1];
        let M;
        if (K[2] !== _) M = _.padEnd(7), K[2] = _, K[3] = M;
        else M = K[3];
        let P;
        if (K[4] !== z || K[5] !== M) P = m3.default.createElement(u, null, J, X, m3.default.createElement(T, null, " ", M, "→ ", z)), K[4] = z, K[5] = M, K[6] = P;
        else P = K[6];
        return P
    }
    if (Y.ok) {
        let J;
        if (K[7] === Symbol.for("react.memo_cache_sentinel")) J = m3.default.createElement(D4, {
            status: "success",
            withSpace: !0
        }), K[7] = J;
        else J = K[7];
        let X;
        if (K[8] !== _) X = _.padEnd(7), K[8] = _, K[9] = X;
        else X = K[9];
        let M;
        if (K[10] !== z) M = m3.default.createElement(T, {
            color: "success"
        }, z), K[10] = z, K[11] = M;
        else M = K[11];
        let P;
        if (K[12] !== X || K[13] !== M) P = m3.default.createElement(T, null, "  ", J, X, "→ ", M), K[12] = X, K[13] = M, K[14] = P;
        else P = K[14];
        return P
    }
    let A;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) A = m3.default.createElement(D4, {
        status: "error",
        withSpace: !0
    }), K[15] = A;
    else A = K[15];
    let O;
    if (K[16] !== _) O = _.padEnd(7), K[16] = _, K[17] = O;
    else O = K[17];
    let w;
    if (K[18] !== z) w = m3.default.createElement(T, {
        dimColor: !0
    }, z), K[18] = z, K[19] = w;
    else w = K[19];
    let $ = KOK[Y.reason],
        j;
    if (K[20] !== $) j = m3.default.createElement(T, {
        color: "error"
    }, "(", $, ")"), K[20] = $, K[21] = j;
    else j = K[21];
    let H;
    if (K[22] !== O || K[23] !== w || K[24] !== j) H = m3.default.createElement(T, null, "  ", A, O, "→ ", w, " ", j), K[22] = O, K[23] = w, K[24] = j, K[25] = H;
    else H = K[25];
    return H
}
// @from(Ln 339806, Col 4)
m3
// @from(Ln 339806, Col 8)
H96
// @from(Ln 339806, Col 13)
IF8
// @from(Ln 339806, Col 18)
u8Y
// @from(Ln 339806, Col 23)
KOK
// @from(Ln 339807, Col 4)
zOK = L(() => {
    o6();
    g6();
    AJ();
    n76();
    gK();
    Y2();
    Ej();
    xA();
    Kw();
    F17();
    m3 = K6(P6(), 1), H96 = ["sonnet", "opus", "haiku"], IF8 = {
        sonnet: "Sonnet",
        opus: "Opus",
        haiku: "Haiku"
    }, u8Y = {
        sonnet: "ANTHROPIC_DEFAULT_SONNET_MODEL",
        opus: "ANTHROPIC_DEFAULT_OPUS_MODEL",
        haiku: "ANTHROPIC_DEFAULT_HAIKU_MODEL"
    };
    KOK = {
        auth: "auth failed",
        permission: "no InvokeModel permission",
        model: "not enabled in this account",
        network: "unreachable",
        other: "request failed"
    }
})
// @from(Ln 339836, Col 0)
function Q$(q) {
    let K = s(10),
        {
            message: _,
            bold: z,
            dimColor: Y,
            subtitle: A
        } = q,
        O = z === void 0 ? !1 : z,
        w = Y === void 0 ? !1 : Y,
        $;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) $ = LC6.default.createElement(Y5, null), K[0] = $;
    else $ = K[0];
    let j;
    if (K[1] !== O || K[2] !== w || K[3] !== _) j = LC6.default.createElement(u, {
        flexDirection: "row"
    }, $, LC6.default.createElement(T, {
        bold: O,
        dimColor: w
    }, " ", _)), K[1] = O, K[2] = w, K[3] = _, K[4] = j;
    else j = K[4];
    let H;
    if (K[5] !== A) H = A && LC6.default.createElement(T, {
        dimColor: !0
    }, A), K[5] = A, K[6] = H;
    else H = K[6];
    let J;
    if (K[7] !== j || K[8] !== H) J = LC6.default.createElement(u, {
        flexDirection: "column"
    }, j, H), K[7] = j, K[8] = H, K[9] = J;
    else J = K[9];
    return J
}
// @from(Ln 339869, Col 4)
LC6
// @from(Ln 339870, Col 4)
Qy = L(() => {
    o6();
    g6();
    Ej();
    LC6 = K6(P6(), 1)
})
// @from(Ln 339885, Col 0)
async function AOK() {
    let q = new Set,
        K = U8Y();
    for (let {
            path: _,
            re: z
        }
        of [{
            path: YOK(K, ".aws", "config"),
            re: /^\[(?:profile\s+)?([^\]]+)\]/gm
        }, {
            path: YOK(K, ".aws", "credentials"),
            re: /^\[([^\]]+)\]/gm
        }]) try {
        for (let Y of (await g8Y(_, "utf8")).matchAll(z)) {
            let A = Y[1]?.trim();
            if (A && !A.startsWith("sso-session ")) q.add(A)
        }
    } catch {}
    return [...q].sort()
}
// @from(Ln 339906, Col 4)
OOK = () => {}
// @from(Ln 339908, Col 0)
function $OK() {
    let q = s(10),
        {
            goBack: K,
            goToStep: _,
            updateWizardData: z,
            wizardData: Y
        } = QK(),
        A;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) A = {
        phase: "loading"
    }, q[0] = A;
    else A = q[0];
    let [O, w] = P2.useState(A), $, j;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) $ = () => {
        let J = !1;
        return AOK().then((X) => {
            if (!J) w({
                phase: "ready",
                profiles: X
            })
        }), () => {
            J = !0
        }
    }, j = [], q[1] = $, q[2] = j;
    else $ = q[1], j = q[2];
    if (P2.useEffect($, j), O.phase === "loading") {
        let J;
        if (q[3] === Symbol.for("react.memo_cache_sentinel")) J = P2.default.createElement(HK, {
            subtitle: "AWS profile"
        }, P2.default.createElement(Q$, {
            message: "Reading ~/.aws/config…"
        })), q[3] = J;
        else J = q[3];
        return J
    }
    let H;
    if (q[4] !== K || q[5] !== _ || q[6] !== O.profiles || q[7] !== z || q[8] !== Y) H = P2.default.createElement(d8Y, {
        profiles: O.profiles,
        wizardData: Y,
        goBack: K,
        goToStep: _,
        updateWizardData: z
    }), q[4] = K, q[5] = _, q[6] = O.profiles, q[7] = z, q[8] = Y, q[9] = H;
    else H = q[9];
    return H
}
// @from(Ln 339956, Col 0)
function d8Y(q) {
    let K = s(49),
        {
            profiles: _,
            wizardData: z,
            goBack: Y,
            goToStep: A,
            updateWizardData: O
        } = q,
        w = _.length > Q8Y,
        $;
    if (K[0] !== _ || K[1] !== z.awsProfile) $ = z.awsProfile && !_.includes(z.awsProfile), K[0] = _, K[1] = z.awsProfile, K[2] = $;
    else $ = K[2];
    let j = Boolean($),
        [H, J] = P2.useState(_.length === 0 || w || j),
        X;
    if (K[3] !== _ || K[4] !== w) X = w ? _.find(l8Y) : void 0, K[3] = _, K[4] = w, K[5] = X;
    else X = K[5];
    let M = X,
        [P, W] = P2.useState(z.awsProfile ?? M ?? ""),
        [D, Z] = P2.useState(P.length),
        [G, f] = P2.useState(null),
        v;
    if (K[6] !== H) v = {
        context: "Settings",
        isActive: H
    }, K[6] = H, K[7] = v;
    else v = K[7];
    G1("confirm:no", Y, v);
    let V;
    if (K[8] !== A || K[9] !== O) V = (U) => {
        O({
            awsProfile: U
        }), A(ut.REGION)
    }, K[8] = A, K[9] = O, K[10] = V;
    else V = K[10];
    let k = V;
    if (!H) {
        let U = _.length,
            g;
        if (K[11] !== _.length) g = O7(_.length, "profile"), K[11] = _.length, K[12] = g;
        else g = K[12];
        let c;
        if (K[13] !== _.length || K[14] !== g) c = P2.default.createElement(T, {
            dimColor: !0
        }, "Found ", U, " ", g, " in ~/.aws/config and ~/.aws/credentials."), K[13] = _.length, K[14] = g, K[15] = c;
        else c = K[15];
        let n;
        if (K[16] !== _) {
            let i;
            if (K[18] === Symbol.for("react.memo_cache_sentinel")) i = {
                label: "Type a different name…",
                value: wOK
            }, K[18] = i;
            else i = K[18];
            n = [..._.map(c8Y), i], K[16] = _, K[17] = n
        } else n = K[17];
        let l = z.awsProfile && _.includes(z.awsProfile) ? z.awsProfile : void 0,
            z6;
        if (K[19] !== k) z6 = (i) => {
            if (i === wOK) J(!0);
            else k(i)
        }, K[19] = k, K[20] = z6;
        else z6 = K[20];
        let A6;
        if (K[21] !== Y || K[22] !== z6 || K[23] !== n || K[24] !== l) A6 = P2.default.createElement(A1, {
            options: n,
            defaultValue: l,
            onChange: z6,
            onCancel: Y
        }), K[21] = Y, K[22] = z6, K[23] = n, K[24] = l, K[25] = A6;
        else A6 = K[25];
        let e;
        if (K[26] !== A6 || K[27] !== c) e = P2.default.createElement(HK, {
            subtitle: "AWS profile"
        }, P2.default.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, c, A6)), K[26] = A6, K[27] = c, K[28] = e;
        else e = K[28];
        return e
    }
    let N;
    if (K[29] !== k || K[30] !== P) N = () => {
        let U = P.trim();
        if (!U) {
            f("Profile name is required");
            return
        }
        f(null), k(U)
    }, K[29] = k, K[30] = P, K[31] = N;
    else N = K[31];
    let R = N,
        h;
    if (K[32] === Symbol.for("react.memo_cache_sentinel")) h = P2.default.createElement(z1, null, P2.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    }), P2.default.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), K[32] = h;
    else h = K[32];
    let C;
    if (K[33] === Symbol.for("react.memo_cache_sentinel")) C = P2.default.createElement(T, null, "The name from ~/.aws/config (after [profile …])."), K[33] = C;
    else C = K[33];
    let x;
    if (K[34] !== M || K[35] !== _.length || K[36] !== w) x = w && P2.default.createElement(T, {
        dimColor: !0
    }, "Found ", _.length, " profiles — too many to list.", M && ` Prepopulated with "${M}".`), K[34] = M, K[35] = _.length, K[36] = w, K[37] = x;
    else x = K[37];
    let B;
    if (K[38] === Symbol.for("react.memo_cache_sentinel")) B = P2.default.createElement(T, {
        dimColor: !0
    }, "If this is an SSO profile, run `aws sso login --profile NAME` first."), K[38] = B;
    else B = K[38];
    let m;
    if (K[39] !== D || K[40] !== R || K[41] !== P) m = P2.default.createElement(u, {
        marginTop: 1
    }, P2.default.createElement(l4, {
        value: P,
        onChange: W,
        onSubmit: R,
        placeholder: "my-bedrock-profile",
        columns: 60,
        cursorOffset: D,
        onChangeCursorOffset: Z,
        focus: !0,
        showCursor: !0
    })), K[39] = D, K[40] = R, K[41] = P, K[42] = m;
    else m = K[42];
    let S;
    if (K[43] !== G) S = G && P2.default.createElement(u, {
        marginTop: 1
    }, P2.default.createElement(T, {
        color: "error"
    }, G)), K[43] = G, K[44] = S;
    else S = K[44];
    let F;
    if (K[45] !== m || K[46] !== S || K[47] !== x) F = P2.default.createElement(HK, {
        subtitle: "AWS profile name",
        footerText: h
    }, P2.default.createElement(u, {
        flexDirection: "column"
    }, C, x, B, m, S)), K[45] = m, K[46] = S, K[47] = x, K[48] = F;
    else F = K[48];
    return F
}
// @from(Ln 340106, Col 0)
function c8Y(q) {
    return {
        label: q,
        value: q
    }
}
// @from(Ln 340113, Col 0)
function l8Y(q) {
    return q.toLowerCase().includes("bedrock")
}
// @from(Ln 340116, Col 4)
P2
// @from(Ln 340116, Col 8)
wOK = "__manual__"
// @from(Ln 340117, Col 4)
Q8Y = 12
// @from(Ln 340118, Col 4)
jOK = L(() => {
    o6();
    g6();
    C7();
    bK();
    gK();
    Nq();
    u7();
    Qy();
    NY();
    xA();
    Kw();
    OOK();
    fF8();
    P2 = K6(P6(), 1)
})
// @from(Ln 340135, Col 0)
function HOK() {
    let q = s(17),
        {
            goBack: K,
            goNext: _,
            updateWizardData: z,
            wizardData: Y
        } = QK(),
        [A, O] = GT.useState(Y.region ?? "us-east-1"),
        [w, $] = GT.useState(A.length),
        [j, H] = GT.useState(null),
        J;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Settings"
    }, q[0] = J;
    else J = q[0];
    G1("confirm:no", K, J);
    let X;
    if (q[1] !== _ || q[2] !== z || q[3] !== A) X = () => {
        let v = A.trim();
        if (!v) {
            H("Region is required");
            return
        }
        H(null), z({
            region: v
        }), _()
    }, q[1] = _, q[2] = z, q[3] = A, q[4] = X;
    else X = q[4];
    let M = X,
        P;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) P = GT.default.createElement(z1, null, GT.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    }), GT.default.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), q[5] = P;
    else P = q[5];
    let W, D;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) W = GT.default.createElement(T, null, "Where your Bedrock models are enabled."), D = GT.default.createElement(T, {
        dimColor: !0
    }, "Claude Code reads this from AWS_REGION, not ~/.aws/config — set it explicitly even if your profile has a region."), q[6] = W, q[7] = D;
    else W = q[6], D = q[7];
    let Z;
    if (q[8] !== w || q[9] !== M || q[10] !== A) Z = GT.default.createElement(u, {
        marginTop: 1
    }, GT.default.createElement(l4, {
        value: A,
        onChange: O,
        onSubmit: M,
        placeholder: "us-east-1",
        columns: 40,
        cursorOffset: w,
        onChangeCursorOffset: $,
        focus: !0,
        showCursor: !0
    })), q[8] = w, q[9] = M, q[10] = A, q[11] = Z;
    else Z = q[11];
    let G;
    if (q[12] !== j) G = j && GT.default.createElement(u, {
        marginTop: 1
    }, GT.default.createElement(T, {
        color: "error"
    }, j)), q[12] = j, q[13] = G;
    else G = q[13];
    let f;
    if (q[14] !== Z || q[15] !== G) f = GT.default.createElement(HK, {
        subtitle: "AWS region",
        footerText: P
    }, GT.default.createElement(u, {
        flexDirection: "column"
    }, W, D, Z, G)), q[14] = Z, q[15] = G, q[16] = f;
    else f = q[16];
    return f
}
// @from(Ln 340213, Col 4)
GT
// @from(Ln 340214, Col 4)
JOK = L(() => {
    o6();
    g6();
    C7();
    bK();
    Nq();
    u7();
    NY();
    xA();
    Kw();
    GT = K6(P6(), 1)
})
// @from(Ln 340227, Col 0)
function XOK() {
    let q = s(15),
        {
            goBack: K,
            goNext: _,
            updateWizardData: z,
            wizardData: Y
        } = QK(),
        [A, O] = dy.useState(Y.secretAccessKey ?? ""),
        [w, $] = dy.useState(A.length),
        [j, H] = dy.useState(null),
        J;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Settings"
    }, q[0] = J;
    else J = q[0];
    G1("confirm:no", K, J);
    let X;
    if (q[1] !== _ || q[2] !== z || q[3] !== A) X = () => {
        let G = A.trim();
        if (!G) {
            H("Secret access key is required");
            return
        }
        H(null), z({
            secretAccessKey: G
        }), _()
    }, q[1] = _, q[2] = z, q[3] = A, q[4] = X;
    else X = q[4];
    let M = X,
        P;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) P = dy.default.createElement(z1, null, dy.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    }), dy.default.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), q[5] = P;
    else P = q[5];
    let W;
    if (q[6] !== w || q[7] !== M || q[8] !== A) W = dy.default.createElement(u, {
        marginTop: 1
    }, dy.default.createElement(l4, {
        value: A,
        onChange: O,
        onSubmit: M,
        mask: "*",
        columns: 60,
        cursorOffset: w,
        onChangeCursorOffset: $,
        focus: !0,
        showCursor: !0
    })), q[6] = w, q[7] = M, q[8] = A, q[9] = W;
    else W = q[9];
    let D;
    if (q[10] !== j) D = j && dy.default.createElement(u, {
        marginTop: 1
    }, dy.default.createElement(T, {
        color: "error"
    }, j)), q[10] = j, q[11] = D;
    else D = q[11];
    let Z;
    if (q[12] !== W || q[13] !== D) Z = dy.default.createElement(HK, {
        subtitle: "AWS secret access key",
        footerText: P
    }, dy.default.createElement(u, {
        flexDirection: "column"
    }, W, D)), q[12] = W, q[13] = D, q[14] = Z;
    else Z = q[14];
    return Z
}
// @from(Ln 340300, Col 4)
dy
// @from(Ln 340301, Col 4)
MOK = L(() => {
    o6();
    g6();
    C7();
    bK();
    Nq();
    u7();
    NY();
    xA();
    Kw();
    dy = K6(P6(), 1)
})
// @from(Ln 340314, Col 0)
function POK() {
    let q = s(11),
        {
            goBack: K,
            goNext: _,
            updateWizardData: z,
            wizardData: Y
        } = QK(),
        [A, O] = rx.useState(Y.sessionToken ?? ""),
        [w, $] = rx.useState(A.length),
        j;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) j = {
        context: "Settings"
    }, q[0] = j;
    else j = q[0];
    G1("confirm:no", K, j);
    let H;
    if (q[1] !== _ || q[2] !== z || q[3] !== A) H = () => {
        z({
            sessionToken: A.trim() || void 0
        }), _()
    }, q[1] = _, q[2] = z, q[3] = A, q[4] = H;
    else H = q[4];
    let J = H,
        X;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) X = rx.default.createElement(z1, null, rx.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    }), rx.default.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), q[5] = X;
    else X = q[5];
    let M;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) M = rx.default.createElement(T, {
        dimColor: !0
    }, "Only needed for temporary credentials from STS. Leave empty for long-lived keys."), q[6] = M;
    else M = q[6];
    let P;
    if (q[7] !== w || q[8] !== J || q[9] !== A) P = rx.default.createElement(HK, {
        subtitle: "AWS session token (optional)",
        footerText: X
    }, rx.default.createElement(u, {
        flexDirection: "column"
    }, M, rx.default.createElement(u, {
        marginTop: 1
    }, rx.default.createElement(l4, {
        value: A,
        onChange: O,
        onSubmit: J,
        mask: "*",
        columns: 60,
        cursorOffset: w,
        onChangeCursorOffset: $,
        focus: !0,
        showCursor: !0
    })))), q[7] = w, q[8] = J, q[9] = A, q[10] = P;
    else P = q[10];
    return P
}
// @from(Ln 340376, Col 4)
rx
// @from(Ln 340377, Col 4)
WOK = L(() => {
    o6();
    g6();
    C7();
    bK();
    Nq();
    u7();
    NY();
    xA();
    Kw();
    rx = K6(P6(), 1)
})
// @from(Ln 340390, Col 0)
function DOK() {
    let {
        goBack: q,
        goNext: K,
        updateWizardData: _,
        wizardData: z
    } = QK(), [Y, A] = LM.useState({
        phase: "checking"
    });
    if (LM.useEffect(() => {
            let w = !1;
            return eAK(z).then(($) => {
                if (w) return;
                if ($.status === "ok") _({
                    verifiedIdentity: $.identity,
                    discoveredProfiles: $.profiles
                });
                else _({
                    verifiedIdentity: void 0,
                    discoveredProfiles: void 0
                });
                A({
                    phase: "done",
                    result: $
                })
            }), () => {
                w = !0
            }
        }, []), Y.phase === "checking") return LM.default.createElement(HK, {
        subtitle: "Verifying credentials"
    }, LM.default.createElement(Q$, {
        message: z.authMethod === "bearer" ? "Sending a test request to Bedrock…" : "Calling AWS STS and Bedrock…",
        subtitle: "This may take a few seconds."
    }));
    let {
        result: O
    } = Y;
    switch (O.status) {
        case "ok":
            return LM.default.createElement(HK, {
                subtitle: "Verification"
            }, LM.default.createElement(u, {
                flexDirection: "column",
                gap: 1
            }, LM.default.createElement(T, null, LM.default.createElement(D4, {
                status: "success",
                withSpace: !0
            }), "Authenticated as ", LM.default.createElement(T, {
                bold: !0
            }, O.identity)), LM.default.createElement(T, {
                dimColor: !0
            }, O.note ?? (O.profiles.length > 0 ? `Found ${O.profiles.length} Anthropic inference ${O7(O.profiles.length,"profile")} in this region.` : "No Anthropic inference profiles found in this region. You may still proceed — model defaults will use the built-in IDs.")), LM.default.createElement(A1, {
                options: [{
                    label: "Continue",
                    value: "continue"
                }],
                onChange: () => K(),
                onCancel: q
            })));
        case "error":
            return LM.default.createElement(HK, {
                subtitle: "Verification failed",
                color: "error"
            }, LM.default.createElement(u, {
                flexDirection: "column",
                gap: 1
            }, LM.default.createElement(u, {
                flexDirection: "column"
            }, LM.default.createElement(T, null, LM.default.createElement(D4, {
                status: "error",
                withSpace: !0
            }), O.error), O.command && LM.default.createElement(T, {
                bold: !0,
                color: "suggestion"
            }, "    ", O.command)), LM.default.createElement(A1, {
                options: [{
                    label: "Go back and fix",
                    value: "back"
                }, {
                    label: "Save anyway (skip verification)",
                    value: "skip"
                }],
                onChange: (w) => {
                    if (w === "back") q();
                    else K()
                },
                onCancel: q
            })))
    }
}
// @from(Ln 340480, Col 4)
LM
// @from(Ln 340481, Col 4)
ZOK = L(() => {
    g6();
    gK();
    Qy();
    Y2();
    xA();
    Kw();
    F17();
    LM = K6(P6(), 1)
})
// @from(Ln 340492, Col 0)
function xF8({
    onComplete: q,
    onCancel: K
}) {
    let _ = hC6.useRef(q);
    _.current = q;
    let [z] = hC6.default.useState(() => [TAK, $OK, kAK, GAK, XOK, POK, HOK, DOK, _OK, () => hC6.default.createElement(EAK, {
        onComplete: (Y) => _.current(Y)
    })]);
    return hC6.default.createElement(LX6, {
        steps: z,
        initialData: {},
        onComplete: () => {},
        onCancel: K,
        title: "Set up AWS Bedrock",
        showStepCounter: !1
    })
}
// @from(Ln 340510, Col 4)
hC6
// @from(Ln 340511, Col 4)
g17 = L(() => {
    xA();
    vAK();
    VAK();
    NAK();
    yAK();
    zOK();
    jOK();
    JOK();
    MOK();
    WOK();
    ZOK();
    hC6 = K6(P6(), 1)
})
// @from(Ln 340525, Col 4)
J96
// @from(Ln 340526, Col 4)
uF8 = L(() => {
    J96 = {
        AUTH_METHOD: 0,
        SERVICE_ACCOUNT: 1,
        PROJECT: 2,
        REGION: 3,
        VERIFY: 4,
        PIN_MODELS: 5,
        CONFIRM: 6
    }
})
// @from(Ln 340538, Col 0)
function fOK() {
    let q = s(12),
        {
            goBack: K,
            goToStep: _,
            updateWizardData: z,
            wizardData: Y
        } = QK(),
        A;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) A = {
        label: "Application Default Credentials (gcloud auth)",
        value: "adc"
    }, q[0] = A;
    else A = q[0];
    let O;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) O = {
        label: "Service account key file",
        value: "serviceAccount"
    }, q[1] = O;
    else O = q[1];
    let w;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) w = [A, O, {
        label: "Use credentials already in my environment",
        value: "environment"
    }], q[2] = w;
    else w = q[2];
    let $ = w,
        j;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) j = {
        adc: J96.PROJECT,
        serviceAccount: J96.SERVICE_ACCOUNT,
        environment: J96.PROJECT
    }, q[3] = j;
    else j = q[3];
    let H = j,
        J;
    if (q[4] !== _ || q[5] !== z) J = (W) => {
        let D = W;
        z({
            authMethod: D
        }), _(H[D])
    }, q[4] = _, q[5] = z, q[6] = J;
    else J = q[6];
    let X = J,
        M;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) M = U48.default.createElement(T, {
        dimColor: !0
    }, "Claude Code uses the standard GCP credential chain. Pick the method you already use with gcloud or in your deployment."), q[7] = M;
    else M = q[7];
    let P;
    if (q[8] !== K || q[9] !== X || q[10] !== Y.authMethod) P = U48.default.createElement(HK, {
        subtitle: "How do you authenticate to Google Cloud?"
    }, U48.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, M, U48.default.createElement(A1, {
        options: $,
        defaultValue: Y.authMethod,
        onChange: X,
        onCancel: K
    }))), q[8] = K, q[9] = X, q[10] = Y.authMethod, q[11] = P;
    else P = q[11];
    return P
}
// @from(Ln 340602, Col 4)
U48
// @from(Ln 340603, Col 4)
GOK = L(() => {
    o6();
    g6();
    gK();
    xA();
    Kw();
    uF8();
    U48 = K6(P6(), 1)
})
// @from(Ln 340613, Col 0)
function n8Y(q) {
    let K = {
        CLAUDE_CODE_USE_VERTEX: "1",
        CLAUDE_CODE_USE_BEDROCK: void 0,
        CLAUDE_CODE_USE_FOUNDRY: void 0,
        CLAUDE_CODE_USE_ANTHROPIC_AWS: void 0,
        ANTHROPIC_VERTEX_PROJECT_ID: q.projectId,
        CLOUD_ML_REGION: q.region,
        GOOGLE_APPLICATION_CREDENTIALS: void 0,
        ANTHROPIC_DEFAULT_SONNET_MODEL: void 0,
        ANTHROPIC_DEFAULT_OPUS_MODEL: void 0,
        ANTHROPIC_DEFAULT_HAIKU_MODEL: void 0,
        ANTHROPIC_SMALL_FAST_MODEL: void 0
    };
    if (q.authMethod === "serviceAccount") K.GOOGLE_APPLICATION_CREDENTIALS = q.keyFile;
    if (q.pinSonnet) K.ANTHROPIC_DEFAULT_SONNET_MODEL = q.pinSonnet;
    if (q.pinOpus) K.ANTHROPIC_DEFAULT_OPUS_MODEL = q.pinOpus;
    if (q.pinHaiku) K.ANTHROPIC_DEFAULT_HAIKU_MODEL = q.pinHaiku;
    return K
}
// @from(Ln 340634, Col 0)
function vOK(q) {
    let K = s(32),
        {
            onComplete: _
        } = q,
        {
            goBack: z,
            wizardData: Y
        } = QK(),
        [A, O] = OS.useState(null),
        w;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = DJ8(Ww("userSettings") ?? "~/.claude/settings.json"), K[0] = w;
    else w = K[0];
    let $ = w,
        j;
    if (K[1] !== Y) j = n8Y(Y), K[1] = Y, K[2] = j;
    else j = K[2];
    let H = j,
        J;
    if (K[3] !== H) J = Object.entries(H).filter(r8Y), K[3] = H, K[4] = J;
    else J = K[4];
    let X = J,
        M;
    if (K[5] !== H || K[6] !== _ || K[7] !== Y.authMethod || K[8] !== Y.pinHaiku || K[9] !== Y.pinOpus || K[10] !== Y.pinSonnet || K[11] !== Y.verifiedIdentity) M = () => {
        let {
            error: N
        } = P7("userSettings", {
            env: H
        });
        if (N) {
            O(N.message);
            return
        }
        d("tengu_vertex_setup_complete", {
            auth_method: Y.authMethod,
            pinned_models: String(Boolean(Y.pinSonnet || Y.pinOpus || Y.pinHaiku)),
            verified: String(Boolean(Y.verifiedIdentity))
        }), _(`Vertex AI configuration saved to ${$}.${Y.authMethod==="adc"?" When your ADC token expires, run `gcloud auth application-default login` — Claude Code picks up refreshed credentials automatically.":""}`)
    }, K[5] = H, K[6] = _, K[7] = Y.authMethod, K[8] = Y.pinHaiku, K[9] = Y.pinOpus, K[10] = Y.pinSonnet, K[11] = Y.verifiedIdentity, K[12] = M;
    else M = K[12];
    let P = M,
        W;
    if (K[13] === Symbol.for("react.memo_cache_sentinel")) W = OS.default.createElement(T, null, "These will be written to ", $, " under env:"), K[13] = W;
    else W = K[13];
    let D;
    if (K[14] !== X) D = OS.default.createElement(u, {
        flexDirection: "column"
    }, X.map(i8Y)), K[14] = X, K[15] = D;
    else D = K[15];
    let Z;
    if (K[16] !== Y.verifiedIdentity) Z = Y.verifiedIdentity && OS.default.createElement(T, {
        dimColor: !0
    }, OS.default.createElement(D4, {
        status: "success",
        withSpace: !0
    }), "Verified as ", Y.verifiedIdentity), K[16] = Y.verifiedIdentity, K[17] = Z;
    else Z = K[17];
    let G;
    if (K[18] !== A) G = A && OS.default.createElement(T, {
        color: "error"
    }, A), K[18] = A, K[19] = G;
    else G = K[19];
    let f;
    if (K[20] === Symbol.for("react.memo_cache_sentinel")) f = [{
        label: "Save",
        value: "save"
    }, {
        label: "Cancel",
        value: "cancel"
    }], K[20] = f;
    else f = K[20];
    let v;
    if (K[21] !== z || K[22] !== P) v = (N) => {
        if (N === "save") P();
        else z()
    }, K[21] = z, K[22] = P, K[23] = v;
    else v = K[23];
    let V;
    if (K[24] !== z || K[25] !== v) V = OS.default.createElement(A1, {
        options: f,
        onChange: v,
        onCancel: z
    }), K[24] = z, K[25] = v, K[26] = V;
    else V = K[26];
    let k;
    if (K[27] !== V || K[28] !== D || K[29] !== Z || K[30] !== G) k = OS.default.createElement(HK, {
        subtitle: "Confirm and save"
    }, OS.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, W, D, Z, G, V)), K[27] = V, K[28] = D, K[29] = Z, K[30] = G, K[31] = k;
    else k = K[31];
    return k
}
// @from(Ln 340729, Col 0)
function i8Y(q) {
    let [K, _] = q;
    return OS.default.createElement(T, {
        key: K
    }, "  ", OS.default.createElement(T, {
        color: "suggestion"
    }, K), " = ", _)
}
// @from(Ln 340738, Col 0)
function r8Y(q) {
    return q[1] !== void 0
}
// @from(Ln 340741, Col 4)
OS
// @from(Ln 340742, Col 4)
TOK = L(() => {
    o6();
    g6();
    C8();
    b9();
    a1();
    gK();
    Y2();
    xA();
    Kw();
    OS = K6(P6(), 1)
})
// @from(Ln 340755, Col 0)
function Q17() {
    return {
        sonnet: qA[TQ].vertex,
        opus: qA[vQ].vertex,
        haiku: qA[VQ].vertex
    }
}
// @from(Ln 340763, Col 0)
function VOK(q) {
    let K = new Set;
    for (let _ of Object.values(qA))
        if (_.vertex.toLowerCase().includes(q)) K.add(_.vertex);
    return [...K].sort().reverse()
}
// @from(Ln 340770, Col 0)
function kOK(q) {
    if (q.authMethod === "serviceAccount" && q.keyFile) return {
        kind: "keyFile",
        path: q.keyFile
    };
    return {
        kind: "default"
    }
}
// @from(Ln 340779, Col 0)
async function NOK(q) {
    let K;
    try {
        let Y = await Jk6(kOK(q), q.projectId),
            A = (async () => {
                await (await Y.getClient()).getAccessToken()
            })(),
            O = new Promise(($, j) => setTimeout((H) => H(Error("Timed out waiting for GCP credentials")), o8Y, j));
        await Promise.race([A, O]);
        let w;
        try {
            w = (await Y.getCredentials()).client_email
        } catch {
            w = void 0
        }
        K = w ?? (q.authMethod === "serviceAccount" ? `service account (${q.keyFile})` : "Application Default Credentials")
    } catch (Y) {
        return {
            status: "error",
            ...s8Y(Y, q)
        }
    }
    let _ = Q17().haiku,
        z = await RC6(q, _);
    if (z.ok) return {
        status: "ok",
        identity: K,
        note: `Test request to ${_} succeeded.`
    };
    switch (z.reason) {
        case "auth":
            return {
                status: "error", error: "Got a token, but Vertex AI rejected it. The credential may lack the cloud-platform scope."
            };
        case "permission":
            return {
                status: "error", error: `Permission denied calling Vertex AI in project "${q.projectId}". The principal needs the aiplatform.endpoints.predict permission (Vertex AI User role), and the Vertex AI API must be enabled.`
            };
        case "model":
            return {
                status: "ok", identity: K, note: `Credentials work, but ${_} returned not-found in ${q.region}. Pin a model you have access to on the next step, or try the 'global' region.`
            };
        case "network":
            return {
                status: "error", error: `Could not reach Vertex AI in region "${q.region}". Check the region name and your network.`
            };
        case "other":
            return {
                status: "ok", identity: K, note: `Credentials work, but the test request to ${_} failed. You can pin a different model on the next step.`
            }
    }
}
// @from(Ln 340831, Col 0)
async function RC6(q, K) {
    let _;
    try {
        _ = await a8Y(q)
    } catch {
        return {
            ok: !1,
            reason: "auth"
        }
    }
    try {
        return await _.messages.create({
            model: K.replace(/\[1m\]$/i, ""),
            max_tokens: 1,
            messages: [{
                role: "user",
                content: "."
            }]
        }), {
            ok: !0
        }
    } catch (z) {
        let Y = z?.status;
        if (Y === 401) return {
            ok: !1,
            reason: "auth"
        };
        if (Y === 403) return {
            ok: !1,
            reason: "permission"
        };
        if (Y === 400 || Y === 404) return {
            ok: !1,
            reason: "model"
        };
        if (Y === 429) return {
            ok: !0
        };
        if (Y === void 0) return {
            ok: !1,
            reason: "network"
        };
        return {
            ok: !1,
            reason: "other"
        }
    }
}
// @from(Ln 340879, Col 0)
async function a8Y(q) {
    let [{
        AnthropicVertex: K
    }, {
        getProxyFetchOptions: _
    }] = await Promise.all([Promise.resolve().then(() => (jV8(), $V8)), Promise.resolve().then(() => (_M(), Al6))]), z = await Jk6(kOK(q), q.projectId);
    return new K({
        region: q.region,
        projectId: q.projectId,
        googleAuth: z,
        maxRetries: 0,
        timeout: 15000,
        fetchOptions: _()
    })
}
// @from(Ln 340895, Col 0)
function s8Y(q, K) {
    let _ = q?.message ?? String(q);
    if (K.authMethod === "serviceAccount" && /ENOENT|no such file/i.test(_)) return {
        error: `Service account key file not found: ${K.keyFile}`
    };
    if (/Could not load the default credentials/i.test(_)) return K.authMethod === "adc" ? {
        error: "No Application Default Credentials found. Run:",
        command: U17
    } : {
        error: "No GCP credentials found in the environment. Set GOOGLE_APPLICATION_CREDENTIALS or run gcloud auth application-default login."
    };
    if (/invalid_grant|Token has been expired|reauth/i.test(_)) {
        if (K.authMethod === "serviceAccount") return {
            error: "Service account credentials have been revoked or expired. Obtain a new key file from GCP IAM (IAM → Service Accounts → Keys → Add Key)."
        };
        if (K.authMethod === "adc") return {
            error: "GCP credentials expired. Run:",
            command: U17
        };
        return {
            error: "GCP credentials in the environment have expired or been revoked. Refresh them (gcloud auth application-default login for ADC, or replace the GOOGLE_APPLICATION_CREDENTIALS key file)."
        }
    }
    if (/Unable to detect a Project Id/i.test(_)) return {
        error: "Could not determine a GCP project from the credentials. Go back and set the project ID explicitly."
    };
    if (/Timed out waiting for GCP/i.test(_)) return {
        error: "Timed out resolving GCP credentials (no ADC, no key file, and no GCE metadata server).",
        ...K.authMethod === "adc" && {
            command: U17
        }
    };
    return {
        error: _
    }
}
// @from(Ln 340931, Col 4)
o8Y = 12000
// @from(Ln 340932, Col 4)
U17 = "gcloud auth application-default login"
// @from(Ln 340933, Col 4)
d17 = L(() => {
    i76();
    Sq();
    HV8()
})
// @from(Ln 340939, Col 0)
function e8Y(q) {
    return /\[1m\]$/i.test(q) ? q : `${q}[1m]`
}
// @from(Ln 340943, Col 0)
function yOK() {
    let {
        goBack: q,
        goNext: K,
        updateWizardData: _,
        wizardData: z
    } = QK(), Y = B3.useMemo(() => Q17(), []), A = B3.useMemo(() => Object.fromEntries(X96.map((D) => [D, process.env[t8Y[D]]?.trim() || void 0])), []), [O, w] = B3.useState(() => Object.fromEntries(X96.map((D) => [D, A[D] ?? Y[D]]))), [$, j] = B3.useState({
        sonnet: "pending",
        opus: "pending",
        haiku: "pending"
    }), [H, J] = B3.useState("summary");
    if (B3.useEffect(() => {
            let D = !1;
            return j((Z) => ({
                ...Z,
                sonnet: "pending"
            })), RC6(z, O.sonnet).then((Z) => {
                if (!D) j((G) => ({
                    ...G,
                    sonnet: Z
                }))
            }), () => {
                D = !0
            }
        }, [O.sonnet]), B3.useEffect(() => {
            let D = !1;
            return j((Z) => ({
                ...Z,
                opus: "pending"
            })), RC6(z, O.opus).then((Z) => {
                if (!D) j((G) => ({
                    ...G,
                    opus: Z
                }))
            }), () => {
                D = !0
            }
        }, [O.opus]), B3.useEffect(() => {
            let D = !1;
            return j((Z) => ({
                ...Z,
                haiku: "pending"
            })), RC6(z, O.haiku).then((Z) => {
                if (!D) j((G) => ({
                    ...G,
                    haiku: Z
                }))
            }), () => {
                D = !0
            }
        }, [O.haiku]), H !== "summary") {
        let D = H.picking;
        return B3.default.createElement(q1Y, {
            key: D,
            tier: D,
            wizardData: z,
            fallback: Y[D],
            current: O[D],
            existingPin: A[D],
            onPick: (Z) => {
                w((v) => ({
                    ...v,
                    [D]: Z
                }));
                let G = X96.indexOf(D),
                    f = X96[G + 1];
                J(f ? {
                    picking: f
                } : "summary")
            },
            onCancel: () => J("summary")
        })
    }
    let M = X96.every((D) => $[D] !== "pending") && X96.some((D) => $[D] !== "pending" && $[D].ok),
        P = M && X96.some((D) => {
            let Z = $[D];
            return Z !== "pending" && Z.ok && vo(O[D])
        }),
        W = (D) => {
            if (D === "manual") {
                J({
                    picking: "sonnet"
                });
                return
            }
            if (D === "pin" || D === "pin1m") {
                let Z = (G) => {
                    let f = $[G];
                    if (f === "pending" || !f.ok) return;
                    let v = O[G];
                    return D === "pin1m" && vo(v) ? e8Y(v) : v
                };
                _({
                    pinSonnet: Z("sonnet"),
                    pinOpus: Z("opus"),
                    pinHaiku: Z("haiku")
                })
            } else _({
                pinSonnet: void 0,
                pinOpus: void 0,
                pinHaiku: void 0
            });
            K()
        };
    return B3.default.createElement(HK, {
        subtitle: "Pin model versions"
    }, B3.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, B3.default.createElement(T, null, "Without pinning, Claude Code uses its built-in defaults. When a new model ships, your install will try to call it even if it is not yet available in your project — Claude Code will fail to connect to Vertex AI until you enable the model or pin to one you have."), B3.default.createElement(u, {
        flexDirection: "column"
    }, B3.default.createElement(T, {
        dimColor: !0
    }, "Each candidate is tested with a one-token request:"), X96.map((D) => B3.default.createElement(_1Y, {
        key: D,
        label: c17[D],
        modelId: O[D],
        state: $[D]
    }))), B3.default.createElement(A1, {
        options: [...M ? [{
            label: "Pin the working models",
            value: "pin"
        }] : [], ...P ? [{
            label: "Pin the working models with 1M context",
            value: "pin1m"
        }] : [], {
            label: "Choose different models…",
            value: "manual"
        }, {
            label: "Skip — use Claude Code defaults (auto-updates)",
            value: "skip"
        }],
        onChange: W,
        onCancel: q
    })))
}
// @from(Ln 341080, Col 0)
function q1Y({
    tier: q,
    wizardData: K,
    fallback: _,
    current: z,
    existingPin: Y,
    onPick: A,
    onCancel: O
}) {
    let w = B3.useMemo(() => {
            let P = VOK(q);
            for (let W of [_, z, Y])
                if (W && !P.includes(W)) P.push(W);
            return P
        }, [q, _, z, Y]),
        [$, j] = B3.useState(() => Object.fromEntries(w.map((P) => [P, "pending"])));
    B3.useEffect(() => {
        let P = !1;
        for (let W of w) RC6(K, W).then((D) => {
            if (!P) j((Z) => ({
                ...Z,
                [W]: D
            }))
        });
        return () => {
            P = !0
        }
    }, []);
    let H = w.every((P) => $[P] !== "pending"),
        J = (P) => {
            let W = $[P];
            return W !== void 0 && W !== "pending" && W.ok
        },
        X = B3.useMemo(() => {
            if (!H) return w;
            return [...w].sort((P, W) => (J(P) ? 0 : 1) - (J(W) ? 0 : 1))
        }, [w, $, H]),
        M = X.map((P) => ({
            value: P,
            label: B3.default.createElement(K1Y, {
                id: P,
                state: $[P] ?? "pending",
                suffix: P === Y ? "(currently pinned)" : P === _ ? "(built-in default)" : P === z ? "(selected)" : void 0
            })
        }));
    return B3.default.createElement(HK, {
        subtitle: `Pin ${c17[q]} model`
    }, B3.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, B3.default.createElement(T, {
        dimColor: !0
    }, "Available ", c17[q], " versions on Vertex AI · each tested with a one-token request."), B3.default.createElement(A1, {
        key: H ? "settled" : "pending",
        options: M,
        defaultValue: H ? J(z) ? z : J(_) ? _ : X.find(J) : z,
        onChange: A,
        onCancel: O
    })))
}
// @from(Ln 341141, Col 0)
function K1Y(q) {
    let K = s(19),
        {
            id: _,
            state: z,
            suffix: Y
        } = q;
    if (z === "pending") {
        let H;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) H = B3.default.createElement(D4, {
            status: "pending",
            withSpace: !0
        }), K[0] = H;
        else H = K[0];
        let J;
        if (K[1] !== Y) J = Y && B3.default.createElement(T, {
            dimColor: !0
        }, " ", Y), K[1] = Y, K[2] = J;
        else J = K[2];
        let X;
        if (K[3] !== _ || K[4] !== J) X = B3.default.createElement(T, null, H, _, J), K[3] = _, K[4] = J, K[5] = X;
        else X = K[5];
        return X
    }
    if (z.ok) {
        let H;
        if (K[6] === Symbol.for("react.memo_cache_sentinel")) H = B3.default.createElement(D4, {
            status: "success",
            withSpace: !0
        }), K[6] = H;
        else H = K[6];
        let J;
        if (K[7] !== Y) J = Y && B3.default.createElement(T, {
            dimColor: !0
        }, " ", Y), K[7] = Y, K[8] = J;
        else J = K[8];
        let X;
        if (K[9] !== _ || K[10] !== J) X = B3.default.createElement(T, null, H, _, J), K[9] = _, K[10] = J, K[11] = X;
        else X = K[11];
        return X
    }
    let A;
    if (K[12] === Symbol.for("react.memo_cache_sentinel")) A = B3.default.createElement(D4, {
        status: "error",
        withSpace: !0
    }), K[12] = A;
    else A = K[12];
    let O = Y && ` ${Y}`,
        w = EOK[z.reason],
        $;
    if (K[13] !== w) $ = B3.default.createElement(T, {
        color: "error"
    }, "(", w, ")"), K[13] = w, K[14] = $;
    else $ = K[14];
    let j;
    if (K[15] !== _ || K[16] !== O || K[17] !== $) j = B3.default.createElement(T, {
        dimColor: !0
    }, A, _, O, " ", $), K[15] = _, K[16] = O, K[17] = $, K[18] = j;
    else j = K[18];
    return j
}
// @from(Ln 341203, Col 0)
function _1Y(q) {
    let K = s(26),
        {
            label: _,
            modelId: z,
            state: Y
        } = q;
    if (Y === "pending") {
        let J, X;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) J = B3.default.createElement(T, null, "  "), X = B3.default.createElement(Y5, null), K[0] = J, K[1] = X;
        else J = K[0], X = K[1];
        let M;
        if (K[2] !== _) M = _.padEnd(7), K[2] = _, K[3] = M;
        else M = K[3];
        let P;
        if (K[4] !== z || K[5] !== M) P = B3.default.createElement(u, null, J, X, B3.default.createElement(T, null, " ", M, "→ ", z)), K[4] = z, K[5] = M, K[6] = P;
        else P = K[6];
        return P
    }
    if (Y.ok) {
        let J;
        if (K[7] === Symbol.for("react.memo_cache_sentinel")) J = B3.default.createElement(D4, {
            status: "success",
            withSpace: !0
        }), K[7] = J;
        else J = K[7];
        let X;
        if (K[8] !== _) X = _.padEnd(7), K[8] = _, K[9] = X;
        else X = K[9];
        let M;
        if (K[10] !== z) M = B3.default.createElement(T, {
            color: "success"
        }, z), K[10] = z, K[11] = M;
        else M = K[11];
        let P;
        if (K[12] !== X || K[13] !== M) P = B3.default.createElement(T, null, "  ", J, X, "→ ", M), K[12] = X, K[13] = M, K[14] = P;
        else P = K[14];
        return P
    }
    let A;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) A = B3.default.createElement(D4, {
        status: "error",
        withSpace: !0
    }), K[15] = A;
    else A = K[15];
    let O;
    if (K[16] !== _) O = _.padEnd(7), K[16] = _, K[17] = O;
    else O = K[17];
    let w;
    if (K[18] !== z) w = B3.default.createElement(T, {
        dimColor: !0
    }, z), K[18] = z, K[19] = w;
    else w = K[19];
    let $ = EOK[Y.reason],
        j;
    if (K[20] !== $) j = B3.default.createElement(T, {
        color: "error"
    }, "(", $, ")"), K[20] = $, K[21] = j;
    else j = K[21];
    let H;
    if (K[22] !== O || K[23] !== w || K[24] !== j) H = B3.default.createElement(T, null, "  ", A, O, "→ ", w, " ", j), K[22] = O, K[23] = w, K[24] = j, K[25] = H;
    else H = K[25];
    return H
}
// @from(Ln 341267, Col 4)
B3
// @from(Ln 341267, Col 8)
X96
// @from(Ln 341267, Col 13)
c17
// @from(Ln 341267, Col 18)
t8Y
// @from(Ln 341267, Col 23)
EOK
// @from(Ln 341268, Col 4)
LOK = L(() => {
    o6();
    g6();
    AJ();
    gK();
    Y2();
    Ej();
    xA();
    Kw();
    d17();
    B3 = K6(P6(), 1), X96 = ["sonnet", "opus", "haiku"], c17 = {
        sonnet: "Sonnet",
        opus: "Opus",
        haiku: "Haiku"
    }, t8Y = {
        sonnet: "ANTHROPIC_DEFAULT_SONNET_MODEL",
        opus: "ANTHROPIC_DEFAULT_OPUS_MODEL",
        haiku: "ANTHROPIC_DEFAULT_HAIKU_MODEL"
    };
    EOK = {
        auth: "auth failed",
        permission: "no aiplatform.endpoints.predict permission",
        model: "not enabled in this project",
        network: "unreachable",
        other: "request failed"
    }
})
// @from(Ln 341305, Col 0)
async function ROK() {
    let q = new Set,
        K = process.env.CLOUDSDK_CONFIG ?? A1Y();
    try {
        let _ = Q48(K, "configurations");
        for (let z of await z1Y(_)) {
            if (!z.startsWith("config_")) continue;
            try {
                let Y = await hOK(Q48(_, z), "utf8");
                for (let A of Y.matchAll(/^project\s*=\s*(\S+)/gm)) {
                    let O = A[1]?.trim();
                    if (O) q.add(O)
                }
            } catch {}
        }
    } catch {}
    try {
        let _ = n8(await hOK(Q48(K, "application_default_credentials.json"), "utf8"));
        if (_.quota_project_id) q.add(_.quota_project_id)
    } catch {}
    return [...q].sort()
}
// @from(Ln 341328, Col 0)
function A1Y() {
    if (process.platform === "win32" && process.env.APPDATA) return Q48(process.env.APPDATA, "gcloud");
    return Q48(Y1Y(), ".config", "gcloud")
}
// @from(Ln 341332, Col 4)
SOK = L(() => {
    e8()
})
// @from(Ln 341336, Col 0)
function bOK() {
    let q = s(10),
        {
            goBack: K,
            goToStep: _,
            updateWizardData: z,
            wizardData: Y
        } = QK(),
        A;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) A = {
        phase: "loading"
    }, q[0] = A;
    else A = q[0];
    let [O, w] = W2.useState(A), $, j;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) $ = () => {
        let J = !1;
        return ROK().then((X) => {
            if (!J) w({
                phase: "ready",
                projects: X
            })
        }), () => {
            J = !0
        }
    }, j = [], q[1] = $, q[2] = j;
    else $ = q[1], j = q[2];
    if (W2.useEffect($, j), O.phase === "loading") {
        let J;
        if (q[3] === Symbol.for("react.memo_cache_sentinel")) J = W2.default.createElement(HK, {
            subtitle: "GCP project"
        }, W2.default.createElement(Q$, {
            message: "Reading ~/.config/gcloud…"
        })), q[3] = J;
        else J = q[3];
        return J
    }
    let H;
    if (q[4] !== K || q[5] !== _ || q[6] !== O.projects || q[7] !== z || q[8] !== Y) H = W2.default.createElement(w1Y, {
        projects: O.projects,
        wizardData: Y,
        goBack: K,
        goToStep: _,
        updateWizardData: z
    }), q[4] = K, q[5] = _, q[6] = O.projects, q[7] = z, q[8] = Y, q[9] = H;
    else H = q[9];
    return H
}
// @from(Ln 341384, Col 0)
function w1Y(q) {
    let K = s(45),
        {
            projects: _,
            wizardData: z,
            goBack: Y,
            goToStep: A,
            updateWizardData: O
        } = q,
        w = _.length > O1Y,
        $;
    if (K[0] !== _ || K[1] !== z.projectId) $ = z.projectId && !_.includes(z.projectId), K[0] = _, K[1] = z.projectId, K[2] = $;
    else $ = K[2];
    let j = Boolean($),
        [H, J] = W2.useState(_.length === 0 || w || j),
        [X, M] = W2.useState(z.projectId ?? ""),
        [P, W] = W2.useState(X.length),
        [D, Z] = W2.useState(null),
        G;
    if (K[3] !== H) G = {
        context: "Settings",
        isActive: H
    }, K[3] = H, K[4] = G;
    else G = K[4];
    G1("confirm:no", Y, G);
    let f;
    if (K[5] !== A || K[6] !== O) f = (S) => {
        O({
            projectId: S
        }), A(J96.REGION)
    }, K[5] = A, K[6] = O, K[7] = f;
    else f = K[7];
    let v = f;
    if (!H) {
        let S = _.length,
            F;
        if (K[8] !== _.length) F = O7(_.length, "project"), K[8] = _.length, K[9] = F;
        else F = K[9];
        let U;
        if (K[10] !== _.length || K[11] !== F) U = W2.default.createElement(T, {
            dimColor: !0
        }, "Found ", S, " ", F, " in your gcloud configurations."), K[10] = _.length, K[11] = F, K[12] = U;
        else U = K[12];
        let g;
        if (K[13] !== _) {
            let A6;
            if (K[15] === Symbol.for("react.memo_cache_sentinel")) A6 = {
                label: "Type a different project…",
                value: COK
            }, K[15] = A6;
            else A6 = K[15];
            g = [..._.map($1Y), A6], K[13] = _, K[14] = g
        } else g = K[14];
        let c = z.projectId && _.includes(z.projectId) ? z.projectId : void 0,
            n;
        if (K[16] !== v) n = (A6) => {
            if (A6 === COK) J(!0);
            else v(A6)
        }, K[16] = v, K[17] = n;
        else n = K[17];
        let l;
        if (K[18] !== Y || K[19] !== g || K[20] !== c || K[21] !== n) l = W2.default.createElement(A1, {
            options: g,
            defaultValue: c,
            onChange: n,
            onCancel: Y
        }), K[18] = Y, K[19] = g, K[20] = c, K[21] = n, K[22] = l;
        else l = K[22];
        let z6;
        if (K[23] !== l || K[24] !== U) z6 = W2.default.createElement(HK, {
            subtitle: "GCP project"
        }, W2.default.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, U, l)), K[23] = l, K[24] = U, K[25] = z6;
        else z6 = K[25];
        return z6
    }
    let V;
    if (K[26] !== v || K[27] !== X) V = () => {
        let S = X.trim();
        if (!S) {
            Z("Project ID is required");
            return
        }
        Z(null), v(S)
    }, K[26] = v, K[27] = X, K[28] = V;
    else V = K[28];
    let k = V,
        N;
    if (K[29] === Symbol.for("react.memo_cache_sentinel")) N = W2.default.createElement(z1, null, W2.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    }), W2.default.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), K[29] = N;
    else N = K[29];
    let R;
    if (K[30] === Symbol.for("react.memo_cache_sentinel")) R = W2.default.createElement(T, null, "The project where Vertex AI is enabled."), K[30] = R;
    else R = K[30];
    let h;
    if (K[31] !== _.length || K[32] !== w) h = w && W2.default.createElement(T, {
        dimColor: !0
    }, "Found ", _.length, " projects — too many to list."), K[31] = _.length, K[32] = w, K[33] = h;
    else h = K[33];
    let C;
    if (K[34] === Symbol.for("react.memo_cache_sentinel")) C = W2.default.createElement(T, {
        dimColor: !0
    }, "Find it with `gcloud config get-value project` or in the GCP console header."), K[34] = C;
    else C = K[34];
    let x;
    if (K[35] !== P || K[36] !== k || K[37] !== X) x = W2.default.createElement(u, {
        marginTop: 1
    }, W2.default.createElement(l4, {
        value: X,
        onChange: M,
        onSubmit: k,
        placeholder: "my-gcp-project",
        columns: 60,
        cursorOffset: P,
        onChangeCursorOffset: W,
        focus: !0,
        showCursor: !0
    })), K[35] = P, K[36] = k, K[37] = X, K[38] = x;
    else x = K[38];
    let B;
    if (K[39] !== D) B = D && W2.default.createElement(u, {
        marginTop: 1
    }, W2.default.createElement(T, {
        color: "error"
    }, D)), K[39] = D, K[40] = B;
    else B = K[40];
    let m;
    if (K[41] !== B || K[42] !== h || K[43] !== x) m = W2.default.createElement(HK, {
        subtitle: "GCP project ID",
        footerText: N
    }, W2.default.createElement(u, {
        flexDirection: "column"
    }, R, h, C, x, B)), K[41] = B, K[42] = h, K[43] = x, K[44] = m;
    else m = K[44];
    return m
}
// @from(Ln 341530, Col 0)
function $1Y(q) {
    return {
        label: q,
        value: q
    }
}
// @from(Ln 341536, Col 4)
W2
// @from(Ln 341536, Col 8)
COK = "__manual__"
// @from(Ln 341537, Col 4)
O1Y = 12
// @from(Ln 341538, Col 4)
IOK = L(() => {
    o6();
    g6();
    C7();
    bK();
    gK();
    Nq();
    u7();
    Qy();
    NY();
    xA();
    Kw();
    SOK();
    uF8();
    W2 = K6(P6(), 1)
})
// @from(Ln 341555, Col 0)
function xOK() {
    let q = s(17),
        {
            goBack: K,
            goNext: _,
            updateWizardData: z,
            wizardData: Y
        } = QK(),
        [A, O] = vT.useState(Y.region ?? "global"),
        [w, $] = vT.useState(A.length),
        [j, H] = vT.useState(null),
        J;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Settings"
    }, q[0] = J;
    else J = q[0];
    G1("confirm:no", K, J);
    let X;
    if (q[1] !== _ || q[2] !== z || q[3] !== A) X = () => {
        let v = A.trim();
        if (!v) {
            H("Region is required");
            return
        }
        H(null), z({
            region: v
        }), _()
    }, q[1] = _, q[2] = z, q[3] = A, q[4] = X;
    else X = q[4];
    let M = X,
        P;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) P = vT.default.createElement(z1, null, vT.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    }), vT.default.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), q[5] = P;
    else P = q[5];
    let W, D;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) W = vT.default.createElement(T, null, "Where Claude models are served from."), D = vT.default.createElement(T, {
        dimColor: !0
    }, "Use 'global' for the multi-region endpoint (recommended), or a specific location like us-east5 if you have regional quota."), q[6] = W, q[7] = D;
    else W = q[6], D = q[7];
    let Z;
    if (q[8] !== w || q[9] !== M || q[10] !== A) Z = vT.default.createElement(u, {
        marginTop: 1
    }, vT.default.createElement(l4, {
        value: A,
        onChange: O,
        onSubmit: M,
        placeholder: "global",
        columns: 40,
        cursorOffset: w,
        onChangeCursorOffset: $,
        focus: !0,
        showCursor: !0
    })), q[8] = w, q[9] = M, q[10] = A, q[11] = Z;
    else Z = q[11];
    let G;
    if (q[12] !== j) G = j && vT.default.createElement(u, {
        marginTop: 1
    }, vT.default.createElement(T, {
        color: "error"
    }, j)), q[12] = j, q[13] = G;
    else G = q[13];
    let f;
    if (q[14] !== Z || q[15] !== G) f = vT.default.createElement(HK, {
        subtitle: "Vertex AI region",
        footerText: P
    }, vT.default.createElement(u, {
        flexDirection: "column"
    }, W, D, Z, G)), q[14] = Z, q[15] = G, q[16] = f;
    else f = q[16];
    return f
}
// @from(Ln 341633, Col 4)
vT
// @from(Ln 341634, Col 4)
uOK = L(() => {
    o6();
    g6();
    C7();
    bK();
    Nq();
    u7();
    NY();
    xA();
    Kw();
    vT = K6(P6(), 1)
})