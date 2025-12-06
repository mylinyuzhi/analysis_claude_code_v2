
// @from(Start 13718371, End 13743708)
function WVA({
  commands: A,
  debug: Q,
  initialPrompt: B,
  initialTools: G,
  initialMessages: Z,
  initialFileHistorySnapshots: I,
  mcpClients: Y,
  dynamicMcpConfig: J,
  mcpCliEndpoint: W,
  autoConnectIdeFlag: X,
  strictMcpConfig: V = !1,
  systemPrompt: F,
  appendSystemPrompt: K,
  onBeforeQuery: D,
  onTurnComplete: H,
  disabled: C = !1,
  mainThreadAgentDefinition: E
}) {
  let [U, q] = OQ(), {
    toolPermissionContext: w,
    verbose: N,
    mcp: R,
    plugins: T,
    agentDefinitions: y
  } = U, v = Ja(), x = QB.useMemo(() => LC(w), [w]);
  S39();
  let [p, u] = QB.useState(J), e = QB.useCallback((a0) => {
    u(a0)
  }, [u]), [l, k] = QB.useState("prompt"), [m, o] = QB.useState(1), [IA, FA] = QB.useState(!1), {
    addNotification: zA
  } = vZ(), NA = P69(Y, R.clients), [OA, mA] = QB.useState(void 0), [wA, qA] = QB.useState(null), [KA, yA] = QB.useState(null), [oA, X1] = QB.useState(!1);
  YJ9(), XJ9(), GJ9({
    ideSelection: OA,
    mcpClients: NA,
    ideInstallationStatus: KA
  }), gY9({
    mcpClients: NA
  }), mY9(), AY1(), tY9(), AJ9(v), E39();
  let WA = QB.useMemo(() => {
    return [...x, ...G]
  }, [x, G]);
  $I1(), QB.useEffect(() => {
    sY9(q)
  }, [q]);
  let EA = CI1(WA, R.tools),
    MA = QB.useMemo(() => {
      if (!E) return EA;
      let {
        resolvedTools: a0
      } = Sn(E, EA, !1);
      return a0
    }, [E, EA]),
    DA = lW0(A, T.commands),
    $A = lW0(DA, R.commands);
  Lf2(R.clients), p59(R.clients, mA);
  let [TA, rA] = QB.useState("responding"), [iA, J1] = QB.useState([]), [w1, jA] = QB.useState(null), [eA, t1] = QB.useState(!1), [v1, F0] = QB.useState(0), [g0, p0] = QB.useState(void 0), n0 = QB.useCallback((a0) => {
    if (t1(a0), a0) F0(0)
  }, []);
  CI(() => {
    if (eA && iQ !== "tool-permission") F0((a0) => a0 + 100)
  }, 100);
  let [_1, zQ] = QB.useState(null);
  QB.useEffect(() => {
    if (_1?.notifications) _1.notifications.forEach((a0) => {
      zA({
        key: "auto-updater-notification",
        text: a0,
        priority: "low"
      })
    })
  }, [_1, zA]);
  let [W1, O1] = QB.useState(null), [a1, C0] = QB.useState([]), [v0, k0] = QB.useState([]), [f0, G0] = QB.useState(Z ?? []), [yQ, aQ] = QB.useState([]), [sQ, K0] = QB.useState(""), [mB, e2] = QB.useState("prompt"), [s8, K5] = QB.useState({}), [g6, c3] = QB.useState(0), [tZ, H7] = QB.useState(0), [H8, r5] = QB.useState(0), [nG, aG] = QB.useState(null), [U1, sA] = QB.useState(null), [E1, M1] = QB.useState(null), [k1, O0] = QB.useState(!1), [oQ, tB] = QB.useState(!1), [y9, Y6] = QB.useState(aX0()), [u9, r8] = QB.useState(N1().hasAcknowledgedCostThreshold), [$6, T8] = QB.useState(new Set), [i9, J6] = QB.useState("INSERT"), [N4, QG] = QB.useState(!1), [w6, b5] = QB.useState(!1), n9 = QB.useRef(!1), I8 = QB.useRef(null), [f5] = qB(), Y8 = QB.useCallback(() => {
    R39().then(async (a0) => {
      if (a0) {
        let eB = await a0.content({
          theme: f5
        });
        q((IB) => ({
          ...IB,
          spinnerTip: eB
        })), T39(a0)
      } else q((eB) => ({
        ...eB,
        spinnerTip: void 0
      }))
    })
  }, [q, f5]), d4 = QB.useCallback(() => {
    n0(!1), p0(void 0), H7(0), J1([]), aG(null), sA(null), M1(null), Y8(), X61()
  }, [n0, Y8]), a9 = q69(sQ), L4 = (!W1 || W1.showSpinner === !0) && a1.length === 0 && eA, o5 = W39(f0, eA, g6), m9 = QB.useMemo(() => ({
    ...o5,
    handleSelect: (a0) => {
      if (o5.handleSelect(a0), a0 === "bad" && nX0("feedback_survey_bad") || a0 === "good" && nX0("feedback_survey_good")) T1(a0 === "bad" ? "feedback_survey_bad" : "feedback_survey_good")
    }
  }), [o5]), d9 = V39(f0, eA);
  Q39({
    autoConnectIdeFlag: X,
    ideToInstallExtension: wA,
    setDynamicMcpConfig: u,
    setShowIdeOnboarding: X1,
    setIDEInstallationState: yA
  }), y39(I, U.fileHistory, (a0) => q((eB) => ({
    ...eB,
    fileHistory: a0
  })));
  let cA = QB.useCallback(async (a0, eB, IB) => {
      GA("tengu_session_resumed", {
        entrypoint: IB
      });
      let $9 = nMA(eB.messages),
        q6 = await wq("resume", a0);
      if ($9.push(...q6), Z91(eB), A01(eB), eB.fileHistorySnapshots) xYA(eB.fileHistorySnapshots, (C8) => {
        q((x4) => ({
          ...x4,
          fileHistory: C8
        }))
      }), p91(eB);
      if (xA($9, eB.projectPath ?? uQ()), d4(), jA(null), !gH()) await kJ();
      Y6(a0), zR(a0), await Fx(), G0(() => $9), O1(null), K0(""), aQ([])
    }, [d4, q]),
    YA = e1(),
    ZA = QB.useMemo(() => Ri(e1()), []),
    SA = QB.useRef((() => {
      let a0 = Gh(GY1);
      return a0.set(ZA, {
        content: JSON.stringify(U.todos[YA] || []),
        timestamp: 0,
        offset: void 0,
        limit: void 0
      }), a0
    })()),
    xA = QB.useCallback((a0, eB) => {
      let IB = xI1(a0, eB, GY1);
      SA.current = X01(SA.current, IB)
    }, []);
  QB.useEffect(() => {
    if (Z && Z.length > 0) xA(Z, uQ())
  }, []);
  let {
    status: dA,
    reverify: C1
  } = W69(), [j1, T1] = QB.useState(null), [m1, p1] = QB.useState(null), [D0, GQ] = QB.useState(!1), lQ = !eA && oQ;

  function lB() {
    if (D0 || m1) return;
    if (k1) return "message-selector";
    if (v0[0]) return "sandbox-permission";
    let a0 = !W1 || W1.shouldContinueAnimation;
    if (a0 && a1[0]) return "tool-permission";
    if (a0 && U.elicitation.queue[0]) return "elicitation";
    if (a0 && lQ) return "cost";
    if (a0 && oA) return "ide-onboarding";
    return
  }
  let iQ = lB();

  function s2() {
    if (iQ === "elicitation") return;
    if (d4(), iQ === "tool-permission") a1[0]?.onAbort(), C0([]);
    else w1?.abort()
  }
  let P8 = QB.useCallback(async () => {
    let a0 = await VI1(sQ, 0, async () => new Promise((eB) => q((IB) => {
      return eB(IB), IB
    })), q);
    if (!a0) return;
    K0(a0.text), e2("prompt")
  }, [q, K0, e2, sQ]);
  D69(C0, s2, k1 || N4, l, w1?.signal, P8, i9, W1?.isLocalJSXCommand, w6), QB.useEffect(() => {
    if (hK() >= 5 && !oQ && !u9) {
      if (GA("tengu_cost_threshold_reached", {}), jiA()) tB(!0)
    }
  }, [f0, oQ, u9]);
  let C7 = QB.useCallback(async (a0) => {
    return new Promise((eB) => {
      k0((IB) => [...IB, {
        hostPattern: a0,
        resolvePromise: eB
      }])
    })
  }, []);
  if (nQ.isSandboxingEnabled()) nQ.initialize(C7).catch((a0) => {
    process.stderr.write(`
❌ Sandbox Error: ${a0 instanceof Error?a0.message:String(a0)}
`), l5(1, "other")
  });
  let D5 = QB.useCallback((a0) => {
      q((eB) => ({
        ...eB,
        toolPermissionContext: a0
      })), setImmediate(() => {
        C0((eB) => {
          return eB.forEach((IB) => {
            IB.recheckPermission()
          }), eB
        })
      })
    }, [q, C0]),
    AW = U69(C0, D5),
    u6 = QB.useCallback((a0, eB, IB, $9, q6, C8) => {
      return {
        abortController: IB,
        options: {
          commands: $A,
          tools: MA,
          debug: Q,
          verbose: N,
          mainLoopModel: C8,
          maxThinkingTokens: q6 ?? (U.thinkingEnabled ? Xf(eB, void 0) : 0),
          mcpClients: NA,
          mcpResources: R.resources,
          ideInstallationStatus: KA,
          isNonInteractiveSession: !1,
          hasAppendSystemPrompt: !1,
          dynamicMcpConfig: p,
          theme: f5,
          agentDefinitions: y
        },
        getAppState() {
          return new Promise((x4) => {
            q((J8) => {
              return x4(J8), {
                ...J8,
                toolPermissionContext: {
                  ...J8.toolPermissionContext,
                  alwaysAllowRules: {
                    ...J8.toolPermissionContext.alwaysAllowRules,
                    command: $9
                  }
                }
              }
            })
          })
        },
        setAppState: q,
        messages: a0,
        setMessages: G0,
        updateFileHistoryState(x4) {
          q((J8) => ({
            ...J8,
            fileHistory: x4(J8.fileHistory)
          }))
        },
        openMessageSelector: () => {
          if (!C) O0(!0)
        },
        onChangeAPIKey: C1,
        readFileState: SA.current,
        setToolJSX: O1,
        addNotification: zA,
        onChangeDynamicMcpConfig: e,
        onInstallIDEExtension: qA,
        nestedMemoryAttachmentTriggers: new Set,
        setResponseLength: H7,
        setStreamMode: rA,
        setSpinnerMessage: aG,
        setSpinnerColor: sA,
        setSpinnerShimmerColor: M1,
        setInProgressToolUseIDs: T8,
        agentId: YA,
        resume: cA
      }
    }, [$A, MA, Q, N, NA, R.resources, KA, p, f5, y, q, C1, zA, e, YA, cA, U.thinkingEnabled, C]),
    QW = QB.useCallback((a0) => {
      K0(a0)
    }, [sQ, q]),
    NY = QB.useCallback(async (a0, eB, IB, $9, q6, C8, x4) => {
      let J8 = eB.filter((W8) => W8.type === "user" || W8.type === "assistant").pop();
      if ($9) {
        Oh.handleQueryStart(NA);
        let W8 = uU(NA);
        if (W8) JB2(W8)
      }
      if (n7A(), J8?.type === "user" && typeof J8.message.content === "string") yeB(J8.message.content);
      if (!$9) {
        d4(), jA(null);
        return
      }
      let x9 = u6(a0, eB, IB, q6, x4, C8);
      s7("query_context_loading_start");
      let [, T4, N3, KV] = await Promise.all([LX0(w, q), Tn(MA, C8, Array.from(w.additionalWorkingDirectories.keys()), NA, w), DK(), iD()]);
      s7("query_context_loading_end");
      let IF = HJ9({
        mainThreadAgentDefinition: E,
        toolUseContext: x9,
        customSystemPrompt: F,
        defaultSystemPrompt: T4,
        appendSystemPrompt: K
      });
      s7("query_query_start");
      for await (let W8 of O$({
        messages: a0,
        systemPrompt: IF,
        userContext: N3,
        systemContext: KV,
        canUseTool: AW,
        toolUseContext: x9,
        querySource: MjA()
      })) fQA(W8, (BG) => {
        G0((tW) => [...tW, BG])
      }, (BG) => H7((tW) => tW + BG.length), rA, J1);
      s7("query_end"), d4(), oP2(), H?.()
    }, [NA, d4, u6, w, q, MA, F, H, K, AW, E]),
    G4 = QB.useCallback(async (a0, eB, IB, $9, q6, C8, x4, J8) => {
      if (n9.current) return GA("tengu_concurrent_onquery_detected", {}), a0.filter((x9) => x9.type === "user").map((x9) => QWA(x9.message.content)).filter((x9) => x9 !== null).forEach((x9, T4) => {
        if (XI1({
            value: x9,
            mode: "prompt"
          }, q), T4 === 0) GA("tengu_concurrent_onquery_enqueued", {})
      }), n0(!1), {
        status: "skipped",
        reason: "already_running"
      };
      n9.current = !0, I8.current = a0;
      try {
        if (n0(!0), G0((T4) => [...T4, ...a0]), p0(void 0), H7(0), J1([]), x4 && J8) {
          let T4 = [...f0, ...a0];
          if (!await x4(J8, T4)) return {
            status: "skipped",
            reason: "blocked_by_callback"
          }
        }
        let x9 = await new Promise((T4) => {
          G0((N3) => {
            return T4(N3), N3
          })
        });
        await NY(x9, a0, eB, IB, $9, q6, C8)
      } finally {
        n9.current = !1, r5(Date.now()), d4()
      }
      return {
        status: "completed"
      }
    }, [f0, NY, n0, q, d4]),
    BJ = QB.useCallback(async (a0, eB, IB) => {
      await dW0({
        input: a0,
        memoryPath: eB,
        helpers: IB,
        isLoading: eA,
        mode: mB,
        commands: $A,
        onInputChange: K0,
        onModeChange: e2,
        setPastedContents: K5,
        onSubmitCountChange: c3,
        setIDESelection: mA,
        setIsLoading: n0,
        setToolJSX: O1,
        getToolUseContext: u6,
        messages: f0,
        mainLoopModel: v,
        pastedContents: s8,
        ideSelection: OA,
        setUserInputOnProcessing: p0,
        setAbortController: jA,
        onQuery: G4,
        resetLoadingState: d4,
        thinkingTokens: a9.tokens,
        thinkingEnabled: U.thinkingEnabled,
        getAppState: () => new Promise(($9) => q((q6) => {
          return $9(q6), q6
        })),
        setAppState: q,
        querySource: MjA(),
        onBeforeQuery: D
      })
    }, [eA, mB, $A, K0, e2, K5, c3, mA, n0, O1, u6, f0, v, s8, OA, p0, jA, G4, d4, a9.tokens, U.thinkingEnabled, q, D]),
    sG = QB.useCallback(() => {
      T1(null), BJ("/issue", void 0, {
        setCursorOffset: () => {},
        clearBuffer: () => {},
        resetHistory: () => {}
      })
    }, [BJ]),
    jK = QB.useCallback(() => {
      T1(null)
    }, []),
    oW = QB.useCallback(() => {
      BJ("/rate-limit-options", void 0, {
        setCursorOffset: () => {},
        clearBuffer: () => {},
        resetHistory: () => {}
      })
    }, [BJ]);
  async function ZF() {
    C1();
    let a0 = gV();
    for (let IB of a0) SA.current.set(IB.path, {
      content: IB.content,
      timestamp: Date.now(),
      offset: void 0,
      limit: void 0
    });
    if (!B) return;
    n0(!0), H7(0), J1([]);
    let eB = YU0();
    jA(eB);
    try {
      let {
        messages: IB,
        shouldQuery: $9,
        allowedTools: q6
      } = await TP({
        input: B,
        mode: "prompt",
        setIsLoading: n0,
        setToolJSX: O1,
        context: u6(f0, f0, eB, [], void 0, v),
        ideSelection: OA,
        messages: f0,
        setUserInputOnProcessing: p0,
        querySource: MjA()
      });
      if (EG()) IB.filter(yn).forEach((C8) => {
        yYA((x4) => {
          q((J8) => ({
            ...J8,
            fileHistory: x4(J8.fileHistory)
          }))
        }, C8.uuid)
      });
      if (IB.length) {
        for (let KV of IB)
          if (KV.type === "user") Jf(B);
        if (G0((KV) => [...KV, ...IB]), !$9) {
          jA(null);
          return
        }
        let [C8, x4, J8] = await Promise.all([Tn(MA, v, Array.from(w.additionalWorkingDirectories.keys()), NA, w), DK(), iD()]), x9 = u6([...f0, ...IB], IB, eB, [], void 0, v), T4 = HJ9({
          mainThreadAgentDefinition: E,
          toolUseContext: x9,
          customSystemPrompt: F,
          defaultSystemPrompt: C8,
          appendSystemPrompt: K
        }), N3 = q6 ? {
          ...x9,
          async getAppState() {
            return {
              ...U,
              toolPermissionContext: {
                ...U.toolPermissionContext,
                alwaysAllowRules: {
                  ...U.toolPermissionContext.alwaysAllowRules,
                  command: q6
                }
              }
            }
          }
        } : x9;
        for await (let KV of O$({
          messages: [...f0, ...IB],
          systemPrompt: T4,
          userContext: x4,
          systemContext: J8,
          canUseTool: AW,
          toolUseContext: N3,
          querySource: MjA()
        })) fQA(KV, (IF) => {
          G0((W8) => [...W8, IF])
        }, (IF) => H7((W8) => W8 + IF.length), rA, J1);
        H?.()
      } else Jf(B);
      r8(N1().hasAcknowledgedCostThreshold || !1)
    } finally {
      d4()
    }
  }
  X8B(), Ef2(f0, f0.length === Z?.length), Y69(), QB.useEffect(() => {
    if (U.queuedCommands.length < 1) return;
    let a0 = N1();
    c0({
      ...a0,
      promptQueueUseCount: (a0.promptQueueUseCount ?? 0) + 1
    })
  }, [U.queuedCommands.length]), QB.useEffect(() => {
    DRA.recordUserActivity(), UFA()
  }, [sQ, g6]);
  let q3 = QB.useRef(new Set);
  QB.useEffect(() => {
    let a0 = new Set(f0.filter((IB) => lh(IB)).map((IB) => IB.uuid));
    if (Array.from(a0).some((IB) => !q3.current.has(IB))) {
      if (q3.current = a0, !gH()) kJ();
      Y6(aX0())
    }
  }, [f0]), QB.useEffect(() => {
    if (eA) return;
    if (g6 === 0) return;
    if (H8 === 0) return;
    let a0 = setTimeout(() => {
      if (zkA() > H8) return;
      let IB = Date.now() - H8;
      if (!eA && !W1 && iQ === void 0 && IB >= N1().messageIdleNotifThresholdMs) E0A({
        message: "Claude is waiting for your input",
        notificationType: "idle_prompt"
      })
    }, N1().messageIdleNotifThresholdMs);
    return () => clearTimeout(a0)
  }, [eA, W1, g6, iQ, H8]), t59(eA, H8), QB.useEffect(() => {
    return ZF(), () => {
      Oh.shutdown()
    }
  }, []);
  let {
    internal_eventEmitter: GJ
  } = Yp(), [BW, DN] = QB.useState(0);
  QB.useEffect(() => {
    let a0 = () => {
        process.stdout.write(`
Claude Code has been suspended. Run \`fg\` to bring Claude Code back.
Note: ctrl + z now suspends Claude Code, ctrl + _ undoes input.
`)
      },
      eB = () => {
        DN((IB) => IB + 1)
      };
    return GJ?.on("suspend", a0), GJ?.on("resume", eB), () => {
      GJ?.off("suspend", a0), GJ?.off("resume", eB)
    }
  }, [GJ]);
  let x$ = QB.useMemo(() => nJ(yQ).filter(ujA), [yQ]),
    H5 = QB.useMemo(() => {
      if (!eA) return null;
      let a0 = f0.filter((T4) => T4.type === "progress" && T4.data.type === "hook_progress" && (T4.data.hookEvent === "Stop" || T4.data.hookEvent === "SubagentStop"));
      if (a0.length === 0) return null;
      let eB = [...new Set(a0.map((T4) => T4.toolUseID))],
        IB = eB[eB.length - 1];
      if (!IB) return null;
      if (f0.some((T4) => T4.type === "system" && T4.subtype === "stop_hook_summary" && T4.toolUseID === IB)) return null;
      let q6 = a0.filter((T4) => T4.toolUseID === IB),
        C8 = q6.length,
        x4 = f0.filter((T4) => {
          if (T4.type !== "attachment") return !1;
          let N3 = T4.attachment;
          return "hookEvent" in N3 && (N3.hookEvent === "Stop" || N3.hookEvent === "SubagentStop") && "toolUseID" in N3 && N3.toolUseID === IB
        }).length,
        J8 = q6.find((T4) => T4.data.statusMessage)?.data.statusMessage;
      if (J8) return C8 === 1 ? `${J8}…` : `${J8}… ${x4}/${C8}`;
      let x9 = q6[0]?.data.hookEvent === "SubagentStop" ? "subagent stop" : "stop";
      return C8 === 1 ? `running ${x9} hook` : `running stop hooks… ${x4}/${C8}`
    }, [f0, eA]);
  d59(l, k, o, FA, kJ);
  let M4 = U.todos[YA];
  if (F69(M4), l === "transcript") return I9.createElement(I9.Fragment, null, I9.createElement(_QA, {
    messages: f0,
    normalizedMessageHistory: x$,
    tools: MA,
    verbose: !0,
    toolJSX: null,
    toolUseConfirmQueue: [],
    inProgressToolUseIDs: $6,
    isMessageSelectorVisible: !1,
    conversationId: y9,
    screen: l,
    agentDefinitions: y,
    screenToggleId: m,
    streamingToolUses: iA,
    showAllInTranscript: IA,
    onOpenRateLimitOptions: oW
  }), W1 && I9.createElement(S, {
    flexDirection: "column",
    width: "100%"
  }, W1.jsx), I9.createElement(bY9, null), I9.createElement(S, {
    alignItems: "center",
    alignSelf: "center",
    borderTopDimColor: !0,
    borderBottom: !1,
    borderLeft: !1,
    borderRight: !1,
    borderStyle: "single",
    marginTop: 1,
    paddingLeft: 2,
    width: "100%"
  }, I9.createElement($, {
    dimColor: !0
  }, "Showing detailed transcript · ctrl+o to toggle")));
  return I9.createElement(_Z1, {
    key: BW,
    dynamicMcpConfig: p,
    isStrictMcpConfig: V,
    mcpCliEndpoint: W
  }, I9.createElement(_QA, {
    messages: f0,
    normalizedMessageHistory: x$,
    tools: MA,
    verbose: N,
    toolJSX: W1,
    toolUseConfirmQueue: a1,
    inProgressToolUseIDs: $6,
    isMessageSelectorVisible: k1,
    conversationId: y9,
    screen: l,
    screenToggleId: m,
    streamingToolUses: iA,
    showAllInTranscript: IA,
    agentDefinitions: y,
    onOpenRateLimitOptions: oW
  }), I9.createElement(I39, null), W1 && I9.createElement(S, {
    flexDirection: "column",
    width: "100%"
  }, W1.jsx), I9.createElement(S, {
    flexDirection: "column",
    width: "100%"
  }, !C && g0 && I9.createElement(LQA, {
    param: {
      text: g0,
      type: "text"
    },
    addMargin: !0,
    verbose: N
  }), !1, L4 && I9.createElement(OO2, {
    mode: TA,
    spinnerTip: U.spinnerTip,
    currentResponseLength: tZ,
    overrideMessage: nG,
    spinnerSuffix: H5,
    verbose: N,
    elapsedTimeMs: v1,
    todos: M4,
    overrideColor: U1,
    overrideShimmerColor: E1,
    hasActiveTools: $6.size > 0
  }), !L4 && U.showExpandedTodos && I9.createElement(S, {
    width: "100%",
    flexDirection: "column"
  }, I9.createElement(Yn, {
    todos: M4 || [],
    isStandalone: !0
  })), iQ === "sandbox-permission" && I9.createElement(v39, {
    key: v0[0].hostPattern.host,
    hostPattern: v0[0].hostPattern,
    onUserResponse: (a0) => {
      let {
        allow: eB,
        persistToSettings: IB
      } = a0, $9 = v0[0];
      if (!$9) return;
      let q6 = $9.hostPattern.host;
      if (IB) {
        let C8 = {
          type: "addRules",
          rules: [{
            toolName: $X,
            ruleContent: `domain:${q6}`
          }],
          behavior: eB ? "allow" : "deny",
          destination: "localSettings"
        };
        q((x4) => ({
          ...x4,
          toolPermissionContext: UF(x4.toolPermissionContext, C8)
        })), Iv(C8), nQ.refreshConfig()
      }
      k0((C8) => {
        return C8.filter((x4) => x4.hostPattern.host === q6).forEach((x4) => x4.resolvePromise(eB)), C8.filter((x4) => x4.hostPattern.host !== q6)
      })
    }
  }), iQ === "tool-permission" && I9.createElement(cd2, {
    key: a1[0]?.toolUseID,
    onDone: () => C0(([a0, ...eB]) => eB),
    onReject: P8,
    toolUseConfirm: a1[0],
    toolUseContext: u6(f0, f0, w1 ?? o9(), [], void 0, v),
    verbose: N
  }), iQ === "elicitation" && I9.createElement(ad2, {
    serverName: U.elicitation.queue[0].serverName,
    request: U.elicitation.queue[0].request,
    onResponse: (a0, eB) => {
      let IB = U.elicitation.queue[0];
      if (IB) q(($9) => ({
        ...$9,
        elicitation: {
          queue: $9.elicitation.queue.slice(1)
        }
      })), IB.respond({
        action: a0,
        content: eB
      })
    },
    signal: U.elicitation.queue[0].signal
  }), iQ === "cost" && I9.createElement(Df2, {
    onDone: () => {
      tB(!1), r8(!0);
      let a0 = N1();
      c0({
        ...a0,
        hasAcknowledgedCostThreshold: !0
      }), GA("tengu_cost_threshold_acknowledged", {})
    }
  }), iQ === "ide-onboarding" && I9.createElement(iQ2, {
    onDone: () => X1(!1),
    installationStatus: KA
  }), m1, !W1?.shouldHidePromptInput && !iQ && !D0 && !C && I9.createElement(I9.Fragment, null, j1 && I9.createElement(FJ9, {
    onRun: sG,
    onCancel: jK,
    reason: KJ9(j1)
  }), d9.state !== "closed" ? I9.createElement(CX0, {
    state: d9.state,
    handleSelect: d9.handleSelect,
    inputValue: sQ,
    setInputValue: K0,
    message: "How did that compaction go? (optional)"
  }) : I9.createElement(CX0, {
    state: m9.state,
    handleSelect: m9.handleSelect,
    inputValue: sQ,
    setInputValue: K0
  }), I9.createElement(G69, {
    debug: Q,
    ideSelection: OA,
    getToolUseContext: u6,
    toolPermissionContext: w,
    setToolPermissionContext: D5,
    apiKeyStatus: dA,
    commands: $A,
    agents: y.activeAgents,
    isLoading: eA,
    onExit: async () => {
      GQ(!0);
      let a0 = await hI1.call(() => {});
      p1(a0)
    },
    verbose: N,
    messages: f0,
    onAutoUpdaterResult: zQ,
    autoUpdaterResult: _1,
    input: sQ,
    onInputChange: QW,
    mode: mB,
    onModeChange: e2,
    submitCount: g6,
    onShowMessageSelector: () => O0((a0) => !a0),
    mcpClients: NA,
    pastedContents: s8,
    setPastedContents: K5,
    vimMode: i9,
    setVimMode: J6,
    showBashesDialog: N4,
    setShowBashesDialog: QG,
    onSubmit: BJ,
    isSearchingHistory: w6,
    setIsSearchingHistory: b5
  }))), iQ === "message-selector" && I9.createElement($f2, {
    messages: f0,
    onPreRestore: s2,
    onRestoreCode: async (a0) => {
      await iMA((eB) => {
        q((IB) => ({
          ...IB,
          fileHistory: eB(IB.fileHistory)
        }))
      }, a0.uuid)
    },
    onRestoreMessage: async (a0) => {
      let eB = f0.indexOf(a0),
        IB = f0.slice(0, eB);
      setImmediate(async () => {
        if (!gH()) await kJ();
        if (G0([...IB]), Y6(aX0()), q(($9) => ({
            ...$9,
            todos: {
              ...$9.todos,
              [YA]: a0.todos ?? []
            },
            promptSuggestion: {
              text: null,
              shownAt: 0
            }
          })), UYA(a0.todos ?? [], YA), typeof a0.message.content === "string") {
          let $9 = a0.message.content,
            q6 = B9($9, "bash-input"),
            C8 = B9($9, "command-name");
          if (q6) K0(q6), e2("bash");
          else if (C8) {
            let x4 = B9($9, "command-args") || "";
            K0(`${C8} ${x4}`), e2("prompt")
          } else K0($9), e2("prompt")
        } else if (Array.isArray(a0.message.content) && a0.message.content.length >= 2 && a0.message.content.some(($9) => $9.type === "image") && a0.message.content.some(($9) => $9.type === "text")) {
          let $9 = a0.message.content.find((C8) => C8.type === "text");
          if ($9 && $9.type === "text") K0($9.text), e2("prompt");
          let q6 = a0.message.content.filter((C8) => C8.type === "image");
          if (q6.length > 0) {
            let C8 = {};
            q6.forEach((x4, J8) => {
              if (x4.source.type === "base64") C8[J8 + 1] = {
                id: J8 + 1,
                type: "image",
                content: x4.source.data,
                mediaType: x4.source.media_type
              }
            }), K5(C8)
          }
        }
      })
    },
    onClose: () => O0(!1)
  }))
}
// @from(Start 13743713, End 13743715)
I9
// @from(Start 13743717, End 13743719)
QB
// @from(Start 13743721, End 13743730)
GY1 = 100
// @from(Start 13743736, End 13744589)
ZY1 = L(() => {
  hA();
  Hf2();
  JE();
  EU();
  h61();
  vM();
  _0();
  F0A();
  zf2();
  zTA();
  Mf2();
  pd2();
  sd2();
  Z69();
  DY();
  Pn();
  Ty();
  gE();
  M_();
  J69();
  zp();
  X69();
  K69();
  H69();
  $69();
  N69();
  cK();
  jQ();
  q0();
  cQ();
  Bh();
  nt();
  CU();
  kW();
  R69();
  fRA();
  Ca();
  j69();
  cW0();
  pW0();
  y69();
  nW0();
  _I1();
  HRA();
  N$A();
  c59();
  k1A();
  l59();
  yq();
  fP();
  S0A();
  ePA();
  z9();
  AWA();
  Ti();
  NE();
  S7();
  vYA();
  XX0();
  sU();
  e59();
  nY();
  B39();
  KX0();
  RQA();
  R1A();
  Ke1();
  L80();
  OZ();
  $QA();
  Y39();
  X39();
  F39();
  H39();
  z39();
  P39();
  _39();
  $J();
  x39();
  b39();
  fY9();
  mX0();
  uY9();
  dY9();
  rY9();
  II1();
  eY9();
  QJ9();
  ZJ9();
  JJ9();
  VJ9();
  DJ9();
  I9 = BA(VA(), 1), QB = BA(VA(), 1)
})
// @from(Start 13744638, End 13744848)
function IY1(A) {
  return {
    systemPrompt: A.systemPrompt,
    userContext: A.userContext,
    systemContext: A.systemContext,
    toolUseContext: A.toolUseContext,
    forkContextMessages: A.messages
  }
}
// @from(Start 13744850, End 13746460)
function BSA(A, Q) {
  let B = Q?.abortController ?? (Q?.shareAbortController ? A.abortController : JU0(A.abortController)),
    G = Q?.getAppState ? Q.getAppState : Q?.shareAbortController ? A.getAppState : async () => {
      let Z = await A.getAppState();
      if (Z.toolPermissionContext.shouldAvoidPermissionPrompts) return Z;
      return {
        ...Z,
        toolPermissionContext: {
          ...Z.toolPermissionContext,
          shouldAvoidPermissionPrompts: !0
        }
      }
    };
  return {
    readFileState: kAA(Q?.readFileState ?? A.readFileState),
    nestedMemoryAttachmentTriggers: new Set,
    toolDecisions: void 0,
    pendingSteeringAttachments: void 0,
    abortController: B,
    getAppState: G,
    setAppState: Q?.shareSetAppState ? A.setAppState : () => {},
    setMessages: () => {},
    setInProgressToolUseIDs: () => {},
    setResponseLength: Q?.shareSetResponseLength ? A.setResponseLength : () => {},
    updateFileHistoryState: () => {},
    addNotification: void 0,
    setToolJSX: void 0,
    setStreamMode: void 0,
    setSpinnerMessage: void 0,
    setSpinnerColor: void 0,
    setSpinnerShimmerColor: void 0,
    setSDKStatus: void 0,
    openMessageSelector: void 0,
    options: Q?.options ?? A.options,
    messages: Q?.messages ?? A.messages,
    agentId: Q?.agentId ?? SWA(),
    isSubAgent: !0,
    queryTracking: {
      chainId: E_3(),
      depth: (A.queryTracking?.depth ?? -1) + 1
    },
    fileReadingLimits: A.fileReadingLimits,
    userModified: A.userModified,
    criticalSystemReminder_EXPERIMENTAL: Q?.criticalSystemReminder_EXPERIMENTAL
  }
}
// @from(Start 13746461, End 13748129)
async function YY1({
  promptMessages: A,
  cacheSafeParams: Q,
  canUseTool: B,
  querySource: G,
  forkLabel: Z,
  overrides: I
}) {
  let Y = Date.now(),
    J = [],
    W = {
      ...bO
    },
    {
      systemPrompt: X,
      userContext: V,
      systemContext: F,
      toolUseContext: K,
      forkContextMessages: D
    } = Q,
    H = BSA(K, I),
    C = [...sX0(D), ...A];
  for await (let U of O$({
    messages: C,
    systemPrompt: X,
    userContext: V,
    systemContext: F,
    canUseTool: B,
    toolUseContext: H,
    querySource: G
  })) {
    if (U.type === "stream_event" || U.type === "stream_request_start") continue;
    if (U.type === "assistant") {
      let w = U.message.usage;
      if (w) W = vI1(W, {
        input_tokens: w.input_tokens ?? 0,
        cache_creation_input_tokens: w.cache_creation_input_tokens ?? 0,
        cache_read_input_tokens: w.cache_read_input_tokens ?? 0,
        output_tokens: w.output_tokens ?? 0,
        server_tool_use: {
          web_search_requests: w.server_tool_use?.web_search_requests ?? 0,
          web_fetch_requests: w.server_tool_use?.web_fetch_requests ?? 0
        },
        service_tier: w.service_tier ?? "standard",
        cache_creation: {
          ephemeral_1h_input_tokens: w.cache_creation?.ephemeral_1h_input_tokens ?? 0,
          ephemeral_5m_input_tokens: w.cache_creation?.ephemeral_5m_input_tokens ?? 0
        }
      })
    }
    J.push(U)
  }
  let E = Date.now() - Y;
  return z_3({
    forkLabel: Z,
    querySource: G,
    durationMs: E,
    messageCount: J.length,
    totalUsage: W,
    queryTracking: K.queryTracking
  }), {
    messages: J,
    totalUsage: W
  }
}
// @from(Start 13748131, End 13748988)
function z_3({
  forkLabel: A,
  querySource: Q,
  durationMs: B,
  messageCount: G,
  totalUsage: Z,
  queryTracking: I
}) {
  let Y = Z.input_tokens + Z.cache_creation_input_tokens + Z.cache_read_input_tokens,
    J = Y > 0 ? Z.cache_read_input_tokens / Y : 0;
  GA("tengu_fork_agent_query", {
    forkLabel: A,
    querySource: Q,
    durationMs: B,
    messageCount: G,
    inputTokens: Z.input_tokens,
    outputTokens: Z.output_tokens,
    cacheReadInputTokens: Z.cache_read_input_tokens,
    cacheCreationInputTokens: Z.cache_creation_input_tokens,
    serviceTier: Z.service_tier,
    cacheCreationEphemeral1hTokens: Z.cache_creation.ephemeral_1h_input_tokens,
    cacheCreationEphemeral5mTokens: Z.cache_creation.ephemeral_5m_input_tokens,
    cacheHitRate: J,
    ...I ? {
      queryChainId: I.chainId,
      queryDepth: I.depth
    } : {}
  })
}
// @from(Start 13748993, End 13749076)
JY1 = L(() => {
  Ca();
  fZ();
  cjA();
  q0();
  WY1();
  vM();
  Sy();
  OZ()
})
// @from(Start 13749124, End 13752974)
async function* XY1({
  agentDefinition: A,
  promptMessages: Q,
  toolUseContext: B,
  canUseTool: G,
  isAsync: Z,
  forkContextMessages: I,
  querySource: Y,
  override: J,
  model: W
}) {
  let X = await B.getAppState(),
    V = X.toolPermissionContext.mode,
    F = inA(A.model, B.options.mainLoopModel, W, V),
    K = J?.agentId ? J.agentId : SWA(),
    H = [...I ? sX0(I) : [], ...Q],
    C = I !== void 0 ? kAA(B.readFileState) : Gh(GY1),
    [E, U] = await Promise.all([J?.userContext ?? DK(), J?.systemContext ?? iD()]),
    q = A.permissionMode,
    N = q !== void 0 || Z ? async () => {
      let o = await B.getAppState(),
        IA = o.toolPermissionContext;
      if (q && o.toolPermissionContext.mode !== "bypassPermissions") IA = {
        ...IA,
        mode: q
      };
      if (Z) IA = {
        ...IA,
        shouldAvoidPermissionPrompts: !0
      };
      if (IA === o.toolPermissionContext) return o;
      return {
        ...o,
        toolPermissionContext: IA
      }
    }: B.getAppState, T = Sn(A, B.options.tools, Z).resolvedTools, y = Array.from(X.toolPermissionContext.additionalWorkingDirectories.keys()), v = J?.systemPrompt ? J.systemPrompt : await $_3(A, B, F, y), x = [], p, u = J?.abortController ? J.abortController : Z ? new AbortController : B.abortController, e = [];
  for await (let o of rX0(K, A.agentType, u.signal)) if (o.additionalContexts && o.additionalContexts.length > 0) e.push(...o.additionalContexts);
  if (e.length > 0) {
    let o = l9({
      type: "hook_additional_context",
      content: e,
      hookName: "SubagentStart",
      toolUseID: U_3(),
      hookEvent: "SubagentStart"
    });
    H.push(o)
  }
  let l = A.skills ?? [];
  if (l.length > 0) {
    let o = await OWA(),
      IA = [];
    for (let FA of l) {
      if (!ph(FA, o)) {
        g(`[Agent: ${A.agentType}] Warning: Skill '${FA}' specified in frontmatter was not found`, {
          level: "warn"
        });
        continue
      }
      let zA = Pq(FA, o);
      if (zA.type !== "prompt") {
        g(`[Agent: ${A.agentType}] Warning: Skill '${FA}' is not a prompt-based skill`, {
          level: "warn"
        });
        continue
      }
      IA.push({
        skillName: FA,
        skill: zA
      })
    }
    for (let {
        skillName: FA,
        skill: zA
      }
      of IA) {
      let NA = await zA.getPromptForCommand("", B);
      g(`[Agent: ${A.agentType}] Preloaded skill '${FA}'`);
      let OA = U60(FA, zA.progressMessage);
      H.push(R0({
        content: [{
          type: "text",
          text: OA
        }, ...NA]
      }))
    }
  }
  let k = {
      isNonInteractiveSession: Z ? !0 : B.options.isNonInteractiveSession ?? !1,
      hasAppendSystemPrompt: B.options.hasAppendSystemPrompt,
      tools: T,
      commands: [],
      debug: B.options.debug,
      verbose: B.options.verbose,
      mainLoopModel: F,
      maxThinkingTokens: Xf(H),
      mcpClients: B.options.mcpClients,
      mcpResources: B.options.mcpResources,
      agentDefinitions: B.options.agentDefinitions
    },
    m = BSA(B, {
      options: k,
      agentId: K,
      messages: H,
      readFileState: C,
      abortController: u,
      getAppState: N,
      shareSetAppState: !Z,
      shareSetResponseLength: !0,
      criticalSystemReminder_EXPERIMENTAL: A.criticalSystemReminder_EXPERIMENTAL
    });
  for await (let o of O$({
    messages: H,
    systemPrompt: v,
    userContext: E,
    systemContext: U,
    canUseTool: G,
    toolUseContext: m,
    querySource: Y
  })) if (o.type === "assistant" || o.type === "user" || o.type === "progress" || o.type === "system" && o.subtype === "compact_boundary") x.push(o), p = EJ9(x, K).catch((IA) => g(`Failed to record sidechain transcript: ${IA}`)), yield o;
  if (await p, u.signal.aborted) throw new WW;
  if ($O(A) && A.callback) A.callback()
}
// @from(Start 13752976, End 13753458)
function sX0(A) {
  let Q = new Set;
  for (let B of A)
    if (B?.type === "user") {
      let Z = B.message.content;
      if (Array.isArray(Z)) {
        for (let I of Z)
          if (I.type === "tool_result" && I.tool_use_id) Q.add(I.tool_use_id)
      }
    } return A.filter((B) => {
    if (B?.type === "assistant") {
      let Z = B.message.content;
      if (Array.isArray(Z)) return !Z.some((Y) => Y.type === "tool_use" && Y.id && !Q.has(Y.id))
    }
    return !0
  })
}
// @from(Start 13753459, End 13753651)
async function $_3(A, Q, B, G) {
  try {
    let Z = A.getSystemPrompt({
      toolUseContext: Q
    });
    return await GSA([Z], B, G)
  } catch (Z) {
    return await GSA([CJ9], B, G)
  }
}
// @from(Start 13753656, End 13753846)
WY1 = L(() => {
  Ca();
  RZ();
  Sy();
  Ty();
  Pn();
  t2();
  CU();
  S0A();
  fP();
  vM();
  ZY1();
  YO();
  IO();
  S7();
  V0();
  bjA();
  R9();
  cE();
  cQ();
  vRA();
  JY1()
})
// @from(Start 13753849, End 13755111)
function zJ9({
  agentType: A,
  description: Q,
  toolUseCount: B,
  tokens: G,
  color: Z,
  isLast: I,
  isResolved: Y,
  isError: J,
  isAsync: W = !1,
  shouldAnimate: X,
  lastToolInfo: V,
  hideType: F = !1
}) {
  let K = I ? "└─" : "├─",
    D = () => {
      if (!Y) return V || "Initializing…";
      return W ? "Launched" : "Done"
    };
  return b6.createElement(S, {
    flexDirection: "column"
  }, b6.createElement(S, {
    paddingLeft: 3
  }, b6.createElement($, {
    dimColor: !Y
  }, K, " ", F ? b6.createElement($, {
    bold: !0
  }, Q || A) : b6.createElement(b6.Fragment, null, b6.createElement($, {
    bold: !0,
    backgroundColor: Z,
    color: Z ? "inverseText" : void 0
  }, A), Q && b6.createElement($, null, " (", Q, ")")), " · ", W && Y ? b6.createElement($, null, "Running in background") : b6.createElement(b6.Fragment, null, b6.createElement($, {
    bold: !0
  }, B), " tool", " ", B === 1 ? "use" : "uses"), G !== null && b6.createElement(b6.Fragment, null, " · ", JZ(G), " tokens"))), b6.createElement(S, {
    paddingLeft: 3,
    flexDirection: "row"
  }, b6.createElement($, {
    dimColor: !Y
  }, I ? "   " : "│  "), b6.createElement($, {
    dimColor: !0
  }, "⎿ "), b6.createElement($, {
    dimColor: !0
  }, D())))
}
// @from(Start 13755116, End 13755118)
b6
// @from(Start 13755124, End 13755169)
UJ9 = L(() => {
  hA();
  b6 = BA(VA(), 1)
})
// @from(Start 13755172, End 13755479)
function VY1({
  prompt: A,
  theme: Q,
  dim: B = !1
}) {
  return BQ.createElement(S, {
    flexDirection: "column"
  }, BQ.createElement($, {
    color: "success",
    bold: !0
  }, "Prompt:"), BQ.createElement(S, {
    paddingLeft: 2
  }, BQ.createElement($, {
    dimColor: B
  }, Q ? fD(A, Q) : A)))
}
// @from(Start 13755481, End 13755830)
function $J9({
  content: A,
  theme: Q
}) {
  return BQ.createElement(S, {
    flexDirection: "column"
  }, BQ.createElement($, {
    color: "success",
    bold: !0
  }, "Response:"), A.map((B, G) => BQ.createElement(S, {
    key: G,
    paddingLeft: 2,
    marginTop: G === 0 ? 0 : 1
  }, BQ.createElement($, null, Q ? fD(B.text, Q) : B.text))))
}
// @from(Start 13755832, End 13757798)
function wJ9(A, Q, {
  tools: B,
  verbose: G,
  theme: Z
}) {
  if (A.status === "async_launched") {
    let {
      prompt: C
    } = A;
    return BQ.createElement(S, {
      flexDirection: "column"
    }, BQ.createElement(S0, {
      height: 1
    }, BQ.createElement($, null, "Backgrounded agent", !G && tA.dim(C ? " (down arrow ↓ to manage · ctrl+o to expand)" : " (down arrow ↓ to manage)"))), G && C && BQ.createElement(S0, null, BQ.createElement(VY1, {
      prompt: C,
      theme: Z
    })))
  }
  if (A.status !== "completed") return null;
  let {
    agentId: I,
    totalDurationMs: Y,
    totalToolUseCount: J,
    totalTokens: W,
    usage: X,
    content: V,
    prompt: F
  } = A, D = `Done (${[J===1?"1 tool use":`${J} tool uses`,JZ(W)+" tokens",eC(Y)].join(" · ")})`, H = uD({
    content: D,
    usage: X
  });
  return BQ.createElement(S, {
    flexDirection: "column"
  }, !1, G && F && BQ.createElement(S0, null, BQ.createElement(VY1, {
    prompt: F,
    theme: Z
  })), G ? BQ.createElement(Bo1, null, Q.map((C) => BQ.createElement(S0, {
    key: C.uuid
  }, BQ.createElement(xg, {
    message: C.data.message,
    messages: C.data.normalizedMessages,
    addMargin: !1,
    tools: B,
    verbose: G,
    erroredToolUseIDs: new Set,
    inProgressToolUseIDs: new Set,
    resolvedToolUseIDs: new Set,
    progressMessagesForMessage: Q,
    shouldAnimate: !1,
    shouldShowDot: !1,
    isTranscriptMode: !1,
    isStatic: !0
  })))) : null, G && V && V.length > 0 && BQ.createElement(S0, null, BQ.createElement($J9, {
    content: V,
    theme: Z
  })), BQ.createElement(S0, {
    height: 1
  }, BQ.createElement(xg, {
    message: H,
    messages: nJ([H]),
    addMargin: !1,
    tools: B,
    verbose: G,
    erroredToolUseIDs: new Set,
    inProgressToolUseIDs: new Set,
    resolvedToolUseIDs: new Set,
    progressMessagesForMessage: [],
    shouldAnimate: !1,
    shouldShowDot: !1,
    isTranscriptMode: !1,
    isStatic: !0
  })))
}
// @from(Start 13757800, End 13757891)
function qJ9({
  description: A,
  prompt: Q
}) {
  if (!A || !Q) return null;
  return A
}
// @from(Start 13757893, End 13760285)
function FY1(A, {
  tools: Q,
  verbose: B,
  terminalSize: G,
  inProgressToolCallCount: Z
}) {
  if (!A.length) return BQ.createElement(S0, {
    height: 1
  }, BQ.createElement($, {
    dimColor: !0
  }, N_3));
  let I = (Z ?? 1) * w_3 + q_3,
    Y = !B && G && G.rows && G.rows < I,
    J = () => {
      let D = A.filter((E) => {
          return E.data.message.message.content.some((q) => q.type === "tool_use")
        }).length,
        H = [...A].reverse().find((E) => E.data.message.type === "assistant"),
        C = null;
      if (H?.data.message.type === "assistant") {
        let E = H.data.message.message.usage;
        C = (E.cache_creation_input_tokens ?? 0) + (E.cache_read_input_tokens ?? 0) + E.input_tokens + E.output_tokens
      }
      return {
        toolUseCount: D,
        tokens: C
      }
    };
  if (Y) {
    let {
      toolUseCount: D,
      tokens: H
    } = J();
    return BQ.createElement(S0, {
      height: 1
    }, BQ.createElement($, {
      dimColor: !0
    }, "In progress… · ", BQ.createElement($, {
      bold: !0
    }, D), " tool", " ", D === 1 ? "use" : "uses", H && ` · ${JZ(H)} tokens`, " · (ctrl+o to expand)"))
  }
  let W = A.filter((D) => {
      return D.data.message.message.content.some((C) => C.type === "tool_use")
    }).length,
    X = B ? A : A.slice(-oX0),
    V = X.filter((D) => {
      return D.data.message.message.content.some((C) => C.type === "tool_use")
    }).length,
    F = W - V;
  if (!B && A.length > oX0) X = A.slice(-oX0 + 1);
  let K = A[0]?.data.prompt;
  return BQ.createElement(S0, null, BQ.createElement(S, {
    flexDirection: "column"
  }, BQ.createElement(Bo1, null, B && K && BQ.createElement(S, {
    marginBottom: 1
  }, BQ.createElement(VY1, {
    prompt: K
  })), X.map((D) => BQ.createElement(S, {
    key: D.uuid,
    height: 1,
    overflow: "hidden"
  }, BQ.createElement(xg, {
    message: D.data.message,
    messages: D.data.normalizedMessages,
    addMargin: !1,
    tools: Q,
    verbose: B,
    erroredToolUseIDs: new Set,
    inProgressToolUseIDs: new Set,
    resolvedToolUseIDs: BV0(A),
    progressMessagesForMessage: A,
    shouldAnimate: !1,
    shouldShowDot: !1,
    style: "condensed",
    isTranscriptMode: !1,
    isStatic: !0
  })))), F > 0 && BQ.createElement($, {
    dimColor: !0
  }, "+", F, " more tool ", F === 1 ? "use" : "uses", " ", BQ.createElement(Tl, null))))
}
// @from(Start 13760287, End 13760521)
function NJ9(A, {
  progressMessagesForMessage: Q,
  tools: B,
  verbose: G
}) {
  let Z = Q[0]?.data?.agentId;
  return BQ.createElement(BQ.Fragment, null, !1, FY1(Q, {
    tools: B,
    verbose: G
  }), BQ.createElement(k5, null))
}
// @from(Start 13760523, End 13760753)
function LJ9(A, {
  progressMessagesForMessage: Q,
  tools: B,
  verbose: G
}) {
  return BQ.createElement(BQ.Fragment, null, FY1(Q, {
    tools: B,
    verbose: G
  }), BQ.createElement(Q6, {
    result: A,
    verbose: G
  }))
}
// @from(Start 13760755, End 13761283)
function L_3(A) {
  let Q = A.filter((Z) => {
      let I = Z.data.message;
      return I.type === "user" && I.message.content.some((Y) => Y.type === "tool_result")
    }).length,
    B = [...A].reverse().find((Z) => Z.data.message.type === "assistant"),
    G = null;
  if (B?.data.message.type === "assistant") {
    let Z = B.data.message.message.usage;
    G = (Z.cache_creation_input_tokens ?? 0) + (Z.cache_read_input_tokens ?? 0) + Z.input_tokens + Z.output_tokens
  }
  return {
    toolUseCount: Q,
    tokens: G
  }
}
// @from(Start 13761285, End 13763205)
function MJ9(A, Q) {
  let {
    shouldAnimate: B,
    tools: G
  } = Q, Z = A.map(({
    param: F,
    isResolved: K,
    isError: D,
    progressMessages: H
  }) => {
    let C = L_3(H),
      E = M_3(H, G),
      U = QV0.safeParse(F.input),
      q = U.success ? tX0(U.data) : "Task",
      w = U.success ? U.data.description : void 0,
      N = U.success ? eX0(U.data) : void 0,
      R = U.success && "run_in_background" in U.data && U.data.run_in_background === !0;
    return {
      id: F.id,
      agentType: q,
      description: w,
      toolUseCount: C.toolUseCount,
      tokens: C.tokens,
      isResolved: K,
      isError: D,
      isAsync: R,
      color: N,
      lastToolInfo: E
    }
  }), I = A.some((F) => !F.isResolved), Y = A.some((F) => F.isError), J = !I, W = Z.length > 0 && Z.every((F) => F.agentType === Z[0]?.agentType), X = W ? Z[0]?.agentType : null, V = Z.every((F) => F.isAsync);
  return BQ.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, BQ.createElement(S, {
    flexDirection: "row"
  }, BQ.createElement(dZ1, {
    shouldAnimate: B && I,
    isUnresolved: I,
    isError: Y
  }), BQ.createElement($, null, J ? BQ.createElement(BQ.Fragment, null, BQ.createElement($, {
    bold: !0
  }, A.length), " ", X ? `${X} agents` : "agents", " ", V ? "launched" : "finished") : BQ.createElement(BQ.Fragment, null, "Running ", BQ.createElement($, {
    bold: !0
  }, A.length), " ", X ? `${X} agents` : "agents", "…")), BQ.createElement($, {
    dimColor: !0
  }, " (ctrl+o to expand)")), Z.map((F, K) => BQ.createElement(zJ9, {
    key: F.id,
    agentType: F.agentType,
    description: F.description,
    toolUseCount: F.toolUseCount,
    tokens: F.tokens,
    color: F.color,
    isLast: K === Z.length - 1,
    isResolved: F.isResolved,
    isError: F.isError,
    isAsync: F.isAsync,
    shouldAnimate: B,
    lastToolInfo: F.lastToolInfo,
    hideType: W
  })))
}
// @from(Start 13763207, End 13763327)
function tX0(A) {
  if (A?.subagent_type && A.subagent_type !== o51.agentType) return A.subagent_type;
  return "Task"
}
// @from(Start 13763329, End 13763411)
function eX0(A) {
  if (!A?.subagent_type) return;
  return PWA(A.subagent_type)
}
// @from(Start 13763413, End 13764594)
function M_3(A, Q) {
  let B = [...A].reverse().find((G) => {
    let Z = G.data.message;
    return Z.type === "user" && Z.message.content.some((I) => I.type === "tool_result")
  });
  if (B?.data.message.type === "user") {
    let G = B.data.message.message.content.find((Z) => Z.type === "tool_result");
    if (G?.type === "tool_result") {
      let Z = G.tool_use_id,
        I = A.find((Y) => {
          let J = Y.data.message;
          return J.type === "assistant" && J.message.content.some((W) => W.type === "tool_use" && W.id === Z)
        });
      if (I?.data.message.type === "assistant") {
        let Y = I.data.message.message.content.find((J) => J.type === "tool_use" && J.id === Z);
        if (Y?.type === "tool_use") {
          let J = Q.find((F) => F.name === Y.name);
          if (!J) return Y.name;
          let W = Y.input,
            X = J.inputSchema.safeParse(W),
            V = J.userFacingName(X.success ? X.data : void 0);
          if (J.getToolUseSummary) {
            let F = J.getToolUseSummary(X.success ? X.data : void 0);
            if (F) return `${V}: ${F}`
          }
          return V
        }
      }
    }
  }
  return null
}
// @from(Start 13764599, End 13764601)
BQ
// @from(Start 13764603, End 13764610)
oX0 = 3
// @from(Start 13764614, End 13764621)
w_3 = 9
// @from(Start 13764625, End 13764632)
q_3 = 7
// @from(Start 13764636, End 13764657)
N_3 = "Initializing…"
// @from(Start 13764663, End 13764843)
AV0 = L(() => {
  F9();
  hA();
  iX();
  yJ();
  wh();
  q8();
  UjA();
  cQ();
  cQ();
  q70();
  jy();
  AIA();
  oJ0();
  UJ9();
  DTA();
  bjA();
  R9();
  BQ = BA(VA(), 1)
})
// @from(Start 13764849, End 13764852)
O_3
// @from(Start 13764854, End 13764857)
VtZ
// @from(Start 13764863, End 13765243)
GV0 = L(() => {
  Q2();
  hA();
  JI1();
  RZ();
  iX();
  AV0();
  O_3 = BA(VA(), 1), VtZ = j.strictObject({
    agentId: j.string().describe("The agent ID to retrieve results for"),
    block: j.boolean().default(!0).describe("Whether to block until results are ready"),
    wait_up_to: j.number().min(0).max(300).default(150).describe("Maximum time to wait in seconds")
  })
})
// @from(Start 13765246, End 13765439)
function __3(A) {
  let Q = 0,
    B = nJ(A);
  for (let G of B)
    if (G.type === "assistant") {
      for (let Z of G.message.content)
        if (Z.type === "tool_use") Q++
    } return Q
}
// @from(Start 13765441, End 13766171)
function k_3(A, Q, B) {
  let {
    prompt: G,
    resolvedAgentModel: Z,
    isBuiltInAgent: I,
    startTime: Y
  } = B, J = AVA(A);
  if (J === void 0) throw Error("No assistant messages found");
  let W = J.message.content.filter((F) => F.type === "text"),
    X = E91(J.message.usage),
    V = __3(A);
  return GA("tengu_agent_tool_completed", {
    model: Z,
    prompt_char_count: G.length,
    response_char_count: W.length,
    assistant_message_count: A.length,
    total_tool_uses: V,
    duration_ms: Date.now() - Y,
    total_tokens: X,
    is_built_in_agent: I
  }), {
    agentId: Q,
    content: W,
    totalDurationMs: Date.now() - Y,
    totalTokens: X,
    totalToolUseCount: V,
    usage: J.message.usage
  }
}
// @from(Start 13766176, End 13766179)
R_3
// @from(Start 13766181, End 13766184)
OJ9
// @from(Start 13766186, End 13766189)
mtZ
// @from(Start 13766191, End 13766194)
QV0
// @from(Start 13766196, End 13766199)
T_3
// @from(Start 13766201, End 13766204)
P_3
// @from(Start 13766206, End 13766209)
j_3
// @from(Start 13766211, End 13766214)
S_3
// @from(Start 13766216, End 13766218)
jn
// @from(Start 13766224, End 13774792)
DTA = L(() => {
  E9A();
  Q2();
  cQ();
  tb2();
  jy();
  t2();
  RZ();
  q0();
  WY1();
  GO();
  cQ();
  AV0();
  JI1();
  fP();
  S0A();
  GV0();
  cW0();
  Sy();
  S7();
  L00();
  V0();
  Pn();
  R_3 = BA(VA(), 1), OJ9 = j.object({
    description: j.string().describe("A short (3-5 word) description of the task"),
    prompt: j.string().describe("The task for the agent to perform"),
    subagent_type: j.string().describe("The type of specialized agent to use for this task"),
    model: j.enum(["sonnet", "opus", "haiku"]).optional().describe("Optional model to use for this agent. If not specified, inherits from parent. Prefer haiku for quick, straightforward tasks to minimize cost and latency."),
    resume: j.string().optional().describe("Optional agent ID to resume from. If provided, the agent will continue from the previous execution transcript.")
  }), mtZ = OJ9.extend({
    run_in_background: j.boolean().optional().describe("Set to true to run this agent in the background. Use AgentOutputTool to read the output later.")
  }), QV0 = OJ9, T_3 = j.object({
    agentId: j.string(),
    content: j.array(j.object({
      type: j.literal("text"),
      text: j.string()
    })),
    totalToolUseCount: j.number(),
    totalDurationMs: j.number(),
    totalTokens: j.number(),
    usage: j.object({
      input_tokens: j.number(),
      output_tokens: j.number(),
      cache_creation_input_tokens: j.number().nullable(),
      cache_read_input_tokens: j.number().nullable(),
      server_tool_use: j.object({
        web_search_requests: j.number(),
        web_fetch_requests: j.number()
      }).nullable(),
      service_tier: j.enum(["standard", "priority", "batch"]).nullable(),
      cache_creation: j.object({
        ephemeral_1h_input_tokens: j.number(),
        ephemeral_5m_input_tokens: j.number()
      }).nullable()
    })
  }), P_3 = T_3.extend({
    status: j.literal("completed"),
    prompt: j.string()
  }), j_3 = j.object({
    status: j.literal("async_launched"),
    agentId: j.string().describe("The ID of the async agent"),
    description: j.string().describe("The description of the task"),
    prompt: j.string().describe("The prompt for the agent")
  }), S_3 = j.union([P_3, j_3, eb2]);
  jn = {
    async prompt({
      agents: A
    }) {
      return await ob2(A)
    },
    name: A6,
    async description() {
      return "Launch a new task"
    },
    inputSchema: QV0,
    outputSchema: S_3,
    async call({
      prompt: A,
      subagent_type: Q,
      description: B,
      model: G,
      resume: Z,
      run_in_background: I
    }, Y, J, W, X) {
      let V = Date.now(),
        F = Y.options.agentDefinitions.activeAgents,
        K = F.find((T) => T.agentType === Q);
      if (!K) throw Error(`Agent type '${Q}' not found. Available agents: ${F.map((T)=>T.agentType).join(", ")}`);
      if (K.color) jWA(Q, K.color);
      let D = await Y.getAppState(),
        H = D.toolPermissionContext.mode,
        C = inA(K.model, Y.options.mainLoopModel, G, H);
      GA("tengu_agent_tool_selected", {
        agent_type: K.agentType,
        model: C,
        source: K.source,
        color: K.color,
        is_built_in_agent: $O(K)
      });
      let E;
      if (Z) {
        let T = await KY1(Z);
        if (!T) throw Error(`No transcript found for agent ID: ${Z}`);
        E = T
      }
      let U = K?.forkContext ? Y.messages : void 0,
        q;
      try {
        let T = Array.from(D.toolPermissionContext.additionalWorkingDirectories.keys()),
          y = K.getSystemPrompt({
            toolUseContext: Y
          });
        q = await GSA([y], C, T)
      } catch (T) {
        g(`Failed to get system prompt for agent ${K.agentType}: ${T instanceof Error?T.message:String(T)}`)
      }
      let w = K?.forkContext ? Af2(A, W) : [R0({
          content: A
        })],
        N = {
          prompt: A,
          resolvedAgentModel: C,
          isBuiltInAgent: $O(K),
          startTime: V
        },
        R = {
          agentDefinition: K,
          promptMessages: E ? [...E, ...w] : w,
          toolUseContext: Y,
          canUseTool: J,
          forkContextMessages: U,
          isAsync: I === !0,
          querySource: S69(K.agentType, $O(K)),
          model: G,
          override: q ? {
            systemPrompt: q
          } : void 0
        };
      {
        let T = Z || SWA(),
          y = [],
          v = Date.now();
        if (w[0] && w[0].type === "user") {
          let FA = nJ(w),
            zA = FA.find((NA) => NA.type === "user");
          if (zA && zA.type === "user" && X) X({
            toolUseID: `agent_${W.message.id}`,
            data: {
              message: zA,
              normalizedMessages: FA,
              type: "agent_progress",
              prompt: A,
              resume: Z,
              agentId: T
            }
          })
        }
        let x, p = new Promise((FA) => {
            x = FA
          }),
          u = () => {
            x()
          },
          e = !1,
          k = setInterval(() => {
            let FA = Date.now() - v
          }, 100),
          m = XY1({
            ...R,
            override: {
              ...R.override,
              agentId: T
            }
          })[Symbol.asyncIterator]();
        try {
          while (!0) {
            let FA = m.next(),
              zA = await Promise.race([FA.then((wA) => ({
                type: "message",
                result: wA
              })), p.then(() => ({
                type: "background"
              }))]);
            zA.type;
            let {
              result: NA
            } = zA;
            if (NA.done) break;
            let OA = NA.value;
            if (y.push(OA), OA.type !== "assistant" && OA.type !== "user") continue;
            fQA(OA, () => {}, (wA) => Y.setResponseLength((qA) => qA + wA.length), () => {}, () => {});
            let mA = nJ(y);
            for (let wA of nJ([OA]))
              for (let qA of wA.message.content) {
                if (qA.type !== "tool_use" && qA.type !== "tool_result") continue;
                if (X) X({
                  toolUseID: `agent_${W.message.id}`,
                  data: {
                    message: wA,
                    normalizedMessages: mA,
                    type: "agent_progress",
                    prompt: A,
                    resume: Z,
                    agentId: T
                  }
                })
              }
          }
        } finally {
          if (k) clearInterval(k);
          if (Y.setToolJSX) Y.setToolJSX(null)
        }
        let o = dC(y.filter((FA) => FA.type !== "system" && FA.type !== "progress"));
        if (o && Q31(o)) throw new WW;
        let IA = k_3(y, T, N);
        return {
          data: {
            status: "completed",
            prompt: A,
            ...IA
          }
        }
      }
    },
    isReadOnly() {
      return !0
    },
    isConcurrencySafe() {
      return !0
    },
    isEnabled() {
      return !0
    },
    userFacingName: tX0,
    userFacingNameBackgroundColor: eX0,
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      if (A.status === "async_launched") return {
        tool_use_id: Q,
        type: "tool_result",
        content: [{
          type: "text",
          text: `Async agent launched successfully.
agentId: ${A.agentId} (This is an internal ID for your use, do not mention it to the user. Use this ID to retrieve results with ${Wa} when the agent finishes). 
The agent is currently working in the background. If you have other tasks you you should continue working on them now. Wait to call ${Wa} until either:
- If you want to check on the agent's progress - call ${Wa} with block=false to get an immediate update on the agent's status
- If you run out of things to do and the agent is still running - call ${Wa} with block=true to idle and wait for the agent's result (do not use block=true unless you completely run out of things to do as it will waste time).`
        }]
      };
      if (A.status === "completed") return {
        tool_use_id: Q,
        type: "tool_result",
        content: A.content
      };
      throw Error(`Unexpected agent tool result status: ${A.status}`)
    },
    renderToolResultMessage: wJ9,
    renderToolUseMessage: qJ9,
    renderToolUseProgressMessage: FY1,
    renderToolUseRejectedMessage: NJ9,
    renderToolUseErrorMessage: LJ9,
    renderGroupedToolUse: MJ9
  }
})
// @from(Start 13774798, End 13774815)
DY1 = "KillShell"
// @from(Start 13774819, End 13775090)
RJ9 = `
- Kills a running background bash shell by its ID
- Takes a shell_id parameter identifying the shell to kill
- Returns a success or failure status 
- Use this tool when you need to terminate a long-running shell
- Shell IDs can be found using the /tasks command
`
// @from(Start 13775093, End 13775179)
function TJ9({
  shell_id: A
}) {
  if (!A) return null;
  return `Kill shell: ${A}`
}
// @from(Start 13775181, End 13775213)
function PJ9() {
  return null
}
// @from(Start 13775215, End 13775278)
function jJ9() {
  return XVA.default.createElement(k5, null)
}
// @from(Start 13775280, End 13775393)
function SJ9(A, {
  verbose: Q
}) {
  return XVA.default.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 13775395, End 13775572)
