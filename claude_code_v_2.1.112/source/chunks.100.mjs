
// @from(Ln 263038, Col 0)
async function F_(q, K, _) {
    await dWz(_);
    let z = eH6(q, _),
        Y = `${z}.lock`;
    E(`[TeammateMailbox] writeToMailbox: recipient=${q}, from=${K.from}, path=${z}`);
    try {
        await Qh6(z, "[]", {
            encoding: "utf-8",
            flag: "wx"
        }), E("[TeammateMailbox] writeToMailbox: created new inbox file")
    } catch (O) {
        if (Q1(O) !== "EEXIST") {
            E(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${O}`), j6(O);
            return
        }
    }
    let A;
    try {
        A = await Jj(z, {
            lockfilePath: Y,
            ...z18
        });
        let O = await ts(q, _),
            w = {
                ...K,
                read: !1
            };
        O.push(w), await Qh6(z, I6(O, null, 2), "utf-8"), E(`[TeammateMailbox] Wrote message to ${q}'s inbox from ${K.from}`)
    } catch (O) {
        E(`Failed to write to inbox for ${q}: ${O}`), j6(O)
    } finally {
        if (A) await A()
    }
}
// @from(Ln 263072, Col 0)
async function Y18(q, K, _) {
    let z = eH6(q, K);
    E(`[TeammateMailbox] markMessageAsReadByIndex called: agentName=${q}, teamName=${K}, index=${_}, path=${z}`);
    let Y = `${z}.lock`,
        A;
    try {
        E("[TeammateMailbox] markMessageAsReadByIndex: acquiring lock..."), A = await Jj(z, {
            lockfilePath: Y,
            ...z18
        }), E("[TeammateMailbox] markMessageAsReadByIndex: lock acquired");
        let O = await ts(q, K);
        if (E(`[TeammateMailbox] markMessageAsReadByIndex: read ${O.length} messages after lock`), _ < 0 || _ >= O.length) {
            E(`[TeammateMailbox] markMessageAsReadByIndex: index ${_} out of bounds (${O.length} messages)`);
            return
        }
        let w = O[_];
        if (!w || w.read) {
            E("[TeammateMailbox] markMessageAsReadByIndex: message already read or missing");
            return
        }
        O[_] = {
            ...w,
            read: !0
        }, await Qh6(z, I6(O, null, 2), "utf-8"), E(`[TeammateMailbox] markMessageAsReadByIndex: marked message at index ${_} as read`)
    } catch (O) {
        if (Q1(O) === "ENOENT") {
            E(`[TeammateMailbox] markMessageAsReadByIndex: file does not exist at ${z}`);
            return
        }
        E(`[TeammateMailbox] markMessageAsReadByIndex FAILED for ${q}: ${O}`), j6(O)
    } finally {
        if (A) await A(), E("[TeammateMailbox] markMessageAsReadByIndex: lock released")
    }
}
// @from(Ln 263106, Col 0)
async function A18(q, K) {
    let _ = eH6(q, K);
    E(`[TeammateMailbox] markMessagesAsRead called: agentName=${q}, teamName=${K}, path=${_}`);
    let z = `${_}.lock`,
        Y;
    try {
        E("[TeammateMailbox] markMessagesAsRead: acquiring lock..."), Y = await Jj(_, {
            lockfilePath: z,
            ...z18
        }), E("[TeammateMailbox] markMessagesAsRead: lock acquired");
        let A = await ts(q, K);
        if (E(`[TeammateMailbox] markMessagesAsRead: read ${A.length} messages after lock`), A.length === 0) {
            E("[TeammateMailbox] markMessagesAsRead: no messages to mark");
            return
        }
        let O = w7(A, (w) => !w.read);
        E(`[TeammateMailbox] markMessagesAsRead: ${O} unread of ${A.length} total`);
        for (let w of A) w.read = !0;
        await Qh6(_, I6(A, null, 2), "utf-8"), E(`[TeammateMailbox] markMessagesAsRead: WROTE ${O} message(s) as read to ${_}`)
    } catch (A) {
        if (Q1(A) === "ENOENT") {
            E(`[TeammateMailbox] markMessagesAsRead: file does not exist at ${_}`);
            return
        }
        E(`[TeammateMailbox] markMessagesAsRead FAILED for ${q}: ${A}`), j6(A)
    } finally {
        if (Y) await Y(), E("[TeammateMailbox] markMessagesAsRead: lock released")
    }
}
// @from(Ln 263135, Col 0)
async function O18(q, K) {
    let _ = eH6(q, K),
        z = `${_}.lock`,
        Y;
    try {
        Y = await Jj(_, {
            lockfilePath: z,
            ...z18
        }), await Qh6(_, "[]", {
            encoding: "utf-8"
        }), E(`[TeammateMailbox] Cleared inbox for ${q}`)
    } catch (A) {
        if (Q1(A) === "ENOENT") return;
        E(`Failed to clear inbox for ${q}: ${A}`), j6(A)
    } finally {
        await Y?.()
    }
}
// @from(Ln 263154, Col 0)
function cWz(q) {
    return q.map((K) => {
        let _ = K.color ? ` color="${K.color}"` : "",
            z = K.summary ? ` summary="${K.summary}"` : "";
        return `<${oX} teammate_id="${K.from}"${_}${z}>
${K.text}
</${oX}>`
    }).join(`

`)
}
// @from(Ln 263166, Col 0)
function w18(q, K) {
    return {
        type: "idle_notification",
        from: q,
        timestamp: new Date().toISOString(),
        idleReason: K?.idleReason,
        summary: K?.summary,
        completedTaskId: K?.completedTaskId,
        completedStatus: K?.completedStatus,
        failureReason: K?.failureReason
    }
}
// @from(Ln 263179, Col 0)
function $18(q) {
    try {
        let K = n8(q);
        if (K && K.type === "idle_notification") return K
    } catch {}
    return null
}
// @from(Ln 263187, Col 0)
function Ti1(q) {
    return {
        type: "permission_request",
        request_id: q.request_id,
        agent_id: q.agent_id,
        tool_name: q.tool_name,
        tool_use_id: q.tool_use_id,
        description: q.description,
        input: q.input,
        permission_suggestions: q.permission_suggestions || []
    }
}
// @from(Ln 263200, Col 0)
function Vi1(q) {
    if (q.subtype === "error") return {
        type: "permission_response",
        request_id: q.request_id,
        subtype: "error",
        error: q.error || "Permission denied"
    };
    return {
        type: "permission_response",
        request_id: q.request_id,
        subtype: "success",
        response: {
            updated_input: q.updated_input,
            permission_updates: q.permission_updates
        }
    }
}
// @from(Ln 263218, Col 0)
function j18(q) {
    try {
        let K = n8(q);
        if (K && K.type === "permission_request") return K
    } catch {}
    return null
}
// @from(Ln 263226, Col 0)
function KJ6(q) {
    try {
        let K = n8(q);
        if (K && K.type === "permission_response") return K
    } catch {}
    return null
}
// @from(Ln 263234, Col 0)
function ki1(q) {
    return {
        type: "sandbox_permission_request",
        requestId: q.requestId,
        workerId: q.workerId,
        workerName: q.workerName,
        workerColor: q.workerColor,
        hostPattern: {
            host: q.host
        },
        createdAt: Date.now()
    }
}
// @from(Ln 263248, Col 0)
function Ni1(q) {
    return {
        type: "sandbox_permission_response",
        requestId: q.requestId,
        host: q.host,
        allow: q.allow,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 263258, Col 0)
function hI8(q) {
    try {
        let K = n8(q);
        if (K && K.type === "sandbox_permission_request") return K
    } catch {}
    return null
}
// @from(Ln 263266, Col 0)
function H18(q) {
    try {
        let K = n8(q);
        if (K && K.type === "sandbox_permission_response") return K
    } catch {}
    return null
}
// @from(Ln 263274, Col 0)
function dh6(q) {
    return {
        type: "shutdown_request",
        requestId: q.requestId,
        from: q.from,
        reason: q.reason,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 263284, Col 0)
function Ei1(q) {
    return {
        type: "shutdown_approved",
        requestId: q.requestId,
        from: q.from,
        timestamp: new Date().toISOString(),
        paneId: q.paneId,
        backendType: q.backendType
    }
}
// @from(Ln 263295, Col 0)
function yi1(q) {
    return {
        type: "shutdown_rejected",
        requestId: q.requestId,
        from: q.from,
        reason: q.reason,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 263304, Col 0)
async function RI8(q, K, _) {
    let z = K || Z9(),
        Y = T_() || Mz,
        A = ph6("shutdown", q),
        O = dh6({
            requestId: A,
            from: Y,
            reason: _
        });
    return await F_(q, {
        from: Y,
        text: I6(O),
        timestamp: new Date().toISOString(),
        color: KH()
    }, z), {
        requestId: A,
        target: q
    }
}
// @from(Ln 263324, Col 0)
function i56(q) {
    try {
        let K = Yb4().safeParse(n8(q));
        if (K.success) return K.data
    } catch {}
    return null
}
// @from(Ln 263332, Col 0)
function _J6(q) {
    try {
        let K = _b4().safeParse(n8(q));
        if (K.success) return K.data
    } catch {}
    return null
}
// @from(Ln 263340, Col 0)
function Qk(q) {
    try {
        let K = Ab4().safeParse(n8(q));
        if (K.success) return K.data
    } catch {}
    return null
}
// @from(Ln 263348, Col 0)
function SI8(q) {
    try {
        let K = Ob4().safeParse(n8(q));
        if (K.success) return K.data
    } catch {}
    return null
}
// @from(Ln 263356, Col 0)
function ch6(q) {
    try {
        let K = zb4().safeParse(n8(q));
        if (K.success) return K.data
    } catch {}
    return null
}
// @from(Ln 263364, Col 0)
function CI8(q) {
    try {
        let K = n8(q);
        if (K && K.type === "task_assignment") return K
    } catch {}
    return null
}
// @from(Ln 263372, Col 0)
function bI8(q) {
    try {
        let K = n8(q);
        if (K && K.type === "team_permission_update") return K
    } catch {}
    return null
}
// @from(Ln 263380, Col 0)
function II8(q) {
    return {
        type: "mode_set_request",
        mode: q.mode,
        from: q.from
    }
}
// @from(Ln 263388, Col 0)
function xI8(q) {
    try {
        let K = wb4().safeParse(n8(q));
        if (K.success) return K.data
    } catch {}
    return null
}
// @from(Ln 263396, Col 0)
function uI8(q) {
    try {
        let K = n8(q);
        if (!K || typeof K !== "object" || !("type" in K)) return !1;
        let _ = K.type;
        return _ === "permission_request" || _ === "permission_response" || _ === "sandbox_permission_request" || _ === "sandbox_permission_response" || _ === "shutdown_request" || _ === "shutdown_approved" || _ === "team_permission_update" || _ === "mode_set_request" || _ === "plan_approval_request" || _ === "plan_approval_response"
    } catch {
        return !1
    }
}
// @from(Ln 263406, Col 0)
async function Li1(q, K, _) {
    let z = eH6(q, _),
        Y = `${z}.lock`,
        A;
    try {
        A = await Jj(z, {
            lockfilePath: Y,
            ...z18
        });
        let O = await ts(q, _);
        if (O.length === 0) return;
        let w = O.map(($) => !$.read && K($) ? {
            ...$,
            read: !0
        } : $);
        await Qh6(z, I6(w, null, 2), "utf-8")
    } catch (O) {
        if (Q1(O) === "ENOENT") return;
        j6(O)
    } finally {
        if (A) try {
            await A()
        } catch {}
    }
}
// @from(Ln 263432, Col 0)
function J18(q) {
    for (let K = q.length - 1; K >= 0; K--) {
        let _ = q[K];
        if (!_) continue;
        if (_.type === "user" && typeof _.message.content === "string") break;
        if (_.type !== "assistant") continue;
        for (let z of _.message.content)
            if (z.type === "tool_use" && z.name === tW && typeof z.input === "object" && z.input !== null && "to" in z.input && typeof z.input.to === "string" && z.input.to !== "*" && z.input.to.toLowerCase() !== Mz.toLowerCase() && "message" in z.input && typeof z.input.message === "string") {
                let Y = z.input.to,
                    A = "summary" in z.input && typeof z.input.summary === "string" ? z.input.summary : z.input.message.slice(0, 80);
                return `[to ${Y}] ${A}`
            }
    }
    return
}
// @from(Ln 263447, Col 4)
z18
// @from(Ln 263447, Col 9)
_b4
// @from(Ln 263447, Col 14)
zb4
// @from(Ln 263447, Col 19)
Yb4
// @from(Ln 263447, Col 24)
Ab4
// @from(Ln 263447, Col 29)
Ob4
// @from(Ln 263447, Col 34)
wb4
// @from(Ln 263448, Col 4)
ZX = L(() => {
    p7();
    rA();
    fi1();
    K8();
    Q8();
    m8();
    U8();
    e8();
    PX();
    zY();
    z18 = {
        retries: {
            retries: 10,
            minTimeout: 5,
            maxTimeout: 100
        }
    };
    _b4 = C6(() => y.object({
        type: y.literal("plan_approval_request"),
        from: y.string(),
        timestamp: y.string(),
        planFilePath: y.string(),
        planContent: y.string(),
        requestId: y.string()
    })), zb4 = C6(() => y.object({
        type: y.literal("plan_approval_response"),
        requestId: y.string(),
        approved: y.boolean(),
        feedback: y.string().optional(),
        timestamp: y.string(),
        permissionMode: ss().optional()
    })), Yb4 = C6(() => y.object({
        type: y.literal("shutdown_request"),
        requestId: y.string(),
        from: y.string(),
        reason: y.string().optional(),
        timestamp: y.string()
    })), Ab4 = C6(() => y.object({
        type: y.literal("shutdown_approved"),
        requestId: y.string(),
        from: y.string(),
        timestamp: y.string(),
        paneId: y.string().optional(),
        backendType: y.string().optional()
    })), Ob4 = C6(() => y.object({
        type: y.literal("shutdown_rejected"),
        requestId: y.string(),
        from: y.string(),
        reason: y.string(),
        timestamp: y.string()
    }));
    wb4 = C6(() => y.object({
        type: y.literal("mode_set_request"),
        mode: ss(),
        from: y.string()
    }))
})
// @from(Ln 263507, Col 0)
function zJ6(q) {
    return q === "tmux" || q === "iterm2"
}
// @from(Ln 263510, Col 4)
hi1 = {}
// @from(Ln 263522, Col 0)
function YJ6() {
    return !!jb4
}
// @from(Ln 263525, Col 0)
async function ap() {
    if (X18 !== null) return X18;
    return X18 = !!jb4, X18
}
// @from(Ln 263530, Col 0)
function mI8() {
    return lWz || null
}
// @from(Ln 263533, Col 0)
async function r56() {
    return (await w1(mD, ["-V"])).code === 0
}
// @from(Ln 263537, Col 0)
function xc() {
    if (M18 !== null) return M18;
    let q = process.env.TERM_PROGRAM,
        K = !!process.env.ITERM_SESSION_ID,
        _ = X7.terminal === "iTerm.app";
    return M18 = q === "iTerm.app" || K || _, M18
}
// @from(Ln 263544, Col 0)
async function P18() {
    return (await w1(lh6, ["session", "list"])).code === 0
}
// @from(Ln 263548, Col 0)
function nWz() {
    X18 = null, M18 = null
}
// @from(Ln 263551, Col 4)
jb4
// @from(Ln 263551, Col 9)
lWz
// @from(Ln 263551, Col 14)
X18 = null
// @from(Ln 263552, Col 4)
M18 = null
// @from(Ln 263553, Col 4)
lh6 = "it2"
// @from(Ln 263554, Col 4)
yx = L(() => {
    D_();
    Q4();
    jb4 = process.env.TMUX, lWz = process.env.TMUX_PANE
})
// @from(Ln 263560, Col 0)
function oWz(q, K) {
    return q + iWz(rWz() * (K - q + 1))
}
// @from(Ln 263563, Col 4)
iWz
// @from(Ln 263563, Col 9)
rWz
// @from(Ln 263563, Col 14)
Hb4
// @from(Ln 263564, Col 4)
Jb4 = L(() => {
    iWz = Math.floor, rWz = Math.random;
    Hb4 = oWz
})
// @from(Ln 263569, Col 0)
function aWz(q) {
    var K = q.length;
    return K ? q[Hb4(0, K - 1)] : void 0
}
// @from(Ln 263573, Col 4)
BI8
// @from(Ln 263574, Col 4)
Ri1 = L(() => {
    Jb4();
    BI8 = aWz
})
// @from(Ln 263579, Col 0)
function sWz(q, K) {
    return V86(K, function(_) {
        return q[_]
    })
}
// @from(Ln 263584, Col 4)
Xb4
// @from(Ln 263585, Col 4)
Mb4 = L(() => {
    xB6();
    Xb4 = sWz
})
// @from(Ln 263590, Col 0)
function tWz(q) {
    return q == null ? [] : Xb4(q, vC(q))
}
// @from(Ln 263593, Col 4)
Pb4
// @from(Ln 263594, Col 4)
Wb4 = L(() => {
    Mb4();
    OY6();
    Pb4 = tWz
})
// @from(Ln 263600, Col 0)
function eWz(q) {
    return BI8(Pb4(q))
}
// @from(Ln 263603, Col 4)
Db4
// @from(Ln 263604, Col 4)
Zb4 = L(() => {
    Ri1();
    Wb4();
    Db4 = eWz
})
// @from(Ln 263610, Col 0)
function q0z(q) {
    var K = uO(q) ? BI8 : Db4;
    return K(q)
}
// @from(Ln 263614, Col 4)
LJ
// @from(Ln 263615, Col 4)
uc = L(() => {
    Ri1();
    Zb4();
    YV();
    LJ = q0z
})
// @from(Ln 263622, Col 0)
function AJ6() {
    let K = v7().spinnerVerbs;
    if (!K) return Si1;
    if (K.mode === "replace") return K.verbs.length > 0 ? K.verbs : Si1;
    return [...Si1, ...K.verbs]
}
// @from(Ln 263628, Col 4)
Si1
// @from(Ln 263629, Col 4)
pI8 = L(() => {
    a1();
    Si1 = ["Accomplishing", "Actioning", "Actualizing", "Architecting", "Baking", "Beaming", "Beboppin'", "Befuddling", "Billowing", "Blanching", "Bloviating", "Boogieing", "Boondoggling", "Booping", "Bootstrapping", "Brewing", "Bunning", "Burrowing", "Calculating", "Canoodling", "Caramelizing", "Cascading", "Catapulting", "Cerebrating", "Channeling", "Channelling", "Choreographing", "Churning", "Clauding", "Coalescing", "Cogitating", "Combobulating", "Composing", "Computing", "Concocting", "Considering", "Contemplating", "Cooking", "Crafting", "Creating", "Crunching", "Crystallizing", "Cultivating", "Deciphering", "Deliberating", "Determining", "Dilly-dallying", "Discombobulating", "Doing", "Doodling", "Drizzling", "Ebbing", "Effecting", "Elucidating", "Embellishing", "Enchanting", "Envisioning", "Evaporating", "Fermenting", "Fiddle-faddling", "Finagling", "Flambéing", "Flibbertigibbeting", "Flowing", "Flummoxing", "Fluttering", "Forging", "Forming", "Frolicking", "Frosting", "Gallivanting", "Galloping", "Garnishing", "Generating", "Gesticulating", "Germinating", "Gitifying", "Grooving", "Gusting", "Harmonizing", "Hashing", "Hatching", "Herding", "Honking", "Hullaballooing", "Hyperspacing", "Ideating", "Imagining", "Improvising", "Incubating", "Inferring", "Infusing", "Ionizing", "Jitterbugging", "Julienning", "Kneading", "Leavening", "Levitating", "Lollygagging", "Manifesting", "Marinating", "Meandering", "Metamorphosing", "Misting", "Moonwalking", "Moseying", "Mulling", "Mustering", "Musing", "Nebulizing", "Nesting", "Newspapering", "Noodling", "Nucleating", "Orbiting", "Orchestrating", "Osmosing", "Perambulating", "Percolating", "Perusing", "Philosophising", "Photosynthesizing", "Pollinating", "Pondering", "Pontificating", "Pouncing", "Precipitating", "Prestidigitating", "Processing", "Proofing", "Propagating", "Puttering", "Puzzling", "Quantumizing", "Razzle-dazzling", "Razzmatazzing", "Recombobulating", "Reticulating", "Roosting", "Ruminating", "Sautéing", "Scampering", "Schlepping", "Scurrying", "Seasoning", "Shenaniganing", "Shimmying", "Simmering", "Skedaddling", "Sketching", "Slithering", "Smooshing", "Sock-hopping", "Spelunking", "Spinning", "Sprouting", "Stewing", "Sublimating", "Swirling", "Swooping", "Symbioting", "Synthesizing", "Tempering", "Thinking", "Thundering", "Tinkering", "Tomfoolering", "Topsy-turvying", "Transfiguring", "Transmuting", "Twisting", "Undulating", "Unfurling", "Unravelling", "Vibing", "Waddling", "Wandering", "Warping", "Whatchamacalliting", "Whirlpooling", "Whirring", "Whisking", "Wibbling", "Working", "Wrangling", "Zesting", "Zigzagging"]
})
// @from(Ln 263633, Col 4)
nh6
// @from(Ln 263634, Col 4)
FI8 = L(() => {
    nh6 = ["Baked", "Brewed", "Churned", "Cogitated", "Cooked", "Crunched", "Sautéed", "Worked"]
})
// @from(Ln 263638, Col 0)
function Gb4(q) {
    return Math.abs(N16(q)) || 1
}
// @from(Ln 263642, Col 0)
function vb4(q) {
    let K = Ii1.get(q);
    if (K !== void 0) return K;
    return bi1++, Ii1.set(q, bi1), bi1
}
// @from(Ln 263648, Col 0)
function UI8() {
    let q = mW() ?? I8(),
        K = T_() ?? "main",
        _ = kQ(),
        z = gI8.get(q);
    if (z) return z;
    let Y = {
        agentId: q,
        agentName: K,
        parentAgentId: _,
        processId: q === I8() ? 1 : vb4(q),
        threadId: Gb4(K)
    };
    return gI8.set(q, Y), fb4++, Y
}
// @from(Ln 263664, Col 0)
function o56() {
    return (Date.now() - K0z) * 1000
}
// @from(Ln 263668, Col 0)
function QI8() {
    return `span_${++_0z}`
}
// @from(Ln 263672, Col 0)
function Tb4() {
    let q = process.env.CLAUDE_CODE_PERFETTO_TRACE;
    E(`[Perfetto] initializePerfettoTracing called, env value: ${q}`)
}
// @from(Ln 263677, Col 0)
function z0z(q) {
    if (!Lx) return;
    if (Ci1.push({
            name: "process_name",
            cat: "__metadata",
            ph: "M",
            ts: 0,
            pid: q.processId,
            tid: 0,
            args: {
                name: q.agentName
            }
        }), Ci1.push({
            name: "thread_name",
            cat: "__metadata",
            ph: "M",
            ts: 0,
            pid: q.processId,
            tid: q.threadId,
            args: {
                name: q.agentName
            }
        }), q.parentAgentId) Ci1.push({
        name: "parent_agent",
        cat: "__metadata",
        ph: "M",
        ts: 0,
        pid: q.processId,
        tid: 0,
        args: {
            parent_agent_id: q.parentAgentId
        }
    })
}
// @from(Ln 263712, Col 0)
function es() {
    return Lx
}
// @from(Ln 263716, Col 0)
function dI8(q, K, _) {
    if (!Lx) return;
    let z = {
        agentId: q,
        agentName: K,
        parentAgentId: _,
        processId: vb4(q),
        threadId: Gb4(K)
    };
    gI8.set(q, z), fb4++, z0z(z)
}
// @from(Ln 263728, Col 0)
function OJ6(q) {
    if (!Lx) return;
    gI8.delete(q), Ii1.delete(q)
}
// @from(Ln 263733, Col 0)
function Vb4(q) {
    if (!Lx) return "";
    let K = QI8(),
        _ = UI8();
    return nP.set(K, {
        name: "API Call",
        category: "api",
        startTime: o56(),
        agentInfo: _,
        args: {
            model: q.model,
            prompt_tokens: q.promptTokens,
            message_id: q.messageId,
            is_speculative: q.isSpeculative ?? !1,
            query_source: q.querySource
        }
    }), jT.push({
        name: "API Call",
        cat: "api",
        ph: "B",
        ts: nP.get(K).startTime,
        pid: _.processId,
        tid: _.threadId,
        args: nP.get(K).args
    }), K
}
// @from(Ln 263760, Col 0)
function kb4(q, K) {
    if (!Lx || !q) return;
    let _ = nP.get(q);
    if (!_) return;
    let z = o56(),
        Y = z - _.startTime,
        A = K.promptTokens ?? _.args.prompt_tokens,
        O = K.ttftMs,
        w = K.ttltMs,
        $ = K.outputTokens,
        j = K.cacheReadTokens,
        H = O !== void 0 && A !== void 0 && O > 0 ? Math.round(A / (O / 1000) * 100) / 100 : void 0,
        J = w !== void 0 && O !== void 0 ? w - O : void 0,
        X = J !== void 0 && $ !== void 0 && J > 0 ? Math.round($ / (J / 1000) * 100) / 100 : void 0,
        M = j !== void 0 && A !== void 0 && A > 0 ? Math.round(j / A * 1e4) / 100 : void 0,
        P = K.requestSetupMs,
        W = K.attemptStartTimes,
        D = {
            ..._.args,
            ttft_ms: O,
            ttlt_ms: w,
            prompt_tokens: A,
            output_tokens: $,
            cache_read_tokens: j,
            cache_creation_tokens: K.cacheCreationTokens,
            message_id: K.messageId ?? _.args.message_id,
            success: K.success ?? !0,
            error: K.error,
            duration_ms: Y / 1000,
            request_setup_ms: P,
            itps: H,
            otps: X,
            cache_hit_rate_pct: M
        },
        Z = P !== void 0 && P > 0 ? P * 1000 : 0;
    if (Z > 0) {
        let G = _.startTime + Z;
        if (jT.push({
                name: "Request Setup",
                cat: "api,setup",
                ph: "B",
                ts: _.startTime,
                pid: _.agentInfo.processId,
                tid: _.agentInfo.threadId,
                args: {
                    request_setup_ms: P,
                    attempt_count: W?.length ?? 1
                }
            }), W && W.length > 1) {
            let f = W[0];
            for (let v = 0; v < W.length - 1; v++) {
                let V = _.startTime + (W[v] - f) * 1000,
                    k = _.startTime + (W[v + 1] - f) * 1000;
                jT.push({
                    name: `Attempt ${v+1} (retry)`,
                    cat: "api,retry",
                    ph: "B",
                    ts: V,
                    pid: _.agentInfo.processId,
                    tid: _.agentInfo.threadId,
                    args: {
                        attempt: v + 1
                    }
                }), jT.push({
                    name: `Attempt ${v+1} (retry)`,
                    cat: "api,retry",
                    ph: "E",
                    ts: k,
                    pid: _.agentInfo.processId,
                    tid: _.agentInfo.threadId
                })
            }
        }
        jT.push({
            name: "Request Setup",
            cat: "api,setup",
            ph: "E",
            ts: G,
            pid: _.agentInfo.processId,
            tid: _.agentInfo.threadId
        })
    }
    if (O !== void 0) {
        let G = _.startTime + Z,
            f = G + O * 1000;
        jT.push({
            name: "First Token",
            cat: "api,ttft",
            ph: "B",
            ts: G,
            pid: _.agentInfo.processId,
            tid: _.agentInfo.threadId,
            args: {
                ttft_ms: O,
                prompt_tokens: A,
                itps: H,
                cache_hit_rate_pct: M
            }
        }), jT.push({
            name: "First Token",
            cat: "api,ttft",
            ph: "E",
            ts: f,
            pid: _.agentInfo.processId,
            tid: _.agentInfo.threadId
        });
        let v = w !== void 0 ? w - O - Z / 1000 : void 0;
        if (v !== void 0 && v > 0) jT.push({
            name: "Sampling",
            cat: "api,sampling",
            ph: "B",
            ts: f,
            pid: _.agentInfo.processId,
            tid: _.agentInfo.threadId,
            args: {
                sampling_ms: v,
                output_tokens: $,
                otps: X
            }
        }), jT.push({
            name: "Sampling",
            cat: "api,sampling",
            ph: "E",
            ts: f + v * 1000,
            pid: _.agentInfo.processId,
            tid: _.agentInfo.threadId
        })
    }
    jT.push({
        name: _.name,
        cat: _.category,
        ph: "E",
        ts: z,
        pid: _.agentInfo.processId,
        tid: _.agentInfo.threadId,
        args: D
    }), nP.delete(q)
}
// @from(Ln 263899, Col 0)
function Nb4(q, K) {
    if (!Lx) return "";
    let _ = QI8(),
        z = UI8();
    return nP.set(_, {
        name: `Tool: ${q}`,
        category: "tool",
        startTime: o56(),
        agentInfo: z,
        args: {
            tool_name: q,
            ...K
        }
    }), jT.push({
        name: `Tool: ${q}`,
        cat: "tool",
        ph: "B",
        ts: nP.get(_).startTime,
        pid: z.processId,
        tid: z.threadId,
        args: nP.get(_).args
    }), _
}
// @from(Ln 263923, Col 0)
function Eb4(q, K) {
    if (!Lx || !q) return;
    let _ = nP.get(q);
    if (!_) return;
    let z = o56(),
        Y = z - _.startTime,
        A = {
            ..._.args,
            success: K?.success ?? !0,
            error: K?.error,
            result_tokens: K?.resultTokens,
            duration_ms: Y / 1000
        };
    jT.push({
        name: _.name,
        cat: _.category,
        ph: "E",
        ts: z,
        pid: _.agentInfo.processId,
        tid: _.agentInfo.threadId,
        args: A
    }), nP.delete(q)
}
// @from(Ln 263947, Col 0)
function yb4(q) {
    if (!Lx) return "";
    let K = QI8(),
        _ = UI8();
    return nP.set(K, {
        name: "Waiting for User Input",
        category: "user_input",
        startTime: o56(),
        agentInfo: _,
        args: {
            context: q
        }
    }), jT.push({
        name: "Waiting for User Input",
        cat: "user_input",
        ph: "B",
        ts: nP.get(K).startTime,
        pid: _.processId,
        tid: _.threadId,
        args: nP.get(K).args
    }), K
}
// @from(Ln 263970, Col 0)
function Lb4(q, K) {
    if (!Lx || !q) return;
    let _ = nP.get(q);
    if (!_) return;
    let z = o56(),
        Y = z - _.startTime,
        A = {
            ..._.args,
            decision: K?.decision,
            source: K?.source,
            duration_ms: Y / 1000
        };
    jT.push({
        name: _.name,
        cat: _.category,
        ph: "E",
        ts: z,
        pid: _.agentInfo.processId,
        tid: _.agentInfo.threadId,
        args: A
    }), nP.delete(q)
}
// @from(Ln 263993, Col 0)
function hb4(q) {
    if (!Lx) return "";
    let K = QI8(),
        _ = UI8();
    return nP.set(K, {
        name: "Interaction",
        category: "interaction",
        startTime: o56(),
        agentInfo: _,
        args: {
            user_prompt_length: q?.length
        }
    }), jT.push({
        name: "Interaction",
        cat: "interaction",
        ph: "B",
        ts: nP.get(K).startTime,
        pid: _.processId,
        tid: _.threadId,
        args: nP.get(K).args
    }), K
}
// @from(Ln 264016, Col 0)
function Rb4(q) {
    if (!Lx || !q) return;
    let K = nP.get(q);
    if (!K) return;
    let _ = o56(),
        z = _ - K.startTime;
    jT.push({
        name: K.name,
        cat: K.category,
        ph: "E",
        ts: _,
        pid: K.agentInfo.processId,
        tid: K.agentInfo.threadId,
        args: {
            ...K.args,
            duration_ms: z / 1000
        }
    }), nP.delete(q)
}
// @from(Ln 264035, Col 4)
Lx = !1
// @from(Ln 264036, Col 4)
Ci1
// @from(Ln 264036, Col 9)
jT
// @from(Ln 264036, Col 13)
nP
// @from(Ln 264036, Col 17)
gI8
// @from(Ln 264036, Col 22)
fb4 = 0
// @from(Ln 264037, Col 4)
K0z = 0
// @from(Ln 264038, Col 4)
_0z = 0
// @from(Ln 264039, Col 4)
bi1 = 1
// @from(Ln 264040, Col 4)
Ii1
// @from(Ln 264041, Col 4)
ih6 = L(() => {
    y8();
    R9();
    K8();
    Q8();
    m8();
    e8();
    zY();
    Ci1 = [], jT = [], nP = new Map, gI8 = new Map, Ii1 = new Map
})
// @from(Ln 264052, Col 0)
function Y0z(q, K) {
    if (K) return "plan";
    if (q === "plan" || q === "dontAsk") return "default";
    return q
}
// @from(Ln 264057, Col 0)
async function cI8(q, K) {
    let {
        name: _,
        teamName: z,
        prompt: Y,
        color: A,
        planModeRequired: O,
        model: w
    } = q, {
        taskRegistry: $
    } = K, j = op(_, z), H = cR("in_process_teammate");
    E(`[spawnInProcessTeammate] Spawning ${j} (taskId: ${H})`);
    try {
        let J = F5(),
            X = I8(),
            M = {
                agentId: j,
                agentName: _,
                teamName: z,
                color: A,
                planModeRequired: O,
                parentSessionId: X
            },
            P = nZ8({
                agentId: j,
                agentName: _,
                teamName: z,
                color: A,
                planModeRequired: O,
                parentSessionId: X,
                abortController: J
            });
        if (es()) dI8(j, _, X);
        let W = `${_}: ${Y.substring(0,50)}${Y.length>50?"...":""}`,
            D = {
                ...cf(H, "in_process_teammate", W, K.toolUseId),
                type: "in_process_teammate",
                status: "running",
                identity: M,
                prompt: Y,
                model: w,
                abortController: J,
                awaitingPlanApproval: !1,
                spinnerVerb: LJ(AJ6()),
                pastTenseVerb: LJ(nh6),
                permissionMode: Y0z(K.getAppState().toolPermissionContext.mode, O),
                isIdle: !1,
                shutdownRequested: !1,
                lastReportedToolCount: 0,
                lastReportedTokenCount: 0,
                pendingUserMessages: [],
                messages: []
            },
            Z = eq(async () => {
                E(`[spawnInProcessTeammate] Cleanup called for ${j}`), J.abort()
            });
        return D.unregisterCleanup = Z, $.register(D), E(`[spawnInProcessTeammate] Registered ${j} in AppState`), {
            success: !0,
            agentId: j,
            taskId: H,
            abortController: J,
            teammateContext: P
        }
    } catch (J) {
        let X = J instanceof Error ? J.message : "Unknown error during spawn";
        return E(`[spawnInProcessTeammate] Failed to spawn ${j}: ${X}`), {
            success: !1,
            agentId: j,
            error: X
        }
    }
}
// @from(Ln 264130, Col 0)
function W18(q, K, _) {
    let z = !1,
        Y = null,
        A = null,
        O, w;
    if (K.update(q, ($) => {
            if ($.status !== "running") return $;
            return Y = $.identity.teamName, A = $.identity.agentId, O = $.toolUseId, w = $.description, $.abortController?.abort(), $.unregisterCleanup?.(), z = !0, $.onIdleCallbacks?.forEach((j) => j()), {
                ...$,
                status: "killed",
                notified: !0,
                endTime: Date.now(),
                onIdleCallbacks: [],
                messages: $.messages?.length ? [$.messages.at(-1)] : void 0,
                pendingUserMessages: [],
                inProgressToolUseIDs: void 0,
                abortController: void 0,
                unregisterCleanup: void 0,
                currentWorkAbortController: void 0
            }
        }), z && A) _(($) => {
        if (!$.teamContext?.teammates?.[A]) return $;
        let {
            [A]: j, ...H
        } = $.teamContext.teammates;
        return {
            ...$,
            teamContext: {
                ...$.teamContext,
                teammates: H
            }
        }
    });
    if (Y && A) xi1(Y, A);
    if (z) n2(q), I$(q, "stopped", {
        toolUseId: O,
        summary: w
    }), setTimeout(($, j) => $.evictTerminal(j), nS4, K, q);
    if (A) OJ6(A);
    return z
}
// @from(Ln 264171, Col 4)
D18 = L(() => {
    uc();
    y8();
    pI8();
    FI8();
    $T();
    x$();
    R9();
    K8();
    BP();
    EH();
    bc();
    Rv();
    ih6();
    BD()
})
// @from(Ln 264187, Col 4)
Sb4 = {}
// @from(Ln 264198, Col 0)
function ui1(q, K) {
    K.update(q, (_) => {
        if (_.status !== "running" || _.shutdownRequested) return _;
        return {
            ..._,
            shutdownRequested: !0
        }
    })
}
// @from(Ln 264208, Col 0)
function lI8(q, K, _) {
    _.update(q, (z) => {
        if (z.status !== "running") return z;
        return {
            ...z,
            messages: QH6(z.messages, K)
        }
    })
}
// @from(Ln 264218, Col 0)
function f18(q, K, _) {
    _.update(q, (z) => {
        if (np(z.status)) return E(`Dropping message for teammate task ${q}: task status is "${z.status}"`), z;
        return {
            ...z,
            pendingUserMessages: [...z.pendingUserMessages, K],
            messages: QH6(z.messages, t8({
                content: K
            }))
        }
    })
}
// @from(Ln 264231, Col 0)
function mc(q, K) {
    let _;
    for (let z of Object.values(K))
        if (EJ(z) && z.identity.agentId === q) {
            if (z.status === "running") return z;
            if (!_) _ = z
        } return _
}
// @from(Ln 264240, Col 0)
function wJ6(q) {
    return Object.values(q).filter(EJ)
}
// @from(Ln 264244, Col 0)
function qt(q) {
    return wJ6(q).filter((K) => K.status === "running").sort((K, _) => K.identity.agentName.localeCompare(_.identity.agentName))
}
// @from(Ln 264247, Col 4)
Z18
// @from(Ln 264248, Col 4)
hx = L(() => {
    $T();
    K8();
    _7();
    D18();
    Z18 = {
        name: "InProcessTeammateTask",
        type: "in_process_teammate",
        async kill(q, K, _) {
            W18(q, K, _)
        }
    }
})
// @from(Ln 264261, Col 4)
nI8
// @from(Ln 264261, Col 9)
iI8
// @from(Ln 264262, Col 4)
Cb4 = L(() => {
    p7();
    nI8 = C6(() => fK.enum(["allow", "deny", "ask"])), iI8 = C6(() => fK.object({
        toolName: fK.string(),
        ruleContent: fK.string().optional()
    }))
})
// @from(Ln 264269, Col 4)
rh6
// @from(Ln 264269, Col 9)
oh6
// @from(Ln 264270, Col 4)
rI8 = L(() => {
    p7();
    OP();
    Cb4();
    rh6 = C6(() => fK.enum(["userSettings", "projectSettings", "localSettings", "session", "cliArg"])), oh6 = C6(() => fK.discriminatedUnion("type", [fK.object({
        type: fK.literal("addRules"),
        rules: fK.array(iI8()),
        behavior: nI8(),
        destination: rh6()
    }), fK.object({
        type: fK.literal("replaceRules"),
        rules: fK.array(iI8()),
        behavior: nI8(),
        destination: rh6()
    }), fK.object({
        type: fK.literal("removeRules"),
        rules: fK.array(iI8()),
        behavior: nI8(),
        destination: rh6()
    }), fK.object({
        type: fK.literal("setMode"),
        mode: Hg7(),
        destination: rh6()
    }), fK.object({
        type: fK.literal("addDirectories"),
        directories: fK.array(fK.string()),
        destination: rh6()
    }), fK.object({
        type: fK.literal("removeDirectories"),
        directories: fK.array(fK.string()),
        destination: rh6()
    })]))
})
// @from(Ln 264304, Col 0)
function A0z() {
    return `perm-${Date.now()}-${Math.random().toString(36).substring(2,9)}`
}
// @from(Ln 264308, Col 0)
function oI8(q) {
    let K = q.teamName || Z9(),
        _ = q.workerId || mW(),
        z = q.workerName || T_(),
        Y = q.workerColor || KH();
    if (!K) throw Error("Team name is required for permission requests");
    if (!_) throw Error("Worker ID is required for permission requests");
    if (!z) throw Error("Worker name is required for permission requests");
    return {
        id: A0z(),
        workerId: _,
        workerName: z,
        workerColor: Y,
        teamName: K,
        toolName: q.toolName,
        toolUseId: q.toolUseId,
        description: q.description,
        input: q.input,
        permissionSuggestions: q.permissionSuggestions || [],
        status: "pending",
        createdAt: Date.now()
    }
}
// @from(Ln 264332, Col 0)
function O0z(q) {
    if (!(q || Z9())) return !1;
    let _ = mW();
    return !_ || _ === "team-lead"
}
// @from(Ln 264338, Col 0)
function G18() {
    let q = Z9(),
        K = mW();
    return !!q && !!K && !O0z()
}
// @from(Ln 264343, Col 0)
async function bb4(q) {
    let K = q || Z9();
    if (!K) return null;
    let _ = await $J6(K);
    if (!_) return E(`[PermissionSync] Team file not found for team: ${K}`), null;
    return _.members.find((Y) => Y.agentId === _.leadAgentId)?.name || "team-lead"
}
// @from(Ln 264350, Col 0)
async function aI8(q) {
    let K = await bb4(q.teamName);
    if (!K) return E("[PermissionSync] Cannot send permission request: leader name not found"), !1;
    try {
        let _ = Ti1({
            request_id: q.id,
            agent_id: q.workerName,
            tool_name: q.toolName,
            tool_use_id: q.toolUseId,
            description: q.description,
            input: q.input,
            permission_suggestions: q.permissionSuggestions
        });
        return await F_(K, {
            from: q.workerName,
            text: I6(_),
            timestamp: new Date().toISOString(),
            color: q.workerColor
        }, q.teamName), E(`[PermissionSync] Sent permission request ${q.id} to leader ${K} via mailbox`), !0
    } catch (_) {
        return E(`[PermissionSync] Failed to send permission request via mailbox: ${_}`), j6(_), !1
    }
}
// @from(Ln 264373, Col 0)
async function sI8(q, K, _, z) {
    let Y = z || Z9();
    if (!Y) return E("[PermissionSync] Cannot send permission response: team name not found"), !1;
    try {
        let A = Vi1({
                request_id: _,
                subtype: K.decision === "approved" ? "success" : "error",
                error: K.feedback,
                updated_input: K.updatedInput,
                permission_updates: K.permissionUpdates
            }),
            O = T_() || "team-lead";
        return await F_(q, {
            from: O,
            text: I6(A),
            timestamp: new Date().toISOString()
        }, Y), E(`[PermissionSync] Sent permission response for ${_} to worker ${q} via mailbox`), !0
    } catch (A) {
        return E(`[PermissionSync] Failed to send permission response via mailbox: ${A}`), j6(A), !1
    }
}
// @from(Ln 264395, Col 0)
function Ib4() {
    return `sandbox-${Date.now()}-${Math.random().toString(36).substring(2,9)}`
}
// @from(Ln 264398, Col 0)
async function xb4(q, K, _) {
    let z = _ || Z9();
    if (!z) return E("[PermissionSync] Cannot send sandbox permission request: team name not found"), !1;
    let Y = await bb4(z);
    if (!Y) return E("[PermissionSync] Cannot send sandbox permission request: leader name not found"), !1;
    let A = mW(),
        O = T_(),
        w = KH();
    if (!A || !O) return E("[PermissionSync] Cannot send sandbox permission request: worker ID or name not found"), !1;
    try {
        let $ = ki1({
            requestId: K,
            workerId: A,
            workerName: O,
            workerColor: w,
            host: q
        });
        return await F_(Y, {
            from: O,
            text: I6($),
            timestamp: new Date().toISOString(),
            color: w
        }, z), E(`[PermissionSync] Sent sandbox permission request ${K} for host ${q} to leader ${Y} via mailbox`), !0
    } catch ($) {
        return E(`[PermissionSync] Failed to send sandbox permission request via mailbox: ${$}`), j6($), !1
    }
}
// @from(Ln 264425, Col 0)
async function tI8(q, K, _, z, Y) {
    let A = Y || Z9();
    if (!A) return E("[PermissionSync] Cannot send sandbox permission response: team name not found"), !1;
    try {
        let O = Ni1({
                requestId: K,
                host: _,
                allow: z
            }),
            w = T_() || "team-lead";
        return await F_(q, {
            from: w,
            text: I6(O),
            timestamp: new Date().toISOString()
        }, A), E(`[PermissionSync] Sent sandbox permission response for ${K} (host: ${_}, allow: ${z}) to worker ${q} via mailbox`), !0
    } catch (O) {
        return E(`[PermissionSync] Failed to send sandbox permission response via mailbox: ${O}`), j6(O), !1
    }
}
// @from(Ln 264444, Col 4)
egw
// @from(Ln 264445, Col 4)
ah6 = L(() => {
    p7();
    K8();
    m8();
    U8();
    e8();
    zY();
    ZX();
    BD();
    egw = C6(() => y.object({
        id: y.string(),
        workerId: y.string(),
        workerName: y.string(),
        workerColor: y.string().optional(),
        teamName: y.string(),
        toolName: y.string(),
        toolUseId: y.string(),
        description: y.string(),
        input: y.record(y.string(), y.unknown()),
        permissionSuggestions: y.array(y.unknown()),
        status: y.enum(["pending", "approved", "rejected"]),
        resolvedBy: y.enum(["worker", "leader"]).optional(),
        resolvedAt: y.number().optional(),
        feedback: y.string().optional(),
        updatedInput: y.record(y.string(), y.unknown()).optional(),
        permissionUpdates: y.array(y.unknown()).optional(),
        createdAt: y.number()
    }))
})
// @from(Ln 264475, Col 0)
function w0z(q) {
    if (!Array.isArray(q)) return [];
    let K = oh6(),
        _ = [];
    for (let z of q) {
        let Y = K.safeParse(z);
        if (Y.success) _.push(Y.data);
        else E(`[SwarmPermissionPoller] Dropping malformed permissionUpdate entry: ${Y.error.message}`, {
            level: "warn"
        })
    }
    return _
}
// @from(Ln 264489, Col 0)
function eI8(q) {
    th6.set(q.requestId, q), E(`[SwarmPermissionPoller] Registered callback for request ${q.requestId}`)
}
// @from(Ln 264493, Col 0)
function ub4(q) {
    th6.delete(q), E(`[SwarmPermissionPoller] Unregistered callback for request ${q}`)
}
// @from(Ln 264497, Col 0)
function mb4(q) {
    return th6.has(q)
}
// @from(Ln 264501, Col 0)
function Bb4() {
    th6.clear(), v18.clear()
}
// @from(Ln 264505, Col 0)
function eh6(q) {
    let K = th6.get(q.requestId);
    if (!K) return E(`[SwarmPermissionPoller] No callback registered for mailbox response ${q.requestId}`), !1;
    if (E(`[SwarmPermissionPoller] Processing mailbox response for request ${q.requestId}: ${q.decision}`), th6.delete(q.requestId), q.decision === "approved") {
        let _ = w0z(q.permissionUpdates),
            z = q.updatedInput;
        K.onAllow(z, _)
    } else K.onReject(q.feedback);
    return !0
}
// @from(Ln 264516, Col 0)
function pb4(q) {
    v18.set(q.requestId, q), E(`[SwarmPermissionPoller] Registered sandbox callback for request ${q.requestId}`)
}
// @from(Ln 264520, Col 0)
function Fb4(q) {
    return v18.has(q)
}
// @from(Ln 264524, Col 0)
function gb4(q) {
    let K = v18.get(q.requestId);
    if (!K) return E(`[SwarmPermissionPoller] No sandbox callback registered for request ${q.requestId}`), !1;
    return E(`[SwarmPermissionPoller] Processing sandbox response for request ${q.requestId}: allow=${q.allow}`), v18.delete(q.requestId), K.resolve(q.allow), !0
}
// @from(Ln 264529, Col 4)
mi1
// @from(Ln 264529, Col 9)
th6
// @from(Ln 264529, Col 14)
v18
// @from(Ln 264530, Col 4)
qR6 = L(() => {
    K8();
    m8();
    rI8();
    ah6();
    zY();
    mi1 = K6(P6(), 1);
    th6 = new Map;
    v18 = new Map
})
// @from(Ln 264541, Col 0)
function qx8(q) {
    let K = {
            toolRequests: new Map,
            toolResults: new Map,
            humanMessages: 0,
            assistantMessages: 0,
            localCommandOutputs: 0,
            other: 0,
            attachments: new Map,
            duplicateFileReads: new Map,
            total: 0
        },
        _ = new Map,
        z = new Map,
        Y = new Map;
    return q.forEach((O) => {
        if (O.type === "attachment") {
            let w = O.attachment.type || "unknown";
            K.attachments.set(w, (K.attachments.get(w) || 0) + 1)
        }
    }), K0(q).forEach((O) => {
        let {
            content: w
        } = O.message;
        if (typeof w === "string") {
            let $ = w_(w);
            if (K.total += $, O.type === "user" && w.includes("local-command-stdout")) K.localCommandOutputs += $;
            else K[O.type === "user" ? "humanMessages" : "assistantMessages"] += $
        } else w.forEach(($) => $0z($, O, K, _, z, Y))
    }), Y.forEach((O, w) => {
        if (O.count > 1) {
            let j = Math.floor(O.totalTokens / O.count) * (O.count - 1);
            K.duplicateFileReads.set(w, {
                count: O.count,
                tokens: j
            })
        }
    }), K
}
// @from(Ln 264581, Col 0)
function $0z(q, K, _, z, Y, A) {
    let O = w_(I6(q));
    switch (_.total += O, q.type) {
        case "text":
            if (K.type === "user" && "text" in q && q.text.includes("local-command-stdout")) _.localCommandOutputs += O;
            else _[K.type === "user" ? "humanMessages" : "assistantMessages"] += O;
            break;
        case "tool_use": {
            if ("name" in q && "id" in q) {
                let w = q.name || "unknown";
                if (Ub4(_.toolRequests, w, O), z.set(q.id, w), w === "Read" && "input" in q && q.input && typeof q.input === "object" && "file_path" in q.input) {
                    let $ = String(q.input.file_path);
                    Y.set(q.id, $)
                }
            }
            break
        }
        case "tool_result": {
            if ("tool_use_id" in q) {
                let w = z.get(q.tool_use_id) || "unknown";
                if (Ub4(_.toolResults, w, O), w === "Read") {
                    let $ = Y.get(q.tool_use_id);
                    if ($) {
                        let j = A.get($) || {
                            count: 0,
                            totalTokens: 0
                        };
                        A.set($, {
                            count: j.count + 1,
                            totalTokens: j.totalTokens + O
                        })
                    }
                }
            }
            break
        }
        case "image":
        case "server_tool_use":
        case "web_search_tool_result":
        case "search_result":
        case "document":
        case "thinking":
        case "redacted_thinking":
        case "code_execution_tool_result":
        case "mcp_tool_use":
        case "mcp_tool_result":
        case "container_upload":
        case "web_fetch_tool_result":
        case "bash_code_execution_tool_result":
        case "text_editor_code_execution_tool_result":
        case "tool_search_tool_result":
        case "compaction":
            _.other += O;
            break
    }
}
// @from(Ln 264638, Col 0)
function Ub4(q, K, _) {
    q.set(K, (q.get(K) || 0) + _)
}
// @from(Ln 264642, Col 0)
function Kx8(q) {
    let K = {
        total_tokens: q.total,
        human_message_tokens: q.humanMessages,
        assistant_message_tokens: q.assistantMessages,
        local_command_output_tokens: q.localCommandOutputs,
        other_tokens: q.other
    };
    q.attachments.forEach((z, Y) => {
        K[`attachment_${Y}_count`] = z
    }), q.toolRequests.forEach((z, Y) => {
        K[`tool_request_${Y}_tokens`] = z
    }), q.toolResults.forEach((z, Y) => {
        K[`tool_result_${Y}_tokens`] = z
    });
    let _ = [...q.duplicateFileReads.values()].reduce((z, Y) => z + Y.tokens, 0);
    if (K.duplicate_read_tokens = _, K.duplicate_read_file_count = q.duplicateFileReads.size, q.total > 0) {
        K.human_message_percent = Math.round(q.humanMessages / q.total * 100), K.assistant_message_percent = Math.round(q.assistantMessages / q.total * 100), K.local_command_output_percent = Math.round(q.localCommandOutputs / q.total * 100), K.duplicate_read_percent = Math.round(_ / q.total * 100);
        let z = [...q.toolRequests.values()].reduce((A, O) => A + O, 0),
            Y = [...q.toolResults.values()].reduce((A, O) => A + O, 0);
        K.tool_request_percent = Math.round(z / q.total * 100), K.tool_result_percent = Math.round(Y / q.total * 100), q.toolRequests.forEach((A, O) => {
            K[`tool_request_${O}_percent`] = Math.round(A / q.total * 100)
        }), q.toolResults.forEach((A, O) => {
            K[`tool_result_${O}_percent`] = Math.round(A / q.total * 100)
        })
    }
    return K
}
// @from(Ln 264670, Col 4)
Bi1 = L(() => {
    Nk();
    _7();
    e8()
})
// @from(Ln 264676, Col 0)
function HT(q) {
    let K = E1("policySettings")?.strictPluginOnlyCustomization;
    if (K === !0) return !0;
    if (Array.isArray(K)) return K.includes(q);
    return !1
}
// @from(Ln 264683, Col 0)
function T18(q) {
    return q !== void 0 && j0z.has(q)
}
// @from(Ln 264686, Col 4)
j0z
// @from(Ln 264687, Col 4)
jJ6 = L(() => {
    a1();
    j0z = new Set(["plugin", "policySettings", "built-in", "builtin", "bundled"])
})
// @from(Ln 264692, Col 0)
function H0z() {
    return {
        initialHooksConfig: null
    }
}
// @from(Ln 264698, Col 0)
function Qb4() {
    let q = E1("policySettings");
    if (q?.disableAllHooks === !0) return {};
    if (q?.allowManagedHooksOnly === !0) return q.hooks ?? {};
    if (HT("hooks")) return q?.hooks ?? {};
    let K = y7();
    if (K.disableAllHooks === !0) return q?.hooks ?? {};
    return K.hooks ?? {}
}
// @from(Ln 264708, Col 0)
function Ey() {
    let q = E1("policySettings");
    if (q?.allowManagedHooksOnly === !0) return !0;
    if (y7().disableAllHooks === !0 && q?.disableAllHooks !== !0) return !0;
    return !1
}
// @from(Ln 264715, Col 0)
function Kt() {
    return E1("policySettings")?.disableAllHooks === !0
}
// @from(Ln 264719, Col 0)
function pi1() {
    _x8.initialHooksConfig = Qb4()
}
// @from(Ln 264723, Col 0)
function KR6() {
    u0(), _x8.initialHooksConfig = Qb4()
}
// @from(Ln 264727, Col 0)
function Rx() {
    if (_x8.initialHooksConfig === null) pi1();
    return _x8.initialHooksConfig
}
// @from(Ln 264731, Col 4)
_x8
// @from(Ln 264732, Col 4)
Bc = L(() => {
    jJ6();
    a1();
    Li();
    _x8 = H0z()
})
// @from(Ln 264743, Col 0)
function M0z() {
    let q = null,
        K, _ = [],
        z = [],
        Y = !1,
        A = !1,
        O = null,
        w = null;

    function $(Z) {
        O = Z
    }

    function j(Z) {
        if (Y) return;
        Y = !0, K = Z;
        let G = Rx();
        if (A = (G?.CwdChanged?.length ?? 0) > 0 || (G?.FileChanged?.length ?? 0) > 0, A) w = eq(async () => D());
        let f = H(G);
        if (f.length === 0) return;
        J(f)
    }

    function H(Z) {
        let G = (Z ?? Rx())?.FileChanged ?? [],
            f = [];
        for (let v of G) {
            if (!v.matcher) continue;
            for (let V of v.matcher.split("|").map((k) => k.trim())) {
                if (!V) continue;
                f.push(J0z(V) ? V : X0z(K, V))
            }
        }
        return F4([...f, ..._])
    }

    function J(Z) {
        E(`FileChanged: watching ${Z.length} paths`), q = oa.watch(Z, {
            persistent: !0,
            ignoreInitial: !0,
            awaitWriteFinish: {
                stabilityThreshold: 500,
                pollInterval: 200
            },
            ignorePermissionErrors: !0
        }), q.on("change", (G) => X(G, "change")), q.on("add", (G) => X(G, "add")), q.on("unlink", (G) => X(G, "unlink"))
    }

    function X(Z, G) {
        E(`FileChanged: ${G} ${Z}`), N18(Z, G).then(({
            results: f,
            watchPaths: v,
            systemMessages: V
        }) => {
            if (v.length > 0) M(v);
            for (let k of V) O?.(k, !1);
            for (let k of f)
                if (!k.succeeded && k.output) O?.(k.output, !0)
        }).catch((f) => {
            let v = b6(f);
            E(`FileChanged hook failed: ${v}`, {
                level: "error"
            }), O?.(v, !0)
        })
    }

    function M(Z) {
        if (!Y) return;
        let G = Z.slice().sort();
        if (G.length === z.length && G.every((f, v) => f === z[v])) return;
        _ = Z, z = G, P()
    }

    function P() {
        if (q) q.close(), q = null;
        let Z = H();
        if (Z.length > 0) J(Z)
    }
    async function W(Z, G) {
        if (Z === G) return;
        let f = Rx();
        if (!((f?.CwdChanged?.length ?? 0) > 0 || (f?.FileChanged?.length ?? 0) > 0)) return;
        K = G, await MC4();
        let V = await k18(Z, G).catch((k) => {
            let N = b6(k);
            return E(`CwdChanged hook failed: ${N}`, {
                level: "error"
            }), O?.(N, !0), {
                results: [],
                watchPaths: [],
                systemMessages: []
            }
        });
        _ = V.watchPaths, z = V.watchPaths.slice().sort();
        for (let k of V.systemMessages) O?.(k, !1);
        for (let k of V.results)
            if (!k.succeeded && k.output) O?.(k.output, !0);
        if (Y) P()
    }

    function D() {
        if (w) w(), w = null;
        if (q) q.close(), q = null;
        _ = [], z = [], Y = !1, A = !1, O = null
    }
    return {
        initialize: j,
        setEnvHookNotifier: $,
        updateWatchPaths: M,
        onCwdChanged: W,
        dispose: D
    }
}
// @from(Ln 264856, Col 4)
zx8
// @from(Ln 264856, Col 9)
db4
// @from(Ln 264856, Col 14)
Fi1
// @from(Ln 264856, Col 19)
cb4
// @from(Ln 264856, Col 24)
lb4
// @from(Ln 264857, Col 4)
V18 = L(() => {
    AE6();
    R9();
    K8();
    m8();
    K9();
    oH6();
    Bc();
    zx8 = M0z(), db4 = zx8.initialize, Fi1 = zx8.setEnvHookNotifier, cb4 = zx8.updateWatchPaths, lb4 = zx8.onCwdChanged
})
// @from(Ln 264867, Col 4)
di1 = {}
// @from(Ln 264877, Col 0)
function P0z(q) {
    let K = {
        PreToolUse: [],
        PostToolUse: [],
        PostToolUseFailure: [],
        PermissionDenied: [],
        Notification: [],
        UserPromptSubmit: [],
        SessionStart: [],
        SessionEnd: [],
        Stop: [],
        StopFailure: [],
        SubagentStart: [],
        SubagentStop: [],
        PreCompact: [],
        PostCompact: [],
        PermissionRequest: [],
        Setup: [],
        TeammateIdle: [],
        TaskCreated: [],
        TaskCompleted: [],
        Elicitation: [],
        ElicitationResult: [],
        ConfigChange: [],
        WorktreeCreate: [],
        WorktreeRemove: [],
        InstructionsLoaded: [],
        CwdChanged: [],
        FileChanged: []
    };
    if (!q.hooksConfig) return K;
    for (let [_, z] of Object.entries(q.hooksConfig)) {
        let Y = _;
        if (!K[Y]) continue;
        for (let A of z)
            if (A.hooks.length > 0) K[Y].push({
                matcher: A.matcher,
                hooks: A.hooks,
                pluginRoot: q.path,
                pluginName: q.name,
                pluginId: q.source
            })
    }
    return K
}
// @from(Ln 264923, Col 0)
function Ax8() {
    pc.cache?.clear?.()
}
// @from(Ln 264926, Col 0)
async function Qi1() {
    if (!rL()) return;
    let {
        enabled: q
    } = await Gj(), K = new Set(q.map((Y) => Y.path)), _ = rL();
    if (!_) return;
    let z = {};
    for (let [Y, A] of Object.entries(_)) {
        let O = A.filter((w) => ("pluginRoot" in w) && K.has(w.pluginRoot));
        if (O.length > 0) z[Y] = O
    }
    oO8(), Ii(z)
}
// @from(Ln 264940, Col 0)
function W0z() {
    gi1 = !1, Yx8 = void 0
}
// @from(Ln 264944, Col 0)
function Ui1() {
    let q = y7(),
        K = E1("policySettings"),
        _ = (z) => z ? Object.fromEntries(Object.entries(z).sort()) : {};
    return I6({
        enabledPlugins: _(q.enabledPlugins),
        extraKnownMarketplaces: _(q.extraKnownMarketplaces),
        strictKnownMarketplaces: K?.strictKnownMarketplaces ?? [],
        blockedMarketplaces: K?.blockedMarketplaces ?? []
    })
}
// @from(Ln 264956, Col 0)
function D0z() {
    if (gi1) return;
    gi1 = !0, Yx8 = Ui1(), _y.subscribe((q) => {
        if (q === "policySettings") {
            let K = Ui1();
            if (K === Yx8) {
                E("Plugin hooks: skipping reload, plugin-affecting settings unchanged");
                return
            }
            Yx8 = K, E("Plugin hooks: reloading due to plugin-affecting settings change"), bk("loadPluginHooks: plugin-affecting settings changed"), Ax8(), pc()
        }
    })
}
// @from(Ln 264969, Col 4)
gi1 = !1
// @from(Ln 264970, Col 4)
Yx8
// @from(Ln 264970, Col 9)
pc
// @from(Ln 264971, Col 4)
HJ6 = L(() => {
    U4();
    y8();
    K8();
    zK6();
    a1();
    e8();
    vH();
    pc = P1(async () => {
        let {
            enabled: q
        } = await Gj(), K = {
            PreToolUse: [],
            PostToolUse: [],
            PostToolUseFailure: [],
            PermissionDenied: [],
            Notification: [],
            UserPromptSubmit: [],
            SessionStart: [],
            SessionEnd: [],
            Stop: [],
            StopFailure: [],
            SubagentStart: [],
            SubagentStop: [],
            PreCompact: [],
            PostCompact: [],
            PermissionRequest: [],
            Setup: [],
            TeammateIdle: [],
            TaskCreated: [],
            TaskCompleted: [],
            Elicitation: [],
            ElicitationResult: [],
            ConfigChange: [],
            WorktreeCreate: [],
            WorktreeRemove: [],
            InstructionsLoaded: [],
            CwdChanged: [],
            FileChanged: []
        };
        for (let z of q) {
            if (!z.hooksConfig) continue;
            E(`Loading hooks from plugin: ${z.name}`);
            let Y = P0z(z);
            for (let A of Object.keys(Y)) K[A].push(...Y[A])
        }
        oO8(), Ii(K);
        let _ = Object.values(K).reduce((z, Y) => z + Y.reduce((A, O) => A + O.hooks.length, 0), 0);
        E(`Registered ${_} hooks from ${q.length} plugins`)
    })
})
// @from(Ln 265023, Col 0)
function nb4() {
    let q = ci1;
    return ci1 = void 0, q
}
// @from(Ln 265027, Col 0)
async function lR(q, {
    sessionId: K,
    agentType: _,
    model: z,
    forceSyncExecution: Y
} = {}) {
    if (S9()) return [];
    let A = [],
        O = [],
        w = [];
    if (Ey() && OL6() === null) E("Skipping plugin hooks - allowManagedHooksOnly is enabled and no managed plugins");
    else try {
        await Rf6("load_plugin_hooks", () => pc())
    } catch (j) {
        let H = j instanceof Error ? Error(`Failed to load plugin hooks during ${q}: ${j.message}`) : Error(`Failed to load plugin hooks during ${q}: ${String(j)}`);
        if (j instanceof Error && j.stack) H.stack = j.stack;
        j6(H);
        let J = j instanceof Error ? j.message : String(j),
            X = "";
        if (J.includes("Failed to clone") || J.includes("network") || J.includes("ETIMEDOUT") || J.includes("ENOTFOUND")) X = "This appears to be a network issue. Check your internet connection and try again.";
        else if (J.includes("Permission denied") || J.includes("EACCES") || J.includes("EPERM")) X = "This appears to be a permissions issue. Check file permissions on ~/.claude/plugins/";
        else if (J.includes("Invalid") || J.includes("parse") || J.includes("JSON") || J.includes("schema")) X = "This appears to be a configuration issue. Check your plugin settings in .claude/settings.json";
        else X = "Please fix the plugin configuration or remove problematic plugins from your settings.";
        E(`Warning: Failed to load plugin hooks. SessionStart hooks from plugins will not execute. Error: ${J}. ${X}`, {
            level: "warn"
        })
    }
    let $ = _ ?? lg();
    for await (let j of E18(q, K, $, z, void 0, void 0, Y)) {
        if (j.message) A.push(j.message);
        if (j.additionalContexts && j.additionalContexts.length > 0) O.push(...j.additionalContexts);
        if (j.initialUserMessage) ci1 = j.initialUserMessage;
        if (j.watchPaths && j.watchPaths.length > 0) w.push(...j.watchPaths)
    }
    if (w.length > 0) cb4(w);
    if (O.length > 0) {
        let j = Y4({
            type: "hook_additional_context",
            content: O,
            hookName: "SessionStart",
            toolUseID: "SessionStart",
            hookEvent: "SessionStart"
        });
        A.push(j)
    }
    return A
}
// @from(Ln 265074, Col 0)
async function ib4(q, {
    forceSyncExecution: K
} = {}) {
    if (S9()) return [];
    let _ = [],
        z = [];
    if (Ey() && OL6() === null) E("Skipping plugin hooks - allowManagedHooksOnly is enabled and no managed plugins");
    else try {
        await pc()
    } catch (Y) {
        let A = Y instanceof Error ? Y.message : String(Y);
        E(`Warning: Failed to load plugin hooks. Setup hooks from plugins will not execute. Error: ${A}`, {
            level: "warn"
        })
    }
    for await (let Y of y18(q, void 0, void 0, K)) {
        if (Y.message) _.push(Y.message);
        if (Y.additionalContexts && Y.additionalContexts.length > 0) z.push(...Y.additionalContexts)
    }
    if (z.length > 0) {
        let Y = Y4({
            type: "hook_additional_context",
            content: z,
            hookName: "Setup",
            toolUseID: "Setup",
            hookEvent: "Setup"
        });
        _.push(Y)
    }
    return _
}
// @from(Ln 265105, Col 4)
ci1
// @from(Ln 265106, Col 4)
a56 = L(() => {
    y8();
    ZM();
    K8();
    VA();
    Q8();
    V18();
    Bc();
    K9();
    U8();
    HJ6();
    iK6()
})
// @from(Ln 265122, Col 0)
async function _R6(q, K) {
    return
}
// @from(Ln 265125, Col 4)
Z0z
// @from(Ln 265125, Col 9)
f0z
// @from(Ln 265126, Col 4)
Ox8 = L(() => {
    U4();
    e8();
    C8();
    Z0z = P1(async () => {
        return null
    }), f0z = P1(async () => {
        return null
    })
})
// @from(Ln 265137, Col 0)
function ab4() {
    return S6(process.env.OTEL_LOG_RAW_API_BODIES)
}
// @from(Ln 265141, Col 0)
function sb4(q, K, _) {
    let z = I6(K),
        Y = z.length > ob4;
    Xz(q, {
        body: Y ? z.slice(0, ob4) + `

[TRUNCATED - Content exceeds 60KB limit]` : z,
        body_length: String(z.length),
        ...Y && {
            body_truncated: "true"
        },
        ..._
    })
}
// @from(Ln 265156, Col 0)
function tb4(q) {
    return q.map((K) => {
        if (K.type === "thinking") return {
            ...K,
            thinking: "<REDACTED>"
        };
        if (K.type === "redacted_thinking") return {
            ...K,
            data: "<REDACTED>"
        };
        return K
    })
}
// @from(Ln 265170, Col 0)
function G0z(q) {
    return {
        ...q,
        messages: q.messages.map((K) => K.role === "assistant" && Array.isArray(K.content) ? {
            ...K,
            content: tb4(K.content)
        } : K)
    }
}
// @from(Ln 265180, Col 0)
function wx8(q, K) {
    if (!ab4()) return;
    let _ = G0z(q);
    sb4("api_request_body", _, {
        model: q.model,
        query_source: K
    })
}
// @from(Ln 265189, Col 0)
function eb4(q, K) {
    if (!ab4() || q.length === 0) return;
    let _ = q.at(-1),
        z = q.flatMap((A) => A.message.content),
        Y = {
            ..._.message,
            content: tb4(z)
        };
    sb4("api_response_body", Y, {
        model: K.model,
        query_source: K.querySource,
        request_id: K.requestId ?? void 0
    })
}
// @from(Ln 265203, Col 4)
ob4 = 61440
// @from(Ln 265204, Col 4)
li1 = L(() => {
    Q8();
    e8();
    uf()
})
// @from(Ln 265213, Col 0)
function JJ6() {
    return S6(process.env.OTEL_LOG_USER_PROMPTS)
}
// @from(Ln 265217, Col 0)
function KI4() {
    L18.clear(), ii1.clear()
}
// @from(Ln 265221, Col 0)
function hJ() {
    if (!(S6(process.env.ENABLE_BETA_TRACING_DETAILED) && Boolean(process.env.BETA_TRACING_ENDPOINT))) return !1;
    return I7() || u8("tengu_trace_lantern", !1)
}
// @from(Ln 265226, Col 0)
function Fc(q, K = T0z) {
    if (q.length <= K) return {
        content: q,
        truncated: !1
    };
    return {
        content: q.slice(0, K) + `

[TRUNCATED - Content exceeds 60KB limit]`,
        truncated: !0
    }
}
// @from(Ln 265239, Col 0)
function ri1(q) {
    return v0z("sha256").update(q).digest("hex").slice(0, 12)
}
// @from(Ln 265243, Col 0)
function V0z(q) {
    return `sp_${ri1(q)}`
}
// @from(Ln 265247, Col 0)
function qI4(q) {
    let K = I6(q.message.content);
    return `msg_${ri1(K)}`
}
// @from(Ln 265252, Col 0)
function ni1(q) {
    let K = q.trim().match(k0z);
    return K && K[1] ? K[1].trim() : null
}
// @from(Ln 265257, Col 0)
function N0z(q) {
    let K = [],
        _ = [];
    for (let z of q) {
        let Y = z.message.content;
        if (typeof Y === "string") {
            let A = ni1(Y);
            if (A) _.push(A);
            else K.push(`[USER]
${Y}`)
        } else if (Array.isArray(Y)) {
            for (let A of Y)
                if (A.type === "text") {
                    let O = ni1(A.text);
                    if (O) _.push(O);
                    else K.push(`[USER]
${A.text}`)
                } else if (A.type === "tool_result") {
                let O = typeof A.content === "string" ? A.content : I6(A.content),
                    w = ni1(O);
                if (w) _.push(w);
                else K.push(`[TOOL RESULT: ${A.tool_use_id}]
${O}`)
            }
        }
    }
    return {
        contextParts: K,
        systemReminders: _
    }
}
// @from(Ln 265289, Col 0)
function _I4(q, K) {
    if (!hJ() || !JJ6()) return;
    let {
        content: _,
        truncated: z
    } = Fc(`[USER PROMPT]
${K}`);
    q.setAttributes({
        new_context: _,
        ...z && {
            new_context_truncated: !0,
            new_context_original_length: K.length
        }
    })
}
// @from(Ln 265305, Col 0)
function zI4(q, K, _) {
    if (!hJ()) return;
    if (K?.systemPrompt) {
        let z = V0z(K.systemPrompt),
            Y = K.systemPrompt.slice(0, 500);
        if (q.setAttribute("system_prompt_hash", z), JJ6()) q.setAttribute("system_prompt_preview", Y);
        if (q.setAttribute("system_prompt_length", K.systemPrompt.length), JJ6() && !L18.has(z)) {
            L18.add(z);
            let {
                content: A,
                truncated: O
            } = Fc(K.systemPrompt);
            Xz("system_prompt", {
                system_prompt_hash: z,
                system_prompt: A,
                system_prompt_length: String(K.systemPrompt.length),
                ...O && {
                    system_prompt_truncated: "true"
                }
            })
        }
    }
    if (K?.tools) try {
        let Y = n8(K.tools).map((A) => {
            let O = I6(A),
                w = ri1(O);
            return {
                name: typeof A.name === "string" ? A.name : "unknown",
                hash: w,
                json: O
            }
        });
        q.setAttribute("tools", I6(Y.map(({
            name: A,
            hash: O
        }) => ({
            name: A,
            hash: O
        })))), q.setAttribute("tools_count", Y.length);
        for (let {
                name: A,
                hash: O,
                json: w
            }
            of Y)
            if (!L18.has(`tool_${O}`)) {
                L18.add(`tool_${O}`);
                let {
                    content: $,
                    truncated: j
                } = Fc(w);
                Xz("tool", {
                    tool_name: PK(A),
                    tool_hash: O,
                    tool: $,
                    ...j && {
                        tool_truncated: "true"
                    }
                })
            }
    } catch {
        q.setAttribute("tools_parse_error", !0)
    }
    if (_ && _.length > 0 && K?.querySource) {
        let z = K.querySource,
            Y = ii1.get(z),
            A = 0;
        if (Y)
            for (let w = 0; w < _.length; w++) {
                let $ = _[w];
                if ($ && qI4($) === Y) {
                    A = w + 1;
                    break
                }
            }
        let O = _.slice(A).filter((w) => w.type === "user");
        if (O.length > 0) {
            let {
                contextParts: w,
                systemReminders: $
            } = N0z(O);
            if (q.setAttribute("new_context_message_count", O.length), $.length > 0) q.setAttribute("system_reminders_count", $.length);
            if (w.length > 0 && JJ6()) {
                let j = w.join(`

---

`),
                    {
                        content: H,
                        truncated: J
                    } = Fc(j);
                q.setAttributes({
                    new_context: H,
                    ...J && {
                        new_context_truncated: !0,
                        new_context_original_length: j.length
                    }
                })
            }
            if ($.length > 0 && JJ6()) {
                let j = $.join(`

---

`),
                    {
                        content: H,
                        truncated: J
                    } = Fc(j);
                q.setAttributes({
                    system_reminders: H,
                    ...J && {
                        system_reminders_truncated: !0,
                        system_reminders_original_length: j.length
                    }
                })
            }
            if (JJ6()) {
                let j = _.at(-1);
                if (j) ii1.set(z, qI4(j))
            }
        }
    }
}
// @from(Ln 265431, Col 0)
function YI4(q, K) {
    if (!hJ() || !JJ6() || !K) return;
    if (K.modelOutput !== void 0) {
        let {
            content: _,
            truncated: z
        } = Fc(K.modelOutput);
        if (q["response.model_output"] = _, z) q["response.model_output_truncated"] = !0, q["response.model_output_original_length"] = K.modelOutput.length
    }
}
// @from(Ln 265442, Col 0)
function AI4(q, K, _) {
    if (!hJ() || !qk()) return;
    let {
        content: z,
        truncated: Y
    } = Fc(`[TOOL INPUT: ${K}]
${_}`);
    q.setAttributes({
        tool_input: z,
        ...Y && {
            tool_input_truncated: !0,
            tool_input_original_length: _.length
        }
    })
}
// @from(Ln 265458, Col 0)
function OI4(q, K, _) {
    if (!hJ() || !Gk8()) return;
    let {
        content: z,
        truncated: Y
    } = Fc(`[TOOL RESULT: ${K}]
${_}`);
    if (q.new_context = z, Y) q.new_context_truncated = !0, q.new_context_original_length = _.length
}
// @from(Ln 265467, Col 4)
L18
// @from(Ln 265467, Col 9)
ii1
// @from(Ln 265467, Col 14)
T0z = 61440
// @from(Ln 265468, Col 4)
k0z
// @from(Ln 265469, Col 4)
h18 = L(() => {
    y8();
    B1();
    q2();
    Q8();
    e8();
    uf();
    L18 = new Set, ii1 = new Map;
    k0z = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/
})
// @from(Ln 265483, Col 0)
function fX(q) {
    return q.spanContext().spanId || ""
}
// @from(Ln 265487, Col 0)
function y0z() {
    if ($I4) return;
    $I4 = !0;
    let q = setInterval(() => {
        let K = Date.now() - E0z;
        for (let [_, z] of tO) {
            let Y = z.deref();
            if (Y === void 0) tO.delete(_), GX.delete(_);
            else if (Y.startTime < K) {
                if (!Y.ended) Y.span.end();
                tO.delete(_), GX.delete(_)
            }
        }
    }, 60000);
    if (typeof q.unref === "function") q.unref()
}
// @from(Ln 265504, Col 0)
function si1() {
    {
        let q = process.env.CLAUDE_CODE_ENHANCED_TELEMETRY_BETA ?? process.env.ENABLE_ENHANCED_TELEMETRY_BETA;
        if (S6(q)) return !0;
        if (c5(q)) return !1;
        return !1
    }
    return !1
}
// @from(Ln 265514, Col 0)
function Cx() {
    return si1() || hJ()
}
// @from(Ln 265518, Col 0)
function JT() {
    return Pz.trace.getTracer("com.anthropic.claude_code.tracing", "1.0.0")
}
// @from(Ln 265522, Col 0)
function $x8() {
    let q = gc.getStore();
    if (q && !q.ended) return q;
    return Array.from(tO.values()).findLast((K) => {
        let _ = K.deref();
        return !!_ && !_.ended && _.attributes["span.type"] === "interaction"
    })?.deref()
}
// @from(Ln 265531, Col 0)
function zR6(q, K = {}) {
    return {
        ...jL6(),
        "span.type": q,
        ...K
    }
}
// @from(Ln 265539, Col 0)
function L0z(q) {
    y0z();
    let K = es() ? hb4(q) : void 0;
    if (!Cx()) {
        if (K) {
            let H = Pz.trace.getActiveSpan() || JT().startSpan("dummy"),
                J = fX(H),
                X = {
                    span: H,
                    startTime: Date.now(),
                    attributes: {
                        "span.type": "interaction"
                    },
                    perfettoSpanId: K
                };
            return tO.set(J, new WeakRef(X)), GX.set(J, X), gc.enterWith(X), H
        }
        return Pz.trace.getActiveSpan() || JT().startSpan("dummy")
    }
    let _ = JT(),
        Y = S6(process.env.OTEL_LOG_USER_PROMPTS) ? q : "<REDACTED>";
    wI4++;
    let A = zR6("interaction", {
            user_prompt: Y,
            user_prompt_length: q.length,
            "interaction.sequence": wI4
        }),
        O = I7() && process.env.TRACEPARENT ? Pz.propagation.extract(Pz.context.active(), {
            traceparent: process.env.TRACEPARENT,
            tracestate: process.env.TRACESTATE
        }) : void 0,
        w = _.startSpan("claude_code.interaction", {
            attributes: A
        }, O);
    _I4(w, q);
    let $ = fX(w),
        j = {
            span: w,
            startTime: Date.now(),
            attributes: A,
            perfettoSpanId: K
        };
    return tO.set($, new WeakRef(j)), GX.set($, j), gc.enterWith(j), w
}
// @from(Ln 265584, Col 0)
function jx8(q, K) {
    L0z(q);
    let _ = gc.getStore();
    try {
        return gc.run(_, K)
    } finally {
        if (gc.getStore() === _) gc.enterWith(void 0)
    }
}
// @from(Ln 265594, Col 0)
function jI4() {
    let q = Sx.getStore();
    return q && !q.ended ? q : void 0
}
// @from(Ln 265599, Col 0)
function Uc() {
    let q = $x8();
    if (!q) return;
    if (q.ended) return;
    if (q.perfettoSpanId) Rb4(q.perfettoSpanId);
    if (!Cx()) {
        q.ended = !0;
        let z = fX(q.span);
        tO.delete(z), GX.delete(z), gc.enterWith(void 0);
        return
    }
    let K = Date.now() - q.startTime;
    q.span.setAttributes({
        "interaction.duration_ms": K
    }), q.span.end(), q.ended = !0;
    let _ = fX(q.span);
    tO.delete(_), GX.delete(_), gc.enterWith(void 0)
}
// @from(Ln 265618, Col 0)
function HI4(q, K, _, z) {
    let Y = es() ? Vb4({
        model: q,
        querySource: K?.querySource,
        messageId: void 0
    }) : void 0;
    if (!Cx()) {
        if (Y) {
            let M = Pz.trace.getActiveSpan() || JT().startSpan("dummy"),
                P = fX(M),
                W = {
                    span: M,
                    startTime: Date.now(),
                    attributes: {
                        model: q
                    },
                    perfettoSpanId: Y
                };
            return tO.set(P, new WeakRef(W)), GX.set(P, W), M
        }
        return Pz.trace.getActiveSpan() || JT().startSpan("dummy")
    }
    let A = JT(),
        O = jI4(),
        w = O ?? $x8(),
        $ = zR6("llm_request", {
            model: q,
            "llm_request.context": O ? "tool" : w ? "interaction" : "standalone",
            speed: z ? "fast" : "normal"
        }),
        j = w ? Pz.trace.setSpan(Pz.context.active(), w.span) : Pz.context.active(),
        H = A.startSpan("claude_code.llm_request", {
            attributes: $
        }, j);
    if (K?.querySource) H.setAttribute("query_source", K.querySource);
    zI4(H, K, _);
    let J = fX(H),
        X = {
            span: H,
            startTime: Date.now(),
            attributes: $,
            perfettoSpanId: Y
        };
    return tO.set(J, new WeakRef(X)), GX.set(J, X), H
}
// @from(Ln 265664, Col 0)
function ti1(q, K) {
    let _;
    if (q) {
        let O = fX(q);
        _ = tO.get(O)?.deref()
    } else _ = Array.from(tO.values()).findLast((O) => {
        let w = O.deref();
        return w?.attributes["span.type"] === "llm_request" || w?.attributes.model
    })?.deref();
    if (!_) return;
    let z = Date.now() - _.startTime;
    if (_.perfettoSpanId) kb4(_.perfettoSpanId, {
        ttftMs: K?.ttftMs,
        ttltMs: z,
        promptTokens: K?.inputTokens,
        outputTokens: K?.outputTokens,
        cacheReadTokens: K?.cacheReadTokens,
        cacheCreationTokens: K?.cacheCreationTokens,
        success: K?.success,
        error: K?.error,
        requestSetupMs: K?.requestSetupMs,
        attemptStartTimes: K?.attemptStartTimes
    });
    if (!Cx()) {
        let O = fX(_.span);
        tO.delete(O), GX.delete(O);
        return
    }
    let Y = {
        duration_ms: z
    };
    if (K) {
        if (K.inputTokens !== void 0) Y.input_tokens = K.inputTokens;
        if (K.outputTokens !== void 0) Y.output_tokens = K.outputTokens;
        if (K.cacheReadTokens !== void 0) Y.cache_read_tokens = K.cacheReadTokens;
        if (K.cacheCreationTokens !== void 0) Y.cache_creation_tokens = K.cacheCreationTokens;
        if (K.success !== void 0) Y.success = K.success;
        if (K.statusCode !== void 0) Y.status_code = K.statusCode;
        if (K.error !== void 0) Y.error = K.error;
        if (K.attempt !== void 0) Y.attempt = K.attempt;
        if (K.hasToolCall !== void 0) Y["response.has_tool_call"] = K.hasToolCall;
        if (K.requestId !== void 0) Y.request_id = K.requestId;
        if (K.ttftMs !== void 0) Y.ttft_ms = K.ttftMs;
        YI4(Y, K)
    }
    if (_.span.setAttributes(Y), K?.success === !1) _.span.setStatus({
        code: Pz.SpanStatusCode.ERROR,
        message: K.error
    });
    _.span.end();
    let A = fX(_.span);
    tO.delete(A), GX.delete(A)
}
// @from(Ln 265718, Col 0)
function JI4(q, K, _) {
    let z = es() ? Nb4(q, K) : void 0;
    if (!Cx()) {
        if (z) {
            let J = Pz.trace.getActiveSpan() || JT().startSpan("dummy"),
                X = fX(J),
                M = {
                    span: J,
                    startTime: Date.now(),
                    attributes: {
                        "span.type": "tool",
                        tool_name: q
                    },
                    perfettoSpanId: z
                };
            return tO.set(X, new WeakRef(M)), GX.set(X, M), Sx.enterWith(M), J
        }
        return Pz.trace.getActiveSpan() || JT().startSpan("dummy")
    }
    let Y = JT(),
        A = jI4() ?? $x8(),
        O = zR6("tool", {
            tool_name: q,
            ...K
        }),
        w = A ? Pz.trace.setSpan(Pz.context.active(), A.span) : Pz.context.active(),
        $ = Y.startSpan("claude_code.tool", {
            attributes: O
        }, w);
    if (_) AI4($, q, _);
    let j = fX($),
        H = {
            span: $,
            startTime: Date.now(),
            attributes: O,
            perfettoSpanId: z
        };
    return tO.set(j, new WeakRef(H)), GX.set(j, H), Sx.enterWith(H), $
}
// @from(Ln 265758, Col 0)
function XI4() {
    let q = es() ? yb4("tool_permission") : void 0;
    if (!Cx()) {
        if (q) {
            let $ = Pz.trace.getActiveSpan() || JT().startSpan("dummy"),
                j = fX($),
                H = {
                    span: $,
                    startTime: Date.now(),
                    attributes: {
                        "span.type": "tool.blocked_on_user"
                    },
                    perfettoSpanId: q
                };
            return tO.set(j, new WeakRef(H)), GX.set(j, H), $
        }
        return Pz.trace.getActiveSpan() || JT().startSpan("dummy")
    }
    let K = JT(),
        _ = Sx.getStore(),
        z = zR6("tool.blocked_on_user"),
        Y = _ ? Pz.trace.setSpan(Pz.context.active(), _.span) : Pz.context.active(),
        A = K.startSpan("claude_code.tool.blocked_on_user", {
            attributes: z
        }, Y),
        O = fX(A),
        w = {
            span: A,
            startTime: Date.now(),
            attributes: z,
            perfettoSpanId: q
        };
    return tO.set(O, new WeakRef(w)), GX.set(O, w), A
}
// @from(Ln 265793, Col 0)
function ei1(q, K) {
    let _ = Array.from(tO.values()).findLast((O) => O.deref()?.attributes["span.type"] === "tool.blocked_on_user")?.deref();
    if (!_) return;
    if (_.perfettoSpanId) Lb4(_.perfettoSpanId, {
        decision: q,
        source: K
    });
    if (!Cx()) {
        let O = fX(_.span);
        tO.delete(O), GX.delete(O);
        return
    }
    let Y = {
        duration_ms: Date.now() - _.startTime
    };
    if (q) Y.decision = q;
    if (K) Y.source = K;
    _.span.setAttributes(Y), _.span.end();
    let A = fX(_.span);
    tO.delete(A), GX.delete(A)
}
// @from(Ln 265815, Col 0)
function MI4() {
    if (!Cx()) return Pz.trace.getActiveSpan() || JT().startSpan("dummy");
    let q = JT(),
        K = Sx.getStore(),
        _ = zR6("tool.execution"),
        z = K ? Pz.trace.setSpan(Pz.context.active(), K.span) : Pz.context.active(),
        Y = q.startSpan("claude_code.tool.execution", {
            attributes: _
        }, z),
        A = fX(Y),
        O = {
            span: Y,
            startTime: Date.now(),
            attributes: _
        };
    return tO.set(A, new WeakRef(O)), GX.set(A, O), ai1.enterWith(O), Y
}
// @from(Ln 265833, Col 0)
function qr1(q) {
    if (!Cx()) return;
    let K = Array.from(tO.values()).findLast((A) => A.deref()?.attributes["span.type"] === "tool.execution")?.deref();
    if (!K) return;
    let z = {
        duration_ms: Date.now() - K.startTime
    };
    if (q) {
        if (q.success !== void 0) z.success = q.success;
        if (q.error !== void 0) z.error = q.error
    }
    if (K.span.setAttributes(z), q?.success === !1) K.span.setStatus({
        code: Pz.SpanStatusCode.ERROR,
        message: q.error
    });
    K.span.end();
    let Y = fX(K.span);
    tO.delete(Y), GX.delete(Y), ai1.enterWith(void 0)
}
// @from(Ln 265853, Col 0)
function Hx8(q, K, _) {
    let z;
    if (q) z = tO.get(fX(q))?.deref();
    else z = Sx.getStore();
    if (!z) return;
    if (z.perfettoSpanId) Eb4(z.perfettoSpanId, {
        success: !0,
        resultTokens: _
    });
    let Y = Sx.getStore() === z;
    if (!Cx()) {
        let $ = fX(z.span);
        if (tO.delete($), GX.delete($), z.ended = !0, Y) Sx.enterWith(void 0);
        return
    }
    let O = {
        duration_ms: Date.now() - z.startTime
    };
    if (K) {
        let $ = z.attributes.tool_name || "unknown";
        OI4(O, $, K)
    }
    if (_ !== void 0) O.result_tokens = _;
    z.span.setAttributes(O), z.span.end(), z.ended = !0;
    let w = fX(z.span);
    if (tO.delete(w), GX.delete(w), Y) Sx.enterWith(void 0)
}
// @from(Ln 265881, Col 0)
function PI4(q, K) {
    if (!Cx() || !Gk8()) return;
    let _ = Sx.getStore();
    if (!_) return;
    let z = {};
    for (let [Y, A] of Object.entries(K))
        if (typeof A === "string") {
            let {
                content: O,
                truncated: w
            } = Fc(A);
            if (z[Y] = O, w) z[`${Y}_truncated`] = !0, z[`${Y}_original_length`] = A.length
        } else z[Y] = A;
    _.span.addEvent(q, z)
}
// @from(Ln 265897, Col 0)
function WI4() {
    if (!Cx()) return;
    let q = ai1.getStore()?.span ?? Sx.getStore()?.span ?? gc.getStore()?.span;
    if (!q) return;
    let K = q.spanContext();
    if (!K.traceId || K.traceId === "00000000000000000000000000000000") return;
    let _ = Pz.trace.setSpan(Pz.context.active(), q),
        z = {};
    return Pz.propagation.inject(_, z), z.traceparent
}
// @from(Ln 265908, Col 0)
function DI4(q, K, _, z) {
    if (!hJ()) return Pz.trace.getActiveSpan() || JT().startSpan("dummy");
    let Y = JT(),
        A = Sx.getStore() ?? $x8(),
        O = zR6("hook", {
            hook_event: q,
            hook_name: K,
            num_hooks: _,
            hook_definitions: z
        }),
        w = A ? Pz.trace.setSpan(Pz.context.active(), A.span) : Pz.context.active(),
        $ = Y.startSpan("claude_code.hook", {
            attributes: O
        }, w),
        j = fX($),
        H = {
            span: $,
            startTime: Date.now(),
            attributes: O
        };
    return tO.set(j, new WeakRef(H)), GX.set(j, H), $
}
// @from(Ln 265931, Col 0)
function ZI4(q, K) {
    if (!hJ()) return;
    let _ = fX(q),
        z = tO.get(_)?.deref();
    if (!z) return;
    let A = {
        duration_ms: Date.now() - z.startTime
    };
    if (K) {
        if (K.numSuccess !== void 0) A.num_success = K.numSuccess;
        if (K.numBlocking !== void 0) A.num_blocking = K.numBlocking;
        if (K.numNonBlockingError !== void 0) A.num_non_blocking_error = K.numNonBlockingError;
        if (K.numCancelled !== void 0) A.num_cancelled = K.numCancelled
    }
    if (z.span.setAttributes(A), K && (K.numNonBlockingError ?? 0) > 0) z.span.setStatus({
        code: Pz.SpanStatusCode.ERROR,
        message: `${K.numNonBlockingError} hook(s) failed`
    });
    z.span.end(), tO.delete(_), GX.delete(_)
}
// @from(Ln 265951, Col 4)
Pz
// @from(Ln 265951, Col 8)
gc
// @from(Ln 265951, Col 12)
Sx
// @from(Ln 265951, Col 16)
ai1
// @from(Ln 265951, Col 21)
tO
// @from(Ln 265951, Col 25)
GX
// @from(Ln 265951, Col 29)
wI4 = 0
// @from(Ln 265952, Col 4)
$I4 = !1
// @from(Ln 265953, Col 4)
E0z = 1800000
// @from(Ln 265954, Col 4)
Qc = L(() => {
    y8();
    q2();
    Q8();
    kS8();
    h18();
    ih6();
    Pz = K6($5(), 1), gc = new oi1, Sx = new oi1, ai1 = new oi1, tO = new Map, GX = new Map
})
// @from(Ln 265963, Col 4)
iP
// @from(Ln 265964, Col 4)
Jx8 = L(() => {
    iP = {
        input_tokens: 0,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0,
        output_tokens: 0,
        server_tool_use: {
            web_search_requests: 0,
            web_fetch_requests: 0
        },
        service_tier: "standard",
        cache_creation: {
            ephemeral_1h_input_tokens: 0,
            ephemeral_5m_input_tokens: 0
        },
        inference_geo: "",
        iterations: [],
        speed: "standard"
    }
})
// @from(Ln 265985, Col 0)
function R0z(q) {
    if (q instanceof vq) {
        let K = q.error;
        if (K?.error?.message) return K.error.message
    }
    return q instanceof Error ? q.message : String(q)
}
// @from(Ln 265993, Col 0)
function fI4({
    headers: q,
    baseUrl: K
}) {
    if (q) {
        let _ = [];
        q.forEach((z, Y) => _.push(Y));
        for (let [z, {
                prefixes: Y
            }] of Object.entries(S0z))
            if (Y.some((A) => _.some((O) => O.startsWith(A)))) return z
    }
    if (K) try {
        let _ = new URL(K).hostname.toLowerCase();
        for (let [z, Y] of Object.entries(C0z))
            if (Y.some((A) => _.endsWith(A))) return z
    } catch {}
    return
}
// @from(Ln 266013, Col 0)
function Kr1() {
    return {
        ...process.env.ANTHROPIC_BASE_URL && {
            baseUrl: process.env.ANTHROPIC_BASE_URL
        },
        ...process.env.ANTHROPIC_MODEL && {
            envModel: process.env.ANTHROPIC_MODEL
        },
        ...process.env.ANTHROPIC_SMALL_FAST_MODEL && {
            envSmallFastModel: process.env.ANTHROPIC_SMALL_FAST_MODEL
        }
    }
}
// @from(Ln 266027, Col 0)
function GI4() {
    if (!{
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.BUILD_TIME) return;
    let q = new Date({
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.112",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-04-16T18:33:19Z"
    }.BUILD_TIME).getTime();
    if (isNaN(q)) return;
    return Math.floor((Date.now() - q) / 60000)
}
// @from(Ln 266048, Col 0)
function vI4({
    model: q,
    messagesLength: K,
    temperature: _,
    betas: z,
    permissionMode: Y,
    querySource: A,
    queryTracking: O,
    thinkingType: w,
    effortValue: $,
    fastMode: j,
    previousRequestId: H
}) {
    d("tengu_api_query", {
        model: q,
        messagesLength: K,
        temperature: _,
        provider: KB(),
        buildAgeMins: GI4(),
        ...z?.length && {
            betas: z.join(",")
        },
        permissionMode: Y,
        querySource: A,
        ...O && {
            queryChainId: O.chainId,
            queryDepth: O.depth
        },
        thinkingType: w,
        effortValue: $,
        fastMode: j,
        ...H && {
            previousRequestId: H
        },
        ...Kr1()
    })
}
// @from(Ln 266086, Col 0)
function _r1({
    error: q,
    model: K,
    messageCount: _,
    messageTokens: z,
    durationMs: Y,
    durationMsIncludingRetries: A,
    attempt: O,
    requestId: w,
    clientRequestId: $,
    didFallBackToNonStreaming: j,
    promptCategory: H,
    headers: J,
    queryTracking: X,
    querySource: M,
    llmSpan: P,
    fastMode: W,
    previousRequestId: D
}) {
    let Z = fI4({
            headers: q instanceof vq && q.headers ? q.headers : J,
            baseUrl: process.env.ANTHROPIC_BASE_URL
        }),
        G = R0z(q),
        f = q instanceof vq ? q.status : void 0,
        v = f !== void 0 ? String(f) : void 0,
        V = Bh8(q),
        k = Zp(q);
    if (k) {
        let h = k.isSSLError ? " (SSL error)" : "";
        E(`Connection error details: code=${k.code}${h}, message=${k.message}`, {
            level: "error"
        })
    }
    let N = lC1();
    if ($) E(`API error x-client-request-id=${$} (give this to the API team for server-log lookup)`, {
        level: "error"
    });
    if (j6(q), d("tengu_api_error", {
            model: K,
            error: G,
            status: v,
            errorType: V,
            messageCount: _,
            messageTokens: z,
            durationMs: Y,
            durationMsIncludingRetries: A,
            attempt: O,
            provider: KB(),
            requestId: w || void 0,
            ...N && {
                invokingRequestId: N.invokingRequestId,
                invocationKind: N.invocationKind
            },
            clientRequestId: $ || void 0,
            didFallBackToNonStreaming: j,
            ...H && {
                promptCategory: H
            },
            ...Z && {
                gateway: Z
            },
            ...X && {
                queryChainId: X.chainId,
                queryDepth: X.depth
            },
            ...M && {
                querySource: M
            },
            fastMode: W,
            ...D && {
                previousRequestId: D
            },
            ...Kr1()
        }), Xz("api_error", {
            model: K,
            error: G,
            ...v !== void 0 && {
                status_code: v
            },
            duration_ms: String(Y),
            attempt: String(O),
            request_id: w ?? void 0,
            speed: W ? "fast" : "normal"
        }), O > 1) Xz("api_retries_exhausted", {
        model: K,
        error: G,
        ...v !== void 0 && {
            status_code: v
        },
        total_attempts: String(O),
        total_retry_duration_ms: String(A),
        speed: W ? "fast" : "normal"
    });
    ti1(P, {
        success: !1,
        statusCode: v ? parseInt(v) : void 0,
        error: G,
        attempt: O,
        requestId: w ?? void 0
    });
    let R = aO8();
    if (R?.isTeleported && !R.hasLoggedFirstMessage) d("tengu_teleport_first_message_error", {
        session_id: R.sessionId,
        error_type: V
    }), sO8()
}
// @from(Ln 266194, Col 0)
function b0z({
    model: q,
    preNormalizedModel: K,
    messageCount: _,
    messageTokens: z,
    usage: Y,
    durationMs: A,
    durationMsIncludingRetries: O,
    attempt: w,
    ttftMs: $,
    requestId: j,
    firstAttemptRequestId: H,
    stopReason: J,
    costUSD: X,
    didFallBackToNonStreaming: M,
    querySource: P,
    gateway: W,
    queryTracking: D,
    permissionMode: Z,
    globalCacheStrategy: G,
    textContentLength: f,
    thinkingContentLength: v,
    toolUseContentLengths: V,
    connectorTextBlockCount: k,
    fastMode: N,
    previousRequestId: R,
    betas: h
}) {
    let C = I7(),
        x = U61(),
        B = process.argv.includes("-p") || process.argv.includes("--print"),
        m = Date.now(),
        S = Ri(),
        F = S !== null ? m - S : void 0,
        U = lC1();
    d("tengu_api_success", {
        model: q,
        ...K !== q && {
            preNormalizedModel: K
        },
        ...h?.length && {
            betas: h.join(",")
        },
        messageCount: _,
        messageTokens: z,
        inputTokens: Y.input_tokens,
        outputTokens: Y.output_tokens,
        cachedInputTokens: Y.cache_read_input_tokens ?? 0,
        uncachedInputTokens: Y.cache_creation_input_tokens ?? 0,
        durationMs: A,
        durationMsIncludingRetries: O,
        attempt: w,
        ttftMs: $ ?? void 0,
        buildAgeMins: GI4(),
        provider: KB(),
        requestId: j ?? void 0,
        ...H && j && H !== j && {
            firstAttemptRequestId: H
        },
        ...U && {
            invokingRequestId: U.invokingRequestId,
            invocationKind: U.invocationKind
        },
        stop_reason: J ?? void 0,
        costUSD: X,
        didFallBackToNonStreaming: M,
        isNonInteractiveSession: C,
        print: B,
        isTTY: process.stdout.isTTY ?? !1,
        querySource: P,
        ...W && {
            gateway: W
        },
        ...D && {
            queryChainId: D.chainId,
            queryDepth: D.depth
        },
        permissionMode: Z,
        ...G && {
            globalCacheStrategy: G
        },
        ...f !== void 0 ? {
            textContentLength: f
        } : {},
        ...v !== void 0 ? {
            thinkingContentLength: v
        } : {},
        ...V !== void 0 ? {
            toolUseContentLengths: I6(V)
        } : {},
        ...k !== void 0 ? {
            connectorTextBlockCount: k
        } : {},
        fastMode: N,
        ...{},
        ...R && {
            previousRequestId: R
        },
        ...x && {
            isPostCompaction: x
        },
        ...Kr1(),
        timeSinceLastApiCallMs: F
    }), QB6(m)
}