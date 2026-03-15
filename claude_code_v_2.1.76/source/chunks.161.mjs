
// @from(Ln 412072, Col 4)
veY = (A) => {
        let q = A6(111),
            {
                messages: K,
                tools: Y,
                commands: z,
                verbose: _,
                toolJSX: w,
                toolUseConfirmQueue: O,
                inProgressToolUseIDs: $,
                isMessageSelectorVisible: H,
                conversationId: j,
                screen: J,
                streamingToolUses: M,
                showAllInTranscript: D,
                agentDefinitions: X,
                onOpenRateLimitOptions: P,
                hideLogo: W,
                isLoading: Z,
                hidePastThinking: G,
                streamingThinking: f,
                streamingText: v,
                isBriefOnly: N,
                unseenDivider: V,
                scrollRef: L,
                disableRenderCap: h
            } = A,
            R = D === void 0 ? !1 : D,
            u = W === void 0 ? !1 : W,
            I = G === void 0 ? !1 : G,
            g = N === void 0 ? !1 : N,
            B = h === void 0 ? !1 : h,
            {
                columns: b
            } = KA(),
            p = Rq("transcript:toggleShowAll", "Transcript", "Ctrl+E"),
            Q;
        if (q[0] !== K) Q = JM(K).filter(Gi6), q[0] = K, q[1] = Q;
        else Q = q[1];
        let U = Q,
            r;
        A: {
            if (!f) {
                r = !1;
                break A
            }
            if (f.isStreaming) {
                r = !0;
                break A
            }
            if (f.streamingEndedAt) {
                r = Date.now() - f.streamingEndedAt < 30000;
                break A
            }
            r = !1
        }
        let e = r,
            Y6;
        A: {
            if (!I) {
                Y6 = null;
                break A
            }
            if (e) {
                Y6 = "streaming";
                break A
            }
            for (let h8 = U.length - 1; h8 >= 0; h8--) {
                let U8 = U[h8];
                if (U8?.type === "assistant") {
                    let P4 = U8.message.content;
                    for (let T4 = P4.length - 1; T4 >= 0; T4--)
                        if (P4[T4]?.type === "thinking") {
                            Y6 = `${U8.uuid}:${T4}`;
                            break A
                        }
                } else if (U8?.type === "user") {
                    if (!U8.message.content.some(VeY)) {
                        Y6 = "no-thinking";
                        break A
                    }
                }
            }
            Y6 = null
        }
        let H6 = Y6,
            J6;
        if (q[2] !== U) {
            A: {
                for (let h8 = U.length - 1; h8 >= 0; h8--) {
                    let U8 = U[h8];
                    if (U8?.type === "user") {
                        let P4 = U8.message.content;
                        for (let T4 of P4)
                            if (T4.type === "text") {
                                let $4 = T4.text;
                                if ($4.startsWith("<bash-stdout") || $4.startsWith("<bash-stderr")) {
                                    J6 = U8.uuid;
                                    break A
                                }
                            }
                    }
                }
                J6 = null
            }
            q[2] = U,
            q[3] = J6
        }
        else J6 = q[3];
        let K6 = J6,
            s;
        if (q[4] !== $ || q[5] !== U || q[6] !== M) {
            let h8;
            if (q[8] !== $ || q[9] !== U) h8 = (U8) => {
                if ($.has(U8.contentBlock.id)) return !1;
                if (U.some((P4) => P4.type === "assistant" && P4.message.content[0].type === "tool_use" && P4.message.content[0].id === U8.contentBlock.id)) return !1;
                return !0
            }, q[8] = $, q[9] = U, q[10] = h8;
            else h8 = q[10];
            s = M.filter(h8), q[4] = $, q[5] = U, q[6] = M, q[7] = s
        } else s = q[7];
        let X6 = s,
            z6;
        if (q[11] !== X6) z6 = X6.flatMap(keY), q[11] = X6, q[12] = z6;
        else z6 = q[12];
        let N6 = z6,
            $6 = J === "transcript",
            n;
        if (q[13] !== L) n = GeY != null && L != null && !t6(process.env.CLAUDE_CODE_DISABLE_VIRTUAL_SCROLL), q[13] = L, q[14] = n;
        else n = q[14];
        let o = n,
            a;
        if (q[15] !== $6 || q[16] !== R || q[17] !== o) a = $6 && !R, q[15] = $6, q[16] = R, q[17] = o, q[18] = a;
        else a = q[18];
        let i = a,
            l, q6, w6, O6;
        if (q[19] !== B || q[20] !== g || q[21] !== $6 || q[22] !== U || q[23] !== i || q[24] !== N6 || q[25] !== Y || q[26] !== _ || q[27] !== o) {
            let h8 = _ ? U : fN(U),
                U8;
            if (q[32] !== $6) U8 = (Dz) => djq(Dz, $6), q[32] = $6, q[33] = U8;
            else U8 = q[33];
            q6 = pjq(h8.filter(EeY).filter(U8), N6);
            let P4 = [gjq, ZeY].filter(yeY),
                T4 = [gjq].filter(LeY),
                $4 = P4.length > 0 && !$6 ? g ? feY(q6, P4) : T4.length > 0 ? TeY(q6, T4) : q6 : q6,
                qA = i ? $4.slice(-Ic8) : $4;
            l = i && $4.length > Ic8;
            let {
                messages: d7
            } = pHq(qA, Y, _), W4 = dHq(kY4(d7, Y));
            w6 = !o && !B && W4.length > Fjq ? W4.slice(-Fjq) : W4, O6 = Qjq(U, qA), q[19] = B, q[20] = g, q[21] = $6, q[22] = U, q[23] = i, q[24] = N6, q[25] = Y, q[26] = _, q[27] = o, q[28] = l, q[29] = q6, q[30] = w6, q[31] = O6
        } else l = q[28], q6 = q[29], w6 = q[30], O6 = q[31];
        let L6 = O6,
            y6 = q6.length - Ic8,
            G6;
        if (q[34] !== l || q[35] !== y6 || q[36] !== L6 || q[37] !== w6) G6 = {
            renderableMessages: w6,
            lookups: L6,
            hasTruncatedMessages: l,
            hiddenMessageCount: y6
        }, q[34] = l, q[35] = y6, q[36] = L6, q[37] = w6, q[38] = G6;
        else G6 = q[38];
        let {
            renderableMessages: R6,
            lookups: T6,
            hasTruncatedMessages: D6,
            hiddenMessageCount: Q6
        } = G6, k6;
        if (q[39] !== M) k6 = new Set(M.map(ReY)), q[39] = M, q[40] = k6;
        else k6 = q[40];
        let Z6 = k6,
            u6;
        A: {
            if (!V) {
                u6 = -1;
                break A
            }
            let h8;
            if (q[41] !== V.firstUnseenUuid) h8 = V.firstUnseenUuid.slice(0, 24),
            q[41] = V.firstUnseenUuid,
            q[42] = h8;
            else h8 = q[42];
            let U8 = h8,
                P4;
            if (q[43] !== U8 || q[44] !== R6) {
                let T4;
                if (q[46] !== U8) T4 = ($4) => $4.uuid.slice(0, 24) === U8, q[46] = U8, q[47] = T4;
                else T4 = q[47];
                P4 = R6.findIndex(T4), q[43] = U8, q[44] = R6, q[45] = P4
            } else P4 = q[45];u6 = P4
        }
        let C6 = u6,
            o6 = (!w || !!w.shouldContinueAnimation) && !O.length && !H,
            V6 = $.size > 0,
            {
                progress: b6
            } = Vm(),
            E6 = Ar6.useRef(null),
            U6;
        if (q[48] === Symbol.for("react.memo_cache_sentinel")) U6 = X1().terminalProgressBarEnabled && !(WeY?.isProactiveActive() ?? !1), q[48] = U6;
        else U6 = q[48];
        let c6 = U6,
            K1, j6;
        if (q[49] !== V6 || q[50] !== b6) K1 = () => {
            let h8 = c6 ? V6 ? "indeterminate" : "completed" : null;
            if (E6.current === h8) return;
            E6.current = h8, b6(h8)
        }, j6 = [b6, c6, V6], q[49] = V6, q[50] = b6, q[51] = K1, q[52] = j6;
        else K1 = q[51], j6 = q[52];
        Ar6.useEffect(K1, j6);
        let W6, n6;
        if (q[53] !== b6) W6 = () => () => b6(null), n6 = [b6], q[53] = b6, q[54] = W6, q[55] = n6;
        else W6 = q[54], n6 = q[55];
        Ar6.useEffect(W6, n6);
        let d6;
        if (q[56] !== j) d6 = (h8) => `${h8.uuid}-${j}`, q[56] = j, q[57] = d6;
        else d6 = q[57];
        let S6 = d6,
            g6;
        if (q[58] !== o6 || q[59] !== b || q[60] !== z || q[61] !== C6 || q[62] !== $ || q[63] !== Z || q[64] !== H6 || q[65] !== K6 || q[66] !== T6 || q[67] !== S6 || q[68] !== P || q[69] !== R6 || q[70] !== J || q[71] !== Z6 || q[72] !== Y || q[73] !== V || q[74] !== _) g6 = (h8, U8) => {
            let P4 = U8 > 0 ? R6[U8 - 1]?.type : void 0,
                T4 = h8.type === "user" && P4 === "user",
                $4 = h8.type === "collapsed_read_search" && Ijq(R6, U8, Y, Z6),
                qA = r5.createElement(bjq, {
                    key: S6(h8),
                    message: h8,
                    isUserContinuation: T4,
                    hasContentAfter: $4,
                    tools: Y,
                    commands: z,
                    verbose: _,
                    inProgressToolUseIDs: $,
                    streamingToolUseIDs: Z6,
                    screen: J,
                    canAnimate: o6,
                    onOpenRateLimitOptions: P,
                    lastThinkingBlockId: H6,
                    latestBashOutputUUID: K6,
                    columns: b,
                    isLoading: Z,
                    lookups: T6
                });
            if (V && U8 === C6) return [r5.createElement(m, {
                key: "unseen-divider",
                marginTop: 1
            }, r5.createElement(DD, {
                title: `${V.count} new message${V.count===1?"":"s"}`,
                width: b,
                dividerColor: "inactive"
            })), qA];
            return qA
        }, q[58] = o6, q[59] = b, q[60] = z, q[61] = C6, q[62] = $, q[63] = Z, q[64] = H6, q[65] = K6, q[66] = T6, q[67] = S6, q[68] = P, q[69] = R6, q[70] = J, q[71] = Z6, q[72] = Y, q[73] = V, q[74] = _, q[75] = g6;
        else g6 = q[75];
        let D1 = g6,
            J1;
        if (q[76] !== X || q[77] !== u) J1 = !u && r5.createElement(PeY, {
            agentDefinitions: X
        }), q[76] = X, q[77] = u, q[78] = J1;
        else J1 = q[78];
        let E1;
        if (q[79] !== b || q[80] !== D6 || q[81] !== Q6 || q[82] !== p) E1 = D6 && r5.createElement(DD, {
            dividerChar: "─",
            title: `${p} to show ${O1.bold(Q6)} previous messages`,
            width: b
        }), q[79] = b, q[80] = D6, q[81] = Q6, q[82] = p, q[83] = E1;
        else E1 = q[83];
        let K8;
        if (q[84] !== b || q[85] !== Q6 || q[86] !== $6 || q[87] !== R || q[88] !== p) K8 = $6 && R && Q6 > 0 && r5.createElement(DD, {
            dividerChar: "─",
            title: `${p} to hide ${O1.bold(Q6)} previous messages`,
            width: b
        }), q[84] = b, q[85] = Q6, q[86] = $6, q[87] = R, q[88] = p, q[89] = K8;
        else K8 = q[89];
        let e8;
        if (q[90] !== S6 || q[91] !== D1 || q[92] !== R6 || q[93] !== L || q[94] !== o) e8 = R6.flatMap(D1), q[90] = S6, q[91] = D1, q[92] = R6, q[93] = L, q[94] = o, q[95] = e8;
        else e8 = q[95];
        let n8;
        if (q[96] !== g || q[97] !== v) n8 = v && !g && r5.createElement(m, {
            alignItems: "flex-start",
            flexDirection: "row",
            marginTop: 1,
            width: "100%"
        }, r5.createElement(m, {
            flexDirection: "row"
        }, r5.createElement(m, {
            minWidth: 2
        }, r5.createElement(T, {
            color: "text"
        }, I3)), r5.createElement(m, {
            flexDirection: "column"
        }, r5.createElement(U04, null, v)))), q[96] = g, q[97] = v, q[98] = n8;
        else n8 = q[98];
        let H7;
        if (q[99] !== g || q[100] !== e || q[101] !== f || q[102] !== _) H7 = e && f && !g && r5.createElement(m, {
            marginTop: 1
        }, r5.createElement(_N1, {
            param: {
                type: "thinking",
                thinking: f.thinking
            },
            addMargin: !1,
            isTranscriptMode: !0,
            verbose: _,
            hideInTranscript: !1
        })), q[99] = g, q[100] = e, q[101] = f, q[102] = _, q[103] = H7;
        else H7 = q[103];
        let GA;
        if (q[104] !== J1 || q[105] !== E1 || q[106] !== K8 || q[107] !== e8 || q[108] !== n8 || q[109] !== H7) GA = r5.createElement(r5.Fragment, null, J1, E1, K8, e8, n8, H7), q[104] = J1, q[105] = E1, q[106] = K8, q[107] = e8, q[108] = n8, q[109] = H7, q[110] = GA;
        else GA = q[110];
        return GA
    }
