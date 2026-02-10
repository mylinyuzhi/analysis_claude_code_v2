
// @from(Ln 305159, Col 0)
function c31(A) {
    let q = A.indexOf("@");
    if (q === -1) return null;
    return {
        agentName: A.slice(0, q),
        teamName: A.slice(q + 1)
    }
}
// @from(Ln 305168, Col 0)
function vP1(A, q) {
    let K = Date.now();
    return `${A}-${K}@${q}`
}
// @from(Ln 305188, Col 0)
function KR4(A) {
    return A.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
}
// @from(Ln 305192, Col 0)
function Ej6(A) {
    return l31(QP(), KR4(A))
}
// @from(Ln 305196, Col 0)
function iX(A) {
    let q = l31(Ej6(A), "config.json");
    if (!EjY(q)) return null;
    try {
        let K = qR4(q, "utf-8");
        return _A(K)
    } catch (K) {
        return h(`[TeammateTool] Failed to read team file for ${A}: ${K instanceof Error?K.message:String(K)}`), null
    }
}
// @from(Ln 305207, Col 0)
function IF1(A, q) {
    let K = Ej6(A);
    kjY(K, {
        recursive: !0
    });
    let Y = l31(K, "config.json");
    c8(Y, Q1(q, null, 2))
}
// @from(Ln 305216, Col 0)
function EP1(A, q) {
    let K = q.agentId || q.name;
    if (!K) return h("[TeammateTool] removeTeammateFromTeamFile called with no identifier"), !1;
    let Y = iX(A);
    if (!Y) return h(`[TeammateTool] Cannot remove teammate ${K}: failed to read team file for "${A}"`), !1;
    let z = Y.members.length;
    if (Y.members = Y.members.filter((w) => {
            if (q.agentId && w.agentId === q.agentId) return !1;
            if (q.name && w.name === q.name) return !1;
            return !0
        }), Y.members.length === z) return h(`[TeammateTool] Teammate ${K} not found in team file for "${A}"`), !1;
    return IF1(A, Y), h(`[TeammateTool] Removed teammate from team file: ${K}`), !0
}
// @from(Ln 305230, Col 0)
function SjY(A) {
    return iX(A)?.hiddenPaneIds ?? []
}
// @from(Ln 305234, Col 0)
function YR4(A, q) {
    return SjY(A).includes(q)
}
// @from(Ln 305238, Col 0)
function zR4(A, q) {
    let K = iX(A);
    if (!K) return !1;
    let Y = K.members.findIndex((z) => z.tmuxPaneId === q);
    if (Y === -1) return !1;
    if (K.members.splice(Y, 1), K.hiddenPaneIds) {
        let z = K.hiddenPaneIds.indexOf(q);
        if (z !== -1) K.hiddenPaneIds.splice(z, 1)
    }
    return IF1(A, K), h(`[TeammateTool] Removed member with pane ${q} from team ${A}`), !0
}
// @from(Ln 305250, Col 0)
function wR4(A, q) {
    let K = iX(A);
    if (!K) return !1;
    let Y = K.members.findIndex((z) => z.agentId === q);
    if (Y === -1) return !1;
    return K.members.splice(Y, 1), IF1(A, K), h(`[TeammateTool] Removed member ${q} from team ${A}`), !0
}
// @from(Ln 305258, Col 0)
function xF1(A, q, K) {
    let Y = iX(A);
    if (!Y) return !1;
    let z = Y.members.find((H) => H.name === q);
    if (!z) return h(`[TeammateTool] Cannot set member mode: member ${q} not found in team ${A}`), !1;
    if (z.mode === K) return !0;
    let w = Y.members.map((H) => H.name === q ? {
        ...H,
        mode: K
    } : H);
    return IF1(A, {
        ...Y,
        members: w
    }), h(`[TeammateTool] Set member ${q} in team ${A} to mode: ${K}`), !0
}
// @from(Ln 305274, Col 0)
function HR4(A, q) {
    if (!Dz()) return;
    let K = q ?? i3(),
        Y = g5();
    if (K && Y) xF1(K, Y, A)
}
// @from(Ln 305281, Col 0)
function $R4(A, q) {
    let K = iX(A);
    if (!K) return !1;
    let Y = new Map(q.map((H) => [H.memberName, H.mode])),
        z = !1,
        w = K.members.map((H) => {
            let $ = Y.get(H.name);
            if ($ !== void 0 && H.mode !== $) return z = !0, {
                ...H,
                mode: $
            };
            return H
        });
    if (z) IF1(A, {
        ...K,
        members: w
    }), h(`[TeammateTool] Set ${q.length} member modes in team ${A}`);
    return !0
}
// @from(Ln 305300, Col 0)
async function kj6(A, q, K) {
    let Y = Ej6(A),
        z = l31(Y, "config.json"),
        w;
    try {
        let $ = await RjY(z, "utf-8");
        w = _A($)
    } catch {
        h(`[TeammateTool] Cannot set member active: team ${A} not found`);
        return
    }
    let H = w.members.find(($) => $.name === q);
    if (!H) {
        h(`[TeammateTool] Cannot set member active: member ${q} not found in team ${A}`);
        return
    }
    if (H.isActive === K) return;
    H.isActive = K, await CjY(Y, {
        recursive: !0
    }), await yjY(z, Q1(w, null, 2)), h(`[TeammateTool] Set member ${q} in team ${A} to ${K?"active":"idle"}`)
}
// @from(Ln 305321, Col 0)
async function hjY(A) {
    let q = l31(A, ".git"),
        K = null;
    try {
        let z = qR4(q, "utf-8").trim().match(/^gitdir:\s*(.+)$/);
        if (z && z[1]) {
            let w = z[1],
                H = l31(w, "..", "..");
            K = l31(H, "..")
        }
    } catch {}
    if (K) {
        let Y = await d4(pq(), ["worktree", "remove", "--force", A], {
            cwd: K
        });
        if (Y.code === 0) {
            h(`[TeammateTool] Removed worktree via git: ${A}`);
            return
        }
        if (Y.stderr?.includes("not a working tree")) {
            h(`[TeammateTool] Worktree already removed: ${A}`);
            return
        }
        h(`[TeammateTool] git worktree remove failed, falling back to rm: ${Y.stderr}`)
    }
    try {
        LjY(A, {
            recursive: !0,
            force: !0
        }), h(`[TeammateTool] Removed worktree directory manually: ${A}`)
    } catch (Y) {
        h(`[TeammateTool] Failed to remove worktree ${A}: ${Y instanceof Error?Y.message:String(Y)}`)
    }
}
// @from(Ln 305355, Col 0)
async function OR4(A) {
    let q = KR4(A),
        K = iX(A),
        Y = [];
    if (K) {
        for (let H of K.members)
            if (H.worktreePath) Y.push(H.worktreePath)
    }
    for (let H of Y) await hjY(H);
    let z = Ej6(A);
    try {
        await AR4(z, {
            recursive: !0,
            force: !0
        }), h(`[TeammateTool] Cleaned up team directory: ${z}`)
    } catch (H) {
        h(`[TeammateTool] Failed to clean up team directory ${z}: ${H instanceof Error?H.message:String(H)}`)
    }
    let w = WL(q);
    try {
        await AR4(w, {
            recursive: !0,
            force: !0
        }), h(`[TeammateTool] Cleaned up tasks directory: ${w}`), l_1()
    } catch (H) {
        h(`[TeammateTool] Failed to clean up tasks directory ${w}: ${H instanceof Error?H.message:String(H)}`)
    }
}
// @from(Ln 305383, Col 4)
zdw
// @from(Ln 305384, Col 4)
XN = v(() => {
    i7();
    hA();
    m6();
    Z6();
    m6();
    Cz();
    tq();
    vw();
    h9();
    zdw = u.strictObject({
        operation: u.enum(["spawnTeam", "cleanup"]).describe("Operation: spawnTeam to create a team, cleanup to remove team and task directories."),
        agent_type: u.string().optional().describe('Type/role of the team lead (e.g., "researcher", "test-runner"). Used for team file and inter-agent coordination.'),
        team_name: u.string().optional().describe("Name for the new team to create (required for spawnTeam)."),
        description: u.string().optional().describe("Team description/purpose (only used with spawnTeam).")
    })
})
// @from(Ln 305401, Col 4)
kP1
// @from(Ln 305402, Col 4)
Lj6 = v(() => {
    kP1 = ["Baked", "Brewed", "Churned", "Cogitated", "Cooked", "Crunched", "Sautéed", "Worked"]
})
// @from(Ln 305405, Col 0)
async function LP1(A, q) {
    let {
        name: K,
        teamName: Y,
        prompt: z,
        color: w,
        planModeRequired: H,
        model: $
    } = A, {
        setAppState: O
    } = q, _ = pv(K, Y), J = hp("in_process_teammate");
    h(`[spawnInProcessTeammate] Spawning ${_} (taskId: ${J})`);
    try {
        let X = Aq(),
            D = U6(),
            j = {
                agentId: _,
                agentName: K,
                teamName: Y,
                color: w,
                planModeRequired: H,
                parentSessionId: D
            },
            M = rq6({
                agentId: _,
                agentName: K,
                teamName: Y,
                color: w,
                planModeRequired: H,
                parentSessionId: D,
                abortController: X
            });
        if (Bp()) AJ6(_, K, D);
        let P = `${K}: ${z.substring(0,50)}${z.length>50?"...":""}`,
            W = n_1(Y, {
                subject: K,
                description: z.substring(0, 100),
                status: "in_progress",
                blocks: [],
                blockedBy: [],
                metadata: {
                    _internal: !0
                }
            }),
            G = {
                ...IZ(J, "in_process_teammate", P),
                type: "in_process_teammate",
                status: "running",
                identity: j,
                prompt: z,
                model: $,
                abortController: X,
                awaitingPlanApproval: !1,
                spinnerVerb: pj(U31),
                pastTenseVerb: pj(kP1),
                permissionMode: H ? "plan" : "default",
                isIdle: !1,
                shutdownRequested: !1,
                lastReportedToolCount: 0,
                lastReportedTokenCount: 0,
                pendingUserMessages: [],
                messages: [],
                localTaskId: W
            },
            f = Tq(async () => {
                h(`[spawnInProcessTeammate] Cleanup called for ${_}`), X.abort()
            });
        return G.unregisterCleanup = f, bZ(G, O), h(`[spawnInProcessTeammate] Registered ${_} in AppState`), {
            success: !0,
            agentId: _,
            taskId: J,
            abortController: X,
            teammateContext: M
        }
    } catch (X) {
        let D = X instanceof Error ? X.message : "Unknown error during spawn";
        return h(`[spawnInProcessTeammate] Failed to spawn ${_}: ${D}`), {
            success: !1,
            agentId: _,
            error: D
        }
    }
}
// @from(Ln 305489, Col 0)
function Rj6(A, q) {
    let K = !1,
        Y = null,
        z = null;
    if (q((w) => {
            let H = w.tasks[A];
            if (!H || H.type !== "in_process_teammate") return w;
            let $ = H;
            Y = $.identity.teamName, z = $.identity.agentId, $.abortController.abort(), $.unregisterCleanup?.(), K = !0, $.onIdleCallbacks?.forEach((_) => _());
            let O = w.teamContext;
            if (w.teamContext && w.teamContext.teammates && z) {
                let {
                    [z]: _, ...J
                } = w.teamContext.teammates;
                O = {
                    ...w.teamContext,
                    teammates: J
                }
            }
            return {
                ...w,
                teamContext: O,
                tasks: {
                    ...w.tasks,
                    [A]: {
                        ...$,
                        status: "killed",
                        endTime: Date.now(),
                        onIdleCallbacks: []
                    }
                }
            }
        }), Y && z) wR4(Y, z);
    return K
}
// @from(Ln 305524, Col 4)
yj6 = v(() => {
    fK1();
    G2();
    Yv();
    GR();
    Tz();
    Z6();
    vw();
    B6();
    XN();
    MB1();
    gl();
    Gj6();
    Lj6()
})
// @from(Ln 305539, Col 4)
_R4 = {}
// @from(Ln 305557, Col 0)
function IjY(A, q, K, Y, z) {
    let w = q.agentName,
        H = K === "completed" ? `Teammate "${w}" completed their task.` : K === "failed" ? `Teammate "${w}" failed: ${Y||"Unknown error"}` : K === "killed" ? `Teammate "${w}" was stopped.` : `Teammate "${w}" is idle and ready for new work.`,
        $ = ww(A),
        O = `<${NO}>
<${dP}>${A}</${dP}>
<${WT}>${$}</${WT}>
<${ND}>${K}</${ND}>
<${TD}>${H}</${TD}>
</${NO}>
Read the output file to retrieve the result: ${$}`;
    WR({
        value: O,
        mode: "task-notification"
    }), c5(A, z, (_) => ({
        ..._,
        notified: !0
    }))
}
// @from(Ln 305577, Col 0)
function xjY(A, q) {
    c5(A, q, (K) => {
        if (K.status !== "running" || K.isIdle) return K;
        return {
            ...K,
            isIdle: !0
        }
    })
}
// @from(Ln 305587, Col 0)
function bjY(A, q) {
    c5(A, q, (K) => {
        if (K.status !== "running" || !K.isIdle) return K;
        return {
            ...K,
            isIdle: !1
        }
    })
}
// @from(Ln 305597, Col 0)
function ujY(A, q) {
    c5(A, q, (K) => {
        if (K.status !== "running" || K.awaitingPlanApproval) return K;
        return {
            ...K,
            awaitingPlanApproval: !0
        }
    })
}
// @from(Ln 305607, Col 0)
function BjY(A, q) {
    c5(A, q, (K) => {
        if (!K.awaitingPlanApproval) return K;
        return {
            ...K,
            awaitingPlanApproval: !1
        }
    })
}
// @from(Ln 305617, Col 0)
function MTA(A, q) {
    c5(A, q, (K) => {
        if (K.status !== "running" || K.shutdownRequested) return K;
        return {
            ...K,
            shutdownRequested: !0
        }
    })
}
// @from(Ln 305627, Col 0)
function Cj6(A, q, K) {
    c5(A, K, (Y) => {
        if (Y.status !== "running") return Y;
        return {
            ...Y,
            messages: [...Y.messages ?? [], q]
        }
    })
}
// @from(Ln 305637, Col 0)
function PTA(A, q, K) {
    c5(A, K, (Y) => {
        if (Y.status === "completed" || Y.status === "killed" || Y.status === "failed") return h(`Dropping message for teammate task ${A}: task status is "${Y.status}"`), Y;
        return {
            ...Y,
            pendingUserMessages: [...Y.pendingUserMessages, q],
            messages: [...Y.messages ?? [], c6({
                content: q
            })]
        }
    })
}
// @from(Ln 305650, Col 0)
function mjY(A, q, K) {
    let Y;
    c5(A, K, (z) => {
        if (z.status !== "running") return z;
        return Y = z.unregisterCleanup, {
            ...z,
            status: "completed",
            result: q,
            endTime: Date.now()
        }
    }), Y?.()
}
// @from(Ln 305663, Col 0)
function FjY(A, q, K) {
    let Y;
    c5(A, K, (z) => {
        if (z.status !== "running") return z;
        return Y = z.unregisterCleanup, {
            ...z,
            status: "failed",
            error: q,
            endTime: Date.now()
        }
    }), Y?.()
}
// @from(Ln 305676, Col 0)
function ps(A, q) {
    let K;
    for (let Y of Object.values(q))
        if (pO(Y) && Y.identity.agentId === A) {
            if (Y.status === "running") return Y;
            if (!K) K = Y
        } return K
}
// @from(Ln 305685, Col 0)
function dv(A) {
    return Object.values(A).filter(pO)
}
// @from(Ln 305689, Col 0)
function QjY(A, q) {
    return dv(q).filter((K) => K.status === "running" && K.identity.teamName === A)
}
// @from(Ln 305692, Col 4)
Gd
// @from(Ln 305692, Col 8)
bF1
// @from(Ln 305693, Col 4)
gR = v(() => {
    m1();
    AN();
    GR();
    hZ();
    vz();
    yj6();
    N8();
    Z6();
    Gd = o(X1(), 1);
    bF1 = {
        name: "InProcessTeammateTask",
        type: "in_process_teammate",
        async spawn(A, q) {
            let K = {
                    name: A.name,
                    teamName: A.teamName,
                    prompt: A.prompt,
                    color: A.color,
                    planModeRequired: A.planModeRequired
                },
                Y = await LP1(K, {
                    setAppState: q.setAppState
                });
            if (!Y.success || !Y.taskId) throw Error(Y.error || "Failed to spawn in-process teammate");
            return {
                taskId: Y.taskId,
                cleanup: () => {
                    Y.abortController?.abort()
                }
            }
        },
        async kill(A, q) {
            Rj6(A, q.setAppState)
        },
        renderStatus(A) {
            if (!pO(A)) return null;
            let {
                status: q,
                identity: K,
                progress: Y,
                awaitingPlanApproval: z,
                isIdle: w
            } = A, H = q === "running" ? z ? "warning" : "success" : q === "completed" ? "success" : q === "failed" ? "error" : q === "killed" ? "warning" : "inactive", $ = q === "killed" ? "stopped" : q;
            if (q === "running" && w) $ = "idle";
            else if (q === "running" && z) $ = "awaiting approval";
            let O = Y ? ` (${Y.toolUseCount} tools, ${Y.tokenCount} tokens)` : "";
            return Gd.createElement(I, null, Gd.createElement(V, {
                color: H
            }, "[", $, "] ", K.agentName, "@", K.teamName, O))
        },
        renderOutput(A) {
            return Gd.createElement(I, null, Gd.createElement(V, null, A))
        },
        getProgressMessage(A) {
            if (!pO(A)) return null;
            let {
                progress: q,
                lastReportedToolCount: K,
                lastReportedTokenCount: Y,
                identity: z
            } = A;
            if (!q) return null;
            let w = q.toolUseCount - K,
                H = q.tokenCount - Y;
            if (w === 0 && H === 0) return null;
            let $ = [];
            if (w > 0) $.push(`${w} new tool${w>1?"s":""} used`);
            if (H > 0) $.push(`${H} new tokens`);
            return `Teammate ${z.agentName} progress: ${$.join(", ")}. Read ${A.outputFile} for output.`
        }
    }
})
// @from(Ln 305767, Col 0)
function qP(A) {
    if (!A) return gjY;
    let q = lO[A];
    if (q) return q;
    return `ansi:${A}`
}
// @from(Ln 305773, Col 4)
gjY = "cyan_FOR_SUBAGENTS_ONLY"
// @from(Ln 305774, Col 4)
Zd = v(() => {
    lM()
})
// @from(Ln 305778, Col 0)
function XR4(A) {
    let q = e(8),
        {
            text: K
        } = A,
        [Y, z] = Nv(50),
        w = (z - JR4) / 1000,
        H = z < JR4 ? 0 : (Math.sin(w * Math.PI * 2 / djY) + 1) / 2,
        $;
    if (q[0] !== H) $ = Us(Wd(UjY, pjY, H)), q[0] = H, q[1] = $;
    else $ = q[1];
    let O = $,
        _;
    if (q[2] !== O || q[3] !== K) _ = uF1.createElement(V, {
        color: O
    }, K), q[2] = O, q[3] = K, q[4] = _;
    else _ = q[4];
    let J;
    if (q[5] !== Y || q[6] !== _) J = uF1.createElement(I, {
        ref: Y
    }, _), q[5] = Y, q[6] = _, q[7] = J;
    else J = q[7];
    return J
}
// @from(Ln 305802, Col 4)
uF1
// @from(Ln 305802, Col 9)
UjY
// @from(Ln 305802, Col 14)
pjY
// @from(Ln 305802, Col 19)
JR4 = 3000
// @from(Ln 305803, Col 4)
djY = 2
// @from(Ln 305804, Col 4)
DR4 = v(() => {
    i1();
    m1();
    NP1();
    uF1 = o(X1(), 1), UjY = {
        r: 153,
        g: 153,
        b: 153
    }, pjY = {
        r: 185,
        g: 185,
        b: 185
    }
})
// @from(Ln 305819, Col 0)
function RP1(A, q, K = 1000) {
    let Y = () => Xz(Date.now() - A),
        z = Sj6.useCallback((w) => {
            if (!q) return () => {};
            let H = setInterval(w, K);
            return () => clearInterval(H)
        }, [q, K]);
    return Sj6.useSyncExternalStore(z, Y, Y)
}
// @from(Ln 305828, Col 4)
Sj6
// @from(Ln 305829, Col 4)
hj6 = v(() => {
    vq();
    Sj6 = o(X1(), 1)
})
// @from(Ln 305833, Col 4)
BF1 = "shift + ↑/↓ to select"
// @from(Ln 305835, Col 0)
function cjY(A) {
    if (!A?.length) return [];
    let q = [],
        K = 80;
    for (let Y = A.length - 1; Y >= 0 && q.length < 3; Y--) {
        let z = A[Y];
        if (!z || z.type !== "user" && z.type !== "assistant" || !z.message?.content?.length) continue;
        let w = z.message.content;
        for (let H of w) {
            if (q.length >= 3) break;
            if (!H || typeof H !== "object") continue;
            if ("type" in H && H.type === "tool_use" && "name" in H) {
                let $ = "input" in H ? H.input : null,
                    O = `Using ${H.name}…`;
                if ($) {
                    let _ = $.description || $.prompt || $.command || $.query || $.pattern;
                    if (_) O = _.split(`
`)[0] ?? O
                }
                q.push(K3(O, K))
            } else if ("type" in H && H.type === "text" && "text" in H) {
                let $ = H.text.split(`
`).filter((O) => O.trim());
                for (let O = $.length - 1; O >= 0 && q.length < 3; O--) {
                    let _ = $[O];
                    if (!_) continue;
                    q.push(K3(_, K))
                }
            }
        }
    }
    return q.reverse()
}
// @from(Ln 305869, Col 0)
function jR4({
    teammate: A,
    isLast: q,
    isSelected: K,
    isForegrounded: Y,
    allIdle: z,
    showPreview: w
}) {
    let [H] = yP1.useState(() => A.spinnerVerb ?? pj(U31)), [$] = yP1.useState(() => A.pastTenseVerb ?? pj(kP1)), O = K || Y, _ = O ? q ? "╘═" : "╞═" : q ? "└─" : "├─", J = qP(A.identity.color), {
        columns: X
    } = Z8(), D = yP1.useRef(null), j = yP1.useRef(null);
    if (A.isIdle && D.current === null) D.current = Date.now();
    else if (!A.isIdle) D.current = null;
    if (!z && j.current !== null) j.current = null;
    let M = RP1(D.current ?? Date.now(), A.isIdle && !z);
    if (z && j.current === null) j.current = Xz(Date.now() - A.startTime);
    let P = z ? j.current ?? (() => {
            throw Error(`frozenDurationRef is null for idle teammate ${A.identity.agentName}`)
        })() : M,
        W = 8,
        G = `@${A.identity.agentName}`,
        f = UA(G),
        Z = A.progress?.toolUseCount ?? 0,
        N = A.progress?.tokenCount ?? 0,
        T = ` · ${Z} tool ${Z===1?"use":"uses"} · ${Y3(N)} tokens`,
        k = UA(T),
        y = ` · ${BF1}`,
        B = UA(y),
        m = UA(" · enter to view"),
        b = 25,
        g = X - W - f - 2,
        U = X >= 60 && g >= b,
        x = U ? f + 2 : 0,
        p = X - W - x,
        l = K && !Y && p > m + k + b + 5,
        r = O && p > B + (l ? m : 0) + k + b + 5,
        s = p > k + b + 5,
        O1 = (s ? k : 0) + (r ? B : 0) + (l ? m : 0),
        T1 = Math.max(b, p - O1 - 1),
        N1 = (() => {
            let J1 = A.progress?.recentActivities;
            if (J1 && J1.length > 0) {
                let Z1 = rB(J1);
                if (Z1) return K3(Z1, T1)
            }
            let D1 = A.progress?.lastActivity?.activityDescription;
            if (D1) return K3(D1, T1);
            return H
        })(),
        j1 = () => {
            if (A.shutdownRequested) return U9.createElement(V, {
                dimColor: !0
            }, "[stopping]");
            if (A.awaitingPlanApproval) return U9.createElement(V, {
                color: "warning"
            }, "[awaiting approval]");
            if (A.isIdle) {
                if (z) return U9.createElement(V, {
                    dimColor: !0
                }, $, " for ", P);
                return U9.createElement(V, {
                    dimColor: !0
                }, "Idle for ", M)
            }
            if (O) return null;
            return U9.createElement(V, {
                dimColor: !0
            }, N1?.endsWith("…") ? N1 : `${N1}…`)
        },
        q1 = w ? cjY(A.messages) : [],
        t = q ? "   " : "│  ";
    return U9.createElement(I, {
        flexDirection: "column"
    }, U9.createElement(I, {
        paddingLeft: 3
    }, U9.createElement(V, {
        color: K ? "suggestion" : void 0,
        bold: K
    }, K ? l1.pointer : " "), U9.createElement(V, {
        dimColor: !K
    }, _, " "), U && U9.createElement(V, {
        color: K ? "suggestion" : J
    }, "@", A.identity.agentName), U && U9.createElement(V, {
        dimColor: !K
    }, ": "), j1(), s && U9.createElement(V, {
        dimColor: !0
    }, " ", "· ", Z, " tool ", Z === 1 ? "use" : "uses", " ·", " ", Y3(N), " tokens"), r && U9.createElement(V, {
        dimColor: !0
    }, " · ", BF1), l && U9.createElement(V, {
        dimColor: !0
    }, " · enter to view")), q1.map((J1, D1) => U9.createElement(I, {
        key: D1,
        paddingLeft: 3
    }, U9.createElement(V, {
        dimColor: !0
    }, " "), U9.createElement(V, {
        dimColor: !0
    }, t, " "), U9.createElement(V, {
        dimColor: !0
    }, J1))))
}
// @from(Ln 305970, Col 4)
U9
// @from(Ln 305970, Col 8)
yP1
// @from(Ln 305971, Col 4)
MR4 = v(() => {
    b7();
    m1();
    gl();
    Zd();
    vq();
    Lj6();
    hj6();
    vq();
    LY();
    Eh();
    mq();
    Gj6();
    U9 = o(X1(), 1), yP1 = o(X1(), 1)
})
// @from(Ln 305987, Col 0)
function WTA({
    selectedIndex: A,
    isInSelectionMode: q,
    allIdle: K,
    leaderVerb: Y,
    leaderTokenCount: z,
    leaderIdleText: w
}) {
    let H = v6((G) => G.tasks),
        $ = v6((G) => G.viewingAgentTaskId),
        O = v6((G) => G.showTeammateMessagePreview),
        _ = void 0,
        J = dv(H).filter((G) => G.status === "running").sort((G, f) => G.identity.agentName.localeCompare(f.identity.agentName));
    if (J.length === 0) return null;
    let X = $ === void 0,
        D = q && A === -1,
        j = X || D,
        M = "cyan_FOR_SUBAGENTS_ONLY",
        P = q === !0 && A === J.length;
    return WY.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, !!1 && WY.createElement(I, {
        paddingLeft: 3
    }, WY.createElement(V, {
        color: D ? "suggestion" : void 0,
        bold: j
    }, D ? l1.pointer : " "), WY.createElement(V, {
        dimColor: !j,
        bold: j
    }, j ? "╒═" : "┌─", " "), WY.createElement(V, {
        bold: j,
        color: D ? "suggestion" : M
    }, "team-lead"), !X && Y && WY.createElement(V, {
        dimColor: !0
    }, ": ", Y, "…"), !X && !Y && w && WY.createElement(V, {
        dimColor: !0
    }, ": ", w), z !== void 0 && z > 0 && WY.createElement(V, {
        dimColor: !j
    }, " ", "· ", Y3(z), " tokens"), j && WY.createElement(V, {
        dimColor: !0
    }, " · ", BF1), D && !X && WY.createElement(V, {
        dimColor: !0
    }, " · enter to view")), J.map((G, f) => WY.createElement(jR4, {
        key: G.id,
        teammate: G,
        isLast: !q && f === J.length - 1,
        isSelected: q && A === f,
        isForegrounded: $ === G.id,
        allIdle: K,
        showPreview: O
    })), q && WY.createElement(ljY, {
        isSelected: P
    }))
}
// @from(Ln 306043, Col 0)
function ljY(A) {
    let q = e(18),
        {
            isSelected: K
        } = A,
        Y = K ? "suggestion" : void 0,
        z = K ? l1.pointer : " ",
        w;
    if (q[0] !== K || q[1] !== Y || q[2] !== z) w = WY.createElement(V, {
        color: Y,
        bold: K
    }, z), q[0] = K, q[1] = Y, q[2] = z, q[3] = w;
    else w = q[3];
    let H = !K,
        $ = K ? "╘═" : "└─",
        O;
    if (q[4] !== K || q[5] !== H || q[6] !== $) O = WY.createElement(V, {
        dimColor: H,
        bold: K
    }, $, " "), q[4] = K, q[5] = H, q[6] = $, q[7] = O;
    else O = q[7];
    let _ = !K,
        J;
    if (q[8] !== K || q[9] !== _) J = WY.createElement(V, {
        dimColor: _,
        bold: K
    }, "hide"), q[8] = K, q[9] = _, q[10] = J;
    else J = q[10];
    let X;
    if (q[11] !== K) X = K && WY.createElement(V, {
        dimColor: !0
    }, " · enter to collapse"), q[11] = K, q[12] = X;
    else X = q[12];
    let D;
    if (q[13] !== w || q[14] !== O || q[15] !== J || q[16] !== X) D = WY.createElement(I, {
        paddingLeft: 3
    }, w, O, J, X), q[13] = w, q[14] = O, q[15] = J, q[16] = X, q[17] = D;
    else D = q[17];
    return D
}
// @from(Ln 306083, Col 4)
WY
// @from(Ln 306084, Col 4)
GTA = v(() => {
    i1();
    b7();
    m1();
    d8();
    gR();
    vq();
    MR4();
    WY = o(X1(), 1)
})
// @from(Ln 306095, Col 0)
function GR4({
    mode: A,
    loadingStartTimeRef: q,
    totalPausedMsRef: K,
    pauseStartTimeRef: Y,
    spinnerTip: z,
    responseLengthRef: w,
    overrideColor: H,
    overrideShimmerColor: $,
    overrideMessage: O,
    spinnerSuffix: _,
    verbose: J,
    todos: X,
    hasActiveTools: D = !1
}) {
    let [j, M] = Nv(50), P = Y.current !== null ? Y.current - q.current - K.current : Date.now() - q.current - K.current, G = $j().prefersReducedMotion ?? !1, f = v6((RA) => RA.tasks), Z = v6((RA) => RA.viewingAgentTaskId), N = v6((RA) => RA.expandedView), T = N === "tasks", k = N === "teammates", y = v6((RA) => RA.selectedIPAgentIndex), B = v6((RA) => RA.viewSelectionMode), S = Z ? PR({
        viewingAgentTaskId: Z,
        tasks: f
    }) : void 0, {
        isConnected: m
    } = HTA(), {
        columns: b
    } = Z8(), g = VP1(), [U, x] = cv.useState(null), p = cv.useRef(null);
    cv.useEffect(() => {
        let RA = null,
            O7 = null;
        if (A === "thinking") {
            if (p.current === null) p.current = Date.now(), x("thinking")
        } else if (p.current !== null) {
            let tK = Date.now() - p.current,
                gq = Date.now() - p.current,
                xq = Math.max(0, 2000 - gq);
            p.current = null;
            let U8 = () => {
                x(tK), O7 = setTimeout(() => x(null), 2000)
            };
            if (xq > 0) RA = setTimeout(U8, xq);
            else U8()
        }
        return () => {
            if (RA) clearTimeout(RA);
            if (O7) clearTimeout(O7)
        }
    }, [A]);
    let l = jH() ? g?.find((RA) => RA.status !== "pending" && RA.status !== "completed") : X?.find((RA) => RA.status === "in_progress"),
        r = jH() ? rjY(g) : X?.find((RA) => RA.status === "pending"),
        [s] = cv.useState(() => pj(dL4())),
        O1 = O ?? l?.activeForm ?? s,
        N1 = (S && !S.isIdle ? S.spinnerVerb ?? s : O1) + "…",
        j1 = w.current,
        {
            isStalled: q1,
            stalledIntensity: t
        } = jTA(M, j1, D, G),
        J1 = G ? 0 : m === !1 ? 4 : Math.floor(M / 120),
        D1 = A === "requesting" ? 50 : 200,
        Z1 = N1.length + 20,
        E1 = Math.floor(M / D1),
        a = G ? -100 : m === !1 || q1 ? -100 : A === "requesting" ? E1 % Z1 - 10 : N1.length + 10 - E1 % Z1,
        A1 = G ? 0 : A === "tool-use" ? (Math.sin(M / 1000 * Math.PI) + 1) / 2 : 0,
        M1 = cv.useRef(j1);
    if (G) M1.current = j1;
    else {
        let RA = j1 - M1.current;
        if (RA > 0) {
            let O7;
            if (RA < 70) O7 = 3;
            else if (RA < 200) O7 = Math.max(8, Math.ceil(RA * 0.15));
            else O7 = 50;
            M1.current = Math.min(M1.current + O7, j1)
        }
    }
    let z1 = M1.current;
    cv.useEffect(() => {
        let RA = "spinner-" + A;
        return RF1.startCLIActivity(RA), () => {
            RF1.endCLIActivity(RA)
        }
    }, [A]);
    let Y1 = UA(N1) + 2,
        _1 = U === "thinking" ? "thinking" : typeof U === "number" ? `thought for ${Math.max(1,Math.round(U/1000))}s` : null,
        $1 = _1 ? UA(_1) : 0,
        G1 = Math.round(z1 / 4),
        L1 = dv(f).filter((RA) => RA.status === "running"),
        x1 = L1.length > 0,
        f1 = x1 && L1.every((RA) => RA.isIdle),
        R1 = 0;
    if (!k) {
        for (let RA of Object.values(f))
            if (pO(RA) && RA.status === "running") {
                if (RA.progress?.tokenCount) R1 += RA.progress.tokenCount
            }
    }
    let H1 = cv.useRef(Date.now() - P);
    cv.useEffect(() => {
        let RA = Date.now() - P;
        if (!x1 || RA < H1.current) H1.current = RA
    }, [P, x1]);
    let [y1, B1] = cv.useState(P);
    RX(() => B1(Date.now() - H1.current), x1 ? 100 : null);
    let A6 = cv.useRef(x1);
    if (A6.current && !x1) H1.current = Date.now() - P, B1(P);
    A6.current = x1;
    let O6 = x1 ? Math.max(P, y1) : P,
        P6 = Xz(O6),
        V6 = UA(P6),
        q6 = S && !S.isIdle ? S.progress?.tokenCount ?? 0 : G1 + R1,
        p1 = Y3(q6),
        K6 = x1 ? `${p1} tokens` : `${l1.arrowDown} ${p1} tokens`,
        j6 = UA(K6),
        M6 = G1,
        N6 = UA(" · "),
        F6 = U !== null,
        P1 = J || x1 || O6 > ijY,
        k1 = b - Y1 - 5,
        o1 = F6 && k1 > $1,
        _6 = o1 ? $1 + N6 : 0,
        z6 = P1 && k1 > _6 + V6,
        w6 = _6 + (z6 ? V6 + N6 : 0),
        r6 = P1 && k1 > w6 + j6,
        G6 = o1 && U === "thinking" && !_ && !z6 && !r6,
        L6 = [..._ ? [Y7.createElement(V, {
            dimColor: !0,
            key: "suffix"
        }, _)] : [], ...z6 ? [Y7.createElement(V, {
            dimColor: !0,
            key: "elapsedTime"
        }, P6)] : [], ...r6 ? [Y7.createElement(I, {
            flexDirection: "row",
            key: "tokens"
        }, !x1 && Y7.createElement(njY, {
            mode: A
        }), Y7.createElement(V, {
            dimColor: !0
        }, p1, " tokens"))] : [], ...o1 && _1 ? [U === "thinking" ? Y7.createElement(XR4, {
            key: "thinking",
            text: G6 ? `(${_1})` : _1
        }) : Y7.createElement(V, {
            dimColor: !0,
            key: "thinking"
        }, _1)] : []];
    if (m === !1) L6.push(Y7.createElement(I, {
        key: "offline"
    }, Y7.createElement(V, {
        color: "error",
        bold: !0
    }, "offline")));
    let OA = m === !1 ? "inactive" : "claude",
        bA = "claudeShimmer",
        lA = H ?? OA,
        E7 = $ ?? bA,
        V4 = S && !S.isIdle ? Y7.createElement(Y7.Fragment, null, Y7.createElement(V, {
            dimColor: !0
        }, "(esc to interrupt "), Y7.createElement(V, {
            color: qP(S.identity.color)
        }, S.identity.agentName), Y7.createElement(V, {
            dimColor: !0
        }, ")")) : !S && L6.length > 0 ? G6 ? Y7.createElement(oA, null, L6) : Y7.createElement(Y7.Fragment, null, Y7.createElement(V, {
            dimColor: !0
        }, "("), Y7.createElement(oA, null, L6), Y7.createElement(V, {
            dimColor: !0
        }, ")")) : null;
    if (S?.isIdle) {
        let RA = f1 ? `${XC1} Worked for ${Xz(Date.now()-S.startTime)}` : `${XC1} Idle`;
        return Y7.createElement(I, {
            flexDirection: "column",
            width: "100%",
            alignItems: "flex-start"
        }, Y7.createElement(I, {
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 1,
            width: "100%"
        }, Y7.createElement(V, {
            dimColor: !0
        }, RA)), k && x1 && Y7.createElement(WTA, {
            selectedIndex: y,
            isInSelectionMode: B === "selecting-agent",
            allIdle: f1,
            leaderVerb: O1,
            leaderTokenCount: M6
        }))
    }
    return Y7.createElement(I, {
        ref: j,
        flexDirection: "column",
        width: "100%",
        alignItems: "flex-start"
    }, Y7.createElement(I, {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 1,
        width: "100%"
    }, Y7.createElement(SF1, {
        frame: J1,
        messageColor: lA,
        stalledIntensity: H ? 0 : t,
        isConnected: m,
        reducedMotion: G,
        time: M
    }), Y7.createElement(XTA, {
        message: N1,
        mode: A,
        isConnected: m,
        messageColor: lA,
        glimmerIndex: a,
        flashOpacity: A1,
        shimmerColor: E7,
        stalledIntensity: H ? 0 : t
    }), V4), k && x1 ? Y7.createElement(WTA, {
        selectedIndex: y,
        isInSelectionMode: B === "selecting-agent",
        allIdle: f1,
        leaderVerb: O1,
        leaderTokenCount: M6
    }) : T && g && g.length > 0 ? Y7.createElement(I, {
        width: "100%",
        flexDirection: "column"
    }, Y7.createElement(HA, null, Y7.createElement(fj6, {
        tasks: g
    }))) : T && X && X.length > 0 ? Y7.createElement(I, {
        width: "100%",
        flexDirection: "column"
    }, Y7.createElement(HA, null, Y7.createElement(gs, {
        todos: X
    }))) : r || z ? Y7.createElement(I, {
        width: "100%"
    }, Y7.createElement(HA, null, Y7.createElement(V, {
        dimColor: !0
    }, r ? `Next: ${"subject"in r?r.subject:r.content}` : `Tip: ${z}`))) : null)
}
// @from(Ln 306327, Col 0)
function njY(A) {
    let q = e(2),
        {
            mode: K
        } = A;
    switch (K) {
        case "tool-input":
        case "tool-use":
        case "responding":
        case "thinking": {
            let Y;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = Y7.createElement(I, {
                width: 2
            }, Y7.createElement(V, {
                dimColor: !0
            }, l1.arrowDown)), q[0] = Y;
            else Y = q[0];
            return Y
        }
        case "requesting": {
            let Y;
            if (q[1] === Symbol.for("react.memo_cache_sentinel")) Y = Y7.createElement(I, {
                width: 2
            }, Y7.createElement(V, {
                dimColor: !0
            }, l1.arrowUp)), q[1] = Y;
            else Y = q[1];
            return Y
        }
    }
}
// @from(Ln 306359, Col 0)
function c4() {
    let A = e(12),
        [q, K] = Nv(120),
        {
            isConnected: Y
        } = HTA(),
        w = $j().prefersReducedMotion ?? !1,
        H = w ? 0 : Math.floor(K / 120) % WR4.length,
        $ = Y === !1 ? "inactive" : "text";
    if (w) {
        let X = Math.floor(K / 1000) % 2 === 1,
            D;
        if (A[0] !== X || A[1] !== $) D = Y7.createElement(V, {
            color: $,
            dimColor: X
        }, "●"), A[0] = X, A[1] = $, A[2] = D;
        else D = A[2];
        let j;
        if (A[3] !== q || A[4] !== D) j = Y7.createElement(I, {
            ref: q,
            flexWrap: "wrap",
            height: 1,
            width: 2
        }, D), A[3] = q, A[4] = D, A[5] = j;
        else j = A[5];
        return j
    }
    let O = WR4[H],
        _;
    if (A[6] !== $ || A[7] !== O) _ = Y7.createElement(V, {
        color: $
    }, O), A[6] = $, A[7] = O, A[8] = _;
    else _ = A[8];
    let J;
    if (A[9] !== q || A[10] !== _) J = Y7.createElement(I, {
        ref: q,
        flexWrap: "wrap",
        height: 1,
        width: 2
    }, _), A[9] = q, A[10] = _, A[11] = J;
    else J = A[11];
    return J
}
// @from(Ln 306403, Col 0)
function rjY(A) {
    if (!A) return;
    let q = A.filter((Y) => Y.status === "pending");
    if (q.length === 0) return;
    let K = new Set(A.filter((Y) => Y.status !== "completed").map((Y) => Y.id));
    return q.find((Y) => !Y.blockedBy.some((z) => K.has(z))) ?? q[0]
}
// @from(Ln 306410, Col 4)
Y7
// @from(Ln 306410, Col 8)
cv
// @from(Ln 306410, Col 12)
PR4
// @from(Ln 306410, Col 17)
WR4
// @from(Ln 306410, Col 22)
ijY = 30000
// @from(Ln 306411, Col 4)
x2 = v(() => {
    i1();
    m1();
    gl();
    vq();
    XZ();
    b7();
    pL4();
    $TA();
    Gj6();
    eq();
    yF1();
    OTA();
    Nj6();
    vw();
    d8();
    mq();
    HK();
    eL4();
    cp();
    gR();
    MK1();
    Zd();
    jW();
    DR4();
    GTA();
    LY();
    m1();
    Y7 = o(X1(), 1), cv = o(X1(), 1), PR4 = CF1(), WR4 = [...PR4, ...[...PR4].reverse()]
})
// @from(Ln 306441, Col 4)
mF1 = R((sjY) => {
    function ojY(A, q, K) {
        if (K === void 0) K = Array.prototype;
        if (A && typeof K.find === "function") return K.find.call(A, q);
        for (var Y = 0; Y < A.length; Y++)
            if (Object.prototype.hasOwnProperty.call(A, Y)) {
                var z = A[Y];
                if (q.call(void 0, z, Y, A)) return z
            }
    }

    function ZTA(A, q) {
        if (q === void 0) q = Object;
        return q && typeof q.freeze === "function" ? q.freeze(A) : A
    }

    function ajY(A, q) {
        if (A === null || typeof A !== "object") throw TypeError("target is not an object");
        for (var K in q)
            if (Object.prototype.hasOwnProperty.call(q, K)) A[K] = q[K];
        return A
    }
    var ZR4 = ZTA({
            HTML: "text/html",
            isHTML: function(A) {
                return A === ZR4.HTML
            },
            XML_APPLICATION: "application/xml",
            XML_TEXT: "text/xml",
            XML_XHTML_APPLICATION: "application/xhtml+xml",
            XML_SVG_IMAGE: "image/svg+xml"
        }),
        fR4 = ZTA({
            HTML: "http://www.w3.org/1999/xhtml",
            isHTML: function(A) {
                return A === fR4.HTML
            },
            SVG: "http://www.w3.org/2000/svg",
            XML: "http://www.w3.org/XML/1998/namespace",
            XMLNS: "http://www.w3.org/2000/xmlns/"
        });
    sjY.assign = ajY;
    sjY.find = ojY;
    sjY.freeze = ZTA;
    sjY.MIME_TYPE = ZR4;
    sjY.NAMESPACE = fR4
})
// @from(Ln 306488, Col 4)
CTA = R((WMY) => {
    var RR4 = mF1(),
        Zm = RR4.find,
        FF1 = RR4.NAMESPACE;

    function YMY(A) {
        return A !== ""
    }

    function zMY(A) {
        return A ? A.split(/[\t\n\f\r ]+/).filter(YMY) : []
    }

    function wMY(A, q) {
        if (!A.hasOwnProperty(q)) A[q] = !0;
        return A
    }

    function VR4(A) {
        if (!A) return [];
        var q = zMY(A);
        return Object.keys(q.reduce(wMY, {}))
    }

    function HMY(A) {
        return function(q) {
            return A && A.indexOf(q) !== -1
        }
    }

    function gF1(A, q) {
        for (var K in A)
            if (Object.prototype.hasOwnProperty.call(A, K)) q[K] = A[K]
    }

    function jN(A, q) {
        var K = A.prototype;
        if (!(K instanceof q)) {
            let z = function() {};
            var Y = z;
            z.prototype = q.prototype, z = new z, gF1(K, z), A.prototype = K = z
        }
        if (K.constructor != A) {
            if (typeof A != "function") console.error("unknown Class:" + A);
            K.constructor = A
        }
    }
    var MN = {},
        eh = MN.ELEMENT_NODE = 1,
        SP1 = MN.ATTRIBUTE_NODE = 2,
        Ij6 = MN.TEXT_NODE = 3,
        yR4 = MN.CDATA_SECTION_NODE = 4,
        CR4 = MN.ENTITY_REFERENCE_NODE = 5,
        $MY = MN.ENTITY_NODE = 6,
        SR4 = MN.PROCESSING_INSTRUCTION_NODE = 7,
        hR4 = MN.COMMENT_NODE = 8,
        IR4 = MN.DOCUMENT_NODE = 9,
        xR4 = MN.DOCUMENT_TYPE_NODE = 10,
        Vd = MN.DOCUMENT_FRAGMENT_NODE = 11,
        OMY = MN.NOTATION_NODE = 12,
        dW = {},
        Pj = {},
        gcw = dW.INDEX_SIZE_ERR = (Pj[1] = "Index size error", 1),
        Ucw = dW.DOMSTRING_SIZE_ERR = (Pj[2] = "DOMString size error", 2),
        DN = dW.HIERARCHY_REQUEST_ERR = (Pj[3] = "Hierarchy request error", 3),
        pcw = dW.WRONG_DOCUMENT_ERR = (Pj[4] = "Wrong document", 4),
        dcw = dW.INVALID_CHARACTER_ERR = (Pj[5] = "Invalid character", 5),
        ccw = dW.NO_DATA_ALLOWED_ERR = (Pj[6] = "No data allowed", 6),
        lcw = dW.NO_MODIFICATION_ALLOWED_ERR = (Pj[7] = "No modification allowed", 7),
        bR4 = dW.NOT_FOUND_ERR = (Pj[8] = "Not found", 8),
        icw = dW.NOT_SUPPORTED_ERR = (Pj[9] = "Not supported", 9),
        NR4 = dW.INUSE_ATTRIBUTE_ERR = (Pj[10] = "Attribute in use", 10),
        ncw = dW.INVALID_STATE_ERR = (Pj[11] = "Invalid state", 11),
        rcw = dW.SYNTAX_ERR = (Pj[12] = "Syntax error", 12),
        ocw = dW.INVALID_MODIFICATION_ERR = (Pj[13] = "Invalid modification", 13),
        acw = dW.NAMESPACE_ERR = (Pj[14] = "Invalid namespace", 14),
        scw = dW.INVALID_ACCESS_ERR = (Pj[15] = "Invalid access", 15);

    function CJ(A, q) {
        if (q instanceof Error) var K = q;
        else if (K = this, Error.call(this, Pj[A]), this.message = Pj[A], Error.captureStackTrace) Error.captureStackTrace(this, CJ);
        if (K.code = A, q) this.message = this.message + ": " + q;
        return K
    }
    CJ.prototype = Error.prototype;
    gF1(dW, CJ);

    function fd() {}
    fd.prototype = {
        length: 0,
        item: function(A) {
            return A >= 0 && A < this.length ? this[A] : null
        },
        toString: function(A, q) {
            for (var K = [], Y = 0; Y < this.length; Y++) CP1(this[Y], K, A, q);
            return K.join("")
        },
        filter: function(A) {
            return Array.prototype.filter.call(this, A)
        },
        indexOf: function(A) {
            return Array.prototype.indexOf.call(this, A)
        }
    };

    function hP1(A, q) {
        this._node = A, this._refresh = q, NTA(this)
    }

    function NTA(A) {
        var q = A._node._inc || A._node.ownerDocument._inc;
        if (A._inc !== q) {
            var K = A._refresh(A._node);
            if (iR4(A, "length", K.length), !A.$$length || K.length < A.$$length) {
                for (var Y = K.length; Y in A; Y++)
                    if (Object.prototype.hasOwnProperty.call(A, Y)) delete A[Y]
            }
            gF1(K, A), A._inc = q
        }
    }
    hP1.prototype.item = function(A) {
        return NTA(this), this[A] || null
    };
    jN(hP1, fd);

    function xj6() {}

    function uR4(A, q) {
        var K = A.length;
        while (K--)
            if (A[K] === q) return K
    }

    function TR4(A, q, K, Y) {
        if (Y) q[uR4(q, Y)] = K;
        else q[q.length++] = K;
        if (A) {
            K.ownerElement = A;
            var z = A.ownerDocument;
            if (z) Y && FR4(z, A, Y), _MY(z, A, K)
        }
    }

    function vR4(A, q, K) {
        var Y = uR4(q, K);
        if (Y >= 0) {
            var z = q.length - 1;
            while (Y < z) q[Y] = q[++Y];
            if (q.length = z, A) {
                var w = A.ownerDocument;
                if (w) FR4(w, A, K), K.ownerElement = null
            }
        } else throw new CJ(bR4, Error(A.tagName + "@" + K))
    }
    xj6.prototype = {
        length: 0,
        item: fd.prototype.item,
        getNamedItem: function(A) {
            var q = this.length;
            while (q--) {
                var K = this[q];
                if (K.nodeName == A) return K
            }
        },
        setNamedItem: function(A) {
            var q = A.ownerElement;
            if (q && q != this._ownerElement) throw new CJ(NR4);
            var K = this.getNamedItem(A.nodeName);
            return TR4(this._ownerElement, this, A, K), K
        },
        setNamedItemNS: function(A) {
            var q = A.ownerElement,
                K;
            if (q && q != this._ownerElement) throw new CJ(NR4);
            return K = this.getNamedItemNS(A.namespaceURI, A.localName), TR4(this._ownerElement, this, A, K), K
        },
        removeNamedItem: function(A) {
            var q = this.getNamedItem(A);
            return vR4(this._ownerElement, this, q), q
        },
        removeNamedItemNS: function(A, q) {
            var K = this.getNamedItemNS(A, q);
            return vR4(this._ownerElement, this, K), K
        },
        getNamedItemNS: function(A, q) {
            var K = this.length;
            while (K--) {
                var Y = this[K];
                if (Y.localName == q && Y.namespaceURI == A) return Y
            }
            return null
        }
    };

    function BR4() {}
    BR4.prototype = {
        hasFeature: function(A, q) {
            return !0
        },
        createDocument: function(A, q, K) {
            var Y = new UF1;
            if (Y.implementation = this, Y.childNodes = new fd, Y.doctype = K || null, K) Y.appendChild(K);
            if (q) {
                var z = Y.createElementNS(A, q);
                Y.appendChild(z)
            }
            return Y
        },
        createDocumentType: function(A, q, K) {
            var Y = new Bj6;
            return Y.name = A, Y.nodeName = A, Y.publicId = q || "", Y.systemId = K || "", Y
        }
    };

    function b2() {}
    b2.prototype = {
        firstChild: null,
        lastChild: null,
        previousSibling: null,
        nextSibling: null,
        attributes: null,
        parentNode: null,
        childNodes: null,
        ownerDocument: null,
        nodeValue: null,
        namespaceURI: null,
        prefix: null,
        localName: null,
        insertBefore: function(A, q) {
            return bj6(this, A, q)
        },
        replaceChild: function(A, q) {
            if (bj6(this, A, q, gR4), q) this.removeChild(q)
        },
        removeChild: function(A) {
            return QR4(this, A)
        },
        appendChild: function(A) {
            return this.insertBefore(A, null)
        },
        hasChildNodes: function() {
            return this.firstChild != null
        },
        cloneNode: function(A) {
            return VTA(this.ownerDocument || this, this, A)
        },
        normalize: function() {
            var A = this.firstChild;
            while (A) {
                var q = A.nextSibling;
                if (q && q.nodeType == Ij6 && A.nodeType == Ij6) this.removeChild(q), A.appendData(q.data);
                else A.normalize(), A = q
            }
        },
        isSupported: function(A, q) {
            return this.ownerDocument.implementation.hasFeature(A, q)
        },
        hasAttributes: function() {
            return this.attributes.length > 0
        },
        lookupPrefix: function(A) {
            var q = this;
            while (q) {
                var K = q._nsMap;
                if (K) {
                    for (var Y in K)
                        if (Object.prototype.hasOwnProperty.call(K, Y) && K[Y] === A) return Y
                }
                q = q.nodeType == SP1 ? q.ownerDocument : q.parentNode
            }
            return null
        },
        lookupNamespaceURI: function(A) {
            var q = this;
            while (q) {
                var K = q._nsMap;
                if (K) {
                    if (Object.prototype.hasOwnProperty.call(K, A)) return K[A]
                }
                q = q.nodeType == SP1 ? q.ownerDocument : q.parentNode
            }
            return null
        },
        isDefaultNamespace: function(A) {
            var q = this.lookupPrefix(A);
            return q == null
        }
    };

    function mR4(A) {
        return A == "<" && "&lt;" || A == ">" && "&gt;" || A == "&" && "&amp;" || A == '"' && "&quot;" || "&#" + A.charCodeAt() + ";"
    }
    gF1(MN, b2);
    gF1(MN, b2.prototype);

    function QF1(A, q) {
        if (q(A)) return !0;
        if (A = A.firstChild)
            do
                if (QF1(A, q)) return !0; while (A = A.nextSibling)
    }

    function UF1() {
        this.ownerDocument = this
    }

    function _MY(A, q, K) {
        A && A._inc++;
        var Y = K.namespaceURI;
        if (Y === FF1.XMLNS) q._nsMap[K.prefix ? K.localName : ""] = K.value
    }

    function FR4(A, q, K, Y) {
        A && A._inc++;
        var z = K.namespaceURI;
        if (z === FF1.XMLNS) delete q._nsMap[K.prefix ? K.localName : ""]
    }

    function TTA(A, q, K) {
        if (A && A._inc) {
            A._inc++;
            var Y = q.childNodes;
            if (K) Y[Y.length++] = K;
            else {
                var z = q.firstChild,
                    w = 0;
                while (z) Y[w++] = z, z = z.nextSibling;
                Y.length = w, delete Y[Y.length]
            }
        }
    }

    function QR4(A, q) {
        var {
            previousSibling: K,
            nextSibling: Y
        } = q;
        if (K) K.nextSibling = Y;
        else A.firstChild = Y;
        if (Y) Y.previousSibling = K;
        else A.lastChild = K;
        return q.parentNode = null, q.previousSibling = null, q.nextSibling = null, TTA(A.ownerDocument, A), q
    }

    function JMY(A) {
        return A && (A.nodeType === b2.DOCUMENT_NODE || A.nodeType === b2.DOCUMENT_FRAGMENT_NODE || A.nodeType === b2.ELEMENT_NODE)
    }

    function XMY(A) {
        return A && (fm(A) || vTA(A) || Nd(A) || A.nodeType === b2.DOCUMENT_FRAGMENT_NODE || A.nodeType === b2.COMMENT_NODE || A.nodeType === b2.PROCESSING_INSTRUCTION_NODE)
    }

    function Nd(A) {
        return A && A.nodeType === b2.DOCUMENT_TYPE_NODE
    }

    function fm(A) {
        return A && A.nodeType === b2.ELEMENT_NODE
    }

    function vTA(A) {
        return A && A.nodeType === b2.TEXT_NODE
    }

    function ER4(A, q) {
        var K = A.childNodes || [];
        if (Zm(K, fm) || Nd(q)) return !1;
        var Y = Zm(K, Nd);
        return !(q && Y && K.indexOf(Y) > K.indexOf(q))
    }

    function kR4(A, q) {
        var K = A.childNodes || [];

        function Y(w) {
            return fm(w) && w !== q
        }
        if (Zm(K, Y)) return !1;
        var z = Zm(K, Nd);
        return !(q && z && K.indexOf(z) > K.indexOf(q))
    }

    function DMY(A, q, K) {
        if (!JMY(A)) throw new CJ(DN, "Unexpected parent node type " + A.nodeType);
        if (K && K.parentNode !== A) throw new CJ(bR4, "child not in parent");
        if (!XMY(q) || Nd(q) && A.nodeType !== b2.DOCUMENT_NODE) throw new CJ(DN, "Unexpected node type " + q.nodeType + " for parent node type " + A.nodeType)
    }

    function jMY(A, q, K) {
        var Y = A.childNodes || [],
            z = q.childNodes || [];
        if (q.nodeType === b2.DOCUMENT_FRAGMENT_NODE) {
            var w = z.filter(fm);
            if (w.length > 1 || Zm(z, vTA)) throw new CJ(DN, "More than one element or text in fragment");
            if (w.length === 1 && !ER4(A, K)) throw new CJ(DN, "Element in fragment can not be inserted before doctype")
        }
        if (fm(q)) {
            if (!ER4(A, K)) throw new CJ(DN, "Only one element can be added and only after doctype")
        }
        if (Nd(q)) {
            if (Zm(Y, Nd)) throw new CJ(DN, "Only one doctype is allowed");
            var H = Zm(Y, fm);
            if (K && Y.indexOf(H) < Y.indexOf(K)) throw new CJ(DN, "Doctype can only be inserted before an element");
            if (!K && H) throw new CJ(DN, "Doctype can not be appended since element is present")
        }
    }

    function gR4(A, q, K) {
        var Y = A.childNodes || [],
            z = q.childNodes || [];
        if (q.nodeType === b2.DOCUMENT_FRAGMENT_NODE) {
            var w = z.filter(fm);
            if (w.length > 1 || Zm(z, vTA)) throw new CJ(DN, "More than one element or text in fragment");
            if (w.length === 1 && !kR4(A, K)) throw new CJ(DN, "Element in fragment can not be inserted before doctype")
        }
        if (fm(q)) {
            if (!kR4(A, K)) throw new CJ(DN, "Only one element can be added and only after doctype")
        }
        if (Nd(q)) {
            let O = function(_) {
                return Nd(_) && _ !== K
            };
            var $ = O;
            if (Zm(Y, O)) throw new CJ(DN, "Only one doctype is allowed");
            var H = Zm(Y, fm);
            if (K && Y.indexOf(H) < Y.indexOf(K)) throw new CJ(DN, "Doctype can only be inserted before an element")
        }
    }

    function bj6(A, q, K, Y) {
        if (DMY(A, q, K), A.nodeType === b2.DOCUMENT_NODE)(Y || jMY)(A, q, K);
        var z = q.parentNode;
        if (z) z.removeChild(q);
        if (q.nodeType === Vd) {
            var w = q.firstChild;
            if (w == null) return q;
            var H = q.lastChild
        } else w = H = q;
        var $ = K ? K.previousSibling : A.lastChild;
        if (w.previousSibling = $, H.nextSibling = K, $) $.nextSibling = w;
        else A.firstChild = w;
        if (K == null) A.lastChild = H;
        else K.previousSibling = H;
        do w.parentNode = A; while (w !== H && (w = w.nextSibling));
        if (TTA(A.ownerDocument || A, A), q.nodeType == Vd) q.firstChild = q.lastChild = null;
        return q
    }

    function MMY(A, q) {
        if (q.parentNode) q.parentNode.removeChild(q);
        if (q.parentNode = A, q.previousSibling = A.lastChild, q.nextSibling = null, q.previousSibling) q.previousSibling.nextSibling = q;
        else A.firstChild = q;
        return A.lastChild = q, TTA(A.ownerDocument, A, q), q
    }
    UF1.prototype = {
        nodeName: "#document",
        nodeType: IR4,
        doctype: null,
        documentElement: null,
        _inc: 1,
        insertBefore: function(A, q) {
            if (A.nodeType == Vd) {
                var K = A.firstChild;
                while (K) {
                    var Y = K.nextSibling;
                    this.insertBefore(K, q), K = Y
                }
                return A
            }
            if (bj6(this, A, q), A.ownerDocument = this, this.documentElement === null && A.nodeType === eh) this.documentElement = A;
            return A
        },
        removeChild: function(A) {
            if (this.documentElement == A) this.documentElement = null;
            return QR4(this, A)
        },
        replaceChild: function(A, q) {
            if (bj6(this, A, q, gR4), A.ownerDocument = this, q) this.removeChild(q);
            if (fm(A)) this.documentElement = A
        },
        importNode: function(A, q) {
            return lR4(this, A, q)
        },
        getElementById: function(A) {
            var q = null;
            return QF1(this.documentElement, function(K) {
                if (K.nodeType == eh) {
                    if (K.getAttribute("id") == A) return q = K, !0
                }
            }), q
        },
        getElementsByClassName: function(A) {
            var q = VR4(A);
            return new hP1(this, function(K) {
                var Y = [];
                if (q.length > 0) QF1(K.documentElement, function(z) {
                    if (z !== K && z.nodeType === eh) {
                        var w = z.getAttribute("class");
                        if (w) {
                            var H = A === w;
                            if (!H) {
                                var $ = VR4(w);
                                H = q.every(HMY($))
                            }
                            if (H) Y.push(z)
                        }
                    }
                });
                return Y
            })
        },
        createElement: function(A) {
            var q = new i31;
            q.ownerDocument = this, q.nodeName = A, q.tagName = A, q.localName = A, q.childNodes = new fd;
            var K = q.attributes = new xj6;
            return K._ownerElement = q, q
        },
        createDocumentFragment: function() {
            var A = new mj6;
            return A.ownerDocument = this, A.childNodes = new fd, A
        },
        createTextNode: function(A) {
            var q = new ETA;
            return q.ownerDocument = this, q.appendData(A), q
        },
        createComment: function(A) {
            var q = new kTA;
            return q.ownerDocument = this, q.appendData(A), q
        },
        createCDATASection: function(A) {
            var q = new LTA;
            return q.ownerDocument = this, q.appendData(A), q
        },
        createProcessingInstruction: function(A, q) {
            var K = new yTA;
            return K.ownerDocument = this, K.tagName = K.nodeName = K.target = A, K.nodeValue = K.data = q, K
        },
        createAttribute: function(A) {
            var q = new uj6;
            return q.ownerDocument = this, q.name = A, q.nodeName = A, q.localName = A, q.specified = !0, q
        },
        createEntityReference: function(A) {
            var q = new RTA;
            return q.ownerDocument = this, q.nodeName = A, q
        },
        createElementNS: function(A, q) {
            var K = new i31,
                Y = q.split(":"),
                z = K.attributes = new xj6;
            if (K.childNodes = new fd, K.ownerDocument = this, K.nodeName = q, K.tagName = q, K.namespaceURI = A, Y.length == 2) K.prefix = Y[0], K.localName = Y[1];
            else K.localName = q;
            return z._ownerElement = K, K
        },
        createAttributeNS: function(A, q) {
            var K = new uj6,
                Y = q.split(":");
            if (K.ownerDocument = this, K.nodeName = q, K.name = q, K.namespaceURI = A, K.specified = !0, Y.length == 2) K.prefix = Y[0], K.localName = Y[1];
            else K.localName = q;
            return K
        }
    };
    jN(UF1, b2);

    function i31() {
        this._nsMap = {}
    }
    i31.prototype = {
        nodeType: eh,
        hasAttribute: function(A) {
            return this.getAttributeNode(A) != null
        },
        getAttribute: function(A) {
            var q = this.getAttributeNode(A);
            return q && q.value || ""
        },
        getAttributeNode: function(A) {
            return this.attributes.getNamedItem(A)
        },
        setAttribute: function(A, q) {
            var K = this.ownerDocument.createAttribute(A);
            K.value = K.nodeValue = "" + q, this.setAttributeNode(K)
        },
        removeAttribute: function(A) {
            var q = this.getAttributeNode(A);
            q && this.removeAttributeNode(q)
        },
        appendChild: function(A) {
            if (A.nodeType === Vd) return this.insertBefore(A, null);
            else return MMY(this, A)
        },
        setAttributeNode: function(A) {
            return this.attributes.setNamedItem(A)
        },
        setAttributeNodeNS: function(A) {
            return this.attributes.setNamedItemNS(A)
        },
        removeAttributeNode: function(A) {
            return this.attributes.removeNamedItem(A.nodeName)
        },
        removeAttributeNS: function(A, q) {
            var K = this.getAttributeNodeNS(A, q);
            K && this.removeAttributeNode(K)
        },
        hasAttributeNS: function(A, q) {
            return this.getAttributeNodeNS(A, q) != null
        },
        getAttributeNS: function(A, q) {
            var K = this.getAttributeNodeNS(A, q);
            return K && K.value || ""
        },
        setAttributeNS: function(A, q, K) {
            var Y = this.ownerDocument.createAttributeNS(A, q);
            Y.value = Y.nodeValue = "" + K, this.setAttributeNode(Y)
        },
        getAttributeNodeNS: function(A, q) {
            return this.attributes.getNamedItemNS(A, q)
        },
        getElementsByTagName: function(A) {
            return new hP1(this, function(q) {
                var K = [];
                return QF1(q, function(Y) {
                    if (Y !== q && Y.nodeType == eh && (A === "*" || Y.tagName == A)) K.push(Y)
                }), K
            })
        },
        getElementsByTagNameNS: function(A, q) {
            return new hP1(this, function(K) {
                var Y = [];
                return QF1(K, function(z) {
                    if (z !== K && z.nodeType === eh && (A === "*" || z.namespaceURI === A) && (q === "*" || z.localName == q)) Y.push(z)
                }), Y
            })
        }
    };
    UF1.prototype.getElementsByTagName = i31.prototype.getElementsByTagName;
    UF1.prototype.getElementsByTagNameNS = i31.prototype.getElementsByTagNameNS;
    jN(i31, b2);

    function uj6() {}
    uj6.prototype.nodeType = SP1;
    jN(uj6, b2);

    function pF1() {}
    pF1.prototype = {
        data: "",
        substringData: function(A, q) {
            return this.data.substring(A, A + q)
        },
        appendData: function(A) {
            A = this.data + A, this.nodeValue = this.data = A, this.length = A.length
        },
        insertData: function(A, q) {
            this.replaceData(A, 0, q)
        },
        appendChild: function(A) {
            throw Error(Pj[DN])
        },
        deleteData: function(A, q) {
            this.replaceData(A, q, "")
        },
        replaceData: function(A, q, K) {
            var Y = this.data.substring(0, A),
                z = this.data.substring(A + q);
            K = Y + K + z, this.nodeValue = this.data = K, this.length = K.length
        }
    };
    jN(pF1, b2);

    function ETA() {}
    ETA.prototype = {
        nodeName: "#text",
        nodeType: Ij6,
        splitText: function(A) {
            var q = this.data,
                K = q.substring(A);
            q = q.substring(0, A), this.data = this.nodeValue = q, this.length = q.length;
            var Y = this.ownerDocument.createTextNode(K);
            if (this.parentNode) this.parentNode.insertBefore(Y, this.nextSibling);
            return Y
        }
    };
    jN(ETA, pF1);

    function kTA() {}
    kTA.prototype = {
        nodeName: "#comment",
        nodeType: hR4
    };
    jN(kTA, pF1);

    function LTA() {}
    LTA.prototype = {
        nodeName: "#cdata-section",
        nodeType: yR4
    };
    jN(LTA, pF1);

    function Bj6() {}
    Bj6.prototype.nodeType = xR4;
    jN(Bj6, b2);

    function UR4() {}
    UR4.prototype.nodeType = OMY;
    jN(UR4, b2);

    function pR4() {}
    pR4.prototype.nodeType = $MY;
    jN(pR4, b2);

    function RTA() {}
    RTA.prototype.nodeType = CR4;
    jN(RTA, b2);

    function mj6() {}
    mj6.prototype.nodeName = "#document-fragment";
    mj6.prototype.nodeType = Vd;
    jN(mj6, b2);

    function yTA() {}
    yTA.prototype.nodeType = SR4;
    jN(yTA, b2);

    function dR4() {}
    dR4.prototype.serializeToString = function(A, q, K) {
        return cR4.call(A, q, K)
    };
    b2.prototype.toString = cR4;

    function cR4(A, q) {
        var K = [],
            Y = this.nodeType == 9 && this.documentElement || this,
            z = Y.prefix,
            w = Y.namespaceURI;
        if (w && z == null) {
            var z = Y.lookupPrefix(w);
            if (z == null) var H = [{
                namespace: w,
                prefix: null
            }]
        }
        return CP1(this, K, A, q, H), K.join("")
    }

    function LR4(A, q, K) {
        var Y = A.prefix || "",
            z = A.namespaceURI;
        if (!z) return !1;
        if (Y === "xml" && z === FF1.XML || z === FF1.XMLNS) return !1;
        var w = K.length;
        while (w--) {
            var H = K[w];
            if (H.prefix === Y) return H.namespace !== z
        }
        return !0
    }

    function fTA(A, q, K) {
        A.push(" ", q, '="', K.replace(/[<>&"\t\n\r]/g, mR4), '"')
    }

    function CP1(A, q, K, Y, z) {
        if (!z) z = [];
        if (Y)
            if (A = Y(A), A) {
                if (typeof A == "string") {
                    q.push(A);
                    return
                }
            } else return;
        switch (A.nodeType) {
            case eh:
                var w = A.attributes,
                    H = w.length,
                    G = A.firstChild,
                    $ = A.tagName;
                K = FF1.isHTML(A.namespaceURI) || K;
                var O = $;
                if (!K && !A.prefix && A.namespaceURI) {
                    var _;
                    for (var J = 0; J < w.length; J++)
                        if (w.item(J).name === "xmlns") {
                            _ = w.item(J).value;
                            break
                        } if (!_)
                        for (var X = z.length - 1; X >= 0; X--) {
                            var D = z[X];
                            if (D.prefix === "" && D.namespace === A.namespaceURI) {
                                _ = D.namespace;
                                break
                            }
                        }
                    if (_ !== A.namespaceURI)
                        for (var X = z.length - 1; X >= 0; X--) {
                            var D = z[X];
                            if (D.namespace === A.namespaceURI) {
                                if (D.prefix) O = D.prefix + ":" + $;
                                break
                            }
                        }
                }
                q.push("<", O);
                for (var j = 0; j < H; j++) {
                    var M = w.item(j);
                    if (M.prefix == "xmlns") z.push({
                        prefix: M.localName,
                        namespace: M.value
                    });
                    else if (M.nodeName == "xmlns") z.push({
                        prefix: "",
                        namespace: M.value
                    })
                }
                for (var j = 0; j < H; j++) {
                    var M = w.item(j);
                    if (LR4(M, K, z)) {
                        var P = M.prefix || "",
                            W = M.namespaceURI;
                        fTA(q, P ? "xmlns:" + P : "xmlns", W), z.push({
                            prefix: P,
                            namespace: W
                        })
                    }
                    CP1(M, q, K, Y, z)
                }
                if ($ === O && LR4(A, K, z)) {
                    var P = A.prefix || "",
                        W = A.namespaceURI;
                    fTA(q, P ? "xmlns:" + P : "xmlns", W), z.push({
                        prefix: P,
                        namespace: W
                    })
                }
                if (G || K && !/^(?:meta|link|img|br|hr|input)$/i.test($)) {
                    if (q.push(">"), K && /^script$/i.test($))
                        while (G) {
                            if (G.data) q.push(G.data);
                            else CP1(G, q, K, Y, z.slice());
                            G = G.nextSibling
                        } else
                            while (G) CP1(G, q, K, Y, z.slice()), G = G.nextSibling;
                    q.push("</", O, ">")
                } else q.push("/>");
                return;
            case IR4:
            case Vd:
                var G = A.firstChild;
                while (G) CP1(G, q, K, Y, z.slice()), G = G.nextSibling;
                return;
            case SP1:
                return fTA(q, A.name, A.value);
            case Ij6:
                return q.push(A.data.replace(/[<&>]/g, mR4));
            case yR4:
                return q.push("<![CDATA[", A.data, "]]>");
            case hR4:
                return q.push("<!--", A.data, "-->");
            case xR4:
                var {
                    publicId: f, systemId: Z
                } = A;
                if (q.push("<!DOCTYPE ", A.name), f) {
                    if (q.push(" PUBLIC ", f), Z && Z != ".") q.push(" ", Z);
                    q.push(">")
                } else if (Z && Z != ".") q.push(" SYSTEM ", Z, ">");
                else {
                    var N = A.internalSubset;
                    if (N) q.push(" [", N, "]");
                    q.push(">")
                }
                return;
            case SR4:
                return q.push("<?", A.target, " ", A.data, "?>");
            case CR4:
                return q.push("&", A.nodeName, ";");
            default:
                q.push("??", A.nodeName)
        }
    }

    function lR4(A, q, K) {
        var Y;
        switch (q.nodeType) {
            case eh:
                Y = q.cloneNode(!1), Y.ownerDocument = A;
            case Vd:
                break;
            case SP1:
                K = !0;
                break
        }
        if (!Y) Y = q.cloneNode(!1);
        if (Y.ownerDocument = A, Y.parentNode = null, K) {
            var z = q.firstChild;
            while (z) Y.appendChild(lR4(A, z, K)), z = z.nextSibling
        }
        return Y
    }

    function VTA(A, q, K) {
        var Y = new q.constructor;
        for (var z in q)
            if (Object.prototype.hasOwnProperty.call(q, z)) {
                var w = q[z];
                if (typeof w != "object") {
                    if (w != Y[z]) Y[z] = w
                }
            } if (q.childNodes) Y.childNodes = new fd;
        switch (Y.ownerDocument = A, Y.nodeType) {
            case eh:
                var H = q.attributes,
                    $ = Y.attributes = new xj6,
                    O = H.length;
                $._ownerElement = Y;
                for (var _ = 0; _ < O; _++) Y.setAttributeNode(VTA(A, H.item(_), !0));
                break;
            case SP1:
                K = !0
        }
        if (K) {
            var J = q.firstChild;
            while (J) Y.appendChild(VTA(A, J, K)), J = J.nextSibling
        }
        return Y
    }

    function iR4(A, q, K) {
        A[q] = K
    }
    try {
        if (Object.defineProperty) {
            let A = function(q) {
                switch (q.nodeType) {
                    case eh:
                    case Vd:
                        var K = [];
                        q = q.firstChild;
                        while (q) {
                            if (q.nodeType !== 7 && q.nodeType !== 8) K.push(A(q));
                            q = q.nextSibling
                        }
                        return K.join("");
                    default:
                        return q.nodeValue
                }
            };
            PMY = A, Object.defineProperty(hP1.prototype, "length", {
                get: function() {
                    return NTA(this), this.$$length
                }
            }), Object.defineProperty(b2.prototype, "textContent", {
                get: function() {
                    return A(this)
                },
                set: function(q) {
                    switch (this.nodeType) {
                        case eh:
                        case Vd:
                            while (this.firstChild) this.removeChild(this.firstChild);
                            if (q || String(q)) this.appendChild(this.ownerDocument.createTextNode(q));
                            break;
                        default:
                            this.data = q, this.value = q, this.nodeValue = q
                    }
                }
            }), iR4 = function(q, K, Y) {
                q["$$" + K] = Y
            }
        }
    } catch (A) {}
    var PMY;
    WMY.DocumentType = Bj6;
    WMY.DOMException = CJ;
    WMY.DOMImplementation = BR4;
    WMY.Element = i31;
    WMY.Node = b2;
    WMY.NodeList = fd;
    WMY.XMLSerializer = dR4
})