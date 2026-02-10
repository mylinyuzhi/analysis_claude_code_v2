
// @from(Ln 462141, Col 0)
class NMq {
    config;
    mutableMessages;
    abortController;
    permissionDenials;
    totalUsage;
    hasHandledOrphanedPermission = !1;
    constructor(A) {
        this.config = A, this.mutableMessages = A.initialMessages ?? [], this.abortController = A.abortController ?? Aq(), this.permissionDenials = [], this.totalUsage = LN
    }
    async * submitMessage(A, q) {
        let {
            cwd: K,
            commands: Y,
            tools: z,
            mcpClients: w,
            verbose: H = !1,
            maxThinkingTokens: $,
            maxTurns: O,
            maxBudgetUsd: _,
            canUseTool: J,
            customSystemPrompt: X,
            appendSystemPrompt: D,
            userSpecifiedModel: j,
            fallbackModel: M,
            jsonSchema: P,
            getAppState: W,
            setAppState: G,
            replayUserMessages: f = !1,
            includePartialMessages: Z = !1,
            agents: N = [],
            setSDKStatus: T,
            orphanedPermission: k
        } = this.config;
        lZ(K);
        let y = !qk(),
            B = Date.now(),
            S = async (q6, p1, K6, j6, M6, N6) => {
                let F6 = await J(q6, p1, K6, j6, M6, N6);
                if (F6.behavior !== "allow") this.permissionDenials.push({
                    tool_name: q6.name,
                    tool_use_id: M6,
                    tool_input: p1
                });
                return F6
            }, m = await W(), b = j ? t9(j) : l3(), [g, U, x] = await Promise.all([dZ(z, b, Array.from(m.toolPermissionContext.additionalWorkingDirectories.keys()), w), i$(), typeof X === "string" ? Promise.resolve({}) : l$()]), p = {
                ...U,
                ...vJz(w)
            }, l = [...typeof X === "string" ? [X] : g, ...D ? [D] : []], r = z.some((q6) => q6.name === cD);
        if (P && r) DJ6(G, U6());
        let s = {
            messages: this.mutableMessages,
            setMessages: () => {},
            onChangeAPIKey: () => {},
            options: {
                commands: Y,
                debug: !1,
                tools: z,
                verbose: H,
                mainLoopModel: b,
                maxThinkingTokens: $ ?? 0,
                mcpClients: w,
                mcpResources: {},
                ideInstallationStatus: null,
                isNonInteractiveSession: !0,
                customSystemPrompt: X,
                appendSystemPrompt: D,
                agentDefinitions: {
                    activeAgents: N,
                    allAgents: []
                },
                theme: f6().theme,
                maxBudgetUsd: _
            },
            getAppState: W,
            setAppState: G,
            abortController: this.abortController,
            readFileState: A91(this.mutableMessages, K),
            setInProgressToolUseIDs: () => {},
            setResponseLength: () => {},
            updateFileHistoryState: (q6) => {
                G((p1) => ({
                    ...p1,
                    fileHistory: q6(p1.fileHistory)
                }))
            },
            updateAttributionState: (q6) => {
                G((p1) => ({
                    ...p1,
                    attribution: q6(p1.attribution)
                }))
            },
            setSDKStatus: T
        };
        if (k && !this.hasHandledOrphanedPermission) {
            this.hasHandledOrphanedPermission = !0;
            for await (let q6 of W6q(k, z, this.mutableMessages, s)) yield q6
        }
        let {
            messages: O1,
            shouldQuery: T1,
            allowedTools: N1,
            maxThinkingTokens: j1,
            model: q1,
            resultText: t
        } = await Vv6({
            input: A,
            mode: "prompt",
            setIsLoading: () => {},
            setToolJSX: () => {},
            context: {
                ...s,
                messages: this.mutableMessages
            },
            messages: this.mutableMessages,
            uuid: q?.uuid,
            querySource: "sdk"
        });
        this.mutableMessages.push(...O1);
        let J1 = $ ?? j1 ?? 0,
            D1 = [...this.mutableMessages],
            Z1 = O1.filter((q6) => q6.type === "user" && !q6.isMeta && !q6.toolUseResult || q6.type === "system" && q6.subtype === "compact_boundary"),
            E1 = f ? Z1 : [];
        G((q6) => ({
            ...q6,
            toolPermissionContext: {
                ...q6.toolPermissionContext,
                alwaysAllowRules: {
                    ...q6.toolPermissionContext.alwaysAllowRules,
                    command: N1
                }
            }
        }));
        let a = q1 ?? b,
            A1 = A91(D1, K),
            M1 = yj1(A1, s.readFileState);
        s = {
            messages: D1,
            setMessages: () => {},
            onChangeAPIKey: () => {},
            options: {
                commands: Y,
                debug: !1,
                tools: z,
                verbose: H,
                mainLoopModel: a,
                maxThinkingTokens: J1,
                mcpClients: w,
                mcpResources: {},
                ideInstallationStatus: null,
                isNonInteractiveSession: !0,
                customSystemPrompt: X,
                appendSystemPrompt: D,
                theme: f6().theme,
                agentDefinitions: {
                    activeAgents: N,
                    allAgents: []
                },
                maxBudgetUsd: _
            },
            getAppState: W,
            setAppState: G,
            abortController: this.abortController,
            readFileState: M1,
            setInProgressToolUseIDs: () => {},
            setResponseLength: () => {},
            updateFileHistoryState: s.updateFileHistoryState,
            updateAttributionState: s.updateAttributionState,
            setSDKStatus: T
        };
        let Y1 = C8()?.outputStyle ?? Wj,
            [_1, {
                enabled: $1
            }] = await Promise.all([aO6(h6()), iY()]),
            G1 = {
                type: "system",
                subtype: "init",
                cwd: K,
                session_id: U6(),
                tools: z.map((q6) => q6.name),
                mcp_servers: w.map((q6) => ({
                    name: q6.name,
                    status: q6.type
                })),
                model: a,
                permissionMode: m.toolPermissionContext.mode,
                slash_commands: Y.map((q6) => q6.name),
                apiKeySource: yO().source,
                betas: FP(),
                claude_code_version: {
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.38",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-02-10T00:04:56Z"
                }.VERSION,
                output_style: Y1,
                agents: N.map((q6) => q6.agentType),
                skills: _1.map((q6) => q6.name),
                plugins: $1.map((q6) => ({
                    name: q6.name,
                    path: q6.path
                })),
                uuid: Y11()
            },
            L1 = i4() && m.fastMode && x$(a),
            x1 = "off";
        if (L1 && Kv()) x1 = "cooldown";
        else if (L1) x1 = "on";
        if (G1.fast_mode_state = x1, yield G1, t51("system_message_yielded"), !T1) {
            for (let q6 of Z1) {
                if (q6.type === "user" && typeof q6.message.content === "string" && (q6.message.content.includes(`<${Pw1}>`) || q6.message.content.includes(`<${ao1}>`) || q6.isCompactSummary)) D1.push(q6), yield {
                    type: "user",
                    message: {
                        ...q6.message,
                        content: JH(q6.message.content)
                    },
                    session_id: U6(),
                    parent_tool_use_id: null,
                    uuid: q6.uuid,
                    isReplay: !q6.isCompactSummary
                };
                if (q6.type === "system" && q6.subtype === "compact_boundary") D1.push(q6), yield {
                    type: "system",
                    subtype: "compact_boundary",
                    session_id: U6(),
                    uuid: q6.uuid,
                    compact_metadata: {
                        trigger: q6.compactMetadata.trigger,
                        pre_tokens: q6.compactMetadata.preTokens
                    }
                }
            }
            if (y) {
                if (await bI(D1), J6(process.env.CLAUDE_CODE_EAGER_FLUSH) || J6(process.env.CLAUDE_CODE_IS_COWORK)) await e91()
            }
            yield {
                type: "result",
                subtype: "success",
                is_error: !1,
                duration_ms: Date.now() - B,
                duration_api_ms: wT(),
                num_turns: D1.length - 1,
                result: t ?? "",
                stop_reason: null,
                session_id: U6(),
                total_cost_usd: W0(),
                usage: LN,
                modelUsage: ty(),
                permission_denials: this.permissionDenials,
                uuid: Y11()
            };
            return
        }
        if (z2() && y) O1.filter(Zc1).forEach((q6) => {
            WW1((p1) => {
                G((K6) => ({
                    ...K6,
                    fileHistory: p1(K6.fileHistory)
                }))
            }, q6.uuid)
        });
        let f1 = LN,
            R1 = 1,
            H1 = !1,
            y1, B1 = null,
            A6 = P ? lmA(this.mutableMessages, cD) : 0;
        for await (let q6 of ZR({
            messages: D1,
            systemPrompt: l,
            userContext: p,
            systemContext: x,
            canUseTool: S,
            toolUseContext: s,
            fallbackModel: M,
            querySource: "sdk",
            maxTurns: O
        })) {
            if (q6.type === "assistant" || q6.type === "user" || q6.type === "system" && q6.subtype === "compact_boundary") {
                if (D1.push(q6), y) await bI(D1);
                if (!H1 && E1.length > 0) {
                    H1 = !0;
                    for (let p1 of E1)
                        if (p1.type === "user") yield {
                            type: "user",
                            message: p1.message,
                            session_id: U6(),
                            parent_tool_use_id: null,
                            uuid: p1.uuid,
                            isReplay: !0
                        }
                }
            }
            if (q6.type === "user") R1++;
            switch (q6.type) {
                case "tombstone":
                    break;
                case "assistant":
                    B1 = q6.message.stop_reason, this.mutableMessages.push(q6), yield* ZhA(q6);
                    break;
                case "progress":
                case "user":
                    this.mutableMessages.push(q6), yield* ZhA(q6);
                    break;
                case "stream_event":
                    if (q6.event.type === "message_start") f1 = LN, f1 = e51(f1, q6.event.message.usage);
                    if (q6.event.type === "message_delta") f1 = e51(f1, q6.event.usage);
                    if (q6.event.type === "message_stop") this.totalUsage = Af6(this.totalUsage, f1);
                    if (Z) yield {
                        type: "stream_event",
                        event: q6.event,
                        session_id: U6(),
                        parent_tool_use_id: null,
                        uuid: Y11()
                    };
                    break;
                case "attachment":
                    if (this.mutableMessages.push(q6), q6.attachment.type === "structured_output") y1 = q6.attachment.data;
                    else if (q6.attachment.type === "max_turns_reached") {
                        if (y) {
                            if (J6(process.env.CLAUDE_CODE_EAGER_FLUSH) || J6(process.env.CLAUDE_CODE_IS_COWORK)) await e91()
                        }
                        yield {
                            type: "result",
                            subtype: "error_max_turns",
                            duration_ms: Date.now() - B,
                            duration_api_ms: wT(),
                            is_error: !1,
                            num_turns: q6.attachment.turnCount,
                            stop_reason: B1,
                            session_id: U6(),
                            total_cost_usd: W0(),
                            usage: this.totalUsage,
                            modelUsage: ty(),
                            permission_denials: this.permissionDenials,
                            uuid: Y11(),
                            errors: []
                        };
                        return
                    } else if (f && q6.attachment.type === "queued_command") yield {
                        type: "user",
                        message: {
                            role: "user",
                            content: q6.attachment.prompt
                        },
                        session_id: U6(),
                        parent_tool_use_id: null,
                        uuid: q6.attachment.source_uuid || q6.uuid,
                        isReplay: !0
                    };
                    break;
                case "stream_request_start":
                    break;
                case "system":
                    if (this.mutableMessages.push(q6), q6.subtype === "compact_boundary" && q6.compactMetadata) yield {
                        type: "system",
                        subtype: "compact_boundary",
                        session_id: U6(),
                        uuid: q6.uuid,
                        compact_metadata: {
                            trigger: q6.compactMetadata.trigger,
                            pre_tokens: q6.compactMetadata.preTokens
                        }
                    };
                    break;
                case "tool_use_summary":
                    yield {
                        type: "tool_use_summary", summary: q6.summary, preceding_tool_use_ids: q6.precedingToolUseIds, session_id: U6(), uuid: q6.uuid
                    };
                    break
            }
            if (_ !== void 0 && W0() >= _) {
                if (y) {
                    if (J6(process.env.CLAUDE_CODE_EAGER_FLUSH) || J6(process.env.CLAUDE_CODE_IS_COWORK)) await e91()
                }
                yield {
                    type: "result",
                    subtype: "error_max_budget_usd",
                    duration_ms: Date.now() - B,
                    duration_api_ms: wT(),
                    is_error: !1,
                    num_turns: R1,
                    stop_reason: B1,
                    session_id: U6(),
                    total_cost_usd: W0(),
                    usage: this.totalUsage,
                    modelUsage: ty(),
                    permission_denials: this.permissionDenials,
                    uuid: Y11(),
                    errors: []
                };
                return
            }
            if (q6.type === "user" && P) {
                let K6 = lmA(this.mutableMessages, cD) - A6,
                    j6 = parseInt(process.env.MAX_STRUCTURED_OUTPUT_RETRIES || "5", 10);
                if (K6 >= j6) {
                    if (y) {
                        if (J6(process.env.CLAUDE_CODE_EAGER_FLUSH) || J6(process.env.CLAUDE_CODE_IS_COWORK)) await e91()
                    }
                    yield {
                        type: "result",
                        subtype: "error_max_structured_output_retries",
                        duration_ms: Date.now() - B,
                        duration_api_ms: wT(),
                        is_error: !0,
                        num_turns: R1,
                        stop_reason: B1,
                        session_id: U6(),
                        total_cost_usd: W0(),
                        usage: this.totalUsage,
                        modelUsage: ty(),
                        permission_denials: this.permissionDenials,
                        uuid: Y11(),
                        errors: [`Failed to provide valid structured output after ${j6} attempts`]
                    };
                    return
                }
            }
        }
        let O6 = gP(D1);
        if (y) {
            if (J6(process.env.CLAUDE_CODE_EAGER_FLUSH) || J6(process.env.CLAUDE_CODE_IS_COWORK)) await e91()
        }
        if (!P6q(O6)) {
            yield {
                type: "result",
                subtype: "error_during_execution",
                duration_ms: Date.now() - B,
                duration_api_ms: wT(),
                is_error: !1,
                num_turns: R1,
                stop_reason: B1,
                session_id: U6(),
                total_cost_usd: W0(),
                usage: this.totalUsage,
                modelUsage: ty(),
                permission_denials: this.permissionDenials,
                uuid: Y11(),
                errors: fw1().map((q6) => q6.error)
            };
            return
        }
        let P6 = "",
            V6 = !1;
        if (O6.type === "assistant") {
            let q6 = gP(O6.message.content);
            if (q6?.type === "text") P6 = q6.text;
            V6 = Boolean(O6.isApiErrorMessage)
        }
        yield {
            type: "result",
            subtype: "success",
            is_error: V6,
            duration_ms: Date.now() - B,
            duration_api_ms: wT(),
            num_turns: R1,
            result: P6,
            stop_reason: B1,
            session_id: U6(),
            total_cost_usd: W0(),
            usage: this.totalUsage,
            modelUsage: ty(),
            permission_denials: this.permissionDenials,
            structured_output: y1,
            uuid: Y11()
        }
    }
    interrupt() {
        this.abortController.abort()
    }
    getMessages() {
        return this.mutableMessages
    }
    getSessionId() {
        return U6()
    }
    setModel(A) {
        this.config.userSpecifiedModel = A
    }
}
// @from(Ln 462623, Col 0)
async function* TMq({
    commands: A,
    prompt: q,
    promptUuid: K,
    cwd: Y,
    tools: z,
    mcpClients: w,
    verbose: H = !1,
    maxThinkingTokens: $,
    maxTurns: O,
    maxBudgetUsd: _,
    canUseTool: J,
    mutableMessages: X = [],
    customSystemPrompt: D,
    appendSystemPrompt: j,
    userSpecifiedModel: M,
    fallbackModel: P,
    jsonSchema: W,
    getAppState: G,
    setAppState: f,
    abortController: Z,
    replayUserMessages: N = !1,
    includePartialMessages: T = !1,
    agents: k = [],
    setSDKStatus: y,
    orphanedPermission: B
}) {
    yield* new NMq({
        cwd: Y,
        tools: z,
        commands: A,
        mcpClients: w,
        agents: k,
        canUseTool: J,
        getAppState: G,
        setAppState: f,
        initialMessages: X,
        customSystemPrompt: D,
        appendSystemPrompt: j,
        userSpecifiedModel: M,
        fallbackModel: P,
        maxThinkingTokens: $,
        maxTurns: O,
        maxBudgetUsd: _,
        jsonSchema: W,
        verbose: H,
        replayUserMessages: N,
        includePartialMessages: T,
        setSDKStatus: y,
        abortController: Z,
        orphanedPermission: B
    }).submitMessage(q, {
        uuid: K
    })
}
// @from(Ln 462678, Col 4)
vJz = () => ({})
// @from(Ln 462679, Col 4)
vMq = v(() => {
    P61();
    OJ();
    c$();
    N7();
    ov();
    TR();
    DL();
    EK1();
    pM();
    VI();
    lq();
    hA();
    N8();
    nB();
    pQA();
    B6();
    e7();
    jJ6();
    XL();
    vz();
    J7();
    hU1();
    FU1();
    yw();
    cA();
    G2();
    Em();
    p8();
    VJ();
    y6();
    ZN();
    Nv6();
    Jf6()
})
// @from(Ln 462714, Col 4)
EMq = v(() => {
    y6();
    oFA();
    N7();
    c0A();
    u6();
    Oa()
})
// @from(Ln 462723, Col 0)
function kMq(A) {
    let q = process.env.CLAUDE_CODE_EXIT_AFTER_STOP_DELAY,
        K = q ? parseInt(q, 10) : null,
        Y = K && !isNaN(K) && K > 0,
        z = null,
        w = 0;
    return {
        start() {
            if (z) clearTimeout(z), z = null;
            if (Y) w = Date.now(), z = setTimeout(() => {
                let H = Date.now() - w;
                if (A() && H >= K) h(`Exiting after ${K}ms of idle time`), w3()
            }, K)
        },
        stop() {
            if (z) clearTimeout(z), z = null
        }
    }
}
// @from(Ln 462742, Col 4)
LMq = v(() => {
    Z6();
    w$()
})
// @from(Ln 462750, Col 0)
function yMq(A) {
    if (A.toLowerCase().endsWith(".jsonl")) return {
        sessionId: RMq(),
        ingressUrl: null,
        isUrl: !1,
        jsonlFile: A,
        isJsonlFile: !0
    };
    if (xv(A)) return {
        sessionId: A,
        ingressUrl: null,
        isUrl: !1,
        jsonlFile: null,
        isJsonlFile: !1
    };
    try {
        let q = new URL(A);
        return {
            sessionId: RMq(),
            ingressUrl: q.href,
            isUrl: !0,
            jsonlFile: null,
            isJsonlFile: !1
        }
    } catch {}
    return null
}
// @from(Ln 462777, Col 4)
CMq = v(() => {
    Sh()
})
// @from(Ln 462781, Col 0)
function EJz() {
    return J6(process.env.CLAUDE_CODE_DISABLE_OFFICIAL_MARKETPLACE_AUTOINSTALL)
}
// @from(Ln 462785, Col 0)
function SMq(A) {
    let q = Tv6.INITIAL_DELAY_MS * Math.pow(Tv6.BACKOFF_MULTIPLIER, A);
    return Math.min(q, Tv6.MAX_DELAY_MS)
}
// @from(Ln 462790, Col 0)
function kJz(A) {
    if (!A.officialMarketplaceAutoInstallAttempted) return !0;
    if (A.officialMarketplaceAutoInstalled) return !1;
    let q = A.officialMarketplaceAutoInstallFailReason,
        K = A.officialMarketplaceAutoInstallRetryCount || 0,
        Y = A.officialMarketplaceAutoInstallNextRetryTime,
        z = Date.now();
    if (K >= Tv6.MAX_ATTEMPTS) return !1;
    if (q === "policy_blocked") return !1;
    if (Y && z < Y) return !1;
    return q === "unknown" || q === "git_unavailable" || q === void 0
}
// @from(Ln 462802, Col 0)
async function vv6() {
    let A = f6();
    if (!kJz(A)) {
        let q = A.officialMarketplaceAutoInstallFailReason ?? "already_attempted";
        return h(`Official marketplace auto-install skipped: ${q}`), {
            installed: !1,
            skipped: !0,
            reason: q
        }
    }
    try {
        if (EJz()) return h("Official marketplace auto-install disabled via env var, skipping"), jA((z) => ({
            ...z,
            officialMarketplaceAutoInstallAttempted: !0,
            officialMarketplaceAutoInstalled: !1,
            officialMarketplaceAutoInstallFailReason: "policy_blocked"
        })), c("tengu_official_marketplace_auto_install", {
            installed: !1,
            skipped: !0,
            policy_blocked: !0
        }), {
            installed: !1,
            skipped: !0,
            reason: "policy_blocked"
        };
        if ((await n5())[d91]) return h(`Official marketplace '${d91}' already installed, skipping`), jA((z) => ({
            ...z,
            officialMarketplaceAutoInstallAttempted: !0,
            officialMarketplaceAutoInstalled: !0
        })), {
            installed: !1,
            skipped: !0,
            reason: "already_installed"
        };
        if (!Fq1(ZuA)) return h("Official marketplace blocked by enterprise policy, skipping"), jA((z) => ({
            ...z,
            officialMarketplaceAutoInstallAttempted: !0,
            officialMarketplaceAutoInstalled: !1,
            officialMarketplaceAutoInstallFailReason: "policy_blocked"
        })), c("tengu_official_marketplace_auto_install", {
            installed: !1,
            skipped: !0,
            policy_blocked: !0
        }), {
            installed: !1,
            skipped: !0,
            reason: "policy_blocked"
        };
        if (!await h$6()) {
            h("Git not available, skipping official marketplace auto-install");
            let z = (A.officialMarketplaceAutoInstallRetryCount || 0) + 1,
                w = Date.now(),
                H = SMq(z),
                $ = w + H,
                O = !1;
            try {
                jA((_) => ({
                    ..._,
                    officialMarketplaceAutoInstallAttempted: !0,
                    officialMarketplaceAutoInstalled: !1,
                    officialMarketplaceAutoInstallFailReason: "git_unavailable",
                    officialMarketplaceAutoInstallRetryCount: z,
                    officialMarketplaceAutoInstallLastAttemptTime: w,
                    officialMarketplaceAutoInstallNextRetryTime: $
                }))
            } catch (_) {
                O = !0;
                let J = _ instanceof Error ? _ : Error(`Failed to save marketplace auto-install git_unavailable state: ${_}`);
                K1(J), h(`Failed to save marketplace auto-install git_unavailable state: ${_}`, {
                    level: "error"
                })
            }
            return c("tengu_official_marketplace_auto_install", {
                installed: !1,
                skipped: !0,
                git_unavailable: !0,
                retry_count: z
            }), {
                installed: !1,
                skipped: !0,
                reason: "git_unavailable",
                configSaveFailed: O
            }
        }
        h("Attempting to auto-install official marketplace"), await wE(ZuA), h("Successfully auto-installed official marketplace");
        let Y = A.officialMarketplaceAutoInstallRetryCount || 0;
        return jA((z) => ({
            ...z,
            officialMarketplaceAutoInstallAttempted: !0,
            officialMarketplaceAutoInstalled: !0,
            officialMarketplaceAutoInstallFailReason: void 0,
            officialMarketplaceAutoInstallRetryCount: void 0,
            officialMarketplaceAutoInstallLastAttemptTime: void 0,
            officialMarketplaceAutoInstallNextRetryTime: void 0
        })), c("tengu_official_marketplace_auto_install", {
            installed: !0,
            skipped: !1,
            retry_count: Y
        }), {
            installed: !0,
            skipped: !1
        }
    } catch (q) {
        let K = q instanceof Error ? q.message : String(q);
        h(`Failed to auto-install official marketplace: ${K}`, {
            level: "error"
        }), K1(q instanceof Error ? q : Error(`Official marketplace auto-install failed: ${K}`));
        let Y = (A.officialMarketplaceAutoInstallRetryCount || 0) + 1,
            z = Date.now(),
            w = SMq(Y),
            H = z + w,
            $ = !1;
        try {
            jA((O) => ({
                ...O,
                officialMarketplaceAutoInstallAttempted: !0,
                officialMarketplaceAutoInstalled: !1,
                officialMarketplaceAutoInstallFailReason: "unknown",
                officialMarketplaceAutoInstallRetryCount: Y,
                officialMarketplaceAutoInstallLastAttemptTime: z,
                officialMarketplaceAutoInstallNextRetryTime: H
            }))
        } catch (O) {
            $ = !0;
            let _ = O instanceof Error ? O : Error(`Failed to save marketplace auto-install failure state: ${O}`);
            K1(_), h(`Failed to save marketplace auto-install failure state: ${O}`, {
                level: "error"
            })
        }
        return c("tengu_official_marketplace_auto_install", {
            installed: !1,
            skipped: !0,
            failed: !0,
            retry_count: Y
        }), {
            installed: !1,
            skipped: !0,
            reason: "unknown",
            configSaveFailed: $
        }
    }
}
// @from(Ln 462944, Col 4)
Tv6
// @from(Ln 462945, Col 4)
cQA = v(() => {
    kN6();
    TXA();
    Xa();
    p$();
    cA();
    Z6();
    y6();
    u6();
    hA();
    Tv6 = {
        MAX_ATTEMPTS: 10,
        INITIAL_DELAY_MS: 3600000,
        BACKOFF_MULTIPLIER: 2,
        MAX_DELAY_MS: 604800000
    }
})
// @from(Ln 462962, Col 0)
async function hMq() {
    h("installPluginsForHeadless: starting");
    try {
        let [A, q, K] = await Promise.all([UV6(), VZ1(), TZ1()]), Y = q.filter((_) => !K.includes(_));
        if (A.size === 0 && Y.length === 0) return h("installPluginsForHeadless: no missing plugins or marketplaces configured"), !1;
        if (Y.length > 0) await vv6();
        let z = [];
        if (A.size > 0) {
            let _ = await pV6(A);
            for (let J of _) {
                let X = A.get(J);
                if (!X) continue;
                try {
                    await wE(X.source), z.push(J), h(`installPluginsForHeadless: installed extra marketplace ${J}`)
                } catch (D) {
                    K1(D instanceof Error ? D : Error(String(D))), h(`installPluginsForHeadless: failed to install extra marketplace ${J}`)
                }
            }
            if (z.length > 0) AG1(), Sv()
        }
        let w = await n5(),
            H = [],
            $ = [];
        for (let _ of Y) {
            let [, J] = _.split("@");
            if (!J || J in w) H.push(_);
            else $.push(_)
        }
        if ($.length > 0) h(`installPluginsForHeadless: skipping ${$.length} plugins from unknown marketplaces: ${$.join(", ")}`);
        if (H.length === 0) return h("installPluginsForHeadless: no plugins to install"), !1;
        let O = await dV6(H, () => {});
        if (O.installed.length > 0) Sv();
        return h(`installPluginsForHeadless: ${O.installed.length} installed, ${O.failed.length} failed`), O.installed.length > 0
    } catch (A) {
        return K1(A instanceof Error ? A : Error(String(A))), !1
    }
}
// @from(Ln 462999, Col 4)
IMq = v(() => {
    cQA();
    vZ1();
    IxA();
    p$();
    lV6();
    VJ();
    Z6();
    y6()
})
// @from(Ln 463009, Col 4)
UMq = {}
// @from(Ln 463023, Col 0)
async function LJz(A, q, K, Y, z, w, H, $) {
    if (zX.subscribe((T) => {
            if (Gw6(T, K), i4()) K((k) => ({
                ...k,
                fastMode: k.settings.fastMode === !0
            }))
        }), aSA(), await NM1()) await Y2q();
    if (b8.isSandboxingEnabled()) try {
        await b8.initialize()
    } catch (T) {
        process.stderr.write(`
❌ Sandbox Error: ${T instanceof Error?T.message:String(T)}
`), w3(1, "other");
        return
    }
    if ($.resumeSessionAt && !$.resume) {
        process.stderr.write(`Error: --resume-session-at requires --resume
`), w3(1);
        return
    }
    if ($.rewindFiles && !$.resume) {
        process.stderr.write(`Error: --rewind-files requires --resume
`), w3(1);
        return
    }
    if ($.rewindFiles && A) {
        process.stderr.write(`Error: --rewind-files is a standalone operation and cannot be used with a prompt
`), w3(1);
        return
    }
    let O = IJz(A, $);
    if ($.outputFormat === "stream-json" && $.verbose) wn7((T) => {
        let k = (() => {
            switch (T.type) {
                case "started":
                    return {
                        type: "system", subtype: "hook_started", hook_id: T.hookId, hook_name: T.hookName, hook_event: T.hookEvent, uuid: SE(), session_id: U6()
                    };
                case "progress":
                    return {
                        type: "system", subtype: "hook_progress", hook_id: T.hookId, hook_name: T.hookName, hook_event: T.hookEvent, stdout: T.stdout, stderr: T.stderr, output: T.output, uuid: SE(), session_id: U6()
                    };
                case "response":
                    return {
                        type: "system", subtype: "hook_response", hook_id: T.hookId, hook_name: T.hookName, hook_event: T.hookEvent, output: T.output, stdout: T.stdout, stderr: T.stderr, exit_code: T.exitCode, outcome: T.outcome, uuid: SE(), session_id: U6()
                    }
            }
        })();
        O.write(k)
    });
    if ($.setupTrigger) await FW6($.setupTrigger);
    let _ = await q(),
        J = await hJz(K, {
            continue: $.continue,
            teleport: $.teleport,
            resume: $.resume,
            resumeSessionAt: $.resumeSessionAt,
            forkSession: $.forkSession,
            outputFormat: $.outputFormat
        });
    if ($.rewindFiles) {
        let T = J.find((B) => B.uuid === $.rewindFiles);
        if (!T || T.type !== "user") {
            process.stderr.write(`Error: --rewind-files requires a user message UUID, but ${$.rewindFiles} is not a user message in this session
`), w3(1);
            return
        }
        let k = await q(),
            y = await mMq($.rewindFiles, k, K, !1);
        if (!y.canRewind) {
            process.stderr.write(`Error: ${y.error||"Unexpected error"}
`), w3(1);
            return
        }
        process.stdout.write(`Files rewound to state at message ${$.rewindFiles}
`), w3(0);
        return
    }
    let X = typeof $.resume === "string" && (Boolean(xv($.resume)) || $.resume.endsWith(".jsonl")),
        D = Boolean($.sdkUrl);
    if (!A && !X && !D) {
        process.stderr.write(`Error: Input must be provided either through stdin or as a prompt argument when using --print
`), w3(1);
        return
    }
    if ($.outputFormat === "stream-json" && !$.verbose) {
        process.stderr.write(`Error: When using --print, --output-format=stream-json requires --verbose
`), w3(1);
        return
    }
    let j = hg1(_.mcp.tools, _.toolPermissionContext),
        M = O$() ? z : [...z, ...j],
        P = $.sdkUrl ? "stdio" : $.permissionPromptToolName,
        W = void 0,
        G = yJz(P, O, _.mcp.tools, W);
    if ($.permissionPromptToolName) M = M.filter((T) => T.name !== $.permissionPromptToolName);
    lpA(), await ll8();
    let f = [],
        Z = null;
    for await (let T of RJz(O, _.mcp.clients, [...Y, ..._.mcp.commands], M, J, G, w, q, K, H, $)) {
        if (Z) {
            let k = Z(T);
            if (k) await O.write(k)
        } else if ($.outputFormat === "stream-json" && $.verbose) await O.write(T);
        if (T.type !== "control_response" && T.type !== "control_request" && T.type !== "control_cancel_request" && T.type !== "stream_event" && T.type !== "keep_alive" && T.type !== "streamlined_text" && T.type !== "streamlined_tool_use_summary") f.push(T)
    }
    let N = gP(f);
    switch ($.outputFormat) {
        case "json":
            if (!N || N.type !== "result") throw Error("No messages returned");
            if ($.verbose) {
                Q4(Q1(f) + `
`);
                break
            }
            Q4(Q1(N) + `
`);
            break;
        case "stream-json":
            break;
        default:
            if (!N || N.type !== "result") throw Error("No messages returned");
            switch (N.subtype) {
                case "success":
                    Q4(N.result.endsWith(`
`) ? N.result : N.result + `
`);
                    break;
                case "error_during_execution":
                    Q4("Execution error");
                    break;
                case "error_max_turns":
                    Q4(`Error: Reached max turns (${$.maxTurns})`);
                    break;
                case "error_max_budget_usd":
                    Q4(`Error: Exceeded USD budget (${$.maxBudgetUsd})`);
                    break;
                case "error_max_structured_output_retries":
                    Q4("Error: Failed to provide valid structured output after maximum retries")
            }
    }
    sSA(), w3(N?.type === "result" && N?.is_error ? 1 : 0)
}
// @from(Ln 463167, Col 0)
function RJz(A, q, K, Y, z, w, H, $, O, _, J) {
    let X = !1,
        D = !1,
        j = !1,
        M, P = new xU1,
        W = (N1) => {
            O((j1) => {
                let q1 = N1(j1),
                    t = j1.toolPermissionContext.mode,
                    J1 = q1.toolPermissionContext.mode;
                if (t !== J1 && (J1 === "default" || J1 === "acceptEdits" || J1 === "bypassPermissions" || J1 === "plan" || J1 === "delegate" || J1 === "dontAsk")) P.enqueue({
                    type: "system",
                    subtype: "status",
                    status: null,
                    permissionMode: J1,
                    uuid: SE(),
                    session_id: U6()
                });
                return q1
            })
        };
    if (J.enableAuthStatus) lT.getInstance().subscribe((j1) => {
        P.enqueue({
            type: "auth_status",
            isAuthenticating: j1.isAuthenticating,
            output: j1.output,
            error: j1.error,
            uuid: SE(),
            session_id: U6()
        })
    });
    let G = QYq(z),
        f = z,
        N = O71().map((N1) => {
            return {
                value: N1.value === null ? "default" : N1.value,
                displayName: N1.label,
                description: N1.description
            }
        }),
        T = J.userSpecifiedModel,
        k = [],
        y = [];
    async function B() {
        let N1 = new Set(Object.keys(H)),
            j1 = new Set(k.map((Z1) => Z1.name)),
            q1 = Array.from(N1).some((Z1) => !j1.has(Z1)),
            t = Array.from(j1).some((Z1) => !N1.has(Z1)),
            J1 = k.some((Z1) => Z1.type === "pending");
        if (q1 || t || J1) {
            for (let a of k)
                if (!N1.has(a.name)) {
                    if (a.type === "connected") await a.cleanup()
                } let Z1 = await io4(H, (a, A1) => A.sendMcpMessage(a, A1));
            k = Z1.clients, y = Z1.tools;
            let E1 = new Set([...j1, ...N1]);
            O((a) => ({
                ...a,
                mcp: {
                    ...a.mcp,
                    tools: [...a.mcp.tools.filter((A1) => !Array.from(E1).some((M1) => A1.name.startsWith(Ql(M1)))), ...y]
                }
            })), $F4(k)
        }
    }
    B();
    let S = {
            clients: [],
            tools: [],
            configs: {}
        },
        m = null,
        b = Promise.resolve({
            response: {
                added: [],
                removed: [],
                errors: {}
            },
            sdkServersChanged: !1
        });

    function g(N1) {
        let j1 = async () => {
            let q1 = new Set(k.map((J1) => J1.name)),
                t = await QMq(N1, {
                    configs: H,
                    clients: k,
                    tools: y
                }, S, O);
            for (let J1 of Object.keys(H)) delete H[J1];
            if (Object.assign(H, t.newSdkState.configs), k = t.newSdkState.clients, y = t.newSdkState.tools, S = t.newDynamicState, t.sdkServersChanged) {
                let J1 = new Set(k.map((Z1) => Z1.name)),
                    D1 = new Set([...q1, ...J1]);
                O((Z1) => ({
                    ...Z1,
                    mcp: {
                        ...Z1.mcp,
                        tools: [...Z1.mcp.tools.filter((E1) => !Array.from(D1).some((a) => E1.name.startsWith(Ql(a)))), ...y]
                    }
                }))
            }
            return {
                response: t.response,
                sdkServersChanged: t.sdkServersChanged
            }
        };
        return b = b.then(j1, j1), b
    }
    async function U() {
        try {
            if (J6(process.env.CLAUDE_CODE_REMOTE) || Nq()) await qMq();
            if (await hMq()) {
                let {
                    servers: j1
                } = await um(), q1 = {};
                for (let [D1, Z1] of Object.entries(j1)) {
                    let E1 = Z1.type;
                    if (E1 === void 0 || E1 === "stdio" || E1 === "sse" || E1 === "http" || E1 === "sdk") q1[D1] = Z1
                }
                let {
                    response: t,
                    sdkServersChanged: J1
                } = await g(q1);
                if (J1) B();
                h(`Headless MCP refresh: added=${t.added.length}, removed=${t.removed.length}`)
            }
        } catch (N1) {
            K1(N1 instanceof Error ? N1 : Error(String(N1)))
        }
    }
    U();
    let x = kMq(() => !X),
        p = K,
        l = Df1.subscribe(() => {
            bm(), cZ(xMq()).then((N1) => {
                p = N1
            })
        }),
        r = void 0,
        s = async () => {
            if (X) return;
            if (X = !0, x.stop(), await B(), J.mcpDeferredPromise && !m) m = await J.mcpDeferredPromise, O((D1) => ({
                ...D1,
                mcp: {
                    ...D1.mcp,
                    clients: [...D1.mcp.clients, ...m.clients],
                    tools: [...D1.mcp.tools, ...m.tools],
                    commands: [...D1.mcp.commands, ...m.commands]
                }
            })), p = [...p, ...m.commands];
            let N1 = [...q, ...m?.clients ?? [], ...k, ...S.clients],
                j1 = m ? hg1(m.tools, (await $()).toolPermissionContext) : [],
                q1 = [...Y, ...O$() ? [] : j1, ...y, ...S.tools],
                t = Vn1();
            if (t && !J.jsonSchema) {
                let D1 = k_6(t);
                if (D1) q1 = [...q1, D1]
            }
            try {
                let D1, Z1 = !1,
                    E1 = async () => {
                        while (D1 = await Z_6($, O)) {
                            if (D1.mode !== "prompt" && D1.mode !== "orphaned-permission" && D1.mode !== "task-notification") throw Error("only prompt commands are supported in streaming mode");
                            if (D1.mode === "task-notification") {
                                let z1 = typeof D1.value === "string" ? D1.value : "",
                                    Y1 = z1.match(/<task-id>([^<]+)<\/task-id>/),
                                    _1 = z1.match(/<output-file>([^<]+)<\/output-file>/),
                                    $1 = z1.match(/<status>([^<]+)<\/status>/),
                                    G1 = z1.match(/<summary>([^<]+)<\/summary>/),
                                    L1 = (R1) => R1 === "completed" || R1 === "failed" || R1 === "stopped",
                                    x1 = $1?.[1],
                                    f1 = L1(x1) ? x1 : "completed";
                                P.enqueue({
                                    type: "system",
                                    subtype: "task_notification",
                                    task_id: Y1?.[1] ?? "",
                                    status: f1,
                                    output_file: _1?.[1] ?? "",
                                    summary: G1?.[1] ?? "",
                                    session_id: U6(),
                                    uuid: SE()
                                })
                            }
                            let a = D1.value;
                            M = Aq();
                            let A1 = void 0,
                                M1 = {};
                            for await (let z1 of TMq({
                                commands: p,
                                prompt: a,
                                promptUuid: D1.uuid,
                                cwd: xMq(),
                                tools: q1,
                                verbose: J.verbose,
                                mcpClients: N1,
                                maxThinkingTokens: J.maxThinkingTokens,
                                maxTurns: J.maxTurns,
                                maxBudgetUsd: J.maxBudgetUsd,
                                canUseTool: w,
                                userSpecifiedModel: T,
                                fallbackModel: J.fallbackModel,
                                jsonSchema: Vn1() ?? J.jsonSchema,
                                mutableMessages: f,
                                customSystemPrompt: J.systemPrompt,
                                appendSystemPrompt: J.appendSystemPrompt,
                                ...M1,
                                getAppState: $,
                                setAppState: W,
                                abortController: M,
                                replayUserMessages: J.replayUserMessages,
                                includePartialMessages: J.includePartialMessages,
                                agents: _,
                                orphanedPermission: D1.orphanedPermission,
                                setSDKStatus: (Y1) => {
                                    P.enqueue({
                                        type: "system",
                                        subtype: "status",
                                        status: Y1,
                                        session_id: U6(),
                                        uuid: SE()
                                    })
                                }
                            })) {
                                let Y1 = (z1.type === "assistant" || z1.type === "user") && z1.parent_tool_use_id,
                                    _1 = z1.type === "user" && "isReplay" in z1 && z1.isReplay;
                                if (!Y1 && !_1 && z1.type !== "stream_event") G.push(z1);
                                P.enqueue(z1)
                            }
                            sSA(), aSA()
                        }
                    };
                do {
                    await E1(), Z1 = !1;
                    {
                        let a = await $(),
                            A1 = Ui4(a).some((z1) => IN(z1)),
                            M1 = a.queuedCommands.length > 0;
                        if (A1 || M1) {
                            if (Z1 = !0, !M1) await new Promise((z1) => setTimeout(z1, 100))
                        }
                    }
                } while (Z1)
            } catch (D1) {
                try {
                    await A.write({
                        type: "result",
                        subtype: "error_during_execution",
                        duration_ms: 0,
                        duration_api_ms: 0,
                        is_error: !0,
                        num_turns: 0,
                        stop_reason: null,
                        session_id: U6(),
                        total_cost_usd: 0,
                        usage: LN,
                        modelUsage: {},
                        permission_denials: [],
                        uuid: SE(),
                        errors: [D1 instanceof Error ? D1.message : String(D1), ...fw1().map((Z1) => Z1.error)]
                    })
                } catch {}
                w3(1);
                return
            } finally {
                X = !1, x.start()
            }
            if ((await $()).queuedCommands.length > 0) {
                s();
                return
            } {
                let Z1 = (await $()).teamContext;
                if (Z1 && PM(Z1))
                    while (!0) {
                        let A1 = await $();
                        if (!(oq6(A1) || A1.teamContext && Object.keys(A1.teamContext.teammates).length > 0)) {
                            h("[print.ts] No more active teammates, stopping poll");
                            break
                        }
                        let z1 = z51("team-lead", A1.teamContext?.teamName);
                        if (z1.length > 0) {
                            h(`[print.ts] Team-lead found ${z1.length} unread messages`), XQ1("team-lead", A1.teamContext?.teamName);
                            let Y1 = A1.teamContext?.teamName;
                            for (let $1 of z1) {
                                let G1 = UZ($1.text);
                                if (G1 && Y1) {
                                    let L1 = G1.from;
                                    h(`[print.ts] Processing shutdown_approved from ${L1}`);
                                    let x1 = A1.teamContext?.teammates ? Object.entries(A1.teamContext.teammates).find(([, f1]) => f1.name === L1)?.[0] : void 0;
                                    if (x1) EP1(Y1, {
                                        agentId: x1,
                                        name: L1
                                    }), h(`[print.ts] Removed ${L1} from team file`), Mr(Y1, x1, L1, "shutdown"), O((f1) => {
                                        if (!f1.teamContext?.teammates) return f1;
                                        if (!(x1 in f1.teamContext.teammates)) return f1;
                                        let {
                                            [x1]: R1, ...H1
                                        } = f1.teamContext.teammates;
                                        return {
                                            ...f1,
                                            teamContext: {
                                                ...f1.teamContext,
                                                teammates: H1
                                            }
                                        }
                                    })
                                }
                            }
                            let _1 = z1.map(($1) => `<${qJ} teammate_id="${$1.from}"${$1.color?` color="${$1.color}"`:""}>
${$1.text}
</${qJ}>`).join(`

`);
                            lB({
                                mode: "prompt",
                                value: _1,
                                uuid: SE()
                            }, O), s();
                            return
                        }
                        if (D && !j) {
                            j = !0, h("[print.ts] Input closed with active teammates, injecting shutdown prompt"), lB({
                                mode: "prompt",
                                value: bMq,
                                uuid: SE()
                            }, O), s();
                            return
                        }
                        await new Promise((Y1) => setTimeout(Y1, 500))
                    }
            }
            if (D)
                if (await (async () => {
                        let Z1 = await $();
                        if (U7A(Z1)) await p7A(O, Z1);
                        let E1 = await $(),
                            a = E1.teamContext;
                        return a && Object.keys(a.teammates).length > 0 || oq6(E1)
                    })()) lB({
                    mode: "prompt",
                    value: bMq,
                    uuid: SE()
                }, O), s();
                else await lMA(), l(), P.done()
        }, O1 = function(N1, j1) {
            P.enqueue({
                type: "control_response",
                response: {
                    subtype: "success",
                    request_id: N1.request_id,
                    response: j1
                }
            })
        }, T1 = function(N1, j1) {
            P.enqueue({
                type: "control_response",
                response: {
                    subtype: "error",
                    request_id: N1.request_id,
                    error: j1
                }
            })
        };
    return A.setUnexpectedResponseCallback(async (N1) => {
        await FMq({
            message: N1,
            setAppState: O,
            onEnqueued: () => {
                s()
            }
        })
    }), (async () => {
        let N1 = !1;
        for await (let j1 of A.structuredInput) {
            if (j1.type === "control_request") {
                if (j1.request.subtype === "interrupt") {
                    if (M) M.abort();
                    O1(j1)
                } else if (j1.request.subtype === "initialize") {
                    if (j1.request.sdkMcpServers && j1.request.sdkMcpServers.length > 0)
                        for (let q1 of j1.request.sdkMcpServers) H[q1] = {
                            type: "sdk",
                            name: q1
                        };
                    await CJz(j1.request, j1.request_id, N1, P, K, N, A, !!J.enableAuthStatus, J, _, $), N1 = !0
                } else if (j1.request.subtype === "set_permission_mode") {
                    let q1 = j1.request;
                    O((t) => ({
                        ...t,
                        toolPermissionContext: SJz(q1, j1.request_id, t.toolPermissionContext, P)
                    })), O1(j1)
                } else if (j1.request.subtype === "set_model") {
                    let q1 = j1.request.model === "default" ? ML() : j1.request.model;
                    T = q1, CG(q1), O1(j1)
                } else if (j1.request.subtype === "set_max_thinking_tokens") {
                    if (j1.request.max_thinking_tokens === null) J.maxThinkingTokens = void 0;
                    else J.maxThinkingTokens = j1.request.max_thinking_tokens;
                    O1(j1)
                } else if (j1.request.subtype === "mcp_status") {
                    let q1 = await $(),
                        t = q1.mcp.clients,
                        J1 = [...q1.mcp.tools, ...S.tools],
                        D1 = [...t, ...k, ...S.clients].map((Z1) => {
                            let E1;
                            if (Z1.config.type === "sse" || Z1.config.type === "http") E1 = {
                                type: Z1.config.type,
                                url: Z1.config.url
                            };
                            else if (Z1.config.type === "claudeai-proxy") E1 = {
                                type: "claudeai-proxy",
                                url: Z1.config.url,
                                id: Z1.config.id
                            };
                            else if (Z1.config.type === "stdio") E1 = {
                                type: "stdio",
                                command: Z1.config.command,
                                args: Z1.config.args
                            };
                            let a = Z1.type === "connected" ? Bm(J1, Z1.name).map((A1) => ({
                                name: A1.originalMcpToolName ?? A1.name,
                                annotations: {
                                    readOnly: A1.isReadOnly({}) || void 0,
                                    destructive: A1.isDestructive?.({}) || void 0,
                                    openWorld: A1.isOpenWorld?.({}) || void 0
                                }
                            })) : void 0;
                            return {
                                name: Z1.name,
                                status: Z1.type,
                                serverInfo: Z1.type === "connected" ? Z1.serverInfo : void 0,
                                error: Z1.type === "failed" ? Z1.error : void 0,
                                config: E1,
                                scope: Z1.config.scope,
                                tools: a
                            }
                        });
                    O1(j1, {
                        mcpServers: D1
                    })
                } else if (j1.request.subtype === "mcp_message") {
                    let q1 = j1.request,
                        t = k.find((J1) => J1.name === q1.server_name);
                    if (t && t.type === "connected" && t.client?.transport?.onmessage) t.client.transport.onmessage(q1.message);
                    O1(j1)
                } else if (j1.request.subtype === "rewind_files") {
                    let q1 = await $(),
                        t = await mMq(j1.request.user_message_id, q1, O, j1.request.dry_run ?? !1);
                    if (t.canRewind || j1.request.dry_run) O1(j1, t);
                    else T1(j1, t.error ?? "Unexpected error")
                } else if (j1.request.subtype === "mcp_set_servers") {
                    let {
                        response: q1,
                        sdkServersChanged: t
                    } = await g(j1.request.servers);
                    if (O1(j1, q1), t) B()
                } else if (j1.request.subtype === "mcp_reconnect") {
                    let {
                        serverName: q1
                    } = j1.request, t = lR(q1) ?? q.find((J1) => J1.name === q1)?.config ?? null;
                    if (!t) T1(j1, `Server not found: ${q1}`);
                    else {
                        let J1 = await Qm(q1, t),
                            D1 = Ql(q1);
                        if (O((Z1) => ({
                                ...Z1,
                                mcp: {
                                    ...Z1.mcp,
                                    clients: Z1.mcp.clients.map((E1) => E1.name === q1 ? J1.client : E1),
                                    tools: [...Cx(Z1.mcp.tools, (E1) => E1.name?.startsWith(D1)), ...J1.tools],
                                    commands: [...Cx(Z1.mcp.commands, (E1) => E1.name?.startsWith(D1)), ...J1.commands],
                                    resources: J1.resources && J1.resources.length > 0 ? {
                                        ...Z1.mcp.resources,
                                        [q1]: J1.resources
                                    } : w21(Z1.mcp.resources, q1)
                                }
                            })), J1.client.type === "connected") O1(j1);
                        else {
                            let Z1 = J1.client.type === "failed" ? J1.client.error ?? "Connection failed" : `Server status: ${J1.client.type}`;
                            T1(j1, Z1)
                        }
                    }
                } else if (j1.request.subtype === "mcp_toggle") {
                    let {
                        serverName: q1,
                        enabled: t
                    } = j1.request, J1 = lR(q1) ?? q.find((D1) => D1.name === q1)?.config ?? null;
                    if (!J1) T1(j1, `Server not found: ${q1}`);
                    else if (!t) {
                        wG1(q1, !1);
                        let D1 = [...q, ...k, ...S.clients].find((E1) => E1.name === q1);
                        if (D1 && D1.type === "connected") await Fm(q1, J1);
                        let Z1 = Ql(q1);
                        O((E1) => ({
                            ...E1,
                            mcp: {
                                ...E1.mcp,
                                clients: E1.mcp.clients.map((a) => a.name === q1 ? {
                                    name: q1,
                                    type: "disabled",
                                    config: J1
                                } : a),
                                tools: Cx(E1.mcp.tools, (a) => a.name?.startsWith(Z1)),
                                commands: Cx(E1.mcp.commands, (a) => a.name?.startsWith(Z1)),
                                resources: w21(E1.mcp.resources, q1)
                            }
                        })), O1(j1)
                    } else {
                        wG1(q1, !0);
                        let D1 = await Qm(q1, J1),
                            Z1 = Ql(q1);
                        if (O((E1) => ({
                                ...E1,
                                mcp: {
                                    ...E1.mcp,
                                    clients: E1.mcp.clients.map((a) => a.name === q1 ? D1.client : a),
                                    tools: [...Cx(E1.mcp.tools, (a) => a.name?.startsWith(Z1)), ...D1.tools],
                                    commands: [...Cx(E1.mcp.commands, (a) => a.name?.startsWith(Z1)), ...D1.commands],
                                    resources: D1.resources && D1.resources.length > 0 ? {
                                        ...E1.mcp.resources,
                                        [q1]: D1.resources
                                    } : w21(E1.mcp.resources, q1)
                                }
                            })), D1.client.type === "connected") O1(j1);
                        else {
                            let E1 = D1.client.type === "failed" ? D1.client.error ?? "Connection failed" : `Server status: ${D1.client.type}`;
                            T1(j1, E1)
                        }
                    }
                }
                continue
            } else if (j1.type === "control_response") {
                if (J.replayUserMessages) P.enqueue(j1);
                continue
            } else if (j1.type === "keep_alive") continue;
            else if (j1.type === "update_environment_variables") continue;
            if (N1 = !0, j1.uuid) {
                let q1 = U6();
                if (await KFA(q1, j1.uuid) || uMq.has(j1.uuid)) {
                    if (h(`Skipping duplicate user message: ${j1.uuid}`), J.replayUserMessages) h(`Sending acknowledgment for duplicate user message: ${j1.uuid}`), P.enqueue({
                        type: "user",
                        message: j1.message,
                        session_id: q1,
                        parent_tool_use_id: null,
                        uuid: j1.uuid,
                        isReplay: !0
                    });
                    continue
                }
                uMq.add(j1.uuid)
            }
            O((q1) => {
                return {
                    ...q1,
                    queuedCommands: [...q1.queuedCommands, {
                        mode: "prompt",
                        value: j1.message.content,
                        uuid: j1.uuid
                    }]
                }
            }), s()
        }
        if (D = !0, !X) await lMA(), l(), P.done()
    })(), P
}
// @from(Ln 463731, Col 0)
function BMq(A) {
    let q = async (K, Y, z, w, H) => {
        let $ = await uX(K, Y, z, w, H);
        if ($.behavior === "allow" || $.behavior === "deny") return $;
        let {
            signal: O,
            cleanup: _
        } = fR(z.abortController.signal);
        if (O.aborted) return _(), {
            behavior: "deny",
            message: "Permission prompt was aborted.",
            decisionReason: {
                type: "permissionPromptTool",
                permissionPromptToolName: K.name,
                toolResult: void 0
            }
        };
        let J = new Promise((P) => {
                O.addEventListener("abort", () => P("aborted"), {
                    once: !0
                })
            }),
            X = A.call({
                tool_name: K.name,
                input: Y,
                tool_use_id: H
            }, z, q, w),
            D = await Promise.race([X, J]);
        if (_(), D === "aborted" || O.aborted) return {
            behavior: "deny",
            message: "Permission prompt was aborted.",
            decisionReason: {
                type: "permissionPromptTool",
                permissionPromptToolName: K.name,
                toolResult: void 0
            }
        };
        let j = D,
            M = A.mapToolResultToToolResultBlockParam(j.data, "1");
        if (!M.content || !Array.isArray(M.content) || !M.content[0] || M.content[0].type !== "text" || typeof M.content[0].text !== "string") throw Error('Permission prompt tool returned an invalid result. Expected a single text block param with type="text" and a string text value.');
        return jc1(Gv6.parse(j9(M.content[0].text)), A, Y, z)
    };
    return q
}
// @from(Ln 463776, Col 0)
function yJz(A, q, K, Y) {
    if (A === "stdio") return q.createCanUseTool(Y);
    else if (A) {
        let z = K.find((w) => w.name === A);
        if (!z) {
            let w = `Error: MCP tool ${A} (passed via --permission-prompt-tool) not found. Available MCP tools: ${K.map((H)=>H.name).join(", ")||"none"}`;
            throw process.stderr.write(`${w}
`), w3(1), Error(w)
        }
        if (!z.inputJSONSchema) {
            let w = `Error: tool ${A} (passed via --permission-prompt-tool) must be an MCP tool`;
            throw process.stderr.write(`${w}
`), w3(1), Error(w)
        }
        return BMq(z)
    }
    return uX
}
// @from(Ln 463794, Col 0)
async function CJz(A, q, K, Y, z, w, H, $, O, _, J) {
    if (K) {
        Y.enqueue({
            type: "control_response",
            response: {
                subtype: "error",
                error: "Already initialized",
                request_id: q,
                pending_permission_requests: H.getPendingPermissionRequests()
            }
        });
        return
    }
    if (A.systemPrompt !== void 0) O.systemPrompt = A.systemPrompt;
    if (A.appendSystemPrompt !== void 0) O.appendSystemPrompt = A.appendSystemPrompt;
    if (A.agents) {
        let W = fJ6(A.agents, "flagSettings");
        _.push(...W)
    }
    if (O.agent) {
        let W = _.find((G) => G.agentType === O.agent);
        if (W) {
            if (AC(W.agentType), !O.systemPrompt && !iD(W)) {
                let G = W.getSystemPrompt();
                if (G) O.systemPrompt = G
            }
            if (!O.userSpecifiedModel && W.model && W.model !== "inherit") {
                let G = t9(W.model);
                CG(G)
            }
        }
    }
    let D = C8()?.outputStyle || Wj,
        j = await V91(h6()),
        M = r86();
    if (A.hooks) {
        let W = {};
        for (let [G, f] of Object.entries(A.hooks)) W[G] = f.map((Z) => {
            let N = Z.hookCallbackIds.map((T) => {
                return H.createHookCallback(T, Z.timeout)
            });
            return {
                matcher: Z.matcher,
                hooks: N
            }
        });
        O61(W)
    }
    if (A.jsonSchema) KR6(A.jsonSchema);
    let P = {
        commands: z.map((W) => ({
            name: W.userFacingName(),
            description: jZ1(W),
            argumentHint: W.argumentHint || ""
        })),
        output_style: D,
        available_output_styles: Object.keys(j),
        models: w,
        account: {
            email: M?.email,
            organization: M?.organization,
            subscriptionType: M?.subscription,
            tokenSource: M?.tokenSource,
            apiKeySource: M?.apiKeySource
        }
    };
    if (i4() && lH()) {
        let G = (await J()).fastMode && x$(O.userSpecifiedModel ?? null),
            f = "off";
        if (G && Kv()) f = "cooldown";
        else if (G) f = "on";
        P.fast_mode_state = f
    }
    if (Y.enqueue({
            type: "control_response",
            response: {
                subtype: "success",
                request_id: q,
                response: P
            }
        }), $) {
        let G = lT.getInstance().getStatus();
        if (G) Y.enqueue({
            type: "auth_status",
            isAuthenticating: G.isAuthenticating,
            output: G.output,
            error: G.error,
            uuid: SE(),
            session_id: U6()
        })
    }
}
// @from(Ln 463886, Col 0)
async function mMq(A, q, K, Y) {
    if (!z2()) return {
        canRewind: !1,
        error: "File rewinding is not enabled."
    };
    if (!LP6(q.fileHistory, A)) return {
        canRewind: !1,
        error: "No file checkpoint found for this message."
    };
    if (Y) {
        let z = RP6(q.fileHistory, A);
        return {
            canRewind: !0,
            filesChanged: z?.filesChanged,
            insertions: z?.insertions,
            deletions: z?.deletions
        }
    }
    try {
        await kP6((z) => K((w) => ({
            ...w,
            fileHistory: z(w.fileHistory)
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
// @from(Ln 463920, Col 0)
function SJz(A, q, K, Y) {
    if (A.mode === "bypassPermissions" && rD1()) return Y.enqueue({
        type: "control_response",
        response: {
            subtype: "error",
            request_id: q,
            error: "Cannot set permission mode to bypassPermissions because it is disabled by settings or configuration"
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
    }), ey(K.mode, A.mode), {
        ...K,
        mode: A.mode
    }
}
// @from(Ln 463944, Col 0)
function Ev6(A, q) {
    if (q === "stream-json") {
        let K = {
            type: "result",
            subtype: "error_during_execution",
            duration_ms: 0,
            duration_api_ms: 0,
            is_error: !0,
            num_turns: 0,
            stop_reason: null,
            session_id: U6(),
            total_cost_usd: 0,
            usage: LN,
            modelUsage: {},
            permission_denials: [],
            uuid: SE(),
            errors: [A]
        };
        process.stdout.write(Q1(K) + `
`)
    } else process.stderr.write(A + `
`)
}
// @from(Ln 463967, Col 0)
async function hJz(A, q) {
    let K = !qk();
    if (q.continue) try {
        c("tengu_continue_print", {});
        let Y = await yt(void 0, void 0);
        if (Y) {
            if (!q.forkSession) {
                if (Y.sessionId) {
                    if (mP(Yj(Y.sessionId)), K) await Hy()
                }
            }
            return _c1(Y, A), Y.messages
        }
    } catch (Y) {
        return K1(Y instanceof Error ? Y : Error(String(Y))), w3(1), []
    }
    if (q.teleport) try {
        if (!p0("allow_remote_sessions")) throw Error("Remote sessions are disabled by your organization's policy.");
        if (c("tengu_teleport_print", {}), typeof q.teleport !== "string") throw Error("No session ID provided for teleport");
        await nW6();
        let Y = await Ct(q.teleport),
            {
                branchError: z
            } = await aW1(Y.branch);
        return oW1(Y.log, z)
    } catch (Y) {
        return K1(Y instanceof Error ? Y : Error(String(Y))), w3(1), []
    }
    if (q.resume) try {
        c("tengu_resume_print", {});
        let Y = yMq(typeof q.resume === "string" ? q.resume : "");
        if (!Y) {
            let w = "Error: --resume requires a valid session ID when used with --print. Usage: claude -p --resume <session-id>";
            if (typeof q.resume === "string") w += `. Session IDs must be in UUID format (e.g., 550e8400-e29b-41d4-a716-446655440000). Provided value "${q.resume}" is not a valid UUID`;
            return Ev6(w, q.outputFormat), w3(1), []
        }
        if (Y.isUrl && Y.ingressUrl) await omA(Y.sessionId, Y.ingressUrl);
        let z = await yt(Y.sessionId, Y.jsonlFile || void 0);
        if (!z)
            if (Y.isUrl) return await PP("startup");
            else return Ev6(`No conversation found with session ID: ${Y.sessionId}`, q.outputFormat), w3(1), [];
        if (q.resumeSessionAt) {
            let w = z.messages.findIndex((H) => H.uuid === q.resumeSessionAt);
            if (w < 0) return Ev6(`No message found with message.uuid of: ${q.resumeSessionAt}`, q.outputFormat), w3(1), [];
            z.messages = w >= 0 ? z.messages.slice(0, w + 1) : []
        }
        if (!q.forkSession && z.sessionId) {
            if (mP(Yj(z.sessionId)), K) await Hy()
        }
        return _c1(z, A), z.messages
    } catch (Y) {
        K1(Y instanceof Error ? Y : Error(String(Y)));
        let z = Y instanceof Error ? `Failed to resume session: ${Y.message}` : "Failed to resume session with --print mode";
        return Ev6(z, q.outputFormat), w3(1), []
    }
    return await PP("startup")
}
// @from(Ln 464025, Col 0)
function IJz(A, q) {
    let K;
    if (typeof A === "string")
        if (A.trim() !== "") K = iMA([Q1({
            type: "user",
            session_id: "",
            message: {
                role: "user",
                content: A
            },
            parent_tool_use_id: null
        })]);
        else K = iMA([]);
    else K = A;
    return q.sdkUrl ? new FQA(q.sdkUrl, K, q.replayUserMessages) : new Mc1(K, q.replayUserMessages)
}
// @from(Ln 464041, Col 0)
async function FMq({
    message: A,
    setAppState: q,
    onEnqueued: K
}) {
    if (A.response.subtype === "success" && A.response.response?.toolUseID && typeof A.response.response.toolUseID === "string") {
        let Y = A.response.response,
            {
                toolUseID: z
            } = Y;
        if (!z) return !1;
        let w = await YFA(z);
        if (w) return q((H) => ({
            ...H,
            queuedCommands: [...H.queuedCommands, {
                mode: "orphaned-permission",
                value: [],
                orphanedPermission: {
                    permissionResult: Y,
                    assistantMessage: w
                }
            }]
        })), K?.(), !0
    }
    return !1
}
// @from(Ln 464068, Col 0)
function lQA(A) {
    return {
        ...A,
        scope: "dynamic"
    }
}
// @from(Ln 464074, Col 0)
async function QMq(A, q, K, Y) {
    let z = {},
        w = {};
    for (let [M, P] of Object.entries(A))
        if (P.type === "sdk") z[M] = P;
        else w[M] = P;
    let H = new Set(Object.keys(q.configs)),
        $ = new Set(Object.keys(z)),
        O = [],
        _ = [],
        J = {
            ...q.configs
        },
        X = [...q.clients],
        D = [...q.tools];
    for (let M of H)
        if (!$.has(M)) {
            let P = X.find((G) => G.name === M);
            if (P && P.type === "connected") await P.cleanup();
            X = X.filter((G) => G.name !== M);
            let W = `mcp__${M}__`;
            D = D.filter((G) => !G.name.startsWith(W)), delete J[M], _.push(M)
        } for (let [M, P] of Object.entries(z))
        if (!H.has(M)) {
            J[M] = P;
            let W = {
                type: "pending",
                name: M,
                config: {
                    ...P,
                    scope: "dynamic"
                }
            };
            X = [...X, W], O.push(M)
        } let j = await gMq(w, K, Y);
    return {
        response: {
            added: [...O, ...j.response.added],
            removed: [..._, ...j.response.removed],
            errors: j.response.errors
        },
        newSdkState: {
            configs: J,
            clients: X,
            tools: D
        },
        newDynamicState: j.newState,
        sdkServersChanged: O.length > 0 || _.length > 0
    }
}
// @from(Ln 464124, Col 0)
async function gMq(A, q, K) {
    let Y = new Set(Object.keys(q.configs)),
        z = new Set(Object.keys(A)),
        w = [...Y].filter((W) => !z.has(W)),
        H = [...z].filter((W) => !Y.has(W)),
        O = [...Y].filter((W) => z.has(W)).filter((W) => {
            let G = q.configs[W],
                f = A[W];
            if (!G || !f) return !0;
            let Z = lQA(f);
            return !do4(G, Z)
        }),
        _ = [],
        J = [],
        X = {},
        D = [...q.clients],
        j = [...q.tools];
    for (let W of [...w, ...O]) {
        let G = D.find((N) => N.name === W),
            f = q.configs[W];
        if (G && f) {
            if (G.type === "connected") try {
                await G.cleanup()
            } catch (N) {
                K1(N instanceof Error ? N : Error(String(N)))
            }
            await Fm(W, f)
        }
        let Z = `mcp__${W}__`;
        if (j = j.filter((N) => !N.name.startsWith(Z)), D = D.filter((N) => N.name !== W), w.includes(W)) _.push(W)
    }
    for (let W of [...H, ...O]) {
        let G = A[W];
        if (!G) continue;
        let f = lQA(G);
        if (G.type === "sdk") {
            J.push(W);
            continue
        }
        try {
            let Z = await iR(W, f);
            if (D.push(Z), Z.type === "connected") {
                let N = await wI(Z);
                j.push(...N)
            } else if (Z.type === "failed") X[W] = Z.error || "Connection failed";
            J.push(W)
        } catch (Z) {
            let N = Z instanceof Error ? Z.message : String(Z);
            X[W] = N, K1(Z instanceof Error ? Z : Error(N))
        }
    }
    let M = {};
    for (let W of z) {
        let G = A[W];
        if (G) M[W] = lQA(G)
    }
    let P = {
        clients: D,
        tools: j,
        configs: M
    };
    return K((W) => {
        let G = new Set([...Object.keys(q.configs), ...Object.keys(M)]),
            f = W.mcp.tools.filter((N) => {
                for (let T of G)
                    if (N.name.startsWith(`mcp__${T}__`)) return !1;
                return !0
            }),
            Z = W.mcp.clients.filter((N) => {
                return !G.has(N.name)
            });
        return {
            ...W,
            mcp: {
                ...W.mcp,
                tools: [...f, ...j],
                clients: [...Z, ...D]
            }
        }
    }), {
        response: {
            added: J,
            removed: _,
            errors: X
        },
        newState: P
    }
}
// @from(Ln 464212, Col 4)
bMq = `<system-reminder>
You are running in non-interactive mode and cannot return a response to the user until your team is shut down.

You MUST shut down your team before preparing your final response:
1. Use requestShutdown to ask each team member to shut down gracefully
2. Wait for shutdown approvals
3. Use the cleanup operation to clean up the team
4. Only then provide your final response to the user

The user cannot receive your response until the team is completely shut down.
</system-reminder>

Shut down your team and prepare your final response for the user.`
// @from(Ln 464225, Col 4)
uMq
// @from(Ln 464226, Col 4)
pMq = v(() => {
    KMq();
    uQA();
    HMq();
    c$();
    $Mq();
    $P();
    u6();
    Z6();
    uv();
    AN();
    y6();
    tSA();
    FU1();
    nW1();
    Sh();
    hK1();
    vMq();
    $J6();
    EMq();
    OJ6();
    w$();
    LMq();
    N7();
    P61();
    dR6();
    cR6();
    Im();
    mV();
    PJ();
    AH();
    xQA();
    G2();
    WB1();
    Rt();
    Em();
    vz();
    p8();
    IQ();
    KOA();
    OJ();
    qp();
    J7();
    B6();
    nB();
    CMq();
    lq();
    Mq1();
    SW();
    nW();
    _T();
    tX();
    PW1();
    nW();
    Tj();
    TM1();
    yN6();
    XuA();
    e7();
    c86();
    B6();
    ZN();
    Jc1();
    k2();
    hU1();
    m6();
    rT6();
    c$();
    hA();
    IMq();
    Cz();
    H$();
    XN();
    vw();
    GR();
    uMq = new Set
})
// @from(Ln 464304, Col 0)
function dMq(A) {
    let q = e(7),
        {
            onDone: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = ff1.default.createElement(I, {
        flexDirection: "column"
    }, ff1.default.createElement(V, null, "Learn more about how to monitor your spending:"), ff1.default.createElement(d7, {
        url: "https://code.claude.com/docs/en/costs"
    })), q[0] = Y;
    else Y = q[0];
    let z;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) z = [{
        value: "ok",
        label: "Got it, thanks!"
    }], q[1] = z;
    else z = q[1];
    let w;
    if (q[2] !== K) w = ff1.default.createElement(kA, {
        options: z,
        onChange: K
    }), q[2] = K, q[3] = w;
    else w = q[3];
    let H;
    if (q[4] !== K || q[5] !== w) H = ff1.default.createElement(w8, {
        title: "You've spent $5 on the Anthropic API this session.",
        onCancel: K
    }, Y, w), q[4] = K, q[5] = w, q[6] = H;
    else H = q[6];
    return H
}
// @from(Ln 464336, Col 4)
ff1
// @from(Ln 464337, Col 4)
cMq = v(() => {
    i1();
    m1();
    wY();
    m1();
    Bq();
    ff1 = o(X1(), 1)
})
// @from(Ln 464349, Col 0)
function iMq() {
    if (JY1++, JY1 === 1) oMq(), mJz()
}
// @from(Ln 464353, Col 0)
function nMq() {
    if (JY1 > 0) JY1--;
    if (JY1 === 0) rMq(), iQA()
}
// @from(Ln 464358, Col 0)
function BJz() {
    JY1 = 0, rMq(), iQA()
}
// @from(Ln 464362, Col 0)
function mJz() {
    if (process.platform !== "darwin") return;
    if (Vf1 !== null) return;
    Vf1 = setInterval(() => {
        if (JY1 > 0) h("Restarting caffeinate to maintain sleep prevention"), iQA(), oMq()
    }, uJz), Vf1.unref()
}
// @from(Ln 464370, Col 0)
function rMq() {
    if (Vf1 !== null) clearInterval(Vf1), Vf1 = null
}
// @from(Ln 464374, Col 0)
function oMq() {
    if (process.platform !== "darwin") return;
    if (qx !== null) return;
    if (!lMq) lMq = !0, Tq(async () => {
        BJz()
    });
    try {
        qx = xJz("caffeinate", ["-i", "-t", String(bJz)], {
            stdio: "ignore"
        }), qx.unref(), qx.on("error", (A) => {
            h(`caffeinate spawn error: ${A.message}`), qx = null
        }), qx.on("exit", () => {
            qx = null
        }), h("Started caffeinate to prevent sleep")
    } catch {
        qx = null
    }
}
// @from(Ln 464393, Col 0)
function iQA() {
    if (qx !== null) {
        try {
            qx.kill(), h("Stopped caffeinate, allowing sleep")
        } catch {}
        qx = null
    }
}
// @from(Ln 464401, Col 4)
bJz = 300
// @from(Ln 464402, Col 4)
uJz = 240000
// @from(Ln 464403, Col 4)
qx = null
// @from(Ln 464404, Col 4)
Vf1 = null
// @from(Ln 464405, Col 4)
JY1 = 0
// @from(Ln 464406, Col 4)
lMq = !1
// @from(Ln 464407, Col 4)
aMq = v(() => {
    Z6();
    Tz()
})
// @from(Ln 464412, Col 0)
function sMq(A) {
    let q = e(7),
        {
            name: K,
            color: Y
        } = A,
        z;
    if (q[0] !== Y) z = qP(Y), q[0] = Y, q[1] = z;
    else z = q[1];
    let w = z,
        H;
    if (q[2] !== K) H = XY1.createElement(V, {
        bold: !0
    }, "@", K), q[2] = K, q[3] = H;
    else H = q[3];
    let $;
    if (q[4] !== w || q[5] !== H) $ = XY1.createElement(I, {
        flexDirection: "row",
        gap: 1
    }, XY1.createElement(V, {
        color: w
    }, gY, " ", H)), q[4] = w, q[5] = H, q[6] = $;
    else $ = q[6];
    return $
}
// @from(Ln 464437, Col 4)
XY1
// @from(Ln 464438, Col 4)
tMq = v(() => {
    i1();
    m1();
    jW();
    Zd();
    XY1 = o(X1(), 1)
})
// @from(Ln 464446, Col 0)
function nQA(A) {
    let q = e(15),
        {
            toolName: K,
            description: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = i3(), q[0] = z;
    else z = q[0];
    let w = z,
        H;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) H = g5(), q[1] = H;
    else H = q[1];
    let $ = H,
        O;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) O = b$(), q[2] = O;
    else O = q[2];
    let _ = O,
        J, X;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) J = Q2.createElement(I, {
        marginBottom: 1
    }, Q2.createElement(c4, null), Q2.createElement(V, {
        color: "warning",
        bold: !0
    }, " ", "Waiting for team lead approval")), X = $ && _ && Q2.createElement(I, {
        marginBottom: 1
    }, Q2.createElement(sMq, {
        name: $,
        color: _
    })), q[3] = J, q[4] = X;
    else J = q[3], X = q[4];
    let D;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) D = Q2.createElement(V, {
        dimColor: !0
    }, "Tool: "), q[5] = D;
    else D = q[5];
    let j;
    if (q[6] !== K) j = Q2.createElement(I, null, D, Q2.createElement(V, null, K)), q[6] = K, q[7] = j;
    else j = q[7];
    let M;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) M = Q2.createElement(V, {
        dimColor: !0
    }, "Action: "), q[8] = M;
    else M = q[8];
    let P;
    if (q[9] !== Y) P = Q2.createElement(I, null, M, Q2.createElement(V, null, Y)), q[9] = Y, q[10] = P;
    else P = q[10];
    let W;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) W = w && Q2.createElement(I, {
        marginTop: 1
    }, Q2.createElement(V, {
        dimColor: !0
    }, "Permission request sent to team ", '"', w, '"', " leader")), q[11] = W;
    else W = q[11];
    let G;
    if (q[12] !== j || q[13] !== P) G = Q2.createElement(I, {
        flexDirection: "column",
        borderStyle: "round",
        borderColor: "warning",
        paddingX: 1
    }, J, X, j, P, W), q[12] = j, q[13] = P, q[14] = G;
    else G = q[14];
    return G
}
// @from(Ln 464510, Col 4)
Q2
// @from(Ln 464511, Col 4)
eMq = v(() => {
    i1();
    m1();
    x2();
    tMq();
    H$();
    Cz();
    Q2 = o(X1(), 1)
})
// @from(Ln 464521, Col 0)
function qPq(A, q = !1) {
    let K = v6((Y) => Y.teamContext);
    APq.useEffect(() => {
        if (!q) bI(A, {
            ...l8() ? {
                teamName: K?.teamName,
                agentName: K?.selfAgentName
            } : {}
        })
    }, [A, q, K?.teamName, K?.selfAgentName])
}
// @from(Ln 464532, Col 4)
APq
// @from(Ln 464533, Col 4)
KPq = v(() => {
    lq();
    d8();
    S9();
    APq = o(X1(), 1)
})
// @from(Ln 464540, Col 0)
function zPq(A) {
    YPq.useEffect(() => {
        if (!A.length) return;
        let q = iV(A);
        if (q) q.client.setNotificationHandler(FJz, async (K) => {
            let {
                eventName: Y,
                eventData: z
            } = K.params;
            c(`tengu_ide_${Y}`, z)
        })
    }, [A])
}
// @from(Ln 464553, Col 4)
YPq
// @from(Ln 464553, Col 9)
FJz
// @from(Ln 464554, Col 4)
wPq = v(() => {
    i7();
    u6();
    q$();
    YPq = o(X1(), 1), FJz = u.object({
        method: u.literal("log_event"),
        params: u.object({
            eventName: u.string(),
            eventData: u.object({}).passthrough()
        })
    })
})
// @from(Ln 464567, Col 0)
function kv6(A) {
    let q = e(26),
        {
            file_path: K,
            edits: Y
        } = A,
        {
            columns: z
        } = Z8(),
        w;
    if (q[0] !== K) w = b1().existsSync(K) ? $J(K) : "", q[0] = K, q[1] = w;
    else w = q[1];
    let H = w,
        $;
    if (q[2] !== Y || q[3] !== H) {
        let P;
        if (q[5] !== H) P = (W) => {
            let G = PK1(H, W.old_string) || W.old_string;
            return {
                ...W,
                old_string: G
            }
        }, q[5] = H, q[6] = P;
        else P = q[6];
        $ = Y.map(P), q[2] = Y, q[3] = H, q[4] = $
    } else $ = q[4];
    let O = $,
        _;
    if (q[7] !== H || q[8] !== K || q[9] !== O) _ = kv({
        filePath: K,
        fileContents: H,
        edits: O
    }), q[7] = H, q[8] = K, q[9] = O, q[10] = _;
    else _ = q[10];
    let J = _,
        X;
    if (q[11] !== H) X = H.split(`
`)[0] ?? null, q[11] = H, q[12] = X;
    else X = q[12];
    let D = X,
        j;
    if (q[13] !== z || q[14] !== H || q[15] !== K || q[16] !== D || q[17] !== J) {
        let P;
        if (q[19] !== z || q[20] !== H || q[21] !== K || q[22] !== D) P = (W) => Fc.createElement(fN, {
            key: W.newStart,
            patch: W,
            dim: !1,
            filePath: K,
            firstLine: D,
            fileContent: H,
            width: z
        }), q[19] = z, q[20] = H, q[21] = K, q[22] = D, q[23] = P;
        else P = q[23];
        j = rR(J.map(P), QJz), q[13] = z, q[14] = H, q[15] = K, q[16] = D, q[17] = J, q[18] = j
    } else j = q[18];
    let M;
    if (q[24] !== j) M = Fc.createElement(I, {
        flexDirection: "column"
    }, Fc.createElement(I, {
        borderDimColor: !0,
        borderColor: "subtle",
        borderStyle: "dashed",
        flexDirection: "column",
        borderLeft: !1,
        borderRight: !1
    }, j)), q[24] = j, q[25] = M;
    else M = q[25];
    return M
}
// @from(Ln 464637, Col 0)
function QJz(A) {
    return Fc.createElement(V, {
        dimColor: !0,
        key: `ellipsis-${A}`
    }, "...")
}
// @from(Ln 464643, Col 4)
Fc
// @from(Ln 464644, Col 4)
rQA = v(() => {
    i1();
    jt();
    m1();
    wp();
    wq();
    _8();
    WK1();
    mq();
    Fc = o(X1(), 1)
})
// @from(Ln 464656, Col 0)
function l_(A) {
    c("tengu_unary_event", {
        event: A.event,
        completion_type: A.completion_type,
        language_name: A.metadata.language_name,
        message_id: A.metadata.message_id,
        platform: A.metadata.platform,
        ...A.metadata.hasFeedback !== void 0 && {
            hasFeedback: A.metadata.hasFeedback
        }
    })
}
// @from(Ln 464668, Col 4)
DY1 = v(() => {
    u6()
})
// @from(Ln 464672, Col 0)
function Ny(A, q) {
    let K = L7();
    HPq.useEffect(() => {
        K((z) => ({
            ...z,
            attribution: {
                ...z.attribution,
                permissionPromptCount: z.attribution.permissionPromptCount + 1
            }
        })), c("tengu_tool_use_show_permission_request", {
            messageID: A.assistantMessage.message.id,
            toolName: AK(A.tool.name),
            isMcp: A.tool.isMcp ?? !1,
            decisionReasonType: A.permissionResult.decisionReason?.type,
            sandboxEnabled: b8.isSandboxingEnabled()
        }), Promise.resolve(q.language_name).then((z) => {
            l_({
                completion_type: q.completion_type,
                event: "response",
                metadata: {
                    language_name: z,
                    message_id: A.assistantMessage.message.id,
                    platform: xA.platform
                }
            })
        })
    }, [A, q, K])
}
// @from(Ln 464700, Col 4)
HPq
// @from(Ln 464701, Col 4)
jY1 = v(() => {
    u6();
    U$();
    wG();
    i0();
    CO();
    G5();
    DY1();
    k2();
    m6();
    d8();
    HPq = o(X1(), 1)
})
// @from(Ln 464722, Col 0)
function pJz(A) {
    let q = g4(A),
        K = g4(`${y8()}/.claude`),
        Y = BN(q),
        z = BN(K);
    return Y.startsWith(z + $Pq.toLowerCase()) || Y.startsWith(z + "/")
}
// @from(Ln 464730, Col 0)
function dJz(A) {
    let q = g4(A),
        K = `${UJz()}/.claude`,
        Y = BN(q),
        z = BN(K);
    return Y.startsWith(z + $Pq.toLowerCase()) || Y.startsWith(z + "/")
}
// @from(Ln 464738, Col 0)
function OPq({
    filePath: A,
    toolPermissionContext: q,
    operationType: K = "write",
    onRejectFeedbackChange: Y,
    onAcceptFeedbackChange: z,
    yesInputMode: w = !1,
    noInputMode: H = !1
}) {
    let $ = [],
        O = m0("chat:cycleMode", "Chat", "shift+tab");
    if (w && z) $.push({
        type: "input",
        label: "Yes",
        value: "yes",
        placeholder: "and tell Claude what to do next",
        onChange: z,
        allowEmptySubmitToCancel: !0,
        option: {
            type: "accept-once"
        }
    });
    else $.push({
        label: "Yes",
        value: "yes",
        option: {
            type: "accept-once"
        }
    });
    let _ = EI(A, q),
        J = pJz(A),
        X = dJz(A);
    if ((J || X) && K !== "read") $.push({
        label: "Yes, and allow Claude to edit its own settings for this session",
        value: "yes-claude-folder",
        option: {
            type: "accept-session",
            scope: X ? "global-claude-folder" : "claude-folder"
        }
    });
    else {
        let D;
        if (_)
            if (K === "read") D = "Yes, during this session";
            else D = z11.default.createElement(V, null, "Yes, allow all edits during this session", " ", z11.default.createElement(V, {
                bold: !0
            }, "(", O, ")"));
        else {
            let j = fQ(A),
                M = gJz(j) || "this directory";
            if (K === "read") D = z11.default.createElement(V, null, "Yes, allow reading from ", z11.default.createElement(V, {
                bold: !0
            }, M, "/"), " during this session");
            else D = z11.default.createElement(V, null, "Yes, allow all edits in ", z11.default.createElement(V, {
                bold: !0
            }, M, "/"), " during this session ", z11.default.createElement(V, {
                bold: !0
            }, "(", O, ")"))
        }
        $.push({
            label: D,
            value: "yes-session",
            option: {
                type: "accept-session"
            }
        })
    }
    if (H && Y) $.push({
        type: "input",
        label: "No",
        value: "no",
        placeholder: "and tell Claude what to do differently",
        onChange: Y,
        allowEmptySubmitToCancel: !0,
        option: {
            type: "reject"
        }
    });
    else $.push({
        label: "No",
        value: "no",
        option: {
            type: "reject"
        }
    });
    return $
}
// @from(Ln 464825, Col 4)
z11
// @from(Ln 464826, Col 4)
_Pq = v(() => {
    m1();
    E2();
    s2();
    Ez();
    B6();
    z11 = o(X1(), 1)
})
// @from(Ln 464835, Col 0)
function oQA(A, q, K, Y, z) {
    l_({
        completion_type: q,
        event: A,
        metadata: {
            language_name: K,
            message_id: Y,
            platform: xA.platform,
            hasFeedback: z ?? !1
        }
    })
}
// @from(Ln 464848, Col 0)
function cJz(A, q) {
    let {
        messageId: K,
        toolUseConfirm: Y,
        onDone: z,
        completionType: w,
        languageName: H
    } = A;
    oQA("accept", w, H, K), c("tengu_accept_submitted", {
        toolName: AK(Y.tool.name),
        isMcp: Y.tool.isMcp ?? !1,
        has_instructions: !!q?.feedback,
        instructions_length: q?.feedback?.length ?? 0,
        entered_feedback_mode: q?.enteredFeedbackMode ?? !1
    }), z(), Y.onAllow(Y.input, [], q?.feedback)
}
// @from(Ln 464865, Col 0)
function lJz(A, q) {
    let {
        messageId: K,
        path: Y,
        toolUseConfirm: z,
        toolPermissionContext: w,
        onDone: H,
        completionType: $,
        languageName: O,
        operationType: _
    } = A;
    if (oQA("accept", $, O, K), q?.scope === "claude-folder" || q?.scope === "global-claude-folder") {
        let X = q.scope === "global-claude-folder" ? fq6 : Zq6,
            D = [{
                type: "addRules",
                rules: [{
                    toolName: bq,
                    ruleContent: X
                }],
                behavior: "allow",
                destination: "session"
            }];
        H(), z.onAllow(z.input, D);
        return
    }
    let J = Y ? IT6(Y, _, w) : [];
    H(), z.onAllow(z.input, J)
}
// @from(Ln 464894, Col 0)
function iJz(A, q) {
    let {
        messageId: K,
        toolUseConfirm: Y,
        onDone: z,
        onReject: w,
        completionType: H,
        languageName: $
    } = A;
    oQA("reject", H, $, K, q?.hasFeedback), c("tengu_reject_submitted", {
        toolName: AK(Y.tool.name),
        isMcp: Y.tool.isMcp ?? !1,
        has_instructions: !!q?.feedback,
        instructions_length: q?.feedback?.length ?? 0,
        entered_feedback_mode: q?.enteredFeedbackMode ?? !1
    }), z(), w(), Y.onReject(q?.feedback)
}
// @from(Ln 464911, Col 4)
JPq
// @from(Ln 464912, Col 4)
XPq = v(() => {
    DY1();
    G5();
    E2();
    u6();
    U$();
    JPq = {
        "accept-once": cJz,
        "accept-session": lJz,
        reject: iJz
    }
})
// @from(Ln 464925, Col 0)
function DPq({
    filePath: A,
    completionType: q,
    languageName: K,
    toolUseConfirm: Y,
    onDone: z,
    onReject: w,
    parseInput: H,
    operationType: $ = "write"
}) {
    let O = v6((g) => g.toolPermissionContext),
        [_, J] = jf.useState(""),
        [X, D] = jf.useState(""),
        [j, M] = jf.useState("yes"),
        [P, W] = jf.useState(!1),
        [G, f] = jf.useState(!1),
        [Z, N] = jf.useState(!1),
        [T, k] = jf.useState(!1),
        y = jf.useMemo(() => OPq({
            filePath: A,
            toolPermissionContext: O,
            operationType: $,
            onRejectFeedbackChange: D,
            onAcceptFeedbackChange: J,
            yesInputMode: P,
            noInputMode: G
        }), [A, O, $, P, G]),
        B = jf.useCallback((g, U, x) => {
            let p = {
                    messageId: Y.assistantMessage.message.id,
                    path: A,
                    toolUseConfirm: Y,
                    toolPermissionContext: O,
                    onDone: z,
                    onReject: w,
                    completionType: q,
                    languageName: K,
                    operationType: $
                },
                l = Y.onAllow;
            Y.onAllow = (s, O1, T1) => {
                l(U, O1, T1)
            };
            let r = JPq[g.type];
            r(p, {
                feedback: x,
                hasFeedback: !!x,
                enteredFeedbackMode: g.type === "accept-once" ? Z : T,
                scope: g.type === "accept-session" ? g.scope : void 0
            })
        }, [A, q, K, Y, O, z, w, $, Z, T]),
        S = jf.useCallback(() => {
            let g = y.find((U) => U.option.type === "accept-session");
            if (g) {
                let U = H(Y.input);
                B(g.option, U)
            }
        }, [y, H, Y.input, B]);
    c7({
        "confirm:cycleMode": S
    }, {
        context: "Confirmation"
    });
    let m = jf.useCallback((g) => {
            if (g !== "yes" && P && !_.trim()) W(!1);
            if (g !== "no" && G && !X.trim()) f(!1);
            M(g)
        }, [P, G, _, X]),
        b = jf.useCallback((g) => {
            let U = {
                toolName: AK(Y.tool.name),
                isMcp: Y.tool.isMcp ?? !1
            };
            if (g === "yes")
                if (P) W(!1), c("tengu_accept_feedback_mode_collapsed", U);
                else W(!0), N(!0), c("tengu_accept_feedback_mode_entered", U);
            else if (g === "no")
                if (G) f(!1), c("tengu_reject_feedback_mode_collapsed", U);
                else f(!0), k(!0), c("tengu_reject_feedback_mode_entered", U)
        }, [P, G, Y]);
    return {
        options: y,
        onChange: B,
        acceptFeedback: _,
        rejectFeedback: X,
        focusedOption: j,
        setFocusedOption: m,
        handleInputModeToggle: b,
        yesInputMode: P,
        noInputMode: G
    }
}
// @from(Ln 465017, Col 4)
jf
// @from(Ln 465018, Col 4)
jPq = v(() => {
    K7();
    _Pq();
    XPq();
    d8();
    u6();
    U$();
    jf = o(X1(), 1)
})