// @from(Ln 412383, Col 4)
G_6
// @from(Ln 412384, Col 4)
en6 = E(() => {
    e6();
    i6();
    JA();
    QHq();
    gB();
    nHq();
    _q();
    C16();
    aK();
    Ljq();
    Rx8();
    Rj();
    Hs();
    k8();
    xjq();
    qw();
    ov();
    A8();
    Tb();
    r5 = t(P6(), 1), Ar6 = t(P6(), 1), PeY = r5.memo(function(q) {
        let K = A6(3),
            {
                agentDefinitions: Y
            } = q,
            z;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = r5.createElement(yjq, null), K[0] = z;
        else z = K[0];
        let _;
        if (K[1] !== Y) _ = r5.createElement(m, {
            flexDirection: "column",
            gap: 1
        }, z, r5.createElement(iHq, {
            agentDefinitions: Y
        })), K[1] = Y, K[2] = _;
        else _ = K[2];
        return _
    }), gjq = (gu(), k4(UQ)).BRIEF_TOOL_NAME;
    G_6 = r5.memo(veY, (A, q) => {
        let K = Object.keys(A);
        for (let Y of K) {
            if (Y === "onOpenRateLimitOptions" || Y === "scrollRef") continue;
            if (A[Y] !== q[Y]) {
                if (Y === "streamingToolUses") {
                    let z = A.streamingToolUses,
                        _ = q.streamingToolUses;
                    if (z.length === _.length && z.every((w, O) => w.contentBlock === _[O]?.contentBlock)) continue
                }
                if (Y === "inProgressToolUseIDs") {
                    if (NeY(A.inProgressToolUseIDs, q.inProgressToolUseIDs)) continue
                }
                if (Y === "tools") {
                    let z = A.tools,
                        _ = q.tools;
                    if (z.length === _.length && z.every((w, O) => w.name === _[O]?.name)) continue
                }
                return !1
            }
        }
        return !0
    })
})
// @from(Ln 412447, Col 0)
function cjq(A) {
    let q = A6(33),
        {
            log: K,
            onExit: Y,
            onSelect: z
        } = A,
        [_, w] = n0.default.useState(null),
        [O, $] = n0.default.useState(!1),
        H, j;
    if (q[0] !== K) H = () => {
        if (Hh(K)) $(!0), hb(K).then((p) => {
            w(p), $(!1)
        });
        else w(K)
    }, j = [K], q[0] = K, q[1] = H, q[2] = j;
    else H = q[1], j = q[2];
    n0.default.useEffect(H, j);
    let J = _ ?? K,
        M;
    if (q[3] !== J) M = n_(J) || "", q[3] = J, q[4] = M;
    else M = q[4];
    let D = M,
        X;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) X = ng(), q[5] = X;
    else X = q[5];
    let P = X,
        W;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) W = {
        context: "Confirmation"
    }, q[6] = W;
    else W = q[6];
    D8("confirm:no", Y, W);
    let Z;
    if (q[7] !== _ || q[8] !== K || q[9] !== z) Z = () => {
        z(_ ?? K)
    }, q[7] = _, q[8] = K, q[9] = z, q[10] = Z;
    else Z = q[10];
    let G = Z,
        f;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) f = {
        context: "Confirmation"
    }, q[11] = f;
    else f = q[11];
    if (D8("confirm:yes", G, f), O) {
        let p;
        if (q[12] === Symbol.for("react.memo_cache_sentinel")) p = n0.default.createElement(Ul, {
            message: "Loading session…"
        }), q[12] = p;
        else p = q[12];
        let Q;
        if (q[13] === Symbol.for("react.memo_cache_sentinel")) Q = n0.default.createElement(m, {
            flexDirection: "column",
            padding: 1
        }, p, n0.default.createElement(T, {
            dimColor: !0
        }, n0.default.createElement(C8, null, n0.default.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        })))), q[13] = Q;
        else Q = q[13];
        return Q
    }
    let v;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) v = [], q[14] = v;
    else v = q[14];
    let N, V;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) V = [], N = new Set, q[15] = N, q[16] = V;
    else N = q[15], V = q[16];
    let L;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) L = [], q[17] = L;
    else L = q[17];
    let h;
    if (q[18] !== D || q[19] !== J.messages) h = n0.default.createElement(G_6, {
        messages: J.messages,
        tools: P,
        commands: v,
        verbose: !0,
        toolJSX: null,
        toolUseConfirmQueue: V,
        inProgressToolUseIDs: N,
        isMessageSelectorVisible: !1,
        conversationId: D,
        screen: "transcript",
        streamingToolUses: L,
        showAllInTranscript: !0,
        isLoading: !1
    }), q[18] = D, q[19] = J.messages, q[20] = h;
    else h = q[20];
    let R;
    if (q[21] !== J.modified) R = Q46(J.modified), q[21] = J.modified, q[22] = R;
    else R = q[22];
    let u = J.gitBranch ? ` · ${J.gitBranch}` : "",
        I;
    if (q[23] !== J.messageCount || q[24] !== R || q[25] !== u) I = n0.default.createElement(T, null, R, " ·", " ", J.messageCount, " messages", u), q[23] = J.messageCount, q[24] = R, q[25] = u, q[26] = I;
    else I = q[26];
    let g;
    if (q[27] === Symbol.for("react.memo_cache_sentinel")) g = n0.default.createElement(T, {
        dimColor: !0
    }, n0.default.createElement(C8, null, n0.default.createElement(a1, {
        shortcut: "Enter",
        action: "resume"
    }), n0.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))), q[27] = g;
    else g = q[27];
    let B;
    if (q[28] !== I) B = n0.default.createElement(m, {
        flexShrink: 0,
        flexDirection: "column",
        borderTopDimColor: !0,
        borderBottom: !1,
        borderLeft: !1,
        borderRight: !1,
        borderStyle: "single",
        paddingLeft: 2
    }, I, g), q[28] = I, q[29] = B;
    else B = q[29];
    let b;
    if (q[30] !== h || q[31] !== B) b = n0.default.createElement(m, {
        flexDirection: "column"
    }, h, B), q[30] = h, q[31] = B, q[32] = b;
    else b = q[32];
    return b
}
// @from(Ln 412577, Col 4)
n0
// @from(Ln 412578, Col 4)
ljq = E(() => {
    e6();
    i6();
    M4();
    en6();
    IX();
    Lq();
    OK();
    Xq();
    Zv6();
    Oq();
    _7();
    n0 = t(P6(), 1)
})
// @from(Ln 412593, Col 0)
function IeY(A, q) {
    if (A === bc8) return bc8.length + Kr6;
    let K = f8(A),
        Y = q ? Math.min(K, q - Kr6 - xc8) : K;
    return Math.max(0, Y) + Kr6 + xc8
}
// @from(Ln 412600, Col 0)
function beY(A, q) {
    let K = q - Kr6 - xc8;
    if (f8(A) <= K) return A;
    if (K <= 1) return A.charAt(0);
    return jq(A, K)
}
// @from(Ln 412607, Col 0)
function sjq({
    tabs: A,
    selectedIndex: q,
    availableWidth: K,
    showAllProjects: Y = !1
}) {
    let z = Y ? "Resume (All Projects)" : "Resume",
        _ = z.length + 1,
        w = Math.max(SeY, CeY),
        O = K - _ - w - 2,
        $ = Math.max(0, Math.min(q, A.length - 1)),
        H = Math.max(20, Math.floor(O / 2)),
        j = A.map((G) => IeY(G, H)),
        J = 0,
        M = A.length;
    if (j.reduce((G, f, v) => G + f + (v < j.length - 1 ? 1 : 0), 0) > O) {
        let G = O - heY,
            f = j[$] ?? 0;
        J = $, M = $ + 1;
        while (J > 0 || M < A.length) {
            let v = J > 0,
                N = M < A.length;
            if (v) {
                let V = (j[J - 1] ?? 0) + 1;
                if (f + V <= G) {
                    J--, f += V;
                    continue
                }
            }
            if (N) {
                let V = (j[M] ?? 0) + 1;
                if (f + V <= G) {
                    M++, f += V;
                    continue
                }
            }
            break
        }
    }
    let X = J,
        P = A.length - M,
        W = A.slice(J, M),
        Z = W.map((G, f) => J + f);
    return f_6.default.createElement(m, {
        flexDirection: "row",
        gap: 1
    }, f_6.default.createElement(T, {
        color: "suggestion"
    }, z), X > 0 && f_6.default.createElement(T, {
        dimColor: !0
    }, ijq, X), W.map((G, f) => {
        let N = Z[f] === $,
            V = G === bc8 ? G : `#${beY(G,H-Kr6)}`;
        return f_6.default.createElement(T, {
            key: G,
            backgroundColor: N ? "suggestion" : void 0,
            color: N ? "inverseText" : void 0,
            bold: N
        }, " ", V, " ")
    }), P > 0 ? f_6.default.createElement(T, {
        dimColor: !0
    }, njq, P, rjq) : f_6.default.createElement(T, {
        dimColor: !0
    }, ojq))
}
// @from(Ln 412672, Col 4)
f_6
// @from(Ln 412672, Col 9)
bc8 = "All"
// @from(Ln 412673, Col 4)
Kr6 = 2
// @from(Ln 412674, Col 4)
xc8 = 1
// @from(Ln 412675, Col 4)
ijq = "← "
// @from(Ln 412676, Col 4)
njq = "→"
// @from(Ln 412677, Col 4)
rjq = " (tab to cycle)"
// @from(Ln 412678, Col 4)
ojq = "(tab to cycle)"
// @from(Ln 412679, Col 4)
ajq = 2
// @from(Ln 412680, Col 4)
heY
// @from(Ln 412680, Col 9)
SeY
// @from(Ln 412680, Col 14)
CeY
// @from(Ln 412681, Col 4)
tjq = E(() => {
    i6();
    q3();
    M4();
    f_6 = t(P6(), 1), heY = ijq.length + ajq + 1, SeY = njq.length + ajq + rjq.length, CeY = ojq.length
})
// @from(Ln 412688, Col 0)
function qJq(A, q) {
    let K = A.replace(/\s+/g, " ").trim();
    return jq(K, q)
}
// @from(Ln 412693, Col 0)
function uc8({
    before: A,
    match: q,
    after: K
}, Y) {
    return O1.dim(A) + Y(q) + O1.dim(K)
}
// @from(Ln 412701, Col 0)
function FeY(A, q, K) {
    let Y = A.toLowerCase().indexOf(q.toLowerCase());
    if (Y === -1) return null;
    let z = Y + q.length,
        _ = Math.max(0, Y - K),
        w = Math.min(A.length, z + K),
        O = A.slice(_, Y),
        $ = A.slice(Y, z),
        H = A.slice(z, w);
    return {
        before: (_ > 0 ? "…" : "") + O.replace(/\s+/g, " ").trimStart(),
        match: $.trim(),
        after: H.replace(/\s+/g, " ").trimEnd() + (w < A.length ? "…" : "")
    }
}
// @from(Ln 412717, Col 0)
function mc8(A, q, K) {
    let {
        isGroupHeader: Y = !1,
        isChild: z = !1,
        forkCount: _ = 0
    } = K || {}, w = Y && _ > 0 ? xeY : z ? ueY : 0, O = Y && _ > 0 ? ` (+${_} other ${_===1?"session":"sessions"})` : "", $ = A.isSidechain ? " (sidechain)" : "", H = q - w - $.length - O.length;
    return `${qJq(zr(A),H)}${$}${O}`
}
// @from(Ln 412726, Col 0)
function Bc8(A, q) {
    let {
        isChild: K = !1,
        showProjectPath: Y = !1
    } = q || {}, z = K ? "    " : "", _ = iC6(A), w = Y && A.projectPath ? ` · ${A.projectPath}` : "";
    return z + _ + w
}
// @from(Ln 412734, Col 0)
function TR1(A) {
    let q = A6(255),
        {
            logs: K,
            maxHeight: Y,
            forceWidth: z,
            onCancel: _,
            onSelect: w,
            onLogsChanged: O,
            onLoadMore: $,
            initialSearchQuery: H,
            showAllProjects: j,
            onToggleAllProjects: J,
            onAgenticSearch: M
        } = A,
        D = Y === void 0 ? 1 / 0 : Y,
        X = j === void 0 ? !1 : j,
        P = KA(),
        W = z === void 0 ? P.columns : z,
        Z = IK(_),
        G = p_(),
        f;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) f = Ki(), q[0] = f;
    else f = q[0];
    let v = f,
        N = !1,
        [V] = z7(),
        L;
    if (q[1] !== V) L = QW(V), q[1] = V, q[2] = L;
    else L = q[2];
    let h = L,
        R;
    if (q[3] !== h.warning) R = (d8) => CU(d8, h.warning), q[3] = h.warning, q[4] = R;
    else R = q[4];
    let u = R,
        I = !1,
        [g, B] = eA.default.useState(null),
        [b, p] = eA.default.useState(!1),
        [Q, U] = eA.default.useState(!1),
        [r, e] = eA.default.useState(!1),
        Y6;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) Y6 = AA(), q[5] = Y6;
    else Y6 = q[5];
    let H6 = Y6,
        [J6, K6] = eA.default.useState(""),
        [s, X6] = eA.default.useState(0),
        z6;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) z6 = new Set, q[6] = z6;
    else z6 = q[6];
    let [N6, $6] = eA.default.useState(z6), [n, o] = eA.default.useState(null), [a, i] = eA.default.useState(1), [l, q6] = eA.default.useState("list"), [w6, O6] = eA.default.useState(null), L6 = eA.default.useRef(null), [y6, G6] = eA.default.useState(0), R6;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) R6 = {
        status: "idle"
    }, q[7] = R6;
    else R6 = q[7];
    let [T6, D6] = eA.default.useState(R6), [Q6, k6] = eA.default.useState(!1), Z6 = eA.default.useRef(null), u6 = l === "search" && T6.status !== "searching", C6, o6, V6;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) C6 = () => {
        q6("list"), d("tengu_session_search_toggled", {
            enabled: !1
        })
    }, o6 = () => {
        q6("list"), d("tengu_session_search_toggled", {
            enabled: !1
        })
    }, V6 = ["n"], q[8] = C6, q[9] = o6, q[10] = V6;
    else C6 = q[8], o6 = q[9], V6 = q[10];
    let b6 = H || "",
        E6;
    if (q[11] !== b6 || q[12] !== u6) E6 = {
        isActive: u6,
        onExit: C6,
        onExitUp: o6,
        passthroughCtrlKeys: V6,
        initialQuery: b6
    }, q[11] = b6, q[12] = u6, q[13] = E6;
    else E6 = q[13];
    let {
        query: U6,
        setQuery: c6,
        cursorOffset: K1
    } = Th(E6), j6 = eA.default.useDeferredValue(U6), [W6, n6] = eA.default.useState(""), d6, S6;
    if (q[14] !== j6) d6 = () => {
        if (!j6) {
            n6("");
            return
        }
        let d8 = setTimeout(n6, 300, j6);
        return () => clearTimeout(d8)
    }, S6 = [j6], q[14] = j6, q[15] = d6, q[16] = S6;
    else d6 = q[15], S6 = q[16];
    eA.default.useEffect(d6, S6);
    let [g6, D1] = eA.default.useState(null), [J1, E1] = eA.default.useState(!1), K8, e8;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) K8 = () => {
        kj().then((d8) => B(d8)), al(H6).then((d8) => {
            e(d8.length > 1)
        })
    }, e8 = [H6], q[17] = K8, q[18] = e8;
    else K8 = q[17], e8 = q[18];
    eA.default.useEffect(K8, e8);
    let n8 = new Map(K.map(ieY)),
        H7;
    H7 = null;
    let GA;
    if (q[19] !== K) GA = aeY(K), q[19] = K, q[20] = GA;
    else GA = q[20];
    let h8 = GA,
        U8 = h8.length > 0,
        P4;
    if (q[21] !== U8 || q[22] !== h8) P4 = U8 ? ["All", ...h8] : [], q[21] = U8, q[22] = h8, q[23] = P4;
    else P4 = q[23];
    let T4 = P4,
        $4, qA;
    if (q[24] !== y6 || q[25] !== T4.length) $4 = () => {
        if (T4.length > 0 && y6 >= T4.length) G6(0)
    }, qA = [T4.length, y6], q[24] = y6, q[25] = T4.length, q[26] = $4, q[27] = qA;
    else $4 = q[26], qA = q[27];
    eA.default.useEffect($4, qA);
    let d7 = T4[y6],
        W4 = d7 === "All" ? void 0 : d7,
        Dz = U8 ? 1 : 0,
        JK = K;
    if (v) {
        let d8;
        if (q[28] !== K) d8 = K.filter(leY), q[28] = K, q[29] = d8;
        else d8 = q[29];
        JK = d8
    }
    if (W4 !== void 0) {
        let d8;
        if (q[30] !== JK || q[31] !== W4) {
            let VA;
            if (q[33] !== W4) VA = (n4) => n4.tag === W4, q[33] = W4, q[34] = VA;
            else VA = q[34];
            d8 = JK.filter(VA), q[30] = JK, q[31] = W4, q[32] = d8
        } else d8 = q[32];
        JK = d8
    }
    if (b && g) {
        let d8;
        if (q[35] !== g || q[36] !== JK) {
            let VA;
            if (q[38] !== g) VA = (n4) => n4.gitBranch === g, q[38] = g, q[39] = VA;
            else VA = q[39];
            d8 = JK.filter(VA), q[35] = g, q[36] = JK, q[37] = d8
        } else d8 = q[37];
        JK = d8
    }
    if (r && !Q) {
        let d8;
        if (q[40] !== JK) {
            let VA;
            if (q[42] === Symbol.for("react.memo_cache_sentinel")) VA = (n4) => n4.projectPath === H6, q[42] = VA;
            else VA = q[42];
            d8 = JK.filter(VA), q[40] = JK, q[41] = d8
        } else d8 = q[41];
        JK = d8
    }
    let F3 = JK,
        MK;
    A: {
        if (!U6) {
            MK = F3;
            break A
        }
        let d8;
        if (q[43] !== F3 || q[44] !== U6) {
            let VA = U6.toLowerCase();
            d8 = F3.filter((n4) => {
                let iK = zr(n4).toLowerCase(),
                    Uq = (n4.gitBranch || "").toLowerCase(),
                    bz = (n4.tag || "").toLowerCase(),
                    m9 = n4.prNumber ? `pr #${n4.prNumber} ${n4.prRepository||""}`.toLowerCase() : "";
                return iK.includes(VA) || Uq.includes(VA) || bz.includes(VA) || m9.includes(VA)
            }), q[43] = F3, q[44] = U6, q[45] = d8
        } else d8 = q[45];MK = d8
    }
    let k3 = MK,
        M5, x5;
    if (q[46] !== W6 || q[47] !== j6) M5 = () => {}, x5 = [j6, W6, !1], q[46] = W6, q[47] = j6, q[48] = M5, q[49] = x5;
    else M5 = q[48], x5 = q[49];
    eA.default.useEffect(M5, x5);
    let E2, tz;
    if (q[50] !== W6) E2 = () => {
        D1(null), E1(!1);
        return
    }, tz = [W6, null, !1], q[50] = W6, q[51] = E2, q[52] = tz;
    else E2 = q[51], tz = q[52];
    eA.default.useEffect(E2, tz);
    let x9, J9;
    if (q[53] !== W6 || q[54] !== g6 || q[55] !== k3) {
        if (J9 = new Map, x9 = k3, g6 && W6 && g6.query === W6) {
            for (let iK of g6.results)
                if (iK.searchableText) {
                    let Uq = FeY(iK.searchableText, W6, geY);
                    if (Uq) J9.set(iK.log, Uq)
                } let d8;
            if (q[58] !== x9) d8 = new Set(x9.map(QeY)), q[58] = x9, q[59] = d8;
            else d8 = q[59];
            let VA = d8,
                n4;
            if (q[60] !== g6.results || q[61] !== x9 || q[62] !== VA) {
                let iK;
                if (q[64] !== VA) iK = (bz) => !VA.has(bz.messages[0]?.uuid), q[64] = VA, q[65] = iK;
                else iK = q[65];
                let Uq = g6.results.map(peY).filter(iK);
                n4 = [...x9, ...Uq], q[60] = g6.results, q[61] = x9, q[62] = VA, q[63] = n4
            } else n4 = q[63];
            x9 = n4
        }
        q[53] = W6, q[54] = g6, q[55] = k3, q[56] = x9, q[57] = J9
    } else x9 = q[56], J9 = q[57];
    let sw;
    if (q[66] !== x9 || q[67] !== J9) sw = {
        filteredLogs: x9,
        snippets: J9
    }, q[66] = x9, q[67] = J9, q[68] = sw;
    else sw = q[68];
    let {
        filteredLogs: UY,
        snippets: dY
    } = sw, Bq;
    A: {
        if (T6.status === "results" && T6.results.length > 0) {
            Bq = T6.results;
            break A
        }
        Bq = UY
    }
    let YA = Bq,
        E3 = Math.max(30, W - 4),
        u9;
    A: {
        if (!v) {
            let VA;
            if (q[69] === Symbol.for("react.memo_cache_sentinel")) VA = [], q[69] = VA;
            else VA = q[69];
            u9 = VA;
            break A
        }
        let d8;
        if (q[70] !== YA || q[71] !== u || q[72] !== E3 || q[73] !== X || q[74] !== dY) {
            let VA = oeY(YA);
            d8 = Array.from(VA.entries()).map((n4) => {
                let [iK, Uq] = n4, bz = Uq[0], m9 = YA.indexOf(bz), C7 = dY.get(bz), B5 = C7 ? uc8(C7, u) : null;
                if (Uq.length === 1) {
                    let GH = Bc8(bz, {
                        showProjectPath: X
                    });
                    return {
                        id: `log:${iK}:0`,
                        value: {
                            log: bz,
                            indexInFiltered: m9
                        },
                        label: mc8(bz, E3),
                        description: B5 ? `${GH}
  ${B5}` : GH,
                        dimDescription: !0
                    }
                }
                let p3 = Uq.length - 1,
                    R2 = Uq.slice(1).map((GH, mO) => {
                        let GD = YA.indexOf(GH),
                            fM = dY.get(GH),
                            ez = fM ? uc8(fM, u) : null,
                            fD = Bc8(GH, {
                                isChild: !0,
                                showProjectPath: X
                            });
                        return {
                            id: `log:${iK}:${mO+1}`,
                            value: {
                                log: GH,
                                indexInFiltered: GD
                            },
                            label: mc8(GH, E3, {
                                isChild: !0
                            }),
                            description: ez ? `${fD}
      ${ez}` : fD,
                            dimDescription: !0
                        }
                    }),
                    Xj = Bc8(bz, {
                        showProjectPath: X
                    });
                return {
                    id: `group:${iK}`,
                    value: {
                        log: bz,
                        indexInFiltered: m9
                    },
                    label: mc8(bz, E3, {
                        isGroupHeader: !0,
                        forkCount: p3
                    }),
                    description: B5 ? `${Xj}
  ${B5}` : Xj,
                    dimDescription: !0,
                    children: R2
                }
            }), q[70] = YA, q[71] = u, q[72] = E3, q[73] = X, q[74] = dY, q[75] = d8
        } else d8 = q[75];u9 = d8
    }
    let u5 = u9,
        KK;
    A: {
        if (v) {
            let VA;
            if (q[76] === Symbol.for("react.memo_cache_sentinel")) VA = [], q[76] = VA;
            else VA = q[76];
            KK = VA;
            break A
        }
        let d8;
        if (q[77] !== YA || q[78] !== u || q[79] !== E3 || q[80] !== X || q[81] !== dY) {
            let VA;
            if (q[83] !== u || q[84] !== E3 || q[85] !== X || q[86] !== dY) VA = (n4, iK) => {
                let bz = zr(n4) + (n4.isSidechain ? " (sidechain)" : ""),
                    m9 = qJq(bz, E3),
                    C7 = iC6(n4),
                    B5 = X && n4.projectPath ? ` · ${n4.projectPath}` : "",
                    p3 = dY.get(n4),
                    R2 = p3 ? uc8(p3, u) : null;
                return {
                    label: m9,
                    description: R2 ? `${C7}${B5}
  ${R2}` : C7 + B5,
                    dimDescription: !0,
                    value: iK.toString()
                }
            }, q[83] = u, q[84] = E3, q[85] = X, q[86] = dY, q[87] = VA;
            else VA = q[87];
            d8 = YA.map(VA), q[77] = YA, q[78] = u, q[79] = E3, q[80] = X, q[81] = dY, q[82] = d8
        } else d8 = q[82];KK = d8
    }
    let cY = KK,
        B4 = n?.value.log ?? null,
        lY;
    if (q[88] !== YA || q[89] !== N6 || q[90] !== B4) lY = () => {
        if (!v || !B4) return "";
        let d8 = n_(B4);
        if (!d8) return "";
        let VA = YA.filter((bz) => n_(bz) === d8);
        if (!(VA.length > 1)) return "";
        let iK = N6.has(d8);
        if (VA.indexOf(B4) > 0) return "← to collapse";
        return iK ? "← to collapse" : "→ to expand"
    }, q[88] = YA, q[89] = N6, q[90] = B4, q[91] = lY;
    else lY = q[91];
    let e3 = lY,
        D5;
    if (q[92] !== B4 || q[93] !== O || q[94] !== J6) D5 = async () => {
        let d8 = B4 ? n_(B4) : void 0;
        if (!B4 || !d8) {
            q6("list"), K6("");
            return
        }
        if (J6.trim()) {
            if (await X_6(d8, J6.trim(), B4.fullPath), v && O) O()
        }
        q6("list"), K6("")
    }, q[92] = B4, q[93] = O, q[94] = J6, q[95] = D5;
    else D5 = q[95];
    let WY = D5,
        y2;
    if (q[96] === Symbol.for("react.memo_cache_sentinel")) y2 = () => {
        q6("list"), d("tengu_session_search_toggled", {
            enabled: !1
        })
    }, q[96] = y2;
    else y2 = q[96];
    let s6 = y2,
        A1;
    if (q[97] === Symbol.for("react.memo_cache_sentinel")) A1 = () => {
        q6("search"), d("tengu_session_search_toggled", {
            enabled: !0
        })
    }, q[97] = A1;
    else A1 = q[97];
    let f1 = A1,
        h1;
    if (q[98] !== K || q[99] !== M || q[100] !== U6) h1 = async () => {
        U6.trim();
        return
    }, q[98] = K, q[99] = M, q[100] = U6, q[101] = h1;
    else h1 = q[101];
    let u1 = h1,
        j8;
    if (q[102] !== T6.query || q[103] !== T6.status || q[104] !== U6) j8 = () => {
        if (T6.status !== "idle" && T6.status !== "searching") {
            if (T6.status === "results" && T6.query !== U6 || T6.status === "error") D6({
                status: "idle"
            })
        }
    }, q[102] = T6.query, q[103] = T6.status, q[104] = U6, q[105] = j8;
    else j8 = q[105];
    let l8;
    if (q[106] !== T6 || q[107] !== U6) l8 = [U6, T6], q[106] = T6, q[107] = U6, q[108] = l8;
    else l8 = q[108];
    eA.default.useEffect(j8, l8);
    let p8, o8;
    if (q[109] === Symbol.for("react.memo_cache_sentinel")) p8 = () => () => {
        Z6.current?.abort()
    }, o8 = [], q[109] = p8, q[110] = o8;
    else p8 = q[109], o8 = q[110];
    eA.default.useEffect(p8, o8);
    let a8 = eA.default.useRef(T6.status),
        $A;
    if (q[111] !== T6.status || q[112] !== YA[0] || q[113] !== YA.length || q[114] !== u5) $A = () => {
        let d8 = a8.current;
        if (a8.current = T6.status, d8 === "searching" && T6.status === "results") {
            if (v && u5.length > 0) o(u5[0]);
            else if (!v && YA.length > 0) {
                let VA = YA[0];
                o({
                    id: "0",
                    value: {
                        log: VA,
                        indexInFiltered: 0
                    },
                    label: ""
                })
            }
        }
    }, q[111] = T6.status, q[112] = YA[0], q[113] = YA.length, q[114] = u5, q[115] = $A;
    else $A = q[115];
    let G7;
    if (q[116] !== T6.status || q[117] !== YA || q[118] !== u5) G7 = [T6.status, v, u5, YA], q[116] = T6.status, q[117] = YA, q[118] = u5, q[119] = G7;
    else G7 = q[119];
    eA.default.useEffect($A, G7);
    let Q1;
    if (q[120] !== YA) Q1 = (d8) => {
        let VA = parseInt(d8, 10),
            n4 = YA[VA];
        if (!n4 || L6.current === VA.toString()) return;
        L6.current = VA.toString(), o({
            id: VA.toString(),
            value: {
                log: n4,
                indexInFiltered: VA
            },
            label: ""
        }), i(VA + 1)
    }, q[120] = YA, q[121] = Q1;
    else Q1 = q[121];
    let zA = Q1,
        gA;
    if (q[122] !== YA) gA = (d8) => {
        o(d8);
        let VA = YA.findIndex((n4) => n_(n4) === n_(d8.value.log));
        if (VA >= 0) i(VA + 1)
    }, q[122] = YA, q[123] = gA;
    else gA = q[123];
    let k7 = gA,
        Q4;
    if (q[124] === Symbol.for("react.memo_cache_sentinel")) Q4 = () => {
        Z6.current?.abort(), D6({
            status: "idle"
        }), d("tengu_agentic_search_cancelled", {})
    }, q[124] = Q4;
    else Q4 = q[124];
    let X5 = l !== "preview" && T6.status === "searching",
        sq;
    if (q[125] !== X5) sq = {
        context: "Confirmation",
        isActive: X5
    }, q[125] = X5, q[126] = sq;
    else sq = q[126];
    D8("confirm:no", Q4, sq);
    let g4;
    if (q[127] === Symbol.for("react.memo_cache_sentinel")) g4 = () => {
        q6("list"), K6("")
    }, q[127] = g4;
    else g4 = q[127];
    let v4 = l === "rename" && T6.status !== "searching",
        Cq;
    if (q[128] !== v4) Cq = {
        context: "Settings",
        isActive: v4
    }, q[128] = v4, q[129] = Cq;
    else Cq = q[129];
    D8("confirm:no", g4, Cq);
    let E5;
    if (q[130] !== _ || q[131] !== c6) E5 = () => {
        c6(""), k6(!1), _?.()
    }, q[130] = _, q[131] = c6, q[132] = E5;
    else E5 = q[132];
    let hK = l !== "preview" && l !== "rename" && l !== "search" && Q6 && T6.status !== "searching",
        j3;
    if (q[133] !== hK) j3 = {
        context: "Confirmation",
        isActive: hK
    }, q[133] = hK, q[134] = j3;
    else j3 = q[134];
    D8("confirm:no", E5, j3);
    let A9;
    if (q[135] !== T6.status || q[136] !== b || q[137] !== B4 || q[138] !== u1 || q[139] !== r || q[140] !== U8 || q[141] !== Q6 || q[142] !== M || q[143] !== J || q[144] !== U6 || q[145] !== c6 || q[146] !== X || q[147] !== Q || q[148] !== T4 || q[149] !== h8 || q[150] !== l) A9 = (d8, VA) => {
        if (l === "preview") return;
        if (T6.status === "searching") return;
        if (l === "rename");
        else if (l === "search") {
            if (d8.toLowerCase() === "n" && VA.ctrl) s6();
            else if (VA.return || VA.downArrow) U6.trim()
        } else {
            if (Q6) {
                if (VA.return) {
                    u1(), k6(!1);
                    return
                } else if (VA.downArrow) {
                    k6(!1);
                    return
                } else if (VA.upArrow) {
                    q6("search"), k6(!1);
                    return
                }
            }
            if (U8 && VA.tab) {
                let Uq = VA.shift ? -1 : 1;
                G6((bz) => {
                    let m9 = (bz + T4.length + Uq) % T4.length,
                        C7 = T4[m9];
                    return d("tengu_session_tag_filter_changed", {
                        is_all: C7 === "All",
                        tag_count: h8.length
                    }), m9
                });
                return
            }
            let n4 = !VA.ctrl && !VA.meta,
                iK = d8.toLowerCase();
            if (iK === "a" && VA.ctrl && J) J(), d("tengu_session_all_projects_toggled", {
                enabled: !X
            });
            else if (iK === "b" && VA.ctrl) {
                let Uq = !b;
                p(Uq), d("tengu_session_branch_filter_toggled", {
                    enabled: Uq
                })
            } else if (iK === "w" && VA.ctrl && r) {
                let Uq = !Q;
                U(Uq), d("tengu_session_worktree_filter_toggled", {
                    enabled: Uq
                })
            } else if (iK === "/" && n4) q6("search"), d("tengu_session_search_toggled", {
                enabled: !0
            });
            else if (iK === "r" && VA.ctrl && B4) q6("rename"), K6(""), d("tengu_session_rename_started", {});
            else if (iK === "v" && VA.ctrl && B4) O6(B4), q6("preview"), d("tengu_session_preview_opened", {
                messageCount: B4.messageCount
            });
            else if (B4 && n4 && d8.length > 0 && !/^\s+$/.test(d8)) q6("search"), c6(d8), d("tengu_session_search_toggled", {
                enabled: !0
            })
        }
    }, q[135] = T6.status, q[136] = b, q[137] = B4, q[138] = u1, q[139] = r, q[140] = U8, q[141] = Q6, q[142] = M, q[143] = J, q[144] = U6, q[145] = c6, q[146] = X, q[147] = Q, q[148] = T4, q[149] = h8, q[150] = l, q[151] = A9;
    else A9 = q[151];
    let u7;
    if (q[152] === Symbol.for("react.memo_cache_sentinel")) u7 = {
        isActive: !0
    }, q[152] = u7;
    else u7 = q[152];
    jA(A9, u7);
    let Xz;
    if (q[153] !== b || q[154] !== g || q[155] !== r || q[156] !== Q) {
        if (Xz = [], b && g) Xz.push(g);
        if (r && !Q) Xz.push("current worktree");
        q[153] = b, q[154] = g, q[155] = r, q[156] = Q, q[157] = Xz
    } else Xz = q[157];
    let gq = 8 + (Xz.length > 0 && l !== "search" ? 1 : 0) + Dz,
        Pz = Math.max(1, Math.floor((D - gq - 2) / 3)),
        L2, AP;
    if (q[158] !== YA.length || q[159] !== a || q[160] !== $ || q[161] !== Pz) L2 = () => {
        if (!$) return;
        let d8 = Pz * 2;
        if (a + d8 >= YA.length) $(Pz * 3)
    }, AP = [a, Pz, YA.length, $], q[158] = YA.length, q[159] = a, q[160] = $, q[161] = Pz, q[162] = L2, q[163] = AP;
    else L2 = q[162], AP = q[163];
    if (eA.default.useEffect(L2, AP), K.length === 0) return null;
    if (l === "preview" && w6 && v) {
        let d8;
        if (q[164] === Symbol.for("react.memo_cache_sentinel")) d8 = () => {
            q6("list"), O6(null)
        }, q[164] = d8;
        else d8 = q[164];
        let VA;
        if (q[165] !== w || q[166] !== w6) VA = eA.default.createElement(cjq, {
            log: w6,
            onExit: d8,
            onSelect: w
        }), q[165] = w, q[166] = w6, q[167] = VA;
        else VA = q[167];
        return VA
    }
    let A2 = D - 1,
        Mj;
    if (q[168] !== W) Mj = "─".repeat(W), q[168] = W, q[169] = Mj;
    else Mj = q[169];
    let q2;
    if (q[170] !== Mj) q2 = eA.default.createElement(m, {
        flexShrink: 0
    }, eA.default.createElement(T, {
        color: "suggestion"
    }, Mj)), q[170] = Mj, q[171] = q2;
    else q2 = q[171];
    let Mq;
    if (q[172] === Symbol.for("react.memo_cache_sentinel")) Mq = eA.default.createElement(m, {
        flexShrink: 0
    }, eA.default.createElement(T, null, " ")), q[172] = Mq;
    else Mq = q[172];
    let xO;
    if (q[173] !== W || q[174] !== YA.length || q[175] !== a || q[176] !== U8 || q[177] !== y6 || q[178] !== X || q[179] !== T4 || q[180] !== l || q[181] !== Pz) xO = U8 ? eA.default.createElement(sjq, {
        tabs: T4,
        selectedIndex: y6,
        availableWidth: W,
        showAllProjects: X
    }) : eA.default.createElement(m, {
        flexShrink: 0
    }, eA.default.createElement(T, {
        bold: !0,
        color: "suggestion"
    }, "Resume Session", l === "list" && YA.length > Pz && eA.default.createElement(T, {
        dimColor: !0
    }, " ", "(", a, " of ", YA.length, ")"))), q[173] = W, q[174] = YA.length, q[175] = a, q[176] = U8, q[177] = y6, q[178] = X, q[179] = T4, q[180] = l, q[181] = Pz, q[182] = xO;
    else xO = q[182];
    let E$ = l === "search",
        tw;
    if (q[183] !== G || q[184] !== K1 || q[185] !== U6 || q[186] !== E$) tw = eA.default.createElement(fh, {
        query: U6,
        isFocused: E$,
        isTerminalFocused: G,
        cursorOffset: K1
    }), q[183] = G, q[184] = K1, q[185] = U6, q[186] = E$, q[187] = tw;
    else tw = q[187];
    let uO;
    if (q[188] !== Xz || q[189] !== l) uO = Xz.length > 0 && l !== "search" && eA.default.createElement(m, {
        flexShrink: 0,
        paddingLeft: 2
    }, eA.default.createElement(T, {
        dimColor: !0
    }, eA.default.createElement(C8, null, Xz))), q[188] = Xz, q[189] = l, q[190] = uO;
    else uO = q[190];
    let HJ;
    if (q[191] === Symbol.for("react.memo_cache_sentinel")) HJ = eA.default.createElement(m, {
        flexShrink: 0
    }, eA.default.createElement(T, null, " ")), q[191] = HJ;
    else HJ = q[191];
    let m5;
    if (q[192] !== T6.status) m5 = T6.status === "searching" && eA.default.createElement(m, {
        paddingLeft: 1,
        flexShrink: 0
    }, eA.default.createElement(Wq, null), eA.default.createElement(T, null, " Searching…")), q[192] = T6.status, q[193] = m5;
    else m5 = q[193];
    let ew;
    if (q[194] !== T6.results || q[195] !== T6.status) ew = T6.status === "results" && T6.results.length > 0 && eA.default.createElement(m, {
        paddingLeft: 1,
        marginBottom: 1,
        flexShrink: 0
    }, eA.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "Claude found these results:")), q[194] = T6.results, q[195] = T6.status, q[196] = ew;
    else ew = q[196];
    let WH;
    if (q[197] !== T6.results || q[198] !== T6.status || q[199] !== UY) WH = T6.status === "results" && T6.results.length === 0 && UY.length === 0 && eA.default.createElement(m, {
        paddingLeft: 1,
        marginBottom: 1,
        flexShrink: 0
    }, eA.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "No matching sessions found.")), q[197] = T6.results, q[198] = T6.status, q[199] = UY, q[200] = WH;
    else WH = q[200];
    let Dj;
    if (q[201] !== T6.status || q[202] !== UY) Dj = T6.status === "error" && UY.length === 0 && eA.default.createElement(m, {
        paddingLeft: 1,
        marginBottom: 1,
        flexShrink: 0
    }, eA.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "No matching sessions found.")), q[201] = T6.status, q[202] = UY, q[203] = Dj;
    else Dj = q[203];
    let P5;
    if (q[204] !== T6.status || q[205] !== Q6 || q[206] !== M || q[207] !== U6) P5 = Boolean(U6.trim()) && M && !1, q[204] = T6.status, q[205] = Q6, q[206] = M, q[207] = U6, q[208] = P5;
    else P5 = q[208];
    let ZH;
    if (q[209] !== T6.status || q[210] !== b || q[211] !== W || q[212] !== YA || q[213] !== N6 || q[214] !== cY || q[215] !== B4 || q[216] !== n?.id || q[217] !== zA || q[218] !== WY || q[219] !== k7 || q[220] !== Q6 || q[221] !== _ || q[222] !== w || q[223] !== s || q[224] !== J6 || q[225] !== u5 || q[226] !== l || q[227] !== Pz) ZH = T6.status === "searching" ? null : l === "rename" && B4 ? eA.default.createElement(m, {
        paddingLeft: 2,
        flexDirection: "column"
    }, eA.default.createElement(T, {
        bold: !0
    }, "Rename session:"), eA.default.createElement(m, {
        paddingTop: 1
    }, eA.default.createElement(J5, {
        value: J6,
        onChange: K6,
        onSubmit: WY,
        placeholder: zr(B4, "Enter new session name"),
        columns: W,
        cursorOffset: s,
        onChangeCursorOffset: X6,
        showCursor: !0
    }))) : v ? eA.default.createElement(BHq, {
        nodes: u5,
        onSelect: (d8) => {
            w(d8.value.log)
        },
        onFocus: k7,
        onCancel: _,
        focusNodeId: n?.id,
        visibleOptionCount: Pz,
        layout: "expanded",
        isDisabled: l === "search" || Q6,
        hideIndexes: !1,
        isNodeExpanded: (d8) => {
            if (l === "search" || b) return !0;
            let VA = typeof d8 === "string" && d8.startsWith("group:") ? d8.substring(6) : null;
            return VA ? N6.has(VA) : !1
        },
        onExpand: (d8) => {
            let VA = typeof d8 === "string" && d8.startsWith("group:") ? d8.substring(6) : null;
            if (VA) $6((n4) => new Set([...n4, VA])), d("tengu_session_group_expanded", {})
        },
        onCollapse: (d8) => {
            let VA = typeof d8 === "string" && d8.startsWith("group:") ? d8.substring(6) : null;
            if (VA) $6((n4) => {
                let iK = new Set(n4);
                return iK.delete(VA), iK
            })
        },
        onUpFromFirstItem: f1
    }) : eA.default.createElement(T8, {
        options: cY,
        onChange: (d8) => {
            let VA = parseInt(d8, 10),
                n4 = YA[VA];
            if (n4) w(n4)
        },
        visibleOptionCount: Pz,
        onCancel: _,
        onFocus: zA,
        defaultFocusValue: n?.id.toString(),
        layout: "expanded",
        isDisabled: l === "search" || Q6,
        onUpFromFirstItem: f1
    }), q[209] = T6.status, q[210] = b, q[211] = W, q[212] = YA, q[213] = N6, q[214] = cY, q[215] = B4, q[216] = n?.id, q[217] = zA, q[218] = WY, q[219] = k7, q[220] = Q6, q[221] = _, q[222] = w, q[223] = s, q[224] = J6, q[225] = u5, q[226] = l, q[227] = Pz, q[228] = ZH;
    else ZH = q[228];
    let ZY;
    if (q[229] !== T6.status || q[230] !== g || q[231] !== Z.keyName || q[232] !== Z.pending || q[233] !== e3 || q[234] !== r || q[235] !== Q6 || q[236] !== J1 || q[237] !== J || q[238] !== X || q[239] !== Q || q[240] !== l) ZY = eA.default.createElement(m, {
        paddingLeft: 2
    }, Z.pending ? eA.default.createElement(T, {
        dimColor: !0
    }, "Press ", Z.keyName, " again to exit") : l === "rename" ? eA.default.createElement(T, {
        dimColor: !0
    }, eA.default.createElement(C8, null, eA.default.createElement(a1, {
        shortcut: "Enter",
        action: "save"
    }), eA.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))) : T6.status === "searching" ? eA.default.createElement(T, {
        dimColor: !0
    }, eA.default.createElement(C8, null, eA.default.createElement(T, null, "Searching with Claude…"), eA.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))) : Q6 ? eA.default.createElement(T, {
        dimColor: !0
    }, eA.default.createElement(C8, null, eA.default.createElement(a1, {
        shortcut: "Enter",
        action: "search"
    }), eA.default.createElement(a1, {
        shortcut: "↓",
        action: "skip"
    }), eA.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))) : l === "search" ? eA.default.createElement(T, {
        dimColor: !0
    }, eA.default.createElement(C8, null, eA.default.createElement(T, null, "Type to Search"), eA.default.createElement(a1, {
        shortcut: "Enter",
        action: "select"
    }), eA.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "clear"
    }))) : eA.default.createElement(T, {
        dimColor: !0
    }, eA.default.createElement(C8, null, J && eA.default.createElement(a1, {
        shortcut: "Ctrl+A",
        action: `show ${X?"current dir":"all projects"}`
    }), g && eA.default.createElement(a1, {
        shortcut: "Ctrl+B",
        action: "toggle branch"
    }), r && eA.default.createElement(a1, {
        shortcut: "Ctrl+W",
        action: `show ${Q?"current worktree":"all worktrees"}`
    }), eA.default.createElement(a1, {
        shortcut: "Ctrl+V",
        action: "preview"
    }), eA.default.createElement(a1, {
        shortcut: "Ctrl+R",
        action: "rename"
    }), eA.default.createElement(T, null, "Type to search"), eA.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }), e3() && eA.default.createElement(T, null, e3())))), q[229] = T6.status, q[230] = g, q[231] = Z.keyName, q[232] = Z.pending, q[233] = e3, q[234] = r, q[235] = Q6, q[236] = J1, q[237] = J, q[238] = X, q[239] = Q, q[240] = l, q[241] = ZY;
    else ZY = q[241];
    let t9;
    if (q[242] !== A2 || q[243] !== q2 || q[244] !== xO || q[245] !== tw || q[246] !== uO || q[247] !== m5 || q[248] !== ew || q[249] !== WH || q[250] !== Dj || q[251] !== P5 || q[252] !== ZH || q[253] !== ZY) t9 = eA.default.createElement(m, {
        flexDirection: "column",
        height: A2
    }, q2, Mq, xO, tw, uO, HJ, m5, ew, WH, Dj, P5, ZH, ZY), q[242] = A2, q[243] = q2, q[244] = xO, q[245] = tw, q[246] = uO, q[247] = m5, q[248] = ew, q[249] = WH, q[250] = Dj, q[251] = P5, q[252] = ZH, q[253] = ZY, q[254] = t9;
    else t9 = q[254];
    return t9
}
// @from(Ln 413559, Col 0)
function peY(A) {
    return A.log
}
// @from(Ln 413563, Col 0)
function QeY(A) {
    return A.messages[0]?.uuid
}
// @from(Ln 413567, Col 0)
function UeY(A, q, K, Y) {
    let z = A.search(q);
    z.sort(ceY), K({
        results: z.map(deY),
        query: q
    }), Y(!1)
}
// @from(Ln 413575, Col 0)
function deY(A) {
    return {
        log: A.item.log,
        score: A.score,
        searchableText: A.item.searchableText
    }
}
// @from(Ln 413583, Col 0)
function ceY(A, q) {
    let K = new Date(A.item.log.modified).getTime(),
        z = new Date(q.item.log.modified).getTime() - K;
    if (Math.abs(z) > BeY) return z;
    return (A.score ?? 1) - (q.score ?? 1)
}
// @from(Ln 413590, Col 0)
function leY(A) {
    let q = R1(),
        K = n_(A);
    if (q && K === q) return !0;
    if (A.customTitle) return !0;
    if (Yr6(A.messages)) return !0;
    if (A.firstPrompt || A.customTitle) return !0;
    return !1
}
// @from(Ln 413600, Col 0)
function ieY(A) {
    return [A, reY(A)]
}
// @from(Ln 413604, Col 0)
function neY(A) {
    if (A.type !== "user" && A.type !== "assistant") return "";
    let q = "message" in A ? A.message?.content : void 0;
    if (!q) return "";
    if (typeof q === "string") return q;
    if (Array.isArray(q)) return q.map((K) => {
        if (typeof K === "string") return K;
        if ("text" in K && typeof K.text === "string") return K.text;
        return ""
    }).filter(Boolean).join(" ");
    return ""
}
// @from(Ln 413617, Col 0)
function reY(A) {
    let K = (A.messages.length <= meY ? A.messages : [...A.messages.slice(0, ejq), ...A.messages.slice(-ejq)]).map(neY).filter(Boolean).join(" "),
        z = `${[A.customTitle,A.summary,A.firstPrompt,A.gitBranch,A.tag,A.prNumber?`PR #${A.prNumber}`:void 0,A.prRepository].filter(Boolean).join(" ")} ${K}`.trim();
    return z.length > AJq ? z.slice(0, AJq) : z
}
// @from(Ln 413623, Col 0)
function oeY(A) {
    let q = new Map;
    for (let K of A) {
        let Y = n_(K);
        if (Y) {
            let z = q.get(Y);
            if (z) z.push(K);
            else q.set(Y, [K])
        }
    }
    return q.forEach((K) => K.sort((Y, z) => new Date(z.modified).getTime() - new Date(Y.modified).getTime())), q
}
// @from(Ln 413636, Col 0)
function aeY(A) {
    let q = new Set;
    for (let K of A)
        if (K.tag) q.add(K.tag);
    return Array.from(q).sort((K, Y) => K.localeCompare(Y))
}
// @from(Ln 413642, Col 4)
eA
// @from(Ln 413642, Col 8)
xeY = 2
// @from(Ln 413643, Col 4)
ueY = 4
// @from(Ln 413644, Col 4)
meY = 2000
// @from(Ln 413645, Col 4)
ejq = 1000
// @from(Ln 413646, Col 4)
AJq = 50000
// @from(Ln 413647, Col 4)
BeY = 60000
// @from(Ln 413648, Col 4)
geY = 50
// @from(Ln 413649, Col 4)
gc8 = E(() => {
    e6();
    aK();
    i6();
    _7();
    ym();
    OX6();
    LO();
    _q();
    Oq();
    M4();
    v3();
    gHq();
    PO();
    $5();
    ln6();
    T1();
    AH();
    Oq();
    T1();
    V1();
    ljq();
    k1();
    Xq();
    Lq();
    OK();
    tjq();
    H16();
    j16();
    eA = t(P6(), 1)
})
// @from(Ln 413681, Col 0)
function vR1(A, q, K) {
    let Y = AA();
    if (!q || !A.projectPath || A.projectPath === Y) return {
        isCrossProject: !1
    };
    {
        let O = n_(A);
        return {
            isCrossProject: !0,
            isSameRepoWorktree: !1,
            command: `cd ${j4([A.projectPath])} && claude --resume ${O}`,
            projectPath: A.projectPath
        }
    }
    if (K.some((O) => A.projectPath === O || A.projectPath.startsWith(O + "/"))) return {
        isCrossProject: !0,
        isSameRepoWorktree: !0,
        projectPath: A.projectPath
    };
    let _ = n_(A);
    return {
        isCrossProject: !0,
        isSameRepoWorktree: !1,
        command: `cd ${j4([A.projectPath])} && claude --resume ${_}`,
        projectPath: A.projectPath
    }
}
// @from(Ln 413708, Col 4)
Fc8 = E(() => {
    T1();
    Oq();
    RJ()
})
// @from(Ln 413714, Col 0)
function teY(A) {
    if (A.type !== "user" && A.type !== "assistant") return "";
    let q = "message" in A ? A.message?.content : void 0;
    if (!q) return "";
    if (typeof q === "string") return q;
    if (Array.isArray(q)) return q.map((K) => {
        if (typeof K === "string") return K;
        if ("text" in K && typeof K.text === "string") return K.text;
        return ""
    }).filter(Boolean).join(" ");
    return ""
}
// @from(Ln 413727, Col 0)
function zJq(A) {
    if (A.length === 0) return "";
    let K = (A.length <= pc8 ? A : [...A.slice(0, pc8 / 2), ...A.slice(-pc8 / 2)]).map(teY).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    return K.length > KJq ? K.slice(0, KJq) + "…" : K
}
// @from(Ln 413733, Col 0)
function YJq(A, q) {
    if (zr(A).toLowerCase().includes(q)) return !0;
    if (A.customTitle?.toLowerCase().includes(q)) return !0;
    if (A.tag?.toLowerCase().includes(q)) return !0;
    if (A.gitBranch?.toLowerCase().includes(q)) return !0;
    if (A.summary?.toLowerCase().includes(q)) return !0;
    if (A.firstPrompt?.toLowerCase().includes(q)) return !0;
    if (A.messages && A.messages.length > 0) {
        if (zJq(A.messages).toLowerCase().includes(q)) return !0
    }
    return !1
}
// @from(Ln 413745, Col 0)
async function NR1(A, q, K) {
    if (!A.trim() || q.length === 0) return [];
    let Y = A.toLowerCase(),
        z = q.filter((j) => YJq(j, Y)),
        _;
    if (z.length >= Qc8) _ = z.slice(0, Qc8);
    else {
        let j = q.filter((M) => !YJq(M, Y)),
            J = Qc8 - z.length;
        _ = [...z, ...j.slice(0, J)]
    }
    k(`Agentic search: ${_.length}/${q.length} logs, query="${A}", matching: ${z.length}, with messages: ${_.filter((j)=>j.messages?.length>0).length}`);
    let w = _.map(async (j) => {
            if (Hh(j)) try {
                return await hb(j)
            } catch (J) {
                return _6(J), j
            }
            return j
        }),
        O = await Promise.all(w);
    k(`Agentic search: loaded ${O.filter((j)=>j.messages?.length>0).length}/${_.length} logs with transcripts`);
    let H = `Sessions:
${O.map((j,J)=>{let M=[`${J}:`],D=zr(j);if(M.push(D),j.customTitle&&j.customTitle!==D)M.push(`[custom title: ${j.customTitle}]`);if(j.tag)M.push(`[tag: ${j.tag}]`);if(j.gitBranch)M.push(`[branch: ${j.gitBranch}]`);if(j.summary)M.push(`- Summary: ${j.summary}`);if(j.firstPrompt&&j.firstPrompt!=="No prompt")M.push(`- First message: ${j.firstPrompt.slice(0,300)}`);if(j.messages&&j.messages.length>0){let X=zJq(j.messages);if(X)M.push(`- Transcript: ${X}`)}return M.join(" ")}).join(`
    `)}

Search query: "${A}"

Find the sessions that are most relevant to this query.`;
    k(`Agentic search prompt (first 500 chars): ${H.slice(0,500)}...`);
    try {
        let j = lH();
        k(`Agentic search using model: ${j}`);
        let M = (await _h({
            model: j,
            system: seY,
            messages: [{
                role: "user",
                content: H
            }],
            signal: K
        })).content.find((Z) => Z.type === "text");
        if (!M || M.type !== "text") return k("No text content in agentic search response"), [];
        k(`Agentic search response: ${M.text}`);
        let D = M.text.match(/\{[\s\S]*\}/);
        if (!D) return k("Could not find JSON in agentic search response"), [];
        let W = (i1(D[0]).relevant_indices || []).filter((Z) => Z >= 0 && Z < O.length).map((Z) => O[Z]);
        return k(`Agentic search found ${W.length} relevant sessions`), W
    } catch (j) {
        return _6(j), k(`Agentic search error: ${j}`), []
    }
}
// @from(Ln 413797, Col 4)
KJq = 2000
// @from(Ln 413798, Col 4)
pc8 = 100
// @from(Ln 413799, Col 4)
Qc8 = 100
// @from(Ln 413800, Col 4)
seY = `Your goal is to find relevant sessions based on a user's search query.

You will be given a list of sessions with their metadata and a search query. Identify which sessions are most relevant to the query.

Each session may include:
- Title (display name or custom title)
- Tag (user-assigned category, shown as [tag: name] - users tag sessions with /tag command to categorize them)
- Branch (git branch name, shown as [branch: name])
- Summary (AI-generated summary)
- First message (beginning of the conversation)
- Transcript (excerpt of conversation content)

IMPORTANT: Tags are user-assigned labels that indicate the session's topic or category. If the query matches a tag exactly or partially, those sessions should be highly prioritized.

For each session, consider (in order of priority):
1. Exact tag matches (highest priority - user explicitly categorized this session)
2. Partial tag matches or tag-related terms
3. Title matches (custom titles or first message content)
4. Branch name matches
5. Summary and transcript content matches
6. Semantic similarity and related concepts

CRITICAL: Be VERY inclusive in your matching. Include sessions that:
- Contain the query term anywhere in any field
- Are semantically related to the query (e.g., "testing" matches sessions about "tests", "unit tests", "QA", etc.)
- Discuss topics that could be related to the query
- Have transcripts that mention the concept even in passing

When in doubt, INCLUDE the session. It's better to return too many results than too few. The user can easily scan through results, but missing relevant sessions is frustrating.

Return sessions ordered by relevance (most relevant first). If truly no sessions have ANY connection to the query, return an empty array - but this should be rare.

Respond with ONLY the JSON object, no markdown formatting:
{"relevant_indices": [2, 5, 0]}`
// @from(Ln 413834, Col 4)
Uc8 = E(() => {
    k1();
    z4();
    H1();
    tY6();
    Oq();
    g1()
})
// @from(Ln 413842, Col 4)
OJq = {}
// @from(Ln 413848, Col 0)
function _Jq(A) {
    switch (A.resultType) {
        case "sessionNotFound":
            return `Session ${O1.bold(A.arg)} was not found.`;
        case "multipleMatches":
            return `Found ${A.count} sessions matching ${O1.bold(A.arg)}. Please use /resume to pick a specific session.`
    }
}
// @from(Ln 413857, Col 0)
function dc8(A) {
    let q = A6(10),
        {
            message: K,
            args: Y,
            onDone: z
        } = A,
        _, w;
    if (q[0] !== z) _ = () => {
        let j = setTimeout(z, 0);
        return () => clearTimeout(j)
    }, w = [z], q[0] = z, q[1] = _, q[2] = w;
    else _ = q[1], w = q[2];
    o5.useEffect(_, w);
    let O;
    if (q[3] !== Y) O = o5.createElement(T, {
        dimColor: !0
    }, a6.pointer, " /resume ", Y), q[3] = Y, q[4] = O;
    else O = q[4];
    let $;
    if (q[5] !== K) $ = o5.createElement(t1, null, o5.createElement(T, null, K)), q[5] = K, q[6] = $;
    else $ = q[6];
    let H;
    if (q[7] !== O || q[8] !== $) H = o5.createElement(m, {
        flexDirection: "column"
    }, O, $), q[7] = O, q[8] = $, q[9] = H;
    else H = q[9];
    return H
}
// @from(Ln 413887, Col 0)
function eeY({
    onDone: A,
    onResume: q
}) {
    let [K, Y] = o5.useState([]), [z, _] = o5.useState([]), [w, O] = o5.useState(!0), [$, H] = o5.useState(!1), [j, J] = o5.useState(!1), {
        rows: M
    } = KA(), D = o5.useCallback(async (Z, G) => {
        O(!0);
        try {
            let f = Z ? await cc8() : await VR1(G),
                v = wJq(f, R1());
            if (v.length === 0) {
                A("No conversations found to resume");
                return
            }
            Y(v)
        } catch (f) {
            A("Failed to load conversations")
        } finally {
            O(!1)
        }
    }, [A]);
    o5.useEffect(() => {
        async function Z() {
            let G = await al(AA());
            _(G), D(!1, G)
        }
        Z()
    }, [D]);
    let X = o5.useCallback(() => {
        let Z = !j;
        J(Z), D(Z, z)
    }, [j, D, z]);
    async function P(Z) {
        let G = nk(n_(Z));
        if (!G) {
            A("Failed to resume conversation");
            return
        }
        let f = Hh(Z) ? await hb(Z) : Z,
            v = vR1(f, j, z);
        if (v.isCrossProject) {
            if (v.isSameRepoWorktree) {
                H(!0), q(G, f, "slash_command_picker");
                return
            }
            await ZZ(v.command);
            let N = ["", "This conversation is from a different directory.", "", "To resume, run:", `  ${v.command}`, "", "(Command copied to clipboard)", ""].join(`
`);
            A(N, {
                display: "user"
            });
            return
        }
        H(!0), q(G, f, "slash_command_picker")
    }

    function W() {
        A("Resume cancelled", {
            display: "system"
        })
    }
    if (w) return o5.createElement(m, null, o5.createElement(Wq, null), o5.createElement(T, null, " Loading conversations…"));
    if ($) return o5.createElement(m, null, o5.createElement(Wq, null), o5.createElement(T, null, " Resuming conversation…"));
    return o5.createElement(TR1, {
        logs: K,
        maxHeight: M - 2,
        onCancel: W,
        onSelect: P,
        onLogsChanged: () => D(j, z),
        showAllProjects: j,
        onToggleAllProjects: X,
        onAgenticSearch: NR1
    })
}
// @from(Ln 413963, Col 0)
function wJq(A, q) {
    return A.filter((K) => !K.isSidechain && n_(K) !== q)
}
// @from(Ln 413966, Col 4)
o5
// @from(Ln 413966, Col 8)
A6z = async (A, q, K) => {
    let Y = async (H, j, J) => {
        try {
            await q.resume?.(H, j, J), A(void 0, {
                display: "skip"
            })
        } catch (M) {
            _6(M), A(`Failed to resume: ${M.message}`)
        }
    }, z = K?.trim();
    if (!z) return o5.createElement(eeY, {
        key: Date.now(),
        onDone: A,
        onResume: Y
    });
    let _ = await al(AA()),
        w = await VR1(_);
    if (w.length === 0) return o5.createElement(dc8, {
        message: "No conversations found to resume.",
        args: z,
        onDone: () => A("No conversations found to resume.")
    });
    let O = nk(z);
    if (O) {
        let H = w.filter((J) => n_(J) === O).sort((J, M) => M.modified.getTime() - J.modified.getTime());
        if (H.length > 0) {
            let J = H[0],
                M = Hh(J) ? await hb(J) : J;
            return Y(O, M, "slash_command_session_id"), null
        }
        let j = await Hl6(O);
        if (j) return Y(O, j, "slash_command_session_id"), null
    }
    if (Ki()) {
        let H = await GF(z, {
            exact: !0
        });
        if (H.length === 1) {
            let j = H[0],
                J = n_(j);
            if (J) {
                let M = Hh(j) ? await hb(j) : j;
                return Y(J, M, "slash_command_title"), null
            }
        }
        if (H.length > 1) {
            let j = _Jq({
                resultType: "multipleMatches",
                arg: z,
                count: H.length
            });
            return o5.createElement(dc8, {
                message: j,
                args: z,
                onDone: () => A(j)
            })
        }
    }
    let $ = _Jq({
        resultType: "sessionNotFound",
        arg: z
    });
    return o5.createElement(dc8, {
        message: $,
        args: z,
        onDone: () => A($)
    })
}
// @from(Ln 414034, Col 4)
$Jq = E(() => {
    e6();
    b7();
    aK();
    i6();
    LO();
    gc8();
    iq();
    Oq();
    xI();
    _q();
    vc();
    Fc8();
    ln6();
    T1();
    Uc8();
    k1();
    o5 = t(P6(), 1)
})
// @from(Ln 414053, Col 4)
q6z
// @from(Ln 414053, Col 9)
HJq
// @from(Ln 414054, Col 4)
jJq = E(() => {
    q6z = {
        type: "local-jsx",
        name: "resume",
        description: "Resume a previous conversation",
        aliases: ["continue"],
        isEnabled: () => !0,
        isHidden: !1,
        argumentHint: "[conversation id or search term]",
        load: () => Promise.resolve().then(() => ($Jq(), OJq)),
        userFacingName() {
            return "resume"
        }
    }, HJq = q6z
})
// @from(Ln 414069, Col 4)
kR1
// @from(Ln 414070, Col 4)
lc8 = E(() => {
    kR1 = YN6({
        name: "review",
        description: "Review a pull request",
        progressMessage: "reviewing pull request",
        pluginName: "code-review",
        pluginCommand: "code-review",
        async getPromptWhileMarketplaceIsPrivate(A) {
            return [{
                type: "text",
                text: `
      You are an expert code reviewer. Follow these steps:

      1. If no PR number is provided in the args, run \`gh pr list\` to show open PRs
      2. If a PR number is provided, run \`gh pr view <number>\` to get PR details
      3. Run \`gh pr diff <number>\` to get the diff
      4. Analyze the changes and provide a thorough code review that includes:
         - Overview of what the PR does
         - Analysis of code quality and style
         - Specific suggestions for improvements
         - Any potential issues or risks

      Keep your review concise but thorough. Focus on:
      - Code correctness
      - Following project conventions
      - Performance implications
      - Test coverage
      - Security considerations

      Format your review with clear sections and bullet points.

      PR number: ${A}
    `
            }]
        }
    })
})
// @from(Ln 414107, Col 4)
JJq = {}
// @from(Ln 414112, Col 0)
function K6z(A) {
    let q = A6(19),
        {
            onDone: K
        } = A,
        Y = M1(w6z),
        [z, _] = ER1.useState(""),
        w, O;
    if (q[0] !== Y) w = () => {
        if (!Y) return;
        let W = Y;
        (async function() {
            let f = await Lh(W, {
                type: "utf8",
                errorCorrectionLevel: "L"
            });
            _(f)
        })().catch(_6z)
    }, O = [Y], q[0] = Y, q[1] = w, q[2] = O;
    else w = q[1], O = q[2];
    ER1.useEffect(w, O);
    let $;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) $ = {
        context: "Confirmation"
    }, q[3] = $;
    else $ = q[3];
    if (D8("confirm:no", K, $), !Y) {
        let W;
        if (q[4] === Symbol.for("react.memo_cache_sentinel")) W = o_.createElement(S3, null, o_.createElement(T, {
            color: "warning"
        }, "Not in remote mode. Start with `claude --remote` to use this command."), o_.createElement(T, {
            dimColor: !0
        }, "(press esc to close)")), q[4] = W;
        else W = q[4];
        return W
    }
    let H, j, J;
    if (q[5] !== z) {
        let W = z.split(`
`).filter(z6z),
            Z = W.length === 0;
        if (H = S3, q[9] === Symbol.for("react.memo_cache_sentinel")) j = o_.createElement(m, {
            marginBottom: 1
        }, o_.createElement(T, {
            bold: !0
        }, "Remote session")), q[9] = j;
        else j = q[9];
        J = Z ? o_.createElement(T, {
            dimColor: !0
        }, "Generating QR code…") : W.map(Y6z), q[5] = z, q[6] = H, q[7] = j, q[8] = J
    } else H = q[6], j = q[7], J = q[8];
    let M;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) M = o_.createElement(T, {
        dimColor: !0
    }, "Open in browser: "), q[10] = M;
    else M = q[10];
    let D;
    if (q[11] !== Y) D = o_.createElement(m, {
        marginTop: 1
    }, M, o_.createElement(T, {
        color: "ide"
    }, Y)), q[11] = Y, q[12] = D;
    else D = q[12];
    let X;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) X = o_.createElement(m, {
        marginTop: 1
    }, o_.createElement(T, {
        dimColor: !0
    }, "(press esc to close)")), q[13] = X;
    else X = q[13];
    let P;
    if (q[14] !== H || q[15] !== j || q[16] !== J || q[17] !== D) P = o_.createElement(H, null, j, J, D, X), q[14] = H, q[15] = j, q[16] = J, q[17] = D, q[18] = P;
    else P = q[18];
    return P
}
// @from(Ln 414188, Col 0)
function Y6z(A, q) {
    return o_.createElement(T, {
        key: q
    }, A)
}
// @from(Ln 414194, Col 0)
function z6z(A) {
    return A.length > 0
}
// @from(Ln 414198, Col 0)
function _6z(A) {
    k("QR code generation failed", A)
}
// @from(Ln 414202, Col 0)
function w6z(A) {
    return A.remoteSessionUrl
}
// @from(Ln 414205, Col 4)
o_
// @from(Ln 414205, Col 8)
ER1
// @from(Ln 414205, Col 13)
O6z = async (A) => {
    return o_.createElement(K6z, {
        onDone: A
    })
}
// @from(Ln 414210, Col 4)
MJq = E(() => {
    e6();
    i6();
    KN6();
    NA();
    H1();
    _7();
    FJ();
    o_ = t(P6(), 1), ER1 = t(P6(), 1)
})
// @from(Ln 414220, Col 4)
$6z
// @from(Ln 414220, Col 9)
ic8
// @from(Ln 414221, Col 4)
DJq = E(() => {
    T1();
    $6z = {
        type: "local-jsx",
        name: "session",
        aliases: ["remote"],
        description: "Show remote session URL and QR code",
        isEnabled: () => t4(),
        get isHidden() {
            return !t4()
        },
        load: () => Promise.resolve().then(() => (MJq(), JJq)),
        userFacingName() {
            return "session"
        }
    }, ic8 = $6z
})
// @from(Ln 414238, Col 4)
XJq
// @from(Ln 414239, Col 4)
PJq = E(() => {
    XJq = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 414247, Col 0)
function H6z(A) {
    if (A === "plugin") return "Plugin skills";
    return `${EU(vo(A))} skills`
}
// @from(Ln 414252, Col 0)
function WJq(A) {
    let q = A6(30),
        {
            onExit: K,
            commands: Y
        } = A,
        z;
    if (q[0] !== Y) z = Y.filter(D6z), q[0] = Y, q[1] = z;
    else z = q[1];
    let _ = z,
        w;
    if (q[2] !== _) {
        w = {
            policySettings: [],
            userSettings: [],
            projectSettings: [],
            localSettings: [],
            flagSettings: [],
            plugin: []
        };
        for (let N of _) {
            let V = N.source;
            if (V in w) w[V].push(N)
        }
        for (let N of Object.values(w)) N.sort(M6z);
        q[2] = _, q[3] = w
    } else w = q[3];
    let O = w,
        $;
    if (q[4] !== K) $ = () => {
        K("Skills dialog dismissed", {
            display: "system"
        })
    }, q[4] = K, q[5] = $;
    else $ = q[5];
    let H = $;
    if (_.length === 0) {
        let N;
        if (q[6] === Symbol.for("react.memo_cache_sentinel")) N = az.createElement(T, {
            dimColor: !0
        }, "Create skills in .claude/skills/ or ~/.claude/skills/"), q[6] = N;
        else N = q[6];
        let V;
        if (q[7] === Symbol.for("react.memo_cache_sentinel")) V = az.createElement(T, {
            dimColor: !0,
            italic: !0
        }, az.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "close"
        })), q[7] = V;
        else V = q[7];
        let L;
        if (q[8] !== H) L = az.createElement(m8, {
            title: "Skills",
            subtitle: "No skills found",
            onCancel: H,
            hideInputGuide: !0
        }, N, V), q[8] = H, q[9] = L;
        else L = q[9];
        return L
    }
    let j = J6z,
        J;
    if (q[10] !== O) J = (N) => {
        let V = O[N];
        if (V.length === 0) return null;
        let L = H6z(N),
            h = $K(Bt(N, "skills")),
            R = $K(Bt(N, "commands")),
            u = V.some(j6z);
        return az.createElement(m, {
            flexDirection: "column",
            key: N
        }, az.createElement(m, null, az.createElement(T, {
            bold: !0,
            dimColor: !0
        }, L), h && az.createElement(T, {
            dimColor: !0
        }, " ", "(", h, u && R ? `, ${R}` : "", ")")), V.map((I) => j(I)))
    }, q[10] = O, q[11] = J;
    else J = q[11];
    let M = J,
        D = `${_.length} skill${_.length===1?"":"s"}`,
        X;
    if (q[12] !== M) X = M("projectSettings"), q[12] = M, q[13] = X;
    else X = q[13];
    let P;
    if (q[14] !== M) P = M("userSettings"), q[14] = M, q[15] = P;
    else P = q[15];
    let W;
    if (q[16] !== M) W = M("policySettings"), q[16] = M, q[17] = W;
    else W = q[17];
    let Z;
    if (q[18] !== M) Z = M("plugin"), q[18] = M, q[19] = Z;
    else Z = q[19];
    let G;
    if (q[20] !== X || q[21] !== P || q[22] !== W || q[23] !== Z) G = az.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, X, P, W, Z), q[20] = X, q[21] = P, q[22] = W, q[23] = Z, q[24] = G;
    else G = q[24];
    let f;
    if (q[25] === Symbol.for("react.memo_cache_sentinel")) f = az.createElement(T, {
        dimColor: !0,
        italic: !0
    }, az.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "close"
    })), q[25] = f;
    else f = q[25];
    let v;
    if (q[26] !== H || q[27] !== D || q[28] !== G) v = az.createElement(m8, {
        title: "Skills",
        subtitle: D,
        onCancel: H,
        hideInputGuide: !0
    }, G, f), q[26] = H, q[27] = D, q[28] = G, q[29] = v;
    else v = q[29];
    return v
}
// @from(Ln 414377, Col 0)
function j6z(A) {
    return A.loadedFrom === "commands_DEPRECATED"
}
// @from(Ln 414381, Col 0)
function J6z(A) {
    let q = kW6(A),
        K = A84(q),
        Y = A.source === "plugin" ? A.pluginInfo?.pluginManifest.name : void 0;
    return az.createElement(m, {
        key: `${A.name}-${A.source}`
    }, az.createElement(T, null, A.userFacingName()), az.createElement(T, {
        dimColor: !0
    }, Y ? ` · ${Y}` : "", " · ", K, " description tokens"))
}
// @from(Ln 414392, Col 0)
function M6z(A, q) {
    return kW6(q) - kW6(A)
}
// @from(Ln 414396, Col 0)
function D6z(A) {
    return A.type === "prompt" && (A.loadedFrom === "skills" || A.loadedFrom === "commands_DEPRECATED" || A.loadedFrom === "plugin")
}
// @from(Ln 414399, Col 4)
az
// @from(Ln 414400, Col 4)
ZJq = E(() => {
    e6();
    i6();
    Ou6();
    wq();
    OK();
    O2();
    AZ();
    Z7();
    od();
    az = t(P6(), 1)
})
// @from(Ln 414412, Col 4)
GJq = {}
// @from(Ln 414416, Col 0)
async function X6z(A, q) {
    return nc8.createElement(WJq, {
        onExit: A,
        commands: q.options.commands
    })
}
// @from(Ln 414422, Col 4)
nc8
// @from(Ln 414423, Col 4)
fJq = E(() => {
    ZJq();
    nc8 = t(P6(), 1)
})
// @from(Ln 414427, Col 4)
P6z
// @from(Ln 414427, Col 9)
TJq
// @from(Ln 414428, Col 4)
vJq = E(() => {
    P6z = {
        type: "local-jsx",
        name: "skills",
        description: "List available skills",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (fJq(), GJq)),
        userFacingName() {
            return "skills"
        }
    }, TJq = P6z
})
// @from(Ln 414441, Col 4)
NJq = {}
// @from(Ln 414445, Col 0)
async function W6z(A, q) {
    return rc8.createElement(Vv6, {
        onClose: A,
        context: q,
        defaultTab: "Status"
    })
}
// @from(Ln 414452, Col 4)
rc8
// @from(Ln 414453, Col 4)
VJq = E(() => {
    By1();
    rc8 = t(P6(), 1)
})
// @from(Ln 414457, Col 4)
Z6z
// @from(Ln 414457, Col 9)
kJq
// @from(Ln 414458, Col 4)
EJq = E(() => {
    Z6z = {
        type: "local-jsx",
        name: "status",
        description: "Show Claude Code status including version, model, account, API connectivity, and tool statuses",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (VJq(), NJq)),
        userFacingName() {
            return "status"
        }
    }, kJq = Z6z
})
// @from(Ln 414471, Col 0)
async function yJq(A) {
    let q = g2(A.id);
    try {
        let K = await ow6(q, G6z);
        return {
            content: K.content,
            bytesTotal: K.bytesTotal
        }
    } catch {
        return {
            content: "",
            bytesTotal: 0
        }
    }
}
// @from(Ln 414487, Col 0)
function LJq(A) {
    let q = A6(50),
        {
            shell: K,
            onDone: Y,
            onKillShell: z,
            onBack: _
        } = A,
        {
            columns: w
        } = KA(),
        O;
    if (q[0] !== K) O = () => yJq(K), q[0] = K, q[1] = O;
    else O = q[1];
    let [$, H] = $9.useState(O), j = $9.useDeferredValue($), J;
    if (q[2] !== K) J = () => {
        if (K.status !== "running") return;
        let H6 = setInterval(T6z, 1000, H, K);
        return () => clearInterval(H6)
    }, q[2] = K, q[3] = J;
    else J = q[3];
    let M;
    if (q[4] !== K.id || q[5] !== K.status) M = [K.id, K.status], q[4] = K.id, q[5] = K.status, q[6] = M;
    else M = q[6];
    $9.useEffect(J, M);
    let D;
    if (q[7] !== Y) D = () => Y("Shell details dismissed", {
        display: "system"
    }), q[7] = Y, q[8] = D;
    else D = q[8];
    let X = D,
        P;
    if (q[9] !== X) P = {
        "confirm:yes": X
    }, q[9] = X, q[10] = P;
    else P = q[10];
    let W;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) W = {
        context: "Confirmation"
    }, q[11] = W;
    else W = q[11];
    tA(P, W);
    let Z;
    if (q[12] !== _ || q[13] !== Y || q[14] !== z || q[15] !== K.status) Z = (H6, J6) => {
        if (H6 === " ") Y("Shell details dismissed", {
            display: "system"
        });
        else if (J6.leftArrow && _) _();
        else if (H6 === "x" && K.status === "running" && z) z()
    }, q[12] = _, q[13] = Y, q[14] = z, q[15] = K.status, q[16] = Z;
    else Z = q[16];
    jA(Z);
    let G = f6z,
        f = K.kind === "monitor",
        v;
    if (q[17] !== K.command) v = jq(K.command, 280), q[17] = K.command, q[18] = v;
    else v = q[18];
    let N = v,
        V = f ? "Monitor details" : "Shell details",
        L;
    if (q[19] !== _ || q[20] !== z || q[21] !== K.status) L = (H6) => H6.pending ? $9.default.createElement(T, null, "Press ", H6.keyName, " again to exit") : $9.default.createElement(C8, null, _ && $9.default.createElement(a1, {
        shortcut: "←",
        action: "go back"
    }), $9.default.createElement(a1, {
        shortcut: "Esc/Enter/Space",
        action: "close"
    }), K.status === "running" && z && $9.default.createElement(a1, {
        shortcut: "x",
        action: "stop"
    })), q[19] = _, q[20] = z, q[21] = K.status, q[22] = L;
    else L = q[22];
    let h;
    if (q[23] === Symbol.for("react.memo_cache_sentinel")) h = $9.default.createElement(T, {
        bold: !0
    }, "Status:"), q[23] = h;
    else h = q[23];
    let R;
    if (q[24] !== K.result || q[25] !== K.status) R = $9.default.createElement(T, null, h, " ", K.status === "running" ? $9.default.createElement(T, {
        color: "background"
    }, K.status, K.result?.code !== void 0 && ` (exit code: ${K.result.code})`) : K.status === "completed" ? $9.default.createElement(T, {
        color: "success"
    }, K.status, K.result?.code !== void 0 && ` (exit code: ${K.result.code})`) : $9.default.createElement(T, {
        color: "error"
    }, K.status, K.result?.code !== void 0 && ` (exit code: ${K.result.code})`)), q[24] = K.result, q[25] = K.status, q[26] = R;
    else R = q[26];
    let u;
    if (q[27] === Symbol.for("react.memo_cache_sentinel")) u = $9.default.createElement(T, {
        bold: !0
    }, "Runtime:"), q[27] = u;
    else u = q[27];
    let I = G(K.startTime),
        g;
    if (q[28] !== I) g = $9.default.createElement(T, null, u, " ", I), q[28] = I, q[29] = g;
    else g = q[29];
    let B = f ? "Script:" : "Command:",
        b;
    if (q[30] !== B) b = $9.default.createElement(T, {
        bold: !0
    }, B), q[30] = B, q[31] = b;
    else b = q[31];
    let p;
    if (q[32] !== N || q[33] !== b) p = $9.default.createElement(T, {
        wrap: "wrap"
    }, b, " ", N), q[32] = N, q[33] = b, q[34] = p;
    else p = q[34];
    let Q;
    if (q[35] !== R || q[36] !== g || q[37] !== p) Q = $9.default.createElement(m, {
        flexDirection: "column"
    }, R, g, p), q[35] = R, q[36] = g, q[37] = p, q[38] = Q;
    else Q = q[38];
    let U;
    if (q[39] === Symbol.for("react.memo_cache_sentinel")) U = $9.default.createElement(T, {
        bold: !0
    }, "Output:"), q[39] = U;
    else U = q[39];
    let r;
    if (q[40] === Symbol.for("react.memo_cache_sentinel")) r = $9.default.createElement(T, {
        dimColor: !0
    }, "Loading output…"), q[40] = r;
    else r = q[40];
    let e;
    if (q[41] !== w || q[42] !== j) e = $9.default.createElement(m, {
        flexDirection: "column"
    }, U, $9.default.createElement($9.Suspense, {
        fallback: r
    }, $9.default.createElement(v6z, {
        outputPromise: j,
        columns: w
    }))), q[41] = w, q[42] = j, q[43] = e;
    else e = q[43];
    let Y6;
    if (q[44] !== X || q[45] !== L || q[46] !== Q || q[47] !== e || q[48] !== V) Y6 = $9.default.createElement(m8, {
        title: V,
        onCancel: X,
        color: "background",
        inputGuide: L
    }, Q, e), q[44] = X, q[45] = L, q[46] = Q, q[47] = e, q[48] = V, q[49] = Y6;
    else Y6 = q[49];
    return Y6
}
// @from(Ln 414628, Col 0)
function f6z(A) {
    let q = Math.floor((Date.now() - A) / 1000),
        K = Math.floor(q / 3600),
        Y = Math.floor((q - K * 3600) / 60),
        z = q - K * 3600 - Y * 60;
    return `${K>0?`${K}h `:""}${Y>0||K>0?`${Y}m `:""}${z}s`
}
// @from(Ln 414636, Col 0)
function T6z(A, q) {
    return A(yJq(q))
}
// @from(Ln 414640, Col 0)
function v6z(A) {
    let q = A6(19),
        {
            outputPromise: K,
            columns: Y
        } = A,
        {
            content: z,
            bytesTotal: _
        } = $9.use(K);
    if (!z) {
        let P;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) P = $9.default.createElement(T, {
            dimColor: !0
        }, "No output available"), q[0] = P;
        else P = q[0];
        return P
    }
    let w, O;
    if (q[1] !== _ || q[2] !== z) {
        let P = [],
            W = z.length;
        for (let Z = 0; Z < 10 && W > 0; Z++) {
            let G = z.lastIndexOf(`
`, W - 1);
            P.push(G + 1), W = G
        }
        P.reverse(), w = _ > z.length, O = [];
        for (let Z = 0; Z < P.length; Z++) {
            let G = P[Z],
                f = Z < P.length - 1 ? P[Z + 1] - 1 : z.length,
                v = z.slice(G, f);
            if (v) O.push(v)
        }
        q[1] = _, q[2] = z, q[3] = w, q[4] = O
    } else w = q[3], O = q[4];
    let $ = Y - 6,
        H;
    if (q[5] !== O) H = O.map(N6z), q[5] = O, q[6] = H;
    else H = q[6];
    let j;
    if (q[7] !== $ || q[8] !== H) j = $9.default.createElement(m, {
        borderStyle: "round",
        paddingX: 1,
        flexDirection: "column",
        height: 12,
        maxWidth: $
    }, H), q[7] = $, q[8] = H, q[9] = j;
    else j = q[9];
    let J = `Showing ${O.length} lines`,
        M;
    if (q[10] !== _ || q[11] !== w) M = w ? ` of ${xq(_)}` : "", q[10] = _, q[11] = w, q[12] = M;
    else M = q[12];
    let D;
    if (q[13] !== J || q[14] !== M) D = $9.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, J, M), q[13] = J, q[14] = M, q[15] = D;
    else D = q[15];
    let X;
    if (q[16] !== j || q[17] !== D) X = $9.default.createElement($9.default.Fragment, null, j, D), q[16] = j, q[17] = D, q[18] = X;
    else X = q[18];
    return X
}
// @from(Ln 414705, Col 0)
function N6z(A, q) {
    return $9.default.createElement(T, {
        key: q,
        wrap: "truncate-end"
    }, A)
}
// @from(Ln 414711, Col 4)
$9
// @from(Ln 414711, Col 8)
G6z = 8192
// @from(Ln 414712, Col 4)
RJq = E(() => {
    e6();
    i6();
    _7();
    _q();
    SM();
    SA();
    Z7();
    Lq();
    Xq();
    wq();
    M4();
    $9 = t(P6(), 1)
})
// @from(Ln 414727, Col 0)
function yR1(A) {
    let q = A6(9),
        {
            session: K
        } = A;
    if (K.status === "completed") {
        let O;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = zr6.default.createElement(T, {
            bold: !0,
            color: "success",
            dimColor: !0
        }, "done"), q[0] = O;
        else O = q[0];
        return O
    }
    if (K.status === "failed") {
        let O;
        if (q[1] === Symbol.for("react.memo_cache_sentinel")) O = zr6.default.createElement(T, {
            bold: !0,
            color: "error",
            dimColor: !0
        }, "error"), q[1] = O;
        else O = q[1];
        return O
    }
    if (!K.todoList.length) {
        let O;
        if (q[2] !== K.status) O = zr6.default.createElement(T, {
            dimColor: !0
        }, K.status, "…"), q[2] = K.status, q[3] = O;
        else O = q[3];
        return O
    }
    let Y;
    if (q[4] !== K.todoList) Y = K.todoList.filter(V6z), q[4] = K.todoList, q[5] = Y;
    else Y = q[5];
    let z = Y.length,
        _ = K.todoList.length,
        w;
    if (q[6] !== z || q[7] !== _) w = zr6.default.createElement(T, {
        dimColor: !0
    }, z, "/", _), q[6] = z, q[7] = _, q[8] = w;
    else w = q[8];
    return w
}
// @from(Ln 414773, Col 0)
function V6z(A) {
    return A.status === "completed"
}
// @from(Ln 414776, Col 4)
zr6
// @from(Ln 414777, Col 4)
oc8 = E(() => {
    e6();
    i6();
    zr6 = t(P6(), 1)
})
// @from(Ln 414786, Col 0)
function LR1(A) {
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
                    uuid: q.uuid ?? k6z(),
                    timestamp: new Date().toISOString(),
                    isMeta: q.isSynthetic
                }];
            case "system":
                if (q.subtype === "compact_boundary") return [{
                    type: "system",
                    content: "Conversation compacted",
                    level: "info",
                    subtype: "compact_boundary",
                    compactMetadata: ac8(q.compact_metadata),
                    uuid: q.uuid,
                    timestamp: new Date().toISOString()
                }];
                return [];
            default:
                return []
        }
    })
}
// @from(Ln 414822, Col 0)
function RR1(A) {
    let q = A.preservedSegment;
    return {
        trigger: A.trigger,
        pre_tokens: A.preTokens,
        ...q && {
            preserved_segment: {
                head_uuid: q.headUuid,
                anchor_uuid: q.anchorUuid,
                tail_uuid: q.tailUuid
            }
        }
    }
}
// @from(Ln 414837, Col 0)
function ac8(A) {
    let q = A.preserved_segment;
    return {
        trigger: A.trigger,
        preTokens: A.pre_tokens,
        ...q && {
            preservedSegment: {
                headUuid: q.head_uuid,
                anchorUuid: q.anchor_uuid,
                tailUuid: q.tail_uuid
            }
        }
    }
}
// @from(Ln 414852, Col 0)
function hJq(A) {
    return A.flatMap((q) => {
        switch (q.type) {
            case "assistant":
                return [{
                    type: "assistant",
                    message: E6z(q),
                    session_id: R1(),
                    parent_tool_use_id: null,
                    uuid: q.uuid,
                    error: q.error
                }];
            case "user":
                return [{
                    type: "user",
                    message: q.message,
                    session_id: R1(),
                    parent_tool_use_id: null,
                    uuid: q.uuid,
                    isSynthetic: q.isMeta || q.isVisibleInTranscriptOnly,
                    ...q.toolUseResult !== void 0 ? {
                        tool_use_result: q.toolUseResult
                    } : {}
                }];
            case "system":
                if (q.subtype === "compact_boundary" && q.compactMetadata) return [{
                    type: "system",
                    subtype: "compact_boundary",
                    session_id: R1(),
                    uuid: q.uuid,
                    compact_metadata: RR1(q.compactMetadata)
                }];
                if (q.subtype === "local_command" && (q.content.includes(`<${WP}>`) || q.content.includes(`<${oA6}>`))) return [sc8(q.content, q.uuid)];
                return [];
            default:
                return []
        }
    })
}
// @from(Ln 414892, Col 0)
function sc8(A, q) {
    let K = sY(A).replace(/<local-command-stdout>([\s\S]*?)<\/local-command-stdout>/, "$1").replace(/<local-command-stderr>([\s\S]*?)<\/local-command-stderr>/, "$1").trim();
    return {
        type: "assistant",
        message: $Z({
            content: K
        }).message,
        parent_tool_use_id: null,
        session_id: R1(),
        uuid: q
    }
}
// @from(Ln 414905, Col 0)
function SJq(A) {
    if (!A) return;
    return {
        status: A.status,
        ...A.resetsAt !== void 0 && {
            resetsAt: A.resetsAt
        },
        ...A.rateLimitType !== void 0 && {
            rateLimitType: A.rateLimitType
        },
        ...A.utilization !== void 0 && {
            utilization: A.utilization
        },
        ...A.overageStatus !== void 0 && {
            overageStatus: A.overageStatus
        },
        ...A.overageResetsAt !== void 0 && {
            overageResetsAt: A.overageResetsAt
        },
        ...A.overageDisabledReason !== void 0 && {
            overageDisabledReason: A.overageDisabledReason
        },
        ...A.isUsingOverage !== void 0 && {
            isUsingOverage: A.isUsingOverage
        },
        ...A.surpassedThreshold !== void 0 && {
            surpassedThreshold: A.surpassedThreshold
        }
    }
}
// @from(Ln 414936, Col 0)
function E6z(A) {
    let q = A.message.content;
    if (!Array.isArray(q)) return A.message;
    let K = q.map((Y) => {
        if (Y.type !== "tool_use") return Y;
        if (Y.name === aJ) {
            let z = sJ();
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
// @from(Ln 414958, Col 4)
jN6 = E(() => {
    LG();
    T1();
    rH();
    vz();
    JA();
    VU();
    F9();
    Z7()
})