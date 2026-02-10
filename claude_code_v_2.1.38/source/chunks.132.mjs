
// @from(Ln 329255, Col 4)
MJ6 = v(() => {
    P61();
    i7();
    oj();
    PJ();
    N8();
    Zn7();
    lM();
    e7();
    qH();
    hA();
    S9();
    u6();
    At();
    RW();
    N8();
    hM6();
    ra();
    hZ();
    uv();
    bK1();
    _H();
    qEA();
    Sh();
    lq();
    zEA();
    Z6();
    ov();
    d01();
    Cb4();
    Cz();
    QEA();
    Yv();
    $P();
    dEA = o(X1(), 1), KP6 = J6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS), oVY = u.object({
        description: u.string().describe("A short (3-5 word) description of the task"),
        prompt: u.string().describe("The task for the agent to perform"),
        subagent_type: u.string().describe("The type of specialized agent to use for this task"),
        model: u.enum(["sonnet", "opus", "haiku"]).optional().describe(rVY),
        resume: u.string().optional().describe("Optional agent ID to resume from. If provided, the agent will continue from the previous execution transcript."),
        run_in_background: u.boolean().optional().describe(`Set to true to run this agent in the background. The tool result will include an output_file path - use ${Jq} tool or ${h4} tail to check on output.`),
        max_turns: u.number().int().positive().optional().describe("Maximum number of agentic turns (API round-trips) before stopping. Used internally for warmup.")
    }), aVY = u.object({
        name: u.string().optional().describe("Name for the spawned agent"),
        team_name: u.string().optional().describe("Team name for spawning. Uses current team context if omitted."),
        mode: Ew8.optional().describe('Permission mode for spawned teammate (e.g., "plan" to require plan approval).')
    }), xu4 = oVY.merge(aVY), avA = z7(() => KP6 ? xu4.omit({
        run_in_background: !0
    }) : xu4), sVY = u.object({
        agentId: u.string(),
        content: u.array(u.object({
            type: u.literal("text"),
            text: u.string()
        })),
        totalToolUseCount: u.number(),
        totalDurationMs: u.number(),
        totalTokens: u.number(),
        usage: u.object({
            input_tokens: u.number(),
            output_tokens: u.number(),
            cache_creation_input_tokens: u.number().nullable(),
            cache_read_input_tokens: u.number().nullable(),
            server_tool_use: u.object({
                web_search_requests: u.number(),
                web_fetch_requests: u.number()
            }).nullable(),
            service_tier: u.enum(["standard", "priority", "batch"]).nullable(),
            cache_creation: u.object({
                ephemeral_1h_input_tokens: u.number(),
                ephemeral_5m_input_tokens: u.number()
            }).nullable()
        })
    }), tVY = sVY.extend({
        status: u.literal("completed"),
        prompt: u.string()
    }), eVY = u.object({
        status: u.literal("async_launched"),
        agentId: u.string().describe("The ID of the async agent"),
        description: u.string().describe("The description of the task"),
        prompt: u.string().describe("The prompt for the agent"),
        outputFile: u.string().describe("Path to the output file for checking agent progress")
    }), ANY = z7(() => u.union([tVY, eVY, Vn7]));
    rj1 = {
        async prompt({
            agents: A,
            tools: q,
            getToolPermissionContext: K,
            allowedAgentTypes: Y
        }) {
            let z = await K(),
                w = [];
            for (let _ of q)
                if (_.name?.startsWith("mcp__")) {
                    let X = _.name.split("__")[1];
                    if (X && !w.includes(X)) w.push(X)
                } let H = un7(A, w),
                $ = pEA(H, z, fK);
            return await Gn7($, !1, Y)
        },
        name: fK,
        maxResultSizeChars: 1e5,
        async description() {
            return "Launch a new task"
        },
        get inputSchema() {
            return avA()
        },
        get outputSchema() {
            return ANY()
        },
        async call({
            prompt: A,
            subagent_type: q,
            description: K,
            model: Y,
            resume: z,
            run_in_background: w,
            max_turns: H,
            name: $,
            team_name: O,
            mode: _
        }, J, X, D, j) {
            let M = Date.now(),
                P = await J.getAppState(),
                W = P.toolPermissionContext.mode;
            if (O && !l8()) throw Error("Agent Teams is not yet available on your plan.");
            let G = KNY({
                team_name: O
            }, P);
            if (MM() && G) {
                if ($) throw Error("In-process teammates cannot spawn other teammates. Only the team leader can spawn teammates.");
                if (w === !0) throw Error("In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents.")
            }
            if (G && $) {
                if (q) {
                    let O1 = J.options.agentDefinitions.activeAgents.find((T1) => T1.agentType === q);
                    if (O1?.color) xK1(q, O1.color)
                }
                let r = await Iu4({
                    name: $,
                    prompt: A,
                    description: K,
                    team_name: G,
                    use_splitpane: !0,
                    plan_mode_required: _ === "plan",
                    model: Y,
                    agent_type: q
                }, J);
                return {
                    data: {
                        status: "teammate_spawned",
                        prompt: A,
                        ...r.data
                    }
                }
            }
            let f = J.options.agentDefinitions.activeAgents,
                {
                    allowedAgentTypes: Z
                } = J.options.agentDefinitions,
                N = pEA(Z ? f.filter((r) => Z.includes(r.agentType)) : f, P.toolPermissionContext, fK),
                T = N.find((r) => r.agentType === q);
            if (!T) {
                if (f.find((s) => s.agentType === q)) {
                    let s = cEA(P.toolPermissionContext, fK, q);
                    throw Error(`Agent type '${q}' has been denied by permission rule '${fK}(${q})' from ${s?.source??"settings"}.`)
                }
                throw Error(`Agent type '${q}' not found. Available agents: ${N.map((s)=>s.agentType).join(", ")}`)
            }
            if (T.requiredMcpServers?.length) {
                let r = [];
                for (let s of P.mcp.tools)
                    if (s.name?.startsWith("mcp__")) {
                        let T1 = s.name.split("__")[1];
                        if (T1 && !r.includes(T1)) r.push(T1)
                    } if (!KPA(T, r)) {
                    let s = T.requiredMcpServers.filter((O1) => !r.some((T1) => T1.toLowerCase().includes(O1.toLowerCase())));
                    throw Error(`Agent '${q}' requires MCP servers matching: ${s.join(", ")}. MCP servers with tools: ${r.length>0?r.join(", "):"none"}. Use /mcp to configure and authenticate the required MCP servers.`)
                }
            }
            if (T.color) xK1(q, T.color);
            let k = Uq6(T.model, J.options.mainLoopModel, Y, W, T.agentType);
            c("tengu_agent_tool_selected", {
                agent_type: T.agentType,
                model: k,
                source: T.source,
                color: T.color,
                is_built_in_agent: iD(T)
            });
            let y;
            if (z) {
                let r = P.tasks[z];
                if (r && r.status === "running") throw Error(`Cannot resume agent ${z}: it is still running. Use TaskStop to stop it first, or wait for it to complete.`);
                let s = await sP1(xZ(z));
                if (!s) throw Error(`No transcript found for agent ID: ${z}`);
                y = BQ1(mQ1(wP6(s)))
            }
            let B = T?.forkContext ? J.messages : void 0,
                S;
            try {
                let r = Array.from(P.toolPermissionContext.additionalWorkingDirectories.keys()),
                    s = T.getSystemPrompt({
                        toolUseContext: J
                    });
                if (T.memory) c("tengu_agent_memory_loaded", {
                    ...{},
                    scope: T.memory,
                    source: "subagent"
                });
                S = await NQ1([s], k, r)
            } catch (r) {
                h(`Failed to get system prompt for agent ${T.agentType}: ${r instanceof Error?r.message:String(r)}`)
            }
            let m = T?.forkContext ? Nn7(A, D) : [c6({
                    content: A
                })],
                b = {
                    prompt: A,
                    resolvedAgentModel: k,
                    isBuiltInAgent: iD(T),
                    startTime: M,
                    agentType: T.agentType
                },
                g = !1,
                U = (w === !0 || g) && !KP6,
                x = {
                    ...P.toolPermissionContext,
                    mode: T.permissionMode ?? "acceptEdits"
                },
                p = YP6(x, P.mcp.tools),
                l = {
                    agentDefinition: T,
                    promptMessages: y ? [...y, ...m] : m,
                    toolUseContext: J,
                    canUseTool: X,
                    forkContextMessages: B,
                    isAsync: U,
                    ...g ? {
                        canShowPermissionPrompts: !0
                    } : {},
                    querySource: J.options.querySource ?? fb4(T.agentType, iD(T)),
                    model: Y,
                    maxTurns: H,
                    override: S ? {
                        systemPrompt: S
                    } : void 0,
                    availableTools: p
                };
            if (U) {
                let r = z || NR(),
                    s = zd7({
                        agentId: r,
                        description: K,
                        prompt: A,
                        selectedAgent: T,
                        setAppState: J.setAppState,
                        parentAbortController: J.abortController
                    }),
                    O1 = {
                        agentId: r,
                        parentSessionId: Dr(),
                        agentType: "subagent",
                        subagentName: T.agentType,
                        isBuiltIn: iD(T)
                    };
                return p01(O1, async () => {
                    let T1;
                    try {
                        let N1 = [],
                            j1 = YB1(),
                            q1 = wB1(J.options.tools);
                        for await (let D1 of dR({
                            ...l,
                            override: {
                                ...l.override,
                                agentId: xZ(s.agentId),
                                abortController: s.abortController
                            },
                            onCacheSafeParams: g ? (Z1) => {
                                let {
                                    stop: E1
                                } = yb4(s.agentId, xZ(s.agentId), Z1, J.setAppState);
                                T1 = E1
                            } : void 0
                        })) N1.push(D1), Qj1(j1, D1, q1, J.options.tools), RjA(s.agentId, zB1(j1), J.setAppState);
                        T1?.();
                        let t = UEA(N1, s.agentId, b),
                            J1 = t.content.filter((D1) => D1.type === "text").map((D1) => D1.text).join(`
`);
                        yjA(t, J.setAppState), vK1(s.agentId, K, "completed", void 0, J.setAppState, J1, {
                            totalTokens: t.totalTokens,
                            toolUses: t.totalToolUseCount,
                            durationMs: t.totalDurationMs
                        })
                    } catch (N1) {
                        if (T1?.(), N1 instanceof dz) {
                            if (na(s.agentId, J.setAppState)) vK1(s.agentId, K, "killed", void 0, J.setAppState);
                            return
                        }
                        let j1 = N1 instanceof Error ? N1.message : String(N1);
                        CjA(s.agentId, j1, J.setAppState), vK1(s.agentId, K, "failed", j1, J.setAppState)
                    }
                }), {
                    data: {
                        isAsync: !0,
                        status: "async_launched",
                        agentId: s.agentId,
                        description: K,
                        prompt: A,
                        outputFile: ww(s.agentId)
                    }
                }
            } else {
                let r = z ? xZ(z) : NR(),
                    s = {
                        agentId: r,
                        parentSessionId: Dr(),
                        agentType: "subagent",
                        subagentName: T.agentType,
                        isBuiltIn: iD(T)
                    };
                return p01(s, async () => {
                    let O1 = [],
                        T1 = [],
                        N1 = Date.now();
                    if (m[0] && m[0].type === "user") {
                        let a = iO(m),
                            A1 = a.find((M1) => M1.type === "user");
                        if (A1 && A1.type === "user" && j) j({
                            toolUseID: `agent_${D.message.id}`,
                            data: {
                                message: A1,
                                normalizedMessages: a,
                                type: "agent_progress",
                                prompt: A,
                                resume: z,
                                agentId: r
                            }
                        })
                    }
                    let j1, q1;
                    if (!KP6) {
                        let a = wd7({
                            agentId: r,
                            description: K,
                            prompt: A,
                            selectedAgent: T,
                            setAppState: J.setAppState
                        });
                        j1 = a.taskId, q1 = a.backgroundSignal
                    }
                    let t = !1,
                        J1 = dR({
                            ...l,
                            override: {
                                ...l.override,
                                agentId: r
                            }
                        })[Symbol.asyncIterator](),
                        D1;
                    try {
                        while (!0) {
                            let a = Date.now() - N1;
                            if (!KP6 && !t && a >= nVY && J.setToolJSX) t = !0, J.setToolJSX({
                                jsx: dEA.createElement(gM6, null),
                                shouldHidePromptInput: !1,
                                shouldContinueAnimation: !0,
                                showSpinner: !0
                            });
                            let A1 = J1.next(),
                                M1 = q1 ? await Promise.race([A1.then(($1) => ({
                                    type: "message",
                                    result: $1
                                })), q1.then(() => ({
                                    type: "background"
                                }))]) : await A1.then(($1) => ({
                                    type: "message",
                                    result: $1
                                }));
                            if (M1.type === "background" && j1) {
                                let G1 = (await J.getAppState()).tasks[j1];
                                if (ia(G1) && G1.isBackgrounded) {
                                    let L1 = j1;
                                    return p01(s, async () => {
                                        try {
                                            let x1 = YB1(),
                                                f1 = wB1(J.options.tools);
                                            for (let A6 of O1) Qj1(x1, A6, f1, J.options.tools);
                                            for await (let A6 of dR({
                                                ...l,
                                                isAsync: !0,
                                                override: {
                                                    ...l.override,
                                                    agentId: xZ(L1),
                                                    abortController: G1.abortController
                                                }
                                            })) O1.push(A6), Qj1(x1, A6, f1, J.options.tools), RjA(L1, zB1(x1), J.setAppState);
                                            let R1 = UEA(O1, L1, b),
                                                H1 = R1.content.filter((A6) => A6.type === "text").map((A6) => A6.text).join(`
`),
                                                y1 = await J.getAppState(),
                                                B1 = await classifyHandoffIfNeeded({
                                                    agentMessages: O1,
                                                    toolPermissionContext: y1.toolPermissionContext,
                                                    abortSignal: G1.abortController.signal,
                                                    isNonInteractiveSession: J.options.isNonInteractiveSession,
                                                    subagentType: q,
                                                    totalToolUseCount: R1.totalToolUseCount
                                                });
                                            if (B1) H1 = `${B1}

${H1}`;
                                            yjA(R1, J.setAppState), vK1(L1, K, "completed", void 0, J.setAppState, H1, {
                                                totalTokens: R1.totalTokens,
                                                toolUses: R1.totalToolUseCount,
                                                durationMs: R1.totalDurationMs
                                            })
                                        } catch (x1) {
                                            if (x1 instanceof dz) {
                                                if (na(L1, J.setAppState)) vK1(L1, K, "killed", void 0, J.setAppState);
                                                return
                                            }
                                            let f1 = x1 instanceof Error ? x1.message : String(x1);
                                            CjA(L1, f1, J.setAppState), vK1(L1, K, "failed", f1, J.setAppState)
                                        }
                                    }), {
                                        data: {
                                            isAsync: !0,
                                            status: "async_launched",
                                            agentId: L1,
                                            description: K,
                                            prompt: A,
                                            outputFile: ww(L1)
                                        }
                                    }
                                }
                            }
                            if (M1.type !== "message") continue;
                            let {
                                result: z1
                            } = M1;
                            if (z1.done) break;
                            let Y1 = z1.value;
                            if (O1.push(Y1), Y1.type !== "assistant" && Y1.type !== "user") continue;
                            if (Y1.type === "assistant") {
                                let $1 = Lw6(Y1);
                                if ($1 > 0) J.setResponseLength((G1) => G1 + $1)
                            }
                            let _1 = iO([Y1]);
                            T1.push(..._1);
                            for (let $1 of _1)
                                for (let G1 of $1.message.content) {
                                    if (G1.type !== "tool_use" && G1.type !== "tool_result") continue;
                                    if (j) j({
                                        toolUseID: `agent_${D.message.id}`,
                                        data: {
                                            message: $1,
                                            normalizedMessages: T1,
                                            type: "agent_progress",
                                            prompt: A,
                                            resume: z,
                                            agentId: r
                                        }
                                    })
                                }
                        }
                    } catch (a) {
                        if (a instanceof dz) throw a;
                        h(`Sync agent error: ${a instanceof Error?a.message:String(a)}`, {
                            level: "error"
                        }), D1 = a instanceof Error ? a : Error(String(a))
                    } finally {
                        if (J.setToolJSX) J.setToolJSX(null);
                        if (j1) $d7(j1, J.setAppState)
                    }
                    let Z1 = gP(O1.filter((a) => a.type !== "system" && a.type !== "progress"));
                    if (Z1 && zP6(Z1)) throw new dz;
                    if (D1) {
                        if (!O1.some((A1) => A1.type === "assistant")) throw D1;
                        h(`Sync agent recovering from error with ${O1.length} messages`)
                    }
                    let E1 = UEA(O1, r, b);
                    return {
                        data: {
                            status: "completed",
                            prompt: A,
                            ...E1
                        }
                    }
                })
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
        userFacingName: rvA,
        userFacingNameBackgroundColor: ovA,
        getActivityDescription(A) {
            return A?.description ?? "Running task"
        },
        async checkPermissions(A, q) {
            let K = await q.getAppState();
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            let K = A;
            if (typeof K === "object" && K !== null && "status" in K && K.status === "teammate_spawned") {
                let Y = K;
                return {
                    tool_use_id: q,
                    type: "tool_result",
                    content: [{
                        type: "text",
                        text: `Spawned successfully.
agent_id: ${Y.teammate_id}
name: ${Y.name}
team_name: ${Y.team_name}
The agent is now running and will receive instructions via mailbox.`
                    }]
                }
            }
            if (A.status === "async_launched") {
                let Y = `Async agent launched successfully.
agentId: ${A.agentId} (internal ID - do not mention to user. Use to resume later if needed.)
The agent is working in the background. You will be notified automatically when it completes.`,
                    z = `Continue with other tasks.
output_file: ${A.outputFile}
To check progress before completion (optional), use ${Jq} or ${h4} tail on the output file.`,
                    w = `${Y}
${z}`;
                return {
                    tool_use_id: q,
                    type: "tool_result",
                    content: [{
                        type: "text",
                        text: w
                    }]
                }
            }
            if (A.status === "completed") return {
                tool_use_id: q,
                type: "tool_result",
                content: [...A.content, {
                    type: "text",
                    text: `agentId: ${A.agentId} (for resuming to continue this agent's work if needed)
<usage>total_tokens: ${A.totalTokens}
tool_uses: ${A.totalToolUseCount}
duration_ms: ${A.totalDurationMs}</usage>`
                }]
            };
            throw Error(`Unexpected agent tool result status: ${A.status}`)
        },
        renderToolResultMessage: Hb4,
        renderToolUseMessage: $b4,
        renderToolUseTag: Ob4,
        renderToolUseProgressMessage: rP1,
        renderToolUseRejectedMessage: _b4,
        renderToolUseErrorMessage: Jb4,
        renderGroupedToolUse: Xb4
    }
})
// @from(Ln 329826, Col 0)
function bu4(A) {
    if ("status" in A && A.status === "forked") return T5.createElement(HA, {
        height: 1
    }, T5.createElement(V, null, T5.createElement(oA, null, ["Done"])));
    let q = ["Successfully loaded skill"];
    if ("allowedTools" in A && A.allowedTools && A.allowedTools.length > 0) {
        let K = A.allowedTools.length;
        q.push(`${K} tool${K===1?"":"s"} allowed`)
    }
    if ("model" in A && A.model) q.push(A.model);
    return T5.createElement(HA, {
        height: 1
    }, T5.createElement(V, null, T5.createElement(oA, null, q)))
}
// @from(Ln 329841, Col 0)
function uu4({
    skill: A
}, {
    commands: q
}) {
    if (!A) return null;
    return q?.find((z) => z.name === A)?.loadedFrom === "commands_DEPRECATED" ? `/${A}` : A
}
// @from(Ln 329850, Col 0)
function HP6(A, {
    tools: q,
    verbose: K
}) {
    if (!A.length) return T5.createElement(HA, {
        height: 1
    }, T5.createElement(V, {
        dimColor: !0
    }, zNY));
    let Y = K ? A : A.slice(-YNY),
        z = A.length - Y.length;
    return T5.createElement(HA, null, T5.createElement(I, {
        flexDirection: "column"
    }, T5.createElement(mx1, null, Y.map((w) => T5.createElement(I, {
        key: w.uuid,
        height: 1,
        overflow: "hidden"
    }, T5.createElement(pR, {
        message: w.data.message,
        lookups: vm,
        addMargin: !1,
        tools: q,
        commands: [],
        verbose: K,
        inProgressToolUseIDs: new Set,
        progressMessagesForMessage: A,
        shouldAnimate: !1,
        shouldShowDot: !1,
        style: "condensed",
        isTranscriptMode: !1,
        isStatic: !0
    })))), z > 0 && T5.createElement(V, {
        dimColor: !0
    }, "+", z, " more tool ", z === 1 ? "use" : "uses")))
}
// @from(Ln 329886, Col 0)
function Bu4(A, {
    progressMessagesForMessage: q,
    tools: K,
    verbose: Y
}) {
    return T5.createElement(T5.Fragment, null, HP6(q, {
        tools: K,
        verbose: Y
    }), T5.createElement(Y9, null))
}
// @from(Ln 329897, Col 0)
function mu4(A, {
    progressMessagesForMessage: q,
    tools: K,
    verbose: Y
}) {
    return T5.createElement(T5.Fragment, null, HP6(q, {
        tools: K,
        verbose: Y
    }), T5.createElement(z5, {
        result: A,
        verbose: Y
    }))
}
// @from(Ln 329910, Col 4)
T5
// @from(Ln 329910, Col 8)
YNY = 3
// @from(Ln 329911, Col 4)
zNY = "Initializing…"
// @from(Ln 329912, Col 4)
Fu4 = v(() => {
    m1();
    UO();
    CX();
    eq();
    HK();
    nP1();
    no();
    N8();
    T5 = o(X1(), 1)
})
// @from(Ln 329924, Col 0)
function Qu4(A, q) {
    if (!q) return A;
    return A.map((K) => {
        if (K.type === "user") return {
            ...K,
            sourceToolUseID: q
        };
        return K
    })
}
// @from(Ln 329935, Col 0)
function gu4(A, q) {
    let K = A.message.content.find((Y) => Y.type === "tool_use" && Y.name === q);
    return K && K.type === "tool_use" ? K.id : void 0
}
// @from(Ln 329939, Col 0)
async function wNY(A, q, K, Y, z, w, H) {
    let $ = Date.now(),
        O = NR(),
        _ = Uu4(A);
    c("tengu_skill_tool_invocation", {
        command_name: "custom",
        execution_context: "fork",
        ...!1,
        ...A.pluginInfo && {
            plugin_name: _ ? A.pluginInfo.pluginManifest.name : "third-party",
            plugin_repository: _ ? A.pluginInfo.repository : "third-party"
        }
    });
    let {
        modifiedGetAppState: J,
        baseAgent: X,
        promptMessages: D,
        skillContent: j
    } = await mM6(A, K || "", Y), M = [];
    h(`SkillTool executing forked skill ${q} with agent ${X.agentType}`);
    for await (let G of dR({
        agentDefinition: X,
        promptMessages: D,
        toolUseContext: {
            ...Y,
            getAppState: J
        },
        canUseTool: z,
        isAsync: !1,
        querySource: "agent:custom",
        model: A.model,
        availableTools: Y.options.tools
    })) if (M.push(G), (G.type === "assistant" || G.type === "user") && H) {
        let f = iO(M);
        for (let Z of iO([G]))
            if (Z.message.content.some((T) => T.type === "tool_use" || T.type === "tool_result")) H({
                toolUseID: `skill_${w.message.id}`,
                data: {
                    message: Z,
                    normalizedMessages: f,
                    type: "skill_progress",
                    prompt: j,
                    agentId: O
                }
            })
    }
    let P = FM6(M, "Skill execution completed"),
        W = Date.now() - $;
    return h(`SkillTool forked skill ${q} completed in ${W}ms`), {
        data: {
            success: !0,
            commandName: q,
            status: "forked",
            agentId: O,
            result: P
        }
    }
}
// @from(Ln 329998, Col 0)
function XNY(A) {
    for (let q of Object.keys(A)) {
        if (JNY.has(q)) continue;
        let K = A[q];
        if (K === void 0 || K === null) continue;
        if (Array.isArray(K) && K.length === 0) continue;
        if (typeof K === "object" && !Array.isArray(K) && Object.keys(K).length === 0) continue;
        return !1
    }
    return !0
}
// @from(Ln 330010, Col 0)
function Uu4(A) {
    if (A.source !== "plugin" || !A.pluginInfo?.repository) return !1;
    let q = A.pluginInfo.repository.lastIndexOf("@");
    if (q <= 0) return !1;
    let K = A.pluginInfo.repository.slice(q + 1);
    return NT.has(K)
}
// @from(Ln 330017, Col 4)
HNY
// @from(Ln 330017, Col 9)
$NY
// @from(Ln 330017, Col 14)
ONY
// @from(Ln 330017, Col 19)
_NY
// @from(Ln 330017, Col 24)
wt
// @from(Ln 330017, Col 28)
JNY
// @from(Ln 330018, Col 4)
$P6 = v(() => {
    i7();
    c$();
    N0();
    B6();
    PJ();
    BM6();
    du1();
    Fu4();
    u6();
    Z6();
    B6();
    d01();
    m6();
    vz();
    svA();
    At();
    Sh();
    YI();
    N8();
    uM6();
    HNY = z7(() => u.object({
        skill: u.string().describe('The skill name. E.g., "commit", "review-pr", or "pdf"'),
        args: u.string().optional().describe("Optional arguments for the skill")
    })), $NY = u.object({
        success: u.boolean().describe("Whether the skill is valid"),
        commandName: u.string().describe("The name of the skill"),
        allowedTools: u.array(u.string()).optional().describe("Tools allowed by this skill"),
        model: u.string().optional().describe("Model override if specified"),
        status: u.literal("inline").optional().describe("Execution status")
    }), ONY = u.object({
        success: u.boolean().describe("Whether the skill completed successfully"),
        commandName: u.string().describe("The name of the skill"),
        status: u.literal("forked").describe("Execution status"),
        agentId: u.string().describe("The ID of the sub-agent that executed the skill"),
        result: u.string().describe("The result from the forked skill execution")
    }), _NY = z7(() => u.union([$NY, ONY])), wt = {
        name: NJ,
        maxResultSizeChars: 1e5,
        get inputSchema() {
            return HNY()
        },
        get outputSchema() {
            return _NY()
        },
        description: async ({
            skill: A
        }) => `Execute skill: ${A}`,
        prompt: async () => d0A(ZO()),
        userFacingName: () => NJ,
        isConcurrencySafe: () => !1,
        isEnabled: () => !0,
        isReadOnly: () => !1,
        async validateInput({
            skill: A
        }, q) {
            let K = A.trim();
            if (!K) return {
                result: !1,
                message: `Invalid skill format: ${A}`,
                errorCode: 1
            };
            let Y = K.startsWith("/");
            if (Y) c("tengu_skill_tool_slash_prefix", {});
            let z = Y ? K.substring(1) : K,
                w = await cZ(ZO());
            if (!Sd(z, w)) return {
                result: !1,
                message: `Unknown skill: ${z}`,
                errorCode: 2
            };
            let H = zI(z, w);
            if (!H) return {
                result: !1,
                message: `Could not load skill: ${z}`,
                errorCode: 3
            };
            if (H.disableModelInvocation) return {
                result: !1,
                message: `Skill ${z} cannot be used with ${NJ} tool due to disable-model-invocation`,
                errorCode: 4
            };
            if (H.type !== "prompt") return {
                result: !1,
                message: `Skill ${z} is not a prompt-based skill`,
                errorCode: 5
            };
            return {
                result: !0
            }
        },
        async checkPermissions({
            skill: A,
            args: q
        }, K) {
            let Y = A.trim(),
                z = Y.startsWith("/") ? Y.substring(1) : Y,
                H = (await K.getAppState()).toolPermissionContext,
                $ = await cZ(ZO()),
                O = zI(z, $),
                _ = (j) => {
                    let M = j.startsWith("/") ? j.substring(1) : j;
                    if (M === z) return !0;
                    if (M.endsWith(":*")) {
                        let P = M.slice(0, -2);
                        return z.startsWith(P)
                    }
                    return !1
                },
                J = XI(H, wt, "deny");
            for (let [j, M] of J.entries())
                if (_(j)) return {
                    behavior: "deny",
                    message: "Skill execution blocked by permission rules",
                    decisionReason: {
                        type: "rule",
                        rule: M
                    }
                };
            let X = XI(H, wt, "allow");
            for (let [j, M] of X.entries())
                if (_(j)) return {
                    behavior: "allow",
                    updatedInput: {
                        skill: A,
                        args: q
                    },
                    decisionReason: {
                        type: "rule",
                        rule: M
                    }
                };
            if (O?.type === "prompt" && XNY(O)) return {
                behavior: "allow",
                updatedInput: {
                    skill: A,
                    args: q
                },
                decisionReason: void 0
            };
            let D = [{
                type: "addRules",
                rules: [{
                    toolName: NJ,
                    ruleContent: z
                }],
                behavior: "allow",
                destination: "localSettings"
            }, {
                type: "addRules",
                rules: [{
                    toolName: NJ,
                    ruleContent: `${z}:*`
                }],
                behavior: "allow",
                destination: "localSettings"
            }];
            return {
                behavior: "ask",
                message: `Execute skill: ${z}`,
                decisionReason: void 0,
                suggestions: D,
                updatedInput: {
                    skill: A,
                    args: q
                },
                metadata: {
                    command: O
                }
            }
        },
        async call({
            skill: A,
            args: q
        }, K, Y, z, w) {
            let H = A.trim(),
                $ = H.startsWith("/") ? H.substring(1) : H,
                O = await cZ(ZO()),
                _ = zI($, O);
            if (xM6($), _?.type === "prompt" && _.context === "fork") return wNY(_, $, q, K, Y, z, w);
            let J = await Pb4($, q || "", O, K);
            if (!J.shouldQuery) throw Error("Command processing failed");
            let X = J.allowedTools || [],
                D = J.model,
                j = J.maxThinkingTokens,
                M = Cd().has($),
                P = _?.type === "prompt" && Uu4(_);
            c("tengu_skill_tool_invocation", {
                command_name: M || P ? $ : "custom",
                ...!1,
                ..._?.type === "prompt" && _.pluginInfo && {
                    plugin_name: P ? _.pluginInfo.pluginManifest.name : "third-party",
                    plugin_repository: P ? _.pluginInfo.repository : "third-party"
                }
            });
            let G = gu4(z, NJ),
                f = Qu4(J.messages.filter((T) => {
                    if (T.type === "progress") return !1;
                    if (T.type === "user" && "message" in T) {
                        let k = T.message.content;
                        if (typeof k === "string" && k.includes(`<${pP}>`)) return !1
                    }
                    return !0
                }), G);
            h(`SkillTool returning ${f.length} newMessages for skill ${$}`), f.forEach((T, k) => {
                if (T.type === "user" && "message" in T) {
                    let y = typeof T.message.content === "string" ? T.message.content : Q1(T.message.content);
                    h(`  newMessage ${k+1}: ${y.substring(0,150)}...`)
                }
            });
            let Z = f.filter((T) => T.type === "user" && ("message" in T)).map((T) => {
                    let k = T.message.content;
                    return typeof k === "string" ? k : Q1(k)
                }).join(`

`),
                N = _?.type === "prompt" && _.source ? `${_.source}:${$}` : $;
            if (!db1()) MN1($, N, Z);
            if (_?.type === "prompt" && _.hooks) {
                let T = U6();
                IM6(K.setAppState, T, _.hooks, $, _.skillRoot)
            }
            return {
                data: {
                    success: !0,
                    commandName: $,
                    allowedTools: X.length > 0 ? X : void 0,
                    model: D
                },
                newMessages: f,
                contextModifier(T) {
                    let k = T;
                    if (X.length > 0) {
                        let y = k.getAppState;
                        k = {
                            ...k,
                            async getAppState() {
                                let B = await y();
                                return {
                                    ...B,
                                    toolPermissionContext: {
                                        ...B.toolPermissionContext,
                                        alwaysAllowRules: {
                                            ...B.toolPermissionContext.alwaysAllowRules,
                                            command: [...new Set([...B.toolPermissionContext.alwaysAllowRules.command || [], ...X])]
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (D) k = {
                        ...k,
                        options: {
                            ...k.options,
                            mainLoopModel: D
                        }
                    };
                    if (j !== void 0) k = {
                        ...k,
                        options: {
                            ...k.options,
                            maxThinkingTokens: j
                        }
                    };
                    return k
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            if ("status" in A && A.status === "forked") return {
                type: "tool_result",
                tool_use_id: q,
                content: `Skill "${A.commandName}" completed (forked execution).

Result:
${A.result}`
            };
            return {
                type: "tool_result",
                tool_use_id: q,
                content: `Launching skill: ${A.commandName}`
            }
        },
        renderToolResultMessage: bu4,
        renderToolUseMessage: uu4,
        renderToolUseProgressMessage: HP6,
        renderToolUseRejectedMessage: Bu4,
        renderToolUseErrorMessage: mu4
    }, JNY = new Set(["type", "progressMessage", "contentLength", "argNames", "model", "source", "pluginInfo", "disableNonInteractive", "skillRoot", "context", "agent", "getPromptForCommand", "frontmatterKeys", "name", "description", "hasUserSpecifiedDescription", "isEnabled", "isHidden", "aliases", "isMcp", "argumentHint", "whenToUse", "version", "disableModelInvocation", "userInvocable", "loadedFrom", "immediate", "userFacingName"])
})
// @from(Ln 330310, Col 0)
function DNY() {
    return `
- You must use your \`${Jq}\` tool at least once in the conversation before editing. This tool will error if you attempt an edit without reading the file. `
}
// @from(Ln 330315, Col 0)
function pu4() {
    return `Performs exact string replacements in files.

Usage:${DNY()}
- When editing text from Read tool output, ensure you preserve the exact indentation (tabs/spaces) as it appears AFTER the line number prefix. The line number prefix format is: spaces + line number + tab. Everything after that tab is the actual file content to match. Never include any part of the line number prefix in the old_string or new_string.
- ALWAYS prefer editing existing files in the codebase. NEVER write new files unless explicitly required.
- Only use emojis if the user explicitly requests it. Avoid adding emojis to files unless asked.
- The edit will FAIL if \`old_string\` is not unique in the file. Either provide a larger string with more surrounding context to make it unique or use \`replace_all\` to change every instance of \`old_string\`.
- Use \`replace_all\` for replacing and renaming strings across the file. This parameter is useful if you want to rename a variable for instance.`
}
// @from(Ln 330325, Col 4)
du4 = v(() => {
    _H()
})
// @from(Ln 330328, Col 4)
$W1 = R((iu4) => {
    Object.defineProperty(iu4, "__esModule", {
        value: !0
    });
    iu4.stringArray = iu4.array = iu4.func = iu4.error = iu4.number = iu4.string = iu4.boolean = void 0;

    function jNY(A) {
        return A === !0 || A === !1
    }
    iu4.boolean = jNY;

    function cu4(A) {
        return typeof A === "string" || A instanceof String
    }
    iu4.string = cu4;

    function MNY(A) {
        return typeof A === "number" || A instanceof Number
    }
    iu4.number = MNY;

    function PNY(A) {
        return A instanceof Error
    }
    iu4.error = PNY;

    function WNY(A) {
        return typeof A === "function"
    }
    iu4.func = WNY;

    function lu4(A) {
        return Array.isArray(A)
    }
    iu4.array = lu4;

    function GNY(A) {
        return lu4(A) && A.every((q) => cu4(q))
    }
    iu4.stringArray = GNY
})
// @from(Ln 330369, Col 4)
nEA = R((GB4) => {
    Object.defineProperty(GB4, "__esModule", {
        value: !0
    });
    GB4.Message = GB4.NotificationType9 = GB4.NotificationType8 = GB4.NotificationType7 = GB4.NotificationType6 = GB4.NotificationType5 = GB4.NotificationType4 = GB4.NotificationType3 = GB4.NotificationType2 = GB4.NotificationType1 = GB4.NotificationType0 = GB4.NotificationType = GB4.RequestType9 = GB4.RequestType8 = GB4.RequestType7 = GB4.RequestType6 = GB4.RequestType5 = GB4.RequestType4 = GB4.RequestType3 = GB4.RequestType2 = GB4.RequestType1 = GB4.RequestType = GB4.RequestType0 = GB4.AbstractMessageSignature = GB4.ParameterStructures = GB4.ResponseError = GB4.ErrorCodes = void 0;
    var P51 = $W1(),
        lEA;
    (function(A) {
        A.ParseError = -32700, A.InvalidRequest = -32600, A.MethodNotFound = -32601, A.InvalidParams = -32602, A.InternalError = -32603, A.jsonrpcReservedErrorRangeStart = -32099, A.serverErrorStart = -32099, A.MessageWriteError = -32099, A.MessageReadError = -32098, A.PendingResponseRejected = -32097, A.ConnectionInactive = -32096, A.ServerNotInitialized = -32002, A.UnknownErrorCode = -32001, A.jsonrpcReservedErrorRangeEnd = -32000, A.serverErrorEnd = -32000
    })(lEA || (GB4.ErrorCodes = lEA = {}));
    class iEA extends Error {
        constructor(A, q, K) {
            super(q);
            this.code = P51.number(A) ? A : lEA.UnknownErrorCode, this.data = K, Object.setPrototypeOf(this, iEA.prototype)
        }
        toJson() {
            let A = {
                code: this.code,
                message: this.message
            };
            if (this.data !== void 0) A.data = this.data;
            return A
        }
    }
    GB4.ResponseError = iEA;
    class rW {
        constructor(A) {
            this.kind = A
        }
        static is(A) {
            return A === rW.auto || A === rW.byName || A === rW.byPosition
        }
        toString() {
            return this.kind
        }
    }
    GB4.ParameterStructures = rW;
    rW.auto = new rW("auto");
    rW.byPosition = new rW("byPosition");
    rW.byName = new rW("byName");
    class r$ {
        constructor(A, q) {
            this.method = A, this.numberOfParams = q
        }
        get parameterStructures() {
            return rW.auto
        }
    }
    GB4.AbstractMessageSignature = r$;
    class ou4 extends r$ {
        constructor(A) {
            super(A, 0)
        }
    }
    GB4.RequestType0 = ou4;
    class au4 extends r$ {
        constructor(A, q = rW.auto) {
            super(A, 1);
            this._parameterStructures = q
        }
        get parameterStructures() {
            return this._parameterStructures
        }
    }
    GB4.RequestType = au4;
    class su4 extends r$ {
        constructor(A, q = rW.auto) {
            super(A, 1);
            this._parameterStructures = q
        }
        get parameterStructures() {
            return this._parameterStructures
        }
    }
    GB4.RequestType1 = su4;
    class tu4 extends r$ {
        constructor(A) {
            super(A, 2)
        }
    }
    GB4.RequestType2 = tu4;
    class eu4 extends r$ {
        constructor(A) {
            super(A, 3)
        }
    }
    GB4.RequestType3 = eu4;
    class AB4 extends r$ {
        constructor(A) {
            super(A, 4)
        }
    }
    GB4.RequestType4 = AB4;
    class qB4 extends r$ {
        constructor(A) {
            super(A, 5)
        }
    }
    GB4.RequestType5 = qB4;
    class KB4 extends r$ {
        constructor(A) {
            super(A, 6)
        }
    }
    GB4.RequestType6 = KB4;
    class YB4 extends r$ {
        constructor(A) {
            super(A, 7)
        }
    }
    GB4.RequestType7 = YB4;
    class zB4 extends r$ {
        constructor(A) {
            super(A, 8)
        }
    }
    GB4.RequestType8 = zB4;
    class wB4 extends r$ {
        constructor(A) {
            super(A, 9)
        }
    }
    GB4.RequestType9 = wB4;
    class HB4 extends r$ {
        constructor(A, q = rW.auto) {
            super(A, 1);
            this._parameterStructures = q
        }
        get parameterStructures() {
            return this._parameterStructures
        }
    }
    GB4.NotificationType = HB4;
    class $B4 extends r$ {
        constructor(A) {
            super(A, 0)
        }
    }
    GB4.NotificationType0 = $B4;
    class OB4 extends r$ {
        constructor(A, q = rW.auto) {
            super(A, 1);
            this._parameterStructures = q
        }
        get parameterStructures() {
            return this._parameterStructures
        }
    }
    GB4.NotificationType1 = OB4;
    class _B4 extends r$ {
        constructor(A) {
            super(A, 2)
        }
    }
    GB4.NotificationType2 = _B4;
    class JB4 extends r$ {
        constructor(A) {
            super(A, 3)
        }
    }
    GB4.NotificationType3 = JB4;
    class XB4 extends r$ {
        constructor(A) {
            super(A, 4)
        }
    }
    GB4.NotificationType4 = XB4;
    class DB4 extends r$ {
        constructor(A) {
            super(A, 5)
        }
    }
    GB4.NotificationType5 = DB4;
    class jB4 extends r$ {
        constructor(A) {
            super(A, 6)
        }
    }
    GB4.NotificationType6 = jB4;
    class MB4 extends r$ {
        constructor(A) {
            super(A, 7)
        }
    }
    GB4.NotificationType7 = MB4;
    class PB4 extends r$ {
        constructor(A) {
            super(A, 8)
        }
    }
    GB4.NotificationType8 = PB4;
    class WB4 extends r$ {
        constructor(A) {
            super(A, 9)
        }
    }
    GB4.NotificationType9 = WB4;
    var ru4;
    (function(A) {
        function q(z) {
            let w = z;
            return w && P51.string(w.method) && (P51.string(w.id) || P51.number(w.id))
        }
        A.isRequest = q;

        function K(z) {
            let w = z;
            return w && P51.string(w.method) && z.id === void 0
        }
        A.isNotification = K;

        function Y(z) {
            let w = z;
            return w && (w.result !== void 0 || !!w.error) && (P51.string(w.id) || P51.number(w.id) || w.id === null)
        }
        A.isResponse = Y
    })(ru4 || (GB4.Message = ru4 = {}))
})
// @from(Ln 330587, Col 4)
oEA = R((NB4) => {
    var fB4;
    Object.defineProperty(NB4, "__esModule", {
        value: !0
    });
    NB4.LRUCache = NB4.LinkedMap = NB4.Touch = void 0;
    var oW;
    (function(A) {
        A.None = 0, A.First = 1, A.AsOld = A.First, A.Last = 2, A.AsNew = A.Last
    })(oW || (NB4.Touch = oW = {}));
    class rEA {
        constructor() {
            this[fB4] = "LinkedMap", this._map = new Map, this._head = void 0, this._tail = void 0, this._size = 0, this._state = 0
        }
        clear() {
            this._map.clear(), this._head = void 0, this._tail = void 0, this._size = 0, this._state++
        }
        isEmpty() {
            return !this._head && !this._tail
        }
        get size() {
            return this._size
        }
        get first() {
            return this._head?.value
        }
        get last() {
            return this._tail?.value
        }
        has(A) {
            return this._map.has(A)
        }
        get(A, q = oW.None) {
            let K = this._map.get(A);
            if (!K) return;
            if (q !== oW.None) this.touch(K, q);
            return K.value
        }
        set(A, q, K = oW.None) {
            let Y = this._map.get(A);
            if (Y) {
                if (Y.value = q, K !== oW.None) this.touch(Y, K)
            } else {
                switch (Y = {
                        key: A,
                        value: q,
                        next: void 0,
                        previous: void 0
                    }, K) {
                    case oW.None:
                        this.addItemLast(Y);
                        break;
                    case oW.First:
                        this.addItemFirst(Y);
                        break;
                    case oW.Last:
                        this.addItemLast(Y);
                        break;
                    default:
                        this.addItemLast(Y);
                        break
                }
                this._map.set(A, Y), this._size++
            }
            return this
        }
        delete(A) {
            return !!this.remove(A)
        }
        remove(A) {
            let q = this._map.get(A);
            if (!q) return;
            return this._map.delete(A), this.removeItem(q), this._size--, q.value
        }
        shift() {
            if (!this._head && !this._tail) return;
            if (!this._head || !this._tail) throw Error("Invalid list");
            let A = this._head;
            return this._map.delete(A.key), this.removeItem(A), this._size--, A.value
        }
        forEach(A, q) {
            let K = this._state,
                Y = this._head;
            while (Y) {
                if (q) A.bind(q)(Y.value, Y.key, this);
                else A(Y.value, Y.key, this);
                if (this._state !== K) throw Error("LinkedMap got modified during iteration.");
                Y = Y.next
            }
        }
        keys() {
            let A = this._state,
                q = this._head,
                K = {
                    [Symbol.iterator]: () => {
                        return K
                    },
                    next: () => {
                        if (this._state !== A) throw Error("LinkedMap got modified during iteration.");
                        if (q) {
                            let Y = {
                                value: q.key,
                                done: !1
                            };
                            return q = q.next, Y
                        } else return {
                            value: void 0,
                            done: !0
                        }
                    }
                };
            return K
        }
        values() {
            let A = this._state,
                q = this._head,
                K = {
                    [Symbol.iterator]: () => {
                        return K
                    },
                    next: () => {
                        if (this._state !== A) throw Error("LinkedMap got modified during iteration.");
                        if (q) {
                            let Y = {
                                value: q.value,
                                done: !1
                            };
                            return q = q.next, Y
                        } else return {
                            value: void 0,
                            done: !0
                        }
                    }
                };
            return K
        }
        entries() {
            let A = this._state,
                q = this._head,
                K = {
                    [Symbol.iterator]: () => {
                        return K
                    },
                    next: () => {
                        if (this._state !== A) throw Error("LinkedMap got modified during iteration.");
                        if (q) {
                            let Y = {
                                value: [q.key, q.value],
                                done: !1
                            };
                            return q = q.next, Y
                        } else return {
                            value: void 0,
                            done: !0
                        }
                    }
                };
            return K
        } [(fB4 = Symbol.toStringTag, Symbol.iterator)]() {
            return this.entries()
        }
        trimOld(A) {
            if (A >= this.size) return;
            if (A === 0) {
                this.clear();
                return
            }
            let q = this._head,
                K = this.size;
            while (q && K > A) this._map.delete(q.key), q = q.next, K--;
            if (this._head = q, this._size = K, q) q.previous = void 0;
            this._state++
        }
        addItemFirst(A) {
            if (!this._head && !this._tail) this._tail = A;
            else if (!this._head) throw Error("Invalid list");
            else A.next = this._head, this._head.previous = A;
            this._head = A, this._state++
        }
        addItemLast(A) {
            if (!this._head && !this._tail) this._head = A;
            else if (!this._tail) throw Error("Invalid list");
            else A.previous = this._tail, this._tail.next = A;
            this._tail = A, this._state++
        }
        removeItem(A) {
            if (A === this._head && A === this._tail) this._head = void 0, this._tail = void 0;
            else if (A === this._head) {
                if (!A.next) throw Error("Invalid list");
                A.next.previous = void 0, this._head = A.next
            } else if (A === this._tail) {
                if (!A.previous) throw Error("Invalid list");
                A.previous.next = void 0, this._tail = A.previous
            } else {
                let {
                    next: q,
                    previous: K
                } = A;
                if (!q || !K) throw Error("Invalid list");
                q.previous = K, K.next = q
            }
            A.next = void 0, A.previous = void 0, this._state++
        }
        touch(A, q) {
            if (!this._head || !this._tail) throw Error("Invalid list");
            if (q !== oW.First && q !== oW.Last) return;
            if (q === oW.First) {
                if (A === this._head) return;
                let {
                    next: K,
                    previous: Y
                } = A;
                if (A === this._tail) Y.next = void 0, this._tail = Y;
                else K.previous = Y, Y.next = K;
                A.previous = void 0, A.next = this._head, this._head.previous = A, this._head = A, this._state++
            } else if (q === oW.Last) {
                if (A === this._tail) return;
                let {
                    next: K,
                    previous: Y
                } = A;
                if (A === this._head) K.previous = void 0, this._head = K;
                else K.previous = Y, Y.next = K;
                A.next = void 0, A.previous = this._tail, this._tail.next = A, this._tail = A, this._state++
            }
        }
        toJSON() {
            let A = [];
            return this.forEach((q, K) => {
                A.push([K, q])
            }), A
        }
        fromJSON(A) {
            this.clear();
            for (let [q, K] of A) this.set(q, K)
        }
    }
    NB4.LinkedMap = rEA;
    class VB4 extends rEA {
        constructor(A, q = 1) {
            super();
            this._limit = A, this._ratio = Math.min(Math.max(0, q), 1)
        }
        get limit() {
            return this._limit
        }
        set limit(A) {
            this._limit = A, this.checkTrim()
        }
        get ratio() {
            return this._ratio
        }
        set ratio(A) {
            this._ratio = Math.min(Math.max(0, A), 1), this.checkTrim()
        }
        get(A, q = oW.AsNew) {
            return super.get(A, q)
        }
        peek(A) {
            return super.get(A, oW.None)
        }
        set(A, q) {
            return super.set(A, q, oW.Last), this.checkTrim(), this
        }
        checkTrim() {
            if (this.size > this._limit) this.trimOld(Math.round(this._limit * this._ratio))
        }
    }
    NB4.LRUCache = VB4
})
// @from(Ln 330857, Col 4)
LB4 = R((EB4) => {
    Object.defineProperty(EB4, "__esModule", {
        value: !0
    });
    EB4.Disposable = void 0;
    var vB4;
    (function(A) {
        function q(K) {
            return {
                dispose: K
            }
        }
        A.create = q
    })(vB4 || (EB4.Disposable = vB4 = {}))
})
// @from(Ln 330872, Col 4)
Ht = R((RB4) => {
    Object.defineProperty(RB4, "__esModule", {
        value: !0
    });
    var aEA;

    function sEA() {
        if (aEA === void 0) throw Error("No runtime abstraction layer installed");
        return aEA
    }(function(A) {
        function q(K) {
            if (K === void 0) throw Error("No runtime abstraction layer provided");
            aEA = K
        }
        A.install = q
    })(sEA || (sEA = {}));
    RB4.default = sEA
})
// @from(Ln 330890, Col 4)
OW1 = R((SB4) => {
    Object.defineProperty(SB4, "__esModule", {
        value: !0
    });
    SB4.Emitter = SB4.Event = void 0;
    var eNY = Ht(),
        yB4;
    (function(A) {
        let q = {
            dispose() {}
        };
        A.None = function() {
            return q
        }
    })(yB4 || (SB4.Event = yB4 = {}));
    class CB4 {
        add(A, q = null, K) {
            if (!this._callbacks) this._callbacks = [], this._contexts = [];
            if (this._callbacks.push(A), this._contexts.push(q), Array.isArray(K)) K.push({
                dispose: () => this.remove(A, q)
            })
        }
        remove(A, q = null) {
            if (!this._callbacks) return;
            let K = !1;
            for (let Y = 0, z = this._callbacks.length; Y < z; Y++)
                if (this._callbacks[Y] === A)
                    if (this._contexts[Y] === q) {
                        this._callbacks.splice(Y, 1), this._contexts.splice(Y, 1);
                        return
                    } else K = !0;
            if (K) throw Error("When adding a listener with a context, you should remove it with the same context")
        }
        invoke(...A) {
            if (!this._callbacks) return [];
            let q = [],
                K = this._callbacks.slice(0),
                Y = this._contexts.slice(0);
            for (let z = 0, w = K.length; z < w; z++) try {
                q.push(K[z].apply(Y[z], A))
            } catch (H) {
                (0, eNY.default)().console.error(H)
            }
            return q
        }
        isEmpty() {
            return !this._callbacks || this._callbacks.length === 0
        }
        dispose() {
            this._callbacks = void 0, this._contexts = void 0
        }
    }
    class OP6 {
        constructor(A) {
            this._options = A
        }
        get event() {
            if (!this._event) this._event = (A, q, K) => {
                if (!this._callbacks) this._callbacks = new CB4;
                if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) this._options.onFirstListenerAdd(this);
                this._callbacks.add(A, q);
                let Y = {
                    dispose: () => {
                        if (!this._callbacks) return;
                        if (this._callbacks.remove(A, q), Y.dispose = OP6._noop, this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty()) this._options.onLastListenerRemove(this)
                    }
                };
                if (Array.isArray(K)) K.push(Y);
                return Y
            };
            return this._event
        }
        fire(A) {
            if (this._callbacks) this._callbacks.invoke.call(this._callbacks, A)
        }
        dispose() {
            if (this._callbacks) this._callbacks.dispose(), this._callbacks = void 0
        }
    }
    SB4.Emitter = OP6;
    OP6._noop = function() {}
})
// @from(Ln 330972, Col 4)
JP6 = R((xB4) => {
    Object.defineProperty(xB4, "__esModule", {
        value: !0
    });
    xB4.CancellationTokenSource = xB4.CancellationToken = void 0;
    var qTY = Ht(),
        KTY = $W1(),
        tEA = OW1(),
        _P6;
    (function(A) {
        A.None = Object.freeze({
            isCancellationRequested: !1,
            onCancellationRequested: tEA.Event.None
        }), A.Cancelled = Object.freeze({
            isCancellationRequested: !0,
            onCancellationRequested: tEA.Event.None
        });

        function q(K) {
            let Y = K;
            return Y && (Y === A.None || Y === A.Cancelled || KTY.boolean(Y.isCancellationRequested) && !!Y.onCancellationRequested)
        }
        A.is = q
    })(_P6 || (xB4.CancellationToken = _P6 = {}));
    var YTY = Object.freeze(function(A, q) {
        let K = (0, qTY.default)().timer.setTimeout(A.bind(q), 0);
        return {
            dispose() {
                K.dispose()
            }
        }
    });
    class eEA {
        constructor() {
            this._isCancelled = !1
        }
        cancel() {
            if (!this._isCancelled) {
                if (this._isCancelled = !0, this._emitter) this._emitter.fire(void 0), this.dispose()
            }
        }
        get isCancellationRequested() {
            return this._isCancelled
        }
        get onCancellationRequested() {
            if (this._isCancelled) return YTY;
            if (!this._emitter) this._emitter = new tEA.Emitter;
            return this._emitter.event
        }
        dispose() {
            if (this._emitter) this._emitter.dispose(), this._emitter = void 0
        }
    }
    class IB4 {
        get token() {
            if (!this._token) this._token = new eEA;
            return this._token
        }
        cancel() {
            if (!this._token) this._token = _P6.Cancelled;
            else this._token.cancel()
        }
        dispose() {
            if (!this._token) this._token = _P6.None;
            else if (this._token instanceof eEA) this._token.dispose()
        }
    }
    xB4.CancellationTokenSource = IB4
})
// @from(Ln 331041, Col 4)
UB4 = R((QB4) => {
    Object.defineProperty(QB4, "__esModule", {
        value: !0
    });
    QB4.SharedArrayReceiverStrategy = QB4.SharedArraySenderStrategy = void 0;
    var wTY = JP6(),
        FQ1;
    (function(A) {
        A.Continue = 0, A.Cancelled = 1
    })(FQ1 || (FQ1 = {}));
    class uB4 {
        constructor() {
            this.buffers = new Map
        }
        enableCancellation(A) {
            if (A.id === null) return;
            let q = new SharedArrayBuffer(4),
                K = new Int32Array(q, 0, 1);
            K[0] = FQ1.Continue, this.buffers.set(A.id, q), A.$cancellationData = q
        }
        async sendCancellation(A, q) {
            let K = this.buffers.get(q);
            if (K === void 0) return;
            let Y = new Int32Array(K, 0, 1);
            Atomics.store(Y, 0, FQ1.Cancelled)
        }
        cleanup(A) {
            this.buffers.delete(A)
        }
        dispose() {
            this.buffers.clear()
        }
    }
    QB4.SharedArraySenderStrategy = uB4;
    class BB4 {
        constructor(A) {
            this.data = new Int32Array(A, 0, 1)
        }
        get isCancellationRequested() {
            return Atomics.load(this.data, 0) === FQ1.Cancelled
        }
        get onCancellationRequested() {
            throw Error("Cancellation over SharedArrayBuffer doesn't support cancellation events")
        }
    }
    class mB4 {
        constructor(A) {
            this.token = new BB4(A)
        }
        cancel() {}
        dispose() {}
    }
    class FB4 {
        constructor() {
            this.kind = "request"
        }
        createCancellationTokenSource(A) {
            let q = A.$cancellationData;
            if (q === void 0) return new wTY.CancellationTokenSource;
            return new mB4(q)
        }
    }
    QB4.SharedArrayReceiverStrategy = FB4
})
// @from(Ln 331105, Col 4)
AkA = R((dB4) => {
    Object.defineProperty(dB4, "__esModule", {
        value: !0
    });
    dB4.Semaphore = void 0;
    var $TY = Ht();
    class pB4 {
        constructor(A = 1) {
            if (A <= 0) throw Error("Capacity must be greater than 0");
            this._capacity = A, this._active = 0, this._waiting = []
        }
        lock(A) {
            return new Promise((q, K) => {
                this._waiting.push({
                    thunk: A,
                    resolve: q,
                    reject: K
                }), this.runNext()
            })
        }
        get active() {
            return this._active
        }
        runNext() {
            if (this._waiting.length === 0 || this._active === this._capacity) return;
            (0, $TY.default)().timer.setImmediate(() => this.doRunNext())
        }
        doRunNext() {
            if (this._waiting.length === 0 || this._active === this._capacity) return;
            let A = this._waiting.shift();
            if (this._active++, this._active > this._capacity) throw Error("To many thunks active");
            try {
                let q = A.thunk();
                if (q instanceof Promise) q.then((K) => {
                    this._active--, A.resolve(K), this.runNext()
                }, (K) => {
                    this._active--, A.reject(K), this.runNext()
                });
                else this._active--, A.resolve(q), this.runNext()
            } catch (q) {
                this._active--, A.reject(q), this.runNext()
            }
        }
    }
    dB4.Semaphore = pB4
})
// @from(Ln 331151, Col 4)
oB4 = R((nB4) => {
    Object.defineProperty(nB4, "__esModule", {
        value: !0
    });
    nB4.ReadableStreamMessageReader = nB4.AbstractMessageReader = nB4.MessageReader = void 0;
    var KkA = Ht(),
        _W1 = $W1(),
        qkA = OW1(),
        OTY = AkA(),
        lB4;
    (function(A) {
        function q(K) {
            let Y = K;
            return Y && _W1.func(Y.listen) && _W1.func(Y.dispose) && _W1.func(Y.onError) && _W1.func(Y.onClose) && _W1.func(Y.onPartialMessage)
        }
        A.is = q
    })(lB4 || (nB4.MessageReader = lB4 = {}));
    class zkA {
        constructor() {
            this.errorEmitter = new qkA.Emitter, this.closeEmitter = new qkA.Emitter, this.partialMessageEmitter = new qkA.Emitter
        }
        dispose() {
            this.errorEmitter.dispose(), this.closeEmitter.dispose()
        }
        get onError() {
            return this.errorEmitter.event
        }
        fireError(A) {
            this.errorEmitter.fire(this.asError(A))
        }
        get onClose() {
            return this.closeEmitter.event
        }
        fireClose() {
            this.closeEmitter.fire(void 0)
        }
        get onPartialMessage() {
            return this.partialMessageEmitter.event
        }
        firePartialMessage(A) {
            this.partialMessageEmitter.fire(A)
        }
        asError(A) {
            if (A instanceof Error) return A;
            else return Error(`Reader received error. Reason: ${_W1.string(A.message)?A.message:"unknown"}`)
        }
    }
    nB4.AbstractMessageReader = zkA;
    var YkA;
    (function(A) {
        function q(K) {
            let Y, z, w, H = new Map,
                $, O = new Map;
            if (K === void 0 || typeof K === "string") Y = K ?? "utf-8";
            else {
                if (Y = K.charset ?? "utf-8", K.contentDecoder !== void 0) w = K.contentDecoder, H.set(w.name, w);
                if (K.contentDecoders !== void 0)
                    for (let _ of K.contentDecoders) H.set(_.name, _);
                if (K.contentTypeDecoder !== void 0) $ = K.contentTypeDecoder, O.set($.name, $);
                if (K.contentTypeDecoders !== void 0)
                    for (let _ of K.contentTypeDecoders) O.set(_.name, _)
            }
            if ($ === void 0) $ = (0, KkA.default)().applicationJson.decoder, O.set($.name, $);
            return {
                charset: Y,
                contentDecoder: w,
                contentDecoders: H,
                contentTypeDecoder: $,
                contentTypeDecoders: O
            }
        }
        A.fromOptions = q
    })(YkA || (YkA = {}));
    class iB4 extends zkA {
        constructor(A, q) {
            super();
            this.readable = A, this.options = YkA.fromOptions(q), this.buffer = (0, KkA.default)().messageBuffer.create(this.options.charset), this._partialMessageTimeout = 1e4, this.nextMessageLength = -1, this.messageToken = 0, this.readSemaphore = new OTY.Semaphore(1)
        }
        set partialMessageTimeout(A) {
            this._partialMessageTimeout = A
        }
        get partialMessageTimeout() {
            return this._partialMessageTimeout
        }
        listen(A) {
            this.nextMessageLength = -1, this.messageToken = 0, this.partialMessageTimer = void 0, this.callback = A;
            let q = this.readable.onData((K) => {
                this.onData(K)
            });
            return this.readable.onError((K) => this.fireError(K)), this.readable.onClose(() => this.fireClose()), q
        }
        onData(A) {
            try {
                this.buffer.append(A);
                while (!0) {
                    if (this.nextMessageLength === -1) {
                        let K = this.buffer.tryReadHeaders(!0);
                        if (!K) return;
                        let Y = K.get("content-length");
                        if (!Y) {
                            this.fireError(Error(`Header must provide a Content-Length property.
${JSON.stringify(Object.fromEntries(K))}`));
                            return
                        }
                        let z = parseInt(Y);
                        if (isNaN(z)) {
                            this.fireError(Error(`Content-Length value must be a number. Got ${Y}`));
                            return
                        }
                        this.nextMessageLength = z
                    }
                    let q = this.buffer.tryReadBody(this.nextMessageLength);
                    if (q === void 0) {
                        this.setPartialMessageTimer();
                        return
                    }
                    this.clearPartialMessageTimer(), this.nextMessageLength = -1, this.readSemaphore.lock(async () => {
                        let K = this.options.contentDecoder !== void 0 ? await this.options.contentDecoder.decode(q) : q,
                            Y = await this.options.contentTypeDecoder.decode(K, this.options);
                        this.callback(Y)
                    }).catch((K) => {
                        this.fireError(K)
                    })
                }
            } catch (q) {
                this.fireError(q)
            }
        }
        clearPartialMessageTimer() {
            if (this.partialMessageTimer) this.partialMessageTimer.dispose(), this.partialMessageTimer = void 0
        }
        setPartialMessageTimer() {
            if (this.clearPartialMessageTimer(), this._partialMessageTimeout <= 0) return;
            this.partialMessageTimer = (0, KkA.default)().timer.setTimeout((A, q) => {
                if (this.partialMessageTimer = void 0, A === this.messageToken) this.firePartialMessage({
                    messageToken: A,
                    waitingTime: q
                }), this.setPartialMessageTimer()
            }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout)
        }
    }
    nB4.ReadableStreamMessageReader = iB4
})
// @from(Ln 331294, Col 4)
Ym4 = R((qm4) => {
    Object.defineProperty(qm4, "__esModule", {
        value: !0
    });
    qm4.WriteableStreamMessageWriter = qm4.AbstractMessageWriter = qm4.MessageWriter = void 0;
    var aB4 = Ht(),
        QQ1 = $W1(),
        XTY = AkA(),
        sB4 = OW1(),
        DTY = "Content-Length: ",
        tB4 = `\r
`,
        eB4;
    (function(A) {
        function q(K) {
            let Y = K;
            return Y && QQ1.func(Y.dispose) && QQ1.func(Y.onClose) && QQ1.func(Y.onError) && QQ1.func(Y.write)
        }
        A.is = q
    })(eB4 || (qm4.MessageWriter = eB4 = {}));
    class HkA {
        constructor() {
            this.errorEmitter = new sB4.Emitter, this.closeEmitter = new sB4.Emitter
        }
        dispose() {
            this.errorEmitter.dispose(), this.closeEmitter.dispose()
        }
        get onError() {
            return this.errorEmitter.event
        }
        fireError(A, q, K) {
            this.errorEmitter.fire([this.asError(A), q, K])
        }
        get onClose() {
            return this.closeEmitter.event
        }
        fireClose() {
            this.closeEmitter.fire(void 0)
        }
        asError(A) {
            if (A instanceof Error) return A;
            else return Error(`Writer received error. Reason: ${QQ1.string(A.message)?A.message:"unknown"}`)
        }
    }
    qm4.AbstractMessageWriter = HkA;
    var wkA;
    (function(A) {
        function q(K) {
            if (K === void 0 || typeof K === "string") return {
                charset: K ?? "utf-8",
                contentTypeEncoder: (0, aB4.default)().applicationJson.encoder
            };
            else return {
                charset: K.charset ?? "utf-8",
                contentEncoder: K.contentEncoder,
                contentTypeEncoder: K.contentTypeEncoder ?? (0, aB4.default)().applicationJson.encoder
            }
        }
        A.fromOptions = q
    })(wkA || (wkA = {}));
    class Am4 extends HkA {
        constructor(A, q) {
            super();
            this.writable = A, this.options = wkA.fromOptions(q), this.errorCount = 0, this.writeSemaphore = new XTY.Semaphore(1), this.writable.onError((K) => this.fireError(K)), this.writable.onClose(() => this.fireClose())
        }
        async write(A) {
            return this.writeSemaphore.lock(async () => {
                return this.options.contentTypeEncoder.encode(A, this.options).then((K) => {
                    if (this.options.contentEncoder !== void 0) return this.options.contentEncoder.encode(K);
                    else return K
                }).then((K) => {
                    let Y = [];
                    return Y.push(DTY, K.byteLength.toString(), tB4), Y.push(tB4), this.doWrite(A, Y, K)
                }, (K) => {
                    throw this.fireError(K), K
                })
            })
        }
        async doWrite(A, q, K) {
            try {
                return await this.writable.write(q.join(""), "ascii"), this.writable.write(K)
            } catch (Y) {
                return this.handleError(Y, A), Promise.reject(Y)
            }
        }
        handleError(A, q) {
            this.errorCount++, this.fireError(A, q, this.errorCount)
        }
        end() {
            this.writable.end()
        }
    }
    qm4.WriteableStreamMessageWriter = Am4
})
// @from(Ln 331388, Col 4)
$m4 = R((wm4) => {
    Object.defineProperty(wm4, "__esModule", {
        value: !0
    });
    wm4.AbstractMessageBuffer = void 0;
    var PTY = 13,
        WTY = 10,
        GTY = `\r
`;
    class zm4 {
        constructor(A = "utf-8") {
            this._encoding = A, this._chunks = [], this._totalLength = 0
        }
        get encoding() {
            return this._encoding
        }
        append(A) {
            let q = typeof A === "string" ? this.fromString(A, this._encoding) : A;
            this._chunks.push(q), this._totalLength += q.byteLength
        }
        tryReadHeaders(A = !1) {
            if (this._chunks.length === 0) return;
            let q = 0,
                K = 0,
                Y = 0,
                z = 0;
            A: while (K < this._chunks.length) {
                let O = this._chunks[K];
                Y = 0;
                q: while (Y < O.length) {
                    switch (O[Y]) {
                        case PTY:
                            switch (q) {
                                case 0:
                                    q = 1;
                                    break;
                                case 2:
                                    q = 3;
                                    break;
                                default:
                                    q = 0
                            }
                            break;
                        case WTY:
                            switch (q) {
                                case 1:
                                    q = 2;
                                    break;
                                case 3:
                                    q = 4, Y++;
                                    break A;
                                default:
                                    q = 0
                            }
                            break;
                        default:
                            q = 0
                    }
                    Y++
                }
                z += O.byteLength, K++
            }
            if (q !== 4) return;
            let w = this._read(z + Y),
                H = new Map,
                $ = this.toString(w, "ascii").split(GTY);
            if ($.length < 2) return H;
            for (let O = 0; O < $.length - 2; O++) {
                let _ = $[O],
                    J = _.indexOf(":");
                if (J === -1) throw Error(`Message header must separate key and value using ':'
${_}`);
                let X = _.substr(0, J),
                    D = _.substr(J + 1).trim();
                H.set(A ? X.toLowerCase() : X, D)
            }
            return H
        }
        tryReadBody(A) {
            if (this._totalLength < A) return;
            return this._read(A)
        }
        get numberOfBytes() {
            return this._totalLength
        }
        _read(A) {
            if (A === 0) return this.emptyBuffer();
            if (A > this._totalLength) throw Error("Cannot read so many bytes!");
            if (this._chunks[0].byteLength === A) {
                let z = this._chunks[0];
                return this._chunks.shift(), this._totalLength -= A, this.asNative(z)
            }
            if (this._chunks[0].byteLength > A) {
                let z = this._chunks[0],
                    w = this.asNative(z, A);
                return this._chunks[0] = z.slice(A), this._totalLength -= A, w
            }
            let q = this.allocNative(A),
                K = 0,
                Y = 0;
            while (A > 0) {
                let z = this._chunks[Y];
                if (z.byteLength > A) {
                    let w = z.slice(0, A);
                    q.set(w, K), K += A, this._chunks[Y] = z.slice(A), this._totalLength -= A, A -= A
                } else q.set(z, K), K += z.byteLength, this._chunks.shift(), this._totalLength -= z.byteLength, A -= z.byteLength
            }
            return q
        }
    }
    wm4.AbstractMessageBuffer = zm4
})