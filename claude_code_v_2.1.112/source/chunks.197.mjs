
// @from(Ln 512046, Col 0)
function PX7(q) {
    let K = s(15),
        {
            toolName: _,
            description: z
        } = q,
        Y;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = Z9(), K[0] = Y;
    else Y = K[0];
    let A = Y,
        O;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) O = T_(), K[1] = O;
    else O = K[1];
    let w = O,
        $;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) $ = KH(), K[2] = $;
    else $ = K[2];
    let j = $,
        H, J;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) H = pw.createElement(u, {
        marginBottom: 1
    }, pw.createElement(Y5, null), pw.createElement(T, {
        color: "warning",
        bold: !0
    }, " ", "Waiting for team lead approval")), J = w && j && pw.createElement(u, {
        marginBottom: 1
    }, pw.createElement(c75, {
        name: w,
        color: j
    })), K[3] = H, K[4] = J;
    else H = K[3], J = K[4];
    let X;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) X = pw.createElement(T, {
        dimColor: !0
    }, "Tool: "), K[5] = X;
    else X = K[5];
    let M;
    if (K[6] !== _) M = pw.createElement(u, null, X, pw.createElement(T, null, _)), K[6] = _, K[7] = M;
    else M = K[7];
    let P;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) P = pw.createElement(T, {
        dimColor: !0
    }, "Action: "), K[8] = P;
    else P = K[8];
    let W;
    if (K[9] !== z) W = pw.createElement(u, null, P, pw.createElement(T, null, z)), K[9] = z, K[10] = W;
    else W = K[10];
    let D;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) D = A && pw.createElement(u, {
        marginTop: 1
    }, pw.createElement(T, {
        dimColor: !0
    }, "Permission request sent to team ", '"', A, '"', " leader")), K[11] = D;
    else D = K[11];
    let Z;
    if (K[12] !== M || K[13] !== W) Z = pw.createElement(u, {
        flexDirection: "column",
        borderStyle: "round",
        borderColor: "warning",
        paddingX: 1
    }, H, J, M, W, D), K[12] = M, K[13] = W, K[14] = Z;
    else Z = K[14];
    return Z
}
// @from(Ln 512110, Col 4)
pw
// @from(Ln 512111, Col 4)
n75 = L(() => {
    o6();
    g6();
    zY();
    Ej();
    l75();
    pw = K6(P6(), 1)
})
// @from(Ln 512119, Col 4)
i75
// @from(Ln 512120, Col 4)
r75 = L(() => {
    nH();
    i75 = (() => {
        let q = l5(),
            K = null;
        return {
            subscribe: q.subscribe,
            emit(_) {
                if (_ === K) return;
                K = _, q.emit(_)
            }
        }
    })()
})
// @from(Ln 512135, Col 0)
function ga8(q) {
    let K = !1,
        _ = !1;
    return {
        resolve(z) {
            if (_) return;
            _ = !0, K = !0, q(z)
        },
        isResolved() {
            return K
        },
        claim() {
            if (K) return !1;
            return K = !0, !0
        }
    }
}
// @from(Ln 512153, Col 0)
function o75(q, K, _, z, Y, A, O) {
    let w = z.message.id,
        $ = {
            tool: q,
            input: K,
            toolUseContext: _,
            assistantMessage: z,
            messageId: w,
            toolUseID: Y,
            logDecision(j, H) {
                Ou8({
                    tool: q,
                    input: H?.input ?? K,
                    toolUseContext: _,
                    messageId: w,
                    toolUseID: Y
                }, j, H?.permissionPromptStartTimeMs)
            },
            logCancelled() {
                d("tengu_tool_use_cancelled", {
                    messageID: w,
                    toolName: PK(q.name)
                })
            },
            persistPermissions(j) {
                if (j.length === 0) return !1;
                Hp(j);
                let H = _.getAppState();
                return A(Ky(H.toolPermissionContext, j)), j.some((J) => CB1(J.destination))
            },
            resolveIfAborted(j) {
                if (!_.abortController.signal.aborted) return !1;
                return this.logCancelled(), j(this.cancelAndAbort(void 0, !0)), !0
            },
            cancelAndAbort(j, H, J) {
                let X = !!_.agentId,
                    M = j ? `${X?G38:YU8}${j}` : X ? tF : zM6,
                    P = X ? M : ZI6(M);
                if (H || !j && !J?.length && !X) E(`Aborting: tool=${q.name} isAbort=${H} hasFeedback=${!!j} isSubagent=${X}`), _.abortController.abort();
                return {
                    behavior: "ask",
                    message: P,
                    contentBlocks: J
                }
            },
            ...{},
            async runHooks(j, H, J, X) {
                for await (let M of Be(q.name, Y, K, _, j, H, _.abortController.signal)) if (M.permissionRequestResult) {
                    let P = M.permissionRequestResult;
                    if (P.behavior === "allow") {
                        let W = P.updatedInput ?? J ?? K;
                        if (P.updatedInput) {
                            let D = y98(await yM6(q, W, _), q.name);
                            if (D?.behavior === "deny") return this.logDecision({
                                decision: "reject",
                                source: "config"
                            }, {
                                input: W,
                                permissionPromptStartTimeMs: X
                            }), D;
                            if (D?.behavior === "ask") return this.updateQueueItem({
                                input: W,
                                permissionResult: D
                            }), {
                                reprompted: D,
                                finalInput: W
                            }
                        }
                        return this.handleHookAllow(W, P.updatedPermissions ?? [], X)
                    } else if (P.behavior === "deny") {
                        if (this.logDecision({
                                decision: "reject",
                                source: {
                                    type: "hook"
                                }
                            }, {
                                permissionPromptStartTimeMs: X
                            }), P.interrupt) E(`Hook interrupt: tool=${q.name} hookMessage=${P.message}`), _.abortController.abort();
                        return this.buildDeny(P.message || "Permission denied by hook", {
                            type: "hook",
                            hookName: "PermissionRequest",
                            reason: P.message
                        })
                    }
                }
                return null
            },
            buildAllow(j, H) {
                return {
                    behavior: "allow",
                    updatedInput: j,
                    userModified: H?.userModified ?? !1,
                    ...H?.decisionReason && {
                        decisionReason: H.decisionReason
                    },
                    ...H?.acceptFeedback && {
                        acceptFeedback: H.acceptFeedback
                    },
                    ...H?.contentBlocks && H.contentBlocks.length > 0 && {
                        contentBlocks: H.contentBlocks
                    }
                }
            },
            buildDeny(j, H) {
                return {
                    behavior: "deny",
                    message: j,
                    decisionReason: H
                }
            },
            handleUserAllow(j, H, J, X, M, P) {
                let W = this.persistPermissions(H);
                this.logDecision({
                    decision: "accept",
                    source: {
                        type: "user",
                        permanent: W
                    }
                }, {
                    input: j,
                    permissionPromptStartTimeMs: X
                });
                let D = q.inputsEquivalent ? !q.inputsEquivalent(K, j) : !1,
                    Z = J?.trim();
                return this.buildAllow(j, {
                    userModified: D,
                    decisionReason: P,
                    acceptFeedback: Z || void 0,
                    contentBlocks: M
                })
            },
            handleHookAllow(j, H, J) {
                let X = this.persistPermissions(H);
                return this.logDecision({
                    decision: "accept",
                    source: {
                        type: "hook",
                        permanent: X
                    }
                }, {
                    input: j,
                    permissionPromptStartTimeMs: J
                }), this.buildAllow(j, {
                    decisionReason: {
                        type: "hook",
                        hookName: "PermissionRequest"
                    }
                })
            },
            pushToQueue(j) {
                O?.push(j)
            },
            removeFromQueue() {
                O?.remove(Y)
            },
            updateQueueItem(j) {
                O?.update(Y, j)
            }
        };
    return Object.freeze($)
}
// @from(Ln 512315, Col 0)
function g7A(q) {
    if (q.tool.name === AO) return "answer question";
    if (q.tool.name === Fk) return "approve plan";
    return `approve ${q.tool.userFacingName(q.input).trim()||q.tool.name}`
}
// @from(Ln 512321, Col 0)
function a75(q) {
    return (K) => {
        q((_) => {
            let z = typeof K === "function" ? K(_) : K,
                Y = z[0];
            return i75.emit(Y ? g7A(Y) : null), z
        })
    }
}
// @from(Ln 512331, Col 0)
function s75(q) {
    return {
        push(K) {
            q((_) => [..._, K])
        },
        remove(K) {
            q((_) => _.filter((z) => z.toolUseID !== K))
        },
        update(K, _) {
            q((z) => z.map((Y) => Y.toolUseID === K ? {
                ...Y,
                ..._
            } : Y))
        }
    }
}
// @from(Ln 512347, Col 4)
xz8 = L(() => {
    C8();
    q2();
    cp();
    MT();
    K8();
    K9();
    _7();
    MH();
    g$();
    wu8();
    r75()
})
// @from(Ln 512361, Col 0)
function t75(q, K = !1, _ = !1) {
    let z = M8((H) => H.teamContext),
        Y = gn.useRef(0),
        A = gn.useRef(void 0),
        O = gn.useRef(void 0),
        w = gn.useRef(0),
        $ = gn.useRef(new Set),
        j = gn.useRef(0);
    gn.useEffect(() => {
        U7A?.initSessionLog()
    }, []), gn.useEffect(() => {
        if (K) {
            j.current = q.length;
            return
        }
        let H = q[0]?.uuid,
            J = Y.current,
            X = O.current === void 0,
            M = H !== void 0 && !X && H === O.current && J <= q.length,
            P = H !== void 0 && !X && H === O.current && J > q.length,
            W = M ? J : 0,
            D = M || X ? j.current : W,
            Z = Jz8(q, Math.max(W, D), _);
        if (!M) j.current = Z;
        if (Z === W) return;
        let G = W === 0 && Z === q.length ? q : q.slice(W, Z),
            f = M ? A.current : void 0;
        if (W === 0) $.current.clear();
        eo8(G, $.current);
        let v = ++w.current;
        if (HF(G, z4() ? {
                teamName: z?.teamName,
                agentName: z?.selfAgentName
            } : {}, f, $.current).then((V) => {
                if (v !== w.current) return;
                if (V && !M) A.current = V
            }), M || X || P) {
            let V = Wz8(G, $.current).findLast(Jz6);
            if (V) A.current = V.uuid
        }
        Y.current = Z, O.current = H
    }, [q, K, _, z?.teamName, z?.selfAgentName])
}
// @from(Ln 512404, Col 4)
gn
// @from(Ln 512404, Col 8)
U7A = null
// @from(Ln 512405, Col 4)
e75 = L(() => {
    N7();
    fO();
    g4();
    gn = K6(P6(), 1)
})
// @from(Ln 512412, Col 0)
function qq5(q) {
    if (!q || typeof q !== "object") return !1;
    return "behavior" in q && (q.behavior === "allow" || q.behavior === "deny")
}
// @from(Ln 512417, Col 0)
function uz8(q) {
    return (q.split("__").pop() || q).replace(/_/g, " ").replace(/\b\w/g, (_) => _.toUpperCase())
}
// @from(Ln 512420, Col 4)
WX7 = () => {}
// @from(Ln 512422, Col 0)
function Ua8(q) {
    if (q.type !== "user") return;
    let K = q.message?.content;
    if (!K) return;
    if (Array.isArray(K) && K.length === 0) return;
    let _ = "uuid" in q && typeof q.uuid === "string" ? q.uuid : void 0;
    return {
        content: Array.isArray(K) ? Q7A(K) : K,
        uuid: _
    }
}
// @from(Ln 512434, Col 0)
function Q7A(q) {
    if (!q.some(Kq5)) return q;
    return q.map((K) => {
        if (!Kq5(K)) return K;
        let _ = K.source,
            z = typeof _.mediaType === "string" && _.mediaType ? _.mediaType : Es6(K.source.data);
        return {
            ...K,
            source: {
                type: "base64",
                media_type: z,
                data: K.source.data
            }
        }
    })
}
// @from(Ln 512451, Col 0)
function Kq5(q) {
    if (q.type !== "image" || q.source?.type !== "base64") return !1;
    return !q.source.media_type
}
// @from(Ln 512455, Col 4)
DX7 = () => {}
// @from(Ln 512460, Col 0)
function ZX7(q) {
    return q === T4 ? Gh : q
}
// @from(Ln 512464, Col 0)
function Qa8(q) {
    let _ = y7()?.outputStyle ?? lk,
        z = {
            type: "system",
            subtype: "init",
            cwd: b8(),
            session_id: I8(),
            tools: q.tools.map((Y) => ZX7(Y.name)),
            mcp_servers: q.mcpClients.map((Y) => ({
                name: Y.name,
                status: Y.type
            })),
            model: q.model,
            permissionMode: q.permissionMode,
            slash_commands: q.commands.filter((Y) => Y.userInvocable !== !1).map((Y) => Y.name),
            apiKeySource: Vw().source,
            betas: eM(),
            claude_code_version: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.VERSION,
            output_style: _,
            agents: q.agents.map((Y) => Y.agentType),
            skills: q.skills.filter((Y) => Y.userInvocable !== !1).map((Y) => Y.name),
            plugins: q.plugins.map((Y) => ({
                name: Y.name,
                path: Y.path,
                source: Y.source
            })),
            ...q.pluginErrors.length > 0 && {
                plugin_errors: q.pluginErrors.map((Y) => ({
                    ...Y
                }))
            },
            uuid: c7A()
        };
    if (x3()) {
        z.memory_paths = {
            auto: Nw()
        };
        {
            let Y = (ev(), B7(Tp));
            if (Y.isTeamMemoryEnabled()) z.memory_paths.team = Y.getTeamMemPath()
        }
    }
    return z.fast_mode_state = yE(q.model, q.fastMode), z
}
// @from(Ln 512515, Col 4)
fX7 = L(() => {
    y8();
    ec();
    VY();
    sY();
    T7();
    n7();
    zf();
    a1()
})
// @from(Ln 512526, Col 0)
function Yq5(q, K, _) {
    if (da8(), o3()) return;
    if (!u8("tengu_bridge_client_presence_enabled", !1)) return;
    nu6 = {
        sessionId: q,
        baseUrl: K,
        getAuthHeaders: _
    }, VX7 = 0, GX7 = u61(zq5), vX7 = l61(() => {
        let z = vD6();
        if (E(`[presence] terminal focus → ${z===void 0?"unknown":z?"focused":"blurred"}`), z === !0) zq5()
    }), E(`[presence] wired for session ${q}`)
}
// @from(Ln 512539, Col 0)
function da8() {
    GX7?.(), GX7 = null, vX7?.(), vX7 = null, nu6 = null, TX7 = null
}
// @from(Ln 512543, Col 0)
function zq5() {
    if (!nu6) return;
    let q = Date.now();
    if (q - VX7 < _q5) return;
    VX7 = q, TX7 ??= new Date(q).toISOString();
    let K = `${nu6.baseUrl}/v1/code/sessions/${nu6.sessionId}/client/presence`;
    E(`[presence] pulse → ${K}`), Z1.post(K, {
        client_id: l7A,
        connected_at: TX7
    }, {
        headers: {
            ...nu6.getAuthHeaders(),
            "anthropic-version": "2023-06-01",
            "anthropic-client-platform": "claude_code_cli"
        },
        timeout: _q5,
        validateStatus: () => !0
    }).then((_) => {
        if (_.status >= 400) E(`[presence] pulse got ${_.status}`)
    }, () => {})
}
// @from(Ln 512564, Col 4)
_q5 = 5000
// @from(Ln 512565, Col 4)
l7A
// @from(Ln 512565, Col 9)
nu6 = null
// @from(Ln 512566, Col 4)
GX7 = null
// @from(Ln 512567, Col 4)
vX7 = null
// @from(Ln 512568, Col 4)
TX7 = null
// @from(Ln 512569, Col 4)
VX7 = 0
// @from(Ln 512570, Col 4)
Aq5 = L(() => {
    CK();
    D61();
    y8();
    K8();
    G$();
    B1();
    l7A = mB6()
})
// @from(Ln 512582, Col 0)
async function wq5(q, K, _) {
    let [z, Y] = await Promise.all([K.readMain(), K.readSubagents()]), A = new Set;
    for (let j of z ?? []) {
        let H = j.payload.uuid;
        if (typeof H === "string") A.add(H)
    }
    for (let j of Y ?? []) {
        let H = j.payload.uuid;
        if (typeof H === "string") A.add(H)
    }
    E(`[persistence-sync] Server has ${A.size} events since compaction`);
    let O = (j) => {
            E(`[persistence-sync] Write failed: ${j}`)
        },
        w = await Oq5(xT(I8()), A);
    for (let j of w) q("transcript", j, {
        ...RJ(j) && {
            isCompaction: !0
        }
    }).catch(O);
    let $ = 0;
    for (let {
            agentId: j,
            path: H
        }
        of await r7A(_)) {
        let J = await Oq5(H, A);
        for (let X of J) q("transcript", X, {
            ...RJ(X) && {
                isCompaction: !0
            },
            agentId: j
        }).catch(O);
        $ += J.length
    }
    return E(`[persistence-sync] Uploaded ${w.length} main + ${$} subagent entries`), {
        uploadedMain: w.length,
        uploadedSubagents: $
    }
}
// @from(Ln 512622, Col 0)
async function r7A(q) {
    return (await Promise.all(q.map(async (_) => {
        let z = X0(_);
        try {
            let Y = await n7A(z);
            return {
                agentId: _,
                path: z,
                size: Y.size,
                mtimeMs: Y.mtimeMs
            }
        } catch {
            return null
        }
    }))).filter((_) => _ !== null).filter((_) => _.size <= AQ6).sort((_, z) => z.mtimeMs - _.mtimeMs).slice(0, i7A)
}
// @from(Ln 512638, Col 0)
async function Oq5(q, K) {
    let _ = [];
    try {
        for await (let z of ow8(q)) {
            let Y;
            try {
                Y = n8(z)
            } catch {
                continue
            }
            if (!a7A(Y)) continue;
            if (RJ(Y)) break;
            if (!K.has(Y.uuid)) _.push(Y)
        }
    } catch (z) {
        if (t1(z)) return [];
        throw z
    }
    return _.reverse()
}
// @from(Ln 512659, Col 0)
function a7A(q) {
    return typeof q === "object" && q !== null && "type" in q && o7A.has(q.type) && "uuid" in q && typeof q.uuid === "string"
}
// @from(Ln 512662, Col 4)
i7A = 20
// @from(Ln 512663, Col 4)
o7A
// @from(Ln 512664, Col 4)
$q5 = L(() => {
    y8();
    K8();
    m8();
    Yq();
    _7();
    g4();
    hm();
    e8();
    o7A = new Set(["user", "assistant", "attachment", "system"])
})
// @from(Ln 512675, Col 0)
class CW6 {
    pending = [];
    pendingAtClose = 0;
    draining = !1;
    closed = !1;
    backpressureResolvers = [];
    sleepResolve = null;
    flushResolvers = [];
    droppedBatches = 0;
    config;
    constructor(q) {
        this.config = q
    }
    get droppedBatchCount() {
        return this.droppedBatches
    }
    get pendingCount() {
        return this.closed ? this.pendingAtClose : this.pending.length
    }
    async enqueue(q) {
        if (this.closed) return;
        let K = Array.isArray(q) ? q : [q];
        if (K.length === 0) return;
        while (this.pending.length + K.length > this.config.maxQueueSize && !this.closed) await new Promise((_) => {
            this.backpressureResolvers.push(_)
        });
        if (this.closed) return;
        this.pending.push(...K), this.drain()
    }
    flush() {
        if (this.pending.length === 0 && !this.draining) return Promise.resolve();
        return this.drain(), new Promise((q) => {
            this.flushResolvers.push(q)
        })
    }
    close() {
        if (this.closed) return;
        this.closed = !0, this.pendingAtClose = this.pending.length, this.pending = [], this.sleepResolve?.(), this.sleepResolve = null;
        for (let q of this.backpressureResolvers) q();
        this.backpressureResolvers = [];
        for (let q of this.flushResolvers) q();
        this.flushResolvers = []
    }
    async drain() {
        if (this.draining || this.closed) return;
        this.draining = !0;
        let q = 0;
        try {
            while (this.pending.length > 0 && !this.closed) {
                let K = this.takeBatch();
                if (K.length === 0) continue;
                try {
                    await this.config.send(K), q = 0
                } catch (_) {
                    if (q++, this.config.maxConsecutiveFailures !== void 0 && q >= this.config.maxConsecutiveFailures) {
                        this.droppedBatches++, this.config.onBatchDropped?.(K.length, q), q = 0, this.releaseBackpressure();
                        continue
                    }
                    this.pending = K.concat(this.pending);
                    let z = _ instanceof iu6 ? _.retryAfterMs : void 0;
                    await this.sleep(this.retryDelay(q, z));
                    continue
                }
                this.releaseBackpressure()
            }
        } finally {
            if (this.draining = !1, this.pending.length === 0) {
                for (let K of this.flushResolvers) K();
                this.flushResolvers = []
            }
        }
    }
    takeBatch() {
        let {
            maxBatchSize: q,
            maxBatchBytes: K
        } = this.config;
        if (K === void 0) return this.pending.splice(0, q);
        let _ = 0,
            z = 0;
        while (z < this.pending.length && z < q) {
            let Y;
            try {
                Y = Buffer.byteLength(I6(this.pending[z]))
            } catch {
                this.pending.splice(z, 1);
                continue
            }
            if (z > 0 && _ + Y > K) break;
            _ += Y, z++
        }
        return this.pending.splice(0, z)
    }
    retryDelay(q, K) {
        let _ = Math.random() * this.config.jitterMs;
        if (K !== void 0) return Math.max(this.config.baseDelayMs, Math.min(K, this.config.maxDelayMs)) + _;
        return Math.min(this.config.baseDelayMs * 2 ** (q - 1), this.config.maxDelayMs) + _
    }
    releaseBackpressure() {
        let q = this.backpressureResolvers;
        this.backpressureResolvers = [];
        for (let K of q) K()
    }
    sleep(q) {
        return new Promise((K) => {
            this.sleepResolve = K, setTimeout((_, z) => {
                _.sleepResolve = null, z()
            }, q, this, K)
        })
    }
}
// @from(Ln 512786, Col 4)
iu6
// @from(Ln 512787, Col 4)
kX7 = L(() => {
    e8();
    iu6 = class iu6 extends Error {
        retryAfterMs;
        constructor(q, K) {
            super(q);
            this.retryAfterMs = K
        }
    }
})
// @from(Ln 512797, Col 0)
class NX7 {
    inflight = null;
    pending = null;
    closed = !1;
    config;
    constructor(q) {
        this.config = q
    }
    enqueue(q) {
        if (this.closed) return;
        this.pending = this.pending ? jq5(this.pending, q) : q, this.drain()
    }
    close() {
        this.closed = !0, this.pending = null
    }
    async drain() {
        if (this.inflight || this.closed) return;
        if (!this.pending) return;
        let q = this.pending;
        this.pending = null, this.inflight = this.sendWithRetry(q).then(() => {
            if (this.inflight = null, this.pending && !this.closed) this.drain()
        })
    }
    async sendWithRetry(q) {
        let K = q,
            _ = 0;
        while (!this.closed) {
            if (await this.config.send(K)) return;
            if (_++, await l7(this.retryDelay(_)), this.pending && !this.closed) K = jq5(K, this.pending), this.pending = null
        }
    }
    retryDelay(q) {
        let K = Math.min(this.config.baseDelayMs * 2 ** (q - 1), this.config.maxDelayMs),
            _ = Math.random() * this.config.jitterMs;
        return K + _
    }
}
// @from(Ln 512835, Col 0)
function jq5(q, K) {
    let _ = {
        ...q
    };
    for (let [z, Y] of Object.entries(K))
        if ((z === "external_metadata" || z === "internal_metadata") && _[z] && typeof _[z] === "object" && typeof Y === "object" && Y !== null) _[z] = {
            ..._[z],
            ...Y
        };
        else _[z] = Y;
    return _
}
// @from(Ln 512847, Col 4)
Hq5 = () => {}
// @from(Ln 512852, Col 0)
function Xq5() {
    return !0
}
// @from(Ln 512856, Col 0)
function qqA() {
    return {
        byMessage: new Map,
        scopeToMessage: new Map
    }
}
// @from(Ln 512863, Col 0)
function ca8(q) {
    return `${q.session_id}:${q.parent_tool_use_id??""}`
}
// @from(Ln 512867, Col 0)
function KqA(q, K) {
    let _ = [],
        z = new Map;
    for (let Y of q) switch (Y.event.type) {
        case "message_start": {
            let A = Y.event.message.id,
                O = K.scopeToMessage.get(ca8(Y));
            if (O) K.byMessage.delete(O);
            K.scopeToMessage.set(ca8(Y), A), K.byMessage.set(A, []), _.push(Y);
            break
        }
        case "content_block_delta": {
            if (Y.event.delta.type !== "text_delta") {
                _.push(Y);
                break
            }
            let A = K.scopeToMessage.get(ca8(Y)),
                O = A ? K.byMessage.get(A) : void 0;
            if (!O) {
                _.push(Y);
                break
            }
            let w = O[Y.event.index] ??= [];
            w.push(Y.event.delta.text);
            let $ = z.get(w);
            if ($) {
                $.event.delta.text = w.join("");
                break
            }
            let j = {
                type: "stream_event",
                uuid: Y.uuid,
                session_id: Y.session_id,
                parent_tool_use_id: Y.parent_tool_use_id,
                event: {
                    type: "content_block_delta",
                    index: Y.event.index,
                    delta: {
                        type: "text_delta",
                        text: w.join("")
                    }
                }
            };
            z.set(w, j), _.push(j);
            break
        }
        default:
            _.push(Y)
    }
    return _
}
// @from(Ln 512919, Col 0)
function _qA(q, K) {
    q.byMessage.delete(K.message.id);
    let _ = ca8(K);
    if (q.scopeToMessage.get(_) === K.message.id) q.scopeToMessage.delete(_)
}
// @from(Ln 512924, Col 0)
class mz8 {
    workerEpoch = 0;
    heartbeatIntervalMs;
    heartbeatJitterFraction;
    heartbeatTimer = null;
    heartbeatInFlight = !1;
    closed = !1;
    consecutiveAuthFailures = 0;
    currentState = null;
    sessionBaseUrl;
    sessionId;
    http = QP1({
        keepAlive: !0
    });
    streamEventBuffer = [];
    streamEventTimer = null;
    streamTextAccumulator = qqA();
    workerState;
    eventUploader;
    internalEventUploader;
    deliveryUploader;
    onEpochMismatch;
    getAuthHeaders;
    constructor(q, K, _) {
        if (this.onEpochMismatch = _?.onEpochMismatch ?? (() => {
                process.exit(1)
            }), this.heartbeatIntervalMs = _?.heartbeatIntervalMs ?? s7A, this.heartbeatJitterFraction = _?.heartbeatJitterFraction ?? 0, this.getAuthHeaders = _?.getAuthHeaders ?? gF8, K.protocol !== "http:" && K.protocol !== "https:") throw Error(`CCRClient: Expected http(s) URL, got ${K.protocol}`);
        let z = K.pathname.replace(/\/$/, "");
        this.sessionBaseUrl = `${K.protocol}//${K.host}${z}`, this.sessionId = z.split("/").pop() || "", this.workerState = new NX7({
            send: (Y) => this.request("put", "/worker", {
                worker_epoch: this.workerEpoch,
                ...Y
            }, "PUT worker").then((A) => A.ok),
            baseDelayMs: 500,
            maxDelayMs: 30000,
            jitterMs: 500
        }), this.eventUploader = new CW6({
            maxBatchSize: 100,
            maxBatchBytes: 10485760,
            maxQueueSize: 1e5,
            send: async (Y) => {
                let A = await this.request("post", "/worker/events", {
                    worker_epoch: this.workerEpoch,
                    events: Y
                }, "client events");
                if (!A.ok) throw new iu6("client event POST failed", A.retryAfterMs)
            },
            baseDelayMs: 500,
            maxDelayMs: 30000,
            jitterMs: 500
        }), this.internalEventUploader = new CW6({
            maxBatchSize: 100,
            maxBatchBytes: 10485760,
            maxQueueSize: 200,
            send: async (Y) => {
                let A = await this.request("post", "/worker/internal-events", {
                    worker_epoch: this.workerEpoch,
                    events: Y
                }, "internal events");
                if (!A.ok) throw new iu6("internal event POST failed", A.retryAfterMs)
            },
            baseDelayMs: 500,
            maxDelayMs: 30000,
            jitterMs: 500
        }), this.deliveryUploader = new CW6({
            maxBatchSize: 64,
            maxQueueSize: 64,
            send: async (Y) => {
                let A = await this.request("post", "/worker/events/delivery", {
                    worker_epoch: this.workerEpoch,
                    updates: Y.map((O) => ({
                        event_id: O.eventId,
                        status: O.status
                    }))
                }, "delivery batch");
                if (!A.ok) throw new iu6("delivery POST failed", A.retryAfterMs)
            },
            baseDelayMs: 500,
            maxDelayMs: 30000,
            jitterMs: 500
        }), q.setOnEvent((Y) => {
            this.reportDelivery(Y.event_id, "received")
        })
    }
    async initialize(q) {
        let K = Date.now();
        if (Object.keys(this.getAuthHeaders()).length === 0) throw new ru6("no_auth_headers");
        if (q === void 0) {
            let O = process.env.CLAUDE_CODE_WORKER_EPOCH;
            q = O ? parseInt(O, 10) : NaN
        }
        if (isNaN(q)) throw new ru6("missing_epoch");
        this.workerEpoch = q;
        let _ = this.getWorkerState();
        if (!(await this.request("put", "/worker", {
                worker_status: "idle",
                worker_epoch: this.workerEpoch,
                external_metadata: {
                    pending_action: null,
                    task_summary: null
                }
            }, "PUT worker (init)")).ok) throw new ru6("worker_register_failed");
        this.currentState = "idle", this.startHeartbeat(), cd8(() => {
            this.writeEvent({
                type: "keep_alive"
            })
        }), E(`CCRClient: initialized, epoch=${this.workerEpoch}`), j1("info", "cli_worker_lifecycle_initialized", {
            epoch: this.workerEpoch,
            duration_ms: Date.now() - K
        });
        let {
            metadata: Y,
            durationMs: A
        } = await _;
        if (!this.closed) j1("info", "cli_worker_state_restored", {
            duration_ms: A,
            had_state: Y !== null
        });
        return Y
    }
    async getWorkerState() {
        let q = Date.now(),
            K = this.getAuthHeaders();
        if (Object.keys(K).length === 0) return {
            metadata: null,
            durationMs: 0
        };
        return {
            metadata: (await this.getWithRetry(`${this.sessionBaseUrl}/worker`, K, "worker_state"))?.worker?.external_metadata ?? null,
            durationMs: Date.now() - q
        }
    }
    async request(q, K, _, z, {
        timeout: Y = 1e4
    } = {}) {
        let A = this.getAuthHeaders();
        if (Object.keys(A).length === 0) return {
            ok: !1
        };
        try {
            let O = await this.http[q](`${this.sessionBaseUrl}${K}`, _, {
                headers: {
                    ...A,
                    "Content-Type": "application/json",
                    "anthropic-version": "2023-06-01",
                    "User-Agent": yA()
                },
                validateStatus: Xq5,
                timeout: Y
            });
            if (O.status >= 200 && O.status < 300) return this.consecutiveAuthFailures = 0, {
                ok: !0
            };
            if (O.status === 409) this.handleEpochMismatch();
            if (O.status === 401 || O.status === 403) {
                let w = qW(),
                    $ = w ? SJ7(w) : null;
                if ($ !== null && $ * 1000 < Date.now()) E(`CCRClient: session_token expired (exp=${new Date($*1000).toISOString()}) — no refresh was delivered, exiting`, {
                    level: "error"
                }), j1("error", "cli_worker_token_expired_no_refresh"), this.onEpochMismatch();
                if (this.consecutiveAuthFailures++, this.consecutiveAuthFailures >= e7A) E(`CCRClient: ${this.consecutiveAuthFailures} consecutive auth failures with a valid-looking token — server-side auth unrecoverable, exiting`, {
                    level: "error"
                }), j1("error", "cli_worker_auth_failures_exhausted"), this.onEpochMismatch()
            }
            if (E(`CCRClient: ${z} returned ${O.status}`, {
                    level: "warn"
                }), j1("warn", "cli_worker_request_failed", {
                    method: q,
                    path: K,
                    status: O.status
                }), O.status === 429) {
                let w = O.headers?.["retry-after"],
                    $ = typeof w === "string" ? parseInt(w, 10) : NaN;
                if (!isNaN($) && $ >= 0) return {
                    ok: !1,
                    retryAfterMs: $ * 1000
                }
            }
            return {
                ok: !1
            }
        } catch (O) {
            return E(`CCRClient: ${z} failed: ${b6(O)}`, {
                level: "warn"
            }), j1("warn", "cli_worker_request_error", {
                method: q,
                path: K,
                error_code: Q1(O)
            }), {
                ok: !1
            }
        }
    }
    reportState(q, K) {
        if (q === this.currentState && !K) return;
        this.currentState = q, this.workerState.enqueue({
            worker_status: q,
            requires_action_details: K ? {
                tool_name: K.tool_name,
                action_description: K.action_description,
                raw_command: K.raw_command,
                request_id: K.request_id,
                tool_use_id: K.tool_use_id
            } : null
        })
    }
    reportMetadata(q) {
        this.workerState.enqueue({
            external_metadata: q
        })
    }
    handleEpochMismatch() {
        E("CCRClient: Epoch mismatch (409), shutting down", {
            level: "error"
        }), j1("error", "cli_worker_epoch_mismatch"), this.onEpochMismatch()
    }
    startHeartbeat() {
        this.stopHeartbeat();
        let q = () => {
                let _ = this.heartbeatIntervalMs * this.heartbeatJitterFraction * (2 * Math.random() - 1);
                this.heartbeatTimer = setTimeout(K, this.heartbeatIntervalMs + _)
            },
            K = () => {
                if (this.sendHeartbeat(), this.heartbeatTimer === null) return;
                q()
            };
        q()
    }
    stopHeartbeat() {
        if (this.heartbeatTimer) clearTimeout(this.heartbeatTimer), this.heartbeatTimer = null
    }
    async sendHeartbeat() {
        if (this.heartbeatInFlight) return;
        this.heartbeatInFlight = !0;
        try {
            if ((await this.request("post", "/worker/heartbeat", {
                    session_id: this.sessionId,
                    worker_epoch: this.workerEpoch
                }, "Heartbeat", {
                    timeout: 5000
                })).ok) E("CCRClient: Heartbeat sent")
        } finally {
            this.heartbeatInFlight = !1
        }
    }
    async writeEvent(q) {
        if (q.type === "stream_event") {
            if (this.streamEventBuffer.push(q), !this.streamEventTimer) this.streamEventTimer = setTimeout(() => void this.flushStreamEventBuffer(), t7A);
            return
        }
        if (await this.flushStreamEventBuffer(), q.type === "assistant") _qA(this.streamTextAccumulator, q);
        await this.eventUploader.enqueue(this.toClientEvent(q))
    }
    toClientEvent(q) {
        let K = q;
        return {
            payload: {
                ...K,
                uuid: typeof K.uuid === "string" ? K.uuid : Jq5()
            }
        }
    }
    async flushStreamEventBuffer() {
        if (this.streamEventTimer) clearTimeout(this.streamEventTimer), this.streamEventTimer = null;
        if (this.streamEventBuffer.length === 0) return;
        let q = this.streamEventBuffer;
        this.streamEventBuffer = [];
        let K = KqA(q, this.streamTextAccumulator);
        await this.eventUploader.enqueue(K.map((_) => ({
            payload: _,
            ephemeral: !0
        })))
    }
    async writeInternalEvent(q, K, {
        isCompaction: _ = !1,
        agentId: z
    } = {}) {
        let Y = {
            payload: {
                type: q,
                ...K,
                uuid: typeof K.uuid === "string" ? K.uuid : Jq5()
            },
            ..._ && {
                is_compaction: !0
            },
            ...z && {
                agent_id: z
            }
        };
        await this.internalEventUploader.enqueue(Y)
    }
    flushInternalEvents() {
        return this.internalEventUploader.flush()
    }
    flushDeliveryAcks() {
        return this.deliveryUploader.flush()
    }
    async flush() {
        return await this.flushStreamEventBuffer(), this.eventUploader.flush()
    }
    async readInternalEvents() {
        return this.paginatedGet("/worker/internal-events", {}, "internal_events")
    }
    async readSubagentInternalEvents() {
        return this.paginatedGet("/worker/internal-events", {
            subagents: "true"
        }, "subagent_events")
    }
    async paginatedGet(q, K, _) {
        let z = this.getAuthHeaders();
        if (Object.keys(z).length === 0) return null;
        let Y = [],
            A;
        do {
            let O = new URL(`${this.sessionBaseUrl}${q}`);
            for (let [$, j] of Object.entries(K)) O.searchParams.set($, j);
            if (A) O.searchParams.set("cursor", A);
            let w = await this.getWithRetry(O.toString(), z, _);
            if (!w) return null;
            Y.push(...w.data ?? []), A = w.next_cursor
        } while (A);
        return E(`CCRClient: Read ${Y.length} internal events from ${q}${K.subagents?" (subagents)":""}`), Y
    }
    async getWithRetry(q, K, _) {
        for (let z = 1; z <= 10; z++) {
            let Y;
            try {
                Y = await this.http.get(q, {
                    headers: {
                        ...K,
                        "anthropic-version": "2023-06-01",
                        "User-Agent": yA()
                    },
                    validateStatus: Xq5,
                    timeout: 30000
                })
            } catch (A) {
                if (E(`CCRClient: GET ${q} failed (attempt ${z}/10): ${b6(A)}`, {
                        level: "warn"
                    }), z < 10) {
                    let O = Math.min(500 * 2 ** (z - 1), 30000) + Math.random() * 500;
                    await l7(O)
                }
                continue
            }
            if (Y.status >= 200 && Y.status < 300) return Y.data;
            if (Y.status === 409) this.handleEpochMismatch();
            if (E(`CCRClient: GET ${q} returned ${Y.status} (attempt ${z}/10)`, {
                    level: "warn"
                }), z < 10) {
                let A = Math.min(500 * 2 ** (z - 1), 30000) + Math.random() * 500;
                await l7(A)
            }
        }
        return E("CCRClient: GET retries exhausted", {
            level: "error"
        }), j1("error", "cli_worker_get_retries_exhausted", {
            context: _
        }), null
    }
    reportDelivery(q, K) {
        this.deliveryUploader.enqueue({
            eventId: q,
            status: K
        })
    }
    getWorkerEpoch() {
        return this.workerEpoch
    }
    get internalEventsPending() {
        return this.internalEventUploader.pendingCount
    }
    close() {
        if (this.closed = !0, this.stopHeartbeat(), O38(), this.streamEventTimer) clearTimeout(this.streamEventTimer), this.streamEventTimer = null;
        this.streamEventBuffer = [], this.streamTextAccumulator.byMessage.clear(), this.streamTextAccumulator.scopeToMessage.clear(), this.workerState.close(), this.eventUploader.close(), this.internalEventUploader.close(), this.deliveryUploader.close()
    }
}
// @from(Ln 513302, Col 4)
s7A = 20000
// @from(Ln 513303, Col 4)
t7A = 100
// @from(Ln 513304, Col 4)
ru6
// @from(Ln 513304, Col 9)
e7A = 10
// @from(Ln 513305, Col 4)
EX7 = L(() => {
    ya8();
    K8();
    VA();
    m8();
    _M();
    DI6();
    ox();
    kX7();
    Hq5();
    ru6 = class ru6 extends Error {
        reason;
        constructor(q) {
            super(`CCRClient init failed: ${q}`);
            this.reason = q
        }
    }
})
// @from(Ln 513324, Col 0)
function JqA() {
    return !0
}
// @from(Ln 513328, Col 0)
function XqA(q) {
    let K = [],
        _ = 0,
        z;
    while ((z = q.indexOf(`

`, _)) !== -1) {
        let Y = q.slice(_, z);
        if (_ = z + 2, !Y.trim()) continue;
        let A = {},
            O = !1;
        for (let w of Y.split(`
`)) {
            if (w.startsWith(":")) {
                O = !0;
                continue
            }
            let $ = w.indexOf(":");
            if ($ === -1) continue;
            let j = w.slice(0, $),
                H = w[$ + 1] === " " ? w.slice($ + 2) : w.slice($ + 1);
            switch (j) {
                case "event":
                    A.event = H;
                    break;
                case "id":
                    A.id = H;
                    break;
                case "data":
                    A.data = A.data ? A.data + `
` + H : H;
                    break
            }
        }
        if (A.data || O) K.push(A)
    }
    return {
        frames: K,
        remaining: q.slice(_)
    }
}
// @from(Ln 513370, Col 0)
function MqA(q) {
    let K = q.pathname;
    if (K.endsWith("/stream")) K = K.slice(0, -7);
    return `${q.protocol}//${q.host}${K}`
}
// @from(Ln 513375, Col 4)
zqA = 1000
// @from(Ln 513376, Col 4)
YqA = 30000
// @from(Ln 513377, Col 4)
AqA = 600000
// @from(Ln 513378, Col 4)
OqA = 45000
// @from(Ln 513379, Col 4)
wqA
// @from(Ln 513379, Col 9)
Bz8 = 10
// @from(Ln 513380, Col 4)
$qA = 500
// @from(Ln 513381, Col 4)
jqA = 8000
// @from(Ln 513382, Col 4)
HqA
// @from(Ln 513382, Col 9)
bW6
// @from(Ln 513383, Col 4)
la8 = L(() => {
    CK();
    K8();
    VA();
    m8();
    ox();
    e8();
    wqA = new Set([401, 403, 404]), HqA = {
        stream: !0
    };
    bW6 = class bW6 {
        url;
        state = "idle";
        onData;
        onCloseCallback;
        onEventCallback;
        headers;
        sessionId;
        refreshHeaders;
        getAuthHeaders;
        abortController = null;
        lastSequenceNum = 0;
        seenSequenceNums = new Set;
        reconnectAttempts = 0;
        reconnectStartTime = null;
        reconnectTimer = null;
        livenessTimer = null;
        postUrl;
        constructor(q, K = {}, _, z, Y, A) {
            this.url = q;
            if (this.headers = K, this.sessionId = _, this.refreshHeaders = z, this.getAuthHeaders = A ?? gF8, this.postUrl = MqA(q), Y !== void 0 && Y > 0) this.lastSequenceNum = Y;
            E(`SSETransport: SSE URL = ${q.href}`), E(`SSETransport: POST URL = ${this.postUrl}`), j1("info", "cli_sse_transport_initialized")
        }
        getLastSequenceNum() {
            return this.lastSequenceNum
        }
        async connect() {
            if (this.state !== "idle" && this.state !== "reconnecting") {
                E(`SSETransport: Cannot connect, current state is ${this.state}`, {
                    level: "error"
                }), j1("error", "cli_sse_connect_failed");
                return
            }
            this.state = "reconnecting";
            let q = Date.now(),
                K = new URL(this.url.href);
            if (this.lastSequenceNum > 0) K.searchParams.set("from_sequence_num", String(this.lastSequenceNum));
            let _ = this.getAuthHeaders(),
                z = {
                    ...this.headers,
                    ..._,
                    Accept: "text/event-stream",
                    "anthropic-version": "2023-06-01",
                    "User-Agent": yA()
                };
            if (_.Cookie) delete z.Authorization;
            if (this.lastSequenceNum > 0) z["Last-Event-ID"] = String(this.lastSequenceNum);
            E(`SSETransport: Opening ${K.href}`), j1("info", "cli_sse_connect_opening"), this.abortController = new AbortController;
            try {
                let Y = await fetch(K.href, {
                    headers: z,
                    signal: this.abortController.signal
                });
                if (!Y.ok) {
                    let O = wqA.has(Y.status);
                    if (E(`SSETransport: HTTP ${Y.status}${O?" (permanent)":""}`, {
                            level: "error"
                        }), j1("error", "cli_sse_connect_http_error", {
                            status: Y.status
                        }), O) {
                        this.state = "closed", this.onCloseCallback?.(Y.status);
                        return
                    }
                    this.handleConnectionError();
                    return
                }
                if (!Y.body) {
                    E("SSETransport: No response body"), this.handleConnectionError();
                    return
                }
                let A = Date.now() - q;
                E("SSETransport: Connected"), j1("info", "cli_sse_connect_connected", {
                    duration_ms: A
                }), this.state = "connected", this.reconnectAttempts = 0, this.reconnectStartTime = null, this.resetLivenessTimer(), await this.readStream(Y.body)
            } catch (Y) {
                if (this.abortController?.signal.aborted) return;
                E(`SSETransport: Connection error: ${b6(Y)}`, {
                    level: "error"
                }), j1("error", "cli_sse_connect_error"), this.handleConnectionError()
            }
        }
        async readStream(q) {
            let K = q.getReader(),
                _ = new TextDecoder,
                z = [],
                Y = !1;
            try {
                while (!0) {
                    let {
                        done: A,
                        value: O
                    } = await K.read();
                    if (A) break;
                    let w = _.decode(O, HqA);
                    if (!w) continue;
                    let $ = Y && w[0] === `
` || w.includes(`

`);
                    if (z.push(w), !$) {
                        Y = w.endsWith(`
`);
                        continue
                    }
                    let {
                        frames: j,
                        remaining: H
                    } = XqA(z.join(""));
                    z = H ? [H] : [], Y = H.endsWith(`
`);
                    for (let J of j) {
                        if (this.resetLivenessTimer(), J.id) {
                            let X = parseInt(J.id, 10);
                            if (!isNaN(X)) {
                                if (this.seenSequenceNums.has(X)) E(`SSETransport: DUPLICATE frame seq=${X} (lastSequenceNum=${this.lastSequenceNum}, seenCount=${this.seenSequenceNums.size})`, {
                                    level: "warn"
                                }), j1("warn", "cli_sse_duplicate_sequence");
                                else if (this.seenSequenceNums.add(X), this.seenSequenceNums.size > 1000) {
                                    let M = this.lastSequenceNum - 200;
                                    for (let P of this.seenSequenceNums)
                                        if (P < M) this.seenSequenceNums.delete(P)
                                }
                                if (X > this.lastSequenceNum) this.lastSequenceNum = X
                            }
                        }
                        if (J.event && J.data) this.handleSSEFrame(J.event, J.data);
                        else if (J.data) E("SSETransport: Frame has data: but no event: field — dropped", {
                            level: "warn"
                        }), j1("warn", "cli_sse_frame_missing_event_field")
                    }
                }
            } catch (A) {
                if (this.abortController?.signal.aborted) return;
                E(`SSETransport: Stream read error: ${b6(A)}`, {
                    level: "error"
                }), j1("error", "cli_sse_stream_read_error")
            } finally {
                K.releaseLock()
            }
            if (this.state !== "closing" && this.state !== "closed") E("SSETransport: Stream ended, reconnecting"), this.handleConnectionError()
        }
        handleSSEFrame(q, K) {
            if (q !== "client_event") {
                E(`SSETransport: Unexpected SSE event type '${q}' on worker stream`, {
                    level: "warn"
                }), j1("warn", "cli_sse_unexpected_event_type", {
                    event_type: q
                });
                return
            }
            let _;
            try {
                _ = n8(K)
            } catch (Y) {
                E(`SSETransport: Failed to parse client_event data: ${b6(Y)}`, {
                    level: "error"
                });
                return
            }
            let z = _.payload;
            if (z && typeof z === "object" && "type" in z) {
                let Y = this.sessionId ? ` session=${this.sessionId}` : "";
                E(`SSETransport: Event seq=${_.sequence_num} event_id=${_.event_id} event_type=${_.event_type} payload_type=${String(z.type)}${Y}`), j1("info", "cli_sse_message_received"), this.onData?.(I6(z) + `
`)
            } else E(`SSETransport: Ignoring client_event with no type in payload: event_id=${_.event_id}`);
            this.onEventCallback?.(_)
        }
        handleConnectionError() {
            if (this.clearLivenessTimer(), this.state === "closing" || this.state === "closed") return;
            this.abortController?.abort(), this.abortController = null;
            let q = Date.now();
            if (!this.reconnectStartTime) this.reconnectStartTime = q;
            let K = q - this.reconnectStartTime;
            if (K < AqA) {
                if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
                if (this.refreshHeaders) {
                    let Y = this.refreshHeaders();
                    Object.assign(this.headers, Y), E("SSETransport: Refreshed headers for reconnect")
                }
                this.state = "reconnecting", this.reconnectAttempts++;
                let _ = Math.min(zqA * Math.pow(2, this.reconnectAttempts - 1), YqA),
                    z = Math.max(0, _ + _ * 0.25 * (2 * Math.random() - 1));
                E(`SSETransport: Reconnecting in ${Math.round(z)}ms (attempt ${this.reconnectAttempts}, ${Math.round(K/1000)}s elapsed)`), j1("error", "cli_sse_reconnect_attempt", {
                    reconnectAttempts: this.reconnectAttempts
                }), this.reconnectTimer = setTimeout(() => {
                    this.reconnectTimer = null, this.connect()
                }, z)
            } else E(`SSETransport: Reconnection time budget exhausted after ${Math.round(K/1000)}s`, {
                level: "error"
            }), j1("error", "cli_sse_reconnect_exhausted", {
                reconnectAttempts: this.reconnectAttempts,
                elapsedMs: K
            }), this.state = "closed", this.onCloseCallback?.()
        }
        onLivenessTimeout = () => {
            this.livenessTimer = null, E("SSETransport: Liveness timeout, reconnecting", {
                level: "error"
            }), j1("error", "cli_sse_liveness_timeout"), this.abortController?.abort(), this.handleConnectionError()
        };
        resetLivenessTimer() {
            this.clearLivenessTimer(), this.livenessTimer = setTimeout(this.onLivenessTimeout, OqA)
        }
        clearLivenessTimer() {
            if (this.livenessTimer) clearTimeout(this.livenessTimer), this.livenessTimer = null
        }
        async write(q) {
            let K = this.getAuthHeaders();
            if (Object.keys(K).length === 0) {
                E("SSETransport: No session token available for POST"), j1("warn", "cli_sse_post_no_token");
                return
            }
            let _ = {
                ...K,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01",
                "User-Agent": yA()
            };
            E(`SSETransport: POST body keys=${Object.keys(q).join(",")}`);
            for (let z = 1; z <= Bz8; z++) {
                try {
                    let A = await Z1.post(this.postUrl, q, {
                        headers: _,
                        validateStatus: JqA
                    });
                    if (A.status === 200 || A.status === 201) {
                        E(`SSETransport: POST success type=${q.type}`);
                        return
                    }
                    if (E(`SSETransport: POST ${A.status} body=${I6(A.data).slice(0,200)}`), A.status >= 400 && A.status < 500 && A.status !== 429) {
                        E(`SSETransport: POST returned ${A.status} (client error), not retrying`), j1("warn", "cli_sse_post_client_error", {
                            status: A.status
                        });
                        return
                    }
                    E(`SSETransport: POST returned ${A.status}, attempt ${z}/${Bz8}`), j1("warn", "cli_sse_post_retryable_error", {
                        status: A.status,
                        attempt: z
                    })
                } catch (A) {
                    E(`SSETransport: POST error: ${b6(A)}, attempt ${z}/${Bz8}`), j1("warn", "cli_sse_post_network_error", {
                        attempt: z
                    })
                }
                if (z === Bz8) {
                    E(`SSETransport: POST failed after ${Bz8} attempts, continuing`), j1("warn", "cli_sse_post_retries_exhausted");
                    return
                }
                let Y = Math.min($qA * Math.pow(2, z - 1), jqA);
                await l7(Y)
            }
        }
        isConnectedStatus() {
            return this.state === "connected"
        }
        isClosedStatus() {
            return this.state === "closed"
        }
        setOnData(q) {
            this.onData = q
        }
        setOnClose(q) {
            this.onCloseCallback = q
        }
        setOnEvent(q) {
            this.onEventCallback = q
        }
        close() {
            if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
            this.clearLivenessTimer(), this.state = "closing", this.abortController?.abort(), this.abortController = null
        } [Symbol.dispose]() {
            this.close()
        }
    }
})
// @from(Ln 513667, Col 0)
async function yX7(q) {
    let {
        sessionUrl: K,
        ingressToken: _,
        sessionId: z,
        initialSequenceNum: Y,
        getAuthToken: A
    } = q, O;
    if (A) O = () => {
        let W = A();
        if (!W) return {};
        return {
            Authorization: `Bearer ${W}`
        }
    };
    else lOK(_);
    let w = q.epoch ?? await ha8(K, _);
    E(`[bridge:repl] CCR v2: worker sessionId=${z} epoch=${w}${q.epoch!==void 0?" (from /bridge)":" (via registerWorker)"}`);
    let $ = new URL(K);
    $.pathname = $.pathname.replace(/\/$/, "") + "/worker/events/stream";
    let j = new bW6($, {}, z, void 0, Y, O),
        H, J = new mz8(j, new URL(K), {
            getAuthHeaders: O,
            heartbeatIntervalMs: q.heartbeatIntervalMs,
            heartbeatJitterFraction: q.heartbeatJitterFraction,
            onEpochMismatch: () => {
                E("[bridge:repl] CCR v2: epoch superseded (409) — closing for poll-loop recovery");
                try {
                    J.close(), j.close(), H?.(4090)
                } catch (W) {
                    E(`[bridge:repl] CCR v2: error during epoch-mismatch cleanup: ${b6(W)}`, {
                        level: "error"
                    })
                }
                throw Error("epoch superseded")
            }
        });
    j.setOnEvent((W) => {
        J.reportDelivery(W.event_id, "received"), J.reportDelivery(W.event_id, "processed")
    });
    let X, M = !1,
        P = !1;
    return {
        write(W) {
            return J.writeEvent(W)
        },
        async writeBatch(W) {
            for (let D of W) {
                if (P) break;
                await J.writeEvent(D)
            }
        },
        close() {
            P = !0, J.close(), j.close()
        },
        isConnectedStatus() {
            return M
        },
        getStateLabel() {
            if (j.isClosedStatus()) return "closed";
            if (j.isConnectedStatus()) return M ? "connected" : "init";
            return "connecting"
        },
        setOnData(W) {
            j.setOnData(W)
        },
        setOnClose(W) {
            H = W, j.setOnClose((D) => {
                J.close(), W(D ?? 4092)
            })
        },
        setOnConnect(W) {
            X = W
        },
        getLastSequenceNum() {
            return j.getLastSequenceNum()
        },
        droppedBatchCount: 0,
        reportState(W, D) {
            J.reportState(W, D)
        },
        reportMetadata(W) {
            J.reportMetadata(W)
        },
        reportDelivery(W, D) {
            J.reportDelivery(W, D)
        },
        flush() {
            return J.flush()
        },
        getInternalEventWriter() {
            return (W, D, Z) => J.writeInternalEvent(W, D, Z)
        },
        getInternalEventReaders() {
            return {
                readMain: () => J.readInternalEvents(),
                readSubagents: () => J.readSubagentInternalEvents()
            }
        },
        connect() {
            if (!q.outboundOnly) j.connect();
            J.initialize(w).then(() => {
                M = !0, E(`[bridge:repl] v2 transport ready for writes (epoch=${w}, sse=${j.isConnectedStatus()?"open":"opening"})`), X?.()
            }, (W) => {
                E(`[bridge:repl] CCR v2 initialize failed: ${b6(W)}`, {
                    level: "error"
                }), J.close(), j.close(), H?.(4091)
            })
        }
    }
}
// @from(Ln 513778, Col 4)
Mq5 = L(() => {
    EX7();
    la8();
    K8();
    m8();
    ox();
    Ra8()
})
// @from(Ln 513786, Col 0)
class LX7 {
    _active = !1;
    _pending = [];
    get active() {
        return this._active
    }
    get pendingCount() {
        return this._pending.length
    }
    start() {
        this._active = !0
    }
    end() {
        return this._active = !1, this._pending.splice(0)
    }
    enqueue(...q) {
        if (!this._active) return !1;
        return this._pending.push(...q), !0
    }
    drop() {
        this._active = !1;
        let q = this._pending.length;
        return this._pending.length = 0, q
    }
    deactivate() {
        this._active = !1
    }
}
// @from(Ln 513815, Col 0)
function na8(q) {
    if (q === null || typeof q !== "object") return q;
    let K = q;
    if ("requestId" in K && !("request_id" in K)) K.request_id = K.requestId, delete K.requestId;
    if ("response" in K && K.response !== null && typeof K.response === "object") {
        let _ = K.response;
        if ("requestId" in _ && !("request_id" in _)) _.request_id = _.requestId, delete _.requestId
    }
    return q
}
// @from(Ln 513829, Col 0)
function WqA(q) {
    return q !== null && typeof q === "object" && "type" in q && typeof q.type === "string"
}
// @from(Ln 513833, Col 0)
function DqA(q) {
    return q !== null && typeof q === "object" && "type" in q && q.type === "control_response" && "response" in q
}
// @from(Ln 513837, Col 0)
function ZqA(q) {
    return q !== null && typeof q === "object" && "type" in q && q.type === "control_request" && "request_id" in q && "request" in q
}
// @from(Ln 513841, Col 0)
function hX7(q) {
    if ((q.type === "user" || q.type === "assistant") && q.isVirtual) return !1;
    return q.type === "user" || q.type === "assistant" || q.type === "system" && q.subtype === "local_command"
}
// @from(Ln 513846, Col 0)
function Pq5(q) {
    if (q.type !== "user" || q.isMeta || q.toolUseResult || q.isCompactSummary) return;
    if (q.origin && q.origin.kind !== "human") return;
    let K = q.message.content,
        _;
    if (typeof K === "string") _ = K;
    else
        for (let Y of K)
            if (Y.type === "text") {
                _ = Y.text;
                break
            } if (!_) return;
    return Nf6(_) || void 0
}
// @from(Ln 513861, Col 0)
function Wq5(q, K, _, z, Y, A) {
    try {
        let O = na8(n8(q));
        if (DqA(O)) {
            E("[bridge:repl] Ingress message type=control_response"), Y?.(O);
            return
        }
        if (ZqA(O)) {
            E(`[bridge:repl] Inbound control_request subtype=${O.request.subtype}`), A?.(O);
            return
        }
        if (!WqA(O)) return;
        let w = "uuid" in O && typeof O.uuid === "string" ? O.uuid : void 0;
        if (w && K.has(w)) {
            E(`[bridge:repl] Ignoring echo: type=${O.type} uuid=${w}`);
            return
        }
        if (w && _.has(w)) {
            E(`[bridge:repl] Ignoring re-delivered inbound: type=${O.type} uuid=${w}`);
            return
        }
        if (E(`[bridge:repl] Ingress message type=${O.type}${w?` uuid=${w}`:""}`), O.type === "user") {
            if (w) _.add(w);
            d("tengu_bridge_message_received", {
                is_repl: !0
            }), z?.(O)
        } else E(`[bridge:repl] Ignoring non-user inbound message: type=${O.type}`)
    } catch (O) {
        E(`[bridge:repl] Failed to parse ingress message: ${b6(O)}`)
    }
}
// @from(Ln 513893, Col 0)
function Dq5(q, K) {
    let {
        transport: _,
        sessionId: z,
        outboundOnly: Y,
        onInterrupt: A,
        onSetModel: O,
        onSetMaxThinkingTokens: w,
        onSetPermissionMode: $,
        onRenameSession: j
    } = K;
    if (!_) {
        E("[bridge:repl] Cannot respond to control_request: transport not configured");
        return
    }
    let H;
    if (Y && q.request.subtype !== "initialize") {
        H = {
            type: "control_response",
            response: {
                subtype: "error",
                request_id: q.request_id,
                error: fqA
            }
        };
        let X = {
            ...H,
            session_id: z
        };
        _.write(X), E(`[bridge:repl] Rejected ${q.request.subtype} (outbound-only) request_id=${q.request_id}`);
        return
    }
    switch (q.request.subtype) {
        case "initialize":
            H = {
                type: "control_response",
                response: {
                    subtype: "success",
                    request_id: q.request_id,
                    response: {
                        commands: [],
                        output_style: "normal",
                        available_output_styles: ["normal"],
                        models: [],
                        account: {},
                        pid: process.pid
                    }
                }
            };
            break;
        case "set_model":
            O?.(q.request.model), H = {
                type: "control_response",
                response: {
                    subtype: "success",
                    request_id: q.request_id
                }
            };
            break;
        case "set_max_thinking_tokens":
            w?.(q.request.max_thinking_tokens), H = {
                type: "control_response",
                response: {
                    subtype: "success",
                    request_id: q.request_id
                }
            };
            break;
        case "set_permission_mode": {
            let X = $?.(q.request.mode) ?? {
                ok: !1,
                error: "set_permission_mode is not supported in this context (onSetPermissionMode callback not registered)"
            };
            if (X.ok) H = {
                type: "control_response",
                response: {
                    subtype: "success",
                    request_id: q.request_id
                }
            };
            else H = {
                type: "control_response",
                response: {
                    subtype: "error",
                    request_id: q.request_id,
                    error: X.error
                }
            };
            break
        }
        case "rename_session": {
            let X = j?.(q.request.title) ?? {
                ok: !1,
                error: "rename_session is not supported in this context (onRenameSession callback not registered)"
            };
            if (X.ok) H = {
                type: "control_response",
                response: {
                    subtype: "success",
                    request_id: q.request_id
                }
            };
            else H = {
                type: "control_response",
                response: {
                    subtype: "error",
                    request_id: q.request_id,
                    error: X.error
                }
            };
            break
        }
        case "interrupt":
            A?.(), H = {
                type: "control_response",
                response: {
                    subtype: "success",
                    request_id: q.request_id
                }
            };
            break;
        default:
            H = {
                type: "control_response",
                response: {
                    subtype: "error",
                    request_id: q.request_id,
                    error: `REPL bridge does not handle control_request subtype: ${q.request.subtype}`
                }
            }
    }
    let J = {
        ...H,
        session_id: z
    };
    _.write(J), E(`[bridge:repl] Sent control_response for ${q.request.subtype} request_id=${q.request_id} result=${H.response.subtype}`)
}
// @from(Ln 514031, Col 0)
function RX7(q) {
    return {
        type: "result",
        subtype: "success",
        duration_ms: 0,
        duration_api_ms: 0,
        is_error: !1,
        num_turns: 0,
        result: "",
        stop_reason: null,
        total_cost_usd: 0,
        usage: {
            ...iP
        },
        modelUsage: {},
        permission_denials: [],
        session_id: q,
        uuid: PqA()
    }
}
// @from(Ln 514051, Col 0)
class ou6 {
    capacity;
    ring;
    set = new Set;
    writeIdx = 0;
    constructor(q) {
        this.capacity = q, this.ring = Array(q)
    }
    add(q) {
        if (this.set.has(q)) return;
        let K = this.ring[this.writeIdx];
        if (K !== void 0) this.set.delete(K);
        this.ring[this.writeIdx] = q, this.set.add(q), this.writeIdx = (this.writeIdx + 1) % this.capacity
    }
    has(q) {
        return this.set.has(q)
    }
    clear() {
        this.set.clear(), this.ring.fill(void 0), this.writeIdx = 0
    }
}
// @from(Ln 514072, Col 4)
fqA = "This session is outbound-only. Enable Remote Control locally to allow inbound control."
// @from(Ln 514073, Col 4)
SX7 = L(() => {
    C8();
    Jx8();
    K8();
    Ef6();
    m8();
    e8()
})
// @from(Ln 514082, Col 0)
function Zq5(q) {
    return {
        Authorization: `Bearer ${q}`,
        "Content-Type": "application/json",
        "anthropic-version": GqA
    }
}
// @from(Ln 514089, Col 0)
async function CX7(q, K, _, z, Y, A, O, w) {
    let $ = `${q}/v1/code/sessions`,
        j = {
            cwd: O ?? b8(),
            ...w && {
                model: w
            }
        };
    if (A) {
        let {
            buildGitSessionContext: X
        } = await Promise.resolve().then(() => fQK), {
            sources: M,
            outcomes: P
        } = await X(A.gitRepoUrl, A.branch, A.defaultBranch);
        if (M.length > 0 || P.length > 0) j.sources = M, j.outcomes = P, j.reuse_outcome_branches = !0
    }
    let H;
    try {
        H = await Z1.post($, {
            title: _,
            bridge: {},
            ...Y?.length && {
                tags: Y
            },
            config: j
        }, {
            headers: Zq5(K),
            timeout: z,
            validateStatus: (X) => X < 500
        })
    } catch (X) {
        return E(`[code-session] Session create request failed: ${b6(X)}`), null
    }
    if (H.status !== 200 && H.status !== 201) {
        let X = Du(H.data);
        return E(`[code-session] Session create failed ${H.status}${X?`: ${X}`:""}`), null
    }
    let J = H.data;
    if (!J || typeof J !== "object" || !("session" in J) || !J.session || typeof J.session !== "object" || !("id" in J.session) || typeof J.session.id !== "string" || !J.session.id.startsWith("cse_")) return E(`[code-session] No session.id (cse_*) in response: ${I6(J).slice(0,200)}`), null;
    return J.session.id
}
// @from(Ln 514132, Col 0)
function au6(q) {
    return q !== null && "terminal" in q
}
// @from(Ln 514136, Col 0)
function vqA(q, K) {
    if (q !== null && typeof q === "object" && "error" in q && q.error !== null && typeof q.error === "object" && "resource" in q.error) {
        let _ = q.error.resource;
        if (_ === "untrusted_device" || _ === "session_stale_relogin") return _;
        return
    }
    if (K?.includes("trusted device")) return "untrusted_device";
    return
}
// @from(Ln 514145, Col 0)
async function bX7(q, K, _, z, Y) {
    let A = `${K}/v1/code/sessions/${q}/bridge`,
        O = Zq5(_);
    if (Y) O["X-Trusted-Device-Token"] = Y;
    let w;
    try {
        w = await Z1.post(A, {}, {
            headers: O,
            timeout: z,
            validateStatus: (J) => J < 500
        })
    } catch (J) {
        return E(`[code-session] /bridge request failed: ${b6(J)}`), null
    }
    if (w.status !== 200) {
        let J = Du(w.data);
        if (E(`[code-session] /bridge failed ${w.status}${J?`: ${J}`:""}`), w.status === 403) {
            let X = vqA(w.data, J);
            if (X) return {
                terminal: !0,
                reason: X
            }
        }
        return null
    }
    let $ = w.data;
    if ($ === null || typeof $ !== "object" || !("worker_jwt" in $) || typeof $.worker_jwt !== "string" || !("expires_in" in $) || typeof $.expires_in !== "number" || !("api_base_url" in $) || typeof $.api_base_url !== "string" || !("worker_epoch" in $)) return E(`[code-session] /bridge response malformed (need worker_jwt, expires_in, api_base_url, worker_epoch): ${I6($).slice(0,200)}`), null;
    let j = $.worker_epoch,
        H = typeof j === "string" ? Number(j) : j;
    if (typeof H !== "number" || !Number.isFinite(H) || !Number.isSafeInteger(H)) return E(`[code-session] /bridge worker_epoch invalid: ${I6(j)}`), null;
    return {
        worker_jwt: $.worker_jwt,
        api_base_url: $.api_base_url,
        expires_in: $.expires_in,
        worker_epoch: H
    }
}
// @from(Ln 514182, Col 4)
GqA = "2023-06-01"
// @from(Ln 514183, Col 4)
IX7 = L(() => {
    CK();
    n7();
    K8();
    m8();
    e8();
    Qe()
})
// @from(Ln 514192, Col 0)
function kqA(q) {
    return {
        Authorization: `Bearer ${q}`,
        "Content-Type": "application/json",
        "anthropic-version": VqA
    }
}
// @from(Ln 514199, Col 0)
async function fq5(q) {
    let {
        baseUrl: K,
        orgUUID: _,
        title: z,
        getAccessToken: Y,
        onAuth401: A,
        toSDKMessages: O,
        initialHistoryCap: w,
        initialMessages: $,
        onInboundMessage: j,
        onUserMessage: H,
        onSessionEstablished: J,
        onPermissionResponse: X,
        onInterrupt: M,
        onSetModel: P,
        onSetMaxThinkingTokens: W,
        onSetPermissionMode: D,
        onRenameSession: Z,
        onStateChange: G,
        outboundOnly: f,
        tags: v,
        gitRepoUrl: V = null,
        branch: k = "",
        onTransportPersistenceReady: N,
        onTransportPersistenceTeardown: R
    } = q, h = await Yz8(), C = Y();
    if (!C) return E("[remote-bridge] No OAuth token"), null;
    let {
        getOriginalCwd: x
    } = await Promise.resolve().then(() => (y8(), CD6)), {
        getMainLoopModel: B
    } = await Promise.resolve().then(() => (Sq(), cZ8)), m = await ia8(() => CX7(K, C, z, h.http_timeout_ms, v, V ? {
        gitRepoUrl: V,
        branch: k
    } : void 0, x(), B()), "createCodeSession", h);
    if (!m) return G?.("failed", "Session creation failed — see debug log"), Ag("v2_session_create_failed", void 0, !0), null;
    let S = m;
    E(`[remote-bridge] Created session ${S}`), j1("info", "bridge_repl_v2_session_created");
    let F = await ia8(() => uX7(S, K, C, h.http_timeout_ms), "fetchRemoteCredentials", h);
    if (!F || au6(F)) {
        let v6 = F ? xX7(F) : "Remote credentials fetch failed — see debug log";
        return E(`[remote-bridge] Creds failed; onStateChange ${G?"set":"UNSET"}, msg="${v6}"`), G?.("failed", v6), Ag(F ? `v2_remote_creds_${F.reason}` : "v2_remote_creds_failed", void 0, !0), ra8(S, K, C, _, h.http_timeout_ms), null
    }
    E(`[remote-bridge] Fetched bridge credentials (expires_in=${F.expires_in}s)`), J?.(S);
    let U = yz8(F.api_base_url, S);
    E(`[remote-bridge] v2 session URL: ${U}`);
    let g;
    try {
        g = await yX7({
            sessionUrl: U,
            ingressToken: F.worker_jwt,
            sessionId: S,
            epoch: F.worker_epoch,
            heartbeatIntervalMs: h.heartbeat_interval_ms,
            heartbeatJitterFraction: h.heartbeat_jitter_fraction,
            getAuthToken: () => F.worker_jwt,
            outboundOnly: f
        })
    } catch (v6) {
        return E(`[remote-bridge] v2 transport setup failed: ${b6(v6)}`, {
            level: "error"
        }), G?.("failed", `Transport setup failed: ${b6(v6)}`), Ag("v2_transport_setup_failed", void 0, !0), ra8(S, K, C, _, h.http_timeout_ms), null
    }
    E(`[remote-bridge] v2 transport created (epoch=${F.worker_epoch})`), G?.("ready");
    let c = new ou6(h.uuid_dedup_buffer_size),
        n = new Set;
    if ($)
        for (let v6 of $) n.add(v6.uuid), c.add(v6.uuid);
    let l = new ou6(h.uuid_dedup_buffer_size),
        z6 = new LX7,
        A6 = !1,
        e = !1,
        i = !1,
        O6 = !1,
        J6 = (v6, L6) => {
            if (g.reportState(v6, L6), v6 === "requires_action" && L6) O6 = !0, g.reportMetadata({
                pending_action: L6
            });
            else if (O6) O6 = !1, g.reportMetadata({
                pending_action: null
            })
        },
        $6, H6, q6;
    if (V)(async () => {
        let {
            parseGitRemote: v6,
            parseGitHubRepository: L6
        } = await Promise.resolve().then(() => (gZ(), GQ6)), {
            addWatchedRepo: y6,
            getCachedBranchForRepo: c6,
            onRepoBranchChange: Z8
        } = await Promise.resolve().then(() => (sC(), zF7)), N8 = v6(V), R6 = N8 ? `${N8.owner}/${N8.name}` : L6(V);
        if (!R6) return;
        let p6 = x();
        if (await y6(p6), e) return;
        let q8, L8 = async () => {
            if (e) return;
            let w8 = await c6(p6);
            if (w8 === void 0 || w8 === q8) return;
            q8 = w8, g.reportMetadata({
                current_branches: {
                    [R6]: w8
                }
            })
        };
        H6 = () => {
            q8 = void 0
        }, q6 = () => void L8(), $6 = Z8(q6), L8()
    })().catch((v6) => E(`[remote-bridge] current_branches setup failed: ${b6(v6)}`));
    let o = !H,
        _6 = "initial",
        r;

    function t(v6) {
        if (e) return;
        d("tengu_bridge_repl_connect_timeout", {
            v2: !0,
            elapsed_ms: h.connect_timeout_ms,
            cause: v6
        })
    }
    let Y6 = Ea8({
        refreshBufferMs: h.token_refresh_buffer_ms,
        getAccessToken: async () => {
            let v6 = Y();
            if (A) await A(v6 ?? "");
            return Y() ?? v6
        },
        onRefresh: (v6, L6) => {
            (async () => {
                if (i || e) {
                    E("[remote-bridge] Recovery already in flight, skipping proactive refresh");
                    return
                }
                i = !0;
                try {
                    let y6 = await ia8(() => uX7(v6, K, L6, h.http_timeout_ms), "fetchRemoteCredentials (proactive)", h);
                    if (!y6 || e) return;
                    if (au6(y6)) {
                        if (!e) G?.("failed", xX7(y6));
                        return
                    }
                    await M6(y6, "proactive_refresh"), E("[remote-bridge] Transport rebuilt (proactive refresh)")
                } catch (y6) {
                    if (E(`[remote-bridge] Proactive refresh rebuild failed: ${b6(y6)}`, {
                            level: "error"
                        }), j1("error", "bridge_repl_v2_proactive_refresh_failed"), !e) G?.("failed", `Refresh failed: ${b6(y6)}`)
                } finally {
                    i = !1
                }
            })()
        },
        label: "remote"
    });
    Y6.scheduleFromExpiresIn(S, F.expires_in);

    function X6() {
        g.setOnConnect(() => {
            if (clearTimeout(r), E("[remote-bridge] v2 transport connected"), j1("info", "bridge_repl_v2_transport_connected"), N) {
                let v6 = g.getInternalEventWriter?.(),
                    L6 = g.getInternalEventReaders?.();
                if (v6 && L6) N(v6, L6)
            }
            if (d("tengu_bridge_repl_ws_connected", {
                    v2: !0,
                    cause: _6
                }), !A6 && $ && $.length > 0) {
                A6 = !0;
                let v6 = g;
                f6($).catch((L6) => E(`[remote-bridge] flushHistory failed: ${L6}`)).finally(() => {
                    if (g !== v6 || e || i) return;
                    V6(), G?.("connected")
                })
            } else if (!z6.active) G?.("connected")
        }), g.setOnData((v6) => {
            Wq5(v6, c, l, j, X ? (L6) => {
                J6("running"), X(L6)
            } : void 0, (L6) => Dq5(L6, {
                transport: g,
                sessionId: S,
                onInterrupt: M,
                onSetModel: P,
                onSetMaxThinkingTokens: W,
                onSetPermissionMode: D,
                onRenameSession: Z,
                outboundOnly: f
            }))
        }), g.setOnClose((v6) => {
            if (clearTimeout(r), e) return;
            if (E(`[remote-bridge] v2 transport closed (code=${v6})`), d("tengu_bridge_repl_ws_closed", {
                    code: v6,
                    v2: !0
                }), v6 === 401 && !i) {
                W6();
                return
            }
            G?.("failed", `Transport closed (code ${v6})`)
        })
    }
    async function M6(v6, L6) {
        _6 = L6, O6 = !1, H6?.(), R?.(), z6.start();
        try {
            let y6 = g.getLastSequenceNum();
            if (g.close(), g = await yX7({
                    sessionUrl: yz8(v6.api_base_url, S),
                    ingressToken: v6.worker_jwt,
                    sessionId: S,
                    epoch: v6.worker_epoch,
                    heartbeatIntervalMs: h.heartbeat_interval_ms,
                    heartbeatJitterFraction: h.heartbeat_jitter_fraction,
                    initialSequenceNum: y6,
                    getAuthToken: () => v6.worker_jwt,
                    outboundOnly: f
                }), e) {
                g.close();
                return
            }
            X6(), g.connect(), q6?.(), r = setTimeout(t, h.connect_timeout_ms, _6), Y6.scheduleFromExpiresIn(S, v6.expires_in), V6()
        } finally {
            z6.drop()
        }
    }
    async function W6() {
        if (i) return;
        i = !0, G?.("reconnecting", "JWT expired — refreshing"), E("[remote-bridge] 401 on SSE — attempting JWT refresh");
        try {
            let v6 = Y();
            if (A) await A(v6 ?? "");
            let L6 = Y() ?? v6;
            if (!L6 || e) {
                if (!e) G?.("failed", "JWT refresh failed: no OAuth token");
                return
            }
            let y6 = await ia8(() => uX7(S, K, L6, h.http_timeout_ms), "fetchRemoteCredentials (recovery)", h);
            if (!y6 || e) {
                if (!e) G?.("failed", "JWT refresh failed after 401");
                return
            }
            if (au6(y6)) {
                if (!e) G?.("failed", xX7(y6));
                return
            }
            A6 = !1, await M6(y6, "auth_401_recovery"), E("[remote-bridge] Transport rebuilt after 401")
        } catch (v6) {
            if (E(`[remote-bridge] 401 recovery failed: ${b6(v6)}`, {
                    level: "error"
                }), j1("error", "bridge_repl_v2_jwt_refresh_failed"), !e) G?.("failed", `JWT refresh failed: ${b6(v6)}`)
        } finally {
            i = !1
        }
    }
    if (X6(), $ && $.length > 0) z6.start();
    g.connect(), r = setTimeout(t, h.connect_timeout_ms, _6);

    function V6() {
        let v6 = z6.end();
        if (v6.length === 0) return;
        for (let y6 of v6) c.add(y6.uuid);
        let L6 = O(v6).map((y6) => ({
            ...y6,
            session_id: S
        }));
        if (v6.some((y6) => y6.type === "user")) J6("running");
        E(`[remote-bridge] Drained ${v6.length} queued message(s) after flush`), g.writeBatch(L6)
    }
    async function f6(v6) {
        let L6 = v6.filter(hX7),
            y6 = w > 0 && L6.length > w ? L6.slice(-w) : L6;
        if (y6.length < L6.length) E(`[remote-bridge] Capped initial flush: ${L6.length} -> ${y6.length} (cap=${w})`);
        let c6 = O(y6).map((Z8) => ({
            ...Z8,
            session_id: S
        }));
        if (c6.length === 0) return;
        if (L6.at(-1)?.type === "user") J6("running");
        E(`[remote-bridge] Flushing ${c6.length} history events`), await g.writeBatch(c6)
    }
    async function G6() {
        if (e) return;
        e = !0, $6?.(), R?.(), Y6.cancelAll(), clearTimeout(r), z6.drop(), J6("idle"), g.write(RX7(S));
        let v6 = Y(),
            L6 = await ra8(S, K, v6, _, h.teardown_archive_timeout_ms);
        if (L6 === 401 && A) try {
            await A(v6 ?? ""), v6 = Y(), L6 = await ra8(S, K, v6, _, h.teardown_archive_timeout_ms)
        } catch (c6) {
            E(`[remote-bridge] Teardown 401 retry threw: ${b6(c6)}`, {
                level: "error"
            })
        }
        g.close();
        let y6 = L6 === "no_token" ? "skipped_no_token" : L6 === "timeout" || L6 === "error" ? "network_error" : L6 >= 500 ? "server_5xx" : L6 >= 400 ? "server_4xx" : "ok";
        E(`[remote-bridge] Torn down (archive=${L6})`), j1("info", "bridge_repl_v2_teardown"), d("tengu_bridge_repl_teardown", {
            v2: !0,
            archive_status: y6,
            archive_ok: typeof L6 === "number" && L6 < 400,
            archive_http_status: typeof L6 === "number" ? L6 : void 0,
            archive_timeout: L6 === "timeout",
            archive_no_token: L6 === "no_token"
        })
    }
    let k6 = eq(G6);
    d("tengu_bridge_repl_started", {
        has_initial_messages: !!($ && $.length > 0),
        v2: !0,
        expires_in_s: F.expires_in,
        inProtectedNamespace: kC(),
        ...pu6()
    });
    let T6 = {
        bridgeSessionId: S,
        environmentId: "",
        sessionIngressUrl: F.api_base_url,
        writeMessages(v6) {
            let L6 = v6.filter((c6) => hX7(c6) && !n.has(c6.uuid) && !c.has(c6.uuid));
            if (L6.length === 0) return;
            if (!o)
                for (let c6 of L6) {
                    let Z8 = Pq5(c6);
                    if (Z8 !== void 0 && H?.(Z8, S)) {
                        o = !0;
                        break
                    }
                }
            if (z6.enqueue(...L6)) {
                E(`[remote-bridge] Queued ${L6.length} message(s) during flush`);
                return
            }
            for (let c6 of L6) c.add(c6.uuid);
            let y6 = O(L6).map((c6) => ({
                ...c6,
                session_id: S
            }));
            if (L6.some((c6) => c6.type === "user")) J6("running");
            E(`[remote-bridge] Sending ${L6.length} message(s)`), g.writeBatch(y6)
        },
        reportMetadata(v6) {
            g.reportMetadata(v6)
        },
        writeSdkMessages(v6) {
            let L6 = v6.filter((c6) => !c6.uuid || !c.has(c6.uuid));
            if (L6.length === 0) return;
            for (let c6 of L6)
                if (c6.uuid) c.add(c6.uuid);
            let y6 = L6.map((c6) => ({
                ...c6,
                session_id: S
            }));
            g.writeBatch(y6)
        },
        sendControlRequest(v6) {
            if (i) {
                E(`[remote-bridge] Dropping control_request during 401 recovery: ${v6.request_id}`);
                return
            }
            let L6 = {
                    ...v6,
                    session_id: S
                },
                y6 = v6.request;
            if (y6.subtype === "can_use_tool") {
                let c6;
                if (u8("tengu_bridge_requires_action_details", !1)) {
                    let Z8 = y6.input?.command;
                    c6 = {
                        tool_name: y6.display_name || y6.tool_name,
                        action_description: y6.description || y6.display_name || y6.tool_name,
                        raw_command: (y6.tool_name === S7 || y6.tool_name === I5) && typeof Z8 === "string" ? Z8 : void 0,
                        tool_use_id: y6.tool_use_id,
                        request_id: v6.request_id,
                        input: y6.input
                    }
                }
                J6("requires_action", c6)
            }
            g.write(L6), E(`[remote-bridge] Sent control_request request_id=${v6.request_id}`)
        },
        sendControlResponse(v6) {
            if (i) {
                E("[remote-bridge] Dropping control_response during 401 recovery");
                return
            }
            let L6 = {
                ...v6,
                session_id: S
            };
            J6("running"), g.write(L6), E("[remote-bridge] Sent control_response")
        },
        sendControlCancelRequest(v6) {
            if (i) {
                E(`[remote-bridge] Dropping control_cancel_request during 401 recovery: ${v6}`);
                return
            }
            let L6 = {
                type: "control_cancel_request",
                request_id: v6,
                session_id: S
            };
            J6("running"), g.write(L6), E(`[remote-bridge] Sent control_cancel_request request_id=${v6}`)
        },
        sendResult() {
            if (i) {
                E("[remote-bridge] Dropping result during 401 recovery");
                return
            }
            J6("idle"), g.write(RX7(S)), E("[remote-bridge] Sent result")
        },
        async teardown() {
            k6(), await G6()
        },
        [Symbol.asyncDispose]() {
            return T6.teardown()
        }
    };
    return T6
}
// @from(Ln 514615, Col 0)
async function ia8(q, K, _) {
    let z = _.init_retry_max_attempts;
    for (let Y = 1; Y <= z; Y++) {
        let A = await q();
        if (A !== null) return A;
        if (Y < z) {
            let O = _.init_retry_base_delay_ms * 2 ** (Y - 1),
                w = O * _.init_retry_jitter_fraction * (2 * Math.random() - 1),
                $ = Math.min(O + w, _.init_retry_max_delay_ms);
            E(`[remote-bridge] ${K} failed (attempt ${Y}/${z}), retrying in ${Math.round($)}ms`), await l7($)
        }
    }
    return null
}
// @from(Ln 514630, Col 0)
function xX7(q) {
    switch (q.reason) {
        case "untrusted_device":
            return "run /login to enroll this device";
        case "session_stale_relogin":
            return "session expired for trusted-device check — run /login to re-authenticate"
    }
}
// @from(Ln 514638, Col 0)
async function uX7(q, K, _, z) {
    let Y = VJ6(),
        A = await bX7(q, K, _, z, Y);
    if (au6(A) && A.reason === "untrusted_device" && w78()) {
        j78();
        let O = VJ6();
        if (O !== Y) E("[remote-bridge] Stale trusted-device token cache; retrying with fresh keychain read"), A = await bX7(q, K, _, z, O) ?? A
    }
    if (!A) return null;
    if (au6(A)) {
        if (A.reason === "untrusted_device" && !w78()) return null;
        return A
    }
    return a96() ? {
        ...A,
        api_base_url: K
    } : A
}
// @from(Ln 514656, Col 0)
async function ra8(q, K, _, z, Y) {
    if (!_) return "no_token";
    let A = ER(q);
    try {
        let O = await Z1.post(`${K}/v1/sessions/${A}/archive`, {}, {
            headers: {
                ...kqA(_),
                "anthropic-beta": "ccr-byoc-2025-07-29",
                "x-organization-uuid": z
            },
            timeout: Y,
            validateStatus: () => !0
        });
        return E(`[remote-bridge] Archive ${A} status=${O.status}`), O.status
    } catch (O) {
        let w = b6(O);
        return E(`[remote-bridge] Archive failed: ${w}`), Z1.isAxiosError(O) && O.code === "ECONNABORTED" ? "timeout" : "error"
    }
}
// @from(Ln 514675, Col 4)
VqA = "2023-06-01"
// @from(Ln 514676, Col 4)
Gq5 = L(() => {
    CK();
    Mq5();
    Ra8();
    ya8();
    kJ6();
    Oz8();
    SX7();
    Qe();
    K8();
    VA();
    Q8();
    m8();
    R9();
    C8();
    Na8();
    B1();
    IX7();
    IX7();
    qn()
})
// @from(Ln 514697, Col 4)
mX7 = {}
// @from(Ln 514701, Col 0)
async function NqA(q) {
    let {
        onInboundMessage: K,
        onPermissionResponse: _,
        onInterrupt: z,
        onSetModel: Y,
        onSetMaxThinkingTokens: A,
        onSetPermissionMode: O,
        onStateChange: w,
        initialMessages: $,
        getMessages: j,
        initialName: H,
        outboundOnly: J,
        tags: X,
        enableSessionPersistence: M
    } = q ?? {};
    OU1(do1);
    let P = 0,
        W = {
            onTransportPersistenceReady: (n, l) => {
                let z6 = ++P;
                (async () => {
                    try {
                        let A6 = await to8();
                        await wq5(n, l, A6)
                    } catch (A6) {
                        E(`[bridge:repl] Persistence sync failed: ${b6(A6)}`, {
                            level: "error"
                        })
                    }
                    if (z6 !== P) {
                        E("[bridge:repl] Transport torn down during sync — skipping writer install");
                        return
                    }
                    Xz8(n), E("[bridge:repl] Session persistence enabled — transcript entries forwarded as internal events")
                })()
            },
            onTransportPersistenceTeardown: () => {
                P++, NH7()
            }
        };
    if (!await go1()) return Ag("not_enabled", "[bridge:repl] Skipping: bridge not enabled"), null;
    if (!DS()) return Ag("no_oauth", "[bridge:repl] Skipping: no OAuth tokens"), w?.("failed", "/login"), null;
    if (await m98(), !N5("allow_remote_control")) return Ag("policy_denied", "[bridge:repl] Skipping: allow_remote_control policy not allowed"), w?.("failed", "disabled by your organization's policy"), null;
    if (!rb6()) {
        let n = H8();
        if (n.bridgeOauthDeadExpiresAt != null && (n.bridgeOauthDeadFailCount ?? 0) >= 3 && o7()?.expiresAt === n.bridgeOauthDeadExpiresAt) return E(`[bridge:repl] Skipping: cross-process backoff (dead token seen ${n.bridgeOauthDeadFailCount} times)`), null;
        await _Y();
        let l = o7();
        if (l && l.expiresAt !== null && l.expiresAt <= Date.now()) {
            Ag("oauth_expired_unrefreshable", "[bridge:repl] Skipping: OAuth token expired and refresh failed (re-login required)"), w?.("failed", "/login");
            let z6 = l.expiresAt;
            return d8((A6) => ({
                ...A6,
                bridgeOauthDeadExpiresAt: z6,
                bridgeOauthDeadFailCount: A6.bridgeOauthDeadExpiresAt === z6 ? (A6.bridgeOauthDeadFailCount ?? 0) + 1 : 1
            })), null
        }
    }
    let D = g58(),
        Z = `${U58()}-${Zh6()}`,
        G = !1,
        f = !1;
    if (H) Z = H, G = !0, f = !0;
    else {
        let n = I8(),
            l = n ? NH(n) : void 0;
        if (l) Z = l, G = !0, f = !0;
        else if ($ && $.length > 0)
            for (let z6 = $.length - 1; z6 >= 0; z6--) {
                let A6 = $[z6];
                if (A6.type !== "user" || A6.isMeta || A6.toolUseResult || A6.isCompactSummary || A6.origin && A6.origin.kind !== "human" || YM6(A6)) continue;
                let e = qu(A6.message.content);
                if (!e) continue;
                let i = Tq5(e);
                if (!i) continue;
                Z = i, G = !0;
                break
            }
    }
    let v = 0,
        V, k = 0,
        N, R = new Set([Z]),
        h = (n, l, z6) => {
            G = !0, Z = n, R.add(n), E(`[bridge:repl] derived title from message ${z6}: ${n}`), L27(l, n, {
                baseUrl: D,
                getAccessToken: DS
            }).catch(() => {})
        },
        C = (n, l) => {
            let z6 = ++k,
                A6 = v;
            oe(n, AbortSignal.timeout(15000)).then(async (e) => {
                let i = () => z6 !== k || V !== l || NH(I8());
                if (!e || i()) return;
                let O6 = await y27(l, {
                    baseUrl: D,
                    getAccessToken: DS
                }).catch(() => null);
                if (i()) return;
                if (O6?.title && !R.has(O6.title)) {
                    N = l;
                    return
                }
                h(e, l, A6)
            })
        },
        x = (n) => {
            let l = n.trim();
            if (!l) return {
                ok: !1,
                error: "title must be non-empty"
            };
            return Z = l, G = !0, f = !0, R.add(l), AN(I8(), l, void 0, "remote"), {
                ok: !0
            }
        },
        B = (n, l) => {
            if (f || N === l || NH(I8())) return !0;
            if (V !== void 0 && V !== l) v = 0;
            if (V = l, v++, v === 1 && !G) {
                let z6 = Tq5(n);
                if (z6) h(z6, l, v);
                C(n, l)
            } else if (v === 3) {
                let z6 = j?.(),
                    A6 = z6 ? _r8(H2(z6)) : n;
                C(A6, l)
            }
            return v >= 3
        },
        m = 200,
        S = await zD();
    if (!S) return Ag("no_org_uuid", "[bridge:repl] Skipping: no org UUID"), w?.("failed", "/login"), null;
    let F = await Az8();
    if (F) return Ag("version_too_old", `[bridge:repl] Skipping: ${F}`, !0), w?.("failed", "run `claude update` to upgrade"), null;
    let U = await rj(),
        g = await DU(),
        c = await fq5({
            baseUrl: D,
            orgUUID: S,
            title: Z,
            getAccessToken: DS,
            onAuth401: $B,
            toSDKMessages: MnK,
            initialHistoryCap: m,
            initialMessages: $,
            gitRepoUrl: g,
            branch: U,
            onInboundMessage: K,
            onUserMessage: B,
            onSessionEstablished: (n) => {
                if (Yq5(wU1(n), D, () => {
                        let l = DS();
                        if (!l) return {};
                        return {
                            Authorization: `Bearer ${l}`
                        }
                    }), I18() && !o3()) hxK()
            },
            onPermissionResponse: _,
            onInterrupt: z,
            onSetModel: Y,
            onSetMaxThinkingTokens: A,
            onSetPermissionMode: O,
            onRenameSession: x,
            onStateChange: w,
            outboundOnly: J,
            tags: X,
            ...M ? W : {}
        });
    return EqA(c)
}
// @from(Ln 514875, Col 0)
function EqA(q) {
    if (!q) return da8(), null;
    let K = q.teardown.bind(q);
    return q.teardown = async () => {
        da8(), await K()
    }, q
}
// @from(Ln 514883, Col 0)
function Tq5(q) {
    let K = Nf6(q),
        z = (/^(.*?[.!?])\s/.exec(K)?.[1] ?? K).replace(/\s+/g, " ").trim();
    if (!z) return;
    return z.length > vq5 ? z.slice(0, vq5 - 1) + "…" : z
}
// @from(Ln 514889, Col 4)
vq5 = 50
// @from(Ln 514890, Col 4)
BX7 = L(() => {
    y8();
    Aq5();
    YO7();
    YD();
    J2();
    q36();
    T7();
    h1();
    K8();
    Ef6();
    m8();
    pK();
    Ju6();
    _7();
    G$();
    g4();
    ox6();
    S88();
    qn();
    aR();
    rP6();
    Qe();
    $q5();
    Gq5();
    Oz8()
})
// @from(Ln 514917, Col 4)
Eq5 = {}
// @from(Ln 514936, Col 0)
function su6(q) {
    E(`[bridge:inbound-attach] ${q}`)
}
// @from(Ln 514940, Col 0)
function pz8(q) {
    if (typeof q !== "object" || q === null || !("file_attachments" in q)) return [];
    let K = bqA().safeParse(q.file_attachments);
    return K.success ? K.data : []
}
// @from(Ln 514946, Col 0)
function IqA(q) {
    return RqA(q).replace(/[^a-zA-Z0-9._-]/g, "_") || "attachment"
}
// @from(Ln 514950, Col 0)
function xqA() {
    return Vq5(A7(), "uploads", I8())
}