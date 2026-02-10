
// @from(Ln 326740, Col 0)
function XVY(A, q) {
    return async (K, Y, z, w, H) => {
        let $ = await uX(K, Y, z, w, H);
        if ($.behavior !== "ask") return $;
        if (q.signal.aborted) return {
            behavior: "ask",
            message: $I
        };
        let O = await z.getAppState(),
            _ = await K.description(Y, {
                isNonInteractiveSession: z.options.isNonInteractiveSession,
                toolPermissionContext: O.toolPermissionContext,
                tools: z.options.tools
            });
        if (q.signal.aborted) return {
            behavior: "ask",
            message: $I
        };
        let J = iM6();
        if (J) return new Promise((X) => {
            let D = !1,
                j = () => {
                    if (D) return;
                    D = !0, X({
                        behavior: "ask",
                        message: $I
                    }), J((M) => M.filter((P) => P.toolUseID !== H))
                };
            q.signal.addEventListener("abort", j, {
                once: !0
            }), J((M) => [...M, {
                assistantMessage: w,
                tool: K,
                description: _,
                input: Y,
                toolUseContext: z,
                toolUseID: H,
                permissionResult: $,
                permissionPromptStartTimeMs: Date.now(),
                workerBadge: A.color ? {
                    name: A.agentName,
                    color: A.color
                } : void 0,
                onUserInteraction() {},
                onAbort() {
                    if (D) return;
                    D = !0, q.signal.removeEventListener("abort", j), X({
                        behavior: "ask",
                        message: $I
                    })
                },
                async onAllow(P, W, G, f) {
                    if (D) return;
                    if (D = !0, q.signal.removeEventListener("abort", j), nC(W), W.length > 0) {
                        let N = db4();
                        if (N) {
                            let T = await z.getAppState(),
                                k = WV(T.toolPermissionContext, W);
                            N(k, {
                                preserveMode: !0
                            })
                        }
                    }
                    let Z = G?.trim();
                    X({
                        behavior: "allow",
                        updatedInput: P,
                        userModified: !1,
                        acceptFeedback: Z || void 0,
                        ...f && f.length > 0 && {
                            contentBlocks: f
                        }
                    })
                },
                onReject(P, W) {
                    if (D) return;
                    D = !0, q.signal.removeEventListener("abort", j);
                    let G = P ? `${CQ1}${P}` : $I;
                    X({
                        behavior: "ask",
                        message: G,
                        contentBlocks: W
                    })
                },
                async recheckPermission() {
                    if (D) return;
                    let P = await uX(K, Y, z, w, H);
                    if (P.behavior === "allow") D = !0, q.signal.removeEventListener("abort", j), J((W) => W.filter((G) => G.toolUseID !== H)), X({
                        ...P,
                        updatedInput: Y,
                        userModified: !1
                    })
                }
            }])
        });
        return new Promise((X) => {
            let D = UM6({
                toolName: K.name,
                toolUseId: H,
                input: Y,
                description: _,
                permissionSuggestions: $.suggestions,
                workerId: A.agentId,
                workerName: A.agentName,
                workerColor: A.color,
                teamName: A.teamName
            });
            lM6({
                requestId: D.id,
                toolUseId: H,
                onAllow(W, G, f, Z) {
                    P(), nC(G);
                    let N = W && Object.keys(W).length > 0 ? W : Y;
                    X({
                        behavior: "allow",
                        updatedInput: N,
                        userModified: !1,
                        ...Z && Z.length > 0 && {
                            contentBlocks: Z
                        }
                    })
                },
                onReject(W, G) {
                    P();
                    let f = W ? `${CQ1}${W}` : $I;
                    X({
                        behavior: "ask",
                        message: f,
                        contentBlocks: G
                    })
                }
            }), pM6(D);
            let j = setInterval(() => {
                    if (q.signal.aborted) {
                        P(), X({
                            behavior: "ask",
                            message: $I
                        });
                        return
                    }
                    let W = Ld(A.agentName, A.teamName);
                    for (let G = 0; G < W.length; G++) {
                        let f = W[G];
                        if (f && !f.read) {
                            let Z = w51(f.text);
                            if (Z && Z.request_id === D.id) {
                                if (JQ1(A.agentName, A.teamName, G), Z.subtype === "success") eP1({
                                    requestId: Z.request_id,
                                    decision: "approved",
                                    updatedInput: Z.response?.updated_input,
                                    permissionUpdates: Z.response?.permission_updates
                                });
                                else eP1({
                                    requestId: Z.request_id,
                                    decision: "rejected",
                                    feedback: Z.error
                                });
                                return
                            }
                        }
                    }
                }, JVY),
                M = () => {
                    P(), X({
                        behavior: "ask",
                        message: $I
                    })
                };
            q.signal.addEventListener("abort", M, {
                once: !0
            });

            function P() {
                clearInterval(j), ub4(D.id), q.signal.removeEventListener("abort", M)
            }
        })
    }
}
// @from(Ln 326919, Col 0)
function _EA(A, q, K, Y) {
    let z = K ? ` color="${K}"` : "",
        w = Y ? ` summary="${Y}"` : "";
    return `<${qJ} teammate_id="${A}"${z}${w}>
${q}
</${qJ}>`
}
// @from(Ln 326927, Col 0)
function Id(A, q, K) {
    K((Y) => {
        let z = Y.tasks[A];
        if (!z || z.type !== "in_process_teammate") return Y;
        return {
            ...Y,
            tasks: {
                ...Y.tasks,
                [A]: q(z)
            }
        }
    })
}
// @from(Ln 326941, Col 0)
function DVY(A, q, K, Y) {
    f9(K2, {
        from: A,
        text: q,
        timestamp: new Date().toISOString(),
        color: K
    }, Y)
}
// @from(Ln 326950, Col 0)
function lb4(A, q, K, Y) {
    let z = DQ1(A, Y);
    DVY(A, Q1(z), q, K)
}
// @from(Ln 326955, Col 0)
function jVY(A) {
    return new Promise((q) => setTimeout(q, A))
}
// @from(Ln 326959, Col 0)
function MVY(A) {
    let q = new Set(A.filter((K) => K.status !== "completed").map((K) => K.id));
    return A.find((K) => {
        if (K.status !== "pending") return !1;
        if (K.owner) return !1;
        return K.blockedBy.every((Y) => !q.has(Y))
    })
}
// @from(Ln 326968, Col 0)
function PVY(A) {
    let q = `Complete all open tasks. Start with task #${A.id}: 

 ${A.subject}`;
    if (A.description) q += `

${A.description}`;
    return q
}
// @from(Ln 326978, Col 0)
function ib4(A, q) {
    try {
        let K = WX(A),
            Y = MVY(K);
        if (!Y) return;
        let z = o7A(A, Y.id, q);
        if (!z.success) {
            h(`[inProcessRunner] Failed to claim task #${Y.id}: ${z.reason}`);
            return
        }
        return JS(A, Y.id, {
            status: "in_progress"
        }), h(`[inProcessRunner] Claimed task #${Y.id}: ${Y.subject}`), PVY(Y)
    } catch (K) {
        h(`[inProcessRunner] Error checking task list: ${K}`);
        return
    }
}
// @from(Ln 326996, Col 0)
async function WVY(A, q, K, Y, z, w) {
    h(`[inProcessRunner] ${A.agentName} starting poll loop (abort=${q.signal.aborted})`);
    let $ = 0;
    while (!q.signal.aborted) {
        let _ = (await Y()).tasks[K];
        if (_ && _.type === "in_process_teammate" && _.pendingUserMessages.length > 0) {
            let X = _.pendingUserMessages[0];
            return z((D) => {
                let j = D.tasks[K];
                if (!j || j.type !== "in_process_teammate") return D;
                return {
                    ...D,
                    tasks: {
                        ...D.tasks,
                        [K]: {
                            ...j,
                            pendingUserMessages: j.pendingUserMessages.slice(1)
                        }
                    }
                }
            }), h(`[inProcessRunner] ${A.agentName} found pending user message (poll #${$})`), {
                type: "new_message",
                message: X,
                from: "user"
            }
        }
        if ($ > 0) await jVY(500);
        if ($++, q.signal.aborted) return h(`[inProcessRunner] ${A.agentName} aborted while waiting (poll #${$})`), {
            type: "aborted"
        };
        h(`[inProcessRunner] ${A.agentName} poll #${$}: checking mailbox`);
        try {
            let X = Ld(A.agentName, A.teamName),
                D = -1,
                j = null;
            for (let P = 0; P < X.length; P++) {
                let W = X[P];
                if (W && !W.read) {
                    let G = ss(W.text);
                    if (G) {
                        D = P, j = G;
                        break
                    }
                }
            }
            if (D !== -1) {
                let P = X[D],
                    W = X.slice(0, D).filter((G) => !G.read).length;
                return h(`[inProcessRunner] ${A.agentName} received shutdown request from ${j?.from} (prioritized over ${W} unread messages)`), JQ1(A.agentName, A.teamName, D), {
                    type: "shutdown_request",
                    request: j,
                    originalMessage: P.text
                }
            }
            let M = -1;
            for (let P = 0; P < X.length; P++) {
                let W = X[P];
                if (W && !W.read && W.from === K2) {
                    M = P;
                    break
                }
            }
            if (M === -1) M = X.findIndex((P) => !P.read);
            if (M !== -1) {
                let P = X[M];
                if (P) return h(`[inProcessRunner] ${A.agentName} received new message from ${P.from} (index ${M})`), JQ1(A.agentName, A.teamName, M), {
                    type: "new_message",
                    message: P.text,
                    from: P.from,
                    color: P.color,
                    summary: P.summary
                }
            }
        } catch (X) {
            h(`[inProcessRunner] ${A.agentName} poll error: ${X}`)
        }
        let J = ib4(w, A.agentName);
        if (J) return {
            type: "new_message",
            message: J,
            from: "task-list"
        }
    }
    return h(`[inProcessRunner] ${A.agentName} exiting poll loop (abort=${q.signal.aborted}, polls=${$})`), {
        type: "aborted"
    }
}
// @from(Ln 327083, Col 0)
async function GVY(A) {
    let {
        identity: q,
        taskId: K,
        prompt: Y,
        description: z,
        agentDefinition: w,
        teammateContext: H,
        toolUseContext: $,
        abortController: O,
        model: _,
        systemPrompt: J,
        systemPromptMode: X,
        allowedTools: D,
        allowPermissionPrompts: j
    } = A, {
        setAppState: M
    } = $;
    h(`[inProcessRunner] Starting agent loop for ${q.agentId}`);
    let P = {
            agentId: q.agentId,
            parentSessionId: q.parentSessionId,
            agentName: q.agentName,
            teamName: q.teamName,
            agentColor: q.color,
            planModeRequired: q.planModeRequired,
            isTeamLead: !1,
            agentType: "teammate"
        },
        W;
    if (X === "replace" && J) W = J;
    else {
        let y = [...await dZ($.options.tools, $.options.mainLoopModel, void 0, $.options.mcpClients), wEA];
        if (w) {
            let B = w.getSystemPrompt();
            if (B) y.push(`
# Custom Agent Instructions
${B}`);
            if (w.memory) c("tengu_agent_memory_loaded", {
                ...{},
                scope: w.memory,
                source: "in-process-teammate"
            })
        }
        if (X === "append" && J) y.push(J);
        W = y.join(`
`)
    }
    let G = {
            agentType: q.agentName,
            whenToUse: `In-process teammate: ${q.agentName}`,
            getSystemPrompt: () => W,
            tools: w?.tools ? [...new Set([...w.tools, iB, vh, VK1, Nh, NK1, TK1, DR])] : ["*"],
            source: "projectSettings",
            permissionMode: "default"
        },
        f = [],
        Z = _EA("team-lead", Y, void 0, z),
        N = Z,
        T = !1;
    ib4(q.parentSessionId, q.agentName);
    try {
        Id(K, (k) => ({
            ...k,
            messages: [...k.messages ?? [], c6({
                content: Z
            })]
        }), M);
        while (!O.signal.aborted && !T) {
            h(`[inProcessRunner] ${q.agentId} processing prompt: ${N.substring(0,50)}...`);
            let k = Aq();
            Id(K, (t) => ({
                ...t,
                currentWorkAbortController: k
            }), M);
            let y = c6({
                    content: N
                }),
                B = [y],
                S = f,
                m = Ev(f);
            if (m > SQ1($.options.mainLoopModel)) {
                h(`[inProcessRunner] ${q.agentId} compacting history (${m} tokens)`);
                let t = {
                        ...$,
                        readFileState: yp($.readFileState),
                        onCompactProgress: void 0,
                        setStreamMode: void 0
                    },
                    J1 = await AW1(f, t, {
                        systemPrompt: [],
                        userContext: {},
                        systemContext: {},
                        toolUseContext: t,
                        forkContextMessages: []
                    }, !0, void 0, !0);
                S = qt(J1), f.length = 0, f.push(...S)
            }
            let b = S.length > 0 ? [...S] : void 0;
            f.push(y);
            let g = YB1(),
                U = wB1($.options.tools),
                x = [],
                l = (await $.getAppState()).tasks[K],
                r = l && l.type === "in_process_teammate" ? l.permissionMode : "default",
                s = {
                    ...G,
                    permissionMode: r
                },
                O1 = !1;
            if (await nq6(H, async () => {
                    return p01(P, async () => {
                        Id(K, (t) => ({
                            ...t,
                            status: "running",
                            isIdle: !1
                        }), M);
                        for await (let t of dR({
                            agentDefinition: s,
                            promptMessages: B,
                            toolUseContext: $,
                            canUseTool: XVY(q, k),
                            isAsync: !0,
                            canShowPermissionPrompts: j ?? !0,
                            forkContextMessages: b,
                            querySource: "agent:custom",
                            override: {
                                abortController: k
                            },
                            model: _,
                            preserveToolUseResults: !0,
                            availableTools: $.options.tools,
                            allowedTools: D
                        })) {
                            if (O.signal.aborted) {
                                h(`[inProcessRunner] ${q.agentId} lifecycle aborted`);
                                break
                            }
                            if (k.signal.aborted) {
                                h(`[inProcessRunner] ${q.agentId} current work aborted (Escape pressed)`), O1 = !0;
                                break
                            }
                            x.push(t), f.push(t), Qj1(g, t, U, $.options.tools);
                            let J1 = zB1(g);
                            Id(K, (D1) => {
                                let Z1 = D1.inProgressToolUseIDs;
                                if (t.type === "assistant") {
                                    for (let E1 of t.message.content)
                                        if (E1.type === "tool_use") Z1 = new Set([...Z1 ?? [], E1.id])
                                } else if (t.type === "user") {
                                    let E1 = t.message.content;
                                    if (Array.isArray(E1)) {
                                        for (let a of E1)
                                            if (typeof a === "object" && "type" in a && a.type === "tool_result") {
                                                if (Z1) Z1 = new Set(Z1), Z1.delete(a.tool_use_id)
                                            }
                                    }
                                }
                                return {
                                    ...D1,
                                    progress: J1,
                                    messages: [...D1.messages ?? [], t],
                                    inProgressToolUseIDs: Z1,
                                    lastReportedToolCount: g.toolUseCount,
                                    lastReportedTokenCount: LjA(g)
                                }
                            }, M)
                        }
                        return {
                            success: !0,
                            messages: x
                        }
                    })
                }), Id(K, (t) => ({
                    ...t,
                    currentWorkAbortController: void 0
                }), M), O.signal.aborted) break;
            if (O1) {
                h(`[inProcessRunner] ${q.agentId} work interrupted, returning to idle`);
                let t = pY({
                    content: e31
                });
                Id(K, (J1) => ({
                    ...J1,
                    messages: [...J1.messages ?? [], t]
                }), M)
            }
            let N1 = (await $.getAppState()).tasks[K],
                j1 = N1?.type === "in_process_teammate" && N1.isIdle;
            if (Id(K, (t) => {
                    return t.onIdleCallbacks?.forEach((J1) => J1()), {
                        ...t,
                        isIdle: !0,
                        onIdleCallbacks: []
                    }
                }, M), !j1) lb4(q.agentName, q.color, q.teamName, {
                idleReason: O1 ? "interrupted" : "available",
                summary: WQ1(f)
            });
            else h(`[inProcessRunner] Skipping duplicate idle notification for ${q.agentName}`);
            h(`[inProcessRunner] ${q.agentId} finished prompt, waiting for next`);
            let q1 = await WVY(q, O, K, $.getAppState, M, q.parentSessionId);
            switch (q1.type) {
                case "shutdown_request":
                    h(`[inProcessRunner] ${q.agentId} received shutdown request - passing to model`), N = _EA(q1.request?.from || "team-lead", q1.originalMessage), Cj6(K, c6({
                        content: N
                    }), M);
                    break;
                case "new_message":
                    if (h(`[inProcessRunner] ${q.agentId} received new message from ${q1.from}`), q1.from === "user") N = q1.message;
                    else N = _EA(q1.from, q1.message, q1.color, q1.summary), Cj6(K, c6({
                        content: N
                    }), M);
                    break;
                case "aborted":
                    h(`[inProcessRunner] ${q.agentId} aborted while waiting`), T = !0;
                    break
            }
        }
        return Id(K, (k) => ({
            ...k,
            status: "completed",
            endTime: Date.now()
        }), M), {
            success: !0,
            messages: f
        }
    } catch (k) {
        let y = k instanceof Error ? k.message : "Unknown error";
        return h(`[inProcessRunner] Agent ${q.agentId} failed: ${y}`), Id(K, (B) => {
            return B.onIdleCallbacks?.forEach((S) => S()), {
                ...B,
                status: "failed",
                error: y,
                isIdle: !0,
                endTime: Date.now(),
                onIdleCallbacks: []
            }
        }, M), lb4(q.agentName, q.color, q.teamName, {
            idleReason: "failed",
            completedStatus: "failed",
            failureReason: y
        }), {
            success: !1,
            error: y,
            messages: f
        }
    }
}
// @from(Ln 327333, Col 0)
function nM6(A) {
    GVY(A).catch((q) => {
        h(`[inProcessRunner] Unhandled error in ${A.identity.agentId}: ${q}`)
    })
}
// @from(Ln 327338, Col 4)
JVY = 500
// @from(Ln 327339, Col 4)
JEA = v(() => {
    gR();
    At();
    ov();
    vz();
    Yv();
    d01();
    Z6();
    u6();
    H$();
    vw();
    ra();
    N8();
    RW();
    xd();
    vd();
    PJ();
    CO();
    m6();
    G2();
    tP1();
    yQ1();
    CO();
    N8();
    km();
    pM()
})
// @from(Ln 327366, Col 0)
class nb4 {
    type = "in-process";
    context = null;
    setContext(A) {
        this.context = A
    }
    async isAvailable() {
        return !0
    }
    async spawn(A) {
        if (!this.context) return h(`[InProcessBackend] spawn() called without context for ${A.name}`), {
            success: !1,
            agentId: `${A.name}@${A.teamName}`,
            error: "InProcessBackend not initialized. Call setContext() before spawn()."
        };
        h(`[InProcessBackend] spawn() called for ${A.name}`);
        let q = await LP1({
            name: A.name,
            teamName: A.teamName,
            prompt: A.prompt,
            color: A.color,
            planModeRequired: A.planModeRequired ?? !1
        }, this.context);
        if (q.success && q.taskId && q.teammateContext && q.abortController) nM6({
            identity: {
                agentId: q.agentId,
                agentName: A.name,
                teamName: A.teamName,
                color: A.color,
                planModeRequired: A.planModeRequired ?? !1,
                parentSessionId: q.teammateContext.parentSessionId
            },
            taskId: q.taskId,
            prompt: A.prompt,
            teammateContext: q.teammateContext,
            toolUseContext: this.context,
            abortController: q.abortController,
            model: A.model,
            systemPrompt: A.systemPrompt,
            systemPromptMode: A.systemPromptMode,
            allowedTools: A.permissions,
            allowPermissionPrompts: A.allowPermissionPrompts
        }), h(`[InProcessBackend] Started agent execution for ${q.agentId}`);
        return {
            success: q.success,
            agentId: q.agentId,
            taskId: q.taskId,
            abortController: q.abortController,
            error: q.error
        }
    }
    async sendMessage(A, q) {
        h(`[InProcessBackend] sendMessage() to ${A}: ${q.text.substring(0,50)}...`);
        let K = c31(A);
        if (!K) throw h(`[InProcessBackend] Invalid agentId format: ${A}`), Error(`Invalid agentId format: ${A}. Expected format: agentName@teamName`);
        let {
            agentName: Y,
            teamName: z
        } = K;
        f9(Y, {
            text: q.text,
            from: q.from,
            color: q.color,
            timestamp: q.timestamp ?? new Date().toISOString()
        }, z), h(`[InProcessBackend] sendMessage() completed for ${A}`)
    }
    async terminate(A, q) {
        if (h(`[InProcessBackend] terminate() called for ${A}: ${q}`), !this.context) return h(`[InProcessBackend] terminate() failed: no context set for ${A}`), !1;
        let K = await this.context.getAppState(),
            Y = ps(A, K.tasks);
        if (!Y) return h(`[InProcessBackend] terminate() failed: task not found for ${A}`), !1;
        if (Y.shutdownRequested) return h(`[InProcessBackend] terminate(): shutdown already requested for ${A}`), !0;
        let z = `shutdown-${A}-${Date.now()}`,
            w = lP1({
                requestId: z,
                from: "team-lead",
                reason: q
            }),
            H = Y.identity.agentName;
        return f9(H, {
            from: "team-lead",
            text: JSON.stringify(w),
            timestamp: new Date().toISOString()
        }, Y.identity.teamName), MTA(Y.id, this.context.setAppState), h(`[InProcessBackend] terminate() sent shutdown request to ${A}`), !0
    }
    async kill(A) {
        if (h(`[InProcessBackend] kill() called for ${A}`), !this.context) return h(`[InProcessBackend] kill() failed: no context set for ${A}`), !1;
        let q = await this.context.getAppState(),
            K = ps(A, q.tasks);
        if (!K) return h(`[InProcessBackend] kill() failed: task not found for ${A}`), !1;
        if (K.localTaskId) sq6(K.identity.teamName, K.localTaskId);
        let Y = Rj6(K.id, this.context.setAppState);
        return h(`[InProcessBackend] kill() ${Y?"succeeded":"failed"} for ${A}`), Y
    }
    async isActive(A) {
        if (h(`[InProcessBackend] isActive() called for ${A}`), !this.context) return h(`[InProcessBackend] isActive() failed: no context set for ${A}`), !1;
        let q = await this.context.getAppState(),
            K = ps(A, q.tasks);
        if (!K) return h(`[InProcessBackend] isActive(): task not found for ${A}`), !1;
        let Y = K.status === "running",
            z = K.abortController.signal.aborted,
            w = Y && !z;
        return h(`[InProcessBackend] isActive() for ${A}: ${w} (running=${Y}, aborted=${z})`), w
    }
}
// @from(Ln 327472, Col 0)
function rb4() {
    return new nb4
}
// @from(Ln 327475, Col 4)
ob4 = v(() => {
    Z6();
    yj6();
    JEA();
    gR();
    H$();
    vw()
})
// @from(Ln 327483, Col 4)
sb4 = {}
// @from(Ln 327495, Col 0)
function rM6() {
    return !!ab4
}
// @from(Ln 327498, Col 0)
async function OI() {
    if (hQ1 !== null) return hQ1;
    return hQ1 = !!ab4, hQ1
}
// @from(Ln 327503, Col 0)
function oM6() {
    return ZVY || null
}
// @from(Ln 327506, Col 0)
async function Kt() {
    return (await IA(iW, ["-V"])).code === 0
}
// @from(Ln 327510, Col 0)
function j51() {
    if (IQ1 !== null) return IQ1;
    let A = process.env.TERM_PROGRAM,
        q = !!process.env.ITERM_SESSION_ID,
        K = xA.terminal === "iTerm.app";
    return IQ1 = A === "iTerm.app" || q || K, IQ1
}
// @from(Ln 327517, Col 0)
async function xQ1() {
    return (await IA(aM6, ["--version"])).code === 0
}
// @from(Ln 327521, Col 0)
function fVY() {
    hQ1 = null, IQ1 = null
}
// @from(Ln 327524, Col 4)
ab4
// @from(Ln 327524, Col 9)
ZVY
// @from(Ln 327524, Col 14)
hQ1 = null
// @from(Ln 327525, Col 4)
IQ1 = null
// @from(Ln 327526, Col 4)
aM6 = "it2"
// @from(Ln 327527, Col 4)
Lm = v(() => {
    G5();
    tq();
    ab4 = process.env.TMUX, ZVY = process.env.TMUX_PANE
})
// @from(Ln 327532, Col 4)
jEA = {}
// @from(Ln 327542, Col 0)
function VVY(A) {
    qW1 = A
}
// @from(Ln 327546, Col 0)
function XEA() {
    return qW1
}
// @from(Ln 327550, Col 0)
function DEA(A) {
    qW1 = null, Yt = A, h(`[TeammateModeSnapshot] CLI override cleared, new mode: ${A}`)
}
// @from(Ln 327554, Col 0)
function tb4() {
    if (qW1) Yt = qW1, h(`[TeammateModeSnapshot] Captured from CLI override: ${Yt}`);
    else Yt = f6().teammateMode ?? "auto", h(`[TeammateModeSnapshot] Captured from config: ${Yt}`)
}
// @from(Ln 327559, Col 0)
function bQ1() {
    if (Yt === null) K1(Error("getTeammateModeFromSnapshot called before capture - this indicates an initialization bug")), tb4();
    return Yt ?? "auto"
}
// @from(Ln 327564, Col 0)
function NVY() {
    Yt = null, qW1 = null
}
// @from(Ln 327567, Col 4)
Yt = null
// @from(Ln 327568, Col 4)
qW1 = null
// @from(Ln 327569, Col 4)
KW1 = v(() => {
    cA();
    Z6();
    y6()
})
// @from(Ln 327575, Col 0)
function eb4() {
    if (process.env[pP1]) return process.env[pP1];
    return D9() ? process.execPath : process.argv[1]
}
// @from(Ln 327580, Col 0)
function Au4(A) {
    let q = [],
        {
            planModeRequired: K,
            permissionMode: Y
        } = A || {};
    if (K);
    else if (Y === "bypassPermissions" || HQ()) q.push("--dangerously-skip-permissions");
    else if (Y === "acceptEdits") q.push("--permission-mode acceptEdits");
    let z = HT();
    if (z) q.push(`--model ${R7([z])}`);
    let w = Il();
    if (w) q.push(`--settings ${R7([w])}`);
    let H = $61();
    for (let O of H) q.push(`--plugin-dir ${R7([O])}`);
    let $ = bQ1();
    return q.push(`--teammate-mode ${$}`), q.join(" ")
}
// @from(Ln 327598, Col 4)
qu4 = v(() => {
    M_();
    B6();
    KW1()
})
// @from(Ln 327603, Col 0)
class Ku4 {
    type;
    backend;
    context = null;
    spawnedTeammates;
    cleanupRegistered = !1;
    constructor(A) {
        this.backend = A, this.type = A.type, this.spawnedTeammates = new Map
    }
    setContext(A) {
        this.context = A
    }
    async isAvailable() {
        return this.backend.isAvailable()
    }
    async spawn(A) {
        let q = pv(A.name, A.teamName);
        if (!this.context) return h(`[PaneBackendExecutor] spawn() called without context for ${A.name}`), {
            success: !1,
            agentId: q,
            error: "PaneBackendExecutor not initialized. Call setContext() before spawn()."
        };
        try {
            let K = A.color ?? bd(q),
                {
                    paneId: Y,
                    isFirstTeammate: z
                } = await this.backend.createTeammatePaneInSwarmView(A.name, K),
                w = await OI();
            if (z && w) await this.backend.enablePaneBorderStatus();
            let H = eb4(),
                $ = [`--agent-id ${R7([q])}`, `--agent-name ${R7([A.name])}`, `--team-name ${R7([A.teamName])}`, `--agent-color ${R7([K])}`, `--parent-session-id ${R7([A.parentSessionId||U6()])}`, A.planModeRequired ? "--plan-mode-required" : ""].filter(Boolean).join(" "),
                O = await this.context.getAppState(),
                _ = Au4({
                    planModeRequired: A.planModeRequired,
                    permissionMode: O.toolPermissionContext.mode
                });
            if (A.model) _ = _.split(" ").filter((P, W, G) => P !== "--model" && G[W - 1] !== "--model").join(" "), _ = _ ? `${_} --model ${R7([A.model])}` : `--model ${R7([A.model])}`;
            let J = _ ? ` ${_}` : "",
                X = A.cwd,
                D = ["CLAUDECODE=1"];
            if (process.env.CLAUDE_CONFIG_DIR) D.push(`CLAUDE_CONFIG_DIR=${R7([process.env.CLAUDE_CONFIG_DIR])}`);
            let j = D.join(" "),
                M = `cd ${R7([X])} && ${j} ${R7([H])} ${$}${J}`;
            if (await this.backend.sendCommandToPane(Y, M, !w), this.spawnedTeammates.set(q, {
                    paneId: Y,
                    insideTmux: w
                }), !this.cleanupRegistered) this.cleanupRegistered = !0, Tq(async () => {
                for (let [P, W] of this.spawnedTeammates) h(`[PaneBackendExecutor] Cleanup: killing pane for ${P}`), await this.backend.killPane(W.paneId, !W.insideTmux);
                this.spawnedTeammates.clear()
            });
            return f9(A.name, {
                from: "team-lead",
                text: A.prompt,
                timestamp: new Date().toISOString()
            }, A.teamName), h(`[PaneBackendExecutor] Spawned teammate ${q} in pane ${Y}`), {
                success: !0,
                agentId: q,
                paneId: Y
            }
        } catch (K) {
            let Y = K instanceof Error ? K.message : String(K);
            return h(`[PaneBackendExecutor] Failed to spawn ${q}: ${Y}`), {
                success: !1,
                agentId: q,
                error: Y
            }
        }
    }
    async sendMessage(A, q) {
        h(`[PaneBackendExecutor] sendMessage() to ${A}: ${q.text.substring(0,50)}...`);
        let K = c31(A);
        if (!K) throw Error(`Invalid agentId format: ${A}. Expected format: agentName@teamName`);
        let {
            agentName: Y,
            teamName: z
        } = K;
        f9(Y, {
            text: q.text,
            from: q.from,
            color: q.color,
            timestamp: q.timestamp ?? new Date().toISOString()
        }, z), h(`[PaneBackendExecutor] sendMessage() completed for ${A}`)
    }
    async terminate(A, q) {
        h(`[PaneBackendExecutor] terminate() called for ${A}: ${q}`);
        let K = c31(A);
        if (!K) return h("[PaneBackendExecutor] terminate() failed: invalid agentId format"), !1;
        let {
            agentName: Y,
            teamName: z
        } = K, w = {
            type: "shutdown_request",
            requestId: `shutdown-${A}-${Date.now()}`,
            from: "team-lead",
            reason: q
        };
        return f9(Y, {
            from: "team-lead",
            text: Q1(w),
            timestamp: new Date().toISOString()
        }, z), h(`[PaneBackendExecutor] terminate() sent shutdown request to ${A}`), !0
    }
    async kill(A) {
        h(`[PaneBackendExecutor] kill() called for ${A}`);
        let q = this.spawnedTeammates.get(A);
        if (!q) return h(`[PaneBackendExecutor] kill() failed: teammate ${A} not found in spawned map`), !1;
        let {
            paneId: K,
            insideTmux: Y
        } = q, z = await this.backend.killPane(K, !Y);
        if (z) this.spawnedTeammates.delete(A), h(`[PaneBackendExecutor] kill() succeeded for ${A}`);
        else h(`[PaneBackendExecutor] kill() failed for ${A}`);
        return z
    }
    async isActive(A) {
        if (h(`[PaneBackendExecutor] isActive() called for ${A}`), !this.spawnedTeammates.get(A)) return h(`[PaneBackendExecutor] isActive(): teammate ${A} not found`), !1;
        return !0
    }
}
// @from(Ln 327724, Col 0)
function Yu4(A) {
    return new Ku4(A)
}
// @from(Ln 327727, Col 4)
zu4 = v(() => {
    Z6();
    Tz();
    H$();
    uQ1();
    Lm();
    M_();
    B6();
    qu4();
    m6()
})
// @from(Ln 327741, Col 0)
async function wu4() {
    if ((await IA("which", ["uv"])).code === 0) return h("[it2Setup] Found uv (will use uv tool install)"), "uvx";
    if ((await IA("which", ["pipx"])).code === 0) return h("[it2Setup] Found pipx package manager"), "pipx";
    if ((await IA("which", ["pip"])).code === 0) return h("[it2Setup] Found pip package manager"), "pip";
    if ((await IA("which", ["pip3"])).code === 0) return h("[it2Setup] Found pip3 package manager"), "pip";
    return h("[it2Setup] No Python package manager found"), null
}
// @from(Ln 327748, Col 0)
async function TVY() {
    return (await IA("which", ["it2"])).code === 0
}
// @from(Ln 327751, Col 0)
async function Hu4(A) {
    h(`[it2Setup] Installing it2 using ${A}`);
    let q;
    switch (A) {
        case "uvx":
            q = await d4("uv", ["tool", "install", "it2"], {
                cwd: sM6()
            });
            break;
        case "pipx":
            q = await d4("pipx", ["install", "it2"], {
                cwd: sM6()
            });
            break;
        case "pip":
            if (q = await d4("pip", ["install", "--user", "it2"], {
                    cwd: sM6()
                }), q.code !== 0) q = await d4("pip3", ["install", "--user", "it2"], {
                cwd: sM6()
            });
            break
    }
    if (q.code !== 0) {
        let K = q.stderr || "Unknown installation error";
        return K1(Error(`[it2Setup] Failed to install it2: ${K}`)), {
            success: !1,
            error: K,
            packageManager: A
        }
    }
    return h("[it2Setup] it2 installed successfully"), {
        success: !0,
        packageManager: A
    }
}
// @from(Ln 327786, Col 0)
async function MEA() {
    if (h("[it2Setup] Verifying it2 setup..."), !await TVY()) return {
        success: !1,
        error: "it2 CLI is not installed or not in PATH"
    };
    let q = await IA("it2", ["session", "list"]);
    if (q.code !== 0) {
        let K = q.stderr.toLowerCase();
        if (K.includes("api") || K.includes("python") || K.includes("connection refused") || K.includes("not enabled")) return h("[it2Setup] Python API not enabled in iTerm2"), {
            success: !1,
            error: "Python API not enabled in iTerm2 preferences",
            needsPythonApiEnabled: !0
        };
        return {
            success: !1,
            error: q.stderr || "Failed to communicate with iTerm2"
        }
    }
    return h("[it2Setup] it2 setup verified successfully"), {
        success: !0
    }
}
// @from(Ln 327809, Col 0)
function $u4() {
    return ["Almost done! Enable the Python API in iTerm2:", "", "  iTerm2 → Settings → General → Magic → Enable Python API", "", "After enabling, you may need to restart iTerm2."]
}
// @from(Ln 327813, Col 0)
function PEA() {
    if (f6().iterm2It2SetupComplete !== !0) jA((q) => ({
        ...q,
        iterm2It2SetupComplete: !0
    })), h("[it2Setup] Marked it2 setup as complete")
}
// @from(Ln 327820, Col 0)
function Ou4(A) {
    if (f6().preferTmuxOverIterm2 !== A) jA((K) => ({
        ...K,
        preferTmuxOverIterm2: A
    })), h(`[it2Setup] Set preferTmuxOverIterm2 = ${A}`)
}
// @from(Ln 327827, Col 0)
function _u4() {
    return f6().preferTmuxOverIterm2 === !0
}
// @from(Ln 327830, Col 4)
WEA = v(() => {
    tq();
    Z6();
    y6();
    cA()
})
// @from(Ln 327836, Col 4)
Du4 = {}
// @from(Ln 327842, Col 0)
function Ju4() {
    return new Promise((A) => setTimeout(A, vVY))
}
// @from(Ln 327846, Col 0)
function EVY() {
    let A, q = new Promise((Y) => {
            A = Y
        }),
        K = ZEA;
    return ZEA = q, K.then(() => A)
}
// @from(Ln 327854, Col 0)
function Xu4(A) {
    return {
        red: "red",
        blue: "blue",
        green: "green",
        yellow: "yellow",
        purple: "magenta",
        orange: "colour208",
        pink: "colour205",
        cyan: "cyan"
    } [A]
}
// @from(Ln 327867, Col 0)
function _I(A) {
    return IA(iW, A)
}
// @from(Ln 327871, Col 0)
function HP(A) {
    return IA(iW, ["-L", UP1(), ...A])
}
// @from(Ln 327874, Col 0)
class fEA {
    type = "tmux";
    displayName = "tmux";
    supportsHideShow = !0;
    async isAvailable() {
        return Kt()
    }
    async isRunningInside() {
        return OI()
    }
    async createTeammatePaneInSwarmView(A, q) {
        let K = await EVY();
        try {
            if (await this.isRunningInside()) return await this.createTeammatePaneWithLeader(A, q);
            return await this.createTeammatePaneExternal(A, q)
        } finally {
            K()
        }
    }
    async sendCommandToPane(A, q, K = !1) {
        let z = await (K ? HP : _I)(["send-keys", "-t", A, q, "Enter"]);
        if (z.code !== 0) throw Error(`Failed to send command to pane ${A}: ${z.stderr}`)
    }
    async setPaneBorderColor(A, q, K = !1) {
        let Y = Xu4(q),
            z = K ? HP : _I;
        await z(["select-pane", "-t", A, "-P", `bg=default,fg=${Y}`]), await z(["set-option", "-p", "-t", A, "pane-border-style", `fg=${Y}`]), await z(["set-option", "-p", "-t", A, "pane-active-border-style", `fg=${Y}`])
    }
    async setPaneTitle(A, q, K, Y = !1) {
        let z = Xu4(K),
            w = Y ? HP : _I;
        await w(["select-pane", "-t", A, "-T", q]), await w(["set-option", "-p", "-t", A, "pane-border-format", `#[fg=${z},bold] #{pane_title} #[default]`])
    }
    async enablePaneBorderStatus(A, q = !1) {
        let K = A || await this.getCurrentWindowTarget();
        if (!K) return;
        await (q ? HP : _I)(["set-option", "-w", "-t", K, "pane-border-status", "top"])
    }
    async rebalancePanes(A, q) {
        if (q) await this.rebalancePanesWithLeader(A);
        else await this.rebalancePanesTiled(A)
    }
    async killPane(A, q = !1) {
        return (await (q ? HP : _I)(["kill-pane", "-t", A])).code === 0
    }
    async hidePane(A, q = !1) {
        let K = q ? HP : _I;
        await K(["new-session", "-d", "-s", yvA]);
        let Y = await K(["break-pane", "-d", "-s", A, "-t", `${yvA}:`]);
        if (Y.code === 0) h(`[TmuxBackend] Hidden pane ${A}`);
        else h(`[TmuxBackend] Failed to hide pane ${A}: ${Y.stderr}`);
        return Y.code === 0
    }
    async showPane(A, q, K = !1) {
        let Y = K ? HP : _I,
            z = await Y(["join-pane", "-h", "-s", A, "-t", q]);
        if (z.code !== 0) return h(`[TmuxBackend] Failed to show pane ${A}: ${z.stderr}`), !1;
        h(`[TmuxBackend] Showed pane ${A} in ${q}`), await Y(["select-layout", "-t", q, "main-vertical"]);
        let H = (await Y(["list-panes", "-t", q, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean);
        if (H[0]) await Y(["resize-pane", "-t", H[0], "-x", "30%"]);
        return !0
    }
    async getCurrentPaneId() {
        let A = oM6();
        if (A) return A;
        let q = await IA(iW, ["display-message", "-p", "#{pane_id}"]);
        if (q.code !== 0) return h(`[TmuxBackend] Failed to get current pane ID (exit ${q.code}): ${q.stderr}`), null;
        return q.stdout.trim()
    }
    async getCurrentWindowTarget() {
        if (tM6) return tM6;
        let A = oM6(),
            q = ["display-message"];
        if (A) q.push("-t", A);
        q.push("-p", "#{session_name}:#{window_index}");
        let K = await IA(iW, q);
        if (K.code !== 0) return h(`[TmuxBackend] Failed to get current window target (exit ${K.code}): ${K.stderr}`), null;
        return tM6 = K.stdout.trim(), tM6
    }
    async getCurrentWindowPaneCount(A, q = !1) {
        let K = A || await this.getCurrentWindowTarget();
        if (!K) return null;
        let Y = ["list-panes", "-t", K, "-F", "#{pane_id}"],
            z = q ? await HP(Y) : await _I(Y);
        if (z.code !== 0) return K1(Error(`[TmuxBackend] Failed to get pane count for ${K} (exit ${z.code}): ${z.stderr}`)), null;
        return z.stdout.trim().split(`
`).filter(Boolean).length
    }
    async hasSessionInSwarm(A) {
        return (await HP(["has-session", "-t", A])).code === 0
    }
    async createExternalSwarmSession() {
        if (!await this.hasSessionInSwarm(WN)) {
            let w = await HP(["new-session", "-d", "-s", WN, "-n", gP1, "-P", "-F", "#{pane_id}"]);
            if (w.code !== 0) throw Error(`Failed to create swarm session: ${w.stderr||"Unknown error"}`);
            let H = w.stdout.trim(),
                $ = `${WN}:${gP1}`;
            return h(`[TmuxBackend] Created external swarm session with window ${$}, pane ${H}`), {
                windowTarget: $,
                paneId: H
            }
        }
        let K = (await HP(["list-windows", "-t", WN, "-F", "#{window_name}"])).stdout.trim().split(`
`).filter(Boolean),
            Y = `${WN}:${gP1}`;
        if (K.includes(gP1)) {
            let H = (await HP(["list-panes", "-t", Y, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean);
            return {
                windowTarget: Y,
                paneId: H[0] || ""
            }
        }
        let z = await HP(["new-window", "-t", WN, "-n", gP1, "-P", "-F", "#{pane_id}"]);
        if (z.code !== 0) throw Error(`Failed to create swarm-view window: ${z.stderr||"Unknown error"}`);
        return {
            windowTarget: Y,
            paneId: z.stdout.trim()
        }
    }
    async createTeammatePaneWithLeader(A, q) {
        let K = await this.getCurrentPaneId(),
            Y = await this.getCurrentWindowTarget();
        if (!K || !Y) throw Error("Could not determine current tmux pane/window");
        let z = await this.getCurrentWindowPaneCount(Y);
        if (z === null) throw Error("Could not determine pane count for current window");
        let w = z === 1,
            H;
        if (w) H = await IA(iW, ["split-window", "-t", K, "-h", "-l", "70%", "-P", "-F", "#{pane_id}"]);
        else {
            let J = (await IA(iW, ["list-panes", "-t", Y, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean).slice(1),
                X = J.length,
                D = X % 2 === 1,
                j = Math.floor((X - 1) / 2),
                M = J[j] || J[J.length - 1];
            H = await IA(iW, ["split-window", "-t", M, D ? "-v" : "-h", "-P", "-F", "#{pane_id}"])
        }
        if (H.code !== 0) throw Error(`Failed to create teammate pane: ${H.stderr}`);
        let $ = H.stdout.trim();
        return h(`[TmuxBackend] Created teammate pane for ${A}: ${$}`), await this.setPaneBorderColor($, q), await this.setPaneTitle($, A, q), await this.rebalancePanesWithLeader(Y), await Ju4(), {
            paneId: $,
            isFirstTeammate: w
        }
    }
    async createTeammatePaneExternal(A, q) {
        let {
            windowTarget: K,
            paneId: Y
        } = await this.createExternalSwarmSession(), z = await this.getCurrentWindowPaneCount(K, !0);
        if (z === null) throw Error("Could not determine pane count for swarm window");
        let w = !GEA && z === 1,
            H;
        if (w) H = Y, GEA = !0, h(`[TmuxBackend] Using initial pane for first teammate ${A}: ${H}`), await this.enablePaneBorderStatus(K, !0);
        else {
            let O = (await HP(["list-panes", "-t", K, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean),
                _ = O.length,
                J = _ % 2 === 1,
                X = Math.floor((_ - 1) / 2),
                D = O[X] || O[O.length - 1],
                j = await HP(["split-window", "-t", D, J ? "-v" : "-h", "-P", "-F", "#{pane_id}"]);
            if (j.code !== 0) throw Error(`Failed to create teammate pane: ${j.stderr}`);
            H = j.stdout.trim(), h(`[TmuxBackend] Created teammate pane for ${A}: ${H}`)
        }
        return await this.setPaneBorderColor(H, q, !0), await this.setPaneTitle(H, A, q, !0), await this.rebalancePanesTiled(K), await Ju4(), {
            paneId: H,
            isFirstTeammate: w
        }
    }
    async rebalancePanesWithLeader(A) {
        let K = (await _I(["list-panes", "-t", A, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean);
        if (K.length <= 2) return;
        await _I(["select-layout", "-t", A, "main-vertical"]);
        let Y = K[0];
        await _I(["resize-pane", "-t", Y, "-x", "30%"]), h(`[TmuxBackend] Rebalanced ${K.length-1} teammate panes with leader`)
    }
    async rebalancePanesTiled(A) {
        let K = (await HP(["list-panes", "-t", A, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean);
        if (K.length <= 1) return;
        await HP(["select-layout", "-t", A, "tiled"]), h(`[TmuxBackend] Rebalanced ${K.length} teammate panes with tiled layout`)
    }
}
// @from(Ln 328061, Col 0)
function kVY() {
    GEA = !1, ZEA = Promise.resolve()
}
// @from(Ln 328064, Col 4)
GEA = !1
// @from(Ln 328065, Col 4)
tM6 = null
// @from(Ln 328066, Col 4)
ZEA
// @from(Ln 328066, Col 9)
vVY = 200
// @from(Ln 328067, Col 4)
ju4 = v(() => {
    tq();
    Z6();
    y6();
    JI();
    Lm();
    ZEA = Promise.resolve();
    VEA(fEA)
})
// @from(Ln 328076, Col 4)
Mu4 = {}
// @from(Ln 328083, Col 0)
function LVY() {
    let A, q = new Promise((Y) => {
            A = Y
        }),
        K = vEA;
    return vEA = q, K.then(() => A)
}
// @from(Ln 328090, Col 0)
async function NEA(A) {
    return IA(aM6, A)
}
// @from(Ln 328094, Col 0)
function RVY(A) {
    let q = A.match(/Created new pane:\s*(.+)/);
    if (q && q[1]) return q[1].trim();
    return ""
}
// @from(Ln 328100, Col 0)
function yVY() {
    let A = process.env.ITERM_SESSION_ID;
    if (!A) return null;
    let q = A.indexOf(":");
    if (q === -1) return null;
    return A.slice(q + 1)
}
// @from(Ln 328107, Col 0)
class EEA {
    type = "iterm2";
    displayName = "iTerm2";
    supportsHideShow = !1;
    async isAvailable() {
        let A = j51();
        if (h(`[ITermBackend] isAvailable check: inITerm2=${A}`), !A) return h("[ITermBackend] isAvailable: false (not in iTerm2)"), !1;
        let q = await xQ1();
        return h(`[ITermBackend] isAvailable: ${q} (it2 CLI ${q?"found":"not found"})`), q
    }
    async isRunningInside() {
        let A = j51();
        return h(`[ITermBackend] isRunningInside: ${A}`), A
    }
    async createTeammatePaneInSwarmView(A, q) {
        h(`[ITermBackend] createTeammatePaneInSwarmView called for ${A} with color ${q}`);
        let K = await LVY();
        try {
            let Y = !TEA;
            h(`[ITermBackend] Creating pane: isFirstTeammate=${Y}, existingPanes=${YW1.length}`);
            let z;
            if (Y) {
                let $ = yVY();
                if ($) z = ["session", "split", "-v", "-s", $], h(`[ITermBackend] First split from leader session: ${$}`);
                else z = ["session", "split", "-v"], h("[ITermBackend] First split from active session (no leader ID)")
            } else {
                let $ = YW1[YW1.length - 1];
                if ($) z = ["session", "split", "-s", $], h(`[ITermBackend] Subsequent split from teammate session: ${$}`);
                else z = ["session", "split"], h("[ITermBackend] Subsequent split from active session (no teammate ID)")
            }
            let w = await NEA(z);
            if (w.code !== 0) throw Error(`Failed to create iTerm2 split pane: ${w.stderr}`);
            if (Y) TEA = !0;
            let H = RVY(w.stdout);
            if (!H) throw Error(`Failed to parse session ID from split output: ${w.stdout}`);
            return h(`[ITermBackend] Created teammate pane for ${A}: ${H}`), YW1.push(H), {
                paneId: H,
                isFirstTeammate: Y
            }
        } finally {
            K()
        }
    }
    async sendCommandToPane(A, q, K) {
        let z = await NEA(A ? ["session", "run", "-s", A, q] : ["session", "run", q]);
        if (z.code !== 0) throw Error(`Failed to send command to iTerm2 pane ${A}: ${z.stderr}`)
    }
    async setPaneBorderColor(A, q, K) {}
    async setPaneTitle(A, q, K, Y) {}
    async enablePaneBorderStatus(A, q) {}
    async rebalancePanes(A, q) {
        h("[ITermBackend] Pane rebalancing not implemented for iTerm2")
    }
    async killPane(A, q) {
        return (await NEA(["session", "close", "-s", A])).code === 0
    }
    async hidePane(A, q) {
        return h("[ITermBackend] hidePane not supported in iTerm2"), !1
    }
    async showPane(A, q, K) {
        return h("[ITermBackend] showPane not supported in iTerm2"), !1
    }
}
// @from(Ln 328171, Col 0)
function CVY() {
    YW1.length = 0, TEA = !1, vEA = Promise.resolve()
}
// @from(Ln 328175, Col 0)
function SVY() {
    return YW1
}
// @from(Ln 328178, Col 4)
YW1
// @from(Ln 328178, Col 9)
TEA = !1
// @from(Ln 328179, Col 4)
vEA
// @from(Ln 328180, Col 4)
Pu4 = v(() => {
    tq();
    Z6();
    Lm();
    JI();
    YW1 = [], vEA = Promise.resolve();
    kEA(EEA)
})
// @from(Ln 328188, Col 4)
Zu4 = {}
// @from(Ln 328200, Col 0)
async function hVY() {
    if (LEA) return;
    await Promise.resolve().then(() => (ju4(), Du4)), await Promise.resolve().then(() => (Pu4(), Mu4)), LEA = !0
}
// @from(Ln 328205, Col 0)
function VEA(A) {
    REA = A
}
// @from(Ln 328209, Col 0)
function kEA(A) {
    h(`[registry] registerITermBackend called, class=${A?.name||"undefined"}`), yEA = A
}
// @from(Ln 328213, Col 0)
function qP6() {
    if (!REA) throw Error("TmuxBackend not registered. Import TmuxBackend.ts before using the registry.");
    return new REA
}
// @from(Ln 328218, Col 0)
function Wu4() {
    if (!yEA) throw Error("ITermBackend not registered. Import ITermBackend.ts before using the registry.");
    return new yEA
}
// @from(Ln 328222, Col 0)
async function zt() {
    if (await hVY(), nR) return h(`[BackendRegistry] Using cached backend: ${nR.backend.type}`), nR;
    h("[BackendRegistry] Starting backend detection...");
    let A = await OI(),
        q = j51();
    if (h(`[BackendRegistry] Environment: insideTmux=${A}, inITerm2=${q}`), A) {
        h("[BackendRegistry] Selected: tmux (running inside tmux session)");
        let Y = qP6();
        return zW1 = Y, nR = {
            backend: Y,
            isNative: !0,
            needsIt2Setup: !1
        }, nR
    }
    if (q) {
        if (_u4()) h("[BackendRegistry] User prefers tmux over iTerm2, skipping iTerm2 detection");
        else {
            let w = await xQ1();
            if (h(`[BackendRegistry] iTerm2 detected, it2 CLI available: ${w}`), w) {
                h("[BackendRegistry] Selected: iterm2 (native iTerm2 with it2 CLI)");
                let H = Wu4();
                return zW1 = H, nR = {
                    backend: H,
                    isNative: !0,
                    needsIt2Setup: !1
                }, nR
            }
        }
        let z = await Kt();
        if (h(`[BackendRegistry] it2 not available, tmux available: ${z}`), z) {
            h("[BackendRegistry] Selected: tmux (fallback in iTerm2, it2 setup recommended)");
            let w = qP6();
            return zW1 = w, nR = {
                backend: w,
                isNative: !1,
                needsIt2Setup: !0
            }, nR
        }
        throw h("[BackendRegistry] ERROR: iTerm2 detected but no it2 CLI and no tmux"), Error("iTerm2 detected but it2 CLI not installed. Install it2 with: pip install it2")
    }
    let K = await Kt();
    if (h(`[BackendRegistry] Not in tmux or iTerm2, tmux available: ${K}`), K) {
        h("[BackendRegistry] Selected: tmux (external session mode)");
        let Y = qP6();
        return zW1 = Y, nR = {
            backend: Y,
            isNative: !1,
            needsIt2Setup: !1
        }, nR
    }
    throw h("[BackendRegistry] ERROR: No pane backend available"), Error(IVY())
}
// @from(Ln 328275, Col 0)
function IVY() {
    switch (eA()) {
        case "macos":
            return `To use agent swarms, install tmux:
  brew install tmux
Then start a tmux session with: tmux new-session -s claude`;
        case "linux":
        case "wsl":
            return `To use agent swarms, install tmux:
  sudo apt install tmux    # Ubuntu/Debian
  sudo dnf install tmux    # Fedora/RHEL
Then start a tmux session with: tmux new-session -s claude`;
        case "windows":
            return `To use agent swarms, you need tmux which requires WSL (Windows Subsystem for Linux).
Install WSL first, then inside WSL run:
  sudo apt install tmux
Then start a tmux session with: tmux new-session -s claude`;
        default:
            return `To use agent swarms, install tmux using your system's package manager.
Then start a tmux session with: tmux new-session -s claude`
    }
}
// @from(Ln 328298, Col 0)
function CEA(A) {
    switch (A) {
        case "tmux":
            return qP6();
        case "iterm2":
            return Wu4()
    }
}
// @from(Ln 328307, Col 0)
function wW1() {
    return zW1
}
// @from(Ln 328311, Col 0)
function xVY() {
    return bQ1()
}
// @from(Ln 328315, Col 0)
function Rm() {
    if (w4()) return h("[BackendRegistry] isInProcessEnabled: true (non-interactive session)"), !0;
    let A = xVY(),
        q;
    if (A === "in-process") q = !0;
    else if (A === "tmux") q = !1;
    else q = !rM6();
    return h(`[BackendRegistry] isInProcessEnabled: ${q} (mode=${A}, insideTmux=${rM6()})`), q
}
// @from(Ln 328325, Col 0)
function Gu4() {
    if (!eM6) eM6 = rb4();
    return eM6
}
// @from(Ln 328329, Col 0)
async function bVY(A = !1) {
    if (A && Rm()) return h("[BackendRegistry] Using in-process executor"), Gu4();
    return h("[BackendRegistry] Using pane backend executor"), uVY()
}
// @from(Ln 328333, Col 0)
async function uVY() {
    if (!AP6) {
        let A = await zt();
        AP6 = Yu4(A.backend), h(`[BackendRegistry] Created PaneBackendExecutor wrapping ${A.backend.type}`)
    }
    return AP6
}
// @from(Ln 328341, Col 0)
function BVY() {
    zW1 = null, nR = null, eM6 = null, AP6 = null, LEA = !1
}
// @from(Ln 328344, Col 4)
zW1 = null
// @from(Ln 328345, Col 4)
nR = null
// @from(Ln 328346, Col 4)
LEA = !1
// @from(Ln 328347, Col 4)
eM6 = null
// @from(Ln 328348, Col 4)
AP6 = null
// @from(Ln 328349, Col 4)
REA = null
// @from(Ln 328350, Col 4)
yEA = null
// @from(Ln 328351, Col 4)
JI = v(() => {
    ob4();
    zu4();
    Lm();
    Z6();
    WEA();
    x3();
    KW1();
    B6()
})
// @from(Ln 328361, Col 0)
async function xEA() {
    if (!SEA) SEA = await zt();
    return SEA.backend
}
// @from(Ln 328366, Col 0)
function bd(A) {
    let q = hEA.get(A);
    if (q) return q;
    let K = cO[IEA % cO.length];
    return hEA.set(A, K), IEA++, K
}
// @from(Ln 328373, Col 0)
function fu4() {
    hEA.clear(), IEA = 0
}
// @from(Ln 328376, Col 0)
async function Vu4() {
    let {
        isInsideTmux: A
    } = await Promise.resolve().then(() => (Lm(), sb4));
    return A()
}
// @from(Ln 328382, Col 0)
async function Nu4(A, q) {
    return (await xEA()).createTeammatePaneInSwarmView(A, q)
}
// @from(Ln 328385, Col 0)
async function Tu4(A, q = !1) {
    return (await xEA()).enablePaneBorderStatus(A, q)
}
// @from(Ln 328388, Col 0)
async function vu4(A, q, K = !1) {
    return (await xEA()).sendCommandToPane(A, q, K)
}
// @from(Ln 328391, Col 4)
hEA
// @from(Ln 328391, Col 9)
IEA = 0
// @from(Ln 328392, Col 4)
SEA = null
// @from(Ln 328393, Col 4)
uQ1 = v(() => {
    lM();
    JI();
    hEA = new Map
})
// @from(Ln 328399, Col 0)
function Eu4(A) {
    let q = e(49),
        {
            onDone: K,
            tmuxAvailable: Y
        } = A,
        [z, w] = HW1.useState("initial"),
        [H, $] = HW1.useState(null),
        [O, _] = HW1.useState(null),
        J = uq(),
        X, D;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) X = () => {
        wu4().then((O1) => {
            $(O1)
        })
    }, D = [], q[0] = X, q[1] = D;
    else X = q[0], D = q[1];
    HW1.useEffect(X, D);
    let j;
    if (q[2] !== K) j = () => {
        K("cancelled")
    }, q[2] = K, q[3] = j;
    else j = q[3];
    let M = j,
        P = z !== "installing" && z !== "verifying",
        W;
    if (q[4] !== P) W = {
        context: "Confirmation",
        isActive: P
    }, q[4] = P, q[5] = W;
    else W = q[5];
    DA("confirm:no", M, W);
    let G;
    if (q[6] !== K || q[7] !== z) G = (O1, T1) => {
        if (z === "api-instructions" && T1.return) w("verifying"), MEA().then((N1) => {
            if (N1.success) PEA(), w("success"), setTimeout(() => K("installed"), 1500);
            else _(N1.error || "Verification failed"), w("failed")
        })
    }, q[6] = K, q[7] = z, q[8] = G;
    else G = q[8];
    D8(G);
    let f;
    if (q[9] !== H) f = async function() {
        if (!H) {
            _("No Python package manager found (uvx, pipx, or pip)"), w("failed");
            return
        }
        w("installing");
        let T1 = await Hu4(H);
        if (T1.success) w("api-instructions");
        else _(T1.error || "Installation failed"), w("install-failed")
    }, q[9] = H, q[10] = f;
    else f = q[10];
    let Z = f,
        N;
    if (q[11] !== K) N = function() {
        Ou4(!0), K("use-tmux")
    }, q[11] = K, q[12] = N;
    else N = q[12];
    let T = N,
        k, y, B, S, m, b, g, U, x, p;
    if (q[13] !== O || q[14] !== Z || q[15] !== T || q[16] !== K || q[17] !== H || q[18] !== z || q[19] !== Y) {
        let T1 = function() {
                let Z1 = [{
                    label: "Install it2 now",
                    value: "install",
                    description: H ? `Uses ${H} to install the it2 CLI tool` : "Requires Python (uvx, pipx, or pip)"
                }];
                if (Y) Z1.push({
                    label: "Use tmux instead",
                    value: "tmux",
                    description: "Opens teammates in a separate tmux session"
                });
                return Z1.push({
                    label: "Cancel",
                    value: "cancel",
                    description: "Skip teammate spawning for now"
                }), H3.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1
                }, H3.default.createElement(V, null, "To use native iTerm2 split panes for teammates, you need the", " ", H3.default.createElement(V, {
                    bold: !0
                }, "it2"), " CLI tool."), H3.default.createElement(V, {
                    dimColor: !0
                }, "This enables teammates to appear as split panes within your current window."), H3.default.createElement(I, {
                    marginTop: 1
                }, H3.default.createElement(kA, {
                    options: Z1,
                    onChange: (E1) => {
                        A: switch (E1) {
                            case "install": {
                                Z();
                                break A
                            }
                            case "tmux": {
                                T();
                                break A
                            }
                            case "cancel":
                                K("cancelled")
                        }
                    },
                    onCancel: () => K("cancelled")
                })))
            },
            N1 = function() {
                return H3.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1
                }, H3.default.createElement(I, null, H3.default.createElement(c4, null), H3.default.createElement(V, null, " Installing it2 using ", H, "…")), H3.default.createElement(V, {
                    dimColor: !0
                }, "This may take a moment."))
            },
            j1 = function() {
                let Z1 = [{
                    label: "Try again",
                    value: "retry",
                    description: "Retry the installation"
                }];
                if (Y) Z1.push({
                    label: "Use tmux instead",
                    value: "tmux",
                    description: "Falls back to tmux for teammate panes"
                });
                return Z1.push({
                    label: "Cancel",
                    value: "cancel",
                    description: "Skip teammate spawning for now"
                }), H3.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1
                }, H3.default.createElement(V, {
                    color: "error"
                }, "Installation failed"), O && H3.default.createElement(V, {
                    dimColor: !0
                }, O), H3.default.createElement(V, {
                    dimColor: !0
                }, "You can try installing manually:", " ", H === "uvx" ? "uv tool install it2" : H === "pipx" ? "pipx install it2" : "pip install --user it2"), H3.default.createElement(I, {
                    marginTop: 1
                }, H3.default.createElement(kA, {
                    options: Z1,
                    onChange: (E1) => {
                        A: switch (E1) {
                            case "retry": {
                                Z();
                                break A
                            }
                            case "tmux": {
                                T();
                                break A
                            }
                            case "cancel":
                                K("cancelled")
                        }
                    },
                    onCancel: () => K("cancelled")
                })))
            },
            q1 = function() {
                let Z1 = $u4();
                return H3.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1
                }, H3.default.createElement(V, {
                    color: "success"
                }, "✓ it2 installed successfully"), H3.default.createElement(I, {
                    flexDirection: "column",
                    marginTop: 1
                }, Z1.map(mVY)), H3.default.createElement(I, {
                    marginTop: 1
                }, H3.default.createElement(V, {
                    dimColor: !0
                }, "Press Enter when ready to verify…")))
            },
            t = function() {
                return H3.default.createElement(I, null, H3.default.createElement(c4, null), H3.default.createElement(V, null, " Verifying it2 can communicate with iTerm2…"))
            },
            J1 = function() {
                return H3.default.createElement(I, {
                    flexDirection: "column"
                }, H3.default.createElement(V, {
                    color: "success"
                }, "✓ iTerm2 split pane support is ready"), H3.default.createElement(V, {
                    dimColor: !0
                }, "Teammates will now appear as split panes."))
            },
            D1 = function() {
                let Z1 = [{
                    label: "Try again",
                    value: "retry",
                    description: "Verify the connection again"
                }];
                if (Y) Z1.push({
                    label: "Use tmux instead",
                    value: "tmux",
                    description: "Falls back to tmux for teammate panes"
                });
                return Z1.push({
                    label: "Cancel",
                    value: "cancel",
                    description: "Skip teammate spawning for now"
                }), H3.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1
                }, H3.default.createElement(V, {
                    color: "error"
                }, "Verification failed"), O && H3.default.createElement(V, {
                    dimColor: !0
                }, O), H3.default.createElement(V, null, "Make sure:"), H3.default.createElement(I, {
                    flexDirection: "column",
                    paddingLeft: 2
                }, H3.default.createElement(V, null, "• Python API is enabled in iTerm2 preferences"), H3.default.createElement(V, null, "• You may need to restart iTerm2 after enabling")), H3.default.createElement(I, {
                    marginTop: 1
                }, H3.default.createElement(kA, {
                    options: Z1,
                    onChange: (E1) => {
                        A: switch (E1) {
                            case "retry": {
                                w("verifying"), MEA().then((a) => {
                                    if (a.success) PEA(), w("success"), setTimeout(() => K("installed"), 1500);
                                    else _(a.error || "Verification failed"), w("failed")
                                });
                                break A
                            }
                            case "tmux": {
                                T();
                                break A
                            }
                            case "cancel":
                                K("cancelled")
                        }
                    },
                    onCancel: () => K("cancelled")
                })))
            },
            O1 = () => {
                switch (z) {
                    case "initial":
                        return T1();
                    case "installing":
                        return N1();
                    case "install-failed":
                        return j1();
                    case "api-instructions":
                        return q1();
                    case "verifying":
                        return t();
                    case "success":
                        return J1();
                    case "failed":
                        return D1();
                    default:
                        return null
                }
            };
        if (y = I, U = "column", q[30] === Symbol.for("react.memo_cache_sentinel")) x = H3.default.createElement(CY, {
            dividerColor: "permission"
        }), q[30] = x;
        else x = q[30];
        if (k = I, p = 1, B = "column", S = 1, m = 1, q[31] === Symbol.for("react.memo_cache_sentinel")) b = H3.default.createElement(V, {
            bold: !0,
            color: "permission"
        }, "iTerm2 Split Pane Setup"), q[31] = b;
        else b = q[31];
        g = O1(), q[13] = O, q[14] = Z, q[15] = T, q[16] = K, q[17] = H, q[18] = z, q[19] = Y, q[20] = k, q[21] = y, q[22] = B, q[23] = S, q[24] = m, q[25] = b, q[26] = g, q[27] = U, q[28] = x, q[29] = p
    } else k = q[20], y = q[21], B = q[22], S = q[23], m = q[24], b = q[25], g = q[26], U = q[27], x = q[28], p = q[29];
    let l;
    if (q[32] !== J || q[33] !== z) l = z !== "installing" && z !== "verifying" && z !== "success" && H3.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, J.pending ? H3.default.createElement(H3.default.Fragment, null, "Press ", J.keyName, " again to exit") : H3.default.createElement(H3.default.Fragment, null, "Esc to cancel")), q[32] = J, q[33] = z, q[34] = l;
    else l = q[34];
    let r;
    if (q[35] !== k || q[36] !== B || q[37] !== S || q[38] !== m || q[39] !== b || q[40] !== g || q[41] !== l || q[42] !== p) r = H3.default.createElement(k, {
        marginX: p,
        flexDirection: B,
        gap: S,
        paddingBottom: m
    }, b, g, l), q[35] = k, q[36] = B, q[37] = S, q[38] = m, q[39] = b, q[40] = g, q[41] = l, q[42] = p, q[43] = r;
    else r = q[43];
    let s;
    if (q[44] !== y || q[45] !== U || q[46] !== x || q[47] !== r) s = H3.default.createElement(y, {
        flexDirection: U
    }, x, r), q[44] = y, q[45] = U, q[46] = x, q[47] = r, q[48] = s;
    else s = q[48];
    return s
}
// @from(Ln 328687, Col 0)
function mVY(A, q) {
    return H3.default.createElement(V, {
        key: q
    }, A)
}
// @from(Ln 328692, Col 4)
H3
// @from(Ln 328692, Col 8)
HW1
// @from(Ln 328693, Col 4)
ku4 = v(() => {
    i1();
    m1();
    R2();
    K7();
    wY();
    x2();
    kW();
    WEA();
    H3 = o(X1(), 1), HW1 = o(X1(), 1)
})
// @from(Ln 328712, Col 0)
async function UVY(A) {
    return (await IA(iW, ["has-session", "-t", A])).code === 0
}
// @from(Ln 328715, Col 0)
async function pVY(A) {
    if (!await UVY(A)) {
        let K = await IA(iW, ["new-session", "-d", "-s", A]);
        if (K.code !== 0) throw Error(`Failed to create tmux session '${A}': ${K.stderr||"Unknown error"}`)
    }
}
// @from(Ln 328722, Col 0)
function Ru4(A) {
    return A.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
}
// @from(Ln 328726, Col 0)
function BEA(A) {
    return A.replace(/@/g, "-")
}
// @from(Ln 328730, Col 0)
function yu4() {
    if (process.env[pP1]) return process.env[pP1];
    return D9() ? process.execPath : process.argv[1]
}
// @from(Ln 328735, Col 0)
function Cu4(A) {
    let q = [],
        {
            planModeRequired: K,
            permissionMode: Y
        } = A || {};
    if (K);
    else if (Y === "bypassPermissions" || HQ()) q.push("--dangerously-skip-permissions");
    else if (Y === "acceptEdits") q.push("--permission-mode acceptEdits");
    let z = HT();
    if (z) q.push(`--model ${R7([z])}`);
    let w = Il();
    if (w) q.push(`--settings ${R7([w])}`);
    let H = $61();
    for (let $ of H) q.push(`--plugin-dir ${R7([$])}`);
    return q.join(" ")
}
// @from(Ln 328753, Col 0)
function Su4(A) {
    return bEA(QP(), Ru4(A))
}
// @from(Ln 328757, Col 0)
function M51(A) {
    let q = bEA(Su4(A), "config.json");
    if (!FVY(q)) return null;
    try {
        let K = gVY(q, "utf-8");
        return _A(K)
    } catch (K) {
        return h(`[spawnTeammate] Failed to read team file for ${A}: ${K instanceof Error?K.message:String(K)}`), null
    }
}
// @from(Ln 328768, Col 0)
function mEA(A, q) {
    let K = Su4(A);
    QVY(K, {
        recursive: !0
    });
    let Y = bEA(K, "config.json");
    c8(Y, Q1(q, null, 2))
}
// @from(Ln 328777, Col 0)
function FEA(A, q) {
    if (!q) return A;
    let K = M51(q);
    if (!K) return A;
    let Y = new Set(K.members.map((w) => w.name.toLowerCase()));
    if (!Y.has(A.toLowerCase())) return A;
    let z = 2;
    while (Y.has(`${A}-${z}`.toLowerCase())) z++;
    return `${A}-${z}`
}
// @from(Ln 328787, Col 0)
async function dVY(A, q) {
    let {
        setAppState: K,
        getAppState: Y
    } = q, {
        name: z,
        prompt: w,
        agent_type: H,
        cwd: $,
        plan_mode_required: O
    } = A, _ = A.model ?? uEA;
    if (!z || !w) throw Error("name and prompt are required for spawn operation");
    let J = await Y(),
        X = A.team_name || J.teamContext?.teamName;
    if (!X) throw Error("team_name is required for spawn operation. Either provide team_name in input or call spawnTeam first to establish team context.");
    let D = FEA(z, X),
        j = BEA(D),
        M = pv(j, X),
        P = $ || h6(),
        W = await zt();
    if (W.needsIt2Setup && q.setToolJSX) {
        let U = await Kt(),
            x = await new Promise((p) => {
                q.setToolJSX({
                    jsx: Lu4.default.createElement(Eu4, {
                        onDone: p,
                        tmuxAvailable: U
                    }),
                    shouldHidePromptInput: !0
                })
            });
        if (q.setToolJSX(null), x === "cancelled") throw Error("Teammate spawn cancelled - iTerm2 setup required");
        if (x === "installed") {
            let {
                resetBackendDetection: p
            } = await Promise.resolve().then(() => (JI(), Zu4));
            p()
        }
    }
    let G = await Vu4(),
        f = bd(M),
        {
            paneId: Z,
            isFirstTeammate: N
        } = await Nu4(j, f);
    if (N && G) await Tu4();
    let T = yu4(),
        k = [`--agent-id ${R7([M])}`, `--agent-name ${R7([j])}`, `--team-name ${R7([X])}`, `--agent-color ${R7([f])}`, `--parent-session-id ${R7([U6()])}`, O ? "--plan-mode-required" : "", H ? `--agent-type ${R7([H])}` : ""].filter(Boolean).join(" "),
        y = Cu4({
            planModeRequired: O,
            permissionMode: J.toolPermissionContext.mode
        });
    if (_) y = y.split(" ").filter((U, x, p) => U !== "--model" && p[x - 1] !== "--model").join(" "), y = y ? `${y} --model ${R7([_])}` : `--model ${R7([_])}`;
    let B = y ? ` ${y}` : "",
        S = `cd ${R7([P])} && CLAUDECODE=1 CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 ${R7([T])} ${k}${B}`;
    await vu4(Z, S, !G);
    let m = G ? "current" : WN,
        b = G ? "current" : "swarm-view";
    K((U) => ({
        ...U,
        teamContext: {
            ...U.teamContext,
            teamName: X ?? U.teamContext?.teamName ?? "default",
            teamFilePath: U.teamContext?.teamFilePath ?? "",
            leadAgentId: U.teamContext?.leadAgentId ?? "",
            teammates: {
                ...U.teamContext?.teammates || {},
                [M]: {
                    name: j,
                    agentType: H,
                    color: f,
                    tmuxSessionName: m,
                    tmuxPaneId: Z,
                    cwd: P,
                    spawnedAt: Date.now()
                }
            }
        }
    })), hu4(K, {
        teammateId: M,
        sanitizedName: j,
        teamName: X,
        teammateColor: f,
        prompt: w,
        plan_mode_required: O,
        paneId: Z,
        insideTmux: G
    });
    let g = M51(X);
    if (!g) throw Error(`Team "${X}" does not exist. Call spawnTeam first to create the team.`);
    return g.members.push({
        agentId: M,
        name: j,
        agentType: H,
        model: _,
        prompt: w,
        color: f,
        planModeRequired: O,
        joinedAt: Date.now(),
        tmuxPaneId: Z,
        cwd: P,
        subscriptions: [],
        backendType: W.backend.type
    }), mEA(X, g), f9(j, {
        from: K2,
        text: w,
        timestamp: new Date().toISOString()
    }, X), {
        data: {
            teammate_id: M,
            agent_id: M,
            agent_type: H,
            model: _,
            name: j,
            color: f,
            tmux_session_name: m,
            tmux_window_name: b,
            tmux_pane_id: Z,
            team_name: X,
            is_splitpane: !0,
            plan_mode_required: O
        }
    }
}
// @from(Ln 328911, Col 0)
async function cVY(A, q) {
    let {
        setAppState: K,
        getAppState: Y
    } = q, {
        name: z,
        prompt: w,
        agent_type: H,
        cwd: $,
        plan_mode_required: O
    } = A, _ = A.model ?? uEA;
    if (!z || !w) throw Error("name and prompt are required for spawn operation");
    let J = await Y(),
        X = A.team_name || J.teamContext?.teamName;
    if (!X) throw Error("team_name is required for spawn operation. Either provide team_name in input or call spawnTeam first to establish team context.");
    let D = FEA(z, X),
        j = BEA(D),
        M = pv(j, X),
        P = `teammate-${Ru4(j)}`,
        W = $ || h6();
    await pVY(WN);
    let G = bd(M),
        f = await IA(iW, ["new-window", "-t", WN, "-n", P, "-P", "-F", "#{pane_id}"]);
    if (f.code !== 0) throw Error(`Failed to create tmux window: ${f.stderr}`);
    let Z = f.stdout.trim(),
        N = yu4(),
        T = [`--agent-id ${R7([M])}`, `--agent-name ${R7([j])}`, `--team-name ${R7([X])}`, `--agent-color ${R7([G])}`, `--parent-session-id ${R7([U6()])}`, O ? "--plan-mode-required" : "", H ? `--agent-type ${R7([H])}` : ""].filter(Boolean).join(" "),
        k = Cu4({
            planModeRequired: O,
            permissionMode: J.toolPermissionContext.mode
        });
    if (_) k = k.split(" ").filter((b, g, U) => b !== "--model" && U[g - 1] !== "--model").join(" "), k = k ? `${k} --model ${R7([_])}` : `--model ${R7([_])}`;
    let y = k ? ` ${k}` : "",
        B = `cd ${R7([W])} && CLAUDECODE=1 CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 ${R7([N])} ${T}${y}`,
        S = await IA(iW, ["send-keys", "-t", `${WN}:${P}`, B, "Enter"]);
    if (S.code !== 0) throw Error(`Failed to send command to tmux window: ${S.stderr}`);
    K((b) => ({
        ...b,
        teamContext: {
            ...b.teamContext,
            teamName: X ?? b.teamContext?.teamName ?? "default",
            teamFilePath: b.teamContext?.teamFilePath ?? "",
            leadAgentId: b.teamContext?.leadAgentId ?? "",
            teammates: {
                ...b.teamContext?.teammates || {},
                [M]: {
                    name: j,
                    agentType: H,
                    color: G,
                    tmuxSessionName: WN,
                    tmuxPaneId: Z,
                    cwd: W,
                    spawnedAt: Date.now()
                }
            }
        }
    })), hu4(K, {
        teammateId: M,
        sanitizedName: j,
        teamName: X,
        teammateColor: G,
        prompt: w,
        plan_mode_required: O,
        paneId: Z,
        insideTmux: !1
    });
    let m = M51(X);
    if (!m) throw Error(`Team "${X}" does not exist. Call spawnTeam first to create the team.`);
    return m.members.push({
        agentId: M,
        name: j,
        agentType: H,
        model: _,
        prompt: w,
        color: G,
        planModeRequired: O,
        joinedAt: Date.now(),
        tmuxPaneId: Z,
        cwd: W,
        subscriptions: [],
        backendType: "tmux"
    }), mEA(X, m), f9(j, {
        from: K2,
        text: w,
        timestamp: new Date().toISOString()
    }, X), {
        data: {
            teammate_id: M,
            agent_id: M,
            agent_type: H,
            model: _,
            name: j,
            color: G,
            tmux_session_name: WN,
            tmux_window_name: P,
            tmux_pane_id: Z,
            team_name: X,
            is_splitpane: !1,
            plan_mode_required: O
        }
    }
}
// @from(Ln 329014, Col 0)
function hu4(A, {
    teammateId: q,
    sanitizedName: K,
    teamName: Y,
    teammateColor: z,
    prompt: w,
    plan_mode_required: H,
    paneId: $,
    insideTmux: O
}) {
    let _ = hp("in_process_teammate"),
        J = `${K}: ${w.substring(0,50)}${w.length>50?"...":""}`,
        X = new AbortController,
        D = {
            ...IZ(_, "in_process_teammate", J),
            type: "in_process_teammate",
            status: "running",
            identity: {
                agentId: q,
                agentName: K,
                teamName: Y,
                color: z,
                planModeRequired: H ?? !1,
                parentSessionId: U6()
            },
            prompt: w,
            abortController: X,
            awaitingPlanApproval: !1,
            permissionMode: H ? "plan" : "default",
            isIdle: !1,
            shutdownRequested: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            pendingUserMessages: []
        };
    bZ(D, A), X.signal.addEventListener("abort", () => {
        let M = !O ? ["-L", UP1(), "kill-pane", "-t", $] : ["kill-pane", "-t", $];
        IA(iW, M)
    })
}
// @from(Ln 329054, Col 0)
async function lVY(A, q) {
    let {
        setAppState: K,
        getAppState: Y
    } = q, {
        name: z,
        prompt: w,
        agent_type: H,
        plan_mode_required: $
    } = A, O = A.model ?? uEA;
    if (!z || !w) throw Error("name and prompt are required for spawn operation");
    let _ = await Y(),
        J = A.team_name || _.teamContext?.teamName;
    if (!J) throw Error("team_name is required for spawn operation. Either provide team_name in input or call spawnTeam first to establish team context.");
    let X = FEA(z, J),
        D = BEA(X),
        j = pv(D, J),
        M = bd(j),
        P;
    if (H) {
        let N = q.options.agentDefinitions.activeAgents.find((T) => T.agentType === H);
        if (N && GJ6(N)) P = N;
        h(`[handleSpawnInProcess] agent_type=${H}, found=${!!P}`)
    }
    let G = await LP1({
        name: D,
        teamName: J,
        prompt: w,
        color: M,
        planModeRequired: $ ?? !1,
        model: O
    }, q);
    if (!G.success) throw Error(G.error ?? "Failed to spawn in-process teammate");
    if (h(`[handleSpawnInProcess] spawn result: taskId=${G.taskId}, hasContext=${!!G.teammateContext}, hasAbort=${!!G.abortController}`), G.taskId && G.teammateContext && G.abortController) nM6({
        identity: {
            agentId: j,
            agentName: D,
            teamName: J,
            color: M,
            planModeRequired: $ ?? !1,
            parentSessionId: G.teammateContext.parentSessionId
        },
        taskId: G.taskId,
        prompt: w,
        description: A.description,
        agentDefinition: P,
        teammateContext: G.teammateContext,
        toolUseContext: q,
        abortController: G.abortController
    }), h(`[handleSpawnInProcess] Started agent execution for ${j}`);
    K((Z) => {
        let N = !Z.teamContext?.leadAgentId,
            T = N ? pv(K2, J) : Z.teamContext.leadAgentId,
            k = Z.teamContext?.teammates || {},
            y = N ? {
                [T]: {
                    name: K2,
                    agentType: K2,
                    color: bd(T),
                    tmuxSessionName: "in-process",
                    tmuxPaneId: "leader",
                    cwd: h6(),
                    spawnedAt: Date.now()
                }
            } : {};
        return {
            ...Z,
            teamContext: {
                ...Z.teamContext,
                teamName: J ?? Z.teamContext?.teamName ?? "default",
                teamFilePath: Z.teamContext?.teamFilePath ?? "",
                leadAgentId: T,
                teammates: {
                    ...k,
                    ...y,
                    [j]: {
                        name: D,
                        agentType: H,
                        color: M,
                        tmuxSessionName: "in-process",
                        tmuxPaneId: "in-process",
                        cwd: h6(),
                        spawnedAt: Date.now()
                    }
                }
            }
        }
    });
    let f = M51(J);
    if (!f) throw Error(`Team "${J}" does not exist. Call spawnTeam first to create the team.`);
    return f.members.push({
        agentId: j,
        name: D,
        agentType: H,
        model: O,
        prompt: w,
        color: M,
        planModeRequired: $,
        joinedAt: Date.now(),
        tmuxPaneId: "in-process",
        cwd: h6(),
        subscriptions: [],
        backendType: "in-process"
    }), mEA(J, f), {
        data: {
            teammate_id: j,
            agent_id: j,
            agent_type: H,
            model: O,
            name: D,
            color: M,
            tmux_session_name: "in-process",
            tmux_window_name: "in-process",
            tmux_pane_id: "in-process",
            team_name: J,
            is_splitpane: !1,
            plan_mode_required: $
        }
    }
}
// @from(Ln 329174, Col 0)
async function iVY(A, q) {
    if (Rm()) return lVY(A, q);
    if (A.use_splitpane !== !1) return dVY(A, q);
    return cVY(A, q)
}
// @from(Ln 329179, Col 0)
async function Iu4(A, q) {
    return iVY(A, q)
}
// @from(Ln 329182, Col 4)
Lu4
// @from(Ln 329182, Col 9)
uEA
// @from(Ln 329183, Col 4)
QEA = v(() => {
    hA();
    m6();
    uQ1();
    tq();
    M_();
    N7();
    H$();
    Z6();
    JI();
    yj6();
    JEA();
    Lm();
    ku4();
    B6();
    vO1();
    m6();
    uv();
    fK1();
    GR();
    Lu4 = o(X1(), 1), uEA = yn.firstParty
})
// @from(Ln 329206, Col 0)
function qNY(A) {
    let q = 0,
        K = iO(A);
    for (let Y of K)
        if (Y.type === "assistant") {
            for (let z of Y.message.content)
                if (z.type === "tool_use") q++
        } return q
}
// @from(Ln 329216, Col 0)
function UEA(A, q, K) {
    let {
        prompt: Y,
        resolvedAgentModel: z,
        isBuiltInAgent: w,
        startTime: H,
        agentType: $
    } = K, O = GN(A);
    if (O === void 0) throw Error("No assistant messages found");
    let _ = O.message.content.filter((D) => D.type === "text"),
        J = Ix1(O.message.usage),
        X = qNY(A);
    return c("tengu_agent_tool_completed", {
        agent_type: $,
        model: z,
        prompt_char_count: Y.length,
        response_char_count: _.length,
        assistant_message_count: A.length,
        total_tool_uses: X,
        duration_ms: Date.now() - H,
        total_tokens: J,
        is_built_in_agent: w
    }), {
        agentId: q,
        content: _,
        totalDurationMs: Date.now() - H,
        totalTokens: J,
        totalToolUseCount: X,
        usage: O.message.usage
    }
}
// @from(Ln 329248, Col 0)
function KNY(A, q) {
    if (!l8()) return;
    return A.team_name || q.teamContext?.teamName
}
// @from(Ln 329252, Col 4)
dEA
// @from(Ln 329252, Col 9)
nVY = 2000
// @from(Ln 329253, Col 4)
KP6
// @from(Ln 329253, Col 9)
rVY = "Optional model to use for this agent. If not specified, inherits from parent. Prefer haiku for quick, straightforward tasks to minimize cost and latency."
// @from(Ln 329254, Col 4)
oVY
// @from(Ln 329254, Col 9)
aVY
// @from(Ln 329254, Col 14)
xu4
// @from(Ln 329254, Col 19)
avA
// @from(Ln 329254, Col 24)
sVY
// @from(Ln 329254, Col 29)
tVY
// @from(Ln 329254, Col 34)
eVY
// @from(Ln 329254, Col 39)
ANY
// @from(Ln 329254, Col 44)
rj1