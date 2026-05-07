
// @from(Ln 547348, Col 0)
function GW7({
    commands: q,
    debug: K,
    initialTools: _,
    initialMessages: z,
    pendingHookMessages: Y,
    initialFileHistorySnapshots: A,
    initialContentReplacements: O,
    initialAgentName: w,
    initialAgentColor: $,
    mcpClients: j,
    dynamicMcpConfig: H,
    autoConnectIdeFlag: J,
    strictMcpConfig: X = !1,
    systemPrompt: M,
    appendSystemPrompt: P,
    onBeforeQuery: W,
    onTurnComplete: D,
    disabled: Z = !1,
    mainThreadAgentDefinition: G,
    disableSlashCommands: f = !1,
    remoteSessionConfig: v,
    directConnectConfig: V,
    sshSession: k,
    thinkingConfig: N
}) {
    let R = !!v,
        h = X1.useMemo(() => S6(process.env.CLAUDE_CODE_DISABLE_TERMINAL_TITLE), []),
        C = X1.useMemo(() => !1, []),
        x = X1.useMemo(() => S6(process.env.CLAUDE_CODE_DISABLE_VIRTUAL_SCROLL), []),
        B = !1;
    X1.useEffect(() => {
        return E(`[REPL:mount] REPL mounted, disabled=${Z}`), () => E("[REPL:unmount] REPL unmounting")
    }, [Z]);
    let [m, S] = X1.useState(G), F = M8((J8) => J8.toolPermissionContext), U = M8((J8) => J8.verbose), g = M8((J8) => J8.mcp), c = M8((J8) => J8.plugins), n = M8((J8) => J8.agentDefinitions), l = M8((J8) => J8.initialMessage), z6 = cn(), A6 = M8((J8) => J8.expandedView) === "tasks", e = M8((J8) => J8.pendingWorkerRequest), i = M8((J8) => J8.pendingSandboxRequest), O6 = M8((J8) => J8.teamContext), J6 = M8((J8) => J8.tasks), $6 = M8((J8) => J8.workerSandboxPermissions), H6 = M8((J8) => J8.elicitation), q6 = M8((J8) => J8.ultraplanPendingChoice), o = M8((J8) => J8.ultraplanLaunchPending), _6 = M8((J8) => J8.viewingAgentTaskId), r = R7(), t = _6 ? J6[_6] : void 0, Y6 = sD(t) && t.retain && !t.diskLoaded;
    X1.useEffect(() => {
        if (!_6 || !Y6) return;
        let J8 = _6;
        O36(w2(J8)).then((c8) => {
            r((D1) => {
                let b7 = D1.tasks[J8];
                if (!sD(b7) || b7.diskLoaded || !b7.retain) return D1;
                let zq = b7.messages ?? [],
                    q4 = new Set(zq.map((qq) => qq.uuid)),
                    Hq = c8 ? c8.messages.filter((qq) => !q4.has(qq.uuid)) : [];
                return {
                    ...D1,
                    tasks: {
                        ...D1.tasks,
                        [J8]: {
                            ...b7,
                            messages: [...Hq, ...zq],
                            diskLoaded: !0
                        }
                    }
                }
            })
        })
    }, [_6, Y6, r]);
    let X6 = H9(),
        M6 = X1.useMemo(() => Uk(() => X6.getState(), r), [X6, r]),
        W6 = X1.useMemo(() => AW6(() => X6.getState(), r), [X6, r]),
        V6 = fd(),
        f6 = s2(),
        [G6, k6] = X1.useState(q);
    Gz5(R ? void 0 : c9(), k6);
    let T6 = M8((J8) => J8.isBriefOnly),
        v6 = X1.useMemo(() => YZ(F), [F, T6]);
    f$K(), G$K();
    let [L6, y6] = X1.useState(H), c6 = X1.useCallback((J8) => {
        y6(J8)
    }, [y6]), [Z8, N8] = X1.useState("prompt"), [R6, p6] = X1.useState(!1), [q8, L8] = X1.useState(!1), [w8, x8] = X1.useState(""), a6 = X1.useRef(0), D8 = X1.useRef(void 0), Q6 = X1.useRef(!1), {
        addNotification: W8,
        removeNotification: G8
    } = EK(), s6 = R2A, u6 = Wz5(j, g.clients), [h6, _8] = X1.useState(void 0), [R8, x6] = X1.useState(null), [i6, v8] = X1.useState(null), [f1, g8] = X1.useState(!1), [w6, D6] = X1.useState(() => {
        return !1
    }), U6 = M8((J8) => J8.showRemoteCallout), [F6, z8] = X1.useState(() => FY5());
    _O5(), YO5(), eA5({
        ideSelection: h6,
        mcpClients: u6,
        ideInstallationStatus: i6
    }), OA5({
        mcpClients: u6
    }), $A5(), SA5(), bA5(), Zi8(), UA5(f6), PO5(), dA5(f6), lA5(), sA5(), rA5(), L2A(), NY5(), SY5(), xY5(), HA5(), jO5();
    let {
        recommendation: l6,
        handleResponse: j8
    } = TA5(), {
        recommendation: f8,
        handleResponse: p8
    } = EA5(), {
        pending: o8,
        handleAction: n1,
        skipForSession: c1
    } = y2A(), dq = X1.useMemo(() => {
        return [...v6, ..._]
    }, [v6, _]);
    Ht8({
        enabled: !R
    }), kz5({
        enabled: !R
    });
    let uq = IAK();
    X1.useEffect(() => {
        if (R) return;
        BA5(r)
    }, [r, R]), mY5(R ? fW7 : u6, F.mode), X1.useEffect(() => {
        pH7(F.mode)
    }, [F.mode]), m_5(r, z, {
        enabled: !R
    });
    let h4 = $o8(dq, g.tools, F),
        {
            tools: cq,
            allowedAgentTypes: C1
        } = X1.useMemo(() => {
            if (!m) return {
                tools: h4,
                allowedAgentTypes: void 0
            };
            let J8 = lt(m, h4, !1, !0);
            return {
                tools: J8.resolvedTools,
                allowedAgentTypes: J8.allowedAgentTypes
            }
        }, [m, h4]),
        W7 = X1.useRef(cq);
    W7.current = cq;
    let $4 = X1.useMemo(() => {
            if (!JJ()) return cq;
            let J8 = new Set(cq.map((D1) => D1.name)),
                c8 = I96().filter((D1) => !J8.has(D1.name));
            return c8.length > 0 ? [...cq, ...c8] : cq
        }, [cq]),
        t4 = SP7(G6, c.commands),
        x4 = SP7(t4, g.commands),
        DK = X1.useMemo(() => f ? [] : x4, [f, x4]);
    Iq5(R ? fW7 : g.clients), Lz5(R ? fW7 : g.clients, _8);
    let [_q, QY] = X1.useState([]), [vz, JY] = X1.useState(null);
    X1.useEffect(() => {
        if (vz && !vz.isStreaming && vz.streamingEndedAt) {
            let c8 = 30000 - (Date.now() - vz.streamingEndedAt);
            if (c8 > 0) {
                let D1 = setTimeout(JY, c8, null);
                return () => clearTimeout(D1)
            } else JY(null)
        }
    }, [vz]);
    let [U3, DA] = X1.useState(null), U9 = X1.useRef(null);
    U9.current = U3;
    let BH = X1.useRef(() => {}),
        gj = X1.useRef(() => {}),
        FA = X1.useRef(null),
        UG = X1.useRef(null),
        QG = X1.useRef(0),
        XY = l8.useRef(new MX7).current,
        UX = l8.useSyncExternalStore(XY.subscribe, XY.getSnapshot),
        [gA, ZA] = l8.useState(v?.hasInitialPrompt ?? !1),
        k4 = UX || gA,
        [fA, MY] = l8.useState(void 0),
        UA = l8.useRef(0),
        PY = l8.useRef(!1),
        Q9 = l8.useRef(0),
        ww = l8.useRef(0),
        gw = l8.useRef(null),
        QJ = l8.useCallback(() => {
            Q9.current = Date.now(), ww.current = 0, gw.current = null
        }, []),
        h0 = l8.useRef(!1);
    if (UX && !h0.current) QJ();
    h0.current = UX;
    let $$ = l8.useCallback((J8) => {
            if (ZA(J8), J8) QJ()
        }, [QJ]),
        j$ = l8.useRef(null),
        a$ = l8.useRef(void 0),
        dJ = l8.useRef(void 0),
        dY = 1500,
        [V2, F1] = l8.useState(!1);
    X1.useEffect(() => {
        if (lq()) $K4().then((J8) => {
            if (J8) W8({
                key: "tmux-mouse-hint",
                text: J8,
                priority: "low"
            })
        });
        jK4().then((J8) => {
            if (J8) W8({
                key: "tmux-focus-hint",
                text: J8,
                priority: "low"
            })
        })
    }, []);
    let [Mq, p4] = X1.useState(!1);
    X1.useEffect(() => {}, []);
    let [Gq, P4] = X1.useState(null), Z3 = X1.useRef(null), Q5 = X1.useCallback((J8) => {
        if (J8?.isLocalJSXCommand) {
            let {
                clearLocalJSX: c8,
                ...D1
            } = J8;
            Z3.current = {
                ...D1,
                isLocalJSXCommand: !0
            }, P4(D1);
            return
        }
        if (Z3.current) {
            if (J8?.clearLocalJSX) {
                Z3.current = null, P4(null);
                return
            }
            return
        }
        if (J8?.clearLocalJSX) {
            P4(null);
            return
        }
        P4(J8)
    }, []), [Q3, e4] = X1.useState(() => new Map), T5 = X1.useCallback((J8) => {
        e4((c8) => oz5(c8, J8))
    }, []), [i4, h9] = X1.useState([]), wz = X1.useMemo(() => a75(h9), [h9]), [WY, cJ] = X1.useState(null), [JO, pH] = X1.useState([]), [Uw, H$] = X1.useState([]), WW = X1.useRef(new Map), VZ = M8((J8) => J8.settings.terminalTitleFromRename) !== !1, nM = l8.useSyncExternalStore(mH7, () => VZ ? NH(I8()) : void 0);
    X1.useEffect(() => {
        return xH7(() => {
            let J8 = IH7();
            if (!J8) return;
            r((c8) => {
                if (c8.standaloneAgentContext?.name === J8) return c8;
                return {
                    ...c8,
                    standaloneAgentContext: {
                        ...c8.standaloneAgentContext,
                        name: J8
                    }
                }
            })
        })
    }, [r]);
    let [s$, NN] = X1.useState(), kZ = X1.useRef((z?.length ?? 0) > 0), nz = m?.agentType, J$ = nM ?? nz ?? s$ ?? "Claude Code", KC = i4.length > 0 || Uw.length > 0 || e || i, lJ = Gq?.isLocalJSXCommand === !0 && Gq?.jsx != null, nJ = KC || lJ ? "waiting" : k4 || X65(J6) ? "busy" : "idle", DY = nJ === "idle" && M65(J6) ? "busy" : nJ, LL = nJ === "busy";
    X1.useEffect(() => {
        if (nJ === "busy") return B75(), () => p75()
    }, [nJ]);
    let NZ = nJ !== "waiting" ? void 0 : i4.length > 0 ? `approve ${i4[0].tool.name}` : e ? "worker request" : i ? "sandbox request" : lJ ? "dialog open" : "input needed";
    X1.useEffect(() => {}, [DY, NZ]);
    let cY = u8("tengu_terminal_sidebar", !1) && (H8().showStatusInTerminalTab ?? !1),
        hL = M8((J8) => J8.postTurnSummary?.status_detail);
    pE8(h || !cY ? null : nJ, hL), X1.useEffect(() => {
        return zNK(wz), () => YNK()
    }, [wz]);
    let [_K, r4] = X1.useState(z ?? []), d5 = X1.useRef(_K), GA = X1.useRef(!1), cK = X1.useCallback((J8) => {
        let c8 = d5.current,
            D1 = typeof J8 === "function" ? J8(d5.current) : J8;
        if (d5.current = D1, D1.length < UA.current) UA.current = 0, PY.current = !1, MY(void 0);
        else if (D1.length > c8.length && PY.current) {
            let b7 = D1.length - c8.length;
            if ((c8.length === 0 || D1[0] === c8[0] ? D1.slice(-b7) : D1.slice(0, b7)).some(a88)) PY.current = !1;
            else UA.current = D1.length
        }
        r4(D1)
    }, []), eT = X1.useCallback((J8) => {
        if (J8 !== void 0) UA.current = d5.current.length, PY.current = !0;
        else PY.current = !1;
        MY(J8)
    }, []), {
        dividerIndex: _C,
        dividerYRef: iM,
        onScrollAway: RL,
        onRepin: dG,
        jumpToNew: X$,
        shiftDivider: R0
    } = EcK(_K.length);
    hY5(_K, cK, k4, QG);
    let [cG, SL] = X1.useState(null), cu = X1.useRef(cG);
    cu.current = cG;
    let qi = X1.useRef(null),
        Q66 = X1.useMemo(() => ycK(_K, _C), [_C, _K.length]),
        QA = X1.useCallback((J8 = !1) => {
            if (!J8 && !H8().autoScrollEnabled) return;
            if (FA.current?.scrollToBottom(), dG(), cu.current !== null) SL(null)
        }, [dG]),
        zC = _K.at(-1),
        m6 = zC != null && a88(zC);
    X1.useEffect(() => {
        if (m6) QA()
    }, [m6, zC, QA]);
    let {
        maybeLoadOlder: n6
    } = C2A, F8 = X1.useCallback((J8, c8) => {
        if (QG.current = Date.now(), J8) dG();
        else RL(c8)
    }, [dG, RL, n6]), I1 = T_5(Y, cK), [$7, nq] = X1.useState(null);
    X1.useState(() => {
        return rg8(WI1()), null
    });
    let ZK = X1.useRef(qjK()),
        A9 = e$K(),
        dA = X1.useCallback(() => F1(!1), []),
        bO = ra(dA, dY),
        DW = X1.useRef(null),
        $z = X1.useCallback((J8) => {
            if (s6(ZK.current, J8)) return;
            if (ZK.current === "" && J8 !== "" && Date.now() - QG.current >= b2A) QA();
            ZK.current = J8, rg8(J8), mt.recordUserActivity(), hi(!0);
            let c8 = J8.trim().length > 0;
            if (F1(c8), c8) bO();
            else bO.cancel()
        }, [F1, QA, s6, bO]),
        [dX, FH] = X1.useState("prompt"),
        [k2, CL] = X1.useState(),
        xz6 = X1.useCallback((J8) => {
            let c8 = new Set(J8);
            k6((D1) => D1.filter((b7) => c8.has(b7.name) || MH7.has(b7)))
        }, [k6]),
        [lu, d66] = X1.useState(new Set),
        uz6 = X1.useCallback((J8) => {
            d66((c8) => {
                switch (J8.action) {
                    case "add": {
                        let D1 = new Set(c8);
                        for (let b7 of J8.ids) D1.add(b7);
                        return D1
                    }
                    case "remove": {
                        let D1 = new Set(c8);
                        for (let b7 of J8.ids) D1.delete(b7);
                        return D1.size === c8.size ? c8 : D1
                    }
                    case "clear":
                        return c8.size > 0 ? new Set : c8
                }
            })
        }, []),
        Ki = X1.useRef(!1),
        bL = X1.useRef(0),
        cX = X1.useRef([]),
        nu = X1.useRef(0),
        c66 = X1.useCallback((J8) => {
            bL.current += J8;
            let c8 = cX.current;
            if (J8 > 0 && c8.length > 0) {
                let D1 = c8.at(-1);
                if (D1.outputTokens == null) D1.lastTokenTime = Date.now(), D1.endResponseLength = bL.current
            }
        }, []),
        l66 = X1.useCallback(() => {
            bL.current = 0
        }, []),
        lG = X1.useCallback((J8) => {
            if (J8.type === "start") {
                let c8 = Date.now(),
                    D1 = bL.current;
                cX.current.push({
                    id: J8.id,
                    ttftMs: J8.ttftMs,
                    firstTokenTime: c8,
                    lastTokenTime: c8,
                    responseLengthBaseline: D1,
                    endResponseLength: D1
                })
            } else {
                let c8 = J8.id != null ? cX.current.find((D1) => D1.id === J8.id) : cX.current.at(-1);
                if (c8) c8.outputTokens = J8.outputTokens, c8.lastTokenTime = Date.now()
            }
        }, []),
        yg = Q95({
            config: v,
            setMessages: cK,
            setIsLoading: $$,
            onInit: xz6,
            setToolUseConfirmQueue: wz,
            tools: dq,
            setStreamingToolUses: QY,
            setStreamMode: B48,
            setInProgressToolUseIDs: uz6,
            recordApiMetricsEvent: lG
        }),
        n66 = l95({
            config: V,
            setMessages: cK,
            setIsLoading: $$,
            setToolUseConfirmQueue: wz,
            tools: dq
        }),
        _i = i95({
            session: k,
            setMessages: cK,
            setIsLoading: $$,
            setToolUseConfirmQueue: wz,
            tools: dq,
            permissionMode: F.mode
        }),
        IL = _i.isRemoteMode ? _i : n66.isRemoteMode ? n66 : yg,
        [EN, gH] = X1.useState({}),
        [qV, i66] = X1.useState(0),
        [YC, xL] = X1.useState(null),
        zi = !(M8((J8) => J8.settings.prefersReducedMotion) ?? !1) && !c_4(),
        r66 = X1.useCallback((J8) => {
            if (!zi) return;
            xL(J8)
        }, [zi]),
        Yi = YC && zi ? YC.substring(0, YC.lastIndexOf(`
`) + 1) || null : null,
        [S0, AC] = X1.useState(0),
        [o66, Lg] = X1.useState(!1),
        [hg, nG] = X1.useState(void 0),
        [Ai, Oi] = X1.useState(!1),
        [a66, iG] = X1.useState(J06()),
        [OC, iu] = X1.useState(null),
        s66 = X1.useRef(S0);
    s66.current = S0;
    let [wi] = X1.useState(() => ({
        current: uZ4(z, O)
    })), [ru] = X1.useState(() => ({
        current: kI4(z ?? [])
    })), [t66, T8] = X1.useState(H8().hasAcknowledgedCostThreshold), [g1, iq] = X1.useState(!1), [L3, P9] = X1.useState(!1), $w = X1.useRef("INSERT");
    X1.useEffect(() => {
        if (q6 && g1) iq(!1)
    }, [q6, g1]);
    let Uj = K2(),
        IO = X1.useRef(Uj);
    IO.current = Uj;
    let [rM] = Zq(), M$ = l8.useRef(!1), Rg = X1.useCallback(() => {
        if (M$.current) return;
        M$.current = !0;
        let J8 = d5.current.slice(Fz6.current);
        for (let c8 of Ja1(J8)) pz6.current.add(c8);
        Fz6.current = d5.current.length, QY5({
            theme: rM,
            readFileState: jC.current,
            bashTools: pz6.current
        }).then(async (c8) => {
            if (c8) {
                let D1 = await c8.content({
                    theme: rM
                });
                r((b7) => ({
                    ...b7,
                    spinnerTip: D1
                })), dY5(c8)
            } else r((D1) => {
                if (D1.spinnerTip === void 0) return D1;
                return {
                    ...D1,
                    spinnerTip: void 0
                }
            })
        })
    }, [r, rM]), ZW = X1.useCallback(() => {
        $$(!1), eT(void 0), bL.current = 0, cX.current = [], nu.current++, xL(null), QY([]), B17(), B48("responding"), Rg(), Uc(), Vx8()
    }, [Rg]), wC = X1.useMemo(() => wJ6(J6).some((J8) => J8.status === "running"), [J6]);
    X1.useEffect(() => {
        if (!wC && j$.current !== null) {
            let J8 = Date.now() - j$.current,
                c8 = a$.current;
            j$.current = null, a$.current = void 0, cK((D1) => [...D1, YA7(J8, c8, w7(D1, GW6))])
        }
    }, [wC, cK]);
    let uL = X1.useRef(!1);
    X1.useEffect(() => {
        {
            if (F.mode !== "auto") {
                uL.current = !1;
                return
            }
            if (uL.current) return;
            if ((H8().autoPermissionsNotificationCount ?? 0) >= 3) return;
            let D1 = setTimeout((b7, zq) => {
                b7.current = !0, d8((q4) => {
                    let Hq = q4.autoPermissionsNotificationCount ?? 0;
                    if (Hq >= 3) return q4;
                    return {
                        ...q4,
                        autoPermissionsNotificationCount: Hq + 1
                    }
                }), zq((q4) => [...q4, eO(bs8, "warning")])
            }, 800, uL, cK);
            return () => clearTimeout(D1)
        }
    }, [F.mode, cK]);
    let $A8 = X1.useRef(!1),
        f06 = X1.useRef(!1);
    X1.useEffect(() => {
        if (f06.current) return;
        let J8 = sO();
        if (!J8?.creationDurationMs || J8.usedSparsePaths) return;
        if (J8.creationDurationMs < 15000) return;
        f06.current = !0;
        let c8 = Math.round(J8.creationDurationMs / 1000);
        cK((D1) => [...D1, eO(`Worktree creation took ${c8}s. For large repos, set \`worktree.sparsePaths\` in .claude/settings.json to check out only the directories you need — e.g. \`{"worktree": {"sparsePaths": ["src", "packages/foo"]}}\`.`, "info")])
    }, [cK]);
    let {
        onBeforeQuery: yN,
        onTurnComplete: G06,
        render: e66
    } = s95({
        enabled: C,
        setMessages: cK,
        setInputValue: $z,
        setToolJSX: Q5,
        resultDedupState: ru.current
    }), $i = (!Gq || Gq.showSpinner === !0) && i4.length === 0 && Uw.length === 0 && (k4 || fA || wC || kg1() > 0) && !e && (!Yi || T6), $C = i4.length > 0 || Uw.length > 0 || JO.length > 0 || H6.queue.length > 0 || $6.queue.length > 0, mz6 = XY5(_K, k4, $C, {
        enabled: !R
    }), v06 = HY5(_K, k4, $C, {
        enabled: !R,
        otherSurveyActive: mz6.state !== "closed"
    }), ji = zY5(_K, k4, qV, "session", $C, mz6.state !== "closed" || v06.state !== "closed"), jA8 = VO5(_K, qV), Bz6 = X1.useMemo(() => ({
        ...ji,
        handleSelect: (J8) => {
            if (k06.current = !1, ji.handleSelect(J8), J8 === "bad" && ZO5("feedback_survey_bad")) V06("feedback_survey_bad"), k06.current = !0
        }
    }), [ji]), HA8 = E2A(_K, k4, $C, Bz6.state !== "closed" || mz6.state !== "closed" || v06.state !== "closed");
    cz5({
        autoConnectIdeFlag: J,
        ideToInstallExtension: R8,
        setDynamicMcpConfig: y6,
        setShowIdeOnboarding: g8,
        setIDEInstallationState: v8
    }), KA5(A, (J8) => r((c8) => ({
        ...c8,
        fileHistory: J8
    })));
    let T06 = X1.useCallback(async (J8, c8, D1) => {
            let b7 = performance.now();
            try {
                let zq = s48(c8.messages),
                    q4 = d98();
                await VP6("resume", {
                    getAppState: () => X6.getState(),
                    setAppState: r,
                    signal: AbortSignal.timeout(q4)
                });
                let Hq = await lR("resume", {
                    sessionId: J8,
                    agentType: m?.agentType,
                    model: f6
                });
                if (zq.push(...Hq), D1 === "fork") DR4(c8, pP(J8));
                else Fb8(c8, pP(J8));
                if (c8.fileHistorySnapshots) rF8(c8);
                let {
                    agentDefinition: qq
                } = _06(c8.agentSetting, G, n);
                S(qq), r((W5) => ({
                    ...W5,
                    agent: qq?.agentType
                })), r((W5) => ({
                    ...W5,
                    standaloneAgentContext: yY8(c8.agentName, c8.agentColor)
                })), NQ(c8.agentName), gm6(zq, c8.projectPath ?? Y7()), ZW(), DA(null), iG(J8);
                let Jq = In1(J8);
                B88(), VD6(), SZ(pP(J8), c8.fullPath ? v2A(c8.fullPath) : null);
                let {
                    renameRecordingForSession: P5
                } = await Promise.resolve().then(() => (NY8(), mz5));
                if (await P5(), await Gu(), EY8(c8, r), Q98(), In(c8), kZ.current = !0, NN(void 0), D1 !== "fork") Bz5(c8.worktreeSession === void 0 ? c8.projectPath : c8.worktreeSession?.worktreePath), LY8(c8.worktreeSession, c8.projectPath), bn(), M77({
                    abortController: new AbortController,
                    taskRegistry: M6
                }), Ci(nL().map((W5) => W5.id)), mP7(zq);
                else {
                    let W5 = sO();
                    if (W5) zL(W5)
                }
                if (Jq) lB6(Jq);
                if (wi.current && D1 !== "fork") wi.current = XS8(zq, c8.contentReplacements ?? []);
                cK(() => zq), Q5(null), $z(""), d("tengu_session_resumed", {
                    entrypoint: D1,
                    success: !0,
                    resume_duration_ms: Math.round(performance.now() - b7)
                })
            } catch (zq) {
                throw d("tengu_session_resumed", {
                    entrypoint: D1,
                    success: !1,
                    failure_reason: "processing_error",
                    error_name: r1(zq).name
                }), zq
            }
        }, [ZW, r, M6]),
        [Bm6] = X1.useState(() => CR(oI)),
        jC = X1.useRef(Bm6),
        pz6 = X1.useRef(new Set),
        Fz6 = X1.useRef(0),
        rG = X1.useRef(new Set),
        pm6 = X1.useRef(new Map),
        EZ = X1.useRef(new Set),
        gz6 = X1.useRef(new Map),
        JA8 = X1.useRef(void 0),
        Fm6 = X1.useRef(dK6()),
        ou = X1.useRef(_78()),
        gm6 = X1.useCallback((J8, c8) => {
            let D1 = nR6(J8, c8, oI);
            jC.current = oy6(jC.current, D1);
            for (let b7 of Ja1(J8)) pz6.current.add(b7)
        }, []);
    X1.useEffect(() => {
        if (z && z.length > 0) {
            if (gm6(z, Y7()), M77({
                    abortController: new AbortController,
                    taskRegistry: M6
                }), mP7(z), u8("tengu_gleaming_fair", !1)) {
                let J8 = Number(process.env.CLAUDE_CODE_RESUME_THRESHOLD_MINUTES ?? 70),
                    c8 = Number(process.env.CLAUDE_CODE_RESUME_TOKEN_THRESHOLD ?? 1e5),
                    D1 = Date.now() - 60000,
                    b7 = z.findLast((zq) => (zq.type === "user" || zq.type === "assistant") && Date.parse(zq.timestamp) < D1)?.timestamp;
                if (b7 && !H8().resumeReturnDismissed) {
                    let zq = (Date.now() - Date.parse(b7)) / 60000;
                    if (zq >= J8) Promise.resolve().then(() => (kD(), _Z4)).then(({
                        tokenCountWithEstimation: q4
                    }) => {
                        let Hq = q4(z);
                        if (Hq >= c8) iu({
                            sessionAgeMinutes: zq,
                            estimatedTokens: Hq
                        })
                    })
                }
            }
        }
    }, []);
    let {
        status: Um6,
        reverify: Sg
    } = k_5(), [q86, V06] = X1.useState(null), k06 = X1.useRef(!1), [Qm6, K86] = X1.useState(null), [N06, dm6] = X1.useState(!1), XA8 = !k4 && Ai;

    function Pe8() {
        if (N06 || Qm6) return;
        if (o66) return "message-selector";
        if (V2) return;
        if (JO[0]) return "sandbox-permission";
        let J8 = !Gq || Gq.shouldContinueAnimation;
        if (J8 && i4[0]) return "tool-permission";
        if (J8 && Uw[0]) return "prompt";
        if (J8 && $6.queue[0]) return "worker-sandbox-permission";
        if (J8 && H6.queue[0]) return "elicitation";
        if (J8 && XA8) return "cost";
        if (J8 && OC) return "resume-return";
        if (J8 && !k4 && q6) return "ultraplan-choice";
        if (J8 && !k4 && o) return "ultraplan-launch";
        if (J8 && f1) return "ide-onboarding";
        if (J8 && U6) return "remote-callout";
        if (J8 && l6) return "lsp-recommendation";
        if (J8 && f8) return "plugin-hint";
        if (J8 && F6) return "desktop-upsell";
        return
    }
    let ZY = Pe8(),
        MA8 = V2 && (JO[0] || i4[0] || Uw[0] || $6.queue[0] || H6.queue[0] || XA8);
    dJ.current = ZY, X1.useEffect(() => {
        if (!k4) return;
        let J8 = ZY === "tool-permission",
            c8 = Date.now();
        if (J8 && gw.current === null) gw.current = c8;
        else if (!J8 && gw.current !== null) ww.current += c8 - gw.current, gw.current = null
    }, [ZY, k4]);
    let Hi = X1.useRef(ZY);
    X1.useLayoutEffect(() => {
        if (Hi.current === "tool-permission" !== (ZY === "tool-permission")) QA(!0);
        Hi.current = ZY
    }, [ZY, QA]);
    let Ji = Gq?.jsx != null,
        cm6 = X1.useRef(Ji);
    X1.useLayoutEffect(() => {
        if (cm6.current !== Ji) QA();
        cm6.current = Ji
    }, [Ji, QA]);

    function E06() {
        if (ZY === "elicitation") return;
        if (E(`[onCancel] focusedInputDialog=${ZY} streamMode=${AS.getState().mode}`), XY.forceEnd(), YC?.trim()) cK((J8) => [...J8, yj({
            content: YC
        })]);
        if (ZW(), ZY === "tool-permission") i4[0]?.onAbort(), wz([]);
        else if (ZY === "prompt") {
            for (let J8 of Uw) J8.reject(Error("Prompt cancelled by user"));
            H$([]), U3?.abort("user-cancel")
        } else if (IL.isRemoteMode) IL.cancelRequest();
        else U3?.abort("user-cancel");
        DA(null), G06(d5.current, !0)
    }
    let lm6 = X1.useCallback(() => {
            let J8 = YR8(ZK.current, 0);
            if (!J8) return;
            if ($z(J8.text), FH("prompt"), J8.images.length > 0) gH((c8) => {
                let D1 = {
                    ...c8
                };
                for (let b7 of J8.images) D1[b7.id] = b7;
                return D1
            })
        }, [$z, FH, gH]),
        nm6 = {
            setToolUseConfirmQueue: wz,
            onCancel: E06,
            onAgentsKilled: () => cK((J8) => [...J8, eCK()]),
            isMessageSelectorVisible: o66 || !!g1,
            screen: Z8,
            abortSignal: U3?.signal,
            popCommandFromQueue: lm6,
            isLocalJSXCommand: Gq?.isLocalJSXCommand,
            isInputOverlayActive: L3,
            inputMode: dX,
            isInputEmpty: A9
        };
    X1.useEffect(() => {
        if (nX() >= 5 && !Ai && !t66) {
            if (d("tengu_cost_threshold_reached", {}), T8(!0), AZ8()) Oi(!0)
        }
    }, [_K, Ai, t66]);
    let PA8 = X1.useCallback(async (J8) => {
        let c8 = X6.getState(),
            {
                mode: D1,
                isBypassPermissionsModeAvailable: b7
            } = c8.toolPermissionContext;
        switch (jX8(D1, b7)) {
            case "allow":
                return !0;
            case "deny":
                return !1;
            case "classify":
                return Gg8(J8.host, J8.port, d5.current, W7.current, c8.toolPermissionContext, new AbortController().signal);
            case "ask":
                break
        }
        if (z4() && G18()) {
            let q4 = Ib4(),
                Hq = await xb4(J8.host, q4);
            return new Promise((qq) => {
                if (!Hq) {
                    pH((Jq) => [...Jq, {
                        hostPattern: J8,
                        resolvePromise: qq
                    }]);
                    return
                }
                pb4({
                    requestId: q4,
                    host: J8.host,
                    resolve: qq
                }), r((Jq) => ({
                    ...Jq,
                    pendingSandboxRequest: {
                        requestId: q4,
                        host: J8.host
                    }
                }))
            })
        }
        return new Promise((q4) => {
            let Hq = !1;

            function qq(Jq) {
                if (Hq) return;
                Hq = !0, q4(Jq)
            }
            pH((Jq) => [...Jq, {
                hostPattern: J8,
                resolvePromise: qq
            }]);
            {
                let Jq = X6.getState().replBridgePermissionCallbacks;
                if (Jq) {
                    let P5 = J06();
                    Jq.sendRequest(P5, Et8, {
                        host: J8.host
                    }, J06(), `Allow network connection to ${J8.host}?`);
                    let W5 = Jq.onResponse(P5, (t$) => {
                            W5();
                            let QH = t$.behavior === "allow";
                            pH((Tz) => {
                                return Tz.filter((cA) => cA.hostPattern.host === J8.host).forEach((cA) => cA.resolvePromise(QH)), Tz.filter((cA) => cA.hostPattern.host !== J8.host)
                            });
                            let C0 = WW.current.get(J8.host);
                            if (C0) {
                                for (let Tz of C0) Tz();
                                WW.current.delete(J8.host)
                            }
                        }),
                        jz = () => {
                            W5(), Jq.cancelRequest(P5)
                        },
                        lK = WW.current.get(J8.host) ?? [];
                    lK.push(jz), WW.current.set(J8.host, lK)
                }
            }
        })
    }, [r, X6]);
    if (X1.useEffect(() => {
            let J8 = Z7.getSandboxUnavailableReason();
            if (!J8) return;
            if (Z7.isSandboxRequired()) {
                process.stderr.write(`
Error: sandbox required but unavailable: ${J8}
` + `  sandbox.failIfUnavailable is set — refusing to start without a working sandbox.

`), j5(1, "other");
                return
            }
            E(`sandbox disabled: ${J8}`, {
                level: "warn"
            }), W8({
                key: "sandbox-unavailable",
                jsx: l8.createElement(l8.Fragment, null, l8.createElement(T, {
                    color: "warning"
                }, "sandbox disabled"), l8.createElement(T, {
                    dimColor: !0
                }, " · /sandbox")),
                priority: "medium"
            })
        }, [W8]), Z7.isSandboxingEnabled()) Z7.initialize(PA8).catch((J8) => {
        process.stderr.write(`
❌ Sandbox Error: ${b6(J8)}
`), j5(1, "other")
    });
    let Uz6 = X1.useCallback((J8, c8) => {
        r((D1) => ({
            ...D1,
            toolPermissionContext: {
                ...J8,
                mode: c8?.preserveMode ? D1.toolPermissionContext.mode : J8.mode
            }
        })), setImmediate((D1) => {
            D1((b7) => {
                return b7.forEach((zq) => {
                    zq.recheckPermission()
                }), b7
            })
        }, wz)
    }, [r, wz]);
    X1.useEffect(() => {
        return ANK(Uz6), () => wNK()
    }, [Uz6]);
    let oG = i_5(wz, Uz6),
        WA8 = X1.useCallback((J8, c8) => (D1) => new Promise((b7, zq) => {
            H$((q4) => [...q4, {
                request: D1,
                title: J8,
                toolInputSummary: c8,
                resolve: b7,
                reject: zq
            }])
        }), []),
        yZ = X1.useCallback((J8, c8, D1, b7) => {
            let zq = nu.current,
                q4 = X6.getState(),
                Hq = () => {
                    let qq = X6.getState(),
                        Jq = cl(qq.toolPermissionContext, qq.mcp.tools),
                        P5 = Du6(dq, Jq, qq.toolPermissionContext.mode);
                    if (!m) return P5;
                    return lt(m, P5, !1, !0).resolvedTools
                };
            return {
                abortController: D1,
                options: {
                    commands: DK,
                    tools: Hq(),
                    debug: K,
                    verbose: q4.verbose,
                    mainLoopModel: b7,
                    thinkingConfig: q4.thinkingEnabled !== !1 ? N : {
                        type: "disabled"
                    },
                    mcpClients: wt8(j, q4.mcp.clients),
                    mcpResources: q4.mcp.resources,
                    ideInstallationStatus: i6,
                    isNonInteractiveSession: !1,
                    dynamicMcpConfig: L6,
                    theme: rM,
                    agentDefinitions: C1 ? {
                        ...q4.agentDefinitions,
                        allowedAgentTypes: C1
                    } : q4.agentDefinitions,
                    customSystemPrompt: M,
                    appendSystemPrompt: P,
                    refreshTools: Hq
                },
                getAppState: () => X6.getState(),
                setAppState: r,
                setToolPermissionContext: (qq) => r((Jq) => {
                    let P5 = typeof qq === "function" ? qq(Jq.toolPermissionContext) : qq;
                    return Jq.toolPermissionContext === P5 ? Jq : {
                        ...Jq,
                        toolPermissionContext: P5
                    }
                }),
                setComputerUseMcpState(qq) {
                    r((Jq) => {
                        let P5 = qq(Jq.computerUseMcpState);
                        if (P5 === Jq.computerUseMcpState) return Jq;
                        return {
                            ...Jq,
                            computerUseMcpState: P5
                        }
                    })
                },
                setWebBrowserSlice: P36(r),
                setReplContext: H06(r),
                taskRegistry: M6,
                sessionHooksRegistry: OM6(r),
                setClassifierApprovals: qF(r),
                abortSpeculation: () => gD(r),
                agentLifecycle: YW6(r),
                teammateColors: W6,
                messages: J8,
                turnStartIndex: 0,
                replHydration: {
                    kind: "resume"
                },
                setMessages: cK,
                getFileHistoryState: () => X6.getState().fileHistory,
                applyFileHistoryOp(qq) {
                    r((Jq) => {
                        let P5 = bX6(Jq.fileHistory, qq);
                        if (P5 === Jq.fileHistory) return Jq;
                        return {
                            ...Jq,
                            fileHistory: P5
                        }
                    })
                },
                applyAttributionOp(qq) {
                    r((Jq) => {
                        let P5 = gu8(Jq.attribution, qq);
                        if (P5 === Jq.attribution) return Jq;
                        return {
                            ...Jq,
                            attribution: P5
                        }
                    })
                },
                applyHintClears(qq) {
                    cK((Jq) => tR8(Jq, qq))
                },
                openMessageSelector: () => {
                    if (!Z) Lg(!0)
                },
                onChangeAPIKey: Sg,
                readFileState: jC.current,
                setToolJSX: Q5,
                emitToolProgress: T5,
                addNotification: W8,
                appendSystemMessage: (qq) => cK((Jq) => [...Jq, qq]),
                sendOSNotification: (qq) => {
                    Il(qq, V6)
                },
                onChangeDynamicMcpConfig: c6,
                onInstallIDEExtension: x6,
                nestedMemoryAttachmentTriggers: new Set,
                loadedNestedMemoryPaths: EZ.current,
                sessionEnvVars: gz6.current,
                tmuxSocket: JA8.current,
                dynamicSkillDirTriggers: new Set,
                discoveredSkillNames: rG.current,
                discoveredRemoteSkills: pm6.current,
                memorySelector: Fm6.current,
                bashRerunAliases: ou.current,
                addResponseLength: c66,
                resetResponseLength: l66,
                pushApiMetricsEntry: void 0,
                setStreamMode: B48,
                onCompactProgress: (qq) => {
                    switch (qq.type) {
                        case "hooks_start":
                            UAK("claudeBlue_FOR_SYSTEM_SPINNER", "claudeBlueShimmer_FOR_SYSTEM_SPINNER"), m17(qq.hookType === "pre_compact" ? "Running PreCompact hooks…" : qq.hookType === "post_compact" ? "Running PostCompact hooks…" : "Running SessionStart hooks…");
                            break;
                        case "compact_start":
                            m17("Compacting conversation");
                            break;
                        case "compact_end":
                            B17();
                            break
                    }
                },
                setInProgressToolUseIDs: uz6,
                setHasInterruptibleToolInProgress: (qq) => {
                    Ki.current = qq
                },
                resume: T06,
                setConversationId: iG,
                requestPrompt: void 0,
                contentReplacementState: wi.current,
                resultDedupState: ru.current
            }
        }, [DK, dq, m, K, j, i6, L6, rM, C1, X6, r, Sg, W8, cK, c6, T06, WA8, Z, M, P, iG, M6]),
        DA8 = X1.useCallback(() => {
            U3?.abort("background");
            let J8 = eP4((c8) => c8.mode === "task-notification");
            (async () => {
                let c8 = yZ(d5.current, [], new AbortController, f6),
                    [D1, b7, zq] = await Promise.all([j0(c8.options.tools, f6, Array.from(F.additionalWorkingDirectories.keys())), $2(), fj(X6.getState().cacheBreakerPhrase)]),
                    q4 = ax({
                        mainThreadAgentDefinition: m,
                        toolUseContext: c8,
                        customSystemPrompt: M,
                        defaultSystemPrompt: D1,
                        appendSystemPrompt: P
                    });
                c8.renderedSystemPrompt = q4;
                let qq = (await Xc8(J8, vO(f6)).catch(() => [])).map(Y4),
                    Jq = new Set;
                for (let W5 of d5.current)
                    if (W5.type === "attachment" && W5.attachment.type === "queued_command" && W5.attachment.commandMode === "task-notification" && typeof W5.attachment.prompt === "string") Jq.add(W5.attachment.prompt);
                let P5 = qq.filter((W5) => W5.attachment.type === "queued_command" && (typeof W5.attachment.prompt !== "string" || !Jq.has(W5.attachment.prompt)));
                yVK({
                    messages: [...d5.current, ...P5],
                    queryParams: {
                        systemPrompt: q4,
                        userContext: b7,
                        systemContext: zq,
                        canUseTool: oG,
                        toolUseContext: c8,
                        querySource: Y78()
                    },
                    description: J$,
                    taskRegistry: M6,
                    agentDefinition: m
                })
            })()
        }, [U3, f6, F, m, yZ, M, P, oG, M6]),
        {
            handleBackgroundSession: lY
        } = tz5({
            setMessages: cK,
            setIsLoading: $$,
            resetLoadingState: ZW,
            setAbortController: DA,
            onBackgroundQuery: DA8
        }),
        y06 = X1.useCallback((J8) => {
            Jx6(J8, (c8) => {
                if (RJ(c8)) {
                    if (lq()) cK((D1) => [...H2(D1, void 0), c8]);
                    else cK(() => [c8]);
                    iG(J06())
                } else if (c8.type === "progress" && TH7(c8.data.type)) cK((D1) => {
                    let b7 = D1.at(-1);
                    if (b7?.type === "progress" && b7.parentToolUseID === c8.parentToolUseID && b7.data.type === c8.data.type) {
                        let zq = D1.slice();
                        return zq[zq.length - 1] = c8, zq
                    }
                    return [...D1, c8]
                });
                else cK((D1) => lq() ? qbK(D1, c8) : [...D1, c8])
            }, (c8) => {
                c66(c8.length)
            }, B48, QY, (c8) => {
                cK((D1) => D1.filter((b7) => b7 !== c8)), LH7(c8.uuid)
            }, JY, lG, r66)
        }, [cK, c66, QY, JY, r66]),
        ZA8 = X1.useCallback(async (J8, c8, D1, b7, zq, q4, Hq, qq) => {
            if (b7) {
                let Tz = wt8(j, X6.getState().mcp.clients);
                we.handleQueryStart(Tz);
                let cA = ky(Tz);
                if (cA) zS4(cA)
            }
            if (NE6(), !h && !nM && !nz && !kZ.current) {
                let Tz = c8.find((fW) => fW.type === "user" && !fW.isMeta),
                    cA = Tz?.type === "user" ? qu(Tz.message.content) : null;
                if (cA && !Gn8(cA)) kZ.current = !0, oe(cA, new AbortController().signal).then((fW) => {
                    if (fW) NN(fW);
                    else kZ.current = !1
                }, () => {
                    kZ.current = !1
                })
            }
            if (X6.setState((Tz) => {
                    let cA = Tz.toolPermissionContext.alwaysAllowRules.command;
                    if (cA === zq || cA?.length === zq.length && cA.every((fW, Zi) => fW === zq[Zi])) return Tz;
                    return {
                        ...Tz,
                        toolPermissionContext: {
                            ...Tz.toolPermissionContext,
                            alwaysAllowRules: {
                                ...Tz.toolPermissionContext.alwaysAllowRules,
                                command: zq
                            }
                        }
                    }
                }), !b7) {
                if (c8.some(RJ)) iG(J06());
                ZW(), DA(null);
                return
            }
            let Jq = yZ(J8, c8, D1, q4),
                {
                    tools: P5,
                    mcpClients: W5
                } = Jq.options;
            if (Hq !== void 0) {
                let Tz = Jq.getAppState;
                Jq.getAppState = () => ({
                    ...Tz(),
                    effortValue: Hq
                })
            }
            Y9("query_context_loading_start");
            let [, , jz, lK, t$] = await Promise.all([NK8(F, r), EK8(F, r, X6.getState().fastMode), j0(P5, q4, Array.from(F.additionalWorkingDirectories.keys())), $2(), fj(X6.getState().cacheBreakerPhrase)]), QH = {
                ...lK,
                ...h2A(W5, mn() ? Pz6() : void 0)
            };
            Y9("query_context_loading_end");
            let C0 = ax({
                mainThreadAgentDefinition: m,
                toolUseContext: Jq,
                customSystemPrompt: M,
                defaultSystemPrompt: jz,
                appendSystemPrompt: P
            });
            Jq.renderedSystemPrompt = C0, Y9("query_query_start");
            for await (let Tz of yy({
                messages: J8,
                systemPrompt: C0,
                userContext: QH,
                systemContext: t$,
                canUseTool: oG,
                toolUseContext: Jq,
                querySource: Y78(),
                stopHookActive: qq
            })) y06(Tz);
            cK((Tz) => rCK(Tz, Jq.options.tools)), Y9("query_end"), ZW(), ad8(), await D?.(d5.current)
        }, [j, ZW, yZ, F, r, M, D, P, oG, m, y06, nM, h]),
        HC = X1.useCallback(async (J8, c8, D1, b7, zq, q4, Hq, qq, Jq) => {
            if (z4()) {
                let jz = Z9(),
                    lK = T_();
                if (jz && lK) V38(jz, lK, !0)
            }
            let P5 = XY.tryStart();
            if (P5 === null) {
                d("tengu_concurrent_onquery_detected", {});
                let jz = !1;
                for (let lK of J8) {
                    if (lK.type !== "user") continue;
                    if (lK.isMeta && !GP6(lK.origin)) continue;
                    let t$ = qu(lK.message.content);
                    if (t$ === null) continue;
                    if (Dj({
                            value: t$,
                            mode: "prompt",
                            origin: lK.origin,
                            isMeta: lK.isMeta,
                            skipSlashCommands: GP6(lK.origin),
                            stopHookActive: Jq
                        }), !jz) jz = !0, d("tengu_concurrent_onquery_enqueued", {})
                }
                return
            }
            let W5 = !1;
            try {
                QJ(), cK((lK) => [...lK, ...J8]), bL.current = 0, cX.current = [], nu.current++, QY([]), xL(null);
                let jz = d5.current;
                if (Hq) await yN(Hq, jz, J8.length);
                if (q4 && Hq) {
                    if (!await q4(Hq, jz)) return
                }
                await ZA8(jz, J8, c8, D1, b7, zq, qq, Jq), W5 = !0
            } finally {
                if (XY.end(P5)) {
                    AC(Date.now()), ZW(), await G06(d5.current, c8.signal.aborted), BH.current();
                    let jz, lK = Date.now() - Q9.current - ww.current;
                    if ((lK > 30000 || jz !== void 0) && !c8.signal.aborted)
                        if (wJ6(X6.getState().tasks).some((QH) => QH.status === "running")) {
                            if (j$.current === null) j$.current = Q9.current;
                            if (jz) a$.current = jz
                        } else cK((QH) => [...QH, YA7(lK, jz, w7(QH, GW6))]);
                    DA(null)
                }
                if (c8.signal.reason === "user-cancel" && !XY.isActive && ZK.current === "" && kg1() === 0 && !X6.getState().viewingAgentTaskId) {
                    let jz = d5.current,
                        lK = jz.findLast(IW6);
                    if (lK) {
                        let t$ = jz.lastIndexOf(lK);
                        if (oa8(jz, t$)) P$4(), gj.current(lK)
                    }
                }
            }
        }, [ZA8, r, ZW, XY, yN, G06]),
        im6 = X1.useRef(!1);
    X1.useEffect(() => {
        let J8 = l;
        if (!J8 || k4 || im6.current) return;
        im6.current = !0;
        async function c8(D1) {
            if (D1.clearContext) {
                let q4 = D1.message.planContent ? pb8() : void 0,
                    {
                        clearConversation: Hq
                    } = await Promise.resolve().then(() => (mn8(), PIK));
                if (await Hq({
                        setMessages: cK,
                        readFileState: jC.current,
                        discoveredSkillNames: rG.current,
                        discoveredRemoteSkills: pm6.current,
                        loadedNestedMemoryPaths: EZ.current,
                        sessionEnvVars: gz6.current,
                        memorySelector: Fm6.current,
                        getAppState: () => X6.getState(),
                        setAppState: r,
                        setConversationId: iG,
                        resultDedupState: ru.current
                    }), kZ.current = !1, NN(void 0), pz6.current.clear(), Fz6.current = 0, ou.current = _78(), q4) jn1(I8(), q4)
            }
            let b7 = D1.message.planContent && !1;
            if (r((q4) => {
                    let Hq = D1.mode ? Ky(q4.toolPermissionContext, $s8(D1.mode, D1.allowedPrompts)) : q4.toolPermissionContext;
                    if (D1.mode === "auto") Hq = Pu({
                        ...Hq,
                        mode: "auto",
                        prePlanMode: void 0
                    });
                    return {
                        ...q4,
                        initialMessage: null,
                        toolPermissionContext: Hq,
                        ...b7 && {
                            pendingPlanVerification: {
                                plan: D1.message.planContent,
                                verificationStarted: !1,
                                verificationCompleted: !1
                            }
                        }
                    }
                }), kO()) IC6(() => X6.getState().fileHistory, (q4) => r((Hq) => {
                let qq = bX6(Hq.fileHistory, q4);
                if (qq === Hq.fileHistory) return Hq;
                return {
                    ...Hq,
                    fileHistory: qq
                }
            }), D1.message.uuid);
            await I1();
            let zq = D1.message.message.content;
            if (typeof zq === "string" && !D1.message.planContent) JC(zq, {
                setCursorOffset: () => {},
                clearBuffer: () => {},
                resetHistory: () => {}
            });
            else {
                let q4 = F5();
                DA(q4), HC([D1.message], q4, !0, [], f6)
            }
            setTimeout((q4) => {
                q4.current = !1
            }, 100, im6)
        }
        c8(J8)
    }, [l, k4, cK, r, HC, f6, cq]);
    let JC = X1.useCallback(async (J8, c8, D1, b7) => {
            if (QA(), iu((Hq) => Hq === null ? Hq : null), !D1 && J8.trim().startsWith("/")) {
                let Hq = RE6(J8, EN).trim(),
                    qq = Hq.indexOf(" "),
                    Jq = qq === -1 ? Hq.slice(1) : Hq.slice(1, qq),
                    P5 = qq === -1 ? "" : Hq.slice(qq + 1).trim(),
                    W5 = DK.find((lK) => X66(lK) && (lK.name === Jq || lK.aliases?.includes(Jq) || y_(lK) === Jq));
                if (W5?.name === "clear" && GA.current) d("tengu_idle_return_action", {
                    action: "hint_converted",
                    idleMinutes: Math.round((Date.now() - s66.current) / 60000),
                    messageCount: d5.current.length,
                    contextTokens: vJ(H2(d5.current))
                }), GA.current = !1;
                let jz = XY.isActive && (W5?.immediate || b7?.fromKeybinding);
                if (W5 && jz && W5.type === "local-jsx") {
                    if (J8.trim() === ZK.current.trim()) $z(""), c8.setCursorOffset(0), c8.clearBuffer(), gH({});
                    let lK = md(J8).filter((Tz) => EN[Tz.id]?.type === "text"),
                        t$ = lK.length,
                        QH = lK.reduce((Tz, cA) => Tz + (EN[cA.id]?.content.length ?? 0), 0);
                    d("tengu_paste_text", {
                        pastedTextCount: t$,
                        pastedTextBytes: QH
                    }), d("tengu_immediate_command_executed", {
                        commandName: W5.name,
                        fromKeybinding: b7?.fromKeybinding ?? !1
                    }), (async () => {
                        let Tz = !1,
                            cA = (AB6, OB6) => {
                                Tz = !0, Q5({
                                    jsx: null,
                                    shouldHidePromptInput: !1,
                                    clearLocalJSX: !0
                                });
                                let I06 = [];
                                if (AB6 && OB6?.display !== "skip") {
                                    if (W8({
                                            key: `immediate-${W5.name}`,
                                            text: AB6,
                                            priority: "immediate"
                                        }), !lq()) I06.push(kT(wb6(y_(W5), P5)), kT(`<${l0}>${fJ(AB6)}</${l0}>`))
                                }
                                if (OB6?.metaMessages?.length) I06.push(...OB6.metaMessages.map((wB6) => t8({
                                    content: wB6,
                                    isMeta: !0
                                })));
                                if (I06.length) cK((wB6) => [...wB6, ...I06]);
                                if (k2 !== void 0) $z(k2.text), c8.setCursorOffset(k2.cursorOffset), gH(k2.pastedContents), CL(void 0)
                            },
                            fW = yZ(d5.current, [], F5(), f6),
                            yA8 = await (await W5.load()).call(cA, fW, P5);
                        if (yA8 && !Tz) Q5({
                            jsx: yA8,
                            shouldHidePromptInput: !1,
                            isLocalJSXCommand: !0,
                            isImmediate: !0
                        })
                    })();
                    return
                }
            }
            if (IL.isRemoteMode && !J8.trim()) return;
            if (!b7?.fromKeybinding) {
                if (SE6({
                        display: D1 ? J8 : Q24(J8, dX),
                        pastedContents: D1 ? {} : EN
                    }), dX === "bash") y55(J8.trim())
            }
            let zq = !D1 && J8.trim().startsWith("/"),
                q4 = !k4 || D1 || IL.isRemoteMode;
            if (k2 !== void 0 && !zq && q4) $z(k2.text), c8.setCursorOffset(k2.cursorOffset), gH(k2.pastedContents), CL(void 0);
            else if (q4) {
                if (!b7?.fromKeybinding) $z(""), c8.setCursorOffset(0);
                gH({})
            }
            if (q4) {
                if (FH("prompt"), _8(void 0), i66((Hq) => Hq + 1), c8.clearBuffer(), M$.current = !1, !zq && dX === "prompt" && !D1 && !IL.isRemoteMode) eT(J8), QJ()
            }
            if (D1) {
                let {
                    queryRequired: Hq
                } = await Nc4(D1.state, D1.speculationSessionTimeSavedMs, D1.setAppState, J8, {
                    setMessages: cK,
                    readFileState: jC,
                    cwd: Y7()
                });
                if (Hq) {
                    let qq = F5();
                    DA(qq), HC([], qq, !0, [], f6)
                }
                return
            }
            if (IL.isRemoteMode && !(zq && DK.find((Hq) => {
                    let qq = J8.trim().slice(1).split(/\s/)[0];
                    return X66(Hq) && (Hq.name === qq || Hq.aliases?.includes(qq) || y_(Hq) === qq)
                })?.type === "local-jsx")) {
                let Hq = Object.values(EN),
                    qq = Hq.filter((lK) => lK.type === "image"),
                    Jq = qq.length > 0 ? qq.map((lK) => lK.id) : void 0,
                    P5 = J8.trim(),
                    W5 = J8.trim();
                if (Hq.length > 0) {
                    let lK = [],
                        t$ = [],
                        QH = J8.trim();
                    if (QH) lK.push({
                        type: "text",
                        text: QH
                    }), t$.push({
                        type: "text",
                        text: QH
                    });
                    for (let C0 of Hq)
                        if (C0.type === "image") {
                            let Tz = {
                                type: "base64",
                                media_type: C0.mediaType ?? "image/png",
                                data: C0.content
                            };
                            lK.push({
                                type: "image",
                                source: Tz
                            }), t$.push({
                                type: "image",
                                source: Tz
                            })
                        } else lK.push({
                            type: "text",
                            text: C0.content
                        }), t$.push({
                            type: "text",
                            text: C0.content
                        });
                    P5 = lK, W5 = t$
                }
                let jz = t8({
                    content: P5,
                    imagePasteIds: Jq
                });
                cK((lK) => [...lK, jz]), cX.current = [], nu.current++, await IL.sendMessage(W5, {
                    uuid: jz.uuid
                });
                return
            }
            if (await I1(), await Ot8({
                    input: J8,
                    helpers: c8,
                    queryGuard: XY,
                    isExternalLoading: gA,
                    mode: dX,
                    commands: DK,
                    onInputChange: $z,
                    setPastedContents: gH,
                    setToolJSX: Q5,
                    getToolUseContext: yZ,
                    messages: d5.current,
                    mainLoopModel: b7?.modelOverride ?? f6,
                    pastedContents: EN,
                    ideSelection: h6,
                    setUserInputOnProcessing: eT,
                    setAbortController: DA,
                    abortController: U3,
                    onQuery: HC,
                    getAppState: () => X6.getState(),
                    setAppState: r,
                    querySource: Y78(),
                    onBeforeQuery: W,
                    canUseTool: oG,
                    addNotification: W8,
                    setMessages: cK,
                    streamMode: AS.getState().mode,
                    hasInterruptibleToolInProgress: Ki.current
                }), (zq || k4) && k2 !== void 0) $z(k2.text), c8.setCursorOffset(k2.cursorOffset), gH(k2.pastedContents), CL(void 0)
        }, [XY, k4, gA, dX, DK, $z, FH, gH, i66, _8, Q5, yZ, f6, EN, h6, eT, DA, W8, HC, k2, CL, r, W, oG, yg, cK, I1, QA]),
        We8 = X1.useCallback(async (J8, c8, D1) => {
            if (sD(c8))
                if (sRK(c8.id, t8({
                        content: J8
                    }), M6), c8.status === "running") Ud8(c8.id, J8, M6);
                else z38({
                    agentId: c8.id,
                    prompt: J8,
                    toolUseContext: yZ(d5.current, [], new AbortController, f6),
                    canUseTool: oG
                }).catch((b7) => {
                    E(`resumeAgentBackground failed: ${b6(b7)}`), W8({
                        key: `resume-agent-failed-${c8.id}`,
                        jsx: l8.createElement(T, {
                            color: "error"
                        }, "Failed to resume agent: ", b6(b7)),
                        priority: "low"
                    })
                });
            else f18(c8.id, J8, M6);
            $z(""), D1.setCursorOffset(0), D1.clearBuffer()
        }, [M6, $z, yZ, oG, f6, W8]),
        De8 = X1.useCallback(() => {
            let J8 = q86 ? fO5(q86) : "/issue";
            V06(null), JC(J8, {
                setCursorOffset: () => {},
                clearBuffer: () => {},
                resetHistory: () => {}
            }).catch((c8) => {
                E(`Auto-run ${J8} failed: ${b6(c8)}`)
            })
        }, [JC, q86]),
        rm6 = X1.useCallback(() => {
            V06(null)
        }, []),
        XC = X1.useCallback(() => {
            JC("/feedback", {
                setCursorOffset: () => {},
                clearBuffer: () => {},
                resetHistory: () => {}
            }).catch((c8) => {
                E(`Survey feedback request failed: ${c8 instanceof Error?c8.message:String(c8)}`)
            })
        }, [JC]),
        L06 = X1.useRef(JC);
    L06.current = JC;
    let Qz6 = X1.useRef(!1),
        Cg = X1.useCallback(() => {
            if (Qz6.current) return !1;
            return Qz6.current = !0, L06.current("/rate-limit-options", {
                setCursorOffset: () => {},
                clearBuffer: () => {},
                resetHistory: () => {}
            }), !0
        }, []),
        om6 = X1.useCallback(async () => {
            dm6(!0);
            let J8 = sO() !== null,
                c8 = Ro8();
            if (J8 || c8.length > 0) {
                K86(l8.createElement(ho8, {
                    showWorktree: J8,
                    backgroundItems: c8,
                    onDone: () => {},
                    onCancel: () => {
                        K86(null), dm6(!1)
                    }
                }));
                return
            }
            let b7 = await (await Kz8.load()).call(() => {});
            if (K86(b7), b7 === null) dm6(!1)
        }, []),
        fA8 = X1.useCallback(() => {
            Lg((J8) => !J8)
        }, []),
        h06 = X1.useCallback((J8) => {
            let c8 = d5.current,
                D1 = c8.lastIndexOf(J8);
            if (D1 === -1) return;
            d("tengu_conversation_rewind", {
                preRewindMessageCount: c8.length,
                postRewindMessageCount: D1,
                messagesRemoved: c8.length - D1,
                rewindToMessageIndex: D1
            }), cK(c8.slice(0, D1)), iG(J06()), SR(), Xx8(ru.current), r((b7) => ({
                ...b7,
                toolPermissionContext: J8.permissionMode && b7.toolPermissionContext.mode !== J8.permissionMode ? {
                    ...b7.toolPermissionContext,
                    mode: J8.permissionMode
                } : b7.toolPermissionContext,
                promptSuggestion: {
                    text: null,
                    promptId: null,
                    shownAt: 0,
                    acceptedAt: 0,
                    generationRequestId: null
                }
            }))
        }, [cK, r]),
        am6 = X1.useCallback((J8) => {
            h06(J8);
            let c8 = zA7(J8);
            if (c8) $z(c8.text), FH(c8.mode);
            if (Array.isArray(J8.message.content) && J8.message.content.some((D1) => D1.type === "image")) {
                let D1 = J8.message.content.filter((b7) => b7.type === "image");
                if (D1.length > 0) {
                    let b7 = {};
                    D1.forEach((zq, q4) => {
                        if (zq.source.type === "base64") {
                            let Hq = J8.imagePasteIds?.[q4] ?? q4 + 1;
                            b7[Hq] = {
                                id: Hq,
                                type: "image",
                                content: zq.source.data,
                                mediaType: zq.source.media_type
                            }
                        }
                    }), gH(b7)
                }
            }
        }, [h06, $z]);
    gj.current = am6;
    let sm6 = X1.useCallback(async (J8) => {
            setImmediate((c8, D1) => c8(D1), am6, J8)
        }, [am6]),
        GA8 = (J8) => {
            let c8 = J8.slice(0, 24);
            return _K.findIndex((D1) => D1.uuid.slice(0, 24) === c8)
        },
        vA8 = {
            copy: (J8) => void hP(J8).then((c8) => {
                if (c8) process.stdout.write(c8);
                W8({
                    key: "selection-copied",
                    text: "copied",
                    color: "success",
                    priority: "immediate",
                    timeoutMs: 2000
                })
            }),
            edit: async (J8) => {
                let c8 = GA8(J8.uuid),
                    D1 = c8 >= 0 ? _K[c8] : void 0;
                if (!D1 || !IW6(D1)) return;
                let b7 = !await _wK(X6.getState().fileHistory, D1.uuid),
                    zq = oa8(_K, c8);
                if (b7 && zq) E06(), sm6(D1);
                else nG(D1), Lg(!0)
            }
        },
        {
            enter: Ze8,
            handlers: fe8
        } = rW4(cG, SL, qi, vA8);
    async function tm6() {
        Sg();
        let J8 = await GJ();
        if (J8.length > 0) {
            let c8 = J8.map((D1) => `  [${D1.type}] ${D1.path} (${D1.content.length} chars)${D1.parent?` (included by ${D1.parent})`:""}`).join(`
`);
            E(`Loaded ${J8.length} CLAUDE.md/rules files:
${c8}`)
        } else E("No CLAUDE.md/rules files found");
        for (let c8 of J8) jC.current.set(c8.path, {
            content: c8.contentDiffersFromDisk ? c8.rawContent ?? c8.content : c8.content,
            timestamp: Date.now(),
            offset: void 0,
            limit: void 0,
            isPartialView: c8.contentDiffersFromDisk
        })
    }
    D_5(y75()), t75(_K, _K.length === z?.length, k4);
    let {
        sendBridgeResult: i_
    } = yq5(_K, cK, U9, DK, f6);
    BH.current = i_, G_5();
    let dz6 = X1.useRef(!1);
    X1.useEffect(() => {
        if (z6.length < 1) {
            dz6.current = !1;
            return
        }
        if (dz6.current) return;
        dz6.current = !0, d8((J8) => ({
            ...J8,
            promptQueueUseCount: (J8.promptQueueUseCount ?? 0) + 1
        }))
    }, [z6.length]);
    let Ge8 = X1.useCallback(async (J8) => {
        await Ot8({
            helpers: {
                setCursorOffset: () => {},
                clearBuffer: () => {},
                resetHistory: () => {}
            },
            queryGuard: XY,
            commands: DK,
            onInputChange: () => {},
            setPastedContents: () => {},
            setToolJSX: Q5,
            getToolUseContext: yZ,
            messages: _K,
            mainLoopModel: f6,
            ideSelection: h6,
            setUserInputOnProcessing: eT,
            setAbortController: DA,
            onQuery: HC,
            getAppState: () => X6.getState(),
            setAppState: r,
            querySource: Y78(),
            onBeforeQuery: W,
            canUseTool: oG,
            addNotification: W8,
            setMessages: cK,
            queuedCommands: J8
        })
    }, [XY, DK, Q5, yZ, _K, f6, h6, eT, oG, DA, HC, W8, r, W]);
    Hz5({
        executeQueuedInput: Ge8,
        hasActiveLocalJsxUI: lJ,
        queryGuard: XY
    }), X1.useEffect(() => {
        mt.recordUserActivity(), hi(!0)
    }, [qV]), X1.useEffect(() => {
        if (qV === 1) TP7()
    }, [qV]), X1.useEffect(() => {
        if (k4) return;
        if (qV === 0) return;
        if (S0 === 0) return;
        let J8 = setTimeout((c8, D1, b7, zq, q4) => {
            if (AV() > c8) return;
            let qq = Date.now() - c8;
            if (!D1 && !b7 && zq.current === void 0 && qq >= H8().messageIdleNotifThresholdMs) Il({
                message: "Claude is waiting for your input",
                notificationType: "idle_prompt"
            }, q4)
        }, H8().messageIdleNotifThresholdMs, S0, k4, Gq, dJ, V6);
        return () => clearTimeout(J8)
    }, [k4, Gq, qV, S0, V6]), X1.useEffect(() => {
        if (S0 === 0) return;
        if (k4) return;
        let J8 = Number(process.env.CLAUDE_CODE_IDLE_TOKEN_THRESHOLD ?? 1e5);
        if (vJ(H2(d5.current)) < J8) return;
        let D1 = Number(process.env.CLAUDE_CODE_IDLE_THRESHOLD_MINUTES ?? 75) * 60000,
            b7 = Date.now() - S0,
            zq = D1 - b7,
            q4 = setTimeout((Hq, qq, Jq, P5) => {
                if (Jq.current.length === 0) return;
                let W5 = vJ(H2(Jq.current)),
                    jz = h3(W5),
                    lK = (Date.now() - Hq) / 60000;
                qq({
                    key: "idle-return-hint",
                    jsx: l8.createElement(l8.Fragment, null, l8.createElement(T, {
                        dimColor: !0
                    }, "new task? "), l8.createElement(T, {
                        color: "suggestion"
                    }, "/clear"), l8.createElement(T, {
                        dimColor: !0
                    }, " to save "), l8.createElement(T, {
                        color: "suggestion"
                    }, jz, " tokens")),
                    priority: "medium",
                    timeoutMs: 2147483647
                }), P5.current = !0, d("tengu_idle_return_action", {
                    action: "hint_shown",
                    idleMinutes: Math.round(lK),
                    messageCount: Jq.current.length,
                    contextTokens: W5
                })
            }, Math.max(0, zq), S0, W8, d5, GA);
        return () => {
            clearTimeout(q4), G8("idle-return-hint"), GA.current = !1
        }
    }, [S0, k4, W8, G8]);
    let cz6 = X1.useCallback((J8, c8) => {
            if (XY.isActive) return !1;
            if (sP4().some((zq) => zq.mode === "prompt" || zq.mode === "bash")) return !1;
            let D1 = F5();
            DA(D1);
            let b7 = t8({
                content: J8,
                isMeta: c8?.isMeta ? !0 : void 0
            });
            return HC([b7], D1, !0, [], f6), !0
        }, [HC, f6, X6]),
        _86 = X1.useCallback((J8) => {
            if (ZK.current = J8, rg8(J8), mt.recordUserActivity(), hi(!0), J8.trim().length > 0) bO()
        }, [bO]),
        MC = k2A({
            setInputValueRaw: _86,
            inputValueRef: ZK,
            insertTextRef: DW
        });
    Uz5({
        enabled: z4(),
        isLoading: k4,
        focusedInputDialog: ZY,
        onSubmitMessage: cz6
    }), Xz5({
        isLoading: k4,
        onSubmitMessage: cz6
    });
    {
        let J8 = X6.getState().kairosEnabled;
        S2A({
            isLoading: k4,
            assistantMode: J8,
            setMessages: cK
        })
    }
    X1.useEffect(() => {
        if (z6.some((J8) => J8.priority === "now")) U9.current?.abort("interrupt")
    }, [z6]), X1.useEffect(() => {
        return tm6(), () => {
            we.shutdown()
        }
    }, []);
    let {
        internal_eventEmitter: z86
    } = FB(), [em6, TA8] = X1.useState(0);
    X1.useEffect(() => {
        let J8 = () => {
                process.stdout.write(`
Claude Code has been suspended. Run \`fg\` to bring Claude Code back.
Note: ctrl + z now suspends Claude Code, ctrl + _ undoes input.
`)
            },
            c8 = () => {
                TA8((D1) => D1 + 1)
            };
        return z86?.on("suspend", J8), z86?.on("resume", c8), () => {
            z86?.off("suspend", J8), z86?.off("resume", c8)
        }
    }, [z86]);
    let bg = X1.useMemo(() => {
            if (!k4) return null;
            let J8 = _K.filter((Jq) => Jq.type === "progress" && Jq.data.type === "hook_progress" && (Jq.data.hookEvent === "Stop" || Jq.data.hookEvent === "SubagentStop"));
            if (J8.length === 0) return null;
            let c8 = J8.at(-1)?.toolUseID;
            if (!c8) return null;
            if (_K.some((Jq) => Jq.type === "system" && Jq.subtype === "stop_hook_summary" && Jq.toolUseID === c8)) return null;
            let b7 = J8.filter((Jq) => Jq.toolUseID === c8),
                zq = b7.length,
                q4 = w7(_K, (Jq) => {
                    if (Jq.type !== "attachment") return !1;
                    let P5 = Jq.attachment;
                    return "hookEvent" in P5 && (P5.hookEvent === "Stop" || P5.hookEvent === "SubagentStop") && "toolUseID" in P5 && P5.toolUseID === c8
                }),
                Hq = b7.find((Jq) => Jq.data.statusMessage)?.data.statusMessage;
            if (Hq) return zq === 1 ? `${Hq}…` : `${Hq}… ${q4}/${zq}`;
            let qq = b7[0]?.data.hookEvent === "SubagentStop" ? "subagent stop" : "stop";
            return zq === 1 ? `running ${qq} hook` : `running stop hooks… ${q4}/${zq}`
        }, [_K, k4]),
        qB6 = X1.useCallback(() => {
            nq({
                messagesLength: _K.length,
                streamingToolUsesLength: _q.length
            })
        }, [_K.length, _q.length]),
        KB6 = X1.useCallback(() => {
            nq(null)
        }, []),
        lz6 = lq() && !x,
        LN = X1.useRef(null),
        [KV, Xi] = X1.useState(!1),
        [Mi, R06] = X1.useState(""),
        [nz6, Pi] = X1.useState(0),
        [S5, S06] = X1.useState(0),
        ve8 = X1.useCallback((J8, c8) => {
            Pi(J8), S06(c8)
        }, []),
        {
            setQuery: Wi,
            scanElement: iz6,
            setPositions: _B6
        } = S75(),
        C06 = s1().columns,
        VA8 = l8.useRef(C06);
    l8.useEffect(() => {
        if (VA8.current !== C06) {
            if (VA8.current = C06, Mi || KV) Xi(!1), R06(""), Pi(0), S06(0), LN.current?.disarmSearch(), Wi("")
        }
    }, [C06, Mi, KV, Wi]);
    let b06 = X1.useRef(null),
        zB6 = Z8 === "transcript" && !KV;
    X1.useEffect(() => {
        if (zB6 && b06.current) cE(b06.current).focus(b06.current)
    }, [zB6, q8]);

    function YB6(J8) {
        if (!zB6 || !lz6) return;
        if (J8.ctrl || J8.meta) return;
        if (J8.key === "/" && !q8) {
            LN.current?.setAnchor(), Xi(!0), J8.preventDefault();
            return
        }
        let c8 = J8.key[0];
        if (!q8 && (c8 === "n" || c8 === "N") && J8.key === c8.repeat(J8.key.length) && nz6 > 0) {
            let D1 = c8 === "n" ? LN.current?.nextMatch : LN.current?.prevMatch;
            if (D1)
                for (let b7 = 0; b7 < J8.key.length; b7++) D1();
            J8.preventDefault();
            return
        }
        if (J8.key === "[" && !q8) {
            L8(!0), p6(!0), J8.preventDefault();
            return
        }
        if (J8.key === "v") {
            if (J8.preventDefault(), Q6.current) return;
            Q6.current = !0;
            let D1 = a6.current,
                b7 = (zq) => {
                    if (D1 !== a6.current) return;
                    clearTimeout(D8.current), x8(zq)
                };
            b7(`rendering ${_K.length} messages…`), (async () => {
                try {
                    let zq = Math.max(80, (process.stdout.columns ?? 80) - 6),
                        Hq = (await Co8(_K, $4, zq)).replace(/[ \t]+$/gm, ""),
                        qq = T2A(z2(), `cc-transcript-${Date.now()}.txt`);
                    await V2A(qq, Hq);
                    let Jq = Ti8(qq);
                    b7(Jq ? `opening ${qq}` : `wrote ${qq} · no $VISUAL/$EDITOR set`)
                } catch (zq) {
                    b7(`render failed: ${zq instanceof Error?zq.message:String(zq)}`)
                }
                if (Q6.current = !1, D1 !== a6.current) return;
                D8.current = setTimeout((zq) => zq(""), 4000, x8)
            })()
        }
    }
    let Y86 = Z8 === "transcript" && lz6;
    X1.useEffect(() => {
        if (!Y86) R06(""), Pi(0), S06(0), Xi(!1), a6.current++, clearTimeout(D8.current), L8(!1), x8("")
    }, [Y86]), X1.useEffect(() => {
        if (Wi(Y86 ? Mi : ""), !Y86) _B6(null)
    }, [Y86, Mi, Wi, _B6]);
    let rz6 = {
            screen: Z8,
            setScreen: N8,
            showAllInTranscript: R6,
            setShowAllInTranscript: p6,
            messageCount: _K.length,
            onEnterTranscript: qB6,
            onExitTranscript: KB6,
            virtualScrollActive: lz6,
            searchBarOpen: KV
        },
        kA8 = $7 ? _K.slice(0, $7.messagesLength) : _K,
        Te8 = $7 ? _q.slice(0, $7.streamingToolUsesLength) : _q,
        {
            handleKeyDown: Ve8
        } = S_5({
            onOpenBackgroundTasks: lJ ? void 0 : () => iq(!0)
        }),
        {
            handleKeyDown: Di
        } = N2A({
            voiceHandleKeyEvent: MC.handleKeyEvent,
            voiceCancelRecording: MC.cancelRecording,
            stripTrailing: MC.stripTrailing,
            resetAnchor: MC.resetAnchor,
            isActive: !Gq?.isLocalJSXCommand,
            inputValueRef: ZK
        });

    function hN(J8) {
        return l8.createElement(u, {
            flexDirection: "column",
            flexGrow: 1,
            width: "100%",
            onKeyDownCapture: Di,
            onKeyDown: Ve8
        }, J8)
    }
    if (F_5(), Z8 === "transcript") {
        let J8 = lq() && !x && !q8 ? FA : void 0,
            c8 = l8.createElement(i77, null, l8.createElement(zW6, {
                messages: kA8,
                tools: $4,
                commands: DK,
                verbose: !0,
                toolJSX: null,
                toolUseConfirmQueue: [],
                inProgressToolUseIDs: lu,
                isMessageSelectorVisible: !1,
                conversationId: a66,
                screen: Z8,
                agentDefinitions: n,
                streamingToolUses: Te8,
                showAllInTranscript: R6,
                onOpenRateLimitOptions: Cg,
                isLoading: k4,
                hidePastThinking: !0,
                streamingThinking: vz,
                scrollRef: J8,
                jumpRef: LN,
                onSearchMatchesChange: ve8,
                scanElement: iz6,
                setPositions: _B6,
                disableRenderCap: q8
            })),
            D1 = Gq && l8.createElement(u, {
                flexDirection: "column",
                width: "100%"
            }, Gq.jsx),
            b7 = l8.createElement(TM, null, l8.createElement(oO5, {
                isAnimating: LL,
                title: J$,
                disabled: h,
                noPrefix: cY
            }), l8.createElement(kP7, {
                ...rz6
            }), l8.createElement(NP7, {
                onSubmit: JC,
                isActive: !Gq?.isLocalJSXCommand
            }), J8 ? l8.createElement(jW7, {
                scrollRef: FA,
                isActive: ZY !== "ultraplan-choice",
                isModal: !KV,
                onScroll: () => LN.current?.disarmSearch()
            }) : null, l8.createElement(EP7, {
                ...nm6
            }), l8.createElement(u, {
                ref: b06,
                tabIndex: 0,
                onKeyDown: YB6
            }), J8 ? l8.createElement(q$7, {
                scrollRef: FA,
                scrollable: l8.createElement(l8.Fragment, null, c8, D1, l8.createElement(_W7, null)),
                bottom: KV ? l8.createElement(x2A, {
                    jumpRef: LN,
                    initialQuery: "",
                    count: nz6,
                    current: S5,
                    onClose: (zq) => {
                        if (R06(nz6 > 0 ? zq : ""), Xi(!1), !zq) Pi(0), S06(0), LN.current?.setSearchQuery("")
                    },
                    onCancel: () => {
                        Xi(!1), LN.current?.setSearchQuery(""), LN.current?.setSearchQuery(Mi), Wi(Mi)
                    },
                    setHighlight: Wi
                }) : l8.createElement(iO5, {
                    showAllInTranscript: R6,
                    virtualScroll: !0,
                    status: w8 || void 0,
                    searchBadge: Mi && nz6 > 0 ? {
                        current: S5,
                        count: nz6
                    } : void 0
                })
            }) : l8.createElement(l8.Fragment, null, c8, D1, l8.createElement(_W7, null), l8.createElement(iO5, {
                showAllInTranscript: R6,
                virtualScroll: !1,
                suppressShowAll: q8,
                status: w8 || void 0
            })));
        if (J8) return l8.createElement($W7, {
            mouseTracking: sb1()
        }, hN(b7));
        return hN(b7)
    }
    let UH = _6 ? J6[_6] : void 0,
        _V = UH && EJ(UH) ? UH : void 0,
        jw = _V ?? (UH && sD(UH) ? UH : void 0),
        ke8 = jw ? jw.messages ?? [] : _K,
        NA8 = ZY === "tool-permission" ? l8.createElement(NK5, {
            key: i4[0]?.toolUseID,
            onDone: () => wz(([J8, ...c8]) => c8),
            onReject: lm6,
            toolUseConfirm: i4[0],
            toolUseContext: yZ(_K, _K, U3 ?? F5(), f6),
            verbose: U,
            workerBadge: i4[0]?.workerBadge,
            setStickyFooter: lq() ? cJ : void 0
        }) : null,
        iJ = lq() && Gq?.isLocalJSXCommand === !0,
        RN = iJ ? Gq.jsx : null,
        EA8 = l8.createElement(TM, null, l8.createElement(oO5, {
            isAnimating: LL,
            title: J$,
            disabled: h,
            noPrefix: cY
        }), l8.createElement(kP7, {
            ...rz6
        }), l8.createElement(NP7, {
            onSubmit: JC,
            isActive: !Gq?.isLocalJSXCommand
        }), l8.createElement(jW7, {
            scrollRef: FA,
            isActive: lq() && (RN != null || !ZY || ZY === "tool-permission"),
            onScroll: RN || NA8 || jw ? void 0 : F8
        }), null, l8.createElement(EP7, {
            ...nm6
        }), l8.createElement(Ni8, {
            key: em6,
            dynamicMcpConfig: L6,
            isStrictMcpConfig: X
        }, l8.createElement(q$7, {
            scrollRef: FA,
            overlay: NA8,
            modal: RN,
            modalScrollRef: UG,
            dividerYRef: iM,
            hidePill: !!jw,
            hideSticky: !!_V,
            newMessageCount: Q66?.count ?? 0,
            onPillClick: () => {
                SL(null), X$(FA.current)
            },
            scrollable: l8.createElement(l8.Fragment, null, l8.createElement(Ez5, null), l8.createElement(i77, null, l8.createElement(zW6, {
                messages: ke8,
                deferMessages: !jw && !zi && k4,
                placeholderBaseline: UA.current,
                placeholderElement: !Z && !jw && !RN && fA ? l8.createElement(qM6, {
                    param: {
                        text: fA,
                        type: "text"
                    },
                    addMargin: !0,
                    verbose: U
                }) : null,
                tools: $4,
                commands: DK,
                verbose: U,
                toolJSX: Gq,
                toolUseConfirmQueue: i4,
                inProgressToolUseIDs: _V ? _V.inProgressToolUseIDs ?? new Set : lu,
                isMessageSelectorVisible: o66,
                conversationId: _6 ?? a66,
                screen: Z8,
                streamingToolUses: _q,
                showAllInTranscript: R6,
                agentDefinitions: n,
                onOpenRateLimitOptions: Cg,
                isLoading: k4,
                streamingText: k4 && !jw ? Yi : null,
                showThinkingHint: !jw,
                isBriefOnly: jw ? !1 : T6,
                unseenDivider: jw ? void 0 : Q66,
                scrollRef: lq() ? FA : void 0,
                trackStickyPrompt: lq() ? !0 : void 0,
                cursor: cG,
                setCursor: SL,
                cursorNavRef: qi
            }), wH() && lq() && l8.createElement(OjK, {
                messages: _K,
                setInputValue: $z,
                enabled: !k4 && !ZY && !jw
            })), l8.createElement(FA5, null), Gq && !(Gq.isLocalJSXCommand && Gq.isImmediate) && !iJ && l8.createElement(u, {
                flexDirection: "column",
                width: "100%"
            }, Gq.jsx), !Gq && Q3.size > 0 && l8.createElement(u, {
                flexDirection: "column",
                width: "100%"
            }, Array.from(Q3.values()).map((J8) => l8.createElement(l8.Fragment, {
                key: J8.toolUseId
            }, Rz5(J8, {
                tools: h4,
                verbose: U
            })))), !1, null, l8.createElement(u, {
                flexGrow: 1
            }), $i && l8.createElement(sAK, {
                responseLengthRef: bL,
                apiMetricsRef: cX,
                spinnerSuffix: bg,
                verbose: U,
                loadingStartTimeRef: Q9,
                totalPausedMsRef: ww,
                pauseStartTimeRef: gw,
                hasActiveTools: lu.size > 0,
                leaderIsIdle: !k4
            }), !$i && !k4 && !fA && !wC && T6 && !jw && l8.createElement(tAK, null), lq() && l8.createElement(ns8, null)),
            bottom: l8.createElement(u, {
                flexDirection: "row",
                width: "100%",
                alignItems: "flex-end"
            }, l8.createElement(u, {
                flexDirection: "column",
                flexGrow: 1
            }, WY, Gq?.isLocalJSXCommand && Gq.isImmediate && !iJ && l8.createElement(u, {
                flexDirection: "column",
                width: "100%"
            }, Gq.jsx), !$i && !Gq?.isLocalJSXCommand && A6 && uq && uq.length > 0 && l8.createElement(u, {
                width: "100%",
                flexDirection: "column"
            }, l8.createElement(NF8, {
                tasks: uq,
                isStandalone: !0
            })), ZY === "sandbox-permission" && l8.createElement(KW7, {
                key: JO[0].hostPattern.host,
                hostPattern: JO[0].hostPattern,
                onUserResponse: (J8) => {
                    let {
                        allow: c8,
                        persistToSettings: D1
                    } = J8, b7 = JO[0];
                    if (!b7) return;
                    let zq = b7.hostPattern.host;
                    if (D1) {
                        let Hq = {
                            type: "addRules",
                            rules: [{
                                toolName: PH,
                                ruleContent: `domain:${zq}`
                            }],
                            behavior: c8 ? "allow" : "deny",
                            destination: "localSettings"
                        };
                        r((qq) => ({
                            ...qq,
                            toolPermissionContext: EY(qq.toolPermissionContext, Hq)
                        })), Ud(Hq), Z7.refreshConfig()
                    }
                    pH((Hq) => {
                        return Hq.filter((qq) => qq.hostPattern.host === zq).forEach((qq) => qq.resolvePromise(c8)), Hq.filter((qq) => qq.hostPattern.host !== zq)
                    });
                    let q4 = WW.current.get(zq);
                    if (q4) {
                        for (let Hq of q4) Hq();
                        WW.current.delete(zq)
                    }
                }
            }), ZY === "prompt" && l8.createElement(xK5, {
                key: Uw[0].request.prompt,
                title: Uw[0].title,
                toolInputSummary: Uw[0].toolInputSummary,
                request: Uw[0].request,
                onRespond: (J8) => {
                    let c8 = Uw[0];
                    if (!c8) return;
                    c8.resolve({
                        prompt_response: c8.request.prompt,
                        selected: J8
                    }), H$(([, ...D1]) => D1)
                },
                onAbort: () => {
                    let J8 = Uw[0];
                    if (!J8) return;
                    J8.reject(Error("Prompt cancelled by user")), H$(([, ...c8]) => c8)
                }
            }), e && l8.createElement(PX7, {
                toolName: e.toolName,
                description: e.description
            }), i && l8.createElement(PX7, {
                toolName: "Network Access",
                description: `Waiting for leader to approve network access to ${i.host}`
            }), ZY === "worker-sandbox-permission" && l8.createElement(KW7, {
                key: $6.queue[0].requestId,
                hostPattern: {
                    host: $6.queue[0].host,
                    port: void 0
                },
                onUserResponse: (J8) => {
                    let {
                        allow: c8,
                        persistToSettings: D1
                    } = J8, b7 = $6.queue[0];
                    if (!b7) return;
                    let zq = b7.host;
                    if (tI8(b7.workerName, b7.requestId, zq, c8, O6?.teamName), D1 && c8) {
                        let q4 = {
                            type: "addRules",
                            rules: [{
                                toolName: PH,
                                ruleContent: `domain:${zq}`
                            }],
                            behavior: "allow",
                            destination: "localSettings"
                        };
                        r((Hq) => ({
                            ...Hq,
                            toolPermissionContext: EY(Hq.toolPermissionContext, q4)
                        })), Ud(q4), Z7.refreshConfig()
                    }
                    r((q4) => ({
                        ...q4,
                        workerSandboxPermissions: {
                            ...q4.workerSandboxPermissions,
                            queue: q4.workerSandboxPermissions.queue.slice(1)
                        }
                    }))
                }
            }), ZY === "elicitation" && l8.createElement(bK5, {
                key: H6.queue[0].serverName + ":" + String(H6.queue[0].requestId),
                event: H6.queue[0],
                onResponse: (J8, c8) => {
                    let D1 = H6.queue[0];
                    if (!D1) return;
                    if (D1.respond({
                            action: J8,
                            content: c8
                        }), !(D1.params.mode === "url" && J8 === "accept")) r((zq) => ({
                        ...zq,
                        elicitation: {
                            queue: zq.elicitation.queue.slice(1)
                        }
                    }))
                },
                onWaitingDismiss: (J8) => {
                    let c8 = H6.queue[0];
                    r((D1) => ({
                        ...D1,
                        elicitation: {
                            queue: D1.elicitation.queue.slice(1)
                        }
                    })), c8?.onWaitingDismiss?.(J8)
                }
            }), ZY === "cost" && l8.createElement(b75, {
                onDone: () => {
                    Oi(!1), T8(!0), d8((J8) => ({
                        ...J8,
                        hasAcknowledgedCostThreshold: !0
                    })), d("tengu_cost_threshold_acknowledged", {})
                }
            }), ZY === "resume-return" && OC && l8.createElement(x75, {
                sessionAgeMinutes: OC.sessionAgeMinutes,
                estimatedTokens: OC.estimatedTokens,
                onDone: async (J8) => {
                    let c8 = OC;
                    if (iu(null), d("tengu_resume_return_action", {
                            action: J8,
                            sessionAgeMinutes: Math.round(c8.sessionAgeMinutes),
                            messageCount: d5.current.length,
                            estimatedTokens: c8.estimatedTokens
                        }), J8 === "never") d8((D1) => {
                        if (D1.resumeReturnDismissed) return D1;
                        return {
                            ...D1,
                            resumeReturnDismissed: !0
                        }
                    });
                    if (J8 === "compact") {
                        let {
                            getResumeCompactModel: D1
                        } = await Promise.resolve().then(() => (Sq(), cZ8));
                        L06.current("/compact", {
                            setCursorOffset: () => {},
                            clearBuffer: () => {},
                            resetHistory: () => {}
                        }, void 0, {
                            modelOverride: D1(f6)
                        })
                    }
                }
            }), ZY === "ide-onboarding" && l8.createElement(fn1, {
                onDone: () => g8(!1),
                installationStatus: i6
            }), !1, !1, ZY === "remote-callout" && l8.createElement(GtK, {
                onDone: (J8) => {
                    r((c8) => {
                        if (!c8.showRemoteCallout) return c8;
                        return {
                            ...c8,
                            showRemoteCallout: !1,
                            ...J8 === "enable" && {
                                replBridgeEnabled: !0,
                                replBridgeExplicit: !0,
                                replBridgeOutboundOnly: !1
                            }
                        }
                    })
                }
            }), Qm6, ZY === "plugin-hint" && f8 && l8.createElement(LA5, {
                pluginName: f8.pluginName,
                pluginDescription: f8.pluginDescription,
                marketplaceName: f8.marketplaceName,
                sourceCommand: f8.sourceCommand,
                onResponse: p8
            }), null, ZY === "lsp-recommendation" && l6 && l8.createElement(kA5, {
                pluginName: l6.pluginName,
                pluginDescription: l6.pluginDescription,
                fileExtension: l6.fileExtension,
                onResponse: j8
            }), ZY === "desktop-upsell" && l8.createElement(gY5, {
                onDone: () => z8(!1)
            }), ZY === "ultraplan-choice" && q6 && l8.createElement(az5, {
                plan: q6.plan,
                sessionId: q6.sessionId,
                taskId: q6.taskId,
                setMessages: cK,
                readFileState: jC.current,
                memorySelector: Fm6.current,
                sessionEnvVars: gz6.current,
                getAppState: () => X6.getState(),
                setConversationId: iG,
                resultDedupState: ru.current
            }), ZY === "ultraplan-launch" && o && l8.createElement(RlK, {
                sourcePromise: o.sourcePromise,
                onChoice: (J8, c8) => {
                    let D1 = o.ultraplanArg;
                    if (r((qq) => qq.ultraplanLaunchPending ? {
                            ...qq,
                            ultraplanLaunchPending: void 0
                        } : qq), J8 === "cancel") {
                        if (D1) $z(D1);
                        return
                    }
                    cK((qq) => [...qq, kT(wb6("ultraplan", D1))]);
                    let b7 = (qq) => kT(`<${l0}>${fJ(qq)}</${l0}>`),
                        zq, q4 = (qq) => {
                            let Jq = b7(qq),
                                P5 = zq;
                            zq = Jq.uuid, cK((W5) => {
                                let jz = P5 ? W5.findIndex((t$) => t$.uuid === P5) : -1;
                                if (jz === -1) return [...W5, Jq];
                                let lK = [...W5];
                                return lK[jz] = Jq, lK
                            })
                        },
                        Hq = (qq) => {
                            if (!XY.isActive) {
                                q4(qq);
                                return
                            }
                            let Jq = XY.subscribe(() => {
                                if (XY.isActive) return;
                                if (Jq(), !X6.getState().ultraplanSessionUrl) return;
                                q4(qq)
                            })
                        };
                    c_8({
                        arg: D1,
                        promptIdentifier: c8?.promptIdentifier,
                        getAppState: () => X6.getState(),
                        setAppState: r,
                        signal: F5().signal,
                        disconnectedBridge: c8?.disconnectedBridge,
                        onStatusMessage: Hq
                    }).then((qq) => {
                        let Jq = b7(qq);
                        zq = Jq.uuid, cK((P5) => [...P5, Jq])
                    }).catch(j6)
                }
            }), e66(), !Gq?.shouldHidePromptInput && !ZY && !N06 && !Z && !cG && l8.createElement(l8.Fragment, null, q86 && l8.createElement(DO5, {
                onRun: De8,
                onCancel: rm6,
                reason: GO5(q86)
            }), l8.createElement(VY5, {
                postCompactSurvey: mz6,
                memorySurvey: v06,
                feedbackSurvey: Bz6,
                frustrationDetection: HA8,
                setInputValue: $z,
                handleSurveyRequestFeedback: XC,
                feedbackOnRequestFeedback: k06.current ? void 0 : XC
            }), jA8 && l8.createElement(TO5, null), l8.createElement(m95, {
                debug: K,
                ideSelection: h6,
                hasSuppressedDialogs: !!MA8,
                isLocalJSXCommandActive: lJ,
                getToolUseContext: yZ,
                toolPermissionContext: F,
                setToolPermissionContext: Uz6,
                apiKeyStatus: Um6,
                commands: DK,
                agents: n.activeAgents,
                isLoading: k4,
                onExit: om6,
                onLeftArrowOnEmpty: void 0,
                verbose: U,
                messages: _K,
                onInputChange: $z,
                mode: dX,
                onModeChange: FH,
                stashedPrompt: k2,
                setStashedPrompt: CL,
                submitCount: qV,
                onShowMessageSelector: fA8,
                onMessageActionsEnter: void 0,
                mcpClients: u6,
                pastedContents: EN,
                setPastedContents: gH,
                showBashesDialog: g1,
                setShowBashesDialog: iq,
                onSubmit: JC,
                onAgentSubmit: We8,
                onInputOverlayActiveChange: P9,
                initialVimMode: $w.current,
                onVimModeChange: (J8) => {
                    $w.current = J8
                },
                insertTextRef: DW,
                voiceInterimRange: MC.interimRange,
                sessionEnvVars: gz6.current
            }), l8.createElement(iz5, {
                onBackgroundSession: lY,
                isLoading: k4
            })), cG && l8.createElement(oW4, {
                cursor: cG
            }), ZY === "message-selector" && l8.createElement(cX7, {
                messages: _K,
                preselectedMessage: hg,
                onPreRestore: E06,
                onRestoreCode: async (J8) => {
                    await lF8(() => X6.getState().fileHistory, J8.uuid)
                },
                onSummarize: async (J8, c8, D1 = "from") => {
                    let b7 = H2(_K),
                        zq = b7.indexOf(J8);
                    if (zq === -1) {
                        cK((cA) => [...cA, eO("That message is no longer in the active context. Choose a more recent message.", "warning")]);
                        return
                    }
                    let q4 = F5(),
                        Hq = yZ(b7, [], q4, f6),
                        qq = Hq.getAppState(),
                        Jq = await j0(Hq.options.tools, Hq.options.mainLoopModel, Array.from(qq.toolPermissionContext.additionalWorkingDirectories.keys())),
                        P5 = ax({
                            mainThreadAgentDefinition: void 0,
                            toolUseContext: Hq,
                            customSystemPrompt: Hq.options.customSystemPrompt,
                            defaultSystemPrompt: Jq,
                            appendSystemPrompt: Hq.options.appendSystemPrompt
                        }),
                        [W5, jz] = await Promise.all([$2(), fj(qq.cacheBreakerPhrase)]),
                        lK = await zLK(b7, zq, Hq, {
                            systemPrompt: P5,
                            userContext: W5,
                            systemContext: jz,
                            toolUseContext: Hq,
                            forkContextMessages: b7
                        }, c8, D1),
                        t$ = lK.messagesToKeep ?? [],
                        QH = D1 === "up_to" ? [...lK.summaryMessages, ...t$] : [...t$, ...lK.summaryMessages],
                        C0 = [lK.boundaryMarker, ...QH, ...lK.attachments, ...lK.hookResults];
                    if (lq() && D1 === "from") cK((cA) => {
                        let fW = cA.findIndex((Zi) => Zi.uuid === J8.uuid);
                        return [...cA.slice(0, fW === -1 ? 0 : fW), ...C0]
                    });
                    else cK(C0);
                    if (iG(J06()), _F(Hq.options.querySource, Hq.setAppState, ru.current), D1 === "from") {
                        let cA = zA7(J8);
                        if (cA) $z(cA.text), FH(cA.mode)
                    }
                    let Tz = WJ("app:toggleTranscript", "Global", "ctrl+o");
                    W8({
                        key: "summarize-ctrl-o-hint",
                        text: `Conversation summarized (${Tz} for history)`,
                        priority: "medium",
                        timeoutMs: 8000
                    })
                },
                onRestoreMessage: sm6,
                onClose: () => {
                    Lg(!1), nG(void 0)
                }
            }), !1))
        })));
    if (lq()) return l8.createElement($W7, {
        mouseTracking: sb1()
    }, hN(EA8));
    return hN(EA8)
}