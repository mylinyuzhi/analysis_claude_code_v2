
// @from(Ln 481913, Col 0)
function nMz(A, q) {
    let K = [],
        Y = A.trim();
    if (Y) K.push({
        type: "text",
        text: Y
    });
    for (let z of Object.values(q))
        if (z.type === "image" && iMz(z.mediaType)) K.push({
            type: "image",
            source: {
                type: "base64",
                media_type: z.mediaType,
                data: z.content
            }
        });
    if (K.length === 0) K.push({
        type: "text",
        text: A
    });
    return K
}
// @from(Ln 481935, Col 4)
YVq = v(() => {
    AN();
    nS();
    u6();
    Z6();
    G2();
    pQA();
    ZN();
    Nv6();
    w01();
    w$();
    BG1();
    hf()
})
// @from(Ln 481950, Col 0)
function agA(A, q) {
    let K = [],
        Y = {},
        z = q;
    for (let w of A)
        if (w.type === "text") K.push(w.text);
        else if (w.type === "image" && w.source.type === "base64") {
        let H = z++;
        Y[H] = {
            id: H,
            type: "image",
            content: w.source.data,
            mediaType: w.source.media_type
        }
    }
    return {
        text: K.join(" ").trim(),
        pastedContents: Y,
        nextPasteId: z
    }
}
// @from(Ln 481971, Col 0)
async function zVq({
    getAppState: A,
    setAppState: q,
    executeInput: K
}) {
    let Y = await Z_6(A, q);
    if (!Y) return {
        processed: !1
    };
    let z, w = {};
    if (typeof Y.value === "string") z = Y.value;
    else {
        let H = agA(Y.value, 1);
        z = H.text, Object.assign(w, H.pastedContents)
    }
    return await K(z, w), {
        processed: !0
    }
}
// @from(Ln 481990, Col 4)
wVq = v(() => {
    AN()
})
// @from(Ln 481994, Col 0)
function HVq({
    isLoading: A,
    queuedCommandsLength: q,
    lastQueryCompletionTime: K,
    getAppState: Y,
    setAppState: z,
    executeQueuedInput: w,
    hasActiveLocalJsxUI: H,
    setIsLoading: $
}) {
    let O = vY1.useRef(!1),
        _ = vY1.useSyncExternalStore(Sp7, hp7);
    vY1.useEffect(() => {
        if (A) return;
        if (!Ip7()) return;
        if (H) return;
        if (O.current) return;
        let J = up7();
        if (!J) return;
        O.current = !0, $(!0);
        let X, D = {};
        if (typeof J.value === "string") X = J.value;
        else {
            let j = agA(J.value, 1);
            X = j.text, D = j.pastedContents
        }
        w(X, D).catch(() => {}).finally(() => {
            O.current = !1, bp7()
        })
    }, [_, A, H, w, $]), vY1.useEffect(() => {
        if (A) return;
        if (q === 0) return;
        if (H) return;
        if (O.current) return;
        O.current = !0, $(!0), zVq({
            getAppState: Y,
            setAppState: z,
            executeInput: w
        }).then((J) => {
            if (!J.processed) $(!1)
        }).finally(() => {
            O.current = !1
        })
    }, [A, q, K, Y, z, w, H, $])
}
// @from(Ln 482039, Col 4)
vY1
// @from(Ln 482040, Col 4)
$Vq = v(() => {
    wVq();
    AN();
    vY1 = o(X1(), 1)
})
// @from(Ln 482046, Col 0)
function OVq({
    isLoading: A,
    onSubmitMessage: q
}) {
    let K = nk7(),
        Y = D11.useMemo(() => K.subscribe.bind(K), [K]),
        z = D11.useCallback(() => K.revision, [K]),
        w = D11.useSyncExternalStore(Y, z);
    D11.useEffect(() => {
        if (A) return;
        let H = K.poll();
        if (H) q(H.content)
    }, [A, w, K, q])
}
// @from(Ln 482060, Col 4)
D11
// @from(Ln 482061, Col 4)
_Vq = v(() => {
    zOA();
    D11 = o(X1(), 1)
})
// @from(Ln 482066, Col 0)
function XVq(A, q) {
    return JVq.useMemo(() => {
        if (A && q && q.length > 0) return Sx([...A, ...q], "name");
        return A || []
    }, [A, q])
}
// @from(Ln 482072, Col 4)
JVq
// @from(Ln 482073, Col 4)
DVq = v(() => {
    H21();
    JVq = o(X1(), 1)
})
// @from(Ln 482078, Col 0)
function sgA(A, q) {
    return jVq.useMemo(() => {
        if (q.length > 0) return Sx([...A, ...q], "name");
        return A
    }, [A, q])
}
// @from(Ln 482084, Col 4)
jVq
// @from(Ln 482085, Col 4)
MVq = v(() => {
    H21();
    jVq = o(X1(), 1)
})
// @from(Ln 482090, Col 0)
function PVq(A, q) {
    let K = WE6.useCallback(async () => {
        try {
            bm();
            let Y = await cZ(A);
            q(Y)
        } catch (Y) {
            if (Y instanceof Error) K1(Y)
        }
    }, [A, q]);
    WE6.useEffect(() => Df1.subscribe(K), [K])
}
// @from(Ln 482102, Col 4)
WE6
// @from(Ln 482103, Col 4)
WVq = v(() => {
    rT6();
    c$();
    y6();
    WE6 = o(X1(), 1)
})
// @from(Ln 482110, Col 0)
function GE6() {
    let A = L7(),
        q = v6((Y) => Y.plugins.needsRefresh),
        K = lc1.useCallback(async () => {
            try {
                let {
                    enabled: Y,
                    disabled: z,
                    errors: w
                } = await iY(), H = [], $ = [];
                try {
                    H = await YK1()
                } catch (O) {
                    let _ = O instanceof Error ? O.message : String(O);
                    w.push({
                        type: "generic-error",
                        source: "plugin-commands",
                        error: `Failed to load plugin commands: ${_}`
                    })
                }
                try {
                    $ = await wK1()
                } catch (O) {
                    let _ = O instanceof Error ? O.message : String(O);
                    w.push({
                        type: "generic-error",
                        source: "plugin-agents",
                        error: `Failed to load plugin agents: ${_}`
                    })
                }
                try {
                    await pa()
                } catch (O) {
                    let _ = O instanceof Error ? O.message : String(O);
                    w.push({
                        type: "generic-error",
                        source: "plugin-hooks",
                        error: `Failed to load plugin hooks: ${_}`
                    })
                }
                return A((O) => {
                    let _ = O.plugins.errors.filter((j) => j.source === "lsp-manager" || j.source.startsWith("plugin:")),
                        J = new Set(w.map((j) => j.type === "generic-error" ? `generic-error:${j.source}:${j.error}` : `${j.type}:${j.source}`)),
                        D = [..._.filter((j) => {
                            let M = j.type === "generic-error" ? `generic-error:${j.source}:${j.error}` : `${j.type}:${j.source}`;
                            return !J.has(M)
                        }), ...w];
                    return {
                        ...O,
                        plugins: {
                            ...O.plugins,
                            enabled: Y,
                            disabled: z,
                            commands: H,
                            agents: $,
                            errors: D
                        }
                    }
                }), h(`Loaded plugins - Enabled: ${Y.length}, Disabled: ${z.length}, Commands: ${H.length}, Agents: ${$.length}, Errors: ${w.length}`), {
                    enabled_count: Y.length,
                    disabled_count: z.length,
                    inline_count: Y.filter((O) => O.source.endsWith("@inline")).length,
                    marketplace_count: Y.filter((O) => !O.source.endsWith("@inline")).length,
                    error_count: w.length
                }
            } catch (Y) {
                let z = Y instanceof Error ? Y : Error(String(Y));
                return K1(z), h(`Error loading plugins: ${Y}`), A((w) => {
                    let H = w.plugins.errors.filter((O) => O.source === "lsp-manager" || O.source.startsWith("plugin:")),
                        $ = {
                            type: "generic-error",
                            source: "plugin-system",
                            error: z.message
                        };
                    return {
                        ...w,
                        plugins: {
                            ...w.plugins,
                            enabled: [],
                            disabled: [],
                            commands: [],
                            agents: [],
                            errors: [...H, $]
                        }
                    }
                }), {
                    enabled_count: 0,
                    disabled_count: 0,
                    inline_count: 0,
                    marketplace_count: 0,
                    error_count: 1,
                    load_failed: !0
                }
            }
        }, [A]);
    return lc1.useEffect(() => {
        K().then((Y) => {
            c("tengu_plugins_loaded", Y), H8("info", "tengu_plugins_loaded", Y)
        })
    }, [K]), lc1.useEffect(() => {
        if (!q) return;
        Sv(), K().then((Y) => {
            let z = {
                ...Y,
                is_refresh: !0
            };
            c("tengu_plugins_loaded", z), H8("info", "tengu_plugins_loaded", z), A((w) => {
                if (!w.plugins.needsRefresh) return w;
                return {
                    ...w,
                    plugins: {
                        ...w.plugins,
                        needsRefresh: !1
                    }
                }
            })
        })
    }, [q, K, A]), {
        refreshPlugins: K
    }
}
// @from(Ln 482231, Col 4)
lc1
// @from(Ln 482232, Col 4)
tgA = v(() => {
    d8();
    VJ();
    Bu1();
    Uu1();
    pu1();
    Z6();
    y6();
    u6();
    f0();
    lc1 = o(X1(), 1)
})
// @from(Ln 482245, Col 0)
function GVq() {
    let A = e(16),
        q = v6(rMz);
    if (!q) return null;
    let K;
    if (A[0] !== q.identity.color) K = qP(q.identity.color), A[0] = q.identity.color, A[1] = K;
    else K = A[1];
    let Y = K,
        z = q.status === "running",
        w;
    if (A[2] === Symbol.for("react.memo_cache_sentinel")) w = Pf.createElement(V, null, "Viewing "), A[2] = w;
    else w = A[2];
    let H;
    if (A[3] !== Y || A[4] !== q.identity.agentName) H = Pf.createElement(V, {
        color: Y,
        bold: !0
    }, "@", q.identity.agentName), A[3] = Y, A[4] = q.identity.agentName, A[5] = H;
    else H = A[5];
    let $ = z ? "shift+up" : "esc",
        O;
    if (A[6] !== $) O = Pf.createElement(V, {
        dimColor: !0
    }, " · ", Pf.createElement(YA, {
        shortcut: $,
        action: "return"
    })), A[6] = $, A[7] = O;
    else O = A[7];
    let _;
    if (A[8] !== H || A[9] !== O) _ = Pf.createElement(I, null, w, H, O), A[8] = H, A[9] = O, A[10] = _;
    else _ = A[10];
    let J;
    if (A[11] !== q.prompt) J = Pf.createElement(V, {
        dimColor: !0
    }, q.prompt), A[11] = q.prompt, A[12] = J;
    else J = A[12];
    let X;
    if (A[13] !== _ || A[14] !== J) X = Pf.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, _, J), A[13] = _, A[14] = J, A[15] = X;
    else X = A[15];
    return X
}
// @from(Ln 482289, Col 0)
function rMz(A) {
    return PR(A)
}
// @from(Ln 482292, Col 4)
Pf
// @from(Ln 482293, Col 4)
ZVq = v(() => {
    i1();
    m1();
    d8();
    MK1();
    Zd();
    wK();
    Pf = o(X1(), 1)
})
// @from(Ln 482303, Col 0)
function fVq(A, q) {
    let K = ic1.useRef(!1),
        Y = ic1.useRef(null);
    ic1.useEffect(() => {
        let z = iV(A);
        if (Y.current !== z) K.current = !1, Y.current = z || null, q({
            lineCount: 0,
            lineStart: void 0,
            text: void 0,
            filePath: void 0
        });
        if (K.current || !z) return;
        let w = (H) => {
            if (H.selection?.start && H.selection?.end) {
                let {
                    start: $,
                    end: O
                } = H.selection, _ = O.line - $.line + 1;
                if (O.character === 0) _--;
                let J = {
                    lineCount: _,
                    lineStart: $.line,
                    text: H.text,
                    filePath: H.filePath
                };
                q(J)
            }
        };
        z.client.setNotificationHandler(oMz, (H) => {
            if (Y.current !== z) return;
            try {
                let $ = H.params;
                if ($.selection && $.selection.start && $.selection.end) w($);
                else if ($.text !== void 0) w({
                    selection: null,
                    text: $.text,
                    filePath: $.filePath
                })
            } catch ($) {
                K1($)
            }
        }), K.current = !0
    }, [A, q])
}
// @from(Ln 482347, Col 4)
ic1
// @from(Ln 482347, Col 9)
oMz
// @from(Ln 482348, Col 4)
VVq = v(() => {
    i7();
    q$();
    y6();
    ic1 = o(X1(), 1), oMz = u.object({
        method: u.literal("selection_changed"),
        params: u.object({
            selection: u.object({
                start: u.object({
                    line: u.number(),
                    character: u.number()
                }),
                end: u.object({
                    line: u.number(),
                    character: u.number()
                })
            }).nullable().optional(),
            text: u.string().optional(),
            filePath: u.string().optional()
        })
    })
})
// @from(Ln 482374, Col 0)
function ZE6(A) {
    if (MM()) return;
    if (Dz()) return g5();
    if (PM(A.teamContext)) {
        let q = A.teamContext.leadAgentId;
        return A.teamContext.teammates[q]?.name || "team-lead"
    }
    return
}
// @from(Ln 482384, Col 0)
function TVq({
    enabled: A,
    isLoading: q,
    focusedInputDialog: K,
    onSubmitMessage: Y
}) {
    let z = Y,
        w = B_(),
        H = L7(),
        $ = v6((j) => j.inbox.messages.length),
        O = YB(),
        _ = j11.useRef(q),
        J = j11.useCallback(() => {
            if (!A) return;
            let j = w.getState(),
                M = ZE6(j);
            if (!M) return;
            let P = z51(M, j.teamContext?.teamName);
            if (P.length === 0) return;
            if (h(`[InboxPoller] Found ${P.length} unread message(s)`), Dz() && MC1())
                for (let b of P) {
                    let g = iP1(b.text);
                    if (g && b.from === "team-lead")
                        if (h(`[InboxPoller] Received plan approval response from team-lead: approved=${g.approved}`), g.approved) {
                            let U = g.permissionMode ?? "default";
                            H((x) => ({
                                ...x,
                                toolPermissionContext: a2(x.toolPermissionContext, {
                                    type: "setMode",
                                    mode: KA1(U),
                                    destination: "session"
                                })
                            })), h(`[InboxPoller] Plan approved by team lead, exited plan mode to ${U}`)
                        } else h(`[InboxPoller] Plan rejected by team lead: ${g.feedback||"No feedback provided"}`);
                    else if (g) h(`[InboxPoller] Ignoring plan approval response from non-team-lead: ${b.from}`)
                }
            XQ1(M, j.teamContext?.teamName);
            let W = [],
                G = [],
                f = [],
                Z = [],
                N = [],
                T = [],
                k = [],
                y = [],
                B = [];
            for (let b of P) {
                let g = MQ1(b.text),
                    U = w51(b.text),
                    x = WM6(b.text),
                    p = PQ1(b.text),
                    l = ss(b.text),
                    r = UZ(b.text),
                    s = NM6(b.text),
                    O1 = vM6(b.text);
                if (g) W.push(b);
                else if (U) G.push(b);
                else if (x) f.push(b);
                else if (p) Z.push(b);
                else if (l) N.push(b);
                else if (r) T.push(b);
                else if (s) k.push(b);
                else if (O1) y.push(b);
                else B.push(b)
            }
            if (W.length > 0 && PM(j.teamContext)) {
                h(`[InboxPoller] Found ${W.length} permission request(s)`);
                let b = iM6(),
                    g = j.teamContext?.teamName;
                for (let x of W) {
                    let p = MQ1(x.text);
                    if (!p) continue;
                    if (b) {
                        let l = Tv(kt(), p.tool_name);
                        if (!l) {
                            h(`[InboxPoller] Unknown tool ${p.tool_name}, skipping permission request`);
                            continue
                        }
                        let r = {
                            assistantMessage: qR({
                                content: ""
                            }),
                            tool: l,
                            description: p.description,
                            input: p.input,
                            toolUseContext: {},
                            toolUseID: p.tool_use_id,
                            permissionResult: {
                                behavior: "ask",
                                message: p.description
                            },
                            permissionPromptStartTimeMs: Date.now(),
                            workerBadge: {
                                name: p.agent_id,
                                color: "cyan"
                            },
                            onUserInteraction() {},
                            onAbort() {
                                dM6(p.agent_id, {
                                    decision: "rejected",
                                    resolvedBy: "leader"
                                }, p.request_id, g)
                            },
                            onAllow(s, O1) {
                                dM6(p.agent_id, {
                                    decision: "approved",
                                    resolvedBy: "leader",
                                    updatedInput: s,
                                    permissionUpdates: O1
                                }, p.request_id, g)
                            },
                            onReject(s) {
                                dM6(p.agent_id, {
                                    decision: "rejected",
                                    resolvedBy: "leader",
                                    feedback: s
                                }, p.request_id, g)
                            },
                            async recheckPermission() {}
                        };
                        b((s) => {
                            if (s.some((O1) => O1.toolUseID === p.tool_use_id)) return s;
                            return [...s, r]
                        })
                    } else h(`[InboxPoller] ToolUseConfirmQueue unavailable, dropping permission request from ${p.agent_id}`)
                }
                let U = MQ1(W[0]?.text ?? "");
                if (U && !q && !K) Nm({
                    message: `${U.agent_id} needs permission for ${U.tool_name}`,
                    notificationType: "worker_permission_prompt"
                }, O)
            }
            if (G.length > 0 && Dz()) {
                h(`[InboxPoller] Found ${G.length} permission response(s)`);
                for (let b of G) {
                    let g = w51(b.text);
                    if (!g) continue;
                    if (Bb4(g.request_id))
                        if (h(`[InboxPoller] Processing permission response for ${g.request_id}: ${g.subtype}`), g.subtype === "success") eP1({
                            requestId: g.request_id,
                            decision: "approved",
                            updatedInput: g.response?.updated_input,
                            permissionUpdates: g.response?.permission_updates
                        });
                        else eP1({
                            requestId: g.request_id,
                            decision: "rejected",
                            feedback: g.error
                        })
                }
            }
            if (f.length > 0 && PM(j.teamContext)) {
                h(`[InboxPoller] Found ${f.length} sandbox permission request(s)`);
                let b = [];
                for (let g of f) {
                    let U = WM6(g.text);
                    if (!U) continue;
                    if (!U.hostPattern?.host) {
                        h("[InboxPoller] Invalid sandbox permission request: missing hostPattern.host");
                        continue
                    }
                    b.push({
                        requestId: U.requestId,
                        workerId: U.workerId,
                        workerName: U.workerName,
                        workerColor: U.workerColor,
                        host: U.hostPattern.host,
                        createdAt: U.createdAt
                    })
                }
                if (b.length > 0) {
                    H((U) => ({
                        ...U,
                        workerSandboxPermissions: {
                            ...U.workerSandboxPermissions,
                            queue: [...U.workerSandboxPermissions.queue, ...b]
                        }
                    }));
                    let g = b[0];
                    if (g && !q && !K) Nm({
                        message: `${g.workerName} needs network access to ${g.host}`,
                        notificationType: "worker_permission_prompt"
                    }, O)
                }
            }
            if (Z.length > 0 && Dz()) {
                h(`[InboxPoller] Found ${Z.length} sandbox permission response(s)`);
                for (let b of Z) {
                    let g = PQ1(b.text);
                    if (!g) continue;
                    if (Fb4(g.requestId)) h(`[InboxPoller] Processing sandbox permission response for ${g.requestId}: allow=${g.allow}`), Qb4({
                        requestId: g.requestId,
                        host: g.host,
                        allow: g.allow
                    }), H((U) => ({
                        ...U,
                        pendingSandboxRequest: null
                    }))
                }
            }
            if (k.length > 0 && Dz()) {
                h(`[InboxPoller] Found ${k.length} team permission update(s)`);
                for (let b of k) {
                    let g = NM6(b.text);
                    if (!g) {
                        h(`[InboxPoller] Failed to parse team permission update: ${b.text.substring(0,100)}`);
                        continue
                    }
                    if (!g.permissionUpdate?.rules || !g.permissionUpdate?.behavior) {
                        h("[InboxPoller] Invalid team permission update: missing permissionUpdate.rules or permissionUpdate.behavior");
                        continue
                    }
                    h(`[InboxPoller] Applying team permission update: ${g.toolName} allowed in ${g.directoryPath}`), h(`[InboxPoller] Permission update rules: ${Q1(g.permissionUpdate.rules)}`), H((U) => {
                        let x = a2(U.toolPermissionContext, {
                            type: "addRules",
                            rules: g.permissionUpdate.rules,
                            behavior: g.permissionUpdate.behavior,
                            destination: "session"
                        });
                        return h(`[InboxPoller] Updated session allow rules: ${Q1(x.alwaysAllowRules.session)}`), {
                            ...U,
                            toolPermissionContext: x
                        }
                    })
                }
            }
            if (y.length > 0 && Dz()) {
                h(`[InboxPoller] Found ${y.length} mode set request(s)`);
                for (let b of y) {
                    if (b.from !== "team-lead") {
                        h(`[InboxPoller] Ignoring mode set request from non-team-lead: ${b.from}`);
                        continue
                    }
                    let g = vM6(b.text);
                    if (!g) {
                        h(`[InboxPoller] Failed to parse mode set request: ${b.text.substring(0,100)}`);
                        continue
                    }
                    let U = jC(g.mode);
                    h(`[InboxPoller] Applying mode change from team-lead: ${U}`), H((l) => ({
                        ...l,
                        toolPermissionContext: a2(l.toolPermissionContext, {
                            type: "setMode",
                            mode: KA1(U),
                            destination: "session"
                        })
                    }));
                    let x = j.teamContext?.teamName,
                        p = g5();
                    if (x && p) xF1(x, p, U)
                }
            }
            if (N.length > 0 && Dz()) {
                h(`[InboxPoller] Found ${N.length} shutdown request(s)`);
                for (let b of N) B.push(b)
            }
            if (T.length > 0 && PM(j.teamContext)) {
                h(`[InboxPoller] Found ${T.length} shutdown approval(s)`);
                for (let b of T) {
                    let g = UZ(b.text);
                    if (!g) continue;
                    if (g.paneId && g.backendType)(async () => {
                        try {
                            await zt();
                            let x = await OI(),
                                l = await CEA(g.backendType)?.killPane(g.paneId, !x);
                            h(`[InboxPoller] Killed pane ${g.paneId} for ${g.from}: ${l}`)
                        } catch (x) {
                            h(`[InboxPoller] Failed to kill pane for ${g.from}: ${x}`)
                        }
                    })();
                    let U = g.from;
                    if (U && j.teamContext?.teammates) {
                        let x = Object.entries(j.teamContext.teammates).find(([, p]) => p.name === U)?.[0];
                        if (x) {
                            let p = j.teamContext?.teamName;
                            if (p) EP1(p, {
                                agentId: x,
                                name: U
                            });
                            let {
                                notificationMessage: l
                            } = p ? Mr(p, x, U, "shutdown") : {
                                notificationMessage: `${U} has shut down.`
                            };
                            H((r) => {
                                if (!r.teamContext?.teammates) return r;
                                if (!(x in r.teamContext.teammates)) return r;
                                let {
                                    [x]: s, ...O1
                                } = r.teamContext.teammates, T1 = {
                                    ...r.tasks
                                };
                                for (let [N1, j1] of Object.entries(T1))
                                    if (pO(j1) && j1.identity.agentId === x) T1[N1] = {
                                        ...j1,
                                        status: "completed",
                                        endTime: Date.now()
                                    };
                                return {
                                    ...r,
                                    tasks: T1,
                                    teamContext: {
                                        ...r.teamContext,
                                        teammates: O1
                                    },
                                    inbox: {
                                        messages: [...r.inbox.messages, {
                                            id: NVq(),
                                            from: "system",
                                            text: Q1({
                                                type: "teammate_terminated",
                                                message: l
                                            }),
                                            timestamp: new Date().toISOString(),
                                            status: "pending"
                                        }]
                                    }
                                }
                            }), h(`[InboxPoller] Removed ${U} (${x}) from teamContext`)
                        }
                    }
                    B.push(b)
                }
            }
            if (B.length === 0) return;
            let S = B.map((b) => {
                    let g = b.color ? ` color="${b.color}"` : "",
                        U = b.summary ? ` summary="${b.summary}"` : "",
                        x = b.text;
                    return `<${qJ} teammate_id="${b.from}"${g}${U}>
${x}
</${qJ}>`
                }).join(`

`),
                m = () => {
                    H((b) => ({
                        ...b,
                        inbox: {
                            messages: [...b.inbox.messages, ...B.map((g) => ({
                                id: NVq(),
                                from: g.from,
                                text: g.text,
                                timestamp: g.timestamp,
                                status: "pending",
                                color: g.color,
                                summary: g.summary
                            }))]
                        }
                    }))
                };
            if (!q && !K) {
                if (h("[InboxPoller] Session idle, submitting immediately"), !z(S)) h("[InboxPoller] Submission rejected, queuing for later delivery"), m()
            } else h("[InboxPoller] Session busy, queuing for later delivery"), m()
        }, [A, q, K, z, H, O, w]);
    j11.useEffect(() => {
        if (!A) return;
        let j = _.current;
        if (_.current = q, q || K) return;
        let M = w.getState();
        if (!ZE6(M)) return;
        let W = M.inbox.messages.filter((k) => k.status === "pending"),
            G = M.inbox.messages.filter((k) => k.status === "processed");
        if (G.length > 0) {
            h(`[InboxPoller] Cleaning up ${G.length} processed message(s) that were delivered mid-turn`);
            let k = new Set(G.map((y) => y.id));
            H((y) => ({
                ...y,
                inbox: {
                    messages: y.inbox.messages.filter((B) => !k.has(B.id))
                }
            }))
        }
        if (W.length === 0) return;
        let f = j,
            Z = !j && W.length > 0;
        if (!f && !Z) return;
        h(`[InboxPoller] Session idle, delivering ${W.length} pending message(s)`);
        let N = W.map((k) => {
            let y = k.color ? ` color="${k.color}"` : "",
                B = k.summary ? ` summary="${k.summary}"` : "";
            return `<${qJ} teammate_id="${k.from}"${y}${B}>
${k.text}
</${qJ}>`
        }).join(`

`);
        if (z(N)) {
            let k = new Set(W.map((y) => y.id));
            H((y) => ({
                ...y,
                inbox: {
                    messages: y.inbox.messages.filter((B) => !k.has(B.id))
                }
            }))
        } else h("[InboxPoller] Submission rejected, keeping messages queued")
    }, [A, q, K, z, H, $, w]);
    let X = A && !!ZE6(w.getState());
    RX(J, X ? aMz : null);
    let D = j11.useRef(!1);
    j11.useEffect(() => {
        if (!A) return;
        if (D.current) return;
        if (ZE6(w.getState())) D.current = !0, J()
    }, [A, J, w])
}
// @from(Ln 482791, Col 4)
j11
// @from(Ln 482791, Col 9)
aMz = 1000
// @from(Ln 482792, Col 4)
vVq = v(() => {
    XZ();
    H$();
    Cz();
    Yv();
    vz();
    CO();
    oj();
    XN();
    Z6();
    d8();
    aF1();
    $q1();
    tP1();
    m6();
    yQ1();
    $P();
    N8();
    JI();
    Lm();
    vw();
    j11 = o(X1(), 1)
})
// @from(Ln 482815, Col 4)
egA
// @from(Ln 482816, Col 4)
EVq = v(() => {
    vw();
    Z6();
    egA = o(X1(), 1)
})
// @from(Ln 482822, Col 0)
function LVq(A) {
    let q = e(7),
        {
            autoConnectIdeFlag: K,
            ideToInstallExtension: Y,
            setDynamicMcpConfig: z,
            setShowIdeOnboarding: w,
            setIDEInstallationState: H
        } = A,
        $, O;
    if (q[0] !== K || q[1] !== Y || q[2] !== z || q[3] !== H || q[4] !== w) $ = () => {
        Fx7(function(X) {
            if (!X) return;
            if (!((f6().autoConnectIde || K || bX() || Y || J6(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE)) && !FY(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE))) return;
            z((M) => {
                if (M?.ide) return M;
                return {
                    ...M,
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
        }, Y, () => w(!0), (J) => H(J))
    }, O = [K, Y, z, w, H], q[0] = K, q[1] = Y, q[2] = z, q[3] = H, q[4] = w, q[5] = $, q[6] = O;
    else $ = q[5], O = q[6];
    kVq.useEffect($, O)
}
// @from(Ln 482855, Col 4)
kVq
// @from(Ln 482856, Col 4)
RVq = v(() => {
    i1();
    cA();
    q$();
    hA();
    kVq = o(X1(), 1)
})
// @from(Ln 482864, Col 0)
function CVq(A) {
    let q = e(8),
        {
            onBackgroundSession: K,
            isLoading: Y
        } = A,
        z = L7(),
        w = B_(),
        [H, $] = yVq.useState(!1),
        O = iS($, K, sMz),
        _;
    if (q[0] !== w || q[1] !== O || q[2] !== Y || q[3] !== z) _ = () => {
        if (J6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)) return;
        let P = w.getState();
        if (Dd7(P)) m_6(() => w.getState(), z)
    }, q[0] = w, q[1] = O, q[2] = Y, q[3] = z, q[4] = _;
    else _ = q[4];
    let J = _,
        X;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) X = {
        context: "Task"
    }, q[5] = X;
    else X = q[5];
    DA("task:background", J, X);
    let D = RK("task:background", "Task", "ctrl+b"),
        j = xA.terminal === "tmux" && D === "ctrl+b" ? "ctrl+b ctrl+b" : D;
    if (!Y || !H) return null;
    let M;
    if (q[6] !== j) M = EY1.createElement(I, {
        paddingLeft: 2
    }, EY1.createElement(V, {
        dimColor: !0
    }, EY1.createElement(YA, {
        shortcut: j,
        action: "background"
    }))), q[6] = j, q[7] = M;
    else M = q[7];
    return M
}
// @from(Ln 482904, Col 0)
function sMz() {}
// @from(Ln 482905, Col 4)
EY1
// @from(Ln 482905, Col 9)
yVq
// @from(Ln 482906, Col 4)
SVq = v(() => {
    i1();
    m1();
    fx1();
    d8();
    kK1();
    wK();
    G5();
    hA();
    K7();
    s2();
    EY1 = o(X1(), 1), yVq = o(X1(), 1)
})
// @from(Ln 482920, Col 0)
function hVq({
    setMessages: A,
    setIsLoading: q,
    resetLoadingState: K,
    setAbortController: Y,
    onBackgroundQuery: z
}) {
    let w = v6((X) => X.foregroundedTaskId),
        H = v6((X) => X.tasks),
        $ = L7(),
        O = uf1.useRef(0),
        _ = uf1.useCallback(() => {
            if (w) {
                $((X) => {
                    let D = X.foregroundedTaskId;
                    if (!D) return X;
                    let j = X.tasks[D];
                    if (!j) return {
                        ...X,
                        foregroundedTaskId: void 0
                    };
                    return {
                        ...X,
                        foregroundedTaskId: void 0,
                        tasks: {
                            ...X.tasks,
                            [D]: {
                                ...j,
                                isBackgrounded: !0
                            }
                        }
                    }
                }), A([]), K(), Y(null);
                return
            }
            z()
        }, [w, $, A, K, Y, z]),
        J = w ? H[w] : void 0;
    return uf1.useEffect(() => {
        if (!w) {
            O.current = 0;
            return
        }
        if (!J || J.type !== "local_agent") {
            $((D) => ({
                ...D,
                foregroundedTaskId: void 0
            })), K(), O.current = 0;
            return
        }
        let X = J.messages ?? [];
        if (X.length !== O.current) O.current = X.length, A([...X]);
        if (J.status === "running") {
            let D = J.abortController;
            if (D?.signal.aborted) {
                $((j) => {
                    if (!j.foregroundedTaskId) return j;
                    let M = j.tasks[j.foregroundedTaskId];
                    if (!M) return {
                        ...j,
                        foregroundedTaskId: void 0
                    };
                    return {
                        ...j,
                        foregroundedTaskId: void 0,
                        tasks: {
                            ...j.tasks,
                            [j.foregroundedTaskId]: {
                                ...M,
                                isBackgrounded: !0
                            }
                        }
                    }
                }), K(), Y(null), O.current = 0;
                return
            }
            if (q(!0), D) Y(D)
        } else $((D) => {
            let j = D.foregroundedTaskId;
            if (!j) return D;
            let M = D.tasks[j];
            if (!M) return {
                ...D,
                foregroundedTaskId: void 0
            };
            return {
                ...D,
                foregroundedTaskId: void 0,
                tasks: {
                    ...D.tasks,
                    [j]: {
                        ...M,
                        isBackgrounded: !0
                    }
                }
            }
        }), K(), Y(null), O.current = 0
    }, [w, J, $, A, q, K, Y]), {
        handleBackgroundSession: _
    }
}
// @from(Ln 483021, Col 4)
uf1
// @from(Ln 483022, Col 4)
IVq = v(() => {
    d8();
    uf1 = o(X1(), 1)
})
// @from(Ln 483027, Col 0)
function xVq(A, q) {
    let [K, Y] = AUA.default.useState(q);
    return AUA.default.useEffect(() => {
        CI(A, q).then(Y)
    }, [A, q]), K
}
// @from(Ln 483033, Col 4)
AUA
// @from(Ln 483034, Col 4)
bVq = v(() => {
    U4();
    AUA = o(X1(), 1)
})
// @from(Ln 483042, Col 0)
function VE6(A) {
    let q = e(13),
        {
            hideThanksAfterMs: K,
            onOpen: Y,
            onSelect: z
        } = A,
        [w, H] = fE6.useState("closed"),
        $;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = uVq(), q[0] = $;
    else $ = q[0];
    let O = fE6.useRef($),
        _;
    if (q[1] !== K) _ = () => {
        H("thanks"), setTimeout(() => H("closed"), K)
    }, q[1] = K, q[2] = _;
    else _ = q[2];
    let J = _,
        X;
    if (q[3] !== Y || q[4] !== w) X = () => {
        if (w !== "closed") return;
        H("open"), O.current = uVq(), Y(O.current)
    }, q[3] = Y, q[4] = w, q[5] = X;
    else X = q[5];
    let D = X,
        j;
    if (q[6] !== z || q[7] !== J) j = (W) => {
        if (W === "dismissed") H("closed");
        else J();
        z(O.current, W)
    }, q[6] = z, q[7] = J, q[8] = j;
    else j = q[8];
    let M = j,
        P;
    if (q[9] !== M || q[10] !== D || q[11] !== w) P = {
        state: w,
        open: D,
        handleSelect: M
    }, q[9] = M, q[10] = D, q[11] = w, q[12] = P;
    else P = q[12];
    return P
}
// @from(Ln 483084, Col 4)
fE6
// @from(Ln 483085, Col 4)
qUA = v(() => {
    i1();
    fE6 = o(X1(), 1)
})
// @from(Ln 483090, Col 0)
function BVq(A, q, K, Y = "session", z = !1) {
    let w = pN.useRef("unknown");
    w.current = GN(A)?.message?.id || "unknown";
    let H = v6((T) => T.feedbackSurvey),
        $ = L7(),
        O = xVq("tengu_feedback_survey_config", tMz),
        _ = pN.useRef(Date.now()),
        J = pN.useRef(K),
        X = pN.useRef(K);
    X.current = K;
    let D = pN.useCallback((T, k) => {
            $((y) => ({
                ...y,
                feedbackSurvey: {
                    timeLastShown: T,
                    submitCountAtLastAppearance: k
                }
            }))
        }, [$]),
        j = pN.useCallback((T) => {
            D(Date.now(), X.current), c("tengu_feedback_survey_event", {
                event_type: "appeared",
                appearance_id: T,
                last_assistant_message_id: w.current,
                survey_type: Y
            })
        }, [D, Y]),
        M = pN.useCallback((T, k) => {
            D(Date.now(), X.current), c("tengu_feedback_survey_event", {
                event_type: "responded",
                appearance_id: T,
                response: k,
                last_assistant_message_id: w.current,
                survey_type: Y
            })
        }, [D, Y]),
        {
            state: P,
            open: W,
            handleSelect: G
        } = VE6({
            hideThanksAfterMs: O.hideThanksAfterMs,
            onOpen: j,
            onSelect: M
        }),
        f = l3(),
        Z = pN.useMemo(() => {
            if (O.onForModels.length === 0) return !1;
            if (O.onForModels.includes("*")) return !0;
            return O.onForModels.includes(f)
        }, [O.onForModels, f]),
        N = pN.useMemo(() => {
            if (P !== "closed") return !1;
            if (q) return !1;
            if (z) return !1;
            if (process.env.CLAUDE_FORCE_DISPLAY_SURVEY && !H.timeLastShown) return !0;
            if (!Z) return !1;
            if (J6(process.env.CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY)) return !1;
            if (BZ()) return !1;
            if (!p0("allow_product_feedback")) return !1;
            if (H.timeLastShown) {
                if (H.submitCountAtLastAppearance !== null && K < H.submitCountAtLastAppearance + O.minUserTurnsBetweenFeedback) return !1
            } else {
                if (Date.now() - _.current < O.minTimeBeforeFeedbackMs) return !1;
                if (K < J.current + O.minUserTurnsBeforeFeedback) return !1
            }
            if (Math.random() > O.probability) return !1;
            let T = f6().feedbackSurveyState;
            if (T?.lastShownTime) {
                if (Date.now() - T.lastShownTime < O.minTimeBetweenGlobalFeedbackMs) return !1
            }
            return !0
        }, [P, q, z, Z, H.timeLastShown, H.submitCountAtLastAppearance, K, O.minTimeBetweenGlobalFeedbackMs, O.minUserTurnsBetweenFeedback, O.minTimeBeforeFeedbackMs, O.minUserTurnsBeforeFeedback, O.probability]);
    return pN.useEffect(() => {
        if (N) W()
    }, [N, W]), {
        state: P,
        handleSelect: G
    }
}
// @from(Ln 483170, Col 4)
pN
// @from(Ln 483170, Col 8)
tMz
// @from(Ln 483171, Col 4)
mVq = v(() => {
    bVq();
    u6();
    Js();
    mV();
    cA();
    e7();
    hA();
    d8();
    N8();
    qUA();
    pN = o(X1(), 1), tMz = {
        minTimeBeforeFeedbackMs: 600000,
        minTimeBetweenGlobalFeedbackMs: 1e8,
        minUserTurnsBeforeFeedback: 5,
        minUserTurnsBetweenFeedback: 10,
        hideThanksAfterMs: 3000,
        onForModels: ["*"],
        probability: 0.005
    }
})
// @from(Ln 483193, Col 0)
function KPz(A, q) {
    let K = A.findIndex((Y) => Y.uuid === q);
    if (K === -1) return !1;
    for (let Y = K + 1; Y < A.length; Y++) {
        let z = A[Y];
        if (z && (z.type === "user" || z.type === "assistant")) return !0
    }
    return !1
}
// @from(Ln 483203, Col 0)
function FVq(A, q, K) {
    let Y = e(18),
        z = K === void 0 ? !1 : K,
        [w, H] = M11.useState(null),
        $;
    if (Y[0] === Symbol.for("react.memo_cache_sentinel")) $ = new Set, Y[0] = $;
    else $ = Y[0];
    let O = M11.useRef($),
        _ = M11.useRef(null),
        J = HPz,
        X = wPz,
        D;
    if (Y[1] === Symbol.for("react.memo_cache_sentinel")) D = {
        hideThanksAfterMs: eMz,
        onOpen: J,
        onSelect: X
    }, Y[1] = D;
    else D = Y[1];
    let {
        state: j,
        open: M,
        handleSelect: P
    } = VE6(D), W, G;
    if (Y[2] === Symbol.for("react.memo_cache_sentinel")) W = () => {
        H(i2(APz))
    }, G = [], Y[2] = W, Y[3] = G;
    else W = Y[2], G = Y[3];
    M11.useEffect(W, G);
    let f;
    if (Y[4] !== A) f = new Set(A.filter(zPz).map(YPz)), Y[4] = A, Y[5] = f;
    else f = Y[5];
    let Z = f,
        N, T;
    if (Y[6] !== Z || Y[7] !== w || Y[8] !== z || Y[9] !== q || Y[10] !== A || Y[11] !== M || Y[12] !== j) N = () => {
        if (j !== "closed" || q) return;
        if (z) return;
        if (w !== !0) return;
        if (BZ()) return;
        if (J6(process.env.CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY)) return;
        if (_.current !== null) {
            if (KPz(A, _.current)) {
                if (_.current = null, Math.random() < qPz) M();
                return
            }
        }
        let y = Array.from(Z).filter((B) => !O.current.has(B));
        if (y.length > 0) O.current = new Set(Z), _.current = y[y.length - 1]
    }, T = [Z, j, q, z, w, A, M], Y[6] = Z, Y[7] = w, Y[8] = z, Y[9] = q, Y[10] = A, Y[11] = M, Y[12] = j, Y[13] = N, Y[14] = T;
    else N = Y[13], T = Y[14];
    M11.useEffect(N, T);
    let k;
    if (Y[15] !== P || Y[16] !== j) k = {
        state: j,
        handleSelect: P
    }, Y[15] = P, Y[16] = j, Y[17] = k;
    else k = Y[17];
    return k
}
// @from(Ln 483262, Col 0)
function YPz(A) {
    return A.uuid
}
// @from(Ln 483266, Col 0)
function zPz(A) {
    return cR(A)
}
// @from(Ln 483270, Col 0)
function wPz(A, q) {
    let K = TZ6();
    c("tengu_post_compact_survey_event", {
        event_type: "responded",
        appearance_id: A,
        response: q,
        session_memory_compaction_enabled: K
    })
}
// @from(Ln 483280, Col 0)
function HPz(A) {
    let q = TZ6();
    c("tengu_post_compact_survey_event", {
        event_type: "appeared",
        appearance_id: A,
        session_memory_compaction_enabled: q
    })
}
// @from(Ln 483288, Col 4)
M11
// @from(Ln 483288, Col 9)
eMz = 3000
// @from(Ln 483289, Col 4)
APz = "tengu_post_compact_survey"
// @from(Ln 483290, Col 4)
qPz = 0.2
// @from(Ln 483291, Col 4)
QVq = v(() => {
    i1();
    U4();
    u6();
    Js();
    hA();
    N8();
    qUA();
    EZ6();
    M11 = o(X1(), 1)
})
// @from(Ln 483303, Col 0)
function gVq(A) {
    let q = e(14),
        {
            onSelect: K,
            inputValue: Y,
            setInputValue: z,
            message: w
        } = A,
        H = w === void 0 ? _Pz : w,
        $ = NE6.useRef(Y),
        O, _;
    if (q[0] !== Y || q[1] !== K || q[2] !== z) O = () => {
        if (Y !== $.current) {
            let G = mD1(Y.slice(-1));
            if (KUA(G)) z(Y.slice(0, -1)), K(OPz[G])
        }
    }, _ = [Y, K, z], q[0] = Y, q[1] = K, q[2] = z, q[3] = O, q[4] = _;
    else O = q[3], _ = q[4];
    NE6.useEffect(O, _);
    let J;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) J = Bj.default.createElement(V, {
        color: "ansi:cyan"
    }, "● "), q[5] = J;
    else J = q[5];
    let X;
    if (q[6] !== H) X = Bj.default.createElement(I, null, J, Bj.default.createElement(V, {
        bold: !0
    }, H)), q[6] = H, q[7] = X;
    else X = q[7];
    let D;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) D = Bj.default.createElement(I, {
        width: 10
    }, Bj.default.createElement(V, null, Bj.default.createElement(V, {
        color: "ansi:cyan"
    }, "1"), ": Bad")), q[8] = D;
    else D = q[8];
    let j;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) j = Bj.default.createElement(I, {
        width: 10
    }, Bj.default.createElement(V, null, Bj.default.createElement(V, {
        color: "ansi:cyan"
    }, "2"), ": Fine")), q[9] = j;
    else j = q[9];
    let M;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) M = Bj.default.createElement(I, {
        width: 10
    }, Bj.default.createElement(V, null, Bj.default.createElement(V, {
        color: "ansi:cyan"
    }, "3"), ": Good")), q[10] = M;
    else M = q[10];
    let P;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) P = Bj.default.createElement(I, {
        marginLeft: 2
    }, D, j, M, Bj.default.createElement(I, null, Bj.default.createElement(V, null, Bj.default.createElement(V, {
        color: "ansi:cyan"
    }, "0"), ": Dismiss"))), q[11] = P;
    else P = q[11];
    let W;
    if (q[12] !== X) W = Bj.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, X, P), q[12] = X, q[13] = W;
    else W = q[13];
    return W
}
// @from(Ln 483368, Col 4)
Bj
// @from(Ln 483368, Col 8)
NE6
// @from(Ln 483368, Col 13)
$Pz
// @from(Ln 483368, Col 18)
OPz
// @from(Ln 483368, Col 23)
KUA = (A) => $Pz.includes(A)
// @from(Ln 483369, Col 4)
_Pz = "How is Claude doing this session? (optional)"
// @from(Ln 483370, Col 4)
UVq = v(() => {
    i1();
    m1();
    Bj = o(X1(), 1), NE6 = o(X1(), 1), $Pz = ["0", "1", "2", "3"], OPz = {
        "0": "dismissed",
        "1": "bad",
        "2": "fine",
        "3": "good"
    }
})
// @from(Ln 483381, Col 0)
function YUA(A) {
    let q = e(6),
        {
            state: K,
            handleSelect: Y,
            inputValue: z,
            setInputValue: w,
            message: H
        } = A;
    if (K === "closed") return null;
    if (K === "thanks") {
        let _;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = nc1.default.createElement(I, {
            marginTop: 1,
            flexDirection: "column"
        }, nc1.default.createElement(V, {
            color: "success"
        }, "✓ Thanks for helping make Claude better!"), nc1.default.createElement(V, {
            dimColor: !0
        }, "Use ", "/feedback", " to share detailed feedback or file a bug.")), q[0] = _;
        else _ = q[0];
        return _
    }
    if (z && !KUA(z)) return null;
    let $;
    if (q[1] !== Y || q[2] !== z || q[3] !== H || q[4] !== w) $ = nc1.default.createElement(gVq, {
        onSelect: Y,
        inputValue: z,
        setInputValue: w,
        message: H
    }), q[1] = Y, q[2] = z, q[3] = H, q[4] = w, q[5] = $;
    else $ = q[5];
    return $
}
// @from(Ln 483415, Col 4)
nc1
// @from(Ln 483416, Col 4)
pVq = v(() => {
    i1();
    m1();
    UVq();
    nc1 = o(X1(), 1)
})
// @from(Ln 483423, Col 0)
function cVq() {
    let A = e(3),
        {
            addNotification: q
        } = iq(),
        K, Y;
    if (A[0] !== q) K = () => {
        if (Nq()) return;
        tm().then((z) => {
            z.forEach((w, H) => {
                let $ = "low";
                if (w.type === "error" || w.userActionRequired) $ = "high";
                else if (w.type === "path" || w.type === "alias") $ = "medium";
                q({
                    key: `install-message-${H}-${w.type}`,
                    text: w.message,
                    priority: $,
                    color: w.type === "error" ? "error" : "warning"
                })
            })
        })
    }, Y = [q], A[0] = q, A[1] = K, A[2] = Y;
    else K = A[1], Y = A[2];
    dVq.useEffect(K, Y)
}
// @from(Ln 483448, Col 4)
dVq
// @from(Ln 483449, Col 4)
lVq = v(() => {
    i1();
    B6();
    h2();
    BI();
    dVq = o(X1(), 1)
})
// @from(Ln 483457, Col 0)
function JPz() {
    if (process.argv.includes("--chrome")) return !0;
    if (process.argv.includes("--no-chrome")) return !1;
    return
}
// @from(Ln 483463, Col 0)
function iVq() {
    let A = e(3),
        {
            addNotification: q
        } = iq(),
        K, Y;
    if (A[0] !== q) K = () => {
        if (Nq()) return;
        let z = JPz();
        if (!UN6(z)) return;
        if (!i8()) {
            q({
                key: "chrome-requires-subscription",
                jsx: Ry.createElement(V, {
                    color: "error"
                }, "Claude in Chrome requires a claude.ai subscription"),
                priority: "immediate",
                timeoutMs: 5000
            });
            return
        }
        Ec().then((w) => {
            if (!w && !tlA()) q({
                key: "chrome-extension-not-detected",
                jsx: Ry.createElement(Ry.Fragment, null, Ry.createElement(V, {
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
        }).catch(XPz)
    }, Y = [q], A[0] = q, A[1] = K, A[2] = Y;
    else K = A[1], Y = A[2];
    Ry.useEffect(K, Y)
}
// @from(Ln 483504, Col 0)
function XPz(A) {
    K1(A)
}
// @from(Ln 483507, Col 4)
Ry
// @from(Ln 483508, Col 4)
nVq = v(() => {
    i1();
    m1();
    B6();
    r91();
    h2();
    y6();
    J7();
    hA();
    Ry = o(X1(), 1)
})
// @from(Ln 483520, Col 0)
function rVq() {
    let A = e(3),
        {
            addNotification: q
        } = iq(),
        K = BE.useRef(!1),
        Y, z;
    if (A[0] !== q) Y = () => {
        if (Nq()) return;
        if (K.current) return;
        K.current = !0, vv6().then((w) => {
            if (w.configSaveFailed) h("Showing marketplace config save failure notification"), q({
                key: "marketplace-config-save-failed",
                jsx: BE.createElement(V, {
                    color: "error"
                }, "Failed to save marketplace retry info · Check ~/.claude.json permissions"),
                priority: "immediate",
                timeoutMs: 1e4
            });
            if (w.installed) h("Showing marketplace installation success notification"), q({
                key: "marketplace-installed",
                jsx: BE.createElement(V, {
                    color: "success"
                }, "✓ Anthropic marketplace installed · /plugin to see available plugins"),
                priority: "immediate",
                timeoutMs: 7000
            });
            else if (w.skipped && w.reason === "unknown") h("Showing marketplace installation failure notification"), q({
                key: "marketplace-install-failed",
                jsx: BE.createElement(V, {
                    color: "warning"
                }, "Failed to install Anthropic marketplace · Will retry on next startup"),
                priority: "immediate",
                timeoutMs: 8000
            });
            else if (w.skipped && w.reason === "git_unavailable") h("Showing marketplace git unavailable notification"), q({
                key: "marketplace-git-unavailable",
                jsx: BE.createElement(V, {
                    color: "warning"
                }, "Anthropic marketplace requires git · Install git and restart"),
                priority: "immediate",
                timeoutMs: 8000
            })
        }).catch(DPz)
    }, z = [q], A[0] = q, A[1] = Y, A[2] = z;
    else Y = A[1], z = A[2];
    BE.useEffect(Y, z)
}
// @from(Ln 483569, Col 0)
function DPz(A) {
    K1(A instanceof Error ? A : Error(String(A)))
}
// @from(Ln 483572, Col 4)
BE
// @from(Ln 483573, Col 4)
oVq = v(() => {
    i1();
    m1();
    B6();
    h2();
    cQA();
    y6();
    Z6();
    BE = o(X1(), 1)
})
// @from(Ln 483584, Col 0)
function aVq(A, q) {
    let K = e(6);
    rc1.useRef(void 0);
    let Y;
    if (K[0] !== A) Y = [A], K[0] = A, K[1] = Y;
    else Y = K[1];
    rc1.useEffect(MPz, Y);
    let z, w;
    if (K[2] !== A || K[3] !== q) z = () => {
        let H = A.find(jPz);
        if (!H) return;
        _h("set_permission_mode", {
            mode: q === "bypassPermissions" ? "skip_all_permission_checks" : "ask"
        }, H)
    }, w = [A, q], K[2] = A, K[3] = q, K[4] = z, K[5] = w;
    else z = K[4], w = K[5];
    rc1.useEffect(z, w)
}
// @from(Ln 483603, Col 0)
function jPz(A) {
    return A.type === "connected" && A.name === qy
}
// @from(Ln 483607, Col 0)
function MPz() {}
// @from(Ln 483608, Col 4)
rc1
// @from(Ln 483608, Col 9)
DXO
// @from(Ln 483609, Col 4)
sVq = v(() => {
    i1();
    i7();
    kI();
    SW();
    rc1 = o(X1(), 1), DXO = u.object({
        method: u.literal("notifications/message"),
        params: u.object({
            prompt: u.string(),
            image: u.object({
                type: u.literal("base64"),
                media_type: u.enum(["image/jpeg", "image/png", "image/gif", "image/webp"]),
                data: u.string()
            }).optional(),
            tabId: u.number().optional()
        })
    })
})
// @from(Ln 483628, Col 0)
function PPz(A) {
    if (A.length === 0) return;
    if (A.length === 1) return A[0];
    let q = A.map((K) => ({
        tip: K,
        sessions: Yv6(K.id)
    }));
    return q.sort((K, Y) => Y.sessions - K.sessions), q[0]?.tip
}
// @from(Ln 483637, Col 0)
async function tVq(A) {
    if (C8().spinnerTipsEnabled === !1) return;
    let q = await zv6(A);
    if (q.length === 0) return;
    return PPz(q)
}
// @from(Ln 483644, Col 0)
function eVq(A) {
    eDq(A.id), c("tengu_tip_shown", {
        tipIdLength: A.id,
        cooldownSessions: A.cooldownSessions
    })
}
// @from(Ln 483650, Col 4)
ANq = v(() => {
    JQA();
    u6();
    p8();
    XQA()
})
// @from(Ln 483657, Col 0)
function KNq() {
    let A = v6((K) => K.toolPermissionContext),
        q = L7();
    qNq.useEffect(() => {
        zUA(A, q)
    }, [])
}
// @from(Ln 483664, Col 4)
qNq
// @from(Ln 483664, Col 9)
zUA
// @from(Ln 483665, Col 4)
YNq = v(() => {
    zq();
    d8();
    qp();
    qNq = o(X1(), 1), zUA = KA(async (A, q) => {
        if (!A.isBypassPermissionsModeAvailable) return;
        if (!await QmA()) return;
        q((Y) => {
            return {
                ...Y,
                toolPermissionContext: oD1(Y.toolPermissionContext)
            }
        })
    })
})
// @from(Ln 483681, Col 0)
function zNq(A, q, K) {
    let Y = TE6.useRef(!1);
    TE6.useEffect(() => {
        if (!z2() || Y.current) return;
        if (Y.current = !0, A) yP6(A, K)
    }, [q, A, K])
}
// @from(Ln 483688, Col 4)
TE6
// @from(Ln 483689, Col 4)
wNq = v(() => {
    ZN();
    TE6 = o(X1(), 1)
})
// @from(Ln 483694, Col 0)
function wUA(A) {
    let q = e(22),
        {
            hostPattern: K,
            onUserResponse: Y
        } = A,
        {
            host: z
        } = K,
        w;
    if (q[0] !== Y) w = function(T) {
        A: switch (T) {
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
    }, q[0] = Y, q[1] = w;
    else w = q[1];
    let H = w,
        $;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) $ = KC1(), q[2] = $;
    else $ = q[2];
    let O = $,
        _;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) _ = {
        label: "Yes",
        value: "yes"
    }, q[3] = _;
    else _ = q[3];
    let J;
    if (q[4] !== z) J = !O ? [{
        label: nw.createElement(V, null, "Yes, and don't ask again for ", nw.createElement(V, {
            bold: !0
        }, z)),
        value: "yes-dont-ask-again"
    }] : [], q[4] = z, q[5] = J;
    else J = q[5];
    let X;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) X = {
        label: nw.createElement(V, null, "No, and tell Claude what to do differently ", nw.createElement(V, {
            bold: !0
        }, "(esc)")),
        value: "no"
    }, q[6] = X;
    else X = q[6];
    let D;
    if (q[7] !== J) D = [_, ...J, X], q[7] = J, q[8] = D;
    else D = q[8];
    let j = D,
        M;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) M = nw.createElement(V, {
        dimColor: !0
    }, "Host:"), q[9] = M;
    else M = q[9];
    let P;
    if (q[10] !== z) P = nw.createElement(I, null, M, nw.createElement(V, null, " ", z)), q[10] = z, q[11] = P;
    else P = q[11];
    let W;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) W = nw.createElement(I, {
        marginTop: 1
    }, nw.createElement(V, null, "Do you want to allow this connection?")), q[12] = W;
    else W = q[12];
    let G;
    if (q[13] !== Y) G = () => {
        Y({
            allow: !1,
            persistToSettings: !1
        })
    }, q[13] = Y, q[14] = G;
    else G = q[14];
    let f;
    if (q[15] !== H || q[16] !== j || q[17] !== G) f = nw.createElement(I, null, nw.createElement(kA, {
        options: j,
        onChange: H,
        onCancel: G
    })), q[15] = H, q[16] = j, q[17] = G, q[18] = f;
    else f = q[18];
    let Z;
    if (q[19] !== f || q[20] !== P) Z = nw.createElement(Bw, {
        title: "Network request outside of sandbox"
    }, nw.createElement(I, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, P, W, f)), q[19] = f, q[20] = P, q[21] = Z;
    else Z = q[21];
    return Z
}
// @from(Ln 483798, Col 4)
nw
// @from(Ln 483799, Col 4)
HNq = v(() => {
    i1();
    m1();
    k2();
    U5();
    Bv();
    nw = o(X1(), 1)
})
// @from(Ln 483807, Col 4)
WPz
// @from(Ln 483807, Col 9)
SXO
// @from(Ln 483807, Col 14)
vE6 = 604800000
// @from(Ln 483808, Col 4)
$Nq = 86400000
// @from(Ln 483809, Col 4)
HUA
// @from(Ln 483810, Col 4)
oc1 = v(() => {
    WPz = Math.pow(10, 8) * 24 * 60 * 60 * 1000, SXO = -WPz, HUA = Symbol.for("constructDateFrom")
})
// @from(Ln 483814, Col 0)
function dN(A, q) {
    if (typeof A === "function") return A(q);
    if (A && typeof A === "object" && HUA in A) return A[HUA](q);
    if (A instanceof Date) return new A.constructor(q);
    return new Date(q)
}
// @from(Ln 483820, Col 4)
P11 = v(() => {
    oc1()
})
// @from(Ln 483824, Col 0)
function n_(A, q) {
    return dN(q || A, A)
}
// @from(Ln 483827, Col 4)
mE = v(() => {
    P11()
})
// @from(Ln 483830, Col 4)
ONq = () => {}
// @from(Ln 483831, Col 4)
_Nq = () => {}
// @from(Ln 483832, Col 4)
JNq = () => {}
// @from(Ln 483833, Col 4)
XNq = () => {}
// @from(Ln 483834, Col 4)
DNq = () => {}
// @from(Ln 483835, Col 4)
jNq = () => {}
// @from(Ln 483836, Col 4)
MNq = () => {}
// @from(Ln 483837, Col 4)
PNq = () => {}
// @from(Ln 483838, Col 4)
WNq = () => {}
// @from(Ln 483840, Col 0)
function W11() {
    return GPz
}
// @from(Ln 483843, Col 4)
GPz
// @from(Ln 483844, Col 4)
ac1 = v(() => {
    GPz = {}
})
// @from(Ln 483848, Col 0)
function ic(A, q) {
    let K = W11(),
        Y = q?.weekStartsOn ?? q?.locale?.options?.weekStartsOn ?? K.weekStartsOn ?? K.locale?.options?.weekStartsOn ?? 0,
        z = n_(A, q?.in),
        w = z.getDay(),
        H = (w < Y ? 7 : 0) + w - Y;
    return z.setDate(z.getDate() - H), z.setHours(0, 0, 0, 0), z
}
// @from(Ln 483856, Col 4)
Bf1 = v(() => {
    ac1();
    mE()
})
// @from(Ln 483861, Col 0)
function kY1(A, q) {
    return ic(A, {
        ...q,
        weekStartsOn: 1
    })
}
// @from(Ln 483867, Col 4)
sc1 = v(() => {
    Bf1()
})
// @from(Ln 483871, Col 0)
function EE6(A, q) {
    let K = n_(A, q?.in),
        Y = K.getFullYear(),
        z = dN(K, 0);
    z.setFullYear(Y + 1, 0, 4), z.setHours(0, 0, 0, 0);
    let w = kY1(z),
        H = dN(K, 0);
    H.setFullYear(Y, 0, 4), H.setHours(0, 0, 0, 0);
    let $ = kY1(H);
    if (K.getTime() >= w.getTime()) return Y + 1;
    else if (K.getTime() >= $.getTime()) return Y;
    else return Y - 1
}
// @from(Ln 483884, Col 4)
kE6 = v(() => {
    P11();
    sc1();
    mE()
})
// @from(Ln 483890, Col 0)
function $UA(A) {
    let q = n_(A),
        K = new Date(Date.UTC(q.getFullYear(), q.getMonth(), q.getDate(), q.getHours(), q.getMinutes(), q.getSeconds(), q.getMilliseconds()));
    return K.setUTCFullYear(q.getFullYear()), +A - +K
}
// @from(Ln 483895, Col 4)
GNq = v(() => {
    mE()
})
// @from(Ln 483899, Col 0)
function ZNq(A, ...q) {
    let K = dN.bind(null, A || q.find((Y) => typeof Y === "object"));
    return q.map(K)
}
// @from(Ln 483903, Col 4)
fNq = v(() => {
    P11()
})
// @from(Ln 483907, Col 0)
function OUA(A, q) {
    let K = n_(A, q?.in);
    return K.setHours(0, 0, 0, 0), K
}
// @from(Ln 483911, Col 4)
_UA = v(() => {
    mE()
})
// @from(Ln 483915, Col 0)
function VNq(A, q, K) {
    let [Y, z] = ZNq(K?.in, A, q), w = OUA(Y), H = OUA(z), $ = +w - $UA(w), O = +H - $UA(H);
    return Math.round(($ - O) / $Nq)
}
// @from(Ln 483919, Col 4)
JUA = v(() => {
    GNq();
    fNq();
    oc1();
    _UA()
})
// @from(Ln 483926, Col 0)
function NNq(A, q) {
    let K = EE6(A, q),
        Y = dN(q?.in || A, 0);
    return Y.setFullYear(K, 0, 4), Y.setHours(0, 0, 0, 0), kY1(Y)
}
// @from(Ln 483931, Col 4)
XUA = v(() => {
    P11();
    kE6();
    sc1()
})
// @from(Ln 483936, Col 4)
TNq = () => {}
// @from(Ln 483937, Col 4)
vNq = () => {}
// @from(Ln 483938, Col 4)
ENq = () => {}
// @from(Ln 483939, Col 4)
kNq = () => {}
// @from(Ln 483940, Col 4)
LNq = () => {}
// @from(Ln 483941, Col 4)
RNq = () => {}
// @from(Ln 483942, Col 4)
yNq = () => {}
// @from(Ln 483943, Col 4)
CNq = () => {}
// @from(Ln 483944, Col 4)
SNq = () => {}
// @from(Ln 483945, Col 4)
hNq = () => {}
// @from(Ln 483946, Col 4)
INq = () => {}
// @from(Ln 483947, Col 4)
xNq = () => {}
// @from(Ln 483948, Col 4)
bNq = () => {}
// @from(Ln 483949, Col 4)
uNq = () => {}
// @from(Ln 483950, Col 4)
BNq = () => {}
// @from(Ln 483951, Col 4)
mNq = () => {}
// @from(Ln 483952, Col 4)
FNq = () => {}
// @from(Ln 483953, Col 4)
QNq = () => {}
// @from(Ln 483955, Col 0)
function gNq(A) {
    return A instanceof Date || typeof A === "object" && Object.prototype.toString.call(A) === "[object Date]"
}
// @from(Ln 483958, Col 4)
DUA = () => {}
// @from(Ln 483960, Col 0)
function UNq(A) {
    return !(!gNq(A) && typeof A !== "number" || isNaN(+n_(A)))
}
// @from(Ln 483963, Col 4)
jUA = v(() => {
    DUA();
    mE()
})
// @from(Ln 483967, Col 4)
pNq = () => {}
// @from(Ln 483968, Col 4)
dNq = () => {}
// @from(Ln 483969, Col 4)
cNq = () => {}
// @from(Ln 483970, Col 4)
lNq = () => {}
// @from(Ln 483971, Col 4)
iNq = () => {}
// @from(Ln 483972, Col 4)
nNq = () => {}
// @from(Ln 483973, Col 4)
rNq = () => {}
// @from(Ln 483974, Col 4)
oNq = () => {}
// @from(Ln 483975, Col 4)
aNq = () => {}
// @from(Ln 483976, Col 4)
sNq = () => {}
// @from(Ln 483977, Col 4)
tNq = () => {}
// @from(Ln 483978, Col 4)
eNq = () => {}
// @from(Ln 483979, Col 4)
ATq = () => {}
// @from(Ln 483980, Col 4)
qTq = () => {}
// @from(Ln 483981, Col 4)
KTq = () => {}
// @from(Ln 483982, Col 4)
YTq = () => {}
// @from(Ln 483983, Col 4)
zTq = () => {}
// @from(Ln 483984, Col 4)
wTq = () => {}
// @from(Ln 483985, Col 4)
HTq = () => {}
// @from(Ln 483986, Col 4)
$Tq = () => {}
// @from(Ln 483987, Col 4)
OTq = () => {}
// @from(Ln 483988, Col 4)
_Tq = () => {}
// @from(Ln 483989, Col 4)
JTq = () => {}
// @from(Ln 483990, Col 4)
XTq = () => {}
// @from(Ln 483991, Col 4)
DTq = () => {}
// @from(Ln 483992, Col 4)
jTq = () => {}
// @from(Ln 483993, Col 4)
MTq = () => {}
// @from(Ln 483994, Col 4)
PTq = () => {}
// @from(Ln 483995, Col 4)
WTq = () => {}
// @from(Ln 483996, Col 4)
GTq = () => {}
// @from(Ln 483997, Col 4)
ZTq = () => {}
// @from(Ln 483998, Col 4)
fTq = () => {}
// @from(Ln 483999, Col 4)
VTq = () => {}
// @from(Ln 484001, Col 0)
function NTq(A, q) {
    let K = n_(A, q?.in);
    return K.setFullYear(K.getFullYear(), 0, 1), K.setHours(0, 0, 0, 0), K
}
// @from(Ln 484005, Col 4)
MUA = v(() => {
    mE()
})
// @from(Ln 484008, Col 4)
TTq = () => {}
// @from(Ln 484009, Col 4)
vTq = () => {}
// @from(Ln 484010, Col 4)
ETq = () => {}
// @from(Ln 484011, Col 4)
kTq = () => {}
// @from(Ln 484012, Col 4)
LTq = () => {}
// @from(Ln 484013, Col 4)
RTq = () => {}
// @from(Ln 484014, Col 4)
yTq = () => {}
// @from(Ln 484015, Col 4)
CTq = () => {}
// @from(Ln 484016, Col 4)
STq = () => {}
// @from(Ln 484017, Col 4)
hTq = () => {}
// @from(Ln 484018, Col 4)
ITq = () => {}
// @from(Ln 484019, Col 4)
xTq = () => {}
// @from(Ln 484020, Col 4)
bTq = () => {}
// @from(Ln 484021, Col 4)
ZPz
// @from(Ln 484021, Col 9)
uTq = (A, q, K) => {
    let Y, z = ZPz[A];
    if (typeof z === "string") Y = z;
    else if (q === 1) Y = z.one;
    else Y = z.other.replace("{{count}}", q.toString());
    if (K?.addSuffix)
        if (K.comparison && K.comparison > 0) return "in " + Y;
        else return Y + " ago";
    return Y
}
// @from(Ln 484031, Col 4)
BTq = v(() => {
    ZPz = {
        lessThanXSeconds: {
            one: "less than a second",
            other: "less than {{count}} seconds"
        },
        xSeconds: {
            one: "1 second",
            other: "{{count}} seconds"
        },
        halfAMinute: "half a minute",
        lessThanXMinutes: {
            one: "less than a minute",
            other: "less than {{count}} minutes"
        },
        xMinutes: {
            one: "1 minute",
            other: "{{count}} minutes"
        },
        aboutXHours: {
            one: "about 1 hour",
            other: "about {{count}} hours"
        },
        xHours: {
            one: "1 hour",
            other: "{{count}} hours"
        },
        xDays: {
            one: "1 day",
            other: "{{count}} days"
        },
        aboutXWeeks: {
            one: "about 1 week",
            other: "about {{count}} weeks"
        },
        xWeeks: {
            one: "1 week",
            other: "{{count}} weeks"
        },
        aboutXMonths: {
            one: "about 1 month",
            other: "about {{count}} months"
        },
        xMonths: {
            one: "1 month",
            other: "{{count}} months"
        },
        aboutXYears: {
            one: "about 1 year",
            other: "about {{count}} years"
        },
        xYears: {
            one: "1 year",
            other: "{{count}} years"
        },
        overXYears: {
            one: "over 1 year",
            other: "over {{count}} years"
        },
        almostXYears: {
            one: "almost 1 year",
            other: "almost {{count}} years"
        }
    }
})
// @from(Ln 484097, Col 0)
function LE6(A) {
    return (q = {}) => {
        let K = q.width ? String(q.width) : A.defaultWidth;
        return A.formats[K] || A.formats[A.defaultWidth]
    }
}
// @from(Ln 484103, Col 4)
fPz
// @from(Ln 484103, Col 9)
VPz
// @from(Ln 484103, Col 14)
NPz
// @from(Ln 484103, Col 19)
mTq
// @from(Ln 484104, Col 4)
FTq = v(() => {
    fPz = {
        full: "EEEE, MMMM do, y",
        long: "MMMM do, y",
        medium: "MMM d, y",
        short: "MM/dd/yyyy"
    }, VPz = {
        full: "h:mm:ss a zzzz",
        long: "h:mm:ss a z",
        medium: "h:mm:ss a",
        short: "h:mm a"
    }, NPz = {
        full: "{{date}} 'at' {{time}}",
        long: "{{date}} 'at' {{time}}",
        medium: "{{date}}, {{time}}",
        short: "{{date}}, {{time}}"
    }, mTq = {
        date: LE6({
            formats: fPz,
            defaultWidth: "full"
        }),
        time: LE6({
            formats: VPz,
            defaultWidth: "full"
        }),
        dateTime: LE6({
            formats: NPz,
            defaultWidth: "full"
        })
    }
})
// @from(Ln 484135, Col 4)
TPz
// @from(Ln 484135, Col 9)
QTq = (A, q, K, Y) => TPz[A]
// @from(Ln 484136, Col 4)
gTq = v(() => {
    TPz = {
        lastWeek: "'last' eeee 'at' p",
        yesterday: "'yesterday at' p",
        today: "'today at' p",
        tomorrow: "'tomorrow at' p",
        nextWeek: "eeee 'at' p",
        other: "P"
    }
})
// @from(Ln 484147, Col 0)
function mf1(A) {
    return (q, K) => {
        let Y = K?.context ? String(K.context) : "standalone",
            z;
        if (Y === "formatting" && A.formattingValues) {
            let H = A.defaultFormattingWidth || A.defaultWidth,
                $ = K?.width ? String(K.width) : H;
            z = A.formattingValues[$] || A.formattingValues[H]
        } else {
            let H = A.defaultWidth,
                $ = K?.width ? String(K.width) : A.defaultWidth;
            z = A.values[$] || A.values[H]
        }
        let w = A.argumentCallback ? A.argumentCallback(q) : q;
        return z[w]
    }
}
// @from(Ln 484164, Col 4)
vPz
// @from(Ln 484164, Col 9)
EPz
// @from(Ln 484164, Col 14)
kPz
// @from(Ln 484164, Col 19)
LPz
// @from(Ln 484164, Col 24)
RPz
// @from(Ln 484164, Col 29)
yPz
// @from(Ln 484164, Col 34)
CPz = (A, q) => {
        let K = Number(A),
            Y = K % 100;
        if (Y > 20 || Y < 10) switch (Y % 10) {
            case 1:
                return K + "st";
            case 2:
                return K + "nd";
            case 3:
                return K + "rd"
        }
        return K + "th"
    }
// @from(Ln 484177, Col 4)
UTq
// @from(Ln 484178, Col 4)
pTq = v(() => {
    vPz = {
        narrow: ["B", "A"],
        abbreviated: ["BC", "AD"],
        wide: ["Before Christ", "Anno Domini"]
    }, EPz = {
        narrow: ["1", "2", "3", "4"],
        abbreviated: ["Q1", "Q2", "Q3", "Q4"],
        wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
    }, kPz = {
        narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }, LPz = {
        narrow: ["S", "M", "T", "W", "T", "F", "S"],
        short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    }, RPz = {
        narrow: {
            am: "a",
            pm: "p",
            midnight: "mi",
            noon: "n",
            morning: "morning",
            afternoon: "afternoon",
            evening: "evening",
            night: "night"
        },
        abbreviated: {
            am: "AM",
            pm: "PM",
            midnight: "midnight",
            noon: "noon",
            morning: "morning",
            afternoon: "afternoon",
            evening: "evening",
            night: "night"
        },
        wide: {
            am: "a.m.",
            pm: "p.m.",
            midnight: "midnight",
            noon: "noon",
            morning: "morning",
            afternoon: "afternoon",
            evening: "evening",
            night: "night"
        }
    }, yPz = {
        narrow: {
            am: "a",
            pm: "p",
            midnight: "mi",
            noon: "n",
            morning: "in the morning",
            afternoon: "in the afternoon",
            evening: "in the evening",
            night: "at night"
        },
        abbreviated: {
            am: "AM",
            pm: "PM",
            midnight: "midnight",
            noon: "noon",
            morning: "in the morning",
            afternoon: "in the afternoon",
            evening: "in the evening",
            night: "at night"
        },
        wide: {
            am: "a.m.",
            pm: "p.m.",
            midnight: "midnight",
            noon: "noon",
            morning: "in the morning",
            afternoon: "in the afternoon",
            evening: "in the evening",
            night: "at night"
        }
    }, UTq = {
        ordinalNumber: CPz,
        era: mf1({
            values: vPz,
            defaultWidth: "wide"
        }),
        quarter: mf1({
            values: EPz,
            defaultWidth: "wide",
            argumentCallback: (A) => A - 1
        }),
        month: mf1({
            values: kPz,
            defaultWidth: "wide"
        }),
        day: mf1({
            values: LPz,
            defaultWidth: "wide"
        }),
        dayPeriod: mf1({
            values: RPz,
            defaultWidth: "wide",
            formattingValues: yPz,
            defaultFormattingWidth: "wide"
        })
    }
})
// @from(Ln 484286, Col 0)
function Ff1(A) {
    return (q, K = {}) => {
        let Y = K.width,
            z = Y && A.matchPatterns[Y] || A.matchPatterns[A.defaultMatchWidth],
            w = q.match(z);
        if (!w) return null;
        let H = w[0],
            $ = Y && A.parsePatterns[Y] || A.parsePatterns[A.defaultParseWidth],
            O = Array.isArray($) ? hPz($, (X) => X.test(H)) : SPz($, (X) => X.test(H)),
            _;
        _ = A.valueCallback ? A.valueCallback(O) : O, _ = K.valueCallback ? K.valueCallback(_) : _;
        let J = q.slice(H.length);
        return {
            value: _,
            rest: J
        }
    }
}
// @from(Ln 484305, Col 0)
function SPz(A, q) {
    for (let K in A)
        if (Object.prototype.hasOwnProperty.call(A, K) && q(A[K])) return K;
    return
}
// @from(Ln 484311, Col 0)
function hPz(A, q) {
    for (let K = 0; K < A.length; K++)
        if (q(A[K])) return K;
    return
}
// @from(Ln 484317, Col 0)
function dTq(A) {
    return (q, K = {}) => {
        let Y = q.match(A.matchPattern);
        if (!Y) return null;
        let z = Y[0],
            w = q.match(A.parsePattern);
        if (!w) return null;
        let H = A.valueCallback ? A.valueCallback(w[0]) : w[0];
        H = K.valueCallback ? K.valueCallback(H) : H;
        let $ = q.slice(z.length);
        return {
            value: H,
            rest: $
        }
    }
}
// @from(Ln 484333, Col 4)
IPz
// @from(Ln 484333, Col 9)
xPz
// @from(Ln 484333, Col 14)
bPz
// @from(Ln 484333, Col 19)
uPz
// @from(Ln 484333, Col 24)
BPz
// @from(Ln 484333, Col 29)
mPz
// @from(Ln 484333, Col 34)
FPz
// @from(Ln 484333, Col 39)
QPz
// @from(Ln 484333, Col 44)
gPz
// @from(Ln 484333, Col 49)
UPz
// @from(Ln 484333, Col 54)
pPz
// @from(Ln 484333, Col 59)
dPz
// @from(Ln 484333, Col 64)
cTq
// @from(Ln 484334, Col 4)
lTq = v(() => {
    IPz = /^(\d+)(th|st|nd|rd)?/i, xPz = /\d+/i, bPz = {
        narrow: /^(b|a)/i,
        abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
        wide: /^(before christ|before common era|anno domini|common era)/i
    }, uPz = {
        any: [/^b/i, /^(a|c)/i]
    }, BPz = {
        narrow: /^[1234]/i,
        abbreviated: /^q[1234]/i,
        wide: /^[1234](th|st|nd|rd)? quarter/i
    }, mPz = {
        any: [/1/i, /2/i, /3/i, /4/i]
    }, FPz = {
        narrow: /^[jfmasond]/i,
        abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
        wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
    }, QPz = {
        narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
        any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
    }, gPz = {
        narrow: /^[smtwf]/i,
        short: /^(su|mo|tu|we|th|fr|sa)/i,
        abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
        wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
    }, UPz = {
        narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
        any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
    }, pPz = {
        narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
        any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
    }, dPz = {
        any: {
            am: /^a/i,
            pm: /^p/i,
            midnight: /^mi/i,
            noon: /^no/i,
            morning: /morning/i,
            afternoon: /afternoon/i,
            evening: /evening/i,
            night: /night/i
        }
    }, cTq = {
        ordinalNumber: dTq({
            matchPattern: IPz,
            parsePattern: xPz,
            valueCallback: (A) => parseInt(A, 10)
        }),
        era: Ff1({
            matchPatterns: bPz,
            defaultMatchWidth: "wide",
            parsePatterns: uPz,
            defaultParseWidth: "any"
        }),
        quarter: Ff1({
            matchPatterns: BPz,
            defaultMatchWidth: "wide",
            parsePatterns: mPz,
            defaultParseWidth: "any",
            valueCallback: (A) => A + 1
        }),
        month: Ff1({
            matchPatterns: FPz,
            defaultMatchWidth: "wide",
            parsePatterns: QPz,
            defaultParseWidth: "any"
        }),
        day: Ff1({
            matchPatterns: gPz,
            defaultMatchWidth: "wide",
            parsePatterns: UPz,
            defaultParseWidth: "any"
        }),
        dayPeriod: Ff1({
            matchPatterns: pPz,
            defaultMatchWidth: "any",
            parsePatterns: dPz,
            defaultParseWidth: "any"
        })
    }
})
// @from(Ln 484415, Col 4)
PUA
// @from(Ln 484416, Col 4)
iTq = v(() => {
    BTq();
    FTq();
    gTq();
    pTq();
    lTq();
    PUA = {
        code: "en-US",
        formatDistance: uTq,
        formatLong: mTq,
        formatRelative: QTq,
        localize: UTq,
        match: cTq,
        options: {
            weekStartsOn: 0,
            firstWeekContainsDate: 1
        }
    }
})
// @from(Ln 484435, Col 4)
nTq = v(() => {
    iTq()
})
// @from(Ln 484439, Col 0)
function rTq(A, q) {
    let K = n_(A, q?.in);
    return VNq(K, NTq(K)) + 1
}
// @from(Ln 484443, Col 4)
WUA = v(() => {
    JUA();
    MUA();
    mE()
})
// @from(Ln 484449, Col 0)
function oTq(A, q) {
    let K = n_(A, q?.in),
        Y = +kY1(K) - +NNq(K);
    return Math.round(Y / vE6) + 1
}
// @from(Ln 484454, Col 4)
GUA = v(() => {
    oc1();
    sc1();
    XUA();
    mE()
})
// @from(Ln 484461, Col 0)
function RE6(A, q) {
    let K = n_(A, q?.in),
        Y = K.getFullYear(),
        z = W11(),
        w = q?.firstWeekContainsDate ?? q?.locale?.options?.firstWeekContainsDate ?? z.firstWeekContainsDate ?? z.locale?.options?.firstWeekContainsDate ?? 1,
        H = dN(q?.in || A, 0);
    H.setFullYear(Y + 1, 0, w), H.setHours(0, 0, 0, 0);
    let $ = ic(H, q),
        O = dN(q?.in || A, 0);
    O.setFullYear(Y, 0, w), O.setHours(0, 0, 0, 0);
    let _ = ic(O, q);
    if (+K >= +$) return Y + 1;
    else if (+K >= +_) return Y;
    else return Y - 1
}
// @from(Ln 484476, Col 4)
yE6 = v(() => {
    ac1();
    P11();
    Bf1();
    mE()
})
// @from(Ln 484483, Col 0)
function aTq(A, q) {
    let K = W11(),
        Y = q?.firstWeekContainsDate ?? q?.locale?.options?.firstWeekContainsDate ?? K.firstWeekContainsDate ?? K.locale?.options?.firstWeekContainsDate ?? 1,
        z = RE6(A, q),
        w = dN(q?.in || A, 0);
    return w.setFullYear(z, 0, Y), w.setHours(0, 0, 0, 0), ic(w, q)
}
// @from(Ln 484490, Col 4)
ZUA = v(() => {
    ac1();
    P11();
    yE6();
    Bf1()
})
// @from(Ln 484497, Col 0)
function sTq(A, q) {
    let K = n_(A, q?.in),
        Y = +ic(K, q) - +aTq(K, q);
    return Math.round(Y / vE6) + 1
}
// @from(Ln 484502, Col 4)
fUA = v(() => {
    oc1();
    Bf1();
    ZUA();
    mE()
})
// @from(Ln 484509, Col 0)
function Bz(A, q) {
    let K = A < 0 ? "-" : "",
        Y = Math.abs(A).toString().padStart(q, "0");
    return K + Y
}
// @from(Ln 484514, Col 4)
nc
// @from(Ln 484515, Col 4)
tTq = v(() => {
    nc = {
        y(A, q) {
            let K = A.getFullYear(),
                Y = K > 0 ? K : 1 - K;
            return Bz(q === "yy" ? Y % 100 : Y, q.length)
        },
        M(A, q) {
            let K = A.getMonth();
            return q === "M" ? String(K + 1) : Bz(K + 1, 2)
        },
        d(A, q) {
            return Bz(A.getDate(), q.length)
        },
        a(A, q) {
            let K = A.getHours() / 12 >= 1 ? "pm" : "am";
            switch (q) {
                case "a":
                case "aa":
                    return K.toUpperCase();
                case "aaa":
                    return K;
                case "aaaaa":
                    return K[0];
                case "aaaa":
                default:
                    return K === "am" ? "a.m." : "p.m."
            }
        },
        h(A, q) {
            return Bz(A.getHours() % 12 || 12, q.length)
        },
        H(A, q) {
            return Bz(A.getHours(), q.length)
        },
        m(A, q) {
            return Bz(A.getMinutes(), q.length)
        },
        s(A, q) {
            return Bz(A.getSeconds(), q.length)
        },
        S(A, q) {
            let K = q.length,
                Y = A.getMilliseconds(),
                z = Math.trunc(Y * Math.pow(10, K - 3));
            return Bz(z, q.length)
        }
    }
})
// @from(Ln 484565, Col 0)
function eTq(A, q = "") {
    let K = A > 0 ? "-" : "+",
        Y = Math.abs(A),
        z = Math.trunc(Y / 60),
        w = Y % 60;
    if (w === 0) return K + String(z);
    return K + String(z) + q + Bz(w, 2)
}
// @from(Ln 484574, Col 0)
function Avq(A, q) {
    if (A % 60 === 0) return (A > 0 ? "-" : "+") + Bz(Math.abs(A) / 60, 2);
    return LY1(A, q)
}
// @from(Ln 484579, Col 0)
function LY1(A, q = "") {
    let K = A > 0 ? "-" : "+",
        Y = Math.abs(A),
        z = Bz(Math.trunc(Y / 60), 2),
        w = Bz(Y % 60, 2);
    return K + z + q + w
}
// @from(Ln 484586, Col 4)
Qf1
// @from(Ln 484586, Col 9)
VUA