
// @from(Ln 481090, Col 0)
async function Rhq(A) {
    let q;
    try {
        q = await PXz(Ya6(A), "utf8")
    } catch {
        return
    }
    let K = GXz().safeParse(WK(q, !1));
    return K.success ? K.data : void 0
}
// @from(Ln 481100, Col 0)
async function Ehq(A, q) {
    let K = Ya6(q),
        Y = B6(A);
    try {
        return await Js8(K, Y, {
            flag: "wx"
        }), !0
    } catch (z) {
        let _ = z.code;
        if (_ === "EEXIST") return !1;
        if (_ === "ENOENT") {
            await WXz(XXz(K), {
                recursive: !0
            });
            try {
                return await Js8(K, Y, {
                    flag: "wx"
                }), !0
            } catch (w) {
                if (w.code === "EEXIST") return !1;
                throw w
            }
        }
        throw z
    }
}
// @from(Ln 481127, Col 0)
function js8(A) {
    jI1?.(), jI1 = E4(async () => {
        await za6(A)
    })
}
// @from(Ln 481132, Col 0)
async function Ms8(A) {
    let q = A?.dir,
        K = A?.lockIdentity ?? R1(),
        Y = {
            sessionId: K,
            pid: process.pid,
            acquiredAt: Date.now()
        };
    if (await Ehq(Y, q)) return Ka6 = void 0, js8(A), k(`[ScheduledTasks] acquired scheduler lock (PID ${process.pid})`), !0;
    let z = await Rhq(q);
    if (z?.sessionId === K) {
        if (z.pid !== process.pid) await Js8(Ya6(q), B6(Y)), js8(A);
        return !0
    }
    if (z && cA1(z.pid)) {
        if (Ka6 !== z.sessionId) Ka6 = z.sessionId, k(`[ScheduledTasks] scheduler lock held by session ${z.sessionId} (PID ${z.pid})`);
        return !1
    }
    if (z) k(`[ScheduledTasks] recovering stale scheduler lock from PID ${z.pid}`);
    if (await Lhq(Ya6(q)).catch(() => {}), await Ehq(Y, q)) return Ka6 = void 0, js8(A), !0;
    return !1
}
// @from(Ln 481154, Col 0)
async function za6(A) {
    jI1?.(), jI1 = void 0, Ka6 = void 0;
    let q = A?.dir,
        K = A?.lockIdentity ?? R1(),
        Y = await Rhq(q);
    if (!Y || Y.sessionId !== K) return;
    try {
        await Lhq(Ya6(q)), k("[ScheduledTasks] released scheduler lock")
    } catch {}
}
// @from(Ln 481164, Col 4)
ZXz
// @from(Ln 481164, Col 9)
GXz
// @from(Ln 481164, Col 14)
jI1
// @from(Ln 481164, Col 19)
Ka6
// @from(Ln 481165, Col 4)
hhq = E(() => {
    K7();
    T1();
    H1();
    KY();
    _H6();
    K_();
    g1();
    ZXz = yhq(".claude", "scheduled_tasks.lock"), GXz = F6(() => C.object({
        sessionId: C.string(),
        pid: C.number(),
        acquiredAt: C.number()
    }))
})
// @from(Ln 481179, Col 4)
xhq = {}
// @from(Ln 481187, Col 0)
function Ihq(A, q) {
    return Boolean(A.recurring && !A.permanent && q - A.createdAt >= Chq)
}
// @from(Ln 481191, Col 0)
function Ds8(A) {
    let {
        onFire: q,
        isLoading: K,
        assistantMode: Y = !1,
        onFireTask: z,
        onMissed: _,
        dir: w,
        lockIdentity: O,
        getJitterConfig: $,
        isKilled: H
    } = A, j = w || O ? {
        dir: w,
        lockIdentity: O
    } : void 0, J = [], M = new Map, D = new Set, X = new Set, P = null, W = null, Z = null, G = null, f = !1, v = !1;
    async function N(h) {
        let R = await Mi6(w);
        if (f) return;
        if (J = R, !h) return;
        let u = Date.now(),
            I = Y7q(R, u).filter((g) => !g.recurring && !D.has(g.id));
        if (I.length > 0) {
            for (let g of I) D.add(g.id), M.set(g.id, 1 / 0);
            if (d("tengu_scheduled_task_missed", {
                    count: I.length,
                    taskIds: I.map((g) => g.id).join(",")
                }), _) _(I);
            else q(bhq(I));
            yz6(I.map((g) => g.id), w).catch((g) => k(`[ScheduledTasks] failed to remove missed tasks: ${g}`)), k(`[ScheduledTasks] surfaced ${I.length} missed one-shot task(s)`)
        }
    }

    function V() {
        if (H?.()) return;
        if (K() && !Y) return;
        let h = Date.now(),
            R = new Set,
            u = $?.() ?? Lz6;

        function I(g, B) {
            if (R.add(g.id), X.has(g.id)) return;
            let b = M.get(g.id);
            if (b === void 0) b = g.recurring ? XF8(g.cron, g.createdAt, g.id, u) ?? 1 / 0 : K7q(g.cron, g.createdAt, g.id, u) ?? 1 / 0, M.set(g.id, b), k(`[ScheduledTasks] scheduled ${g.id} for ${b===1/0?"never":new Date(b).toISOString()}`);
            if (h < b) return;
            if (k(`[ScheduledTasks] firing ${g.id}${g.recurring?" (recurring)":""}`), d("tengu_scheduled_task_fire", {
                    recurring: g.recurring ?? !1,
                    taskId: g.id
                }), z) z(g);
            else q(g.prompt);
            let p = Ihq(g, h);
            if (p) {
                let Q = Math.floor((h - g.createdAt) / 1000 / 60 / 60);
                k(`[ScheduledTasks] recurring task ${g.id} aged out (${Q}h since creation), deleting after final fire`), d("tengu_scheduled_task_expired", {
                    taskId: g.id,
                    ageHours: Q
                })
            }
            if (g.recurring && !p) {
                let Q = XF8(g.cron, h, g.id, u) ?? 1 / 0;
                M.set(g.id, Q)
            } else if (B) lk6([g.id]), M.delete(g.id);
            else X.add(g.id), yz6([g.id], w).catch((Q) => k(`[ScheduledTasks] failed to remove task ${g.id}: ${Q}`)).finally(() => X.delete(g.id)), M.delete(g.id)
        }
        if (v)
            for (let g of J) I(g, !1);
        if (w === void 0)
            for (let g of ck6()) I(g, !0);
        if (R.size === 0) {
            M.clear();
            return
        }
        for (let g of M.keys())
            if (!R.has(g)) M.delete(g)
    }
    async function L() {
        if (f) return;
        if (P) clearInterval(P), P = null;
        let {
            default: h
        } = await Promise.resolve().then(() => (F46(), e31));
        if (f) return;
        if (v = await Ms8(j).catch(() => !1), f) {
            if (v) v = !1, za6(j);
            return
        }
        if (!v) Z = setInterval(() => {
            Ms8(j).then((u) => {
                if (f) {
                    if (u) za6(j);
                    return
                }
                if (u) {
                    if (v = !0, Z) clearInterval(Z), Z = null
                }
            }).catch((u) => k(String(u), {
                level: "error"
            }))
        }, TXz), Z.unref?.();
        N(!0);
        let R = bl(w);
        G = h.watch(R, {
            persistent: !1,
            ignoreInitial: !0,
            awaitWriteFinish: {
                stabilityThreshold: fXz
            },
            ignorePermissionErrors: !0
        }), G.on("add", () => void N(!1)), G.on("change", () => void N(!1)), G.on("unlink", () => {
            if (!f) J = [], M.clear()
        }), W = setInterval(V, Shq), W.unref?.()
    }
    return {
        start() {
            if (f = !1, w !== void 0) {
                k(`[ScheduledTasks] scheduler start() — dir=${w}, hasTasks=${zE1(w)}`), L();
                return
            }
            if (k(`[ScheduledTasks] scheduler start() — enabled=${pw6()}, hasTasks=${zE1()}`), !pw6() && (Y || zE1())) dk6(!0);
            if (pw6()) {
                L();
                return
            }
            P = setInterval((h) => {
                if (pw6()) h()
            }, Shq, L), P.unref?.()
        },
        stop() {
            if (f = !0, P) clearInterval(P), P = null;
            if (W) clearInterval(W), W = null;
            if (Z) clearInterval(Z), Z = null;
            if (G?.close(), G = null, v) v = !1, za6(j)
        },
        getNextFireTime() {
            let h = 1 / 0;
            for (let R of M.values())
                if (R < h) h = R;
            return h === 1 / 0 ? null : h
        }
    }
}
// @from(Ln 481332, Col 0)
function bhq(A) {
    let q = A.length > 1,
        K = `The following one-shot scheduled task${q?"s were":" was"} missed while Claude was not running. ${q?"They have":"It has"} already been removed from .claude/scheduled_tasks.json.

Do NOT execute ${q?"these prompts":"this prompt"} yet. First use the AskUserQuestion tool to ask whether to run ${q?"each one":"it"} now. Only execute if the user confirms.`,
        Y = A.map((z) => {
            return `${`[${CT6(z.cron)}, created ${new Date(z.createdAt).toLocaleString()}]`}
\`\`\`
${z.prompt}
\`\`\``
        });
    return `${K}

${Y.join(`

`)}`
}
// @from(Ln 481349, Col 4)
Shq = 1000
// @from(Ln 481350, Col 4)
fXz = 300
// @from(Ln 481351, Col 4)
TXz = 5000
// @from(Ln 481352, Col 4)
Chq = 259200000
// @from(Ln 481353, Col 4)
Xs8 = E(() => {
    Rz6();
    H1();
    V1();
    Ji6();
    T1();
    hhq()
})
// @from(Ln 481361, Col 4)
uhq = {}
// @from(Ln 481366, Col 0)
function Ws8() {
    let A = lk("tengu_kairos_cron_config", Lz6, vXz),
        q = NXz().safeParse(A);
    return q.success ? q.data : Lz6
}
// @from(Ln 481371, Col 4)
vXz = 60000
// @from(Ln 481372, Col 4)
Ps8 = 1800000
// @from(Ln 481373, Col 4)
NXz
// @from(Ln 481374, Col 4)
Zs8 = E(() => {
    K7();
    HA();
    Rz6();
    NXz = F6(() => C.object({
        recurringFrac: C.number().min(0).max(1),
        recurringCapMs: C.number().int().min(0).max(Ps8),
        oneShotMaxMs: C.number().int().min(0).max(Ps8),
        oneShotFloorMs: C.number().int().min(0).max(Ps8),
        oneShotMinuteMod: C.number().int().min(1).max(60)
    }).refine((A) => A.oneShotFloorMs <= A.oneShotMaxMs))
})
// @from(Ln 481387, Col 0)
function mhq(A) {
    return {
        write: (q) => A.write(q),
        writeBatch: (q) => A.writeBatch(q),
        close: () => A.close(),
        isConnectedStatus: () => A.isConnectedStatus(),
        getStateLabel: () => A.getStateLabel(),
        setOnData: (q) => A.setOnData(q),
        setOnClose: (q) => A.setOnClose(q),
        setOnConnect: (q) => A.setOnConnect(q),
        connect: () => void A.connect(),
        getLastSequenceNum: () => 0,
        get droppedBatchCount() {
            return A.droppedBatchCount
        }
    }
}
// @from(Ln 481404, Col 0)
async function Bhq(A) {
    let {
        sessionUrl: q,
        ingressToken: K,
        sessionId: Y,
        initialSequenceNum: z
    } = A;
    iu6(K);
    let _ = await MC1(q, K);
    k(`[bridge:repl] CCR v2: registered worker sessionId=${Y} epoch=${_}`);
    let w = new URL(q);
    w.pathname = w.pathname.replace(/\/$/, "") + "/worker/events/stream";
    let O = new z26(w, {}, Y, void 0, z),
        $, H = new qa6(O, new URL(q), {
            onEpochMismatch: () => {
                k("[bridge:repl] CCR v2: epoch superseded (409) — closing for poll-loop recovery");
                try {
                    H.close(), O.close(), $?.(4090)
                } catch (D) {
                    k(`[bridge:repl] CCR v2: error during epoch-mismatch cleanup: ${_1(D)}`, {
                        level: "error"
                    })
                }
                throw Error("epoch superseded")
            }
        }),
        j, J = !1,
        M = !1;
    return {
        write(D) {
            return H.writeEvent(D)
        },
        async writeBatch(D) {
            for (let X of D) {
                if (M) break;
                await H.writeEvent(X)
            }
        },
        close() {
            M = !0, H.close(), O.close()
        },
        isConnectedStatus() {
            return J
        },
        getStateLabel() {
            if (O.isClosedStatus()) return "closed";
            if (O.isConnectedStatus()) return J ? "connected" : "init";
            return "connecting"
        },
        setOnData(D) {
            O.setOnData(D)
        },
        setOnClose(D) {
            $ = D, O.setOnClose((X) => {
                H.close(), D(X)
            })
        },
        setOnConnect(D) {
            j = D
        },
        getLastSequenceNum() {
            return O.getLastSequenceNum()
        },
        droppedBatchCount: 0,
        connect() {
            O.connect(), H.initialize(_).then(() => {
                J = !0, k(`[bridge:repl] v2 transport ready for writes (epoch=${_}, sse=${O.isConnectedStatus()?"open":"opening"})`), j?.()
            }, (D) => {
                k(`[bridge:repl] CCR v2 initialize failed: ${_1(D)}`, {
                    level: "error"
                }), H.close(), O.close(), $?.(4091)
            })
        }
    }
}
// @from(Ln 481479, Col 4)
ghq = E(() => {
    eC1();
    ta8();
    gL();
    H1();
    s8();
    DC1()
})
// @from(Ln 481487, Col 0)
class Gs8 {
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
    enqueue(...A) {
        if (!this._active) return !1;
        return this._pending.push(...A), !0
    }
    drop() {
        this._active = !1;
        let A = this._pending.length;
        return this._pending.length = 0, A
    }
    deactivate() {
        this._active = !1
    }
}
// @from(Ln 481518, Col 0)
async function Uhq(A) {
    let {
        dir: q,
        machineName: K,
        branch: Y,
        gitRepoUrl: z,
        title: _,
        baseUrl: w,
        sessionIngressUrl: O,
        workerType: $,
        getAccessToken: H,
        createSession: j,
        archiveSession: J,
        getCurrentTitle: M = () => _,
        toSDKMessages: D = () => {
            throw Error("BridgeCoreParams.toSDKMessages not provided. Pass it if you use writeMessages() or initialMessages — daemon callers that only use writeSdkMessages() never hit this path.")
        },
        onAuth401: X,
        getPollIntervalConfig: P = () => hi,
        initialHistoryCap: W = 200,
        initialMessages: Z,
        previouslyFlushedUUIDs: G,
        onInboundMessage: f,
        onPermissionResponse: v,
        onInterrupt: N,
        onSetModel: V,
        onSetMaxThinkingTokens: L,
        onSetPermissionMode: h,
        onStateChange: R,
        onFirstUserMessage: u,
        perpetual: I,
        initialSSESequenceNum: g = 0
    } = A, B = ++kXz, {
        writeBridgePointer: b,
        clearBridgePointer: p,
        readBridgePointer: Q
    } = await Promise.resolve().then(() => (Co6(), So6)), U = I ? await Q(q) : null, r = U?.source === "repl" ? U : null;
    k(`[bridge:repl] initBridgeCore #${B} starting (initialMessages=${Z?.length??0}${r?` perpetual prior=env:${r.environmentId}`:""})`);
    let Y6 = Kh1({
            baseUrl: w,
            getAccessToken: H,
            runnerVersion: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.VERSION,
            onDebug: k,
            onAuth401: X
        }),
        H6 = {
            dir: q,
            machineName: K,
            branch: Y,
            gitRepoUrl: z,
            maxSessions: 1,
            spawnMode: "single-session",
            verbose: !1,
            sandbox: !1,
            bridgeId: fs8(),
            workerType: $,
            environmentId: fs8(),
            reuseEnvironmentId: r?.environmentId,
            apiBaseUrl: w,
            sessionIngressUrl: O
        },
        J6, K6;
    try {
        let S6 = await Y6.registerBridgeEnvironment(H6);
        J6 = S6.environment_id, K6 = S6.environment_secret
    } catch (S6) {
        if (k(`[bridge:repl] Environment registration failed: ${_1(S6)}`), d("tengu_bridge_repl_skipped", {
                reason: "registration_failed"
            }), r) await p(q);
        return null
    }
    k(`[bridge:repl] Environment registered: ${J6}`), U1("info", "bridge_repl_env_registered"), d("tengu_bridge_repl_env_registered", {});
    async function s(S6, g6) {
        if (J6 !== S6) return k(`[bridge:repl] Env mismatch (requested ${S6}, got ${J6}) — cannot reconnect in place`), !1;
        try {
            return await Y6.reconnectSession(J6, g6), k(`[bridge:repl] Reconnected session ${g6} in place on env ${J6}`), !0
        } catch (D1) {
            return k(`[bridge:repl] reconnectSession failed: ${_1(D1)} — falling through to fresh session`), !1
        }
    }
    let X6 = r ? await s(r.environmentId, r.sessionId) : !1;
    if (r && !X6) await p(q);
    let z6;
    if (X6 && r) {
        if (z6 = r.sessionId, k(`[bridge:repl] Perpetual session reused: ${z6}`), Z && G)
            for (let S6 of Z) G.add(S6.uuid)
    } else {
        let S6 = await j({
            environmentId: J6,
            title: _,
            gitRepoUrl: z,
            branch: Y,
            signal: AbortSignal.timeout(15000)
        });
        if (!S6) return k("[bridge:repl] Session creation failed, deregistering environment"), d("tengu_bridge_repl_session_failed", {}), await Y6.deregisterEnvironment(J6).catch(() => {}), null;
        z6 = S6, k(`[bridge:repl] Session created: ${z6}`)
    }
    await b(q, {
        sessionId: z6,
        environmentId: J6,
        source: "repl"
    }), U1("info", "bridge_repl_session_created"), d("tengu_bridge_repl_started", {
        has_initial_messages: !!(Z && Z.length > 0)
    });
    let N6 = new Set;
    if (Z)
        for (let S6 of Z) N6.add(S6.uuid);
    let $6 = new Ts8(2000);
    for (let S6 of N6) $6.add(S6);
    let n = new Ts8(2000),
        o = new AbortController,
        a = null,
        i = 0,
        l = X6 ? g : 0,
        q6 = null,
        w6 = null,
        O6 = new AbortController;

    function L6() {
        O6.abort(), O6 = new AbortController
    }

    function y6() {
        let S6 = new AbortController,
            g6 = () => S6.abort(),
            D1 = o.signal;
        if (D1.aborted || O6.signal.aborted) return S6.abort(), {
            signal: S6.signal,
            cleanup: () => {}
        };
        D1.addEventListener("abort", g6, {
            once: !0
        });
        let J1 = O6.signal;
        return J1.addEventListener("abort", g6, {
            once: !0
        }), {
            signal: S6.signal,
            cleanup: () => {
                D1.removeEventListener("abort", g6), J1.removeEventListener("abort", g6)
            }
        }
    }
    let G6 = new Gs8,
        R6 = !u,
        T6 = 3,
        D6 = 0,
        Q6 = null;
    async function k6() {
        if (Q6) return Q6;
        Q6 = Z6();
        try {
            return await Q6
        } finally {
            Q6 = null
        }
    }
    async function Z6() {
        if (D6++, i++, k(`[bridge:repl] Reconnecting after env lost (attempt ${D6}/${T6})`), D6 > T6) return k(`[bridge:repl] Environment reconnect limit reached (${T6}), giving up`), !1;
        if (a) {
            let J1 = a.getLastSequenceNum();
            if (J1 > l) l = J1;
            a.close(), a = null
        }
        if (L6(), G6.drop(), q6) {
            let J1 = q6;
            if (await Y6.stopWork(J6, J1, !1).catch(() => {}), q6 !== J1) return k("[bridge:repl] Poll loop recovered during stopWork await — deferring to it"), D6 = 0, !0;
            q6 = null, w6 = null
        }
        if (o.signal.aborted) return k("[bridge:repl] Reconnect aborted by teardown"), !1;
        let S6 = J6;
        H6.reuseEnvironmentId = S6;
        try {
            let J1 = await Y6.registerBridgeEnvironment(H6);
            J6 = J1.environment_id, K6 = J1.environment_secret
        } catch (J1) {
            return H6.reuseEnvironmentId = void 0, k(`[bridge:repl] Environment re-registration failed: ${_1(J1)}`), !1
        }
        if (H6.reuseEnvironmentId = void 0, k(`[bridge:repl] Re-registered: requested=${S6} got=${J6}`), o.signal.aborted) return k("[bridge:repl] Reconnect aborted after env registration, cleaning up"), await Y6.deregisterEnvironment(J6).catch(() => {}), !1;
        if (a !== null) return k("[bridge:repl] Poll loop recovered during registerBridgeEnvironment await — deferring to it"), D6 = 0, !0;
        if (await s(S6, z6)) return d("tengu_bridge_repl_reconnected_in_place", {}), D6 = 0, !0;
        if (J6 !== S6) d("tengu_bridge_repl_env_expired_fresh_session", {});
        if (await J(z6), o.signal.aborted) return k("[bridge:repl] Reconnect aborted after archive, cleaning up"), await Y6.deregisterEnvironment(J6).catch(() => {}), !1;
        let g6 = M(),
            D1 = await j({
                environmentId: J6,
                title: g6,
                gitRepoUrl: z,
                branch: Y,
                signal: AbortSignal.timeout(15000)
            });
        if (!D1) return k("[bridge:repl] Session creation failed during reconnection"), !1;
        if (o.signal.aborted) return k("[bridge:repl] Reconnect aborted after session creation, cleaning up"), await J(D1), !1;
        return z6 = D1, l = 0, n.clear(), R6 = !u, k(`[bridge:repl] Re-created session: ${z6}`), await b(q, {
            sessionId: z6,
            environmentId: J6,
            source: "repl"
        }), G?.clear(), D6 = 0, !0
    }

    function u6() {
        return H()
    }

    function C6() {
        let S6 = G6.end();
        if (S6.length === 0) return;
        if (!a) {
            k(`[bridge:repl] Cannot drain ${S6.length} pending message(s): no transport`);
            return
        }
        for (let J1 of S6) $6.add(J1.uuid);
        let D1 = D(S6).map((J1) => ({
            ...J1,
            session_id: z6
        }));
        k(`[bridge:repl] Drained ${S6.length} pending message(s) after flush`), a.writeBatch(D1)
    }
    let o6 = null;

    function V6() {
        o6?.()
    }

    function b6(S6) {
        if (k(`[bridge:repl] Transport permanently closed: code=${S6}`), d("tengu_bridge_repl_ws_closed", {
                code: S6
            }), a) {
            let D1 = a.getLastSequenceNum();
            if (D1 > l) l = D1;
            a = null
        }
        L6();
        let g6 = G6.drop();
        if (g6 > 0) k(`[bridge:repl] Dropping ${g6} pending message(s) on transport close (code=${S6})`, {
            level: "warn"
        });
        if (S6 === 1000) {
            R?.("failed", "Remote Control session ended"), o.abort(), V6();
            return
        }
        R?.("reconnecting", `Remote Control connection lost (code ${S6})`), k(`[bridge:repl] Transport reconnect budget exhausted (code=${S6}), attempting env reconnect`), k6().then((D1) => {
            if (D1) return;
            if (o.signal.aborted) return;
            k("[bridge:repl] reconnectEnvironmentWithSession resolved false — tearing down"), d("tengu_bridge_repl_reconnect_failed", {
                close_code: S6
            }), R?.("failed", "Remote Control reconnection failed after connection loss"), V6()
        })
    }
    let E6, U6 = null,
        c6 = {
            api: Y6,
            getCredentials: () => ({
                environmentId: J6,
                environmentSecret: K6
            }),
            signal: o.signal,
            getPollIntervalConfig: P,
            onStateChange: R,
            getWsState: () => a?.getStateLabel() ?? "null",
            isAtCapacity: () => a !== null,
            capacitySignal: y6,
            onFatalError: V6,
            getHeartbeatInfo: () => {
                if (!q6 || !w6) return null;
                return {
                    environmentId: J6,
                    workId: q6,
                    sessionToken: w6
                }
            },
            onHeartbeatFatal: (S6) => {
                if (k(`[bridge:repl] heartbeatWork fatal (status=${S6.status}) — tearing down work item for fast re-dispatch`), a) {
                    let g6 = a.getLastSequenceNum();
                    if (g6 > l) l = g6;
                    a.close(), a = null
                }
                if (G6.drop(), q6) Y6.stopWork(J6, q6, !1).catch((g6) => {
                    k(`[bridge:repl] stopWork after heartbeat fatal: ${_1(g6)}`)
                });
                q6 = null, w6 = null, L6(), R?.("reconnecting", "Work item lease expired, fetching fresh token")
            },
            async onEnvironmentLost() {
                if (!await k6()) return null;
                return {
                    environmentId: J6,
                    environmentSecret: K6
                }
            },
            onWorkReceived: (S6, g6, D1, J1) => {
                if (a?.isConnectedStatus()) k(`[bridge:repl] Work received while transport connected, replacing with fresh token (workId=${D1})`);
                if (k(`[bridge:repl] Work received: workId=${D1} workSessionId=${S6} currentSessionId=${z6} match=${ho6(S6,z6)}`), b(q, {
                        sessionId: z6,
                        environmentId: J6,
                        source: "repl"
                    }), !ho6(S6, z6)) {
                    k(`[bridge:repl] Rejecting foreign session: expected=${z6} got=${S6}`);
                    return
                }
                q6 = D1, w6 = g6;
                let E1 = J1 || t6(process.env.CLAUDE_BRIDGE_USE_CCR_V2),
                    K8;
                if (!E1) {
                    if (K8 = u6(), !K8) {
                        k("[bridge:repl] No OAuth token available for session ingress, skipping work");
                        return
                    }
                    iu6(K8)
                }
                if (d("tengu_bridge_repl_work_received", {}), a) {
                    let GA = a;
                    a = null;
                    let h8 = GA.getLastSequenceNum();
                    if (h8 > l) l = h8;
                    GA.close()
                }
                G6.deactivate();

                function e8(GA) {
                    if (!a) {
                        k("[bridge:repl] Cannot respond to control_request: transport not configured");
                        return
                    }
                    let h8;
                    switch (GA.request.subtype) {
                        case "initialize":
                            h8 = {
                                type: "control_response",
                                response: {
                                    subtype: "success",
                                    request_id: GA.request_id,
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
                            V?.(GA.request.model), h8 = {
                                type: "control_response",
                                response: {
                                    subtype: "success",
                                    request_id: GA.request_id
                                }
                            };
                            break;
                        case "set_max_thinking_tokens":
                            L?.(GA.request.max_thinking_tokens), h8 = {
                                type: "control_response",
                                response: {
                                    subtype: "success",
                                    request_id: GA.request_id
                                }
                            };
                            break;
                        case "set_permission_mode": {
                            let P4 = h?.(GA.request.mode) ?? {
                                ok: !1,
                                error: "set_permission_mode is not supported in this context (onSetPermissionMode callback not registered)"
                            };
                            if (P4.ok) h8 = {
                                type: "control_response",
                                response: {
                                    subtype: "success",
                                    request_id: GA.request_id
                                }
                            };
                            else h8 = {
                                type: "control_response",
                                response: {
                                    subtype: "error",
                                    request_id: GA.request_id,
                                    error: P4.error
                                }
                            };
                            break
                        }
                        case "interrupt":
                            N?.(), h8 = {
                                type: "control_response",
                                response: {
                                    subtype: "success",
                                    request_id: GA.request_id
                                }
                            };
                            break;
                        default:
                            h8 = {
                                type: "control_response",
                                response: {
                                    subtype: "error",
                                    request_id: GA.request_id,
                                    error: `REPL bridge does not handle control_request subtype: ${GA.request.subtype}`
                                }
                            }
                    }
                    let U8 = {
                        ...h8,
                        session_id: z6
                    };
                    a.write(U8), k(`[bridge:repl] Sent control_response for ${GA.request.subtype} request_id=${GA.request_id} result=${h8.response.subtype}`)
                }
                let n8 = !1,
                    H7 = (GA) => {
                        if (a = GA, GA.setOnConnect(() => {
                                if (a !== GA) return;
                                if (k("[bridge:repl] Ingress transport connected"), d("tengu_bridge_repl_ws_connected", {}), !E1) {
                                    let h8 = u6();
                                    if (h8) iu6(h8)
                                }
                                if (n6 = !1, !n8 && Z && Z.length > 0) {
                                    n8 = !0;
                                    let h8 = W,
                                        U8 = Z.filter(($4) => ($4.type === "user" || $4.type === "assistant" || $4.type === "system" && $4.subtype === "local_command") && !G?.has($4.uuid)),
                                        P4 = h8 > 0 && U8.length > h8 ? U8.slice(-h8) : U8;
                                    if (P4.length < U8.length) k(`[bridge:repl] Capped initial flush: ${U8.length} -> ${P4.length} (cap=${h8})`), d("tengu_bridge_repl_history_capped", {
                                        eligible_count: U8.length,
                                        capped_count: P4.length
                                    });
                                    let T4 = D(P4);
                                    if (T4.length > 0) {
                                        k(`[bridge:repl] Flushing ${T4.length} initial message(s) via transport`);
                                        let $4 = T4.map((d7) => ({
                                                ...d7,
                                                session_id: z6
                                            })),
                                            qA = GA.droppedBatchCount;
                                        GA.writeBatch($4).then(() => {
                                            if (GA.droppedBatchCount > qA) {
                                                k(`[bridge:repl] Initial flush dropped ${GA.droppedBatchCount-qA} batch(es) — not marking ${T4.length} UUID(s) as flushed`);
                                                return
                                            }
                                            if (G) {
                                                for (let d7 of T4)
                                                    if (d7.uuid) G.add(d7.uuid)
                                            }
                                        }).finally(() => {
                                            if (a !== GA) return;
                                            C6(), R?.("connected")
                                        })
                                    } else C6(), R?.("connected")
                                } else if (!G6.active) R?.("connected")
                            }), GA.setOnData((h8) => {
                                RXz(h8, $6, n, f, v, e8)
                            }), U6 = b6, GA.setOnClose((h8) => {
                                if (a !== GA) return;
                                b6(h8)
                            }), !n8 && Z && Z.length > 0) G6.start();
                        GA.connect()
                    };
                if (i++, E1) {
                    let GA = JC1(w, S6),
                        h8 = i;
                    k(`[bridge:repl] CCR v2: sessionUrl=${GA} session=${S6} gen=${h8}`), Bhq({
                        sessionUrl: GA,
                        ingressToken: g6,
                        sessionId: S6,
                        initialSequenceNum: l
                    }).then((U8) => {
                        if (o.signal.aborted) {
                            U8.close();
                            return
                        }
                        if (h8 !== i) {
                            k(`[bridge:repl] CCR v2: discarding stale handshake gen=${h8} current=${i}`), U8.close();
                            return
                        }
                        H7(U8)
                    }, (U8) => {
                        if (k(`[bridge:repl] CCR v2: createV2ReplTransport failed: ${_1(U8)}`, {
                                level: "error"
                            }), d("tengu_bridge_repl_ccr_v2_init_failed", {}), h8 !== i) return;
                        if (q6) Y6.stopWork(J6, q6, !1).catch((P4) => {
                            k(`[bridge:repl] stopWork after v2 init failure: ${_1(P4)}`)
                        }), q6 = null, w6 = null;
                        L6()
                    })
                } else {
                    let GA = jC1(O, S6);
                    k(`[bridge:repl] Ingress URL: ${GA}`), k(`[bridge:repl] Creating HybridTransport: session=${S6}`);
                    let h8 = K8 ?? "";
                    H7(mhq(new eo6(new URL(GA), {
                        Authorization: `Bearer ${h8}`,
                        "anthropic-version": "2023-06-01"
                    }, S6, () => ({
                        Authorization: `Bearer ${u6()??h8}`,
                        "anthropic-version": "2023-06-01"
                    }), {
                        maxConsecutiveFailures: 50,
                        onBatchDropped: () => {
                            R?.("reconnecting", "Lost sync with Remote Control — events could not be delivered"), L6()
                        }
                    })))
                }
            }
        };
    hXz(c6);
    let K1 = I ? setInterval(() => {
        if (Q6) return;
        b(q, {
            sessionId: z6,
            environmentId: J6,
            source: "repl"
        })
    }, 3600000) : null;
    K1?.unref?.();
    let j6 = P().session_keepalive_interval_ms,
        W6 = j6 > 0 ? setInterval(() => {
            if (!a) return;
            a.write({
                type: "keep_alive"
            }).catch((S6) => {
                k(`[bridge:repl] keep_alive write failed: ${_1(S6)}`)
            })
        }, j6) : null;
    W6?.unref?.();
    let n6 = !1;
    o6 = async () => {
        if (n6) {
            k(`[bridge:repl] Teardown already in progress, skipping duplicate call env=${J6} session=${z6}`);
            return
        }
        n6 = !0;
        let S6 = Date.now();
        if (k(`[bridge:repl] Teardown starting: env=${J6} session=${z6} workId=${q6??"none"} transportState=${a?.getStateLabel()??"null"}`), K1 !== null) clearInterval(K1);
        if (W6 !== null) clearInterval(W6);
        if (E6) process.off("SIGUSR2", E6);
        if (o.abort(), k("[bridge:repl] Teardown: poll loop aborted"), a) {
            let D1 = a.getLastSequenceNum();
            if (D1 > l) l = D1
        }
        if (I) {
            a = null, G6.drop(), await b(q, {
                sessionId: z6,
                environmentId: J6,
                source: "repl"
            }), k(`[bridge:repl] Teardown (perpetual): leaving env=${J6} session=${z6} alive on server, duration=${Date.now()-S6}ms`);
            return
        }
        if (a) a.write(Qhq(z6)), a.close(), a = null;
        G6.drop(), k("[bridge:repl] Teardown: transport closed");
        let g6 = q6 ? Y6.stopWork(J6, q6, !0).then(() => {
            k("[bridge:repl] Teardown: stopWork completed")
        }).catch((D1) => {
            k(`[bridge:repl] Teardown stopWork failed: ${_1(D1)}`)
        }) : Promise.resolve();
        await Promise.all([g6, J(z6)]), await Y6.deregisterEnvironment(J6).catch((D1) => {
            k(`[bridge:repl] Teardown deregister failed: ${_1(D1)}`)
        }), await p(q), k(`[bridge:repl] Teardown complete: env=${J6} duration=${Date.now()-S6}ms`)
    };
    let d6 = E4(() => o6?.());
    return k(`[bridge:repl] Ready: env=${J6} session=${z6}`), R?.("ready"), {
        get bridgeSessionId() {
            return z6
        },
        get environmentId() {
            return J6
        },
        getSSESequenceNum() {
            let S6 = a?.getLastSequenceNum() ?? 0;
            return Math.max(l, S6)
        },
        sessionIngressUrl: O,
        writeMessages(S6) {
            let g6 = S6.filter((E1) => (E1.type === "user" || E1.type === "assistant" || E1.type === "system" && E1.subtype === "local_command") && !N6.has(E1.uuid) && !$6.has(E1.uuid));
            if (g6.length === 0) return;
            if (!R6)
                for (let E1 of g6) {
                    let K8 = SXz(E1);
                    if (K8 !== void 0) {
                        R6 = !0, u?.(K8, z6);
                        break
                    }
                }
            if (G6.enqueue(...g6)) {
                k(`[bridge:repl] Queued ${g6.length} message(s) during initial flush`);
                return
            }
            if (!a) {
                let E1 = g6.map((K8) => K8.type).join(",");
                k(`[bridge:repl] Transport not configured, dropping ${g6.length} message(s) [${E1}] for session=${z6}`, {
                    level: "warn"
                });
                return
            }
            for (let E1 of g6) $6.add(E1.uuid);
            k(`[bridge:repl] Sending ${g6.length} message(s) via transport`);
            let J1 = D(g6).map((E1) => ({
                ...E1,
                session_id: z6
            }));
            a.writeBatch(J1)
        },
        writeSdkMessages(S6) {
            let g6 = S6.filter((J1) => !J1.uuid || !$6.has(J1.uuid));
            if (g6.length === 0) return;
            if (!a) {
                k(`[bridge:repl] Transport not configured, dropping ${g6.length} SDK message(s) for session=${z6}`, {
                    level: "warn"
                });
                return
            }
            for (let J1 of g6)
                if (J1.uuid) $6.add(J1.uuid);
            let D1 = g6.map((J1) => ({
                ...J1,
                session_id: z6
            }));
            a.writeBatch(D1)
        },
        sendControlRequest(S6) {
            if (!a) {
                k("[bridge:repl] Transport not configured, skipping control_request");
                return
            }
            let g6 = {
                ...S6,
                session_id: z6
            };
            a.write(g6), k(`[bridge:repl] Sent control_request request_id=${S6.request_id}`)
        },
        sendControlResponse(S6) {
            if (!a) {
                k("[bridge:repl] Transport not configured, skipping control_response");
                return
            }
            let g6 = {
                ...S6,
                session_id: z6
            };
            a.write(g6), k("[bridge:repl] Sent control_response")
        },
        sendControlCancelRequest(S6) {
            if (!a) {
                k("[bridge:repl] Transport not configured, skipping control_cancel_request");
                return
            }
            let g6 = {
                type: "control_cancel_request",
                request_id: S6,
                session_id: z6
            };
            a.write(g6), k(`[bridge:repl] Sent control_cancel_request request_id=${S6}`)
        },
        sendResult() {
            if (!a) {
                k(`[bridge:repl] sendResult: skipping, transport not configured session=${z6}`);
                return
            }
            a.write(Qhq(z6)), k(`[bridge:repl] Sent result for session=${z6}`)
        },
        async teardown() {
            d6(), await o6?.(), k("[bridge:repl] Torn down"), d("tengu_bridge_repl_teardown", {})
        }
    }
}
// @from(Ln 482187, Col 0)
function EXz(A) {
    return A !== null && typeof A === "object" && "type" in A && typeof A.type === "string"
}
// @from(Ln 482191, Col 0)
function yXz(A) {
    return A !== null && typeof A === "object" && "type" in A && A.type === "control_response" && "response" in A
}
// @from(Ln 482195, Col 0)
function LXz(A) {
    return A !== null && typeof A === "object" && "type" in A && A.type === "control_request" && "request_id" in A && "request" in A
}
// @from(Ln 482199, Col 0)
function RXz(A, q, K, Y, z, _) {
    try {
        let w = sC1(i1(A));
        if (yXz(w)) {
            k("[bridge:repl] Ingress message type=control_response"), z?.(w);
            return
        }
        if (LXz(w)) {
            k(`[bridge:repl] Inbound control_request subtype=${w.request.subtype}`), _?.(w);
            return
        }
        if (!EXz(w)) return;
        let O = "uuid" in w && typeof w.uuid === "string" ? w.uuid : void 0;
        if (O && q.has(O)) {
            k(`[bridge:repl] Ignoring echo: type=${w.type} uuid=${O}`);
            return
        }
        if (O && K.has(O)) {
            k(`[bridge:repl] Ignoring re-delivered inbound: type=${w.type} uuid=${O}`);
            return
        }
        if (k(`[bridge:repl] Ingress message type=${w.type}${O?` uuid=${O}`:""}`), w.type === "user") {
            if (O) K.add(O);
            d("tengu_bridge_message_received", {
                is_repl: !0
            }), Y?.(w)
        } else k(`[bridge:repl] Ignoring non-user inbound message: type=${w.type}`)
    } catch (w) {
        k(`[bridge:repl] Failed to parse ingress message: ${_1(w)}`)
    }
}
// @from(Ln 482230, Col 0)
async function hXz({
    api: A,
    getCredentials: q,
    signal: K,
    onStateChange: Y,
    onWorkReceived: z,
    onEnvironmentLost: _,
    getWsState: w,
    isAtCapacity: O,
    capacitySignal: $,
    onFatalError: H,
    getPollIntervalConfig: j = () => hi,
    getHeartbeatInfo: J,
    onHeartbeatFatal: M
}) {
    k(`[bridge:repl] Starting work poll loop for env=${q().environmentId}`);
    let X = 0,
        P = null,
        W = null,
        Z = 0,
        G = !1;
    while (!K.aborted) {
        let {
            environmentId: f,
            environmentSecret: v
        } = q(), N = j();
        try {
            let V = await A.pollForWork(f, v, K, N.reclaim_older_than_ms);
            if (Z = 0, X > 0) k(`[bridge:repl] Poll recovered after ${X} consecutive error(s)`), X = 0, P = null, W = null, Y?.("ready");
            if (!V) {
                let h = G;
                if (G = !1, O?.() && $ && !h) {
                    let R = N.poll_interval_ms_at_capacity;
                    if (N.non_exclusive_heartbeat_interval_ms > 0 && J) {
                        d("tengu_bridge_heartbeat_mode_entered", {
                            heartbeat_interval_ms: N.non_exclusive_heartbeat_interval_ms
                        });
                        let I = R > 0 ? Date.now() + R : null,
                            g = !1,
                            B = 0;
                        while (!K.aborted && O() && (I === null || Date.now() < I)) {
                            let p = j();
                            if (p.non_exclusive_heartbeat_interval_ms <= 0) break;
                            let Q = J();
                            if (!Q) break;
                            let U = $();
                            try {
                                await A.heartbeatWork(Q.environmentId, Q.workId, Q.sessionToken)
                            } catch (r) {
                                if (k(`[bridge:repl:heartbeat] Failed: ${_1(r)}`), r instanceof cZ) {
                                    if (U.cleanup(), d("tengu_bridge_heartbeat_error", {
                                            status: r.status,
                                            error_type: r.status === 401 || r.status === 403 ? "auth_failed" : "fatal"
                                        }), M) M(r), k(`[bridge:repl:heartbeat] Fatal (status=${r.status}), work state cleared — fast-polling for re-dispatch`);
                                    else g = !0;
                                    break
                                }
                            }
                            B++, await JI1(p.non_exclusive_heartbeat_interval_ms, U.signal), U.cleanup()
                        }
                        let b = g ? "error" : K.aborted ? "shutdown" : !O() ? "capacity_changed" : I !== null && Date.now() >= I ? "poll_due" : "config_disabled";
                        if (d("tengu_bridge_heartbeat_mode_exited", {
                                reason: b,
                                heartbeat_cycles: B
                            }), !g) {
                            if (b === "poll_due") k(`[bridge:repl] Heartbeat poll_due after ${B} cycles — falling through to pollForWork`);
                            continue
                        }
                    }
                    let u = R > 0 ? R : N.non_exclusive_heartbeat_interval_ms;
                    if (u > 0) {
                        let I = $(),
                            g = Date.now();
                        await JI1(u, I.signal), I.cleanup();
                        let B = Date.now() - g - u;
                        if (B > 60000) k(`[bridge:repl] At-capacity sleep overran by ${Math.round(B/1000)}s — process suspension detected, forcing one fast-poll cycle`), d("tengu_bridge_repl_suspension_detected", {
                            overrun_ms: B
                        }), G = !0
                    }
                } else await JI1(N.poll_interval_ms_not_at_capacity, K);
                continue
            }
            let L;
            try {
                L = HC1(V.secret)
            } catch (h) {
                k(`[bridge:repl] Failed to decode work secret: ${_1(h)}`), d("tengu_bridge_repl_work_secret_failed", {}), await A.stopWork(f, V.id, !1).catch(() => {});
                continue
            }
            k(`[bridge:repl] Acknowledging workId=${V.id}`);
            try {
                await A.acknowledgeWork(f, V.id, L.session_ingress_token)
            } catch (h) {
                k(`[bridge:repl] Acknowledge failed workId=${V.id}: ${_1(h)}`)
            }
            if (V.data.type === "healthcheck") {
                k("[bridge:repl] Healthcheck received");
                continue
            }
            if (V.data.type === "session") {
                let h = V.data.id;
                try {
                    dZ(h, "session_id")
                } catch {
                    k(`[bridge:repl] Invalid session_id in work: ${h}`);
                    continue
                }
                z(h, L.session_ingress_token, V.id, L.use_code_sessions === !0), k("[bridge:repl] Work accepted, continuing poll loop")
            }
        } catch (V) {
            if (K.aborted) break;
            if (V instanceof cZ && V.status === 404 && _) {
                let B = q().environmentId;
                if (f !== B) {
                    k(`[bridge:repl] Stale poll error for old env=${f}, current env=${B} — skipping onEnvironmentLost`), X = 0, P = null;
                    continue
                }
                if (Z++, k(`[bridge:repl] Environment deleted, attempting re-registration (attempt ${Z}/3)`), d("tengu_bridge_repl_env_lost", {
                        attempt: Z
                    }), Z > 3) {
                    k("[bridge:repl] Environment re-registration limit reached (3), giving up"), Y?.("failed", "Environment deleted and re-registration limit reached"), H?.();
                    break
                }
                Y?.("reconnecting", "environment lost, recreating session");
                let b = await _();
                if (K.aborted) break;
                if (b) {
                    X = 0, P = null, Y?.("ready"), k(`[bridge:repl] Re-registered environment: ${b.environmentId}`);
                    continue
                }
                Y?.("failed", "Environment deleted and re-registration failed"), H?.();
                break
            }
            if (V instanceof cZ) {
                let B = VN6(V.errorType),
                    b = Pr6(V);
                if (k(`[bridge:repl] Fatal poll error: ${V.message} (status=${V.status}, type=${V.errorType??"unknown"})${b?" (suppressed)":""}`), d("tengu_bridge_repl_fatal_error", {
                        status: V.status,
                        error_type: V.errorType
                    }), U1(B ? "info" : "error", "bridge_repl_fatal_error", {
                        status: V.status,
                        error_type: V.errorType
                    }), !b) Y?.("failed", B ? "Remote Control session has expired. Please restart with `claude remote-control` or /remote-control." : V.message);
                H?.();
                break
            }
            let L = Date.now();
            if (W !== null && L - W > Fhq * 2) k(`[bridge:repl] Detected system sleep (${Math.round((L-W)/1000)}s gap), resetting poll error budget`), U1("info", "bridge_repl_poll_sleep_detected", {
                gapMs: L - W
            }), X = 0, P = null;
            if (W = L, X++, P === null) P = L;
            let h = L - P,
                R = eXq(V),
                u = qh1(V),
                I = w?.() ?? "unknown";
            if (k(`[bridge:repl] Poll error (attempt ${X}, elapsed ${Math.round(h/1000)}s, ws=${I}): ${u}`), d("tengu_bridge_repl_poll_error", {
                    status: R,
                    consecutiveErrors: X,
                    elapsedMs: h
                }), X === 1) Y?.("reconnecting", u);
            if (h >= phq) {
                k(`[bridge:repl] Poll failures exceeded ${phq/1000}s (${X} errors), giving up`), U1("info", "bridge_repl_poll_give_up"), d("tengu_bridge_repl_poll_give_up", {
                    consecutiveErrors: X,
                    elapsedMs: h,
                    lastStatus: R
                }), Y?.("failed", "Connection to server lost");
                break
            }
            let g = Math.min(VXz * 2 ** (X - 1), Fhq);
            if (j().non_exclusive_heartbeat_interval_ms > 0) {
                let B = J?.();
                if (B) try {
                    await A.heartbeatWork(B.environmentId, B.workId, B.sessionToken)
                } catch {}
            }
            await JI1(g, K)
        }
    }
    k(`[bridge:repl] Work poll loop ended (aborted=${K.aborted}) env=${q().environmentId}`)
}
// @from(Ln 482410, Col 0)
class Ts8 {
    capacity;
    ring;
    set = new Set;
    writeIdx = 0;
    constructor(A) {
        this.capacity = A, this.ring = Array(A)
    }
    add(A) {
        if (this.set.has(A)) return;
        let q = this.ring[this.writeIdx];
        if (q !== void 0) this.set.delete(q);
        this.ring[this.writeIdx] = A, this.set.add(A), this.writeIdx = (this.writeIdx + 1) % this.capacity
    }
    has(A) {
        return this.set.has(A)
    }
    clear() {
        this.set.clear(), this.ring.fill(void 0), this.writeIdx = 0
    }
}
// @from(Ln 482432, Col 0)
function Qhq(A) {
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
            ...gZ
        },
        modelUsage: {},
        permission_denials: [],
        session_id: A,
        uuid: fs8()
    }
}
// @from(Ln 482453, Col 0)
function SXz(A) {
    if (A.type !== "user" || A.isMeta || A.toolUseResult || A.isCompactSummary) return;
    let q = A.message.content,
        K;
    if (typeof q === "string") K = q;
    else
        for (let z of q)
            if (z.type === "text") {
                K = z.text;
                break
            } if (!K) return;
    return k$6(K) || void 0
}
// @from(Ln 482467, Col 0)
function JI1(A, q) {
    if (q?.aborted) return Promise.resolve();
    return new Promise((K) => {
        let Y = () => {
                clearTimeout(z), K()
            },
            z = setTimeout((_, w, O) => {
                _?.removeEventListener("abort", w), O()
            }, A, q, Y, K);
        q?.addEventListener("abort", Y, {
            once: !0
        })
    })
}
// @from(Ln 482481, Col 4)
VXz = 2000
// @from(Ln 482482, Col 4)
Fhq = 60000
// @from(Ln 482483, Col 4)
phq = 900000
// @from(Ln 482484, Col 4)
kXz = 0
// @from(Ln 482485, Col 4)
dhq = E(() => {
    Wr6();
    H1();
    u_();
    V1();
    KY();
    g1();
    DC1();
    aa8();
    ghq();
    gL();
    A8();
    Wr6();
    Xr6();
    Cp8();
    Bo8();
    s8();
    E$6();
    Fl8()
})
// @from(Ln 482505, Col 4)
vs8 = {}
// @from(Ln 482512, Col 0)
async function bXz(A) {
    let {
        onInboundMessage: q,
        onPermissionResponse: K,
        onInterrupt: Y,
        onSetModel: z,
        onSetMaxThinkingTokens: _,
        onSetPermissionMode: w,
        onStateChange: O,
        initialMessages: $,
        previouslyFlushedUUIDs: H,
        initialName: j,
        perpetual: J
    } = A ?? {};
    if (!await Kn6()) return k("[bridge:repl] Skipping: bridge not enabled"), d("tengu_bridge_repl_skipped", {
        reason: "not_enabled"
    }), null;
    let M = Yn6();
    if (M) return k(`[bridge:repl] Skipping: ${M}`), d("tengu_bridge_repl_skipped", {
        reason: "version_too_old"
    }), O?.("failed", M), null;
    if (await EU6(), !qD("allow_remote_control")) return k("[bridge:repl] Skipping: allow_remote_control policy not allowed"), d("tengu_bridge_repl_skipped", {
        reason: "policy_denied"
    }), null;
    let D = () => sA()?.accessToken;
    if (!D()) return k("[bridge:repl] Skipping: no OAuth tokens"), d("tengu_bridge_repl_skipped", {
        reason: "no_oauth"
    }), null;
    if (!0) {
        await dz();
        let h = sA();
        if (h && h.expiresAt !== null && h.expiresAt <= Date.now()) return k("[bridge:repl] Skipping: OAuth token expired and refresh failed (re-login required)"), d("tengu_bridge_repl_skipped", {
            reason: "oauth_expired_unrefreshable"
        }), O?.("failed", "OAuth token expired and could not be refreshed. Run /login to re-authenticate."), null
    }
    if (!await mR()) return k("[bridge:repl] Skipping: no org UUID"), d("tengu_bridge_repl_skipped", {
        reason: "no_org_uuid"
    }), null;
    let W = await kj(),
        Z = await Lo(),
        f = P7().BASE_API_URL,
        v = f,
        N = "claude_code",
        V = "Interactive session",
        L = !1;
    if (j) V = j, L = !0;
    else {
        let h = R1(),
            R = h ? ek(h) : void 0;
        if (R) V = R, L = !0;
        else if ($ && $.length > 0)
            for (let u = $.length - 1; u >= 0; u--) {
                let I = $[u];
                if (I.type !== "user" || I.isMeta || I.toolUseResult || I.isCompactSummary || Hz6(I)) continue;
                let g = $l(I.message.content);
                if (!g) continue;
                let B = lhq(g);
                if (!B) continue;
                V = B, L = !0;
                break
            }
    }
    return Uhq({
        dir: AA(),
        machineName: IXz(),
        branch: W,
        gitRepoUrl: Z,
        title: V,
        baseUrl: f,
        sessionIngressUrl: v,
        workerType: N,
        getAccessToken: D,
        createSession: (h) => Wc8({
            ...h,
            events: [],
            baseUrl: f,
            getAccessToken: D
        }),
        archiveSession: (h) => Zc8(h, {
            baseUrl: f,
            getAccessToken: D
        }).catch(() => {}),
        getCurrentTitle: () => ek(R1()) ?? V,
        onFirstUserMessage: (h, R) => {
            if (L || ek(R1())) {
                L = !0;
                return
            }
            let u = lhq(h);
            if (!u) return;
            L = !0, V = u, k(`[bridge:repl] derived title from first message: ${u}`), Gc8(R, u, {
                baseUrl: f,
                getAccessToken: D
            })
        },
        toSDKMessages: hJq,
        onAuth401: DG,
        getPollIntervalConfig: IF,
        initialHistoryCap: lk("tengu_bridge_initial_history_cap", 200, 300000),
        initialMessages: $,
        previouslyFlushedUUIDs: H,
        onInboundMessage: q,
        onPermissionResponse: K,
        onInterrupt: Y,
        onSetModel: z,
        onSetMaxThinkingTokens: _,
        onSetPermissionMode: w,
        onStateChange: O,
        perpetual: J
    })
}
// @from(Ln 482624, Col 0)
function lhq(A) {
    let K = k$6(A).replace(/\s+/g, " ").trim();
    if (!K) return;
    return K.length > chq ? K.slice(0, chq - 1) + "…" : K
}
// @from(Ln 482629, Col 4)
chq = 80
// @from(Ln 482630, Col 4)
Ns8 = E(() => {
    dhq();
    MF();
    AN();
    H1();
    V1();
    HA();
    fA();
    W0();
    wN6();
    YC1();
    F5();
    $5();
    T1();
    JA();
    jN6();
    Oq();
    E$6()
})
// @from(Ln 482649, Col 4)
YSq = {}
// @from(Ln 482668, Col 0)
function uXz(A) {
    if (PI1.has(A)) return !1;
    if (PI1.add(A), DI1.push(A), DI1.length > ahq) {
        let q = DI1.splice(0, DI1.length - ahq);
        for (let K of q) PI1.delete(K)
    }
    return !0
}
// @from(Ln 482676, Col 0)
async function mXz(A, q, K, Y, z, _, w, O) {
    if (tO.subscribe((h) => {
            if (PX1(h, K), Dq()) K((R) => {
                let u = R.settings,
                    I = u.fastMode === !0 && !u.fastModePerSessionOptIn;
                return {
                    ...R,
                    fastMode: I
                }
            })
        }), typeof Bun < "u") setInterval(Bun.gc, 1000).unref();
    if (Pp8(), await qG6()) await iN4();
    if (Ri(), O.resumeSessionAt && !O.resume) {
        process.stderr.write(`Error: --resume-session-at requires --resume
`), fK(1);
        return
    }
    if (O.rewindFiles && !O.resume) {
        process.stderr.write(`Error: --rewind-files requires --resume
`), fK(1);
        return
    }
    if (O.rewindFiles && A) {
        process.stderr.write(`Error: --rewind-files is a standalone operation and cannot be used with a prompt
`), fK(1);
        return
    }
    let $ = UXz(A, O);
    if (vA.isSandboxingEnabled()) try {
        await vA.initialize($.createSandboxAskCallback())
    } catch (h) {
        process.stderr.write(`
❌ Sandbox Error: ${_1(h)}
`), fK(1, "other");
        return
    }
    if (O.outputFormat === "stream-json" && O.verbose) i4q((h) => {
        let R = (() => {
            switch (h.type) {
                case "started":
                    return {
                        type: "system", subtype: "hook_started", hook_id: h.hookId, hook_name: h.hookName, hook_event: h.hookEvent, uuid: WD(), session_id: R1()
                    };
                case "progress":
                    return {
                        type: "system", subtype: "hook_progress", hook_id: h.hookId, hook_name: h.hookName, hook_event: h.hookEvent, stdout: h.stdout, stderr: h.stderr, output: h.output, uuid: WD(), session_id: R1()
                    };
                case "response":
                    return {
                        type: "system", subtype: "hook_response", hook_id: h.hookId, hook_name: h.hookName, hook_event: h.hookEvent, output: h.output, stdout: h.stdout, stderr: h.stderr, exit_code: h.exitCode, outcome: h.outcome, uuid: WD(), session_id: R1()
                    }
            }
        })();
        $.write(R)
    });
    if (O.setupTrigger) await oN1(O.setupTrigger);
    let H = q(),
        {
            messages: j,
            turnInterruptionState: J,
            agentSetting: M
        } = await QXz(K, {
            continue: O.continue,
            teleport: O.teleport,
            resume: O.resume,
            resumeSessionAt: O.resumeSessionAt,
            forkSession: O.forkSession,
            outputFormat: O.outputFormat
        });
    if (!O.agent && !Pp() && M) {
        let {
            agentDefinition: h
        } = K26(M, void 0, {
            activeAgents: w,
            allAgents: w
        });
        if (h) {
            if (K((R) => ({
                    ...R,
                    agent: h.agentType
                })), !O.systemPrompt && !Qj(h)) {
                let R = h.getSystemPrompt();
                if (R) O.systemPrompt = R
            }
            qo6(h.agentType)
        }
    }
    if (j.length === 0 && process.exitCode !== void 0) return;
    if (O.rewindFiles) {
        let h = j.find((I) => I.uuid === O.rewindFiles);
        if (!h || h.type !== "user") {
            process.stderr.write(`Error: --rewind-files requires a user message UUID, but ${O.rewindFiles} is not a user message in this session
`), fK(1);
            return
        }
        let R = q(),
            u = await thq(O.rewindFiles, R, K, !1);
        if (!u.canRewind) {
            process.stderr.write(`Error: ${u.error||"Unexpected error"}
`), fK(1);
            return
        }
        process.stdout.write(`Files rewound to state at message ${O.rewindFiles}
`), fK(0);
        return
    }
    let D = typeof O.resume === "string" && (Boolean(nk(O.resume)) || O.resume.endsWith(".jsonl")),
        X = Boolean(O.sdkUrl);
    if (!A && !D && !X) {
        process.stderr.write(`Error: Input must be provided either through stdin or as a prompt argument when using --print
`), fK(1);
        return
    }
    if (O.outputFormat === "stream-json" && !O.verbose) {
        process.stderr.write(`Error: When using --print, --output-format=stream-json requires --verbose
`), fK(1);
        return
    }
    let P = BT6(H.mcp.tools, H.toolPermissionContext),
        W = [...z, ...P],
        Z = O.sdkUrl ? "stdio" : O.permissionPromptToolName,
        G = () => {
            zV6("requires_action")
        },
        f = gXz(Z, $, H.mcp.tools, G);
    if (O.permissionPromptToolName) W = W.filter((h) => !z3(h, O.permissionPromptToolName));
    F6A(), await uvq();
    let v = O.outputFormat === "json" && O.verbose,
        N = [],
        V, L = null;
    for await (let h of BXz($, H.mcp.clients, [...Y, ...H.mcp.commands], W, j, f, _, q, K, w, O, J)) {
        if (L) {
            let R = L(h);
            if (R) await $.write(R)
        } else if (O.outputFormat === "stream-json" && O.verbose) await $.write(h);
        if (h.type !== "control_response" && h.type !== "control_request" && h.type !== "control_cancel_request" && h.type !== "stream_event" && h.type !== "keep_alive" && h.type !== "streamlined_text" && h.type !== "streamlined_tool_use_summary" && h.type !== "prompt_suggestion") {
            if (v) N.push(h);
            V = h
        }
    }
    switch (O.outputFormat) {
        case "json":
            if (!V || V.type !== "result") throw Error("No messages returned");
            if (O.verbose) {
                Z4(B6(N) + `
`);
                break
            }
            Z4(B6(V) + `
`);
            break;
        case "stream-json":
            break;
        default:
            if (!V || V.type !== "result") throw Error("No messages returned");
            switch (V.subtype) {
                case "success":
                    Z4(V.result.endsWith(`
`) ? V.result : V.result + `
`);
                    break;
                case "error_during_execution":
                    Z4("Execution error");
                    break;
                case "error_max_turns":
                    Z4(`Error: Reached max turns (${O.maxTurns})`);
                    break;
                case "error_max_budget_usd":
                    Z4(`Error: Exceeded USD budget (${O.maxBudgetUsd})`);
                    break;
                case "error_max_structured_output_retries":
                    Z4("Error: Failed to provide valid structured output after maximum retries")
            }
    }
    Wp8(), fK(V?.type === "result" && V?.is_error ? 1 : 0)
}