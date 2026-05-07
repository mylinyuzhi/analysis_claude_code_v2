
// @from(Ln 539106, Col 0)
function Bz5(q) {
    let K = sO();
    if (!K) return;
    if (fa8(null), Lk(), nc(), aO.cache.clear?.(), K.worktreePath === q) return;
    try {
        process.chdir(K.originalCwd)
    } catch {
        return
    }
    l$(K.originalCwd), dL(b8())
}
// @from(Ln 539117, Col 0)
async function uP7(q, K, _) {
    let z;
    if (!K.forkSession) {
        let H = K.sessionIdOverride ?? q.sessionId;
        if (H) SZ(pP(H), K.transcriptPath ? qYA(K.transcriptPath) : null), await kY8(), await Gu(), eb8(H)
    } else if (q.contentReplacements?.length) await dM6(q.contentReplacements);
    if (In(K.forkSession ? {
            ...q,
            worktreeSession: void 0
        } : q), !K.forkSession) LY8(q.worktreeSession), bn();
    let {
        agentDefinition: Y,
        agentType: A
    } = _06(q.agentSetting, _.mainThreadAgentDefinition, _.agentDefinitions), O = zYA(q.permissionMode, _.permissionModeCliSet), w = K.includeAttribution ? _YA(q) : void 0, $ = yY8(q.agentName, q.agentColor);
    NQ(q.agentName);
    let j = await YYA(!!z, _.currentCwd, _.cliAgents, _.agentDefinitions);
    return {
        messages: q.messages,
        fileHistorySnapshots: q.fileHistorySnapshots,
        contentReplacements: q.contentReplacements,
        agentName: q.agentName,
        agentColor: q.agentColor === "default" ? void 0 : q.agentColor,
        restoredAgentDef: Y,
        initialState: {
            ..._.initialState,
            ...A && {
                agent: A
            },
            ...w && {
                attribution: w
            },
            ...$ && {
                standaloneAgentContext: $
            },
            ...O && {
                toolPermissionContext: {
                    ..._.initialState.toolPermissionContext,
                    mode: O
                }
            },
            agentDefinitions: j
        }
    }
}
// @from(Ln 539161, Col 4)
hY8 = L(() => {
    y8();
    OR6();
    Tx();
    cP();
    Cf();
    NY8();
    PM();
    sR();
    wf();
    n7();
    K8();
    cy();
    _7();
    Sq();
    OP();
    NJ();
    $G();
    g4();
    PX();
    uo1();
    tD()
})
// @from(Ln 539185, Col 0)
function mP7(q) {
    try {
        OYA(AYA(q))
    } catch (K) {
        j6(K)
    }
}
// @from(Ln 539193, Col 0)
function AYA(q) {
    let K = [],
        _ = new Map,
        z = new Set;
    for (let Y of q)
        if (Y.type === "assistant") {
            let A = Y.message.content;
            if (!Array.isArray(A)) continue;
            let O = Date.parse(Y.timestamp);
            for (let w of A) {
                if (w.type !== "tool_use") continue;
                let $ = pz5(w.input) ? w.input : {};
                if (w.name === DX) K.push({
                    toolUseId: w.id,
                    input: $,
                    createdAt: O
                });
                else if (w.name === wT) {
                    if (typeof $.id === "string") z.add($.id)
                }
            }
        } else if (Y.type === "user") {
        let A = Y.message.content;
        if (!Array.isArray(A)) continue;
        let O = Y.toolUseResult;
        if (!pz5(O)) continue;
        for (let w of A)
            if (w.type === "tool_result" && !w.is_error) _.set(w.tool_use_id, O)
    }
    return {
        calls: K,
        results: _,
        deletedCronIds: z
    }
}
// @from(Ln 539229, Col 0)
function OYA({
    calls: q,
    results: K,
    deletedCronIds: _
}) {
    if (!uD()) return;
    let z = Date.now(),
        Y = xK6(),
        A = new Set(nL().map((w) => w.id)),
        O = 0;
    for (let w of q) {
        let $ = K.get(w.toolUseId);
        if (!$ || typeof $.id !== "string") continue;
        if ($.durable === !0) continue;
        if (_.has($.id) || A.has($.id)) continue;
        let j = w.input.cron,
            H = w.input.prompt;
        if (typeof j !== "string" || typeof H !== "string") continue;
        let J = $.recurring !== !1;
        if (J) {
            if (Y.recurringMaxAgeMs !== 0 && z - w.createdAt >= Y.recurringMaxAgeMs) continue
        } else {
            let X = QR8(j, w.createdAt, $.id, Y);
            if (X === null || X < z) continue
        }
        DY6({
            id: $.id,
            cron: j,
            prompt: H,
            createdAt: w.createdAt,
            recurring: J
        }), O++
    }
    if (O > 0) Si(!0), E(`resume: resurrected ${O} session cron task(s)`)
}
// @from(Ln 539265, Col 0)
function pz5(q) {
    return typeof q === "object" && q !== null
}
// @from(Ln 539268, Col 4)
Fz5 = L(() => {
    y8();
    QR();
    ve6();
    yp();
    K8();
    U8()
})
// @from(Ln 539280, Col 0)
function Jt8(q) {
    if ($D()) return;
    if (Lz()) return T_();
    if (Sv(q.teamContext)) {
        let K = q.teamContext.leadAgentId;
        return q.teamContext.teammates[K]?.name || "team-lead"
    }
    return
}
// @from(Ln 539290, Col 0)
function Uz5({
    enabled: q,
    isLoading: K,
    focusedInputDialog: _,
    onSubmitMessage: z
}) {
    let Y = z,
        A = H9(),
        O = R7(),
        w = EX(),
        $ = M8((M) => M.inbox.messages.length),
        j = fd(),
        H = z06.useCallback(async () => {
            if (!q) return;
            let M = A.getState(),
                P = Jt8(M);
            if (!P) return;
            let W = await qJ6(P, M.teamContext?.teamName);
            if (W.length === 0) return;
            if (E(`[InboxPoller] Found ${W.length} unread message(s)`), Lz() && Pn6())
                for (let m of W) {
                    let S = ch6(m.text);
                    if (S && m.from === "team-lead")
                        if (E(`[InboxPoller] Received plan approval response from team-lead: approved=${S.approved}`), S.approved) {
                            let F = S.permissionMode ?? "default";
                            O((U) => ({
                                ...U,
                                toolPermissionContext: EY(U.toolPermissionContext, {
                                    type: "setMode",
                                    mode: Sm(F),
                                    destination: "session"
                                })
                            })), E(`[InboxPoller] Plan approved by team lead, exited plan mode to ${F}`)
                        } else E(`[InboxPoller] Plan rejected by team lead: ${S.feedback||"No feedback provided"}`);
                    else if (S) E(`[InboxPoller] Ignoring plan approval response from non-team-lead: ${m.from}`)
                }
            let D = () => {
                    A18(P, M.teamContext?.teamName)
                },
                Z = [],
                G = [],
                f = [],
                v = [],
                V = [],
                k = [],
                N = [],
                R = [],
                h = [],
                C = [];
            for (let m of W) {
                let S = j18(m.text),
                    F = KJ6(m.text),
                    U = hI8(m.text),
                    g = H18(m.text),
                    c = i56(m.text),
                    n = Qk(m.text),
                    l = bI8(m.text),
                    z6 = xI8(m.text),
                    A6 = _J6(m.text);
                if (S) Z.push(m);
                else if (F) G.push(m);
                else if (U) f.push(m);
                else if (g) v.push(m);
                else if (c) V.push(m);
                else if (n) k.push(m);
                else if (l) N.push(m);
                else if (z6) R.push(m);
                else if (A6) h.push(m);
                else C.push(m)
            }
            if (Z.length > 0 && Sv(M.teamContext)) {
                E(`[InboxPoller] Found ${Z.length} permission request(s)`);
                let m = fI6(),
                    S = M.teamContext?.teamName;
                for (let U of Z) {
                    let g = j18(U.text);
                    if (!g) continue;
                    if (m) {
                        let c = rK(_n(), g.tool_name);
                        if (!c) {
                            E(`[InboxPoller] Unknown tool ${g.tool_name}, skipping permission request`);
                            continue
                        }
                        let n = {
                            assistantMessage: yj({
                                content: ""
                            }),
                            tool: c,
                            description: g.description,
                            input: g.input,
                            toolUseContext: {},
                            toolUseID: g.tool_use_id,
                            permissionResult: {
                                behavior: "ask",
                                message: g.description
                            },
                            permissionPromptStartTimeMs: Date.now(),
                            workerBadge: {
                                name: g.agent_id,
                                color: "cyan"
                            },
                            onUserInteraction() {},
                            onAbort() {
                                sI8(g.agent_id, {
                                    decision: "rejected",
                                    resolvedBy: "leader"
                                }, g.request_id, S)
                            },
                            onAllow(l, z6) {
                                sI8(g.agent_id, {
                                    decision: "approved",
                                    resolvedBy: "leader",
                                    updatedInput: l,
                                    permissionUpdates: z6
                                }, g.request_id, S)
                            },
                            onReject(l) {
                                sI8(g.agent_id, {
                                    decision: "rejected",
                                    resolvedBy: "leader",
                                    feedback: l
                                }, g.request_id, S)
                            },
                            async recheckPermission() {}
                        };
                        m((l) => {
                            if (l.some((z6) => z6.toolUseID === g.tool_use_id)) return l;
                            return [...l, n]
                        })
                    } else E(`[InboxPoller] ToolUseConfirmQueue unavailable, dropping permission request from ${g.agent_id}`)
                }
                let F = j18(Z[0]?.text ?? "");
                if (F && !K && !_) Il({
                    message: `${F.agent_id} needs permission for ${F.tool_name}`,
                    notificationType: "worker_permission_prompt"
                }, j)
            }
            if (G.length > 0 && Lz()) {
                E(`[InboxPoller] Found ${G.length} permission response(s)`);
                for (let m of G) {
                    let S = KJ6(m.text);
                    if (!S) continue;
                    if (mb4(S.request_id))
                        if (E(`[InboxPoller] Processing permission response for ${S.request_id}: ${S.subtype}`), S.subtype === "success") eh6({
                            requestId: S.request_id,
                            decision: "approved",
                            updatedInput: S.response?.updated_input,
                            permissionUpdates: S.response?.permission_updates
                        });
                        else eh6({
                            requestId: S.request_id,
                            decision: "rejected",
                            feedback: S.error
                        })
                }
            }
            if (f.length > 0 && Sv(M.teamContext)) {
                E(`[InboxPoller] Found ${f.length} sandbox permission request(s)`);
                let {
                    mode: m,
                    isBypassPermissionsModeAvailable: S
                } = M.toolPermissionContext, F = jX8(m, S), U = M.teamContext?.teamName;
                async function g(n) {
                    switch (F) {
                        case "allow":
                            return !0;
                        case "deny":
                            return !1;
                        case "classify":
                            return Gg8(n, void 0, [], _n(), M.toolPermissionContext, new AbortController().signal);
                        case "ask":
                            return null
                    }
                }
                let c = [];
                for (let n of f) {
                    let l = hI8(n.text);
                    if (!l) continue;
                    if (!l.hostPattern?.host) {
                        E("[InboxPoller] Invalid sandbox permission request: missing hostPattern.host");
                        continue
                    }
                    let z6 = await g(l.hostPattern.host);
                    if (z6 !== null) {
                        E(`[InboxPoller] Auto-resolving sandbox request ${l.requestId} (mode=${m}, allow=${z6})`), tI8(l.workerName, l.requestId, l.hostPattern.host, z6, U);
                        continue
                    }
                    c.push({
                        requestId: l.requestId,
                        workerId: l.workerId,
                        workerName: l.workerName,
                        workerColor: l.workerColor,
                        host: l.hostPattern.host,
                        createdAt: l.createdAt
                    })
                }
                if (c.length > 0) {
                    O((l) => ({
                        ...l,
                        workerSandboxPermissions: {
                            ...l.workerSandboxPermissions,
                            queue: [...l.workerSandboxPermissions.queue, ...c]
                        }
                    }));
                    let n = c[0];
                    if (n && !K && !_) Il({
                        message: `${n.workerName} needs network access to ${n.host}`,
                        notificationType: "worker_permission_prompt"
                    }, j)
                }
            }
            if (v.length > 0 && Lz()) {
                E(`[InboxPoller] Found ${v.length} sandbox permission response(s)`);
                for (let m of v) {
                    let S = H18(m.text);
                    if (!S) continue;
                    if (Fb4(S.requestId)) E(`[InboxPoller] Processing sandbox permission response for ${S.requestId}: allow=${S.allow}`), gb4({
                        requestId: S.requestId,
                        host: S.host,
                        allow: S.allow
                    }), O((F) => ({
                        ...F,
                        pendingSandboxRequest: null
                    }))
                }
            }
            if (N.length > 0 && Lz()) {
                E(`[InboxPoller] Found ${N.length} team permission update(s)`);
                for (let m of N) {
                    let S = bI8(m.text);
                    if (!S) {
                        E(`[InboxPoller] Failed to parse team permission update: ${m.text.substring(0,100)}`);
                        continue
                    }
                    if (!S.permissionUpdate?.rules || !S.permissionUpdate?.behavior) {
                        E("[InboxPoller] Invalid team permission update: missing permissionUpdate.rules or permissionUpdate.behavior");
                        continue
                    }
                    E(`[InboxPoller] Applying team permission update: ${S.toolName} allowed in ${S.directoryPath}`), E(`[InboxPoller] Permission update rules: ${I6(S.permissionUpdate.rules)}`), O((F) => {
                        let U = EY(F.toolPermissionContext, {
                            type: "addRules",
                            rules: S.permissionUpdate.rules,
                            behavior: S.permissionUpdate.behavior,
                            destination: "session"
                        });
                        return E(`[InboxPoller] Updated session allow rules: ${I6(U.alwaysAllowRules.session)}`), {
                            ...F,
                            toolPermissionContext: U
                        }
                    })
                }
            }
            if (R.length > 0 && Lz()) {
                E(`[InboxPoller] Found ${R.length} mode set request(s)`);
                for (let m of R) {
                    if (m.from !== "team-lead") {
                        E(`[InboxPoller] Ignoring mode set request from non-team-lead: ${m.from}`);
                        continue
                    }
                    let S = xI8(m.text);
                    if (!S) {
                        E(`[InboxPoller] Failed to parse mode set request: ${m.text.substring(0,100)}`);
                        continue
                    }
                    let F = yV(S.mode);
                    E(`[InboxPoller] Applying mode change from team-lead: ${F}`), O((c) => ({
                        ...c,
                        toolPermissionContext: EY(c.toolPermissionContext, {
                            type: "setMode",
                            mode: Sm(F),
                            destination: "session"
                        })
                    }));
                    let U = M.teamContext?.teamName,
                        g = T_();
                    if (U && g) kI6(U, g, F)
                }
            }
            if (h.length > 0 && Sv(M.teamContext)) {
                E(`[InboxPoller] Found ${h.length} plan approval request(s), auto-approving`);
                let m = M.teamContext?.teamName,
                    S = Sm(M.toolPermissionContext.mode),
                    F = S === "plan" ? "default" : S;
                for (let U of h) {
                    let g = _J6(U.text);
                    if (!g) continue;
                    let c = {
                        type: "plan_approval_response",
                        requestId: g.requestId,
                        approved: !0,
                        timestamp: new Date().toISOString(),
                        permissionMode: F
                    };
                    F_(U.from, {
                        from: Mz,
                        text: I6(c),
                        timestamp: new Date().toISOString()
                    }, m);
                    let n = Jd8(U.from, M);
                    if (n) MGK(n, {
                        type: "plan_approval_response",
                        requestId: g.requestId,
                        approved: !0,
                        timestamp: new Date().toISOString(),
                        permissionMode: F
                    }, w);
                    E(`[InboxPoller] Auto-approved plan from ${U.from} (request ${g.requestId})`), C.push(U)
                }
            }
            if (V.length > 0 && Lz()) {
                E(`[InboxPoller] Found ${V.length} shutdown request(s)`);
                for (let m of V) C.push(m)
            }
            if (k.length > 0 && Sv(M.teamContext)) {
                E(`[InboxPoller] Found ${k.length} shutdown approval(s)`);
                for (let m of k) {
                    let S = Qk(m.text);
                    if (!S) continue;
                    if (S.paneId && S.backendType)(async () => {
                        try {
                            await TI6();
                            let U = await ap(),
                                c = await dX6(S.backendType)?.killPane(S.paneId, !U);
                            E(`[InboxPoller] Killed pane ${S.paneId} for ${S.from}: ${c}`)
                        } catch (U) {
                            E(`[InboxPoller] Failed to kill pane for ${S.from}: ${U}`)
                        }
                    })();
                    let F = S.from;
                    if (F && M.teamContext?.teammates) {
                        let U = Object.entries(M.teamContext.teammates).find(([, g]) => g.name === F)?.[0];
                        if (U) {
                            let g = M.teamContext?.teamName;
                            if (g) nM6(g, {
                                agentId: U,
                                name: F
                            });
                            let {
                                notificationMessage: c
                            } = g ? await p56(g, U, F, "shutdown") : {
                                notificationMessage: `${F} has shut down.`
                            };
                            O((n) => {
                                if (!n.teamContext?.teammates) return n;
                                if (!(U in n.teamContext.teammates)) return n;
                                let {
                                    [U]: l, ...z6
                                } = n.teamContext.teammates, A6 = {
                                    ...n.tasks
                                };
                                for (let [e, i] of Object.entries(A6))
                                    if (EJ(i) && i.identity.agentId === U) A6[e] = {
                                        ...i,
                                        status: "completed",
                                        endTime: Date.now()
                                    };
                                return {
                                    ...n,
                                    tasks: A6,
                                    teamContext: {
                                        ...n.teamContext,
                                        teammates: z6
                                    },
                                    inbox: {
                                        messages: [...n.inbox.messages, {
                                            id: gz5(),
                                            from: "system",
                                            text: I6({
                                                type: "teammate_terminated",
                                                message: c
                                            }),
                                            timestamp: new Date().toISOString(),
                                            status: "pending"
                                        }]
                                    }
                                }
                            }), E(`[InboxPoller] Removed ${F} (${U}) from teamContext`)
                        }
                    }
                    C.push(m)
                }
            }
            if (C.length === 0) {
                D();
                return
            }
            let x = C.map((m) => {
                    let S = m.color ? ` color="${m.color}"` : "",
                        F = m.summary ? ` summary="${m.summary}"` : "",
                        U = m.text;
                    return `<${oX} teammate_id="${m.from}"${S}${F}>
${U}
</${oX}>`
                }).join(`

`),
                B = () => {
                    O((m) => ({
                        ...m,
                        inbox: {
                            messages: [...m.inbox.messages, ...C.map((S) => ({
                                id: gz5(),
                                from: S.from,
                                text: S.text,
                                timestamp: S.timestamp,
                                status: "pending",
                                color: S.color,
                                summary: S.summary
                            }))]
                        }
                    }))
                };
            if (!K && !_) {
                if (E("[InboxPoller] Session idle, submitting immediately"), !Y(x)) E("[InboxPoller] Submission rejected, queuing for later delivery"), B()
            } else E("[InboxPoller] Session busy, queuing for later delivery"), B();
            D()
        }, [q, K, _, Y, O, j, A, w]);
    z06.useEffect(() => {
        if (!q) return;
        if (K || _) return;
        let M = A.getState();
        if (!Jt8(M)) return;
        let W = M.inbox.messages.filter((f) => f.status === "pending"),
            D = M.inbox.messages.filter((f) => f.status === "processed");
        if (D.length > 0) {
            E(`[InboxPoller] Cleaning up ${D.length} processed message(s) that were delivered mid-turn`);
            let f = new Set(D.map((v) => v.id));
            O((v) => ({
                ...v,
                inbox: {
                    messages: v.inbox.messages.filter((V) => !f.has(V.id))
                }
            }))
        }
        if (W.length === 0) return;
        E(`[InboxPoller] Session idle, delivering ${W.length} pending message(s)`);
        let Z = W.map((f) => {
            let v = f.color ? ` color="${f.color}"` : "",
                V = f.summary ? ` summary="${f.summary}"` : "";
            return `<${oX} teammate_id="${f.from}"${v}${V}>
${f.text}
</${oX}>`
        }).join(`

`);
        if (Y(Z)) {
            let f = new Set(W.map((v) => v.id));
            O((v) => ({
                ...v,
                inbox: {
                    messages: v.inbox.messages.filter((V) => !f.has(V.id))
                }
            }))
        } else E("[InboxPoller] Submission rejected, keeping messages queued")
    }, [q, K, _, Y, O, A]);
    let J = q && !!Jt8(A.getState());
    fD(() => void H(), J ? wYA : null);
    let X = z06.useRef(!1);
    z06.useEffect(() => {
        if (!q) return;
        if (X.current) return;
        if (Jt8(A.getState())) X.current = !0, H()
    }, [q, H, A])
}
// @from(Ln 539754, Col 4)
z06
// @from(Ln 539754, Col 9)
wYA = 1000
// @from(Ln 539755, Col 4)
Qz5 = L(() => {
    wk();
    rA();
    Gd();
    h48();
    N7();
    $S();
    gq();
    $0();
    K8();
    X37();
    _7();
    OP();
    MH();
    cX6();
    e8();
    yx();
    sx();
    ah6();
    BD();
    PX();
    zY();
    Rv();
    ZX();
    qR6();
    z06 = K6(P6(), 1)
})
// @from(Ln 539783, Col 0)
function cz5(q) {
    let K = s(7),
        {
            autoConnectIdeFlag: _,
            ideToInstallExtension: z,
            setDynamicMcpConfig: Y,
            setShowIdeOnboarding: A,
            setIDEInstallationState: O
        } = q,
        w, $;
    if (K[0] !== _ || K[1] !== z || K[2] !== Y || K[3] !== O || K[4] !== A) w = () => {
        let j = function(X) {
                if (!X) return;
                if (!((H8().autoConnectIde || _ || q0() || process.env.CLAUDE_CODE_SSE_PORT || z || S6(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE)) && !c5(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE))) return;
                Y((W) => {
                    if (W?.ide) return W;
                    return {
                        ...W,
                        ide: {
                            type: X.url.startsWith("ws:") ? "ws-ide" : "sse-ide",
                            url: X.url,
                            ideName: X.name,
                            authToken: X.authToken,
                            ideRunningInWindows: X.ideRunningInWindows,
                            scope: "dynamic"
                        }
                    }
                })
            },
            H = F5();
        return YS4(j, z, () => A(!0), (J) => O(J), H.signal), () => {
            H.abort(), aR4()
        }
    }, $ = [_, z, Y, A, O], K[0] = _, K[1] = z, K[2] = Y, K[3] = O, K[4] = A, K[5] = w, K[6] = $;
    else w = K[5], $ = K[6];
    dz5.useEffect(w, $)
}
// @from(Ln 539820, Col 4)
dz5
// @from(Ln 539821, Col 4)
lz5 = L(() => {
    o6();
    x$();
    h1();
    Q8();
    kj();
    dz5 = K6(P6(), 1)
})
// @from(Ln 539830, Col 0)
function iz5(q) {
    let K = s(12),
        {
            onBackgroundSession: _,
            isLoading: z
        } = q,
        Y = R7(),
        A = H9(),
        O = EX(),
        [w, $] = nz5.useState(!1),
        j = wp($, _, jYA),
        H;
    if (K[0] !== A || K[1] !== j || K[2] !== z || K[3] !== Y || K[4] !== O) H = () => {
        if (S6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)) return;
        let V = A.getState();
        if (jY7(V)) {
            if (jg8(O, () => gD(Y)), !H8().hasUsedBackgroundTask) d8($YA)
        } else if (S6("false") && z) j()
    }, K[0] = A, K[1] = j, K[2] = z, K[3] = Y, K[4] = O, K[5] = H;
    else H = K[5];
    let J = H,
        X = M8(jY7),
        M;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) M = S6("false"), K[6] = M;
    else M = K[6];
    let W = X || M && z,
        D;
    if (K[7] !== W) D = {
        context: "Task",
        isActive: W
    }, K[7] = W, K[8] = D;
    else D = K[8];
    G1("task:background", J, D);
    let Z = V3("task:background", "Task", "ctrl+b"),
        G = X7.terminal === "tmux" && Z === "ctrl+b" ? "ctrl+b ctrl+b" : Z;
    if (!z || !w) return null;
    let f;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) f = {
        keyCase: "lower"
    }, K[9] = f;
    else f = K[9];
    let v;
    if (K[10] !== G) v = Y06.createElement(u, {
        paddingLeft: 2
    }, Y06.createElement(T, {
        dimColor: !0
    }, Y06.createElement(A8, {
        chord: G,
        action: "background",
        format: f
    }))), K[10] = G, K[11] = v;
    else v = K[11];
    return v
}
// @from(Ln 539885, Col 0)
function $YA(q) {
    return q.hasUsedBackgroundTask ? q : {
        ...q,
        hasUsedBackgroundTask: !0
    }
}
// @from(Ln 539892, Col 0)
function jYA() {}
// @from(Ln 539893, Col 4)
Y06
// @from(Ln 539893, Col 9)
nz5
// @from(Ln 539894, Col 4)
rz5 = L(() => {
    o6();
    Cs6();
    g6();
    C7();
    RM();
    jt();
    N7();
    $S();
    pl();
    h1();
    D_();
    Q8();
    u7();
    Y06 = K6(P6(), 1), nz5 = K6(P6(), 1)
})
// @from(Ln 539911, Col 0)
function oz5(q, K) {
    if (K.kind === "clear") {
        if (!q.has(K.toolUseId)) return q;
        let Y = new Map(q);
        return Y.delete(K.toolUseId), Y
    }
    let _ = q.get(K.toolUseId);
    if (K.kind === "background_hint" && _?.kind === K.kind) return q;
    let z = new Map(q);
    return z.set(K.toolUseId, K), z
}
// @from(Ln 539930, Col 0)
function az5(q) {
    let K = s(53),
        {
            plan: _,
            sessionId: z,
            taskId: Y,
            setMessages: A,
            readFileState: O,
            memorySelector: w,
            sessionEnvVars: $,
            getAppState: j,
            setConversationId: H,
            resultDedupState: J
        } = q;
    A2("ultraplan-choice");
    let X = R7(),
        M = EX(),
        P;
    if (K[0] !== j || K[1] !== w || K[2] !== _ || K[3] !== O || K[4] !== J || K[5] !== $ || K[6] !== z || K[7] !== X || K[8] !== H || K[9] !== A || K[10] !== Y || K[11] !== M) P = async function(o) {
        q: switch (o) {
            case "here": {
                LY({
                    value: ["Ultraplan approved in browser. Here is the plan:", "", "<ultraplan>", _, "</ultraplan>", "", "The user approved this plan in the remote session. Give them a brief summary, then start implementing."].join(`
`),
                    mode: "task-notification"
                });
                break q
            }
            case "fresh": {
                let _6 = I8(),
                    r = await HYA(bY()).then(GYA, fYA);
                if (await U98({
                        setMessages: A,
                        readFileState: O,
                        memorySelector: w,
                        sessionEnvVars: $,
                        getAppState: j,
                        setAppState: X,
                        setConversationId: H,
                        resultDedupState: J
                    }), r) A((t) => [...t, eO(`Previous session saved · resume with: claude --resume ${_6}`, "suggestion")]);
                Dj({
                    value: `Here is the approved implementation plan:

${_}

Implement this plan.`,
                    mode: "prompt"
                });
                break q
            }
            case "cancel": {
                let _6 = XYA(aO(), `${Bb8()}-ultraplan.md`);
                await JYA(_6, _, {
                    encoding: "utf-8"
                }), A((r) => [...r, eO(`Ultraplan rejected · Plan saved to ${S3(_6)}`, "suggestion")])
            }
        }
        M.update(Y, ZYA),
        X(DYA),
        ak(z)
    }, K[0] = j, K[1] = w, K[2] = _, K[3] = O, K[4] = J, K[5] = $, K[6] = z, K[7] = X, K[8] = H, K[9] = A, K[10] = Y, K[11] = M, K[12] = P;
    else P = K[12];
    let W = P,
        {
            rows: D,
            columns: Z
        } = s1(),
        G = Math.min(MYA, Math.max(1, Math.floor(D / 2) - PYA)),
        f;
    if (K[13] !== Z || K[14] !== _) f = JR(_, Math.max(1, Z - 4), "wrap").split(`
`), K[13] = Z, K[14] = _, K[15] = f;
    else f = K[15];
    let v = f,
        V = Math.max(0, v.length - G),
        [k, N] = Xt8.useState(0),
        R, h;
    if (K[16] !== V) R = () => N((q6) => Math.min(q6, V)), h = [V], K[16] = V, K[17] = R, K[18] = h;
    else R = K[17], h = K[18];
    Xt8.useEffect(R, h);
    let C = v.length > G,
        x;
    if (K[19] !== V || K[20] !== C) x = function(o) {
        if (!C) return;
        N((_6) => Math.max(0, Math.min(_6 + o, V)))
    }, K[19] = V, K[20] = C, K[21] = x;
    else x = K[21];
    let B = x,
        m;
    if (K[22] !== G || K[23] !== B) m = function(o) {
        if (!o.ctrl || o.meta) return;
        let _6 = Math.max(1, Math.floor(G / 2));
        if (o.key === "d") o.preventDefault(), B(_6);
        else if (o.key === "u") o.preventDefault(), B(-_6)
    }, K[22] = G, K[23] = B, K[24] = m;
    else m = K[24];
    let S = m,
        F;
    if (K[25] !== B) F = function(o) {
        o.preventDefault(), B(o.deltaY > 0 ? 3 : -3)
    }, K[25] = B, K[26] = F;
    else F = K[26];
    let U = F,
        g;
    if (K[27] !== v || K[28] !== G || K[29] !== k) g = v.slice(k, k + G).join(`
`), K[27] = v, K[28] = G, K[29] = k, K[30] = g;
    else g = K[30];
    let c = g,
        n = k > 0,
        l = k < V,
        z6;
    if (K[31] !== c) z6 = sS.createElement(T, null, c), K[31] = c, K[32] = z6;
    else z6 = K[32];
    let A6;
    if (K[33] !== l || K[34] !== n || K[35] !== v.length || K[36] !== G || K[37] !== k || K[38] !== C) A6 = C && sS.createElement(T, {
        dimColor: !0
    }, n ? e6.arrowUp : " ", l ? e6.arrowDown : " ", " ", k + 1, "–", Math.min(k + G, v.length), " of", " ", v.length, " · ctrl+u/ctrl+d to scroll"), K[33] = l, K[34] = n, K[35] = v.length, K[36] = G, K[37] = k, K[38] = C, K[39] = A6;
    else A6 = K[39];
    let e;
    if (K[40] !== A6 || K[41] !== z6) e = sS.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, z6, A6), K[40] = A6, K[41] = z6, K[42] = e;
    else e = K[42];
    let i;
    if (K[43] === Symbol.for("react.memo_cache_sentinel")) i = {
        label: "Implement here",
        value: "here",
        description: "Inject plan into the current conversation"
    }, K[43] = i;
    else i = K[43];
    let O6;
    if (K[44] === Symbol.for("react.memo_cache_sentinel")) O6 = {
        label: "Start new session",
        value: "fresh",
        description: "Clear conversation and start with only the plan"
    }, K[44] = O6;
    else O6 = K[44];
    let J6;
    if (K[45] === Symbol.for("react.memo_cache_sentinel")) J6 = [i, O6, {
        label: "Cancel",
        value: "cancel",
        description: "Don't implement — save plan and return"
    }], K[45] = J6;
    else J6 = K[45];
    let $6;
    if (K[46] !== W) $6 = sS.createElement(A1, {
        options: J6,
        onChange: (q6) => void W(q6)
    }), K[46] = W, K[47] = $6;
    else $6 = K[47];
    let H6;
    if (K[48] !== S || K[49] !== U || K[50] !== e || K[51] !== $6) H6 = sS.createElement(R1, {
        title: "Ultraplan approved",
        subtitle: "How should the plan be implemented?",
        onCancel: WYA,
        isCancelActive: !1,
        hideInputGuide: !0
    }, sS.createElement(u, {
        flexDirection: "column",
        marginBottom: 1,
        onKeyDown: S,
        onWheel: U
    }, e, $6)), K[48] = S, K[49] = U, K[50] = e, K[51] = $6, K[52] = H6;
    else H6 = K[52];
    return H6
}
// @from(Ln 540098, Col 0)
function WYA() {}
// @from(Ln 540100, Col 0)
function DYA(q) {
    return q.ultraplanPendingChoice ? {
        ...q,
        ultraplanPendingChoice: void 0,
        ultraplanSessionUrl: void 0
    } : q
}
// @from(Ln 540108, Col 0)
function ZYA(q) {
    return q.status !== "running" ? q : {
        ...q,
        status: "completed",
        endTime: Date.now()
    }
}
// @from(Ln 540116, Col 0)
function fYA() {
    return !1
}
// @from(Ln 540120, Col 0)
function GYA() {
    return !0
}
// @from(Ln 540123, Col 4)
sS
// @from(Ln 540123, Col 8)
Xt8
// @from(Ln 540123, Col 13)
MYA = 24
// @from(Ln 540124, Col 4)
PYA = 11
// @from(Ln 540125, Col 4)
sz5 = L(() => {
    o6();
    Qq();
    $S();
    y8();
    mn8();
    CP();
    I4();
    g6();
    N7();
    eK();
    b$();
    _7();
    NJ();
    g4();
    sk();
    S88();
    gK();
    S4();
    sS = K6(P6(), 1), Xt8 = K6(P6(), 1)
})
// @from(Ln 540147, Col 0)
function tz5({
    setMessages: q,
    setIsLoading: K,
    resetLoadingState: _,
    setAbortController: z,
    onBackgroundQuery: Y
}) {
    let A = M8((H) => H.foregroundedTaskId),
        O = M8((H) => H.foregroundedTaskId ? H.tasks[H.foregroundedTaskId] : void 0),
        w = R7(),
        $ = Lm6.useRef(0),
        j = Lm6.useCallback(() => {
            if (A) {
                w((H) => {
                    let J = H.foregroundedTaskId;
                    if (!J) return H;
                    let X = H.tasks[J];
                    if (!X) return {
                        ...H,
                        foregroundedTaskId: void 0
                    };
                    return {
                        ...H,
                        foregroundedTaskId: void 0,
                        tasks: {
                            ...H.tasks,
                            [J]: {
                                ...X,
                                isBackgrounded: !0
                            }
                        }
                    }
                }), q([]), _(), z(null);
                return
            }
            Y()
        }, [A, w, q, _, z, Y]);
    return Lm6.useEffect(() => {
        if (!A) {
            $.current = 0;
            return
        }
        if (!O || O.type !== "local_agent") {
            w((J) => ({
                ...J,
                foregroundedTaskId: void 0
            })), _(), $.current = 0;
            return
        }
        let H = O.messages ?? [];
        if (H.length !== $.current) $.current = H.length, q([...H]);
        if (O.status === "running") {
            let J = O.abortController;
            if (J?.signal.aborted) {
                w((X) => {
                    if (!X.foregroundedTaskId) return X;
                    let M = X.tasks[X.foregroundedTaskId];
                    if (!M) return {
                        ...X,
                        foregroundedTaskId: void 0
                    };
                    return {
                        ...X,
                        foregroundedTaskId: void 0,
                        tasks: {
                            ...X.tasks,
                            [X.foregroundedTaskId]: {
                                ...M,
                                isBackgrounded: !0
                            }
                        }
                    }
                }), _(), z(null), $.current = 0;
                return
            }
            if (K(!0), J) z(J)
        } else w((J) => {
            let X = J.foregroundedTaskId;
            if (!X) return J;
            let M = J.tasks[X];
            if (!M) return {
                ...J,
                foregroundedTaskId: void 0
            };
            return {
                ...J,
                foregroundedTaskId: void 0,
                tasks: {
                    ...J.tasks,
                    [X]: {
                        ...M,
                        isBackgrounded: !0
                    }
                }
            }
        }), _(), z(null), $.current = 0
    }, [A, O, w, q, K, _, z]), {
        handleBackgroundSession: j
    }
}
// @from(Ln 540247, Col 4)
Lm6
// @from(Ln 540248, Col 4)
ez5 = L(() => {
    N7();
    Lm6 = K6(P6(), 1)
})
// @from(Ln 540253, Col 0)
function Mt8(q, K) {
    let [_, z] = BP7.default.useState(K);
    return BP7.default.useEffect(() => {
        Kd(q, K).then(z)
    }, [q, K]), _
}
// @from(Ln 540259, Col 4)
BP7
// @from(Ln 540260, Col 4)
qY5 = L(() => {
    B1();
    BP7 = K6(P6(), 1)
})
// @from(Ln 540268, Col 0)
async function Pt8(q, K, _) {
    if (!N5("allow_product_feedback")) return {
        success: !1
    };
    try {
        E("Collecting transcript for sharing", {
            level: "info"
        });
        let z = K0(q),
            Y = gH7(q),
            A = await so8(Y),
            O;
        try {
            let M = bY(),
                {
                    size: P
                } = await TYA(M);
            if (P <= B98) O = await vYA(M, "utf-8");
            else E(`Skipping raw transcript read: file too large (${P} bytes)`, {
                level: "warn"
            })
        } catch {}
        let w = O?.split(`
`).map((M) => {
                if (!M) return M;
                try {
                    return I6(p98(n8(M)))
                } catch {
                    return fu(M)
                }
            }).join(`
`),
            $ = {
                ...p98({
                    trigger: K,
                    version: {
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.112",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-04-16T18:33:19Z"
                    }.VERSION,
                    platform: process.platform,
                    transcript: z,
                    subagentTranscripts: Object.keys(A).length > 0 ? A : void 0
                }),
                rawTranscriptJsonl: w
            },
            j = hn8($, VYA, kYA, {
                extraOuterFields: {
                    appearance_id: _
                }
            });
        await _Y();
        let H = OH();
        if (H.error) return {
            success: !1
        };
        let J = {
                "Content-Type": "application/json",
                "User-Agent": OI(),
                ...H.headers
            },
            X = await Z1.post("https://api.anthropic.com/api/claude_code_shared_session_transcripts", j, {
                headers: J,
                timeout: 30000
            });
        if (X.status === 200 || X.status === 201) {
            let M = X.data;
            return E("Transcript shared successfully", {
                level: "info"
            }), {
                success: !0,
                transcriptId: M?.transcript_id
            }
        }
        return {
            success: !1
        }
    } catch (z) {
        return E(b6(z), {
            level: "error"
        }), {
            success: !1
        }
    }
}
// @from(Ln 540356, Col 4)
VYA
// @from(Ln 540356, Col 9)
kYA
// @from(Ln 540357, Col 4)
pP7 = L(() => {
    CK();
    J2();
    T7();
    NA7();
    K8();
    m8();
    Zf();
    _7();
    g4();
    e8();
    EA7();
    VYA = new Set(["transcript"]), kYA = new Set(["subagentTranscripts"])
})
// @from(Ln 540375, Col 0)
function hm6({
    hideThanksAfterMs: q,
    otherSurveyActive: K = !1,
    onOpen: _,
    onSelect: z,
    shouldShowTranscriptPrompt: Y,
    onTranscriptPromptShown: A,
    onTranscriptSelect: O
}) {
    let [w, $] = GZ.useState("closed"), [j, H] = GZ.useState(null), J = GZ.useRef(KY5()), X = GZ.useRef(null), M = GZ.useRef(null);
    GZ.useEffect(() => () => {
        if (M.current) clearTimeout(M.current)
    }, []);
    let P = GZ.useCallback(() => {
            $("thanks"), setTimeout((V, k) => {
                V("closed"), k(null)
            }, q, $, H)
        }, [q]),
        W = GZ.useCallback(() => {
            $("submitted"), setTimeout($, q, "closed")
        }, [q]),
        D = GZ.useCallback(() => {
            if (w !== "closed") return;
            $("open"), J.current = KY5(), _(J.current)
        }, [w, _]);
    GZ.useEffect(() => {
        if (K && w === "open") $("closed")
    }, [K, w]);
    let Z = GZ.useCallback((V) => {
            if (M.current = null, z(J.current, V), V === "dismissed") $("closed"), H(null);
            else if (Y?.(V)) $("transcript_prompt"), A?.(J.current, V);
            else P()
        }, [P, z, Y, A]),
        G = GZ.useCallback((V) => {
            if (H(V), X.current = V, V === "dismissed") {
                Z(V);
                return
            }
            $("pending"), M.current = setTimeout(Z, NYA, V)
        }, [Z]),
        f = GZ.useCallback(() => {
            if (M.current) clearTimeout(M.current), M.current = null;
            H(null), X.current = null, $("open")
        }, []),
        v = GZ.useCallback((V) => {
            switch (V) {
                case "yes":
                    $("submitting"), (async () => {
                        try {
                            if (await O?.(J.current, V, X.current)) W();
                            else P()
                        } catch {
                            P()
                        }
                    })();
                    break;
                case "no":
                case "dont_ask_again":
                    O?.(J.current, V, X.current), P();
                    break
            }
        }, [P, W, O]);
    return {
        state: w,
        lastResponse: j,
        open: D,
        handleSelect: G,
        handleUndo: f,
        handleTranscriptSelect: v
    }
}
// @from(Ln 540446, Col 4)
GZ
// @from(Ln 540446, Col 8)
NYA = 3000
// @from(Ln 540447, Col 4)
Wt8 = L(() => {
    GZ = K6(P6(), 1)
})
// @from(Ln 540451, Col 0)
function zY5(q, K, _, z = "session", Y = !1, A = !1) {
    let O = FX.useRef("unknown");
    O.current = fM(q)?.message?.id || "unknown";
    let [w, $] = FX.useState(() => ({
        timeLastShown: null,
        submitCountAtLastAppearance: null
    })), j = Mt8("tengu_feedback_survey_config", EYA), H = Mt8("tengu_bad_survey_transcript_ask_config", _Y5), J = Mt8("tengu_good_survey_transcript_ask_config", _Y5), X = v7().feedbackSurveyRate, M = FX.useRef(Date.now()), P = FX.useRef(_), W = FX.useRef(_);
    W.current = _;
    let D = FX.useRef(q);
    D.current = q;
    let Z = FX.useRef(!1),
        G = FX.useRef(null),
        f = FX.useCallback((c, n) => {
            if ($((l) => {
                    if (l.timeLastShown === c && l.submitCountAtLastAppearance === n) return l;
                    return {
                        timeLastShown: c,
                        submitCountAtLastAppearance: n
                    }
                }), H8().feedbackSurveyState?.lastShownTime !== c) d8((l) => ({
                ...l,
                feedbackSurveyState: {
                    lastShownTime: c
                }
            }))
        }, []),
        v = FX.useCallback((c) => {
            f(Date.now(), W.current), d("tengu_feedback_survey_event", {
                event_type: "appeared",
                appearance_id: c,
                last_assistant_message_id: O.current,
                survey_type: z
            }), Xz("feedback_survey", {
                event_type: "appeared",
                appearance_id: c,
                survey_type: z
            })
        }, [f, z]),
        V = FX.useCallback((c, n) => {
            f(Date.now(), W.current), d("tengu_feedback_survey_event", {
                event_type: "responded",
                appearance_id: c,
                response: n,
                last_assistant_message_id: O.current,
                survey_type: z
            }), Xz("feedback_survey", {
                event_type: "responded",
                appearance_id: c,
                response: n,
                survey_type: z
            })
        }, [f, z]),
        k = FX.useCallback((c) => {
            if (c !== "bad" && c !== "good") return !1;
            if (H8().transcriptShareDismissed) return !1;
            if (!N5("allow_product_feedback")) return !1;
            let n = c === "bad" ? H.probability : J.probability;
            return Math.random() <= n
        }, [H.probability, J.probability]),
        N = FX.useCallback((c, n) => {
            let l = n === "good" ? "good_feedback_survey" : "bad_feedback_survey";
            d("tengu_feedback_survey_event", {
                event_type: "transcript_prompt_appeared",
                appearance_id: c,
                last_assistant_message_id: O.current,
                survey_type: z,
                trigger: l
            }), Xz("feedback_survey", {
                event_type: "transcript_prompt_appeared",
                appearance_id: c,
                survey_type: z
            })
        }, [z]),
        R = FX.useCallback(async (c, n, l) => {
            let z6 = l === "good" ? "good_feedback_survey" : "bad_feedback_survey";
            if (d("tengu_feedback_survey_event", {
                    event_type: `transcript_share_${n}`,
                    appearance_id: c,
                    last_assistant_message_id: O.current,
                    survey_type: z,
                    trigger: z6
                }), n === "dont_ask_again") d8((A6) => ({
                ...A6,
                transcriptShareDismissed: !0
            }));
            if (n === "yes") {
                let A6 = await Pt8(D.current, z6, c);
                return d("tengu_feedback_survey_event", {
                    event_type: A6.success ? "transcript_share_submitted" : "transcript_share_failed",
                    appearance_id: c,
                    trigger: z6
                }), A6.success
            }
            return !1
        }, [z]),
        {
            state: h,
            lastResponse: C,
            open: x,
            handleSelect: B,
            handleUndo: m,
            handleTranscriptSelect: S
        } = hm6({
            otherSurveyActive: A,
            hideThanksAfterMs: j.hideThanksAfterMs,
            onOpen: v,
            onSelect: V,
            shouldShowTranscriptPrompt: k,
            onTranscriptPromptShown: N,
            onTranscriptSelect: R
        }),
        F = G5(),
        U = FX.useMemo(() => {
            if (j.onForModels.length === 0) return !1;
            if (j.onForModels.includes("*")) return !0;
            return j.onForModels.includes(F)
        }, [j.onForModels, F]),
        g = FX.useMemo(() => {
            if (h !== "closed") return !1;
            if (K) return !1;
            if (Y) return !1;
            if (A) return !1;
            if (S6(process.env.CLAUDE_FORCE_DISPLAY_SURVEY) && !w.timeLastShown) return !0;
            if (!U) return !1;
            if (S6(process.env.CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY)) return !1;
            if (Uk6()) return !1;
            if (!N5("allow_product_feedback")) return !1;
            if (w.timeLastShown) {
                if (Date.now() - w.timeLastShown < j.minTimeBetweenFeedbackMs) return !1;
                if (w.submitCountAtLastAppearance !== null && _ < w.submitCountAtLastAppearance + j.minUserTurnsBetweenFeedback) return !1
            } else {
                if (Date.now() - M.current < j.minTimeBeforeFeedbackMs) return !1;
                if (_ < P.current + j.minUserTurnsBeforeFeedback) return !1
            }
            if (G.current !== _) G.current = _, Z.current = Math.random() <= (X ?? j.probability);
            if (!Z.current) return !1;
            let c = H8().feedbackSurveyState;
            if (c?.lastShownTime) {
                if (Date.now() - c.lastShownTime < j.minTimeBetweenGlobalFeedbackMs) return !1
            }
            return !0
        }, [h, K, Y, A, U, w.timeLastShown, w.submitCountAtLastAppearance, _, j.minTimeBetweenFeedbackMs, j.minTimeBetweenGlobalFeedbackMs, j.minUserTurnsBetweenFeedback, j.minTimeBeforeFeedbackMs, j.minUserTurnsBeforeFeedback, j.probability, X]);
    return FX.useEffect(() => {
        if (g) x()
    }, [g, x]), {
        state: h,
        lastResponse: C,
        handleSelect: B,
        handleUndo: m,
        handleTranscriptSelect: S
    }
}
// @from(Ln 540603, Col 4)
FX
// @from(Ln 540603, Col 8)
EYA
// @from(Ln 540603, Col 13)
_Y5
// @from(Ln 540604, Col 4)
YY5 = L(() => {
    qY5();
    O46();
    C8();
    J2();
    h1();
    Q8();
    _7();
    Sq();
    a1();
    uf();
    pP7();
    Wt8();
    FX = K6(P6(), 1), EYA = {
        minTimeBeforeFeedbackMs: 600000,
        minTimeBetweenFeedbackMs: 3600000,
        minTimeBetweenGlobalFeedbackMs: 1e8,
        minUserTurnsBeforeFeedback: 5,
        minUserTurnsBetweenFeedback: 10,
        hideThanksAfterMs: 3000,
        onForModels: ["*"],
        probability: 0.005
    }, _Y5 = {
        probability: 0
    }
})
// @from(Ln 540631, Col 0)
function AY5() {
    return u8(hYA, 0.2)
}
// @from(Ln 540635, Col 0)
function OY5() {
    return !1
}
// @from(Ln 540639, Col 0)
function SYA(q) {
    return q === "helped" || q === "harmed" || q === "neutral"
}
// @from(Ln 540643, Col 0)
function wY5() {
    return u8(LYA, !1) && x3() && !Uk6() && N5("allow_product_feedback") && !S6(process.env.CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY)
}
// @from(Ln 540647, Col 0)
function $Y5() {
    return !1
}
// @from(Ln 540651, Col 0)
function jY5(q) {
    for (let K of q) {
        if (K.type !== "assistant") continue;
        let _ = K.message.content;
        if (!Array.isArray(_)) continue;
        for (let z of _) {
            if (z.type !== "tool_use" || z.name !== xq) continue;
            let Y = z.input;
            if (typeof Y.file_path === "string" && AP6(Y.file_path)) return !0
        }
    }
    return !1
}
// @from(Ln 540665, Col 0)
function HY5(q, K, _ = !1, {
    enabled: z = !0,
    otherSurveyActive: Y = !1
} = {}) {
    let A = vZ.useRef(new Set),
        O = vZ.useRef(!1),
        w = vZ.useRef(q);
    w.current = q;
    let $ = M8((R) => R.lastMemoryEvaluation),
        [j, H] = vZ.useState(null),
        J = vZ.useRef(null),
        X = vZ.useCallback((R) => {
            let h = J.current;
            d(RY8, {
                event_type: "appeared",
                appearance_id: R,
                judge_classification: h?.classification,
                judge_evidence_type: h?.evidence_type
            }), Xz("feedback_survey", {
                event_type: "appeared",
                appearance_id: R,
                survey_type: "memory"
            })
        }, []),
        M = vZ.useCallback((R, h) => {
            let C = J.current;
            d(RY8, {
                event_type: "responded",
                appearance_id: R,
                response: h,
                judge_classification: C?.classification,
                judge_evidence_type: C?.evidence_type
            }), Xz("feedback_survey", {
                event_type: "responded",
                appearance_id: R,
                response: h,
                survey_type: "memory"
            })
        }, []),
        P = vZ.useCallback((R) => {
            return !1
        }, []),
        W = vZ.useCallback((R) => {
            d(RY8, {
                event_type: "transcript_prompt_appeared",
                appearance_id: R,
                trigger: Dt8
            }), Xz("feedback_survey", {
                event_type: "transcript_prompt_appeared",
                appearance_id: R,
                survey_type: "memory"
            })
        }, []),
        D = vZ.useCallback(async (R, h) => {
            if (d(RY8, {
                    event_type: `transcript_share_${h}`,
                    appearance_id: R,
                    trigger: Dt8
                }), h === "dont_ask_again") d8((C) => ({
                ...C,
                transcriptShareDismissed: !0
            }));
            if (h === "yes") {
                let C = await Pt8(w.current, Dt8, R);
                return d(RY8, {
                    event_type: C.success ? "transcript_share_submitted" : "transcript_share_failed",
                    appearance_id: R,
                    trigger: Dt8
                }), C.success
            }
            return !1
        }, []),
        {
            state: Z,
            lastResponse: G,
            open: f,
            handleSelect: v,
            handleUndo: V,
            handleTranscriptSelect: k
        } = hm6({
            otherSurveyActive: Y,
            hideThanksAfterMs: yYA,
            onOpen: X,
            onSelect: M,
            shouldShowTranscriptPrompt: P,
            onTranscriptPromptShown: W,
            onTranscriptSelect: D
        }),
        N = vZ.useMemo(() => fM(q), [q]);
    return vZ.useEffect(() => {
        if (q.length === 0) {
            O.current = !1, A.current.clear();
            return
        }
        if (Z !== "closed" || K || _) return;
        if (Y) return;
        if (!z || $Y5() || !wY5()) return;
        if (!N || A.current.has(N.uuid)) return;
        let R = s5(N.message.content, " ");
        if (!RYA.test(R)) return;
        if (A.current.add(N.uuid), !O.current) O.current = jY5(q);
        if (!O.current) return;
        if (OY5() || Math.random() < AY5()) f()
    }, [z, Y, Z, K, _, N, q, f]), vZ.useEffect(() => {
        if (q.length === 0) {
            J.current = null, H(null);
            return
        }
        if (Z !== "closed" || K || _) return;
        if (Y) return;
        if (!z || !$Y5() || !wY5()) return;
        if (!N || !$) return;
        if ($.assistantUuid !== N.uuid) return;
        if (A.current.has(N.uuid)) return;
        A.current.add(N.uuid);
        let R = $.evaluation;
        if (!SYA(R.classification)) return;
        if (!O.current) O.current = jY5(w.current);
        if (!O.current) return;
        if (R.classification !== "harmed" && !OY5() && Math.random() >= AY5()) return;
        J.current = R, H(R), f()
    }, [z, Y, Z, K, _, N, $, q.length, f]), {
        state: Z,
        lastResponse: G,
        evaluation: j,
        handleSelect: v,
        handleUndo: V,
        handleTranscriptSelect: k
    }
}
// @from(Ln 540795, Col 4)
vZ
// @from(Ln 540795, Col 8)
yYA = 3000
// @from(Ln 540796, Col 4)
LYA = "tengu_dunwich_bell"
// @from(Ln 540797, Col 4)
RY8 = "tengu_memory_survey_event"
// @from(Ln 540798, Col 4)
hYA = "tengu_velvet_moth"
// @from(Ln 540799, Col 4)
Dt8 = "memory_survey"
// @from(Ln 540800, Col 4)
RYA
// @from(Ln 540801, Col 4)
JY5 = L(() => {
    O46();
    B1();
    C8();
    VY();
    J2();
    N7();
    Rz();
    h1();
    Q8();
    UI6();
    _7();
    uf();
    pP7();
    Wt8();
    vZ = K6(P6(), 1);
    RYA = /\bmemor(?:y|ies)\b/i
})
// @from(Ln 540820, Col 0)
function xYA(q, K) {
    let _ = q.findIndex((z) => z.uuid === K);
    if (_ === -1) return !1;
    for (let z = _ + 1; z < q.length; z++) {
        let Y = q[z];
        if (Y && (Y.type === "user" || Y.type === "assistant")) return !0
    }
    return !1
}
// @from(Ln 540830, Col 0)
function XY5(q, K, _, z) {
    let Y = s(24),
        A = _ === void 0 ? !1 : _,
        O;
    if (Y[0] !== z) O = z === void 0 ? {} : z, Y[0] = z, Y[1] = O;
    else O = Y[1];
    let {
        enabled: w
    } = O, $ = w === void 0 ? !0 : w, [j, H] = hz6.useState(null), J;
    if (Y[2] === Symbol.for("react.memo_cache_sentinel")) J = new Set, Y[2] = J;
    else J = Y[2];
    let X = hz6.useRef(J),
        M = hz6.useRef(null),
        P = pYA,
        W = BYA,
        D;
    if (Y[3] === Symbol.for("react.memo_cache_sentinel")) D = {
        hideThanksAfterMs: CYA,
        onOpen: P,
        onSelect: W
    }, Y[3] = D;
    else D = Y[3];
    let {
        state: Z,
        lastResponse: G,
        open: f,
        handleSelect: v,
        handleUndo: V
    } = hm6(D), k, N;
    if (Y[4] !== $) k = () => {
        if (!$) return;
        H(Tw(bYA))
    }, N = [$], Y[4] = $, Y[5] = k, Y[6] = N;
    else k = Y[5], N = Y[6];
    hz6.useEffect(k, N);
    let R;
    if (Y[7] !== q) R = new Set(q.filter(mYA).map(uYA)), Y[7] = q, Y[8] = R;
    else R = Y[8];
    let h = R,
        C, x;
    if (Y[9] !== h || Y[10] !== $ || Y[11] !== j || Y[12] !== A || Y[13] !== K || Y[14] !== q || Y[15] !== f || Y[16] !== Z) x = () => {
        if (!$) return;
        if (Z !== "closed" || K) return;
        if (A) return;
        if (j !== !0) return;
        if (Uk6()) return;
        if (!N5("allow_product_feedback")) return;
        if (S6(process.env.CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY)) return;
        if (M.current !== null) {
            if (xYA(q, M.current)) {
                if (M.current = null, Math.random() < IYA) f();
                return
            }
        }
        let m = Array.from(h).filter((S) => !X.current.has(S));
        if (m.length > 0) X.current = new Set(h), M.current = m.at(-1)
    }, C = [$, h, Z, K, A, j, q, f], Y[9] = h, Y[10] = $, Y[11] = j, Y[12] = A, Y[13] = K, Y[14] = q, Y[15] = f, Y[16] = Z, Y[17] = C, Y[18] = x;
    else C = Y[17], x = Y[18];
    hz6.useEffect(x, C);
    let B;
    if (Y[19] !== v || Y[20] !== V || Y[21] !== G || Y[22] !== Z) B = {
        state: Z,
        lastResponse: G,
        handleSelect: v,
        handleUndo: V
    }, Y[19] = v, Y[20] = V, Y[21] = G, Y[22] = Z, Y[23] = B;
    else B = Y[23];
    return B
}
// @from(Ln 540900, Col 0)
function uYA(q) {
    return q.uuid
}
// @from(Ln 540904, Col 0)
function mYA(q) {
    return RJ(q)
}
// @from(Ln 540908, Col 0)
function BYA(q, K) {
    d("tengu_post_compact_survey_event", {
        event_type: "responded",
        appearance_id: q,
        response: K
    }), Xz("feedback_survey", {
        event_type: "responded",
        appearance_id: q,
        response: K,
        survey_type: "post_compact"
    })
}
// @from(Ln 540921, Col 0)
function pYA(q) {
    d("tengu_post_compact_survey_event", {
        event_type: "appeared",
        appearance_id: q
    }), Xz("feedback_survey", {
        event_type: "appeared",
        appearance_id: q,
        survey_type: "post_compact"
    })
}
// @from(Ln 540931, Col 4)
hz6
// @from(Ln 540931, Col 9)
CYA = 3000
// @from(Ln 540932, Col 4)
bYA = "tengu_post_compact_survey"
// @from(Ln 540933, Col 4)
IYA = 0.2
// @from(Ln 540934, Col 4)
MY5 = L(() => {
    o6();
    O46();
    B1();
    C8();
    J2();
    Q8();
    _7();
    uf();
    Wt8();
    hz6 = K6(P6(), 1)
})
// @from(Ln 540947, Col 0)
function Zt8(q) {
    let K = s(19),
        {
            onSelect: _,
            inputValue: z,
            setInputValue: Y,
            message: A,
            messageBold: O,
            mountDelayMs: w
        } = q,
        $ = A === void 0 ? QYA : A,
        j = O === void 0 ? !0 : O,
        H;
    if (K[0] !== _) H = (Z) => _(PY5[Z]), K[0] = _, K[1] = H;
    else H = K[1];
    let J;
    if (K[2] !== z || K[3] !== w || K[4] !== Y || K[5] !== H) J = {
        inputValue: z,
        setInputValue: Y,
        isValidDigit: FP7,
        onDigit: H,
        mountDelayMs: w
    }, K[2] = z, K[3] = w, K[4] = Y, K[5] = H, K[6] = J;
    else J = K[6];
    C96(J);
    let X;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) X = Vg.default.createElement(u, {
        minWidth: 2
    }, Vg.default.createElement(T, {
        color: "ansi:cyan"
    }, "●")), K[7] = X;
    else X = K[7];
    let M;
    if (K[8] !== $ || K[9] !== j) M = Vg.default.createElement(u, null, X, Vg.default.createElement(T, {
        bold: j,
        wrap: "wrap"
    }, $)), K[8] = $, K[9] = j, K[10] = M;
    else M = K[10];
    let P;
    if (K[11] !== _ || K[12] !== Y) P = gYA.map((Z) => {
        let {
            key: G,
            label: f
        } = Z;
        return Vg.default.createElement(u, {
            key: G,
            width: UYA
        }, Vg.default.createElement(xE8, {
            tabIndex: -1,
            onAction: () => {
                Y(""), _(PY5[G])
            }
        }, (v) => {
            let {
                hovered: V
            } = v;
            return Vg.default.createElement(T, {
                backgroundColor: V ? "userMessageBackgroundHover" : void 0
            }, Vg.default.createElement(T, {
                color: "ansi:cyan"
            }, G), ": ", f)
        }))
    }), K[11] = _, K[12] = Y, K[13] = P;
    else P = K[13];
    let W;
    if (K[14] !== P) W = Vg.default.createElement(u, {
        marginLeft: 2
    }, P), K[14] = P, K[15] = W;
    else W = K[15];
    let D;
    if (K[16] !== M || K[17] !== W) D = Vg.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, M, W), K[16] = M, K[17] = W, K[18] = D;
    else D = K[18];
    return D
}
// @from(Ln 541024, Col 4)
Vg
// @from(Ln 541024, Col 8)
FYA
// @from(Ln 541024, Col 13)
PY5
// @from(Ln 541024, Col 18)
gYA
// @from(Ln 541024, Col 23)
UYA = 10
// @from(Ln 541025, Col 4)
FP7 = (q) => FYA.includes(q)
// @from(Ln 541026, Col 4)
QYA = "How is Claude doing this session? (optional)"
// @from(Ln 541027, Col 4)
gP7 = L(() => {
    o6();
    g6();
    RK8();
    Vg = K6(P6(), 1), FYA = ["0", "1", "2", "3"], PY5 = {
        "0": "dismissed",
        "1": "bad",
        "2": "fine",
        "3": "good"
    }, gYA = [{
        key: "1",
        label: "Bad"
    }, {
        key: "2",
        label: "Fine"
    }, {
        key: "3",
        label: "Good"
    }, {
        key: "0",
        label: "Dismiss"
    }]
})
// @from(Ln 541051, Col 0)
function DY5(q) {
    let K = s(11),
        {
            evaluation: _,
            onSelect: z,
            inputValue: Y,
            setInputValue: A,
            mountDelayMs: O
        } = q,
        w = M8(cYA),
        $;
    if (K[0] !== _.memory_impact_summary || K[1] !== w) {
        let X = _.memory_impact_summary?.trim();
        $ = X && !w ? KJ8(X, dYA) : X, K[0] = _.memory_impact_summary, K[1] = w, K[2] = $
    } else $ = K[2];
    let j = $,
        H;
    if (K[3] !== j) H = j ? SY8.default.createElement(SY8.default.Fragment, null, j, " ", SY8.default.createElement(T, {
        dimColor: !0
    }, WY5)) : WY5, K[3] = j, K[4] = H;
    else H = K[4];
    let J;
    if (K[5] !== Y || K[6] !== O || K[7] !== z || K[8] !== A || K[9] !== H) J = SY8.default.createElement(Zt8, {
        onSelect: z,
        inputValue: Y,
        setInputValue: A,
        message: H,
        messageBold: !1,
        mountDelayMs: O
    }), K[5] = Y, K[6] = O, K[7] = z, K[8] = A, K[9] = H, K[10] = J;
    else J = K[10];
    return J
}
// @from(Ln 541085, Col 0)
function cYA(q) {
    return q.verbose
}
// @from(Ln 541088, Col 4)
SY8
// @from(Ln 541088, Col 9)
WY5 = "Did this help? (optional)"
// @from(Ln 541089, Col 4)
dYA = 4
// @from(Ln 541090, Col 4)
ZY5 = L(() => {
    o6();
    g6();
    N7();
    gP7();
    SY8 = K6(P6(), 1)
})
// @from(Ln 541098, Col 0)
function fY5(q) {
    let K = s(11),
        {
            onSelect: _,
            inputValue: z,
            setInputValue: Y
        } = q,
        A;
    if (K[0] !== _) A = (X) => {
        let M = X.toLowerCase();
        if (ft8(M)) _(nYA[M])
    }, K[0] = _, K[1] = A;
    else A = K[1];
    let O;
    if (K[2] !== z || K[3] !== Y || K[4] !== A) O = {
        inputValue: z,
        setInputValue: Y,
        isValidDigit: iYA,
        onDigit: A
    }, K[2] = z, K[3] = Y, K[4] = A, K[5] = O;
    else O = K[5];
    C96(O);
    let w;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) w = BG.default.createElement(u, null, BG.default.createElement(T, {
        color: "ansi:cyan"
    }, $9, " "), BG.default.createElement(T, {
        bold: !0
    }, "Can Anthropic look at your session transcript to help us improve Claude Code?")), K[6] = w;
    else w = K[6];
    let $;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) $ = BG.default.createElement(u, {
        marginLeft: 2
    }, BG.default.createElement(T, {
        dimColor: !0
    }, "Learn more: https://code.claude.com/docs/en/data-usage#session-quality-surveys")), K[7] = $;
    else $ = K[7];
    let j;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) j = BG.default.createElement(u, {
        width: 10
    }, BG.default.createElement(T, null, BG.default.createElement(T, {
        color: "ansi:cyan"
    }, "y"), ": Yes")), K[8] = j;
    else j = K[8];
    let H;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) H = BG.default.createElement(u, {
        width: 10
    }, BG.default.createElement(T, null, BG.default.createElement(T, {
        color: "ansi:cyan"
    }, "n"), ": No")), K[9] = H;
    else H = K[9];
    let J;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) J = BG.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, w, $, BG.default.createElement(u, {
        marginLeft: 2
    }, j, H, BG.default.createElement(u, null, BG.default.createElement(T, null, BG.default.createElement(T, {
        color: "ansi:cyan"
    }, "d"), ": Don't ask again")))), K[10] = J;
    else J = K[10];
    return J
}
// @from(Ln 541161, Col 0)
function iYA(q) {
    return ft8(q.toLowerCase())
}
// @from(Ln 541164, Col 4)
BG
// @from(Ln 541164, Col 8)
lYA
// @from(Ln 541164, Col 13)
nYA
// @from(Ln 541164, Col 18)
ft8 = (q) => lYA.includes(q)
// @from(Ln 541165, Col 4)
GY5 = L(() => {
    o6();
    A3();
    g6();
    RK8();
    BG = K6(P6(), 1), lYA = ["y", "n", "d"], nYA = {
        y: "yes",
        n: "no",
        d: "dont_ask_again"
    }
})
// @from(Ln 541177, Col 0)
function CY8(q) {
    let K = s(24),
        {
            state: _,
            lastResponse: z,
            handleSelect: Y,
            handleUndo: A,
            handleTranscriptSelect: O,
            inputValue: w,
            setInputValue: $,
            onRequestFeedback: j,
            message: H,
            memoryEvaluation: J
        } = q;
    if (_ === "closed") return null;
    if (_ === "pending") {
        let M;
        if (K[0] !== A || K[1] !== z) M = MW.default.createElement(oYA, {
            lastResponse: z,
            onUndo: A
        }), K[0] = A, K[1] = z, K[2] = M;
        else M = K[2];
        return M
    }
    if (_ === "thanks") {
        let M;
        if (K[3] !== w || K[4] !== z || K[5] !== j || K[6] !== $) M = MW.default.createElement(sYA, {
            lastResponse: z,
            inputValue: w,
            setInputValue: $,
            onRequestFeedback: j
        }), K[3] = w, K[4] = z, K[5] = j, K[6] = $, K[7] = M;
        else M = K[7];
        return M
    }
    if (_ === "submitted") {
        let M;
        if (K[8] === Symbol.for("react.memo_cache_sentinel")) M = MW.default.createElement(u, {
            marginTop: 1
        }, MW.default.createElement(T, {
            color: "success"
        }, "✓", " Thanks for sharing your transcript!")), K[8] = M;
        else M = K[8];
        return M
    }
    if (_ === "submitting") {
        let M;
        if (K[9] === Symbol.for("react.memo_cache_sentinel")) M = MW.default.createElement(u, {
            marginTop: 1
        }, MW.default.createElement(T, {
            dimColor: !0
        }, "Sharing transcript", "…")), K[9] = M;
        else M = K[9];
        return M
    }
    if (_ === "transcript_prompt") {
        if (!O) return null;
        if (w && !ft8(w.toLowerCase())) return null;
        let M;
        if (K[10] !== O || K[11] !== w || K[12] !== $) M = MW.default.createElement(fY5, {
            onSelect: O,
            inputValue: w,
            setInputValue: $
        }), K[10] = O, K[11] = w, K[12] = $, K[13] = M;
        else M = K[13];
        return M
    }
    if (w && !FP7(w)) return null;
    if (J) {
        let M;
        if (K[14] !== Y || K[15] !== w || K[16] !== J || K[17] !== $) M = MW.default.createElement(DY5, {
            evaluation: J,
            onSelect: Y,
            inputValue: w,
            setInputValue: $
        }), K[14] = Y, K[15] = w, K[16] = J, K[17] = $, K[18] = M;
        else M = K[18];
        return M
    }
    let X;
    if (K[19] !== Y || K[20] !== w || K[21] !== H || K[22] !== $) X = MW.default.createElement(Zt8, {
        onSelect: Y,
        inputValue: w,
        setInputValue: $,
        message: H
    }), K[19] = Y, K[20] = w, K[21] = H, K[22] = $, K[23] = X;
    else X = K[23];
    return X
}
// @from(Ln 541267, Col 0)
function oYA(q) {
    let K = s(7),
        {
            lastResponse: _,
            onUndo: z
        } = q,
        Y;
    if (K[0] !== z) Y = (j, H, J) => {
        if (H.escape) z(), J.stopImmediatePropagation()
    }, K[0] = z, K[1] = Y;
    else Y = K[1];
    XR(Y);
    let A = _ && _ !== "dismissed" ? rYA[_] : "",
        O;
    if (K[2] !== A) O = MW.default.createElement(T, {
        color: "text"
    }, A), K[2] = A, K[3] = O;
    else O = K[3];
    let w;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) w = MW.default.createElement(A8, {
        chord: "escape",
        action: "undo"
    }), K[4] = w;
    else w = K[4];
    let $;
    if (K[5] !== O) $ = MW.default.createElement(u, {
        marginTop: 1
    }, MW.default.createElement(T, {
        dimColor: !0
    }, "Feedback: ", O, " ·", " ", w)), K[5] = O, K[6] = $;
    else $ = K[6];
    return $
}
// @from(Ln 541301, Col 0)
function sYA(q) {
    let K = s(12),
        {
            lastResponse: _,
            inputValue: z,
            setInputValue: Y,
            onRequestFeedback: A
        } = q,
        O = A && _ === "good",
        w = Boolean(O),
        $;
    if (K[0] !== _ || K[1] !== A) $ = () => {
        d("tengu_feedback_survey_event", {
            event_type: "followup_accepted",
            response: _
        }), A?.()
    }, K[0] = _, K[1] = A, K[2] = $;
    else $ = K[2];
    let j;
    if (K[3] !== z || K[4] !== Y || K[5] !== w || K[6] !== $) j = {
        inputValue: z,
        setInputValue: Y,
        isValidDigit: aYA,
        enabled: w,
        once: !0,
        mountDelayMs: 0,
        onDigit: $
    }, K[3] = z, K[4] = Y, K[5] = w, K[6] = $, K[7] = j;
    else j = K[7];
    C96(j);
    let H = "/feedback",
        J;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) J = MW.default.createElement(T, {
        color: "success"
    }, "Thanks for the feedback!"), K[8] = J;
    else J = K[8];
    let X;
    if (K[9] !== _ || K[10] !== O) X = MW.default.createElement(u, {
        marginTop: 1,
        flexDirection: "column"
    }, J, O ? MW.default.createElement(T, {
        dimColor: !0
    }, "(Optional) Press [", MW.default.createElement(T, {
        color: "ansi:cyan"
    }, "1"), "] to tell us what went well ", " · ", H) : _ === "bad" ? MW.default.createElement(T, {
        dimColor: !0
    }, "Use /issue to report model behavior issues.") : MW.default.createElement(T, {
        dimColor: !0
    }, "Use ", H, " to share detailed feedback anytime.")), K[9] = _, K[10] = O, K[11] = X;
    else X = K[11];
    return X
}
// @from(Ln 541353, Col 4)
MW
// @from(Ln 541353, Col 8)
rYA
// @from(Ln 541353, Col 13)
aYA = (q) => q === "1"
// @from(Ln 541354, Col 4)
vY5 = L(() => {
    o6();
    C8();
    g6();
    u7();
    gP7();
    ZY5();
    GY5();
    RK8();
    MW = K6(P6(), 1);
    rYA = {
        bad: "Bad",
        fine: "Fine",
        good: "Good"
    }
})
// @from(Ln 541371, Col 0)
function TY5(q) {
    if (q.postCompact !== "closed") return "postCompact";
    if (q.memory !== "closed") return "memory";
    if (q.feedback !== "closed") return "feedback";
    if (q.frustration !== "closed") return "frustration";
    return null
}
// @from(Ln 541379, Col 0)
function VY5(q) {
    let K = s(32),
        {
            postCompactSurvey: _,
            memorySurvey: z,
            feedbackSurvey: Y,
            frustrationDetection: A,
            setInputValue: O,
            handleSurveyRequestFeedback: w,
            feedbackOnRequestFeedback: $
        } = q,
        j = tC6();
    switch (TY5({
            postCompact: _.state,
            memory: z.state,
            feedback: Y.state,
            frustration: A.state
        })) {
        case "postCompact": {
            let J;
            if (K[0] !== w || K[1] !== j || K[2] !== _.handleSelect || K[3] !== _.handleUndo || K[4] !== _.lastResponse || K[5] !== _.state || K[6] !== O) J = B66.createElement(CY8, {
                state: _.state,
                lastResponse: _.lastResponse,
                handleSelect: _.handleSelect,
                handleUndo: _.handleUndo,
                inputValue: j,
                setInputValue: O,
                onRequestFeedback: w
            }), K[0] = w, K[1] = j, K[2] = _.handleSelect, K[3] = _.handleUndo, K[4] = _.lastResponse, K[5] = _.state, K[6] = O, K[7] = J;
            else J = K[7];
            return J
        }
        case "memory": {
            let J = z.evaluation ?? void 0,
                X;
            if (K[8] !== w || K[9] !== j || K[10] !== z.handleSelect || K[11] !== z.handleTranscriptSelect || K[12] !== z.handleUndo || K[13] !== z.lastResponse || K[14] !== z.state || K[15] !== O || K[16] !== J) X = B66.createElement(CY8, {
                state: z.state,
                lastResponse: z.lastResponse,
                handleSelect: z.handleSelect,
                handleUndo: z.handleUndo,
                handleTranscriptSelect: z.handleTranscriptSelect,
                inputValue: j,
                setInputValue: O,
                onRequestFeedback: w,
                message: "How well did Claude use its memory? (optional)",
                memoryEvaluation: J
            }), K[8] = w, K[9] = j, K[10] = z.handleSelect, K[11] = z.handleTranscriptSelect, K[12] = z.handleUndo, K[13] = z.lastResponse, K[14] = z.state, K[15] = O, K[16] = J, K[17] = X;
            else X = K[17];
            return X
        }
        case "feedback": {
            let J;
            if (K[18] !== $ || K[19] !== Y.handleSelect || K[20] !== Y.handleTranscriptSelect || K[21] !== Y.handleUndo || K[22] !== Y.lastResponse || K[23] !== Y.state || K[24] !== j || K[25] !== O) J = B66.createElement(CY8, {
                state: Y.state,
                lastResponse: Y.lastResponse,
                handleSelect: Y.handleSelect,
                handleUndo: Y.handleUndo,
                handleTranscriptSelect: Y.handleTranscriptSelect,
                inputValue: j,
                setInputValue: O,
                onRequestFeedback: $
            }), K[18] = $, K[19] = Y.handleSelect, K[20] = Y.handleTranscriptSelect, K[21] = Y.handleUndo, K[22] = Y.lastResponse, K[23] = Y.state, K[24] = j, K[25] = O, K[26] = J;
            else J = K[26];
            return J
        }
        case "frustration": {
            let J;
            if (K[27] !== A.handleTranscriptSelect || K[28] !== A.state || K[29] !== j || K[30] !== O) J = B66.createElement(CY8, {
                state: A.state,
                lastResponse: null,
                handleSelect: eYA,
                handleUndo: tYA,
                handleTranscriptSelect: A.handleTranscriptSelect,
                inputValue: j,
                setInputValue: O
            }), K[27] = A.handleTranscriptSelect, K[28] = A.state, K[29] = j, K[30] = O, K[31] = J;
            else J = K[31];
            return J
        }
        case null:
            return null;
        default:
            return null
    }
}
// @from(Ln 541465, Col 0)
function tYA() {}
// @from(Ln 541467, Col 0)
function eYA() {}
// @from(Ln 541468, Col 4)
B66
// @from(Ln 541469, Col 4)
kY5 = L(() => {
    o6();
    SK8();
    vY5();
    B66 = K6(P6(), 1)
})
// @from(Ln 541476, Col 0)
function pu(q) {
    let {
        addNotification: K
    } = EK(), _ = bY8.useRef(!1), z = bY8.useRef(q);
    z.current = q, bY8.useEffect(() => {
        if (nK() || _.current) return;
        _.current = !0, Promise.resolve().then(() => z.current()).then((Y) => {
            if (!Y) return;
            for (let A of Array.isArray(Y) ? Y : [Y]) K(A)
        }).catch(j6)
    }, [K])
}
// @from(Ln 541488, Col 4)
bY8
// @from(Ln 541489, Col 4)
A06 = L(() => {
    y8();
    kY();
    U8();
    bY8 = K6(P6(), 1)
})
// @from(Ln 541496, Col 0)
function NY5() {
    pu(qAA)
}
// @from(Ln 541499, Col 0)
async function qAA() {
    return (await MX6()).map(KAA)
}
// @from(Ln 541503, Col 0)
function KAA(q, K) {
    let _ = "low";
    if (q.type === "error" || q.userActionRequired) _ = "high";
    else if (q.type === "path" || q.type === "alias") _ = "medium";
    return {
        key: `install-message-${K}-${q.type}`,
        text: q.message,
        priority: _,
        color: q.type === "error" ? "error" : "warning"
    }
}
// @from(Ln 541514, Col 4)
EY5 = L(() => {
    El();
    A06()
})
// @from(Ln 541518, Col 4)
yY5 = L(() => {
    A3();
    hu1();
    C8();
    Q4();
    pK();
    Zb6();
    tD();
    S_8()
})
// @from(Ln 541529, Col 0)
function dP7(q) {
    return q.type === "user" && !q.isMeta && !q.isCompactSummary && !q.isVirtual
}
// @from(Ln 541533, Col 0)
function LY5(q) {
    for (let K = q.length - 1; K >= 0; K--) {
        let _ = q[K];
        if (_.type === "system" && _.subtype === "api_metrics") continue;
        return _.type === "system" && _.subtype === "away_summary"
    }
    return !1
}
// @from(Ln 541542, Col 0)
function AAA(q) {
    let K = 0,
        _ = -1;
    for (let Y = 0; Y < q.length; Y++) {
        let A = q[Y];
        if (dP7(A)) K++;
        if (A.type === "system" && A.subtype === "away_summary") _ = Y
    }
    if (K < zAA) return !1;
    if (_ === -1) return !0;
    let z = 0;
    for (let Y = _ + 1; Y < q.length; Y++)
        if (dP7(q[Y])) z++;
    return z >= YAA
}
// @from(Ln 541558, Col 0)
function hY5(q, K, _, z) {
    let Y = L0.useRef(null),
        A = L0.useRef(0),
        O = L0.useRef(q),
        w = L0.useRef(_),
        $ = L0.useRef(null),
        j = L0.useRef(null),
        H = L0.useRef(null),
        J = L0.useRef(QP7),
        X = L0.useRef(null),
        M = L0.useRef(null),
        P = L0.useRef(null),
        W = L0.useRef(!1),
        D = L0.useRef(!1);
    if (O.current = q, w.current && !_) j.current = Date.now(), H.current = ex({
        querySource: "repl_main_thread"
    }).ttl === "1h" ? 3600000 : 300000;
    w.current = _;
    let Z = M8((f) => f.awaySummaryEnabled),
        G = u8("tengu_sedge_lantern_config", {
            delayMs: QP7
        })?.delayMs;
    J.current = typeof G === "number" && Number.isFinite(G) ? Math.max(30000, G) : QP7, L0.useEffect(() => {
        {
            let f = function() {
                    Y.current?.abort(), Y.current = null
                },
                V = function() {
                    let N = sa6();
                    if (N === "blurred") {
                        X.current = Date.now();
                        let R = j.current,
                            h = H.current ?? 3600000;
                        if (R !== null && Date.now() - R >= Math.min(J.current, h * 0.8) && !w.current) v()
                    } else if (N === "focused") {
                        if (f(), X.current !== null) {
                            let R = Date.now(),
                                h = R - X.current;
                            if (h >= _AA) M.current = R, P.current = h, W.current = !0, D.current = LY5(O.current);
                            X.current = null
                        }
                    }
                };
            if (!Z) return;
            async function v(N) {
                let R = j.current,
                    h = H.current;
                if (R === null || h === null) {
                    E("[awaySummary] skipped: cache age unknown");
                    return
                }
                if (Date.now() - R > h * 0.9) {
                    E("[awaySummary] skipped: cache stale");
                    return
                }
                if (!N?.force && !AAA(O.current)) return;
                if (LY5(O.current)) return;
                f();
                let C = new AbortController;
                Y.current = C;
                let x = await Vu8(C.signal);
                if (C.signal.aborted || x === null) return;
                let B = A.current < 3 ? `${x} (disable recaps in /config)` : x;
                A.current++, K((m) => {
                    let S = tCK(B),
                        F = m.at(-1);
                    if (F?.type === "system" && F.subtype === "api_metrics") return [...m.slice(0, -1), S, F];
                    return [...m, S]
                })
            }
            let k = ta6(V);
            return $.current = v, V(), () => {
                k(), f(), $.current = null, X.current = null, M.current = null, P.current = null, W.current = !1, D.current = !1
            }
        }
    }, [Z, K]), L0.useEffect(() => {
        if (_) return;
        if (!Z) return;
        let f = j.current;
        if (f === null) return;
        let v = H.current ?? 3600000,
            V = Math.min(J.current, v * 0.8),
            k = Math.max(0, V - (Date.now() - f)),
            N = setTimeout((R, h) => {
                if (sa6() === "blurred" && !h.current) R.current?.()
            }, k, $, w);
        return () => clearTimeout(N)
    }, [_, Z]), L0.useEffect(() => {
        {
            if (!Z) return;
            if (!W.current) return;
            let f = q.at(-1);
            if (!f || !dP7(f)) return;
            let v = M.current;
            if (v === null) return;
            d("tengu_return_to_session", {
                msSinceFocus: Date.now() - v,
                blurDurationMs: P.current ?? 0,
                hadRecap: D.current,
                scrolledBeforeSubmit: z.current > v,
                isFullscreen: lq()
            }), W.current = !1, M.current = null, X.current = null, P.current = null, D.current = !1
        }
    }, [q, Z]), L0.useEffect(() => {}, [Z])
}
// @from(Ln 541663, Col 4)
L0
// @from(Ln 541663, Col 8)
QP7 = 180000
// @from(Ln 541664, Col 4)
_AA = 300000
// @from(Ln 541665, Col 4)
zAA = 3
// @from(Ln 541666, Col 4)
YAA = 2
// @from(Ln 541667, Col 4)
RY5 = L(() => {
    uN6();
    yY5();
    B1();
    C8();
    O2();
    QR6();
    N7();
    wf();
    K8();
    nO();
    _7();
    L0 = K6(P6(), 1)
})
// @from(Ln 541682, Col 0)
function OAA() {
    if (process.argv.includes("--chrome")) return !0;
    if (process.argv.includes("--no-chrome")) return !1;
    return
}
// @from(Ln 541688, Col 0)
function SY5() {
    pu(wAA)
}
// @from(Ln 541691, Col 0)
async function wAA() {
    let q = OAA();
    if (!yo8(q)) return null;
    if (!i7()) return {
        key: "chrome-requires-subscription",
        jsx: IY8.createElement(T, {
            color: "error"
        }, "Claude in Chrome requires a claude.ai subscription"),
        priority: "immediate",
        timeoutMs: 5000
    };
    if (!await j66() && !CZ()) return {
        key: "chrome-extension-not-detected",
        jsx: IY8.createElement(T, {
            color: "warning"
        }, "Chrome extension not detected · https://claude.ai/chrome to install"),
        priority: "immediate",
        timeoutMs: 3000
    };
    if (q === void 0) return {
        key: "claude-in-chrome-default-enabled",
        text: "Claude in Chrome enabled · /chrome",
        priority: "low"
    };
    return null
}
// @from(Ln 541717, Col 4)
IY8
// @from(Ln 541718, Col 4)
CY5 = L(() => {
    g6();
    T7();
    DW6();
    Q8();
    A06();
    IY8 = K6(P6(), 1)
})
// @from(Ln 541730, Col 0)
function jAA() {
    return S6(process.env.CLAUDE_CODE_DISABLE_OFFICIAL_MARKETPLACE_AUTOINSTALL)
}
// @from(Ln 541734, Col 0)
function cP7(q) {
    let K = Gt8.INITIAL_DELAY_MS * Math.pow(Gt8.BACKOFF_MULTIPLIER, q);
    return Math.min(K, Gt8.MAX_DELAY_MS)
}
// @from(Ln 541739, Col 0)
function HAA(q) {
    if (!q.officialMarketplaceAutoInstallAttempted) return !0;
    if (q.officialMarketplaceAutoInstalled) return !1;
    let K = q.officialMarketplaceAutoInstallFailReason,
        _ = q.officialMarketplaceAutoInstallRetryCount || 0,
        z = q.officialMarketplaceAutoInstallNextRetryTime,
        Y = Date.now();
    if (_ >= Gt8.MAX_ATTEMPTS) return !1;
    if (K === "policy_blocked") return !1;
    if (z && Y < z) return !1;
    return K === "unknown" || K === "git_unavailable" || K === "gcs_unavailable" || K === void 0
}
// @from(Ln 541751, Col 0)
async function bY5() {
    let q = H8();
    if (!HAA(q)) {
        let K = q.officialMarketplaceAutoInstallFailReason ?? "already_attempted";
        return E(`Official marketplace auto-install skipped: ${K}`), {
            installed: !1,
            skipped: !0,
            reason: K
        }
    }
    try {
        if (jAA()) return E("Official marketplace auto-install disabled via env var, skipping"), d8((w) => ({
            ...w,
            officialMarketplaceAutoInstallAttempted: !0,
            officialMarketplaceAutoInstalled: !1,
            officialMarketplaceAutoInstallFailReason: "policy_blocked"
        })), d("tengu_official_marketplace_auto_install", {
            installed: !1,
            skipped: !0,
            policy_blocked: !0
        }), {
            installed: !1,
            skipped: !0,
            reason: "policy_blocked"
        };
        if ((await Dz())[WM]) return E(`Official marketplace '${WM}' already installed, skipping`), d8((w) => ({
            ...w,
            officialMarketplaceAutoInstallAttempted: !0,
            officialMarketplaceAutoInstalled: !0
        })), {
            installed: !1,
            skipped: !0,
            reason: "already_installed"
        };
        if (!_H6(AL6)) return E("Official marketplace blocked by enterprise policy, skipping"), d8((w) => ({
            ...w,
            officialMarketplaceAutoInstallAttempted: !0,
            officialMarketplaceAutoInstalled: !1,
            officialMarketplaceAutoInstallFailReason: "policy_blocked"
        })), d("tengu_official_marketplace_auto_install", {
            installed: !1,
            skipped: !0,
            policy_blocked: !0
        }), {
            installed: !1,
            skipped: !0,
            reason: "policy_blocked"
        };
        let _ = H_6(),
            z = $AA(_, WM);
        if (await y38(z, _) !== null) {
            let w = await Dz();
            return w[WM] = {
                source: AL6,
                installLocation: z,
                lastUpdated: new Date().toISOString()
            }, await $n(w), d8(($) => ({
                ...$,
                officialMarketplaceAutoInstallAttempted: !0,
                officialMarketplaceAutoInstalled: !0,
                officialMarketplaceAutoInstallFailReason: void 0,
                officialMarketplaceAutoInstallRetryCount: void 0,
                officialMarketplaceAutoInstallLastAttemptTime: void 0,
                officialMarketplaceAutoInstallNextRetryTime: void 0
            })), d("tengu_official_marketplace_auto_install", {
                installed: !0,
                skipped: !1,
                via_gcs: !0
            }), {
                installed: !0,
                skipped: !1
            }
        }
        if (!u8("tengu_plugin_official_mkt_git_fallback", !0)) {
            E("Official marketplace GCS failed; git fallback disabled by flag — skipping install");
            let w = (q.officialMarketplaceAutoInstallRetryCount || 0) + 1,
                $ = Date.now(),
                j = $ + cP7(w);
            return d8((H) => ({
                ...H,
                officialMarketplaceAutoInstallAttempted: !0,
                officialMarketplaceAutoInstalled: !1,
                officialMarketplaceAutoInstallFailReason: "gcs_unavailable",
                officialMarketplaceAutoInstallRetryCount: w,
                officialMarketplaceAutoInstallLastAttemptTime: $,
                officialMarketplaceAutoInstallNextRetryTime: j
            })), d("tengu_official_marketplace_auto_install", {
                installed: !1,
                skipped: !0,
                gcs_unavailable: !0,
                retry_count: w
            }), {
                installed: !1,
                skipped: !0,
                reason: "gcs_unavailable"
            }
        }
        if (!await KH6()) {
            E("Git not available, skipping official marketplace auto-install");
            let w = (q.officialMarketplaceAutoInstallRetryCount || 0) + 1,
                $ = Date.now(),
                j = cP7(w),
                H = $ + j,
                J = !1;
            try {
                d8((X) => ({
                    ...X,
                    officialMarketplaceAutoInstallAttempted: !0,
                    officialMarketplaceAutoInstalled: !1,
                    officialMarketplaceAutoInstallFailReason: "git_unavailable",
                    officialMarketplaceAutoInstallRetryCount: w,
                    officialMarketplaceAutoInstallLastAttemptTime: $,
                    officialMarketplaceAutoInstallNextRetryTime: H
                }))
            } catch (X) {
                J = !0;
                let M = r1(X);
                j6(M), E(`Failed to save marketplace auto-install git_unavailable state: ${X}`, {
                    level: "error"
                })
            }
            return d("tengu_official_marketplace_auto_install", {
                installed: !1,
                skipped: !0,
                git_unavailable: !0,
                retry_count: w
            }), {
                installed: !1,
                skipped: !0,
                reason: "git_unavailable",
                configSaveFailed: J
            }
        }
        E("Attempting to auto-install official marketplace"), await M_6(AL6), E("Successfully auto-installed official marketplace");
        let O = q.officialMarketplaceAutoInstallRetryCount || 0;
        return d8((w) => ({
            ...w,
            officialMarketplaceAutoInstallAttempted: !0,
            officialMarketplaceAutoInstalled: !0,
            officialMarketplaceAutoInstallFailReason: void 0,
            officialMarketplaceAutoInstallRetryCount: void 0,
            officialMarketplaceAutoInstallLastAttemptTime: void 0,
            officialMarketplaceAutoInstallNextRetryTime: void 0
        })), d("tengu_official_marketplace_auto_install", {
            installed: !0,
            skipped: !1,
            retry_count: O
        }), {
            installed: !0,
            skipped: !1
        }
    } catch (K) {
        let _ = K instanceof Error ? K.message : String(K);
        if (_.includes("xcrun: error:")) return Mf4(), E("Official marketplace auto-install: git is a non-functional macOS xcrun shim, treating as git_unavailable"), d("tengu_official_marketplace_auto_install", {
            installed: !1,
            skipped: !0,
            git_unavailable: !0,
            macos_xcrun_shim: !0
        }), {
            installed: !1,
            skipped: !0,
            reason: "git_unavailable"
        };
        E(`Failed to auto-install official marketplace: ${_}`, {
            level: "error"
        }), j6(r1(K));
        let z = (q.officialMarketplaceAutoInstallRetryCount || 0) + 1,
            Y = Date.now(),
            A = cP7(z),
            O = Y + A,
            w = !1;
        try {
            d8(($) => ({
                ...$,
                officialMarketplaceAutoInstallAttempted: !0,
                officialMarketplaceAutoInstalled: !1,
                officialMarketplaceAutoInstallFailReason: "unknown",
                officialMarketplaceAutoInstallRetryCount: z,
                officialMarketplaceAutoInstallLastAttemptTime: Y,
                officialMarketplaceAutoInstallNextRetryTime: O
            }))
        } catch ($) {
            w = !0;
            let j = r1($);
            j6(j), E(`Failed to save marketplace auto-install failure state: ${$}`, {
                level: "error"
            })
        }
        return d("tengu_official_marketplace_auto_install", {
            installed: !1,
            skipped: !0,
            failed: !0,
            retry_count: z
        }), {
            installed: !1,
            skipped: !0,
            reason: "unknown",
            configSaveFailed: w
        }
    }
}
// @from(Ln 541952, Col 4)
Gt8
// @from(Ln 541953, Col 4)
IY5 = L(() => {
    B1();
    C8();
    h1();
    K8();
    Q8();
    m8();
    U8();
    TS8();
    Xc();
    m$();
    qH6();
    e97();
    Gt8 = {
        MAX_ATTEMPTS: 10,
        INITIAL_DELAY_MS: 3600000,
        BACKOFF_MULTIPLIER: 2,
        MAX_DELAY_MS: 604800000
    }
})
// @from(Ln 541974, Col 0)
function xY5() {
    pu(JAA)
}
// @from(Ln 541977, Col 0)
async function JAA() {
    let q = await bY5(),
        K = [];
    if (q.configSaveFailed) E("Showing marketplace config save failure notification"), K.push({
        key: "marketplace-config-save-failed",
        jsx: O06.createElement(T, {
            color: "error"
        }, "Failed to save marketplace retry info · Check ~/.claude.json permissions"),
        priority: "immediate",
        timeoutMs: 1e4
    });
    if (q.installed) E("Showing marketplace installation success notification"), K.push({
        key: "marketplace-installed",
        jsx: O06.createElement(T, {
            color: "success"
        }, "✓ Anthropic marketplace installed · /plugin to see available plugins"),
        priority: "immediate",
        timeoutMs: 7000
    });
    else if (q.skipped && q.reason === "unknown") E("Showing marketplace installation failure notification"), K.push({
        key: "marketplace-install-failed",
        jsx: O06.createElement(T, {
            color: "warning"
        }, "Failed to install Anthropic marketplace · Will retry on next startup"),
        priority: "immediate",
        timeoutMs: 8000
    });
    return K
}
// @from(Ln 542006, Col 4)
O06
// @from(Ln 542007, Col 4)
uY5 = L(() => {
    g6();
    K8();
    IY5();
    A06();
    O06 = K6(P6(), 1)
})
// @from(Ln 542015, Col 0)
function mY5(q, K) {
    let _ = s(6);
    xY8.useRef(void 0);
    let z;
    if (_[0] !== q) z = [q], _[0] = q, _[1] = z;
    else z = _[1];
    xY8.useEffect(XAA, z);
    let Y, A;
    if (_[2] !== q || _[3] !== K) Y = () => {
        let O = MAA(q);
        if (!O) return;
        Qp("set_permission_mode", {
            mode: K === "bypassPermissions" ? "skip_all_permission_checks" : "ask"
        }, O)
    }, A = [q, K], _[2] = q, _[3] = K, _[4] = Y, _[5] = A;
    else Y = _[4], A = _[5];
    xY8.useEffect(Y, A)
}
// @from(Ln 542034, Col 0)
function XAA() {}
// @from(Ln 542036, Col 0)
function MAA(q) {
    return q.find((K) => K.type === "connected" && K.name === Ex)
}
// @from(Ln 542039, Col 4)
xY8
// @from(Ln 542039, Col 9)
VkH
// @from(Ln 542040, Col 4)
BY5 = L(() => {
    o6();
    p7();
    oW();
    ip();
    xY8 = K6(P6(), 1), VkH = C6(() => y.object({
        method: y.literal("notifications/message"),
        params: y.object({
            prompt: y.string(),
            image: y.object({
                type: y.literal("base64"),
                media_type: y.enum(["image/jpeg", "image/png", "image/gif", "image/webp"]),
                data: y.string()
            }).optional(),
            tabId: y.number().optional()
        })
    }))
})
// @from(Ln 542059, Col 0)
function pY5(q) {
    let K = H8().numStartups;
    d8((_) => {
        let z = _.tipsHistory ?? {};
        if (z[q] === K) return _;
        return {
            ..._,
            tipsHistory: {
                ...z,
                [q]: K
            }
        }
    })
}