
// @from(Ln 456802, Col 0)
function B0q(A) {
    let q = e(13),
        {
            onSuccess: K
        } = A,
        [Y, z] = Wf1.useState(null),
        [w, H] = Wf1.useState(!0),
        $ = b0q(1000) && w,
        O, _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = () => {
        (async function() {
            let W = await _Oz();
            z(W), H(!1)
        })()
    }, _ = [], q[0] = O, q[1] = _;
    else O = q[0], _ = q[1];
    Wf1.useEffect(O, _);
    let J, X;
    if (q[2] !== K || q[3] !== Y) J = () => {
        if (Y?.success) K();
        else if (Y && !Y.success) {
            let M = setTimeout(JOz, 100);
            return () => clearTimeout(M)
        }
    }, X = [Y, K], q[2] = K, q[3] = Y, q[4] = J, q[5] = X;
    else J = q[4], X = q[5];
    Wf1.useEffect(J, X);
    let D;
    if (q[6] !== w || q[7] !== Y?.error || q[8] !== Y?.success || q[9] !== $) D = w && $ ? Vy.default.createElement(I, {
        paddingLeft: 1
    }, Vy.default.createElement(c4, null), Vy.default.createElement(V, null, "Checking connectivity...")) : !Y?.success && !w && Vy.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, Vy.default.createElement(V, {
        color: "error"
    }, "Unable to connect to Anthropic services"), Vy.default.createElement(V, {
        color: "error"
    }, Y?.error), Vy.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, Vy.default.createElement(V, null, "Please check your internet connection and network settings."), Vy.default.createElement(V, null, "Note: Claude Code might not be available in your country. Check supported countries at", " ", Vy.default.createElement(V, {
        color: "suggestion"
    }, "https://anthropic.com/supported-countries")))), q[6] = w, q[7] = Y?.error, q[8] = Y?.success, q[9] = $, q[10] = D;
    else D = q[10];
    let j;
    if (q[11] !== D) j = Vy.default.createElement(I, {
        flexDirection: "column",
        gap: 1,
        paddingLeft: 1
    }, D), q[11] = D, q[12] = j;
    else j = q[12];
    return j
}
// @from(Ln 456856, Col 0)
function JOz() {
    return process.exit(1)
}
// @from(Ln 456859, Col 4)
Vy
// @from(Ln 456859, Col 8)
Wf1
// @from(Ln 456860, Col 4)
m0q = v(() => {
    i1();
    m1();
    B0();
    y6();
    x2();
    u0q();
    u6();
    y5();
    Vy = o(X1(), 1), Wf1 = o(X1(), 1)
})
// @from(Ln 456872, Col 0)
function Jv6() {
    let A = e(35),
        [q] = T7();
    if (xA.terminal === "Apple_Terminal") {
        let Z;
        if (A[0] !== q) Z = pA.default.createElement(XOz, {
            theme: q,
            welcomeMessage: "Welcome to Claude Code"
        }), A[0] = q, A[1] = Z;
        else Z = A[1];
        return Z
    }
    if (["light", "light-daltonized", "light-ansi"].includes(q)) {
        let Z, N, T, k, y, B, S, m, b;
        if (A[2] === Symbol.for("react.memo_cache_sentinel")) Z = pA.default.createElement(V, null, pA.default.createElement(V, {
            color: "claude"
        }, "Welcome to Claude Code", " "), pA.default.createElement(V, {
            dimColor: !0
        }, "v", {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION, " ")), N = pA.default.createElement(V, null, "…………………………………………………………………………………………………………………………………………………………"), T = pA.default.createElement(V, null, "                                                          "), k = pA.default.createElement(V, null, "                                                          "), y = pA.default.createElement(V, null, "                                                          "), B = pA.default.createElement(V, null, "            ░░░░░░                                        "), S = pA.default.createElement(V, null, "    ░░░   ░░░░░░░░░░                                      "), m = pA.default.createElement(V, null, "   ░░░░░░░░░░░░░░░░░░░                                    "), b = pA.default.createElement(V, null, "                                                          "), A[2] = Z, A[3] = N, A[4] = T, A[5] = k, A[6] = y, A[7] = B, A[8] = S, A[9] = m, A[10] = b;
        else Z = A[2], N = A[3], T = A[4], k = A[5], y = A[6], B = A[7], S = A[8], m = A[9], b = A[10];
        let g;
        if (A[11] === Symbol.for("react.memo_cache_sentinel")) g = pA.default.createElement(V, null, pA.default.createElement(V, {
            dimColor: !0
        }, "                           ░░░░"), pA.default.createElement(V, null, "                     ██    ")), A[11] = g;
        else g = A[11];
        let U, x;
        if (A[12] === Symbol.for("react.memo_cache_sentinel")) U = pA.default.createElement(V, null, pA.default.createElement(V, {
            dimColor: !0
        }, "                         ░░░░░░░░░░"), pA.default.createElement(V, null, "               ██▒▒██  ")), x = pA.default.createElement(V, null, "                                            ▒▒      ██   ▒"), A[12] = U, A[13] = x;
        else U = A[12], x = A[13];
        let p;
        if (A[14] === Symbol.for("react.memo_cache_sentinel")) p = pA.default.createElement(V, null, "      ", pA.default.createElement(V, {
            color: "clawd_body"
        }, " █████████ "), "                         ▒▒░░▒▒      ▒ ▒▒"), A[14] = p;
        else p = A[14];
        let l;
        if (A[15] === Symbol.for("react.memo_cache_sentinel")) l = pA.default.createElement(V, null, "      ", pA.default.createElement(V, {
            color: "clawd_body",
            backgroundColor: "clawd_background"
        }, "██▄█████▄██"), "                           ▒▒         ▒▒ "), A[15] = l;
        else l = A[15];
        let r;
        if (A[16] === Symbol.for("react.memo_cache_sentinel")) r = pA.default.createElement(V, null, "      ", pA.default.createElement(V, {
            color: "clawd_body"
        }, " █████████ "), "                          ░          ▒   "), A[16] = r;
        else r = A[16];
        let s;
        if (A[17] === Symbol.for("react.memo_cache_sentinel")) s = pA.default.createElement(I, {
            width: _v6
        }, pA.default.createElement(V, null, Z, N, T, k, y, B, S, m, b, g, U, x, p, l, r, pA.default.createElement(V, null, "…………………", pA.default.createElement(V, {
            color: "clawd_body"
        }, "█ █   █ █"), "……………………………………………………………………░…………………………▒…………"))), A[17] = s;
        else s = A[17];
        return s
    }
    let K, Y, z, w, H, $, O;
    if (A[18] === Symbol.for("react.memo_cache_sentinel")) K = pA.default.createElement(V, null, pA.default.createElement(V, {
        color: "claude"
    }, "Welcome to Claude Code", " "), pA.default.createElement(V, {
        dimColor: !0
    }, "v", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.38",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-02-10T00:04:56Z"
    }.VERSION, " ")), Y = pA.default.createElement(V, null, "…………………………………………………………………………………………………………………………………………………………"), z = pA.default.createElement(V, null, "                                                          "), w = pA.default.createElement(V, null, "     *                                       █████▓▓░     "), H = pA.default.createElement(V, null, "                                 *         ███▓░     ░░   "), $ = pA.default.createElement(V, null, "            ░░░░░░                        ███▓░           "), O = pA.default.createElement(V, null, "    ░░░   ░░░░░░░░░░                      ███▓░           "), A[18] = K, A[19] = Y, A[20] = z, A[21] = w, A[22] = H, A[23] = $, A[24] = O;
    else K = A[18], Y = A[19], z = A[20], w = A[21], H = A[22], $ = A[23], O = A[24];
    let _, J, X, D, j;
    if (A[25] === Symbol.for("react.memo_cache_sentinel")) X = pA.default.createElement(V, null, pA.default.createElement(V, null, "   ░░░░░░░░░░░░░░░░░░░    "), pA.default.createElement(V, {
        bold: !0
    }, "*"), pA.default.createElement(V, null, "                ██▓░░      ▓   ")), D = pA.default.createElement(V, null, "                                             ░▓▓███▓▓░    "), j = pA.default.createElement(V, {
        dimColor: !0
    }, " *                                 ░░░░                   "), _ = pA.default.createElement(V, {
        dimColor: !0
    }, "                                 ░░░░░░░░                 "), J = pA.default.createElement(V, {
        dimColor: !0
    }, "                               ░░░░░░░░░░░░░░░░           "), A[25] = _, A[26] = J, A[27] = X, A[28] = D, A[29] = j;
    else _ = A[25], J = A[26], X = A[27], D = A[28], j = A[29];
    let M;
    if (A[30] === Symbol.for("react.memo_cache_sentinel")) M = pA.default.createElement(V, {
        color: "clawd_body"
    }, " █████████ "), A[30] = M;
    else M = A[30];
    let P;
    if (A[31] === Symbol.for("react.memo_cache_sentinel")) P = pA.default.createElement(V, null, "      ", M, "                                       ", pA.default.createElement(V, {
        dimColor: !0
    }, "*"), pA.default.createElement(V, null, " ")), A[31] = P;
    else P = A[31];
    let W;
    if (A[32] === Symbol.for("react.memo_cache_sentinel")) W = pA.default.createElement(V, null, "      ", pA.default.createElement(V, {
        color: "clawd_body"
    }, "██▄█████▄██"), pA.default.createElement(V, null, "                        "), pA.default.createElement(V, {
        bold: !0
    }, "*"), pA.default.createElement(V, null, "                ")), A[32] = W;
    else W = A[32];
    let G;
    if (A[33] === Symbol.for("react.memo_cache_sentinel")) G = pA.default.createElement(V, null, "      ", pA.default.createElement(V, {
        color: "clawd_body"
    }, " █████████ "), "     *                                   "), A[33] = G;
    else G = A[33];
    let f;
    if (A[34] === Symbol.for("react.memo_cache_sentinel")) f = pA.default.createElement(I, {
        width: _v6
    }, pA.default.createElement(V, null, K, Y, z, w, H, $, O, X, D, j, _, J, P, W, G, pA.default.createElement(V, null, "…………………", pA.default.createElement(V, {
        color: "clawd_body"
    }, "█ █   █ █"), "………………………………………………………………………………………………………………"))), A[34] = f;
    else f = A[34];
    return f
}
// @from(Ln 456991, Col 0)
function XOz(A) {
    let q = e(44),
        {
            theme: K,
            welcomeMessage: Y
        } = A;
    if (["light", "light-daltonized", "light-ansi"].includes(K)) {
        let B;
        if (q[0] !== Y) B = pA.default.createElement(V, {
            color: "claude"
        }, Y, " "), q[0] = Y, q[1] = B;
        else B = q[1];
        let S;
        if (q[2] === Symbol.for("react.memo_cache_sentinel")) S = pA.default.createElement(V, {
            dimColor: !0
        }, "v", {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION, " "), q[2] = S;
        else S = q[2];
        let m;
        if (q[3] !== B) m = pA.default.createElement(V, null, B, S), q[3] = B, q[4] = m;
        else m = q[4];
        let b, g, U, x, p, l, r, s;
        if (q[5] === Symbol.for("react.memo_cache_sentinel")) U = pA.default.createElement(V, null, "…………………………………………………………………………………………………………………………………………………………"), x = pA.default.createElement(V, null, "                                                          "), p = pA.default.createElement(V, null, "                                                          "), l = pA.default.createElement(V, null, "                                                          "), r = pA.default.createElement(V, null, "            ░░░░░░                                        "), s = pA.default.createElement(V, null, "    ░░░   ░░░░░░░░░░                                      "), b = pA.default.createElement(V, null, "   ░░░░░░░░░░░░░░░░░░░                                    "), g = pA.default.createElement(V, null, "                                                          "), q[5] = b, q[6] = g, q[7] = U, q[8] = x, q[9] = p, q[10] = l, q[11] = r, q[12] = s;
        else b = q[5], g = q[6], U = q[7], x = q[8], p = q[9], l = q[10], r = q[11], s = q[12];
        let O1;
        if (q[13] === Symbol.for("react.memo_cache_sentinel")) O1 = pA.default.createElement(V, null, pA.default.createElement(V, {
            dimColor: !0
        }, "                           ░░░░"), pA.default.createElement(V, null, "                     ██    ")), q[13] = O1;
        else O1 = q[13];
        let T1, N1, j1;
        if (q[14] === Symbol.for("react.memo_cache_sentinel")) T1 = pA.default.createElement(V, null, pA.default.createElement(V, {
            dimColor: !0
        }, "                         ░░░░░░░░░░"), pA.default.createElement(V, null, "               ██▒▒██  ")), N1 = pA.default.createElement(V, null, "                                            ▒▒      ██   ▒"), j1 = pA.default.createElement(V, null, "                                          ▒▒░░▒▒      ▒ ▒▒"), q[14] = T1, q[15] = N1, q[16] = j1;
        else T1 = q[14], N1 = q[15], j1 = q[16];
        let q1;
        if (q[17] === Symbol.for("react.memo_cache_sentinel")) q1 = pA.default.createElement(V, null, "      ", pA.default.createElement(V, {
            color: "clawd_body"
        }, "▗"), pA.default.createElement(V, {
            color: "clawd_background",
            backgroundColor: "clawd_body"
        }, " ", "▗", "     ", "▖", " "), pA.default.createElement(V, {
            color: "clawd_body"
        }, "▖"), "                           ▒▒         ▒▒ "), q[17] = q1;
        else q1 = q[17];
        let t;
        if (q[18] === Symbol.for("react.memo_cache_sentinel")) t = pA.default.createElement(V, null, "       ", pA.default.createElement(V, {
            backgroundColor: "clawd_body"
        }, " ".repeat(9)), "                           ░          ▒   "), q[18] = t;
        else t = q[18];
        let J1;
        if (q[19] === Symbol.for("react.memo_cache_sentinel")) J1 = pA.default.createElement(V, null, "…………………", pA.default.createElement(V, {
            backgroundColor: "clawd_body"
        }, " "), pA.default.createElement(V, null, " "), pA.default.createElement(V, {
            backgroundColor: "clawd_body"
        }, " "), pA.default.createElement(V, null, "   "), pA.default.createElement(V, {
            backgroundColor: "clawd_body"
        }, " "), pA.default.createElement(V, null, " "), pA.default.createElement(V, {
            backgroundColor: "clawd_body"
        }, " "), "……………………………………………………………………░…………………………▒…………"), q[19] = J1;
        else J1 = q[19];
        let D1;
        if (q[20] !== m) D1 = pA.default.createElement(I, {
            width: _v6
        }, pA.default.createElement(V, null, m, U, x, p, l, r, s, b, g, O1, T1, N1, j1, q1, t, J1)), q[20] = m, q[21] = D1;
        else D1 = q[21];
        return D1
    }
    let w;
    if (q[22] !== Y) w = pA.default.createElement(V, {
        color: "claude"
    }, Y, " "), q[22] = Y, q[23] = w;
    else w = q[23];
    let H;
    if (q[24] === Symbol.for("react.memo_cache_sentinel")) H = pA.default.createElement(V, {
        dimColor: !0
    }, "v", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.38",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-02-10T00:04:56Z"
    }.VERSION, " "), q[24] = H;
    else H = q[24];
    let $;
    if (q[25] !== w) $ = pA.default.createElement(V, null, w, H), q[25] = w, q[26] = $;
    else $ = q[26];
    let O, _, J, X, D, j;
    if (q[27] === Symbol.for("react.memo_cache_sentinel")) O = pA.default.createElement(V, null, "…………………………………………………………………………………………………………………………………………………………"), _ = pA.default.createElement(V, null, "                                                          "), J = pA.default.createElement(V, null, "     *                                       █████▓▓░     "), X = pA.default.createElement(V, null, "                                 *         ███▓░     ░░   "), D = pA.default.createElement(V, null, "            ░░░░░░                        ███▓░           "), j = pA.default.createElement(V, null, "    ░░░   ░░░░░░░░░░                      ███▓░           "), q[27] = O, q[28] = _, q[29] = J, q[30] = X, q[31] = D, q[32] = j;
    else O = q[27], _ = q[28], J = q[29], X = q[30], D = q[31], j = q[32];
    let M, P, W, G, f;
    if (q[33] === Symbol.for("react.memo_cache_sentinel")) M = pA.default.createElement(V, null, pA.default.createElement(V, null, "   ░░░░░░░░░░░░░░░░░░░    "), pA.default.createElement(V, {
        bold: !0
    }, "*"), pA.default.createElement(V, null, "                ██▓░░      ▓   ")), P = pA.default.createElement(V, null, "                                             ░▓▓███▓▓░    "), W = pA.default.createElement(V, {
        dimColor: !0
    }, " *                                 ░░░░                   "), G = pA.default.createElement(V, {
        dimColor: !0
    }, "                                 ░░░░░░░░                 "), f = pA.default.createElement(V, {
        dimColor: !0
    }, "                               ░░░░░░░░░░░░░░░░           "), q[33] = M, q[34] = P, q[35] = W, q[36] = G, q[37] = f;
    else M = q[33], P = q[34], W = q[35], G = q[36], f = q[37];
    let Z;
    if (q[38] === Symbol.for("react.memo_cache_sentinel")) Z = pA.default.createElement(V, null, "                                                      ", pA.default.createElement(V, {
        dimColor: !0
    }, "*"), pA.default.createElement(V, null, " ")), q[38] = Z;
    else Z = q[38];
    let N;
    if (q[39] === Symbol.for("react.memo_cache_sentinel")) N = pA.default.createElement(V, null, "        ", pA.default.createElement(V, {
        color: "clawd_body"
    }, "▗"), pA.default.createElement(V, {
        color: "clawd_background",
        backgroundColor: "clawd_body"
    }, " ", "▗", "     ", "▖", " "), pA.default.createElement(V, {
        color: "clawd_body"
    }, "▖"), pA.default.createElement(V, null, "                       "), pA.default.createElement(V, {
        bold: !0
    }, "*"), pA.default.createElement(V, null, "                ")), q[39] = N;
    else N = q[39];
    let T;
    if (q[40] === Symbol.for("react.memo_cache_sentinel")) T = pA.default.createElement(V, null, "        ", pA.default.createElement(V, {
        backgroundColor: "clawd_body"
    }, " ".repeat(9)), "      *                                   "), q[40] = T;
    else T = q[40];
    let k;
    if (q[41] === Symbol.for("react.memo_cache_sentinel")) k = pA.default.createElement(V, null, "…………………", pA.default.createElement(V, {
        backgroundColor: "clawd_body"
    }, " "), pA.default.createElement(V, null, " "), pA.default.createElement(V, {
        backgroundColor: "clawd_body"
    }, " "), pA.default.createElement(V, null, "   "), pA.default.createElement(V, {
        backgroundColor: "clawd_body"
    }, " "), pA.default.createElement(V, null, " "), pA.default.createElement(V, {
        backgroundColor: "clawd_body"
    }, " "), "………………………………………………………………………………………………………………"), q[41] = k;
    else k = q[41];
    let y;
    if (q[42] !== $) y = pA.default.createElement(I, {
        width: _v6
    }, pA.default.createElement(V, null, $, O, _, J, X, D, j, M, P, W, G, f, Z, N, T, k)), q[42] = $, q[43] = y;
    else y = q[43];
    return y
}
// @from(Ln 457138, Col 4)
pA
// @from(Ln 457138, Col 8)
_v6 = 58
// @from(Ln 457139, Col 4)
TQA = v(() => {
    i1();
    m1();
    G5();
    pA = o(X1(), 1)
})
// @from(Ln 457145, Col 4)
F0q = {}
// @from(Ln 457150, Col 0)
function DOz({
    onDone: A
}) {
    let [q, K] = Gf1.useState(0), Y = MV(), [z, w] = T7();
    Gf1.useEffect(() => {
        c("tengu_began_setup", {
            oauthEnabled: Y
        })
    }, [Y]);

    function H() {
        if (q < j.length - 1) {
            let G = q + 1;
            K(G), c("tengu_onboarding_step", {
                oauthEnabled: Y,
                stepId: j[G]?.id
            })
        } else A()
    }

    function $(G) {
        w(G), H()
    }
    let O = uq(),
        _ = J9.default.createElement(zZ1, {
            initialTheme: z,
            onThemeSelect: $,
            showIntroText: !0,
            helpText: "To change this later, run /theme",
            hideEscToCancel: !0,
            skipExitHandling: !0
        }),
        J = J9.default.createElement(I, {
            flexDirection: "column",
            gap: 1,
            paddingLeft: 1
        }, J9.default.createElement(V, {
            bold: !0
        }, "Security notes:"), J9.default.createElement(I, {
            flexDirection: "column",
            width: 70
        }, J9.default.createElement(vx1, null, J9.default.createElement(vx1.Item, null, J9.default.createElement(V, null, "Claude can make mistakes"), J9.default.createElement(V, {
            dimColor: !0,
            wrap: "wrap"
        }, "You should always review Claude's responses, especially when", J9.default.createElement(LX, null), "running code.", J9.default.createElement(LX, null))), J9.default.createElement(vx1.Item, null, J9.default.createElement(V, null, "Due to prompt injection risks, only use it with code you trust"), J9.default.createElement(V, {
            dimColor: !0,
            wrap: "wrap"
        }, "For more details see:", J9.default.createElement(LX, null), J9.default.createElement(d7, {
            url: "https://code.claude.com/docs/en/security"
        }))))), J9.default.createElement(MV6, null)),
        X = J9.default.createElement(B0q, {
            onSuccess: H
        }),
        D = Gf1.useMemo(() => {
            if (!process.env.ANTHROPIC_API_KEY) return "";
            let G = cT(process.env.ANTHROPIC_API_KEY);
            if (bT6(G) === "new") return G
        }, []),
        j = [];
    if (Y) j.push({
        id: "preflight",
        component: X
    });
    if (j.push({
            id: "theme",
            component: _
        }), Y) j.push({
        id: "oauth",
        component: J9.default.createElement(r31, {
            onDone: H
        })
    });
    if (D) j.push({
        id: "api-key",
        component: J9.default.createElement(sT6, {
            customApiKeyTruncated: D,
            onDone: H
        })
    });
    if (j.push({
            id: "security",
            component: J
        }), SD1()) j.push({
        id: "terminal-setup",
        component: J9.default.createElement(I, {
            flexDirection: "column",
            gap: 1,
            paddingLeft: 1
        }, J9.default.createElement(V, {
            bold: !0
        }, "Use Claude Code's terminal setup?"), J9.default.createElement(I, {
            flexDirection: "column",
            width: 70,
            gap: 1
        }, J9.default.createElement(V, null, "For the optimal coding experience, enable the recommended settings", J9.default.createElement(LX, null), "for your terminal:", " ", xA.terminal === "Apple_Terminal" ? "Option+Enter for newlines and visual bell" : "Shift+Enter for newlines"), J9.default.createElement(kA, {
            options: [{
                label: "Yes, use recommended settings",
                value: "install"
            }, {
                label: "No, maybe later with /terminal-setup",
                value: "no"
            }],
            onChange: (G) => {
                if (G === "install") p26(z).catch(() => {}).finally(H);
                else H()
            },
            onCancel: () => H()
        }), J9.default.createElement(V, {
            dimColor: !0
        }, O.pending ? J9.default.createElement(J9.default.Fragment, null, "Press ", O.keyName, " again to exit") : J9.default.createElement(J9.default.Fragment, null, "Enter to confirm · Esc to skip"))))
    });
    let M = j[q],
        P = J9.useCallback(() => {
            if (q === j.length - 1) A();
            else H()
        }, [q, j.length, Y, A]),
        W = J9.useCallback(() => {
            H()
        }, [q, j.length, Y, A]);
    return c7({
        "confirm:yes": P
    }, {
        context: "Confirmation",
        isActive: M?.id === "security"
    }), c7({
        "confirm:no": W
    }, {
        context: "Confirmation",
        isActive: M?.id === "terminal-setup"
    }), J9.default.createElement(I, {
        flexDirection: "column"
    }, J9.default.createElement(Jv6, null), J9.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, M?.component, O.pending && J9.default.createElement(I, {
        padding: 1
    }, J9.default.createElement(V, {
        dimColor: !0
    }, "Press ", O.keyName, " again to exit"))))
}
// @from(Ln 457290, Col 4)
J9
// @from(Ln 457290, Col 8)
Gf1
// @from(Ln 457291, Col 4)
Q0q = v(() => {
    m1();
    K7();
    cA();
    $R1();
    v$A();
    R2();
    sF1();
    sFA();
    J7();
    m1();
    tIA();
    m0q();
    wV6();
    u6();
    G5();
    U5();
    Oq1();
    TQA();
    J9 = o(X1(), 1), Gf1 = o(X1(), 1)
})
// @from(Ln 457313, Col 0)
function g0q(A) {
    if (A === null || A.disableAllHooks) return !1;
    if (A.statusLine) return !0;
    if (A.fileSuggestion) return !0;
    if (!A.hooks) return !1;
    for (let q of Object.values(A.hooks))
        if (q.length > 0) return !0;
    return !1
}
// @from(Ln 457323, Col 0)
function i0q() {
    let A = [],
        q = y7("projectSettings");
    if (g0q(q)) A.push(".claude/settings.json");
    let K = y7("localSettings");
    if (g0q(K)) A.push(".claude/settings.local.json");
    return A
}
// @from(Ln 457332, Col 0)
function U0q(A) {
    return A.some((q) => q.ruleBehavior === "allow" && (q.ruleValue.toolName === h4 || q.ruleValue.toolName.startsWith(h4 + "(")))
}
// @from(Ln 457336, Col 0)
function n0q() {
    let A = [],
        q = UR1("projectSettings");
    if (U0q(q)) A.push(".claude/settings.json");
    let K = UR1("localSettings");
    if (U0q(K)) A.push(".claude/settings.local.json");
    return A
}
// @from(Ln 457345, Col 0)
function p0q(A) {
    return !!A?.otelHeadersHelper
}
// @from(Ln 457349, Col 0)
function r0q() {
    let A = [],
        q = y7("projectSettings");
    if (p0q(q)) A.push(".claude/settings.json");
    let K = y7("localSettings");
    if (p0q(K)) A.push(".claude/settings.local.json");
    return A
}
// @from(Ln 457358, Col 0)
function d0q(A) {
    return !!A?.apiKeyHelper
}
// @from(Ln 457362, Col 0)
function o0q() {
    let A = [],
        q = y7("projectSettings");
    if (d0q(q)) A.push(".claude/settings.json");
    let K = y7("localSettings");
    if (d0q(K)) A.push(".claude/settings.local.json");
    return A
}
// @from(Ln 457371, Col 0)
function c0q(A) {
    return !!(A?.awsAuthRefresh || A?.awsCredentialExport)
}
// @from(Ln 457375, Col 0)
function a0q() {
    let A = [],
        q = y7("projectSettings");
    if (c0q(q)) A.push(".claude/settings.json");
    let K = y7("localSettings");
    if (c0q(K)) A.push(".claude/settings.local.json");
    return A
}
// @from(Ln 457384, Col 0)
function l0q(A) {
    if (!A?.env) return !1;
    return Object.keys(A.env).some((q) => !X31.has(q.toUpperCase()))
}
// @from(Ln 457389, Col 0)
function s0q() {
    let A = [],
        q = y7("projectSettings");
    if (l0q(q)) A.push(".claude/settings.json");
    let K = y7("localSettings");
    if (l0q(K)) A.push(".claude/settings.local.json");
    return A
}
// @from(Ln 457397, Col 4)
t0q = v(() => {
    KL();
    p8();
    lX6()
})
// @from(Ln 457402, Col 4)
Ajq = {}
// @from(Ln 457410, Col 0)
function jOz(A) {
    let q = e(34),
        {
            onDone: K,
            commands: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = xJ("project"), q[0] = z;
    else z = q[0];
    let {
        servers: w
    } = z, H;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) H = Object.keys(w), q[1] = H;
    else H = q[1];
    let $ = H.length > 0,
        O;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) O = i0q(), q[2] = O;
    else O = q[2];
    let J = O.length > 0,
        X;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) X = n0q(), q[3] = X;
    else X = q[3];
    let D = X,
        j;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) j = o0q(), q[4] = j;
    else j = q[4];
    let P = j.length > 0,
        W;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) W = a0q(), q[5] = W;
    else W = q[5];
    let f = W.length > 0,
        Z;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) Z = r0q(), q[6] = Z;
    else Z = q[6];
    let T = Z.length > 0,
        k;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) k = s0q(), q[7] = k;
    else k = q[7];
    let B = k.length > 0,
        S, m, b;
    if (q[8] !== Y) {
        let Z1 = Y?.some(VOz) ?? !1,
            E1 = Y?.some(ZOz) ?? !1;
        S = D.length > 0 || Z1 || E1, m = $H(J || S || P || f || T || B), b = [{
            name: "MCP servers",
            shouldShowWarning: () => $,
            onChange: () => {
                let A1 = {
                    enabledMcpjsonServers: Object.keys(w),
                    enableAllProjectMcpServers: !0
                };
                Z7("localSettings", A1)
            }
        }, {
            name: "hooks",
            shouldShowWarning: () => J
        }, {
            name: "bash commands",
            shouldShowWarning: () => S
        }, {
            name: "OpenTelemetry headers helper commands",
            shouldShowWarning: () => T
        }, {
            name: "dangerous environment variables",
            shouldShowWarning: () => B
        }].filter(GOz), q[8] = Y, q[9] = S, q[10] = m, q[11] = b
    } else S = q[9], m = q[10], b = q[11];
    let g = b,
        U, x;
    if (q[12] !== S) U = () => {
        let Z1 = e0q() === h6();
        c("tengu_trust_dialog_shown", {
            isHomeDir: Z1,
            hasMcpServers: $,
            hasHooks: J,
            hasBashExecution: S,
            hasApiKeyHelper: P,
            hasAwsCommands: f,
            hasOtelHeadersHelper: T,
            hasDangerousEnvVars: B
        })
    }, x = [$, J, S, P, f, T, B], q[12] = S, q[13] = U, q[14] = x;
    else U = q[13], x = q[14];
    Xf.default.useEffect(U, x);
    let p;
    if (q[15] !== g || q[16] !== S || q[17] !== K) p = function(E1) {
        if (E1 === "exit") {
            w3(1);
            return
        }
        let a = e0q() === h6();
        if (c("tengu_trust_dialog_accept", {
                isHomeDir: a,
                hasMcpServers: $,
                hasHooks: J,
                hasBashExecution: S,
                hasApiKeyHelper: P,
                hasAwsCommands: f,
                hasOtelHeadersHelper: T,
                hasDangerousEnvVars: B,
                enableMcp: !0
            }), a) nL6(!0);
        else iH(WOz);
        g.forEach(POz), K()
    }, q[15] = g, q[16] = S, q[17] = K, q[18] = p;
    else p = q[18];
    let l = p,
        r = uq(),
        s;
    if (q[19] === Symbol.for("react.memo_cache_sentinel")) s = {
        context: "Confirmation"
    }, q[19] = s;
    else s = q[19];
    if (DA("confirm:no", MOz, s), m) return setTimeout(K), null;
    let O1, T1, N1;
    if (q[20] === Symbol.for("react.memo_cache_sentinel")) O1 = Xf.default.createElement(V, {
        bold: !0
    }, b1().cwd()), T1 = Xf.default.createElement(V, null, "Quick safety check: Is this a project you created or one you trust? (Like your own code, a well-known open source project, or work from your team). If not, take a moment to review what", "'", "s in this folder first."), N1 = Xf.default.createElement(V, null, "Claude Code", "'", "ll be able to read, edit, and execute files here."), q[20] = O1, q[21] = T1, q[22] = N1;
    else O1 = q[20], T1 = q[21], N1 = q[22];
    let j1;
    if (q[23] === Symbol.for("react.memo_cache_sentinel")) j1 = Xf.default.createElement(V, {
        dimColor: !0
    }, Xf.default.createElement(d7, {
        url: "https://code.claude.com/docs/en/security"
    }, "Security guide")), q[23] = j1;
    else j1 = q[23];
    let q1;
    if (q[24] === Symbol.for("react.memo_cache_sentinel")) q1 = [{
        label: "Yes, I trust this folder",
        value: "enable_all"
    }, {
        label: "No, exit",
        value: "exit"
    }], q[24] = q1;
    else q1 = q[24];
    let t;
    if (q[25] !== l) t = Xf.default.createElement(kA, {
        options: q1,
        onChange: (Z1) => l(Z1),
        onCancel: () => l("exit")
    }), q[25] = l, q[26] = t;
    else t = q[26];
    let J1;
    if (q[27] !== r.keyName || q[28] !== r.pending) J1 = Xf.default.createElement(V, {
        dimColor: !0
    }, r.pending ? Xf.default.createElement(Xf.default.Fragment, null, "Press ", r.keyName, " again to exit") : Xf.default.createElement(Xf.default.Fragment, null, "Enter to confirm · Esc to cancel")), q[27] = r.keyName, q[28] = r.pending, q[29] = J1;
    else J1 = q[29];
    let D1;
    if (q[30] !== O1 || q[31] !== t || q[32] !== J1) D1 = Xf.default.createElement(Bw, {
        color: "warning",
        titleColor: "warning",
        title: "Accessing workspace:"
    }, Xf.default.createElement(I, {
        flexDirection: "column",
        gap: 1,
        paddingTop: 1
    }, O1, T1, N1, j1, t, J1)), q[30] = O1, q[31] = t, q[32] = J1, q[33] = D1;
    else D1 = q[33];
    return D1
}
// @from(Ln 457571, Col 0)
function MOz() {
    w3(0)
}
// @from(Ln 457575, Col 0)
function POz(A) {
    if (A.onChange !== void 0) A.onChange()
}
// @from(Ln 457579, Col 0)
function WOz(A) {
    return {
        ...A,
        hasTrustDialogAccepted: !0
    }
}
// @from(Ln 457586, Col 0)
function GOz(A) {
    return A.shouldShowWarning()
}
// @from(Ln 457590, Col 0)
function ZOz(A) {
    return A.type === "prompt" && (A.loadedFrom === "skills" || A.loadedFrom === "plugin") && (A.source === "projectSettings" || A.source === "localSettings" || A.source === "plugin") && A.allowedTools?.some(fOz)
}
// @from(Ln 457594, Col 0)
function fOz(A) {
    return A === h4 || A.startsWith(h4 + "(")
}
// @from(Ln 457598, Col 0)
function VOz(A) {
    return A.type === "prompt" && A.loadedFrom === "commands_DEPRECATED" && (A.source === "projectSettings" || A.source === "localSettings") && A.allowedTools?.some(NOz)
}
// @from(Ln 457602, Col 0)
function NOz(A) {
    return A === h4 || A.startsWith(h4 + "(")
}
// @from(Ln 457605, Col 4)
Xf
// @from(Ln 457606, Col 4)
qjq = v(() => {
    i1();
    m1();
    K7();
    wY();
    cA();
    nW();
    p8();
    u6();
    R2();
    N7();
    B6();
    m1();
    _8();
    w$();
    t0q();
    Bv();
    Xf = o(X1(), 1)
})
// @from(Ln 457626, Col 0)
function TOz() {
    return x8("tengu_session_memory", !1)
}
// @from(Ln 457630, Col 0)
function vOz() {
    return ep("tengu_sm_config", {})
}
// @from(Ln 457634, Col 0)
function EOz(A, q) {
    let K = 0,
        Y = q === null || q === void 0;
    for (let z of A) {
        if (!Y) {
            if (z.uuid === q) Y = !0;
            continue
        }
        if (z.type === "assistant") {
            let H = z.message.content;
            if (Array.isArray(H)) K += H.filter(($) => $.type === "tool_use").length
        }
    }
    return K
}
// @from(Ln 457650, Col 0)
function kOz(A) {
    let q = Ev(A);
    if (!qs4()) {
        if (!Ys4(q)) return !1;
        Ks4()
    }
    let K = zs4(q),
        z = EOz(A, Kjq) >= ws4(),
        w = cd1(A);
    if (K && z || K && !w) {
        let $ = A[A.length - 1];
        if ($?.uuid) Kjq = $.uuid;
        return !0
    }
    return !1
}
// @from(Ln 457666, Col 0)
async function LOz(A) {
    let q = b1(),
        K = hT6();
    if (!q.existsSync(K)) q.mkdirSync(K, {
        mode: 448
    });
    let Y = VG1();
    if (!q.existsSync(Y)) {
        let $ = await BCA();
        c8(Y, $, {
            encoding: "utf-8",
            flush: !1,
            mode: 384
        })
    }
    let z = await i5.call({
            file_path: Y
        }, A),
        w = "",
        H = z.data;
    if (H.type === "text") w = H.file.content;
    return c("tengu_session_memory_file_read", {
        content_length: w.length
    }), {
        memoryPath: Y,
        currentMemory: w
    }
}
// @from(Ln 457695, Col 0)
function Yjq() {
    if (Nq()) return;
    if (!xm()) return;
    aZ6(yOz)
}
// @from(Ln 457701, Col 0)
function COz(A) {
    return async (q, K) => {
        if (q.name === bq && typeof K === "object" && K !== null && "file_path" in K) {
            let Y = K.file_path;
            if (typeof Y === "string" && Y === A) return {
                behavior: "allow",
                updatedInput: K
            }
        }
        return {
            behavior: "deny",
            message: `only ${bq} on ${A} is allowed`,
            decisionReason: {
                type: "other",
                reason: `only ${bq} on ${A} is allowed`
            }
        }
    }
}
// @from(Ln 457721, Col 0)
function SOz(A) {
    if (!cd1(A)) {
        let q = A[A.length - 1];
        if (q?.uuid) i51(q.uuid)
    }
}
// @from(Ln 457727, Col 4)
Kjq
// @from(Ln 457727, Col 9)
ROz
// @from(Ln 457727, Col 14)
yOz
// @from(Ln 457728, Col 4)
zjq = v(() => {
    B6();
    E2();
    zq();
    _8();
    m6();
    YE();
    mCA();
    YI();
    IU1();
    u6();
    xd();
    N8();
    fG1();
    RW();
    ov();
    TR();
    U4();
    ROz = KA(() => {
        let A = vOz(),
            q = {
                minimumMessageTokensToInit: A.minimumMessageTokensToInit && A.minimumMessageTokensToInit > 0 ? A.minimumMessageTokensToInit : DU1.minimumMessageTokensToInit,
                minimumTokensBetweenUpdate: A.minimumTokensBetweenUpdate && A.minimumTokensBetweenUpdate > 0 ? A.minimumTokensBetweenUpdate : DU1.minimumTokensBetweenUpdate,
                toolCallsBetweenUpdates: A.toolCallsBetweenUpdates && A.toolCallsBetweenUpdates > 0 ? A.toolCallsBetweenUpdates : DU1.toolCallsBetweenUpdates
            };
        ta4(q)
    }), yOz = rb(async function(A) {
        let {
            messages: q,
            toolUseContext: K,
            querySource: Y
        } = A;
        if (Y !== "repl_main_thread") return;
        if (!TOz()) return;
        if (ROz(), !kOz(q)) return;
        oa4();
        let z = vQ1(K),
            {
                memoryPath: w,
                currentMemory: H
            } = await LOz(z),
            $ = await Js4(H, w);
        await av({
            promptMessages: [c6({
                content: $
            })],
            cacheSafeParams: tt(A),
            canUseTool: COz(w),
            querySource: "session_memory",
            forkLabel: "session_memory",
            overrides: {
                readFileState: z.readFileState
            }
        });
        let O = q[q.length - 1],
            _ = O ? Yp(O) : void 0,
            J = ea4();
        c("tengu_session_memory_extraction", {
            input_tokens: _?.input_tokens,
            output_tokens: _?.output_tokens,
            cache_read_input_tokens: _?.cache_read_input_tokens ?? void 0,
            cache_creation_input_tokens: _?.cache_creation_input_tokens ?? void 0,
            config_min_message_tokens_to_init: J.minimumMessageTokensToInit,
            config_min_tokens_between_update: J.minimumTokensBetweenUpdate,
            config_tool_calls_between_updates: J.toolCallsBetweenUpdates
        }), As4(Ev(q)), SOz(q), aa4()
    })
})
// @from(Ln 457801, Col 0)
function Ojq() {
    return Hjq(Wi.errors(), $jq + ".jsonl")
}
// @from(Ln 457805, Col 0)
function vQA(A) {
    return Hjq(Wi.mcpLogs(A), $jq + ".jsonl")
}
// @from(Ln 457809, Col 0)
function IOz(A) {
    let q = Bn1(A);
    return {
        write(K) {
            q.write(Q1(K) + `
`)
        },
        flush: q.flush,
        dispose: q.dispose
    }
}
// @from(Ln 457821, Col 0)
function EQA(A) {
    let q = wjq.get(A);
    if (!q) {
        let K = hOz(A);
        q = IOz({
            writeFn: (Y) => {
                try {
                    b1().appendFileSync(A, Y)
                } catch {
                    b1().mkdirSync(K), b1().appendFileSync(A, Y)
                }
            },
            flushIntervalMs: 1000,
            maxBufferSize: 50
        }), wjq.set(A, q), Tq(async () => q?.dispose())
    }
    return q
}
// @from(Ln 457840, Col 0)
function xOz(A, q) {
    return
}
// @from(Ln 457844, Col 0)
function bOz(A) {
    let q = A.stack || A.message;
    h(`${A.name}: ${q}`, {
        level: "error"
    }), xOz(Ojq(), {
        error: q
    })
}
// @from(Ln 457853, Col 0)
function uOz(A, q) {
    h(`MCP server "${A}" ${q}`, {
        level: "error"
    });
    let K = vQA(A),
        z = {
            error: q instanceof Error ? q.stack || q.message : String(q),
            timestamp: new Date().toISOString(),
            sessionId: U6(),
            cwd: b1().cwd()
        };
    EQA(K).write(z)
}
// @from(Ln 457867, Col 0)
function BOz(A, q) {
    h(`MCP server "${A}": ${q}`);
    let K = vQA(A),
        Y = {
            debug: q,
            timestamp: new Date().toISOString(),
            sessionId: U6(),
            cwd: b1().cwd()
        };
    EQA(K).write(Y)
}
// @from(Ln 457879, Col 0)
function _jq() {
    e98({
        logError: bOz,
        logMCPError: uOz,
        logMCPDebug: BOz,
        getErrorsPath: Ojq,
        getMCPLogsPath: vQA
    }), h("Error log sink initialized")
}
// @from(Ln 457888, Col 4)
$jq
// @from(Ln 457888, Col 9)
wjq
// @from(Ln 457889, Col 4)
Jjq = v(() => {
    NT1();
    Z6();
    Tz();
    m6();
    B6();
    _8();
    y6();
    $jq = t98(new Date);
    wjq = new Map
})
// @from(Ln 457904, Col 0)
function FOz(A) {
    let q = fJ(h6()),
        K = b1(),
        Y = A ? new Date(A).getTime() : 0;
    try {
        let z = K.readdirSync(q),
            w = [];
        for (let H of z) {
            if (!H.isDirectory()) continue;
            let $ = mOz(q, H.name, "session-memory", "summary.md");
            try {
                let O = K.statSync($);
                if (O.mtimeMs > Y) w.push({
                    id: H.name,
                    mtime: O.mtimeMs,
                    path: $
                })
            } catch {}
        }
        return w.sort((H, $) => $.mtime - H.mtime), w.map((H) => H.path)
    } catch {
        return []
    }
}
// @from(Ln 457929, Col 0)
function Xjq() {
    return
}
// @from(Ln 457932, Col 4)
QOz = `# Remember Skill

Review session memories and update the local project memory file (CLAUDE.local.md) with learnings.

## CRITICAL: Use the AskUserQuestion Tool

**Never ask questions via plain text output.** Use the AskUserQuestion tool for ALL confirmations.

WRONG:
\`\`\`
Should I create CLAUDE.local.md with this entry?
- Yes, create it
- No, skip
\`\`\`

CORRECT:
\`\`\`
<use AskUserQuestion tool with questions array>
\`\`\`

Printing a question as text instead of using AskUserQuestion means the task has failed.

## CRITICAL: Evidence Threshold (2+ Sessions Required)

**Only extract themes and patterns that appear in 2 or more sessions.** Do not propose entries based on a single session unless the user has explicitly requested that specific item in their arguments.

- A pattern seen once is not yet a pattern - it could be a one-off
- Wait until consistent behavior appears across multiple sessions
- The only exception: explicit user request to remember something specific

## Task Steps

1. **Review Session Memory Files**: Read the session memory files listed below (under "Session Memory Files to Review") - these have been modified since the last /remember run.

2. **Analyze for Patterns**: Identify recurring elements (must appear in 2+ sessions):
   - Patterns and preferences
   - Project-specific conventions
   - Important decisions
   - User preferences
   - Common mistakes to avoid
   - Workflow patterns

3. **Review Existing Memory Files**: Read CLAUDE.local.md and CLAUDE.md to identify:
   - Outdated information
   - Misleading or incorrect instructions
   - Information contradicted by recent sessions
   - Redundant or duplicate entries

4. **Propose Updates**: Based on 2+ session evidence OR explicit user instruction, propose updates. Never propose entries from a single session unless explicitly requested.

5. **Propose Removals**: For outdated or misleading information in CLAUDE.local.md or CLAUDE.md, propose removal with explanation based on session evidence.

6. **Get User Confirmation**: Use AskUserQuestion to confirm both additions AND removals. Only make user-approved changes.

## File Locations

- **Session memories**: \`~/.claude/projects/{sanitized-project-path}/{session-id}/session-memory/summary.md\`
- **Local memory file**: \`CLAUDE.local.md\` in project root
- **Project config**: \`lastProjectMemoryUpdate\` field stores last run timestamp

## Guidelines

**Evidence Threshold (CRITICAL)**:
- Patterns must appear in 2+ sessions before proposing
- Only exception: explicit user instruction in arguments
- Note how many sessions contained each pattern when proposing

**User Confirmation**:
- Always use AskUserQuestion before ANY changes
- Ask about each proposed addition separately (one entry per question, not batched)
- Show exactly what will be added or removed
- Never make silent changes

**Be Conservative**:
- Prefer fewer, high-quality additions
- Avoid temporary or changeable details
- Focus on stable patterns and preferences

**Format**:
- Keep entries concise and actionable
- Group related entries under clear headings
- Use bullet points for easy scanning

## AskUserQuestion Format

Ask about each proposed entry separately (one entry per question). Do not batch multiple entries into a single question.

\`\`\`
AskUserQuestion({
  questions: [{
    question: "Add to CLAUDE.local.md: 'Prefer bun over npm for all commands'?",
    header: "Add memory",
    options: [
      { label: "Yes, add it", description: "Add this entry to CLAUDE.local.md" },
      { label: "No, skip", description: "Don't add this entry" },
      { label: "Edit first", description: "Let me modify the entry before adding" }
    ],
    multiSelect: false
  }],
  metadata: { source: "remember" }
})
\`\`\`

## Workflow

1. Read session memory files listed below
2. Analyze for recurring patterns (2+ sessions)
3. Read existing CLAUDE.local.md and CLAUDE.md
4. Identify patterns worth remembering
5. Identify outdated information to remove
6. Use AskUserQuestion to confirm each proposed change
7. Make approved changes
8. Report summary of changes made (or that none were needed)
`
// @from(Ln 458046, Col 4)
Djq = v(() => {
    nI();
    cA();
    lq();
    N7();
    _8()
})
// @from(Ln 458054, Col 0)
function jjq() {
    Sj({
        name: "claude-in-chrome",
        description: "Automates your Chrome browser to interact with web pages - clicking elements, filling forms, capturing screenshots, reading console logs, and navigating sites. Opens pages in new tabs within your existing Chrome session. Requires site-level permissions before executing (configured in the extension).",
        whenToUse: "When the user wants to interact with web pages, automate browser tasks, capture screenshots, read console logs, or perform any browser-based actions. Always invoke BEFORE attempting to use any mcp__claude-in-chrome__* tools.",
        allowedTools: gOz,
        userInvocable: !0,
        isEnabled: () => cZ1(),
        async getPromptForCommand(A) {
            let q = `${RHq}
${UOz}`;
            if (A) q += `
## Task

${A}`;
            return [{
                type: "text",
                text: q
            }]
        }
    })
}
// @from(Ln 458076, Col 4)
gOz
// @from(Ln 458076, Col 9)
UOz = `
Now that this skill is invoked, you have access to Chrome browser automation tools. You can now use the mcp__claude-in-chrome__* tools to interact with web pages.

IMPORTANT: Start by calling mcp__claude-in-chrome__tabs_context_mcp to get information about the user's current browser tabs.
`
// @from(Ln 458081, Col 4)
Mjq = v(() => {
    nI();
    QN6();
    r91();
    gOz = Qe.map((A) => `mcp__claude-in-chrome__${A.name}`)
})
// @from(Ln 458088, Col 0)
function pOz() {
    let A = RQ(Dk, {
        io: "input"
    });
    return Q1(A, null, 2)
}
// @from(Ln 458095, Col 0)
function Pjq() {
    return
}
// @from(Ln 458098, Col 4)
dOz = `## Settings File Locations

Choose the appropriate file based on scope:

| File | Scope | Git | Use For |
|------|-------|-----|---------|
| \`~/.claude/settings.json\` | Global | N/A | Personal preferences for all projects |
| \`.claude/settings.json\` | Project | Commit | Team-wide hooks, permissions, plugins |
| \`.claude/settings.local.json\` | Project | Gitignore | Personal overrides for this project |

Settings load in order: user → project → local (later overrides earlier).

## Settings Schema Reference

### Permissions
\`\`\`json
{
  "permissions": {
    "allow": ["Bash(npm:*)", "Edit(.claude)", "Read"],
    "deny": ["Bash(rm -rf:*)"],
    "ask": ["Write(/etc/*)"],
    "defaultMode": "default" | "plan" | "acceptEdits" | "dontAsk",
    "additionalDirectories": ["/extra/dir"]
  }
}
\`\`\`

**Permission Rule Syntax:**
- Exact match: \`"Bash(npm run test)"\`
- Prefix wildcard: \`"Bash(git:*)"\` - matches \`git status\`, \`git commit\`, etc.
- Tool only: \`"Read"\` - allows all Read operations

### Environment Variables
\`\`\`json
{
  "env": {
    "DEBUG": "true",
    "MY_API_KEY": "value"
  }
}
\`\`\`

### Model & Agent
\`\`\`json
{
  "model": "sonnet",  // or "opus", "haiku", full model ID
  "agent": "agent-name",
  "alwaysThinkingEnabled": true
}
\`\`\`

### Attribution (Commits & PRs)
\`\`\`json
{
  "attribution": {
    "commit": "Custom commit trailer text",
    "pr": "Custom PR description text"
  }
}
\`\`\`
Set \`commit\` or \`pr\` to empty string \`""\` to hide that attribution.

### MCP Server Management
\`\`\`json
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["server1", "server2"],
  "disabledMcpjsonServers": ["blocked-server"]
}
\`\`\`

### Plugins
\`\`\`json
{
  "enabledPlugins": {
    "formatter@anthropic-tools": true
  }
}
\`\`\`
Plugin syntax: \`plugin-name@source\` where source is \`claude-code-marketplace\`, \`claude-plugins-official\`, or \`builtin\`.

### Other Settings
- \`language\`: Preferred response language (e.g., "japanese")
- \`cleanupPeriodDays\`: Days to keep transcripts (0 = forever)
- \`respectGitignore\`: Whether to respect .gitignore (default: true)
- \`spinnerTipsEnabled\`: Show tips in spinner
- \`spinnerVerbs\`: Customize spinner verbs (\`{ "mode": "append" | "replace", "verbs": [...] }\`)
- \`syntaxHighlightingDisabled\`: Disable diff highlighting
`
// @from(Ln 458187, Col 4)
cOz = `## Hooks Configuration

Hooks run commands at specific points in Claude Code's lifecycle.

### Hook Structure
\`\`\`json
{
  "hooks": {
    "EVENT_NAME": [
      {
        "matcher": "ToolName|OtherTool",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here",
            "timeout": 60,
            "statusMessage": "Running..."
          }
        ]
      }
    ]
  }
}
\`\`\`

### Hook Events

| Event | Matcher | Purpose |
|-------|---------|---------|
| PermissionRequest | Tool name | Run before permission prompt |
| PreToolUse | Tool name | Run before tool, can block |
| PostToolUse | Tool name | Run after successful tool |
| PostToolUseFailure | Tool name | Run after tool fails |
| Notification | Notification type | Run on notifications |
| Stop | - | Run when Claude stops (including clear, resume, compact) |
| PreCompact | "manual"/"auto" | Before compaction |
| UserPromptSubmit | - | When user submits |
| SessionStart | - | When session starts |

**Common tool matchers:** \`Bash\`, \`Write\`, \`Edit\`, \`Read\`, \`Glob\`, \`Grep\`

### Hook Types

**1. Command Hook** - Runs a shell command:
\`\`\`json
{ "type": "command", "command": "prettier --write $FILE", "timeout": 30 }
\`\`\`

**2. Prompt Hook** - Evaluates a condition with LLM:
\`\`\`json
{ "type": "prompt", "prompt": "Is this safe? $ARGUMENTS" }
\`\`\`
Only available for tool events: PreToolUse, PostToolUse, PermissionRequest.

**3. Agent Hook** - Runs an agent with tools:
\`\`\`json
{ "type": "agent", "prompt": "Verify tests pass: $ARGUMENTS" }
\`\`\`
Only available for tool events: PreToolUse, PostToolUse, PermissionRequest.

### Hook Input (stdin JSON)
\`\`\`json
{
  "session_id": "abc123",
  "tool_name": "Write",
  "tool_input": { "file_path": "/path/to/file.txt", "content": "..." },
  "tool_response": { "success": true }  // PostToolUse only
}
\`\`\`

### Hook JSON Output

Hooks can return JSON to control behavior:

\`\`\`json
{
  "systemMessage": "Warning shown to user in UI",
  "continue": false,
  "stopReason": "Message shown when blocking",
  "suppressOutput": false,
  "decision": "block",
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Context injected back to model"
  }
}
\`\`\`

**Fields:**
- \`systemMessage\` - Display a message to the user (all hooks)
- \`continue\` - Set to \`false\` to block/stop (default: true)
- \`stopReason\` - Message shown when \`continue\` is false
- \`suppressOutput\` - Hide stdout from transcript (default: false)
- \`decision\` - "block" for PostToolUse/Stop/UserPromptSubmit hooks (deprecated for PreToolUse, use hookSpecificOutput.permissionDecision instead)
- \`reason\` - Explanation for decision
- \`hookSpecificOutput\` - Event-specific output (must include \`hookEventName\`):
  - \`additionalContext\` - Text injected into model context
  - \`permissionDecision\` - "allow", "deny", or "ask" (PreToolUse only)
  - \`permissionDecisionReason\` - Reason for the permission decision (PreToolUse only)
  - \`updatedInput\` - Modified tool input (PreToolUse only)

### Common Patterns

**Auto-format after writes:**
\`\`\`json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_response.filePath // .tool_input.file_path' | xargs prettier --write 2>/dev/null || true"
      }]
    }]
  }
}
\`\`\`

**Log all bash commands:**
\`\`\`json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.command' >> ~/.claude/bash-log.txt"
      }]
    }]
  }
}
\`\`\`

**Stop hook that displays message to user:**

Command must output JSON with \`systemMessage\` field:
\`\`\`bash
# Example command that outputs: {"systemMessage": "Session complete!"}
echo '{"systemMessage": "Session complete!"}'
\`\`\`

**Run tests after code changes:**
\`\`\`json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.file_path // .tool_response.filePath' | grep -E '\\\\.(ts|js)$' && npm test || true"
      }]
    }]
  }
}
\`\`\`
`
// @from(Ln 458344, Col 4)
lOz
// @from(Ln 458345, Col 4)
Wjq = v(() => {
    i7();
    nI();
    hQ();
    m6();
    lOz = `# Update Config Skill

Modify Claude Code configuration by updating settings.json files.

## When Hooks Are Required (Not Memory)

If the user wants something to happen automatically in response to an EVENT, they need a **hook** configured in settings.json. Memory/preferences cannot trigger automated actions.

**These require hooks:**
- "Before compacting, ask me what to preserve" → PreCompact hook
- "After writing files, run prettier" → PostToolUse hook with Write|Edit matcher
- "When I run bash commands, log them" → PreToolUse hook with Bash matcher
- "Always run tests after code changes" → PostToolUse hook

**Hook events:** PreToolUse, PostToolUse, PreCompact, Stop, Notification, SessionStart

## CRITICAL: Read Before Write

**Always read the existing settings file before making changes.** Merge new settings with existing ones - never replace the entire file.

## CRITICAL: Use AskUserQuestion for Ambiguity

When the user's request is ambiguous, use AskUserQuestion to clarify:
- Which settings file to modify (user/project/local)
- Whether to add to existing arrays or replace them
- Specific values when multiple options exist

## Decision: Config Tool vs Direct Edit

**Use the Config tool** for these simple settings:
- \`theme\`, \`editorMode\`, \`verbose\`, \`model\`
- \`language\`, \`alwaysThinkingEnabled\`
- \`permissions.defaultMode\`

**Edit settings.json directly** for:
- Hooks (PreToolUse, PostToolUse, etc.)
- Complex permission rules (allow/deny arrays)
- Environment variables
- MCP server configuration
- Plugin configuration

## Workflow

1. **Clarify intent** - Ask if the request is ambiguous
2. **Read existing file** - Use Read tool on the target settings file
3. **Merge carefully** - Preserve existing settings, especially arrays
4. **Edit file** - Use Edit tool (if file doesn't exist, ask user to create it first)
5. **Confirm** - Tell user what was changed

## Merging Arrays (Important!)

When adding to permission arrays or hook arrays, **merge with existing**, don't replace:

**WRONG** (replaces existing permissions):
\`\`\`json
{ "permissions": { "allow": ["Bash(npm:*)"] } }
\`\`\`

**RIGHT** (preserves existing + adds new):
\`\`\`json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",      // existing
      "Edit(.claude)",    // existing
      "Bash(npm:*)"       // new
    ]
  }
}
\`\`\`

${dOz}

${cOz}

## Example Workflows

### Adding a Hook

User: "Format my code after Claude writes it"

1. **Clarify**: Which formatter? (prettier, gofmt, etc.)
2. **Read**: \`.claude/settings.json\` (or create if missing)
3. **Merge**: Add to existing hooks, don't replace
4. **Result**:
\`\`\`json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_response.filePath // .tool_input.file_path' | xargs prettier --write 2>/dev/null || true"
      }]
    }]
  }
}
\`\`\`

### Adding Permissions

User: "Allow npm commands without prompting"

1. **Read**: Existing permissions
2. **Merge**: Add \`Bash(npm:*)\` to allow array
3. **Result**: Combined with existing allows

### Environment Variables

User: "Set DEBUG=true"

1. **Decide**: User settings (global) or project settings?
2. **Read**: Target file
3. **Merge**: Add to env object
\`\`\`json
{ "env": { "DEBUG": "true" } }
\`\`\`

## Common Mistakes to Avoid

1. **Replacing instead of merging** - Always preserve existing settings
2. **Wrong file** - Ask user if scope is unclear
3. **Invalid JSON** - Validate syntax after changes
4. **Forgetting to read first** - Always read before write

## Troubleshooting Hooks

If a hook isn't running:
1. **Check the settings file** - Read ~/.claude/settings.json or .claude/settings.json
2. **Verify JSON syntax** - Invalid JSON silently fails
3. **Check the matcher** - Does it match the tool name? (e.g., "Bash", "Write", "Edit")
4. **Check hook type** - Is it "command", "prompt", or "agent"?
5. **Test the command** - Run the hook command manually to see if it works
6. **Use --debug** - Run \`claude --debug\` to see hook execution logs
`
})
// @from(Ln 458486, Col 4)
kQA
// @from(Ln 458486, Col 9)
Gjq
// @from(Ln 458486, Col 14)
LQA
// @from(Ln 458486, Col 19)
iOz
// @from(Ln 458486, Col 24)
pg$
// @from(Ln 458487, Col 4)
Zjq = v(() => {
    i7();
    kQA = ["Global", "Chat", "Autocomplete", "Confirmation", "Help", "Transcript", "HistorySearch", "Task", "ThemePicker", "Settings", "Tabs", "Attachments", "Footer", "MessageSelector", "DiffDialog", "ModelPicker", "Select", "Plugin"], Gjq = {
        Global: "Active everywhere, regardless of focus",
        Chat: "When the chat input is focused",
        Autocomplete: "When autocomplete menu is visible",
        Confirmation: "When a confirmation/permission dialog is shown",
        Help: "When the help overlay is open",
        Transcript: "When viewing the transcript",
        HistorySearch: "When searching command history (ctrl+r)",
        Task: "When a task/agent is running in the foreground",
        ThemePicker: "When the theme picker is open",
        Settings: "When the settings menu is open",
        Tabs: "When tab navigation is active",
        Attachments: "When the attachment bar is focused",
        Footer: "When footer indicators are focused",
        MessageSelector: "When the message selector (rewind) is open",
        DiffDialog: "When the diff dialog is open",
        ModelPicker: "When the model picker is open",
        Select: "When a select/list component is focused",
        Plugin: "When the plugin dialog is open"
    }, LQA = ["app:interrupt", "app:exit", "app:toggleTodos", "app:toggleTranscript", "app:toggleTeammatePreview", "app:toggleTerminal", "history:search", "history:previous", "history:next", "chat:cancel", "chat:cycleMode", "chat:modelPicker", "chat:thinkingToggle", "chat:submit", "chat:undo", "chat:externalEditor", "chat:stash", "chat:imagePaste", "autocomplete:accept", "autocomplete:dismiss", "autocomplete:previous", "autocomplete:next", "confirm:yes", "confirm:no", "confirm:previous", "confirm:next", "confirm:nextField", "confirm:previousField", "confirm:cycleMode", "confirm:toggle", "confirm:toggleExplanation", "tabs:next", "tabs:previous", "transcript:toggleShowAll", "transcript:exit", "historySearch:next", "historySearch:accept", "historySearch:cancel", "historySearch:execute", "task:background", "theme:toggleSyntaxHighlighting", "help:dismiss", "attachments:next", "attachments:previous", "attachments:remove", "attachments:exit", "footer:next", "footer:previous", "footer:openSelected", "footer:clearSelection", "messageSelector:up", "messageSelector:down", "messageSelector:top", "messageSelector:bottom", "messageSelector:select", "diff:dismiss", "diff:previousSource", "diff:nextSource", "diff:back", "diff:viewDetails", "diff:previousFile", "diff:nextFile", "modelPicker:decreaseEffort", "modelPicker:increaseEffort", "select:next", "select:previous", "select:accept", "select:cancel", "plugin:toggle", "plugin:install", "permission:toggleDebug", "settings:search", "settings:retry"], iOz = u.object({
        context: u.enum(kQA).describe("UI context where these bindings apply. Global bindings work everywhere."),
        bindings: u.record(u.string().describe('Keystroke pattern (e.g., "ctrl+k", "shift+tab")'), u.union([u.enum(LQA), u.string().regex(/^command:[a-zA-Z0-9:\-_]+$/).describe('Command binding (e.g., "command:help", "command:compact"). Executes the slash command as if typed.'), u.null().describe("Set to null to unbind a default shortcut")]).describe("Action to trigger, command to invoke, or null to unbind")).describe("Map of keystroke patterns to actions")
    }).describe("A block of keybindings for a specific context"), pg$ = u.object({
        $schema: u.string().optional().describe("JSON Schema URL for editor validation"),
        $docs: u.string().optional().describe("Documentation URL"),
        bindings: u.array(iOz).describe("Array of keybinding blocks by context")
    }).describe("Claude Code keybindings configuration. Customize keyboard shortcuts by context.")
})
// @from(Ln 458518, Col 0)
function nOz() {
    return RQA(["Context", "Description"], kQA.map((A) => [`\`${A}\``, Gjq[A]]))
}
// @from(Ln 458522, Col 0)
function rOz() {
    let A = {};
    for (let q of kJ1)
        for (let [K, Y] of Object.entries(q.bindings))
            if (Y) {
                if (!A[Y]) A[Y] = {
                    keys: [],
                    context: q.context
                };
                A[Y].keys.push(K)
            } return RQA(["Action", "Default Key(s)", "Context"], LQA.map((q) => {
        let K = A[q],
            Y = K ? K.keys.map((w) => `\`${w}\``).join(", ") : "(none)",
            z = K ? K.context : oOz(q);
        return [`\`${q}\``, Y, z]
    }))
}
// @from(Ln 458540, Col 0)
function oOz(A) {
    let q = A.split(":")[0];
    return {
        app: "Global",
        history: "Global or Chat",
        chat: "Chat",
        autocomplete: "Autocomplete",
        confirm: "Confirmation",
        tabs: "Tabs",
        transcript: "Transcript",
        historySearch: "HistorySearch",
        task: "Task",
        theme: "ThemePicker",
        help: "Help",
        attachments: "Attachments",
        footer: "Footer",
        messageSelector: "MessageSelector",
        diff: "DiffDialog",
        modelPicker: "ModelPicker",
        select: "Select",
        permission: "Confirmation"
    } [q ?? ""] ?? "Unknown"
}
// @from(Ln 458564, Col 0)
function aOz() {
    let A = [];
    A.push("### Non-rebindable (errors)");
    for (let q of qS1) A.push(`- \`${q.key}\` — ${q.reason}`);
    A.push(""), A.push("### Terminal reserved (errors/warnings)");
    for (let q of rqA) A.push(`- \`${q.key}\` — ${q.reason} (${q.severity==="error"?"will not work":"may conflict"})`);
    A.push(""), A.push("### macOS reserved (errors)");
    for (let q of oqA) A.push(`- \`${q.key}\` — ${q.reason}`);
    return A.join(`
`)
}
// @from(Ln 458576, Col 0)
function fjq() {
    Sj({
        name: "keybindings-help",
        description: 'Use when the user wants to customize keyboard shortcuts, rebind keys, add chord bindings, or modify ~/.claude/keybindings.json. Examples: "rebind ctrl+s", "add a chord shortcut", "change the submit key", "customize keybindings".',
        allowedTools: ["Read"],
        userInvocable: !1,
        isEnabled: Hv,
        async getPromptForCommand(A) {
            let q = nOz(),
                K = rOz(),
                Y = aOz(),
                z = [q_z, K_z, Y_z, z_z, w_z, H_z, $_z, O_z, `## Reserved Shortcuts

${Y}`, `## Available Contexts

${q}`, `## Available Actions

${K}`];
            if (A) z.push(`## User Request

${A}`);
            return [{
                type: "text",
                text: z.join(`

`)
            }]
        }
    })
}
// @from(Ln 458607, Col 0)
function RQA(A, q) {
    let K = A.map(() => "---");
    return [`| ${A.join(" | ")} |`, `| ${K.join(" | ")} |`, ...q.map((Y) => `| ${Y.join(" | ")} |`)].join(`
`)
}
// @from(Ln 458612, Col 4)
sOz
// @from(Ln 458612, Col 9)
tOz
// @from(Ln 458612, Col 14)
eOz
// @from(Ln 458612, Col 19)
A_z
// @from(Ln 458612, Col 24)
q_z
// @from(Ln 458612, Col 29)
K_z
// @from(Ln 458612, Col 34)
Y_z
// @from(Ln 458612, Col 39)
z_z
// @from(Ln 458612, Col 44)
w_z
// @from(Ln 458612, Col 49)
H_z
// @from(Ln 458612, Col 54)
$_z
// @from(Ln 458612, Col 59)
O_z
// @from(Ln 458613, Col 4)
Vjq = v(() => {
    nI();
    Zjq();
    P36();
    W36();
    AU();
    m6();
    sOz = {
        $schema: "https://www.schemastore.org/claude-code-keybindings.json",
        $docs: "https://code.claude.com/docs/en/keybindings",
        bindings: [{
            context: "Chat",
            bindings: {
                "ctrl+e": "chat:externalEditor"
            }
        }]
    }, tOz = {
        context: "Chat",
        bindings: {
            "ctrl+s": null
        }
    }, eOz = {
        context: "Chat",
        bindings: {
            "ctrl+g": null,
            "ctrl+e": "chat:externalEditor"
        }
    }, A_z = {
        context: "Global",
        bindings: {
            "ctrl+k ctrl+t": "app:toggleTodos"
        }
    }, q_z = ["# Keybindings Skill", "", "Create or modify `~/.claude/keybindings.json` to customize keyboard shortcuts.", "", "## CRITICAL: Read Before Write", "", "**Always read `~/.claude/keybindings.json` first** (it may not exist yet). Merge changes with existing bindings — never replace the entire file.", "", "- Use **Edit** tool for modifications to existing files", "- Use **Write** tool only if the file does not exist yet"].join(`
`), K_z = ["## File Format", "", "```json", Q1(sOz, null, 2), "```", "", "Always include the `$schema` and `$docs` fields."].join(`
`), Y_z = ["## Keystroke Syntax", "", "**Modifiers** (combine with `+`):", "- `ctrl` (alias: `control`)", "- `alt` (aliases: `opt`, `option`) — note: `alt` and `meta` are identical in terminals", "- `shift`", "- `meta` (aliases: `cmd`, `command`)", "", "**Special keys**: `escape`/`esc`, `enter`/`return`, `tab`, `space`, `backspace`, `delete`, `up`, `down`, `left`, `right`", "", "**Chords**: Space-separated keystrokes, e.g. `ctrl+k ctrl+s` (1-second timeout between keystrokes)", "", "**Examples**: `ctrl+shift+p`, `alt+enter`, `ctrl+k ctrl+n`"].join(`
`), z_z = ["## Unbinding Default Shortcuts", "", "Set a key to `null` to remove its default binding:", "", "```json", Q1(tOz, null, 2), "```"].join(`
`), w_z = ["## How User Bindings Interact with Defaults", "", "- User bindings are **additive** — they are appended after the default bindings", "- To **move** a binding to a different key: unbind the old key (`null`) AND add the new binding", "- A context only needs to appear in the user's file if they want to change something in that context"].join(`
`), H_z = ["## Common Patterns", "", "### Rebind a key", "To change the external editor shortcut from `ctrl+g` to `ctrl+e`:", "```json", Q1(eOz, null, 2), "```", "", "### Add a chord binding", "```json", Q1(A_z, null, 2), "```"].join(`
`), $_z = ["## Behavioral Rules", "", "1. Only include contexts the user wants to change (minimal overrides)", "2. Validate that actions and contexts are from the known lists below", "3. Warn the user proactively if they choose a key that conflicts with reserved shortcuts or common tools like tmux (`ctrl+b`) and screen (`ctrl+a`)", "4. When adding a new binding for an existing action, the new binding is additive (existing default still works unless explicitly unbound)", "5. To fully replace a default binding, unbind the old key AND add the new one"].join(`
`), O_z = ["## Validation with /doctor", "", 'The `/doctor` command includes a "Keybinding Configuration Issues" section that validates `~/.claude/keybindings.json`.', "", "### Common Issues and Fixes", "", RQA(["Issue", "Cause", "Fix"], [
        ['`keybindings.json must have a "bindings" array`', "Missing wrapper object", 'Wrap bindings in `{ "bindings": [...] }`'],
        ['`"bindings" must be an array`', "`bindings` is not an array", 'Set `"bindings"` to an array: `[{ context: ..., bindings: ... }]`'],
        ['`Unknown context "X"`', "Typo or invalid context name", "Use exact context names from the Available Contexts table"],
        ['`Duplicate key "X" in Y bindings`', "Same key defined twice in one context", "Remove the duplicate; JSON uses only the last value"],
        ['`"X" may not work: ...`', "Key conflicts with terminal/OS reserved shortcut", "Choose a different key (see Reserved Shortcuts section)"],
        ['`Could not parse keystroke "X"`', "Invalid key syntax", "Check syntax: use `+` between modifiers, valid key names"],
        ['`Invalid action for "X"`', "Action value is not a string or null", 'Actions must be strings like `"app:help"` or `null` to unbind']
    ]), "", "### Example /doctor Output", "", "```", "Keybinding Configuration Issues", "Location: ~/.claude/keybindings.json", '  └ [Error] Unknown context "chat"', "    → Valid contexts: Global, Chat, Autocomplete, ...", '  └ [Warning] "ctrl+c" may not work: Terminal interrupt (SIGINT)', "```", "", "**Errors** prevent bindings from working and must be fixed. **Warnings** indicate potential conflicts but the binding may still work."].join(`
`)
})
// @from(Ln 458664, Col 0)
function Njq() {
    return
}
// @from(Ln 458667, Col 4)
Tjq = v(() => {
    nI()
})
// @from(Ln 458671, Col 0)
function vjq() {
    return
}
// @from(Ln 458674, Col 4)
__z = `The skill enables you to be a verification specialist for Claude Code. Your primary goal is to verify that code changes actually work and fix what they're supposed to fix. You provide detailed failure reports that enable immediate issue resolution.

## Your Mission

**Main Goal: Verify functionality works correctly.** You will be given information about what needs to be verified. Your job is to:
1. Understand what was changed (from the prompt or by checking git)
2. Discover available verifier skills in the project
3. Create a verification plan and write it to a plan file
4. Trigger the appropriate verifier skill(s) to execute the plan — multiple verifiers may run if changes span different areas
5. Report results

If a previous verification plan exists and the changes/objective are the same, pass the plan in your prompt to reuse it.

## Phase 1: Discover Verifier Skills

Check your available skills (listed in the Skill tool's "Available skills" section) for any with "verifier" in the name (case-insensitive). These are your verifier skills (e.g., \`verifier-playwright\`, \`my-verifier\`, \`unit-test-verifier\`). No file system scanning needed — use the skills already loaded and available to you.

### How to Choose a Verifier

1. Run \`git status\` or use provided context to identify changed files
2. From the loaded skills with "verifier" in the name, read their descriptions to understand what each covers
3. Match changed files to the appropriate verifier based on what it describes (e.g., a playwright verifier for UI files, an API verifier for backend files)

**If no verifier skills are found:**
- Suggest running \`/init-verifiers\` to create one
- Do not proceed with verification until a verifier skill is configured

## Phase 2: Analyze Changes

If no context is provided, check git:
- Run \`git status\` to see modified files
- Run \`git diff\` to see the actual changes
- Infer what functionality needs verification

## Phase 3: Choose Verifier(s)

Based on the changed files and available verifiers:
1. Match each file to the most appropriate verifier based on the verifier's description
2. If multiple verifiers could apply, choose based on change type:
   - UI changes → prefer playwright/e2e verifiers
   - API changes → prefer http/api verifiers
   - CLI changes → prefer cli/tmux verifiers
3. Group files by verifier for batch execution

## Phase 4: Generate Verification Plan

**If a plan was passed in your prompt**, compare its "Files Being Verified" and "Change Summary" against the current git diff. If they still match, reuse the plan as-is (skip to Phase 5). If the changes have diverged, create a fresh plan below.

**If no plan was provided**, create a structured, deterministic plan that can be executed exactly.

Write the plan to a plan file:
- Plans are stored in \`~/.claude/plans/<slug>.md\`
- Use the Write tool to create the plan file
- Include the verifier skill to use in the metadata

### Plan Format

\`\`\`markdown
# Verification Plan

## Metadata
- **Verifier Skills**: <list of verifier skills to use>
- **Project Type**: <e.g., React web app, Express API, CLI tool, Python library>
- **Created**: <timestamp>
- **Change Summary**: <brief description>

## Files Being Verified
<Map each changed file to the appropriate verifier. In multi-project repos, verifiers are named verifier-<project>-<type>.>

Example (single project):
- src/components/Button.tsx → verifier-playwright
- src/pages/Home.tsx → verifier-playwright

Example (multi-project):
- frontend/src/components/Button.tsx → verifier-frontend-playwright
- backend/src/routes/users.ts → verifier-backend-api

## Preconditions
- <any setup requirements>

## Setup Steps
1. **<description>**
   - Command: \`<command>\`
   - Wait for: "<text indicating ready>"
   - Timeout: <ms>

## Verification Steps

### Step 1: <description>
- **Action**: <action type>
- **Details**: <specifics>
- **Expected**: <what success looks like>
- **Success Criteria**: <how to determine pass/fail>

### Step 2: ...

## Cleanup Steps
1. <cleanup actions>

## Success Criteria
- All verification steps pass
- <additional criteria>

## Execution Rules

**CRITICAL: Execute the plan EXACTLY as written.**

You MUST:
1. Read this verification plan in full before starting
2. Execute each step in order
3. Report PASS or FAIL for each step
4. Stop immediately on first FAIL

You MUST NOT:
- Skip steps
- Modify steps
- Add steps not in the plan
- Interpret ambiguous instructions (mark as FAIL instead)
- Round up "almost working" to "working"

## Reporting Format

Report results inline in your response:

### Verification Results

#### Step 1: <description> - PASS/FAIL
Command: \`<command>\`
Expected: <what was expected>
Actual: <what happened>

#### Step 2: ...
\`\`\`

## Phase 5: Trigger Verifier Skill(s)

After writing the plan, trigger each applicable verifier. If files map to multiple verifiers, run them sequentially:

1. For each verifier group (from Phase 3):
   a. Use the Skill tool to invoke that verifier skill
   b. Pass the plan file path and the subset of files in the prompt
   c. Collect results before moving to the next verifier
2. Aggregate results across all verifiers into a single report

Example (single project, single verifier):
\`\`\`
Use the Skill tool with:
- skill: "verifier-playwright"
- args: "Execute the verification plan at ~/.claude/plans/<slug>.md"
\`\`\`

Example (single project, multiple verifiers):
\`\`\`
# First: run playwright verifier for UI changes
Use the Skill tool with:
- skill: "verifier-playwright"
- args: "Execute the verification plan at ~/.claude/plans/<slug>.md for files: src/components/Button.tsx"

# Then: run API verifier for backend changes
Use the Skill tool with:
- skill: "verifier-api"
- args: "Execute the verification plan at ~/.claude/plans/<slug>.md for files: src/routes/users.ts"
\`\`\`

Example (multi-project repo):
\`\`\`
# Run frontend playwright verifier
Use the Skill tool with:
- skill: "verifier-frontend-playwright"
- args: "Execute the verification plan at ~/.claude/plans/<slug>.md for files: frontend/src/components/Button.tsx"

# Run backend API verifier
Use the Skill tool with:
- skill: "verifier-backend-api"
- args: "Execute the verification plan at ~/.claude/plans/<slug>.md for files: backend/src/routes/users.ts"
\`\`\`

## Handling Different Scenarios

### Scenario 1: Verifier Skills Exist
1. Discover verifiers as described above
2. Create plan and write to plan file (listing all applicable verifiers)
3. Trigger each verifier skill sequentially with plan path and its file subset
4. Aggregate results and report inline

### Scenario 2: No Verifier Skills Found
1. Inform the user: "No verifier skills found. Run \`/init-verifiers\` to create one."
2. Do not proceed with verification until a verifier skill is configured.

### Scenario 3: Pre-existing Plan Provided
1. Parse the provided plan
2. Compare the plan's "Files Being Verified" and "Change Summary" against the current git diff
3. If the changes match (same files, same objective) → reuse the plan as-is
4. If the changes are different (new files, different objective, or significant code differences) → create a fresh plan
5. Write plan to plan file if not already there
6. Trigger verifier skill

## Reporting Results

Results are reported inline in the response (no separate file).

Report format:
\`\`\`
## Verification Results

**Verifiers Used**: <list of verifiers triggered>
**Plan File**: ~/.claude/plans/<slug>.md

### Summary
- Total Steps: X
- PASSED: Y
- FAILED: Z

### <verifier-name> Results
(e.g., "verifier-playwright Results" or "verifier-frontend-playwright Results")

#### Step 1: <description> - PASS
- Command: \`<command>\`
- Expected: <expected>
- Actual: <actual>

#### Step 2: <description> - FAIL
- Command: \`<command>\`
- Expected: <expected>
- Actual: <actual>
- **Error**: <error details>

### Overall: PASS/FAIL

### Recommended Fixes (if any failures)
1. <fix suggestion>
\`\`\`

## Critical Guidelines

1. **Discover verifiers first** - Always check for project-specific verifier skills
2. **Require verifier skills** - Do not proceed without a configured verifier; suggest \`/init-verifiers\` if none found
3. **Write plans to files** - Plans must be written to plan files so they can be re-executed
4. **Delegate to verifiers** - Use the Skill tool to trigger verifier skills rather than executing directly; run multiple verifiers sequentially if changes span different areas
5. **Report inline** - Results go in the response, not to a separate file
6. **Match by description** - Choose the verifier whose description best matches the changed files
7. **Focus on WHAT to verify, not HOW.** - Describe what was changed and the expected behavior.

`
// @from(Ln 458918, Col 4)
Ejq = v(() => {
    nI()
})
// @from(Ln 458925, Col 0)
function X_z(A, q) {
    return A.split(`
`).slice(-q).join(`
`)
}
// @from(Ln 458931, Col 0)
function kjq() {
    Sj({
        name: "debug",
        description: "Debug your current Claude Code session by reading the session debug log.",
        allowedTools: ["Read", "Grep", "Glob"],
        argumentHint: "[issue description]",
        disableModelInvocation: !0,
        userInvocable: !0,
        async getPromptForCommand(A) {
            let q = M61(),
                K;
            try {
                let z = await J_z(q, "utf-8"),
                    w = z.split(`
`).length,
                    H = X_z(z, Xv6);
                K = `Total lines: ${w}

### Last ${Xv6} lines

\`\`\`
${H}
\`\`\``
            } catch (z) {
                K = `Failed to read last ${Xv6} lines of debug log: ${z instanceof Error?z.message:String(z)}`
            }
            return [{
                type: "text",
                text: `# Debug Skill

Help the user debug an issue they're encountering in this current Claude Code session.

## Session Debug Log

The debug log for the current session is at: \`${q}\`

${K}

For additional context, grep for [ERROR] and [WARN] lines across the full file.

## Issue Description

${A||"The user did not describe a specific issue. Read the debug log and summarize any errors, warnings, or notable issues."}

## Settings

Remember that settings are in:
* user - ${Vw("userSettings")}
* project - ${Vw("projectSettings")}
* local - ${Vw("localSettings")}

## Instructions

1. Review the user's issue description
2. The last ${Xv6} lines show the debug file format. Look for [ERROR] and [WARN] entries, stack traces, and failure patterns across the file
3. Consider launching the ${tMA} subagent to understand the relevate Claude Code features
4. Explain what you found in plain language
5. Suggest concrete fixes or next steps
`
            }]
        }
    })
}
// @from(Ln 458994, Col 4)
Xv6 = 20
// @from(Ln 458995, Col 4)
Ljq = v(() => {
    nI();
    Z6();
    eMA();
    p8()
})
// @from(Ln 459002, Col 0)
function yjq(A) {
    let q = 0,
        K = "";
    while (q < A) {
        let Y = 10 + Math.floor(Math.random() * 11),
            z = 0;
        for (let w = 0; w < Y && q < A; w++) {
            let H = Rjq[Math.floor(Math.random() * Rjq.length)];
            if (K += H, q++, z++, w === Y - 1 || q >= A) K += ". ";
            else K += " "
        }
        if (z > 0 && Math.random() < 0.2 && q < A) K += `

`
    }
    return K.trim()
}
// @from(Ln 459020, Col 0)
function Cjq() {
    return
}
// @from(Ln 459023, Col 4)
Rjq
// @from(Ln 459024, Col 4)
Sjq = v(() => {
    nI();
    Rjq = ["the", "a", "an", "I", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "my", "your", "his", "its", "our", "this", "that", "what", "who", "is", "are", "was", "were", "be", "been", "have", "has", "had", "do", "does", "did", "will", "would", "can", "could", "may", "might", "must", "shall", "should", "make", "made", "get", "got", "go", "went", "come", "came", "see", "saw", "know", "take", "think", "look", "want", "use", "find", "give", "tell", "work", "call", "try", "ask", "need", "feel", "seem", "leave", "put", "time", "year", "day", "way", "man", "thing", "life", "hand", "part", "place", "case", "point", "fact", "good", "new", "first", "last", "long", "great", "little", "own", "other", "old", "right", "big", "high", "small", "large", "next", "early", "young", "few", "public", "bad", "same", "able", "in", "on", "at", "to", "for", "of", "with", "from", "by", "about", "like", "through", "over", "before", "between", "under", "since", "without", "and", "or", "but", "if", "than", "because", "as", "until", "while", "so", "though", "both", "each", "when", "where", "why", "how", "not", "now", "just", "more", "also", "here", "there", "then", "only", "very", "well", "back", "still", "even", "much", "too", "such", "never", "again", "most", "once", "off", "away", "down", "out", "up", "test", "code", "data", "file", "line", "text", "word", "number", "system", "program", "set", "run", "value", "name", "type", "state", "end", "start"]
})
// @from(Ln 459029, Col 0)
function D_z(A) {
    return A.filter((q) => q.type === "user").map((q) => {
        let K = q.message.content;
        if (typeof K === "string") return K;
        return K.filter((Y) => Y.type === "text").map((Y) => Y.text).join(`
`)
    }).filter((q) => q.trim().length > 0)
}
// @from(Ln 459038, Col 0)
function hjq() {
    return
}
// @from(Ln 459041, Col 4)
j_z = `# Skillify {{userDescriptionBlock}}

You are capturing this session's repeatable process as a reusable skill.

## Your Session Context

Here is the session memory summary:
<session_memory>
{{sessionMemory}}
</session_memory>

Here are the user's messages during this session. Pay attention to how they steered the process, to help capture their detailed preferences in the skill:
<user_messages>
{{userMessages}}
</user_messages>

## Your Task

### Step 1: Analyze the Session

Before asking any questions, analyze the session to identify:
- What repeatable process was performed
- What the inputs/parameters were
- The distinct steps (in order)
- The success artifacts/criteria (e.g. not just "writing code," but "an open PR with CI fully passing") for each step
- Where the user corrected or steered you
- What tools and permissions were needed
- What agents were used
- What the goals and success artifacts were

### Step 2: Interview the User

You will use the AskUserQuestion to understand what the user wants to automate. Important notes:
- Use AskUserQuestion for ALL questions! Never ask questions via plain text.
- For each round, iterate as much as needed until the user is happy.
- The user always has a freeform "Other" option to type edits or feedback -- do NOT add your own "Needs tweaking" or "I'll provide edits" option. Just offer the substantive choices.

**Round 1: High level confirmation**
- Suggest a name and description for the skill based on your analysis. Ask the user to confirm or rename.
- Suggest high-level goal(s) and specific success criteria for the skill.

**Round 2: More details**
- Present the high-level steps you identified as a numbered list. Tell the user you will dig into the detail in the next round.
- If you think the skill will require arguments, suggest arguments based on what you observed. Make sure you understand what someone would need to provide.
- If it's not clear, ask if this skill should run inline (in the current conversation) or forked (as a sub-agent with its own context). Forked is better for self-contained tasks that don't need mid-process user input; inline is better when the user wants to steer mid-process.

**Round 3: Breaking down each step**
For each major step, if it's not glaringly obvious, ask:
- What does this step produce that later steps need? (data, artifacts, IDs)
- What proves that this step succeeded, and that we can move on?
- Should the user be asked to confirm before proceeding? (especially for irreversible actions like merging, sending messages, or destructive operations)
- Are any steps independent and could run in parallel? (e.g., posting to Slack and monitoring CI at the same time)
- How should the skill be executed? (e.g. always use a Task agent to conduct code review, or invoke an agent team for a set of concurrent steps)
- What are the hard constraints or hard preferences? Things that must or must not happen?

You may do multiple rounds of AskUserQuestion here, one round per step, especially if there are more than 3 steps or many clarification questions. Iterate as much as needed.

IMPORTANT: Pay special attention to places where the user corrected you during the session, to help inform your design.

**Round 4: Final questions**
- Confirm when this skill should be invoked, and suggest/confirm trigger phrases too. (e.g. For a cherrypick workflow you could say: Use when the user wants to cherry-pick a PR to a release branch. Examples: 'cherry-pick to release', 'CP this PR', 'hotfix.')
- You can also ask for any other gotchas or things to watch out for, if it's still unclear.

Stop interviewing once you have enough information. IMPORTANT: Don't over-ask for simple processes!

### Step 3: Write the SKILL.md

Create the skill directory and file at \`.claude/skills/{{skillName}}/SKILL.md\`.

Use this format:

\`\`\`markdown
---
name: {{skill-name}}
description: {{one-line description}}
allowed-tools:
  {{list of tool permission patterns observed during session}}
when_to_use: {{detailed description of when Claude should automatically invoke this skill, including trigger phrases and example user messages}}
argument-hint: "{{hint showing argument placeholders}}"
arguments:
  {{list of argument names}}
context: {{inline or fork -- omit for inline}}
---

# {{Skill Title}}
Description of skill

## Inputs
- \`$arg_name\`: Description of this input

## Goal
Clearly stated goal for this workflow. Best if you have clearly defined artifacts or criteria for completion.

## Steps

### 1. Step Name
What to do in this step. Be specific and actionable. Include commands when appropriate.

**Success criteria**: ALWAYS include this! This shows that the step is done and we can move on. Can be a list.

IMPORTANT: see the next section below for the per-step annotations you can optionally include for each step.

...
\`\`\`

**Per-step annotations**:
- **Success criteria** is REQUIRED on every step. This helps the model understand what the user expects from their workflow, and when it should have the confidence to move on.
- **Execution**: \`Direct\` (default), \`Task agent\` (straightforward subagents), \`Teammate\` (agent with true parallelism and inter-agent communication), or \`[human]\` (user does it). Only needs specifying if not Direct.
- **Artifacts**: Data this step produces that later steps need (e.g., PR number, commit SHA). Only include if later steps depend on it.
- **Human checkpoint**: When to pause and ask the user before proceeding. Include for irreversible actions (merging, sending messages), error judgment (merge conflicts), or output review.
- **Rules**: Hard rules for the workflow. User corrections during the reference session can be especially useful here.

**Step structure tips:**
- Steps that can run concurrently use sub-numbers: 3a, 3b
- Steps requiring the user to act get \`[human]\` in the title
- Keep simple skills simple -- a 2-step skill doesn't need annotations on every step

**Frontmatter rules:**
- \`allowed-tools\`: Minimum permissions needed (use patterns like \`Bash(gh:*)\` not \`Bash\`)
- \`context\`: Only set \`context: fork\` for self-contained skills that don't need mid-process user input.
- \`when_to_use\` is CRITICAL -- tells the model when to auto-invoke. Start with "Use when..." and include trigger phrases. Example: "Use when the user wants to cherry-pick a PR to a release branch. Examples: 'cherry-pick to release', 'CP this PR', 'hotfix'."
- \`arguments\` and \`argument-hint\`: Only include if the skill takes parameters. Use \`$name\` in the body for substitution.

### Step 4: Confirm and Save

Before writing the file, show the user the complete SKILL.md content and ask for final confirmation using AskUserQuestion.

After writing, tell the user:
- Where the skill was saved
- How to invoke it: \`/{{skill-name}} [arguments]\`
- That they can edit the SKILL.md directly to refine it
`
// @from(Ln 459173, Col 4)
Ijq = v(() => {
    nI();
    fG1()
})
// @from(Ln 459178, Col 0)
function xjq() {
    if (Xjq(), Pjq(), fjq(), Njq(), vjq(), kjq(), Cjq(), hjq(), cZ1()) jjq()
}
// @from(Ln 459181, Col 4)
bjq = v(() => {
    Djq();
    Mjq();
    Wjq();
    Vjq();
    Tjq();
    Ejq();
    Ljq();
    Sjq();
    Ijq();
    r91()
})
// @from(Ln 459200, Col 0)
function yQA() {
    jA((A) => ({
        ...A,
        iterm2SetupInProgress: !1
    }))
}
// @from(Ln 459207, Col 0)
function W_z() {
    let A = f6();
    return {
        inProgress: A.iterm2SetupInProgress ?? !1,
        backupPath: A.iterm2BackupPath || null
    }
}
// @from(Ln 459215, Col 0)
function G_z() {
    return P_z(M_z(), "Library", "Preferences", "com.googlecode.iterm2.plist")
}
// @from(Ln 459219, Col 0)
function ujq() {
    let {
        inProgress: A,
        backupPath: q
    } = W_z();
    if (!A) return {
        status: "no_backup"
    };
    if (!q || !b1().existsSync(q)) return yQA(), {
        status: "no_backup"
    };
    try {
        return b1().copyFileSync(q, G_z()), yQA(), {
            status: "restored"
        }
    } catch (K) {
        return K1(Error(`Failed to restore iTerm2 settings with: ${K}`)), yQA(), {
            status: "failed",
            backupPath: q
        }
    }
}
// @from(Ln 459241, Col 4)
Bjq = v(() => {
    y6();
    cA();
    _8()
})
// @from(Ln 459246, Col 4)
Dv6 = {}
// @from(Ln 459250, Col 0)
async function Z_z(A, q, K, Y, z, w, H, $) {
    H8("info", "setup_started");
    let O = process.version.match(/^v(\d+)\./)?.[1];
    if (!O || parseInt(O) < 18) console.error(H6.bold.red("Error: Claude Code requires Node.js version 18 or higher.")), process.exit(1);
    if (H) mP(Yj(H));
    if (l8()) {
        let {
            captureTeammateModeSnapshot: D
        } = await Promise.resolve().then(() => (KW1(), jEA));
        D()
    }
    if (l8()) {
        let D = ujq();
        if (D.status === "restored") console.log(H6.yellow("Detected an interrupted iTerm2 setup. Your original settings have been restored. You may need to restart iTerm2 for the changes to take effect."));
        else if (D.status === "failed") console.error(H6.red(`Failed to restore iTerm2 settings. Please manually restore your original settings with: defaults import com.googlecode.iterm2 ${D.backupPath}.`))
    }
    try {
        let D = await U26();
        if (D.status === "restored") console.log(H6.yellow("Detected an interrupted Terminal.app setup. Your original settings have been restored. You may need to restart Terminal.app for the changes to take effect."));
        else if (D.status === "failed") console.error(H6.red(`Failed to restore Terminal.app settings. Please manually restore your original settings with: defaults import com.apple.Terminal ${D.backupPath}.`))
    } catch (D) {
        K1(D instanceof Error ? D : Error(String(D)))
    }
    lZ(A);
    let _ = Date.now();
    qOA(), H8("info", "setup_hooks_captured", {
        duration_ms: Date.now() - _
    }), H8("info", "setup_background_jobs_starting"), xjq(), Yjq(), dIA(), H8("info", "setup_background_jobs_launched"), EK("setup_before_prefetch"), H8("info", "setup_prefetch_starting"), cZ(ZO()), Promise.resolve().then(() => (pu1(), IU7)).then((D) => {
        D.loadPluginHooks(), D.setupPluginHookHotReload()
    }), Promise.resolve().then(() => (LCA(), Xa4)).then((D) => D.registerSessionFileAccessHooks()), _jq(), SDq(), el8(w4()), EK("setup_after_prefetch");
    let {
        hasReleaseNotes: J
    } = zN6(f6().lastReleaseNotesSeen);
    if (J) await W9q();
    if (q === "bypassPermissions" || K) {
        if (process.platform !== "win32" && typeof process.getuid === "function" && process.getuid() === 0 && process.env.IS_SANDBOX !== "1" && process.env.CLAUDE_CODE_BUBBLEWRAP !== "1") console.error("--dangerously-skip-permissions cannot be used with root/sudo privileges for security reasons"), process.exit(1)
    }
    let X = sz();
    if (X.lastCost !== void 0 && X.lastDuration !== void 0) c("tengu_exit", {
        last_session_cost: X.lastCost,
        last_session_api_duration: X.lastAPIDuration,
        last_session_tool_duration: X.lastToolDuration,
        last_session_duration: X.lastDuration,
        last_session_lines_added: X.lastLinesAdded,
        last_session_lines_removed: X.lastLinesRemoved,
        last_session_total_input_tokens: X.lastTotalInputTokens,
        last_session_total_output_tokens: X.lastTotalOutputTokens,
        last_session_total_cache_creation_input_tokens: X.lastTotalCacheCreationInputTokens,
        last_session_total_cache_read_input_tokens: X.lastTotalCacheReadInputTokens,
        last_session_fps_average: X.lastFpsAverage,
        last_session_fps_low_1_pct: X.lastFpsLow1Pct,
        last_session_id: X.lastSessionId
    })
}
// @from(Ln 459304, Col 4)
jv6 = v(() => {
    zjq();
    G5();
    $a();
    Fl();
    q3();
    u6();
    YQA();
    VI();
    N7();
    Jjq();
    uZ1();
    B6();
    c$();
    bjq();
    S9();
    k$A();
    J7();
    dD();
    cA();
    f0();
    tq();
    h9();
    jq1();
    Bjq();
    y6();
    JN6();
    BI();
    mX();
    Et()
})