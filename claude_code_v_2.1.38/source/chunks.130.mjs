
// @from(Ln 323801, Col 0)
function SfY(A) {
    let q = e(23),
        {
            content: K,
            tools: Y,
            lookups: z,
            inProgressToolUseIDs: w,
            shouldAnimate: H,
            theme: $
        } = A,
        O, _;
    if (q[0] !== K || q[1] !== w || q[2] !== z || q[3] !== H || q[4] !== $ || q[5] !== Y) {
        _ = Symbol.for("react.early_return_sentinel");
        A: {
            let J;
            if (q[8] !== K) J = (U) => U.name === K.name,
            q[8] = K,
            q[9] = J;
            else J = q[9];
            let X = Y.find(J);
            if (!X) {
                _ = null;
                break A
            }
            let D;
            if (q[10] !== K.id || q[11] !== z.resolvedToolUseIDs) D = z.resolvedToolUseIDs.has(K.id),
            q[10] = K.id,
            q[11] = z.resolvedToolUseIDs,
            q[12] = D;
            else D = q[12];
            let j = D,
                M;
            if (q[13] !== K.id || q[14] !== z.erroredToolUseIDs) M = z.erroredToolUseIDs.has(K.id),
            q[13] = K.id,
            q[14] = z.erroredToolUseIDs,
            q[15] = M;
            else M = q[15];
            let P = M,
                W;
            if (q[16] !== K.id || q[17] !== w) W = w.has(K.id),
            q[16] = K.id,
            q[17] = w,
            q[18] = W;
            else W = q[18];
            let G = W,
                f = z.toolResultByToolUseID.get(K.id),
                Z = f?.type === "user" ? f.toolUseResult : void 0,
                N = X.outputSchema?.safeParse(Z),
                T = N?.success ? N.data : void 0,
                k = X.inputSchema.safeParse(K.input),
                y = k.success ? k.data : void 0,
                B = X.userFacingName(y),
                S = y ? X.renderToolUseMessage(y, {
                    theme: $,
                    verbose: !1
                }) : null,
                m = H && G,
                b = !j,
                g;
            if (q[19] !== P || q[20] !== m || q[21] !== b) g = Y2.default.createElement(rK1, {
                shouldAnimate: m,
                isUnresolved: b,
                isError: P
            }),
            q[19] = P,
            q[20] = m,
            q[21] = b,
            q[22] = g;
            else g = q[22];O = Y2.default.createElement(I, {
                key: K.id,
                flexDirection: "column",
                marginTop: 1
            }, Y2.default.createElement(I, {
                flexDirection: "row"
            }, g, Y2.default.createElement(V, {
                bold: !0
            }, B), S && Y2.default.createElement(V, null, "(", S, ")"), y && X.renderToolUseTag?.(y)), j && !P && T !== void 0 && Y2.default.createElement(I, null, X.renderToolResultMessage(T, [], {
                verbose: !1,
                tools: Y,
                theme: $
            })))
        }
        q[0] = K, q[1] = w, q[2] = z, q[3] = H, q[4] = $, q[5] = Y, q[6] = O, q[7] = _
    } else O = q[6], _ = q[7];
    if (_ !== Symbol.for("react.early_return_sentinel")) return _;
    return O
}
// @from(Ln 323889, Col 0)
function tx4(A) {
    let q = e(70),
        {
            message: K,
            inProgressToolUseIDs: Y,
            shouldAnimate: z,
            verbose: w,
            tools: H,
            lookups: $,
            isActiveGroup: O
        } = A,
        {
            searchCount: _,
            readCount: J,
            replCount: X,
            memorySearchCount: D,
            memoryReadCount: j,
            memoryWriteCount: M,
            messages: P
        } = K,
        [W] = T7(),
        G;
    if (q[0] !== $ || q[1] !== K) {
        let g;
        if (q[3] !== $) g = (U) => $.erroredToolUseIDs.has(U), q[3] = $, q[4] = g;
        else g = q[4];
        G = Fj1(K).some(g), q[0] = $, q[1] = K, q[2] = G
    } else G = q[2];
    let f = G,
        Z = D > 0 || j > 0 || M > 0,
        N = _ > 0 || J > 0 || X > 0;
    if (w) {
        let g;
        if (q[5] !== P) {
            g = [];
            for (let x of P)
                if (x.type === "assistant") g.push(x);
                else if (x.type === "grouped_tool_use") g.push(...x.messages);
            q[5] = P, q[6] = g
        } else g = q[6];
        let U;
        if (q[7] !== Y || q[8] !== $ || q[9] !== z || q[10] !== W || q[11] !== g || q[12] !== H) U = Y2.default.createElement(I, {
            flexDirection: "column"
        }, g.map((x) => {
            let p = x.message.content[0];
            if (p?.type !== "tool_use") return null;
            return Y2.default.createElement(SfY, {
                key: p.id,
                content: p,
                tools: H,
                lookups: $,
                inProgressToolUseIDs: Y,
                shouldAnimate: z,
                theme: W
            })
        })), q[7] = Y, q[8] = $, q[9] = z, q[10] = W, q[11] = g, q[12] = H, q[13] = U;
        else U = q[13];
        return U
    }
    if (!Z && !N) return null;
    let T;
    if (q[14] !== O || q[15] !== j || q[16] !== D || q[17] !== M || q[18] !== J || q[19] !== X || q[20] !== _) {
        if (T = [], j > 0) {
            let g = O ? T.length === 0 ? "Recalling" : "recalling" : T.length === 0 ? "Recalled" : "recalled",
                U;
            if (q[22] !== j) U = Y2.default.createElement(V, {
                bold: !0
            }, j), q[22] = j, q[23] = U;
            else U = q[23];
            let x = j === 1 ? "memory" : "memories",
                p;
            if (q[24] !== U || q[25] !== x || q[26] !== g) p = Y2.default.createElement(V, {
                key: "mem-read"
            }, g, " ", U, " ", x), q[24] = U, q[25] = x, q[26] = g, q[27] = p;
            else p = q[27];
            T.push(p)
        }
        if (D > 0) {
            let g = O ? T.length === 0 ? "Searching" : "searching" : T.length === 0 ? "Searched" : "searched";
            if (T.length > 0) {
                let p;
                if (q[28] === Symbol.for("react.memo_cache_sentinel")) p = Y2.default.createElement(V, {
                    key: "comma-ms"
                }, ", "), q[28] = p;
                else p = q[28];
                T.push(p)
            }
            let U = `${g} memories`,
                x;
            if (q[29] !== U) x = Y2.default.createElement(V, {
                key: "mem-search"
            }, U), q[29] = U, q[30] = x;
            else x = q[30];
            T.push(x)
        }
        if (M > 0) {
            let g = O ? T.length === 0 ? "Writing" : "writing" : T.length === 0 ? "Wrote" : "wrote";
            if (T.length > 0) {
                let l;
                if (q[31] === Symbol.for("react.memo_cache_sentinel")) l = Y2.default.createElement(V, {
                    key: "comma-mw"
                }, ", "), q[31] = l;
                else l = q[31];
                T.push(l)
            }
            let U;
            if (q[32] !== M) U = Y2.default.createElement(V, {
                bold: !0
            }, M), q[32] = M, q[33] = U;
            else U = q[33];
            let x = M === 1 ? "memory" : "memories",
                p;
            if (q[34] !== U || q[35] !== x || q[36] !== g) p = Y2.default.createElement(V, {
                key: "mem-write"
            }, g, " ", U, " ", x), q[34] = U, q[35] = x, q[36] = g, q[37] = p;
            else p = q[37];
            T.push(p)
        }
        if (_ > 0) {
            let g = O ? T.length === 0 ? "Searching for" : "searching for" : T.length === 0 ? "Searched for" : "searched for";
            if (T.length > 0) {
                let l;
                if (q[38] === Symbol.for("react.memo_cache_sentinel")) l = Y2.default.createElement(V, {
                    key: "comma-s"
                }, ", "), q[38] = l;
                else l = q[38];
                T.push(l)
            }
            let U;
            if (q[39] !== _) U = Y2.default.createElement(V, {
                bold: !0
            }, _), q[39] = _, q[40] = U;
            else U = q[40];
            let x = _ === 1 ? "pattern" : "patterns",
                p;
            if (q[41] !== g || q[42] !== U || q[43] !== x) p = Y2.default.createElement(V, {
                key: "search"
            }, g, " ", U, " ", x), q[41] = g, q[42] = U, q[43] = x, q[44] = p;
            else p = q[44];
            T.push(p)
        }
        if (J > 0) {
            let g = O ? T.length === 0 ? "Reading" : "reading" : T.length === 0 ? "Read" : "read";
            if (T.length > 0) {
                let l;
                if (q[45] === Symbol.for("react.memo_cache_sentinel")) l = Y2.default.createElement(V, {
                    key: "comma-r"
                }, ", "), q[45] = l;
                else l = q[45];
                T.push(l)
            }
            let U;
            if (q[46] !== J) U = Y2.default.createElement(V, {
                bold: !0
            }, J), q[46] = J, q[47] = U;
            else U = q[47];
            let x = J === 1 ? "file" : "files",
                p;
            if (q[48] !== g || q[49] !== U || q[50] !== x) p = Y2.default.createElement(V, {
                key: "read"
            }, g, " ", U, " ", x), q[48] = g, q[49] = U, q[50] = x, q[51] = p;
            else p = q[51];
            T.push(p)
        }
        if (X > 0) {
            let g = O ? "REPL'ing" : "REPL'd";
            if (T.length > 0) {
                let l;
                if (q[52] === Symbol.for("react.memo_cache_sentinel")) l = Y2.default.createElement(V, {
                    key: "comma-repl"
                }, ", "), q[52] = l;
                else l = q[52];
                T.push(l)
            }
            let U;
            if (q[53] !== X) U = Y2.default.createElement(V, {
                bold: !0
            }, X), q[53] = X, q[54] = U;
            else U = q[54];
            let x = X === 1 ? "time" : "times",
                p;
            if (q[55] !== g || q[56] !== U || q[57] !== x) p = Y2.default.createElement(V, {
                key: "repl"
            }, g, " ", U, " ", x), q[55] = g, q[56] = U, q[57] = x, q[58] = p;
            else p = q[58];
            T.push(p)
        }
        if (O) {
            let g;
            if (q[59] === Symbol.for("react.memo_cache_sentinel")) g = Y2.default.createElement(V, {
                key: "ellipsis"
            }, "…"), q[59] = g;
            else g = q[59];
            T.push(g)
        }
        q[14] = O, q[15] = j, q[16] = D, q[17] = M, q[18] = J, q[19] = X, q[20] = _, q[21] = T
    } else T = q[21];
    let k = !!O,
        y = !!O,
        B;
    if (q[60] !== f || q[61] !== k || q[62] !== y) B = Y2.default.createElement(rK1, {
        shouldAnimate: k,
        isUnresolved: y,
        isError: f
    }), q[60] = f, q[61] = k, q[62] = y, q[63] = B;
    else B = q[63];
    let S;
    if (q[64] === Symbol.for("react.memo_cache_sentinel")) S = Y2.default.createElement(aS, null), q[64] = S;
    else S = q[64];
    let m;
    if (q[65] !== T) m = Y2.default.createElement(V, null, T, " ", S), q[65] = T, q[66] = m;
    else m = q[66];
    let b;
    if (q[67] !== B || q[68] !== m) b = Y2.default.createElement(I, {
        flexDirection: "row",
        marginTop: 1
    }, B, m), q[67] = B, q[68] = m, q[69] = b;
    else b = q[69];
    return b
}
// @from(Ln 324109, Col 4)
Y2
// @from(Ln 324110, Col 4)
ex4 = v(() => {
    i1();
    m1();
    JX6();
    no();
    Eh();
    Y2 = o(X1(), 1)
})
// @from(Ln 324119, Col 0)
function Ab4(A) {
    let q = e(24),
        {
            message: K,
            screen: Y
        } = A,
        z = Y === "transcript",
        w;
    if (q[0] !== K) w = ZQ1(K) || "", q[0] = K, q[1] = w;
    else w = q[1];
    let H = w,
        $ = K.summarizeMetadata;
    if ($) {
        let j;
        if (q[2] === Symbol.for("react.memo_cache_sentinel")) j = rK.createElement(I, {
            minWidth: 2
        }, rK.createElement(V, {
            color: "text"
        }, gY)), q[2] = j;
        else j = q[2];
        let M;
        if (q[3] === Symbol.for("react.memo_cache_sentinel")) M = rK.createElement(V, {
            bold: !0
        }, "Summarized conversation"), q[3] = M;
        else M = q[3];
        let P;
        if (q[4] !== z || q[5] !== $) P = !z && rK.createElement(HA, null, rK.createElement(I, {
            flexDirection: "column"
        }, rK.createElement(V, {
            dimColor: !0
        }, "Summarized ", $.messagesSummarized, " messages from this point"), $.userContext && rK.createElement(V, {
            dimColor: !0
        }, "Context: ", "“", $.userContext, "”"), rK.createElement(V, {
            dimColor: !0
        }, rK.createElement(NA, {
            action: "app:toggleTranscript",
            context: "Global",
            fallback: "ctrl+o",
            description: "expand history",
            parens: !0
        })))), q[4] = z, q[5] = $, q[6] = P;
        else P = q[6];
        let W;
        if (q[7] !== z || q[8] !== H) W = z && rK.createElement(HA, null, rK.createElement(V, null, H)), q[7] = z, q[8] = H, q[9] = W;
        else W = q[9];
        let G;
        if (q[10] !== P || q[11] !== W) G = rK.createElement(I, {
            flexDirection: "column",
            marginTop: 1
        }, rK.createElement(I, {
            flexDirection: "row"
        }, j, rK.createElement(I, {
            flexDirection: "column"
        }, M, P, W))), q[10] = P, q[11] = W, q[12] = G;
        else G = q[12];
        return G
    }
    let O;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) O = rK.createElement(I, {
        minWidth: 2
    }, rK.createElement(V, {
        color: "text"
    }, gY)), q[13] = O;
    else O = q[13];
    let _;
    if (q[14] !== z) _ = !z && rK.createElement(V, {
        dimColor: !0
    }, " ", rK.createElement(NA, {
        action: "app:toggleTranscript",
        context: "Global",
        fallback: "ctrl+o",
        description: "expand",
        parens: !0
    })), q[14] = z, q[15] = _;
    else _ = q[15];
    let J;
    if (q[16] !== _) J = rK.createElement(I, {
        flexDirection: "row"
    }, O, rK.createElement(I, {
        flexDirection: "column"
    }, rK.createElement(V, {
        bold: !0
    }, "Compact summary", _))), q[16] = _, q[17] = J;
    else J = q[17];
    let X;
    if (q[18] !== z || q[19] !== H) X = z && rK.createElement(HA, null, rK.createElement(V, null, H)), q[18] = z, q[19] = H, q[20] = X;
    else X = q[20];
    let D;
    if (q[21] !== J || q[22] !== X) D = rK.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, J, X), q[21] = J, q[22] = X, q[23] = D;
    else D = q[23];
    return D
}
// @from(Ln 324214, Col 4)
rK
// @from(Ln 324215, Col 4)
qb4 = v(() => {
    i1();
    m1();
    N8();
    jW();
    eq();
    BK();
    rK = o(X1(), 1)
})
// @from(Ln 324225, Col 0)
function hfY({
    message: A,
    lookups: q,
    addMargin: K,
    tools: Y,
    commands: z,
    verbose: w,
    inProgressToolUseIDs: H,
    progressMessagesForMessage: $,
    shouldAnimate: O,
    shouldShowDot: _,
    style: J,
    width: X,
    isTranscriptMode: D,
    onOpenRateLimitOptions: j,
    isActiveCollapsedGroup: M,
    isUserContinuation: P = !1,
    lastThinkingBlockId: W,
    latestBashOutputUUID: G
}) {
    switch (A.type) {
        case "attachment":
            return m5.createElement(gx4, {
                addMargin: K,
                attachment: A.attachment,
                verbose: w,
                isTranscriptMode: D
            });
        case "assistant":
            return m5.createElement(I, {
                flexDirection: "column",
                width: "100%"
            }, A.message.content.map((f, Z) => m5.createElement(xfY, {
                key: Z,
                param: f,
                addMargin: K,
                tools: Y,
                commands: z,
                verbose: w,
                inProgressToolUseIDs: H,
                progressMessagesForMessage: $,
                shouldAnimate: O,
                shouldShowDot: _,
                width: X,
                inProgressToolCallCount: H.size,
                isTranscriptMode: D,
                lookups: q,
                onOpenRateLimitOptions: j,
                thinkingBlockId: `${A.uuid}:${Z}`,
                lastThinkingBlockId: W
            })));
        case "user": {
            if (A.isCompactSummary) return m5.createElement(Ab4, {
                message: A,
                screen: D ? "transcript" : "prompt"
            });
            let f = 0,
                Z = G === A.uuid,
                N = m5.createElement(I, {
                    flexDirection: "column",
                    width: "100%"
                }, A.message.content.map((T, k) => {
                    let y;
                    if (T.type === "image") y = A.imagePasteIds?.[f], f++;
                    return m5.createElement(IfY, {
                        key: k,
                        message: A,
                        addMargin: K,
                        tools: Y,
                        progressMessagesForMessage: $,
                        param: T,
                        style: J,
                        verbose: w,
                        imageIndex: y ?? f,
                        isUserContinuation: P,
                        lookups: q,
                        isTranscriptMode: D
                    })
                }));
            return Z ? m5.createElement(zR7, null, N) : N
        }
        case "system":
            if (A.subtype === "compact_boundary") return m5.createElement(nx4, null);
            if (A.subtype === "microcompact_boundary") return null;
            if (A.subtype === "local_command") return m5.createElement($51, {
                addMargin: K,
                param: {
                    type: "text",
                    text: A.content
                },
                verbose: w
            });
            return m5.createElement(lx4, {
                message: A,
                addMargin: K,
                verbose: w
            });
        case "grouped_tool_use":
            return m5.createElement(ax4, {
                message: A,
                tools: Y,
                lookups: q,
                inProgressToolUseIDs: H,
                shouldAnimate: O
            });
        case "collapsed_read_search":
            return m5.createElement(tx4, {
                message: A,
                inProgressToolUseIDs: H,
                shouldAnimate: O,
                verbose: w,
                tools: Y,
                lookups: q,
                isActiveGroup: M
            })
    }
}
// @from(Ln 324343, Col 0)
function IfY(A) {
    let q = e(20),
        {
            message: K,
            addMargin: Y,
            tools: z,
            progressMessagesForMessage: w,
            param: H,
            style: $,
            verbose: O,
            imageIndex: _,
            isUserContinuation: J,
            lookups: X,
            isTranscriptMode: D
        } = A,
        {
            columns: j
        } = Z8();
    switch (H.type) {
        case "text": {
            let M;
            if (q[0] !== Y || q[1] !== D || q[2] !== K.planContent || q[3] !== K.thinkingMetadata || q[4] !== H || q[5] !== O) M = m5.createElement($51, {
                addMargin: Y,
                param: H,
                verbose: O,
                thinkingMetadata: K.thinkingMetadata,
                planContent: K.planContent,
                isTranscriptMode: D
            }), q[0] = Y, q[1] = D, q[2] = K.planContent, q[3] = K.thinkingMetadata, q[4] = H, q[5] = O, q[6] = M;
            else M = q[6];
            return M
        }
        case "image": {
            let M = Y && !J,
                P;
            if (q[7] !== _ || q[8] !== M) P = m5.createElement(yM6, {
                imageId: _,
                addMargin: M
            }), q[7] = _, q[8] = M, q[9] = P;
            else P = q[9];
            return P
        }
        case "tool_result": {
            let M = j - 5,
                P;
            if (q[10] !== D || q[11] !== X || q[12] !== K || q[13] !== H || q[14] !== w || q[15] !== $ || q[16] !== M || q[17] !== z || q[18] !== O) P = m5.createElement(T74, {
                param: H,
                message: K,
                lookups: X,
                progressMessagesForMessage: w,
                style: $,
                tools: z,
                verbose: O,
                width: M,
                isTranscriptMode: D
            }), q[10] = D, q[11] = X, q[12] = K, q[13] = H, q[14] = w, q[15] = $, q[16] = M, q[17] = z, q[18] = O, q[19] = P;
            else P = q[19];
            return P
        }
        default:
            return
    }
}
// @from(Ln 324407, Col 0)
function xfY(A) {
    let q = e(27),
        {
            param: K,
            addMargin: Y,
            tools: z,
            commands: w,
            verbose: H,
            inProgressToolUseIDs: $,
            progressMessagesForMessage: O,
            shouldAnimate: _,
            shouldShowDot: J,
            width: X,
            inProgressToolCallCount: D,
            isTranscriptMode: j,
            lookups: M,
            onOpenRateLimitOptions: P,
            thinkingBlockId: W,
            lastThinkingBlockId: G
        } = A,
        f;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) f = !1, q[0] = f;
    else f = q[0];
    let Z = f;
    switch (K.type) {
        case "tool_use": {
            let N;
            if (q[1] !== Y || q[2] !== w || q[3] !== D || q[4] !== $ || q[5] !== j || q[6] !== M || q[7] !== K || q[8] !== O || q[9] !== _ || q[10] !== J || q[11] !== z || q[12] !== H) N = m5.createElement(R74, {
                param: K,
                addMargin: Y,
                tools: z,
                commands: w,
                verbose: H,
                inProgressToolUseIDs: $,
                progressMessagesForMessage: O,
                shouldAnimate: _,
                shouldShowDot: J,
                inProgressToolCallCount: D,
                lookups: M,
                isTranscriptMode: j
            }), q[1] = Y, q[2] = w, q[3] = D, q[4] = $, q[5] = j, q[6] = M, q[7] = K, q[8] = O, q[9] = _, q[10] = J, q[11] = z, q[12] = H, q[13] = N;
            else N = q[13];
            return N
        }
        case "text": {
            let N;
            if (q[14] !== Y || q[15] !== P || q[16] !== K || q[17] !== J || q[18] !== X) N = m5.createElement(cI4, {
                param: K,
                addMargin: Y,
                shouldShowDot: J,
                width: X,
                onOpenRateLimitOptions: P
            }), q[14] = Y, q[15] = P, q[16] = K, q[17] = J, q[18] = X, q[19] = N;
            else N = q[19];
            return N
        }
        case "redacted_thinking": {
            if (!j && !Z) return null;
            let N;
            if (q[20] !== Y) N = m5.createElement(Bx4, {
                addMargin: Y
            }), q[20] = Y, q[21] = N;
            else N = q[21];
            return N
        }
        case "thinking": {
            if (!j && !Z) return null;
            let T = j && !(!G || W === G) && !Z,
                k;
            if (q[22] !== Y || q[23] !== j || q[24] !== K || q[25] !== T) k = m5.createElement(CM6, {
                addMargin: Y,
                param: K,
                isTranscriptMode: j,
                hideInTranscript: T
            }), q[22] = Y, q[23] = j, q[24] = K, q[25] = T, q[26] = k;
            else k = q[26];
            return k
        }
        default:
            return K1(Error(`Unable to render message type: ${K.type}`)), null
    }
}
// @from(Ln 324490, Col 0)
function bfY(A, q) {
    if (A.message.uuid !== q.message.uuid) return !1;
    if (A.lastThinkingBlockId !== q.lastThinkingBlockId) return !1;
    let K = A.latestBashOutputUUID === A.message.uuid,
        Y = q.latestBashOutputUUID === q.message.uuid;
    if (K !== Y) return !1;
    if (A.isStatic && q.isStatic) return !0;
    return !1
}
// @from(Ln 324499, Col 4)
m5
// @from(Ln 324499, Col 8)
pR
// @from(Ln 324500, Col 4)
nP1 = v(() => {
    i1();
    m1();
    y6();
    cA();
    v74();
    y74();
    lI4();
    RM6();
    cvA();
    lvA();
    mx4();
    mq();
    Ux4();
    ix4();
    rx4();
    ox4();
    sx4();
    ex4();
    EOA();
    qb4();
    m5 = o(X1(), 1);
    pR = m5.memo(hfY, bfY)
})
// @from(Ln 324525, Col 0)
function Kb4(A) {
    let q = e(33),
        {
            agentType: K,
            description: Y,
            descriptionColor: z,
            taskDescription: w,
            toolUseCount: H,
            tokens: $,
            color: O,
            isLast: _,
            isResolved: J,
            isAsync: X,
            lastToolInfo: D,
            hideType: j
        } = A,
        M = X === void 0 ? !1 : X,
        P = j === void 0 ? !1 : j,
        W = _ ? "└─" : "├─",
        G = M && J,
        f;
    if (q[0] !== G || q[1] !== J || q[2] !== D || q[3] !== w) f = () => {
        if (!J) return D || "Initializing…";
        if (G) return N5.createElement(V, null, w ?? "Running in the background", " ", N5.createElement(YA, {
            shortcut: "shift+↑",
            action: "manage",
            parens: !0
        }));
        return "Done"
    }, q[0] = G, q[1] = J, q[2] = D, q[3] = w, q[4] = f;
    else f = q[4];
    let Z = f,
        N = !J,
        T;
    if (q[5] !== K || q[6] !== O || q[7] !== Y || q[8] !== z || q[9] !== P) T = P ? N5.createElement(V, {
        bold: !0
    }, Y || K) : N5.createElement(N5.Fragment, null, N5.createElement(V, {
        bold: !0,
        backgroundColor: O,
        color: O ? "inverseText" : void 0
    }, K), Y && N5.createElement(N5.Fragment, null, " (", N5.createElement(V, {
        backgroundColor: z,
        color: z ? "inverseText" : void 0
    }, Y), ")")), q[5] = K, q[6] = O, q[7] = Y, q[8] = z, q[9] = P, q[10] = T;
    else T = q[10];
    let k;
    if (q[11] !== G || q[12] !== $ || q[13] !== H) k = !G && N5.createElement(N5.Fragment, null, " · ", H, " tool ", H === 1 ? "use" : "uses", $ !== null && N5.createElement(N5.Fragment, null, " · ", Y3($), " tokens")), q[11] = G, q[12] = $, q[13] = H, q[14] = k;
    else k = q[14];
    let y;
    if (q[15] !== N || q[16] !== T || q[17] !== k || q[18] !== W) y = N5.createElement(I, {
        paddingLeft: 3
    }, N5.createElement(V, {
        dimColor: N
    }, W, " ", T, k)), q[15] = N, q[16] = T, q[17] = k, q[18] = W, q[19] = y;
    else y = q[19];
    let B = !J,
        S = _ ? " " : "│",
        m;
    if (q[20] !== B || q[21] !== S) m = N5.createElement(V, {
        dimColor: B
    }, S), q[20] = B, q[21] = S, q[22] = m;
    else m = q[22];
    let b;
    if (q[23] !== Z) b = Z(), q[23] = Z, q[24] = b;
    else b = q[24];
    let g;
    if (q[25] !== b) g = N5.createElement(HA, null, N5.createElement(V, {
        dimColor: !0
    }, b)), q[25] = b, q[26] = g;
    else g = q[26];
    let U;
    if (q[27] !== m || q[28] !== g) U = N5.createElement(I, {
        paddingLeft: 3,
        flexDirection: "row"
    }, m, g), q[27] = m, q[28] = g, q[29] = U;
    else U = q[29];
    let x;
    if (q[30] !== U || q[31] !== y) x = N5.createElement(I, {
        flexDirection: "column"
    }, y, U), q[30] = U, q[31] = y, q[32] = x;
    else x = q[32];
    return x
}
// @from(Ln 324608, Col 4)
N5
// @from(Ln 324609, Col 4)
Yb4 = v(() => {
    i1();
    m1();
    vq();
    eq();
    wK();
    N5 = o(X1(), 1)
})
// @from(Ln 324618, Col 0)
function wb4(A, q) {
    let K = A.data.message;
    if (K.type === "assistant") return KB1(K.message.content[0], q);
    if (K.type === "user") {
        let Y = K.message.content[0];
        if (Y?.type === "tool_result") {
            let z = Y.tool_use_id;
            for (let w of A.data.normalizedMessages)
                if (w.type === "assistant") {
                    let H = w.message.content.find(($) => $.type === "tool_use" && $.id === z);
                    if (H) return KB1(H, q)
                }
        }
    }
    return null
}
// @from(Ln 324635, Col 0)
function BfY(A, q, K) {
    return A.map((H) => ({
        type: "original",
        message: H
    }));

    function w(H) {
        if (z && (z.searchCount > 0 || z.readCount > 0 || z.replCount > 0)) Y.push({
            type: "summary",
            searchCount: z.searchCount,
            readCount: z.readCount,
            replCount: z.replCount,
            uuid: `summary-${z.startUuid}`,
            isActive: H
        });
        z = null
    }
}
// @from(Ln 324654, Col 0)
function fQ1(A) {
    let q = e(3),
        {
            prompt: K,
            dim: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = QA.createElement(V, {
        color: "success",
        bold: !0
    }, "Prompt:"), q[0] = z;
    else z = q[0];
    let w;
    if (q[1] !== K) w = QA.createElement(I, {
        flexDirection: "column"
    }, z, QA.createElement(I, {
        paddingLeft: 2
    }, QA.createElement(TJ, null, K))), q[1] = K, q[2] = w;
    else w = q[2];
    return w
}
// @from(Ln 324676, Col 0)
function nvA(A) {
    let q = e(5),
        {
            content: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = QA.createElement(V, {
        color: "success",
        bold: !0
    }, "Response:"), q[0] = Y;
    else Y = q[0];
    let z;
    if (q[1] !== K) z = K.map(QfY), q[1] = K, q[2] = z;
    else z = q[2];
    let w;
    if (q[3] !== z) w = QA.createElement(I, {
        flexDirection: "column"
    }, Y, z), q[3] = z, q[4] = w;
    else w = q[4];
    return w
}
// @from(Ln 324698, Col 0)
function QfY(A, q) {
    return QA.createElement(I, {
        key: q,
        paddingLeft: 2,
        marginTop: q === 0 ? 0 : 1
    }, QA.createElement(TJ, null, A.text))
}
// @from(Ln 324706, Col 0)
function Hb4(A, q, {
    tools: K,
    verbose: Y,
    theme: z
}) {
    if (A.status === "async_launched") {
        let {
            prompt: P
        } = A;
        return QA.createElement(I, {
            flexDirection: "column"
        }, QA.createElement(HA, {
            height: 1
        }, QA.createElement(V, null, "Backgrounded agent", !Y && QA.createElement(V, {
            dimColor: !0
        }, " (", QA.createElement(oA, null, QA.createElement(YA, {
            shortcut: "shift+↑",
            action: "manage"
        }), P && QA.createElement(NA, {
            action: "app:toggleTranscript",
            context: "Global",
            fallback: "ctrl+o",
            description: "expand"
        })), ")"))), Y && P && QA.createElement(HA, null, QA.createElement(fQ1, {
            prompt: P,
            theme: z
        })))
    }
    if (A.status !== "completed") return null;
    let {
        agentId: w,
        totalDurationMs: H,
        totalToolUseCount: $,
        totalTokens: O,
        usage: _,
        content: J,
        prompt: X
    } = A, j = `Done (${[$===1?"1 tool use":`${$} tool uses`,Y3(O)+" tokens",Xz(H)].join(" · ")})`, M = qR({
        content: j,
        usage: {
            ..._,
            inference_geo: null,
            iterations: null
        }
    });
    return QA.createElement(I, {
        flexDirection: "column"
    }, !1, Y && X && QA.createElement(HA, null, QA.createElement(fQ1, {
        prompt: X,
        theme: z
    })), Y ? QA.createElement(mx1, null, q.map((P) => QA.createElement(HA, {
        key: P.uuid
    }, QA.createElement(pR, {
        message: P.data.message,
        lookups: vm,
        addMargin: !1,
        tools: K,
        commands: [],
        verbose: Y,
        inProgressToolUseIDs: new Set,
        progressMessagesForMessage: q,
        shouldAnimate: !1,
        shouldShowDot: !1,
        isTranscriptMode: !1,
        isStatic: !0
    })))) : null, Y && J && J.length > 0 && QA.createElement(HA, null, QA.createElement(nvA, {
        content: J,
        theme: z
    })), QA.createElement(HA, {
        height: 1
    }, QA.createElement(pR, {
        message: M,
        lookups: vm,
        addMargin: !1,
        tools: K,
        commands: [],
        verbose: Y,
        inProgressToolUseIDs: new Set,
        progressMessagesForMessage: [],
        shouldAnimate: !1,
        shouldShowDot: !1,
        isTranscriptMode: !1,
        isStatic: !0
    })))
}
// @from(Ln 324792, Col 0)
function $b4({
    description: A,
    prompt: q
}) {
    if (KY()) return null;
    if (!A || !q) return null;
    return A
}
// @from(Ln 324801, Col 0)
function Ob4(A) {
    let q = [];
    if (A.resume) q.push(QA.createElement(I, {
        key: "resume",
        flexWrap: "nowrap",
        marginLeft: 1
    }, QA.createElement(V, {
        dimColor: !0
    }, "resuming ", A.resume)));
    if (A.model) {
        let K = t9(A.model),
            Y = l3();
        if (K !== Y) q.push(QA.createElement(I, {
            key: "model",
            flexWrap: "nowrap",
            marginLeft: 1
        }, QA.createElement(V, {
            dimColor: !0
        }, dG(K))))
    }
    if (q.length === 0) return null;
    return QA.createElement(QA.Fragment, null, q)
}
// @from(Ln 324825, Col 0)
function rP1(A, {
    tools: q,
    verbose: K,
    terminalSize: Y,
    inProgressToolCallCount: z
}) {
    if (!A.length) return QA.createElement(HA, {
        height: 1
    }, QA.createElement(V, {
        dimColor: !0
    }, gfY));
    let w = (z ?? 1) * mfY + FfY,
        H = !K && Y && Y.rows && Y.rows < w,
        $ = () => {
            let D = A.filter((P) => {
                    return P.data.message.message.content.some((G) => G.type === "tool_use")
                }).length,
                j = [...A].reverse().find((P) => P.data.message.type === "assistant"),
                M = null;
            if (j?.data.message.type === "assistant") {
                let P = j.data.message.message.usage;
                M = (P.cache_creation_input_tokens ?? 0) + (P.cache_read_input_tokens ?? 0) + P.input_tokens + P.output_tokens
            }
            return {
                toolUseCount: D,
                tokens: M
            }
        };
    if (H) {
        let {
            toolUseCount: D,
            tokens: j
        } = $();
        return QA.createElement(HA, {
            height: 1
        }, QA.createElement(V, {
            dimColor: !0
        }, "In progress… · ", QA.createElement(V, {
            bold: !0
        }, D), " tool", " ", D === 1 ? "use" : "uses", j && ` · ${Y3(j)} tokens`, " ·", " ", QA.createElement(NA, {
            action: "app:toggleTranscript",
            context: "Global",
            fallback: "ctrl+o",
            description: "expand",
            parens: !0
        })))
    }
    let O = BfY(A, q, !0),
        _ = K ? O : O.slice(-ufY),
        J = O.length - _.length,
        X = A[0]?.data.prompt;
    return QA.createElement(HA, null, QA.createElement(I, {
        flexDirection: "column"
    }, QA.createElement(mx1, null, K && X && QA.createElement(I, {
        marginBottom: 1
    }, QA.createElement(fQ1, {
        prompt: X
    })), _.map((D) => {
        if (D.type === "summary") {
            let j = b_6(D.searchCount, D.readCount, D.isActive, D.replCount);
            return QA.createElement(I, {
                key: D.uuid,
                height: 1,
                overflow: "hidden"
            }, QA.createElement(V, {
                dimColor: !0
            }, j))
        }
        return QA.createElement(I, {
            key: D.message.uuid,
            height: 1,
            overflow: "hidden"
        }, QA.createElement(pR, {
            message: D.message.data.message,
            lookups: vm,
            addMargin: !1,
            tools: q,
            commands: [],
            verbose: K,
            inProgressToolUseIDs: new Set,
            progressMessagesForMessage: A,
            shouldAnimate: !1,
            shouldShowDot: !1,
            style: "condensed",
            isTranscriptMode: !1,
            isStatic: !0
        }))
    })), J > 0 && QA.createElement(V, {
        dimColor: !0
    }, "+", J, " more tool ", J === 1 ? "use" : "uses", " ", QA.createElement(aS, null))))
}
// @from(Ln 324917, Col 0)
function _b4(A, {
    progressMessagesForMessage: q,
    tools: K,
    verbose: Y
}) {
    let z = q[0]?.data?.agentId;
    return QA.createElement(QA.Fragment, null, !1, rP1(q, {
        tools: K,
        verbose: Y
    }), QA.createElement(Y9, null))
}
// @from(Ln 324929, Col 0)
function Jb4(A, {
    progressMessagesForMessage: q,
    tools: K,
    verbose: Y
}) {
    return QA.createElement(QA.Fragment, null, rP1(q, {
        tools: K,
        verbose: Y
    }), QA.createElement(z5, {
        result: A,
        verbose: Y
    }))
}
// @from(Ln 324943, Col 0)
function UfY(A) {
    let q = A.filter((z) => {
            let w = z.data.message;
            return w.type === "user" && w.message.content.some((H) => H.type === "tool_result")
        }).length,
        K = [...A].reverse().find((z) => z.data.message.type === "assistant"),
        Y = null;
    if (K?.data.message.type === "assistant") {
        let z = K.data.message.message.usage;
        Y = (z.cache_creation_input_tokens ?? 0) + (z.cache_read_input_tokens ?? 0) + z.input_tokens + z.output_tokens
    }
    return {
        toolUseCount: q,
        tokens: Y
    }
}
// @from(Ln 324960, Col 0)
function Xb4(A, q) {
    if (KY()) return null;
    let {
        shouldAnimate: K,
        tools: Y
    } = q, z = A.map(({
        param: X,
        isResolved: D,
        isError: j,
        progressMessages: M,
        result: P
    }) => {
        let W = UfY(M),
            G = pfY(M, Y),
            f = avA().safeParse(X.input),
            Z = P?.output?.status === "teammate_spawned",
            N, T, k, y, B;
        if (Z && f.success && f.data.name) {
            N = `@${f.data.name}`;
            let g = f.data.subagent_type;
            T = zb4(g) ? g : void 0, B = f.data.description, y = zb4(g) ? IK1(g) : void 0
        } else N = f.success ? rvA(f.data) : "Task", T = f.success ? f.data.description : void 0, k = f.success ? ovA(f.data) : void 0, B = void 0;
        let S = f.success && "run_in_background" in f.data && f.data.run_in_background === !0,
            m = P?.output?.status === "async_launched",
            b = S || m || Z;
        return {
            id: X.id,
            agentType: N,
            description: T,
            toolUseCount: W.toolUseCount,
            tokens: W.tokens,
            isResolved: D,
            isError: j,
            isAsync: b,
            color: k,
            descriptionColor: y,
            lastToolInfo: G,
            taskDescription: B
        }
    }), w = A.some((X) => !X.isResolved), H = A.some((X) => X.isError), $ = !w, O = z.length > 0 && z.every((X) => X.agentType === z[0]?.agentType), _ = O ? z[0]?.agentType : null, J = z.every((X) => X.isAsync);
    return QA.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, QA.createElement(I, {
        flexDirection: "row"
    }, QA.createElement(rK1, {
        shouldAnimate: K && w,
        isUnresolved: w,
        isError: H
    }), QA.createElement(V, null, $ ? QA.createElement(QA.Fragment, null, QA.createElement(V, {
        bold: !0
    }, A.length), " ", _ ? `${_} agents` : "agents", " ", J ? "launched" : "finished") : QA.createElement(QA.Fragment, null, "Running ", QA.createElement(V, {
        bold: !0
    }, A.length), " ", _ ? `${_} agents` : "agents", "…"), " "), QA.createElement(aS, null)), z.map((X, D) => QA.createElement(Kb4, {
        key: X.id,
        agentType: X.agentType,
        description: X.description,
        descriptionColor: X.descriptionColor,
        taskDescription: X.taskDescription,
        toolUseCount: X.toolUseCount,
        tokens: X.tokens,
        color: X.color,
        isLast: D === z.length - 1,
        isResolved: X.isResolved,
        isError: X.isError,
        isAsync: X.isAsync,
        shouldAnimate: K,
        lastToolInfo: X.lastToolInfo,
        hideType: O
    })))
}
// @from(Ln 325032, Col 0)
function rvA(A) {
    if (A?.subagent_type && A.subagent_type !== ZB1.agentType) {
        if (A.subagent_type === "worker") return "Task";
        return A.subagent_type
    }
    return "Task"
}
// @from(Ln 325040, Col 0)
function ovA(A) {
    if (!A?.subagent_type) return;
    return IK1(A.subagent_type)
}
// @from(Ln 325045, Col 0)
function pfY(A, q) {
    let K = 0,
        Y = 0;
    for (let w = A.length - 1; w >= 0; w--) {
        let H = A[w],
            $ = wb4(H, q);
        if ($ && ($.isSearch || $.isRead)) {
            if (H.data.message.type === "user") {
                if ($.isSearch) K++;
                else if ($.isRead) Y++
            }
        } else break
    }
    if (K + Y >= 2) return b_6(K, Y, !0);
    let z = [...A].reverse().find((w) => {
        let H = w.data.message;
        return H.type === "user" && H.message.content.some(($) => $.type === "tool_result")
    });
    if (z?.data.message.type === "user") {
        let w = z.data.message.message.content.find((H) => H.type === "tool_result");
        if (w?.type === "tool_result") {
            let H = w.tool_use_id,
                $ = A.find((O) => {
                    let _ = O.data.message;
                    return _.type === "assistant" && _.message.content.some((J) => J.type === "tool_use" && J.id === H)
                });
            if ($?.data.message.type === "assistant") {
                let O = $.data.message.message.content.find((_) => _.type === "tool_use" && _.id === H);
                if (O?.type === "tool_use") {
                    let _ = q.find((j) => j.name === O.name);
                    if (!_) return O.name;
                    let J = O.input,
                        X = _.inputSchema.safeParse(J),
                        D = _.userFacingName(X.success ? X.data : void 0);
                    if (_.getToolUseSummary) {
                        let j = _.getToolUseSummary(X.success ? X.data : void 0);
                        if (j) return `${D}: ${j}`
                    }
                    return D
                }
            }
        }
    }
    return null
}
// @from(Ln 325091, Col 0)
function zb4(A) {
    return !!A && A !== ZB1.agentType && A !== "worker"
}
// @from(Ln 325094, Col 4)
QA
// @from(Ln 325094, Col 8)
ufY = 3
// @from(Ln 325095, Col 4)
mfY = 9
// @from(Ln 325096, Col 4)
FfY = 7
// @from(Ln 325097, Col 4)
gfY = "Initializing…"
// @from(Ln 325098, Col 4)
hM6 = v(() => {
    i1();
    m1();
    CX();
    UO();
    vq();
    uh();
    eq();
    nP1();
    N8();
    aMA();
    cM();
    lM();
    no();
    wK();
    BK();
    HK();
    JX6();
    Yb4();
    MJ6();
    oj1();
    wq();
    Eh();
    e7();
    QA = o(X1(), 1)
})
// @from(Ln 325125, Col 0)
function Db4(A) {
    let q = A.trim();
    if (!q.startsWith("/")) return null;
    let Y = q.slice(1).split(" ");
    if (!Y[0]) return null;
    let z = Y[0],
        w = !1,
        H = 1;
    if (Y.length > 1 && Y[1] === "(MCP)") z = z + " (MCP)", w = !0, H = 2;
    let $ = Y.slice(H).join(" ");
    return {
        commandName: z,
        args: $,
        isMcp: w
    }
}
// @from(Ln 325142, Col 0)
function IM6(A, q, K, Y, z) {
    let w = 0;
    for (let H of ax) {
        let $ = K[H];
        if (!$) continue;
        for (let O of $)
            for (let _ of O.hooks) {
                let J = _.once ? () => {
                    h(`Removing one-shot hook for event ${H} in skill '${Y}'`), hk7(A, q, H, _)
                } : void 0;
                Mw6(A, q, H, O.matcher || "", _, J, z), w++
            }
    }
    if (w > 0) h(`Registered ${w} hooks from skill '${Y}'`)
}
// @from(Ln 325157, Col 4)
svA = v(() => {
    sw1();
    eU();
    Z6()
})
// @from(Ln 325163, Col 0)
function xM6(A) {
    let K = f6().skillUsage?.[A],
        Y = Date.now(),
        z = (K?.usageCount ?? 0) + 1;
    if (!K || K.usageCount !== z || K.lastUsedAt !== Y) jA((w) => ({
        ...w,
        skillUsage: {
            ...w.skillUsage,
            [A]: {
                usageCount: z,
                lastUsedAt: Y
            }
        }
    }))
}
// @from(Ln 325179, Col 0)
function bM6(A) {
    let K = f6().skillUsage?.[A];
    if (!K) return 0;
    let Y = (Date.now() - K.lastUsedAt) / 86400000,
        z = Math.pow(0.5, Y / 7);
    return K.usageCount * Math.max(z, 0.1)
}
// @from(Ln 325186, Col 4)
uM6 = v(() => {
    cA()
})
// @from(Ln 325192, Col 0)
async function cfY(A, q, K, Y, z, w) {
    let H = NR();
    c("tengu_slash_command_forked", {
        command_name: A.name
    });
    let {
        skillContent: $,
        modifiedGetAppState: O,
        baseAgent: _,
        promptMessages: J
    } = await mM6(A, q, K), X = [], D = [];
    h(`Executing forked slash command /${A.name} with agent ${_.agentType}`);
    let j = [],
        M = `forked-command-${A.name}`,
        P = 0,
        W = (N) => {
            return P++, {
                type: "progress",
                data: {
                    message: N,
                    normalizedMessages: D,
                    type: "agent_progress",
                    prompt: $,
                    agentId: H
                },
                parentToolUseID: M,
                toolUseID: `${M}-${P}`,
                timestamp: new Date().toISOString(),
                uuid: dfY()
            }
        },
        G = () => {
            z({
                jsx: rP1(j, {
                    tools: K.options.tools,
                    verbose: !1
                }),
                shouldHidePromptInput: !1,
                shouldContinueAnimation: !0,
                showSpinner: !0
            })
        };
    G();
    try {
        for await (let N of dR({
            agentDefinition: _,
            promptMessages: J,
            toolUseContext: {
                ...K,
                getAppState: O
            },
            canUseTool: w,
            isAsync: !1,
            querySource: "agent:custom",
            model: A.model,
            availableTools: K.options.tools
        })) {
            X.push(N);
            let T = iO([N]);
            if (D.push(...T), N.type === "assistant") {
                let k = Lw6(N);
                if (k > 0) K.setResponseLength((B) => B + k);
                let y = T[0];
                if (y && y.type === "assistant") j.push(W(N)), G()
            }
            if (N.type === "user") {
                let k = T[0];
                if (k && k.type === "user") j.push(W(k)), G()
            }
        }
    } finally {
        z(null)
    }
    let f = FM6(X, "Command completed");
    return h(`Forked slash command /${A.name} completed with agent ${H}`), {
        messages: [c6({
            content: pZ({
                inputString: `/${A.userFacingName()} ${q}`.trim(),
                precedingInputBlocks: Y
            })
        }), c6({
            content: `<local-command-stdout>
${f}
</local-command-stdout>`
        })],
        shouldQuery: !1,
        command: A,
        resultText: f
    }
}
// @from(Ln 325283, Col 0)
function lfY(A) {
    return !/[^a-zA-Z0-9:\-_]/.test(A)
}
// @from(Ln 325286, Col 0)
async function Mb4(A, q, K, Y, z, w, H, $, O, _) {
    let J = Db4(A);
    if (!J) {
        c("tengu_input_slash_missing", {});
        let m = "Commands are in the form `/command [args]`";
        return {
            messages: [wP(), ...Y, c6({
                content: pZ({
                    inputString: m,
                    precedingInputBlocks: q
                })
            })],
            shouldQuery: !1,
            resultText: m
        }
    }
    let {
        commandName: X,
        args: D,
        isMcp: j
    } = J, M = j ? "mcp" : !Cd().has(X) ? "custom" : X;
    if (!Sd(X, z.options.commands)) {
        let m = b1().existsSync(`/${X}`);
        if (lfY(X) && !m) {
            c("tengu_input_slash_invalid", {
                input: X
            });
            let b = `Unknown skill: ${X}`;
            return {
                messages: [wP(), ...Y, c6({
                    content: pZ({
                        inputString: b,
                        precedingInputBlocks: q
                    })
                })],
                shouldQuery: !1,
                resultText: b
            }
        }
        return c("tengu_input_prompt", {}), zj("user_prompt", {
            prompt_length: String(A.length),
            prompt: p_6(A)
        }), {
            messages: [c6({
                content: pZ({
                    inputString: A,
                    precedingInputBlocks: q
                }),
                uuid: $
            }), ...Y],
            shouldQuery: !0
        }
    }
    w(!0), u8("slash-commands");
    let {
        messages: P,
        shouldQuery: W,
        allowedTools: G,
        maxThinkingTokens: f,
        model: Z,
        command: N,
        resultText: T,
        nextInput: k,
        submitNextInput: y
    } = await ifY(X, D, H, z, q, K, O, _);
    if (P.length === 0) {
        let m = {
            input: M
        };
        if (N.type === "prompt" && N.pluginInfo) {
            let {
                pluginManifest: b,
                repository: g
            } = N.pluginInfo, U = g.lastIndexOf("@"), x = U > 0 && NT.has(g.slice(U + 1));
            if (m.plugin_repository = x ? g : "third-party", m.plugin_name = x ? b.name : "third-party", x && b.version) m.plugin_version = b.version
        }
        return c("tengu_input_command", m), {
            messages: [],
            shouldQuery: !1,
            maxThinkingTokens: f,
            model: Z,
            nextInput: k,
            submitNextInput: y
        }
    }
    if (P.length === 2 && P[1].type === "user" && typeof P[1].message.content === "string" && P[1].message.content.startsWith("Unknown command:")) {
        if (!(A.startsWith("/var") || A.startsWith("/tmp") || A.startsWith("/private"))) c("tengu_input_slash_invalid", {
            input: X
        });
        return {
            messages: [wP(), ...P],
            shouldQuery: W,
            allowedTools: G,
            maxThinkingTokens: f,
            model: Z
        }
    }
    let B = {
        input: M
    };
    if (N.type === "prompt" && N.pluginInfo) {
        let {
            pluginManifest: m,
            repository: b
        } = N.pluginInfo, g = b.lastIndexOf("@"), U = g > 0 && NT.has(b.slice(g + 1));
        if (B.plugin_repository = U ? b : "third-party", B.plugin_name = U ? m.name : "third-party", U && m.version) B.plugin_version = m.version
    }
    c("tengu_input_command", B);
    let S = P.length > 0 && P[0] && cR(P[0]);
    return {
        messages: W || P.every(Gb4) || S ? P : [wP(), ...P],
        shouldQuery: W,
        allowedTools: G,
        maxThinkingTokens: f,
        model: Z,
        resultText: T,
        nextInput: k,
        submitNextInput: y
    }
}
// @from(Ln 325406, Col 0)
async function ifY(A, q, K, Y, z, w, H, $) {
    let O = zI(A, Y.options.commands);
    if (O.type === "prompt" && O.userInvocable !== !1) xM6(A);
    if (O.userInvocable === !1) return {
        messages: [c6({
            content: pZ({
                inputString: `/${A}`,
                precedingInputBlocks: z
            })
        }), c6({
            content: `This skill can only be invoked by Claude, not directly by users. Ask Claude to use the "${A}" skill for you.`
        })],
        shouldQuery: !1,
        command: O
    };
    try {
        switch (O.type) {
            case "local-jsx":
                return new Promise((_) => {
                    let J = (X, D) => {
                        if (D?.display === "skip") {
                            _({
                                messages: [],
                                shouldQuery: !1,
                                command: O,
                                nextInput: D?.nextInput,
                                submitNextInput: D?.submitNextInput
                            });
                            return
                        }
                        let j = (D?.metaMessages ?? []).map((M) => c6({
                            content: M,
                            isMeta: !0
                        }));
                        _({
                            messages: D?.display === "system" ? [tvA(VQ1(O, q)), tvA(`<local-command-stdout>${X}</local-command-stdout>`), ...j] : [c6({
                                content: pZ({
                                    inputString: VQ1(O, q),
                                    precedingInputBlocks: z
                                })
                            }), X ? c6({
                                content: `<local-command-stdout>${X}</local-command-stdout>`
                            }) : c6({
                                content: `<local-command-stdout>${iv}</local-command-stdout>`
                            }), ...j],
                            shouldQuery: D?.shouldQuery ?? !1,
                            command: O,
                            nextInput: D?.nextInput,
                            submitNextInput: D?.submitNextInput
                        })
                    };
                    O.load().then((X) => X.call(J, Y, q)).then((X) => {
                        if (Y.options.isNonInteractiveSession) {
                            _({
                                messages: [],
                                shouldQuery: !1,
                                command: O
                            });
                            return
                        }
                        K({
                            jsx: X,
                            shouldHidePromptInput: !0,
                            showSpinner: !1,
                            isLocalJSXCommand: !0
                        })
                    })
                });
            case "local": {
                let _ = c6({
                    content: pZ({
                        inputString: VQ1(O, q),
                        precedingInputBlocks: z
                    })
                });
                try {
                    let J = wP(),
                        D = await (await O.load()).call(q, Y);
                    if (D.type === "skip") return {
                        messages: [],
                        shouldQuery: !1,
                        command: O
                    };
                    if (D.type === "compact") {
                        let j = [J, _, ...D.displayText ? [c6({
                                content: `<local-command-stdout>${D.displayText}</local-command-stdout>`,
                                timestamp: new Date(Date.now() + 100).toISOString()
                            })] : []],
                            M = {
                                ...D.compactionResult,
                                messagesToKeep: [...D.compactionResult.messagesToKeep ?? [], ...j]
                            };
                        return {
                            messages: qt(M),
                            shouldQuery: !1,
                            command: O
                        }
                    }
                    if (D.type === "microcompact") {
                        let j = [J, _];
                        if (D.microcompactResult.compactionInfo?.boundaryMessage) j.push(D.microcompactResult.compactionInfo.boundaryMessage);
                        return {
                            messages: j,
                            shouldQuery: !1,
                            command: O
                        }
                    }
                    return {
                        messages: [_, c6({
                            content: `<local-command-stdout>${D.value}</local-command-stdout>`
                        })],
                        shouldQuery: !1,
                        command: O
                    }
                } catch (J) {
                    return K1(J), {
                        messages: [_, c6({
                            content: `<local-command-stderr>${String(J)}</local-command-stderr>`
                        })],
                        shouldQuery: !1,
                        command: O
                    }
                }
            }
            case "prompt":
                try {
                    if (O.context === "fork") return await cfY(O, q, Y, z, K, $ ?? uX);
                    return await Wb4(O, q, Y, z, w)
                } catch (_) {
                    if (_ instanceof dz) return {
                        messages: [c6({
                            content: pZ({
                                inputString: VQ1(O, q),
                                precedingInputBlocks: z
                            })
                        }), c6({
                            content: ts
                        })],
                        shouldQuery: !1,
                        command: O
                    };
                    return {
                        messages: [c6({
                            content: pZ({
                                inputString: VQ1(O, q),
                                precedingInputBlocks: z
                            })
                        }), c6({
                            content: `<local-command-stderr>${String(_)}</local-command-stderr>`
                        })],
                        shouldQuery: !1,
                        command: O
                    }
                }
        }
    } catch (_) {
        if (_ instanceof cx) return {
            messages: [c6({
                content: pZ({
                    inputString: _.message,
                    precedingInputBlocks: z
                })
            })],
            shouldQuery: !1,
            command: O
        };
        throw _
    }
}
// @from(Ln 325576, Col 0)
function VQ1(A, q) {
    return `<${SG}>/${A.userFacingName()}</${SG}>
            <${pP}>${A.userFacingName()}</${pP}>
            <command-args>${q}</command-args>`
}
// @from(Ln 325582, Col 0)
function evA(A, q = "loading") {
    return [`<${pP}>${A}</${pP}>`, `<${SG}>${A}</${SG}>`, "<skill-format>true</skill-format>"].join(`
`)
}
// @from(Ln 325587, Col 0)
function jb4(A, q) {
    return [`<${pP}>${A}</${pP}>`, `<${SG}>/${A}</${SG}>`, q ? `<command-args>${q}</command-args>` : null].filter(Boolean).join(`
`)
}
// @from(Ln 325592, Col 0)
function nfY(A, q) {
    if (A.userInvocable !== !1) return jb4(A.userFacingName(), q);
    if (A.loadedFrom === "skills" || A.loadedFrom === "plugin") return evA(A.userFacingName(), A.progressMessage);
    return jb4(A.userFacingName(), q)
}
// @from(Ln 325597, Col 0)
async function Pb4(A, q, K, Y, z = []) {
    if (!Sd(A, K)) throw new cx(`Unknown command: ${A}`);
    let w = zI(A, K);
    if (w.type !== "prompt") throw Error(`Unexpected ${w.type} command. Expected 'prompt' command. Use /${A} directly in the main conversation.`);
    return Wb4(w, q, Y, [], z)
}
// @from(Ln 325603, Col 0)
async function Wb4(A, q, K, Y = [], z = []) {
    let w = await A.getPromptForCommand(q, K);
    if (A.hooks) {
        let j = U6();
        IM6(K.setAppState, j, A.hooks, A.name, A.type === "prompt" ? A.skillRoot : void 0)
    }
    let H = nfY(A, q);
    h(`Metadata string for ${A.userFacingName()}:`), h(`  ${H.substring(0,200)}`);
    let $ = (H.match(/<command-message>/g) || []).length;
    h(`  command-message tags in metadata: ${$}`);
    let O = hd(A.allowedTools ?? []),
        _ = z.length > 0 || Y.length > 0 ? [...z, ...Y, ...w] : w,
        J = void 0,
        X = await JJ6(oP1(w.filter((j) => j.type === "text").map((j) => j.text).join(" "), K, null, [], K.messages, "repl_main_thread")),
        D = [c6({
            content: H
        }), c6({
            content: _,
            isMeta: !0
        }), ...X, kq({
            type: "command_permissions",
            allowedTools: O,
            model: A.model
        })];
    return h(`processPromptSlashCommand creating ${D.length} messages for ${A.userFacingName()}`), D.forEach((j, M) => {
        if (j.type === "user" && "message" in j) {
            let P = typeof j.message.content === "string" ? j.message.content : Q1(j.message.content),
                W = "isMeta" in j && j.isMeta ? " [META]" : "",
                G = P.substring(0, 200);
            h(`  Message ${M+1}${W}: ${G}`)
        } else if (j.type === "attachment") h(`  Message ${M+1}: [ATTACHMENT]`)
    }), {
        messages: D,
        shouldQuery: !0,
        allowedTools: O,
        maxThinkingTokens: J,
        model: A.model,
        command: A
    }
}
// @from(Ln 325643, Col 4)
BM6 = v(() => {
    hM6();
    u6();
    N8();
    c$();
    _8();
    aa();
    N0();
    hA();
    y6();
    Z6();
    qH();
    qp();
    hK1();
    FW();
    v3();
    m6();
    vz();
    B6();
    svA();
    At();
    PJ();
    Sh();
    YI();
    RW();
    oj1();
    wq();
    uM6();
    vd()
})
// @from(Ln 325676, Col 0)
async function ofY(A, q) {
    if (!A.mcpServers?.length) return {
        clients: q,
        tools: [],
        cleanup: async () => {}
    };
    let K = [],
        Y = [],
        z = [];
    for (let H of A.mcpServers) {
        let $ = null,
            O, _ = !1;
        if (typeof H === "string") {
            if (O = H, $ = lR(H), !$) {
                h(`[Agent: ${A.agentType}] MCP server not found: ${H}`, {
                    level: "warn"
                });
                continue
            }
        } else {
            let X = Object.entries(H);
            if (X.length !== 1) {
                h(`[Agent: ${A.agentType}] Invalid MCP server spec: expected exactly one key`, {
                    level: "warn"
                });
                continue
            }
            let [D, j] = X[0];
            O = D, $ = {
                ...j,
                scope: "dynamic"
            }, _ = !0
        }
        let J = await iR(O, $);
        if (K.push(J), _) Y.push(J);
        if (J.type === "connected") {
            let X = await wI(J);
            z.push(...X), h(`[Agent: ${A.agentType}] Connected to MCP server '${O}' with ${X.length} tools`)
        } else h(`[Agent: ${A.agentType}] Failed to connect to MCP server '${O}': ${J.type}`, {
            level: "warn"
        })
    }
    let w = async () => {
        for (let H of Y)
            if (H.type === "connected") try {
                await H.cleanup()
            } catch ($) {
                h(`[Agent: ${A.agentType}] Error cleaning up MCP server '${H.name}': ${$}`, {
                    level: "warn"
                })
            }
    };
    return {
        clients: [...q, ...K],
        tools: z,
        cleanup: w
    }
}
// @from(Ln 325735, Col 0)
function afY(A) {
    return A.type === "assistant" || A.type === "user" || A.type === "progress" || A.type === "system" && "subtype" in A && A.subtype === "compact_boundary"
}
// @from(Ln 325738, Col 0)
async function* dR({
    agentDefinition: A,
    promptMessages: q,
    toolUseContext: K,
    canUseTool: Y,
    isAsync: z,
    canShowPermissionPrompts: w,
    forkContextMessages: H,
    querySource: $,
    override: O,
    model: _,
    maxTurns: J,
    preserveToolUseResults: X,
    availableTools: D,
    allowedTools: j,
    onCacheSafeParams: M
}) {
    u8("subagents");
    let P = await K.getAppState(),
        W = P.toolPermissionContext.mode,
        G = Uq6(A.model, K.options.mainLoopModel, _, W, A.agentType),
        f = O?.agentId ? O.agentId : NR();
    if (Bp()) {
        let J1 = K.agentId ?? U6();
        AJ6(f, A.agentType, J1)
    }
    let N = [...H ? TQ1(H) : [], ...q],
        T = H !== void 0 ? yp(K.readFileState) : Rp(JK1),
        [k, y] = await Promise.all([O?.userContext ?? i$(), O?.systemContext ?? l$()]),
        B = A.permissionMode,
        S = async () => {
            let J1 = await K.getAppState(),
                D1 = J1.toolPermissionContext;
            if (B && J1.toolPermissionContext.mode !== "bypassPermissions" && J1.toolPermissionContext.mode !== "acceptEdits") D1 = {
                ...D1,
                mode: B
            };
            let Z1 = w !== void 0 ? !w : z;
            if (Z1) D1 = {
                ...D1,
                shouldAvoidPermissionPrompts: !0
            };
            if (z && !Z1) D1 = {
                ...D1,
                awaitAutomatedChecksBeforeDialog: !0
            };
            if (j !== void 0) D1 = {
                ...D1,
                alwaysAllowRules: {
                    cliArg: J1.toolPermissionContext.alwaysAllowRules.cliArg,
                    session: [...j]
                }
            };
            let E1 = A.effort !== void 0 ? A.effort : J1.effortValue;
            return {
                ...J1,
                toolPermissionContext: D1,
                effortValue: E1,
                queuedCommands: []
            }
        }, b = qs(A, D, z).resolvedTools, g = Array.from(P.toolPermissionContext.additionalWorkingDirectories.keys()), U = O?.systemPrompt ? O.systemPrompt : await sfY(A, K, G, g), x = [], p = O?.abortController ? O.abortController : z ? new AbortController : K.abortController, l = [];
    for await (let J1 of AEA(f, A.agentType, p.signal)) if (J1.additionalContexts && J1.additionalContexts.length > 0) l.push(...J1.additionalContexts);
    if (l.length > 0) {
        let J1 = kq({
            type: "hook_additional_context",
            content: l,
            hookName: "SubagentStart",
            toolUseID: rfY(),
            hookEvent: "SubagentStart"
        });
        N.push(J1)
    }
    if (A.hooks) Bn7(K.setAppState, f, A.hooks, `agent '${A.agentType}'`, !0);
    let r = A.skills ?? [];
    if (r.length > 0) {
        let J1 = await hv(ZO()),
            D1 = [];
        for (let Z1 of r) {
            if (!Sd(Z1, J1)) {
                h(`[Agent: ${A.agentType}] Warning: Skill '${Z1}' specified in frontmatter was not found`, {
                    level: "warn"
                });
                continue
            }
            let E1 = zI(Z1, J1);
            if (E1.type !== "prompt") {
                h(`[Agent: ${A.agentType}] Warning: Skill '${Z1}' is not a prompt-based skill`, {
                    level: "warn"
                });
                continue
            }
            D1.push({
                skillName: Z1,
                skill: E1
            })
        }
        for (let {
                skillName: Z1,
                skill: E1
            }
            of D1) {
            let a = await E1.getPromptForCommand("", K);
            h(`[Agent: ${A.agentType}] Preloaded skill '${Z1}'`);
            let A1 = evA(Z1, E1.progressMessage);
            N.push(c6({
                content: [{
                    type: "text",
                    text: A1
                }, ...a]
            }))
        }
    }
    let {
        clients: s,
        tools: O1,
        cleanup: T1
    } = await ofY(A, K.options.mcpClients), N1 = [...b, ...O1], j1 = {
        isNonInteractiveSession: z ? !0 : K.options.isNonInteractiveSession ?? !1,
        appendSystemPrompt: K.options.appendSystemPrompt,
        tools: N1,
        commands: [],
        debug: K.options.debug,
        verbose: K.options.verbose,
        mainLoopModel: G,
        maxThinkingTokens: 0,
        mcpClients: s,
        mcpResources: K.options.mcpResources,
        agentDefinitions: K.options.agentDefinitions
    }, q1 = vQ1(K, {
        options: j1,
        agentId: f,
        agentType: A.agentType,
        messages: N,
        readFileState: T,
        abortController: p,
        getAppState: S,
        shareSetAppState: !z,
        shareSetResponseLength: !0,
        criticalSystemReminder_EXPERIMENTAL: A.criticalSystemReminder_EXPERIMENTAL
    });
    if (X) q1.preserveToolUseResults = !0;
    if (M) M({
        systemPrompt: U,
        userContext: k,
        systemContext: y,
        toolUseContext: q1,
        forkContextMessages: N
    });
    await X51(N, f).catch((J1) => h(`Failed to record sidechain transcript: ${J1}`));
    let t = N.length > 0 ? N[N.length - 1].uuid : null;
    try {
        for await (let J1 of ZR({
            messages: N,
            systemPrompt: U,
            userContext: k,
            systemContext: y,
            canUseTool: Y,
            toolUseContext: q1,
            querySource: $,
            maxTurns: J ?? A.maxTurns
        })) {
            if (J1.type === "attachment") {
                if (J1.attachment.type === "max_turns_reached") {
                    h(`[Agent
: $
{
  agentDefinition.agentType
}
] Reached max turns limit ($
{
  message.attachment.maxTurns
}
)`);
                    break
                }
                yield J1;
                continue
            }
            if (afY(J1)) x.push(J1), await X51([J1], f, t).catch((D1) => h(`Failed to record sidechain transcript: ${D1}`)), t = J1.uuid, yield J1
        }
        if (p.signal.aborted) throw new dz;
        if (iD(A) && A.callback) A.callback()
    } finally {
        if (await T1(), A.hooks) iD1(K.setAppState, f)
    }
}
// @from(Ln 325925, Col 0)
function TQ1(A) {
    let q = new Set;
    for (let K of A)
        if (K?.type === "user") {
            let z = K.message.content;
            if (Array.isArray(z)) {
                for (let w of z)
                    if (w.type === "tool_result" && w.tool_use_id) q.add(w.tool_use_id)
            }
        } return A.filter((K) => {
        if (K?.type === "assistant") {
            let z = K.message.content;
            if (Array.isArray(z)) return !z.some((H) => H.type === "tool_use" && H.id && !q.has(H.id))
        }
        return !0
    })
}
// @from(Ln 325942, Col 0)
async function sfY(A, q, K, Y) {
    try {
        let w = [A.getSystemPrompt({
            toolUseContext: q
        })];
        return await NQ1(w, K, Y)
    } catch (z) {
        return await NQ1([Zb4], K, Y)
    }
}
// @from(Ln 325952, Col 4)
At = v(() => {
    EK1();
    qH();
    Sh();
    TR();
    ov();
    e7();
    bK1();
    uv();
    pM();
    aM();
    mn7();
    eU();
    FW();
    lq();
    Z6();
    oj1();
    wq();
    c$();
    B6();
    N8();
    BM6();
    YI();
    v3();
    SW();
    nW();
    MB1();
    B6()
})
// @from(Ln 325982, Col 0)
function fb4(A, q) {
    if (q) return A ? `agent:builtin:${A}` : "agent:default";
    else return "agent:custom"
}
// @from(Ln 325987, Col 0)
function EQ1() {
    let q = C8()?.outputStyle ?? Wj;
    if (q === Wj) return "repl_main_thread";
    return q in D51 ? `repl_main_thread:outputStyle:${q}` : "repl_main_thread:outputStyle:custom"
}
// @from(Ln 325992, Col 4)
qEA = v(() => {
    p8();
    Em()
})
// @from(Ln 325997, Col 0)
function QM6(A) {
    let q = e(28),
        {
            output: K,
            fullOutput: Y,
            elapsedTimeSeconds: z,
            totalLines: w,
            timeoutMs: H,
            verbose: $
        } = A,
        O;
    if (q[0] !== Y) O = JH(Y.trim()), q[0] = Y, q[1] = O;
    else O = q[1];
    let _ = O,
        J, X;
    if (q[2] !== K || q[3] !== _ || q[4] !== $) J = JH(K.trim()).split(`
`).filter(tfY), X = $ ? _ : J.slice(-5).join(`
`), q[2] = K, q[3] = _, q[4] = $, q[5] = J, q[6] = X;
    else J = q[5], X = q[6];
    let D = X,
        j = $ ? 0 : w ? Math.max(0, w - 5) : 0;
    if (!J.length) {
        let T;
        if (q[7] === Symbol.for("react.memo_cache_sentinel")) T = HI.default.createElement(V, {
            dimColor: !0
        }, "Running… "), q[7] = T;
        else T = q[7];
        let k;
        if (q[8] !== z || q[9] !== H) k = HI.default.createElement(HA, null, T, HI.default.createElement($Q1, {
            elapsedTimeSeconds: z,
            timeoutMs: H
        })), q[8] = z, q[9] = H, q[10] = k;
        else k = q[10];
        return k
    }
    let M = $ ? void 0 : Math.min(5, J.length),
        P;
    if (q[11] !== D) P = HI.default.createElement(V, {
        dimColor: !0
    }, D), q[11] = D, q[12] = P;
    else P = q[12];
    let W;
    if (q[13] !== M || q[14] !== P) W = HI.default.createElement(I, {
        height: M,
        flexDirection: "column",
        overflow: "hidden"
    }, P), q[13] = M, q[14] = P, q[15] = W;
    else W = q[15];
    let G;
    if (q[16] !== j || q[17] !== $) G = !$ && j > 0 && HI.default.createElement(V, {
        dimColor: !0
    }, j > 0 && `+${j} more line${j===1?"":"s"}`), q[16] = j, q[17] = $, q[18] = G;
    else G = q[18];
    let f;
    if (q[19] !== z || q[20] !== H) f = HI.default.createElement($Q1, {
        elapsedTimeSeconds: z,
        timeoutMs: H
    }), q[19] = z, q[20] = H, q[21] = f;
    else f = q[21];
    let Z;
    if (q[22] !== G || q[23] !== f) Z = HI.default.createElement(I, {
        flexDirection: "row",
        gap: 1
    }, G, f), q[22] = G, q[23] = f, q[24] = Z;
    else Z = q[24];
    let N;
    if (q[25] !== W || q[26] !== Z) N = HI.default.createElement(HA, null, HI.default.createElement(I, {
        flexDirection: "column"
    }, W, Z)), q[25] = W, q[26] = Z, q[27] = N;
    else N = q[27];
    return N
}
// @from(Ln 326070, Col 0)
function tfY(A) {
    return A
}
// @from(Ln 326073, Col 4)
HI
// @from(Ln 326074, Col 4)
KEA = v(() => {
    i1();
    m1();
    XL();
    eq();
    kvA();
    HI = o(X1(), 1)
})
// @from(Ln 326086, Col 0)
function aP1(A) {
    let q = A.trim(),
        K = q.match(/^\s*sed\s+/);
    if (!K) return null;
    let Y = q.slice(K[0].length),
        z = pz(Y);
    if (!z.success) return null;
    let w = z.tokens,
        H = [];
    for (let N of w)
        if (typeof N === "string") H.push(N);
        else if (typeof N === "object" && N !== null && "op" in N && N.op === "glob") return null;
    let $ = !1,
        O = !1,
        _ = null,
        J = null,
        X = 0;
    while (X < H.length) {
        let N = H[X];
        if (N === "-i" || N === "--in-place") {
            if ($ = !0, X++, X < H.length) {
                let T = H[X];
                if (typeof T === "string" && !T.startsWith("-") && (T === "" || T.startsWith("."))) X++
            }
            continue
        }
        if (N.startsWith("-i")) {
            $ = !0, X++;
            continue
        }
        if (N === "-E" || N === "-r" || N === "--regexp-extended") {
            O = !0, X++;
            continue
        }
        if (N === "-e" || N === "--expression") {
            if (X + 1 < H.length && typeof H[X + 1] === "string") {
                if (_ !== null) return null;
                _ = H[X + 1], X += 2;
                continue
            }
            return null
        }
        if (N.startsWith("--expression=")) {
            if (_ !== null) return null;
            _ = N.slice(13), X++;
            continue
        }
        if (N.startsWith("-")) return null;
        if (_ === null) _ = N;
        else if (J === null) J = N;
        else return null;
        X++
    }
    if (!$ || !_ || !J) return null;
    if (!_.match(/^s\//)) return null;
    let j = _.slice(2),
        M = "",
        P = "",
        W = "",
        G = "pattern",
        f = 0;
    while (f < j.length) {
        let N = j[f];
        if (N === "\\" && f + 1 < j.length) {
            if (G === "pattern") M += N + j[f + 1];
            else if (G === "replacement") P += N + j[f + 1];
            else W += N + j[f + 1];
            f += 2;
            continue
        }
        if (N === "/") {
            if (G === "pattern") G = "replacement";
            else if (G === "replacement") G = "flags";
            else return null;
            f++;
            continue
        }
        if (G === "pattern") M += N;
        else if (G === "replacement") P += N;
        else W += N;
        f++
    }
    if (G !== "flags") return null;
    if (!/^[gpimIM1-9]*$/.test(W)) return null;
    return {
        filePath: J,
        pattern: M,
        replacement: P,
        flags: W,
        extendedRegex: O
    }
}
// @from(Ln 326179, Col 0)
function Vb4(A, q) {
    let K = "";
    if (q.flags.includes("g")) K += "g";
    if (q.flags.includes("i") || q.flags.includes("I")) K += "i";
    if (q.flags.includes("m") || q.flags.includes("M")) K += "m";
    let Y = q.pattern.replace(/\\\//g, "/");
    if (!q.extendedRegex) Y = Y.replace(/\\\\/g, "\x00BACKSLASH\x00").replace(/\\\+/g, "\x00PLUS\x00").replace(/\\\?/g, "\x00QUESTION\x00").replace(/\\\|/g, "\x00PIPE\x00").replace(/\\\(/g, "\x00LPAREN\x00").replace(/\\\)/g, "\x00RPAREN\x00").replace(/\+/g, "\\+").replace(/\?/g, "\\?").replace(/\|/g, "\\|").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(new RegExp("\x00BACKSLASH\x00", "g"), "\\\\").replace(new RegExp("\x00PLUS\x00", "g"), "+").replace(new RegExp("\x00QUESTION\x00", "g"), "?").replace(new RegExp("\x00PIPE\x00", "g"), "|").replace(new RegExp("\x00LPAREN\x00", "g"), "(").replace(new RegExp("\x00RPAREN\x00", "g"), ")");
    let w = `___ESCAPED_AMPERSAND_${efY(8).toString("hex")}___`,
        H = q.replacement.replace(/\\\//g, "/").replace(/\\&/g, w).replace(/&/g, "$$&").replace(new RegExp(w, "g"), "&");
    try {
        let $ = new RegExp(Y, K);
        return A.replace($, H)
    } catch {
        return A
    }
}
// @from(Ln 326195, Col 4)
kQ1 = v(() => {
    M_()
})
// @from(Ln 326199, Col 0)
function gM6(A) {
    let q = e(9),
        K;
    if (q[0] !== A) K = A === void 0 ? {} : A, q[0] = A, q[1] = K;
    else K = q[1];
    let {
        onBackground: Y
    } = K, z = B_(), w = L7(), H;
    if (q[2] !== Y || q[3] !== w || q[4] !== z) H = () => {
        m_6(() => z.getState(), w), Y?.()
    }, q[2] = Y, q[3] = w, q[4] = z, q[5] = H;
    else H = q[5];
    let $ = H,
        O;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) O = {
        context: "Task"
    }, q[6] = O;
    else O = q[6];
    DA("task:background", $, O);
    let _ = RK("task:background", "Task", "ctrl+b"),
        J = xA.terminal === "tmux" && _ === "ctrl+b" ? "ctrl+b ctrl+b (twice)" : _;
    if (J6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)) return null;
    let X;
    if (q[7] !== J) X = $$.createElement(I, {
        paddingLeft: 5
    }, $$.createElement(V, {
        dimColor: !0
    }, $$.createElement(YA, {
        shortcut: J,
        action: "run in background"
    }))), q[7] = J, q[8] = X;
    else X = q[8];
    return X
}
// @from(Ln 326234, Col 0)
function Tb4(A, {
    verbose: q,
    theme: K
}) {
    let {
        command: Y
    } = A;
    if (!Y) return null;
    let z = aP1(Y);
    if (z) return q ? z.filePath : L3(z.filePath);
    let w = Y;
    if (Y.includes(`"$(cat <<'EOF'`)) {
        let H = Y.match(/^(.*?)"?\$\(cat <<'EOF'\n([\s\S]*?)\n\s*EOF\n\s*\)"(.*)$/);
        if (H && H[1] && H[2]) {
            let $ = H[1],
                O = H[2],
                _ = H[3] || "";
            w = `${$.trim()} "${O.trim()}"${_.trim()}`
        }
    }
    if (!q) {
        let H = w.split(`
`),
            $ = H.length > Nb4,
            O = w.length > YEA;
        if ($ || O) {
            let _ = w;
            if ($) _ = H.slice(0, Nb4).join(`
`);
            if (_.length > YEA) _ = _.slice(0, YEA);
            return $$.createElement(V, null, _.trim(), "…")
        }
    }
    return w
}
// @from(Ln 326270, Col 0)
function vb4() {
    return $$.createElement(Y9, null)
}
// @from(Ln 326274, Col 0)
function Eb4(A, {
    verbose: q,
    tools: K,
    terminalSize: Y,
    inProgressToolCallCount: z
}) {
    let w = A.at(-1);
    if (!w || !w.data) return $$.createElement(HA, {
        height: 1
    }, $$.createElement(V, {
        dimColor: !0
    }, "Running…"));
    let H = w.data;
    return $$.createElement(QM6, {
        fullOutput: H.fullOutput,
        output: H.output,
        elapsedTimeSeconds: H.elapsedTimeSeconds,
        totalLines: H.totalLines,
        timeoutMs: H.timeoutMs,
        verbose: q
    })
}
// @from(Ln 326297, Col 0)
function kb4() {
    return $$.createElement(HA, {
        height: 1
    }, $$.createElement(V, {
        dimColor: !0
    }, "Waiting…"))
}
// @from(Ln 326305, Col 0)
function Lb4(A, q, {
    verbose: K,
    theme: Y,
    tools: z,
    style: w
}) {
    let $ = q.at(-1)?.data?.timeoutMs;
    return $$.createElement(q51, {
        content: A,
        verbose: K,
        timeoutMs: $
    })
}
// @from(Ln 326319, Col 0)
function Rb4(A, {
    verbose: q,
    progressMessagesForMessage: K,
    tools: Y
}) {
    return $$.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 326329, Col 4)
$$
// @from(Ln 326329, Col 8)
Nb4 = 2
// @from(Ln 326330, Col 4)
YEA = 160
// @from(Ln 326331, Col 4)
zEA = v(() => {
    i1();
    m1();
    CX();
    UO();
    eq();
    PM6();
    KEA();
    kQ1();
    wq();
    G5();
    wK();
    d8();
    kK1();
    hA();
    K7();
    s2();
    $$ = o(X1(), 1)
})
// @from(Ln 326351, Col 0)
function qVY(A) {
    return `Describe your most recent action in 3-5 words using present tense (-ing). Name the file or function, not the branch. Do not use tools.
${A?`
Previous: "${A}" — say something NEW.
`:""}
Good: "Reading runAgent.ts"
Good: "Fixing null check in validate.ts"
Good: "Running auth module tests"
Good: "Adding retry logic to fetchUser"

Bad (past tense): "Analyzed the branch diff"
Bad (too vague): "Investigating the issue"
Bad (too long): "Reviewing full branch diff and AgentTool.tsx integration"
Bad (branch name): "Analyzed adam/background-summary branch diff"`
}
// @from(Ln 326367, Col 0)
function yb4(A, q, K, Y) {
    let z = null,
        w = null,
        H = !1,
        $ = null;
    async function O() {
        if (H) return;
        h(`[AgentSummary] Timer fired for agent ${q}`);
        try {
            let X = await sP1(q);
            if (!X || X.length < 3) {
                h(`[AgentSummary] Skipping summary for ${A}: not enough messages (${X?.length??0})`);
                return
            }
            let D = TQ1(X),
                j = {
                    ...K,
                    forkContextMessages: D
                };
            h(`[AgentSummary] Forking for summary, ${D.length} messages in context`), z = new AbortController;
            let M = async () => ({
                behavior: "deny",
                message: "No tools needed for summary",
                decisionReason: {
                    type: "other",
                    reason: "summary only"
                }
            }), P = await av({
                promptMessages: [c6({
                    content: qVY($)
                })],
                cacheSafeParams: j,
                canUseTool: M,
                querySource: "agent_summary",
                forkLabel: "agent_summary",
                overrides: {
                    abortController: z
                },
                skipTranscript: !0
            });
            if (H) return;
            for (let W of P.messages) {
                if (W.type !== "assistant") continue;
                if (W.isApiErrorMessage) {
                    h(`[AgentSummary] Skipping API error message for ${A}`);
                    continue
                }
                let G = W.message.content.find((f) => f.type === "text");
                if (G?.type === "text" && G.text.trim()) {
                    let f = G.text.trim();
                    h(`[AgentSummary] Summary result for ${A}: ${f}`), $ = f, Yd7(A, f, Y);
                    break
                }
            }
        } catch (X) {
            if (!H && X instanceof Error) K1(X)
        } finally {
            if (z = null, !H) _()
        }
    }

    function _() {
        if (H) return;
        w = setTimeout(() => void O(), AVY)
    }

    function J() {
        if (h(`[AgentSummary] Stopping summarization for ${A}`), H = !0, w) clearTimeout(w), w = null;
        if (z) z.abort(), z = null
    }
    return _(), {
        stop: J
    }
}
// @from(Ln 326441, Col 4)
AVY = 30000
// @from(Ln 326442, Col 4)
Cb4 = v(() => {
    YI();
    lq();
    At();
    N8();
    ra();
    y6();
    Z6()
})
// @from(Ln 326451, Col 4)
Sb4 = {}
// @from(Ln 326455, Col 4)
wEA = `
# Agent Teammate Communication

IMPORTANT: You are running as an agent in a team. To communicate with anyone on your team:
- Use the SendMessage tool with type \`message\` to send messages to specific teammates
- Use the SendMessage tool with type \`broadcast\` sparingly for team-wide announcements

Just writing a response in text is not visible to others on your team - you MUST use the SendMessage tool.

The user interacts primarily with the team lead. Your work is coordinated through the task system and teammate messaging.
`
// @from(Ln 326477, Col 0)
function HVY(A) {
    return A.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
}
// @from(Ln 326481, Col 0)
function $VY() {
    return `perm-${Date.now()}-${Math.random().toString(36).substring(2,9)}`
}
// @from(Ln 326485, Col 0)
function UM6(A) {
    let q = A.teamName || i3(),
        K = A.workerId || ID(),
        Y = A.workerName || g5(),
        z = A.workerColor || b$();
    if (!q) throw Error("Team name is required for permission requests");
    if (!K) throw Error("Worker ID is required for permission requests");
    if (!Y) throw Error("Worker name is required for permission requests");
    return {
        id: $VY(),
        workerId: K,
        workerName: Y,
        workerColor: z,
        teamName: q,
        toolName: A.toolName,
        toolUseId: A.toolUseId,
        description: A.description,
        input: A.input,
        permissionSuggestions: A.permissionSuggestions || [],
        status: "pending",
        createdAt: Date.now()
    }
}
// @from(Ln 326509, Col 0)
function OVY(A) {
    if (!(A || i3())) return !1;
    let K = ID();
    return !K || K === "team-lead"
}
// @from(Ln 326515, Col 0)
function LQ1() {
    let A = i3(),
        q = ID();
    return !!A && !!q && !OVY()
}
// @from(Ln 326521, Col 0)
function _VY(A) {
    let q = QP(),
        K = zVY(q, HVY(A), "config.json");
    if (!KVY(K)) return null;
    try {
        let Y = YVY(K, "utf-8");
        return _A(Y)
    } catch (Y) {
        return h(`[PermissionSync] Failed to read team file for ${A}: ${Y instanceof Error?Y.message:String(Y)}`), null
    }
}
// @from(Ln 326533, Col 0)
function hb4(A) {
    let q = A || i3();
    if (!q) return null;
    let K = _VY(q);
    if (!K) return h(`[PermissionSync] Team file not found for team: ${q}`), null;
    return K.members.find((z) => z.agentId === K.leadAgentId)?.name || "team-lead"
}
// @from(Ln 326541, Col 0)
function pM6(A) {
    let q = hb4(A.teamName);
    if (!q) return h("[PermissionSync] Cannot send permission request: leader name not found"), !1;
    try {
        let K = xvA({
            request_id: A.id,
            agent_id: A.workerName,
            tool_name: A.toolName,
            tool_use_id: A.toolUseId,
            description: A.description,
            input: A.input,
            permission_suggestions: A.permissionSuggestions
        });
        return f9(q, {
            from: A.workerName,
            text: Q1(K),
            timestamp: new Date().toISOString(),
            color: A.workerColor
        }, A.teamName), h(`[PermissionSync] Sent permission request ${A.id} to leader ${q} via mailbox`), !0
    } catch (K) {
        return h(`[PermissionSync] Failed to send permission request via mailbox: ${K}`), K1(K instanceof Error ? K : Error(String(K))), !1
    }
}
// @from(Ln 326565, Col 0)
function dM6(A, q, K, Y) {
    let z = Y || i3();
    if (!z) return h("[PermissionSync] Cannot send permission response: team name not found"), !1;
    try {
        let w = bvA({
                request_id: K,
                subtype: q.decision === "approved" ? "success" : "error",
                error: q.feedback,
                updated_input: q.updatedInput,
                permission_updates: q.permissionUpdates
            }),
            H = g5() || "team-lead";
        return f9(A, {
            from: H,
            text: Q1(w),
            timestamp: new Date().toISOString()
        }, z), h(`[PermissionSync] Sent permission response for ${K} to worker ${A} via mailbox`), !0
    } catch (w) {
        return h(`[PermissionSync] Failed to send permission response via mailbox: ${w}`), K1(w instanceof Error ? w : Error(String(w))), !1
    }
}
// @from(Ln 326587, Col 0)
function Ib4() {
    return `sandbox-${Date.now()}-${Math.random().toString(36).substring(2,9)}`
}
// @from(Ln 326591, Col 0)
function xb4(A, q, K) {
    let Y = K || i3();
    if (!Y) return h("[PermissionSync] Cannot send sandbox permission request: team name not found"), !1;
    let z = hb4(Y);
    if (!z) return h("[PermissionSync] Cannot send sandbox permission request: leader name not found"), !1;
    let w = ID(),
        H = g5(),
        $ = b$();
    if (!w || !H) return h("[PermissionSync] Cannot send sandbox permission request: worker ID or name not found"), !1;
    try {
        let O = uvA({
            requestId: q,
            workerId: w,
            workerName: H,
            workerColor: $,
            host: A
        });
        return f9(z, {
            from: H,
            text: Q1(O),
            timestamp: new Date().toISOString(),
            color: $
        }, Y), h(`[PermissionSync] Sent sandbox permission request ${q} for host ${A} to leader ${z} via mailbox`), !0
    } catch (O) {
        return h(`[PermissionSync] Failed to send sandbox permission request via mailbox: ${O}`), K1(O instanceof Error ? O : Error(String(O))), !1
    }
}
// @from(Ln 326619, Col 0)
function bb4(A, q, K, Y, z) {
    let w = z || i3();
    if (!w) return h("[PermissionSync] Cannot send sandbox permission response: team name not found"), !1;
    try {
        let H = BvA({
                requestId: q,
                host: K,
                allow: Y
            }),
            $ = g5() || "team-lead";
        return f9(A, {
            from: $,
            text: Q1(H),
            timestamp: new Date().toISOString()
        }, w), h(`[PermissionSync] Sent sandbox permission response for ${q} (host: ${K}, allow: ${Y}) to worker ${A} via mailbox`), !0
    } catch (H) {
        return h(`[PermissionSync] Failed to send sandbox permission response via mailbox: ${H}`), K1(H instanceof Error ? H : Error(String(H))), !1
    }
}
// @from(Ln 326638, Col 4)
wVY
// @from(Ln 326638, Col 9)
ZAH
// @from(Ln 326639, Col 4)
tP1 = v(() => {
    hA();
    m6();
    i7();
    y6();
    Z6();
    H$();
    Cz();
    m6();
    wVY = o(NQ(), 1), ZAH = u.object({
        id: u.string(),
        workerId: u.string(),
        workerName: u.string(),
        workerColor: u.string().optional(),
        teamName: u.string(),
        toolName: u.string(),
        toolUseId: u.string(),
        description: u.string(),
        input: u.record(u.string(), u.unknown()),
        permissionSuggestions: u.array(u.unknown()),
        status: u.enum(["pending", "approved", "rejected"]),
        resolvedBy: u.enum(["worker", "leader"]).optional(),
        resolvedAt: u.number().optional(),
        feedback: u.string().optional(),
        updatedInput: u.unknown().optional(),
        permissionUpdates: u.array(u.unknown()).optional(),
        createdAt: u.number()
    })
})
// @from(Ln 326669, Col 0)
function lM6(A) {
    RQ1.set(A.requestId, A), h(`[SwarmPermissionPoller] Registered callback for request ${A.requestId}`)
}
// @from(Ln 326673, Col 0)
function ub4(A) {
    RQ1.delete(A), h(`[SwarmPermissionPoller] Unregistered callback for request ${A}`)
}
// @from(Ln 326677, Col 0)
function Bb4(A) {
    return RQ1.has(A)
}
// @from(Ln 326681, Col 0)
function eP1(A) {
    let q = RQ1.get(A.requestId);
    if (!q) return h(`[SwarmPermissionPoller] No callback registered for mailbox response ${A.requestId}`), !1;
    if (h(`[SwarmPermissionPoller] Processing mailbox response for request ${A.requestId}: ${A.decision}`), RQ1.delete(A.requestId), A.decision === "approved") {
        let K = A.permissionUpdates || [],
            Y = A.updatedInput;
        q.onAllow(Y, K)
    } else q.onReject(A.feedback);
    return !0
}
// @from(Ln 326692, Col 0)
function mb4(A) {
    cM6.set(A.requestId, A), h(`[SwarmPermissionPoller] Registered sandbox callback for request ${A.requestId}`)
}
// @from(Ln 326696, Col 0)
function Fb4(A) {
    return cM6.has(A)
}
// @from(Ln 326700, Col 0)
function Qb4(A) {
    let q = cM6.get(A.requestId);
    if (!q) return h(`[SwarmPermissionPoller] No sandbox callback registered for request ${A.requestId}`), !1;
    return h(`[SwarmPermissionPoller] Processing sandbox response for request ${A.requestId}: allow=${A.allow}`), cM6.delete(A.requestId), q.resolve(A.allow), !0
}
// @from(Ln 326705, Col 4)
HEA
// @from(Ln 326705, Col 9)
RQ1
// @from(Ln 326705, Col 14)
cM6
// @from(Ln 326706, Col 4)
yQ1 = v(() => {
    tP1();
    H$();
    Z6();
    HEA = o(X1(), 1), RQ1 = new Map;
    cM6 = new Map
})
// @from(Ln 326714, Col 0)
function gb4(A) {
    $EA = A
}
// @from(Ln 326718, Col 0)
function iM6() {
    return $EA
}
// @from(Ln 326722, Col 0)
function Ub4() {
    $EA = null
}
// @from(Ln 326726, Col 0)
function pb4(A) {
    OEA = A
}
// @from(Ln 326730, Col 0)
function db4() {
    return OEA
}
// @from(Ln 326734, Col 0)
function cb4() {
    OEA = null
}
// @from(Ln 326737, Col 4)
$EA = null
// @from(Ln 326738, Col 4)
OEA = null