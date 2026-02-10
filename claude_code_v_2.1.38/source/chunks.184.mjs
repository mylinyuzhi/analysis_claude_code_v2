
// @from(Ln 476254, Col 0)
function Tjz(A) {
    let q = e(56),
        {
            apiKeyStatus: K,
            debug: Y,
            exitMessage: z,
            vimMode: w,
            mode: H,
            autoUpdaterResult: $,
            isAutoUpdating: O,
            verbose: _,
            onAutoUpdaterResult: J,
            onChangeIsUpdating: X,
            suggestions: D,
            selectedSuggestion: j,
            maxColumnWidth: M,
            toolPermissionContext: P,
            helpOpen: W,
            suppressHint: G,
            isLoading: f,
            tasksSelected: Z,
            teamsSelected: N,
            diffSelected: T,
            teammateFooterIndex: k,
            coordinatorTaskIndex: y,
            ideSelection: B,
            mcpClients: S,
            hasInput: m,
            isPasting: b,
            isInputWrapped: g,
            messages: U,
            isSearching: x,
            historyQuery: p,
            setHistoryQuery: l,
            historyFailedMatch: r
        } = A,
        s = b === void 0 ? !1 : b,
        O1 = g === void 0 ? !1 : g,
        T1 = $j(),
        N1;
    if (q[0] !== x || q[1] !== T1 || q[2] !== G) N1 = G || ugA(T1) || x, q[0] = x, q[1] = T1, q[2] = G, q[3] = N1;
    else N1 = q[3];
    let j1 = N1;
    if (D.length) {
        let M1;
        if (q[4] !== M || q[5] !== j || q[6] !== D) M1 = YO.createElement(I, {
            paddingX: 2,
            paddingY: 0
        }, YO.createElement(rU1, {
            suggestions: D,
            selectedSuggestion: j,
            maxColumnWidth: M
        })), q[4] = M, q[5] = j, q[6] = D, q[7] = M1;
        else M1 = q[7];
        return M1
    }
    if (W) {
        let M1;
        if (q[8] === Symbol.for("react.memo_cache_sentinel")) M1 = YO.createElement(vV6, {
            dimColor: !0,
            fixedWidth: !0,
            paddingX: 2
        }), q[8] = M1;
        else M1 = q[8];
        return M1
    }
    let q1;
    if (q[9] !== z || q[10] !== s || q[11] !== U || q[12] !== H || q[13] !== T1 || q[14] !== w) q1 = H === "prompt" && !z.show && !s && ugA(T1) && YO.createElement(YZq, {
        messages: U,
        vimMode: w
    }), q[9] = z, q[10] = s, q[11] = U, q[12] = H, q[13] = T1, q[14] = w, q[15] = q1;
    else q1 = q[15];
    let t;
    if (q[16] !== T || q[17] !== z || q[18] !== m || q[19] !== r || q[20] !== p || q[21] !== f || q[22] !== s || q[23] !== x || q[24] !== H || q[25] !== l || q[26] !== j1 || q[27] !== Z || q[28] !== k || q[29] !== N || q[30] !== P || q[31] !== w) t = YO.createElement(eGq, {
        exitMessage: z,
        vimMode: w,
        mode: H,
        toolPermissionContext: P,
        suppressHint: j1,
        isLoading: f,
        hasInput: m,
        tasksSelected: Z,
        teamsSelected: N,
        diffSelected: T,
        teammateFooterIndex: k,
        isPasting: s,
        isSearching: x,
        historyQuery: p,
        setHistoryQuery: l,
        historyFailedMatch: r
    }), q[16] = T, q[17] = z, q[18] = m, q[19] = r, q[20] = p, q[21] = f, q[22] = s, q[23] = x, q[24] = H, q[25] = l, q[26] = j1, q[27] = Z, q[28] = k, q[29] = N, q[30] = P, q[31] = w, q[32] = t;
    else t = q[32];
    let J1;
    if (q[33] !== q1 || q[34] !== t) J1 = YO.createElement(I, {
        flexDirection: "column",
        flexShrink: 0
    }, q1, t), q[33] = q1, q[34] = t, q[35] = J1;
    else J1 = q[35];
    let D1;
    if (q[36] !== K || q[37] !== $ || q[38] !== Y || q[39] !== B || q[40] !== O || q[41] !== O1 || q[42] !== S || q[43] !== U || q[44] !== J || q[45] !== X || q[46] !== _) D1 = YO.createElement(nWq, {
        apiKeyStatus: K,
        autoUpdaterResult: $,
        debug: Y,
        isAutoUpdating: O,
        verbose: _,
        messages: U,
        onAutoUpdaterResult: J,
        onChangeIsUpdating: X,
        ideSelection: B,
        mcpClients: S,
        isInputWrapped: O1
    }), q[36] = K, q[37] = $, q[38] = Y, q[39] = B, q[40] = O, q[41] = O1, q[42] = S, q[43] = U, q[44] = J, q[45] = X, q[46] = _, q[47] = D1;
    else D1 = q[47];
    let Z1;
    if (q[48] !== J1 || q[49] !== D1) Z1 = YO.createElement(I, {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingX: 2,
        gap: 1
    }, J1, D1), q[48] = J1, q[49] = D1, q[50] = Z1;
    else Z1 = q[50];
    let E1 = Z ? y : void 0,
        a;
    if (q[51] !== E1) a = YO.createElement(wZq, {
        selectedIndex: E1
    }), q[51] = E1, q[52] = a;
    else a = q[52];
    let A1;
    if (q[53] !== a || q[54] !== Z1) A1 = YO.createElement(YO.Fragment, null, Z1, a), q[53] = a, q[54] = Z1, q[55] = A1;
    else A1 = q[55];
    return A1
}
// @from(Ln 476386, Col 4)
YO
// @from(Ln 476386, Col 8)
$Zq
// @from(Ln 476386, Col 13)
OZq
// @from(Ln 476387, Col 4)
_Zq = v(() => {
    i1();
    m1();
    qZq();
    gv6();
    zZq();
    cp();
    ghA();
    OxA();
    BgA();
    YO = o(X1(), 1), $Zq = o(X1(), 1);
    OZq = $Zq.memo(Tjz)
})
// @from(Ln 476401, Col 0)
function JZq(A, q) {
    let K = KE6.useRef(void 0);
    KE6.useEffect(() => {
        let Y = iV(A);
        if (K.current !== Y) K.current = Y;
        if (Y) Y.client.setNotificationHandler(Ejz, (z) => {
            if (K.current !== Y) return;
            try {
                let w = z.params,
                    H = w.lineStart !== void 0 ? w.lineStart + 1 : void 0,
                    $ = w.lineEnd !== void 0 ? w.lineEnd + 1 : void 0;
                q({
                    filePath: w.filePath,
                    lineStart: H,
                    lineEnd: $
                })
            } catch (w) {
                K1(w)
            }
        })
    }, [A, q])
}
// @from(Ln 476423, Col 4)
KE6
// @from(Ln 476423, Col 9)
vjz = "at_mentioned"
// @from(Ln 476424, Col 4)
Ejz
// @from(Ln 476425, Col 4)
XZq = v(() => {
    i7();
    q$();
    y6();
    KE6 = o(X1(), 1), Ejz = u.object({
        method: u.literal(vjz),
        params: u.object({
            filePath: u.string(),
            lineStart: u.number().optional(),
            lineEnd: u.number().optional()
        })
    })
})
// @from(Ln 476439, Col 0)
function DZq({
    maxBufferSize: A,
    debounceMs: q
}) {
    let [K, Y] = TF.useState([]), [z, w] = TF.useState(-1), H = TF.useRef(0), $ = TF.useRef(null), O = TF.useCallback((D, j, M = {}) => {
        let P = Date.now();
        if ($.current) clearTimeout($.current), $.current = null;
        if (P - H.current < q) {
            $.current = setTimeout(() => {
                O(D, j, M)
            }, q);
            return
        }
        H.current = P, Y((W) => {
            let G = z >= 0 ? W.slice(0, z + 1) : W,
                f = G[G.length - 1];
            if (f && f.text === D) return G;
            let Z = [...G, {
                text: D,
                cursorOffset: j,
                pastedContents: M,
                timestamp: P
            }];
            if (Z.length > A) return Z.slice(-A);
            return Z
        }), w((W) => {
            let G = W >= 0 ? W + 1 : K.length;
            return Math.min(G, A - 1)
        })
    }, [q, A, z, K.length]), _ = TF.useCallback(() => {
        if (z < 0 || K.length === 0) return;
        let D = Math.max(0, z - 1),
            j = K[D];
        if (j) return w(D), j;
        return
    }, [K, z]), J = TF.useCallback(() => {
        if (Y([]), w(-1), H.current = 0, $.current) clearTimeout($.current), $.current = null
    }, [H, $]), X = z > 0 && K.length > 1;
    return {
        pushToBuffer: O,
        undo: _,
        canUndo: X,
        clearBuffer: J
    }
}
// @from(Ln 476484, Col 4)
TF
// @from(Ln 476485, Col 4)
jZq = v(() => {
    TF = o(X1(), 1)
})
// @from(Ln 476489, Col 0)
function MZq(A) {
    return A === "tmux" || A === "iterm2"
}
// @from(Ln 476493, Col 0)
function PZq(A) {
    let q = iX(A);
    if (!q) return [];
    let K = [];
    for (let Y of q.members) {
        if (Y.name === "team-lead") continue;
        let w = Y.isActive !== !1 ? "running" : "idle";
        K.push({
            name: Y.name,
            agentId: Y.agentId,
            agentType: Y.agentType,
            model: Y.model,
            prompt: Y.prompt,
            status: w,
            color: Y.color,
            tmuxPaneId: Y.tmuxPaneId,
            cwd: Y.cwd,
            worktreePath: Y.worktreePath,
            isHidden: YR4(A, Y.tmuxPaneId),
            backendType: Y.backendType && MZq(Y.backendType) ? Y.backendType : void 0,
            mode: Y.mode
        })
    }
    return K
}
// @from(Ln 476518, Col 4)
WZq = v(() => {
    B6();
    hA();
    XN();
    Z6()
})
// @from(Ln 476528, Col 0)
function GZq({
    initialTeams: A,
    onDone: q
}) {
    DZ("teams-dialog");
    let K = L7(),
        Y = A?.[0]?.name ?? "",
        [z, w] = vF.useState({
            type: "teammateList",
            teamName: Y
        }),
        [H, $] = vF.useState(0),
        [O, _] = vF.useState(0),
        J = vF.useMemo(() => {
            return PZq(z.teamName)
        }, [z.teamName, O]);
    RX(() => {
        _((W) => W + 1)
    }, 1000);
    let X = vF.useMemo(() => {
            if (z.type !== "teammateDetail") return null;
            return J.find((W) => W.name === z.memberName) ?? null
        }, [z, J]),
        D = v6((W) => W.toolPermissionContext.isBypassPermissionsModeAvailable),
        j = () => {
            w({
                type: "teammateList",
                teamName: z.teamName
            }), $(0)
        },
        M = vF.useCallback(() => {
            if (z.type === "teammateDetail" && X) bjz(X, z.teamName, D), _((W) => W + 1);
            else if (z.type === "teammateList" && J.length > 0) ujz(J, z.teamName, D), _((W) => W + 1)
        }, [z, X, J, D]);
    c7({
        "confirm:cycleMode": M
    }, {
        context: "Confirmation"
    }), D8((W, G) => {
        if (G.leftArrow) {
            if (z.type === "teammateDetail") j();
            return
        }
        if (G.upArrow || G.downArrow) {
            let f = P();
            if (G.upArrow) $((Z) => Math.max(0, Z - 1));
            else $((Z) => Math.min(f, Z + 1));
            return
        }
        if (G.return) {
            if (z.type === "teammateList" && J[H]) w({
                type: "teammateDetail",
                teamName: z.teamName,
                memberName: J[H].name
            });
            else if (z.type === "teammateDetail" && X) hjz(X.tmuxPaneId), q();
            return
        }
        if (W === "k") {
            if (z.type === "teammateList" && J[H]) mgA(J[H].tmuxPaneId, z.teamName, J[H].agentId, J[H].name, K).then(() => {
                _((f) => f + 1), $((f) => Math.max(0, Math.min(f, J.length - 2)))
            });
            else if (z.type === "teammateDetail" && X) mgA(X.tmuxPaneId, z.teamName, X.agentId, X.name, K), j();
            return
        }
        if (W === "s") {
            if (z.type === "teammateList" && J[H]) {
                let f = J[H];
                GM6(f.name, z.teamName, "Graceful shutdown requested by team lead")
            } else if (z.type === "teammateDetail" && X) GM6(X.name, z.teamName, "Graceful shutdown requested by team lead"), j();
            return
        }
        if (W === "h") {
            let f = wW1(),
                Z = z.type === "teammateList" ? J[H] : z.type === "teammateDetail" ? X : null;
            if (Z && f?.supportsHideShow) {
                if (Ijz(Z, z.teamName).then(() => {
                        _((N) => N + 1)
                    }), z.type === "teammateDetail") j()
            }
            return
        }
        if (W === "H" && z.type === "teammateList") {
            if (wW1()?.supportsHideShow && J.length > 0) {
                let Z = J.some((N) => !N.isHidden);
                Promise.all(J.map((N) => Z ? fZq(N, z.teamName) : VZq(N, z.teamName))).then(() => {
                    _((N) => N + 1)
                })
            }
            return
        }
        if (W === "p" && z.type === "teammateList") {
            let f = J.filter((Z) => Z.status === "idle");
            if (f.length > 0) Promise.all(f.map((Z) => mgA(Z.tmuxPaneId, z.teamName, Z.agentId, Z.name, K))).then(() => {
                _((Z) => Z + 1), $((Z) => Math.max(0, Math.min(Z, J.length - f.length - 1)))
            });
            return
        }
    });

    function P() {
        if (z.type === "teammateList") return Math.max(0, J.length - 1);
        return 0
    }
    if (z.type === "teammateList") return t4.createElement(Ljz, {
        teamName: z.teamName,
        teammates: J,
        selectedIndex: H,
        onCancel: q
    });
    if (z.type === "teammateDetail" && X) return t4.createElement(yjz, {
        teammate: X,
        teamName: z.teamName,
        onCancel: j
    });
    return null
}
// @from(Ln 476646, Col 0)
function Ljz(A) {
    let q = e(13),
        {
            teamName: K,
            teammates: Y,
            selectedIndex: z,
            onCancel: w
        } = A,
        H = `${Y.length} ${Y.length===1?"teammate":"teammates"}`,
        $ = wW1()?.supportsHideShow ?? !1,
        O = RK("confirm:cycleMode", "Confirmation", "shift+tab"),
        _ = `Team ${K}`,
        J;
    if (q[0] !== z || q[1] !== Y) J = Y.length === 0 ? t4.createElement(V, {
        dimColor: !0
    }, "No teammates") : t4.createElement(I, {
        flexDirection: "column"
    }, Y.map((M, P) => t4.createElement(Rjz, {
        key: M.agentId,
        teammate: M,
        isSelected: P === z
    }))), q[0] = z, q[1] = Y, q[2] = J;
    else J = q[2];
    let X;
    if (q[3] !== w || q[4] !== H || q[5] !== _ || q[6] !== J) X = t4.createElement(w8, {
        title: _,
        subtitle: H,
        onCancel: w,
        color: "background",
        hideInputGuide: !0
    }, J), q[3] = w, q[4] = H, q[5] = _, q[6] = J, q[7] = X;
    else X = q[7];
    let D;
    if (q[8] !== O) D = t4.createElement(I, {
        marginLeft: 1
    }, t4.createElement(V, {
        dimColor: !0
    }, l1.arrowUp, "/", l1.arrowDown, " select · Enter view · k kill · s shutdown · p prune idle", $ && " · h hide/show · H hide/show all", " · ", O, " sync cycle modes for all · Esc close")), q[8] = O, q[9] = D;
    else D = q[9];
    let j;
    if (q[10] !== X || q[11] !== D) j = t4.createElement(t4.Fragment, null, X, D), q[10] = X, q[11] = D, q[12] = j;
    else j = q[12];
    return j
}
// @from(Ln 476691, Col 0)
function Rjz(A) {
    let q = e(21),
        {
            teammate: K,
            isSelected: Y
        } = A,
        z = K.status === "idle",
        w = z && !Y,
        H, $;
    if (q[0] !== K.mode) {
        let W = K.mode ? jC(K.mode) : "default";
        H = Rv1(W), $ = cP(W), q[0] = K.mode, q[1] = H, q[2] = $
    } else H = q[1], $ = q[2];
    let O = $,
        _ = Y ? "suggestion" : void 0,
        J = Y ? l1.pointer + " " : "  ",
        X;
    if (q[3] !== K.isHidden) X = K.isHidden && t4.createElement(V, {
        dimColor: !0
    }, "[hidden] "), q[3] = K.isHidden, q[4] = X;
    else X = q[4];
    let D;
    if (q[5] !== z) D = z && t4.createElement(V, {
        dimColor: !0
    }, "[idle] "), q[5] = z, q[6] = D;
    else D = q[6];
    let j;
    if (q[7] !== O || q[8] !== H) j = H && t4.createElement(V, {
        color: O
    }, H, " "), q[7] = O, q[8] = H, q[9] = j;
    else j = q[9];
    let M;
    if (q[10] !== K.model) M = K.model && t4.createElement(V, {
        dimColor: !0
    }, " (", K.model, ")"), q[10] = K.model, q[11] = M;
    else M = q[11];
    let P;
    if (q[12] !== w || q[13] !== _ || q[14] !== J || q[15] !== X || q[16] !== D || q[17] !== j || q[18] !== M || q[19] !== K.name) P = t4.createElement(V, {
        color: _,
        dimColor: w
    }, J, X, D, j, "@", K.name, M), q[12] = w, q[13] = _, q[14] = J, q[15] = X, q[16] = D, q[17] = j, q[18] = M, q[19] = K.name, q[20] = P;
    else P = q[20];
    return P
}
// @from(Ln 476736, Col 0)
function yjz(A) {
    let q = e(40),
        {
            teammate: K,
            teamName: Y,
            onCancel: z
        } = A,
        [w, H] = vF.useState(!1),
        $ = RK("confirm:cycleMode", "Confirmation", "shift+tab"),
        O = K.color ? lO[K.color] : void 0,
        _;
    if (q[0] !== Y || q[1] !== K.agentId || q[2] !== K.name) {
        let b = WX(Y),
            g;
        if (q[4] !== K.agentId || q[5] !== K.name) g = (U) => U.owner === K.agentId || U.owner === K.name, q[4] = K.agentId, q[5] = K.name, q[6] = g;
        else g = q[6];
        _ = b.filter(g), q[0] = Y, q[1] = K.agentId, q[2] = K.name, q[3] = _
    } else _ = q[3];
    let J = _,
        X;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) X = (b) => {
        if (b === "p") H(Sjz)
    }, q[7] = X;
    else X = q[7];
    D8(X);
    let D = K.worktreePath || K.cwd,
        j;
    if (q[8] !== K.model || q[9] !== K.worktreePath || q[10] !== D) {
        if (j = [], K.model) j.push(K.model);
        if (D) j.push(K.worktreePath ? `worktree: ${D}` : D);
        q[8] = K.model, q[9] = K.worktreePath, q[10] = D, q[11] = j
    } else j = q[11];
    let M = j.join(" · ") || void 0,
        P, W;
    if (q[12] !== K.mode) {
        let b = K.mode ? jC(K.mode) : "default";
        P = Rv1(b), W = cP(b), q[12] = K.mode, q[13] = P, q[14] = W
    } else P = q[13], W = q[14];
    let G = W,
        f;
    if (q[15] !== G || q[16] !== P) f = P && t4.createElement(V, {
        color: G
    }, P, " "), q[15] = G, q[16] = P, q[17] = f;
    else f = q[17];
    let Z;
    if (q[18] !== K.name || q[19] !== O) Z = O ? t4.createElement(V, {
        color: O
    }, `@${K.name}`) : `@${K.name}`, q[18] = K.name, q[19] = O, q[20] = Z;
    else Z = q[20];
    let N;
    if (q[21] !== f || q[22] !== Z) N = t4.createElement(t4.Fragment, null, f, Z), q[21] = f, q[22] = Z, q[23] = N;
    else N = q[23];
    let T = N,
        k;
    if (q[24] !== J) k = J.length > 0 && t4.createElement(I, {
        flexDirection: "column"
    }, t4.createElement(V, {
        bold: !0
    }, "Tasks"), J.map(Cjz)), q[24] = J, q[25] = k;
    else k = q[25];
    let y;
    if (q[26] !== w || q[27] !== K.prompt) y = K.prompt && t4.createElement(I, {
        flexDirection: "column"
    }, t4.createElement(V, {
        bold: !0
    }, "Prompt"), t4.createElement(V, null, w ? K.prompt : K3(K.prompt, 80), UA(K.prompt) > 80 && !w && t4.createElement(V, {
        dimColor: !0
    }, " (p to expand)"))), q[26] = w, q[27] = K.prompt, q[28] = y;
    else y = q[28];
    let B;
    if (q[29] !== z || q[30] !== M || q[31] !== k || q[32] !== y || q[33] !== T) B = t4.createElement(w8, {
        title: T,
        subtitle: M,
        onCancel: z,
        color: "background",
        hideInputGuide: !0
    }, k, y), q[29] = z, q[30] = M, q[31] = k, q[32] = y, q[33] = T, q[34] = B;
    else B = q[34];
    let S;
    if (q[35] !== $) S = t4.createElement(I, {
        marginLeft: 1
    }, t4.createElement(V, {
        dimColor: !0
    }, l1.arrowLeft, " back · Esc close · k kill · s shutdown", wW1()?.supportsHideShow && " · h hide/show", " · ", $, " cycle mode")), q[35] = $, q[36] = S;
    else S = q[36];
    let m;
    if (q[37] !== S || q[38] !== B) m = t4.createElement(t4.Fragment, null, B, S), q[37] = S, q[38] = B, q[39] = m;
    else m = q[39];
    return m
}
// @from(Ln 476827, Col 0)
function Cjz(A) {
    return t4.createElement(V, {
        key: A.id,
        color: A.status === "completed" ? "success" : void 0
    }, A.status === "completed" ? l1.tick : "◼", " ", A.subject)
}
// @from(Ln 476834, Col 0)
function Sjz(A) {
    return !A
}
// @from(Ln 476838, Col 0)
function ZZq(A) {
    return !A.startsWith("%")
}
// @from(Ln 476841, Col 0)
async function mgA(A, q, K, Y, z) {
    if (ZZq(A)) await IA("it2", ["session", "close", A]);
    else await IA("tmux", ["kill-pane", "-t", A]);
    zR4(q, A);
    let {
        notificationMessage: w
    } = Mr(q, K, Y, "terminated");
    z((H) => {
        if (!H.teamContext?.teammates) return H;
        if (!(K in H.teamContext.teammates)) return H;
        let {
            [K]: $, ...O
        } = H.teamContext.teammates;
        return {
            ...H,
            teamContext: {
                ...H.teamContext,
                teammates: O
            },
            inbox: {
                messages: [...H.inbox.messages, {
                    id: kjz(),
                    from: "system",
                    text: Q1({
                        type: "teammate_terminated",
                        message: w
                    }),
                    timestamp: new Date().toISOString(),
                    status: "pending"
                }]
            }
        }
    }), h(`[TeamsDialog] Removed ${K} from teamContext`)
}
// @from(Ln 476875, Col 0)
async function hjz(A) {
    if (ZZq(A)) await IA("it2", ["session", "focus", A]);
    else await IA("tmux", ["select-pane", "-t", A])
}
// @from(Ln 476879, Col 0)
async function Ijz(A, q) {
    if (A.isHidden) await VZq(A, q);
    else await fZq(A, q)
}
// @from(Ln 476883, Col 0)
async function fZq(A, q) {}
// @from(Ln 476884, Col 0)
async function VZq(A, q) {}
// @from(Ln 476886, Col 0)
function xjz(A, q, K) {
    xF1(q, A, K);
    let Y = TM6({
        mode: K,
        from: "team-lead"
    });
    f9(A, {
        from: "team-lead",
        text: Q1(Y),
        timestamp: new Date().toISOString()
    }, q), h(`[TeamsDialog] Sent mode change to ${A}: ${K}`)
}
// @from(Ln 476899, Col 0)
function bjz(A, q, K) {
    let Y = A.mode ? jC(A.mode) : "default",
        z = {
            ...QD(),
            mode: Y,
            isBypassPermissionsModeAvailable: K
        },
        w = hf1(z);
    xjz(A.name, q, w)
}
// @from(Ln 476910, Col 0)
function ujz(A, q, K) {
    if (A.length === 0) return;
    let Y = A.map(($) => $.mode ? jC($.mode) : "default"),
        w = !Y.every(($) => $ === Y[0]) ? "default" : hf1({
            ...QD(),
            mode: Y[0] ?? "default",
            isBypassPermissionsModeAvailable: K
        }),
        H = A.map(($) => ({
            memberName: $.name,
            mode: w
        }));
    $R4(q, H);
    for (let $ of A) {
        let O = TM6({
            mode: w,
            from: "team-lead"
        });
        f9($.name, {
            from: "team-lead",
            text: Q1(O),
            timestamp: new Date().toISOString()
        }, q)
    }
    h(`[TeamsDialog] Sent mode change to all ${A.length} teammates: ${w}`)
}
// @from(Ln 476936, Col 4)
t4
// @from(Ln 476936, Col 8)
vF
// @from(Ln 476937, Col 4)
NZq = v(() => {
    i1();
    m1();
    K7();
    s2();
    XZ();
    b7();
    WZq();
    tq();
    Z6();
    lM();
    UC1();
    LY();
    vq();
    vw();
    Bq();
    XN();
    JI();
    H$();
    xgA();
    oj();
    d8();
    m6();
    oS();
    t4 = o(X1(), 1), vF = o(X1(), 1)
})
// @from(Ln 476964, Col 0)
function TZq(A) {
    let q = A.match(/^@([\w-]+)\s+(.+)$/s);
    if (!q) return null;
    let [, K, Y] = q;
    if (!K || !Y) return null;
    let z = Y.trim();
    if (!z) return null;
    return {
        recipientName: K,
        message: z
    }
}
// @from(Ln 476977, Col 0)
function vZq(A, q, K, Y) {
    if (!K || !Y) return {
        success: !1,
        error: "no_team_context"
    };
    if (!Object.values(K.teammates ?? {}).find((w) => w.name === A)) return {
        success: !1,
        error: "unknown_recipient",
        recipientName: A
    };
    return Y(A, {
        from: "user",
        text: q,
        timestamp: new Date().toISOString()
    }, K.teamName), {
        success: !0,
        recipientName: A
    }
}
// @from(Ln 476997, Col 0)
function EZq() {
    let A = v6((Y) => Y.gitDiff),
        [q, K] = bf1.useState(new Map);
    return bf1.useEffect(() => {
        let Y = !1;
        return FF4().then((z) => {
            if (!Y) K(z)
        }), () => {
            Y = !0
        }
    }, [A.lastUpdated]), bf1.useMemo(() => {
        let {
            stats: Y,
            perFileStats: z
        } = A, w = [];
        for (let [H, $] of z) {
            let O = q.get(H),
                _ = $.isUntracked ?? !1,
                J = !$.isBinary && !_ && !O,
                X = $.added + $.removed,
                D = !J && !$.isBinary && X > Bjz;
            w.push({
                path: H,
                linesAdded: $.added,
                linesRemoved: $.removed,
                isBinary: $.isBinary,
                isLargeFile: J,
                isTruncated: D,
                isUntracked: _
            })
        }
        return w.sort((H, $) => H.path.localeCompare($.path)), {
            stats: Y,
            files: w,
            hunks: q
        }
    }, [A, q])
}
// @from(Ln 477035, Col 4)
bf1
// @from(Ln 477035, Col 9)
Bjz = 400
// @from(Ln 477036, Col 4)
kZq = v(() => {
    d8();
    rQ1();
    bf1 = o(X1(), 1)
})
// @from(Ln 477042, Col 0)
function mjz(A) {
    if (!A || typeof A !== "object") return !1;
    let q = A,
        K = typeof q.filePath === "string",
        Y = Array.isArray(q.structuredPatch) && q.structuredPatch.length > 0,
        z = q.type === "create" && typeof q.content === "string";
    return K && (Y || z)
}
// @from(Ln 477051, Col 0)
function Fjz(A) {
    return "type" in A && (A.type === "create" || A.type === "update")
}
// @from(Ln 477055, Col 0)
function Qjz(A) {
    let q = 0,
        K = 0;
    for (let Y of A)
        for (let z of Y.lines)
            if (z.startsWith("+")) q++;
            else if (z.startsWith("-")) K++;
    return {
        added: q,
        removed: K
    }
}
// @from(Ln 477068, Col 0)
function gjz(A) {
    if (A.type !== "user") return "";
    let q = A.message.content,
        K = typeof q === "string" ? q : "";
    if (K.length <= 30) return K;
    return K.slice(0, 29) + "…"
}
// @from(Ln 477076, Col 0)
function LZq(A) {
    let q = 0,
        K = 0;
    for (let Y of A.files.values()) q += Y.linesAdded, K += Y.linesRemoved;
    A.stats = {
        filesChanged: A.files.size,
        linesAdded: q,
        linesRemoved: K
    }
}
// @from(Ln 477087, Col 0)
function RZq(A) {
    let q = YE6.useRef({
        completedTurns: [],
        currentTurn: null,
        lastProcessedIndex: 0,
        lastTurnIndex: 0
    });
    return YE6.useMemo(() => {
        let K = q.current;
        if (A.length < K.lastProcessedIndex) K.completedTurns = [], K.currentTurn = null, K.lastProcessedIndex = 0, K.lastTurnIndex = 0;
        for (let z = K.lastProcessedIndex; z < A.length; z++) {
            let w = A[z];
            if (!w || w.type !== "user") continue;
            if (!(w.toolUseResult || Array.isArray(w.message.content) && w.message.content[0]?.type === "tool_result") && !w.isMeta) {
                if (K.currentTurn && K.currentTurn.files.size > 0) LZq(K.currentTurn), K.completedTurns.push(K.currentTurn);
                K.lastTurnIndex++, K.currentTurn = {
                    turnIndex: K.lastTurnIndex,
                    userPromptPreview: gjz(w),
                    timestamp: w.timestamp,
                    files: new Map,
                    stats: {
                        filesChanged: 0,
                        linesAdded: 0,
                        linesRemoved: 0
                    }
                }
            } else if (K.currentTurn && w.toolUseResult) {
                let $ = w.toolUseResult;
                if (mjz($)) {
                    let {
                        filePath: O,
                        structuredPatch: _
                    } = $, J = "type" in $ && $.type === "create", X = K.currentTurn.files.get(O);
                    if (!X) X = {
                        filePath: O,
                        hunks: [],
                        isNewFile: J,
                        linesAdded: 0,
                        linesRemoved: 0
                    }, K.currentTurn.files.set(O, X);
                    if (J && _.length === 0 && Fjz($)) {
                        let j = $.content.split(`
`),
                            M = {
                                oldStart: 0,
                                oldLines: 0,
                                newStart: 1,
                                newLines: j.length,
                                lines: j.map((P) => "+" + P)
                            };
                        X.hunks.push(M), X.linesAdded += j.length
                    } else {
                        X.hunks.push(..._);
                        let {
                            added: D,
                            removed: j
                        } = Qjz(_);
                        X.linesAdded += D, X.linesRemoved += j
                    }
                    if (J) X.isNewFile = !0
                }
            }
        }
        K.lastProcessedIndex = A.length;
        let Y = [...K.completedTurns];
        if (K.currentTurn && K.currentTurn.files.size > 0) LZq(K.currentTurn), Y.push(K.currentTurn);
        return Y.reverse()
    }, [A])
}
// @from(Ln 477156, Col 4)
YE6
// @from(Ln 477157, Col 4)
yZq = v(() => {
    YE6 = o(X1(), 1)
})
// @from(Ln 477161, Col 0)
function CZq(A) {
    let q = e(36),
        {
            files: K,
            selectedIndex: Y
        } = A,
        {
            columns: z
        } = Z8(),
        w;
    A: {
        if (K.length === 0 || K.length <= gc1) {
            let Z;
            if (q[0] !== K.length) Z = {
                startIndex: 0,
                endIndex: K.length
            }, q[0] = K.length, q[1] = Z;
            else Z = q[1];
            w = Z;
            break A
        }
        let W = Math.max(0, Y - Math.floor(gc1 / 2)),
            G = W + gc1;
        if (G > K.length) G = K.length,
        W = Math.max(0, G - gc1);
        let f;
        if (q[2] !== G || q[3] !== W) f = {
            startIndex: W,
            endIndex: G
        },
        q[2] = G,
        q[3] = W,
        q[4] = f;
        else f = q[4];w = f
    }
    let {
        startIndex: H,
        endIndex: $
    } = w;
    if (K.length === 0) {
        let W;
        if (q[5] === Symbol.for("react.memo_cache_sentinel")) W = vP.default.createElement(V, {
            dimColor: !0
        }, "No changed files"), q[5] = W;
        else W = q[5];
        return W
    }
    let O, _, J, X, D, j;
    if (q[6] !== z || q[7] !== $ || q[8] !== K || q[9] !== Y || q[10] !== H) {
        let W = K.slice(H, $),
            G = H > 0;
        _ = $ < K.length, J = K.length > gc1;
        let f = Math.max(20, z - 16 - 3 - 4);
        if (O = I, X = "column", q[17] !== G || q[18] !== J || q[19] !== H) D = J && vP.default.createElement(V, {
            dimColor: !0
        }, G ? ` ↑ ${H} more file${H!==1?"s":""}` : " "), q[17] = G, q[18] = J, q[19] = H, q[20] = D;
        else D = q[20];
        let Z;
        if (q[21] !== f || q[22] !== Y || q[23] !== H) Z = (N, T) => vP.default.createElement(Ujz, {
            key: N.path,
            file: N,
            isSelected: H + T === Y,
            maxPathWidth: f
        }), q[21] = f, q[22] = Y, q[23] = H, q[24] = Z;
        else Z = q[24];
        j = W.map(Z), q[6] = z, q[7] = $, q[8] = K, q[9] = Y, q[10] = H, q[11] = O, q[12] = _, q[13] = J, q[14] = X, q[15] = D, q[16] = j
    } else O = q[11], _ = q[12], J = q[13], X = q[14], D = q[15], j = q[16];
    let M;
    if (q[25] !== $ || q[26] !== K.length || q[27] !== _ || q[28] !== J) M = J && vP.default.createElement(V, {
        dimColor: !0
    }, _ ? ` ↓ ${K.length-$} more file${K.length-$!==1?"s":""}` : " "), q[25] = $, q[26] = K.length, q[27] = _, q[28] = J, q[29] = M;
    else M = q[29];
    let P;
    if (q[30] !== O || q[31] !== X || q[32] !== D || q[33] !== j || q[34] !== M) P = vP.default.createElement(O, {
        flexDirection: X
    }, D, j, M), q[30] = O, q[31] = X, q[32] = D, q[33] = j, q[34] = M, q[35] = P;
    else P = q[35];
    return P
}
// @from(Ln 477241, Col 0)
function Ujz(A) {
    let q = e(14),
        {
            file: K,
            isSelected: Y,
            maxPathWidth: z
        } = A,
        w;
    if (q[0] !== K.path || q[1] !== z) w = Rq6(K.path, z), q[0] = K.path, q[1] = z, q[2] = w;
    else w = q[2];
    let H = w,
        O = `${Y?l1.pointer+" ":"  "}${H}`,
        _ = Y ? "background" : void 0,
        J;
    if (q[3] !== Y || q[4] !== O || q[5] !== _) J = vP.default.createElement(V, {
        bold: Y,
        color: _,
        inverse: Y
    }, O), q[3] = Y, q[4] = O, q[5] = _, q[6] = J;
    else J = q[6];
    let X;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) X = vP.default.createElement(I, {
        flexGrow: 1
    }), q[7] = X;
    else X = q[7];
    let D;
    if (q[8] !== K || q[9] !== Y) D = vP.default.createElement(pjz, {
        file: K,
        isSelected: Y
    }), q[8] = K, q[9] = Y, q[10] = D;
    else D = q[10];
    let j;
    if (q[11] !== J || q[12] !== D) j = vP.default.createElement(I, {
        flexDirection: "row"
    }, J, X, D), q[11] = J, q[12] = D, q[13] = j;
    else j = q[13];
    return j
}
// @from(Ln 477280, Col 0)
function pjz(A) {
    let q = e(20),
        {
            file: K,
            isSelected: Y
        } = A;
    if (K.isUntracked) {
        let _ = !Y,
            J;
        if (q[0] !== _) J = vP.default.createElement(V, {
            dimColor: _,
            italic: !0
        }, "untracked"), q[0] = _, q[1] = J;
        else J = q[1];
        return J
    }
    if (K.isBinary) {
        let _ = !Y,
            J;
        if (q[2] !== _) J = vP.default.createElement(V, {
            dimColor: _,
            italic: !0
        }, "Binary file"), q[2] = _, q[3] = J;
        else J = q[3];
        return J
    }
    if (K.isLargeFile) {
        let _ = !Y,
            J;
        if (q[4] !== _) J = vP.default.createElement(V, {
            dimColor: _,
            italic: !0
        }, "Large file modified"), q[4] = _, q[5] = J;
        else J = q[5];
        return J
    }
    let z;
    if (q[6] !== K.linesAdded || q[7] !== Y) z = K.linesAdded > 0 && vP.default.createElement(V, {
        color: "diffAddedWord",
        bold: Y
    }, "+", K.linesAdded), q[6] = K.linesAdded, q[7] = Y, q[8] = z;
    else z = q[8];
    let w = K.linesAdded > 0 && K.linesRemoved > 0 && " ",
        H;
    if (q[9] !== K.linesRemoved || q[10] !== Y) H = K.linesRemoved > 0 && vP.default.createElement(V, {
        color: "diffRemovedWord",
        bold: Y
    }, "-", K.linesRemoved), q[9] = K.linesRemoved, q[10] = Y, q[11] = H;
    else H = q[11];
    let $;
    if (q[12] !== K.isTruncated || q[13] !== Y) $ = K.isTruncated && vP.default.createElement(V, {
        dimColor: !Y
    }, " (truncated)"), q[12] = K.isTruncated, q[13] = Y, q[14] = $;
    else $ = q[14];
    let O;
    if (q[15] !== z || q[16] !== w || q[17] !== H || q[18] !== $) O = vP.default.createElement(V, null, z, w, H, $), q[15] = z, q[16] = w, q[17] = H, q[18] = $, q[19] = O;
    else O = q[19];
    return O
}
// @from(Ln 477339, Col 4)
vP
// @from(Ln 477339, Col 8)
gc1 = 5
// @from(Ln 477340, Col 4)
SZq = v(() => {
    i1();
    m1();
    b7();
    mq();
    vq();
    vP = o(X1(), 1)
})
// @from(Ln 477352, Col 0)
function hZq(A) {
    let q = e(53),
        {
            filePath: K,
            hunks: Y,
            isLargeFile: z,
            isBinary: w,
            isTruncated: H,
            isUntracked: $
        } = A,
        {
            columns: O
        } = Z8(),
        _;
    A: {
        if (!K) {
            let B;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) B = {
                firstLine: null,
                fileContent: void 0
            }, q[0] = B;
            else B = q[0];
            _ = B;
            break A
        }
        let N, T;
        if (q[1] !== K) {
            let B = djz(h6(), K);
            N = gJq(B), T = N?.split(`
`)[0] ?? null, q[1] = K, q[2] = N, q[3] = T
        } else N = q[2],
        T = q[3];
        let k = N ?? void 0,
            y;
        if (q[4] !== T || q[5] !== k) y = {
            firstLine: T,
            fileContent: k
        },
        q[4] = T,
        q[5] = k,
        q[6] = y;
        else y = q[6];_ = y
    }
    let {
        firstLine: J,
        fileContent: X
    } = _;
    if ($) {
        let N;
        if (q[7] !== K) N = _2.default.createElement(V, {
            bold: !0
        }, K), q[7] = K, q[8] = N;
        else N = q[8];
        let T;
        if (q[9] === Symbol.for("react.memo_cache_sentinel")) T = _2.default.createElement(V, {
            dimColor: !0
        }, " (untracked)"), q[9] = T;
        else T = q[9];
        let k;
        if (q[10] !== N) k = _2.default.createElement(I, null, N, T), q[10] = N, q[11] = k;
        else k = q[11];
        let y;
        if (q[12] === Symbol.for("react.memo_cache_sentinel")) y = _2.default.createElement(be, {
            padding: 4
        }), q[12] = y;
        else y = q[12];
        let B;
        if (q[13] === Symbol.for("react.memo_cache_sentinel")) B = _2.default.createElement(V, {
            dimColor: !0,
            italic: !0
        }, "New file not yet staged."), q[13] = B;
        else B = q[13];
        let S;
        if (q[14] !== K) S = _2.default.createElement(I, {
            flexDirection: "column"
        }, B, _2.default.createElement(V, {
            dimColor: !0,
            italic: !0
        }, "Run `git add ", K, "` to see line counts.")), q[14] = K, q[15] = S;
        else S = q[15];
        let m;
        if (q[16] !== k || q[17] !== S) m = _2.default.createElement(I, {
            flexDirection: "column",
            width: "100%"
        }, k, y, S), q[16] = k, q[17] = S, q[18] = m;
        else m = q[18];
        return m
    }
    if (w) {
        let N;
        if (q[19] !== K) N = _2.default.createElement(I, null, _2.default.createElement(V, {
            bold: !0
        }, K)), q[19] = K, q[20] = N;
        else N = q[20];
        let T;
        if (q[21] === Symbol.for("react.memo_cache_sentinel")) T = _2.default.createElement(be, {
            padding: 4
        }), q[21] = T;
        else T = q[21];
        let k;
        if (q[22] === Symbol.for("react.memo_cache_sentinel")) k = _2.default.createElement(I, {
            flexDirection: "column"
        }, _2.default.createElement(V, {
            dimColor: !0,
            italic: !0
        }, "Binary file - cannot display diff")), q[22] = k;
        else k = q[22];
        let y;
        if (q[23] !== N) y = _2.default.createElement(I, {
            flexDirection: "column",
            width: "100%"
        }, N, T, k), q[23] = N, q[24] = y;
        else y = q[24];
        return y
    }
    if (z) {
        let N;
        if (q[25] !== K) N = _2.default.createElement(I, null, _2.default.createElement(V, {
            bold: !0
        }, K)), q[25] = K, q[26] = N;
        else N = q[26];
        let T;
        if (q[27] === Symbol.for("react.memo_cache_sentinel")) T = _2.default.createElement(be, {
            padding: 4
        }), q[27] = T;
        else T = q[27];
        let k;
        if (q[28] === Symbol.for("react.memo_cache_sentinel")) k = _2.default.createElement(I, {
            flexDirection: "column"
        }, _2.default.createElement(V, {
            dimColor: !0,
            italic: !0
        }, "Large file - diff exceeds 1 MB limit")), q[28] = k;
        else k = q[28];
        let y;
        if (q[29] !== N) y = _2.default.createElement(I, {
            flexDirection: "column",
            width: "100%"
        }, N, T, k), q[29] = N, q[30] = y;
        else y = q[30];
        return y
    }
    let D;
    if (q[31] !== K) D = _2.default.createElement(V, {
        bold: !0
    }, K), q[31] = K, q[32] = D;
    else D = q[32];
    let j;
    if (q[33] !== H) j = H && _2.default.createElement(V, {
        dimColor: !0
    }, " (truncated)"), q[33] = H, q[34] = j;
    else j = q[34];
    let M;
    if (q[35] !== D || q[36] !== j) M = _2.default.createElement(I, null, D, j), q[35] = D, q[36] = j, q[37] = M;
    else M = q[37];
    let P;
    if (q[38] === Symbol.for("react.memo_cache_sentinel")) P = _2.default.createElement(be, {
        padding: 4
    }), q[38] = P;
    else P = q[38];
    let W;
    if (q[39] !== O || q[40] !== X || q[41] !== K || q[42] !== J || q[43] !== Y) W = Y.length === 0 ? _2.default.createElement(V, {
        dimColor: !0
    }, "No diff content") : Y.map((N, T) => _2.default.createElement(fN, {
        key: T,
        patch: N,
        filePath: K,
        firstLine: J,
        fileContent: X,
        dim: !1,
        width: O - 2 - 2
    })), q[39] = O, q[40] = X, q[41] = K, q[42] = J, q[43] = Y, q[44] = W;
    else W = q[44];
    let G;
    if (q[45] !== W) G = _2.default.createElement(I, {
        flexDirection: "column"
    }, W), q[45] = W, q[46] = G;
    else G = q[46];
    let f;
    if (q[47] !== H) f = H && _2.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, "… diff truncated (exceeded 400 line limit)"), q[47] = H, q[48] = f;
    else f = q[48];
    let Z;
    if (q[49] !== M || q[50] !== G || q[51] !== f) Z = _2.default.createElement(I, {
        flexDirection: "column",
        width: "100%"
    }, M, P, G, f), q[49] = M, q[50] = G, q[51] = f, q[52] = Z;
    else Z = q[52];
    return Z
}
// @from(Ln 477544, Col 4)
_2
// @from(Ln 477545, Col 4)
IZq = v(() => {
    i1();
    m1();
    jt();
    wq();
    N7();
    mq();
    guA();
    _2 = o(X1(), 1)
})
// @from(Ln 477556, Col 0)
function cjz(A) {
    let q = Array.from(A.files.values()).map((Y) => ({
            path: Y.filePath,
            linesAdded: Y.linesAdded,
            linesRemoved: Y.linesRemoved,
            isBinary: !1,
            isLargeFile: !1,
            isTruncated: !1,
            isNewFile: Y.isNewFile
        })).sort((Y, z) => Y.path.localeCompare(z.path)),
        K = new Map;
    for (let Y of A.files.values()) K.set(Y.filePath, Y.hunks);
    return {
        stats: {
            filesCount: A.stats.filesChanged,
            linesAdded: A.stats.linesAdded,
            linesRemoved: A.stats.linesRemoved
        },
        files: q,
        hunks: K
    }
}
// @from(Ln 477579, Col 0)
function xZq(A) {
    let q = e(81),
        {
            messages: K,
            onDone: Y
        } = A,
        z = EZq(),
        w = RZq(K),
        [H, $] = cc.useState("list"),
        [O, _] = cc.useState(0),
        [J, X] = cc.useState(0),
        D;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) D = {
        type: "current"
    }, q[0] = D;
    else D = q[0];
    let j;
    if (q[1] !== w) {
        j = [D];
        for (let L1 of w) j.push({
            type: "turn",
            turnIndex: L1.turnIndex
        });
        q[1] = w, q[2] = j
    } else j = q[2];
    let M = j,
        P;
    if (q[3] !== z || q[4] !== J || q[5] !== M || q[6] !== w) {
        A: {
            let L1 = M[J];
            if (!L1 || L1.type === "current") {
                P = z;
                break A
            }
            let x1;
            if (q[8] !== L1) x1 = (R1) => R1.turnIndex === L1.turnIndex,
            q[8] = L1,
            q[9] = x1;
            else x1 = q[9];
            let f1 = w.find(x1);
            if (!f1) {
                P = z;
                break A
            }
            P = cjz(f1)
        }
        q[3] = z,
        q[4] = J,
        q[5] = M,
        q[6] = w,
        q[7] = P
    }
    else P = q[7];
    let W = P,
        G = M[J],
        f;
    if (q[10] !== G || q[11] !== w) f = G?.type === "turn" ? w.find((L1) => L1.turnIndex === G.turnIndex) : null, q[10] = G, q[11] = w, q[12] = f;
    else f = q[12];
    let Z = f,
        N = W.files[O],
        T;
    if (q[13] !== W.hunks || q[14] !== N) T = N ? W.hunks.get(N.path) || [] : [], q[13] = W.hunks, q[14] = N, q[15] = T;
    else T = q[15];
    let k = T,
        y, B;
    if (q[16] !== J || q[17] !== M.length) y = () => {
        if (J >= M.length) X(Math.max(0, M.length - 1))
    }, B = [M.length, J], q[16] = J, q[17] = M.length, q[18] = y, q[19] = B;
    else y = q[18], B = q[19];
    cc.useEffect(y, B);
    let S = cc.useRef(J),
        m, b;
    if (q[20] !== J) m = () => {
        if (S.current !== J) _(0), S.current = J
    }, b = [J], q[20] = J, q[21] = m, q[22] = b;
    else m = q[21], b = q[22];
    cc.useEffect(m, b), DZ("diff-dialog");
    let g, U;
    if (q[23] !== M.length || q[24] !== H) U = () => {
        if (H === "detail") $("list");
        else if (H === "list" && M.length > 1) X(ijz)
    }, g = () => {
        if (H === "list" && M.length > 1) X((L1) => Math.min(M.length - 1, L1 + 1))
    }, q[23] = M.length, q[24] = H, q[25] = g, q[26] = U;
    else g = q[25], U = q[26];
    let x;
    if (q[27] !== H) x = () => {
        if (H === "detail") $("list")
    }, q[27] = H, q[28] = x;
    else x = q[28];
    let p;
    if (q[29] !== N || q[30] !== H) p = () => {
        if (H === "list" && N) $("detail")
    }, q[29] = N, q[30] = H, q[31] = p;
    else p = q[31];
    let l;
    if (q[32] !== H) l = () => {
        if (H === "list") _(ljz)
    }, q[32] = H, q[33] = l;
    else l = q[33];
    let r;
    if (q[34] !== W.files.length || q[35] !== H) r = () => {
        if (H === "list") _((L1) => Math.min(W.files.length - 1, L1 + 1))
    }, q[34] = W.files.length, q[35] = H, q[36] = r;
    else r = q[36];
    let s;
    if (q[37] !== g || q[38] !== x || q[39] !== p || q[40] !== l || q[41] !== r || q[42] !== U) s = {
        "diff:previousSource": U,
        "diff:nextSource": g,
        "diff:back": x,
        "diff:viewDetails": p,
        "diff:previousFile": l,
        "diff:nextFile": r
    }, q[37] = g, q[38] = x, q[39] = p, q[40] = l, q[41] = r, q[42] = U, q[43] = s;
    else s = q[43];
    let O1;
    if (q[44] === Symbol.for("react.memo_cache_sentinel")) O1 = {
        context: "DiffDialog"
    }, q[44] = O1;
    else O1 = q[44];
    c7(s, O1);
    let T1;
    if (q[45] !== W.stats) T1 = W.stats ? CH.default.createElement(V, {
        dimColor: !0
    }, W.stats.filesCount, " file", W.stats.filesCount !== 1 ? "s" : "", " changed", W.stats.linesAdded > 0 && CH.default.createElement(V, {
        color: "diffAddedWord"
    }, " +", W.stats.linesAdded), W.stats.linesRemoved > 0 && CH.default.createElement(V, {
        color: "diffRemovedWord"
    }, " -", W.stats.linesRemoved)) : null, q[45] = W.stats, q[46] = T1;
    else T1 = q[46];
    let N1 = T1,
        j1 = Z ? `Turn ${Z.turnIndex}` : "Uncommitted changes",
        q1 = Z ? Z.userPromptPreview ? `"${Z.userPromptPreview}"` : "" : "(git diff HEAD)",
        t;
    if (q[47] !== J || q[48] !== M || q[49] !== w) t = M.length > 1 ? CH.default.createElement(I, null, J > 0 && CH.default.createElement(V, {
        dimColor: !0
    }, "◀ "), M.map((L1, x1) => {
        let f1 = x1 === J,
            R1 = L1.type === "turn" ? w.find((y1) => y1.turnIndex === L1.turnIndex) : null,
            H1 = L1.type === "current" ? "Current" : `T${R1?.turnIndex??"?"}`;
        return CH.default.createElement(V, {
            key: x1,
            dimColor: !f1,
            bold: f1
        }, x1 > 0 ? " · " : "", H1)
    }), J < M.length - 1 && CH.default.createElement(V, {
        dimColor: !0
    }, " ▶")) : null, q[47] = J, q[48] = M, q[49] = w, q[50] = t;
    else t = q[50];
    let J1 = t,
        D1 = RK("diff:dismiss", "DiffDialog", "esc"),
        Z1;
    A: {
        if (Z) {
            Z1 = "No file changes in this turn";
            break A
        }
        if (W.stats && W.stats.filesCount > 0 && W.files.length === 0) {
            Z1 = "Too many files to display details";
            break A
        }
        Z1 = "Working tree is clean"
    }
    let E1 = Z1,
        a;
    if (q[51] !== q1) a = q1 && CH.default.createElement(V, {
        dimColor: !0
    }, " ", q1), q[51] = q1, q[52] = a;
    else a = q[52];
    let A1;
    if (q[53] !== j1 || q[54] !== a) A1 = CH.default.createElement(V, null, j1, a), q[53] = j1, q[54] = a, q[55] = A1;
    else A1 = q[55];
    let M1 = A1,
        z1;
    if (q[56] !== Y || q[57] !== H) z1 = function() {
        if (H === "detail") $("list");
        else Y("Diff dialog dismissed", {
            display: "system"
        })
    }, q[56] = Y, q[57] = H, q[58] = z1;
    else z1 = q[58];
    let Y1 = z1,
        _1;
    if (q[59] !== D1 || q[60] !== M.length || q[61] !== H) _1 = (L1) => L1.pending ? CH.default.createElement(V, null, "Press ", L1.keyName, " again to exit") : H === "list" ? CH.default.createElement(oA, null, M.length > 1 && CH.default.createElement(V, null, "←/→ source"), CH.default.createElement(V, null, "↑/↓ select"), CH.default.createElement(V, null, "Enter view"), CH.default.createElement(V, null, D1, " close")) : CH.default.createElement(oA, null, CH.default.createElement(V, null, "← back"), CH.default.createElement(V, null, D1, " close")), q[59] = D1, q[60] = M.length, q[61] = H, q[62] = _1;
    else _1 = q[62];
    let $1;
    if (q[63] !== W.files || q[64] !== E1 || q[65] !== N?.isBinary || q[66] !== N?.isLargeFile || q[67] !== N?.isTruncated || q[68] !== N?.isUntracked || q[69] !== N?.path || q[70] !== k || q[71] !== O || q[72] !== H) $1 = W.files.length === 0 ? CH.default.createElement(I, {
        marginTop: 1
    }, CH.default.createElement(V, {
        dimColor: !0
    }, E1)) : H === "list" ? CH.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, CH.default.createElement(CZq, {
        files: W.files,
        selectedIndex: O
    })) : CH.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, CH.default.createElement(hZq, {
        filePath: N?.path || "",
        hunks: k,
        isLargeFile: N?.isLargeFile,
        isBinary: N?.isBinary,
        isTruncated: N?.isTruncated,
        isUntracked: N?.isUntracked
    })), q[63] = W.files, q[64] = E1, q[65] = N?.isBinary, q[66] = N?.isLargeFile, q[67] = N?.isTruncated, q[68] = N?.isUntracked, q[69] = N?.path, q[70] = k, q[71] = O, q[72] = H, q[73] = $1;
    else $1 = q[73];
    let G1;
    if (q[74] !== Y1 || q[75] !== J1 || q[76] !== N1 || q[77] !== _1 || q[78] !== $1 || q[79] !== M1) G1 = CH.default.createElement(w8, {
        title: M1,
        onCancel: Y1,
        color: "background",
        borderDimColor: !1,
        inputGuide: _1
    }, J1, N1, $1), q[74] = Y1, q[75] = J1, q[76] = N1, q[77] = _1, q[78] = $1, q[79] = M1, q[80] = G1;
    else G1 = q[80];
    return G1
}
// @from(Ln 477799, Col 0)
function ljz(A) {
    return Math.max(0, A - 1)
}
// @from(Ln 477803, Col 0)
function ijz(A) {
    return Math.max(0, A - 1)
}
// @from(Ln 477806, Col 4)
CH
// @from(Ln 477806, Col 8)
cc
// @from(Ln 477807, Col 4)
bZq = v(() => {
    i1();
    m1();
    K7();
    oS();
    kZq();
    yZq();
    SZq();
    IZq();
    s2();
    Bq();
    HK();
    CH = o(X1(), 1), cc = o(X1(), 1)
})
// @from(Ln 477822, Col 0)
function rjz(A, q) {
    if (A.length <= njz) return {
        truncatedText: A,
        placeholderContent: ""
    };
    let K = Math.floor(uZq / 2),
        Y = Math.floor(uZq / 2),
        z = A.slice(0, K),
        w = A.slice(-Y),
        H = A.slice(K, -Y),
        $ = hD1(H),
        _ = ojz(q, $);
    return {
        truncatedText: z + _ + w,
        placeholderContent: H
    }
}
// @from(Ln 477840, Col 0)
function ojz(A, q) {
    return `[...Truncated text #${A} +${q} lines...]`
}
// @from(Ln 477844, Col 0)
function BZq(A, q) {
    let K = Object.keys(q).map(Number),
        Y = K.length > 0 ? Math.max(...K) + 1 : 1,
        {
            truncatedText: z,
            placeholderContent: w
        } = rjz(A, Y);
    if (!w) return {
        newInput: A,
        newPastedContents: q
    };
    return {
        newInput: z,
        newPastedContents: {
            ...q,
            [Y]: {
                id: Y,
                type: "text",
                content: w
            }
        }
    }
}
// @from(Ln 477867, Col 4)
njz = 1e4
// @from(Ln 477868, Col 4)
uZq = 1000
// @from(Ln 477869, Col 4)
mZq = v(() => {
    nS()
})
// @from(Ln 477873, Col 0)
function FZq({
    input: A,
    pastedContents: q,
    onInputChange: K,
    setCursorOffset: Y,
    setPastedContents: z
}) {
    let [w, H] = Uc1.useState(!1);
    Uc1.useEffect(() => {
        if (w) return;
        if (A.length <= 1e4) return;
        let {
            newInput: $,
            newPastedContents: O
        } = BZq(A, q);
        K($), Y($.length), z(O), H(!0)
    }, [A, w, q, K, z, Y]), Uc1.useEffect(() => {
        if (A === "") H(!1)
    }, [A])
}
// @from(Ln 477893, Col 4)
Uc1
// @from(Ln 477894, Col 4)
QZq = v(() => {
    mZq();
    Uc1 = o(X1(), 1)
})
// @from(Ln 477899, Col 0)
function pZq({
    input: A,
    submitCount: q,
    viewingAgentName: K
}) {
    let Y = v6((H) => H.queuedCommands),
        z = v6((H) => H.promptSuggestionEnabled);
    return UZq.useMemo(() => {
        if (A !== "") return;
        if (K) return `Message @${K.length>gZq?K.slice(0,gZq-3)+"...":K}…`;
        if (Y.length > 0 && (f6().queuedCommandUpHintCount || 0) < sjz) return "Press up to edit queued messages";
        if (q < 1 && z && !ajz?.isProactiveActive()) return iDq()
    }, [A, Y, q, z, K])
}
// @from(Ln 477913, Col 4)
UZq
// @from(Ln 477913, Col 9)
ajz = null
// @from(Ln 477914, Col 4)
sjz = 3
// @from(Ln 477915, Col 4)
gZq = 20
// @from(Ln 477916, Col 4)
dZq = v(() => {
    d8();
    cA();
    OQA();
    UZq = o(X1(), 1)
})
// @from(Ln 477923, Col 0)
function tjz() {
    if (!l8()) return;
    let A = b$();
    if (!A) return;
    if (cO.includes(A)) return lO[A];
    return
}
// @from(Ln 477931, Col 0)
function cZq(A) {
    let q = e(3),
        {
            isLoading: K,
            themeColor: Y
        } = A,
        w = Y ?? void 0,
        H;
    if (q[0] !== w || q[1] !== K) H = uE.createElement(V, {
        color: w,
        dimColor: K
    }, l1.pointer, " "), q[0] = w, q[1] = K, q[2] = H;
    else H = q[2];
    return H
}
// @from(Ln 477947, Col 0)
function FgA(A) {
    let q = e(6),
        {
            mode: K,
            isLoading: Y,
            viewingAgentName: z,
            viewingAgentColor: w
        } = A,
        H;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) H = tjz(), q[0] = H;
    else H = q[0];
    let $ = H,
        O = w ? lO[w] : void 0,
        _;
    if (q[1] !== Y || q[2] !== K || q[3] !== O || q[4] !== z) _ = uE.createElement(I, {
        alignItems: "flex-start",
        alignSelf: "flex-start",
        flexWrap: "nowrap",
        justifyContent: "flex-start"
    }, z ? uE.createElement(cZq, {
        isLoading: Y,
        themeColor: O
    }) : K === "bash" ? uE.createElement(V, {
        color: "bashBorder",
        dimColor: Y
    }, "! ") : K === "background" ? uE.createElement(V, {
        color: "background",
        dimColor: Y
    }, "& ") : uE.createElement(cZq, {
        isLoading: Y,
        ...l8() ? {
            themeColor: $
        } : {}
    })), q[1] = Y, q[2] = K, q[3] = O, q[4] = z, q[5] = _;
    else _ = q[5];
    return _
}
// @from(Ln 477984, Col 4)
uE
// @from(Ln 477985, Col 4)
lZq = v(() => {
    i1();
    b7();
    m1();
    S9();
    Cz();
    lM();
    uE = o(X1(), 1)
})
// @from(Ln 477995, Col 0)
function nZq(A) {
    let q = e(7),
        {
            isFirst: K,
            children: Y
        } = A,
        z;
    if (q[0] !== K) z = {
        isQueued: !0,
        isFirst: K,
        paddingWidth: AMz
    }, q[0] = K, q[1] = z;
    else z = q[1];
    let w = z,
        H;
    if (q[2] !== Y) H = X11.createElement(I, {
        paddingX: iZq
    }, Y), q[2] = Y, q[3] = H;
    else H = q[3];
    let $;
    if (q[4] !== H || q[5] !== w) $ = X11.createElement(ejz.Provider, {
        value: w
    }, H), q[4] = H, q[5] = w, q[6] = $;
    else $ = q[6];
    return $
}
// @from(Ln 478021, Col 4)
X11
// @from(Ln 478021, Col 9)
ejz
// @from(Ln 478021, Col 14)
iZq = 2
// @from(Ln 478022, Col 4)
AMz
// @from(Ln 478023, Col 4)
rZq = v(() => {
    i1();
    m1();
    X11 = o(X1(), 1), ejz = X11.createContext(void 0), AMz = iZq * 2
})
// @from(Ln 478029, Col 0)
function KMz(A) {
    try {
        return _A(A)?.type === "idle_notification"
    } catch {
        return !1
    }
}
// @from(Ln 478037, Col 0)
function YMz(A) {
    return `<${NO}>
<${TD}>+${A} more tasks completed</${TD}>
<${ND}>completed</${ND}>
</${NO}>`
}
// @from(Ln 478044, Col 0)
function zMz(A) {
    let q = A.filter(($) => typeof $.value !== "string" || !KMz($.value)),
        K = q.filter(($) => $.mode === "task-notification"),
        Y = q.filter(($) => $.mode !== "task-notification");
    if (K.length <= QgA) return [...Y, ...K];
    let z = K.slice(0, QgA - 1),
        w = K.length - (QgA - 1),
        H = {
            value: YMz(w),
            mode: "task-notification"
        };
    return [...Y, ...z, H]
}
// @from(Ln 478058, Col 0)
function oZq() {
    let A = e(11),
        q = v6(OMz),
        K = B_();
    if (Zp7(K.getState())) return null;
    if (q.length === 0) return null;
    let Y, z, w, H, $;
    if (A[0] !== q) {
        $ = Symbol.for("react.early_return_sentinel");
        A: {
            let _ = q.filter($Mz);
            if (_.length === 0) {
                $ = null;
                break A
            }
            let J = zMz(_),
                X = iO(J.map(HMz));Y = I,
            z = 1,
            w = "column",
            H = X.map(wMz)
        }
        A[0] = q, A[1] = Y, A[2] = z, A[3] = w, A[4] = H, A[5] = $
    } else Y = A[1], z = A[2], w = A[3], H = A[4], $ = A[5];
    if ($ !== Symbol.for("react.early_return_sentinel")) return $;
    let O;
    if (A[6] !== Y || A[7] !== z || A[8] !== w || A[9] !== H) O = NY1.createElement(Y, {
        marginTop: z,
        flexDirection: w
    }, H), A[6] = Y, A[7] = z, A[8] = w, A[9] = H, A[10] = O;
    else O = A[10];
    return O
}
// @from(Ln 478091, Col 0)
function wMz(A, q) {
    return NY1.createElement(nZq, {
        key: q,
        isFirst: q === 0
    }, NY1.createElement(pR, {
        message: A,
        lookups: vm,
        addMargin: !1,
        tools: [],
        commands: [],
        verbose: !1,
        inProgressToolUseIDs: qMz,
        progressMessagesForMessage: [],
        shouldAnimate: !1,
        shouldShowDot: !1,
        isTranscriptMode: !1,
        isStatic: !0
    }))
}
// @from(Ln 478111, Col 0)
function HMz(A) {
    return c6({
        content: A.value,
        imagePasteIds: A.imagePasteIds
    })
}
// @from(Ln 478118, Col 0)
function $Mz(A) {
    return A.mode !== "task-notification"
}
// @from(Ln 478122, Col 0)
function OMz(A) {
    return A.queuedCommands
}
// @from(Ln 478125, Col 4)
NY1
// @from(Ln 478125, Col 9)
qMz
// @from(Ln 478125, Col 14)
QgA = 3
// @from(Ln 478126, Col 4)
aZq = v(() => {
    i1();
    d8();
    m1();
    nP1();
    N8();
    rZq();
    vz();
    m6();
    MK1();
    NY1 = o(X1(), 1), qMz = new Set
})
// @from(Ln 478139, Col 0)
function sZq(A) {
    let q = e(1),
        {
            hasStash: K
        } = A;
    if (!K) return null;
    let Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = pc1.createElement(I, {
        paddingLeft: 2
    }, pc1.createElement(V, {
        dimColor: !0
    }, l1.pointerSmall, " Stashed (auto-restores after submit)")), q[0] = Y;
    else Y = q[0];
    return Y
}
// @from(Ln 478154, Col 4)
pc1
// @from(Ln 478155, Col 4)
tZq = v(() => {
    i1();
    m1();
    b7();
    pc1 = o(X1(), 1)
})
// @from(Ln 478162, Col 0)
function eZq(A) {
    if (i3()) return;
    return A.standaloneAgentContext?.name
}
// @from(Ln 478166, Col 4)
Afq = v(() => {
    Cz()
})
// @from(Ln 478170, Col 0)
function qfq() {
    let A = v6((H) => H.teamContext),
        q = v6((H) => H.standaloneAgentContext),
        K = v6((H) => H.agent),
        Y = B_(),
        [z, w] = zE6.useState(null);
    if (zE6.useEffect(() => {
            OI().then(w)
        }, []), Dz() && !MM()) {
        let H = g5(),
            $ = i3(),
            O = A?.selfAgentColor ?? b$();
        if (H && $) {
            let _ = O ? lO[O] : "cyan_FOR_SUBAGENTS_ONLY";
            return {
                text: `@${H}`,
                bgColor: _
            }
        }
    } else if ((A?.teammates ? Object.keys(A.teammates).length : 0) > 0 && A?.teamName) {
        let O = PR(Y.getState()),
            _ = O?.identity.color && cO.includes(O.identity.color) ? lO[O.identity.color] : void 0,
            J = Rm();
        if (z === !1 && !J) return {
            text: `View teammates: \`tmux -L ${UP1()} a\``,
            bgColor: _ ?? "cyan_FOR_SUBAGENTS_ONLY"
        };
        else if (z === !0 || J) {
            if (O) return {
                text: `@${O.identity.agentName}`,
                bgColor: _ ?? "cyan_FOR_SUBAGENTS_ONLY"
            };
            return null
        }
    }
    if (l8()) {
        let H = eZq(Y.getState()),
            $ = q?.color;
        if (H || $) {
            let O = $ ? lO[$] : "cyan_FOR_SUBAGENTS_ONLY";
            return {
                text: H ?? "",
                bgColor: O
            }
        }
    }
    if (K) {
        let $ = Y.getState().agentDefinitions.activeAgents.find((_) => _.agentType === K)?.color,
            O = $ && cO.includes($) ? lO[$] : "promptBorder";
        return {
            text: K,
            bgColor: O
        }
    }
    return null
}
// @from(Ln 478226, Col 4)
zE6
// @from(Ln 478227, Col 4)
Kfq = v(() => {
    d8();
    MK1();
    Cz();
    Yv();
    Lm();
    JI();
    lM();
    S9();
    Afq();
    zE6 = o(X1(), 1)
})
// @from(Ln 478240, Col 0)
function Yfq(A) {
    let q = e(14),
        {
            pastedContents: K,
            isSelected: Y,
            selectedIndex: z
        } = A,
        w = Y === void 0 ? !1 : Y,
        H = z === void 0 ? 0 : z,
        $;
    if (q[0] !== K) $ = Object.values(K).filter(_Mz), q[0] = K, q[1] = $;
    else $ = q[1];
    let O = $;
    if (O.length === 0) return null;
    let _;
    if (q[2] !== O.length || q[3] !== w) _ = w ? zO.createElement(oA, null, O.length > 1 && zO.createElement(zO.Fragment, null, zO.createElement(NA, {
        action: "attachments:next",
        context: "Attachments",
        fallback: "→",
        description: "next"
    }), zO.createElement(NA, {
        action: "attachments:previous",
        context: "Attachments",
        fallback: "←",
        description: "prev"
    })), zO.createElement(NA, {
        action: "attachments:remove",
        context: "Attachments",
        fallback: "backspace",
        description: "remove"
    }), zO.createElement(NA, {
        action: "attachments:exit",
        context: "Attachments",
        fallback: "↓",
        description: "cancel"
    })) : "(↑ to select)", q[2] = O.length, q[3] = w, q[4] = _;
    else _ = q[4];
    let J = _,
        X;
    if (q[5] !== O || q[6] !== w || q[7] !== H) X = O.map((M, P) => zO.createElement($w6, {
        key: M.id,
        imageId: M.id,
        isSelected: w && P === H
    })), q[5] = O, q[6] = w, q[7] = H, q[8] = X;
    else X = q[8];
    let D;
    if (q[9] !== J) D = zO.createElement(I, {
        flexGrow: 1,
        justifyContent: "flex-start",
        flexDirection: "row"
    }, zO.createElement(V, {
        dimColor: !0
    }, J)), q[9] = J, q[10] = D;
    else D = q[10];
    let j;
    if (q[11] !== X || q[12] !== D) j = zO.createElement(I, {
        flexDirection: "row",
        gap: 1,
        paddingX: 1,
        flexWrap: "wrap"
    }, X, D), q[11] = X, q[12] = D, q[13] = j;
    else j = q[13];
    return j
}
// @from(Ln 478305, Col 0)
function _Mz(A) {
    return A.type === "image"
}
// @from(Ln 478309, Col 0)
function ggA(A) {
    return Object.values(A).filter((q) => q.type === "image").length
}
// @from(Ln 478312, Col 4)
zO
// @from(Ln 478313, Col 4)
UgA = v(() => {
    i1();
    m1();
    n$A();
    BK();
    HK();
    zO = o(X1(), 1)
})
// @from(Ln 478322, Col 0)
function zfq(A, q, K, Y, z, w, H, $, O, _, J) {
    let [X, D] = SH.useState(""), [j, M] = SH.useState(!1), [P, W] = SH.useState(""), [G, f] = SH.useState(0), [Z, N] = SH.useState("prompt"), [T, k] = SH.useState({}), [y, B] = SH.useState(void 0), S = SH.useRef(void 0), m = SH.useRef(new Set), b = SH.useRef(null), g = SH.useCallback(() => {
        if (S.current) S.current.return(void 0), S.current = void 0
    }, []), U = SH.useCallback(() => {
        O(!1), D(""), M(!1), W(""), f(0), N("prompt"), k({}), B(void 0), g(), m.current.clear()
    }, [O, g]), x = SH.useCallback(async (j1, q1) => {
        if (!$) return;
        if (X.length === 0) {
            g(), m.current.clear(), B(void 0), M(!1), K(P), Y(G), w(Z), _(T);
            return
        }
        if (!j1) g(), S.current = Q$A(), m.current.clear();
        if (!S.current) return;
        while (!0) {
            if (q1?.aborted) return;
            let t = await S.current.next();
            if (t.done) {
                M(!0);
                return
            }
            let J1 = t.value.display,
                D1 = J1.lastIndexOf(X);
            if (D1 !== -1 && !m.current.has(J1)) {
                m.current.add(J1), B(t.value), M(!1);
                let Z1 = _B(J1);
                w(Z1), K(J1), _(t.value.pastedContents);
                let a = Jq1(J1).lastIndexOf(X);
                Y(a !== -1 ? a : D1);
                return
            }
        }
    }, [$, X, g, K, Y, w, _, P, G, Z, T]), p = SH.useCallback(() => {
        u8("history-search"), O(!0), W(q), f(z), N(H), k(J), S.current = Q$A(), m.current.clear()
    }, [O, q, z, H, J]), l = SH.useCallback(() => {
        x(!0)
    }, [x]), r = SH.useCallback(() => {
        if (y) {
            let j1 = _B(y.display),
                q1 = Jq1(y.display);
            K(q1), w(j1), _(y.pastedContents)
        } else _(T);
        U()
    }, [y, K, w, _, T, U]), s = SH.useCallback(() => {
        K(P), Y(G), _(T), U()
    }, [K, Y, _, P, G, T, U]), O1 = SH.useCallback(() => {
        if (X.length === 0) A({
            display: P,
            pastedContents: T
        });
        else if (y) {
            let j1 = _B(y.display),
                q1 = Jq1(y.display);
            w(j1), A({
                display: q1,
                pastedContents: y.pastedContents
            })
        }
        U()
    }, [X, y, A, w, P, T, U]);
    DA("history:search", p, {
        context: "Global",
        isActive: !$
    });
    let T1 = SH.useMemo(() => ({
        "historySearch:next": l,
        "historySearch:accept": r,
        "historySearch:cancel": s,
        "historySearch:execute": O1
    }), [l, r, s, O1]);
    c7(T1, {
        context: "HistorySearch",
        isActive: $
    }), D8((j1, q1) => {
        if (q1.backspace && X === "") s()
    }, {
        isActive: $
    });
    let N1 = SH.useRef(x);
    return N1.current = x, SH.useEffect(() => {
        b.current?.abort();
        let j1 = new AbortController;
        return b.current = j1, N1.current(!1, j1.signal), () => {
            j1.abort()
        }
    }, [X]), {
        historyQuery: X,
        setHistoryQuery: D,
        historyMatch: y,
        historyFailedMatch: j
    }
}
// @from(Ln 478413, Col 4)
SH
// @from(Ln 478414, Col 4)
wfq = v(() => {
    m1();
    nS();
    v3();
    K7();
    SH = o(X1(), 1)
})
// @from(Ln 478422, Col 0)
function Hfq({
    inputValue: A,
    isAssistantResponding: q
}) {
    let K = v6((f) => f.promptSuggestion),
        Y = L7(),
        {
            text: z,
            promptId: w,
            shownAt: H,
            acceptedAt: $,
            generationRequestId: O
        } = K,
        _ = q || A.length > 0 ? null : z,
        J = z && H > 0,
        X = lc.useRef(0),
        D = lc.useRef(!0),
        j = lc.useRef(0);
    if (H > 0 && H !== j.current) j.current = H, D.current = UK6(), X.current = 0;
    else if (H === 0) j.current = 0;
    if (A.length > 0 && X.current === 0 && J) X.current = Date.now();
    let M = lc.useCallback(() => {
            K91(Y), Y((f) => ({
                ...f,
                promptSuggestion: {
                    text: null,
                    promptId: null,
                    shownAt: 0,
                    acceptedAt: 0,
                    generationRequestId: null
                }
            }))
        }, [Y]),
        P = lc.useCallback(() => {
            if (!J) return;
            Y((f) => ({
                ...f,
                promptSuggestion: {
                    ...f.promptSuggestion,
                    acceptedAt: Date.now()
                }
            }))
        }, [J, Y]),
        W = lc.useCallback(() => {
            Y((f) => {
                if (f.promptSuggestion.shownAt !== 0 || !f.promptSuggestion.text) return f;
                return {
                    ...f,
                    promptSuggestion: {
                        ...f.promptSuggestion,
                        shownAt: Date.now()
                    }
                }
            })
        }, [Y]),
        G = lc.useCallback((f) => {
            if (!J) return;
            let Z = $ > H,
                N = Z || f === z,
                T = N ? $ || Date.now() : Date.now();
            c("tengu_prompt_suggestion", {
                outcome: N ? "accepted" : "ignored",
                prompt_id: w,
                coordinator_mode: KY(),
                ...O && {
                    generationRequestId: O
                },
                ...N && {
                    acceptMethod: Z ? "tab" : "enter"
                },
                ...N && {
                    timeToAcceptMs: T - H
                },
                ...!N && {
                    timeToIgnoreMs: T - H
                },
                ...X.current > 0 && {
                    timeToFirstKeystrokeMs: X.current - H
                },
                wasFocusedWhenShown: D.current,
                similarity: Math.round(f.length / (z?.length || 1) * 100) / 100,
                ...!1
            }), M()
        }, [J, $, H, z, w, O, M]);
    return {
        suggestion: _,
        markAccepted: P,
        markShown: W,
        logOutcomeAtSubmission: G,
        resetSuggestion: M
    }
}
// @from(Ln 478514, Col 4)
lc
// @from(Ln 478515, Col 4)
$fq = v(() => {
    d8();
    u6();
    lU1();
    MJ1();
    cM();
    lc = o(X1(), 1)
})
// @from(Ln 478524, Col 0)
function _fq(A) {
    let q = e(28),
        {
            currentValue: K,
            onSelect: Y,
            onCancel: z,
            isMidConversation: w
        } = A,
        H = uq(),
        [$, O] = Ofq.useState(null),
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = [{
        value: "true",
        label: "Enabled",
        description: "Claude will think before responding"
    }, {
        value: "false",
        label: "Disabled",
        description: "Claude will respond without extended thinking"
    }], q[0] = _;
    else _ = q[0];
    let J = _,
        X;
    if (q[1] !== $ || q[2] !== z) X = () => {
        if ($ !== null) O(null);
        else z?.()
    }, q[1] = $, q[2] = z, q[3] = X;
    else X = q[3];
    let D;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) D = {
        context: "Confirmation"
    }, q[4] = D;
    else D = q[4];
    DA("confirm:no", X, D);
    let j;
    if (q[5] !== $ || q[6] !== Y) j = () => {
        if ($ !== null) Y($)
    }, q[5] = $, q[6] = Y, q[7] = j;
    else j = q[7];
    let M = $ !== null,
        P;
    if (q[8] !== M) P = {
        context: "Confirmation",
        isActive: M
    }, q[8] = M, q[9] = P;
    else P = q[9];
    DA("confirm:yes", j, P);
    let W;
    if (q[10] !== K || q[11] !== w || q[12] !== Y) W = function(B) {
        let S = B === "true";
        if (w && S !== K) O(S);
        else Y(S)
    }, q[10] = K, q[11] = w, q[12] = Y, q[13] = W;
    else W = q[13];
    let G = W,
        f;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) f = s3.createElement(CY, {
        dividerColor: "permission",
        dividerDimColor: !1
    }), q[14] = f;
    else f = q[14];
    let Z;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) Z = s3.createElement(I, {
        marginBottom: 1,
        flexDirection: "column"
    }, s3.createElement(V, {
        color: "remember",
        bold: !0
    }, "Toggle thinking mode"), s3.createElement(V, {
        dimColor: !0
    }, "Enable or disable thinking for this session.")), q[15] = Z;
    else Z = q[15];
    let N;
    if (q[16] !== $ || q[17] !== K || q[18] !== G || q[19] !== z) N = s3.createElement(I, {
        flexDirection: "column"
    }, Z, $ !== null ? s3.createElement(I, {
        flexDirection: "column",
        marginBottom: 1,
        gap: 1
    }, s3.createElement(V, {
        color: "warning"
    }, "Changing thinking mode mid-conversation will increase latency and may reduce quality. For best results, set this at the start of a session."), s3.createElement(V, {
        color: "warning"
    }, "Do you want to proceed?")) : s3.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, s3.createElement(kA, {
        defaultValue: K ? "true" : "false",
        defaultFocusValue: K ? "true" : "false",
        options: J,
        onChange: G,
        onCancel: z ?? JMz,
        visibleOptionCount: 2
    }))), q[16] = $, q[17] = K, q[18] = G, q[19] = z, q[20] = N;
    else N = q[20];
    let T;
    if (q[21] !== $ || q[22] !== H.keyName || q[23] !== H.pending) T = s3.createElement(V, {
        dimColor: !0,
        italic: !0
    }, H.pending ? s3.createElement(s3.Fragment, null, "Press ", H.keyName, " again to exit") : $ !== null ? s3.createElement(oA, null, s3.createElement(YA, {
        shortcut: "Enter",
        action: "confirm"
    }), s3.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })) : s3.createElement(oA, null, s3.createElement(YA, {
        shortcut: "Enter",
        action: "confirm"
    }), s3.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "exit"
    }))), q[21] = $, q[22] = H.keyName, q[23] = H.pending, q[24] = T;
    else T = q[24];
    let k;
    if (q[25] !== N || q[26] !== T) k = s3.createElement(I, {
        flexDirection: "column",
        width: "100%"
    }, f, s3.createElement(I, {
        flexDirection: "column",
        paddingX: 1
    }, N, T)), q[25] = N, q[26] = T, q[27] = k;
    else k = q[27];
    return k
}
// @from(Ln 478653, Col 0)
function JMz() {}
// @from(Ln 478654, Col 4)
s3
// @from(Ln 478654, Col 8)
Ofq
// @from(Ln 478655, Col 4)
Jfq = v(() => {
    i1();
    m1();
    wY();
    R2();
    kW();
    wK();
    BK();
    HK();
    K7();
    s3 = o(X1(), 1), Ofq = o(X1(), 1)
})
// @from(Ln 478668, Col 0)
function Dfq(A) {
    let [q, K] = wE6.useState(!1);
    return wE6.useEffect(() => {
        if (Xfq || !A) return;
        Xfq = !0, K(!0);
        let Y = setTimeout(() => {
            K(!1)
        }, XMz);
        return () => {
            clearTimeout(Y), K(!1)
        }
    }, [A]), q
}
// @from(Ln 478681, Col 4)
wE6
// @from(Ln 478681, Col 9)
XMz = 3000
// @from(Ln 478682, Col 4)
Xfq = !1
// @from(Ln 478683, Col 4)
jfq = v(() => {
    wE6 = o(X1(), 1)
})