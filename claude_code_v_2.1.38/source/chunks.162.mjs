
// @from(Ln 417249, Col 0)
function BYq(A) {
    let q = e(49),
        {
            shell: K,
            onDone: Y,
            onKillShell: z,
            onBack: w
        } = A,
        {
            columns: H
        } = Z8(),
        [$, O] = wd1.useState(0),
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = {
        stdout: "",
        stdoutLines: 0
    }, q[0] = _;
    else _ = q[0];
    let [J, X] = wd1.useState(_), D;
    if (q[1] !== Y) D = () => Y("Shell details dismissed", {
        display: "system"
    }), q[1] = Y, q[2] = D;
    else D = q[2];
    let j = D,
        M;
    if (q[3] !== j) M = {
        "confirm:yes": j
    }, q[3] = j, q[4] = M;
    else M = q[4];
    let P;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) P = {
        context: "Confirmation"
    }, q[5] = P;
    else P = q[5];
    c7(M, P);
    let W;
    if (q[6] !== w || q[7] !== Y || q[8] !== z || q[9] !== K.status) W = (s, O1) => {
        if (s === " ") Y("Shell details dismissed", {
            display: "system"
        });
        else if (O1.leftArrow && w) w();
        else if (s === "k" && K.status === "running" && z) z()
    }, q[6] = w, q[7] = Y, q[8] = z, q[9] = K.status, q[10] = W;
    else W = q[10];
    D8(W);
    let G = X7z,
        f;
    if (q[11] !== K.id || q[12] !== K.status) f = () => {
        let s = M_6(K.id),
            {
                totalLines: O1,
                truncatedContent: T1
            } = HZ6(s);
        if (X({
                stdout: T1,
                stdoutLines: O1
            }), K.status === "running") {
            let N1 = setTimeout(() => {
                O(J7z)
            }, 1000);
            return () => clearTimeout(N1)
        }
    }, q[11] = K.id, q[12] = K.status, q[13] = f;
    else f = q[13];
    let Z;
    if (q[14] !== $ || q[15] !== K.id || q[16] !== K.status) Z = [K.id, K.status, $], q[14] = $, q[15] = K.id, q[16] = K.status, q[17] = Z;
    else Z = q[17];
    wd1.useEffect(f, Z);
    let N;
    if (q[18] !== K.command) N = K3(K.command, 280), q[18] = K.command, q[19] = N;
    else N = q[19];
    let T = N,
        k;
    if (q[20] !== w || q[21] !== z || q[22] !== K.status) k = (s) => s.pending ? X$.default.createElement(V, null, "Press ", s.keyName, " again to exit") : X$.default.createElement(oA, null, w && X$.default.createElement(YA, {
        shortcut: "←",
        action: "go back"
    }), X$.default.createElement(YA, {
        shortcut: "Esc/Enter/Space",
        action: "close"
    }), K.status === "running" && z && X$.default.createElement(YA, {
        shortcut: "k",
        action: "kill"
    })), q[20] = w, q[21] = z, q[22] = K.status, q[23] = k;
    else k = q[23];
    let y;
    if (q[24] === Symbol.for("react.memo_cache_sentinel")) y = X$.default.createElement(V, {
        bold: !0
    }, "Status:"), q[24] = y;
    else y = q[24];
    let B;
    if (q[25] !== K.result || q[26] !== K.status) B = X$.default.createElement(V, null, y, " ", K.status === "running" ? X$.default.createElement(V, {
        color: "background"
    }, K.status, K.result?.code !== void 0 && ` (exit code: ${K.result.code})`) : K.status === "completed" ? X$.default.createElement(V, {
        color: "success"
    }, K.status, K.result?.code !== void 0 && ` (exit code: ${K.result.code})`) : X$.default.createElement(V, {
        color: "error"
    }, K.status, K.result?.code !== void 0 && ` (exit code: ${K.result.code})`)), q[25] = K.result, q[26] = K.status, q[27] = B;
    else B = q[27];
    let S;
    if (q[28] === Symbol.for("react.memo_cache_sentinel")) S = X$.default.createElement(V, {
        bold: !0
    }, "Runtime:"), q[28] = S;
    else S = q[28];
    let m = G(K.startTime),
        b;
    if (q[29] !== m) b = X$.default.createElement(V, null, S, " ", m), q[29] = m, q[30] = b;
    else b = q[30];
    let g;
    if (q[31] === Symbol.for("react.memo_cache_sentinel")) g = X$.default.createElement(V, {
        bold: !0
    }, "Command:"), q[31] = g;
    else g = q[31];
    let U;
    if (q[32] !== T) U = X$.default.createElement(V, {
        wrap: "wrap"
    }, g, " ", T), q[32] = T, q[33] = U;
    else U = q[33];
    let x;
    if (q[34] !== B || q[35] !== b || q[36] !== U) x = X$.default.createElement(I, {
        flexDirection: "column"
    }, B, b, U), q[34] = B, q[35] = b, q[36] = U, q[37] = x;
    else x = q[37];
    let p;
    if (q[38] === Symbol.for("react.memo_cache_sentinel")) p = X$.default.createElement(V, {
        bold: !0
    }, "Output:"), q[38] = p;
    else p = q[38];
    let l;
    if (q[39] !== H || q[40] !== J.stdout || q[41] !== J.stdoutLines || q[42] !== K.id) l = X$.default.createElement(I, {
        flexDirection: "column"
    }, p, J.stdout ? X$.default.createElement(X$.default.Fragment, null, X$.default.createElement(I, {
        borderStyle: "round",
        borderDimColor: !0,
        paddingX: 1,
        flexDirection: "column",
        height: 12,
        maxWidth: H - 6
    }, J.stdout.split(`
`).slice(-10).map(_7z)), X$.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, J.stdoutLines > 10 ? `Showing last 10 lines of ${J.stdoutLines} total. Full output: ${L3(ww(K.id))}` : `Showing ${J.stdoutLines} lines`)) : X$.default.createElement(V, {
        dimColor: !0
    }, "No output available")), q[39] = H, q[40] = J.stdout, q[41] = J.stdoutLines, q[42] = K.id, q[43] = l;
    else l = q[43];
    let r;
    if (q[44] !== j || q[45] !== x || q[46] !== l || q[47] !== k) r = X$.default.createElement(w8, {
        title: "Shell details",
        onCancel: j,
        color: "background",
        borderDimColor: !1,
        inputGuide: k
    }, x, l), q[44] = j, q[45] = x, q[46] = l, q[47] = k, q[48] = r;
    else r = q[48];
    return r
}
// @from(Ln 417406, Col 0)
function _7z(A, q) {
    return X$.default.createElement(V, {
        key: q,
        wrap: "truncate-end"
    }, A)
}
// @from(Ln 417413, Col 0)
function J7z(A) {
    return A + 1
}
// @from(Ln 417417, Col 0)
function X7z(A) {
    let q = Math.floor((Date.now() - A) / 1000),
        K = Math.floor(q / 3600),
        Y = Math.floor((q - K * 3600) / 60),
        z = q - K * 3600 - Y * 60;
    return `${K>0?`${K}h `:""}${Y>0||K>0?`${Y}m `:""}${z}s`
}
// @from(Ln 417424, Col 4)
X$
// @from(Ln 417424, Col 8)
wd1
// @from(Ln 417425, Col 4)
mYq = v(() => {
    i1();
    m1();
    K7();
    mq();
    hZ();
    wq();
    GG1();
    wK();
    HK();
    Bq();
    vq();
    X$ = o(X1(), 1), wd1 = o(X1(), 1)
})
// @from(Ln 417440, Col 0)
function vN6(A) {
    let q = e(9),
        {
            session: K
        } = A;
    if (K.status === "completed") {
        let $;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = Hd1.default.createElement(V, {
            bold: !0,
            color: "success",
            dimColor: !0
        }, "done"), q[0] = $;
        else $ = q[0];
        return $
    }
    if (K.status === "failed") {
        let $;
        if (q[1] === Symbol.for("react.memo_cache_sentinel")) $ = Hd1.default.createElement(V, {
            bold: !0,
            color: "error",
            dimColor: !0
        }, "error"), q[1] = $;
        else $ = q[1];
        return $
    }
    if (!K.todoList.length) {
        let $;
        if (q[2] !== K.status) $ = Hd1.default.createElement(V, {
            dimColor: !0
        }, K.status, "…"), q[2] = K.status, q[3] = $;
        else $ = q[3];
        return $
    }
    let Y;
    if (q[4] !== K.todoList) Y = K.todoList.filter(D7z), q[4] = K.todoList, q[5] = Y;
    else Y = q[5];
    let z = Y.length,
        w = K.todoList.length,
        H;
    if (q[6] !== z || q[7] !== w) H = Hd1.default.createElement(V, {
        dimColor: !0
    }, z, "/", w), q[6] = z, q[7] = w, q[8] = H;
    else H = q[8];
    return H
}
// @from(Ln 417486, Col 0)
function D7z(A) {
    return A.status === "completed"
}
// @from(Ln 417489, Col 4)
Hd1
// @from(Ln 417490, Col 4)
JuA = v(() => {
    i1();
    m1();
    Hd1 = o(X1(), 1)
})
// @from(Ln 417499, Col 0)
function FYq(A) {
    return A.flatMap((q) => {
        switch (q.type) {
            case "assistant":
                return [{
                    type: "assistant",
                    message: q.message,
                    uuid: q.uuid,
                    requestId: void 0,
                    timestamp: new Date().toISOString()
                }];
            case "user":
                return [{
                    type: "user",
                    message: q.message,
                    uuid: q.uuid ?? j7z(),
                    timestamp: new Date().toISOString(),
                    isMeta: q.isSynthetic
                }];
            case "system":
                if (q.subtype === "compact_boundary") {
                    let K = q;
                    return [{
                        type: "system",
                        content: "Conversation compacted",
                        level: "info",
                        subtype: "compact_boundary",
                        compactMetadata: {
                            trigger: K.compact_metadata.trigger,
                            preTokens: K.compact_metadata.pre_tokens
                        },
                        uuid: q.uuid,
                        timestamp: new Date().toISOString()
                    }]
                }
                return [];
            default:
                return []
        }
    })
}
// @from(Ln 417541, Col 0)
function QYq(A) {
    return A.flatMap((q) => {
        switch (q.type) {
            case "assistant":
                return [{
                    type: "assistant",
                    message: M7z(q),
                    session_id: U6(),
                    parent_tool_use_id: null,
                    uuid: q.uuid,
                    error: q.error
                }];
            case "user":
                return [{
                    type: "user",
                    message: q.message,
                    session_id: U6(),
                    parent_tool_use_id: null,
                    uuid: q.uuid,
                    isSynthetic: q.isMeta || q.isVisibleInTranscriptOnly
                }];
            case "system":
                if (q.subtype === "compact_boundary" && q.compactMetadata) return [{
                    type: "system",
                    subtype: "compact_boundary",
                    session_id: U6(),
                    uuid: q.uuid,
                    compact_metadata: {
                        trigger: q.compactMetadata.trigger,
                        pre_tokens: q.compactMetadata.preTokens
                    }
                }];
                return [];
            default:
                return []
        }
    })
}
// @from(Ln 417580, Col 0)
function M7z(A) {
    let q = A.message.content;
    if (!Array.isArray(q)) return A.message;
    let K = q.map((Y) => {
        if (Y.type !== "tool_use") return Y;
        if (Y.name === bW) {
            let z = pD();
            if (z) return {
                ...Y,
                input: {
                    ...Y.input,
                    plan: z
                }
            }
        }
        return Y
    });
    return {
        ...A.message,
        content: K
    }
}
// @from(Ln 417602, Col 4)
XuA = v(() => {
    B6();
    mX()
})
// @from(Ln 417607, Col 0)
function gYq({
    session: A,
    toolUseContext: q,
    onDone: K,
    onBack: Y
}) {
    let [z, w] = $d1.useState(!1), [H, $] = $d1.useState(null), O = () => K("Remote session details dismissed", {
        display: "system"
    });
    D8((M, P) => {
        if (M === " ") K("Remote session details dismissed", {
            display: "system"
        });
        else if (P.leftArrow && Y) Y();
        else if (M === "t" && !z) _();
        else if (P.return) O()
    });
    async function _() {
        w(!0), $(null);
        try {
            await Ct(A.sessionId)
        } catch (M) {
            $(M instanceof Error ? M.message : String(M)), w(!1)
        }
    }
    let J = (M) => {
            let P = Math.floor((Date.now() - M) / 1000),
                W = Math.floor(P / 3600),
                G = Math.floor((P - W * 3600) / 60),
                f = P - W * 3600 - G * 60;
            return `${W>0?`${W}h `:""}${G>0||W>0?`${G}m `:""}${f}s`
        },
        X = $d1.useMemo(() => {
            return iO(FYq(A.log.slice(-3))).filter((M) => M.type !== "progress")
        }, [A]),
        D = K3(A.title, 50),
        j = A.status === "pending" ? "starting" : A.status;
    return uY.default.createElement(w8, {
        title: "Remote session details",
        onCancel: O,
        color: "background",
        borderDimColor: !0,
        inputGuide: (M) => M.pending ? uY.default.createElement(V, null, "Press ", M.keyName, " again to exit") : uY.default.createElement(oA, null, Y && uY.default.createElement(YA, {
            shortcut: "←",
            action: "go back"
        }), uY.default.createElement(YA, {
            shortcut: "Esc/Enter/Space",
            action: "close"
        }), !z && uY.default.createElement(YA, {
            shortcut: "t",
            action: "teleport"
        }))
    }, uY.default.createElement(I, {
        flexDirection: "column"
    }, uY.default.createElement(V, null, uY.default.createElement(V, {
        bold: !0
    }, "Status"), ":", " ", j === "running" || j === "starting" ? uY.default.createElement(V, {
        color: "background"
    }, j) : j === "completed" ? uY.default.createElement(V, {
        color: "success"
    }, j) : uY.default.createElement(V, {
        color: "error"
    }, j)), uY.default.createElement(V, null, uY.default.createElement(V, {
        bold: !0
    }, "Runtime"), ": ", J(A.startTime)), uY.default.createElement(V, {
        wrap: "truncate-end"
    }, uY.default.createElement(V, {
        bold: !0
    }, "Title"), ": ", D), uY.default.createElement(V, null, uY.default.createElement(V, {
        bold: !0
    }, "Progress"), ":", " ", uY.default.createElement(vN6, {
        session: A
    })), uY.default.createElement(V, null, uY.default.createElement(V, {
        bold: !0
    }, "Session URL"), ":", " ", uY.default.createElement(d7, {
        url: u51(A.sessionId)
    }, uY.default.createElement(V, {
        dimColor: !0
    }, u51(A.sessionId))))), A.log.length > 0 && uY.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, uY.default.createElement(V, null, uY.default.createElement(V, {
        bold: !0
    }, "Recent messages"), ":"), uY.default.createElement(I, {
        flexDirection: "column",
        height: 10,
        overflowY: "hidden"
    }, X.map((M, P) => uY.default.createElement(pR, {
        key: P,
        message: M,
        lookups: vm,
        addMargin: P > 0,
        tools: q.options.tools,
        commands: q.options.commands,
        verbose: q.options.verbose,
        inProgressToolUseIDs: new Set,
        progressMessagesForMessage: [],
        shouldAnimate: !1,
        shouldShowDot: !1,
        style: "condensed",
        isTranscriptMode: !1,
        isStatic: !0
    }))), uY.default.createElement(I, {
        marginTop: 1
    }, uY.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, "Showing last ", Math.min(3, A.log.length), " of", " ", A.log.length, " messages"))), H && uY.default.createElement(I, {
        marginTop: 1
    }, uY.default.createElement(V, {
        color: "error"
    }, "Teleport failed: ", H)), z && uY.default.createElement(V, {
        color: "background"
    }, "Teleporting to session…"))
}
// @from(Ln 417722, Col 4)
uY
// @from(Ln 417722, Col 8)
$d1
// @from(Ln 417723, Col 4)
UYq = v(() => {
    m1();
    pW1();
    JuA();
    Im();
    nP1();
    XuA();
    N8();
    wK();
    HK();
    Bq();
    vq();
    uY = o(X1(), 1), $d1 = o(X1(), 1)
})
// @from(Ln 417738, Col 0)
function W7z(A) {
    switch (A) {
        case "running":
        case "pending":
            return l1.pointer;
        case "completed":
            return l1.tick;
        case "failed":
        case "killed":
            return l1.cross;
        default:
            return l1.bullet
    }
}
// @from(Ln 417753, Col 0)
function G7z(A) {
    switch (A) {
        case "running":
        case "pending":
            return "background";
        case "completed":
            return "success";
        case "failed":
            return "error";
        case "killed":
            return "warning";
        default:
            return "background"
    }
}
// @from(Ln 417769, Col 0)
function Z7z(A, q, K) {
    let Y = q.find((z) => z.name === A.toolName);
    if (!Y) return A.toolName;
    try {
        let z = Y.inputSchema.safeParse(A.input),
            w = z.success ? z.data : {},
            H = Y.userFacingName(w);
        if (!H) return A.toolName;
        let $ = Y.renderToolUseMessage(w, {
            theme: K,
            verbose: !1
        });
        if ($) return uz.default.createElement(V, null, H, "(", $, ")");
        return H
    } catch {
        return A.toolName
    }
}
// @from(Ln 417788, Col 0)
function pYq(A) {
    let q = e(59),
        {
            agent: K,
            onDone: Y,
            onKillAgent: z,
            onBack: w
        } = A,
        H;
    if (q[0] !== K.agentId) H = (t) => t.todos[K.agentId], q[0] = K.agentId, q[1] = H;
    else H = q[1];
    let O = v6(H) ?? P7z,
        _;
    if (q[2] !== O) _ = O.filter(f7z), q[2] = O, q[3] = _;
    else _ = q[3];
    let J = _.length,
        [X] = T7(),
        D;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) D = tD(QD()), q[4] = D;
    else D = q[4];
    let j = D,
        M = RP1(K.startTime, K.status === "running"),
        P;
    if (q[5] !== Y) P = {
        "confirm:yes": Y
    }, q[5] = Y, q[6] = P;
    else P = q[6];
    let W;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) W = {
        context: "Confirmation"
    }, q[7] = W;
    else W = q[7];
    c7(P, W);
    let G;
    if (q[8] !== K.status || q[9] !== w || q[10] !== Y || q[11] !== z) G = (t, J1) => {
        if (t === " ") Y();
        else if (J1.leftArrow && w) w();
        else if (t === "k" && K.status === "running" && z) z()
    }, q[8] = K.status, q[9] = w, q[10] = Y, q[11] = z, q[12] = G;
    else G = q[12];
    D8(G);
    let f;
    if (q[13] !== K.prompt) f = C4(K.prompt, "plan"), q[13] = K.prompt, q[14] = f;
    else f = q[14];
    let Z = f,
        N = K.prompt.length > 300 ? K.prompt.substring(0, 297) + "…" : K.prompt,
        T = K.result?.totalTokens ?? K.progress?.tokenCount,
        k = K.result?.totalToolUseCount ?? K.progress?.toolUseCount,
        y = K.selectedAgent?.agentType ?? "agent",
        B = K.description || "Async agent",
        S;
    if (q[15] !== y || q[16] !== B) S = uz.default.createElement(V, null, y, " ›", " ", B), q[15] = y, q[16] = B, q[17] = S;
    else S = q[17];
    let m = S,
        b;
    if (q[18] !== K.status) b = K.status !== "running" && uz.default.createElement(V, {
        color: G7z(K.status)
    }, W7z(K.status), " ", K.status === "completed" ? "Completed" : K.status === "failed" ? "Failed" : "Killed", " · "), q[18] = K.status, q[19] = b;
    else b = q[19];
    let g;
    if (q[20] !== T) g = T !== void 0 && T > 0 && uz.default.createElement(uz.default.Fragment, null, " · ", Y3(T), " tokens"), q[20] = T, q[21] = g;
    else g = q[21];
    let U;
    if (q[22] !== k) U = k !== void 0 && k > 0 && uz.default.createElement(uz.default.Fragment, null, " ", "· ", k, " ", k === 1 ? "tool" : "tools"), q[22] = k, q[23] = U;
    else U = q[23];
    let x;
    if (q[24] !== M || q[25] !== g || q[26] !== U) x = uz.default.createElement(V, {
        dimColor: !0
    }, M, g, U), q[24] = M, q[25] = g, q[26] = U, q[27] = x;
    else x = q[27];
    let p;
    if (q[28] !== b || q[29] !== x) p = uz.default.createElement(V, null, b, x), q[28] = b, q[29] = x, q[30] = p;
    else p = q[30];
    let l = p,
        r;
    if (q[31] !== K.status || q[32] !== w || q[33] !== z) r = (t) => t.pending ? uz.default.createElement(V, null, "Press ", t.keyName, " again to exit") : uz.default.createElement(oA, null, w && uz.default.createElement(YA, {
        shortcut: "←",
        action: "go back"
    }), uz.default.createElement(YA, {
        shortcut: "Esc/Enter/Space",
        action: "close"
    }), K.status === "running" && z && uz.default.createElement(YA, {
        shortcut: "k",
        action: "kill"
    })), q[31] = K.status, q[32] = w, q[33] = z, q[34] = r;
    else r = q[34];
    let s;
    if (q[35] !== K.progress || q[36] !== K.status || q[37] !== X) s = K.status === "running" && K.progress?.recentActivities && K.progress.recentActivities.length > 0 && uz.default.createElement(I, {
        flexDirection: "column"
    }, uz.default.createElement(V, {
        bold: !0,
        dimColor: !0
    }, "Progress"), K.progress.recentActivities.map((t, J1) => uz.default.createElement(V, {
        key: J1,
        dimColor: J1 < K.progress.recentActivities.length - 1,
        wrap: "truncate-end"
    }, J1 === K.progress.recentActivities.length - 1 ? "› " : "  ", Z7z(t, j, X)))), q[35] = K.progress, q[36] = K.status, q[37] = X, q[38] = s;
    else s = q[38];
    let O1;
    if (q[39] !== J || q[40] !== O) O1 = O.length > 0 && uz.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, uz.default.createElement(V, {
        bold: !0,
        dimColor: !0
    }, "Tasks (", J, "/", O.length, ")"), uz.default.createElement(gs, {
        todos: O
    })), q[39] = J, q[40] = O, q[41] = O1;
    else O1 = q[41];
    let T1;
    if (q[42] !== N || q[43] !== Z) T1 = Z ? uz.default.createElement(I, {
        marginTop: 1
    }, uz.default.createElement(LM6, {
        addMargin: !1,
        planContent: Z
    })) : uz.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, uz.default.createElement(V, {
        bold: !0,
        dimColor: !0
    }, "Prompt"), uz.default.createElement(V, {
        wrap: "wrap"
    }, N)), q[42] = N, q[43] = Z, q[44] = T1;
    else T1 = q[44];
    let N1;
    if (q[45] !== K.error || q[46] !== K.status) N1 = K.status === "failed" && K.error && uz.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, uz.default.createElement(V, {
        bold: !0,
        color: "error"
    }, "Error"), uz.default.createElement(V, {
        color: "error",
        wrap: "wrap"
    }, K.error)), q[45] = K.error, q[46] = K.status, q[47] = N1;
    else N1 = q[47];
    let j1;
    if (q[48] !== s || q[49] !== O1 || q[50] !== T1 || q[51] !== N1) j1 = uz.default.createElement(I, {
        flexDirection: "column"
    }, s, O1, T1, N1), q[48] = s, q[49] = O1, q[50] = T1, q[51] = N1, q[52] = j1;
    else j1 = q[52];
    let q1;
    if (q[53] !== Y || q[54] !== l || q[55] !== r || q[56] !== j1 || q[57] !== m) q1 = uz.default.createElement(w8, {
        title: m,
        subtitle: l,
        onCancel: Y,
        color: "background",
        inputGuide: r
    }, j1), q[53] = Y, q[54] = l, q[55] = r, q[56] = j1, q[57] = m, q[58] = q1;
    else q1 = q[58];
    return q1
}
// @from(Ln 417942, Col 0)
function f7z(A) {
    return A.status === "completed"
}
// @from(Ln 417945, Col 4)
uz
// @from(Ln 417945, Col 8)
P7z
// @from(Ln 417946, Col 4)
dYq = v(() => {
    i1();
    m1();
    K7();
    d8();
    yF1();
    vq();
    hj6();
    b7();
    $P();
    wK();
    HK();
    dvA();
    N8();
    Bq();
    uz = o(X1(), 1), P7z = []
})
// @from(Ln 417964, Col 0)
function V7z(A, q, K) {
    let Y = q.find((z) => z.name === A.toolName);
    if (!Y) return A.toolName;
    try {
        let z = Y.inputSchema.safeParse(A.input),
            w = z.success ? z.data : {},
            H = Y.userFacingName(w);
        if (!H) return A.toolName;
        let $ = Y.renderToolUseMessage(w, {
            theme: K,
            verbose: !1
        });
        if ($) return jw.default.createElement(V, null, H, "(", $, ")");
        return H
    } catch {
        return A.toolName
    }
}
// @from(Ln 417983, Col 0)
function cYq(A) {
    let q = e(63),
        {
            teammate: K,
            onDone: Y,
            onKill: z,
            onBack: w,
            onForeground: H
        } = A,
        [$] = T7(),
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = tD(QD()), q[0] = O;
    else O = q[0];
    let _ = O,
        J = RP1(K.startTime, K.status === "running"),
        X;
    if (q[1] !== Y) X = {
        "confirm:yes": Y
    }, q[1] = Y, q[2] = X;
    else X = q[2];
    let D;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) D = {
        context: "Confirmation"
    }, q[3] = D;
    else D = q[3];
    c7(X, D);
    let j;
    if (q[4] !== w || q[5] !== Y || q[6] !== H || q[7] !== z || q[8] !== K.status) j = (N1, j1) => {
        if (N1 === " ") Y();
        else if (j1.leftArrow && w) w();
        else if (N1 === "k" && K.status === "running" && z) z();
        else if (N1 === "f" && K.status === "running" && H) H()
    }, q[4] = w, q[5] = Y, q[6] = H, q[7] = z, q[8] = K.status, q[9] = j;
    else j = q[9];
    D8(j);
    let M;
    if (q[10] !== K.awaitingPlanApproval || q[11] !== K.isIdle || q[12] !== K.progress || q[13] !== K.shutdownRequested) M = K.shutdownRequested ? "stopping" : K.awaitingPlanApproval ? "awaiting approval" : K.isIdle ? "idle" : (K.progress?.recentActivities && rB(K.progress.recentActivities)) ?? K.progress?.lastActivity?.activityDescription ?? "working", q[10] = K.awaitingPlanApproval, q[11] = K.isIdle, q[12] = K.progress, q[13] = K.shutdownRequested, q[14] = M;
    else M = q[14];
    let P = M,
        W = K.result?.totalTokens ?? K.progress?.tokenCount,
        G = K.result?.totalToolUseCount ?? K.progress?.toolUseCount,
        f;
    if (q[15] !== K.prompt) f = K3(K.prompt, 300), q[15] = K.prompt, q[16] = f;
    else f = q[16];
    let Z = f,
        N;
    if (q[17] !== K.identity.color) N = qP(K.identity.color), q[17] = K.identity.color, q[18] = N;
    else N = q[18];
    let T;
    if (q[19] !== N || q[20] !== K.identity.agentName) T = jw.default.createElement(V, {
        color: N
    }, "@", K.identity.agentName), q[19] = N, q[20] = K.identity.agentName, q[21] = T;
    else T = q[21];
    let k;
    if (q[22] !== P) k = P && jw.default.createElement(V, {
        dimColor: !0
    }, " (", P, ")"), q[22] = P, q[23] = k;
    else k = q[23];
    let y;
    if (q[24] !== T || q[25] !== k) y = jw.default.createElement(V, null, T, k), q[24] = T, q[25] = k, q[26] = y;
    else y = q[26];
    let B = y,
        S;
    if (q[27] !== K.status) S = K.status !== "running" && jw.default.createElement(V, {
        color: K.status === "completed" ? "success" : K.status === "killed" ? "warning" : "error"
    }, K.status === "completed" ? "Completed" : K.status === "failed" ? "Failed" : "Stopped", " · "), q[27] = K.status, q[28] = S;
    else S = q[28];
    let m;
    if (q[29] !== W) m = W !== void 0 && W > 0 && jw.default.createElement(jw.default.Fragment, null, " · ", Y3(W), " tokens"), q[29] = W, q[30] = m;
    else m = q[30];
    let b;
    if (q[31] !== G) b = G !== void 0 && G > 0 && jw.default.createElement(jw.default.Fragment, null, " ", "· ", G, " ", G === 1 ? "tool" : "tools"), q[31] = G, q[32] = b;
    else b = q[32];
    let g;
    if (q[33] !== J || q[34] !== m || q[35] !== b) g = jw.default.createElement(V, {
        dimColor: !0
    }, J, m, b), q[33] = J, q[34] = m, q[35] = b, q[36] = g;
    else g = q[36];
    let U;
    if (q[37] !== S || q[38] !== g) U = jw.default.createElement(V, null, S, g), q[37] = S, q[38] = g, q[39] = U;
    else U = q[39];
    let x = U,
        p;
    if (q[40] !== w || q[41] !== H || q[42] !== z || q[43] !== K.status) p = (N1) => N1.pending ? jw.default.createElement(V, null, "Press ", N1.keyName, " again to exit") : jw.default.createElement(oA, null, w && jw.default.createElement(YA, {
        shortcut: "←",
        action: "go back"
    }), jw.default.createElement(YA, {
        shortcut: "Esc/Enter/Space",
        action: "close"
    }), K.status === "running" && z && jw.default.createElement(YA, {
        shortcut: "k",
        action: "kill"
    }), K.status === "running" && H && jw.default.createElement(YA, {
        shortcut: "f",
        action: "foreground"
    })), q[40] = w, q[41] = H, q[42] = z, q[43] = K.status, q[44] = p;
    else p = q[44];
    let l;
    if (q[45] !== K.progress || q[46] !== K.status || q[47] !== $) l = K.status === "running" && K.progress?.recentActivities && K.progress.recentActivities.length > 0 && jw.default.createElement(I, {
        flexDirection: "column"
    }, jw.default.createElement(V, {
        bold: !0,
        dimColor: !0
    }, "Progress"), K.progress.recentActivities.map((N1, j1) => jw.default.createElement(V, {
        key: j1,
        dimColor: j1 < K.progress.recentActivities.length - 1,
        wrap: "truncate-end"
    }, j1 === K.progress.recentActivities.length - 1 ? "› " : "  ", V7z(N1, _, $)))), q[45] = K.progress, q[46] = K.status, q[47] = $, q[48] = l;
    else l = q[48];
    let r;
    if (q[49] === Symbol.for("react.memo_cache_sentinel")) r = jw.default.createElement(V, {
        bold: !0,
        dimColor: !0
    }, "Prompt"), q[49] = r;
    else r = q[49];
    let s;
    if (q[50] !== Z) s = jw.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, r, jw.default.createElement(V, {
        wrap: "wrap"
    }, Z)), q[50] = Z, q[51] = s;
    else s = q[51];
    let O1;
    if (q[52] !== K.error || q[53] !== K.status) O1 = K.status === "failed" && K.error && jw.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, jw.default.createElement(V, {
        bold: !0,
        color: "error"
    }, "Error"), jw.default.createElement(V, {
        color: "error",
        wrap: "wrap"
    }, K.error)), q[52] = K.error, q[53] = K.status, q[54] = O1;
    else O1 = q[54];
    let T1;
    if (q[55] !== Y || q[56] !== x || q[57] !== p || q[58] !== l || q[59] !== s || q[60] !== O1 || q[61] !== B) T1 = jw.default.createElement(w8, {
        title: B,
        subtitle: x,
        onCancel: Y,
        color: "background",
        inputGuide: p
    }, l, s, O1), q[55] = Y, q[56] = x, q[57] = p, q[58] = l, q[59] = s, q[60] = O1, q[61] = B, q[62] = T1;
    else T1 = q[62];
    return T1
}
// @from(Ln 418129, Col 4)
jw
// @from(Ln 418130, Col 4)
lYq = v(() => {
    i1();
    m1();
    K7();
    vq();
    hj6();
    $P();
    Eh();
    wK();
    HK();
    Bq();
    Zd();
    jw = o(X1(), 1)
})
// @from(Ln 418145, Col 0)
function IN(A) {
    if (A.status !== "running" && A.status !== "pending") return !1;
    if ("isBackgrounded" in A && A.isBackgrounded === !1) return !1;
    return !0
}
// @from(Ln 418151, Col 0)
function QZ1(A) {
    let q = e(4),
        {
            status: K,
            label: Y,
            suffix: z
        } = A,
        w = Y ?? K,
        H = K === "completed" ? "success" : K === "failed" ? "error" : K === "killed" ? "warning" : void 0,
        $;
    if (q[0] !== H || q[1] !== w || q[2] !== z) $ = FZ1.default.createElement(V, {
        color: H,
        dimColor: !0
    }, "(", w, z, ")"), q[0] = H, q[1] = w, q[2] = z, q[3] = $;
    else $ = q[3];
    return $
}
// @from(Ln 418169, Col 0)
function iYq(A) {
    let q = e(4),
        {
            shell: K
        } = A;
    switch (K.status) {
        case "completed": {
            let Y;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = FZ1.default.createElement(QZ1, {
                status: "completed",
                label: "done"
            }), q[0] = Y;
            else Y = q[0];
            return Y
        }
        case "failed": {
            let Y;
            if (q[1] === Symbol.for("react.memo_cache_sentinel")) Y = FZ1.default.createElement(QZ1, {
                status: "failed",
                label: "error"
            }), q[1] = Y;
            else Y = q[1];
            return Y
        }
        case "killed": {
            let Y;
            if (q[2] === Symbol.for("react.memo_cache_sentinel")) Y = FZ1.default.createElement(QZ1, {
                status: "killed",
                label: "stopped"
            }), q[2] = Y;
            else Y = q[2];
            return Y
        }
        case "running":
        case "pending": {
            let Y;
            if (q[3] === Symbol.for("react.memo_cache_sentinel")) Y = FZ1.default.createElement(QZ1, {
                status: "running"
            }), q[3] = Y;
            else Y = q[3];
            return Y
        }
    }
}
// @from(Ln 418213, Col 4)
FZ1
// @from(Ln 418214, Col 4)
nYq = v(() => {
    i1();
    m1();
    FZ1 = o(X1(), 1)
})
// @from(Ln 418220, Col 0)
function rYq(A) {
    let q = e(44),
        {
            task: K,
            maxActivityWidth: Y
        } = A,
        z = Y ?? 40;
    switch (K.type) {
        case "local_bash": {
            let w;
            if (q[0] !== z || q[1] !== K.command) w = DY(K.command, z, !0), q[0] = z, q[1] = K.command, q[2] = w;
            else w = q[2];
            let H;
            if (q[3] !== K) H = w0.createElement(iYq, {
                shell: K
            }), q[3] = K, q[4] = H;
            else H = q[4];
            let $;
            if (q[5] !== w || q[6] !== H) $ = w0.createElement(V, null, w, " ", H), q[5] = w, q[6] = H, q[7] = $;
            else $ = q[7];
            return $
        }
        case "remote_agent": {
            let w;
            if (q[8] !== z || q[9] !== K.title) w = DY(K.title, z, !0), q[8] = z, q[9] = K.title, q[10] = w;
            else w = q[10];
            let H;
            if (q[11] !== K) H = w0.createElement(vN6, {
                session: K
            }), q[11] = K, q[12] = H;
            else H = q[12];
            let $;
            if (q[13] !== w || q[14] !== H) $ = w0.createElement(V, null, w, " ", H), q[13] = w, q[14] = H, q[15] = $;
            else $ = q[15];
            return $
        }
        case "local_agent": {
            let w;
            if (q[16] !== z || q[17] !== K.description) w = DY(K.description, z, !0), q[16] = z, q[17] = K.description, q[18] = w;
            else w = q[18];
            let H = K.status === "completed" ? "done" : void 0,
                $ = K.status === "completed" && !K.notified ? ", unread" : void 0,
                O;
            if (q[19] !== H || q[20] !== $ || q[21] !== K.status) O = w0.createElement(QZ1, {
                status: K.status,
                label: H,
                suffix: $
            }), q[19] = H, q[20] = $, q[21] = K.status, q[22] = O;
            else O = q[22];
            let _;
            if (q[23] !== w || q[24] !== O) _ = w0.createElement(V, null, w, " ", O), q[23] = w, q[24] = O, q[25] = _;
            else _ = q[25];
            return _
        }
        case "in_process_teammate": {
            let w;
            if (q[26] !== K.awaitingPlanApproval || q[27] !== K.isIdle || q[28] !== K.progress || q[29] !== K.shutdownRequested) w = K.shutdownRequested ? "stopping" : K.awaitingPlanApproval ? "awaiting approval" : K.isIdle ? "idle" : (K.progress?.recentActivities && rB(K.progress.recentActivities)) ?? K.progress?.lastActivity?.activityDescription ?? "working", q[26] = K.awaitingPlanApproval, q[27] = K.isIdle, q[28] = K.progress, q[29] = K.shutdownRequested, q[30] = w;
            else w = q[30];
            let H = w,
                $;
            if (q[31] !== K.identity.color) $ = qP(K.identity.color), q[31] = K.identity.color, q[32] = $;
            else $ = q[32];
            let O;
            if (q[33] !== $ || q[34] !== K.identity.agentName) O = w0.createElement(V, {
                color: $
            }, "@", K.identity.agentName), q[33] = $, q[34] = K.identity.agentName, q[35] = O;
            else O = q[35];
            let _;
            if (q[36] !== H || q[37] !== z) _ = DY(H, z, !0), q[36] = H, q[37] = z, q[38] = _;
            else _ = q[38];
            let J;
            if (q[39] !== _) J = w0.createElement(V, {
                dimColor: !0
            }, ": ", _), q[39] = _, q[40] = J;
            else J = q[40];
            let X;
            if (q[41] !== O || q[42] !== J) X = w0.createElement(V, null, O, J), q[41] = O, q[42] = J, q[43] = X;
            else X = q[43];
            return X
        }
    }
}
// @from(Ln 418302, Col 4)
w0
// @from(Ln 418303, Col 4)
oYq = v(() => {
    i1();
    nYq();
    JuA();
    vq();
    m1();
    Zd();
    Eh();
    w0 = o(X1(), 1)
})
// @from(Ln 418314, Col 0)
function ye(A, q) {
    c("tengu_transcript_view_enter", {}), q((K) => {
        if (K.viewingAgentTaskId === A && K.viewSelectionMode === "viewing-agent") return K;
        return {
            ...K,
            viewingAgentTaskId: A,
            viewSelectionMode: "viewing-agent"
        }
    })
}
// @from(Ln 418325, Col 0)
function pI(A) {
    c("tengu_transcript_view_exit", {}), A((q) => {
        if (q.viewingAgentTaskId === void 0 && q.viewSelectionMode === "none") return q;
        return {
            ...q,
            viewingAgentTaskId: void 0,
            viewSelectionMode: "none"
        }
    })
}
// @from(Ln 418335, Col 4)
Od1 = v(() => {
    u6()
})
// @from(Ln 418339, Col 0)
function N7z(A, q) {
    return Object.values(A ?? {}).filter(IN).filter((Y) => !(Y.type === "local_agent" && Y.id === q))
}
// @from(Ln 418343, Col 0)
function EN6({
    onDone: A,
    toolUseContext: q
}) {
    let K = v6((x) => x.tasks),
        Y = v6((x) => x.foregroundedTaskId),
        z = v6((x) => x.expandedView) === "teammates",
        w = L7(),
        H = K,
        $ = qK.useRef(!1),
        [O, _] = p91.useState(() => {
            let x = N7z(H, Y);
            if (x.length === 1) return $.current = !0, {
                mode: "detail",
                itemId: x[0].id
            };
            return {
                mode: "list"
            }
        }),
        [J, X] = p91.useState(0);
    DZ("background-tasks-dialog");
    let {
        bashTasks: D,
        remoteSessions: j,
        agentTasks: M,
        teammateTasks: P,
        allSelectableItems: W
    } = p91.useMemo(() => {
        let l = Object.values(H ?? {}).filter(IN).map(T7z).sort((j1, q1) => {
                let t = j1.status,
                    J1 = q1.status;
                if (t === "running" && J1 !== "running") return -1;
                if (t !== "running" && J1 === "running") return 1;
                let D1 = "task" in j1 ? j1.task.startTime : 0;
                return ("task" in q1 ? q1.task.startTime : 0) - D1
            }),
            r = l.filter((j1) => j1.type === "local_bash"),
            s = l.filter((j1) => j1.type === "remote_agent"),
            O1 = l.filter((j1) => j1.type === "local_agent" && j1.id !== Y),
            T1 = z ? [] : l.filter((j1) => j1.type === "in_process_teammate"),
            N1 = T1.length > 0 ? [{
                id: "__leader__",
                type: "leader",
                label: `@${K2}`,
                status: "running"
            }] : [];
        return {
            bashTasks: r,
            remoteSessions: s,
            agentTasks: O1,
            teammateTasks: [...N1, ...T1],
            allSelectableItems: [...N1, ...T1, ...r, ...s, ...O1]
        }
    }, [H, Y, z]), G = W[J] ?? null;
    c7({
        "confirm:previous": () => X((x) => Math.max(0, x - 1)),
        "confirm:next": () => X((x) => Math.min(W.length - 1, x + 1)),
        "confirm:yes": () => {
            let x = W[J];
            if (x)
                if (x.type === "leader") pI(w), A("Viewing leader", {
                    display: "system"
                });
                else _({
                    mode: "detail",
                    itemId: x.id
                })
        }
    }, {
        context: "Confirmation",
        isActive: O.mode === "list"
    }), D8((x, p) => {
        if (O.mode !== "list") return;
        let l = W[J];
        if (!l) return;
        if (x === "k") {
            if (l.type === "local_bash" && l.status === "running") f(l.id);
            else if (l.type === "local_agent" && l.status === "running") Z(l.id);
            else if (l.type === "in_process_teammate" && l.status === "running") N(l.id)
        }
        if (x === "f") {
            if (l.type === "in_process_teammate" && l.status === "running") ye(l.id, w), A("Viewing teammate", {
                display: "system"
            });
            else if (l.type === "leader") pI(w), A("Viewing leader", {
                display: "system"
            })
        }
    });
    async function f(x) {
        await gj1.kill(x, {
            abortController: q.abortController,
            getAppState: q.getAppState,
            setAppState: w
        })
    }
    async function Z(x) {
        await B_6.kill(x, {
            abortController: q.abortController,
            getAppState: q.getAppState,
            setAppState: w
        })
    }
    async function N(x) {
        await bF1.kill(x, {
            abortController: q.abortController,
            getAppState: q.getAppState,
            setAppState: w
        })
    }
    let T = qK.useEffectEvent(A);
    p91.useEffect(() => {
        if (O.mode !== "list") {
            let p = (H ?? {})[O.itemId];
            if (!p || !IN(p))
                if ($.current) T("Background tasks dialog dismissed", {
                    display: "system"
                });
                else _({
                    mode: "list"
                })
        }
        let x = W.length;
        if (J >= x && x > 0) X(x - 1)
    }, [O, H, J, W, T]);
    let k = () => {
        if ($.current) A("Background tasks dialog dismissed", {
            display: "system"
        });
        else _({
            mode: "list"
        })
    };
    if (O.mode !== "list" && H) {
        let x = H[O.itemId];
        if (!x) return null;
        switch (x.type) {
            case "local_bash":
                return qK.default.createElement(BYq, {
                    shell: x,
                    onDone: A,
                    onKillShell: () => void f(x.id),
                    onBack: k,
                    key: `shell-${x.id}`
                });
            case "local_agent":
                return qK.default.createElement(pYq, {
                    agent: x,
                    onDone: A,
                    onKillAgent: () => void Z(x.id),
                    onBack: k,
                    key: `agent-${x.id}`
                });
            case "remote_agent":
                return qK.default.createElement(gYq, {
                    session: x,
                    onDone: A,
                    toolUseContext: q,
                    onBack: k,
                    key: `session-${x.id}`
                });
            case "in_process_teammate":
                return qK.default.createElement(cYq, {
                    teammate: x,
                    onDone: A,
                    onKill: x.status === "running" ? () => void N(x.id) : void 0,
                    onBack: k,
                    onForeground: x.status === "running" ? () => {
                        ye(x.id, w), A("Viewing teammate", {
                            display: "system"
                        })
                    } : void 0,
                    key: `teammate-${x.id}`
                })
        }
    }
    let y = D.filter((x) => x.status === "running").length,
        B = j.filter((x) => x.status === "running" || x.status === "pending").length + M.filter((x) => x.status === "running").length,
        S = P.filter((x) => x.status === "running").length,
        m = rR([...S > 0 ? [qK.default.createElement(V, {
            key: "teammates"
        }, S, " ", S !== 1 ? "agents" : "agent")] : [], ...y > 0 ? [qK.default.createElement(V, {
            key: "shells"
        }, y, " ", y !== 1 ? "active shells" : "active shell")] : [], ...B > 0 ? [qK.default.createElement(V, {
            key: "agents"
        }, B, " ", B !== 1 ? "active agents" : "active agent")] : []], (x) => qK.default.createElement(V, {
            key: `separator-${x}`
        }, " · ")),
        b = [qK.default.createElement(YA, {
            key: "upDown",
            shortcut: "↑/↓",
            action: "select"
        }), qK.default.createElement(YA, {
            key: "enter",
            shortcut: "Enter",
            action: "view"
        }), ...G?.type === "in_process_teammate" && G.status === "running" ? [qK.default.createElement(YA, {
            key: "foreground",
            shortcut: "f",
            action: "foreground"
        })] : [], ...(G?.type === "local_bash" || G?.type === "local_agent" || G?.type === "in_process_teammate") && G.status === "running" ? [qK.default.createElement(YA, {
            key: "kill",
            shortcut: "k",
            action: "kill"
        })] : [], qK.default.createElement(YA, {
            key: "esc",
            shortcut: "Esc",
            action: "close"
        })],
        g = () => A("Background tasks dialog dismissed", {
            display: "system"
        });

    function U(x) {
        if (x.pending) return qK.default.createElement(V, null, "Press ", x.keyName, " again to exit");
        return qK.default.createElement(oA, null, b)
    }
    return qK.default.createElement(w8, {
        title: "Background tasks",
        subtitle: qK.default.createElement(qK.default.Fragment, null, m),
        onCancel: g,
        color: "background",
        inputGuide: U
    }, W.length === 0 ? qK.default.createElement(V, {
        dimColor: !0
    }, "No tasks currently running") : qK.default.createElement(I, {
        flexDirection: "column"
    }, P.length > 0 && qK.default.createElement(I, {
        flexDirection: "column"
    }, (D.length > 0 || j.length > 0 || M.length > 0) && qK.default.createElement(V, {
        dimColor: !0
    }, qK.default.createElement(V, {
        bold: !0
    }, "  ", "Agents"), " (", P.filter((x) => x.type !== "leader").length, ")"), qK.default.createElement(I, {
        flexDirection: "column"
    }, (() => {
        let x = P.filter((s) => s.type === "leader"),
            p = P.filter((s) => s.type === "in_process_teammate"),
            l = new Map;
        for (let s of p) {
            let O1 = s.task.identity.teamName,
                T1 = l.get(O1);
            if (T1) T1.push(s);
            else l.set(O1, [s])
        }
        let r = [...l.entries()];
        return qK.default.createElement(qK.default.Fragment, null, r.map(([s, O1]) => {
            let T1 = O1.length + x.length;
            return qK.default.createElement(I, {
                key: s,
                flexDirection: "column"
            }, qK.default.createElement(V, {
                dimColor: !0
            }, "  ", "Team: ", s, " (", T1, ")"), x.map((N1) => qK.default.createElement(_d1, {
                key: `${N1.id}-${s}`,
                item: N1,
                isSelected: N1.id === G?.id
            })), O1.map((N1) => qK.default.createElement(_d1, {
                key: N1.id,
                item: N1,
                isSelected: N1.id === G?.id
            })))
        }))
    })())), D.length > 0 && qK.default.createElement(I, {
        flexDirection: "column",
        marginTop: P.length > 0 ? 1 : 0
    }, (P.length > 0 || j.length > 0 || M.length > 0) && qK.default.createElement(V, {
        dimColor: !0
    }, qK.default.createElement(V, {
        bold: !0
    }, "  ", "Bashes"), " (", D.length, ")"), qK.default.createElement(I, {
        flexDirection: "column"
    }, D.map((x) => qK.default.createElement(_d1, {
        key: x.id,
        item: x,
        isSelected: x.id === G?.id
    })))), j.length > 0 && qK.default.createElement(I, {
        flexDirection: "column",
        marginTop: P.length > 0 || D.length > 0 ? 1 : 0
    }, qK.default.createElement(V, {
        dimColor: !0
    }, qK.default.createElement(V, {
        bold: !0
    }, "  ", "Remote agents"), " (", j.length, ")"), qK.default.createElement(I, {
        flexDirection: "column"
    }, j.map((x) => qK.default.createElement(_d1, {
        key: x.id,
        item: x,
        isSelected: x.id === G?.id
    })))), M.length > 0 && qK.default.createElement(I, {
        flexDirection: "column",
        marginTop: P.length > 0 || D.length > 0 || j.length > 0 ? 1 : 0
    }, qK.default.createElement(V, {
        dimColor: !0
    }, qK.default.createElement(V, {
        bold: !0
    }, "  ", "Local agents"), " (", M.length, ")"), qK.default.createElement(I, {
        flexDirection: "column"
    }, M.map((x) => qK.default.createElement(_d1, {
        key: x.id,
        item: x,
        isSelected: x.id === G?.id
    }))))))
}
// @from(Ln 418649, Col 0)
function T7z(A) {
    switch (A.type) {
        case "local_bash":
            return {
                id: A.id, type: "local_bash", label: A.command, status: A.status, task: A
            };
        case "remote_agent":
            return {
                id: A.id, type: "remote_agent", label: A.title, status: A.status, task: A
            };
        case "local_agent":
            return {
                id: A.id, type: "local_agent", label: A.description, status: A.status, task: A
            };
        case "in_process_teammate":
            return {
                id: A.id, type: "in_process_teammate", label: `@${A.identity.agentName}`, status: A.status, task: A
            }
    }
}
// @from(Ln 418670, Col 0)
function _d1(A) {
    let q = e(14),
        {
            item: K,
            isSelected: Y
        } = A,
        {
            columns: z
        } = Z8(),
        w = Math.max(30, z - 26),
        H;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) H = KY(), q[0] = H;
    else H = q[0];
    let $ = H,
        O = $ && Y,
        _ = Y ? l1.pointer + " " : "  ",
        J;
    if (q[1] !== O || q[2] !== _) J = qK.default.createElement(V, {
        dimColor: O
    }, _), q[1] = O, q[2] = _, q[3] = J;
    else J = q[3];
    let X = Y && !$ ? "suggestion" : void 0,
        D;
    if (q[4] !== K.task || q[5] !== K.type || q[6] !== w) D = K.type === "leader" ? qK.default.createElement(V, null, "@", K2) : qK.default.createElement(rYq, {
        task: K.task,
        maxActivityWidth: w
    }), q[4] = K.task, q[5] = K.type, q[6] = w, q[7] = D;
    else D = q[7];
    let j;
    if (q[8] !== X || q[9] !== D) j = qK.default.createElement(V, {
        color: X
    }, D), q[8] = X, q[9] = D, q[10] = j;
    else j = q[10];
    let M;
    if (q[11] !== J || q[12] !== j) M = qK.default.createElement(I, {
        flexDirection: "row"
    }, J, j), q[11] = J, q[12] = j, q[13] = M;
    else M = q[13];
    return M
}
// @from(Ln 418710, Col 4)
qK
// @from(Ln 418710, Col 8)
p91
// @from(Ln 418711, Col 4)
DuA = v(() => {
    i1();
    m1();
    K7();
    oS();
    b7();
    mYq();
    UYq();
    dYq();
    lYq();
    d8();
    kK1();
    ra();
    gR();
    oYq();
    mq();
    wK();
    HK();
    Bq();
    Od1();
    cM();
    qK = o(X1(), 1), p91 = o(X1(), 1)
})
// @from(Ln 418734, Col 4)
aYq = {}
// @from(Ln 418738, Col 0)
async function v7z(A, q) {
    return juA.createElement(EN6, {
        toolUseContext: q,
        onDone: A
    })
}
// @from(Ln 418744, Col 4)
juA
// @from(Ln 418745, Col 4)
sYq = v(() => {
    DuA();
    juA = o(X1(), 1)
})
// @from(Ln 418749, Col 4)
E7z
// @from(Ln 418749, Col 9)
tYq
// @from(Ln 418750, Col 4)
eYq = v(() => {
    E7z = {
        type: "local-jsx",
        name: "tasks",
        aliases: ["bashes"],
        description: "List and manage background tasks",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (sYq(), aYq)),
        userFacingName() {
            return "tasks"
        }
    }, tYq = E7z
})
// @from(Ln 418764, Col 4)
Azq = v(() => {
    J7();
    mV()
})
// @from(Ln 418768, Col 4)
qzq = {}
// @from(Ln 418773, Col 0)
function k7z() {
    let A = e(4),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) {
        let w = U6();
        q = UB(w), A[0] = q
    } else q = A[0];
    let K = q;
    if (K.length === 0) {
        let w;
        if (A[1] === Symbol.for("react.memo_cache_sentinel")) w = Zc.default.createElement(V, null, "No todos currently tracked"), A[1] = w;
        else w = A[1];
        return w
    }
    let Y;
    if (A[2] === Symbol.for("react.memo_cache_sentinel")) Y = Zc.default.createElement(V, null, Zc.default.createElement(V, {
        bold: !0
    }, K.length, " ", K.length === 1 ? "todo" : "todos"), Zc.default.createElement(V, null, ":")), A[2] = Y;
    else Y = A[2];
    let z;
    if (A[3] === Symbol.for("react.memo_cache_sentinel")) z = Zc.default.createElement(I, {
        flexDirection: "column"
    }, Y, Zc.default.createElement(I, {
        marginTop: 1
    }, Zc.default.createElement(gs, {
        todos: K
    }))), A[3] = z;
    else z = A[3];
    return z
}
// @from(Ln 418803, Col 0)
async function L7z(A) {
    let q = await JZ1(Zc.default.createElement(k7z, null));
    return A(q), null
}
// @from(Ln 418807, Col 4)
Zc
// @from(Ln 418808, Col 4)
Kzq = v(() => {
    i1();
    pB();
    B6();
    m1();
    fp1();
    yF1();
    Zc = o(X1(), 1)
})
// @from(Ln 418817, Col 4)
R7z
// @from(Ln 418817, Col 9)
Yzq
// @from(Ln 418818, Col 4)
zzq = v(() => {
    R7z = {
        type: "local-jsx",
        name: "todos",
        description: "List current todo items",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (Kzq(), qzq)),
        userFacingName() {
            return "todos"
        }
    }, Yzq = R7z
})
// @from(Ln 418831, Col 4)
y7z = `---
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git log:*), Bash(git show:*), Bash(git remote show:*), Read, Glob, Grep, LS, Task
description: Complete a security review of the pending changes on the current branch
---

You are a senior security engineer conducting a focused security review of the changes on this branch.

GIT STATUS:

\`\`\`
!\`git status\`
\`\`\`

FILES MODIFIED:

\`\`\`
!\`git diff --name-only origin/HEAD...\`
\`\`\`

COMMITS:

\`\`\`
!\`git log --no-decorate origin/HEAD...\`
\`\`\`

DIFF CONTENT:

\`\`\`
!\`git diff --merge-base origin/HEAD\`
\`\`\`

Review the complete diff above. This contains all code changes in the PR.


OBJECTIVE:
Perform a security-focused code review to identify HIGH-CONFIDENCE security vulnerabilities that could have real exploitation potential. This is not a general code review - focus ONLY on security implications newly added by this PR. Do not comment on existing security concerns.

CRITICAL INSTRUCTIONS:
1. MINIMIZE FALSE POSITIVES: Only flag issues where you're >80% confident of actual exploitability
2. AVOID NOISE: Skip theoretical issues, style concerns, or low-impact findings
3. FOCUS ON IMPACT: Prioritize vulnerabilities that could lead to unauthorized access, data breaches, or system compromise
4. EXCLUSIONS: Do NOT report the following issue types:
   - Denial of Service (DOS) vulnerabilities, even if they allow service disruption
   - Secrets or sensitive data stored on disk (these are handled by other processes)
   - Rate limiting or resource exhaustion issues

SECURITY CATEGORIES TO EXAMINE:

**Input Validation Vulnerabilities:**
- SQL injection via unsanitized user input
- Command injection in system calls or subprocesses
- XXE injection in XML parsing
- Template injection in templating engines
- NoSQL injection in database queries
- Path traversal in file operations

**Authentication & Authorization Issues:**
- Authentication bypass logic
- Privilege escalation paths
- Session management flaws
- JWT token vulnerabilities
- Authorization logic bypasses

**Crypto & Secrets Management:**
- Hardcoded API keys, passwords, or tokens
- Weak cryptographic algorithms or implementations
- Improper key storage or management
- Cryptographic randomness issues
- Certificate validation bypasses

**Injection & Code Execution:**
- Remote code execution via deseralization
- Pickle injection in Python
- YAML deserialization vulnerabilities
- Eval injection in dynamic code execution
- XSS vulnerabilities in web applications (reflected, stored, DOM-based)

**Data Exposure:**
- Sensitive data logging or storage
- PII handling violations
- API endpoint data leakage
- Debug information exposure

Additional notes:
- Even if something is only exploitable from the local network, it can still be a HIGH severity issue

ANALYSIS METHODOLOGY:

Phase 1 - Repository Context Research (Use file search tools):
- Identify existing security frameworks and libraries in use
- Look for established secure coding patterns in the codebase
- Examine existing sanitization and validation patterns
- Understand the project's security model and threat model

Phase 2 - Comparative Analysis:
- Compare new code changes against existing security patterns
- Identify deviations from established secure practices
- Look for inconsistent security implementations
- Flag code that introduces new attack surfaces

Phase 3 - Vulnerability Assessment:
- Examine each modified file for security implications
- Trace data flow from user inputs to sensitive operations
- Look for privilege boundaries being crossed unsafely
- Identify injection points and unsafe deserialization

REQUIRED OUTPUT FORMAT:

You MUST output your findings in markdown. The markdown output should contain the file, line number, severity, category (e.g. \`sql_injection\` or \`xss\`), description, exploit scenario, and fix recommendation.

For example:

# Vuln 1: XSS: \`foo.py:42\`

* Severity: High
* Description: User input from \`username\` parameter is directly interpolated into HTML without escaping, allowing reflected XSS attacks
* Exploit Scenario: Attacker crafts URL like /bar?q=<script>alert(document.cookie)</script> to execute JavaScript in victim's browser, enabling session hijacking or data theft
* Recommendation: Use Flask's escape() function or Jinja2 templates with auto-escaping enabled for all user inputs rendered in HTML

SEVERITY GUIDELINES:
- **HIGH**: Directly exploitable vulnerabilities leading to RCE, data breach, or authentication bypass
- **MEDIUM**: Vulnerabilities requiring specific conditions but with significant impact
- **LOW**: Defense-in-depth issues or lower-impact vulnerabilities

CONFIDENCE SCORING:
- 0.9-1.0: Certain exploit path identified, tested if possible
- 0.8-0.9: Clear vulnerability pattern with known exploitation methods
- 0.7-0.8: Suspicious pattern requiring specific conditions to exploit
- Below 0.7: Don't report (too speculative)

FINAL REMINDER:
Focus on HIGH and MEDIUM findings only. Better to miss some theoretical issues than flood the report with false positives. Each finding should be something a security engineer would confidently raise in a PR review.

FALSE POSITIVE FILTERING:

> You do not need to run commands to reproduce the vulnerability, just read the code to determine if it is a real vulnerability. Do not use the bash tool or write to any files.
>
> HARD EXCLUSIONS - Automatically exclude findings matching these patterns:
> 1. Denial of Service (DOS) vulnerabilities or resource exhaustion attacks.
> 2. Secrets or credentials stored on disk if they are otherwise secured.
> 3. Rate limiting concerns or service overload scenarios.
> 4. Memory consumption or CPU exhaustion issues.
> 5. Lack of input validation on non-security-critical fields without proven security impact.
> 6. Input sanitization concerns for GitHub Action workflows unless they are clearly triggerable via untrusted input.
> 7. A lack of hardening measures. Code is not expected to implement all security best practices, only flag concrete vulnerabilities.
> 8. Race conditions or timing attacks that are theoretical rather than practical issues. Only report a race condition if it is concretely problematic.
> 9. Vulnerabilities related to outdated third-party libraries. These are managed separately and should not be reported here.
> 10. Memory safety issues such as buffer overflows or use-after-free-vulnerabilities are impossible in rust. Do not report memory safety issues in rust or any other memory safe languages.
> 11. Files that are only unit tests or only used as part of running tests.
> 12. Log spoofing concerns. Outputting un-sanitized user input to logs is not a vulnerability.
> 13. SSRF vulnerabilities that only control the path. SSRF is only a concern if it can control the host or protocol.
> 14. Including user-controlled content in AI system prompts is not a vulnerability.
> 15. Regex injection. Injecting untrusted content into a regex is not a vulnerability.
> 16. Regex DOS concerns.
> 16. Insecure documentation. Do not report any findings in documentation files such as markdown files.
> 17. A lack of audit logs is not a vulnerability.
>
> PRECEDENTS -
> 1. Logging high value secrets in plaintext is a vulnerability. Logging URLs is assumed to be safe.
> 2. UUIDs can be assumed to be unguessable and do not need to be validated.
> 3. Environment variables and CLI flags are trusted values. Attackers are generally not able to modify them in a secure environment. Any attack that relies on controlling an environment variable is invalid.
> 4. Resource management issues such as memory or file descriptor leaks are not valid.
> 5. Subtle or low impact web vulnerabilities such as tabnabbing, XS-Leaks, prototype pollution, and open redirects should not be reported unless they are extremely high confidence.
> 6. React and Angular are generally secure against XSS. These frameworks do not need to sanitize or escape user input unless it is using dangerouslySetInnerHTML, bypassSecurityTrustHtml, or similar methods. Do not report XSS vulnerabilities in React or Angular components or tsx files unless they are using unsafe methods.
> 7. Most vulnerabilities in github action workflows are not exploitable in practice. Before validating a github action workflow vulnerability ensure it is concrete and has a very specific attack path.
> 8. A lack of permission checking or authentication in client-side JS/TS code is not a vulnerability. Client-side code is not trusted and does not need to implement these checks, they are handled on the server-side. The same applies to all flows that send untrusted data to the backend, the backend is responsible for validating and sanitizing all inputs.
> 9. Only include MEDIUM findings if they are obvious and concrete issues.
> 10. Most vulnerabilities in ipython notebooks (*.ipynb files) are not exploitable in practice. Before validating a notebook vulnerability ensure it is concrete and has a very specific attack path where untrusted input can trigger the vulnerability.
> 11. Logging non-PII data is not a vulnerability even if the data may be sensitive. Only report logging vulnerabilities if they expose sensitive information such as secrets, passwords, or personally identifiable information (PII).
> 12. Command injection vulnerabilities in shell scripts are generally not exploitable in practice since shell scripts generally do not run with untrusted user input. Only report command injection vulnerabilities in shell scripts if they are concrete and have a very specific attack path for untrusted input.
>
> SIGNAL QUALITY CRITERIA - For remaining findings, assess:
> 1. Is there a concrete, exploitable vulnerability with a clear attack path?
> 2. Does this represent a real security risk vs theoretical best practice?
> 3. Are there specific code locations and reproduction steps?
> 4. Would this finding be actionable for a security team?
>
> For each finding, assign a confidence score from 1-10:
> - 1-3: Low confidence, likely false positive or noise
> - 4-6: Medium confidence, needs investigation
> - 7-10: High confidence, likely true vulnerability

START ANALYSIS:

Begin your analysis now. Do this in 3 steps:

1. Use a sub-task to identify vulnerabilities. Use the repository exploration tools to understand the codebase context, then analyze the PR changes for security implications. In the prompt for this sub-task, include all of the above.
2. Then for each vulnerability identified by the above sub-task, create a new sub-task to filter out false-positives. Launch these sub-tasks as parallel sub-tasks. In the prompt for these sub-tasks, include everything in the "FALSE POSITIVE FILTERING" instructions.
3. Filter out any vulnerabilities where the sub-task reported a confidence less than 8.

Your final reply must contain the markdown report and nothing else.`
// @from(Ln 419022, Col 4)
wzq
// @from(Ln 419023, Col 4)
Hzq = v(() => {
    a01();
    Lg();
    Ep();
    v3();
    wzq = bZ1({
        name: "security-review",
        description: "Complete a security review of the pending changes on the current branch",
        progressMessage: "analyzing code changes for security risks",
        pluginName: "security-review",
        pluginCommand: "security-review",
        async getPromptWhileMarketplaceIsPrivate(A, q) {
            u8("security-review");
            let K = yD(y7z),
                Y = Vh(K.frontmatter["allowed-tools"]);
            return [{
                type: "text",
                text: await Ma(K.content, {
                    ...q,
                    async getAppState() {
                        let w = await q.getAppState();
                        return {
                            ...w,
                            toolPermissionContext: {
                                ...w.toolPermissionContext,
                                alwaysAllowRules: {
                                    ...w.toolPermissionContext.alwaysAllowRules,
                                    command: Y
                                }
                            }
                        }
                    }
                }, "security-review")
            }]
        }
    })
})
// @from(Ln 419060, Col 4)
$zq = {}
// @from(Ln 419064, Col 4)
MuA
// @from(Ln 419064, Col 9)
C7z = async (A, q) => {
    return MuA.createElement(_Z1, {
        onClose: A,
        context: q,
        defaultTab: "Usage"
    })
}
// @from(Ln 419071, Col 4)
Ozq = v(() => {
    DV6();
    MuA = o(X1(), 1)
})
// @from(Ln 419075, Col 4)
PuA
// @from(Ln 419076, Col 4)
_zq = v(() => {
    PuA = {
        type: "local-jsx",
        name: "usage",
        description: "Show plan usage limits",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (Ozq(), $zq)),
        userFacingName() {
            return "usage"
        }
    }
})
// @from(Ln 419089, Col 4)
Jzq = {}
// @from(Ln 419094, Col 0)
function S7z(A) {
    let q = e(10),
        {
            onDone: K
        } = A,
        [Y, z] = T7(),
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = fc.createElement(CY, {
        dividerColor: "permission",
        dividerDimColor: !0
    }), q[0] = w;
    else w = q[0];
    let H;
    if (q[1] !== K || q[2] !== z) H = (_) => {
        z(_), K(`Theme set to ${_}`)
    }, q[1] = K, q[2] = z, q[3] = H;
    else H = q[3];
    let $;
    if (q[4] !== K) $ = () => {
        K("Theme picker dismissed", {
            display: "system"
        })
    }, q[4] = K, q[5] = $;
    else $ = q[5];
    let O;
    if (q[6] !== Y || q[7] !== H || q[8] !== $) O = fc.createElement(I, {
        flexDirection: "column"
    }, w, fc.createElement(zZ1, {
        initialTheme: Y,
        onThemeSelect: H,
        onCancel: $,
        skipExitHandling: !0
    })), q[6] = Y, q[7] = H, q[8] = $, q[9] = O;
    else O = q[9];
    return O
}
// @from(Ln 419130, Col 4)
fc
// @from(Ln 419130, Col 8)
h7z = async (A, q) => {
    return fc.createElement(S7z, {
        onDone: A
    })
}
// @from(Ln 419135, Col 4)
Xzq = v(() => {
    i1();
    m1();
    wV6();
    kW();
    fc = o(X1(), 1)
})
// @from(Ln 419142, Col 4)
I7z
// @from(Ln 419142, Col 9)
WuA
// @from(Ln 419143, Col 4)
Dzq = v(() => {
    I7z = {
        type: "local-jsx",
        name: "theme",
        description: "Change the theme",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (Xzq(), Jzq)),
        userFacingName() {
            return "theme"
        }
    }, WuA = I7z
})
// @from(Ln 419156, Col 4)
jzq = {}
// @from(Ln 419160, Col 4)
x7z = async () => {
    u8("vim-mode");
    let q = f6().editorMode || "normal";
    if (q === "emacs") q = "normal";
    let K = q === "normal" ? "vim" : "normal";
    return jA((Y) => ({
        ...Y,
        editorMode: K
    })), c("tengu_editor_mode_changed", {
        mode: K,
        source: "command"
    }), {
        type: "text",
        value: `Editor mode set to ${K}. ${K==="vim"?"Use Escape key to toggle between INSERT and NORMAL modes.":"Using standard (readline) keyboard bindings."}`
    }
}
// @from(Ln 419176, Col 4)
Mzq = v(() => {
    cA();
    u6();
    v3()
})
// @from(Ln 419181, Col 4)
b7z
// @from(Ln 419181, Col 9)
GuA
// @from(Ln 419182, Col 4)
Pzq = v(() => {
    b7z = {
        name: "vim",
        description: "Toggle between Vim and Normal editing modes",
        isEnabled: () => !0,
        isHidden: !1,
        supportsNonInteractive: !1,
        type: "local",
        userFacingName: () => "vim",
        load: () => Promise.resolve().then(() => (Mzq(), jzq))
    }, GuA = b7z
})
// @from(Ln 419194, Col 4)
ZuA
// @from(Ln 419194, Col 9)
d91 = "claude-plugins-official"
// @from(Ln 419195, Col 4)
kN6 = v(() => {
    ZuA = {
        source: "github",
        repo: "anthropics/claude-plugins-official"
    }
})
// @from(Ln 419201, Col 4)
Zzq = {}
// @from(Ln 419216, Col 0)
function Wzq() {
    return d91
}
// @from(Ln 419220, Col 0)
function m7z() {
    return B7z
}
// @from(Ln 419224, Col 0)
function Gzq() {
    return `thinkback@${Wzq()}`
}
// @from(Ln 419227, Col 0)
async function Q7z() {
    let {
        enabled: A
    } = await iY(), q = A.find((Y) => Y.name === "thinkback" || Y.source && Y.source.includes(Gzq()));
    if (!q) return null;
    let K = Jd1(q.path, "skills", F7z);
    if (Xd1(K)) return K;
    return null
}
// @from(Ln 419236, Col 0)
async function g7z() {
    return Q7z()
}
// @from(Ln 419240, Col 0)
function LN6(A) {
    let q = Jd1(A, "player.js");
    if (!Xd1(q)) return {
        success: !1,
        message: "Player script not found. The player.js file is missing from the thinkback skill."
    };
    let K = fL.get(process.stdout);
    if (!K) return {
        success: !1,
        message: "Failed to access terminal instance"
    };
    try {
        K.pause(), K.suspendStdin(), process.stdout.write("\x1B[?1049h\x1B[?1004l\x1B[0m\x1B[?25l\x1B[2J\x1B[H"), u7z("node", [q], {
            stdio: "inherit",
            cwd: A
        })
    } catch {} finally {
        process.stdout.write("\x1B[?1049l\x1B[?1004h\x1B[?25l"), K.resumeStdin(), K.resume()
    }
    let Y = Jd1(A, "year_in_review.html");
    if (Xd1(Y)) {
        let z = eA();
        IA(z === "macos" ? "open" : z === "windows" ? "start" : "xdg-open", [Y])
    }
    return {
        success: !0,
        message: "Year in review animation complete!"
    }
}
// @from(Ln 419270, Col 0)
function U7z({
    onReady: A,
    onError: q
}) {
    let [K, Y] = Dy.useState({
        phase: "checking"
    }), [z, w] = Dy.useState("");
    if (Dy.useEffect(() => {
            async function $() {
                try {
                    let O = await n5(),
                        _ = Wzq(),
                        J = m7z(),
                        X = Gzq(),
                        D = _ in O,
                        j = BM(X);
                    if (!D) Y({
                        phase: "installing-marketplace"
                    }), h(`Installing marketplace ${J}`), await wE({
                        source: "github",
                        repo: J
                    }, (M) => {
                        w(M)
                    }), Uw(), h(`Marketplace ${_} installed`);
                    else if (!j) Y({
                        phase: "installing-marketplace"
                    }), w("Updating marketplace…"), h(`Refreshing marketplace ${_}`), await St(_, (M) => {
                        w(M)
                    }), AG1(), Uw(), h(`Marketplace ${_} refreshed`);
                    if (!j) {
                        Y({
                            phase: "installing-plugin"
                        }), h(`Installing plugin ${X}`);
                        let M = await LxA([X]);
                        if (M.failed.length > 0) {
                            let P = M.failed.map((W) => `${W.name}: ${W.error}`).join(", ");
                            throw Error(`Failed to install plugin: ${P}`)
                        }
                        Uw(), h(`Plugin ${X} installed`)
                    } else {
                        let {
                            disabled: M
                        } = await iY();
                        if (M.some((W) => W.name === "thinkback" || W.source?.includes(X))) {
                            Y({
                                phase: "enabling-plugin"
                            }), h(`Enabling plugin ${X}`);
                            let W = await x91(X);
                            if (!W.success) throw Error(`Failed to enable plugin: ${W.message}`);
                            Uw(), h(`Plugin ${X} enabled`)
                        }
                    }
                    Y({
                        phase: "ready"
                    }), A()
                } catch (O) {
                    let _ = O instanceof Error ? O : Error(String(O));
                    K1(_), Y({
                        phase: "error",
                        message: _.message
                    }), q(_.message)
                }
            }
            $()
        }, [A, q]), K.phase === "error") return O5.createElement(I, {
        flexDirection: "column"
    }, O5.createElement(V, {
        color: "error"
    }, "Error: ", K.message));
    if (K.phase === "ready") return null;
    let H = K.phase === "checking" ? "Checking thinkback installation…" : K.phase === "installing-marketplace" ? "Installing marketplace…" : K.phase === "enabling-plugin" ? "Enabling thinkback plugin…" : "Installing thinkback plugin…";
    return O5.createElement(I, {
        flexDirection: "column"
    }, O5.createElement(I, null, O5.createElement(c4, null), O5.createElement(V, null, z || H)))
}
// @from(Ln 419346, Col 0)
function p7z(A) {
    let q = e(21),
        {
            onDone: K,
            onAction: Y,
            skillDir: z
        } = A,
        [w, H] = Dy.useState(!1),
        $;
    if (q[0] !== z) {
        let Z = Jd1(z, "year_in_review.js");
        $ = Xd1(Z), q[0] = z, q[1] = $
    } else $ = q[1];
    let O = $,
        _;
    if (q[2] !== O) _ = O ? [{
        label: "Play animation",
        value: "play",
        description: "Watch your year in review"
    }, {
        label: "Edit content",
        value: "edit",
        description: "Modify the animation"
    }, {
        label: "Fix errors",
        value: "fix",
        description: "Fix validation or rendering issues"
    }, {
        label: "Regenerate",
        value: "regenerate",
        description: "Create a new animation from scratch"
    }] : [{
        label: "Let's go!",
        value: "regenerate",
        description: "Generate your personalized animation"
    }], q[2] = O, q[3] = _;
    else _ = q[3];
    let J = _,
        X;
    if (q[4] !== Y || q[5] !== K || q[6] !== z) X = function(N) {
        if (H(!0), N === "play") LN6(z), K(void 0, {
            display: "skip"
        });
        else Y(N)
    }, q[4] = Y, q[5] = K, q[6] = z, q[7] = X;
    else X = q[7];
    let D = X,
        j;
    if (q[8] !== K) j = function() {
        K(void 0, {
            display: "skip"
        })
    }, q[8] = K, q[9] = j;
    else j = q[9];
    let M = j;
    if (w) return null;
    let P;
    if (q[10] !== O) P = !O && O5.createElement(I, {
        flexDirection: "column"
    }, O5.createElement(V, null, "Relive your year of coding with Claude."), O5.createElement(V, {
        dimColor: !0
    }, "We'll create a personalized ASCII animation celebrating your journey.")), q[10] = O, q[11] = P;
    else P = q[11];
    let W;
    if (q[12] !== D || q[13] !== J) W = O5.createElement(kA, {
        options: J,
        onChange: D,
        visibleOptionCount: 5
    }), q[12] = D, q[13] = J, q[14] = W;
    else W = q[14];
    let G;
    if (q[15] !== P || q[16] !== W) G = O5.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, P, W), q[15] = P, q[16] = W, q[17] = G;
    else G = q[17];
    let f;
    if (q[18] !== M || q[19] !== G) f = O5.createElement(w8, {
        title: "Think Back on 2025 with Claude Code",
        subtitle: "Generate your 2025 Claude Code Think Back (takes a few minutes to run)",
        onCancel: M,
        color: "claude",
        borderDimColor: !1
    }, G), q[18] = M, q[19] = G, q[20] = f;
    else f = q[20];
    return f
}
// @from(Ln 419434, Col 0)
function i7z(A) {
    let q = e(26),
        {
            onDone: K
        } = A,
        [Y, z] = Dy.useState(!1),
        [w, H] = Dy.useState(null),
        [$, O] = Dy.useState(null),
        [_, J] = Dy.useState(null),
        X;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) X = function() {
        z(!0)
    }, q[0] = X;
    else X = q[0];
    let D = X,
        j;
    if (q[1] !== K) j = (k) => {
        H(k), K(`Error with thinkback: ${k}. Try running /plugin to manually install the think-back plugin.`, {
            display: "system"
        })
    }, q[1] = K, q[2] = j;
    else j = q[2];
    let M = j,
        P, W;
    if (q[3] !== M || q[4] !== Y || q[5] !== w || q[6] !== $) P = () => {
        if (Y && !$ && !w) g7z().then((k) => {
            if (k) h(`Thinkback skill directory: ${k}`), O(k);
            else M("Could not find thinkback skill directory")
        })
    }, W = [Y, $, w, M], q[3] = M, q[4] = Y, q[5] = w, q[6] = $, q[7] = P, q[8] = W;
    else P = q[7], W = q[8];
    Dy.useEffect(P, W);
    let G, f;
    if (q[9] !== $) G = () => {
        if (!$) return;
        let k = Jd1($, "year_in_review.js"),
            y = Xd1(k);
        h(`Checking for ${k}: ${y?"found":"not found"}`), J(y)
    }, f = [$], q[9] = $, q[10] = G, q[11] = f;
    else G = q[10], f = q[11];
    Dy.useEffect(G, f);
    let Z;
    if (q[12] !== K) Z = function(y) {
        K({
            edit: d7z,
            fix: c7z,
            regenerate: l7z
        } [y], {
            display: "user",
            shouldQuery: !0
        })
    }, q[12] = K, q[13] = Z;
    else Z = q[13];
    let N = Z;
    if (w) {
        let k;
        if (q[14] !== w) k = O5.createElement(V, {
            color: "error"
        }, "Error: ", w), q[14] = w, q[15] = k;
        else k = q[15];
        let y;
        if (q[16] === Symbol.for("react.memo_cache_sentinel")) y = O5.createElement(V, {
            dimColor: !0
        }, "Try running /plugin to manually install the think-back plugin."), q[16] = y;
        else y = q[16];
        let B;
        if (q[17] !== k) B = O5.createElement(I, {
            flexDirection: "column"
        }, k, y), q[17] = k, q[18] = B;
        else B = q[18];
        return B
    }
    if (!Y) {
        let k;
        if (q[19] !== M) k = O5.createElement(U7z, {
            onReady: D,
            onError: M
        }), q[19] = M, q[20] = k;
        else k = q[20];
        return k
    }
    if (!$ || _ === null) {
        let k;
        if (q[21] === Symbol.for("react.memo_cache_sentinel")) k = O5.createElement(I, null, O5.createElement(c4, null), O5.createElement(V, null, "Loading thinkback skill…")), q[21] = k;
        else k = q[21];
        return k
    }
    let T;
    if (q[22] !== N || q[23] !== K || q[24] !== $) T = O5.createElement(p7z, {
        onDone: K,
        onAction: N,
        skillDir: $
    }), q[22] = N, q[23] = K, q[24] = $, q[25] = T;
    else T = q[25];
    return T
}
// @from(Ln 419530, Col 0)
async function n7z(A) {
    return O5.createElement(i7z, {
        onDone: A
    })
}
// @from(Ln 419535, Col 4)
O5
// @from(Ln 419535, Col 8)
Dy
// @from(Ln 419535, Col 12)
B7z = "anthropics/claude-plugins-official"
// @from(Ln 419536, Col 4)
F7z = "thinkback"
// @from(Ln 419537, Col 4)
d7z = 'Use the Skill tool to invoke the "thinkback" skill with mode=edit to modify my existing Claude Code year in review animation. Ask me what I want to change. When the animation is ready, tell the user to run /think-back again to play it.'
// @from(Ln 419538, Col 4)
c7z = 'Use the Skill tool to invoke the "thinkback" skill with mode=fix to fix validation or rendering errors in my existing Claude Code year in review animation. Run the validator, identify errors, and fix them. When the animation is ready, tell the user to run /think-back again to play it.'
// @from(Ln 419539, Col 4)
l7z = 'Use the Skill tool to invoke the "thinkback" skill with mode=regenerate to create a completely new Claude Code year in review animation from scratch. Delete the existing animation and start fresh. When the animation is ready, tell the user to run /think-back again to play it.'
// @from(Ln 419540, Col 4)
fuA = v(() => {
    i1();
    m1();
    Bq();
    DJ1();
    x3();
    tq();
    U5();
    p$();
    mM();
    vZ1();
    VJ();
    kZ1();
    tR();
    x2();
    Z6();
    y6();
    kN6();
    O5 = o(X1(), 1), Dy = o(X1(), 1)
})
// @from(Ln 419560, Col 4)
r7z
// @from(Ln 419560, Col 9)
fzq
// @from(Ln 419561, Col 4)
Vzq = v(() => {
    U4();
    r7z = {
        type: "local-jsx",
        name: "think-back",
        description: "Your 2025 Claude Code Year in Review",
        isEnabled: () => i2("tengu_thinkback"),
        isHidden: !1,
        load: () => Promise.resolve().then(() => (fuA(), Zzq)),
        userFacingName() {
            return "think-back"
        }
    }, fzq = r7z
})
// @from(Ln 419575, Col 4)
Tzq = {}
// @from(Ln 419586, Col 0)
function s7z() {
    return `thinkback@${d91}`
}
// @from(Ln 419589, Col 0)
async function t7z() {
    let A = uM(),
        q = s7z(),
        K = A.plugins[q];
    if (!K || K.length === 0) return {
        type: "text",
        value: "Thinkback plugin not installed. Run /think-back first to install it."
    };
    let Y = K[0];
    if (!Y?.installPath) return {
        type: "text",
        value: "Thinkback plugin installation path not found."
    };
    let z = Nzq(Y.installPath, "skills", a7z),
        w = Nzq(z, "year_in_review.js");
    if (!o7z(w)) return {
        type: "text",
        value: "No animation found. Run /think-back first to generate one."
    };
    return {
        type: "text",
        value: LN6(z).message
    }
}
// @from(Ln 419613, Col 4)
a7z = "thinkback"
// @from(Ln 419614, Col 4)
vzq = v(() => {
    fuA();
    mM();
    kN6()
})
// @from(Ln 419619, Col 4)
e7z
// @from(Ln 419619, Col 9)
Ezq
// @from(Ln 419620, Col 4)
kzq = v(() => {
    U4();
    e7z = {
        type: "local",
        name: "thinkback-play",
        description: "Play the thinkback animation",
        isEnabled: () => i2("tengu_thinkback"),
        isHidden: !0,
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (vzq(), Tzq)),
        userFacingName() {
            return "thinkback-play"
        }
    }, Ezq = e7z
})
// @from(Ln 419636, Col 0)
function Lzq(A) {
    let q = e(24),
        {
            onCancel: K,
            onSubmit: Y,
            ruleBehavior: z
        } = A,
        [w, H] = VuA.useState(""),
        [$, O] = VuA.useState(0),
        _ = uq(),
        J;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Settings"
    }, q[0] = J;
    else J = q[0];
    DA("confirm:no", K, J);
    let {
        columns: X
    } = Z8(), D = X - 6, j;
    if (q[1] !== Y || q[2] !== z) j = (B) => {
        let S = B.trim();
        if (S.length === 0) return;
        let m = lP(S);
        Y(m, z)
    }, q[1] = Y, q[2] = z, q[3] = j;
    else j = q[3];
    let M = j,
        P;
    if (q[4] !== z) P = Pz.createElement(V, {
        bold: !0,
        color: "permission"
    }, "Add ", z, " permission rule"), q[4] = z, q[5] = P;
    else P = q[5];
    let W;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) W = Pz.createElement(LX, null), q[6] = W;
    else W = q[6];
    let G, f;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) G = Pz.createElement(V, {
        bold: !0
    }, M9({
        toolName: Vj.name
    })), f = Pz.createElement(V, {
        bold: !1
    }, " or "), q[7] = G, q[8] = f;
    else G = q[7], f = q[8];
    let Z;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) Z = Pz.createElement(V, null, "Permission rules are a tool name, optionally followed by a specifier in parentheses.", W, "e.g.,", " ", G, f, Pz.createElement(V, {
        bold: !0
    }, M9({
        toolName: qq.name,
        ruleContent: "ls:*"
    }))), q[9] = Z;
    else Z = q[9];
    let N;
    if (q[10] !== $ || q[11] !== M || q[12] !== w || q[13] !== D) N = Pz.createElement(I, {
        flexDirection: "column"
    }, Z, Pz.createElement(I, {
        borderDimColor: !0,
        borderStyle: "round",
        marginY: 1,
        paddingLeft: 1
    }, Pz.createElement(k3, {
        showCursor: !0,
        value: w,
        onChange: H,
        onSubmit: M,
        placeholder: `Enter permission rule${l1.ellipsis}`,
        columns: D,
        cursorOffset: $,
        onChangeCursorOffset: O
    }))), q[10] = $, q[11] = M, q[12] = w, q[13] = D, q[14] = N;
    else N = q[14];
    let T;
    if (q[15] !== P || q[16] !== N) T = Pz.createElement(I, {
        flexDirection: "column",
        gap: 1,
        borderStyle: "round",
        paddingLeft: 1,
        paddingRight: 1,
        borderColor: "permission"
    }, P, N), q[15] = P, q[16] = N, q[17] = T;
    else T = q[17];
    let k;
    if (q[18] !== _.keyName || q[19] !== _.pending) k = Pz.createElement(I, {
        marginLeft: 3
    }, _.pending ? Pz.createElement(V, {
        dimColor: !0
    }, "Press ", _.keyName, " again to exit") : Pz.createElement(V, {
        dimColor: !0
    }, "Enter to submit · Esc to cancel")), q[18] = _.keyName, q[19] = _.pending, q[20] = k;
    else k = q[20];
    let y;
    if (q[21] !== k || q[22] !== T) y = Pz.createElement(Pz.Fragment, null, T, k), q[21] = k, q[22] = T, q[23] = y;
    else y = q[23];
    return y
}
// @from(Ln 419732, Col 4)
Pz
// @from(Ln 419732, Col 8)
VuA
// @from(Ln 419733, Col 4)
Rzq = v(() => {
    i1();
    m1();
    K7();
    R2();
    mq();
    gW1();
    i0();
    gO();
    b7();
    Pz = o(X1(), 1), VuA = o(X1(), 1)
})
// @from(Ln 419746, Col 0)
function yzq(A) {
    let q = e(19),
        {
            onExit: K,
            getToolPermissionContext: Y,
            onRequestAddDirectory: z,
            onRequestRemoveDirectory: w
        } = A,
        H;
    if (q[0] !== Y) H = Y(), q[0] = Y, q[1] = H;
    else H = q[1];
    let $ = H,
        O;
    if (q[2] !== $.additionalWorkingDirectories) O = Array.from($.additionalWorkingDirectories.keys()).map(q4z), q[2] = $.additionalWorkingDirectories, q[3] = O;
    else O = q[3];
    let _ = O,
        J;
    if (q[4] !== _ || q[5] !== z || q[6] !== w) J = (f) => {
        if (f === "add-directory") {
            z();
            return
        }
        let Z = _.find((N) => N.path === f);
        if (Z && Z.isDeletable) w(Z.path)
    }, q[4] = _, q[5] = z, q[6] = w, q[7] = J;
    else J = q[7];
    let X = J,
        D;
    if (q[8] !== _) {
        D = _.map(A4z);
        let f;
        if (q[10] === Symbol.for("react.memo_cache_sentinel")) f = {
            label: `Add directory${l1.ellipsis}`,
            value: "add-directory"
        }, q[10] = f;
        else f = q[10];
        D.push(f), q[8] = _, q[9] = D
    } else D = q[9];
    let j = D,
        M;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) M = dI.createElement(I, {
        flexDirection: "row",
        marginTop: 1,
        marginLeft: 2,
        gap: 1
    }, dI.createElement(V, null, `-  ${y8()}`), dI.createElement(V, {
        dimColor: !0
    }, "(Original working directory)")), q[11] = M;
    else M = q[11];
    let P;
    if (q[12] !== K) P = () => K("Workspace dialog dismissed", {
        display: "system"
    }), q[12] = K, q[13] = P;
    else P = q[13];
    let W = Math.min(10, j.length),
        G;
    if (q[14] !== X || q[15] !== j || q[16] !== P || q[17] !== W) G = dI.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, M, dI.createElement(kA, {
        options: j,
        onChange: X,
        onCancel: P,
        visibleOptionCount: W
    })), q[14] = X, q[15] = j, q[16] = P, q[17] = W, q[18] = G;
    else G = q[18];
    return G
}
// @from(Ln 419815, Col 0)
function A4z(A) {
    return {
        label: A.path,
        value: A.path
    }
}
// @from(Ln 419822, Col 0)
function q4z(A) {
    return {
        path: A,
        isCurrent: !1,
        isDeletable: !0
    }
}
// @from(Ln 419829, Col 4)
dI
// @from(Ln 419830, Col 4)
Czq = v(() => {
    i1();
    m1();
    U5();
    b7();
    B6();
    dI = o(X1(), 1)
})
// @from(Ln 419839, Col 0)
function Szq(A) {
    let q = e(26),
        {
            directoryPath: K,
            onRemove: Y,
            onCancel: z,
            permissionContext: w,
            setPermissionContext: H
        } = A,
        $ = uq(),
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = {
        context: "Confirmation"
    }, q[0] = O;
    else O = q[0];
    DA("confirm:no", z, O);
    let _;
    if (q[1] !== K || q[2] !== Y || q[3] !== w || q[4] !== H) _ = () => {
        let T = a2(w, {
            type: "removeDirectories",
            directories: [K],
            destination: "session"
        });
        H(T), Y()
    }, q[1] = K, q[2] = Y, q[3] = w, q[4] = H, q[5] = _;
    else _ = q[5];
    let J = _,
        X;
    if (q[6] !== J || q[7] !== z) X = (T) => {
        if (T === "yes") J();
        else z()
    }, q[6] = J, q[7] = z, q[8] = X;
    else X = q[8];
    let D = X,
        j;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) j = yH.createElement(V, {
        bold: !0,
        color: "error"
    }, "Remove directory from workspace?"), q[9] = j;
    else j = q[9];
    let M;
    if (q[10] !== K) M = yH.createElement(I, {
        marginY: 1,
        marginX: 2,
        flexDirection: "column"
    }, yH.createElement(V, {
        bold: !0
    }, K)), q[10] = K, q[11] = M;
    else M = q[11];
    let P;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) P = yH.createElement(V, null, "Claude Code will no longer have access to files in this directory."), q[12] = P;
    else P = q[12];
    let W;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) W = [{
        label: "Yes",
        value: "yes"
    }, {
        label: "No",
        value: "no"
    }], q[13] = W;
    else W = q[13];
    let G;
    if (q[14] !== D || q[15] !== z) G = yH.createElement(I, {
        marginY: 1
    }, yH.createElement(kA, {
        onChange: D,
        onCancel: z,
        options: W
    })), q[14] = D, q[15] = z, q[16] = G;
    else G = q[16];
    let f;
    if (q[17] !== M || q[18] !== G) f = yH.createElement(I, {
        flexDirection: "column",
        borderStyle: "round",
        paddingLeft: 1,
        paddingRight: 1,
        borderColor: "error"
    }, j, M, P, G), q[17] = M, q[18] = G, q[19] = f;
    else f = q[19];
    let Z;
    if (q[20] !== $.keyName || q[21] !== $.pending) Z = yH.createElement(I, {
        marginLeft: 3
    }, $.pending ? yH.createElement(V, {
        dimColor: !0
    }, "Press ", $.keyName, " again to exit") : yH.createElement(V, {
        dimColor: !0
    }, "↑/↓ to select · Enter to confirm · Esc to cancel")), q[20] = $.keyName, q[21] = $.pending, q[22] = Z;
    else Z = q[22];
    let N;
    if (q[23] !== Z || q[24] !== f) N = yH.createElement(yH.Fragment, null, f, Z), q[23] = Z, q[24] = f, q[25] = N;
    else N = q[25];
    return N
}
// @from(Ln 419932, Col 4)
yH
// @from(Ln 419933, Col 4)
hzq = v(() => {
    i1();
    m1();
    R2();
    K7();
    U5();
    CO();
    yH = o(X1(), 1)
})
// @from(Ln 419943, Col 0)
function K4z(A) {
    let q = e(4),
        {
            rule: K
        } = A,
        Y;
    if (q[0] !== K.source) Y = Sx1(K.source), q[0] = K.source, q[1] = Y;
    else Y = q[1];
    let z = `From ${Y}`,
        w;
    if (q[2] !== z) w = B8.createElement(V, {
        dimColor: !0
    }, z), q[2] = z, q[3] = w;
    else w = q[3];
    return w
}
// @from(Ln 419960, Col 0)
function Y4z(A) {
    switch (A) {
        case "allow":
            return "allowed";
        case "deny":
            return "denied";
        case "ask":
            return "ask"
    }
}
// @from(Ln 419971, Col 0)
function z4z(A) {
    let q = e(42),
        {
            rule: K,
            onDelete: Y,
            onCancel: z
        } = A,
        w = uq(),
        H;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) H = {
        context: "Confirmation"
    }, q[0] = H;
    else H = q[0];
    DA("confirm:no", z, H);
    let $;
    if (q[1] !== K.ruleValue) $ = M9(K.ruleValue), q[1] = K.ruleValue, q[2] = $;
    else $ = q[2];
    let O;
    if (q[3] !== $) O = B8.createElement(V, {
        bold: !0
    }, $), q[3] = $, q[4] = O;
    else O = q[4];
    let _;
    if (q[5] !== K.ruleValue) _ = B8.createElement(Jw6, {
        ruleValue: K.ruleValue
    }), q[5] = K.ruleValue, q[6] = _;
    else _ = q[6];
    let J;
    if (q[7] !== K) J = B8.createElement(K4z, {
        rule: K
    }), q[7] = K, q[8] = J;
    else J = q[8];
    let X;
    if (q[9] !== O || q[10] !== _ || q[11] !== J) X = B8.createElement(I, {
        flexDirection: "column",
        marginX: 2
    }, O, _, J), q[9] = O, q[10] = _, q[11] = J, q[12] = X;
    else X = q[12];
    let D = X,
        j;
    if (q[13] !== w.keyName || q[14] !== w.pending) j = B8.createElement(I, {
        marginLeft: 3
    }, w.pending ? B8.createElement(V, {
        dimColor: !0
    }, "Press ", w.keyName, " again to exit") : B8.createElement(V, {
        dimColor: !0
    }, "Esc to cancel")), q[13] = w.keyName, q[14] = w.pending, q[15] = j;
    else j = q[15];
    let M = j;
    if (K.source === "policySettings") {
        let y;
        if (q[16] === Symbol.for("react.memo_cache_sentinel")) y = B8.createElement(V, {
            bold: !0,
            color: "permission"
        }, "Rule details"), q[16] = y;
        else y = q[16];
        let B;
        if (q[17] === Symbol.for("react.memo_cache_sentinel")) B = B8.createElement(V, {
            italic: !0
        }, "This rule is configured by managed settings and cannot be modified.", `
`, "Contact your system administrator for more information."), q[17] = B;
        else B = q[17];
        let S;
        if (q[18] !== D) S = B8.createElement(I, {
            flexDirection: "column",
            gap: 1,
            borderStyle: "round",
            paddingLeft: 1,
            paddingRight: 1,
            borderColor: "permission"
        }, y, D, B), q[18] = D, q[19] = S;
        else S = q[19];
        let m;
        if (q[20] !== M || q[21] !== S) m = B8.createElement(B8.Fragment, null, S, M), q[20] = M, q[21] = S, q[22] = m;
        else m = q[22];
        return m
    }
    let P;
    if (q[23] !== K.ruleBehavior) P = Y4z(K.ruleBehavior), q[23] = K.ruleBehavior, q[24] = P;
    else P = q[24];
    let W;
    if (q[25] !== P) W = B8.createElement(V, {
        bold: !0,
        color: "error"
    }, "Delete ", P, " tool?"), q[25] = P, q[26] = W;
    else W = q[26];
    let G;
    if (q[27] === Symbol.for("react.memo_cache_sentinel")) G = B8.createElement(V, null, "Are you sure you want to delete this permission rule?"), q[27] = G;
    else G = q[27];
    let f;
    if (q[28] !== z || q[29] !== Y) f = (y) => y === "yes" ? Y() : z(), q[28] = z, q[29] = Y, q[30] = f;
    else f = q[30];
    let Z;
    if (q[31] === Symbol.for("react.memo_cache_sentinel")) Z = [{
        label: "Yes",
        value: "yes"
    }, {
        label: "No",
        value: "no"
    }], q[31] = Z;
    else Z = q[31];
    let N;
    if (q[32] !== z || q[33] !== f) N = B8.createElement(kA, {
        onChange: f,
        onCancel: z,
        options: Z
    }), q[32] = z, q[33] = f, q[34] = N;
    else N = q[34];
    let T;
    if (q[35] !== D || q[36] !== N || q[37] !== W) T = B8.createElement(I, {
        flexDirection: "column",
        gap: 1,
        borderStyle: "round",
        paddingLeft: 1,
        paddingRight: 1,
        borderColor: "error"
    }, W, D, G, N), q[35] = D, q[36] = N, q[37] = W, q[38] = T;
    else T = q[38];
    let k;
    if (q[39] !== M || q[40] !== T) k = B8.createElement(B8.Fragment, null, T, M), q[39] = M, q[40] = T, q[41] = k;
    else k = q[41];
    return k
}
// @from(Ln 420095, Col 0)
function w4z(A) {
    let q = e(17),
        {
            options: K,
            searchQuery: Y,
            isSearchMode: z,
            isFocused: w,
            onSelect: H,
            onCancel: $,
            lastFocusedRuleKey: O,
            onUpFromFirstItem: _,
            cursorOffset: J
        } = A,
        X = w8q(),
        D;
    if (q[0] !== J || q[1] !== w || q[2] !== z || q[3] !== Y || q[4] !== X) D = B8.createElement(I, {
        marginBottom: 1,
        flexDirection: "column"
    }, B8.createElement(AF, {
        query: Y,
        isFocused: z,
        isTerminalFocused: w,
        width: X,
        cursorOffset: J
    })), q[0] = J, q[1] = w, q[2] = z, q[3] = Y, q[4] = X, q[5] = D;
    else D = q[5];
    let j = Math.min(10, K.length),
        M;
    if (q[6] !== z || q[7] !== O || q[8] !== $ || q[9] !== H || q[10] !== _ || q[11] !== K || q[12] !== j) M = B8.createElement(kA, {
        options: K,
        onChange: H,
        onCancel: $,
        visibleOptionCount: j,
        isDisabled: z,
        defaultFocusValue: O,
        onUpFromFirstItem: _
    }), q[6] = z, q[7] = O, q[8] = $, q[9] = H, q[10] = _, q[11] = K, q[12] = j, q[13] = M;
    else M = q[13];
    let P;
    if (q[14] !== D || q[15] !== M) P = B8.createElement(I, {
        flexDirection: "column"
    }, D, M), q[14] = D, q[15] = M, q[16] = P;
    else P = q[16];
    return P
}