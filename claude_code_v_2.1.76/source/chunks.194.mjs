
// @from(Ln 503176, Col 0)
async function tuq(A) {
    if (!E7() || !ic6()) return null;
    let {
        ctx: q,
        description: K,
        updatedInput: Y,
        suggestions: z
    } = A, _ = null;
    if (_) return _;
    try {
        let w = () => q.toolUseContext.setAppState(($) => ({
            ...$,
            pendingWorkerRequest: null
        }));
        return await new Promise(($) => {
            let {
                resolve: H,
                claim: j
            } = zb1($), J = SN1({
                toolName: q.tool.name,
                toolUseId: q.toolUseID,
                input: q.input,
                description: K,
                permissionSuggestions: z
            });
            bN1({
                requestId: J.id,
                toolUseId: q.toolUseID,
                async onAllow(M, D, X, P) {
                    if (!j()) return;
                    w();
                    let W = M && Object.keys(M).length > 0 ? M : q.input;
                    H(await q.handleUserAllow(W, D, X, void 0, P))
                },
                onReject(M, D) {
                    if (!j()) return;
                    w(), q.logDecision({
                        decision: "reject",
                        source: {
                            type: "user_reject",
                            hasFeedback: !!M
                        }
                    }), H(q.cancelAndAbort(M, void 0, D))
                }
            }), CN1(J), q.toolUseContext.setAppState((M) => ({
                ...M,
                pendingWorkerRequest: {
                    toolName: q.tool.name,
                    toolUseId: q.toolUseID,
                    description: K
                }
            })), q.toolUseContext.abortController.signal.addEventListener("abort", () => {
                if (!j()) return;
                w(), q.logCancelled(), H(q.cancelAndAbort(void 0, !0))
            }, {
                once: !0
            })
        })
    } catch (w) {
        return _6(w instanceof Error ? w : Error(`Failed to submit swarm permission request: ${String(w)}`)), null
    }
}
// @from(Ln 503238, Col 4)
euq = E(() => {
    _b1();
    k1();
    Qz();
    Sf6();
    bf6()
})
// @from(Ln 503249, Col 0)
function Amq(A, q) {
    let {
        ctx: K,
        description: Y,
        result: z,
        awaitAutomatedChecksBeforeDialog: _,
        bridgeCallbacks: w
    } = A, {
        resolve: O,
        isResolved: $,
        claim: H
    } = zb1(q), j = !1, J, M, D = w ? lfz() : void 0, X = Date.now(), P = z.updatedInput ?? K.input;

    function W() {}
    if (K.pushToQueue({
            assistantMessage: K.assistantMessage,
            tool: K.tool,
            description: Y,
            input: P,
            toolUseContext: K.toolUseContext,
            toolUseID: K.toolUseID,
            permissionResult: z,
            permissionPromptStartTimeMs: X,
            ...{},
            onUserInteraction() {
                if (Date.now() - X < 200) return;
                j = !0, L96(K.toolUseID), W()
            },
            onDismissCheckmark() {
                if (J) {
                    if (clearTimeout(J), J = void 0, M) K.toolUseContext.abortController.signal.removeEventListener("abort", M), M = void 0;
                    K.removeFromQueue()
                }
            },
            onAbort() {
                if (!H()) return;
                if (w && D) w.sendResponse(D, {
                    behavior: "deny",
                    message: "User aborted"
                }), w.cancelRequest(D);
                K.logCancelled(), K.logDecision({
                    decision: "reject",
                    source: {
                        type: "user_abort"
                    }
                }, {
                    permissionPromptStartTimeMs: X
                }), O(K.cancelAndAbort(void 0, !0))
            },
            async onAllow(Z, G, f, v) {
                if (!H()) return;
                if (w && D) w.sendResponse(D, {
                    behavior: "allow",
                    updatedInput: Z,
                    updatedPermissions: G
                }), w.cancelRequest(D);
                O(await K.handleUserAllow(Z, G, f, X, v, z.decisionReason))
            },
            onReject(Z, G) {
                if (!H()) return;
                if (w && D) w.sendResponse(D, {
                    behavior: "deny",
                    message: Z ?? "User denied permission"
                }), w.cancelRequest(D);
                K.logDecision({
                    decision: "reject",
                    source: {
                        type: "user_reject",
                        hasFeedback: !!Z
                    }
                }, {
                    permissionPromptStartTimeMs: X
                }), O(K.cancelAndAbort(Z, void 0, G))
            },
            async recheckPermission() {
                if ($()) return;
                let Z = await tJ(K.tool, K.input, K.toolUseContext, K.assistantMessage, K.toolUseID);
                if (Z.behavior === "allow") {
                    if (!H()) return;
                    if (w && D) w.cancelRequest(D);
                    K.removeFromQueue(), K.logDecision({
                        decision: "accept",
                        source: "config"
                    }), O(K.buildAllow(Z.updatedInput ?? K.input))
                }
            }
        }), w && D && !K.tool.requiresUserInteraction?.()) {
        w.sendRequest(D, K.tool.name, ifz(K.tool.name, P), K.toolUseID, Y, z.suggestions, z.blockedPath);
        let Z = K.toolUseContext.abortController.signal,
            G = w.onResponse(D, (f) => {
                if (!H()) return;
                if (Z.removeEventListener("abort", G), L96(K.toolUseID), W(), K.removeFromQueue(), f.behavior === "allow") {
                    if (f.updatedPermissions?.length) K.persistPermissions(f.updatedPermissions);
                    K.logDecision({
                        decision: "accept",
                        source: {
                            type: "user",
                            permanent: !!f.updatedPermissions?.length
                        }
                    }, {
                        permissionPromptStartTimeMs: X
                    }), O(K.buildAllow(f.updatedInput ?? P))
                } else K.logDecision({
                    decision: "reject",
                    source: {
                        type: "user_reject",
                        hasFeedback: !!f.message
                    }
                }, {
                    permissionPromptStartTimeMs: X
                }), O(K.cancelAndAbort(f.message))
            });
        Z.addEventListener("abort", G, {
            once: !0
        })
    }
    if (!_)(async () => {
        if ($()) return;
        let Z = K.toolUseContext.getAppState(),
            G = await K.runHooks(Z.toolPermissionContext.mode, z.suggestions, z.updatedInput, X);
        if (!G || !H()) return;
        if (w && D) w.cancelRequest(D);
        K.removeFromQueue(), O(G)
    })()
}
// @from(Ln 503375, Col 0)
function ifz(A, q) {
    return q
}
// @from(Ln 503378, Col 4)
qmq = E(() => {
    V1();
    H1();
    o$();
    Ve();
    Bj();
    JZ();
    lO1();
    _b1();
    s8();
    VU();
    F9();
    Z7()
})
// @from(Ln 503393, Col 0)
function nfz(A, q) {
    return Kmq.useCallback(async (K, Y, z, _, w, O) => {
        return new Promise(($) => {
            let H = ruq(K, Y, z, _, w, q, ouq(A));
            if (H.resolveIfAborted($)) return;
            return (O !== void 0 ? Promise.resolve(O) : tJ(K, Y, z, _, w)).then(async (J) => {
                if (J.behavior === "allow") {
                    if (H.resolveIfAborted($)) return;
                    if (J.decisionReason?.type === "classifier" && J.decisionReason.classifier === "auto-mode") AW4(w, J.decisionReason.reason);
                    H.logDecision({
                        decision: "accept",
                        source: "config"
                    }), $(H.buildAllow(J.updatedInput ?? Y, {
                        decisionReason: J.decisionReason
                    }));
                    return
                }
                let M = z.getAppState(),
                    D = await K.description(Y, {
                        isNonInteractiveSession: z.options.isNonInteractiveSession,
                        toolPermissionContext: M.toolPermissionContext,
                        tools: z.options.tools
                    });
                if (H.resolveIfAborted($)) return;
                switch (J.behavior) {
                    case "deny": {
                        V01({
                            tool: K,
                            input: Y,
                            toolUseContext: z,
                            messageId: H.messageId,
                            toolUseID: w
                        }, {
                            decision: "reject",
                            source: "config"
                        }), $(J);
                        return
                    }
                    case "ask": {
                        if (M.toolPermissionContext.awaitAutomatedChecksBeforeDialog) {
                            let P = await auq({
                                ctx: H,
                                ...{},
                                updatedInput: J.updatedInput,
                                suggestions: J.suggestions,
                                permissionMode: M.toolPermissionContext.mode
                            });
                            if (P) {
                                $(P);
                                return
                            }
                        }
                        if (H.resolveIfAborted($)) return;
                        let X = await tuq({
                            ctx: H,
                            description: D,
                            ...{},
                            updatedInput: J.updatedInput,
                            suggestions: J.suggestions
                        });
                        if (X) {
                            $(X);
                            return
                        }
                        Amq({
                            ctx: H,
                            description: D,
                            result: J,
                            awaitAutomatedChecksBeforeDialog: M.toolPermissionContext.awaitAutomatedChecksBeforeDialog,
                            bridgeCallbacks: M.replBridgePermissionCallbacks
                        }, $);
                        return
                    }
                }
            }).catch((J) => {
                if (J instanceof oY || J instanceof Az) k(`Permission check threw ${J.constructor.name} for tool=${K.name}: ${J.message}`), H.logCancelled(), $(H.cancelAndAbort(void 0, !0));
                else _6(J), $(H.cancelAndAbort(void 0, !0))
            }).finally(() => {
                L96(w)
            })
        })
    }, [A, q])
}
// @from(Ln 503476, Col 4)
Kmq
// @from(Ln 503476, Col 9)
Ymq
// @from(Ln 503477, Col 4)
zmq = E(() => {
    Bj();
    V1();
    o$();
    s8();
    wv();
    Ve();
    k1();
    H1();
    g1();
    k01();
    _b1();
    suq();
    euq();
    qmq();
    JZ();
    Kmq = t(P6(), 1);
    Ymq = nfz
})
// @from(Ln 503497, Col 0)
function rfz() {
    fK(0)
}
// @from(Ln 503500, Col 0)
async function Ob1(A) {
    let {
        helpers: q,
        queryGuard: K,
        isExternalLoading: Y = !1,
        commands: z,
        onInputChange: _,
        setPastedContents: w,
        setToolJSX: O,
        getToolUseContext: $,
        messages: H,
        mainLoopModel: j,
        ideSelection: J,
        setUserInputOnProcessing: M,
        setAbortController: D,
        onQuery: X,
        setAppState: P,
        onBeforeQuery: W,
        canUseTool: Z,
        queuedCommands: G,
        uuid: f,
        skipSlashCommands: v
    } = A, {
        setCursorOffset: N,
        clearBuffer: V,
        resetHistory: L
    } = q;
    if (G?.length) {
        vp8(), await _mq({
            queuedCommands: G,
            messages: H,
            mainLoopModel: j,
            ideSelection: J,
            querySource: A.querySource,
            commands: z,
            queryGuard: K,
            setToolJSX: O,
            getToolUseContext: $,
            setUserInputOnProcessing: M,
            setAbortController: D,
            onQuery: X,
            setAppState: P,
            onBeforeQuery: W,
            resetHistory: L,
            canUseTool: Z,
            onInputChange: _
        });
        return
    }
    let h = A.input ?? "",
        R = A.mode ?? "prompt",
        u = A.pastedContents ?? {},
        I = Object.values(u).some((Q) => Q.type === "image");
    if (h.trim() === "" && !I) return;
    if (!v && ["exit", "quit", ":q", ":q!", ":wq", ":wq!"].includes(h.trim())) {
        if (z.find((U) => U.name === "exit")) Ob1({
            ...A,
            input: "/exit"
        });
        else rfz();
        return
    }
    let g = h,
        B = x06(h),
        b = 0;
    for (let Q of B) {
        let U = u[Q.id];
        if (U && U.type === "text") g = g.replace(Q.match, U.content), b++
    }
    if (d("tengu_paste_text", {
            pastedTextCount: b
        }), !v && g.trim().startsWith("/")) {
        let Q = g.trim(),
            U = Q.indexOf(" "),
            r = U === -1 ? Q.slice(1) : Q.slice(1, U),
            e = U === -1 ? "" : Q.slice(U + 1).trim(),
            Y6 = z.find((H6) => H6.immediate && H6.isEnabled() && (H6.name === r || H6.aliases?.includes(r) || H6.userFacingName() === r));
        if (Y6 && Y6.type === "local-jsx" && (K.isActive || Y)) {
            d("tengu_immediate_command_executed", {
                commandName: Y6.name
            }), _(""), N(0), w({}), V();
            let H6 = $(H, [], sK(), j),
                J6 = (X6, z6) => {
                    if (O({
                            jsx: null,
                            shouldHidePromptInput: !1,
                            clearLocalJSX: !0
                        }), X6 && z6?.display !== "skip" && A.addNotification) A.addNotification({
                        key: `immediate-${Y6.name}`,
                        text: X6,
                        priority: "immediate"
                    });
                    if (z6?.nextInput)
                        if (z6.submitNextInput) _0({
                            value: z6.nextInput,
                            mode: "prompt"
                        });
                        else _(z6.nextInput)
                },
                s = await (await Y6.load()).call(J6, H6, e);
            if (s) O({
                jsx: s,
                shouldHidePromptInput: !1,
                isLocalJSXCommand: !0
            });
            return
        }
    }
    if (K.isActive || Y) {
        if (R !== "prompt" && R !== "bash") return;
        if (A.hasInterruptibleToolInProgress) k(`[interrupt] Aborting current turn: streamMode=${A.streamMode}`), d("tengu_cancel", {
            source: "interrupt_on_submit",
            streamMode: A.streamMode
        }), A.abortController?.abort("interrupt");
        _0({
            value: g.trim(),
            mode: R,
            pastedContents: I ? u : void 0,
            skipSlashCommands: v,
            uuid: f
        }), _(""), N(0), w({}), L(), V();
        return
    }
    vp8(), await _mq({
        queuedCommands: [{
            value: g,
            mode: R,
            pastedContents: I ? u : void 0,
            skipSlashCommands: v,
            uuid: f
        }],
        messages: H,
        mainLoopModel: j,
        ideSelection: J,
        querySource: A.querySource,
        commands: z,
        queryGuard: K,
        setToolJSX: O,
        getToolUseContext: $,
        setUserInputOnProcessing: M,
        setAbortController: D,
        onQuery: X,
        setAppState: P,
        onBeforeQuery: W,
        resetHistory: L,
        canUseTool: Z,
        onInputChange: _
    })
}
// @from(Ln 503649, Col 0)
async function _mq(A) {
    let {
        messages: q,
        mainLoopModel: K,
        ideSelection: Y,
        querySource: z,
        queryGuard: _,
        setToolJSX: w,
        getToolUseContext: O,
        setUserInputOnProcessing: $,
        setAbortController: H,
        onQuery: j,
        setAppState: J,
        onBeforeQuery: M,
        resetHistory: D,
        canUseTool: X,
        queuedCommands: P
    } = A, W = sK();
    H(W);

    function Z() {
        return O(q, [], W, K)
    }
    try {
        _.reserve(), K5("query_process_user_input_start");
        let G = [],
            f = !1,
            v, N, V, L, h = P ?? [],
            R = h[0]?.workload,
            u = R !== void 0 && h.every((I) => I.workload === R) ? R : void 0;
        await aA1(u, async () => {
            for (let I = 0; I < h.length; I++) {
                let g = h[I],
                    B = I === 0,
                    b = await KI1({
                        input: g.value,
                        mode: g.mode,
                        setToolJSX: w,
                        context: Z(),
                        pastedContents: B ? g.pastedContents : void 0,
                        messages: q,
                        setUserInputOnProcessing: B ? $ : void 0,
                        isAlreadyProcessing: !B,
                        querySource: z,
                        canUseTool: X,
                        uuid: g.uuid,
                        ideSelection: B ? Y : void 0,
                        skipSlashCommands: g.skipSlashCommands,
                        isMeta: g.isMeta,
                        skipAttachments: !B
                    });
                if (g.origin) {
                    for (let p of b.messages)
                        if (p.type === "user") p.origin = g.origin
                }
                if (G.push(...b.messages), B) f = b.shouldQuery, v = b.allowedTools, N = b.model, V = b.nextInput, L = b.submitNextInput
            }
            if (K5("query_process_user_input_end"), iz()) K5("query_file_history_snapshot_start"), G.filter(XV6).forEach((I) => {
                lf6((g) => {
                    J((B) => ({
                        ...B,
                        fileHistory: g(B.fileHistory)
                    }))
                }, I.uuid)
            }), K5("query_file_history_snapshot_end");
            if (G.length) {
                D(), w({
                    jsx: null,
                    shouldHidePromptInput: !1,
                    clearLocalJSX: !0
                });
                let I = h[0],
                    g = I?.mode ?? "prompt",
                    B = I && typeof I.value === "string" ? I.value : void 0,
                    b = g === "prompt";
                await j(G, W, f, v ?? [], N ? Pl6(N, K) : K, b ? M : void 0, B)
            } else _.cancelReservation(), w({
                jsx: null,
                shouldHidePromptInput: !1,
                clearLocalJSX: !0
            }), D(), H(null);
            if (V)
                if (L) _0({
                    value: V,
                    mode: "prompt"
                });
                else A.onInputChange(V)
        })
    } finally {
        _.cancelReservation(), $(void 0)
    }
}
// @from(Ln 503741, Col 4)
wmq = E(() => {
    aH();
    E76();
    ZI();
    V1();
    H1();
    U$();
    Ks8();
    JN();
    zI1();
    c_();
    qv6();
    z4()
})
// @from(Ln 503756, Col 0)
function Omq(A) {
    if (typeof A.value === "string") return A.value.trim().startsWith("/");
    for (let q of A.value)
        if (q.type === "text") return q.text.trim().startsWith("/");
    return !1
}
// @from(Ln 503763, Col 0)
function $mq({
    executeInput: A
}) {
    let q = KY4();
    if (!q) return {
        processed: !1
    };
    if (Omq(q) || q.mode === "bash") {
        let z = lP1();
        return A([z]), {
            processed: !0
        }
    }
    let K = q.mode,
        Y = iP1((z) => !Omq(z) && z.mode === K);
    if (Y.length === 0) return {
        processed: !1
    };
    return A(Y), {
        processed: !0
    }
}
// @from(Ln 503785, Col 4)
Hmq = E(() => {
    aH()
})
// @from(Ln 503789, Col 0)
function jmq({
    executeQueuedInput: A,
    hasActiveLocalJsxUI: q,
    queryGuard: K
}) {
    let Y = Sa6.useSyncExternalStore(K.subscribe, K.getSnapshot),
        z = Sa6.useSyncExternalStore(hW6, cP1);
    Sa6.useEffect(() => {
        if (Y) return;
        if (q) return;
        if (z.length === 0) return;
        $mq({
            executeInput: A
        })
    }, [z, Y, A, q, K])
}
// @from(Ln 503805, Col 4)
Sa6
// @from(Ln 503806, Col 4)
Jmq = E(() => {
    Hmq();
    aH();
    Sa6 = t(P6(), 1)
})
// @from(Ln 503812, Col 0)
function Mmq({
    isLoading: A,
    onSubmitMessage: q
}) {
    let K = l84(),
        Y = W86.useMemo(() => K.subscribe.bind(K), [K]),
        z = W86.useCallback(() => K.revision, [K]),
        _ = W86.useSyncExternalStore(Y, z);
    W86.useEffect(() => {
        if (A) return;
        let w = K.poll();
        if (w) q(w.content)
    }, [A, _, K, q])
}
// @from(Ln 503826, Col 4)
W86
// @from(Ln 503827, Col 4)
Dmq = E(() => {
    uT8();
    W86 = t(P6(), 1)
})
// @from(Ln 503832, Col 0)
function gt8(A, q) {
    if (A && q && q.length > 0) return K0([...A, ...q], "name");
    return A || []
}
// @from(Ln 503837, Col 0)
function Pmq(A, q) {
    return Xmq.useMemo(() => gt8(A, q), [A, q])
}
// @from(Ln 503840, Col 4)
Xmq
// @from(Ln 503841, Col 4)
Wmq = E(() => {
    dd();
    Xmq = t(P6(), 1)
})
// @from(Ln 503846, Col 0)
function Ft8(A, q) {
    return Zmq.useMemo(() => {
        if (q.length > 0) return K0([...A, ...q], "name");
        return A
    }, [A, q])
}
// @from(Ln 503852, Col 4)
Zmq
// @from(Ln 503853, Col 4)
Gmq = E(() => {
    dd();
    Zmq = t(P6(), 1)
})
// @from(Ln 503858, Col 0)
function fmq(A, q) {
    let K = mV6.useCallback(async () => {
        if (!A) return;
        try {
            oB();
            let z = await I0(A);
            q(z)
        } catch (z) {
            if (z instanceof Error) _6(z)
        }
    }, [A, q]);
    mV6.useEffect(() => YV6.subscribe(K), [K]);
    let Y = mV6.useCallback(async () => {
        if (!A) return;
        try {
            Cr6();
            let z = await I0(A);
            q(z)
        } catch (z) {
            if (z instanceof Error) _6(z)
        }
    }, [A, q]);
    mV6.useEffect(() => Hc6(Y), [Y])
}
// @from(Ln 503882, Col 4)
mV6
// @from(Ln 503883, Col 4)
Tmq = E(() => {
    fC1();
    D$();
    k1();
    HA();
    mV6 = t(P6(), 1)
})
// @from(Ln 503891, Col 0)
function $b1({
    enabled: A = !0
} = {}) {
    let q = xA(),
        K = M1((_) => _.plugins.needsRefresh),
        {
            addNotification: Y
        } = o4(),
        z = Ca6.useCallback(async () => {
            try {
                let {
                    enabled: _,
                    disabled: w,
                    errors: O
                } = await _z();
                await FL1();
                let $ = nv6();
                if (Object.keys($).length > 0) Y({
                    key: "plugin-delisted-flagged",
                    text: "Plugins flagged. Check /plugins",
                    color: "warning",
                    priority: "high"
                });
                let H = [],
                    j = [];
                try {
                    H = await w96()
                } catch (W) {
                    let Z = W instanceof Error ? W.message : String(W);
                    O.push({
                        type: "generic-error",
                        source: "plugin-commands",
                        error: `Failed to load plugin commands: ${Z}`
                    })
                }
                try {
                    j = await KQ6()
                } catch (W) {
                    let Z = W instanceof Error ? W.message : String(W);
                    O.push({
                        type: "generic-error",
                        source: "plugin-agents",
                        error: `Failed to load plugin agents: ${Z}`
                    })
                }
                try {
                    await nB()
                } catch (W) {
                    let Z = W instanceof Error ? W.message : String(W);
                    O.push({
                        type: "generic-error",
                        source: "plugin-hooks",
                        error: `Failed to load plugin hooks: ${Z}`
                    })
                }
                let M = (await Promise.all(_.map(async (W) => {
                        if (W.mcpServers) return Object.keys(W.mcpServers).length;
                        let Z = await He(W, O);
                        if (Z) W.mcpServers = Z;
                        return Z ? Object.keys(Z).length : 0
                    }))).reduce((W, Z) => W + Z, 0),
                    X = (await Promise.all(_.map(async (W) => {
                        if (W.lspServers) return Object.keys(W.lspServers).length;
                        let Z = await Nl6(W, O);
                        if (Z) W.lspServers = Z;
                        return Z ? Object.keys(Z).length : 0
                    }))).reduce((W, Z) => W + Z, 0);
                dV1(), q((W) => {
                    let Z = W.plugins.errors.filter((N) => N.source === "lsp-manager" || N.source.startsWith("plugin:")),
                        G = new Set(O.map((N) => N.type === "generic-error" ? `generic-error:${N.source}:${N.error}` : `${N.type}:${N.source}`)),
                        v = [...Z.filter((N) => {
                            let V = N.type === "generic-error" ? `generic-error:${N.source}:${N.error}` : `${N.type}:${N.source}`;
                            return !G.has(V)
                        }), ...O];
                    return {
                        ...W,
                        plugins: {
                            ...W.plugins,
                            enabled: _,
                            disabled: w,
                            commands: H,
                            errors: v
                        }
                    }
                }), k(`Loaded plugins - Enabled: ${_.length}, Disabled: ${w.length}, Commands: ${H.length}, Agents: ${j.length}, Errors: ${O.length}`);
                let P = _.reduce((W, Z) => {
                    if (!Z.hooksConfig) return W;
                    return W + Object.values(Z.hooksConfig).reduce((G, f) => G + (f?.reduce((v, N) => v + N.hooks.length, 0) ?? 0), 0)
                }, 0);
                return {
                    enabled_count: _.length,
                    disabled_count: w.length,
                    inline_count: _.filter((W) => W.source.endsWith("@inline")).length,
                    marketplace_count: _.filter((W) => !W.source.endsWith("@inline")).length,
                    error_count: O.length,
                    skill_count: H.length,
                    agent_count: j.length,
                    hook_count: P,
                    mcp_count: M,
                    lsp_count: X,
                    ant_enabled_names: void 0
                }
            } catch (_) {
                let w = _ instanceof Error ? _ : Error(String(_));
                return _6(w), k(`Error loading plugins: ${_}`), q((O) => {
                    let $ = O.plugins.errors.filter((j) => j.source === "lsp-manager" || j.source.startsWith("plugin:")),
                        H = {
                            type: "generic-error",
                            source: "plugin-system",
                            error: w.message
                        };
                    return {
                        ...O,
                        plugins: {
                            ...O.plugins,
                            enabled: [],
                            disabled: [],
                            commands: [],
                            errors: [...$, H]
                        }
                    }
                }), {
                    enabled_count: 0,
                    disabled_count: 0,
                    inline_count: 0,
                    marketplace_count: 0,
                    error_count: 1,
                    skill_count: 0,
                    agent_count: 0,
                    hook_count: 0,
                    mcp_count: 0,
                    lsp_count: 0,
                    load_failed: !0,
                    ant_enabled_names: void 0
                }
            }
        }, [q, Y]);
    Ca6.useEffect(() => {
        if (!A) return;
        z().then((_) => {
            let {
                ant_enabled_names: w,
                ...O
            } = _, $ = {
                ...O,
                has_custom_plugin_cache_dir: !!process.env.CLAUDE_CODE_PLUGIN_CACHE_DIR
            };
            d("tengu_plugins_loaded", {
                ...$,
                ...w ? {
                    enabled_names: w
                } : {}
            }), U1("info", "tengu_plugins_loaded", $)
        })
    }, [z, A]), Ca6.useEffect(() => {
        if (!A || !K) return;
        Y({
            key: "plugin-reload-pending",
            text: "Plugins changed. Run /reload-plugins to activate.",
            color: "suggestion",
            priority: "low"
        })
    }, [A, K, Y])
}
// @from(Ln 504055, Col 4)
Ca6
// @from(Ln 504056, Col 4)
pt8 = E(() => {
    NA();
    tH();
    cp6();
    s01();
    O96();
    jQ6();
    gV1();
    Ib();
    H1();
    k1();
    V1();
    u_();
    pL1();
    gL1();
    wz();
    Ca6 = t(P6(), 1)
})
// @from(Ln 504075, Col 0)
function vmq() {
    let A = A6(14),
        q = M1(ofz);
    if (!q) return null;
    let K;
    if (A[0] !== q.identity.color) K = G0(q.identity.color), A[0] = q.identity.color, A[1] = K;
    else K = A[1];
    let Y = K,
        z;
    if (A[2] === Symbol.for("react.memo_cache_sentinel")) z = zT.createElement(T, null, "Viewing "), A[2] = z;
    else z = A[2];
    let _;
    if (A[3] !== Y || A[4] !== q.identity.agentName) _ = zT.createElement(T, {
        color: Y,
        bold: !0
    }, "@", q.identity.agentName), A[3] = Y, A[4] = q.identity.agentName, A[5] = _;
    else _ = A[5];
    let w;
    if (A[6] === Symbol.for("react.memo_cache_sentinel")) w = zT.createElement(T, {
        dimColor: !0
    }, " · ", zT.createElement(a1, {
        shortcut: "esc",
        action: "return"
    })), A[6] = w;
    else w = A[6];
    let O;
    if (A[7] !== _) O = zT.createElement(m, null, z, _, w), A[7] = _, A[8] = O;
    else O = A[8];
    let $;
    if (A[9] !== q.prompt) $ = zT.createElement(T, {
        dimColor: !0
    }, q.prompt), A[9] = q.prompt, A[10] = $;
    else $ = A[10];
    let H;
    if (A[11] !== O || A[12] !== $) H = zT.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, O, $), A[11] = O, A[12] = $, A[13] = H;
    else H = A[13];
    return H
}
// @from(Ln 504117, Col 0)
function ofz(A) {
    return vR(A)
}
// @from(Ln 504120, Col 4)
zT
// @from(Ln 504121, Col 4)
Nmq = E(() => {
    e6();
    i6();
    NA();
    p36();
    kc();
    Lq();
    zT = t(P6(), 1)
})
// @from(Ln 504131, Col 0)
function Vmq(A, q) {
    let K = Ia6.useRef(!1),
        Y = Ia6.useRef(null);
    Ia6.useEffect(() => {
        let z = Gv(A);
        if (Y.current !== (z ?? null)) K.current = !1, Y.current = z || null, q({
            lineCount: 0,
            lineStart: void 0,
            text: void 0,
            filePath: void 0
        });
        if (K.current || !z) return;
        let _ = (w) => {
            if (w.selection?.start && w.selection?.end) {
                let {
                    start: O,
                    end: $
                } = w.selection, H = $.line - O.line + 1;
                if ($.character === 0) H--;
                let j = {
                    lineCount: H,
                    lineStart: O.line,
                    text: w.text,
                    filePath: w.filePath
                };
                q(j)
            }
        };
        z.client.setNotificationHandler(afz(), (w) => {
            if (Y.current !== z) return;
            try {
                let O = w.params;
                if (O.selection && O.selection.start && O.selection.end) _(O);
                else if (O.text !== void 0) _({
                    selection: null,
                    text: O.text,
                    filePath: O.filePath
                })
            } catch (O) {
                _6(O)
            }
        }), K.current = !0
    }, [A, q])
}
// @from(Ln 504175, Col 4)
Ia6
// @from(Ln 504175, Col 9)
afz
// @from(Ln 504176, Col 4)
kmq = E(() => {
    K7();
    Sw();
    k1();
    Ia6 = t(P6(), 1), afz = F6(() => C.object({
        method: C.literal("selection_changed"),
        params: C.object({
            selection: C.object({
                start: C.object({
                    line: C.number(),
                    character: C.number()
                }),
                end: C.object({
                    line: C.number(),
                    character: C.number()
                })
            }).nullable().optional(),
            text: C.string().optional(),
            filePath: C.string().optional()
        })
    }))
})
// @from(Ln 504202, Col 0)
function Hb1(A) {
    if (eP()) return;
    if ($Y()) return i3();
    if (KZ(A.teamContext)) {
        let q = A.teamContext.leadAgentId;
        return A.teamContext.teammates[q]?.name || "team-lead"
    }
    return
}
// @from(Ln 504212, Col 0)
function ymq({
    enabled: A,
    isLoading: q,
    focusedInputDialog: K,
    onSubmitMessage: Y
}) {
    let z = Y,
        _ = S5(),
        w = xA(),
        O = M1((M) => M.inbox.messages.length),
        $ = Vm(),
        H = y26.useCallback(async () => {
            if (!A) return;
            let M = _.getState(),
                D = Hb1(M);
            if (!D) return;
            let X = await pY6(D, M.teamContext?.teamName);
            if (X.length === 0) return;
            if (k(`[InboxPoller] Found ${X.length} unread message(s)`), $Y() && NF6())
                for (let g of X) {
                    let B = Zf6(g.text);
                    if (B && g.from === "team-lead")
                        if (k(`[InboxPoller] Received plan approval response from team-lead: approved=${B.approved}`), B.approved) {
                            let b = B.permissionMode ?? "default";
                            w((p) => ({
                                ...p,
                                toolPermissionContext: Ez(p.toolPermissionContext, {
                                    type: "setMode",
                                    mode: _C(b),
                                    destination: "session"
                                })
                            })), k(`[InboxPoller] Plan approved by team lead, exited plan mode to ${b}`)
                        } else k(`[InboxPoller] Plan rejected by team lead: ${B.feedback||"No feedback provided"}`);
                    else if (B) k(`[InboxPoller] Ignoring plan approval response from non-team-lead: ${g.from}`)
                }
            let P = () => {
                    kc6(D, M.teamContext?.teamName)
                },
                W = [],
                Z = [],
                G = [],
                f = [],
                v = [],
                N = [],
                V = [],
                L = [],
                h = [],
                R = [];
            for (let g of X) {
                let B = Lc6(g.text),
                    b = QY6(g.text),
                    p = nv1(g.text),
                    Q = Rc6(g.text),
                    U = M66(g.text),
                    r = Lf(g.text),
                    e = sv1(g.text),
                    Y6 = ev1(g.text),
                    H6 = UY6(g.text);
                if (B) W.push(g);
                else if (b) Z.push(g);
                else if (p) G.push(g);
                else if (Q) f.push(g);
                else if (U) v.push(g);
                else if (r) N.push(g);
                else if (e) V.push(g);
                else if (Y6) L.push(g);
                else if (H6) h.push(g);
                else R.push(g)
            }
            if (W.length > 0 && KZ(M.teamContext)) {
                k(`[InboxPoller] Found ${W.length} permission request(s)`);
                let g = Dl(),
                    B = M.teamContext?.teamName;
                for (let p of W) {
                    let Q = Lc6(p.text);
                    if (!Q) continue;
                    if (g) {
                        let U = dK(ng(), Q.tool_name);
                        if (!U) {
                            k(`[InboxPoller] Unknown tool ${Q.tool_name}, skipping permission request`);
                            continue
                        }
                        let r = {
                            assistantMessage: $Z({
                                content: ""
                            }),
                            tool: U,
                            description: Q.description,
                            input: Q.input,
                            toolUseContext: {},
                            toolUseID: Q.tool_use_id,
                            permissionResult: {
                                behavior: "ask",
                                message: Q.description
                            },
                            permissionPromptStartTimeMs: Date.now(),
                            workerBadge: {
                                name: Q.agent_id,
                                color: "cyan"
                            },
                            onUserInteraction() {},
                            onAbort() {
                                IN1(Q.agent_id, {
                                    decision: "rejected",
                                    resolvedBy: "leader"
                                }, Q.request_id, B)
                            },
                            onAllow(e, Y6) {
                                IN1(Q.agent_id, {
                                    decision: "approved",
                                    resolvedBy: "leader",
                                    updatedInput: e,
                                    permissionUpdates: Y6
                                }, Q.request_id, B)
                            },
                            onReject(e) {
                                IN1(Q.agent_id, {
                                    decision: "rejected",
                                    resolvedBy: "leader",
                                    feedback: e
                                }, Q.request_id, B)
                            },
                            async recheckPermission() {}
                        };
                        g((e) => {
                            if (e.some((Y6) => Y6.toolUseID === Q.tool_use_id)) return e;
                            return [...e, r]
                        })
                    } else k(`[InboxPoller] ToolUseConfirmQueue unavailable, dropping permission request from ${Q.agent_id}`)
                }
                let b = Lc6(W[0]?.text ?? "");
                if (b && !q && !K) Hg({
                    message: `${b.agent_id} needs permission for ${b.tool_name}`,
                    notificationType: "worker_permission_prompt"
                }, $)
            }
            if (Z.length > 0 && $Y()) {
                k(`[InboxPoller] Found ${Z.length} permission response(s)`);
                for (let g of Z) {
                    let B = QY6(g.text);
                    if (!B) continue;
                    if (Ai4(B.request_id))
                        if (k(`[InboxPoller] Processing permission response for ${B.request_id}: ${B.subtype}`), B.subtype === "success") If6({
                            requestId: B.request_id,
                            decision: "approved",
                            updatedInput: B.response?.updated_input,
                            permissionUpdates: B.response?.permission_updates
                        });
                        else If6({
                            requestId: B.request_id,
                            decision: "rejected",
                            feedback: B.error
                        })
                }
            }
            if (G.length > 0 && KZ(M.teamContext)) {
                k(`[InboxPoller] Found ${G.length} sandbox permission request(s)`);
                let g = [];
                for (let B of G) {
                    let b = nv1(B.text);
                    if (!b) continue;
                    if (!b.hostPattern?.host) {
                        k("[InboxPoller] Invalid sandbox permission request: missing hostPattern.host");
                        continue
                    }
                    g.push({
                        requestId: b.requestId,
                        workerId: b.workerId,
                        workerName: b.workerName,
                        workerColor: b.workerColor,
                        host: b.hostPattern.host,
                        createdAt: b.createdAt
                    })
                }
                if (g.length > 0) {
                    w((b) => ({
                        ...b,
                        workerSandboxPermissions: {
                            ...b.workerSandboxPermissions,
                            queue: [...b.workerSandboxPermissions.queue, ...g]
                        }
                    }));
                    let B = g[0];
                    if (B && !q && !K) Hg({
                        message: `${B.workerName} needs network access to ${B.host}`,
                        notificationType: "worker_permission_prompt"
                    }, $)
                }
            }
            if (f.length > 0 && $Y()) {
                k(`[InboxPoller] Found ${f.length} sandbox permission response(s)`);
                for (let g of f) {
                    let B = Rc6(g.text);
                    if (!B) continue;
                    if (Yi4(B.requestId)) k(`[InboxPoller] Processing sandbox permission response for ${B.requestId}: allow=${B.allow}`), zi4({
                        requestId: B.requestId,
                        host: B.host,
                        allow: B.allow
                    }), w((b) => ({
                        ...b,
                        pendingSandboxRequest: null
                    }))
                }
            }
            if (V.length > 0 && $Y()) {
                k(`[InboxPoller] Found ${V.length} team permission update(s)`);
                for (let g of V) {
                    let B = sv1(g.text);
                    if (!B) {
                        k(`[InboxPoller] Failed to parse team permission update: ${g.text.substring(0,100)}`);
                        continue
                    }
                    if (!B.permissionUpdate?.rules || !B.permissionUpdate?.behavior) {
                        k("[InboxPoller] Invalid team permission update: missing permissionUpdate.rules or permissionUpdate.behavior");
                        continue
                    }
                    k(`[InboxPoller] Applying team permission update: ${B.toolName} allowed in ${B.directoryPath}`), k(`[InboxPoller] Permission update rules: ${B6(B.permissionUpdate.rules)}`), w((b) => {
                        let p = Ez(b.toolPermissionContext, {
                            type: "addRules",
                            rules: B.permissionUpdate.rules,
                            behavior: B.permissionUpdate.behavior,
                            destination: "session"
                        });
                        return k(`[InboxPoller] Updated session allow rules: ${B6(p.alwaysAllowRules.session)}`), {
                            ...b,
                            toolPermissionContext: p
                        }
                    })
                }
            }
            if (L.length > 0 && $Y()) {
                k(`[InboxPoller] Found ${L.length} mode set request(s)`);
                for (let g of L) {
                    if (g.from !== "team-lead") {
                        k(`[InboxPoller] Ignoring mode set request from non-team-lead: ${g.from}`);
                        continue
                    }
                    let B = ev1(g.text);
                    if (!B) {
                        k(`[InboxPoller] Failed to parse mode set request: ${g.text.substring(0,100)}`);
                        continue
                    }
                    let b = wC(B.mode);
                    k(`[InboxPoller] Applying mode change from team-lead: ${b}`), w((U) => ({
                        ...U,
                        toolPermissionContext: Ez(U.toolPermissionContext, {
                            type: "setMode",
                            mode: _C(b),
                            destination: "session"
                        })
                    }));
                    let p = M.teamContext?.teamName,
                        Q = i3();
                    if (p && Q) xZ6(p, Q, b)
                }
            }
            if (h.length > 0 && KZ(M.teamContext)) {
                k(`[InboxPoller] Found ${h.length} plan approval request(s), auto-approving`);
                let g = M.teamContext?.teamName,
                    B = _C(M.toolPermissionContext.mode),
                    b = B === "plan" ? "default" : B;
                for (let p of h) {
                    let Q = UY6(p.text);
                    if (!Q) continue;
                    let U = {
                        type: "plan_approval_response",
                        requestId: Q.requestId,
                        approved: !0,
                        timestamp: new Date().toISOString(),
                        permissionMode: b
                    };
                    x3(p.from, {
                        from: BY,
                        text: B6(U),
                        timestamp: new Date().toISOString()
                    }, g);
                    let r = ik1(p.from, M);
                    if (r) k1q(r, {
                        type: "plan_approval_response",
                        requestId: Q.requestId,
                        approved: !0,
                        timestamp: new Date().toISOString(),
                        permissionMode: b
                    }, w);
                    k(`[InboxPoller] Auto-approved plan from ${p.from} (request ${Q.requestId})`), R.push(p)
                }
            }
            if (v.length > 0 && $Y()) {
                k(`[InboxPoller] Found ${v.length} shutdown request(s)`);
                for (let g of v) R.push(g)
            }
            if (N.length > 0 && KZ(M.teamContext)) {
                k(`[InboxPoller] Found ${N.length} shutdown approval(s)`);
                for (let g of N) {
                    let B = Lf(g.text);
                    if (!B) continue;
                    if (B.paneId && B.backendType)(async () => {
                        try {
                            await k66();
                            let p = await yb(),
                                U = await fu8(B.backendType)?.killPane(B.paneId, !p);
                            k(`[InboxPoller] Killed pane ${B.paneId} for ${B.from}: ${U}`)
                        } catch (p) {
                            k(`[InboxPoller] Failed to kill pane for ${B.from}: ${p}`)
                        }
                    })();
                    let b = B.from;
                    if (b && M.teamContext?.teammates) {
                        let p = Object.entries(M.teamContext.teammates).find(([, Q]) => Q.name === b)?.[0];
                        if (p) {
                            let Q = M.teamContext?.teamName;
                            if (Q) g96(Q, {
                                agentId: p,
                                name: b
                            });
                            let {
                                notificationMessage: U
                            } = Q ? await ft(Q, p, b, "shutdown") : {
                                notificationMessage: `${b} has shut down.`
                            };
                            w((r) => {
                                if (!r.teamContext?.teammates) return r;
                                if (!(p in r.teamContext.teammates)) return r;
                                let {
                                    [p]: e, ...Y6
                                } = r.teamContext.teammates, H6 = {
                                    ...r.tasks
                                };
                                for (let [J6, K6] of Object.entries(H6))
                                    if (M$(K6) && K6.identity.agentId === p) H6[J6] = {
                                        ...K6,
                                        status: "completed",
                                        endTime: Date.now()
                                    };
                                return {
                                    ...r,
                                    tasks: H6,
                                    teamContext: {
                                        ...r.teamContext,
                                        teammates: Y6
                                    },
                                    inbox: {
                                        messages: [...r.inbox.messages, {
                                            id: Emq(),
                                            from: "system",
                                            text: B6({
                                                type: "teammate_terminated",
                                                message: U
                                            }),
                                            timestamp: new Date().toISOString(),
                                            status: "pending"
                                        }]
                                    }
                                }
                            }), k(`[InboxPoller] Removed ${b} (${p}) from teamContext`)
                        }
                    }
                    R.push(g)
                }
            }
            if (R.length === 0) {
                P();
                return
            }
            let u = R.map((g) => {
                    let B = g.color ? ` color="${g.color}"` : "",
                        b = g.summary ? ` summary="${g.summary}"` : "",
                        p = g.text;
                    return `<${fj} teammate_id="${g.from}"${B}${b}>
${p}
</${fj}>`
                }).join(`

`),
                I = () => {
                    w((g) => ({
                        ...g,
                        inbox: {
                            messages: [...g.inbox.messages, ...R.map((B) => ({
                                id: Emq(),
                                from: B.from,
                                text: B.text,
                                timestamp: B.timestamp,
                                status: "pending",
                                color: B.color,
                                summary: B.summary
                            }))]
                        }
                    }))
                };
            if (!q && !K) {
                if (k("[InboxPoller] Session idle, submitting immediately"), !z(u)) k("[InboxPoller] Submission rejected, queuing for later delivery"), I()
            } else k("[InboxPoller] Session busy, queuing for later delivery"), I();
            P()
        }, [A, q, K, z, w, $, _]);
    y26.useEffect(() => {
        if (!A) return;
        if (q || K) return;
        let M = _.getState();
        if (!Hb1(M)) return;
        let X = M.inbox.messages.filter((G) => G.status === "pending"),
            P = M.inbox.messages.filter((G) => G.status === "processed");
        if (P.length > 0) {
            k(`[InboxPoller] Cleaning up ${P.length} processed message(s) that were delivered mid-turn`);
            let G = new Set(P.map((f) => f.id));
            w((f) => ({
                ...f,
                inbox: {
                    messages: f.inbox.messages.filter((v) => !G.has(v.id))
                }
            }))
        }
        if (X.length === 0) return;
        k(`[InboxPoller] Session idle, delivering ${X.length} pending message(s)`);
        let W = X.map((G) => {
            let f = G.color ? ` color="${G.color}"` : "",
                v = G.summary ? ` summary="${G.summary}"` : "";
            return `<${fj} teammate_id="${G.from}"${f}${v}>
${G.text}
</${fj}>`
        }).join(`

`);
        if (z(W)) {
            let G = new Set(X.map((f) => f.id));
            w((f) => ({
                ...f,
                inbox: {
                    messages: f.inbox.messages.filter((v) => !G.has(v.id))
                }
            }))
        } else k("[InboxPoller] Submission rejected, keeping messages queued")
    }, [A, q, K, z, w, O, _]);
    let j = A && !!Hb1(_.getState());
    OX(() => void H(), j ? sfz : null);
    let J = y26.useRef(!1);
    y26.useEffect(() => {
        if (!A) return;
        if (J.current) return;
        if (Hb1(_.getState())) J.current = !0, H()
    }, [A, H, _])
}
// @from(Ln 504654, Col 4)
y26
// @from(Ln 504654, Col 9)
sfz = 1000
// @from(Ln 504655, Col 4)
Lmq = E(() => {
    Pv();
    qH();
    zz();
    qZ();
    vz();
    F$();
    rD();
    vf();
    H1();
    NA();
    DU6();
    Hs();
    Sf6();
    g1();
    bf6();
    IX();
    JA();
    wh();
    ig();
    Bw();
    sg8();
    y26 = t(P6(), 1)
})
// @from(Ln 504679, Col 4)
Rmq
// @from(Ln 504680, Col 4)
hmq = E(() => {
    Bw();
    H1();
    Rmq = t(P6(), 1)
})
// @from(Ln 504686, Col 0)
function Cmq(A) {
    let q = A6(7),
        {
            autoConnectIdeFlag: K,
            ideToInstallExtension: Y,
            setDynamicMcpConfig: z,
            setShowIdeOnboarding: _,
            setIDEInstallationState: w
        } = A,
        O, $;
    if (q[0] !== K || q[1] !== Y || q[2] !== z || q[3] !== w || q[4] !== _) O = () => {
        HR7(function(J) {
            if (!J) return;
            if (!((X1().autoConnectIde || K || FM() || Y || t6(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE)) && !xz(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE))) return;
            z((X) => {
                if (X?.ide) return X;
                return {
                    ...X,
                    ide: {
                        type: J.url.startsWith("ws:") ? "ws-ide" : "sse-ide",
                        url: J.url,
                        ideName: J.name,
                        authToken: J.authToken,
                        ideRunningInWindows: J.ideRunningInWindows,
                        scope: "dynamic"
                    }
                }
            })
        }, Y, () => _(!0), (j) => w(j))
    }, $ = [K, Y, z, _, w], q[0] = K, q[1] = Y, q[2] = z, q[3] = w, q[4] = _, q[5] = O, q[6] = $;
    else O = q[5], $ = q[6];
    Smq.useEffect(O, $)
}
// @from(Ln 504719, Col 4)
Smq
// @from(Ln 504720, Col 4)
Imq = E(() => {
    e6();
    k8();
    Sw();
    A8();
    Smq = t(P6(), 1)
})
// @from(Ln 504728, Col 0)
function xmq(A) {
    let q = A6(8),
        {
            onBackgroundSession: K,
            isLoading: Y
        } = A,
        z = xA(),
        _ = S5(),
        [w, O] = bmq.useState(!1),
        $ = gC(O, K, tfz),
        H;
    if (q[0] !== _ || q[1] !== $ || q[2] !== Y || q[3] !== z) H = () => {
        if (t6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)) return;
        let P = _.getState();
        if ($l4(P)) fN1(() => _.getState(), z);
        else if (t6("false") && Y) $()
    }, q[0] = _, q[1] = $, q[2] = Y, q[3] = z, q[4] = H;
    else H = q[4];
    let j = H,
        J;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Task"
    }, q[5] = J;
    else J = q[5];
    D8("task:background", j, J);
    let M = Rq("task:background", "Task", "ctrl+b"),
        D = Q8.terminal === "tmux" && M === "ctrl+b" ? "ctrl+b ctrl+b" : M;
    if (!Y || !w) return null;
    let X;
    if (q[6] !== D) X = L26.createElement(m, {
        paddingLeft: 2
    }, L26.createElement(T, {
        dimColor: !0
    }, L26.createElement(a1, {
        shortcut: D,
        action: "background"
    }))), q[6] = D, q[7] = X;
    else X = q[7];
    return X
}
// @from(Ln 504769, Col 0)
function tfz() {}
// @from(Ln 504770, Col 4)
L26
// @from(Ln 504770, Col 9)
bmq
// @from(Ln 504771, Col 4)
umq = E(() => {
    e6();
    i6();
    du6();
    NA();
    Rf6();
    Lq();
    d3();
    A8();
    _7();
    Rj();
    L26 = t(P6(), 1), bmq = t(P6(), 1)
})
// @from(Ln 504785, Col 0)
function mmq({
    setMessages: A,
    setIsLoading: q,
    resetLoadingState: K,
    setAbortController: Y,
    onBackgroundQuery: z
}) {
    let _ = M1((J) => J.foregroundedTaskId),
        w = M1((J) => J.tasks),
        O = xA(),
        $ = BV6.useRef(0),
        H = BV6.useCallback(() => {
            if (_) {
                O((J) => {
                    let M = J.foregroundedTaskId;
                    if (!M) return J;
                    let D = J.tasks[M];
                    if (!D) return {
                        ...J,
                        foregroundedTaskId: void 0
                    };
                    return {
                        ...J,
                        foregroundedTaskId: void 0,
                        tasks: {
                            ...J.tasks,
                            [M]: {
                                ...D,
                                isBackgrounded: !0
                            }
                        }
                    }
                }), A([]), K(), Y(null);
                return
            }
            z()
        }, [_, O, A, K, Y, z]),
        j = _ ? w[_] : void 0;
    return BV6.useEffect(() => {
        if (!_) {
            $.current = 0;
            return
        }
        if (!j || j.type !== "local_agent") {
            O((M) => ({
                ...M,
                foregroundedTaskId: void 0
            })), K(), $.current = 0;
            return
        }
        let J = j.messages ?? [];
        if (J.length !== $.current) $.current = J.length, A([...J]);
        if (j.status === "running") {
            let M = j.abortController;
            if (M?.signal.aborted) {
                O((D) => {
                    if (!D.foregroundedTaskId) return D;
                    let X = D.tasks[D.foregroundedTaskId];
                    if (!X) return {
                        ...D,
                        foregroundedTaskId: void 0
                    };
                    return {
                        ...D,
                        foregroundedTaskId: void 0,
                        tasks: {
                            ...D.tasks,
                            [D.foregroundedTaskId]: {
                                ...X,
                                isBackgrounded: !0
                            }
                        }
                    }
                }), K(), Y(null), $.current = 0;
                return
            }
            if (q(!0), M) Y(M)
        } else O((M) => {
            let D = M.foregroundedTaskId;
            if (!D) return M;
            let X = M.tasks[D];
            if (!X) return {
                ...M,
                foregroundedTaskId: void 0
            };
            return {
                ...M,
                foregroundedTaskId: void 0,
                tasks: {
                    ...M.tasks,
                    [D]: {
                        ...X,
                        isBackgrounded: !0
                    }
                }
            }
        }), K(), Y(null), $.current = 0
    }, [_, j, O, A, q, K, Y]), {
        handleBackgroundSession: H
    }
}
// @from(Ln 504886, Col 4)
BV6
// @from(Ln 504887, Col 4)
Bmq = E(() => {
    NA();
    BV6 = t(P6(), 1)
})
// @from(Ln 504892, Col 0)
function gmq(A) {
    let q = A6(18),
        {
            model: K,
            onDone: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = Sx6(), q[0] = z;
    else z = q[0];
    let _ = z,
        w = k$.useRef(Y),
        O;
    if (q[1] !== Y) O = () => {
        w.current = Y
    }, q[1] = Y, q[2] = O;
    else O = q[2];
    k$.useEffect(O);
    let $;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) $ = () => {
        w.current("dismiss")
    }, q[3] = $;
    else $ = q[3];
    let H = $,
        j;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) j = [], q[4] = j;
    else j = q[4];
    k$.useEffect(ATz, j);
    let J, M;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) J = () => {
        let h = setTimeout(H, efz);
        return () => clearTimeout(h)
    }, M = [H], q[5] = J, q[6] = M;
    else J = q[5], M = q[6];
    k$.useEffect(J, M);
    let D;
    if (q[7] !== K) {
        let h = Cx6(K);
        D = h ? la(h) : "high", q[7] = K, q[8] = D
    } else D = q[8];
    let X = D,
        P;
    if (q[9] !== X) P = (h) => {
        TA("userSettings", {
            effortLevel: nq6(h === X ? void 0 : h)
        }), w.current(h)
    }, q[9] = X, q[10] = P;
    else P = q[10];
    let W = P,
        Z;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) Z = [{
        label: k$.default.createElement(Qt8, {
            level: "medium",
            text: "Medium (recommended)"
        }),
        value: "medium"
    }, {
        label: k$.default.createElement(Qt8, {
            level: "high",
            text: "High"
        }),
        value: "high"
    }, {
        label: k$.default.createElement(Qt8, {
            level: "low",
            text: "Low"
        }),
        value: "low"
    }], q[11] = Z;
    else Z = q[11];
    let G = Z,
        f;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) f = k$.default.createElement(m, {
        marginBottom: 1,
        flexDirection: "column"
    }, k$.default.createElement(T, null, _.dialogDescription)), q[12] = f;
    else f = q[12];
    let v;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) v = k$.default.createElement(jb1, {
        level: "low"
    }), q[13] = v;
    else v = q[13];
    let N;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) N = k$.default.createElement(jb1, {
        level: "medium"
    }), q[14] = N;
    else N = q[14];
    let V;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) V = k$.default.createElement(m, {
        marginBottom: 1
    }, k$.default.createElement(T, {
        dimColor: !0
    }, v, " low ", "·", " ", N, " medium ", "·", " ", k$.default.createElement(jb1, {
        level: "high"
    }), " high")), q[15] = V;
    else V = q[15];
    let L;
    if (q[16] !== W) L = k$.default.createElement(cz, {
        title: _.dialogTitle
    }, k$.default.createElement(m, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, f, V, k$.default.createElement(T8, {
        options: G,
        onChange: W,
        onCancel: H
    }))), q[16] = W, q[17] = L;
    else L = q[17];
    return L
}
// @from(Ln 505003, Col 0)
function ATz() {
    Jb1()
}
// @from(Ln 505007, Col 0)
function jb1(A) {
    let q = A6(4),
        {
            level: K
        } = A,
        Y;
    if (q[0] !== K) Y = _n6(K), q[0] = K, q[1] = Y;
    else Y = q[1];
    let z;
    if (q[2] !== Y) z = k$.default.createElement(T, {
        color: "suggestion"
    }, Y), q[2] = Y, q[3] = z;
    else z = q[3];
    return z
}
// @from(Ln 505023, Col 0)
function Qt8(A) {
    let q = A6(5),
        {
            level: K,
            text: Y
        } = A,
        z;
    if (q[0] !== K) z = k$.default.createElement(jb1, {
        level: K
    }), q[0] = K, q[1] = z;
    else z = q[1];
    let _;
    if (q[2] !== z || q[3] !== Y) _ = k$.default.createElement(k$.default.Fragment, null, z, " ", Y), q[2] = z, q[3] = Y, q[4] = _;
    else _ = q[4];
    return _
}
// @from(Ln 505040, Col 0)
function Fmq(A) {
    if (!H5(A).toLowerCase().includes("opus-4-6")) return !1;
    let K = X1();
    if (K.effortCalloutV2Dismissed) return !1;
    if (K.numStartups <= 1) return Jb1(), !1;
    if (LC()) {
        if (K.effortCalloutDismissed) return Jb1(), !1;
        return Sx6().enabled
    }
    if (RL() || Ix6()) return Sx6().enabled;
    return Jb1(), !1
}
// @from(Ln 505053, Col 0)
function Jb1() {
    d1((A) => {
        if (A.effortCalloutV2Dismissed) return A;
        return {
            ...A,
            effortCalloutV2Dismissed: !0
        }
    })
}
// @from(Ln 505062, Col 4)
k$
// @from(Ln 505062, Col 8)
efz = 30000
// @from(Ln 505063, Col 4)
pmq = E(() => {
    e6();
    i6();
    k8();
    v3();
    NZ();
    Cy1();
    wk();
    i8();
    z4();
    fA();
    k$ = t(P6(), 1)
})
// @from(Ln 505077, Col 0)
function Mb1(A, q) {
    let [K, Y] = Ut8.default.useState(q);
    return Ut8.default.useEffect(() => {
        rR(A, q).then(Y)
    }, [A, q]), K
}
// @from(Ln 505083, Col 4)
Ut8
// @from(Ln 505084, Col 4)
Qmq = E(() => {
    HA();
    Ut8 = t(P6(), 1)
})
// @from(Ln 505092, Col 0)
function Db1({
    hideThanksAfterMs: A,
    onOpen: q,
    onSelect: K,
    shouldShowTranscriptPrompt: Y,
    onTranscriptPromptShown: z,
    onTranscriptSelect: _
}) {
    let [w, O] = rh.useState("closed"), [$, H] = rh.useState(null), j = rh.useRef(Umq()), J = rh.useRef(null), M = rh.useCallback(() => {
        O("thanks"), setTimeout((Z, G) => {
            Z("closed"), G(null)
        }, A, O, H)
    }, [A]), D = rh.useCallback(() => {
        O("submitted"), setTimeout(O, A, "closed")
    }, [A]), X = rh.useCallback(() => {
        if (w !== "closed") return;
        O("open"), j.current = Umq(), q(j.current)
    }, [w, q]), P = rh.useCallback((Z) => {
        if (H(Z), J.current = Z, K(j.current, Z), Z === "dismissed") O("closed"), H(null);
        else if (Y?.(Z)) return O("transcript_prompt"), z?.(j.current, Z), !0;
        else M();
        return !1
    }, [M, K, Y, z]), W = rh.useCallback((Z) => {
        switch (Z) {
            case "yes":
                O("submitting"), (async () => {
                    try {
                        if (await _?.(j.current, Z, J.current)) D();
                        else M()
                    } catch {
                        M()
                    }
                })();
                break;
            case "no":
            case "dont_ask_again":
                _?.(j.current, Z, J.current), M();
                break
        }
    }, [M, D, _]);
    return {
        state: w,
        lastResponse: $,
        open: X,
        handleSelect: P,
        handleTranscriptSelect: W
    }
}
// @from(Ln 505140, Col 4)
rh
// @from(Ln 505141, Col 4)
dt8 = E(() => {
    rh = t(P6(), 1)
})
// @from(Ln 505147, Col 0)
async function dmq(A, q, K) {
    try {
        k("Collecting transcript for sharing", {
            level: "info"
        });
        let Y = cM(A),
            z = Gr8(A),
            _ = await JS1(z),
            w;
        try {
            w = await qTz(Cz(), "utf-8")
        } catch {}
        let O = {
                trigger: q,
                version: {
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.76",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-03-14T00:12:49Z"
                }.VERSION,
                platform: process.platform,
                transcript: Y,
                subagentTranscripts: Object.keys(_).length > 0 ? _ : void 0,
                rawTranscriptJsonl: w
            },
            $ = Fl(B6(O));
        await dz();
        let H = QO();
        if (H.error) return {
            success: !1
        };
        let j = {
                "Content-Type": "application/json",
                "User-Agent": Gy(),
                ...H.headers
            },
            J = await X8.post("https://api.anthropic.com/api/claude_code_shared_session_transcripts", {
                content: $,
                appearance_id: K
            }, {
                headers: j,
                timeout: 30000
            });
        if (J.status === 200 || J.status === 201) {
            let M = J.data;
            return k("Transcript shared successfully", {
                level: "info"
            }), {
                success: !0,
                transcriptId: M?.transcript_id
            }
        }
        return {
            success: !1
        }
    } catch (Y) {
        return k(_1(Y), {
            level: "error"
        }), {
            success: !1
        }
    }
}
// @from(Ln 505212, Col 4)
cmq = E(() => {
    kK();
    H1();
    RM();
    fA();
    JA();
    Oq();
    g1();
    tp8();
    s8()
})
// @from(Ln 505224, Col 0)
function imq(A, q, K, Y = "session", z = !1) {
    let _ = ZM.useRef("unknown");
    _.current = bX(A)?.message?.id || "unknown";
    let w = M1((Q) => Q.feedbackSurvey),
        O = xA(),
        $ = Mb1("tengu_feedback_survey_config", KTz),
        H = Mb1("tengu_bad_survey_transcript_ask_config", lmq),
        j = Mb1("tengu_good_survey_transcript_ask_config", lmq),
        J = mA().feedbackSurveyRate,
        M = ZM.useRef(Date.now()),
        D = ZM.useRef(K),
        X = ZM.useRef(K);
    X.current = K;
    let P = ZM.useRef(A);
    P.current = A;
    let W = ZM.useRef(!1),
        Z = ZM.useRef(null),
        G = ZM.useCallback((Q, U) => {
            O((r) => ({
                ...r,
                feedbackSurvey: {
                    timeLastShown: Q,
                    submitCountAtLastAppearance: U
                }
            }))
        }, [O]),
        f = ZM.useCallback((Q) => {
            G(Date.now(), X.current), d("tengu_feedback_survey_event", {
                event_type: "appeared",
                appearance_id: Q,
                last_assistant_message_id: _.current,
                survey_type: Y
            }), pw("feedback_survey", {
                event_type: "appeared",
                appearance_id: Q,
                survey_type: Y
            })
        }, [G, Y]),
        v = ZM.useCallback((Q, U) => {
            G(Date.now(), X.current), d("tengu_feedback_survey_event", {
                event_type: "responded",
                appearance_id: Q,
                response: U,
                last_assistant_message_id: _.current,
                survey_type: Y
            }), pw("feedback_survey", {
                event_type: "responded",
                appearance_id: Q,
                response: U,
                survey_type: Y
            })
        }, [G, Y]),
        N = ZM.useCallback((Q) => {
            if (Q !== "bad" && Q !== "good") return !1;
            if (X1().transcriptShareDismissed) return !1;
            if (!qD("allow_product_feedback")) return !1;
            let U = Q === "bad" ? H.probability : j.probability;
            return Math.random() <= U
        }, [H.probability, j.probability]),
        V = ZM.useCallback((Q, U) => {
            let r = U === "good" ? "good_feedback_survey" : "bad_feedback_survey";
            d("tengu_feedback_survey_event", {
                event_type: "transcript_prompt_appeared",
                appearance_id: Q,
                last_assistant_message_id: _.current,
                survey_type: Y,
                trigger: r
            }), pw("feedback_survey", {
                event_type: "transcript_prompt_appeared",
                appearance_id: Q,
                survey_type: Y
            })
        }, [Y]),
        L = ZM.useCallback(async (Q, U, r) => {
            let e = r === "good" ? "good_feedback_survey" : "bad_feedback_survey";
            if (d("tengu_feedback_survey_event", {
                    event_type: `transcript_share_${U}`,
                    appearance_id: Q,
                    last_assistant_message_id: _.current,
                    survey_type: Y,
                    trigger: e
                }), U === "dont_ask_again") d1((Y6) => ({
                ...Y6,
                transcriptShareDismissed: !0
            }));
            if (U === "yes") {
                let Y6 = await dmq(P.current, e, Q);
                return d("tengu_feedback_survey_event", {
                    event_type: Y6.success ? "transcript_share_submitted" : "transcript_share_failed",
                    appearance_id: Q,
                    trigger: e
                }), Y6.success
            }
            return !1
        }, [Y]),
        {
            state: h,
            lastResponse: R,
            open: u,
            handleSelect: I,
            handleTranscriptSelect: g
        } = Db1({
            hideThanksAfterMs: $.hideThanksAfterMs,
            onOpen: f,
            onSelect: v,
            shouldShowTranscriptPrompt: N,
            onTranscriptPromptShown: V,
            onTranscriptSelect: L
        }),
        B = cK(),
        b = ZM.useMemo(() => {
            if ($.onForModels.length === 0) return !1;
            if ($.onForModels.includes("*")) return !0;
            return $.onForModels.includes(B)
        }, [$.onForModels, B]),
        p = ZM.useMemo(() => {
            if (h !== "closed") return !1;
            if (q) return !1;
            if (z) return !1;
            if (process.env.CLAUDE_FORCE_DISPLAY_SURVEY && !w.timeLastShown) return !0;
            if (!b) return !1;
            if (t6(process.env.CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY)) return !1;
            if (fA1()) return !1;
            if (!qD("allow_product_feedback")) return !1;
            if (w.timeLastShown) {
                if (Date.now() - w.timeLastShown < $.minTimeBetweenFeedbackMs) return !1;
                if (w.submitCountAtLastAppearance !== null && K < w.submitCountAtLastAppearance + $.minUserTurnsBetweenFeedback) return !1
            } else {
                if (Date.now() - M.current < $.minTimeBeforeFeedbackMs) return !1;
                if (K < D.current + $.minUserTurnsBeforeFeedback) return !1
            }
            if (Z.current !== K) Z.current = K, W.current = Math.random() <= (J ?? $.probability);
            if (!W.current) return !1;
            let Q = X1().feedbackSurveyState;
            if (Q?.lastShownTime) {
                if (Date.now() - Q.lastShownTime < $.minTimeBetweenGlobalFeedbackMs) return !1
            }
            return !0
        }, [h, q, z, b, w.timeLastShown, w.submitCountAtLastAppearance, K, $.minTimeBetweenFeedbackMs, $.minTimeBetweenGlobalFeedbackMs, $.minUserTurnsBetweenFeedback, $.minTimeBeforeFeedbackMs, $.minUserTurnsBeforeFeedback, $.probability, J]);
    return ZM.useEffect(() => {
        if (p) u()
    }, [p, u]), {
        state: h,
        lastResponse: R,
        handleSelect: I,
        handleTranscriptSelect: g
    }
}
// @from(Ln 505372, Col 4)
ZM
// @from(Ln 505372, Col 8)
KTz
// @from(Ln 505372, Col 13)
lmq
// @from(Ln 505373, Col 4)
nmq = E(() => {
    Qmq();
    V1();
    ip();
    AN();
    k8();
    z4();
    A8();
    NA();
    JA();
    dt8();
    FB();
    i8();
    cmq();
    ZM = t(P6(), 1), KTz = {
        minTimeBeforeFeedbackMs: 600000,
        minTimeBetweenFeedbackMs: 3600000,
        minTimeBetweenGlobalFeedbackMs: 1e8,
        minUserTurnsBeforeFeedback: 5,
        minUserTurnsBetweenFeedback: 10,
        hideThanksAfterMs: 3000,
        onForModels: ["*"],
        probability: 0.005
    }, lmq = {
        probability: 0
    }
})
// @from(Ln 505401, Col 0)
function wTz(A, q) {
    let K = A.findIndex((Y) => Y.uuid === q);
    if (K === -1) return !1;
    for (let Y = K + 1; Y < A.length; Y++) {
        let z = A[Y];
        if (z && (z.type === "user" || z.type === "assistant")) return !0
    }
    return !1
}
// @from(Ln 505411, Col 0)
function rmq(A, q, K, Y) {
    let z = A6(23),
        _ = K === void 0 ? !1 : K,
        w;
    if (z[0] !== Y) w = Y === void 0 ? {} : Y, z[0] = Y, z[1] = w;
    else w = z[1];
    let {
        enabled: O
    } = w, $ = O === void 0 ? !0 : O, [H, j] = Z86.useState(null), J;
    if (z[2] === Symbol.for("react.memo_cache_sentinel")) J = new Set, z[2] = J;
    else J = z[2];
    let M = Z86.useRef(J),
        D = Z86.useRef(null),
        X = jTz,
        P = HTz,
        W;
    if (z[3] === Symbol.for("react.memo_cache_sentinel")) W = {
        hideThanksAfterMs: YTz,
        onOpen: X,
        onSelect: P
    }, z[3] = W;
    else W = z[3];
    let {
        state: Z,
        lastResponse: G,
        open: f,
        handleSelect: v
    } = Db1(W), N, V;
    if (z[4] !== $) N = () => {
        if (!$) return;
        j(jY(zTz))
    }, V = [$], z[4] = $, z[5] = N, z[6] = V;
    else N = z[5], V = z[6];
    Z86.useEffect(N, V);
    let L;
    if (z[7] !== A) L = new Set(A.filter($Tz).map(OTz)), z[7] = A, z[8] = L;
    else L = z[8];
    let h = L,
        R, u;
    if (z[9] !== h || z[10] !== $ || z[11] !== H || z[12] !== _ || z[13] !== q || z[14] !== A || z[15] !== f || z[16] !== Z) u = () => {
        if (!$) return;
        if (Z !== "closed" || q) return;
        if (_) return;
        if (H !== !0) return;
        if (fA1()) return;
        if (t6(process.env.CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY)) return;
        if (D.current !== null) {
            if (wTz(A, D.current)) {
                if (D.current = null, Math.random() < _Tz) f();
                return
            }
        }
        let g = Array.from(h).filter((B) => !M.current.has(B));
        if (g.length > 0) M.current = new Set(h), D.current = g[g.length - 1]
    }, R = [$, h, Z, q, _, H, A, f], z[9] = h, z[10] = $, z[11] = H, z[12] = _, z[13] = q, z[14] = A, z[15] = f, z[16] = Z, z[17] = R, z[18] = u;
    else R = z[17], u = z[18];
    Z86.useEffect(u, R);
    let I;
    if (z[19] !== v || z[20] !== G || z[21] !== Z) I = {
        state: Z,
        lastResponse: G,
        handleSelect: v
    }, z[19] = v, z[20] = G, z[21] = Z, z[22] = I;
    else I = z[22];
    return I
}
// @from(Ln 505478, Col 0)
function OTz(A) {
    return A.uuid
}
// @from(Ln 505482, Col 0)
function $Tz(A) {
    return RZ(A)
}
// @from(Ln 505486, Col 0)
function HTz(A, q) {
    let K = cE1();
    d("tengu_post_compact_survey_event", {
        event_type: "responded",
        appearance_id: A,
        response: q,
        session_memory_compaction_enabled: K
    }), pw("feedback_survey", {
        event_type: "responded",
        appearance_id: A,
        response: q,
        survey_type: "post_compact"
    })
}
// @from(Ln 505501, Col 0)
function jTz(A) {
    let q = cE1();
    d("tengu_post_compact_survey_event", {
        event_type: "appeared",
        appearance_id: A,
        session_memory_compaction_enabled: q
    }), pw("feedback_survey", {
        event_type: "appeared",
        appearance_id: A,
        survey_type: "post_compact"
    })
}
// @from(Ln 505513, Col 4)
Z86
// @from(Ln 505513, Col 9)
YTz = 3000
// @from(Ln 505514, Col 4)
zTz = "tengu_post_compact_survey"
// @from(Ln 505515, Col 4)
_Tz = 0.2
// @from(Ln 505516, Col 4)
omq = E(() => {
    e6();
    HA();
    V1();
    ip();
    A8();
    JA();
    dt8();
    iE1();
    FB();
    Z86 = t(P6(), 1)
})
// @from(Ln 505529, Col 0)
function amq(A) {
    let q = A6(10),
        {
            onSelect: K,
            inputValue: Y,
            setInputValue: z
        } = A,
        _ = ba6.useRef(Y),
        w = ba6.useRef(null),
        O, $;
    if (q[0] !== Y || q[1] !== K || q[2] !== z) O = () => {
        if (w.current !== null) clearTimeout(w.current), w.current = null;
        if (Y !== _.current) {
            let X = MC(Y.slice(-1));
            if (DTz(X)) {
                let P = Y.slice(0, -1),
                    W = MTz[X];
                w.current = setTimeout(PTz, XTz, w, z, P, K, W)
            }
        }
        return () => {
            if (w.current !== null) clearTimeout(w.current), w.current = null
        }
    }, $ = [Y, K, z], q[0] = Y, q[1] = K, q[2] = z, q[3] = O, q[4] = $;
    else O = q[3], $ = q[4];
    ba6.useEffect(O, $);
    let H;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) H = qW.default.createElement(m, null, qW.default.createElement(T, {
        color: "ansi:cyan"
    }, I3, " "), qW.default.createElement(T, {
        bold: !0
    }, "Can Anthropic look at your session transcript to help us improve Claude Code?")), q[5] = H;
    else H = q[5];
    let j;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) j = qW.default.createElement(m, {
        marginLeft: 2
    }, qW.default.createElement(T, {
        dimColor: !0
    }, "Learn more: https://code.claude.com/docs/en/data-usage#session-quality-surveys")), q[6] = j;
    else j = q[6];
    let J;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) J = qW.default.createElement(m, {
        width: 10
    }, qW.default.createElement(T, null, qW.default.createElement(T, {
        color: "ansi:cyan"
    }, "1"), ": Yes")), q[7] = J;
    else J = q[7];
    let M;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) M = qW.default.createElement(m, {
        width: 10
    }, qW.default.createElement(T, null, qW.default.createElement(T, {
        color: "ansi:cyan"
    }, "2"), ": No")), q[8] = M;
    else M = q[8];
    let D;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) D = qW.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, H, j, qW.default.createElement(m, {
        marginLeft: 2
    }, J, M, qW.default.createElement(m, null, qW.default.createElement(T, null, qW.default.createElement(T, {
        color: "ansi:cyan"
    }, "3"), ": Don't ask again")))), q[9] = D;
    else D = q[9];
    return D
}
// @from(Ln 505596, Col 0)
function PTz(A, q, K, Y, z) {
    A.current = null, q(K), Y(z)
}
// @from(Ln 505599, Col 4)
qW
// @from(Ln 505599, Col 8)
ba6
// @from(Ln 505599, Col 13)
JTz
// @from(Ln 505599, Col 18)
MTz
// @from(Ln 505599, Col 23)
DTz = (A) => JTz.includes(A)
// @from(Ln 505600, Col 4)
XTz = 200
// @from(Ln 505601, Col 4)
smq = E(() => {
    e6();
    i6();
    qw();
    qW = t(P6(), 1), ba6 = t(P6(), 1), JTz = ["1", "2", "3"], MTz = {
        "1": "yes",
        "2": "no",
        "3": "dont_ask_again"
    }
})
// @from(Ln 505612, Col 0)
function Xb1(A) {
    let q = A6(16),
        {
            state: K,
            lastResponse: Y,
            handleSelect: z,
            handleTranscriptSelect: _,
            inputValue: w,
            setInputValue: O,
            onRequestFeedback: $,
            message: H
        } = A;
    if (K === "closed") return null;
    if (K === "thanks") {
        let J;
        if (q[0] !== w || q[1] !== Y || q[2] !== $ || q[3] !== O) J = nN.default.createElement(ZTz, {
            lastResponse: Y,
            inputValue: w,
            setInputValue: O,
            onRequestFeedback: $
        }), q[0] = w, q[1] = Y, q[2] = $, q[3] = O, q[4] = J;
        else J = q[4];
        return J
    }
    if (K === "submitted") {
        let J;
        if (q[5] === Symbol.for("react.memo_cache_sentinel")) J = nN.default.createElement(m, {
            marginTop: 1
        }, nN.default.createElement(T, {
            color: "success"
        }, "✓", " Thanks for sharing your transcript!")), q[5] = J;
        else J = q[5];
        return J
    }
    if (K === "submitting") {
        let J;
        if (q[6] === Symbol.for("react.memo_cache_sentinel")) J = nN.default.createElement(m, {
            marginTop: 1
        }, nN.default.createElement(T, {
            dimColor: !0
        }, "Sharing transcript", "…")), q[6] = J;
        else J = q[6];
        return J
    }
    if (K === "transcript_prompt") {
        if (!_) return null;
        if (w && !["1", "2", "3"].includes(w)) return null;
        let J;
        if (q[7] !== _ || q[8] !== w || q[9] !== O) J = nN.default.createElement(amq, {
            onSelect: _,
            inputValue: w,
            setInputValue: O
        }), q[7] = _, q[8] = w, q[9] = O, q[10] = J;
        else J = q[10];
        return J
    }
    if (w && !qb1(w)) return null;
    let j;
    if (q[11] !== z || q[12] !== w || q[13] !== H || q[14] !== O) j = nN.default.createElement(Tuq, {
        onSelect: z,
        inputValue: w,
        setInputValue: O,
        message: H
    }), q[11] = z, q[12] = w, q[13] = H, q[14] = O, q[15] = j;
    else j = q[15];
    return j
}
// @from(Ln 505680, Col 0)
function ZTz(A) {
    let q = A6(15),
        {
            lastResponse: K,
            inputValue: Y,
            setInputValue: z,
            onRequestFeedback: _
        } = A,
        w = _ && K === "good",
        O = gV6.useRef(Y),
        $ = gV6.useRef(!1),
        H = gV6.useRef(null),
        j;
    if (q[0] !== Y || q[1] !== K || q[2] !== _ || q[3] !== z || q[4] !== w) j = () => {
        if (!w || $.current) return;
        if (H.current !== null) clearTimeout(H.current), H.current = null;
        if (Y.length === O.current.length + 1 && Y.startsWith(O.current)) {
            if (MC(Y.slice(-1)) === "1") {
                let W = Y.slice(0, -1);
                H.current = setTimeout(GTz, WTz, H, $, z, W, K, _)
            }
        }
        return () => {
            if (H.current !== null) clearTimeout(H.current), H.current = null
        }
    }, q[0] = Y, q[1] = K, q[2] = _, q[3] = z, q[4] = w, q[5] = j;
    else j = q[5];
    let J;
    if (q[6] !== Y || q[7] !== _ || q[8] !== z || q[9] !== w) J = [Y, w, _, z], q[6] = Y, q[7] = _, q[8] = z, q[9] = w, q[10] = J;
    else J = q[10];
    gV6.useEffect(j, J);
    let M = "/feedback",
        D;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) D = nN.default.createElement(T, {
        color: "success"
    }, "Thanks for the feedback!"), q[11] = D;
    else D = q[11];
    let X;
    if (q[12] !== K || q[13] !== w) X = nN.default.createElement(m, {
        marginTop: 1,
        flexDirection: "column"
    }, D, w ? nN.default.createElement(T, {
        dimColor: !0
    }, "(Optional) Press [", nN.default.createElement(T, {
        color: "ansi:cyan"
    }, "1"), "] to tell us what went well ", " · ", M) : K === "bad" ? nN.default.createElement(T, {
        dimColor: !0
    }, "Use /issue to report model behavior issues.") : nN.default.createElement(T, {
        dimColor: !0
    }, "Use ", M, " to share detailed feedback anytime.")), q[12] = K, q[13] = w, q[14] = X;
    else X = q[14];
    return X
}
// @from(Ln 505734, Col 0)
function GTz(A, q, K, Y, z, _) {
    A.current = null, q.current = !0, K(Y), d("tengu_feedback_survey_event", {
        event_type: "followup_accepted",
        response: z
    }), _()
}
// @from(Ln 505740, Col 4)
nN
// @from(Ln 505740, Col 8)
gV6
// @from(Ln 505740, Col 13)
WTz = 200
// @from(Ln 505741, Col 4)
tmq = E(() => {
    e6();
    i6();
    It8();
    smq();
    V1();
    nN = t(P6(), 1), gV6 = t(P6(), 1)
})
// @from(Ln 505750, Col 0)
function ABq() {
    let A = A6(3),
        {
            addNotification: q
        } = o4(),
        K, Y;
    if (A[0] !== q) K = () => {
        if (t4()) return;
        gg().then((z) => {
            z.forEach((_, w) => {
                let O = "low";
                if (_.type === "error" || _.userActionRequired) O = "high";
                else if (_.type === "path" || _.type === "alias") O = "medium";
                q({
                    key: `install-message-${w}-${_.type}`,
                    text: _.message,
                    priority: O,
                    color: _.type === "error" ? "error" : "warning"
                })
            })
        })
    }, Y = [q], A[0] = q, A[1] = K, A[2] = Y;
    else K = A[1], Y = A[2];
    emq.useEffect(K, Y)
}
// @from(Ln 505775, Col 4)
emq
// @from(Ln 505776, Col 4)
qBq = E(() => {
    e6();
    T1();
    wz();
    Pb();
    emq = t(P6(), 1)
})
// @from(Ln 505784, Col 0)
function fTz() {
    if (process.argv.includes("--chrome")) return !0;
    if (process.argv.includes("--no-chrome")) return !1;
    return
}
// @from(Ln 505790, Col 0)
function KBq() {
    let A = A6(3),
        {
            addNotification: q
        } = o4(),
        K, Y;
    if (A[0] !== q) K = () => {
        if (t4()) return;
        let z = fTz();
        if (!zh1(z)) return;
        if (!iA()) {
            q({
                key: "chrome-requires-subscription",
                jsx: oh.createElement(T, {
                    color: "error"
                }, "Claude in Chrome requires a claude.ai subscription"),
                priority: "immediate",
                timeoutMs: 5000
            });
            return
        }
        Hi().then((_) => {
            if (!_ && !zG()) q({
                key: "chrome-extension-not-detected",
                jsx: oh.createElement(oh.Fragment, null, oh.createElement(T, {
                    color: "warning"
                }, "Chrome extension not detected · https://claude.ai/chrome to install")),
                priority: "immediate",
                timeoutMs: 3000
            });
            else if (z === void 0) q({
                key: "claude-in-chrome-default-enabled",
                text: "Claude in Chrome enabled · /chrome",
                priority: "low"
            })
        }).catch(TTz)
    }, Y = [q], A[0] = q, A[1] = K, A[2] = Y;
    else K = A[1], Y = A[2];
    oh.useEffect(K, Y)
}
// @from(Ln 505831, Col 0)
function TTz(A) {
    _6(A)
}
// @from(Ln 505834, Col 4)
oh
// @from(Ln 505835, Col 4)
YBq = E(() => {
    e6();
    i6();
    T1();
    R_6();
    wz();
    k1();
    fA();
    A8();
    oh = t(P6(), 1)
})
// @from(Ln 505847, Col 0)
function zBq() {
    let A = A6(3),
        {
            addNotification: q
        } = o4(),
        K = Hx.useRef(!1),
        Y, z;
    if (A[0] !== q) Y = () => {
        if (t4()) return;
        if (K.current) return;
        K.current = !0, $I1().then((_) => {
            if (_.configSaveFailed) k("Showing marketplace config save failure notification"), q({
                key: "marketplace-config-save-failed",
                jsx: Hx.createElement(T, {
                    color: "error"
                }, "Failed to save marketplace retry info · Check ~/.claude.json permissions"),
                priority: "immediate",
                timeoutMs: 1e4
            });
            if (_.installed) k("Showing marketplace installation success notification"), q({
                key: "marketplace-installed",
                jsx: Hx.createElement(T, {
                    color: "success"
                }, "✓ Anthropic marketplace installed · /plugin to see available plugins"),
                priority: "immediate",
                timeoutMs: 7000
            });
            else if (_.skipped && _.reason === "unknown") k("Showing marketplace installation failure notification"), q({
                key: "marketplace-install-failed",
                jsx: Hx.createElement(T, {
                    color: "warning"
                }, "Failed to install Anthropic marketplace · Will retry on next startup"),
                priority: "immediate",
                timeoutMs: 8000
            })
        }).catch(vTz)
    }, z = [q], A[0] = q, A[1] = Y, A[2] = z;
    else Y = A[1], z = A[2];
    Hx.useEffect(Y, z)
}
// @from(Ln 505888, Col 0)
function vTz(A) {
    _6(A)
}
// @from(Ln 505891, Col 4)
Hx
// @from(Ln 505892, Col 4)
_Bq = E(() => {
    e6();
    i6();
    T1();
    wz();
    ws8();
    k1();
    H1();
    Hx = t(P6(), 1)
})
// @from(Ln 505903, Col 0)
function wBq(A, q) {
    let K = A6(6);
    xa6.useRef(void 0);
    let Y;
    if (K[0] !== A) Y = [A], K[0] = A, K[1] = Y;
    else Y = K[1];
    xa6.useEffect(VTz, Y);
    let z, _;
    if (K[2] !== A || K[3] !== q) z = () => {
        let w = A.find(NTz);
        if (!w) return;
        pC("set_permission_mode", {
            mode: q === "bypassPermissions" ? "skip_all_permission_checks" : "ask"
        }, w)
    }, _ = [A, q], K[2] = A, K[3] = q, K[4] = z, K[5] = _;
    else z = K[4], _ = K[5];
    xa6.useEffect(z, _)
}
// @from(Ln 505922, Col 0)
function NTz(A) {
    return A.type === "connected" && A.name === lv
}
// @from(Ln 505926, Col 0)
function VTz() {}
// @from(Ln 505927, Col 4)
xa6
// @from(Ln 505927, Col 9)
OOH
// @from(Ln 505928, Col 4)
OBq = E(() => {
    e6();
    K7();
    SR();
    QP();
    xa6 = t(P6(), 1), OOH = F6(() => C.object({
        method: C.literal("notifications/message"),
        params: C.object({
            prompt: C.string(),
            image: C.object({
                type: C.literal("base64"),
                media_type: C.enum(["image/jpeg", "image/png", "image/gif", "image/webp"]),
                data: C.string()
            }).optional(),
            tabId: C.number().optional()
        })
    }))
})
// @from(Ln 505947, Col 0)
function kTz(A) {
    if (A.length === 0) return;
    if (A.length === 1) return A[0];
    let q = A.map((K) => ({
        tip: K,
        sessions: FC1(K.id)
    }));
    return q.sort((K, Y) => Y.sessions - K.sessions), q[0]?.tip
}
// @from(Ln 505956, Col 0)
async function $Bq(A) {
    if (PA().spinnerTipsEnabled === !1) return;
    let q = await UC1(A);
    if (q.length === 0) return;
    return kTz(q)
}
// @from(Ln 505963, Col 0)
function HBq(A) {
    eEq(A.id), d("tengu_tip_shown", {
        tipIdLength: A.id,
        cooldownSessions: A.cooldownSessions
    })
}
// @from(Ln 505969, Col 4)
jBq = E(() => {
    Ea8();
    V1();
    i8();
    Sa8()
})
// @from(Ln 505976, Col 0)
function JBq(A, q, K) {
    let Y = Pb1.useRef(!1);
    Pb1.useEffect(() => {
        if (!iz() || Y.current) return;
        if (Y.current = !0, A) qV1(A, K)
    }, [q, A, K])
}
// @from(Ln 505983, Col 4)
Pb1
// @from(Ln 505984, Col 4)
MBq = E(() => {
    JN();
    Pb1 = t(P6(), 1)
})
// @from(Ln 505989, Col 0)
function ct8(A) {
    let q = A6(22),
        {
            hostPattern: K,
            onUserResponse: Y
        } = A,
        {
            host: z
        } = K,
        _;
    if (q[0] !== Y) _ = function(N) {
        A: switch (N) {
            case "yes": {
                Y({
                    allow: !0,
                    persistToSettings: !1
                });
                break A
            }
            case "yes-dont-ask-again": {
                Y({
                    allow: !0,
                    persistToSettings: !0
                });
                break A
            }
            case "no":
                Y({
                    allow: !1,
                    persistToSettings: !1
                })
        }
    }, q[0] = Y, q[1] = _;
    else _ = q[1];
    let w = _,
        O;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) O = Uq6(), q[2] = O;
    else O = q[2];
    let $ = O,
        H;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) H = {
        label: "Yes",
        value: "yes"
    }, q[3] = H;
    else H = q[3];
    let j;
    if (q[4] !== z) j = !$ ? [{
        label: Ww.createElement(T, null, "Yes, and don't ask again for ", Ww.createElement(T, {
            bold: !0
        }, z)),
        value: "yes-dont-ask-again"
    }] : [], q[4] = z, q[5] = j;
    else j = q[5];
    let J;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) J = {
        label: Ww.createElement(T, null, "No, and tell Claude what to do differently ", Ww.createElement(T, {
            bold: !0
        }, "(esc)")),
        value: "no"
    }, q[6] = J;
    else J = q[6];
    let M;
    if (q[7] !== j) M = [H, ...j, J], q[7] = j, q[8] = M;
    else M = q[8];
    let D = M,
        X;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) X = Ww.createElement(T, {
        dimColor: !0
    }, "Host:"), q[9] = X;
    else X = q[9];
    let P;
    if (q[10] !== z) P = Ww.createElement(m, null, X, Ww.createElement(T, null, " ", z)), q[10] = z, q[11] = P;
    else P = q[11];
    let W;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) W = Ww.createElement(m, {
        marginTop: 1
    }, Ww.createElement(T, null, "Do you want to allow this connection?")), q[12] = W;
    else W = q[12];
    let Z;
    if (q[13] !== Y) Z = () => {
        Y({
            allow: !1,
            persistToSettings: !1
        })
    }, q[13] = Y, q[14] = Z;
    else Z = q[14];
    let G;
    if (q[15] !== w || q[16] !== D || q[17] !== Z) G = Ww.createElement(m, null, Ww.createElement(T8, {
        options: D,
        onChange: w,
        onCancel: Z
    })), q[15] = w, q[16] = D, q[17] = Z, q[18] = G;
    else G = q[18];
    let f;
    if (q[19] !== G || q[20] !== P) f = Ww.createElement(cz, {
        title: "Network request outside of sandbox"
    }, Ww.createElement(m, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, P, W, G)), q[19] = G, q[20] = P, q[21] = f;
    else f = q[21];
    return f
}
// @from(Ln 506093, Col 4)
Ww
// @from(Ln 506094, Col 4)
DBq = E(() => {
    e6();
    i6();
    Lz();
    v3();
    NZ();
    Ww = t(P6(), 1)
})
// @from(Ln 506103, Col 0)
function ETz(A) {
    let q = A.getHours() % 12 || 12,
        K = String(A.getMinutes()).padStart(2, "0"),
        Y = String(A.getSeconds()).padStart(2, "0"),
        z = A.getHours() < 12 ? "am" : "pm";
    return `${q}:${K}:${Y}${z}`
}
// @from(Ln 506111, Col 0)
function XBq() {
    let A = A6(15),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = [], A[0] = q;
    else q = A[0];
    let [K, Y] = ua6.useState(q), [z, _] = ua6.useState(0), w, O;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) w = () => {
        let X = vA.getSandboxViolationStore();
        return X.subscribe((W) => {
            Y(W.slice(-10)), _(X.getTotalCount())
        })
    }, O = [], A[1] = w, A[2] = O;
    else w = A[1], O = A[2];
    if (ua6.useEffect(w, O), !vA.isSandboxingEnabled() || y8() === "linux") return null;
    if (z === 0) return null;
    let $ = z === 1 ? "operation" : "operations",
        H;
    if (A[3] !== $ || A[4] !== z) H = _T.createElement(m, {
        marginLeft: 0
    }, _T.createElement(T, {
        color: "permission"
    }, "⧈ Sandbox blocked ", z, " total", " ", $)), A[3] = $, A[4] = z, A[5] = H;
    else H = A[5];
    let j;
    if (A[6] !== K) j = K.map(yTz), A[6] = K, A[7] = j;
    else j = A[7];
    let J = Math.min(10, K.length),
        M;
    if (A[8] !== J || A[9] !== z) M = _T.createElement(m, {
        paddingLeft: 2
    }, _T.createElement(T, {
        dimColor: !0
    }, "… showing last ", J, " of ", z)), A[8] = J, A[9] = z, A[10] = M;
    else M = A[10];
    let D;
    if (A[11] !== H || A[12] !== j || A[13] !== M) D = _T.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, H, j, M), A[11] = H, A[12] = j, A[13] = M, A[14] = D;
    else D = A[14];
    return D
}
// @from(Ln 506154, Col 0)
function yTz(A, q) {
    return _T.createElement(m, {
        key: `${A.timestamp.getTime()}-${q}`,
        paddingLeft: 2
    }, _T.createElement(T, {
        dimColor: !0
    }, ETz(A.timestamp), A.command ? ` ${A.command}:` : "", " ", A.line))
}
// @from(Ln 506162, Col 4)
_T
// @from(Ln 506162, Col 8)
ua6
// @from(Ln 506163, Col 4)
PBq = E(() => {
    e6();
    i6();
    Lz();
    YK();
    _T = t(P6(), 1), ua6 = t(P6(), 1)
})