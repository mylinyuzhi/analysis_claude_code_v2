
// @from(Ln 414341, Col 0)
function U9q({
    isBeforeFirstMessage: A
}) {
    let q = $j(),
        K = q.prefersReducedMotion ?? !1,
        Y = _9q(A, K),
        z = G9q(),
        w = f6().oauthAccount?.displayName ?? "",
        {
            columns: H
        } = Z8(),
        $ = RE7(),
        O = b8.isSandboxingEnabled(),
        _ = MN6(),
        J = JV6(),
        X = v6((D1) => D1.agent),
        D = f6(),
        j;
    try {
        j = f9q(3)
    } catch {
        j = []
    }
    let M = q.companyAnnouncements,
        [P] = Le.useState(() => M && M.length > 0 ? D.numStartups === 1 ? M[0] : M[Math.floor(Math.random() * M.length)] : void 0),
        {
            hasReleaseNotes: W
        } = zN6(D.lastReleaseNotesSeen);
    Le.useEffect(() => {
        if (f6().lastReleaseNotesSeen === {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.38",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-02-10T00:04:56Z"
            }.VERSION) return;
        if (jA((Z1) => {
                if (Z1.lastReleaseNotesSeen === {
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.38",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-02-10T00:04:56Z"
                    }.VERSION) return Z1;
                return {
                    ...Z1,
                    lastReleaseNotesSeen: {
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.38",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-02-10T00:04:56Z"
                    }.VERSION
                }
            }), $) yE7()
    }, [D, $]), Le.useEffect(() => {
        if (_ && !$) PN6()
    }, [_, $]), Le.useEffect(() => {
        if (J && !$ && !_) XV6()
    }, [J, $, _]);
    let [G, {
        isVisible: f
    }] = wB(), Z = _N6(), N = Le.useRef(Z);
    if (f) N.current = Z;
    let {
        version: T,
        cwd: k,
        modelDisplayName: y,
        billingType: B,
        agentName: S
    } = N.current, m = X ?? S, b = DY(y, cbA - 20);
    if (!W && !$ && !J6(process.env.CLAUDE_CODE_FORCE_FULL_LOGO)) return T8.createElement(T8.Fragment, null, T8.createElement(I, null), T8.createElement(F9q, null), Y21() && T8.createElement(I, {
        paddingLeft: 2,
        flexDirection: "column"
    }, T8.createElement(V, {
        color: "warning"
    }, "Debug mode enabled"), T8.createElement(V, {
        dimColor: !0
    }, "Logging to: ", yx() ? "stderr" : M61())), T8.createElement(dbA, null), process.env.CLAUDE_CODE_TMUX_SESSION && T8.createElement(I, {
        paddingLeft: 2,
        flexDirection: "column"
    }, T8.createElement(V, {
        dimColor: !0
    }, "tmux session: ", process.env.CLAUDE_CODE_TMUX_SESSION), T8.createElement(V, {
        dimColor: !0
    }, process.env.CLAUDE_CODE_TMUX_PREFIX_CONFLICTS ? `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} ${process.env.CLAUDE_CODE_TMUX_PREFIX} d (press prefix twice - Claude uses ${process.env.CLAUDE_CODE_TMUX_PREFIX})` : `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} d`)), P && T8.createElement(I, {
        paddingLeft: 2,
        flexDirection: "column"
    }, !process.env.IS_DEMO && D.oauthAccount?.organizationName && T8.createElement(V, {
        dimColor: !0
    }, "Message from ", D.oauthAccount.organizationName, ":"), T8.createElement(V, null, P)), !1, !1);
    let g = j9q(H),
        U = f6().theme,
        x = ` ${k8("claude",U)("Claude Code")} ${k8("inactive",U)(`v${T}`)} `,
        p = k8("claude", U)(" Claude Code ");
    if (g === "compact") {
        let Z1 = ON6(w);
        if (UA(Z1) > H - 4) Z1 = ON6(null);
        let E1 = " · ",
            a = "@",
            A1 = m ? H - 4 - a.length - UA(m) - E1.length : H - 4,
            M1 = np1(k, Math.max(A1, 10));
        return T8.createElement(T8.Fragment, null, T8.createElement(I, {
            ref: G,
            flexDirection: "column",
            borderStyle: "round",
            borderColor: "claude",
            borderText: {
                content: p,
                position: "top",
                align: "start",
                offset: 1
            },
            paddingX: 1,
            paddingY: 1,
            alignItems: "center",
            width: H
        }, T8.createElement(V, {
            bold: !0
        }, Z1), T8.createElement(I, {
            marginY: 1
        }, T8.createElement(I, {
            height: 5,
            flexDirection: "column",
            justifyContent: "flex-end"
        }, T8.createElement(I, {
            marginBottom: Y
        }, T8.createElement(UbA, null)))), T8.createElement(V, {
            dimColor: !0
        }, b), T8.createElement(V, {
            dimColor: !0
        }, B), T8.createElement(V, {
            dimColor: !0
        }, m ? `@${m} · ${M1}` : M1)), O && T8.createElement(I, {
            marginTop: 1,
            flexDirection: "column"
        }, T8.createElement(V, {
            color: "warning"
        }, "Your bash commands will be sandboxed. Disable with /sandbox.")))
    }
    let l = ON6(w),
        r = !process.env.IS_DEMO && D.oauthAccount?.organizationName ? `${b} · ${B} · ${D.oauthAccount.organizationName}` : `${b} · ${B}`,
        s = " · ",
        T1 = m ? cbA - 1 - UA(m) - s.length : cbA,
        N1 = np1(k, Math.max(T1, 10)),
        j1 = m ? `@${m} · ${N1}` : N1,
        q1 = P9q(l, j1, r),
        {
            leftWidth: t,
            rightWidth: J1
        } = M9q(H, g, q1);
    return T8.createElement(T8.Fragment, null, T8.createElement(I, null), T8.createElement(I, {
        ref: G,
        flexDirection: "column",
        borderStyle: "round",
        borderColor: "claude",
        borderText: {
            content: x,
            position: "top",
            align: "start",
            offset: 3
        }
    }, T8.createElement(I, {
        flexDirection: g === "horizontal" ? "row" : "column",
        paddingX: 1,
        gap: 1
    }, T8.createElement(I, {
        flexDirection: "column",
        width: t,
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 9
    }, T8.createElement(I, {
        marginTop: 1
    }, T8.createElement(V, {
        bold: !0
    }, l)), T8.createElement(I, {
        height: 5,
        flexDirection: "column",
        justifyContent: "flex-end"
    }, T8.createElement(I, {
        marginBottom: Y
    }, T8.createElement(UbA, null))), T8.createElement(I, {
        flexDirection: "column",
        alignItems: "center"
    }, T8.createElement(V, {
        dimColor: !0
    }, r), T8.createElement(V, {
        dimColor: !0
    }, j1))), g === "horizontal" && T8.createElement(CY, {
        orientation: "vertical",
        dividerColor: "claude"
    }), g === "horizontal" && T8.createElement(E9q, {
        feeds: $ ? [I9q(E$A()), ap1(z)] : _ ? [ap1(z), x9q()] : J ? [ap1(z), b9q(J)] : [ap1(z), h9q(j)],
        maxWidth: J1
    }))), Y21() && T8.createElement(I, {
        paddingLeft: 2,
        flexDirection: "column"
    }, T8.createElement(V, {
        color: "warning"
    }, "Debug mode enabled"), T8.createElement(V, {
        dimColor: !0
    }, "Logging to: ", yx() ? "stderr" : M61())), T8.createElement(dbA, null), process.env.CLAUDE_CODE_TMUX_SESSION && T8.createElement(I, {
        paddingLeft: 2,
        flexDirection: "column"
    }, T8.createElement(V, {
        dimColor: !0
    }, "tmux session: ", process.env.CLAUDE_CODE_TMUX_SESSION), T8.createElement(V, {
        dimColor: !0
    }, process.env.CLAUDE_CODE_TMUX_PREFIX_CONFLICTS ? `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} ${process.env.CLAUDE_CODE_TMUX_PREFIX} d (press prefix twice - Claude uses ${process.env.CLAUDE_CODE_TMUX_PREFIX})` : `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} d`)), P && T8.createElement(I, {
        paddingLeft: 2,
        flexDirection: "column"
    }, !process.env.IS_DEMO && D.oauthAccount?.organizationName && T8.createElement(V, {
        dimColor: !0
    }, "Message from ", D.oauthAccount.organizationName, ":"), T8.createElement(V, null, P)), O && T8.createElement(I, {
        paddingLeft: 2,
        flexDirection: "column"
    }, T8.createElement(V, {
        color: "warning"
    }, "Your bash commands will be sandboxed. Disable with /sandbox.")), !1, !1)
}
// @from(Ln 414565, Col 4)
T8
// @from(Ln 414565, Col 8)
Le
// @from(Ln 414565, Col 12)
cbA = 50
// @from(Ln 414566, Col 4)
p9q = v(() => {
    m1();
    mq();
    LY();
    J9q();
    JN6();
    vq();
    wq();
    V9q();
    k9q();
    u9q();
    kW();
    cA();
    cp();
    Z6();
    Ex1();
    Q9q();
    uZ1();
    oj1();
    hA();
    Fl();
    g9q();
    k2();
    pbA();
    Gp1();
    d8();
    T8 = o(X1(), 1), Le = o(X1(), 1)
})
// @from(Ln 414595, Col 0)
function d9q(A) {
    let q = e(7),
        {
            message: K,
            isTranscriptMode: Y
        } = A;
    if (!(Y && K.timestamp && K.type === "assistant" && K.message.content.some(H8z))) return null;
    let w;
    if (q[0] !== K.timestamp) w = new Date(K.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: !0
    }), q[0] = K.timestamp, q[1] = w;
    else w = q[1];
    let H = w,
        $;
    if (q[2] !== H) $ = lbA.default.createElement(V, {
        dimColor: !0
    }, H), q[2] = H, q[3] = $;
    else $ = q[3];
    let O;
    if (q[4] !== H.length || q[5] !== $) O = lbA.default.createElement(I, {
        minWidth: H.length
    }, $), q[4] = H.length, q[5] = $, q[6] = O;
    else O = q[6];
    return O
}
// @from(Ln 414623, Col 0)
function H8z(A) {
    return A.type === "text"
}
// @from(Ln 414626, Col 4)
lbA
// @from(Ln 414627, Col 4)
c9q = v(() => {
    i1();
    m1();
    lbA = o(X1(), 1)
})
// @from(Ln 414633, Col 0)
function l9q(A) {
    let q = e(5),
        {
            message: K,
            isTranscriptMode: Y
        } = A;
    if (!(Y && K.type === "assistant" && K.message.model && K.message.content.some($8z))) return null;
    let w = K.message.model.length + 8,
        H;
    if (q[0] !== K.message.model) H = ibA.default.createElement(V, {
        dimColor: !0
    }, K.message.model), q[0] = K.message.model, q[1] = H;
    else H = q[1];
    let $;
    if (q[2] !== w || q[3] !== H) $ = ibA.default.createElement(I, {
        minWidth: w
    }, H), q[2] = w, q[3] = H, q[4] = $;
    else $ = q[4];
    return $
}
// @from(Ln 414654, Col 0)
function $8z(A) {
    return A.type === "text"
}
// @from(Ln 414657, Col 4)
ibA
// @from(Ln 414658, Col 4)
i9q = v(() => {
    i1();
    m1();
    ibA = o(X1(), 1)
})
// @from(Ln 414664, Col 0)
function O8z(A, q) {
    for (let K = q + 1; K < A.length; K++) {
        let Y = A[K];
        if (Y?.type === "assistant") {
            let z = Y.message.content[0];
            if (z?.type === "thinking" || z?.type === "redacted_thinking") continue;
            return !0
        }
        if (Y?.type === "system" || Y?.type === "attachment") continue;
        return !0
    }
    return !1
}
// @from(Ln 414678, Col 0)
function _8z(A) {
    let q = e(62),
        {
            message: K,
            index: Y,
            renderableMessages: z,
            tools: w,
            commands: H,
            verbose: $,
            inProgressToolUseIDs: O,
            streamingToolUseIDs: _,
            screen: J,
            canAnimate: X,
            onOpenRateLimitOptions: D,
            lastThinkingBlockId: j,
            latestBashOutputUUID: M,
            conversationId: P,
            screenToggleId: W,
            columns: G,
            isLoading: f,
            lookups: Z
        } = A,
        N = J === "transcript",
        T = K.type === "grouped_tool_use",
        k = K.type === "collapsed_read_search",
        y;
    if (q[0] !== Y || q[1] !== k || q[2] !== f || q[3] !== z) y = k && f && !O8z(z, Y), q[0] = Y, q[1] = k, q[2] = f, q[3] = z, q[4] = y;
    else y = q[4];
    let B = y,
        S = Y > 0 ? z[Y - 1] : null,
        m = K.type === "user" && S?.type === "user",
        b;
    if (q[5] !== k || q[6] !== T || q[7] !== K) b = T ? K.displayMessage : k ? Ad7(K) : K, q[5] = k, q[6] = T, q[7] = K, q[8] = b;
    else b = q[8];
    let g = b,
        U;
    if (q[9] !== k || q[10] !== T || q[11] !== Z || q[12] !== K) U = T || k ? [] : s9q(K, Z), q[9] = k, q[10] = T, q[11] = Z, q[12] = K, q[13] = U;
    else U = q[13];
    let x = U,
        p;
    if (q[14] !== O || q[15] !== k || q[16] !== T || q[17] !== Z || q[18] !== K || q[19] !== J || q[20] !== _) {
        let J1 = T || k ? new Set : a9q(K, Z);
        p = o9q(K, _, O, J1, J, Z), q[14] = O, q[15] = k, q[16] = T, q[17] = Z, q[18] = K, q[19] = J, q[20] = _, q[21] = p
    } else p = q[21];
    let l = p,
        r = !1;
    if (X)
        if (T) {
            let J1;
            if (q[22] !== O || q[23] !== K.messages) {
                let D1;
                if (q[25] !== O) D1 = (Z1) => {
                    let E1 = Z1.message.content[0];
                    return E1?.type === "tool_use" && O.has(E1.id)
                }, q[25] = O, q[26] = D1;
                else D1 = q[26];
                J1 = K.messages.some(D1), q[22] = O, q[23] = K.messages, q[24] = J1
            } else J1 = q[24];
            r = J1
        } else if (k) {
        let J1;
        if (q[27] !== O || q[28] !== K) J1 = ep7(K, O), q[27] = O, q[28] = K, q[29] = J1;
        else J1 = q[29];
        r = J1
    } else {
        let J1;
        if (q[30] !== O || q[31] !== K) {
            let D1 = Re(K);
            J1 = !D1 || O.has(D1), q[30] = O, q[31] = K, q[32] = J1
        } else J1 = q[32];
        r = J1
    }
    let s;
    if (q[33] !== g || q[34] !== N) s = N && g.type === "assistant" && g.message.content.some(J8z) && (g.timestamp || g.message.model), q[33] = g, q[34] = N, q[35] = s;
    else s = q[35];
    let O1 = s,
        T1 = `${K.uuid}-${P}-${W}`,
        N1;
    if (q[36] !== g || q[37] !== O1 || q[38] !== N) N1 = O1 && fE.createElement(I, {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 1,
        marginTop: 1
    }, fE.createElement(d9q, {
        message: g,
        isTranscriptMode: N
    }), fE.createElement(l9q, {
        message: g,
        isTranscriptMode: N
    })), q[36] = g, q[37] = O1, q[38] = N, q[39] = N1;
    else N1 = q[39];
    let j1 = !O1,
        q1;
    if (q[40] !== H || q[41] !== O || q[42] !== B || q[43] !== l || q[44] !== N || q[45] !== m || q[46] !== j || q[47] !== M || q[48] !== Z || q[49] !== K || q[50] !== D || q[51] !== x || q[52] !== r || q[53] !== j1 || q[54] !== w || q[55] !== $) q1 = fE.createElement(pR, {
        message: K,
        lookups: Z,
        addMargin: j1,
        tools: w,
        commands: H,
        verbose: $,
        inProgressToolUseIDs: O,
        progressMessagesForMessage: x,
        shouldAnimate: r,
        shouldShowDot: !0,
        isTranscriptMode: N,
        isStatic: l,
        onOpenRateLimitOptions: D,
        isActiveCollapsedGroup: B,
        isUserContinuation: m,
        lastThinkingBlockId: j,
        latestBashOutputUUID: M
    }), q[40] = H, q[41] = O, q[42] = B, q[43] = l, q[44] = N, q[45] = m, q[46] = j, q[47] = M, q[48] = Z, q[49] = K, q[50] = D, q[51] = x, q[52] = r, q[53] = j1, q[54] = w, q[55] = $, q[56] = q1;
    else q1 = q[56];
    let t;
    if (q[57] !== G || q[58] !== T1 || q[59] !== N1 || q[60] !== q1) t = fE.createElement(I, {
        key: T1,
        width: G,
        flexDirection: "column"
    }, N1, q1), q[57] = G, q[58] = T1, q[59] = N1, q[60] = q1, q[61] = t;
    else t = q[61];
    return t
}
// @from(Ln 414801, Col 0)
function J8z(A) {
    return A.type === "text"
}
// @from(Ln 414805, Col 0)
function X8z(A, q) {
    if (A.type === "grouped_tool_use") return A.messages.some((Y) => {
        let z = Y.message.content[0];
        return z?.type === "tool_use" && q.has(z.id)
    });
    if (A.type === "collapsed_read_search") return Fj1(A).some((z) => q.has(z));
    let K = Re(A);
    return !!K && q.has(K)
}
// @from(Ln 414815, Col 0)
function D8z(A, q) {
    if (A.type === "grouped_tool_use") return A.messages.every((Y) => {
        let z = Y.message.content[0];
        return z?.type === "tool_use" && q.has(z.id)
    });
    if (A.type === "collapsed_read_search") return Fj1(A).every((z) => q.has(z));
    let K = Re(A);
    return !K || q.has(K)
}
// @from(Ln 414825, Col 0)
function j8z(A, q) {
    if (A.message !== q.message) return !1;
    if (A.screen !== q.screen) return !1;
    if (A.message.type === "collapsed_read_search" && q.screen !== "transcript") return !1;
    if (A.columns !== q.columns) return !1;
    let K = A.latestBashOutputUUID === A.message.uuid,
        Y = q.latestBashOutputUUID === q.message.uuid;
    if (K !== Y) return !1;
    if (A.lastThinkingBlockId !== q.lastThinkingBlockId) return !1;
    let z = X8z(A.message, A.streamingToolUseIDs),
        w = D8z(A.message, A.lookups.resolvedToolUseIDs);
    if (z || !w) return !1;
    return !0
}
// @from(Ln 414839, Col 4)
fE
// @from(Ln 414839, Col 8)
n9q
// @from(Ln 414840, Col 4)
r9q = v(() => {
    i1();
    m1();
    N8();
    Eh();
    nP1();
    c9q();
    i9q();
    Ad1();
    fE = o(X1(), 1);
    n9q = fE.memo(_8z, j8z)
})
// @from(Ln 414853, Col 0)
function W8z(A, q) {
    if (A.size !== q.size) return !1;
    for (let K of A)
        if (!q.has(K)) return !1;
    return !0
}
// @from(Ln 414860, Col 0)
function o9q(A, q, K, Y, z, w) {
    if (z === "transcript") return !0;
    switch (A.type) {
        case "attachment":
        case "user":
        case "assistant": {
            let H = Re(A);
            if (!H) return !0;
            if (q.has(H)) return !1;
            if (K.has(H)) return !1;
            if (AYq(H, "PostToolUse", w)) return !1;
            return O9q(Y, w.resolvedToolUseIDs)
        }
        case "system":
            return A.subtype !== "api_error";
        case "grouped_tool_use":
            return A.messages.every(($) => {
                let O = $.message.content[0];
                return O?.type === "tool_use" && w.resolvedToolUseIDs.has(O.id)
            });
        case "collapsed_read_search":
            return !1
    }
}
// @from(Ln 414885, Col 0)
function G8z(A) {
    return A.type === "tool_result"
}
// @from(Ln 414889, Col 0)
function Z8z(A) {
    return iO([qR({
        content: [A.contentBlock]
    })])
}
// @from(Ln 414895, Col 0)
function f8z(A) {
    return A.type !== "progress"
}
// @from(Ln 414899, Col 0)
function V8z(A) {
    return A.contentBlock.id
}
// @from(Ln 414902, Col 4)
e$
// @from(Ln 414902, Col 8)
Kd1
// @from(Ln 414902, Col 13)
M8z = null
// @from(Ln 414903, Col 4)
qd1 = 10
// @from(Ln 414904, Col 4)
P8z = (A) => {
        let q = e(85),
            {
                messages: K,
                normalizedMessageHistory: Y,
                tools: z,
                commands: w,
                verbose: H,
                toolJSX: $,
                toolUseConfirmQueue: O,
                inProgressToolUseIDs: _,
                isMessageSelectorVisible: J,
                conversationId: X,
                screen: D,
                screenToggleId: j,
                streamingToolUses: M,
                showAllInTranscript: P,
                agentDefinitions: W,
                onOpenRateLimitOptions: G,
                hideLogo: f,
                isLoading: Z,
                hidePastThinking: N,
                streamingThinking: T
            } = A,
            k = P === void 0 ? !1 : P,
            y = f === void 0 ? !1 : f,
            B = N === void 0 ? !1 : N,
            {
                columns: S
            } = Z8(),
            m = RK("transcript:toggleShowAll", "Transcript", "Ctrl+E"),
            b;
        if (q[0] !== K || q[1] !== Y) b = [...Y, ...iO(K).filter(et)], q[0] = K, q[1] = Y, q[2] = b;
        else b = q[2];
        let g = b,
            U;
        A: {
            if (!T) {
                U = !1;
                break A
            }
            if (T.isStreaming) {
                U = !0;
                break A
            }
            if (T.streamingEndedAt) {
                U = Date.now() - T.streamingEndedAt < 30000;
                break A
            }
            U = !1
        }
        let x = U,
            p;
        A: {
            if (!B) {
                p = null;
                break A
            }
            if (x) {
                p = "streaming";
                break A
            }
            for (let j6 = g.length - 1; j6 >= 0; j6--) {
                let M6 = g[j6];
                if (M6?.type === "assistant") {
                    let N6 = M6.message.content;
                    for (let F6 = N6.length - 1; F6 >= 0; F6--)
                        if (N6[F6]?.type === "thinking") {
                            p = `${M6.uuid}:${F6}`;
                            break A
                        }
                } else if (M6?.type === "user") {
                    if (!M6.message.content.some(G8z)) {
                        p = "no-thinking";
                        break A
                    }
                }
            }
            p = null
        }
        let l = p,
            r;
        if (q[3] !== g) {
            A: {
                for (let j6 = g.length - 1; j6 >= 0; j6--) {
                    let M6 = g[j6];
                    if (M6?.type === "user") {
                        let N6 = M6.message.content;
                        for (let F6 of N6)
                            if (F6.type === "text") {
                                let P1 = F6.text;
                                if (P1.startsWith("<bash-stdout") || P1.startsWith("<bash-stderr")) {
                                    r = M6.uuid;
                                    break A
                                }
                            }
                    }
                }
                r = null
            }
            q[3] = g,
            q[4] = r
        }
        else r = q[4];
        let s = r,
            O1;
        if (q[5] !== _ || q[6] !== g || q[7] !== M) {
            let j6;
            if (q[9] !== _ || q[10] !== g) j6 = (M6) => {
                if (_.has(M6.contentBlock.id)) return !1;
                if (g.some((N6) => N6.type === "assistant" && N6.message.content[0].type === "tool_use" && N6.message.content[0].id === M6.contentBlock.id)) return !1;
                return !0
            }, q[9] = _, q[10] = g, q[11] = j6;
            else j6 = q[11];
            O1 = M.filter(j6), q[5] = _, q[6] = g, q[7] = M, q[8] = O1
        } else O1 = q[8];
        let T1 = O1,
            N1;
        if (q[12] !== T1) N1 = T1.flatMap(Z8z), q[12] = T1, q[13] = N1;
        else N1 = q[13];
        let j1 = N1,
            q1 = D === "transcript",
            t = q1 && !k,
            J1, D1, Z1;
        if (q[14] !== q1 || q[15] !== g || q[16] !== t || q[17] !== j1 || q[18] !== z || q[19] !== H) {
            let j6 = H ? g : EN(g),
                M6;
            if (q[23] !== q1) M6 = (k1) => qYq(k1, q1), q[23] = q1, q[24] = M6;
            else M6 = q[24];
            let N6 = t9q(j6.filter(f8z).filter(M6), j1),
                F6 = t ? N6.slice(-qd1) : N6;
            J1 = t && N6.length > qd1;
            let {
                messages: P1
            } = q9q(F6, z, H);
            D1 = Y9q(qd7(P1, z)), Z1 = e9q(g, F6), q[14] = q1, q[15] = g, q[16] = t, q[17] = j1, q[18] = z, q[19] = H, q[20] = J1, q[21] = D1, q[22] = Z1
        } else J1 = q[20], D1 = q[21], Z1 = q[22];
        let E1 = Z1,
            a;
        if (q[25] !== J1 || q[26] !== E1 || q[27] !== D1) a = {
            renderableMessages: D1,
            lookups: E1,
            hasTruncatedMessages: J1
        }, q[25] = J1, q[26] = E1, q[27] = D1, q[28] = a;
        else a = q[28];
        let {
            renderableMessages: A1,
            lookups: M1,
            hasTruncatedMessages: z1
        } = a, Y1;
        if (q[29] !== M) Y1 = new Set(M.map(V8z)), q[29] = M, q[30] = Y1;
        else Y1 = q[30];
        let _1 = Y1,
            $1 = (!$ || !!$.shouldContinueAnimation) && !O.length && !J,
            G1 = _.size > 0,
            {
                progress: L1
            } = YB(),
            x1 = Kd1.useRef(null),
            f1;
        if (q[31] === Symbol.for("react.memo_cache_sentinel")) f1 = f6().terminalProgressBarEnabled && !(M8z?.isProactiveActive() ?? !1), q[31] = f1;
        else f1 = q[31];
        let R1 = f1,
            H1, y1;
        if (q[32] !== G1 || q[33] !== L1) H1 = () => {
            let j6 = R1 ? G1 ? "indeterminate" : "completed" : null;
            if (x1.current === j6) return;
            x1.current = j6, L1(j6)
        }, y1 = [L1, R1, G1], q[32] = G1, q[33] = L1, q[34] = H1, q[35] = y1;
        else H1 = q[34], y1 = q[35];
        Kd1.useEffect(H1, y1);
        let B1, A6;
        if (q[36] !== L1) B1 = () => () => L1(null), A6 = [L1], q[36] = L1, q[37] = B1, q[38] = A6;
        else B1 = q[37], A6 = q[38];
        Kd1.useEffect(B1, A6);
        let O6;
        if (q[39] !== W || q[40] !== X || q[41] !== y || q[42] !== j) O6 = !y && e$.createElement(I, {
            flexDirection: "column",
            gap: 1,
            key: `logo-${X}-${j}`
        }, e$.createElement(U9q, {
            isBeforeFirstMessage: !1
        }), e$.createElement(H9q, {
            agentDefinitions: W
        })), q[39] = W, q[40] = X, q[41] = y, q[42] = j, q[43] = O6;
        else O6 = q[43];
        let P6;
        if (q[44] !== S || q[45] !== X || q[46] !== z1 || q[47] !== M1 || q[48] !== j || q[49] !== m) P6 = z1 && e$.createElement(CY, {
            key: `truncation-indicator-${X}-${j}`,
            dividerChar: "─",
            title: `${m} to show ${H6.bold(M1.normalizedMessageCount-qd1)} previous messages`,
            width: S
        }), q[44] = S, q[45] = X, q[46] = z1, q[47] = M1, q[48] = j, q[49] = m, q[50] = P6;
        else P6 = q[50];
        let V6;
        if (q[51] !== S || q[52] !== X || q[53] !== q1 || q[54] !== M1 || q[55] !== j || q[56] !== k || q[57] !== m) V6 = q1 && k && M1.normalizedMessageCount > qd1 && e$.createElement(CY, {
            key: `hide-indicator-${X}-${j}`,
            dividerChar: "─",
            title: `${m} to hide ${H6.bold(M1.normalizedMessageCount-qd1)} previous messages`,
            width: S
        }), q[51] = S, q[52] = X, q[53] = q1, q[54] = M1, q[55] = j, q[56] = k, q[57] = m, q[58] = V6;
        else V6 = q[58];
        let q6;
        if (q[59] !== $1 || q[60] !== S || q[61] !== w || q[62] !== X || q[63] !== _ || q[64] !== Z || q[65] !== l || q[66] !== s || q[67] !== M1 || q[68] !== G || q[69] !== A1 || q[70] !== D || q[71] !== j || q[72] !== _1 || q[73] !== z || q[74] !== H) q6 = A1.map((j6, M6) => e$.createElement(n9q, {
            key: `${j6.uuid}-${X}-${j}`,
            message: j6,
            index: M6,
            renderableMessages: A1,
            tools: z,
            commands: w,
            verbose: H,
            inProgressToolUseIDs: _,
            streamingToolUseIDs: _1,
            screen: D,
            canAnimate: $1,
            onOpenRateLimitOptions: G,
            lastThinkingBlockId: l,
            latestBashOutputUUID: s,
            conversationId: X,
            screenToggleId: j,
            columns: S,
            isLoading: Z,
            lookups: M1
        })), q[59] = $1, q[60] = S, q[61] = w, q[62] = X, q[63] = _, q[64] = Z, q[65] = l, q[66] = s, q[67] = M1, q[68] = G, q[69] = A1, q[70] = D, q[71] = j, q[72] = _1, q[73] = z, q[74] = H, q[75] = q6;
        else q6 = q[75];
        let p1;
        if (q[76] !== x || q[77] !== T) p1 = x && T && e$.createElement(I, {
            marginTop: 1
        }, e$.createElement(CM6, {
            param: {
                type: "thinking",
                thinking: T.thinking
            },
            addMargin: !1,
            isTranscriptMode: !0,
            hideInTranscript: !1
        })), q[76] = x, q[77] = T, q[78] = p1;
        else p1 = q[78];
        let K6;
        if (q[79] !== O6 || q[80] !== P6 || q[81] !== V6 || q[82] !== q6 || q[83] !== p1) K6 = e$.createElement(e$.Fragment, null, O6, P6, V6, q6, p1), q[79] = O6, q[80] = P6, q[81] = V6, q[82] = q6, q[83] = p1, q[84] = K6;
        else K6 = q[84];
        return K6
    }
