
// @from(Ln 567096, Col 0)
class QJ5 {
    config;
    mutableMessages;
    abortController;
    permissionDenials;
    totalUsage;
    hasHandledOrphanedPermission = !1;
    hasHandledDeferredToolResume = !1;
    readFileState;
    discoveredSkillNames = new Set;
    discoveredRemoteSkills = new Map;
    loadedNestedMemoryPaths = new Set;
    sessionEnvVars;
    tmuxSocket;
    memorySelector = dK6();
    bashRerunAliases = _78();
    constructor(q) {
        this.config = q, this.mutableMessages = q.initialMessages ?? [], this.abortController = q.abortController ?? F5(), this.permissionDenials = [], this.readFileState = q.readFileCache, this.sessionEnvVars = q.sessionEnvVars ?? new Map, this.tmuxSocket = q.tmuxSocket, this.totalUsage = iP
    }
    async * submitMessage(q, K) {
        let {
            cwd: _,
            commands: z,
            tools: Y,
            refreshTools: A,
            mcpClients: O,
            verbose: w = !1,
            thinkingConfig: $,
            maxTurns: j,
            maxBudgetUsd: H,
            taskBudget: J,
            canUseTool: X,
            customSystemPrompt: M,
            appendSystemPrompt: P,
            appendSubagentSystemPrompt: W,
            excludeDynamicSections: D,
            userSpecifiedModel: Z,
            fallbackModel: G,
            jsonSchema: f,
            getAppState: v,
            setAppState: V,
            replayUserMessages: k = !1,
            includePartialMessages: N = !1,
            agents: R = [],
            setSDKStatus: h,
            orphanedPermission: C,
            deferredToolUse: x
        } = this.config;
        this.discoveredSkillNames.clear(), l$(_);
        let B = !uN(),
            m = Date.now(),
            S = 0,
            F = (u6, h6, _8) => {
                if (this.permissionDenials.some((R8) => R8.tool_use_id === h6)) return;
                this.permissionDenials.push({
                    tool_name: ZX7(u6.name),
                    tool_use_id: h6,
                    tool_input: _8
                })
            },
            U = async (u6, h6, _8, R8, x6, i6) => {
                let v8 = await X(u6, h6, _8, R8, x6, i6);
                if (v8.behavior !== "allow") F(u6, x6, h6);
                return v8
            }, g = v(), c = Z ? K5(Z) : G5(), n = $ ? $ : DK6() !== !1 ? {
                type: "adaptive"
            } : {
                type: "disabled"
            };
        GM("before_getSystemPrompt");
        let {
            defaultSystemPrompt: l,
            userContext: z6,
            systemContext: A6
        } = await H07({
            tools: Y,
            mainLoopModel: c,
            additionalWorkingDirectories: Array.from(g.toolPermissionContext.additionalWorkingDirectories.keys()),
            customSystemPrompt: M,
            excludeDynamicSections: D,
            cacheBreakerPhrase: g.cacheBreakerPhrase
        });
        GM("after_getSystemPrompt");
        let e = {
                ...z6,
                ...WXA(O, mn() ? Pz6() : void 0)
            },
            i = M !== void 0 && hk8() ? await fz8() : null,
            O6 = sK([...typeof M === "string" ? [M] : Array.isArray(M) ? M : l, ...i ? [i] : [], ...P ? [P] : []]),
            J6 = Y.some((u6) => e3(u6, iW));
        if (f && J6) ja8(V, I8());
        let $6 = {
            messages: this.mutableMessages,
            turnStartIndex: 0,
            setMessages: (u6) => {
                this.mutableMessages = u6(this.mutableMessages)
            },
            onChangeAPIKey: () => {},
            onPermissionDenial: F,
            handleElicitation: this.config.handleElicitation,
            onCommandLifecycle: this.config.onCommandLifecycle,
            sessionState: this.config.sessionState,
            options: {
                commands: z,
                debug: !1,
                tools: Y,
                refreshTools: A,
                verbose: w,
                mainLoopModel: c,
                thinkingConfig: n,
                mcpClients: O,
                mcpResources: {},
                ideInstallationStatus: null,
                isNonInteractiveSession: !0,
                customSystemPrompt: M,
                appendSystemPrompt: P,
                appendSubagentSystemPrompt: W,
                agentDefinitions: {
                    activeAgents: R,
                    allAgents: []
                },
                theme: Ad(H8().theme),
                maxBudgetUsd: H
            },
            getAppState: v,
            setAppState: V,
            setToolPermissionContext: (u6) => V((h6) => {
                let _8 = typeof u6 === "function" ? u6(h6.toolPermissionContext) : u6;
                return h6.toolPermissionContext === _8 ? h6 : {
                    ...h6,
                    toolPermissionContext: _8
                }
            }),
            taskRegistry: Uk(v, V),
            sessionHooksRegistry: OM6(V),
            setClassifierApprovals: qF(V),
            setReplContext: H06(V),
            setWebBrowserSlice: P36(V),
            abortSpeculation: () => gD(V),
            agentLifecycle: YW6(V),
            teammateColors: AW6(v, V),
            abortController: this.abortController,
            readFileState: this.readFileState,
            nestedMemoryAttachmentTriggers: new Set,
            loadedNestedMemoryPaths: this.loadedNestedMemoryPaths,
            sessionEnvVars: this.sessionEnvVars,
            tmuxSocket: this.tmuxSocket,
            dynamicSkillDirTriggers: new Set,
            discoveredSkillNames: this.discoveredSkillNames,
            discoveredRemoteSkills: this.discoveredRemoteSkills,
            memorySelector: this.memorySelector,
            bashRerunAliases: this.bashRerunAliases,
            setInProgressToolUseIDs: () => {},
            addResponseLength: () => {},
            resetResponseLength: () => {},
            getFileHistoryState: () => v().fileHistory,
            applyFileHistoryOp: (u6) => {
                V((h6) => {
                    let _8 = bX6(h6.fileHistory, u6);
                    if (_8 === h6.fileHistory) return h6;
                    return {
                        ...h6,
                        fileHistory: _8
                    }
                })
            },
            applyAttributionOp: (u6) => {
                V((h6) => {
                    let _8 = gu8(h6.attribution, u6);
                    if (_8 === h6.attribution) return h6;
                    return {
                        ...h6,
                        attribution: _8
                    }
                })
            },
            setSDKStatus: h
        };
        if (C && !this.hasHandledOrphanedPermission) {
            this.hasHandledOrphanedPermission = !0;
            for await (let u6 of Tc4(C, Y, this.mutableMessages, $6)) yield u6
        }
        if (x && !this.hasHandledDeferredToolResume) {
            if (this.hasHandledDeferredToolResume = !0, !rK(Y, x.toolName)) {
                E(`Deferred tool resume: tool '${x.toolName}' is no longer available (MCP server disconnected or tool removed)`, {
                    level: "warn"
                }), yield {
                    type: "result",
                    subtype: "success",
                    is_error: !0,
                    duration_ms: Date.now() - m,
                    duration_api_ms: VW(),
                    num_turns: this.mutableMessages.length,
                    result: "",
                    stop_reason: "tool_deferred_unavailable",
                    session_id: I8(),
                    total_cost_usd: nX(),
                    usage: this.totalUsage,
                    modelUsage: OV(),
                    permission_denials: this.permissionDenials,
                    deferred_tool_use: {
                        id: x.toolUseID,
                        name: x.toolName,
                        input: x.toolInput
                    },
                    fast_mode_state: yE(c, g.fastMode),
                    uuid: Eg()
                };
                return
            }
            let u6;
            for await (let h6 of vc4(x, U, this.mutableMessages, $6)) {
                let _8 = "attachment" in h6 ? h6.attachment : void 0;
                if (_8?.type === "hook_deferred_tool") u6 = _8;
                yield h6
            }
            if (u6) {
                if (B) await HF(this.mutableMessages);
                yield {
                    type: "result",
                    subtype: "success",
                    is_error: !1,
                    duration_ms: Date.now() - m,
                    duration_api_ms: VW(),
                    num_turns: this.mutableMessages.length,
                    result: "",
                    stop_reason: "tool_deferred",
                    session_id: I8(),
                    total_cost_usd: nX(),
                    usage: this.totalUsage,
                    modelUsage: OV(),
                    permission_denials: this.permissionDenials,
                    deferred_tool_use: {
                        id: u6.toolUseID,
                        name: u6.toolName,
                        input: u6.toolInput
                    },
                    fast_mode_state: yE(c, g.fastMode),
                    uuid: Eg()
                };
                return
            }
        }
        let {
            messages: H6,
            shouldQuery: q6,
            allowedTools: o,
            model: _6,
            resultText: r
        } = await At8({
            input: q,
            mode: "prompt",
            setToolJSX: () => {},
            context: {
                ...$6,
                messages: this.mutableMessages
            },
            messages: this.mutableMessages,
            uuid: K?.uuid,
            isMeta: K?.isMeta,
            shouldQuery: K?.shouldQuery,
            querySource: "sdk"
        }), t = q6 && K?.shouldQuery !== !1;
        if (K?.origin) {
            for (let u6 of H6)
                if (u6.type === "user") u6.origin = K.origin
        }
        this.mutableMessages.push(...H6);
        let Y6 = [...this.mutableMessages],
            X6 = 0,
            M6, W6 = Y6.length,
            V6 = (u6 = !1) => {
                let h6 = X6,
                    _8 = Jz8(Y6, Math.max(h6, W6), !u6);
                if (h6 >= _8) return Promise.resolve(null);
                let R8 = h6 === 0 && _8 === Y6.length ? Y6 : Y6.slice(h6, _8);
                X6 = _8;
                let x6 = M6;
                for (let i6 = R8.length - 1; i6 >= 0; i6--) {
                    let v8 = R8[i6];
                    if (GW6(v8) && Jz6(v8)) {
                        M6 = v8.uuid;
                        break
                    }
                }
                return HF(R8, void 0, x6, Y6)
            };
        if (B && H6.length > 0) {
            let u6 = V6();
            if (S9());
            else if (await u6, S6(process.env.CLAUDE_CODE_EAGER_FLUSH) || S6(process.env.CLAUDE_CODE_IS_COWORK)) await mT()
        }
        let f6 = H6.filter((u6) => u6.type === "user" && !u6.isMeta && !u6.toolUseResult && UJ5().selectableUserMessagesFilter(u6) || u6.type === "system" && u6.subtype === "compact_boundary"),
            G6 = k ? f6 : [];
        V((u6) => ({
            ...u6,
            toolPermissionContext: {
                ...u6.toolPermissionContext,
                alwaysAllowRules: {
                    ...u6.toolPermissionContext.alwaysAllowRules,
                    command: o
                }
            }
        }));
        let k6 = _6 ?? c;
        $6 = {
            messages: Y6,
            turnStartIndex: 0,
            setMessages: () => {},
            onChangeAPIKey: () => {},
            onPermissionDenial: F,
            handleElicitation: this.config.handleElicitation,
            onCommandLifecycle: this.config.onCommandLifecycle,
            sessionState: this.config.sessionState,
            options: {
                commands: z,
                debug: !1,
                tools: Y,
                refreshTools: A,
                verbose: w,
                mainLoopModel: k6,
                thinkingConfig: n,
                mcpClients: O,
                mcpResources: {},
                ideInstallationStatus: null,
                isNonInteractiveSession: !0,
                customSystemPrompt: M,
                appendSystemPrompt: P,
                appendSubagentSystemPrompt: W,
                theme: Ad(H8().theme),
                agentDefinitions: {
                    activeAgents: R,
                    allAgents: []
                },
                maxBudgetUsd: H
            },
            getAppState: v,
            setAppState: V,
            setToolPermissionContext: (u6) => V((h6) => {
                let _8 = typeof u6 === "function" ? u6(h6.toolPermissionContext) : u6;
                return h6.toolPermissionContext === _8 ? h6 : {
                    ...h6,
                    toolPermissionContext: _8
                }
            }),
            taskRegistry: Uk(v, V),
            sessionHooksRegistry: OM6(V),
            setClassifierApprovals: qF(V),
            setReplContext: H06(V),
            setWebBrowserSlice: P36(V),
            abortSpeculation: () => gD(V),
            agentLifecycle: YW6(V),
            teammateColors: AW6(v, V),
            abortController: this.abortController,
            readFileState: this.readFileState,
            nestedMemoryAttachmentTriggers: new Set,
            loadedNestedMemoryPaths: this.loadedNestedMemoryPaths,
            sessionEnvVars: this.sessionEnvVars,
            tmuxSocket: this.tmuxSocket,
            dynamicSkillDirTriggers: new Set,
            discoveredSkillNames: this.discoveredSkillNames,
            discoveredRemoteSkills: this.discoveredRemoteSkills,
            memorySelector: this.memorySelector,
            bashRerunAliases: this.bashRerunAliases,
            setInProgressToolUseIDs: () => {},
            addResponseLength: () => {},
            resetResponseLength: () => {},
            getFileHistoryState: $6.getFileHistoryState,
            applyFileHistoryOp: $6.applyFileHistoryOp,
            applyAttributionOp: $6.applyAttributionOp,
            setSDKStatus: h
        }, GM("before_skills_plugins");
        let [T6, {
            enabled: v6,
            errors: L6
        }] = await Promise.all([pH6(b8()), Gj()]);
        if (GM("after_skills_plugins"), yield Qa8({
                tools: Y,
                mcpClients: O,
                model: k6,
                permissionMode: g.toolPermissionContext.mode,
                commands: z,
                agents: R,
                skills: T6,
                plugins: v6,
                pluginErrors: L6.filter(eZ4).map((u6) => ({
                    plugin: u6.source,
                    type: u6.type,
                    message: GH(u6)
                })),
                fastMode: g.fastMode
            }), GM("system_message_yielded"), !t) {
            for (let u6 of H6) {
                if (u6.type === "user" && typeof u6.message.content === "string" && (u6.message.content.includes(`<${l0}>`) || u6.message.content.includes(`<${GA6}>`) || u6.isCompactSummary)) yield {
                    type: "user",
                    message: {
                        ...u6.message,
                        content: MO(u6.message.content)
                    },
                    session_id: I8(),
                    parent_tool_use_id: null,
                    uuid: u6.uuid,
                    timestamp: u6.timestamp,
                    isReplay: !u6.isCompactSummary,
                    isSynthetic: u6.isMeta || u6.isVisibleInTranscriptOnly
                };
                if (u6.type === "system" && u6.subtype === "local_command" && typeof u6.content === "string" && (u6.content.includes(`<${l0}>`) || u6.content.includes(`<${GA6}>`))) yield u$7(u6.content, u6.uuid);
                if (u6.type === "system" && u6.subtype === "compact_boundary") yield {
                    type: "system",
                    subtype: "compact_boundary",
                    session_id: I8(),
                    uuid: u6.uuid,
                    compact_metadata: rr8(u6.compactMetadata)
                }
            }
            if (B) {
                if (await V6(), S6(process.env.CLAUDE_CODE_EAGER_FLUSH) || S6(process.env.CLAUDE_CODE_IS_COWORK)) await mT()
            }
            for (let u6 of K?.shouldQuery === !1 ? G6 : [])
                if (u6.type === "user") {
                    let _8 = K?.uuid && u6.uuid === K.uuid ? K?.fileAttachments : void 0;
                    yield {
                        type: "user",
                        message: u6.message,
                        session_id: I8(),
                        parent_tool_use_id: null,
                        uuid: u6.uuid,
                        timestamp: u6.timestamp,
                        isReplay: !0,
                        ..._8 && _8.length > 0 && {
                            file_attachments: _8
                        },
                        ...u6.origin && {
                            origin: u6.origin
                        }
                    }
                } yield {
                type: "result",
                subtype: "success",
                is_error: !1,
                duration_ms: Date.now() - m,
                duration_api_ms: VW(),
                num_turns: Y6.length - 1,
                result: r ?? "",
                stop_reason: null,
                session_id: I8(),
                total_cost_usd: nX(),
                usage: this.totalUsage,
                modelUsage: OV(),
                permission_denials: this.permissionDenials,
                fast_mode_state: yE(k6, g.fastMode),
                uuid: Eg()
            };
            return
        }
        if (kO() && B) H6.filter(UJ5().selectableUserMessagesFilter).forEach((u6) => {
            IC6($6.getFileHistoryState, $6.applyFileHistoryOp, u6.uuid)
        });
        let y6 = iP,
            c6 = 1,
            Z8 = !1,
            N8, R6, p6 = null,
            q8 = NA6().at(-1),
            L8 = f ? OA7(this.mutableMessages, iW) : 0,
            w8 = {},
            x8;
        for await (let u6 of DXA(yy({
            messages: Y6,
            systemPrompt: O6,
            userContext: e,
            systemContext: A6,
            canUseTool: U,
            toolUseContext: $6,
            fallbackModel: G,
            querySource: "sdk",
            maxTurns: j,
            taskBudget: J,
            stopHookActive: K?.stopHookActive
        }), w8)) {
            if (u6.type === "assistant" || u6.type === "user" || u6.type === "system" && u6.subtype === "compact_boundary") {
                if (u6.type === "assistant" && !S) S = Date.now();
                if (B && u6.type === "system" && u6.subtype === "compact_boundary") {
                    let h6 = u6.compactMetadata?.preservedSegment?.tailUuid;
                    if (h6) {
                        let _8 = this.mutableMessages.findLastIndex((R8) => R8.uuid === h6);
                        if (_8 !== -1) await HF(this.mutableMessages.slice(0, _8 + 1)), X6 = 0, M6 = void 0
                    }
                }
                if (Y6.push(u6), B)
                    if (u6.type === "assistant") V6();
                    else await V6();
                if (!Z8 && G6.length > 0) {
                    Z8 = !0;
                    for (let h6 of G6)
                        if (h6.type === "user") {
                            let R8 = K?.uuid && h6.uuid === K.uuid ? K?.fileAttachments : void 0;
                            yield {
                                type: "user",
                                message: h6.message,
                                session_id: I8(),
                                parent_tool_use_id: null,
                                uuid: h6.uuid,
                                timestamp: h6.timestamp,
                                isReplay: !0,
                                ...R8 && R8.length > 0 && {
                                    file_attachments: R8
                                },
                                ...h6.origin && {
                                    origin: h6.origin
                                }
                            }
                        }
                }
            }
            if (u6.type === "user") c6++;
            switch (u6.type) {
                case "tombstone": {
                    let h6 = Y6.findLastIndex((R8) => R8.uuid === u6.message.uuid);
                    if (h6 !== -1) {
                        if (Y6.splice(h6, 1), X6 > h6) X6--;
                        if (W6 > h6) W6--
                    }
                    let _8 = this.mutableMessages.findLastIndex((R8) => R8.uuid === u6.message.uuid);
                    if (_8 !== -1) this.mutableMessages.splice(_8, 1);
                    break
                }
                case "assistant":
                    if (u6.message.stop_reason != null) p6 = u6.message.stop_reason;
                    this.mutableMessages.push(u6), yield* Cu8(u6);
                    break;
                case "progress":
                    if (this.mutableMessages.push(u6), B) Y6.push(u6), V6();
                    yield* Cu8(u6);
                    break;
                case "user":
                    this.mutableMessages.push(u6), yield* Cu8(u6);
                    break;
                case "stream_event":
                    if (u6.event.type === "message_start") y6 = iP, y6 = t56(y6, u6.event.message.usage);
                    if (u6.event.type === "message_delta") {
                        if (y6 = t56(y6, u6.event.usage), u6.event.delta.stop_reason != null) p6 = u6.event.delta.stop_reason;
                        if (B) V6()
                    }
                    if (u6.event.type === "message_stop") this.totalUsage = Zx8(this.totalUsage, y6);
                    if (N) yield {
                        type: "stream_event",
                        event: u6.event,
                        session_id: I8(),
                        parent_tool_use_id: null,
                        uuid: Eg(),
                        ...u6.ttftMs !== void 0 && {
                            ttft_ms: u6.ttftMs
                        }
                    };
                    break;
                case "attachment":
                    if (this.mutableMessages.push(u6), B) Y6.push(u6), V6();
                    if (u6.attachment.type === "relevant_memories") {
                        let h6 = FJ5(u6.attachment.memories);
                        if (h6) yield h6
                    } else if (u6.attachment.type === "structured_output") N8 = u6.attachment.data;
                    else if (u6.attachment.type === "hook_deferred_tool") R6 = {
                        id: u6.attachment.toolUseID,
                        name: u6.attachment.toolName,
                        input: u6.attachment.toolInput
                    };
                    else if (u6.attachment.type === "max_turns_reached") {
                        x8 = {
                            turnCount: u6.attachment.turnCount,
                            maxTurns: u6.attachment.maxTurns
                        };
                        continue
                    } else if (k && u6.attachment.type === "queued_command") {
                        let h6 = u6.attachment;
                        yield {
                            type: "user",
                            message: {
                                role: "user",
                                content: h6.prompt
                            },
                            session_id: I8(),
                            parent_tool_use_id: null,
                            uuid: h6.source_uuid || u6.uuid,
                            timestamp: u6.timestamp,
                            isReplay: !0,
                            ...h6.fileAttachments?.length && {
                                file_attachments: h6.fileAttachments
                            },
                            ...h6.origin && {
                                origin: h6.origin
                            }
                        }
                    }
                    break;
                case "stream_request_start":
                    if (N) yield {
                        type: "system",
                        subtype: "status",
                        status: "requesting",
                        uuid: Eg(),
                        session_id: I8()
                    };
                    break;
                case "system": {
                    if (this.mutableMessages.push(u6), u6.subtype === "compact_boundary" && u6.compactMetadata) {
                        let h6 = this.mutableMessages.length - 1;
                        if (h6 > 0) this.mutableMessages.splice(0, h6);
                        let _8 = Y6.length - 1;
                        if (_8 > 0) Y6.splice(0, _8), X6 = Y6.length, W6 = Y6.length;
                        yield {
                            type: "system",
                            subtype: "compact_boundary",
                            session_id: I8(),
                            uuid: u6.uuid,
                            compact_metadata: rr8(u6.compactMetadata)
                        }
                    }
                    if (u6.subtype === "api_error") yield {
                        type: "system",
                        subtype: "api_retry",
                        attempt: u6.retryAttempt,
                        max_retries: u6.maxRetries,
                        retry_delay_ms: u6.retryInMs,
                        error_status: u6.error.status ?? null,
                        error: FM4(u6.error),
                        session_id: I8(),
                        uuid: u6.uuid
                    };
                    break
                }
                case "tool_use_summary":
                    yield {
                        type: "tool_use_summary", summary: u6.summary, preceding_tool_use_ids: u6.precedingToolUseIds, session_id: I8(), uuid: u6.uuid
                    };
                    break
            }
            if (H !== void 0 && nX() >= H) {
                if (B) {
                    if (await V6(!0), S6(process.env.CLAUDE_CODE_EAGER_FLUSH) || S6(process.env.CLAUDE_CODE_IS_COWORK)) await mT()
                }
                yield {
                    type: "result",
                    subtype: "error_max_budget_usd",
                    duration_ms: Date.now() - m,
                    duration_api_ms: VW(),
                    is_error: !0,
                    num_turns: c6,
                    stop_reason: p6,
                    session_id: I8(),
                    total_cost_usd: nX(),
                    usage: this.totalUsage,
                    modelUsage: OV(),
                    permission_denials: this.permissionDenials,
                    fast_mode_state: yE(k6, g.fastMode),
                    uuid: Eg(),
                    errors: [`Reached maximum budget ($${H})`]
                };
                return
            }
            if (u6.type === "user" && f) {
                let _8 = OA7(this.mutableMessages, iW) - L8,
                    R8 = parseInt(process.env.MAX_STRUCTURED_OUTPUT_RETRIES || "5", 10);
                if (_8 >= R8 && N8 === void 0) {
                    if (B) {
                        if (await V6(!0), S6(process.env.CLAUDE_CODE_EAGER_FLUSH) || S6(process.env.CLAUDE_CODE_IS_COWORK)) await mT()
                    }
                    yield {
                        type: "result",
                        subtype: "error_max_structured_output_retries",
                        duration_ms: Date.now() - m,
                        duration_api_ms: VW(),
                        is_error: !0,
                        num_turns: c6,
                        stop_reason: p6,
                        session_id: I8(),
                        total_cost_usd: nX(),
                        usage: this.totalUsage,
                        modelUsage: OV(),
                        permission_denials: this.permissionDenials,
                        fast_mode_state: yE(k6, g.fastMode),
                        uuid: Eg(),
                        errors: [`Failed to provide valid structured output after ${R8} attempts`]
                    };
                    return
                }
            }
        }
        let a6 = Y6.findLast((u6) => u6.type === "assistant" || u6.type === "user"),
            D8 = a6?.type ?? "undefined",
            Q6 = a6?.type === "assistant" ? pI(a6.message.content)?.type ?? "none" : "n/a";
        if (B) {
            if (await V6(!0), S6(process.env.CLAUDE_CODE_EAGER_FLUSH) || S6(process.env.CLAUDE_CODE_IS_COWORK)) await mT()
        }
        if (R6) {
            yield {
                type: "result",
                subtype: "success",
                is_error: !1,
                duration_ms: Date.now() - m,
                duration_api_ms: VW(),
                num_turns: c6,
                result: "",
                stop_reason: "tool_deferred",
                session_id: I8(),
                total_cost_usd: nX(),
                usage: this.totalUsage,
                modelUsage: OV(),
                permission_denials: this.permissionDenials,
                deferred_tool_use: R6,
                terminal_reason: w8.value?.reason,
                fast_mode_state: yE(k6, g.fastMode),
                uuid: Eg()
            };
            return
        }
        if (x8) {
            yield {
                type: "result",
                subtype: "error_max_turns",
                duration_ms: Date.now() - m,
                duration_api_ms: VW(),
                is_error: !0,
                num_turns: x8.turnCount,
                stop_reason: p6,
                session_id: I8(),
                total_cost_usd: nX(),
                usage: this.totalUsage,
                modelUsage: OV(),
                permission_denials: this.permissionDenials,
                terminal_reason: w8.value?.reason,
                fast_mode_state: yE(k6, g.fastMode),
                uuid: Eg(),
                errors: [`Reached maximum number of turns (${x8.maxTurns})`]
            };
            return
        }
        if (!Gc4(a6, p6)) {
            yield {
                type: "result",
                subtype: "error_during_execution",
                duration_ms: Date.now() - m,
                duration_api_ms: VW(),
                is_error: !0,
                num_turns: c6,
                stop_reason: p6,
                session_id: I8(),
                total_cost_usd: nX(),
                usage: this.totalUsage,
                modelUsage: OV(),
                permission_denials: this.permissionDenials,
                terminal_reason: w8.value?.reason,
                fast_mode_state: yE(k6, g.fastMode),
                uuid: Eg(),
                errors: (() => {
                    let u6 = NA6(),
                        h6 = q8 ? u6.lastIndexOf(q8) + 1 : 0;
                    return [`[ede_diagnostic] result_type=${D8} last_content_type=${Q6} stop_reason=${p6}`, ...u6.slice(h6).map((_8) => _8.error)]
                })()
            };
            return
        }
        let W8 = "",
            G8 = !1,
            s6 = null;
        if (a6.type === "assistant") {
            let u6 = pI(a6.message.content);
            if (u6?.type === "text" && !SK6.has(u6.text)) W8 = u6.text;
            G8 = Boolean(a6.isApiErrorMessage), s6 = a6.apiErrorStatus ?? null
        }
        if (!G8 && S) d("tengu_sdk_ttft", {
            ttft_ms: S - m,
            model: String(k6)
        });
        yield {
            type: "result",
            subtype: "success",
            is_error: G8,
            api_error_status: s6,
            duration_ms: Date.now() - m,
            duration_api_ms: VW(),
            num_turns: c6,
            result: W8,
            stop_reason: p6,
            session_id: I8(),
            total_cost_usd: nX(),
            usage: this.totalUsage,
            modelUsage: OV(),
            permission_denials: this.permissionDenials,
            structured_output: N8,
            terminal_reason: w8.value?.reason,
            fast_mode_state: yE(k6, g.fastMode),
            uuid: Eg()
        }
    }
    interrupt() {
        this.abortController.abort()
    }
    getMessages() {
        return this.mutableMessages
    }
    getReadFileState() {
        return this.readFileState
    }
    getSessionId() {
        return I8()
    }
    setModel(q) {
        this.config.userSpecifiedModel = q
    }
}
// @from(Ln 567906, Col 0)
async function* dJ5({
    commands: q,
    prompt: K,
    promptUuid: _,
    isMeta: z,
    shouldQuery: Y,
    stopHookActive: A,
    fileAttachments: O,
    origin: w,
    cwd: $,
    tools: j,
    refreshTools: H,
    mcpClients: J,
    verbose: X = !1,
    thinkingConfig: M,
    maxTurns: P,
    maxBudgetUsd: W,
    taskBudget: D,
    canUseTool: Z,
    mutableMessages: G = [],
    getReadFileCache: f,
    setReadFileCache: v,
    sessionEnvVars: V,
    tmuxSocket: k,
    customSystemPrompt: N,
    appendSystemPrompt: R,
    appendSubagentSystemPrompt: h,
    excludeDynamicSections: C,
    userSpecifiedModel: x,
    fallbackModel: B,
    jsonSchema: m,
    getAppState: S,
    setAppState: F,
    abortController: U,
    replayUserMessages: g = !1,
    includePartialMessages: c = !1,
    handleElicitation: n,
    onCommandLifecycle: l,
    sessionState: z6,
    agents: A6 = [],
    setSDKStatus: e,
    orphanedPermission: i,
    deferredToolUse: O6
}) {
    let J6 = new QJ5({
        cwd: $,
        tools: j,
        refreshTools: H,
        commands: q,
        mcpClients: J,
        agents: A6,
        canUseTool: Z,
        getAppState: S,
        setAppState: F,
        initialMessages: G,
        readFileCache: Cs(f()),
        sessionEnvVars: V,
        tmuxSocket: k,
        customSystemPrompt: N,
        appendSystemPrompt: R,
        appendSubagentSystemPrompt: h,
        excludeDynamicSections: C,
        userSpecifiedModel: x,
        fallbackModel: B,
        thinkingConfig: M,
        maxTurns: P,
        maxBudgetUsd: W,
        taskBudget: D,
        jsonSchema: m,
        verbose: X,
        handleElicitation: n,
        onCommandLifecycle: l,
        sessionState: z6,
        replayUserMessages: g,
        includePartialMessages: c,
        setSDKStatus: e,
        abortController: U,
        orphanedPermission: i,
        deferredToolUse: O6,
        ...{}
    });
    try {
        yield* J6.submitMessage(K, {
            uuid: _,
            isMeta: z,
            shouldQuery: Y,
            stopHookActive: A,
            fileAttachments: O,
            origin: w
        })
    } finally {
        v(J6.getReadFileState())
    }
}
// @from(Ln 568000, Col 0)
async function* DXA(q, K) {
    K.value = yield* q
}
// @from(Ln 568003, Col 4)
UJ5 = () => (aa8(), B7(Cq5))
// @from(Ln 568004, Col 4)
WXA = () => ({})
// @from(Ln 568005, Col 4)
cJ5 = L(() => {
    Kt6();
    y8();
    O2();
    R18();
    CA();
    rA();
    Tx();
    mN();
    sy6();
    VY();
    s56();
    C8();
    rv();
    gq();
    hR6();
    td();
    x$();
    _u6();
    sR();
    h1();
    n7();
    K8();
    Q8();
    zf();
    cy();
    FP();
    a18();
    Ha8();
    ty();
    U8();
    _7();
    Sq();
    vH();
    RP7();
    J07();
    $G();
    g4();
    zu6();
    bc();
    NR();
    jt();
    Ju6();
    gJ5();
    fX7();
    Sz();
    f78()
})
// @from(Ln 568053, Col 4)
lJ5 = L(() => {
    C8();
    sF8();
    n7();
    m8();
    U8();
    ox();
    $n1()
})
// @from(Ln 568063, Col 0)
function nJ5(q) {
    let K = process.env.CLAUDE_CODE_EXIT_AFTER_STOP_DELAY,
        _ = K ? parseInt(K, 10) : null,
        z = _ && !isNaN(_) && _ > 0,
        Y = null,
        A = 0;
    return {
        start() {
            if (Y) clearTimeout(Y), Y = null;
            if (z) A = Date.now(), Y = setTimeout(() => {
                let O = Date.now() - A;
                if (q() && O >= _) E(`Exiting after ${_}ms of idle time`), j5()
            }, _)
        },
        stop() {
            if (Y) clearTimeout(Y), Y = null
        }
    }
}
// @from(Ln 568082, Col 4)
iJ5 = L(() => {
    K8();
    CY()
})
// @from(Ln 568090, Col 0)
function X07(q) {
    if (q.toLowerCase().endsWith(".jsonl")) return {
        sessionId: rJ5(),
        ingressUrl: null,
        isUrl: !1,
        jsonlFile: q,
        isJsonlFile: !0
    };
    if (sp(q)) return {
        sessionId: q,
        ingressUrl: null,
        isUrl: !1,
        jsonlFile: null,
        isJsonlFile: !1
    };
    try {
        let K = new URL(q);
        return {
            sessionId: rJ5(),
            ingressUrl: K.href,
            isUrl: !0,
            jsonlFile: null,
            isJsonlFile: !1
        }
    } catch {}
    return null
}
// @from(Ln 568117, Col 4)
oJ5 = L(() => {
    dc()
})
// @from(Ln 568126, Col 0)
async function ZXA() {
    try {
        let q = await aJ5(qd1(), "utf-8"),
            K = zG6().safeParse(n8(q));
        if (!K.success) return E(`Invalid known_marketplaces.json in zip cache: ${K.error.message}`, {
            level: "error"
        }), {};
        return K.data
    } catch {
        return {}
    }
}
// @from(Ln 568138, Col 0)
async function fXA(q) {
    await QS8(qd1(), I6(q, null, 2))
}
// @from(Ln 568141, Col 0)
async function GXA(q, K) {
    let _ = D68();
    if (!_) return;
    let z = await vXA(K);
    if (z !== null) {
        let Y = XG4(q);
        await QS8(M07(_, Y), z)
    }
}
// @from(Ln 568150, Col 0)
async function vXA(q) {
    let K = [M07(q, ".claude-plugin", "marketplace.json"), M07(q, "marketplace.json"), q];
    for (let _ of K) try {
        return await aJ5(_, "utf-8")
    } catch {}
    return null
}
// @from(Ln 568157, Col 0)
async function sJ5() {
    let q = await O56();
    for (let [z, Y] of Object.entries(q)) {
        if (!Y.installLocation) continue;
        try {
            await GXA(z, Y.installLocation)
        } catch (A) {
            E(`Failed to save marketplace JSON for ${z}: ${A}`)
        }
    }
    let _ = {
        ...await ZXA(),
        ...q
    };
    await fXA(_)
}
// @from(Ln 568173, Col 4)
tJ5 = L(() => {
    K8();
    e8();
    m$();
    Hv();
    EL6()
})
// @from(Ln 568180, Col 0)
async function eJ5(q) {
    let K = wx();
    E(`installPluginsForHeadless: starting${K?" (zip cache mode)":""}`);
    let _ = await yc8();
    if (_) J_6(), bk("headlessPluginInstall: seed marketplaces registered");
    if (K) await V8().mkdir($G4()), await V8().mkdir(jG4());
    let z = Object.keys(X_6()).length,
        Y = {
            marketplaces_installed: 0,
            delisted_count: 0
        },
        A = _;
    try {
        if (z === 0) E("installPluginsForHeadless: no marketplaces declared");
        else {
            let w = await Rf6("headless_marketplace_reconcile", () => bt8({
                skip: K ? (j, H) => !MG4(H) : void 0,
                onProgress: (j) => {
                    if (j.type === "installed") q?.({
                        status: "installed",
                        name: j.name
                    }), E(`installPluginsForHeadless: installed marketplace ${j.name}`);
                    else if (j.type === "failed") q?.({
                        status: "failed",
                        name: j.name,
                        error: j.error
                    }), E(`installPluginsForHeadless: failed to install marketplace ${j.name}: ${j.error}`)
                }
            }), (j) => ({
                installed_count: j.installed.length,
                updated_count: j.updated.length,
                failed_count: j.failed.length,
                skipped_count: j.skipped.length
            }));
            if (w.skipped.length > 0) E(`installPluginsForHeadless: skipped ${w.skipped.length} marketplace(s) unsupported by zip cache: ${w.skipped.join(", ")}`);
            let $ = w.installed.length + w.updated.length;
            if ($ > 0) J_6(), bk("headlessPluginInstall: marketplaces reconciled"), A = !0;
            Y.marketplaces_installed = $
        }
        if (K) await sJ5();
        let O = await jt8();
        if (Y.delisted_count = O.length, O.length > 0) A = !0;
        if (A) bk("headlessPluginInstall: plugins changed");
        if (K) eq(HG4);
        return A
    } catch (O) {
        return j6(O), !1
    } finally {
        d("tengu_headless_plugin_install", Y)
    }
}
// @from(Ln 568231, Col 4)
qX5 = L(() => {
    C8();
    R9();
    K8();
    VA();
    Yq();
    U8();
    m$();
    CP7();
    vH();
    AW7();
    EL6();
    tJ5()
})
// @from(Ln 568245, Col 4)
vX5 = {}
// @from(Ln 568274, Col 0)
function yXA(q) {
    if (He8.has(q)) return !1;
    if (He8.add(q), je8.push(q), je8.length > AX5) {
        let K = je8.splice(0, je8.length - AX5);
        for (let _ of K) He8.delete(_)
    }
    return !0
}
// @from(Ln 568283, Col 0)
function OX5(q) {
    let K = q?.[LXA];
    if (K == null || typeof K !== "object") return;
    let _ = K,
        z = (Y) => typeof _[Y] === "string" ? _[Y] : void 0;
    return {
        title: z("title"),
        displayName: z("displayName"),
        description: z("description")
    }
}
// @from(Ln 568295, Col 0)
function hXA(q) {
    return typeof q === "string" ? [{
        type: "text",
        text: q
    }] : q
}
// @from(Ln 568302, Col 0)
function $X5(q) {
    let K = {
        needsRefresh: !1
    };
    return q().then((_) => {
        K.needsRefresh = _
    }).catch(j6), K
}
// @from(Ln 568311, Col 0)
function jX5(q) {
    if (q.length === 1) return q[0];
    if (q.every((K) => typeof K === "string")) return q.join(`
`);
    return q.flatMap(hXA)
}
// @from(Ln 568318, Col 0)
function HX5(q, K) {
    return K !== void 0 && K.mode === "prompt" && K.workload === q.workload && K.isMeta === q.isMeta && K.shouldQuery === q.shouldQuery && RXA(q.origin, K.origin)
}
// @from(Ln 568322, Col 0)
function RXA(q, K) {
    if (q === K) return !0;
    if (!q || !K) return !1;
    if (q.kind !== K.kind) return !1;
    if (q.kind === "peer" && K.kind === "peer") return q.from === K.from;
    if (q.kind === "channel" && K.kind === "channel") return q.server === K.server;
    return !0
}
// @from(Ln 568330, Col 0)
async function SXA(q, K, _, z, Y, A, O, w) {
    if (_y.subscribe((C) => {
            if (ku8(C, _), q5()) _((x) => {
                let B = x.settings,
                    m = B.fastMode === !0 && !B.fastModePerSessionOptIn;
                return {
                    ...x,
                    fastMode: m
                }
            })
        }), typeof Bun < "u") setInterval(Bun.gc, 1000).unref();
    if (ir1(), GM("runHeadless_entry"), d("tengu_timer", {
            event: "startup",
            durationMs: Math.round(process.uptime() * 1000)
        }), await uR6()) await cd4();
    if (GM("after_grove_check"), DI().catch((C) => j6(r1(C))), w.resumeSessionAt && !w.resume) {
        process.stderr.write(`Error: --resume-session-at requires --resume
`), j5(1);
        return
    }
    if (w.rewindFiles && !w.resume) {
        process.stderr.write(`Error: --rewind-files requires --resume
`), j5(1);
        return
    }
    if (w.rewindFiles && q) {
        process.stderr.write(`Error: --rewind-files is a standalone operation and cannot be used with a prompt
`), j5(1);
        return
    }
    w81(typeof q !== "string");
    let $ = mXA(q, w);
    if (S6(process.env.CLAUDE_CODE_SDK_HAS_OAUTH_REFRESH) && dR1.has(process.env.CLAUDE_CODE_ENTRYPOINT ?? "")) s61(() => $.requestOAuthTokenRefresh());
    if (w.outputFormat === "stream-json") xJ5();
    let j = Z7.getSandboxUnavailableReason();
    if (j) {
        if (Z7.isSandboxRequired()) {
            if (w.outputFormat === "stream-json") await $.write({
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
                errors: [`Sandbox required but unavailable: ${j}. Set sandbox.failIfUnavailable=false to allow unsandboxed execution.`]
            });
            process.stderr.write(`
Error: sandbox required but unavailable: ${j}
` + `  sandbox.failIfUnavailable is set — refusing to start without a working sandbox.

`), j5(1);
            return
        }
        process.stderr.write(`
⚠ Sandbox disabled: ${j}
  Commands will run WITHOUT sandboxing. Network and filesystem restrictions will NOT be enforced.

`)
    } else if (Z7.isSandboxingEnabled()) try {
        await Z7.initialize($.createSandboxAskCallback())
    } catch (C) {
        process.stderr.write(`
❌ Sandbox Error: ${b6(C)}
`), j5(1, "other");
        return
    }
    if (w.outputFormat === "stream-json" && w.verbose) DC4((C) => {
        let x = (() => {
            switch (C.type) {
                case "started":
                    return {
                        type: "system", subtype: "hook_started", hook_id: C.hookId, hook_name: C.hookName, hook_event: C.hookEvent, uuid: gX(), session_id: I8()
                    };
                case "progress":
                    return {
                        type: "system", subtype: "hook_progress", hook_id: C.hookId, hook_name: C.hookName, hook_event: C.hookEvent, stdout: C.stdout, stderr: C.stderr, output: C.output, uuid: gX(), session_id: I8()
                    };
                case "response":
                    return {
                        type: "system", subtype: "hook_response", hook_id: C.hookId, hook_name: C.hookName, hook_event: C.hookEvent, output: C.output, stdout: C.stdout, stderr: C.stderr, exit_code: C.exitCode, outcome: C.outcome, uuid: gX(), session_id: I8()
                    }
            }
        })();
        $.write(x)
    });
    if (w.setupTrigger) await F66({
        kind: "setup",
        trigger: w.setupTrigger
    });
    GM("before_loadInitialMessages");
    let H = K(),
        {
            messages: J,
            turnInterruptionState: X,
            deferredToolUse: M,
            agentSetting: P
        } = await DX5(_, {
            continue: w.continue,
            teleport: w.teleport,
            resume: w.resume,
            resumeSessionAt: w.resumeSessionAt,
            forkSession: w.forkSession,
            outputFormat: w.outputFormat,
            sessionStartHooksPromise: w.sessionStartHooksPromise,
            restoredWorkerState: $.restoredWorkerState
        }),
        W = nb4();
    if (W) $.prependUserMessage(W);
    if (!w.agent && !lg() && P) {
        let {
            agentDefinition: C
        } = _06(P, void 0, {
            activeAgents: O,
            allAgents: O
        });
        if (C) {
            if (_((x) => ({
                    ...x,
                    agent: C.agentType
                })), !w.systemPrompt && !Vj(C)) {
                let x = C.getSystemPrompt();
                if (x) w.systemPrompt = x
            }
            Mz8(C.agentType)
        }
    }
    if (J.length === 0 && process.exitCode !== void 0) return;
    if (w.rewindFiles) {
        let C = J.find((m) => m.uuid === w.rewindFiles);
        if (!C || C.type !== "user") {
            process.stderr.write(`Error: --rewind-files requires a user message UUID, but ${w.rewindFiles} is not a user message in this session
`), j5(1);
            return
        }
        let x = K(),
            B = await PX5(w.rewindFiles, x, !1);
        if (!B.canRewind) {
            process.stderr.write(`Error: ${B.error||"Unexpected error"}
`), j5(1);
            return
        }
        process.stdout.write(`Files rewound to state at message ${w.rewindFiles}
`), j5(0);
        return
    }
    let D = typeof w.resume === "string" && w.resume.trim().length > 0,
        Z = Boolean(w.sdkUrl);
    if (!q && !Z && !M && !W) {
        process.stderr.write(D || w.continue ? `Error: No deferred tool marker found in the resumed session. Either the session was not deferred, the marker is stale (tool already ran), or it exceeds the tail-scan window. Provide a prompt to continue the conversation.
` : `Error: Input must be provided either through stdin or as a prompt argument when using --print
`), j5(1);
        return
    }
    if (w.outputFormat === "stream-json" && !w.verbose) {
        process.stderr.write(`Error: When using --print, --output-format=stream-json requires --verbose
`), j5(1);
        return
    }
    let G = s96(H.mcp.tools, H.toolPermissionContext),
        f = [...Y, ...G],
        v = w.sdkUrl ? "stdio" : w.permissionPromptToolName,
        k = MX5(v, $, () => K().mcp.tools, (C) => {
            $.sessionState.notifyStateChanged("requires_action", C)
        });
    if (w.permissionPromptToolName) f = f.filter((C) => !e3(C, w.permissionPromptToolName));
    J71(), GM("after_loadInitialMessages"), await YZ8(), GM("after_modelStrings");
    let N = w.outputFormat === "json" && w.verbose,
        R = [],
        h;
    GM("before_runHeadlessStreaming");
    for await (let C of CXA($, H.mcp.clients, [...z, ...H.mcp.commands], f, J, k, A, K, _, O, w, X, M)) {
        if (w.outputFormat === "stream-json" && w.verbose) await $.write(C);
        if (C.type !== "control_response" && C.type !== "control_request" && C.type !== "control_cancel_request" && !(C.type === "system" && (C.subtype === "session_state_changed" || C.subtype === "task_notification" || C.subtype === "task_started" || C.subtype === "task_updated" || C.subtype === "task_progress" || C.subtype === "notification" || C.subtype === "post_turn_summary")) && C.type !== "stream_event" && C.type !== "keep_alive" && C.type !== "prompt_suggestion" && C.type !== "transcript_mirror") {
            if (N) R.push(C);
            h = C
        }
    }
    switch (w.outputFormat) {
        case "json":
            if (!h || h.type !== "result") throw Error("No messages returned");
            if (w.verbose) {
                f4(I6(R) + `
`);
                break
            }
            f4(I6(h) + `
`);
            break;
        case "stream-json":
            break;
        default:
            if (!h || h.type !== "result") throw Error("No messages returned");
            switch (h.subtype) {
                case "success":
                    f4(h.result.endsWith(`
`) ? h.result : h.result + `
`);
                    break;
                case "error_during_execution":
                    f4("Execution error");
                    break;
                case "error_max_turns":
                    f4(`Error: Reached max turns (${w.maxTurns})`);
                    break;
                case "error_max_budget_usd":
                    f4(`Error: Exceeded USD budget (${w.maxBudgetUsd})`);
                    break;
                case "error_max_structured_output_retries":
                    f4("Error: Failed to provide valid structured output after maximum retries")
            }
    }
    if (rr1(), Lk8()) await EXA.drainPendingExtraction();
    j5(h?.type === "result" && h?.is_error ? 1 : 0)
}