
// @from(Ln 465109, Col 0)
function jEq(A) {
    let q = A6(12),
        {
            onSuccess: K
        } = A,
        [Y, z] = _V6.useState(null),
        [_, w] = _V6.useState(!0),
        O = $Eq(1000) && _,
        $, H;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = () => {
        (async function() {
            let W = await aHz();
            z(W), w(!1)
        })()
    }, H = [], q[0] = $, q[1] = H;
    else $ = q[0], H = q[1];
    _V6.useEffect($, H);
    let j, J;
    if (q[2] !== K || q[3] !== Y) j = () => {
        if (Y?.success) K();
        else if (Y && !Y.success) {
            let X = setTimeout(sHz, 100);
            return () => clearTimeout(X)
        }
    }, J = [Y, K], q[2] = K, q[3] = Y, q[4] = j, q[5] = J;
    else j = q[4], J = q[5];
    _V6.useEffect(j, J);
    let M;
    if (q[6] !== _ || q[7] !== Y || q[8] !== O) M = _ && O ? ef.default.createElement(m, {
        paddingLeft: 1
    }, ef.default.createElement(Wq, null), ef.default.createElement(T, null, "Checking connectivity...")) : !Y?.success && !_ && ef.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, ef.default.createElement(T, {
        color: "error"
    }, "Unable to connect to Anthropic services"), ef.default.createElement(T, {
        color: "error"
    }, Y?.error), Y?.sslHint ? ef.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, ef.default.createElement(T, null, Y.sslHint), ef.default.createElement(T, {
        color: "suggestion"
    }, "See https://code.claude.com/docs/en/network-config")) : ef.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, ef.default.createElement(T, null, "Please check your internet connection and network settings."), ef.default.createElement(T, null, "Note: Claude Code might not be available in your country. Check supported countries at", " ", ef.default.createElement(T, {
        color: "suggestion"
    }, "https://anthropic.com/supported-countries")))), q[6] = _, q[7] = Y, q[8] = O, q[9] = M;
    else M = q[9];
    let D;
    if (q[10] !== M) D = ef.default.createElement(m, {
        flexDirection: "column",
        gap: 1,
        paddingLeft: 1
    }, M), q[10] = M, q[11] = D;
    else D = q[11];
    return D
}
// @from(Ln 465168, Col 0)
function sHz() {
    return process.exit(1)
}
// @from(Ln 465171, Col 4)
ef
// @from(Ln 465171, Col 8)
_V6
// @from(Ln 465172, Col 4)
JEq = E(() => {
    e6();
    i6();
    RM();
    k1();
    LO();
    HEq();
    V1();
    F5();
    kK();
    uv();
    ef = t(P6(), 1), _V6 = t(P6(), 1)
})
// @from(Ln 465186, Col 0)
function bC1() {
    let A = A6(35),
        [q] = z7();
    if (Q8.terminal === "Apple_Terminal") {
        let f;
        if (A[0] !== q) f = g8.default.createElement(tHz, {
            theme: q,
            welcomeMessage: "Welcome to Claude Code"
        }), A[0] = q, A[1] = f;
        else f = A[1];
        return f
    }
    if (["light", "light-daltonized", "light-ansi"].includes(q)) {
        let f, v, N, V, L, h, R, u, I;
        if (A[2] === Symbol.for("react.memo_cache_sentinel")) f = g8.default.createElement(T, null, g8.default.createElement(T, {
            color: "claude"
        }, "Welcome to Claude Code", " "), g8.default.createElement(T, {
            dimColor: !0
        }, "v", {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION, " ")), v = g8.default.createElement(T, null, "…………………………………………………………………………………………………………………………………………………………"), N = g8.default.createElement(T, null, "                                                          "), V = g8.default.createElement(T, null, "                                                          "), L = g8.default.createElement(T, null, "                                                          "), h = g8.default.createElement(T, null, "            ░░░░░░                                        "), R = g8.default.createElement(T, null, "    ░░░   ░░░░░░░░░░                                      "), u = g8.default.createElement(T, null, "   ░░░░░░░░░░░░░░░░░░░                                    "), I = g8.default.createElement(T, null, "                                                          "), A[2] = f, A[3] = v, A[4] = N, A[5] = V, A[6] = L, A[7] = h, A[8] = R, A[9] = u, A[10] = I;
        else f = A[2], v = A[3], N = A[4], V = A[5], L = A[6], h = A[7], R = A[8], u = A[9], I = A[10];
        let g;
        if (A[11] === Symbol.for("react.memo_cache_sentinel")) g = g8.default.createElement(T, null, g8.default.createElement(T, {
            dimColor: !0
        }, "                           ░░░░"), g8.default.createElement(T, null, "                     ██    ")), A[11] = g;
        else g = A[11];
        let B, b;
        if (A[12] === Symbol.for("react.memo_cache_sentinel")) B = g8.default.createElement(T, null, g8.default.createElement(T, {
            dimColor: !0
        }, "                         ░░░░░░░░░░"), g8.default.createElement(T, null, "               ██▒▒██  ")), b = g8.default.createElement(T, null, "                                            ▒▒      ██   ▒"), A[12] = B, A[13] = b;
        else B = A[12], b = A[13];
        let p;
        if (A[14] === Symbol.for("react.memo_cache_sentinel")) p = g8.default.createElement(T, null, "      ", g8.default.createElement(T, {
            color: "clawd_body"
        }, " █████████ "), "                         ▒▒░░▒▒      ▒ ▒▒"), A[14] = p;
        else p = A[14];
        let Q;
        if (A[15] === Symbol.for("react.memo_cache_sentinel")) Q = g8.default.createElement(T, null, "      ", g8.default.createElement(T, {
            color: "clawd_body",
            backgroundColor: "clawd_background"
        }, "██▄█████▄██"), "                           ▒▒         ▒▒ "), A[15] = Q;
        else Q = A[15];
        let U;
        if (A[16] === Symbol.for("react.memo_cache_sentinel")) U = g8.default.createElement(T, null, "      ", g8.default.createElement(T, {
            color: "clawd_body"
        }, " █████████ "), "                          ░          ▒   "), A[16] = U;
        else U = A[16];
        let r;
        if (A[17] === Symbol.for("react.memo_cache_sentinel")) r = g8.default.createElement(m, {
            width: IC1
        }, g8.default.createElement(T, null, f, v, N, V, L, h, R, u, I, g, B, b, p, Q, U, g8.default.createElement(T, null, "…………………", g8.default.createElement(T, {
            color: "clawd_body"
        }, "█ █   █ █"), "……………………………………………………………………░…………………………▒…………"))), A[17] = r;
        else r = A[17];
        return r
    }
    let K, Y, z, _, w, O, $;
    if (A[18] === Symbol.for("react.memo_cache_sentinel")) K = g8.default.createElement(T, null, g8.default.createElement(T, {
        color: "claude"
    }, "Welcome to Claude Code", " "), g8.default.createElement(T, {
        dimColor: !0
    }, "v", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.VERSION, " ")), Y = g8.default.createElement(T, null, "…………………………………………………………………………………………………………………………………………………………"), z = g8.default.createElement(T, null, "                                                          "), _ = g8.default.createElement(T, null, "     *                                       █████▓▓░     "), w = g8.default.createElement(T, null, "                                 *         ███▓░     ░░   "), O = g8.default.createElement(T, null, "            ░░░░░░                        ███▓░           "), $ = g8.default.createElement(T, null, "    ░░░   ░░░░░░░░░░                      ███▓░           "), A[18] = K, A[19] = Y, A[20] = z, A[21] = _, A[22] = w, A[23] = O, A[24] = $;
    else K = A[18], Y = A[19], z = A[20], _ = A[21], w = A[22], O = A[23], $ = A[24];
    let H, j, J, M, D;
    if (A[25] === Symbol.for("react.memo_cache_sentinel")) J = g8.default.createElement(T, null, g8.default.createElement(T, null, "   ░░░░░░░░░░░░░░░░░░░    "), g8.default.createElement(T, {
        bold: !0
    }, "*"), g8.default.createElement(T, null, "                ██▓░░      ▓   ")), M = g8.default.createElement(T, null, "                                             ░▓▓███▓▓░    "), D = g8.default.createElement(T, {
        dimColor: !0
    }, " *                                 ░░░░                   "), H = g8.default.createElement(T, {
        dimColor: !0
    }, "                                 ░░░░░░░░                 "), j = g8.default.createElement(T, {
        dimColor: !0
    }, "                               ░░░░░░░░░░░░░░░░           "), A[25] = H, A[26] = j, A[27] = J, A[28] = M, A[29] = D;
    else H = A[25], j = A[26], J = A[27], M = A[28], D = A[29];
    let X;
    if (A[30] === Symbol.for("react.memo_cache_sentinel")) X = g8.default.createElement(T, {
        color: "clawd_body"
    }, " █████████ "), A[30] = X;
    else X = A[30];
    let P;
    if (A[31] === Symbol.for("react.memo_cache_sentinel")) P = g8.default.createElement(T, null, "      ", X, "                                       ", g8.default.createElement(T, {
        dimColor: !0
    }, "*"), g8.default.createElement(T, null, " ")), A[31] = P;
    else P = A[31];
    let W;
    if (A[32] === Symbol.for("react.memo_cache_sentinel")) W = g8.default.createElement(T, null, "      ", g8.default.createElement(T, {
        color: "clawd_body"
    }, "██▄█████▄██"), g8.default.createElement(T, null, "                        "), g8.default.createElement(T, {
        bold: !0
    }, "*"), g8.default.createElement(T, null, "                ")), A[32] = W;
    else W = A[32];
    let Z;
    if (A[33] === Symbol.for("react.memo_cache_sentinel")) Z = g8.default.createElement(T, null, "      ", g8.default.createElement(T, {
        color: "clawd_body"
    }, " █████████ "), "     *                                   "), A[33] = Z;
    else Z = A[33];
    let G;
    if (A[34] === Symbol.for("react.memo_cache_sentinel")) G = g8.default.createElement(m, {
        width: IC1
    }, g8.default.createElement(T, null, K, Y, z, _, w, O, $, J, M, D, H, j, P, W, Z, g8.default.createElement(T, null, "…………………", g8.default.createElement(T, {
        color: "clawd_body"
    }, "█ █   █ █"), "………………………………………………………………………………………………………………"))), A[34] = G;
    else G = A[34];
    return G
}
// @from(Ln 465305, Col 0)
function tHz(A) {
    let q = A6(44),
        {
            theme: K,
            welcomeMessage: Y
        } = A;
    if (["light", "light-daltonized", "light-ansi"].includes(K)) {
        let h;
        if (q[0] !== Y) h = g8.default.createElement(T, {
            color: "claude"
        }, Y, " "), q[0] = Y, q[1] = h;
        else h = q[1];
        let R;
        if (q[2] === Symbol.for("react.memo_cache_sentinel")) R = g8.default.createElement(T, {
            dimColor: !0
        }, "v", {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION, " "), q[2] = R;
        else R = q[2];
        let u;
        if (q[3] !== h) u = g8.default.createElement(T, null, h, R), q[3] = h, q[4] = u;
        else u = q[4];
        let I, g, B, b, p, Q, U, r;
        if (q[5] === Symbol.for("react.memo_cache_sentinel")) B = g8.default.createElement(T, null, "…………………………………………………………………………………………………………………………………………………………"), b = g8.default.createElement(T, null, "                                                          "), p = g8.default.createElement(T, null, "                                                          "), Q = g8.default.createElement(T, null, "                                                          "), U = g8.default.createElement(T, null, "            ░░░░░░                                        "), r = g8.default.createElement(T, null, "    ░░░   ░░░░░░░░░░                                      "), I = g8.default.createElement(T, null, "   ░░░░░░░░░░░░░░░░░░░                                    "), g = g8.default.createElement(T, null, "                                                          "), q[5] = I, q[6] = g, q[7] = B, q[8] = b, q[9] = p, q[10] = Q, q[11] = U, q[12] = r;
        else I = q[5], g = q[6], B = q[7], b = q[8], p = q[9], Q = q[10], U = q[11], r = q[12];
        let e;
        if (q[13] === Symbol.for("react.memo_cache_sentinel")) e = g8.default.createElement(T, null, g8.default.createElement(T, {
            dimColor: !0
        }, "                           ░░░░"), g8.default.createElement(T, null, "                     ██    ")), q[13] = e;
        else e = q[13];
        let Y6, H6, J6;
        if (q[14] === Symbol.for("react.memo_cache_sentinel")) Y6 = g8.default.createElement(T, null, g8.default.createElement(T, {
            dimColor: !0
        }, "                         ░░░░░░░░░░"), g8.default.createElement(T, null, "               ██▒▒██  ")), H6 = g8.default.createElement(T, null, "                                            ▒▒      ██   ▒"), J6 = g8.default.createElement(T, null, "                                          ▒▒░░▒▒      ▒ ▒▒"), q[14] = Y6, q[15] = H6, q[16] = J6;
        else Y6 = q[14], H6 = q[15], J6 = q[16];
        let K6;
        if (q[17] === Symbol.for("react.memo_cache_sentinel")) K6 = g8.default.createElement(T, null, "      ", g8.default.createElement(T, {
            color: "clawd_body"
        }, "▗"), g8.default.createElement(T, {
            color: "clawd_background",
            backgroundColor: "clawd_body"
        }, " ", "▗", "     ", "▖", " "), g8.default.createElement(T, {
            color: "clawd_body"
        }, "▖"), "                           ▒▒         ▒▒ "), q[17] = K6;
        else K6 = q[17];
        let s;
        if (q[18] === Symbol.for("react.memo_cache_sentinel")) s = g8.default.createElement(T, null, "       ", g8.default.createElement(T, {
            backgroundColor: "clawd_body"
        }, " ".repeat(9)), "                           ░          ▒   "), q[18] = s;
        else s = q[18];
        let X6;
        if (q[19] === Symbol.for("react.memo_cache_sentinel")) X6 = g8.default.createElement(T, null, "…………………", g8.default.createElement(T, {
            backgroundColor: "clawd_body"
        }, " "), g8.default.createElement(T, null, " "), g8.default.createElement(T, {
            backgroundColor: "clawd_body"
        }, " "), g8.default.createElement(T, null, "   "), g8.default.createElement(T, {
            backgroundColor: "clawd_body"
        }, " "), g8.default.createElement(T, null, " "), g8.default.createElement(T, {
            backgroundColor: "clawd_body"
        }, " "), "……………………………………………………………………░…………………………▒…………"), q[19] = X6;
        else X6 = q[19];
        let z6;
        if (q[20] !== u) z6 = g8.default.createElement(m, {
            width: IC1
        }, g8.default.createElement(T, null, u, B, b, p, Q, U, r, I, g, e, Y6, H6, J6, K6, s, X6)), q[20] = u, q[21] = z6;
        else z6 = q[21];
        return z6
    }
    let _;
    if (q[22] !== Y) _ = g8.default.createElement(T, {
        color: "claude"
    }, Y, " "), q[22] = Y, q[23] = _;
    else _ = q[23];
    let w;
    if (q[24] === Symbol.for("react.memo_cache_sentinel")) w = g8.default.createElement(T, {
        dimColor: !0
    }, "v", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.VERSION, " "), q[24] = w;
    else w = q[24];
    let O;
    if (q[25] !== _) O = g8.default.createElement(T, null, _, w), q[25] = _, q[26] = O;
    else O = q[26];
    let $, H, j, J, M, D;
    if (q[27] === Symbol.for("react.memo_cache_sentinel")) $ = g8.default.createElement(T, null, "…………………………………………………………………………………………………………………………………………………………"), H = g8.default.createElement(T, null, "                                                          "), j = g8.default.createElement(T, null, "     *                                       █████▓▓░     "), J = g8.default.createElement(T, null, "                                 *         ███▓░     ░░   "), M = g8.default.createElement(T, null, "            ░░░░░░                        ███▓░           "), D = g8.default.createElement(T, null, "    ░░░   ░░░░░░░░░░                      ███▓░           "), q[27] = $, q[28] = H, q[29] = j, q[30] = J, q[31] = M, q[32] = D;
    else $ = q[27], H = q[28], j = q[29], J = q[30], M = q[31], D = q[32];
    let X, P, W, Z, G;
    if (q[33] === Symbol.for("react.memo_cache_sentinel")) X = g8.default.createElement(T, null, g8.default.createElement(T, null, "   ░░░░░░░░░░░░░░░░░░░    "), g8.default.createElement(T, {
        bold: !0
    }, "*"), g8.default.createElement(T, null, "                ██▓░░      ▓   ")), P = g8.default.createElement(T, null, "                                             ░▓▓███▓▓░    "), W = g8.default.createElement(T, {
        dimColor: !0
    }, " *                                 ░░░░                   "), Z = g8.default.createElement(T, {
        dimColor: !0
    }, "                                 ░░░░░░░░                 "), G = g8.default.createElement(T, {
        dimColor: !0
    }, "                               ░░░░░░░░░░░░░░░░           "), q[33] = X, q[34] = P, q[35] = W, q[36] = Z, q[37] = G;
    else X = q[33], P = q[34], W = q[35], Z = q[36], G = q[37];
    let f;
    if (q[38] === Symbol.for("react.memo_cache_sentinel")) f = g8.default.createElement(T, null, "                                                      ", g8.default.createElement(T, {
        dimColor: !0
    }, "*"), g8.default.createElement(T, null, " ")), q[38] = f;
    else f = q[38];
    let v;
    if (q[39] === Symbol.for("react.memo_cache_sentinel")) v = g8.default.createElement(T, null, "        ", g8.default.createElement(T, {
        color: "clawd_body"
    }, "▗"), g8.default.createElement(T, {
        color: "clawd_background",
        backgroundColor: "clawd_body"
    }, " ", "▗", "     ", "▖", " "), g8.default.createElement(T, {
        color: "clawd_body"
    }, "▖"), g8.default.createElement(T, null, "                       "), g8.default.createElement(T, {
        bold: !0
    }, "*"), g8.default.createElement(T, null, "                ")), q[39] = v;
    else v = q[39];
    let N;
    if (q[40] === Symbol.for("react.memo_cache_sentinel")) N = g8.default.createElement(T, null, "        ", g8.default.createElement(T, {
        backgroundColor: "clawd_body"
    }, " ".repeat(9)), "      *                                   "), q[40] = N;
    else N = q[40];
    let V;
    if (q[41] === Symbol.for("react.memo_cache_sentinel")) V = g8.default.createElement(T, null, "…………………", g8.default.createElement(T, {
        backgroundColor: "clawd_body"
    }, " "), g8.default.createElement(T, null, " "), g8.default.createElement(T, {
        backgroundColor: "clawd_body"
    }, " "), g8.default.createElement(T, null, "   "), g8.default.createElement(T, {
        backgroundColor: "clawd_body"
    }, " "), g8.default.createElement(T, null, " "), g8.default.createElement(T, {
        backgroundColor: "clawd_body"
    }, " "), "………………………………………………………………………………………………………………"), q[41] = V;
    else V = q[41];
    let L;
    if (q[42] !== O) L = g8.default.createElement(m, {
        width: IC1
    }, g8.default.createElement(T, null, O, $, H, j, J, M, D, X, P, W, Z, G, f, v, N, V)), q[42] = O, q[43] = L;
    else L = q[43];
    return L
}
// @from(Ln 465452, Col 4)
g8
// @from(Ln 465452, Col 8)
IC1 = 58
// @from(Ln 465453, Col 4)
Ga8 = E(() => {
    e6();
    i6();
    d3();
    g8 = t(P6(), 1)
})
// @from(Ln 465459, Col 4)
MEq = {}
// @from(Ln 465464, Col 0)
function eHz({
    onDone: A
}) {
    let [q, K] = wV6.useState(0), Y = iH(), [z, _] = z7();
    wV6.useEffect(() => {
        d("tengu_began_setup", {
            oauthEnabled: Y
        })
    }, [Y]);

    function w() {
        if (q < D.length - 1) {
            let Z = q + 1;
            K(Z), d("tengu_onboarding_step", {
                oauthEnabled: Y,
                stepId: D[Z]?.id
            })
        } else A()
    }

    function O(Z) {
        _(Z), w()
    }
    let $ = IK(),
        H = B3.default.createElement(m, {
            marginX: 1
        }, B3.default.createElement(Gv6, {
            onThemeSelect: O,
            showIntroText: !0,
            helpText: "To change this later, run /theme",
            hideEscToCancel: !0,
            skipExitHandling: !0
        })),
        j = B3.default.createElement(m, {
            flexDirection: "column",
            gap: 1,
            paddingLeft: 1
        }, B3.default.createElement(T, {
            bold: !0
        }, "Security notes:"), B3.default.createElement(m, {
            flexDirection: "column",
            width: 70
        }, B3.default.createElement(SC1, null, B3.default.createElement(SC1.Item, null, B3.default.createElement(T, null, "Claude can make mistakes"), B3.default.createElement(T, {
            dimColor: !0,
            wrap: "wrap"
        }, "You should always review Claude's responses, especially when", B3.default.createElement(iG, null), "running code.", B3.default.createElement(iG, null))), B3.default.createElement(SC1.Item, null, B3.default.createElement(T, null, "Due to prompt injection risks, only use it with code you trust"), B3.default.createElement(T, {
            dimColor: !0,
            wrap: "wrap"
        }, "For more details see:", B3.default.createElement(iG, null), B3.default.createElement(y7, {
            url: "https://code.claude.com/docs/en/security"
        }))))), B3.default.createElement(dy1, null)),
        J = B3.default.createElement(jEq, {
            onSuccess: w
        }),
        M = wV6.useMemo(() => {
            if (!process.env.ANTHROPIC_API_KEY || zG()) return "";
            let Z = vN(process.env.ANTHROPIC_API_KEY);
            if (To6(Z) === "new") return Z
        }, []),
        D = [];
    if (Y) D.push({
        id: "preflight",
        component: J
    });
    if (D.push({
            id: "theme",
            component: H
        }), Y) D.push({
        id: "oauth",
        component: B3.default.createElement(uY6, {
            onDone: w
        })
    });
    if (M) D.push({
        id: "api-key",
        component: B3.default.createElement(Wa8, {
            customApiKeyTruncated: M,
            onDone: w
        })
    });
    if (D.push({
            id: "security",
            component: j
        }), I06()) D.push({
        id: "terminal-setup",
        component: B3.default.createElement(m, {
            flexDirection: "column",
            gap: 1,
            paddingLeft: 1
        }, B3.default.createElement(T, {
            bold: !0
        }, "Use Claude Code's terminal setup?"), B3.default.createElement(m, {
            flexDirection: "column",
            width: 70,
            gap: 1
        }, B3.default.createElement(T, null, "For the optimal coding experience, enable the recommended settings", B3.default.createElement(iG, null), "for your terminal:", " ", Q8.terminal === "Apple_Terminal" ? "Option+Enter for newlines and visual bell" : "Shift+Enter for newlines"), B3.default.createElement(T8, {
            options: [{
                label: "Yes, use recommended settings",
                value: "install"
            }, {
                label: "No, maybe later with /terminal-setup",
                value: "no"
            }],
            onChange: (Z) => {
                if (Z === "install") HX1(z).catch(() => {}).finally(w);
                else w()
            },
            onCancel: () => w()
        }), B3.default.createElement(T, {
            dimColor: !0
        }, $.pending ? B3.default.createElement(B3.default.Fragment, null, "Press ", $.keyName, " again to exit") : B3.default.createElement(B3.default.Fragment, null, "Enter to confirm · Esc to skip"))))
    });
    let X = D[q],
        P = B3.useCallback(() => {
            if (q === D.length - 1) A();
            else w()
        }, [q, D.length, Y, A]),
        W = B3.useCallback(() => {
            w()
        }, [q, D.length, Y, A]);
    return tA({
        "confirm:yes": P
    }, {
        context: "Confirmation",
        isActive: X?.id === "security"
    }), tA({
        "confirm:no": W
    }, {
        context: "Confirmation",
        isActive: X?.id === "terminal-setup"
    }), B3.default.createElement(m, {
        flexDirection: "column"
    }, B3.default.createElement(bC1, null), B3.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, X?.component, $.pending && B3.default.createElement(m, {
        padding: 1
    }, B3.default.createElement(T, {
        dimColor: !0
    }, "Press ", $.keyName, " again to exit"))))
}
// @from(Ln 465605, Col 4)
B3
// @from(Ln 465605, Col 8)
wV6
// @from(Ln 465606, Col 4)
DEq = E(() => {
    i6();
    _7();
    k8();
    qn6();
    wEq();
    PO();
    $c6();
    Za8();
    fA();
    A8();
    i6();
    JU8();
    JEq();
    Sy1();
    V1();
    d3();
    v3();
    J36();
    Ga8();
    B3 = t(P6(), 1), wV6 = t(P6(), 1)
})
// @from(Ln 465629, Col 0)
function XEq(A) {
    if (A === null || A.disableAllHooks) return !1;
    if (A.statusLine) return !0;
    if (A.fileSuggestion) return !0;
    if (!A.hooks) return !1;
    for (let q of Object.values(A.hooks))
        if (q.length > 0) return !0;
    return !1
}
// @from(Ln 465639, Col 0)
function vEq() {
    let A = [],
        q = L8("projectSettings");
    if (XEq(q)) A.push(".claude/settings.json");
    let K = L8("localSettings");
    if (XEq(K)) A.push(".claude/settings.local.json");
    return A
}
// @from(Ln 465648, Col 0)
function PEq(A) {
    return A.some((q) => q.ruleBehavior === "allow" && (q.ruleValue.toolName === Q7 || q.ruleValue.toolName.startsWith(Q7 + "(")))
}
// @from(Ln 465652, Col 0)
function NEq() {
    let A = [],
        q = kb6("projectSettings");
    if (PEq(q)) A.push(".claude/settings.json");
    let K = kb6("localSettings");
    if (PEq(K)) A.push(".claude/settings.local.json");
    return A
}
// @from(Ln 465661, Col 0)
function WEq(A) {
    return !!A?.otelHeadersHelper
}
// @from(Ln 465665, Col 0)
function VEq() {
    let A = [],
        q = L8("projectSettings");
    if (WEq(q)) A.push(".claude/settings.json");
    let K = L8("localSettings");
    if (WEq(K)) A.push(".claude/settings.local.json");
    return A
}
// @from(Ln 465674, Col 0)
function ZEq(A) {
    return !!A?.apiKeyHelper
}
// @from(Ln 465678, Col 0)
function kEq() {
    let A = [],
        q = L8("projectSettings");
    if (ZEq(q)) A.push(".claude/settings.json");
    let K = L8("localSettings");
    if (ZEq(K)) A.push(".claude/settings.local.json");
    return A
}
// @from(Ln 465687, Col 0)
function GEq(A) {
    return !!(A?.awsAuthRefresh || A?.awsCredentialExport)
}
// @from(Ln 465691, Col 0)
function EEq() {
    let A = [],
        q = L8("projectSettings");
    if (GEq(q)) A.push(".claude/settings.json");
    let K = L8("localSettings");
    if (GEq(K)) A.push(".claude/settings.local.json");
    return A
}
// @from(Ln 465700, Col 0)
function fEq(A) {
    return !!A?.gcpAuthRefresh
}
// @from(Ln 465704, Col 0)
function yEq() {
    let A = [],
        q = L8("projectSettings");
    if (fEq(q)) A.push(".claude/settings.json");
    let K = L8("localSettings");
    if (fEq(K)) A.push(".claude/settings.local.json");
    return A
}
// @from(Ln 465713, Col 0)
function TEq(A) {
    if (!A?.env) return !1;
    return Object.keys(A.env).some((q) => !YG6.has(q.toUpperCase()))
}
// @from(Ln 465718, Col 0)
function LEq() {
    let A = [],
        q = L8("projectSettings");
    if (TEq(q)) A.push(".claude/settings.json");
    let K = L8("localSettings");
    if (TEq(K)) A.push(".claude/settings.local.json");
    return A
}
// @from(Ln 465726, Col 4)
REq = E(() => {
    Km();
    i8();
    uG1()
})
// @from(Ln 465731, Col 4)
SEq = {}
// @from(Ln 465739, Col 0)
function Ajz(A) {
    let q = A6(33),
        {
            onDone: K,
            commands: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = dj("project"), q[0] = z;
    else z = q[0];
    let {
        servers: _
    } = z, w;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) w = Object.keys(_), q[1] = w;
    else w = q[1];
    let O = w.length > 0,
        $;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) $ = vEq(), q[2] = $;
    else $ = q[2];
    let j = $.length > 0,
        J;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) J = NEq(), q[3] = J;
    else J = q[3];
    let M = J,
        D;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) D = kEq(), q[4] = D;
    else D = q[4];
    let P = D.length > 0,
        W;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) W = EEq(), q[5] = W;
    else W = q[5];
    let G = W.length > 0,
        f;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) f = yEq(), q[6] = f;
    else f = q[6];
    let N = f.length > 0,
        V;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) V = VEq(), q[7] = V;
    else V = q[7];
    let h = V.length > 0,
        R;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) R = LEq(), q[8] = R;
    else R = q[8];
    let I = R.length > 0,
        g;
    if (q[9] !== Y) g = Y?.some(wjz) ?? !1, q[9] = Y, q[10] = g;
    else g = q[10];
    let B = g,
        b;
    if (q[11] !== Y) b = Y?.some(zjz) ?? !1, q[11] = Y, q[12] = b;
    else b = q[12];
    let p = b,
        Q = M.length > 0 || B || p,
        U = l_(),
        r, e;
    if (q[13] !== Q) r = () => {
        let i = hEq() === G1();
        d("tengu_trust_dialog_shown", {
            isHomeDir: i,
            hasMcpServers: O,
            hasHooks: j,
            hasBashExecution: Q,
            hasApiKeyHelper: P,
            hasAwsCommands: G,
            hasGcpCommands: N,
            hasOtelHeadersHelper: h,
            hasDangerousEnvVars: I
        })
    }, e = [O, j, Q, P, G, N, h, I], q[13] = Q, q[14] = r, q[15] = e;
    else r = q[14], e = q[15];
    AT.default.useEffect(r, e);
    let Y6;
    if (q[16] !== Q || q[17] !== K) Y6 = function(l) {
        if (l === "exit") {
            fK(1);
            return
        }
        let q6 = hEq() === G1();
        if (d("tengu_trust_dialog_accept", {
                isHomeDir: q6,
                hasMcpServers: O,
                hasHooks: j,
                hasBashExecution: Q,
                hasApiKeyHelper: P,
                hasAwsCommands: G,
                hasGcpCommands: N,
                hasOtelHeadersHelper: h,
                hasDangerousEnvVars: I
            }), q6) ik6(!0);
        else c2(Yjz);
        K()
    }, q[16] = Q, q[17] = K, q[18] = Y6;
    else Y6 = q[18];
    let H6 = Y6,
        J6 = IK(Kjz),
        K6;
    if (q[19] === Symbol.for("react.memo_cache_sentinel")) K6 = {
        context: "Confirmation"
    }, q[19] = K6;
    else K6 = q[19];
    if (D8("confirm:no", qjz, K6), U) return setTimeout(K), null;
    let s, X6, z6;
    if (q[20] === Symbol.for("react.memo_cache_sentinel")) s = AT.default.createElement(T, {
        bold: !0
    }, $1().cwd()), X6 = AT.default.createElement(T, null, "Quick safety check: Is this a project you created or one you trust? (Like your own code, a well-known open source project, or work from your team). If not, take a moment to review what", "'", "s in this folder first."), z6 = AT.default.createElement(T, null, "Claude Code", "'", "ll be able to read, edit, and execute files here."), q[20] = s, q[21] = X6, q[22] = z6;
    else s = q[20], X6 = q[21], z6 = q[22];
    let N6;
    if (q[23] === Symbol.for("react.memo_cache_sentinel")) N6 = AT.default.createElement(T, {
        dimColor: !0
    }, AT.default.createElement(y7, {
        url: "https://code.claude.com/docs/en/security"
    }, "Security guide")), q[23] = N6;
    else N6 = q[23];
    let $6;
    if (q[24] === Symbol.for("react.memo_cache_sentinel")) $6 = [{
        label: "Yes, I trust this folder",
        value: "enable_all"
    }, {
        label: "No, exit",
        value: "exit"
    }], q[24] = $6;
    else $6 = q[24];
    let n;
    if (q[25] !== H6) n = AT.default.createElement(T8, {
        options: $6,
        onChange: (i) => H6(i),
        onCancel: () => H6("exit")
    }), q[25] = H6, q[26] = n;
    else n = q[26];
    let o;
    if (q[27] !== J6.keyName || q[28] !== J6.pending) o = AT.default.createElement(T, {
        dimColor: !0
    }, J6.pending ? AT.default.createElement(AT.default.Fragment, null, "Press ", J6.keyName, " again to exit") : AT.default.createElement(AT.default.Fragment, null, "Enter to confirm · Esc to cancel")), q[27] = J6.keyName, q[28] = J6.pending, q[29] = o;
    else o = q[29];
    let a;
    if (q[30] !== n || q[31] !== o) a = AT.default.createElement(cz, {
        color: "warning",
        titleColor: "warning",
        title: "Accessing workspace:"
    }, AT.default.createElement(m, {
        flexDirection: "column",
        gap: 1,
        paddingTop: 1
    }, s, X6, z6, N6, n, o)), q[30] = n, q[31] = o, q[32] = a;
    else a = q[32];
    return a
}
// @from(Ln 465886, Col 0)
function qjz() {
    fK(0)
}
// @from(Ln 465890, Col 0)
function Kjz() {
    return fK(1)
}
// @from(Ln 465894, Col 0)
function Yjz(A) {
    return {
        ...A,
        hasTrustDialogAccepted: !0
    }
}
// @from(Ln 465901, Col 0)
function zjz(A) {
    return A.type === "prompt" && (A.loadedFrom === "skills" || A.loadedFrom === "plugin") && (A.source === "projectSettings" || A.source === "localSettings" || A.source === "plugin") && A.allowedTools?.some(_jz)
}
// @from(Ln 465905, Col 0)
function _jz(A) {
    return A === Q7 || A.startsWith(Q7 + "(")
}
// @from(Ln 465909, Col 0)
function wjz(A) {
    return A.type === "prompt" && A.loadedFrom === "commands_DEPRECATED" && (A.source === "projectSettings" || A.source === "localSettings") && A.allowedTools?.some(Ojz)
}
// @from(Ln 465913, Col 0)
function Ojz(A) {
    return A === Q7 || A.startsWith(Q7 + "(")
}
// @from(Ln 465916, Col 4)
AT
// @from(Ln 465917, Col 4)
CEq = E(() => {
    e6();
    i6();
    _7();
    o9();
    k8();
    WZ();
    V1();
    PO();
    lA();
    T1();
    i6();
    SA();
    c_();
    REq();
    NZ();
    AT = t(P6(), 1)
})
// @from(Ln 465935, Col 4)
IEq = {}
// @from(Ln 465940, Col 0)
function $jz(A) {
    let q = A6(7),
        {
            onAccept: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = [], q[0] = Y;
    else Y = q[0];
    ui.default.useEffect(jjz, Y);
    let z;
    if (q[1] !== K) z = function(J) {
        A: switch (J) {
            case "accept": {
                d("tengu_bypass_permissions_mode_dialog_accept", {}), TA("userSettings", {
                    skipDangerousModePermissionPrompt: !0
                }), K();
                break A
            }
            case "decline":
                fK(1)
        }
    }, q[1] = K, q[2] = z;
    else z = q[2];
    let _ = z,
        w = Hjz,
        O;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) O = ui.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, ui.default.createElement(T, null, "In Bypass Permissions mode, Claude Code will not ask for your approval before running potentially dangerous commands.", ui.default.createElement(iG, null), "This mode should only be used in a sandboxed container/VM that has restricted internet access and can easily be restored if damaged."), ui.default.createElement(T, null, "By proceeding, you accept all responsibility for actions taken while running in Bypass Permissions mode."), ui.default.createElement(y7, {
        url: "https://code.claude.com/docs/en/security"
    })), q[3] = O;
    else O = q[3];
    let $;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) $ = [{
        label: "No, exit",
        value: "decline"
    }, {
        label: "Yes, I accept",
        value: "accept"
    }], q[4] = $;
    else $ = q[4];
    let H;
    if (q[5] !== _) H = ui.default.createElement(m8, {
        title: "WARNING: Claude Code running in Bypass Permissions mode",
        color: "error",
        onCancel: w
    }, O, ui.default.createElement(T8, {
        options: $,
        onChange: (j) => _(j)
    })), q[5] = _, q[6] = H;
    else H = q[6];
    return H
}
// @from(Ln 465995, Col 0)
function Hjz() {
    fK(0)
}
// @from(Ln 465999, Col 0)
function jjz() {
    d("tengu_bypass_permissions_mode_dialog_shown", {})
}
// @from(Ln 466002, Col 4)
ui
// @from(Ln 466003, Col 4)
bEq = E(() => {
    e6();
    i6();
    o9();
    i8();
    V1();
    i6();
    c_();
    wq();
    ui = t(P6(), 1)
})
// @from(Ln 466014, Col 4)
xEq = {}
// @from(Ln 466020, Col 0)
function fa8(A) {
    let q = A6(18),
        {
            onAccept: K,
            onDecline: Y,
            declineExits: z
        } = A,
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = [], q[0] = _;
    else _ = q[0];
    q26.default.useEffect(Jjz, _);
    let w;
    if (q[1] !== K || q[2] !== Y) w = function(Z) {
        A: switch (Z) {
            case "accept": {
                d("tengu_auto_mode_opt_in_dialog_accept", {}), TA("userSettings", {
                    skipAutoPermissionPrompt: !0
                }), K();
                break A
            }
            case "accept-default": {
                d("tengu_auto_mode_opt_in_dialog_accept_default", {}), TA("userSettings", {
                    skipAutoPermissionPrompt: !0,
                    permissions: {
                        defaultMode: "auto"
                    }
                }), K();
                break A
            }
            case "decline":
                d("tengu_auto_mode_opt_in_dialog_decline", {}), Y()
        }
    }, q[1] = K, q[2] = Y, q[3] = w;
    else w = q[3];
    let O = w,
        $;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) $ = q26.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, q26.default.createElement(T, null, xC1), q26.default.createElement(y7, {
        url: "https://code.claude.com/docs/en/security"
    })), q[4] = $;
    else $ = q[4];
    let H;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) H = [{
        label: "Yes, and make it my default mode",
        value: "accept-default"
    }], q[5] = H;
    else H = q[5];
    let j;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) j = {
        label: "Yes, enable auto mode",
        value: "accept"
    }, q[6] = j;
    else j = q[6];
    let J = z ? "No, exit" : "No, go back",
        M;
    if (q[7] !== J) M = [...H, j, {
        label: J,
        value: "decline"
    }], q[7] = J, q[8] = M;
    else M = q[8];
    let D;
    if (q[9] !== O) D = (W) => O(W), q[9] = O, q[10] = D;
    else D = q[10];
    let X;
    if (q[11] !== Y || q[12] !== M || q[13] !== D) X = q26.default.createElement(T8, {
        options: M,
        onChange: D,
        onCancel: Y
    }), q[11] = Y, q[12] = M, q[13] = D, q[14] = X;
    else X = q[14];
    let P;
    if (q[15] !== Y || q[16] !== X) P = q26.default.createElement(m8, {
        title: "Enable auto mode?",
        color: "warning",
        onCancel: Y
    }, $, X), q[15] = Y, q[16] = X, q[17] = P;
    else P = q[17];
    return P
}
// @from(Ln 466102, Col 0)
function Jjz() {
    d("tengu_auto_mode_opt_in_dialog_shown", {})
}
// @from(Ln 466105, Col 4)
q26
// @from(Ln 466105, Col 9)
xC1 = "Auto mode lets Claude handle permission prompts automatically — Claude checks each tool call for risky actions and prompt injection before executing. Actions Claude identifies as safe are executed, while actions Claude identifies as risky are blocked and Claude may try a different approach. Ideal for long-running tasks. Sessions are slightly more expensive. Claude can make mistakes that allow harmful commands to run, it's recommended to only use in isolated environments. Shift+Tab to change mode."
// @from(Ln 466106, Col 4)
uC1 = E(() => {
    e6();
    i6();
    o9();
    i8();
    V1();
    wq();
    q26 = t(P6(), 1)
})
// @from(Ln 466115, Col 4)
uEq = {}
// @from(Ln 466120, Col 0)
function Xjz(A) {
    let q = A6(20),
        {
            onDone: K
        } = A,
        [Y, z] = oX.default.useState(!1),
        _, w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = () => {
        d("tengu_claude_in_chrome_onboarding_shown", {}), Hi().then(z), d1(Pjz)
    }, w = [], q[0] = _, q[1] = w;
    else _ = q[0], w = q[1];
    oX.default.useEffect(_, w);
    let O;
    if (q[2] !== K) O = (W, Z) => {
        if (Z.return) K()
    }, q[2] = K, q[3] = O;
    else O = q[3];
    jA(O);
    let $;
    if (q[4] !== Y) $ = !Y && oX.default.createElement(oX.default.Fragment, null, oX.default.createElement(iG, null), oX.default.createElement(iG, null), "Requires the Chrome extension. Get started at", " ", oX.default.createElement(y7, {
        url: Mjz
    })), q[4] = Y, q[5] = $;
    else $ = q[5];
    let H;
    if (q[6] !== $) H = oX.default.createElement(T, null, "Claude in Chrome works with the Chrome extension to let you control your browser directly from Claude Code. You can navigate websites, fill forms, capture screenshots, record GIFs, and debug with console logs and network requests.", $), q[6] = $, q[7] = H;
    else H = q[7];
    let j;
    if (q[8] !== Y) j = Y && oX.default.createElement(oX.default.Fragment, null, " ", "(", oX.default.createElement(y7, {
        url: Djz
    }), ")"), q[8] = Y, q[9] = j;
    else j = q[9];
    let J;
    if (q[10] !== j) J = oX.default.createElement(T, {
        dimColor: !0
    }, "Site-level permissions are inherited from the Chrome extension. Manage permissions in the Chrome extension settings to control which sites Claude can browse, click, and type on", j, "."), q[10] = j, q[11] = J;
    else J = q[11];
    let M;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) M = oX.default.createElement(T, {
        bold: !0,
        color: "chromeYellow"
    }, "/chrome"), q[12] = M;
    else M = q[12];
    let D;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) D = oX.default.createElement(T, {
        dimColor: !0
    }, "For more info, use", " ", M, " ", "or visit ", oX.default.createElement(y7, {
        url: "https://code.claude.com/docs/en/chrome"
    })), q[13] = D;
    else D = q[13];
    let X;
    if (q[14] !== H || q[15] !== J) X = oX.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, H, J, D), q[14] = H, q[15] = J, q[16] = X;
    else X = q[16];
    let P;
    if (q[17] !== K || q[18] !== X) P = oX.default.createElement(m8, {
        title: "Claude in Chrome (Beta)",
        onCancel: K,
        color: "chromeYellow"
    }, X), q[17] = K, q[18] = X, q[19] = P;
    else P = q[19];
    return P
}
// @from(Ln 466185, Col 0)
function Pjz(A) {
    return {
        ...A,
        hasCompletedClaudeInChromeOnboarding: !0
    }
}
// @from(Ln 466191, Col 4)
oX
// @from(Ln 466191, Col 8)
Mjz = "https://claude.ai/chrome"
// @from(Ln 466192, Col 4)
Djz = "https://clau.de/chrome/permissions"
// @from(Ln 466193, Col 4)
mEq = E(() => {
    e6();
    i6();
    i6();
    k8();
    V1();
    R_6();
    wq();
    oX = t(P6(), 1)
})
// @from(Ln 466207, Col 0)
function Zjz() {
    d1((A) => ({
        ...A,
        hasCompletedOnboarding: !0,
        lastOnboardingVersion: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION
    }))
}
// @from(Ln 466222, Col 0)
function Gjz(A, q) {
    return new Promise((K) => {
        let Y = (z) => void K(z);
        A.render(q(Y))
    })
}
// @from(Ln 466228, Col 0)
async function zx(A, q, K) {
    let {
        Text: Y
    } = await Promise.resolve().then(() => (i6(), pu6));
    A.render(ph.default.createElement(Y, {
        color: "error"
    }, q)), A.unmount(), await K?.(), process.exit(1)
}
// @from(Ln 466237, Col 0)
function Qh(A, q, K) {
    return Gjz(A, (Y) => ph.default.createElement(Yj, {
        onChangeAppState: K?.onChangeAppState
    }, ph.default.createElement(aj, null, q(Y))))
}
// @from(Ln 466242, Col 0)
async function OV6(A, q) {
    A.render(q), mC1(), await A.waitUntilExit(), await Vq(0)
}
// @from(Ln 466245, Col 0)
async function BEq(A, q, K, Y, z) {
    if (t6(!1) || process.env.IS_DEMO) return !1;
    let _ = X1(),
        w = !1;
    if (!_.theme || !_.hasCompletedOnboarding) {
        w = !0;
        let [, {
            Onboarding: O
        }] = await Promise.all([Jz6(), Promise.resolve().then(() => (DEq(), MEq))]);
        await Qh(A, ($) => ph.default.createElement(O, {
            onDone: () => {
                Zjz(), $()
            }
        }), {
            onChangeAppState: bi
        })
    }
    if (!t6(process.env.CLAUBBIT)) {
        if (!l_()) {
            let {
                TrustDialog: $
            } = await Promise.resolve().then(() => (CEq(), SEq));
            await Qh(A, (H) => ph.default.createElement($, {
                commands: Y,
                onDone: H
            }))
        }
        ik6(!0), Wo6(), Ri(), mw();
        let {
            errors: O
        } = Kl();
        if (O.length === 0) await akq(A);
        if (await of8()) {
            let $ = E06(),
                {
                    ClaudeMdExternalIncludesDialog: H
                } = await Promise.resolve().then(() => (AU8(), I9q));
            await Qh(A, (j) => ph.default.createElement(H, {
                onDone: j,
                isStandaloneDialog: !0,
                externalIncludes: $
            }))
        }
    }
    if (tkq(), bF(), ZC1(), await qG6()) {
        let {
            GroveDialog: O
        } = await Promise.resolve().then(() => (Gl8(), oMq));
        if (await Qh(A, (H) => ph.default.createElement(O, {
                showIfAlreadyViewed: !1,
                location: w ? "onboarding" : "policy_update_modal",
                onDone: H
            })) === "escape") return d("tengu_grove_policy_exited", {}), fK(0), !1
    }
    if (process.env.ANTHROPIC_API_KEY && !zG()) {
        let O = vN(process.env.ANTHROPIC_API_KEY);
        if (To6(O) === "new") {
            let {
                ApproveApiKey: H
            } = await Promise.resolve().then(() => (Za8(), OEq));
            await Qh(A, (j) => ph.default.createElement(H, {
                customApiKeyTruncated: O,
                onDone: j
            }), {
                onChangeAppState: bi
            })
        }
    }
    if ((q === "bypassPermissions" || K) && !OZ6()) {
        let {
            BypassPermissionsModeDialog: O
        } = await Promise.resolve().then(() => (bEq(), IEq));
        await Qh(A, ($) => ph.default.createElement(O, {
            onAccept: $
        }))
    }
    if (q === "auto" && !s16()) {
        let {
            AutoModeOptInDialog: O
        } = await Promise.resolve().then(() => (uC1(), xEq));
        await Qh(A, ($) => ph.default.createElement(O, {
            onAccept: $,
            onDecline: () => fK(1),
            declineExits: !0
        }))
    }
    if (z && !X1().hasCompletedClaudeInChromeOnboarding) {
        let {
            ClaudeInChromeOnboarding: O
        } = await Promise.resolve().then(() => (mEq(), uEq));
        await Qh(A, ($) => ph.default.createElement(O, {
            onDone: $
        }))
    }
    return w
}
// @from(Ln 466342, Col 0)
function gEq(A) {
    let q = 0,
        K = xc(A);
    if (K.stdin) d("tengu_stdin_interactive", {});
    let Y = new ja8,
        z = Ma8();
    zu1(z);
    let _ = process.env.CLAUDE_CODE_FRAME_TIMING_LOG;
    return {
        getFpsMetrics: () => Y.getMetrics(),
        stats: z,
        renderOptions: {
            ...K,
            onFrame: (w) => {
                if (Y.record(w.durationMs), z.observe("frame_duration_ms", w.durationMs), _ && w.phases) {
                    let O = JSON.stringify({
                        total: w.durationMs,
                        ...w.phases,
                        rss: process.memoryUsage.rss(),
                        cpu: process.cpuUsage()
                    }) + `
`;
                    Wjz(_, O)
                }
                if (hH8()) return;
                for (let O of w.flickers) {
                    if (O.reason === "resize") continue;
                    let $ = Date.now();
                    if ($ - q < 1000) d("tengu_flicker", {
                        desiredHeight: O.desiredHeight,
                        actualHeight: O.availableHeight,
                        reason: O.reason
                    });
                    q = $
                }
            }
        }
    }
}
// @from(Ln 466381, Col 4)
ph
// @from(Ln 466382, Col 4)
FEq = E(() => {
    jX6();
    NA();
    do6();
    Mg();
    Ta8();
    c_();
    VU6();
    Da8();
    T1();
    V1();
    k8();
    A8();
    Mz6();
    HA();
    bv();
    zc6();
    skq();
    lM();
    RC1();
    qV6();
    oo8();
    KG6();
    qn6();
    i8();
    ph = t(P6(), 1)
})
// @from(Ln 466410, Col 0)
function Tjz(A) {
    let q = A.toLowerCase(),
        K = QA();
    for (let [Y, z] of Object.entries(fjz)) {
        let _ = z.retirementDates[K];
        if (!q.includes(Y) || !_) continue;
        return {
            isDeprecated: !0,
            modelName: z.modelName,
            retirementDate: _
        }
    }
    return {
        isDeprecated: !1
    }
}
// @from(Ln 466427, Col 0)
function BC1(A) {
    if (!A) return null;
    let q = Tjz(A);
    if (!q.isDeprecated) return null;
    return `⚠ ${q.modelName} will be retired on ${q.retirementDate}. Consider switching to a newer model.`
}
// @from(Ln 466433, Col 4)
fjz
// @from(Ln 466434, Col 4)
va8 = E(() => {
    Nz();
    fjz = {
        "claude-3-opus": {
            modelName: "Claude 3 Opus",
            retirementDates: {
                firstParty: "January 5, 2026",
                bedrock: "January 15, 2026",
                vertex: "January 5, 2026",
                foundry: "January 5, 2026"
            }
        },
        "claude-3-7-sonnet": {
            modelName: "Claude 3.7 Sonnet",
            retirementDates: {
                firstParty: "February 19, 2026",
                bedrock: "April 28, 2026",
                vertex: "May 11, 2026",
                foundry: "February 19, 2026"
            }
        },
        "claude-3-5-haiku": {
            modelName: "Claude 3.5 Haiku",
            retirementDates: {
                firstParty: "February 19, 2026",
                bedrock: null,
                vertex: null,
                foundry: null
            }
        }
    }
})
// @from(Ln 466467, Col 0)
function $V6(A, q) {
    _6(A), console.error(`${a6.cross} Failed to ${q}: ${_1(A)}`), process.exit(1)
}
// @from(Ln 466470, Col 0)
async function pEq(A, q = "user") {
    try {
        console.log(`Installing plugin "${A}"...`);
        let K = await Zwq(A, q);
        if (!K.success) throw Error(K.message);
        console.log(`${a6.tick} ${K.message}`), d("tengu_plugin_installed_cli", {
            plugin_id: K.pluginId || A,
            marketplace_name: K.pluginId?.split("@")[1] || "unknown",
            scope: K.scope || q
        }), process.exit(0)
    } catch (K) {
        $V6(K, `install plugin "${A}"`)
    }
}
// @from(Ln 466484, Col 0)
async function QEq(A, q = "user") {
    try {
        let K = await v16(A, q);
        if (!K.success) throw Error(K.message);
        console.log(`${a6.tick} ${K.message}`), d("tengu_plugin_uninstalled_cli", {
            plugin_id: K.pluginId || A,
            scope: K.scope || q
        }), process.exit(0)
    } catch (K) {
        $V6(K, `uninstall plugin "${A}"`)
    }
}
// @from(Ln 466496, Col 0)
async function UEq(A, q) {
    try {
        let K = await ol(A, q);
        if (!K.success) throw Error(K.message);
        console.log(`${a6.tick} ${K.message}`), d("tengu_plugin_enabled_cli", {
            plugin_id: K.pluginId || A,
            scope: K.scope
        }), process.exit(0)
    } catch (K) {
        $V6(K, `enable plugin "${A}"`)
    }
}
// @from(Ln 466508, Col 0)
async function dEq(A, q) {
    try {
        let K = await H_6(A, q);
        if (!K.success) throw Error(K.message);
        console.log(`${a6.tick} ${K.message}`), d("tengu_plugin_disabled_cli", {
            plugin_id: K.pluginId || A,
            scope: K.scope
        }), process.exit(0)
    } catch (K) {
        $V6(K, `disable plugin "${A}"`)
    }
}
// @from(Ln 466520, Col 0)
async function cEq() {
    try {
        let A = await Gwq();
        if (!A.success) throw Error(A.message);
        console.log(`${a6.tick} ${A.message}`), d("tengu_plugin_disabled_all_cli", {}), process.exit(0)
    } catch (A) {
        $V6(A, "disable all plugins")
    }
}
// @from(Ln 466529, Col 0)
async function lEq(A, q) {
    try {
        Z4(`Checking for updates for plugin "${A}" at ${q} scope…
`);
        let K = await Fv6(A, q);
        if (!K.success) throw Error(K.message);
        if (Z4(`${a6.tick} ${K.message}
`), !K.alreadyUpToDate) d("tengu_plugin_updated_cli", {
            plugin_id: A,
            old_version: K.oldVersion || "unknown",
            new_version: K.newVersion || "unknown"
        });
        await Vq(0)
    } catch (K) {
        $V6(K, `update plugin "${A}"`)
    }
}
// @from(Ln 466546, Col 4)
Na8 = E(() => {
    b7();
    k1();
    V1();
    c_();
    pv6();
    s8()
})
// @from(Ln 466554, Col 0)
async function iEq() {
    if (!await EM("gh")) return "not_installed";
    let {
        exitCode: q
    } = await q9("gh", ["auth", "token"], {
        stdout: "ignore",
        stderr: "ignore",
        timeout: 5000,
        reject: !1
    });
    return q === 0 ? "authenticated" : "not_authenticated"
}
// @from(Ln 466566, Col 4)
nEq = E(() => {
    WW();
    Oy()
})
// @from(Ln 466571, Col 0)
function Njz(A) {
    return !vjz.some((q) => q.test(A))
}
// @from(Ln 466575, Col 0)
function Vjz(A, q) {
    let K = [],
        Y = new Set,
        z = new Map;
    for (let _ = 1; K.length < q && _ <= q; _++)
        for (let w of A) {
            if (K.length >= q) break;
            if (!Njz(w)) continue;
            let O = Math.max(w.lastIndexOf("/"), w.lastIndexOf("\\")),
                $ = O >= 0 ? w.slice(O + 1) : w;
            if (!$ || Y.has($)) continue;
            let H = O >= 0 ? w.slice(0, O) : ".";
            if ((z.get(H) ?? 0) >= _) continue;
            K.push($), Y.add($), z.set(H, (z.get(H) ?? 0) + 1)
        }
    return K.length >= q ? K : []
}
// @from(Ln 466592, Col 0)
async function kjz() {
    if (Q8.platform === "win32") return [];
    if (!await IH()) return [];
    try {
        let {
            stdout: A
        } = await RA("git", ["config", "user.email"], {
            cwd: G1()
        }), q = ["log", "-n", "1000", "--pretty=format:", "--name-only", "--diff-filter=M"], K = new Map, Y = (_) => {
            for (let w of _.split(`
`)) {
                let O = w.trim();
                if (O) K.set(O, (K.get(O) ?? 0) + 1)
            }
        };
        if (A.trim()) {
            let {
                stdout: _
            } = await RA("git", [...q, `--author=${A.trim()}`], {
                cwd: G1()
            });
            Y(_)
        }
        if (K.size < 10) {
            let {
                stdout: _
            } = await RA(hA(), q, {
                cwd: G1()
            });
            Y(_)
        }
        let z = Array.from(K.entries()).sort((_, w) => w[1] - _[1]).map(([_]) => _);
        return Vjz(z, 5)
    } catch (A) {
        return _6(A), []
    }
}
// @from(Ln 466629, Col 4)
vjz
// @from(Ln 466629, Col 9)
Ejz = 604800000
// @from(Ln 466630, Col 4)
rEq
// @from(Ln 466630, Col 9)
oEq
// @from(Ln 466631, Col 4)
Va8 = E(() => {
    k8();
    d3();
    lA();
    Eq();
    k1();
    U4();
    Nc();
    $5();
    vjz = [/(?:^|\/)(?:package-lock\.json|yarn\.lock|bun\.lock|bun\.lockb|pnpm-lock\.yaml|Pipfile\.lock|poetry\.lock|Cargo\.lock|Gemfile\.lock|go\.sum|composer\.lock|uv\.lock)$/, /\.generated\./, /(?:^|\/)(?:dist|build|out|target|node_modules|\.next|__pycache__)\//, /\.(?:min\.js|min\.css|map|pyc|pyo)$/, /(?:^|\/)\.?(?:eslintrc|prettierrc|babelrc|editorconfig|gitignore|gitattributes|dockerignore|npmrc)/, /(?:^|\/)(?:tsconfig|jsconfig|biome|vitest\.config|jest\.config|webpack\.config|vite\.config|rollup\.config)\.[a-z]+$/, /(?:^|\/)\.(?:github|vscode|idea|claude)\//, /(?:^|\/)(?:CHANGELOG|LICENSE|CONTRIBUTING|CODEOWNERS|README)(?:\.[a-z]+)?$/i];
    rEq = e1(() => {
        let A = d2(),
            q = A.exampleFiles?.length ? YM(A.exampleFiles) : "<filepath>",
            K = ["fix lint errors", "fix typecheck errors", `how does ${q} work?`, `refactor ${q}`, "how do I log an error?", `edit ${q} to...`, `write a test for ${q}`, "create a util logging.py that..."];
        return `Try "${YM(K)}"`
    }), oEq = e1(async () => {
        let A = d2(),
            q = Date.now(),
            K = A.exampleFilesGeneratedAt ?? 0;
        if (q - K > Ejz) A.exampleFiles = [];
        if (!A.exampleFiles?.length) kjz().then((Y) => {
            if (Y.length) c2((z) => ({
                ...z,
                exampleFiles: Y,
                exampleFilesGeneratedAt: Date.now()
            }))
        })
    })
})
// @from(Ln 466660, Col 0)
async function gC1(A, q) {
    let K = await NR(A),
        Y = UP1(q);
    for (let z of K) {
        if (z.type !== "prompt") continue;
        d("tengu_skill_loaded", {
            skill_name: z.name,
            skill_source: z.source,
            skill_loaded_from: z.loadedFrom,
            skill_budget: Y,
            ...z.kind && {
                skill_kind: z.kind
            }
        })
    }
}
// @from(Ln 466676, Col 4)
ka8 = E(() => {
    V1();
    D$();
    Q36()
})
// @from(Ln 466682, Col 0)
function aEq(A) {
    A.command("add <name> <commandOrUrl> [args...]").description(`Add an MCP server to Claude Code.

Examples:
  # Add HTTP server:
  claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

  # Add HTTP server with headers:
  claude mcp add --transport http corridor https://app.corridor.dev/api/mcp --header "Authorization: Bearer ..."

  # Add stdio server with environment variables:
  claude mcp add -e API_KEY=xxx my-server -- npx my-mcp-server

  # Add stdio server with subprocess flags:
  claude mcp add my-server -- my-command --some-flag arg1`).option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").option("-t, --transport <transport>", "Transport type (stdio, sse, http). Defaults to stdio if not specified.").option("-e, --env <env...>", "Set environment variables (e.g. -e KEY=value)").option("-H, --header <header...>", 'Set WebSocket headers (e.g. -H "X-Api-Key: abc123" -H "X-Custom: value")').option("--client-id <clientId>", "OAuth client ID for HTTP/SSE servers").option("--client-secret", "Prompt for OAuth client secret (or set MCP_CLIENT_SECRET env var)").option("--callback-port <port>", "Fixed port for OAuth callback (for servers requiring pre-registered redirect URIs)").helpOption("-h, --help", "Display help for command").action(async (q, K, Y, z) => {
        let _ = K,
            w = Y;
        if (!q) console.error("Error: Server name is required."), console.error("Usage: claude mcp add <name> <command> [args...]"), process.exit(1);
        else if (!_) console.error("Error: Command is required when server name is provided."), console.error("Usage: claude mcp add <name> <command> [args...]"), process.exit(1);
        try {
            let O = wZ6(z.scope),
                $ = Kw4(z.transport),
                H = z.transport !== void 0,
                j = _.startsWith("http://") || _.startsWith("https://") || _.startsWith("localhost") || _.endsWith("/sse") || _.endsWith("/mcp");
            if (d("tengu_mcp_add", {
                    type: $,
                    scope: O,
                    source: "command",
                    transport: $,
                    transportExplicit: H,
                    looksLikeUrl: j
                }), $ === "sse") {
                if (!_) console.error("Error: URL is required for SSE transport."), process.exit(1);
                let J = z.header ? HE8(z.header) : void 0,
                    M = z.callbackPort ? parseInt(z.callbackPort, 10) : void 0,
                    D = z.clientId || M ? {
                        ...z.clientId ? {
                            clientId: z.clientId
                        } : {},
                        ...M ? {
                            callbackPort: M
                        } : {}
                    } : void 0,
                    X = z.clientSecret && z.clientId ? await vn6() : void 0,
                    P = {
                        type: "sse",
                        url: _,
                        headers: J,
                        oauth: D
                    };
                if (await je(q, P, O), X) Nn6(q, P, X);
                if (process.stdout.write(`Added SSE MCP server ${q} with URL: ${_} to ${O} config
`), J) process.stdout.write(`Headers: ${B6(J,null,2)}
`)
            } else if ($ === "http") {
                if (!_) console.error("Error: URL is required for HTTP transport."), process.exit(1);
                let J = z.header ? HE8(z.header) : void 0,
                    M = z.callbackPort ? parseInt(z.callbackPort, 10) : void 0,
                    D = z.clientId || M ? {
                        ...z.clientId ? {
                            clientId: z.clientId
                        } : {},
                        ...M ? {
                            callbackPort: M
                        } : {}
                    } : void 0,
                    X = z.clientSecret && z.clientId ? await vn6() : void 0,
                    P = {
                        type: "http",
                        url: _,
                        headers: J,
                        oauth: D
                    };
                if (await je(q, P, O), X) Nn6(q, P, X);
                if (process.stdout.write(`Added HTTP MCP server ${q} with URL: ${_} to ${O} config
`), J) process.stdout.write(`Headers: ${B6(J,null,2)}
`)
            } else {
                if (z.clientId || z.clientSecret || z.callbackPort) process.stderr.write(`Warning: --client-id, --client-secret, and --callback-port are only supported for HTTP/SSE transports and will be ignored for stdio.
`);
                if (!H && j) process.stderr.write(`
Warning: The command "${_}" looks like a URL, but is being interpreted as a stdio server as --transport was not specified.
`), process.stderr.write(`If this is an HTTP server, use: claude mcp add --transport http ${q} ${_}
`), process.stderr.write(`If this is an SSE server, use: claude mcp add --transport sse ${q} ${_}
`);
                let J = FAA(z.env);
                await je(q, {
                    type: "stdio",
                    command: _,
                    args: w,
                    env: J
                }, O), process.stdout.write(`Added stdio MCP server ${q} with command: ${_} ${w.join(" ")} to ${O} config
`)
            }
            process.stdout.write(`File modified: ${PZ(O)}
`), process.exit(0)
        } catch (O) {
            console.error(O.message), process.exit(1)
        }
    })
}
// @from(Ln 466783, Col 4)
sEq = E(() => {
    WZ();
    qM();
    A8();
    g1();
    V1();
    W16()
})
// @from(Ln 466792, Col 0)
function tEq() {
    return X1().tipsHistory || {}
}
// @from(Ln 466796, Col 0)
function yjz(A) {
    d1((q) => {
        if (q.tipsHistory === A) return q;
        return {
            ...q,
            tipsHistory: A
        }
    })
}
// @from(Ln 466806, Col 0)
function eEq(A) {
    let q = tEq(),
        K = X1().numStartups;
    q[A] = K, yjz(q)
}
// @from(Ln 466812, Col 0)
function Ljz(A) {
    return tEq()[A] || 0
}
// @from(Ln 466816, Col 0)
function FC1(A) {
    let q = Ljz(A);
    if (q === 0) return 1 / 0;
    return X1().numStartups - q
}
// @from(Ln 466821, Col 4)
Ea8 = E(() => {
    k8()
})
// @from(Ln 466834, Col 0)
function qyq() {
    return ya8(c8(), "sessions")
}
// @from(Ln 466837, Col 0)
async function Kyq() {
    if (process.env.CLAUDE_CODE_ENTRYPOINT !== "cli" || !DW() || nM() != null) return !1;
    let A = qyq(),
        q = ya8(A, `${process.pid}.json`);
    E4(async () => {
        try {
            await Ayq(q)
        } catch {}
    });
    try {
        return await hjz(A, {
            recursive: !0
        }), await Sjz(q, B6({
            pid: process.pid,
            sessionId: R1(),
            cwd: AA(),
            startedAt: Date.now()
        })), !0
    } catch (K) {
        return k(`[concurrentSessions] register failed: ${_1(K)}`), !1
    }
}
// @from(Ln 466859, Col 0)
async function pC1() {
    let A = qyq(),
        q;
    try {
        q = await Cjz(A)
    } catch (Y) {
        let z = Y.code;
        if (z !== "ENOENT" && z !== "EACCES" && z !== "EPERM") k(`[concurrentSessions] readdir failed: ${_1(Y)}`);
        return 0
    }
    let K = 0;
    for (let Y of q) {
        let z = parseInt(Y.replace(/\.json$/, ""), 10);
        if (isNaN(z)) continue;
        if (z === process.pid) {
            K++;
            continue
        }
        if (cA1(z)) K++;
        else if (y8() !== "wsl") Ayq(ya8(A, Y)).catch(() => {})
    }
    return K
}
// @from(Ln 466882, Col 4)
La8 = E(() => {
    A8();
    _H6();
    KY();
    T1();
    zz();
    H1();
    s8();
    g1();
    YK()
})
// @from(Ln 466894, Col 0)
function Ra8() {
    return mf("tengu_desktop_upsell", Ijz)
}
// @from(Ln 466898, Col 0)
function bjz() {
    return process.platform === "darwin" || process.platform === "win32" && process.arch === "x64"
}
// @from(Ln 466902, Col 0)
function Yyq() {
    if (!bjz()) return !1;
    if (!Ra8().enable_startup_dialog) return !1;
    let A = X1();
    if (A.desktopUpsellDismissed) return !1;
    if ((A.desktopUpsellSeenCount ?? 0) >= 3) return !1;
    return !0
}
// @from(Ln 466911, Col 0)
function zyq(A) {
    let q = A6(14),
        {
            onDone: K
        } = A,
        [Y, z] = QC1.useState(!1),
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = [], q[0] = _;
    else _ = q[0];
    if (QC1.useEffect(ujz, _), Y) {
        let P;
        if (q[1] !== K) P = uE.createElement(Ry1, {
            onDone: () => K()
        }), q[1] = K, q[2] = P;
        else P = q[2];
        return P
    }
    let w;
    if (q[3] !== K) w = function(W) {
        switch (W) {
            case "try": {
                z(!0);
                return
            }
            case "never": {
                d1(xjz), K();
                return
            }
            case "not-now": {
                K();
                return
            }
        }
    }, q[3] = K, q[4] = w;
    else w = q[4];
    let O = w,
        $;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) $ = {
        label: "Open in Claude Code Desktop",
        value: "try"
    }, q[5] = $;
    else $ = q[5];
    let H;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) H = {
        label: "Not now",
        value: "not-now"
    }, q[6] = H;
    else H = q[6];
    let j;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) j = [$, H, {
        label: "Don't ask again",
        value: "never"
    }], q[7] = j;
    else j = q[7];
    let J = j,
        M;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) M = uE.createElement(m, {
        marginBottom: 1
    }, uE.createElement(T, null, "Same Claude Code with visual diffs, live app preview, parallel sessions, and more.")), q[8] = M;
    else M = q[8];
    let D;
    if (q[9] !== O) D = () => O("not-now"), q[9] = O, q[10] = D;
    else D = q[10];
    let X;
    if (q[11] !== O || q[12] !== D) X = uE.createElement(cz, {
        title: "Try Claude Code Desktop"
    }, uE.createElement(m, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, M, uE.createElement(T8, {
        options: J,
        onChange: O,
        onCancel: D
    }))), q[11] = O, q[12] = D, q[13] = X;
    else X = q[13];
    return X
}
// @from(Ln 466990, Col 0)
function xjz(A) {
    if (A.desktopUpsellDismissed) return A;
    return {
        ...A,
        desktopUpsellDismissed: !0
    }
}
// @from(Ln 466998, Col 0)
function ujz() {
    let A = (X1().desktopUpsellSeenCount ?? 0) + 1;
    d1((q) => {
        if ((q.desktopUpsellSeenCount ?? 0) >= A) return q;
        return {
            ...q,
            desktopUpsellSeenCount: A
        }
    }), d("tengu_desktop_upsell_shown", {
        seen_count: A
    })
}
// @from(Ln 467010, Col 4)
uE
// @from(Ln 467010, Col 8)
QC1
// @from(Ln 467010, Col 13)
Ijz
// @from(Ln 467011, Col 4)
ha8 = E(() => {
    e6();
    i6();
    NZ();
    v3();
    rQ8();
    k8();
    V1();
    HA();
    uE = t(P6(), 1), QC1 = t(P6(), 1), Ijz = {
        enable_shortcut_tip: !1,
        enable_startup_dialog: !1
    }
})
// @from(Ln 467025, Col 0)
async function mjz() {
    return "claude-code-plugins" in await C3()
}
// @from(Ln 467029, Col 0)
function Fjz() {
    let q = mA().spinnerTipsOverride;
    if (!q?.tips?.length) return [];
    return q.tips.map((K, Y) => ({
        id: `custom-tip-${Y}`,
        content: async () => K,
        cooldownSessions: 0,
        isRelevant: async () => !0
    }))
}
// @from(Ln 467039, Col 0)
async function UC1(A) {
    let K = mA().spinnerTipsOverride,
        Y = Fjz();
    if (K?.excludeDefault && Y.length > 0) return Y;
    let z = [...Bjz, ...gjz],
        _ = await Promise.all(z.map((O) => O.isRelevant(A)));
    return [...z.filter((O, $) => _[$]).filter((O) => FC1(O.id) >= O.cooldownSessions), ...Y]
}
// @from(Ln 467047, Col 4)
Bjz
// @from(Ln 467047, Col 9)
gjz
// @from(Ln 467048, Col 4)
Sa8 = E(() => {
    aK();
    k8();
    $5();
    fX();
    Aw();
    z4();
    ey1();
    J36();
    d3();
    Sw();
    YK();
    $y1();
    ld();
    i8();
    Ea8();
    Oq();
    La8();
    JN();
    H1();
    bK6();
    tP();
    ha8();
    x16();
    Bjz = [{
        id: "new-user-warmup",
        content: async () => "Start with small features or bug fixes, tell Claude to propose a plan, and verify its suggested edits",
        cooldownSessions: 3,
        async isRelevant() {
            return X1().numStartups < 10
        }
    }, {
        id: "plan-mode-for-complex-tasks",
        content: async () => `Use Plan Mode to prepare for a complex request before making changes. Press ${PX("chat:cycleMode","Chat","shift+tab")} twice to enable.`,
        cooldownSessions: 5,
        isRelevant: async () => {
            let A = X1();
            return (A.lastPlanModeUse ? (Date.now() - A.lastPlanModeUse) / 86400000 : 1 / 0) > 7
        }
    }, {
        id: "default-permission-mode-config",
        content: async () => "Use /config to change your default permission mode (including Plan Mode)",
        cooldownSessions: 10,
        isRelevant: async () => {
            try {
                let A = X1(),
                    q = PA(),
                    K = Boolean(A.lastPlanModeUse),
                    Y = Boolean(q?.permissions?.defaultMode);
                return K && !Y
            } catch (A) {
                return k(`Failed to check default-permission-mode-config tip relevance: ${A}`, {
                    level: "warn"
                }), !1
            }
        }
    }, {
        id: "git-worktrees",
        content: async () => "Use git worktrees to run multiple Claude sessions in parallel.",
        cooldownSessions: 10,
        isRelevant: async () => {
            try {
                let A = X1();
                return await TJ6() <= 1 && A.numStartups > 50
            } catch (A) {
                return !1
            }
        }
    }, {
        id: "color-when-multi-clauding",
        content: async () => "Running multiple Claude sessions? Use /color and /rename to tell them apart at a glance.",
        cooldownSessions: 10,
        isRelevant: async () => {
            if (Pr8()) return !1;
            return await pC1() >= 2
        }
    }, {
        id: "terminal-setup",
        content: async () => Q8.terminal === "Apple_Terminal" ? "Run /terminal-setup to enable convenient terminal integration like Option + Enter for new line and more" : "Run /terminal-setup to enable convenient terminal integration like Shift + Enter for new line and more",
        cooldownSessions: 10,
        async isRelevant() {
            let A = X1();
            if (Q8.terminal === "Apple_Terminal") return A_6.isEnabled() && !A.optionAsMetaKeyInstalled;
            return A_6.isEnabled() && !A.shiftEnterKeyBindingInstalled
        }
    }, {
        id: "shift-enter",
        content: async () => Q8.terminal === "Apple_Terminal" ? "Press Option+Enter to send a multi-line message" : "Press Shift+Enter to send a multi-line message",
        cooldownSessions: 10,
        async isRelevant() {
            let A = X1();
            return Boolean((Q8.terminal === "Apple_Terminal" ? A.optionAsMetaKeyInstalled : A.shiftEnterKeyBindingInstalled) && A.numStartups > 3)
        }
    }, {
        id: "shift-enter-setup",
        content: async () => Q8.terminal === "Apple_Terminal" ? "Run /terminal-setup to enable Option+Enter for new lines" : "Run /terminal-setup to enable Shift+Enter for new lines",
        cooldownSessions: 10,
        async isRelevant() {
            if (!I06()) return !1;
            let A = X1();
            return !(Q8.terminal === "Apple_Terminal" ? A.optionAsMetaKeyInstalled : A.shiftEnterKeyBindingInstalled)
        }
    }, {
        id: "memory-command",
        content: async () => "Use /memory to view and manage Claude memory",
        cooldownSessions: 15,
        async isRelevant() {
            return X1().memoryUsageCount <= 0
        }
    }, {
        id: "theme-command",
        content: async () => "Use /theme to change the color theme",
        cooldownSessions: 20,
        isRelevant: async () => !0
    }, {
        id: "colorterm-truecolor",
        content: async () => "Try setting environment variable COLORTERM=truecolor for richer colors",
        cooldownSessions: 30,
        isRelevant: async () => !process.env.COLORTERM && O1.level < 3
    }, {
        id: "status-line",
        content: async () => "Use /statusline to set up a custom status line that will display beneath the input box",
        cooldownSessions: 25,
        isRelevant: async () => PA().statusLine === void 0
    }, {
        id: "prompt-queue",
        content: async () => "Hit Enter to queue up additional messages while Claude is working.",
        cooldownSessions: 5,
        async isRelevant() {
            return X1().promptQueueUseCount <= 3
        }
    }, {
        id: "enter-to-steer-in-relatime",
        content: async () => "Send messages to Claude while it works to steer Claude in real-time",
        cooldownSessions: 20,
        isRelevant: async () => !0
    }, {
        id: "todo-list",
        content: async () => "Ask Claude to create a todo list when working on complex tasks to track progress and remain on track",
        cooldownSessions: 20,
        isRelevant: async () => !0
    }, {
        id: "vscode-command-install",
        content: async () => `Open the Command Palette (Cmd+Shift+P) and run "Shell Command: Install '${Q8.terminal==="vscode"?"code":Q8.terminal}' command in PATH" to enable IDE integration`,
        cooldownSessions: 0,
        async isRelevant() {
            if (!lu6()) return !1;
            if (y8() !== "macos") return !1;
            switch (Q8.terminal) {
                case "vscode":
                    return !await wR7();
                case "cursor":
                    return !await zR7();
                case "windsurf":
                    return !await _R7();
                default:
                    return !1
            }
        }
    }, {
        id: "ide-upsell-external-terminal",
        content: async () => "Connect Claude to your IDE · /ide",
        cooldownSessions: 4,
        async isRelevant() {
            if (FM()) return !1;
            if ((await y$1()).length !== 0) return !1;
            return (await OR7()).length > 0
        }
    }, {
        id: "install-github-app",
        content: async () => "Run /install-github-app to tag @claude right from your Github issues and PRs",
        cooldownSessions: 10,
        isRelevant: async () => !X1().githubActionSetupCount
    }, {
        id: "install-slack-app",
        content: async () => "Run /install-slack-app to use Claude in Slack",
        cooldownSessions: 10,
        isRelevant: async () => !X1().slackAppInstallCount
    }, {
        id: "permissions",
        content: async () => "Use /permissions to pre-approve and pre-deny bash, edit, and MCP tools",
        cooldownSessions: 10,
        async isRelevant() {
            return X1().numStartups > 10
        }
    }, {
        id: "drag-and-drop-images",
        content: async () => "Did you know you can drag and drop image files into your terminal?",
        cooldownSessions: 10,
        isRelevant: async () => !Q8.isSSH()
    }, {
        id: "paste-images-mac",
        content: async () => "Paste images into Claude Code using control+v (not cmd+v!)",
        cooldownSessions: 10,
        isRelevant: async () => y8() === "macos"
    }, {
        id: "double-esc",
        content: async () => "Double-tap esc to rewind the conversation to a previous point in time",
        cooldownSessions: 10,
        isRelevant: async () => !iz()
    }, {
        id: "double-esc-code-restore",
        content: async () => "Double-tap esc to rewind the code and/or conversation to a previous point in time",
        cooldownSessions: 10,
        isRelevant: async () => iz()
    }, {
        id: "continue",
        content: async () => "Run claude --continue or claude --resume to resume a conversation",
        cooldownSessions: 10,
        isRelevant: async () => !0
    }, {
        id: "rename-conversation",
        content: async () => "Name your conversations with /rename to find them easily in /resume later",
        cooldownSessions: 15,
        isRelevant: async () => Ki() && X1().numStartups > 10
    }, {
        id: "custom-commands",
        content: async () => "Create skills by adding .md files to .claude/skills/ in your project or ~/.claude/skills/ for skills that work in any project",
        cooldownSessions: 15,
        async isRelevant() {
            return X1().numStartups > 10
        }
    }, {
        id: "shift-tab",
        content: async () => `Hit ${PX("chat:cycleMode","Chat","shift+tab")} to cycle between default mode, auto-accept edit mode, and plan mode`,
        cooldownSessions: 10,
        isRelevant: async () => !0
    }, {
        id: "image-paste",
        content: async () => `Use ${Oy1.displayText} to paste images from your clipboard`,
        cooldownSessions: 20,
        isRelevant: async () => !0
    }, {
        id: "custom-agents",
        content: async () => "Use /agents to optimize specific tasks. Eg. Software Architect, Code Writer, Code Reviewer",
        cooldownSessions: 15,
        async isRelevant() {
            return X1().numStartups > 5
        }
    }, {
        id: "agent-flag",
        content: async () => "Use --agent <agent_name> to directly start a conversation with a subagent",
        cooldownSessions: 15,
        async isRelevant() {
            return X1().numStartups > 5
        }
    }, {
        id: "desktop-app",
        content: async () => "Run Claude Code locally or remotely using the Claude desktop app: clau.de/desktop",
        cooldownSessions: 15,
        isRelevant: async () => y8() !== "linux"
    }, {
        id: "desktop-shortcut",
        content: async (A) => {
            return `Continue your session in Claude Code Desktop with ${kA("suggestion",A.theme)("/desktop")}`
        },
        cooldownSessions: 15,
        isRelevant: async () => {
            if (!Ra8().enable_shortcut_tip) return !1;
            return process.platform === "darwin" || process.platform === "win32" && process.arch === "x64"
        }
    }, {
        id: "web-app",
        content: async () => "Run tasks in the cloud while you keep coding locally · clau.de/web",
        cooldownSessions: 15,
        isRelevant: async () => !0
    }, {
        id: "mobile-app",
        content: async () => "/mobile to use Claude Code from the Claude app on your phone",
        cooldownSessions: 15,
        isRelevant: async () => !0
    }, {
        id: "opusplan-mode-reminder",
        content: async () => `Your default model setting is Opus Plan Mode. Press ${PX("chat:cycleMode","Chat","shift+tab")} twice to activate Plan Mode and plan with Claude Opus.`,
        cooldownSessions: 2,
        async isRelevant() {
            let A = X1(),
                K = uR() === "opusplan",
                Y = A.lastPlanModeUse ? (Date.now() - A.lastPlanModeUse) / 86400000 : 1 / 0;
            return K && Y > 3
        }
    }, {
        id: "frontend-design-plugin",
        content: async (A) => {
            let q = await mjz(),
                K = kA("suggestion", A.theme);
            if (!q) return `Working with HTML/CSS? Add the frontend-design plugin:
${K("/plugin marketplace add anthropics/claude-code")}
${K("/plugin install frontend-design@claude-code-plugins")}`;
            return `Working with HTML/CSS? Install the frontend-design plugin:
${K("/plugin install frontend-design@claude-code-plugins")}`
        },
        cooldownSessions: 3,
        async isRelevant(A) {
            if (iB("frontend-design@claude-code-plugins")) return !1;
            if (!A?.readFileState) return !1;
            return jB(A.readFileState).some((K) => /\.(html|css|htm)$/i.test(K))
        }
    }, {
        id: "guest-passes",
        content: async (A) => {
            let q = kA("claude", A.theme),
                K = b16();
            return K ? `Share Claude Code and earn ${q(I16(K))} of extra usage · ${q("/passes")}` : `You have free guest passes to share · ${q("/passes")}`
        },
        cooldownSessions: 3,
        isRelevant: async () => {
            if (X1().hasVisitedPasses) return !1;
            let {
                eligible: q
            } = HN6();
            return q
        }
    }, {
        id: "feedback-command",
        content: async () => "Use /feedback to help us improve!",
        cooldownSessions: 15,
        async isRelevant() {
            return X1().numStartups > 5
        }
    }], gjz = []
})
// @from(Ln 467371, Col 0)
function Ca8(A, q = process.argv) {
    for (let K = 0; K < q.length; K++) {
        let Y = q[K];
        if (Y?.startsWith(`${A}=`)) return Y.slice(A.length + 1);
        if (Y === A && K + 1 < q.length) return q[K + 1]
    }
    return
}
// @from(Ln 467383, Col 0)
function Qjz(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (K?.type !== "assistant") continue;
        let Y = K.message.content.find((w) => w.type === "tool_use" && w.name === MB);
        if (!Y || Y.type !== "tool_use") continue;
        let z = Y.input;
        if (z === null || typeof z !== "object") return [];
        let _ = y06().safeParse(z.todos);
        return _.success ? _.data : []
    }
    return []
}
// @from(Ln 467397, Col 0)
function co6(A, q) {
    if (A.fileHistorySnapshots && A.fileHistorySnapshots.length > 0) qV1(A.fileHistorySnapshots, (K) => {
        q((Y) => ({
            ...Y,
            fileHistory: K
        }))
    });
    if (!r$() && A.messages && A.messages.length > 0) {
        let K = Qjz(A.messages);
        if (K.length > 0) {
            let Y = R1();
            q((z) => ({
                ...z,
                todos: {
                    ...z.todos,
                    [Y]: K
                }
            }))
        }
    }
}
// @from(Ln 467419, Col 0)
function Ujz(A) {
    return
}
// @from(Ln 467423, Col 0)
function lo6(A, q) {
    if (!A && !q) return;
    return {
        name: A ?? "",
        color: q === "default" ? void 0 : q
    }
}
// @from(Ln 467431, Col 0)
function K26(A, q, K) {
    if (q) return {
        agentDefinition: q,
        agentType: void 0
    };
    if (!A) return Wp(void 0), {
        agentDefinition: void 0,
        agentType: void 0
    };
    let Y = K.activeAgents.find((z) => z.agentType === A);
    if (!Y) return k(`Resumed session had agent "${A}" but it is no longer available. Using default behavior.`), Wp(void 0), {
        agentDefinition: void 0,
        agentType: void 0
    };
    if (Wp(Y.agentType), !HS() && Y.model && Y.model !== "inherit") MW(H5(Y.model));
    return {
        agentDefinition: Y,
        agentType: Y.agentType
    }
}
// @from(Ln 467451, Col 0)
async function djz(A, q, K, Y) {
    return Y
}
// @from(Ln 467454, Col 0)
async function Ia8(A, q, K) {
    let Y;
    if (!q.forkSession) {
        let H = q.sessionIdOverride ?? A.sessionId;
        if (H) _P(eJ(H), q.transcriptPath ? pjz(q.transcriptPath) : null), await Qo6(), await Zh(), r21(H)
    } else if (A.contentReplacements?.length) await pz6(A.contentReplacements);
    if (LF(A), !q.forkSession) $r8();
    let {
        agentDefinition: z,
        agentType: _
    } = K26(A.agentSetting, K.mainThreadAgentDefinition, K.agentDefinitions), w = q.includeAttribution ? Ujz(A) : void 0, O = lo6(A.agentName, A.agentColor), $ = await djz(!!Y, K.currentCwd, K.cliAgents, K.agentDefinitions);
    return {
        messages: A.messages,
        fileHistorySnapshots: A.fileHistorySnapshots,
        contentReplacements: A.contentReplacements,
        agentName: A.agentName,
        agentColor: A.agentColor === "default" ? void 0 : A.agentColor,
        restoredAgentDef: z,
        initialState: {
            ...K.initialState,
            ..._ && {
                agent: _
            },
            ...w && {
                attribution: w
            },
            ...O && {
                standaloneAgentContext: O
            },
            agentDefinitions: $
        }
    }
}
// @from(Ln 467487, Col 4)
io6 = E(() => {
    tf8();
    Bw();
    J0();
    JN();
    xd();
    H1();
    T1();
    JA();
    Uo6();
    $k();
    Oq();
    z4()
})
// @from(Ln 467501, Col 4)
cjz
// @from(Ln 467502, Col 4)
_yq = E(() => {
    t46();
    cjz = F6(() => K4.object({
        session_id: K4.string(),
        ws_url: K4.string(),
        work_dir: K4.string().optional()
    }))
})
// @from(Ln 467510, Col 4)
wyq = E(() => {
    g1();
    _yq();
    s8()
})
// @from(Ln 467516, Col 0)
function Oyq() {
    let A = X1();
    if (A.autoUpdates !== !1 || A.autoUpdatesProtectedForNative === !0) return;
    try {
        let q = L8("userSettings") || {};
        TA("userSettings", {
            ...q,
            env: {
                ...q.env,
                DISABLE_AUTOUPDATER: "1"
            }
        }), d("tengu_migrate_autoupdates_to_settings", {
            was_user_preference: !0,
            already_had_env_var: !!q.env?.DISABLE_AUTOUPDATER
        }), process.env.DISABLE_AUTOUPDATER = "1", d1((K) => {
            let {
                autoUpdates: Y,
                autoUpdatesProtectedForNative: z,
                ..._
            } = K;
            return _
        })
    } catch (q) {
        _6(Error(`Failed to migrate auto-updates: ${q}`)), d("tengu_migrate_autoupdates_error", {
            has_error: !0
        })
    }
}
// @from(Ln 467544, Col 4)
$yq = E(() => {
    k8();
    i8();
    V1();
    k1()
})
// @from(Ln 467551, Col 0)
function Hyq() {
    if (!X1().bypassPermissionsModeAccepted) return;
    try {
        if (!OZ6()) TA("userSettings", {
            skipDangerousModePermissionPrompt: !0
        });
        d("tengu_migrate_bypass_permissions_accepted", {}), d1((q) => {
            if (!("bypassPermissionsModeAccepted" in q)) return q;
            let {
                bypassPermissionsModeAccepted: K,
                ...Y
            } = q;
            return Y
        })
    } catch (q) {
        _6(Error(`Failed to migrate bypass permissions accepted: ${q}`))
    }
}
// @from(Ln 467569, Col 4)
jyq = E(() => {
    k8();
    i8();
    V1();
    k1()
})
// @from(Ln 467576, Col 0)
function Jyq() {
    let A = d2(),
        q = A.enableAllProjectMcpServers !== void 0,
        K = A.enabledMcpjsonServers && A.enabledMcpjsonServers.length > 0,
        Y = A.disabledMcpjsonServers && A.disabledMcpjsonServers.length > 0;
    if (!q && !K && !Y) return;
    try {
        let z = L8("localSettings") || {},
            _ = {},
            w = [];
        if (q && z.enableAllProjectMcpServers === void 0) _.enableAllProjectMcpServers = A.enableAllProjectMcpServers, w.push("enableAllProjectMcpServers");
        else if (q) w.push("enableAllProjectMcpServers");
        if (K && A.enabledMcpjsonServers) {
            let O = z.enabledMcpjsonServers || [];
            _.enabledMcpjsonServers = [...new Set([...O, ...A.enabledMcpjsonServers])], w.push("enabledMcpjsonServers")
        }
        if (Y && A.disabledMcpjsonServers) {
            let O = z.disabledMcpjsonServers || [];
            _.disabledMcpjsonServers = [...new Set([...O, ...A.disabledMcpjsonServers])], w.push("disabledMcpjsonServers")
        }
        if (Object.keys(_).length > 0) TA("localSettings", _);
        if (w.includes("enableAllProjectMcpServers") || w.includes("enabledMcpjsonServers") || w.includes("disabledMcpjsonServers")) c2((O) => {
            let {
                enableAllProjectMcpServers: $,
                enabledMcpjsonServers: H,
                disabledMcpjsonServers: j,
                ...J
            } = O;
            return J
        });
        d("tengu_migrate_mcp_approval_fields_success", {
            migratedCount: w.length
        })
    } catch {
        d("tengu_migrate_mcp_approval_fields_error", {})
    }
}
// @from(Ln 467613, Col 4)
Myq = E(() => {
    k8();
    i8();
    V1()
})
// @from(Ln 467618, Col 4)
Dyq = E(() => {
    i8()
})
// @from(Ln 467622, Col 0)
function Xyq() {
    if (QA() !== "firstParty") return;
    if (!IS1()) return;
    let A = L8("userSettings")?.model;
    if (A !== "claude-opus-4-20250514" && A !== "claude-opus-4-1-20250805" && A !== "claude-opus-4-0" && A !== "claude-opus-4-1") return;
    TA("userSettings", {
        model: "opus"
    }), d1((q) => ({
        ...q,
        legacyOpusMigrationTimestamp: Date.now()
    })), d("tengu_legacy_opus_migration", {
        from_model: A
    })
}
// @from(Ln 467636, Col 4)
Pyq = E(() => {
    k8();
    i8();
    Nz();
    z4();
    V1()
})
// @from(Ln 467644, Col 0)
function Wyq() {
    d1((A) => {
        let q = A.replBridgeEnabled;
        if (q === void 0) return A;
        if (A.remoteControlAtStartup !== void 0) return A;
        let K = {
            ...A,
            remoteControlAtStartup: Boolean(q)
        };
        return delete K.replBridgeEnabled, K
    })
}
// @from(Ln 467656, Col 4)
Zyq = E(() => {
    k8()
})
// @from(Ln 467660, Col 0)
function Gyq() {
    if (X1().hasResetAutoModeOptInForDefaultOffer) return;
    if (J16() !== "enabled") return;
    try {
        let q = L8("userSettings");
        if (q?.skipAutoPermissionPrompt && q?.permissions?.defaultMode !== "auto") TA("userSettings", {
            skipAutoPermissionPrompt: void 0
        }), d("tengu_migrate_reset_auto_opt_in_for_default_offer", {});
        d1((K) => {
            if (K.hasResetAutoModeOptInForDefaultOffer) return K;
            return {
                ...K,
                hasResetAutoModeOptInForDefaultOffer: !0
            }
        })
    } catch (q) {
        _6(Error(`Failed to reset auto mode opt-in: ${q}`))
    }
}
// @from(Ln 467679, Col 4)
fyq = E(() => {
    k8();
    i8();
    rJ();
    V1();
    k1()
})
// @from(Ln 467687, Col 0)
function Tyq() {
    if (X1().sonnet1m45MigrationComplete) return;
    if (L8("userSettings")?.model === "sonnet[1m]") TA("userSettings", {
        model: "sonnet-4-5-20250929[1m]"
    });
    if (HS() === "sonnet[1m]") MW("sonnet-4-5-20250929[1m]");
    d1((Y) => ({
        ...Y,
        sonnet1m45MigrationComplete: !0
    }))
}
// @from(Ln 467698, Col 4)
vyq = E(() => {
    k8();
    i8();
    T1()
})
// @from(Ln 467704, Col 0)
function Nyq() {
    if (QA() !== "firstParty") return;
    if (!LC() && !RL() && !t66()) return;
    let A = L8("userSettings")?.model;
    if (A !== "claude-sonnet-4-5-20250929" && A !== "claude-sonnet-4-5-20250929[1m]" && A !== "sonnet-4-5-20250929" && A !== "sonnet-4-5-20250929[1m]") return;
    let q = A.endsWith("[1m]");
    if (TA("userSettings", {
            model: q ? "sonnet[1m]" : "sonnet"
        }), X1().numStartups > 1) d1((Y) => ({
        ...Y,
        sonnet45To46MigrationTimestamp: Date.now()
    }));
    d("tengu_sonnet45_to_46_migration", {
        from_model: A,
        has_1m: q
    })
}
// @from(Ln 467721, Col 4)
Vyq = E(() => {
    k8();
    i8();
    Nz();
    fA();
    V1()
})
// @from(Ln 467729, Col 0)
function kyq() {
    if (!pH()) return;
    if (L8("userSettings")?.model !== "opus") return;
    let q = "opus[1m]",
        K = H5(q) === H5(Mv()) ? void 0 : q;
    TA("userSettings", {
        model: K
    }), d("tengu_opus_to_opus1m_migration", {})
}
// @from(Ln 467738, Col 4)
Eyq = E(() => {
    i8();
    V1();
    z4()
})
// @from(Ln 467744, Col 0)
function yyq() {
    if (X1().opusProMigrationComplete) return;
    if (QA() !== "firstParty" || !LC()) {
        d1((Y) => ({
            ...Y,
            opusProMigrationComplete: !0
        })), d("tengu_reset_pro_to_opus_default", {
            skipped: !0
        });
        return
    }
    if (PA()?.model === void 0) {
        let Y = Date.now();
        d1((z) => ({
            ...z,
            opusProMigrationComplete: !0,
            opusProMigrationTimestamp: Y
        })), d("tengu_reset_pro_to_opus_default", {
            skipped: !1,
            had_custom_model: !1
        })
    } else d1((Y) => ({
        ...Y,
        opusProMigrationComplete: !0
    })), d("tengu_reset_pro_to_opus_default", {
        skipped: !1,
        had_custom_model: !0
    })
}
// @from(Ln 467773, Col 4)
Lyq = E(() => {
    k8();
    i8();
    Nz();
    fA();
    V1()
})
// @from(Ln 467781, Col 0)
function ljz(A) {
    return A.type !== "control_request" && A.type !== "control_response"
}
// @from(Ln 467784, Col 0)
class ba8 {
    config;
    callbacks;
    websocket = null;
    pendingPermissionRequests = new Map;
    constructor(A, q) {
        this.config = A;
        this.callbacks = q
    }
    connect() {
        k(`[RemoteSessionManager] Connecting to session ${this.config.sessionId}`);
        let A = {
            onMessage: (q) => this.handleMessage(q),
            onConnected: () => {
                k("[RemoteSessionManager] Connected"), this.callbacks.onConnected?.()
            },
            onClose: () => {
                k("[RemoteSessionManager] Disconnected"), this.callbacks.onDisconnected?.()
            },
            onError: (q) => {
                _6(q), this.callbacks.onError?.(q)
            }
        };
        this.websocket = new Dl6(this.config.sessionId, this.config.orgUuid, this.config.accessToken, A), this.websocket.connect()
    }
    handleMessage(A) {
        if (A.type === "control_request") {
            this.handleControlRequest(A);
            return
        }
        if (A.type === "control_response") {
            k("[RemoteSessionManager] Received control response");
            return
        }
        if (ljz(A)) this.callbacks.onMessage(A)
    }
    handleControlRequest(A) {
        let {
            request_id: q,
            request: K
        } = A;
        if (K.subtype === "can_use_tool") k(`[RemoteSessionManager] Permission request for tool: ${K.tool_name}`), this.pendingPermissionRequests.set(q, K), this.callbacks.onPermissionRequest(K, q);
        else {
            k(`[RemoteSessionManager] Unsupported control request subtype: ${K.subtype}`);
            let Y = {
                type: "control_response",
                response: {
                    subtype: "error",
                    request_id: q,
                    error: `Unsupported control request subtype: ${K.subtype}`
                }
            };
            this.websocket?.sendControlResponse(Y)
        }
    }
    async sendMessage(A, q) {
        k(`[RemoteSessionManager] Sending message to session ${this.config.sessionId}`);
        let K = await eb8(this.config.sessionId, A, q);
        if (!K) _6(Error(`[RemoteSessionManager] Failed to send message to session ${this.config.sessionId}`));
        return K
    }
    respondToPermissionRequest(A, q) {
        if (!this.pendingPermissionRequests.get(A)) {
            _6(Error(`[RemoteSessionManager] No pending permission request with ID: ${A}`));
            return
        }
        this.pendingPermissionRequests.delete(A);
        let Y = {
            type: "control_response",
            response: {
                subtype: "success",
                request_id: A,
                response: {
                    behavior: q.behavior,
                    ...q.behavior === "allow" ? {
                        updatedInput: q.updatedInput
                    } : {
                        message: q.message
                    }
                }
            }
        };
        k(`[RemoteSessionManager] Sending permission response: ${q.behavior}`), this.websocket?.sendControlResponse(Y)
    }
    isConnected() {
        return this.websocket?.isConnected() ?? !1
    }
    cancelSession() {
        k("[RemoteSessionManager] Sending interrupt signal"), this.websocket?.sendControlRequest({
            subtype: "interrupt"
        })
    }
    getSessionId() {
        return this.config.sessionId
    }
    disconnect() {
        k("[RemoteSessionManager] Disconnecting"), this.websocket?.close(), this.websocket = null, this.pendingPermissionRequests.clear()
    }
    reconnect() {
        k("[RemoteSessionManager] Reconnecting WebSocket"), this.websocket?.reconnect()
    }
}
// @from(Ln 467887, Col 0)
function Ryq(A, q, K, Y = !1, z = !1) {
    return {
        sessionId: A,
        accessToken: q,
        orgUuid: K,
        hasInitialPrompt: Y,
        viewerOnly: z
    }
}
// @from(Ln 467896, Col 4)
xa8 = E(() => {
    H1();
    k1();
    Km8();
    EZ()
})
// @from(Ln 467906, Col 0)
function ijz() {
    return w8("tengu_session_memory", !1)
}
// @from(Ln 467910, Col 0)
function njz() {
    return mf("tengu_sm_config", {})
}