
// @from(Ln 325151, Col 0)
async function wl(A, q) {
    let K = FY6(A, q);
    k(`[TeammateMailbox] readMailbox: path=${K}`);
    try {
        let Y = await xd4(K, "utf-8"),
            z = i1(Y);
        return k(`[TeammateMailbox] readMailbox: read ${z.length} message(s)`), z
    } catch (Y) {
        if (Y.code === "ENOENT") return k("[TeammateMailbox] readMailbox: file does not exist"), [];
        return k(`Failed to read inbox for ${A}: ${Y}`), _6(Y), []
    }
}
// @from(Ln 325163, Col 0)
async function pY6(A, q) {
    let K = await wl(A, q),
        Y = K.filter((z) => !z.read);
    return k(`[TeammateMailbox] readUnreadMessages: ${Y.length} unread of ${K.length} total`), Y
}
// @from(Ln 325168, Col 0)
async function x3(A, q, K) {
    await OTY(K);
    let Y = FY6(A, K),
        z = `${Y}.lock`;
    k(`[TeammateMailbox] writeToMailbox: recipient=${A}, from=${q.from}, path=${Y}`);
    try {
        await Pf6(Y, "[]", {
            encoding: "utf-8",
            flag: "wx"
        }), k("[TeammateMailbox] writeToMailbox: created new inbox file")
    } catch (w) {
        if (w.code !== "EEXIST") {
            k(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${w}`), _6(w);
            return
        }
    }
    let _;
    try {
        _ = await Nc6.lock(Y, {
            lockfilePath: z,
            ...iv1
        });
        let w = await wl(A, K),
            O = {
                ...q,
                read: !1
            };
        w.push(O), await Pf6(Y, B6(w, null, 2), "utf-8"), k(`[TeammateMailbox] Wrote message to ${A}'s inbox from ${q.from}`)
    } catch (w) {
        k(`Failed to write to inbox for ${A}: ${w}`), _6(w)
    } finally {
        if (_) await _()
    }
}
// @from(Ln 325202, Col 0)
async function Vc6(A, q, K) {
    let Y = FY6(A, q);
    k(`[TeammateMailbox] markMessageAsReadByIndex called: agentName=${A}, teamName=${q}, index=${K}, path=${Y}`);
    let z = `${Y}.lock`,
        _;
    try {
        k("[TeammateMailbox] markMessageAsReadByIndex: acquiring lock..."), _ = await Nc6.lock(Y, {
            lockfilePath: z,
            ...iv1
        }), k("[TeammateMailbox] markMessageAsReadByIndex: lock acquired");
        let w = await wl(A, q);
        if (k(`[TeammateMailbox] markMessageAsReadByIndex: read ${w.length} messages after lock`), K < 0 || K >= w.length) {
            k(`[TeammateMailbox] markMessageAsReadByIndex: index ${K} out of bounds (${w.length} messages)`);
            return
        }
        let O = w[K];
        if (!O || O.read) {
            k("[TeammateMailbox] markMessageAsReadByIndex: message already read or missing");
            return
        }
        w[K] = {
            ...O,
            read: !0
        }, await Pf6(Y, B6(w, null, 2), "utf-8"), k(`[TeammateMailbox] markMessageAsReadByIndex: marked message at index ${K} as read`)
    } catch (w) {
        if (w.code === "ENOENT") {
            k(`[TeammateMailbox] markMessageAsReadByIndex: file does not exist at ${Y}`);
            return
        }
        k(`[TeammateMailbox] markMessageAsReadByIndex FAILED for ${A}: ${w}`), _6(w)
    } finally {
        if (_) await _(), k("[TeammateMailbox] markMessageAsReadByIndex: lock released")
    }
}
// @from(Ln 325236, Col 0)
async function kc6(A, q) {
    let K = FY6(A, q);
    k(`[TeammateMailbox] markMessagesAsRead called: agentName=${A}, teamName=${q}, path=${K}`);
    let Y = `${K}.lock`,
        z;
    try {
        k("[TeammateMailbox] markMessagesAsRead: acquiring lock..."), z = await Nc6.lock(K, {
            lockfilePath: Y,
            ...iv1
        }), k("[TeammateMailbox] markMessagesAsRead: lock acquired");
        let _ = await wl(A, q);
        if (k(`[TeammateMailbox] markMessagesAsRead: read ${_.length} messages after lock`), _.length === 0) {
            k("[TeammateMailbox] markMessagesAsRead: no messages to mark");
            return
        }
        let w = _.filter((J) => !J.read).length;
        k(`[TeammateMailbox] markMessagesAsRead: ${w} unread of ${_.length} total`);
        let O = _.map((J) => ({
            ...J,
            read: !0
        }));
        await Pf6(K, B6(O, null, 2), "utf-8"), k(`[TeammateMailbox] markMessagesAsRead: WROTE ${w} message(s) as read to ${K}`);
        let $ = await xd4(K, "utf-8"),
            j = i1($).filter((J) => !J.read).length;
        k(`[TeammateMailbox] markMessagesAsRead: VERIFY - ${j} still unread after write`)
    } catch (_) {
        if (_.code === "ENOENT") {
            k(`[TeammateMailbox] markMessagesAsRead: file does not exist at ${K}`);
            return
        }
        k(`[TeammateMailbox] markMessagesAsRead FAILED for ${A}: ${_}`), _6(_)
    } finally {
        if (z) await z(), k("[TeammateMailbox] markMessagesAsRead: lock released")
    }
}
// @from(Ln 325271, Col 0)
async function $TY(A, q) {
    let K = FY6(A, q);
    try {
        await Pf6(K, "[]", {
            encoding: "utf-8",
            flag: "r+"
        }), k(`[TeammateMailbox] Cleared inbox for ${A}`)
    } catch (Y) {
        if (Y.code === "ENOENT") return;
        k(`Failed to clear inbox for ${A}: ${Y}`), _6(Y)
    }
}
// @from(Ln 325284, Col 0)
function HTY(A) {
    return A.map((q) => {
        let K = q.color ? ` color="${q.color}"` : "",
            Y = q.summary ? ` summary="${q.summary}"` : "";
        return `<${fj} teammate_id="${q.from}"${K}${Y}>
${q.text}
</${fj}>`
    }).join(`

`)
}
// @from(Ln 325296, Col 0)
function Ec6(A, q) {
    return {
        type: "idle_notification",
        from: A,
        timestamp: new Date().toISOString(),
        idleReason: q?.idleReason,
        summary: q?.summary,
        completedTaskId: q?.completedTaskId,
        completedStatus: q?.completedStatus,
        failureReason: q?.failureReason
    }
}
// @from(Ln 325309, Col 0)
function yc6(A) {
    try {
        let q = i1(A);
        if (q && q.type === "idle_notification") return q
    } catch {}
    return null
}
// @from(Ln 325317, Col 0)
function Xx8(A) {
    return {
        type: "permission_request",
        request_id: A.request_id,
        agent_id: A.agent_id,
        tool_name: A.tool_name,
        tool_use_id: A.tool_use_id,
        description: A.description,
        input: A.input,
        permission_suggestions: A.permission_suggestions || []
    }
}
// @from(Ln 325330, Col 0)
function Px8(A) {
    if (A.subtype === "error") return {
        type: "permission_response",
        request_id: A.request_id,
        subtype: "error",
        error: A.error || "Permission denied"
    };
    return {
        type: "permission_response",
        request_id: A.request_id,
        subtype: "success",
        response: {
            updated_input: A.updated_input,
            permission_updates: A.permission_updates
        }
    }
}
// @from(Ln 325348, Col 0)
function Lc6(A) {
    try {
        let q = i1(A);
        if (q && q.type === "permission_request") return q
    } catch {}
    return null
}
// @from(Ln 325356, Col 0)
function QY6(A) {
    try {
        let q = i1(A);
        if (q && q.type === "permission_response") return q
    } catch {}
    return null
}
// @from(Ln 325364, Col 0)
function Wx8(A) {
    return {
        type: "sandbox_permission_request",
        requestId: A.requestId,
        workerId: A.workerId,
        workerName: A.workerName,
        workerColor: A.workerColor,
        hostPattern: {
            host: A.host
        },
        createdAt: Date.now()
    }
}
// @from(Ln 325378, Col 0)
function Zx8(A) {
    return {
        type: "sandbox_permission_response",
        requestId: A.requestId,
        host: A.host,
        allow: A.allow,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 325388, Col 0)
function nv1(A) {
    try {
        let q = i1(A);
        if (q && q.type === "sandbox_permission_request") return q
    } catch {}
    return null
}
// @from(Ln 325396, Col 0)
function Rc6(A) {
    try {
        let q = i1(A);
        if (q && q.type === "sandbox_permission_response") return q
    } catch {}
    return null
}
// @from(Ln 325404, Col 0)
function Wf6(A) {
    return {
        type: "shutdown_request",
        requestId: A.requestId,
        from: A.from,
        reason: A.reason,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 325414, Col 0)
function Gx8(A) {
    return {
        type: "shutdown_approved",
        requestId: A.requestId,
        from: A.from,
        timestamp: new Date().toISOString(),
        paneId: A.paneId,
        backendType: A.backendType
    }
}
// @from(Ln 325425, Col 0)
function fx8(A) {
    return {
        type: "shutdown_rejected",
        requestId: A.requestId,
        from: A.from,
        reason: A.reason,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 325434, Col 0)
async function rv1(A, q, K) {
    let Y = q || l5(),
        z = i3() || BY,
        _ = bZ6("shutdown", A),
        w = Wf6({
            requestId: _,
            from: z,
            reason: K
        });
    return await x3(A, {
        from: z,
        text: B6(w),
        timestamp: new Date().toISOString(),
        color: H$()
    }, Y), {
        requestId: _,
        target: A
    }
}
// @from(Ln 325454, Col 0)
function M66(A) {
    try {
        let q = Bd4().safeParse(i1(A));
        if (q.success) return q.data
    } catch {}
    return null
}
// @from(Ln 325462, Col 0)
function UY6(A) {
    try {
        let q = ud4().safeParse(i1(A));
        if (q.success) return q.data
    } catch {}
    return null
}
// @from(Ln 325470, Col 0)
function Lf(A) {
    try {
        let q = gd4().safeParse(i1(A));
        if (q.success) return q.data
    } catch {}
    return null
}
// @from(Ln 325478, Col 0)
function ov1(A) {
    try {
        let q = Fd4().safeParse(i1(A));
        if (q.success) return q.data
    } catch {}
    return null
}
// @from(Ln 325486, Col 0)
function Zf6(A) {
    try {
        let q = md4().safeParse(i1(A));
        if (q.success) return q.data
    } catch {}
    return null
}
// @from(Ln 325494, Col 0)
function av1(A) {
    try {
        let q = i1(A);
        if (q && q.type === "task_assignment") return q
    } catch {}
    return null
}
// @from(Ln 325502, Col 0)
function sv1(A) {
    try {
        let q = i1(A);
        if (q && q.type === "team_permission_update") return q
    } catch {}
    return null
}
// @from(Ln 325510, Col 0)
function tv1(A) {
    return {
        type: "mode_set_request",
        mode: A.mode,
        from: A.from
    }
}
// @from(Ln 325518, Col 0)
function ev1(A) {
    try {
        let q = pd4().safeParse(i1(A));
        if (q.success) return q.data
    } catch {}
    return null
}
// @from(Ln 325526, Col 0)
function AN1(A) {
    try {
        let q = i1(A);
        if (!q || typeof q !== "object" || !("type" in q)) return !1;
        let K = q.type;
        return K === "permission_request" || K === "permission_response" || K === "sandbox_permission_request" || K === "sandbox_permission_response" || K === "shutdown_request" || K === "shutdown_approved" || K === "team_permission_update" || K === "mode_set_request" || K === "plan_approval_request" || K === "plan_approval_response"
    } catch {
        return !1
    }
}
// @from(Ln 325536, Col 0)
async function Tx8(A, q, K) {
    let Y = FY6(A, K),
        z = `${Y}.lock`,
        _;
    try {
        _ = await Nc6.lock(Y, {
            lockfilePath: z,
            ...iv1
        });
        let w = await wl(A, K);
        if (w.length === 0) return;
        let O = w.map(($) => !$.read && q($) ? {
            ...$,
            read: !0
        } : $);
        await Pf6(Y, B6(O, null, 2), "utf-8")
    } catch (w) {
        if (w.code === "ENOENT") return;
        _6(w)
    } finally {
        if (_) try {
            await _()
        } catch {}
    }
}
// @from(Ln 325562, Col 0)
function hc6(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (!K) continue;
        if (K.type === "user" && typeof K.message.content === "string") break;
        if (K.type !== "assistant") continue;
        for (let Y of K.message.content)
            if (Y.type === "tool_use" && Y.name === hI && typeof Y.input === "object" && Y.input !== null && "to" in Y.input && typeof Y.input.to === "string" && Y.input.to !== "*" && Y.input.to.toLowerCase() !== BY.toLowerCase() && "message" in Y.input && typeof Y.input.message === "string") {
                let z = Y.input.to,
                    _ = "summary" in Y.input && typeof Y.input.summary === "string" ? Y.input.summary : Y.input.message.slice(0, 80);
                return `[to ${z}] ${_}`
            }
    }
    return
}
// @from(Ln 325577, Col 4)
Nc6
// @from(Ln 325577, Col 9)
iv1
// @from(Ln 325577, Col 14)
ud4
// @from(Ln 325577, Col 19)
md4
// @from(Ln 325577, Col 24)
Bd4
// @from(Ln 325577, Col 29)
gd4
// @from(Ln 325577, Col 34)
Fd4
// @from(Ln 325577, Col 39)
pd4
// @from(Ln 325578, Col 4)
qH = E(() => {
    A8();
    K7();
    k1();
    vz();
    H1();
    zz();
    Bw();
    Mx8();
    g1();
    Nc6 = t(nx(), 1), iv1 = {
        retries: {
            retries: 10,
            minTimeout: 5,
            maxTimeout: 100
        }
    };
    ud4 = F6(() => C.object({
        type: C.literal("plan_approval_request"),
        from: C.string(),
        timestamp: C.string(),
        planFilePath: C.string(),
        planContent: C.string(),
        requestId: C.string()
    })), md4 = F6(() => C.object({
        type: C.literal("plan_approval_response"),
        requestId: C.string(),
        approved: C.boolean(),
        feedback: C.string().optional(),
        timestamp: C.string(),
        permissionMode: J66().optional()
    })), Bd4 = F6(() => C.object({
        type: C.literal("shutdown_request"),
        requestId: C.string(),
        from: C.string(),
        reason: C.string().optional(),
        timestamp: C.string()
    })), gd4 = F6(() => C.object({
        type: C.literal("shutdown_approved"),
        requestId: C.string(),
        from: C.string(),
        timestamp: C.string(),
        paneId: C.string().optional(),
        backendType: C.string().optional()
    })), Fd4 = F6(() => C.object({
        type: C.literal("shutdown_rejected"),
        requestId: C.string(),
        from: C.string(),
        reason: C.string(),
        timestamp: C.string()
    }));
    pd4 = F6(() => C.object({
        type: C.literal("mode_set_request"),
        mode: J66(),
        from: C.string()
    }))
})
// @from(Ln 325636, Col 0)
function jTY(A) {
    let q = A6(7),
        {
            request: K
        } = A,
        Y;
    if (q[0] !== K.from) Y = lz.createElement(m, {
        marginBottom: 1
    }, lz.createElement(T, {
        color: "warning",
        bold: !0
    }, "Shutdown request from ", K.from)), q[0] = K.from, q[1] = Y;
    else Y = q[1];
    let z;
    if (q[2] !== K.reason) z = K.reason && lz.createElement(m, null, lz.createElement(T, null, "Reason: ", K.reason)), q[2] = K.reason, q[3] = z;
    else z = q[3];
    let _;
    if (q[4] !== Y || q[5] !== z) _ = lz.createElement(m, {
        flexDirection: "column",
        marginY: 1
    }, lz.createElement(m, {
        borderStyle: "round",
        borderColor: "warning",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1
    }, Y, z)), q[4] = Y, q[5] = z, q[6] = _;
    else _ = q[6];
    return _
}
// @from(Ln 325667, Col 0)
function JTY(A) {
    let q = A6(8),
        {
            response: K
        } = A,
        Y;
    if (q[0] !== K.from) Y = lz.createElement(T, {
        color: "subtle",
        bold: !0
    }, "Shutdown rejected by ", K.from), q[0] = K.from, q[1] = Y;
    else Y = q[1];
    let z;
    if (q[2] !== K.reason) z = lz.createElement(m, {
        marginTop: 1,
        borderStyle: "dashed",
        borderColor: "subtle",
        borderLeft: !1,
        borderRight: !1,
        paddingX: 1
    }, lz.createElement(T, null, "Reason: ", K.reason)), q[2] = K.reason, q[3] = z;
    else z = q[3];
    let _;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) _ = lz.createElement(m, {
        marginTop: 1
    }, lz.createElement(T, {
        dimColor: !0
    }, "Teammate is continuing to work. You may request shutdown again later.")), q[4] = _;
    else _ = q[4];
    let w;
    if (q[5] !== Y || q[6] !== z) w = lz.createElement(m, {
        flexDirection: "column",
        marginY: 1
    }, lz.createElement(m, {
        borderStyle: "round",
        borderColor: "subtle",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1
    }, Y, z, _)), q[5] = Y, q[6] = z, q[7] = w;
    else w = q[7];
    return w
}
// @from(Ln 325710, Col 0)
function Ud4(A) {
    let q = M66(A);
    if (q) return lz.createElement(jTY, {
        request: q
    });
    if (Lf(A)) return null;
    let K = ov1(A);
    if (K) return lz.createElement(JTY, {
        response: K
    });
    return null
}
// @from(Ln 325723, Col 0)
function dd4(A) {
    let q = M66(A);
    if (q) return `[Shutdown Request from ${q.from}]${q.reason?` ${q.reason}`:""}`;
    let K = Lf(A);
    if (K) return `[Shutdown Approved] ${K.from} is now exiting`;
    let Y = ov1(A);
    if (Y) return `[Shutdown Rejected] ${Y.from}: ${Y.reason}`;
    return null
}
// @from(Ln 325732, Col 4)
lz
// @from(Ln 325733, Col 4)
vx8 = E(() => {
    e6();
    i6();
    qH();
    lz = t(P6(), 1)
})
// @from(Ln 325740, Col 0)
function MTY(A) {
    let q = A6(11),
        {
            assignment: K
        } = A,
        Y;
    if (q[0] !== K.assignedBy || q[1] !== K.taskId) Y = YD.createElement(m, {
        marginBottom: 1
    }, YD.createElement(T, {
        color: "cyan_FOR_SUBAGENTS_ONLY",
        bold: !0
    }, "Task #", K.taskId, " assigned by ", K.assignedBy)), q[0] = K.assignedBy, q[1] = K.taskId, q[2] = Y;
    else Y = q[2];
    let z;
    if (q[3] !== K.subject) z = YD.createElement(m, null, YD.createElement(T, {
        bold: !0
    }, K.subject)), q[3] = K.subject, q[4] = z;
    else z = q[4];
    let _;
    if (q[5] !== K.description) _ = K.description && YD.createElement(m, {
        marginTop: 1
    }, YD.createElement(T, {
        dimColor: !0
    }, K.description)), q[5] = K.description, q[6] = _;
    else _ = q[6];
    let w;
    if (q[7] !== Y || q[8] !== z || q[9] !== _) w = YD.createElement(m, {
        flexDirection: "column",
        marginY: 1
    }, YD.createElement(m, {
        borderStyle: "round",
        borderColor: "cyan_FOR_SUBAGENTS_ONLY",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1
    }, Y, z, _)), q[7] = Y, q[8] = z, q[9] = _, q[10] = w;
    else w = q[10];
    return w
}
// @from(Ln 325780, Col 0)
function cd4(A) {
    let q = av1(A);
    if (q) return YD.createElement(MTY, {
        assignment: q
    });
    return null
}
// @from(Ln 325788, Col 0)
function ld4(A) {
    let q = av1(A);
    if (q) return `[Task Assigned] #${q.taskId} - ${q.subject}`;
    return null
}
// @from(Ln 325793, Col 4)
YD
// @from(Ln 325794, Col 4)
Nx8 = E(() => {
    e6();
    i6();
    qH();
    YD = t(P6(), 1)
})
// @from(Ln 325801, Col 0)
function DTY(A) {
    let q = A6(10),
        {
            request: K
        } = A,
        Y;
    if (q[0] !== K.from) Y = A5.createElement(m, {
        marginBottom: 1
    }, A5.createElement(T, {
        color: "planMode",
        bold: !0
    }, "Plan Approval Request from ", K.from)), q[0] = K.from, q[1] = Y;
    else Y = q[1];
    let z;
    if (q[2] !== K.planContent) z = A5.createElement(m, {
        borderStyle: "dashed",
        borderColor: "subtle",
        borderLeft: !1,
        borderRight: !1,
        flexDirection: "column",
        paddingX: 1,
        marginBottom: 1
    }, A5.createElement(U_, null, K.planContent)), q[2] = K.planContent, q[3] = z;
    else z = q[3];
    let _;
    if (q[4] !== K.planFilePath) _ = A5.createElement(T, {
        dimColor: !0
    }, "Plan file: ", K.planFilePath), q[4] = K.planFilePath, q[5] = _;
    else _ = q[5];
    let w;
    if (q[6] !== Y || q[7] !== z || q[8] !== _) w = A5.createElement(m, {
        flexDirection: "column",
        marginY: 1
    }, A5.createElement(m, {
        borderStyle: "round",
        borderColor: "planMode",
        flexDirection: "column",
        paddingX: 1
    }, Y, z, _)), q[6] = Y, q[7] = z, q[8] = _, q[9] = w;
    else w = q[9];
    return w
}
// @from(Ln 325844, Col 0)
function XTY(A) {
    let q = A6(13),
        {
            response: K,
            senderName: Y
        } = A;
    if (K.approved) {
        let $;
        if (q[0] !== Y) $ = A5.createElement(m, null, A5.createElement(T, {
            color: "success",
            bold: !0
        }, "✓ Plan Approved by ", Y)), q[0] = Y, q[1] = $;
        else $ = q[1];
        let H;
        if (q[2] === Symbol.for("react.memo_cache_sentinel")) H = A5.createElement(m, {
            marginTop: 1
        }, A5.createElement(T, null, "You can now proceed with implementation. Your plan mode restrictions have been lifted.")), q[2] = H;
        else H = q[2];
        let j;
        if (q[3] !== $) j = A5.createElement(m, {
            flexDirection: "column",
            marginY: 1
        }, A5.createElement(m, {
            borderStyle: "round",
            borderColor: "success",
            flexDirection: "column",
            paddingX: 1,
            paddingY: 1
        }, $, H)), q[3] = $, q[4] = j;
        else j = q[4];
        return j
    }
    let z;
    if (q[5] !== Y) z = A5.createElement(m, null, A5.createElement(T, {
        color: "error",
        bold: !0
    }, "✗ Plan Rejected by ", Y)), q[5] = Y, q[6] = z;
    else z = q[6];
    let _;
    if (q[7] !== K.feedback) _ = K.feedback && A5.createElement(m, {
        marginTop: 1,
        borderStyle: "dashed",
        borderColor: "subtle",
        borderLeft: !1,
        borderRight: !1,
        paddingX: 1
    }, A5.createElement(T, null, "Feedback: ", K.feedback)), q[7] = K.feedback, q[8] = _;
    else _ = q[8];
    let w;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) w = A5.createElement(m, {
        marginTop: 1
    }, A5.createElement(T, {
        dimColor: !0
    }, "Please revise your plan based on the feedback and call ExitPlanMode again.")), q[9] = w;
    else w = q[9];
    let O;
    if (q[10] !== z || q[11] !== _) O = A5.createElement(m, {
        flexDirection: "column",
        marginY: 1
    }, A5.createElement(m, {
        borderStyle: "round",
        borderColor: "error",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1
    }, z, _, w)), q[10] = z, q[11] = _, q[12] = O;
    else O = q[12];
    return O
}
// @from(Ln 325914, Col 0)
function qN1(A, q) {
    let K = UY6(A);
    if (K) return A5.createElement(DTY, {
        request: K
    });
    let Y = Zf6(A);
    if (Y) return A5.createElement(XTY, {
        response: Y,
        senderName: q
    });
    return null
}
// @from(Ln 325927, Col 0)
function PTY(A) {
    let q = UY6(A);
    if (q) return `[Plan Approval Request from ${q.from}]`;
    let K = Zf6(A);
    if (K)
        if (K.approved) return "[Plan Approved] You can now proceed with implementation";
        else return `[Plan Rejected] ${K.feedback||"Please revise your plan"}`;
    return null
}
// @from(Ln 325937, Col 0)
function WTY(A) {
    let q = ["Agent idle"];
    if (A.completedTaskId) {
        let K = A.completedStatus || "completed";
        q.push(`Task ${A.completedTaskId} ${K}`)
    }
    if (A.summary) q.push(`Last DM: ${A.summary}`);
    return q.join(" · ")
}
// @from(Ln 325947, Col 0)
function id4(A) {
    let q = PTY(A);
    if (q) return q;
    let K = dd4(A);
    if (K) return K;
    let Y = yc6(A);
    if (Y) return WTY(Y);
    let z = ld4(A);
    if (z) return z;
    try {
        let _ = i1(A);
        if (_?.type === "teammate_terminated" && _.message) return _.message
    } catch {}
    return A
}
// @from(Ln 325962, Col 4)
A5
// @from(Ln 325963, Col 4)
Vx8 = E(() => {
    e6();
    i6();
    ov();
    qH();
    g1();
    vx8();
    Nx8();
    A5 = t(P6(), 1)
})
// @from(Ln 325974, Col 0)
function GTY(A) {
    let q = [];
    for (let K of A.matchAll(ZTY))
        if (K[1] && K[4]) q.push({
            teammateId: K[1],
            color: K[2],
            summary: K[3],
            content: K[4].trim()
        });
    return q
}
// @from(Ln 325986, Col 0)
function fTY(A) {
    if (A === "leader") return "leader";
    return A
}
// @from(Ln 325991, Col 0)
function nd4({
    addMargin: A,
    param: {
        text: q
    },
    isTranscriptMode: K
}) {
    let Y = GTY(q).filter((z) => {
        if (Lf(z.content)) return !1;
        try {
            if (i1(z.content)?.type === "teammate_terminated") return !1
        } catch {}
        return !0
    });
    if (Y.length === 0) return null;
    return N3.createElement(m, {
        flexDirection: "column",
        marginTop: A ? 1 : 0,
        width: "100%"
    }, Y.map((z, _) => {
        let w = G0(z.color),
            O = fTY(z.teammateId),
            $ = qN1(z.content, O);
        if ($) return N3.createElement(N3.Fragment, {
            key: _
        }, $);
        let H = Ud4(z.content);
        if (H) return N3.createElement(N3.Fragment, {
            key: _
        }, H);
        let j = cd4(z.content);
        if (j) return N3.createElement(N3.Fragment, {
            key: _
        }, j);
        let J = null;
        try {
            J = i1(z.content)
        } catch {}
        if (J?.type === "idle_notification") return null;
        if (J?.type === "task_completed") {
            let M = J;
            return N3.createElement(m, {
                key: _,
                flexDirection: "column",
                marginTop: 1
            }, N3.createElement(T, {
                color: w
            }, `@${O}${a6.pointer}`), N3.createElement(t1, null, N3.createElement(T, {
                color: "success"
            }, "✓"), N3.createElement(T, null, " ", "Completed task #", M.taskId, M.taskSubject && N3.createElement(T, {
                dimColor: !0
            }, " (", M.taskSubject, ")"))))
        }
        return N3.createElement(kx8, {
            key: _,
            displayName: O,
            inkColor: w,
            content: z.content,
            summary: z.summary,
            isTranscriptMode: K
        })
    }))
}
// @from(Ln 326055, Col 0)
function kx8(A) {
    let q = A6(14),
        {
            displayName: K,
            inkColor: Y,
            content: z,
            summary: _,
            isTranscriptMode: w
        } = A,
        O = `@${K}${a6.pointer}`,
        $;
    if (q[0] !== Y || q[1] !== O) $ = N3.createElement(T, {
        color: Y
    }, O), q[0] = Y, q[1] = O, q[2] = $;
    else $ = q[2];
    let H;
    if (q[3] !== _) H = _ && N3.createElement(T, null, " ", _), q[3] = _, q[4] = H;
    else H = q[4];
    let j;
    if (q[5] !== $ || q[6] !== H) j = N3.createElement(m, null, $, H), q[5] = $, q[6] = H, q[7] = j;
    else j = q[7];
    let J;
    if (q[8] !== z || q[9] !== w) J = w && N3.createElement(m, {
        paddingLeft: 2
    }, N3.createElement(T, null, N3.createElement(wK, null, z))), q[8] = z, q[9] = w, q[10] = J;
    else J = q[10];
    let M;
    if (q[11] !== j || q[12] !== J) M = N3.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, j, J), q[11] = j, q[12] = J, q[13] = M;
    else M = q[13];
    return M
}
// @from(Ln 326089, Col 4)
N3
// @from(Ln 326089, Col 8)
ZTY
// @from(Ln 326090, Col 4)
Ex8 = E(() => {
    e6();
    i6();
    b7();
    kc();
    vz();
    g1();
    Vx8();
    vx8();
    qH();
    Nx8();
    iq();
    N3 = t(P6(), 1), ZTY = new RegExp(`<${fj}\\s+teammate_id="([^"]+)"(?:\\s+color="([^"]+)")?(?:\\s+summary="([^"]+)")?>\\n?([\\s\\S]*?)\\n?<\\/${fj}>`, "g")
})
// @from(Ln 326105, Col 0)
function TTY(A) {
    switch (A) {
        case "completed":
            return "success";
        case "failed":
            return "error";
        case "killed":
            return "warning";
        default:
            return "text"
    }
}
// @from(Ln 326118, Col 0)
function rd4(A) {
    let q = A6(12),
        {
            addMargin: K,
            param: Y
        } = A,
        {
            text: z
        } = Y,
        _;
    if (q[0] !== z) _ = d4(z, "summary"), q[0] = z, q[1] = _;
    else _ = q[1];
    let w = _;
    if (!w) return null;
    let O;
    if (q[2] !== z) {
        let D = d4(z, "status");
        O = TTY(D), q[2] = z, q[3] = O
    } else O = q[3];
    let $ = O,
        H = K ? 1 : 0,
        j;
    if (q[4] !== $) j = dY6.createElement(T, {
        color: $
    }, I3), q[4] = $, q[5] = j;
    else j = q[5];
    let J;
    if (q[6] !== w || q[7] !== j) J = dY6.createElement(T, null, j, " ", w), q[6] = w, q[7] = j, q[8] = J;
    else J = q[8];
    let M;
    if (q[9] !== H || q[10] !== J) M = dY6.createElement(m, {
        marginTop: H
    }, J), q[9] = H, q[10] = J, q[11] = M;
    else M = q[11];
    return M
}
// @from(Ln 326154, Col 4)
dY6
// @from(Ln 326155, Col 4)
od4 = E(() => {
    e6();
    i6();
    qw();
    JA();
    dY6 = t(P6(), 1)
})
// @from(Ln 326163, Col 0)
function vTY(A) {
    let q = [],
        K = /<mcp-resource-update\s+server="([^"]+)"\s+uri="([^"]+)"[^>]*>(?:[\s\S]*?<reason>([^<]+)<\/reason>)?/g,
        Y;
    while ((Y = K.exec(A)) !== null) q.push({
        kind: "resource",
        server: Y[1] ?? "",
        target: Y[2] ?? "",
        reason: Y[3]
    });
    let z = /<mcp-polling-update\s+type="([^"]+)"\s+server="([^"]+)"\s+tool="([^"]+)"[^>]*>(?:[\s\S]*?<reason>([^<]+)<\/reason>)?/g;
    while ((Y = z.exec(A)) !== null) q.push({
        kind: "polling",
        server: Y[2] ?? "",
        target: Y[3] ?? "",
        reason: Y[4]
    });
    return q
}
// @from(Ln 326183, Col 0)
function NTY(A) {
    if (A.startsWith("file://")) {
        let q = A.slice(7),
            K = q.split("/");
        return K[K.length - 1] || q
    }
    if (A.length > 40) return A.slice(0, 39) + "…";
    return A
}
// @from(Ln 326193, Col 0)
function ad4(A) {
    let q = A6(12),
        {
            addMargin: K,
            param: Y
        } = A,
        {
            text: z
        } = Y,
        _, w, O, $, H;
    if (q[0] !== K || q[1] !== z) {
        H = Symbol.for("react.early_return_sentinel");
        A: {
            let J = vTY(z);
            if (J.length === 0) {
                H = null;
                break A
            }
            _ = m,
            w = "column",
            O = K ? 1 : 0,
            $ = J.map(VTY)
        }
        q[0] = K, q[1] = z, q[2] = _, q[3] = w, q[4] = O, q[5] = $, q[6] = H
    } else _ = q[2], w = q[3], O = q[4], $ = q[5], H = q[6];
    if (H !== Symbol.for("react.early_return_sentinel")) return H;
    let j;
    if (q[7] !== _ || q[8] !== w || q[9] !== O || q[10] !== $) j = Rf.createElement(_, {
        flexDirection: w,
        marginTop: O
    }, $), q[7] = _, q[8] = w, q[9] = O, q[10] = $, q[11] = j;
    else j = q[11];
    return j
}
// @from(Ln 326228, Col 0)
function VTY(A, q) {
    return Rf.createElement(m, {
        key: q
    }, Rf.createElement(T, null, Rf.createElement(T, {
        color: "success"
    }, yw4), " ", Rf.createElement(T, {
        dimColor: !0
    }, A.server, ":"), " ", Rf.createElement(T, {
        color: "suggestion"
    }, A.kind === "resource" ? NTY(A.target) : A.target), A.reason && Rf.createElement(T, {
        dimColor: !0
    }, " · ", A.reason)))
}
// @from(Ln 326241, Col 4)
Rf
// @from(Ln 326242, Col 4)
sd4 = E(() => {
    e6();
    i6();
    qw();
    Rf = t(P6(), 1)
})
// @from(Ln 326249, Col 0)
function KN1(A) {
    let q = A6(6),
        {
            addMargin: K,
            planContent: Y
        } = A,
        z = K ? 1 : 0,
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = Ol.createElement(m, {
        marginBottom: 1
    }, Ol.createElement(T, {
        bold: !0,
        color: "planMode"
    }, "Plan to implement")), q[0] = _;
    else _ = q[0];
    let w;
    if (q[1] !== Y) w = Ol.createElement(U_, null, Y), q[1] = Y, q[2] = w;
    else w = q[2];
    let O;
    if (q[3] !== z || q[4] !== w) O = Ol.createElement(m, {
        flexDirection: "column",
        borderStyle: "round",
        borderColor: "planMode",
        marginTop: z,
        paddingX: 1
    }, _, w), q[3] = z, q[4] = w, q[5] = O;
    else O = q[5];
    return O
}
// @from(Ln 326278, Col 4)
Ol
// @from(Ln 326279, Col 4)
yx8 = E(() => {
    e6();
    i6();
    ov();
    Ol = t(P6(), 1)
})
// @from(Ln 326286, Col 0)
function cY6(A) {
    let q = A6(33),
        {
            addMargin: K,
            param: Y,
            verbose: z,
            planContent: _,
            isTranscriptMode: w,
            timestamp: O
        } = A;
    if (Y.text.trim() === wE) return null;
    if (_) {
        let H;
        if (q[0] !== K || q[1] !== _) H = RO.createElement(KN1, {
            addMargin: K,
            planContent: _
        }), q[0] = K, q[1] = _, q[2] = H;
        else H = q[2];
        return H
    }
    if (d4(Y.text, vV)) return null;
    if (Y.text.includes(`<${mL6}>`)) return null;
    if (Y.text.startsWith("<bash-stdout") || Y.text.startsWith("<bash-stderr")) {
        let H;
        if (q[3] !== Y.text || q[4] !== z) H = RO.createElement(Xd4, {
            content: Y.text,
            verbose: z
        }), q[3] = Y.text, q[4] = z, q[5] = H;
        else H = q[5];
        return H
    }
    if (Y.text.startsWith("<local-command-stdout") || Y.text.startsWith("<local-command-stderr")) {
        let H;
        if (q[6] !== Y.text) H = RO.createElement(Zd4, {
            content: Y.text
        }), q[6] = Y.text, q[7] = H;
        else H = q[7];
        return H
    }
    if (Y.text === D66 || Y.text === P0) {
        let H;
        if (q[8] === Symbol.for("react.memo_cache_sentinel")) H = RO.createElement(t1, {
            height: 1
        }, RO.createElement(CB, null)), q[8] = H;
        else H = q[8];
        return H
    }
    if (Y.text.includes("<bash-input>")) {
        let H;
        if (q[9] !== K || q[10] !== Y) H = RO.createElement(Qv1, {
            addMargin: K,
            param: Y
        }), q[9] = K, q[10] = Y, q[11] = H;
        else H = q[11];
        return H
    }
    if (Y.text.includes(`<${PP}>`)) {
        let H;
        if (q[12] !== K || q[13] !== Y) H = RO.createElement(zd4, {
            addMargin: K,
            param: Y
        }), q[12] = K, q[13] = Y, q[14] = H;
        else H = q[14];
        return H
    }
    if (Y.text.includes("<user-memory-input>")) {
        let H;
        if (q[15] !== K || q[16] !== Y.text) H = RO.createElement(Jd4, {
            addMargin: K,
            text: Y.text
        }), q[15] = K, q[16] = Y.text, q[17] = H;
        else H = q[17];
        return H
    }
    if (E7() && Y.text.includes(`<${fj}`)) {
        let H;
        if (q[18] !== K || q[19] !== w || q[20] !== Y) H = RO.createElement(nd4, {
            addMargin: K,
            param: Y,
            isTranscriptMode: w
        }), q[18] = K, q[19] = w, q[20] = Y, q[21] = H;
        else H = q[21];
        return H
    }
    if (Y.text.includes(`<${EH}`)) {
        let H;
        if (q[22] !== K || q[23] !== Y) H = RO.createElement(rd4, {
            addMargin: K,
            param: Y
        }), q[22] = K, q[23] = Y, q[24] = H;
        else H = q[24];
        return H
    }
    if (Y.text.includes("<mcp-resource-update") || Y.text.includes("<mcp-polling-update")) {
        let H;
        if (q[25] !== K || q[26] !== Y) H = RO.createElement(ad4, {
            addMargin: K,
            param: Y
        }), q[25] = K, q[26] = Y, q[27] = H;
        else H = q[27];
        return H
    }
    let $;
    if (q[28] !== K || q[29] !== w || q[30] !== Y || q[31] !== O) $ = RO.createElement(Hd4, {
        addMargin: K,
        param: Y,
        isTranscriptMode: w,
        timestamp: O
    }), q[28] = K, q[29] = w, q[30] = Y, q[31] = O, q[32] = $;
    else $ = q[32];
    return $
}
// @from(Ln 326398, Col 4)
RO
// @from(Ln 326399, Col 4)
YN1 = E(() => {
    e6();
    zx8();
    _d4();
    jd4();
    Md4();
    MW6();
    JA();
    iq();
    Pd4();
    Gd4();
    Qz();
    Ex8();
    od4();
    sd4();
    vz();
    yx8();
    JA();
    RO = t(P6(), 1)
})
// @from(Ln 326423, Col 0)
function zN1(A) {
    let q = A6(7),
        {
            imageId: K,
            addMargin: Y
        } = A,
        z = K ? `[Image #${K}]` : "[Image]",
        _;
    if (q[0] !== K || q[1] !== z) {
        let $ = K ? ZG1(K) : null;
        _ = $ && cG() ? Zb.createElement(y7, {
            url: kTY($).href
        }, Zb.createElement(T, null, z)) : Zb.createElement(T, null, z), q[0] = K, q[1] = z, q[2] = _
    } else _ = q[2];
    let w = _;
    if (Y) {
        let $;
        if (q[3] !== w) $ = Zb.createElement(m, {
            marginTop: 1
        }, w), q[3] = w, q[4] = $;
        else $ = q[4];
        return $
    }
    let O;
    if (q[5] !== w) O = Zb.createElement(t1, null, w), q[5] = w, q[6] = O;
    else O = q[6];
    return O
}
// @from(Ln 326451, Col 4)
Zb
// @from(Ln 326452, Col 4)
Lx8 = E(() => {
    e6();
    i6();
    IK6();
    Sc();
    mU();
    iq();
    Zb = t(P6(), 1)
})
// @from(Ln 326462, Col 0)
function _N1(A) {
    let q = A6(11),
        {
            param: K,
            addMargin: Y,
            isTranscriptMode: z,
            verbose: _,
            hideInTranscript: w
        } = A,
        {
            thinking: O
        } = K,
        $ = Y === void 0 ? !1 : Y,
        H = w === void 0 ? !1 : w,
        j = Rq("app:toggleTranscript", "Global", "ctrl+o");
    if (!O) return null;
    if (H) return null;
    if (!(z || _)) {
        let W = $ ? 1 : 0,
            Z = `${"∴ Thinking"} (${j} to expand)`,
            G;
        if (q[0] !== Z) G = lY6.default.createElement(T, {
            dimColor: !0,
            italic: !0
        }, Z), q[0] = Z, q[1] = G;
        else G = q[1];
        let f;
        if (q[2] !== W || q[3] !== G) f = lY6.default.createElement(m, {
            marginTop: W
        }, G), q[2] = W, q[3] = G, q[4] = f;
        else f = q[4];
        return f
    }
    let M = $ ? 1 : 0,
        D;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) D = lY6.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "∴ Thinking", "…"), q[5] = D;
    else D = q[5];
    let X;
    if (q[6] !== O) X = lY6.default.createElement(m, {
        paddingLeft: 2
    }, lY6.default.createElement(U_, {
        dimColor: !0
    }, O)), q[6] = O, q[7] = X;
    else X = q[7];
    let P;
    if (q[8] !== M || q[9] !== X) P = lY6.default.createElement(m, {
        flexDirection: "column",
        gap: 1,
        marginTop: M,
        width: "100%"
    }, D, X), q[8] = M, q[9] = X, q[10] = P;
    else P = q[10];
    return P
}
// @from(Ln 326519, Col 4)
lY6
// @from(Ln 326520, Col 4)
Rx8 = E(() => {
    e6();
    i6();
    ov();
    Rj();
    lY6 = t(P6(), 1)
})
// @from(Ln 326528, Col 0)
function td4(A) {
    let q = A6(3),
        {
            addMargin: K
        } = A,
        z = (K === void 0 ? !1 : K) ? 1 : 0,
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = hx8.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "✻ Thinking…"), q[0] = _;
    else _ = q[0];
    let w;
    if (q[1] !== z) w = hx8.default.createElement(m, {
        marginTop: z
    }, _), q[1] = z, q[2] = w;
    else w = q[2];
    return w
}
// @from(Ln 326547, Col 4)
hx8
// @from(Ln 326548, Col 4)
ed4 = E(() => {
    e6();
    i6();
    hx8 = t(P6(), 1)
})
// @from(Ln 326557, Col 0)
function Ac4(A) {
    let q = A6(14),
        {
            attachment: K,
            verbose: Y
        } = A,
        z = Rq("app:toggleTranscript", "Global", "ctrl+o");
    if (K.files.length === 0) return null;
    let _;
    if (q[0] !== K.files) _ = K.files.reduce(RTY, 0), q[0] = K.files, q[1] = _;
    else _ = q[1];
    let w = _,
        O = K.files.length;
    if (Y) {
        let $;
        if (q[2] !== K.files) $ = K.files.map(yTY), q[2] = K.files, q[3] = $;
        else $ = q[3];
        let H;
        if (q[4] !== $) H = $E.default.createElement(m, {
            flexDirection: "column"
        }, $), q[4] = $, q[5] = H;
        else H = q[5];
        return H
    } else {
        let $;
        if (q[6] !== w) $ = $E.default.createElement(T, {
            bold: !0
        }, w), q[6] = w, q[7] = $;
        else $ = q[7];
        let H = w === 1 ? "issue" : "issues",
            j = O === 1 ? "file" : "files",
            J;
        if (q[8] !== z || q[9] !== O || q[10] !== $ || q[11] !== H || q[12] !== j) J = $E.default.createElement(t1, null, $E.default.createElement(T, {
            dimColor: !0,
            wrap: "wrap"
        }, "Found ", $, " new diagnostic", " ", H, " in ", O, " ", j, " (", z, " to expand)")), q[8] = z, q[9] = O, q[10] = $, q[11] = H, q[12] = j, q[13] = J;
        else J = q[13];
        return J
    }
}
// @from(Ln 326598, Col 0)
function yTY(A, q) {
    return $E.default.createElement($E.default.Fragment, {
        key: q
    }, $E.default.createElement(t1, null, $E.default.createElement(T, {
        dimColor: !0,
        wrap: "wrap"
    }, $E.default.createElement(T, {
        bold: !0
    }, ETY(G1(), A.uri.replace("file://", "").replace("_claude_fs_right:", ""))), " ", $E.default.createElement(T, {
        dimColor: !0
    }, A.uri.startsWith("file://") ? "(file://)" : A.uri.startsWith("_claude_fs_right:") ? "(claude_fs_right)" : `(${A.uri.split(":")[0]})`), ":")), A.diagnostics.map(LTY))
}
// @from(Ln 326611, Col 0)
function LTY(A, q) {
    return $E.default.createElement(t1, {
        key: q
    }, $E.default.createElement(T, {
        dimColor: !0,
        wrap: "wrap"
    }, "  ", Gb.getSeveritySymbol(A.severity), " [Line ", A.range.start.line + 1, ":", A.range.start.character + 1, "] ", A.message, A.code ? ` [${A.code}]` : "", A.source ? ` (${A.source})` : ""))
}
// @from(Ln 326620, Col 0)
function RTY(A, q) {
    return A + q.diagnostics.length
}
// @from(Ln 326623, Col 4)
$E
// @from(Ln 326624, Col 4)
qc4 = E(() => {
    e6();
    i6();
    lA();
    iq();
    iY6();
    Rj();
    $E = t(P6(), 1)
})
// @from(Ln 326638, Col 0)
function Kc4({
    attachment: A,
    addMargin: q,
    verbose: K,
    isTranscriptMode: Y
}) {
    if (E7() && A.type === "teammate_mailbox") {
        let z = A.messages.filter((_) => {
            if (Lf(_.text)) return !1;
            try {
                let w = i1(_.text);
                return w?.type !== "idle_notification" && w?.type !== "teammate_terminated"
            } catch {
                return !0
            }
        });
        if (z.length === 0) return null;
        return V7.default.createElement(m, {
            flexDirection: "column"
        }, z.map((_, w) => {
            let O = null;
            try {
                O = i1(_.text)
            } catch {}
            if (O?.type === "task_assignment") return V7.default.createElement(m, {
                key: w,
                paddingLeft: 2
            }, V7.default.createElement(T, null, I3, " "), V7.default.createElement(T, null, "Task assigned: "), V7.default.createElement(T, {
                bold: !0
            }, "#", O.taskId), V7.default.createElement(T, null, " - ", O.subject), V7.default.createElement(T, {
                dimColor: !0
            }, " (from ", O.assignedBy || _.from, ")"));
            let $ = qN1(_.text, _.from);
            if ($) return V7.default.createElement(V7.default.Fragment, {
                key: w
            }, $);
            let H = G0(_.color),
                j = id4(_.text) ?? _.text;
            return V7.default.createElement(kx8, {
                key: w,
                displayName: _.from,
                inkColor: H,
                content: j,
                summary: _.summary,
                isTranscriptMode: Y
            })
        }))
    }
    switch (A.type) {
        case "directory":
            return V7.default.createElement(jM, null, "Listed directory ", V7.default.createElement(T, {
                bold: !0
            }, A.displayPath + STY));
        case "file":
        case "already_read_file":
            if (A.content.type === "notebook") return V7.default.createElement(jM, null, "Read ", V7.default.createElement(T, {
                bold: !0
            }, A.displayPath), " (", A.content.file.cells.length, " cells)");
            return V7.default.createElement(jM, null, "Read ", V7.default.createElement(T, {
                bold: !0
            }, A.displayPath), " (", A.content.type === "text" ? `${A.content.file.numLines}${A.truncated?"+":""} lines` : xq(A.content.file.originalSize), ")");
        case "compact_file_reference":
            return V7.default.createElement(jM, null, "Referenced file ", V7.default.createElement(T, {
                bold: !0
            }, A.displayPath));
        case "pdf_reference":
            return V7.default.createElement(jM, null, "Referenced PDF ", V7.default.createElement(T, {
                bold: !0
            }, A.displayPath), " (", A.pageCount, " pages)");
        case "selected_lines_in_ide":
            return V7.default.createElement(jM, null, "⧉ Selected", " ", V7.default.createElement(T, {
                bold: !0
            }, A.lineEnd - A.lineStart + 1), " ", "lines from ", V7.default.createElement(T, {
                bold: !0
            }, A.displayPath), " in", " ", A.ideName);
        case "nested_memory":
            return V7.default.createElement(jM, null, "Loaded ", V7.default.createElement(T, {
                bold: !0
            }, A.displayPath));
        case "relevant_memories":
            return V7.default.createElement(m, {
                flexDirection: "column",
                marginTop: q ? 1 : 0
            }, V7.default.createElement(m, {
                flexDirection: "row"
            }, V7.default.createElement(m, {
                minWidth: 2
            }, V7.default.createElement(T, {
                dimColor: !0
            }, I3)), V7.default.createElement(T, null, "Recalled ", V7.default.createElement(T, {
                bold: !0
            }, A.memories.length), " ", A.memories.length === 1 ? "memory" : "memories", !Y && V7.default.createElement(V7.default.Fragment, null, " ", V7.default.createElement(oJ, null)))), (K || Y || !1) && A.memories.map((z) => V7.default.createElement(m, {
                key: z.path,
                flexDirection: "column"
            }, V7.default.createElement(t1, null, V7.default.createElement(T, {
                dimColor: !0
            }, hTY(z.path))), Y && V7.default.createElement(m, {
                paddingLeft: 5
            }, V7.default.createElement(T, null, V7.default.createElement(wK, null, z.content))))));
        case "dynamic_skill": {
            let z = A.skillNames.length;
            return V7.default.createElement(jM, null, "Loaded", " ", V7.default.createElement(T, {
                bold: !0
            }, z, " skill", z !== 1 ? "s" : ""), " ", "from ", V7.default.createElement(T, {
                bold: !0
            }, A.displayPath))
        }
        case "skill_listing": {
            if (A.isInitial) return null;
            return V7.default.createElement(jM, null, V7.default.createElement(T, {
                bold: !0
            }, A.skillCount), " skill", A.skillCount !== 1 ? "s" : "", " available")
        }
        case "queued_command": {
            let z = typeof A.prompt === "string" ? A.prompt : $l(A.prompt) || "",
                _ = A.imagePasteIds && A.imagePasteIds.length > 0;
            return V7.default.createElement(m, {
                flexDirection: "column"
            }, V7.default.createElement(cY6, {
                addMargin: q,
                param: {
                    text: z,
                    type: "text"
                },
                verbose: K,
                isTranscriptMode: Y
            }), _ && A.imagePasteIds?.map((w) => V7.default.createElement(zN1, {
                key: w,
                imageId: w
            })))
        }
        case "plan_file_reference":
            return V7.default.createElement(jM, null, "Plan file referenced (", $K(A.planFilePath), ")");
        case "invoked_skills": {
            if (A.skills.length === 0) return null;
            let z = A.skills.map((_) => _.name).join(", ");
            return V7.default.createElement(jM, null, "Skills restored (", z, ")")
        }
        case "diagnostics":
            return V7.default.createElement(Ac4, {
                attachment: A,
                verbose: K
            });
        case "mcp_resource":
            return V7.default.createElement(jM, null, "Read MCP resource ", V7.default.createElement(T, {
                bold: !0
            }, A.name), " from", " ", A.server);
        case "command_permissions":
            return null;
        case "async_hook_response": {
            if (A.hookEvent === "SessionStart" && !K) return null;
            if (!K && !Y) return null;
            return V7.default.createElement(jM, null, "Async hook ", V7.default.createElement(T, {
                bold: !0
            }, A.hookEvent), " completed")
        }
        case "hook_blocking_error": {
            if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
            let z = A.blockingError.blockingError.trim();
            return V7.default.createElement(V7.default.Fragment, null, V7.default.createElement(jM, {
                color: "error"
            }, A.hookName, " hook returned blocking error"), z ? V7.default.createElement(jM, {
                color: "error"
            }, z) : null)
        }
        case "hook_non_blocking_error": {
            if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
            return V7.default.createElement(jM, {
                color: "error"
            }, A.hookName, " hook error")
        }
        case "hook_error_during_execution":
            if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
            return V7.default.createElement(jM, null, A.hookName, " hook warning");
        case "hook_success":
            return null;
        case "hook_stopped_continuation":
            if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
            return V7.default.createElement(jM, {
                color: "warning"
            }, A.hookName, " hook stopped continuation: ", A.message);
        case "hook_system_message":
            return V7.default.createElement(jM, null, A.hookName, " says: ", A.content);
        case "hook_permission_decision": {
            let z = A.decision === "allow" ? "Allowed" : "Denied";
            return V7.default.createElement(jM, null, z, " by ", V7.default.createElement(T, {
                bold: !0
            }, A.hookEvent), " hook")
        }
        case "task_status":
            return V7.default.createElement(CTY, {
                attachment: A
            });
        case "teammate_shutdown_batch":
            return V7.default.createElement(m, {
                flexDirection: "row",
                width: "100%",
                marginTop: 1
            }, V7.default.createElement(T, {
                dimColor: !0
            }, I3, " "), V7.default.createElement(T, {
                dimColor: !0
            }, A.count, " teammate", A.count === 1 ? "" : "s", " shut down gracefully"));
        case "agent_mention":
        case "budget_usd":
        case "critical_system_reminder":
        case "edited_image_file":
        case "edited_text_file":
        case "hook_additional_context":
        case "hook_cancelled":
        case "opened_file_in_ide":
        case "output_style":
        case "plan_mode":
        case "plan_mode_exit":
        case "plan_mode_reentry":
        case "structured_output":
        case "team_context":
        case "todo_reminder":
        case "ultramemory":
        case "context_efficiency":
        case "deferred_tools_delta":
        case "mcp_instructions_delta":
        case "token_usage":
        case "ultrathink_effort":
            return null
    }
}
// @from(Ln 326866, Col 0)
function CTY(A) {
    let q = A6(4),
        {
            attachment: K
        } = A;
    if (e2() && K.status === "killed") return null;
    if (E7() && K.taskType === "in_process_teammate") {
        let z;
        if (q[0] !== K) z = V7.default.createElement(ITY, {
            attachment: K
        }), q[0] = K, q[1] = z;
        else z = q[1];
        return z
    }
    let Y;
    if (q[2] !== K) Y = V7.default.createElement(Yc4, {
        attachment: K
    }), q[2] = K, q[3] = Y;
    else Y = q[3];
    return Y
}
// @from(Ln 326888, Col 0)
function Yc4(A) {
    let q = A6(6),
        {
            attachment: K
        } = A,
        Y = K.status === "completed" ? "completed in background" : K.status === "killed" ? "stopped" : K.status,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = V7.default.createElement(T, {
        dimColor: !0
    }, I3, " "), q[0] = z;
    else z = q[0];
    let _;
    if (q[1] !== K.description) _ = V7.default.createElement(T, {
        bold: !0
    }, K.description), q[1] = K.description, q[2] = _;
    else _ = q[2];
    let w;
    if (q[3] !== Y || q[4] !== _) w = V7.default.createElement(m, {
        flexDirection: "row",
        width: "100%",
        marginTop: 1
    }, z, V7.default.createElement(T, {
        dimColor: !0
    }, 'Task "', _, '" ', Y)), q[3] = Y, q[4] = _, q[5] = w;
    else w = q[5];
    return w
}
// @from(Ln 326916, Col 0)
function ITY(A) {
    let q = A6(13),
        {
            attachment: K
        } = A,
        Y;
    if (q[0] !== K.taskId) Y = (J) => J.tasks[K.taskId], q[0] = K.taskId, q[1] = Y;
    else Y = q[1];
    let z = M1(Y);
    if (z?.type !== "in_process_teammate") {
        let J;
        if (q[2] !== K) J = V7.default.createElement(Yc4, {
            attachment: K
        }), q[2] = K, q[3] = J;
        else J = q[3];
        return J
    }
    let _;
    if (q[4] !== z.identity.color) _ = G0(z.identity.color), q[4] = z.identity.color, q[5] = _;
    else _ = q[5];
    let w = _,
        O = K.status === "completed" ? "shut down gracefully" : K.status,
        $;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) $ = V7.default.createElement(T, {
        dimColor: !0
    }, I3, " "), q[6] = $;
    else $ = q[6];
    let H;
    if (q[7] !== w || q[8] !== z.identity.agentName) H = V7.default.createElement(T, {
        color: w,
        bold: !0,
        dimColor: !1
    }, "@", z.identity.agentName), q[7] = w, q[8] = z.identity.agentName, q[9] = H;
    else H = q[9];
    let j;
    if (q[10] !== O || q[11] !== H) j = V7.default.createElement(m, {
        flexDirection: "row",
        width: "100%",
        marginTop: 1
    }, $, V7.default.createElement(T, {
        dimColor: !0
    }, "Teammate", " ", H, " ", O)), q[10] = O, q[11] = H, q[12] = j;
    else j = q[12];
    return j
}
// @from(Ln 326962, Col 0)
function jM(A) {
    let q = A6(4),
        {
            dimColor: K,
            children: Y,
            color: z
        } = A,
        _ = K === void 0 ? !0 : K,
        w;
    if (q[0] !== Y || q[1] !== z || q[2] !== _) w = V7.default.createElement(t1, null, V7.default.createElement(T, {
        color: z,
        dimColor: _,
        wrap: "wrap"
    }, Y)), q[0] = Y, q[1] = z, q[2] = _, q[3] = w;
    else w = q[3];
    return w
}
// @from(Ln 326979, Col 4)
V7
// @from(Ln 326980, Col 4)
zc4 = E(() => {
    e6();
    i6();
    NA();
    Z7();
    iq();
    YN1();
    qc4();
    JA();
    Lx8();
    kc();
    g1();
    Qz();
    Fv();
    Vx8();
    qw();
    Ex8();
    qH();
    GR();
    V7 = t(P6(), 1)
})
// @from(Ln 327002, Col 0)
function Oc4(A) {
    let q = A6(33),
        {
            message: K,
            verbose: Y
        } = A,
        {
            retryAttempt: z,
            error: _,
            retryInMs: w,
            maxRetries: O
        } = K,
        $ = z < 4,
        [H, j] = wc4.useState(0),
        J = H >= w,
        M;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) M = () => j(bTY), q[0] = M;
    else M = q[0];
    if (OX(M, $ || J ? null : 1000), $) return null;
    let D;
    if (q[1] !== H || q[2] !== w) D = Math.round((w - H) / 1000), q[1] = H, q[2] = w, q[3] = D;
    else D = q[3];
    let X = Math.max(0, D),
        P, W, Z, G, f, v, N;
    if (q[4] !== _ || q[5] !== Y) {
        let g = i06(_);
        N = !Y && g.length > _c4, Z = t1, W = m, v = "column", P = T, G = "error", f = N ? g.slice(0, _c4) + "…" : g, q[4] = _, q[5] = Y, q[6] = P, q[7] = W, q[8] = Z, q[9] = G, q[10] = f, q[11] = v, q[12] = N
    } else P = q[6], W = q[7], Z = q[8], G = q[9], f = q[10], v = q[11], N = q[12];
    let V;
    if (q[13] !== P || q[14] !== G || q[15] !== f) V = fb.createElement(P, {
        color: G
    }, f), q[13] = P, q[14] = G, q[15] = f, q[16] = V;
    else V = q[16];
    let L;
    if (q[17] !== N) L = N && fb.createElement(oJ, null), q[17] = N, q[18] = L;
    else L = q[18];
    let h = X === 1 ? "second" : "seconds",
        R;
    if (q[19] !== O || q[20] !== z || q[21] !== X || q[22] !== h) R = fb.createElement(T, {
        dimColor: !0
    }, "Retrying in ", X, " ", h, "… (attempt", " ", z, "/", O, ")", process.env.API_TIMEOUT_MS ? ` · API_TIMEOUT_MS=${process.env.API_TIMEOUT_MS}ms, try increasing it` : ""), q[19] = O, q[20] = z, q[21] = X, q[22] = h, q[23] = R;
    else R = q[23];
    let u;
    if (q[24] !== W || q[25] !== R || q[26] !== v || q[27] !== V || q[28] !== L) u = fb.createElement(W, {
        flexDirection: v
    }, V, L, R), q[24] = W, q[25] = R, q[26] = v, q[27] = V, q[28] = L, q[29] = u;
    else u = q[29];
    let I;
    if (q[30] !== Z || q[31] !== u) I = fb.createElement(Z, null, u), q[30] = Z, q[31] = u, q[32] = I;
    else I = q[32];
    return I
}
// @from(Ln 327055, Col 0)
function bTY(A) {
    return A + 1000
}
// @from(Ln 327058, Col 4)
fb
// @from(Ln 327058, Col 8)
wc4
// @from(Ln 327058, Col 13)
_c4 = 1000
// @from(Ln 327059, Col 4)
$c4 = E(() => {
    e6();
    iq();
    i6();
    uv();
    Pv();
    GR();
    fb = t(P6(), 1), wc4 = t(P6(), 1)
})
// @from(Ln 327069, Col 0)
function Hc4(A) {
    let q = A6(24),
        {
            message: K,
            addMargin: Y,
            verbose: z,
            isTranscriptMode: _
        } = A;
    if (K.subtype === "turn_duration") {
        let M;
        if (q[0] !== Y || q[1] !== K) M = D7.createElement(FTY, {
            message: K,
            addMargin: Y
        }), q[0] = Y, q[1] = K, q[2] = M;
        else M = q[2];
        return M
    }
    if (K.subtype === "agents_killed") {
        let M = Y ? 1 : 0,
            D, X;
        if (q[3] === Symbol.for("react.memo_cache_sentinel")) D = D7.createElement(m, {
            minWidth: 2
        }, D7.createElement(T, {
            color: "error"
        }, I3)), X = D7.createElement(T, {
            dimColor: !0
        }, "All background agents killed"), q[3] = D, q[4] = X;
        else D = q[3], X = q[4];
        let P;
        if (q[5] !== M) P = D7.createElement(m, {
            flexDirection: "row",
            marginTop: M,
            width: "100%"
        }, D, X), q[5] = M, q[6] = P;
        else P = q[6];
        return P
    }
    if (K.subtype === "thinking") return null;
    if (K.subtype === "bridge_status") {
        let M;
        if (q[7] !== Y || q[8] !== K) M = D7.createElement(UTY, {
            message: K,
            addMargin: Y
        }), q[7] = Y, q[8] = K, q[9] = M;
        else M = q[9];
        return M
    }
    if (K.subtype !== "stop_hook_summary" && !z && K.level === "info") return null;
    if (K.subtype === "api_error") {
        let M;
        if (q[10] !== K || q[11] !== z) M = D7.createElement(Oc4, {
            message: K,
            verbose: z
        }), q[10] = K, q[11] = z, q[12] = M;
        else M = q[12];
        return M
    }
    if (K.subtype === "stop_hook_summary") {
        let M;
        if (q[13] !== Y || q[14] !== _ || q[15] !== K || q[16] !== z) M = D7.createElement(xTY, {
            message: K,
            addMargin: Y,
            verbose: z,
            isTranscriptMode: _
        }), q[13] = Y, q[14] = _, q[15] = K, q[16] = z, q[17] = M;
        else M = q[17];
        return M
    }
    let O = K.content;
    if (typeof O !== "string") return null;
    let $ = K.level !== "info",
        H = K.level === "warning" ? "warning" : void 0,
        j = K.level === "info",
        J;
    if (q[18] !== Y || q[19] !== O || q[20] !== $ || q[21] !== H || q[22] !== j) J = D7.createElement(m, {
        flexDirection: "row",
        width: "100%"
    }, D7.createElement(gTY, {
        content: O,
        addMargin: Y,
        dot: $,
        color: H,
        dimColor: j
    })), q[18] = Y, q[19] = O, q[20] = $, q[21] = H, q[22] = j, q[23] = J;
    else J = q[23];
    return J
}
// @from(Ln 327157, Col 0)
function xTY(A) {
    let q = A6(46),
        {
            message: K,
            addMargin: Y,
            verbose: z,
            isTranscriptMode: _
        } = A,
        {
            hookCount: w,
            hookInfos: O,
            hookErrors: $,
            preventedContinuation: H,
            stopReason: j
        } = K,
        {
            columns: J
        } = KA(),
        M;
    if (q[0] !== O || q[1] !== K.totalDurationMs) M = K.totalDurationMs ?? O.reduce(BTY, 0), q[0] = O, q[1] = K.totalDurationMs, q[2] = M;
    else M = q[2];
    let D = M;
    if ($.length === 0 && !H && !K.hookLabel) return null;
    let X;
    if (q[3] !== D) X = "", q[3] = D, q[4] = X;
    else X = q[4];
    let P = X;
    if (K.hookLabel) {
        let B = w === 1 ? "hook" : "hooks",
            b;
        if (q[5] !== w || q[6] !== K.hookLabel || q[7] !== B || q[8] !== P) b = D7.createElement(T, {
            dimColor: !0
        }, "  ⎿  ", "Ran ", w, " ", K.hookLabel, " ", B, P), q[5] = w, q[6] = K.hookLabel, q[7] = B, q[8] = P, q[9] = b;
        else b = q[9];
        let p;
        if (q[10] !== O || q[11] !== _) p = _ && O.map(mTY), q[10] = O, q[11] = _, q[12] = p;
        else p = q[12];
        let Q;
        if (q[13] !== b || q[14] !== p) Q = D7.createElement(m, {
            flexDirection: "column",
            width: "100%"
        }, b, p), q[13] = b, q[14] = p, q[15] = Q;
        else Q = q[15];
        return Q
    }
    let W = Y ? 1 : 0,
        Z;
    if (q[16] === Symbol.for("react.memo_cache_sentinel")) Z = D7.createElement(m, {
        minWidth: 2
    }, D7.createElement(T, null, I3)), q[16] = Z;
    else Z = q[16];
    let G = J - 10,
        f;
    if (q[17] !== w) f = D7.createElement(T, {
        bold: !0
    }, w), q[17] = w, q[18] = f;
    else f = q[18];
    let v = K.hookLabel ?? "stop",
        N = w === 1 ? "hook" : "hooks",
        V;
    if (q[19] !== O || q[20] !== z) V = !z && O.length > 0 && D7.createElement(D7.Fragment, null, " ", D7.createElement(oJ, null)), q[19] = O, q[20] = z, q[21] = V;
    else V = q[21];
    let L;
    if (q[22] !== f || q[23] !== v || q[24] !== N || q[25] !== V || q[26] !== P) L = D7.createElement(T, null, "Ran ", f, " ", v, " ", N, P, V), q[22] = f, q[23] = v, q[24] = N, q[25] = V, q[26] = P, q[27] = L;
    else L = q[27];
    let h;
    if (q[28] !== O || q[29] !== z) h = z && O.length > 0 && O.map(uTY), q[28] = O, q[29] = z, q[30] = h;
    else h = q[30];
    let R;
    if (q[31] !== H || q[32] !== j) R = H && j && D7.createElement(T, null, "⎿  ", j), q[31] = H, q[32] = j, q[33] = R;
    else R = q[33];
    let u;
    if (q[34] !== $ || q[35] !== K.hookLabel) u = $.length > 0 && $.map((B, b) => D7.createElement(T, {
        key: b
    }, "⎿  ", K.hookLabel ?? "Stop", " hook error: ", B)), q[34] = $, q[35] = K.hookLabel, q[36] = u;
    else u = q[36];
    let I;
    if (q[37] !== L || q[38] !== h || q[39] !== R || q[40] !== u || q[41] !== G) I = D7.createElement(m, {
        flexDirection: "column",
        width: G
    }, L, h, R, u), q[37] = L, q[38] = h, q[39] = R, q[40] = u, q[41] = G, q[42] = I;
    else I = q[42];
    let g;
    if (q[43] !== I || q[44] !== W) g = D7.createElement(m, {
        flexDirection: "row",
        marginTop: W,
        width: "100%"
    }, Z, I), q[43] = I, q[44] = W, q[45] = g;
    else g = q[45];
    return g
}
// @from(Ln 327249, Col 0)
function uTY(A, q) {
    return D7.createElement(T, {
        key: `cmd-${q}`,
        dimColor: !0
    }, "⎿  ", A.command === "prompt" ? `prompt: ${A.promptText||""}` : A.command, "")
}
// @from(Ln 327256, Col 0)
function mTY(A, q) {
    return D7.createElement(T, {
        key: `cmd-${q}`,
        dimColor: !0
    }, "     ⎿ ", A.command === "prompt" ? `prompt: ${A.promptText||""}` : A.command, "")
}
// @from(Ln 327263, Col 0)
function BTY(A, q) {
    return A + (q.durationMs ?? 0)
}
// @from(Ln 327267, Col 0)
function gTY(A) {
    let q = A6(17),
        {
            content: K,
            addMargin: Y,
            dot: z,
            color: _,
            dimColor: w
        } = A,
        {
            columns: O
        } = KA(),
        $ = Y ? 1 : 0,
        H;
    if (q[0] !== _ || q[1] !== w || q[2] !== z) H = z && D7.createElement(m, {
        minWidth: 2
    }, D7.createElement(T, {
        color: _,
        dimColor: w
    }, I3)), q[0] = _, q[1] = w, q[2] = z, q[3] = H;
    else H = q[3];
    let j = O - 10,
        J;
    if (q[4] !== K) J = K.trim(), q[4] = K, q[5] = J;
    else J = q[5];
    let M;
    if (q[6] !== _ || q[7] !== w || q[8] !== J) M = D7.createElement(T, {
        color: _,
        dimColor: w,
        wrap: "wrap"
    }, J), q[6] = _, q[7] = w, q[8] = J, q[9] = M;
    else M = q[9];
    let D;
    if (q[10] !== j || q[11] !== M) D = D7.createElement(m, {
        flexDirection: "column",
        width: j
    }, M), q[10] = j, q[11] = M, q[12] = D;
    else D = q[12];
    let X;
    if (q[13] !== $ || q[14] !== H || q[15] !== D) X = D7.createElement(m, {
        flexDirection: "row",
        marginTop: $,
        width: "100%"
    }, H, D), q[13] = $, q[14] = H, q[15] = D, q[16] = X;
    else X = q[16];
    return X
}
// @from(Ln 327315, Col 0)
function FTY(A) {
    let q = A6(18),
        {
            message: K,
            addMargin: Y
        } = A,
        [z] = Sx8.useState(QTY),
        _ = S5(),
        w;
    if (q[0] !== _) w = () => {
        let N = _.getState().tasks,
            V = Object.values(N ?? {}).filter(ij);
        if (V.length === 0) return null;
        let L = V.filter(pTY).length,
            h = V.length - L,
            R = [];
        if (h > 0) R.push(`${h} background ${h===1?"task":"tasks"}`);
        if (L > 0) R.push(`${L} ${L===1?"monitor":"monitors"}`);
        return R.join(", ")
    }, q[0] = _, q[1] = w;
    else w = q[1];
    let [O] = Sx8.useState(w), $;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) $ = X1().showTurnDuration ?? !0, q[2] = $;
    else $ = q[2];
    let H = $,
        j;
    if (q[3] !== K.durationMs) j = UK(K.durationMs), q[3] = K.durationMs, q[4] = j;
    else j = q[4];
    let J = j,
        M = K.budgetLimit !== void 0,
        D;
    A: {
        if (!M) {
            D = "";
            break A
        }
        let {
            budgetTokens: N,
            budgetLimit: V
        } = K,
        L;
        if (q[5] !== V || q[6] !== N) L = N >= V ? `${fq(N)} used (${fq(V)} min ${a6.tick})` : `${fq(N)} / ${fq(V)} (${Math.round(N/V*100)}%)`,
        q[5] = V,
        q[6] = N,
        q[7] = L;
        else L = q[7];
        let h = L,
            R = K.budgetNudges > 0 ? ` · ${K.budgetNudges} ${K.budgetNudges===1?"nudge":"nudges"}` : "";D = `${H?" · ":""}${h}${R}`
    }
    let X = D;
    if (!H && !M) return null;
    let P = Y ? 1 : 0,
        W;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) W = D7.createElement(m, {
        minWidth: 2
    }, D7.createElement(T, {
        dimColor: !0
    }, Me)), q[8] = W;
    else W = q[8];
    let Z = H && `${z} for ${J}`,
        G;
    if (q[9] !== O) G = O && D7.createElement(D7.Fragment, null, ` · ${O} still running `, D7.createElement(a1, {
        shortcut: "↓",
        action: "manage",
        parens: !0
    })), q[9] = O, q[10] = G;
    else G = q[10];
    let f;
    if (q[11] !== X || q[12] !== Z || q[13] !== G) f = D7.createElement(T, {
        dimColor: !0
    }, Z, X, G), q[11] = X, q[12] = Z, q[13] = G, q[14] = f;
    else f = q[14];
    let v;
    if (q[15] !== P || q[16] !== f) v = D7.createElement(m, {
        flexDirection: "row",
        marginTop: P,
        width: "100%"
    }, W, f), q[15] = P, q[16] = f, q[17] = v;
    else v = q[17];
    return v
}
// @from(Ln 327397, Col 0)
function pTY(A) {
    return A.type === "local_bash" && A.kind === "monitor"
}
// @from(Ln 327401, Col 0)
function QTY() {
    return YM(uZ6) ?? "Worked"
}
// @from(Ln 327405, Col 0)
function UTY(A) {
    let q = A6(7),
        {
            message: K,
            addMargin: Y
        } = A,
        z = Y ? 1 : 0,
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = D7.createElement(m, {
        minWidth: 2
    }), q[0] = _;
    else _ = q[0];
    let w;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) w = D7.createElement(T, null, D7.createElement(T, {
        color: "suggestion"
    }, "/remote-control"), " is active. Code in CLI or at"), q[1] = w;
    else w = q[1];
    let O;
    if (q[2] !== K.url) O = D7.createElement(m, {
        flexDirection: "column"
    }, w, D7.createElement(y7, {
        url: K.url
    }, K.url)), q[2] = K.url, q[3] = O;
    else O = q[3];
    let $;
    if (q[4] !== z || q[5] !== O) $ = D7.createElement(m, {
        flexDirection: "row",
        marginTop: z,
        width: 999
    }, _, O), q[4] = z, q[5] = O, q[6] = $;
    else $ = q[6];
    return $
}
// @from(Ln 327438, Col 4)
D7
// @from(Ln 327438, Col 8)
Sx8
// @from(Ln 327439, Col 4)
jc4 = E(() => {
    e6();
    i6();
    Nc();
    qw();
    b7();
    IZ1();
    _q();
    $c4();
    M4();
    k8();
    IK6();
    RX6();
    GR();
    NA();
    Lq();
    D7 = t(P6(), 1), Sx8 = t(P6(), 1)
})
// @from(Ln 327458, Col 0)
function Jc4() {
    let A = A6(2),
        q = Rq("app:toggleTranscript", "Global", "ctrl+o"),
        K;
    if (A[0] !== q) K = Sc6.createElement(m, {
        marginY: 1
    }, Sc6.createElement(T, {
        dimColor: !0
    }, "✻ Conversation compacted (", q, " for history)")), A[0] = q, A[1] = K;
    else K = A[1];
    return K
}
// @from(Ln 327470, Col 4)
Sc6
// @from(Ln 327471, Col 4)
Mc4 = E(() => {
    e6();
    i6();
    Rj();
    Sc6 = t(P6(), 1)
})
// @from(Ln 327477, Col 4)
Tb = E(() => {
    T1();
    H1();
    A8()
})
// @from(Ln 327483, Col 0)
function Dc4({
    message: A,
    tools: q,
    lookups: K,
    inProgressToolUseIDs: Y,
    shouldAnimate: z
}) {
    let _ = dK(q, A.toolName);
    if (!_?.renderGroupedToolUse) return null;
    let w = new Map;
    for (let H of A.results)
        for (let j of H.message.content)
            if (j.type === "tool_result") w.set(j.tool_use_id, {
                param: j,
                output: H.toolUseResult
            });
    let O = A.messages.map((H) => {
            let j = H.message.content[0],
                J = w.get(j.id);
            return {
                param: j,
                isResolved: K.resolvedToolUseIDs.has(j.id),
                isError: K.erroredToolUseIDs.has(j.id),
                isInProgress: Y.has(j.id),
                progressMessages: ia(K.progressMessagesByToolUseID.get(j.id) ?? []),
                result: J
            }
        }),
        $ = O.some((H) => H.isInProgress);
    return _.renderGroupedToolUse(O, {
        shouldAnimate: z && $,
        tools: q
    })
}
// @from(Ln 327517, Col 4)
Xc4 = () => {}
// @from(Ln 327518, Col 4)
Pc4 = {}
// @from(Ln 327524, Col 0)
function dTY(A) {
    return (A.teamMemorySearchCount ?? 0) > 0 || (A.teamMemoryReadCount ?? 0) > 0 || (A.teamMemoryWriteCount ?? 0) > 0
}
// @from(Ln 327528, Col 0)
function cTY(A) {
    let q = A6(23),
        {
            message: K,
            isActiveGroup: Y,
            hasPrecedingParts: z
        } = A,
        _ = K.teamMemoryReadCount ?? 0,
        w = K.teamMemorySearchCount ?? 0,
        O = K.teamMemoryWriteCount ?? 0;
    if (_ === 0 && w === 0 && O === 0) return null;
    let $;
    if (q[0] !== z || q[1] !== Y || q[2] !== _ || q[3] !== w || q[4] !== O) {
        let H = [],
            j = z ? 1 : 0;
        if (_ > 0) {
            let J = Y ? j === 0 ? "Recalling" : "recalling" : j === 0 ? "Recalled" : "recalled";
            if (j > 0) {
                let P;
                if (q[6] === Symbol.for("react.memo_cache_sentinel")) P = vb.default.createElement(T, {
                    key: "comma-tmr"
                }, ", "), q[6] = P;
                else P = q[6];
                H.push(P)
            }
            let M;
            if (q[7] !== _) M = vb.default.createElement(T, {
                bold: !0
            }, _), q[7] = _, q[8] = M;
            else M = q[8];
            let D = _ === 1 ? "memory" : "memories",
                X;
            if (q[9] !== M || q[10] !== D || q[11] !== J) X = vb.default.createElement(T, {
                key: "team-mem-read"
            }, J, " ", M, " team", " ", D), q[9] = M, q[10] = D, q[11] = J, q[12] = X;
            else X = q[12];
            H.push(X), j++
        }
        if (w > 0) {
            let J = Y ? j === 0 ? "Searching" : "searching" : j === 0 ? "Searched" : "searched";
            if (j > 0) {
                let X;
                if (q[13] === Symbol.for("react.memo_cache_sentinel")) X = vb.default.createElement(T, {
                    key: "comma-tms"
                }, ", "), q[13] = X;
                else X = q[13];
                H.push(X)
            }
            let M = `${J} team memories`,
                D;
            if (q[14] !== M) D = vb.default.createElement(T, {
                key: "team-mem-search"
            }, M), q[14] = M, q[15] = D;
            else D = q[15];
            H.push(D), j++
        }
        if (O > 0) {
            let J = Y ? j === 0 ? "Writing" : "writing" : j === 0 ? "Wrote" : "wrote";
            if (j > 0) {
                let P;
                if (q[16] === Symbol.for("react.memo_cache_sentinel")) P = vb.default.createElement(T, {
                    key: "comma-tmw"
                }, ", "), q[16] = P;
                else P = q[16];
                H.push(P)
            }
            let M;
            if (q[17] !== O) M = vb.default.createElement(T, {
                bold: !0
            }, O), q[17] = O, q[18] = M;
            else M = q[18];
            let D = O === 1 ? "memory" : "memories",
                X;
            if (q[19] !== M || q[20] !== D || q[21] !== J) X = vb.default.createElement(T, {
                key: "team-mem-write"
            }, J, " ", M, " team", " ", D), q[19] = M, q[20] = D, q[21] = J, q[22] = X;
            else X = q[22];
            H.push(X)
        }
        $ = vb.default.createElement(vb.default.Fragment, null, H), q[0] = z, q[1] = Y, q[2] = _, q[3] = w, q[4] = O, q[5] = $
    } else $ = q[5];
    return $
}
// @from(Ln 327611, Col 4)
vb
// @from(Ln 327612, Col 4)
Wc4 = E(() => {
    e6();
    i6();
    vb = t(P6(), 1)
})
// @from(Ln 327618, Col 0)
function lTY(A) {
    let q = A6(23),
        {
            content: K,
            tools: Y,
            lookups: z,
            inProgressToolUseIDs: _,
            shouldAnimate: w,
            theme: O
        } = A,
        $, H;
    if (q[0] !== K.id || q[1] !== K.input || q[2] !== K.name || q[3] !== _ || q[4] !== z || q[5] !== w || q[6] !== O || q[7] !== Y) {
        H = Symbol.for("react.early_return_sentinel");
        A: {
            let j = dK(Y, K.name);
            if (!j) {
                H = null;
                break A
            }
            let J;
            if (q[10] !== K.id || q[11] !== z.resolvedToolUseIDs) J = z.resolvedToolUseIDs.has(K.id),
            q[10] = K.id,
            q[11] = z.resolvedToolUseIDs,
            q[12] = J;
            else J = q[12];
            let M = J,
                D;
            if (q[13] !== K.id || q[14] !== z.erroredToolUseIDs) D = z.erroredToolUseIDs.has(K.id),
            q[13] = K.id,
            q[14] = z.erroredToolUseIDs,
            q[15] = D;
            else D = q[15];
            let X = D,
                P;
            if (q[16] !== K.id || q[17] !== _) P = _.has(K.id),
            q[16] = K.id,
            q[17] = _,
            q[18] = P;
            else P = q[18];
            let W = P,
                Z = z.toolResultByToolUseID.get(K.id),
                G = Z?.type === "user" ? Z.toolUseResult : void 0,
                f = j.outputSchema?.safeParse(G),
                v = f?.success ? f.data : void 0,
                N = j.inputSchema.safeParse(K.input),
                V = N.success ? N.data : void 0,
                L = j.userFacingName(V),
                h = V ? j.renderToolUseMessage(V, {
                    theme: O,
                    verbose: !1
                }) : null,
                R = w && W,
                u = !M,
                I;
            if (q[19] !== X || q[20] !== R || q[21] !== u) I = u3.default.createElement(S96, {
                shouldAnimate: R,
                isUnresolved: u,
                isError: X
            }),
            q[19] = X,
            q[20] = R,
            q[21] = u,
            q[22] = I;
            else I = q[22];$ = u3.default.createElement(m, {
                key: K.id,
                flexDirection: "column",
                marginTop: 1
            }, u3.default.createElement(m, {
                flexDirection: "row"
            }, I, u3.default.createElement(T, {
                bold: !0
            }, L), h && u3.default.createElement(T, null, "(", h, ")"), V && j.renderToolUseTag?.(V)), M && !X && v !== void 0 && u3.default.createElement(m, null, j.renderToolResultMessage(v, [], {
                verbose: !1,
                tools: Y,
                theme: O
            })))
        }
        q[0] = K.id, q[1] = K.input, q[2] = K.name, q[3] = _, q[4] = z, q[5] = w, q[6] = O, q[7] = Y, q[8] = $, q[9] = H
    } else $ = q[8], H = q[9];
    if (H !== Symbol.for("react.early_return_sentinel")) return H;
    return $
}
// @from(Ln 327701, Col 0)
function fc4({
    message: A,
    inProgressToolUseIDs: q,
    shouldAnimate: K,
    verbose: Y,
    tools: z,
    lookups: _,
    isActiveGroup: w
}) {
    let {
        searchCount: O,
        readCount: $,
        replCount: H,
        memorySearchCount: j,
        memoryReadCount: J,
        memoryWriteCount: M,
        messages: D
    } = A, [X] = z7(), {
        columns: P
    } = KA(), W = IW6(A).some((b) => _.erroredToolUseIDs.has(b)), Z = j > 0 || J > 0 || M > 0, G = Gc4.checkHasTeamMemOps(A), f = u3.useRef(0), v = u3.useRef(0);
    f.current = Math.max(f.current, $), v.current = Math.max(v.current, O);
    let N = f.current,
        V = v.current,
        L = V > 0 || N > 0 || H > 0,
        h = A.readFilePaths,
        R = A.searchArgs,
        u = A.latestDisplayHint;
    if (u === void 0) {
        let b = R?.[R.length - 1],
            p = b !== void 0 ? `"${b}"` : void 0,
            Q = h?.[h.length - 1];
        u = Q !== void 0 ? $K(Q) : p
    }
    if (Y) {
        let b = [];
        for (let p of D)
            if (p.type === "assistant") b.push(p);
            else if (p.type === "grouped_tool_use") b.push(...p.messages);
        return u3.default.createElement(m, {
            flexDirection: "column"
        }, b.map((p) => {
            let Q = p.message.content[0];
            if (Q?.type !== "tool_use") return null;
            return u3.default.createElement(lTY, {
                key: Q.id,
                content: Q,
                tools: z,
                lookups: _,
                inProgressToolUseIDs: q,
                shouldAnimate: K,
                theme: X
            })
        }), A.hookInfos && A.hookInfos.length > 0 && u3.default.createElement(u3.default.Fragment, null, u3.default.createElement(T, {
            dimColor: !0
        }, "  ⎿  ", "Ran ", A.hookCount, " PreToolUse", " ", A.hookCount === 1 ? "hook" : "hooks", " (", ((A.hookTotalMs ?? 0) / 1000).toFixed(1), "s)"), A.hookInfos.map((p, Q) => u3.default.createElement(T, {
            key: `hook-${Q}`,
            dimColor: !0
        }, "     ⎿ ", p.command, " (", ((p.durationMs ?? 0) / 1000).toFixed(1), "s)"))))
    }
    if (!Z && !G && !L) return null;
    let I = [];
    if (J > 0) {
        let b = w ? I.length === 0 ? "Recalling" : "recalling" : I.length === 0 ? "Recalled" : "recalled";
        I.push(u3.default.createElement(T, {
            key: "mem-read"
        }, b, " ", u3.default.createElement(T, {
            bold: !0
        }, J), " ", J === 1 ? "memory" : "memories"))
    }
    if (j > 0) {
        let b = w ? I.length === 0 ? "Searching" : "searching" : I.length === 0 ? "Searched" : "searched";
        if (I.length > 0) I.push(u3.default.createElement(T, {
            key: "comma-ms"
        }, ", "));
        I.push(u3.default.createElement(T, {
            key: "mem-search"
        }, `${b} memories`))
    }
    if (M > 0) {
        let b = w ? I.length === 0 ? "Writing" : "writing" : I.length === 0 ? "Wrote" : "wrote";
        if (I.length > 0) I.push(u3.default.createElement(T, {
            key: "comma-mw"
        }, ", "));
        I.push(u3.default.createElement(T, {
            key: "mem-write"
        }, b, " ", u3.default.createElement(T, {
            bold: !0
        }, M), " ", M === 1 ? "memory" : "memories"))
    }
    let g = Z || G,
        B = [];
    if (V > 0) {
        let b = !g && B.length === 0,
            p = w ? b ? "Searching for" : "searching for" : b ? "Searched for" : "searched for";
        if (g || B.length > 0) B.push(u3.default.createElement(T, {
            key: "comma-s"
        }, ", "));
        B.push(u3.default.createElement(T, {
            key: "search"
        }, p, " ", u3.default.createElement(T, {
            bold: !0
        }, V), " ", V === 1 ? "pattern" : "patterns"))
    }
    if (N > 0) {
        let b = !g && B.length === 0,
            p = w ? b ? "Reading" : "reading" : b ? "Read" : "read";
        if (g || B.length > 0) B.push(u3.default.createElement(T, {
            key: "comma-r"
        }, ", "));
        B.push(u3.default.createElement(T, {
            key: "read"
        }, p, " ", u3.default.createElement(T, {
            bold: !0
        }, N), " ", N === 1 ? "file" : "files"))
    }
    if (H > 0) {
        let b = w ? "REPL'ing" : "REPL'd";
        if (g || B.length > 0) B.push(u3.default.createElement(T, {
            key: "comma-repl"
        }, ", "));
        B.push(u3.default.createElement(T, {
            key: "repl"
        }, b, " ", u3.default.createElement(T, {
            bold: !0
        }, H), " ", H === 1 ? "time" : "times"))
    }
    return u3.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, u3.default.createElement(m, {
        flexDirection: "row"
    }, u3.default.createElement(S96, {
        shouldAnimate: !!w,
        isUnresolved: !!w,
        isError: W
    }), u3.default.createElement(T, null, I, Gc4.TeamMemCountParts({
        message: A,
        isActiveGroup: w,
        hasPrecedingParts: I.length > 0
    }), B, w && u3.default.createElement(T, {
        key: "ellipsis"
    }, "…"), " ", u3.default.createElement(oJ, null))), w && u !== void 0 && u3.default.createElement(T, {
        dimColor: !0
    }, "  ⎿  ", VJ6(u, P - 6)), A.hookTotalMs !== void 0 && A.hookTotalMs > 0 && u3.default.createElement(T, {
        dimColor: !0
    }, "  ⎿  ", "Ran ", A.hookCount, " PreToolUse", " ", A.hookCount === 1 ? "hook" : "hooks", " (", (A.hookTotalMs / 1000).toFixed(1), "s)"))
}
// @from(Ln 327848, Col 4)
u3
// @from(Ln 327848, Col 8)
Gc4
// @from(Ln 327849, Col 4)
Tc4 = E(() => {
    e6();
    i6();
    XZ1();
    GR();
    gB();
    Z7();
    M4();
    _q();
    u3 = t(P6(), 1), Gc4 = (Wc4(), k4(Pc4))
})
// @from(Ln 327861, Col 0)
function vc4(A) {
    let q = A6(24),
        {
            message: K,
            screen: Y
        } = A,
        z = Y === "transcript",
        _;
    if (q[0] !== K) _ = Fg(K) || "", q[0] = K, q[1] = _;
    else _ = q[1];
    let w = _,
        O = K.summarizeMetadata;
    if (O) {
        let D;
        if (q[2] === Symbol.for("react.memo_cache_sentinel")) D = mK.createElement(m, {
            minWidth: 2
        }, mK.createElement(T, {
            color: "text"
        }, I3)), q[2] = D;
        else D = q[2];
        let X;
        if (q[3] === Symbol.for("react.memo_cache_sentinel")) X = mK.createElement(T, {
            bold: !0
        }, "Summarized conversation"), q[3] = X;
        else X = q[3];
        let P;
        if (q[4] !== z || q[5] !== O) P = !z && mK.createElement(t1, null, mK.createElement(m, {
            flexDirection: "column"
        }, mK.createElement(T, {
            dimColor: !0
        }, "Summarized ", O.messagesSummarized, " messages from this point"), O.userContext && mK.createElement(T, {
            dimColor: !0
        }, "Context: ", "“", O.userContext, "”"), mK.createElement(T, {
            dimColor: !0
        }, mK.createElement(O8, {
            action: "app:toggleTranscript",
            context: "Global",
            fallback: "ctrl+o",
            description: "expand history",
            parens: !0
        })))), q[4] = z, q[5] = O, q[6] = P;
        else P = q[6];
        let W;
        if (q[7] !== z || q[8] !== w) W = z && mK.createElement(t1, null, mK.createElement(T, null, w)), q[7] = z, q[8] = w, q[9] = W;
        else W = q[9];
        let Z;
        if (q[10] !== P || q[11] !== W) Z = mK.createElement(m, {
            flexDirection: "column",
            marginTop: 1
        }, mK.createElement(m, {
            flexDirection: "row"
        }, D, mK.createElement(m, {
            flexDirection: "column"
        }, X, P, W))), q[10] = P, q[11] = W, q[12] = Z;
        else Z = q[12];
        return Z
    }
    let $;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) $ = mK.createElement(m, {
        minWidth: 2
    }, mK.createElement(T, {
        color: "text"
    }, I3)), q[13] = $;
    else $ = q[13];
    let H;
    if (q[14] !== z) H = !z && mK.createElement(T, {
        dimColor: !0
    }, " ", mK.createElement(O8, {
        action: "app:toggleTranscript",
        context: "Global",
        fallback: "ctrl+o",
        description: "expand",
        parens: !0
    })), q[14] = z, q[15] = H;
    else H = q[15];
    let j;
    if (q[16] !== H) j = mK.createElement(m, {
        flexDirection: "row"
    }, $, mK.createElement(m, {
        flexDirection: "column"
    }, mK.createElement(T, {
        bold: !0
    }, "Compact summary", H))), q[16] = H, q[17] = j;
    else j = q[17];
    let J;
    if (q[18] !== z || q[19] !== w) J = z && mK.createElement(t1, null, mK.createElement(T, null, w)), q[18] = z, q[19] = w, q[20] = J;
    else J = q[20];
    let M;
    if (q[21] !== j || q[22] !== J) M = mK.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, j, J), q[21] = j, q[22] = J, q[23] = M;
    else M = q[23];
    return M
}
// @from(Ln 327956, Col 4)
mK
// @from(Ln 327957, Col 4)
Nc4 = E(() => {
    e6();
    i6();
    JA();
    qw();
    iq();
    OK();
    mK = t(P6(), 1)
})
// @from(Ln 327967, Col 0)
function nTY(A) {
    let q = A6(90),
        {
            message: K,
            lookups: Y,
            addMargin: z,
            tools: _,
            commands: w,
            verbose: O,
            inProgressToolUseIDs: $,
            progressMessagesForMessage: H,
            shouldAnimate: j,
            shouldShowDot: J,
            style: M,
            width: D,
            isTranscriptMode: X,
            onOpenRateLimitOptions: P,
            isActiveCollapsedGroup: W,
            isUserContinuation: Z,
            lastThinkingBlockId: G,
            latestBashOutputUUID: f
        } = A,
        v = Z === void 0 ? !1 : Z;
    switch (K.type) {
        case "attachment": {
            let N;
            if (q[0] !== z || q[1] !== X || q[2] !== K.attachment || q[3] !== O) N = V3.createElement(Kc4, {
                addMargin: z,
                attachment: K.attachment,
                verbose: O,
                isTranscriptMode: X
            }), q[0] = z, q[1] = X, q[2] = K.attachment, q[3] = O, q[4] = N;
            else N = q[4];
            return N
        }
        case "assistant": {
            let N;
            if (q[5] !== z || q[6] !== w || q[7] !== $ || q[8] !== X || q[9] !== G || q[10] !== Y || q[11] !== K.message.content || q[12] !== K.uuid || q[13] !== P || q[14] !== H || q[15] !== j || q[16] !== J || q[17] !== _ || q[18] !== O || q[19] !== D) {
                let L;
                if (q[21] !== z || q[22] !== w || q[23] !== $ || q[24] !== X || q[25] !== G || q[26] !== Y || q[27] !== K.uuid || q[28] !== P || q[29] !== H || q[30] !== j || q[31] !== J || q[32] !== _ || q[33] !== O || q[34] !== D) L = (h, R) => V3.createElement(oTY, {
                    key: R,
                    param: h,
                    addMargin: z,
                    tools: _,
                    commands: w,
                    verbose: O,
                    inProgressToolUseIDs: $,
                    progressMessagesForMessage: H,
                    shouldAnimate: j,
                    shouldShowDot: J,
                    width: D,
                    inProgressToolCallCount: $.size,
                    isTranscriptMode: X,
                    lookups: Y,
                    onOpenRateLimitOptions: P,
                    thinkingBlockId: `${K.uuid}:${R}`,
                    lastThinkingBlockId: G
                }), q[21] = z, q[22] = w, q[23] = $, q[24] = X, q[25] = G, q[26] = Y, q[27] = K.uuid, q[28] = P, q[29] = H, q[30] = j, q[31] = J, q[32] = _, q[33] = O, q[34] = D, q[35] = L;
                else L = q[35];
                N = K.message.content.map(L), q[5] = z, q[6] = w, q[7] = $, q[8] = X, q[9] = G, q[10] = Y, q[11] = K.message.content, q[12] = K.uuid, q[13] = P, q[14] = H, q[15] = j, q[16] = J, q[17] = _, q[18] = O, q[19] = D, q[20] = N
            } else N = q[20];
            let V;
            if (q[36] !== N) V = V3.createElement(m, {
                flexDirection: "column",
                width: "100%"
            }, N), q[36] = N, q[37] = V;
            else V = q[37];
            return V
        }
        case "user": {
            if (K.isCompactSummary) {
                let I = X ? "transcript" : "prompt",
                    g;
                if (q[38] !== K || q[39] !== I) g = V3.createElement(vc4, {
                    message: K,
                    screen: I
                }), q[38] = K, q[39] = I, q[40] = g;
                else g = q[40];
                return g
            }
            let N;
            if (q[41] !== K.imagePasteIds || q[42] !== K.message.content) {
                N = [];
                let I = 0;
                for (let g of K.message.content)
                    if (g.type === "image") {
                        let B = K.imagePasteIds?.[I];
                        I++, N.push(B ?? I)
                    } else N.push(I);
                q[41] = K.imagePasteIds, q[42] = K.message.content, q[43] = N
            } else N = q[43];
            let V = f === K.uuid,
                L;
            if (q[44] !== z || q[45] !== N || q[46] !== X || q[47] !== v || q[48] !== Y || q[49] !== K || q[50] !== H || q[51] !== M || q[52] !== _ || q[53] !== O) L = K.message.content.map((I, g) => V3.createElement(rTY, {
                key: g,
                message: K,
                addMargin: z,
                tools: _,
                progressMessagesForMessage: H,
                param: I,
                style: M,
                verbose: O,
                imageIndex: N[g],
                isUserContinuation: v,
                lookups: Y,
                isTranscriptMode: X
            })), q[44] = z, q[45] = N, q[46] = X, q[47] = v, q[48] = Y, q[49] = K, q[50] = H, q[51] = M, q[52] = _, q[53] = O, q[54] = L;
            else L = q[54];
            let h;
            if (q[55] !== L) h = V3.createElement(m, {
                flexDirection: "column",
                width: "100%"
            }, L), q[55] = L, q[56] = h;
            else h = q[56];
            let R = h,
                u;
            if (q[57] !== R || q[58] !== V) u = V ? V3.createElement(n34, null, R) : R, q[57] = R, q[58] = V, q[59] = u;
            else u = q[59];
            return u
        }
        case "system": {
            if (K.subtype === "compact_boundary") {
                let V;
                if (q[60] === Symbol.for("react.memo_cache_sentinel")) V = V3.createElement(Jc4, null), q[60] = V;
                else V = q[60];
                return V
            }
            if (K.subtype === "microcompact_boundary") return null;
            if (K.subtype === "local_command") {
                let V;
                if (q[64] !== K.content) V = {
                    type: "text",
                    text: K.content
                }, q[64] = K.content, q[65] = V;
                else V = q[65];
                let L;
                if (q[66] !== z || q[67] !== X || q[68] !== V || q[69] !== O) L = V3.createElement(cY6, {
                    addMargin: z,
                    param: V,
                    verbose: O,
                    isTranscriptMode: X
                }), q[66] = z, q[67] = X, q[68] = V, q[69] = O, q[70] = L;
                else L = q[70];
                return L
            }
            let N;
            if (q[71] !== z || q[72] !== X || q[73] !== K || q[74] !== O) N = V3.createElement(Hc4, {
                message: K,
                addMargin: z,
                verbose: O,
                isTranscriptMode: X
            }), q[71] = z, q[72] = X, q[73] = K, q[74] = O, q[75] = N;
            else N = q[75];
            return N
        }
        case "grouped_tool_use": {
            let N;
            if (q[76] !== $ || q[77] !== Y || q[78] !== K || q[79] !== j || q[80] !== _) N = V3.createElement(Dc4, {
                message: K,
                tools: _,
                lookups: Y,
                inProgressToolUseIDs: $,
                shouldAnimate: j
            }), q[76] = $, q[77] = Y, q[78] = K, q[79] = j, q[80] = _, q[81] = N;
            else N = q[81];
            return N
        }
        case "collapsed_read_search": {
            let N;
            if (q[82] !== $ || q[83] !== W || q[84] !== Y || q[85] !== K || q[86] !== j || q[87] !== _ || q[88] !== O) N = V3.createElement(fc4, {
                message: K,
                inProgressToolUseIDs: $,
                shouldAnimate: j,
                verbose: O,
                tools: _,
                lookups: Y,
                isActiveGroup: W
            }), q[82] = $, q[83] = W, q[84] = Y, q[85] = K, q[86] = j, q[87] = _, q[88] = O, q[89] = N;
            else N = q[89];
            return N
        }
    }
}
// @from(Ln 328151, Col 0)
function rTY(A) {
    let q = A6(20),
        {
            message: K,
            addMargin: Y,
            tools: z,
            progressMessagesForMessage: _,
            param: w,
            style: O,
            verbose: $,
            imageIndex: H,
            isUserContinuation: j,
            lookups: J,
            isTranscriptMode: M
        } = A,
        {
            columns: D
        } = KA();
    switch (w.type) {
        case "text": {
            let X;
            if (q[0] !== Y || q[1] !== M || q[2] !== K.planContent || q[3] !== K.timestamp || q[4] !== w || q[5] !== $) X = V3.createElement(cY6, {
                addMargin: Y,
                param: w,
                verbose: $,
                planContent: K.planContent,
                isTranscriptMode: M,
                timestamp: K.timestamp
            }), q[0] = Y, q[1] = M, q[2] = K.planContent, q[3] = K.timestamp, q[4] = w, q[5] = $, q[6] = X;
            else X = q[6];
            return X
        }
        case "image": {
            let X = Y && !j,
                P;
            if (q[7] !== H || q[8] !== X) P = V3.createElement(zN1, {
                imageId: H,
                addMargin: X
            }), q[7] = H, q[8] = X, q[9] = P;
            else P = q[9];
            return P
        }
        case "tool_result": {
            let X = D - 5,
                P;
            if (q[10] !== M || q[11] !== J || q[12] !== K || q[13] !== w || q[14] !== _ || q[15] !== O || q[16] !== X || q[17] !== z || q[18] !== $) P = V3.createElement(JW4, {
                param: w,
                message: K,
                lookups: J,
                progressMessagesForMessage: _,
                style: O,
                tools: z,
                verbose: $,
                width: X,
                isTranscriptMode: M
            }), q[10] = M, q[11] = J, q[12] = K, q[13] = w, q[14] = _, q[15] = O, q[16] = X, q[17] = z, q[18] = $, q[19] = P;
            else P = q[19];
            return P
        }
        default:
            return
    }
}