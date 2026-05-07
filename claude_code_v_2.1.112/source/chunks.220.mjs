
// @from(Ln 568552, Col 0)
function CXA(q, K, _, z, Y, A, O, w, $, j, H, J, X) {
    let M = !1,
        P = X,
        W, D = !1,
        Z = !1,
        G = (a6) => a6.agentId === void 0,
        f = null,
        v, V = q.outbound;
    if (H.outputFormat === "stream-json" && H.sessionMirror) EH7((a6, D8) => {
        q.write({
            type: "transcript_mirror",
            filePath: a6,
            entries: D8
        })
    });
    let k = () => {
        if (j1("info", "shutdown_signal", {
                signal: "SIGINT"
            }), v && !v.signal.aborted) v.abort();
        WK(0)
    };
    process.on("SIGINT", k), eq(async () => {
        let a6 = {};
        for (let D8 of XI8(w()))
            if (yH(D8)) a6[D8.type] = (a6[D8.type] ?? 0) + 1;
        j1("info", "run_state_at_shutdown", {
            run_active: M,
            run_phase: W,
            worker_status: q.sessionState.getState(),
            internal_events_pending: q.internalEventsPending,
            bg_tasks: a6
        })
    }), q.sessionState.onPermissionModeChanged = (a6) => {
        if (a6 === "default" || a6 === "acceptEdits" || a6 === "bypassPermissions" || a6 === "plan" || a6 === "auto" || a6 === "dontAsk") V.enqueue({
            type: "system",
            subtype: "status",
            status: null,
            permissionMode: a6,
            uuid: gX(),
            session_id: I8()
        })
    };
    let N = {
            abortController: null,
            inflightPromise: null,
            lastEmitted: null,
            pendingSuggestion: null,
            pendingLastEmittedEntry: null
        },
        R;
    if (H.enableAuthStatus) R = wD.getInstance().subscribe((D8) => {
        V.enqueue({
            type: "auth_status",
            isAuthenticating: D8.isAuthenticating,
            output: D8.output,
            error: D8.error,
            uuid: gX(),
            session_id: I8()
        })
    });
    let h = (a6) => {
        let D8 = PnK(a6);
        if (D8) V.enqueue({
            type: "rate_limit_event",
            rate_limit_info: D8,
            uuid: gX(),
            session_id: I8()
        })
    };
    ZK6.add(h);
    let C = Y,
        x = nR6(Y, AA8(), oI),
        B = new Map,
        m = void 0,
        S = CR(oI),
        F = process.env.CLAUDE_CODE_RESUME_INTERRUPTED_TURN;
    if (J && J.kind !== "none" && F) E(`[print.ts] Auto-resuming interrupted turn (kind: ${J.kind})`), WX5(C, J.message), Dj({
        mode: "prompt",
        value: J.message.message.content,
        uuid: gX()
    });
    let g = q_6().map((a6) => {
            let D8 = a6.value === null ? "default" : a6.value,
                Q6 = D8 === "default" ? ZP() : K5(D8),
                W8 = QI(Q6),
                G8 = kh8(Q6),
                s6 = zX(a6.value),
                u6 = Dk6(Q6);
            return {
                value: D8,
                displayName: a6.label,
                description: a6.description,
                ...W8 && {
                    supportsEffort: !0,
                    supportedEffortLevels: UI.filter((h6) => {
                        if (h6 === "max" && !Ct6(Q6)) return !1;
                        if (h6 === "xhigh" && !bt6(Q6)) return !1;
                        return !0
                    })
                },
                ...G8 && {
                    supportsAdaptiveThinking: !0
                },
                ...s6 && {
                    supportsFastMode: !0
                },
                ...u6 && {
                    supportsAutoMode: !0
                }
            }
        }),
        c = H.userSpecifiedModel,
        n = H.thinkingConfig && H.thinkingConfig.type !== "disabled" ? H.thinkingConfig.display : void 0,
        l = H.thinkingConfig;

    function z6(a6, D8) {
        let Q6 = BCK(a6, hE(D8));
        C.push(...Q6);
        for (let W8 of Q6)
            if (typeof W8.message.content === "string" && W8.message.content.includes(`<${l0}>`)) V.enqueue({
                type: "user",
                message: W8.message,
                session_id: I8(),
                parent_tool_use_id: null,
                uuid: W8.uuid,
                timestamp: W8.timestamp,
                isReplay: !0
            })
    }
    let A6 = [],
        e = [],
        i = new Set;

    function O6(a6) {
        for (let D8 of a6) {
            if (D8.type !== "connected" || i.has(D8.name)) continue;
            if (D8.config.type === "sdk") continue;
            let Q6 = D8.name;
            try {
                D8.client.setRequestHandler($r, async (W8, G8) => {
                    i8(Q6, `Elicitation request received in print mode: ${I6(W8)}`);
                    let s6 = W8.params.mode === "url" ? "url" : "form";
                    d("tengu_mcp_elicitation_shown", {
                        mode: s6
                    });
                    let u6 = await Y98(Q6, W8.params, G8.signal);
                    if (u6) return i8(Q6, `Elicitation resolved by hook: ${I6(u6)}`), d("tengu_mcp_elicitation_response", {
                        mode: s6,
                        action: u6.action
                    }), u6;
                    let h6 = "url" in W8.params ? W8.params.url : void 0,
                        _8 = "requestedSchema" in W8.params ? W8.params.requestedSchema : void 0,
                        R8 = "elicitationId" in W8.params ? W8.params.elicitationId : void 0,
                        x6 = OX5(W8.params._meta),
                        i6 = await q.handleElicitation(Q6, W8.params.message, _8, G8.signal, s6, h6, R8, x6),
                        v8 = await A98(Q6, i6, G8.signal, s6, R8);
                    return d("tengu_mcp_elicitation_response", {
                        mode: s6,
                        action: v8.action
                    }), v8
                }), D8.client.setNotificationHandler(mg6, (W8) => {
                    let {
                        elicitationId: G8
                    } = W8.params;
                    i8(Q6, `Elicitation completion notification: ${G8}`), lx({
                        message: `MCP server "${Q6}" confirmed elicitation ${G8} complete`,
                        notificationType: "elicitation_complete"
                    }), V.enqueue({
                        type: "system",
                        subtype: "elicitation_complete",
                        mcp_server_name: Q6,
                        elicitation_id: G8,
                        uuid: gX(),
                        session_id: I8()
                    })
                }), i.add(Q6)
            } catch {}
        }
    }
    async function J6() {
        let a6 = new Set(Object.keys(O)),
            D8 = new Set(A6.map((h6) => h6.name)),
            Q6 = Array.from(a6).some((h6) => !D8.has(h6)),
            W8 = Array.from(D8).some((h6) => !a6.has(h6)),
            G8 = A6.some((h6) => h6.type === "pending"),
            s6 = A6.some((h6) => h6.type === "failed");
        if (Q6 || W8 || G8 || s6) {
            for (let R8 of A6)
                if (!a6.has(R8.name)) {
                    if (R8.type === "connected") await R8.cleanup()
                } let h6 = await ERK(O, (R8, x6) => q.sendMcpMessage(R8, x6));
            A6 = h6.clients, e = h6.tools;
            let _8 = F4([...D8, ...a6]);
            $((R8) => ({
                ...R8,
                mcp: {
                    ...R8.mcp,
                    tools: [...R8.mcp.tools.filter((x6) => !_8.some((i6) => x6.name.startsWith(Zh(i6)))), ...e]
                }
            })), gP4(A6)
        }
    }
    J6();
    let $6 = {
            clients: [],
            tools: [],
            configs: {},
            policyRules: new Set
        },
        H6 = (a6) => {
            let D8 = cl(a6.toolPermissionContext, a6.mcp.tools),
                Q6 = j2(Du6([...z, ...e, ...$6.tools], D8, a6.toolPermissionContext.mode), "name");
            if (H.permissionPromptToolName) Q6 = Q6.filter((G8) => !e3(G8, H.permissionPromptToolName));
            let W8 = rO8();
            if (W8 && !H.jsonSchema) {
                let G8 = OR8(W8);
                if ("tool" in G8) Q6 = [...Q6, G8.tool]
            }
            return Q6
        },
        q6 = S6(process.env.CLAUDE_CODE_REMOTE) ? process.env.CLAUDE_CODE_SYSTEM_PROMPT_GB_FEATURE : void 0,
        o = () => {
            if (!q6) return H.systemPrompt;
            let a6 = u8(q6, "");
            return typeof a6 === "string" && a6.length > 0 ? a6 : H.systemPrompt
        },
        _6 = null,
        r = 0;

    function t() {
        if (!_6) return;
        let a6 = Math.min(r, C.length),
            D8 = C.slice(a6).filter((Q6) => Q6.type === "user" || Q6.type === "assistant");
        if (r = C.length, D8.length > 0) _6.writeMessages(D8)
    }
    let Y6 = Promise.resolve({
        response: {
            added: [],
            removed: [],
            errors: {}
        },
        sdkServersChanged: !1
    });

    function X6(a6) {
        let D8 = async () => {
            let Q6 = new Set(A6.map((G8) => G8.name)),
                W8 = await fX5(a6, {
                    configs: O,
                    clients: A6,
                    tools: e
                }, $6, $);
            for (let G8 of Object.keys(O)) delete O[G8];
            if (Object.assign(O, W8.newSdkState.configs), A6 = W8.newSdkState.clients, e = W8.newSdkState.tools, $6 = W8.newDynamicState, W8.sdkServersChanged) {
                let G8 = new Set(A6.map((u6) => u6.name)),
                    s6 = F4([...Q6, ...G8]);
                $((u6) => ({
                    ...u6,
                    mcp: {
                        ...u6.mcp,
                        tools: [...u6.mcp.tools.filter((h6) => !s6.some((_8) => h6.name.startsWith(Zh(_8)))), ...e]
                    }
                }))
            }
            return {
                response: W8.response,
                sdkServersChanged: W8.sdkServersChanged
            }
        };
        return Y6 = Y6.then(D8, D8), Y6
    }

    function M6() {
        let a6 = w(),
            D8 = a6.mcp.clients,
            Q6 = j2([...a6.mcp.tools, ...$6.tools], "name"),
            W8 = new Set([...D8.map((G8) => G8.name), ...A6.map((G8) => G8.name)]);
        return [...D8, ...A6, ...$6.clients.filter((G8) => !W8.has(G8.name))].map((G8) => {
            let s6;
            if (G8.config.type === "sse" || G8.config.type === "http") s6 = {
                type: G8.config.type,
                url: G8.config.url,
                headers: G8.config.headers,
                oauth: G8.config.oauth
            };
            else if (G8.config.type === "claudeai-proxy") s6 = {
                type: "claudeai-proxy",
                url: G8.config.url,
                id: G8.config.id
            };
            else if (G8.config.type === "stdio" || G8.config.type === void 0) s6 = {
                type: "stdio",
                command: G8.config.command,
                args: G8.config.args
            };
            let u6 = G8.type === "connected" ? Ll(Q6, G8.name).map((_8) => ({
                    name: _8.mcpInfo?.toolName ?? _8.name,
                    annotations: {
                        readOnly: _8.isReadOnly({}) || void 0,
                        destructive: _8.isDestructive?.({}) || void 0,
                        openWorld: _8.isOpenWorld?.({}) || void 0
                    }
                })) : void 0,
                h6;
            if (G8.type === "connected" && G8.capabilities.experimental) {
                let _8 = {
                    ...G8.capabilities.experimental
                };
                if (_8["claude/channel"] && (!mP6() || !oO7(G8.config.pluginSource))) delete _8["claude/channel"];
                if (Object.keys(_8).length > 0) h6 = {
                    experimental: _8
                }
            }
            return {
                name: G8.name,
                status: G8.type,
                serverInfo: G8.type === "connected" ? G8.serverInfo : void 0,
                error: G8.type === "failed" ? G8.error : void 0,
                config: s6,
                scope: G8.config.scope,
                tools: u6,
                capabilities: h6
            }
        })
    }
    async function W6(a6) {
        try {
            await Promise.all([Promise.resolve(), Rf6("headless_managed_settings_wait", () => Qu8())])
        } catch (Q6) {
            j6(Q6)
        }
        let D8 = !1;
        try {
            if (D8 = await eJ5(a6), D8) await y6()
        } catch (Q6) {
            j6(Q6)
        }
        return D8
    }
    let V6 = null,
        f6 = null,
        G6;
    if (!S9())
        if (S6(process.env.CLAUDE_CODE_SYNC_PLUGIN_INSTALL)) G6 = H.outputFormat === "stream-json" ? (a6) => void q.write({
            type: "system",
            subtype: "plugin_install",
            status: a6.status,
            name: "name" in a6 ? a6.name : void 0,
            error: "error" in a6 ? a6.error : void 0,
            uuid: gX(),
            session_id: I8()
        }) : void 0, G6?.({
            status: "started"
        }), V6 = W6((a6) => G6?.(a6));
        else f6 = $X5(W6);
    let k6 = nJ5(() => !M),
        T6 = _,
        v6 = j;
    async function L6() {
        let {
            agentDefinitions: a6
        } = await PW6($);
        T6 = yu6(await eD(AA8()));
        let D8 = v6.filter((Q6) => Q6.source === "flagSettings");
        v6 = [...a6.allAgents, ...D8]
    }
    async function y6() {
        let {
            servers: a6
        } = await Ct(), D8 = {};
        for (let [G8, s6] of Object.entries(a6)) {
            let u6 = s6.type;
            if (u6 === void 0 || u6 === "stdio" || u6 === "sse" || u6 === "http" || u6 === "sdk") D8[G8] = s6
        }
        for (let [G8, s6] of Object.entries(O))
            if (s6.type === "sdk" && !(G8 in D8)) D8[G8] = s6;
        let {
            response: Q6,
            sdkServersChanged: W8
        } = await X6(D8);
        if (W8) J6();
        E(`Headless MCP refresh: added=${Q6.added.length}, removed=${Q6.removed.length}`)
    }
    let c6 = Em6.subscribe(() => {
        On(), eD(AA8()).then((a6) => {
            T6 = yu6(a6)
        })
    });
    yj6(() => {
        if (v && AR8("now").length > 0) v.abort("interrupt")
    });
    let Z8 = async () => {
        if (M) return;
        M = !0, W = void 0, q.sessionState.notifyStateChanged("running"), k6.stop(), GM("run_entry");
        try {
            if (await J6(), GM("after_updateSdkMcp"), V6) {
                let D8 = parseInt(process.env.CLAUDE_CODE_SYNC_PLUGIN_INSTALL_TIMEOUT_MS || "", 10);
                if (D8 > 0) {
                    let W8 = l7(D8).then(() => "timeout");
                    if (await Promise.race([V6, W8]) === "timeout") j6(Error(`CLAUDE_CODE_SYNC_PLUGIN_INSTALL: plugin installation timed out after ${D8}ms`)), d("tengu_sync_plugin_install_timeout", {
                        timeout_ms: D8
                    })
                } else await V6;
                V6 = null;
                try {
                    await L6()
                } catch (W8) {
                    j6(W8)
                }
                let {
                    setupPluginHookHotReload: Q6
                } = await Promise.resolve().then(() => (HJ6(), di1));
                Q6()
            }
        } finally {
            G6?.({
                status: "completed"
            }), G6 = void 0
        }
        if (S6(process.env.CLAUDE_CODE_ENABLE_BACKGROUND_PLUGIN_REFRESH) && f6?.needsRefresh) {
            f6.needsRefresh = !1;
            try {
                await L6()
            } catch (D8) {
                j6(D8)
            }
        }
        try {
            let D8, Q6 = !1,
                W8 = !0,
                G8 = async () => {
                    while (D8 = Ke6(G)) {
                        if (D8.mode !== "prompt" && D8.mode !== "orphaned-permission" && D8.mode !== "task-notification") throw Error("only prompt commands are supported in streaming mode");
                        let s6 = [D8];
                        if (D8.mode === "prompt") {
                            while (HX5(D8, Lj6(G))) s6.push(Ke6(G));
                            if (s6.length > 1) D8 = {
                                ...D8,
                                value: jX5(s6.map((g8) => g8.value)),
                                uuid: s6.findLast((g8) => g8.uuid)?.uuid ?? D8.uuid,
                                fileAttachments: s6.flatMap((g8) => g8.fileAttachments ?? [])
                            }
                        }
                        let u6 = s6.map((g8) => g8.uuid).filter((g8) => g8 !== void 0);
                        if (H.replayUserMessages && s6.length > 1) {
                            for (let g8 of s6)
                                if (g8.uuid && g8.uuid !== D8.uuid) V.enqueue({
                                    type: "user",
                                    message: {
                                        role: "user",
                                        content: g8.value
                                    },
                                    session_id: I8(),
                                    parent_tool_use_id: null,
                                    uuid: g8.uuid,
                                    isReplay: !0,
                                    ...g8.fileAttachments?.length && {
                                        file_attachments: g8.fileAttachments
                                    },
                                    ...g8.origin && {
                                        origin: g8.origin
                                    }
                                })
                        }
                        if (W8) W8 = !1, await JX5(w);
                        let h6 = w(),
                            _8 = [...h6.mcp.clients, ...A6, ...$6.clients];
                        O6(_8);
                        for (let g8 of _8) P07(g8);
                        let R8 = H6(h6);
                        for (let g8 of u6) q.onCommandLifecycle?.(g8, "started");
                        if (D8.mode === "task-notification") {
                            let g8 = typeof D8.value === "string" ? D8.value : "",
                                w6 = g8.match(/<task-id>([^<]+)<\/task-id>/),
                                D6 = g8.match(/<tool-use-id>([^<]+)<\/tool-use-id>/),
                                U6 = g8.match(/<output-file>([^<]+)<\/output-file>/),
                                F6 = g8.match(/<status>([^<]+)<\/status>/),
                                z8 = g8.match(/<summary>([^<]+)<\/summary>/),
                                l6 = (uq) => uq === "completed" || uq === "failed" || uq === "stopped" || uq === "killed",
                                j8 = F6?.[1],
                                f8 = l6(j8) ? j8 === "killed" ? "stopped" : j8 : "completed",
                                o8 = g8.match(/<usage>([\s\S]*?)<\/usage>/)?.[1] ?? "",
                                n1 = o8.match(/<total_tokens>(\d+)<\/total_tokens>/),
                                c1 = o8.match(/<tool_uses>(\d+)<\/tool_uses>/),
                                dq = o8.match(/<duration_ms>(\d+)<\/duration_ms>/);
                            if (F6) V.enqueue({
                                type: "system",
                                subtype: "task_notification",
                                task_id: w6?.[1] ?? "",
                                tool_use_id: D6?.[1],
                                status: f8,
                                output_file: U6?.[1] ?? "",
                                summary: z8?.[1] ?? "",
                                usage: n1 && c1 ? {
                                    total_tokens: parseInt(n1[1], 10),
                                    tool_uses: parseInt(c1[1], 10),
                                    duration_ms: dq ? parseInt(dq[1], 10) : 0
                                } : void 0,
                                session_id: I8(),
                                uuid: gX()
                            })
                        }
                        let x6 = D8.value;
                        if (q instanceof $e8 && D8.mode === "prompt") d("tengu_bridge_message_received", {
                            is_repl: !1
                        });
                        if (D8.shouldQuery !== !1) {
                            if (N.abortController?.abort(), N.abortController = null, N.pendingSuggestion = null, N.pendingLastEmittedEntry = null, N.lastEmitted && D8.mode === "prompt") {
                                let g8 = typeof x6 === "string" ? x6 : x6.find((w6) => w6.type === "text")?.text;
                                if (typeof g8 === "string") hc4(N.lastEmitted.text, g8, N.lastEmitted.emittedAt, N.lastEmitted.promptId, N.lastEmitted.generationRequestId);
                                N.lastEmitted = null
                            }
                        }
                        v = F5();
                        let i6 = void 0;
                        GM("before_ask"), J38();
                        let v8 = D8;
                        if (v8.uuid !== void 0 && aP4(v8.uuid)) {
                            q.onCommandLifecycle?.(v8.uuid, "completed");
                            continue
                        }
                        let f1 = typeof x6 === "string" ? x6 : s5(x6, `
`);
                        await gV8(v8.workload ?? H.workload, () => jx8(f1, async () => {
                            let g8 = !1,
                                w6 = !1,
                                D6 = 0,
                                U6 = VW();
                            try {
                                for await (let F6 of dJ5({
                                    commands: j2([...T6, ...h6.mcp.commands], "name"),
                                    prompt: x6,
                                    promptUuid: v8.uuid,
                                    isMeta: v8.isMeta,
                                    shouldQuery: v8.shouldQuery,
                                    stopHookActive: v8.stopHookActive,
                                    fileAttachments: v8.fileAttachments,
                                    origin: v8.origin ?? (v8.mode === "task-notification" ? {
                                        kind: "task-notification"
                                    } : void 0),
                                    cwd: AA8(),
                                    tools: R8,
                                    refreshTools: () => H6(w()),
                                    verbose: H.verbose,
                                    mcpClients: _8,
                                    thinkingConfig: l,
                                    maxTurns: H.maxTurns,
                                    maxBudgetUsd: H.maxBudgetUsd,
                                    taskBudget: H.taskBudget,
                                    canUseTool: A,
                                    userSpecifiedModel: c,
                                    fallbackModel: H.fallbackModel,
                                    jsonSchema: rO8() ?? H.jsonSchema,
                                    mutableMessages: C,
                                    sessionEnvVars: B,
                                    tmuxSocket: m,
                                    getReadFileCache: () => S.size === 0 ? x : oy6(x, S),
                                    setReadFileCache: (z8) => {
                                        x = z8;
                                        for (let [l6, j8] of S.entries()) {
                                            let f8 = x.get(l6);
                                            if (!f8 || j8.timestamp > f8.timestamp) x.set(l6, j8)
                                        }
                                        S.clear()
                                    },
                                    customSystemPrompt: o(),
                                    appendSystemPrompt: H.appendSystemPrompt,
                                    appendSubagentSystemPrompt: H.appendSubagentSystemPrompt,
                                    excludeDynamicSections: H.excludeDynamicSections,
                                    getAppState: w,
                                    setAppState: $,
                                    abortController: v,
                                    replayUserMessages: H.replayUserMessages,
                                    includePartialMessages: H.includePartialMessages,
                                    onCommandLifecycle: q.onCommandLifecycle,
                                    sessionState: q.sessionState,
                                    handleElicitation: (z8, l6, j8) => q.handleElicitation(z8, l6.message, void 0, j8, l6.mode, l6.url, "elicitationId" in l6 ? l6.elicitationId : void 0, OX5(l6._meta)),
                                    agents: v6,
                                    orphanedPermission: v8.orphanedPermission,
                                    deferredToolUse: P,
                                    setSDKStatus: (z8, l6) => {
                                        V.enqueue({
                                            type: "system",
                                            subtype: "status",
                                            status: z8,
                                            ...l6?.compactResult !== void 0 && {
                                                compact_result: l6.compactResult
                                            },
                                            ...l6?.compactError !== void 0 && {
                                                compact_error: l6.compactError
                                            },
                                            session_id: I8(),
                                            uuid: gX()
                                        })
                                    }
                                })) {
                                    if (P = void 0, t(), F6.type === "system") {
                                        if (F6.subtype === "api_retry") g8 = !0, D6 = Math.max(D6, F6.error_status ?? 0);
                                        if (F6.subtype === "compact_boundary") w6 = !0
                                    }
                                    if (F6.type === "result") {
                                        d("tengu_sdk_result", {
                                            subtype: F6.subtype,
                                            is_error: F6.is_error,
                                            num_turns: F6.num_turns,
                                            duration_ms: F6.duration_ms,
                                            duration_api_ms: VW() - U6,
                                            saw_retry: g8,
                                            saw_compact: w6,
                                            retry_status: g8 ? D6 : void 0,
                                            api_error_status: F6.subtype === "success" ? F6.api_error_status ?? void 0 : void 0
                                        });
                                        for (let l6 of ze6()) V.enqueue(l6);
                                        let z8 = w();
                                        if (v8.shouldQuery === !1) {
                                            if (H.sessionMirror) await mT();
                                            V.enqueue(F6)
                                        } else if (XI8(z8).some((l6) => (l6.type === "local_agent" || l6.type === "local_workflow") && yH(l6))) f = F6;
                                        else {
                                            if (f = null, H.sessionMirror) await mT();
                                            V.enqueue(F6)
                                        }
                                    } else {
                                        for (let z8 of ze6()) V.enqueue(z8);
                                        V.enqueue(F6)
                                    }
                                }
                            } finally {
                                Uc()
                            }
                        }));
                        for (let g8 of u6) q.onCommandLifecycle?.(g8, "completed");
                        if (t(), _6?.sendResult(), H.promptSuggestions && v8.shouldQuery !== !1 && !c5(process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION)) {
                            N.abortController?.abort();
                            let w6 = new AbortController;
                            N.abortController = w6;
                            let D6 = XJ6();
                            if (!D6) af("sdk_no_params", void 0, void 0, "sdk");
                            else {
                                let U6 = {
                                    promise: null
                                };
                                U6.promise = (async () => {
                                    try {
                                        let F6 = await ka1(w6, C, w, D6, "sdk");
                                        if (!F6 || w6.signal.aborted) return;
                                        let z8 = {
                                                type: "prompt_suggestion",
                                                suggestion: F6.suggestion,
                                                uuid: gX(),
                                                session_id: I8()
                                            },
                                            l6 = {
                                                text: F6.suggestion,
                                                emittedAt: Date.now(),
                                                promptId: F6.promptId,
                                                generationRequestId: F6.generationRequestId
                                            };
                                        if (f) N.pendingSuggestion = z8, N.pendingLastEmittedEntry = {
                                            text: l6.text,
                                            promptId: l6.promptId,
                                            generationRequestId: l6.generationRequestId
                                        };
                                        else N.lastEmitted = l6, V.enqueue(z8)
                                    } catch (F6) {
                                        if (F6 instanceof Error && (F6.name === "AbortError" || F6.name === "APIUserAbortError")) {
                                            af("aborted", void 0, void 0, "sdk");
                                            return
                                        }
                                        j6(r1(F6))
                                    } finally {
                                        if (N.inflightPromise === U6.promise) N.inflightPromise = null
                                    }
                                })(), N.inflightPromise = U6.promise
                            }
                        }
                        rr1(), ad8(), ir1()
                    }
                };
            do {
                for (let s6 of ze6()) V.enqueue(s6);
                W = "draining_commands", await G8(), Q6 = !1;
                {
                    let s6 = w(),
                        u6 = XI8(s6).some((_8) => yH(_8) && _8.type !== "in_process_teammate"),
                        h6 = Lj6(G) !== void 0;
                    if (u6 || h6) {
                        if (Q6 = !0, !h6) W = "waiting_for_agents", await l7(100)
                    }
                }
            } while (Q6);
            if (f) {
                if (H.sessionMirror) await mT();
                if (V.enqueue(f), f = null, N.pendingSuggestion) {
                    if (V.enqueue(N.pendingSuggestion), N.pendingLastEmittedEntry) N.lastEmitted = {
                        ...N.pendingLastEmittedEntry,
                        emittedAt: Date.now()
                    }, N.pendingLastEmittedEntry = null;
                    N.pendingSuggestion = null
                }
            }
        } catch (D8) {
            d("tengu_sdk_session_crash", BXA(D8)), d("tengu_sdk_result", {
                subtype: "error_during_execution",
                is_error: !0,
                num_turns: 0,
                duration_ms: 0,
                duration_api_ms: 0,
                saw_retry: !1,
                saw_compact: !1
            });
            try {
                if (H.sessionMirror) await mT();
                await q.write({
                    type: "result",
                    subtype: "error_during_execution",
                    duration_ms: 0,
                    duration_api_ms: 0,
                    is_error: !0,
                    num_turns: 0,
                    stop_reason: null,
                    session_id: I8(),
                    total_cost_usd: 0,
                    usage: iP,
                    modelUsage: {},
                    permission_denials: [],
                    uuid: gX(),
                    errors: [b6(D8), ...NA6().map((Q6) => Q6.error)]
                })
            } catch {}
            N.abortController?.abort(), j5(1);
            return
        } finally {
            if (W = "finally_flush", await q.flushInternalEvents(), W = "finally_post_flush", !rs()) await Promise.race([q.flushDeliveryAcks(), l7(5000, void 0, {
                unref: !0
            })]);
            if (!rs()) {
                q.sessionState.notifyStateChanged("idle");
                for (let D8 of ze6()) V.enqueue(D8)
            }
            M = !1, k6.start()
        }
        if (Lj6(G) !== void 0) {
            Z8();
            return
        } {
            let Q6 = w().teamContext;
            if (Q6 && Sv(Q6))
                while (!0) {
                    let s6 = w();
                    if (!(iZ8(s6) || s6.teamContext && Object.keys(s6.teamContext.teammates).length > 0)) {
                        E("[print.ts] No more active teammates, stopping poll");
                        break
                    }
                    let h6 = await qJ6("team-lead", s6.teamContext?.teamName);
                    if (h6.length > 0) {
                        E(`[print.ts] Team-lead found ${h6.length} unread messages`), await A18("team-lead", s6.teamContext?.teamName);
                        let _8 = s6.teamContext?.teamName;
                        for (let x6 of h6) {
                            let i6 = Qk(x6.text);
                            if (i6 && _8) {
                                let v8 = i6.from;
                                E(`[print.ts] Processing shutdown_approved from ${v8}`);
                                let f1 = s6.teamContext?.teammates ? Object.entries(s6.teamContext.teammates).find(([, g8]) => g8.name === v8)?.[0] : void 0;
                                if (f1) nM6(_8, {
                                    agentId: f1,
                                    name: v8
                                }), E(`[print.ts] Removed ${v8} from team file`), await p56(_8, f1, v8, "shutdown"), $((g8) => {
                                    if (!g8.teamContext?.teammates) return g8;
                                    if (!(f1 in g8.teamContext.teammates)) return g8;
                                    let {
                                        [f1]: w6, ...D6
                                    } = g8.teamContext.teammates;
                                    return {
                                        ...g8,
                                        teamContext: {
                                            ...g8.teamContext,
                                            teammates: D6
                                        }
                                    }
                                })
                            }
                        }
                        let R8 = h6.map((x6) => `<${oX} teammate_id="${x6.from}"${x6.color?` color="${x6.color}"`:""}>
${x6.text}
</${oX}>`).join(`

`);
                        Dj({
                            mode: "prompt",
                            value: R8,
                            uuid: gX()
                        }), Z8();
                        return
                    }
                    if (D && !Z) {
                        Z = !0, E("[print.ts] Input closed with active teammates, injecting shutdown prompt"), Dj({
                            mode: "prompt",
                            value: YX5,
                            uuid: gX()
                        }), Z8();
                        return
                    }
                    await l7(500)
                }
        }
        if (D)
            if (await (async () => {
                    let Q6 = w();
                    if (AT1(Q6)) await OT1($, Q6);
                    let W8 = w(),
                        G8 = W8.teamContext;
                    return G8 && Object.keys(G8.teammates).length > 0 || iZ8(W8)
                })()) Dj({
                mode: "prompt",
                value: YX5,
                uuid: gX()
            }), Z8();
            else {
                if (N.inflightPromise) {
                    let Q6 = setTimeout((W8) => W8?.abort(), 30000, N.abortController);
                    try {
                        await N.inflightPromise
                    } finally {
                        clearTimeout(Q6)
                    }
                }
                N.abortController?.abort(), N.abortController = null, await Oi1(), c6(), R?.(), ZK6.delete(h), await tz7([...w().mcp.clients, ...A6, ...$6.clients]), V.done()
            }
    };
    if (yj6(() => {
            if (!M && !D && Lj6(G) !== void 0) Z8()
        }), X) E(`[print.ts] Auto-resuming deferred tool: ${X.toolName} (${X.toolUseID})`), Dj({
        mode: "prompt",
        value: "Continue from where you left off.",
        uuid: gX(),
        isMeta: !0
    }), Z8();
    let N8 = null;
    if (_X5 && zX5?.isKairosCronEnabled()) N8 = _X5.createCronScheduler({
        onFire: (a6) => {
            if (D) return;
            let D8 = NXA.resolveLoopDefaultFire(a6);
            Dj({
                mode: "prompt",
                value: D8,
                uuid: gX(),
                priority: "later",
                isMeta: !0,
                workload: pV8
            }), Z8()
        },
        isLoading: () => M || D,
        getJitterConfig: kXA?.getCronJitterConfig,
        isKilled: () => !zX5?.isKairosCronEnabled()
    }), N8.start();
    let R6 = function(a6, D8) {
            V.enqueue({
                type: "control_response",
                response: {
                    subtype: "success",
                    request_id: a6.request_id,
                    response: D8
                }
            })
        },
        p6 = function(a6, D8) {
            V.enqueue({
                type: "control_response",
                response: {
                    subtype: "error",
                    request_id: a6.request_id,
                    error: D8
                }
            })
        },
        q8 = new Set;
    q.setUnexpectedResponseCallback(async (a6) => {
        await ZX5({
            message: a6,
            setAppState: $,
            handledToolUseIds: q8,
            onEnqueued: () => {
                Z8()
            }
        })
    });
    let L8 = new Set,
        w8 = new Map,
        x8 = null;
    return (async () => {
        let a6 = !1,
            D8 = Y.length > 0 || ZQK();
        j1("info", "cli_message_loop_started");
        for await (let Q6 of q.structuredInput) {
            let W8 = "uuid" in Q6 ? Q6.uuid : void 0;
            if (W8 && Q6.type !== "user" && Q6.type !== "control_response") q.onCommandLifecycle?.(W8, "completed");
            if (Q6.type === "control_request") {
                if (Q6.request.subtype === "interrupt") {
                    if (v) v.abort();
                    N.abortController?.abort(), N.abortController = null, N.lastEmitted = null, N.pendingSuggestion = null, R6(Q6)
                } else if (Q6.request.subtype === "end_session") {
                    if (E(`[print.ts] end_session received, reason=${Q6.request.reason??"unspecified"}`), v) v.abort();
                    N.abortController?.abort(), N.abortController = null, N.lastEmitted = null, N.pendingSuggestion = null, R6(Q6);
                    break
                } else if (Q6.request.subtype === "initialize") {
                    if (Q6.request.sdkMcpServers && Q6.request.sdkMcpServers.length > 0)
                        for (let s6 of Q6.request.sdkMcpServers) O[s6] = {
                            type: "sdk",
                            name: s6
                        };
                    if (await IXA(Q6.request, Q6.request_id, a6, V, _, g, q, !!H.enableAuthStatus, H, j, w), Q6.request.promptSuggestions) $((s6) => {
                        if (s6.promptSuggestionEnabled) return s6;
                        return {
                            ...s6,
                            promptSuggestionEnabled: !0
                        }
                    });
                    if (Q6.request.agentProgressSummaries && u8("tengu_slate_prism", !0)) j81(!0);
                    if (a6 = !0, qe6()) Z8()
                } else if (Q6.request.subtype === "set_permission_mode") {
                    let s6 = Q6.request;
                    $((u6) => ({
                        ...u6,
                        toolPermissionContext: xXA(s6, Q6.request_id, u6.toolPermissionContext, V),
                        isUltraplanMode: s6.ultraplan ?? u6.isUltraplanMode
                    }))
                } else if (Q6.request.subtype === "set_model") {
                    let s6 = Q6.request.model ?? "default",
                        u6 = s6 === "default" ? ZP() : s6;
                    c = u6, kW(u6), q.sessionState.notifyMetadataChanged({
                        model: u6
                    }), z6(s6, u6), R6(Q6)
                } else if (Q6.request.subtype === "set_max_thinking_tokens") l = wX5(Q6.request.max_thinking_tokens, n), R6(Q6);
                else if (Q6.request.subtype === "mcp_status") R6(Q6, {
                    mcpServers: M6()
                });
                else if (Q6.request.subtype === "get_context_usage") try {
                    let s6 = w(),
                        u6 = await ji8({
                            messages: C,
                            getAppState: w,
                            options: {
                                mainLoopModel: G5(),
                                tools: H6(s6),
                                agentDefinitions: {
                                    activeAgents: zT(v6),
                                    allAgents: v6
                                },
                                customSystemPrompt: o(),
                                appendSystemPrompt: H.appendSystemPrompt,
                                excludeDynamicSections: H.excludeDynamicSections
                            }
                        });
                    R6(Q6, {
                        ...u6
                    })
                } catch (s6) {
                    p6(Q6, b6(s6))
                } else if (Q6.request.subtype === "mcp_message") {
                    let s6 = Q6.request,
                        u6 = A6.find((h6) => h6.name === s6.server_name);
                    if (u6 && u6.type === "connected" && u6.client?.transport?.onmessage) u6.client.transport.onmessage(s6.message);
                    R6(Q6)
                } else if (Q6.request.subtype === "rewind_files") {
                    let s6 = w(),
                        u6 = await PX5(Q6.request.user_message_id, s6, Q6.request.dry_run ?? !1);
                    if (u6.canRewind || Q6.request.dry_run) R6(Q6, u6);
                    else p6(Q6, u6.error ?? "Unexpected error")
                } else if (Q6.request.subtype === "cancel_async_message") {
                    let s6 = Q6.request.message_uuid,
                        u6 = Ty6((h6) => h6.uuid === s6);
                    if (u6.length === 0) oP4(s6);
                    R6(Q6, {
                        cancelled: u6.length > 0
                    })
                } else if (Q6.request.subtype === "seed_read_state") {
                    try {
                        let s6 = Wq(Q6.request.path),
                            u6 = Math.floor((await VXA(s6)).mtimeMs);
                        if (u6 <= Q6.request.mtime) {
                            let h6 = await TXA(s6, "utf-8"),
                                _8 = (h6.charCodeAt(0) === 65279 ? h6.slice(1) : h6).replaceAll(`\r
`, `
`);
                            S.set(s6, {
                                content: _8,
                                timestamp: u6,
                                offset: void 0,
                                limit: void 0
                            })
                        }
                    } catch {}
                    R6(Q6)
                } else if (Q6.request.subtype === "mcp_set_servers") {
                    let {
                        response: s6,
                        sdkServersChanged: u6
                    } = await X6(Q6.request.servers);
                    if (R6(Q6, s6), u6) J6()
                } else if (Q6.request.subtype === "reload_plugins") try {
                    let s6 = await PW6($),
                        u6 = v6.filter((i6) => i6.source === "flagSettings");
                    v6 = [...s6.agentDefinitions.allAgents, ...u6];
                    let h6 = [],
                        [_8, R8, x6] = await Promise.allSettled([eD(AA8()), y6(), Gj()]);
                    if (_8.status === "fulfilled") T6 = yu6(_8.value);
                    else j6(_8.reason);
                    if (R8.status === "rejected") j6(R8.reason);
                    if (x6.status === "fulfilled") h6 = x6.value.enabled.map((i6) => ({
                        name: i6.name,
                        path: i6.path,
                        source: i6.source
                    }));
                    else j6(x6.reason);
                    R6(Q6, {
                        commands: T6.filter((i6) => i6.userInvocable !== !1).map((i6) => ({
                            name: y_(i6),
                            description: IP6(i6),
                            argumentHint: i6.argumentHint || ""
                        })),
                        agents: v6.map((i6) => ({
                            name: i6.agentType,
                            description: i6.whenToUse,
                            model: i6.model === "inherit" ? void 0 : i6.model
                        })),
                        plugins: h6,
                        mcpServers: M6(),
                        error_count: s6.error_count
                    })
                } catch (s6) {
                    p6(Q6, b6(s6))
                } else if (Q6.request.subtype === "mcp_reconnect") {
                    let s6 = w(),
                        {
                            serverName: u6
                        } = Q6.request;
                    i.delete(u6);
                    let h6 = my(u6) ?? K.find((_8) => _8.name === u6)?.config ?? A6.find((_8) => _8.name === u6)?.config ?? $6.clients.find((_8) => _8.name === u6)?.config ?? s6.mcp.clients.find((_8) => _8.name === u6)?.config ?? null;
                    if (!h6) p6(Q6, `Server not found: ${u6}`);
                    else {
                        let _8 = await _g(u6, h6),
                            R8 = Zh(u6);
                        if ($((x6) => ({
                                ...x6,
                                mcp: {
                                    ...x6.mcp,
                                    clients: x6.mcp.clients.map((i6) => i6.name === u6 ? _8.client : i6),
                                    tools: [...PG(x6.mcp.tools, (i6) => i6.name?.startsWith(R8)), ..._8.tools],
                                    commands: [...PG(x6.mcp.commands, (i6) => hl(i6, u6)), ..._8.commands],
                                    resources: _8.resources && _8.resources.length > 0 ? {
                                        ...x6.mcp.resources,
                                        [u6]: _8.resources
                                    } : gF(x6.mcp.resources, u6)
                                }
                            })), $6 = {
                                ...$6,
                                clients: [...$6.clients.filter((x6) => x6.name !== u6), _8.client],
                                tools: [...$6.tools.filter((x6) => !x6.name?.startsWith(R8)), ..._8.tools]
                            }, _8.client.type === "connected") O6([_8.client]), P07(_8.client), R6(Q6);
                        else {
                            let x6 = _8.client.type === "failed" ? _8.client.error ?? "Connection failed" : `Server status: ${_8.client.type}`;
                            p6(Q6, x6)
                        }
                    }
                } else if (Q6.request.subtype === "mcp_toggle") {
                    let s6 = w(),
                        {
                            serverName: u6,
                            enabled: h6
                        } = Q6.request;
                    i.delete(u6);
                    let _8 = my(u6) ?? K.find((R8) => R8.name === u6)?.config ?? A6.find((R8) => R8.name === u6)?.config ?? $6.clients.find((R8) => R8.name === u6)?.config ?? s6.mcp.clients.find((R8) => R8.name === u6)?.config ?? null;
                    if (!_8) p6(Q6, `Server not found: ${u6}`);
                    else if (!h6) {
                        YC6(u6, !1);
                        let R8 = [...K, ...A6, ...$6.clients, ...s6.mcp.clients].find((i6) => i6.name === u6);
                        if (R8 && R8.type === "connected") await WG(u6, _8);
                        let x6 = Zh(u6);
                        $((i6) => ({
                            ...i6,
                            mcp: {
                                ...i6.mcp,
                                clients: i6.mcp.clients.map((v8) => v8.name === u6 ? {
                                    name: u6,
                                    type: "disabled",
                                    config: _8
                                } : v8),
                                tools: PG(i6.mcp.tools, (v8) => v8.name?.startsWith(x6)),
                                commands: PG(i6.mcp.commands, (v8) => hl(v8, u6)),
                                resources: gF(i6.mcp.resources, u6)
                            }
                        })), R6(Q6)
                    } else {
                        YC6(u6, !0);
                        let R8 = await _g(u6, _8),
                            x6 = Zh(u6);
                        if ($((i6) => ({
                                ...i6,
                                mcp: {
                                    ...i6.mcp,
                                    clients: i6.mcp.clients.map((v8) => v8.name === u6 ? R8.client : v8),
                                    tools: [...PG(i6.mcp.tools, (v8) => v8.name?.startsWith(x6)), ...R8.tools],
                                    commands: [...PG(i6.mcp.commands, (v8) => hl(v8, u6)), ...R8.commands],
                                    resources: R8.resources && R8.resources.length > 0 ? {
                                        ...i6.mcp.resources,
                                        [u6]: R8.resources
                                    } : gF(i6.mcp.resources, u6)
                                }
                            })), R8.client.type === "connected") O6([R8.client]), P07(R8.client), R6(Q6);
                        else {
                            let i6 = R8.client.type === "failed" ? R8.client.error ?? "Connection failed" : `Server status: ${R8.client.type}`;
                            p6(Q6, i6)
                        }
                    }
                } else if (Q6.request.subtype === "channel_enable") {
                    let s6 = w();
                    uXA(Q6.request_id, Q6.request.serverName, [...s6.mcp.clients, ...A6, ...$6.clients], V)
                } else if (Q6.request.subtype === "mcp_authenticate") {
                    let {
                        serverName: s6
                    } = Q6.request, u6 = w(), h6 = my(s6) ?? K.find((_8) => _8.name === s6)?.config ?? u6.mcp.clients.find((_8) => _8.name === s6)?.config ?? null;
                    if (!h6) p6(Q6, `Server not found: ${s6}`);
                    else if (h6.type !== "sse" && h6.type !== "http") p6(Q6, `Server type "${h6.type}" does not support OAuth authentication`);
                    else try {
                        let _8, R8 = new Promise((f1) => {
                                _8 = f1
                            }),
                            x6 = T_6(s6, h6, (f1) => _8(f1), void 0, {
                                skipBrowserOpen: !0
                            }),
                            i6 = await Promise.race([R8, x6.then(() => null)]);
                        if (i6) R6(Q6, {
                            authUrl: i6,
                            requiresUserAction: !0
                        });
                        else R6(Q6, {
                            requiresUserAction: !1
                        });
                        w8.set(s6, x6), pl8(s6, x6);
                        let v8 = x6.then(async () => {
                            if (ZT(s6)) return;
                            if (L8.has(s6)) return;
                            let f1 = await _g(s6, h6),
                                g8 = Zh(s6);
                            $((w6) => ({
                                ...w6,
                                mcp: {
                                    ...w6.mcp,
                                    clients: w6.mcp.clients.map((D6) => D6.name === s6 ? f1.client : D6),
                                    tools: [...PG(w6.mcp.tools, (D6) => D6.name?.startsWith(g8)), ...f1.tools],
                                    commands: [...PG(w6.mcp.commands, (D6) => hl(D6, s6)), ...f1.commands],
                                    resources: f1.resources && f1.resources.length > 0 ? {
                                        ...w6.mcp.resources,
                                        [s6]: f1.resources
                                    } : gF(w6.mcp.resources, s6)
                                }
                            })), $6 = {
                                ...$6,
                                clients: [...$6.clients.filter((w6) => w6.name !== s6), f1.client],
                                tools: [...$6.tools.filter((w6) => !w6.name?.startsWith(g8)), ...f1.tools]
                            }
                        }).catch((f1) => {
                            E(`MCP OAuth failed for ${s6}: ${f1}`, {
                                level: "error"
                            })
                        }).finally(() => {
                            if (w8.get(s6) === x6) L8.delete(s6), w8.delete(s6)
                        })
                    } catch (_8) {
                        p6(Q6, b6(_8))
                    }
                } else if (Q6.request.subtype === "mcp_oauth_callback_url") {
                    let {
                        serverName: s6,
                        callbackUrl: u6
                    } = Q6.request, h6 = Bl8(s6);
                    if (h6) {
                        let _8 = !1;
                        try {
                            let R8 = new URL(u6);
                            _8 = R8.searchParams.has("code") || R8.searchParams.has("error")
                        } catch {}
                        if (!_8) p6(Q6, "Invalid callback URL: missing authorization code. Please paste the full redirect URL including the code parameter.");
                        else {
                            L8.add(s6), h6(u6);
                            let R8 = w8.get(s6) ?? Fl8(s6);
                            if (R8) try {
                                await R8, R6(Q6)
                            } catch (x6) {
                                p6(Q6, x6 instanceof Error ? x6.message : "OAuth authentication failed")
                            } else R6(Q6)
                        }
                    } else p6(Q6, `No active OAuth flow for server: ${s6}`)
                } else if (Q6.request.subtype === "claude_authenticate") {
                    let {
                        loginWithClaudeAi: s6
                    } = Q6.request;
                    x8?.service.cleanup(), d("tengu_oauth_flow_start", {
                        loginWithClaudeAi: s6 ?? !0
                    });
                    let u6 = new Et,
                        h6, _8 = new Promise((x6) => {
                            h6 = x6
                        }),
                        R8 = u6.startOAuthFlow(async (x6, i6) => {
                            h6({
                                manualUrl: x6,
                                automaticUrl: i6
                            })
                        }, {
                            loginWithClaudeAi: s6 ?? !0,
                            skipBrowserOpen: !0
                        }).then(async (x6) => {
                            await fX6(x6), d("tengu_oauth_success", {
                                loginWithClaudeAi: s6 ?? !0
                            })
                        }).finally(() => {
                            if (u6.cleanup(), x8?.service === u6) x8 = null
                        });
                    x8 = {
                        service: u6,
                        flow: R8
                    }, R8.catch((x6) => E(`claude_authenticate flow ended: ${x6}`, {
                        level: "info"
                    }));
                    try {
                        let {
                            manualUrl: x6,
                            automaticUrl: i6
                        } = await Promise.race([_8, R8.then(() => {
                            throw Error("OAuth flow completed without producing auth URLs")
                        })]);
                        R6(Q6, {
                            manualUrl: x6,
                            automaticUrl: i6
                        })
                    } catch (x6) {
                        p6(Q6, b6(x6))
                    }
                } else if (Q6.request.subtype === "claude_oauth_callback" || Q6.request.subtype === "claude_oauth_wait_for_completion")
                    if (!x8) p6(Q6, "No active claude_authenticate flow");
                    else {
                        if (Q6.request.subtype === "claude_oauth_callback") x8.service.handleManualAuthCodeInput({
                            authorizationCode: Q6.request.authorizationCode,
                            state: Q6.request.state
                        });
                        let {
                            flow: s6
                        } = x8;
                        s6.then(() => {
                            let u6 = hk6();
                            R6(Q6, {
                                account: {
                                    email: u6?.email,
                                    organization: u6?.organization,
                                    subscriptionType: u6?.subscription,
                                    tokenSource: u6?.tokenSource,
                                    apiKeySource: u6?.apiKeySource,
                                    apiProvider: pq()
                                }
                            })
                        }, (u6) => p6(Q6, b6(u6)))
                    }
                else if (Q6.request.subtype === "mcp_clear_auth") {
                    let {
                        serverName: s6
                    } = Q6.request, u6 = w(), h6 = my(s6) ?? K.find((_8) => _8.name === s6)?.config ?? u6.mcp.clients.find((_8) => _8.name === s6)?.config ?? null;
                    if (!h6) p6(Q6, `Server not found: ${s6}`);
                    else if (h6.type !== "sse" && h6.type !== "http") p6(Q6, `Cannot clear auth for server type "${h6.type}"`);
                    else {
                        await q98(s6, h6);
                        let _8 = await _g(s6, h6),
                            R8 = Zh(s6);
                        $((x6) => ({
                            ...x6,
                            mcp: {
                                ...x6.mcp,
                                clients: x6.mcp.clients.map((i6) => i6.name === s6 ? _8.client : i6),
                                tools: [...PG(x6.mcp.tools, (i6) => i6.name?.startsWith(R8)), ..._8.tools],
                                commands: [...PG(x6.mcp.commands, (i6) => hl(i6, s6)), ..._8.commands],
                                resources: _8.resources && _8.resources.length > 0 ? {
                                    ...x6.mcp.resources,
                                    [s6]: _8.resources
                                } : gF(x6.mcp.resources, s6)
                            }
                        })), R6(Q6, {})
                    }
                } else if (Q6.request.subtype === "apply_flag_settings") {
                    let s6 = G5(),
                        u6 = aB6() ?? {},
                        h6 = Q6.request.settings,
                        _8 = {
                            ...u6,
                            ...h6
                        };
                    for (let x6 of Object.keys(_8))
                        if (_8[x6] === null) delete _8[x6];
                    if (W81(_8), _y.notifyChange("flagSettings"), "model" in h6)
                        if (h6.model != null) kW(String(h6.model));
                        else kW(void 0);
                    let R8 = G5();
                    if (R8 !== s6) {
                        c = R8;
                        let x6 = h6.model ? String(h6.model) : "default";
                        q.sessionState.notifyMetadataChanged({
                            model: R8
                        }), z6(x6, R8)
                    }
                    R6(Q6)
                } else if (Q6.request.subtype === "get_settings") {
                    let s6 = w(),
                        u6 = G5(),
                        h6 = QI(u6) ? wy6(u6, s6.effortValue) : void 0,
                        _8 = dO1(),
                        R8 = bm().errors.filter((x6) => x6.severity !== "warning").map((x6) => ({
                            file: x6.file,
                            path: x6.path,
                            message: x6.message
                        }));
                    R6(Q6, {
                        ..._8,
                        applied: {
                            model: u6,
                            effort: typeof h6 === "string" ? h6 : null
                        },
                        errors: R8.length > 0 ? R8 : void 0
                    })
                } else if (Q6.request.subtype === "stop_task") {
                    let {
                        task_id: s6
                    } = Q6.request;
                    try {
                        await rQ8(s6, {
                            taskRegistry: Uk(w, $),
                            setAppState: $
                        }), R6(Q6, {})
                    } catch (u6) {
                        p6(Q6, b6(u6))
                    }
                } else if (Q6.request.subtype === "generate_session_title") {
                    let {
                        description: s6,
                        persist: u6
                    } = Q6.request;
                    if (u6) D8 = !0;
                    let h6 = (v && !v.signal.aborted ? v : F5()).signal;
                    (async () => {
                        try {
                            let _8 = await oe(s6, h6);
                            if (_8 && u6) try {
                                oo8(I8(), _8)
                            } catch (R8) {
                                j6(R8)
                            }
                            R6(Q6, {
                                title: _8
                            })
                        } catch (_8) {
                            p6(Q6, b6(_8))
                        }
                    })()
                } else if (Q6.request.subtype === "side_question") {
                    let {
                        question: s6
                    } = Q6.request;
                    (async () => {
                        try {
                            let u6 = XJ6(),
                                h6 = u6 ? {
                                    ...u6,
                                    toolUseContext: {
                                        ...u6.toolUseContext,
                                        abortController: F5()
                                    }
                                } : await mJ5({
                                    tools: H6(w()),
                                    commands: T6,
                                    mcpClients: [...w().mcp.clients, ...A6, ...$6.clients],
                                    messages: C,
                                    readFileState: x,
                                    getAppState: w,
                                    setAppState: $,
                                    customSystemPrompt: o(),
                                    appendSystemPrompt: H.appendSystemPrompt,
                                    excludeDynamicSections: H.excludeDynamicSections,
                                    thinkingConfig: l,
                                    agents: v6
                                }),
                                _8 = await yn8({
                                    question: s6,
                                    cacheSafeParams: h6,
                                    threadHistory: !1
                                });
                            R6(Q6, {
                                response: _8.response,
                                synthetic: _8.synthetic
                            })
                        } catch (u6) {
                            p6(Q6, b6(u6))
                        }
                    })()
                } else if (Q6.request.subtype === "ultrareview_launch") {
                    let {
                        args: s6 = "",
                        confirm: u6 = !1
                    } = Q6.request;
                    (async () => {
                        try {
                            let h6 = await JlK(s6, {
                                confirm: u6,
                                context: {
                                    abortController: F5(),
                                    taskRegistry: Uk(w, $)
                                }
                            });
                            R6(Q6, h6)
                        } catch (h6) {
                            p6(Q6, b6(h6))
                        }
                    })()
                } else if (Q6.request.subtype === "remote_control")
                    if (Q6.request.enabled)
                        if (_6) R6(Q6, {
                            session_url: g2(_6.bridgeSessionId, _6.sessionIngressUrl),
                            connect_url: C48(_6.environmentId, _6.sessionIngressUrl),
                            environment_id: _6.environmentId
                        });
                        else {
                            let s6;
                            try {
                                let {
                                    initReplBridge: u6
                                } = await Promise.resolve().then(() => (BX7(), mX7)), h6 = await u6({
                                    onInboundMessage(_8) {
                                        let R8 = Ua8(_8);
                                        if (!R8) return;
                                        let {
                                            content: x6,
                                            uuid: i6
                                        } = R8, v8 = void 0;
                                        Dj({
                                            value: x6,
                                            mode: "prompt",
                                            uuid: i6,
                                            skipSlashCommands: !0,
                                            ...v8 && {
                                                origin: {
                                                    kind: "peer",
                                                    from: v8
                                                },
                                                isMeta: !0
                                            }
                                        }), Z8()
                                    },
                                    onPermissionResponse(_8) {
                                        q.injectControlResponse(_8)
                                    },
                                    onInterrupt() {
                                        v?.abort()
                                    },
                                    onSetModel(_8) {
                                        let R8 = _8 === "default" ? ZP() : _8;
                                        c = R8, kW(R8)
                                    },
                                    onSetMaxThinkingTokens(_8) {
                                        l = wX5(_8, n)
                                    },
                                    onStateChange(_8, R8) {
                                        if (_8 === "failed") s6 = R8;
                                        E(`[bridge:sdk] State change: ${_8}${R8?` — ${R8}`:""}`), V.enqueue({
                                            type: "system",
                                            subtype: "bridge_state",
                                            state: _8,
                                            detail: R8,
                                            uuid: gX(),
                                            session_id: I8()
                                        })
                                    },
                                    initialMessages: C.length > 0 ? C : void 0,
                                    initialName: Q6.request.name
                                });
                                if (!h6) p6(Q6, s6 ?? "Remote Control initialization failed");
                                else _6 = h6, r = C.length, q.setOnControlRequestSent((_8) => {
                                    h6.sendControlRequest(_8)
                                }), q.setOnControlRequestResolved((_8) => {
                                    h6.sendControlCancelRequest(_8)
                                }), R6(Q6, {
                                    session_url: g2(h6.bridgeSessionId, h6.sessionIngressUrl),
                                    connect_url: C48(h6.environmentId, h6.sessionIngressUrl),
                                    environment_id: h6.environmentId
                                })
                            } catch (u6) {
                                p6(Q6, b6(u6))
                            }
                        }
                else {
                    if (_6) q.setOnControlRequestSent(void 0), q.setOnControlRequestResolved(void 0), await _6.teardown(), _6 = null;
                    R6(Q6)
                } else p6(Q6, `Unsupported control request subtype: ${Q6.request.subtype}`);
                continue
            } else if (Q6.type === "control_response") {
                if (H.replayUserMessages) V.enqueue(Q6);
                continue
            } else if (Q6.type === "keep_alive") continue;
            else if (Q6.type === "update_environment_variables") continue;
            else if (Q6.type === "assistant" || Q6.type === "system") {
                let s6 = ir8([Q6]);
                if (C.push(...s6), Q6.type === "assistant" && H.replayUserMessages) V.enqueue(Q6);
                continue
            }
            if (Q6.type !== "user") continue;
            if (a6 = !0, Q6.uuid) {
                let s6 = I8(),
                    u6 = await FH7(s6, Q6.uuid);
                if (u6 || He8.has(Q6.uuid)) {
                    if (E(`Skipping duplicate user message: ${Q6.uuid}`), H.replayUserMessages) {
                        E(`Sending acknowledgment for duplicate user message: ${Q6.uuid}`);
                        let h6 = pz8(Q6);
                        V.enqueue({
                            type: "user",
                            message: Q6.message,
                            session_id: s6,
                            parent_tool_use_id: null,
                            uuid: Q6.uuid,
                            timestamp: Q6.timestamp,
                            isReplay: !0,
                            ...h6.length > 0 && {
                                file_attachments: h6
                            }
                        })
                    }
                    if (u6) q.onCommandLifecycle?.(Q6.uuid, "completed");
                    continue
                }
                yXA(Q6.uuid)
            }
            if (!D8 && Q6.shouldQuery !== !1) {
                let s6 = qu(Q6.message.content);
                if (s6 && !Gn8(s6)) {
                    D8 = !0;
                    let u6 = I8();
                    if (!NH(u6)) {
                        let h6 = (v && !v.signal.aborted ? v : F5()).signal;
                        oe(s6, h6).then((_8) => {
                            if (!_8) {
                                D8 = !1;
                                return
                            }
                            if (NH(u6)) return;
                            oo8(u6, _8)
                        }).catch((_8) => {
                            D8 = !1, j6(_8)
                        })
                    }
                }
            }
            let G8 = pz8(Q6);
            Dj({
                mode: "prompt",
                value: await pX7(Q6, Q6.message.content),
                uuid: Q6.uuid,
                priority: Q6.priority,
                shouldQuery: Q6.shouldQuery,
                ...G8.length > 0 && {
                    fileAttachments: G8
                }
            }), Z8()
        }
        if (D = !0, N8?.stop(), !M) {
            if (N.inflightPromise) {
                let Q6 = setTimeout((W8) => W8?.abort(), 30000, N.abortController);
                try {
                    await N.inflightPromise
                } finally {
                    clearTimeout(Q6)
                }
            }
            N.abortController?.abort(), N.abortController = null, await Oi1(), c6(), R?.(), ZK6.delete(h), await tz7([...w().mcp.clients, ...A6, ...$6.clients]), V.done()
        }
    })(), V
}
// @from(Ln 570134, Col 0)
async function JX5(q, K = 2000) {
    let _ = q().mcp,
        z = w7(_.clients, ($) => $.type === "pending"),
        Y = _.tools.length;
    if (z === 0 || Y > 0) return;
    let A = Date.now(),
        O = A + K;
    while (Date.now() < O) {
        if (q().mcp.clients.every(($) => $.type !== "pending")) break;
        await l7(50)
    }
    let w = q().mcp;
    d("tengu_headless_mcp_prewait", {
        pendingBefore: z,
        toolsBefore: Y,
        waitedMs: Date.now() - A,
        pendingAfter: w7(w.clients, ($) => $.type === "pending"),
        toolsAfter: w.tools.length,
        mcpNonBlocking: S6(process.env.MCP_CONNECTION_NONBLOCKING)
    })
}
// @from(Ln 570156, Col 0)
function XX5(q) {
    let K = async (_, z, Y, A, O, w) => {
        let $ = w ?? await LX(_, z, Y, A, O);
        if ($.behavior === "allow" || $.behavior === "deny") return $;
        let {
            signal: j,
            cleanup: H
        } = GL(Y.abortController.signal);
        if (j.aborted) return H(), {
            behavior: "deny",
            message: "Permission prompt was aborted.",
            decisionReason: {
                type: "permissionPromptTool",
                permissionPromptToolName: _.name,
                toolResult: void 0
            }
        };
        let J = new Promise((D) => {
                j.addEventListener("abort", () => D("aborted"), {
                    once: !0
                })
            }),
            X = q.call({
                tool_name: _.name,
                input: z,
                tool_use_id: O
            }, Y, K, A),
            M = await Promise.race([X, J]);
        if (H(), M === "aborted" || j.aborted) return {
            behavior: "deny",
            message: "Permission prompt was aborted.",
            decisionReason: {
                type: "permissionPromptTool",
                permissionPromptToolName: _.name,
                toolResult: void 0
            }
        };
        let P = M,
            W = q.mapToolResultToToolResultBlockParam(P.data, "1");
        if (!W.content || !Array.isArray(W.content) || !W.content[0] || W.content[0].type !== "text" || typeof W.content[0].text !== "string") throw Error('Permission prompt tool returned an invalid result. Expected a single text block param with type="text" and a string text value.');
        return Rm6(uY8().parse(k5(W.content[0].text)), q, z, Y)
    };
    return K
}
// @from(Ln 570201, Col 0)
function MX5(q, K, _, z) {
    if (q === "stdio") return K.createCanUseTool(z);
    if (!q) return async (A, O, w, $, j, H) => H ?? await LX(A, O, w, $, j);
    let Y = null;
    return async (A, O, w, $, j, H) => {
        if (!Y) {
            let J = _(),
                X = J.find((M) => e3(M, q));
            if (!X) {
                let M = `Error: MCP tool ${q} (passed via --permission-prompt-tool) not found. Available MCP tools: ${J.map((P)=>P.name).join(", ")||"none"}`;
                throw process.stderr.write(`${M}
`), j5(1), Error(M)
            }
            if (!X.inputJSONSchema) {
                let M = `Error: tool ${q} (passed via --permission-prompt-tool) must be an MCP tool`;
                throw process.stderr.write(`${M}
`), j5(1), Error(M)
            }
            Y = XX5(X)
        }
        return Y(A, O, w, $, j, H)
    }
}
// @from(Ln 570225, Col 0)
function bXA(q) {
    return Array.isArray(q) && q.length === 1 && q[0] === ""
}
// @from(Ln 570228, Col 0)
async function IXA(q, K, _, z, Y, A, O, w, $, j, H) {
    if (_) {
        z.enqueue({
            type: "control_response",
            response: {
                subtype: "error",
                error: "Already initialized",
                request_id: K,
                pending_permission_requests: O.getPendingPermissionRequests()
            }
        });
        return
    }
    if (q.systemPrompt !== void 0) $.systemPrompt = bXA(q.systemPrompt) ? "" : q.systemPrompt;
    if (q.appendSystemPrompt !== void 0) $.appendSystemPrompt = q.appendSystemPrompt;
    if (q.appendSubagentSystemPrompt !== void 0) $.appendSubagentSystemPrompt = q.appendSubagentSystemPrompt;
    if (q.excludeDynamicSections !== void 0) $.excludeDynamicSections = q.excludeDynamicSections;
    if (q.promptSuggestions !== void 0) $.promptSuggestions = q.promptSuggestions;
    if (q.agents) {
        let Z = k88(q.agents, "flagSettings");
        j.push(...Z)
    }
    if ($.agent) {
        let Z = lg() === $.agent,
            G = j.find((f) => f.agentType === $.agent);
        if (G && !Z) {
            if (_m(G.agentType), !$.systemPrompt && !Vj(G)) {
                let f = G.getSystemPrompt();
                if (f) $.systemPrompt = f
            }
            if (!$.userSpecifiedModel && G.model && G.model !== "inherit") {
                let f = K5(G.model);
                kW(f)
            }
            if (G.initialPrompt) O.prependUserMessage(G.initialPrompt)
        } else if (G?.initialPrompt) O.prependUserMessage(G.initialPrompt)
    }
    let X = y7()?.outputStyle || lk,
        M = await Hx6(b8()),
        P = hk6();
    if (q.hooks) {
        let Z = {};
        for (let [G, f] of Object.entries(q.hooks)) Z[G] = f.map((v) => {
            let V = v.hookCallbackIds.map((k) => {
                return O.createHookCallback(k, v.timeout)
            });
            return {
                matcher: v.matcher,
                hooks: V
            }
        });
        Ii(Z)
    }
    if (q.jsonSchema) F81(q.jsonSchema);
    let W = {
        commands: Y.filter((Z) => Z.userInvocable !== !1).map((Z) => ({
            name: y_(Z),
            description: IP6(Z),
            argumentHint: Z.argumentHint || ""
        })),
        agents: j.map((Z) => ({
            name: Z.agentType,
            description: Z.whenToUse,
            model: Z.model === "inherit" ? void 0 : Z.model
        })),
        output_style: X,
        available_output_styles: Object.keys(M),
        models: A,
        account: {
            email: P?.email,
            organization: P?.organization,
            subscriptionType: P?.subscription,
            tokenSource: P?.tokenSource,
            apiKeySource: P?.apiKeySource,
            apiProvider: pq()
        },
        pid: process.pid
    };
    if (q5() && AM()) {
        let Z = H();
        W.fast_mode_state = yE($.userSpecifiedModel ?? null, Z.fastMode)
    }
    z.enqueue({
        type: "control_response",
        response: {
            subtype: "success",
            request_id: K,
            response: W
        }
    });
    let D = H().mcp;
    if (d("tengu_sdk_init_handshake", {
            uptime_ms: Math.round(process.uptime() * 1000),
            mcp_client_count: D.clients.length,
            mcp_pending_count: w7(D.clients, (Z) => Z.type === "pending")
        }), w) {
        let G = wD.getInstance().getStatus();
        if (G) z.enqueue({
            type: "auth_status",
            isAuthenticating: G.isAuthenticating,
            output: G.output,
            error: G.error,
            uuid: gX(),
            session_id: I8()
        })
    }
}
// @from(Ln 570335, Col 0)
async function PX5(q, K, _) {
    if (!kO()) return {
        canRewind: !1,
        error: "File rewinding is not enabled."
    };
    if (!nF8(K.fileHistory, q)) return {
        canRewind: !1,
        error: "No file checkpoint found for this message."
    };
    if (_) {
        let z = await r48(K.fileHistory, q);
        return {
            canRewind: !0,
            filesChanged: z?.filesChanged,
            insertions: z?.insertions,
            deletions: z?.deletions
        }
    }
    try {
        await lF8(() => K.fileHistory, q)
    } catch (z) {
        return {
            canRewind: !1,
            error: `Failed to rewind: ${b6(z)}`
        }
    }
    return {
        canRewind: !0
    }
}
// @from(Ln 570366, Col 0)
function xXA(q, K, _, z) {
    if (q.mode === "bypassPermissions") {
        if (wt()) return z.enqueue({
            type: "control_response",
            response: {
                subtype: "error",
                request_id: K,
                error: "Cannot set permission mode to bypassPermissions because it is disabled by settings or configuration"
            }
        }), _;
        if (!_.isBypassPermissionsModeAvailable) return z.enqueue({
            type: "control_response",
            response: {
                subtype: "error",
                request_id: K,
                error: "Cannot set permission mode to bypassPermissions because the session was not launched with --dangerously-skip-permissions"
            }
        }), _
    }
    if (q.mode === "auto" && !$L()) {
        let Y = ge();
        return z.enqueue({
            type: "control_response",
            response: {
                subtype: "error",
                request_id: K,
                error: Y ? `Cannot set permission mode to auto: ${E_6(Y)}` : "Cannot set permission mode to auto"
            }
        }), _
    }
    return z.enqueue({
        type: "control_response",
        response: {
            subtype: "success",
            request_id: K,
            response: {
                mode: q.mode
            }
        }
    }), {
        ...Fe(_.mode, q.mode, _),
        mode: q.mode
    }
}
// @from(Ln 570411, Col 0)
function uXA(q, K, _, z) {
    let Y = (M) => z.enqueue({
            type: "control_response",
            response: {
                subtype: "error",
                request_id: q,
                error: M
            }
        }),
        A = _.find((M) => M.name === K && M.type === "connected");
    if (!A || A.type !== "connected") return Y(`server ${K} is not connected`);
    let O = A.config.pluginSource,
        w = O ? Z4(O) : void 0;
    if (!w?.marketplace) return Y(`server ${K} is not plugin-sourced; channel_enable requires a marketplace plugin`);
    let $ = {
            kind: "plugin",
            name: w.name,
            marketplace: w.marketplace
        },
        j = qj(),
        H = j.some((M) => M.kind === "plugin" && M.name === $.name && M.marketplace === $.marketplace);
    if (!H) xi([...j, $]);
    let J = A_8(K, A.capabilities, O);
    if (J.action === "skip") {
        if (!H) xi(j);
        return Y(J.reason)
    }
    let X = `${$.name}@${$.marketplace}`;
    i8(K, "Channel notifications registered"), d("tengu_mcp_channel_enable", {
        plugin: X
    }), A.client.setNotificationHandler(z_8(), async (M) => {
        let {
            content: P,
            meta: W
        } = M.params;
        i8(K, `notifications/claude/channel: ${P.slice(0,80)}`), d("tengu_mcp_channel_message", {
            content_length: P.length,
            meta_key_count: Object.keys(W ?? {}).length,
            entry_kind: "plugin",
            is_dev: !1,
            plugin: X
        }), Dj({
            mode: "prompt",
            value: Y_8(K, P, W),
            priority: "next",
            isMeta: !0,
            origin: {
                kind: "channel",
                server: K
            },
            skipSlashCommands: !0
        })
    }), z.enqueue({
        type: "control_response",
        response: {
            subtype: "success",
            request_id: q,
            response: void 0
        }
    })
}
// @from(Ln 570473, Col 0)
function P07(q) {
    if (q.type !== "connected") return;
    if (A_8(q.name, q.capabilities, q.config.pluginSource).action !== "register") return;
    let _ = BP6(q.name, qj()),
        z = _?.kind === "plugin" ? `${_.name}@${_.marketplace}` : void 0;
    i8(q.name, "Channel notifications re-registered after reconnect"), q.client.setNotificationHandler(z_8(), async (Y) => {
        let {
            content: A,
            meta: O
        } = Y.params;
        i8(q.name, `notifications/claude/channel: ${A.slice(0,80)}`), d("tengu_mcp_channel_message", {
            content_length: A.length,
            meta_key_count: Object.keys(O ?? {}).length,
            entry_kind: _?.kind,
            is_dev: _?.dev ?? !1,
            plugin: z
        }), Dj({
            mode: "prompt",
            value: Y_8(q.name, A, O),
            priority: "next",
            isMeta: !0,
            origin: {
                kind: "channel",
                server: q.name
            },
            skipSlashCommands: !0
        })
    })
}
// @from(Ln 570503, Col 0)
function OA8(q, K) {
    if (process.stderr.write(q + `
`), E(q, {
            level: "error"
        }), K === "stream-json") {
        let _ = {
            type: "result",
            subtype: "error_during_execution",
            duration_ms: 0,
            duration_api_ms: 0,
            is_error: !0,
            num_turns: 0,
            stop_reason: null,
            session_id: I8(),
            total_cost_usd: 0,
            usage: iP,
            modelUsage: {},
            permission_denials: [],
            uuid: gX(),
            errors: [q]
        };
        process.stdout.write(I6(_) + `
`)
    }
}
// @from(Ln 570529, Col 0)
function WX5(q, K) {
    let _ = q.findIndex((z) => z.uuid === K.uuid);
    if (_ !== -1) q.splice(_, 2)
}
// @from(Ln 570533, Col 0)
async function DX5(q, K) {
    let _ = !uN();
    if (K.continue) try {
        d("tengu_continue_print", {});
        let z = await Ft(void 0, void 0);
        if (z) {
            if (!K.forkSession) {
                if (z.sessionId) {
                    if (SZ(pP(z.sessionId), z.fullPath ? KX5(z.fullPath) : null), _) await Gu()
                }
            }
            if (EY8(z, q), In(K.forkSession ? {
                    ...z,
                    worktreeSession: void 0
                } : z), !K.forkSession && _ && z.sessionId) bn();
            return {
                messages: z.messages,
                turnInterruptionState: z.turnInterruptionState,
                deferredToolUse: z.deferredToolUse,
                agentSetting: z.agentSetting
            }
        }
        d("tengu_continue", {
            success: !1,
            entrypoint: "print"
        })
    } catch (z) {
        return j6(z), j5(1), {
            messages: []
        }
    }
    if (K.teleport) try {
        if (!N5("allow_remote_sessions")) throw Error("Remote sessions are disabled by your organization's policy.");
        if (d("tengu_teleport_print", {}), typeof K.teleport !== "string") throw Error("No session ID provided for teleport");
        let {
            checkOutTeleportedSessionBranch: z,
            processMessagesForTeleportResume: Y,
            teleportResumeCodeSession: A,
            validateGitState: O
        } = await Promise.resolve().then(() => (sk(), H77));
        await O();
        let w = await A(K.teleport),
            {
                branchError: $
            } = await z(w.branch);
        return {
            messages: Y(w.log, $)
        }
    } catch (z) {
        return j6(z), j5(1), {
            messages: []
        }
    }
    if (K.resume) {
        let z = "load_error",
            Y = performance.now();
        try {
            d("tengu_resume_print", {});
            let A = typeof K.resume === "string" ? K.resume.trim() : "",
                O = X07(A);
            if (!O && A) {
                let $ = await Zu(A, {
                    exact: !0
                });
                if ($.length === 1) {
                    let j = xY($[0]);
                    if (j) O = X07(j)
                } else if ($.length > 1) {
                    let j = $.map((H) => `  ${xY(H)??"(unknown)"}  (modified ${H.modified.toISOString()})`).join(`
`);
                    return d("tengu_session_resumed", {
                        entrypoint: "print",
                        success: !1,
                        failure_reason: "not_found"
                    }), OA8(`Error: --resume "${A}" matches ${$.length} sessions. Pass one of these session IDs to disambiguate:
${j}`, K.outputFormat), j5(1), {
                        messages: []
                    }
                }
            }
            if (!O) {
                let $ = "Error: --resume requires a valid session ID or session title when used with --print. Usage: claude -p --resume <session-id|title>";
                if (A) $ += `. Provided value "${A}" is not a UUID and does not match any session title.`;
                return d("tengu_session_resumed", {
                    entrypoint: "print",
                    success: !1,
                    failure_reason: "not_found"
                }), OA8($, K.outputFormat), j5(1), {
                    messages: []
                }
            }
            if (S6(process.env.CLAUDE_CODE_USE_CCR_V2)) {
                let [, $] = await Promise.all([RH7(O.sessionId), K.restoredWorkerState]);
                if ($) {
                    if (q(R75($)), typeof $.model === "string") kW($.model)
                }
            } else if (O.isUrl && O.ingressUrl && S6("true")) await hH7(O.sessionId, O.ingressUrl);
            let w = await Ft(O.sessionId, O.jsonlFile || void 0);
            if (z = "processing_error", !w || w.messages.length === 0)
                if (O.isUrl || S6(process.env.CLAUDE_CODE_USE_CCR_V2)) {
                    let $ = [];
                    if ($36()) {
                        let j = process.env.CLAUDE_CODE_RESUME_FROM_SESSION;
                        if (j) try {
                            E(`[resume-from] Hydrating from source session ${j}`);
                            let {
                                prepareApiRequest: H
                            } = await Promise.resolve().then(() => (VX(), CR6)), {
                                teleportFromSessionsAPI: J
                            } = await Promise.resolve().then(() => (sk(), H77)), {
                                deserializeMessages: X
                            } = await Promise.resolve().then(() => (IX6(), wwK)), {
                                accessToken: M,
                                orgUUID: P
                            } = await H(), {
                                log: W
                            } = await J(j, P, M);
                            $ = X(W), E(`[resume-from] Loaded ${$.length} messages from ${j}`)
                        } catch (H) {
                            E(`[resume-from] Failed to hydrate from ${j}: ${b6(H)}`)
                        }
                    }
                    return {
                        messages: [...$, ...await (K.sessionStartHooksPromise ?? F66({
                            kind: "session-start",
                            source: "startup"
                        }))]
                    }
                } else return d("tengu_session_resumed", {
                    entrypoint: "print",
                    success: !1,
                    failure_reason: "not_found"
                }), OA8(`No conversation found with session ID: ${O.sessionId}`, K.outputFormat), j5(1), {
                    messages: []
                };
            if (K.resumeSessionAt) {
                let $ = w.messages.findIndex((j) => j.uuid === K.resumeSessionAt);
                if ($ < 0) return d("tengu_session_resumed", {
                    entrypoint: "print",
                    success: !1,
                    failure_reason: "processing_error"
                }), OA8(`No message found with message.uuid of: ${K.resumeSessionAt}`, K.outputFormat), j5(1), {
                    messages: []
                };
                w.messages = $ >= 0 ? w.messages.slice(0, $ + 1) : []
            }
            if (!K.forkSession && w.sessionId) {
                if (SZ(pP(w.sessionId), w.fullPath ? KX5(w.fullPath) : null), _) await Gu()
            }
            if (EY8(w, q), In(K.forkSession ? {
                    ...w,
                    worktreeSession: void 0
                } : w), !K.forkSession && _ && w.sessionId) bn();
            return d("tengu_session_resumed", {
                entrypoint: "print",
                success: !0,
                resume_duration_ms: Math.round(performance.now() - Y)
            }), {
                messages: w.messages,
                turnInterruptionState: w.turnInterruptionState,
                deferredToolUse: w.deferredToolUse,
                agentSetting: w.agentSetting
            }
        } catch (A) {
            d("tengu_session_resumed", {
                entrypoint: "print",
                success: !1,
                failure_reason: z,
                error_name: r1(A).name
            }), j6(A);
            let O = A instanceof Error ? `Failed to resume session: ${A.message}` : "Failed to resume session with --print mode";
            return OA8(O, K.outputFormat), j5(1), {
                messages: []
            }
        }
    }
    return {
        messages: await (K.sessionStartHooksPromise ?? F66({
            kind: "session-start",
            source: "startup"
        }))
    }
}
// @from(Ln 570717, Col 0)
function mXA(q, K) {
    let _;
    if (typeof q === "string")
        if (q.trim() !== "") _ = ja1([I6({
            type: "user",
            session_id: "",
            message: {
                role: "user",
                content: q
            },
            parent_tool_use_id: null
        })]);
        else _ = ja1([]);
    else _ = q;
    return K.sdkUrl ? new $e8(K.sdkUrl, _, K.replayUserMessages, K.sessionState) : new BY8(_, K.replayUserMessages, K.sessionState)
}
// @from(Ln 570733, Col 0)
async function ZX5({
    message: q,
    setAppState: K,
    onEnqueued: _,
    handledToolUseIds: z
}) {
    if (q.response.subtype === "success" && q.response.response?.toolUseID && typeof q.response.response.toolUseID === "string") {
        let Y = q.response.response,
            {
                toolUseID: A
            } = Y;
        if (!A) return !1;
        if (E(`handleOrphanedPermissionResponse: received orphaned control_response for toolUseID=${A} request_id=${q.response.request_id}`), z.has(A)) return E(`handleOrphanedPermissionResponse: skipping duplicate orphaned permission for toolUseID=${A} (already handled)`), !1;
        let O = await UH7(A);
        if (!O) return E(`handleOrphanedPermissionResponse: no unresolved tool_use found for toolUseID=${A} (already resolved in transcript)`), !1;
        return z.add(A), E(`handleOrphanedPermissionResponse: enqueuing orphaned permission for toolUseID=${A} messageID=${O.message.id}`), Dj({
            mode: "orphaned-permission",
            value: [],
            orphanedPermission: {
                permissionResult: Y,
                assistantMessage: O
            }
        }), _?.(), !0
    }
    return !1
}
// @from(Ln 570760, Col 0)
function W07(q) {
    if (q.type === "http" || q.type === "sse") {
        let {
            tools: K,
            ..._
        } = q;
        return {
            ..._,
            scope: "dynamic"
        }
    }
    return {
        ...q,
        scope: "dynamic"
    }
}