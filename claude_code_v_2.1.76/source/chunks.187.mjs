
// @from(Ln 482853, Col 0)
function BXz(A, q, K, Y, z, _, w, O, $, H, j, J) {
    let M = !1,
        D = !1,
        X = !1,
        P = null,
        W, Z = A.outbound;
    xkq((T6) => {
        if (T6 === "default" || T6 === "acceptEdits" || T6 === "bypassPermissions" || T6 === "plan" || T6 === "auto" || T6 === "dontAsk") Z.enqueue({
            type: "system",
            subtype: "status",
            status: null,
            permissionMode: T6,
            uuid: WD(),
            session_id: R1()
        })
    });
    let G = {
        abortController: null,
        inflightPromise: null,
        lastEmitted: null,
        pendingSuggestion: null,
        pendingLastEmittedEntry: null
    };
    if (j.enableAuthStatus) e0.getInstance().subscribe((D6) => {
        Z.enqueue({
            type: "auth_status",
            isAuthenticating: D6.isAuthenticating,
            output: D6.output,
            error: D6.error,
            uuid: WD(),
            session_id: R1()
        })
    });
    let f = (T6) => {
        let D6 = SJq(T6);
        if (D6) Z.enqueue({
            type: "rate_limit_event",
            rate_limit_info: D6,
            uuid: WD(),
            session_id: R1()
        })
    };
    Nt.add(f);
    let v = z,
        N = UT6(z, MI1(), Ed),
        V = process.env.CLAUDE_CODE_RESUME_INTERRUPTED_TURN;
    if (J && J.kind !== "none" && V) k(`[print.ts] Auto-resuming interrupted turn (kind: ${J.kind})`), ehq(v, J.message), _0({
        mode: "prompt",
        value: J.message.message.content,
        uuid: WD()
    });
    let h = Ez6().map((T6) => {
            let D6 = T6.value === null ? "default" : T6.value,
                Q6 = D6 === "default" ? g0() : H5(D6),
                k6 = yC(Q6),
                Z6 = I21(Q6),
                u6 = FH(T6.value),
                C6 = IN6(Q6);
            return {
                value: D6,
                displayName: T6.label,
                description: T6.description,
                ...k6 ? {
                    supportsEffort: !0,
                    supportedEffortLevels: hx6(Q6) ? [...iq6] : iq6.filter((o6) => o6 !== "max")
                } : {},
                ...Z6 ? {
                    supportsAdaptiveThinking: !0
                } : {},
                ...u6 ? {
                    supportsFastMode: !0
                } : {},
                ...C6 ? {
                    supportsAutoMode: !0
                } : {}
            }
        }),
        R = j.userSpecifiedModel,
        u = [],
        I = [],
        g = new Set;

    function B(T6) {
        if (!KK6()) return;
        for (let D6 of T6) {
            if (D6.type !== "connected" || g.has(D6.name)) continue;
            if (D6.config.type === "sdk") continue;
            let Q6 = D6.name;
            try {
                D6.client.setRequestHandler(yp, async (k6, Z6) => {
                    n1(Q6, `Elicitation request received in print mode: ${B6(k6)}`);
                    let u6 = k6.params.mode === "url" ? "url" : "form";
                    d("tengu_mcp_elicitation_shown", {
                        mode: u6
                    });
                    let C6 = await sx6(Q6, k6.params, Z6.signal);
                    if (C6) return n1(Q6, `Elicitation resolved by hook: ${B6(C6)}`), d("tengu_mcp_elicitation_response", {
                        mode: u6,
                        action: C6.action
                    }), C6;
                    let o6 = "url" in k6.params ? k6.params.url : void 0,
                        V6 = "requestedSchema" in k6.params ? k6.params.requestedSchema : void 0,
                        b6 = "elicitationId" in k6.params ? k6.params.elicitationId : void 0,
                        E6 = await A.handleElicitation(Q6, k6.params.message, V6, Z6.signal, u6, o6, b6),
                        U6 = await tx6(Q6, E6, Z6.signal, u6, b6);
                    return d("tengu_mcp_elicitation_response", {
                        mode: u6,
                        action: U6.action
                    }), U6
                }), D6.client.setNotificationHandler(My6, (k6) => {
                    let {
                        elicitationId: Z6
                    } = k6.params;
                    n1(Q6, `Elicitation completion notification: ${Z6}`), Xm({
                        message: `MCP server "${Q6}" confirmed elicitation ${Z6} complete`,
                        notificationType: "elicitation_complete"
                    }), Z.enqueue({
                        type: "system",
                        subtype: "elicitation_complete",
                        mcp_server_name: Q6,
                        elicitation_id: Z6,
                        uuid: WD(),
                        session_id: R1()
                    })
                }), g.add(Q6)
            } catch {}
        }
    }
    async function b() {
        let T6 = new Set(Object.keys(w)),
            D6 = new Set(u.map((C6) => C6.name)),
            Q6 = Array.from(T6).some((C6) => !D6.has(C6)),
            k6 = Array.from(D6).some((C6) => !T6.has(C6)),
            Z6 = u.some((C6) => C6.type === "pending");
        if (Q6 || k6 || Z6) {
            for (let V6 of u)
                if (!T6.has(V6.name)) {
                    if (V6.type === "connected") await V6.cleanup()
                } let C6 = await WGq(w, (V6, b6) => A.sendMcpMessage(V6, b6));
            u = C6.clients, I = C6.tools;
            let o6 = new Set([...D6, ...T6]);
            $((V6) => ({
                ...V6,
                mcp: {
                    ...V6.mcp,
                    tools: [...V6.mcp.tools.filter((b6) => !Array.from(o6).some((E6) => b6.name.startsWith(HC(E6)))), ...I]
                }
            })), jn4(u)
        }
    }
    b();
    let p = {
            clients: [],
            tools: [],
            configs: {}
        },
        Q = null,
        U = 0;

    function r() {
        if (!Q) return;
        let T6 = Math.min(U, v.length),
            D6 = v.slice(T6).filter((Q6) => Q6.type === "user" || Q6.type === "assistant");
        if (U = v.length, D6.length > 0) Q.writeMessages(D6)
    }
    let e = null,
        Y6 = null;
    async function H6() {
        if (!j.mcpDeferredPromise || e) return;
        if (!Y6) Y6 = (async () => {
            e = await j.mcpDeferredPromise, $((T6) => ({
                ...T6,
                mcp: {
                    ...T6.mcp,
                    clients: [...T6.mcp.clients, ...e.clients],
                    tools: [...T6.mcp.tools, ...e.tools],
                    commands: [...T6.mcp.commands, ...e.commands]
                }
            })), N6 = [...N6, ...e.commands]
        })();
        await Y6
    }
    let J6 = Promise.resolve({
        response: {
            added: [],
            removed: [],
            errors: {}
        },
        sdkServersChanged: !1
    });

    function K6(T6) {
        let D6 = async () => {
            let Q6 = new Set(u.map((Z6) => Z6.name)),
                k6 = await qSq(T6, {
                    configs: w,
                    clients: u,
                    tools: I
                }, p, $);
            for (let Z6 of Object.keys(w)) delete w[Z6];
            if (Object.assign(w, k6.newSdkState.configs), u = k6.newSdkState.clients, I = k6.newSdkState.tools, p = k6.newDynamicState, k6.sdkServersChanged) {
                let Z6 = new Set(u.map((C6) => C6.name)),
                    u6 = new Set([...Q6, ...Z6]);
                $((C6) => ({
                    ...C6,
                    mcp: {
                        ...C6.mcp,
                        tools: [...C6.mcp.tools.filter((o6) => !Array.from(u6).some((V6) => o6.name.startsWith(HC(V6)))), ...I]
                    }
                }))
            }
            return {
                response: k6.response,
                sdkServersChanged: k6.sdkServersChanged
            }
        };
        return J6 = J6.then(D6, D6), J6
    }
    async function s() {
        try {
            if (await Promise.all([t6(process.env.CLAUDE_CODE_REMOTE) || t4() ? HJ6("headless_user_settings_download", () => IRq()) : Promise.resolve(), HJ6("headless_managed_settings_wait", () => FG1())]), await Vhq()) {
                let {
                    servers: D6
                } = await Je(), Q6 = {};
                for (let [u6, C6] of Object.entries(D6)) {
                    let o6 = C6.type;
                    if (o6 === void 0 || o6 === "stdio" || o6 === "sse" || o6 === "http" || o6 === "sdk") Q6[u6] = C6
                }
                for (let [u6, C6] of Object.entries(w))
                    if (C6.type === "sdk" && !(u6 in Q6)) Q6[u6] = C6;
                let {
                    response: k6,
                    sdkServersChanged: Z6
                } = await K6(Q6);
                if (Z6) b();
                k(`Headless MCP refresh: added=${k6.added.length}, removed=${k6.removed.length}`)
            }
        } catch (T6) {
            _6(T6)
        }
    }
    let X6 = null;
    if (t6(process.env.CLAUDE_CODE_SYNC_PLUGIN_INSTALL)) X6 = s();
    else s();
    let z6 = Dhq(() => !M),
        N6 = K,
        $6 = H;
    async function n() {
        let {
            agentDefinitions: T6
        } = await TN6($);
        N6 = await I0(MI1());
        let D6 = new Set(T6.allAgents.map((k6) => k6.agentType)),
            Q6 = $6.filter((k6) => !D6.has(k6.agentType));
        $6 = [...T6.allAgents, ...Q6]
    }
    let o = YV6.subscribe(() => {
            oB(), I0(MI1()).then((T6) => {
                N6 = T6
            })
        }),
        a = void 0;
    hW6(() => {
        if (W && rP1("now").length > 0) W.abort("interrupt")
    });
    let i = async () => {
        if (M) return;
        if (M = !0, zV6("running"), z6.stop(), await b(), await H6(), X6) {
            let C6 = parseInt(process.env.CLAUDE_CODE_SYNC_PLUGIN_INSTALL_TIMEOUT_MS || "", 10);
            if (C6 > 0) {
                let V6 = new Promise((E6) => setTimeout(E6, C6, "timeout"));
                if (await Promise.race([X6, V6]) === "timeout") _6(Error(`CLAUDE_CODE_SYNC_PLUGIN_INSTALL: plugin installation timed out after ${C6}ms`)), d("tengu_sync_plugin_install_timeout", {
                    timeout_ms: C6
                })
            } else await X6;
            X6 = null, await n();
            let {
                setupPluginHookHotReload: o6
            } = await Promise.resolve().then(() => (O96(), Ck8));
            o6()
        }
        let T6 = [...q, ...e?.clients ?? [], ...u, ...p.clients];
        B(T6);
        let D6 = e ? BT6(e.tools, O().toolPermissionContext) : [],
            Q6 = O(),
            k6 = u66(Q6.toolPermissionContext, Q6.mcp.tools),
            Z6 = K0(fN6([...Y, ...D6, ...I, ...p.tools], k6, Q6.toolPermissionContext.mode), "name");
        if (j.permissionPromptToolName) Z6 = Z6.filter((C6) => !z3(C6, j.permissionPromptToolName));
        let u6 = Lt6();
        if (u6 && !j.jsonSchema) {
            let C6 = aP1(u6);
            if ("tool" in C6) Z6 = [...Z6, C6.tool]
        }
        try {
            let C6, o6 = !1,
                V6 = async () => {
                    while (C6 = lP1()) {
                        if (C6.mode !== "prompt" && C6.mode !== "orphaned-permission" && C6.mode !== "task-notification") throw Error("only prompt commands are supported in streaming mode");
                        if (C6.uuid) pb(C6.uuid, "started");
                        if (C6.mode === "task-notification") {
                            let c6 = typeof C6.value === "string" ? C6.value : "",
                                K1 = c6.match(/<task-id>([^<]+)<\/task-id>/),
                                j6 = c6.match(/<tool-use-id>([^<]+)<\/tool-use-id>/),
                                W6 = c6.match(/<output-file>([^<]+)<\/output-file>/),
                                n6 = c6.match(/<status>([^<]+)<\/status>/),
                                d6 = c6.match(/<summary>([^<]+)<\/summary>/),
                                S6 = (H7) => H7 === "completed" || H7 === "failed" || H7 === "stopped" || H7 === "killed",
                                g6 = n6?.[1],
                                D1 = S6(g6) ? g6 === "killed" ? "stopped" : g6 : "completed",
                                E1 = c6.match(/<usage>([\s\S]*?)<\/usage>/)?.[1] ?? "",
                                K8 = E1.match(/<total_tokens>(\d+)<\/total_tokens>/),
                                e8 = E1.match(/<tool_uses>(\d+)<\/tool_uses>/),
                                n8 = E1.match(/<duration_ms>(\d+)<\/duration_ms>/);
                            Z.enqueue({
                                type: "system",
                                subtype: "task_notification",
                                task_id: K1?.[1] ?? "",
                                tool_use_id: j6?.[1],
                                status: D1,
                                output_file: W6?.[1] ?? "",
                                summary: d6?.[1] ?? "",
                                usage: K8 && e8 ? {
                                    total_tokens: parseInt(K8[1], 10),
                                    tool_uses: parseInt(e8[1], 10),
                                    duration_ms: n8 ? parseInt(n8[1], 10) : 0
                                } : void 0,
                                session_id: R1(),
                                uuid: WD()
                            })
                        }
                        let b6 = C6.value;
                        if (A instanceof AI1 && C6.mode === "prompt") d("tengu_bridge_message_received", {
                            is_repl: !1
                        });
                        if (G.abortController?.abort(), G.abortController = null, G.pendingSuggestion = null, G.pendingLastEmittedEntry = null, G.lastEmitted) {
                            if (C6.mode === "prompt") {
                                let c6 = typeof b6 === "string" ? b6 : b6.find((K1) => K1.type === "text")?.text;
                                if (typeof c6 === "string") nKq(G.lastEmitted.text, c6, G.lastEmitted.emittedAt, G.lastEmitted.promptId, G.lastEmitted.generationRequestId);
                                G.lastEmitted = null
                            }
                        }
                        W = sK();
                        let E6 = void 0,
                            U6 = C6;
                        if (await aA1(U6.workload ?? j.workload, async () => {
                                for await (let c6 of jhq({
                                    commands: N6,
                                    prompt: b6,
                                    promptUuid: U6.uuid,
                                    cwd: MI1(),
                                    tools: Z6,
                                    verbose: j.verbose,
                                    mcpClients: T6,
                                    thinkingConfig: j.thinkingConfig,
                                    maxTurns: j.maxTurns,
                                    maxBudgetUsd: j.maxBudgetUsd,
                                    canUseTool: _,
                                    userSpecifiedModel: R,
                                    fallbackModel: j.fallbackModel,
                                    jsonSchema: Lt6() ?? j.jsonSchema,
                                    mutableMessages: v,
                                    getReadFileCache: () => N,
                                    setReadFileCache: (K1) => {
                                        N = K1
                                    },
                                    customSystemPrompt: j.systemPrompt,
                                    appendSystemPrompt: j.appendSystemPrompt,
                                    getAppState: O,
                                    setAppState: $,
                                    abortController: W,
                                    replayUserMessages: j.replayUserMessages,
                                    includePartialMessages: j.includePartialMessages,
                                    handleElicitation: (K1, j6, W6) => A.handleElicitation(K1, j6.message, void 0, W6, j6.mode, j6.url, "elicitationId" in j6 ? j6.elicitationId : void 0),
                                    agents: $6,
                                    orphanedPermission: U6.orphanedPermission,
                                    setSDKStatus: (K1) => {
                                        Z.enqueue({
                                            type: "system",
                                            subtype: "status",
                                            status: K1,
                                            session_id: R1(),
                                            uuid: WD()
                                        })
                                    }
                                })) if (r(), c6.type === "result") {
                                    for (let j6 of oP1()) Z.enqueue(j6);
                                    let K1 = O();
                                    if (EV8(K1).some((j6) => j6.type === "local_agent" && ij(j6))) P = c6;
                                    else P = null, Z.enqueue(c6)
                                } else {
                                    for (let K1 of oP1()) Z.enqueue(K1);
                                    Z.enqueue(c6)
                                }
                            }), C6.uuid) pb(C6.uuid, "completed");
                        if (r(), Q?.sendResult(), j.promptSuggestions && process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION !== "false") {
                            G.abortController?.abort();
                            let K1 = new AbortController;
                            G.abortController = K1;
                            let j6 = Ky1();
                            if (!j6) F0("sdk_no_params", void 0, void 0, "sdk");
                            else {
                                let W6 = {
                                    promise: null
                                };
                                W6.promise = (async () => {
                                    try {
                                        let n6 = await mp8(K1, v, O, j6, "sdk");
                                        if (!n6 || K1.signal.aborted) return;
                                        let d6 = {
                                                type: "prompt_suggestion",
                                                suggestion: n6.suggestion,
                                                uuid: WD(),
                                                session_id: R1()
                                            },
                                            S6 = {
                                                text: n6.suggestion,
                                                emittedAt: Date.now(),
                                                promptId: n6.promptId,
                                                generationRequestId: n6.generationRequestId
                                            };
                                        if (P) G.pendingSuggestion = d6, G.pendingLastEmittedEntry = {
                                            text: S6.text,
                                            promptId: S6.promptId,
                                            generationRequestId: S6.generationRequestId
                                        };
                                        else G.lastEmitted = S6, Z.enqueue(d6)
                                    } catch (n6) {
                                        if (n6 instanceof Error && (n6.name === "AbortError" || n6.name === "APIUserAbortError")) {
                                            F0("aborted", void 0, void 0, "sdk");
                                            return
                                        }
                                        _6(n6 instanceof Error ? n6 : Error("SDK prompt suggestion generation failed"))
                                    } finally {
                                        if (G.inflightPromise === W6.promise) G.inflightPromise = null
                                    }
                                })(), G.inflightPromise = W6.promise
                            }
                        }
                        Wp8(), Pp8()
                    }
                };
            do {
                for (let b6 of oP1()) Z.enqueue(b6);
                await V6(), o6 = !1;
                {
                    let b6 = O(),
                        E6 = EV8(b6).some((c6) => ij(c6) && c6.type !== "in_process_teammate"),
                        U6 = d36();
                    if (E6 || U6) {
                        if (o6 = !0, !U6) await new Promise((c6) => setTimeout(c6, 100))
                    }
                }
            } while (o6);
            if (P) {
                if (Z.enqueue(P), P = null, G.pendingSuggestion) {
                    if (Z.enqueue(G.pendingSuggestion), G.pendingLastEmittedEntry) G.lastEmitted = {
                        ...G.pendingLastEmittedEntry,
                        emittedAt: Date.now()
                    }, G.pendingLastEmittedEntry = null;
                    G.pendingSuggestion = null
                }
            }
        } catch (C6) {
            try {
                await A.write({
                    type: "result",
                    subtype: "error_during_execution",
                    duration_ms: 0,
                    duration_api_ms: 0,
                    is_error: !0,
                    num_turns: 0,
                    stop_reason: null,
                    session_id: R1(),
                    total_cost_usd: 0,
                    usage: gZ,
                    modelUsage: {},
                    permission_denials: [],
                    uuid: WD(),
                    errors: [_1(C6), ...L$6().map((o6) => o6.error)]
                })
            } catch {}
            G.abortController?.abort(), fK(1);
            return
        } finally {
            if (await A.flushInternalEvents(), !IG1()) zV6("idle");
            M = !1, z6.start()
        }
        if (d36()) {
            i();
            return
        } {
            let o6 = O().teamContext;
            if (o6 && KZ(o6))
                while (!0) {
                    let E6 = O();
                    if (!(cD1(E6) || E6.teamContext && Object.keys(E6.teamContext.teammates).length > 0)) {
                        k("[print.ts] No more active teammates, stopping poll");
                        break
                    }
                    let c6 = await pY6("team-lead", E6.teamContext?.teamName);
                    if (c6.length > 0) {
                        k(`[print.ts] Team-lead found ${c6.length} unread messages`), await kc6("team-lead", E6.teamContext?.teamName);
                        let K1 = E6.teamContext?.teamName;
                        for (let W6 of c6) {
                            let n6 = Lf(W6.text);
                            if (n6 && K1) {
                                let d6 = n6.from;
                                k(`[print.ts] Processing shutdown_approved from ${d6}`);
                                let S6 = E6.teamContext?.teammates ? Object.entries(E6.teamContext.teammates).find(([, g6]) => g6.name === d6)?.[0] : void 0;
                                if (S6) g96(K1, {
                                    agentId: S6,
                                    name: d6
                                }), k(`[print.ts] Removed ${d6} from team file`), await ft(K1, S6, d6, "shutdown"), $((g6) => {
                                    if (!g6.teamContext?.teammates) return g6;
                                    if (!(S6 in g6.teamContext.teammates)) return g6;
                                    let {
                                        [S6]: D1, ...J1
                                    } = g6.teamContext.teammates;
                                    return {
                                        ...g6,
                                        teamContext: {
                                            ...g6.teamContext,
                                            teammates: J1
                                        }
                                    }
                                })
                            }
                        }
                        let j6 = c6.map((W6) => `<${fj} teammate_id="${W6.from}"${W6.color?` color="${W6.color}"`:""}>
${W6.text}
</${fj}>`).join(`

`);
                        _0({
                            mode: "prompt",
                            value: j6,
                            uuid: WD()
                        }), i();
                        return
                    }
                    if (D && !X) {
                        X = !0, k("[print.ts] Input closed with active teammates, injecting shutdown prompt"), _0({
                            mode: "prompt",
                            value: ohq,
                            uuid: WD()
                        }), i();
                        return
                    }
                    await new Promise((K1) => setTimeout(K1, 500))
                }
        }
        if (D)
            if (await (async () => {
                    let o6 = O();
                    if (AT8(o6)) await qT8($, o6);
                    let V6 = O(),
                        b6 = V6.teamContext;
                    return b6 && Object.keys(b6.teammates).length > 0 || cD1(V6)
                })()) _0({
                mode: "prompt",
                value: ohq,
                uuid: WD()
            }), i();
            else {
                if (G.inflightPromise) await Promise.race([G.inflightPromise, new Promise((o6) => setTimeout(o6, 5000))]);
                G.abortController?.abort(), G.abortController = null, await oF8(), o(), Nt.delete(f), Z.done()
            }
    }, l = null;
    if (nhq && rhq?.isKairosCronEnabled()) l = nhq.createCronScheduler({
        onFire: (T6) => {
            if (D) return;
            _0({
                mode: "prompt",
                value: T6,
                uuid: WD(),
                priority: "later",
                isMeta: !0,
                workload: rA1
            }), i()
        },
        isLoading: () => M || D,
        getJitterConfig: xXz?.getCronJitterConfig,
        isKilled: () => !rhq?.isKairosCronEnabled()
    }), l.start();
    let q6 = function(T6, D6) {
            Z.enqueue({
                type: "control_response",
                response: {
                    subtype: "success",
                    request_id: T6.request_id,
                    response: D6
                }
            })
        },
        w6 = function(T6, D6) {
            Z.enqueue({
                type: "control_response",
                response: {
                    subtype: "error",
                    request_id: T6.request_id,
                    error: D6
                }
            })
        },
        O6 = new Set;
    A.setUnexpectedResponseCallback(async (T6) => {
        await ASq({
            message: T6,
            setAppState: $,
            handledToolUseIds: O6,
            onEnqueued: () => {
                i()
            }
        })
    });
    let L6 = new Map,
        y6 = new Map,
        G6 = new Set,
        R6 = new Map;
    return (async () => {
        let T6 = !1;
        U1("info", "cli_message_loop_started");
        for await (let D6 of A.structuredInput) {
            let Q6 = "uuid" in D6 ? D6.uuid : void 0;
            if (Q6 && D6.type !== "user" && D6.type !== "control_response") pb(Q6, "started"), pb(Q6, "completed");
            if (D6.type === "control_request") {
                if (D6.request.subtype === "interrupt") {
                    if (W) W.abort();
                    G.abortController?.abort(), G.abortController = null, G.lastEmitted = null, G.pendingSuggestion = null, q6(D6)
                } else if (D6.request.subtype === "end_session") {
                    if (k(`[print.ts] end_session received, reason=${D6.request.reason??"unspecified"}`), W) W.abort();
                    G.abortController?.abort(), G.abortController = null, G.lastEmitted = null, G.pendingSuggestion = null, q6(D6);
                    break
                } else if (D6.request.subtype === "initialize") {
                    if (D6.request.sdkMcpServers && D6.request.sdkMcpServers.length > 0)
                        for (let k6 of D6.request.sdkMcpServers) w[k6] = {
                            type: "sdk",
                            name: k6
                        };
                    if (await FXz(D6.request, D6.request_id, T6, Z, K, h, A, !!j.enableAuthStatus, j, H, O), D6.request.promptSuggestions) $((k6) => {
                        if (k6.promptSuggestionEnabled) return k6;
                        return {
                            ...k6,
                            promptSuggestionEnabled: !0
                        }
                    });
                    if (D6.request.agentProgressSummaries && w8("tengu_slate_prism", !0)) Vu1(!0);
                    if (T6 = !0, d36()) i()
                } else if (D6.request.subtype === "set_permission_mode") {
                    let k6 = D6.request;
                    $((Z6) => ({
                        ...Z6,
                        toolPermissionContext: pXz(k6, D6.request_id, Z6.toolPermissionContext, Z)
                    }))
                } else if (D6.request.subtype === "set_model") {
                    let k6 = D6.request.model ?? "default",
                        Z6 = k6 === "default" ? g0() : k6;
                    R = Z6, MW(Z6), EC1({
                        model: Z6
                    });
                    let u6 = fTq(k6, oR(Z6));
                    v.push(...u6);
                    for (let C6 of u6)
                        if (typeof C6.message.content === "string" && C6.message.content.includes(`<${WP}>`)) Z.enqueue({
                            type: "user",
                            message: C6.message,
                            session_id: R1(),
                            parent_tool_use_id: null,
                            uuid: C6.uuid,
                            isReplay: !0
                        });
                    q6(D6)
                } else if (D6.request.subtype === "set_max_thinking_tokens") {
                    if (D6.request.max_thinking_tokens === null) j.thinkingConfig = void 0;
                    else if (D6.request.max_thinking_tokens === 0) j.thinkingConfig = {
                        type: "disabled"
                    };
                    else j.thinkingConfig = {
                        type: "enabled",
                        budgetTokens: D6.request.max_thinking_tokens
                    };
                    q6(D6)
                } else if (D6.request.subtype === "mcp_status") {
                    await H6();
                    let k6 = O(),
                        Z6 = k6.mcp.clients,
                        u6 = K0([...k6.mcp.tools, ...p.tools], "name"),
                        C6 = new Set([...Z6.map((V6) => V6.name), ...u.map((V6) => V6.name)]),
                        o6 = [...Z6, ...u, ...p.clients.filter((V6) => !C6.has(V6.name))].map((V6) => {
                            let b6;
                            if (V6.config.type === "sse" || V6.config.type === "http") b6 = {
                                type: V6.config.type,
                                url: V6.config.url,
                                headers: V6.config.headers,
                                oauth: V6.config.oauth
                            };
                            else if (V6.config.type === "claudeai-proxy") b6 = {
                                type: "claudeai-proxy",
                                url: V6.config.url,
                                id: V6.config.id
                            };
                            else if (V6.config.type === "stdio" || V6.config.type === void 0) b6 = {
                                type: "stdio",
                                command: V6.config.command,
                                args: V6.config.args
                            };
                            let E6 = V6.type === "connected" ? eB(u6, V6.name).map((U6) => ({
                                name: U6.mcpInfo?.toolName ?? U6.name,
                                annotations: {
                                    readOnly: U6.isReadOnly({}) || void 0,
                                    destructive: U6.isDestructive?.({}) || void 0,
                                    openWorld: U6.isOpenWorld?.({}) || void 0
                                }
                            })) : void 0;
                            return {
                                name: V6.name,
                                status: V6.type,
                                serverInfo: V6.type === "connected" ? V6.serverInfo : void 0,
                                error: V6.type === "failed" ? V6.error : void 0,
                                config: b6,
                                scope: V6.config.scope,
                                tools: E6
                            }
                        });
                    q6(D6, {
                        mcpServers: o6
                    })
                } else if (D6.request.subtype === "mcp_message") {
                    let k6 = D6.request,
                        Z6 = u.find((u6) => u6.name === k6.server_name);
                    if (Z6 && Z6.type === "connected" && Z6.client?.transport?.onmessage) Z6.client.transport.onmessage(k6.message);
                    q6(D6)
                } else if (D6.request.subtype === "rewind_files") {
                    let k6 = O(),
                        Z6 = await thq(D6.request.user_message_id, k6, $, D6.request.dry_run ?? !1);
                    if (Z6.canRewind || D6.request.dry_run) q6(D6, Z6);
                    else w6(D6, Z6.error ?? "Unexpected error")
                } else if (D6.request.subtype === "cancel_async_message") {
                    let k6 = D6.request.message_uuid,
                        Z6 = iP1((u6) => u6.uuid === k6);
                    q6(D6, {
                        cancelled: Z6.length > 0
                    })
                } else if (D6.request.subtype === "mcp_set_servers") {
                    let {
                        response: k6,
                        sdkServersChanged: Z6
                    } = await K6(D6.request.servers);
                    if (q6(D6, k6), Z6) b()
                } else if (D6.request.subtype === "mcp_reconnect") {
                    await H6();
                    let k6 = O(),
                        {
                            serverName: Z6
                        } = D6.request;
                    g.delete(Z6);
                    let u6 = cv(Z6) ?? q.find((C6) => C6.name === Z6)?.config ?? u.find((C6) => C6.name === Z6)?.config ?? p.clients.find((C6) => C6.name === Z6)?.config ?? k6.mcp.clients.find((C6) => C6.name === Z6)?.config ?? null;
                    if (!u6) w6(D6, `Server not found: ${Z6}`);
                    else {
                        let C6 = await nl(Z6, u6),
                            o6 = HC(Z6);
                        if ($((V6) => ({
                                ...V6,
                                mcp: {
                                    ...V6.mcp,
                                    clients: V6.mcp.clients.map((b6) => b6.name === Z6 ? C6.client : b6),
                                    tools: [...yN(V6.mcp.tools, (b6) => b6.name?.startsWith(o6)), ...C6.tools],
                                    commands: [...yN(V6.mcp.commands, (b6) => b6.name?.startsWith(o6)), ...C6.commands],
                                    resources: C6.resources && C6.resources.length > 0 ? {
                                        ...V6.mcp.resources,
                                        [Z6]: C6.resources
                                    } : Z16(V6.mcp.resources, Z6)
                                }
                            })), p = {
                                ...p,
                                clients: [...p.clients.filter((V6) => V6.name !== Z6), C6.client],
                                tools: [...p.tools.filter((V6) => !V6.name?.startsWith(o6)), ...C6.tools]
                            }, C6.client.type === "connected") B([C6.client]), q6(D6);
                        else {
                            let V6 = C6.client.type === "failed" ? C6.client.error ?? "Connection failed" : `Server status: ${C6.client.type}`;
                            w6(D6, V6)
                        }
                    }
                } else if (D6.request.subtype === "mcp_toggle") {
                    await H6();
                    let k6 = O(),
                        {
                            serverName: Z6,
                            enabled: u6
                        } = D6.request;
                    g.delete(Z6);
                    let C6 = cv(Z6) ?? q.find((o6) => o6.name === Z6)?.config ?? u.find((o6) => o6.name === Z6)?.config ?? p.clients.find((o6) => o6.name === Z6)?.config ?? k6.mcp.clients.find((o6) => o6.name === Z6)?.config ?? null;
                    if (!C6) w6(D6, `Server not found: ${Z6}`);
                    else if (!u6) {
                        MZ6(Z6, !1);
                        let o6 = [...q, ...u, ...p.clients, ...k6.mcp.clients].find((b6) => b6.name === Z6);
                        if (o6 && o6.type === "connected") await VN(Z6, C6);
                        let V6 = HC(Z6);
                        $((b6) => ({
                            ...b6,
                            mcp: {
                                ...b6.mcp,
                                clients: b6.mcp.clients.map((E6) => E6.name === Z6 ? {
                                    name: Z6,
                                    type: "disabled",
                                    config: C6
                                } : E6),
                                tools: yN(b6.mcp.tools, (E6) => E6.name?.startsWith(V6)),
                                commands: yN(b6.mcp.commands, (E6) => E6.name?.startsWith(V6)),
                                resources: Z16(b6.mcp.resources, Z6)
                            }
                        })), q6(D6)
                    } else {
                        MZ6(Z6, !0);
                        let o6 = await nl(Z6, C6),
                            V6 = HC(Z6);
                        if ($((b6) => ({
                                ...b6,
                                mcp: {
                                    ...b6.mcp,
                                    clients: b6.mcp.clients.map((E6) => E6.name === Z6 ? o6.client : E6),
                                    tools: [...yN(b6.mcp.tools, (E6) => E6.name?.startsWith(V6)), ...o6.tools],
                                    commands: [...yN(b6.mcp.commands, (E6) => E6.name?.startsWith(V6)), ...o6.commands],
                                    resources: o6.resources && o6.resources.length > 0 ? {
                                        ...b6.mcp.resources,
                                        [Z6]: o6.resources
                                    } : Z16(b6.mcp.resources, Z6)
                                }
                            })), o6.client.type === "connected") B([o6.client]), q6(D6);
                        else {
                            let b6 = o6.client.type === "failed" ? o6.client.error ?? "Connection failed" : `Server status: ${o6.client.type}`;
                            w6(D6, b6)
                        }
                    }
                } else if (D6.request.subtype === "mcp_authenticate") {
                    await H6();
                    let {
                        serverName: k6
                    } = D6.request, Z6 = O(), u6 = cv(k6) ?? q.find((C6) => C6.name === k6)?.config ?? Z6.mcp.clients.find((C6) => C6.name === k6)?.config ?? null;
                    if (!u6) w6(D6, `Server not found: ${k6}`);
                    else if (u6.type !== "sse" && u6.type !== "http") w6(D6, `Server type "${u6.type}" does not support OAuth authentication`);
                    else try {
                        L6.get(k6)?.abort();
                        let C6 = new AbortController;
                        L6.set(k6, C6);
                        let o6, V6 = new Promise((c6) => {
                                o6 = c6
                            }),
                            b6 = mv6(k6, u6, (c6) => o6(c6), C6.signal, {
                                skipBrowserOpen: !0,
                                onWaitingForCallback: (c6) => {
                                    y6.set(k6, c6)
                                }
                            }),
                            E6 = await Promise.race([V6, b6.then(() => null)]);
                        if (E6) q6(D6, {
                            authUrl: E6,
                            requiresUserAction: !0
                        });
                        else q6(D6, {
                            requiresUserAction: !1
                        });
                        R6.set(k6, b6);
                        let U6 = b6.then(async () => {
                            if (iv(k6)) return;
                            if (G6.has(k6)) return;
                            let c6 = await nl(k6, u6),
                                K1 = HC(k6);
                            $((j6) => ({
                                ...j6,
                                mcp: {
                                    ...j6.mcp,
                                    clients: j6.mcp.clients.map((W6) => W6.name === k6 ? c6.client : W6),
                                    tools: [...yN(j6.mcp.tools, (W6) => W6.name?.startsWith(K1)), ...c6.tools],
                                    commands: [...yN(j6.mcp.commands, (W6) => W6.name?.startsWith(K1)), ...c6.commands],
                                    resources: c6.resources && c6.resources.length > 0 ? {
                                        ...j6.mcp.resources,
                                        [k6]: c6.resources
                                    } : Z16(j6.mcp.resources, k6)
                                }
                            })), p = {
                                ...p,
                                clients: [...p.clients.filter((j6) => j6.name !== k6), c6.client],
                                tools: [...p.tools.filter((j6) => !j6.name?.startsWith(K1)), ...c6.tools]
                            }
                        }).catch((c6) => {
                            k(`MCP OAuth failed for ${k6}: ${c6}`, {
                                level: "error"
                            })
                        }).finally(() => {
                            if (L6.get(k6) === C6) L6.delete(k6), y6.delete(k6), G6.delete(k6), R6.delete(k6)
                        })
                    } catch (C6) {
                        w6(D6, _1(C6))
                    }
                } else if (D6.request.subtype === "mcp_oauth_callback_url") {
                    let {
                        serverName: k6,
                        callbackUrl: Z6
                    } = D6.request, u6 = y6.get(k6);
                    if (u6) {
                        let C6 = !1;
                        try {
                            let o6 = new URL(Z6);
                            C6 = o6.searchParams.has("code") || o6.searchParams.has("error")
                        } catch {}
                        if (!C6) w6(D6, "Invalid callback URL: missing authorization code. Please paste the full redirect URL including the code parameter.");
                        else {
                            G6.add(k6), u6(Z6);
                            let o6 = R6.get(k6);
                            if (o6) try {
                                await o6, q6(D6)
                            } catch (V6) {
                                w6(D6, V6 instanceof Error ? V6.message : "OAuth authentication failed")
                            } else q6(D6)
                        }
                    } else w6(D6, `No active OAuth flow for server: ${k6}`)
                } else if (D6.request.subtype === "mcp_clear_auth") {
                    await H6();
                    let {
                        serverName: k6
                    } = D6.request, Z6 = O(), u6 = cv(k6) ?? q.find((C6) => C6.name === k6)?.config ?? Z6.mcp.clients.find((C6) => C6.name === k6)?.config ?? null;
                    if (!u6) w6(D6, `Server not found: ${k6}`);
                    else if (u6.type !== "sse" && u6.type !== "http") w6(D6, `Cannot clear auth for server type "${u6.type}"`);
                    else {
                        await Tn6(k6, u6);
                        let C6 = await nl(k6, u6),
                            o6 = HC(k6);
                        $((V6) => ({
                            ...V6,
                            mcp: {
                                ...V6.mcp,
                                clients: V6.mcp.clients.map((b6) => b6.name === k6 ? C6.client : b6),
                                tools: [...yN(V6.mcp.tools, (b6) => b6.name?.startsWith(o6)), ...C6.tools],
                                commands: [...yN(V6.mcp.commands, (b6) => b6.name?.startsWith(o6)), ...C6.commands],
                                resources: C6.resources && C6.resources.length > 0 ? {
                                    ...V6.mcp.resources,
                                    [k6]: C6.resources
                                } : Z16(V6.mcp.resources, k6)
                            }
                        })), q6(D6, {})
                    }
                } else if (D6.request.subtype === "apply_flag_settings") {
                    let k6 = Fw6() ?? {},
                        Z6 = D6.request.settings;
                    yu1({
                        ...k6,
                        ...Z6
                    }), tO.notifyChange("flagSettings"), q6(D6)
                } else if (D6.request.subtype === "get_settings") {
                    let k6 = O(),
                        Z6 = cK(),
                        u6 = yC(Z6) ? rq6(Z6, k6.effortValue) : void 0;
                    q6(D6, {
                        ...Svq(),
                        applied: {
                            model: Z6,
                            effort: typeof u6 === "string" ? u6 : null
                        }
                    })
                } else if (D6.request.subtype === "stop_task") {
                    let {
                        task_id: k6
                    } = D6.request;
                    try {
                        await Qk1(k6, {
                            abortController: W ?? sK(),
                            getAppState: O,
                            setAppState: $
                        }), q6(D6, {})
                    } catch (Z6) {
                        w6(D6, _1(Z6))
                    }
                } else if (D6.request.subtype === "generate_session_title") {
                    let {
                        description: k6,
                        persist: Z6
                    } = D6.request, u6 = (W && !W.signal.aborted ? W : sK()).signal;
                    (async () => {
                        try {
                            let C6 = await wI1(k6, u6);
                            if (C6 && Z6) try {
                                Xr8(R1(), C6)
                            } catch (o6) {
                                _6(o6)
                            }
                            q6(D6, {
                                title: C6
                            })
                        } catch (C6) {
                            w6(D6, _1(C6))
                        }
                    })()
                } else if (D6.request.subtype === "remote_control")
                    if (D6.request.enabled)
                        if (Q) q6(D6, {
                            session_url: hZ(Q.bridgeSessionId, Q.sessionIngressUrl),
                            connect_url: z86(Q.environmentId, Q.sessionIngressUrl),
                            environment_id: Q.environmentId
                        });
                        else try {
                            let {
                                initReplBridge: k6
                            } = await Promise.resolve().then(() => (Ns8(), vs8)), Z6 = await k6({
                                onInboundMessage(u6) {
                                    let C6 = _I1(u6);
                                    if (!C6) return;
                                    let {
                                        content: o6,
                                        uuid: V6
                                    } = C6;
                                    _0({
                                        value: o6,
                                        mode: "prompt",
                                        uuid: V6,
                                        skipSlashCommands: !0
                                    }), i()
                                },
                                onPermissionResponse(u6) {
                                    A.injectControlResponse(u6)
                                },
                                onInterrupt() {
                                    W?.abort()
                                },
                                onSetModel(u6) {
                                    let C6 = u6 === "default" ? g0() : u6;
                                    R = C6, MW(C6)
                                },
                                onSetMaxThinkingTokens(u6) {
                                    if (u6 === null) j.thinkingConfig = void 0;
                                    else if (u6 === 0) j.thinkingConfig = {
                                        type: "disabled"
                                    };
                                    else j.thinkingConfig = {
                                        type: "enabled",
                                        budgetTokens: u6
                                    }
                                },
                                onStateChange(u6, C6) {
                                    k(`[bridge:sdk] State change: ${u6}${C6?` — ${C6}`:""}`), Z.enqueue({
                                        type: "system",
                                        subtype: "bridge_state",
                                        state: u6,
                                        detail: C6,
                                        uuid: WD(),
                                        session_id: R1()
                                    })
                                },
                                initialMessages: v.length > 0 ? v : void 0
                            });
                            if (!Z6) w6(D6, "Remote Control initialization failed");
                            else Q = Z6, U = v.length, A.setOnControlRequestSent((u6) => {
                                Z6.sendControlRequest(u6)
                            }), A.setOnControlRequestResolved((u6) => {
                                Z6.sendControlCancelRequest(u6)
                            }), q6(D6, {
                                session_url: hZ(Z6.bridgeSessionId, Z6.sessionIngressUrl),
                                connect_url: z86(Z6.environmentId, Z6.sessionIngressUrl),
                                environment_id: Z6.environmentId
                            })
                        } catch (k6) {
                            w6(D6, _1(k6))
                        } else {
                            if (Q) A.setOnControlRequestSent(void 0), A.setOnControlRequestResolved(void 0), await Q.teardown(), Q = null;
                            q6(D6)
                        } else w6(D6, `Unsupported control request subtype: ${D6.request.subtype}`);
                continue
            } else if (D6.type === "control_response") {
                if (j.replayUserMessages) Z.enqueue(D6);
                continue
            } else if (D6.type === "keep_alive") continue;
            else if (D6.type === "update_environment_variables") continue;
            else if (D6.type === "assistant" || D6.type === "system") {
                let k6 = LR1([D6]);
                if (v.push(...k6), D6.type === "assistant" && j.replayUserMessages) Z.enqueue(D6);
                continue
            }
            if (D6.type !== "user") continue;
            if (T6 = !0, D6.uuid) {
                let k6 = R1();
                if (await Zr8(k6, D6.uuid) || PI1.has(D6.uuid)) {
                    if (k(`Skipping duplicate user message: ${D6.uuid}`), j.replayUserMessages) k(`Sending acknowledgment for duplicate user message: ${D6.uuid}`), Z.enqueue({
                        type: "user",
                        message: D6.message,
                        session_id: k6,
                        parent_tool_use_id: null,
                        uuid: D6.uuid,
                        isReplay: !0
                    });
                    continue
                }
                uXz(D6.uuid)
            }
            _0({
                mode: "prompt",
                value: D6.message.content,
                uuid: D6.uuid,
                priority: D6.priority
            }), i()
        }
        if (D = !0, l?.stop(), !M) {
            if (G.inflightPromise) await Promise.race([G.inflightPromise, new Promise((D6) => setTimeout(D6, 5000))]);
            G.abortController?.abort(), G.abortController = null, await oF8(), o(), Nt.delete(f), Z.done()
        }
    })(), Z
}
// @from(Ln 483960, Col 0)
function shq(A) {
    let q = async (K, Y, z, _, w) => {
        let O = await tJ(K, Y, z, _, w);
        if (O.behavior === "allow" || O.behavior === "deny") return O;
        let {
            signal: $,
            cleanup: H
        } = mN(z.abortController.signal);
        if ($.aborted) return H(), {
            behavior: "deny",
            message: "Permission prompt was aborted.",
            decisionReason: {
                type: "permissionPromptTool",
                permissionPromptToolName: K.name,
                toolResult: void 0
            }
        };
        let j = new Promise((P) => {
                $.addEventListener("abort", () => P("aborted"), {
                    once: !0
                })
            }),
            J = A.call({
                tool_name: K.name,
                input: Y,
                tool_use_id: w
            }, z, q, _),
            M = await Promise.race([J, j]);
        if (H(), M === "aborted" || $.aborted) return {
            behavior: "deny",
            message: "Permission prompt was aborted.",
            decisionReason: {
                type: "permissionPromptTool",
                permissionPromptToolName: K.name,
                toolResult: void 0
            }
        };
        let D = M,
            X = A.mapToolResultToToolResultBlockParam(D.data, "1");
        if (!X.content || !Array.isArray(X.content) || !X.content[0] || X.content[0].type !== "text" || typeof X.content[0].text !== "string") throw Error('Permission prompt tool returned an invalid result. Expected a single text block param with type="text" and a string text value.');
        return JV6(ao6().parse(WK(X.content[0].text)), A, Y, z)
    };
    return q
}
// @from(Ln 484005, Col 0)
function gXz(A, q, K, Y) {
    if (A === "stdio") return q.createCanUseTool(Y);
    else if (A) {
        let z = K.find((_) => z3(_, A));
        if (!z) {
            let _ = `Error: MCP tool ${A} (passed via --permission-prompt-tool) not found. Available MCP tools: ${K.map((w)=>w.name).join(", ")||"none"}`;
            throw process.stderr.write(`${_}
`), fK(1), Error(_)
        }
        if (!z.inputJSONSchema) {
            let _ = `Error: tool ${A} (passed via --permission-prompt-tool) must be an MCP tool`;
            throw process.stderr.write(`${_}
`), fK(1), Error(_)
        }
        return shq(z)
    }
    return tJ
}
// @from(Ln 484023, Col 0)
async function FXz(A, q, K, Y, z, _, w, O, $, H, j) {
    if (K) {
        Y.enqueue({
            type: "control_response",
            response: {
                subtype: "error",
                error: "Already initialized",
                request_id: q,
                pending_permission_requests: w.getPendingPermissionRequests()
            }
        });
        return
    }
    if (A.systemPrompt !== void 0) $.systemPrompt = A.systemPrompt;
    if (A.appendSystemPrompt !== void 0) $.appendSystemPrompt = A.appendSystemPrompt;
    if (A.promptSuggestions !== void 0) $.promptSuggestions = A.promptSuggestions;
    if (A.agents) {
        let W = _Q6(A.agents, "flagSettings");
        H.push(...W)
    }
    if ($.agent) {
        let W = H.find((Z) => Z.agentType === $.agent);
        if (W) {
            if (Wp(W.agentType), !$.systemPrompt && !Qj(W)) {
                let Z = W.getSystemPrompt();
                if (Z) $.systemPrompt = Z
            }
            if (!$.userSpecifiedModel && W.model && W.model !== "inherit") {
                let Z = H5(W.model);
                MW(Z)
            }
        }
    }
    let M = PA()?.outputStyle || hf,
        D = await Tv6(G1()),
        X = _c6();
    if (A.hooks) {
        let W = {};
        for (let [Z, G] of Object.entries(A.hooks)) W[Z] = G.map((f) => {
            let v = f.hookCallbackIds.map((N) => {
                return w.createHookCallback(N, f.timeout)
            });
            return {
                matcher: f.matcher,
                hooks: v
            }
        });
        KA6(W)
    }
    if (A.jsonSchema) cu1(A.jsonSchema);
    let P = {
        commands: z.filter((W) => W.userInvocable !== !1).map((W) => ({
            name: W.userFacingName(),
            description: Sv6(W),
            argumentHint: W.argumentHint || ""
        })),
        agents: H.map((W) => ({
            name: W.agentType,
            description: W.whenToUse,
            model: W.model === "inherit" ? void 0 : W.model
        })),
        output_style: M,
        available_output_styles: Object.keys(D),
        models: _,
        account: {
            email: X?.email,
            organization: X?.organization,
            subscriptionType: X?.subscription,
            tokenSource: X?.tokenSource,
            apiKeySource: X?.apiKeySource
        },
        pid: process.pid
    };
    if (Dq() && yj()) {
        let W = j();
        P.fast_mode_state = Mm($.userSpecifiedModel ?? null, W.fastMode)
    }
    if (Y.enqueue({
            type: "control_response",
            response: {
                subtype: "success",
                request_id: q,
                response: P
            }
        }), O) {
        let Z = e0.getInstance().getStatus();
        if (Z) Y.enqueue({
            type: "auth_status",
            isAuthenticating: Z.isAuthenticating,
            output: Z.output,
            error: Z.error,
            uuid: WD(),
            session_id: R1()
        })
    }
}
// @from(Ln 484119, Col 0)
async function thq(A, q, K, Y) {
    if (!iz()) return {
        canRewind: !1,
        error: "File rewinding is not enabled."
    };
    if (!tN1(q.fileHistory, A)) return {
        canRewind: !1,
        error: "No file checkpoint found for this message."
    };
    if (Y) {
        let z = eN1(q.fileHistory, A);
        return {
            canRewind: !0,
            filesChanged: z?.filesChanged,
            insertions: z?.insertions,
            deletions: z?.deletions
        }
    }
    try {
        await sN1((z) => K((_) => ({
            ..._,
            fileHistory: z(_.fileHistory)
        })), A)
    } catch (z) {
        return {
            canRewind: !1,
            error: `Failed to rewind: ${z.message}`
        }
    }
    return {
        canRewind: !0
    }
}
// @from(Ln 484153, Col 0)
function pXz(A, q, K, Y) {
    if (A.mode === "bypassPermissions") {
        if (bd()) return Y.enqueue({
            type: "control_response",
            response: {
                subtype: "error",
                request_id: q,
                error: "Cannot set permission mode to bypassPermissions because it is disabled by settings or configuration"
            }
        }), K;
        if (!K.isBypassPermissionsModeAvailable) return Y.enqueue({
            type: "control_response",
            response: {
                subtype: "error",
                request_id: q,
                error: "Cannot set permission mode to bypassPermissions because the session was not launched with --dangerously-skip-permissions"
            }
        }), K
    }
    if (A.mode === "auto" && !IN()) return Y.enqueue({
        type: "control_response",
        response: {
            subtype: "error",
            request_id: q,
            error: "Cannot set permission mode to auto because the dangerous action classifier is not enabled"
        }
    }), K;
    return Y.enqueue({
        type: "control_response",
        response: {
            subtype: "success",
            request_id: q,
            response: {
                mode: A.mode
            }
        }
    }), {
        ...ki(K.mode, A.mode, K),
        mode: A.mode
    }
}
// @from(Ln 484195, Col 0)
function XI1(A, q) {
    if (q === "stream-json") {
        let K = {
            type: "result",
            subtype: "error_during_execution",
            duration_ms: 0,
            duration_api_ms: 0,
            is_error: !0,
            num_turns: 0,
            stop_reason: null,
            session_id: R1(),
            total_cost_usd: 0,
            usage: gZ,
            modelUsage: {},
            permission_denials: [],
            uuid: WD(),
            errors: [A]
        };
        process.stdout.write(B6(K) + `
`)
    } else process.stderr.write(A + `
`)
}
// @from(Ln 484219, Col 0)
function ehq(A, q) {
    let K = A.findIndex((Y) => Y.uuid === q.uuid);
    if (K !== -1) A.splice(K, 2)
}
// @from(Ln 484223, Col 0)
async function QXz(A, q) {
    let K = !jS();
    if (q.continue) try {
        d("tengu_continue_print", {});
        let Y = await h66(void 0, void 0);
        if (Y) {
            if (!q.forkSession) {
                if (Y.sessionId) {
                    if (_P(eJ(Y.sessionId), Y.fullPath ? ihq(Y.fullPath) : null), K) await Zh()
                }
            }
            return co6(Y, A), LF(Y), {
                messages: Y.messages,
                turnInterruptionState: Y.turnInterruptionState,
                agentSetting: Y.agentSetting
            }
        }
    } catch (Y) {
        return _6(Y), fK(1), {
            messages: []
        }
    }
    if (q.teleport) try {
        if (!qD("allow_remote_sessions")) throw Error("Remote sessions are disabled by your organization's policy.");
        if (d("tengu_teleport_print", {}), typeof q.teleport !== "string") throw Error("No session ID provided for teleport");
        let {
            checkOutTeleportedSessionBranch: Y,
            processMessagesForTeleportResume: z,
            teleportResumeCodeSession: _,
            validateGitState: w
        } = await Promise.resolve().then(() => (S66(), bn4));
        await w();
        let O = await _(q.teleport),
            {
                branchError: $
            } = await Y(O.branch);
        return {
            messages: z(O.log, $)
        }
    } catch (Y) {
        return _6(Y), fK(1), {
            messages: []
        }
    }
    if (q.resume) try {
        d("tengu_resume_print", {});
        let Y = Whq(typeof q.resume === "string" ? q.resume : "");
        if (!Y) {
            let _ = "Error: --resume requires a valid session ID when used with --print. Usage: claude -p --resume <session-id>";
            if (typeof q.resume === "string") _ += `. Session IDs must be in UUID format (e.g., 550e8400-e29b-41d4-a716-446655440000). Provided value "${q.resume}" is not a valid UUID`;
            return XI1(_, q.outputFormat), fK(1), {
                messages: []
            }
        }
        if (t6(process.env.CLAUDE_CODE_USE_CCR_V2)) await jr8(Y.sessionId);
        else if (Y.isUrl && Y.ingressUrl && t6("true")) await Hr8(Y.sessionId, Y.ingressUrl);
        let z = await h66(Y.sessionId, Y.jsonlFile || void 0);
        if (!z)
            if (Y.isUrl || t6(process.env.CLAUDE_CODE_USE_CCR_V2)) return {
                messages: await C0("startup")
            };
            else return XI1(`No conversation found with session ID: ${Y.sessionId}`, q.outputFormat), fK(1), {
                messages: []
            };
        if (q.resumeSessionAt) {
            let _ = z.messages.findIndex((w) => w.uuid === q.resumeSessionAt);
            if (_ < 0) return XI1(`No message found with message.uuid of: ${q.resumeSessionAt}`, q.outputFormat), fK(1), {
                messages: []
            };
            z.messages = _ >= 0 ? z.messages.slice(0, _ + 1) : []
        }
        if (!q.forkSession && z.sessionId) {
            if (_P(eJ(z.sessionId), z.fullPath ? ihq(z.fullPath) : null), K) await Zh()
        }
        return co6(z, A), LF(z), {
            messages: z.messages,
            turnInterruptionState: z.turnInterruptionState,
            agentSetting: z.agentSetting
        }
    } catch (Y) {
        _6(Y);
        let z = Y instanceof Error ? `Failed to resume session: ${Y.message}` : "Failed to resume session with --print mode";
        return XI1(z, q.outputFormat), fK(1), {
            messages: []
        }
    }
    return {
        messages: await C0("startup")
    }
}
// @from(Ln 484314, Col 0)
function UXz(A, q) {
    let K;
    if (typeof A === "string")
        if (A.trim() !== "") K = tV8([B6({
            type: "user",
            session_id: "",
            message: {
                role: "user",
                content: A
            },
            parent_tool_use_id: null
        })]);
        else K = tV8([]);
    else K = A;
    return q.sdkUrl ? new AI1(q.sdkUrl, K, q.replayUserMessages) : new so6(K, q.replayUserMessages)
}
// @from(Ln 484330, Col 0)
async function ASq({
    message: A,
    setAppState: q,
    onEnqueued: K,
    handledToolUseIds: Y
}) {
    if (A.response.subtype === "success" && A.response.response?.toolUseID && typeof A.response.response.toolUseID === "string") {
        let z = A.response.response,
            {
                toolUseID: _
            } = z;
        if (!_) return !1;
        if (k(`handleOrphanedPermissionResponse: received orphaned control_response for toolUseID=${_} request_id=${A.response.request_id}`), Y.has(_)) return k(`handleOrphanedPermissionResponse: skipping duplicate orphaned permission for toolUseID=${_} (already handled)`), !1;
        let w = await fr8(_);
        if (!w) return k(`handleOrphanedPermissionResponse: no unresolved tool_use found for toolUseID=${_} (already resolved in transcript)`), !1;
        return Y.add(_), k(`handleOrphanedPermissionResponse: enqueuing orphaned permission for toolUseID=${_} messageID=${w.message.id}`), _0({
            mode: "orphaned-permission",
            value: [],
            orphanedPermission: {
                permissionResult: z,
                assistantMessage: w
            }
        }), K?.(), !0
    }
    return !1
}
// @from(Ln 484357, Col 0)
function Vs8(A) {
    return {
        ...A,
        scope: "dynamic"
    }
}
// @from(Ln 484363, Col 0)
async function qSq(A, q, K, Y) {
    let z = {},
        _ = {};
    for (let [X, P] of Object.entries(A))
        if (P.type === "sdk") z[X] = P;
        else _[X] = P;
    let w = new Set(Object.keys(q.configs)),
        O = new Set(Object.keys(z)),
        $ = [],
        H = [],
        j = {
            ...q.configs
        },
        J = [...q.clients],
        M = [...q.tools];
    for (let X of w)
        if (!O.has(X)) {
            let P = J.find((Z) => Z.name === X);
            if (P && P.type === "connected") await P.cleanup();
            J = J.filter((Z) => Z.name !== X);
            let W = `mcp__${X}__`;
            M = M.filter((Z) => !Z.name.startsWith(W)), delete j[X], H.push(X)
        } for (let [X, P] of Object.entries(z))
        if (!w.has(X)) {
            j[X] = P;
            let W = {
                type: "pending",
                name: X,
                config: {
                    ...P,
                    scope: "dynamic"
                }
            };
            J = [...J, W], $.push(X)
        } let D = await KSq(_, K, Y);
    return {
        response: {
            added: [...$, ...D.response.added],
            removed: [...H, ...D.response.removed],
            errors: D.response.errors
        },
        newSdkState: {
            configs: j,
            clients: J,
            tools: M
        },
        newDynamicState: D.newState,
        sdkServersChanged: $.length > 0 || H.length > 0
    }
}
// @from(Ln 484413, Col 0)
async function KSq(A, q, K) {
    let Y = new Set(Object.keys(q.configs)),
        z = new Set(Object.keys(A)),
        _ = [...Y].filter((W) => !z.has(W)),
        w = [...z].filter((W) => !Y.has(W)),
        $ = [...Y].filter((W) => z.has(W)).filter((W) => {
            let Z = q.configs[W],
                G = A[W];
            if (!Z || !G) return !0;
            let f = Vs8(G);
            return !DGq(Z, f)
        }),
        H = [],
        j = [],
        J = {},
        M = [...q.clients],
        D = [...q.tools];
    for (let W of [..._, ...$]) {
        let Z = M.find((v) => v.name === W),
            G = q.configs[W];
        if (Z && G) {
            if (Z.type === "connected") try {
                await Z.cleanup()
            } catch (v) {
                _6(v)
            }
            await VN(W, G)
        }
        let f = `mcp__${W}__`;
        if (D = D.filter((v) => !v.name.startsWith(f)), M = M.filter((v) => v.name !== W), _.includes(W)) H.push(W)
    }
    for (let W of [...w, ...$]) {
        let Z = A[W];
        if (!Z) continue;
        let G = Vs8(Z);
        if (Z.type === "sdk") {
            j.push(W);
            continue
        }
        try {
            let f = await zh(W, G);
            if (M.push(f), f.type === "connected") {
                let v = await JE(f);
                D.push(...v)
            } else if (f.type === "failed") J[W] = f.error || "Connection failed";
            j.push(W)
        } catch (f) {
            let v = f instanceof Error ? f.message : String(f);
            J[W] = v, _6(f instanceof Error ? f : Error(v))
        }
    }
    let X = {};
    for (let W of z) {
        let Z = A[W];
        if (Z) X[W] = Vs8(Z)
    }
    let P = {
        clients: M,
        tools: D,
        configs: X
    };
    return K((W) => {
        let Z = new Set([...Object.keys(q.configs), ...Object.keys(X)]),
            G = W.mcp.tools.filter((v) => {
                for (let N of Z)
                    if (v.name.startsWith(`mcp__${N}__`)) return !1;
                return !0
            }),
            f = W.mcp.clients.filter((v) => {
                return !Z.has(v.name)
            });
        return {
            ...W,
            mcp: {
                ...W.mcp,
                tools: [...G, ...D],
                clients: [...f, ...M]
            }
        }
    }), {
        response: {
            added: j,
            removed: H,
            errors: J
        },
        newState: P
    }
}
// @from(Ln 484501, Col 4)
nhq
// @from(Ln 484501, Col 9)
xXz
// @from(Ln 484501, Col 14)
rhq
// @from(Ln 484501, Col 19)
ohq = `<system-reminder>
You are running in non-interactive mode and cannot return a response to the user until your team is shut down.

You MUST shut down your team before preparing your final response:
1. Use requestShutdown to ask each team member to shut down gracefully
2. Wait for shutdown approvals
3. Use the cleanup operation to clean up the team
4. Only then provide your final response to the user

The user cannot receive your response until the team is completely shut down.
</system-reminder>

Shut down your team and prepare your final response for the user.`
// @from(Ln 484514, Col 4)
ahq = 1e4
// @from(Ln 484515, Col 4)
PI1
// @from(Ln 484515, Col 9)
DI1
// @from(Ln 484516, Col 4)
zSq = E(() => {
    bRq();
    $G6();
    tC1();
    iRq();
    D$();
    nRq();
    IX();
    dd();
    sR1();
    V1();
    HA();
    H1();
    u_();
    J0();
    aH();
    k1();
    gi6();
    if6();
    xI();
    o36();
    Jhq();
    tP();
    fi6();
    LE1();
    Mhq();
    RE1();
    c_();
    Xhq();
    lA();
    dU8();
    lU8();
    AN();
    _86();
    Bj();
    K_();
    ca8();
    U$();
    pN6();
    _s8();
    y66();
    aB();
    vz();
    i8();
    Hm();
    bT8();
    FW();
    rJ();
    A16();
    fA();
    T1();
    BB();
    Zhq();
    Oq();
    xd();
    QP();
    WZ();
    W16();
    Vw1();
    kw1();
    hw();
    hD();
    sy();
    qM();
    cf6();
    WZ();
    KG6();
    jN6();
    JA();
    vz();
    ud();
    z4();
    wi6();
    wk();
    jm();
    Mf();
    ht();
    T1();
    E76();
    JN();
    io6();
    Lz();
    Ii6();
    g1();
    fC1();
    D$();
    A8();
    khq();
    eR1();
    zz();
    qH();
    vf();
    Bw();
    O0();
    Ug8();
    Vp6();
    HA();
    s8();
    nhq = (Xs8(), k4(xhq)), xXz = (Zs8(), k4(uhq)), rhq = (nt(), k4(XY4)), PI1 = new Set, DI1 = []
})
// @from(Ln 484617, Col 0)
function wSq(A) {
    let q = A6(3),
        {
            getFpsMetrics: K,
            children: Y
        } = A,
        z;
    if (q[0] !== Y || q[1] !== K) z = PV6.default.createElement(_Sq.Provider, {
        value: K
    }, Y), q[0] = Y, q[1] = K, q[2] = z;
    else z = q[2];
    return z
}
// @from(Ln 484631, Col 0)
function OSq() {
    return PV6.useContext(_Sq)
}
// @from(Ln 484634, Col 4)
PV6
// @from(Ln 484634, Col 9)
_Sq
// @from(Ln 484635, Col 4)
ks8 = E(() => {
    e6();
    PV6 = t(P6(), 1), _Sq = PV6.createContext(void 0)
})
// @from(Ln 484639, Col 4)
$Sq = {}
// @from(Ln 484644, Col 0)
function dXz(A) {
    let q = A6(9),
        {
            getFpsMetrics: K,
            stats: Y,
            initialState: z,
            children: _
        } = A,
        w;
    if (q[0] !== _ || q[1] !== z) w = WI1.default.createElement(Yj, {
        initialState: z,
        onChangeAppState: bi
    }, _), q[0] = _, q[1] = z, q[2] = w;
    else w = q[2];
    let O;
    if (q[3] !== Y || q[4] !== w) O = WI1.default.createElement(Bkq, {
        store: Y
    }, w), q[3] = Y, q[4] = w, q[5] = O;
    else O = q[5];
    let $;
    if (q[6] !== K || q[7] !== O) $ = WI1.default.createElement(wSq, {
        getFpsMetrics: K
    }, O), q[6] = K, q[7] = O, q[8] = $;
    else $ = q[8];
    return $
}
// @from(Ln 484670, Col 4)
WI1
// @from(Ln 484671, Col 4)
HSq = E(() => {
    e6();
    ks8();
    Da8();
    NA();
    do6();
    WI1 = t(P6(), 1)
})
// @from(Ln 484680, Col 0)
function jSq(A) {
    let q = A6(7),
        {
            onDone: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = WV6.default.createElement(m, {
        flexDirection: "column"
    }, WV6.default.createElement(T, null, "Learn more about how to monitor your spending:"), WV6.default.createElement(y7, {
        url: "https://code.claude.com/docs/en/costs"
    })), q[0] = Y;
    else Y = q[0];
    let z;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) z = [{
        value: "ok",
        label: "Got it, thanks!"
    }], q[1] = z;
    else z = q[1];
    let _;
    if (q[2] !== K) _ = WV6.default.createElement(T8, {
        options: z,
        onChange: K
    }), q[2] = K, q[3] = _;
    else _ = q[3];
    let w;
    if (q[4] !== K || q[5] !== _) w = WV6.default.createElement(m8, {
        title: "You've spent $5 on the Anthropic API this session.",
        onCancel: K
    }, Y, _), q[4] = K, q[5] = _, q[6] = w;
    else w = q[6];
    return w
}
// @from(Ln 484712, Col 4)
WV6
// @from(Ln 484713, Col 4)
JSq = E(() => {
    e6();
    i6();
    o9();
    i6();
    wq();
    WV6 = t(P6(), 1)
})
// @from(Ln 484725, Col 0)
function DSq() {
    if (_26++, _26 === 1) WSq(), rXz()
}
// @from(Ln 484729, Col 0)
function XSq() {
    if (_26 > 0) _26--;
    if (_26 === 0) PSq(), Es8()
}
// @from(Ln 484734, Col 0)
function nXz() {
    _26 = 0, PSq(), Es8()
}
// @from(Ln 484738, Col 0)
function rXz() {
    if (process.platform !== "darwin") return;
    if (ZV6 !== null) return;
    ZV6 = setInterval(() => {
        if (_26 > 0) k("Restarting caffeinate to maintain sleep prevention"), Es8(), WSq()
    }, iXz), ZV6.unref()
}
// @from(Ln 484746, Col 0)
function PSq() {
    if (ZV6 !== null) clearInterval(ZV6), ZV6 = null
}
// @from(Ln 484750, Col 0)
function WSq() {
    if (process.platform !== "darwin") return;
    if (_x !== null) return;
    if (!MSq) MSq = !0, E4(async () => {
        nXz()
    });
    try {
        _x = cXz("caffeinate", ["-i", "-t", String(lXz)], {
            stdio: "ignore"
        }), _x.unref(), _x.on("error", (A) => {
            k(`caffeinate spawn error: ${A.message}`), _x = null
        }), _x.on("exit", () => {
            _x = null
        }), k("Started caffeinate to prevent sleep")
    } catch {
        _x = null
    }
}
// @from(Ln 484769, Col 0)
function Es8() {
    if (_x !== null) {
        try {
            _x.kill(), k("Stopped caffeinate, allowing sleep")
        } catch {}
        _x = null
    }
}
// @from(Ln 484777, Col 4)
lXz = 300
// @from(Ln 484778, Col 4)
iXz = 240000
// @from(Ln 484779, Col 4)
_x = null
// @from(Ln 484780, Col 4)
ZV6 = null
// @from(Ln 484781, Col 4)
_26 = 0
// @from(Ln 484782, Col 4)
MSq = !1
// @from(Ln 484783, Col 4)
ZSq = E(() => {
    H1();
    KY()
})
// @from(Ln 484787, Col 0)
class ys8 {
    _status = "idle";
    _generation = 0;
    _listeners = new Set;
    reserve() {
        if (this._status !== "idle") return !1;
        return this._status = "dispatching", this._notify(), !0
    }
    cancelReservation() {
        if (this._status !== "dispatching") return;
        this._status = "idle", this._notify()
    }
    tryStart() {
        if (this._status === "running") return null;
        return this._status = "running", ++this._generation, this._notify(), this._generation
    }
    end(A) {
        if (this._generation !== A) return !1;
        if (this._status !== "running") return !1;
        return this._status = "idle", this._notify(), !0
    }
    forceEnd() {
        if (this._status === "idle") return;
        this._status = "idle", ++this._generation, this._notify()
    }
    get isActive() {
        return this._status !== "idle"
    }
    get generation() {
        return this._generation
    }
    subscribe = (A) => {
        return this._listeners.add(A), () => this._listeners.delete(A)
    };
    getSnapshot = () => {
        return this._status !== "idle"
    };
    _notify() {
        for (let A of this._listeners) A()
    }
}
// @from(Ln 484829, Col 0)
function GSq(A) {
    let q = A6(7),
        {
            name: K,
            color: Y
        } = A,
        z;
    if (q[0] !== Y) z = G0(Y), q[0] = Y, q[1] = z;
    else z = q[1];
    let _ = z,
        w;
    if (q[2] !== K) w = w26.createElement(T, {
        bold: !0
    }, "@", K), q[2] = K, q[3] = w;
    else w = q[3];
    let O;
    if (q[4] !== _ || q[5] !== w) O = w26.createElement(m, {
        flexDirection: "row",
        gap: 1
    }, w26.createElement(T, {
        color: _
    }, I3, " ", w)), q[4] = _, q[5] = w, q[6] = O;
    else O = q[6];
    return O
}
// @from(Ln 484854, Col 4)
w26
// @from(Ln 484855, Col 4)
fSq = E(() => {
    e6();
    i6();
    qw();
    kc();
    w26 = t(P6(), 1)
})
// @from(Ln 484863, Col 0)
function Ls8(A) {
    let q = A6(15),
        {
            toolName: K,
            description: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = l5(), q[0] = z;
    else z = q[0];
    let _ = z,
        w;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) w = i3(), q[1] = w;
    else w = q[1];
    let O = w,
        $;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) $ = H$(), q[2] = $;
    else $ = q[2];
    let H = $,
        j, J;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) j = t_.createElement(m, {
        marginBottom: 1
    }, t_.createElement(Wq, null), t_.createElement(T, {
        color: "warning",
        bold: !0
    }, " ", "Waiting for team lead approval")), J = O && H && t_.createElement(m, {
        marginBottom: 1
    }, t_.createElement(GSq, {
        name: O,
        color: H
    })), q[3] = j, q[4] = J;
    else j = q[3], J = q[4];
    let M;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) M = t_.createElement(T, {
        dimColor: !0
    }, "Tool: "), q[5] = M;
    else M = q[5];
    let D;
    if (q[6] !== K) D = t_.createElement(m, null, M, t_.createElement(T, null, K)), q[6] = K, q[7] = D;
    else D = q[7];
    let X;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) X = t_.createElement(T, {
        dimColor: !0
    }, "Action: "), q[8] = X;
    else X = q[8];
    let P;
    if (q[9] !== Y) P = t_.createElement(m, null, X, t_.createElement(T, null, Y)), q[9] = Y, q[10] = P;
    else P = q[10];
    let W;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) W = _ && t_.createElement(m, {
        marginTop: 1
    }, t_.createElement(T, {
        dimColor: !0
    }, "Permission request sent to team ", '"', _, '"', " leader")), q[11] = W;
    else W = q[11];
    let Z;
    if (q[12] !== D || q[13] !== P) Z = t_.createElement(m, {
        flexDirection: "column",
        borderStyle: "round",
        borderColor: "warning",
        paddingX: 1
    }, j, J, D, P, W), q[12] = D, q[13] = P, q[14] = Z;
    else Z = q[14];
    return Z
}
// @from(Ln 484927, Col 4)
t_
// @from(Ln 484928, Col 4)
TSq = E(() => {
    e6();
    i6();
    LO();
    fSq();
    zz();
    t_ = t(P6(), 1)
})
// @from(Ln 484937, Col 0)
function vSq(A, q = !1) {
    let K = M1((O) => O.teamContext),
        Y = O26.useRef(0),
        z = O26.useRef(void 0),
        _ = O26.useRef(void 0),
        w = O26.useRef(0);
    O26.useEffect(() => {
        if (q) return;
        let O = A[0]?.uuid,
            $ = Y.current,
            H = _.current === void 0,
            j = O !== void 0 && !H && O === _.current && $ <= A.length,
            J = j ? $ : 0;
        if (J === A.length) return;
        let M = J === 0 ? A : A.slice(J),
            D = j ? z.current : void 0,
            X = ++w.current;
        if (_F(M, E7() ? {
                teamName: K?.teamName,
                agentName: K?.selfAgentName
            } : {}, D).then((P) => {
                if (X !== w.current) return;
                if (P && !j) z.current = P
            }), j || H) {
            for (let P = M.length - 1; P >= 0; P--)
                if (MS1(M[P])) {
                    z.current = M[P].uuid;
                    break
                }
        }
        Y.current = A.length, _.current = O
    }, [A, q, K?.teamName, K?.selfAgentName])
}
// @from(Ln 484970, Col 4)
O26
// @from(Ln 484971, Col 4)
NSq = E(() => {
    Oq();
    NA();
    Qz();
    O26 = t(P6(), 1)
})
// @from(Ln 484978, Col 0)
function VSq(A) {
    if (!A || typeof A !== "object") return !1;
    return "behavior" in A && (A.behavior === "allow" || A.behavior === "deny")
}
// @from(Ln 484982, Col 4)
kSq = () => {}
// @from(Ln 484983, Col 4)
ySq = {}
// @from(Ln 485000, Col 0)
function _a6(A) {
    k(`[bridge:inbound-attach] ${A}`)
}
// @from(Ln 485004, Col 0)
function APz() {
    return sA()?.accessToken || void 0
}
// @from(Ln 485008, Col 0)
function qPz() {
    return P7().BASE_API_URL
}
// @from(Ln 485012, Col 0)
function zPz(A) {
    if (typeof A !== "object" || A === null || !("file_attachments" in A)) return [];
    let q = YPz().safeParse(A.file_attachments);
    return q.success ? q.data : []
}
// @from(Ln 485018, Col 0)
function _Pz(A) {
    return tXz(A).replace(/[^a-zA-Z0-9._-]/g, "_") || "attachment"
}
// @from(Ln 485022, Col 0)
function wPz() {
    return ESq(c8(), "uploads", R1())
}
// @from(Ln 485025, Col 0)
async function OPz(A) {
    let q = APz();
    if (!q) {
        _a6("skip: no oauth token");
        return
    }
    let K = `${qPz()}/api/oauth/files/${encodeURIComponent(A.file_uuid)}/content`,
        Y;
    try {
        let $ = await X8.get(K, {
            headers: {
                Authorization: `Bearer ${q}`
            },
            responseType: "arraybuffer",
            timeout: eXz,
            validateStatus: () => !0
        });
        if ($.status !== 200) {
            _a6(`fetch ${A.file_uuid} failed: status=${$.status}`);
            return
        }
        Y = Buffer.from($.data)
    } catch ($) {
        _a6(`fetch ${A.file_uuid} threw: ${$}`);
        return
    }
    let z = _Pz(A.file_name),
        _ = (A.file_uuid.slice(0, 8) || oXz().slice(0, 8)).replace(/[^a-zA-Z0-9_-]/g, "_"),
        w = wPz(),
        O = ESq(w, `${_}-${z}`);
    try {
        await aXz(w, {
            recursive: !0
        }), await sXz(O, Y)
    } catch ($) {
        _a6(`write ${O} failed: ${$}`);
        return
    }
    return _a6(`resolved ${A.file_uuid} → ${O} (${Y.length} bytes)`), O
}
// @from(Ln 485065, Col 0)
async function $Pz(A) {
    if (A.length === 0) return "";
    let K = (await Promise.all(A.map(OPz))).filter((Y) => Y !== void 0);
    if (K.length === 0) return "";
    return K.map((Y) => `@"${Y}"`).join(" ") + " "
}
// @from(Ln 485071, Col 4)
eXz = 30000
// @from(Ln 485072, Col 4)
KPz
// @from(Ln 485072, Col 9)
YPz
// @from(Ln 485073, Col 4)
LSq = E(() => {
    kK();
    K7();
    T1();
    F5();
    fA();
    H1();
    A8();
    KPz = F6(() => C.object({
        file_uuid: C.string(),
        file_name: C.string()
    })), YPz = F6(() => C.array(KPz()))
})
// @from(Ln 485087, Col 0)
function jPz(A, q) {
    if (!q) return A;
    if (typeof A === "string") return q + A;
    for (let K = A.length - 1; K >= 0; K--) {
        let Y = A[K];
        if (Y?.type === "text") return [...A.slice(0, K), {
            ...Y,
            text: q + Y.text
        }, ...A.slice(K + 1)]
    }
    return [...A, {
        type: "text",
        text: q.trimEnd()
    }]
}