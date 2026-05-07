
// @from(Ln 399197, Col 0)
async function bXY(q) {
    let {
        identity: K,
        taskId: _,
        prompt: z,
        description: Y,
        agentDefinition: A,
        teammateContext: O,
        toolUseContext: w,
        abortController: $,
        model: j,
        systemPrompt: H,
        systemPromptMode: J,
        allowedTools: X,
        allowPermissionPrompts: M,
        invokingRequestId: P
    } = q, {
        setAppState: W,
        taskRegistry: D
    } = w;
    E(`[inProcessRunner] Starting agent loop for ${K.agentId}`);
    let Z = {
            agentId: K.agentId,
            parentSessionId: K.parentSessionId,
            agentName: K.agentName,
            teamName: K.teamName,
            agentColor: K.color,
            planModeRequired: K.planModeRequired,
            isTeamLead: !1,
            agentType: "teammate",
            invokingRequestId: P,
            invocationKind: "spawn",
            invocationEmitted: !1
        },
        G;
    if (J === "replace" && H) G = H;
    else {
        let h = [...await j0(w.options.tools, w.options.mainLoopModel), V97];
        if (A) {
            let C = A.getSystemPrompt();
            if (C) h.push(`
# Custom Agent Instructions
${C}`);
            if (A.memory) d("tengu_agent_memory_loaded", {
                ...!1,
                scope: A.memory,
                source: "in-process-teammate"
            })
        }
        if (J === "append" && H) h.push(H);
        G = h.join(`
`)
    }
    let f = {
            agentType: K.agentName,
            whenToUse: `In-process teammate: ${K.agentName}`,
            getSystemPrompt: () => G,
            tools: A?.tools ? F4([...A.tools, tW, lp, Cc, YT, Sc, xD, gk]) : ["*"],
            source: "projectSettings",
            permissionMode: "default",
            ...A?.model && {
                model: A.model
            }
        },
        v = [],
        V = k97("team-lead", z, void 0, Y),
        k = V,
        N = !1;
    await HNK(K.parentSessionId, K.agentName);
    try {
        sF(_, (x) => ({
            ...x,
            messages: QH6(x.messages, t8({
                content: V
            }))
        }), W);
        let R = w.contentReplacementState ? te6() : void 0;
        while (!$.signal.aborted && !N) {
            E(`[inProcessRunner] ${K.agentId} processing prompt: ${k.substring(0,50)}...`);
            let x = F5();
            sF(_, (q6) => ({
                ...q6,
                currentWorkAbortController: x
            }), W);
            let B = t8({
                    content: k
                }),
                m = [B],
                S = v,
                F = vJ(v);
            if (F > v38(w.options.mainLoopModel, w.getAppState().autoCompactWindow)) {
                E(`[inProcessRunner] ${K.agentId} compacting history (${F} tokens)`);
                let q6 = {
                    ...w,
                    readFileState: Cs(w.readFileState),
                    memorySelector: dK6(),
                    onCompactProgress: void 0,
                    setStreamMode: void 0
                };
                try {
                    let o = await vI6(v, q6, {
                        systemPrompt: sK([]),
                        userContext: {},
                        systemContext: {},
                        toolUseContext: q6,
                        forkContextMessages: []
                    }, !0, void 0, !0);
                    if (S = Yt(o), SR(), R) R = te6();
                    v.length = 0, v.push(...S), sF(_, (_6) => ({
                        ..._6,
                        messages: [...S, B]
                    }), W)
                } catch (o) {
                    if (o instanceof Error && o.message.startsWith(GI6)) E(`[inProcessRunner] ${K.agentId} compaction blocked by PreCompact hook; continuing uncompacted`);
                    else throw o
                }
            }
            let U = S.length > 0 ? [...S] : void 0;
            v.push(B);
            let g = lX6(),
                c = nX6(w.options.tools),
                n = [],
                z6 = w.getAppState().tasks[_],
                A6 = z6 && z6.type === "in_process_teammate" ? z6.permissionMode : "default",
                e = {
                    ...f,
                    permissionMode: A6
                },
                i = !1;
            if (await lZ8(O, async () => {
                    return eQ(Z, async () => {
                        sF(_, (q6) => ({
                            ...q6,
                            status: "running",
                            isIdle: !1
                        }), W);
                        for await (let q6 of _u({
                            agentDefinition: e,
                            promptMessages: m,
                            toolUseContext: w,
                            canUseTool: LXY(K, x, (o) => {
                                sF(_, (_6) => ({
                                    ..._6,
                                    totalPausedMs: (_6.totalPausedMs ?? 0) + o
                                }), W)
                            }),
                            isAsync: !0,
                            canShowPermissionPrompts: M ?? !0,
                            forkContextMessages: U,
                            querySource: "agent:custom",
                            override: {
                                abortController: x
                            },
                            model: j,
                            preserveToolUseResults: !0,
                            availableTools: w.options.tools,
                            allowedTools: X,
                            contentReplacementState: R,
                            isTeammate: !0
                        })) {
                            if ($.signal.aborted) {
                                E(`[inProcessRunner] ${K.agentId} lifecycle aborted`);
                                break
                            }
                            if (x.signal.aborted) {
                                E(`[inProcessRunner] ${K.agentId} current work aborted (Escape pressed)`), i = !0;
                                break
                            }
                            n.push(q6), v.push(q6), N96(g, q6, c, w.options.tools);
                            let o = nt(g);
                            sF(_, (_6) => {
                                let r = _6.inProgressToolUseIDs;
                                if (q6.type === "assistant") {
                                    for (let t of q6.message.content)
                                        if (t.type === "tool_use") r = new Set([...r ?? [], t.id])
                                } else if (q6.type === "user") {
                                    let t = q6.message.content;
                                    if (Array.isArray(t)) {
                                        for (let Y6 of t)
                                            if (typeof Y6 === "object" && "type" in Y6 && Y6.type === "tool_result") {
                                                if (r) r = new Set(r), r.delete(Y6.tool_use_id)
                                            }
                                    }
                                }
                                return {
                                    ..._6,
                                    progress: o,
                                    messages: QH6(_6.messages, q6),
                                    inProgressToolUseIDs: r
                                }
                            }, W)
                        }
                        return {
                            success: !0,
                            messages: n
                        }
                    })
                }), sF(_, (q6) => ({
                    ...q6,
                    currentWorkAbortController: void 0
                }), W), $.signal.aborted) break;
            if (i) {
                E(`[inProcessRunner] ${K.agentId} work interrupted, returning to idle`);
                let q6 = _9({
                    content: at
                });
                sF(_, (o) => ({
                    ...o,
                    messages: QH6(o.messages, q6)
                }), W)
            }
            let J6 = w.getAppState().tasks[_],
                $6 = J6?.type === "in_process_teammate" && J6.isIdle;
            if (sF(_, (q6) => {
                    return q6.onIdleCallbacks?.forEach((o) => o()), {
                        ...q6,
                        isIdle: !0,
                        onIdleCallbacks: []
                    }
                }, W), !$6) await jNK(K.agentName, K.color, K.teamName, {
                idleReason: i ? "interrupted" : "available",
                summary: J18(v)
            });
            else E(`[inProcessRunner] Skipping duplicate idle notification for ${K.agentName}`);
            E(`[inProcessRunner] ${K.agentId} finished prompt, waiting for next`);
            let H6 = await CXY(K, $, _, w.getAppState, W, K.parentSessionId);
            switch (H6.type) {
                case "shutdown_request":
                    E(`[inProcessRunner] ${K.agentId} received shutdown request - passing to model`), k = k97(H6.request?.from || "team-lead", H6.originalMessage), lI8(_, t8({
                        content: k
                    }), D);
                    break;
                case "new_message":
                    if (E(`[inProcessRunner] ${K.agentId} received new message from ${H6.from}`), H6.from === "user") k = H6.message;
                    else k = k97(H6.from, H6.message, H6.color, H6.summary), lI8(_, t8({
                        content: k
                    }), D);
                    break;
                case "aborted":
                    E(`[inProcessRunner] ${K.agentId} aborted while waiting`), N = !0;
                    break
            }
        }
        let h = !1,
            C;
        if (sF(_, (x) => {
                if (x.status !== "running") return h = !0, x;
                return C = x.toolUseId, x.onIdleCallbacks?.forEach((B) => B()), x.unregisterCleanup?.(), {
                    ...x,
                    status: "completed",
                    notified: !0,
                    endTime: Date.now(),
                    messages: x.messages?.length ? [x.messages.at(-1)] : void 0,
                    pendingUserMessages: [],
                    inProgressToolUseIDs: void 0,
                    abortController: void 0,
                    unregisterCleanup: void 0,
                    currentWorkAbortController: void 0,
                    onIdleCallbacks: []
                }
            }, W), n2(_), D.evictTerminal(_), !h) I$(_, "completed", {
            toolUseId: C,
            summary: K.agentId
        });
        return OJ6(K.agentId), {
            success: !0,
            messages: v
        }
    } catch (R) {
        let h = R instanceof Error ? R.message : "Unknown error";
        E(`[inProcessRunner] Agent ${K.agentId} failed: ${h}`);
        let C = !1,
            x;
        if (sF(_, (B) => {
                if (B.status !== "running") return C = !0, B;
                return x = B.toolUseId, B.onIdleCallbacks?.forEach((m) => m()), B.unregisterCleanup?.(), {
                    ...B,
                    status: "failed",
                    notified: !0,
                    error: h,
                    isIdle: !0,
                    endTime: Date.now(),
                    onIdleCallbacks: [],
                    messages: B.messages?.length ? [B.messages.at(-1)] : void 0,
                    pendingUserMessages: [],
                    inProgressToolUseIDs: void 0,
                    abortController: void 0,
                    unregisterCleanup: void 0,
                    currentWorkAbortController: void 0
                }
            }, W), n2(_), D.evictTerminal(_), !C) I$(_, "failed", {
            toolUseId: x,
            summary: K.agentId
        });
        return await jNK(K.agentName, K.color, K.teamName, {
            idleReason: "failed",
            completedStatus: "failed",
            failureReason: h
        }), OJ6(K.agentId), {
            success: !1,
            error: h,
            messages: v
        }
    }
}
// @from(Ln 399503, Col 0)
function Jg8(q) {
    let K = q.identity.agentId;
    bXY(q).catch((_) => {
        E(`[inProcessRunner] Unhandled error in ${K}: ${_}`)
    })
}
// @from(Ln 399509, Col 4)
yXY = 500
// @from(Ln 399510, Col 4)
L77 = L(() => {
    sy();
    rA();
    qR6();
    C8();
    rR();
    ep();
    $y();
    hx();
    vM();
    vJ6();
    MT();
    _7();
    EH();
    kD();
    x$();
    mB();
    K8();
    FP();
    _7();
    MH();
    g$();
    BP();
    e8();
    PX();
    Rv();
    ZX();
    ih6();
    ND();
    ah6()
})
// @from(Ln 399541, Col 0)
class JNK {
    type = "in-process";
    context = null;
    setContext(q) {
        this.context = q
    }
    async isAvailable() {
        return !0
    }
    async spawn(q) {
        if (!this.context) return E(`[InProcessBackend] spawn() called without context for ${q.name}`), {
            success: !1,
            agentId: `${q.name}@${q.teamName}`,
            error: "InProcessBackend not initialized. Call setContext() before spawn()."
        };
        E(`[InProcessBackend] spawn() called for ${q.name}`);
        let K = await cI8({
            name: q.name,
            teamName: q.teamName,
            prompt: q.prompt,
            color: q.color,
            planModeRequired: q.planModeRequired ?? !1
        }, this.context);
        if (K.success && K.taskId && K.teammateContext && K.abortController) Jg8({
            identity: {
                agentId: K.agentId,
                agentName: q.name,
                teamName: q.teamName,
                color: q.color,
                planModeRequired: q.planModeRequired ?? !1,
                parentSessionId: K.teammateContext.parentSessionId
            },
            taskId: K.taskId,
            prompt: q.prompt,
            teammateContext: K.teammateContext,
            toolUseContext: {
                ...this.context,
                messages: []
            },
            abortController: K.abortController,
            model: q.model,
            systemPrompt: q.systemPrompt,
            systemPromptMode: q.systemPromptMode,
            allowedTools: q.permissions,
            allowPermissionPrompts: q.allowPermissionPrompts
        }), E(`[InProcessBackend] Started agent execution for ${K.agentId}`);
        return {
            success: K.success,
            agentId: K.agentId,
            taskId: K.taskId,
            abortController: K.abortController,
            error: K.error
        }
    }
    async sendMessage(q, K) {
        E(`[InProcessBackend] sendMessage() to ${q}: ${K.text.substring(0,50)}...`);
        let _ = _18(q);
        if (!_) throw E(`[InProcessBackend] Invalid agentId format: ${q}`), Error(`Invalid agentId format: ${q}. Expected format: agentName@teamName`);
        let {
            agentName: z,
            teamName: Y
        } = _;
        await F_(z, {
            text: K.text,
            from: K.from,
            color: K.color,
            timestamp: K.timestamp ?? new Date().toISOString()
        }, Y), E(`[InProcessBackend] sendMessage() completed for ${q}`)
    }
    async terminate(q, K) {
        if (E(`[InProcessBackend] terminate() called for ${q}: ${K}`), !this.context) return E(`[InProcessBackend] terminate() failed: no context set for ${q}`), !1;
        let _ = this.context.getAppState(),
            z = mc(q, _.tasks);
        if (!z) return E(`[InProcessBackend] terminate() failed: task not found for ${q}`), !1;
        if (z.shutdownRequested) return E(`[InProcessBackend] terminate(): shutdown already requested for ${q}`), !0;
        let Y = `shutdown-${q}-${Date.now()}`,
            A = dh6({
                requestId: Y,
                from: "team-lead",
                reason: K
            }),
            O = z.identity.agentName;
        return await F_(O, {
            from: "team-lead",
            text: I6(A),
            timestamp: new Date().toISOString()
        }, z.identity.teamName), ui1(z.id, this.context.taskRegistry), E(`[InProcessBackend] terminate() sent shutdown request to ${q}`), !0
    }
    async kill(q) {
        if (E(`[InProcessBackend] kill() called for ${q}`), !this.context) return E(`[InProcessBackend] kill() failed: no context set for ${q}`), !1;
        let K = this.context.getAppState(),
            _ = mc(q, K.tasks);
        if (!_) return E(`[InProcessBackend] kill() failed: task not found for ${q}`), !1;
        let z = W18(_.id, this.context.taskRegistry, this.context.setAppState);
        return E(`[InProcessBackend] kill() ${z?"succeeded":"failed"} for ${q}`), z
    }
    async isActive(q) {
        if (E(`[InProcessBackend] isActive() called for ${q}`), !this.context) return E(`[InProcessBackend] isActive() failed: no context set for ${q}`), !1;
        let K = this.context.getAppState(),
            _ = mc(q, K.tasks);
        if (!_) return E(`[InProcessBackend] isActive(): task not found for ${q}`), !1;
        let z = _.status === "running",
            Y = _.abortController?.signal.aborted ?? !0,
            A = z && !Y;
        return E(`[InProcessBackend] isActive() for ${q}: ${A} (running=${z}, aborted=${Y})`), A
    }
}
// @from(Ln 399649, Col 0)
function XNK() {
    return new JNK
}
// @from(Ln 399652, Col 4)
MNK = L(() => {
    hx();
    K8();
    e8();
    ZX();
    L77();
    D18()
})
// @from(Ln 399660, Col 0)
class PNK {
    type;
    backend;
    context = null;
    spawnedTeammates;
    cleanupRegistered = !1;
    constructor(q) {
        this.backend = q, this.type = q.type, this.spawnedTeammates = new Map
    }
    setContext(q) {
        this.context = q
    }
    async isAvailable() {
        return this.backend.isAvailable()
    }
    async spawn(q) {
        let K = op(q.name, q.teamName);
        if (!this.context) return E(`[PaneBackendExecutor] spawn() called without context for ${q.name}`), {
            success: !1,
            agentId: K,
            error: "PaneBackendExecutor not initialized. Call setContext() before spawn()."
        };
        try {
            let _ = q.color ?? this.context.teammateColors.assign(K),
                {
                    paneId: z,
                    isFirstTeammate: Y
                } = await this.backend.createTeammatePaneInSwarmView(q.name, _),
                A = await ap();
            if (Y && A) await this.backend.enablePaneBorderStatus();
            let O = K2K(),
                w = [`--agent-id ${A5([K])}`, `--agent-name ${A5([q.name])}`, `--team-name ${A5([q.teamName])}`, `--agent-color ${A5([_])}`, `--parent-session-id ${A5([q.parentSessionId||I8()])}`, q.planModeRequired ? "--plan-mode-required" : ""].filter(Boolean).join(" "),
                $ = this.context.getAppState(),
                j = _2K({
                    planModeRequired: q.planModeRequired,
                    permissionMode: $.toolPermissionContext.mode
                });
            if (q.model) j = j.split(" ").filter((P, W, D) => P !== "--model" && D[W - 1] !== "--model").join(" "), j = j ? `${j} --model ${A5([q.model])}` : `--model ${A5([q.model])}`;
            let H = j ? ` ${j}` : "",
                J = q.cwd,
                X = HK8(),
                M = `cd ${A5([J])} && env ${X} ${A5([O])} ${w}${H}`;
            if (await this.backend.sendCommandToPane(z, M, !A), this.spawnedTeammates.set(K, {
                    paneId: z,
                    insideTmux: A
                }), !this.cleanupRegistered) this.cleanupRegistered = !0, eq(async () => {
                for (let [P, W] of this.spawnedTeammates) E(`[PaneBackendExecutor] Cleanup: killing pane for ${P}`), await this.backend.killPane(W.paneId, !W.insideTmux);
                this.spawnedTeammates.clear()
            });
            return await F_(q.name, {
                from: "team-lead",
                text: q.prompt,
                timestamp: new Date().toISOString()
            }, q.teamName), E(`[PaneBackendExecutor] Spawned teammate ${K} in pane ${z}`), {
                success: !0,
                agentId: K,
                paneId: z
            }
        } catch (_) {
            let z = _ instanceof Error ? _.message : String(_);
            return E(`[PaneBackendExecutor] Failed to spawn ${K}: ${z}`), {
                success: !1,
                agentId: K,
                error: z
            }
        }
    }
    async sendMessage(q, K) {
        E(`[PaneBackendExecutor] sendMessage() to ${q}: ${K.text.substring(0,50)}...`);
        let _ = _18(q);
        if (!_) throw Error(`Invalid agentId format: ${q}. Expected format: agentName@teamName`);
        let {
            agentName: z,
            teamName: Y
        } = _;
        await F_(z, {
            text: K.text,
            from: K.from,
            color: K.color,
            timestamp: K.timestamp ?? new Date().toISOString()
        }, Y), E(`[PaneBackendExecutor] sendMessage() completed for ${q}`)
    }
    async terminate(q, K) {
        E(`[PaneBackendExecutor] terminate() called for ${q}: ${K}`);
        let _ = _18(q);
        if (!_) return E("[PaneBackendExecutor] terminate() failed: invalid agentId format"), !1;
        let {
            agentName: z,
            teamName: Y
        } = _, A = {
            type: "shutdown_request",
            requestId: `shutdown-${q}-${Date.now()}`,
            from: "team-lead",
            reason: K
        };
        return await F_(z, {
            from: "team-lead",
            text: I6(A),
            timestamp: new Date().toISOString()
        }, Y), E(`[PaneBackendExecutor] terminate() sent shutdown request to ${q}`), !0
    }
    async kill(q) {
        E(`[PaneBackendExecutor] kill() called for ${q}`);
        let K = this.spawnedTeammates.get(q);
        if (!K) return E(`[PaneBackendExecutor] kill() failed: teammate ${q} not found in spawned map`), !1;
        let {
            paneId: _,
            insideTmux: z
        } = K, Y = await this.backend.killPane(_, !z);
        if (Y) this.spawnedTeammates.delete(q), E(`[PaneBackendExecutor] kill() succeeded for ${q}`);
        else E(`[PaneBackendExecutor] kill() failed for ${q}`);
        return Y
    }
    async isActive(q) {
        if (E(`[PaneBackendExecutor] isActive() called for ${q}`), !this.spawnedTeammates.get(q)) return E(`[PaneBackendExecutor] isActive(): teammate ${q} not found`), !1;
        return !0
    }
}
// @from(Ln 399779, Col 0)
function WNK(q) {
    return new PNK(q)
}
// @from(Ln 399782, Col 4)
DNK = L(() => {
    y8();
    R9();
    K8();
    e8();
    ZX();
    T77();
    yx()
})
// @from(Ln 399791, Col 4)
vNK = {}
// @from(Ln 399796, Col 0)
function fNK() {
    return l7(IXY)
}
// @from(Ln 399800, Col 0)
function xXY() {
    let q, K = new Promise((z) => {
            q = z
        }),
        _ = ZNK;
    return ZNK = K, _.then(() => q)
}
// @from(Ln 399808, Col 0)
function GNK(q) {
    return {
        red: "red",
        blue: "blue",
        green: "green",
        yellow: "yellow",
        purple: "magenta",
        orange: "colour208",
        pink: "colour205",
        cyan: "cyan"
    } [q]
}
// @from(Ln 399821, Col 0)
function eF(q) {
    return w1(mD, q)
}
// @from(Ln 399825, Col 0)
function MG(q) {
    return w1(mD, ["-L", gh6(), ...q])
}
// @from(Ln 399828, Col 0)
class N97 {
    type = "tmux";
    displayName = "tmux";
    supportsHideShow = !0;
    cachedLeaderWindowTarget = null;
    firstPaneUsedForExternal = !1;
    async isAvailable() {
        return r56()
    }
    async isRunningInside() {
        return ap()
    }
    async createTeammatePaneInSwarmView(q, K) {
        let _ = await xXY();
        try {
            if (await this.isRunningInside()) return await this.createTeammatePaneWithLeader(q, K);
            return await this.createTeammatePaneExternal(q, K)
        } finally {
            _()
        }
    }
    async sendCommandToPane(q, K, _ = !1) {
        let Y = await (_ ? MG : eF)(["send-keys", "-t", q, K, "Enter"]);
        if (Y.code !== 0) throw Error(`Failed to send command to pane ${q}: ${Y.stderr}`)
    }
    async setPaneBorderColor(q, K, _ = !1) {
        let z = GNK(K),
            Y = _ ? MG : eF;
        await Y(["select-pane", "-t", q, "-P", `bg=default,fg=${z}`]), await Y(["set-option", "-p", "-t", q, "pane-border-style", `fg=${z}`]), await Y(["set-option", "-p", "-t", q, "pane-active-border-style", `fg=${z}`])
    }
    async setPaneTitle(q, K, _, z = !1) {
        let Y = GNK(_),
            A = z ? MG : eF;
        await A(["select-pane", "-t", q, "-T", K]), await A(["set-option", "-p", "-t", q, "pane-border-format", `#[fg=${Y},bold] #{pane_title} #[default]`])
    }
    async enablePaneBorderStatus(q, K = !1) {
        let _ = q || await this.getCurrentWindowTarget();
        if (!_) return;
        await (K ? MG : eF)(["set-option", "-w", "-t", _, "pane-border-status", "top"])
    }
    async rebalancePanes(q, K) {
        if (K) await this.rebalancePanesWithLeader(q);
        else await this.rebalancePanesTiled(q)
    }
    async killPane(q, K = !1) {
        return (await (K ? MG : eF)(["kill-pane", "-t", q])).code === 0
    }
    async hidePane(q, K = !1) {
        let _ = K ? MG : eF;
        await _(["new-session", "-d", "-s", Gi1]);
        let z = await _(["break-pane", "-d", "-s", q, "-t", `${Gi1}:`]);
        if (z.code === 0) E(`[TmuxBackend] Hidden pane ${q}`);
        else E(`[TmuxBackend] Failed to hide pane ${q}: ${z.stderr}`);
        return z.code === 0
    }
    async showPane(q, K, _ = !1) {
        let z = _ ? MG : eF,
            Y = await z(["join-pane", "-h", "-s", q, "-t", K]);
        if (Y.code !== 0) return E(`[TmuxBackend] Failed to show pane ${q}: ${Y.stderr}`), !1;
        E(`[TmuxBackend] Showed pane ${q} in ${K}`), await z(["select-layout", "-t", K, "main-vertical"]);
        let O = (await z(["list-panes", "-t", K, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean);
        if (O[0]) await z(["resize-pane", "-t", O[0], "-x", "30%"]);
        return !0
    }
    async getCurrentPaneId() {
        let q = mI8();
        if (q) return q;
        let K = await w1(mD, ["display-message", "-p", "#{pane_id}"]);
        if (K.code !== 0) return E(`[TmuxBackend] Failed to get current pane ID (exit ${K.code}): ${K.stderr}`), null;
        return K.stdout.trim()
    }
    async getCurrentWindowTarget() {
        if (this.cachedLeaderWindowTarget) return this.cachedLeaderWindowTarget;
        let q = mI8(),
            K = ["display-message"];
        if (q) K.push("-t", q);
        K.push("-p", "#{window_id}");
        let _ = await w1(mD, K);
        if (_.code !== 0) return E(`[TmuxBackend] Failed to get current window target (exit ${_.code}): ${_.stderr}`), null;
        return this.cachedLeaderWindowTarget = _.stdout.trim(), this.cachedLeaderWindowTarget
    }
    async getCurrentWindowPaneCount(q, K = !1) {
        let _ = q || await this.getCurrentWindowTarget();
        if (!_) return null;
        let z = ["list-panes", "-t", _, "-F", "#{pane_id}"],
            Y = K ? await MG(z) : await eF(z);
        if (Y.code !== 0) return j6(Error(`[TmuxBackend] Failed to get pane count for ${_} (exit ${Y.code}): ${Y.stderr}`)), null;
        return w7(Y.stdout.trim().split(`
`), Boolean)
    }
    async hasSessionInSwarm(q) {
        return (await MG(["has-session", "-t", q])).code === 0
    }
    async createExternalSwarmSession() {
        if (!await this.hasSessionInSwarm(Ny)) {
            let A = await MG(["new-session", "-d", "-s", Ny, "-n", Fh6, "-P", "-F", "#{pane_id}"]);
            if (A.code !== 0) throw Error(`Failed to create swarm session: ${A.stderr||"Unknown error"}`);
            let O = A.stdout.trim(),
                w = `${Ny}:${Fh6}`;
            return E(`[TmuxBackend] Created external swarm session with window ${w}, pane ${O}`), {
                windowTarget: w,
                paneId: O
            }
        }
        let _ = (await MG(["list-windows", "-t", Ny, "-F", "#{window_name}"])).stdout.trim().split(`
`).filter(Boolean),
            z = `${Ny}:${Fh6}`;
        if (_.includes(Fh6)) {
            let O = (await MG(["list-panes", "-t", z, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean);
            return {
                windowTarget: z,
                paneId: O[0] || ""
            }
        }
        let Y = await MG(["new-window", "-t", Ny, "-n", Fh6, "-P", "-F", "#{pane_id}"]);
        if (Y.code !== 0) throw Error(`Failed to create swarm-view window: ${Y.stderr||"Unknown error"}`);
        return {
            windowTarget: z,
            paneId: Y.stdout.trim()
        }
    }
    async createTeammatePaneWithLeader(q, K) {
        let _ = await this.getCurrentPaneId(),
            z = await this.getCurrentWindowTarget();
        if (!_ || !z) throw Error("Could not determine current tmux pane/window");
        let Y = await this.getCurrentWindowPaneCount(z);
        if (Y === null) throw Error("Could not determine pane count for current window");
        let A = Y === 1,
            O;
        if (A) O = await w1(mD, ["split-window", "-t", _, "-h", "-l", "70%", "-P", "-F", "#{pane_id}"]);
        else {
            let H = (await w1(mD, ["list-panes", "-t", z, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean).slice(1),
                J = H.length,
                X = J % 2 === 1,
                M = Math.floor((J - 1) / 2),
                P = H[M] || H.at(-1);
            O = await w1(mD, ["split-window", "-t", P, X ? "-v" : "-h", "-P", "-F", "#{pane_id}"])
        }
        if (O.code !== 0) throw Error(`Failed to create teammate pane: ${O.stderr}`);
        let w = O.stdout.trim();
        return E(`[TmuxBackend] Created teammate pane for ${q}: ${w}`), await this.setPaneBorderColor(w, K), await this.setPaneTitle(w, q, K), await this.rebalancePanesWithLeader(z), await fNK(), {
            paneId: w,
            isFirstTeammate: A
        }
    }
    async createTeammatePaneExternal(q, K) {
        let {
            windowTarget: _,
            paneId: z
        } = await this.createExternalSwarmSession(), Y = await this.getCurrentWindowPaneCount(_, !0);
        if (Y === null) throw Error("Could not determine pane count for swarm window");
        let A = !this.firstPaneUsedForExternal && Y === 1,
            O;
        if (A) O = z, this.firstPaneUsedForExternal = !0, E(`[TmuxBackend] Using initial pane for first teammate ${q}: ${O}`), await this.enablePaneBorderStatus(_, !0);
        else {
            let $ = (await MG(["list-panes", "-t", _, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean),
                j = $.length,
                H = j % 2 === 1,
                J = Math.floor((j - 1) / 2),
                X = $[J] || $.at(-1),
                M = await MG(["split-window", "-t", X, H ? "-v" : "-h", "-P", "-F", "#{pane_id}"]);
            if (M.code !== 0) throw Error(`Failed to create teammate pane: ${M.stderr}`);
            O = M.stdout.trim(), E(`[TmuxBackend] Created teammate pane for ${q}: ${O}`)
        }
        return await this.setPaneBorderColor(O, K, !0), await this.setPaneTitle(O, q, K, !0), await this.rebalancePanesTiled(_), await fNK(), {
            paneId: O,
            isFirstTeammate: A
        }
    }
    async rebalancePanesWithLeader(q) {
        let _ = (await eF(["list-panes", "-t", q, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean);
        if (_.length <= 2) return;
        await eF(["select-layout", "-t", q, "main-vertical"]);
        let z = _[0];
        await eF(["resize-pane", "-t", z, "-x", "30%"]), E(`[TmuxBackend] Rebalanced ${_.length-1} teammate panes with leader`)
    }
    async rebalancePanesTiled(q) {
        let _ = (await MG(["list-panes", "-t", q, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean);
        if (_.length <= 1) return;
        await MG(["select-layout", "-t", q, "tiled"]), E(`[TmuxBackend] Rebalanced ${_.length} teammate panes with tiled layout`)
    }
}
// @from(Ln 400016, Col 4)
ZNK
// @from(Ln 400016, Col 9)
IXY = 200
// @from(Ln 400017, Col 4)
TNK = L(() => {
    K8();
    Q4();
    U8();
    yx();
    sx();
    ZNK = Promise.resolve();
    E97(N97)
})
// @from(Ln 400026, Col 4)
kNK = {}
// @from(Ln 400031, Col 0)
function uXY() {
    let q, K = new Promise((z) => {
            q = z
        }),
        _ = VNK;
    return VNK = K, _.then(() => q)
}
// @from(Ln 400039, Col 0)
function wc8(q) {
    return w1(lh6, q)
}
// @from(Ln 400043, Col 0)
function mXY(q) {
    let K = q.match(/Created new pane:\s*(.+)/);
    if (K && K[1]) return K[1].trim();
    return ""
}
// @from(Ln 400049, Col 0)
function BXY() {
    let q = process.env.ITERM_SESSION_ID;
    if (!q) return null;
    let K = q.indexOf(":");
    if (K === -1) return null;
    return q.slice(K + 1)
}
// @from(Ln 400056, Col 0)
class y97 {
    type = "iterm2";
    displayName = "iTerm2";
    supportsHideShow = !1;
    async isAvailable() {
        let q = xc();
        if (E(`[ITermBackend] isAvailable check: inITerm2=${q}`), !q) return E("[ITermBackend] isAvailable: false (not in iTerm2)"), !1;
        let K = await P18();
        return E(`[ITermBackend] isAvailable: ${K} (it2 CLI ${K?"found":"not found"})`), K
    }
    async isRunningInside() {
        let q = xc();
        return E(`[ITermBackend] isRunningInside: ${q}`), q
    }
    async createTeammatePaneInSwarmView(q, K) {
        E(`[ITermBackend] createTeammatePaneInSwarmView called for ${q} with color ${K}`);
        let _ = await uXY();
        try {
            while (!0) {
                let z = !Oc8;
                E(`[ITermBackend] Creating pane: isFirstTeammate=${z}, existingPanes=${zn.length}`);
                let Y, A;
                if (z) {
                    let $ = BXY();
                    if ($) Y = ["session", "split", "-v", "-s", $], E(`[ITermBackend] First split from leader session: ${$}`);
                    else Y = ["session", "split", "-v"], E("[ITermBackend] First split from active session (no leader ID)")
                } else if (A = zn[zn.length - 1], A) Y = ["session", "split", "-s", A], E(`[ITermBackend] Subsequent split from teammate session: ${A}`);
                else Y = ["session", "split"], E("[ITermBackend] Subsequent split from active session (no teammate ID)");
                let O = await wc8(Y);
                if (O.code !== 0) {
                    if (A) {
                        let $ = await wc8(["session", "list"]);
                        if ($.code === 0 && !$.stdout.includes(A)) {
                            E(`[ITermBackend] Split failed targeting dead session ${A}, pruning and retrying: ${O.stderr}`);
                            let j = zn.indexOf(A);
                            if (j !== -1) zn.splice(j, 1);
                            if (zn.length === 0) Oc8 = !1;
                            continue
                        }
                    }
                    throw Error(`Failed to create iTerm2 split pane: ${O.stderr}`)
                }
                if (z) Oc8 = !0;
                let w = mXY(O.stdout);
                if (!w) throw Error(`Failed to parse session ID from split output: ${O.stdout}`);
                return E(`[ITermBackend] Created teammate pane for ${q}: ${w}`), zn.push(w), {
                    paneId: w,
                    isFirstTeammate: z
                }
            }
        } finally {
            _()
        }
    }
    async sendCommandToPane(q, K, _) {
        let Y = await wc8(q ? ["session", "run", "-s", q, K] : ["session", "run", K]);
        if (Y.code !== 0) throw Error(`Failed to send command to iTerm2 pane ${q}: ${Y.stderr}`)
    }
    async setPaneBorderColor(q, K, _) {}
    async setPaneTitle(q, K, _, z) {}
    async enablePaneBorderStatus(q, K) {}
    async rebalancePanes(q, K) {
        E("[ITermBackend] Pane rebalancing not implemented for iTerm2")
    }
    async killPane(q, K) {
        let _ = await wc8(["session", "close", "-f", "-s", q]),
            z = zn.indexOf(q);
        if (z !== -1) zn.splice(z, 1);
        if (zn.length === 0) Oc8 = !1;
        return _.code === 0
    }
    async hidePane(q, K) {
        return E("[ITermBackend] hidePane not supported in iTerm2"), !1
    }
    async showPane(q, K, _) {
        return E("[ITermBackend] showPane not supported in iTerm2"), !1
    }
}
// @from(Ln 400134, Col 4)
zn
// @from(Ln 400134, Col 8)
Oc8 = !1
// @from(Ln 400135, Col 4)
VNK
// @from(Ln 400136, Col 4)
NNK = L(() => {
    K8();
    Q4();
    yx();
    sx();
    zn = [], VNK = Promise.resolve();
    L97(y97)
})
// @from(Ln 400144, Col 4)
hNK = {}
// @from(Ln 400163, Col 0)
function ENK() {
    return {
        cachedBackend: null,
        cachedDetectionResult: null,
        backendsRegistered: !1,
        cachedInProcessBackend: null,
        cachedPaneBackendExecutor: null,
        inProcessFallbackActive: !1,
        TmuxBackendClass: null,
        ITermBackendClass: null
    }
}
// @from(Ln 400175, Col 0)
async function TI6(q = CT) {
    if (q.backendsRegistered) return;
    await Promise.resolve().then(() => (TNK(), vNK)), await Promise.resolve().then(() => (NNK(), kNK)), q.TmuxBackendClass = CT.TmuxBackendClass, q.ITermBackendClass = CT.ITermBackendClass, q.backendsRegistered = !0
}
// @from(Ln 400180, Col 0)
function E97(q, K = CT) {
    K.TmuxBackendClass = q
}
// @from(Ln 400184, Col 0)
function L97(q, K = CT) {
    E(`[registry] registerITermBackend called, class=${q?.name||"undefined"}`), K.ITermBackendClass = q
}
// @from(Ln 400188, Col 0)
function $c8(q) {
    if (!q.TmuxBackendClass) throw Error("TmuxBackend not registered. Import TmuxBackend.ts before using the registry.");
    return new q.TmuxBackendClass
}
// @from(Ln 400193, Col 0)
function yNK(q) {
    if (!q.ITermBackendClass) throw Error("ITermBackend not registered. Import ITermBackend.ts before using the registry.");
    return new q.ITermBackendClass
}
// @from(Ln 400197, Col 0)
async function v96(q = CT) {
    if (await TI6(q), q.cachedDetectionResult) return E(`[BackendRegistry] Using cached backend: ${q.cachedDetectionResult.backend.type}`), q.cachedDetectionResult;
    E("[BackendRegistry] Starting backend detection...");
    let K = await ap(),
        _ = xc();
    if (E(`[BackendRegistry] Environment: insideTmux=${K}, inITerm2=${_}`), K) {
        E("[BackendRegistry] Selected: tmux (running inside tmux session)");
        let Y = $c8(q);
        return q.cachedBackend = Y, q.cachedDetectionResult = {
            backend: Y,
            isNative: !0,
            needsIt2Setup: !1
        }, q.cachedDetectionResult
    }
    if (_) {
        let Y = twK();
        if (Y) E("[BackendRegistry] User prefers tmux over iTerm2, skipping iTerm2 detection");
        else {
            let O = await P18();
            if (E(`[BackendRegistry] iTerm2 detected, it2 CLI available: ${O}`), O) {
                E("[BackendRegistry] Selected: iterm2 (native iTerm2 with it2 CLI)");
                let w = yNK(q);
                return q.cachedBackend = w, q.cachedDetectionResult = {
                    backend: w,
                    isNative: !0,
                    needsIt2Setup: !1
                }, q.cachedDetectionResult
            }
        }
        let A = await r56();
        if (E(`[BackendRegistry] it2 not available, tmux available: ${A}`), A) {
            E("[BackendRegistry] Selected: tmux (fallback in iTerm2, it2 setup recommended)");
            let O = $c8(q);
            return q.cachedBackend = O, q.cachedDetectionResult = {
                backend: O,
                isNative: !1,
                needsIt2Setup: !Y
            }, q.cachedDetectionResult
        }
        throw E("[BackendRegistry] ERROR: iTerm2 detected but no it2 CLI and no tmux"), Error("iTerm2 detected but it2 CLI not installed. Install it2 with: pip install it2")
    }
    let z = await r56();
    if (E(`[BackendRegistry] Not in tmux or iTerm2, tmux available: ${z}`), z) {
        E("[BackendRegistry] Selected: tmux (external session mode)");
        let Y = $c8(q);
        return q.cachedBackend = Y, q.cachedDetectionResult = {
            backend: Y,
            isNative: !1,
            needsIt2Setup: !1
        }, q.cachedDetectionResult
    }
    throw E("[BackendRegistry] ERROR: No pane backend available"), Error(pXY())
}
// @from(Ln 400251, Col 0)
function pXY() {
    switch (y1()) {
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
// @from(Ln 400274, Col 0)
function dX6(q, K = CT) {
    switch (q) {
        case "tmux":
            return $c8(K);
        case "iterm2":
            return yNK(K)
    }
}
// @from(Ln 400283, Col 0)
function VI6(q = CT) {
    return q.cachedBackend
}
// @from(Ln 400287, Col 0)
function h97(q = CT) {
    return q.cachedDetectionResult
}
// @from(Ln 400291, Col 0)
function h77(q = CT) {
    E("[BackendRegistry] Marking in-process fallback as active"), q.inProcessFallbackActive = !0
}
// @from(Ln 400295, Col 0)
function FXY() {
    return UX6()
}
// @from(Ln 400299, Col 0)
function bF(q = CT) {
    if (I7()) return E("[BackendRegistry] isInProcessEnabled: true (non-interactive session)"), !0;
    let K = FXY(),
        _;
    if (K === "in-process") _ = !0;
    else if (K === "tmux") _ = !1;
    else {
        if (q.inProcessFallbackActive) return E("[BackendRegistry] isInProcessEnabled: true (fallback after pane backend unavailable)"), !0;
        let z = YJ6(),
            Y = xc();
        _ = !z && !Y
    }
    return E(`[BackendRegistry] isInProcessEnabled: ${_} (mode=${K}, insideTmux=${YJ6()}, inITerm2=${xc()})`), _
}
// @from(Ln 400314, Col 0)
function d37(q = CT) {
    return bF(q) ? "in-process" : "tmux"
}
// @from(Ln 400318, Col 0)
function LNK(q = CT) {
    if (!q.cachedInProcessBackend) q.cachedInProcessBackend = XNK();
    return q.cachedInProcessBackend
}
// @from(Ln 400322, Col 0)
async function gXY(q = !1, K = CT) {
    if (q && bF(K)) return E("[BackendRegistry] Using in-process executor"), LNK(K);
    return E("[BackendRegistry] Using pane backend executor"), UXY(K)
}
// @from(Ln 400326, Col 0)
async function UXY(q) {
    if (!q.cachedPaneBackendExecutor) {
        let K = await v96(q);
        q.cachedPaneBackendExecutor = WNK(K.backend), E(`[BackendRegistry] Created PaneBackendExecutor wrapping ${K.backend.type}`)
    }
    return q.cachedPaneBackendExecutor
}
// @from(Ln 400334, Col 0)
function R77(q = CT) {
    q.cachedBackend = null, q.cachedDetectionResult = null, q.cachedInProcessBackend = null, q.cachedPaneBackendExecutor = null, q.backendsRegistered = !1, q.inProcessFallbackActive = !1
}
// @from(Ln 400337, Col 4)
CT
// @from(Ln 400338, Col 4)
sx = L(() => {
    y8();
    K8();
    NK();
    yx();
    MNK();
    v77();
    DNK();
    QX6();
    CT = ENK()
})
// @from(Ln 400349, Col 4)
CNK = {}
// @from(Ln 400390, Col 0)
function T96(q) {
    return q.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
}
// @from(Ln 400394, Col 0)
function S77(q) {
    return q.replaceAll("@", "-")
}
// @from(Ln 400398, Col 0)
function sh6(q) {
    return T38(ID6(), T96(q))
}
// @from(Ln 400402, Col 0)
function oF(q) {
    return T38(sh6(q), "config.json")
}
// @from(Ln 400406, Col 0)
function uM(q) {
    try {
        let K = dXY(oF(q), "utf-8");
        return n8(K)
    } catch (K) {
        if (Q1(K) === "ENOENT") return null;
        return E(`[TeammateTool] Failed to read team file for ${q}: ${b6(K)}`), null
    }
}
// @from(Ln 400415, Col 0)
async function $J6(q) {
    try {
        let K = await SNK(oF(q), "utf-8");
        return n8(K)
    } catch (K) {
        if (Q1(K) === "ENOENT") return null;
        return E(`[TeammateTool] Failed to read team file for ${q}: ${b6(K)}`), null
    }
}
// @from(Ln 400425, Col 0)
function lM6(q, K) {
    let _ = sh6(q);
    QXY(_, {
        recursive: !0
    }), cXY(oF(q), I6(K, null, 2))
}
// @from(Ln 400432, Col 0)
function RNK(q) {
    return Error(`Team "${q}" does not exist. Call spawnTeam first to create the team.`)
}
// @from(Ln 400435, Col 0)
async function QC6(q, K) {
    let _ = oF(q),
        z;
    try {
        z = await Jj(_, {
            lockfilePath: `${_}.lock`,
            ...rXY
        })
    } catch (Y) {
        if (Q1(Y) === "ENOENT") throw RNK(q);
        throw Y
    }
    try {
        let Y = await $J6(q);
        if (!Y) throw RNK(q);
        let A = K(Y);
        if (A === !1) return;
        return await Bd8(q, Y), A
    } finally {
        try {
            await z()
        } catch (Y) {
            E(`[TeammateTool] updateTeamFile lock release failed: ${b6(Y)}`)
        }
    }
}
// @from(Ln 400461, Col 0)
async function C77(q, K) {
    try {
        await QC6(q, (_) => {
            let z = _.members.findIndex((Y) => Y.agentId === K);
            if (z === -1) return !1;
            _.members.splice(z, 1)
        })
    } catch (_) {
        E(`[TeammateTool] removeTeamMember(${K}) failed: ${b6(_)}`)
    }
}
// @from(Ln 400472, Col 0)
async function Bd8(q, K, _) {
    let z = sh6(q);
    await lXY(z, {
        recursive: !0
    }), await nXY(oF(q), I6(K, null, 2), _?.exclusive ? {
        flag: "wx"
    } : void 0)
}
// @from(Ln 400481, Col 0)
function nM6(q, K) {
    let _ = K.agentId || K.name;
    if (!_) return E("[TeammateTool] removeTeammateFromTeamFile called with no identifier"), !1;
    let z = uM(q);
    if (!z) return E(`[TeammateTool] Cannot remove teammate ${_}: failed to read team file for "${q}"`), !1;
    let Y = z.members.length;
    if (z.members = z.members.filter((A) => {
            if (K.agentId && A.agentId === K.agentId) return !1;
            if (K.name && A.name === K.name) return !1;
            return !0
        }), z.members.length === Y) return E(`[TeammateTool] Teammate ${_} not found in team file for "${q}"`), !1;
    return lM6(q, z), E(`[TeammateTool] Removed teammate from team file: ${_}`), !0
}
// @from(Ln 400495, Col 0)
function oXY(q, K) {
    let _ = uM(q);
    if (!_) return !1;
    let z = _.hiddenPaneIds ?? [];
    if (!z.includes(K)) z.push(K), _.hiddenPaneIds = z, lM6(q, _), E(`[TeammateTool] Added ${K} to hidden panes for team ${q}`);
    return !0
}
// @from(Ln 400503, Col 0)
function aXY(q, K) {
    let _ = uM(q);
    if (!_) return !1;
    let z = _.hiddenPaneIds ?? [],
        Y = z.indexOf(K);
    if (Y !== -1) z.splice(Y, 1), _.hiddenPaneIds = z, lM6(q, _), E(`[TeammateTool] Removed ${K} from hidden panes for team ${q}`);
    return !0
}
// @from(Ln 400512, Col 0)
function S97(q, K) {
    let _ = uM(q);
    if (!_) return !1;
    let z = _.members.findIndex((Y) => Y.tmuxPaneId === K);
    if (z === -1) return !1;
    if (_.members.splice(z, 1), _.hiddenPaneIds) {
        let Y = _.hiddenPaneIds.indexOf(K);
        if (Y !== -1) _.hiddenPaneIds.splice(Y, 1)
    }
    return lM6(q, _), E(`[TeammateTool] Removed member with pane ${K} from team ${q}`), !0
}
// @from(Ln 400524, Col 0)
function xi1(q, K) {
    let _ = uM(q);
    if (!_) return !1;
    let z = _.members.findIndex((Y) => Y.agentId === K);
    if (z === -1) return !1;
    return _.members.splice(z, 1), lM6(q, _), E(`[TeammateTool] Removed member ${K} from team ${q}`), !0
}
// @from(Ln 400532, Col 0)
function kI6(q, K, _) {
    let z = uM(q);
    if (!z) return !1;
    let Y = z.members.find((O) => O.name === K);
    if (!Y) return E(`[TeammateTool] Cannot set member mode: member ${K} not found in team ${q}`), !1;
    if (Y.mode === _) return !0;
    let A = z.members.map((O) => O.name === K ? {
        ...O,
        mode: _
    } : O);
    return lM6(q, {
        ...z,
        members: A
    }), E(`[TeammateTool] Set member ${K} in team ${q} to mode: ${_}`), !0
}
// @from(Ln 400548, Col 0)
function C97(q, K) {
    if (!Lz()) return;
    let _ = K ?? Z9(),
        z = T_();
    if (_ && z) kI6(_, z, q)
}
// @from(Ln 400555, Col 0)
function b97(q, K) {
    let _ = uM(q);
    if (!_) return !1;
    let z = new Map(K.map((O) => [O.memberName, O.mode])),
        Y = !1,
        A = _.members.map((O) => {
            let w = z.get(O.name);
            if (w !== void 0 && O.mode !== w) return Y = !0, {
                ...O,
                mode: w
            };
            return O
        });
    if (Y) lM6(q, {
        ..._,
        members: A
    }), E(`[TeammateTool] Set ${K.length} member modes in team ${q}`);
    return !0
}
// @from(Ln 400574, Col 0)
async function V38(q, K, _) {
    try {
        await QC6(q, (z) => {
            let Y = z.members.find((A) => A.name === K);
            if (!Y) return E(`[TeammateTool] Cannot set member active: member ${K} not found in team ${q}`), !1;
            if (Y.isActive === _) return !1;
            Y.isActive = _, E(`[TeammateTool] Set member ${K} in team ${q} to ${_?"active":"idle"}`)
        })
    } catch (z) {
        E(`[TeammateTool] Cannot set member active: ${b6(z)}`)
    }
}
// @from(Ln 400586, Col 0)
async function sXY(q) {
    let K = T38(q, ".git"),
        _ = null;
    try {
        let Y = (await SNK(K, "utf-8")).trim().match(/^gitdir:\s*(.+)$/);
        if (Y && Y[1]) {
            let A = Y[1],
                O = T38(A, "..", "..");
            _ = T38(O, "..")
        }
    } catch {}
    if (_) {
        let z = await M7(D7(), ["worktree", "remove", "--force", q], {
            cwd: _
        });
        if (z.code === 0) {
            E(`[TeammateTool] Removed worktree via git: ${q}`);
            return
        }
        if (z.stderr?.includes("not a working tree")) {
            E(`[TeammateTool] Worktree already removed: ${q}`);
            return
        }
        E(`[TeammateTool] git worktree remove failed, falling back to rm: ${z.stderr}`)
    }
    try {
        await R97(q, {
            recursive: !0,
            force: !0
        }), E(`[TeammateTool] Removed worktree directory manually: ${q}`)
    } catch (z) {
        E(`[TeammateTool] Failed to remove worktree ${q}: ${b6(z)}`)
    }
}
// @from(Ln 400621, Col 0)
function c37(q) {
    zp6().add(q)
}
// @from(Ln 400625, Col 0)
function l37(q) {
    zp6().delete(q)
}
// @from(Ln 400628, Col 0)
async function tXY() {
    let q = zp6();
    if (q.size === 0) return;
    let K = Array.from(q);
    E(`cleanupSessionTeams: removing ${K.length} orphan team dir(s): ${K.join(", ")}`), await Promise.allSettled(K.map((_) => eXY(_))), await Promise.allSettled(K.map((_) => pd8(_))), q.clear()
}
// @from(Ln 400634, Col 0)
async function eXY(q) {
    let K = uM(q);
    if (!K) return;
    let _ = K.members.filter((w) => w.name !== Mz && w.tmuxPaneId && w.backendType && zJ6(w.backendType));
    if (_.length === 0) return;
    let [{
        ensureBackendsRegistered: z,
        getBackendByType: Y
    }, {
        isInsideTmux: A
    }] = await Promise.all([Promise.resolve().then(() => (sx(), hNK)), Promise.resolve().then(() => (yx(), hi1))]);
    await z();
    let O = !await A();
    await Promise.allSettled(_.map(async (w) => {
        if (!w.tmuxPaneId || !w.backendType || !zJ6(w.backendType)) return;
        let $ = await Y(w.backendType).killPane(w.tmuxPaneId, O);
        E(`cleanupSessionTeams: killPane ${w.name} (${w.backendType} ${w.tmuxPaneId}) → ${$}`)
    }))
}
// @from(Ln 400653, Col 0)
async function pd8(q) {
    let K = T96(q),
        _ = uM(q),
        z = [];
    if (_) {
        for (let O of _.members)
            if (O.worktreePath) z.push(O.worktreePath)
    }
    for (let O of z) await sXY(O);
    let Y = sh6(q);
    try {
        await R97(Y, {
            recursive: !0,
            force: !0
        }), E(`[TeammateTool] Cleaned up team directory: ${Y}`)
    } catch (O) {
        E(`[TeammateTool] Failed to clean up team directory ${Y}: ${b6(O)}`)
    }
    let A = gp(K);
    try {
        await R97(A, {
            recursive: !0,
            force: !0
        }), E(`[TeammateTool] Cleaned up tasks directory: ${A}`), B56()
    } catch (O) {
        E(`[TeammateTool] Failed to clean up tasks directory ${A}: ${b6(O)}`)
    }
}
// @from(Ln 400681, Col 4)
iXY
// @from(Ln 400681, Col 9)
rXY
// @from(Ln 400682, Col 4)
BD = L(() => {
    p7();
    y8();
    K8();
    Q8();
    m8();
    Q4();
    pK();
    e8();
    PX();
    zY();
    iXY = C6(() => y.strictObject({
        operation: y.enum(["spawnTeam", "cleanup"]).describe("Operation: spawnTeam to create a team, cleanup to remove team and task directories."),
        agent_type: y.string().optional().describe('Type/role of the team lead (e.g., "researcher", "test-runner"). Used for team file and inter-agent coordination.'),
        team_name: y.string().optional().describe("Name for the new team to create (required for spawnTeam)."),
        description: y.string().optional().describe("Team description/purpose (only used with spawnTeam).")
    }));
    rXY = {
        realpath: !1,
        retries: {
            retries: 10,
            minTimeout: 5,
            maxTimeout: 100
        }
    }
})
// @from(Ln 400722, Col 0)
async function YMY(q, K, _, z, Y, A, O) {
    let w = vO(K.options.mainLoopModel);
    if (S6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || S6(process.env.CLAUDE_CODE_SIMPLE)) return Xc8(z, w);
    let $ = F5(),
        j = setTimeout((G) => G.abort(), 1000, $),
        H = {
            ...K,
            abortController: $
        },
        J = !K.agentId,
        X = q ? [mA("at_mentioned_files", () => NMY(q, H)), mA("mcp_resources", () => yMY(q, H)), mA("agent_mentions", () => Promise.resolve(EMY(q, K.options.agentDefinitions.activeAgents))), ...[]] : [],
        M = await Promise.all(X),
        P = [mA("queued_commands", () => Xc8(z, w)), mA("date_change", () => Promise.resolve(DMY(Y))), mA("ultrathink_effort", () => Promise.resolve(ZMY(q))), mA("deferred_tools_delta", () => Promise.resolve(MR6(K.options.tools, K.options.mainLoopModel, Y, {
            callSite: J ? "attachments_main" : "attachments_subagent",
            querySource: A
        }))), mA("agent_listing_delta", () => Promise.resolve(PR6(K, Y))), mA("mcp_instructions_delta", () => Promise.resolve(WR6(K.options.mcpClients, K.options.tools, K.options.mainLoopModel, Y))), mA("changed_files", () => LMY(H)), mA("nested_memory", () => hMY(H)), mA("dynamic_skill", () => xMY(H)), mA("skill_listing", () => uMY(H)), mA("plan_mode", () => HMY(q, Y, K, O)), mA("plan_mode_exit", () => JMY(K)), mA("auto_mode", () => PMY(Y, K)), mA("auto_mode_exit", () => WMY(K)), mA("todo_reminders", () => kJ() ? lMY(Y, K) : dMY(Y, K)), ...z4() ? [...A === "session_memory" ? [] : [mA("teammate_mailbox", async () => rMY(K))], mA("team_context", async () => oMY(Y ?? []))] : [], mA("agent_pending_messages", async () => OMY(K)), mA("critical_system_reminder", () => Promise.resolve(fMY(K)))],
        W = J ? [mA("ide_selection", async () => vMY(_, K)), mA("ide_opened_file", async () => kMY(_, K)), mA("output_style", async () => Promise.resolve(GMY())), mA("diagnostics", async () => FMY(K)), mA("lsp_diagnostics", async () => gMY(K)), mA("unified_tasks", async () => nMY(K)), mA("async_hook_responses", async () => iMY()), mA("token_usage", async () => Promise.resolve(aMY(Y ?? [], K.options.mainLoopModel, K.getAppState().autoCompactWindow))), mA("budget_usd", async () => Promise.resolve(tMY(K.options.maxBudgetUsd))), mA("output_token_usage", async () => Promise.resolve(sMY())), mA("verify_plan_reminder", async () => qPY(Y, K))] : [],
        [D, Z] = await Promise.all([Promise.all(P), Promise.all(W)]);
    return clearTimeout(j), [...M.flat(), ...D.flat(), ...Z.flat()].filter((G) => G !== void 0 && G !== null)
}
// @from(Ln 400742, Col 0)
async function mA(q, K) {
    let _ = Date.now();
    try {
        let z = await K(),
            Y = Date.now() - _;
        if (Math.random() < 0.05) {
            let A = z.filter((O) => O !== void 0 && O !== null).reduce((O, w) => {
                return O + I6(w).length
            }, 0);
            d("tengu_attachment_compute_duration", {
                label: q,
                duration_ms: Y,
                attachment_size_bytes: A,
                attachment_count: z.length
            })
        }
        return z
    } catch (z) {
        let Y = Date.now() - _;
        if (Math.random() < 0.05) d("tengu_attachment_compute_duration", {
            label: q,
            duration_ms: Y,
            error: !0
        });
        return j6(z), Kh(`Attachment error in ${q}`, z), []
    }
}
// @from(Ln 400769, Col 0)
async function Xc8(q, K) {
    if (!q) return [];
    let _ = q.filter((z) => AMY.has(z.mode));
    return Promise.all(_.map(async (z) => {
        let Y = await wMY(z.pastedContents, K),
            A = z.value;
        if (Y.length > 0) A = [{
            type: "text",
            text: typeof z.value === "string" ? z.value : s5(z.value, `
`)
        }, ...Y];
        return {
            type: "queued_command",
            prompt: A,
            source_uuid: z.uuid,
            imagePasteIds: wS4(z.pastedContents),
            fileAttachments: z.fileAttachments,
            commandMode: z.mode,
            origin: z.origin,
            isMeta: z.isMeta
        }
    }))
}
// @from(Ln 400793, Col 0)
function OMY(q) {
    let K = q.agentId;
    if (!K) return [];
    return QNK(K, q.taskRegistry).map((z) => ({
        type: "queued_command",
        prompt: z,
        origin: {
            kind: "coordinator"
        },
        isMeta: !0
    }))
}
// @from(Ln 400805, Col 0)
async function wMY(q, K) {
    if (!q) return [];
    let _ = Object.values(q).filter(dH6);
    if (_.length === 0) return [];
    return await Promise.all(_.map(async (Y) => {
        let {
            block: A
        } = await sE({
            data: Y.content,
            mediaType: Y.mediaType,
            limits: K
        });
        return A
    }))
}
// @from(Ln 400821, Col 0)
function $MY(q) {
    let K = 0,
        _ = !1;
    for (let z = q.length - 1; z >= 0; z--) {
        let Y = q[z];
        if (Y?.type === "user" && !Y.isMeta && !gNK(Y.message.content)) K++;
        else if (Y?.type === "attachment" && (Y.attachment.type === "plan_mode" || Y.attachment.type === "plan_mode_reentry")) {
            _ = !0;
            break
        }
    }
    return {
        turnCount: K,
        foundPlanModeAttachment: _
    }
}
// @from(Ln 400838, Col 0)
function jMY(q) {
    let K = 0;
    for (let _ = q.length - 1; _ >= 0; _--) {
        let z = q[_];
        if (z?.type === "attachment") {
            if (z.attachment.type === "plan_mode_exit") break;
            if (z.attachment.type === "plan_mode") K++
        }
    }
    return K
}
// @from(Ln 400849, Col 0)
async function HMY(q, K, _, z) {
    if (_.getAppState().toolPermissionContext.mode !== "plan") return [];
    if (K && K.length > 0) {
        let {
            turnCount: J,
            foundPlanModeAttachment: X
        } = $MY(K);
        if (X && J < bNK.TURNS_BETWEEN_ATTACHMENTS) return []
    }
    g56(I8(), z?.planSlugSeed ?? q ?? void 0);
    let O = eW(_.agentId),
        w = lP(_.agentId),
        $ = [];
    if (_p6() && w !== null) $.push({
        type: "plan_mode_reentry",
        planFilePath: O
    }), iL(!1);
    let H = (jMY(K ?? []) + 1) % bNK.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
    return $.push({
        type: "plan_mode",
        reminderType: H,
        isSubAgent: !!_.agentId,
        planFilePath: O,
        planExists: w !== null
    }), $
}
// @from(Ln 400875, Col 0)
async function JMY(q) {
    if (!x81()) return [];
    if (q.getAppState().toolPermissionContext.mode === "plan") return Km(!1), [];
    Km(!1);
    let _ = eW(q.agentId),
        z = lP(q.agentId) !== null;
    return [{
        type: "plan_mode_exit",
        planFilePath: _,
        planExists: z
    }]
}
// @from(Ln 400888, Col 0)
function XMY(q) {
    let K = 0,
        _ = !1;
    for (let z = q.length - 1; z >= 0; z--) {
        let Y = q[z];
        if (Y?.type === "user" && !Y.isMeta && !gNK(Y.message.content)) K++;
        else if (Y?.type === "attachment" && Y.attachment.type === "auto_mode") {
            _ = !0;
            break
        } else if (Y?.type === "attachment" && Y.attachment.type === "auto_mode_exit") break
    }
    return {
        turnCount: K,
        foundAutoModeAttachment: _
    }
}
// @from(Ln 400905, Col 0)
function MMY(q) {
    let K = 0;
    for (let _ = q.length - 1; _ >= 0; _--) {
        let z = q[_];
        if (z?.type === "attachment") {
            if (z.attachment.type === "auto_mode_exit") break;
            if (z.attachment.type === "auto_mode") K++
        }
    }
    return K
}
// @from(Ln 400916, Col 0)
async function PMY(q, K) {
    let z = K.getAppState().toolPermissionContext,
        Y = z.mode === "auto",
        A = z.mode === "plan" && (pNK?.isAutoModeActive() ?? !1);
    if (!Y && !A) return [];
    if (q && q.length > 0) {
        let {
            turnCount: $,
            foundAutoModeAttachment: j
        } = XMY(q);
        if (j && $ < INK.TURNS_BETWEEN_ATTACHMENTS) return []
    }
    return [{
        type: "auto_mode",
        reminderType: (MMY(q ?? []) + 1) % INK.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse"
    }]
}
// @from(Ln 400933, Col 0)
async function WMY(q) {
    if (!u81()) return [];
    if (q.getAppState().toolPermissionContext.mode === "auto" || (pNK?.isAutoModeActive() ?? !1)) return sG(!1), [];
    return sG(!1), [{
        type: "auto_mode_exit"
    }]
}
// @from(Ln 400941, Col 0)
function DMY(q) {
    let K = LK6(),
        _ = n81();
    if (_ === null) return SD6(K), [];
    if (K === _) return [];
    return SD6(K), [{
        type: "date_change",
        newDate: K
    }]
}
// @from(Ln 400952, Col 0)
function ZMY(q) {
    if (!Ps() || !q || !VM4(q)) return [];
    return d("tengu_ultrathink", {}), [{
        type: "ultrathink_effort",
        level: "high"
    }]
}
// @from(Ln 400960, Col 0)
function MR6(q, K, _, z) {
    if (!GS()) return [];
    if (!k38(K)) return [];
    if (!BM6(q)) return [];
    let Y = g97(q, _ ?? [], z);
    if (!Y) return [];
    return [{
        type: "deferred_tools_delta",
        ...Y
    }]
}
// @from(Ln 400972, Col 0)
function PR6(q, K) {
    if (!on1()) return [];
    if (!q.options.tools.some((J) => e3(J, T4))) return [];
    let {
        activeAgents: _,
        allowedAgentTypes: z
    } = q.options.agentDefinitions, Y = new Set;
    for (let J of q.options.tools) {
        let X = iH6(J);
        if (X) Y.add(X)
    }
    let A = q.getAppState().toolPermissionContext,
        O = QK8(V88(_, [...Y]), A, T4);
    if (z) O = O.filter((J) => z.includes(J.agentType));
    let w = new Set;
    for (let J of K ?? []) {
        if (J.type !== "attachment") continue;
        if (J.attachment.type !== "agent_listing_delta") continue;
        for (let X of J.attachment.addedTypes) w.add(X);
        for (let X of J.attachment.removedTypes) w.delete(X)
    }
    let $ = new Set(O.map((J) => J.agentType)),
        j = O.filter((J) => !w.has(J.agentType)),
        H = [];
    for (let J of w)
        if (!$.has(J)) H.push(J);
    if (j.length === 0 && H.length === 0) return [];
    return j.sort((J, X) => J.agentType.localeCompare(X.agentType)), H.sort(), [{
        type: "agent_listing_delta",
        addedTypes: j.map((J) => J.agentType),
        addedLines: j.map(rn1),
        removedTypes: H,
        isInitial: w.size === 0,
        showConcurrencyNote: MK() !== "pro" && !an1()
    }]
}
// @from(Ln 401009, Col 0)
function WR6(q, K, _, z) {
    let Y = [];
    if (GS() && k38(_) && BM6(K)) Y.push({
        serverName: Ex,
        block: OC4
    });
    Y.push({
        serverName: QE,
        block: $C4
    });
    let A = oS4(q, z ?? [], Y);
    if (!A) return [];
    return [{
        type: "mcp_instructions_delta",
        ...A
    }]
}
// @from(Ln 401027, Col 0)
function fMY(q) {
    let K = q.criticalSystemReminder_EXPERIMENTAL;
    if (!K) return [];
    return [{
        type: "critical_system_reminder",
        content: K
    }]
}
// @from(Ln 401036, Col 0)
function GMY() {
    let K = y7()?.outputStyle || "default";
    if (K === "default") return [];
    return [{
        type: "output_style",
        style: K
    }]
}
// @from(Ln 401044, Col 0)
async function vMY(q, K) {
    let _ = ob8(K.options.mcpClients);
    if (!_ || q?.lineStart === void 0 || !q.text || !q.filePath) return [];
    let z = K.getAppState();
    if (NI6(q.filePath, z.toolPermissionContext)) return [];
    return [{
        type: "selected_lines_in_ide",
        ideName: _,
        lineStart: q.lineStart,
        lineEnd: q.lineStart + q.lineCount - 1,
        filename: q.filePath,
        content: q.text,
        displayPath: Ne(b8(), q.filePath)
    }]
}
// @from(Ln 401060, Col 0)
function TMY(q, K) {
    let _ = I97(BNK(q)),
        z = [],
        Y = _;
    while (Y !== K && Y !== jc8(Y).root) {
        if (Y.startsWith(K)) z.push(Y);
        Y = I97(Y)
    }
    z.reverse();
    let A = [];
    Y = K;
    while (Y !== jc8(Y).root) A.push(Y), Y = I97(Y);
    return A.reverse(), {
        nestedDirs: z,
        cwdLevelDirs: A
    }
}
// @from(Ln 401078, Col 0)
function VMY(q) {
    return q === "User" || q === "Project" || q === "Local" || q === "Managed"
}
// @from(Ln 401082, Col 0)
function u97(q, K, _) {
    let z = [],
        Y = de6();
    for (let A of q) {
        if (K.loadedNestedMemoryPaths?.has(A.path)) continue;
        if (!K.readFileState.has(A.path)) {
            if (z.push({
                    type: "nested_memory",
                    path: A.path,
                    content: A,
                    displayPath: Ne(b8(), A.path)
                }), K.loadedNestedMemoryPaths?.add(A.path), K.readFileState.set(A.path, {
                    content: A.contentDiffersFromDisk ? A.rawContent ?? A.content : A.content,
                    timestamp: Date.now(),
                    offset: void 0,
                    limit: void 0,
                    isPartialView: A.contentDiffersFromDisk,
                    keepContent: !0
                }), Y && VMY(A.type)) {
                let O = A.globs ? "path_glob_match" : A.parent ? "include" : "nested_traversal";
                aj6(A.path, A.type, O, {
                    globs: A.globs,
                    triggerFilePath: _,
                    parentFilePath: A.parent
                })
            }
        }
    }
    return z
}
// @from(Ln 401112, Col 0)
async function FNK(q, K, _) {
    let z = [];
    try {
        if (!Tk(q, _.toolPermissionContext)) return z;
        let Y = new Set,
            A = Y7(),
            O = await oU1(q, Y);
        z.push(...u97(O, K, q));
        let {
            nestedDirs: w,
            cwdLevelDirs: $
        } = TMY(q, A), j = u8("tengu_paper_halyard", !1);
        for (let H of w) {
            let J = (await aU1(H, q, Y)).filter((X) => !j || X.type !== "Project" && X.type !== "Local");
            z.push(...u97(J, K, q))
        }
        for (let H of $) {
            let J = (await sU1(H, q, Y)).filter((X) => !j || X.type !== "Project" && X.type !== "Local");
            z.push(...u97(J, K, q))
        }
    } catch (Y) {
        j6(Y)
    }
    return z
}
// @from(Ln 401137, Col 0)
async function kMY(q, K) {
    if (!q?.filePath || q.text) return [];
    let _ = K.getAppState();
    if (NI6(q.filePath, _.toolPermissionContext)) return [];
    return [...await FNK(q.filePath, K, _), {
        type: "opened_file_in_ide",
        filename: q.filePath
    }]
}
// @from(Ln 401146, Col 0)
async function NMY(q, K) {
    let _ = mMY(q);
    if (_.length === 0) return [];
    let z = K.getAppState();
    return (await Promise.all(_.map(async (A) => {
        try {
            let {
                filename: O,
                lineStart: w,
                lineEnd: $
            } = pMY(A), j = Wq(O);
            if (NI6(j, z.toolPermissionContext)) return null;
            try {
                if ((await mNK(j)).isDirectory()) try {
                    let J = await uNK(j, {
                            withFileTypes: !0
                        }),
                        X = 1000,
                        M = J.length > 1000,
                        P = J.slice(0, 1000).map((D) => D.name);
                    if (M) P.push(`… and ${J.length-1000} more entries`);
                    let W = P.join(`
`);
                    return d("tengu_at_mention_extracting_directory_success", {}), {
                        type: "directory",
                        path: j,
                        content: W,
                        displayPath: Ne(b8(), j)
                    }
                } catch {
                    return null
                }
            } catch {}
            return await p97(j, K, "tengu_at_mention_extracting_filename_success", "tengu_at_mention_extracting_filename_error", "at-mention", {
                offset: w,
                limit: $ && w ? $ - w + 1 : void 0
            })
        } catch {
            d("tengu_at_mention_extracting_filename_error", {})
        }
    }))).filter(Boolean)
}
// @from(Ln 401189, Col 0)
function EMY(q, K) {
    let _ = UNK(q);
    if (_.length === 0) return [];
    return _.map((Y) => {
        let A = Y.replace("agent-", ""),
            O = K.find((w) => w.agentType === A);
        if (!O) return d("tengu_at_mention_agent_not_found", {}), null;
        return d("tengu_at_mention_agent_success", {}), {
            type: "agent_mention",
            agentType: O.agentType
        }
    }).filter((Y) => Y !== null)
}
// @from(Ln 401202, Col 0)
async function yMY(q, K) {
    let _ = BMY(q);
    if (_.length === 0) return [];
    let z = K.options.mcpClients || [];
    return (await Promise.all(_.map(async (A) => {
        try {
            let [O, ...w] = A.split(":"), $ = w.join(":");
            if (!O || !$) return d("tengu_at_mention_mcp_resource_error", {}), null;
            let j = z.find((X) => X.name === O);
            if (!j || j.type !== "connected") return d("tengu_at_mention_mcp_resource_error", {}), null;
            let J = (K.options.mcpResources?.[O] || []).find((X) => X.uri === $);
            if (!J) return d("tengu_at_mention_mcp_resource_error", {}), null;
            try {
                let X = await j.client.readResource({
                    uri: $
                });
                return d("tengu_at_mention_mcp_resource_success", {}), {
                    type: "mcp_resource",
                    server: O,
                    uri: $,
                    name: J.name || $,
                    description: J.description,
                    content: X
                }
            } catch (X) {
                return d("tengu_at_mention_mcp_resource_error", {}), j6(X), null
            }
        } catch {
            return d("tengu_at_mention_mcp_resource_error", {}), null
        }
    }))).filter((A) => A !== null)
}
// @from(Ln 401234, Col 0)
async function LMY(q) {
    let K = gK6(q.readFileState);
    if (K.length === 0) return [];
    let _ = q.getAppState();
    return (await Promise.all(K.map(async (Y) => {
        let A = q.readFileState.get(Y);
        if (!A) return null;
        if (A.offset !== void 0 || A.limit !== void 0) return null;
        let O = Wq(Y);
        if (NI6(O, _.toolPermissionContext)) return null;
        try {
            if (await RA6(O) <= A.timestamp) return null;
            let $ = {
                file_path: O
            };
            if (!(await Kz.validateInput($, q)).result) return null;
            let H = await Kz.call($, q);
            if (H.data.type === "text") {
                if (Ac(A, H.data.file.content)) return null;
                let J = hS4(A.content, H.data.file.content);
                if (J === "") return null;
                return {
                    type: "edited_text_file",
                    filename: O,
                    snippet: J
                }
            }
            if (H.data.type === "image") try {
                let J = await F97(O, void 0, void 0, vO(q.options.mainLoopModel));
                return {
                    type: "edited_image_file",
                    filename: O,
                    content: J
                }
            } catch (J) {
                return j6(J), d("tengu_watched_file_compression_failed", {
                    file: O
                }), null
            }
            return null
        } catch (w) {
            if (t1(w)) q.readFileState.delete(Y);
            return null
        }
    }))).filter((Y) => Y != null)
}
// @from(Ln 401280, Col 0)
async function hMY(q) {
    if (!q.nestedMemoryAttachmentTriggers || q.nestedMemoryAttachmentTriggers.size === 0) return [];
    let K = q.getAppState(),
        _ = [];
    for (let z of q.nestedMemoryAttachmentTriggers) {
        let Y = await FNK(z, q, K);
        _.push(...Y)
    }
    return q.nestedMemoryAttachmentTriggers.clear(), _
}
// @from(Ln 401290, Col 0)
async function RMY(q, K, _, z, Y, A) {
    let O = UNK(q).flatMap((J) => {
            let X = J.replace("agent-", ""),
                M = K.find((P) => P.agentType === X);
            return M?.memory ? [Jh6(X, M.memory)] : []
        }),
        w = O.length > 0 ? O : [Nw()];
    if (wH()) {
        let X = (await Promise.all(w.map((M) => mC4(q, M, _, Y).catch(() => null)))).map((M, P) => {
            if (M === null) return null;
            let W = w[P];
            for (let G of M.citedMemories) MR8(qMY(W, G));
            let D = M.citedMemories.join(", "),
                Z = D ? `${M.synthesis}

Sources: ${D}` : M.synthesis;
            return {
                path: `<synthesis:${W}>`,
                content: Z,
                mtimeMs: Date.now(),
                header: "Recalled from your persistent memory system:"
            }
        }).filter((M) => M !== null);
        if (X.length === 0) return [];
        return [{
            type: "relevant_memories",
            memories: X
        }]
    }
    let j = (await Promise.all(w.map((J) => uC4(q, J, _, Y, A).catch(() => [])))).flat().filter((J) => !z.has(J.path) && !A.has(J.path)).slice(0, 5),
        H = await CMY(j, Y);
    if (H.length === 0) return [];
    return [{
        type: "relevant_memories",
        memories: H
    }]
}
// @from(Ln 401328, Col 0)
function SMY(q) {
    let K = new Set,
        _ = 0;
    for (let z of q)
        if (z.type === "attachment" && z.attachment.type === "relevant_memories")
            for (let Y of z.attachment.memories) K.add(Y.path), _ += Y.content.length;
    return {
        paths: K,
        totalBytes: _
    }
}
// @from(Ln 401339, Col 0)
async function CMY(q, K) {
    return (await Promise.all(q.map(async ({
        path: z,
        mtimeMs: Y
    }) => {
        try {
            let A = await m56(z, 0, x97, xNK, K, {
                    truncateOnByteLimit: !0
                }),
                O = A.totalLines > x97 || A.truncatedByBytes,
                w = O ? A.content + `

> This memory file was truncated (${A.truncatedByBytes?`${xNK} byte limit`:`first ${x97} lines`}). Use the ${xq} tool to view the complete file at: ${z}` : A.content;
            return {
                path: z,
                content: w,
                mtimeMs: Y,
                header: B97(z, Y),
                limit: O ? A.lineCount : void 0
            }
        } catch {
            return null
        }
    }))).filter((z) => z !== null)
}
// @from(Ln 401365, Col 0)
function B97(q, K) {
    let _ = $Q1(K);
    return _ ? `${_}

Memory: ${q}:` : `Memory: ${q}:`
}
// @from(Ln 401372, Col 0)
function ikK(q, K, _) {
    let z = K.memorySelector;
    if (!z || K.agentId || !x3() || !u8("tengu_moth_copse", !1) || bMY.has(_)) return;
    let Y = q.findLast((J) => J.type === "user" && !J.isMeta);
    if (!Y) return;
    let A = it(Y);
    if (!A || !/\s/.test(A.trim())) return;
    let O = SMY(q);
    if (O.totalBytes >= _MY.MAX_SESSION_BYTES) return;
    let w = tv(K.abortController),
        $ = Date.now(),
        j = RMY(A, K.options.agentDefinitions.activeAgents, z, K.readFileState, w.signal, O.paths).catch((J) => {
            if (!uw8(J)) j6(J);
            return []
        }),
        H = {
            promise: j,
            settledAt: null,
            consumedOnIteration: -1,
            [Symbol.dispose]() {
                w.abort();
                let J = z.lastUsage;
                d("tengu_memdir_prefetch_collected", {
                    hidden_by_first_iteration: H.settledAt !== null && H.consumedOnIteration === 0,
                    consumed_on_iteration: H.consumedOnIteration,
                    latency_ms: (H.settledAt ?? Date.now()) - $,
                    cache_read_input_tokens: J?.cacheReadInputTokens,
                    cache_creation_input_tokens: J?.cacheCreationInputTokens,
                    selector_turn_count: J?.turnCount
                })
            }
        };
    return j.finally(() => {
        H.settledAt = Date.now()
    }), H
}
// @from(Ln 401409, Col 0)
function IMY(q) {
    return typeof q === "object" && q !== null && q.type === "tool_result" && typeof q.tool_use_id === "string"
}
// @from(Ln 401413, Col 0)
function gNK(q) {
    return Array.isArray(q) && q.some(IMY)
}
// @from(Ln 401417, Col 0)
function rkK(q, K) {
    return q.map((_) => {
        if (_.type !== "relevant_memories") return _;
        let z = _.memories.filter((Y) => !K.has(Y.path));
        for (let Y of z) K.set(Y.path, {
            content: Y.content,
            timestamp: Y.mtimeMs,
            offset: void 0,
            limit: Y.limit
        });
        return z.length > 0 ? {
            ..._,
            memories: z
        } : null
    }).filter((_) => _ !== null)
}
// @from(Ln 401433, Col 0)
async function xMY(q) {
    let K = [];
    if (q.dynamicSkillDirTriggers && q.dynamicSkillDirTriggers.size > 0) {
        let _ = await Promise.all(Array.from(q.dynamicSkillDirTriggers).map(async (z) => {
            try {
                let A = (await uNK(z, {
                        withFileTypes: !0
                    })).filter((w) => w.isDirectory() || w.isSymbolicLink()).map((w) => w.name),
                    O = await Promise.all(A.map(async (w) => {
                        try {
                            return await mNK(BNK(z, w, "SKILL.md")), w
                        } catch {
                            return null
                        }
                    }));
                return {
                    skillDir: z,
                    skillNames: O.filter((w) => w !== null)
                }
            } catch {
                return {
                    skillDir: z,
                    skillNames: []
                }
            }
        }));
        for (let {
                skillDir: z,
                skillNames: Y
            }
            of _)
            if (Y.length > 0) K.push({
                type: "dynamic_skill",
                skillDir: z,
                skillNames: Y,
                displayPath: Ne(b8(), z)
            });
        q.dynamicSkillDirTriggers.clear()
    }
    return K
}
// @from(Ln 401475, Col 0)
function EI6() {
    m97.clear(), Mc8 = !1
}
// @from(Ln 401479, Col 0)
function $wK() {
    Mc8 = !0
}
// @from(Ln 401482, Col 0)
async function uMY(q) {
    if (!q.options.tools.some((J) => e3(J, VH))) return [];
    let K = c9(),
        _ = await Ty(K),
        z = dNK(q.getAppState().mcp.commands),
        Y = z.length > 0 ? j2([..._, ...z], "name") : _,
        A = q.agentId ?? "",
        O = m97.get(A);
    if (!O) O = new Set, m97.set(A, O);
    if (Mc8) {
        Mc8 = !1;
        for (let J of Y) O.add(J.name);
        return []
    }
    let w = Y.filter((J) => !O.has(J.name));
    if (w.length === 0) return [];
    let $ = O.size === 0;
    for (let J of w) O.add(J.name);
    E(`Sending ${w.length} skills via attachment (${$?"initial":"dynamic"}, ${O.size} total sent)`);
    let j = ff(q.options.mainLoopModel, eM());
    return [{
        type: "skill_listing",
        content: el1(w, j, (J) => l88(J.name)),
        skillCount: w.length,
        isInitial: $
    }]
}
// @from(Ln 401510, Col 0)
function mMY(q) {
    let K = /(^|[\s。、？！])@"([^"]+)"/g,
        _ = /(^|[\s。、？！])@([^\s]+)\b/g,
        z = [],
        Y = [],
        A;
    while ((A = K.exec(q)) !== null)
        if (A[2] && !A[2].endsWith(" (agent)")) z.push(A[2]);
    return (q.match(_) || []).forEach((w) => {
        let $ = w.slice(w.indexOf("@") + 1);
        if (!$.startsWith('"')) Y.push($)
    }), F4([...z, ...Y])
}
// @from(Ln 401524, Col 0)
function BMY(q) {
    let K = /(^|[\s。、？！])@([^\s]+:[^\s]+)\b/g,
        _ = q.match(K) || [];
    return F4(_.map((z) => z.slice(z.indexOf("@") + 1)))
}
// @from(Ln 401530, Col 0)
function UNK(q) {
    let K = [],
        _ = /(^|[\s。、？！])@"([\w:.@-]+) \(agent\)"/g,
        z;
    while ((z = _.exec(q)) !== null)
        if (z[2]) K.push(z[2]);
    let Y = /(^|[\s。、？！])@(agent-[\w:.@-]+)/g,
        A = q.match(Y) || [];
    for (let O of A) K.push(O.slice(O.indexOf("@") + 1));
    return F4(K)
}
// @from(Ln 401542, Col 0)
function pMY(q) {
    let K = q.match(/^([^#]+)(?:#L(\d+)(?:-(\d+))?)?(?:#[^#]*)?$/);
    if (!K) return {
        filename: q
    };
    let [, _, z, Y] = K, A = z ? parseInt(z, 10) : void 0, O = Y ? parseInt(Y, 10) : A;
    return {
        filename: _ ?? q,
        lineStart: A,
        lineEnd: O
    }
}
// @from(Ln 401554, Col 0)
async function FMY(q) {
    if (!q.options.tools.some((_) => e3(_, S7))) return [];
    let K = await we.getNewDiagnostics();
    if (K.length === 0) return [];
    return [{
        type: "diagnostics",
        files: K,
        isNew: !0
    }]
}
// @from(Ln 401564, Col 0)
async function gMY(q) {
    if (!q.options.tools.some((K) => e3(K, S7))) return [];
    E("LSP Diagnostics: getLSPDiagnosticAttachments called");
    try {
        let K = EC4();
        if (K.length === 0) return [];
        E(`LSP Diagnostics: Found ${K.length} pending diagnostic set(s)`);
        let _ = K.map(({
            files: z
        }) => ({
            type: "diagnostics",
            files: z,
            isNew: !0
        }));
        if (K.length > 0) yC4(), E(`LSP Diagnostics: Cleared ${K.length} delivered diagnostic(s) from registry`);
        return E(`LSP Diagnostics: Returning ${_.length} diagnostic attachment(s)`), _
    } catch (K) {
        let _ = r1(K);
        return j6(Error(`Failed to get LSP diagnostic attachments: ${_.message}`)), []
    }
}
// @from(Ln 401585, Col 0)
async function* Ob6(q, K, _, z, Y, A, O) {
    let w = await YMY(q, K, _, z, Y, A, O);
    if (w.length === 0) return;
    d("tengu_attachments", {
        attachment_types: w.map(($) => $.type)
    });
    for (let $ of w) yield Y4($)
}
// @from(Ln 401593, Col 0)
async function UMY(q) {
    let K = jc8(q).ext.toLowerCase();
    if (!ek6(K)) return null;
    try {
        let [_, z] = await Promise.all([V8().stat(q), yI8(q)]), Y = z ?? Math.ceil(_.size / 102400);
        if (Y > Ty8) return d("tengu_pdf_reference_attachment", {
            pageCount: Y,
            fileSize: _.size,
            hadPdfinfo: z !== null
        }), {
            type: "pdf_reference",
            filename: q,
            pageCount: Y,
            fileSize: _.size,
            displayPath: Ne(b8(), q)
        }
    } catch {}
    return null
}
// @from(Ln 401612, Col 0)
async function p97(q, K, _, z, Y, A) {
    let {
        offset: O,
        limit: w
    } = A ?? {}, $ = K.getAppState();
    if (NI6(q, $.toolPermissionContext)) return null;
    if (Y === "at-mention" && !TJ8(q, as().maxSizeBytes)) {
        let H = jc8(q).ext.toLowerCase();
        if (!ek6(H)) try {
            let J = await V8().stat(q);
            return d("tengu_attachment_file_too_large", {
                size_bytes: J.size,
                mode: Y
            }), null
        } catch {}
    }
    if (Y === "at-mention") {
        let H = await UMY(q);
        if (H) return H
    }
    let j = K.readFileState.get(q);
    if (j && Y === "at-mention") try {
        let H = await RA6(q);
        if (j.timestamp <= H && H === j.timestamp && (j.content !== "" || (j.contentLength ?? 0) === 0)) return d(_, {}), {
            type: "already_read_file",
            filename: q,
            displayPath: Ne(b8(), q),
            content: {
                type: "text",
                file: {
                    filePath: q,
                    content: j.content,
                    numLines: tz(j.content, `
`) + 1,
                    startLine: O ?? 1,
                    totalLines: tz(j.content, `
`) + 1
                }
            }
        }
    } catch {}
    try {
        let H = {
            file_path: q,
            offset: O,
            limit: w
        };
        async function J() {
            if (Y === "compact") return {
                type: "compact_file_reference",
                filename: q,
                displayPath: Ne(b8(), q)
            };
            let M = K.getAppState();
            if (NI6(q, M.toolPermissionContext)) return null;
            try {
                let P = {
                        file_path: q,
                        offset: O ?? 1,
                        limit: Ya6
                    },
                    W = await Kz.call(P, K);
                return d(_, {}), {
                    type: "file",
                    filename: q,
                    content: W.data,
                    truncated: !0,
                    displayPath: Ne(b8(), q)
                }
            } catch {
                return d(z, {}), null
            }
        }
        if (!(await Kz.validateInput(H, K)).result) return null;
        try {
            let M = await Kz.call(H, K);
            return d(_, {}), {
                type: "file",
                filename: q,
                content: M.data,
                displayPath: Ne(b8(), q)
            }
        } catch (M) {
            if (M instanceof Pc8 || M instanceof E88) return await J();
            throw M
        }
    } catch {
        return d(z, {}), null
    }
}
// @from(Ln 401703, Col 0)
function Y4(q) {
    return {
        attachment: q,
        type: "attachment",
        uuid: KMY(),
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 401712, Col 0)
function QMY(q) {
    let K = -1,
        _ = -1,
        z = 0,
        Y = 0;
    for (let A = q.length - 1; A >= 0; A--) {
        let O = q[A];
        if (O?.type === "assistant") {
            if (U97(O)) continue;
            if (K === -1 && "message" in O && Array.isArray(O.message?.content) && O.message.content.some((w) => w.type === "tool_use" && w.name === "TodoWrite")) K = A;
            if (K === -1) z++;
            if (_ === -1) Y++
        } else if (_ === -1 && O?.type === "attachment" && O.attachment.type === "todo_reminder") _ = A;
        if (K !== -1 && _ !== -1) break
    }
    return {
        turnsSinceLastTodoWrite: z,
        turnsSinceLastReminder: Y
    }
}
// @from(Ln 401732, Col 0)
async function dMY(q, K) {
    if (!K.options.tools.some((Y) => e3(Y, Vy))) return [];
    if (Hc8 && K.options.tools.some((Y) => e3(Y, Hc8))) return [];
    if (!q || q.length === 0) return [];
    let {
        turnsSinceLastTodoWrite: _,
        turnsSinceLastReminder: z
    } = QMY(q);
    if (_ >= Jc8.TURNS_SINCE_WRITE && z >= Jc8.TURNS_BETWEEN_REMINDERS) {
        let Y = K.agentId ?? I8(),
            O = K.getAppState().todos[Y] ?? [];
        return [{
            type: "todo_reminder",
            content: O,
            itemCount: O.length
        }]
    }
    return []
}
// @from(Ln 401752, Col 0)
function cMY(q) {
    let K = -1,
        _ = -1,
        z = 0,
        Y = 0;
    for (let A = q.length - 1; A >= 0; A--) {
        let O = q[A];
        if (O?.type === "assistant") {
            if (U97(O)) continue;
            if (K === -1 && "message" in O && Array.isArray(O.message?.content) && O.message.content.some((w) => w.type === "tool_use" && (w.name === YT || w.name === gk))) K = A;
            if (K === -1) z++;
            if (_ === -1) Y++
        } else if (_ === -1 && O?.type === "attachment" && O.attachment.type === "task_reminder") _ = A;
        if (K !== -1 && _ !== -1) break
    }
    return {
        turnsSinceLastTaskManagement: z,
        turnsSinceLastReminder: Y
    }
}
// @from(Ln 401772, Col 0)
async function lMY(q, K) {
    if (!kJ()) return [];
    if (Hc8 && K.options.tools.some((Y) => e3(Y, Hc8))) return [];
    if (!K.options.tools.some((Y) => e3(Y, gk))) return [];
    if (!q || q.length === 0) return [];
    let {
        turnsSinceLastTaskManagement: _,
        turnsSinceLastReminder: z
    } = cMY(q);
    if (_ >= Jc8.TURNS_SINCE_WRITE && z >= Jc8.TURNS_BETWEEN_REMINDERS) {
        let Y = await Qf(AT());
        return [{
            type: "task_reminder",
            content: Y,
            itemCount: Y.length
        }]
    }
    return []
}
// @from(Ln 401791, Col 0)
async function nMY(q) {
    let {
        attachments: K,
        updatedTaskOffsets: _,
        evictedTaskIds: z
    } = await iS4(q.taskRegistry.all());
    return q.taskRegistry.applyOffsetsAndEvict(_, z), K.map((Y) => ({
        type: "task_status",
        taskId: Y.taskId,
        taskType: Y.taskType,
        status: Y.status,
        description: Y.description,
        deltaSummary: Y.deltaSummary,
        outputFilePath: $A(Y.taskId)
    }))
}
// @from(Ln 401807, Col 0)
async function iMY() {
    let q = await GC4();
    if (q.length === 0) return [];
    E(`Hooks: getAsyncHookResponseAttachments found ${q.length} responses`);
    let K = q.map(({
        processId: _,
        response: z,
        hookName: Y,
        hookEvent: A,
        toolName: O,
        pluginId: w,
        stdout: $,
        stderr: j,
        exitCode: H
    }) => {
        return E(`Hooks: Creating attachment for ${_} (${Y}): ${I6(z)}`), {
            type: "async_hook_response",
            processId: _,
            hookName: Y,
            hookEvent: A,
            toolName: O,
            response: z,
            stdout: $,
            stderr: j,
            exitCode: H
        }
    });
    if (q.length > 0) {
        let _ = q.map((z) => z.processId);
        vC4(_), E(`Hooks: Removed ${_.length} delivered hooks from registry`)
    }
    return E(`Hooks: getAsyncHookResponseAttachments found ${K.length} attachments`), K
}
// @from(Ln 401840, Col 0)
async function rMY(q) {
    if (!z4()) return [];
    return []
}
// @from(Ln 401845, Col 0)
function oMY(q) {
    let K = Z9(),
        _ = mW(),
        z = T_();
    if (!K || !_) return [];
    if (q.some(($) => $.type === "assistant")) return [];
    let A = A7(),
        O = `${A}/teams/${K}/config.json`,
        w = `${A}/tasks/${K}/`;
    return [{
        type: "team_context",
        agentId: _,
        agentName: z || _,
        teamName: K,
        teamConfigPath: O,
        taskListPath: w
    }]
}
// @from(Ln 401864, Col 0)
function aMY(q, K, _) {
    if (!S6(process.env.CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT)) return [];
    let z = Yn(K, _),
        Y = sI(q);
    return [{
        type: "token_usage",
        used: Y,
        total: z,
        remaining: z - Y
    }]
}
// @from(Ln 401876, Col 0)
function sMY() {
    return []
}
// @from(Ln 401880, Col 0)
function tMY(q) {
    if (q === void 0) return [];
    let K = nX(),
        _ = q - K;
    return [{
        type: "budget_usd",
        used: K,
        total: q,
        remaining: _
    }]
}
// @from(Ln 401892, Col 0)
function eMY(q) {
    let K = 0;
    for (let _ = q.length - 1; _ >= 0; _--) {
        let z = q[_];
        if (z && a88(z)) K++;
        if (z?.type === "attachment" && z.attachment.type === "plan_mode_exit") return K
    }
    return 0
}
// @from(Ln 401901, Col 0)
async function qPY(q, K) {
    return []
}
// @from(Ln 401905, Col 0)
function NI6(q, K) {
    return ZJ(q, K, "read", "deny") !== null
}
// @from(Ln 401908, Col 4)
pNK
// @from(Ln 401908, Col 9)
Hc8
// @from(Ln 401908, Col 14)
Jc8
// @from(Ln 401908, Col 19)
bNK
// @from(Ln 401908, Col 24)
INK
// @from(Ln 401908, Col 29)
x97 = 200
// @from(Ln 401909, Col 4)
xNK = 4096
// @from(Ln 401910, Col 4)
_MY
// @from(Ln 401910, Col 9)
zMY
// @from(Ln 401910, Col 14)
AMY
// @from(Ln 401910, Col 19)
bMY
// @from(Ln 401910, Col 24)
m97
// @from(Ln 401910, Col 29)
Mc8 = !1
// @from(Ln 401911, Col 4)
ZM = L(() => {
    C8();
    gq();
    aF();
    Ph6();
    b9();
    Yq();
    PX();
    NJ();
    kj();
    PM();
    n7();
    kh6();
    U8();
    K8();
    m8();
    aX6();
    a1();
    Q56();
    CI();
    Jk();
    CA();
    tI();
    y8();
    $I8();
    Mh6();
    Ih6();
    AJ();
    Rz();
    HI8();
    FP();
    x$();
    m8();
    eK();
    cP();
    sY();
    $I8();
    g$();
    T7();
    Sz();
    bc();
    EH();
    vM();
    y8();
    Ix();
    aS4();
    ip();
    Va();
    TI8();
    uh6();
    K8();
    _7();
    Q8();
    NR();
    kD();
    rR();
    B1();
    K9();
    e8();
    rk8();
    Rj6();
    $i1();
    _s();
    fO();
    BC4();
    Vy6();
    VY();
    pp();
    ZX();
    zY();
    Rv();
    BD();
    PX();
    pNK = (Kn(), B7(Pe)), Hc8 = (vh(), B7(TU)).BRIEF_TOOL_NAME, Jc8 = {
        TURNS_SINCE_WRITE: 10,
        TURNS_BETWEEN_REMINDERS: 10
    }, bNK = {
        TURNS_BETWEEN_ATTACHMENTS: 5,
        FULL_REMINDER_EVERY_N_ATTACHMENTS: 5
    }, INK = {
        TURNS_BETWEEN_ATTACHMENTS: 5,
        FULL_REMINDER_EVERY_N_ATTACHMENTS: 5
    }, _MY = {
        MAX_SESSION_BYTES: 61440
    }, zMY = {
        TURNS_BETWEEN_REMINDERS: 10
    };
    AMY = new Set(["prompt", "task-notification"]);
    bMY = new Set(["extract_memories", "auto_dream", "prompt_suggestion", "speculation", "compact"]);
    m97 = new Map
})
// @from(Ln 402003, Col 0)
function Ee(q, K) {
    let _ = cNK.get(q);
    if (_ !== void 0 && _ === K) return _;
    return cNK.set(q, K), K
}
// @from(Ln 402008, Col 4)
cNK
// @from(Ln 402009, Col 4)
Q97 = L(() => {
    cNK = new Map
})
// @from(Ln 402013, Col 0)
function Wc8() {
    if (E1("policySettings")?.disableSkillShellExecution === !0) return !0;
    return y7().disableSkillShellExecution === !0
}
// @from(Ln 402018, Col 0)
function Dc8(q) {
    let K = q.replace(KPY, lNK);
    if (K.includes("!`")) K = K.replace(_PY, lNK);
    return K
}
// @from(Ln 402023, Col 4)
KPY
// @from(Ln 402023, Col 9)
_PY
// @from(Ln 402023, Col 14)
lNK = "[shell command execution disabled by policy]"
// @from(Ln 402024, Col 4)
d97 = L(() => {
    a1();
    KPY = /```!\s*\n?[\s\S]*?\n?```/g, _PY = /(?<=^|\s)!`[^`]+`/gm
})
// @from(Ln 402034, Col 0)
function c97(q) {
    return /^skill\.md$/i.test(yI6(q))
}
// @from(Ln 402038, Col 0)
function zPY(q, K, _) {
    if (c97(q)) {
        let Y = ye(q),
            A = ye(Y),
            O = yI6(Y),
            w = A.startsWith(K) ? A.slice(K.length).replace(/^[/\\]/, "") : "",
            $ = w ? w.split(/[/\\]/).join(":") : "";
        return $ ? `${_}:${$}:${O}` : `${_}:${O}`
    } else {
        let Y = ye(q),
            A = yI6(q).replace(/\.md$/, ""),
            O = Y.startsWith(K) ? Y.slice(K.length).replace(/^[/\\]/, "") : "",
            w = O ? O.split(/[/\\]/).join(":") : "";
        return w ? `${_}:${w}:${A}` : `${_}:${A}`
    }
}
// @from(Ln 402054, Col 0)
async function YPY(q, K, _) {
    let z = [],
        Y = V8();
    return await Hh6(q, async (A) => {
        if (di(Y, A, _)) return;
        let O = await Y.readFile(A, {
                encoding: "utf-8"
            }),
            {
                frontmatter: w,
                content: $
            } = p2(O, A);
        z.push({
            filePath: A,
            baseDir: K,
            frontmatter: w,
            content: Ee(A, $)
        })
    }, {
        stopAtSkillDir: !0,
        logLabel: "commands"
    }), z
}
// @from(Ln 402078, Col 0)
function APY(q) {
    let K = new Map;
    for (let z of q) {
        let Y = ye(z.filePath),
            A = K.get(Y) ?? [];
        A.push(z), K.set(Y, A)
    }
    let _ = [];
    for (let [z, Y] of K) {
        let A = Y.filter((O) => c97(O.filePath));
        if (A.length > 0) {
            let O = A[0];
            if (A.length > 1) E(`Multiple skill files found in ${z}, using ${yI6(O.filePath)}`);
            _.push(O)
        } else _.push(...Y)
    }
    return _
}
// @from(Ln 402096, Col 0)
async function nNK(q, K, _, z, Y, A = {
    isSkillMode: !1
}, O = new Set) {
    let w = await YPY(q, q, O),
        $ = APY(w),
        j = [];
    for (let H of $) {
        let J = zPY(H.filePath, H.baseDir, K),
            X = N38(J, H, _, z, Y, c97(H.filePath), A);
        if (X) j.push(X)
    }
    return j
}