function _J9(A) {
  return XVA.default.createElement(S, null, XVA.default.createElement($, null, "  ⎿  "), XVA.default.createElement($, null, "Shell ", A.shell_id, " killed"))
}
// @from(Start 13775577, End 13775580)
XVA
// @from(Start 13775586, End 13775648)
kJ9 = L(() => {
  hA();
  iX();
  yJ();
  XVA = BA(VA(), 1)
})
// @from(Start 13775654, End 13775657)
y_3
// @from(Start 13775659, End 13775662)
x_3
// @from(Start 13775664, End 13775667)
HY1
// @from(Start 13775673, End 13777940)
ZV0 = L(() => {
  Q2();
  _AA();
  kJ9();
  y_3 = j.strictObject({
    shell_id: j.string().describe("The ID of the background shell to kill")
  }), x_3 = j.object({
    message: j.string().describe("Status message about the operation"),
    shell_id: j.string().describe("The ID of the shell that was killed")
  }), HY1 = {
    name: DY1,
    userFacingName: () => "Kill Shell",
    inputSchema: y_3,
    outputSchema: x_3,
    isEnabled() {
      return !0
    },
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !1
    },
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    async validateInput({
      shell_id: A
    }, {
      getAppState: Q
    }) {
      let G = (await Q()).backgroundTasks[A];
      if (!G) return {
        result: !1,
        message: `No shell found with ID: ${A}`,
        errorCode: 1
      };
      if (G.type !== "shell") return {
        result: !1,
        message: `Shell ${A} is not a shell`,
        errorCode: 2
      };
      return {
        result: !0
      }
    },
    async description() {
      return "Kill a background bash shell by ID"
    },
    async prompt() {
      return RJ9
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: JSON.stringify(A)
      }
    },
    renderToolUseMessage: TJ9,
    renderToolUseProgressMessage: PJ9,
    renderToolUseRejectedMessage: jJ9,
    renderToolUseErrorMessage: SJ9,
    renderToolResultMessage: _J9,
    async call({
      shell_id: A
    }, {
      getAppState: Q,
      setAppState: B
    }) {
      let Z = (await Q()).backgroundTasks[A];
      if (!Z) throw Error(`No shell found with ID: ${A}`);
      if (Z.type !== "shell") throw Error(`Shell ${A} is not a shell`);
      if (Z.status !== "running") throw Error(`Shell ${A} is not running, so cannot be killed (status: ${Z.status})`);
      let I = W01(Z);
      return B((Y) => ({
        ...Y,
        backgroundTasks: {
          ...Y.backgroundTasks,
          [A]: I
        }
      })), {
        data: {
          message: `Successfully killed shell: ${A} (${Z.command})`,
          shell_id: A
        }
      }
    }
  }
})
// @from(Start 13777943, End 13778416)
function yJ9() {
  return `
- Retrieves output from a running or completed background bash shell
- Takes a shell_id parameter identifying the shell
- Always returns only new output since the last check
- Returns stdout and stderr output along with shell status
- Supports optional regex filtering to show only lines matching a pattern
- Use this tool when you need to monitor or check the output of a long-running shell
- Shell IDs can be found using the /tasks command
`
}
// @from(Start 13778418, End 13778736)
function IV0(A) {
  let Q = Ge();
  if (A.length <= Q) return {
    totalLines: A.split(`
`).length,
    truncatedContent: A
  };
  let B = A.slice(0, Q),
    G = A.slice(Q).split(`
`).length,
    Z = `${B}

... [${G} lines truncated] ...`;
  return {
    totalLines: A.split(`
`).length,
    truncatedContent: Z
  }
}
// @from(Start 13778741, End 13778775)
xJ9 = L(() => {
  IGA();
  Np()
})
// @from(Start 13778778, End 13779042)
function vJ9(A, Q, B) {
  let G = {
    stdout: A.stdout,
    stderr: A.stderr,
    isImage: !1,
    dangerouslyDisableSandbox: !0,
    returnCodeInterpretation: A.error || void 0
  };
  return hQA.createElement(L1A, {
    content: G,
    verbose: B.verbose
  })
}
// @from(Start 13779044, End 13779167)
function bJ9(A) {
  if (A?.filter) return `Reading shell output (filtered: ${A.filter})`;
  return "Reading shell output"
}
// @from(Start 13779169, End 13779201)
function fJ9() {
  return null
}
// @from(Start 13779203, End 13779258)
function hJ9() {
  return hQA.createElement(k5, null)
}
// @from(Start 13779260, End 13779365)
function gJ9(A, {
  verbose: Q
}) {
  return hQA.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 13779370, End 13779373)
