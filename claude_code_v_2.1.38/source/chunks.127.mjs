
// @from(Ln 315489, Col 0)
async function NvA(A, q) {
    if (!f6().hasVisitedExtraUsage) jA(($) => ({
        ...$,
        hasVisitedExtraUsage: !0
    }));
    let K = dK(),
        Y = K === "team" || K === "enterprise",
        z = iu(),
        w = u3()?.hasExtraUsageEnabled === !0;
    if (!z && Y) {
        try {
            let $ = await FI4("limit_increase", ["pending", "dismissed"]);
            if ($ && $.length > 0) return A("You have already submitted a request for extra usage to your admin."), null
        } catch ($) {
            K1($)
        }
        try {
            return await mI4({
                request_type: "limit_increase",
                details: null
            }), A(w ? "Request sent to your admin to increase extra usage." : "Request sent to your admin to enable extra usage."), null
        } catch ($) {
            K1($)
        }
        return A("Please contact your admin to manage extra usage settings."), null
    }
    let H = Y ? "https://claude.ai/admin-settings/usage" : "https://claude.ai/settings/usage";
    try {
        return await zY(H), gI4.default.createElement(QP1, {
            startingMessage: "Starting new login following /extra-usage. Exit with Ctrl-C to use existing account.",
            onDone: ($) => {
                q.onChangeAPIKey(), A($ ? "Login successful" : "Login interrupted")
            }
        })
    } catch ($) {
        K1($), A(`Failed to open browser. Please visit ${H} to see your extra usage.`)
    }
    return null
}
// @from(Ln 315528, Col 4)
gI4
// @from(Ln 315529, Col 4)
TvA = v(() => {
    y6();
    J7();
    Oj();
    _M6();
    cA();
    QI4();
    gI4 = o(X1(), 1)
})
// @from(Ln 315538, Col 4)
FGY
// @from(Ln 315538, Col 9)
os
// @from(Ln 315539, Col 4)
YQ1 = v(() => {
    J7();
    FGY = {
        type: "local-jsx",
        name: "extra-usage",
        description: "Configure extra usage to keep working when limits are hit",
        isEnabled: () => {
            if (process.env.DISABLE_EXTRA_USAGE_COMMAND) return !1;
            if (!dC()) return !1;
            return !0
        },
        isHidden: !1,
        load: () => Promise.resolve().then(() => (TvA(), UI4)),
        userFacingName() {
            return "extra-usage"
        }
    }, os = FGY
})
// @from(Ln 315558, Col 0)
function QGY({
    shouldShowUpsell: A,
    isMax20x: q,
    isExtraUsageCommandEnabled: K,
    shouldAutoOpenRateLimitOptionsMenu: Y,
    isTeamOrEnterprise: z,
    hasBillingAccess: w
}) {
    if (!A) return null;
    if (q) {
        if (K) return "/extra-usage to finish what you’re working on.";
        return "/login to switch to an API usage-billed account."
    }
    if (Y) return "Opening your options…";
    if (!z && !K) return "/upgrade to increase your usage limit.";
    if (z) {
        if (!K) return null;
        if (w) return "/extra-usage to finish what you’re working on.";
        return "/extra-usage to request more usage from your admin."
    }
    return "/upgrade or /extra-usage to finish what you’re working on."
}
// @from(Ln 315581, Col 0)
function pI4(A) {
    let q = e(16),
        {
            text: K,
            onOpenRateLimitOptions: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = dK(), q[0] = z;
    else z = q[0];
    let w = z,
        H;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) H = Sn(), q[1] = H;
    else H = q[1];
    let $ = H,
        O = w === "team" || w === "enterprise",
        _ = $ === "default_claude_max_20x",
        J;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) J = jH1() || i8(), q[2] = J;
    else J = q[2];
    let X = J,
        D = X && !_,
        [j, M] = XM6.useState(!1),
        P = Eo(),
        W = P.status === "rejected" && P.resetsAt !== void 0,
        G = D && !j && W && Y,
        f, Z;
    if (q[3] !== Y || q[4] !== G) f = () => {
        if (G) M(!0), Y()
    }, Z = [G, Y], q[3] = Y, q[4] = G, q[5] = f, q[6] = Z;
    else f = q[5], Z = q[6];
    XM6.useEffect(f, Z);
    let N;
    A: {
        let S;
        if (q[7] !== G) S = QGY({
            shouldShowUpsell: X,
            isMax20x: _,
            isExtraUsageCommandEnabled: os.isEnabled(),
            shouldAutoOpenRateLimitOptionsMenu: !!G,
            isTeamOrEnterprise: O,
            hasBillingAccess: iu()
        }),
        q[7] = G,
        q[8] = S;
        else S = q[8];
        let m = S;
        if (!m) {
            N = null;
            break A
        }
        let b;
        if (q[9] !== m) b = zQ1.default.createElement(V, {
            dimColor: !0
        }, m),
        q[9] = m,
        q[10] = b;
        else b = q[10];N = b
    }
    let T = N,
        k;
    if (q[11] !== K) k = zQ1.default.createElement(V, {
        color: "error"
    }, K), q[11] = K, q[12] = k;
    else k = q[12];
    let y = j ? null : T,
        B;
    if (q[13] !== k || q[14] !== y) B = zQ1.default.createElement(HA, null, zQ1.default.createElement(I, {
        flexDirection: "column"
    }, k, y)), q[13] = k, q[14] = y, q[15] = B;
    else B = q[15];
    return B
}
// @from(Ln 315653, Col 4)
zQ1
// @from(Ln 315653, Col 9)
XM6
// @from(Ln 315654, Col 4)
dI4 = v(() => {
    i1();
    J7();
    qx1();
    m1();
    eq();
    YQ1();
    cA();
    nu();
    zQ1 = o(X1(), 1), XM6 = o(X1(), 1)
})
// @from(Ln 315666, Col 0)
function gGY() {
    let A = e(2),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = _$8(), A[0] = q;
    else q = A[0];
    let K = q,
        Y;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) Y = rY.default.createElement(HA, null, rY.default.createElement(I, {
        flexDirection: "column"
    }, rY.default.createElement(V, {
        color: "error"
    }, M26), K && rY.default.createElement(V, {
        dimColor: !0
    }, "· Run in another terminal: security unlock-keychain"))), A[1] = Y;
    else Y = A[1];
    return Y
}
// @from(Ln 315684, Col 0)
function cI4(A) {
    let q = e(25),
        {
            param: K,
            addMargin: Y,
            shouldShowDot: z,
            onOpenRateLimitOptions: w
        } = A,
        {
            text: H
        } = K;
    if (DM6(H)) return null;
    if (PV7(H)) {
        let $;
        if (q[0] !== w || q[1] !== H) $ = rY.default.createElement(pI4, {
            text: H,
            onOpenRateLimitOptions: w
        }), q[0] = w, q[1] = H, q[2] = $;
        else $ = q[2];
        return $
    }
    switch (H) {
        case Kq1:
            return null;
        case dU: {
            let $;
            if (q[3] === Symbol.for("react.memo_cache_sentinel")) $ = oK1("warning"), q[3] = $;
            else $ = q[3];
            let O = $,
                _;
            if (q[4] === Symbol.for("react.memo_cache_sentinel")) _ = rY.default.createElement(HA, {
                height: 1
            }, rY.default.createElement(V, {
                color: "error"
            }, "Context limit reached · /compact or /clear to continue", O ? ` · ${O}` : "")), q[4] = _;
            else _ = q[4];
            return _
        }
        case j26: {
            let $;
            if (q[5] === Symbol.for("react.memo_cache_sentinel")) $ = rY.default.createElement(HA, {
                height: 1
            }, rY.default.createElement(V, {
                color: "error"
            }, "Credit balance too low · Add funds: https://platform.claude.com/settings/billing")), q[5] = $;
            else $ = q[5];
            return $
        }
        case M26: {
            let $;
            if (q[6] === Symbol.for("react.memo_cache_sentinel")) $ = rY.default.createElement(gGY, null), q[6] = $;
            else $ = q[6];
            return $
        }
        case P26: {
            let $;
            if (q[7] === Symbol.for("react.memo_cache_sentinel")) $ = rY.default.createElement(HA, {
                height: 1
            }, rY.default.createElement(V, {
                color: "error"
            }, P26)), q[7] = $;
            else $ = q[7];
            return $
        }
        case W26: {
            let $;
            if (q[8] === Symbol.for("react.memo_cache_sentinel")) $ = rY.default.createElement(HA, {
                height: 1
            }, rY.default.createElement(V, {
                color: "error"
            }, W26)), q[8] = $;
            else $ = q[8];
            return $
        }
        case G26: {
            let $;
            if (q[9] === Symbol.for("react.memo_cache_sentinel")) $ = rY.default.createElement(HA, {
                height: 1
            }, rY.default.createElement(V, {
                color: "error"
            }, G26, process.env.API_TIMEOUT_MS && rY.default.createElement(rY.default.Fragment, null, " ", "(API_TIMEOUT_MS=", process.env.API_TIMEOUT_MS, "ms, try increasing it)"))), q[9] = $;
            else $ = q[9];
            return $
        }
        case qq1: {
            let $;
            if (q[10] === Symbol.for("react.memo_cache_sentinel")) $ = rY.default.createElement(V, {
                color: "error"
            }, "We are experiencing high demand for Opus 4."), q[10] = $;
            else $ = q[10];
            let O;
            if (q[11] === Symbol.for("react.memo_cache_sentinel")) O = rY.default.createElement(HA, null, rY.default.createElement(I, {
                flexDirection: "column",
                gap: 1
            }, $, rY.default.createElement(V, null, "To continue immediately, use /model to switch to", " ", dG(jL()), " and continue coding."))), q[11] = O;
            else O = q[11];
            return O
        }
        case e31: {
            let $;
            if (q[12] === Symbol.for("react.memo_cache_sentinel")) $ = rY.default.createElement(HA, {
                height: 1
            }, rY.default.createElement(MB, null)), q[12] = $;
            else $ = q[12];
            return $
        }
        default: {
            if (H.startsWith(QO)) {
                let D = H === QO ? `${QO}: Please wait a moment and try again.` : H,
                    j;
                if (q[13] !== D) j = rY.default.createElement(HA, null, rY.default.createElement(V, {
                    color: "error"
                }, D)), q[13] = D, q[14] = j;
                else j = q[14];
                return j
            }
            let $ = Y ? 1 : 0,
                O;
            if (q[15] !== z) O = z && rY.default.createElement(I, {
                minWidth: 2
            }, rY.default.createElement(V, {
                color: "text"
            }, gY)), q[15] = z, q[16] = O;
            else O = q[16];
            let _;
            if (q[17] !== H) _ = rY.default.createElement(I, {
                flexDirection: "column"
            }, rY.default.createElement(TJ, null, H)), q[17] = H, q[18] = _;
            else _ = q[18];
            let J;
            if (q[19] !== O || q[20] !== _) J = rY.default.createElement(I, {
                flexDirection: "row"
            }, O, _), q[19] = O, q[20] = _, q[21] = J;
            else J = q[21];
            let X;
            if (q[22] !== $ || q[23] !== J) X = rY.default.createElement(I, {
                alignItems: "flex-start",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: $,
                width: "100%"
            }, J), q[22] = $, q[23] = J, q[24] = X;
            else X = q[24];
            return X
        }
    }
}
// @from(Ln 315831, Col 4)
rY
// @from(Ln 315832, Col 4)
lI4 = v(() => {
    i1();
    m1();
    AB();
    N8();
    jW();
    uh();
    eq();
    e7();
    XX6();
    vd();
    Y01();
    NHA();
    Uv1();
    dI4();
    rY = o(X1(), 1)
})
// @from(Ln 315850, Col 0)
function jM6(A) {
    let q = e(8),
        {
            param: K,
            addMargin: Y
        } = A,
        {
            text: z
        } = K,
        w;
    if (q[0] !== z) w = C4(z, "bash-input"), q[0] = z, q[1] = w;
    else w = q[1];
    let H = w;
    if (!H) return null;
    let $ = Y ? 1 : 0,
        O;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) O = Ed.createElement(V, {
        backgroundColor: "bashMessageBackgroundColor",
        color: "bashBorder"
    }, "!"), q[2] = O;
    else O = q[2];
    let _;
    if (q[3] !== H) _ = Ed.createElement(I, null, O, Ed.createElement(V, {
        backgroundColor: "bashMessageBackgroundColor",
        color: "text"
    }, " ", H, " ")), q[3] = H, q[4] = _;
    else _ = q[4];
    let J;
    if (q[5] !== $ || q[6] !== _) J = Ed.createElement(I, {
        flexDirection: "column",
        marginTop: $,
        width: "100%"
    }, _), q[5] = $, q[6] = _, q[7] = J;
    else J = q[7];
    return J
}
// @from(Ln 315886, Col 4)
Ed
// @from(Ln 315887, Col 4)
vvA = v(() => {
    i1();
    m1();
    N8();
    Ed = o(X1(), 1)
})
// @from(Ln 315894, Col 0)
function iI4(A) {
    let q = e(19),
        {
            addMargin: K,
            param: Y
        } = A,
        {
            text: z
        } = Y,
        w;
    if (q[0] !== z) w = C4(z, pP), q[0] = z, q[1] = w;
    else w = q[1];
    let H = w,
        $;
    if (q[2] !== z) $ = C4(z, "command-args"), q[2] = z, q[3] = $;
    else $ = q[3];
    let O = $,
        _ = C4(z, "skill-format") === "true";
    if (!H) return null;
    if (_) {
        let W = K ? 1 : 0,
            G;
        if (q[4] === Symbol.for("react.memo_cache_sentinel")) G = YP.createElement(V, {
            color: "subtle"
        }, l1.pointer, " "), q[4] = G;
        else G = q[4];
        let f;
        if (q[5] !== H) f = YP.createElement(V, {
            backgroundColor: "userMessageBackground"
        }, G, YP.createElement(V, {
            color: "text"
        }, "Skill(", H, ") ")), q[5] = H, q[6] = f;
        else f = q[6];
        let Z;
        if (q[7] !== W || q[8] !== f) Z = YP.createElement(I, {
            flexDirection: "column",
            marginTop: W,
            width: "100%"
        }, f), q[7] = W, q[8] = f, q[9] = Z;
        else Z = q[9];
        return Z
    }
    let J;
    if (q[10] !== O || q[11] !== H) J = [H, O].filter(Boolean), q[10] = O, q[11] = H, q[12] = J;
    else J = q[12];
    let X = `/${J.join(" ")}`,
        D = K ? 1 : 0,
        j;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) j = YP.createElement(V, {
        color: "subtle"
    }, l1.pointer, " "), q[13] = j;
    else j = q[13];
    let M;
    if (q[14] !== X) M = YP.createElement(V, {
        backgroundColor: "userMessageBackground"
    }, j, YP.createElement(V, {
        color: "text"
    }, X, " ")), q[14] = X, q[15] = M;
    else M = q[15];
    let P;
    if (q[16] !== D || q[17] !== M) P = YP.createElement(I, {
        flexDirection: "column",
        marginTop: D,
        width: "100%"
    }, M), q[16] = D, q[17] = M, q[18] = P;
    else P = q[18];
    return P
}
// @from(Ln 315962, Col 4)
YP
// @from(Ln 315963, Col 4)
nI4 = v(() => {
    i1();
    b7();
    m1();
    N8();
    vz();
    YP = o(X1(), 1)
})
// @from(Ln 315972, Col 0)
function rI4(A, q, K) {
    return A.split(`
`).map((z, w) => {
        let H = w === 0 ? "" : " ".repeat(q),
            O = Math.max(0, K - (w === 0 ? q : 0) - H.length - UA(z) - 1);
        return H + z + " ".repeat(O) + " "
    }).join(`
`)
}
// @from(Ln 315981, Col 4)
oI4 = v(() => {
    LY()
})
// @from(Ln 315985, Col 0)
function sI4(A) {
    let q = e(7),
        {
            text: K
        } = A,
        {
            columns: Y
        } = Z8(),
        z = Y - 4,
        w = z - aI4 - 1,
        H;
    if (q[0] !== z || q[1] !== w || q[2] !== K) {
        let J = TV(K, w, "wrap");
        H = J.includes(`
`) ? rI4(J, aI4, z) : J + " ", q[0] = z, q[1] = w, q[2] = K, q[3] = H
    } else H = q[3];
    let $ = H,
        O;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) O = A51.createElement(V, {
        color: "subtle"
    }, l1.pointer, " "), q[4] = O;
    else O = q[4];
    let _;
    if (q[5] !== $) _ = A51.createElement(V, {
        backgroundColor: "userMessageBackground"
    }, O, A51.createElement(V, {
        color: "text"
    }, $)), q[5] = $, q[6] = _;
    else _ = q[6];
    return _
}
// @from(Ln 316016, Col 4)
A51
// @from(Ln 316016, Col 9)
aI4 = 2
// @from(Ln 316017, Col 4)
tI4 = v(() => {
    i1();
    b7();
    m1();
    mq();
    oI4();
    A51 = o(X1(), 1)
})
// @from(Ln 316026, Col 0)
function eI4(A) {
    let q = e(7),
        {
            addMargin: K,
            param: Y,
            thinkingMetadata: z
        } = A,
        {
            text: w
        } = Y,
        {
            columns: H
        } = Z8();
    if (!w) return K1(Error("No content found in user prompt message")), null;
    let $ = K ? 1 : 0,
        O = H - 4,
        _;
    if (q[0] !== w || q[1] !== z) _ = EvA.default.createElement(sI4, {
        text: w,
        thinkingMetadata: z
    }), q[0] = w, q[1] = z, q[2] = _;
    else _ = q[2];
    let J;
    if (q[3] !== $ || q[4] !== O || q[5] !== _) J = EvA.default.createElement(I, {
        flexDirection: "column",
        marginTop: $,
        width: O
    }, _), q[3] = $, q[4] = O, q[5] = _, q[6] = J;
    else J = q[6];
    return J
}
// @from(Ln 316057, Col 4)
EvA
// @from(Ln 316058, Col 4)
Ax4 = v(() => {
    i1();
    m1();
    y6();
    mq();
    tI4();
    EvA = o(X1(), 1)
})
// @from(Ln 316066, Col 4)
iv = "(no content)"