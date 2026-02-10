
// @from(Ln 478688, Col 0)
function DMz({
    debug: A,
    ideSelection: q,
    toolPermissionContext: K,
    setToolPermissionContext: Y,
    apiKeyStatus: z,
    commands: w,
    agents: H,
    isLoading: $,
    verbose: O,
    messages: _,
    onAutoUpdaterResult: J,
    autoUpdaterResult: X,
    input: D,
    onInputChange: j,
    mode: M,
    onModeChange: P,
    stashedPrompt: W,
    setStashedPrompt: G,
    submitCount: f,
    onShowMessageSelector: Z,
    mcpClients: N,
    pastedContents: T,
    setPastedContents: k,
    vimMode: y,
    setVimMode: B,
    showBashesDialog: S,
    setShowBashesDialog: m,
    showDiffDialog: b,
    setShowDiffDialog: g,
    tasksSelected: U,
    setTasksSelected: x,
    diffSelected: p,
    setDiffSelected: l,
    onExit: r,
    getToolUseContext: s,
    onSubmit: O1,
    onAgentSubmit: T1,
    isSearchingHistory: N1,
    setIsSearchingHistory: j1,
    onDismissSideQuestion: q1,
    isSideQuestionVisible: t,
    helpOpen: J1,
    setHelpOpen: D1,
    hasSuppressedDialogs: Z1,
    insertTextRef: E1
}) {
    let a = is(),
        A1 = BD1(),
        [M1, z1] = Iq.useState(!1),
        [Y1, _1] = Iq.useState({
            show: !1
        }),
        [$1, G1] = Iq.useState(D.length),
        L1 = h7.useRef(D);
    if (D !== L1.current) G1(D.length), L1.current = D;
    let x1 = h7.useCallback((I6) => {
        L1.current = I6, j(I6)
    }, [j]);
    if (E1) E1.current = (I6) => {
        let w7 = $1 === D.length && D.length > 0 && !/\s$/.test(D) ? " " + I6 : I6,
            l7 = D.slice(0, $1) + w7 + D.slice($1);
        L1.current = l7, j(l7), G1($1 + w7.length)
    };
    let f1 = B_(),
        R1 = L7(),
        H1 = v6((I6) => I6.tasks),
        y1 = v6((I6) => I6.teamContext),
        B1 = v6((I6) => I6.queuedCommands),
        A6 = v6((I6) => I6.gitDiff),
        O6 = v6((I6) => I6.promptSuggestion),
        P6 = v6((I6) => I6.speculation),
        V6 = v6((I6) => I6.speculationSessionTimeSavedMs),
        q6 = v6((I6) => I6.viewingAgentTaskId),
        p1 = v6((I6) => I6.viewSelectionMode),
        K6 = v6((I6) => I6.expandedView) === "teammates",
        j6 = v6((I6) => I6.mainLoopModel),
        M6 = v6((I6) => I6.mainLoopModelForSession),
        N6 = v6((I6) => I6.thinkingEnabled),
        F6 = v6((I6) => i4() ? I6.fastMode : !1),
        P1 = PR(f1.getState()),
        k1 = P1?.identity.agentName,
        o1 = P1?.identity.color && cO.includes(P1.identity.color) ? P1.identity.color : void 0,
        _6 = Iq.useMemo(() => dv(H1).filter((I6) => I6.status === "running").sort((I6, tA) => I6.identity.agentName.localeCompare(tA.identity.agentName)), [H1]),
        z6 = _6.length > 0 || P1 !== void 0,
        w6 = Iq.useMemo(() => {
            if (P1) return {
                ...K,
                mode: P1.permissionMode
            };
            return K
        }, [P1, K]),
        {
            historyQuery: r6,
            setHistoryQuery: G6,
            historyMatch: L6,
            historyFailedMatch: OA
        } = zfq((I6) => {
            k(I6.pastedContents), rw(I6.display)
        }, D, x1, G1, $1, P, M, N1, j1, k, T),
        bA = Iq.useRef(jMz(_)),
        [lA, E7] = Iq.useState(!1),
        [V4, RA] = Iq.useState(!1),
        [O7, tK] = Iq.useState(0),
        [gq, xq] = Iq.useState(0),
        U8 = HZq(),
        [R4, O3] = Iq.useState(!1),
        [HY, _4] = Iq.useState(!1),
        [Az, Wz] = Iq.useState(!1),
        [ZY, $Y] = Iq.useState(!1),
        [OY, fY] = Iq.useState(!1),
        [J2, o5] = Iq.useState(0),
        g2 = Iq.useMemo(() => {
            let I6 = D.indexOf(`
`);
            if (I6 === -1) return !0;
            return $1 <= I6
        }, [D, $1]),
        W$ = Iq.useMemo(() => {
            let I6 = D.lastIndexOf(`
`);
            if (I6 === -1) return !0;
            return $1 > I6
        }, [D, $1]),
        c9 = Iq.useMemo(() => {
            if (!l8()) return [];
            if (Rm()) return [];
            if (!y1) return [];
            let I6 = Object.values(y1.teammates).filter((tA) => tA.name !== "team-lead").length;
            return [{
                name: y1.teamName,
                memberCount: I6,
                runningCount: 0,
                idleCount: 0
            }]
        }, [y1]),
        {
            suggestion: C3,
            markAccepted: Gz,
            logOutcomeAtSubmission: Oq,
            markShown: vK,
            resetSuggestion: l9
        } = Hfq({
            inputValue: D,
            isAssistantResponding: $
        }),
        _3 = Iq.useMemo(() => N1 && L6 ? Jq1(typeof L6 === "string" ? L6 : L6.display) : D, [N1, L6, D]),
        TA = Iq.useMemo(() => rk7(_3), [_3]),
        F7 = Iq.useMemo(() => AAq(_3), [_3]),
        f8 = Iq.useMemo(() => {
            return eWq(_3).filter((tA) => {
                let w7 = _3.slice(tA.start + 1, tA.end);
                return Sd(w7, w)
            })
        }, [_3, w]),
        oq = Iq.useMemo(() => {
            if (!l8()) return [];
            if (!y1?.teammates) return [];
            let I6 = [],
                tA = y1.teammates;
            if (!tA) return I6;
            let w7 = /(^|\s)@([\w-]+)/g,
                l7;
            while ((l7 = w7.exec(_3)) !== null) {
                let YK = l7[1] ?? "",
                    L9 = l7.index + YK.length,
                    Ww = l7[0].trimStart(),
                    JO = l7[2],
                    MG = Object.values(tA).find((PG) => PG.name === JO);
                if (MG?.color) {
                    let PG = lO[MG.color];
                    if (PG) I6.push({
                        start: L9,
                        end: L9 + Ww.length,
                        themeColor: PG
                    })
                }
            }
            return I6
        }, [_3, y1]),
        j5 = Iq.useMemo(() => {
            let I6 = [];
            if (N1 && L6 && !OA) I6.push({
                start: $1,
                end: $1 + r6.length,
                color: "warning",
                priority: 20
            });
            for (let tA of F7) I6.push({
                start: tA.start,
                end: tA.end,
                color: "warning",
                priority: 15
            });
            for (let tA of f8) I6.push({
                start: tA.start,
                end: tA.end,
                color: "suggestion",
                priority: 5
            });
            for (let tA of oq) I6.push({
                start: tA.start,
                end: tA.end,
                color: tA.themeColor,
                priority: 5
            });
            return I6
        }, [N1, r6, L6, OA, $1, F7, oq, f8, _3]),
        {
            addNotification: N4,
            removeNotification: E9
        } = iq();
    Iq.useEffect(() => {
        if (!TA.length) return;
        N4({
            key: "ultrathink-deprecated",
            jsx: h7.createElement(V, {
                dimColor: !0
            }, "Ultrathink no longer does anything. Thinking budget is now max by default."),
            priority: "immediate",
            timeoutMs: 5000
        })
    }, [N4, TA.length]);
    let W4 = Iq.useRef(D.length),
        F1 = Iq.useRef(D.length),
        c1 = Iq.useCallback(() => {
            E9("stash-hint")
        }, [E9]);
    Iq.useEffect(() => {
        let I6 = W4.current,
            tA = F1.current,
            w7 = D.length;
        if (W4.current = w7, w7 > tA) {
            F1.current = w7;
            return
        }
        if (w7 === 0) {
            F1.current = 0;
            return
        }
        let l7 = tA >= 20 && w7 <= 5,
            YK = I6 >= 20 && w7 <= 5;
        if (l7 && !YK) {
            if (!f6().hasUsedStash) N4({
                key: "stash-hint",
                jsx: h7.createElement(V, {
                    dimColor: !0
                }, "Tip:", " ", h7.createElement(NA, {
                    action: "chat:stash",
                    context: "Chat",
                    fallback: "ctrl+s",
                    description: "stash"
                })),
                priority: "immediate",
                timeoutMs: Qv6
            });
            F1.current = w7
        }
    }, [D.length, N4]);
    let {
        pushToBuffer: X6,
        undo: T6,
        canUndo: l6,
        clearBuffer: fA
    } = DZq({
        maxBufferSize: 50,
        debounceMs: 1000
    });
    FZq({
        input: D,
        pastedContents: T,
        onInputChange: x1,
        setCursorOffset: G1,
        setPastedContents: k
    });
    let aA = pZq({
            input: D,
            submitCount: f,
            viewingAgentName: k1
        }),
        nA = Iq.useCallback((I6) => {
            if (I6 === "?") {
                c("tengu_help_toggled", {}), D1((L9) => !L9);
                return
            }
            D1(!1), c1(), N6q(), K91(R1);
            let tA = I6.length === D.length + 1,
                w7 = $1 === 0,
                l7 = _B(I6);
            if (tA && w7 && l7 !== "prompt") {
                P(l7);
                return
            }
            let YK = I6.replaceAll("\t", "    ");
            if (D !== YK) X6(D, $1, T);
            x(!1), l(!1), E7(!1), x1(YK)
        }, [x1, P, D, $1, X6, T, x, l, E7, c1, R1]),
        {
            resetHistory: V8,
            onHistoryUp: K8,
            onHistoryDown: $8,
            dismissSearchHint: I7,
            historyIndex: Lq
        } = oWq((I6, tA, w7) => {
            nA(I6), P(tA), k(w7)
        }, D, T, G1, M);
    Iq.useEffect(() => {
        if (N1) I7()
    }, [N1, I7]);

    function e4(I6) {
        if (x(I6 === "tasks"), l(I6 === "diff"), I6 === "tasks") tK(0), xq(0)
    }

    function Rq() {
        if (hH.length > 1) return;
        if (!g2) return;
        if (B1.some((w7) => f_6(w7.mode))) {
            LP();
            return
        }
        if (p) {
            if (c9.length > 0) E7(!0), e4("none");
            else if (Object.values(H1).filter((l7) => l7.status === "running").length > 0 && !J11(H1, K6)) e4("tasks");
            else e4("none");
            return
        }
        if (lA) {
            let w7 = Object.values(H1).filter((l7) => l7.status === "running").length;
            if (E7(!1), w7 > 0 && !J11(H1, K6)) e4("tasks");
            else e4("none");
            return
        }
        if (U && KY() && U8 > 0) {
            if (gq > 0) xq((w7) => w7 - 1);
            else e4("none"), xq(0);
            return
        }
        if (U) {
            e4("none");
            return
        }
        let tA = ggA(T);
        if (tA > 0 && !OY) {
            fY(!0), o5(tA - 1);
            return
        }
        K8()
    }

    function F5() {
        if (hH.length > 1) return;
        if (!W$) return;
        if (OY) return;
        let I6 = Object.values(H1).filter((YK) => YK.status === "running").length,
            tA = x8("tengu_code_diff_cli", !1) && A6.stats && A6.stats.filesCount > 0;
        if (U && KY() && U8 > 0) {
            if (gq < U8 - 1) xq((YK) => YK + 1);
            return
        }
        if (U) {
            if (c9.length > 0) E7(!0), e4("none");
            else if (tA) e4("diff");
            return
        }
        if (lA) {
            if (tA) E7(!1), e4("diff");
            return
        }
        if (p) return;
        let w7 = $8(),
            l7 = c9.length > 0;
        if (w7) {
            if (I6 > 0 && !J11(H1, K6)) {
                if (e4("tasks"), E7(!1), !f6().hasSeenTasksHint) jA((L9) => {
                    if (L9.hasSeenTasksHint === !0) return L9;
                    return {
                        ...L9,
                        hasSeenTasksHint: !0
                    }
                })
            } else if (l7) E7(!0), e4("none");
            else if (tA) e4("diff")
        }
    }
    let [k9, HO] = Iq.useState({
        suggestions: [],
        selectedSuggestion: -1,
        commandArgumentHint: void 0
    }), U2 = Iq.useCallback((I6) => {
        HO((tA) => typeof I6 === "function" ? I6(tA) : I6)
    }, []), rw = Iq.useCallback(async (I6, tA = !1) => {
        if (U || lA || p) return;
        let w7 = Object.values(T).some((JO) => JO.type === "image"),
            l7 = O6.text;
        if ((I6.trim() === "" || I6 === l7) && l7 && !w7) {
            if (P6.status === "active") {
                Gz(), O1(l7, {
                    setCursorOffset: G1,
                    clearBuffer: fA,
                    resetHistory: V8
                }, {
                    state: P6,
                    speculationSessionTimeSavedMs: V6,
                    setAppState: R1
                });
                return
            }
            if (O6.shownAt > 0) Gz(), I6 = l7
        }
        if (l8()) {
            let JO = TZq(I6);
            if (JO) {
                let MG = vZq(JO.recipientName, JO.message, y1, f9);
                if (MG.success) {
                    N4({
                        key: "direct-message-sent",
                        text: `Sent to @${MG.recipientName}`,
                        priority: "immediate",
                        timeoutMs: 3000
                    }), x1(""), G1(0), fA(), V8();
                    return
                } else if (MG.error === "no_team_context");
            }
        }
        if (I6.trim() === "" && !w7) return;
        let L9 = k9.suggestions.length > 0 && k9.suggestions.every((JO) => JO.description === "directory");
        if (k9.suggestions.length > 0 && !tA && !L9 && !w7) return;
        if (O6.text && O6.shownAt > 0) Oq(I6);
        E9("stash-hint");
        let Ww = Gp7(f1.getState());
        if (l8()) {
            if (Ww.type === "viewed" && T1) {
                c("tengu_transcript_input_to_teammate", {}), await T1(I6, Ww.task, {
                    setCursorOffset: G1,
                    clearBuffer: fA,
                    resetHistory: V8
                });
                return
            }
        }
        await O1(I6, {
            setCursorOffset: G1,
            clearBuffer: fA,
            resetHistory: V8
        })
    }, [O6, P6, V6, y1, f1, U, lA, p, k9.suggestions, O1, T1, fA, V8, Oq, R1, Gz, T, E9]), ow = Object.values(T).some((I6) => I6.type === "image"), r_ = Iq.useCallback(() => {
        return !1
    }, [$, D, ow, O1, G1, fA, V8]), {
        suggestions: hH,
        selectedSuggestion: pJ,
        commandArgumentHint: $O,
        inlineGhostText: IH,
        maxColumnWidth: aw
    } = WGq({
        commands: w,
        onInputChange: x1,
        onSubmit: rw,
        setCursorOffset: G1,
        input: D,
        cursorOffset: $1,
        mode: M,
        agents: H,
        setSuggestionsState: U2,
        suggestionsState: k9,
        suppressSuggestions: N1 || Lq > 0,
        markAccepted: Gz,
        hasImages: ow,
        onQueue: r_
    }), X2 = M === "prompt" && hH.length === 0 && C3;
    if (X2) vK();
    if (O6.text && !C3 && O6.shownAt === 0) uI("timing", O6.text), R1((I6) => ({
        ...I6,
        promptSuggestion: {
            text: null,
            promptId: null,
            shownAt: 0,
            acceptedAt: 0,
            generationRequestId: null
        }
    }));

    function Fj(I6, tA, w7, l7, YK) {
        c("tengu_paste_image", {}), P("prompt");
        let L9 = bA.current++,
            Ww = {
                id: L9,
                type: "image",
                content: I6,
                mediaType: tA || "image/png",
                filename: w7 || "Pasted image",
                dimensions: l7,
                sourcePath: YK
            };
        gD1(Ww), setTimeout(() => Xq1(Ww), 0), k((JO) => ({
            ...JO,
            [L9]: Ww
        }))
    }

    function Qj(I6) {
        let tA = JH(I6).replace(/\r/g, `
`).replaceAll("\t", "    "),
            w7 = hD1(tA),
            l7 = Math.min(X8 - 10, 2);
        if (tA.length > Yw6 || w7 > l7) {
            let YK = bA.current++,
                L9 = {
                    id: YK,
                    type: "text",
                    content: tA
                };
            k((Ww) => ({
                ...Ww,
                [YK]: L9
            })), p2(c26(YK, w7))
        } else p2(tA)
    }

    function p2(I6) {
        X6(D, $1, T);
        let tA = D.slice(0, $1) + I6 + D.slice($1);
        x1(tA), G1($1 + I6.length)
    }
    let wD = iS(() => {}, () => Z()),
        LP = Iq.useCallback(async () => {
            let I6 = await V_6(D, $1, async () => new Promise((tA) => R1((w7) => {
                return tA(w7), w7
            })), R1);
            if (!I6) return !1;
            if (x1(I6.text), P("prompt"), G1(I6.cursorOffset), I6.images.length > 0) k((tA) => {
                let w7 = {
                    ...tA
                };
                for (let l7 of I6.images) w7[l7.id] = l7;
                return w7
            });
            return !0
        }, [R1, x1, P, D, $1, k]);
    JZq(N, function(I6) {
        c("tengu_ext_at_mentioned", {});
        let tA, w7 = Mfq.relative(h6(), I6.filePath);
        if (I6.lineStart && I6.lineEnd) tA = I6.lineStart === I6.lineEnd ? `@${w7}#L${I6.lineStart} ` : `@${w7}#L${I6.lineStart}-${I6.lineEnd} `;
        else tA = `@${w7} `;
        let l7 = D[$1 - 1] ?? " ";
        if (!/\s/.test(l7)) tA = ` ${tA}`;
        p2(tA)
    });
    let S3 = Iq.useCallback(() => {
            if (l6) {
                u8("ctrl-underscore");
                let I6 = T6();
                if (I6) x1(I6.text), G1(I6.cursorOffset), k(I6.pastedContents)
            }
        }, [l6, T6, x1, k]),
        eK = Iq.useCallback(() => {
            c("tengu_external_editor_used", {}), u8("external-editor"), _4(!0);
            try {
                let I6 = Ef1(D, T);
                if (I6.error) N4({
                    key: "external-editor-error",
                    text: I6.error,
                    color: "warning",
                    priority: "high"
                });
                if (I6.content !== null && I6.content !== D) X6(D, $1, T), x1(I6.content), G1(I6.content.length)
            } catch (I6) {
                if (I6 instanceof Error) K1(I6);
                N4({
                    key: "external-editor-error",
                    text: `External editor failed: ${I6 instanceof Error?I6.message:String(I6)}`,
                    color: "warning",
                    priority: "high"
                })
            } finally {
                _4(!1)
            }
        }, [D, $1, T, X6, x1, N4]),
        OO = Iq.useCallback(() => {
            if (D.trim() === "" && W !== void 0) x1(W.text), G1(W.cursorOffset), k(W.pastedContents), G(void 0);
            else if (D.trim() !== "") G({
                text: D,
                cursorOffset: $1,
                pastedContents: T
            }), x1(""), G1(0), k({}), u8("prompt-stash"), jA((I6) => {
                if (I6.hasUsedStash) return I6;
                return {
                    ...I6,
                    hasUsedStash: !0
                }
            })
        }, [D, $1, W, x1, G, T, k]),
        HD = Iq.useCallback(() => {
            if (Wz((I6) => !I6), J1) D1(!1)
        }, [J1]),
        xH = Iq.useCallback(() => {
            if ($Y((I6) => !I6), J1) D1(!1)
        }, [J1]),
        o_ = Iq.useCallback(() => {
            if (l8() && P1 && q6) {
                let w7 = {
                        ...K,
                        mode: P1.permissionMode
                    },
                    l7 = hf1(w7, void 0);
                c("tengu_mode_cycle", {
                    to: l7
                });
                let YK = q6;
                if (R1((L9) => {
                        let Ww = L9.tasks[YK];
                        if (!Ww || Ww.type !== "in_process_teammate") return L9;
                        if (Ww.permissionMode === l7) return L9;
                        return {
                            ...L9,
                            tasks: {
                                ...L9.tasks,
                                [YK]: {
                                    ...Ww,
                                    permissionMode: l7
                                }
                            }
                        }
                    }), J1) D1(!1);
                return
            }
            let {
                nextMode: I6,
                context: tA
            } = FGq(K, y1);
            if (c("tengu_mode_cycle", {
                    to: I6
                }), K.mode === "plan" && I6 !== "plan") OT(!0);
            if (ey(K.mode, I6), K.mode === "delegate" && I6 !== "delegate") tL6(!0), XN1(!0);
            if (I6 === "plan") jA((w7) => ({
                ...w7,
                lastPlanModeUse: Date.now()
            }));
            if (I6 === "acceptEdits") u8("auto-accept-mode");
            if (R1((w7) => ({
                    ...w7,
                    toolPermissionContext: {
                        ...tA,
                        mode: I6
                    }
                })), Y({
                    ...tA,
                    mode: I6
                }), HR4(I6, y1?.teamName), J1) D1(!1)
        }, [K, y1, q6, P1, R1, Y, J1]),
        dJ = Iq.useCallback(() => {
            QD1().then((I6) => {
                if (I6) u8("image-paste"), Fj(I6.base64, I6.mediaType);
                else {
                    let tA = m0("chat:imagePaste", "Chat", "ctrl+v"),
                        w7 = xA.isSSH() ? "No image found in clipboard. You're SSH'd; try scp?" : `No image found in clipboard. Use ${tA} to paste images.`;
                    N4({
                        key: "no-image-in-clipboard",
                        text: w7,
                        priority: "immediate",
                        timeoutMs: 1000
                    })
                }
            })
        }, [N4, Fj]),
        $D = VL();
    Iq.useEffect(() => {
        if (!$D || A1) return;
        return $D.registerHandler({
            action: "chat:submit",
            context: "Chat",
            handler: () => {
                rw(D)
            }
        })
    }, [$D, A1, rw, D]);
    let _O = Iq.useMemo(() => ({
        "chat:undo": S3,
        "chat:externalEditor": eK,
        "chat:stash": OO,
        "chat:modelPicker": HD,
        "chat:thinkingToggle": xH,
        "chat:cycleMode": o_,
        "chat:imagePaste": dJ
    }), [S3, eK, OO, HD, xH, o_, dJ]);
    c7(_O, {
        context: "Chat",
        isActive: !A1 && !OY
    }), DA("help:dismiss", () => {
        D1(!1)
    }, {
        context: "Help",
        isActive: J1
    }), DA("app:interrupt", () => {
        K91(R1)
    }, {
        context: "Global",
        isActive: !$ && P6.status === "active"
    });
    let a_ = ggA(T);
    c7({
        "attachments:next": () => {
            o5((I6) => I6 < a_ - 1 ? I6 + 1 : 0)
        },
        "attachments:previous": () => {
            o5((I6) => I6 > 0 ? I6 - 1 : a_ - 1)
        },
        "attachments:remove": () => {
            let tA = Object.values(T).filter((l7) => l7.type === "image")[J2];
            if (tA) k((l7) => {
                let YK = {
                    ...l7
                };
                return delete YK[tA.id], YK
            });
            let w7 = a_ - 1;
            if (w7 === 0) fY(!1), o5(0);
            else o5((l7) => l7 >= w7 ? w7 - 1 : l7)
        },
        "attachments:exit": () => {
            fY(!1)
        }
    }, {
        context: "Attachments",
        isActive: OY && !b
    });
    let E5 = U || lA || p;
    c7({
        "footer:next": () => {
            if (U) {
                if (z6) {
                    let I6 = 1 + _6.length;
                    tK((tA) => (tA + 1) % I6);
                    return
                }
                if (c9.length > 0) E7(!0), e4("none");
                else if (x8("tengu_code_diff_cli", !1) && A6.stats && A6.stats.filesCount > 0) e4("diff")
            } else if (lA) {
                if (x8("tengu_code_diff_cli", !1) && A6.stats && A6.stats.filesCount > 0) E7(!1), e4("diff")
            }
        },
        "footer:previous": () => {
            if (p) {
                if (c9.length > 0) E7(!0), e4("none");
                else if (Object.values(H1).filter((tA) => tA.status === "running").length > 0) e4("tasks")
            } else if (lA) {
                let I6 = Object.values(H1).filter((tA) => tA.status === "running").length;
                if (E7(!1), I6 > 0) e4("tasks")
            } else if (U) {
                if (z6) {
                    let I6 = 1 + _6.length;
                    tK((tA) => (tA - 1 + I6) % I6);
                    return
                }
            }
        },
        "footer:openSelected": () => {
            if (p1 === "selecting-agent") return;
            if (U && z6)
                if (O7 === 0) pI(R1);
                else {
                    let I6 = _6[O7 - 1];
                    if (I6) ye(I6.id, R1)
                }
            else if (U) m(!0), e4("none");
            else if (p && x8("tengu_code_diff_cli", !1)) c("tengu_code_change_view_opened", {}), g(!0), e4("none");
            else if (lA) RA(!0), E7(!1)
        },
        "footer:clearSelection": () => {
            e4("none"), E7(!1)
        }
    }, {
        context: "Footer",
        isActive: E5 && !b
    }), D8((I6, tA) => {
        if (b || V4) return;
        if (eA() === "macos" && I6 in BhA) {
            let w7 = BhA[I6],
                l7 = h$A();
            N4({
                key: "option-meta-hint",
                jsx: l7 ? h7.createElement(V, {
                    dimColor: !0
                }, "To enable ", w7, ", set ", h7.createElement(V, {
                    bold: !0
                }, "Option as Meta"), " in", " ", l7, " preferences (⌘,)") : h7.createElement(V, {
                    dimColor: !0
                }, "To enable ", w7, ", run /terminal-setup"),
                priority: "immediate",
                timeoutMs: 5000
            })
        }
        if (OY) return;
        if ($1 === 0 && (tA.escape || tA.backspace || tA.delete)) P("prompt"), D1(!1);
        if (J1 && D === "" && (tA.backspace || tA.delete)) D1(!1);
        if (tA.escape) {
            if (P6.status === "active") {
                K91(R1);
                return
            }
            if (t && q1) {
                q1();
                return
            }
            if (J1) {
                D1(!1);
                return
            }
            if (E5) return;
            if (B1.some((l7) => f_6(l7.mode))) {
                LP();
                return
            }
            if (_.length > 0 && !D && !$) wD()
        }
        if (tA.return && J1) D1(!1)
    });
    let Pw = qfq(),
        bH = i4() ? Kv() : !1,
        cJ = i4() ? F6 && (lH() || bH) : !1,
        lJ = Dfq(cJ ?? !1),
        {
            columns: mY,
            rows: X8
        } = Z8(),
        E8 = mY - 3,
        fq = X2 && C3 ? C3 : aA,
        t3 = Iq.useMemo(() => D.includes(`
`), [D]),
        aq = Iq.useCallback((I6, tA) => {
            R1((w7) => ({
                ...w7,
                mainLoopModel: I6,
                mainLoopModelForSession: null
            })), Wz(!1), c("tengu_model_picker_hotkey", {
                model: I6
            })
        }, [R1]),
        Zz = Iq.useCallback(() => {
            Wz(!1)
        }, []),
        VY = Iq.useMemo(() => {
            if (!Az) return null;
            return h7.createElement(I, {
                flexDirection: "column",
                marginTop: 1
            }, h7.createElement(wZ1, {
                initial: j6,
                sessionModel: M6,
                onSelect: aq,
                onCancel: Zz,
                isStandaloneCommand: !0,
                showPenguinsNotice: i4() && F6 && x$(j6) && lH()
            }))
        }, [Az, j6, M6, aq, Zz]),
        T4 = Iq.useCallback((I6) => {
            R1((tA) => ({
                ...tA,
                thinkingEnabled: I6
            })), $Y(!1), c("tengu_thinking_toggled_hotkey", {
                enabled: I6
            }), u8("thinking-toggle"), N4({
                key: "thinking-toggled-hotkey",
                jsx: h7.createElement(V, {
                    color: I6 ? "suggestion" : void 0,
                    dimColor: !I6
                }, "Thinking ", I6 ? "on" : "off"),
                priority: "immediate",
                timeoutMs: 3000
            })
        }, [R1, N4]),
        i9 = Iq.useCallback(() => {
            $Y(!1)
        }, []),
        D2 = Iq.useMemo(() => {
            if (!ZY) return null;
            return h7.createElement(I, {
                flexDirection: "column",
                marginTop: 1
            }, h7.createElement(_fq, {
                currentValue: N6 ?? !0,
                onSelect: T4,
                onCancel: i9,
                isMidConversation: _.some((I6) => I6.type === "assistant")
            }))
        }, [ZY, N6, T4, i9, _.length]);
    if (S) return h7.createElement(EN6, {
        onDone: () => {
            m(!1)
        },
        toolUseContext: s(_, [], new AbortController, [], void 0, a)
    });
    if (l8() && V4) return h7.createElement(GZq, {
        initialTeams: c9,
        onDone: () => {
            RA(!1)
        }
    });
    if (VY) return VY;
    if (D2) return D2;
    if (x8("tengu_code_diff_cli", !1) && b) return h7.createElement(xZq, {
        messages: _,
        onDone: () => {
            g(!1), l(!1)
        }
    });
    let OD = {
            multiline: !0,
            onSubmit: rw,
            onChange: nA,
            value: L6 ? Jq1(typeof L6 === "string" ? L6 : L6.display) : D,
            onHistoryUp: Rq,
            onHistoryDown: F5,
            onHistoryReset: V8,
            onClearInput: l9,
            placeholder: fq,
            onExit: r,
            onExitMessage: (I6, tA) => _1({
                show: I6,
                key: tA
            }),
            onImagePaste: Fj,
            columns: E8,
            disableCursorMovementForUpDownKeys: hH.length > 0,
            cursorOffset: $1,
            onChangeCursorOffset: G1,
            onPaste: Qj,
            onIsPastingChange: O3,
            focus: !N1 && !OY && !A1,
            showCursor: !U && !lA && !p && !N1 && !OY,
            argumentHint: $O,
            onUndo: l6 ? () => {
                let I6 = T6();
                if (I6) x1(I6.text), G1(I6.cursorOffset), k(I6.pastedContents)
            } : void 0,
            highlights: j5,
            inlineGhostText: IH
        },
        G$ = () => {
            let I6 = {
                bash: "bashBorder",
                background: "background"
            };
            if (I6[M]) return I6[M];
            if (MM()) return "promptBorder";
            let tA = b$();
            if (tA && cO.includes(tA)) return lO[tA];
            return "promptBorder"
        };
    if (HY) return h7.createElement(I, {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderColor: G$(),
        borderDimColor: !0,
        borderStyle: "round",
        borderLeft: !1,
        borderRight: !1,
        borderBottom: !0,
        width: "100%"
    }, h7.createElement(V, {
        dimColor: !0,
        italic: !0
    }, "Save and close editor to continue..."));
    let sw = _e() ? h7.createElement(IgA, {
        ...OD,
        initialMode: y,
        onModeChange: B,
        isLoading: $
    }) : h7.createElement(k3, {
        ...OD
    });
    return h7.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, h7.createElement(oZq, null), Z1 && h7.createElement(I, {
        marginTop: 1,
        marginLeft: 2
    }, h7.createElement(V, {
        dimColor: !0
    }, "Waiting for permission…")), h7.createElement(sZq, {
        hasStash: W !== void 0
    }), h7.createElement(Yfq, {
        pastedContents: T,
        isSelected: OY,
        selectedIndex: J2
    }), Pw ? h7.createElement(h7.Fragment, null, h7.createElement(V, {
        color: Pw.bgColor
    }, Pw.text ? h7.createElement(h7.Fragment, null, "─".repeat(Math.max(0, mY - UA(Pw.text) - 4)), h7.createElement(V, {
        backgroundColor: Pw.bgColor,
        color: "inverseText"
    }, " ", Pw.text, " "), "──") : "─".repeat(mY)), h7.createElement(I, {
        flexDirection: "row",
        width: "100%"
    }, h7.createElement(FgA, {
        mode: M,
        isLoading: $,
        viewingAgentName: k1,
        viewingAgentColor: o1
    }), h7.createElement(I, {
        flexGrow: 1,
        flexShrink: 1
    }, sw)), h7.createElement(V, {
        color: Pw.bgColor
    }, "─".repeat(mY))) : h7.createElement(I, {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        borderColor: G$(),
        borderDimColor: !0,
        borderStyle: "round",
        borderLeft: !1,
        borderRight: !1,
        borderBottom: !0,
        width: "100%",
        borderText: cJ ? {
            content: lJ ? ` ${c91(!0,bH)} ${H6.dim("/fast")} ` : ` ${c91(!0,bH)} `,
            position: "top",
            align: "end",
            offset: 0
        } : void 0
    }, h7.createElement(FgA, {
        mode: M,
        isLoading: $,
        viewingAgentName: k1,
        viewingAgentColor: o1
    }), h7.createElement(I, {
        flexGrow: 1,
        flexShrink: 1
    }, sw)), h7.createElement(OZq, {
        apiKeyStatus: z,
        debug: A,
        exitMessage: Y1,
        vimMode: y,
        mode: M,
        autoUpdaterResult: X,
        isAutoUpdating: M1,
        verbose: O,
        onAutoUpdaterResult: J,
        onChangeIsUpdating: z1,
        suggestions: hH,
        selectedSuggestion: pJ,
        maxColumnWidth: aw,
        toolPermissionContext: w6,
        helpOpen: J1,
        suppressHint: D.length > 0,
        isLoading: $,
        hasInput: D.length > 0,
        tasksSelected: U,
        teamsSelected: lA,
        diffSelected: p,
        teammateFooterIndex: O7,
        coordinatorTaskIndex: gq,
        ideSelection: q,
        mcpClients: N,
        isPasting: R4,
        isInputWrapped: t3,
        messages: _,
        isSearching: N1,
        historyQuery: r6,
        setHistoryQuery: G6,
        historyFailedMatch: OA
    }))
}
// @from(Ln 479753, Col 0)
function jMz(A) {
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
                        let z = ID1(Y.text);
                        for (let w of z)
                            if (w.id > q) q = w.id
                    }
            }
        } return q + 1
}
// @from(Ln 479771, Col 4)
h7
// @from(Ln 479771, Col 8)
Iq
// @from(Ln 479771, Col 12)
Pfq
// @from(Ln 479772, Col 4)
Wfq = v(() => {
    m1();
    q3();
    XL();
    LY();
    K7();
    eg();
    aWq();
    gv6();
    GGq();
    cA();
    nS();
    gO();
    mGq();
    DZ1();
    c$();
    mq();
    tF1();
    xgA();
    B6();
    _Zq();
    v3();
    y6();
    fx1();
    u6();
    U4();
    Cx1();
    G5();
    s2();
    nU1();
    x3();
    Oq1();
    XZq();
    N7();
    jZq();
    tD1();
    phA();
    GgA();
    DuA();
    Qc1();
    S9();
    NZq();
    Cz();
    XN();
    Yv();
    H$();
    JI();
    bZq();
    Cv6();
    lM();
    d8();
    BgA();
    cM();
    QZq();
    dZq();
    lZq();
    aZq();
    AN();
    tZq();
    Kfq();
    MK1();
    Od1();
    gR();
    BK();
    UgA();
    wfq();
    h2();
    oS();
    $fq();
    mG1();
    lU1();
    $V6();
    Jfq();
    UgA();
    po();
    OJ();
    vuA();
    jfq();
    h7 = o(X1(), 1), Iq = o(X1(), 1);
    Pfq = h7.memo(DMz)
})
// @from(Ln 479854, Col 0)
function Gfq({
    inputValue: A,
    isAssistantResponding: q
}) {
    let K = v6((_) => _.promptCoaching),
        Y = L7(),
        z = !0,
        w = !0,
        H = null,
        $ = TY1.useRef(!1);
    TY1.useEffect(() => {}, [!0, K.tip]);
    let O = TY1.useCallback((_ = "dismissed") => {
        return
    }, [!0, Y]);
    return TY1.useEffect(() => {
        return
    }, [!0, K.tip, A, q, O]), {
        tip: null,
        dismissTip: () => {}
    };
    return {
        tip: null,
        dismissTip: () => O("dismissed")
    }
}
// @from(Ln 479879, Col 4)
TY1
// @from(Ln 479880, Col 4)
Zfq = v(() => {
    d8();
    u6();
    mU1();
    TY1 = o(X1(), 1)
})
// @from(Ln 479887, Col 0)
function MMz(A) {
    return {
        type: "assistant",
        message: A.message,
        uuid: A.uuid,
        requestId: void 0,
        timestamp: new Date().toISOString(),
        error: A.error
    }
}
// @from(Ln 479898, Col 0)
function PMz(A) {
    return {
        type: "stream_event",
        event: A.event
    }
}
// @from(Ln 479905, Col 0)
function WMz(A) {
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
// @from(Ln 479917, Col 0)
function GMz(A) {
    return {
        type: "system",
        subtype: "informational",
        content: `Remote session initialized (model: ${A.model})`,
        level: "info",
        uuid: A.uuid,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 479928, Col 0)
function ZMz(A) {
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
// @from(Ln 479940, Col 0)
function fMz(A) {
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
// @from(Ln 479952, Col 0)
function VMz(A) {
    return {
        type: "system",
        subtype: "compact_boundary",
        content: "Conversation compacted",
        level: "info",
        uuid: A.uuid,
        timestamp: new Date().toISOString(),
        compactMetadata: {
            trigger: A.compact_metadata.trigger,
            preTokens: A.compact_metadata.pre_tokens
        }
    }
}
// @from(Ln 479967, Col 0)
function HE6(A, q) {
    switch (A.type) {
        case "assistant":
            return {
                type: "message", message: MMz(A)
            };
        case "user": {
            if (q?.convertToolResults) {
                let K = A.message?.content;
                if (Array.isArray(K)) return {
                    type: "message",
                    message: c6({
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
                type: "stream_event", event: PMz(A)
            };
        case "result":
            if (A.subtype !== "success") return {
                type: "message",
                message: WMz(A)
            };
            return {
                type: "ignored"
            };
        case "system":
            if (A.subtype === "init") return {
                type: "message",
                message: GMz(A)
            };
            if (A.subtype === "status") {
                let K = ZMz(A);
                return K ? {
                    type: "message",
                    message: K
                } : {
                    type: "ignored"
                }
            }
            if (A.subtype === "compact_boundary") return {
                type: "message",
                message: VMz(A)
            };
            return h(`[sdkMessageAdapter] Ignoring system message subtype: ${A.subtype}`), {
                type: "ignored"
            };
        case "tool_progress":
            return {
                type: "message", message: fMz(A)
            };
        case "auth_status":
            return h("[sdkMessageAdapter] Ignoring auth_status message"), {
                type: "ignored"
            };
        case "tool_use_summary":
            return h("[sdkMessageAdapter] Ignoring tool_use_summary message"), {
                type: "ignored"
            };
        default:
            return h(`[sdkMessageAdapter] Unknown message type: ${A}`), {
                type: "ignored"
            }
    }
}
// @from(Ln 480041, Col 0)
function $E6(A) {
    return A.type === "result"
}
// @from(Ln 480044, Col 4)
pgA = v(() => {
    N8();
    Z6()
})
// @from(Ln 480052, Col 0)
function OE6(A, q) {
    return {
        type: "assistant",
        uuid: NMz(),
        message: {
            id: `remote-${q}`,
            type: "message",
            role: "assistant",
            content: [{
                type: "tool_use",
                id: A.tool_use_id,
                name: A.tool_name,
                input: A.input
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
// @from(Ln 480083, Col 0)
function _E6(A) {
    return {
        name: A,
        inputSchema: {},
        isEnabled: () => !0,
        userFacingName: () => A,
        renderToolUseMessage: (q) => {
            let K = Object.entries(q);
            if (K.length === 0) return "";
            return K.slice(0, 3).map(([Y, z]) => {
                let w = typeof z === "string" ? z : Q1(z);
                return `${Y}: ${w}`
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
// @from(Ln 480107, Col 4)
dgA = v(() => {
    m6()
})
// @from(Ln 480111, Col 0)
function ffq({
    config: A,
    setMessages: q,
    setIsLoading: K,
    onInit: Y,
    setToolUseConfirmQueue: z,
    tools: w,
    setStreamingToolUses: H,
    setStreamMode: $,
    setInProgressToolUseIDs: O
}) {
    let _ = !!A,
        J = ky.useRef(null),
        X = ky.useRef(null),
        D = ky.useRef(!1),
        j = ky.useRef(w);
    ky.useEffect(() => {
        j.current = w
    }, [w]), ky.useEffect(() => {
        if (!A) return;
        h(`[useRemoteSession] Initializing for session ${A.sessionId}`);
        let G = new VQA(A, {
            onMessage: (f) => {
                if (h(`[useRemoteSession] Received message type: ${f.type}`), J.current) clearTimeout(J.current), J.current = null;
                if (f.type === "system" && f.subtype === "init" && Y) h(`[useRemoteSession] Init received with ${f.slash_commands.length} slash commands`), Y(f.slash_commands);
                if ($E6(f)) K(!1);
                let Z = HE6(f);
                if (Z.type === "message") {
                    if (H?.((N) => N.length > 0 ? [] : N), O && Z.message.type === "assistant") {
                        let N = Z.message.message.content.filter((T) => T.type === "tool_use").map((T) => T.id);
                        if (N.length > 0) O((T) => {
                            let k = new Set(T);
                            for (let y of N) k.add(y);
                            return k
                        })
                    }
                    q((N) => [...N, Z.message])
                } else if (Z.type === "stream_event")
                    if (H && $) iW1(Z.event, (N) => q((T) => [...T, N]), () => {}, $, H);
                    else h("[useRemoteSession] Stream event received but streaming callbacks not provided")
            },
            onPermissionRequest: (f, Z) => {
                h(`[useRemoteSession] Permission request for tool: ${f.tool_name}`);
                let N = Tv(j.current, f.tool_name) ?? _E6(f.tool_name),
                    T = OE6(f, Z),
                    k = {
                        behavior: "ask",
                        message: f.description ?? `${f.tool_name} requires permission`,
                        suggestions: f.permission_suggestions,
                        blockedPath: f.blocked_path
                    },
                    y = {
                        assistantMessage: T,
                        tool: N,
                        description: f.description ?? `${f.tool_name} requires permission`,
                        input: f.input,
                        toolUseContext: {},
                        toolUseID: f.tool_use_id,
                        permissionResult: k,
                        permissionPromptStartTimeMs: Date.now(),
                        onUserInteraction() {},
                        onAbort() {
                            let B = {
                                behavior: "deny",
                                message: "User aborted"
                            };
                            G.respondToPermissionRequest(Z, B), z((S) => S.filter((m) => m.toolUseID !== f.tool_use_id))
                        },
                        onAllow(B, S, m) {
                            let b = {
                                behavior: "allow",
                                updatedInput: B
                            };
                            G.respondToPermissionRequest(Z, b), z((g) => g.filter((U) => U.toolUseID !== f.tool_use_id)), K(!0)
                        },
                        onReject(B) {
                            let S = {
                                behavior: "deny",
                                message: B ?? "User denied permission"
                            };
                            G.respondToPermissionRequest(Z, S), z((m) => m.filter((b) => b.toolUseID !== f.tool_use_id))
                        },
                        async recheckPermission() {}
                    };
                z((B) => [...B, y]), K(!1)
            },
            onConnected: () => {
                h("[useRemoteSession] Connected")
            },
            onDisconnected: () => {
                h("[useRemoteSession] Disconnected"), K(!1)
            },
            onError: (f) => {
                h(`[useRemoteSession] Error: ${f.message}`)
            }
        });
        return X.current = G, G.connect(), () => {
            if (h("[useRemoteSession] Cleanup - disconnecting"), J.current) clearTimeout(J.current), J.current = null;
            G.disconnect(), X.current = null
        }
    }, [A, q, K, Y, z, H, $, O]);
    let M = ky.useCallback(async (G) => {
            let f = X.current;
            if (!f) return h("[useRemoteSession] Cannot send - no manager"), !1;
            if (J.current) clearTimeout(J.current);
            K(!0);
            let Z = await f.sendMessage(G);
            if (!Z) return K(!1), !1;
            if (!D.current && A && !A.hasInitialPrompt) {
                D.current = !0;
                let N = A.sessionId,
                    T = typeof G === "string" ? G : G.filter((k) => k.type === "text").map((k) => k.text).join(" ");
                if (T) bi4(T, new AbortController().signal).then((k) => BI4(N, k)).catch((k) => K1(k instanceof Error ? k : Error(`Failed to update session title: ${k}`)))
            }
            return J.current = setTimeout(() => {
                h("[useRemoteSession] Response timeout - attempting reconnect");
                let N = WP("Remote session may be unresponsive. Attempting to reconnect…", "warning");
                q((T) => [...T, N]), f.reconnect()
            }, TMz), Z
        }, [A, K, q]),
        P = ky.useCallback(() => {
            if (J.current) clearTimeout(J.current), J.current = null;
            X.current?.cancelSession(), K(!1)
        }, [K]),
        W = ky.useCallback(() => {
            if (J.current) clearTimeout(J.current), J.current = null;
            X.current?.disconnect(), X.current = null
        }, []);
    return {
        isRemoteMode: _,
        sendMessage: M,
        cancelRequest: P,
        disconnect: W
    }
}
// @from(Ln 480246, Col 4)
ky
// @from(Ln 480246, Col 8)
TMz = 60000
// @from(Ln 480247, Col 4)
Vfq = v(() => {
    NQA();
    pgA();
    Z6();
    y6();
    N8();
    UR();
    Im();
    dgA();
    ky = o(X1(), 1)
})
// @from(Ln 480259, Col 0)
function vMz(A) {
    return typeof A === "object" && A !== null && "type" in A && typeof A.type === "string"
}
// @from(Ln 480262, Col 0)
class cgA {
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
                let w;
                try {
                    w = _A(z)
                } catch {
                    continue
                }
                if (!vMz(w)) continue;
                let H = w;
                if (H.type === "control_request") {
                    if (H.request.subtype === "can_use_tool") {
                        this.callbacks.onPermissionRequest(H.request, H.request_id);
                        continue
                    }
                }
                if (H.type !== "control_request" && H.type !== "control_response" && H.type !== "keep_alive" && H.type !== "control_cancel_request" && H.type !== "streamlined_text" && H.type !== "streamlined_tool_use_summary") this.callbacks.onMessage(H)
            }
        }), this.ws.addEventListener("close", () => {
            this.callbacks.onDisconnected?.()
        }), this.ws.addEventListener("error", () => {
            this.callbacks.onError?.(Error("WebSocket connection error"))
        })
    }
    sendMessage(A) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return !1;
        let q = Q1({
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
        let K = Q1({
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
        let A = Q1({
            type: "control_request",
            request_id: crypto.randomUUID(),
            request: {
                subtype: "interrupt"
            }
        });
        this.ws.send(A)
    }
    disconnect() {
        if (this.ws) this.ws.close(), this.ws = null
    }
    isConnected() {
        return this.ws?.readyState === WebSocket.OPEN
    }
}
// @from(Ln 480352, Col 4)
Nfq = v(() => {
    m6()
})
// @from(Ln 480356, Col 0)
function Tfq({
    config: A,
    setMessages: q,
    setIsLoading: K,
    setToolUseConfirmQueue: Y,
    tools: z
}) {
    let w = !!A,
        H = Ly.useRef(null),
        $ = Ly.useRef(!1),
        O = Ly.useRef(!1),
        _ = Ly.useRef(z);
    Ly.useEffect(() => {
        _.current = z
    }, [z]), Ly.useEffect(() => {
        if (!A) return;
        $.current = !1, h(`[useDirectConnect] Connecting to ${A.wsUrl}`);
        let j = new cgA(A, {
            onMessage: (M) => {
                if ($E6(M)) K(!1);
                if (M.type === "system" && M.subtype === "init") {
                    if ($.current) return;
                    $.current = !0
                }
                let P = HE6(M, {
                    convertToolResults: !0
                });
                if (P.type === "message") q((W) => [...W, P.message])
            },
            onPermissionRequest: (M, P) => {
                h(`[useDirectConnect] Permission request for tool: ${M.tool_name}`);
                let W = Tv(_.current, M.tool_name) ?? _E6(M.tool_name),
                    G = OE6(M, P),
                    f = {
                        behavior: "ask",
                        message: M.description ?? `${M.tool_name} requires permission`,
                        suggestions: M.permission_suggestions,
                        blockedPath: M.blocked_path
                    },
                    Z = {
                        assistantMessage: G,
                        tool: W,
                        description: M.description ?? `${M.tool_name} requires permission`,
                        input: M.input,
                        toolUseContext: {},
                        toolUseID: M.tool_use_id,
                        permissionResult: f,
                        permissionPromptStartTimeMs: Date.now(),
                        onUserInteraction() {},
                        onAbort() {
                            let N = {
                                behavior: "deny",
                                message: "User aborted"
                            };
                            j.respondToPermissionRequest(P, N), Y((T) => T.filter((k) => k.toolUseID !== M.tool_use_id))
                        },
                        onAllow(N, T, k) {
                            let y = {
                                behavior: "allow",
                                updatedInput: N
                            };
                            j.respondToPermissionRequest(P, y), Y((B) => B.filter((S) => S.toolUseID !== M.tool_use_id)), K(!0)
                        },
                        onReject(N) {
                            let T = {
                                behavior: "deny",
                                message: N ?? "User denied permission"
                            };
                            j.respondToPermissionRequest(P, T), Y((k) => k.filter((y) => y.toolUseID !== M.tool_use_id))
                        },
                        async recheckPermission() {}
                    };
                Y((N) => [...N, Z]), K(!1)
            },
            onConnected: () => {
                h("[useDirectConnect] Connected"), O.current = !0
            },
            onDisconnected: () => {
                if (h("[useDirectConnect] Disconnected"), !O.current) process.stderr.write(`
Failed to connect to server at ${A.wsUrl}
`);
                else process.stderr.write(`
Server disconnected.
`);
                O.current = !1, nK(1), K(!1)
            },
            onError: (M) => {
                h(`[useDirectConnect] Error: ${M.message}`)
            }
        });
        return H.current = j, j.connect(), () => {
            h("[useDirectConnect] Cleanup - disconnecting"), j.disconnect(), H.current = null
        }
    }, [A, q, K, Y]);
    let J = Ly.useCallback(async (j) => {
            let M = H.current;
            if (!M) return !1;
            return K(!0), M.sendMessage(j)
        }, [K]),
        X = Ly.useCallback(() => {
            H.current?.sendInterrupt(), K(!1)
        }, [K]),
        D = Ly.useCallback(() => {
            H.current?.disconnect(), H.current = null, O.current = !1
        }, []);
    return {
        isRemoteMode: w,
        sendMessage: J,
        cancelRequest: X,
        disconnect: D
    }
}
// @from(Ln 480468, Col 4)
Ly
// @from(Ln 480469, Col 4)
vfq = v(() => {
    Nfq();
    pgA();
    Z6();
    w$();
    dgA();
    Ly = o(X1(), 1)
})
// @from(Ln 480477, Col 4)
EMz
// @from(Ln 480478, Col 4)
Efq = v(() => {
    i1();
    m1();
    K7();
    iV6();
    EMz = o(X1(), 1)
})
// @from(Ln 480486, Col 0)
function Lfq() {
    kfq.useEffect(() => {
        let A = Math.round(process.uptime() * 1000);
        c("tengu_timer", {
            event: "startup",
            durationMs: A
        }), Dt()
    }, [])
}
// @from(Ln 480495, Col 4)
kfq
// @from(Ln 480496, Col 4)
Rfq = v(() => {
    u6();
    hA();
    G51();
    kfq = o(X1(), 1)
})
// @from(Ln 480503, Col 0)
function yfq() {
    let [A, q] = dc1.useState(() => {
        if (!MV() || i8()) return "valid";
        let {
            key: w,
            source: H
        } = yO({
            skipRetrievingKeyFromApiKeyHelper: !0
        });
        if (w || H === "apiKeyHelper") return "loading";
        return "missing"
    }), [K, Y] = dc1.useState(null), z = dc1.useCallback(async () => {
        if (!MV() || i8()) {
            q("valid");
            return
        }
        let {
            key: w,
            source: H
        } = yO();
        if (!w) {
            if (H === "apiKeyHelper") {
                q("error"), Y(Error("API key helper did not return a valid key"));
                return
            }
            q("missing");
            return
        }
        try {
            let O = await cOq(w, !1) ? "valid" : "invalid";
            q(O);
            return
        } catch ($) {
            Y($), q("error");
            return
        }
    }, []);
    return {
        status: A,
        reverify: z,
        error: K
    }
}
// @from(Ln 480546, Col 4)
dc1
// @from(Ln 480547, Col 4)
Cfq = v(() => {
    yw();
    J7();
    dc1 = o(X1(), 1)
})
// @from(Ln 480552, Col 4)
Sfq = v(() => {
    DJ1();
    Z6();
    N7();
    Tz();
    B6()
})
// @from(Ln 480560, Col 0)
function lgA(A) {
    let q = e(37),
        {
            screen: K,
            setScreen: Y,
            setScreenToggleId: z,
            showAllInTranscript: w,
            setShowAllInTranscript: H,
            messageCount: $,
            onEnterTranscript: O,
            onExitTranscript: _,
            todos: J
        } = A,
        X = v6(xMz),
        D = L7();
    B_();
    let j;
    if (q[0] !== X || q[1] !== D || q[2] !== J) j = () => {
        if (X !== "tasks") u8("todos");
        c("tengu_toggle_todos", {
            is_expanded: X === "tasks",
            has_todos: J && J.length > 0
        }), D(hMz)
    }, q[0] = X, q[1] = D, q[2] = J, q[3] = j;
    else j = q[3];
    let M = j,
        P;
    if (q[4] !== $ || q[5] !== O || q[6] !== _ || q[7] !== K || q[8] !== Y || q[9] !== z || q[10] !== H || q[11] !== w) P = () => {
        let p = K !== "transcript";
        if (u8("transcript-toggle"), c("tengu_toggle_transcript", {
                is_entering: p,
                show_all: w,
                message_count: $
            }), Y(SMz), z(CMz), H(!1), p && O) O();
        if (!p && _) _()
    }, q[4] = $, q[5] = O, q[6] = _, q[7] = K, q[8] = Y, q[9] = z, q[10] = H, q[11] = w, q[12] = P;
    else P = q[12];
    let W = P,
        G;
    if (q[13] !== $ || q[14] !== z || q[15] !== H || q[16] !== w) G = () => {
        c("tengu_transcript_toggle_show_all", {
            is_expanding: !w,
            message_count: $
        }), H(yMz), z(RMz)
    }, q[13] = $, q[14] = z, q[15] = H, q[16] = w, q[17] = G;
    else G = q[17];
    let f = G,
        Z;
    if (q[18] !== $ || q[19] !== _ || q[20] !== Y || q[21] !== z || q[22] !== H || q[23] !== w) Z = () => {
        if (c("tengu_transcript_exit", {
                show_all: w,
                message_count: $
            }), Y("prompt"), z(LMz), H(!1), _) _()
    }, q[18] = $, q[19] = _, q[20] = Y, q[21] = z, q[22] = H, q[23] = w, q[24] = Z;
    else Z = q[24];
    let N = Z,
        T;
    if (q[25] === Symbol.for("react.memo_cache_sentinel")) T = {
        context: "Global"
    }, q[25] = T;
    else T = q[25];
    DA("app:toggleTodos", M, T);
    let k;
    if (q[26] === Symbol.for("react.memo_cache_sentinel")) k = {
        context: "Global"
    }, q[26] = k;
    else k = q[26];
    DA("app:toggleTranscript", W, k);
    let y;
    if (q[27] !== D) y = () => {
        D(kMz)
    }, q[27] = D, q[28] = y;
    else y = q[28];
    let B;
    if (q[29] === Symbol.for("react.memo_cache_sentinel")) B = {
        context: "Global"
    }, q[29] = B;
    else B = q[29];
    DA("app:toggleTeammatePreview", y, B);
    let S;
    if (q[30] !== z) S = () => {}, q[30] = z, q[31] = S;
    else S = q[31];
    let m = S,
        b;
    if (q[32] === Symbol.for("react.memo_cache_sentinel")) b = {
        context: "Global"
    }, q[32] = b;
    else b = q[32];
    DA("app:toggleTerminal", m, b);
    let g = K === "transcript",
        U;
    if (q[33] !== g) U = {
        context: "Transcript",
        isActive: g
    }, q[33] = g, q[34] = U;
    else U = q[34];
    DA("transcript:toggleShowAll", f, U);
    let x;
    if (q[35] !== g) x = {
        context: "Transcript",
        isActive: g
    }, q[35] = g, q[36] = x;
    else x = q[36];
    return DA("transcript:exit", N, x), null
}
// @from(Ln 480666, Col 0)
function kMz(A) {
    return {
        ...A,
        showTeammateMessagePreview: !A.showTeammateMessagePreview
    }
}
// @from(Ln 480673, Col 0)
function LMz(A) {
    return A + 1
}
// @from(Ln 480677, Col 0)
function RMz(A) {
    return A + 1
}
// @from(Ln 480681, Col 0)
function yMz(A) {
    return !A
}
// @from(Ln 480685, Col 0)
function CMz(A) {
    return A + 1
}
// @from(Ln 480689, Col 0)
function SMz(A) {
    return A === "transcript" ? "prompt" : "transcript"
}
// @from(Ln 480693, Col 0)
function hMz(A) {
    let {
        getAllInProcessTeammateTasks: q
    } = (gR(), ay(_R4));
    if (q(A.tasks).filter(IMz).length > 0) switch (A.expandedView) {
        case "none":
            return {
                ...A, expandedView: "tasks"
            };
        case "tasks":
            return {
                ...A, expandedView: "teammates"
            };
        case "teammates":
            return {
                ...A, expandedView: "none"
            }
    }
    return {
        ...A,
        expandedView: A.expandedView === "tasks" ? "none" : "tasks"
    }
}
// @from(Ln 480717, Col 0)
function IMz(A) {
    return A.status === "running"
}
// @from(Ln 480721, Col 0)
function xMz(A) {
    return A.expandedView
}
// @from(Ln 480724, Col 4)
hfq = v(() => {
    i1();
    K7();
    d8();
    u6();
    U4();
    Sfq();
    v3()
})
// @from(Ln 480734, Col 0)
function igA(A) {
    let q = e(8),
        {
            onSubmit: K,
            isActive: Y
        } = A,
        z = Y === void 0 ? !0 : Y,
        w = VL(),
        H = BD1(),
        $;
    A: {
        if (!w) {
            let M;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) M = new Set, q[0] = M;
            else M = q[0];
            $ = M;
            break A
        }
        let j;
        if (q[1] !== w.bindings) {
            j = new Set;
            for (let M of w.bindings)
                if (M.action?.startsWith("command:")) j.add(M.action);
            q[1] = w.bindings, q[2] = j
        } else j = q[2];$ = j
    }
    let O = $,
        _;
    if (q[3] !== O || q[4] !== K) {
        _ = {};
        for (let j of O) {
            let M = j.slice(8);
            _[j] = () => {
                K(`/${M}`, bMz, void 0, {
                    fromKeybinding: !0
                })
            }
        }
        q[3] = O, q[4] = K, q[5] = _
    } else _ = q[5];
    let J = _,
        X = z && !H,
        D;
    if (q[6] !== X) D = {
        context: "Chat",
        isActive: X
    }, q[6] = X, q[7] = D;
    else D = q[7];
    return c7(J, D), null
}
// @from(Ln 480784, Col 4)
bMz
// @from(Ln 480785, Col 4)
Ifq = v(() => {
    i1();
    K7();
    eg();
    oS();
    bMz = {
        setCursorOffset: () => {},
        clearBuffer: () => {},
        resetHistory: () => {}
    }
})
// @from(Ln 480797, Col 0)
function ngA(A) {
    let {
        setToolUseConfirmQueue: q,
        onCancel: K,
        isMessageSelectorVisible: Y,
        screen: z,
        abortSignal: w,
        popCommandFromQueue: H,
        vimMode: $,
        isLocalJSXCommand: O,
        isSearchingHistory: _,
        isHelpOpen: J,
        inputMode: X,
        inputValue: D
    } = A, j = B_(), M = L7(), P = v6((U) => U.queuedCommands.length), W = void 0, G = v6((U) => U.viewSelectionMode), f = v6((U) => Object.values(U.tasks).some((x) => x.type === "local_agent" && x.status === "running")), Z = xfq.useCallback(() => {
        if (w !== void 0 && !w.aborted) {
            c("tengu_cancel", {}), q(() => []), K();
            return
        }
        if (KY() && f) {
            c("tengu_cancel", {}), q(() => []), K();
            return
        }
        if (j.getState().queuedCommands.length > 0) {
            if (H) {
                H();
                return
            }
        }
        c("tengu_cancel", {}), q(() => []), K()
    }, [j, M, w, H, q, K, f]), N = Jk7(), T = w !== void 0 && !w.aborted, k = P > 0, y = X !== void 0 && X !== "prompt" && !D, B = !1, m = z !== "transcript" && !_ && !Y && !O && !J && !N && G !== "viewing-agent" && !(_e() && $ === "INSERT") && (T || k || B || f), b = m && !y && !D, g = B || m;
    return DA("chat:cancel", Z, {
        context: "Chat",
        isActive: b
    }), DA("app:interrupt", Z, {
        context: "Global",
        isActive: g
    }), null
}
// @from(Ln 480836, Col 4)
xfq
// @from(Ln 480837, Col 4)
bfq = v(() => {
    u6();
    DZ1();
    d8();
    K7();
    oS();
    cM();
    xfq = o(X1(), 1)
})
// @from(Ln 480847, Col 0)
function JE6(A) {
    return dv(A).filter((q) => q.status === "running").sort((q, K) => q.identity.agentName.localeCompare(K.identity.agentName))
}
// @from(Ln 480851, Col 0)
function ufq(A) {
    let q = v6((D) => D.tasks),
        K = v6((D) => D.viewSelectionMode),
        Y = v6((D) => D.viewingAgentTaskId),
        z = v6((D) => D.selectedIPAgentIndex),
        w = L7(),
        H = B_(),
        $ = JE6(q),
        O = $.length,
        _ = Object.values(q).some((D) => IN(D) && D.type !== "in_process_teammate"),
        J = XE6.useRef(O);
    XE6.useEffect(() => {
        let D = J.current;
        J.current = O, w((j) => {
            let P = JE6(j.tasks).length;
            if (P === 0 && D > 0 && j.selectedIPAgentIndex !== -1) {
                if (j.viewSelectionMode === "viewing-agent") return {
                    ...j,
                    selectedIPAgentIndex: -1
                };
                return {
                    ...j,
                    selectedIPAgentIndex: -1,
                    viewSelectionMode: "none"
                }
            }
            let W = j.expandedView === "teammates" ? P : P - 1;
            if (P > 0 && j.selectedIPAgentIndex > W) return {
                ...j,
                selectedIPAgentIndex: W
            };
            return j
        })
    }, [O, w]);
    let X = () => {
        if (O === 0) return null;
        let j = $[z];
        if (!j) return null;
        return {
            taskId: j.id,
            task: j
        }
    };
    D8((D, j) => {
        if (j.escape && K === "viewing-agent") {
            let M = Y;
            if (M) {
                let P = q[M];
                if (pO(P) && P.status === "running") {
                    P.currentWorkAbortController?.abort();
                    return
                }
            }
            pI(w);
            return
        }
        if (j.escape && K === "selecting-agent") {
            w((M) => ({
                ...M,
                viewSelectionMode: "none",
                selectedIPAgentIndex: -1
            }));
            return
        }
        if (j.shift && j.upArrow) {
            if (O > 0) w((M) => {
                let W = JE6(M.tasks).length;
                if (W === 0) return M;
                if (M.expandedView !== "teammates") return {
                    ...M,
                    expandedView: "teammates",
                    viewSelectionMode: "selecting-agent",
                    selectedIPAgentIndex: -1
                };
                let G;
                if (M.selectedIPAgentIndex === 0) G = -1;
                else if (M.selectedIPAgentIndex === -1) G = W;
                else G = M.selectedIPAgentIndex - 1;
                return {
                    ...M,
                    selectedIPAgentIndex: G,
                    viewSelectionMode: "selecting-agent"
                }
            });
            else if (_) A?.onOpenBackgroundTasks?.();
            return
        }
        if (j.shift && j.downArrow) {
            if (O > 0) w((M) => {
                let W = JE6(M.tasks).length;
                if (W === 0) return M;
                if (M.expandedView !== "teammates") return {
                    ...M,
                    expandedView: "teammates",
                    viewSelectionMode: "selecting-agent",
                    selectedIPAgentIndex: -1
                };
                let G = W,
                    f = M.selectedIPAgentIndex >= G ? -1 : M.selectedIPAgentIndex + 1;
                return {
                    ...M,
                    selectedIPAgentIndex: f,
                    viewSelectionMode: "selecting-agent"
                }
            });
            else if (_) A?.onOpenBackgroundTasks?.();
            return
        }
        if (D === "f" && K === "selecting-agent" && O > 0) {
            let M = X();
            if (M) ye(M.taskId, w);
            return
        }
        if (j.return && K === "selecting-agent") {
            if (z === -1) pI(w);
            else if (z >= O) w((M) => ({
                ...M,
                expandedView: "none",
                viewSelectionMode: "none",
                selectedIPAgentIndex: -1
            }));
            else {
                let M = X();
                if (M) ye(M.taskId, w)
            }
            return
        }
        if (D === "k" && K === "selecting-agent" && z >= 0) {
            let M = X();
            if (M && M.task.status === "running") bF1.kill(M.taskId, {
                abortController: new AbortController,
                getAppState: async () => H.getState(),
                setAppState: w
            });
            return
        }
    })
}
// @from(Ln 480989, Col 4)
XE6
// @from(Ln 480990, Col 4)
Bfq = v(() => {
    m1();
    d8();
    gR();
    Od1();
    XE6 = o(X1(), 1)
})
// @from(Ln 480998, Col 0)
function rgA(A, q, K) {
    let {
        teamName: Y,
        agentId: z,
        agentName: w
    } = K, H = iX(Y);
    if (!H) {
        h(`[TeammateInit] Team file not found for team: ${Y}`);
        return
    }
    let $ = H.leadAgentId;
    if (H.teamAllowedPaths && H.teamAllowedPaths.length > 0) {
        h(`[TeammateInit] Found ${H.teamAllowedPaths.length} team-wide allowed path(s)`);
        for (let J of H.teamAllowedPaths) {
            let X = J.path.startsWith("/") ? `/${J.path}/**` : `${J.path}/**`;
            h(`[TeammateInit] Applying team permission: ${J.toolName} allowed in ${J.path} (rule: ${X})`), A((D) => ({
                ...D,
                toolPermissionContext: a2(D.toolPermissionContext, {
                    type: "addRules",
                    rules: [{
                        toolName: J.toolName,
                        ruleContent: X
                    }],
                    behavior: "allow",
                    destination: "session"
                })
            }))
        }
    }
    let _ = H.members.find((J) => J.agentId === $)?.name || "team-lead";
    if (z === $) {
        h("[TeammateInit] This agent is the team leader - skipping idle notification hook");
        return
    }
    h(`[TeammateInit] Registering Stop hook for teammate ${w} to notify leader ${_}`), Pw6(A, q, "Stop", "", (J, X) => {
        kj6(Y, w, !1);
        let D = DQ1(w, {
            idleReason: "available",
            summary: WQ1(J)
        });
        return f9(_, {
            from: w,
            text: Q1(D),
            timestamp: new Date().toISOString(),
            color: b$()
        }), h(`[TeammateInit] Sent idle notification to leader ${_}`), !0
    }, "Failed to send idle notification to team leader", {
        timeout: 1e4
    })
}
// @from(Ln 481048, Col 4)
mfq = v(() => {
    eU();
    H$();
    Z6();
    Cz();
    XN();
    CO();
    m6()
})
// @from(Ln 481058, Col 0)
function Qfq(A, q) {
    Ffq.useEffect(() => {
        if (l8()) {
            let K = q?.[0],
                Y = K && "teamName" in K ? K.teamName : void 0,
                z = K && "agentName" in K ? K.agentName : void 0;
            if (Y && z) {
                WDq(A, Y, z);
                let H = iX(Y)?.members.find(($) => $.name === z);
                if (H) rgA(A, U6(), {
                    teamName: Y,
                    agentId: H.agentId,
                    agentName: z
                })
            } else {
                let w = jC1?.();
                if (w?.teamName && w?.agentId && w?.agentName) rgA(A, U6(), {
                    teamName: w.teamName,
                    agentId: w.agentId,
                    agentName: w.agentName
                })
            }
        }
    }, [A, q])
}
// @from(Ln 481083, Col 4)
Ffq
// @from(Ln 481084, Col 4)
gfq = v(() => {
    B6();
    S9();
    mfq();
    aFA();
    XN();
    Cz();
    Ffq = o(X1(), 1)
})
// @from(Ln 481094, Col 0)
function pfq() {
    let A = L7(),
        q = v6((O) => O.viewingAgentTaskId),
        K = v6((O) => O.tasks),
        Y = q ? K[q] : void 0,
        z = Y && pO(Y) ? Y : void 0,
        w = q,
        H = z?.status,
        $ = z?.error;
    Ufq.useEffect(() => {
        if (!w) return;
        if (!z) {
            pI(A);
            return
        }
        if (H === "killed" || H === "failed" || $ || H !== "running" && H !== "completed" && H !== "pending") {
            pI(A);
            return
        }
    }, [w, z, H, $, A])
}
// @from(Ln 481115, Col 4)
Ufq
// @from(Ln 481116, Col 4)
dfq = v(() => {
    d8();
    Od1();
    Ufq = o(X1(), 1)
})
// @from(Ln 481122, Col 0)
function BMz(A) {
    return uMz.includes(A)
}
// @from(Ln 481126, Col 0)
function mMz(A, q, K, Y) {
    let z;
    if (A.getPath && q) {
        let w = A.inputSchema.safeParse(q);
        if (w.success) {
            let H = A.getPath(w.data);
            if (H) z = ae(H)
        }
    }
    return {
        decision: K,
        source: Y,
        tool_name: A.name,
        ...z && {
            language: z
        }
    }
}
// @from(Ln 481145, Col 0)
function FMz(A) {
    switch (A.type) {
        case "hook":
            return "hook";
        case "user":
            return A.permanent ? "user_permanent" : "user_temporary";
        case "user_abort":
            return "user_abort";
        case "user_reject":
            return "user_reject"
    }
}
// @from(Ln 481158, Col 0)
function cc1(A, q, K) {
    return {
        messageID: A,
        toolName: AK(q),
        sandboxEnabled: b8.isSandboxingEnabled(),
        ...K !== void 0 && {
            waiting_for_user_permission_ms: K
        }
    }
}
// @from(Ln 481169, Col 0)
function QMz(A, q, K, Y) {
    if (K === "config") {
        c("tengu_tool_use_granted_in_config", cc1(q, A.name, void 0));
        return
    }
    switch (K.type) {
        case "user":
            c(K.permanent ? "tengu_tool_use_granted_in_prompt_permanent" : "tengu_tool_use_granted_in_prompt_temporary", cc1(q, A.name, Y));
            break;
        case "hook":
            c("tengu_tool_use_granted_by_permission_hook", {
                ...cc1(q, A.name, Y),
                permanent: K.permanent ?? !1
            });
            break
    }
}
// @from(Ln 481187, Col 0)
function gMz(A, q, K, Y) {
    if (K === "config") {
        c("tengu_tool_use_denied_in_config", cc1(q, A.name, void 0));
        return
    }
    c("tengu_tool_use_rejected_in_prompt", {
        ...cc1(q, A.name, Y),
        ...K.type === "hook" ? {
            isHook: !0
        } : {
            hasFeedback: K.type === "user_reject" ? K.hasFeedback : !1
        }
    })
}
// @from(Ln 481202, Col 0)
function DE6(A, q, K) {
    let {
        tool: Y,
        input: z,
        toolUseContext: w,
        messageId: H,
        toolUseID: $
    } = A, {
        decision: O,
        source: _
    } = q, J = K !== void 0 ? Date.now() - K : void 0;
    if (q.decision === "accept") QMz(Y, H, q.source, J);
    else gMz(Y, H, q.source, J);
    let X = _ === "config" ? "config" : FMz(_);
    if (BMz(Y.name)) {
        let D = mMz(Y, z, O, X);
        hL6()?.add(1, D)
    }
    if (!w.toolDecisions) w.toolDecisions = new Map;
    w.toolDecisions.set($, {
        source: X,
        decision: O,
        timestamp: Date.now()
    }), zj("tool_decision", {
        decision: O,
        source: X,
        tool_name: AK(Y.name)
    })
}
// @from(Ln 481231, Col 4)
uMz
// @from(Ln 481232, Col 4)
ogA = v(() => {
    u6();
    U$();
    B6();
    aa();
    wq();
    k2();
    uMz = ["Edit", "Write", "NotebookEdit"]
})
// @from(Ln 481242, Col 0)
function jE6(A) {
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
// @from(Ln 481260, Col 0)
function cfq(A, q, K, Y, z, w, H) {
    let $ = Y.message.id,
        O = {
            tool: A,
            input: q,
            toolUseContext: K,
            assistantMessage: Y,
            messageId: $,
            toolUseID: z,
            logDecision(_, J) {
                DE6({
                    tool: A,
                    input: J?.input ?? q,
                    toolUseContext: K,
                    messageId: $,
                    toolUseID: z
                }, _, J?.permissionPromptStartTimeMs)
            },
            logCancelled() {
                c("tengu_tool_use_cancelled", {
                    messageID: $,
                    toolName: AK(A.name)
                })
            },
            async persistPermissions(_) {
                if (_.length === 0) return !1;
                nC(_);
                let J = await K.getAppState();
                return w(WV(J.toolPermissionContext, _)), _.some((X) => o6A(X.destination))
            },
            resolveIfAborted(_) {
                if (!K.abortController.signal.aborted) return !1;
                return this.logCancelled(), _(this.cancelAndAbort(void 0, !0)), !0
            },
            cancelAndAbort(_, J, X) {
                let D = !!K.agentId,
                    j = _ ? `${D?CQ1:UB1}${_}` : D ? $I : nK1;
                if (J || !_ && !X?.length && !D) h(`Aborting: tool=${A.name} isAbort=${J} hasFeedback=${!!_} isSubagent=${D}`), K.abortController.abort();
                return {
                    behavior: "ask",
                    message: j,
                    contentBlocks: X
                }
            },
            ...{},
            async runHooks(_, J, X, D) {
                for await (let j of I51(A.name, z, q, K, _, J, K.abortController.signal)) if (j.permissionRequestResult) {
                    let M = j.permissionRequestResult;
                    if (M.behavior === "allow") {
                        let P = M.updatedInput ?? X ?? q;
                        return await this.handleHookAllow(P, M.updatedPermissions ?? [], D)
                    } else if (M.behavior === "deny") {
                        if (this.logDecision({
                                decision: "reject",
                                source: {
                                    type: "hook"
                                }
                            }, {
                                permissionPromptStartTimeMs: D
                            }), M.interrupt) h(`Hook interrupt: tool=${A.name} hookMessage=${M.message}`), K.abortController.abort();
                        return this.buildDeny(M.message || "Permission denied by hook", {
                            type: "hook",
                            hookName: "PermissionRequest",
                            reason: M.message
                        })
                    }
                }
                return null
            },
            buildAllow(_, J) {
                return {
                    behavior: "allow",
                    updatedInput: _,
                    userModified: J?.userModified ?? !1,
                    ...J?.decisionReason && {
                        decisionReason: J.decisionReason
                    },
                    ...J?.acceptFeedback && {
                        acceptFeedback: J.acceptFeedback
                    },
                    ...J?.contentBlocks && J.contentBlocks.length > 0 && {
                        contentBlocks: J.contentBlocks
                    }
                }
            },
            buildDeny(_, J) {
                return {
                    behavior: "deny",
                    message: _,
                    decisionReason: J
                }
            },
            async handleUserAllow(_, J, X, D, j) {
                let M = await this.persistPermissions(J);
                this.logDecision({
                    decision: "accept",
                    source: {
                        type: "user",
                        permanent: M
                    }
                }, {
                    input: _,
                    permissionPromptStartTimeMs: D
                });
                let P = A.inputsEquivalent ? !A.inputsEquivalent(q, _) : !1,
                    W = X?.trim();
                return this.buildAllow(_, {
                    userModified: P,
                    acceptFeedback: W || void 0,
                    contentBlocks: j
                })
            },
            async handleHookAllow(_, J, X) {
                let D = await this.persistPermissions(J);
                return this.logDecision({
                    decision: "accept",
                    source: {
                        type: "hook",
                        permanent: D
                    }
                }, {
                    input: _,
                    permissionPromptStartTimeMs: X
                }), this.buildAllow(_, {
                    decisionReason: {
                        type: "hook",
                        hookName: "PermissionRequest"
                    }
                })
            },
            pushToQueue(_) {
                H?.push(_)
            },
            removeFromQueue() {
                H?.remove(z)
            },
            updateQueueItem(_) {
                H?.update(z, _)
            }
        };
    return Object.freeze(O)
}
// @from(Ln 481403, Col 0)
function lfq(A) {
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
// @from(Ln 481419, Col 4)
ME6 = v(() => {
    u6();
    U$();
    N8();
    CO();
    iK1();
    km();
    ogA();
    aM();
    Z6()
})
// @from(Ln 481430, Col 0)
async function ifq(A) {
    let {
        ctx: q,
        updatedInput: K,
        suggestions: Y,
        permissionMode: z
    } = A;
    try {
        let w = await q.runHooks(z, Y, K);
        if (w) return w;
        let H = null;
        if (H) return H
    } catch (w) {
        K1(w instanceof Error ? w : Error(`Automated permission check failed: ${String(w)}`))
    }
    return null
}
// @from(Ln 481447, Col 4)
nfq = v(() => {
    y6()
})
// @from(Ln 481450, Col 0)
async function rfq(A) {
    if (!l8() || !LQ1()) return null;
    let {
        ctx: q,
        description: K,
        updatedInput: Y,
        suggestions: z
    } = A, w = null;
    if (w) return w;
    try {
        let H = () => q.toolUseContext.setAppState((O) => ({
            ...O,
            pendingWorkerRequest: null
        }));
        return await new Promise((O) => {
            let {
                resolve: _,
                claim: J
            } = jE6(O), X = UM6({
                toolName: q.tool.name,
                toolUseId: q.toolUseID,
                input: q.input,
                description: K,
                permissionSuggestions: z
            });
            lM6({
                requestId: X.id,
                toolUseId: q.toolUseID,
                async onAllow(D, j, M, P) {
                    if (!J()) return;
                    H();
                    let W = D && Object.keys(D).length > 0 ? D : q.input;
                    _(await q.handleUserAllow(W, j, M, void 0, P))
                },
                onReject(D, j) {
                    if (!J()) return;
                    H(), q.logDecision({
                        decision: "reject",
                        source: {
                            type: "user_reject",
                            hasFeedback: !!D
                        }
                    }), _(q.cancelAndAbort(D, void 0, j))
                }
            }), pM6(X), q.toolUseContext.setAppState((D) => ({
                ...D,
                pendingWorkerRequest: {
                    toolName: q.tool.name,
                    toolUseId: q.toolUseID,
                    description: K
                }
            })), q.toolUseContext.abortController.signal.addEventListener("abort", () => {
                if (!J()) return;
                H(), q.logCancelled(), _(q.cancelAndAbort(void 0, !0))
            }, {
                once: !0
            })
        })
    } catch (H) {
        return K1(H instanceof Error ? H : Error(`Failed to submit swarm permission request: ${String(H)}`)), null
    }
}
// @from(Ln 481512, Col 4)
ofq = v(() => {
    ME6();
    y6();
    S9();
    tP1();
    yQ1()
})
// @from(Ln 481520, Col 0)
function sfq(A, q) {
    let {
        ctx: K,
        description: Y,
        result: z,
        awaitAutomatedChecksBeforeDialog: w
    } = A, {
        resolve: H,
        isResolved: $,
        claim: O
    } = jE6(q), _ = !1, J, X = Date.now(), D = z.updatedInput ?? K.input;

    function j() {}
    if (K.pushToQueue({
            assistantMessage: K.assistantMessage,
            tool: K.tool,
            description: Y,
            input: D,
            toolUseContext: K.toolUseContext,
            toolUseID: K.toolUseID,
            permissionResult: z,
            permissionPromptStartTimeMs: X,
            ...{},
            onUserInteraction() {
                if (Date.now() - X < 200) return;
                _ = !0, _X6(K.toolUseID), j()
            },
            onDismissCheckmark() {
                if (J) clearTimeout(J), J = void 0, K.removeFromQueue()
            },
            onAbort() {
                if (!O()) return;
                K.logCancelled(), K.logDecision({
                    decision: "reject",
                    source: {
                        type: "user_abort"
                    }
                }, {
                    permissionPromptStartTimeMs: X
                }), H(K.cancelAndAbort(void 0, !0))
            },
            async onAllow(M, P, W, G) {
                if (!O()) return;
                H(await K.handleUserAllow(M, P, W, X, G))
            },
            onReject(M, P) {
                if (!O()) return;
                K.logDecision({
                    decision: "reject",
                    source: {
                        type: "user_reject",
                        hasFeedback: !!M
                    }
                }, {
                    permissionPromptStartTimeMs: X
                }), H(K.cancelAndAbort(M, void 0, P))
            },
            async recheckPermission() {
                if ($()) return;
                let M = await uX(K.tool, K.input, K.toolUseContext, K.assistantMessage, K.toolUseID);
                if (M.behavior === "allow") K.removeFromQueue(), K.logDecision({
                    decision: "accept",
                    source: "config"
                }), H(K.buildAllow(M.updatedInput ?? K.input))
            }
        }), !w)(async () => {
        if ($()) return;
        let M = await K.toolUseContext.getAppState(),
            P = await K.runHooks(M.toolPermissionContext.mode, z.suggestions, z.updatedInput, X);
        if (!P || !O()) return;
        K.removeFromQueue(), H(P)
    })()
}
// @from(Ln 481593, Col 4)
tfq = v(() => {
    u6();
    U$();
    iK1();
    PJ();
    km();
    MJ1();
    ME6()
})
// @from(Ln 481603, Col 0)
function UMz(A, q) {
    return AVq.useCallback(async (K, Y, z, w, H, $) => {
        return new Promise((O) => {
            let _ = cfq(K, Y, z, w, H, q, lfq(A));
            if (_.resolveIfAborted(O)) return;
            return ($ !== void 0 ? Promise.resolve($) : uX(K, Y, z, w, H)).then(async (X) => {
                if (_X6(H), X.behavior === "allow") {
                    _.logDecision({
                        decision: "accept",
                        source: "config"
                    }), O(_.buildAllow(X.updatedInput ?? Y, {
                        decisionReason: X.decisionReason
                    }));
                    return
                }
                let D = await z.getAppState(),
                    j = await K.description(Y, {
                        isNonInteractiveSession: z.options.isNonInteractiveSession,
                        toolPermissionContext: D.toolPermissionContext,
                        tools: z.options.tools
                    });
                if (_.resolveIfAborted(O)) return;
                switch (X.behavior) {
                    case "deny": {
                        DE6({
                            tool: K,
                            input: Y,
                            toolUseContext: z,
                            messageId: _.messageId,
                            toolUseID: H
                        }, {
                            decision: "reject",
                            source: "config"
                        }), O(X);
                        return
                    }
                    case "ask": {
                        if (D.toolPermissionContext.awaitAutomatedChecksBeforeDialog) {
                            let P = await ifq({
                                ctx: _,
                                ...{},
                                updatedInput: X.updatedInput,
                                suggestions: X.suggestions,
                                permissionMode: D.toolPermissionContext.mode
                            });
                            if (P) {
                                O(P);
                                return
                            }
                        }
                        if (_.resolveIfAborted(O)) return;
                        let M = await rfq({
                            ctx: _,
                            description: j,
                            ...{},
                            updatedInput: X.updatedInput,
                            suggestions: X.suggestions
                        });
                        if (M) {
                            O(M);
                            return
                        }
                        sfq({
                            ctx: _,
                            description: j,
                            result: X,
                            awaitAutomatedChecksBeforeDialog: D.toolPermissionContext.awaitAutomatedChecksBeforeDialog
                        }, O);
                        return
                    }
                }
            }).catch((X) => {
                if (X instanceof dz || X instanceof Oz) h(`Permission check threw ${X.constructor.name} for tool=${K.name}: ${X.message}`), _.logCancelled(), O(_.cancelAndAbort(void 0, !0));
                else K1(X), O(_.cancelAndAbort(void 0, !0))
            })
        })
    }, [A, q])
}
// @from(Ln 481681, Col 4)
AVq
// @from(Ln 481681, Col 9)
qVq
// @from(Ln 481682, Col 4)
KVq = v(() => {
    PJ();
    u6();
    U$();
    qH();
    GV();
    iK1();
    y6();
    Z6();
    m6();
    ogA();
    ME6();
    nfq();
    ofq();
    tfq();
    km();
    AVq = o(X1(), 1);
    qVq = UMz
})
// @from(Ln 481702, Col 0)
function dMz() {
    gx1(), Qx1(""), w3(0)
}
// @from(Ln 481705, Col 0)
async function PE6(A) {
    let {
        input: q,
        helpers: K,
        isLoading: Y,
        mode: z,
        commands: w,
        onInputChange: H,
        setPastedContents: $,
        setIsLoading: O,
        setToolJSX: _,
        getToolUseContext: J,
        messages: X,
        mainLoopModel: D,
        pastedContents: j,
        ideSelection: M,
        setUserInputOnProcessing: P,
        setAbortController: W,
        onQuery: G,
        resetLoadingState: f,
        thinkingEnabled: Z,
        setAppState: N,
        onBeforeQuery: T,
        canUseTool: k
    } = A, {
        setCursorOffset: y,
        clearBuffer: B,
        resetHistory: S
    } = K, m = Object.values(j).some((x) => x.type === "image");
    if (q.trim() === "" && !m) return;
    if (["exit", "quit", ":q", ":q!", ":wq", ":wq!"].includes(q.trim())) {
        if (w.find((p) => p.name === "exit")) PE6({
            ...A,
            input: "/exit"
        });
        else dMz();
        return
    }
    if (q.trim().startsWith("/")) {
        let x = q.trim(),
            p = x.indexOf(" "),
            l = p === -1 ? x.slice(1) : x.slice(1, p),
            r = p === -1 ? "" : x.slice(p + 1).trim(),
            s = w.find((O1) => O1.immediate && O1.isEnabled() && (O1.name === l || O1.aliases?.includes(l) || O1.userFacingName() === l));
        if (s && s.type === "local-jsx") {
            H(""), y(0), B();
            let O1 = J(X, [], Aq(), [], void 0, D),
                T1 = (q1, t) => {
                    if (_({
                            jsx: null,
                            shouldHidePromptInput: !1,
                            clearLocalJSX: !0
                        }), q1 && t?.display !== "skip" && A.addNotification) A.addNotification({
                        key: `immediate-${s.name}`,
                        text: q1,
                        priority: "low"
                    });
                    if (t?.nextInput)
                        if (t.submitNextInput) lB({
                            value: t.nextInput,
                            mode: "prompt"
                        }, N);
                        else H(t.nextInput)
                },
                j1 = await (await s.load()).call(T1, O1, r);
            if (j1) _({
                jsx: j1,
                shouldHidePromptInput: !1,
                isLocalJSXCommand: !0
            });
            return
        }
    }
    let b = q,
        g = ID1(q),
        U = 0;
    for (let x of g) {
        let p = j[x.id];
        if (p && p.type === "text") b = b.replace(x.match, p.content), U++
    }
    if (c("tengu_paste_text", {
            pastedTextCount: U
        }), Y) {
        if (z !== "prompt") return;
        let x, p;
        if (m) x = nMz(b, j), p = Object.values(j).filter((l) => l.type === "image").map((l) => l.id);
        else x = b.trim();
        lB({
            value: x,
            mode: "prompt",
            imagePasteIds: p
        }, N), H(""), y(0), $({}), S(), B();
        return
    }
    l1q(), await cMz({
        input: b,
        mode: z,
        messages: X,
        mainLoopModel: D,
        pastedContents: j,
        ideSelection: M,
        thinkingEnabled: Z,
        querySource: A.querySource,
        commands: w,
        isLoading: Y,
        setIsLoading: O,
        setToolJSX: _,
        getToolUseContext: J,
        setUserInputOnProcessing: P,
        setAbortController: W,
        onQuery: G,
        resetLoadingState: f,
        setAppState: N,
        onBeforeQuery: T,
        resetHistory: S,
        canUseTool: k,
        onInputChange: H
    })
}
// @from(Ln 481824, Col 0)
async function cMz(A) {
    let {
        input: q,
        mode: K,
        messages: Y,
        mainLoopModel: z,
        pastedContents: w,
        ideSelection: H,
        thinkingEnabled: $,
        querySource: O,
        isLoading: _,
        setIsLoading: J,
        setToolJSX: X,
        getToolUseContext: D,
        setUserInputOnProcessing: j,
        setAbortController: M,
        onQuery: P,
        setAppState: W,
        onBeforeQuery: G,
        resetHistory: f,
        canUseTool: Z
    } = A, N = !_, T = Aq();
    if (N) M(T);
    try {
        let k = lMz(K, $, z);
        y3("query_process_user_input_start");
        let {
            messages: y,
            shouldQuery: B,
            allowedTools: S,
            maxThinkingTokens: m,
            model: b,
            nextInput: g,
            submitNextInput: U
        } = await Vv6({
            input: q,
            mode: K,
            setIsLoading: J,
            setToolJSX: X,
            context: D(Y, [], T, [], void 0, z),
            pastedContents: w,
            ideSelection: H,
            messages: Y,
            setUserInputOnProcessing: j,
            isAlreadyProcessing: _,
            thinkingMetadata: k,
            querySource: O,
            canUseTool: Z
        });
        if (y3("query_process_user_input_end"), z2()) y3("query_file_history_snapshot_start"), y.filter(Zc1).forEach((x) => {
            WW1((p) => {
                W((l) => ({
                    ...l,
                    fileHistory: p(l.fileHistory)
                }))
            }, x.uuid)
        }), y3("query_file_history_snapshot_end");
        if (y.length) f(), X({
            jsx: null,
            shouldHidePromptInput: !1,
            clearLocalJSX: !0
        }), await P(y, T, B, S ?? [], b ?? z, m, K === "prompt" ? G : void 0, q);
        else if (J(!1), X({
                jsx: null,
                shouldHidePromptInput: !1,
                clearLocalJSX: !0
            }), f(), !_) M(null);
        if (g)
            if (U) lB({
                value: g,
                mode: "prompt"
            }, W);
            else A.onInputChange(g)
    } finally {
        J(!1)
    }
}
// @from(Ln 481902, Col 0)
function lMz(A, q, K) {
    if (A !== "prompt") return;
    return {
        maxThinkingTokens: q === !1 ? 0 : q === !0 ? rz1(K) : void 0
    }
}
// @from(Ln 481909, Col 0)
function iMz(A) {
    return A === "image/jpeg" || A === "image/png" || A === "image/gif" || A === "image/webp"
}