hQA
// @from(Start 13779379, End 13779442)
uJ9 = L(() => {
  iX();
  yJ();
  l21();
  hQA = BA(VA(), 1)
})
// @from(Start 13779445, End 13779587)
function mJ9(A, Q) {
  if (!Q || !A.trim()) return A;
  let B = new RegExp(Q, "i");
  return A.split(`
`).filter((I) => B.test(I)).join(`
`)
}
// @from(Start 13779592, End 13779595)
v_3
// @from(Start 13779597, End 13779600)
b_3
// @from(Start 13779602, End 13779605)
CY1
// @from(Start 13779611, End 13783935)
YV0 = L(() => {
  Q2();
  _AA();
  xJ9();
  uJ9();
  v_3 = j.object({
    shellId: j.string().describe("The ID of the background shell"),
    command: j.string().describe("The command that was run in the shell"),
    status: j.enum(["running", "completed", "failed", "killed"]).describe("The current status of the shell command"),
    exitCode: j.number().nullable().describe("The exit code of the command, if available"),
    stdout: j.string().describe("The standard output of the command"),
    stderr: j.string().describe("The standard error output of the command"),
    stdoutLines: j.number().describe("Total number of lines in original stdout, even if truncated or filtered"),
    stderrLines: j.number().describe("Total number of lines in original stderr, even if truncated or filtered"),
    error: j.string().optional().describe("Error message if the shell command failed"),
    filterPattern: j.string().optional().describe("The regex pattern used for filtering (only present when filter is applied)"),
    timestamp: j.string().describe("The current timestamp when the output was retrieved")
  }), b_3 = j.strictObject({
    bash_id: j.string().describe("The ID of the background shell to retrieve output from"),
    filter: j.string().optional().describe("Optional regular expression to filter the output lines. Only lines matching this regex will be included in the result. Any lines that do not match will no longer be available to read.")
  }), CY1 = {
    name: "BashOutput",
    async description() {
      return "Retrieves output from a background bash shell"
    },
    async prompt() {
      return yJ9()
    },
    userFacingName() {
      return "BashOutput"
    },
    isEnabled() {
      return !0
    },
    inputSchema: b_3,
    outputSchema: v_3,
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    async validateInput({
      bash_id: A,
      filter: Q
    }, {
      getAppState: B
    }) {
      if (Q) try {
        new RegExp(Q, "i")
      } catch (I) {
        return {
          result: !1,
          message: `Invalid regex pattern "${Q}": ${I instanceof Error?I.message:String(I)}`,
          errorCode: 1
        }
      }
      let Z = (await B()).backgroundTasks[A];
      if (!Z) return {
        result: !1,
        message: `No shell found with ID: ${A}`,
        errorCode: 2
      };
      if (Z.type !== "shell") return {
        result: !1,
        message: `Shell ${A} is not a shell`,
        errorCode: 3
      };
      return {
        result: !0
      }
    },
    async call({
      bash_id: A,
      filter: Q
    }, {
      getAppState: B
    }) {
      let I = (await B()).backgroundTasks[A];
      if (!I) throw Error(`No shell found with ID: ${A}`);
      if (I.type !== "shell") throw Error(`Shell ${A} is not a shell`);
      let Y = J01(I),
        J = mJ9(Y.stdout, Q),
        W = mJ9(Y.stderr, Q),
        {
          truncatedContent: X
        } = IV0(Ff(J)),
        {
          truncatedContent: V
        } = IV0(Ff(W)),
        F = Y.stdout.split(`
`).length,
        K = Y.stderr.split(`
`).length;
      return {
        data: {
          shellId: I.id,
          command: I.command,
          status: I.status,
          exitCode: I.result?.code ?? null,
          stdout: X,
          stderr: V,
          stdoutLines: F,
          stderrLines: K,
          timestamp: new Date().toISOString(),
          ...Q && {
            filterPattern: Q
          }
        }
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      let B = [];
      if (B.push(`<status>${A.status}</status>`), A.exitCode !== null && A.exitCode !== void 0) B.push(`<exit_code>${A.exitCode}</exit_code>`);
      if (A.stdout.trim()) B.push(`<stdout>
${A.stdout.trimEnd()}
</stdout>`);
      if (A.stderr.trim()) B.push(`<stderr>
${A.stderr.trim()}
</stderr>`);
      return B.push(`<timestamp>${A.timestamp}</timestamp>`), {
        tool_use_id: Q,
        type: "tool_result",
        content: B.join(`

`)
      }
    },
    renderToolUseProgressMessage: fJ9,
    renderToolResultMessage: vJ9,
    renderToolUseMessage: bJ9,
    renderToolUseRejectedMessage: hJ9,
    renderToolUseErrorMessage: gJ9
  }
})
// @from(Start 13783938, End 13784118)
function f_3(A) {
  let Q = 0,
    B = 0;
  for (let G of A)
    if (typeof G !== "string") Q++, B += G.content.length;
  return {
    searchCount: Q,
    totalResultCount: B
  }
}
// @from(Start 13784120, End 13784447)
function dJ9({
  query: A,
  allowed_domains: Q,
  blocked_domains: B
}, {
  verbose: G
}) {
  if (!A) return null;
  let Z = "";
  if (A) Z += `"${A}"`;
  if (G) {
    if (Q && Q.length > 0) Z += `, only allowing domains: ${Q.join(", ")}`;
    if (B && B.length > 0) Z += `, blocking domains: ${B.join(", ")}`
  }
  return Z
}
// @from(Start 13784449, End 13784511)
function cJ9() {
  return Kx.default.createElement(k5, null)
}
// @from(Start 13784513, End 13784625)
function pJ9(A, {
  verbose: Q
}) {
  return Kx.default.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 13784627, End 13785172)
function lJ9(A) {
  if (A.length === 0) return null;
  let Q = A[A.length - 1];
  if (!Q?.data) return null;
  let B = Q.data;
  switch (B.type) {
    case "query_update":
      return Kx.default.createElement(S0, null, Kx.default.createElement($, {
        dimColor: !0
      }, "Searching: ", B.query));
    case "search_results_received":
      return Kx.default.createElement(S0, null, Kx.default.createElement($, {
        dimColor: !0
      }, "Found ", B.resultCount, ' results for "', B.query, '"'));
    default:
      return null
  }
}
// @from(Start 13785174, End 13785591)
function iJ9(A) {
  let {
    searchCount: Q
  } = f_3(A.results), B = A.durationSeconds >= 1 ? `${Math.round(A.durationSeconds)}s` : `${Math.round(A.durationSeconds*1000)}ms`;
  return Kx.default.createElement(S, {
    justifyContent: "space-between",
    width: "100%"
  }, Kx.default.createElement(S0, {
    height: 1
  }, Kx.default.createElement($, null, "Did ", Q, " search", Q !== 1 ? "es" : "", " in ", B)))
}
// @from(Start 13785593, End 13785667)
function nJ9(A) {
  if (!A?.query) return null;
  return J7(A.query, $k)
}
// @from(Start 13785672, End 13785674)
Kx
// @from(Start 13785680, End 13785749)
aJ9 = L(() => {
  hA();
  q8();
  iX();
  yJ();
  Kx = BA(VA(), 1)
})
// @from(Start 13785752, End 13786565)
function c_3(A, Q, B) {
  let G = [],
    Z = "",
    I = !0;
  for (let Y of A) {
    if (Y.type === "server_tool_use") {
      if (I) {
        if (I = !1, Z.trim().length > 0) G.push(Z.trim());
        Z = ""
      }
      continue
    }
    if (Y.type === "web_search_tool_result") {
      if (!Array.isArray(Y.content)) {
        let W = `Web search error: ${Y.content.error_code}`;
        AA(Error(W)), G.push(W);
        continue
      }
      let J = Y.content.map((W) => ({
        title: W.title,
        url: W.url
      }));
      G.push({
        tool_use_id: Y.tool_use_id,
        content: J
      })
    }
    if (Y.type === "text")
      if (I) Z += Y.text;
      else I = !0, Z = Y.text
  }
  if (Z.length) G.push(Z.trim());
  return {
    query: Q,
    results: G,
    durationSeconds: B
  }
}
// @from(Start 13786570, End 13786573)
h_3
// @from(Start 13786575, End 13786578)
g_3
// @from(Start 13786580, End 13786583)
u_3
// @from(Start 13786585, End 13786588)
m_3
// @from(Start 13786590, End 13786790)
d_3 = (A) => {
    return {
      type: "web_search_20250305",
      name: "web_search",
      allowed_domains: A.allowed_domains,
      blocked_domains: A.blocked_domains,
      max_uses: 8
    }
  }
// @from(Start 13786794, End 13786797)
ZSA
// @from(Start 13786803, End 13792828)
JV0 = L(() => {
  Q2();
  c9A();
  fZ();
  cQ();
  t2();
  lK();
  g1();
  aJ9();
  h_3 = j.strictObject({
    query: j.string().min(2).describe("The search query to use"),
    allowed_domains: j.array(j.string()).optional().describe("Only include search results from these domains"),
    blocked_domains: j.array(j.string()).optional().describe("Never include search results from these domains")
  }), g_3 = j.object({
    title: j.string().describe("The title of the search result"),
    url: j.string().describe("The URL of the search result")
  }), u_3 = j.object({
    tool_use_id: j.string().describe("ID of the tool use"),
    content: j.array(g_3).describe("Array of search hits")
  }), m_3 = j.object({
    query: j.string().describe("The search query that was executed"),
    results: j.array(j.union([u_3, j.string()])).describe("Search results and/or text commentary from the model"),
    durationSeconds: j.number().describe("Time taken to complete the search operation")
  });
  ZSA = {
    name: WS,
    async description(A) {
      return `Claude wants to search the web for: ${A.query}`
    },
    userFacingName() {
      return "Web Search"
    },
    getToolUseSummary: nJ9,
    isEnabled() {
      let A = V6(),
        Q = k3();
      if (A === "firstParty") return !0;
      if (A === "vertex") return Q.includes("claude-opus-4") || Q.includes("claude-sonnet-4") || Q.includes("claude-haiku-4");
      if (A === "foundry") return !0;
      return !1
    },
    inputSchema: h_3,
    outputSchema: m_3,
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    async checkPermissions(A) {
      return {
        behavior: "passthrough",
        message: "WebSearchTool requires permission."
      }
    },
    async prompt() {
      return Nc0()
    },
    renderToolUseMessage: dJ9,
    renderToolUseRejectedMessage: cJ9,
    renderToolUseErrorMessage: pJ9,
    renderToolUseProgressMessage: lJ9,
    renderToolResultMessage: iJ9,
    async validateInput(A) {
      let {
        query: Q,
        allowed_domains: B,
        blocked_domains: G
      } = A;
      if (!Q.length) return {
        result: !1,
        message: "Error: Missing query",
        errorCode: 1
      };
      if (B && G) return {
        result: !1,
        message: "Error: Cannot specify both allowed_domains and blocked_domains in the same request",
        errorCode: 2
      };
      return {
        result: !0
      }
    },
    async call(A, Q, B, G, Z) {
      let I = performance.now(),
        {
          query: Y
        } = A,
        J = R0({
          content: "Perform a web search for the query: " + Y
        }),
        W = d_3(A),
        X = RYA({
          messages: [J],
          systemPrompt: ["You are an assistant for performing a web search tool use"],
          maxThinkingTokens: Q.options.maxThinkingTokens,
          tools: [],
          signal: Q.abortController.signal,
          options: {
            getToolPermissionContext: async () => {
              return (await Q.getAppState()).toolPermissionContext
            },
            model: k3(),
            toolChoice: void 0,
            isNonInteractiveSession: Q.options.isNonInteractiveSession,
            hasAppendSystemPrompt: Q.options.hasAppendSystemPrompt,
            extraToolSchemas: [W],
            querySource: "web_search_tool",
            agents: Q.options.agentDefinitions.activeAgents,
            mcpTools: [],
            agentIdOrSessionId: Q.agentId
          }
        }),
        V = [],
        F = null,
        K = "",
        D = 0,
        H = new Map;
      for await (let N of X) {
        if (V.push(N), N.type === "stream_event" && N.event?.type === "content_block_start") {
          let R = N.event.content_block;
          if (R && R.type === "server_tool_use") {
            F = R.id, K = "";
            continue
          }
        }
        if (F && N.type === "stream_event" && N.event?.type === "content_block_delta") {
          let R = N.event.delta;
          if (R?.type === "input_json_delta" && R.partial_json) {
            K += R.partial_json;
            try {
              let T = K.match(/"query"\s*:\s*"((?:[^"\\]|\\.)*)"/);
              if (T && T[1]) {
                let y = JSON.parse('"' + T[1] + '"');
                if (!H.has(F) || H.get(F) !== y) {
                  if (H.set(F, y), D++, Z) Z({
                    toolUseID: `search-progress-${D}`,
                    data: {
                      type: "query_update",
                      query: y
                    }
                  })
                }
              }
            } catch {}
          }
        }
        if (N.type === "stream_event" && N.event?.type === "content_block_start") {
          let R = N.event.content_block;
          if (R && R.type === "web_search_tool_result") {
            let T = R.tool_use_id,
              y = H.get(T) || Y,
              v = R.content;
            if (D++, Z) Z({
              toolUseID: T || `search-progress-${D}`,
              data: {
                type: "search_results_received",
                resultCount: Array.isArray(v) ? v.length : 0,
                query: y
              }
            })
          }
        }
      }
      let E = V.filter((N) => N.type === "assistant").flatMap((N) => N.message.content),
        q = (performance.now() - I) / 1000;
      return {
        data: c_3(E, Y, q)
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      let {
        query: B,
        results: G
      } = A, Z = `Web search results for query: "${B}"

`;
      return G.forEach((I) => {
        if (typeof I === "string") Z += I + `

`;
        else if (I.content.length > 0) Z += `Links: ${JSON.stringify(I.content)}

`;
        else Z += `No links found.

`
      }), Z += `
REMINDER: You MUST include the sources above in your response to the user using markdown hyperlinks.`, {
        tool_use_id: Q,
        type: "tool_result",
        content: Z.trim()
      }
    }
  }
})
// @from(Start 13792834, End 13792837)
SeZ
// @from(Start 13792843, End 13792896)
sJ9 = L(() => {
  Q2();
  SeZ = j.strictObject({})
})
// @from(Start 13792902, End 13792905)
geZ
// @from(Start 13792911, End 13792979)
rJ9 = L(() => {
  _8();
  V0();
  jy();
  geZ = Promise.resolve()
})
// @from(Start 13792985, End 13792988)
i_3
// @from(Start 13792994, End 13793073)
oJ9 = L(() => {
  hA();
  saA();
  iX();
  yJ();
  jy();
  i_3 = BA(VA(), 1)
})
// @from(Start 13793079, End 13793082)
qAI
// @from(Start 13793088, End 13795305)
tJ9 = L(() => {
  Q2();
  rJ9();
  _8();
  dK();
  U2();
  PV();
  g91();
  oJ9();
  qAI = j.strictObject({
    operation: j.enum(["spawn", "spawnTeam", "read", "write"]).describe("Operation: spawn a teammate, spawnTeam to create a team, read messages from mailbox, or write a message to a teammate"),
    name: j.string().optional().describe("Name for the teammate (required for spawn, used in tmux window title)"),
    prompt: j.string().optional().describe("Initial prompt to send to the spawned Claude Code instance (required for spawn)"),
    cwd: j.string().optional().describe("Working directory for the teammate (defaults to current)"),
    use_worktree: j.boolean().optional().describe("If true and in a git repo, creates a git worktree for the teammate. Use worktrees when the teammate needs to make independent changes (e.g., parallel feature development, testing destructive changes). Do NOT use worktrees when the teammate needs to see/modify the same files as you (e.g., running tests on your changes, code review)."),
    use_splitpane: j.boolean().optional().describe("If true (default), spawns the teammate in a split-pane view with the leader. All teammates appear in a single window with the leader on the left and teammates equally divided on the right. Set to false for separate windows."),
    key: j.string().optional().describe("Key for the data being stored (write)"),
    value: j.string().optional().describe("Value to store - JSON string for complex data (write)"),
    target_agent_id: j.string().optional().describe("Agent ID of the recipient (required for write operation)"),
    agent_type: j.string().optional().describe('Type/role of the spawned agent (e.g., "code-reviewer", "test-runner"). Used for team file and inter-agent coordination.'),
    agent_id: j.string().optional().describe("Your registered agent ID (for read/write operations, or unique identifier for spawn). Use this to identify yourself as a registered agent."),
    team_name: j.string().optional().describe("For spawn: Name of existing team to join. For spawnTeam: Name for the new team to create."),
    description: j.string().optional().describe("Team description/purpose (only used with spawnTeam).")
  })
})
// @from(Start 13795311, End 13795314)
n_3
// @from(Start 13795316, End 13795319)
a_3
// @from(Start 13795321, End 13795324)
s_3
// @from(Start 13795326, End 13795329)
r_3
// @from(Start 13795331, End 13795334)
o_3
// @from(Start 13795336, End 13795339)
eJ9
// @from(Start 13795345, End 13797182)
AW9 = L(() => {
  Q2();
  n_3 = j.strictObject({
    operation: j.literal("goToDefinition"),
    filePath: j.string().describe("The absolute or relative path to the file"),
    line: j.number().int().nonnegative().describe("The line number (0-indexed) in the file"),
    character: j.number().int().nonnegative().describe("The character offset (0-indexed) on the line")
  }), a_3 = j.strictObject({
    operation: j.literal("findReferences"),
    filePath: j.string().describe("The absolute or relative path to the file"),
    line: j.number().int().nonnegative().describe("The line number (0-indexed) in the file"),
    character: j.number().int().nonnegative().describe("The character offset (0-indexed) on the line")
  }), s_3 = j.strictObject({
    operation: j.literal("hover"),
    filePath: j.string().describe("The absolute or relative path to the file"),
    line: j.number().int().nonnegative().describe("The line number (0-indexed) in the file"),
    character: j.number().int().nonnegative().describe("The character offset (0-indexed) on the line")
  }), r_3 = j.strictObject({
    operation: j.literal("documentSymbol"),
    filePath: j.string().describe("The absolute or relative path to the file"),
    line: j.number().int().nonnegative().describe("The line number (0-indexed) in the file"),
    character: j.number().int().nonnegative().describe("The character offset (0-indexed) on the line")
  }), o_3 = j.strictObject({
    operation: j.literal("workspaceSymbol"),
    filePath: j.string().describe("The absolute or relative path to the file"),
    line: j.number().int().nonnegative().describe("The line number (0-indexed) in the file"),
    character: j.number().int().nonnegative().describe("The character offset (0-indexed) on the line")
  }), eJ9 = j.discriminatedUnion("operation", [n_3, a_3, s_3, r_3, o_3])
})
// @from(Start 13797227, End 13797769)
function GW9(A, Q) {
  if (!A) return g("formatUri called with undefined URI - indicates malformed LSP server response", {
    level: "warn"
  }), "<unknown location>";
  let B = A.replace(/^file:\/\//, "");
  try {
    B = decodeURIComponent(B)
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G);
    g(`Failed to decode LSP URI '${A}': ${Z}. Using un-decoded path: ${B}`, {
      level: "warn"
    })
  }
  if (Q) {
    let G = t_3(Q, B);
    if (G.length < B.length && !G.startsWith("../../")) return G
  }
  return B
}
// @from(Start 13797771, End 13797983)
function ZW9(A, Q) {
  let B = new Map;
  for (let G of A) {
    let Z = "uri" in G ? G.uri : G.location.uri,
      I = GW9(Z, Q),
      Y = B.get(I);
    if (Y) Y.push(G);
    else B.set(I, [G])
  }
  return B
}
// @from(Start 13797985, End 13798127)
function EY1(A, Q) {
  let B = GW9(A.uri, Q),
    G = A.range.start.line + 1,
    Z = A.range.start.character + 1;
  return `${B}:${G}:${Z}`
}
// @from(Start 13798129, End 13798236)
function QW9(A) {
  return {
    uri: A.targetUri,
    range: A.targetSelectionRange || A.targetRange
  }
}
// @from(Start 13798238, End 13798283)
function BW9(A) {
  return "targetUri" in A
}
// @from(Start 13798285, End 13798957)
function IW9(A, Q) {
  if (!A) return "No definition found";
  if (Array.isArray(A)) {
    let G = A.map((J) => BW9(J) ? QW9(J) : J),
      Z = G.filter((J) => !J || !J.uri);
    if (Z.length > 0) g(`formatGoToDefinitionResult: Filtering out ${Z.length} invalid location(s) - this should have been caught earlier`, {
      level: "warn"
    });
    let I = G.filter((J) => J && J.uri);
    if (I.length === 0) return "No definition found";
    if (I.length === 1) return `Defined in ${EY1(I[0],Q)}`;
    let Y = I.map((J) => `  ${EY1(J,Q)}`).join(`
`);
    return `Found ${I.length} definitions:
${Y}`
  }
  let B = BW9(A) ? QW9(A) : A;
  return `Defined in ${EY1(B,Q)}`
}
// @from(Start 13798959, End 13799704)
function YW9(A, Q) {
  if (!A || A.length === 0) return "No references found";
  let B = A.filter((Y) => !Y || !Y.uri);
  if (B.length > 0) g(`formatFindReferencesResult: Filtering out ${B.length} invalid location(s) - this should have been caught earlier`, {
    level: "warn"
  });
  let G = A.filter((Y) => Y && Y.uri);
  if (G.length === 0) return "No references found";
  if (G.length === 1) return `Found 1 reference:
  ${EY1(G[0],Q)}`;
  let Z = ZW9(G, Q),
    I = [`Found ${G.length} references across ${Z.size} files:`];
  for (let [Y, J] of Z) {
    I.push(`
${Y}:`);
    for (let W of J) {
      let X = W.range.start.line + 1,
        V = W.range.start.character + 1;
      I.push(`  Line ${X}:${V}`)
    }
  }
  return I.join(`
`)
}
// @from(Start 13799706, End 13799939)
function e_3(A) {
  if (Array.isArray(A)) return A.map((Q) => {
    if (typeof Q === "string") return Q;
    return Q.value
  }).join(`

`);
  if (typeof A === "string") return A;
  if ("kind" in A) return A.value;
  return A.value
}
// @from(Start 13799941, End 13800192)
function JW9(A, Q) {
  if (!A) return "No hover information available";
  let B = e_3(A.contents);
  if (A.range) {
    let G = A.range.start.line + 1,
      Z = A.range.start.character + 1;
    return `Hover info at ${G}:${Z}:

${B}`
  }
  return B
}
// @from(Start 13800194, End 13800776)
function WW9(A) {
  return {
    [1]: "File",
    [2]: "Module",
    [3]: "Namespace",
    [4]: "Package",
    [5]: "Class",
    [6]: "Method",
    [7]: "Property",
    [8]: "Field",
    [9]: "Constructor",
    [10]: "Enum",
    [11]: "Interface",
    [12]: "Function",
    [13]: "Variable",
    [14]: "Constant",
    [15]: "String",
    [16]: "Number",
    [17]: "Boolean",
    [18]: "Array",
    [19]: "Object",
    [20]: "Key",
    [21]: "Null",
    [22]: "EnumMember",
    [23]: "Struct",
    [24]: "Event",
    [25]: "Operator",
    [26]: "TypeParameter"
  } [A] || "Unknown"
}
// @from(Start 13800778, End 13801108)
function XW9(A, Q = 0) {
  let B = [],
    G = "  ".repeat(Q),
    Z = WW9(A.kind),
    I = `${G}${A.name} (${Z})`;
  if (A.detail) I += ` ${A.detail}`;
  let Y = A.range.start.line + 1;
  if (I += ` - Line ${Y}`, B.push(I), A.children && A.children.length > 0)
    for (let J of A.children) B.push(...XW9(J, Q + 1));
  return B
}
// @from(Start 13801110, End 13801291)
function VW9(A, Q) {
  if (!A || A.length === 0) return "No symbols found in document";
  let B = ["Document symbols:"];
  for (let G of A) B.push(...XW9(G));
  return B.join(`
`)
}
// @from(Start 13801293, End 13802124)
function FW9(A, Q) {
  if (!A || A.length === 0) return "No symbols found in workspace";
  let B = A.filter((Y) => !Y || !Y.location || !Y.location.uri);
  if (B.length > 0) g(`formatWorkspaceSymbolResult: Filtering out ${B.length} invalid symbol(s) - this should have been caught earlier`, {
    level: "warn"
  });
  let G = A.filter((Y) => Y && Y.location && Y.location.uri);
  if (G.length === 0) return "No symbols found in workspace";
  let Z = [`Found ${G.length} symbol${G.length===1?"":"s"} in workspace:`],
    I = ZW9(G, Q);
  for (let [Y, J] of I) {
    Z.push(`
${Y}:`);
    for (let W of J) {
      let X = WW9(W.kind),
        V = W.location.range.start.line + 1,
        F = `  ${W.name} (${X}) - Line ${V}`;
      if (W.containerName) F += ` in ${W.containerName}`;
      Z.push(F)
    }
  }
  return Z.join(`
`)
}
// @from(Start 13802129, End 13802154)
KW9 = L(() => {
  V0()
})
// @from(Start 13802160, End 13802171)
DW9 = "LSP"
// @from(Start 13802175, End 13802874)
WV0 = `Interact with Language Server Protocol (LSP) servers to get code intelligence features.

Supported operations:
- goToDefinition: Find where a symbol is defined
- findReferences: Find all references to a symbol
- hover: Get hover information (documentation, type info) for a symbol
- documentSymbol: Get all symbols (functions, classes, variables) in a document
- workspaceSymbol: Search for symbols across the entire workspace

All operations require:
- filePath: The file to operate on
- line: The line number (0-indexed)
- character: The character offset (0-indexed) on the line

Note: LSP servers must be configured for the file type. If no server is available, an error will be returned.`
// @from(Start 13802877, End 13803611)
function HW9(A, Q, B) {
  try {
    let G = RA(),
      Z = b9(A);
    if (!G.existsSync(Z)) return null;
    let Y = G.readFileSync(Z, {
      encoding: "utf-8"
    }).split(`
`);
    if (Q < 0 || Q >= Y.length) return null;
    let J = Y[Q];
    if (!J || B < 0 || B >= J.length) return null;
    let W = /[\w$'!]+|[+\-*/%&|^~<>=]+/g,
      X;
    while ((X = W.exec(J)) !== null) {
      let V = X.index,
        F = V + X[0].length;
      if (B >= V && B < F) {
        let K = X[0];
        return K.length > 30 ? K.slice(0, 27) + "..." : K
      }
    }
    return null
  } catch (G) {
    if (G instanceof Error) g(`Symbol extraction failed for ${A}:${Q}:${B}: ${G.message}`, {
      level: "warn"
    });
    return null
  }
}
// @from(Start 13803616, End 13803657)
CW9 = L(() => {
  AQ();
  yI();
  V0()
})
// @from(Start 13803660, End 13804726)
function Qk3({
  operation: A,
  resultCount: Q,
  fileCount: B,
  content: G,
  verbose: Z
}) {
  let I = Ak3[A] || {
      singular: "result",
      plural: "results"
    },
    Y = Q === 1 ? I.singular : I.plural,
    J = A === "hover" && Q > 0 && I.special ? zY.default.createElement(zY.default.Fragment, null, "Hover info ", I.special) : zY.default.createElement(zY.default.Fragment, null, "Found ", zY.default.createElement($, {
      bold: !0
    }, Q, " "), Y),
    W = B > 1 ? zY.default.createElement(zY.default.Fragment, null, " ", "across ", zY.default.createElement($, {
      bold: !0
    }, B, " "), "files") : null;
  if (Z) return zY.default.createElement(S, {
    flexDirection: "column"
  }, zY.default.createElement(S, {
    flexDirection: "row"
  }, zY.default.createElement($, null, "  ⎿  ", J, W)), zY.default.createElement(S, {
    marginLeft: 5
  }, zY.default.createElement($, null, G)));
  return zY.default.createElement(S0, {
    height: 1
  }, zY.default.createElement($, null, J, W, " ", Q > 0 && zY.default.createElement(Tl, null)))
}
// @from(Start 13804728, End 13804761)
function EW9() {
  return "LSP"
}
// @from(Start 13804763, End 13805509)
function zW9(A, {
  verbose: Q
}) {
  if (!A.operation) return null;
  let B = [];
  if ((A.operation === "goToDefinition" || A.operation === "findReferences" || A.operation === "hover") && A.filePath && A.line !== void 0 && A.character !== void 0) {
    let G = HW9(A.filePath, A.line, A.character),
      Z = Q ? A.filePath : Q5(A.filePath);
    if (G) B.push(`operation: "${A.operation}"`), B.push(`symbol: "${G}"`), B.push(`in: "${Z}"`);
    else B.push(`operation: "${A.operation}"`), B.push(`file: "${Z}"`), B.push(`position: ${A.line}:${A.character}`);
    return B.join(", ")
  }
  if (B.push(`operation: "${A.operation}"`), A.filePath) {
    let G = Q ? A.filePath : Q5(A.filePath);
    B.push(`file: "${G}"`)
  }
  return B.join(", ")
}
// @from(Start 13805511, End 13805573)
function UW9() {
  return zY.default.createElement(k5, null)
}
// @from(Start 13805575, End 13805871)
function $W9(A, {
  verbose: Q
}) {
  if (!Q && typeof A === "string" && B9(A, "tool_use_error")) return zY.default.createElement(S0, null, zY.default.createElement($, {
    color: "error"
  }, "LSP operation failed"));
  return zY.default.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 13805873, End 13805905)
function wW9() {
  return null
}
// @from(Start 13805907, End 13806265)
function qW9(A, Q, {
  verbose: B
}) {
  if (A.resultCount !== void 0 && A.fileCount !== void 0) return zY.default.createElement(Qk3, {
    operation: A.operation,
    resultCount: A.resultCount,
    fileCount: A.fileCount,
    content: A.result,
    verbose: B
  });
  return zY.default.createElement(S0, null, zY.default.createElement($, null, A.result))
}
// @from(Start 13806270, End 13806272)
zY
// @from(Start 13806274, End 13806277)
Ak3
// @from(Start 13806283, End 13806834)
NW9 = L(() => {
  hA();
  iX();
  yJ();
  q8();
  AIA();
  cQ();
  R9();
  CW9();
  zY = BA(VA(), 1), Ak3 = {
    goToDefinition: {
      singular: "definition",
      plural: "definitions"
    },
    findReferences: {
      singular: "reference",
      plural: "references"
    },
    documentSymbol: {
      singular: "symbol",
      plural: "symbols"
    },
    workspaceSymbol: {
      singular: "symbol",
      plural: "symbols"
    },
    hover: {
      singular: "hover info",
      plural: "hover info",
      special: "available"
    }
  }
})
// @from(Start 13806912, End 13807991)
function Ik3(A, Q) {
  let B = Bk3(Q).href,
    G = {
      line: A.line,
      character: A.character
    };
  switch (A.operation) {
    case "goToDefinition":
      return {
        method: "textDocument/definition", params: {
          textDocument: {
            uri: B
          },
          position: G
        }
      };
    case "findReferences":
      return {
        method: "textDocument/references", params: {
          textDocument: {
            uri: B
          },
          position: G,
          context: {
            includeDeclaration: !0
          }
        }
      };
    case "hover":
      return {
        method: "textDocument/hover", params: {
          textDocument: {
            uri: B
          },
          position: G
        }
      };
    case "documentSymbol":
      return {
        method: "textDocument/documentSymbol", params: {
          textDocument: {
            uri: B
          }
        }
      };
    case "workspaceSymbol":
      return {
        method: "workspace/symbol", params: {
          query: ""
        }
      }
  }
}
// @from(Start 13807993, End 13808129)
function LW9(A) {
  let Q = A.length;
  for (let B of A)
    if (B.children && B.children.length > 0) Q += LW9(B.children);
  return Q
}
// @from(Start 13808131, End 13808193)
function XV0(A) {
  return new Set(A.map((Q) => Q.uri)).size
}
// @from(Start 13808195, End 13808240)
function Yk3(A) {
  return "targetUri" in A
}
// @from(Start 13808242, End 13808373)
function Jk3(A) {
  if (Yk3(A)) return {
    uri: A.targetUri,
    range: A.targetSelectionRange || A.targetRange
  };
  return A
}
// @from(Start 13808375, End 13810185)
function Wk3(A, Q, B) {
  switch (A) {
    case "goToDefinition": {
      let Z = (Array.isArray(Q) ? Q : Q ? [Q] : []).map(Jk3),
        I = Z.filter((J) => !J || !J.uri);
      if (I.length > 0) AA(Error(`LSP server returned ${I.length} location(s) with undefined URI for goToDefinition on ${B}. This indicates malformed data from the LSP server.`));
      let Y = Z.filter((J) => J && J.uri);
      return {
        formatted: IW9(Q, B),
        resultCount: Y.length,
        fileCount: XV0(Y)
      }
    }
    case "findReferences": {
      let G = Q || [],
        Z = G.filter((Y) => !Y || !Y.uri);
      if (Z.length > 0) AA(Error(`LSP server returned ${Z.length} location(s) with undefined URI for findReferences on ${B}. This indicates malformed data from the LSP server.`));
      let I = G.filter((Y) => Y && Y.uri);
      return {
        formatted: YW9(Q, B),
        resultCount: I.length,
        fileCount: XV0(I)
      }
    }
    case "hover":
      return {
        formatted: JW9(Q, B), resultCount: Q ? 1 : 0, fileCount: Q ? 1 : 0
      };
    case "documentSymbol": {
      let G = Q || [],
        Z = G.length > 0 ? LW9(G) : 0;
      return {
        formatted: VW9(Q, B),
        resultCount: Z,
        fileCount: G.length > 0 ? 1 : 0
      }
    }
    case "workspaceSymbol": {
      let G = Q || [],
        Z = G.filter((J) => !J || !J.location || !J.location.uri);
      if (Z.length > 0) AA(Error(`LSP server returned ${Z.length} symbol(s) with undefined location URI for workspaceSymbol on ${B}. This indicates malformed data from the LSP server.`));
      let I = G.filter((J) => J && J.location && J.location.uri),
        Y = I.map((J) => J.location);
      return {
        formatted: FW9(Q, B),
        resultCount: I.length,
        fileCount: XV0(Y)
      }
    }
  }
}
// @from(Start 13810190, End 13810193)
Gk3
// @from(Start 13810195, End 13810198)
Zk3
// @from(Start 13810200, End 13810203)
FV0