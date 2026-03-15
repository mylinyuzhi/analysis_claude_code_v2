
// @from(Ln 497167, Col 0)
function qGz(A) {
    let q = A6(14),
        {
            name: K,
            color: Y,
            isSelected: z,
            isViewed: _,
            isIdle: w
        } = A;
    if (z) {
        let H;
        if (q[0] !== Y || q[1] !== _ || q[2] !== K) H = Y ? p4.createElement(T, {
            backgroundColor: Y,
            color: "inverseText",
            bold: _
        }, "@", K) : p4.createElement(T, {
            color: "background",
            inverse: !0,
            bold: _
        }, "@", K), q[0] = Y, q[1] = _, q[2] = K, q[3] = H;
        else H = q[3];
        return H
    }
    if (w) {
        let H;
        if (q[4] !== _ || q[5] !== K) H = p4.createElement(T, {
            dimColor: !0,
            bold: _
        }, "@", K), q[4] = _, q[5] = K, q[6] = H;
        else H = q[6];
        return H
    }
    if (_) {
        let H;
        if (q[7] !== Y || q[8] !== K) H = p4.createElement(T, {
            color: Y,
            bold: !0
        }, "@", K), q[7] = Y, q[8] = K, q[9] = H;
        else H = q[9];
        return H
    }
    let O = !Y,
        $;
    if (q[10] !== Y || q[11] !== K || q[12] !== O) $ = p4.createElement(T, {
        color: Y,
        dimColor: O
    }, "@", K), q[10] = Y, q[11] = K, q[12] = O, q[13] = $;
    else $ = q[13];
    return $
}
// @from(Ln 497218, Col 0)
function KGz(A) {
    if (!A) return;
    if (s$.includes(A)) return t$[A];
    return
}
// @from(Ln 497224, Col 0)
function YGz(A) {
    switch (A.type) {
        case "local_bash":
            return A.kind === "monitor" ? A.description : A.command;
        case "local_agent":
            return A.description;
        case "remote_agent":
            return A.title;
        case "in_process_teammate":
            return `@${A.identity.agentName}`;
        case "local_workflow":
            return A.summary ?? A.description
    }
}
// @from(Ln 497239, Col 0)
function zGz(A) {
    let q = A.length;
    if (A.every((Y) => Y.type === A[0].type)) switch (A[0].type) {
        case "local_bash": {
            let Y = A.filter((w) => w.type === "local_bash" && w.kind === "monitor").length,
                z = q - Y,
                _ = [];
            if (z > 0) _.push(z === 1 ? "1 bash" : `${z} bashes`);
            if (Y > 0) _.push(Y === 1 ? "1 monitor" : `${Y} monitors`);
            return _.join(", ")
        }
        case "in_process_teammate": {
            let Y = new Set(A.map((z) => z.type === "in_process_teammate" ? z.identity.teamName : "")).size;
            return Y === 1 ? "1 team" : `${Y} teams`
        }
        case "local_agent":
            return q === 1 ? "1 local agent" : `${q} local agents`;
        case "remote_agent":
            if (A.every((Y) => Y.type === "remote_agent" && Y.isUltraplan)) return "Ultraplanning…";
            return q === 1 ? "1 remote session" : `${q} remote sessions`;
        case "local_workflow":
            return q === 1 ? "1 background workflow" : `${q} background workflows`
    }
    return `${q} background ${q===1?"task":"tasks"}`
}
// @from(Ln 497264, Col 4)
p4
// @from(Ln 497265, Col 4)
nbq = E(() => {
    e6();
    i6();
    b7();
    k8();
    NA();
    Lq();
    _q();
    M4();
    q3();
    Fv();
    Yc();
    H0();
    B16();
    p4 = t(P6(), 1)
})
// @from(Ln 497282, Col 0)
function rbq(A) {
    let q = A6(14),
        {
            teamsSelected: K,
            showHint: Y
        } = A,
        z = M1(wGz),
        _;
    if (q[0] !== z) _ = z ? Object.values(z.teammates).filter(_Gz).length : 0, q[0] = z, q[1] = _;
    else _ = q[1];
    let w = _;
    if (w === 0) return null;
    let O;
    if (q[2] !== Y || q[3] !== K) O = Y && K ? tX.createElement(tX.Fragment, null, tX.createElement(T, {
        dimColor: !0
    }, "· "), tX.createElement(T, {
        dimColor: !0
    }, "Enter to view")) : null, q[2] = Y, q[3] = K, q[4] = O;
    else O = q[4];
    let $ = O,
        H = `${w} ${w===1?"teammate":"teammates"}`,
        j = K ? "selected" : "normal",
        J;
    if (q[5] !== H || q[6] !== j || q[7] !== K) J = tX.createElement(T, {
        key: j,
        color: "background",
        inverse: K
    }, H), q[5] = H, q[6] = j, q[7] = K, q[8] = J;
    else J = q[8];
    let M;
    if (q[9] !== $) M = $ ? tX.createElement(T, null, " ", $) : null, q[9] = $, q[10] = M;
    else M = q[10];
    let D;
    if (q[11] !== J || q[12] !== M) D = tX.createElement(tX.Fragment, null, J, M), q[11] = J, q[12] = M, q[13] = D;
    else D = q[13];
    return D
}
// @from(Ln 497320, Col 0)
function _Gz(A) {
    return A.name !== "team-lead"
}
// @from(Ln 497324, Col 0)
function wGz(A) {
    return A.teamContext
}
// @from(Ln 497327, Col 4)
tX
// @from(Ln 497328, Col 4)
obq = E(() => {
    e6();
    i6();
    NA();
    tX = t(P6(), 1)
})
// @from(Ln 497335, Col 0)
function OGz(A) {
    let q = A6(9),
        {
            value: K,
            onChange: Y,
            historyFailedMatch: z
        } = A,
        _ = z ? "no matching prompt:" : "search prompts:",
        w;
    if (q[0] !== _) w = Z26.createElement(T, {
        dimColor: !0
    }, _), q[0] = _, q[1] = w;
    else w = q[1];
    let O = f8(K) + 1,
        $;
    if (q[2] !== Y || q[3] !== O || q[4] !== K) $ = Z26.createElement(J5, {
        value: K,
        onChange: Y,
        cursorOffset: K.length,
        onChangeCursorOffset: $Gz,
        columns: O,
        focus: !0,
        showCursor: !0,
        multiline: !1,
        dimColor: !0
    }), q[2] = Y, q[3] = O, q[4] = K, q[5] = $;
    else $ = q[5];
    let H;
    if (q[6] !== w || q[7] !== $) H = Z26.createElement(m, {
        gap: 1
    }, w, $), q[6] = w, q[7] = $, q[8] = H;
    else H = q[8];
    return H
}
// @from(Ln 497370, Col 0)
function $Gz() {}
// @from(Ln 497371, Col 4)
Z26
// @from(Ln 497371, Col 9)
abq
// @from(Ln 497372, Col 4)
sbq = E(() => {
    e6();
    i6();
    AH();
    q3();
    Z26 = t(P6(), 1);
    abq = OGz
})
// @from(Ln 497381, Col 0)
function jGz(A, q) {
    if (A) return "draft";
    switch (q) {
        case "APPROVED":
            return "approved";
        case "CHANGES_REQUESTED":
            return "changes_requested";
        default:
            return "pending"
    }
}
// @from(Ln 497392, Col 0)
async function tbq() {
    if (!await IH()) return null;
    let [q, K] = await Promise.all([kj(), oT()]);
    if (q === K) return null;
    let {
        stdout: Y,
        code: z
    } = await z8("gh", ["pr", "view", "--json", "number,url,reviewDecision,isDraft,headRefName,state"], {
        timeout: HGz,
        preserveOutputOnError: !1
    });
    if (z !== 0 || !Y.trim()) return null;
    try {
        let _ = i1(Y);
        if (_.headRefName === K || _.headRefName === "main" || _.headRefName === "master") return null;
        if (_.state === "MERGED" || _.state === "CLOSED") return null;
        return {
            number: _.number,
            url: _.url,
            reviewState: jGz(_.isDraft, _.reviewDecision)
        }
    } catch {
        return null
    }
}
// @from(Ln 497417, Col 4)
HGz = 5000
// @from(Ln 497418, Col 4)
ebq = E(() => {
    Eq();
    $5();
    g1()
})
// @from(Ln 497424, Col 0)
function Axq(A) {
    let q = xA(),
        K = CV6.useRef(null),
        Y = CV6.useRef(!1),
        z = CV6.useRef(0);
    CV6.useEffect(() => {
        if (Y.current) return;
        let _ = !1,
            w = -1,
            O = Date.now();
        async function $() {
            if (_) return;
            let j = yx();
            if (w !== j) w = j, O = Date.now();
            else if (Date.now() - O >= MGz) return;
            let J = Date.now(),
                M = await tbq();
            if (_) return;
            if (z.current = J, q((D) => {
                    let X = M?.number ?? null,
                        P = M?.reviewState ?? null;
                    if (D.prStatus.number === X && D.prStatus.reviewState === P) return D;
                    return {
                        ...D,
                        prStatus: {
                            number: X,
                            url: M?.url ?? null,
                            reviewState: P,
                            lastUpdated: Date.now()
                        }
                    }
                }), Date.now() - J > JGz) {
                Y.current = !0;
                return
            }
            if (!_) K.current = setTimeout($, Tt8)
        }
        let H = Date.now() - z.current;
        if (H >= Tt8) $();
        else K.current = setTimeout($, Tt8 - H);
        return () => {
            if (_ = !0, K.current) clearTimeout(K.current), K.current = null
        }
    }, [q, A])
}
// @from(Ln 497469, Col 4)
CV6
// @from(Ln 497469, Col 9)
Tt8 = 60000
// @from(Ln 497470, Col 4)
JGz = 4000
// @from(Ln 497471, Col 4)
MGz = 3600000
// @from(Ln 497472, Col 4)
qxq = E(() => {
    NA();
    T1();
    ebq();
    CV6 = t(P6(), 1)
})
// @from(Ln 497479, Col 0)
function zxq(A) {
    let q = A6(29),
        {
            exitMessage: K,
            vimMode: Y,
            mode: z,
            toolPermissionContext: _,
            suppressHint: w,
            isLoading: O,
            tasksSelected: $,
            teamsSelected: H,
            tmuxSelected: j,
            teammateFooterIndex: J,
            isPasting: M,
            isSearching: D,
            historyQuery: X,
            setHistoryQuery: P,
            historyFailedMatch: W
        } = A;
    if (K.show) {
        let R;
        if (q[0] !== K.key) R = F7.createElement(T, {
            dimColor: !0,
            key: "exit-message"
        }, "Press ", K.key, " again to exit"), q[0] = K.key, q[1] = R;
        else R = q[1];
        return R
    }
    if (M) {
        let R;
        if (q[2] === Symbol.for("react.memo_cache_sentinel")) R = F7.createElement(T, {
            dimColor: !0,
            key: "pasting-message"
        }, "Pasting text…"), q[2] = R;
        else R = q[2];
        return R
    }
    let Z;
    if (q[3] !== D || q[4] !== Y) Z = X16() && Y === "INSERT" && !D, q[3] = D, q[4] = Y, q[5] = Z;
    else Z = q[5];
    let G = Z,
        f;
    if (q[6] !== O) f = _xq() && F7.createElement(ZGz, {
        isLoading: O
    }), q[6] = O, q[7] = f;
    else f = q[7];
    let v;
    if (q[8] !== W || q[9] !== X || q[10] !== D || q[11] !== P) v = D && F7.createElement(abq, {
        value: X,
        onChange: P,
        historyFailedMatch: W
    }), q[8] = W, q[9] = X, q[10] = D, q[11] = P, q[12] = v;
    else v = q[12];
    let N;
    if (q[13] !== G) N = G ? F7.createElement(T, {
        dimColor: !0,
        key: "vim-insert"
    }, "-- INSERT --") : null, q[13] = G, q[14] = N;
    else N = q[14];
    let V = !w && !G,
        L;
    if (q[15] !== O || q[16] !== z || q[17] !== V || q[18] !== $ || q[19] !== J || q[20] !== H || q[21] !== j || q[22] !== _) L = F7.createElement(XGz, {
        mode: z,
        toolPermissionContext: _,
        showHint: V,
        isLoading: O,
        tasksSelected: $,
        teamsSelected: H,
        teammateFooterIndex: J,
        tmuxSelected: j
    }), q[15] = O, q[16] = z, q[17] = V, q[18] = $, q[19] = J, q[20] = H, q[21] = j, q[22] = _, q[23] = L;
    else L = q[23];
    let h;
    if (q[24] !== f || q[25] !== v || q[26] !== N || q[27] !== L) h = F7.createElement(m, {
        justifyContent: "flex-start",
        gap: 1
    }, f, v, N, L), q[24] = f, q[25] = v, q[26] = N, q[27] = L, q[28] = h;
    else h = q[28];
    return h
}
// @from(Ln 497560, Col 0)
function XGz({
    mode: A,
    toolPermissionContext: q,
    showHint: K,
    isLoading: Y,
    tasksSelected: z,
    teamsSelected: _,
    tmuxSelected: w,
    teammateFooterIndex: O
}) {
    let {
        columns: $
    } = KA(), H = Rq("chat:cycleMode", "Chat", "shift+tab"), j = M1((O6) => O6.tasks), J = M1((O6) => O6.teamContext), M = S5(), [D] = G26.useState(() => M.getState().remoteSessionUrl), X = M1((O6) => O6.viewSelectionMode), P = M1((O6) => O6.viewingAgentTaskId), W = M1((O6) => O6.expandedView), Z = W === "teammates", G = M1((O6) => O6.prStatus), f = M1((O6) => !1), v = G26.useSyncExternalStore(Kxq?.subscribeToProactiveChanges ?? DGz, Kxq?.getNextTickAt ?? Yxq, Yxq), N = (M1((O6) => O6.voiceEnabled) ?? !1) && GI(), V = M1((O6) => O6.voiceState) ?? "idle", L = M1((O6) => O6.voiceWarmingUp) ?? !1, h = !1, R = v !== null, u = !1, I = G26.useMemo(() => Object.values(j).filter((O6) => ij(O6) && !(sH() && O6.type === "local_agent")).length, [j, !1]), g = cQ6(), B = g !== void 0 && g.length > 0, b = Rq("chat:cancel", "Chat", "esc").toLowerCase(), p = Rq("app:toggleTodos", "Global", "ctrl+t"), Q = Rq("chat:killAgents", "Chat", "ctrl+f"), U = Rq("voice:pushToTalk", "Chat", "Space"), r = M1((O6) => O6.notifications.current?.key === "kill-agents-confirm"), e = E7() && !Rb() && J !== void 0 && Object.values(J.teammates).filter((O6) => O6.name !== "team-lead").length > 0;
    if (A === "bash") return F7.createElement(T, {
        color: "bashBorder"
    }, "! for bash mode");
    let Y6 = q?.mode,
        H6 = !Z57(Y6),
        J6 = X === "viewing-agent",
        K6 = P ? j[P] : void 0,
        s = J6 && K6 != null && K6.status !== "running",
        X6 = I > 0 || J6,
        z6 = (H6 ? 1 : 0) + (X6 ? 1 : 0) + (e ? 1 : 0),
        N6 = _xq() && G.number !== null && G.reviewState !== null && G.url !== null && z6 < 2 && (z6 === 0 || $ >= 80),
        $6 = z6 < 2,
        o = !Z && X6 && Object.values(j).some((O6) => O6.type === "in_process_teammate") || !Z && J6,
        a = [...[], ...D ? [F7.createElement(y7, {
            url: D,
            key: "remote"
        }, F7.createElement(T, {
            color: "ide"
        }, a6.circleDouble, " remote"))] : [], ...Y6 && H6 ? [F7.createElement(T, {
            color: kG(Y6),
            key: "mode"
        }, yC6(Y6), " ", null, QQ(Y6).toLowerCase(), " on", $6 && F7.createElement(T, {
            dimColor: !0
        }, " ", F7.createElement(a1, {
            shortcut: H,
            action: "cycle",
            parens: !0
        })))] : [], ...X6 && !o && !hh(j, Z) ? [F7.createElement(ft8, {
            key: "tasks",
            tasksSelected: z,
            showHint: K && !e,
            isViewingTeammate: J6,
            teammateFooterIndex: O,
            isLeaderIdle: !Y
        })] : [], ...[], ...E7() && e ? [F7.createElement(rbq, {
            key: "teams",
            teamsSelected: _,
            showHint: K && !X6
        })] : [], ...N6 ? [F7.createElement(T, {
            key: "pr-status",
            dimColor: !0
        }, F7.createElement(T, {
            color: WGz(G.reviewState)
        }, "PR"), " ", F7.createElement(y7, {
            url: G.url
        }, F7.createElement(T, {
            underline: !0
        }, "#", G.number)))] : []],
        i = Object.values(j).some((O6) => O6.type === "in_process_teammate" && O6.status === "running"),
        l = Object.values(j).some((O6) => O6.type === "local_agent" && O6.status === "running"),
        q6 = K ? PGz(Y, b, p, Q, B, W, i, l, r) : [];
    if (s) a.push(F7.createElement(T, {
        dimColor: !0,
        key: "esc-return"
    }, F7.createElement(a1, {
        shortcut: b,
        action: "return to team lead"
    })));
    else if (!o && K) a.push(...q6);
    if (o) {
        let O6 = s ? a : [...a, ...q6];
        return F7.createElement(m, {
            flexDirection: "column"
        }, F7.createElement(m, null, F7.createElement(ft8, {
            tasksSelected: z,
            showHint: !1,
            isViewingTeammate: J6,
            teammateFooterIndex: O,
            isLeaderIdle: !Y
        })), O6.length > 0 && F7.createElement(m, null, F7.createElement(C8, null, O6)))
    }
    let w6 = !1;
    if (a.length === 0 && K) a.push(F7.createElement(T, {
        dimColor: !0,
        key: "shortcuts-hint"
    }, "? for shortcuts"));
    if (N && L) a.push(F7.createElement(rs8, {
        key: "voice-warmup"
    }));
    else if (a.length > 0 && K && N && V === "idle" && q6.length === 0) a.push(F7.createElement(T, {
        dimColor: !0,
        key: "voice-hint"
    }, "hold ", U, " to speak"));
    if (w6 && K) a.push(F7.createElement(T, {
        dimColor: !0,
        key: "manage-tasks"
    }, F7.createElement(a1, {
        shortcut: "↓",
        action: "manage tasks"
    })));
    if (a.length === 0) return null;
    return F7.createElement(T, {
        wrap: "truncate"
    }, F7.createElement(C8, null, a))
}
// @from(Ln 497669, Col 0)
function PGz(A, q, K, Y, z, _, w, O, $) {
    let H;
    if (w) switch (_) {
        case "none":
            H = "show tasks";
            break;
        case "tasks":
            H = "show teammates";
            break;
        case "teammates":
            H = "hide";
            break
    } else H = _ === "tasks" ? "hide tasks" : "show tasks";
    let j = z || w;
    return [...A ? [F7.createElement(T, {
        dimColor: !0,
        key: "esc"
    }, F7.createElement(a1, {
        shortcut: q,
        action: "interrupt"
    }))] : [], ...!A && O && !$ ? [F7.createElement(T, {
        dimColor: !0,
        key: "kill-agents"
    }, F7.createElement(a1, {
        shortcut: Y,
        action: "stop agents"
    }))] : [], ...j ? [F7.createElement(T, {
        dimColor: !0,
        key: "toggle-tasks"
    }, F7.createElement(a1, {
        shortcut: K,
        action: H
    }))] : []]
}
// @from(Ln 497704, Col 0)
function WGz(A) {
    switch (A) {
        case "approved":
            return "success";
        case "changes_requested":
            return "error";
        case "pending":
            return "warning";
        case "merged":
            return "merged";
        case "closed":
        case "draft":
            return
    }
}
// @from(Ln 497720, Col 0)
function ZGz(A) {
    let {
        isLoading: q
    } = A;
    return Axq(q), null
}
// @from(Ln 497727, Col 0)
function _xq() {
    return w8("tengu_pr_status_cli", !1) && (X1().prStatusFooterEnabled ?? !0)
}
// @from(Ln 497730, Col 4)
F7
// @from(Ln 497730, Col 8)
G26
// @from(Ln 497730, Col 13)
Kxq = null
// @from(Ln 497731, Col 4)
DGz = (A) => () => {}
// @from(Ln 497732, Col 4)
Yxq = () => null
// @from(Ln 497733, Col 4)
wxq = E(() => {
    e6();
    i6();
    b7();
    hv6();
    Rj();
    rD();
    nbq();
    Yc();
    B16();
    Qz();
    obq();
    wh();
    NA();
    sbq();
    qxq();
    Lq();
    Xq();
    _q();
    EZ1();
    M4();
    HA();
    os8();
    Id();
    Tb();
    Fj8();
    k8();
    nz6();
    F7 = t(P6(), 1), G26 = t(P6(), 1)
})
// @from(Ln 497764, Col 0)
function vt8(A) {
    return A?.statusLine !== void 0
}
// @from(Ln 497768, Col 0)
function GGz(A, q, K, Y, z, _) {
    let w = Pp(),
        O = S0(),
        $ = II({
            permissionMode: A,
            mainLoopModel: cK(),
            exceeds200kTokens: q
        }),
        H = K?.outputStyle || hf,
        j = FD1(Y),
        J = uM($, Zj()),
        M = bS1(j, J),
        D = R1(),
        X = ek(D);
    return {
        ...$w(),
        ...X && {
            session_name: X
        },
        model: {
            id: $,
            display_name: qJ($)
        },
        workspace: {
            current_dir: G1(),
            project_dir: AA(),
            added_dirs: z
        },
        version: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION,
        output_style: {
            name: H
        },
        cost: {
            total_cost_usd: LD(),
            total_duration_ms: Iw6(),
            total_api_duration_ms: OV(),
            total_lines_added: n86(),
            total_lines_removed: r86()
        },
        context_window: {
            total_input_tokens: o86(),
            total_output_tokens: Mp(),
            context_window_size: J,
            current_usage: j,
            used_percentage: M.used,
            remaining_percentage: M.remaining
        },
        exceeds_200k_tokens: q,
        ...X16() && {
            vim: {
                mode: _ ?? "INSERT"
            }
        },
        ...w && {
            agent: {
                name: w
            }
        },
        ...t4() && {
            remote: {
                session_id: R1()
            }
        },
        ...O && {
            worktree: {
                name: O.worktreeName,
                path: O.worktreePath,
                branch: O.worktreeBranch,
                original_cwd: O.originalCwd,
                original_branch: O.originalBranch
            }
        }
    }
}
// @from(Ln 497850, Col 0)
function Nt8(A) {
    return bX(A)?.uuid ?? null
}
// @from(Ln 497854, Col 0)
function fGz({
    messagesRef: A,
    lastAssistantMessageId: q,
    vimMode: K
}) {
    let Y = PM.useRef(void 0),
        z = M1((N) => N.toolPermissionContext.mode),
        _ = M1((N) => N.toolPermissionContext.additionalWorkingDirectories),
        w = M1((N) => N.statusLineText),
        O = xA(),
        $ = Kj(),
        H = PM.useRef($);
    H.current = $;
    let j = PM.useRef(K);
    j.current = K;
    let J = PM.useRef(z);
    J.current = z;
    let M = PM.useRef(_);
    M.current = _;
    let D = PM.useRef({
            messageId: null,
            exceeds200kTokens: !1,
            permissionMode: z,
            vimMode: K
        }),
        X = PM.useRef(void 0),
        P = PM.useRef(!0),
        W = PM.useCallback(async () => {
            Y.current?.abort();
            let N = new AbortController;
            Y.current = N;
            let V = A.current,
                L = P.current;
            P.current = !1;
            try {
                let h = D.current.exceeds200kTokens,
                    R = Nt8(V);
                if (R !== D.current.messageId) h = pD1(V), D.current.messageId = R, D.current.exceeds200kTokens = h;
                let u = GGz(J.current, h, H.current, V, Array.from(M.current.keys()), j.current),
                    I = await Lr8(u, N.signal, void 0, L);
                if (!N.signal.aborted) O((g) => {
                    if (g.statusLineText === I) return g;
                    return {
                        ...g,
                        statusLineText: I
                    }
                })
            } catch {}
        }, [A, O]),
        Z = PM.useCallback(() => {
            if (X.current !== void 0) clearTimeout(X.current);
            X.current = setTimeout((N, V) => {
                N.current = void 0, V()
            }, 300, X, W)
        }, [W]);
    PM.useEffect(() => {
        if (q !== D.current.messageId || z !== D.current.permissionMode || K !== D.current.vimMode) D.current.permissionMode = z, D.current.vimMode = K, Z()
    }, [q, z, K, Z]);
    let G = $?.statusLine?.command,
        f = PM.useRef(!0);
    PM.useEffect(() => {
        if (f.current) {
            f.current = !1;
            return
        }
        P.current = !0, W()
    }, [G, W]), PM.useEffect(() => {
        let N = $?.statusLine;
        if (N) {
            if (d("tengu_status_line_mount", {
                    command_length: N.command.length,
                    padding: N.padding
                }), $.disableAllHooks === !0) k("Status line is configured but disableAllHooks is true", {
                level: "warn"
            })
        }
    }, []), PM.useEffect(() => {
        return W(), () => {
            if (Y.current?.abort(), X.current !== void 0) clearTimeout(X.current)
        }
    }, []);
    let v = $?.statusLine?.padding ?? 0;
    return f26.createElement(m, {
        paddingX: v,
        gap: 2
    }, w && f26.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, f26.createElement(wK, null, w)))
}
// @from(Ln 497944, Col 4)
f26
// @from(Ln 497944, Col 9)
PM
// @from(Ln 497944, Col 13)
Oxq
// @from(Ln 497945, Col 4)
$xq = E(() => {
    i6();
    hw();
    T1();
    lA();
    Oq();
    nI();
    z4();
    hw();
    V1();
    H1();
    NA();
    aB();
    $k();
    xJ();
    AZ();
    hv6();
    jN();
    JA();
    f26 = t(P6(), 1), PM = t(P6(), 1);
    Oxq = PM.memo(fGz)
})
// @from(Ln 497968, Col 0)
function Hxq({
    selectedIndex: A
}) {
    let q = M1(($) => $.tasks),
        K = WM.useRef([]),
        [, Y] = WM.useState(0);
    WM.useEffect(() => {
        let $ = setInterval((H) => H((j) => j + 1), 1000, Y);
        return () => clearInterval($)
    }, []);
    let z = WM.useMemo(() => {
            let $ = new Map;
            for (let H of Object.values(q))
                if (H.type === "local_agent") $.set(H.id, H);
            return $
        }, [q]),
        _ = new Set(K.current),
        w = [...z.keys()].filter(($) => !_.has($)).sort(($, H) => {
            let j = z.get($),
                J = z.get(H);
            if (!j || !J) return 0;
            return j.startTime - J.startTime
        });
    if (w.length > 0) K.current = [...K.current, ...w];
    let O = [];
    for (let $ of K.current) {
        let H = z.get($);
        if (!H) continue;
        if (!JN6(H.status)) O.push(H);
        else if (H.status === "killed" && H.endTime) {
            if (Date.now() - H.endTime < mB) O.push(H)
        }
    }
    if (K.current.length > z.size + 10) K.current = K.current.filter(($) => z.has($));
    if (O.length === 0) return null;
    return WM.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, O.map(($, H) => WM.createElement(NGz, {
        key: $.id,
        task: $,
        isSelected: A === H
    })))
}
// @from(Ln 498013, Col 0)
function aI1() {
    let A = M1(vGz),
        q;
    A: {
        if (!e2() && !sH()) {
            q = 0;
            break A
        }
        let K = Date.now(),
            Y = Object.values(A).filter(TGz),
            z = 0;
        for (let _ of Y)
            if (!JN6(_.status)) z++;
            else if (_.status === "killed" && _.endTime && K - _.endTime < mB) z++;q = z
    }
    return q
}
// @from(Ln 498031, Col 0)
function TGz(A) {
    return A.type === "local_agent"
}
// @from(Ln 498035, Col 0)
function vGz(A) {
    return A.tasks
}
// @from(Ln 498039, Col 0)
function NGz(A) {
    let q = A6(28),
        {
            task: K,
            isSelected: Y
        } = A,
        {
            columns: z
        } = KA(),
        _ = !JN6(K.status),
        w = K.totalPausedMs ?? 0,
        O = Math.max(0, _ ? Date.now() - K.startTime - w : (K.endTime ?? K.startTime) - K.startTime - w),
        $;
    if (q[0] !== O) $ = UK(O), q[0] = O, q[1] = $;
    else $ = q[1];
    let H = $,
        j = K.progress?.tokenCount,
        J = K.progress?.lastActivity,
        M = J ? a6.arrowDown : a6.arrowUp,
        D;
    if (q[2] !== M || q[3] !== j) D = j !== void 0 && j > 0 ? ` · ${M} ${fq(j)} tokens` : "", q[2] = M, q[3] = j, q[4] = D;
    else D = q[4];
    let X = D,
        P;
    if (q[5] !== J?.activityDescription || q[6] !== K.progress) P = (K.progress?.recentActivities && rt(K.progress.recentActivities)) ?? J?.activityDescription, q[5] = J?.activityDescription, q[6] = K.progress, q[7] = P;
    else P = q[7];
    let W = P,
        Z = K.progress?.summary,
        G = Z || W || K.description,
        f, v;
    if (q[8] !== Z || q[9] !== K.id) f = () => {
        k(`[CoordinatorAgentStatus] Summary updated for task ${K.id}: ${Z??"(none)"}`)
    }, v = [Z, K.id], q[8] = Z, q[9] = K.id, q[10] = f, q[11] = v;
    else f = q[10], v = q[11];
    WM.useEffect(f, v);
    let N = Y ? a6.pointer + " " : "  ",
        V = ` · ${H}${X}`,
        L = z - f8(N) - f8(V),
        h = Math.max(0, L),
        R;
    if (q[12] !== G || q[13] !== h) R = jk(G, h, "truncate-end"), q[12] = G, q[13] = h, q[14] = R;
    else R = q[14];
    let u = R;
    if (!_) {
        let B = !Y,
            b;
        if (q[15] === Symbol.for("react.memo_cache_sentinel")) b = WM.createElement(T, {
            color: "warning"
        }, " · ", a6.cross, " Stopped"), q[15] = b;
        else b = q[15];
        let p;
        if (q[16] !== H || q[17] !== N || q[18] !== B || q[19] !== X || q[20] !== u) p = WM.createElement(T, {
            dimColor: B
        }, N, u, " · ", H, X, b), q[16] = H, q[17] = N, q[18] = B, q[19] = X, q[20] = u, q[21] = p;
        else p = q[21];
        return p
    }
    let I = !Y,
        g;
    if (q[22] !== H || q[23] !== N || q[24] !== I || q[25] !== X || q[26] !== u) g = WM.createElement(T, {
        dimColor: I
    }, N, u, " · ", H, X), q[22] = H, q[23] = N, q[24] = I, q[25] = X, q[26] = u, q[27] = g;
    else g = q[27];
    return g
}
// @from(Ln 498104, Col 4)
WM
// @from(Ln 498105, Col 4)
Vt8 = E(() => {
    e6();
    i6();
    NA();
    Fv();
    Yc();
    b7();
    M4();
    B16();
    gB();
    q3();
    _q();
    H1();
    O0();
    WM = t(P6(), 1)
})
// @from(Ln 498122, Col 0)
function kGz({
    apiKeyStatus: A,
    debug: q,
    exitMessage: K,
    vimMode: Y,
    mode: z,
    autoUpdaterResult: _,
    isAutoUpdating: w,
    verbose: O,
    onAutoUpdaterResult: $,
    onChangeIsUpdating: H,
    suggestions: j,
    selectedSuggestion: J,
    maxColumnWidth: M,
    toolPermissionContext: D,
    helpOpen: X,
    suppressHint: P,
    isLoading: W,
    tasksSelected: Z,
    teamsSelected: G,
    bridgeSelected: f,
    tmuxSelected: v,
    teammateFooterIndex: N,
    coordinatorTaskIndex: V,
    ideSelection: L,
    mcpClients: h,
    isPasting: R = !1,
    isInputWrapped: u = !1,
    messages: I,
    isSearching: g,
    historyQuery: B,
    setHistoryQuery: b,
    historyFailedMatch: p
}) {
    let Q = Kj(),
        {
            columns: U,
            rows: r
        } = KA(),
        e = IV6.useRef(I);
    e.current = I;
    let Y6 = IV6.useMemo(() => Nt8(I), [I]),
        H6 = U < 80,
        J6 = !1,
        K6 = J6 && r < 24,
        s = aI1(),
        X6 = Z && (s === 0 || (V ?? -1) < 0),
        z6 = P || vt8(Q) || g,
        N6 = null;
    if (j.length)
        if (J6) N6 = s9.createElement(m, {
            position: "absolute",
            bottom: "100%",
            left: 0,
            right: 0,
            paddingX: 2,
            opaque: !0
        }, s9.createElement(Ov6, {
            suggestions: j,
            selectedSuggestion: J,
            maxColumnWidth: M,
            overlay: !0
        }));
        else return s9.createElement(m, {
            paddingX: 2,
            paddingY: 0
        }, s9.createElement(Ov6, {
            suggestions: j,
            selectedSuggestion: J,
            maxColumnWidth: M
        }));
    if (X) return s9.createElement(AL1, {
        dimColor: !0,
        fixedWidth: !0,
        paddingX: 2
    });
    return s9.createElement(s9.Fragment, null, N6, s9.createElement(m, {
        flexDirection: H6 ? "column" : "row",
        justifyContent: H6 ? "flex-start" : "space-between",
        paddingX: 2,
        gap: H6 ? 0 : 1
    }, s9.createElement(m, {
        flexDirection: "column",
        flexShrink: H6 ? 0 : 1
    }, z === "prompt" && !K6 && !K.show && !R && vt8(Q) && s9.createElement(Oxq, {
        messagesRef: e,
        lastAssistantMessageId: Y6,
        vimMode: Y
    }), s9.createElement(zxq, {
        exitMessage: K,
        vimMode: Y,
        mode: z,
        toolPermissionContext: D,
        suppressHint: z6,
        isLoading: W,
        tasksSelected: X6,
        teamsSelected: G,
        teammateFooterIndex: N,
        tmuxSelected: v,
        isPasting: R,
        isSearching: g,
        historyQuery: B,
        setHistoryQuery: b,
        historyFailedMatch: p
    })), s9.createElement(m, {
        flexShrink: 1,
        gap: 1
    }, J6 ? null : s9.createElement(Abq, {
        apiKeyStatus: A,
        autoUpdaterResult: _,
        debug: q,
        isAutoUpdating: w,
        verbose: O,
        messages: I,
        onAutoUpdaterResult: $,
        onChangeIsUpdating: H,
        ideSelection: L,
        mcpClients: h,
        isInputWrapped: u,
        isNarrow: H6
    }), s9.createElement(EGz, {
        bridgeSelected: f
    }))), (e2() || sH()) && s9.createElement(Hxq, {
        selectedIndex: Z ? V : void 0
    }))
}
// @from(Ln 498249, Col 0)
function EGz({
    bridgeSelected: A
}) {
    let q = M1((j) => j.replBridgeEnabled),
        K = M1((j) => j.replBridgeConnected),
        Y = M1((j) => j.replBridgeSessionActive),
        z = M1((j) => j.replBridgeReconnecting),
        _ = M1((j) => j.replBridgeError),
        w = M1((j) => j.replBridgeExplicit);
    if (!dl() || !q && !_) return null;
    let O = _C1({
        error: _,
        connected: K,
        sessionActive: Y,
        reconnecting: z
    });
    if (!w && O.label !== "Remote Control failed" && O.label !== "Remote Control reconnecting") return null;
    let {
        label: $,
        color: H
    } = O;
    return s9.createElement(T, {
        color: A ? "background" : H,
        inverse: A,
        wrap: "truncate"
    }, $, A && s9.createElement(T, {
        dimColor: !0
    }, " · Enter to view"))
}
// @from(Ln 498278, Col 4)
s9
// @from(Ln 498278, Col 8)
IV6
// @from(Ln 498278, Col 13)
jxq
// @from(Ln 498279, Col 4)
Jxq = E(() => {
    i6();
    wxq();
    xI1();
    $xq();
    nI();
    _q();
    op8();
    NU8();
    Vt8();
    Fv();
    Yc();
    MF();
    _86();
    NA();
    Tb();
    s9 = t(P6(), 1), IV6 = t(P6(), 1);
    jxq = IV6.memo(kGz)
})
// @from(Ln 498299, Col 0)
function Mxq(A, q) {
    let K = sI1.useRef(void 0);
    sI1.useEffect(() => {
        let Y = Gv(A);
        if (K.current !== Y) K.current = Y;
        if (Y) Y.client.setNotificationHandler(LGz(), (z) => {
            if (K.current !== Y) return;
            try {
                let _ = z.params,
                    w = _.lineStart !== void 0 ? _.lineStart + 1 : void 0,
                    O = _.lineEnd !== void 0 ? _.lineEnd + 1 : void 0;
                q({
                    filePath: _.filePath,
                    lineStart: w,
                    lineEnd: O
                })
            } catch (_) {
                _6(_)
            }
        })
    }, [A, q])
}
// @from(Ln 498321, Col 4)
sI1
// @from(Ln 498321, Col 9)
yGz = "at_mentioned"
// @from(Ln 498322, Col 4)
LGz
// @from(Ln 498323, Col 4)
Dxq = E(() => {
    K7();
    Sw();
    k1();
    sI1 = t(P6(), 1), LGz = F6(() => C.object({
        method: C.literal(yGz),
        params: C.object({
            filePath: C.string(),
            lineStart: C.number().optional(),
            lineEnd: C.number().optional()
        })
    }))
})
// @from(Ln 498337, Col 0)
function Xxq({
    maxBufferSize: A,
    debounceMs: q
}) {
    let [K, Y] = QF.useState([]), [z, _] = QF.useState(-1), w = QF.useRef(0), O = QF.useRef(null), $ = QF.useCallback((M, D, X = {}) => {
        let P = Date.now();
        if (O.current) clearTimeout(O.current), O.current = null;
        if (P - w.current < q) {
            O.current = setTimeout($, q, M, D, X);
            return
        }
        w.current = P, Y((W) => {
            let Z = z >= 0 ? W.slice(0, z + 1) : W,
                G = Z[Z.length - 1];
            if (G && G.text === M) return Z;
            let f = [...Z, {
                text: M,
                cursorOffset: D,
                pastedContents: X,
                timestamp: P
            }];
            if (f.length > A) return f.slice(-A);
            return f
        }), _((W) => {
            let Z = W >= 0 ? W + 1 : K.length;
            return Math.min(Z, A - 1)
        })
    }, [q, A, z, K.length]), H = QF.useCallback(() => {
        if (z < 0 || K.length === 0) return;
        let M = Math.max(0, z - 1),
            D = K[M];
        if (D) return _(M), D;
        return
    }, [K, z]), j = QF.useCallback(() => {
        if (Y([]), _(-1), w.current = 0, O.current) clearTimeout(O.current), O.current = null
    }, [w, O]), J = z > 0 && K.length > 1;
    return {
        pushToBuffer: $,
        undo: H,
        canUndo: J,
        clearBuffer: j
    }
}
// @from(Ln 498380, Col 4)
QF
// @from(Ln 498381, Col 4)
Pxq = E(() => {
    QF = t(P6(), 1)
})
// @from(Ln 498385, Col 0)
function Wxq(A) {
    return A === "tmux" || A === "iterm2"
}
// @from(Ln 498389, Col 0)
function Zxq(A) {
    let q = e$(A);
    if (!q) return [];
    let K = [];
    for (let Y of q.members) {
        if (Y.name === "team-lead") continue;
        let _ = Y.isActive !== !1 ? "running" : "idle";
        K.push({
            name: Y.name,
            agentId: Y.agentId,
            agentType: Y.agentType,
            model: Y.model,
            prompt: Y.prompt,
            status: _,
            color: Y.color,
            tmuxPaneId: Y.tmuxPaneId,
            cwd: Y.cwd,
            worktreePath: Y.worktreePath,
            isHidden: ay8(A, Y.tmuxPaneId),
            backendType: Y.backendType && Wxq(Y.backendType) ? Y.backendType : void 0,
            mode: Y.mode
        })
    }
    return K
}
// @from(Ln 498414, Col 4)
Gxq = E(() => {
    vf()
})
// @from(Ln 498421, Col 0)
function fxq({
    initialTeams: A,
    onDone: q
}) {
    oj("teams-dialog");
    let K = xA(),
        Y = A?.[0]?.name ?? "",
        [z, _] = FE.useState({
            type: "teammateList",
            teamName: Y
        }),
        [w, O] = FE.useState(0),
        [$, H] = FE.useState(0),
        j = FE.useMemo(() => {
            return Zxq(z.teamName)
        }, [z.teamName, $]);
    OX(() => {
        H((W) => W + 1)
    }, 1000);
    let J = FE.useMemo(() => {
            if (z.type !== "teammateDetail") return null;
            return j.find((W) => W.name === z.memberName) ?? null
        }, [z, j]),
        M = M1((W) => W.toolPermissionContext.isBypassPermissionsModeAvailable),
        D = () => {
            _({
                type: "teammateList",
                teamName: z.teamName
            }), O(0)
        },
        X = FE.useCallback(() => {
            if (z.type === "teammateDetail" && J) BGz(J, z.teamName, M), H((W) => W + 1);
            else if (z.type === "teammateList" && j.length > 0) gGz(j, z.teamName, M), H((W) => W + 1)
        }, [z, J, j, M]);
    tA({
        "confirm:cycleMode": X
    }, {
        context: "Confirmation"
    }), jA((W, Z) => {
        if (Z.leftArrow) {
            if (z.type === "teammateDetail") D();
            return
        }
        if (Z.upArrow || Z.downArrow) {
            let G = P();
            if (Z.upArrow) O((f) => Math.max(0, f - 1));
            else O((f) => Math.min(G, f + 1));
            return
        }
        if (Z.return) {
            if (z.type === "teammateList" && j[w]) _({
                type: "teammateDetail",
                teamName: z.teamName,
                memberName: j[w].name
            });
            else if (z.type === "teammateDetail" && J) xGz(J.tmuxPaneId), q();
            return
        }
        if (W === "k") {
            if (z.type === "teammateList" && j[w]) kt8(j[w].tmuxPaneId, z.teamName, j[w].agentId, j[w].name, K).then(() => {
                H((G) => G + 1), O((G) => Math.max(0, Math.min(G, j.length - 2)))
            });
            else if (z.type === "teammateDetail" && J) kt8(J.tmuxPaneId, z.teamName, J.agentId, J.name, K), D();
            return
        }
        if (W === "s") {
            if (z.type === "teammateList" && j[w]) {
                let G = j[w];
                rv1(G.name, z.teamName, "Graceful shutdown requested by team lead")
            } else if (z.type === "teammateDetail" && J) rv1(J.name, z.teamName, "Graceful shutdown requested by team lead"), D();
            return
        }
        if (W === "h") {
            let G = Ff6(),
                f = z.type === "teammateList" ? j[w] : z.type === "teammateDetail" ? J : null;
            if (f && G?.supportsHideShow) {
                if (uGz(f, z.teamName).then(() => {
                        H((v) => v + 1)
                    }), z.type === "teammateDetail") D()
            }
            return
        }
        if (W === "H" && z.type === "teammateList") {
            if (Ff6()?.supportsHideShow && j.length > 0) {
                let f = j.some((v) => !v.isHidden);
                Promise.all(j.map((v) => f ? vxq(v, z.teamName) : Nxq(v, z.teamName))).then(() => {
                    H((v) => v + 1)
                })
            }
            return
        }
        if (W === "p" && z.type === "teammateList") {
            let G = j.filter((f) => f.status === "idle");
            if (G.length > 0) Promise.all(G.map((f) => kt8(f.tmuxPaneId, z.teamName, f.agentId, f.name, K))).then(() => {
                H((f) => f + 1), O((f) => Math.max(0, Math.min(f, j.length - G.length - 1)))
            });
            return
        }
    });

    function P() {
        if (z.type === "teammateList") return Math.max(0, j.length - 1);
        return 0
    }
    if (z.type === "teammateList") return s4.createElement(hGz, {
        teamName: z.teamName,
        teammates: j,
        selectedIndex: w,
        onCancel: q
    });
    if (z.type === "teammateDetail" && J) return s4.createElement(CGz, {
        teammate: J,
        teamName: z.teamName,
        onCancel: D
    });
    return null
}
// @from(Ln 498539, Col 0)
function hGz(A) {
    let q = A6(13),
        {
            teamName: K,
            teammates: Y,
            selectedIndex: z,
            onCancel: _
        } = A,
        w = `${Y.length} ${Y.length===1?"teammate":"teammates"}`,
        O = Ff6()?.supportsHideShow ?? !1,
        $ = Rq("confirm:cycleMode", "Confirmation", "shift+tab"),
        H = `Team ${K}`,
        j;
    if (q[0] !== z || q[1] !== Y) j = Y.length === 0 ? s4.createElement(T, {
        dimColor: !0
    }, "No teammates") : s4.createElement(m, {
        flexDirection: "column"
    }, Y.map((X, P) => s4.createElement(SGz, {
        key: X.agentId,
        teammate: X,
        isSelected: P === z
    }))), q[0] = z, q[1] = Y, q[2] = j;
    else j = q[2];
    let J;
    if (q[3] !== _ || q[4] !== w || q[5] !== H || q[6] !== j) J = s4.createElement(m8, {
        title: H,
        subtitle: w,
        onCancel: _,
        color: "background",
        hideInputGuide: !0
    }, j), q[3] = _, q[4] = w, q[5] = H, q[6] = j, q[7] = J;
    else J = q[7];
    let M;
    if (q[8] !== $) M = s4.createElement(m, {
        marginLeft: 1
    }, s4.createElement(T, {
        dimColor: !0
    }, a6.arrowUp, "/", a6.arrowDown, " select · Enter view · k kill · s shutdown · p prune idle", O && " · h hide/show · H hide/show all", " · ", $, " sync cycle modes for all · Esc close")), q[8] = $, q[9] = M;
    else M = q[9];
    let D;
    if (q[10] !== J || q[11] !== M) D = s4.createElement(s4.Fragment, null, J, M), q[10] = J, q[11] = M, q[12] = D;
    else D = q[12];
    return D
}
// @from(Ln 498584, Col 0)
function SGz(A) {
    let q = A6(21),
        {
            teammate: K,
            isSelected: Y
        } = A,
        z = K.status === "idle",
        _ = z && !Y,
        w, O;
    if (q[0] !== K.mode) {
        let W = K.mode ? wC(K.mode) : "default";
        w = yC6(W), O = kG(W), q[0] = K.mode, q[1] = w, q[2] = O
    } else w = q[1], O = q[2];
    let $ = O,
        H = Y ? "suggestion" : void 0,
        j = Y ? a6.pointer + " " : "  ",
        J;
    if (q[3] !== K.isHidden) J = K.isHidden && s4.createElement(T, {
        dimColor: !0
    }, "[hidden] "), q[3] = K.isHidden, q[4] = J;
    else J = q[4];
    let M;
    if (q[5] !== z) M = z && s4.createElement(T, {
        dimColor: !0
    }, "[idle] "), q[5] = z, q[6] = M;
    else M = q[6];
    let D;
    if (q[7] !== $ || q[8] !== w) D = w && s4.createElement(T, {
        color: $
    }, w, " "), q[7] = $, q[8] = w, q[9] = D;
    else D = q[9];
    let X;
    if (q[10] !== K.model) X = K.model && s4.createElement(T, {
        dimColor: !0
    }, " (", K.model, ")"), q[10] = K.model, q[11] = X;
    else X = q[11];
    let P;
    if (q[12] !== _ || q[13] !== H || q[14] !== j || q[15] !== J || q[16] !== M || q[17] !== D || q[18] !== X || q[19] !== K.name) P = s4.createElement(T, {
        color: H,
        dimColor: _
    }, j, J, M, D, "@", K.name, X), q[12] = _, q[13] = H, q[14] = j, q[15] = J, q[16] = M, q[17] = D, q[18] = X, q[19] = K.name, q[20] = P;
    else P = q[20];
    return P
}
// @from(Ln 498629, Col 0)
function CGz(A) {
    let q = A6(39),
        {
            teammate: K,
            teamName: Y,
            onCancel: z
        } = A,
        [_, w] = FE.useState(!1),
        O = Rq("confirm:cycleMode", "Confirmation", "shift+tab"),
        $ = K.color ? t$[K.color] : void 0,
        H;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) H = [], q[0] = H;
    else H = q[0];
    let [j, J] = FE.useState(H), M, D;
    if (q[1] !== Y || q[2] !== K.agentId || q[3] !== K.name) M = () => {
        let b = !1;
        return DX(Y).then((p) => {
            if (b) return;
            J(p.filter((Q) => Q.owner === K.agentId || Q.owner === K.name))
        }), () => {
            b = !0
        }
    }, D = [Y, K.agentId, K.name], q[1] = Y, q[2] = K.agentId, q[3] = K.name, q[4] = M, q[5] = D;
    else M = q[4], D = q[5];
    FE.useEffect(M, D);
    let X;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) X = (b) => {
        if (b === "p") w(bGz)
    }, q[6] = X;
    else X = q[6];
    jA(X);
    let P = K.worktreePath || K.cwd,
        W;
    if (q[7] !== K.model || q[8] !== K.worktreePath || q[9] !== P) {
        if (W = [], K.model) W.push(K.model);
        if (P) W.push(K.worktreePath ? `worktree: ${P}` : P);
        q[7] = K.model, q[8] = K.worktreePath, q[9] = P, q[10] = W
    } else W = q[10];
    let Z = W.join(" · ") || void 0,
        G, f;
    if (q[11] !== K.mode) {
        let b = K.mode ? wC(K.mode) : "default";
        G = yC6(b), f = kG(b), q[11] = K.mode, q[12] = G, q[13] = f
    } else G = q[12], f = q[13];
    let v = f,
        N;
    if (q[14] !== v || q[15] !== G) N = G && s4.createElement(T, {
        color: v
    }, G, " "), q[14] = v, q[15] = G, q[16] = N;
    else N = q[16];
    let V;
    if (q[17] !== K.name || q[18] !== $) V = $ ? s4.createElement(T, {
        color: $
    }, `@${K.name}`) : `@${K.name}`, q[17] = K.name, q[18] = $, q[19] = V;
    else V = q[19];
    let L;
    if (q[20] !== N || q[21] !== V) L = s4.createElement(s4.Fragment, null, N, V), q[20] = N, q[21] = V, q[22] = L;
    else L = q[22];
    let h = L,
        R;
    if (q[23] !== j) R = j.length > 0 && s4.createElement(m, {
        flexDirection: "column"
    }, s4.createElement(T, {
        bold: !0
    }, "Tasks"), j.map(IGz)), q[23] = j, q[24] = R;
    else R = q[24];
    let u;
    if (q[25] !== _ || q[26] !== K.prompt) u = K.prompt && s4.createElement(m, {
        flexDirection: "column"
    }, s4.createElement(T, {
        bold: !0
    }, "Prompt"), s4.createElement(T, null, _ ? K.prompt : jq(K.prompt, 80), f8(K.prompt) > 80 && !_ && s4.createElement(T, {
        dimColor: !0
    }, " (p to expand)"))), q[25] = _, q[26] = K.prompt, q[27] = u;
    else u = q[27];
    let I;
    if (q[28] !== z || q[29] !== Z || q[30] !== u || q[31] !== R || q[32] !== h) I = s4.createElement(m8, {
        title: h,
        subtitle: Z,
        onCancel: z,
        color: "background",
        hideInputGuide: !0
    }, R, u), q[28] = z, q[29] = Z, q[30] = u, q[31] = R, q[32] = h, q[33] = I;
    else I = q[33];
    let g;
    if (q[34] !== O) g = s4.createElement(m, {
        marginLeft: 1
    }, s4.createElement(T, {
        dimColor: !0
    }, a6.arrowLeft, " back · Esc close · k kill · s shutdown", Ff6()?.supportsHideShow && " · h hide/show", " · ", O, " cycle mode")), q[34] = O, q[35] = g;
    else g = q[35];
    let B;
    if (q[36] !== I || q[37] !== g) B = s4.createElement(s4.Fragment, null, I, g), q[36] = I, q[37] = g, q[38] = B;
    else B = q[38];
    return B
}
// @from(Ln 498726, Col 0)
function IGz(A) {
    return s4.createElement(T, {
        key: A.id,
        color: A.status === "completed" ? "success" : void 0
    }, A.status === "completed" ? a6.tick : "◼", " ", A.subject)
}
// @from(Ln 498733, Col 0)
function bGz(A) {
    return !A
}
// @from(Ln 498737, Col 0)
function Txq(A) {
    return !A.startsWith("%")
}
// @from(Ln 498740, Col 0)
async function kt8(A, q, K, Y, z) {
    if (Txq(A)) await z8("it2", ["session", "close", A]);
    else await z8("tmux", ["kill-pane", "-t", A]);
    sy8(q, A);
    let {
        notificationMessage: _
    } = await ft(q, K, Y, "terminated");
    z((w) => {
        if (!w.teamContext?.teammates) return w;
        if (!(K in w.teamContext.teammates)) return w;
        let {
            [K]: O, ...$
        } = w.teamContext.teammates;
        return {
            ...w,
            teamContext: {
                ...w.teamContext,
                teammates: $
            },
            inbox: {
                messages: [...w.inbox.messages, {
                    id: RGz(),
                    from: "system",
                    text: B6({
                        type: "teammate_terminated",
                        message: _
                    }),
                    timestamp: new Date().toISOString(),
                    status: "pending"
                }]
            }
        }
    }), k(`[TeamsDialog] Removed ${K} from teamContext`)
}
// @from(Ln 498774, Col 0)
async function xGz(A) {
    if (Txq(A)) await z8("it2", ["session", "focus", A]);
    else await z8("tmux", ["select-pane", "-t", A])
}
// @from(Ln 498778, Col 0)
async function uGz(A, q) {
    if (A.isHidden) await Nxq(A, q);
    else await vxq(A, q)
}
// @from(Ln 498782, Col 0)
async function vxq(A, q) {}
// @from(Ln 498783, Col 0)
async function Nxq(A, q) {}
// @from(Ln 498785, Col 0)
function mGz(A, q, K) {
    xZ6(q, A, K);
    let Y = tv1({
        mode: K,
        from: "team-lead"
    });
    x3(A, {
        from: "team-lead",
        text: B6(Y),
        timestamp: new Date().toISOString()
    }, q), k(`[TeamsDialog] Sent mode change to ${A}: ${K}`)
}
// @from(Ln 498798, Col 0)
function BGz(A, q, K) {
    let Y = A.mode ? wC(A.mode) : "default",
        z = {
            ...xM(),
            mode: Y,
            isBypassPermissionsModeAvailable: K
        },
        _ = W26(z);
    mGz(A.name, q, _)
}
// @from(Ln 498809, Col 0)
function gGz(A, q, K) {
    if (A.length === 0) return;
    let Y = A.map((O) => O.mode ? wC(O.mode) : "default"),
        _ = !Y.every((O) => O === Y[0]) ? "default" : W26({
            ...xM(),
            mode: Y[0] ?? "default",
            isBypassPermissionsModeAvailable: K
        }),
        w = A.map((O) => ({
            memberName: O.name,
            mode: _
        }));
    AL8(q, w);
    for (let O of A) {
        let $ = tv1({
            mode: _,
            from: "team-lead"
        });
        x3(O.name, {
            from: "team-lead",
            text: B6($),
            timestamp: new Date().toISOString()
        }, q)
    }
    k(`[TeamsDialog] Sent mode change to all ${A.length} teammates: ${_}`)
}
// @from(Ln 498835, Col 4)
s4
// @from(Ln 498835, Col 8)
FE
// @from(Ln 498836, Col 4)
Vxq = E(() => {
    e6();
    i6();
    _7();
    Rj();
    Pv();
    b7();
    Gxq();
    Eq();
    H1();
    H0();
    RX6();
    q3();
    M4();
    Bw();
    wq();
    vf();
    wh();
    qH();
    Gt8();
    rD();
    NA();
    g1();
    fZ();
    s4 = t(P6(), 1), FE = t(P6(), 1)
})
// @from(Ln 498863, Col 0)
function kxq(A) {
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
// @from(Ln 498875, Col 0)
async function Exq(A, q, K, Y) {
    if (!K || !Y) return {
        success: !1,
        error: "no_team_context"
    };
    if (!Object.values(K.teammates ?? {}).find((_) => _.name === A)) return {
        success: !1,
        error: "unknown_recipient",
        recipientName: A
    };
    return await Y(A, {
        from: "user",
        text: q,
        timestamp: new Date().toISOString()
    }, K.teamName), {
        success: !0,
        recipientName: A
    }
}
// @from(Ln 498898, Col 0)
function yxq(A) {
    let q = A6(86),
        {
            onDone: K
        } = A;
    oj("bridge-dialog");
    let Y = M1(Afz),
        z = M1(eGz),
        _ = M1(tGz),
        w = M1(sGz),
        O = M1(aGz),
        $ = M1(oGz),
        H = M1(rGz),
        j = M1(nGz),
        J = M1(iGz),
        M = xA(),
        [D, X] = T26.useState(!1),
        [P, W] = T26.useState(""),
        [Z, G] = T26.useState(""),
        f;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) f = FGz(AA()), q[0] = f;
    else f = q[0];
    let v = f,
        N, V;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) N = () => {
        kj().then(G).catch(lGz)
    }, V = [], q[1] = N, q[2] = V;
    else N = q[1], V = q[2];
    T26.useEffect(N, V);
    let L = z ? O : w,
        h, R;
    if (q[3] !== L || q[4] !== D) h = () => {
        if (!D || !L) {
            W("");
            return
        }
        Lh(L, {
            type: "utf8",
            errorCorrectionLevel: "L",
            small: !0
        }).then(W).catch(() => W(""))
    }, R = [D, L], q[3] = L, q[4] = D, q[5] = h, q[6] = R;
    else h = q[5], R = q[6];
    T26.useEffect(h, R);
    let u;
    if (q[7] !== K || q[8] !== M) u = () => {
        d1(cGz), M(dGz), K()
    }, q[7] = K, q[8] = M, q[9] = u;
    else u = q[9];
    let I;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) I = () => {
        X(UGz)
    }, q[10] = I;
    else I = q[10];
    let g;
    if (q[11] !== u) g = {
        "confirm:yes": u,
        "confirm:toggle": I
    }, q[11] = u, q[12] = g;
    else g = q[12];
    let B;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) B = {
        context: "Confirmation"
    }, q[13] = B;
    else B = q[13];
    tA(g, B);
    let b;
    if (q[14] !== Y || q[15] !== $ || q[16] !== _ || q[17] !== z) b = _C1({
        error: $,
        connected: Y,
        sessionActive: z,
        reconnecting: _
    }), q[14] = Y, q[15] = $, q[16] = _, q[17] = z, q[18] = b;
    else b = q[18];
    let {
        label: p,
        color: Q
    } = b, U = $ ? LW1 : yW1, r, e, Y6, H6, J6, K6, s, X6, z6, N6;
    if (q[19] !== Z || q[20] !== L || q[21] !== H || q[22] !== $ || q[23] !== U || q[24] !== K || q[25] !== P || q[26] !== z || q[27] !== j || q[28] !== D || q[29] !== Q || q[30] !== p || q[31] !== J) {
        let i = P ? P.split(`
`).filter(QGz) : [],
            l;
        if (q[42] !== Z) {
            if (l = [], v) l.push(v);
            if (Z) l.push(Z);
            q[42] = Z, q[43] = l
        } else l = q[43];
        let q6 = l.length > 0 ? " · " + l.join(" · ") : "",
            w6;
        if (q[44] !== L || q[45] !== $ || q[46] !== z) w6 = $ ? $C1 : L ? z ? OC1(L) : wC1(L) : void 0, q[44] = L, q[45] = $, q[46] = z, q[47] = w6;
        else w6 = q[47];
        Y6 = w6, e = m8, X6 = "Remote Control", z6 = K, N6 = !0, r = m, H6 = "column", J6 = 1;
        let O6;
        if (q[48] !== U || q[49] !== Q || q[50] !== p) O6 = Pw.createElement(T, {
            color: Q
        }, U, " ", p), q[48] = U, q[49] = Q, q[50] = p, q[51] = O6;
        else O6 = q[51];
        let L6;
        if (q[52] !== q6) L6 = Pw.createElement(T, {
            dimColor: !0
        }, q6), q[52] = q6, q[53] = L6;
        else L6 = q[53];
        let y6;
        if (q[54] !== O6 || q[55] !== L6) y6 = Pw.createElement(T, null, O6, L6), q[54] = O6, q[55] = L6, q[56] = y6;
        else y6 = q[56];
        let G6;
        if (q[57] !== $) G6 = $ && Pw.createElement(T, {
            color: "error"
        }, $), q[57] = $, q[58] = G6;
        else G6 = q[58];
        let R6;
        if (q[59] !== H || q[60] !== J) R6 = J && H && Pw.createElement(T, {
            dimColor: !0
        }, "Environment: ", H), q[59] = H, q[60] = J, q[61] = R6;
        else R6 = q[61];
        let T6;
        if (q[62] !== j || q[63] !== J) T6 = J && j && Pw.createElement(T, {
            dimColor: !0
        }, "Session: ", j), q[62] = j, q[63] = J, q[64] = T6;
        else T6 = q[64];
        if (q[65] !== y6 || q[66] !== G6 || q[67] !== R6 || q[68] !== T6) K6 = Pw.createElement(m, {
            flexDirection: "column"
        }, y6, G6, R6, T6), q[65] = y6, q[66] = G6, q[67] = R6, q[68] = T6, q[69] = K6;
        else K6 = q[69];
        s = D && i.length > 0 && Pw.createElement(m, {
            flexDirection: "column"
        }, i.map(pGz)), q[19] = Z, q[20] = L, q[21] = H, q[22] = $, q[23] = U, q[24] = K, q[25] = P, q[26] = z, q[27] = j, q[28] = D, q[29] = Q, q[30] = p, q[31] = J, q[32] = r, q[33] = e, q[34] = Y6, q[35] = H6, q[36] = J6, q[37] = K6, q[38] = s, q[39] = X6, q[40] = z6, q[41] = N6
    } else r = q[32], e = q[33], Y6 = q[34], H6 = q[35], J6 = q[36], K6 = q[37], s = q[38], X6 = q[39], z6 = q[40], N6 = q[41];
    let $6;
    if (q[70] !== Y6) $6 = Y6 && Pw.createElement(T, {
        dimColor: !0
    }, Y6), q[70] = Y6, q[71] = $6;
    else $6 = q[71];
    let n;
    if (q[72] === Symbol.for("react.memo_cache_sentinel")) n = Pw.createElement(T, {
        dimColor: !0
    }, "Enter to disconnect · space for QR code · Esc to close"), q[72] = n;
    else n = q[72];
    let o;
    if (q[73] !== r || q[74] !== H6 || q[75] !== J6 || q[76] !== K6 || q[77] !== s || q[78] !== $6) o = Pw.createElement(r, {
        flexDirection: H6,
        gap: J6
    }, K6, s, $6, n), q[73] = r, q[74] = H6, q[75] = J6, q[76] = K6, q[77] = s, q[78] = $6, q[79] = o;
    else o = q[79];
    let a;
    if (q[80] !== e || q[81] !== X6 || q[82] !== z6 || q[83] !== N6 || q[84] !== o) a = Pw.createElement(e, {
        title: X6,
        onCancel: z6,
        hideInputGuide: N6
    }, o), q[80] = e, q[81] = X6, q[82] = z6, q[83] = N6, q[84] = o, q[85] = a;
    else a = q[85];
    return a
}
// @from(Ln 499052, Col 0)
function pGz(A, q) {
    return Pw.createElement(T, {
        key: q
    }, A)
}
// @from(Ln 499058, Col 0)
function QGz(A) {
    return A.length > 0
}
// @from(Ln 499062, Col 0)
function UGz(A) {
    return !A
}
// @from(Ln 499066, Col 0)
function dGz(A) {
    if (!A.replBridgeEnabled) return A;
    return {
        ...A,
        replBridgeEnabled: !1
    }
}
// @from(Ln 499074, Col 0)
function cGz(A) {
    if (A.remoteControlAtStartup === !1) return A;
    return {
        ...A,
        remoteControlAtStartup: !1
    }
}
// @from(Ln 499082, Col 0)
function lGz() {}
// @from(Ln 499084, Col 0)
function iGz(A) {
    return A.verbose
}
// @from(Ln 499088, Col 0)
function nGz(A) {
    return A.replBridgeSessionId
}
// @from(Ln 499092, Col 0)
function rGz(A) {
    return A.replBridgeEnvironmentId
}
// @from(Ln 499096, Col 0)
function oGz(A) {
    return A.replBridgeError
}
// @from(Ln 499100, Col 0)
function aGz(A) {
    return A.replBridgeSessionUrl
}
// @from(Ln 499104, Col 0)
function sGz(A) {
    return A.replBridgeConnectUrl
}
// @from(Ln 499108, Col 0)
function tGz(A) {
    return A.replBridgeReconnecting
}
// @from(Ln 499112, Col 0)
function eGz(A) {
    return A.replBridgeSessionActive
}
// @from(Ln 499116, Col 0)
function Afz(A) {
    return A.replBridgeConnected
}
// @from(Ln 499119, Col 4)
Pw
// @from(Ln 499119, Col 8)
T26
// @from(Ln 499120, Col 4)
Lxq = E(() => {
    e6();
    i6();
    KN6();
    fZ();
    NA();
    k8();
    wq();
    _7();
    T1();
    $5();
    qw();
    _86();
    Pw = t(P6(), 1), T26 = t(P6(), 1)
})
// @from(Ln 499136, Col 0)
function Kfz(A, q) {
    if (A.length <= qfz) return {
        truncatedText: A,
        placeholderContent: ""
    };
    let K = Math.floor(Rxq / 2),
        Y = Math.floor(Rxq / 2),
        z = A.slice(0, K),
        _ = A.slice(-Y),
        w = A.slice(K, -Y),
        O = b06(w),
        H = Yfz(q, O);
    return {
        truncatedText: z + H + _,
        placeholderContent: w
    }
}
// @from(Ln 499154, Col 0)
function Yfz(A, q) {
    return `[...Truncated text #${A} +${q} lines...]`
}
// @from(Ln 499158, Col 0)
function hxq(A, q) {
    let K = Object.keys(q).map(Number),
        Y = K.length > 0 ? Math.max(...K) + 1 : 1,
        {
            truncatedText: z,
            placeholderContent: _
        } = Kfz(A, Y);
    if (!_) return {
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
                content: _
            }
        }
    }
}
// @from(Ln 499181, Col 4)
qfz = 1e4
// @from(Ln 499182, Col 4)
Rxq = 1000
// @from(Ln 499183, Col 4)
Sxq = E(() => {
    ZI()
})
// @from(Ln 499187, Col 0)
function Cxq({
    input: A,
    pastedContents: q,
    onInputChange: K,
    setCursorOffset: Y,
    setPastedContents: z
}) {
    let [_, w] = ka6.useState(!1);
    ka6.useEffect(() => {
        if (_) return;
        if (A.length <= 1e4) return;
        let {
            newInput: O,
            newPastedContents: $
        } = hxq(A, q);
        K(O), Y(O.length), z($), w(!0)
    }, [A, _, q, K, z, Y]), ka6.useEffect(() => {
        if (A === "") w(!1)
    }, [A])
}
// @from(Ln 499207, Col 4)
ka6
// @from(Ln 499208, Col 4)
Ixq = E(() => {
    Sxq();
    ka6 = t(P6(), 1)
})
// @from(Ln 499213, Col 0)
function UF() {
    return bxq.useSyncExternalStore(hW6, cP1)
}
// @from(Ln 499216, Col 4)
bxq
// @from(Ln 499217, Col 4)
bV6 = E(() => {
    aH();
    bxq = t(P6(), 1)
})
// @from(Ln 499222, Col 0)
function mxq({
    input: A,
    submitCount: q,
    viewingAgentName: K
}) {
    let Y = UF(),
        z = M1((w) => w.promptSuggestionEnabled);
    return uxq.useMemo(() => {
        if (A !== "") return;
        if (K) return `Message @${K.length>xxq?K.slice(0,xxq-3)+"...":K}…`;
        if (Y.some(Ut) && (X1().queuedCommandUpHintCount || 0) < wfz) return "Press up to edit queued messages";
        if (q < 1 && z && !_fz?.isProactiveActive()) return rEq()
    }, [A, Y, q, z, K])
}
// @from(Ln 499236, Col 4)
uxq
// @from(Ln 499236, Col 9)
_fz = null
// @from(Ln 499237, Col 4)
wfz = 3
// @from(Ln 499238, Col 4)
xxq = 20
// @from(Ln 499239, Col 4)
Bxq = E(() => {
    NA();
    k8();
    Va8();
    bV6();
    aH();
    uxq = t(P6(), 1)
})
// @from(Ln 499248, Col 0)
function Ofz() {
    if (!E7()) return;
    let A = H$();
    if (!A) return;
    if (s$.includes(A)) return t$[A];
    return
}
// @from(Ln 499256, Col 0)
function gxq(A) {
    let q = A6(3),
        {
            isLoading: K,
            themeColor: Y
        } = A,
        _ = Y ?? void 0,
        w;
    if (q[0] !== _ || q[1] !== K) w = $x.createElement(T, {
        color: _,
        dimColor: K
    }, a6.pointer, " "), q[0] = _, q[1] = K, q[2] = w;
    else w = q[2];
    return w
}
// @from(Ln 499272, Col 0)
function Et8(A) {
    let q = A6(6),
        {
            mode: K,
            isLoading: Y,
            viewingAgentName: z,
            viewingAgentColor: _
        } = A,
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = Ofz(), q[0] = w;
    else w = q[0];
    let O = w,
        $ = _ ? t$[_] : void 0,
        H;
    if (q[1] !== Y || q[2] !== K || q[3] !== $ || q[4] !== z) H = $x.createElement(m, {
        alignItems: "flex-start",
        alignSelf: "flex-start",
        flexWrap: "nowrap",
        justifyContent: "flex-start"
    }, z ? $x.createElement(gxq, {
        isLoading: Y,
        themeColor: $
    }) : K === "bash" ? $x.createElement(T, {
        color: "bashBorder",
        dimColor: Y
    }, "! ") : $x.createElement(gxq, {
        isLoading: Y,
        themeColor: E7() ? O : void 0
    })), q[1] = Y, q[2] = K, q[3] = $, q[4] = z, q[5] = H;
    else H = q[5];
    return H
}
// @from(Ln 499304, Col 4)
$x
// @from(Ln 499305, Col 4)
Fxq = E(() => {
    e6();
    b7();
    i6();
    Qz();
    zz();
    H0();
    $x = t(P6(), 1)
})
// @from(Ln 499315, Col 0)
function Qxq(A) {
    let q = A6(7),
        {
            isFirst: K,
            children: Y
        } = A,
        z;
    if (q[0] !== K) z = {
        isQueued: !0,
        isFirst: K,
        paddingWidth: Hfz
    }, q[0] = K, q[1] = z;
    else z = q[1];
    let _ = z,
        w;
    if (q[2] !== Y) w = v26.createElement(m, {
        paddingX: pxq
    }, Y), q[2] = Y, q[3] = w;
    else w = q[3];
    let O;
    if (q[4] !== w || q[5] !== _) O = v26.createElement($fz.Provider, {
        value: _
    }, w), q[4] = w, q[5] = _, q[6] = O;
    else O = q[6];
    return O
}
// @from(Ln 499341, Col 4)
v26
// @from(Ln 499341, Col 9)
$fz
// @from(Ln 499341, Col 14)
pxq = 2
// @from(Ln 499342, Col 4)
Hfz
// @from(Ln 499343, Col 4)
Uxq = E(() => {
    e6();
    i6();
    v26 = t(P6(), 1), $fz = v26.createContext(void 0), Hfz = pxq * 2
})
// @from(Ln 499349, Col 0)
function Jfz(A) {
    try {
        return i1(A)?.type === "idle_notification"
    } catch {
        return !1
    }
}
// @from(Ln 499357, Col 0)
function Mfz(A) {
    return `<${EH}>
<${mD}>+${A} more tasks completed</${mD}>
<${uD}>completed</${uD}>
</${EH}>`
}
// @from(Ln 499364, Col 0)
function Dfz(A) {
    let q = A.filter((O) => typeof O.value !== "string" || !Jfz(O.value)),
        K = q.filter((O) => O.mode === "task-notification"),
        Y = q.filter((O) => O.mode !== "task-notification");
    if (K.length <= yt8) return [...Y, ...K];
    let z = K.slice(0, yt8 - 1),
        _ = K.length - (yt8 - 1),
        w = {
            value: Mfz(_),
            mode: "task-notification"
        };
    return [...Y, ...z, w]
}
// @from(Ln 499378, Col 0)
function dxq() {
    let A = A6(11),
        q = UF(),
        K = S5();
    if (i94(K.getState())) return null;
    if (q.length === 0) return null;
    let Y, z, _, w, O;
    if (A[0] !== q) {
        O = Symbol.for("react.early_return_sentinel");
        A: {
            let H = q.filter(Ut);
            if (H.length === 0) {
                O = null;
                break A
            }
            let j = Dfz(H),
                J = JM(j.map(Pfz));Y = m,
            z = 1,
            _ = "column",
            w = J.map(Xfz)
        }
        A[0] = q, A[1] = Y, A[2] = z, A[3] = _, A[4] = w, A[5] = O
    } else Y = A[1], z = A[2], _ = A[3], w = A[4], O = A[5];
    if (O !== Symbol.for("react.early_return_sentinel")) return O;
    let $;
    if (A[6] !== Y || A[7] !== z || A[8] !== _ || A[9] !== w) $ = N26.createElement(Y, {
        marginTop: z,
        flexDirection: _
    }, w), A[6] = Y, A[7] = z, A[8] = _, A[9] = w, A[10] = $;
    else $ = A[10];
    return $
}
// @from(Ln 499411, Col 0)
function Xfz(A, q) {
    return N26.createElement(Qxq, {
        key: q,
        isFirst: q === 0
    }, N26.createElement(tR, {
        message: A,
        lookups: Hl,
        addMargin: !1,
        tools: [],
        commands: [],
        verbose: !1,
        inProgressToolUseIDs: jfz,
        progressMessagesForMessage: [],
        shouldAnimate: !1,
        shouldShowDot: !1,
        isTranscriptMode: !1,
        isStatic: !0
    }))
}
// @from(Ln 499431, Col 0)
function Pfz(A) {
    let q = A.value;
    if (A.mode === "bash" && typeof q === "string") q = `<bash-input>${q}</bash-input>`;
    let K = A.pastedContents ? Object.values(A.pastedContents).filter(Gfz) : [];
    if (K.length > 0 && typeof q === "string") {
        let z = K.map(Zfz);
        q = [{
            type: "text",
            text: q
        }, ...z]
    }
    let Y = K.length > 0 ? K.map(Wfz) : void 0;
    return p1({
        content: q,
        imagePasteIds: Y
    })
}
// @from(Ln 499449, Col 0)
function Wfz(A) {
    return A.id
}
// @from(Ln 499453, Col 0)
function Zfz() {
    return {
        type: "image",
        source: {
            type: "base64",
            media_type: "image/png",
            data: ""
        }
    }
}
// @from(Ln 499464, Col 0)
function Gfz(A) {
    return A.type === "image"
}
// @from(Ln 499467, Col 4)
N26
// @from(Ln 499467, Col 9)
jfz
// @from(Ln 499467, Col 14)
yt8 = 3
// @from(Ln 499468, Col 4)
Lt8 = E(() => {
    e6();
    NA();
    i6();
    Gf6();
    JA();
    Uxq();
    vz();
    g1();
    p36();
    bV6();
    aH();
    N26 = t(P6(), 1), jfz = new Set
})
// @from(Ln 499483, Col 0)
function cxq(A) {
    let q = A6(1),
        {
            hasStash: K
        } = A;
    if (!K) return null;
    let Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = Ea6.createElement(m, {
        paddingLeft: 2
    }, Ea6.createElement(T, {
        dimColor: !0
    }, a6.pointerSmall, " Stashed (auto-restores after submit)")), q[0] = Y;
    else Y = q[0];
    return Y
}
// @from(Ln 499498, Col 4)
Ea6
// @from(Ln 499499, Col 4)
lxq = E(() => {
    e6();
    i6();
    b7();
    Ea6 = t(P6(), 1)
})
// @from(Ln 499506, Col 0)
function ixq(A) {
    if (l5()) return;
    return A.standaloneAgentContext?.name
}
// @from(Ln 499510, Col 4)
nxq = E(() => {
    zz()
})
// @from(Ln 499514, Col 0)
function rxq() {
    let A = M1(($) => $.teamContext),
        q = M1(($) => $.standaloneAgentContext),
        K = M1(($) => $.agent),
        Y = S5(),
        [z, _] = tI1.useState(null);
    if (tI1.useEffect(() => {
            yb().then(_)
        }, []), $Y() && !eP()) {
        let $ = i3(),
            H = l5(),
            j = A?.selfAgentColor ?? H$();
        if ($ && H) {
            let J = j ? t$[j] : "cyan_FOR_SUBAGENTS_ONLY";
            return {
                text: `@${$}`,
                bgColor: J
            }
        }
    } else if ((A?.teammates ? Object.keys(A.teammates).length : 0) > 0 && A?.teamName) {
        let j = vR(Y.getState()),
            J = j?.identity.color && s$.includes(j.identity.color) ? t$[j.identity.color] : void 0,
            M = Rb();
        if (z === !1 && !M) return {
            text: `View teammates: \`tmux -L ${Mf6()} a\``,
            bgColor: J ?? "cyan_FOR_SUBAGENTS_ONLY"
        };
        else if (z === !0 || M) {
            if (j) return {
                text: `@${j.identity.agentName}`,
                bgColor: J ?? "cyan_FOR_SUBAGENTS_ONLY"
            }
        }
    }
    let w = ixq(Y.getState()),
        O = q?.color;
    if (w || O) {
        let $ = O ? t$[O] : "cyan_FOR_SUBAGENTS_ONLY";
        return {
            text: w ?? "",
            bgColor: $
        }
    }
    if (K) {
        let H = Y.getState().agentDefinitions.activeAgents.find((J) => J.agentType === K)?.color,
            j = H && s$.includes(H) ? t$[H] : "promptBorder";
        return {
            text: K,
            bgColor: j
        }
    }
    return null
}
// @from(Ln 499567, Col 4)
tI1
// @from(Ln 499568, Col 4)
oxq = E(() => {
    NA();
    p36();
    zz();
    qZ();
    ig();
    wh();
    H0();
    nxq();
    tI1 = t(P6(), 1)
})
// @from(Ln 499580, Col 0)
function axq(A) {
    let q = A6(14),
        {
            pastedContents: K,
            isSelected: Y,
            selectedIndex: z
        } = A,
        _ = Y === void 0 ? !1 : Y,
        w = z === void 0 ? 0 : z,
        O;
    if (q[0] !== K) O = Object.values(K).filter(ffz), q[0] = K, q[1] = O;
    else O = q[1];
    let $ = O;
    if ($.length === 0) return null;
    let H;
    if (q[2] !== $.length || q[3] !== _) H = _ ? V$.createElement(C8, null, $.length > 1 && V$.createElement(V$.Fragment, null, V$.createElement(O8, {
        action: "attachments:next",
        context: "Attachments",
        fallback: "→",
        description: "next"
    }), V$.createElement(O8, {
        action: "attachments:previous",
        context: "Attachments",
        fallback: "←",
        description: "prev"
    })), V$.createElement(O8, {
        action: "attachments:remove",
        context: "Attachments",
        fallback: "backspace",
        description: "remove"
    }), V$.createElement(O8, {
        action: "attachments:exit",
        context: "Attachments",
        fallback: "↓",
        description: "cancel"
    })) : "(↑ to select)", q[2] = $.length, q[3] = _, q[4] = H;
    else H = q[4];
    let j = H,
        J;
    if (q[5] !== $ || q[6] !== _ || q[7] !== w) J = $.map((X, P) => V$.createElement(GG1, {
        key: X.id,
        imageId: X.id,
        isSelected: _ && P === w
    })), q[5] = $, q[6] = _, q[7] = w, q[8] = J;
    else J = q[8];
    let M;
    if (q[9] !== j) M = V$.createElement(m, {
        flexGrow: 1,
        justifyContent: "flex-start",
        flexDirection: "row"
    }, V$.createElement(T, {
        dimColor: !0
    }, j)), q[9] = j, q[10] = M;
    else M = q[10];
    let D;
    if (q[11] !== J || q[12] !== M) D = V$.createElement(m, {
        flexDirection: "row",
        gap: 1,
        paddingX: 1,
        flexWrap: "wrap"
    }, J, M), q[11] = J, q[12] = M, q[13] = D;
    else D = q[13];
    return D
}
// @from(Ln 499645, Col 0)
function ffz(A) {
    return A.type === "image"
}
// @from(Ln 499649, Col 0)
function Rt8(A) {
    return Object.values(A).filter((q) => q.type === "image").length
}
// @from(Ln 499652, Col 4)
V$
// @from(Ln 499653, Col 4)
ht8 = E(() => {
    e6();
    i6();
    CL8();
    OK();
    Xq();
    V$ = t(P6(), 1)
})
// @from(Ln 499662, Col 0)
function sxq(A, q, K, Y, z, _, w, O, $, H, j) {
    let [J, M] = aw.useState(""), [D, X] = aw.useState(!1), [P, W] = aw.useState(""), [Z, G] = aw.useState(0), [f, v] = aw.useState("prompt"), [N, V] = aw.useState({}), [L, h] = aw.useState(void 0), R = aw.useRef(void 0), u = aw.useRef(new Set), I = aw.useRef(null), g = aw.useCallback(() => {
        if (R.current) R.current.return(void 0), R.current = void 0
    }, []), B = aw.useCallback(() => {
        $(!1), M(""), X(!1), W(""), G(0), v("prompt"), V({}), h(void 0), g(), u.current.clear()
    }, [$, g]), b = aw.useCallback(async (J6, K6) => {
        if (!O) return;
        if (J.length === 0) {
            g(), u.current.clear(), h(void 0), X(!1), K(P), Y(Z), _(f), H(N);
            return
        }
        if (!J6) g(), R.current = CT8(), u.current.clear();
        if (!R.current) return;
        while (!0) {
            if (K6?.aborted) return;
            let s = await R.current.next();
            if (s.done) {
                X(!0);
                return
            }
            let X6 = s.value.display,
                z6 = X6.lastIndexOf(J);
            if (z6 !== -1 && !u.current.has(X6)) {
                u.current.add(X6), h(s.value), X(!1);
                let N6 = PB(X6);
                _(N6), K(X6), H(s.value.pastedContents);
                let n = D36(X6).lastIndexOf(J);
                Y(n !== -1 ? n : z6);
                return
            }
        }
    }, [O, J, g, K, Y, _, H, P, Z, f, N]), p = aw.useCallback(() => {
        $(!0), W(q), G(z), v(w), V(j), R.current = CT8(), u.current.clear()
    }, [$, q, z, w, j]), Q = aw.useCallback(() => {
        b(!0)
    }, [b]), U = aw.useCallback(() => {
        if (L) {
            let J6 = PB(L.display),
                K6 = D36(L.display);
            K(K6), _(J6), H(L.pastedContents)
        } else H(N);
        B()
    }, [L, K, _, H, N, B]), r = aw.useCallback(() => {
        K(P), Y(Z), H(N), B()
    }, [K, Y, H, P, Z, N, B]), e = aw.useCallback(() => {
        if (J.length === 0) A({
            display: P,
            pastedContents: N
        });
        else if (L) {
            let J6 = PB(L.display),
                K6 = D36(L.display);
            _(J6), A({
                display: K6,
                pastedContents: L.pastedContents
            })
        }
        B()
    }, [J, L, A, _, P, N, B]);
    D8("history:search", p, {
        context: "Global",
        isActive: !O
    });
    let Y6 = aw.useMemo(() => ({
        "historySearch:next": Q,
        "historySearch:accept": U,
        "historySearch:cancel": r,
        "historySearch:execute": e
    }), [Q, U, r, e]);
    tA(Y6, {
        context: "HistorySearch",
        isActive: O
    }), jA((J6, K6) => {
        if (K6.backspace && J === "") r()
    }, {
        isActive: O
    });
    let H6 = aw.useRef(b);
    return H6.current = b, aw.useEffect(() => {
        I.current?.abort();
        let J6 = new AbortController;
        return I.current = J6, H6.current(!1, J6.signal), () => {
            J6.abort()
        }
    }, [J]), {
        historyQuery: J,
        setHistoryQuery: M,
        historyMatch: L,
        historyFailedMatch: D
    }
}
// @from(Ln 499753, Col 4)
aw
// @from(Ln 499754, Col 4)
txq = E(() => {
    i6();
    ZI();
    _7();
    aw = t(P6(), 1)
})
// @from(Ln 499761, Col 0)
function exq({
    inputValue: A,
    isAssistantResponding: q
}) {
    let K = M1((f) => f.promptSuggestion),
        Y = xA(),
        z = p_(),
        {
            text: _,
            promptId: w,
            shownAt: O,
            acceptedAt: $,
            generationRequestId: H
        } = K,
        j = q || A.length > 0 ? null : _,
        J = _ && O > 0,
        M = ni.useRef(0),
        D = ni.useRef(!0),
        X = ni.useRef(0);
    if (O > 0 && O !== X.current) X.current = O, D.current = z, M.current = 0;
    else if (O === 0) X.current = 0;
    if (A.length > 0 && M.current === 0 && J) M.current = Date.now();
    let P = ni.useCallback(() => {
            Nb(Y), Y((f) => ({
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
        W = ni.useCallback(() => {
            if (!J) return;
            Y((f) => ({
                ...f,
                promptSuggestion: {
                    ...f.promptSuggestion,
                    acceptedAt: Date.now()
                }
            }))
        }, [J, Y]),
        Z = ni.useCallback(() => {
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
        G = ni.useCallback((f, v) => {
            if (!J) return;
            let N = $ > O,
                V = N || f === _,
                L = V ? $ || Date.now() : Date.now();
            if (d("tengu_prompt_suggestion", {
                    source: "cli",
                    outcome: V ? "accepted" : "ignored",
                    prompt_id: w,
                    ...H && {
                        generationRequestId: H
                    },
                    ...V && {
                        acceptMethod: N ? "tab" : "enter"
                    },
                    ...V && {
                        timeToAcceptMs: L - O
                    },
                    ...!V && {
                        timeToIgnoreMs: L - O
                    },
                    ...M.current > 0 && {
                        timeToFirstKeystrokeMs: M.current - O
                    },
                    wasFocusedWhenShown: D.current,
                    similarity: Math.round(f.length / (_?.length || 1) * 100) / 100,
                    ...!1
                }), !v?.skipReset) P()
        }, [J, $, O, _, w, H, P]);
    return {
        suggestion: j,
        markAccepted: W,
        markShown: Z,
        logOutcomeAtSubmission: G
    }
}
// @from(Ln 499853, Col 4)
ni
// @from(Ln 499854, Col 4)
Auq = E(() => {
    NA();
    V1();
    sY6();
    Su6();
    ni = t(P6(), 1)
})
// @from(Ln 499862, Col 0)
function Kuq(A) {
    let q = A6(27),
        {
            currentValue: K,
            onSelect: Y,
            onCancel: z,
            isMidConversation: _
        } = A,
        w = IK(),
        [O, $] = quq.useState(null),
        H;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) H = [{
        value: "true",
        label: "Enabled",
        description: "Claude will think before responding"
    }, {
        value: "false",
        label: "Disabled",
        description: "Claude will respond without extended thinking"
    }], q[0] = H;
    else H = q[0];
    let j = H,
        J;
    if (q[1] !== O || q[2] !== z) J = () => {
        if (O !== null) $(null);
        else z?.()
    }, q[1] = O, q[2] = z, q[3] = J;
    else J = q[3];
    let M;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) M = {
        context: "Confirmation"
    }, q[4] = M;
    else M = q[4];
    D8("confirm:no", J, M);
    let D;
    if (q[5] !== O || q[6] !== Y) D = () => {
        if (O !== null) Y(O)
    }, q[5] = O, q[6] = Y, q[7] = D;
    else D = q[7];
    let X = O !== null,
        P;
    if (q[8] !== X) P = {
        context: "Confirmation",
        isActive: X
    }, q[8] = X, q[9] = P;
    else P = q[9];
    D8("confirm:yes", D, P);
    let W;
    if (q[10] !== K || q[11] !== _ || q[12] !== Y) W = function(L) {
        let h = L === "true";
        if (_ && h !== K) $(h);
        else Y(h)
    }, q[10] = K, q[11] = _, q[12] = Y, q[13] = W;
    else W = q[13];
    let Z = W,
        G;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) G = g3.createElement(m, {
        marginBottom: 1,
        flexDirection: "column"
    }, g3.createElement(T, {
        color: "remember",
        bold: !0
    }, "Toggle thinking mode"), g3.createElement(T, {
        dimColor: !0
    }, "Enable or disable thinking for this session.")), q[14] = G;
    else G = q[14];
    let f;
    if (q[15] !== O || q[16] !== K || q[17] !== Z || q[18] !== z) f = g3.createElement(m, {
        flexDirection: "column"
    }, G, O !== null ? g3.createElement(m, {
        flexDirection: "column",
        marginBottom: 1,
        gap: 1
    }, g3.createElement(T, {
        color: "warning"
    }, "Changing thinking mode mid-conversation will increase latency and may reduce quality. For best results, set this at the start of a session."), g3.createElement(T, {
        color: "warning"
    }, "Do you want to proceed?")) : g3.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, g3.createElement(T8, {
        defaultValue: K ? "true" : "false",
        defaultFocusValue: K ? "true" : "false",
        options: j,
        onChange: Z,
        onCancel: z ?? Tfz,
        visibleOptionCount: 2
    }))), q[15] = O, q[16] = K, q[17] = Z, q[18] = z, q[19] = f;
    else f = q[19];
    let v;
    if (q[20] !== O || q[21] !== w.keyName || q[22] !== w.pending) v = g3.createElement(T, {
        dimColor: !0,
        italic: !0
    }, w.pending ? g3.createElement(g3.Fragment, null, "Press ", w.keyName, " again to exit") : O !== null ? g3.createElement(C8, null, g3.createElement(a1, {
        shortcut: "Enter",
        action: "confirm"
    }), g3.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })) : g3.createElement(C8, null, g3.createElement(a1, {
        shortcut: "Enter",
        action: "confirm"
    }), g3.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "exit"
    }))), q[20] = O, q[21] = w.keyName, q[22] = w.pending, q[23] = v;
    else v = q[23];
    let N;
    if (q[24] !== v || q[25] !== f) N = g3.createElement(S3, {
        color: "permission"
    }, f, v), q[24] = v, q[25] = f, q[26] = N;
    else N = q[26];
    return N
}
// @from(Ln 499981, Col 0)
function Tfz() {}
// @from(Ln 499982, Col 4)
g3
// @from(Ln 499982, Col 8)
quq
// @from(Ln 499983, Col 4)
Yuq = E(() => {
    e6();
    i6();
    o9();
    PO();
    FJ();
    Lq();
    OK();
    Xq();
    _7();
    g3 = t(P6(), 1), quq = t(P6(), 1)
})
// @from(Ln 499996, Col 0)
function _uq(A) {
    let [q, K] = eI1.useState(!1);
    return eI1.useEffect(() => {
        if (zuq || !A) return;
        zuq = !0, K(!0);
        let Y = setTimeout(K, vfz, !1);
        return () => {
            clearTimeout(Y), K(!1)
        }
    }, [A]), q
}
// @from(Ln 500007, Col 4)
eI1
// @from(Ln 500007, Col 9)
vfz = 5000
// @from(Ln 500008, Col 4)
zuq = !1
// @from(Ln 500009, Col 4)
wuq = E(() => {
    eI1 = t(P6(), 1)
})
// @from(Ln 500012, Col 4)
Vfz
// @from(Ln 500012, Col 9)
St8
// @from(Ln 500013, Col 4)
Ouq = E(() => {
    e6();
    i6();
    i6();
    fZ();
    j16();
    _q();
    ii6();
    eF6();
    lA();
    M4();
    V1();
    ll();
    H16();
    U96();
    FJ();
    U66();
    Zv6();
    Lq();
    Xq();
    Vfz = t(P6(), 1), St8 = t(P6(), 1)
})
// @from(Ln 500035, Col 4)
kfz
// @from(Ln 500035, Col 9)
$uq
// @from(Ln 500036, Col 4)
Huq = E(() => {
    e6();
    i6();
    i6();
    fZ();
    j16();
    _q();
    jy();
    lA();
    RY();
    M4();
    V1();
    ll();
    H16();
    U96();
    FJ();
    Zv6();
    Lq();
    Xq();
    kfz = t(P6(), 1), $uq = t(P6(), 1)
})