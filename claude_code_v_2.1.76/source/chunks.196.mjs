
// @from(Ln 508148, Col 0)
function ot8({
    commands: A,
    debug: q,
    initialTools: K,
    initialMessages: Y,
    pendingHookMessages: z,
    initialFileHistorySnapshots: _,
    initialContentReplacements: w,
    initialAgentName: O,
    initialAgentColor: $,
    mcpClients: H,
    dynamicMcpConfig: j,
    autoConnectIdeFlag: J,
    strictMcpConfig: M = !1,
    systemPrompt: D,
    appendSystemPrompt: X,
    onBeforeQuery: P,
    onTurnComplete: W,
    disabled: Z = !1,
    mainThreadAgentDefinition: G,
    disableSlashCommands: f = !1,
    taskListId: v,
    remoteSessionConfig: N,
    directConnectConfig: V,
    sshSession: L,
    thinkingConfig: h
}) {
    let R = !!N;
    N8.useEffect(() => {
        return k(`[REPL:mount] REPL mounted, disabled=${Z}`), () => k("[REPL:unmount] REPL unmounting")
    }, [Z]);
    let [u, I] = N8.useState(G), g = M1((P1) => P1.toolPermissionContext), B = M1((P1) => P1.verbose), b = M1((P1) => P1.mcp), p = M1((P1) => P1.plugins), Q = M1((P1) => P1.agentDefinitions), U = M1((P1) => P1.fileHistory), r = M1((P1) => P1.initialMessage), e = UF(), Y6 = void 0, H6 = !1, J6 = void 0, K6 = M1((P1) => P1.spinnerTip), s = M1((P1) => P1.expandedView) === "tasks", X6 = M1((P1) => P1.pendingWorkerRequest), z6 = M1((P1) => P1.pendingSandboxRequest), N6 = M1((P1) => P1.teamContext), $6 = M1((P1) => P1.tasks), n = M1((P1) => P1.workerSandboxPermissions), o = M1((P1) => P1.elicitation), a = M1((P1) => P1.viewingAgentTaskId), i = xA(), l = S5(), q6 = Vm(), w6 = sR(), [O6, L6] = N8.useState(A);
    fmq(R ? void 0 : qY(), L6);
    let [y6, G6] = N8.useState(Nb1?.isProactiveActive() ?? !1);
    N8.useEffect(() => {
        if (!Nb1) return;
        return Nb1.subscribeToProactiveChanges(() => {
            G6(Nb1.isProactiveActive())
        })
    }, []);
    let R6 = N8.useMemo(() => FX(g), [g, y6]);
    mU4(), BU4();
    let [T6, D6] = N8.useState(j), Q6 = N8.useCallback((P1) => {
        D6(P1)
    }, [D6]), [k6, Z6] = N8.useState("prompt"), [u6, C6] = N8.useState(!1), {
        addNotification: o6
    } = o4(), V6 = Pmq(H, b.clients), [b6, E6] = N8.useState(void 0), [U6, c6] = N8.useState(null), [K1, j6] = N8.useState(null), [W6, n6] = N8.useState(!1), [d6, S6] = N8.useState(() => {
        return !1
    }), [g6, D1] = N8.useState(() => Fmq(w6)), J1 = M1((P1) => P1.showRemoteCallout), [E1, K8] = N8.useState(() => Yyq());
    Ygq(), wgq(), Hgq(), Agq({
        ideSelection: b6,
        mcpClients: V6,
        ideInstallationStatus: K1
    }), ZBq({
        mcpClients: V6
    }), fBq(), gBq(), pBq(), ly1(), rBq(w6), fgq(), aBq(w6), tBq(), ABq(), KBq(), zBq(), vBq(), Xgq();
    let {
        recommendation: e8,
        handleResponse: n8
    } = IBq();
    xBq();
    let H7 = N8.useMemo(() => {
        return [...R6, ...K]
    }, [R6, K]);
    $b1({
        enabled: !R
    });
    let GA = QW4();
    N8.useEffect(() => {
        if (R) return;
        cBq(i)
    }, [i, R]), wBq(R ? rt8 : V6, g.mode), duq(i, Y, {
        enabled: !R
    });
    let h8 = tR1(H7, b.tools, g),
        {
            tools: U8,
            allowedAgentTypes: P4
        } = N8.useMemo(() => {
            if (!u) return {
                tools: h8,
                allowedAgentTypes: void 0
            };
            let P1 = _c(u, h8, !1, !0);
            return {
                tools: P1.resolvedTools,
                allowedAgentTypes: P1.allowedAgentTypes
            }
        }, [u, h8]),
        T4 = Ft8(O6, p.commands),
        $4 = Ft8(T4, b.commands),
        qA = N8.useMemo(() => f ? [] : $4, [f, $4]);
    CSq(R ? rt8 : b.clients), Vmq(R ? rt8 : b.clients, E6);
    let [d7, W4] = N8.useState("responding"), Dz = N8.useRef(d7);
    Dz.current = d7;
    let [JK, F3] = N8.useState([]), [MK, k3] = N8.useState(null);
    N8.useEffect(() => {
        if (MK && !MK.isStreaming && MK.streamingEndedAt) {
            let Y8 = 30000 - (Date.now() - MK.streamingEndedAt);
            if (Y8 > 0) {
                let V8 = setTimeout(k3, Y8, null);
                return () => clearTimeout(V8)
            } else k3(null)
        }
    }, [MK]);
    let [M5, x5] = N8.useState(null), E2 = N8.useRef(null);
    E2.current = M5;
    let tz = N8.useRef(() => {}),
        x9 = N8.useRef(null),
        J9 = b8.useRef(new ys8).current,
        sw = b8.useSyncExternalStore(J9.subscribe, J9.getSnapshot),
        [UY, dY] = b8.useState(N?.hasInitialPrompt ?? !1),
        Bq = sw || UY,
        [YA, E3] = b8.useState(void 0),
        u9 = b8.useRef(0),
        u5 = b8.useRef(0),
        KK = b8.useRef(null),
        cY = b8.useRef(!1);
    if (sw && !cY.current) u9.current = Date.now(), u5.current = 0, KK.current = null;
    cY.current = sw;
    let B4 = b8.useCallback((P1) => {
            if (dY(P1), P1) u9.current = Date.now(), u5.current = 0, KK.current = null
        }, []),
        lY = b8.useRef(null),
        e3 = b8.useRef(void 0),
        D5 = b8.useRef(void 0),
        WY = 1500,
        [y2, s6] = b8.useState(!1),
        [A1, f1] = N8.useState(null);
    N8.useEffect(() => {
        if (A1?.notifications) A1.notifications.forEach((P1) => {
            o6({
                key: "auto-updater-notification",
                text: P1,
                priority: "low"
            })
        })
    }, [A1, o6]);
    let [h1, u1] = N8.useState(!1);
    N8.useEffect(() => {}, []);
    let [j8, l8] = N8.useState(null), p8 = N8.useRef(null), o8 = N8.useCallback((P1) => {
        if (P1?.isLocalJSXCommand) {
            let {
                clearLocalJSX: Y8,
                ...V8
            } = P1;
            p8.current = {
                ...V8,
                isLocalJSXCommand: !0
            }, l8(V8);
            return
        }
        if (p8.current) {
            if (P1?.clearLocalJSX) {
                p8.current = null, l8(null);
                return
            }
            return
        }
        if (P1?.clearLocalJSX) {
            l8(null);
            return
        }
        l8(P1)
    }, []), [a8, $A] = N8.useState([]), [G7, Q1] = N8.useState([]), [zA, gA] = N8.useState([]), k7 = N8.useRef(new Map), X5 = M1((P1) => P1.settings.terminalTitleFromRename) !== !1 ? ek(R1()) : void 0, [sq, g4] = N8.useState(), v4 = u?.agentType, Cq = X5 ?? v4 ?? sq ?? "Claude Code", E5 = a8.length > 0 || zA.length > 0 || X6 || z6, hK = j8?.isLocalJSXCommand === !0, j3 = Bq && !E5 && !hK, A9 = t6(process.env.CLAUDE_CODE_DISABLE_TERMINAL_TITLE);
    N8.useEffect(() => {
        if (Bq && !E5 && !hK) return DSq(), () => XSq()
    }, [Bq, E5, hK]), N8.useEffect(() => {
        return _i4($A), () => wi4()
    }, [$A]);
    let [u7, Xz] = N8.useState(Y ?? []), iY = N8.useRef(u7), gq = N8.useCallback((P1) => {
        let Y8 = typeof P1 === "function" ? P1(iY.current) : P1;
        iY.current = Y8, Xz(Y8)
    }, []), {
        dividerIndex: Pz,
        pillVisible: L2,
        onScroll: AP,
        jumpToNew: A2
    } = uvz(u7.length), Mj = N8.useMemo(() => {
        return
    }, [Pz, u7.length]), q2 = N8.useCallback(() => {}, [AP]), Mq = Suq(z, gq), xO = N8.useDeferredValue(u7), E$ = N8.useDeferredValue(YA), tw = u7.length - xO.length;
    if (tw > 0) k(`[useDeferredValue] Messages deferred by ${tw} (${xO.length}→${u7.length})`);
    let [uO, HJ] = N8.useState(null), [m5, ew] = N8.useState(() => fj8()), WH = N8.useRef(m5);
    WH.current = m5;
    let Dj = N8.useRef(null),
        P5 = N8.useCallback((P1) => {
            if (WH.current === "" && P1 !== "") q2();
            ew(P1), s6(P1.trim().length > 0)
        }, [s6, q2]);
    N8.useEffect(() => {
        if (m5.trim().length === 0) return;
        let P1 = setTimeout(s6, WY, !1);
        return () => clearTimeout(P1)
    }, [m5]);
    let [ZH, ZY] = N8.useState("prompt"), [t9, d8] = N8.useState(), VA = N8.useCallback((P1) => {
        let Y8 = new Set(P1);
        L6((V8) => V8.filter((c7) => Y8.has(c7.name) || Ii8.has(c7)))
    }, [L6]), [n4, iK] = N8.useState(new Set), Uq = N8.useRef(!1), bz = Duq({
        config: N,
        setMessages: gq,
        setIsLoading: B4,
        onInit: VA,
        setToolUseConfirmQueue: $A,
        tools: H7,
        setStreamingToolUses: F3,
        setStreamMode: W4,
        setInProgressToolUseIDs: iK
    }), m9 = Wuq({
        config: V,
        setMessages: gq,
        setIsLoading: B4,
        setToolUseConfirmQueue: $A,
        tools: H7
    }), C7 = Guq({
        session: L,
        setMessages: gq,
        setIsLoading: B4,
        setToolUseConfirmQueue: $A,
        tools: H7
    }), B5 = C7.isRemoteMode ? C7 : m9.isRemoteMode ? m9 : bz, [p3, R2] = N8.useState({}), [Xj, GH] = N8.useState(0), mO = N8.useRef(0), GD = N8.useRef([]), fM = N8.useCallback((P1) => {
        let Y8 = mO.current;
        if (mO.current = P1(Y8), mO.current > Y8) {
            let V8 = GD.current;
            if (V8.length > 0) {
                let c7 = V8[V8.length - 1];
                c7.lastTokenTime = Date.now(), c7.endResponseLength = mO.current
            }
        }
    }, []), [ez, fD] = N8.useState(null), eh = M1((P1) => P1.settings.prefersReducedMotion) ?? !1, oZ = ggq(eh), rN = N8.useCallback((P1) => {
        if (!oZ) return;
        fD(P1)
    }, [oZ]), aZ = ez && oZ ? ez.substring(0, ez.lastIndexOf(`
`) + 1) || null : null, [jx, BO] = N8.useState(0), [nF, I6] = N8.useState(null), [m6, Z1] = N8.useState(null), [M8, u8] = N8.useState(null), [W7, Hq] = N8.useState(!1), [z5, GY] = N8.useState(!1), [h2, S2] = N8.useState(S26()), [Pj] = N8.useState(() => ({
        current: W34(Y, w)
    })), [_W, TD] = N8.useState(X1().hasAcknowledgedCostThreshold), [sZ, rF] = N8.useState("INSERT"), [oF, Jx] = N8.useState(!1), [ri, y1] = N8.useState(!1), [WA, _4] = N8.useState(!1), [H4, t5] = N8.useState(!1), [fH, TH] = N8.useState(!1), Wz = M1((P1) => P1.isBriefOnly), oN = p_(), T86 = N8.useRef(oN);
    T86.current = oN;
    let [OT] = z7(), FV6 = N8.useCallback(() => {
        $Bq({
            theme: OT,
            readFileState: AS.current
        }).then(async (P1) => {
            if (P1) {
                let Y8 = await P1.content({
                    theme: OT
                });
                i((V8) => ({
                    ...V8,
                    spinnerTip: Y8
                })), HBq(P1)
            } else i((Y8) => {
                if (Y8.spinnerTip === void 0) return Y8;
                return {
                    ...Y8,
                    spinnerTip: void 0
                }
            })
        })
    }, [i, OT]), dE = N8.useCallback(() => {
        B4(!1), E3(void 0), mO.current = 0, GD.current = [], fD(null), F3([]), I6(null), Z1(null), u8(null), FV6(), mp6(), rE1()
    }, [FV6]), oi = BR($6).some((P1) => P1.status === "running");
    N8.useEffect(() => {
        if (!oi && lY.current !== null) {
            let P1 = Date.now() - lY.current,
                Y8 = e3.current;
            lY.current = null, e3.current = void 0, gq((V8) => [...V8, Ar8(P1, Y8)])
        }
    }, [oi, gq]);
    let v86 = N8.useRef(!1);
    N8.useEffect(() => {
        {
            if (g.mode !== "auto") {
                v86.current = !1;
                return
            }
            if (v86.current) return;
            if ((X1().autoPermissionsNotificationCount ?? 0) >= 3) return;
            let V8 = setTimeout((c7, FA) => {
                c7.current = !0, d1((v7) => {
                    let N7 = v7.autoPermissionsNotificationCount ?? 0;
                    if (N7 >= 3) return v7;
                    return {
                        ...v7,
                        autoPermissionsNotificationCount: N7 + 1
                    }
                }), FA((v7) => [...v7, P$(xC1, "warning")])
            }, 800, v86, gq);
            return () => clearTimeout(V8)
        }
    }, [g.mode, gq]);
    let pV6 = N8.useRef(!1);
    N8.useEffect(() => {
        if (pV6.current) return;
        let P1 = S0();
        if (!P1?.creationDurationMs || P1.usedSparsePaths) return;
        if (P1.creationDurationMs < 15000) return;
        pV6.current = !0;
        let Y8 = Math.round(P1.creationDurationMs / 1000);
        gq((V8) => [...V8, P$(`Worktree creation took ${Y8}s. For large repos, set \`worktree.sparsePaths\` in .claude/settings.json to check out only the directories you need — e.g. \`{"worktree": {"sparsePaths": ["src", "packages/foo"]}}\`.`, "info")])
    }, [gq]);
    let N86 = u7.findLast((P1) => P1.type === "assistant"),
        ai = N86?.type === "assistant" ? N86.message.content.filter((P1) => P1.type === "tool_use" && n4.has(P1.id)) : [],
        C2 = ai.length > 0 && ai.every((P1) => P1.type === "tool_use" && P1.name === gz6),
        QV6 = (!j8 || j8.showSpinner === !0) && a8.length === 0 && zA.length === 0 && (Bq || YA || oi || qY4() > 0) && !X6 && !C2 && (!aZ || Wz),
        UV6 = a8.length > 0 || zA.length > 0 || G7.length > 0 || o.queue.length > 0 || n.queue.length > 0,
        C26 = imq(u7, Bq, Xj, "session", UV6),
        I26 = Nuq(gq),
        Mx = Lgq(u7, Xj),
        si = N8.useMemo(() => ({
            ...C26,
            handleSelect: (P1) => {
                x26.current = !1;
                let Y8 = C26.handleSelect(P1);
                if (P1 === "bad" && !Y8 && Ngq("feedback_survey_bad")) b26("feedback_survey_bad"), x26.current = !0
            }
        }), [C26]),
        ti = rmq(u7, Bq, UV6, {
            enabled: !R
        }),
        aF = Svz(u7, Bq, UV6, si.state !== "closed" || ti.state !== "closed");
    Cmq({
        autoConnectIdeFlag: J,
        ideToInstallExtension: U6,
        setDynamicMcpConfig: D6,
        setShowIdeOnboarding: n6,
        setIDEInstallationState: j6
    }), JBq(_, U, (P1) => i((Y8) => ({
        ...Y8,
        fileHistory: P1
    })));
    let aN = N8.useCallback(async (P1, Y8, V8) => {
            let c7 = performance.now();
            try {
                let FA = zV1(Y8.messages),
                    v7 = await C0("resume", {
                        sessionId: P1,
                        agentType: u?.agentType,
                        model: w6
                    });
                if (FA.push(...v7), V8 === "fork") q94(Y8, eJ(P1));
                else EP1(Y8, eJ(P1));
                if (co6(Y8, i), Y8.fileHistorySnapshots) KV1(Y8);
                let {
                    agentDefinition: N7
                } = K26(Y8.agentSetting, G, Q);
                I(N7), i((nK) => ({
                    ...nK,
                    agent: N7?.agentType
                })), i((nK) => ({
                    ...nK,
                    standaloneAgentContext: lo6(Y8.agentName, Y8.agentColor)
                })), dV6(FA, Y8.projectPath ?? AA()), dE(), x5(null), S2(P1);
                let cA = NO8(P1);
                o21(), uw6(), _P(eJ(P1), Y8.fullPath ? Lvz(Y8.fullPath) : null);
                let {
                    renameRecordingForSession: l4
                } = await Promise.resolve().then(() => (Uo6(), Ekq));
                if (await l4(), await Zh(), ai6(), LF(Y8), cA) xk6(cA);
                if (Pj.current && V8 !== "fork") Pj.current = QN8(FA, Y8.contentReplacements ?? []);
                gq(() => FA), o8(null), P5(""), d("tengu_session_resumed", {
                    entrypoint: V8,
                    success: !0,
                    resume_duration_ms: Math.round(performance.now() - c7)
                })
            } catch (FA) {
                throw d("tengu_session_resumed", {
                    entrypoint: V8,
                    success: !1
                }), FA
            }
        }, [dE, i]),
        [ia6] = N8.useState(() => yd(Ed)),
        AS = N8.useRef(ia6),
        dV6 = N8.useCallback((P1, Y8) => {
            let V8 = UT6(P1, Y8, Ed);
            AS.current = yD1(AS.current, V8)
        }, []);
    N8.useEffect(() => {
        if (Y && Y.length > 0) dV6(Y, AA())
    }, []);
    let {
        status: cV6,
        reverify: V86
    } = Iuq(), [Dx, b26] = N8.useState(null), x26 = N8.useRef(!1), [na6, u26] = N8.useState(null), [lV6, $T] = N8.useState(!1), m26 = !Bq && z5;

    function ra6() {
        if (lV6 || na6) return;
        if (W7) return "message-selector";
        if (y2) return;
        if (G7[0]) return "sandbox-permission";
        let P1 = !j8 || j8.shouldContinueAnimation;
        if (P1 && a8[0]) return "tool-permission";
        if (P1 && zA[0]) return "prompt";
        if (P1 && n.queue[0]) return "worker-sandbox-permission";
        if (P1 && o.queue[0]) return "elicitation";
        if (P1 && m26) return "cost";
        if (P1 && W6) return "ide-onboarding";
        if (P1 && g6) return "effort-callout";
        if (P1 && J1) return "remote-callout";
        if (P1 && e8) return "lsp-recommendation";
        if (P1 && E1) return "desktop-upsell";
        return
    }
    let K2 = ra6(),
        Cb1 = y2 && (G7[0] || a8[0] || zA[0] || n.queue[0] || o.queue[0] || m26);
    D5.current = K2, N8.useEffect(() => {
        if (!Bq) return;
        let P1 = K2 === "tool-permission",
            Y8 = Date.now();
        if (P1 && KK.current === null) KK.current = Y8;
        else if (!P1 && KK.current !== null) u5.current += Y8 - KK.current, KK.current = null
    }, [K2, Bq]);
    let k86 = N8.useRef(K2);
    N8.useLayoutEffect(() => {
        if (k86.current === "tool-permission" !== (K2 === "tool-permission")) q2();
        k86.current = K2
    }, [K2, q2]);

    function TM() {
        if (K2 === "elicitation") return;
        if (k(`[onCancel] focusedInputDialog=${K2} streamMode=${d7}`), J9.forceEnd(), ez?.trim()) gq((P1) => [...P1, $Z({
            content: ez
        })]);
        if (dE(), K2 === "tool-permission") a8[0]?.onAbort(), $A([]);
        else if (K2 === "prompt") {
            for (let P1 of zA) P1.reject(Error("Prompt cancelled by user"));
            gA([]), M5?.abort()
        } else if (B5.isRemoteMode) B5.cancelRequest();
        else M5?.abort();
        x5(null)
    }
    let iV6 = N8.useCallback(() => {
            let P1 = nP1(m5, 0);
            if (!P1) return;
            if (P5(P1.text), ZY("prompt"), P1.images.length > 0) R2((Y8) => {
                let V8 = {
                    ...Y8
                };
                for (let c7 of P1.images) V8[c7.id] = c7;
                return V8
            })
        }, [P5, ZY, m5, R2]),
        vD = {
            setToolUseConfirmQueue: $A,
            onCancel: TM,
            onAgentsKilled: () => gq((P1) => [...P1, NTq()]),
            isMessageSelectorVisible: W7 || !!oF,
            screen: k6,
            abortSignal: M5?.signal,
            popCommandFromQueue: iV6,
            vimMode: sZ,
            isLocalJSXCommand: j8?.isLocalJSXCommand,
            isSearchingHistory: H4,
            isHelpOpen: fH,
            inputMode: ZH,
            inputValue: m5,
            streamMode: d7
        };
    N8.useEffect(() => {
        if (LD() >= 5 && !z5 && !_W) {
            if (d("tengu_cost_threshold_reached", {}), TD(!0), No6()) GY(!0)
        }
    }, [u7, z5, _W]);
    let oa6 = N8.useCallback(async (P1) => {
        if (E7() && ic6()) {
            let Y8 = al4(),
                V8 = await sl4(P1.host, Y8);
            return new Promise((c7) => {
                if (!V8) {
                    Q1((FA) => [...FA, {
                        hostPattern: P1,
                        resolvePromise: c7
                    }]);
                    return
                }
                Ki4({
                    requestId: Y8,
                    host: P1.host,
                    resolve: c7
                }), i((FA) => ({
                    ...FA,
                    pendingSandboxRequest: {
                        requestId: Y8,
                        host: P1.host
                    }
                }))
            })
        }
        return new Promise((Y8) => {
            let V8 = !1;

            function c7(FA) {
                if (V8) return;
                V8 = !0, Y8(FA)
            }
            Q1((FA) => [...FA, {
                hostPattern: P1,
                resolvePromise: c7
            }]);
            {
                let FA = l.getState().replBridgePermissionCallbacks;
                if (FA) {
                    let v7 = S26();
                    FA.sendRequest(v7, na8, {
                        host: P1.host
                    }, S26(), `Allow network connection to ${P1.host}?`);
                    let N7 = FA.onResponse(v7, (nK) => {
                            N7();
                            let fY = nK.behavior === "allow";
                            Q1((B9) => {
                                return B9.filter((e9) => e9.hostPattern.host === P1.host).forEach((e9) => e9.resolvePromise(fY)), B9.filter((e9) => e9.hostPattern.host !== P1.host)
                            });
                            let y$ = k7.current.get(P1.host);
                            if (y$) {
                                for (let B9 of y$) B9();
                                k7.current.delete(P1.host)
                            }
                        }),
                        cA = () => {
                            N7(), FA.cancelRequest(v7)
                        },
                        l4 = k7.current.get(P1.host) ?? [];
                    l4.push(cA), k7.current.set(P1.host, l4)
                }
            }
        })
    }, [i, l]);
    if (vA.isSandboxingEnabled()) vA.initialize(oa6).catch((P1) => {
        process.stderr.write(`
❌ Sandbox Error: ${_1(P1)}
`), fK(1, "other")
    });
    let HT = N8.useCallback((P1, Y8) => {
        i((V8) => ({
            ...V8,
            toolPermissionContext: {
                ...P1,
                mode: Y8?.preserveMode ? V8.toolPermissionContext.mode : P1.mode
            }
        })), setImmediate((V8) => {
            V8((c7) => {
                return c7.forEach((FA) => {
                    FA.recheckPermission()
                }), c7
            })
        }, $A)
    }, [i, $A]);
    N8.useEffect(() => {
        return Oi4(HT), () => Hi4()
    }, [HT]);
    let wW = Ymq($A, HT),
        qS = N8.useCallback((P1, Y8) => (V8) => new Promise((c7, FA) => {
            gA((v7) => [...v7, {
                request: V8,
                title: P1,
                toolInputSummary: Y8,
                resolve: c7,
                reject: FA
            }])
        }), []),
        OW = N8.useCallback((P1, Y8, V8, c7) => {
            let FA = l.getState();
            return {
                abortController: V8,
                options: {
                    commands: qA,
                    tools: U8,
                    debug: q,
                    verbose: FA.verbose,
                    mainLoopModel: c7,
                    thinkingConfig: FA.thinkingEnabled !== !1 ? h : {
                        type: "disabled"
                    },
                    mcpClients: gt8(H, FA.mcp.clients),
                    mcpResources: FA.mcp.resources,
                    ideInstallationStatus: K1,
                    isNonInteractiveSession: !1,
                    dynamicMcpConfig: T6,
                    theme: OT,
                    agentDefinitions: P4 ? {
                        ...FA.agentDefinitions,
                        allowedAgentTypes: P4
                    } : FA.agentDefinitions,
                    customSystemPrompt: D,
                    appendSystemPrompt: X,
                    refreshTools: () => {
                        let v7 = l.getState(),
                            N7 = u66(v7.toolPermissionContext, v7.mcp.tools),
                            cA = fN6(H7, N7, v7.toolPermissionContext.mode);
                        if (!u) return cA;
                        return _c(u, cA, !1, !0).resolvedTools
                    }
                },
                getAppState: () => l.getState(),
                setAppState: i,
                messages: P1,
                setMessages: gq,
                updateFileHistoryState(v7) {
                    i((N7) => {
                        let cA = v7(N7.fileHistory);
                        if (cA === N7.fileHistory) return N7;
                        return {
                            ...N7,
                            fileHistory: cA
                        }
                    })
                },
                updateAttributionState(v7) {
                    i((N7) => {
                        let cA = v7(N7.attribution);
                        if (cA === N7.attribution) return N7;
                        return {
                            ...N7,
                            attribution: cA
                        }
                    })
                },
                openMessageSelector: () => {
                    if (!Z) Hq(!0)
                },
                onChangeAPIKey: V86,
                readFileState: AS.current,
                setToolJSX: o8,
                addNotification: o6,
                sendOSNotification: (v7) => {
                    Hg(v7, q6)
                },
                onChangeDynamicMcpConfig: Q6,
                onInstallIDEExtension: c6,
                nestedMemoryAttachmentTriggers: new Set,
                dynamicSkillDirTriggers: new Set,
                discoveredSkillNames: new Set,
                setResponseLength: fM,
                pushApiMetricsEntry: void 0,
                setStreamMode: W4,
                onCompactProgress: (v7) => {
                    switch (v7.type) {
                        case "hooks_start":
                            Z1("claudeBlue_FOR_SYSTEM_SPINNER"), u8("claudeBlueShimmer_FOR_SYSTEM_SPINNER"), I6(v7.hookType === "pre_compact" ? "Running PreCompact hooks…" : v7.hookType === "post_compact" ? "Running PostCompact hooks…" : "Running SessionStart hooks…");
                            break;
                        case "compact_start":
                            I6("Compacting conversation");
                            break;
                        case "compact_end":
                            I6(null), Z1(null), u8(null);
                            break
                    }
                },
                setInProgressToolUseIDs: iK,
                setHasInterruptibleToolInProgress: (v7) => {
                    Uq.current = v7
                },
                resume: aN,
                setConversationId: S2,
                requestPrompt: void 0,
                contentReplacementState: Pj.current
            }
        }, [qA, U8, q, H, K1, T6, OT, P4, l, i, V86, o6, Q6, aN, qS, Z, D, X, S2]),
        nV6 = N8.useCallback(() => {
            M5?.abort(), zY4((P1) => P1.mode === "task-notification"), (async () => {
                let [P1, Y8, V8] = await Promise.all([R0(U8, w6, Array.from(g.additionalWorkingDirectories.keys()), V6), a2(), mw()]), c7 = OW(iY.current, [], new AbortController, w6), FA = cg({
                    mainThreadAgentDefinition: u,
                    toolUseContext: c7,
                    customSystemPrompt: D,
                    defaultSystemPrompt: P1,
                    appendSystemPrompt: X
                });
                c7.renderedSystemPrompt = FA, Yl4({
                    messages: [...iY.current],
                    queryParams: {
                        systemPrompt: FA,
                        userContext: Y8,
                        systemContext: V8,
                        canUseTool: wW,
                        toolUseContext: c7,
                        querySource: Qc6()
                    },
                    description: Cq,
                    setAppState: i,
                    agentDefinition: u
                })
            })()
        }, [M5, U8, w6, g, V6, u, OW, D, X, wW, i]),
        {
            handleBackgroundSession: sN
        } = mmq({
            setMessages: gq,
            setIsLoading: B4,
            resetLoadingState: dE,
            setAbortController: x5,
            onBackgroundQuery: nV6
        }),
        rV6 = N8.useCallback((P1) => {
            xN6(P1, (Y8) => {
                if (RZ(Y8)) {
                    if (xgq()) gq((V8) => [...fN(V8), Y8]);
                    else gq(() => [Y8]);
                    S2(S26())
                } else if (Y8.type === "progress" && er6(Y8.data.type)) gq((V8) => {
                    let c7 = V8.at(-1);
                    if (c7?.type === "progress" && c7.parentToolUseID === Y8.parentToolUseID && c7.data.type === Y8.data.type) return [...V8.slice(0, -1), Y8];
                    return [...V8, Y8]
                });
                else gq((V8) => [...V8, Y8])
            }, (Y8) => {
                fM((V8) => V8 + Y8.length)
            }, W4, F3, (Y8) => {
                gq((V8) => V8.filter((c7) => c7 !== Y8)), Or8(Y8.uuid)
            }, k3, (Y8) => {
                let V8 = Date.now(),
                    c7 = mO.current;
                GD.current.push({
                    ...Y8,
                    firstTokenTime: V8,
                    lastTokenTime: V8,
                    responseLengthBaseline: c7,
                    endResponseLength: c7
                })
            }, rN)
        }, [gq, fM, W4, F3, k3, rN]),
        sF = N8.useCallback(async (P1, Y8, V8, c7, FA, v7) => {
            let N7 = Y8.filter((e9) => e9.type === "user" || e9.type === "assistant").pop();
            if (c7) {
                Nl.handleQueryStart(V6);
                let e9 = Gv(V6);
                if (e9) $R7(e9)
            }
            if (h06(), !A9 && !X5 && !v4 && P1.length <= 1 && N7?.type === "user" && typeof N7.message.content === "string") d34(N7.message.content).then((e9) => {
                if (e9) g4(e9)
            });
            if (l.setState((e9) => {
                    let ND = e9.toolPermissionContext.alwaysAllowRules.command;
                    if (ND === FA || ND?.length === FA.length && ND.every((HW, jJ) => HW === FA[jJ])) return e9;
                    return {
                        ...e9,
                        toolPermissionContext: {
                            ...e9.toolPermissionContext,
                            alwaysAllowRules: {
                                ...e9.toolPermissionContext.alwaysAllowRules,
                                command: FA
                            }
                        }
                    }
                }), !c7) {
                if (Y8.some(RZ)) S2(S26());
                dE(), x5(null);
                return
            }
            let cA = OW(P1, Y8, V8, v7);
            K5("query_context_loading_start");
            let [, , l4, nK, fY] = await Promise.all([Jc6(g, i), Mc6(g, i, l.getState().fastMode), R0(U8, v7, Array.from(g.additionalWorkingDirectories.keys()), V6), a2(), mw()]), y$ = {
                ...nK,
                ...Cvz(V6),
                ...{}
            };
            K5("query_context_loading_end");
            let B9 = cg({
                mainThreadAgentDefinition: u,
                toolUseContext: cA,
                customSystemPrompt: D,
                defaultSystemPrompt: l4,
                appendSystemPrompt: X
            });
            cA.renderedSystemPrompt = B9, K5("query_query_start"), Au1(), qu1(), Yu1();
            for await (let e9 of Yh({
                messages: P1,
                systemPrompt: B9,
                userContext: y$,
                systemContext: fY,
                canUseTool: wW,
                toolUseContext: cA,
                querySource: Qc6()
            })) rV6(e9);
            K5("query_end"), dE(), MKq(), await W?.(iY.current)
        }, [V6, dE, OW, g, i, U8, D, W, X, wW, u, rV6, X5, A9]),
        tZ = N8.useCallback(async (P1, Y8, V8, c7, FA, v7, N7) => {
            if (E7()) {
                let l4 = l5(),
                    nK = i3();
                if (l4 && nK) aQ6(l4, nK, !0)
            }
            let cA = J9.tryStart();
            if (cA === null) {
                d("tengu_concurrent_onquery_detected", {}), P1.filter((l4) => l4.type === "user" && !l4.isMeta).map((l4) => $l(l4.message.content)).filter((l4) => l4 !== null).forEach((l4, nK) => {
                    if (_0({
                            value: l4,
                            mode: "prompt"
                        }), nK === 0) d("tengu_concurrent_onquery_enqueued", {})
                });
                return
            }
            try {
                u9.current = Date.now(), u5.current = 0, KK.current = null, gq((nK) => [...nK, ...P1]), E3(void 0), mO.current = 0, GD.current = [], F3([]), fD(null);
                let l4 = iY.current;
                if (v7 && N7) {
                    if (!await v7(N7, l4)) return
                }
                await sF(l4, P1, Y8, V8, c7, FA)
            } finally {
                if (J9.end(cA)) {
                    BO(Date.now()), dE(), tz.current();
                    let l4, nK = Date.now() - u9.current - u5.current;
                    if ((nK > 30000 || l4 !== void 0) && !Y8.signal.aborted && !y6)
                        if (BR(l.getState().tasks).some((y$) => y$.status === "running")) {
                            if (lY.current === null) lY.current = u9.current;
                            if (l4) e3.current = l4
                        } else gq((y$) => [...y$, Ar8(nK, l4)]);
                    x5(null)
                }
            }
        }, [sF, i, dE, J9]),
        KS = N8.useRef(!1);
    N8.useEffect(() => {
        let P1 = r;
        if (!P1 || Bq || KS.current) return;
        KS.current = !0;
        async function Y8(V8) {
            if (V8.clearContext) {
                let v7 = V8.message.planContent ? bB() : void 0,
                    {
                        clearConversation: N7
                    } = await Promise.resolve().then(() => (yQ8(), T3q));
                if (await N7({
                        setMessages: gq,
                        readFileState: AS.current,
                        getAppState: () => l.getState(),
                        setAppState: i,
                        setConversationId: S2
                    }), v7) KV8(R1(), v7)
            }
            let c7 = V8.message.planContent && !1;
            if (i((v7) => {
                    let N7 = V8.mode ? _v(v7.toolPermissionContext, EI1(V8.mode, V8.allowedPrompts)) : v7.toolPermissionContext;
                    if (V8.mode === "auto") N7 = Vi({
                        ...N7,
                        mode: "auto",
                        prePlanMode: void 0
                    });
                    return {
                        ...v7,
                        initialMessage: null,
                        toolPermissionContext: N7,
                        ...c7 && {
                            pendingPlanVerification: {
                                plan: V8.message.planContent,
                                verificationStarted: !1,
                                verificationCompleted: !1
                            }
                        }
                    }
                }), iz()) lf6((v7) => {
                i((N7) => ({
                    ...N7,
                    fileHistory: v7(N7.fileHistory)
                }))
            }, V8.message.uuid);
            let FA = V8.message.message.content;
            if (typeof FA === "string" && !V8.message.planContent) tN(FA, {
                setCursorOffset: () => {},
                clearBuffer: () => {},
                resetHistory: () => {}
            });
            else {
                let v7 = sK();
                x5(v7), tZ([V8.message], v7, !0, [], w6)
            }
            setTimeout((v7) => {
                v7.current = !1
            }, 100, KS)
        }
        Y8(P1)
    }, [r, Bq, gq, i, tZ, w6, U8]);
    let tN = N8.useCallback(async (P1, Y8, V8, c7) => {
            if (q2(), !V8 && P1.trim().startsWith("/")) {
                let N7 = P1.trim(),
                    cA = N7.indexOf(" "),
                    l4 = cA === -1 ? N7.slice(1) : N7.slice(1, cA),
                    nK = cA === -1 ? "" : N7.slice(cA + 1).trim(),
                    fY = qA.find((B9) => B9.isEnabled() && (B9.name === l4 || B9.aliases?.includes(l4) || B9.userFacingName() === l4)),
                    y$ = J9.isActive && (fY?.immediate || c7?.fromKeybinding);
                if (fY && y$ && fY.type === "local-jsx") {
                    if (P1.trim() === WH.current.trim()) P5(""), Y8.setCursorOffset(0), Y8.clearBuffer();
                    d("tengu_immediate_command_executed", {
                        commandName: fY.name,
                        fromKeybinding: c7?.fromKeybinding ?? !1
                    }), (async () => {
                        let e9 = (h86, eF) => {
                                o8({
                                    jsx: null,
                                    shouldHidePromptInput: !1,
                                    clearLocalJSX: !0
                                });
                                let eN = [];
                                if (h86 && eF?.display !== "skip") o6({
                                    key: `immediate-${fY.name}`,
                                    text: h86,
                                    priority: "immediate"
                                }), eN.push(Z66(uc6(fY.userFacingName(), nK)), Z66(`<${WP}>${h86}</${WP}>`));
                                if (eF?.metaMessages?.length) eN.push(...eF.metaMessages.map((qn) => p1({
                                    content: qn,
                                    isMeta: !0
                                })));
                                if (eN.length) gq((qn) => [...qn, ...eN]);
                                if (t9 !== void 0) P5(t9.text), Y8.setCursorOffset(t9.cursorOffset), R2(t9.pastedContents), d8(void 0)
                            },
                            ND = OW(iY.current, [], sK(), w6),
                            jJ = await (await fY.load()).call(e9, ND, nK);
                        if (jJ) o8({
                            jsx: jJ,
                            shouldHidePromptInput: !1,
                            isLocalJSXCommand: !0
                        })
                    })();
                    return
                }
            }
            if (B5.isRemoteMode && !P1.trim()) return;
            if (!c7?.fromKeybinding) M36({
                display: V8 ? P1 : p84(P1, ZH),
                pastedContents: V8 ? {} : p3
            });
            let FA = !V8 && P1.trim().startsWith("/"),
                v7 = !Bq || V8 || B5.isRemoteMode;
            if (t9 !== void 0 && !FA && v7) P5(t9.text), Y8.setCursorOffset(t9.cursorOffset), R2(t9.pastedContents), d8(void 0);
            else if (v7) {
                if (!c7?.fromKeybinding) P5(""), Y8.setCursorOffset(0);
                R2({})
            }
            if (v7) ZY("prompt"), E6(void 0), GH((N7) => N7 + 1), Y8.clearBuffer();
            if (V8) {
                let {
                    queryRequired: N7
                } = await p4q(V8.state, V8.speculationSessionTimeSavedMs, V8.setAppState, P1, {
                    setMessages: gq,
                    readFileState: AS,
                    cwd: AA()
                });
                if (N7) {
                    let cA = sK();
                    x5(cA), tZ([], cA, !0, [], w6)
                }
                return
            }
            if (B5.isRemoteMode && !(FA && qA.find((N7) => {
                    let cA = P1.trim().slice(1).split(/\s/)[0];
                    return N7.isEnabled() && (N7.name === cA || N7.aliases?.includes(cA) || N7.userFacingName() === cA)
                })?.type === "local-jsx")) {
                let N7 = Object.values(p3),
                    cA = N7.filter((B9) => B9.type === "image"),
                    l4 = cA.length > 0 ? cA.map((B9) => B9.id) : void 0,
                    nK = P1.trim(),
                    fY = P1.trim();
                if (N7.length > 0) {
                    let B9 = [],
                        e9 = [],
                        ND = P1.trim();
                    if (ND) B9.push({
                        type: "text",
                        text: ND
                    }), e9.push({
                        type: "text",
                        text: ND
                    });
                    for (let HW of N7)
                        if (HW.type === "image") {
                            let jJ = {
                                type: "base64",
                                media_type: HW.mediaType ?? "image/png",
                                data: HW.content
                            };
                            B9.push({
                                type: "image",
                                source: jJ
                            }), e9.push({
                                type: "image",
                                source: jJ
                            })
                        } else B9.push({
                            type: "text",
                            text: HW.content
                        }), e9.push({
                            type: "text",
                            text: HW.content
                        });
                    nK = B9, fY = e9
                }
                let y$ = p1({
                    content: nK,
                    imagePasteIds: l4
                });
                gq((B9) => [...B9, y$]), await B5.sendMessage(fY, {
                    uuid: y$.uuid
                });
                return
            }
            if (await Mq(), await Ob1({
                    input: P1,
                    helpers: Y8,
                    queryGuard: J9,
                    isExternalLoading: UY,
                    mode: ZH,
                    commands: qA,
                    onInputChange: P5,
                    setPastedContents: R2,
                    setToolJSX: o8,
                    getToolUseContext: OW,
                    messages: iY.current,
                    mainLoopModel: w6,
                    pastedContents: p3,
                    ideSelection: b6,
                    setUserInputOnProcessing: E3,
                    setAbortController: x5,
                    abortController: M5,
                    onQuery: tZ,
                    setAppState: i,
                    querySource: Qc6(),
                    onBeforeQuery: P,
                    canUseTool: wW,
                    addNotification: o6,
                    setMessages: gq,
                    streamMode: Dz.current,
                    hasInterruptibleToolInProgress: Uq.current
                }), (FA || Bq) && t9 !== void 0) P5(t9.text), Y8.setCursorOffset(t9.cursorOffset), R2(t9.pastedContents), d8(void 0)
        }, [J9, Bq, UY, ZH, qA, P5, ZY, R2, GH, E6, o8, OW, w6, p3, b6, E3, x5, o6, tZ, t9, d8, i, P, wW, bz, gq, Mq, AP]),
        aa6 = N8.useCallback(async (P1, Y8, V8) => {
            tQ6(Y8.id, P1, i), P5(""), V8.setCursorOffset(0), V8.clearBuffer()
        }, [i, P5]),
        E86 = N8.useCallback(() => {
            let P1 = Dx ? Vgq(Dx) : "/issue";
            b26(null), tN(P1, {
                setCursorOffset: () => {},
                clearBuffer: () => {},
                resetHistory: () => {}
            }).catch((Y8) => {
                k(`Auto-run ${P1} failed: ${_1(Y8)}`)
            })
        }, [tN, Dx]),
        sa6 = N8.useCallback(() => {
            b26(null)
        }, []),
        y86 = N8.useCallback(() => {
            tN("/feedback", {
                setCursorOffset: () => {},
                clearBuffer: () => {},
                resetHistory: () => {}
            }).catch((Y8) => {
                k(`Survey feedback request failed: ${Y8 instanceof Error?Y8.message:String(Y8)}`)
            })
        }, [tN]),
        oV6 = N8.useRef(tN);
    oV6.current = tN;
    let B26 = N8.useCallback(() => {
            oV6.current("/rate-limit-options", {
                setCursorOffset: () => {},
                clearBuffer: () => {},
                resetHistory: () => {}
            })
        }, []),
        aV6 = N8.useCallback(async () => {
            if ($T(!0), S0() !== null) {
                u26(b8.createElement(wh1, {
                    showWorktree: !0,
                    onDone: () => {},
                    onCancel: () => {
                        u26(null), $T(!1)
                    }
                }));
                return
            }
            let V8 = await (await Gr6.load()).call(() => {});
            u26(V8)
        }, []),
        sV6 = N8.useCallback(() => {
            Hq((P1) => !P1)
        }, []),
        L86 = N8.useCallback((P1, Y8) => {
            gq(u7.slice(0, Y8)), S2(S26()), W66(), d("tengu_conversation_rewind", {
                preRewindMessageCount: u7.length,
                postRewindMessageCount: Y8,
                messagesRemoved: u7.length - Y8,
                rewindToMessageIndex: Y8
            }), i((V8) => ({
                ...V8,
                toolPermissionContext: P1.permissionMode && V8.toolPermissionContext.mode !== P1.permissionMode ? {
                    ...V8.toolPermissionContext,
                    mode: P1.permissionMode
                } : V8.toolPermissionContext,
                promptSuggestion: {
                    text: null,
                    promptId: null,
                    shownAt: 0,
                    acceptedAt: 0,
                    generationRequestId: null
                }
            }))
        }, [u7, gq, i]),
        tV6 = N8.useCallback(async (P1) => {
            setImmediate(async (Y8, V8, c7, FA, v7, N7) => {
                Y8(V8, c7.lastIndexOf(V8));
                let cA = Fg(V8);
                if (cA !== null) {
                    let l4 = d4(cA, "bash-input"),
                        nK = d4(cA, XP);
                    if (l4) FA(l4), v7("bash");
                    else if (nK) {
                        let fY = d4(cA, "command-args") || "";
                        FA(`${nK} ${fY}`), v7("prompt")
                    } else FA(Yr(cA)), v7("prompt")
                }
                if (Array.isArray(V8.message.content) && V8.message.content.some((l4) => l4.type === "image")) {
                    let l4 = V8.message.content.filter((nK) => nK.type === "image");
                    if (l4.length > 0) {
                        let nK = {};
                        l4.forEach((fY, y$) => {
                            if (fY.source.type === "base64") {
                                let B9 = V8.imagePasteIds?.[y$] ?? y$ + 1;
                                nK[B9] = {
                                    id: B9,
                                    type: "image",
                                    content: fY.source.data,
                                    mediaType: fY.source.media_type
                                }
                            }
                        }), N7(nK)
                    }
                }
            }, L86, P1, u7, P5, ZY, R2)
        }, [u7, L86, P5]),
        eZ = N8.useCallback(() => {
            let P1 = u7[u7.length - 1],
                Y8 = P1 && "message" in P1 && Array.isArray(P1.message.content) && P1.message.content[0]?.type === "text" ? P1.message.content[0].text : void 0;
            if (Y8 !== D66 && Y8 !== P0) return !1;
            let V8 = u7.findLast(XV6);
            if (!V8) return !1;
            let c7 = u7.lastIndexOf(V8);
            if (Array.isArray(V8.message.content) && V8.message.content.some((v7) => v7.type === "image")) return !1;
            if (!YI1(u7, c7)) return !1;
            if (Wn4(U, V8.uuid)) return !1;
            L86(V8, c7);
            let FA = Fg(V8);
            if (FA !== null) {
                let v7 = d4(FA, "bash-input"),
                    N7 = d4(FA, XP);
                if (v7) P5(v7), ZY("bash");
                else if (N7) {
                    let cA = d4(FA, "command-args") || "";
                    P5(`${N7} ${cA}`), ZY("prompt")
                } else P5(Yr(FA)), ZY("prompt")
            }
            return !0
        }, [u7, U, L86, P5]);
    async function ta6() {
        V86();
        let P1 = vO();
        if (P1.length > 0) {
            let Y8 = P1.map((V8) => `  [${V8.type}] ${V8.path} (${V8.content.length} chars)${V8.parent?` (included by ${V8.parent})`:""}`).join(`
`);
            k(`Loaded ${P1.length} CLAUDE.md/rules files:
${Y8}`)
        } else k("No CLAUDE.md/rules files found");
        for (let Y8 of P1) AS.current.set(Y8.path, {
            content: Y8.contentDiffersFromDisk ? Y8.rawContent ?? Y8.content : Y8.content,
            timestamp: Date.now(),
            offset: void 0,
            limit: void 0,
            isPartialView: Y8.contentDiffersFromDisk
        })
    }
    Euq(OSq()), vSq(u7, u7.length === Y?.length);
    let {
        sendBridgeResult: $W
    } = RSq(u7, gq, E2);
    tz.current = $W, Ruq();
    let g26 = N8.useRef(!1);
    N8.useEffect(() => {
        if (e.length < 1) {
            g26.current = !1;
            return
        }
        if (g26.current) return;
        g26.current = !0, d1((P1) => ({
            ...P1,
            promptQueueUseCount: (P1.promptQueueUseCount ?? 0) + 1
        }))
    }, [e.length]);
    let Ib1 = N8.useCallback(() => l.getState(), [l]),
        bb1 = N8.useCallback(async (P1) => {
            await Ob1({
                helpers: {
                    setCursorOffset: () => {},
                    clearBuffer: () => {},
                    resetHistory: () => {}
                },
                queryGuard: J9,
                commands: qA,
                onInputChange: () => {},
                setPastedContents: () => {},
                setToolJSX: o8,
                getToolUseContext: OW,
                messages: u7,
                mainLoopModel: w6,
                ideSelection: b6,
                setUserInputOnProcessing: E3,
                setAbortController: x5,
                onQuery: tZ,
                setAppState: i,
                querySource: Qc6(),
                onBeforeQuery: P,
                canUseTool: wW,
                addNotification: o6,
                setMessages: gq,
                queuedCommands: P1
            })
        }, [J9, qA, o8, OW, u7, w6, b6, E3, wW, x5, tZ, o6, i, P]);
    jmq({
        executeQueuedInput: bb1,
        hasActiveLocalJsxUI: j8?.isLocalJSXCommand ?? !1,
        queryGuard: J9
    }), N8.useEffect(() => {
        b96.recordUserActivity(), i86(!0)
    }, [m5, Xj]), N8.useEffect(() => {
        if (Xj === 1) Qa8()
    }, [Xj]), N8.useEffect(() => {
        if (Bq) return;
        if (Xj === 0) return;
        if (jx === 0) return;
        let P1 = setTimeout((Y8, V8, c7, FA, v7) => {
            if (yx() > Y8) return;
            let cA = Date.now() - Y8;
            if (!V8 && !c7 && FA.current === void 0 && cA >= X1().messageIdleNotifThresholdMs) Hg({
                message: "Claude is waiting for your input",
                notificationType: "idle_prompt"
            }, v7)
        }, X1().messageIdleNotifThresholdMs, jx, Bq, j8, D5, q6);
        return () => clearTimeout(P1)
    }, [Bq, j8, Xj, jx, q6]);
    let YS = N8.useCallback((P1, Y8) => {
            if (J9.isActive) return !1;
            if (AY4().some((FA) => FA.mode === "prompt" || FA.mode === "bash")) return !1;
            let V8 = sK();
            x5(V8);
            let c7 = p1({
                content: P1,
                isMeta: Y8?.isMeta ? !0 : void 0
            });
            return tZ([c7], V8, !0, [], w6), !0
        }, [tZ, w6, l]),
        Xx = Rvz({
            setInputValueRaw: ew,
            inputValueRef: WH,
            insertTextRef: Dj
        });
    ymq({
        enabled: E7(),
        isLoading: Bq,
        focusedInputDialog: K2,
        onSubmitMessage: YS
    }), Mmq({
        isLoading: Bq,
        onSubmitMessage: YS
    });
    {
        let P1 = l.getState().kairosEnabled;
        Ivz({
            isLoading: Bq,
            assistantMode: P1
        })
    }
    N8.useEffect(() => {
        if (e.some((P1) => P1.priority === "now")) E2.current?.abort("interrupt")
    }, [e]), N8.useEffect(() => {
        return ta6(), () => {
            Nl.shutdown()
        }
    }, []);
    let {
        internal_eventEmitter: tF
    } = Ms(), [ei, ea6] = N8.useState(0);
    N8.useEffect(() => {
        let P1 = () => {
                process.stdout.write(`
Claude Code has been suspended. Run \`fg\` to bring Claude Code back.
Note: ctrl + z now suspends Claude Code, ctrl + _ undoes input.
`)
            },
            Y8 = () => {
                ea6((V8) => V8 + 1)
            };
        return tF?.on("suspend", P1), tF?.on("resume", Y8), () => {
            tF?.off("suspend", P1), tF?.off("resume", Y8)
        }
    }, [tF]);
    let As6 = N8.useMemo(() => {
            if (!Bq) return null;
            let P1 = u7.filter((l4) => l4.type === "progress" && l4.data.type === "hook_progress" && (l4.data.hookEvent === "Stop" || l4.data.hookEvent === "SubagentStop"));
            if (P1.length === 0) return null;
            let Y8 = P1[P1.length - 1]?.toolUseID;
            if (!Y8) return null;
            if (u7.some((l4) => l4.type === "system" && l4.subtype === "stop_hook_summary" && l4.toolUseID === Y8)) return null;
            let c7 = P1.filter((l4) => l4.toolUseID === Y8),
                FA = c7.length,
                v7 = u7.filter((l4) => {
                    if (l4.type !== "attachment") return !1;
                    let nK = l4.attachment;
                    return "hookEvent" in nK && (nK.hookEvent === "Stop" || nK.hookEvent === "SubagentStop") && "toolUseID" in nK && nK.toolUseID === Y8
                }).length,
                N7 = c7.find((l4) => l4.data.statusMessage)?.data.statusMessage;
            if (N7) return FA === 1 ? `${N7}…` : `${N7}… ${v7}/${FA}`;
            let cA = c7[0]?.data.hookEvent === "SubagentStop" ? "subagent stop" : "stop";
            return FA === 1 ? `running ${cA} hook` : `running stop hooks… ${v7}/${FA}`
        }, [u7, Bq]),
        qs6 = N8.useCallback(() => {
            HJ({
                messagesLength: u7.length,
                streamingToolUsesLength: JK.length
            })
        }, [u7.length, JK.length]),
        Ks6 = N8.useCallback(() => {
            HJ(null)
        }, []),
        F26 = !1,
        p26 = {
            screen: k6,
            setScreen: Z6,
            showAllInTranscript: u6,
            setShowAllInTranscript: C6,
            messageCount: u7.length,
            onEnterTranscript: qs6,
            onExitTranscript: Ks6,
            virtualScrollActive: F26
        },
        xb1 = uO ? xO.slice(0, uO.messagesLength) : xO,
        ub1 = uO ? JK.slice(0, uO.streamingToolUsesLength) : JK;
    if (Fuq({
            onOpenBackgroundTasks: () => Jx(!0)
        }), hvz(), iuq(), k6 === "transcript") {
        let Y8 = b8.createElement(G_6, {
                messages: xb1,
                tools: U8,
                commands: qA,
                verbose: !0,
                toolJSX: null,
                toolUseConfirmQueue: [],
                inProgressToolUseIDs: n4,
                isMessageSelectorVisible: !1,
                conversationId: h2,
                screen: k6,
                agentDefinitions: Q,
                streamingToolUses: ub1,
                showAllInTranscript: u6,
                onOpenRateLimitOptions: B26,
                isLoading: Bq,
                hidePastThinking: !0,
                streamingThinking: MK,
                scrollRef: void 0
            }),
            V8 = j8 && b8.createElement(m, {
                flexDirection: "column",
                width: "100%"
            }, j8.jsx);
        return b8.createElement(aj, null, b8.createElement(mgq, {
            isAnimating: j3,
            title: Cq,
            disabled: A9
        }), b8.createElement(xt8, {
            ...p26
        }), b8.createElement(bgq, {
            voiceHandleKeyEvent: Xx.handleKeyEvent,
            stripTrailing: Xx.stripTrailing,
            resetAnchor: Xx.resetAnchor,
            isActive: !j8?.isLocalJSXCommand
        }), b8.createElement(ut8, {
            onSubmit: tN,
            isActive: !j8?.isLocalJSXCommand
        }), null, b8.createElement(mt8, {
            ...vD
        }), b8.createElement(b8.Fragment, null, Y8, V8, b8.createElement(XBq, null), b8.createElement(Bvz, {
            showAllInTranscript: u6,
            virtualScroll: !1
        })))
    }
    let eV6 = a ? $6[a] : void 0,
        zS = eV6 && M$(eV6) ? eV6 : void 0,
        Ak6 = oZ || !Bq,
        An = zS?.messages ?? (Ak6 ? u7 : xO),
        R86 = Ak6 ? YA : YA ?? E$,
        Ys6 = K2 === "tool-permission" ? b8.createElement(HIq, {
            key: a8[0]?.toolUseID,
            onDone: () => $A(([P1, ...Y8]) => Y8),
            onReject: iV6,
            toolUseConfirm: a8[0],
            toolUseContext: OW(u7, u7, M5 ?? sK(), w6),
            verbose: B,
            workerBadge: a8[0]?.workerBadge
        }) : null;
    return b8.createElement(aj, null, b8.createElement(mgq, {
        isAnimating: j3,
        title: Cq,
        disabled: A9
    }), b8.createElement(xt8, {
        ...p26
    }), b8.createElement(bgq, {
        voiceHandleKeyEvent: Xx.handleKeyEvent,
        stripTrailing: Xx.stripTrailing,
        resetAnchor: Xx.resetAnchor,
        isActive: !j8?.isLocalJSXCommand
    }), b8.createElement(ut8, {
        onSubmit: tN,
        isActive: !j8?.isLocalJSXCommand
    }), null, b8.createElement(mt8, {
        ...vD
    }), b8.createElement(GL1, {
        key: ei,
        dynamicMcpConfig: T6,
        isStrictMcpConfig: M
    }, b8.createElement(bvz, {
        scrollRef: x9,
        overlay: Ys6,
        newMessageCount: zS || !L2 ? 0 : Mj?.count ?? 0,
        onPillClick: () => A2(x9.current),
        scrollable: b8.createElement(b8.Fragment, null, b8.createElement(vmq, null), b8.createElement(G_6, {
            messages: An,
            tools: U8,
            commands: qA,
            verbose: B,
            toolJSX: j8,
            toolUseConfirmQueue: a8,
            inProgressToolUseIDs: zS ? zS.inProgressToolUseIDs ?? new Set : n4,
            isMessageSelectorVisible: W7,
            conversationId: h2,
            screen: k6,
            streamingToolUses: JK,
            showAllInTranscript: u6,
            agentDefinitions: Q,
            onOpenRateLimitOptions: B26,
            isLoading: Bq,
            streamingText: Bq && !zS ? aZ : null,
            isBriefOnly: zS ? !1 : Wz,
            unseenDivider: zS ? void 0 : Mj,
            scrollRef: void 0
        }), b8.createElement(iBq, null), !Z && R86 && b8.createElement(cY6, {
            param: {
                text: R86,
                type: "text"
            },
            addMargin: !0,
            verbose: B
        }), j8 && b8.createElement(m, {
            flexDirection: "column",
            width: "100%"
        }, j8.jsx), !1, b8.createElement(m, {
            flexGrow: 1
        }), QV6 && b8.createElement(jZ4, {
            mode: d7,
            spinnerTip: K6,
            responseLengthRef: mO,
            apiMetricsRef: GD,
            overrideMessage: nF,
            spinnerSuffix: As6,
            verbose: B,
            loadingStartTimeRef: u9,
            totalPausedMsRef: u5,
            pauseStartTimeRef: KK,
            overrideColor: m6,
            overrideShimmerColor: M8,
            hasActiveTools: n4.size > 0,
            leaderIsIdle: !Bq
        }), !QV6 && !Bq && !YA && !oi && Wz && !zS && b8.createElement(JZ4, null), null, null),
        bottom: b8.createElement(m, {
            flexDirection: "column",
            width: "100%"
        }, !QV6 && !j8?.isLocalJSXCommand && s && GA && GA.length > 0 && b8.createElement(m, {
            width: "100%",
            flexDirection: "column"
        }, b8.createElement(VZ1, {
            tasks: GA,
            isStandalone: !0
        })), K2 === "sandbox-permission" && b8.createElement(ct8, {
            key: G7[0].hostPattern.host,
            hostPattern: G7[0].hostPattern,
            onUserResponse: (P1) => {
                let {
                    allow: Y8,
                    persistToSettings: V8
                } = P1, c7 = G7[0];
                if (!c7) return;
                let FA = c7.hostPattern.host;
                if (V8) {
                    let N7 = {
                        type: "addRules",
                        rules: [{
                            toolName: sO,
                            ruleContent: `domain:${FA}`
                        }],
                        behavior: Y8 ? "allow" : "deny",
                        destination: "localSettings"
                    };
                    i((cA) => ({
                        ...cA,
                        toolPermissionContext: Ez(cA.toolPermissionContext, N7)
                    })), Ym(N7), vA.refreshConfig()
                }
                Q1((N7) => {
                    return N7.filter((cA) => cA.hostPattern.host === FA).forEach((cA) => cA.resolvePromise(Y8)), N7.filter((cA) => cA.hostPattern.host !== FA)
                });
                let v7 = k7.current.get(FA);
                if (v7) {
                    for (let N7 of v7) N7();
                    k7.current.delete(FA)
                }
            }
        }), K2 === "prompt" && b8.createElement(fIq, {
            key: zA[0].request.prompt,
            title: zA[0].title,
            toolInputSummary: zA[0].toolInputSummary,
            request: zA[0].request,
            onRespond: (P1) => {
                let Y8 = zA[0];
                if (!Y8) return;
                Y8.resolve({
                    prompt_response: Y8.request.prompt,
                    selected: P1
                }), gA(([, ...V8]) => V8)
            },
            onAbort: () => {
                let P1 = zA[0];
                if (!P1) return;
                P1.reject(Error("Prompt cancelled by user")), gA(([, ...Y8]) => Y8)
            }
        }), X6 && b8.createElement(Ls8, {
            toolName: X6.toolName,
            description: X6.description
        }), z6 && b8.createElement(Ls8, {
            toolName: "Network Access",
            description: `Waiting for leader to approve network access to ${z6.host}`
        }), K2 === "worker-sandbox-permission" && b8.createElement(ct8, {
            key: n.queue[0].requestId,
            hostPattern: {
                host: n.queue[0].host,
                port: void 0
            },
            onUserResponse: (P1) => {
                let {
                    allow: Y8,
                    persistToSettings: V8
                } = P1, c7 = n.queue[0];
                if (!c7) return;
                let FA = c7.host;
                if (tl4(c7.workerName, c7.requestId, FA, Y8, N6?.teamName), V8 && Y8) {
                    let v7 = {
                        type: "addRules",
                        rules: [{
                            toolName: sO,
                            ruleContent: `domain:${FA}`
                        }],
                        behavior: "allow",
                        destination: "localSettings"
                    };
                    i((N7) => ({
                        ...N7,
                        toolPermissionContext: Ez(N7.toolPermissionContext, v7)
                    })), Ym(v7), vA.refreshConfig()
                }
                i((v7) => ({
                    ...v7,
                    workerSandboxPermissions: {
                        ...v7.workerSandboxPermissions,
                        queue: v7.workerSandboxPermissions.queue.slice(1)
                    }
                }))
            }
        }), K2 === "elicitation" && b8.createElement(ZIq, {
            key: o.queue[0].serverName + ":" + String(o.queue[0].requestId),
            event: o.queue[0],
            onResponse: (P1, Y8) => {
                let V8 = o.queue[0];
                if (!V8) return;
                if (V8.respond({
                        action: P1,
                        content: Y8
                    }), !(V8.params.mode === "url" && P1 === "accept")) i((FA) => ({
                    ...FA,
                    elicitation: {
                        queue: FA.elicitation.queue.slice(1)
                    }
                }))
            },
            onWaitingDismiss: (P1) => {
                let Y8 = o.queue[0];
                i((V8) => ({
                    ...V8,
                    elicitation: {
                        queue: V8.elicitation.queue.slice(1)
                    }
                })), Y8?.onWaitingDismiss?.(P1)
            }
        }), K2 === "cost" && b8.createElement(jSq, {
            onDone: () => {
                GY(!1), TD(!0), d1((P1) => ({
                    ...P1,
                    hasAcknowledgedCostThreshold: !0
                })), d("tengu_cost_threshold_acknowledged", {})
            }
        }), K2 === "ide-onboarding" && b8.createElement(dj8, {
            onDone: () => n6(!1),
            installationStatus: K1
        }), !1, !1, K2 === "effort-callout" && b8.createElement(gmq, {
            model: w6,
            onDone: (P1) => {
                if (D1(!1), P1 !== "dismiss") i((Y8) => ({
                    ...Y8,
                    effortValue: P1
                }))
            }
        }), K2 === "remote-callout" && b8.createElement(pWq, {
            onDone: (P1) => {
                i((Y8) => {
                    if (!Y8.showRemoteCallout) return Y8;
                    return {
                        ...Y8,
                        showRemoteCallout: !1,
                        ...P1 === "enable" ? {
                            replBridgeEnabled: !0,
                            replBridgeExplicit: !0
                        } : {}
                    }
                })
            }
        }), na6, K2 === "lsp-recommendation" && e8 && b8.createElement(uBq, {
            pluginName: e8.pluginName,
            pluginDescription: e8.pluginDescription,
            fileExtension: e8.fileExtension,
            onResponse: n8
        }), K2 === "desktop-upsell" && b8.createElement(zyq, {
            onDone: () => K8(!1)
        }), !j8?.shouldHidePromptInput && !K2 && !lV6 && !Z && b8.createElement(b8.Fragment, null, Dx && b8.createElement(vgq, {
            onRun: E86,
            onCancel: sa6,
            reason: kgq(Dx)
        }), ti.state !== "closed" ? b8.createElement(Xb1, {
            state: ti.state,
            lastResponse: ti.lastResponse,
            handleSelect: ti.handleSelect,
            inputValue: m5,
            setInputValue: P5,
            onRequestFeedback: y86
        }) : b8.createElement(Xb1, {
            state: si.state,
            lastResponse: si.lastResponse,
            handleSelect: si.handleSelect,
            handleTranscriptSelect: si.handleTranscriptSelect,
            inputValue: m5,
            setInputValue: P5,
            onRequestFeedback: x26.current ? void 0 : y86
        }), aF.state !== "closed" && b8.createElement(Xb1, {
            state: aF.state,
            lastResponse: null,
            handleSelect: () => {},
            handleTranscriptSelect: aF.handleTranscriptSelect,
            inputValue: m5,
            setInputValue: P5
        }), !1, null, Mx && b8.createElement(ygq, null), b8.createElement(Juq, {
            debug: q,
            ideSelection: b6,
            hasSuppressedDialogs: !!Cb1,
            getToolUseContext: OW,
            toolPermissionContext: g,
            setToolPermissionContext: HT,
            apiKeyStatus: cV6,
            commands: qA,
            agents: Q.activeAgents,
            isLoading: Bq,
            onExit: aV6,
            verbose: B,
            messages: u7,
            onAutoUpdaterResult: f1,
            autoUpdaterResult: A1,
            input: m5,
            onInputChange: P5,
            mode: ZH,
            onModeChange: ZY,
            stashedPrompt: t9,
            setStashedPrompt: d8,
            submitCount: Xj,
            onShowMessageSelector: sV6,
            onQuickRestoreLastInterrupted: eZ,
            mcpClients: V6,
            pastedContents: p3,
            setPastedContents: R2,
            vimMode: sZ,
            setVimMode: rF,
            showBashesDialog: oF,
            setShowBashesDialog: Jx,
            tasksSelected: ri,
            setTasksSelected: y1,
            bridgeSelected: WA,
            setBridgeSelected: _4,
            onSubmit: tN,
            onAgentSubmit: aa6,
            isSearchingHistory: H4,
            setIsSearchingHistory: t5,
            helpOpen: fH,
            setHelpOpen: TH,
            insertTextRef: Dj,
            voiceInterimRange: Xx.interimRange
        }), b8.createElement(xmq, {
            onBackgroundSession: sN,
            isLoading: Bq
        })), K2 === "message-selector" && b8.createElement(zs8, {
            messages: u7,
            onPreRestore: TM,
            onRestoreCode: async (P1) => {
                await sN1((Y8) => {
                    i((V8) => ({
                        ...V8,
                        fileHistory: Y8(V8.fileHistory)
                    }))
                }, P1.uuid)
            },
            onSummarize: async (P1, Y8) => {
                let V8 = u7.indexOf(P1);
                if (V8 === -1) return;
                let c7 = sK(),
                    FA = OW(u7, [], c7, w6),
                    v7 = FA.getAppState(),
                    N7 = await R0(FA.options.tools, FA.options.mainLoopModel, Array.from(v7.toolPermissionContext.additionalWorkingDirectories.keys()), FA.options.mcpClients),
                    cA = cg({
                        mainThreadAgentDefinition: void 0,
                        toolUseContext: FA,
                        customSystemPrompt: FA.options.customSystemPrompt,
                        defaultSystemPrompt: N7,
                        appendSystemPrompt: FA.options.appendSystemPrompt
                    }),
                    [l4, nK] = await Promise.all([a2(), mw()]),
                    fY = await Wqq(u7, V8, FA, {
                        systemPrompt: cA,
                        userContext: l4,
                        systemContext: nK,
                        toolUseContext: FA,
                        forkContextMessages: u7
                    }, Y8),
                    y$ = [fY.boundaryMarker, ...fY.messagesToKeep ?? [], ...fY.summaryMessages, ...fY.attachments, ...fY.hookResults];
                if (xgq()) gq((ND) => [...ND.slice(0, V8), ...y$]);
                else gq(y$);
                S2(S26());
                let B9 = Fg(P1);
                if (B9 !== null) {
                    let ND = d4(B9, "bash-input"),
                        HW = d4(B9, XP);
                    if (ND) P5(ND), ZY("bash");
                    else if (HW) {
                        let jJ = d4(B9, "command-args") || "";
                        P5(`${HW} ${jJ}`), ZY("prompt")
                    } else P5(Yr(B9)), ZY("prompt")
                }
                let e9 = PX("app:toggleTranscript", "Global", "ctrl+o");
                o6({
                    key: "summarize-ctrl-o-hint",
                    text: `Conversation summarized (${e9} for history)`,
                    priority: "medium",
                    timeoutMs: 8000
                })
            },
            onRestoreMessage: tV6,
            onClose: () => Hq(!1)
        }), !1)
    })))
}
// @from(Ln 509916, Col 0)
function ggq(A) {
    return !A && (t6(process.env.CLAUDE_CODE_STREAMING_TEXT) || w8("tengu_streaming_text", !1))
}
// @from(Ln 509919, Col 4)
b8
// @from(Ln 509919, Col 8)
N8
// @from(Ln 509919, Col 12)
Rvz
// @from(Ln 509919, Col 17)
bgq
// @from(Ln 509919, Col 22)
hvz = () => {}
// @from(Ln 509920, Col 4)
Svz = () => ({
        state: "closed",
        handleTranscriptSelect: () => {}
    })
