
// @from(Ln 387457, Col 0)
function jn6(A) {
    let q = A6(13),
        {
            ratio: K,
            width: Y,
            fillColor: z,
            emptyColor: _
        } = A,
        w = Math.min(1, Math.max(0, K)),
        O = Math.floor(w * Y),
        $;
    if (q[0] !== O) $ = Hn6[Hn6.length - 1].repeat(O), q[0] = O, q[1] = $;
    else $ = q[1];
    let H;
    if (q[2] !== w || q[3] !== $ || q[4] !== O || q[5] !== Y) {
        if (H = [$], O < Y) {
            let M = w * Y - O,
                D = Math.floor(M * Hn6.length);
            H.push(Hn6[D]);
            let X = Y - O - 1;
            if (X > 0) {
                let P;
                if (q[7] !== X) P = Hn6[0].repeat(X), q[7] = X, q[8] = P;
                else P = q[8];
                H.push(P)
            }
        }
        q[2] = w, q[3] = $, q[4] = O, q[5] = Y, q[6] = H
    } else H = q[6];
    let j = H.join(""),
        J;
    if (q[9] !== _ || q[10] !== z || q[11] !== j) J = c9q.default.createElement(T, {
        color: z,
        backgroundColor: _
    }, j), q[9] = _, q[10] = z, q[11] = j, q[12] = J;
    else J = q[12];
    return J
}
// @from(Ln 387495, Col 4)
c9q
// @from(Ln 387495, Col 9)
Hn6
// @from(Ln 387496, Col 4)
KU8 = E(() => {
    e6();
    i6();
    c9q = t(P6(), 1), Hn6 = [" ", "▏", "▎", "▍", "▌", "▋", "▊", "▉", "█"]
})
// @from(Ln 387502, Col 0)
function l9q(A) {
    let q = A6(34),
        {
            title: K,
            limit: Y,
            maxWidth: z,
            showTimeInReset: _,
            extraSubtext: w
        } = A,
        O = _ === void 0 ? !0 : _,
        {
            utilization: $,
            resets_at: H
        } = Y;
    if ($ === null) return null;
    let j = `${Math.floor($)}% used`,
        J;
    if (H) {
        let M;
        if (q[0] !== H || q[1] !== O) M = z97(H, !0, O), q[0] = H, q[1] = O, q[2] = M;
        else M = q[2];
        J = `Resets ${M}`
    }
    if (w)
        if (J) J = `${w} · ${J}`;
        else J = w;
    if (z >= 62) {
        let M;
        if (q[3] !== K) M = x7.createElement(T, {
            bold: !0
        }, K), q[3] = K, q[4] = M;
        else M = q[4];
        let D = $ / 100,
            X;
        if (q[5] !== D) X = x7.createElement(jn6, {
            ratio: D,
            width: 50,
            fillColor: "rate_limit_fill",
            emptyColor: "rate_limit_empty"
        }), q[5] = D, q[6] = X;
        else X = q[6];
        let P;
        if (q[7] !== j) P = x7.createElement(T, null, j), q[7] = j, q[8] = P;
        else P = q[8];
        let W;
        if (q[9] !== X || q[10] !== P) W = x7.createElement(m, {
            flexDirection: "row",
            gap: 1
        }, X, P), q[9] = X, q[10] = P, q[11] = W;
        else W = q[11];
        let Z;
        if (q[12] !== J) Z = J && x7.createElement(T, {
            dimColor: !0
        }, J), q[12] = J, q[13] = Z;
        else Z = q[13];
        let G;
        if (q[14] !== M || q[15] !== W || q[16] !== Z) G = x7.createElement(m, {
            flexDirection: "column"
        }, M, W, Z), q[14] = M, q[15] = W, q[16] = Z, q[17] = G;
        else G = q[17];
        return G
    } else {
        let M;
        if (q[18] !== K) M = x7.createElement(T, {
            bold: !0
        }, K), q[18] = K, q[19] = M;
        else M = q[19];
        let D;
        if (q[20] !== J) D = J && x7.createElement(x7.Fragment, null, x7.createElement(T, null, " "), x7.createElement(T, {
            dimColor: !0
        }, "· ", J)), q[20] = J, q[21] = D;
        else D = q[21];
        let X;
        if (q[22] !== M || q[23] !== D) X = x7.createElement(T, null, M, D), q[22] = M, q[23] = D, q[24] = X;
        else X = q[24];
        let P = $ / 100,
            W;
        if (q[25] !== z || q[26] !== P) W = x7.createElement(jn6, {
            ratio: P,
            width: z,
            fillColor: "rate_limit_fill",
            emptyColor: "rate_limit_empty"
        }), q[25] = z, q[26] = P, q[27] = W;
        else W = q[27];
        let Z;
        if (q[28] !== j) Z = x7.createElement(T, null, j), q[28] = j, q[29] = Z;
        else Z = q[29];
        let G;
        if (q[30] !== X || q[31] !== W || q[32] !== Z) G = x7.createElement(m, {
            flexDirection: "column"
        }, X, W, Z), q[30] = X, q[31] = W, q[32] = Z, q[33] = G;
        else G = q[33];
        return G
    }
}
// @from(Ln 387598, Col 0)
function i9q() {
    let [A, q] = Nv6.useState(null), [K, Y] = Nv6.useState(null), [z, _] = Nv6.useState(!0), {
        columns: w
    } = KA(), O = w - 2, $ = Math.min(O, 80), H = x7.useCallback(async () => {
        _(!0), Y(null);
        try {
            let J = await U9q();
            q(J)
        } catch (J) {
            _6(J);
            let M = J,
                D = M.response?.data ? B6(M.response.data) : void 0;
            Y(D ? `Failed to load usage data: ${D}` : "Failed to load usage data")
        } finally {
            _(!1)
        }
    }, []);
    if (Nv6.useEffect(() => {
            H()
        }, [H]), D8("settings:retry", () => {
            H()
        }, {
            context: "Settings",
            isActive: !!K && !z
        }), K) return x7.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, x7.createElement(T, {
        color: "error"
    }, "Error: ", K), x7.createElement(T, {
        dimColor: !0
    }, x7.createElement(C8, null, x7.createElement(O8, {
        action: "settings:retry",
        context: "Settings",
        fallback: "r",
        description: "retry"
    }), x7.createElement(O8, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    }))));
    if (!A) return x7.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, x7.createElement(T, {
        dimColor: !0
    }, "Loading usage data…"), x7.createElement(T, {
        dimColor: !0
    }, x7.createElement(O8, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })));
    let j = [{
        title: "Current session",
        limit: A.five_hour
    }, {
        title: "Current week (all models)",
        limit: A.seven_day
    }, {
        title: "Current week (Sonnet only)",
        limit: A.seven_day_sonnet
    }];
    return x7.createElement(m, {
        flexDirection: "column",
        gap: 1,
        width: "100%"
    }, j.some(({
        limit: J
    }) => J) || x7.createElement(T, {
        dimColor: !0
    }, "/usage is only available for subscription plans."), j.map(({
        title: J,
        limit: M
    }) => M && x7.createElement(l9q, {
        key: J,
        title: J,
        limit: M,
        maxWidth: $
    })), A.extra_usage && x7.createElement(cpY, {
        extraUsage: A.extra_usage,
        maxWidth: $
    }), x7.createElement(T, {
        dimColor: !0
    }, x7.createElement(O8, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })))
}
// @from(Ln 387692, Col 0)
function cpY(A) {
    let q = A6(20),
        {
            extraUsage: K,
            maxWidth: Y
        } = A,
        z = CK();
    if (!(z === "pro" || z === "max")) return !1;
    if (!K.is_enabled) {
        if (H66.isEnabled()) {
            let f;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) f = x7.createElement(m, {
                flexDirection: "column"
            }, x7.createElement(T, {
                bold: !0
            }, YU8), x7.createElement(T, {
                dimColor: !0
            }, "Extra usage not enabled • /extra-usage to enable")), q[0] = f;
            else f = q[0];
            return f
        }
        return null
    }
    if (K.monthly_limit === null) {
        let f;
        if (q[1] === Symbol.for("react.memo_cache_sentinel")) f = x7.createElement(m, {
            flexDirection: "column"
        }, x7.createElement(T, {
            bold: !0
        }, YU8), x7.createElement(T, {
            dimColor: !0
        }, "Unlimited")), q[1] = f;
        else f = q[1];
        return f
    }
    if (typeof K.used_credits !== "number" || typeof K.utilization !== "number") return null;
    let w = K.used_credits / 100,
        O;
    if (q[2] !== w) O = gx6(w, 2), q[2] = w, q[3] = O;
    else O = q[3];
    let $ = O,
        H = K.monthly_limit / 100,
        j;
    if (q[4] !== H) j = gx6(H, 2), q[4] = H, q[5] = j;
    else j = q[5];
    let J = j,
        M, D, X, P;
    if (q[6] !== K.utilization) {
        let f = new Date,
            v = new Date(f.getFullYear(), f.getMonth() + 1, 1);
        M = l9q, P = YU8, D = K.utilization, X = v.toISOString(), q[6] = K.utilization, q[7] = M, q[8] = D, q[9] = X, q[10] = P
    } else M = q[7], D = q[8], X = q[9], P = q[10];
    let W;
    if (q[11] !== D || q[12] !== X) W = {
        utilization: D,
        resets_at: X
    }, q[11] = D, q[12] = X, q[13] = W;
    else W = q[13];
    let Z = `${$} / ${J} spent`,
        G;
    if (q[14] !== M || q[15] !== Y || q[16] !== P || q[17] !== W || q[18] !== Z) G = x7.createElement(M, {
        title: P,
        limit: W,
        showTimeInReset: !1,
        extraSubtext: Z,
        maxWidth: Y
    }), q[14] = M, q[15] = Y, q[16] = P, q[17] = W, q[18] = Z, q[19] = G;
    else G = q[19];
    return G
}
// @from(Ln 387762, Col 4)
x7
// @from(Ln 387762, Col 8)
Nv6
// @from(Ln 387762, Col 13)
YU8 = "Extra usage"
// @from(Ln 387763, Col 4)
n9q = E(() => {
    e6();
    i6();
    _q();
    d9q();
    k1();
    KU8();
    OK();
    Xq();
    _7();
    Pc6();
    $k();
    fA();
    M4();
    g1();
    x7 = t(P6(), 1), Nv6 = t(P6(), 1)
})
// @from(Ln 387781, Col 0)
function Vv6(A) {
    let q = A6(19),
        {
            onClose: K,
            context: Y,
            defaultTab: z
        } = A,
        [_, w] = Jn6.useState(z),
        [O, $] = Jn6.useState(!1),
        [H, j] = Jn6.useState(!1),
        [J, M] = Jn6.useState(!1),
        D = _ === "Config",
        X = D && J,
        P = D && H,
        W;
    if (q[0] !== K || q[1] !== O) W = () => {
        if (O) return;
        K("Status dialog dismissed", {
            display: "system"
        })
    }, q[0] = K, q[1] = O, q[2] = W;
    else W = q[2];
    let Z = W,
        G = !O && !X,
        f;
    if (q[3] !== G) f = {
        context: "Settings",
        isActive: G
    }, q[3] = G, q[4] = f;
    else f = q[4];
    D8("confirm:no", Z, f);
    let v;
    if (q[5] !== Y) v = Q0.createElement(Hw, {
        key: "status",
        title: "Status"
    }, Q0.createElement(y9q, {
        context: Y
    })), q[5] = Y, q[6] = v;
    else v = q[6];
    let N;
    if (q[7] !== Y || q[8] !== K) N = Q0.createElement(Hw, {
        key: "config",
        title: "Config"
    }, Q0.createElement(p9q, {
        context: Y,
        onClose: K,
        setTabsHidden: $,
        onSearchModeChange: j,
        onIsSearchModeChange: M
    })), q[7] = Y, q[8] = K, q[9] = N;
    else N = q[9];
    let V;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) V = Q0.createElement(Hw, {
        key: "usage",
        title: "Usage"
    }, Q0.createElement(i9q, null)), q[10] = V;
    else V = q[10];
    let L;
    if (q[11] !== v || q[12] !== N) L = [v, N, V], q[11] = v, q[12] = N, q[13] = L;
    else L = q[13];
    let h = L,
        R;
    if (q[14] !== P || q[15] !== _ || q[16] !== h || q[17] !== O) R = Q0.createElement(S3, {
        color: "permission"
    }, Q0.createElement(Gh, {
        title: "Settings:",
        color: "permission",
        selectedTab: _,
        onTabChange: w,
        hidden: O,
        disableNavigation: P
    }, h)), q[14] = P, q[15] = _, q[16] = h, q[17] = O, q[18] = R;
    else R = q[18];
    return R
}
// @from(Ln 387856, Col 4)
Q0
// @from(Ln 387856, Col 8)
Jn6
// @from(Ln 387857, Col 4)
By1 = E(() => {
    e6();
    _7();
    FJ();
    oz6();
    L9q();
    Q9q();
    n9q();
    Q0 = t(P6(), 1), Jn6 = t(P6(), 1)
})
// @from(Ln 387867, Col 4)
r9q = {}
// @from(Ln 387871, Col 4)
zU8
// @from(Ln 387871, Col 9)
lpY = async (A, q) => {
    return zU8.createElement(Vv6, {
        onClose: A,
        context: q,
        defaultTab: "Config"
    })
}
// @from(Ln 387878, Col 4)
o9q = E(() => {
    By1();
    zU8 = t(P6(), 1)
})
// @from(Ln 387882, Col 4)
ipY
// @from(Ln 387882, Col 9)
a9q
// @from(Ln 387883, Col 4)
s9q = E(() => {
    ipY = {
        aliases: ["settings"],
        type: "local-jsx",
        name: "config",
        description: "Open config panel",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (o9q(), r9q)),
        userFacingName() {
            return "config"
        }
    }, a9q = ipY
})
// @from(Ln 387898, Col 0)
function AYq(A) {
    let q = [];
    return apY(A, q), spY(A, q), epY(A, q), AQY(A, q), qQY(A, q), q.sort((K, Y) => {
        if (K.severity !== Y.severity) return K.severity === "warning" ? -1 : 1;
        return (Y.savingsTokens ?? 0) - (K.savingsTokens ?? 0)
    }), q
}
// @from(Ln 387906, Col 0)
function apY(A, q) {
    if (A.percentage >= e9q) q.push({
        severity: "warning",
        title: `Context is ${A.percentage}% full`,
        detail: A.isAutoCompactEnabled ? "Autocompact will trigger soon, which discards older messages. Use /compact now to control what gets kept." : "Autocompact is disabled. Use /compact to free space, or enable autocompact in /config."
    })
}
// @from(Ln 387914, Col 0)
function spY(A, q) {
    if (!A.messageBreakdown) return;
    for (let K of A.messageBreakdown.toolCallsByType) {
        let Y = K.callTokens + K.resultTokens,
            z = Y / A.rawMaxTokens * 100;
        if (z < t9q || Y < _U8) continue;
        let _ = tpY(K.name, Y, z);
        if (_) q.push(_)
    }
}
// @from(Ln 387925, Col 0)
function tpY(A, q, K) {
    let Y = OO(q);
    switch (A) {
        case Q7:
            return {
                severity: "warning", title: `Bash results using ${Y} tokens (${K.toFixed(0)}%)`, detail: "Pipe output through head, tail, or grep to reduce result size. Avoid cat on large files — use Read with offset/limit instead.", savingsTokens: Math.floor(q * 0.5)
            };
        case s7:
            return {
                severity: "info", title: `Read results using ${Y} tokens (${K.toFixed(0)}%)`, detail: "Use offset and limit parameters to read only the sections you need. Avoid re-reading entire files when you only need a few lines.", savingsTokens: Math.floor(q * 0.3)
            };
        case N9:
            return {
                severity: "info", title: `Grep results using ${Y} tokens (${K.toFixed(0)}%)`, detail: "Add more specific patterns or use the glob or type parameter to narrow file types. Consider Glob for file discovery instead of Grep.", savingsTokens: Math.floor(q * 0.3)
            };
        case sO:
            return {
                severity: "info", title: `WebFetch results using ${Y} tokens (${K.toFixed(0)}%)`, detail: "Web page content can be very large. Consider extracting only the specific information needed.", savingsTokens: Math.floor(q * 0.4)
            };
        default:
            if (K >= 20) return {
                severity: "info",
                title: `${A} using ${Y} tokens (${K.toFixed(0)}%)`,
                detail: "This tool is consuming a significant portion of context.",
                savingsTokens: Math.floor(q * 0.2)
            };
            return null
    }
}
// @from(Ln 387955, Col 0)
function epY(A, q) {
    if (!A.messageBreakdown) return;
    let Y = A.messageBreakdown.toolCallsByType.find((O) => O.name === s7);
    if (!Y) return;
    let z = Y.callTokens + Y.resultTokens,
        _ = z / A.rawMaxTokens * 100,
        w = Y.resultTokens / A.rawMaxTokens * 100;
    if (_ >= t9q && z >= _U8) return;
    if (w >= npY && Y.resultTokens >= _U8) q.push({
        severity: "info",
        title: `File reads using ${OO(Y.resultTokens)} tokens (${w.toFixed(0)}%)`,
        detail: "If you are re-reading files, consider referencing earlier reads. Use offset/limit for large files.",
        savingsTokens: Math.floor(Y.resultTokens * 0.3)
    })
}
// @from(Ln 387971, Col 0)
function AQY(A, q) {
    let K = A.memoryFiles.reduce((z, _) => z + _.tokens, 0),
        Y = K / A.rawMaxTokens * 100;
    if (Y >= rpY && K >= opY) {
        let z = [...A.memoryFiles].sort((_, w) => w.tokens - _.tokens).slice(0, 3).map((_) => {
            return `${$K(_.path)} (${OO(_.tokens)})`
        }).join(", ");
        q.push({
            severity: "info",
            title: `Memory files using ${OO(K)} tokens (${Y.toFixed(0)}%)`,
            detail: `Largest: ${z}. Use /memory to review and prune stale entries.`,
            savingsTokens: Math.floor(K * 0.3)
        })
    }
}
// @from(Ln 387987, Col 0)
function qQY(A, q) {
    if (!A.isAutoCompactEnabled && A.percentage >= 50 && A.percentage < e9q) q.push({
        severity: "info",
        title: "Autocompact is disabled",
        detail: "Without autocompact, you will hit context limits and lose the conversation. Enable it in /config or use /compact manually."
    })
}
// @from(Ln 387994, Col 4)
t9q = 15
// @from(Ln 387995, Col 4)
_U8 = 1e4
// @from(Ln 387996, Col 4)
npY = 5
// @from(Ln 387997, Col 4)
e9q = 80
// @from(Ln 387998, Col 4)
rpY = 5
// @from(Ln 387999, Col 4)
opY = 5000
// @from(Ln 388000, Col 4)
qYq = E(() => {
    Z7();
    M4();
    J_();
    uP()
})
// @from(Ln 388007, Col 0)
function kv6(A) {
    let q = A6(5),
        {
            status: K,
            withSpace: Y
        } = A,
        z = Y === void 0 ? !1 : Y,
        _ = KQY[K],
        w = !_.color,
        O = z && " ",
        $;
    if (q[0] !== _.color || q[1] !== _.icon || q[2] !== w || q[3] !== O) $ = KYq.default.createElement(T, {
        color: _.color,
        dimColor: w
    }, _.icon, O), q[0] = _.color, q[1] = _.icon, q[2] = w, q[3] = O, q[4] = $;
    else $ = q[4];
    return $
}
// @from(Ln 388025, Col 4)
KYq
// @from(Ln 388025, Col 9)
KQY
// @from(Ln 388026, Col 4)
wU8 = E(() => {
    e6();
    b7();
    i6();
    KYq = t(P6(), 1), KQY = {
        success: {
            icon: a6.tick,
            color: "success"
        },
        error: {
            icon: a6.cross,
            color: "error"
        },
        warning: {
            icon: a6.warning,
            color: "warning"
        },
        info: {
            icon: a6.info,
            color: "suggestion"
        },
        pending: {
            icon: a6.circle,
            color: void 0
        },
        loading: {
            icon: "…",
            color: void 0
        }
    }
})
// @from(Ln 388058, Col 0)
function YYq(A) {
    let q = A6(5),
        {
            suggestions: K
        } = A;
    if (K.length === 0) return null;
    let Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = $D.createElement(T, {
        bold: !0
    }, "Suggestions"), q[0] = Y;
    else Y = q[0];
    let z;
    if (q[1] !== K) z = K.map(YQY), q[1] = K, q[2] = z;
    else z = q[2];
    let _;
    if (q[3] !== z) _ = $D.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, Y, z), q[3] = z, q[4] = _;
    else _ = q[4];
    return _
}
// @from(Ln 388081, Col 0)
function YQY(A, q) {
    return $D.createElement(m, {
        key: q,
        flexDirection: "column",
        marginTop: q === 0 ? 0 : 1
    }, $D.createElement(m, null, $D.createElement(kv6, {
        status: A.severity,
        withSpace: !0
    }), $D.createElement(T, {
        bold: !0
    }, A.title), A.savingsTokens ? $D.createElement(T, {
        dimColor: !0
    }, " ", a6.arrowRight, " save ~", OO(A.savingsTokens)) : null), $D.createElement(m, {
        marginLeft: 2
    }, $D.createElement(T, {
        dimColor: !0
    }, A.detail)))
}
// @from(Ln 388099, Col 4)
$D
// @from(Ln 388100, Col 4)
zYq = E(() => {
    e6();
    i6();
    M4();
    wU8();
    b7();
    $D = t(P6(), 1)
})
// @from(Ln 388109, Col 0)
function zQY(A) {
    return `${Math.round(A/1000)}k`
}
// @from(Ln 388113, Col 0)
function _QY() {
    let A = A6(3);
    return null
}
// @from(Ln 388118, Col 0)
function _Yq(A) {
    let q = new Map;
    for (let Y of A) {
        let z = jJ6(Y.source),
            _ = q.get(z) || [];
        _.push(Y), q.set(z, _)
    }
    for (let [Y, z] of q.entries()) q.set(Y, z.sort((_, w) => w.tokens - _.tokens));
    let K = new Map;
    for (let Y of wQY) {
        let z = q.get(Y);
        if (z) K.set(Y, z)
    }
    return K
}
// @from(Ln 388134, Col 0)
function wYq(A) {
    let q = A6(87),
        {
            data: K
        } = A,
        {
            categories: Y,
            totalTokens: z,
            rawMaxTokens: _,
            percentage: w,
            gridRows: O,
            model: $,
            memoryFiles: H,
            mcpTools: j,
            deferredBuiltinTools: J,
            systemTools: M,
            systemPromptSections: D,
            agents: X,
            skills: P,
            messageBreakdown: W
        } = K,
        Z, G, f, v, N, V, L, h, R, u;
    if (q[0] !== Y || q[1] !== O || q[2] !== j || q[3] !== $ || q[4] !== w || q[5] !== _ || q[6] !== M || q[7] !== J || q[8] !== z) {
        let Y6 = J === void 0 ? [] : J,
            H6 = Y.filter(yQY),
            J6;
        if (q[19] !== Y) J6 = Y.some(EQY), q[19] = Y, q[20] = J6;
        else J6 = q[20];
        let K6 = J6,
            s = Y6.length > 0,
            X6 = Y.find(kQY);
        if (G = m, L = "column", h = 1, q[21] === Symbol.for("react.memo_cache_sentinel")) R = B8.createElement(T, {
            bold: !0
        }, "Context Usage"), q[21] = R;
        else R = q[21];
        let z6;
        if (q[22] !== O) z6 = O.map(NQY), q[22] = O, q[23] = z6;
        else z6 = q[23];
        let N6;
        if (q[24] !== z6) N6 = B8.createElement(m, {
            flexDirection: "column",
            flexShrink: 0
        }, z6), q[24] = z6, q[25] = N6;
        else N6 = q[25];
        let $6;
        if (q[26] !== z) $6 = Math.round(z / 1000), q[26] = z, q[27] = $6;
        else $6 = q[27];
        let n;
        if (q[28] !== _) n = Math.round(_ / 1000), q[28] = _, q[29] = n;
        else n = q[29];
        let o;
        if (q[30] !== $ || q[31] !== w || q[32] !== $6 || q[33] !== n) o = B8.createElement(T, {
            dimColor: !0
        }, $, " · ", $6, "k/", n, "k tokens (", w, "%)"), q[30] = $, q[31] = w, q[32] = $6, q[33] = n, q[34] = o;
        else o = q[34];
        let a, i, l;
        if (q[35] === Symbol.for("react.memo_cache_sentinel")) a = B8.createElement(_QY, null), i = B8.createElement(T, null, " "), l = B8.createElement(T, {
            dimColor: !0,
            italic: !0
        }, "Estimated usage by category"), q[35] = a, q[36] = i, q[37] = l;
        else a = q[35], i = q[36], l = q[37];
        let q6;
        if (q[38] !== _) q6 = (G6, R6) => {
            let T6 = OO(G6.tokens),
                D6 = G6.isDeferred ? "N/A" : `${(G6.tokens/_*100).toFixed(1)}%`,
                Q6 = G6.name === gy1,
                k6 = G6.name,
                Z6 = G6.isDeferred ? " " : Q6 ? "⛝" : "⛁";
            return B8.createElement(m, {
                key: R6
            }, B8.createElement(T, {
                color: G6.color
            }, Z6), B8.createElement(T, null, " ", k6, ": "), B8.createElement(T, {
                dimColor: !0
            }, T6, " tokens (", D6, ")"))
        }, q[38] = _, q[39] = q6;
        else q6 = q[39];
        let w6 = H6.map(q6),
            O6;
        if (q[40] !== Y || q[41] !== _) O6 = (Y.find(vQY)?.tokens ?? 0) > 0 && B8.createElement(m, null, B8.createElement(T, {
            dimColor: !0
        }, "⛶"), B8.createElement(T, null, " Free space: "), B8.createElement(T, {
            dimColor: !0
        }, zQY(Y.find(TQY)?.tokens || 0), " ", "(", ((Y.find(fQY)?.tokens || 0) / _ * 100).toFixed(1), "%)")), q[40] = Y, q[41] = _, q[42] = O6;
        else O6 = q[42];
        let L6 = X6 && X6.tokens > 0 && B8.createElement(m, null, B8.createElement(T, {
                color: X6.color
            }, "⛝"), B8.createElement(T, {
                dimColor: !0
            }, " ", X6.name, ": "), B8.createElement(T, {
                dimColor: !0
            }, OO(X6.tokens), " tokens (", (X6.tokens / _ * 100).toFixed(1), "%)")),
            y6;
        if (q[43] !== o || q[44] !== w6 || q[45] !== O6 || q[46] !== L6) y6 = B8.createElement(m, {
            flexDirection: "column",
            gap: 0,
            flexShrink: 0
        }, o, a, i, l, w6, O6, L6), q[43] = o, q[44] = w6, q[45] = O6, q[46] = L6, q[47] = y6;
        else y6 = q[47];
        if (q[48] !== N6 || q[49] !== y6) u = B8.createElement(m, {
            flexDirection: "row",
            gap: 2
        }, N6, y6), q[48] = N6, q[49] = y6, q[50] = u;
        else u = q[50];
        if (Z = m, f = "column", v = -1, q[51] !== K6 || q[52] !== j) N = j.length > 0 && B8.createElement(m, {
            flexDirection: "column",
            marginTop: 1
        }, B8.createElement(m, null, B8.createElement(T, {
            bold: !0
        }, "MCP tools"), B8.createElement(T, {
            dimColor: !0
        }, " ", "· /mcp", K6 ? " (loaded on-demand)" : "")), j.some(GQY) && B8.createElement(m, {
            flexDirection: "column",
            marginTop: 1
        }, B8.createElement(T, {
            dimColor: !0
        }, "Loaded"), j.filter(ZQY).map(WQY)), K6 && j.some(PQY) && B8.createElement(m, {
            flexDirection: "column",
            marginTop: 1
        }, B8.createElement(T, {
            dimColor: !0
        }, "Available"), j.filter(XQY).map(DQY)), !K6 && j.map(MQY)), q[51] = K6, q[52] = j, q[53] = N;
        else N = q[53];
        V = (M && M.length > 0 || s) && !1, q[0] = Y, q[1] = O, q[2] = j, q[3] = $, q[4] = w, q[5] = _, q[6] = M, q[7] = J, q[8] = z, q[9] = Z, q[10] = G, q[11] = f, q[12] = v, q[13] = N, q[14] = V, q[15] = L, q[16] = h, q[17] = R, q[18] = u
    } else Z = q[9], G = q[10], f = q[11], v = q[12], N = q[13], V = q[14], L = q[15], h = q[16], R = q[17], u = q[18];
    let I;
    if (q[54] !== D) I = D && D.length > 0 && !1, q[54] = D, q[55] = I;
    else I = q[55];
    let g;
    if (q[56] !== X) g = X.length > 0 && B8.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, B8.createElement(m, null, B8.createElement(T, {
        bold: !0
    }, "Custom agents"), B8.createElement(T, {
        dimColor: !0
    }, " · /agents")), Array.from(_Yq(X).entries()).map(jQY)), q[56] = X, q[57] = g;
    else g = q[57];
    let B;
    if (q[58] !== H) B = H.length > 0 && B8.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, B8.createElement(m, null, B8.createElement(T, {
        bold: !0
    }, "Memory files"), B8.createElement(T, {
        dimColor: !0
    }, " · /memory")), H.map(HQY)), q[58] = H, q[59] = B;
    else B = q[59];
    let b;
    if (q[60] !== P) b = P && P.tokens > 0 && B8.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, B8.createElement(m, null, B8.createElement(T, {
        bold: !0
    }, "Skills"), B8.createElement(T, {
        dimColor: !0
    }, " · /skills")), Array.from(_Yq(P.skillFrontmatter).entries()).map(OQY)), q[60] = P, q[61] = b;
    else b = q[61];
    let p;
    if (q[62] !== W) p = W && !1, q[62] = W, q[63] = p;
    else p = q[63];
    let Q;
    if (q[64] !== Z || q[65] !== I || q[66] !== g || q[67] !== B || q[68] !== b || q[69] !== p || q[70] !== f || q[71] !== v || q[72] !== N || q[73] !== V) Q = B8.createElement(Z, {
        flexDirection: f,
        marginLeft: v
    }, N, V, I, g, B, b, p), q[64] = Z, q[65] = I, q[66] = g, q[67] = B, q[68] = b, q[69] = p, q[70] = f, q[71] = v, q[72] = N, q[73] = V, q[74] = Q;
    else Q = q[74];
    let U;
    if (q[75] !== K) U = AYq(K), q[75] = K, q[76] = U;
    else U = q[76];
    let r;
    if (q[77] !== U) r = B8.createElement(YYq, {
        suggestions: U
    }), q[77] = U, q[78] = r;
    else r = q[78];
    let e;
    if (q[79] !== G || q[80] !== Q || q[81] !== r || q[82] !== L || q[83] !== h || q[84] !== R || q[85] !== u) e = B8.createElement(G, {
        flexDirection: L,
        paddingLeft: h
    }, R, u, Q, r), q[79] = G, q[80] = Q, q[81] = r, q[82] = L, q[83] = h, q[84] = R, q[85] = u, q[86] = e;
    else e = q[86];
    return e
}
// @from(Ln 388318, Col 0)
function OQY(A) {
    let [q, K] = A;
    return B8.createElement(m, {
        key: q,
        flexDirection: "column",
        marginTop: 1
    }, B8.createElement(T, {
        dimColor: !0
    }, q), K.map($QY))
}
// @from(Ln 388329, Col 0)
function $QY(A, q) {
    return B8.createElement(m, {
        key: q
    }, B8.createElement(T, null, "└ ", A.name, ": "), B8.createElement(T, {
        dimColor: !0
    }, OO(A.tokens), " tokens"))
}
// @from(Ln 388337, Col 0)
function HQY(A, q) {
    return B8.createElement(m, {
        key: q
    }, B8.createElement(T, null, "└ ", $K(A.path), ": "), B8.createElement(T, {
        dimColor: !0
    }, OO(A.tokens), " tokens"))
}
// @from(Ln 388345, Col 0)
function jQY(A) {
    let [q, K] = A;
    return B8.createElement(m, {
        key: q,
        flexDirection: "column",
        marginTop: 1
    }, B8.createElement(T, {
        dimColor: !0
    }, q), K.map(JQY))
}
// @from(Ln 388356, Col 0)
function JQY(A, q) {
    return B8.createElement(m, {
        key: q
    }, B8.createElement(T, null, "└ ", A.agentType, ": "), B8.createElement(T, {
        dimColor: !0
    }, OO(A.tokens), " tokens"))
}
// @from(Ln 388364, Col 0)
function MQY(A, q) {
    return B8.createElement(m, {
        key: q
    }, B8.createElement(T, null, "└ ", A.name, ": "), B8.createElement(T, {
        dimColor: !0
    }, OO(A.tokens), " tokens"))
}
// @from(Ln 388372, Col 0)
function DQY(A, q) {
    return B8.createElement(m, {
        key: q
    }, B8.createElement(T, {
        dimColor: !0
    }, "└ ", A.name))
}
// @from(Ln 388380, Col 0)
function XQY(A) {
    return !A.isLoaded
}
// @from(Ln 388384, Col 0)
function PQY(A) {
    return !A.isLoaded
}
// @from(Ln 388388, Col 0)
function WQY(A, q) {
    return B8.createElement(m, {
        key: q
    }, B8.createElement(T, null, "└ ", A.name, ": "), B8.createElement(T, {
        dimColor: !0
    }, OO(A.tokens), " tokens"))
}
// @from(Ln 388396, Col 0)
function ZQY(A) {
    return A.isLoaded
}
// @from(Ln 388400, Col 0)
function GQY(A) {
    return A.isLoaded
}
// @from(Ln 388404, Col 0)
function fQY(A) {
    return A.name === "Free space"
}
// @from(Ln 388408, Col 0)
function TQY(A) {
    return A.name === "Free space"
}
// @from(Ln 388412, Col 0)
function vQY(A) {
    return A.name === "Free space"
}
// @from(Ln 388416, Col 0)
function NQY(A, q) {
    return B8.createElement(m, {
        key: q,
        flexDirection: "row",
        marginLeft: -1
    }, A.map(VQY))
}
// @from(Ln 388424, Col 0)
function VQY(A, q) {
    if (A.categoryName === "Free space") return B8.createElement(T, {
        key: q,
        dimColor: !0
    }, "⛶ ");
    if (A.categoryName === gy1) return B8.createElement(T, {
        key: q,
        color: A.color
    }, "⛝ ");
    return B8.createElement(T, {
        key: q,
        color: A.color
    }, A.squareFullness >= 0.7 ? "⛁ " : "⛀ ")
}
// @from(Ln 388439, Col 0)
function kQY(A) {
    return A.name === gy1
}
// @from(Ln 388443, Col 0)
function EQY(A) {
    return A.isDeferred && A.name.includes("MCP")
}
// @from(Ln 388447, Col 0)
function yQY(A) {
    return A.tokens > 0 && A.name !== "Free space" && A.name !== gy1 && !A.isDeferred
}
// @from(Ln 388450, Col 4)
B8
// @from(Ln 388450, Col 8)
gy1 = "Autocompact buffer"
// @from(Ln 388451, Col 4)
wQY
// @from(Ln 388452, Col 4)
OYq = E(() => {
    e6();
    i6();
    O2();
    Z7();
    M4();
    qYq();
    zYq();
    B8 = t(P6(), 1);
    wQY = ["Project", "User", "Managed", "Plugin", "Built-in"]
})
// @from(Ln 388467, Col 0)
function RQY(A) {
    let q = A6(5),
        {
            children: K
        } = A,
        {
            exit: Y
        } = IX6(),
        z, _;
    if (q[0] !== Y) z = () => {
        let O = setTimeout(Y, 0);
        return () => clearTimeout(O)
    }, _ = [Y], q[0] = Y, q[1] = z, q[2] = _;
    else z = q[1], _ = q[2];
    HYq.useLayoutEffect(z, _);
    let w;
    if (q[3] !== K) w = M16.createElement(M16.Fragment, null, K), q[3] = K, q[4] = w;
    else w = q[4];
    return w
}
// @from(Ln 388488, Col 0)
function SQY(A) {
    let q = A.indexOf($Yq);
    if (q === -1) return A;
    let K = q + $Yq.length,
        Y = A.indexOf(hQY, K);
    if (Y === -1) return A;
    return A.slice(K, Y)
}
// @from(Ln 388497, Col 0)
function OU8(A) {
    return new Promise(async (q) => {
        let K = "",
            Y = new LQY;
        Y.on("data", (_) => {
            K += _.toString()
        }), await (await BC(M16.createElement(RQY, null, A), {
            stdout: Y,
            patchConsole: !1
        })).waitUntilExit(), await q(SQY(K))
    })
}
// @from(Ln 388509, Col 0)
async function Fy1(A) {
    let q = await OU8(A);
    return sY(q)
}
// @from(Ln 388513, Col 4)
M16
// @from(Ln 388513, Col 9)
HYq
// @from(Ln 388513, Col 14)
$Yq = "\x1B[?2026h"
// @from(Ln 388514, Col 4)
hQY = "\x1B[?2026l"
// @from(Ln 388515, Col 4)
py1 = E(() => {
    e6();
    i6();
    LG();
    M16 = t(P6(), 1), HYq = t(P6(), 1)
})
// @from(Ln 388521, Col 4)
jYq = {}
// @from(Ln 388526, Col 0)
function CQY(A) {
    return fN(A)
}
// @from(Ln 388529, Col 0)
async function IQY(A, q) {
    let {
        messages: K,
        getAppState: Y,
        options: {
            mainLoopModel: z,
            tools: _
        }
    } = q, w = CQY(K), {
        messages: O
    } = await pg(w), $ = process.stdout.columns || 80, H = Y(), j = await Qy1(O, z, async () => H.toolPermissionContext, _, H.agentDefinitions, $, q, void 0, w), J = await OU8($U8.createElement(wYq, {
        data: j
    }));
    return A(J), null
}
// @from(Ln 388544, Col 4)
$U8
// @from(Ln 388545, Col 4)
JYq = E(() => {
    OYq();
    Mn6();
    py1();
    eR();
    JA();
    $U8 = t(P6(), 1)
})
// @from(Ln 388553, Col 4)
MYq = {}
// @from(Ln 388557, Col 0)
async function xQY(A, q) {
    let {
        messages: K,
        getAppState: Y,
        options: {
            mainLoopModel: z,
            tools: _,
            agentDefinitions: w
        }
    } = q, O = fN(K), {
        messages: $
    } = await pg(O), H = Y(), j = await Qy1($, z, async () => H.toolPermissionContext, _, w, void 0, q, void 0, O);
    return {
        type: "text",
        value: uQY(j)
    }
}
// @from(Ln 388575, Col 0)
function uQY(A) {
    let {
        categories: q,
        totalTokens: K,
        rawMaxTokens: Y,
        percentage: z,
        model: _,
        memoryFiles: w,
        mcpTools: O,
        agents: $,
        skills: H,
        messageBreakdown: j,
        systemTools: J,
        systemPromptSections: M
    } = A, D = `## Context Usage

`;
    D += `**Model:** ${_}  
`, D += `**Tokens:** ${OO(K)} / ${OO(Y)} (${z}%)
`, D += `
`;
    let X = q.filter((P) => P.tokens > 0 && P.name !== "Free space" && P.name !== "Autocompact buffer");
    if (X.length > 0) {
        D += `### Estimated usage by category

`, D += `| Category | Tokens | Percentage |
`, D += `|----------|--------|------------|
`;
        for (let Z of X) {
            let G = (Z.tokens / Y * 100).toFixed(1);
            D += `| ${Z.name} | ${OO(Z.tokens)} | ${G}% |
`
        }
        let P = q.find((Z) => Z.name === "Free space");
        if (P && P.tokens > 0) {
            let Z = (P.tokens / Y * 100).toFixed(1);
            D += `| Free space | ${OO(P.tokens)} | ${Z}% |
`
        }
        let W = q.find((Z) => Z.name === "Autocompact buffer");
        if (W && W.tokens > 0) {
            let Z = (W.tokens / Y * 100).toFixed(1);
            D += `| Autocompact buffer | ${OO(W.tokens)} | ${Z}% |
`
        }
        D += `
`
    }
    if (O.length > 0) {
        D += `### MCP Tools

`, D += `| Tool | Server | Tokens |
`, D += `|------|--------|--------|
`;
        for (let P of O) D += `| ${P.name} | ${P.serverName} | ${OO(P.tokens)} |
`;
        D += `
`
    }
    if (J && J.length > 0, M && M.length > 0, $.length > 0) {
        D += `### Custom Agents

`, D += `| Agent Type | Source | Tokens |
`, D += `|------------|--------|--------|
`;
        for (let P of $) {
            let W;
            switch (P.source) {
                case "projectSettings":
                    W = "Project";
                    break;
                case "userSettings":
                    W = "User";
                    break;
                case "localSettings":
                    W = "Local";
                    break;
                case "flagSettings":
                    W = "Flag";
                    break;
                case "policySettings":
                    W = "Policy";
                    break;
                case "plugin":
                    W = "Plugin";
                    break;
                case "built-in":
                    W = "Built-in";
                    break;
                default:
                    W = String(P.source)
            }
            D += `| ${P.agentType} | ${W} | ${OO(P.tokens)} |
`
        }
        D += `
`
    }
    if (w.length > 0) {
        D += `### Memory Files

`, D += `| Type | Path | Tokens |
`, D += `|------|------|--------|
`;
        for (let P of w) D += `| ${P.type} | ${P.path} | ${OO(P.tokens)} |
`;
        D += `
`
    }
    if (H && H.tokens > 0 && H.skillFrontmatter.length > 0) {
        D += `### Skills

`, D += `| Skill | Source | Tokens |
`, D += `|-------|--------|--------|
`;
        for (let P of H.skillFrontmatter) D += `| ${P.name} | ${jJ6(P.source)} | ${OO(P.tokens)} |
`;
        D += `
`
    }
    return D
}
// @from(Ln 388697, Col 4)
DYq = E(() => {
    Mn6();
    eR();
    JA();
    O2();
    M4()
})
// @from(Ln 388704, Col 4)
XYq
// @from(Ln 388704, Col 9)
PYq
// @from(Ln 388705, Col 4)
WYq = E(() => {
    T1();
    XYq = {
        name: "context",
        description: "Visualize current context usage as a colored grid",
        isEnabled: () => !q7(),
        isHidden: !1,
        type: "local-jsx",
        load: () => Promise.resolve().then(() => (JYq(), jYq)),
        userFacingName() {
            return this.name
        }
    }, PYq = {
        type: "local",
        name: "context",
        supportsNonInteractive: !0,
        description: "Show current context usage",
        get isHidden() {
            return !q7()
        },
        isEnabled() {
            return q7()
        },
        load: () => Promise.resolve().then(() => (DYq(), MYq)),
        userFacingName() {
            return "context"
        }
    }
})
// @from(Ln 388734, Col 4)
ZYq = {}
// @from(Ln 388738, Col 4)
mQY = async () => {
    if (iA()) {
        let A;
        if (Jf.isUsingOverage) A = "You are currently using your overages to power your Claude Code usage. We will automatically switch you back to your subscription rate limits when they reset";
        else A = "You are currently using your subscription to power your Claude Code usage";
        return {
            type: "text",
            value: A
        }
    }
    return {
        type: "text",
        value: a21()
    }
}
// @from(Ln 388753, Col 4)
GYq = E(() => {
    $k();
    fA();
    ud()
})
// @from(Ln 388758, Col 4)
BQY
// @from(Ln 388758, Col 9)
HU8
// @from(Ln 388759, Col 4)
fYq = E(() => {
    fA();
    BQY = {
        type: "local",
        name: "cost",
        description: "Show the total cost and duration of the current session",
        isEnabled: () => !0,
        get isHidden() {
            return iA()
        },
        supportsNonInteractive: !0,
        load: () => Promise.resolve().then(() => (GYq(), ZYq)),
        userFacingName() {
            return "cost"
        }
    }, HU8 = BQY
})
// @from(Ln 388777, Col 0)
function TYq() {
    let [A, q] = D16.useState(null), [K, Y] = D16.useState(new Map), [z, _] = D16.useState(!0);
    return D16.useEffect(() => {
        let w = !1;
        async function O() {
            try {
                let [$, H] = await Promise.all([la4(), ia4()]);
                if (!w) q($), Y(H), _(!1)
            } catch ($) {
                if (!w) q(null), Y(new Map), _(!1)
            }
        }
        return O(), () => {
            w = !0
        }
    }, []), D16.useMemo(() => {
        if (!A) return {
            stats: null,
            files: [],
            hunks: new Map,
            loading: z
        };
        let {
            stats: w,
            perFileStats: O
        } = A, $ = [];
        for (let [H, j] of O) {
            let J = K.get(H),
                M = j.isUntracked ?? !1,
                D = !j.isBinary && !M && !J,
                X = j.added + j.removed,
                P = !D && !j.isBinary && X > gQY;
            $.push({
                path: H,
                linesAdded: j.added,
                linesRemoved: j.removed,
                isBinary: j.isBinary,
                isLargeFile: D,
                isTruncated: P,
                isUntracked: M
            })
        }
        return $.sort((H, j) => H.path.localeCompare(j.path)), {
            stats: w,
            files: $,
            hunks: K,
            loading: !1
        }
    }, [A, K, z])
}
// @from(Ln 388827, Col 4)
D16
// @from(Ln 388827, Col 9)
gQY = 400
// @from(Ln 388828, Col 4)
vYq = E(() => {
    tV1();
    D16 = t(P6(), 1)
})
// @from(Ln 388833, Col 0)
function FQY(A) {
    if (!A || typeof A !== "object") return !1;
    let q = A,
        K = typeof q.filePath === "string",
        Y = Array.isArray(q.structuredPatch) && q.structuredPatch.length > 0,
        z = q.type === "create" && typeof q.content === "string";
    return K && (Y || z)
}
// @from(Ln 388842, Col 0)
function pQY(A) {
    return "type" in A && (A.type === "create" || A.type === "update")
}
// @from(Ln 388846, Col 0)
function QQY(A) {
    let q = 0,
        K = 0;
    for (let Y of A)
        for (let z of Y.lines)
            if (z.startsWith("+")) q++;
            else if (z.startsWith("-")) K++;
    return {
        added: q,
        removed: K
    }
}
// @from(Ln 388859, Col 0)
function UQY(A) {
    if (A.type !== "user") return "";
    let q = A.message.content,
        K = typeof q === "string" ? q : "";
    if (K.length <= 30) return K;
    return K.slice(0, 29) + "…"
}
// @from(Ln 388867, Col 0)
function NYq(A) {
    let q = 0,
        K = 0;
    for (let Y of A.files.values()) q += Y.linesAdded, K += Y.linesRemoved;
    A.stats = {
        filesChanged: A.files.size,
        linesAdded: q,
        linesRemoved: K
    }
}
// @from(Ln 388878, Col 0)
function VYq(A) {
    let q = Uy1.useRef({
        completedTurns: [],
        currentTurn: null,
        lastProcessedIndex: 0,
        lastTurnIndex: 0
    });
    return Uy1.useMemo(() => {
        let K = q.current;
        if (A.length < K.lastProcessedIndex) K.completedTurns = [], K.currentTurn = null, K.lastProcessedIndex = 0, K.lastTurnIndex = 0;
        for (let z = K.lastProcessedIndex; z < A.length; z++) {
            let _ = A[z];
            if (!_ || _.type !== "user") continue;
            if (!(_.toolUseResult || Array.isArray(_.message.content) && _.message.content[0]?.type === "tool_result") && !_.isMeta) {
                if (K.currentTurn && K.currentTurn.files.size > 0) NYq(K.currentTurn), K.completedTurns.push(K.currentTurn);
                K.lastTurnIndex++, K.currentTurn = {
                    turnIndex: K.lastTurnIndex,
                    userPromptPreview: UQY(_),
                    timestamp: _.timestamp,
                    files: new Map,
                    stats: {
                        filesChanged: 0,
                        linesAdded: 0,
                        linesRemoved: 0
                    }
                }
            } else if (K.currentTurn && _.toolUseResult) {
                let O = _.toolUseResult;
                if (FQY(O)) {
                    let {
                        filePath: $,
                        structuredPatch: H
                    } = O, j = "type" in O && O.type === "create", J = K.currentTurn.files.get($);
                    if (!J) J = {
                        filePath: $,
                        hunks: [],
                        isNewFile: j,
                        linesAdded: 0,
                        linesRemoved: 0
                    }, K.currentTurn.files.set($, J);
                    if (j && H.length === 0 && pQY(O)) {
                        let D = O.content.split(`
`),
                            X = {
                                oldStart: 0,
                                oldLines: 0,
                                newStart: 1,
                                newLines: D.length,
                                lines: D.map((P) => "+" + P)
                            };
                        J.hunks.push(X), J.linesAdded += D.length
                    } else {
                        J.hunks.push(...H);
                        let {
                            added: M,
                            removed: D
                        } = QQY(H);
                        J.linesAdded += M, J.linesRemoved += D
                    }
                    if (j) J.isNewFile = !0
                }
            }
        }
        K.lastProcessedIndex = A.length;
        let Y = [...K.completedTurns];
        if (K.currentTurn && K.currentTurn.files.size > 0) NYq(K.currentTurn), Y.push(K.currentTurn);
        return Y.reverse()
    }, [A])
}
// @from(Ln 388947, Col 4)
Uy1
// @from(Ln 388948, Col 4)
kYq = E(() => {
    Uy1 = t(P6(), 1)
})
// @from(Ln 388952, Col 0)
function EYq(A) {
    let q = A6(36),
        {
            files: K,
            selectedIndex: Y
        } = A,
        {
            columns: z
        } = KA(),
        _;
    A: {
        if (K.length === 0 || K.length <= Dn6) {
            let f;
            if (q[0] !== K.length) f = {
                startIndex: 0,
                endIndex: K.length
            }, q[0] = K.length, q[1] = f;
            else f = q[1];
            _ = f;
            break A
        }
        let W = Math.max(0, Y - Math.floor(Dn6 / 2)),
            Z = W + Dn6;
        if (Z > K.length) Z = K.length,
        W = Math.max(0, Z - Dn6);
        let G;
        if (q[2] !== Z || q[3] !== W) G = {
            startIndex: W,
            endIndex: Z
        },
        q[2] = Z,
        q[3] = W,
        q[4] = G;
        else G = q[4];_ = G
    }
    let {
        startIndex: w,
        endIndex: O
    } = _;
    if (K.length === 0) {
        let W;
        if (q[5] === Symbol.for("react.memo_cache_sentinel")) W = U0.default.createElement(T, {
            dimColor: !0
        }, "No changed files"), q[5] = W;
        else W = q[5];
        return W
    }
    let $, H, j, J, M, D;
    if (q[6] !== z || q[7] !== O || q[8] !== K || q[9] !== Y || q[10] !== w) {
        let W = K.slice(w, O),
            Z = w > 0;
        H = O < K.length, j = K.length > Dn6;
        let G = Math.max(20, z - 16 - 3 - 4);
        if ($ = m, J = "column", q[17] !== Z || q[18] !== j || q[19] !== w) M = j && U0.default.createElement(T, {
            dimColor: !0
        }, Z ? ` ↑ ${w} more file${w!==1?"s":""}` : " "), q[17] = Z, q[18] = j, q[19] = w, q[20] = M;
        else M = q[20];
        let f;
        if (q[21] !== G || q[22] !== Y || q[23] !== w) f = (v, N) => U0.default.createElement(dQY, {
            key: v.path,
            file: v,
            isSelected: w + N === Y,
            maxPathWidth: G
        }), q[21] = G, q[22] = Y, q[23] = w, q[24] = f;
        else f = q[24];
        D = W.map(f), q[6] = z, q[7] = O, q[8] = K, q[9] = Y, q[10] = w, q[11] = $, q[12] = H, q[13] = j, q[14] = J, q[15] = M, q[16] = D
    } else $ = q[11], H = q[12], j = q[13], J = q[14], M = q[15], D = q[16];
    let X;
    if (q[25] !== O || q[26] !== K.length || q[27] !== H || q[28] !== j) X = j && U0.default.createElement(T, {
        dimColor: !0
    }, H ? ` ↓ ${K.length-O} more file${K.length-O!==1?"s":""}` : " "), q[25] = O, q[26] = K.length, q[27] = H, q[28] = j, q[29] = X;
    else X = q[29];
    let P;
    if (q[30] !== $ || q[31] !== J || q[32] !== M || q[33] !== D || q[34] !== X) P = U0.default.createElement($, {
        flexDirection: J
    }, M, D, X), q[30] = $, q[31] = J, q[32] = M, q[33] = D, q[34] = X, q[35] = P;
    else P = q[35];
    return P
}
// @from(Ln 389032, Col 0)
function dQY(A) {
    let q = A6(14),
        {
            file: K,
            isSelected: Y,
            maxPathWidth: z
        } = A,
        _;
    if (q[0] !== K.path || q[1] !== z) _ = VJ6(K.path, z), q[0] = K.path, q[1] = z, q[2] = _;
    else _ = q[2];
    let w = _,
        $ = `${Y?a6.pointer+" ":"  "}${w}`,
        H = Y ? "background" : void 0,
        j;
    if (q[3] !== Y || q[4] !== $ || q[5] !== H) j = U0.default.createElement(T, {
        bold: Y,
        color: H,
        inverse: Y
    }, $), q[3] = Y, q[4] = $, q[5] = H, q[6] = j;
    else j = q[6];
    let J;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) J = U0.default.createElement(m, {
        flexGrow: 1
    }), q[7] = J;
    else J = q[7];
    let M;
    if (q[8] !== K || q[9] !== Y) M = U0.default.createElement(cQY, {
        file: K,
        isSelected: Y
    }), q[8] = K, q[9] = Y, q[10] = M;
    else M = q[10];
    let D;
    if (q[11] !== j || q[12] !== M) D = U0.default.createElement(m, {
        flexDirection: "row"
    }, j, J, M), q[11] = j, q[12] = M, q[13] = D;
    else D = q[13];
    return D
}
// @from(Ln 389071, Col 0)
function cQY(A) {
    let q = A6(20),
        {
            file: K,
            isSelected: Y
        } = A;
    if (K.isUntracked) {
        let H = !Y,
            j;
        if (q[0] !== H) j = U0.default.createElement(T, {
            dimColor: H,
            italic: !0
        }, "untracked"), q[0] = H, q[1] = j;
        else j = q[1];
        return j
    }
    if (K.isBinary) {
        let H = !Y,
            j;
        if (q[2] !== H) j = U0.default.createElement(T, {
            dimColor: H,
            italic: !0
        }, "Binary file"), q[2] = H, q[3] = j;
        else j = q[3];
        return j
    }
    if (K.isLargeFile) {
        let H = !Y,
            j;
        if (q[4] !== H) j = U0.default.createElement(T, {
            dimColor: H,
            italic: !0
        }, "Large file modified"), q[4] = H, q[5] = j;
        else j = q[5];
        return j
    }
    let z;
    if (q[6] !== K.linesAdded || q[7] !== Y) z = K.linesAdded > 0 && U0.default.createElement(T, {
        color: "diffAddedWord",
        bold: Y
    }, "+", K.linesAdded), q[6] = K.linesAdded, q[7] = Y, q[8] = z;
    else z = q[8];
    let _ = K.linesAdded > 0 && K.linesRemoved > 0 && " ",
        w;
    if (q[9] !== K.linesRemoved || q[10] !== Y) w = K.linesRemoved > 0 && U0.default.createElement(T, {
        color: "diffRemovedWord",
        bold: Y
    }, "-", K.linesRemoved), q[9] = K.linesRemoved, q[10] = Y, q[11] = w;
    else w = q[11];
    let O;
    if (q[12] !== K.isTruncated || q[13] !== Y) O = K.isTruncated && U0.default.createElement(T, {
        dimColor: !Y
    }, " (truncated)"), q[12] = K.isTruncated, q[13] = Y, q[14] = O;
    else O = q[14];
    let $;
    if (q[15] !== z || q[16] !== _ || q[17] !== w || q[18] !== O) $ = U0.default.createElement(T, null, z, _, w, O), q[15] = z, q[16] = _, q[17] = w, q[18] = O, q[19] = $;
    else $ = q[19];
    return $
}
// @from(Ln 389130, Col 4)
U0
// @from(Ln 389130, Col 8)
Dn6 = 5
// @from(Ln 389131, Col 4)
yYq = E(() => {
    e6();
    i6();
    b7();
    _q();
    M4();
    U0 = t(P6(), 1)
})
// @from(Ln 389143, Col 0)
function LYq(A) {
    let q = A6(53),
        {
            filePath: K,
            hunks: Y,
            isLargeFile: z,
            isBinary: _,
            isTruncated: w,
            isUntracked: O
        } = A,
        {
            columns: $
        } = KA(),
        H;
    A: {
        if (!K) {
            let h;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) h = {
                firstLine: null,
                fileContent: void 0
            }, q[0] = h;
            else h = q[0];
            H = h;
            break A
        }
        let v, N;
        if (q[1] !== K) {
            let h = lQY(G1(), K);
            v = hYq(h), N = v?.split(`
`)[0] ?? null, q[1] = K, q[2] = v, q[3] = N
        } else v = q[2],
        N = q[3];
        let V = v ?? void 0,
            L;
        if (q[4] !== N || q[5] !== V) L = {
            firstLine: N,
            fileContent: V
        },
        q[4] = N,
        q[5] = V,
        q[6] = L;
        else L = q[6];H = L
    }
    let {
        firstLine: j,
        fileContent: J
    } = H;
    if (O) {
        let v;
        if (q[7] !== K) v = G_.default.createElement(T, {
            bold: !0
        }, K), q[7] = K, q[8] = v;
        else v = q[8];
        let N;
        if (q[9] === Symbol.for("react.memo_cache_sentinel")) N = G_.default.createElement(T, {
            dimColor: !0
        }, " (untracked)"), q[9] = N;
        else N = q[9];
        let V;
        if (q[10] !== v) V = G_.default.createElement(m, null, v, N), q[10] = v, q[11] = V;
        else V = q[11];
        let L;
        if (q[12] === Symbol.for("react.memo_cache_sentinel")) L = G_.default.createElement(Wk, {
            padding: 4
        }), q[12] = L;
        else L = q[12];
        let h;
        if (q[13] === Symbol.for("react.memo_cache_sentinel")) h = G_.default.createElement(T, {
            dimColor: !0,
            italic: !0
        }, "New file not yet staged."), q[13] = h;
        else h = q[13];
        let R;
        if (q[14] !== K) R = G_.default.createElement(m, {
            flexDirection: "column"
        }, h, G_.default.createElement(T, {
            dimColor: !0,
            italic: !0
        }, "Run `git add ", K, "` to see line counts.")), q[14] = K, q[15] = R;
        else R = q[15];
        let u;
        if (q[16] !== V || q[17] !== R) u = G_.default.createElement(m, {
            flexDirection: "column",
            width: "100%"
        }, V, L, R), q[16] = V, q[17] = R, q[18] = u;
        else u = q[18];
        return u
    }
    if (_) {
        let v;
        if (q[19] !== K) v = G_.default.createElement(m, null, G_.default.createElement(T, {
            bold: !0
        }, K)), q[19] = K, q[20] = v;
        else v = q[20];
        let N;
        if (q[21] === Symbol.for("react.memo_cache_sentinel")) N = G_.default.createElement(Wk, {
            padding: 4
        }), q[21] = N;
        else N = q[21];
        let V;
        if (q[22] === Symbol.for("react.memo_cache_sentinel")) V = G_.default.createElement(m, {
            flexDirection: "column"
        }, G_.default.createElement(T, {
            dimColor: !0,
            italic: !0
        }, "Binary file - cannot display diff")), q[22] = V;
        else V = q[22];
        let L;
        if (q[23] !== v) L = G_.default.createElement(m, {
            flexDirection: "column",
            width: "100%"
        }, v, N, V), q[23] = v, q[24] = L;
        else L = q[24];
        return L
    }
    if (z) {
        let v;
        if (q[25] !== K) v = G_.default.createElement(m, null, G_.default.createElement(T, {
            bold: !0
        }, K)), q[25] = K, q[26] = v;
        else v = q[26];
        let N;
        if (q[27] === Symbol.for("react.memo_cache_sentinel")) N = G_.default.createElement(Wk, {
            padding: 4
        }), q[27] = N;
        else N = q[27];
        let V;
        if (q[28] === Symbol.for("react.memo_cache_sentinel")) V = G_.default.createElement(m, {
            flexDirection: "column"
        }, G_.default.createElement(T, {
            dimColor: !0,
            italic: !0
        }, "Large file - diff exceeds 1 MB limit")), q[28] = V;
        else V = q[28];
        let L;
        if (q[29] !== v) L = G_.default.createElement(m, {
            flexDirection: "column",
            width: "100%"
        }, v, N, V), q[29] = v, q[30] = L;
        else L = q[30];
        return L
    }
    let M;
    if (q[31] !== K) M = G_.default.createElement(T, {
        bold: !0
    }, K), q[31] = K, q[32] = M;
    else M = q[32];
    let D;
    if (q[33] !== w) D = w && G_.default.createElement(T, {
        dimColor: !0
    }, " (truncated)"), q[33] = w, q[34] = D;
    else D = q[34];
    let X;
    if (q[35] !== M || q[36] !== D) X = G_.default.createElement(m, null, M, D), q[35] = M, q[36] = D, q[37] = X;
    else X = q[37];
    let P;
    if (q[38] === Symbol.for("react.memo_cache_sentinel")) P = G_.default.createElement(Wk, {
        padding: 4
    }), q[38] = P;
    else P = q[38];
    let W;
    if (q[39] !== $ || q[40] !== J || q[41] !== K || q[42] !== j || q[43] !== Y) W = Y.length === 0 ? G_.default.createElement(T, {
        dimColor: !0
    }, "No diff content") : Y.map((v, N) => G_.default.createElement(DN, {
        key: N,
        patch: v,
        filePath: K,
        firstLine: j,
        fileContent: J,
        dim: !1,
        width: $ - 2 - 2
    })), q[39] = $, q[40] = J, q[41] = K, q[42] = j, q[43] = Y, q[44] = W;
    else W = q[44];
    let Z;
    if (q[45] !== W) Z = G_.default.createElement(m, {
        flexDirection: "column"
    }, W), q[45] = W, q[46] = Z;
    else Z = q[46];
    let G;
    if (q[47] !== w) G = w && G_.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "… diff truncated (exceeded 400 line limit)"), q[47] = w, q[48] = G;
    else G = q[48];
    let f;
    if (q[49] !== X || q[50] !== Z || q[51] !== G) f = G_.default.createElement(m, {
        flexDirection: "column",
        width: "100%"
    }, X, P, Z, G), q[49] = X, q[50] = Z, q[51] = G, q[52] = f;
    else f = q[52];
    return f
}
// @from(Ln 389335, Col 4)
G_
// @from(Ln 389336, Col 4)
RYq = E(() => {
    e6();
    i6();
    p66();
    Z7();
    lA();
    _q();
    cu6();
    G_ = t(P6(), 1)
})
// @from(Ln 389346, Col 4)
SYq = {}
// @from(Ln 389351, Col 0)
function iQY(A) {
    let q = Array.from(A.files.values()).map((Y) => ({
            path: Y.filePath,
            linesAdded: Y.linesAdded,
            linesRemoved: Y.linesRemoved,
            isBinary: !1,
            isLargeFile: !1,
            isTruncated: !1,
            isNewFile: Y.isNewFile
        })).sort((Y, z) => Y.path.localeCompare(z.path)),
        K = new Map;
    for (let Y of A.files.values()) K.set(Y.filePath, Y.hunks);
    return {
        stats: {
            filesCount: A.stats.filesChanged,
            linesAdded: A.stats.linesAdded,
            linesRemoved: A.stats.linesRemoved
        },
        files: q,
        hunks: K,
        loading: !1
    }
}
// @from(Ln 389375, Col 0)
function nQY(A) {
    let q = A6(81),
        {
            messages: K,
            onDone: Y
        } = A,
        z = TYq(),
        _ = VYq(K),
        [w, O] = cl.useState("list"),
        [$, H] = cl.useState(0),
        [j, J] = cl.useState(0),
        M;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) M = {
        type: "current"
    }, q[0] = M;
    else M = q[0];
    let D;
    if (q[1] !== _) {
        D = [M];
        for (let L6 of _) D.push({
            type: "turn",
            turnIndex: L6.turnIndex
        });
        q[1] = _, q[2] = D
    } else D = q[2];
    let X = D,
        P;
    if (q[3] !== z || q[4] !== j || q[5] !== X || q[6] !== _) {
        A: {
            let L6 = X[j];
            if (!L6 || L6.type === "current") {
                P = z;
                break A
            }
            let y6;
            if (q[8] !== L6) y6 = (R6) => R6.turnIndex === L6.turnIndex,
            q[8] = L6,
            q[9] = y6;
            else y6 = q[9];
            let G6 = _.find(y6);
            if (!G6) {
                P = z;
                break A
            }
            P = iQY(G6)
        }
        q[3] = z,
        q[4] = j,
        q[5] = X,
        q[6] = _,
        q[7] = P
    }
    else P = q[7];
    let W = P,
        Z = X[j],
        G;
    if (q[10] !== Z || q[11] !== _) G = Z?.type === "turn" ? _.find((L6) => L6.turnIndex === Z.turnIndex) : null, q[10] = Z, q[11] = _, q[12] = G;
    else G = q[12];
    let f = G,
        v = W.files[$],
        N;
    if (q[13] !== W.hunks || q[14] !== v) N = v ? W.hunks.get(v.path) || [] : [], q[13] = W.hunks, q[14] = v, q[15] = N;
    else N = q[15];
    let V = N,
        L, h;
    if (q[16] !== j || q[17] !== X.length) L = () => {
        if (j >= X.length) J(Math.max(0, X.length - 1))
    }, h = [X.length, j], q[16] = j, q[17] = X.length, q[18] = L, q[19] = h;
    else L = q[18], h = q[19];
    cl.useEffect(L, h);
    let R = cl.useRef(j),
        u, I;
    if (q[20] !== j) u = () => {
        if (R.current !== j) H(0), R.current = j
    }, I = [j], q[20] = j, q[21] = u, q[22] = I;
    else u = q[21], I = q[22];
    cl.useEffect(u, I), oj("diff-dialog");
    let g, B;
    if (q[23] !== X.length || q[24] !== w) B = () => {
        if (w === "detail") O("list");
        else if (w === "list" && X.length > 1) J(oQY)
    }, g = () => {
        if (w === "list" && X.length > 1) J((L6) => Math.min(X.length - 1, L6 + 1))
    }, q[23] = X.length, q[24] = w, q[25] = g, q[26] = B;
    else g = q[25], B = q[26];
    let b;
    if (q[27] !== w) b = () => {
        if (w === "detail") O("list")
    }, q[27] = w, q[28] = b;
    else b = q[28];
    let p;
    if (q[29] !== v || q[30] !== w) p = () => {
        if (w === "list" && v) O("detail")
    }, q[29] = v, q[30] = w, q[31] = p;
    else p = q[31];
    let Q;
    if (q[32] !== w) Q = () => {
        if (w === "list") H(rQY)
    }, q[32] = w, q[33] = Q;
    else Q = q[33];
    let U;
    if (q[34] !== W.files.length || q[35] !== w) U = () => {
        if (w === "list") H((L6) => Math.min(W.files.length - 1, L6 + 1))
    }, q[34] = W.files.length, q[35] = w, q[36] = U;
    else U = q[36];
    let r;
    if (q[37] !== g || q[38] !== b || q[39] !== p || q[40] !== Q || q[41] !== U || q[42] !== B) r = {
        "diff:previousSource": B,
        "diff:nextSource": g,
        "diff:back": b,
        "diff:viewDetails": p,
        "diff:previousFile": Q,
        "diff:nextFile": U
    }, q[37] = g, q[38] = b, q[39] = p, q[40] = Q, q[41] = U, q[42] = B, q[43] = r;
    else r = q[43];
    let e;
    if (q[44] === Symbol.for("react.memo_cache_sentinel")) e = {
        context: "DiffDialog"
    }, q[44] = e;
    else e = q[44];
    tA(r, e);
    let Y6;
    if (q[45] !== W.stats) Y6 = W.stats ? cw.default.createElement(T, {
        dimColor: !0
    }, W.stats.filesCount, " file", W.stats.filesCount !== 1 ? "s" : "", " changed", W.stats.linesAdded > 0 && cw.default.createElement(T, {
        color: "diffAddedWord"
    }, " +", W.stats.linesAdded), W.stats.linesRemoved > 0 && cw.default.createElement(T, {
        color: "diffRemovedWord"
    }, " -", W.stats.linesRemoved)) : null, q[45] = W.stats, q[46] = Y6;
    else Y6 = q[46];
    let H6 = Y6,
        J6 = f ? `Turn ${f.turnIndex}` : "Uncommitted changes",
        K6 = f ? f.userPromptPreview ? `"${f.userPromptPreview}"` : "" : "(git diff HEAD)",
        s;
    if (q[47] !== j || q[48] !== X || q[49] !== _) s = X.length > 1 ? cw.default.createElement(m, null, j > 0 && cw.default.createElement(T, {
        dimColor: !0
    }, "◀ "), X.map((L6, y6) => {
        let G6 = y6 === j,
            R6 = L6.type === "turn" ? _.find((D6) => D6.turnIndex === L6.turnIndex) : null,
            T6 = L6.type === "current" ? "Current" : `T${R6?.turnIndex??"?"}`;
        return cw.default.createElement(T, {
            key: y6,
            dimColor: !G6,
            bold: G6
        }, y6 > 0 ? " · " : "", T6)
    }), j < X.length - 1 && cw.default.createElement(T, {
        dimColor: !0
    }, " ▶")) : null, q[47] = j, q[48] = X, q[49] = _, q[50] = s;
    else s = q[50];
    let X6 = s,
        z6 = Rq("diff:dismiss", "DiffDialog", "esc"),
        N6;
    A: {
        if (W.loading) {
            N6 = "Loading diff…";
            break A
        }
        if (f) {
            N6 = "No file changes in this turn";
            break A
        }
        if (W.stats && W.stats.filesCount > 0 && W.files.length === 0) {
            N6 = "Too many files to display details";
            break A
        }
        N6 = "Working tree is clean"
    }
    let $6 = N6,
        n;
    if (q[51] !== K6) n = K6 && cw.default.createElement(T, {
        dimColor: !0
    }, " ", K6), q[51] = K6, q[52] = n;
    else n = q[52];
    let o;
    if (q[53] !== J6 || q[54] !== n) o = cw.default.createElement(T, null, J6, n), q[53] = J6, q[54] = n, q[55] = o;
    else o = q[55];
    let a = o,
        i;
    if (q[56] !== Y || q[57] !== w) i = function() {
        if (w === "detail") O("list");
        else Y("Diff dialog dismissed", {
            display: "system"
        })
    }, q[56] = Y, q[57] = w, q[58] = i;
    else i = q[58];
    let l = i,
        q6;
    if (q[59] !== z6 || q[60] !== X.length || q[61] !== w) q6 = (L6) => L6.pending ? cw.default.createElement(T, null, "Press ", L6.keyName, " again to exit") : w === "list" ? cw.default.createElement(C8, null, X.length > 1 && cw.default.createElement(T, null, "←/→ source"), cw.default.createElement(T, null, "↑/↓ select"), cw.default.createElement(T, null, "Enter view"), cw.default.createElement(T, null, z6, " close")) : cw.default.createElement(C8, null, cw.default.createElement(T, null, "← back"), cw.default.createElement(T, null, z6, " close")), q[59] = z6, q[60] = X.length, q[61] = w, q[62] = q6;
    else q6 = q[62];
    let w6;
    if (q[63] !== W.files || q[64] !== $6 || q[65] !== v?.isBinary || q[66] !== v?.isLargeFile || q[67] !== v?.isTruncated || q[68] !== v?.isUntracked || q[69] !== v?.path || q[70] !== V || q[71] !== $ || q[72] !== w) w6 = W.files.length === 0 ? cw.default.createElement(m, {
        marginTop: 1
    }, cw.default.createElement(T, {
        dimColor: !0
    }, $6)) : w === "list" ? cw.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, cw.default.createElement(EYq, {
        files: W.files,
        selectedIndex: $
    })) : cw.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, cw.default.createElement(LYq, {
        filePath: v?.path || "",
        hunks: V,
        isLargeFile: v?.isLargeFile,
        isBinary: v?.isBinary,
        isTruncated: v?.isTruncated,
        isUntracked: v?.isUntracked
    })), q[63] = W.files, q[64] = $6, q[65] = v?.isBinary, q[66] = v?.isLargeFile, q[67] = v?.isTruncated, q[68] = v?.isUntracked, q[69] = v?.path, q[70] = V, q[71] = $, q[72] = w, q[73] = w6;
    else w6 = q[73];
    let O6;
    if (q[74] !== l || q[75] !== X6 || q[76] !== H6 || q[77] !== q6 || q[78] !== w6 || q[79] !== a) O6 = cw.default.createElement(m8, {
        title: a,
        onCancel: l,
        color: "background",
        inputGuide: q6
    }, X6, H6, w6), q[74] = l, q[75] = X6, q[76] = H6, q[77] = q6, q[78] = w6, q[79] = a, q[80] = O6;
    else O6 = q[80];
    return O6
}
// @from(Ln 389598, Col 0)
function rQY(A) {
    return Math.max(0, A - 1)
}
// @from(Ln 389602, Col 0)
function oQY(A) {
    return Math.max(0, A - 1)
}
// @from(Ln 389605, Col 4)
cw
// @from(Ln 389605, Col 8)
cl
// @from(Ln 389606, Col 4)
CYq = E(() => {
    e6();
    i6();
    _7();
    fZ();
    vYq();
    kYq();
    yYq();
    RYq();
    Rj();
    wq();
    Xq();
    cw = t(P6(), 1), cl = t(P6(), 1)
})
// @from(Ln 389620, Col 4)
IYq = {}
// @from(Ln 389624, Col 4)
jU8
// @from(Ln 389624, Col 9)
aQY = async (A, q) => {
    let {
        DiffDialog: K
    } = await Promise.resolve().then(() => (CYq(), SYq));
    return jU8.createElement(K, {
        messages: q.messages,
        onDone: A
    })
}
// @from(Ln 389633, Col 4)
bYq = E(() => {
    jU8 = t(P6(), 1)
})
// @from(Ln 389636, Col 4)
xYq
// @from(Ln 389637, Col 4)
uYq = E(() => {
    xYq = {
        type: "local-jsx",
        name: "diff",
        description: "View uncommitted changes and per-turn diffs",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (bYq(), IYq)),
        userFacingName() {
            return this.name
        }
    }
})
// @from(Ln 389650, Col 4)
mYq
// @from(Ln 389651, Col 4)
BYq = E(() => {
    mYq = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 389659, Col 0)
function dy1() {
    let A = A6(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = Xn6.createElement(T, {
        color: "permission"
    }, "Press ", Xn6.createElement(T, {
        bold: !0
    }, "Enter"), " to continue…"), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 389670, Col 4)
Xn6
// @from(Ln 389671, Col 4)
JU8 = E(() => {
    e6();
    i6();
    Xn6 = t(P6(), 1)
})
// @from(Ln 389677, Col 0)
function ly1() {
    let A = A6(6),
        {
            addNotification: q,
            removeNotification: K
        } = o4(),
        [Y, z] = cy1.useState(sQY),
        _;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) _ = () => {
        let {
            errors: H
        } = Kl();
        z(H)
    }, A[0] = _;
    else _ = A[0];
    u06(_);
    let O, $;
    if (A[1] !== q || A[2] !== Y || A[3] !== K) O = () => {
        if (t4()) return;
        if (Y.length > 0) {
            let H = `Found ${Y.length} settings ${Y.length===1?"issue":"issues"} · /doctor for details`;
            q({
                key: gYq,
                text: H,
                color: "warning",
                priority: "high",
                timeoutMs: 60000
            })
        } else K(gYq)
    }, $ = [Y, q, K], A[1] = q, A[2] = Y, A[3] = K, A[4] = O, A[5] = $;
    else O = A[4], $ = A[5];
    return cy1.useEffect(O, $), Y
}
// @from(Ln 389711, Col 0)
function sQY() {
    let {
        errors: A
    } = Kl();
    return A
}
// @from(Ln 389717, Col 4)
cy1
// @from(Ln 389717, Col 9)
gYq = "settings-errors"
// @from(Ln 389718, Col 4)
MU8 = E(() => {
    e6();
    T1();
    zc6();
    XX1();
    wz();
    cy1 = t(P6(), 1)
})
// @from(Ln 389727, Col 0)
function tQY(A, q, K, Y) {
    if (!A_(A)) return A;
    q = kx(q, A);
    var z = -1,
        _ = q.length,
        w = _ - 1,
        O = A;
    while (O != null && ++z < _) {
        var $ = sE(q[z]),
            H = K;
        if ($ === "__proto__" || $ === "constructor" || $ === "prototype") return A;
        if (z != w) {
            var j = O[$];
            if (H = Y ? Y(j, $, O) : void 0, H === void 0) H = A_(j) ? j : fn(q[z + 1]) ? [] : {}
        }
        yn(O, $, H), O = O[$]
    }
    return A
}
// @from(Ln 389746, Col 4)
FYq
// @from(Ln 389747, Col 4)
pYq = E(() => {
    AE6();
    Lw6();
    yk6();
    AG();
    l86();
    FYq = tQY
})
// @from(Ln 389756, Col 0)
function eQY(A, q, K, Y) {
    return Y = typeof Y == "function" ? Y : void 0, A == null ? A : FYq(A, q, K, Y)
}
// @from(Ln 389759, Col 4)
QYq
// @from(Ln 389760, Col 4)
UYq = E(() => {
    pYq();
    QYq = eQY
})
// @from(Ln 389765, Col 0)
function dYq(A, q = {}) {
    let {
        showValues: K = !0,
        hideFunctions: Y = !1,
        themeName: z = "dark",
        treeCharColors: _ = {}
    } = q, w = [], O = new WeakSet;

    function $(J, M) {
        if (!M) return J;
        return kA(M, z)(J)
    }

    function H(J, M, D, X = 0) {
        if (typeof J === "string") {
            w.push(M + $(J, _.value));
            return
        }
        if (typeof J !== "object" || J === null) {
            if (K) {
                let W = String(J);
                w.push(M + $(W, _.value))
            }
            return
        }
        if (O.has(J)) {
            w.push(M + $("[Circular]", _.value));
            return
        }
        O.add(J);
        let P = Object.keys(J).filter((W) => {
            let Z = J[W];
            if (Y && typeof Z === "function") return !1;
            return !0
        });
        P.forEach((W, Z) => {
            let G = J[W],
                f = Z === P.length - 1,
                v = X === 0 && Z === 0 ? "" : M,
                N = f ? Pn6.lastBranch : Pn6.branch,
                V = $(N, _.treeChar),
                L = W.trim() === "" ? "" : $(W, _.key),
                h = v + V + (L ? " " + L : ""),
                R = W.trim() !== "";
            if (G && typeof G === "object" && O.has(G)) {
                let u = $("[Circular]", _.value);
                w.push(h + (R ? ": " : h ? " " : "") + u)
            } else if (G && typeof G === "object" && !Array.isArray(G)) {
                w.push(h);
                let u = f ? Pn6.empty : Pn6.line,
                    I = $(u, _.treeChar),
                    g = v + I + " ";
                H(G, g, f, X + 1)
            } else if (Array.isArray(G)) w.push(h + (R ? ": " : h ? " " : "") + "[Array(" + G.length + ")]");
            else if (K) {
                let u = typeof G === "function" ? "[Function]" : String(G),
                    I = $(u, _.value);
                h += (R ? ": " : h ? " " : "") + I, w.push(h)
            } else w.push(h)
        })
    }
    let j = Object.keys(A);
    if (j.length === 0) return $("(empty)", _.value);
    if (j.length === 1 && j[0] !== void 0 && j[0].trim() === "" && typeof A[j[0]] === "string") {
        let J = j[0],
            M = $(Pn6.lastBranch, _.treeChar),
            D = $(A[J], _.value);
        return M + " " + D
    }
    return H(A, "", !0), w.join(`
`)
}
// @from(Ln 389837, Col 4)
Pn6
// @from(Ln 389838, Col 4)
cYq = E(() => {
    b7();
    bK6();
    Pn6 = {
        branch: a6.lineUpDownRight,
        lastBranch: a6.lineUpRight,
        line: a6.lineVertical,
        empty: " "
    }
})
// @from(Ln 389849, Col 0)
function AUY(A) {
    let q = {};
    return A.forEach((K) => {
        if (!K.path) {
            q[""] = K.message;
            return
        }
        let Y = K.path.split("."),
            z = K.path;
        if (K.invalidValue !== null && K.invalidValue !== void 0 && Y.length > 0) {
            let _ = [];
            for (let w = 0; w < Y.length; w++) {
                let O = Y[w];
                if (!O) continue;
                let $ = parseInt(O, 10);
                if (!isNaN($) && w === Y.length - 1) {
                    let H;
                    if (typeof K.invalidValue === "string") H = `"${K.invalidValue}"`;
                    else if (K.invalidValue === null) H = "null";
                    else if (K.invalidValue === void 0) H = "undefined";
                    else H = String(K.invalidValue);
                    _.push(H)
                } else _.push(O)
            }
            z = _.join(".")
        }
        QYq(q, z, K.message, Object)
    }), q
}
// @from(Ln 389879, Col 0)
function iy1(A) {
    let q = A6(9),
        {
            errors: K
        } = A,
        [Y] = z7();
    if (K.length === 0) return null;
    let z, _, w;
    if (q[0] !== K || q[1] !== Y) {
        let $ = K.reduce(YUY, {}),
            H = Object.keys($).sort();
        z = m, _ = "column", w = H.map((j) => {
            let J = $[j] || [];
            J.sort(KUY);
            let M = AUY(J),
                D = new Map;
            J.forEach((P) => {
                if (P.suggestion || P.docLink) {
                    let W = `${P.suggestion||""}|${P.docLink||""}`;
                    if (!D.has(W)) D.set(W, {
                        suggestion: P.suggestion,
                        docLink: P.docLink
                    })
                }
            });
            let X = dYq(M, {
                showValues: !0,
                themeName: Y,
                treeCharColors: {
                    treeChar: "inactive",
                    key: "text",
                    value: "inactive"
                }
            });
            return HD.createElement(m, {
                key: j,
                flexDirection: "column"
            }, HD.createElement(T, null, j), HD.createElement(m, {
                marginLeft: 1
            }, HD.createElement(T, {
                dimColor: !0
            }, X)), D.size > 0 && HD.createElement(m, {
                flexDirection: "column",
                marginTop: 1
            }, Array.from(D.values()).map(qUY)))
        }), q[0] = K, q[1] = Y, q[2] = z, q[3] = _, q[4] = w
    } else z = q[2], _ = q[3], w = q[4];
    let O;
    if (q[5] !== z || q[6] !== _ || q[7] !== w) O = HD.createElement(z, {
        flexDirection: _
    }, w), q[5] = z, q[6] = _, q[7] = w, q[8] = O;
    else O = q[8];
    return O
}
// @from(Ln 389934, Col 0)
function qUY(A, q) {
    return HD.createElement(m, {
        key: `suggestion-pair-${q}`,
        flexDirection: "column",
        marginBottom: 1
    }, A.suggestion && HD.createElement(T, {
        dimColor: !0,
        wrap: "wrap"
    }, A.suggestion), A.docLink && HD.createElement(T, {
        dimColor: !0,
        wrap: "wrap"
    }, "Learn more: ", A.docLink))
}
// @from(Ln 389948, Col 0)
function KUY(A, q) {
    if (!A.path && q.path) return -1;
    if (A.path && !q.path) return 1;
    return (A.path || "").localeCompare(q.path || "")
}
// @from(Ln 389954, Col 0)
function YUY(A, q) {
    let K = q.file || "(file not specified)";
    if (!A[K]) A[K] = [];
    return A[K].push(q), A
}
// @from(Ln 389959, Col 4)
HD
// @from(Ln 389960, Col 4)
DU8 = E(() => {
    e6();
    i6();
    UYq();
    cYq();
    HD = t(P6(), 1)
})
// @from(Ln 389968, Col 0)
function zUY(A) {
    let q = A6(26),
        {
            scope: K,
            parsingErrors: Y,
            warnings: z
        } = A,
        _ = Y.length > 0,
        w = z.length > 0;
    if (!_ && !w) return null;
    let O;
    if (q[0] !== _ || q[1] !== w) O = (_ || w) && CO.default.createElement(T, {
        color: _ ? "error" : "warning"
    }, "[", _ ? "Failed to parse" : "Contains warnings", "]", " "), q[0] = _, q[1] = w, q[2] = O;
    else O = q[2];
    let $;
    if (q[3] !== K) $ = OQ6(K), q[3] = K, q[4] = $;
    else $ = q[4];
    let H;
    if (q[5] !== $) H = CO.default.createElement(T, null, $), q[5] = $, q[6] = H;
    else H = q[6];
    let j;
    if (q[7] !== O || q[8] !== H) j = CO.default.createElement(m, null, O, H), q[7] = O, q[8] = H, q[9] = j;
    else j = q[9];
    let J;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) J = CO.default.createElement(T, {
        dimColor: !0
    }, "Location: "), q[10] = J;
    else J = q[10];
    let M;
    if (q[11] !== K) M = PZ(K), q[11] = K, q[12] = M;
    else M = q[12];
    let D;
    if (q[13] !== M) D = CO.default.createElement(m, null, J, CO.default.createElement(T, {
        dimColor: !0
    }, M)), q[13] = M, q[14] = D;
    else D = q[14];
    let X;
    if (q[15] !== Y) X = Y.map(wUY), q[15] = Y, q[16] = X;
    else X = q[16];
    let P;
    if (q[17] !== z) P = z.map(_UY), q[17] = z, q[18] = P;
    else P = q[18];
    let W;
    if (q[19] !== X || q[20] !== P) W = CO.default.createElement(m, {
        marginLeft: 1,
        flexDirection: "column"
    }, X, P), q[19] = X, q[20] = P, q[21] = W;
    else W = q[21];
    let Z;
    if (q[22] !== W || q[23] !== j || q[24] !== D) Z = CO.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, j, D, W), q[22] = W, q[23] = j, q[24] = D, q[25] = Z;
    else Z = q[25];
    return Z
}
// @from(Ln 390026, Col 0)
function _UY(A, q) {
    let K = A.mcpErrorMetadata?.serverName;
    return CO.default.createElement(m, {
        key: `warning-${q}`
    }, CO.default.createElement(T, null, CO.default.createElement(T, {
        dimColor: !0
    }, "└ "), CO.default.createElement(T, {
        color: "warning"
    }, "[Warning]"), CO.default.createElement(T, {
        dimColor: !0
    }, " ", K && `[${K}] `, A.path && A.path !== "" ? `${A.path}: ` : "", A.message)))
}
// @from(Ln 390039, Col 0)
function wUY(A, q) {
    let K = A.mcpErrorMetadata?.serverName;
    return CO.default.createElement(m, {
        key: `error-${q}`
    }, CO.default.createElement(T, null, CO.default.createElement(T, {
        dimColor: !0
    }, "└ "), CO.default.createElement(T, {
        color: "error"
    }, "[Error]"), CO.default.createElement(T, {
        dimColor: !0
    }, " ", K && `[${K}] `, A.path && A.path !== "" ? `${A.path}: ` : "", A.message)))
}
// @from(Ln 390052, Col 0)
function ry1() {
    let A = A6(2),
        q, K;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) {
        K = Symbol.for("react.early_return_sentinel");
        A: {
            let Y = dj("user"),
                z = dj("project"),
                _ = dj("local"),
                w = dj("enterprise"),
                O = [{
                    scope: "user",
                    config: Y
                }, {
                    scope: "project",
                    config: z
                }, {
                    scope: "local",
                    config: _
                }, {
                    scope: "enterprise",
                    config: w
                }],
                $ = O.some(HUY),
                H = O.some($UY);
            if (!$ && !H) {
                K = null;
                break A
            }
            q = CO.default.createElement(m, {
                flexDirection: "column",
                marginTop: 1,
                marginBottom: 1
            }, CO.default.createElement(T, {
                bold: !0
            }, "MCP Config Diagnostics"), CO.default.createElement(m, {
                marginTop: 1
            }, CO.default.createElement(T, {
                dimColor: !0
            }, "For help configuring MCP servers, see:", " ", CO.default.createElement(y7, {
                url: "https://code.claude.com/docs/en/mcp"
            }, "https://code.claude.com/docs/en/mcp"))), O.map(OUY))
        }
        A[0] = q, A[1] = K
    } else q = A[0], K = A[1];
    if (K !== Symbol.for("react.early_return_sentinel")) return K;
    return q
}
// @from(Ln 390101, Col 0)
function OUY(A) {
    let {
        scope: q,
        config: K
    } = A;
    return CO.default.createElement(zUY, {
        key: q,
        scope: q,
        parsingErrors: ny1(K.errors, "fatal"),
        warnings: ny1(K.errors, "warning")
    })
}
// @from(Ln 390114, Col 0)
function $UY(A) {
    let {
        config: q
    } = A;
    return ny1(q.errors, "warning").length > 0
}
// @from(Ln 390121, Col 0)
function HUY(A) {
    let {
        config: q
    } = A;
    return ny1(q.errors, "fatal").length > 0
}
// @from(Ln 390128, Col 0)
function ny1(A, q) {
    return A.filter((K) => K.mcpErrorMetadata?.severity === q)
}
// @from(Ln 390131, Col 4)
CO
// @from(Ln 390132, Col 4)
XU8 = E(() => {
    e6();
    i6();
    WZ();
    qM();
    i6();
    CO = t(P6(), 1)
})
// @from(Ln 390141, Col 0)
function lYq() {
    let A = A6(2);
    if (!pk()) return null;
    let q, K;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) {
        K = Symbol.for("react.early_return_sentinel");
        A: {
            let Y = F34();
            if (Y.length === 0) {
                K = null;
                break A
            }
            let z = Y.filter(DUY),
                _ = Y.filter(MUY);q = wJ.default.createElement(m, {
                flexDirection: "column",
                marginTop: 1,
                marginBottom: 1
            }, wJ.default.createElement(T, {
                bold: !0,
                color: z.length > 0 ? "error" : "warning"
            }, "Keybinding Configuration Issues"), wJ.default.createElement(m, null, wJ.default.createElement(T, {
                dimColor: !0
            }, "Location: "), wJ.default.createElement(T, {
                dimColor: !0
            }, b36())), wJ.default.createElement(m, {
                marginLeft: 1,
                flexDirection: "column",
                marginTop: 1
            }, z.map(JUY), _.map(jUY)))
        }
        A[0] = q, A[1] = K
    } else q = A[0], K = A[1];
    if (K !== Symbol.for("react.early_return_sentinel")) return K;
    return q
}
// @from(Ln 390177, Col 0)
function jUY(A, q) {
    return wJ.default.createElement(m, {
        key: `warning-${q}`,
        flexDirection: "column"
    }, wJ.default.createElement(m, null, wJ.default.createElement(T, {
        dimColor: !0
    }, "└ "), wJ.default.createElement(T, {
        color: "warning"
    }, "[Warning]"), wJ.default.createElement(T, {
        dimColor: !0
    }, " ", A.message)), A.suggestion && wJ.default.createElement(m, {
        marginLeft: 3
    }, wJ.default.createElement(T, {
        dimColor: !0
    }, "→ ", A.suggestion)))
}
// @from(Ln 390194, Col 0)
function JUY(A, q) {
    return wJ.default.createElement(m, {
        key: `error-${q}`,
        flexDirection: "column"
    }, wJ.default.createElement(m, null, wJ.default.createElement(T, {
        dimColor: !0
    }, "└ "), wJ.default.createElement(T, {
        color: "error"
    }, "[Error]"), wJ.default.createElement(T, {
        dimColor: !0
    }, " ", A.message)), A.suggestion && wJ.default.createElement(m, {
        marginLeft: 3
    }, wJ.default.createElement(T, {
        dimColor: !0
    }, "→ ", A.suggestion)))
}
// @from(Ln 390211, Col 0)
function MUY(A) {
    return A.severity === "warning"
}
// @from(Ln 390215, Col 0)
function DUY(A) {
    return A.severity === "error"
}
// @from(Ln 390218, Col 4)
wJ
// @from(Ln 390219, Col 4)
iYq = E(() => {
    e6();
    i6();
    cd();
    wJ = t(P6(), 1)
})
// @from(Ln 390226, Col 0)
function Wn6(A) {
    if (!A) return 0;
    return A.activeAgents.filter((q) => q.source !== "built-in").reduce((q, K) => {
        let Y = `${K.agentType}: ${K.whenToUse}`;
        return q + j5(Y)
    }, 0)
}
// @from(Ln 390233, Col 4)
tz6 = 15000
// @from(Ln 390234, Col 4)
PU8 = E(() => {
    Hf()
})
// @from(Ln 390238, Col 0)
function XUY(A) {
    return A === "projectSettings" || A === "policySettings" || A === "command"
}
// @from(Ln 390242, Col 0)
function oy1(A) {
    return Zn6(A)
}
// @from(Ln 390246, Col 0)
function nYq(A, q, K) {
    let Y = oy1(q.source),
        z = oy1(K.source),
        _ = q.ruleValue.toolName;
    if (A === "deny") return `Remove the "${_}" deny rule from ${Y}, or remove the specific allow rule from ${z}`;
    return `Remove the "${_}" ask rule from ${Y}, or remove the specific allow rule from ${z}`
}
// @from(Ln 390254, Col 0)
function PUY(A, q, K) {
    let {
        toolName: Y,
        ruleContent: z
    } = A.ruleValue;
    if (z === void 0) return {
        shadowed: !1
    };
    let _ = q.find((w) => w.ruleValue.toolName === Y && w.ruleValue.ruleContent === void 0);
    if (!_) return {
        shadowed: !1
    };
    if (Y === Q7 && K.sandboxAutoAllowEnabled) {
        if (!XUY(_.source)) return {
            shadowed: !1
        }
    }
    return {
        shadowed: !0,
        shadowedBy: _,
        shadowType: "ask"
    }
}
// @from(Ln 390278, Col 0)
function WUY(A, q) {
    let {
        toolName: K,
        ruleContent: Y
    } = A.ruleValue;
    if (Y === void 0) return {
        shadowed: !1
    };
    let z = q.find((_) => _.ruleValue.toolName === K && _.ruleValue.ruleContent === void 0);
    if (!z) return {
        shadowed: !1
    };
    return {
        shadowed: !0,
        shadowedBy: z,
        shadowType: "deny"
    }
}
// @from(Ln 390297, Col 0)
function Ev6(A, q) {
    let K = [],
        Y = yv6(A),
        z = Lv6(A),
        _ = KF(A);
    for (let w of Y) {
        let O = WUY(w, _);
        if (O.shadowed) {
            let H = oy1(O.shadowedBy.source);
            K.push({
                rule: w,
                reason: `Blocked by "${O.shadowedBy.ruleValue.toolName}" deny rule (from ${H})`,
                shadowedBy: O.shadowedBy,
                shadowType: "deny",
                fix: nYq("deny", O.shadowedBy, w)
            });
            continue
        }
        let $ = PUY(w, z, q);
        if ($.shadowed) {
            let H = oy1($.shadowedBy.source);
            K.push({
                rule: w,
                reason: `Shadowed by "${$.shadowedBy.ruleValue.toolName}" ask rule (from ${H})`,
                shadowedBy: $.shadowedBy,
                shadowType: "ask",
                fix: nYq("ask", $.shadowedBy, w)
            })
        }
    }
    return K
}
// @from(Ln 390329, Col 4)
ay1 = E(() => {
    Bj()
})
// @from(Ln 390332, Col 0)
async function ZUY() {
    let A = Pt();
    if (A.length === 0) return null;
    let q = A.sort((Y, z) => z.content.length - Y.content.length).map((Y) => `${Y.path}: ${Y.content.length.toLocaleString()} chars`);
    return {
        type: "claudemd_files",
        severity: "warning",
        message: A.length === 1 ? `Large CLAUDE.md file detected (${A[0].content.length.toLocaleString()} chars > ${JB.toLocaleString()})` : `${A.length} large CLAUDE.md files detected (each > ${JB.toLocaleString()} chars)`,
        details: q,
        currentValue: A.length,
        threshold: JB
    }
}
// @from(Ln 390345, Col 0)
async function GUY(A) {
    if (!A) return null;
    let q = Wn6(A);
    if (q <= tz6) return null;
    let K = A.activeAgents.filter((z) => z.source !== "built-in").map((z) => {
            let _ = `${z.agentType}: ${z.whenToUse}`;
            return {
                name: z.agentType,
                tokens: j5(_)
            }
        }).sort((z, _) => _.tokens - z.tokens),
        Y = K.slice(0, 5).map((z) => `${z.name}: ~${z.tokens.toLocaleString()} tokens`);
    if (K.length > 5) Y.push(`(${K.length-5} more custom agents)`);
    return {
        type: "agent_descriptions",
        severity: "warning",
        message: `Large agent descriptions (~${q.toLocaleString()} tokens > ${tz6.toLocaleString()})`,
        details: Y,
        currentValue: q,
        threshold: tz6
    }
}
// @from(Ln 390367, Col 0)
async function fUY(A, q, K) {
    let Y = A.filter((z) => z.isMcp);
    if (Y.length === 0) return null;
    try {
        let z = cK(),
            {
                mcpToolTokens: _,
                mcpToolDetails: w
            } = await WU8(A, q, K, z);
        if (_ <= Rv6) return null;
        let O = new Map;
        for (let j of w) {
            let M = j.name.split("__")[1] || "unknown",
                D = O.get(M) || {
                    count: 0,
                    tokens: 0
                };
            O.set(M, {
                count: D.count + 1,
                tokens: D.tokens + j.tokens
            })
        }
        let $ = Array.from(O.entries()).sort((j, J) => J[1].tokens - j[1].tokens),
            H = $.slice(0, 5).map(([j, J]) => `${j}: ${J.count} tools (~${J.tokens.toLocaleString()} tokens)`);
        if ($.length > 5) H.push(`(${$.length-5} more servers)`);
        return {
            type: "mcp_tools",
            severity: "warning",
            message: `Large MCP tools context (~${_.toLocaleString()} tokens > ${Rv6.toLocaleString()})`,
            details: H,
            currentValue: _,
            threshold: Rv6
        }
    } catch (z) {
        let _ = Y.reduce((w, O) => {
            let $ = (O.name?.length || 0) + O.description.length;
            return w + j5($.toString())
        }, 0);
        if (_ <= Rv6) return null;
        return {
            type: "mcp_tools",
            severity: "warning",
            message: `Large MCP tools context (~${_.toLocaleString()} tokens estimated > ${Rv6.toLocaleString()})`,
            details: [`${Y.length} MCP tools detected (token count estimated)`],
            currentValue: _,
            threshold: Rv6
        }
    }
}
// @from(Ln 390416, Col 0)
async function TUY(A) {
    let q = await A(),
        K = vA.isSandboxingEnabled() && vA.isAutoAllowBashIfSandboxedEnabled(),
        Y = Ev6(q, {
            sandboxAutoAllowEnabled: K
        });
    if (Y.length === 0) return null;
    let z = Y.flatMap((_) => [`${L5(_.rule.ruleValue)}: ${_.reason}`, `  Fix: ${_.fix}`]);
    return {
        type: "unreachable_rules",
        severity: "warning",
        message: `${Y.length} unreachable permission rule${Y.length===1?"":"s"} detected`,
        details: z,
        currentValue: Y.length,
        threshold: 0
    }
}
// @from(Ln 390433, Col 0)
async function rYq(A, q, K) {
    let [Y, z, _, w] = await Promise.all([ZUY(), GUY(q), fUY(A, K, q), TUY(K)]);
    return {
        claudeMdWarning: Y,
        agentWarning: z,
        mcpWarning: _,
        unreachableRulesWarning: w
    }
}
// @from(Ln 390442, Col 4)
Rv6 = 25000
// @from(Ln 390443, Col 4)
oYq = E(() => {
    lM();
    PU8();
    Mn6();
    Hf();
    z4();
    ay1();
    Lz();
    SP()
})
// @from(Ln 390454, Col 0)
function aYq() {
    let A = A6(2);
    if (!vA.isSupportedPlatform()) return null;
    if (!vA.isSandboxEnabledInSettings()) return null;
    let q, K;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) {
        K = Symbol.for("react.early_return_sentinel");
        A: {
            let Y = vA.checkDependencies(),
                z = Y.errors.length > 0,
                _ = Y.warnings.length > 0;
            if (!z && !_) {
                K = null;
                break A
            }
            q = UX.default.createElement(m, {
                flexDirection: "column"
            }, UX.default.createElement(T, {
                bold: !0
            }, "Sandbox"), UX.default.createElement(T, null, "└ Status: ", UX.default.createElement(T, {
                color: z ? "error" : "warning"
            }, z ? "Missing dependencies" : "Available (with warnings)")), Y.errors.map(NUY), Y.warnings.map(vUY), z && UX.default.createElement(T, {
                dimColor: !0
            }, "└ Run /sandbox for install instructions"))
        }
        A[0] = q, A[1] = K
    } else q = A[0], K = A[1];
    if (K !== Symbol.for("react.early_return_sentinel")) return K;
    return q
}
// @from(Ln 390485, Col 0)
function vUY(A, q) {
    return UX.default.createElement(T, {
        key: q,
        color: "warning"
    }, "└ ", A)
}
// @from(Ln 390492, Col 0)
function NUY(A, q) {
    return UX.default.createElement(T, {
        key: q,
        color: "error"
    }, "└ ", A)
}
// @from(Ln 390498, Col 4)
UX
// @from(Ln 390499, Col 4)
sYq = E(() => {
    e6();
    i6();
    Lz();
    UX = t(P6(), 1)
})
// @from(Ln 390505, Col 4)
tYq = {}
// @from(Ln 390513, Col 0)
function VUY(A) {
    let q = A6(8),
        {
            promise: K
        } = A,
        Y = UA.use(K);
    if (!Y.latest) {
        let O;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = UA.default.createElement(T, {
            dimColor: !0
        }, "└ Failed to fetch versions"), q[0] = O;
        else O = q[0];
        return O
    }
    let z;
    if (q[1] !== Y.stable) z = Y.stable && UA.default.createElement(T, null, "└ Stable version: ", Y.stable), q[1] = Y.stable, q[2] = z;
    else z = q[2];
    let _;
    if (q[3] !== Y.latest) _ = UA.default.createElement(T, null, "└ Latest version: ", Y.latest), q[3] = Y.latest, q[4] = _;
    else _ = q[4];
    let w;
    if (q[5] !== z || q[6] !== _) w = UA.default.createElement(UA.default.Fragment, null, z, _), q[5] = z, q[6] = _, q[7] = w;
    else w = q[7];
    return w
}