
// @from(Ln 500059, Col 0)
function Efz({
    debug: A,
    ideSelection: q,
    toolPermissionContext: K,
    setToolPermissionContext: Y,
    apiKeyStatus: z,
    commands: _,
    agents: w,
    isLoading: O,
    verbose: $,
    messages: H,
    onAutoUpdaterResult: j,
    autoUpdaterResult: J,
    input: M,
    onInputChange: D,
    mode: X,
    onModeChange: P,
    stashedPrompt: W,
    setStashedPrompt: Z,
    submitCount: G,
    onShowMessageSelector: f,
    onQuickRestoreLastInterrupted: v,
    mcpClients: N,
    pastedContents: V,
    setPastedContents: L,
    vimMode: h,
    setVimMode: R,
    showBashesDialog: u,
    setShowBashesDialog: I,
    tasksSelected: g,
    setTasksSelected: B,
    bridgeSelected: b,
    setBridgeSelected: p,
    onExit: Q,
    getToolUseContext: U,
    onSubmit: r,
    onAgentSubmit: e,
    isSearchingHistory: Y6,
    setIsSearchingHistory: H6,
    onDismissSideQuestion: J6,
    isSideQuestionVisible: K6,
    helpOpen: s,
    setHelpOpen: X6,
    hasSuppressedDialogs: z6,
    insertTextRef: N6,
    voiceInterimRange: $6
}) {
    let n = sR(),
        o = he(),
        [a, i] = U7.useState(!1),
        [l, q6] = U7.useState({
            show: !1
        }),
        [w6, O6] = U7.useState(M.length),
        L6 = A7.useRef(M);
    if (M !== L6.current) O6(M.length), L6.current = M;
    let y6 = A7.useCallback((y1) => {
        L6.current = y1, D(y1)
    }, [D]);
    if (N6) N6.current = {
        cursorOffset: w6,
        insert: (y1) => {
            let _4 = w6 === M.length && M.length > 0 && !/\s$/.test(M) ? " " + y1 : y1,
                H4 = M.slice(0, w6) + _4 + M.slice(w6);
            L6.current = H4, D(H4), O6(w6 + _4.length)
        },
        setInputWithCursor: (y1, WA) => {
            L6.current = y1, D(y1), O6(WA)
        }
    };
    let G6 = S5(),
        R6 = xA(),
        T6 = M1((y1) => y1.tasks),
        D6 = M1((y1) => y1.replBridgeConnected),
        Q6 = M1((y1) => y1.replBridgeError),
        k6 = D6 || !!Q6,
        Z6 = M1((y1) => !1),
        u6 = !1,
        [C6, o6] = U7.useState(!1),
        V6 = M1((y1) => y1.teamContext),
        b6 = UF(),
        E6 = M1((y1) => y1.promptSuggestion),
        U6 = M1((y1) => y1.speculation),
        c6 = M1((y1) => y1.speculationSessionTimeSavedMs),
        K1 = M1((y1) => y1.viewingAgentTaskId),
        j6 = M1((y1) => y1.viewSelectionMode),
        W6 = M1((y1) => y1.expandedView) === "teammates",
        n6 = M1((y1) => y1.mainLoopModel),
        d6 = M1((y1) => y1.mainLoopModelForSession),
        S6 = M1((y1) => y1.thinkingEnabled),
        g6 = M1((y1) => Dq() ? y1.fastMode : !1),
        D1 = M1((y1) => y1.effortValue),
        J1 = vR(G6.getState()),
        E1 = J1?.identity.agentName,
        K8 = J1?.identity.color && s$.includes(J1.identity.color) ? J1.identity.color : void 0,
        e8 = U7.useMemo(() => BR(T6).filter((y1) => y1.status === "running").sort((y1, WA) => y1.identity.agentName.localeCompare(WA.identity.agentName)), [T6]),
        n8 = e8.length > 0 || J1 !== void 0,
        H7 = U7.useMemo(() => {
            if (J1) return {
                ...K,
                mode: J1.permissionMode
            };
            return K
        }, [J1, K]),
        {
            historyQuery: GA,
            setHistoryQuery: h8,
            historyMatch: U8,
            historyFailedMatch: P4
        } = sxq((y1) => {
            L(y1.pastedContents), m5(y1.display)
        }, M, y6, O6, w6, P, X, Y6, H6, L, V),
        T4 = U7.useRef(-1);
    if (T4.current === -1) T4.current = yfz(H);
    let [$4, qA] = U7.useState(!1), [d7, W4] = U7.useState(!1), [Dz, JK] = U7.useState(!1), [F3, MK] = U7.useState(0), [k3, M5] = U7.useState(-1), x5 = aI1(), tz = U7.useMemo(() => Object.values(T6).some((y1) => ij(y1) && !((e2() || sH()) && y1.type === "local_agent")), [T6]) ? -1 : 0;
    U7.useEffect(() => {
        if (k3 >= x5) M5(Math.max(tz, x5 - 1))
    }, [x5, k3, tz]);
    let [x9, J9] = U7.useState(!1), [sw, UY] = U7.useState(!1), [dY, Bq] = U7.useState(!1), [YA, E3] = U7.useState(!1), [u9, u5] = U7.useState(!1), [KK, cY] = U7.useState(!1), [B4, lY] = U7.useState(!1), [e3, D5] = U7.useState(!1), [WY, y2] = U7.useState(0), [s6, A1] = U7.useState(!1), [f1, h1] = U7.useState(null), u1 = U7.useRef(null), j8 = U7.useMemo(() => {
        let y1 = M.indexOf(`
`);
        if (y1 === -1) return !0;
        return w6 <= y1
    }, [M, w6]), l8 = U7.useMemo(() => {
        let y1 = M.lastIndexOf(`
`);
        if (y1 === -1) return !0;
        return w6 > y1
    }, [M, w6]), p8 = U7.useMemo(() => {
        if (!E7()) return [];
        if (Rb()) return [];
        if (!V6) return [];
        let y1 = Object.values(V6.teammates).filter((WA) => WA.name !== "team-lead").length;
        return [{
            name: V6.teamName,
            memberCount: y1,
            runningCount: 0,
            idleCount: 0
        }]
    }, [V6]), {
        suggestion: o8,
        markAccepted: a8,
        logOutcomeAtSubmission: $A,
        markShown: G7
    } = exq({
        inputValue: M,
        isAssistantResponding: O
    }), Q1 = U7.useMemo(() => Y6 && U8 ? D36(typeof U8 === "string" ? U8 : U8.display) : M, [Y6, U8, M]), zA = U7.useMemo(() => C21(Q1), [Q1]), gA = U7.useMemo(() => _Z4(Q1), [Q1]), k7 = U7.useMemo(() => {
        return _bq(Q1).filter((WA) => {
            let _4 = Q1.slice(WA.start + 1, WA.end);
            return rY6(_4, _)
        })
    }, [Q1, _]), Q4 = U7.useMemo(() => [], [Q1]), X5 = U7.useMemo(() => {
        if (!E7()) return [];
        if (!V6?.teammates) return [];
        let y1 = [],
            WA = V6.teammates;
        if (!WA) return y1;
        let _4 = /(^|\s)@([\w-]+)/g,
            H4 = Object.values(WA),
            t5;
        while ((t5 = _4.exec(Q1)) !== null) {
            let fH = t5[1] ?? "",
                TH = t5.index + fH.length,
                Wz = t5[0].trimStart(),
                oN = t5[2],
                T86 = H4.find((OT) => OT.name === oN);
            if (T86?.color) {
                let OT = t$[T86.color];
                if (OT) y1.push({
                    start: TH,
                    end: TH + Wz.length,
                    themeColor: OT
                })
            }
        }
        return y1
    }, [Q1, V6]), sq = U7.useMemo(() => {
        let y1 = [];
        if (Y6 && U8 && !P4) y1.push({
            start: w6,
            end: w6 + GA.length,
            color: "warning",
            priority: 20
        });
        for (let WA of gA) y1.push({
            start: WA.start,
            end: WA.end,
            color: "warning",
            priority: 15
        });
        for (let WA of k7) y1.push({
            start: WA.start,
            end: WA.end,
            color: "suggestion",
            priority: 5
        });
        for (let WA of Q4) y1.push({
            start: WA.start,
            end: WA.end,
            color: "suggestion",
            priority: 5
        });
        for (let WA of X5) y1.push({
            start: WA.start,
            end: WA.end,
            color: WA.themeColor,
            priority: 5
        });
        if ($6) y1.push({
            start: $6.start,
            end: $6.end,
            color: void 0,
            dimColor: !0,
            priority: 1
        });
        if (GU())
            for (let WA of zA)
                for (let _4 = WA.start; _4 < WA.end; _4++) y1.push({
                    start: _4,
                    end: _4 + 1,
                    color: Rx6(_4 - WA.start),
                    shimmerColor: Rx6(_4 - WA.start, !0),
                    priority: 10
                });
        return y1
    }, [Y6, GA, U8, P4, w6, gA, X5, k7, Q4, Q1, $6, zA]), {
        addNotification: g4,
        removeNotification: v4
    } = o4();
    U7.useEffect(() => {
        if (!zA.length || !GU()) return;
        g4({
            key: "ultrathink-active",
            text: "Effort set to high for this turn",
            priority: "immediate",
            timeoutMs: 5000
        })
    }, [g4, zA.length]);
    let Cq = U7.useRef(M.length),
        E5 = U7.useRef(M.length),
        hK = U7.useRef(-1),
        j3 = U7.useCallback(() => {
            v4("stash-hint")
        }, [v4]);
    U7.useEffect(() => {
        let y1 = Cq.current,
            WA = E5.current,
            _4 = M.length;
        if (Cq.current = _4, _4 > WA) {
            E5.current = _4;
            return
        }
        if (_4 === 0) {
            E5.current = 0;
            return
        }
        let H4 = WA >= 20 && _4 <= 5,
            t5 = y1 >= 20 && _4 <= 5;
        if (H4 && !t5) {
            if (!X1().hasUsedStash) g4({
                key: "stash-hint",
                jsx: A7.createElement(T, {
                    dimColor: !0
                }, "Tip:", " ", A7.createElement(O8, {
                    action: "chat:stash",
                    context: "Chat",
                    fallback: "ctrl+s",
                    description: "stash"
                })),
                priority: "immediate",
                timeoutMs: bI1
            });
            E5.current = _4
        }
    }, [M.length, g4]);
    let {
        pushToBuffer: A9,
        undo: u7,
        canUndo: Xz,
        clearBuffer: iY
    } = Xxq({
        maxBufferSize: 50,
        debounceMs: 1000
    });
    Cxq({
        input: M,
        pastedContents: V,
        onInputChange: y6,
        setCursorOffset: O6,
        setPastedContents: L
    });
    let gq = mxq({
            input: M,
            submitCount: G,
            viewingAgentName: E1
        }),
        Pz = U7.useCallback((y1) => {
            if (y1 === "?") {
                d("tengu_help_toggled", {}), X6((fH) => !fH);
                return
            }
            X6(!1), j3(), iKq(), Nb(R6);
            let WA = y1.length === M.length + 1,
                _4 = w6 === 0,
                H4 = PB(y1);
            if (WA && _4 && H4 !== "prompt") {
                P(H4);
                return
            }
            let t5 = y1.replaceAll("\t", "    ");
            if (M !== t5) A9(M, w6, V);
            B(!1), qA(!1), o6(!1), y6(t5)
        }, [y6, P, M, w6, A9, V, B, qA, o6, j3, R6]),
        {
            resetHistory: L2,
            onHistoryUp: AP,
            onHistoryDown: A2,
            dismissSearchHint: Mj,
            historyIndex: q2
        } = Kbq((y1, WA, _4) => {
            Pz(y1), P(WA), L(_4)
        }, M, V, O6, X);
    U7.useEffect(() => {
        if (Y6) Mj()
    }, [Y6, Mj]);

    function Mq(y1) {
        if (B(y1 === "tasks"), o6(y1 === "tmux"), p(y1 === "bridge"), y1 === "tasks") MK(0), M5(tz)
    }
    U7.useEffect(() => {
        if (C6 && !u6) o6(!1)
    }, [C6, u6]);

    function xO() {
        if (ew.length > 1) return;
        if (b) {
            if (p8.length > 0) qA(!0), Mq("none");
            else if (u6) Mq("tmux");
            else if (Object.values(T6).filter((H4) => H4.status === "running").length > 0 && !hh(T6, W6)) Mq("tasks");
            else Mq("none");
            return
        }
        if ($4) {
            if (qA(!1), u6) {
                Mq("tmux");
                return
            }
            if (Object.values(T6).filter((H4) => H4.status === "running").length > 0 && !hh(T6, W6)) Mq("tasks");
            else Mq("none");
            return
        }
        if (C6) {
            if (Object.values(T6).filter((H4) => H4.status === "running").length > 0 && !hh(T6, W6)) Mq("tasks");
            else Mq("none");
            return
        }
        if (g && (e2() || sH()) && x5 > 0) {
            if (k3 > tz) M5((_4) => _4 - 1);
            else Mq("none");
            return
        }
        if (g) {
            Mq("none");
            return
        }
        if (!j8) return;
        if (b6.some(Ut)) {
            iK();
            return
        }
        let WA = Rt8(V);
        if (WA > 0 && !e3) {
            D5(!0), y2(WA - 1);
            return
        }
        if (q2 === 0 && !M && !O && H.length > 0 && X === "prompt" && !K1 && hK.current !== G) {
            if (hK.current = G, v()) return
        }
        AP()
    }

    function E$() {
        if (ew.length > 1) return;
        if (!l8) return;
        if (e3) return;
        let y1 = Object.values(T6).filter((H4) => H4.status === "running").length;
        if (g && (e2() || sH()) && x5 > 0) {
            if (k3 < x5 - 1) M5((H4) => H4 + 1);
            return
        }
        if (g) {
            if (u6) Mq("tmux");
            else if (p8.length > 0) qA(!0), Mq("none");
            else if (k6) Mq("bridge");
            return
        }
        if (C6) {
            if (p8.length > 0) qA(!0), Mq("none");
            else if (k6) Mq("bridge");
            return
        }
        if ($4) {
            if (k6) qA(!1), Mq("bridge");
            return
        }
        if (b) return;
        let WA = A2(),
            _4 = p8.length > 0;
        if (WA) {
            if (y1 > 0 && !hh(T6, W6)) {
                if (Mq("tasks"), qA(!1), !X1().hasSeenTasksHint) d1((t5) => {
                    if (t5.hasSeenTasksHint === !0) return t5;
                    return {
                        ...t5,
                        hasSeenTasksHint: !0
                    }
                })
            } else if (u6) Mq("tmux"), qA(!1);
            else if (_4) qA(!0), Mq("none");
            else if (k6) Mq("bridge")
        }
    }
    let [tw, uO] = U7.useState({
        suggestions: [],
        selectedSuggestion: -1,
        commandArgumentHint: void 0
    }), HJ = U7.useCallback((y1) => {
        uO((WA) => typeof y1 === "function" ? y1(WA) : y1)
    }, []), m5 = U7.useCallback(async (y1, WA = !1) => {
        if (y1 = y1.trimEnd(), g || C6 || $4 || b) {
            k(`[onSubmit] early return: footer item selected (tasks=${g} tmux=${C6} teams=${$4} bridge=${b})`);
            return
        }
        let _4 = Object.values(V).some((Wz) => Wz.type === "image"),
            H4 = E6.text;
        if ((y1.trim() === "" || y1 === H4) && H4 && !_4) {
            if (U6.status === "active") {
                a8(), $A(H4, {
                    skipReset: !0
                }), r(H4, {
                    setCursorOffset: O6,
                    clearBuffer: iY,
                    resetHistory: L2
                }, {
                    state: U6,
                    speculationSessionTimeSavedMs: c6,
                    setAppState: R6
                });
                return
            }
            if (E6.shownAt > 0) a8(), y1 = H4
        }
        if (E7()) {
            let Wz = kxq(y1);
            if (Wz) {
                let oN = await Exq(Wz.recipientName, Wz.message, V6, x3);
                if (oN.success) {
                    g4({
                        key: "direct-message-sent",
                        text: `Sent to @${oN.recipientName}`,
                        priority: "immediate",
                        timeoutMs: 3000
                    }), y6(""), O6(0), iY(), L2();
                    return
                } else if (oN.error === "no_team_context");
            }
        }
        if (y1.trim() === "" && !_4) return;
        let fH = tw.suggestions.length > 0 && tw.suggestions.every((Wz) => Wz.description === "directory");
        if (tw.suggestions.length > 0 && !WA && !fH) {
            k(`[onSubmit] early return: suggestions showing (count=${tw.suggestions.length})`);
            return
        }
        if (E6.text && E6.shownAt > 0) $A(y1);
        v4("stash-hint");
        let TH = l94(G6.getState());
        if (E7()) {
            if (TH.type === "viewed" && e) {
                d("tengu_transcript_input_to_teammate", {}), await e(y1, TH.task, {
                    setCursorOffset: O6,
                    clearBuffer: iY,
                    resetHistory: L2
                });
                return
            }
        }
        await r(y1, {
            setCursorOffset: O6,
            clearBuffer: iY,
            resetHistory: L2
        })
    }, [E6, U6, c6, V6, G6, g, C6, $4, b, tw.suggestions, r, e, iY, L2, $A, R6, a8, V, v4]), {
        suggestions: ew,
        selectedSuggestion: WH,
        commandArgumentHint: Dj,
        inlineGhostText: P5,
        maxColumnWidth: ZH
    } = Nbq({
        commands: _,
        onInputChange: y6,
        onSubmit: m5,
        setCursorOffset: O6,
        input: M,
        cursorOffset: w6,
        mode: X,
        agents: w,
        setSuggestionsState: HJ,
        suggestionsState: tw,
        suppressSuggestions: Y6 || q2 > 0,
        markAccepted: a8
    }), ZY = X === "prompt" && ew.length === 0 && o8;
    if (ZY) G7();
    if (E6.text && !o8 && E6.shownAt === 0) F0("timing", E6.text), R6((y1) => ({
        ...y1,
        promptSuggestion: {
            text: null,
            promptId: null,
            shownAt: 0,
            acceptedAt: 0,
            generationRequestId: null
        }
    }));

    function t9(y1, WA, _4, H4, t5) {
        d("tengu_paste_image", {}), P("prompt");
        let fH = T4.current++,
            TH = {
                id: fH,
                type: "image",
                content: y1,
                mediaType: WA || "image/png",
                filename: _4 || "Pasted image",
                dimensions: H4,
                sourcePath: t5
            };
        sZ6(TH), c96(TH), L((Wz) => ({
            ...Wz,
            [fH]: TH
        }))
    }

    function d8(y1) {
        let WA = sY(y1).replace(/\r/g, `
`).replaceAll("\t", "    "),
            _4 = b06(WA),
            H4 = Math.min(Z1 - 10, 2);
        if (WA.length > DG1 || _4 > H4) {
            let t5 = T4.current++,
                fH = {
                    id: t5,
                    type: "text",
                    content: WA
                };
            L((TH) => ({
                ...TH,
                [t5]: fH
            })), VA(JX1(t5, _4))
        } else VA(WA)
    }

    function VA(y1) {
        A9(M, w6, V);
        let WA = M.slice(0, w6) + y1 + M.slice(w6);
        y6(WA), O6(w6 + y1.length)
    }
    let n4 = gC(() => {}, () => f()),
        iK = U7.useCallback(() => {
            let y1 = nP1(M, w6);
            if (!y1) return !1;
            if (y6(y1.text), P("prompt"), O6(y1.cursorOffset), y1.images.length > 0) L((WA) => {
                let _4 = {
                    ...WA
                };
                for (let H4 of y1.images) _4[H4.id] = H4;
                return _4
            });
            return !0
        }, [y6, P, M, w6, L]);
    Mxq(N, function(y1) {
        d("tengu_ext_at_mentioned", {});
        let WA, _4 = juq.relative(G1(), y1.filePath);
        if (y1.lineStart && y1.lineEnd) WA = y1.lineStart === y1.lineEnd ? `@${_4}#L${y1.lineStart} ` : `@${_4}#L${y1.lineStart}-${y1.lineEnd} `;
        else WA = `@${_4} `;
        let H4 = M[w6 - 1] ?? " ";
        if (!/\s/.test(H4)) WA = ` ${WA}`;
        VA(WA)
    });
    let bz = U7.useCallback(() => {
            if (Xz) {
                let y1 = u7();
                if (y1) y6(y1.text), O6(y1.cursorOffset), L(y1.pastedContents)
            }
        }, [Xz, u7, y6, L]),
        m9 = U7.useCallback(() => {
            A9(M, w6, V);
            let y1 = M.slice(0, w6) + `
` + M.slice(w6);
            y6(y1), O6(w6 + 1)
        }, [M, w6, y6, O6, A9, V]),
        C7 = U7.useCallback(async () => {
            d("tengu_external_editor_used", {}), UY(!0);
            try {
                let y1 = await NN(M, V);
                if (y1.error) g4({
                    key: "external-editor-error",
                    text: y1.error,
                    color: "warning",
                    priority: "high"
                });
                if (y1.content !== null && y1.content !== M) A9(M, w6, V), y6(y1.content), O6(y1.content.length)
            } catch (y1) {
                if (y1 instanceof Error) _6(y1);
                g4({
                    key: "external-editor-error",
                    text: `External editor failed: ${_1(y1)}`,
                    color: "warning",
                    priority: "high"
                })
            } finally {
                UY(!1)
            }
        }, [M, w6, V, A9, y6, g4]),
        B5 = U7.useCallback(() => {
            if (M.trim() === "" && W !== void 0) y6(W.text), O6(W.cursorOffset), L(W.pastedContents), Z(void 0);
            else if (M.trim() !== "") Z({
                text: M,
                cursorOffset: w6,
                pastedContents: V
            }), y6(""), O6(0), L({}), d1((y1) => {
                if (y1.hasUsedStash) return y1;
                return {
                    ...y1,
                    hasUsedStash: !0
                }
            })
        }, [M, w6, W, y6, Z, V, L]),
        p3 = U7.useCallback(() => {
            if (Bq((y1) => !y1), s) X6(!1)
        }, [s]),
        R2 = U7.useCallback(() => {
            if (cY((y1) => !y1), s) X6(!1)
        }, [s]),
        Xj = U7.useCallback(() => {
            if (lY((y1) => !y1), s) X6(!1)
        }, [s]),
        GH = U7.useCallback(() => {
            if (E7() && J1 && K1) {
                let H4 = {
                        ...K,
                        mode: J1.permissionMode
                    },
                    t5 = W26(H4, void 0);
                d("tengu_mode_cycle", {
                    to: t5
                });
                let fH = K1;
                if (R6((TH) => {
                        let Wz = TH.tasks[fH];
                        if (!Wz || Wz.type !== "in_process_teammate") return TH;
                        if (Wz.permissionMode === t5) return TH;
                        return {
                            ...TH,
                            tasks: {
                                ...TH.tasks,
                                [fH]: {
                                    ...Wz,
                                    permissionMode: t5
                                }
                            }
                        }
                    }), s) X6(!1);
                return
            }
            let y1 = W26(K, V6),
                WA = !1;
            if (WA = y1 === "auto" && K.mode !== "auto" && !s16() && !K1, WA) {
                if (h1(K.mode), R6((H4) => ({
                        ...H4,
                        toolPermissionContext: {
                            ...H4.toolPermissionContext,
                            mode: "auto"
                        }
                    })), Y({
                        ...K,
                        mode: "auto"
                    }), u1.current) clearTimeout(u1.current);
                if (u1.current = setTimeout((H4, t5) => {
                        H4(!0), t5.current = null
                    }, 400, A1, u1), s) X6(!1);
                return
            }
            if (s6 || u1.current) {
                if (s6) d("tengu_auto_mode_opt_in_dialog_decline", {});
                if (A1(!1), u1.current) clearTimeout(u1.current), u1.current = null;
                h1(null)
            }
            let {
                context: _4
            } = lbq(K, V6);
            if (d("tengu_mode_cycle", {
                    to: y1
                }), y1 === "plan") d1((H4) => ({
                ...H4,
                lastPlanModeUse: Date.now()
            }));
            if (R6((H4) => ({
                    ...H4,
                    toolPermissionContext: {
                        ..._4,
                        mode: y1
                    }
                })), Y({
                    ..._4,
                    mode: y1
                }), ey8(y1, V6?.teamName), s) X6(!1)
        }, [K, V6, K1, J1, R6, Y, s, s6]),
        mO = U7.useCallback(() => {
            {
                A1(!1), h1(null);
                let y1 = ki(f1 ?? K.mode, "auto", K);
                if (R6((WA) => ({
                        ...WA,
                        toolPermissionContext: {
                            ...y1,
                            mode: "auto"
                        }
                    })), Y({
                        ...y1,
                        mode: "auto"
                    }), s) X6(!1)
            }
        }, [s, X6, f1, K, R6, Y]),
        GD = U7.useCallback(() => {
            if (A1(!1), u1.current) clearTimeout(u1.current), u1.current = null;
            if (f1) qF8(!1), R6((y1) => ({
                ...y1,
                toolPermissionContext: {
                    ...y1.toolPermissionContext,
                    mode: f1,
                    isAutoModeAvailable: !1
                }
            })), Y({
                ...K,
                mode: f1,
                isAutoModeAvailable: !1
            }), h1(null)
        }, [f1, K, R6, Y]),
        fM = U7.useCallback(() => {
            oZ6().then((y1) => {
                if (y1) t9(y1.base64, y1.mediaType);
                else {
                    let WA = PX("chat:imagePaste", "Chat", "ctrl+v"),
                        _4 = Q8.isSSH() ? "No image found in clipboard. You're SSH'd; try scp?" : `No image found in clipboard. Use ${WA} to paste images.`;
                    g4({
                        key: "no-image-in-clipboard",
                        text: _4,
                        priority: "immediate",
                        timeoutMs: 1000
                    })
                }
            })
        }, [g4, t9]),
        ez = Wv();
    U7.useEffect(() => {
        if (!ez || o) return;
        return ez.registerHandler({
            action: "chat:submit",
            context: "Chat",
            handler: () => {
                m5(M)
            }
        })
    }, [ez, o, m5, M]);
    let fD = U7.useMemo(() => ({
        "chat:undo": bz,
        "chat:newline": m9,
        "chat:externalEditor": C7,
        "chat:stash": B5,
        "chat:modelPicker": p3,
        "chat:thinkingToggle": Xj,
        "chat:cycleMode": GH,
        "chat:imagePaste": fM
    }), [bz, m9, C7, B5, p3, Xj, GH, fM]);
    tA(fD, {
        context: "Chat",
        isActive: !o && !e3
    }), D8("chat:fastMode", R2, {
        context: "Chat",
        isActive: !o && !e3 && Dq() && yj()
    }), D8("help:dismiss", () => {
        X6(!1)
    }, {
        context: "Help",
        isActive: s
    });
    let eh = !1;
    D8("app:quickOpen", () => {}, {
        context: "Global",
        isActive: eh
    }), D8("app:globalSearch", () => {}, {
        context: "Global",
        isActive: eh
    }), D8("app:interrupt", () => {
        Nb(R6)
    }, {
        context: "Global",
        isActive: !O && U6.status === "active"
    });
    let oZ = Rt8(V);
    tA({
        "attachments:next": () => {
            y2((y1) => y1 < oZ - 1 ? y1 + 1 : 0)
        },
        "attachments:previous": () => {
            y2((y1) => y1 > 0 ? y1 - 1 : oZ - 1)
        },
        "attachments:remove": () => {
            let WA = Object.values(V).filter((H4) => H4.type === "image")[WY];
            if (WA) L((H4) => {
                let t5 = {
                    ...H4
                };
                return delete t5[WA.id], t5
            });
            let _4 = oZ - 1;
            if (_4 === 0) D5(!1), y2(0);
            else y2((H4) => H4 >= _4 ? _4 - 1 : H4)
        },
        "attachments:exit": () => {
            D5(!1)
        }
    }, {
        context: "Attachments",
        isActive: e3 && !o
    });
    let rN = g || C6 || $4 || b;
    tA({
        "footer:next": () => {
            if (g) {
                if (n8) {
                    let y1 = 1 + e8.length;
                    MK((WA) => (WA + 1) % y1);
                    return
                }
                if (u6) Mq("tmux");
                else if (p8.length > 0) qA(!0), Mq("none");
                else if (k6) Mq("bridge")
            } else if (C6) {
                if (p8.length > 0) qA(!0), Mq("none");
                else if (k6) Mq("bridge")
            } else if ($4) {
                if (k6) qA(!1), Mq("bridge")
            }
        },
        "footer:previous": () => {
            if (b)
                if (p8.length > 0) qA(!0), Mq("none");
                else if (u6) Mq("tmux");
            else if (Object.values(T6).filter((WA) => WA.status === "running").length > 0 && !hh(T6, W6)) Mq("tasks");
            else Mq("none");
            else if ($4) {
                if (qA(!1), u6) Mq("tmux");
                else if (Object.values(T6).filter((WA) => WA.status === "running").length > 0 && !hh(T6, W6)) Mq("tasks")
            } else if (C6)
                if (Object.values(T6).filter((WA) => WA.status === "running").length > 0 && !hh(T6, W6)) Mq("tasks");
                else Mq("none");
            else if (g) {
                if (n8) {
                    let y1 = 1 + e8.length;
                    MK((WA) => (WA - 1 + y1) % y1);
                    return
                }
            }
        },
        "footer:openSelected": () => {
            if (j6 === "selecting-agent") return;
            if (g && n8)
                if (F3 === 0) ib(R6);
                else {
                    let y1 = e8[F3 - 1];
                    if (y1) g16(y1.id, R6)
                }
            else if (g) {
                let y1 = Lfz(T6, k3, x5);
                I(y1 ?? !0), Mq("none")
            } else if ($4) W4(!0), qA(!1);
            else if (b) JK(!0), Mq("none")
        },
        "footer:clearSelection": () => {
            Mq("none"), qA(!1)
        }
    }, {
        context: "Footer",
        isActive: rN && !o
    }), jA((y1, WA) => {
        if (d7 || YA || u9) return;
        if (y8() === "macos" && y1 in cp8) {
            let _4 = cp8[y1],
                H4 = NT8();
            g4({
                key: "option-meta-hint",
                jsx: H4 ? A7.createElement(T, {
                    dimColor: !0
                }, "To enable ", _4, ", set ", A7.createElement(T, {
                    bold: !0
                }, "Option as Meta"), " in", " ", H4, " preferences (⌘,)") : A7.createElement(T, {
                    dimColor: !0
                }, "To enable ", _4, ", run /terminal-setup"),
                priority: "immediate",
                timeoutMs: 5000
            })
        }
        if (e3) return;
        if (w6 === 0 && (WA.escape || WA.backspace || WA.delete || WA.ctrl && y1 === "u")) P("prompt"), X6(!1);
        if (s && M === "" && (WA.backspace || WA.delete)) X6(!1);
        if (WA.escape) {
            if (U6.status === "active") {
                Nb(R6);
                return
            }
            if (K6 && J6) {
                J6();
                return
            }
            if (s) {
                X6(!1);
                return
            }
            if (rN) return;
            if (b6.some(Ut)) {
                iK();
                return
            }
            if (H.length > 0 && !M && !O) n4()
        }
        if (WA.return && s) X6(!1)
    });
    let aZ = rxq(),
        jx = Dq() ? Jm() : !1,
        BO = Dq() ? g6 && (yj() || jx) : !1,
        nF = _uq(BO ?? !1),
        I6 = S9q(D1, n);
    U7.useEffect(() => {
        if (!I6) {
            v4("effort-level");
            return
        }
        g4({
            key: "effort-level",
            text: I6,
            priority: "immediate",
            timeoutMs: 20000
        })
    }, [I6, g4, v4]);
    let {
        columns: m6,
        rows: Z1
    } = KA(), M8 = m6 - 3, u8 = U7.useCallback((y1) => {
        if (!M || Y6) return;
        let _4 = RK.fromText(M, M8, 0).measuredText.getOffsetFromPosition({
            line: y1.localRow,
            column: y1.localCol
        });
        O6(_4)
    }, [M, M8, Y6]), W7 = ZY && o8 ? o8 : gq, Hq = U7.useMemo(() => M.includes(`
`), [M]), z5 = U7.useCallback((y1, WA) => {
        let _4 = !1;
        R6((fH) => {
            return _4 = Dq() && !FH(y1) && !!fH.fastMode, {
                ...fH,
                mainLoopModel: y1,
                mainLoopModelForSession: null,
                ..._4 ? {
                    fastMode: !1
                } : {}
            }
        }), Bq(!1);
        let H4 = (g6 ?? !1) && !_4,
            t5 = `Model set to ${oR(y1)}`;
        if (az6(y1, H4, pH())) t5 += " · Billed as extra usage";
        if (_4) t5 += " · Fast mode OFF";
        g4({
            key: "model-switched",
            jsx: A7.createElement(T, null, t5),
            priority: "immediate",
            timeoutMs: 3000
        }), d("tengu_model_picker_hotkey", {
            model: y1
        })
    }, [R6, g4, g6]), GY = U7.useCallback(() => {
        Bq(!1)
    }, []), h2 = U7.useMemo(() => {
        if (!dY) return null;
        return A7.createElement(m, {
            flexDirection: "column",
            marginTop: 1
        }, A7.createElement(fv6, {
            initial: n6,
            sessionModel: d6,
            onSelect: z5,
            onCancel: GY,
            isStandaloneCommand: !0,
            showFastModeNotice: Dq() && g6 && FH(n6) && yj()
        }))
    }, [dY, n6, d6, z5, GY]), S2 = U7.useCallback((y1) => {
        if (cY(!1), y1) g4({
            key: "fast-mode-toggled",
            jsx: A7.createElement(T, null, y1),
            priority: "immediate",
            timeoutMs: 3000
        })
    }, [g4]), Pj = U7.useMemo(() => {
        if (!KK) return null;
        return A7.createElement(m, {
            flexDirection: "column",
            marginTop: 1
        }, A7.createElement(BR1, {
            onDone: S2,
            unavailableReason: ra()
        }))
    }, [KK, S2]), _W = U7.useCallback((y1) => {
        R6((WA) => ({
            ...WA,
            thinkingEnabled: y1
        })), lY(!1), d("tengu_thinking_toggled_hotkey", {
            enabled: y1
        }), g4({
            key: "thinking-toggled-hotkey",
            jsx: A7.createElement(T, {
                color: y1 ? "suggestion" : void 0,
                dimColor: !y1
            }, "Thinking ", y1 ? "on" : "off"),
            priority: "immediate",
            timeoutMs: 3000
        })
    }, [R6, g4]), TD = U7.useCallback(() => {
        lY(!1)
    }, []), sZ = U7.useMemo(() => {
        if (!B4) return null;
        return A7.createElement(m, {
            flexDirection: "column",
            marginTop: 1
        }, A7.createElement(Kuq, {
            currentValue: S6 ?? !0,
            onSelect: _W,
            onCancel: TD,
            isMidConversation: H.some((y1) => y1.type === "assistant")
        }))
    }, [B4, S6, _W, TD, H.length]);
    if (u) return A7.createElement(IR1, {
        onDone: () => {
            I(!1)
        },
        toolUseContext: U(H, [], new AbortController, n),
        initialDetailTaskId: typeof u === "string" ? u : void 0
    });
    if (E7() && d7) return A7.createElement(fxq, {
        initialTeams: p8,
        onDone: () => {
            W4(!1)
        }
    });
    if (h2) return h2;
    if (Pj) return Pj;
    if (sZ) return sZ;
    if (Dz) return A7.createElement(yxq, {
        onDone: () => {
            JK(!1), p(!1)
        }
    });
    let rF = {
            multiline: !0,
            onSubmit: m5,
            onChange: Pz,
            value: U8 ? D36(typeof U8 === "string" ? U8 : U8.display) : M,
            onHistoryUp: xO,
            onHistoryDown: E$,
            onHistoryReset: L2,
            placeholder: W7,
            onExit: Q,
            onExitMessage: (y1, WA) => q6({
                show: y1,
                key: WA
            }),
            onImagePaste: t9,
            columns: M8,
            disableCursorMovementForUpDownKeys: ew.length > 0 || rN,
            disableEscapeDoublePress: ew.length > 0,
            cursorOffset: w6,
            onChangeCursorOffset: O6,
            onPaste: d8,
            onIsPastingChange: J9,
            focus: !Y6 && !e3 && !o,
            showCursor: !g && !C6 && !$4 && !b && !Y6 && !e3,
            argumentHint: Dj,
            onUndo: Xz ? () => {
                let y1 = u7();
                if (y1) y6(y1.text), O6(y1.cursorOffset), L(y1.pastedContents)
            } : void 0,
            highlights: sq,
            inlineGhostText: P5
        },
        oF = () => {
            let y1 = {
                bash: "bashBorder"
            };
            if (y1[X]) return y1[X];
            if (eP()) return "promptBorder";
            let WA = H$();
            if (WA && s$.includes(WA)) return t$[WA];
            return "promptBorder"
        };
    if (sw) return A7.createElement(m, {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderColor: oF(),
        borderStyle: "round",
        borderLeft: !1,
        borderRight: !1,
        borderBottom: !0,
        width: "100%"
    }, A7.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "Save and close editor to continue..."));
    let Jx = X16() ? A7.createElement(Zt8, {
            ...rF,
            initialMode: h,
            onModeChange: R
        }) : A7.createElement(J5, {
            ...rF
        }),
        ri = null;
    if (s6) ri = A7.createElement(fa8, {
        onAccept: mO,
        onDecline: GD
    });
    return A7.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, A7.createElement(dxq, null), z6 && A7.createElement(m, {
        marginTop: 1,
        marginLeft: 2
    }, A7.createElement(T, {
        dimColor: !0
    }, "Waiting for permission…")), A7.createElement(cxq, {
        hasStash: W !== void 0
    }), A7.createElement(axq, {
        pastedContents: V,
        isSelected: e3,
        selectedIndex: WY
    }), aZ ? A7.createElement(A7.Fragment, null, A7.createElement(T, {
        color: aZ.bgColor
    }, aZ.text ? A7.createElement(A7.Fragment, null, "─".repeat(Math.max(0, m6 - f8(aZ.text) - 4)), A7.createElement(T, {
        backgroundColor: aZ.bgColor,
        color: "inverseText"
    }, " ", aZ.text, " "), "──") : "─".repeat(m6)), A7.createElement(m, {
        flexDirection: "row",
        width: "100%"
    }, A7.createElement(Et8, {
        mode: X,
        isLoading: O,
        viewingAgentName: E1,
        viewingAgentColor: K8
    }), A7.createElement(m, {
        flexGrow: 1,
        flexShrink: 1,
        onClick: u8
    }, Jx)), A7.createElement(T, {
        color: aZ.bgColor
    }, "─".repeat(m6))) : A7.createElement(m, {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        borderColor: oF(),
        borderStyle: "round",
        borderLeft: !1,
        borderRight: !1,
        borderBottom: !0,
        width: "100%",
        borderText: Rfz(BO ?? !1, nF, jx)
    }, A7.createElement(Et8, {
        mode: X,
        isLoading: O,
        viewingAgentName: E1,
        viewingAgentColor: K8
    }), A7.createElement(m, {
        flexGrow: 1,
        flexShrink: 1,
        onClick: u8
    }, Jx)), A7.createElement(jxq, {
        apiKeyStatus: z,
        debug: A,
        exitMessage: l,
        vimMode: h,
        mode: X,
        autoUpdaterResult: J,
        isAutoUpdating: a,
        verbose: $,
        onAutoUpdaterResult: j,
        onChangeIsUpdating: i,
        suggestions: ew,
        selectedSuggestion: WH,
        maxColumnWidth: ZH,
        toolPermissionContext: H7,
        helpOpen: s,
        suppressHint: M.length > 0,
        isLoading: O,
        tasksSelected: g,
        teamsSelected: $4,
        bridgeSelected: b,
        tmuxSelected: C6,
        teammateFooterIndex: F3,
        coordinatorTaskIndex: k3,
        ideSelection: q,
        mcpClients: N,
        isPasting: x9,
        isInputWrapped: Hq,
        messages: H,
        isSearching: Y6,
        historyQuery: GA,
        setHistoryQuery: h8,
        historyFailedMatch: P4
    }), ri, null)
}
// @from(Ln 501287, Col 0)
function yfz(A) {
    let q = 0;
    for (let K of A)
        if (K.type === "user") {
            if (K.imagePasteIds) {
                for (let Y of K.imagePasteIds)
                    if (Y > q) q = Y
            }
            if (Array.isArray(K.message.content)) {
                for (let Y of K.message.content)
                    if (Y.type === "text") {
                        let z = x06(Y.text);
                        for (let _ of z)
                            if (_.id > q) q = _.id
                    }
            }
        } return q + 1
}
// @from(Ln 501306, Col 0)
function Lfz(A, q, K) {
    if (K === 0) return;
    let Y = Date.now();
    return Object.values(A).filter((z) => z.type === "local_agent" && (!JN6(z.status) || z.status === "killed" && !!z.endTime && Y - z.endTime < mB)).sort((z, _) => z.startTime - _.startTime)[q]?.id
}
// @from(Ln 501312, Col 0)
function Rfz(A, q, K) {
    if (!A) return;
    return {
        content: ` ${q?`${V_6(!0,K)} ${O1.dim("/fast")}`:V_6(!0,K)} `,
        position: "top",
        align: "end",
        offset: 0
    }
}
// @from(Ln 501321, Col 4)
A7
// @from(Ln 501321, Col 8)
U7
// @from(Ln 501321, Col 12)
Juq
// @from(Ln 501322, Col 4)
Muq = E(() => {
    i6();
    aK();
    LG();
    q3();
    _7();
    Rm();
    Ybq();
    xI1();
    Vbq();
    k8();
    ZI();
    j36();
    AH();
    dbq();
    hv6();
    O0();
    i8();
    D$();
    _q();
    mY6();
    Gt8();
    rJ();
    Jxq();
    k1();
    H1();
    du6();
    V1();
    aZ6();
    d3();
    ld();
    $y1();
    YK();
    J36();
    Dxq();
    lA();
    Pxq();
    Tb();
    jm();
    FZ6();
    Kt8();
    tE1();
    Al8();
    B16();
    Qz();
    Vxq();
    zz();
    vf();
    qZ();
    qH();
    wh();
    Lxq();
    uC1();
    VE();
    H0();
    NA();
    Vt8();
    Fv();
    Yc();
    B16();
    Ixq();
    Bxq();
    Fxq();
    Lt8();
    aH();
    bV6();
    lxq();
    oxq();
    p36();
    wr6();
    sk();
    OK();
    ht8();
    txq();
    wz();
    fZ();
    Auq();
    A16();
    sY6();
    Cy1();
    xy1();
    z4();
    uy1();
    Xl8();
    Yuq();
    ht8();
    Sc();
    FW();
    Ml8();
    wuq();
    s8();
    Ib();
    Ouq();
    Huq();
    A7 = t(P6(), 1), U7 = t(P6(), 1);
    Juq = A7.memo(Efz)
})
// @from(Ln 501420, Col 0)
function hfz(A) {
    return {
        type: "assistant",
        message: A.message,
        uuid: A.uuid,
        requestId: void 0,
        timestamp: new Date().toISOString(),
        error: A.error
    }
}
// @from(Ln 501431, Col 0)
function Sfz(A) {
    return {
        type: "stream_event",
        event: A.event
    }
}
// @from(Ln 501438, Col 0)
function Cfz(A) {
    let q = A.subtype !== "success";
    return {
        type: "system",
        subtype: "informational",
        content: q ? A.errors?.join(", ") || "Unknown error" : "Session completed successfully",
        level: q ? "warning" : "info",
        uuid: A.uuid,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 501450, Col 0)
function Ifz(A) {
    return {
        type: "system",
        subtype: "informational",
        content: `Remote session initialized (model: ${A.model})`,
        level: "info",
        uuid: A.uuid,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 501461, Col 0)
function bfz(A) {
    if (!A.status) return null;
    return {
        type: "system",
        subtype: "informational",
        content: A.status === "compacting" ? "Compacting conversation…" : `Status: ${A.status}`,
        level: "info",
        uuid: A.uuid,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 501473, Col 0)
function xfz(A) {
    return {
        type: "system",
        subtype: "informational",
        content: `Tool ${A.tool_name} running for ${A.elapsed_time_seconds}s…`,
        level: "info",
        uuid: A.uuid,
        timestamp: new Date().toISOString(),
        toolUseID: A.tool_use_id
    }
}
// @from(Ln 501485, Col 0)
function ufz(A) {
    return {
        type: "system",
        subtype: "compact_boundary",
        content: "Conversation compacted",
        level: "info",
        uuid: A.uuid,
        timestamp: new Date().toISOString(),
        compactMetadata: ac8(A.compact_metadata)
    }
}
// @from(Ln 501497, Col 0)
function xV6(A, q) {
    switch (A.type) {
        case "assistant":
            return {
                type: "message", message: hfz(A)
            };
        case "user": {
            let K = A.message?.content,
                Y = Array.isArray(K) && K.some((z) => z.type === "tool_result");
            if (q?.convertToolResults && Y) return {
                type: "message",
                message: p1({
                    content: K,
                    toolUseResult: A.tool_use_result,
                    uuid: A.uuid
                })
            };
            if (q?.convertUserTextMessages && !Y) {
                if (typeof K === "string" || Array.isArray(K)) return {
                    type: "message",
                    message: p1({
                        content: K,
                        toolUseResult: A.tool_use_result,
                        uuid: A.uuid
                    })
                }
            }
            return {
                type: "ignored"
            }
        }
        case "stream_event":
            return {
                type: "stream_event", event: Sfz(A)
            };
        case "result":
            if (A.subtype !== "success") return {
                type: "message",
                message: Cfz(A)
            };
            return {
                type: "ignored"
            };
        case "system":
            if (A.subtype === "init") return {
                type: "message",
                message: Ifz(A)
            };
            if (A.subtype === "status") {
                let K = bfz(A);
                return K ? {
                    type: "message",
                    message: K
                } : {
                    type: "ignored"
                }
            }
            if (A.subtype === "compact_boundary") return {
                type: "message",
                message: ufz(A)
            };
            return k(`[sdkMessageAdapter] Ignoring system message subtype: ${A.subtype}`), {
                type: "ignored"
            };
        case "tool_progress":
            return {
                type: "message", message: xfz(A)
            };
        case "auth_status":
            return k("[sdkMessageAdapter] Ignoring auth_status message"), {
                type: "ignored"
            };
        case "tool_use_summary":
            return k("[sdkMessageAdapter] Ignoring tool_use_summary message"), {
                type: "ignored"
            };
        case "rate_limit_event":
            return k("[sdkMessageAdapter] Ignoring rate_limit_event message"), {
                type: "ignored"
            };
        default:
            return k(`[sdkMessageAdapter] Unknown message type: ${A.type}`), {
                type: "ignored"
            }
    }
}
// @from(Ln 501584, Col 0)
function uV6(A) {
    return A.type === "result"
}
// @from(Ln 501587, Col 4)
Ab1 = E(() => {
    JA();
    jN6();
    H1()
})
// @from(Ln 501593, Col 0)
function Duq({
    config: A,
    setMessages: q,
    setIsLoading: K,
    onInit: Y,
    setToolUseConfirmQueue: z,
    tools: _,
    setStreamingToolUses: w,
    setStreamMode: O,
    setInProgressToolUseIDs: $
}) {
    let H = !!A,
        j = YT.useRef(null),
        J = YT.useRef(null),
        M = YT.useRef(!1),
        D = YT.useRef(new Set),
        X = YT.useRef(_);
    YT.useEffect(() => {
        X.current = _
    }, [_]), YT.useEffect(() => {
        if (!A) return;
        k(`[useRemoteSession] Initializing for session ${A.sessionId}`);
        let G = new ba8(A, {
            onMessage: (f) => {
                let v = [`type=${f.type}`];
                if ("subtype" in f) v.push(`subtype=${f.subtype}`);
                if (f.type === "user") {
                    let V = f.message?.content;
                    v.push(`content=${Array.isArray(V)?V.map((L)=>L.type).join(","):typeof V}`)
                }
                if (k(`[useRemoteSession] Received ${v.join(" ")}`), j.current) clearTimeout(j.current), j.current = null;
                if (f.type === "user" && f.uuid && D.current.has(f.uuid)) {
                    k(`[useRemoteSession] Dropping echoed user message ${f.uuid}`), D.current.delete(f.uuid);
                    return
                }
                if (f.type === "system" && f.subtype === "init" && Y) k(`[useRemoteSession] Init received with ${f.slash_commands.length} slash commands`), Y(f.slash_commands);
                if (uV6(f)) K(!1);
                let N = xV6(f, A.viewerOnly ? {
                    convertToolResults: !0,
                    convertUserTextMessages: !0
                } : void 0);
                if (N.type === "message") {
                    if (w?.((V) => V.length > 0 ? [] : V), $ && N.message.type === "assistant") {
                        let V = N.message.message.content.filter((L) => L.type === "tool_use").map((L) => L.id);
                        if (V.length > 0) $((L) => {
                            let h = new Set(L);
                            for (let R of V) h.add(R);
                            return h
                        })
                    }
                    q((V) => [...V, N.message])
                } else if (N.type === "stream_event")
                    if (w && O) xN6(N.event, (V) => q((L) => [...L, V]), () => {}, O, w);
                    else k("[useRemoteSession] Stream event received but streaming callbacks not provided")
            },
            onPermissionRequest: (f, v) => {
                if (A.viewerOnly) {
                    k(`[useRemoteSession] Ignoring permission request in viewerOnly mode: ${f.tool_name}`);
                    return
                }
                k(`[useRemoteSession] Permission request for tool: ${f.tool_name}`);
                let N = dK(X.current, f.tool_name) ?? I66(f.tool_name),
                    V = C66(f, v),
                    L = {
                        behavior: "ask",
                        message: f.description ?? `${f.tool_name} requires permission`,
                        suggestions: f.permission_suggestions,
                        blockedPath: f.blocked_path
                    },
                    h = {
                        assistantMessage: V,
                        tool: N,
                        description: f.description ?? `${f.tool_name} requires permission`,
                        input: f.input,
                        toolUseContext: {},
                        toolUseID: f.tool_use_id,
                        permissionResult: L,
                        permissionPromptStartTimeMs: Date.now(),
                        onUserInteraction() {},
                        onAbort() {
                            let R = {
                                behavior: "deny",
                                message: "User aborted"
                            };
                            G.respondToPermissionRequest(v, R), z((u) => u.filter((I) => I.toolUseID !== f.tool_use_id))
                        },
                        onAllow(R, u, I) {
                            let g = {
                                behavior: "allow",
                                updatedInput: R
                            };
                            G.respondToPermissionRequest(v, g), z((B) => B.filter((b) => b.toolUseID !== f.tool_use_id)), K(!0)
                        },
                        onReject(R) {
                            let u = {
                                behavior: "deny",
                                message: R ?? "User denied permission"
                            };
                            G.respondToPermissionRequest(v, u), z((I) => I.filter((g) => g.toolUseID !== f.tool_use_id))
                        },
                        async recheckPermission() {}
                    };
                z((R) => [...R, h]), K(!1)
            },
            onConnected: () => {
                k("[useRemoteSession] Connected")
            },
            onDisconnected: () => {
                k("[useRemoteSession] Disconnected"), K(!1)
            },
            onError: (f) => {
                k(`[useRemoteSession] Error: ${f.message}`)
            }
        });
        return J.current = G, G.connect(), () => {
            if (k("[useRemoteSession] Cleanup - disconnecting"), j.current) clearTimeout(j.current), j.current = null;
            G.disconnect(), J.current = null
        }
    }, [A, q, K, Y, z, w, O, $]);
    let P = YT.useCallback(async (G, f) => {
            let v = J.current;
            if (!v) return k("[useRemoteSession] Cannot send - no manager"), !1;
            if (j.current) clearTimeout(j.current);
            if (K(!0), f?.uuid) D.current.add(f.uuid);
            let N = await v.sendMessage(G, f);
            if (!N) {
                if (f?.uuid) D.current.delete(f.uuid);
                return K(!1), !1
            }
            if (!M.current && A && !A.hasInitialPrompt && !A.viewerOnly) {
                M.current = !0;
                let V = A.sessionId,
                    L = typeof G === "string" ? G : G.filter((h) => h.type === "text").map((h) => h.text).join(" ");
                if (L) wI1(L, new AbortController().signal).then((h) => {
                    Ax8(V, h ?? jq(L, 75))
                })
            }
            if (!A?.viewerOnly) j.current = setTimeout((V, L) => {
                k("[useRemoteSession] Response timeout - attempting reconnect");
                let h = P$("Remote session may be unresponsive. Attempting to reconnect…", "warning");
                V((R) => [...R, h]), L.reconnect()
            }, mfz, q, v);
            return N
        }, [A, K, q]),
        W = YT.useCallback(() => {
            if (j.current) clearTimeout(j.current), j.current = null;
            if (!A?.viewerOnly) J.current?.cancelSession();
            K(!1)
        }, [A, K]),
        Z = YT.useCallback(() => {
            if (j.current) clearTimeout(j.current), j.current = null;
            J.current?.disconnect(), J.current = null
        }, []);
    return YT.useMemo(() => ({
        isRemoteMode: H,
        sendMessage: P,
        cancelRequest: W,
        disconnect: Z
    }), [H, P, W, Z])
}
// @from(Ln 501753, Col 4)
YT
// @from(Ln 501753, Col 8)
mfz = 60000
// @from(Ln 501754, Col 4)
Xuq = E(() => {
    xa8();
    Ab1();
    H1();
    JA();
    EZ();
    _s8();
    M4();
    Xl6();
    YT = t(P6(), 1)
})
// @from(Ln 501766, Col 0)
function Bfz(A) {
    return typeof A === "object" && A !== null && "type" in A && typeof A.type === "string"
}
// @from(Ln 501769, Col 0)
class Ct8 {
    ws = null;
    config;
    callbacks;
    constructor(A, q) {
        this.config = A, this.callbacks = q
    }
    connect() {
        let A = {};
        if (this.config.authToken) A.authorization = `Bearer ${this.config.authToken}`;
        this.ws = new WebSocket(this.config.wsUrl, {
            headers: A
        }), this.ws.addEventListener("open", () => {
            this.callbacks.onConnected?.()
        }), this.ws.addEventListener("message", (q) => {
            let Y = (typeof q.data === "string" ? q.data : "").split(`
`).filter((z) => z.trim());
            for (let z of Y) {
                let _;
                try {
                    _ = i1(z)
                } catch {
                    continue
                }
                if (!Bfz(_)) continue;
                let w = _;
                if (w.type === "control_request") {
                    if (w.request.subtype === "can_use_tool") this.callbacks.onPermissionRequest(w.request, w.request_id);
                    else k(`[DirectConnect] Unsupported control request subtype: ${w.request.subtype}`), this.sendErrorResponse(w.request_id, `Unsupported control request subtype: ${w.request.subtype}`);
                    continue
                }
                if (w.type !== "control_response" && w.type !== "keep_alive" && w.type !== "control_cancel_request" && w.type !== "streamlined_text" && w.type !== "streamlined_tool_use_summary") this.callbacks.onMessage(w)
            }
        }), this.ws.addEventListener("close", () => {
            this.callbacks.onDisconnected?.()
        }), this.ws.addEventListener("error", () => {
            this.callbacks.onError?.(Error("WebSocket connection error"))
        })
    }
    sendMessage(A) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return !1;
        let q = B6({
            type: "user",
            message: {
                role: "user",
                content: A
            },
            parent_tool_use_id: null,
            session_id: ""
        });
        return this.ws.send(q), !0
    }
    respondToPermissionRequest(A, q) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        let K = B6({
            type: "control_response",
            response: {
                subtype: "success",
                request_id: A,
                response: {
                    behavior: q.behavior,
                    ...q.behavior === "allow" ? {
                        updatedInput: q.updatedInput
                    } : {
                        message: q.message
                    }
                }
            }
        });
        this.ws.send(K)
    }
    sendInterrupt() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        let A = B6({
            type: "control_request",
            request_id: crypto.randomUUID(),
            request: {
                subtype: "interrupt"
            }
        });
        this.ws.send(A)
    }
    sendErrorResponse(A, q) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        let K = B6({
            type: "control_response",
            response: {
                subtype: "error",
                request_id: A,
                error: q
            }
        });
        this.ws.send(K)
    }
    disconnect() {
        if (this.ws) this.ws.close(), this.ws = null
    }
    isConnected() {
        return this.ws?.readyState === WebSocket.OPEN
    }
}
// @from(Ln 501870, Col 4)
Puq = E(() => {
    g1();
    H1()
})
// @from(Ln 501875, Col 0)
function Wuq({
    config: A,
    setMessages: q,
    setIsLoading: K,
    setToolUseConfirmQueue: Y,
    tools: z
}) {
    let _ = !!A,
        w = lN.useRef(null),
        O = lN.useRef(!1),
        $ = lN.useRef(!1),
        H = lN.useRef(z);
    lN.useEffect(() => {
        H.current = z
    }, [z]), lN.useEffect(() => {
        if (!A) return;
        O.current = !1, k(`[useDirectConnect] Connecting to ${A.wsUrl}`);
        let D = new Ct8(A, {
            onMessage: (X) => {
                if (uV6(X)) K(!1);
                if (X.type === "system" && X.subtype === "init") {
                    if (O.current) return;
                    O.current = !0
                }
                let P = xV6(X, {
                    convertToolResults: !0
                });
                if (P.type === "message") q((W) => [...W, P.message])
            },
            onPermissionRequest: (X, P) => {
                k(`[useDirectConnect] Permission request for tool: ${X.tool_name}`);
                let W = dK(H.current, X.tool_name) ?? I66(X.tool_name),
                    Z = C66(X, P),
                    G = {
                        behavior: "ask",
                        message: X.description ?? `${X.tool_name} requires permission`,
                        suggestions: X.permission_suggestions,
                        blockedPath: X.blocked_path
                    },
                    f = {
                        assistantMessage: Z,
                        tool: W,
                        description: X.description ?? `${X.tool_name} requires permission`,
                        input: X.input,
                        toolUseContext: {},
                        toolUseID: X.tool_use_id,
                        permissionResult: G,
                        permissionPromptStartTimeMs: Date.now(),
                        onUserInteraction() {},
                        onAbort() {
                            let v = {
                                behavior: "deny",
                                message: "User aborted"
                            };
                            D.respondToPermissionRequest(P, v), Y((N) => N.filter((V) => V.toolUseID !== X.tool_use_id))
                        },
                        onAllow(v, N, V) {
                            let L = {
                                behavior: "allow",
                                updatedInput: v
                            };
                            D.respondToPermissionRequest(P, L), Y((h) => h.filter((R) => R.toolUseID !== X.tool_use_id)), K(!0)
                        },
                        onReject(v) {
                            let N = {
                                behavior: "deny",
                                message: v ?? "User denied permission"
                            };
                            D.respondToPermissionRequest(P, N), Y((V) => V.filter((L) => L.toolUseID !== X.tool_use_id))
                        },
                        async recheckPermission() {}
                    };
                Y((v) => [...v, f]), K(!1)
            },
            onConnected: () => {
                k("[useDirectConnect] Connected"), $.current = !0
            },
            onDisconnected: () => {
                if (k("[useDirectConnect] Disconnected"), !$.current) process.stderr.write(`
Failed to connect to server at ${A.wsUrl}
`);
                else process.stderr.write(`
Server disconnected.
`);
                $.current = !1, Vq(1), K(!1)
            },
            onError: (X) => {
                k(`[useDirectConnect] Error: ${X.message}`)
            }
        });
        return w.current = D, D.connect(), () => {
            k("[useDirectConnect] Cleanup - disconnecting"), D.disconnect(), w.current = null
        }
    }, [A, q, K, Y]);
    let j = lN.useCallback(async (D) => {
            let X = w.current;
            if (!X) return !1;
            return K(!0), X.sendMessage(D)
        }, [K]),
        J = lN.useCallback(() => {
            w.current?.sendInterrupt(), K(!1)
        }, [K]),
        M = lN.useCallback(() => {
            w.current?.disconnect(), w.current = null, $.current = !1
        }, []);
    return lN.useMemo(() => ({
        isRemoteMode: _,
        sendMessage: j,
        cancelRequest: J,
        disconnect: M
    }), [_, j, J, M])
}
// @from(Ln 501987, Col 4)
lN
// @from(Ln 501988, Col 4)
Zuq = E(() => {
    Puq();
    Ab1();
    H1();
    c_();
    Xl6();
    lN = t(P6(), 1)
})
// @from(Ln 502000, Col 0)
function Guq({
    session: A,
    setMessages: q,
    setIsLoading: K,
    setToolUseConfirmQueue: Y,
    tools: z
}) {
    let _ = !!A,
        w = iN.useRef(null),
        O = iN.useRef(!1),
        $ = iN.useRef(!1),
        H = iN.useRef(z);
    iN.useEffect(() => {
        H.current = z
    }, [z]), iN.useEffect(() => {
        if (!A) return;
        O.current = !1, k("[useSSHSession] wiring SSH session manager");
        let D = A.createManager({
            onMessage: (X) => {
                if (uV6(X)) K(!1);
                if (X.type === "system" && X.subtype === "init") {
                    if (O.current) return;
                    O.current = !0
                }
                let P = xV6(X, {
                    convertToolResults: !0
                });
                if (P.type === "message") q((W) => [...W, P.message])
            },
            onPermissionRequest: (X, P) => {
                k(`[useSSHSession] permission request: ${X.tool_name}`);
                let W = dK(H.current, X.tool_name) ?? I66(X.tool_name),
                    Z = C66(X, P),
                    G = {
                        behavior: "ask",
                        message: X.description ?? `${X.tool_name} requires permission`,
                        suggestions: X.permission_suggestions,
                        blockedPath: X.blocked_path
                    },
                    f = {
                        assistantMessage: Z,
                        tool: W,
                        description: X.description ?? `${X.tool_name} requires permission`,
                        input: X.input,
                        toolUseContext: {},
                        toolUseID: X.tool_use_id,
                        permissionResult: G,
                        permissionPromptStartTimeMs: Date.now(),
                        onUserInteraction() {},
                        onAbort() {
                            D.respondToPermissionRequest(P, {
                                behavior: "deny",
                                message: "User aborted"
                            }), Y((v) => v.filter((N) => N.toolUseID !== X.tool_use_id))
                        },
                        onAllow(v) {
                            D.respondToPermissionRequest(P, {
                                behavior: "allow",
                                updatedInput: v
                            }), Y((N) => N.filter((V) => V.toolUseID !== X.tool_use_id)), K(!0)
                        },
                        onReject(v) {
                            D.respondToPermissionRequest(P, {
                                behavior: "deny",
                                message: v ?? "User denied permission"
                            }), Y((N) => N.filter((V) => V.toolUseID !== X.tool_use_id))
                        },
                        async recheckPermission() {}
                    };
                Y((v) => [...v, f]), K(!1)
            },
            onConnected: () => {
                k("[useSSHSession] connected"), $.current = !0
            },
            onReconnecting: (X, P) => {
                k(`[useSSHSession] ssh dropped, reconnecting (${X}/${P})`), $.current = !1, K(!1);
                let W = {
                    type: "system",
                    subtype: "informational",
                    content: `SSH connection dropped — reconnecting (attempt ${X}/${P})...`,
                    timestamp: new Date().toISOString(),
                    uuid: gfz(),
                    level: "warning"
                };
                q((Z) => [...Z, W])
            },
            onDisconnected: () => {
                k("[useSSHSession] ssh process exited (giving up)");
                let X = A.getStderrTail().trim(),
                    P = $.current,
                    W = A.proc.exitCode;
                $.current = !1, K(!1);
                let Z = P ? "Remote session ended." : "SSH session failed before connecting.";
                if (X && (!P || W !== 0)) Z += `
Remote stderr (exit ${W??"signal "+A.proc.signalCode}):
${X}`;
                Vq(1, "other", {
                    finalMessage: Z
                })
            },
            onError: (X) => {
                k(`[useSSHSession] error: ${X.message}`)
            }
        });
        return w.current = D, D.connect(), () => {
            k("[useSSHSession] cleanup"), D.disconnect(), A.proxy.stop(), w.current = null
        }
    }, [A, q, K, Y]);
    let j = iN.useCallback(async (D) => {
            let X = w.current;
            if (!X) return !1;
            return K(!0), X.sendMessage(D)
        }, [K]),
        J = iN.useCallback(() => {
            w.current?.sendInterrupt(), K(!1)
        }, [K]),
        M = iN.useCallback(() => {
            w.current?.disconnect(), w.current = null, $.current = !1
        }, []);
    return iN.useMemo(() => ({
        isRemoteMode: _,
        sendMessage: j,
        cancelRequest: J,
        disconnect: M
    }), [_, j, J, M])
}
// @from(Ln 502126, Col 4)
iN
// @from(Ln 502127, Col 4)
fuq = E(() => {
    Ab1();
    H1();
    c_();
    Xl6();
    iN = t(P6(), 1)
})
// @from(Ln 502135, Col 0)
function Tuq(A) {
    let q = A6(14),
        {
            onSelect: K,
            inputValue: Y,
            setInputValue: z,
            message: _
        } = A,
        w = _ === void 0 ? Ufz : _,
        O = ya6.useRef(Y),
        $ = ya6.useRef(null),
        H, j;
    if (q[0] !== Y || q[1] !== K || q[2] !== z) H = () => {
        if ($.current !== null) clearTimeout($.current), $.current = null;
        if (Y !== O.current) {
            let G = MC(Y.slice(-1));
            if (qb1(G)) {
                let f = Y.slice(0, -1),
                    v = pfz[G];
                $.current = setTimeout(dfz, Qfz, $, z, f, K, v)
            }
        }
        return () => {
            if ($.current !== null) clearTimeout($.current), $.current = null
        }
    }, j = [Y, K, z], q[0] = Y, q[1] = K, q[2] = z, q[3] = H, q[4] = j;
    else H = q[3], j = q[4];
    ya6.useEffect(H, j);
    let J;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) J = eX.default.createElement(T, {
        color: "ansi:cyan"
    }, "● "), q[5] = J;
    else J = q[5];
    let M;
    if (q[6] !== w) M = eX.default.createElement(m, null, J, eX.default.createElement(T, {
        bold: !0
    }, w)), q[6] = w, q[7] = M;
    else M = q[7];
    let D;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) D = eX.default.createElement(m, {
        width: 10
    }, eX.default.createElement(T, null, eX.default.createElement(T, {
        color: "ansi:cyan"
    }, "1"), ": Bad")), q[8] = D;
    else D = q[8];
    let X;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) X = eX.default.createElement(m, {
        width: 10
    }, eX.default.createElement(T, null, eX.default.createElement(T, {
        color: "ansi:cyan"
    }, "2"), ": Fine")), q[9] = X;
    else X = q[9];
    let P;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) P = eX.default.createElement(m, {
        width: 10
    }, eX.default.createElement(T, null, eX.default.createElement(T, {
        color: "ansi:cyan"
    }, "3"), ": Good")), q[10] = P;
    else P = q[10];
    let W;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) W = eX.default.createElement(m, {
        marginLeft: 2
    }, D, X, P, eX.default.createElement(m, null, eX.default.createElement(T, null, eX.default.createElement(T, {
        color: "ansi:cyan"
    }, "0"), ": Dismiss"))), q[11] = W;
    else W = q[11];
    let Z;
    if (q[12] !== M) Z = eX.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, M, W), q[12] = M, q[13] = Z;
    else Z = q[13];
    return Z
}
// @from(Ln 502210, Col 0)
function dfz(A, q, K, Y, z) {
    A.current = null, q(K), Y(z)
}
// @from(Ln 502213, Col 4)
eX
// @from(Ln 502213, Col 8)
ya6
// @from(Ln 502213, Col 13)
Ffz
// @from(Ln 502213, Col 18)
pfz
// @from(Ln 502213, Col 23)
qb1 = (A) => Ffz.includes(A)
// @from(Ln 502214, Col 4)
Qfz = 200
// @from(Ln 502215, Col 4)
Ufz = "How is Claude doing this session? (optional)"
// @from(Ln 502216, Col 4)
It8 = E(() => {
    e6();
    i6();
    eX = t(P6(), 1), ya6 = t(P6(), 1), Ffz = ["0", "1", "2", "3"], pfz = {
        "0": "dismissed",
        "1": "bad",
        "2": "fine",
        "3": "good"
    }
})
// @from(Ln 502226, Col 4)
bt8
// @from(Ln 502227, Col 4)
vuq = E(() => {
    e6();
    i6();
    It8();
    qw();
    bt8 = t(P6(), 1)
})
// @from(Ln 502235, Col 0)
function Nuq(A) {
    let q = M1(($) => $.skillImprovement.suggestion),
        K = xA(),
        [Y, z] = V26.useState(!1),
        _ = V26.useRef(q),
        w = V26.useRef(!1);
    if (q) _.current = q;
    if (q && !Y) {
        if (z(!0), !w.current) w.current = !0, d("tengu_skill_improvement_survey", {
            event_type: "appeared",
            skill_name: q.skillName ?? "unknown"
        })
    }
    let O = V26.useCallback(($) => {
        let H = _.current;
        if (!H) return;
        let j = $ !== "dismissed";
        if (d("tengu_skill_improvement_survey", {
                event_type: "responded",
                response: j ? "applied" : "dismissed",
                skill_name: H.skillName
            }), j) NRq(H.skillName, H.updates).then(() => {
            A((J) => [...J, P$(`Skill "${H.skillName}" updated with improvements.`, "suggestion")])
        });
        z(!1), w.current = !1, K((J) => {
            if (!J.skillImprovement.suggestion) return J;
            return {
                ...J,
                skillImprovement: {
                    suggestion: null
                }
            }
        })
    }, [K, A]);
    return {
        isOpen: Y,
        suggestion: _.current,
        handleSelect: O
    }
}
// @from(Ln 502275, Col 4)
V26
// @from(Ln 502276, Col 4)
Vuq = E(() => {
    NA();
    V1();
    Fa8();
    JA();
    V26 = t(P6(), 1)
})
// @from(Ln 502284, Col 0)
function Euq(A) {
    kuq.useEffect(() => {
        let q = () => {
            if (No6()) process.stdout.write(`
` + a21() + `
`);
            o21(A?.())
        };
        return process.on("exit", q), () => {
            process.off("exit", q)
        }
    }, [])
}
// @from(Ln 502297, Col 4)
kuq
// @from(Ln 502298, Col 4)
yuq = E(() => {
    k8();
    $k();
    kuq = t(P6(), 1)
})
// @from(Ln 502304, Col 0)
function Ruq() {
    Luq.useEffect(() => {
        let A = Math.round(process.uptime() * 1000);
        d("tengu_timer", {
            event: "startup",
            durationMs: A
        })
    }, [])
}
// @from(Ln 502313, Col 4)
Luq
// @from(Ln 502314, Col 4)
huq = E(() => {
    V1();
    A8();
    Luq = t(P6(), 1)
})
// @from(Ln 502320, Col 0)
function Suq(A, q) {
    let K = k26.useRef(A ?? null),
        Y = k26.useRef(!A);
    return k26.useEffect(() => {
        let z = K.current;
        if (!z) return;
        let _ = !1;
        return z.then((w) => {
            if (_) return;
            if (Y.current = !0, K.current = null, w.length > 0) q((O) => [...w, ...O])
        }), () => {
            _ = !0
        }
    }, [q]), k26.useCallback(async () => {
        if (Y.current || !K.current) return;
        let z = await K.current;
        if (Y.current) return;
        if (Y.current = !0, K.current = null, z.length > 0) q((_) => [...z, ..._])
    }, [q])
}
// @from(Ln 502340, Col 4)
k26
// @from(Ln 502341, Col 4)
Cuq = E(() => {
    k26 = t(P6(), 1)
})
// @from(Ln 502345, Col 0)
function Iuq() {
    let [A, q] = La6.useState(() => {
        if (!iH() || iA()) return "valid";
        let {
            key: _,
            source: w
        } = s2({
            skipRetrievingKeyFromApiKeyHelper: !0
        });
        if (_ || w === "apiKeyHelper") return "loading";
        return "missing"
    }), [K, Y] = La6.useState(null), z = La6.useCallback(async () => {
        if (!iH() || iA()) {
            q("valid");
            return
        }
        let {
            key: _,
            source: w
        } = s2();
        if (!_) {
            if (w === "apiKeyHelper") {
                q("error"), Y(Error("API key helper did not return a valid key"));
                return
            }
            q("missing");
            return
        }
        try {
            let $ = await uGq(_, !1) ? "valid" : "invalid";
            q($);
            return
        } catch (O) {
            Y(O), q("error");
            return
        }
    }, []);
    return {
        status: A,
        reverify: z,
        error: K
    }
}
// @from(Ln 502388, Col 4)
La6
// @from(Ln 502389, Col 4)
buq = E(() => {
    gw();
    fA();
    La6 = t(P6(), 1)
})
// @from(Ln 502394, Col 4)
xuq = E(() => {
    bU();
    H1();
    lA();
    KY();
    T1()
})
// @from(Ln 502402, Col 0)
function xt8({
    screen: A,
    setScreen: q,
    showAllInTranscript: K,
    setShowAllInTranscript: Y,
    messageCount: z,
    onEnterTranscript: _,
    onExitTranscript: w,
    virtualScrollActive: O
}) {
    let $ = M1((f) => f.expandedView),
        H = xA(),
        j = S5(),
        J = E26.useCallback(() => {
            d("tengu_toggle_todos", {
                is_expanded: $ === "tasks"
            }), H((f) => {
                let {
                    getAllInProcessTeammateTasks: v
                } = (sk(), k4(KZ4));
                if (v(f.tasks).filter((V) => V.status === "running").length > 0) switch (f.expandedView) {
                    case "none":
                        return {
                            ...f, expandedView: "tasks"
                        };
                    case "tasks":
                        return {
                            ...f, expandedView: "teammates"
                        };
                    case "teammates":
                        return {
                            ...f, expandedView: "none"
                        }
                }
                return {
                    ...f,
                    expandedView: f.expandedView === "tasks" ? "none" : "tasks"
                }
            })
        }, [$, H]),
        M = M1((f) => f.isBriefOnly),
        D = E26.useCallback(() => {
            {
                let {
                    isBriefEnabled: v
                } = (qF(), k4(xl));
                if (!v() && M && A !== "transcript") {
                    H((N) => {
                        if (!N.isBriefOnly) return N;
                        return {
                            ...N,
                            isBriefOnly: !1
                        }
                    });
                    return
                }
            }
            let f = A !== "transcript";
            if (d("tengu_toggle_transcript", {
                    is_entering: f,
                    show_all: K,
                    message_count: z
                }), q((v) => v === "transcript" ? "prompt" : "transcript"), Y(!1), f && _) _();
            if (!f && w) w()
        }, [A, q, M, K, Y, z, H, _, w]),
        X = E26.useCallback(() => {
            d("tengu_transcript_toggle_show_all", {
                is_expanding: !K,
                message_count: z
            }), Y((f) => !f)
        }, [K, Y, z]),
        P = E26.useCallback(() => {
            if (d("tengu_transcript_exit", {
                    show_all: K,
                    message_count: z
                }), q("prompt"), Y(!1), w) w()
        }, [q, K, Y, z, H, w]),
        W = E26.useCallback(() => {
            {
                let {
                    isBriefEnabled: f
                } = (qF(), k4(xl));
                if (!f() && !M) return;
                let v = !M;
                d("tengu_brief_mode_toggled", {
                    enabled: v,
                    gated: !1,
                    source: "keybinding"
                }), H((N) => {
                    if (N.isBriefOnly === v) return N;
                    return {
                        ...N,
                        isBriefOnly: v
                    }
                })
            }
        }, [M, H]);
    D8("app:toggleTodos", J, {
        context: "Global"
    }), D8("app:toggleTranscript", D, {
        context: "Global"
    }), D8("app:toggleBrief", W, {
        context: "Global"
    }), D8("app:toggleTeammatePreview", () => {
        H((f) => ({
            ...f,
            showTeammateMessagePreview: !f.showTeammateMessagePreview
        }))
    }, {
        context: "Global"
    });
    let Z = E26.useCallback(() => {}, []);
    D8("app:toggleTerminal", Z, {
        context: "Global"
    });
    let G = A === "transcript";
    return D8("transcript:toggleShowAll", X, {
        context: "Transcript",
        isActive: G && !O
    }), D8("transcript:exit", P, {
        context: "Transcript",
        isActive: G
    }), null
}
// @from(Ln 502526, Col 4)
E26
// @from(Ln 502527, Col 4)
uuq = E(() => {
    _7();
    NA();
    V1();
    HA();
    xuq();
    E26 = t(P6(), 1)
})
// @from(Ln 502536, Col 0)
function ut8(A) {
    let q = A6(8),
        {
            onSubmit: K,
            isActive: Y
        } = A,
        z = Y === void 0 ? !0 : Y,
        _ = Wv(),
        w = he(),
        O;
    A: {
        if (!_) {
            let X;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) X = new Set, q[0] = X;
            else X = q[0];
            O = X;
            break A
        }
        let D;
        if (q[1] !== _.bindings) {
            D = new Set;
            for (let X of _.bindings)
                if (X.action?.startsWith("command:")) D.add(X.action);
            q[1] = _.bindings, q[2] = D
        } else D = q[2];O = D
    }
    let $ = O,
        H;
    if (q[3] !== $ || q[4] !== K) {
        H = {};
        for (let D of $) {
            let X = D.slice(8);
            H[D] = () => {
                K(`/${X}`, cfz, void 0, {
                    fromKeybinding: !0
                })
            }
        }
        q[3] = $, q[4] = K, q[5] = H
    } else H = q[5];
    let j = H,
        J = z && !w,
        M;
    if (q[6] !== J) M = {
        context: "Chat",
        isActive: J
    }, q[6] = J, q[7] = M;
    else M = q[7];
    return tA(j, M), null
}
// @from(Ln 502586, Col 4)
cfz
// @from(Ln 502587, Col 4)
muq = E(() => {
    e6();
    _7();
    Rm();
    fZ();
    cfz = {
        setCursorOffset: () => {},
        clearBuffer: () => {},
        resetHistory: () => {}
    }
})
// @from(Ln 502599, Col 0)
function mt8(A) {
    let {
        setToolUseConfirmQueue: q,
        onCancel: K,
        onAgentsKilled: Y,
        isMessageSelectorVisible: z,
        screen: _,
        abortSignal: w,
        popCommandFromQueue: O,
        vimMode: $,
        isLocalJSXCommand: H,
        isSearchingHistory: j,
        isHelpOpen: J,
        inputMode: M,
        inputValue: D,
        streamMode: X
    } = A, P = S5(), W = xA(), Z = UF().length, {
        addNotification: G,
        removeNotification: f
    } = o4(), v = Ra6.useRef(0), N = void 0, V = M1((e) => e.viewSelectionMode), L = M1((e) => Object.values(e.tasks).some((Y6) => Y6.type === "local_agent" && Y6.status === "running")), h = Ra6.useCallback(() => {
        let e = {
            source: "escape",
            streamMode: X
        };
        if (w !== void 0 && !w.aborted) {
            d("tengu_cancel", e), q(() => []), K();
            return
        }
        if (d36()) {
            if (O) {
                O();
                return
            }
        }
        d("tengu_cancel", e), q(() => []), K()
    }, [P, W, w, O, q, K, X]), R = Qf4(), u = w !== void 0 && !w.aborted, I = Z > 0, g = M !== void 0 && M !== "prompt" && !D, B = !1, p = _ !== "transcript" && !j && !z && !H && !J && !R && V !== "viewing-agent" && !(X16() && $ === "INSERT") && (u || I || B), Q = p && !g, U = B || p;
    D8("chat:cancel", h, {
        context: "Chat",
        isActive: Q
    }), D8("app:interrupt", h, {
        context: "Global",
        isActive: U
    });
    let r = Ra6.useCallback(() => {
        let e = Date.now();
        if (e - v.current <= Buq) {
            v.current = 0, f("kill-agents-confirm");
            let H6 = P.getState().tasks;
            d("tengu_cancel", {
                source: "kill_agents"
            }), U4q(H6, W), _Y4();
            let J6 = [];
            for (let [K6, s] of Object.entries(H6))
                if (s.type === "local_agent" && s.status === "running") d4q(K6, W), J6.push(s.description);
            if (J6.length > 0) {
                let K6 = J6.length === 1 ? `Background agent "${J6[0]}" was stopped by the user.` : `${J6.length} background agents were stopped by the user: ${J6.map((s)=>`"${s}"`).join(", ")}.`;
                w0({
                    value: K6,
                    mode: "task-notification"
                })
            }
            Y();
            return
        }
        v.current = e, G({
            key: "kill-agents-confirm",
            text: "Press ctrl+f again to stop background agents",
            priority: "immediate",
            timeoutMs: Buq
        })
    }, [P, W, G, f, Y]);
    return D8("chat:killAgents", r, {
        context: "Chat",
        isActive: L
    }), null
}
// @from(Ln 502675, Col 4)
Ra6
// @from(Ln 502675, Col 9)
Buq = 3000
// @from(Ln 502676, Col 4)
guq = E(() => {
    V1();
    hv6();
    NA();
    bV6();
    aH();
    _7();
    fZ();
    wz();
    Vb();
    aH();
    Ra6 = t(P6(), 1)
})
// @from(Ln 502690, Col 0)
function Kb1(A) {
    return BR(A).filter((q) => q.status === "running").sort((q, K) => q.identity.agentName.localeCompare(K.identity.agentName))
}
// @from(Ln 502694, Col 0)
function Fuq(A) {
    let q = M1((M) => M.tasks),
        K = M1((M) => M.viewSelectionMode),
        Y = M1((M) => M.viewingAgentTaskId),
        z = M1((M) => M.selectedIPAgentIndex),
        _ = xA(),
        w = S5(),
        O = Kb1(q),
        $ = O.length,
        H = Object.values(q).some((M) => ij(M) && M.type !== "in_process_teammate"),
        j = Yb1.useRef($);
    Yb1.useEffect(() => {
        let M = j.current;
        j.current = $, _((D) => {
            let P = Kb1(D.tasks).length;
            if (P === 0 && M > 0 && D.selectedIPAgentIndex !== -1) {
                if (D.viewSelectionMode === "viewing-agent") return {
                    ...D,
                    selectedIPAgentIndex: -1
                };
                return {
                    ...D,
                    selectedIPAgentIndex: -1,
                    viewSelectionMode: "none"
                }
            }
            let W = D.expandedView === "teammates" ? P : P - 1;
            if (P > 0 && D.selectedIPAgentIndex > W) return {
                ...D,
                selectedIPAgentIndex: W
            };
            return D
        })
    }, [$, _]);
    let J = () => {
        if ($ === 0) return null;
        let D = O[z];
        if (!D) return null;
        return {
            taskId: D.id,
            task: D
        }
    };
    jA((M, D) => {
        if (D.escape && K === "viewing-agent") {
            let X = Y;
            if (X) {
                let P = q[X];
                if (M$(P) && P.status === "running") {
                    P.currentWorkAbortController?.abort();
                    return
                }
            }
            ib(_);
            return
        }
        if (D.escape && K === "selecting-agent") {
            _((X) => ({
                ...X,
                viewSelectionMode: "none",
                selectedIPAgentIndex: -1
            }));
            return
        }
        if (D.shift && D.upArrow) {
            if ($ > 0) _((X) => {
                let W = Kb1(X.tasks).length;
                if (W === 0) return X;
                if (X.expandedView !== "teammates") return {
                    ...X,
                    expandedView: "teammates",
                    viewSelectionMode: "selecting-agent",
                    selectedIPAgentIndex: -1
                };
                let Z = W,
                    G = X.selectedIPAgentIndex <= -1 ? Z : X.selectedIPAgentIndex - 1;
                return {
                    ...X,
                    selectedIPAgentIndex: G,
                    viewSelectionMode: "selecting-agent"
                }
            });
            else if (H) A?.onOpenBackgroundTasks?.();
            return
        }
        if (D.shift && D.downArrow) {
            if ($ > 0) _((X) => {
                let W = Kb1(X.tasks).length;
                if (W === 0) return X;
                if (X.expandedView !== "teammates") return {
                    ...X,
                    expandedView: "teammates",
                    viewSelectionMode: "selecting-agent",
                    selectedIPAgentIndex: -1
                };
                let Z = W,
                    G = X.selectedIPAgentIndex >= Z ? -1 : X.selectedIPAgentIndex + 1;
                return {
                    ...X,
                    selectedIPAgentIndex: G,
                    viewSelectionMode: "selecting-agent"
                }
            });
            else if (H) A?.onOpenBackgroundTasks?.();
            return
        }
        if (M === "f" && K === "selecting-agent" && $ > 0) {
            let X = J();
            if (X) g16(X.taskId, _);
            return
        }
        if (D.return && K === "selecting-agent") {
            if (z === -1) ib(_);
            else if (z >= $) _((X) => ({
                ...X,
                expandedView: "none",
                viewSelectionMode: "none",
                selectedIPAgentIndex: -1
            }));
            else {
                let X = J();
                if (X) g16(X.taskId, _)
            }
            return
        }
        if (M === "k" && K === "selecting-agent" && z >= 0) {
            let X = J();
            if (X && X.task.status === "running") sQ6.kill(X.taskId, {
                abortController: new AbortController,
                getAppState: () => w.getState(),
                setAppState: _
            });
            return
        }
    })
}
// @from(Ln 502830, Col 4)
Yb1
// @from(Ln 502831, Col 4)
puq = E(() => {
    i6();
    NA();
    sk();
    wr6();
    Yb1 = t(P6(), 1)
})
// @from(Ln 502839, Col 0)
function Bt8(A, q, K) {
    let {
        teamName: Y,
        agentId: z,
        agentName: _
    } = K, w = e$(Y);
    if (!w) {
        k(`[TeammateInit] Team file not found for team: ${Y}`);
        return
    }
    let O = w.leadAgentId;
    if (w.teamAllowedPaths && w.teamAllowedPaths.length > 0) {
        k(`[TeammateInit] Found ${w.teamAllowedPaths.length} team-wide allowed path(s)`);
        for (let j of w.teamAllowedPaths) {
            let J = j.path.startsWith("/") ? `/${j.path}/**` : `${j.path}/**`;
            k(`[TeammateInit] Applying team permission: ${j.toolName} allowed in ${j.path} (rule: ${J})`), A((M) => ({
                ...M,
                toolPermissionContext: Ez(M.toolPermissionContext, {
                    type: "addRules",
                    rules: [{
                        toolName: j.toolName,
                        ruleContent: J
                    }],
                    behavior: "allow",
                    destination: "session"
                })
            }))
        }
    }
    let H = w.members.find((j) => j.agentId === O)?.name || "team-lead";
    if (z === O) {
        k("[TeammateInit] This agent is the team leader - skipping idle notification hook");
        return
    }
    k(`[TeammateInit] Registering Stop hook for teammate ${_} to notify leader ${H}`), MW1(A, q, "Stop", "", async (j, J) => {
        aQ6(Y, _, !1);
        let M = Ec6(_, {
            idleReason: "available",
            summary: hc6(j)
        });
        return await x3(H, {
            from: _,
            text: B6(M),
            timestamp: new Date().toISOString(),
            color: H$()
        }), k(`[TeammateInit] Sent idle notification to leader ${H}`), !0
    }, "Failed to send idle notification to team leader", {
        timeout: 1e4
    })
}
// @from(Ln 502889, Col 4)
Quq = E(() => {
    Mc();
    qH();
    H1();
    zz();
    vf();
    F$();
    g1()
})
// @from(Ln 502899, Col 0)
function duq(A, q, {
    enabled: K = !0
} = {}) {
    Uuq.useEffect(() => {
        if (!K) return;
        if (E7()) {
            let Y = q?.[0],
                z = Y && "teamName" in Y ? Y.teamName : void 0,
                _ = Y && "agentName" in Y ? Y.agentName : void 0;
            if (z && _) {
                Rkq(A, z, _);
                let O = e$(z)?.members.find(($) => $.name === _);
                if (O) Bt8(A, R1(), {
                    teamName: z,
                    agentId: O.agentId,
                    agentName: _
                })
            } else {
                let w = vF6?.();
                if (w?.teamName && w?.agentId && w?.agentName) Bt8(A, R1(), {
                    teamName: w.teamName,
                    agentId: w.agentId,
                    agentName: w.agentName
                })
            }
        }
    }, [A, q, K])
}
// @from(Ln 502927, Col 4)
Uuq
// @from(Ln 502928, Col 4)
cuq = E(() => {
    T1();
    Qz();
    Quq();
    Ha8();
    vf();
    zz();
    Uuq = t(P6(), 1)
})
// @from(Ln 502938, Col 0)
function iuq() {
    let A = xA(),
        q = M1(($) => $.viewingAgentTaskId),
        K = M1(($) => $.tasks),
        Y = q ? K[q] : void 0,
        z = Y && M$(Y) ? Y : void 0,
        _ = q,
        w = z?.status,
        O = z?.error;
    luq.useEffect(() => {
        if (!_) return;
        if (!z) {
            ib(A);
            return
        }
        if (w === "killed" || w === "failed" || O || w !== "running" && w !== "completed" && w !== "pending") {
            ib(A);
            return
        }
    }, [_, z, w, O, A])
}
// @from(Ln 502959, Col 4)
luq
// @from(Ln 502960, Col 4)
nuq = E(() => {
    NA();
    wr6();
    luq = t(P6(), 1)
})
// @from(Ln 502966, Col 0)
function zb1(A) {
    let q = !1,
        K = !1;
    return {
        resolve(Y) {
            if (K) return;
            K = !0, q = !0, A(Y)
        },
        isResolved() {
            return q
        },
        claim() {
            if (q) return !1;
            return q = !0, !0
        }
    }
}
// @from(Ln 502984, Col 0)
function ruq(A, q, K, Y, z, _, w) {
    let O = Y.message.id,
        $ = {
            tool: A,
            input: q,
            toolUseContext: K,
            assistantMessage: Y,
            messageId: O,
            toolUseID: z,
            logDecision(H, j) {
                V01({
                    tool: A,
                    input: j?.input ?? q,
                    toolUseContext: K,
                    messageId: O,
                    toolUseID: z
                }, H, j?.permissionPromptStartTimeMs)
            },
            logCancelled() {
                d("tengu_tool_use_cancelled", {
                    messageID: O,
                    toolName: hq(A.name)
                })
            },
            async persistPermissions(H) {
                if (H.length === 0) return !1;
                NC(H);
                let j = K.getAppState();
                return _(_v(j.toolPermissionContext, H)), H.some((J) => i_8(J.destination))
            },
            resolveIfAborted(H) {
                if (!K.abortController.signal.aborted) return !1;
                return this.logCancelled(), H(this.cancelAndAbort(void 0, !0)), !0
            },
            cancelAndAbort(H, j, J) {
                let M = !!K.agentId,
                    D = H ? `${M?rc6:mQ6}${H}` : M ? Eb : h96,
                    X = M ? D : QT6(D);
                if (j || !H && !J?.length && !M) k(`Aborting: tool=${A.name} isAbort=${j} hasFeedback=${!!H} isSubagent=${M}`), K.abortController.abort();
                return {
                    behavior: "ask",
                    message: X,
                    contentBlocks: J
                }
            },
            ...{},
            async runHooks(H, j, J, M) {
                for await (let D of b_6(A.name, z, q, K, H, j, K.abortController.signal)) if (D.permissionRequestResult) {
                    let X = D.permissionRequestResult;
                    if (X.behavior === "allow") {
                        let P = X.updatedInput ?? J ?? q;
                        return await this.handleHookAllow(P, X.updatedPermissions ?? [], M)
                    } else if (X.behavior === "deny") {
                        if (this.logDecision({
                                decision: "reject",
                                source: {
                                    type: "hook"
                                }
                            }, {
                                permissionPromptStartTimeMs: M
                            }), X.interrupt) k(`Hook interrupt: tool=${A.name} hookMessage=${X.message}`), K.abortController.abort();
                        return this.buildDeny(X.message || "Permission denied by hook", {
                            type: "hook",
                            hookName: "PermissionRequest",
                            reason: X.message
                        })
                    }
                }
                return null
            },
            buildAllow(H, j) {
                return {
                    behavior: "allow",
                    updatedInput: H,
                    userModified: j?.userModified ?? !1,
                    ...j?.decisionReason && {
                        decisionReason: j.decisionReason
                    },
                    ...j?.acceptFeedback && {
                        acceptFeedback: j.acceptFeedback
                    },
                    ...j?.contentBlocks && j.contentBlocks.length > 0 && {
                        contentBlocks: j.contentBlocks
                    }
                }
            },
            buildDeny(H, j) {
                return {
                    behavior: "deny",
                    message: H,
                    decisionReason: j
                }
            },
            async handleUserAllow(H, j, J, M, D, X) {
                let P = await this.persistPermissions(j);
                this.logDecision({
                    decision: "accept",
                    source: {
                        type: "user",
                        permanent: P
                    }
                }, {
                    input: H,
                    permissionPromptStartTimeMs: M
                });
                let W = A.inputsEquivalent ? !A.inputsEquivalent(q, H) : !1,
                    Z = J?.trim();
                return this.buildAllow(H, {
                    userModified: W,
                    decisionReason: X,
                    acceptFeedback: Z || void 0,
                    contentBlocks: D
                })
            },
            async handleHookAllow(H, j, J) {
                let M = await this.persistPermissions(j);
                return this.logDecision({
                    decision: "accept",
                    source: {
                        type: "hook",
                        permanent: M
                    }
                }, {
                    input: H,
                    permissionPromptStartTimeMs: J
                }), this.buildAllow(H, {
                    decisionReason: {
                        type: "hook",
                        hookName: "PermissionRequest"
                    }
                })
            },
            pushToQueue(H) {
                w?.push(H)
            },
            removeFromQueue() {
                w?.remove(z)
            },
            updateQueueItem(H) {
                w?.update(z, H)
            }
        };
    return Object.freeze($)
}
// @from(Ln 503129, Col 0)
function ouq(A) {
    return {
        push(q) {
            A((K) => [...K, q])
        },
        remove(q) {
            A((K) => K.filter((Y) => Y.toolUseID !== q))
        },
        update(q, K) {
            A((Y) => Y.map((z) => z.toolUseID === q ? {
                ...z,
                ...K
            } : z))
        }
    }
}
// @from(Ln 503145, Col 4)
_b1 = E(() => {
    V1();
    o$();
    JA();
    F$();
    Ve();
    JZ();
    k01();
    hw();
    H1()
})
// @from(Ln 503156, Col 0)
async function auq(A) {
    let {
        ctx: q,
        updatedInput: K,
        suggestions: Y,
        permissionMode: z
    } = A;
    try {
        let _ = await q.runHooks(z, Y, K);
        if (_) return _;
        let w = null;
        if (w) return w
    } catch (_) {
        _6(_ instanceof Error ? _ : Error(`Automated permission check failed: ${String(_)}`))
    }
    return null
}
// @from(Ln 503173, Col 4)
suq = E(() => {
    k1()
})