// @from(Ln 509924, Col 4)
Cvz = () => ({})
// @from(Ln 509925, Col 4)
Nb1 = null
// @from(Ln 509926, Col 4)
Ivz
// @from(Ln 509926, Col 9)
bvz = ({
        scrollable: A,
        bottom: q,
        overlay: K
    }) => b8.createElement(b8.Fragment, null, A, q, K)
// @from(Ln 509931, Col 4)
xgq = () => !1
// @from(Ln 509932, Col 4)
xvz
// @from(Ln 509932, Col 9)
uvz = () => xvz
// @from(Ln 509933, Col 4)
mvz = () => 0
// @from(Ln 509934, Col 4)
rt8
// @from(Ln 509934, Col 9)
Bgq
// @from(Ln 509934, Col 14)
ugq = "✳"
// @from(Ln 509935, Col 4)
gvz = 960
// @from(Ln 509936, Col 4)
at8 = E(() => {
    e6();
    T1();
    tE1();
    i6();
    JSq();
    wz();
    DU6();
    ZSq();
    Hs();
    tP();
    T1();
    H1();
    E$6();
    A8();
    M4();
    bu6();
    vf();
    Sf6();
    qH();
    sk();
    bf6();
    zz();
    TSq();
    sk();
    Ae();
    NSq();
    hSq();
    zI1();
    ISq();
    jIq();
    GIq();
    TIq();
    Muq();
    Lt8();
    Xuq();
    Zuq();
    fuq();
    vuq();
    Vuq();
    LO();
    zL8();
    jE();
    pc6();
    bv();
    lM();
    Ua8();
    $k();
    yuq();
    ks8();
    huq();
    Cuq();
    ZI();
    buq();
    uuq();
    muq();
    Mg();
    Rj();
    ld();
    guq();
    puq();
    cuq();
    nuq();
    s8();
    zmq();
    F$();
    Us8();
    rJ();
    bi6();
    JZ();
    k8();
    V1();
    JA();
    oN8();
    HA();
    vz();
    c_();
    wmq();
    Jmq();
    Dmq();
    qv6();
    oY6();
    Wmq();
    dx8();
    Il8();
    sR1();
    Gmq();
    Tmq();
    pt8();
    en6();
    dy8();
    Nmq();
    EZ1();
    SF6();
    y66();
    kmq();
    IX();
    cW6();
    mY6();
    NA();
    rH();
    Oq();
    if6();
    fi6();
    eR();
    ZR();
    _l();
    JN();
    xd();
    Oq();
    io6();
    Lmq();
    Qz();
    hmq();
    Sw();
    Imq();
    rl8();
    il8();
    jN();
    aH();
    bV6();
    umq();
    Fc6();
    Bmq();
    iY6();
    sY6();
    cj8();
    pmq();
    Ni8();
    Qy8();
    U$();
    f16();
    nmq();
    omq();
    tmq();
    qBq();
    YBq();
    _Bq();
    OBq();
    jBq();
    ab8();
    Lz();
    tC1();
    MBq();
    DBq();
    PBq();
    MU8();
    GBq();
    TBq();
    uC1();
    NBq();
    bBq();
    mBq();
    ha8();
    FBq();
    QBq();
    lBq();
    YN1();
    nBq();
    oBq();
    sBq();
    eBq();
    qgq();
    zgq();
    Ogq();
    jgq();
    Pgq();
    Tgq();
    Egq();
    Rgq();
    hgq();
    D$();
    b8 = t(P6(), 1), N8 = t(P6(), 1), Rvz = (nt8(), k4(it8)).useVoiceIntegration, bgq = (nt8(), k4(it8)).VoiceKeybindingHandler, Ivz = (Igq(), k4(Cgq)).useScheduledTasks, xvz = {
        dividerIndex: null,
        pillVisible: !1,
        onScroll: () => {},
        jumpToNew: () => {}
    }, rt8 = [];
    Bgq = ["⠂", "⠐"]
})
// @from(Ln 510117, Col 0)
function Qgq({
    onSelect: A,
    onCancel: q,
    isEmbedded: K = !1
}) {
    let {
        rows: Y
    } = KA(), [z, _] = qK.useState([]), [w, O] = qK.useState(null), [$, H] = qK.useState(!0), [j, J] = qK.useState(null), [M, D] = qK.useState(!1), [X, P] = qK.useState(!1), [W, Z] = qK.useState(1), G = Rq("confirm:no", "Confirmation", "Esc"), f = qK.useCallback(async () => {
        try {
            H(!0), J(null);
            let B = await cQ();
            O(B), k(`Current repository: ${B||"not detected"}`);
            let b = await tb8(),
                p = b;
            if (B) p = b.filter((U) => {
                if (!U.repo) return !1;
                return `${U.repo.owner.login}/${U.repo.name}` === B
            }), k(`Filtered ${p.length} sessions for repo ${B} from ${b.length} total`);
            let Q = [...p].sort((U, r) => {
                let e = new Date(U.updated_at);
                return new Date(r.updated_at).getTime() - e.getTime()
            });
            _(Q)
        } catch (B) {
            let b = B instanceof Error ? B.message : String(B);
            k(`Error loading code sessions: ${b}`), J(Uvz(b))
        } finally {
            H(!1), D(!1)
        }
    }, []), v = () => {
        D(!0), f()
    };
    D8("confirm:no", q, {
        context: "Confirmation"
    }), jA((B, b) => {
        if (b.ctrl && B === "c") {
            q();
            return
        }
        if (b.ctrl && B === "r" && j) {
            v();
            return
        }
        if (j !== null && b.return) {
            q();
            return
        }
    });
    let N = qK.useCallback(() => {
        P(!0), f()
    }, [P, f]);
    if (!X) return qK.default.createElement(OV1, {
        onComplete: N
    });
    if ($) return qK.default.createElement(m, {
        flexDirection: "column",
        padding: 1
    }, qK.default.createElement(m, {
        flexDirection: "row"
    }, qK.default.createElement(Wq, null), qK.default.createElement(T, {
        bold: !0
    }, "Loading Claude Code sessions…")), qK.default.createElement(T, {
        dimColor: !0
    }, M ? "Retrying…" : "Fetching your Claude Code sessions…"));
    if (j) return qK.default.createElement(m, {
        flexDirection: "column",
        padding: 1
    }, qK.default.createElement(T, {
        bold: !0,
        color: "error"
    }, "Error loading Claude Code sessions"), dvz(j), qK.default.createElement(T, {
        dimColor: !0
    }, "Press ", qK.default.createElement(T, {
        bold: !0
    }, "Ctrl+R"), " to retry · Press", " ", qK.default.createElement(T, {
        bold: !0
    }, G), " to cancel"));
    if (z.length === 0) return qK.default.createElement(m, {
        flexDirection: "column",
        padding: 1
    }, qK.default.createElement(T, {
        bold: !0
    }, "No Claude Code sessions found", w && qK.default.createElement(T, null, " for ", w)), qK.default.createElement(m, {
        marginTop: 1
    }, qK.default.createElement(T, {
        dimColor: !0
    }, "Press ", qK.default.createElement(T, {
        bold: !0
    }, G), " to cancel")));
    let V = z.map((B) => ({
            ...B,
            timeString: A91(new Date(B.updated_at))
        })),
        L = Math.max(pgq.length, ...V.map((B) => B.timeString.length)),
        h = V.map(({
            timeString: B,
            title: b,
            id: p
        }) => {
            return {
                label: `${B.padEnd(L," ")}  ${b}`,
                value: p
            }
        }),
        R = 7,
        u = Math.max(1, K ? Math.min(z.length, 5, Y - 6 - R) : Math.min(z.length, Y - 1 - R)),
        I = u + R,
        g = z.length > u;
    return qK.default.createElement(m, {
        flexDirection: "column",
        padding: 1,
        height: I
    }, qK.default.createElement(T, {
        bold: !0
    }, "Select a session to resume", g && qK.default.createElement(T, {
        dimColor: !0
    }, " ", "(", W, " of ", z.length, ")"), w && qK.default.createElement(T, {
        dimColor: !0
    }, " (", w, ")"), ":"), qK.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1,
        flexGrow: 1
    }, qK.default.createElement(m, {
        marginLeft: 2
    }, qK.default.createElement(T, {
        bold: !0
    }, pgq.padEnd(L, " "), Qvz, "Session Title")), qK.default.createElement(T8, {
        visibleOptionCount: u,
        options: h,
        onChange: (B) => {
            let b = z.find((p) => p.id === B);
            if (b) A(b)
        },
        onFocus: (B) => {
            let b = h.findIndex((p) => p.value === B);
            if (b >= 0) Z(b + 1)
        }
    })), qK.default.createElement(m, {
        flexDirection: "row"
    }, qK.default.createElement(T, {
        dimColor: !0
    }, qK.default.createElement(C8, null, qK.default.createElement(a1, {
        shortcut: "↑/↓",
        action: "select"
    }), qK.default.createElement(a1, {
        shortcut: "Enter",
        action: "confirm"
    }), qK.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))))
}
// @from(Ln 510272, Col 0)
function Uvz(A) {
    let q = A.toLowerCase();
    if (q.includes("fetch") || q.includes("network") || q.includes("timeout")) return "network";
    if (q.includes("auth") || q.includes("token") || q.includes("permission") || q.includes("oauth") || q.includes("not authenticated") || q.includes("/login") || q.includes("console account") || q.includes("403")) return "auth";
    if (q.includes("api") || q.includes("rate limit") || q.includes("500") || q.includes("529")) return "api";
    return "other"
}
// @from(Ln 510280, Col 0)
function dvz(A) {
    switch (A) {
        case "network":
            return qK.default.createElement(m, {
                marginY: 1,
                flexDirection: "column"
            }, qK.default.createElement(T, {
                dimColor: !0
            }, "Check your internet connection"));
        case "auth":
            return qK.default.createElement(m, {
                marginY: 1,
                flexDirection: "column"
            }, qK.default.createElement(T, {
                dimColor: !0
            }, "Teleport requires a Claude account"), qK.default.createElement(T, {
                dimColor: !0
            }, "Run ", qK.default.createElement(T, {
                bold: !0
            }, "/login"), ' and select "Claude account with subscription"'));
        case "api":
            return qK.default.createElement(m, {
                marginY: 1,
                flexDirection: "column"
            }, qK.default.createElement(T, {
                dimColor: !0
            }, "Sorry, Claude encountered an error"));
        case "other":
            return qK.default.createElement(m, {
                marginY: 1,
                flexDirection: "row"
            }, qK.default.createElement(T, {
                dimColor: !0
            }, "Sorry, Claude Code encountered an error"))
    }
}
// @from(Ln 510316, Col 4)
qK
// @from(Ln 510316, Col 8)
pgq = "Updated"
// @from(Ln 510317, Col 4)
Qvz = "  "
// @from(Ln 510318, Col 4)
Ugq = E(() => {
    i6();
    _7();
    o9();
    LO();
    _q();
    H1();
    au8();
    M4();
    yG();
    EZ();
    Lq();
    OK();
    Rj();
    Xq();
    qK = t(P6(), 1)
})
// @from(Ln 510336, Col 0)
function dgq(A) {
    let q = A6(8),
        [K, Y] = Vb1.useState(!1),
        [z, _] = Vb1.useState(null),
        [w, O] = Vb1.useState(null),
        $;
    if (q[0] !== A) $ = async (D) => {
        Y(!0), _(null), O(D), d("tengu_teleport_resume_session", {
            source: A,
            session_id: D.id
        });
        try {
            let X = await Oz6(D.id);
            return ok6({
                sessionId: D.id
            }), Y(!1), X
        } catch (X) {
            let P = X,
                W = {
                    message: P instanceof yM ? P.message : _1(P),
                    formattedMessage: P instanceof yM ? P.formattedMessage : void 0,
                    isOperationError: P instanceof yM
                };
            return _(W), Y(!1), null
        }
    }, q[0] = A, q[1] = $;
    else $ = q[1];
    let H = $,
        j;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) j = () => {
        _(null)
    }, q[2] = j;
    else j = q[2];
    let J = j,
        M;
    if (q[3] !== z || q[4] !== K || q[5] !== H || q[6] !== w) M = {
        resumeSession: H,
        isResuming: K,
        error: z,
        selectedSession: w,
        clearError: J
    }, q[3] = z, q[4] = K, q[5] = H, q[6] = w, q[7] = M;
    else M = q[7];
    return M
}
// @from(Ln 510381, Col 4)
Vb1
// @from(Ln 510382, Col 4)
cgq = E(() => {
    e6();
    S66();
    s8();
    V1();
    T1();
    Vb1 = t(P6(), 1)
})
// @from(Ln 510390, Col 4)
igq = {}
// @from(Ln 510395, Col 0)
function cvz(A) {
    let q = A6(25),
        {
            onComplete: K,
            onCancel: Y,
            onError: z,
            isEmbedded: _,
            source: w
        } = A,
        O = _ === void 0 ? !1 : _,
        {
            resumeSession: $,
            isResuming: H,
            error: j,
            selectedSession: J
        } = dgq(w),
        M, D;
    if (q[0] !== w) M = () => {
        d("tengu_teleport_started", {
            source: w
        })
    }, D = [w], q[0] = w, q[1] = M, q[2] = D;
    else M = q[1], D = q[2];
    lgq.useEffect(M, D);
    let X;
    if (q[3] !== j || q[4] !== K || q[5] !== z || q[6] !== $) X = async (N) => {
        let V = await $(N);
        if (V) K(V);
        else if (j) {
            if (z) z(j.message, j.formattedMessage)
        }
    }, q[3] = j, q[4] = K, q[5] = z, q[6] = $, q[7] = X;
    else X = q[7];
    let P = X,
        W;
    if (q[8] !== Y) W = () => {
        d("tengu_teleport_cancelled", {}), Y()
    }, q[8] = Y, q[9] = W;
    else W = q[9];
    let Z = W,
        G = !!j && !z,
        f;
    if (q[10] !== G) f = {
        context: "Global",
        isActive: G
    }, q[10] = G, q[11] = f;
    else f = q[11];
    if (D8("app:interrupt", Z, f), H && J) {
        let N;
        if (q[12] === Symbol.for("react.memo_cache_sentinel")) N = QE.default.createElement(m, {
            flexDirection: "row"
        }, QE.default.createElement(Wq, null), QE.default.createElement(T, {
            bold: !0
        }, "Resuming session…")), q[12] = N;
        else N = q[12];
        let V;
        if (q[13] !== J.title) V = QE.default.createElement(m, {
            flexDirection: "column",
            padding: 1
        }, N, QE.default.createElement(T, {
            dimColor: !0
        }, 'Loading "', J.title, '"…')), q[13] = J.title, q[14] = V;
        else V = q[14];
        return V
    }
    if (j && !z) {
        let N;
        if (q[15] === Symbol.for("react.memo_cache_sentinel")) N = QE.default.createElement(T, {
            bold: !0,
            color: "error"
        }, "Failed to resume session"), q[15] = N;
        else N = q[15];
        let V;
        if (q[16] !== j.message) V = QE.default.createElement(T, {
            dimColor: !0
        }, j.message), q[16] = j.message, q[17] = V;
        else V = q[17];
        let L;
        if (q[18] === Symbol.for("react.memo_cache_sentinel")) L = QE.default.createElement(m, {
            marginTop: 1
        }, QE.default.createElement(T, {
            dimColor: !0
        }, "Press ", QE.default.createElement(T, {
            bold: !0
        }, "Esc"), " to cancel")), q[18] = L;
        else L = q[18];
        let h;
        if (q[19] !== V) h = QE.default.createElement(m, {
            flexDirection: "column",
            padding: 1
        }, N, V, L), q[19] = V, q[20] = h;
        else h = q[20];
        return h
    }
    let v;
    if (q[21] !== Z || q[22] !== P || q[23] !== O) v = QE.default.createElement(Qgq, {
        onSelect: P,
        onCancel: Z,
        isEmbedded: O
    }), q[21] = Z, q[22] = P, q[23] = O, q[24] = v;
    else v = q[24];
    return v
}
// @from(Ln 510498, Col 4)
QE
// @from(Ln 510498, Col 8)
lgq
// @from(Ln 510499, Col 4)
ngq = E(() => {
    e6();
    i6();
    _7();
    Ugq();
    LO();
    cgq();
    V1();
    QE = t(P6(), 1), lgq = t(P6(), 1)
})
// @from(Ln 510509, Col 4)
rgq = {}
// @from(Ln 510514, Col 0)
function lvz(A) {
    let q = A6(18),
        {
            targetRepo: K,
            initialPaths: Y,
            onSelectPath: z,
            onCancel: _
        } = A,
        [w, O] = kb1.useState(Y),
        [$, H] = kb1.useState(null),
        [j, J] = kb1.useState(!1),
        M;
    if (q[0] !== w || q[1] !== _ || q[2] !== z || q[3] !== K) M = async (G) => {
        if (G === "cancel") {
            _();
            return
        }
        if (J(!0), H(null), await qEq(G, K)) {
            z(G);
            return
        }
        KEq(K, G);
        let v = w.filter((N) => N !== G);
        O(v), J(!1), H(`${$K(G)} no longer contains the correct repository. Select another path.`)
    }, q[0] = w, q[1] = _, q[2] = z, q[3] = K, q[4] = M;
    else M = q[4];
    let D = M,
        X;
    if (q[5] !== w) {
        let G;
        if (q[7] === Symbol.for("react.memo_cache_sentinel")) G = {
            label: "Cancel",
            value: "cancel"
        }, q[7] = G;
        else G = q[7];
        X = [...w.map(ivz), G], q[5] = w, q[6] = X
    } else X = q[6];
    let P = X,
        W;
    if (q[8] !== w.length || q[9] !== $ || q[10] !== D || q[11] !== P || q[12] !== K || q[13] !== j) W = w.length > 0 ? YW.default.createElement(YW.default.Fragment, null, YW.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, $ && YW.default.createElement(T, {
        color: "error"
    }, $), YW.default.createElement(T, null, "Open Claude Code in ", YW.default.createElement(T, {
        bold: !0
    }, K), ":")), j ? YW.default.createElement(m, null, YW.default.createElement(Wq, null), YW.default.createElement(T, null, " Validating repository…")) : YW.default.createElement(T8, {
        options: P,
        onChange: (G) => void D(G)
    })) : YW.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, $ && YW.default.createElement(T, {
        color: "error"
    }, $), YW.default.createElement(T, {
        dimColor: !0
    }, "Run claude --teleport from a checkout of ", K)), q[8] = w.length, q[9] = $, q[10] = D, q[11] = P, q[12] = K, q[13] = j, q[14] = W;
    else W = q[14];
    let Z;
    if (q[15] !== _ || q[16] !== W) Z = YW.default.createElement(m8, {
        title: "Teleport to Repo",
        onCancel: _,
        color: "background"
    }, W), q[15] = _, q[16] = W, q[17] = Z;
    else Z = q[17];
    return Z
}
// @from(Ln 510582, Col 0)
function ivz(A) {
    return {
        label: YW.default.createElement(T, null, "Use ", YW.default.createElement(T, {
            bold: !0
        }, $K(A))),
        value: A
    }
}
// @from(Ln 510590, Col 4)
YW
// @from(Ln 510590, Col 8)
kb1
// @from(Ln 510591, Col 4)
ogq = E(() => {
    e6();
    i6();
    wq();
    o9();
    LO();
    Z7();
    RC1();
    YW = t(P6(), 1), kb1 = t(P6(), 1)
})
// @from(Ln 510601, Col 4)
egq = {}
// @from(Ln 510607, Col 0)
function tgq(A) {
    let q = A6(16),
        {
            currentStep: K,
            sessionId: Y
        } = A,
        [z, _] = gJ(100),
        w = Math.floor(_ / 100) % st8.length,
        O;
    if (q[0] !== K) O = (P) => P.key === K, q[0] = K, q[1] = O;
    else O = q[1];
    let $ = agq.findIndex(O),
        H = st8[w],
        j;
    if (q[2] !== H) j = Zw.createElement(m, {
        marginBottom: 1
    }, Zw.createElement(T, {
        bold: !0,
        color: "claude"
    }, H, " Teleporting session…")), q[2] = H, q[3] = j;
    else j = q[3];
    let J;
    if (q[4] !== Y) J = Y && Zw.createElement(m, {
        marginBottom: 1
    }, Zw.createElement(T, {
        dimColor: !0
    }, Y)), q[4] = Y, q[5] = J;
    else J = q[5];
    let M;
    if (q[6] !== $ || q[7] !== w) M = agq.map((P, W) => {
        let Z = W < $,
            G = W === $,
            f = W > $,
            v, N;
        if (Z) v = a6.tick, N = "green";
        else if (G) v = st8[w], N = "claude";
        else v = a6.circle, N = void 0;
        return Zw.createElement(m, {
            key: P.key,
            flexDirection: "row"
        }, Zw.createElement(m, {
            width: 2
        }, Zw.createElement(T, {
            color: N,
            dimColor: f
        }, v)), Zw.createElement(T, {
            dimColor: f,
            bold: G
        }, P.label))
    }), q[6] = $, q[7] = w, q[8] = M;
    else M = q[8];
    let D;
    if (q[9] !== M) D = Zw.createElement(m, {
        flexDirection: "column",
        marginLeft: 2
    }, M), q[9] = M, q[10] = D;
    else D = q[10];
    let X;
    if (q[11] !== z || q[12] !== j || q[13] !== J || q[14] !== D) X = Zw.createElement(m, {
        ref: z,
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1
    }, j, J, D), q[11] = z, q[12] = j, q[13] = J, q[14] = D, q[15] = X;
    else X = q[15];
    return X
}
// @from(Ln 510674, Col 0)
async function nvz(A, q) {
    let K = () => {};

    function Y() {
        let [O, $] = sgq.useState("validating");
        return K = $, Zw.createElement(tgq, {
            currentStep: O,
            sessionId: q
        })
    }
    A.render(Zw.createElement(Yj, null, Zw.createElement(Y, null)));
    let z = await Oz6(q, K);
    K("checking_out");
    let {
        branchName: _,
        branchError: w
    } = await Ml6(z.branch);
    return {
        messages: Jl6(z.log, w),
        branchName: _
    }
}
// @from(Ln 510696, Col 4)
Zw
// @from(Ln 510696, Col 8)
sgq
// @from(Ln 510696, Col 13)
st8
// @from(Ln 510696, Col 18)
agq
// @from(Ln 510697, Col 4)
AFq = E(() => {
    e6();
    i6();
    b7();
    NA();
    S66();
    Zw = t(P6(), 1), sgq = t(P6(), 1), st8 = ["◐", "◓", "◑", "◒"], agq = [{
        key: "validating",
        label: "Validating session"
    }, {
        key: "fetching_logs",
        label: "Fetching session logs"
    }, {
        key: "fetching_branch",
        label: "Getting branch info"
    }, {
        key: "checking_out",
        label: "Checking out branch"
    }]
})
// @from(Ln 510717, Col 4)
KFq = {}
// @from(Ln 510725, Col 0)
function ovz(A) {
    let q = parseInt(A, 10);
    if (!isNaN(q) && q > 0) return q;
    let K = A.match(/github\.com\/[^/]+\/[^/]+\/pull\/(\d+)/);
    if (K?.[1]) return parseInt(K[1], 10);
    return null
}
// @from(Ln 510733, Col 0)
function avz({
    commands: A,
    worktreePaths: q,
    initialTools: K,
    mcpClients: Y,
    dynamicMcpConfig: z,
    debug: _,
    mainThreadAgentDefinition: w,
    autoConnectIdeFlag: O,
    strictMcpConfig: $ = !1,
    systemPrompt: H,
    appendSystemPrompt: j,
    initialSearchQuery: J,
    disableSlashCommands: M = !1,
    forkSession: D,
    taskListId: X,
    filterByPr: P,
    thinkingConfig: W,
    onTurnComplete: Z
}) {
    let {
        rows: G
    } = KA(), f = M1((X6) => X6.agentDefinitions), v = xA(), [N, V] = Mz.default.useState([]), [L, h] = Mz.default.useState(!0), [R, u] = Mz.default.useState(!1), [I, g] = Mz.default.useState(!1), [B, b] = Mz.default.useState(null), [p, Q] = Mz.default.useState(null), U = Mz.default.useRef(null), r = Mz.default.useMemo(() => {
        let X6 = N.filter((z6) => !z6.isSidechain);
        if (P !== void 0) {
            if (P === !0) X6 = X6.filter((z6) => z6.prNumber !== void 0);
            else if (typeof P === "number") X6 = X6.filter((z6) => z6.prNumber === P);
            else if (typeof P === "string") {
                let z6 = ovz(P);
                if (z6 !== null) X6 = X6.filter((N6) => N6.prNumber === z6)
            }
        }
        return X6
    }, [N, P]), e = Ki();
    Mz.default.useEffect(() => {
        Jz6(), Ko6(q).then((X6) => {
            U.current = X6, V(X6.logs), h(!1)
        }).catch((X6) => {
            _6(X6), h(!1)
        })
    }, [q]);
    let Y6 = Mz.default.useCallback((X6) => {
            let z6 = U.current;
            if (!z6 || z6.nextIndex >= z6.allStatLogs.length) return;
            m_6(z6.allStatLogs, z6.nextIndex, X6).then((N6) => {
                if (z6.nextIndex = N6.nextIndex, N6.logs.length > 0) V(($6) => {
                    return [...$6, ...N6.logs].map((o, a) => ({
                        ...o,
                        value: a
                    }))
                });
                else if (z6.nextIndex < z6.allStatLogs.length) Y6(X6)
            })
        }, []),
        H6 = Mz.default.useCallback((X6) => {
            h(!0), (X6 ? jS1() : Ko6(q)).then((N6) => {
                U.current = N6, V(N6.logs)
            }).catch((N6) => {
                _6(N6)
            }).finally(() => {
                h(!1)
            })
        }, [q]),
        J6 = Mz.default.useCallback(() => {
            let X6 = !I;
            g(X6), H6(X6)
        }, [I, H6]);

    function K6() {
        process.exit(1)
    }
    async function s(X6) {
        u(!0);
        let z6 = performance.now(),
            N6 = vR1(X6, I, q);
        if (N6.isCrossProject) {
            if (!N6.isSameRepoWorktree) {
                await ZZ(N6.command), Q(N6.command);
                return
            }
        }
        try {
            let $6 = await h66(X6, void 0);
            if (!$6) throw Error("Failed to load conversation");
            if ($6.sessionId && !D) _P(eJ($6.sessionId), X6.fullPath ? rvz(X6.fullPath) : null), await Qo6(), await Zh(), r21($6.sessionId);
            else if (D && $6.contentReplacements?.length) await pz6($6.contentReplacements);
            let {
                agentDefinition: n
            } = K26($6.agentSetting, w, f);
            v((a) => ({
                ...a,
                agent: n?.agentType
            }));
            let o = lo6($6.agentName, $6.agentColor);
            if (o) v((a) => ({
                ...a,
                standaloneAgentContext: o
            }));
            LF($6), d("tengu_session_resumed", {
                entrypoint: "picker",
                success: !0,
                resume_duration_ms: Math.round(performance.now() - z6)
            }), V([]), b({
                messages: $6.messages,
                fileHistorySnapshots: $6.fileHistorySnapshots,
                contentReplacements: $6.contentReplacements,
                agentName: $6.agentName,
                agentColor: $6.agentColor === "default" ? void 0 : $6.agentColor,
                mainThreadAgentDefinition: n
            })
        } catch ($6) {
            throw d("tengu_session_resumed", {
                entrypoint: "picker",
                success: !1
            }), _6($6), $6
        }
    }
    if (p) return Mz.default.createElement(evz, {
        command: p
    });
    if (B) return Mz.default.createElement(ot8, {
        debug: _,
        commands: A,
        initialTools: K,
        initialMessages: B.messages,
        initialFileHistorySnapshots: B.fileHistorySnapshots,
        initialContentReplacements: B.contentReplacements,
        initialAgentName: B.agentName,
        initialAgentColor: B.agentColor,
        mcpClients: Y,
        dynamicMcpConfig: z,
        strictMcpConfig: $,
        systemPrompt: H,
        appendSystemPrompt: j,
        mainThreadAgentDefinition: B.mainThreadAgentDefinition,
        autoConnectIdeFlag: O,
        disableSlashCommands: M,
        taskListId: X,
        thinkingConfig: W,
        onTurnComplete: Z
    });
    if (L) return Mz.default.createElement(m, null, Mz.default.createElement(Wq, null), Mz.default.createElement(T, null, " Loading conversations…"));
    if (R) return Mz.default.createElement(m, null, Mz.default.createElement(Wq, null), Mz.default.createElement(T, null, " Resuming conversation…"));
    if (r.length === 0) return Mz.default.createElement(svz, null);
    return Mz.default.createElement(TR1, {
        logs: r,
        maxHeight: G,
        onCancel: K6,
        onSelect: s,
        onLogsChanged: e ? () => H6(I) : void 0,
        onLoadMore: Y6,
        initialSearchQuery: J,
        showAllProjects: I,
        onToggleAllProjects: J6,
        onAgenticSearch: NR1
    })
}
// @from(Ln 510891, Col 0)
function svz() {
    let A = A6(2),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = {
        context: "Global"
    }, A[0] = q;
    else q = A[0];
    D8("app:interrupt", tvz, q);
    let K;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) K = Mz.default.createElement(m, {
        flexDirection: "column"
    }, Mz.default.createElement(T, null, "No conversations found to resume."), Mz.default.createElement(T, {
        dimColor: !0
    }, "Press Ctrl+C to exit and start a new conversation.")), A[1] = K;
    else K = A[1];
    return K
}
// @from(Ln 510909, Col 0)
function tvz() {
    process.exit(1)
}