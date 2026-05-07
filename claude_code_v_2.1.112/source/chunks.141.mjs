
// @from(Ln 356372, Col 0)
function x96(q, {
    tools: K,
    verbose: _,
    terminalSize: z,
    inProgressToolCallCount: Y,
    isTranscriptMode: A = !1
}) {
    if (!q.length) return x1.createElement(_1, {
        height: 1
    }, x1.createElement(T, {
        dimColor: !0
    }, vHK));
    let O = (Y ?? 1) * JKY + XKY,
        w = !A && z && z.rows && z.rows < O,
        $ = () => {
            let Z = w7(q, (v) => {
                    if (!VT(v.data)) return !1;
                    return v.data.message.message.content.some((k) => k.type === "tool_use")
                }),
                G = q.findLast((v) => VT(v.data) && v.data.message.type === "assistant"),
                f = null;
            if (G?.data.message.type === "assistant") {
                let v = G.data.message.message.usage;
                f = (v.cache_creation_input_tokens ?? 0) + (v.cache_read_input_tokens ?? 0) + v.input_tokens + v.output_tokens
            }
            return {
                toolUseCount: Z,
                tokens: f
            }
        };
    if (w) {
        let {
            toolUseCount: Z,
            tokens: G
        } = $();
        return x1.createElement(_1, {
            height: 1
        }, x1.createElement(T, {
            dimColor: !0
        }, "In progress… · ", x1.createElement(T, {
            bold: !0
        }, Z), " tool", " ", Z === 1 ? "use" : "uses", G && ` · ${iK(G)} tokens`, " ·", " ", x1.createElement(v1, {
            action: "app:toggleTranscript",
            context: "Global",
            fallback: "ctrl+o",
            description: "expand",
            parens: !0
        })))
    }
    let j = HKY(q, K, !0),
        H = A ? j : j.slice(-GHK),
        J = A ? [] : j.slice(0, Math.max(0, j.length - GHK)),
        X = w7(J, (Z) => {
            if (Z.type === "summary") return Z.searchCount + Z.readCount + Z.replCount > 0;
            let G = Z.message.data;
            if (!VT(G)) return !1;
            return G.message.message.content.some((f) => f.type === "tool_use")
        }),
        M = q[0]?.data,
        P = M && VT(M) ? M.prompt : void 0;
    if (H.length === 0 && !(A && P)) return x1.createElement(_1, {
        height: 1
    }, x1.createElement(T, {
        dimColor: !0
    }, vHK));
    let {
        lookups: W,
        inProgressToolUseIDs: D
    } = gK8(q.filter((Z) => VT(Z.data)).map((Z) => Z.data));
    return x1.createElement(_1, null, x1.createElement(u, {
        flexDirection: "column"
    }, x1.createElement(We6, null, A && P && x1.createElement(u, {
        marginBottom: 1
    }, x1.createElement(BK8, {
        prompt: P
    })), H.map((Z) => {
        if (Z.type === "summary") {
            let G = OU8(Z.searchCount, Z.readCount, Z.isActive, Z.replCount);
            return x1.createElement(u, {
                key: Z.uuid,
                height: 1,
                overflow: "hidden"
            }, x1.createElement(T, {
                dimColor: !0
            }, G))
        }
        return x1.createElement(Ku, {
            key: Z.message.uuid,
            message: Z.message.data.message,
            lookups: W,
            addMargin: !1,
            tools: K,
            commands: [],
            verbose: _,
            inProgressToolUseIDs: D,
            progressMessagesForMessage: [],
            shouldAnimate: !1,
            shouldShowDot: !1,
            style: "condensed",
            isTranscriptMode: !1,
            isStatic: !0
        })
    })), X > 0 && x1.createElement(T, {
        dimColor: !0
    }, "+", X, " more tool", " ", X === 1 ? "use" : "uses", " ", x1.createElement(U2, null))))
}
// @from(Ln 356479, Col 0)
function yHK(q, {
    progressMessagesForMessage: K,
    tools: _,
    verbose: z,
    isTranscriptMode: Y
}) {
    let A = K[0]?.data,
        O = A && VT(A) ? A.agentId : void 0;
    return x1.createElement(x1.Fragment, null, !1, x96(K, {
        tools: _,
        verbose: z,
        isTranscriptMode: Y
    }), x1.createElement(Ul, null))
}
// @from(Ln 356494, Col 0)
function LHK(q, {
    progressMessagesForMessage: K,
    tools: _,
    verbose: z,
    isTranscriptMode: Y
}) {
    return x1.createElement(x1.Fragment, null, x96(K, {
        tools: _,
        verbose: z,
        isTranscriptMode: Y
    }), x1.createElement(d$, {
        result: q,
        verbose: z
    }))
}
// @from(Ln 356510, Col 0)
function fKY(q) {
    let K = w7(q, (Y) => {
            if (!VT(Y.data)) return !1;
            let A = Y.data.message;
            return A.type === "user" && A.message.content.some((O) => O.type === "tool_result")
        }),
        _ = q.findLast((Y) => VT(Y.data) && Y.data.message.type === "assistant"),
        z = null;
    if (_?.data.message.type === "assistant") {
        let Y = _.data.message.message.usage;
        z = (Y.cache_creation_input_tokens ?? 0) + (Y.cache_read_input_tokens ?? 0) + Y.input_tokens + Y.output_tokens
    }
    return {
        toolUseCount: K,
        tokens: z
    }
}
// @from(Ln 356528, Col 0)
function hHK(q, K) {
    let {
        shouldAnimate: _,
        tools: z
    } = K, Y = q.map(({
        param: J,
        isResolved: X,
        isError: M,
        progressMessages: P,
        result: W
    }) => {
        let D = fKY(P),
            Z = GKY(P, z),
            G = Sq7().safeParse(J.input),
            f = W?.output?.status === "teammate_spawned",
            v, V, k, N, R;
        if (f && G.success && G.data.name) {
            v = `@${G.data.name}`;
            let S = G.data.subagent_type;
            V = THK(S) ? S : void 0, R = G.data.description, N = THK(S) ? cs(S) : void 0
        } else v = G.success ? hq7(G.data) : "Agent", V = G.success ? G.data.description : void 0, k = G.success ? Rq7(G.data) : void 0, R = void 0;
        let h = G.success && "run_in_background" in G.data && G.data.run_in_background === !0,
            C = W?.output?.status,
            B = h || (C === "async_launched" || C === "remote_launched") || f,
            m = G.success ? G.data.name : void 0;
        return {
            id: J.id,
            agentType: v,
            description: V,
            toolUseCount: D.toolUseCount,
            tokens: D.tokens,
            isResolved: X,
            isError: M,
            isAsync: B,
            color: k,
            descriptionColor: N,
            lastToolInfo: Z,
            taskDescription: R,
            name: m
        }
    }), A = q.some((J) => !J.isResolved), O = q.some((J) => J.isError), w = !A, $ = Y.length > 0 && Y.every((J) => J.agentType === Y[0]?.agentType), j = $ && Y[0]?.agentType !== "Agent" ? Y[0]?.agentType : null, H = Y.every((J) => J.isAsync);
    return x1.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, x1.createElement(u, {
        flexDirection: "row"
    }, x1.createElement(xF, {
        shouldAnimate: _ && A,
        isUnresolved: A,
        isError: O
    }), x1.createElement(T, null, w ? H ? x1.createElement(x1.Fragment, null, x1.createElement(T, {
        bold: !0
    }, q.length), " background agents launched", " ", x1.createElement(T, {
        dimColor: !0
    }, x1.createElement(A8, {
        chord: "down",
        action: "manage",
        parens: !0
    }))) : x1.createElement(x1.Fragment, null, x1.createElement(T, {
        bold: !0
    }, q.length), " ", j ? `${j} agents` : "agents", " finished") : x1.createElement(x1.Fragment, null, "Running ", x1.createElement(T, {
        bold: !0
    }, q.length), " ", j ? `${j} agents` : "agents", "…"), " "), !H && x1.createElement(U2, null)), Y.map((J, X) => x1.createElement(n2K, {
        key: J.id,
        agentType: J.agentType,
        description: J.description,
        descriptionColor: J.descriptionColor,
        taskDescription: J.taskDescription,
        toolUseCount: J.toolUseCount,
        tokens: J.tokens,
        color: J.color,
        isLast: X === Y.length - 1,
        isResolved: J.isResolved,
        isError: J.isError,
        isAsync: J.isAsync,
        shouldAnimate: _,
        lastToolInfo: J.lastToolInfo,
        hideType: $,
        name: J.name
    })))
}
// @from(Ln 356610, Col 0)
function hq7(q) {
    if (q?.subagent_type && q.subagent_type !== hc.agentType) {
        if (q.subagent_type === "worker") return "Agent";
        return q.subagent_type
    }
    return "Agent"
}
// @from(Ln 356618, Col 0)
function Rq7(q) {
    if (!q?.subagent_type) return;
    return cs(q.subagent_type)
}
// @from(Ln 356623, Col 0)
function GKY(q, K) {
    let _ = new Map;
    for (let O of q) {
        if (!VT(O.data)) continue;
        if (O.data.message.type === "assistant") {
            for (let w of O.data.message.message.content)
                if (w.type === "tool_use") _.set(w.id, w)
        }
    }
    let z = 0,
        Y = 0;
    for (let O = q.length - 1; O >= 0; O--) {
        let w = q[O];
        if (!VT(w.data)) continue;
        let $ = VHK(w, K, _);
        if ($ && ($.isSearch || $.isRead)) {
            if (w.data.message.type === "user") {
                if ($.isSearch) z++;
                else if ($.isRead) Y++
            }
        } else break
    }
    if (z + Y >= 2) return OU8(z, Y, !0);
    let A = q.findLast((O) => {
        if (!VT(O.data)) return !1;
        let w = O.data.message;
        return w.type === "user" && w.message.content.some(($) => $.type === "tool_result")
    });
    if (A?.data.message.type === "user") {
        let O = A.data.message.message.content.find((w) => w.type === "tool_result");
        if (O?.type === "tool_result") {
            let w = _.get(O.tool_use_id);
            if (w) {
                let $ = rK(K, w.name);
                if (!$) return w.name;
                let j = w.input,
                    H = $.inputSchema.safeParse(j),
                    J = $.userFacingName(H.success ? H.data : void 0);
                if ($.getToolUseSummary) {
                    let X = $.getToolUseSummary(H.success ? H.data : void 0);
                    if (X) return `${J}: ${X}`
                }
                return J
            }
        }
    }
    return null
}
// @from(Ln 356672, Col 0)
function THK(q) {
    return !!q && q !== hc.agentType && q !== "worker"
}
// @from(Ln 356675, Col 4)
x1
// @from(Ln 356675, Col 8)
GHK = 3
// @from(Ln 356676, Col 4)
JKY = 9
// @from(Ln 356677, Col 4)
XKY = 7
// @from(Ln 356678, Col 4)
vHK = "Initializing…"
// @from(Ln 356679, Col 4)
FK8 = L(() => {
    o6();
    bK();
    kk();
    Nq();
    u7();
    i2K();
    ny();
    GK8();
    ry();
    _b6();
    GK();
    lC6();
    g6();
    _36();
    gq();
    Bt();
    eK();
    c7();
    _7();
    Sq();
    Cq7();
    Uf();
    f88();
    x1 = K6(P6(), 1)
})
// @from(Ln 356706, Col 0)
function TKY() {
    if (S6(process.env.CLAUDE_AUTO_BACKGROUND_TASKS) || u8("tengu_auto_background_agents", !1)) return 120000;
    return 0
}
// @from(Ln 356711, Col 0)
function EKY(q, K) {
    if (!z4()) return;
    return q.team_name || K.teamContext?.teamName
}
// @from(Ln 356715, Col 4)
bq7
// @from(Ln 356715, Col 9)
vKY = 2000
// @from(Ln 356716, Col 4)
zb6
// @from(Ln 356716, Col 9)
VKY
// @from(Ln 356716, Col 14)
kKY
// @from(Ln 356716, Col 19)
Sq7
// @from(Ln 356716, Col 24)
NKY
// @from(Ln 356716, Col 29)
RHK
// @from(Ln 356717, Col 4)
Cq7 = L(() => {
    gq();
    Hu8();
    p7();
    y8();
    sy();
    d88();
    Io1();
    B1();
    C8();
    _36();
    vM();
    Bl();
    $0();
    Cf();
    mB();
    fO();
    n7();
    K8();
    Q8();
    m8();
    _7();
    Z96();
    OP();
    g$();
    BP();
    g4();
    pC6();
    EH();
    zY();
    Rv();
    sk();
    kD();
    dc();
    tD();
    $K8();
    Rz();
    EP();
    W2K();
    Uf();
    k96();
    f88();
    sY();
    c88();
    cP();
    $I8();
    vJ6();
    FK8();
    bq7 = K6(P6(), 1), zb6 = S6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS);
    VKY = C6(() => y.object({
        description: y.string().describe("A short (3-5 word) description of the task"),
        prompt: y.string().describe("The task for the agent to perform"),
        subagent_type: y.string().optional().describe("The type of specialized agent to use for this task"),
        model: y.enum(["sonnet", "opus", "haiku"]).optional().describe("Optional model override for this agent. Takes precedence over the agent definition's model frontmatter. If omitted, uses the agent definition's model, or inherits from the parent."),
        run_in_background: y.boolean().optional().describe("Set to true to run this agent in the background. You will be notified when it completes.")
    })), kKY = C6(() => {
        let q = y.object({
            name: y.string().optional().describe("Name for the spawned agent. Makes it addressable via SendMessage({to: name}) while running."),
            team_name: y.string().optional().describe("Team name for spawning. Uses current team context if omitted."),
            mode: jg7().optional().describe('Permission mode for spawned teammate (e.g., "plan" to require plan approval).')
        });
        return VKY().merge(q).extend({
            isolation: y.enum(["worktree"]).optional().describe('Isolation mode. "worktree" creates a temporary git worktree so the agent works on an isolated copy of the repo.'),
            cwd: y.string().optional().describe('Absolute path to run the agent in. Overrides the working directory for all filesystem and shell operations within this agent. Mutually exclusive with isolation: "worktree".')
        })
    }), Sq7 = C6(() => {
        let q = kKY().omit({
            cwd: !0
        });
        return zb6 || kx() ? q.omit({
            run_in_background: !0
        }) : q
    }), NKY = C6(() => {
        let q = l2K().extend({
                status: y.literal("completed"),
                prompt: y.string()
            }),
            K = y.object({
                status: y.literal("async_launched"),
                agentId: y.string().describe("The ID of the async agent"),
                description: y.string().describe("The description of the task"),
                prompt: y.string().describe("The prompt for the agent"),
                outputFile: y.string().describe("Path to the output file for checking agent progress"),
                canReadOutputFile: y.boolean().optional().describe("Whether the calling agent has Read/Bash tools to check progress")
            });
        return y.union([q, K])
    }), RHK = Iq({
        async prompt({
            agents: q,
            tools: K,
            getToolPermissionContext: _,
            allowedAgentTypes: z
        }) {
            let Y = await _(),
                A = [];
            for (let j of K) {
                let H = iH6(j);
                if (H && !A.includes(H)) A.push(H)
            }
            let O = V88(q, A),
                w = QK8(O, Y, T4);
            return await cS4(w, !1, z)
        },
        name: T4,
        searchHint: "delegate work to a subagent",
        aliases: [Gh],
        maxResultSizeChars: 1e5,
        async description() {
            return "Launch a new agent"
        },
        get inputSchema() {
            return Sq7()
        },
        get outputSchema() {
            return NKY()
        },
        async call({
            prompt: q,
            subagent_type: K,
            description: _,
            model: z,
            run_in_background: Y,
            name: A,
            team_name: O,
            mode: w,
            isolation: $,
            cwd: j
        }, H, J, X, M) {
            let P = Date.now(),
                W = Ch6() ? void 0 : z,
                D = H.getAppState(),
                Z = D.toolPermissionContext.mode,
                {
                    taskRegistry: G
                } = H;
            if (O && !z4()) throw Error("Agent Teams is not yet available on your plan.");
            let f = EKY({
                team_name: O
            }, D);
            if (Lz() && f && A) throw Error("Teammates cannot spawn other teammates — the team roster is flat. To spawn a subagent instead, omit the `name` parameter.");
            if ($D() && f && Y === !0) throw Error("In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents.");
            if (f && A) {
                let J6 = K ? H.options.agentDefinitions.activeAgents.find((q6) => q6.agentType === K) : void 0;
                if (J6?.color) BH6(K, J6.color);
                let $6 = await P2K({
                    name: A,
                    prompt: q,
                    description: _,
                    team_name: f,
                    use_splitpane: !0,
                    plan_mode_required: w === "plan",
                    model: W ?? J6?.model,
                    agent_type: K,
                    invokingRequestId: X?.requestId
                }, H);
                return {
                    data: {
                        status: "teammate_spawned",
                        prompt: q,
                        ...$6.data
                    }
                }
            }
            let v = K ?? (kx() ? void 0 : hc.agentType),
                V = v === void 0,
                k;
            if (V) {
                if (H.options.querySource === `agent:builtin:${bh6.agentType}` || US4(H.messages)) throw Error("Fork is not available inside a forked worker. Complete your task directly using your tools.");
                k = bh6
            } else {
                let J6 = H.options.agentDefinitions.activeAgents,
                    {
                        allowedAgentTypes: $6
                    } = H.options.agentDefinitions,
                    H6 = QK8($6 ? J6.filter((o) => $6.includes(o.agentType)) : J6, D.toolPermissionContext, T4),
                    q6 = H6.find((o) => o.agentType === v);
                if (!q6) {
                    if (J6.find((_6) => _6.agentType === v)) {
                        let _6 = bHK(D.toolPermissionContext, T4, v);
                        throw Error(`Agent type '${v}' has been denied by permission rule '${T4}(${v})' from ${_6?.source??"settings"}.`)
                    }
                    throw Error(`Agent type '${v}' not found. Available agents: ${H6.map((_6)=>_6.agentType).join(", ")}`)
                }
                k = q6
            }
            if ($D() && f && k.background === !0) throw Error(`In-process teammates cannot spawn background agents. Agent '${k.agentType}' has background: true in its definition.`);
            let N = k.requiredMcpServers,
                R = H.options.tools.filter(yJ);
            if (N?.length) {
                let J6 = D.mcp.clients.some((q6) => q6.type === "pending" && N.some((o) => q6.name.toLowerCase().includes(o.toLowerCase()))),
                    $6 = D;
                if (J6) {
                    let _6 = Date.now() + 30000;
                    while (Date.now() < _6) {
                        if (await l7(500), $6 = H.getAppState(), $6.mcp.clients.some((Y6) => Y6.type === "failed" && N.some((X6) => Y6.name.toLowerCase().includes(X6.toLowerCase())))) break;
                        if (!$6.mcp.clients.some((Y6) => Y6.type === "pending" && N.some((X6) => Y6.name.toLowerCase().includes(X6.toLowerCase())))) break
                    }
                }
                let H6 = [];
                for (let q6 of $6.mcp.tools.concat(R)) {
                    let o = iH6(q6);
                    if (o && !H6.includes(o)) H6.push(o)
                }
                if (!Sb8(k, H6)) {
                    let q6 = N.filter((o) => !H6.some((_6) => _6.toLowerCase().includes(o.toLowerCase())));
                    throw Error(`Agent '${k.agentType}' requires MCP servers matching: ${q6.join(", ")}. MCP servers with tools: ${H6.length>0?H6.join(", "):"none"}. Use /mcp to configure and authenticate the required MCP servers.`)
                }
            }
            if (k.color) BH6(k.agentType, k.color);
            let h = BC6(k.model, H.options.mainLoopModel, V ? void 0 : W, Z);
            H.agentLifecycle.markTypeInvoked(k.agentType), d("tengu_agent_tool_selected", {
                agent_type: k.agentType,
                model: h,
                source: k.source,
                color: k.color,
                is_built_in_agent: Vj(k),
                is_resume: !1,
                is_async: (Y === !0 || k.background === !0) && !zb6,
                is_fork: V
            });
            let C = $ ?? k.isolation,
                x, B, m;
            if (V) {
                if (H.renderedSystemPrompt) B = H.renderedSystemPrompt;
                else {
                    let J6 = D.agent ? D.agentDefinitions.activeAgents.find((q6) => q6.agentType === D.agent) : void 0,
                        $6 = Array.from(D.toolPermissionContext.additionalWorkingDirectories.keys()),
                        H6 = await j0(H.options.tools, H.options.mainLoopModel, $6);
                    B = ax({
                        mainThreadAgentDefinition: J6,
                        toolUseContext: H,
                        customSystemPrompt: H.options.customSystemPrompt,
                        defaultSystemPrompt: H6,
                        appendSystemPrompt: H.options.appendSystemPrompt
                    })
                }
                m = QS4(q, X)
            } else {
                try {
                    let J6 = Array.from(D.toolPermissionContext.additionalWorkingDirectories.keys()),
                        $6 = k.getSystemPrompt({
                            toolUseContext: H
                        });
                    if (k.memory) d("tengu_agent_memory_loaded", {
                        ...!1,
                        scope: k.memory,
                        source: "subagent"
                    });
                    x = await lK8([$6], h, J6)
                } catch (J6) {
                    E(`Failed to get system prompt for agent ${k.agentType}: ${b6(J6)}`)
                }
                m = [t8({
                    content: q
                })]
            }
            let S = {
                    prompt: q,
                    resolvedAgentModel: h,
                    isBuiltInAgent: Vj(k),
                    startTime: P,
                    agentType: k.agentType,
                    isAsync: (Y === !0 || k.background === !0) && !zb6
                },
                F = !1,
                U = kx(),
                g = !1,
                c = (Y === !0 || k.background === !0 || F || U || g) && !zb6,
                n = {
                    ...D.toolPermissionContext,
                    mode: k.permissionMode ?? "acceptEdits"
                },
                l = cl(n, H.getAppState().mcp.tools.concat(R), {
                    skipReplFilter: !0
                }),
                z6 = tp(),
                A6 = null;
            if (C === "worktree") {
                let J6 = `agent-${z6.slice(0,8)}`;
                A6 = await cK8(J6)
            }
            if (V && A6) m.push(t8({
                content: dS4(b8(), A6.worktreePath)
            }));
            let e = {
                    agentDefinition: k,
                    promptMessages: m,
                    toolUseContext: H,
                    canUseTool: J,
                    isAsync: c,
                    querySource: H.options.querySource ?? ju8(k.agentType, Vj(k)),
                    model: V ? void 0 : W,
                    override: V ? {
                        systemPrompt: B,
                        replHydration: {
                            kind: "fork",
                            log: [...H.getAppState().replContexts[H.agentId ?? Aa6]?.replayLog ?? []]
                        }
                    } : x && !A6 && !j ? {
                        systemPrompt: sK(x)
                    } : void 0,
                    availableTools: V ? H.options.tools : l,
                    forkContextMessages: V ? H.messages : k.forksParentContext === "turn" ? H.messages.slice(H.turnStartIndex) : k.forksParentContext === !0 ? H.messages : void 0,
                    ...V && {
                        useExactTools: !0
                    },
                    worktreePath: A6?.worktreePath,
                    description: _
                },
                i = j ?? A6?.worktreePath,
                O6 = async () => {
                    if (!A6) return {};
                    let {
                        worktreePath: J6,
                        worktreeBranch: $6,
                        headCommit: H6,
                        gitRoot: q6,
                        hookBased: o
                    } = A6;
                    if (A6 = null, o) return E(`Hook-based agent worktree kept at: ${J6}`), {
                        worktreePath: J6
                    };
                    if (H6) {
                        if (!await Iq7(J6, H6)) return await AM6(J6, $6, q6, !1, "agent_tool"), dK8(w2(z6), {
                            agentType: k.agentType,
                            description: _
                        }).catch((r) => E(`Failed to clear worktree metadata: ${r}`)), {}
                    }
                    return E(`Agent worktree has changes, keeping: ${J6}`), {
                        worktreePath: J6,
                        worktreeBranch: $6
                    }
                };
            if (c) {
                let J6 = z6,
                    $6 = wU8({
                        agentId: J6,
                        description: _,
                        prompt: q,
                        selectedAgent: k,
                        taskRegistry: G,
                        toolUseId: H.toolUseId,
                        cwd: i
                    });
                if (A) H.agentLifecycle.registerName(A, w2(J6));
                let H6 = {
                    agentId: J6,
                    parentSessionId: kQ(),
                    agentType: "subagent",
                    subagentName: k.agentType,
                    isBuiltIn: Vj(k),
                    invokingRequestId: X?.requestId,
                    invocationKind: "spawn",
                    invocationEmitted: !1
                };
                eQ(H6, () => eU6(i, () => Eg8({
                    taskId: $6.agentId,
                    abortController: $6.abortController,
                    makeStream: (o) => _u({
                        ...e,
                        override: {
                            ...e.override,
                            agentId: w2($6.agentId),
                            abortController: $6.abortController
                        },
                        onCacheSafeParams: o
                    }),
                    metadata: S,
                    description: _,
                    toolUseContext: H,
                    taskRegistry: G,
                    agentIdForCleanup: J6,
                    enableSummarization: F || kx() || Ug(),
                    getWorktreeResult: O6
                })));
                let q6 = H.options.tools.some((o) => e3(o, xq) || e3(o, S7));
                return {
                    data: {
                        isAsync: !0,
                        status: "async_launched",
                        agentId: $6.agentId,
                        description: _,
                        prompt: q,
                        outputFile: $A($6.agentId),
                        canReadOutputFile: q6
                    }
                }
            } else {
                let J6 = w2(z6),
                    $6 = {
                        agentId: J6,
                        parentSessionId: kQ(),
                        agentType: "subagent",
                        subagentName: k.agentType,
                        isBuiltIn: Vj(k),
                        invokingRequestId: X?.requestId,
                        invocationKind: "spawn",
                        invocationEmitted: !1
                    };
                return eQ($6, () => eU6(i, async () => {
                    let H6 = [],
                        q6 = Date.now(),
                        o = lX6(),
                        _6 = nX6(H.options.tools);
                    if (m.length > 0) {
                        let c6 = aP(m).find((Z8) => Z8.type === "user");
                        if (c6 && c6.type === "user" && M) M({
                            toolUseID: `agent_${X.message.id}`,
                            data: {
                                message: c6,
                                type: "agent_progress",
                                prompt: q,
                                agentId: J6
                            }
                        })
                    }
                    let r, t, Y6;
                    if (!zb6) {
                        let y6 = SHK({
                            agentId: J6,
                            description: _,
                            prompt: q,
                            selectedAgent: k,
                            taskRegistry: G,
                            toolUseId: H.toolUseId,
                            autoBackgroundMs: TKY() || void 0,
                            cwd: i
                        });
                        r = y6.taskId, t = y6.backgroundSignal.then(() => ({
                            type: "background"
                        })), Y6 = y6.cancelAutoBackground
                    }
                    let X6 = !1,
                        M6 = !1,
                        W6, V6 = r,
                        f6 = _u({
                            ...e,
                            override: {
                                ...e.override,
                                agentId: J6
                            },
                            onCacheSafeParams: V6 && Ug() ? (y6) => {
                                let {
                                    stop: c6
                                } = A78(V6, J6, y6, G);
                                W6 = c6
                            } : void 0
                        })[Symbol.asyncIterator](),
                        G6, k6 = !1,
                        T6 = {};
                    try {
                        while (!0) {
                            let y6 = Date.now() - q6;
                            if (!zb6 && !X6 && y6 >= vKY) {
                                if (X6 = !0, H.setToolJSX?.({
                                        jsx: bq7.createElement(G96, null),
                                        shouldHidePromptInput: !1,
                                        shouldContinueAnimation: !0,
                                        showSpinner: !0
                                    }), H.toolUseId) H.emitToolProgress?.({
                                    kind: "background_hint",
                                    toolUseId: H.toolUseId
                                })
                            }
                            let c6 = f6.next(),
                                Z8 = t ? await Promise.race([c6.then((q8) => ({
                                    type: "message",
                                    result: q8
                                })), t]) : {
                                    type: "message",
                                    result: await c6
                                };
                            if (Z8.type === "background" && r) {
                                let L8 = H.getAppState().tasks[r];
                                if (sD(L8) && L8.isBackgrounded) {
                                    let w8 = r;
                                    M6 = !0, W6?.(), eQ($6, async () => {
                                        let a6;
                                        try {
                                            await Promise.race([f6.return(void 0).catch(() => {}), l7(1000)]);
                                            let D8 = lX6(),
                                                Q6 = nX6(H.options.tools);
                                            for (let u6 of H6) N96(D8, u6, Q6, H.options.tools);
                                            for await (let u6 of _u({
                                                ...e,
                                                isAsync: !0,
                                                override: {
                                                    ...e.override,
                                                    agentId: w2(w8),
                                                    abortController: L8.abortController
                                                },
                                                onCacheSafeParams: Ug() ? (h6) => {
                                                    let {
                                                        stop: _8
                                                    } = A78(w8, w2(w8), h6, G);
                                                    a6 = _8
                                                } : void 0
                                            })) {
                                                H6.push(u6), N96(D8, u6, Q6, H.options.tools), ZK8(w8, nt(D8), G);
                                                let h6 = Vg8(u6);
                                                if (h6) kg8(D8, w8, H.toolUseId, _, P, h6)
                                            }
                                            let W8 = Tg8(H6, w8, S);
                                            yg8(W8, G);
                                            let G8 = s5(W8.content, `
`);
                                            {
                                                let u6 = H.getAppState(),
                                                    h6 = await Ng8({
                                                        agentMessages: H6,
                                                        tools: H.options.tools,
                                                        toolPermissionContext: u6.toolPermissionContext,
                                                        abortSignal: L8.abortController.signal,
                                                        subagentType: k.agentType,
                                                        totalToolUseCount: W8.totalToolUseCount
                                                    });
                                                if (h6) G8 = `${h6}

${G8}`
                                            }
                                            let s6 = await O6();
                                            V96({
                                                taskId: w8,
                                                description: _,
                                                status: "completed",
                                                taskRegistry: G,
                                                abortSpeculation: H.abortSpeculation,
                                                finalMessage: G8,
                                                usage: {
                                                    totalTokens: DK8(D8),
                                                    toolUses: W8.totalToolUseCount,
                                                    durationMs: W8.totalDurationMs
                                                },
                                                toolUseId: H.toolUseId,
                                                ...s6
                                            })
                                        } catch (D8) {
                                            if (D8 instanceof sz) {
                                                IF(w8, G), d("tengu_agent_tool_terminated", {
                                                    agent_type: S.agentType,
                                                    model: S.resolvedAgentModel,
                                                    duration_ms: Date.now() - S.startTime,
                                                    is_async: !0,
                                                    is_built_in_agent: S.isBuiltInAgent,
                                                    reason: "user_cancel_background"
                                                });
                                                let G8 = await O6(),
                                                    s6 = WK8(H6);
                                                V96({
                                                    taskId: w8,
                                                    description: _,
                                                    status: "killed",
                                                    taskRegistry: G,
                                                    abortSpeculation: H.abortSpeculation,
                                                    toolUseId: H.toolUseId,
                                                    finalMessage: s6,
                                                    ...G8
                                                });
                                                return
                                            }
                                            let Q6 = b6(D8);
                                            Lg8(w8, Q6, G);
                                            let W8 = await O6();
                                            V96({
                                                taskId: w8,
                                                description: _,
                                                status: "failed",
                                                error: Q6,
                                                taskRegistry: G,
                                                abortSpeculation: H.abortSpeculation,
                                                toolUseId: H.toolUseId,
                                                finalMessage: WK8(H6),
                                                ...W8
                                            })
                                        } finally {
                                            a6?.(), R86(J6), s18(J6)
                                        }
                                    });
                                    let x8 = H.options.tools.some((a6) => e3(a6, xq) || e3(a6, S7));
                                    return {
                                        data: {
                                            isAsync: !0,
                                            status: "async_launched",
                                            agentId: w8,
                                            description: _,
                                            prompt: q,
                                            outputFile: $A(w8),
                                            canReadOutputFile: x8
                                        }
                                    }
                                }
                            }
                            if (Z8.type !== "message") continue;
                            let {
                                result: N8
                            } = Z8;
                            if (N8.done) break;
                            let R6 = N8.value;
                            if (H6.push(R6), N96(o, R6, _6, H.options.tools), r) {
                                let q8 = Vg8(R6);
                                if (q8) {
                                    if (kg8(o, r, H.toolUseId, _, q6, q8), Ug()) ZK8(r, nt(o), G)
                                }
                            }
                            if (R6.type === "progress" && (R6.data.type === "bash_progress" || R6.data.type === "powershell_progress") && M) M({
                                toolUseID: R6.toolUseID,
                                data: R6.data
                            });
                            if (R6.type !== "assistant" && R6.type !== "user") continue;
                            if (R6.type === "assistant") {
                                let q8 = ne6(R6);
                                if (q8 > 0) H.addResponseLength(q8)
                            }
                            let p6 = aP([R6]);
                            for (let q8 of p6)
                                for (let L8 of q8.message.content) {
                                    if (L8.type !== "tool_use" && L8.type !== "tool_result") continue;
                                    if (M) M({
                                        toolUseID: `agent_${X.message.id}`,
                                        data: {
                                            message: q8,
                                            type: "agent_progress",
                                            prompt: "",
                                            agentId: J6
                                        }
                                    })
                                }
                        }
                    } catch (y6) {
                        if (y6 instanceof sz) throw k6 = !0, d("tengu_agent_tool_terminated", {
                            agent_type: S.agentType,
                            model: S.resolvedAgentModel,
                            duration_ms: Date.now() - S.startTime,
                            is_async: !1,
                            is_built_in_agent: S.isBuiltInAgent,
                            reason: "user_cancel_sync"
                        }), y6;
                        E(`Sync agent error: ${b6(y6)}`, {
                            level: "error"
                        }), G6 = r1(y6)
                    } finally {
                        if (H.setToolJSX) H.setToolJSX(null);
                        if (H.toolUseId) H.emitToolProgress?.({
                            kind: "clear",
                            toolUseId: H.toolUseId
                        });
                        if (W6?.(), r) {
                            if (CHK(r, G), !M6) {
                                let y6 = nt(o);
                                sv({
                                    type: "system",
                                    subtype: "task_notification",
                                    task_id: r,
                                    tool_use_id: H.toolUseId,
                                    status: G6 ? "failed" : k6 ? "stopped" : "completed",
                                    output_file: "",
                                    summary: _,
                                    usage: {
                                        total_tokens: y6.tokenCount,
                                        tool_uses: y6.toolUseCount,
                                        duration_ms: Date.now() - q6
                                    }
                                })
                            }
                        }
                        if (R86(J6), !M6) s18(J6);
                        if (Y6?.(), !M6) T6 = await O6()
                    }
                    let v6 = H6.findLast((y6) => y6.type !== "system" && y6.type !== "progress");
                    if (v6 && YM6(v6)) throw d("tengu_agent_tool_terminated", {
                        agent_type: S.agentType,
                        model: S.resolvedAgentModel,
                        duration_ms: Date.now() - S.startTime,
                        is_async: !1,
                        is_built_in_agent: S.isBuiltInAgent,
                        reason: "user_cancel_sync"
                    }), new sz;
                    if (G6) {
                        if (!H6.some((c6) => c6.type === "assistant")) throw G6;
                        E(`Sync agent recovering from error with ${H6.length} messages`)
                    }
                    let L6 = Tg8(H6, J6, S);
                    {
                        let y6 = H.getAppState(),
                            c6 = await Ng8({
                                agentMessages: H6,
                                tools: H.options.tools,
                                toolPermissionContext: y6.toolPermissionContext,
                                abortSignal: H.abortController.signal,
                                subagentType: k.agentType,
                                totalToolUseCount: L6.totalToolUseCount
                            });
                        if (c6) L6.content = [{
                            type: "text",
                            text: c6
                        }, ...L6.content]
                    }
                    return {
                        data: {
                            status: "completed",
                            prompt: q,
                            ...L6,
                            ...T6
                        }
                    }
                }))
            }
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(q) {
            let K = q,
                _ = [K.subagent_type, K.mode ? `mode=${K.mode}` : void 0].filter((Y) => Y !== void 0);
            return `${_.length>0?`(${_.join(", ")}): `:": "}${K.prompt}`
        },
        isConcurrencySafe() {
            return !0
        },
        userFacingName: hq7,
        userFacingNameBackgroundColor: Rq7,
        getActivityDescription(q) {
            return q?.description ?? "Running task"
        },
        async checkPermissions(q, K) {
            let _ = K.getAppState();
            return {
                behavior: "allow",
                updatedInput: q
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            let _ = q;
            if (typeof _ === "object" && _ !== null && "status" in _ && _.status === "teammate_spawned") {
                let z = _;
                return {
                    tool_use_id: K,
                    type: "tool_result",
                    content: [{
                        type: "text",
                        text: `Spawned successfully.
agent_id: ${z.teammate_id}
name: ${z.name}
team_name: ${z.team_name}
The agent is now running and will receive instructions via mailbox.`
                    }]
                }
            }
            if ("status" in _ && _.status === "remote_launched") {
                let z = _;
                return {
                    tool_use_id: K,
                    type: "tool_result",
                    content: [{
                        type: "text",
                        text: `Remote agent launched in CCR.
taskId: ${z.taskId}
session_url: ${z.sessionUrl}
output_file: ${z.outputFile}
The agent is running remotely. You will be notified automatically when it completes.
Briefly tell the user what you launched and end your response.`
                    }]
                }
            }
            if (q.status === "async_launched") {
                let z = `Async agent launched successfully.
agentId: ${q.agentId} (internal ID - do not mention to user. Use SendMessage with to: '${q.agentId}' to continue this agent.)
The agent is working in the background. You will be notified automatically when it completes.`,
                    Y = q.canReadOutputFile ? `Do not duplicate this agent's work — avoid working with the same files or topics it is using. Work on non-overlapping tasks, or briefly tell the user what you launched and end your response.
output_file: ${q.outputFile}
Do NOT ${xq} or ${S7} tail this file — it is the full sub-agent JSONL transcript and reading it will overflow your context. If the user asks for progress, say the agent is still running; you'll get a completion notification.` : "Briefly tell the user what you launched and end your response. Do not generate any other text — agent results will arrive in a subsequent message.",
                    A = `${z}
${Y}`;
                return {
                    tool_use_id: K,
                    type: "tool_result",
                    content: [{
                        type: "text",
                        text: A
                    }]
                }
            }
            if (q.status === "completed") {
                let z = q,
                    Y = z.worktreePath ? `
worktreePath: ${z.worktreePath}
worktreeBranch: ${z.worktreeBranch}` : "",
                    A = q.content.length > 0 ? q.content : [{
                        type: "text",
                        text: "(Subagent completed but returned no output.)"
                    }];
                if (q.agentType && Sg7.has(q.agentType) && !Y) return {
                    tool_use_id: K,
                    type: "tool_result",
                    content: A
                };
                return {
                    tool_use_id: K,
                    type: "tool_result",
                    content: [...A, {
                        type: "text",
                        text: `agentId: ${q.agentId} (use SendMessage with to: '${q.agentId}' to continue this agent)${Y}
<usage>total_tokens: ${q.totalTokens}
tool_uses: ${q.totalToolUseCount}
duration_ms: ${q.totalDurationMs}</usage>`
                    }]
                }
            }
            throw Error(`Unexpected agent tool result status: ${q.status}`)
        },
        renderToolResultMessage: kHK,
        renderToolUseMessage: NHK,
        renderToolUseTag: EHK,
        renderToolUseProgressMessage: x96,
        renderToolUseRejectedMessage: yHK,
        renderToolUseErrorMessage: LHK,
        renderGroupedToolUse: hHK
    })
})
// @from(Ln 357537, Col 0)
function Yb6(q, K, {
    maxEditDistance: _ = 1
} = {}) {
    let z = K.flatMap((O) => [O.name, ...O.aliases ?? []]),
        Y, A = _ + 1;
    for (let O of z) {
        if (Math.abs(O.length - q.length) > _) continue;
        let w = yKY(q, O);
        if (w < A) A = w, Y = O
    }
    return Y
}
// @from(Ln 357550, Col 0)
function yKY(q, K) {
    if (q === K) return 0;
    let _ = q.length,
        z = K.length,
        Y = Array.from({
            length: _ + 1
        }, (A, O) => Array.from({
            length: z + 1
        }, (w, $) => O === 0 ? $ : $ === 0 ? O : 0));
    for (let A = 1; A <= _; A++)
        for (let O = 1; O <= z; O++) {
            let w = q[A - 1] === K[O - 1] ? 0 : 1;
            if (Y[A][O] = Math.min(Y[A - 1][O] + 1, Y[A][O - 1] + 1, Y[A - 1][O - 1] + w), A > 1 && O > 1 && q[A - 1] === K[O - 2] && q[A - 2] === K[O - 1]) Y[A][O] = Math.min(Y[A][O], Y[A - 2][O - 2] + 1)
        }
    return Y[_][z]
}
// @from(Ln 357567, Col 0)
function IHK(q, K) {
    if (!K) return q;
    return q.map((_) => {
        if (_.type === "user") return {
            ..._,
            sourceToolUseID: K
        };
        return _
    })
}
// @from(Ln 357578, Col 0)
function xHK(q, K) {
    let _ = q.message.content.find((z) => z.type === "tool_use" && z.name === K);
    return _ && _.type === "tool_use" ? _.id : void 0
}
// @from(Ln 357583, Col 0)
function uHK(q) {
    if ("status" in q && q.status === "forked") return J_.createElement(_1, {
        height: 1
    }, J_.createElement(T, null, J_.createElement(z1, null, ["Done"])));
    let K = ["Successfully loaded skill"];
    if ("allowedTools" in q && q.allowedTools && q.allowedTools.length > 0) {
        let _ = q.allowedTools.length;
        K.push(`${_} ${O7(_,"tool")} allowed`)
    }
    if ("model" in q && q.model) K.push(q.model);
    return J_.createElement(_1, {
        height: 1
    }, J_.createElement(T, null, J_.createElement(z1, null, K)))
}
// @from(Ln 357598, Col 0)
function mHK({
    skill: q
}, {
    commands: K
}) {
    if (!q) return null;
    return K?.find((Y) => Y.name === q)?.loadedFrom === "commands_DEPRECATED" ? `/${q}` : q
}
// @from(Ln 357607, Col 0)
function $U8(q, {
    tools: K,
    verbose: _
}) {
    if (!q.length) return J_.createElement(_1, {
        height: 1
    }, J_.createElement(T, {
        dimColor: !0
    }, hKY));
    let z = _ ? q : q.slice(-LKY),
        Y = q.length - z.length,
        {
            inProgressToolUseIDs: A
        } = gK8(q.map((O) => O.data));
    return J_.createElement(_1, null, J_.createElement(u, {
        flexDirection: "column"
    }, J_.createElement(We6, null, z.map((O) => J_.createElement(u, {
        key: O.uuid,
        height: 1,
        overflow: "hidden"
    }, J_.createElement(Ku, {
        message: O.data.message,
        lookups: Ke,
        addMargin: !1,
        tools: K,
        commands: [],
        verbose: _,
        inProgressToolUseIDs: A,
        progressMessagesForMessage: [],
        shouldAnimate: !1,
        shouldShowDot: !1,
        style: "condensed",
        isTranscriptMode: !1,
        isStatic: !0
    })))), Y > 0 && J_.createElement(T, {
        dimColor: !0
    }, "+", Y, " more tool ", O7(Y, "use"))))
}
// @from(Ln 357646, Col 0)
function BHK(q, {
    progressMessagesForMessage: K,
    tools: _,
    verbose: z
}) {
    return J_.createElement(J_.Fragment, null, $U8(K, {
        tools: _,
        verbose: z
    }), J_.createElement(Ul, null))
}
// @from(Ln 357657, Col 0)
function pHK(q, {
    progressMessagesForMessage: K,
    tools: _,
    verbose: z
}) {
    return J_.createElement(J_.Fragment, null, $U8(K, {
        tools: _,
        verbose: z
    }), J_.createElement(d$, {
        result: q,
        verbose: z
    }))
}
// @from(Ln 357670, Col 4)
J_
// @from(Ln 357670, Col 8)
LKY = 3
// @from(Ln 357671, Col 4)
hKY = "Initializing…"
// @from(Ln 357672, Col 4)
FHK = L(() => {
    kk();
    ny();
    GK8();
    Nq();
    _b6();
    GK();
    g6();
    _7();
    J_ = K6(P6(), 1)
})
// @from(Ln 357684, Col 0)
function RKY(q, K) {
    return K.length < 2 ? q : k86(q, Qb8(K, 0, -1))
}
// @from(Ln 357687, Col 4)
gHK
// @from(Ln 357688, Col 4)
UHK = L(() => {
    uB6();
    Hn1();
    gHK = RKY
})
// @from(Ln 357694, Col 0)
function bKY(q, K) {
    K = TC(K, q);
    var _ = -1,
        z = K.length;
    if (!z) return !0;
    var Y = q == null || typeof q !== "object" && typeof q !== "function";
    while (++_ < z) {
        var A = K[_];
        if (typeof A !== "string") continue;
        if (A === "__proto__" && !CKY.call(q, "__proto__")) return !1;
        if (A === "constructor" && _ + 1 < z && typeof K[_ + 1] === "string" && K[_ + 1] === "prototype") {
            if (Y && _ === 0) continue;
            return !1
        }
    }
    var O = gHK(q, K);
    return O == null || delete O[VC(pI(K))]
}
// @from(Ln 357712, Col 4)
SKY
// @from(Ln 357712, Col 9)
CKY
// @from(Ln 357712, Col 14)
QHK
// @from(Ln 357713, Col 4)
dHK = L(() => {
    $Y6();
    Kt6();
    UHK();
    jY6();
    SKY = Object.prototype, CKY = SKY.hasOwnProperty;
    QHK = bKY
})
// @from(Ln 357722, Col 0)
function IKY(q) {
    return Lf6(q) ? void 0 : q
}
// @from(Ln 357725, Col 4)
cHK
// @from(Ln 357726, Col 4)
lHK = L(() => {
    YJ8();
    cHK = IKY
})
// @from(Ln 357731, Col 0)
function xKY(q) {
    return uO(q) || Ei(q) || !!(nHK && q && q[nHK])
}
// @from(Ln 357734, Col 4)
nHK
// @from(Ln 357734, Col 9)
iHK
// @from(Ln 357735, Col 4)
rHK = L(() => {
    zY6();
    LB6();
    YV();
    nHK = x0 ? x0.isConcatSpreadable : void 0;
    iHK = xKY
})
// @from(Ln 357743, Col 0)
function oHK(q, K, _, z, Y) {
    var A = -1,
        O = q.length;
    _ || (_ = iHK), Y || (Y = []);
    while (++A < O) {
        var w = q[A];
        if (K > 0 && _(w))
            if (K > 1) oHK(w, K - 1, _, z, Y);
            else OD6(Y, w);
        else if (!z) Y[Y.length] = w
    }
    return Y
}
// @from(Ln 357756, Col 4)
aHK
// @from(Ln 357757, Col 4)
sHK = L(() => {
    YO8();
    rHK();
    aHK = oHK
})
// @from(Ln 357763, Col 0)
function uKY(q) {
    var K = q == null ? 0 : q.length;
    return K ? aHK(q, 1) : []
}
// @from(Ln 357767, Col 4)
tHK
// @from(Ln 357768, Col 4)
eHK = L(() => {
    sHK();
    tHK = uKY
})
// @from(Ln 357773, Col 0)
function mKY(q) {
    return OJ8(AJ8(q, void 0, tHK), q + "")
}
// @from(Ln 357776, Col 4)
qJK
// @from(Ln 357777, Col 4)
KJK = L(() => {
    eHK();
    VY1();
    kY1();
    qJK = mKY
})
// @from(Ln 357783, Col 4)
BKY = 1
// @from(Ln 357784, Col 4)
pKY = 2
// @from(Ln 357785, Col 4)
FKY = 4
// @from(Ln 357786, Col 4)
gKY
// @from(Ln 357786, Col 9)
gF
// @from(Ln 357787, Col 4)
jU8 = L(() => {
    xB6();
    ov7();
    dHK();
    $Y6();
    EY6();
    lHK();
    KJK();
    Qw8();
    gKY = qJK(function(q, K) {
        var _ = {};
        if (q == null) return _;
        var z = !1;
        if (K = V86(K, function(A) {
                return A = TC(A, q), z || (z = A.length > 1), A
            }), hC(q, aD6(q), _), z) _ = rv7(_, BKY | pKY | FKY, cHK);
        var Y = K.length;
        while (Y--) QHK(_, K[Y]);
        return _
    }), gF = gKY
})
// @from(Ln 357809, Col 0)
function zJK(q, K) {
    if (q.type !== K.type) return !1;
    let _ = (z, Y) => (z.if ?? "") === (Y.if ?? "");
    switch (q.type) {
        case "command":
            return K.type === "command" && q.command === K.command && (q.shell ?? KG6) === (K.shell ?? KG6) && _(q, K);
        case "prompt":
            return K.type === "prompt" && q.prompt === K.prompt && _(q, K);
        case "agent":
            return K.type === "agent" && q.prompt === K.prompt && _(q, K);
        case "http":
            return K.type === "http" && q.url === K.url && _(q, K);
        case "function":
            return !1
    }
}
// @from(Ln 357826, Col 0)
function xq7(q, K, _, z, Y, A, O) {
    YJK(q, K, _, z, Y, A, O)
}
// @from(Ln 357830, Col 0)
function nK8(q, K, _, z, Y, A, O) {
    let w = O?.id || `function-hook-${Date.now()}-${Math.random()}`,
        $ = {
            type: "function",
            id: w,
            timeout: O?.timeout || 5000,
            callback: Y,
            errorMessage: A
        };
    return YJK(q, K, _, z, $), w
}
// @from(Ln 357842, Col 0)
function UKY(q, K, _, z) {
    q((Y) => {
        let A = Y.sessionHooks.get(K);
        if (!A) return Y;
        let w = (A.hooks[_] || []).map((j) => {
                let H = j.hooks.filter((J) => {
                    if (J.hook.type !== "function") return !0;
                    return J.hook.id !== z
                });
                return H.length > 0 ? {
                    ...j,
                    hooks: H
                } : null
            }).filter((j) => j !== null),
            $ = w.length > 0 ? {
                ...A.hooks,
                [_]: w
            } : gF(A.hooks, _);
        return Y.sessionHooks.set(K, {
            hooks: $
        }), Y
    }), E(`Removed function hook ${z} for event ${_} in session ${K}`)
}
// @from(Ln 357866, Col 0)
function YJK(q, K, _, z, Y, A, O) {
    q((w) => {
        let $ = w.sessionHooks.get(K) ?? {
                hooks: {}
            },
            j = $.hooks[_] || [],
            H = j.findIndex((M) => M.matcher === z && M.skillRoot === O),
            J;
        if (H >= 0) {
            J = [...j];
            let M = J[H];
            J[H] = {
                matcher: M.matcher,
                skillRoot: M.skillRoot,
                hooks: [...M.hooks, {
                    hook: Y,
                    onHookSuccess: A
                }]
            }
        } else J = [...j, {
            matcher: z,
            skillRoot: O,
            hooks: [{
                hook: Y,
                onHookSuccess: A
            }]
        }];
        let X = {
            ...$.hooks,
            [_]: J
        };
        return w.sessionHooks.set(K, {
            hooks: X
        }), w
    }), E(`Added session hook for event ${_} in session ${K}`)
}
// @from(Ln 357903, Col 0)
function uq7(q, K, _, z) {
    q((Y) => {
        let A = Y.sessionHooks.get(K);
        if (!A) return Y;
        let w = (A.hooks[_] || []).map((j) => {
                let H = j.hooks.filter((J) => !zJK(J.hook, z));
                return H.length > 0 ? {
                    ...j,
                    hooks: H
                } : null
            }).filter((j) => j !== null),
            $ = w.length > 0 ? {
                ...A.hooks,
                [_]: w
            } : {
                ...A.hooks
            };
        if (w.length === 0) delete $[_];
        return Y.sessionHooks.set(K, {
            ...A,
            hooks: $
        }), Y
    }), E(`Removed session hook for event ${_} in session ${K}`)
}
// @from(Ln 357928, Col 0)
function _JK(q) {
    return q.map((K) => ({
        matcher: K.matcher,
        skillRoot: K.skillRoot,
        hooks: K.hooks.map((_) => _.hook).filter((_) => _.type !== "function")
    }))
}
// @from(Ln 357936, Col 0)
function u96(q, K, _) {
    let z = q.sessionHooks.get(K);
    if (!z) return new Map;
    let Y = new Map;
    if (_) {
        let A = z.hooks[_];
        if (A) Y.set(_, _JK(A));
        return Y
    }
    for (let A of hV) {
        let O = z.hooks[A];
        if (O) Y.set(A, _JK(O))
    }
    return Y
}
// @from(Ln 357952, Col 0)
function AJK(q, K, _) {
    let z = q.sessionHooks.get(K);
    if (!z) return new Map;
    let Y = new Map,
        A = (O) => {
            return O.map((w) => ({
                matcher: w.matcher,
                hooks: w.hooks.map(($) => $.hook).filter(($) => $.type === "function")
            })).filter((w) => w.hooks.length > 0)
        };
    if (_) {
        let O = z.hooks[_];
        if (O) {
            let w = A(O);
            if (w.length > 0) Y.set(_, w)
        }
        return Y
    }
    for (let O of hV) {
        let w = z.hooks[O];
        if (w) {
            let $ = A(w);
            if ($.length > 0) Y.set(O, $)
        }
    }
    return Y
}
// @from(Ln 357980, Col 0)
function OJK(q, K, _, z, Y) {
    let A = q.sessionHooks.get(K);
    if (!A) return;
    let O = A.hooks[_];
    if (!O) return;
    for (let w of O)
        if (w.matcher === z || z === "") {
            let $ = w.hooks.find((j) => zJK(j.hook, Y));
            if ($) return $
        } return
}
// @from(Ln 357992, Col 0)
function iK8(q, K) {
    q((_) => {
        return _.sessionHooks.delete(K), _
    }), E(`Cleared all session hooks for session ${K}`)
}
// @from(Ln 357998, Col 0)
function OM6(q) {
    return {
        add(K, _, z, Y, A) {
            xq7(q, K, _, z, Y, void 0, A)
        },
        addFunction(K, _, z, Y, A, O) {
            return nK8(q, K, _, z, Y, A, O)
        },
        remove(K, _, z) {
            uq7(q, K, _, z)
        },
        removeFunction(K, _, z) {
            UKY(q, K, _, z)
        },
        clear(K) {
            iK8(q, K)
        }
    }
}
// @from(Ln 358017, Col 4)
ty = L(() => {
    jU8();
    pA6();
    K8();
    JX8()
})
// @from(Ln 358024, Col 0)
function wJK(q, K, _, z, Y) {
    let A = 0;
    for (let O of hV) {
        let w = _[O];
        if (!w) continue;
        for (let $ of w)
            for (let j of $.hooks) {
                let H = j.once ? () => {
                    E(`Removing one-shot hook for event ${O} in skill '${z}'`), uq7(q, K, O, j)
                } : void 0;
                xq7(q, K, O, $.matcher || "", j, H, Y), A++
            }
    }
    if (A > 0) E(`Registered ${A} hooks from skill '${z}'`)
}
// @from(Ln 358039, Col 4)
$JK = L(() => {
    pA6();
    K8();
    ty()
})
// @from(Ln 358045, Col 0)
function HU8(q) {
    let K = q.trim();
    if (!K.startsWith("/")) return null;
    let z = K.slice(1).split(" ");
    if (!z[0]) return null;
    let Y = z[0],
        A = !1,
        O = 1;
    if (z.length > 1 && z[1] === "(MCP)") Y = Y + " (MCP)", A = !0, O = 2;
    let w = z.slice(O).join(" ");
    return {
        commandName: Y,
        args: w,
        isMcp: A
    }
}
// @from(Ln 358061, Col 4)
rK8 = {}
// @from(Ln 358071, Col 0)
async function dKY(q, K, _, z, Y, A) {
    let O = tp(),
        w = q.pluginInfo ? Z4(q.pluginInfo.repository).marketplace : void 0;
    d("tengu_slash_command_forked", {
        command_name: q.name,
        invocation_trigger: "user-slash",
        ...xs(q.source, q.loadedFrom, q.kind, q.createdBy),
        ...q.pluginInfo && {
            _PROTO_plugin_name: q.pluginInfo.pluginManifest.name,
            ...w && {
                _PROTO_marketplace_name: w
            },
            ...YH6(q.pluginInfo)
        }
    });
    let {
        skillContent: $,
        modifiedGetAppState: j,
        baseAgent: H,
        promptMessages: J
    } = await Wx8(q, K, _), X = q.effort !== void 0 ? {
        ...H,
        effort: q.effort
    } : H;
    E(`Executing forked slash command /${q.name} with agent ${X.agentType}`);
    let M = [],
        P = [],
        W = `forked-command-${q.name}`,
        D = 0,
        Z = (V) => {
            return D++, {
                type: "progress",
                data: {
                    message: V,
                    type: "agent_progress",
                    prompt: $,
                    agentId: O
                },
                parentToolUseID: W,
                toolUseID: `${W}-${D}`,
                timestamp: new Date().toISOString(),
                uuid: HJK()
            }
        },
        G = () => {
            Y({
                jsx: x96(P, {
                    tools: _.options.tools,
                    verbose: !1
                }),
                shouldHidePromptInput: !1,
                shouldContinueAnimation: !0,
                showSpinner: !0
            }), _.emitToolProgress?.({
                kind: "agent_progress",
                toolUseId: W,
                progressMessages: [...P]
            })
        };
    G();
    try {
        for await (let V of _u({
            agentDefinition: X,
            promptMessages: J,
            toolUseContext: {
                ..._,
                getAppState: j
            },
            canUseTool: A,
            isAsync: !1,
            querySource: "agent:custom",
            model: q.model,
            availableTools: _.options.tools
        })) {
            M.push(V);
            let k = aP([V]);
            if (V.type === "assistant") {
                let N = ne6(V);
                if (N > 0) _.addResponseLength(N);
                let R = k[0];
                if (R && R.type === "assistant") P.push(Z(V)), G()
            }
            if (V.type === "user") {
                let N = k[0];
                if (N && N.type === "user") P.push(Z(N)), G()
            }
        }
    } finally {
        Y(null), _.emitToolProgress?.({
            kind: "clear",
            toolUseId: W
        })
    }
    let f = Dx8(M, "Command completed");
    return E(`Forked slash command /${q.name} completed with agent ${O}`), {
        messages: [t8({
            content: JS({
                inputString: `/${y_(q)} ${K}`.trim(),
                precedingInputBlocks: z
            })
        }), t8({
            content: `<local-command-stdout>
${f}
</local-command-stdout>`
        })],
        shouldQuery: !1,
        command: q,
        resultText: f
    }
}
// @from(Ln 358182, Col 0)
function JJK(q) {
    return !/[^a-zA-Z0-9:\-_]/.test(q)
}
// @from(Ln 358185, Col 0)
async function cKY(q, K, _, z, Y, A, O, w, $) {
    let j = HU8(q);
    if (!j) {
        d("tengu_input_slash_missing", {});
        let h = "Commands are in the form `/command [args]`";
        return {
            messages: [zu(), ...z, t8({
                content: JS({
                    inputString: h,
                    precedingInputBlocks: K
                })
            })],
            shouldQuery: !1,
            resultText: h
        }
    }
    let {
        commandName: H,
        args: J,
        isMcp: X
    } = j, M = X ? "mcp" : !UF().has(H) ? "custom" : H;
    if (!wM6(H, Y.options.commands)) {
        let h = !1;
        try {
            await V8().stat(`/${H}`), h = !0
        } catch {}
        if (JJK(H) && !h) {
            if (Y.options.isNonInteractiveSession && UF().has(H)) {
                let m = `/${H} isn't available in this environment.`;
                return d("tengu_input_slash_invalid", {
                    input: H,
                    had_suggestion: !1
                }), {
                    messages: [kT(`/${H}${J?` ${J}`:""}`), kT(`<local-command-stdout>${m}</local-command-stdout>`)],
                    shouldQuery: !1,
                    resultText: m
                }
            }
            let x = Yb6(H, Y.options.commands.filter((m) => !m.isHidden).map((m) => ({
                name: y_(m),
                aliases: m.aliases
            })), {
                maxEditDistance: 2
            });
            d("tengu_input_slash_invalid", {
                input: H,
                had_suggestion: Boolean(x)
            });
            let B = x ? `Unknown command: /${H}. Did you mean /${x}?` : `Unknown command: /${H}`;
            return {
                messages: [zu(), ...z, t8({
                    content: JS({
                        inputString: B,
                        precedingInputBlocks: K
                    })
                }), ...J ? [eO(`Args from unknown skill: ${J}`, "warning")] : []],
                shouldQuery: !1,
                resultText: B
            }
        }
        let C = HJK();
        return jp6(C), d("tengu_input_prompt", {}), Xz("user_prompt", {
            prompt_length: String(q.length),
            prompt: NS8(q),
            "prompt.id": C
        }), {
            messages: [t8({
                content: JS({
                    inputString: q,
                    precedingInputBlocks: K
                }),
                uuid: O
            }), ...z],
            shouldQuery: !0
        }
    }
    let {
        messages: P,
        shouldQuery: W,
        allowedTools: D,
        model: Z,
        effort: G,
        command: f,
        resultText: v,
        nextInput: V,
        submitNextInput: k
    } = await lKY(H, J, A, Y, K, _, w, $, O);
    if (P.length === 0) {
        let h = {
            input: M
        };
        if (f.type === "prompt" && f.pluginInfo) {
            let {
                pluginManifest: C,
                repository: x
            } = f.pluginInfo, {
                marketplace: B
            } = Z4(x), m = eI(B);
            if (h._PROTO_plugin_name = C.name, B) h._PROTO_marketplace_name = B;
            if (h.plugin_repository = m ? x : "third-party", h.plugin_name = m ? C.name : "third-party", m && C.version) h.plugin_version = C.version;
            Object.assign(h, YH6(f.pluginInfo))
        }
        return d("tengu_input_command", {
            ...h,
            invocation_trigger: "user-slash",
            ...xs(f.type === "prompt" ? f.source : void 0, f.loadedFrom, f.kind, f.type === "prompt" ? f.createdBy : void 0),
            ...!1
        }), {
            messages: [],
            shouldQuery: !1,
            model: Z,
            nextInput: V,
            submitNextInput: k
        }
    }
    if (P.length === 2 && P[1].type === "user" && typeof P[1].message.content === "string" && P[1].message.content.startsWith("Unknown command:")) {
        if (!(q.startsWith("/var") || q.startsWith("/tmp") || q.startsWith("/private"))) d("tengu_input_slash_invalid", {
            input: H,
            had_suggestion: !1
        });
        return {
            messages: [zu(), ...P],
            shouldQuery: W,
            allowedTools: D,
            model: Z
        }
    }
    let N = {
        input: M
    };
    if (f.type === "prompt" && f.pluginInfo) {
        let {
            pluginManifest: h,
            repository: C
        } = f.pluginInfo, {
            marketplace: x
        } = Z4(C), B = eI(x);
        if (N._PROTO_plugin_name = h.name, x) N._PROTO_marketplace_name = x;
        if (N.plugin_repository = B ? C : "third-party", N.plugin_name = B ? h.name : "third-party", B && h.version) N.plugin_version = h.version;
        Object.assign(N, YH6(f.pluginInfo))
    }
    d("tengu_input_command", {
        ...N,
        invocation_trigger: "user-slash",
        ...xs(f.type === "prompt" ? f.source : void 0, f.loadedFrom, f.kind, f.type === "prompt" ? f.createdBy : void 0),
        ...!1
    });
    let R = P.length > 0 && P[0] && RJ(P[0]);
    return {
        messages: W || P.every(mq7) || R ? P : [zu(), ...P],
        shouldQuery: W,
        allowedTools: D,
        model: Z,
        effort: G,
        resultText: v,
        nextInput: V,
        submitNextInput: k
    }
}
// @from(Ln 358344, Col 0)
async function lKY(q, K, _, z, Y, A, O, w, $) {
    let j = $b6(q, z.options.commands);
    if (j.type === "prompt" && j.userInvocable !== !1) jI8(j.name);
    if (j.userInvocable === !1) return {
        messages: [t8({
            content: JS({
                inputString: `/${q}`,
                precedingInputBlocks: Y
            })
        }), t8({
            content: `This skill can only be invoked by Claude, not directly by users. Ask Claude to use the "${q}" skill for you.`
        })],
        shouldQuery: !1,
        command: j
    };
    if (j.type === "local-jsx" && z.options.isNonInteractiveSession) {
        let H = `/${y_(j)} opens an interactive panel and isn't available in this environment. Run it from the Claude Code terminal instead.`;
        return {
            messages: [kT(Ab6(j, K)), kT(`<local-command-stdout>${H}</local-command-stdout>`)],
            shouldQuery: !1,
            command: j,
            resultText: H
        }
    }
    try {
        switch (j.type) {
            case "local-jsx":
                return new Promise((H) => {
                    let J = !1,
                        X = (M, P) => {
                            if (J = !0, P?.display === "skip") {
                                H({
                                    messages: [],
                                    shouldQuery: !1,
                                    command: j,
                                    nextInput: P?.nextInput,
                                    submitNextInput: P?.submitNextInput
                                });
                                return
                            }
                            let W = (P?.metaMessages ?? []).map((Z) => t8({
                                    content: Z,
                                    isMeta: !0
                                })),
                                D = lq() && typeof M === "string" && M.endsWith(" dismissed");
                            H({
                                messages: P?.display === "system" ? D ? W : [kT(Ab6(j, K)), kT(`<local-command-stdout>${M}</local-command-stdout>`), ...W] : [t8({
                                    content: JS({
                                        inputString: Ab6(j, K),
                                        precedingInputBlocks: Y
                                    })
                                }), M ? t8({
                                    content: `<local-command-stdout>${M}</local-command-stdout>`
                                }) : t8({
                                    content: `<local-command-stdout>${Yy}</local-command-stdout>`
                                }), ...W],
                                shouldQuery: P?.shouldQuery ?? !1,
                                command: j,
                                nextInput: P?.nextInput,
                                submitNextInput: P?.submitNextInput
                            })
                        };
                    j.load().then((M) => M.call(X, {
                        ...z,
                        canUseTool: w
                    }, K)).then((M) => {
                        if (M == null) return;
                        if (J) return;
                        _({
                            jsx: M,
                            shouldHidePromptInput: !0,
                            showSpinner: !1,
                            isLocalJSXCommand: !0,
                            isImmediate: j.immediate === !0
                        })
                    }).catch((M) => {
                        if (j6(M), J) return;
                        J = !0, _({
                            jsx: null,
                            shouldHidePromptInput: !1,
                            clearLocalJSX: !0
                        }), H({
                            messages: [],
                            shouldQuery: !1,
                            command: j
                        })
                    })
                });
            case "local": {
                let H = j.isSensitive && K.trim() ? "***" : K,
                    J = t8({
                        content: JS({
                            inputString: Ab6(j, H),
                            precedingInputBlocks: Y
                        })
                    });
                try {
                    let X = zu(),
                        P = await (await j.load()).call(K, z);
                    if (P.type === "skip") return {
                        messages: [],
                        shouldQuery: !1,
                        command: j
                    };
                    if (P.type === "compact") {
                        let W = [X, J, ...P.displayText ? [t8({
                                content: `<local-command-stdout>${P.displayText}</local-command-stdout>`,
                                timestamp: new Date(Date.now() + 100).toISOString()
                            })] : []],
                            D = {
                                ...P.compactionResult,
                                messagesToKeep: [...P.compactionResult.messagesToKeep ?? [], ...W]
                            };
                        return SR(), {
                            messages: Yt(D),
                            shouldQuery: !1,
                            command: j
                        }
                    }
                    return {
                        messages: [J, kT(`<local-command-stdout>${P.value}</local-command-stdout>`)],
                        shouldQuery: !1,
                        command: j,
                        resultText: P.value
                    }
                } catch (X) {
                    return j6(X), {
                        messages: [J, kT(`<local-command-stderr>${String(X)}</local-command-stderr>`)],
                        shouldQuery: !1,
                        command: j
                    }
                }
            }
            case "prompt":
                try {
                    if (j.context === "fork") return await dKY(j, K, z, Y, _, w ?? LX);
                    return await MJK(j, K, z, Y, A, $)
                } catch (H) {
                    if (H instanceof sz) return {
                        messages: [t8({
                            content: JS({
                                inputString: Ab6(j, K),
                                precedingInputBlocks: Y
                            })
                        }), _e({
                            toolUse: !1
                        })],
                        shouldQuery: !1,
                        command: j
                    };
                    return {
                        messages: [t8({
                            content: JS({
                                inputString: Ab6(j, K),
                                precedingInputBlocks: Y
                            })
                        }), t8({
                            content: `<local-command-stderr>${String(H)}</local-command-stderr>`
                        })],
                        shouldQuery: !1,
                        command: j
                    }
                }
        }
    } catch (H) {
        if (H instanceof rg) return {
            messages: [t8({
                content: JS({
                    inputString: H.message,
                    precedingInputBlocks: Y
                })
            })],
            shouldQuery: !1,
            command: j
        };
        throw H
    }
}
// @from(Ln 358523, Col 0)
function Ab6(q, K) {
    return wb6(y_(q), K)
}
// @from(Ln 358527, Col 0)
function XJK(q, K = "loading") {
    return [`<${LW}>${q}</${LW}>`, `<${TV}>${q}</${TV}>`, "<skill-format>true</skill-format>"].join(`
`)
}
// @from(Ln 358532, Col 0)
function jJK(q, K) {
    return [`<${LW}>${q}</${LW}>`, `<${TV}>/${q}</${TV}>`, K ? `<command-args>${K}</command-args>` : null].filter(Boolean).join(`
`)
}
// @from(Ln 358537, Col 0)
function nKY(q, K) {
    if (q.userInvocable !== !1) return jJK(q.name, K);
    if (q.loadedFrom === "skills" || q.loadedFrom === "plugin" || q.loadedFrom === "mcp") return XJK(q.name, q.progressMessage);
    return jJK(q.name, K)
}
// @from(Ln 358542, Col 0)
async function iKY(q, K, _, z, Y = []) {
    let A = ll(q, _);
    if (!A) throw new rg(`Unknown command: ${q}`);
    if (A.type !== "prompt") throw Error(`Unexpected ${A.type} command. Expected 'prompt' command. Use /${q} directly in the main conversation.`);
    return MJK(A, K, z, [], Y)
}
// @from(Ln 358548, Col 0)
async function MJK(q, K, _, z = [], Y = [], A) {
    let O = await q.getPromptForCommand(K, _),
        w = !HT("hooks") || T18(q.source);
    if (q.hooks && w) {
        let W = I8();
        wJK(_.setAppState, W, q.hooks, q.name, q.type === "prompt" ? q.skillRoot : void 0)
    }
    let $ = q.source ? `${q.source}:${q.name}` : q.name,
        j = O.filter((W) => W.type === "text").map((W) => W.text).join(`

`);
    RD6(q.name, $, j, uB()?.agentId ?? null);
    let H = nKY(q, K),
        J = iR(q.allowedTools ?? []),
        X = Y.length > 0 || z.length > 0 ? [...Y, ...z, ...O] : O,
        M = await Ru8(Ob6(O.filter((W) => W.type === "text").map((W) => W.text).join(" "), _, null, [], _.messages, "repl_main_thread", {
            skipSkillDiscovery: !0,
            planSlugSeed: K
        }));
    return {
        messages: [t8({
            content: H,
            uuid: A
        }), t8({
            content: X,
            isMeta: !0
        }), ...M, Y4({
            type: "command_permissions",
            allowedTools: J,
            model: q.model
        })],
        shouldQuery: !0,
        allowedTools: J,
        model: q.model,
        effort: q.effort,
        command: q
    }
}
// @from(Ln 358586, Col 4)
oK8 = L(() => {
    y8();
    CA();
    y8();
    rA();
    C8();
    _36();
    ep();
    $y();
    vJ6();
    FK8();
    x$();
    mB();
    ZM();
    K8();
    Q8();
    m8();
    eK();
    lf();
    Yq();
    nO();
    EJ6();
    $JK();
    U8();
    b$();
    _7();
    vX();
    g$();
    aW();
    jJ6();
    Ih6();
    uf();
    sK6();
    kD();
    dc();
    m26()
})
// @from(Ln 358623, Col 0)
async function Bq7(q) {
    let K = q.getAppState().mcp.commands.filter((z) => z.type === "prompt" && z.loadedFrom === "mcp");
    if (K.length === 0) return eD(c9());
    let _ = await eD(c9());
    return j2([..._, ...K], "name")
}
// @from(Ln 358630, Col 0)
function PJK(q, K) {
    if (K.agentId !== void 0) return !1;
    let _ = new RegExp(`(?<!\\S)/${E16(q)}(?=$|\\s)`);
    for (let z = K.messages.length - 1; z >= K.turnStartIndex; z--) {
        let Y = K.messages[z];
        if (Y.type !== "user" || Y.isMeta) continue;
        let A = Y.message.content;
        if (typeof A === "string") {
            if (A.includes(`<${LW}>`)) continue
        } else if (A.some((O) => O.type === "tool_result")) continue;
        if (_.test(it(Y) ?? "")) return !0
    }
    return !1
}
// @from(Ln 358644, Col 0)
async function rKY(q, K, _, z, Y, A, O) {
    let w = Date.now(),
        $ = tp(),
        j = UF().has(K),
        H = DJK(q),
        J = q.source === "bundled",
        X = j || J || H ? K : "custom",
        M = {},
        P = q.pluginInfo ? Z4(q.pluginInfo.repository).marketplace : void 0,
        W = z.queryTracking?.depth ?? 0,
        D = uB()?.agentId;
    d("tengu_skill_tool_invocation", {
        command_name: X,
        _PROTO_skill_name: K,
        execution_context: "fork",
        invocation_trigger: W > 0 ? "nested-skill" : "claude-proactive",
        query_depth: W,
        ...D && {
            parent_agent_id: D
        },
        ...M,
        ...xs(q.source, q.loadedFrom, q.kind, q.createdBy),
        ...!1,
        ...q.pluginInfo && {
            _PROTO_plugin_name: q.pluginInfo.pluginManifest.name,
            ...P && {
                _PROTO_marketplace_name: P
            },
            plugin_name: H ? q.pluginInfo.pluginManifest.name : "third-party",
            plugin_repository: H ? q.pluginInfo.repository : "third-party",
            ...YH6(q.pluginInfo)
        }
    }), WJK(K, q);
    let {
        modifiedGetAppState: Z,
        baseAgent: G,
        promptMessages: f,
        skillContent: v
    } = await Wx8(q, _ || "", z), V = q.effort !== void 0 ? {
        ...G,
        effort: q.effort
    } : G, k = [];
    E(`SkillTool executing forked skill ${K} with agent ${V.agentType}`);
    try {
        for await (let h of _u({
            agentDefinition: V,
            promptMessages: f,
            toolUseContext: {
                ...z,
                getAppState: Z
            },
            canUseTool: Y,
            isAsync: !1,
            querySource: "agent:custom",
            model: q.model,
            availableTools: z.options.tools,
            override: {
                agentId: $
            }
        })) if (k.push(h), (h.type === "assistant" || h.type === "user") && O) {
            let C = aP([h]);
            for (let x of C)
                if (x.message.content.some((m) => m.type === "tool_use" || m.type === "tool_result")) O({
                    toolUseID: `skill_${A.message.id}`,
                    data: {
                        message: x,
                        type: "skill_progress",
                        prompt: v,
                        agentId: $
                    }
                })
        }
        let N = Dx8(k, "Skill execution completed");
        k.length = 0;
        let R = Date.now() - w;
        return E(`SkillTool forked skill ${K} completed in ${R}ms`), {
            data: {
                success: !0,
                commandName: K,
                status: "forked",
                agentId: $,
                result: N
            }
        }
    } finally {
        R86($)
    }
}
// @from(Ln 358733, Col 0)
function tKY(q) {
    for (let K of Object.keys(q)) {
        if (sKY.has(K)) continue;
        let _ = q[K];
        if (_ === void 0 || _ === null) continue;
        if (Array.isArray(_) && _.length === 0) continue;
        if (typeof _ === "object" && !Array.isArray(_) && Object.keys(_).length === 0) continue;
        return !1
    }
    return !0
}
// @from(Ln 358745, Col 0)
function WJK(q, K) {
    let _ = K?.type === "prompt" ? K.pluginInfo : void 0,
        z = _ ? Z4(_.repository).marketplace : void 0;
    Xz("skill_activated", {
        "skill.name": q,
        ...K?.type === "prompt" && {
            "skill.source": K.source
        },
        ...K?.kind && {
            "skill.kind": K.kind
        },
        ..._ && {
            "plugin.name": _.pluginManifest.name
        },
        ...z && {
            "marketplace.name": z
        }
    })
}
// @from(Ln 358765, Col 0)
function DJK(q) {
    if (q.source !== "plugin" || !q.pluginInfo?.repository) return !1;
    return eI(Z4(q.pluginInfo.repository).marketplace)
}
// @from(Ln 358769, Col 4)
oKY
// @from(Ln 358769, Col 9)
aKY
// @from(Ln 358769, Col 14)
m96
// @from(Ln 358769, Col 19)
sKY
// @from(Ln 358770, Col 4)
XU8 = L(() => {
    tI();
    y8();
    CA();
    gq();
    K8();
    g$();
    aW();
    uf();
    sK6();
    p7();
    y8();
    rA();
    C8();
    mB();
    m8();
    lf();
    Lf();
    _7();
    Sq();
    Ih6();
    dc();
    vJ6();
    Mh6();
    FHK();
    oKY = C6(() => y.object({
        skill: y.string().describe("The name of a skill from the available-skills list. Do not guess names."),
        args: y.string().optional().describe("Optional arguments for the skill")
    })), aKY = C6(() => {
        let q = y.object({
                success: y.boolean().describe("Whether the skill is valid"),
                commandName: y.string().describe("The name of the skill"),
                allowedTools: y.array(y.string()).optional().describe("Tools allowed by this skill"),
                model: y.string().optional().describe("Model override if specified"),
                status: y.literal("inline").optional().describe("Execution status")
            }),
            K = y.object({
                success: y.boolean().describe("Whether the skill completed successfully"),
                commandName: y.string().describe("The name of the skill"),
                status: y.literal("forked").describe("Execution status"),
                agentId: y.string().describe("The ID of the sub-agent that executed the skill"),
                result: y.string().describe("The result from the forked skill execution")
            });
        return y.union([q, K])
    }), m96 = Iq({
        name: VH,
        searchHint: "invoke a slash-command skill",
        maxResultSizeChars: 1e5,
        get inputSchema() {
            return oKY()
        },
        get outputSchema() {
            return aKY()
        },
        description: async ({
            skill: q
        }) => `Execute skill: ${q}`,
        prompt: async () => bb8(c9()),
        toAutoClassifierInput: ({
            skill: q
        }) => q ?? "",
        async validateInput({
            skill: q
        }, K) {
            let _ = q.trim();
            if (!_) return {
                result: !1,
                message: `Invalid skill format: ${q}`,
                errorCode: 1
            };
            let z = _.startsWith("/");
            if (z) d("tengu_skill_tool_slash_prefix", {});
            let Y = z ? _.substring(1) : _,
                A = await Bq7(K),
                O = ll(Y, A);
            if (!O) {
                let $ = Yb6(Y, A.map((j) => ({
                    name: y_(j),
                    aliases: j.aliases
                })), {
                    maxEditDistance: 2
                });
                return {
                    result: !1,
                    message: $ ? `Unknown skill: ${Y}. Did you mean ${$}?` : `Unknown skill: ${Y}`,
                    errorCode: 2
                }
            }
            if (O.disableModelInvocation && !PJK(Y, K)) return {
                result: !1,
                message: `Skill ${Y} cannot be used with ${VH} tool due to disable-model-invocation`,
                errorCode: 4
            };
            let w = u56(O);
            if (w === "off" || w === "user-invocable-only" && !PJK(Y, K)) return {
                result: !1,
                message: `Skill ${Y} is disabled for model invocation in skillOverrides settings`,
                errorCode: 7
            };
            if (O.type !== "prompt") {
                let $ = O.type === "local-jsx" ? "UI" : "built-in CLI";
                return {
                    result: !1,
                    message: `${Y} is a ${$} command, not a skill. Ask the user to run /${Y} themselves — it cannot be invoked via the ${VH} tool.`,
                    errorCode: 5
                }
            }
            return {
                result: !0
            }
        },
        async checkPermissions({
            skill: q,
            args: K
        }, _) {
            let z = q.trim(),
                Y = z.startsWith("/") ? z.substring(1) : z,
                O = _.getAppState().toolPermissionContext,
                w = await Bq7(_),
                $ = ll(Y, w),
                j = (M) => {
                    let P = M.startsWith("/") ? M.substring(1) : M;
                    if (P === Y) return !0;
                    if (P.endsWith(":*")) {
                        let W = P.slice(0, -2);
                        return Y.startsWith(W)
                    }
                    return !1
                },
                H = QF(O, m96, "deny");
            for (let [M, P] of H.entries())
                if (j(M)) return {
                    behavior: "deny",
                    message: "Skill execution blocked by permission rules",
                    decisionReason: {
                        type: "rule",
                        rule: P
                    }
                };
            let J = QF(O, m96, "allow");
            for (let [M, P] of J.entries())
                if (j(M)) return {
                    behavior: "allow",
                    updatedInput: {
                        skill: q,
                        args: K
                    },
                    decisionReason: {
                        type: "rule",
                        rule: P
                    }
                };
            if ($?.type === "prompt" && tKY($)) return {
                behavior: "allow",
                updatedInput: {
                    skill: q,
                    args: K
                },
                decisionReason: void 0
            };
            let X = [{
                type: "addRules",
                rules: [{
                    toolName: VH,
                    ruleContent: Y
                }],
                behavior: "allow",
                destination: "localSettings"
            }, {
                type: "addRules",
                rules: [{
                    toolName: VH,
                    ruleContent: `${Y}:*`
                }],
                behavior: "allow",
                destination: "localSettings"
            }];
            return {
                behavior: "ask",
                message: `Execute skill: ${Y}`,
                decisionReason: void 0,
                suggestions: X,
                updatedInput: {
                    skill: q,
                    args: K
                },
                metadata: $ ? {
                    command: $
                } : void 0
            }
        },
        async call({
            skill: q,
            args: K
        }, _, z, Y, A) {
            let O = q.trim(),
                w = O.startsWith("/") ? O.substring(1) : O,
                $ = await Bq7(_),
                j = ll(w, $);
            if (jI8(w), j?.type === "prompt" && j.context === "fork") return rKY(j, w, K, _, z, Y, A);
            let {
                processPromptSlashCommand: H
            } = await Promise.resolve().then(() => (oK8(), rK8)), J = await H(w, K || "", $, _);
            if (!J.shouldQuery) throw Error("Command processing failed");
            let X = J.allowedTools || [],
                M = J.model,
                P = j?.type === "prompt" ? j.effort : void 0,
                W = UF().has(w),
                D = j?.type === "prompt" && j.source === "bundled",
                Z = j?.type === "prompt" && DJK(j),
                G = W || D || Z ? w : "custom",
                f = {},
                v = j?.type === "prompt" && j.pluginInfo ? Z4(j.pluginInfo.repository).marketplace : void 0,
                V = _.queryTracking?.depth ?? 0,
                k = uB()?.agentId;
            d("tengu_skill_tool_invocation", {
                command_name: G,
                _PROTO_skill_name: w,
                execution_context: "inline",
                invocation_trigger: V > 0 ? "nested-skill" : "claude-proactive",
                query_depth: V,
                ...k && {
                    parent_agent_id: k
                },
                ...f,
                ...xs(j?.type === "prompt" ? j.source : void 0, j?.loadedFrom, j?.kind, j?.type === "prompt" ? j.createdBy : void 0),
                ...!1,
                ...j?.type === "prompt" && j.pluginInfo && {
                    _PROTO_plugin_name: j.pluginInfo.pluginManifest.name,
                    ...v && {
                        _PROTO_marketplace_name: v
                    },
                    plugin_name: Z ? j.pluginInfo.pluginManifest.name : "third-party",
                    plugin_repository: Z ? j.pluginInfo.repository : "third-party",
                    ...YH6(j.pluginInfo)
                }
            }), WJK(w, j);
            let N = xHK(Y, VH),
                R = IHK(J.messages.filter((h) => {
                    if (h.type === "progress") return !1;
                    if (h.type === "user" && "message" in h) {
                        let C = h.message.content;
                        if (typeof C === "string" && C.includes(`<${LW}>`)) return !1
                    }
                    return !0
                }), N);
            return E(`SkillTool returning ${R.length} newMessages for skill ${w}`), {
                data: {
                    success: !0,
                    commandName: w,
                    allowedTools: X.length > 0 ? X : void 0,
                    model: M
                },
                newMessages: R,
                contextModifier(h) {
                    let C = h;
                    if (X.length > 0) {
                        let x = C.getAppState;
                        C = {
                            ...C,
                            getAppState() {
                                let B = x();
                                return {
                                    ...B,
                                    toolPermissionContext: {
                                        ...B.toolPermissionContext,
                                        alwaysAllowRules: {
                                            ...B.toolPermissionContext.alwaysAllowRules,
                                            command: F4([...B.toolPermissionContext.alwaysAllowRules.command || [], ...X])
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (M) C = {
                        ...C,
                        options: {
                            ...C.options,
                            mainLoopModel: Xn6(M, h.options.mainLoopModel)
                        }
                    };
                    if (P !== void 0) {
                        let x = C.getAppState;
                        C = {
                            ...C,
                            getAppState() {
                                return {
                                    ...x(),
                                    effortValue: P
                                }
                            }
                        }
                    }
                    return C
                }
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            if ("status" in q && q.status === "forked") return {
                type: "tool_result",
                tool_use_id: K,
                content: `Skill "${q.commandName}" completed (forked execution).

Result:
${q.result}`
            };
            return {
                type: "tool_result",
                tool_use_id: K,
                content: `Launching skill: ${q.commandName}`
            }
        },
        renderToolResultMessage: uHK,
        renderToolUseMessage: mHK,
        renderToolUseProgressMessage: $U8,
        renderToolUseRejectedMessage: BHK,
        renderToolUseErrorMessage: pHK
    }), sKY = new Set(["type", "progressMessage", "contentLength", "argNames", "model", "effort", "source", "pluginInfo", "disableNonInteractive", "skillRoot", "context", "agent", "getPromptForCommand", "frontmatterKeys", "createdBy", "name", "description", "hasUserSpecifiedDescription", "isEnabled", "isHidden", "aliases", "isMcp", "argumentHint", "whenToUse", "paths", "version", "disableModelInvocation", "userInvocable", "loadedFrom", "immediate", "userFacingName"])
})
// @from(Ln 359099, Col 0)
function K5Y(q, K) {
    let _ = pq7(q),
        z = pq7(q, K),
        Y = q5Y(_, z);
    if (Y.startsWith("..") || pq7(Y) === Y) return null;
    return z
}