// @from(Ln 415147, Col 4)
g91
// @from(Ln 415148, Col 4)
Ad1 = v(() => {
    i1();
    m1();
    N8();
    Eh();
    $9q();
    mq();
    kW();
    q3();
    p9q();
    lvA();
    s2();
    $q1();
    cA();
    r9q();
    e$ = o(X1(), 1), Kd1 = o(X1(), 1);
    g91 = e$.memo(P8z, (A, q) => {
        let K = Object.keys(A);
        for (let Y of K) {
            if (Y === "onOpenRateLimitOptions") continue;
            if (A[Y] !== q[Y]) {
                if (Y === "streamingToolUses") {
                    let z = A.streamingToolUses,
                        w = q.streamingToolUses;
                    if (z.length === w.length && z.every((H, $) => H.contentBlock === w[$]?.contentBlock)) continue
                }
                if (Y === "inProgressToolUseIDs") {
                    if (W8z(A.inProgressToolUseIDs, q.inProgressToolUseIDs)) continue
                }
                if (Y === "tools") {
                    let z = A.tools,
                        w = q.tools;
                    if (z.length === w.length && z.every((H, $) => H.name === w[$]?.name)) continue
                }
                return !1
            }
        }
        return !0
    })
})
// @from(Ln 415189, Col 0)
function Yd1(A) {
    let q = e(10),
        {
            message: K,
            bold: Y,
            dimColor: z,
            subtitle: w
        } = A,
        H = Y === void 0 ? !1 : Y,
        $ = z === void 0 ? !1 : z,
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = mZ1.default.createElement(c4, null), q[0] = O;
    else O = q[0];
    let _;
    if (q[1] !== H || q[2] !== $ || q[3] !== K) _ = mZ1.default.createElement(I, {
        flexDirection: "row"
    }, O, mZ1.default.createElement(V, {
        bold: H,
        dimColor: $
    }, " ", K)), q[1] = H, q[2] = $, q[3] = K, q[4] = _;
    else _ = q[4];
    let J;
    if (q[5] !== w) J = w && mZ1.default.createElement(V, {
        dimColor: !0
    }, w), q[5] = w, q[6] = J;
    else J = q[6];
    let X;
    if (q[7] !== _ || q[8] !== J) X = mZ1.default.createElement(I, {
        flexDirection: "column"
    }, _, J), q[7] = _, q[8] = J, q[9] = X;
    else X = q[9];
    return X
}
// @from(Ln 415222, Col 4)
mZ1
// @from(Ln 415223, Col 4)
nbA = v(() => {
    i1();
    m1();
    x2();
    mZ1 = o(X1(), 1)
})
// @from(Ln 415230, Col 0)
function KYq(A) {
    let q = e(34),
        {
            log: K,
            onExit: Y,
            onSelect: z
        } = A,
        [w, H] = fP.default.useState(null),
        [$, O] = fP.default.useState(!1),
        _, J;
    if (q[0] !== K) _ = () => {
        if (sR(K)) O(!0), TI(K).then((l) => {
            H(l), O(!1)
        });
        else H(K)
    }, J = [K], q[0] = K, q[1] = _, q[2] = J;
    else _ = q[1], J = q[2];
    fP.default.useEffect(_, J);
    let X = w ?? K,
        D;
    if (q[3] !== X) D = Xw(X) || "", q[3] = X, q[4] = D;
    else D = q[4];
    let j = D,
        M;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) M = kt(), q[5] = M;
    else M = q[5];
    let P = M,
        W;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) W = {
        context: "Confirmation"
    }, q[6] = W;
    else W = q[6];
    DA("confirm:no", Y, W);
    let G;
    if (q[7] !== w || q[8] !== K || q[9] !== z) G = () => {
        z(w ?? K)
    }, q[7] = w, q[8] = K, q[9] = z, q[10] = G;
    else G = q[10];
    let f = G,
        Z;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) Z = {
        context: "Confirmation"
    }, q[11] = Z;
    else Z = q[11];
    if (DA("confirm:yes", f, Z), $) {
        let l;
        if (q[12] === Symbol.for("react.memo_cache_sentinel")) l = fP.default.createElement(Yd1, {
            message: "Loading session…"
        }), q[12] = l;
        else l = q[12];
        let r;
        if (q[13] === Symbol.for("react.memo_cache_sentinel")) r = fP.default.createElement(I, {
            flexDirection: "column",
            padding: 1
        }, l, fP.default.createElement(V, {
            dimColor: !0
        }, fP.default.createElement(oA, null, fP.default.createElement(NA, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        })))), q[13] = r;
        else r = q[13];
        return r
    }
    let N;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) N = [], q[14] = N;
    else N = q[14];
    let T;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) T = [], q[15] = T;
    else T = q[15];
    let k, y;
    if (q[16] === Symbol.for("react.memo_cache_sentinel")) k = [], y = new Set, q[16] = k, q[17] = y;
    else k = q[16], y = q[17];
    let B;
    if (q[18] === Symbol.for("react.memo_cache_sentinel")) B = [], q[18] = B;
    else B = q[18];
    let S;
    if (q[19] !== j || q[20] !== X.messages) S = fP.default.createElement(g91, {
        messages: X.messages,
        normalizedMessageHistory: N,
        tools: P,
        commands: T,
        verbose: !0,
        toolJSX: null,
        toolUseConfirmQueue: k,
        inProgressToolUseIDs: y,
        isMessageSelectorVisible: !1,
        conversationId: j,
        screen: "transcript",
        screenToggleId: 1,
        streamingToolUses: B,
        showAllInTranscript: !0,
        isLoading: !1
    }), q[19] = j, q[20] = X.messages, q[21] = S;
    else S = q[21];
    let m;
    if (q[22] !== X.modified) m = q71(X.modified), q[22] = X.modified, q[23] = m;
    else m = q[23];
    let b = X.gitBranch ? ` · ${X.gitBranch}` : "",
        g;
    if (q[24] !== X.messageCount || q[25] !== m || q[26] !== b) g = fP.default.createElement(V, null, m, " ·", " ", X.messageCount, " messages", b), q[24] = X.messageCount, q[25] = m, q[26] = b, q[27] = g;
    else g = q[27];
    let U;
    if (q[28] === Symbol.for("react.memo_cache_sentinel")) U = fP.default.createElement(V, {
        dimColor: !0
    }, fP.default.createElement(oA, null, fP.default.createElement(YA, {
        shortcut: "Enter",
        action: "resume"
    }), fP.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))), q[28] = U;
    else U = q[28];
    let x;
    if (q[29] !== g) x = fP.default.createElement(I, {
        flexShrink: 0,
        flexDirection: "column",
        borderTopDimColor: !0,
        borderBottom: !1,
        borderLeft: !1,
        borderRight: !1,
        borderStyle: "single",
        paddingLeft: 2
    }, g, U), q[29] = g, q[30] = x;
    else x = q[30];
    let p;
    if (q[31] !== S || q[32] !== x) p = fP.default.createElement(I, {
        flexDirection: "column"
    }, S, x), q[31] = S, q[32] = x, q[33] = p;
    else p = q[33];
    return p
}
// @from(Ln 415365, Col 4)
fP
// @from(Ln 415366, Col 4)
YYq = v(() => {
    i1();
    m1();
    vq();
    Ad1();
    $P();
    wK();
    BK();
    HK();
    nbA();
    lq();
    K7();
    fP = o(X1(), 1)
})
// @from(Ln 415381, Col 0)
function E8z(A, q) {
    if (A === rbA) return rbA.length + zd1;
    let K = UA(A),
        Y = q ? Math.min(K, q - zd1 - obA) : K;
    return Math.max(0, Y) + zd1 + obA
}
// @from(Ln 415388, Col 0)
function k8z(A, q) {
    let K = q - zd1 - obA;
    if (UA(A) <= K) return A;
    if (K <= 1) return A.charAt(0);
    return K3(A, K)
}
// @from(Ln 415395, Col 0)
function _Yq({
    tabs: A,
    selectedIndex: q,
    availableWidth: K,
    showAllProjects: Y = !1
}) {
    let z = Y ? "Resume (All Projects)" : "Resume",
        w = z.length + 1,
        H = Math.max(T8z, v8z),
        $ = K - w - H - 2,
        O = Math.max(0, Math.min(q, A.length - 1)),
        _ = Math.max(20, Math.floor($ / 2)),
        J = A.map((f) => E8z(f, _)),
        X = 0,
        D = A.length;
    if (J.reduce((f, Z, N) => f + Z + (N < J.length - 1 ? 1 : 0), 0) > $) {
        let f = $ - N8z,
            Z = J[O] ?? 0;
        X = O, D = O + 1;
        while (X > 0 || D < A.length) {
            let N = X > 0,
                T = D < A.length;
            if (N) {
                let k = (J[X - 1] ?? 0) + 1;
                if (Z + k <= f) {
                    X--, Z += k;
                    continue
                }
            }
            if (T) {
                let k = (J[D] ?? 0) + 1;
                if (Z + k <= f) {
                    D++, Z += k;
                    continue
                }
            }
            break
        }
    }
    let M = X,
        P = A.length - D,
        W = A.slice(X, D),
        G = W.map((f, Z) => X + Z);
    return U91.default.createElement(I, {
        flexDirection: "row",
        gap: 1
    }, U91.default.createElement(V, {
        color: "suggestion"
    }, z), M > 0 && U91.default.createElement(V, {
        dimColor: !0
    }, zYq, M), W.map((f, Z) => {
        let T = G[Z] === O,
            k = f === rbA ? f : `#${k8z(f,_-zd1)}`;
        return U91.default.createElement(V, {
            key: f,
            backgroundColor: T ? "suggestion" : void 0,
            color: T ? "inverseText" : void 0,
            bold: T
        }, " ", k, " ")
    }), P > 0 ? U91.default.createElement(V, {
        dimColor: !0
    }, wYq, P, HYq) : U91.default.createElement(V, {
        dimColor: !0
    }, $Yq))
}
// @from(Ln 415460, Col 4)
U91
// @from(Ln 415460, Col 9)
rbA = "All"
// @from(Ln 415461, Col 4)
zd1 = 2
// @from(Ln 415462, Col 4)
obA = 1
// @from(Ln 415463, Col 4)
zYq = "← "
// @from(Ln 415464, Col 4)
wYq = "→"
// @from(Ln 415465, Col 4)
HYq = " (tab to cycle)"
// @from(Ln 415466, Col 4)
$Yq = "(tab to cycle)"
// @from(Ln 415467, Col 4)
OYq = 2
// @from(Ln 415468, Col 4)
N8z
// @from(Ln 415468, Col 9)
T8z
// @from(Ln 415468, Col 14)
v8z
// @from(Ln 415469, Col 4)
JYq = v(() => {
    m1();
    LY();
    vq();
    U91 = o(X1(), 1), N8z = zYq.length + OYq + 1, T8z = wYq.length + OYq + HYq.length, v8z = $Yq.length
})
// @from(Ln 415476, Col 0)
function jYq(A, q) {
    let K = A.replace(/\s+/g, " ").trim();
    return K3(K, q)
}
// @from(Ln 415481, Col 0)
function abA({
    before: A,
    match: q,
    after: K
}, Y) {
    return H6.dim(A) + Y(q) + H6.dim(K)
}
// @from(Ln 415489, Col 0)
function h8z(A, q, K) {
    let Y = A.toLowerCase().indexOf(q.toLowerCase());
    if (Y === -1) return null;
    let z = Y + q.length,
        w = Math.max(0, Y - K),
        H = Math.min(A.length, z + K),
        $ = A.slice(w, Y),
        O = A.slice(Y, z),
        _ = A.slice(z, H);
    return {
        before: (w > 0 ? "…" : "") + $.replace(/\s+/g, " ").trimStart(),
        match: O.trim(),
        after: _.replace(/\s+/g, " ").trimEnd() + (H < A.length ? "…" : "")
    }
}
// @from(Ln 415505, Col 0)
function sbA(A, q, K) {
    let {
        isGroupHeader: Y = !1,
        isChild: z = !1,
        forkCount: w = 0
    } = K || {}, H = Y && w > 0 ? L8z : z ? R8z : 0, $ = Y && w > 0 ? ` (+${w} other ${w===1?"session":"sessions"})` : "", O = A.isSidechain ? " (sidechain)" : "", _ = q - H - O.length - $.length;
    return `${jYq(Gi(A),_)}${O}${$}`
}
// @from(Ln 415514, Col 0)
function tbA(A, q) {
    let {
        isChild: K = !1,
        showProjectPath: Y = !1
    } = q || {}, z = K ? "    " : "", w = _C1(A), H = Y && A.projectPath ? ` · ${A.projectPath}` : "";
    return z + w + H
}
// @from(Ln 415522, Col 0)
function WN6(A) {
    let q = e(255),
        {
            logs: K,
            maxHeight: Y,
            forceWidth: z,
            onCancel: w,
            onSelect: H,
            onLogsChanged: $,
            onLoadMore: O,
            initialSearchQuery: _,
            showAllProjects: J,
            onToggleAllProjects: X,
            onAgenticSearch: D
        } = A,
        j = Y === void 0 ? 1 / 0 : Y,
        M = J === void 0 ? !1 : J,
        P = Z8(),
        W = z === void 0 ? P.columns : z,
        G = uq(w),
        f = k_(),
        Z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Z = Gc(), q[0] = Z;
    else Z = q[0];
    let N = Z,
        T = !1,
        [k] = T7(),
        y;
    if (q[1] !== k) y = MW(k), q[1] = k, q[2] = y;
    else y = q[2];
    let B = y,
        S;
    if (q[3] !== B.warning) S = (X8) => sg(X8, B.warning), q[3] = B.warning, q[4] = S;
    else S = q[4];
    let m = S,
        b = !1,
        [g, U] = $7.default.useState(null),
        [x, p] = $7.default.useState(!1),
        [l, r] = $7.default.useState(!1),
        [s, O1] = $7.default.useState(!1),
        T1;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) T1 = y8(), q[5] = T1;
    else T1 = q[5];
    let N1 = T1,
        [j1, q1] = $7.default.useState(""),
        [t, J1] = $7.default.useState(0),
        D1;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) D1 = new Set, q[6] = D1;
    else D1 = q[6];
    let [Z1, E1] = $7.default.useState(D1), [a, A1] = $7.default.useState(null), [M1, z1] = $7.default.useState(1), [Y1, _1] = $7.default.useState("list"), [$1, G1] = $7.default.useState(null), L1 = $7.default.useRef(null), [x1, f1] = $7.default.useState(0), R1;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) R1 = {
        status: "idle"
    }, q[7] = R1;
    else R1 = q[7];
    let [H1, y1] = $7.default.useState(R1), [B1, A6] = $7.default.useState(!1), O6 = $7.default.useRef(null), P6 = Y1 === "search" && H1.status !== "searching", V6, q6, p1;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) V6 = () => {
        _1("list"), c("tengu_session_search_toggled", {
            enabled: !1
        })
    }, q6 = () => {
        _1("list"), c("tengu_session_search_toggled", {
            enabled: !1
        })
    }, p1 = ["n"], q[8] = V6, q[9] = q6, q[10] = p1;
    else V6 = q[8], q6 = q[9], p1 = q[10];
    let K6 = _ || "",
        j6;
    if (q[11] !== K6 || q[12] !== P6) j6 = {
        isActive: P6,
        onExit: V6,
        onExitUp: q6,
        passthroughCtrlKeys: p1,
        initialQuery: K6
    }, q[11] = K6, q[12] = P6, q[13] = j6;
    else j6 = q[13];
    let {
        query: M6,
        setQuery: N6,
        cursorOffset: F6
    } = qF(j6), P1 = $7.default.useDeferredValue(M6), [k1, o1] = $7.default.useState(""), _6, z6;
    if (q[14] !== P1) _6 = () => {
        if (!P1) {
            o1("");
            return
        }
        let X8 = setTimeout(() => {
            o1(P1)
        }, 300);
        return () => clearTimeout(X8)
    }, z6 = [P1], q[14] = P1, q[15] = _6, q[16] = z6;
    else _6 = q[15], z6 = q[16];
    $7.default.useEffect(_6, z6);
    let [w6, r6] = $7.default.useState(null), [G6, L6] = $7.default.useState(!1), OA, bA;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) OA = () => {
        sj().then((X8) => U(X8)), jc(N1).then((X8) => {
            O1(X8.length > 1)
        })
    }, bA = [N1], q[17] = OA, q[18] = bA;
    else OA = q[17], bA = q[18];
    $7.default.useEffect(OA, bA);
    let lA = new Map(K.map(m8z)),
        E7;
    E7 = null;
    let V4;
    if (q[19] !== K) V4 = U8z(K), q[19] = K, q[20] = V4;
    else V4 = q[20];
    let RA = V4,
        O7 = RA.length > 0,
        tK;
    if (q[21] !== O7 || q[22] !== RA) tK = O7 ? ["All", ...RA] : [], q[21] = O7, q[22] = RA, q[23] = tK;
    else tK = q[23];
    let gq = tK,
        xq, U8;
    if (q[24] !== x1 || q[25] !== gq.length) xq = () => {
        if (gq.length > 0 && x1 >= gq.length) f1(0)
    }, U8 = [gq.length, x1], q[24] = x1, q[25] = gq.length, q[26] = xq, q[27] = U8;
    else xq = q[26], U8 = q[27];
    $7.default.useEffect(xq, U8);
    let R4 = gq[x1],
        O3 = R4 === "All" ? void 0 : R4,
        HY = O7 ? 1 : 0,
        _4 = K;
    if (N) {
        let X8;
        if (q[28] !== K) X8 = K.filter(B8z), q[28] = K, q[29] = X8;
        else X8 = q[29];
        _4 = X8
    }
    if (O3 !== void 0) {
        let X8;
        if (q[30] !== _4 || q[31] !== O3) {
            let E8;
            if (q[33] !== O3) E8 = (fq) => fq.tag === O3, q[33] = O3, q[34] = E8;
            else E8 = q[34];
            X8 = _4.filter(E8), q[30] = _4, q[31] = O3, q[32] = X8
        } else X8 = q[32];
        _4 = X8
    }
    if (x && g) {
        let X8;
        if (q[35] !== g || q[36] !== _4) {
            let E8;
            if (q[38] !== g) E8 = (fq) => fq.gitBranch === g, q[38] = g, q[39] = E8;
            else E8 = q[39];
            X8 = _4.filter(E8), q[35] = g, q[36] = _4, q[37] = X8
        } else X8 = q[37];
        _4 = X8
    }
    if (s && !l) {
        let X8;
        if (q[40] !== _4) {
            let E8;
            if (q[42] === Symbol.for("react.memo_cache_sentinel")) E8 = (fq) => fq.projectPath === N1, q[42] = E8;
            else E8 = q[42];
            X8 = _4.filter(E8), q[40] = _4, q[41] = X8
        } else X8 = q[41];
        _4 = X8
    }
    let Az = _4,
        Wz;
    A: {
        if (!M6) {
            Wz = Az;
            break A
        }
        let X8;
        if (q[43] !== Az || q[44] !== M6) {
            let E8 = M6.toLowerCase();
            X8 = Az.filter((fq) => {
                let t3 = Gi(fq).toLowerCase(),
                    aq = (fq.gitBranch || "").toLowerCase(),
                    Zz = (fq.tag || "").toLowerCase(),
                    VY = fq.prNumber ? `pr #${fq.prNumber} ${fq.prRepository||""}`.toLowerCase() : "";
                return t3.includes(E8) || aq.includes(E8) || Zz.includes(E8) || VY.includes(E8)
            }), q[43] = Az, q[44] = M6, q[45] = X8
        } else X8 = q[45];Wz = X8
    }
    let ZY = Wz,
        $Y, OY;
    if (q[46] !== k1 || q[47] !== P1) $Y = () => {}, OY = [P1, k1, !1], q[46] = k1, q[47] = P1, q[48] = $Y, q[49] = OY;
    else $Y = q[48], OY = q[49];
    $7.default.useEffect($Y, OY);
    let fY, J2;
    if (q[50] !== k1) fY = () => {
        r6(null), L6(!1);
        return
    }, J2 = [k1, null, !1], q[50] = k1, q[51] = fY, q[52] = J2;
    else fY = q[51], J2 = q[52];
    $7.default.useEffect(fY, J2);
    let o5, g2;
    if (q[53] !== k1 || q[54] !== w6 || q[55] !== ZY) {
        if (g2 = new Map, o5 = ZY, w6 && k1 && w6.query === k1) {
            for (let t3 of w6.results)
                if (t3.searchableText) {
                    let aq = h8z(t3.searchableText, k1, S8z);
                    if (aq) g2.set(t3.log, aq)
                } let X8;
            if (q[58] !== o5) X8 = new Set(o5.map(x8z)), q[58] = o5, q[59] = X8;
            else X8 = q[59];
            let E8 = X8,
                fq;
            if (q[60] !== w6.results || q[61] !== o5 || q[62] !== E8) {
                let t3;
                if (q[64] !== E8) t3 = (Zz) => !E8.has(Zz.messages[0]?.uuid), q[64] = E8, q[65] = t3;
                else t3 = q[65];
                let aq = w6.results.map(I8z).filter(t3);
                fq = [...o5, ...aq], q[60] = w6.results, q[61] = o5, q[62] = E8, q[63] = fq
            } else fq = q[63];
            o5 = fq
        }
        q[53] = k1, q[54] = w6, q[55] = ZY, q[56] = o5, q[57] = g2
    } else o5 = q[56], g2 = q[57];
    let W$;
    if (q[66] !== o5 || q[67] !== g2) W$ = {
        filteredLogs: o5,
        snippets: g2
    }, q[66] = o5, q[67] = g2, q[68] = W$;
    else W$ = q[68];
    let {
        filteredLogs: c9,
        snippets: C3
    } = W$, Gz;
    A: {
        if (H1.status === "results" && H1.results.length > 0) {
            Gz = H1.results;
            break A
        }
        Gz = c9
    }
    let Oq = Gz,
        vK = Math.max(30, W - 4),
        l9;
    A: {
        if (!N) {
            let E8;
            if (q[69] === Symbol.for("react.memo_cache_sentinel")) E8 = [], q[69] = E8;
            else E8 = q[69];
            l9 = E8;
            break A
        }
        let X8;
        if (q[70] !== Oq || q[71] !== m || q[72] !== vK || q[73] !== M || q[74] !== C3) {
            let E8 = g8z(Oq);
            X8 = Array.from(E8.entries()).map((fq) => {
                let [t3, aq] = fq, Zz = aq[0], VY = Oq.indexOf(Zz), T4 = C3.get(Zz), i9 = T4 ? abA(T4, m) : null;
                if (aq.length === 1) {
                    let sw = tbA(Zz, {
                        showProjectPath: M
                    });
                    return {
                        id: `log:${t3}:0`,
                        value: {
                            log: Zz,
                            indexInFiltered: VY
                        },
                        label: sbA(Zz, vK),
                        description: i9 ? `${sw}
  ${i9}` : sw,
                        dimDescription: !0
                    }
                }
                let D2 = aq.length - 1,
                    OD = aq.slice(1).map((sw, I6) => {
                        let tA = Oq.indexOf(sw),
                            w7 = C3.get(sw),
                            l7 = w7 ? abA(w7, m) : null,
                            YK = tbA(sw, {
                                isChild: !0,
                                showProjectPath: M
                            });
                        return {
                            id: `log:${t3}:${I6+1}`,
                            value: {
                                log: sw,
                                indexInFiltered: tA
                            },
                            label: sbA(sw, vK, {
                                isChild: !0
                            }),
                            description: l7 ? `${YK}
      ${l7}` : YK,
                            dimDescription: !0
                        }
                    }),
                    G$ = tbA(Zz, {
                        showProjectPath: M
                    });
                return {
                    id: `group:${t3}`,
                    value: {
                        log: Zz,
                        indexInFiltered: VY
                    },
                    label: sbA(Zz, vK, {
                        isGroupHeader: !0,
                        forkCount: D2
                    }),
                    description: i9 ? `${G$}
  ${i9}` : G$,
                    dimDescription: !0,
                    children: OD
                }
            }), q[70] = Oq, q[71] = m, q[72] = vK, q[73] = M, q[74] = C3, q[75] = X8
        } else X8 = q[75];l9 = X8
    }
    let _3 = l9,
        TA;
    A: {
        if (N) {
            let E8;
            if (q[76] === Symbol.for("react.memo_cache_sentinel")) E8 = [], q[76] = E8;
            else E8 = q[76];
            TA = E8;
            break A
        }
        let X8;
        if (q[77] !== Oq || q[78] !== m || q[79] !== vK || q[80] !== M || q[81] !== C3) {
            let E8;
            if (q[83] !== m || q[84] !== vK || q[85] !== M || q[86] !== C3) E8 = (fq, t3) => {
                let Zz = Gi(fq) + (fq.isSidechain ? " (sidechain)" : ""),
                    VY = jYq(Zz, vK),
                    T4 = _C1(fq),
                    i9 = M && fq.projectPath ? ` · ${fq.projectPath}` : "",
                    D2 = C3.get(fq),
                    OD = D2 ? abA(D2, m) : null;
                return {
                    label: VY,
                    description: OD ? `${T4}${i9}
  ${OD}` : T4 + i9,
                    dimDescription: !0,
                    value: t3.toString()
                }
            }, q[83] = m, q[84] = vK, q[85] = M, q[86] = C3, q[87] = E8;
            else E8 = q[87];
            X8 = Oq.map(E8), q[77] = Oq, q[78] = m, q[79] = vK, q[80] = M, q[81] = C3, q[82] = X8
        } else X8 = q[82];TA = X8
    }
    let F7 = TA,
        f8 = a?.value.log ?? null,
        oq;
    if (q[88] !== Oq || q[89] !== Z1 || q[90] !== f8) oq = () => {
        if (!N || !f8) return "";
        let X8 = Xw(f8);
        if (!X8) return "";
        let E8 = Oq.filter((Zz) => Xw(Zz) === X8);
        if (!(E8.length > 1)) return "";
        let t3 = Z1.has(X8);
        if (E8.indexOf(f8) > 0) return "← to collapse";
        return t3 ? "← to collapse" : "→ to expand"
    }, q[88] = Oq, q[89] = Z1, q[90] = f8, q[91] = oq;
    else oq = q[91];
    let j5 = oq,
        N4;
    if (q[92] !== f8 || q[93] !== $ || q[94] !== j1) N4 = async () => {
        let X8 = f8 ? Xw(f8) : void 0;
        if (!f8 || !X8) {
            _1("list"), q1("");
            return
        }
        if (j1.trim()) {
            if (await Q91(X8, j1.trim(), f8.fullPath), N && $) $()
        }
        _1("list"), q1("")
    }, q[92] = f8, q[93] = $, q[94] = j1, q[95] = N4;
    else N4 = q[95];
    let E9 = N4,
        W4;
    if (q[96] === Symbol.for("react.memo_cache_sentinel")) W4 = () => {
        _1("list"), c("tengu_session_search_toggled", {
            enabled: !1
        })
    }, q[96] = W4;
    else W4 = q[96];
    let F1 = W4,
        c1;
    if (q[97] === Symbol.for("react.memo_cache_sentinel")) c1 = () => {
        _1("search"), c("tengu_session_search_toggled", {
            enabled: !0
        })
    }, q[97] = c1;
    else c1 = q[97];
    let X6 = c1,
        T6;
    if (q[98] !== K || q[99] !== D || q[100] !== M6) T6 = async () => {
        M6.trim();
        return
    }, q[98] = K, q[99] = D, q[100] = M6, q[101] = T6;
    else T6 = q[101];
    let l6 = T6,
        fA;
    if (q[102] !== H1.query || q[103] !== H1.status || q[104] !== M6) fA = () => {
        if (H1.status !== "idle" && H1.status !== "searching") {
            if (H1.status === "results" && H1.query !== M6 || H1.status === "error") y1({
                status: "idle"
            })
        }
    }, q[102] = H1.query, q[103] = H1.status, q[104] = M6, q[105] = fA;
    else fA = q[105];
    let aA;
    if (q[106] !== H1 || q[107] !== M6) aA = [M6, H1], q[106] = H1, q[107] = M6, q[108] = aA;
    else aA = q[108];
    $7.default.useEffect(fA, aA);
    let nA, V8;
    if (q[109] === Symbol.for("react.memo_cache_sentinel")) nA = () => () => {
        O6.current?.abort()
    }, V8 = [], q[109] = nA, q[110] = V8;
    else nA = q[109], V8 = q[110];
    $7.default.useEffect(nA, V8);
    let K8 = $7.default.useRef(H1.status),
        $8;
    if (q[111] !== H1.status || q[112] !== Oq[0] || q[113] !== Oq.length || q[114] !== _3) $8 = () => {
        let X8 = K8.current;
        if (K8.current = H1.status, X8 === "searching" && H1.status === "results") {
            if (N && _3.length > 0) A1(_3[0]);
            else if (!N && Oq.length > 0) {
                let E8 = Oq[0];
                A1({
                    id: "0",
                    value: {
                        log: E8,
                        indexInFiltered: 0
                    },
                    label: ""
                })
            }
        }
    }, q[111] = H1.status, q[112] = Oq[0], q[113] = Oq.length, q[114] = _3, q[115] = $8;
    else $8 = q[115];
    let I7;
    if (q[116] !== H1.status || q[117] !== Oq || q[118] !== _3) I7 = [H1.status, N, _3, Oq], q[116] = H1.status, q[117] = Oq, q[118] = _3, q[119] = I7;
    else I7 = q[119];
    $7.default.useEffect($8, I7);
    let Lq;
    if (q[120] !== Oq) Lq = (X8) => {
        let E8 = parseInt(X8, 10),
            fq = Oq[E8];
        if (!fq || L1.current === E8.toString()) return;
        L1.current = E8.toString(), A1({
            id: E8.toString(),
            value: {
                log: fq,
                indexInFiltered: E8
            },
            label: ""
        }), z1(E8 + 1)
    }, q[120] = Oq, q[121] = Lq;
    else Lq = q[121];
    let e4 = Lq,
        Rq;
    if (q[122] !== Oq) Rq = (X8) => {
        A1(X8);
        let E8 = Oq.findIndex((fq) => Xw(fq) === Xw(X8.value.log));
        if (E8 >= 0) z1(E8 + 1)
    }, q[122] = Oq, q[123] = Rq;
    else Rq = q[123];
    let F5 = Rq,
        k9;
    if (q[124] === Symbol.for("react.memo_cache_sentinel")) k9 = () => {
        O6.current?.abort(), y1({
            status: "idle"
        }), c("tengu_agentic_search_cancelled", {})
    }, q[124] = k9;
    else k9 = q[124];
    let HO = Y1 !== "preview" && H1.status === "searching",
        U2;
    if (q[125] !== HO) U2 = {
        context: "Confirmation",
        isActive: HO
    }, q[125] = HO, q[126] = U2;
    else U2 = q[126];
    DA("confirm:no", k9, U2);
    let rw;
    if (q[127] === Symbol.for("react.memo_cache_sentinel")) rw = () => {
        _1("list"), q1("")
    }, q[127] = rw;
    else rw = q[127];
    let ow = Y1 === "rename" && H1.status !== "searching",
        r_;
    if (q[128] !== ow) r_ = {
        context: "Settings",
        isActive: ow
    }, q[128] = ow, q[129] = r_;
    else r_ = q[129];
    DA("confirm:no", rw, r_);
    let hH;
    if (q[130] !== w || q[131] !== N6) hH = () => {
        N6(""), A6(!1), w?.()
    }, q[130] = w, q[131] = N6, q[132] = hH;
    else hH = q[132];
    let pJ = Y1 !== "preview" && Y1 !== "rename" && Y1 !== "search" && B1 && H1.status !== "searching",
        $O;
    if (q[133] !== pJ) $O = {
        context: "Confirmation",
        isActive: pJ
    }, q[133] = pJ, q[134] = $O;
    else $O = q[134];
    DA("confirm:no", hH, $O);
    let IH;
    if (q[135] !== H1.status || q[136] !== x || q[137] !== f8 || q[138] !== l6 || q[139] !== s || q[140] !== O7 || q[141] !== B1 || q[142] !== D || q[143] !== X || q[144] !== M6 || q[145] !== N6 || q[146] !== M || q[147] !== l || q[148] !== gq || q[149] !== RA || q[150] !== Y1) IH = (X8, E8) => {
        if (Y1 === "preview") return;
        if (H1.status === "searching") return;
        if (Y1 === "rename");
        else if (Y1 === "search") {
            if (X8.toLowerCase() === "n" && E8.ctrl) F1();
            else if (E8.return || E8.downArrow) M6.trim()
        } else {
            if (B1) {
                if (E8.return) {
                    l6(), A6(!1);
                    return
                } else if (E8.downArrow) {
                    A6(!1);
                    return
                } else if (E8.upArrow) {
                    _1("search"), A6(!1);
                    return
                }
            }
            if (O7 && E8.tab) {
                let aq = E8.shift ? -1 : 1;
                f1((Zz) => {
                    let VY = (Zz + gq.length + aq) % gq.length,
                        T4 = gq[VY];
                    return c("tengu_session_tag_filter_changed", {
                        is_all: T4 === "All",
                        tag_count: RA.length
                    }), VY
                });
                return
            }
            let fq = !E8.ctrl && !E8.meta,
                t3 = X8.toLowerCase();
            if (t3 === "a" && E8.ctrl && X) X(), c("tengu_session_all_projects_toggled", {
                enabled: !M
            });
            else if (t3 === "b" && E8.ctrl) {
                let aq = !x;
                p(aq), c("tengu_session_branch_filter_toggled", {
                    enabled: aq
                })
            } else if (t3 === "w" && E8.ctrl && s) {
                let aq = !l;
                r(aq), c("tengu_session_worktree_filter_toggled", {
                    enabled: aq
                })
            } else if (t3 === "/" && fq) _1("search"), c("tengu_session_search_toggled", {
                enabled: !0
            });
            else if (t3 === "r" && E8.ctrl && f8) _1("rename"), q1(""), c("tengu_session_rename_started", {});
            else if (t3 === "v" && E8.ctrl && f8) G1(f8), _1("preview"), c("tengu_session_preview_opened", {
                messageCount: f8.messageCount
            });
            else if (f8 && fq && X8.length > 0 && !/^\s+$/.test(X8)) _1("search"), N6(X8), c("tengu_session_search_toggled", {
                enabled: !0
            })
        }
    }, q[135] = H1.status, q[136] = x, q[137] = f8, q[138] = l6, q[139] = s, q[140] = O7, q[141] = B1, q[142] = D, q[143] = X, q[144] = M6, q[145] = N6, q[146] = M, q[147] = l, q[148] = gq, q[149] = RA, q[150] = Y1, q[151] = IH;
    else IH = q[151];
    let aw;
    if (q[152] === Symbol.for("react.memo_cache_sentinel")) aw = {
        isActive: !0
    }, q[152] = aw;
    else aw = q[152];
    D8(IH, aw);
    let X2;
    if (q[153] !== x || q[154] !== g || q[155] !== s || q[156] !== l) {
        if (X2 = [], x && g) X2.push(g);
        if (s && !l) X2.push("current worktree");
        q[153] = x, q[154] = g, q[155] = s, q[156] = l, q[157] = X2
    } else X2 = q[157];
    let Qj = 8 + (X2.length > 0 && Y1 !== "search" ? 1 : 0) + HY,
        p2 = Math.max(1, Math.floor((j - Qj - 2) / 3)),
        wD, LP;
    if (q[158] !== Oq.length || q[159] !== M1 || q[160] !== O || q[161] !== p2) wD = () => {
        if (!O) return;
        let X8 = p2 * 2;
        if (M1 + X8 >= Oq.length) O(p2 * 3)
    }, LP = [M1, p2, Oq.length, O], q[158] = Oq.length, q[159] = M1, q[160] = O, q[161] = p2, q[162] = wD, q[163] = LP;
    else wD = q[162], LP = q[163];
    if ($7.default.useEffect(wD, LP), K.length === 0) return null;
    if (Y1 === "preview" && $1 && N) {
        let X8;
        if (q[164] === Symbol.for("react.memo_cache_sentinel")) X8 = () => {
            _1("list"), G1(null)
        }, q[164] = X8;
        else X8 = q[164];
        let E8;
        if (q[165] !== H || q[166] !== $1) E8 = $7.default.createElement(KYq, {
            log: $1,
            onExit: X8,
            onSelect: H
        }), q[165] = H, q[166] = $1, q[167] = E8;
        else E8 = q[167];
        return E8
    }
    let gj = j - 1,
        S3;
    if (q[168] !== W) S3 = "─".repeat(W), q[168] = W, q[169] = S3;
    else S3 = q[169];
    let eK;
    if (q[170] !== S3) eK = $7.default.createElement(I, {
        flexShrink: 0
    }, $7.default.createElement(V, {
        color: "suggestion"
    }, S3)), q[170] = S3, q[171] = eK;
    else eK = q[171];
    let OO;
    if (q[172] === Symbol.for("react.memo_cache_sentinel")) OO = $7.default.createElement(I, {
        flexShrink: 0
    }, $7.default.createElement(V, null, " ")), q[172] = OO;
    else OO = q[172];
    let HD;
    if (q[173] !== W || q[174] !== Oq.length || q[175] !== M1 || q[176] !== O7 || q[177] !== x1 || q[178] !== M || q[179] !== gq || q[180] !== Y1 || q[181] !== p2) HD = O7 ? $7.default.createElement(_Yq, {
        tabs: gq,
        selectedIndex: x1,
        availableWidth: W,
        showAllProjects: M
    }) : $7.default.createElement(I, {
        flexShrink: 0
    }, $7.default.createElement(V, {
        bold: !0,
        color: "suggestion"
    }, "Resume Session", Y1 === "list" && Oq.length > p2 && $7.default.createElement(V, {
        dimColor: !0
    }, " ", "(", M1, " of ", Oq.length, ")"))), q[173] = W, q[174] = Oq.length, q[175] = M1, q[176] = O7, q[177] = x1, q[178] = M, q[179] = gq, q[180] = Y1, q[181] = p2, q[182] = HD;
    else HD = q[182];
    let xH = Y1 === "search",
        o_;
    if (q[183] !== f || q[184] !== F6 || q[185] !== M6 || q[186] !== xH) o_ = $7.default.createElement(AF, {
        query: M6,
        isFocused: xH,
        isTerminalFocused: f,
        cursorOffset: F6
    }), q[183] = f, q[184] = F6, q[185] = M6, q[186] = xH, q[187] = o_;
    else o_ = q[187];
    let dJ;
    if (q[188] !== X2 || q[189] !== Y1) dJ = X2.length > 0 && Y1 !== "search" && $7.default.createElement(I, {
        flexShrink: 0,
        paddingLeft: 2
    }, $7.default.createElement(V, {
        dimColor: !0
    }, $7.default.createElement(oA, null, X2))), q[188] = X2, q[189] = Y1, q[190] = dJ;
    else dJ = q[190];
    let $D;
    if (q[191] === Symbol.for("react.memo_cache_sentinel")) $D = $7.default.createElement(I, {
        flexShrink: 0
    }, $7.default.createElement(V, null, " ")), q[191] = $D;
    else $D = q[191];
    let _O;
    if (q[192] !== H1.status) _O = H1.status === "searching" && $7.default.createElement(I, {
        paddingLeft: 1,
        flexShrink: 0
    }, $7.default.createElement(c4, null), $7.default.createElement(V, null, " Searching…")), q[192] = H1.status, q[193] = _O;
    else _O = q[193];
    let a_;
    if (q[194] !== H1.results || q[195] !== H1.status) a_ = H1.status === "results" && H1.results.length > 0 && $7.default.createElement(I, {
        paddingLeft: 1,
        marginBottom: 1,
        flexShrink: 0
    }, $7.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, "Claude found these results:")), q[194] = H1.results, q[195] = H1.status, q[196] = a_;
    else a_ = q[196];
    let E5;
    if (q[197] !== H1.results || q[198] !== H1.status || q[199] !== c9) E5 = H1.status === "results" && H1.results.length === 0 && c9.length === 0 && $7.default.createElement(I, {
        paddingLeft: 1,
        marginBottom: 1,
        flexShrink: 0
    }, $7.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, "No matching sessions found.")), q[197] = H1.results, q[198] = H1.status, q[199] = c9, q[200] = E5;
    else E5 = q[200];
    let Pw;
    if (q[201] !== H1.status || q[202] !== c9) Pw = H1.status === "error" && c9.length === 0 && $7.default.createElement(I, {
        paddingLeft: 1,
        marginBottom: 1,
        flexShrink: 0
    }, $7.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, "No matching sessions found.")), q[201] = H1.status, q[202] = c9, q[203] = Pw;
    else Pw = q[203];
    let bH;
    if (q[204] !== H1.status || q[205] !== B1 || q[206] !== D || q[207] !== M6) bH = Boolean(M6.trim()) && D && !1, q[204] = H1.status, q[205] = B1, q[206] = D, q[207] = M6, q[208] = bH;
    else bH = q[208];
    let cJ;
    if (q[209] !== H1.status || q[210] !== x || q[211] !== W || q[212] !== Oq || q[213] !== Z1 || q[214] !== F7 || q[215] !== f8 || q[216] !== a?.id || q[217] !== e4 || q[218] !== E9 || q[219] !== F5 || q[220] !== B1 || q[221] !== w || q[222] !== H || q[223] !== t || q[224] !== j1 || q[225] !== _3 || q[226] !== Y1 || q[227] !== p2) cJ = H1.status === "searching" ? null : Y1 === "rename" && f8 ? $7.default.createElement(I, {
        paddingLeft: 2,
        flexDirection: "column"
    }, $7.default.createElement(V, {
        bold: !0
    }, "Rename session:"), $7.default.createElement(I, {
        paddingTop: 1
    }, $7.default.createElement(k3, {
        value: j1,
        onChange: q1,
        onSubmit: E9,
        placeholder: Gi(f8, "Enter new session name"),
        columns: W,
        cursorOffset: t,
        onChangeCursorOffset: J1,
        showCursor: !0
    }))) : N ? $7.default.createElement(e5q, {
        nodes: _3,
        onSelect: (X8) => {
            H(X8.value.log)
        },
        onFocus: F5,
        onCancel: w,
        focusNodeId: a?.id,
        visibleOptionCount: p2,
        layout: "expanded",
        isDisabled: Y1 === "search" || B1,
        hideIndexes: !1,
        isNodeExpanded: (X8) => {
            if (Y1 === "search" || x) return !0;
            let E8 = typeof X8 === "string" && X8.startsWith("group:") ? X8.substring(6) : null;
            return E8 ? Z1.has(E8) : !1
        },
        onExpand: (X8) => {
            let E8 = typeof X8 === "string" && X8.startsWith("group:") ? X8.substring(6) : null;
            if (E8) E1((fq) => new Set([...fq, E8])), c("tengu_session_group_expanded", {})
        },
        onCollapse: (X8) => {
            let E8 = typeof X8 === "string" && X8.startsWith("group:") ? X8.substring(6) : null;
            if (E8) E1((fq) => {
                let t3 = new Set(fq);
                return t3.delete(E8), t3
            })
        },
        onUpFromFirstItem: X6
    }) : $7.default.createElement(kA, {
        options: F7,
        onChange: (X8) => {
            let E8 = parseInt(X8, 10),
                fq = Oq[E8];
            if (fq) H(fq)
        },
        visibleOptionCount: p2,
        onCancel: w,
        onFocus: e4,
        defaultFocusValue: a?.id.toString(),
        layout: "expanded",
        isDisabled: Y1 === "search" || B1,
        onUpFromFirstItem: X6
    }), q[209] = H1.status, q[210] = x, q[211] = W, q[212] = Oq, q[213] = Z1, q[214] = F7, q[215] = f8, q[216] = a?.id, q[217] = e4, q[218] = E9, q[219] = F5, q[220] = B1, q[221] = w, q[222] = H, q[223] = t, q[224] = j1, q[225] = _3, q[226] = Y1, q[227] = p2, q[228] = cJ;
    else cJ = q[228];
    let lJ;
    if (q[229] !== H1.status || q[230] !== g || q[231] !== G.keyName || q[232] !== G.pending || q[233] !== j5 || q[234] !== s || q[235] !== B1 || q[236] !== G6 || q[237] !== X || q[238] !== M || q[239] !== l || q[240] !== Y1) lJ = $7.default.createElement(I, {
        paddingLeft: 2
    }, G.pending ? $7.default.createElement(V, {
        dimColor: !0
    }, "Press ", G.keyName, " again to exit") : Y1 === "rename" ? $7.default.createElement(V, {
        dimColor: !0
    }, $7.default.createElement(oA, null, $7.default.createElement(YA, {
        shortcut: "Enter",
        action: "save"
    }), $7.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))) : H1.status === "searching" ? $7.default.createElement(V, {
        dimColor: !0
    }, $7.default.createElement(oA, null, $7.default.createElement(V, null, "Searching with Claude…"), $7.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))) : B1 ? $7.default.createElement(V, {
        dimColor: !0
    }, $7.default.createElement(oA, null, $7.default.createElement(YA, {
        shortcut: "Enter",
        action: "search"
    }), $7.default.createElement(YA, {
        shortcut: "↓",
        action: "skip"
    }), $7.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))) : Y1 === "search" ? $7.default.createElement(V, {
        dimColor: !0
    }, $7.default.createElement(oA, null, $7.default.createElement(V, null, "Type to Search"), $7.default.createElement(YA, {
        shortcut: "Enter",
        action: "select"
    }), $7.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "clear"
    }))) : $7.default.createElement(V, {
        dimColor: !0
    }, $7.default.createElement(oA, null, X && $7.default.createElement(YA, {
        shortcut: "Ctrl+A",
        action: `show ${M?"current dir":"all projects"}`
    }), g && $7.default.createElement(YA, {
        shortcut: "Ctrl+B",
        action: "toggle branch"
    }), s && $7.default.createElement(YA, {
        shortcut: "Ctrl+W",
        action: `show ${l?"current worktree":"all worktrees"}`
    }), $7.default.createElement(YA, {
        shortcut: "Ctrl+V",
        action: "preview"
    }), $7.default.createElement(YA, {
        shortcut: "Ctrl+R",
        action: "rename"
    }), $7.default.createElement(V, null, "Type to search"), $7.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }), j5() && $7.default.createElement(V, null, j5())))), q[229] = H1.status, q[230] = g, q[231] = G.keyName, q[232] = G.pending, q[233] = j5, q[234] = s, q[235] = B1, q[236] = G6, q[237] = X, q[238] = M, q[239] = l, q[240] = Y1, q[241] = lJ;
    else lJ = q[241];
    let mY;
    if (q[242] !== gj || q[243] !== eK || q[244] !== HD || q[245] !== o_ || q[246] !== dJ || q[247] !== _O || q[248] !== a_ || q[249] !== E5 || q[250] !== Pw || q[251] !== bH || q[252] !== cJ || q[253] !== lJ) mY = $7.default.createElement(I, {
        flexDirection: "column",
        height: gj
    }, eK, OO, HD, o_, dJ, $D, _O, a_, E5, Pw, bH, cJ, lJ), q[242] = gj, q[243] = eK, q[244] = HD, q[245] = o_, q[246] = dJ, q[247] = _O, q[248] = a_, q[249] = E5, q[250] = Pw, q[251] = bH, q[252] = cJ, q[253] = lJ, q[254] = mY;
    else mY = q[254];
    return mY
}
// @from(Ln 416349, Col 0)
function I8z(A) {
    return A.log
}
// @from(Ln 416353, Col 0)
function x8z(A) {
    return A.messages[0]?.uuid
}
// @from(Ln 416357, Col 0)
function b8z(A) {
    return {
        log: A.item.log,
        score: A.score,
        searchableText: A.item.searchableText
    }
}
// @from(Ln 416365, Col 0)
function u8z(A, q) {
    let K = new Date(A.item.log.modified).getTime(),
        z = new Date(q.item.log.modified).getTime() - K;
    if (Math.abs(z) > C8z) return z;
    return (A.score ?? 1) - (q.score ?? 1)
}
// @from(Ln 416372, Col 0)
function B8z(A) {
    let q = U6(),
        K = Xw(A);
    if (q && K === q) return !0;
    if (A.customTitle) return !0;
    if (GN6(A.messages)) return !0;
    if (A.firstPrompt || A.customTitle) return !0;
    return !1
}
// @from(Ln 416382, Col 0)
function m8z(A) {
    return [A, Q8z(A)]
}
// @from(Ln 416386, Col 0)
function F8z(A) {
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
// @from(Ln 416399, Col 0)
function Q8z(A) {
    let K = (A.messages.length <= y8z ? A.messages : [...A.messages.slice(0, XYq), ...A.messages.slice(-XYq)]).map(F8z).filter(Boolean).join(" "),
        z = `${[A.customTitle,A.summary,A.firstPrompt,A.gitBranch,A.tag,A.prNumber?`PR #${A.prNumber}`:void 0,A.prRepository].filter(Boolean).join(" ")} ${K}`.trim();
    return z.length > DYq ? z.slice(0, DYq) : z
}
// @from(Ln 416405, Col 0)
function g8z(A) {
    let q = new Map;
    for (let K of A) {
        let Y = Xw(K);
        if (Y) {
            let z = q.get(Y);
            if (z) z.push(K);
            else q.set(Y, [K])
        }
    }
    return q.forEach((K) => K.sort((Y, z) => new Date(z.modified).getTime() - new Date(Y.modified).getTime())), q
}
// @from(Ln 416418, Col 0)
function U8z(A) {
    let q = new Set;
    for (let K of A)
        if (K.tag) q.add(K.tag);
    return Array.from(q).sort((K, Y) => K.localeCompare(Y))
}
// @from(Ln 416424, Col 4)
$7
// @from(Ln 416424, Col 8)
L8z = 2
// @from(Ln 416425, Col 4)
R8z = 4
// @from(Ln 416426, Col 4)
y8z = 2000
// @from(Ln 416427, Col 4)
XYq = 1000
// @from(Ln 416428, Col 4)
DYq = 50000
// @from(Ln 416429, Col 4)
C8z = 60000
// @from(Ln 416430, Col 4)
S8z = 50
// @from(Ln 416431, Col 4)
ebA = v(() => {
    i1();
    q3();
    m1();
    K7();
    Wu();
    Tr();
    x2();
    mq();
    lq();
    vq();
    U5();
    A9q();
    R2();
    h9();
    lp1();
    B6();
    gO();
    lq();
    B6();
    u6();
    YYq();
    y6();
    HK();
    wK();
    BK();
    JYq();
    HZ1();
    $Z1();
    $7 = o(X1(), 1)
})
// @from(Ln 416463, Col 0)
function ZN6(A, q, K) {
    let Y = y8();
    if (!q || !A.projectPath || A.projectPath === Y) return {
        isCrossProject: !1
    };
    {
        let $ = Xw(A);
        return {
            isCrossProject: !0,
            isSameRepoWorktree: !1,
            command: `cd ${R7([A.projectPath])} && claude --resume ${$}`,
            projectPath: A.projectPath
        }
    }
    if (K.some(($) => A.projectPath === $ || A.projectPath.startsWith($ + "/"))) return {
        isCrossProject: !0,
        isSameRepoWorktree: !0,
        projectPath: A.projectPath
    };
    let w = Xw(A);
    return {
        isCrossProject: !0,
        isSameRepoWorktree: !1,
        command: `cd ${R7([A.projectPath])} && claude --resume ${w}`,
        projectPath: A.projectPath
    }
}
// @from(Ln 416490, Col 4)
AuA = v(() => {
    B6();
    lq();
    M_()
})
// @from(Ln 416496, Col 0)
function d8z(A) {
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
// @from(Ln 416509, Col 0)
function WYq(A) {
    if (A.length === 0) return "";
    let K = (A.length <= quA ? A : [...A.slice(0, quA / 2), ...A.slice(-quA / 2)]).map(d8z).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    return K.length > MYq ? K.slice(0, MYq) + "…" : K
}
// @from(Ln 416515, Col 0)
function PYq(A, q) {
    if (Gi(A).toLowerCase().includes(q)) return !0;
    if (A.customTitle?.toLowerCase().includes(q)) return !0;
    if (A.tag?.toLowerCase().includes(q)) return !0;
    if (A.gitBranch?.toLowerCase().includes(q)) return !0;
    if (A.summary?.toLowerCase().includes(q)) return !0;
    if (A.firstPrompt?.toLowerCase().includes(q)) return !0;
    if (A.messages && A.messages.length > 0) {
        if (WYq(A.messages).toLowerCase().includes(q)) return !0
    }
    return !1
}
// @from(Ln 416527, Col 0)
async function fN6(A, q, K) {
    if (!A.trim() || q.length === 0) return [];
    let Y = A.toLowerCase(),
        z = q.filter((J) => PYq(J, Y)),
        w;
    if (z.length >= KuA) w = z.slice(0, KuA);
    else {
        let J = q.filter((D) => !PYq(D, Y)),
            X = KuA - z.length;
        w = [...z, ...J.slice(0, X)]
    }
    h(`Agentic search: ${w.length}/${q.length} logs, query="${A}", matching: ${z.length}, with messages: ${w.filter((J)=>J.messages?.length>0).length}`);
    let H = w.map(async (J) => {
            if (sR(J)) try {
                return await TI(J)
            } catch (X) {
                return K1(X), J
            }
            return J
        }),
        $ = await Promise.all(H);
    h(`Agentic search: loaded ${$.filter((J)=>J.messages?.length>0).length}/${w.length} logs with transcripts`);
    let _ = `Sessions:
${$.map((J,X)=>{let D=[`${X}:`],j=Gi(J);if(D.push(j),J.customTitle&&J.customTitle!==j)D.push(`[custom title: ${J.customTitle}]`);if(J.tag)D.push(`[tag: ${J.tag}]`);if(J.gitBranch)D.push(`[branch: ${J.gitBranch}]`);if(J.summary)D.push(`- Summary: ${J.summary}`);if(J.firstPrompt&&J.firstPrompt!=="No prompt")D.push(`- First message: ${J.firstPrompt.slice(0,300)}`);if(J.messages&&J.messages.length>0){let M=WYq(J.messages);if(M)D.push(`- Transcript: ${M}`)}return D.join(" ")}).join(`
    `)}

Search query: "${A}"

Find the sessions that are most relevant to this query.`;
    h(`Agentic search prompt (first 500 chars): ${_.slice(0,500)}...`);
    try {
        let J = _J();
        h(`Agentic search using model: ${J}`);
        let D = (await h51({
            model: J,
            system: p8z,
            messages: [{
                role: "user",
                content: _
            }],
            signal: K
        })).content.find((G) => G.type === "text");
        if (!D || D.type !== "text") return h("No text content in agentic search response"), [];
        h(`Agentic search response: ${D.text}`);
        let j = D.text.match(/\{[\s\S]*\}/);
        if (!j) return h("Could not find JSON in agentic search response"), [];
        let W = (_A(j[0]).relevant_indices || []).filter((G) => G >= 0 && G < $.length).map((G) => $[G]);
        return h(`Agentic search found ${W.length} relevant sessions`), W
    } catch (J) {
        return K1(J), h(`Agentic search error: ${J}`), []
    }
}
// @from(Ln 416579, Col 4)
MYq = 2000
// @from(Ln 416580, Col 4)
quA = 100
// @from(Ln 416581, Col 4)
KuA = 100
// @from(Ln 416582, Col 4)
p8z = `Your goal is to find relevant sessions based on a user's search query.

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
// @from(Ln 416616, Col 4)
YuA = v(() => {
    y6();
    e7();
    Z6();
    Rg1();
    lq();
    m6()
})
// @from(Ln 416624, Col 4)
ZYq = {}
// @from(Ln 416629, Col 0)
function GYq(A) {
    switch (A.resultType) {
        case "sessionNotFound":
            return `Session ${H6.bold(A.arg)} was not found.`;
        case "multipleMatches":
            return `Found ${A.count} sessions matching ${H6.bold(A.arg)}. Please use /resume to pick a specific session.`
    }
}
// @from(Ln 416638, Col 0)
function zuA(A) {
    let q = e(10),
        {
            message: K,
            args: Y,
            onDone: z
        } = A,
        w, H;
    if (q[0] !== z) w = () => {
        let J = setTimeout(z, 0);
        return () => clearTimeout(J)
    }, H = [z], q[0] = z, q[1] = w, q[2] = H;
    else w = q[1], H = q[2];
    $5.useEffect(w, H);
    let $;
    if (q[3] !== Y) $ = $5.createElement(V, {
        dimColor: !0
    }, l1.pointer, " /resume ", Y), q[3] = Y, q[4] = $;
    else $ = q[4];
    let O;
    if (q[5] !== K) O = $5.createElement(HA, null, $5.createElement(V, null, K)), q[5] = K, q[6] = O;
    else O = q[6];
    let _;
    if (q[7] !== $ || q[8] !== O) _ = $5.createElement(I, {
        flexDirection: "column"
    }, $, O), q[7] = $, q[8] = O, q[9] = _;
    else _ = q[9];
    return _
}
// @from(Ln 416668, Col 0)
function c8z({
    onDone: A,
    onResume: q
}) {
    let [K, Y] = $5.useState([]), [z, w] = $5.useState([]), [H, $] = $5.useState(!0), [O, _] = $5.useState(!1), [J, X] = $5.useState(!1), {
        rows: D
    } = Z8(), j = $5.useCallback(async (f, Z) => {
        $(!0);
        try {
            let N = f ? await wuA() : await VN6(Z);
            if (N.length === 0) {
                A("No conversations found to resume");
                return
            }
            Y(N)
        } catch (N) {
            A("Failed to load conversations")
        } finally {
            $(!1)
        }
    }, [A]);
    $5.useEffect(() => {
        async function f() {
            let Z = await jc(y8());
            w(Z), j(!1, Z)
        }
        f()
    }, [j]);
    let M = $5.useCallback(() => {
        let f = !J;
        X(f), j(f, z)
    }, [J, j, z]);
    async function P(f) {
        let Z = xv(Xw(f));
        if (!Z) {
            A("Failed to resume conversation");
            return
        }
        let N = sR(f) ? await TI(f) : f,
            T = ZN6(N, J, z);
        if (T.isCrossProject) {
            if (T.isSameRepoWorktree) {
                _(!0), q(Z, N, "slash_command_picker");
                return
            }
            await l0(T.command);
            let k = ["", "This conversation is from a different directory.", "", "To resume, run:", `  ${T.command}`, "", "(Command copied to clipboard)", ""].join(`
`);
            A(k, {
                display: "user"
            });
            return
        }
        _(!0), q(Z, N, "slash_command_picker")
    }

    function W() {
        A("Resume cancelled", {
            display: "system"
        })
    }
    let G = K.filter((f) => !f.isSidechain);
    if (H) return $5.createElement(I, null, $5.createElement(c4, null), $5.createElement(V, null, " Loading conversations…"));
    if (O) return $5.createElement(I, null, $5.createElement(c4, null), $5.createElement(V, null, " Resuming conversation…"));
    return $5.createElement(WN6, {
        logs: G,
        maxHeight: D - 2,
        onCancel: W,
        onSelect: P,
        onLogsChanged: () => j(J, z),
        showAllProjects: J,
        onToggleAllProjects: M,
        onAgenticSearch: fN6
    })
}
// @from(Ln 416743, Col 4)
$5
// @from(Ln 416743, Col 8)
l8z = async (A, q, K) => {
    u8("resume");
    let Y = async (_, J, X) => {
        try {
            await q.resume?.(_, J, X), A(void 0, {
                display: "skip"
            })
        } catch (D) {
            K1(D), A(`Failed to resume: ${D.message}`)
        }
    }, z = K?.trim();
    if (!z) return $5.createElement(c8z, {
        key: Date.now(),
        onDone: A,
        onResume: Y
    });
    let w = await jc(y8()),
        H = await VN6(w);
    if (H.length === 0) return $5.createElement(zuA, {
        message: "No conversations found to resume.",
        args: z,
        onDone: () => A("No conversations found to resume.")
    });
    let $ = xv(z);
    if ($) {
        let _ = H.filter((J) => Xw(J) === $).sort((J, X) => X.modified.getTime() - J.modified.getTime());
        if (_.length > 0) {
            let J = _[0],
                X = sR(J) ? await TI(J) : J;
            return Y($, X, "slash_command_session_id"), null
        }
    }
    if (Gc()) {
        let _ = await $F(z, {
            exact: !0
        });
        if (_.length === 1) {
            let J = _[0],
                X = Xw(J);
            if (X) {
                let D = sR(J) ? await TI(J) : J;
                return Y(X, D, "slash_command_title"), null
            }
        }
        if (_.length > 1) {
            let J = GYq({
                resultType: "multipleMatches",
                arg: z,
                count: _.length
            });
            return $5.createElement(zuA, {
                message: J,
                args: z,
                onDone: () => A(J)
            })
        }
    }
    let O = GYq({
        resultType: "sessionNotFound",
        arg: z
    });
    return $5.createElement(zuA, {
        message: O,
        args: z,
        onDone: () => A(O)
    })
}
// @from(Ln 416810, Col 4)
fYq = v(() => {
    i1();
    b7();
    q3();
    m1();
    x2();
    ebA();
    eq();
    lq();
    Sh();
    mq();
    OB();
    AuA();
    v3();
    lp1();
    B6();
    YuA();
    y6();
    $5 = o(X1(), 1)
})
// @from(Ln 416830, Col 4)
i8z
// @from(Ln 416830, Col 9)
VYq
// @from(Ln 416831, Col 4)
NYq = v(() => {
    i8z = {
        type: "local-jsx",
        name: "resume",
        description: "Resume a previous conversation",
        aliases: ["continue"],
        isEnabled: () => !0,
        isHidden: !1,
        argumentHint: "[conversation id or search term]",
        load: () => Promise.resolve().then(() => (fYq(), ZYq)),
        userFacingName() {
            return "resume"
        }
    }, VYq = i8z
})
// @from(Ln 416846, Col 4)
NN6
// @from(Ln 416847, Col 4)
HuA = v(() => {
    i0();
    v3();
    NN6 = bZ1({
        name: "review",
        description: "Review a pull request",
        progressMessage: "reviewing pull request",
        pluginName: "code-review",
        pluginCommand: "code-review",
        async getPromptWhileMarketplaceIsPrivate(A) {
            return u8("review"), [{
                type: "text",
                text: `
      You are an expert code reviewer. Follow these steps:

      1. If no PR number is provided in the args, use ${qq.name}("gh pr list") to show open PRs
      2. If a PR number is provided, use ${qq.name}("gh pr view <number>") to get PR details
      3. Use ${qq.name}("gh pr diff <number>") to get the diff
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
// @from(Ln 416886, Col 4)
TYq = {}
// @from(Ln 416891, Col 0)
function n8z(A) {
    let q = e(23),
        {
            onDone: K
        } = A,
        Y = v6(s8z),
        [z, w] = TN6.useState(""),
        H, $;
    if (q[0] !== Y) H = () => {
        if (!Y) return;
        let f = Y;
        (async function() {
            let T = await xZ1(f, {
                type: "utf8",
                errorCorrectionLevel: "L"
            });
            w(T)
        })().catch(a8z)
    }, $ = [Y], q[0] = Y, q[1] = H, q[2] = $;
    else H = q[1], $ = q[2];
    TN6.useEffect(H, $);
    let O;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) O = {
        context: "Confirmation"
    }, q[3] = O;
    else O = q[3];
    if (DA("confirm:no", K, O), !Y) {
        let f;
        if (q[4] === Symbol.for("react.memo_cache_sentinel")) f = B2.createElement(I, {
            flexDirection: "column",
            paddingX: 2
        }, B2.createElement(V, {
            color: "warning"
        }, "Not in remote mode. Start with `claude --remote` to use this command."), B2.createElement(V, {
            dimColor: !0
        }, "(press esc to close)")), q[4] = f;
        else f = q[4];
        return f
    }
    let _, J, X, D, j;
    if (q[5] !== z) {
        let f = z.split(`
`).filter(o8z),
            Z = f.length === 0;
        if (_ = I, J = "column", X = 2, q[11] === Symbol.for("react.memo_cache_sentinel")) D = B2.createElement(I, {
            marginBottom: 1
        }, B2.createElement(V, {
            bold: !0
        }, "Remote session")), q[11] = D;
        else D = q[11];
        j = Z ? B2.createElement(V, {
            dimColor: !0
        }, "Generating QR code…") : f.map(r8z), q[5] = z, q[6] = _, q[7] = J, q[8] = X, q[9] = D, q[10] = j
    } else _ = q[6], J = q[7], X = q[8], D = q[9], j = q[10];
    let M;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) M = B2.createElement(V, {
        dimColor: !0
    }, "Open in browser: "), q[12] = M;
    else M = q[12];
    let P;
    if (q[13] !== Y) P = B2.createElement(I, {
        marginTop: 1
    }, M, B2.createElement(V, {
        color: "ide"
    }, Y)), q[13] = Y, q[14] = P;
    else P = q[14];
    let W;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) W = B2.createElement(I, {
        marginTop: 1
    }, B2.createElement(V, {
        dimColor: !0
    }, "(press esc to close)")), q[15] = W;
    else W = q[15];
    let G;
    if (q[16] !== _ || q[17] !== J || q[18] !== X || q[19] !== D || q[20] !== j || q[21] !== P) G = B2.createElement(_, {
        flexDirection: J,
        paddingX: X
    }, D, j, P, W), q[16] = _, q[17] = J, q[18] = X, q[19] = D, q[20] = j, q[21] = P, q[22] = G;
    else G = q[22];
    return G
}
// @from(Ln 416973, Col 0)
function r8z(A, q) {
    return B2.createElement(V, {
        key: q
    }, A)
}
// @from(Ln 416979, Col 0)
function o8z(A) {
    return A.length > 0
}
// @from(Ln 416983, Col 0)
function a8z(A) {
    h("QR code generation failed", A)
}
// @from(Ln 416987, Col 0)
function s8z(A) {
    return A.remoteSessionUrl
}
// @from(Ln 416990, Col 4)
B2
// @from(Ln 416990, Col 8)
TN6
// @from(Ln 416990, Col 13)
t8z = async (A) => {
    return B2.createElement(n8z, {
        onDone: A
    })
}
// @from(Ln 416995, Col 4)
vYq = v(() => {
    i1();
    m1();
    IbA();
    d8();
    Z6();
    K7();
    B2 = o(X1(), 1), TN6 = o(X1(), 1)
})
// @from(Ln 417004, Col 4)
e8z
// @from(Ln 417004, Col 9)
$uA
// @from(Ln 417005, Col 4)
EYq = v(() => {
    B6();
    e8z = {
        type: "local-jsx",
        name: "session",
        aliases: ["remote"],
        description: "Show remote session URL and QR code",
        isEnabled: () => Nq(),
        get isHidden() {
            return !Nq()
        },
        load: () => Promise.resolve().then(() => (vYq(), TYq)),
        userFacingName() {
            return "session"
        }
    }, $uA = e8z
})
// @from(Ln 417022, Col 4)
kYq = () => {}
// @from(Ln 417024, Col 0)
function A7z(A) {
    if (A === "plugin") return "Plugin skills";
    return `${_Q(vi(A))} skills`
}
// @from(Ln 417029, Col 0)
function LYq(A) {
    let q = e(30),
        {
            onExit: K,
            commands: Y
        } = A,
        z;
    if (q[0] !== Y) z = Y.filter(z7z), q[0] = Y, q[1] = z;
    else z = q[1];
    let w = z,
        H;
    if (q[2] !== w) {
        H = {
            policySettings: [],
            userSettings: [],
            projectSettings: [],
            localSettings: [],
            flagSettings: [],
            plugin: []
        };
        for (let T of w) {
            let k = T.source;
            if (k in H) H[k].push(T)
        }
        for (let T of Object.values(H)) T.sort(Y7z);
        q[2] = w, q[3] = H
    } else H = q[3];
    let $ = H,
        O;
    if (q[4] !== K) O = () => {
        K("Skills dialog dismissed", {
            display: "system"
        })
    }, q[4] = K, q[5] = O;
    else O = q[5];
    let _ = O;
    if (w.length === 0) {
        let T;
        if (q[6] === Symbol.for("react.memo_cache_sentinel")) T = bz.createElement(V, {
            dimColor: !0
        }, "Create skills in .claude/skills/ or ~/.claude/skills/"), q[6] = T;
        else T = q[6];
        let k;
        if (q[7] === Symbol.for("react.memo_cache_sentinel")) k = bz.createElement(V, {
            dimColor: !0,
            italic: !0
        }, bz.createElement(NA, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "close"
        })), q[7] = k;
        else k = q[7];
        let y;
        if (q[8] !== _) y = bz.createElement(w8, {
            title: "Skills",
            subtitle: "No skills found",
            onCancel: _,
            hideInputGuide: !0
        }, T, k), q[8] = _, q[9] = y;
        else y = q[9];
        return y
    }
    let J = K7z,
        X;
    if (q[10] !== $) X = (T) => {
        let k = $[T];
        if (k.length === 0) return null;
        let y = A7z(T),
            B = L3(Gt(T, "skills")),
            S = L3(Gt(T, "commands")),
            m = k.some(q7z);
        return bz.createElement(I, {
            flexDirection: "column",
            key: T
        }, bz.createElement(I, null, bz.createElement(V, {
            bold: !0,
            dimColor: !0
        }, y), B && bz.createElement(V, {
            dimColor: !0
        }, " ", "(", B, m && S ? `, ${S}` : "", ")")), k.map((b) => J(b)))
    }, q[10] = $, q[11] = X;
    else X = q[11];
    let D = X,
        j = `${w.length} skill${w.length===1?"":"s"}`,
        M;
    if (q[12] !== D) M = D("projectSettings"), q[12] = D, q[13] = M;
    else M = q[13];
    let P;
    if (q[14] !== D) P = D("userSettings"), q[14] = D, q[15] = P;
    else P = q[15];
    let W;
    if (q[16] !== D) W = D("policySettings"), q[16] = D, q[17] = W;
    else W = q[17];
    let G;
    if (q[18] !== D) G = D("plugin"), q[18] = D, q[19] = G;
    else G = q[19];
    let f;
    if (q[20] !== M || q[21] !== P || q[22] !== W || q[23] !== G) f = bz.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, M, P, W, G), q[20] = M, q[21] = P, q[22] = W, q[23] = G, q[24] = f;
    else f = q[24];
    let Z;
    if (q[25] === Symbol.for("react.memo_cache_sentinel")) Z = bz.createElement(V, {
        dimColor: !0,
        italic: !0
    }, bz.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "close"
    })), q[25] = Z;
    else Z = q[25];
    let N;
    if (q[26] !== _ || q[27] !== j || q[28] !== f) N = bz.createElement(w8, {
        title: "Skills",
        subtitle: j,
        onCancel: _,
        hideInputGuide: !0
    }, f, Z), q[26] = _, q[27] = j, q[28] = f, q[29] = N;
    else N = q[29];
    return N
}
// @from(Ln 417154, Col 0)
function q7z(A) {
    return A.loadedFrom === "commands_DEPRECATED"
}
// @from(Ln 417158, Col 0)
function K7z(A) {
    let q = NW1(A),
        K = OL7(q),
        Y = A.source === "plugin" ? A.pluginInfo?.pluginManifest.name : void 0;
    return bz.createElement(I, {
        key: `${A.name}-${A.source}`
    }, bz.createElement(V, null, A.userFacingName()), bz.createElement(V, {
        dimColor: !0
    }, Y ? ` · ${Y}` : "", " · ", K, " description tokens"))
}
// @from(Ln 417169, Col 0)
function Y7z(A, q) {
    return NW1(q) - NW1(A)
}
// @from(Ln 417173, Col 0)
function z7z(A) {
    return A.type === "prompt" && (A.loadedFrom === "skills" || A.loadedFrom === "commands_DEPRECATED" || A.loadedFrom === "plugin")
}
// @from(Ln 417176, Col 4)
bz
// @from(Ln 417177, Col 4)
RYq = v(() => {
    i1();
    m1();
    TN1();
    Bq();
    BK();
    E$();
    RW();
    wq();
    Zt();
    bz = o(X1(), 1)
})
// @from(Ln 417189, Col 4)
yYq = {}
// @from(Ln 417193, Col 0)
async function w7z(A, q) {
    return OuA.createElement(LYq, {
        onExit: A,
        commands: q.options.commands
    })
}
// @from(Ln 417199, Col 4)
OuA
// @from(Ln 417200, Col 4)
CYq = v(() => {
    RYq();
    OuA = o(X1(), 1)
})
// @from(Ln 417204, Col 4)
H7z
// @from(Ln 417204, Col 9)
SYq
// @from(Ln 417205, Col 4)
hYq = v(() => {
    H7z = {
        type: "local-jsx",
        name: "skills",
        description: "List available skills",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (CYq(), yYq)),
        userFacingName() {
            return "skills"
        }
    }, SYq = H7z
})
// @from(Ln 417218, Col 4)
IYq = {}
// @from(Ln 417222, Col 0)
async function $7z(A, q) {
    return _uA.createElement(_Z1, {
        onClose: A,
        context: q,
        defaultTab: "Status"
    })
}
// @from(Ln 417229, Col 4)
_uA
// @from(Ln 417230, Col 4)
xYq = v(() => {
    DV6();
    _uA = o(X1(), 1)
})
// @from(Ln 417234, Col 4)
O7z
// @from(Ln 417234, Col 9)
bYq
// @from(Ln 417235, Col 4)
uYq = v(() => {
    O7z = {
        type: "local-jsx",
        name: "status",
        description: "Show Claude Code status including version, model, account, API connectivity, and tool statuses",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (xYq(), IYq)),
        userFacingName() {
            return "status"
        }
    }, bYq = O7z
})