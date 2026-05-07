
// @from(Ln 474505, Col 0)
function AnK(q) {
    let K = s(4),
        {
            shell: _
        } = q;
    switch (_.status) {
        case "completed": {
            let z;
            if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = Hu6.default.createElement(A66, {
                status: "completed",
                label: "done"
            }), K[0] = z;
            else z = K[0];
            return z
        }
        case "failed": {
            let z;
            if (K[1] === Symbol.for("react.memo_cache_sentinel")) z = Hu6.default.createElement(A66, {
                status: "failed",
                label: "error"
            }), K[1] = z;
            else z = K[1];
            return z
        }
        case "killed": {
            let z;
            if (K[2] === Symbol.for("react.memo_cache_sentinel")) z = Hu6.default.createElement(A66, {
                status: "killed",
                label: "stopped"
            }), K[2] = z;
            else z = K[2];
            return z
        }
        case "running":
        case "pending": {
            let z;
            if (K[3] === Symbol.for("react.memo_cache_sentinel")) z = Hu6.default.createElement(A66, {
                status: "running"
            }), K[3] = z;
            else z = K[3];
            return z
        }
    }
}
// @from(Ln 474549, Col 4)
Hu6
// @from(Ln 474550, Col 4)
OnK = L(() => {
    o6();
    g6();
    Hu6 = K6(P6(), 1)
})
// @from(Ln 474556, Col 0)
function wnK(q) {
    let K = s(92),
        {
            task: _,
            maxActivityWidth: z
        } = q,
        Y = z ?? 40;
    switch (_.type) {
        case "local_bash": {
            let A = _.kind === "monitor" ? _.description : _.command,
                O;
            if (K[0] !== Y || K[1] !== A) O = w5(A, Y, !0), K[0] = Y, K[1] = A, K[2] = O;
            else O = K[2];
            let w;
            if (K[3] !== _) w = I_.createElement(AnK, {
                shell: _
            }), K[3] = _, K[4] = w;
            else w = K[4];
            let $;
            if (K[5] !== O || K[6] !== w) $ = I_.createElement(T, null, O, " ", w), K[5] = O, K[6] = w, K[7] = $;
            else $ = K[7];
            return $
        }
        case "remote_agent": {
            if (_.isRemoteReview) {
                let X;
                if (K[8] !== _) X = I_.createElement(T, null, I_.createElement(l_8, {
                    session: _
                })), K[8] = _, K[9] = X;
                else X = K[9];
                return X
            }
            let O = _.status === "running" || _.status === "pending" ? eH : dZ,
                w;
            if (K[10] !== O) w = I_.createElement(T, {
                dimColor: !0
            }, O, " "), K[10] = O, K[11] = w;
            else w = K[11];
            let $;
            if (K[12] !== Y || K[13] !== _.title) $ = w5(_.title, Y, !0), K[12] = Y, K[13] = _.title, K[14] = $;
            else $ = K[14];
            let j;
            if (K[15] === Symbol.for("react.memo_cache_sentinel")) j = I_.createElement(T, {
                dimColor: !0
            }, " · "), K[15] = j;
            else j = K[15];
            let H;
            if (K[16] !== _) H = I_.createElement(l_8, {
                session: _
            }), K[16] = _, K[17] = H;
            else H = K[17];
            let J;
            if (K[18] !== w || K[19] !== $ || K[20] !== H) J = I_.createElement(T, null, w, $, j, H), K[18] = w, K[19] = $, K[20] = H, K[21] = J;
            else J = K[21];
            return J
        }
        case "local_agent": {
            let A;
            if (K[22] !== Y || K[23] !== _.description) A = w5(_.description, Y, !0), K[22] = Y, K[23] = _.description, K[24] = A;
            else A = K[24];
            let O = _.status === "completed" ? "done" : void 0,
                w = _.status === "completed" && !_.notified ? ", unread" : void 0,
                $;
            if (K[25] !== O || K[26] !== w || K[27] !== _.status) $ = I_.createElement(A66, {
                status: _.status,
                label: O,
                suffix: w
            }), K[25] = O, K[26] = w, K[27] = _.status, K[28] = $;
            else $ = K[28];
            let j;
            if (K[29] !== A || K[30] !== $) j = I_.createElement(T, null, A, " ", $), K[29] = A, K[30] = $, K[31] = j;
            else j = K[31];
            return j
        }
        case "in_process_teammate": {
            let A, O, w, $, j, H;
            if (K[32] !== Y || K[33] !== _) {
                let M = $u6(_);
                O = T;
                let P;
                if (K[40] !== _.identity.color) P = KG(_.identity.color), K[40] = _.identity.color, K[41] = P;
                else P = K[41];
                if (K[42] !== P || K[43] !== _.identity.agentName) H = I_.createElement(T, {
                    color: P
                }, "@", _.identity.agentName), K[42] = P, K[43] = _.identity.agentName, K[44] = H;
                else H = K[44];
                A = T, w = !0, $ = ": ", j = w5(M, Y, !0), K[32] = Y, K[33] = _, K[34] = A, K[35] = O, K[36] = w, K[37] = $, K[38] = j, K[39] = H
            } else A = K[34], O = K[35], w = K[36], $ = K[37], j = K[38], H = K[39];
            let J;
            if (K[45] !== A || K[46] !== w || K[47] !== $ || K[48] !== j) J = I_.createElement(A, {
                dimColor: w
            }, $, j), K[45] = A, K[46] = w, K[47] = $, K[48] = j, K[49] = J;
            else J = K[49];
            let X;
            if (K[50] !== O || K[51] !== H || K[52] !== J) X = I_.createElement(O, null, H, J), K[50] = O, K[51] = H, K[52] = J, K[53] = X;
            else X = K[53];
            return X
        }
        case "local_workflow": {
            let A = _.workflowName ?? _.summary ?? _.description,
                O;
            if (K[54] !== Y || K[55] !== A) O = w5(A, Y, !0), K[54] = Y, K[55] = A, K[56] = O;
            else O = K[56];
            let w;
            if (K[57] !== _.agentCount || K[58] !== _.status) w = _.status === "running" ? `${_.agentCount} ${O7(_.agentCount,"agent")}` : _.status === "completed" ? "done" : void 0, K[57] = _.agentCount, K[58] = _.status, K[59] = w;
            else w = K[59];
            let $ = _.status === "completed" && !_.notified ? ", unread" : void 0,
                j;
            if (K[60] !== w || K[61] !== $ || K[62] !== _.status) j = I_.createElement(A66, {
                status: _.status,
                label: w,
                suffix: $
            }), K[60] = w, K[61] = $, K[62] = _.status, K[63] = j;
            else j = K[63];
            let H;
            if (K[64] !== O || K[65] !== j) H = I_.createElement(T, null, O, " ", j), K[64] = O, K[65] = j, K[66] = H;
            else H = K[66];
            return H
        }
        case "monitor_mcp": {
            let A;
            if (K[67] !== Y || K[68] !== _.description) A = w5(_.description, Y, !0), K[67] = Y, K[68] = _.description, K[69] = A;
            else A = K[69];
            let O = _.status === "completed" ? "done" : void 0,
                w = _.status === "completed" && !_.notified ? ", unread" : void 0,
                $;
            if (K[70] !== O || K[71] !== w || K[72] !== _.status) $ = I_.createElement(A66, {
                status: _.status,
                label: O,
                suffix: w
            }), K[70] = O, K[71] = w, K[72] = _.status, K[73] = $;
            else $ = K[73];
            let j;
            if (K[74] !== A || K[75] !== $) j = I_.createElement(T, null, A, " ", $), K[74] = A, K[75] = $, K[76] = j;
            else j = K[76];
            return j
        }
        case "dream": {
            let A = _.filesTouched.length,
                O;
            if (K[77] !== A || K[78] !== _.phase || K[79] !== _.sessionsReviewing) O = _.phase === "updating" && A > 0 ? `${A} ${O7(A,"file")}` : `${_.sessionsReviewing} ${O7(_.sessionsReviewing,"session")}`, K[77] = A, K[78] = _.phase, K[79] = _.sessionsReviewing, K[80] = O;
            else O = K[80];
            let w = O,
                $;
            if (K[81] !== w || K[82] !== _.phase) $ = I_.createElement(T, {
                dimColor: !0
            }, "· ", _.phase, " · ", w), K[81] = w, K[82] = _.phase, K[83] = $;
            else $ = K[83];
            let j = _.status === "completed" ? "done" : void 0,
                H = _.status === "completed" && !_.notified ? ", unread" : void 0,
                J;
            if (K[84] !== j || K[85] !== H || K[86] !== _.status) J = I_.createElement(A66, {
                status: _.status,
                label: j,
                suffix: H
            }), K[84] = j, K[85] = H, K[86] = _.status, K[87] = J;
            else J = K[87];
            let X;
            if (K[88] !== $ || K[89] !== J || K[90] !== _.description) X = I_.createElement(T, null, _.description, " ", $, " ", J), K[88] = $, K[89] = J, K[90] = _.description, K[91] = X;
            else X = K[91];
            return X
        }
    }
}
// @from(Ln 474720, Col 4)
I_
// @from(Ln 474721, Col 4)
$nK = L(() => {
    o6();
    g6();
    c7();
    pt();
    A3();
    I$7();
    OnK();
    Y66();
    I_ = K6(P6(), 1)
})
// @from(Ln 474733, Col 0)
function jnK(q) {
    let K = s(70),
        {
            task: _,
            onDone: z,
            onBack: Y,
            onKill: A
        } = q,
        O = RF(_.startTime, _.status === "running", 1000, 0),
        w;
    if (K[0] !== z) w = {
        "confirm:yes": z
    }, K[0] = z, K[1] = w;
    else w = K[1];
    let $;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) $ = {
        context: "Confirmation"
    }, K[2] = $;
    else $ = K[2];
    L7(w, $);
    let j;
    if (K[3] !== Y || K[4] !== z || K[5] !== A || K[6] !== _.status) j = (S) => {
        if (S.key === " ") S.preventDefault(), z();
        else if (S.key === "left" && Y) S.preventDefault(), Y();
        else if (S.key === "x" && !S.ctrl && !S.meta && _.status === "running" && A) S.preventDefault(), A()
    }, K[3] = Y, K[4] = z, K[5] = A, K[6] = _.status, K[7] = j;
    else j = K[7];
    let H = j,
        J, X, M, P, W, D, Z, G, f, v, V, k, N, R, h, C;
    if (K[8] !== O || K[9] !== H || K[10] !== Y || K[11] !== z || K[12] !== A || K[13] !== _.filesTouched.length || K[14] !== _.sessionsReviewing || K[15] !== _.status || K[16] !== _.turns) {
        let S = _.turns.filter(rdY),
            F = S.slice(-ndY),
            U = S.length - F.length;
        M = u, Z = "column", G = 0, f = !0, v = H, X = R1, h = "Memory consolidation";
        let g = _.sessionsReviewing,
            c;
        if (K[33] !== _.sessionsReviewing) c = O7(_.sessionsReviewing, "session"), K[33] = _.sessionsReviewing, K[34] = c;
        else c = K[34];
        let n;
        if (K[35] !== _.filesTouched.length) n = _.filesTouched.length > 0 && bH.default.createElement(bH.default.Fragment, null, " ", "· ", _.filesTouched.length, " ", O7(_.filesTouched.length, "file"), " touched"), K[35] = _.filesTouched.length, K[36] = n;
        else n = K[36];
        if (K[37] !== O || K[38] !== c || K[39] !== n || K[40] !== _.sessionsReviewing) C = bH.default.createElement(T, {
            dimColor: !0
        }, O, " · reviewing ", g, " ", c, n), K[37] = O, K[38] = c, K[39] = n, K[40] = _.sessionsReviewing, K[41] = C;
        else C = K[41];
        if (P = z, W = "background", K[42] !== Y || K[43] !== A || K[44] !== _.status) D = (z6) => z6.pending ? bH.default.createElement(T, null, "Press ", z6.keyName, " again to exit") : bH.default.createElement(z1, null, Y && bH.default.createElement(A8, {
            chord: "left",
            action: "go back"
        }), bH.default.createElement(A8, {
            chord: ["escape", "enter", "space"],
            action: "close"
        }), _.status === "running" && A && bH.default.createElement(A8, {
            chord: "x",
            action: "stop"
        })), K[42] = Y, K[43] = A, K[44] = _.status, K[45] = D;
        else D = K[45];
        J = u, V = "column", k = 1;
        let l;
        if (K[46] === Symbol.for("react.memo_cache_sentinel")) l = bH.default.createElement(T, {
            bold: !0
        }, "Status:"), K[46] = l;
        else l = K[46];
        if (K[47] !== _.status) N = bH.default.createElement(T, null, l, " ", _.status === "running" ? bH.default.createElement(T, {
            color: "background"
        }, "running") : _.status === "completed" ? bH.default.createElement(T, {
            color: "success"
        }, _.status) : bH.default.createElement(T, {
            color: "error"
        }, _.status)), K[47] = _.status, K[48] = N;
        else N = K[48];
        R = F.length === 0 ? bH.default.createElement(T, {
            dimColor: !0
        }, _.status === "running" ? "Starting…" : "(no text output)") : bH.default.createElement(bH.default.Fragment, null, U > 0 && bH.default.createElement(T, {
            dimColor: !0
        }, "(", U, " earlier ", O7(U, "turn"), ")"), F.map(idY)), K[8] = O, K[9] = H, K[10] = Y, K[11] = z, K[12] = A, K[13] = _.filesTouched.length, K[14] = _.sessionsReviewing, K[15] = _.status, K[16] = _.turns, K[17] = J, K[18] = X, K[19] = M, K[20] = P, K[21] = W, K[22] = D, K[23] = Z, K[24] = G, K[25] = f, K[26] = v, K[27] = V, K[28] = k, K[29] = N, K[30] = R, K[31] = h, K[32] = C
    } else J = K[17], X = K[18], M = K[19], P = K[20], W = K[21], D = K[22], Z = K[23], G = K[24], f = K[25], v = K[26], V = K[27], k = K[28], N = K[29], R = K[30], h = K[31], C = K[32];
    let x;
    if (K[49] !== J || K[50] !== V || K[51] !== k || K[52] !== N || K[53] !== R) x = bH.default.createElement(J, {
        flexDirection: V,
        gap: k
    }, N, R), K[49] = J, K[50] = V, K[51] = k, K[52] = N, K[53] = R, K[54] = x;
    else x = K[54];
    let B;
    if (K[55] !== X || K[56] !== P || K[57] !== W || K[58] !== D || K[59] !== x || K[60] !== h || K[61] !== C) B = bH.default.createElement(X, {
        title: h,
        subtitle: C,
        onCancel: P,
        color: W,
        inputGuide: D
    }, x), K[55] = X, K[56] = P, K[57] = W, K[58] = D, K[59] = x, K[60] = h, K[61] = C, K[62] = B;
    else B = K[62];
    let m;
    if (K[63] !== M || K[64] !== Z || K[65] !== G || K[66] !== f || K[67] !== v || K[68] !== B) m = bH.default.createElement(M, {
        flexDirection: Z,
        tabIndex: G,
        autoFocus: f,
        onKeyDown: v
    }, B), K[63] = M, K[64] = Z, K[65] = G, K[66] = f, K[67] = v, K[68] = B, K[69] = m;
    else m = K[69];
    return m
}
// @from(Ln 474835, Col 0)
function idY(q, K) {
    return bH.default.createElement(u, {
        key: K,
        flexDirection: "column"
    }, bH.default.createElement(T, {
        wrap: "wrap"
    }, q.text), q.toolUseCount > 0 && bH.default.createElement(T, {
        dimColor: !0
    }, "  ", "(", q.toolUseCount, " ", O7(q.toolUseCount, "tool"), ")"))
}
// @from(Ln 474846, Col 0)
function rdY(q) {
    return q.text !== ""
}
// @from(Ln 474849, Col 4)
bH
// @from(Ln 474849, Col 8)
ndY = 6
// @from(Ln 474850, Col 4)
HnK = L(() => {
    o6();
    NC6();
    g6();
    C7();
    Nq();
    S4();
    u7();
    bH = K6(P6(), 1)
})
// @from(Ln 474861, Col 0)
function JnK(q) {
    let K = s(63),
        {
            teammate: _,
            onDone: z,
            onKill: Y,
            onBack: A,
            onForeground: O
        } = q,
        [w] = Zq(),
        $;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) $ = YZ(MD()), K[0] = $;
    else $ = K[0];
    let j = $,
        H = RF(_.startTime, _.status === "running", 1000, _.totalPausedMs ?? 0),
        J;
    if (K[1] !== z) J = {
        "confirm:yes": z
    }, K[1] = z, K[2] = J;
    else J = K[2];
    let X;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) X = {
        context: "Confirmation"
    }, K[3] = X;
    else X = K[3];
    L7(J, X);
    let M;
    if (K[4] !== A || K[5] !== z || K[6] !== O || K[7] !== Y || K[8] !== _.status) M = (e) => {
        if (e.key === " ") e.preventDefault(), z();
        else if (e.key === "left" && A) e.preventDefault(), A();
        else if (e.key === "x" && !e.ctrl && !e.meta && _.status === "running" && Y) e.preventDefault(), Y();
        else if (e.key === "f" && !e.ctrl && !e.meta && _.status === "running" && O) e.preventDefault(), O()
    }, K[4] = A, K[5] = z, K[6] = O, K[7] = Y, K[8] = _.status, K[9] = M;
    else M = K[9];
    let P = M,
        W;
    if (K[10] !== _) W = $u6(_), K[10] = _, K[11] = W;
    else W = K[11];
    let D = W,
        Z = _.result?.totalTokens ?? _.progress?.tokenCount,
        G = _.result?.totalToolUseCount ?? _.progress?.toolUseCount,
        f;
    if (K[12] !== _.prompt) f = j4(_.prompt, 300), K[12] = _.prompt, K[13] = f;
    else f = K[13];
    let v = f,
        V;
    if (K[14] !== _.identity.color) V = KG(_.identity.color), K[14] = _.identity.color, K[15] = V;
    else V = K[15];
    let k;
    if (K[16] !== V || K[17] !== _.identity.agentName) k = T2.default.createElement(T, {
        color: V
    }, "@", _.identity.agentName), K[16] = V, K[17] = _.identity.agentName, K[18] = k;
    else k = K[18];
    let N;
    if (K[19] !== D) N = D && T2.default.createElement(T, {
        dimColor: !0
    }, " (", D, ")"), K[19] = D, K[20] = N;
    else N = K[20];
    let R;
    if (K[21] !== k || K[22] !== N) R = T2.default.createElement(T, null, k, N), K[21] = k, K[22] = N, K[23] = R;
    else R = K[23];
    let h = R,
        C;
    if (K[24] !== _.status) C = _.status !== "running" && T2.default.createElement(T, {
        color: _.status === "completed" ? "success" : _.status === "killed" ? "warning" : "error"
    }, _.status === "completed" ? "Completed" : _.status === "failed" ? "Failed" : "Stopped", " · "), K[24] = _.status, K[25] = C;
    else C = K[25];
    let x;
    if (K[26] !== Z) x = Z !== void 0 && Z > 0 && T2.default.createElement(T2.default.Fragment, null, " · ", iK(Z), " tokens"), K[26] = Z, K[27] = x;
    else x = K[27];
    let B;
    if (K[28] !== G) B = G !== void 0 && G > 0 && T2.default.createElement(T2.default.Fragment, null, " ", "· ", G, " ", G === 1 ? "tool" : "tools"), K[28] = G, K[29] = B;
    else B = K[29];
    let m;
    if (K[30] !== H || K[31] !== x || K[32] !== B) m = T2.default.createElement(T, {
        dimColor: !0
    }, H, x, B), K[30] = H, K[31] = x, K[32] = B, K[33] = m;
    else m = K[33];
    let S;
    if (K[34] !== C || K[35] !== m) S = T2.default.createElement(T, null, C, m), K[34] = C, K[35] = m, K[36] = S;
    else S = K[36];
    let F = S,
        U;
    if (K[37] !== A || K[38] !== O || K[39] !== Y || K[40] !== _.status) U = (e) => e.pending ? T2.default.createElement(T, null, "Press ", e.keyName, " again to exit") : T2.default.createElement(z1, null, A && T2.default.createElement(A8, {
        chord: "left",
        action: "go back"
    }), T2.default.createElement(A8, {
        chord: ["escape", "enter", "space"],
        action: "close"
    }), _.status === "running" && Y && T2.default.createElement(A8, {
        chord: "x",
        action: "stop"
    }), _.status === "running" && O && T2.default.createElement(A8, {
        chord: "f",
        action: "foreground"
    })), K[37] = A, K[38] = O, K[39] = Y, K[40] = _.status, K[41] = U;
    else U = K[41];
    let g;
    if (K[42] !== _.progress || K[43] !== _.status || K[44] !== w) g = _.status === "running" && _.progress?.recentActivities && _.progress.recentActivities.length > 0 && T2.default.createElement(u, {
        flexDirection: "column"
    }, T2.default.createElement(T, {
        bold: !0,
        dimColor: !0
    }, "Progress"), _.progress.recentActivities.map((e, i) => T2.default.createElement(T, {
        key: i,
        dimColor: i < _.progress.recentActivities.length - 1,
        wrap: "truncate-end"
    }, i === _.progress.recentActivities.length - 1 ? "› " : "  ", nr8(e, j, w)))), K[42] = _.progress, K[43] = _.status, K[44] = w, K[45] = g;
    else g = K[45];
    let c;
    if (K[46] === Symbol.for("react.memo_cache_sentinel")) c = T2.default.createElement(T, {
        bold: !0,
        dimColor: !0
    }, "Prompt"), K[46] = c;
    else c = K[46];
    let n;
    if (K[47] !== v) n = T2.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, c, T2.default.createElement(T, {
        wrap: "wrap"
    }, v)), K[47] = v, K[48] = n;
    else n = K[48];
    let l;
    if (K[49] !== _.error || K[50] !== _.status) l = _.status === "failed" && _.error && T2.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, T2.default.createElement(T, {
        bold: !0,
        color: "error"
    }, "Error"), T2.default.createElement(T, {
        color: "error",
        wrap: "wrap"
    }, _.error)), K[49] = _.error, K[50] = _.status, K[51] = l;
    else l = K[51];
    let z6;
    if (K[52] !== z || K[53] !== F || K[54] !== U || K[55] !== g || K[56] !== n || K[57] !== l || K[58] !== h) z6 = T2.default.createElement(R1, {
        title: h,
        subtitle: F,
        onCancel: z,
        color: "background",
        inputGuide: U
    }, g, n, l), K[52] = z, K[53] = F, K[54] = U, K[55] = g, K[56] = n, K[57] = l, K[58] = h, K[59] = z6;
    else z6 = K[59];
    let A6;
    if (K[60] !== P || K[61] !== z6) A6 = T2.default.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: P
    }, z6), K[60] = P, K[61] = z6, K[62] = A6;
    else A6 = K[62];
    return A6
}
// @from(Ln 475015, Col 4)
T2
// @from(Ln 475016, Col 4)
XnK = L(() => {
    o6();
    NC6();
    g6();
    C7();
    gq();
    $0();
    c7();
    pt();
    Nq();
    S4();
    u7();
    R$7();
    Y66();
    T2 = K6(P6(), 1)
})
// @from(Ln 475036, Col 0)
function ir8(q) {
    return q.flatMap((K) => {
        switch (K.type) {
            case "assistant":
                return [{
                    type: "assistant",
                    message: K.message,
                    uuid: K.uuid,
                    requestId: void 0,
                    timestamp: new Date().toISOString()
                }];
            case "user":
                return [{
                    type: "user",
                    message: K.message,
                    uuid: K.uuid ?? odY(),
                    timestamp: K.timestamp ?? new Date().toISOString(),
                    isMeta: K.isSynthetic
                }];
            case "system":
                if (K.subtype === "compact_boundary") return [{
                    type: "system",
                    content: "Conversation compacted",
                    level: "info",
                    subtype: "compact_boundary",
                    compactMetadata: x$7(K.compact_metadata),
                    uuid: K.uuid,
                    timestamp: new Date().toISOString()
                }];
                return [];
            default:
                return []
        }
    })
}
// @from(Ln 475072, Col 0)
function rr8(q) {
    let K = q.preservedSegment;
    return {
        trigger: q.trigger,
        pre_tokens: q.preTokens,
        ...q.postTokens !== void 0 && {
            post_tokens: q.postTokens
        },
        ...q.durationMs !== void 0 && {
            duration_ms: q.durationMs
        },
        ...K && {
            preserved_segment: {
                head_uuid: K.headUuid,
                anchor_uuid: K.anchorUuid,
                tail_uuid: K.tailUuid
            }
        }
    }
}
// @from(Ln 475093, Col 0)
function x$7(q) {
    let K = q.preserved_segment;
    return {
        trigger: q.trigger,
        preTokens: q.pre_tokens,
        ...q.post_tokens !== void 0 && {
            postTokens: q.post_tokens
        },
        ...q.duration_ms !== void 0 && {
            durationMs: q.duration_ms
        },
        ...K && {
            preservedSegment: {
                headUuid: K.head_uuid,
                anchorUuid: K.anchor_uuid,
                tailUuid: K.tail_uuid
            }
        }
    }
}
// @from(Ln 475114, Col 0)
function MnK(q) {
    return q.flatMap((K) => {
        switch (K.type) {
            case "assistant":
                return [{
                    type: "assistant",
                    message: adY(K),
                    session_id: I8(),
                    parent_tool_use_id: null,
                    uuid: K.uuid,
                    error: K.error
                }];
            case "user":
                return [{
                    type: "user",
                    message: K.message,
                    session_id: I8(),
                    parent_tool_use_id: null,
                    uuid: K.uuid,
                    timestamp: K.timestamp,
                    isSynthetic: K.isMeta || K.isVisibleInTranscriptOnly,
                    ...K.toolUseResult !== void 0 && {
                        tool_use_result: K.toolUseResult
                    },
                    ...K.origin !== void 0 && {
                        origin: K.origin
                    }
                }];
            case "system":
                if (K.subtype === "compact_boundary" && K.compactMetadata) return [{
                    type: "system",
                    subtype: "compact_boundary",
                    session_id: I8(),
                    uuid: K.uuid,
                    compact_metadata: rr8(K.compactMetadata)
                }];
                if (K.subtype === "local_command" && (K.content.includes(`<${l0}>`) || K.content.includes(`<${GA6}>`))) return [u$7(K.content, K.uuid)];
                return [];
            default:
                return []
        }
    })
}
// @from(Ln 475158, Col 0)
function u$7(q, K) {
    let _ = MO(q).replace(/<local-command-stdout>([\s\S]*?)<\/local-command-stdout>/, "$1").replace(/<local-command-stderr>([\s\S]*?)<\/local-command-stderr>/, "$1").trim();
    return {
        type: "assistant",
        message: yj({
            content: _
        }).message,
        parent_tool_use_id: null,
        session_id: I8(),
        uuid: K
    }
}
// @from(Ln 475171, Col 0)
function PnK(q) {
    if (!q) return;
    return {
        status: q.status,
        ...q.resetsAt !== void 0 && {
            resetsAt: q.resetsAt
        },
        ...q.rateLimitType !== void 0 && {
            rateLimitType: q.rateLimitType
        },
        ...q.utilization !== void 0 && {
            utilization: q.utilization
        },
        ...q.overageStatus !== void 0 && {
            overageStatus: q.overageStatus
        },
        ...q.overageResetsAt !== void 0 && {
            overageResetsAt: q.overageResetsAt
        },
        ...q.overageDisabledReason !== void 0 && {
            overageDisabledReason: q.overageDisabledReason
        },
        ...q.isUsingOverage !== void 0 && {
            isUsingOverage: q.isUsingOverage
        },
        ...q.surpassedThreshold !== void 0 && {
            surpassedThreshold: q.surpassedThreshold
        }
    }
}
// @from(Ln 475202, Col 0)
function adY(q) {
    let K = q.message.content;
    if (!Array.isArray(K)) return q.message;
    let _ = K.map((z) => {
        if (z.type !== "tool_use") return z;
        if (z.name === dP) {
            let Y = lP();
            if (Y) return {
                ...z,
                input: {
                    ...z.input,
                    plan: Y
                }
            }
        }
        return z
    });
    return {
        ...q.message,
        content: _
    }
}
// @from(Ln 475224, Col 4)
Ju6 = L(() => {
    y8();
    rA();
    mN();
    _7();
    NJ()
})
// @from(Ln 475232, Col 0)
function sdY(q, K) {
    if (q === dP) return "Review the plan in Claude Code on the web";
    if (!K || typeof K !== "object") return q;
    if (q === AO && "questions" in K) {
        let _ = K.questions;
        if (Array.isArray(_) && _[0] && typeof _[0] === "object") {
            let z = "question" in _[0] && typeof _[0].question === "string" && _[0].question ? _[0].question : ("header" in _[0]) && typeof _[0].header === "string" ? _[0].header : null;
            if (z) {
                let Y = z.replace(/\s+/g, " ").trim();
                return `Answer in browser: ${j4(Y,50)}`
            }
        }
    }
    for (let _ of Object.values(K))
        if (typeof _ === "string" && _.trim()) {
            let z = _.replace(/\s+/g, " ").trim();
            return `${q} ${j4(z,60)}`
        } return q
}
// @from(Ln 475252, Col 0)
function qcY(q) {
    let K = s(82),
        {
            session: _,
            onDone: z,
            onBack: Y,
            onKill: A
        } = q,
        O = _.status === "running" || _.status === "pending",
        w = _.ultraplanPhase,
        $ = O ? w ? tdY[w] : "running" : _.status,
        j = RF(_.startTime, O, 1000, 0, _.endTime),
        H = 0,
        J = 0,
        X = null;
    for (let r of _.log) {
        if (r.type !== "assistant") continue;
        for (let t of r.message.content) {
            if (t.type !== "tool_use") continue;
            if (J++, X = t, t.name === T4 || t.name === Gh) H++
        }
    }
    let M = 1 + H,
        P;
    if (K[0] !== X) P = X ? sdY(X.name, X.input) : null, K[0] = X, K[1] = P;
    else P = K[1];
    let W;
    if (K[2] !== J || K[3] !== M || K[4] !== P) W = {
        agentsWorking: M,
        toolCalls: J,
        lastToolCall: P
    }, K[2] = J, K[3] = M, K[4] = P, K[5] = W;
    else W = K[5];
    let {
        agentsWorking: D,
        toolCalls: Z,
        lastToolCall: G
    } = W, f;
    if (K[6] !== _.sessionId) f = BX6(_.sessionId), K[6] = _.sessionId, K[7] = f;
    else f = K[7];
    let v = f,
        V;
    if (K[8] !== Y || K[9] !== z) V = Y ?? (() => z("Remote session details dismissed", {
        display: "system"
    })), K[8] = Y, K[9] = z, K[10] = V;
    else V = K[10];
    let k = V,
        [N, R] = Cq.useState(!1);
    if (N) {
        let r;
        if (K[11] === Symbol.for("react.memo_cache_sentinel")) r = () => R(!1), K[11] = r;
        else r = K[11];
        let t;
        if (K[12] === Symbol.for("react.memo_cache_sentinel")) t = Cq.default.createElement(T, {
            dimColor: !0
        }, "This will terminate the Claude Code on the web session."), K[12] = t;
        else t = K[12];
        let Y6 = w === "plan_ready" ? "Terminate session and discard plan" : "Terminate session",
            X6;
        if (K[13] !== Y6) X6 = {
            label: Y6,
            value: "stop"
        }, K[13] = Y6, K[14] = X6;
        else X6 = K[14];
        let M6;
        if (K[15] === Symbol.for("react.memo_cache_sentinel")) M6 = {
            label: "Back",
            value: "back"
        }, K[15] = M6;
        else M6 = K[15];
        let W6;
        if (K[16] !== X6) W6 = [X6, M6], K[16] = X6, K[17] = W6;
        else W6 = K[17];
        let V6;
        if (K[18] !== k || K[19] !== A) V6 = (G6) => {
            if (G6 === "stop") A?.(), k();
            else R(!1)
        }, K[18] = k, K[19] = A, K[20] = V6;
        else V6 = K[20];
        let f6;
        if (K[21] !== W6 || K[22] !== V6) f6 = Cq.default.createElement(R1, {
            title: "Stop ultraplan?",
            onCancel: r,
            color: "background"
        }, Cq.default.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, t, Cq.default.createElement(A1, {
            options: W6,
            onChange: V6
        }))), K[21] = W6, K[22] = V6, K[23] = f6;
        else f6 = K[23];
        return f6
    }
    let h = w === "plan_ready" ? dZ : eH,
        C;
    if (K[24] !== h) C = Cq.default.createElement(T, {
        color: "background"
    }, h, " "), K[24] = h, K[25] = C;
    else C = K[25];
    let x;
    if (K[26] === Symbol.for("react.memo_cache_sentinel")) x = Cq.default.createElement(T, {
        bold: !0
    }, "ultraplan"), K[26] = x;
    else x = K[26];
    let B;
    if (K[27] !== j || K[28] !== $) B = Cq.default.createElement(T, {
        dimColor: !0
    }, " · ", j, " · ", $), K[27] = j, K[28] = $, K[29] = B;
    else B = K[29];
    let m;
    if (K[30] !== C || K[31] !== B) m = Cq.default.createElement(T, null, C, x, B), K[30] = C, K[31] = B, K[32] = m;
    else m = K[32];
    let S;
    if (K[33] !== w) S = w === "plan_ready" && Cq.default.createElement(T, {
        color: "success"
    }, e6.tick, " "), K[33] = w, K[34] = S;
    else S = K[34];
    let F;
    if (K[35] !== D) F = O7(D, "agent"), K[35] = D, K[36] = F;
    else F = K[36];
    let U = w ? edY[w] : "working",
        g;
    if (K[37] !== Z) g = O7(Z, "call"), K[37] = Z, K[38] = g;
    else g = K[38];
    let c;
    if (K[39] !== D || K[40] !== S || K[41] !== F || K[42] !== U || K[43] !== g || K[44] !== Z) c = Cq.default.createElement(T, null, S, D, " ", F, " ", U, " · ", Z, " tool", " ", g), K[39] = D, K[40] = S, K[41] = F, K[42] = U, K[43] = g, K[44] = Z, K[45] = c;
    else c = K[45];
    let n;
    if (K[46] !== G) n = G && Cq.default.createElement(T, {
        dimColor: !0
    }, G), K[46] = G, K[47] = n;
    else n = K[47];
    let l;
    if (K[48] !== v) l = Cq.default.createElement(T, {
        dimColor: !0
    }, v), K[48] = v, K[49] = l;
    else l = K[49];
    let z6;
    if (K[50] !== v || K[51] !== l) z6 = Cq.default.createElement(yq, {
        url: v
    }, l), K[50] = v, K[51] = l, K[52] = z6;
    else z6 = K[52];
    let A6 = w === "plan_ready" ? "Review in Claude Code on the web" : w === "needs_input" ? "Answer in Claude Code on the web" : "Open in Claude Code on the web",
        e;
    if (K[53] !== w) e = w === "plan_ready" && {
        description: "Approve, edit, or comment on the plan"
    }, K[53] = w, K[54] = e;
    else e = K[54];
    let i;
    if (K[55] !== A6 || K[56] !== e) i = {
        label: A6,
        value: "open",
        ...e
    }, K[55] = A6, K[56] = e, K[57] = i;
    else i = K[57];
    let O6;
    if (K[58] !== A || K[59] !== w || K[60] !== O) O6 = A && O ? [{
        label: "Stop ultraplan",
        value: "stop",
        ...w === "plan_ready" && {
            description: "Discard the generated plan"
        }
    }] : [], K[58] = A, K[59] = w, K[60] = O, K[61] = O6;
    else O6 = K[61];
    let J6;
    if (K[62] === Symbol.for("react.memo_cache_sentinel")) J6 = {
        label: "Back",
        value: "back"
    }, K[62] = J6;
    else J6 = K[62];
    let $6;
    if (K[63] !== i || K[64] !== O6) $6 = [i, ...O6, J6], K[63] = i, K[64] = O6, K[65] = $6;
    else $6 = K[65];
    let H6;
    if (K[66] !== k || K[67] !== z || K[68] !== v) H6 = (r) => {
        switch (r) {
            case "open": {
                J3(v), z();
                return
            }
            case "stop": {
                R(!0);
                return
            }
            case "back": {
                k();
                return
            }
        }
    }, K[66] = k, K[67] = z, K[68] = v, K[69] = H6;
    else H6 = K[69];
    let q6;
    if (K[70] !== $6 || K[71] !== H6) q6 = Cq.default.createElement(A1, {
        options: $6,
        onChange: H6
    }), K[70] = $6, K[71] = H6, K[72] = q6;
    else q6 = K[72];
    let o;
    if (K[73] !== c || K[74] !== n || K[75] !== z6 || K[76] !== q6) o = Cq.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, c, n, z6, q6), K[73] = c, K[74] = n, K[75] = z6, K[76] = q6, K[77] = o;
    else o = K[77];
    let _6;
    if (K[78] !== k || K[79] !== m || K[80] !== o) _6 = Cq.default.createElement(R1, {
        title: m,
        onCancel: k,
        color: "background"
    }, o), K[78] = k, K[79] = m, K[80] = o, K[81] = _6;
    else _6 = K[81];
    return _6
}
// @from(Ln 475466, Col 0)
function KcY(q) {
    let K = s(15),
        {
            stage: _,
            completed: z,
            hasProgress: Y
        } = q,
        A;
    if (K[0] !== _) A = _ ? WnK.indexOf(_) : -1, K[0] = _, K[1] = A;
    else A = K[1];
    let O = A,
        w = !z && !Y,
        $;
    if (K[2] !== w) $ = w ? Cq.default.createElement(T, {
        color: "background"
    }, "Setup") : Cq.default.createElement(T, {
        dimColor: !0
    }, "Setup"), K[2] = w, K[3] = $;
    else $ = K[3];
    let j;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) j = Cq.default.createElement(T, {
        dimColor: !0
    }, " → "), K[4] = j;
    else j = K[4];
    let H;
    if (K[5] !== z || K[6] !== O || K[7] !== w) H = WnK.map((M, P) => {
        let W = !z && !w && P === O;
        return Cq.default.createElement(Cq.default.Fragment, {
            key: M
        }, P > 0 && Cq.default.createElement(T, {
            dimColor: !0
        }, " → "), W ? Cq.default.createElement(T, {
            color: "background"
        }, DnK[M]) : Cq.default.createElement(T, {
            dimColor: !0
        }, DnK[M]))
    }), K[5] = z, K[6] = O, K[7] = w, K[8] = H;
    else H = K[8];
    let J;
    if (K[9] !== z) J = z && Cq.default.createElement(T, null, " ", Cq.default.createElement(D4, {
        status: "success"
    })), K[9] = z, K[10] = J;
    else J = K[10];
    let X;
    if (K[11] !== $ || K[12] !== H || K[13] !== J) X = Cq.default.createElement(T, null, $, j, H, J), K[11] = $, K[12] = H, K[13] = J, K[14] = X;
    else X = K[14];
    return X
}
// @from(Ln 475515, Col 0)
function _cY(q) {
    let K = q.reviewProgress;
    if (!K) return q.status === "completed" ? "done" : "setting up";
    let _ = K.bugsVerified,
        z = K.bugsRefuted ?? 0;
    if (q.status === "completed") {
        let Y = [`${_} ${O7(_,"finding")}`];
        if (z > 0) Y.push(`${z} refuted`);
        return Y.join(" · ")
    }
    return b$7(K.stage, K.bugsFound, _, z)
}
// @from(Ln 475528, Col 0)
function zcY(q) {
    let K = s(56),
        {
            session: _,
            onDone: z,
            onBack: Y,
            onKill: A
        } = q,
        O = _.status === "completed",
        w = _.status === "running" || _.status === "pending",
        [$, j] = Cq.useState(!1),
        H = RF(_.startTime, w, 1000, 0, _.endTime),
        J;
    if (K[0] !== z) J = () => z("Remote session details dismissed", {
        display: "system"
    }), K[0] = z, K[1] = J;
    else J = K[1];
    let X = J,
        M = Y ?? X,
        P;
    if (K[2] !== _.sessionId) P = BX6(_.sessionId), K[2] = _.sessionId, K[3] = P;
    else P = K[3];
    let W = P,
        D = O ? "ready" : w ? "running" : _.status;
    if ($) {
        let z6;
        if (K[4] === Symbol.for("react.memo_cache_sentinel")) z6 = () => j(!1), K[4] = z6;
        else z6 = K[4];
        let A6;
        if (K[5] === Symbol.for("react.memo_cache_sentinel")) A6 = Cq.default.createElement(T, {
            dimColor: !0
        }, "This archives the remote session and stops local tracking. The review will not complete and any findings so far are discarded."), K[5] = A6;
        else A6 = K[5];
        let e;
        if (K[6] === Symbol.for("react.memo_cache_sentinel")) e = {
            label: "Stop ultrareview",
            value: "stop"
        }, K[6] = e;
        else e = K[6];
        let i;
        if (K[7] === Symbol.for("react.memo_cache_sentinel")) i = [e, {
            label: "Back",
            value: "back"
        }], K[7] = i;
        else i = K[7];
        let O6;
        if (K[8] !== M || K[9] !== A) O6 = Cq.default.createElement(R1, {
            title: "Stop ultrareview?",
            onCancel: z6,
            color: "background"
        }, Cq.default.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, A6, Cq.default.createElement(A1, {
            options: i,
            onChange: (J6) => {
                if (J6 === "stop") A?.(), M();
                else j(!1)
            }
        }))), K[8] = M, K[9] = A, K[10] = O6;
        else O6 = K[10];
        return O6
    }
    let Z;
    if (K[11] !== O || K[12] !== A || K[13] !== w) Z = O ? [{
        label: "Open in Claude Code on the web",
        value: "open"
    }, {
        label: "Dismiss",
        value: "dismiss"
    }] : [{
        label: "Open in Claude Code on the web",
        value: "open"
    }, ...A && w ? [{
        label: "Stop ultrareview",
        value: "stop"
    }] : [], {
        label: "Back",
        value: "back"
    }], K[11] = O, K[12] = A, K[13] = w, K[14] = Z;
    else Z = K[14];
    let G = Z,
        f;
    if (K[15] !== M || K[16] !== X || K[17] !== z || K[18] !== W) f = (z6) => {
        q: switch (z6) {
            case "open": {
                J3(W), z();
                break q
            }
            case "stop": {
                j(!0);
                break q
            }
            case "back": {
                M();
                break q
            }
            case "dismiss":
                X()
        }
    }, K[15] = M, K[16] = X, K[17] = z, K[18] = W, K[19] = f;
    else f = K[19];
    let v = f,
        V = O ? dZ : eH,
        k;
    if (K[20] !== V) k = Cq.default.createElement(T, {
        color: "background"
    }, V, " "), K[20] = V, K[21] = k;
    else k = K[21];
    let N;
    if (K[22] === Symbol.for("react.memo_cache_sentinel")) N = Cq.default.createElement(T, {
        bold: !0
    }, "ultrareview"), K[22] = N;
    else N = K[22];
    let R;
    if (K[23] !== H || K[24] !== D) R = Cq.default.createElement(T, {
        dimColor: !0
    }, " · ", H, " · ", D), K[23] = H, K[24] = D, K[25] = R;
    else R = K[25];
    let h;
    if (K[26] !== k || K[27] !== R) h = Cq.default.createElement(T, null, k, N, R), K[26] = k, K[27] = R, K[28] = h;
    else h = K[28];
    let C = _.reviewProgress?.stage,
        x = !!_.reviewProgress,
        B;
    if (K[29] !== O || K[30] !== C || K[31] !== x) B = Cq.default.createElement(KcY, {
        stage: C,
        completed: O,
        hasProgress: x
    }), K[29] = O, K[30] = C, K[31] = x, K[32] = B;
    else B = K[32];
    let m;
    if (K[33] !== _) m = _cY(_), K[33] = _, K[34] = m;
    else m = K[34];
    let S;
    if (K[35] !== m) S = Cq.default.createElement(T, null, m), K[35] = m, K[36] = S;
    else S = K[36];
    let F;
    if (K[37] !== W) F = Cq.default.createElement(T, {
        dimColor: !0
    }, W), K[37] = W, K[38] = F;
    else F = K[38];
    let U;
    if (K[39] !== W || K[40] !== F) U = Cq.default.createElement(yq, {
        url: W
    }, F), K[39] = W, K[40] = F, K[41] = U;
    else U = K[41];
    let g;
    if (K[42] !== S || K[43] !== U) g = Cq.default.createElement(u, {
        flexDirection: "column"
    }, S, U), K[42] = S, K[43] = U, K[44] = g;
    else g = K[44];
    let c;
    if (K[45] !== v || K[46] !== G) c = Cq.default.createElement(A1, {
        options: G,
        onChange: v
    }), K[45] = v, K[46] = G, K[47] = c;
    else c = K[47];
    let n;
    if (K[48] !== B || K[49] !== g || K[50] !== c) n = Cq.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, B, g, c), K[48] = B, K[49] = g, K[50] = c, K[51] = n;
    else n = K[51];
    let l;
    if (K[52] !== M || K[53] !== n || K[54] !== h) l = Cq.default.createElement(R1, {
        title: h,
        onCancel: M,
        color: "background",
        inputGuide: YcY
    }, n), K[52] = M, K[53] = n, K[54] = h, K[55] = l;
    else l = K[55];
    return l
}
// @from(Ln 475703, Col 0)
function YcY(q) {
    return q.pending ? Cq.default.createElement(T, null, "Press ", q.keyName, " again to exit") : Cq.default.createElement(z1, null, Cq.default.createElement(A8, {
        chord: "enter",
        action: "select"
    }), Cq.default.createElement(A8, {
        chord: "escape",
        action: "go back"
    }))
}
// @from(Ln 475713, Col 0)
function ZnK({
    session: q,
    toolUseContext: K,
    onDone: _,
    onBack: z,
    onKill: Y
}) {
    let [A, O] = Cq.useState(!1), [w, $] = Cq.useState(null), j = Cq.useMemo(() => {
        if (q.isUltraplan || q.isRemoteReview) return [];
        return aP(ir8(q.log)).filter((W) => W.type !== "progress").slice(-3)
    }, [q]);
    if (q.isUltraplan) return Cq.default.createElement(qcY, {
        session: q,
        onDone: _,
        onBack: z,
        onKill: Y
    });
    if (q.isRemoteReview) return Cq.default.createElement(zcY, {
        session: q,
        onDone: _,
        onBack: z,
        onKill: Y
    });
    let H = () => _("Remote session details dismissed", {
            display: "system"
        }),
        J = (W) => {
            if (W.key === " ") W.preventDefault(), _("Remote session details dismissed", {
                display: "system"
            });
            else if (W.key === "left" && z) W.preventDefault(), z();
            else if (W.key === "t" && !W.ctrl && !W.meta && !A) W.preventDefault(), X();
            else if (W.key === "return") W.preventDefault(), H()
        };
    async function X() {
        O(!0), $(null);
        try {
            await uX6(q.sessionId)
        } catch (W) {
            $(b6(W))
        } finally {
            O(!1)
        }
    }
    let M = j4(q.title, 50),
        P = q.status === "pending" ? "starting" : q.status;
    return Cq.default.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: J
    }, Cq.default.createElement(R1, {
        title: "Remote session details",
        onCancel: H,
        color: "background",
        inputGuide: (W) => W.pending ? Cq.default.createElement(T, null, "Press ", W.keyName, " again to exit") : Cq.default.createElement(z1, null, z && Cq.default.createElement(A8, {
            chord: "left",
            action: "go back"
        }), Cq.default.createElement(A8, {
            chord: ["escape", "enter", "space"],
            action: "close"
        }), !A && Cq.default.createElement(A8, {
            chord: "t",
            action: "teleport"
        }))
    }, Cq.default.createElement(u, {
        flexDirection: "column"
    }, Cq.default.createElement(T, null, Cq.default.createElement(T, {
        bold: !0
    }, "Status"), ":", " ", P === "running" || P === "starting" ? Cq.default.createElement(T, {
        color: "background"
    }, P) : P === "completed" ? Cq.default.createElement(T, {
        color: "success"
    }, P) : Cq.default.createElement(T, {
        color: "error"
    }, P)), Cq.default.createElement(T, null, Cq.default.createElement(T, {
        bold: !0
    }, "Runtime"), ":", " ", C5((q.endTime ?? Date.now()) - q.startTime)), Cq.default.createElement(T, {
        wrap: "truncate-end"
    }, Cq.default.createElement(T, {
        bold: !0
    }, "Title"), ": ", M), Cq.default.createElement(T, null, Cq.default.createElement(T, {
        bold: !0
    }, "Progress"), ":", " ", Cq.default.createElement(l_8, {
        session: q
    })), Cq.default.createElement(T, null, Cq.default.createElement(T, {
        bold: !0
    }, "Session URL"), ":", " ", Cq.default.createElement(yq, {
        url: BX6(q.sessionId)
    }, Cq.default.createElement(T, {
        dimColor: !0
    }, BX6(q.sessionId))))), q.log.length > 0 && Cq.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, Cq.default.createElement(T, null, Cq.default.createElement(T, {
        bold: !0
    }, "Recent messages"), ":"), Cq.default.createElement(u, {
        flexDirection: "column",
        height: 10,
        overflowY: "hidden"
    }, j.map((W, D) => Cq.default.createElement(Ku, {
        key: D,
        message: W,
        lookups: Ke,
        addMargin: D > 0,
        tools: K.options.tools,
        commands: K.options.commands,
        verbose: K.options.verbose,
        inProgressToolUseIDs: new Set,
        progressMessagesForMessage: [],
        shouldAnimate: !1,
        shouldShowDot: !1,
        style: "condensed",
        isTranscriptMode: !1,
        isStatic: !0
    }))), Cq.default.createElement(u, {
        marginTop: 1
    }, Cq.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "Showing last ", j.length, " of ", q.log.length, " ", "messages"))), w && Cq.default.createElement(u, {
        marginTop: 1
    }, Cq.default.createElement(T, {
        color: "error"
    }, "Teleport failed: ", w)), A && Cq.default.createElement(T, {
        color: "background"
    }, "Teleporting to session…")))
}
// @from(Ln 475841, Col 4)
Cq
// @from(Ln 475841, Col 8)
tdY
// @from(Ln 475841, Col 13)
edY
// @from(Ln 475841, Col 18)
WnK
// @from(Ln 475841, Col 23)
DnK
// @from(Ln 475842, Col 4)
fnK = L(() => {
    o6();
    Qq();
    A3();
    NC6();
    g6();
    Bl();
    sY();
    cp();
    Nj();
    m8();
    c7();
    Ju6();
    _7();
    sk();
    gK();
    Nq();
    S4();
    u7();
    Y2();
    _b6();
    I$7();
    Cq = K6(P6(), 1);
    tdY = {
        needs_input: "input required",
        plan_ready: "ready"
    }, edY = {
        needs_input: "waiting",
        plan_ready: "done"
    };
    WnK = ["finding", "verifying", "synthesizing"], DnK = {
        finding: "Find",
        verifying: "Verify",
        synthesizing: "Dedupe"
    }
})
// @from(Ln 475878, Col 0)
async function GnK(q) {
    let K = $A(q.id);
    try {
        let _ = await RC(K, AcY);
        return {
            content: _.content,
            bytesTotal: _.bytesTotal
        }
    } catch {
        return {
            content: "",
            bytesTotal: 0
        }
    }
}
// @from(Ln 475894, Col 0)
function vnK(q) {
    let K = s(57),
        {
            shell: _,
            onDone: z,
            onKillShell: Y,
            onBack: A
        } = q,
        {
            columns: O
        } = s1(),
        w;
    if (K[0] !== _) w = () => GnK(_), K[0] = _, K[1] = w;
    else w = K[1];
    let [$, j] = Az.useState(w), H = Az.useDeferredValue($), J;
    if (K[2] !== _) J = () => {
        if (_.status !== "running") return;
        let i = setInterval(OcY, 1000, j, _);
        return () => clearInterval(i)
    }, K[2] = _, K[3] = J;
    else J = K[3];
    let X;
    if (K[4] !== _.id || K[5] !== _.status) X = [_.id, _.status], K[4] = _.id, K[5] = _.status, K[6] = X;
    else X = K[6];
    Az.useEffect(J, X);
    let M;
    if (K[7] !== z) M = () => z("Shell details dismissed", {
        display: "system"
    }), K[7] = z, K[8] = M;
    else M = K[8];
    let P = M,
        W;
    if (K[9] !== P) W = {
        "confirm:yes": P
    }, K[9] = P, K[10] = W;
    else W = K[10];
    let D;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) D = {
        context: "Confirmation"
    }, K[11] = D;
    else D = K[11];
    L7(W, D);
    let Z;
    if (K[12] !== A || K[13] !== z || K[14] !== Y || K[15] !== _.status) Z = (i) => {
        if (i.key === " ") i.preventDefault(), z("Shell details dismissed", {
            display: "system"
        });
        else if (i.key === "left" && A) i.preventDefault(), A();
        else if (i.key === "x" && !i.ctrl && !i.meta && _.status === "running" && Y) i.preventDefault(), Y()
    }, K[12] = A, K[13] = z, K[14] = Y, K[15] = _.status, K[16] = Z;
    else Z = K[16];
    let G = Z,
        f = _.kind === "monitor",
        v;
    if (K[17] !== _.command) v = j4(_.command, 280), K[17] = _.command, K[18] = v;
    else v = K[18];
    let V = v,
        k = f ? "Monitor details" : "Shell details",
        N;
    if (K[19] !== A || K[20] !== Y || K[21] !== _.status) N = (i) => i.pending ? Az.default.createElement(T, null, "Press ", i.keyName, " again to exit") : Az.default.createElement(z1, null, A && Az.default.createElement(A8, {
        chord: "left",
        action: "go back"
    }), Az.default.createElement(A8, {
        chord: ["escape", "enter", "space"],
        action: "close"
    }), _.status === "running" && Y && Az.default.createElement(A8, {
        chord: "x",
        action: "stop"
    })), K[19] = A, K[20] = Y, K[21] = _.status, K[22] = N;
    else N = K[22];
    let R;
    if (K[23] === Symbol.for("react.memo_cache_sentinel")) R = Az.default.createElement(T, {
        bold: !0
    }, "Status:"), K[23] = R;
    else R = K[23];
    let h;
    if (K[24] !== _.result || K[25] !== _.status) h = Az.default.createElement(T, null, R, " ", _.status === "running" ? Az.default.createElement(T, {
        color: "background"
    }, _.status, _.result?.code !== void 0 && ` (exit code: ${_.result.code})`) : _.status === "completed" ? Az.default.createElement(T, {
        color: "success"
    }, _.status, _.result?.code !== void 0 && ` (exit code: ${_.result.code})`) : Az.default.createElement(T, {
        color: "error"
    }, _.status, _.result?.code !== void 0 && ` (exit code: ${_.result.code})`)), K[24] = _.result, K[25] = _.status, K[26] = h;
    else h = K[26];
    let C;
    if (K[27] === Symbol.for("react.memo_cache_sentinel")) C = Az.default.createElement(T, {
        bold: !0
    }, "Runtime:"), K[27] = C;
    else C = K[27];
    let x;
    if (K[28] !== _.endTime) x = _.endTime ?? Date.now(), K[28] = _.endTime, K[29] = x;
    else x = K[29];
    let B = x - _.startTime,
        m;
    if (K[30] !== B) m = C5(B), K[30] = B, K[31] = m;
    else m = K[31];
    let S;
    if (K[32] !== m) S = Az.default.createElement(T, null, C, " ", m), K[32] = m, K[33] = S;
    else S = K[33];
    let F = f ? "Script:" : "Command:",
        U;
    if (K[34] !== F) U = Az.default.createElement(T, {
        bold: !0
    }, F), K[34] = F, K[35] = U;
    else U = K[35];
    let g;
    if (K[36] !== V || K[37] !== U) g = Az.default.createElement(T, {
        wrap: "wrap"
    }, U, " ", V), K[36] = V, K[37] = U, K[38] = g;
    else g = K[38];
    let c;
    if (K[39] !== h || K[40] !== S || K[41] !== g) c = Az.default.createElement(u, {
        flexDirection: "column"
    }, h, S, g), K[39] = h, K[40] = S, K[41] = g, K[42] = c;
    else c = K[42];
    let n;
    if (K[43] === Symbol.for("react.memo_cache_sentinel")) n = Az.default.createElement(T, {
        bold: !0
    }, "Output:"), K[43] = n;
    else n = K[43];
    let l;
    if (K[44] === Symbol.for("react.memo_cache_sentinel")) l = Az.default.createElement(T, {
        dimColor: !0
    }, "Loading output…"), K[44] = l;
    else l = K[44];
    let z6;
    if (K[45] !== O || K[46] !== H) z6 = Az.default.createElement(u, {
        flexDirection: "column"
    }, n, Az.default.createElement(Az.Suspense, {
        fallback: l
    }, Az.default.createElement(wcY, {
        outputPromise: H,
        columns: O
    }))), K[45] = O, K[46] = H, K[47] = z6;
    else z6 = K[47];
    let A6;
    if (K[48] !== P || K[49] !== N || K[50] !== c || K[51] !== z6 || K[52] !== k) A6 = Az.default.createElement(R1, {
        title: k,
        onCancel: P,
        color: "background",
        inputGuide: N
    }, c, z6), K[48] = P, K[49] = N, K[50] = c, K[51] = z6, K[52] = k, K[53] = A6;
    else A6 = K[53];
    let e;
    if (K[54] !== G || K[55] !== A6) e = Az.default.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: G
    }, A6), K[54] = G, K[55] = A6, K[56] = e;
    else e = K[56];
    return e
}
// @from(Ln 476048, Col 0)
function OcY(q, K) {
    return q(GnK(K))
}
// @from(Ln 476052, Col 0)
function wcY(q) {
    let K = s(19),
        {
            outputPromise: _,
            columns: z
        } = q,
        {
            content: Y,
            bytesTotal: A
        } = Az.use(_);
    if (!Y) {
        let W;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) W = Az.default.createElement(T, {
            dimColor: !0
        }, "No output available"), K[0] = W;
        else W = K[0];
        return W
    }
    let O, w;
    if (K[1] !== A || K[2] !== Y) {
        let W = [],
            D = Y.length;
        for (let Z = 0; Z < 10 && D > 0; Z++) {
            let G = Y.lastIndexOf(`
`, D - 1);
            W.push(G + 1), D = G
        }
        W.reverse(), O = A > Y.length, w = [];
        for (let Z = 0; Z < W.length; Z++) {
            let G = W[Z],
                f = Z < W.length - 1 ? W[Z + 1] - 1 : Y.length,
                v = Y.slice(G, f);
            if (v) w.push(v)
        }
        K[1] = A, K[2] = Y, K[3] = O, K[4] = w
    } else O = K[3], w = K[4];
    let $ = z - 6,
        j;
    if (K[5] !== w) j = w.map($cY), K[5] = w, K[6] = j;
    else j = K[6];
    let H;
    if (K[7] !== $ || K[8] !== j) H = Az.default.createElement(u, {
        borderStyle: "round",
        paddingX: 1,
        flexDirection: "column",
        height: 12,
        maxWidth: $
    }, j), K[7] = $, K[8] = j, K[9] = H;
    else H = K[9];
    let J = `Showing ${w.length} lines`,
        X;
    if (K[10] !== A || K[11] !== O) X = O ? ` of ${o4(A)}` : "", K[10] = A, K[11] = O, K[12] = X;
    else X = K[12];
    let M;
    if (K[13] !== J || K[14] !== X) M = Az.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, J, X), K[13] = J, K[14] = X, K[15] = M;
    else M = K[15];
    let P;
    if (K[16] !== H || K[17] !== M) P = Az.default.createElement(Az.default.Fragment, null, H, M), K[16] = H, K[17] = M, K[18] = P;
    else P = K[18];
    return P
}
// @from(Ln 476117, Col 0)
function $cY(q, K) {
    return Az.default.createElement(T, {
        key: K,
        wrap: "truncate-end"
    }, q)
}
// @from(Ln 476123, Col 4)
Az
// @from(Ln 476123, Col 8)
AcY = 8192
// @from(Ln 476124, Col 4)
TnK = L(() => {
    o6();
    I4();
    g6();
    C7();
    c7();
    Yq();
    EH();
    Nq();
    S4();
    u7();
    Az = K6(P6(), 1)
})
// @from(Ln 476138, Col 0)
function HcY(q, K) {
    return Object.values(q ?? {}).filter(yH).filter((z) => !(z.type === "local_agent" && z.id === K))
}
// @from(Ln 476142, Col 0)
function Xu6({
    onDone: q,
    toolUseContext: K,
    initialDetailTaskId: _,
    onBack: z
}) {
    let Y = M8((i) => i.tasks),
        A = M8((i) => i.foregroundedTaskId),
        O = M8((i) => i.expandedView) === "teammates",
        w = R7(),
        $ = EX(),
        j = V3("chat:killAgents", "Chat", "ctrl+x ctrl+k"),
        H = Y,
        J = w4.useRef(!1),
        [X, M] = w4.useState(() => {
            if (_) return J.current = !0, {
                mode: "detail",
                itemId: _
            };
            let i = HcY(H, A);
            if (i.length === 1) return J.current = !0, {
                mode: "detail",
                itemId: i[0].id
            };
            return {
                mode: "list"
            }
        }),
        [P, W] = w4.useState(0);
    A2("background-tasks-dialog");
    let {
        bashTasks: D,
        remoteSessions: Z,
        agentTasks: G,
        teammateTasks: f,
        workflowTasks: v,
        mcpMonitors: V,
        dreamTasks: k,
        allSelectableItems: N
    } = w4.useMemo(() => {
        let J6 = Object.values(H ?? {}).filter(yH).map(JcY).sort((X6, M6) => {
                let W6 = X6.status,
                    V6 = M6.status;
                if (W6 === "running" && V6 !== "running") return -1;
                if (W6 !== "running" && V6 === "running") return 1;
                let f6 = "task" in X6 ? X6.task.startTime : 0;
                return ("task" in M6 ? M6.task.startTime : 0) - f6
            }),
            $6 = J6.filter((X6) => X6.type === "local_bash"),
            H6 = J6.filter((X6) => X6.type === "remote_agent"),
            q6 = J6.filter((X6) => X6.type === "local_agent" && X6.id !== A),
            o = J6.filter((X6) => X6.type === "local_workflow"),
            _6 = J6.filter((X6) => X6.type === "monitor_mcp"),
            r = J6.filter((X6) => X6.type === "dream"),
            t = O ? [] : J6.filter((X6) => X6.type === "in_process_teammate"),
            Y6 = t.length > 0 ? [{
                id: "__leader__",
                type: "leader",
                label: `@${Mz}`,
                status: "running"
            }] : [];
        return {
            bashTasks: $6,
            remoteSessions: H6,
            agentTasks: q6,
            workflowTasks: o,
            mcpMonitors: _6,
            dreamTasks: r,
            teammateTasks: [...Y6, ...t],
            allSelectableItems: [...Y6, ...t, ...$6, ..._6, ...H6, ...q6, ...o, ...r]
        }
    }, [H, A, O]), R = N[P] ?? null;
    L7({
        "confirm:previous": () => W((i) => Math.max(0, i - 1)),
        "confirm:next": () => W((i) => Math.min(N.length - 1, i + 1)),
        "confirm:yes": () => {
            let i = N[P];
            if (i)
                if (i.type === "leader") kG(w), q("Viewing leader", {
                    display: "system"
                });
                else M({
                    mode: "detail",
                    itemId: i.id
                })
        }
    }, {
        context: "Confirmation",
        isActive: X.mode === "list"
    });
    let h = (i) => {
        if (X.mode !== "list") return;
        if (i.key === "left") {
            i.preventDefault(), q("Background tasks dialog dismissed", {
                display: "system"
            });
            return
        }
        let O6 = N[P];
        if (!O6) return;
        if (i.key === "x" && !i.ctrl && !i.meta) {
            if (i.preventDefault(), O6.type === "local_bash" && O6.status === "running") C(O6.id);
            else if (O6.type === "local_agent" && O6.status === "running") x(O6.id);
            else if (O6.type === "in_process_teammate" && O6.status === "running") B(O6.id);
            else if (O6.type === "local_workflow" && O6.status === "running" && or8) or8(O6.id, $);
            else if (O6.type === "monitor_mcp" && O6.status === "running" && ar8) ar8(O6.id, $);
            else if (O6.type === "dream" && O6.status === "running") m(O6.id);
            else if (O6.type === "remote_agent" && O6.status === "running")
                if (O6.task.isUltraplan) G$7(O6.id, O6.task.sessionId, $, w);
                else if (O6.task.isRemoteReview) v$7(O6.id, O6.task.sessionId, $, w);
            else S(O6.id)
        }
        if (i.key === "f" && !i.ctrl && !i.meta) {
            if (O6.type === "in_process_teammate" && O6.status === "running") i.preventDefault(), VG(O6.id, w), q("Viewing teammate", {
                display: "system"
            });
            else if (O6.type === "leader") i.preventDefault(), kG(w), q("Viewing leader", {
                display: "system"
            })
        }
    };

    function C(i) {
        return nQ8.kill(i, $, w)
    }

    function x(i) {
        return lQ8.kill(i, $, w)
    }

    function B(i) {
        return Z18.kill(i, $, w)
    }

    function m(i) {
        return dQ8.kill(i, $, w)
    }

    function S(i) {
        return mX6.kill(i, $, w)
    }
    let F = w4.useEffectEvent(q);
    w4.useEffect(() => {
        if (X.mode !== "list") {
            let O6 = (H ?? {})[X.itemId];
            if (!O6 || O6.type !== "local_workflow" && !yH(O6))
                if (J.current) F("Background tasks dialog dismissed", {
                    display: "system"
                });
                else M({
                    mode: "list"
                })
        }
        let i = N.length;
        if (P >= i && i > 0) W(i - 1)
    }, [X, H, P, N, F]);
    let U = () => {
        if (z) z();
        else if (J.current && N.length <= 1) q("Background tasks dialog dismissed", {
            display: "system"
        });
        else J.current = !1, M({
            mode: "list"
        })
    };
    if (X.mode !== "list" && H) {
        let i = H[X.itemId];
        if (!i) return null;
        switch (i.type) {
            case "local_bash":
                return w4.default.createElement(vnK, {
                    shell: i,
                    onDone: q,
                    onKillShell: () => void C(i.id),
                    onBack: U,
                    key: `shell-${i.id}`
                });
            case "local_agent":
                return w4.default.createElement(_nK, {
                    agent: i,
                    onDone: q,
                    onKillAgent: () => void x(i.id),
                    onBack: U,
                    key: `agent-${i.id}`
                });
            case "remote_agent":
                return w4.default.createElement(ZnK, {
                    session: i,
                    onDone: q,
                    toolUseContext: K,
                    onBack: U,
                    onKill: i.status !== "running" ? void 0 : i.isUltraplan ? () => void G$7(i.id, i.sessionId, $, w) : i.isRemoteReview ? () => void v$7(i.id, i.sessionId, $, w) : () => void S(i.id),
                    key: `session-${i.id}`
                });
            case "in_process_teammate":
                return w4.default.createElement(JnK, {
                    teammate: i,
                    onDone: q,
                    onKill: i.status === "running" ? () => void B(i.id) : void 0,
                    onBack: U,
                    onForeground: i.status === "running" ? () => {
                        VG(i.id, w), q("Viewing teammate", {
                            display: "system"
                        })
                    } : void 0,
                    key: `teammate-${i.id}`
                });
            case "local_workflow":
                if (!VnK) return null;
                return w4.default.createElement(VnK, {
                    workflow: i,
                    onDone: q,
                    onKill: i.status === "running" && or8 ? () => or8(i.id, $) : void 0,
                    onSkipAgent: i.status === "running" && knK ? (O6) => knK(i.id, O6, $) : void 0,
                    onRetryAgent: i.status === "running" && NnK ? (O6) => NnK(i.id, O6, $) : void 0,
                    onBack: U,
                    key: `workflow-${i.id}`
                });
            case "monitor_mcp":
                if (!EnK) return null;
                return w4.default.createElement(EnK, {
                    task: i,
                    onKill: i.status === "running" && ar8 ? () => ar8(i.id, $) : void 0,
                    onBack: U,
                    key: `monitor-mcp-${i.id}`
                });
            case "dream":
                return w4.default.createElement(jnK, {
                    task: i,
                    onDone: () => q("Background tasks dialog dismissed", {
                        display: "system"
                    }),
                    onBack: U,
                    onKill: i.status === "running" ? () => void m(i.id) : void 0,
                    key: `dream-${i.id}`
                })
        }
    }
    let g = w7(D, (i) => i.status === "running"),
        c = w7(Z, (i) => i.status === "running" || i.status === "pending") + w7(G, (i) => i.status === "running"),
        n = w7(f, (i) => i.status === "running"),
        l = L16([...n > 0 ? [w4.default.createElement(T, {
            key: "teammates"
        }, n, " ", n !== 1 ? "agents" : "agent")] : [], ...g > 0 ? [w4.default.createElement(T, {
            key: "shells"
        }, g, " ", g !== 1 ? "active shells" : "active shell")] : [], ...c > 0 ? [w4.default.createElement(T, {
            key: "agents"
        }, c, " ", c !== 1 ? "active agents" : "active agent")] : []], (i) => w4.default.createElement(T, {
            key: `separator-${i}`
        }, " · ")),
        z6 = [w4.default.createElement(A8, {
            key: "upDown",
            chord: ["up", "down"],
            action: "select"
        }), w4.default.createElement(A8, {
            key: "enter",
            chord: "enter",
            action: "view"
        }), ...R?.type === "in_process_teammate" && R.status === "running" ? [w4.default.createElement(A8, {
            key: "foreground",
            chord: "f",
            action: "foreground"
        })] : [], ...(R?.type === "local_bash" || R?.type === "local_agent" || R?.type === "in_process_teammate" || R?.type === "local_workflow" || R?.type === "monitor_mcp" || R?.type === "dream" || R?.type === "remote_agent") && R.status === "running" ? [w4.default.createElement(A8, {
            key: "kill",
            chord: "x",
            action: "stop"
        })] : [], ...G.some((i) => i.status === "running") ? [w4.default.createElement(A8, {
            key: "kill-all",
            chord: j,
            action: "stop all agents",
            format: {
                keyCase: "lower"
            }
        })] : [], w4.default.createElement(A8, {
            key: "esc",
            chord: ["left", "escape"],
            action: "close"
        })],
        A6 = () => q("Background tasks dialog dismissed", {
            display: "system"
        });

    function e(i) {
        if (i.pending) return w4.default.createElement(T, null, "Press ", i.keyName, " again to exit");
        return w4.default.createElement(z1, null, z6)
    }
    return w4.default.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: h
    }, w4.default.createElement(R1, {
        title: "Background tasks",
        subtitle: w4.default.createElement(w4.default.Fragment, null, l),
        onCancel: A6,
        color: "background",
        inputGuide: e
    }, N.length === 0 ? w4.default.createElement(T, {
        dimColor: !0
    }, "No tasks currently running") : w4.default.createElement(u, {
        flexDirection: "column"
    }, f.length > 0 && w4.default.createElement(u, {
        flexDirection: "column"
    }, (D.length > 0 || Z.length > 0 || G.length > 0) && w4.default.createElement(T, {
        dimColor: !0
    }, w4.default.createElement(T, {
        bold: !0
    }, "  ", "Agents"), " (", w7(f, (i) => i.type !== "leader"), ")"), w4.default.createElement(u, {
        flexDirection: "column"
    }, w4.default.createElement(XcY, {
        teammateTasks: f,
        currentSelectionId: R?.id
    }))), D.length > 0 && w4.default.createElement(u, {
        flexDirection: "column",
        marginTop: f.length > 0 ? 1 : 0
    }, (f.length > 0 || Z.length > 0 || G.length > 0) && w4.default.createElement(T, {
        dimColor: !0
    }, w4.default.createElement(T, {
        bold: !0
    }, "  ", "Shells"), " (", D.length, ")"), w4.default.createElement(u, {
        flexDirection: "column"
    }, D.map((i) => w4.default.createElement(qz6, {
        key: i.id,
        item: i,
        isSelected: i.id === R?.id
    })))), V.length > 0 && w4.default.createElement(u, {
        flexDirection: "column",
        marginTop: f.length > 0 || D.length > 0 ? 1 : 0
    }, w4.default.createElement(T, {
        dimColor: !0
    }, w4.default.createElement(T, {
        bold: !0
    }, "  ", "Monitors"), " (", V.length, ")"), w4.default.createElement(u, {
        flexDirection: "column"
    }, V.map((i) => w4.default.createElement(qz6, {
        key: i.id,
        item: i,
        isSelected: i.id === R?.id
    })))), Z.length > 0 && w4.default.createElement(u, {
        flexDirection: "column",
        marginTop: f.length > 0 || D.length > 0 || V.length > 0 ? 1 : 0
    }, w4.default.createElement(T, {
        dimColor: !0
    }, w4.default.createElement(T, {
        bold: !0
    }, "  ", "Remote agents"), " (", Z.length, ")"), w4.default.createElement(u, {
        flexDirection: "column"
    }, Z.map((i) => w4.default.createElement(qz6, {
        key: i.id,
        item: i,
        isSelected: i.id === R?.id
    })))), G.length > 0 && w4.default.createElement(u, {
        flexDirection: "column",
        marginTop: f.length > 0 || D.length > 0 || V.length > 0 || Z.length > 0 ? 1 : 0
    }, w4.default.createElement(T, {
        dimColor: !0
    }, w4.default.createElement(T, {
        bold: !0
    }, "  ", "Local agents"), " (", G.length, ")"), w4.default.createElement(u, {
        flexDirection: "column"
    }, G.map((i) => w4.default.createElement(qz6, {
        key: i.id,
        item: i,
        isSelected: i.id === R?.id
    })))), v.length > 0 && w4.default.createElement(u, {
        flexDirection: "column",
        marginTop: f.length > 0 || D.length > 0 || V.length > 0 || Z.length > 0 || G.length > 0 ? 1 : 0
    }, w4.default.createElement(T, {
        dimColor: !0
    }, w4.default.createElement(T, {
        bold: !0
    }, "  ", "Workflows"), " (", v.length, ")"), w4.default.createElement(u, {
        flexDirection: "column"
    }, v.map((i) => w4.default.createElement(qz6, {
        key: i.id,
        item: i,
        isSelected: i.id === R?.id
    })))), k.length > 0 && w4.default.createElement(u, {
        flexDirection: "column",
        marginTop: f.length > 0 || D.length > 0 || V.length > 0 || Z.length > 0 || G.length > 0 || v.length > 0 ? 1 : 0
    }, w4.default.createElement(u, {
        flexDirection: "column"
    }, k.map((i) => w4.default.createElement(qz6, {
        key: i.id,
        item: i,
        isSelected: i.id === R?.id
    })))))))
}
// @from(Ln 476531, Col 0)
function JcY(q) {
    switch (q.type) {
        case "local_bash":
            return {
                id: q.id, type: "local_bash", label: q.kind === "monitor" ? q.description : q.command, status: q.status, task: q
            };
        case "remote_agent":
            return {
                id: q.id, type: "remote_agent", label: q.title, status: q.status, task: q
            };
        case "local_agent":
            return {
                id: q.id, type: "local_agent", label: q.description, status: q.status, task: q
            };
        case "in_process_teammate":
            return {
                id: q.id, type: "in_process_teammate", label: `@${q.identity.agentName}`, status: q.status, task: q
            };
        case "local_workflow":
            return {
                id: q.id, type: "local_workflow", label: q.summary ?? q.description, status: q.status, task: q
            };
        case "monitor_mcp":
            return {
                id: q.id, type: "monitor_mcp", label: q.description, status: q.status, task: q
            };
        case "dream":
            return {
                id: q.id, type: "dream", label: q.description, status: q.status, task: q
            }
    }
}
// @from(Ln 476564, Col 0)
function qz6(q) {
    let K = s(14),
        {
            item: _,
            isSelected: z
        } = q,
        {
            columns: Y
        } = s1(),
        A = Math.max(30, Y - 26),
        O;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) O = Ch6(), K[0] = O;
    else O = K[0];
    let w = O,
        $ = w && z,
        j = z ? e6.pointer + " " : "  ",
        H;
    if (K[1] !== $ || K[2] !== j) H = w4.default.createElement(T, {
        dimColor: $
    }, j), K[1] = $, K[2] = j, K[3] = H;
    else H = K[3];
    let J = z && !w ? "suggestion" : void 0,
        X;
    if (K[4] !== _.task || K[5] !== _.type || K[6] !== A) X = _.type === "leader" ? w4.default.createElement(T, null, "@", Mz) : w4.default.createElement(wnK, {
        task: _.task,
        maxActivityWidth: A
    }), K[4] = _.task, K[5] = _.type, K[6] = A, K[7] = X;
    else X = K[7];
    let M;
    if (K[8] !== J || K[9] !== X) M = w4.default.createElement(T, {
        color: J
    }, X), K[8] = J, K[9] = X, K[10] = M;
    else M = K[10];
    let P;
    if (K[11] !== H || K[12] !== M) P = w4.default.createElement(u, {
        flexDirection: "row"
    }, H, M), K[11] = H, K[12] = M, K[13] = P;
    else P = K[13];
    return P
}
// @from(Ln 476605, Col 0)
function XcY(q) {
    let K = s(3),
        {
            teammateTasks: _,
            currentSelectionId: z
        } = q,
        Y;
    if (K[0] !== z || K[1] !== _) {
        let A = _.filter(PcY),
            O = _.filter(McY),
            w = new Map;
        for (let j of O) {
            let H = j.task.identity.teamName,
                J = w.get(H);
            if (J) J.push(j);
            else w.set(H, [j])
        }
        let $ = [...w.entries()];
        Y = w4.default.createElement(w4.default.Fragment, null, $.map((j) => {
            let [H, J] = j, X = J.length + A.length;
            return w4.default.createElement(u, {
                key: H,
                flexDirection: "column"
            }, w4.default.createElement(T, {
                dimColor: !0
            }, "  ", "Team: ", H, " (", X, ")"), A.map((M) => w4.default.createElement(qz6, {
                key: `${M.id}-${H}`,
                item: M,
                isSelected: M.id === z
            })), J.map((M) => w4.default.createElement(qz6, {
                key: M.id,
                item: M,
                isSelected: M.id === z
            })))
        })), K[0] = z, K[1] = _, K[2] = Y
    } else Y = K[2];
    return Y
}
// @from(Ln 476644, Col 0)
function McY(q) {
    return q.type === "in_process_teammate"
}
// @from(Ln 476648, Col 0)
function PcY(q) {
    return q.type === "leader"
}
// @from(Ln 476651, Col 4)
w4
// @from(Ln 476651, Col 8)
VnK = null
// @from(Ln 476652, Col 4)
m$7 = null
// @from(Ln 476653, Col 4)
or8
// @from(Ln 476653, Col 9)
knK
// @from(Ln 476653, Col 14)
NnK
// @from(Ln 476653, Col 19)
jcY = null
// @from(Ln 476654, Col 4)
ar8
// @from(Ln 476654, Col 9)
EnK = null
// @from(Ln 476655, Col 4)
sr8 = L(() => {
    o6();
    Qq();
    d88();
    I4();
    N7();
    Ru();
    $S();
    cQ8();
    hx();
    vM();
    pl();
    Bl();
    $W6();
    CP();
    g6();
    C7();
    RM();
    Nq();
    S4();
    u7();
    znK();
    $nK();
    HnK();
    XnK();
    fnK();
    TnK();
    w4 = K6(P6(), 1), or8 = m$7?.killWorkflowTask ?? null, knK = m$7?.skipWorkflowAgent ?? null, NnK = m$7?.retryWorkflowAgent ?? null, ar8 = jcY?.killMonitorMcp ?? null
})
// @from(Ln 476684, Col 4)
ynK = {}
// @from(Ln 476688, Col 0)
async function WcY(q, K) {
    return B$7.createElement(Xu6, {
        toolUseContext: K,
        onDone: q
    })
}
// @from(Ln 476694, Col 4)
B$7
// @from(Ln 476695, Col 4)
LnK = L(() => {
    sr8();
    B$7 = K6(P6(), 1)
})
// @from(Ln 476699, Col 4)
DcY
// @from(Ln 476699, Col 9)
hnK
// @from(Ln 476700, Col 4)
RnK = L(() => {
    DcY = {
        type: "local-jsx",
        name: "tasks",
        aliases: ["bashes"],
        description: "List and manage background tasks",
        load: () => Promise.resolve().then(() => (LnK(), ynK))
    }, hnK = DcY
})
// @from(Ln 476710, Col 0)
function SnK(q) {
    let K = s(8),
        [_, z] = tr8.useState(!1),
        [Y, A] = tr8.useState(null),
        [O, w] = tr8.useState(null),
        $;
    if (K[0] !== q) $ = async (M) => {
        z(!0), A(null), w(M), d("tengu_teleport_resume_session", {
            source: q,
            session_id: M.id
        });
        try {
            let P = await uX6(M.id);
            return Yp6({
                sessionId: M.id
            }), z(!1), P
        } catch (P) {
            let W = P,
                D = {
                    message: W instanceof dj ? W.message : b6(W),
                    formattedMessage: W instanceof dj ? W.formattedMessage : void 0,
                    isOperationError: W instanceof dj
                };
            return A(D), z(!1), null
        }
    }, K[0] = q, K[1] = $;
    else $ = K[1];
    let j = $,
        H;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) H = () => {
        A(null)
    }, K[2] = H;
    else H = K[2];
    let J = H,
        X;
    if (K[3] !== Y || K[4] !== _ || K[5] !== j || K[6] !== O) X = {
        resumeSession: j,
        isResuming: _,
        error: Y,
        selectedSession: O,
        clearError: J
    }, K[3] = Y, K[4] = _, K[5] = j, K[6] = O, K[7] = X;
    else X = K[7];
    return X
}
// @from(Ln 476755, Col 4)
tr8
// @from(Ln 476756, Col 4)
CnK = L(() => {
    o6();
    y8();
    C8();
    m8();
    sk();
    tr8 = K6(P6(), 1)
})
// @from(Ln 476765, Col 0)
function InK({
    onSelect: q,
    onCancel: K,
    isEmbedded: _ = !1
}) {
    let {
        rows: z
    } = s1(), [Y, A] = E3.useState([]), [O, w] = E3.useState(null), [$, j] = E3.useState(!0), [H, J] = E3.useState(null), [X, M] = E3.useState(!1), [P, W] = E3.useState(!1), [D, Z] = E3.useState(1), G = V3("confirm:no", "Confirmation", "Esc"), f = E3.useCallback(async () => {
        try {
            j(!0), J(null);
            let S = await x16();
            w(S), E(`Current repository: ${S||"not detected"}`);
            let F = await Bo1(),
                U = F;
            if (S) U = F.filter((c) => {
                if (!c.repo) return !1;
                return `${c.repo.owner.login}/${c.repo.name}` === S
            }), E(`Filtered ${U.length} sessions for repo ${S} from ${F.length} total`);
            let g = [...U].sort((c, n) => {
                let l = new Date(c.updated_at);
                return new Date(n.updated_at).getTime() - l.getTime()
            });
            A(g)
        } catch (S) {
            let F = S instanceof Error ? S.message : String(S);
            E(`Error loading code sessions: ${F}`), J(fcY(F))
        } finally {
            j(!1), M(!1)
        }
    }, []), v = () => {
        M(!0), f()
    };
    G1("confirm:no", K, {
        context: "Confirmation"
    });

    function V(S) {
        if (S.ctrl && S.key === "c") {
            S.preventDefault(), K();
            return
        }
        if (S.ctrl && S.key === "r" && H) {
            S.preventDefault(), v();
            return
        }
        if (H !== null && S.key === "return") {
            S.preventDefault(), K();
            return
        }
    }
    let k = E3.useCallback(() => {
        W(!0), f()
    }, [W, f]);
    if (!P) return E3.default.createElement(FF8, {
        onComplete: k
    });
    if ($) return E3.default.createElement(u, {
        flexDirection: "column",
        padding: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: V
    }, E3.default.createElement(Q$, {
        message: "Loading Claude Code sessions…",
        bold: !0,
        subtitle: X ? "Retrying…" : "Fetching your Claude Code sessions…"
    }));
    if (H) return E3.default.createElement(u, {
        flexDirection: "column",
        padding: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: V
    }, E3.default.createElement(T, {
        bold: !0,
        color: "error"
    }, "Error loading Claude Code sessions"), GcY(H), E3.default.createElement(T, {
        dimColor: !0
    }, "Press ", E3.default.createElement(T, {
        bold: !0
    }, "Ctrl+R"), " to retry · Press", " ", E3.default.createElement(T, {
        bold: !0
    }, G), " to cancel"));
    if (Y.length === 0) return E3.default.createElement(u, {
        flexDirection: "column",
        padding: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: V
    }, E3.default.createElement(T, {
        bold: !0
    }, "No Claude Code sessions found", O && E3.default.createElement(T, null, " for ", O)), E3.default.createElement(u, {
        marginTop: 1
    }, E3.default.createElement(T, {
        dimColor: !0
    }, "Press ", E3.default.createElement(T, {
        bold: !0
    }, G), " to cancel")));
    let N = Y.map((S) => ({
            ...S,
            timeString: _28(new Date(S.updated_at))
        })),
        R = Math.max(bnK.length, ...N.map((S) => S.timeString.length)),
        h = N.map(({
            timeString: S,
            title: F,
            id: U
        }) => {
            return {
                label: `${S.padEnd(R," ")}  ${F}`,
                value: U
            }
        }),
        C = 7,
        x = Math.max(1, _ ? Math.min(Y.length, 5, z - 6 - C) : Math.min(Y.length, z - 1 - C)),
        B = x + C,
        m = Y.length > x;
    return E3.default.createElement(u, {
        flexDirection: "column",
        padding: 1,
        height: B,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: V
    }, E3.default.createElement(T, {
        bold: !0
    }, "Select a session to resume", m && E3.default.createElement(T, {
        dimColor: !0
    }, " ", "(", D, " of ", Y.length, ")"), O && E3.default.createElement(T, {
        dimColor: !0
    }, " (", O, ")"), ":"), E3.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1,
        flexGrow: 1
    }, E3.default.createElement(u, {
        marginLeft: 2
    }, E3.default.createElement(T, {
        bold: !0
    }, bnK.padEnd(R, " "), ZcY, "Session Title")), E3.default.createElement(A1, {
        visibleOptionCount: x,
        options: h,
        onChange: (S) => {
            let F = Y.find((U) => U.id === S);
            if (F) q(F)
        },
        onFocus: (S) => {
            let F = h.findIndex((U) => U.value === S);
            if (F >= 0) Z(F + 1)
        }
    })), E3.default.createElement(u, {
        flexDirection: "row"
    }, E3.default.createElement(T, {
        dimColor: !0
    }, E3.default.createElement(z1, null, E3.default.createElement(A8, {
        chord: ["up", "down"],
        action: "select"
    }), E3.default.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), E3.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))))
}
// @from(Ln 476932, Col 0)
function fcY(q) {
    let K = q.toLowerCase();
    if (K.includes("fetch") || K.includes("network") || K.includes("timeout")) return "network";
    if (K.includes("auth") || K.includes("token") || K.includes("permission") || K.includes("oauth") || K.includes("not authenticated") || K.includes("/login") || K.includes("console account") || K.includes("403")) return "auth";
    if (K.includes("api") || K.includes("rate limit") || K.includes("500") || K.includes("529")) return "api";
    return "other"
}
// @from(Ln 476940, Col 0)
function GcY(q) {
    switch (q) {
        case "network":
            return E3.default.createElement(u, {
                marginY: 1,
                flexDirection: "column"
            }, E3.default.createElement(T, {
                dimColor: !0
            }, "Check your internet connection"));
        case "auth":
            return E3.default.createElement(u, {
                marginY: 1,
                flexDirection: "column"
            }, E3.default.createElement(T, {
                dimColor: !0
            }, "Teleport requires a Claude account"), E3.default.createElement(T, {
                dimColor: !0
            }, "Run ", E3.default.createElement(T, {
                bold: !0
            }, "/login"), ' and select "Claude account with subscription"'));
        case "api":
            return E3.default.createElement(u, {
                marginY: 1,
                flexDirection: "column"
            }, E3.default.createElement(T, {
                dimColor: !0
            }, "Sorry, Claude encountered an error"));
        case "other":
            return E3.default.createElement(u, {
                marginY: 1,
                flexDirection: "row"
            }, E3.default.createElement(T, {
                dimColor: !0
            }, "Sorry, Claude Code encountered an error"))
    }
}
// @from(Ln 476976, Col 4)
E3
// @from(Ln 476976, Col 8)
bnK = "Updated"
// @from(Ln 476977, Col 4)
ZcY = "  "
// @from(Ln 476978, Col 4)
xnK = L(() => {
    I4();
    VX();
    g6();
    C7();
    RM();
    K8();
    gZ();
    c7();
    bK();
    g_();
    Nq();
    u7();
    Qy();
    i17();
    E3 = K6(P6(), 1)
})
// @from(Ln 476995, Col 4)
unK = {}
// @from(Ln 477000, Col 0)
function p$7(q) {
    let K = s(25),
        {
            onComplete: _,
            onCancel: z,
            onError: Y,
            isEmbedded: A,
            source: O
        } = q,
        w = A === void 0 ? !1 : A,
        {
            resumeSession: $,
            isResuming: j,
            error: H,
            selectedSession: J
        } = SnK(O),
        X, M;
    if (K[0] !== O) X = () => {
        d("tengu_teleport_started", {
            source: O
        })
    }, M = [O], K[0] = O, K[1] = X, K[2] = M;
    else X = K[1], M = K[2];
    $N.useEffect(X, M);
    let P;
    if (K[3] !== H || K[4] !== _ || K[5] !== Y || K[6] !== $) P = async (V) => {
        let k = await $(V);
        if (k) _(k);
        else if (H) {
            if (Y) Y(H.message, H.formattedMessage)
        }
    }, K[3] = H, K[4] = _, K[5] = Y, K[6] = $, K[7] = P;
    else P = K[7];
    let W = P,
        D;
    if (K[8] !== z) D = () => {
        d("tengu_teleport_cancelled", {}), z()
    }, K[8] = z, K[9] = D;
    else D = K[9];
    let Z = D,
        G = !!H && !Y,
        f;
    if (K[10] !== G) f = {
        context: "Global",
        isActive: G
    }, K[10] = G, K[11] = f;
    else f = K[11];
    if (G1("app:interrupt", Z, f), j && J) {
        let V;
        if (K[12] === Symbol.for("react.memo_cache_sentinel")) V = $N.default.createElement(u, {
            flexDirection: "row"
        }, $N.default.createElement(Y5, null), $N.default.createElement(T, {
            bold: !0
        }, "Resuming session…")), K[12] = V;
        else V = K[12];
        let k;
        if (K[13] !== J.title) k = $N.default.createElement(u, {
            flexDirection: "column",
            padding: 1
        }, V, $N.default.createElement(T, {
            dimColor: !0
        }, 'Loading "', J.title, '"…')), K[13] = J.title, K[14] = k;
        else k = K[14];
        return k
    }
    if (H && !Y) {
        let V;
        if (K[15] === Symbol.for("react.memo_cache_sentinel")) V = $N.default.createElement(T, {
            bold: !0,
            color: "error"
        }, "Failed to resume session"), K[15] = V;
        else V = K[15];
        let k;
        if (K[16] !== H.message) k = $N.default.createElement(T, {
            dimColor: !0
        }, H.message), K[16] = H.message, K[17] = k;
        else k = K[17];
        let N;
        if (K[18] === Symbol.for("react.memo_cache_sentinel")) N = $N.default.createElement(u, {
            marginTop: 1
        }, $N.default.createElement(T, {
            dimColor: !0
        }, "Press ", $N.default.createElement(T, {
            bold: !0
        }, "Esc"), " to cancel")), K[18] = N;
        else N = K[18];
        let R;
        if (K[19] !== k) R = $N.default.createElement(u, {
            flexDirection: "column",
            padding: 1
        }, V, k, N), K[19] = k, K[20] = R;
        else R = K[20];
        return R
    }
    let v;
    if (K[21] !== Z || K[22] !== W || K[23] !== w) v = $N.default.createElement(InK, {
        onSelect: W,
        onCancel: Z,
        isEmbedded: w
    }), K[21] = Z, K[22] = W, K[23] = w, K[24] = v;
    else v = K[24];
    return v
}
// @from(Ln 477103, Col 4)
$N
// @from(Ln 477104, Col 4)
F$7 = L(() => {
    o6();
    C8();
    CnK();
    g6();
    C7();
    xnK();
    Ej();
    $N = K6(P6(), 1)
})
// @from(Ln 477114, Col 4)
BnK = {}
// @from(Ln 477120, Col 0)
function mnK(q) {
    let K = s(10),
        {
            onExit: _,
            context: z
        } = q,
        Y;
    if (K[0] !== z || K[1] !== _) Y = ($) => {
        z.setMessages(() => $.log), _("Session resumed successfully", {
            display: "system"
        })
    }, K[0] = z, K[1] = _, K[2] = Y;
    else Y = K[2];
    let A, O;
    if (K[3] !== _) A = () => {
        _("Teleport cancelled", {
            display: "system"
        })
    }, O = ($, j) => {
        _($, {
            display: "system"
        })
    }, K[3] = _, K[4] = A, K[5] = O;
    else A = K[4], O = K[5];
    let w;
    if (K[6] !== Y || K[7] !== A || K[8] !== O) w = g$7.default.createElement(p$7, {
        onComplete: Y,
        onCancel: A,
        onError: O,
        isEmbedded: !0,
        source: "localCommand"
    }), K[6] = Y, K[7] = A, K[8] = O, K[9] = w;
    else w = K[9];
    return w
}
// @from(Ln 477155, Col 4)
g$7
// @from(Ln 477155, Col 9)
vcY = async (q, K) => {
    return g$7.default.createElement(mnK, {
        onExit: q,
        context: K
    })
}
// @from(Ln 477161, Col 4)
pnK = L(() => {
    o6();
    F$7();
    g$7 = K6(P6(), 1)
})
// @from(Ln 477166, Col 4)
TcY
// @from(Ln 477166, Col 9)
FnK
// @from(Ln 477167, Col 4)
gnK = L(() => {
    J2();
    T7();
    TcY = {
        type: "local-jsx",
        name: "teleport",
        description: "Resume a Claude Code session from claude.ai",
        aliases: ["tp"],
        isEnabled: () => i7() && N5("allow_remote_sessions"),
        get isHidden() {
            return !i7() || !N5("allow_remote_sessions")
        },
        load: () => Promise.resolve().then(() => (pnK(), BnK))
    }, FnK = TcY
})
// @from(Ln 477183, Col 0)
function UnK({
    name: q,
    description: K,
    progressMessage: _,
    pluginName: z,
    pluginCommand: Y,
    getPromptWhileMarketplaceIsPrivate: A
}) {
    return {
        type: "prompt",
        name: q,
        description: K,
        progressMessage: _,
        contentLength: 0,
        userFacingName() {
            return q
        },
        source: "builtin",
        disableModelInvocation: !1,
        async getPromptForCommand(O, w) {
            return A(O, w)
        }
    }
}