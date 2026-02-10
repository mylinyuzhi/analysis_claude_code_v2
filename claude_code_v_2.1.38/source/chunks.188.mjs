
// @from(Ln 487131, Col 0)
function TUA({
    commands: A,
    debug: q,
    initialTools: K,
    initialMessages: Y,
    initialFileHistorySnapshots: z,
    initialAgentName: w,
    initialAgentColor: H,
    mcpClients: $,
    dynamicMcpConfig: O,
    mcpCliEndpoint: _,
    autoConnectIdeFlag: J,
    strictMcpConfig: X = !1,
    systemPrompt: D,
    appendSystemPrompt: j,
    onBeforeQuery: M,
    onTurnComplete: P,
    disabled: W = !1,
    mainThreadAgentDefinition: G,
    disableSlashCommands: f = !1,
    taskListId: Z,
    remoteSessionConfig: N,
    directConnectConfig: T
}) {
    dA.useEffect(() => {
        return h(`[REPL:mount] REPL mounted, disabled=${W}`), rL7(), () => h("[REPL:unmount] REPL unmounting")
    }, [W]);
    let [k, y] = dA.useState(G), B = v6((k6) => k6.toolPermissionContext), S = v6((k6) => k6.verbose), m = v6((k6) => k6.mcp), b = v6((k6) => k6.plugins), g = v6((k6) => k6.agentDefinitions), U = v6((k6) => k6.fileHistory), x = v6((k6) => k6.todos), p = v6((k6) => k6.thinkingEnabled), l = v6((k6) => k6.initialMessage), r = v6((k6) => k6.queuedCommands), s = void 0, O1 = !1, T1 = void 0, N1 = v6((k6) => k6.spinnerTip), j1 = v6((k6) => k6.expandedView) === "tasks", q1 = v6((k6) => k6.pendingWorkerRequest), t = v6((k6) => k6.pendingSandboxRequest), J1 = v6((k6) => k6.teamContext), D1 = v6((k6) => k6.tasks), Z1 = v6((k6) => k6.workerSandboxPermissions), E1 = v6((k6) => k6.elicitation), a = v6((k6) => k6.viewingAgentTaskId), A1 = L7(), M1 = B_(), z1 = YB(), Y1 = is(), [_1, $1] = dA.useState(A);
    PVq(ZO(), $1);
    let [G1, L1] = dA.useState(uE6?.isProactiveActive() ?? !1);
    dA.useEffect(() => {
        if (!uE6) return;
        return uE6.subscribeToProactiveChanges(() => {
            L1(uE6.isProactiveActive())
        })
    }, []);
    let x1 = dA.useMemo(() => tD(B), [B, G1]);
    KNq();
    let [f1, R1] = dA.useState(O), H1 = dA.useCallback((k6) => {
        R1(k6)
    }, [R1]), [y1, B1] = dA.useState("prompt"), [A6, O6] = dA.useState(1), [P6, V6] = dA.useState(!1), {
        addNotification: q6
    } = iq(), p1 = XVq($, m.clients), [K6, j6] = dA.useState(void 0), [M6, N6] = dA.useState(null), [F6, P1] = dA.useState(null), [k1, o1] = dA.useState(!1), [_6, z6] = dA.useState(() => {
        return !1
    });
    iLq(), oLq(), tLq(), dLq({
        ideSelection: K6,
        mcpClients: p1,
        ideInstallationStatus: F6
    }), _Lq({
        mcpClients: p1
    }), yLq(), SLq(), WV6(), bLq(Y1), ORq(), BLq(), mLq(Y1), QLq(), ULq(), cVq(), iVq(), rVq(), XLq(), YRq();
    let {
        recommendation: w6,
        handleResponse: r6
    } = TLq();
    ELq();
    let G6 = dA.useMemo(() => {
        return [...x1, ...K]
    }, [x1, K]);
    GE6();
    let L6 = VP1();
    dA.useEffect(() => {
        ILq(A1)
    }, [A1]), aVq(p1, B.mode), Qfq(A1, Y);
    let OA = mN6(G6, m.tools, B),
        {
            tools: bA,
            allowedAgentTypes: lA
        } = dA.useMemo(() => {
            if (!k) return {
                tools: OA,
                allowedAgentTypes: void 0
            };
            let k6 = qs(k, OA, !1);
            return {
                tools: k6.resolvedTools,
                allowedAgentTypes: k6.allowedAgentTypes
            }
        }, [k, OA]),
        E7 = sgA(_1, b.commands),
        V4 = sgA(E7, m.commands),
        RA = dA.useMemo(() => f ? [] : V4, [f, V4]);
    zPq(m.clients), fVq(m.clients, j6);
    let [O7, tK] = dA.useState("responding"), [gq, xq] = dA.useState([]), [U8, R4] = dA.useState(null);
    dA.useEffect(() => {
        if (U8 && !U8.isStreaming && U8.streamingEndedAt) {
            let q8 = 30000 - (Date.now() - U8.streamingEndedAt);
            if (q8 > 0) {
                let FA = setTimeout(() => {
                    R4(null)
                }, q8);
                return () => clearTimeout(FA)
            } else R4(null)
        }
    }, [U8]);
    let [O3, HY] = dA.useState(null), [_4, Az] = dA.useState(N?.hasInitialPrompt ?? !1), [Wz, ZY] = dA.useState(void 0), $Y = dA.useRef(0), OY = dA.useRef(0), fY = dA.useRef(null), J2 = dA.useRef(null), o5 = dA.useRef(void 0), g2 = 1500, [W$, c9] = dA.useState(!1), C3 = dA.useCallback((k6) => {
        if (Az(k6), k6) $Y.current = Date.now(), OY.current = 0, fY.current = null
    }, []), [Gz, Oq] = dA.useState(null);
    dA.useEffect(() => {
        if (Gz?.notifications) Gz.notifications.forEach((k6) => {
            q6({
                key: "auto-updater-notification",
                text: k6,
                priority: "low"
            })
        })
    }, [Gz, q6]);
    let [vK, l9] = dA.useState(null), _3 = dA.useRef(null), TA = dA.useCallback((k6) => {
        if (k6?.isLocalJSXCommand) {
            let {
                clearLocalJSX: q8,
                ...FA
            } = k6;
            _3.current = {
                ...FA,
                isLocalJSXCommand: !0
            }, l9(FA);
            return
        }
        if (_3.current) {
            if (k6?.clearLocalJSX) {
                _3.current = null, l9(null);
                return
            }
            return
        }
        if (k6?.clearLocalJSX) {
            l9(null);
            return
        }
        l9(k6)
    }, []), [F7, f8] = dA.useState([]), [oq, j5] = dA.useState([]), N4 = F7.length > 0 || q1 || t, E9 = vK?.isLocalJSXCommand === !0;
    dA.useEffect(() => {
        if (_4 && !N4 && !E9) tL7();
        else gx1();
        return () => gx1()
    }, [_4, N4, E9]), dA.useEffect(() => {
        if (_4 && !N4 && !E9) return iMq(), () => nMq()
    }, [_4, N4, E9]), dA.useEffect(() => {
        return gb4(f8), () => Ub4()
    }, [f8]);
    let [W4, F1] = dA.useState(Y ?? []), c1 = dA.useRef(W4), X6 = dA.useCallback((k6) => {
        if (typeof k6 === "function") F1((q8) => {
            let FA = k6(q8);
            return c1.current = FA, FA
        });
        else c1.current = k6, F1(k6)
    }, []), T6 = dA.useDeferredValue(W4), l6 = W4.length - T6.length;
    if (l6 > 0) h(`[useDeferredValue] Messages deferred by ${l6} (${T6.length}→${W4.length})`);
    let [fA, aA] = dA.useState(null), [nA, V8] = dA.useState([]), [K8, $8] = dA.useState(() => IqA()), I7 = dA.useRef(K8);
    I7.current = K8;
    let Lq = dA.useRef(null);
    dA.useEffect(() => {
        if (K8.trim().length === 0) {
            c9(!1);
            return
        }
        c9(!0);
        let k6 = setTimeout(() => {
            c9(!1)
        }, g2);
        return () => clearTimeout(k6)
    }, [K8]);
    let [e4, Rq] = dA.useState("prompt"), [F5, k9] = dA.useState(), {
        tip: HO,
        dismissTip: U2
    } = Gfq({
        inputValue: K8,
        isAssistantResponding: _4
    }), rw = dA.useCallback((k6) => {
        let q8 = new Set(k6);
        $1((FA) => FA.filter((Yq) => q8.has(Yq.name) || pBA.has(Yq)))
    }, [$1]), [ow, r_] = dA.useState(new Set), hH = ffq({
        config: N,
        setMessages: X6,
        setIsLoading: C3,
        onInit: rw,
        setToolUseConfirmQueue: f8,
        tools: G6,
        setStreamingToolUses: xq,
        setStreamMode: tK,
        setInProgressToolUseIDs: r_
    }), pJ = Tfq({
        config: T,
        setMessages: X6,
        setIsLoading: C3,
        setToolUseConfirmQueue: f8,
        tools: G6
    }), $O = pJ.isRemoteMode ? pJ : hH, [IH, aw] = dA.useState({}), [X2, Fj] = dA.useState(0), Qj = dA.useRef(0), p2 = dA.useCallback((k6) => {
        Qj.current = k6(Qj.current)
    }, []), [wD, LP] = dA.useState(0), [gj, S3] = dA.useState(null), [eK, OO] = dA.useState(null), [HD, xH] = dA.useState(null), [o_, dJ] = dA.useState(!1), [$D, _O] = dA.useState(!1), [a_, E5] = dA.useState(bE6()), [Pw, bH] = dA.useState(f6().hasAcknowledgedCostThreshold), [cJ, lJ] = dA.useState("INSERT"), [mY, X8] = dA.useState(!1), [E8, fq] = dA.useState(!1), [t3, aq] = dA.useState(!1), [Zz, VY] = dA.useState(!1), [T4, i9] = dA.useState(!1), [D2, OD] = dA.useState(!1), G$ = k_(), sw = dA.useRef(G$);
    sw.current = G$;
    let I6 = dA.useRef(!1),
        tA = dA.useRef(null),
        [w7] = T7(),
        l7 = dA.useCallback(() => {
            tVq({
                theme: w7,
                readFileState: M7.current
            }).then(async (k6) => {
                if (k6) {
                    let q8 = await k6.content({
                        theme: w7
                    });
                    A1((FA) => ({
                        ...FA,
                        spinnerTip: q8
                    })), eVq(k6)
                } else A1((q8) => ({
                    ...q8,
                    spinnerTip: void 0
                }))
            })
        }, [A1, w7]),
        YK = dA.useCallback(() => {
            C3(!1), ZY(void 0), Qj.current = 0, xq([]), S3(null), OO(null), xH(null), l7(), PB1()
        }, [C3, l7]),
        L9 = dv(D1).some((k6) => k6.status === "running");
    dA.useEffect(() => {
        if (!L9 && J2.current !== null) {
            let k6 = Date.now() - J2.current;
            J2.current = null, X6((q8) => [...q8, cmA(k6)])
        }
    }, [L9, X6]);
    let Ww = W4.findLast((k6) => k6.type === "assistant"),
        JO = Ww?.type === "assistant" ? Ww.message.content.filter((k6) => k6.type === "tool_use" && ow.has(k6.id)) : [],
        MG = JO.length > 0 && JO.every((k6) => k6.type === "tool_use" && k6.name === dBA),
        PG = (!vK || vK.showSpinner === !0) && F7.length === 0 && (_4 || Wz || L9 || xp7() > 0) && !q1 && !MG,
        Gw = F7.length > 0 || oq.length > 0 || E1.queue.length > 0 || Z1.queue.length > 0,
        RP = BVq(W4, _4, X2, "session", Gw),
        S1 = dA.useMemo(() => ({
            ...RP,
            handleSelect: (k6) => {
                if (RP.handleSelect(k6), k6 === "bad" && NUA("feedback_survey_bad") || k6 === "good" && NUA("feedback_survey_good")) H_(k6 === "bad" ? "feedback_survey_bad" : "feedback_survey_good")
            }
        }), [RP]),
        I1 = FVq(W4, _4, Gw);
    LVq({
        autoConnectIdeFlag: J,
        ideToInstallExtension: M6,
        setDynamicMcpConfig: R1,
        setShowIdeOnboarding: o1,
        setIDEInstallationState: P1
    }), zNq(z, U, (k6) => A1((q8) => ({
        ...q8,
        fileHistory: k6
    })));
    let W6 = dA.useCallback(async (k6, q8, FA) => {
            c("tengu_session_resumed", {
                entrypoint: FA
            });
            let Yq = Ig1(q8.messages),
                k7 = await PP("resume", {
                    sessionId: k6,
                    agentType: k?.agentType,
                    model: Y1
                });
            if (Yq.push(...k7), Y_6(q8), A_6(q8, Yj(k6)), _c1(q8, A1), q8.fileHistorySnapshots) CP6(q8);
            if (!G) {
                let p7 = q8.agentSetting ? g?.activeAgents.find((V3) => V3.agentType === q8.agentSetting) : void 0;
                if (y(p7), AC(p7?.agentType), A1((V3) => ({
                        ...V3,
                        agent: p7?.agentType
                    })), p7 && !HT() && p7.model && p7.model !== "inherit") CG(t9(p7.model))
            }
            if (l8()) A1((p7) => ({
                ...p7,
                standaloneAgentContext: q8.agentName || q8.agentColor ? {
                    name: q8.agentName ?? "",
                    color: q8.agentColor
                } : void 0
            }));
            UCA(Yq), Vq(Yq, q8.projectPath ?? y8()), YK(), HY(null), E5(k6);
            let X4 = V7A(k6);
            if (N7A(), az1(), mP(Yj(k6)), await Hy(), X4) zN1(X4);
            X6(() => Yq), TA(null), $8(""), V8([])
        }, [YK, A1]),
        JA = U6(),
        gA = dA.useMemo(() => Lp(U6()), []),
        M7 = dA.useRef((() => {
            let k6 = Rp(JK1);
            return k6.set(gA, {
                content: Q1(x[JA] || []),
                timestamp: 0,
                offset: void 0,
                limit: void 0
            }), k6
        })()),
        Vq = dA.useCallback((k6, q8) => {
            let FA = A91(k6, q8, JK1);
            M7.current = yj1(M7.current, FA)
        }, []);
    dA.useEffect(() => {
        if (Y && Y.length > 0) UCA(Y), Vq(Y, y8())
    }, []);
    let {
        status: h3,
        reverify: n9
    } = yfq(), [j2, H_] = dA.useState(null), [fz, _0] = dA.useState(null), [s_, WG] = dA.useState(!1), Yx = !_4 && $D;

    function f11() {
        if (s_ || fz) return;
        if (o_) return "message-selector";
        if (W$) return;
        if (oq[0]) return "sandbox-permission";
        let k6 = !vK || vK.shouldContinueAnimation;
        if (k6 && F7[0]) return "tool-permission";
        if (k6 && Z1.queue[0]) return "worker-sandbox-permission";
        if (k6 && E1.queue[0]) return "elicitation";
        if (k6 && Yx) return "cost";
        if (k6 && k1) return "ide-onboarding";
        if (k6 && w6) return "lsp-recommendation";
        return
    }
    let XO = f11(),
        V11 = W$ && (oq[0] || F7[0] || Z1.queue[0] || E1.queue[0] || Yx);
    o5.current = XO, dA.useEffect(() => {
        if (!_4) return;
        let k6 = XO === "tool-permission",
            q8 = Date.now();
        if (k6 && fY.current === null) fY.current = q8;
        else if (!k6 && fY.current !== null) OY.current += q8 - fY.current, fY.current = null
    }, [XO, _4]);

    function N11() {
        if (XO === "elicitation") return;
        if (h(`[onCancel] focusedInputDialog=${XO} streamMode=${O7}`), I6.current = !1, YK(), XO === "tool-permission") F7[0]?.onAbort(), f8([]);
        else if ($O.isRemoteMode) $O.cancelRequest();
        else O3?.abort();
        if (KY()) Kd7(D1, A1), GjA(), A1((k6) => {
            if (k6.queuedCommands.length === 0) return k6;
            return {
                ...k6,
                queuedCommands: []
            }
        })
    }
    let rc = dA.useCallback(async () => {
            let k6 = await V_6(K8, 0, async () => new Promise((q8) => A1((FA) => {
                return q8(FA), FA
            })), A1);
            if (!k6) return;
            if ($8(k6.text), Rq("prompt"), k6.images.length > 0) aw((q8) => {
                let FA = {
                    ...q8
                };
                for (let Yq of k6.images) FA[Yq.id] = Yq;
                return FA
            })
        }, [A1, $8, Rq, K8, aw]),
        QE = {
            setToolUseConfirmQueue: f8,
            onCancel: N11,
            isMessageSelectorVisible: o_ || mY || E8,
            screen: y1,
            abortSignal: O3?.signal,
            popCommandFromQueue: rc,
            vimMode: cJ,
            isLocalJSXCommand: vK?.isLocalJSXCommand,
            isSearchingHistory: T4,
            isHelpOpen: D2,
            inputMode: e4,
            inputValue: K8
        };
    dA.useEffect(() => {
        if (W0() >= 5 && !$D && !Pw) {
            if (c("tengu_cost_threshold_reached", {}), hq6()) _O(!0)
        }
    }, [W4, $D, Pw]);
    let cN = dA.useCallback(async (k6) => {
        if (l8() && LQ1()) return new Promise((q8) => {
            let FA = Ib4();
            if (!xb4(k6.host, FA)) {
                j5((k7) => [...k7, {
                    hostPattern: k6,
                    resolvePromise: q8
                }]);
                return
            }
            mb4({
                requestId: FA,
                host: k6.host,
                resolve: q8
            }), A1((k7) => ({
                ...k7,
                pendingSandboxRequest: {
                    requestId: FA,
                    host: k6.host
                }
            }))
        });
        return new Promise((q8) => {
            j5((FA) => [...FA, {
                hostPattern: k6,
                resolvePromise: q8
            }])
        })
    }, [A1]);
    if (b8.isSandboxingEnabled()) b8.initialize(cN).catch((k6) => {
        process.stderr.write(`
❌ Sandbox Error: ${k6 instanceof Error?k6.message:String(k6)}
`), w3(1, "other")
    });
    let zx = dA.useCallback((k6, q8) => {
        A1((FA) => ({
            ...FA,
            toolPermissionContext: {
                ...k6,
                mode: q8?.preserveMode ? FA.toolPermissionContext.mode : k6.mode
            }
        })), setImmediate(() => {
            f8((FA) => {
                return FA.forEach((Yq) => {
                    Yq.recheckPermission()
                }), FA
            })
        })
    }, [A1, f8]);
    dA.useEffect(() => {
        return pb4(zx), () => cb4()
    }, [zx]);
    let Zf = qVq(f8, zx),
        J0 = dA.useCallback((k6, q8, FA, Yq, k7, X4) => {
            return {
                abortController: FA,
                options: {
                    commands: RA,
                    tools: bA,
                    debug: q,
                    verbose: S,
                    mainLoopModel: X4,
                    maxThinkingTokens: k7 ?? (p === !0 ? rz1(X4) : p === !1 ? 0 : void 0),
                    mcpClients: p1,
                    mcpResources: m.resources,
                    ideInstallationStatus: F6,
                    isNonInteractiveSession: !1,
                    dynamicMcpConfig: f1,
                    theme: w7,
                    agentDefinitions: lA ? {
                        ...g,
                        allowedAgentTypes: lA
                    } : g,
                    customSystemPrompt: D,
                    appendSystemPrompt: j
                },
                getAppState() {
                    return M1.setState((p7) => ({
                        ...p7,
                        toolPermissionContext: {
                            ...p7.toolPermissionContext,
                            alwaysAllowRules: {
                                ...p7.toolPermissionContext.alwaysAllowRules,
                                command: Yq
                            }
                        }
                    })), Promise.resolve(M1.getState())
                },
                setAppState: A1,
                messages: k6,
                setMessages: X6,
                updateFileHistoryState(p7) {
                    A1((V3) => ({
                        ...V3,
                        fileHistory: p7(V3.fileHistory)
                    }))
                },
                updateAttributionState(p7) {
                    A1((V3) => ({
                        ...V3,
                        attribution: p7(V3.attribution)
                    }))
                },
                openMessageSelector: () => {
                    if (!W) dJ(!0)
                },
                onChangeAPIKey: n9,
                readFileState: M7.current,
                setToolJSX: TA,
                addNotification: q6,
                onChangeDynamicMcpConfig: H1,
                onInstallIDEExtension: N6,
                nestedMemoryAttachmentTriggers: new Set,
                dynamicSkillDirTriggers: new Set,
                setResponseLength: p2,
                setStreamMode: tK,
                onCompactProgress: (p7) => {
                    switch (p7.type) {
                        case "hooks_start":
                            OO("claudeBlue_FOR_SYSTEM_SPINNER"), xH("claudeBlueShimmer_FOR_SYSTEM_SPINNER"), S3(p7.hookType === "pre_compact" ? "Running PreCompact hooks…" : "Running SessionStart hooks…");
                            break;
                        case "compact_start":
                            S3("Compacting conversation");
                            break;
                        case "compact_end":
                            S3(null), OO(null), xH(null);
                            break
                    }
                },
                setInProgressToolUseIDs: r_,
                resume: W6,
                setConversationId: E5
            }
        }, [RA, bA, q, S, p1, m.resources, F6, f1, w7, g, lA, M1, A1, n9, q6, H1, W6, p, W, D, j, E5]),
        $_ = dA.useCallback(() => {
            O3?.abort(), GjA(), (async () => {
                let [k6, q8, FA] = await Promise.all([dZ(bA, Y1, Array.from(B.additionalWorkingDirectories.keys()), p1), i$(), l$()]), Yq = J0(c1.current, [], new AbortController, [], void 0, Y1), k7 = ot({
                    mainThreadAgentDefinition: k,
                    toolUseContext: Yq,
                    customSystemPrompt: D,
                    defaultSystemPrompt: k6,
                    appendSystemPrompt: j
                });
                Jd7({
                    messages: [...c1.current],
                    queryParams: {
                        systemPrompt: k7,
                        userContext: q8,
                        systemContext: FA,
                        canUseTool: Zf,
                        toolUseContext: Yq,
                        querySource: EQ1()
                    },
                    description: oL7() || "Background session",
                    setAppState: A1,
                    agentDefinition: k,
                    recordTranscript: (X4) => void bI(X4)
                })
            })()
        }, [O3, bA, Y1, B, p1, k, J0, D, j, Zf, A1]),
        {
            handleBackgroundSession: hy
        } = hVq({
            setMessages: X6,
            setIsLoading: C3,
            resetLoadingState: YK,
            setAbortController: HY,
            onBackgroundQuery: $_
        }),
        T11 = dA.useCallback((k6) => {
            iW1(k6, (q8) => {
                if (cR(q8)) X6(() => [q8]);
                else X6((FA) => [...FA, q8])
            }, (q8) => p2((FA) => FA + q8.length), tK, xq, (q8) => {
                X6((FA) => FA.filter((Yq) => Yq !== q8)), rmA(q8.uuid)
            }, R4)
        }, [X6, p2, tK, xq, R4]),
        oc = dA.useCallback(async (k6, q8, FA, Yq, k7, X4, p7) => {
            let V3 = q8.filter((f$) => f$.type === "user" || f$.type === "assistant").pop();
            if (Yq) {
                Fd.handleQueryStart(p1);
                let f$ = iV(p1);
                if (f$) mx7(f$)
            }
            if (yD1(), V3?.type === "user" && typeof V3.message.content === "string") eL7(V3.message.content);
            if (!Yq) {
                YK(), HY(null);
                return
            }
            let sq = J0(k6, q8, FA, k7, p7, X4);
            y3("query_context_loading_start");
            let [, , J3, pK, _Y] = await Promise.all([zUA(B, A1), void 0, dZ(bA, X4, Array.from(B.additionalWorkingDirectories.keys()), p1), i$(), l$()]), Uj = {
                ...pK,
                ...mWz(p1),
                ...{}
            };
            y3("query_context_loading_end");
            let iJ = ot({
                mainThreadAgentDefinition: k,
                toolUseContext: sq,
                customSystemPrompt: D,
                defaultSystemPrompt: J3,
                appendSystemPrompt: j
            });
            y3("query_query_start");
            for await (let f$ of ZR({
                messages: k6,
                systemPrompt: iJ,
                userContext: Uj,
                systemContext: _Y,
                canUseTool: Zf,
                toolUseContext: sq,
                querySource: EQ1()
            })) T11(f$);
            y3("query_end"), YK(), n1q(), P?.()
        }, [p1, YK, J0, B, A1, bA, D, P, j, Zf, k, T11]),
        ff = dA.useCallback(async (k6, q8, FA, Yq, k7, X4, p7, V3) => {
            if (l8()) {
                let sq = i3(),
                    J3 = g5();
                if (sq && J3) kj6(sq, J3, !0)
            }
            if (I6.current) {
                c("tengu_concurrent_onquery_detected", {}), k6.filter((sq) => sq.type === "user").map((sq) => J51(sq.message.content)).filter((sq) => sq !== null).forEach((sq, J3) => {
                    if (lB({
                            value: sq,
                            mode: "prompt"
                        }, A1), J3 === 0) c("tengu_concurrent_onquery_enqueued", {})
                }), C3(!1);
                return
            }
            I6.current = !0, tA.current = k6;
            try {
                C3(!0), X6((J3) => [...J3, ...k6]), ZY(void 0), Qj.current = 0, xq([]);
                let sq = await new Promise((J3) => {
                    X6((pK) => {
                        return J3(pK), pK
                    })
                });
                if (p7 && V3) {
                    let J3 = [...sq, ...k6];
                    if (!await p7(V3, J3)) return
                }
                await oc(sq, k6, q8, FA, Yq, k7, X4)
            } finally {
                I6.current = !1, LP(Date.now()), YK();
                let sq = Date.now() - $Y.current - OY.current;
                if (sq > 30000 && !q8.signal.aborted && !G1)
                    if (dv(M1.getState().tasks).some((pK) => pK.status === "running")) {
                        if (J2.current === null) J2.current = $Y.current
                    } else X6((pK) => [...pK, cmA(sq)])
            }
        }, [oc, C3, A1, YK]),
        lN = dA.useRef(!1);
    dA.useEffect(() => {
        let k6 = l;
        if (!k6 || _4 || lN.current) return;
        lN.current = !0;
        async function q8(FA) {
            if (FA.clearContext) {
                let X4 = FA.message.planContent ? Rj1() : void 0,
                    {
                        clearConversation: p7
                    } = await Promise.resolve().then(() => (ZIA(), pAq));
                if (await p7({
                        setMessages: X6,
                        readFileState: M7.current,
                        getAppState: async () => new Promise((V3) => {
                            A1((sq) => {
                                return V3(sq), sq
                            })
                        }),
                        setAppState: A1,
                        setConversationId: E5
                    }), X4) n0A(U6(), X4)
            }
            let Yq = FA.message.planContent && !1;
            if (A1((X4) => {
                    let p7 = FA.mode ? WV(X4.toolPermissionContext, Rc1(FA.mode, FA.allowedPrompts)) : X4.toolPermissionContext;
                    return {
                        ...X4,
                        initialMessage: null,
                        toolPermissionContext: p7,
                        ...Yq && {
                            pendingPlanVerification: {
                                plan: FA.message.planContent,
                                verificationStarted: !1,
                                verificationCompleted: !1
                            }
                        }
                    }
                }), z2()) WW1((X4) => {
                A1((p7) => ({
                    ...p7,
                    fileHistory: X4(p7.fileHistory)
                }))
            }, FA.message.uuid);
            let k7 = FA.message.message.content;
            if (typeof k7 === "string" && !FA.message.planContent) Z$(k7, {
                setCursorOffset: () => {},
                clearBuffer: () => {},
                resetHistory: () => {}
            });
            else {
                let X4 = Aq();
                HY(X4), ff([FA.message], X4, !0, [], Y1, void 0)
            }
            setTimeout(() => {
                lN.current = !1
            }, 100)
        }
        q8(k6)
    }, [l, _4, X6, A1, ff, Y1, bA]);
    let Z$ = dA.useCallback(async (k6, q8, FA, Yq) => {
            if (!FA && k6.trim().startsWith("/")) {
                let k7 = k6.trim(),
                    X4 = k7.indexOf(" "),
                    p7 = X4 === -1 ? k7.slice(1) : k7.slice(1, X4),
                    V3 = X4 === -1 ? "" : k7.slice(X4 + 1).trim(),
                    sq = RA.find((pK) => pK.isEnabled() && (pK.name === p7 || pK.aliases?.includes(p7) || pK.userFacingName() === p7)),
                    J3 = sq?.immediate || Yq?.fromKeybinding;
                if (sq && J3 && sq.type === "local-jsx") {
                    if (k6.trim() === I7.current.trim()) $8(""), q8.setCursorOffset(0), q8.clearBuffer();
                    (async () => {
                        let _Y = (Vf, by) => {
                                if (TA({
                                        jsx: null,
                                        shouldHidePromptInput: !1,
                                        clearLocalJSX: !0
                                    }), Vf && by?.display !== "skip") q6({
                                    key: `immediate-${sq.name}`,
                                    text: Vf,
                                    priority: "low"
                                });
                                if (by?.metaMessages?.length) {
                                    let SF = by.metaMessages.map((iN) => c6({
                                        content: iN,
                                        isMeta: !0
                                    }));
                                    X6((iN) => [...iN, ...SF])
                                }
                            },
                            Uj = J0(W4, [], Aq(), [], void 0, Y1),
                            f$ = await (await sq.load()).call(_Y, Uj, V3);
                        if (f$) TA({
                            jsx: f$,
                            shouldHidePromptInput: !0,
                            isLocalJSXCommand: !0
                        })
                    })();
                    return
                }
            }
            if ($O.isRemoteMode && !k6.trim()) return;
            if (!Yq?.fromKeybinding) _q1({
                display: FA ? k6 : qk7(k6, e4),
                pastedContents: FA ? {} : IH
            });
            if (F5 !== void 0) $8(F5.text), q8.setCursorOffset(F5.cursorOffset), aw(F5.pastedContents), k9(void 0);
            else if (!_4 || FA) {
                if (!Yq?.fromKeybinding) $8(""), q8.setCursorOffset(0);
                aw({})
            }
            if (!_4 || FA) Rq("prompt"), j6(void 0), Fj((k7) => k7 + 1), q8.clearBuffer();
            if (FA) {
                let {
                    queryRequired: k7
                } = await V6q(FA.state, FA.speculationSessionTimeSavedMs, FA.setAppState, k6, {
                    setMessages: X6,
                    readFileState: M7,
                    cwd: y8()
                });
                if (k7) {
                    let X4 = Aq();
                    HY(X4), ff([], X4, !0, [], Y1, void 0)
                }
                return
            }
            if ($O.isRemoteMode) {
                let k7 = Object.values(IH),
                    X4 = k7.filter((pK) => pK.type === "image"),
                    p7 = X4.length > 0 ? X4.map((pK) => pK.id) : void 0,
                    V3 = k6.trim(),
                    sq = k6.trim();
                if (k7.length > 0) {
                    let pK = [],
                        _Y = [],
                        Uj = k6.trim();
                    if (Uj) pK.push({
                        type: "text",
                        text: Uj
                    }), _Y.push({
                        type: "text",
                        text: Uj
                    });
                    for (let iJ of k7)
                        if (iJ.type === "image") {
                            let f$ = {
                                type: "base64",
                                media_type: iJ.mediaType ?? "image/png",
                                data: iJ.content
                            };
                            pK.push({
                                type: "image",
                                source: f$
                            }), _Y.push({
                                type: "image",
                                source: f$
                            })
                        } else pK.push({
                            type: "text",
                            text: iJ.content
                        }), _Y.push({
                            type: "text",
                            text: iJ.content
                        });
                    V3 = pK, sq = _Y
                }
                let J3 = c6({
                    content: V3,
                    imagePasteIds: p7
                });
                X6((pK) => [...pK, J3]), await $O.sendMessage(sq);
                return
            }
            await PE6({
                input: k6,
                helpers: q8,
                isLoading: _4,
                mode: e4,
                commands: RA,
                onInputChange: $8,
                setPastedContents: aw,
                setIsLoading: C3,
                setToolJSX: TA,
                getToolUseContext: J0,
                messages: W4,
                mainLoopModel: Y1,
                pastedContents: IH,
                ideSelection: K6,
                setUserInputOnProcessing: ZY,
                setAbortController: HY,
                abortController: O3,
                onQuery: ff,
                resetLoadingState: YK,
                thinkingEnabled: p,
                setAppState: A1,
                querySource: EQ1(),
                onBeforeQuery: M,
                canUseTool: Zf,
                addNotification: q6,
                streamMode: O7,
                queueOnly: Yq?.queueOnly
            })
        }, [_4, e4, RA, $8, Rq, aw, Fj, j6, C3, TA, J0, W4, Y1, IH, K6, ZY, HY, q6, ff, YK, F5, k9, p, A1, M, Zf, hH, X6, q6, O7]),
        ac = dA.useCallback(async (k6, q8, FA) => {
            PTA(q8.id, k6, A1), $8(""), FA.setCursorOffset(0), FA.clearBuffer()
        }, [A1, $8]),
        yY1 = dA.useCallback(() => {
            let k6 = j2 ? XRq(j2) : "/issue";
            H_(null), Z$(k6, {
                setCursorOffset: () => {},
                clearBuffer: () => {},
                resetHistory: () => {}
            }).catch((q8) => {
                h(`Auto-run ${k6} failed: ${q8 instanceof Error?q8.message:String(q8)}`)
            })
        }, [Z$, j2]),
        sc = dA.useCallback(() => {
            H_(null)
        }, []),
        wx = dA.useCallback(() => {
            Z$("/rate-limit-options", {
                setCursorOffset: () => {},
                clearBuffer: () => {},
                resetHistory: () => {}
            })
        }, [Z$]),
        M2 = dA.useCallback(async () => {
            if (WG(!0), !1) {
                _0(V7.createElement(aHq, {
                    showWorktree: !0,
                    onDone: () => {},
                    onCancel: () => {
                        _0(null), WG(!1)
                    }
                }));
                return
            }
            let FA = await (await Vd1.load()).call(() => {});
            _0(FA)
        }, []),
        gf1 = dA.useCallback(() => {
            dJ((k6) => !k6)
        }, []);
    async function gE() {
        n9();
        let k6 = I_();
        if (k6.length > 0) {
            let q8 = k6.map((FA) => `  [${FA.type}] ${FA.path} (${FA.content.length} chars)${FA.parent?` (included by ${FA.parent})`:""}`).join(`
`);
            h(`Loaded ${k6.length} CLAUDE.md/rules files:
${q8}`)
        } else h("No CLAUDE.md/rules files found");
        for (let q8 of k6) M7.current.set(q8.path, {
            content: q8.content,
            timestamp: Date.now(),
            offset: void 0,
            limit: void 0
        })
    }
    I17(mDq()), qPq(W4, W4.length === Y?.length), Lfq(), dA.useEffect(() => {
        if (r.length < 1) return;
        jA((k6) => ({
            ...k6,
            promptQueueUseCount: (k6.promptQueueUseCount ?? 0) + 1
        }))
    }, [r.length]);
    let t6 = dA.useCallback(() => new Promise((k6) => A1((q8) => {
            return k6(q8), q8
        })), [A1]),
        iA = dA.useCallback(async (k6, q8) => {
            await PE6({
                input: k6,
                helpers: {
                    setCursorOffset: () => {},
                    clearBuffer: () => {},
                    resetHistory: () => {}
                },
                isLoading: _4,
                mode: "prompt",
                commands: RA,
                onInputChange: () => {},
                setPastedContents: () => {},
                setIsLoading: C3,
                setToolJSX: TA,
                getToolUseContext: J0,
                messages: W4,
                mainLoopModel: Y1,
                pastedContents: q8,
                ideSelection: K6,
                setUserInputOnProcessing: ZY,
                setAbortController: HY,
                onQuery: ff,
                resetLoadingState: YK,
                thinkingEnabled: p,
                setAppState: A1,
                querySource: EQ1(),
                onBeforeQuery: M,
                canUseTool: Zf,
                addNotification: q6
            })
        }, [_4, RA, C3, TA, J0, W4, Y1, K6, ZY, Zf, HY, ff, YK, p, q6, A1, M]);
    HVq({
        isLoading: _4,
        queuedCommandsLength: r.length,
        lastQueryCompletionTime: wD,
        getAppState: t6,
        setAppState: A1,
        executeQueuedInput: iA,
        hasActiveLocalJsxUI: vK?.isLocalJSXCommand ?? !1,
        setIsLoading: C3
    }), dA.useEffect(() => {
        RF1.recordUserActivity(), A61()
    }, [K8, X2]);
    let LA = dA.useRef(new Set);
    dA.useEffect(() => {
        let k6 = new Set(W4.filter((FA) => cR(FA)).map((FA) => FA.uuid));
        if (Array.from(k6).some((FA) => !LA.current.has(FA))) LA.current = k6, E5(bE6())
    }, [W4]), dA.useEffect(() => {
        if (X2 === 1) SQA()
    }, [X2]), dA.useEffect(() => {
        if (_4) return;
        if (X2 === 0) return;
        if (wD === 0) return;
        let k6 = setTimeout(() => {
            if (KN1() > wD) return;
            let FA = Date.now() - wD;
            if (!_4 && !vK && o5.current === void 0 && FA >= f6().messageIdleNotifThresholdMs) Nm({
                message: "Claude is waiting for your input",
                notificationType: "idle_prompt"
            }, z1)
        }, f6().messageIdleNotifThresholdMs);
        return () => clearTimeout(k6)
    }, [_4, vK, X2, wD, z1]);
    let J4 = dA.useCallback((k6, q8) => {
            if (I6.current) return !1;
            let FA = Aq();
            HY(FA);
            let Yq = c6({
                content: k6,
                isMeta: q8?.isMeta ? !0 : void 0
            });
            return ff([Yq], FA, !0, [], Y1, void 0), !0
        }, [ff, Y1]),
        UK = !1,
        a5 = dA.useCallback((k6) => {
            return
        }, [$8]),
        Vz = FWz({
            onTranscript: a5,
            onError: (k6) => {
                q6({
                    key: "whisper-error",
                    text: k6,
                    color: "error",
                    priority: "immediate",
                    timeoutMs: 1e4
                })
            },
            enabled: UK
        });
    TVq({
        enabled: l8(),
        isLoading: _4,
        focusedInputDialog: XO,
        onSubmitMessage: J4
    }), OVq({
        isLoading: _4,
        onSubmitMessage: J4
    }), dA.useEffect(() => {
        return gE(), () => {
            Fd.shutdown()
        }
    }, []);
    let {
        internal_eventEmitter: r9
    } = bo(), [RF, CY1] = dA.useState(0);
    dA.useEffect(() => {
        let k6 = () => {
                process.stdout.write(`
Claude Code has been suspended. Run \`fg\` to bring Claude Code back.
Note: ctrl + z now suspends Claude Code, ctrl + _ undoes input.
`)
            },
            q8 = () => {
                CY1((FA) => FA + 1)
            };
        return r9?.on("suspend", k6), r9?.on("resume", q8), () => {
            r9?.off("suspend", k6), r9?.off("resume", q8)
        }
    }, [r9]);
    let _D = dA.useMemo(() => iO(nA).filter(et), [nA]),
        Hx = dA.useMemo(() => {
            if (!_4) return null;
            let k6 = W4.filter((J3) => J3.type === "progress" && J3.data.type === "hook_progress" && (J3.data.hookEvent === "Stop" || J3.data.hookEvent === "SubagentStop"));
            if (k6.length === 0) return null;
            let q8 = [...new Set(k6.map((J3) => J3.toolUseID))],
                FA = q8[q8.length - 1];
            if (!FA) return null;
            if (W4.some((J3) => J3.type === "system" && J3.subtype === "stop_hook_summary" && J3.toolUseID === FA)) return null;
            let k7 = k6.filter((J3) => J3.toolUseID === FA),
                X4 = k7.length,
                p7 = W4.filter((J3) => {
                    if (J3.type !== "attachment") return !1;
                    let pK = J3.attachment;
                    return "hookEvent" in pK && (pK.hookEvent === "Stop" || pK.hookEvent === "SubagentStop") && "toolUseID" in pK && pK.toolUseID === FA
                }).length,
                V3 = k7.find((J3) => J3.data.statusMessage)?.data.statusMessage;
            if (V3) return X4 === 1 ? `${V3}…` : `${V3}… ${p7}/${X4}`;
            let sq = k7[0]?.data.hookEvent === "SubagentStop" ? "subagent stop" : "stop";
            return X4 === 1 ? `running ${sq} hook` : `running stop hooks… ${p7}/${X4}`
        }, [W4, _4]),
        tc = dA.useCallback(() => {
            aA({
                messagesLength: W4.length,
                messageHistoryLength: nA.length,
                streamingToolUsesLength: gq.length
            })
        }, [W4.length, nA.length, gq.length]),
        Iy = dA.useCallback(() => {
            aA(null)
        }, []),
        xy = x[JA],
        yF = {
            screen: y1,
            setScreen: B1,
            setScreenToggleId: O6,
            showAllInTranscript: P6,
            setShowAllInTranscript: V6,
            messageCount: W4.length,
            onEnterTranscript: tc,
            onExitTranscript: Iy,
            todos: xy
        },
        NY = fA ? T6.slice(0, fA.messagesLength) : T6,
        SY1 = fA ? gq.slice(0, fA.streamingToolUsesLength) : gq,
        yP = fA ? iO(nA.slice(0, fA.messageHistoryLength)).filter(et) : _D;
    if (ufq({
            onOpenBackgroundTasks: () => X8(!0)
        }), BWz(), pfq(), y1 === "transcript") return V7.createElement(dX, null, V7.createElement(lgA, {
        ...yF
    }), null, V7.createElement(igA, {
        onSubmit: Z$,
        isActive: !vK?.isLocalJSXCommand
    }), V7.createElement(ngA, {
        ...QE
    }), V7.createElement(g91, {
        messages: NY,
        normalizedMessageHistory: yP,
        tools: bA,
        commands: RA,
        verbose: !0,
        toolJSX: null,
        toolUseConfirmQueue: [],
        inProgressToolUseIDs: ow,
        isMessageSelectorVisible: !1,
        conversationId: a_,
        screen: y1,
        agentDefinitions: g,
        screenToggleId: A6,
        streamingToolUses: SY1,
        showAllInTranscript: P6,
        onOpenRateLimitOptions: wx,
        isLoading: _4,
        hidePastThinking: !0,
        streamingThinking: U8
    }), vK && V7.createElement(I, {
        flexDirection: "column",
        width: "100%"
    }, vK.jsx), V7.createElement(HLq, null), V7.createElement(QWz, {
        showAllInTranscript: P6
    }));
    let UE = a ? D1[a] : void 0,
        CF = UE && pO(UE) ? UE : void 0,
        hY1 = CF?.messages ?? T6;
    return V7.createElement(dX, null, V7.createElement(lgA, {
        ...yF
    }), null, V7.createElement(igA, {
        onSubmit: Z$,
        isActive: !vK?.isLocalJSXCommand
    }), V7.createElement(ngA, {
        ...QE
    }), V7.createElement(yV6, {
        key: RF,
        dynamicMcpConfig: f1,
        isStrictMcpConfig: X,
        mcpCliEndpoint: _
    }, V7.createElement(GVq, null), V7.createElement(g91, {
        messages: hY1,
        normalizedMessageHistory: CF ? [] : _D,
        tools: bA,
        commands: RA,
        verbose: S,
        toolJSX: vK,
        toolUseConfirmQueue: F7,
        inProgressToolUseIDs: CF ? CF.inProgressToolUseIDs ?? new Set : ow,
        isMessageSelectorVisible: o_,
        conversationId: a_,
        screen: y1,
        screenToggleId: A6,
        streamingToolUses: gq,
        showAllInTranscript: P6,
        agentDefinitions: g,
        onOpenRateLimitOptions: wx,
        isLoading: _4
    }), !W && Wz && V7.createElement($51, {
        param: {
            text: Wz,
            type: "text"
        },
        addMargin: !0,
        verbose: S
    }), vK && V7.createElement(I, {
        flexDirection: "column",
        width: "100%"
    }, vK.jsx), V7.createElement(I, {
        flexDirection: "column",
        width: "100%"
    }, !1, PG && V7.createElement(GR4, {
        mode: O7,
        spinnerTip: N1,
        responseLengthRef: Qj,
        overrideMessage: gj,
        spinnerSuffix: Hx,
        verbose: S,
        loadingStartTimeRef: $Y,
        totalPausedMsRef: OY,
        pauseStartTimeRef: fY,
        todos: xy,
        overrideColor: eK,
        overrideShimmerColor: HD,
        hasActiveTools: ow.size > 0
    }), null, !PG && !vK?.isLocalJSXCommand && j1 && L6 && L6.length > 0 && V7.createElement(I, {
        width: "100%",
        flexDirection: "column"
    }, V7.createElement(fj6, {
        tasks: L6,
        isStandalone: !0
    })), !PG && !vK?.isLocalJSXCommand && j1 && !(L6 && L6.length > 0) && V7.createElement(I, {
        width: "100%",
        flexDirection: "column"
    }, V7.createElement(gs, {
        todos: xy || [],
        isStandalone: !0
    })), XO === "sandbox-permission" && V7.createElement(wUA, {
        key: oq[0].hostPattern.host,
        hostPattern: oq[0].hostPattern,
        onUserResponse: (k6) => {
            let {
                allow: q8,
                persistToSettings: FA
            } = k6, Yq = oq[0];
            if (!Yq) return;
            let k7 = Yq.hostPattern.host;
            if (FA) {
                let X4 = {
                    type: "addRules",
                    rules: [{
                        toolName: xO,
                        ruleContent: `domain:${k7}`
                    }],
                    behavior: q8 ? "allow" : "deny",
                    destination: "localSettings"
                };
                A1((p7) => ({
                    ...p7,
                    toolPermissionContext: a2(p7.toolPermissionContext, X4)
                })), eb(X4), b8.refreshConfig()
            }
            j5((X4) => {
                return X4.filter((p7) => p7.hostPattern.host === k7).forEach((p7) => p7.resolvePromise(q8)), X4.filter((p7) => p7.hostPattern.host !== k7)
            })
        }
    }), XO === "tool-permission" && V7.createElement(_Wq, {
        key: F7[0]?.toolUseID,
        onDone: () => f8(([k6, ...q8]) => q8),
        onReject: rc,
        toolUseConfirm: F7[0],
        toolUseContext: J0(W4, W4, O3 ?? Aq(), [], void 0, Y1),
        verbose: S,
        workerBadge: F7[0]?.workerBadge
    }), q1 && V7.createElement(nQA, {
        toolName: q1.toolName,
        description: q1.description
    }), t && V7.createElement(nQA, {
        toolName: "Network Access",
        description: `Waiting for leader to approve network access to ${t.host}`
    }), XO === "worker-sandbox-permission" && V7.createElement(wUA, {
        key: Z1.queue[0].requestId,
        hostPattern: {
            host: Z1.queue[0].host,
            port: void 0
        },
        onUserResponse: (k6) => {
            let {
                allow: q8,
                persistToSettings: FA
            } = k6, Yq = Z1.queue[0];
            if (!Yq) return;
            let k7 = Yq.host;
            if (bb4(Yq.workerName, Yq.requestId, k7, q8, J1?.teamName), FA && q8) {
                let X4 = {
                    type: "addRules",
                    rules: [{
                        toolName: xO,
                        ruleContent: `domain:${k7}`
                    }],
                    behavior: "allow",
                    destination: "localSettings"
                };
                A1((p7) => ({
                    ...p7,
                    toolPermissionContext: a2(p7.toolPermissionContext, X4)
                })), eb(X4), b8.refreshConfig()
            }
            A1((X4) => ({
                ...X4,
                workerSandboxPermissions: {
                    ...X4.workerSandboxPermissions,
                    queue: X4.workerSandboxPermissions.queue.slice(1)
                }
            }))
        }
    }), XO === "elicitation" && V7.createElement(WWq, {
        event: E1.queue[0],
        onResponse: (k6, q8) => {
            let FA = E1.queue[0];
            if (FA) A1((Yq) => ({
                ...Yq,
                elicitation: {
                    queue: Yq.elicitation.queue.slice(1)
                }
            })), FA.respond({
                action: k6,
                content: q8
            })
        }
    }), XO === "cost" && V7.createElement(dMq, {
        onDone: () => {
            _O(!1), bH(!0), jA((k6) => ({
                ...k6,
                hasAcknowledgedCostThreshold: !0
            })), c("tengu_cost_threshold_acknowledged", {})
        }
    }), XO === "ide-onboarding" && V7.createElement(Nx7, {
        onDone: () => o1(!1),
        installationStatus: F6
    }), !1, fz, XO === "lsp-recommendation" && w6 && V7.createElement(kLq, {
        pluginName: w6.pluginName,
        pluginDescription: w6.pluginDescription,
        fileExtension: w6.fileExtension,
        onResponse: r6
    }), !vK?.shouldHidePromptInput && !XO && !s_ && !W && V7.createElement(V7.Fragment, null, j2 && V7.createElement(JRq, {
        onRun: yY1,
        onCancel: sc,
        reason: DRq(j2)
    }), I1.state !== "closed" ? V7.createElement(YUA, {
        state: I1.state,
        handleSelect: I1.handleSelect,
        inputValue: K8,
        setInputValue: $8
    }) : V7.createElement(YUA, {
        state: S1.state,
        handleSelect: S1.handleSelect,
        inputValue: K8,
        setInputValue: $8
    }), !1, null, V7.createElement(Pfq, {
        debug: q,
        ideSelection: K6,
        hasSuppressedDialogs: !!V11,
        getToolUseContext: J0,
        toolPermissionContext: B,
        setToolPermissionContext: zx,
        apiKeyStatus: h3,
        commands: RA,
        agents: g.activeAgents,
        isLoading: _4,
        onExit: M2,
        verbose: S,
        messages: W4,
        onAutoUpdaterResult: Oq,
        autoUpdaterResult: Gz,
        input: K8,
        onInputChange: $8,
        mode: e4,
        onModeChange: Rq,
        stashedPrompt: F5,
        setStashedPrompt: k9,
        submitCount: X2,
        onShowMessageSelector: gf1,
        mcpClients: p1,
        pastedContents: IH,
        setPastedContents: aw,
        vimMode: cJ,
        setVimMode: lJ,
        showBashesDialog: mY,
        setShowBashesDialog: X8,
        showDiffDialog: E8,
        setShowDiffDialog: fq,
        tasksSelected: t3,
        setTasksSelected: aq,
        diffSelected: Zz,
        setDiffSelected: VY,
        onSubmit: Z$,
        onAgentSubmit: ac,
        isSearchingHistory: T4,
        setIsSearchingHistory: i9,
        helpOpen: D2,
        setHelpOpen: OD,
        insertTextRef: void 0
    }), V7.createElement(CVq, {
        onBackgroundSession: hy,
        isLoading: _4
    })), !1), XO === "message-selector" && V7.createElement(fMq, {
        messages: W4,
        onPreRestore: N11,
        onRestoreCode: async (k6) => {
            await kP6((q8) => {
                A1((FA) => ({
                    ...FA,
                    fileHistory: q8(FA.fileHistory)
                }))
            }, k6.uuid)
        },
        onSummarize: async (k6, q8) => {
            let FA = W4.indexOf(k6);
            if (FA === -1) return;
            let Yq = Aq(),
                k7 = J0(W4, [], Yq, [], void 0, Y1),
                X4 = await k7.getAppState(),
                p7 = await dZ(k7.options.tools, k7.options.mainLoopModel, Array.from(X4.toolPermissionContext.additionalWorkingDirectories.keys()), k7.options.mcpClients),
                V3 = ot({
                    mainThreadAgentDefinition: void 0,
                    toolUseContext: k7,
                    customSystemPrompt: k7.options.customSystemPrompt,
                    defaultSystemPrompt: p7,
                    appendSystemPrompt: k7.options.appendSystemPrompt
                }),
                [sq, J3] = await Promise.all([i$(), l$()]),
                pK = await Fa4(W4, FA, k7, {
                    systemPrompt: V3,
                    userContext: sq,
                    systemContext: J3,
                    toolUseContext: k7,
                    forkContextMessages: W4
                }, q8);
            X6([pK.boundaryMarker, ...pK.messagesToKeep ?? [], ...pK.summaryMessages, ...pK.attachments, ...pK.hookResults]), E5(bE6());
            let _Y = ZQ1(k6);
            if (_Y !== null) {
                let iJ = C4(_Y, "bash-input"),
                    f$ = C4(_Y, SG);
                if (iJ) $8(iJ), Rq("bash");
                else if (f$) {
                    let Vf = C4(_Y, "command-args") || "";
                    $8(`${f$} ${Vf}`), Rq("prompt")
                } else $8(_Y), Rq("prompt")
            }
            let Uj = m0("app:toggleTranscript", "Global", "ctrl+o");
            q6({
                key: "summarize-ctrl-o-hint",
                text: `Conversation summarized (${Uj} for history)`,
                priority: "medium",
                timeoutMs: 8000
            })
        },
        onRestoreMessage: async (k6) => {
            let q8 = W4.indexOf(k6),
                FA = W4.slice(0, q8);
            setImmediate(async () => {
                X6([...FA]), E5(bE6()), A1((k7) => ({
                    ...k7,
                    todos: {
                        ...k7.todos,
                        [JA]: k6.todos ?? []
                    },
                    toolPermissionContext: k6.permissionMode && k7.toolPermissionContext.mode !== k6.permissionMode ? {
                        ...k7.toolPermissionContext,
                        mode: k6.permissionMode
                    } : k7.toolPermissionContext,
                    promptSuggestion: {
                        text: null,
                        promptId: null,
                        shownAt: 0,
                        acceptedAt: 0,
                        generationRequestId: null
                    }
                })), $K1(k6.todos ?? [], JA);
                let Yq = ZQ1(k6);
                if (Yq !== null) {
                    let k7 = C4(Yq, "bash-input"),
                        X4 = C4(Yq, SG);
                    if (k7) $8(k7), Rq("bash");
                    else if (X4) {
                        let p7 = C4(Yq, "command-args") || "";
                        $8(`${X4} ${p7}`), Rq("prompt")
                    } else $8(Yq), Rq("prompt")
                }
                if (Array.isArray(k6.message.content) && k6.message.content.some((k7) => k7.type === "image")) {
                    let k7 = k6.message.content.filter((X4) => X4.type === "image");
                    if (k7.length > 0) {
                        let X4 = {};
                        k7.forEach((p7, V3) => {
                            if (p7.source.type === "base64") {
                                let sq = k6.imagePasteIds?.[V3] ?? V3 + 1;
                                X4[sq] = {
                                    id: sq,
                                    type: "image",
                                    content: p7.source.data,
                                    mediaType: p7.source.media_type
                                }
                            }
                        }), aw(X4)
                    }
                }
            })
        },
        onClose: () => dJ(!1)
    })))
}
// @from(Ln 488571, Col 4)
V7
// @from(Ln 488571, Col 8)
dA
// @from(Ln 488571, Col 12)
BWz = () => {}
// @from(Ln 488572, Col 4)
mWz = () => ({})
// @from(Ln 488573, Col 4)
FWz = ({
        enabled: A
    }) => ({
        state: "idle",
        handleKeyEvent: () => {},
        isAvailable: !1
    })
