
// @from(Ln 532747, Col 0)
function m_A({
    debug: q,
    ideSelection: K,
    toolPermissionContext: _,
    setToolPermissionContext: z,
    apiKeyStatus: Y,
    commands: A,
    agents: O,
    isLoading: w,
    verbose: $,
    messages: j,
    onInputChange: H,
    mode: J,
    onModeChange: X,
    stashedPrompt: M,
    setStashedPrompt: P,
    submitCount: W,
    onShowMessageSelector: D,
    onMessageActionsEnter: Z,
    mcpClients: G,
    pastedContents: f,
    setPastedContents: v,
    showBashesDialog: V,
    setShowBashesDialog: k,
    onExit: N,
    onLeftArrowOnEmpty: R,
    getToolUseContext: h,
    onSubmit: C,
    onAgentSubmit: x,
    onDismissSideQuestion: B,
    isSideQuestionVisible: m,
    onInputOverlayActiveChange: S,
    initialVimMode: F,
    onVimModeChange: U,
    hasSuppressedDialogs: g,
    isLocalJSXCommandActive: c = !1,
    insertTextRef: n,
    voiceInterimRange: l,
    sessionEnvVars: z6
}) {
    let A6 = tC6(),
        e = s2(),
        i = o46() || c,
        [O6, J6] = e7.useState(F ?? "INSERT");
    e7.useEffect(() => U?.(O6), [O6, U]);
    let [$6, H6] = e7.useState(!1), [q6, o] = e7.useState(!1), _6 = $6 || q6 || ce() && O6 === "INSERT";
    e7.useEffect(() => {
        return S(_6), () => S(!1)
    }, [_6, S]);
    let [r, t] = e7.useState(!1), [Y6, X6] = e7.useState({
        show: !1
    }), [M6, W6] = e7.useState(A6.length), V6 = Pq.useRef(A6);
    if (A6 !== V6.current) W6(A6.length), V6.current = A6;
    let f6 = Pq.useCallback((T8) => {
            V6.current = T8, H(T8)
        }, [H]),
        G6 = e7.useRef(null);
    if (n) n.current = {
        cursorOffset: M6,
        submit: (T8, g1) => void G6.current?.(T8, g1),
        insert: (T8) => {
            let iq = M6 === A6.length && A6.length > 0 && !/\s$/.test(A6) ? " " + T8 : T8,
                L3 = A6.slice(0, M6) + iq + A6.slice(M6);
            V6.current = L3, H(L3), W6(M6 + iq.length)
        },
        setInputWithCursor: (T8, g1) => {
            V6.current = T8, H(T8), W6(g1)
        }
    };
    let k6 = H9(),
        T6 = R7(),
        v6 = EX(),
        L6 = M8((T8) => T8.tasks),
        y6 = M8((T8) => T8.replBridgeConnected),
        c6 = M8((T8) => T8.replBridgeExplicit),
        Z8 = M8((T8) => T8.replBridgeReconnecting),
        N8 = y6 && (c6 || Z8),
        R6 = M8((T8) => !1),
        p6 = !1,
        q8 = M8((T8) => !1),
        L8 = M8((T8) => T8.teamContext),
        w8 = cn(),
        x8 = M8((T8) => T8.promptSuggestion),
        a6 = M8((T8) => T8.speculation),
        D8 = M8((T8) => T8.speculationSessionTimeSavedMs),
        Q6 = M8((T8) => T8.viewingAgentTaskId),
        W8 = M8((T8) => T8.viewSelectionMode),
        G8 = M8((T8) => T8.expandedView) === "teammates",
        s6 = M8((T8) => T8.isBriefOnly) && !Q6,
        u6 = M8((T8) => T8.mainLoopModel),
        h6 = M8((T8) => T8.mainLoopModelForSession),
        _8 = M8((T8) => T8.thinkingEnabled),
        R8 = M8((T8) => q5() ? T8.fastMode : !1),
        x6 = M8((T8) => T8.effortValue),
        i6 = dp(k6.getState()),
        v8 = i6?.identity.agentName,
        f1 = i6?.identity.color && VJ.includes(i6.identity.color) ? i6.identity.color : void 0,
        g8 = e7.useMemo(() => qt(L6), [L6]),
        w6 = g8.length > 0 || i6 !== void 0,
        D6 = e7.useMemo(() => {
            if (i6) return {
                ..._,
                mode: i6.permissionMode
            };
            return _
        }, [i6, _]),
        {
            historyQuery: U6,
            setHistoryQuery: F6,
            historyMatch: z8,
            historyFailedMatch: l6,
            handleKeyDown: j8
        } = P55((T8) => {
            v(T8.pastedContents), X$(T8.display)
        }, A6, f6, W6, M6, X, J, $6, H6, v, f),
        f8 = e7.useRef(-1);
    if (f8.current === -1) f8.current = B_A(j);
    let p8 = e7.useRef(!1),
        [o8, n1] = e7.useState(!1),
        [c1, dq] = e7.useState(!1),
        [uq, h4] = e7.useState(0),
        cq = M8((T8) => T8.coordinatorTaskIndex),
        C1 = M8((T8) => T8.taskDecorations),
        W7 = e7.useCallback((T8) => T6((g1) => {
            let iq = typeof T8 === "function" ? T8(g1.coordinatorTaskIndex) : T8;
            if (iq === g1.coordinatorTaskIndex) return g1;
            return {
                ...g1,
                coordinatorTaskIndex: iq
            }
        }), [T6]),
        $4 = us8(),
        x4 = e7.useMemo(() => Object.values(L6).some((T8) => yH(T8) && !0), [L6]) ? -1 : 0,
        DK = e7.useMemo(() => xs8(L6, C1).map((T8) => T8.id), [L6, C1]),
        _q = e7.useRef(DK);
    e7.useEffect(() => {
        let T8 = _q.current;
        _q.current = DK;
        let g1 = $35(cq, T8, DK);
        if (g1 !== cq) W7(g1);
        else if (cq >= $4) W7(Math.max(x4, $4 - 1));
        else if (cq < x4) W7(x4)
    }, [DK, $4, cq, x4, W7]);
    let [QY, vz] = e7.useState(!1), [JY, U3] = e7.useState(!1), [DA, U9] = e7.useState(!1), [BH, gj] = e7.useState(!1), [FA, UG] = e7.useState(!1), [QG, XY] = e7.useState(!1), [UX, gA] = e7.useState(!1), [ZA, k4] = e7.useState(!1), [fA, MY] = e7.useState(!1), [UA, PY] = e7.useState(null), Q9 = e7.useRef(null);
    e7.useEffect(() => {
        return () => {
            if (Q9.current) clearTimeout(Q9.current), Q9.current = null
        }
    }, []);
    let ww = e7.useMemo(() => {
            let T8 = A6.indexOf(`
`);
            if (T8 === -1) return !0;
            return M6 <= T8
        }, [A6, M6]),
        gw = e7.useMemo(() => {
            let T8 = A6.lastIndexOf(`
`);
            if (T8 === -1) return !0;
            return M6 > T8
        }, [A6, M6]),
        QJ = e7.useMemo(() => {
            if (!z4()) return [];
            if (bF()) return [];
            if (!L8) return [];
            let T8 = w7(Object.values(L8.teammates), (g1) => g1.name !== "team-lead");
            return [{
                name: L8.teamName,
                memberCount: T8,
                runningCount: 0,
                idleCount: 0
            }]
        }, [L8]),
        $$ = (e7.useMemo(() => w7(Object.values(L6), (T8) => T8.status === "running"), [L6]) > 0 || !1) && !ju6(L6, G8),
        j$ = QJ.length > 0,
        a$ = e7.useMemo(() => [$$ && "tasks", p6 && "tmux", q8 && "bagel", j$ && "teams", N8 && "bridge"].filter(Boolean), [$$, p6, q8, j$, N8]),
        dJ = M8((T8) => T8.footerSelection),
        dY = dJ && a$.includes(dJ) ? dJ : null;
    e7.useEffect(() => {
        if (dJ && !dY) T6((T8) => T8.footerSelection === null ? T8 : {
            ...T8,
            footerSelection: null
        })
    }, [dJ, dY, T6]);
    let V2 = dY === "tasks",
        F1 = dY === "tmux",
        Mq = dY === "bagel",
        p4 = dY === "teams",
        Gq = dY === "bridge";

    function P4(T8) {
        if (T6((g1) => g1.footerSelection === T8 ? g1 : {
                ...g1,
                footerSelection: T8
            }), T8 === "tasks") h4(0), W7(x4)
    }

    function Z3(T8, g1 = !1) {
        let iq = dY ? a$.indexOf(dY) : -1,
            L3 = a$[iq + T8];
        if (L3) return P4(L3), !0;
        if (T8 < 0 && g1) return P4(null), !0;
        return !1
    }
    let {
        suggestion: Q5,
        markAccepted: Q3,
        logOutcomeAtSubmission: e4,
        markShown: T5
    } = f55({
        inputValue: A6,
        isAssistantResponding: w
    }), i4 = e7.useMemo(() => $6 && z8 ? Ap(typeof z8 === "string" ? z8 : z8.display) : A6, [$6, z8, A6]), h9 = e7.useMemo(() => Vh8(i4), [i4]), wz = M8((T8) => T8.ultraplanSessionUrl), WY = M8((T8) => T8.ultraplanLaunching), cJ = e7.useMemo(() => hn() && !wz && !WY ? pr8(i4) : [], [i4, wz, WY]), JO = e7.useMemo(() => wW6() ? vlK(i4) : [], [i4]), pH = e7.useMemo(() => bbK(i4), [i4]), Uw = e7.useMemo(() => {
        return N55(i4).filter((g1) => {
            let iq = i4.slice(g1.start + 1, g1.end);
            return wM6(iq, A)
        })
    }, [i4, A]), H$ = e7.useMemo(() => [], [i4]), WW = e7.useSyncExternalStore(S55, b55), VZ = e7.useMemo(() => Ls8(k6.getState().mcp.clients) ? I55(i4) : [], [i4, WW]), nM = e7.useMemo(() => {
        if (!z4()) return [];
        if (!L8?.teammates) return [];
        let T8 = [],
            g1 = L8.teammates;
        if (!g1) return T8;
        let iq = /(^|\s)@([\w-]+)/g,
            L3 = Object.values(g1),
            P9;
        while ((P9 = iq.exec(i4)) !== null) {
            let $w = P9[1] ?? "",
                Uj = P9.index + $w.length,
                IO = P9[0].trimStart(),
                rM = P9[2],
                M$ = L3.find((Rg) => Rg.name === rM);
            if (M$?.color) {
                let Rg = QP[M$.color];
                if (Rg) T8.push({
                    start: Uj,
                    end: Uj + IO.length,
                    themeColor: Rg
                })
            }
        }
        return T8
    }, [i4, L8]), s$ = e7.useMemo(() => md(i4).filter((T8) => T8.match.startsWith("[Image")).map((T8) => ({
        start: T8.index,
        end: T8.index + T8.match.length
    })), [i4]), NN = s$.some((T8) => T8.start === M6);
    e7.useEffect(() => {
        let T8 = s$.find((g1) => M6 > g1.start && M6 < g1.end);
        if (T8) {
            let g1 = (T8.start + T8.end) / 2;
            W6(M6 < g1 ? T8.start : T8.end)
        }
    }, [M6, s$, W6]);
    let kZ = e7.useMemo(() => {
            let T8 = [];
            for (let g1 of s$)
                if (M6 === g1.start) T8.push({
                    start: g1.start,
                    end: g1.end,
                    color: void 0,
                    inverse: !0,
                    priority: 8
                });
            if ($6 && z8 && !l6) T8.push({
                start: M6,
                end: M6 + U6.length,
                color: "warning",
                priority: 20
            });
            for (let g1 of pH) T8.push({
                start: g1.start,
                end: g1.end,
                color: "warning",
                priority: 15
            });
            for (let g1 of Uw) T8.push({
                start: g1.start,
                end: g1.end,
                color: "suggestion",
                priority: 5
            });
            for (let g1 of H$) T8.push({
                start: g1.start,
                end: g1.end,
                color: "suggestion",
                priority: 5
            });
            for (let g1 of VZ) T8.push({
                start: g1.start,
                end: g1.end,
                color: "suggestion",
                priority: 5
            });
            for (let g1 of nM) T8.push({
                start: g1.start,
                end: g1.end,
                color: g1.themeColor,
                priority: 5
            });
            if (l) T8.push({
                start: l.start,
                end: l.end,
                color: void 0,
                dimColor: !0,
                priority: 1
            });
            if (Ps())
                for (let g1 of h9)
                    for (let iq = g1.start; iq < g1.end; iq++) T8.push({
                        start: iq,
                        end: iq + 1,
                        color: Dp(iq - g1.start),
                        shimmerColor: Dp(iq - g1.start, !0),
                        priority: 10
                    });
            if (hn())
                for (let g1 of cJ)
                    for (let iq = g1.start; iq < g1.end; iq++) T8.push({
                        start: iq,
                        end: iq + 1,
                        color: Dp(iq - g1.start),
                        shimmerColor: Dp(iq - g1.start, !0),
                        priority: 10
                    });
            return T8
        }, [$6, U6, z8, l6, M6, pH, s$, nM, Uw, H$, VZ, i4, l, h9, cJ]),
        {
            addNotification: nz,
            removeNotification: J$
        } = EK();
    e7.useEffect(() => {
        if (h9.length && Ps()) nz({
            key: "ultrathink-active",
            text: "Effort set to high for this turn",
            priority: "immediate",
            timeoutMs: 5000
        });
        else J$("ultrathink-active")
    }, [nz, J$, h9.length]), e7.useEffect(() => {
        if (hn() && cJ.length) nz({
            key: "ultraplan-active",
            text: "This prompt will launch an ultraplan session in Claude Code on the web",
            priority: "immediate",
            timeoutMs: 5000
        });
        else J$("ultraplan-active")
    }, [nz, J$, cJ.length]), e7.useEffect(() => {
        if (wW6() && JO.length) nz({
            key: "ultrareview-active",
            text: "Run /ultrareview after Claude finishes to review these changes in the cloud",
            priority: "immediate",
            timeoutMs: 5000
        })
    }, [nz, JO.length]);
    let KC = e7.useRef(A6.length),
        lJ = e7.useRef(A6.length),
        nJ = e7.useCallback(() => {
            J$("stash-hint")
        }, [J$]);
    e7.useEffect(() => {
        let T8 = KC.current,
            g1 = lJ.current,
            iq = A6.length;
        if (KC.current = iq, iq > g1) {
            lJ.current = iq;
            return
        }
        if (iq === 0) {
            lJ.current = 0;
            return
        }
        let L3 = g1 >= 20 && iq <= 5,
            P9 = T8 >= 20 && iq <= 5;
        if (L3 && !P9) {
            if (!H8().hasUsedStash) nz({
                key: "stash-hint",
                jsx: Pq.createElement(T, {
                    dimColor: !0
                }, "Tip:", " ", Pq.createElement(v1, {
                    action: "chat:stash",
                    context: "Chat",
                    fallback: "ctrl+s",
                    description: "stash"
                })),
                priority: "immediate",
                timeoutMs: Gs8
            });
            lJ.current = iq
        }
    }, [A6.length, nz]);
    let {
        pushToBuffer: DY,
        undo: LL,
        canUndo: NZ,
        clearBuffer: QX
    } = D55({
        maxBufferSize: 50,
        debounceMs: 1000
    });
    v95({
        input: A6,
        pastedContents: f,
        onInputChange: f6,
        setCursorOffset: W6,
        setPastedContents: v
    });
    let cY = y95({
            input: A6,
            submitCount: W,
            viewingAgentName: v8
        }),
        hL = e7.useCallback((T8) => {
            if (T8 === "?") {
                d("tengu_help_toggled", {}), o(($w) => !$w);
                return
            }
            o(!1), nJ(), yc4(), gD(T6);
            let g1 = T8.length === A6.length + 1,
                iq = M6 === 0,
                L3 = ZR(T8);
            if (iq && L3 !== "prompt") {
                if (g1) {
                    X(L3);
                    return
                }
                if (A6.length === 0) {
                    X(L3);
                    let $w = Ap(T8).replaceAll("\t", "    ");
                    DY(A6, M6, f), f6($w), W6($w.length);
                    return
                }
            }
            let P9 = T8.replaceAll("\t", "    ");
            if (A6 !== P9) DY(A6, M6, f);
            T6(($w) => $w.footerSelection === null ? $w : {
                ...$w,
                footerSelection: null
            }), f6(P9)
        }, [f6, X, A6, M6, DY, f, nJ, T6]),
        {
            resetHistory: _K,
            onHistoryUp: r4,
            onHistoryDown: d5,
            dismissSearchHint: GA,
            historyIndex: cK
        } = X55((T8, g1, iq) => {
            hL(T8), X(g1), v(iq)
        }, A6, f, W6, J);
    e7.useEffect(() => {
        if ($6) GA()
    }, [$6, GA]);

    function eT() {
        if (R0.length > 1) return;
        if (!ww) return;
        if (w8.some(hj6)) {
            bO();
            return
        }
        r4()
    }

    function _C() {
        if (R0.length > 1) return;
        if (!gw) return;
        if (d5() && a$.length > 0) {
            let T8 = a$[0];
            if (P4(T8), T8 === "tasks" && !H8().hasSeenTasksHint) d8((g1) => g1.hasSeenTasksHint ? g1 : {
                ...g1,
                hasSeenTasksHint: !0
            })
        }
    }
    let [iM, RL] = e7.useState({
        suggestions: [],
        selectedSuggestion: -1,
        commandArgumentHint: void 0
    }), dG = e7.useCallback((T8) => {
        RL((g1) => typeof T8 === "function" ? T8(g1) : T8)
    }, []), X$ = e7.useCallback(async (T8, g1 = !1) => {
        T8 = T8.trimEnd();
        let iq = k6.getState();
        if (iq.footerSelection && a$.includes(iq.footerSelection)) return;
        if (iq.viewSelectionMode === "selecting-agent") return;
        let L3 = Object.values(f).some((rM) => rM.type === "image"),
            P9 = x8.text;
        if ((T8.trim() === "" || T8 === P9) && P9 && !L3 && !iq.viewingAgentTaskId) {
            if (a6.status === "active") {
                Q3(), e4(P9, {
                    skipReset: !0
                }), C(P9, {
                    setCursorOffset: W6,
                    clearBuffer: QX,
                    resetHistory: _K
                }, {
                    state: a6,
                    speculationSessionTimeSavedMs: D8,
                    setAppState: T6
                });
                return
            }
            if (x8.shownAt > 0) Q3(), T8 = P9
        }
        if (z4()) {
            let rM = a55(T8);
            if (rM) {
                let M$ = await s55(rM.recipientName, rM.message, L8, F_);
                if (M$.success) {
                    nz({
                        key: "direct-message-sent",
                        text: `Sent to @${M$.recipientName}`,
                        priority: "immediate",
                        timeoutMs: 3000
                    }), f6(""), W6(0), QX(), _K();
                    return
                } else if (M$.error === "no_team_context");
            }
        }
        if (T8.trim() === "" && !L3) return;
        let Uj = iM.suggestions.length > 0 && iM.suggestions.every((rM) => rM.description === "directory");
        if (iM.suggestions.length > 0 && !g1 && !Uj) {
            E(`[onSubmit] early return: suggestions showing (count=${iM.suggestions.length})`);
            return
        }
        if (x8.text && x8.shownAt > 0) e4(T8);
        J$("stash-hint");
        let IO = ab8(k6.getState());
        if (IO.type !== "leader" && x) {
            d("tengu_transcript_input_to_teammate", {}), await x(T8, IO.task, {
                setCursorOffset: W6,
                clearBuffer: QX,
                resetHistory: _K
            });
            return
        }
        await C(T8, {
            setCursorOffset: W6,
            clearBuffer: QX,
            resetHistory: _K
        })
    }, [x8, a6, D8, L8, k6, a$, iM.suggestions, C, x, QX, _K, e4, T6, Q3, f, J$]);
    G6.current = X$;
    let {
        suggestions: R0,
        selectedSuggestion: cG,
        commandArgumentHint: SL,
        inlineGhostText: cu,
        maxColumnWidth: qi,
        handleKeyDown: Q66
    } = n55({
        commands: A,
        onInputChange: f6,
        onSubmit: X$,
        setCursorOffset: W6,
        input: A6,
        cursorOffset: M6,
        mode: J,
        agents: O,
        setSuggestionsState: dG,
        suggestionsState: iM,
        suppressSuggestions: $6 || cK > 0,
        markAccepted: Q3,
        onModeChange: X,
        sessionEnvVars: z6
    });

    function QA(T8) {
        if (o8 || BH || FA || QG) return;
        if (j8(T8), T8.defaultPrevented || T8.didStopImmediatePropagation()) return;
        if (Q66(T8), T8.defaultPrevented || T8.didStopImmediatePropagation()) return;
        if (y1() === "macos" && t55(T8.key)) {
            let g1 = xM7[T8.key],
                iq = KB1();
            nz({
                key: "option-meta-hint",
                jsx: iq ? Pq.createElement(T, {
                    dimColor: !0
                }, "To enable ", g1, ", set ", Pq.createElement(T, {
                    bold: !0
                }, "Option as Meta"), " in", " ", iq, " preferences (⌘,)") : Pq.createElement(T, {
                    dimColor: !0
                }, "To enable ", g1, ", run /terminal-setup"),
                priority: "immediate",
                timeoutMs: 5000
            })
        }
        if (zC(T8), T8.key === "escape") {
            if (m6()) return;
            if (w8.some(hj6)) {
                bO();
                return
            }
            if (j.length > 0 && !A6 && !w) dA()
        }
        if (T8.key === "return" && q6) o(!1)
    }

    function zC(T8) {
        if (M6 === 0 && (T8.key === "escape" || T8.key === "backspace" || T8.key === "delete" || T8.ctrl && T8.key === "u")) X("prompt"), o(!1);
        if (q6 && A6 === "" && (T8.key === "backspace" || T8.key === "delete")) o(!1)
    }

    function m6() {
        if (a6.status === "active") return gD(T6), !0;
        if (m && B) return B(), !0;
        if (q6) return o(!1), !0;
        return !1
    }

    function n6(T8) {
        if (zC(T8), T8.ctrl || T8.meta) return;
        if (ce() && O6 === "NORMAL") {
            if (T8.key === "j") return T8.preventDefault(), _i();
            if (T8.key === "k") return T8.preventDefault(), n66();
            if (T8.key === "l") return T8.preventDefault(), IL();
            if (T8.key === "h") return T8.preventDefault(), EN()
        }
        if ([...T8.key].length === 1) T8.preventDefault(), hL(A6.slice(0, M6) + T8.key + A6.slice(M6)), W6(M6 + T8.key.length)
    }
    let F8 = J === "prompt" && R0.length === 0 && Q5 && !Q6;
    if (F8) T5();
    if (x8.text && !Q5 && x8.shownAt === 0 && !Q6) af("timing", x8.text), T6((T8) => ({
        ...T8,
        promptSuggestion: {
            text: null,
            promptId: null,
            shownAt: 0,
            acceptedAt: 0,
            generationRequestId: null
        }
    }));

    function I1(T8, g1, iq, L3, P9) {
        d("tengu_paste_image", {}), X("prompt");
        let $w = f8.current++,
            Uj = {
                id: $w,
                type: "image",
                content: T8,
                mediaType: g1 || "image/png",
                filename: iq || "Pasted image",
                dimensions: L3,
                sourcePath: P9
            };
        eu6(Uj, T6), qm6(Uj, T6), v((rM) => ({
            ...rM,
            [$w]: Uj
        }));
        let IO = p8.current ? " " : "";
        A9(IO + j$4($w)), p8.current = !0
    }
    let $7 = e7.useMemo(() => Object.values(f).some((T8) => T8.type === "image"), [f]);
    e7.useEffect(() => {
        if (!$7) return;
        let T8 = new Set(md(A6).map((g1) => g1.id));
        v((g1) => {
            let iq = Object.values(g1).filter((P9) => P9.type === "image" && !T8.has(P9.id));
            if (iq.length === 0) return g1;
            let L3 = {
                ...g1
            };
            for (let P9 of iq) delete L3[P9.id];
            return L3
        })
    }, [A6, $7, v]);

    function nq(T8) {
        p8.current = !1;
        let g1 = MO(T8).replaceAll("\r", `
`).replaceAll("\t", "    ");
        if (A6.length === 0) {
            let P9 = ZR(g1);
            if (P9 !== "prompt") X(P9), g1 = Ap(g1)
        }
        let iq = hE6(g1),
            L3 = Math.min(zi - 10, 2);
        if (g1.length > Vy8 || iq > L3) {
            let P9 = f8.current++,
                $w = {
                    id: P9,
                    type: "text",
                    content: g1
                };
            v((Uj) => ({
                ...Uj,
                [P9]: $w
            })), A9(uy8(P9, iq))
        } else A9(g1)
    }
    let ZK = e7.useCallback((T8, g1) => {
        if (!p8.current) return T8;
        if (p8.current = !1, emK(T8, g1) && !qBK(T8)) return " " + T8;
        return T8
    }, []);

    function A9(T8) {
        DY(A6, M6, f);
        let g1 = A6.slice(0, M6) + T8 + A6.slice(M6);
        f6(g1), W6(M6 + T8.length)
    }
    let dA = wp(() => {}, () => D()),
        bO = e7.useCallback(() => {
            let T8 = YR8(A6, M6);
            if (!T8) return !1;
            if (f6(T8.text), X("prompt"), W6(T8.cursorOffset), T8.images.length > 0) v((g1) => {
                let iq = {
                    ...g1
                };
                for (let L3 of T8.images) iq[L3.id] = L3;
                return iq
            });
            return !0
        }, [f6, X, A6, M6, v]);
    BK5(G, function(T8) {
        d("tengu_ext_at_mentioned", {});
        let g1, iq = u95.relative(b8(), T8.filePath);
        if (T8.lineStart && T8.lineEnd) g1 = T8.lineStart === T8.lineEnd ? `@${iq}#L${T8.lineStart} ` : `@${iq}#L${T8.lineStart}-${T8.lineEnd} `;
        else g1 = `@${iq} `;
        let L3 = A6[M6 - 1] ?? " ";
        if (!/\s/.test(L3)) g1 = ` ${g1}`;
        A9(g1)
    });
    let $z = e7.useCallback(() => {
            if (NZ) {
                let T8 = LL();
                if (T8) f6(T8.text), W6(T8.cursorOffset), v(T8.pastedContents)
            }
        }, [NZ, LL, f6, v]),
        dX = e7.useCallback(() => {
            DY(A6, M6, f);
            let T8 = A6.slice(0, M6) + `
` + A6.slice(M6);
            f6(T8), W6(M6 + 1)
        }, [A6, M6, f6, W6, DY, f]),
        FH = e7.useCallback(async () => {
            d("tengu_external_editor_used", {}), U3(!0);
            try {
                let T8 = H8().externalEditorContext ? uCK(j).messages.join(`

`) || void 0 : void 0,
                    g1 = await ML(A6, f, T8);
                if (g1.error) nz({
                    key: "external-editor-error",
                    text: g1.error,
                    color: "warning",
                    priority: "high"
                });
                if (g1.content !== null && g1.content !== A6) DY(A6, M6, f), f6(g1.content), W6(g1.content.length)
            } catch (T8) {
                if (T8 instanceof Error) j6(T8);
                nz({
                    key: "external-editor-error",
                    text: `External editor failed: ${b6(T8)}`,
                    color: "warning",
                    priority: "high"
                })
            } finally {
                U3(!1)
            }
        }, [A6, M6, f, j, DY, f6, nz]),
        k2 = e7.useCallback(() => {
            if (A6.trim() === "" && M !== void 0) f6(M.text), W6(M.cursorOffset), v(M.pastedContents), P(void 0);
            else if (A6.trim() !== "") P({
                text: A6,
                cursorOffset: M6,
                pastedContents: f
            }), f6(""), W6(0), v({}), d8((T8) => {
                if (T8.hasUsedStash) return T8;
                return {
                    ...T8,
                    hasUsedStash: !0
                }
            })
        }, [A6, M6, M, f6, P, f, v]),
        [CL, xz6] = e7.useState(0);
    e7.useLayoutEffect(() => {
        if (CL === 0) return;
        KO.get(process.stdout)?.forceRedraw()
    }, [CL]);
    let lu = e7.useCallback(() => {
            f6(""), W6(0), QX(), _K(), X("prompt"), v({}), xz6((T8) => T8 + 1)
        }, [f6, QX, _K, X, v]),
        d66 = e7.useCallback(() => {
            if (U9((T8) => !T8), q6) o(!1)
        }, [q6]),
        uz6 = e7.useCallback(() => {
            if (gA((T8) => !T8), q6) o(!1)
        }, [q6]),
        Ki = e7.useCallback(() => {
            if (k4((T8) => !T8), q6) o(!1)
        }, [q6]),
        bL = e7.useCallback(() => {
            if (z4() && i6 && Q6) {
                let L3 = {
                        ..._,
                        mode: i6.permissionMode
                    },
                    P9 = lW6(L3, void 0);
                d("tengu_mode_cycle", {
                    to: P9
                });
                let $w = Q6;
                if (T6((Uj) => {
                        let IO = Uj.tasks[$w];
                        if (!IO || IO.type !== "in_process_teammate") return Uj;
                        if (IO.permissionMode === P9) return Uj;
                        return {
                            ...Uj,
                            tasks: {
                                ...Uj.tasks,
                                [$w]: {
                                    ...IO,
                                    permissionMode: P9
                                }
                            }
                        }
                    }), q6) o(!1);
                return
            }
            E(`[auto-mode] handleCycleMode: currentMode=${_.mode} isAutoModeAvailable=${_.isAutoModeAvailable} showAutoModeOptIn=${fA} timeoutPending=${!!Q9.current}`);
            let T8 = lW6(_, L8),
                g1 = !1;
            if (g1 = T8 === "auto" && _.mode !== "auto" && !VU() && !Q6, g1) {
                if (PY(_.mode), T6((L3) => ({
                        ...L3,
                        toolPermissionContext: {
                            ...L3.toolPermissionContext,
                            mode: "auto"
                        }
                    })), z({
                        ..._,
                        mode: "auto"
                    }), Q9.current) clearTimeout(Q9.current);
                if (Q9.current = setTimeout((L3, P9) => {
                        L3(!0), P9.current = null
                    }, 400, MY, Q9), q6) o(!1);
                return
            }
            if (fA || Q9.current) {
                if (fA) d("tengu_auto_mode_opt_in_dialog_decline", {});
                if (MY(!1), Q9.current) clearTimeout(Q9.current), Q9.current = null;
                PY(null)
            }
            let {
                context: iq
            } = K35(_, L8);
            if (d("tengu_mode_cycle", {
                    to: T8
                }), T8 === "plan") d8((L3) => ({
                ...L3,
                lastPlanModeUse: Date.now()
            }));
            if (T6((L3) => ({
                    ...L3,
                    toolPermissionContext: {
                        ...iq,
                        mode: T8
                    }
                })), z({
                    ...iq,
                    mode: T8
                }), C97(T8, L8?.teamName), q6) o(!1)
        }, [_, L8, Q6, i6, T6, z, q6, fA]),
        cX = e7.useCallback(() => {
            {
                MY(!1), PY(null);
                let T8 = Fe(UA ?? _.mode, "auto", _);
                if (T6((g1) => ({
                        ...g1,
                        toolPermissionContext: {
                            ...T8,
                            mode: "auto"
                        }
                    })), z({
                        ...T8,
                        mode: "auto"
                    }), q6) o(!1)
            }
        }, [q6, o, UA, _, T6, z]),
        nu = e7.useCallback(() => {
            if (E(`[auto-mode] handleAutoModeOptInDecline: reverting to ${UA}, setting isAutoModeAvailable=false`), MY(!1), Q9.current) clearTimeout(Q9.current), Q9.current = null;
            if (UA) M37(!1), T6((T8) => ({
                ...T8,
                toolPermissionContext: {
                    ...T8.toolPermissionContext,
                    mode: UA,
                    isAutoModeAvailable: !1
                }
            })), z({
                ..._,
                mode: UA,
                isAutoModeAvailable: !1
            }), PY(null)
        }, [UA, _, T6, z]),
        c66 = e7.useCallback(() => {
            TE6(vO(e)).then((T8) => {
                if (T8) I1(T8.base64, T8.mediaType);
                else {
                    let g1 = WJ("chat:imagePaste", "Chat", "ctrl+v"),
                        iq = X7.isSSH() ? "No image found in clipboard. You're SSH'd; try scp?" : `No image found in clipboard. Use ${g1} to paste images.`;
                    nz({
                        key: "no-image-in-clipboard",
                        text: iq,
                        priority: "immediate",
                        timeoutMs: 1000
                    })
                }
            })
        }, [nz, I1, e]),
        l66 = lv();
    e7.useEffect(() => {
        if (!l66 || i) return;
        return l66.registerHandler({
            action: "chat:submit",
            context: "Chat",
            handler: () => {
                X$(A6)
            }
        })
    }, [l66, i, X$, A6]);
    let lG = e7.useMemo(() => ({
        "chat:undo": $z,
        "chat:newline": dX,
        "chat:externalEditor": FH,
        "chat:stash": k2,
        "chat:clearInput": lu,
        "chat:modelPicker": d66,
        "chat:thinkingToggle": Ki,
        "chat:cycleMode": bL,
        "chat:imagePaste": c66
    }), [$z, dX, FH, k2, lu, d66, Ki, bL, c66]);
    L7(lG, {
        context: "Chat",
        isActive: !i && !$6
    }), G1("chat:messageActions", () => Z?.(), {
        context: "Chat",
        isActive: !i && !$6
    }), G1("chat:fastMode", uz6, {
        context: "Chat",
        isActive: !i && q5() && AM()
    }), G1("help:dismiss", () => {
        o(!1)
    }, {
        context: "Help",
        isActive: q6
    });
    let yg = !1;
    G1("app:quickOpen", () => {}, {
        context: "Global",
        isActive: yg
    }), G1("app:globalSearch", () => {}, {
        context: "Global",
        isActive: yg
    }), G1("history:search", () => {}, {
        context: "Global",
        isActive: !1
    }), G1("app:interrupt", () => {
        gD(T6)
    }, {
        context: "Global",
        isActive: !w && a6.status === "active"
    });

    function n66() {
        Z3(-1, !0)
    }

    function _i() {
        if (V2 && !w6) {
            k(!0), P4(null);
            return
        }
        Z3(1)
    }

    function IL() {
        if (V2 && w6) {
            let T8 = 1 + g8.length;
            h4((g1) => (g1 + 1) % T8);
            return
        }
        Z3(1)
    }

    function EN() {
        if (V2 && w6) {
            let T8 = 1 + g8.length;
            h4((g1) => (g1 - 1 + T8) % T8);
            return
        }
        Z3(-1)
    }
    L7({
        "footer:up": n66,
        "footer:down": _i,
        "footer:next": IL,
        "footer:previous": EN,
        "footer:openSelected": () => {
            if (q6) o(!1);
            if (W8 === "selecting-agent") return;
            switch (dY) {
                case "tasks":
                    if (w6)
                        if (uq === 0) kG(T6);
                        else {
                            let T8 = g8[uq - 1];
                            if (T8) VG(T8.id, T6)
                        }
                    else if (cq === 0 && $4 > 0) kG(T6);
                    else {
                        let T8 = xs8(L6, C1)[cq - 1]?.id;
                        if (T8) VG(T8, T6);
                        else k(!0), P4(null)
                    }
                    break;
                case "tmux":
                    break;
                case "bagel":
                    break;
                case "teams":
                    n1(!0), P4(null);
                    break;
                case "bridge":
                    dq(!0), P4(null);
                    break
            }
        },
        "footer:clearSelection": () => {
            m6(), P4(null)
        },
        "footer:close": () => {
            if (V2 && cq >= 1) {
                let T8 = xs8(L6, C1)[cq - 1];
                if (!T8) return !1;
                if (W8 === "viewing-agent" && T8.id === Q6) {
                    hL(A6.slice(0, M6) + "x" + A6.slice(M6)), W6(M6 + 1);
                    return
                }
                if (r55(T8.id, T8.status, v6, T6) === "dismissed") W7((iq) => Math.max(x4, iq - 1));
                return
            }
            return !1
        }
    }, {
        context: "Footer",
        isActive: !!dY && !i
    });
    let gH = I95(),
        qV = q5() ? fQ() : !1,
        i66 = q5() ? R8 && (AM() || qV) : !1,
        YC = R95(i66 ?? !1),
        xL = s6 ? void 0 : jxK(x6, e);
    e7.useEffect(() => {
        if (!xL) {
            J$("effort-level");
            return
        }
        J$("effort-level"), nz({
            key: "effort-level",
            text: xL,
            priority: "high",
            timeoutMs: 1e4
        })
    }, [xL, nz, J$]);
    let {
        columns: XO,
        rows: zi
    } = s1(), r66 = XO - u_A, Yi = lq() ? Math.max(x_A, Math.floor(zi / 2) - I_A) : void 0, S0 = e7.useCallback((T8) => {
        if (!A6 || $6) return;
        let g1 = FK.fromText(A6, r66, M6),
            iq = g1.getViewportStartLine(Yi),
            L3 = g1.measuredText.getOffsetFromPosition({
                line: T8.localRow + iq,
                column: T8.localCol
            });
        W6(L3)
    }, [A6, r66, $6, M6, Yi]), AC = e7.useCallback((T8) => k(T8 ?? !0), [k]), o66 = F8 && Q5 ? Q5 : cY, Lg = e7.useMemo(() => A6.includes(`
`), [A6]), hg = e7.useCallback((T8, g1) => {
        let iq = !1;
        T6(($w) => {
            return iq = q5() && !zX(T8) && !!$w.fastMode, {
                ...$w,
                mainLoopModel: T8,
                mainLoopModelForSession: null,
                ...iq && {
                    fastMode: !1
                }
            }
        }), U9(!1);
        let L3 = (R8 ?? !1) && !iq,
            P9 = `Model set to ${hE(T8)}`;
        if (NP6(T8, L3, YX())) P9 += " · Billed as extra usage";
        if (iq) P9 += " · Fast mode OFF";
        nz({
            key: "model-switched",
            jsx: Pq.createElement(T, null, P9),
            priority: "immediate",
            timeoutMs: 3000
        }), d("tengu_model_picker_hotkey", {
            model: T8
        })
    }, [T6, nz, R8]), nG = e7.useCallback(() => {
        U9(!1)
    }, []), Ai = e7.useMemo(() => {
        if (!DA) return null;
        return Pq.createElement(u, {
            flexDirection: "column",
            marginTop: 1
        }, Pq.createElement(kP6, {
            initial: u6,
            sessionModel: h6,
            onSelect: hg,
            onCancel: nG,
            isStandaloneCommand: !0,
            showFastModeNotice: q5() && R8 && zX(u6) && AM()
        }))
    }, [DA, u6, h6, hg, nG]), Oi = e7.useCallback((T8) => {
        if (gA(!1), T8) nz({
            key: "fast-mode-toggled",
            jsx: Pq.createElement(T, null, T8),
            priority: "immediate",
            timeoutMs: 3000
        })
    }, [nz]), a66 = e7.useMemo(() => {
        if (!UX) return null;
        return Pq.createElement(u, {
            flexDirection: "column",
            marginTop: 1
        }, Pq.createElement(_o8, {
            onDone: Oi,
            unavailableReason: ST6()
        }))
    }, [UX, Oi]), iG = e7.useCallback((T8) => {
        T6((g1) => ({
            ...g1,
            thinkingEnabled: T8
        })), k4(!1), d("tengu_thinking_toggled_hotkey", {
            enabled: T8
        }), nz({
            key: "thinking-toggled-hotkey",
            jsx: Pq.createElement(T, {
                color: T8 ? "suggestion" : void 0,
                dimColor: !T8
            }, "Thinking ", T8 ? "on" : "off"),
            priority: "immediate",
            timeoutMs: 3000
        })
    }, [T6, nz]), OC = e7.useCallback(() => {
        k4(!1)
    }, []), iu = e7.useMemo(() => {
        if (!ZA) return null;
        return Pq.createElement(u, {
            flexDirection: "column",
            marginTop: 1
        }, Pq.createElement(f35, {
            currentValue: _8 ?? !0,
            onSelect: iG,
            onCancel: OC,
            isMidConversation: j.some((T8) => T8.type === "assistant")
        }))
    }, [ZA, _8, iG, OC, j.length]), s66 = e7.useMemo(() => fA ? Pq.createElement(mM7, {
        onAccept: cX,
        onDecline: nu
    }) : null, [fA, cX, nu]);
    if (kcK(lq() ? s66 : null), V) return Pq.createElement(Xu6, {
        onDone: () => k(!1),
        toolUseContext: h(j, [], new AbortController, e),
        initialDetailTaskId: typeof V === "string" ? V : void 0
    });
    if (z4() && o8) return Pq.createElement(V35, {
        initialTeams: QJ,
        onDone: () => {
            n1(!1)
        }
    });
    if (Ai) return Ai;
    if (a66) return a66;
    if (iu) return iu;
    if (c1) return Pq.createElement(z35, {
        onDone: () => {
            dq(!1), P4(null)
        }
    });
    let wi = {
            multiline: !0,
            onKeyDownBefore: QA,
            onSubmit: X$,
            onChange: hL,
            value: z8 ? Ap(typeof z8 === "string" ? z8 : z8.display) : A6,
            onHistoryUp: eT,
            onHistoryDown: _C,
            onHistoryReset: _K,
            placeholder: o66,
            onExit: N,
            onExitMessage: (T8, g1) => X6({
                show: T8,
                key: g1
            }),
            onLeftArrowOnEmpty: R,
            onImagePaste: I1,
            columns: r66,
            maxVisibleLines: Yi,
            disableCursorMovementForUpDownKeys: R0.length > 0 || !!dY,
            disableEscapeDoublePress: R0.length > 0,
            cursorOffset: M6,
            onChangeCursorOffset: W6,
            onPaste: nq,
            onIsPastingChange: vz,
            focus: !$6 && !i && !dY,
            showCursor: !dY && !$6 && !NN,
            argumentHint: SL,
            onUndo: NZ ? () => {
                let T8 = LL();
                if (T8) f6(T8.text), W6(T8.cursorOffset), v(T8.pastedContents)
            } : void 0,
            highlights: kZ,
            inlineGhostText: cu,
            inputFilter: ZK
        },
        ru = () => {
            let T8 = {
                bash: "bashBorder"
            };
            if (T8[J]) return T8[J];
            if ($D()) return "promptBorder";
            let g1 = KH();
            if (g1 && VJ.includes(g1)) return QP[g1];
            return "promptBorder"
        };
    if (JY) return Pq.createElement(u, {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderColor: ru(),
        borderStyle: "round",
        borderLeft: !1,
        borderRight: !1,
        borderBottom: !0,
        width: "100%"
    }, Pq.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "Save and close editor to continue..."));
    let t66 = ce() ? Pq.createElement(qP7, {
        ...wi,
        initialMode: O6,
        onModeChange: J6
    }) : Pq.createElement(l4, {
        ...wi
    });
    return Pq.createElement(u, {
        flexDirection: "column",
        marginTop: s6 ? 0 : 1
    }, dY && !i && Pq.createElement(u, {
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: n6
    }), !lq() && Pq.createElement(ns8, null), g && Pq.createElement(u, {
        marginTop: 1,
        marginLeft: 2
    }, Pq.createElement(T, {
        dimColor: !0
    }, "Waiting for permission…")), Pq.createElement(W95, {
        hasStash: M !== void 0
    }), gH ? Pq.createElement(Pq.Fragment, null, Pq.createElement(T, {
        color: gH.bgColor
    }, gH.text ? Pq.createElement(Pq.Fragment, null, "─".repeat(Math.max(0, XO - N1(gH.text) - 4)), Pq.createElement(T, {
        backgroundColor: gH.bgColor,
        color: "inverseText"
    }, " ", gH.text, " "), "──") : "─".repeat(XO)), Pq.createElement(u, {
        flexDirection: "row",
        width: "100%"
    }, Pq.createElement(OP7, {
        mode: J,
        isLoading: w,
        viewingAgentName: v8,
        viewingAgentColor: f1
    }), Pq.createElement(u, {
        flexGrow: 1,
        flexShrink: 1,
        tabIndex: -1,
        onClick: S0
    }, t66)), Pq.createElement(T, {
        color: gH.bgColor
    }, "─".repeat(XO))) : Pq.createElement(u, {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        borderColor: ru(),
        borderStyle: "round",
        borderLeft: !1,
        borderRight: !1,
        borderBottom: !0,
        width: "100%",
        borderText: p_A(i66 ?? !1, YC, qV)
    }, Pq.createElement(OP7, {
        mode: J,
        isLoading: w,
        viewingAgentName: v8,
        viewingAgentColor: f1
    }), Pq.createElement(u, {
        flexGrow: 1,
        flexShrink: 1,
        tabIndex: -1,
        onClick: S0
    }, t66)), Pq.createElement(H95, {
        apiKeyStatus: Y,
        debug: q,
        exitMessage: Y6,
        vimMode: ce() ? O6 : void 0,
        mode: J,
        isAutoUpdating: r,
        verbose: $,
        onChangeIsUpdating: t,
        suggestions: R0,
        selectedSuggestion: cG,
        maxColumnWidth: qi,
        toolPermissionContext: D6,
        helpOpen: q6,
        suppressHint: A6.length > 0,
        isLoading: w,
        tasksSelected: V2,
        teamsSelected: p4,
        bridgeSelected: Gq,
        tmuxSelected: F1,
        teammateFooterIndex: uq,
        ideSelection: K,
        mcpClients: G,
        isPasting: QY,
        isInputWrapped: Lg,
        messages: j,
        isSearching: $6,
        historyQuery: U6,
        setHistoryQuery: F6,
        historyFailedMatch: l6,
        onOpenTasksDialog: lq() ? AC : void 0
    }), lq() ? null : s66, lq() ? Pq.createElement(u, {
        position: "absolute",
        marginTop: s6 ? -2 : -1,
        height: R0.length === 0 && !fA ? 1 : 0,
        width: "100%",
        paddingLeft: 2,
        paddingRight: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden"
    }, Pq.createElement(vs8, {
        apiKeyStatus: Y,
        debug: q,
        isAutoUpdating: r,
        verbose: $,
        messages: j,
        onChangeIsUpdating: t,
        ideSelection: K,
        mcpClients: G,
        isInputWrapped: Lg
    })) : null)
}
// @from(Ln 534106, Col 0)
function B_A(q) {
    let K = 0;
    for (let _ of q)
        if (_.type === "user") {
            if (_.imagePasteIds) {
                for (let z of _.imagePasteIds)
                    if (z > K) K = z
            }
            if (Array.isArray(_.message.content)) {
                for (let z of _.message.content)
                    if (z.type === "text") {
                        let Y = md(z.text);
                        for (let A of Y)
                            if (A.id > K) K = A.id
                    }
            }
        } return K + 1
}
// @from(Ln 534125, Col 0)
function p_A(q, K, _) {
    if (!q) return;
    return {
        content: ` ${K?`${HW6(!0,_)} ${Y8.dim("/fast")}`:HW6(!0,_)} `,
        position: "top",
        align: "end",
        offset: 0
    }
}
// @from(Ln 534134, Col 4)
Pq
// @from(Ln 534134, Col 8)
e7
// @from(Ln 534134, Col 12)
I_A = 5
// @from(Ln 534135, Col 4)
x_A = 3
// @from(Ln 534136, Col 4)
u_A = 3
// @from(Ln 534137, Col 4)
m95
// @from(Ln 534138, Col 4)
B95 = L(() => {
    Y3();
    kY();
    Pm6();
    pK5();
    C8();
    N7();
    $S();
    n7();
    b$();
    e$7();
    xr8();
    o$6();
    CA();
    CP();
    Nr8();
    II();
    M55();
    Cs6();
    W55();
    Z55();
    oy();
    G55();
    I4();
    i55();
    Yk();
    n5();
    mN();
    g6();
    jp();
    zp();
    C7();
    LJ6();
    jt();
    o55();
    kh6();
    Ru();
    hx();
    vM();
    Uf();
    fO();
    a$6();
    h1();
    K8();
    D_();
    m8();
    rn8();
    zf();
    nO();
    VE6();
    Km6();
    e55();
    U8();
    _7();
    Jk();
    Sq();
    Kn();
    uM7();
    vX();
    NK();
    uS();
    a1();
    Ln8();
    kM7();
    EM7();
    sx();
    BD();
    zY();
    Rv();
    ZX();
    NR();
    Yc8();
    d_8();
    gr8();
    Is8();
    Y35();
    bK();
    AY8();
    tA7();
    s$7();
    M35();
    P35();
    in8();
    D35();
    NY();
    G35();
    sr8();
    Y66();
    E35();
    c35();
    Ts8();
    J95();
    M95();
    $P7();
    D95();
    SK8();
    T95();
    L95();
    S95();
    x95();
    K_8();
    Pq = K6(P6(), 1), e7 = K6(P6(), 1);
    m95 = Pq.memo(m_A)
})
// @from(Ln 534246, Col 0)
function Q_A(q) {
    if (typeof q !== "object" || q === null || !("type" in q)) return !1;
    return typeof q.type === "string"
}
// @from(Ln 534250, Col 0)
class JP7 {
    sessionId;
    orgUuid;
    getAccessToken;
    callbacks;
    ws = null;
    state = "closed";
    reconnectAttempts = 0;
    sessionNotFoundRetries = 0;
    pingInterval = null;
    reconnectTimer = null;
    detachListeners = null;
    constructor(q, K, _, z) {
        this.sessionId = q;
        this.orgUuid = K;
        this.getAccessToken = _;
        this.callbacks = z
    }
    async connect() {
        if (this.state === "connecting") {
            E("[SessionsWebSocket] Already connecting");
            return
        }
        this.state = "connecting";
        let K = `${r7().BASE_API_URL.replace("https://","wss://")}/v1/sessions/ws/${this.sessionId}/subscribe?organization_uuid=${this.orgUuid}`;
        E(`[SessionsWebSocket] Connecting to ${K}`);
        let z = {
            Authorization: `Bearer ${this.getAccessToken()}`,
            "anthropic-version": "2023-06-01"
        };
        if (typeof Bun < "u") {
            let Y = new globalThis.WebSocket(K, {
                headers: z,
                proxy: Tb(K),
                tls: OE() || void 0
            });
            this.ws = Y, Y.onopen = () => {
                E("[SessionsWebSocket] Connection opened, authenticated via headers"), this.state = "connected", this.reconnectAttempts = 0, this.sessionNotFoundRetries = 0, this.startPingInterval(), this.callbacks.onConnected?.()
            }, Y.onmessage = (A) => {
                let O = typeof A.data === "string" ? A.data : String(A.data);
                this.handleMessage(O)
            }, Y.onerror = () => {
                let A = Error("[SessionsWebSocket] WebSocket error");
                j6(A), this.callbacks.onError?.(A)
            }, Y.onclose = (A) => {
                E(`[SessionsWebSocket] Closed: code=${A.code} reason=${A.reason}`), this.handleClose(A.code)
            }, Y.addEventListener("pong", () => {
                E("[SessionsWebSocket] Pong received")
            }), this.detachListeners = () => {
                Y.onopen = null, Y.onmessage = null, Y.onerror = null, Y.onclose = null
            }
        } else {
            let {
                default: Y
            } = await Promise.resolve().then(() => (xY6(), fF6));
            if (this.state === "closed") return;
            let A = new Y(K, {
                headers: z,
                agent: vb(K),
                ...OE()
            });
            this.ws = A, A.on("open", () => {
                E("[SessionsWebSocket] Connection opened, authenticated via headers"), this.state = "connected", this.reconnectAttempts = 0, this.sessionNotFoundRetries = 0, this.startPingInterval(), this.callbacks.onConnected?.()
            }), A.on("message", (O) => {
                this.handleMessage(O.toString())
            }), A.on("error", (O) => {
                j6(Error(`[SessionsWebSocket] Error: ${O.message}`)), this.callbacks.onError?.(O)
            }), A.on("close", (O, w) => {
                E(`[SessionsWebSocket] Closed: code=${O} reason=${w.toString()}`), this.handleClose(O)
            }), A.on("pong", () => {
                E("[SessionsWebSocket] Pong received")
            }), this.detachListeners = () => {
                A.removeAllListeners(), A.on("error", (O) => E(`[SessionsWebSocket] post-detach error during close: ${b6(O)}`))
            }
        }
    }
    handleMessage(q) {
        try {
            let K = n8(q);
            if (Q_A(K)) this.callbacks.onMessage(K);
            else E(`[SessionsWebSocket] Ignoring message type: ${typeof K==="object"&&K!==null&&"type"in K?String(K.type):"unknown"}`)
        } catch (K) {
            j6(Error(`[SessionsWebSocket] Failed to parse message: ${b6(K)}`))
        }
    }
    handleClose(q) {
        if (this.stopPingInterval(), this.state === "closed") return;
        this.ws = null;
        let K = this.state;
        if (this.state = "closed", U_A.has(q)) {
            E(`[SessionsWebSocket] Permanent close code ${q}, not reconnecting`), this.callbacks.onClose?.();
            return
        }
        if (q === 4001) {
            if (this.sessionNotFoundRetries++, this.sessionNotFoundRetries > HP7) {
                E(`[SessionsWebSocket] 4001 retry budget exhausted (${HP7}), not reconnecting`), this.callbacks.onClose?.();
                return
            }
            this.scheduleReconnect(p95 * this.sessionNotFoundRetries, `4001 attempt ${this.sessionNotFoundRetries}/${HP7}`);
            return
        }
        if (K === "connected" && this.reconnectAttempts < F95) this.reconnectAttempts++, this.scheduleReconnect(p95, `attempt ${this.reconnectAttempts}/${F95}`);
        else E("[SessionsWebSocket] Not reconnecting"), this.callbacks.onClose?.()
    }
    scheduleReconnect(q, K) {
        this.callbacks.onReconnecting?.(), E(`[SessionsWebSocket] Scheduling reconnect (${K}) in ${q}ms`), this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null, this.connect()
        }, q)
    }
    startPingInterval() {
        this.stopPingInterval(), this.pingInterval = setInterval(() => {
            if (this.ws && this.state === "connected") try {
                this.ws.ping?.()
            } catch {}
        }, g_A)
    }
    stopPingInterval() {
        if (this.pingInterval) clearInterval(this.pingInterval), this.pingInterval = null
    }
    sendControlResponse(q) {
        if (!this.ws || this.state !== "connected") {
            j6(Error("[SessionsWebSocket] Cannot send: not connected"));
            return
        }
        E("[SessionsWebSocket] Sending control response"), this.ws.send(I6(q))
    }
    sendControlRequest(q) {
        if (!this.ws || this.state !== "connected") {
            j6(Error("[SessionsWebSocket] Cannot send: not connected"));
            return
        }
        let K = {
            type: "control_request",
            request_id: F_A(),
            request: q
        };
        E(`[SessionsWebSocket] Sending control request: ${q.subtype}`), this.ws.send(I6(K))
    }
    isConnected() {
        return this.state === "connected"
    }
    close() {
        if (E("[SessionsWebSocket] Closing connection"), this.state = "closed", this.stopPingInterval(), this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
        if (this.detachListeners?.(), this.detachListeners = null, this.ws) this.ws.close(), this.ws = null
    }
    reconnect() {
        E("[SessionsWebSocket] Force reconnecting"), this.reconnectAttempts = 0, this.sessionNotFoundRetries = 0, this.close(), this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null, this.connect()
        }, 500)
    }
}
// @from(Ln 534401, Col 4)
p95 = 2000
// @from(Ln 534402, Col 4)
F95 = 5
// @from(Ln 534403, Col 4)
g_A = 30000
// @from(Ln 534404, Col 4)
HP7 = 3
// @from(Ln 534405, Col 4)
U_A
// @from(Ln 534406, Col 4)
g95 = L(() => {
    z3();
    K8();
    m8();
    U8();
    Qm();
    _M();
    e8();
    U_A = new Set([4003])
})
// @from(Ln 534417, Col 0)
function d_A(q) {
    return q.type !== "control_request" && q.type !== "control_response" && q.type !== "control_cancel_request"
}
// @from(Ln 534420, Col 0)
class XP7 {
    config;
    callbacks;
    websocket = null;
    pendingPermissionRequests = new Map;
    constructor(q, K) {
        this.config = q;
        this.callbacks = K
    }
    connect() {
        E(`[RemoteSessionManager] Connecting to session ${this.config.sessionId}`);
        let q = {
            onMessage: (K) => this.handleMessage(K),
            onConnected: () => {
                E("[RemoteSessionManager] Connected"), this.callbacks.onConnected?.()
            },
            onClose: () => {
                E("[RemoteSessionManager] Disconnected"), this.callbacks.onDisconnected?.()
            },
            onReconnecting: () => {
                E("[RemoteSessionManager] Reconnecting"), this.callbacks.onReconnecting?.()
            },
            onError: (K) => {
                j6(K), this.callbacks.onError?.(K)
            }
        };
        this.websocket = new JP7(this.config.sessionId, this.config.orgUuid, this.config.getAccessToken, q), this.websocket.connect()
    }
    handleMessage(q) {
        if (q.type === "control_request") {
            this.handleControlRequest(q);
            return
        }
        if (q.type === "control_cancel_request") {
            let {
                request_id: K
            } = q, _ = this.pendingPermissionRequests.get(K);
            E(`[RemoteSessionManager] Permission request cancelled: ${K}`), this.pendingPermissionRequests.delete(K), this.callbacks.onPermissionCancelled?.(K, _?.tool_use_id);
            return
        }
        if (q.type === "control_response") {
            E("[RemoteSessionManager] Received control response");
            return
        }
        if (d_A(q)) this.callbacks.onMessage(q)
    }
    handleControlRequest(q) {
        let {
            request_id: K,
            request: _
        } = q;
        if (_.subtype === "can_use_tool") E(`[RemoteSessionManager] Permission request for tool: ${_.tool_name}`), this.pendingPermissionRequests.set(K, _), this.callbacks.onPermissionRequest(_, K);
        else {
            E(`[RemoteSessionManager] Unsupported control request subtype: ${_.subtype}`);
            let z = {
                type: "control_response",
                response: {
                    subtype: "error",
                    request_id: K,
                    error: `Unsupported control request subtype: ${_.subtype}`
                }
            };
            this.websocket?.sendControlResponse(z)
        }
    }
    async sendMessage(q, K) {
        E(`[RemoteSessionManager] Sending message to session ${this.config.sessionId}`);
        let _ = await po1(this.config.sessionId, q, K);
        if (!_) j6(Error(`[RemoteSessionManager] Failed to send message to session ${this.config.sessionId}`));
        return _
    }
    respondToPermissionRequest(q, K) {
        if (!this.pendingPermissionRequests.get(q)) {
            j6(Error(`[RemoteSessionManager] No pending permission request with ID: ${q}`));
            return
        }
        this.pendingPermissionRequests.delete(q);
        let z = {
            type: "control_response",
            response: {
                subtype: "success",
                request_id: q,
                response: {
                    behavior: K.behavior,
                    ...K.behavior === "allow" ? {
                        updatedInput: K.updatedInput
                    } : {
                        message: K.message
                    }
                }
            }
        };
        E(`[RemoteSessionManager] Sending permission response: ${K.behavior}`), this.websocket?.sendControlResponse(z)
    }
    isConnected() {
        return this.websocket?.isConnected() ?? !1
    }
    cancelSession() {
        E("[RemoteSessionManager] Sending interrupt signal"), this.websocket?.sendControlRequest({
            subtype: "interrupt"
        })
    }
    getSessionId() {
        return this.config.sessionId
    }
    disconnect() {
        E("[RemoteSessionManager] Disconnecting"), this.websocket?.close(), this.websocket = null, this.pendingPermissionRequests.clear()
    }
    reconnect() {
        E("[RemoteSessionManager] Reconnecting WebSocket"), this.websocket?.reconnect()
    }
}
// @from(Ln 534533, Col 0)
function U95(q, K, _, z = !1, Y = !1) {
    return {
        sessionId: q,
        getAccessToken: K,
        orgUuid: _,
        hasInitialPrompt: z,
        viewerOnly: Y
    }
}
// @from(Ln 534542, Col 4)
MP7 = L(() => {
    K8();
    U8();
    VX();
    g95()
})
// @from(Ln 534552, Col 0)
function Tm6(q, K) {
    return {
        type: "assistant",
        uuid: c_A(),
        message: {
            id: `remote-${K}`,
            type: "message",
            role: "assistant",
            content: [{
                type: "tool_use",
                id: q.tool_use_id,
                name: q.tool_name,
                input: q.input
            }],
            model: "",
            stop_reason: null,
            stop_sequence: null,
            container: null,
            context_management: null,
            usage: {
                input_tokens: 0,
                output_tokens: 0,
                cache_creation_input_tokens: 0,
                cache_read_input_tokens: 0
            }
        },
        requestId: void 0,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 534583, Col 0)
function Vm6(q) {
    return {
        name: q,
        inputSchema: {},
        isEnabled: () => !0,
        userFacingName: () => q,
        renderToolUseMessage: (K) => {
            let _ = Object.entries(K);
            if (_.length === 0) return "";
            return _.slice(0, 3).map(([z, Y]) => {
                let A = typeof Y === "string" ? Y : I6(Y);
                return `${z}: ${A}`
            }).join(", ")
        },
        call: async () => ({
            data: ""
        }),
        description: async () => "",
        prompt: () => "",
        isReadOnly: () => !1,
        isMcp: !1,
        needsPermissions: () => !0
    }
}
// @from(Ln 534607, Col 4)
as8 = L(() => {
    e8()
})
// @from(Ln 534611, Col 0)
function l_A(q) {
    return {
        type: "assistant",
        message: q.message,
        uuid: q.uuid,
        requestId: void 0,
        timestamp: new Date().toISOString(),
        error: q.error
    }
}
// @from(Ln 534622, Col 0)
function n_A(q) {
    return {
        type: "stream_event",
        event: q.event,
        ...q.ttft_ms !== void 0 ? {
            ttftMs: q.ttft_ms
        } : {}
    }
}
// @from(Ln 534632, Col 0)
function i_A(q) {
    let K = q.subtype !== "success";
    return {
        type: "system",
        subtype: "informational",
        content: K ? q.errors?.join(", ") || "Unknown error" : "Session completed successfully",
        level: K ? "warning" : "info",
        uuid: q.uuid,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 534644, Col 0)
function r_A(q) {
    return {
        type: "system",
        subtype: "informational",
        content: `Remote session initialized (model: ${q.model})`,
        level: "info",
        uuid: q.uuid,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 534655, Col 0)
function o_A(q) {
    if (!q.status) return null;
    return {
        type: "system",
        subtype: "informational",
        content: q.status === "compacting" ? "Compacting conversation…" : `Status: ${q.status}`,
        level: "info",
        uuid: q.uuid,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 534667, Col 0)
function a_A(q) {
    return {
        type: "system",
        subtype: "informational",
        content: `Tool ${q.tool_name} running for ${q.elapsed_time_seconds}s…`,
        level: "info",
        uuid: q.uuid,
        timestamp: new Date().toISOString(),
        toolUseID: q.tool_use_id
    }
}
// @from(Ln 534679, Col 0)
function s_A(q) {
    return {
        type: "system",
        subtype: "compact_boundary",
        content: "Conversation compacted",
        level: "info",
        uuid: q.uuid,
        timestamp: new Date().toISOString(),
        compactMetadata: x$7(q.compact_metadata)
    }
}
// @from(Ln 534691, Col 0)
function sW6(q, K) {
    switch (q.type) {
        case "assistant":
            return {
                type: "message", message: l_A(q)
            };
        case "user": {
            let _ = q.message?.content,
                z = Array.isArray(_) && _.some((Y) => Y.type === "tool_result");
            if (K?.convertToolResults && z) return {
                type: "message",
                message: t8({
                    content: _,
                    toolUseResult: q.tool_use_result,
                    uuid: q.uuid,
                    timestamp: q.timestamp
                })
            };
            if (K?.convertUserTextMessages && !z) {
                if (typeof _ === "string" || Array.isArray(_)) return {
                    type: "message",
                    message: t8({
                        content: _,
                        toolUseResult: q.tool_use_result,
                        uuid: q.uuid,
                        timestamp: q.timestamp
                    })
                }
            }
            return {
                type: "ignored"
            }
        }
        case "stream_event":
            return {
                type: "stream_event", event: n_A(q)
            };
        case "result":
            if (q.subtype !== "success") return {
                type: "message",
                message: i_A(q)
            };
            return {
                type: "ignored"
            };
        case "system":
            if (q.subtype === "init") return {
                type: "message",
                message: r_A(q)
            };
            if (q.subtype === "status") {
                if (q.status === "requesting") return {
                    type: "stream_event",
                    event: {
                        type: "stream_request_start"
                    }
                };
                let _ = o_A(q);
                return _ ? {
                    type: "message",
                    message: _
                } : {
                    type: "ignored"
                }
            }
            if (q.subtype === "compact_boundary") return {
                type: "message",
                message: s_A(q)
            };
            return E(`[sdkMessageAdapter] Ignoring system message subtype: ${q.subtype}`), {
                type: "ignored"
            };
        case "tool_progress":
            return {
                type: "message", message: a_A(q)
            };
        case "auth_status":
            return E("[sdkMessageAdapter] Ignoring auth_status message"), {
                type: "ignored"
            };
        case "tool_use_summary":
            return E("[sdkMessageAdapter] Ignoring tool_use_summary message"), {
                type: "ignored"
            };
        case "rate_limit_event":
            return E("[sdkMessageAdapter] Ignoring rate_limit_event message"), {
                type: "ignored"
            };
        default:
            return E(`[sdkMessageAdapter] Unknown message type: ${q.type}`), {
                type: "ignored"
            }
    }
}
// @from(Ln 534786, Col 0)
function km6(q) {
    return q.type === "result"
}
// @from(Ln 534789, Col 4)
XY8 = L(() => {
    K8();
    Ju6();
    _7()
})
// @from(Ln 534795, Col 0)
function Q95({
    config: q,
    setMessages: K,
    setIsLoading: _,
    onInit: z,
    setToolUseConfirmQueue: Y,
    tools: A,
    setStreamingToolUses: O,
    setStreamMode: w,
    setInProgressToolUseIDs: $,
    recordApiMetricsEvent: j
}) {
    let H = !!q,
        J = R7(),
        X = XW.useCallback((h) => J((C) => C.remoteConnectionStatus === h ? C : {
            ...C,
            remoteConnectionStatus: h
        }), [J]),
        M = XW.useRef(new Set),
        P = XW.useCallback(() => {
            let h = M.current.size;
            J((C) => C.remoteBackgroundTaskCount === h ? C : {
                ...C,
                remoteBackgroundTaskCount: h
            })
        }, [J]),
        W = XW.useRef(null),
        D = XW.useRef(!1),
        Z = XW.useRef(null),
        G = XW.useRef(!1),
        f = XW.useRef(!1),
        v = XW.useRef(new ou6(50)),
        V = XW.useRef(A);
    XW.useEffect(() => {
        V.current = A
    }, [A]), XW.useEffect(() => {
        if (!q) {
            if (G.current) G.current = !1, X("connecting"), _(!1), f.current = !1, D.current = !1, M.current.clear(), P(), $?.({
                action: "clear"
            });
            return
        }
        G.current = !0, E(`[useRemoteSession] Initializing for session ${q.sessionId}`);
        let h = new XP7(q, {
            onMessage: (C) => {
                let x = [`type=${C.type}`];
                if ("subtype" in C) x.push(`subtype=${C.subtype}`);
                if (C.type === "user") {
                    let m = C.message?.content;
                    x.push(`content=${Array.isArray(m)?m.map((S)=>S.type).join(","):typeof m}`)
                }
                if (E(`[useRemoteSession] Received ${x.join(" ")}`), W.current) clearTimeout(W.current), W.current = null;
                if (C.type === "user" && C.uuid && v.current.has(C.uuid)) {
                    E(`[useRemoteSession] Dropping echoed user message ${C.uuid}`);
                    return
                }
                if (C.type === "system" && C.subtype === "init" && z) E(`[useRemoteSession] Init received with ${C.slash_commands.length} slash commands`), z(C.slash_commands);
                if (C.type === "system") {
                    if (C.subtype === "task_started") {
                        M.current.add(C.task_id), P();
                        return
                    }
                    if (C.subtype === "task_notification") {
                        M.current.delete(C.task_id), P();
                        return
                    }
                    if (C.subtype === "task_progress" || C.subtype === "task_updated" || C.subtype === "notification") return;
                    if (C.subtype === "status") {
                        let m = D.current;
                        if (D.current = C.status === "compacting", m && D.current) return
                    }
                    if (C.subtype === "compact_boundary") D.current = !1
                }
                if (km6(C)) D.current = !1, _(!1);
                if ($ && C.type === "user") {
                    let m = C.message?.content;
                    if (Array.isArray(m)) {
                        let S = [];
                        for (let F of m)
                            if (F.type === "tool_result") S.push(F.tool_use_id);
                        if (S.length > 0) $({
                            action: "remove",
                            ids: S
                        })
                    }
                }
                let B = sW6(C, q.viewerOnly ? {
                    convertToolResults: !0,
                    convertUserTextMessages: !0
                } : void 0);
                if (B.type === "message") {
                    if (O?.((m) => m.length > 0 ? [] : m), $ && B.message.type === "assistant") {
                        let m = B.message.message.content.filter((S) => S.type === "tool_use").map((S) => S.id);
                        if (m.length > 0) $({
                            action: "add",
                            ids: m
                        })
                    }
                    K((m) => [...m, B.message])
                } else if (B.type === "stream_event")
                    if (O && w) Jx6(B.event, (m) => K((S) => [...S, m]), () => {}, w, O, void 0, void 0, j);
                    else E("[useRemoteSession] Stream event received but streaming callbacks not provided")
            },
            onPermissionRequest: (C, x) => {
                E(`[useRemoteSession] Permission request for tool: ${C.tool_name}`);
                let B = rK(V.current, C.tool_name) ?? Vm6(C.tool_name),
                    m = Tm6(C, x),
                    S = {
                        behavior: "ask",
                        message: C.description ?? `${C.tool_name} requires permission`,
                        suggestions: C.permission_suggestions,
                        blockedPath: C.blocked_path
                    },
                    F = {
                        assistantMessage: m,
                        tool: B,
                        description: C.description ?? `${C.tool_name} requires permission`,
                        input: C.input,
                        toolUseContext: {},
                        toolUseID: C.tool_use_id,
                        permissionResult: S,
                        permissionPromptStartTimeMs: Date.now(),
                        onUserInteraction() {},
                        onAbort() {
                            let U = {
                                behavior: "deny",
                                message: "User aborted"
                            };
                            h.respondToPermissionRequest(x, U), Y((g) => g.filter((c) => c.toolUseID !== C.tool_use_id))
                        },
                        onAllow(U, g, c) {
                            let n = {
                                behavior: "allow",
                                updatedInput: U
                            };
                            h.respondToPermissionRequest(x, n), Y((l) => l.filter((z6) => z6.toolUseID !== C.tool_use_id)), _(!0)
                        },
                        onReject(U) {
                            let g = {
                                behavior: "deny",
                                message: U ?? "User denied permission"
                            };
                            h.respondToPermissionRequest(x, g), Y((c) => c.filter((n) => n.toolUseID !== C.tool_use_id))
                        },
                        async recheckPermission() {}
                    };
                Y((U) => [...U, F]), _(!1)
            },
            onPermissionCancelled: (C, x) => {
                E(`[useRemoteSession] Permission request cancelled: ${C}`);
                let B = x ?? C;
                Y((m) => m.filter((S) => S.toolUseID !== B)), _(!0)
            },
            onConnected: () => {
                E("[useRemoteSession] Connected"), X("connected")
            },
            onReconnecting: () => {
                E("[useRemoteSession] Reconnecting"), X("reconnecting"), M.current.clear(), P(), $?.({
                    action: "clear"
                })
            },
            onDisconnected: () => {
                E("[useRemoteSession] Disconnected"), X("disconnected"), _(!1), M.current.clear(), P(), $?.({
                    action: "clear"
                })
            },
            onError: (C) => {
                E(`[useRemoteSession] Error: ${C.message}`)
            }
        });
        return Z.current = h, h.connect(), () => {
            if (E("[useRemoteSession] Cleanup - disconnecting"), W.current) clearTimeout(W.current), W.current = null;
            h.disconnect(), Z.current = null
        }
    }, [q, K, _, z, Y, O, w, $, X, P, j]);
    let k = XW.useCallback(async (h, C) => {
            let x = Z.current;
            if (!x) return E("[useRemoteSession] Cannot send - no manager"), !1;
            if (W.current) clearTimeout(W.current);
            if (_(!0), C?.uuid) v.current.add(C.uuid);
            let B = await x.sendMessage(h, C);
            if (!B) return _(!1), !1;
            if (!f.current && q && !q.hasInitialPrompt && !q.viewerOnly) {
                f.current = !0;
                let m = q.sessionId,
                    S = typeof h === "string" ? h : s5(h, " ");
                if (S) oe(S, new AbortController().signal).then((F) => {
                    Fo1(m, F ?? j4(S, 75))
                })
            }
            if (!q?.viewerOnly) {
                let m = D.current ? e_A : t_A;
                W.current = setTimeout((S, F) => {
                    E("[useRemoteSession] Response timeout - attempting reconnect");
                    let U = eO("Remote session may be unresponsive. Attempting to reconnect…", "warning");
                    S((g) => [...g, U]), F.reconnect()
                }, m, K, x)
            }
            return B
        }, [q, _, K]),
        N = XW.useCallback(() => {
            if (W.current) clearTimeout(W.current), W.current = null;
            if (!q?.viewerOnly) Z.current?.cancelSession();
            _(!1)
        }, [q, _]),
        R = XW.useCallback(() => {
            if (W.current) clearTimeout(W.current), W.current = null;
            Z.current?.disconnect(), Z.current = null
        }, []);
    return XW.useMemo(() => ({
        isRemoteMode: H,
        sendMessage: k,
        cancelRequest: N,
        disconnect: R
    }), [H, k, N, R])
}
// @from(Ln 535011, Col 4)
XW
// @from(Ln 535011, Col 8)
t_A = 60000
// @from(Ln 535012, Col 4)
e_A = 180000
// @from(Ln 535013, Col 4)
d95 = L(() => {
    SX7();
    MP7();
    as8();
    XY8();
    N7();
    gq();
    K8();
    c7();
    _7();
    ox6();
    VX();
    XW = K6(P6(), 1)
})
// @from(Ln 535028, Col 0)
function qzA(q) {
    return typeof q === "object" && q !== null && "type" in q && typeof q.type === "string"
}
// @from(Ln 535031, Col 0)
class PP7 {
    ws = null;
    config;
    callbacks;
    constructor(q, K) {
        this.config = q, this.callbacks = K
    }
    connect() {
        let q = {};
        if (this.config.authToken) q.authorization = `Bearer ${this.config.authToken}`;
        this.ws = new WebSocket(this.config.wsUrl, {
            headers: q
        }), this.ws.addEventListener("open", () => {
            this.callbacks.onConnected?.()
        }), this.ws.addEventListener("message", (K) => {
            let z = (typeof K.data === "string" ? K.data : "").split(`
`).filter((Y) => Y.trim());
            for (let Y of z) {
                let A;
                try {
                    A = n8(Y)
                } catch {
                    continue
                }
                if (!qzA(A)) continue;
                let O = A;
                if (O.type === "control_request") {
                    if (O.request.subtype === "can_use_tool") this.callbacks.onPermissionRequest(O.request, O.request_id);
                    else E(`[DirectConnect] Unsupported control request subtype: ${O.request.subtype}`), this.sendErrorResponse(O.request_id, `Unsupported control request subtype: ${O.request.subtype}`);
                    continue
                }
                if (O.type !== "control_response" && O.type !== "keep_alive" && O.type !== "control_cancel_request" && O.type !== "transcript_mirror" && !(O.type === "system" && O.subtype === "post_turn_summary")) this.callbacks.onMessage(O)
            }
        }), this.ws.addEventListener("close", () => {
            this.callbacks.onDisconnected?.()
        }), this.ws.addEventListener("error", () => {
            this.callbacks.onError?.(Error("WebSocket connection error"))
        })
    }
    sendMessage(q) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return !1;
        let K = I6({
            type: "user",
            message: {
                role: "user",
                content: q
            },
            parent_tool_use_id: null,
            session_id: ""
        });
        return this.ws.send(K), !0
    }
    respondToPermissionRequest(q, K) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        let _ = I6({
            type: "control_response",
            response: {
                subtype: "success",
                request_id: q,
                response: {
                    behavior: K.behavior,
                    ...K.behavior === "allow" ? {
                        updatedInput: K.updatedInput
                    } : {
                        message: K.message
                    }
                }
            }
        });
        this.ws.send(_)
    }
    sendInterrupt() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        let q = I6({
            type: "control_request",
            request_id: crypto.randomUUID(),
            request: {
                subtype: "interrupt"
            }
        });
        this.ws.send(q)
    }
    sendErrorResponse(q, K) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        let _ = I6({
            type: "control_response",
            response: {
                subtype: "error",
                request_id: q,
                error: K
            }
        });
        this.ws.send(_)
    }
    disconnect() {
        if (this.ws) this.ws.close(), this.ws = null
    }
    isConnected() {
        return this.ws?.readyState === WebSocket.OPEN
    }
}
// @from(Ln 535132, Col 4)
c95 = L(() => {
    K8();
    e8()
})
// @from(Ln 535137, Col 0)
function l95({
    config: q,
    setMessages: K,
    setIsLoading: _,
    setToolUseConfirmQueue: z,
    tools: Y
}) {
    let A = !!q,
        O = EL.useRef(null),
        w = EL.useRef(!1),
        $ = EL.useRef(!1),
        j = EL.useRef(Y);
    EL.useEffect(() => {
        j.current = Y
    }, [Y]), EL.useEffect(() => {
        if (!q) return;
        w.current = !1, E(`[useDirectConnect] Connecting to ${q.wsUrl}`);
        let M = new PP7(q, {
            onMessage: (P) => {
                if (km6(P)) _(!1);
                if (P.type === "system" && P.subtype === "init") {
                    if (w.current) return;
                    w.current = !0
                }
                let W = sW6(P, {
                    convertToolResults: !0
                });
                if (W.type === "message") K((D) => [...D, W.message])
            },
            onPermissionRequest: (P, W) => {
                E(`[useDirectConnect] Permission request for tool: ${P.tool_name}`);
                let D = rK(j.current, P.tool_name) ?? Vm6(P.tool_name),
                    Z = Tm6(P, W),
                    G = {
                        behavior: "ask",
                        message: P.description ?? `${P.tool_name} requires permission`,
                        suggestions: P.permission_suggestions,
                        blockedPath: P.blocked_path
                    },
                    f = {
                        assistantMessage: Z,
                        tool: D,
                        description: P.description ?? `${P.tool_name} requires permission`,
                        input: P.input,
                        toolUseContext: {},
                        toolUseID: P.tool_use_id,
                        permissionResult: G,
                        permissionPromptStartTimeMs: Date.now(),
                        onUserInteraction() {},
                        onAbort() {
                            let v = {
                                behavior: "deny",
                                message: "User aborted"
                            };
                            M.respondToPermissionRequest(W, v), z((V) => V.filter((k) => k.toolUseID !== P.tool_use_id))
                        },
                        onAllow(v, V, k) {
                            let N = {
                                behavior: "allow",
                                updatedInput: v
                            };
                            M.respondToPermissionRequest(W, N), z((R) => R.filter((h) => h.toolUseID !== P.tool_use_id)), _(!0)
                        },
                        onReject(v) {
                            let V = {
                                behavior: "deny",
                                message: v ?? "User denied permission"
                            };
                            M.respondToPermissionRequest(W, V), z((k) => k.filter((N) => N.toolUseID !== P.tool_use_id))
                        },
                        async recheckPermission() {}
                    };
                z((v) => [...v, f]), _(!1)
            },
            onConnected: () => {
                E("[useDirectConnect] Connected"), $.current = !0
            },
            onDisconnected: () => {
                if (E("[useDirectConnect] Disconnected"), !$.current) process.stderr.write(`
Failed to connect to server at ${q.wsUrl}
`);
                else process.stderr.write(`
Server disconnected.
`);
                $.current = !1, WK(1), _(!1)
            },
            onError: (P) => {
                E(`[useDirectConnect] Error: ${P.message}`)
            }
        });
        return O.current = M, M.connect(), () => {
            E("[useDirectConnect] Cleanup - disconnecting"), M.disconnect(), O.current = null
        }
    }, [q, K, _, z]);
    let H = EL.useCallback(async (M) => {
            let P = O.current;
            if (!P) return !1;
            return _(!0), P.sendMessage(M)
        }, [_]),
        J = EL.useCallback(() => {
            O.current?.sendInterrupt(), _(!1)
        }, [_]),
        X = EL.useCallback(() => {
            O.current?.disconnect(), O.current = null, $.current = !1
        }, []);
    return EL.useMemo(() => ({
        isRemoteMode: A,
        sendMessage: H,
        cancelRequest: J,
        disconnect: X
    }), [A, H, J, X])
}
// @from(Ln 535249, Col 4)
EL
// @from(Ln 535250, Col 4)
n95 = L(() => {
    as8();
    XY8();
    c95();
    gq();
    K8();
    CY();
    EL = K6(P6(), 1)
})
// @from(Ln 535263, Col 0)
function i95({
    session: q,
    setMessages: K,
    setIsLoading: _,
    setToolUseConfirmQueue: z,
    tools: Y,
    permissionMode: A
}) {
    let O = !!q,
        w = rT.useRef(null),
        $ = rT.useRef(!1),
        j = rT.useRef(!1),
        H = rT.useRef(Y);
    rT.useEffect(() => {
        H.current = Y
    }, [Y]);
    let J = rT.useRef(A);
    rT.useEffect(() => {
        if (J.current = A, j.current) w.current?.setPermissionMode(A)
    }, [A]), rT.useEffect(() => {
        if (!q) return;
        $.current = !1, E("[useSSHSession] wiring SSH session manager");
        let W = q.createManager({
            onMessage: (D) => {
                if (km6(D)) _(!1);
                if (D.type === "system" && D.subtype === "init") {
                    if ($.current) return;
                    $.current = !0
                }
                let Z = sW6(D, {
                    convertToolResults: !0
                });
                if (Z.type === "message") K((G) => [...G, Z.message])
            },
            onPermissionRequest: (D, Z) => {
                E(`[useSSHSession] permission request: ${D.tool_name}`);
                let G = rK(H.current, D.tool_name) ?? Vm6(D.tool_name),
                    f = Tm6(D, Z),
                    v = {
                        behavior: "ask",
                        message: D.description ?? `${D.tool_name} requires permission`,
                        suggestions: D.permission_suggestions,
                        blockedPath: D.blocked_path
                    },
                    V = {
                        assistantMessage: f,
                        tool: G,
                        description: D.description ?? `${D.tool_name} requires permission`,
                        input: D.input,
                        toolUseContext: {},
                        toolUseID: D.tool_use_id,
                        permissionResult: v,
                        permissionPromptStartTimeMs: Date.now(),
                        onUserInteraction() {},
                        onAbort() {
                            W.respondToPermissionRequest(Z, {
                                behavior: "deny",
                                message: "User aborted"
                            }), z((k) => k.filter((N) => N.toolUseID !== D.tool_use_id))
                        },
                        onAllow(k) {
                            W.respondToPermissionRequest(Z, {
                                behavior: "allow",
                                updatedInput: k
                            }), z((N) => N.filter((R) => R.toolUseID !== D.tool_use_id)), _(!0)
                        },
                        onReject(k) {
                            W.respondToPermissionRequest(Z, {
                                behavior: "deny",
                                message: k ?? "User denied permission"
                            }), z((N) => N.filter((R) => R.toolUseID !== D.tool_use_id))
                        },
                        async recheckPermission() {}
                    };
                z((k) => [...k, V]), _(!1)
            },
            onConnected: () => {
                E("[useSSHSession] connected"), j.current = !0, W.setPermissionMode(J.current)
            },
            onReconnecting: (D, Z) => {
                E(`[useSSHSession] ssh dropped, reconnecting (${D}/${Z})`), j.current = !1, _(!1);
                let G = {
                    type: "system",
                    subtype: "informational",
                    content: `SSH connection dropped — reconnecting (attempt ${D}/${Z})...`,
                    timestamp: new Date().toISOString(),
                    uuid: KzA(),
                    level: "warning"
                };
                K((f) => [...f, G])
            },
            onDisconnected: () => {
                E("[useSSHSession] ssh process exited (giving up)");
                let D = q.getStderrTail().trim(),
                    Z = j.current,
                    G = q.proc.exitCode;
                j.current = !1, _(!1);
                let f = Z ? "Remote session ended." : "SSH session failed before connecting.";
                if (D && (!Z || G !== 0)) f += `
Remote stderr (exit ${G??"signal "+q.proc.signalCode}):
${D}`;
                WK(1, "other", {
                    finalMessage: f
                })
            },
            onError: (D) => {
                E(`[useSSHSession] error: ${D.message}`)
            }
        });
        return w.current = W, W.connect(), W.setPermissionMode(J.current), () => {
            E("[useSSHSession] cleanup"), W.disconnect(), q.proxy.stop(), w.current = null
        }
    }, [q, K, _, z]);
    let X = rT.useCallback(async (W) => {
            let D = w.current;
            if (!D) return !1;
            return _(!0), D.sendMessage(W)
        }, [_]),
        M = rT.useCallback(() => {
            w.current?.sendInterrupt(), _(!1)
        }, [_]),
        P = rT.useCallback(() => {
            w.current?.disconnect(), w.current = null, j.current = !1
        }, []);
    return rT.useMemo(() => ({
        isRemoteMode: O,
        sendMessage: X,
        cancelRequest: M,
        disconnect: P
    }), [O, X, M, P])
}
// @from(Ln 535394, Col 4)
rT
// @from(Ln 535395, Col 4)
r95 = L(() => {
    as8();
    XY8();
    gq();
    K8();
    CY();
    rT = K6(P6(), 1)
})
// @from(Ln 535403, Col 4)
o95 = L(() => {
    z3();
    K8();
    VX()
})
// @from(Ln 535408, Col 4)
ss8
// @from(Ln 535409, Col 4)
a95 = L(() => {
    o95();
    XY8();
    K8();
    ss8 = K6(P6(), 1)
})
// @from(Ln 535416, Col 0)
function s95(q) {
    return {
        onBeforeQuery: async () => !0,
        onTurnComplete: async () => {},
        render: () => null
    }
}
// @from(Ln 535427, Col 0)
function Ez6() {
    let K = (y7() || {}).cleanupPeriodDays ?? _zA;
    if (K === 0) return null;
    let _ = K * 24 * 60 * 60 * 1000;
    return new Date(Date.now() - _)
}
// @from(Ln 535434, Col 0)
function zzA(q, K) {
    return {
        messages: q.messages + K.messages,
        errors: q.errors + K.errors
    }
}
// @from(Ln 535441, Col 0)
function YzA(q) {
    let K = i5(q, ".").replace(/T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/, "T$1:$2:$3.$4Z");
    return new Date(K)
}
// @from(Ln 535445, Col 0)
async function t95(q, K, _) {
    let z = {
        messages: 0,
        errors: 0
    };
    try {
        let Y = await V8().readdir(q);
        for (let A of Y) try {
            if (YzA(A.name) < K)
                if (await V8().unlink(dM(q, A.name)), _) z.messages++;
                else z.errors++
        } catch (O) {
            j6(O)
        }
    } catch (Y) {
        if (Y instanceof Error && !t1(Y)) j6(Y)
    }
    return z
}
// @from(Ln 535464, Col 0)
async function AzA() {
    let q = V8(),
        K = Ez6();
    if (K === null) return {
        messages: 0,
        errors: 0
    };
    let _ = TA6.errors(),
        z = TA6.baseLogs(),
        Y = await t95(_, K, !1);
    try {
        let A;
        try {
            A = await q.readdir(z)
        } catch {
            return Y
        }
        let O = A.filter((w) => w.isDirectory() && w.name.startsWith("mcp-logs-")).map((w) => dM(z, w.name));
        for (let w of O) Y = zzA(Y, await t95(w, K, !0)), await x66(w, q)
    } catch (A) {
        if (A instanceof Error && !t1(A)) j6(A)
    }
    return Y
}
// @from(Ln 535488, Col 0)
async function tW6(q, K, _) {
    if ((await _.stat(q)).mtime < K) return await _.unlink(q), !0;
    return !1
}
// @from(Ln 535492, Col 0)
async function x66(q, K) {
    try {
        await K.rmdir(q)
    } catch {}
}
// @from(Ln 535497, Col 0)
async function OzA() {
    let q = Ez6(),
        K = {
            messages: 0,
            errors: 0
        };
    if (q === null) return K;
    let _ = jg(),
        z = V8(),
        Y;
    try {
        Y = await z.readdir(_)
    } catch {
        return K
    }
    for (let A of Y) {
        if (!A.isDirectory()) continue;
        let O = dM(_, A.name),
            w;
        try {
            w = await z.readdir(O)
        } catch {
            K.errors++;
            continue
        }
        w.sort(($, j) => Number(j.isDirectory()) - Number($.isDirectory()));
        for (let $ of w)
            if ($.isFile()) {
                if (!$.name.endsWith(".jsonl") && !$.name.endsWith(".cast")) continue;
                try {
                    if (await tW6(dM(O, $.name), q, z)) {
                        if (K.messages++, $.name.endsWith(".jsonl")) {
                            let j = $.name.slice(0, -6);
                            if (j && j !== "." && j !== "..") await z.rm(dM(O, j), {
                                recursive: !0,
                                force: !0
                            }).catch(() => {
                                K.errors++
                            })
                        }
                    }
                } catch {
                    K.errors++
                }
            } else if ($.isDirectory()) {
            let j = dM(O, $.name),
                H = dM(j, JQ1),
                J = await z.readdir(H).catch(() => []);
            for (let M of J)
                if (M.isFile()) try {
                    if (await tW6(dM(H, M.name), q, z)) K.messages++
                } catch {
                    K.errors++
                } else if (M.isDirectory()) {
                    let P = dM(H, M.name),
                        W;
                    try {
                        W = await z.readdir(P)
                    } catch {
                        continue
                    }
                    for (let D of W) {
                        if (!D.isFile()) continue;
                        try {
                            if (await tW6(dM(P, D.name), q, z)) K.messages++
                        } catch {
                            K.errors++
                        }
                    }
                    await x66(P, z)
                } await x66(H, z);
            let X = dM(j, "frame");
            for (let M of await z.readdir(X).catch(() => [])) {
                if (!M.isFile() || !M.name.endsWith(".html")) continue;
                try {
                    if (await tW6(dM(X, M.name), q, z)) K.messages++
                } catch {
                    K.errors++
                }
            }
            await x66(X, z), await x66(j, z)
        }
        await x66(O, z)
    }
    return K
}
// @from(Ln 535583, Col 0)
async function wzA(q, K, _ = !0) {
    let z = Ez6(),
        Y = {
            messages: 0,
            errors: 0
        };
    if (z === null) return Y;
    let A = V8(),
        O;
    try {
        O = await A.readdir(q)
    } catch {
        return Y
    }
    for (let w of O) {
        if (!w.isFile() || !w.name.endsWith(K)) continue;
        try {
            if (await tW6(dM(q, w.name), z, A)) Y.messages++
        } catch {
            Y.errors++
        }
    }
    if (_) await x66(q, A);
    return Y
}
// @from(Ln 535608, Col 0)
async function $zA() {
    let q = {
            messages: 0,
            errors: 0
        },
        K = Ez6();
    if (K === null) return q;
    let _ = dM(A7(), "hfi-auth.json");
    try {
        if (await tW6(_, K, V8())) q.messages++
    } catch (z) {
        if (!t1(z)) j6(z), q.errors++
    }
    return q
}
// @from(Ln 535624, Col 0)
function jzA() {
    let q = dM(A7(), "plans");
    return wzA(q, ".md")
}
// @from(Ln 535628, Col 0)
async function HzA() {
    let q = Ez6(),
        K = {
            messages: 0,
            errors: 0
        };
    if (q === null) return K;
    let _ = V8();
    try {
        let z = A7(),
            Y = dM(z, "file-history"),
            A;
        try {
            A = await _.readdir(Y)
        } catch {
            return K
        }
        let O = A.filter((w) => w.isDirectory()).map((w) => dM(Y, w.name));
        await Promise.all(O.map(async (w) => {
            try {
                if ((await _.stat(w)).mtime < q) await _.rm(w, {
                    recursive: !0,
                    force: !0
                }), K.messages++
            } catch {
                K.errors++
            }
        })), await x66(Y, _)
    } catch (z) {
        j6(z)
    }
    return K
}
// @from(Ln 535661, Col 0)
async function JzA() {
    let q = Ez6(),
        K = {
            messages: 0,
            errors: 0
        };
    if (q === null) return K;
    let _ = V8();
    try {
        let z = A7(),
            Y = dM(z, "session-env"),
            A;
        try {
            A = await _.readdir(Y)
        } catch {
            return K
        }
        let O = A.filter((w) => w.isDirectory()).map((w) => dM(Y, w.name));
        for (let w of O) try {
            if ((await _.stat(w)).mtime < q) await _.rm(w, {
                recursive: !0,
                force: !0
            }), K.messages++
        } catch {
            K.errors++
        }
        await x66(Y, _)
    } catch (z) {
        j6(z)
    }
    return K
}
// @from(Ln 535693, Col 0)
async function XzA() {
    let q = Ez6(),
        K = {
            messages: 0,
            errors: 0
        };
    if (q === null) return K;
    let _ = V8(),
        z = dM(A7(), "debug"),
        Y;
    try {
        Y = await _.readdir(z)
    } catch {
        return K
    }
    for (let A of Y) {
        if (!A.isFile() || !A.name.endsWith(".txt") || A.name === "latest") continue;
        try {
            if (await tW6(dM(z, A.name), q, _)) K.messages++
        } catch {
            K.errors++
        }
    }
    return K
}
// @from(Ln 535718, Col 0)
async function e95() {
    if (await dq5(), !L2("userSettings") && y7()?.cleanupPeriodDays === void 0) {
        E("Skipping retention cleanup: userSettings source is disabled (--setting-sources) and no enabled source provides cleanupPeriodDays.");
        return
    }
    let {
        errors: q
    } = bt();
    if (q.length > 0 && lO1("cleanupPeriodDays")) {
        E("Skipping cleanup: settings have validation errors but cleanupPeriodDays was explicitly set. Fix settings errors to enable cleanup.");
        return
    }
    await AzA(), await OzA(), await jzA(), await HzA(), await JzA(), await XzA(), await $zA();
    let K = Ez6();
    if (K !== null) {
        await A$4(K);
        let _ = await DJ7(K);
        if (_ > 0) d("tengu_worktree_cleanup", {
            removed: _
        })
    }
}
// @from(Ln 535740, Col 4)
_zA = 30
// @from(Ln 535741, Col 4)
q_5 = L(() => {
    C8();
    sH8();
    K8();
    Q8();
    m8();
    Yq();
    Km6();
    U8();
    El();
    wB1();
    g4();
    A48();
    aY();
    a1();
    ND();
    tD()
})
// @from(Ln 535760, Col 0)
function K_5(q, {
    allowNewlineAndTab: K = !1
} = {}) {
    for (let _ = 0; _ < q.length; _++) {
        let z = q.charCodeAt(_);
        if (z <= 31 || z === 127) {
            if (K && (z === 10 || z === 9)) continue;
            return !0
        }
    }
    return !1
}