// @from(Ln 488580, Col 4)
uE6 = null
// @from(Ln 488581, Col 4)
vUA = v(() => {
    i1();
    m1();
    cMq();
    h2();
    aF1();
    aMq();
    $q1();
    pM();
    B6();
    Z6();
    hA();
    e7();
    m6();
    lC1();
    XN();
    tP1();
    H$();
    gR();
    yQ1();
    Cz();
    eMq();
    gR();
    As();
    KPq();
    Nv6();
    wPq();
    JWq();
    GWq();
    Wfq();
    Zfq();
    Vfq();
    vfq();
    Efq();
    x2();
    GTA();
    ov();
    cZ6();
    TR();
    dD();
    hQA();
    DL();
    zQA();
    Rfq();
    nS();
    Cfq();
    hfq();
    Ifq();
    qd();
    s2();
    K7();
    bfq();
    Bfq();
    gfq();
    dfq();
    KVq();
    CO();
    zgA();
    cBA();
    cA();
    u6();
    N8();
    w01();
    vz();
    hf();
    w$();
    YVq();
    $Vq();
    _Vq();
    BG1();
    EK1();
    DVq();
    qEA();
    cuA();
    MVq();
    WVq();
    tgA();
    Ad1();
    yF1();
    OTA();
    ZVq();
    Nj6();
    Ex1();
    Rt();
    VVq();
    $P();
    bK1();
    tF1();
    d8();
    pB();
    mX();
    lq();
    nW1();
    Jf6();
    Qt();
    vd();
    ZN();
    Mq1();
    lq();
    Jc1();
    vVq();
    S9();
    EVq();
    q$();
    RVq();
    _BA();
    OBA();
    Et();
    AN();
    ra();
    cM();
    SVq();
    SjA();
    IVq();
    _51();
    lU1();
    wXA();
    $TA();
    G2();
    De();
    mVq();
    QVq();
    pVq();
    lVq();
    nVq();
    oVq();
    sVq();
    ANq();
    YNq();
    k2();
    wNq();
    HNq();
    $Lq();
    eIA();
    JLq();
    DLq();
    vLq();
    LLq();
    CLq();
    hLq();
    xLq();
    RM6();
    uLq();
    FLq();
    gLq();
    pLq();
    cLq();
    nLq();
    aLq();
    eLq();
    zRq();
    _Rq();
    jRq();
    PRq();
    c$();
    V7 = o(X1(), 1), dA = o(X1(), 1)
})
// @from(Ln 488738, Col 4)
GRq = {}
// @from(Ln 488743, Col 0)
function UWz(A) {
    let q = parseInt(A, 10);
    if (!isNaN(q) && q > 0) return q;
    let K = A.match(/github\.com\/[^/]+\/[^/]+\/pull\/(\d+)/);
    if (K?.[1]) return parseInt(K[1], 10);
    return null
}
// @from(Ln 488751, Col 0)
function pWz({
    commands: A,
    worktreePaths: q,
    initialTools: K,
    mcpClients: Y,
    dynamicMcpConfig: z,
    mcpCliEndpoint: w,
    debug: H,
    mainThreadAgentDefinition: $,
    autoConnectIdeFlag: O,
    strictMcpConfig: _ = !1,
    systemPrompt: J,
    appendSystemPrompt: X,
    initialSearchQuery: D,
    disableSlashCommands: j = !1,
    forkSession: M,
    taskListId: P,
    filterByPr: W
}) {
    let {
        rows: G
    } = Z8(), f = v6((t) => t.agentDefinitions), Z = L7(), [N, T] = eY.default.useState([]), [k, y] = eY.default.useState(!0), [B, S] = eY.default.useState(!1), [m, b] = eY.default.useState(!1), [g, U] = eY.default.useState(null), [x, p] = eY.default.useState(null), l = eY.default.useRef(null), r = eY.default.useMemo(() => {
        let t = N.filter((J1) => !J1.isSidechain);
        if (W !== void 0) {
            if (W === !0) t = t.filter((J1) => J1.prNumber !== void 0);
            else if (typeof W === "number") t = t.filter((J1) => J1.prNumber === W);
            else if (typeof W === "string") {
                let J1 = UWz(W);
                if (J1 !== null) t = t.filter((D1) => D1.prNumber === J1)
            }
        }
        return t
    }, [N, W]), s = Gc();
    eY.default.useEffect(() => {
        Dt(), nd1(q).then((t) => {
            l.current = t, T(t.logs), y(!1)
        }).catch((t) => {
            K1(t), y(!1)
        })
    }, [q]);
    let O1 = eY.default.useCallback((t) => {
            let J1 = l.current;
            if (!J1 || J1.nextIndex >= J1.allStatLogs.length) return;
            qY1(J1.allStatLogs, J1.nextIndex, t).then((D1) => {
                if (J1.nextIndex = D1.nextIndex, D1.logs.length === 0) return;
                T((Z1) => {
                    return [...Z1, ...D1.logs].map((a, A1) => ({
                        ...a,
                        value: A1
                    }))
                })
            })
        }, []),
        T1 = eY.default.useCallback((t) => {
            y(!0), (t ? CT6() : nd1(q)).then((D1) => {
                l.current = D1, T(D1.logs)
            }).catch((D1) => {
                K1(D1)
            }).finally(() => {
                y(!1)
            })
        }, [q]),
        N1 = eY.default.useCallback(() => {
            let t = !m;
            b(t), T1(t)
        }, [m, T1]);

    function j1() {
        process.exit(1)
    }
    async function q1(t) {
        S(!0);
        let J1 = ZN6(t, m, q);
        if (J1.isCrossProject) {
            if (!J1.isSameRepoWorktree) {
                await l0(J1.command), p(J1.command);
                return
            }
        }
        try {
            let D1 = await yt(t, void 0);
            if (!D1) throw Error("Failed to load conversation");
            if (D1.sessionId && !M) {
                if (mP(Yj(D1.sessionId)), t.fullPath) eV1(t.fullPath);
                if (bc()) _f1();
                await Hy(), Cq6(D1.sessionId)
            }
            let Z1 = $;
            if (!$ && D1.agentSetting) {
                let a = f?.activeAgents.find((A1) => A1.agentType === D1.agentSetting);
                if (a) {
                    if (Z1 = a, AC(a.agentType), Z((A1) => ({
                            ...A1,
                            agent: a.agentType
                        })), !HT() && a.model && a.model !== "inherit") CG(t9(a.model))
                }
            }
            let E1 = jQA(D1.agentName, D1.agentColor);
            if (E1) Z((a) => ({
                ...a,
                standaloneAgentContext: E1
            }));
            if (D1.customTitle) id1(D1.customTitle);
            T([]), U({
                messages: D1.messages,
                fileHistorySnapshots: D1.fileHistorySnapshots,
                agentName: D1.agentName,
                agentColor: D1.agentColor,
                mainThreadAgentDefinition: Z1
            })
        } catch (D1) {
            throw K1(D1), D1
        }
    }
    if (x) return eY.default.createElement(lWz, {
        command: x
    });
    if (g) return eY.default.createElement(TUA, {
        debug: H,
        commands: A,
        initialTools: K,
        initialMessages: g.messages,
        initialFileHistorySnapshots: g.fileHistorySnapshots,
        initialAgentName: g.agentName,
        initialAgentColor: g.agentColor,
        mcpClients: Y,
        dynamicMcpConfig: z,
        mcpCliEndpoint: w,
        strictMcpConfig: _,
        systemPrompt: J,
        appendSystemPrompt: X,
        mainThreadAgentDefinition: g.mainThreadAgentDefinition,
        autoConnectIdeFlag: O,
        disableSlashCommands: j,
        taskListId: P
    });
    if (k) return eY.default.createElement(I, null, eY.default.createElement(c4, null), eY.default.createElement(V, null, " Loading conversations…"));
    if (B) return eY.default.createElement(I, null, eY.default.createElement(c4, null), eY.default.createElement(V, null, " Resuming conversation…"));
    if (r.length === 0) return eY.default.createElement(dWz, null);
    return eY.default.createElement(WN6, {
        logs: r,
        maxHeight: G,
        onCancel: j1,
        onSelect: q1,
        onLogsChanged: s ? () => T1(m) : void 0,
        onLoadMore: O1,
        initialSearchQuery: D,
        showAllProjects: m,
        onToggleAllProjects: N1,
        onAgenticSearch: fN6
    })
}
// @from(Ln 488904, Col 0)
function dWz() {
    let A = e(2),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = {
        context: "Global"
    }, A[0] = q;
    else q = A[0];
    DA("app:interrupt", cWz, q);
    let K;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) K = eY.default.createElement(I, {
        flexDirection: "column"
    }, eY.default.createElement(V, null, "No conversations found to resume."), eY.default.createElement(V, {
        dimColor: !0
    }, "Press Ctrl+C to exit and start a new conversation.")), A[1] = K;
    else K = A[1];
    return K
}
// @from(Ln 488922, Col 0)
function cWz() {
    process.exit(1)
}
// @from(Ln 488926, Col 0)
function lWz(A) {
    let q = e(8),
        {
            command: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = [], q[0] = Y;
    else Y = q[0];
    eY.default.useEffect(iWz, Y);
    let z;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) z = eY.default.createElement(V, null, "This conversation is from a different directory."), q[1] = z;
    else z = q[1];
    let w;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) w = eY.default.createElement(V, null, "To resume, run:"), q[2] = w;
    else w = q[2];
    let H;
    if (q[3] !== K) H = eY.default.createElement(I, {
        flexDirection: "column"
    }, w, eY.default.createElement(V, null, " ", K)), q[3] = K, q[4] = H;
    else H = q[4];
    let $;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) $ = eY.default.createElement(V, {
        dimColor: !0
    }, "(Command copied to clipboard)"), q[5] = $;
    else $ = q[5];
    let O;
    if (q[6] !== H) O = eY.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, z, H, $), q[6] = H, q[7] = O;
    else O = q[7];
    return O
}
// @from(Ln 488960, Col 0)
function iWz() {
    let A = setTimeout(nWz, 100);
    return () => clearTimeout(A)
}
// @from(Ln 488965, Col 0)
function nWz() {
    process.exit(0)
}
// @from(Ln 488968, Col 4)
eY
// @from(Ln 488969, Col 4)
ZRq = v(() => {
    i1();
    m1();
    K7();
    x2();
    vUA();
    ebA();
    y6();
    N8();
    lq();
    YuA();
    G51();
    nW1();
    mq();
    OB();
    AuA();
    B6();
    lq();
    DL();
    qc1();
    Tj();
    e7();
    d8();
    Jc1();
    eY = o(X1(), 1)
})
// @from(Ln 488995, Col 0)
async function EUA(A, q, {
    concurrency: K = Number.POSITIVE_INFINITY,
    stopOnError: Y = !0,
    signal: z
} = {}) {
    return new Promise((w, H) => {
        if (A[Symbol.iterator] === void 0 && A[Symbol.asyncIterator] === void 0) throw TypeError(`Expected \`input\` to be either an \`Iterable\` or \`AsyncIterable\`, got (${typeof A})`);
        if (typeof q !== "function") throw TypeError("Mapper function is required");
        if (!(Number.isSafeInteger(K) && K >= 1 || K === Number.POSITIVE_INFINITY)) throw TypeError(`Expected \`concurrency\` to be an integer from 1 and up or \`Infinity\`, got \`${K}\` (${typeof K})`);
        let $ = [],
            O = [],
            _ = new Map,
            J = !1,
            X = !1,
            D = !1,
            j = 0,
            M = 0,
            P = A[Symbol.iterator] === void 0 ? A[Symbol.asyncIterator]() : A[Symbol.iterator](),
            W = () => {
                Z(z.reason)
            },
            G = () => {
                z?.removeEventListener("abort", W)
            },
            f = (T) => {
                w(T), G()
            },
            Z = (T) => {
                J = !0, X = !0, H(T), G()
            };
        if (z) {
            if (z.aborted) Z(z.reason);
            z.addEventListener("abort", W, {
                once: !0
            })
        }
        let N = async () => {
            if (X) return;
            let T = await P.next(),
                k = M;
            if (M++, T.done) {
                if (D = !0, j === 0 && !X) {
                    if (!Y && O.length > 0) {
                        Z(AggregateError(O));
                        return
                    }
                    if (X = !0, _.size === 0) {
                        f($);
                        return
                    }
                    let y = [];
                    for (let [B, S] of $.entries()) {
                        if (_.get(B) === fRq) continue;
                        y.push(S)
                    }
                    f(y)
                }
                return
            }
            j++, (async () => {
                try {
                    let y = await T.value;
                    if (X) return;
                    let B = await q(y, k);
                    if (B === fRq) _.set(k, B);
                    $[k] = B, j--, await N()
                } catch (y) {
                    if (Y) Z(y);
                    else {
                        O.push(y), j--;
                        try {
                            await N()
                        } catch (B) {
                            Z(B)
                        }
                    }
                }
            })()
        };
        (async () => {
            for (let T = 0; T < K; T++) {
                try {
                    await N()
                } catch (k) {
                    Z(k);
                    break
                }
                if (D || J) break
            }
        })()
    })
}
// @from(Ln 489087, Col 4)
fRq
// @from(Ln 489088, Col 4)
VRq = v(() => {
    fRq = Symbol("skip")
})
// @from(Ln 489092, Col 0)
function NRq(A) {
    let q = e(33),
        {
            servers: K,
            scope: Y,
            onDone: z
        } = A,
        w;
    if (q[0] !== K) w = Object.keys(K), q[0] = K, q[1] = w;
    else w = q[1];
    let H = w,
        $;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) $ = {}, q[2] = $;
    else $ = q[2];
    let [O, _] = BE6.useState($), J, X;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) J = () => {
        um().then((U) => {
            let {
                servers: x
            } = U;
            return _(x)
        })
    }, X = [], q[3] = J, q[4] = X;
    else J = q[3], X = q[4];
    BE6.useEffect(J, X);
    let D;
    if (q[5] !== O || q[6] !== H) D = H.filter((U) => O[U] !== void 0), q[5] = O, q[6] = H, q[7] = D;
    else D = q[7];
    let j = D,
        M = function(x) {
            let p = 0;
            for (let l of x) {
                let r = K[l];
                if (r) {
                    let s = l;
                    if (O[s] !== void 0) {
                        let O1 = 1;
                        while (O[`${l}_${O1}`] !== void 0) O1++;
                        s = `${l}_${O1}`
                    }
                    ht(s, r, Y), p++
                }
            }
            G(p)
        },
        [P] = T7(),
        W;
    if (q[8] !== z || q[9] !== Y || q[10] !== P) W = (U) => {
        if (U > 0) Q4(`
${k8("success",P)(`Successfully imported ${U} MCP server${U!==1?"s":""} to ${Y} config.`)}
`);
        else Q4(`
No servers were imported.`);
        z(), nK()
    }, q[8] = z, q[9] = Y, q[10] = P, q[11] = W;
    else W = q[11];
    let G = W,
        f;
    if (q[12] !== G) f = () => {
        G(0)
    }, q[12] = G, q[13] = f;
    else f = q[13];
    let Z = f,
        N = `Found ${H.length} MCP server${H.length!==1?"s":""} in Claude Desktop.`,
        T;
    if (q[14] !== j.length) T = j.length > 0 && FE.default.createElement(V, {
        color: "warning"
    }, "Note: Some servers already exist with the same name. If selected, they will be imported with a numbered suffix."), q[14] = j.length, q[15] = T;
    else T = q[15];
    let k;
    if (q[16] === Symbol.for("react.memo_cache_sentinel")) k = FE.default.createElement(V, null, "Please select the servers you want to import:"), q[16] = k;
    else k = q[16];
    let y, B;
    if (q[17] !== j || q[18] !== H) y = H.map((U) => ({
        label: `${U}${j.includes(U)?" (already exists)":""}`,
        value: U
    })), B = H.filter((U) => !j.includes(U)), q[17] = j, q[18] = H, q[19] = y, q[20] = B;
    else y = q[19], B = q[20];
    let S;
    if (q[21] !== M || q[22] !== y || q[23] !== B) S = FE.default.createElement(PZ1, {
        options: y,
        defaultValue: B,
        onSubmit: M
    }), q[21] = M, q[22] = y, q[23] = B, q[24] = S;
    else S = q[24];
    let m;
    if (q[25] !== Z || q[26] !== S || q[27] !== N || q[28] !== T) m = FE.default.createElement(w8, {
        title: "Import MCP Servers from Claude Desktop",
        subtitle: N,
        color: "success",
        onCancel: Z,
        hideInputGuide: !0
    }, T, k, S), q[25] = Z, q[26] = S, q[27] = N, q[28] = T, q[29] = m;
    else m = q[29];
    let b;
    if (q[30] === Symbol.for("react.memo_cache_sentinel")) b = FE.default.createElement(I, {
        paddingX: 1
    }, FE.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, FE.default.createElement(oA, null, FE.default.createElement(YA, {
        shortcut: "Space",
        action: "select"
    }), FE.default.createElement(YA, {
        shortcut: "Enter",
        action: "confirm"
    }), FE.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))), q[30] = b;
    else b = q[30];
    let g;
    if (q[31] !== m) g = FE.default.createElement(FE.default.Fragment, null, m, b), q[31] = m, q[32] = g;
    else g = q[32];
    return g
}
// @from(Ln 489210, Col 4)
FE
// @from(Ln 489210, Col 8)
BE6
// @from(Ln 489211, Col 4)
TRq = v(() => {
    i1();
    m1();
    kV6();
    nW();
    w$();
    Bq();
    wK();
    BK();
    HK();
    FE = o(X1(), 1), BE6 = o(X1(), 1)
})
// @from(Ln 489223, Col 4)
ERq = {}
// @from(Ln 489227, Col 0)
async function rWz(A, q, K) {
    let z = Rp(100);
    lZ(A);
    let w = new Zd1({
        name: "claude/tengu",
        version: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION
    }, {
        capabilities: {
            tools: {}
        }
    });
    w.setRequestHandler(qb1, async () => {
        let $ = QD(),
            O = tD($);
        return {
            tools: await Promise.all(O.map(async (_) => {
                let J;
                if (_.outputSchema) {
                    let X = n51(_.outputSchema);
                    if (typeof X === "object" && X !== null && "type" in X && X.type === "object") J = X
                }
                return {
                    ..._,
                    description: await _.prompt({
                        getToolPermissionContext: async () => $,
                        tools: O,
                        agents: []
                    }),
                    inputSchema: n51(_.inputSchema),
                    outputSchema: J
                }
            }))
        }
    }), w.setRequestHandler(Tq1, async ({
        params: {
            name: $,
            arguments: O
        }
    }) => {
        let _ = QD(),
            J = tD(_),
            X = J.find((D) => D.name === $);
        if (!X) throw Error(`Tool ${$} not found`);
        try {
            if (!X.isEnabled()) throw Error(`Tool ${$} is not enabled`);
            let D = l3(),
                j = await X.validateInput?.(O ?? {}, {
                    abortController: Aq(),
                    options: {
                        commands: vRq,
                        tools: J,
                        mainLoopModel: D,
                        maxThinkingTokens: 0,
                        mcpClients: [],
                        mcpResources: {},
                        isNonInteractiveSession: !0,
                        debug: q,
                        verbose: K,
                        agentDefinitions: {
                            activeAgents: [],
                            allAgents: []
                        }
                    },
                    getAppState: async () => gG1(),
                    setAppState: () => {},
                    messages: [],
                    readFileState: z,
                    setInProgressToolUseIDs: () => {},
                    setResponseLength: () => {},
                    updateFileHistoryState: () => {},
                    updateAttributionState: () => {}
                });
            if (j && !j.result) throw Error(`Tool ${$} input is invalid: ${j.message}`);
            let M = await X.call(O ?? {}, {
                abortController: Aq(),
                options: {
                    commands: vRq,
                    tools: J,
                    mainLoopModel: l3(),
                    maxThinkingTokens: 0,
                    mcpClients: [],
                    mcpResources: {},
                    isNonInteractiveSession: !0,
                    debug: q,
                    verbose: K,
                    agentDefinitions: {
                        activeAgents: [],
                        allAgents: []
                    }
                },
                getAppState: async () => gG1(),
                setAppState: () => {},
                messages: [],
                readFileState: z,
                setInProgressToolUseIDs: () => {},
                setResponseLength: () => {},
                updateFileHistoryState: () => {},
                updateAttributionState: () => {}
            }, uX, qR({
                content: []
            }));
            return {
                content: [{
                    type: "text",
                    text: typeof M === "string" ? M : Q1(M.data)
                }]
            }
        } catch (D) {
            return K1(D instanceof Error ? D : Error(String(D))), {
                isError: !0,
                content: [{
                    type: "text",
                    text: (D instanceof Error ? eSA(D) : [String(D)]).filter(Boolean).join(`
`).trim() || "Error"
                }]
            }
        }
    });
    async function H() {
        let $ = new zc1;
        await w.connect($)
    }
    return await H()
}
// @from(Ln 489358, Col 4)
vRq
// @from(Ln 489359, Col 4)
kRq = v(() => {
    ABA();
    FFA();
    gD();
    kZ6();
    PJ();
    VI();
    e7();
    y6();
    pM();
    sZ6();
    HuA();
    N8();
    $P();
    G2();
    d8();
    m6();
    vRq = [NN6]
})
// @from(Ln 489378, Col 4)
yRq = {}
// @from(Ln 489386, Col 0)
function RRq() {
    let A = eA();
    if (!rI6.includes(A)) throw Error(`Unsupported platform: ${A} - Claude Desktop integration only works on macOS and WSL.`);
    if (A === "macos") return kUA.join(LRq.homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
    let q = process.env.USERPROFILE ? process.env.USERPROFILE.replace(/\\/g, "/") : null;
    if (q) {
        let Y = `/mnt/c${q.replace(/^[A-Z]:/,"")}/AppData/Roaming/Claude/claude_desktop_config.json`;
        if (b1().existsSync(Y)) return Y
    }
    try {
        if (b1().existsSync("/mnt/c/Users")) {
            let Y = b1().readdirSync("/mnt/c/Users");
            for (let z of Y) {
                if (z.name === "Public" || z.name === "Default" || z.name === "Default User" || z.name === "All Users") continue;
                let w = kUA.join("/mnt/c/Users", z.name, "AppData", "Roaming", "Claude", "claude_desktop_config.json");
                if (b1().existsSync(w)) return w
            }
        }
    } catch (K) {
        K1(K instanceof Error ? K : Error(String(K)))
    }
    throw Error("Could not find Claude Desktop config file in Windows. Make sure Claude Desktop is installed on Windows.")
}
// @from(Ln 489410, Col 0)
function oWz() {
    if (!rI6.includes(eA())) throw Error("Unsupported platform - Claude Desktop integration only works on macOS and WSL.");
    try {
        let A = RRq();
        if (!b1().existsSync(A)) return {};
        let q = b1().readFileSync(A, {
                encoding: "utf8"
            }),
            K = j9(q);
        if (!K || typeof K !== "object") return {};
        let Y = K.mcpServers;
        if (!Y || typeof Y !== "object") return {};
        let z = {};
        for (let [w, H] of Object.entries(Y)) {
            if (!H || typeof H !== "object") continue;
            let $ = YF6.safeParse(H);
            if ($.success) z[w] = $.data
        }
        return z
    } catch (A) {
        return K1(A instanceof Error ? A : Error(String(A))), {}
    }
}
// @from(Ln 489433, Col 4)
CRq = v(() => {
    AH();
    y6();
    YA1();
    x3();
    _8()
})
// @from(Ln 489440, Col 4)
G11 = {}
// @from(Ln 489456, Col 0)
async function SRq(A, q) {
    try {
        let K = await iR(A, q);
        if (K.type === "connected") return "✓ Connected";
        else if (K.type === "needs-auth") return "! Needs authentication";
        else return "✗ Failed to connect"
    } catch (K) {
        return "✗ Connection error"
    }
}
// @from(Ln 489466, Col 0)
async function tWz({
    debug: A,
    verbose: q
}) {
    let K = aWz();
    if (c("tengu_mcp_start", {}), !sWz(K)) console.error(`Error: Directory ${K} does not exist`), process.exit(1);
    try {
        let {
            setup: Y
        } = await Promise.resolve().then(() => (jv6(), Dv6));
        await Y(K, "default", !1, !1, void 0, !1);
        let {
            startMCPServer: z
        } = await Promise.resolve().then(() => (kRq(), ERq));
        await z(K, A ?? !1, q ?? !1)
    } catch (Y) {
        console.error("Error: Failed to start MCP server:", Y), process.exit(1)
    }
}
// @from(Ln 489485, Col 0)
async function eWz(A, q) {
    let K = lR(A),
        Y = () => {
            if (K && (K.type === "sse" || K.type === "http")) IG6(A, K), Cr4(A, K)
        };
    try {
        if (q.scope) {
            let _ = HG1(q.scope);
            c("tengu_mcp_delete", {
                name: A,
                scope: _
            }), FyA(A, _), Y(), process.stdout.write(`Removed MCP server ${A} from ${_} config
`), process.stdout.write(`File modified: ${KG(_)}
`), process.exit(0)
        }
        let z = sz(),
            w = f6(),
            {
                servers: H
            } = xJ("project"),
            $ = !!H[A],
            O = [];
        if (z.mcpServers?.[A]) O.push("local");
        if ($) O.push("project");
        if (w.mcpServers?.[A]) O.push("user");
        if (O.length === 0) process.stderr.write(`No MCP server found with name: "${A}"
`), process.exit(1);
        else if (O.length === 1) {
            let _ = O[0];
            c("tengu_mcp_delete", {
                name: A,
                scope: _
            }), FyA(A, _), Y(), process.stdout.write(`Removed MCP server "${A}" from ${_} config
`), process.stdout.write(`File modified: ${KG(_)}
`), process.exit(0)
        } else process.stderr.write(`MCP server "${A}" exists in multiple scopes:
`), O.forEach((_) => {
            process.stderr.write(`  - ${cg1(_)} (${KG(_)})
`)
        }), process.stderr.write(`
To remove from a specific scope, use:
`), O.forEach((_) => {
            process.stderr.write(`  claude mcp remove "${A}" -s ${_}
`)
        }), process.exit(1)
    } catch (z) {
        process.stderr.write(`${z.message}
`), process.exit(1)
    }
}
// @from(Ln 489535, Col 0)
async function AGz() {
    c("tengu_mcp_list", {});
    let {
        servers: A
    } = await um();
    if (Object.keys(A).length === 0) console.log("No MCP servers configured. Use `claude mcp add` to add a server.");
    else {
        console.log(`Checking MCP server health...
`);
        let q = Object.entries(A),
            K = await EUA(q, async ([Y, z]) => ({
                name: Y,
                server: z,
                status: await SRq(Y, z)
            }), {
                concurrency: vCA()
            });
        for (let {
                name: Y,
                server: z,
                status: w
            }
            of K)
            if (z.type === "sse") console.log(`${Y}: ${z.url} (SSE) - ${w}`);
            else if (z.type === "http") console.log(`${Y}: ${z.url} (HTTP) - ${w}`);
        else if (z.type === "claudeai-proxy") console.log(`${Y}: ${z.url} - ${w}`);
        else if (!z.type || z.type === "stdio") {
            let H = Array.isArray(z.args) ? z.args : [];
            console.log(`${Y}: ${z.command} ${H.join(" ")} - ${w}`)
        }
    }
    await nK(0)
}
// @from(Ln 489568, Col 0)
async function qGz(A) {
    c("tengu_mcp_get", {
        name: A
    });
    let q = lR(A);
    if (!q) console.error(`No MCP server found with name: ${A}`), process.exit(1);
    console.log(`${A}:`), console.log(`  Scope: ${cg1(q.scope)}`);
    let K = await SRq(A, q);
    if (console.log(`  Status: ${K}`), q.type === "sse") {
        if (console.log("  Type: sse"), console.log(`  URL: ${q.url}`), q.headers) {
            console.log("  Headers:");
            for (let [Y, z] of Object.entries(q.headers)) console.log(`    ${Y}: ${z}`)
        }
        if (q.oauth?.clientId) {
            let z = !!zCA(A, q)?.clientSecret,
                w = ["client_id configured"];
            if (z) w.push("client_secret configured");
            if (q.oauth.callbackPort) w.push(`callback_port ${q.oauth.callbackPort}`);
            console.log(`  OAuth: ${w.join(", ")}`)
        }
    } else if (q.type === "http") {
        if (console.log("  Type: http"), console.log(`  URL: ${q.url}`), q.headers) {
            console.log("  Headers:");
            for (let [Y, z] of Object.entries(q.headers)) console.log(`    ${Y}: ${z}`)
        }
        if (q.oauth?.clientId) {
            let z = !!zCA(A, q)?.clientSecret,
                w = ["client_id configured"];
            if (z) w.push("client_secret configured");
            if (q.oauth.callbackPort) w.push(`callback_port ${q.oauth.callbackPort}`);
            console.log(`  OAuth: ${w.join(", ")}`)
        }
    } else if (q.type === "stdio") {
        console.log("  Type: stdio"), console.log(`  Command: ${q.command}`);
        let Y = Array.isArray(q.args) ? q.args : [];
        if (console.log(`  Args: ${Y.join(" ")}`), q.env) {
            console.log("  Environment:");
            for (let [z, w] of Object.entries(q.env)) console.log(`    ${z}=${w}`)
        }
    }
    console.log(`
To remove this server, run: claude mcp remove "${A}" -s ${q.scope}`), await nK(0)
}
// @from(Ln 489611, Col 0)
async function KGz(A, q, K) {
    try {
        let Y = HG1(K.scope),
            z = j9(q),
            H = K.clientSecret && z && typeof z === "object" && "type" in z && (z.type === "sse" || z.type === "http") && "url" in z && typeof z.url === "string" && "oauth" in z && z.oauth && typeof z.oauth === "object" && "clientId" in z.oauth ? await rg1() : void 0;
        ht(A, z, Y);
        let $ = z && typeof z === "object" && "type" in z ? String(z.type || "stdio") : "stdio";
        if (H && z && typeof z === "object" && "type" in z && (z.type === "sse" || z.type === "http") && "url" in z && typeof z.url === "string") og1(A, {
            type: z.type,
            url: z.url
        }, H);
        c("tengu_mcp_add", {
            scope: Y,
            source: "json",
            type: $
        }), console.log(`Added ${$} MCP server ${A} to ${Y} config`), process.exit(0)
    } catch (Y) {
        console.error(Y.message), process.exit(1)
    }
}
// @from(Ln 489631, Col 0)
async function YGz(A) {
    try {
        let q = HG1(A.scope),
            K = eA();
        c("tengu_mcp_add", {
            scope: q,
            platform: K,
            source: "desktop"
        });
        let {
            readClaudeDesktopMcpServers: Y
        } = await Promise.resolve().then(() => (CRq(), yRq)), z = Y();
        if (Object.keys(z).length === 0) console.log("No MCP servers found in Claude Desktop configuration or configuration file does not exist."), process.exit(0);
        let {
            unmount: w
        } = await _Z(mE6.default.createElement(u_, null, mE6.default.createElement(dX, null, mE6.default.createElement(NRq, {
            servers: z,
            scope: q,
            onDone: () => {
                w()
            }
        }))), {
            exitOnCtrlC: !0
        })
    } catch (q) {
        console.error(q.message), process.exit(1)
    }
}
// @from(Ln 489659, Col 0)
async function zGz() {
    c("tengu_mcp_reset_mcpjson_choices", {}), iH((A) => ({
        ...A,
        enabledMcpjsonServers: [],
        disabledMcpjsonServers: [],
        enableAllProjectMcpServers: !1
    })), console.log("All project-scoped (.mcp.json) server approvals and rejections have been reset."), console.log("You will be prompted for approval next time you start Claude Code."), process.exit(0)
}
// @from(Ln 489667, Col 4)
mE6
// @from(Ln 489668, Col 4)
Z11 = v(() => {
    VRq();
    m1();
    d8();
    qd();
    TRq();
    u6();
    nW();
    tX();
    g51();
    SW();
    cA();
    x3();
    AH();
    w$();
    mE6 = o(X1(), 1)
})
// @from(Ln 489685, Col 4)
Cy = {}
// @from(Ln 489703, Col 0)
function wl1(A, q) {
    K1(A instanceof Error ? A : Error(String(A))), console.error(`${l1.cross} Failed to ${q}: ${A instanceof Error?A.message:String(A)}`), process.exit(1)
}
// @from(Ln 489707, Col 0)
function wGz(A, q) {
    if (q.cowork) $T(!0);
    try {
        let K = nV6(A);
        if (console.log(`Validating ${K.fileType} manifest: ${K.filePath}
`), K.errors.length > 0) console.log(`${l1.cross} Found ${K.errors.length} error${K.errors.length===1?"":"s"}:
`), K.errors.forEach((Y) => {
            console.log(`  ${l1.pointer} ${Y.path}: ${Y.message}`)
        }), console.log("");
        if (K.warnings.length > 0) console.log(`${l1.warning} Found ${K.warnings.length} warning${K.warnings.length===1?"":"s"}:
`), K.warnings.forEach((Y) => {
            console.log(`  ${l1.pointer} ${Y.path}: ${Y.message}`)
        }), console.log("");
        if (K.success) {
            if (K.warnings.length > 0) console.log(`${l1.tick} Validation passed with warnings`);
            else console.log(`${l1.tick} Validation passed`);
            process.exit(0)
        } else console.log(`${l1.cross} Validation failed`), process.exit(1)
    } catch (K) {
        K1(K instanceof Error ? K : Error(String(K))), console.error(`${l1.cross} Unexpected error during validation: ${K instanceof Error?K.message:String(K)}`), process.exit(2)
    }
}
// @from(Ln 489729, Col 0)
async function HGz(A) {
    if (A.cowork) $T(!0);
    c("tengu_plugin_list_command", {});
    let q = uM(),
        {
            getEnabledPluginsWithScopes: K
        } = await Promise.resolve().then(() => (vZ1(), qKq)),
        Y = K(),
        z = Object.keys(q.plugins);
    if (A.json) {
        let {
            enabled: H,
            disabled: $,
            errors: O
        } = await iY(), _ = [...H, ...$], J = new Map(_.map((D) => [D.source, D])), X = [];
        for (let D of z.sort()) {
            let j = q.plugins[D];
            if (!j || j.length === 0) continue;
            let M = D.split("@")[0],
                P = O.filter((W) => W.source === D || ("plugin" in W) && W.plugin === M).map(TZ);
            for (let W of j) {
                let G = J.get(D),
                    f;
                if (G) {
                    let Z = G.mcpServers || await b0A(G);
                    if (Z && Object.keys(Z).length > 0) f = Z
                }
                X.push({
                    id: D,
                    version: W.version || "unknown",
                    scope: W.scope,
                    enabled: Y.has(D),
                    installPath: W.installPath,
                    installedAt: W.installedAt,
                    lastUpdated: W.lastUpdated,
                    projectPath: W.projectPath,
                    mcpServers: f,
                    errors: P.length > 0 ? P : void 0
                })
            }
        }
        if (A.available) {
            let D = [];
            try {
                let [j, M] = await Promise.all([n5(), fZ1()]), {
                    marketplaces: P
                } = await Wp(j);
                for (let {
                        name: W,
                        data: G
                    }
                    of P)
                    if (G)
                        for (let f of G.plugins) {
                            let Z = EB(f.name, W);
                            if (!BM(Z)) D.push({
                                pluginId: Z,
                                name: f.name,
                                description: f.description,
                                marketplaceName: W,
                                version: f.version,
                                source: f.source,
                                installCount: M?.get(Z)
                            })
                        }
            } catch {}
            console.log(Q1({
                installed: X,
                available: D
            }, null, 2))
        } else console.log(Q1(X, null, 2));
        process.exit(0)
    }
    if (z.length === 0) console.log("No plugins installed. Use `claude plugin install` to install a plugin."), process.exit(0);
    let {
        errors: w
    } = await iY();
    console.log(`Installed plugins:
`);
    for (let H of z.sort()) {
        let $ = q.plugins[H];
        if (!$ || $.length === 0) continue;
        let O = H.split("@")[0],
            _ = w.filter((J) => J.source === H || ("plugin" in J) && J.plugin === O);
        for (let J of $) {
            let X = Y.has(H),
                D = _.length > 0 ? `${l1.cross} failed to load` : X ? `${l1.tick} enabled` : `${l1.cross} disabled`,
                j = J.version || "unknown",
                M = J.scope;
            console.log(`  ${l1.pointer} ${H}`), console.log(`    Version: ${j}`), console.log(`    Scope: ${M}`), console.log(`    Status: ${D}`);
            for (let P of _) console.log(`    Error: ${TZ(P)}`);
            console.log("")
        }
    }
    process.exit(0)
}
// @from(Ln 489825, Col 0)
async function $Gz(A, q) {
    if (q.cowork) $T(!0);
    try {
        let K = uV6(A);
        if (!K) console.error(`${l1.cross} Invalid marketplace source format. Try: owner/repo, https://..., or ./path`), process.exit(1);
        if ("error" in K) console.error(`${l1.cross} ${K.error}`), process.exit(1);
        let Y = K;
        console.log("Adding marketplace...");
        let {
            name: z
        } = await wE(Y, (H) => {
            console.log(H)
        });
        Uw();
        let w = Y.source;
        if (Y.source === "github") w = Y.repo;
        c("tengu_marketplace_added", {
            source_type: w
        }), console.log(`${l1.tick} Successfully added marketplace: ${z}`), process.exit(0)
    } catch (K) {
        wl1(K, "add marketplace")
    }
}
// @from(Ln 489848, Col 0)
async function OGz(A) {
    if (A.cowork) $T(!0);
    try {
        let q = await n5(),
            K = Object.keys(q);
        if (A.json) {
            let Y = K.sort().map((z) => {
                let w = q[z],
                    H = w?.source;
                return {
                    name: z,
                    source: H?.source,
                    ...H?.source === "github" && {
                        repo: H.repo
                    },
                    ...H?.source === "git" && {
                        url: H.url
                    },
                    ...H?.source === "url" && {
                        url: H.url
                    },
                    ...H?.source === "directory" && {
                        path: H.path
                    },
                    ...H?.source === "file" && {
                        path: H.path
                    },
                    installLocation: w?.installLocation
                }
            });
            console.log(Q1(Y, null, 2)), process.exit(0)
        }
        if (K.length === 0) console.log("No marketplaces configured"), process.exit(0);
        console.log(`Configured marketplaces:
`), K.forEach((Y) => {
            let z = q[Y];
            if (console.log(`  ${l1.pointer} ${Y}`), z?.source) {
                let w = z.source;
                if (w.source === "github") console.log(`    Source: GitHub (${w.repo})`);
                else if (w.source === "git") console.log(`    Source: Git (${w.url})`);
                else if (w.source === "url") console.log(`    Source: URL (${w.url})`);
                else if (w.source === "directory") console.log(`    Source: Directory (${w.path})`);
                else if (w.source === "file") console.log(`    Source: File (${w.path})`)
            }
            console.log("")
        }), process.exit(0)
    } catch (q) {
        wl1(q, "list marketplaces")
    }
}
// @from(Ln 489898, Col 0)
async function _Gz(A, q) {
    if (q.cowork) $T(!0);
    try {
        await OG6(A), Uw(), c("tengu_marketplace_removed", {
            marketplace_name: A
        }), console.log(`${l1.tick} Successfully removed marketplace: ${A}`), process.exit(0)
    } catch (K) {
        wl1(K, "remove marketplace")
    }
}
// @from(Ln 489908, Col 0)
async function JGz(A, q) {
    if (q.cowork) $T(!0);
    try {
        if (A) console.log(`Updating marketplace: ${A}...`), await St(A, (K) => {
            console.log(K)
        }), Uw(), c("tengu_marketplace_updated", {
            marketplace_name: A
        }), console.log(`${l1.tick} Successfully updated marketplace: ${A}`), process.exit(0);
        else {
            let K = await n5(),
                Y = Object.keys(K);
            if (Y.length === 0) console.log("No marketplaces configured"), process.exit(0);
            console.log(`Updating ${Y.length} marketplace(s)...`), await Yn4(), Uw(), c("tengu_marketplace_updated_all", {
                count: Y.length
            }), console.log(`${l1.tick} Successfully updated ${Y.length} marketplace(s)`), process.exit(0)
        }
    } catch (K) {
        wl1(K, "update marketplace(s)")
    }
}
// @from(Ln 489928, Col 0)
async function XGz(A, q) {
    if (q.cowork) $T(!0);
    let K = q.scope || "user";
    if (q.cowork && K !== "user") console.error("--cowork can only be used with user scope"), process.exit(1);
    if (!ZP.includes(K)) console.error(`Invalid scope: ${K}. Must be one of: ${ZP.join(", ")}.`), process.exit(1);
    c("tengu_plugin_install_command", {
        plugin: A,
        scope: K
    }), await fDq(A, K)
}
// @from(Ln 489938, Col 0)
async function DGz(A, q) {
    if (q.cowork) $T(!0);
    let K = q.scope || "user";
    if (q.cowork && K !== "user") console.error("--cowork can only be used with user scope"), process.exit(1);
    if (!ZP.includes(K)) console.error(`Invalid scope: ${K}. Must be one of: ${ZP.join(", ")}.`), process.exit(1);
    c("tengu_plugin_uninstall_command", {
        plugin: A,
        scope: K
    }), await VDq(A, K)
}
// @from(Ln 489948, Col 0)
async function jGz(A, q) {
    if (q.cowork) $T(!0);
    let K = "user";
    if (q.scope) {
        if (!ZP.includes(q.scope)) process.stderr.write(`Invalid scope "${q.scope}". Valid scopes: ${ZP.join(", ")}
`), process.exit(1);
        K = q.scope
    }
    if (q.cowork && K !== "user") console.error("--cowork can only be used with user scope"), process.exit(1);
    c("tengu_plugin_enable_command", {
        plugin: A,
        scope: K
    }), await NDq(A, K)
}
// @from(Ln 489962, Col 0)
async function MGz(A, q) {
    if (q.all && A) process.stderr.write(`Cannot use --all with a specific plugin
`), process.exit(1);
    if (!q.all && !A) process.stderr.write(`Please specify a plugin name or use --all to disable all plugins
`), process.exit(1);
    if (q.cowork) $T(!0);
    if (q.all) {
        if (q.scope) process.stderr.write(`Cannot use --scope with --all
`), process.exit(1);
        c("tengu_plugin_disable_command", {
            plugin: "--all"
        }), await vDq();
        return
    }
    let K = "user";
    if (q.scope) {
        if (!ZP.includes(q.scope)) process.stderr.write(`Invalid scope "${q.scope}". Valid scopes: ${ZP.join(", ")}
`), process.exit(1);
        K = q.scope
    }
    if (q.cowork && K !== "user") console.error("--cowork can only be used with user scope"), process.exit(1);
    c("tengu_plugin_disable_command", {
        plugin: A,
        scope: K
    }), await TDq(A, K)
}