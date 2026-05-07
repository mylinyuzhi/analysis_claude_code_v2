
// @from(Ln 350061, Col 0)
function nC6(q) {
    let K = SqY();
    if (!K) return null;
    switch (q) {
        case "warning":
            return `/model ${K.alias}`;
        case "tip":
            return `Tip: You have access to ${K.name} with ${K.multiplier}x more context`;
        default:
            return null
    }
}
// @from(Ln 350073, Col 4)
Ig8 = L(() => {
    bg8();
    Sq()
})
// @from(Ln 350078, Col 0)
function y96(q) {
    let K = s(3),
        _ = OO.useContext(H$K),
        z;
    if (K[0] !== q || K[1] !== _) z = q ? _.get(q) : void 0, K[0] = q, K[1] = _, K[2] = z;
    else z = K[2];
    return z
}
// @from(Ln 350087, Col 0)
function xg8() {
    return OO.useContext(J$K)
}
// @from(Ln 350091, Col 0)
function ug8() {
    return OO.useContext(X$K)
}
// @from(Ln 350095, Col 0)
function W$K() {
    return OO.useContext(M$K)
}
// @from(Ln 350099, Col 0)
function D$K() {
    return OO.useContext(P$K)
}
// @from(Ln 350103, Col 0)
function i77({
    children: q
}) {
    let [K, _] = OO.useState(null), [z, Y] = OO.useState(null), [A, O] = OO.useState(j$K), w = OO.useRef(A);
    w.current = A;
    let {
        addNotification: $
    } = EK(), j = OO.useRef(null);
    OO.useEffect(() => () => {
        if (j.current) clearTimeout(j.current)
    }, []);
    let H = OO.useCallback((X) => {
            if (j.current) clearTimeout(j.current), j.current = null;
            if (X === null) j.current = setTimeout((M) => M(null), 500, Y);
            else Y(X)
        }, []),
        J = OO.useCallback((X, M, P = "tool_use", W) => {
            let D = w.current.get(X) === M;
            if (O((Z) => {
                    let G = new Map(Z);
                    if (D) G.delete(X);
                    else G.set(X, M);
                    return G
                }), d("tengu_message_rated", {
                    ...W,
                    message_uuid: X,
                    sentiment: M,
                    surface: P,
                    cleared: D
                }), !D) $({
                key: "message-rated",
                text: "thanks for improving claude!",
                color: "success",
                priority: "immediate"
            })
        }, [$]);
    return OO.default.createElement(dl.Provider, {
        value: J
    }, OO.default.createElement(H$K.Provider, {
        value: A
    }, OO.default.createElement(X$K.Provider, {
        value: _
    }, OO.default.createElement(J$K.Provider, {
        value: K
    }, OO.default.createElement(P$K.Provider, {
        value: H
    }, OO.default.createElement(M$K.Provider, {
        value: z
    }, q))))))
}
// @from(Ln 350153, Col 4)
OO
// @from(Ln 350153, Col 8)
dl
// @from(Ln 350153, Col 12)
j$K
// @from(Ln 350153, Col 17)
H$K
// @from(Ln 350153, Col 22)
J$K
// @from(Ln 350153, Col 27)
X$K
// @from(Ln 350153, Col 32)
M$K
// @from(Ln 350153, Col 37)
P$K
// @from(Ln 350154, Col 4)
iC6 = L(() => {
    o6();
    kY();
    C8();
    OO = K6(P6(), 1), dl = OO.createContext(null), j$K = new Map, H$K = OO.createContext(j$K);
    J$K = OO.createContext(null), X$K = OO.createContext(null);
    M$K = OO.createContext(null), P$K = OO.createContext(null)
})
// @from(Ln 350163, Col 0)
function s2() {
    let q = M8((Y) => Y.mainLoopModel),
        K = M8((Y) => Y.mainLoopModelForSession),
        [, _] = mg8.useReducer((Y) => Y + 1, 0);
    return mg8.useEffect(() => A$6(_), []), K5(K ?? q ?? hv())
}
// @from(Ln 350169, Col 4)
mg8
// @from(Ln 350170, Col 4)
oy = L(() => {
    B1();
    N7();
    Sq();
    mg8 = K6(P6(), 1)
})
// @from(Ln 350176, Col 0)
async function NK8(q, K) {
    if (r77) return;
    if (r77 = !0, !q.isBypassPermissionsModeAvailable) return;
    if (!await Bg8()) return;
    K((z) => {
        return {
            ...z,
            toolPermissionContext: NJ6(z.toolPermissionContext)
        }
    })
}
// @from(Ln 350188, Col 0)
function Z$K() {
    r77 = !1
}
// @from(Ln 350192, Col 0)
function f$K() {
    let q = M8((_) => _.toolPermissionContext),
        K = R7();
    kK8.useEffect(() => {
        if (nK()) return;
        NK8(q, K)
    }, [])
}
// @from(Ln 350200, Col 0)
async function EK8(q, K, _) {
    {
        if (o77) return;
        o77 = !0;
        let {
            updateContext: z,
            notification: Y
        } = await yK8(q, _);
        K((A) => {
            let O = z(A.toolPermissionContext),
                w = O === A.toolPermissionContext ? A : {
                    ...A,
                    toolPermissionContext: O
                };
            if (!Y) return w;
            return {
                ...w,
                notifications: {
                    ...w.notifications,
                    queue: [...w.notifications.queue, {
                        key: "auto-mode-gate-notification",
                        text: Y,
                        color: "warning",
                        priority: "high"
                    }]
                }
            }
        })
    }
}
// @from(Ln 350231, Col 0)
function a77() {
    o77 = !1
}
// @from(Ln 350235, Col 0)
function G$K() {
    let q = M8((O) => O.mainLoopModel),
        K = M8((O) => O.mainLoopModelForSession),
        _ = M8((O) => O.fastMode),
        z = R7(),
        Y = H9(),
        A = kK8.useRef(!0);
    kK8.useEffect(() => {
        if (nK()) return;
        if (A.current) A.current = !1;
        else a77();
        EK8(Y.getState().toolPermissionContext, z, _)
    }, [q, K, _])
}
// @from(Ln 350249, Col 4)
kK8
// @from(Ln 350249, Col 9)
r77 = !1
// @from(Ln 350250, Col 4)
o77 = !1
// @from(Ln 350251, Col 4)
s77 = L(() => {
    N7();
    y8();
    vX();
    kK8 = K6(P6(), 1)
})
// @from(Ln 350257, Col 4)
v$K = {}
// @from(Ln 350262, Col 0)
async function CqY(q, K) {
    return uF.createElement(rC6, {
        onDone: async (_) => {
            if (K.onChangeAPIKey(), K.setMessages(t77), _) {
                VD6(), V78(), LK8(), Rk6(), O$6(), io1(), ro1(), Z$K();
                let z = K.getAppState();
                NK8(z.toolPermissionContext, K.setAppState), a77(), EK8(z.toolPermissionContext, K.setAppState, z.fastMode), K.setAppState((Y) => ({
                    ...Y,
                    authVersion: Y.authVersion + 1
                }))
            }
            q(_ ? "Login successful" : "Login interrupted")
        }
    })
}
// @from(Ln 350278, Col 0)
function rC6(q) {
    let K = s(13),
        _ = s2(),
        z = bP(),
        Y;
    if (K[0] !== _ || K[1] !== q) Y = () => q.onDone(!1, _), K[0] = _, K[1] = q, K[2] = Y;
    else Y = K[2];
    let A;
    if (K[3] !== _ || K[4] !== q) A = () => q.onDone(!0, _), K[3] = _, K[4] = q, K[5] = A;
    else A = K[5];
    let O = z ? hB1 : LB1,
        w;
    if (K[6] !== q.startingMessage || K[7] !== A || K[8] !== O) w = uF.createElement(RX6, {
        onDone: A,
        startingMessage: q.startingMessage,
        urlOutdent: O
    }), K[6] = q.startingMessage, K[7] = A, K[8] = O, K[9] = w;
    else w = K[9];
    let $;
    if (K[10] !== Y || K[11] !== w) $ = uF.createElement(R1, {
        title: "Login",
        onCancel: Y,
        color: "permission",
        inputGuide: bqY
    }, w), K[10] = Y, K[11] = w, K[12] = $;
    else $ = K[12];
    return $
}
// @from(Ln 350307, Col 0)
function bqY(q) {
    return q.pending ? uF.createElement(T, null, "Press ", q.keyName, " again to exit") : uF.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })
}
// @from(Ln 350315, Col 4)
uF
// @from(Ln 350316, Col 4)
pg8 = L(() => {
    o6();
    y8();
    kJ6();
    bK();
    c48();
    S4();
    DJ();
    Mk();
    oy();
    g6();
    B1();
    J2();
    tR6();
    _7();
    s77();
    B26();
    uF = K6(P6(), 1)
})
// @from(Ln 350335, Col 0)
async function T$K(q) {
    let {
        accessToken: K,
        orgUUID: _
    } = await TX(), z = {
        ...bA(K),
        "x-organization-uuid": _
    }, Y = `${r7().BASE_API_URL}/api/oauth/organizations/${_}/admin_requests`;
    return (await Z1.post(Y, q, {
        headers: z
    })).data
}
// @from(Ln 350347, Col 0)
async function V$K(q, K) {
    let {
        accessToken: _,
        orgUUID: z
    } = await TX(), Y = {
        ...bA(_),
        "x-organization-uuid": z
    }, A = `${r7().BASE_API_URL}/api/oauth/organizations/${z}/admin_requests/me?request_type=${q}`;
    for (let w of K) A += `&statuses=${w}`;
    return (await Z1.get(A, {
        headers: Y
    })).data
}
// @from(Ln 350360, Col 0)
async function k$K(q) {
    let {
        accessToken: K,
        orgUUID: _
    } = await TX(), z = {
        ...bA(K),
        "x-organization-uuid": _
    }, Y = `${r7().BASE_API_URL}/api/oauth/organizations/${_}/admin_requests/eligibility?request_type=${q}`;
    return (await Z1.get(Y, {
        headers: z
    })).data
}
// @from(Ln 350372, Col 4)
N$K = L(() => {
    CK();
    z3();
    VX()
})
// @from(Ln 350377, Col 0)
async function IqY() {
    try {
        let {
            accessToken: q,
            orgUUID: K
        } = await TX(), _ = `${r7().BASE_API_URL}/api/oauth/organizations/${K}/overage_credit_grant`;
        return (await Z1.get(_, {
            headers: bA(q)
        })).data
    } catch (q) {
        return j6(q), null
    }
}
// @from(Ln 350391, Col 0)
function rX6() {
    let q = k_()?.organizationUuid;
    if (!q) return null;
    let K = H8().overageCreditGrantCache?.[q];
    if (!K) return null;
    if (Date.now() - K.timestamp > E$K) return null;
    return K.info
}
// @from(Ln 350400, Col 0)
function y$K() {
    let q = k_()?.organizationUuid;
    if (!q) return;
    let K = H8().overageCreditGrantCache;
    if (!K || !(q in K)) return;
    d8((_) => {
        let z = {
            ..._.overageCreditGrantCache
        };
        return delete z[q], {
            ..._,
            overageCreditGrantCache: z
        }
    })
}
// @from(Ln 350415, Col 0)
async function L$K() {
    if (o3()) return;
    let q = k_()?.organizationUuid;
    if (!q) return;
    let K = await IqY();
    if (!K) return;
    d8((_) => {
        let z = _.overageCreditGrantCache?.[q],
            Y = z?.info,
            A = Y && Y.available === K.available && Y.eligible === K.eligible && Y.granted === K.granted && Y.amount_minor_units === K.amount_minor_units && Y.currency === K.currency;
        if (A && z && Date.now() - z.timestamp <= E$K) return _;
        let O = {
            info: A ? Y : K,
            timestamp: Date.now()
        };
        return {
            ..._,
            overageCreditGrantCache: {
                ..._.overageCreditGrantCache,
                [q]: O
            }
        }
    })
}
// @from(Ln 350440, Col 0)
function oC6(q) {
    if (q.amount_minor_units == null || !q.currency) return null;
    if (q.currency.toUpperCase() === "USD") {
        let K = q.amount_minor_units / 100;
        return Number.isInteger(K) ? `$${K}` : `$${K.toFixed(2)}`
    }
    return null
}
// @from(Ln 350448, Col 4)
E$K = 3600000
// @from(Ln 350449, Col 4)
Fg8 = L(() => {
    CK();
    z3();
    T7();
    h1();
    U8();
    G$();
    VX()
})
// @from(Ln 350458, Col 0)
async function gg8() {
    if (!i7() || !AD()) return {};
    let q = o7();
    if (q && XQ(q.expiresAt)) return null;
    let K = OH();
    if (K.error) throw Error(`Auth error: ${K.error}`);
    let _ = {
            "Content-Type": "application/json",
            "User-Agent": yA(),
            ...K.headers
        },
        z = `${r7().BASE_API_URL}/api/oauth/usage`;
    return (await Z1.get(z, {
        headers: _,
        timeout: 5000
    })).data
}
// @from(Ln 350475, Col 4)
e77 = L(() => {
    CK();
    z3();
    T7();
    Zf();
    YD()
})
// @from(Ln 350483, Col 0)
function xqY() {
    if (!H8().hasVisitedExtraUsage) d8((q) => ({
        ...q,
        hasVisitedExtraUsage: !0
    }));
    y$K()
}
// @from(Ln 350490, Col 0)
async function Ug8() {
    xqY();
    let q = MK(),
        K = q === "team" || q === "enterprise";
    if (!Ib() && K) {
        let Y;
        try {
            Y = (await gg8())?.extra_usage
        } catch (A) {
            j6(A)
        }
        if (Y?.is_enabled && Y.monthly_limit === null) return {
            type: "message",
            value: "Your organization already has unlimited extra usage. No request needed."
        };
        try {
            if ((await k$K("limit_increase"))?.is_allowed === !1) return {
                type: "message",
                value: "Please contact your admin to manage extra usage settings."
            }
        } catch (A) {
            j6(A)
        }
        try {
            let A = await V$K("limit_increase", ["pending", "dismissed"]);
            if (A && A.length > 0) return {
                type: "message",
                value: "You have already submitted a request for extra usage to your admin."
            }
        } catch (A) {
            j6(A)
        }
        try {
            return await T$K({
                request_type: "limit_increase",
                details: null
            }), {
                type: "message",
                value: Y?.is_enabled ? "Request sent to your admin to increase extra usage." : "Request sent to your admin to enable extra usage."
            }
        } catch (A) {
            j6(A)
        }
        return {
            type: "message",
            value: "Please contact your admin to manage extra usage settings."
        }
    }
    let z = K ? "https://claude.ai/admin-settings/usage" : "https://claude.ai/settings/usage";
    try {
        let Y = await J3(z);
        return {
            type: "browser-opened",
            url: z,
            opened: Y
        }
    } catch (Y) {
        return j6(Y), {
            type: "message",
            value: `Failed to open browser. Please visit ${z} to manage extra usage.`
        }
    }
}
// @from(Ln 350553, Col 4)
qq7 = L(() => {
    N$K();
    Fg8();
    e77();
    T7();
    HQ();
    Nj();
    h1();
    U8()
})
// @from(Ln 350563, Col 4)
R$K = {}
// @from(Ln 350567, Col 0)
async function Kq7(q, K) {
    let _ = await Ug8();
    if (_.type === "message") return q(_.value), null;
    return h$K.default.createElement(rC6, {
        startingMessage: "Starting new login following /extra-usage. Exit with Ctrl-C to use existing account.",
        onDone: (z) => {
            K.onChangeAPIKey(), q(z ? "Login successful" : "Login interrupted")
        }
    })
}
// @from(Ln 350577, Col 4)
h$K
// @from(Ln 350578, Col 4)
_q7 = L(() => {
    B1();
    dl6();
    T7();
    G$();
    pg8();
    qq7();
    h$K = K6(P6(), 1)
})
// @from(Ln 350587, Col 4)
S$K = {}
// @from(Ln 350591, Col 0)
async function uqY() {
    let q = await Ug8();
    if (q.type === "message") return {
        type: "text",
        value: q.value
    };
    return {
        type: "text",
        value: q.opened ? `Browser opened to manage extra usage. If it didn't open, visit: ${q.url}` : `Please visit ${q.url} to manage extra usage.`
    }
}
// @from(Ln 350602, Col 4)
C$K = L(() => {
    qq7()
})
// @from(Ln 350606, Col 0)
function Qg8() {
    if (S6(process.env.DISABLE_EXTRA_USAGE_COMMAND)) return !1;
    if (ZMq() !== null) return !0;
    return Lk6()
}
// @from(Ln 350611, Col 4)
L96
// @from(Ln 350611, Col 9)
b$K
// @from(Ln 350612, Col 4)
aC6 = L(() => {
    y8();
    dl6();
    T7();
    Q8();
    L96 = {
        type: "local-jsx",
        name: "extra-usage",
        description: "Configure extra usage to keep working when limits are hit",
        isEnabled: () => Qg8() && !I7(),
        load: () => Promise.resolve().then(() => (_q7(), R$K))
    }, b$K = {
        type: "local",
        name: "extra-usage",
        supportsNonInteractive: !0,
        description: "Configure extra usage to keep working when limits are hit",
        isEnabled: () => Qg8() && I7(),
        get isHidden() {
            return !I7()
        },
        load: () => Promise.resolve().then(() => (C$K(), S$K))
    }
})
// @from(Ln 350636, Col 0)
function h96() {
    let [q, K] = dg8.useState({
        ...Zk
    });
    return dg8.useEffect(() => {
        let _ = (z) => {
            K({
                ...z
            })
        };
        return ZK6.add(_), () => {
            ZK6.delete(_)
        }
    }, []), q
}
// @from(Ln 350651, Col 4)
dg8
// @from(Ln 350652, Col 4)
hK8 = L(() => {
    dI();
    dg8 = K6(P6(), 1)
})
// @from(Ln 350657, Col 0)
function mqY({
    shouldShowUpsell: q,
    isMax20x: K,
    isExtraUsageCommandEnabled: _,
    shouldAutoOpenRateLimitOptionsMenu: z,
    isTeamOrEnterprise: Y,
    hasBillingAccess: A,
    serverHidesUpgrade: O,
    serverHidesOverage: w
}) {
    if (!q) return null;
    if (z) return "Opening your options…";
    let $ = _ && !w;
    if (K) {
        if ($) return "/extra-usage to finish what you’re working on.";
        return "/login to switch to an API usage-billed account."
    }
    if (Y) {
        if (!$) return null;
        if (A) return "/extra-usage to finish what you’re working on.";
        return "/extra-usage to request more usage from your admin."
    }
    if (O) {
        if ($) return "/extra-usage to finish what you’re working on.";
        return null
    }
    if (!$) return "/upgrade to increase your usage limit.";
    return "/upgrade or /extra-usage to finish what you’re working on."
}
// @from(Ln 350687, Col 0)
function I$K(q) {
    let K = s(27),
        {
            text: _,
            onOpenRateLimitOptions: z
        } = q,
        Y;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = MK(), K[0] = Y;
    else Y = K[0];
    let A = Y,
        O;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) O = tQ(), K[1] = O;
    else O = K[1];
    let w = O,
        $ = A === "team" || A === "enterprise",
        j = A === "max" && w === "default_claude_max_20x",
        H;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) H = PT6() || i7(), K[2] = H;
    else H = K[2];
    let J = H,
        X = h96(),
        M = X.upgradePaths,
        P;
    if (K[3] !== M) P = M !== void 0 && !M.includes("upgrade_plan"), K[3] = M, K[4] = P;
    else P = K[4];
    let W = P,
        D;
    if (K[5] !== M) D = M !== void 0 && !M.includes("overage"), K[5] = M, K[6] = D;
    else D = K[6];
    let Z = D,
        G;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) G = u8("tengu_coral_beacon", !1) && !$ && !S6(process.env.DISABLE_UPGRADE_COMMAND), K[7] = G;
    else G = K[7];
    let f = G,
        v;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) v = L96.isEnabled(), K[8] = v;
    else v = K[8];
    let V = v,
        k;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) k = Ib(), K[9] = k;
    else k = K[9];
    let N = k,
        R;
    if (K[10] !== M) R = M !== void 0 && (M.includes("upgrade_plan") && !S6(process.env.DISABLE_UPGRADE_COMMAND) && A !== "enterprise" || M.includes("overage") && V), K[10] = M, K[11] = R;
    else R = K[11];
    let C = J && (M !== void 0 ? R || f : !j || f),
        [x, B] = ot.useState("pending"),
        m = X.status === "rejected" && X.resetsAt !== void 0 && !X.isUsingOverage,
        S = C && x === "pending" && m && z,
        F, U;
    if (K[12] !== z || K[13] !== S) F = () => {
        if (S) B(z() ? "opened" : "blocked")
    }, U = [S, z], K[12] = z, K[13] = S, K[14] = F, K[15] = U;
    else F = K[14], U = K[15];
    ot.useEffect(F, U);
    let g;
    q: {
        let A6 = !!S,
            e;
        if (K[16] !== Z || K[17] !== W || K[18] !== A6) e = mqY({
            shouldShowUpsell: J,
            isMax20x: j,
            isExtraUsageCommandEnabled: V,
            shouldAutoOpenRateLimitOptionsMenu: A6,
            isTeamOrEnterprise: $,
            hasBillingAccess: N,
            serverHidesUpgrade: W,
            serverHidesOverage: Z
        }),
        K[16] = Z,
        K[17] = W,
        K[18] = A6,
        K[19] = e;
        else e = K[19];
        let i = e;
        if (!i) {
            g = null;
            break q
        }
        let O6;
        if (K[20] !== i) O6 = ot.default.createElement(T, {
            dimColor: !0
        }, i),
        K[20] = i,
        K[21] = O6;
        else O6 = K[21];g = O6
    }
    let c = g,
        n;
    if (K[22] !== _) n = ot.default.createElement(T, {
        color: "error"
    }, _), K[22] = _, K[23] = n;
    else n = K[23];
    let l = x === "opened" ? null : c,
        z6;
    if (K[24] !== n || K[25] !== l) z6 = ot.default.createElement(_1, null, ot.default.createElement(u, {
        flexDirection: "column"
    }, n, l)), K[24] = n, K[25] = l, K[26] = z6;
    else z6 = K[26];
    return z6
}
// @from(Ln 350788, Col 4)
ot
// @from(Ln 350789, Col 4)
x$K = L(() => {
    o6();
    aC6();
    g6();
    B1();
    hK8();
    St6();
    T7();
    HQ();
    Q8();
    GK();
    ot = K6(P6(), 1)
})
// @from(Ln 350803, Col 0)
function pqY() {
    let q = s(2),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = vUq(), q[0] = K;
    else K = q[0];
    let _ = K,
        z;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) z = h_.default.createElement(_1, null, h_.default.createElement(u, {
        flexDirection: "column"
    }, h_.default.createElement(T, {
        color: "error"
    }, bh8), _ && h_.default.createElement(T, {
        dimColor: !0
    }, "· Run in another terminal: security unlock-keychain"))), q[1] = z;
    else z = q[1];
    return z
}
// @from(Ln 350821, Col 0)
function m$K(q) {
    let K = s(55),
        {
            param: _,
            addMargin: z,
            shouldShowDot: Y,
            verbose: A,
            onOpenRateLimitOptions: O,
            messageUuid: w
        } = q,
        {
            text: $
        } = _,
        j = h_.useContext(Vs),
        H = h_.useContext(dl),
        J = W$K(),
        X = D$K(),
        M = J === w,
        P = y96(w),
        [W, D] = h_.useState(null);
    if (my6($)) return null;
    if (yM4($)) {
        let Z;
        if (K[0] !== O || K[1] !== $) Z = h_.default.createElement(I$K, {
            text: $,
            onOpenRateLimitOptions: O
        }), K[0] = O, K[1] = $, K[2] = Z;
        else Z = K[2];
        return Z
    }
    switch ($) {
        case Tj6:
            return null;
        case cI: {
            let Z;
            if (K[3] === Symbol.for("react.memo_cache_sentinel")) Z = nC6("warning"), K[3] = Z;
            else Z = K[3];
            let G = Z,
                f = S6(process.env.DISABLE_COMPACT) ? "/clear to continue" : "/compact or /clear to continue",
                v;
            if (K[4] === Symbol.for("react.memo_cache_sentinel")) v = h_.default.createElement(_1, {
                height: 1
            }, h_.default.createElement(T, {
                color: "error"
            }, "Context limit reached · ", f, G ? ` · ${G}` : "")), K[4] = v;
            else v = K[4];
            return v
        }
        case Ch8: {
            let Z;
            if (K[5] === Symbol.for("react.memo_cache_sentinel")) Z = h_.default.createElement(_1, {
                height: 1
            }, h_.default.createElement(T, {
                color: "error"
            }, "Credit balance too low · Add funds: https://platform.claude.com/settings/billing")), K[5] = Z;
            else Z = K[5];
            return Z
        }
        case bh8: {
            let Z;
            if (K[6] === Symbol.for("react.memo_cache_sentinel")) Z = h_.default.createElement(pqY, null), K[6] = Z;
            else Z = K[6];
            return Z
        }
        case Ih8: {
            let Z;
            if (K[7] === Symbol.for("react.memo_cache_sentinel")) Z = h_.default.createElement(_1, {
                height: 1
            }, h_.default.createElement(T, {
                color: "error"
            }, Ih8)), K[7] = Z;
            else Z = K[7];
            return Z
        }
        case dF1:
        case QF1: {
            let Z;
            if (K[8] !== $) Z = h_.default.createElement(_1, null, h_.default.createElement(T, {
                color: "error"
            }, $)), K[8] = $, K[9] = Z;
            else Z = K[9];
            return Z
        }
        case xh8: {
            let Z;
            if (K[10] === Symbol.for("react.memo_cache_sentinel")) Z = h_.default.createElement(_1, {
                height: 1
            }, h_.default.createElement(T, {
                color: "error"
            }, xh8)), K[10] = Z;
            else Z = K[10];
            return Z
        }
        case uh8: {
            let Z;
            if (K[11] === Symbol.for("react.memo_cache_sentinel")) Z = h_.default.createElement(_1, {
                height: 1
            }, h_.default.createElement(T, {
                color: "error"
            }, uh8, process.env.API_TIMEOUT_MS && h_.default.createElement(h_.default.Fragment, null, " ", "(API_TIMEOUT_MS=", process.env.API_TIMEOUT_MS, "ms, try increasing it)"))), K[11] = Z;
            else Z = K[11];
            return Z
        }
        case Gj6: {
            let Z;
            if (K[12] === Symbol.for("react.memo_cache_sentinel")) Z = h_.default.createElement(T, {
                color: "error"
            }, "We are experiencing high demand for Opus 4."), K[12] = Z;
            else Z = K[12];
            let G;
            if (K[13] === Symbol.for("react.memo_cache_sentinel")) G = h_.default.createElement(_1, null, h_.default.createElement(u, {
                flexDirection: "column",
                gap: 1
            }, Z, h_.default.createElement(T, null, "To continue immediately, use /model to switch to", " ", YJ(Af()), " and continue coding."))), K[13] = G;
            else G = K[13];
            return G
        }
        case at: {
            let Z;
            if (K[14] === Symbol.for("react.memo_cache_sentinel")) Z = h_.default.createElement(_1, {
                height: 1
            }, h_.default.createElement(gl, null)), K[14] = Z;
            else Z = K[14];
            return Z
        }
        default: {
            if (fp($)) {
                let m = !A && $.length > u$K,
                    S = $ === mP ? `${mP}: Please wait a moment and try again.` : m ? $.slice(0, u$K) + "…" : $,
                    F;
                if (K[15] !== S) F = h_.default.createElement(T, {
                    color: "error"
                }, S), K[15] = S, K[16] = F;
                else F = K[16];
                let U;
                if (K[17] !== m) U = m && h_.default.createElement(U2, null), K[17] = m, K[18] = U;
                else U = K[18];
                let g;
                if (K[19] !== F || K[20] !== U) g = h_.default.createElement(_1, null, h_.default.createElement(u, {
                    flexDirection: "column"
                }, F, U)), K[19] = F, K[20] = U, K[21] = g;
                else g = K[21];
                return g
            }
            let Z;
            if (K[22] !== w || K[23] !== H || K[24] !== Y) Z = !1, K[22] = w, K[23] = H, K[24] = Y, K[25] = Z;
            else Z = K[25];
            let G = Z,
                f = G && (M || P !== void 0),
                v = z ? 1 : 0,
                V = j ? "messageActionsBackground" : void 0,
                k;
            if (K[26] !== w || K[27] !== G || K[28] !== X) k = G ? () => X?.(w ?? null) : void 0, K[26] = w, K[27] = G, K[28] = X, K[29] = k;
            else k = K[29];
            let N;
            if (K[30] !== G || K[31] !== X) N = G ? () => {
                X?.(null), D(null)
            } : void 0, K[30] = G, K[31] = X, K[32] = N;
            else N = K[32];
            let R;
            if (K[33] !== j || K[34] !== Y) R = Y && h_.default.createElement(PJ, {
                fromLeftEdge: !0,
                minWidth: 2
            }, h_.default.createElement(T, {
                color: j ? "suggestion" : "text"
            }, $9)), K[33] = j, K[34] = Y, K[35] = R;
            else R = K[35];
            let h;
            if (K[36] !== $) h = h_.default.createElement(xw, null, $), K[36] = $, K[37] = h;
            else h = K[37];
            let C;
            if (K[38] !== W || K[39] !== w || K[40] !== H || K[41] !== P || K[42] !== G || K[43] !== f) C = null, K[38] = W, K[39] = w, K[40] = H, K[41] = P, K[42] = G, K[43] = f, K[44] = C;
            else C = K[44];
            let x;
            if (K[45] !== h || K[46] !== C) x = h_.default.createElement(u, {
                flexDirection: "column"
            }, h, C), K[45] = h, K[46] = C, K[47] = x;
            else x = K[47];
            let B;
            if (K[48] !== x || K[49] !== v || K[50] !== V || K[51] !== k || K[52] !== N || K[53] !== R) B = h_.default.createElement(u, {
                alignItems: "flex-start",
                flexDirection: "row",
                marginTop: v,
                width: "100%",
                backgroundColor: V,
                onMouseEnter: k,
                onMouseLeave: N
            }, R, x), K[48] = x, K[49] = v, K[50] = V, K[51] = k, K[52] = N, K[53] = R, K[54] = B;
            else B = K[54];
            return B
        }
    }
}
// @from(Ln 351014, Col 4)
h_
// @from(Ln 351014, Col 8)
u$K = 1000
// @from(Ln 351015, Col 4)
B$K = L(() => {
    o6();
    ep();
    Jy6();
    A3();
    g6();
    rv();
    Q8();
    nO();
    _7();
    Ig8();
    Sq();
    uR1();
    kk();
    cC6();
    ry();
    GK();
    wy();
    iC6();
    x$K();
    h_ = K6(P6(), 1)
})
// @from(Ln 351038, Col 0)
function cg8(q) {
    let K = s(17),
        {
            param: _,
            addMargin: z,
            isTranscriptMode: Y,
            verbose: A,
            hideInTranscript: O
        } = q,
        {
            thinking: w
        } = _,
        $ = z === void 0 ? !1 : z,
        j = O === void 0 ? !1 : O;
    if (!w) return null;
    if (j) return null;
    if (!(Y || A)) {
        let W = $ ? 1 : 0,
            D;
        if (K[8] === Symbol.for("react.memo_cache_sentinel")) D = R96.default.createElement(T, {
            dimColor: !0,
            italic: !0
        }, "∴ Thinking", " ", R96.default.createElement(U2, null)), K[8] = D;
        else D = K[8];
        let Z;
        if (K[9] !== W) Z = R96.default.createElement(u, {
            marginTop: W
        }, D), K[9] = W, K[10] = Z;
        else Z = K[10];
        return Z
    }
    let J = $ ? 1 : 0,
        X;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) X = R96.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "∴ Thinking", "…"), K[11] = X;
    else X = K[11];
    let M;
    if (K[12] !== w) M = R96.default.createElement(u, {
        paddingLeft: 2
    }, R96.default.createElement(xw, {
        dimColor: !0
    }, w)), K[12] = w, K[13] = M;
    else M = K[13];
    let P;
    if (K[14] !== J || K[15] !== M) P = R96.default.createElement(u, {
        flexDirection: "column",
        gap: 1,
        marginTop: J,
        width: "100%"
    }, X, M), K[14] = J, K[15] = M, K[16] = P;
    else P = K[16];
    return P
}
// @from(Ln 351093, Col 4)
R96
// @from(Ln 351094, Col 4)
zq7 = L(() => {
    o6();
    g6();
    kk();
    ry();
    R96 = K6(P6(), 1)
})
// @from(Ln 351102, Col 0)
function p$K(q) {
    return Kp((K) => K.classifierApprovals.checking.has(q)) ?? !1
}
// @from(Ln 351105, Col 4)
F$K = L(() => {
    N7()
})
// @from(Ln 351108, Col 4)
g$K
// @from(Ln 351108, Col 9)
oX6
// @from(Ln 351109, Col 4)
lg8 = L(() => {
    g$K = K6(P6(), 1);
    oX6 = class oX6 extends g$K.Component {
        constructor(q) {
            super(q);
            this.state = {
                hasError: !1
            }
        }
        static getDerivedStateFromError() {
            return {
                hasError: !0
            }
        }
        render() {
            if (this.state.hasError) return null;
            return this.props.children
        }
    }
})
// @from(Ln 351130, Col 0)
function ng8(q) {
    let K = s(22),
        {
            hookEvent: _,
            lookups: z,
            toolUseID: Y,
            isTranscriptMode: A
        } = q,
        O;
    if (K[0] !== _ || K[1] !== z.inProgressHookCounts || K[2] !== Y) O = z.inProgressHookCounts.get(Y)?.get(_) ?? 0, K[0] = _, K[1] = z.inProgressHookCounts, K[2] = Y, K[3] = O;
    else O = K[3];
    let w = O,
        $ = z.resolvedHookCounts.get(Y)?.get(_) ?? 0;
    if (w === 0) return null;
    if (_ === "PreToolUse" || _ === "PostToolUse") {
        if (A) {
            let P;
            if (K[4] !== w) P = CM.createElement(T, {
                dimColor: !0
            }, w, " "), K[4] = w, K[5] = P;
            else P = K[5];
            let W;
            if (K[6] !== _) W = CM.createElement(T, {
                dimColor: !0,
                bold: !0
            }, _), K[6] = _, K[7] = W;
            else W = K[7];
            let D = w === 1 ? " hook" : " hooks",
                Z;
            if (K[8] !== D) Z = CM.createElement(T, {
                dimColor: !0
            }, D, " ran"), K[8] = D, K[9] = Z;
            else Z = K[9];
            let G;
            if (K[10] !== P || K[11] !== W || K[12] !== Z) G = CM.createElement(_1, null, CM.createElement(u, {
                flexDirection: "row"
            }, P, W, Z)), K[10] = P, K[11] = W, K[12] = Z, K[13] = G;
            else G = K[13];
            return G
        }
        return null
    }
    if ($ === w) return null;
    let j;
    if (K[14] === Symbol.for("react.memo_cache_sentinel")) j = CM.createElement(T, {
        dimColor: !0
    }, "Running "), K[14] = j;
    else j = K[14];
    let H;
    if (K[15] !== _) H = CM.createElement(T, {
        dimColor: !0,
        bold: !0
    }, _), K[15] = _, K[16] = H;
    else H = K[16];
    let J = w === 1 ? " hook…" : " hooks…",
        X;
    if (K[17] !== J) X = CM.createElement(T, {
        dimColor: !0
    }, J), K[17] = J, K[18] = X;
    else X = K[18];
    let M;
    if (K[19] !== H || K[20] !== X) M = CM.createElement(_1, null, CM.createElement(u, {
        flexDirection: "row"
    }, j, H, X)), K[19] = H, K[20] = X, K[21] = M;
    else M = K[21];
    return M
}
// @from(Ln 351197, Col 4)
CM
// @from(Ln 351198, Col 4)
Yq7 = L(() => {
    o6();
    g6();
    GK();
    CM = K6(P6(), 1)
})
// @from(Ln 351205, Col 0)
function d$K(q) {
    let K = s(93),
        {
            param: _,
            addMargin: z,
            tools: Y,
            commands: A,
            verbose: O,
            inProgressToolUseIDs: w,
            progressMessagesForMessage: $,
            shouldAnimate: j,
            shouldShowDot: H,
            inProgressToolCallCount: J,
            lookups: X,
            isTranscriptMode: M,
            messageUuid: P
        } = q,
        W = yX.useContext(dl),
        D = xg8(),
        Z = ug8(),
        G = D === _.id,
        f = y96(P),
        [v, V] = yX.useState(!1),
        k = s1(),
        [N] = Zq(),
        R = If(),
        h = Kp(UqY),
        C = p$K(_.id),
        x = Kp(gqY),
        B = Kp(FqY),
        m = x === "auto" || x === "plan" && B,
        S = !1,
        F;
    if (K[0] !== _.input || K[1] !== _.name || K[2] !== Y) {
        q: {
            if (!Y) {
                F = null;
                break q
            }
            let v6 = rK(Y, _.name);
            if (!v6) {
                F = null;
                break q
            }
            let L6 = v6.inputSchema.safeParse(_.input),
                y6 = L6.success ? L6.data : void 0;F = {
                tool: v6,
                input: L6,
                userFacingToolName: v6.userFacingName(y6),
                userFacingToolNameBackgroundColor: v6.userFacingNameBackgroundColor?.(y6),
                isTransparentWrapper: v6.isTransparentWrapper?.() ?? !1
            }
        }
        K[0] = _.input,
        K[1] = _.name,
        K[2] = Y,
        K[3] = F
    }
    else F = K[3];
    let U = F;
    if (!U) return j6(Error(Y ? `Tool ${_.name} not found` : `Tools array is undefined for tool ${_.name}`)), null;
    let {
        tool: g,
        input: c,
        userFacingToolName: n,
        userFacingToolNameBackgroundColor: l,
        isTransparentWrapper: z6
    } = U, A6;
    if (K[4] !== X.resolvedToolUseIDs || K[5] !== _.id) A6 = X.resolvedToolUseIDs.has(_.id), K[4] = X.resolvedToolUseIDs, K[5] = _.id, K[6] = A6;
    else A6 = K[6];
    let e = A6,
        i;
    if (K[7] !== w || K[8] !== e || K[9] !== _.id) i = !w.has(_.id) && !e, K[7] = w, K[8] = e, K[9] = _.id, K[10] = i;
    else i = K[10];
    let O6 = i,
        J6 = h?.toolUseId === _.id;
    if (z6) {
        if (e) return null;
        let v6;
        if (K[11] !== J || K[12] !== M || K[13] !== X || K[14] !== _.id || K[15] !== $ || K[16] !== k || K[17] !== g || K[18] !== Y || K[19] !== O) v6 = Q$K(g, Y, X, _.id, $, {
            verbose: O,
            inProgressToolCallCount: J,
            isTranscriptMode: M
        }, k), K[11] = J, K[12] = M, K[13] = X, K[14] = _.id, K[15] = $, K[16] = k, K[17] = g, K[18] = Y, K[19] = O, K[20] = v6;
        else v6 = K[20];
        let L6;
        if (K[21] !== R || K[22] !== v6) L6 = yX.default.createElement(u, {
            flexDirection: "column",
            width: "100%",
            backgroundColor: R
        }, v6), K[21] = R, K[22] = v6, K[23] = L6;
        else L6 = K[23];
        return L6
    }
    if (n === "") return null;
    let $6;
    if (K[24] !== A || K[25] !== c.data || K[26] !== c.success || K[27] !== N || K[28] !== g || K[29] !== O) $6 = c.success ? QqY(g, c.data, {
        theme: N,
        verbose: O,
        commands: A
    }) : null, K[24] = A, K[25] = c.data, K[26] = c.success, K[27] = N, K[28] = g, K[29] = O, K[30] = $6;
    else $6 = K[30];
    let H6 = $6;
    if (H6 === null) return null;
    let q6 = z ? 1 : 0,
        o;
    if (K[31] !== _.id || K[32] !== Z) o = void 0, K[31] = _.id, K[32] = Z, K[33] = o;
    else o = K[33];
    let _6;
    if (K[34] !== Z) _6 = void 0, K[34] = Z, K[35] = _6;
    else _6 = K[35];
    let r = N1(n) + (H ? 2 : 0),
        t;
    if (K[36] !== v || K[37] !== G || K[38] !== O6 || K[39] !== e || K[40] !== X.erroredToolUseIDs || K[41] !== P || K[42] !== _.id || K[43] !== W || K[44] !== f || K[45] !== j || K[46] !== H) t = H && (e && X.erroredToolUseIDs.has(_.id), O6 ? yX.default.createElement(u, {
        minWidth: 2
    }, yX.default.createElement(T, {
        dimColor: O6
    }, $9)) : yX.default.createElement(xF, {
        shouldAnimate: j,
        isUnresolved: !e,
        isError: X.erroredToolUseIDs.has(_.id)
    })), K[36] = v, K[37] = G, K[38] = O6, K[39] = e, K[40] = X.erroredToolUseIDs, K[41] = P, K[42] = _.id, K[43] = W, K[44] = f, K[45] = j, K[46] = H, K[47] = t;
    else t = K[47];
    let Y6 = l ? "inverseText" : void 0,
        X6;
    if (K[48] !== Y6 || K[49] !== n || K[50] !== l) X6 = yX.default.createElement(u, {
        flexShrink: 0
    }, yX.default.createElement(T, {
        bold: !0,
        wrap: "truncate-end",
        backgroundColor: l,
        color: Y6
    }, n)), K[48] = Y6, K[49] = n, K[50] = l, K[51] = X6;
    else X6 = K[51];
    let M6;
    if (K[52] !== H6) M6 = H6 !== "" && yX.default.createElement(u, {
        flexWrap: "nowrap"
    }, yX.default.createElement(T, null, "(", H6, ")")), K[52] = H6, K[53] = M6;
    else M6 = K[53];
    let W6;
    if (K[54] !== c.data || K[55] !== c.success || K[56] !== g) W6 = c.success && g.renderToolUseTag && g.renderToolUseTag(c.data), K[54] = c.data, K[55] = c.success, K[56] = g, K[57] = W6;
    else W6 = K[57];
    let V6;
    if (K[58] !== X6 || K[59] !== M6 || K[60] !== W6 || K[61] !== r || K[62] !== t) V6 = yX.default.createElement(u, {
        flexDirection: "row",
        flexWrap: "nowrap",
        minWidth: r
    }, t, X6, M6, W6), K[58] = X6, K[59] = M6, K[60] = W6, K[61] = r, K[62] = t, K[63] = V6;
    else V6 = K[63];
    let f6;
    if (K[64] !== J || K[65] !== m || K[66] !== !1 || K[67] !== O6 || K[68] !== e || K[69] !== M || K[70] !== J6 || K[71] !== X || K[72] !== _.id || K[73] !== $ || K[74] !== k || K[75] !== g || K[76] !== Y || K[77] !== O) f6 = !e && !O6 && (J6 ? yX.default.createElement(_1, {
        height: 1
    }, yX.default.createElement(T, {
        dimColor: !0
    }, "Waiting for permission…")) : Q$K(g, Y, X, _.id, $, {
        verbose: O,
        inProgressToolCallCount: J,
        isTranscriptMode: M
    }, k)), K[64] = J, K[65] = m, K[66] = !1, K[67] = O6, K[68] = e, K[69] = M, K[70] = J6, K[71] = X, K[72] = _.id, K[73] = $, K[74] = k, K[75] = g, K[76] = Y, K[77] = O, K[78] = f6;
    else f6 = K[78];
    let G6;
    if (K[79] !== O6 || K[80] !== e || K[81] !== g) G6 = !e && O6 && dqY(g), K[79] = O6, K[80] = e, K[81] = g, K[82] = G6;
    else G6 = K[82];
    let k6;
    if (K[83] !== V6 || K[84] !== f6 || K[85] !== G6) k6 = yX.default.createElement(u, {
        flexDirection: "column"
    }, V6, f6, G6), K[83] = V6, K[84] = f6, K[85] = G6, K[86] = k6;
    else k6 = K[86];
    let T6;
    if (K[87] !== R || K[88] !== k6 || K[89] !== q6 || K[90] !== o || K[91] !== _6) T6 = yX.default.createElement(u, {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: q6,
        width: "100%",
        backgroundColor: R,
        onMouseEnter: o,
        onMouseLeave: _6
    }, k6), K[87] = R, K[88] = k6, K[89] = q6, K[90] = o, K[91] = _6, K[92] = T6;
    else T6 = K[92];
    return T6
}
// @from(Ln 351387, Col 0)
function FqY(q) {
    return !!q.toolPermissionContext.strippedDangerousRules
}
// @from(Ln 351391, Col 0)
function gqY(q) {
    return q.toolPermissionContext.mode
}
// @from(Ln 351395, Col 0)
function UqY(q) {
    return q.pendingWorkerRequest
}
// @from(Ln 351399, Col 0)
function QqY(q, K, {
    theme: _,
    verbose: z,
    commands: Y
}) {
    try {
        return q.renderToolUseMessage(K, {
            theme: _,
            verbose: z,
            commands: Y
        })
    } catch (A) {
        return j6(Error(`Error rendering tool use message for ${q.name}: ${A}`)), ""
    }
}
// @from(Ln 351415, Col 0)
function Q$K(q, K, _, z, Y, {
    verbose: A,
    inProgressToolCallCount: O,
    isTranscriptMode: w
}, $) {
    let j = Y.filter((H) => H.data.type !== "hook_progress");
    try {
        let H = q.renderToolUseProgressMessage?.(j, {
            tools: K,
            verbose: A,
            terminalSize: $,
            inProgressToolCallCount: O ?? 1,
            isTranscriptMode: w
        }) ?? null;
        return yX.default.createElement(yX.default.Fragment, null, yX.default.createElement(oX6, null, yX.default.createElement(ng8, {
            hookEvent: "PreToolUse",
            lookups: _,
            toolUseID: z,
            verbose: A,
            isTranscriptMode: w
        })), H)
    } catch (H) {
        return j6(Error(`Error rendering tool use progress message for ${q.name}: ${H}`)), null
    }
}
// @from(Ln 351441, Col 0)
function dqY(q) {
    try {
        return q.renderToolUseQueuedMessage?.()
    } catch (K) {
        return j6(Error(`Error rendering tool use queued message for ${q.name}: ${K}`)), null
    }
}
// @from(Ln 351448, Col 4)
yX
// @from(Ln 351449, Col 4)
c$K = L(() => {
    o6();
    I4();
    A3();
    n5();
    g6();
    N7();
    gq();
    F$K();
    nO();
    U8();
    GK();
    wy();
    lg8();
    lC6();
    Yq7();
    iC6();
    yX = K6(P6(), 1)
})
// @from(Ln 351472, Col 0)
function l$K(q) {
    let K = s(14),
        {
            attachment: _,
            verbose: z
        } = q;
    if (_.files.length === 0) return null;
    let Y;
    if (K[0] !== _.files) Y = _.files.reduce(iqY, 0), K[0] = _.files, K[1] = Y;
    else Y = K[1];
    let A = Y,
        O = _.files.length;
    if (z) {
        let w;
        if (K[2] !== _.files) w = _.files.map(lqY), K[2] = _.files, K[3] = w;
        else w = K[3];
        let $;
        if (K[4] !== w) $ = ay.default.createElement(u, {
            flexDirection: "column"
        }, w), K[4] = w, K[5] = $;
        else $ = K[5];
        return $
    } else {
        let w;
        if (K[6] !== A) w = ay.default.createElement(T, {
            bold: !0
        }, A), K[6] = A, K[7] = w;
        else w = K[7];
        let $ = A === 1 ? "issue" : "issues",
            j = O === 1 ? "file" : "files",
            H;
        if (K[8] === Symbol.for("react.memo_cache_sentinel")) H = ay.default.createElement(U2, null), K[8] = H;
        else H = K[8];
        let J;
        if (K[9] !== O || K[10] !== w || K[11] !== $ || K[12] !== j) J = ay.default.createElement(_1, null, ay.default.createElement(T, {
            dimColor: !0,
            wrap: "wrap"
        }, "Found ", w, " new diagnostic", " ", $, " in ", O, " ", j, " ", H)), K[9] = O, K[10] = w, K[11] = $, K[12] = j, K[13] = J;
        else J = K[13];
        return J
    }
}
// @from(Ln 351515, Col 0)
function lqY(q, K) {
    return ay.default.createElement(ay.default.Fragment, {
        key: K
    }, ay.default.createElement(_1, null, ay.default.createElement(T, {
        dimColor: !0,
        wrap: "wrap"
    }, ay.default.createElement(T, {
        bold: !0
    }, cqY(b8(), q.uri.replace("file://", "").replace("_claude_fs_right:", ""))), " ", ay.default.createElement(T, {
        dimColor: !0
    }, q.uri.startsWith("file://") ? "(file://)" : q.uri.startsWith("_claude_fs_right:") ? "(claude_fs_right)" : `(${q.uri.split(":")[0]})`), ":")), q.diagnostics.map(nqY))
}
// @from(Ln 351528, Col 0)
function nqY(q, K) {
    return ay.default.createElement(_1, {
        key: K
    }, ay.default.createElement(T, {
        dimColor: !0,
        wrap: "wrap"
    }, "  ", mF.getSeveritySymbol(q.severity), " [Line ", q.range.start.line + 1, ":", q.range.start.character + 1, "] ", q.message, q.code ? ` [${q.code}]` : "", q.source ? ` (${q.source})` : ""))
}
// @from(Ln 351537, Col 0)
function iqY(q, K) {
    return q + K.diagnostics.length
}
// @from(Ln 351540, Col 4)
ay
// @from(Ln 351541, Col 4)
n$K = L(() => {
    o6();
    g6();
    aX6();
    n7();
    kk();
    GK();
    ay = K6(P6(), 1)
})
// @from(Ln 351554, Col 0)
function YG(q) {
    let K = s(5),
        {
            filePath: _,
            children: z
        } = q,
        Y;
    if (K[0] !== _) Y = rqY(_), K[0] = _, K[1] = Y;
    else Y = K[1];
    let A = z ?? _,
        O;
    if (K[2] !== Y.href || K[3] !== A) O = i$K.default.createElement(yq, {
        url: Y.href
    }, A), K[2] = Y.href, K[3] = A, K[4] = O;
    else O = K[4];
    return O
}
// @from(Ln 351571, Col 4)
i$K
// @from(Ln 351572, Col 4)
S96 = L(() => {
    o6();
    u46();
    i$K = K6(P6(), 1)
})
// @from(Ln 351578, Col 0)
function oqY(q) {
    let K = s(7),
        {
            request: _
        } = q,
        z;
    if (K[0] !== _.from) z = NO.createElement(u, {
        marginBottom: 1
    }, NO.createElement(T, {
        color: "warning",
        bold: !0
    }, "Shutdown request from ", _.from)), K[0] = _.from, K[1] = z;
    else z = K[1];
    let Y;
    if (K[2] !== _.reason) Y = _.reason && NO.createElement(u, null, NO.createElement(T, null, "Reason: ", _.reason)), K[2] = _.reason, K[3] = Y;
    else Y = K[3];
    let A;
    if (K[4] !== z || K[5] !== Y) A = NO.createElement(u, {
        flexDirection: "column",
        marginY: 1
    }, NO.createElement(u, {
        borderStyle: "round",
        borderColor: "warning",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1
    }, z, Y)), K[4] = z, K[5] = Y, K[6] = A;
    else A = K[6];
    return A
}
// @from(Ln 351609, Col 0)
function aqY(q) {
    let K = s(8),
        {
            response: _
        } = q,
        z;
    if (K[0] !== _.from) z = NO.createElement(T, {
        color: "subtle",
        bold: !0
    }, "Shutdown rejected by ", _.from), K[0] = _.from, K[1] = z;
    else z = K[1];
    let Y;
    if (K[2] !== _.reason) Y = NO.createElement(u, {
        marginTop: 1,
        borderStyle: "dashed",
        borderColor: "subtle",
        borderLeft: !1,
        borderRight: !1,
        paddingX: 1
    }, NO.createElement(T, null, "Reason: ", _.reason)), K[2] = _.reason, K[3] = Y;
    else Y = K[3];
    let A;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) A = NO.createElement(u, {
        marginTop: 1
    }, NO.createElement(T, {
        dimColor: !0
    }, "Teammate is continuing to work. You may request shutdown again later.")), K[4] = A;
    else A = K[4];
    let O;
    if (K[5] !== z || K[6] !== Y) O = NO.createElement(u, {
        flexDirection: "column",
        marginY: 1
    }, NO.createElement(u, {
        borderStyle: "round",
        borderColor: "subtle",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1
    }, z, Y, A)), K[5] = z, K[6] = Y, K[7] = O;
    else O = K[7];
    return O
}
// @from(Ln 351652, Col 0)
function r$K(q) {
    let K = i56(q);
    if (K) return NO.createElement(oqY, {
        request: K
    });
    if (Qk(q)) return null;
    let _ = SI8(q);
    if (_) return NO.createElement(aqY, {
        response: _
    });
    return null
}
// @from(Ln 351665, Col 0)
function o$K(q) {
    let K = i56(q);
    if (K) return `[Shutdown Request from ${K.from}]${K.reason?` ${K.reason}`:""}`;
    let _ = Qk(q);
    if (_) return `[Shutdown Approved] ${_.from} is now exiting`;
    let z = SI8(q);
    if (z) return `[Shutdown Rejected] ${z.from}: ${z.reason}`;
    return null
}
// @from(Ln 351674, Col 4)
NO
// @from(Ln 351675, Col 4)
Aq7 = L(() => {
    o6();
    g6();
    ZX();
    NO = K6(P6(), 1)
})
// @from(Ln 351682, Col 0)
function sqY(q) {
    let K = s(11),
        {
            assignment: _
        } = q,
        z;
    if (K[0] !== _.assignedBy || K[1] !== _.taskId) z = w0.createElement(u, {
        marginBottom: 1
    }, w0.createElement(T, {
        color: "cyan_FOR_SUBAGENTS_ONLY",
        bold: !0
    }, "Task #", _.taskId, " assigned by ", _.assignedBy)), K[0] = _.assignedBy, K[1] = _.taskId, K[2] = z;
    else z = K[2];
    let Y;
    if (K[3] !== _.subject) Y = w0.createElement(u, null, w0.createElement(T, {
        bold: !0
    }, _.subject)), K[3] = _.subject, K[4] = Y;
    else Y = K[4];
    let A;
    if (K[5] !== _.description) A = _.description && w0.createElement(u, {
        marginTop: 1
    }, w0.createElement(T, {
        dimColor: !0
    }, _.description)), K[5] = _.description, K[6] = A;
    else A = K[6];
    let O;
    if (K[7] !== z || K[8] !== Y || K[9] !== A) O = w0.createElement(u, {
        flexDirection: "column",
        marginY: 1
    }, w0.createElement(u, {
        borderStyle: "round",
        borderColor: "cyan_FOR_SUBAGENTS_ONLY",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1
    }, z, Y, A)), K[7] = z, K[8] = Y, K[9] = A, K[10] = O;
    else O = K[10];
    return O
}
// @from(Ln 351722, Col 0)
function a$K(q) {
    let K = CI8(q);
    if (K) return w0.createElement(sqY, {
        assignment: K
    });
    return null
}
// @from(Ln 351730, Col 0)
function s$K(q) {
    let K = CI8(q);
    if (K) return `[Task Assigned] #${K.taskId} - ${K.subject}`;
    return null
}
// @from(Ln 351735, Col 4)
w0
// @from(Ln 351736, Col 4)
Oq7 = L(() => {
    o6();
    g6();
    ZX();
    w0 = K6(P6(), 1)
})
// @from(Ln 351743, Col 0)
function tqY(q) {
    let K = s(10),
        {
            request: _
        } = q,
        z;
    if (K[0] !== _.from) z = z9.createElement(u, {
        marginBottom: 1
    }, z9.createElement(T, {
        color: "planMode",
        bold: !0
    }, "Plan Approval Request from ", _.from)), K[0] = _.from, K[1] = z;
    else z = K[1];
    let Y;
    if (K[2] !== _.planContent) Y = z9.createElement(u, {
        borderStyle: "dashed",
        borderColor: "subtle",
        borderLeft: !1,
        borderRight: !1,
        flexDirection: "column",
        paddingX: 1,
        marginBottom: 1
    }, z9.createElement(xw, null, _.planContent)), K[2] = _.planContent, K[3] = Y;
    else Y = K[3];
    let A;
    if (K[4] !== _.planFilePath) A = z9.createElement(T, {
        dimColor: !0
    }, "Plan file: ", _.planFilePath), K[4] = _.planFilePath, K[5] = A;
    else A = K[5];
    let O;
    if (K[6] !== z || K[7] !== Y || K[8] !== A) O = z9.createElement(u, {
        flexDirection: "column",
        marginY: 1
    }, z9.createElement(u, {
        borderStyle: "round",
        borderColor: "planMode",
        flexDirection: "column",
        paddingX: 1
    }, z, Y, A)), K[6] = z, K[7] = Y, K[8] = A, K[9] = O;
    else O = K[9];
    return O
}
// @from(Ln 351786, Col 0)
function eqY(q) {
    let K = s(13),
        {
            response: _,
            senderName: z
        } = q;
    if (_.approved) {
        let $;
        if (K[0] !== z) $ = z9.createElement(u, null, z9.createElement(T, {
            color: "success",
            bold: !0
        }, "✓ Plan Approved by ", z)), K[0] = z, K[1] = $;
        else $ = K[1];
        let j;
        if (K[2] === Symbol.for("react.memo_cache_sentinel")) j = z9.createElement(u, {
            marginTop: 1
        }, z9.createElement(T, null, "You can now proceed with implementation. Your plan mode restrictions have been lifted.")), K[2] = j;
        else j = K[2];
        let H;
        if (K[3] !== $) H = z9.createElement(u, {
            flexDirection: "column",
            marginY: 1
        }, z9.createElement(u, {
            borderStyle: "round",
            borderColor: "success",
            flexDirection: "column",
            paddingX: 1,
            paddingY: 1
        }, $, j)), K[3] = $, K[4] = H;
        else H = K[4];
        return H
    }
    let Y;
    if (K[5] !== z) Y = z9.createElement(u, null, z9.createElement(T, {
        color: "error",
        bold: !0
    }, "✗ Plan Rejected by ", z)), K[5] = z, K[6] = Y;
    else Y = K[6];
    let A;
    if (K[7] !== _.feedback) A = _.feedback && z9.createElement(u, {
        marginTop: 1,
        borderStyle: "dashed",
        borderColor: "subtle",
        borderLeft: !1,
        borderRight: !1,
        paddingX: 1
    }, z9.createElement(T, null, "Feedback: ", _.feedback)), K[7] = _.feedback, K[8] = A;
    else A = K[8];
    let O;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) O = z9.createElement(u, {
        marginTop: 1
    }, z9.createElement(T, {
        dimColor: !0
    }, "Please revise your plan based on the feedback and call ExitPlanMode again.")), K[9] = O;
    else O = K[9];
    let w;
    if (K[10] !== Y || K[11] !== A) w = z9.createElement(u, {
        flexDirection: "column",
        marginY: 1
    }, z9.createElement(u, {
        borderStyle: "round",
        borderColor: "error",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1
    }, Y, A, O)), K[10] = Y, K[11] = A, K[12] = w;
    else w = K[12];
    return w
}
// @from(Ln 351856, Col 0)
function ig8(q, K) {
    let _ = _J6(q);
    if (_) return z9.createElement(tqY, {
        request: _
    });
    let z = ch6(q);
    if (z) return z9.createElement(eqY, {
        response: z,
        senderName: K
    });
    return null
}
// @from(Ln 351869, Col 0)
function q4Y(q) {
    let K = _J6(q);
    if (K) return `[Plan Approval Request from ${K.from}]`;
    let _ = ch6(q);
    if (_)
        if (_.approved) return "[Plan Approved] You can now proceed with implementation";
        else return `[Plan Rejected] ${_.feedback||"Please revise your plan"}`;
    return null
}
// @from(Ln 351879, Col 0)
function K4Y(q) {
    let K = ["Agent idle"];
    if (q.completedTaskId) {
        let _ = q.completedStatus || "completed";
        K.push(`Task ${q.completedTaskId} ${_}`)
    }
    if (q.summary) K.push(`Last DM: ${q.summary}`);
    return K.join(" · ")
}
// @from(Ln 351889, Col 0)
function t$K(q) {
    let K = q4Y(q);
    if (K) return K;
    let _ = o$K(q);
    if (_) return _;
    let z = $18(q);
    if (z) return K4Y(z);
    let Y = s$K(q);
    if (Y) return Y;
    try {
        let A = n8(q);
        if (A?.type === "teammate_terminated" && A.message) return A.message
    } catch {}
    return q
}
// @from(Ln 351904, Col 4)
z9
// @from(Ln 351905, Col 4)
wq7 = L(() => {
    o6();
    ry();
    g6();
    e8();
    ZX();
    Aq7();
    Oq7();
    z9 = K6(P6(), 1)
})
// @from(Ln 351916, Col 0)
function C96({
    inputValue: q,
    setInputValue: K,
    isValidDigit: _,
    onDigit: z,
    enabled: Y = !0,
    once: A = !1,
    debounceMs: O = _4Y,
    mountDelayMs: w = z4Y
}) {
    let $ = st.useRef(q),
        j = st.useRef(!1),
        H = st.useRef(null),
        J = st.useRef(Y ? Date.now() : null),
        X = st.useRef(Y);
    if (Y && !X.current) J.current = Date.now();
    X.current = Y;
    let M = st.useRef({
        setInputValue: K,
        isValidDigit: _,
        onDigit: z
    });
    M.current = {
        setInputValue: K,
        isValidDigit: _,
        onDigit: z
    }, st.useEffect(() => {
        if (!Y || A && j.current) return;
        if (H.current !== null) clearTimeout(H.current), H.current = null;
        if (J.current !== null && Date.now() - J.current < w) return;
        if (q !== $.current && q.length === 1) {
            let P = q.normalize("NFKC");
            if (M.current.isValidDigit(P)) H.current = setTimeout((W, D, Z, G) => {
                W.current = null, D.current = !0, Z.current.setInputValue(""), Z.current.onDigit(G)
            }, O, H, j, M, P)
        }
        return () => {
            if (H.current !== null) clearTimeout(H.current), H.current = null
        }
    }, [q, Y, A, O, w])
}
// @from(Ln 351957, Col 4)
st
// @from(Ln 351957, Col 8)
_4Y = 400
// @from(Ln 351958, Col 4)
z4Y = 600
// @from(Ln 351959, Col 4)
RK8 = L(() => {
    st = K6(P6(), 1)
})
// @from(Ln 351963, Col 0)
function tC6() {
    return $q7.useSyncExternalStore(sC6.subscribe, () => sC6.getState().value)
}
// @from(Ln 351967, Col 0)
function e$K() {
    return $q7.useSyncExternalStore(sC6.subscribe, () => sC6.getState().value === "")
}
// @from(Ln 351971, Col 0)
function qjK() {
    return sC6.getState().value
}
// @from(Ln 351975, Col 0)
function rg8(q) {
    sC6.setState((K) => K.value === q ? K : {
        value: q
    })
}
// @from(Ln 351980, Col 4)
$q7
// @from(Ln 351980, Col 9)
sC6
// @from(Ln 351981, Col 4)
SK8 = L(() => {
    $q7 = K6(P6(), 1), sC6 = rE({
        value: ""
    })
})
// @from(Ln 351987, Col 0)
function zjK(q) {
    let K = q.lastIndexOf(KjK);
    if (K === -1) return {
        synthesis: q,
        sources: []
    };
    return {
        synthesis: q.slice(0, K),
        sources: q.slice(K + KjK.length).split(", ").filter(Boolean)
    }
}
// @from(Ln 351999, Col 0)
function Y4Y(q) {
    return q.startsWith("team/") || q.startsWith("team\\")
}
// @from(Ln 352003, Col 0)
function jq7(q) {
    return q.length > 0 && q.every((K) => A4Y.test(K.path))
}
// @from(Ln 352007, Col 0)
function YjK(q) {
    let K = 0,
        _ = 0;
    for (let z of q)
        for (let Y of zjK(z.content).sources)
            if (Y4Y(Y)) K++;
            else _++;
    return {
        cited_team_count: K,
        cited_private_count: _
    }
}
// @from(Ln 352020, Col 0)
function AjK(q) {
    let K = s(25),
        {
            memories: _,
            messageUuid: z,
            addMargin: Y,
            bg: A,
            isTranscriptMode: O
        } = q,
        w = Lj.useContext(dl),
        $ = y96(z),
        [j, H] = Lj.useState(null),
        J;
    if (K[0] !== O || K[1] !== z || K[2] !== w) J = lq() && !O && w !== null && z !== void 0, K[0] = O, K[1] = z, K[2] = w, K[3] = J;
    else J = K[3];
    let X = J,
        M;
    if (K[4] !== _) M = YjK(_), K[4] = _, K[5] = M;
    else M = K[5];
    let P = M,
        W = Y ? 1 : 0,
        D;
    if (K[6] !== j || K[7] !== _ || K[8] !== z || K[9] !== w || K[10] !== $ || K[11] !== X || K[12] !== P) {
        let G;
        if (K[14] !== j || K[15] !== z || K[16] !== w || K[17] !== $ || K[18] !== X || K[19] !== P) G = (f, v) => {
            let {
                synthesis: V
            } = zjK(f.content), k = V.split(`
`).map(w4Y).filter(Boolean);
            return Lj.default.createElement(u, {
                key: f.path,
                flexDirection: "column"
            }, Lj.default.createElement(u, {
                flexDirection: "row"
            }, Lj.default.createElement(u, {
                minWidth: 2
            }, Lj.default.createElement(T, {
                color: "remember"
            }, EV)), !1, Lj.default.createElement(T, {
                bold: !0,
                color: "remember"
            }, "Recalled from memory"), X && v === 0 && Lj.default.createElement(Lj.default.Fragment, null, Lj.default.createElement(T, {
                dimColor: !0
            }, " · "), Lj.default.createElement(_jK, {
                label: "[Good]",
                color: "success",
                sentiment: "positive",
                hover: j,
                rating: $,
                setHover: H,
                onRate: (N) => w(z, N, "tiny_memory", P)
            }), Lj.default.createElement(T, null, " "), Lj.default.createElement(_jK, {
                label: "[Bad]",
                color: "error",
                sentiment: "negative",
                hover: j,
                rating: $,
                setHover: H,
                onRate: (N) => w(z, N, "tiny_memory", P)
            }))), k.map(O4Y))
        }, K[14] = j, K[15] = z, K[16] = w, K[17] = $, K[18] = X, K[19] = P, K[20] = G;
        else G = K[20];
        D = _.map(G), K[6] = j, K[7] = _, K[8] = z, K[9] = w, K[10] = $, K[11] = X, K[12] = P, K[13] = D
    } else D = K[13];
    let Z;
    if (K[21] !== A || K[22] !== W || K[23] !== D) Z = Lj.default.createElement(u, {
        flexDirection: "column",
        marginTop: W,
        backgroundColor: A
    }, D), K[21] = A, K[22] = W, K[23] = D, K[24] = Z;
    else Z = K[24];
    return Z
}
// @from(Ln 352094, Col 0)
function O4Y(q, K) {
    return Lj.default.createElement(u, {
        key: K,
        flexDirection: "row",
        marginTop: K > 0 ? 1 : 0
    }, Lj.default.createElement(u, {
        width: 4,
        flexShrink: 0
    }, Lj.default.createElement(T, {
        dimColor: !0
    }, "  · ")), Lj.default.createElement(u, {
        flexShrink: 1,
        flexGrow: 1
    }, Lj.default.createElement(T, {
        wrap: "wrap"
    }, q)))
}
// @from(Ln 352112, Col 0)
function w4Y(q) {
    return q.replace(/^-\s*/, "")
}
// @from(Ln 352116, Col 0)
function _jK(q) {
    let K = s(17),
        {
            label: _,
            color: z,
            sentiment: Y,
            hover: A,
            rating: O,
            setHover: w,
            onRate: $
        } = q,
        j;
    if (K[0] !== $ || K[1] !== Y) j = () => $(Y), K[0] = $, K[1] = Y, K[2] = j;
    else j = K[2];
    let H;
    if (K[3] !== Y || K[4] !== w) H = () => w(Y), K[3] = Y, K[4] = w, K[5] = H;
    else H = K[5];
    let J;
    if (K[6] !== w) J = () => w(null), K[6] = w, K[7] = J;
    else J = K[7];
    let X = A === Y ? void 0 : z,
        M = O !== void 0 && O !== Y,
        P;
    if (K[8] !== _ || K[9] !== X || K[10] !== M) P = Lj.default.createElement(T, {
        color: X,
        dimColor: M
    }, _), K[8] = _, K[9] = X, K[10] = M, K[11] = P;
    else P = K[11];
    let W;
    if (K[12] !== j || K[13] !== H || K[14] !== J || K[15] !== P) W = Lj.default.createElement(PJ, {
        onClick: j,
        onMouseEnter: H,
        onMouseLeave: J
    }, P), K[12] = j, K[13] = H, K[14] = J, K[15] = P, K[16] = W;
    else W = K[16];
    return W
}
// @from(Ln 352154, Col 0)
function $4Y(q) {
    return q === "+" || q === "-"
}
// @from(Ln 352158, Col 0)
function OjK(q) {
    let K = s(11),
        {
            messages: _,
            setInputValue: z,
            enabled: Y
        } = q,
        A = tC6(),
        O = Lj.useContext(dl),
        w;
    if (K[0] !== Y || K[1] !== _) {
        q: {
            if (!Y) {
                w = null;
                break q
            }
            let X = _.findLast(j4Y);
            if (X?.type !== "attachment") {
                w = null;
                break q
            }
            if (X.attachment.type !== "relevant_memories") {
                w = null;
                break q
            }
            w = {
                uuid: X.uuid,
                scopeCounts: YjK(X.attachment.memories)
            }
        }
        K[0] = Y,
        K[1] = _,
        K[2] = w
    }
    else w = K[2];
    let $ = w,
        j;
    if (K[3] !== O || K[4] !== $) j = (X) => {
        if (O === null || $ === null) return;
        O($.uuid, X === "+" ? "positive" : "negative", "tiny_memory", $.scopeCounts)
    }, K[3] = O, K[4] = $, K[5] = j;
    else j = K[5];
    let H = Y && O !== null && $ !== null,
        J;
    if (K[6] !== A || K[7] !== z || K[8] !== j || K[9] !== H) J = {
        inputValue: A,
        setInputValue: z,
        isValidDigit: $4Y,
        onDigit: j,
        enabled: H
    }, K[6] = A, K[7] = z, K[8] = j, K[9] = H, K[10] = J;
    else J = K[10];
    return C96(J), null
}
// @from(Ln 352213, Col 0)
function j4Y(q) {
    return q.type === "attachment" && q.attachment.type === "relevant_memories" && jq7(q.attachment.memories)
}
// @from(Ln 352216, Col 4)
Lj
// @from(Ln 352216, Col 8)
KjK = `

Sources: `
// @from(Ln 352219, Col 4)
A4Y
// @from(Ln 352220, Col 4)
Hq7 = L(() => {
    o6();
    A3();
    xu1();
    g6();
    nO();
    RK8();
    SK8();
    iC6();
    Lj = K6(P6(), 1);
    A4Y = /^<synthesis:(.+)>$/
})
// @from(Ln 352236, Col 0)
function og8(q) {
    let K = s(12),
        {
            imageId: _,
            addMargin: z
        } = q,
        Y = Kp((M) => _ !== void 0 ? M.storedImagePaths.get(_) ?? null : null) ?? null,
        A = Kp((M) => _ !== void 0 ? M.imageDescriptions.get(_) ?? null : null) ?? null,
        O = _ ? `[Image #${_}]` : "[Image]",
        w;
    if (K[0] !== Y || K[1] !== O) w = Y && Vf() ? ek.createElement(yq, {
        url: H4Y(Y).href
    }, ek.createElement(T, null, O)) : ek.createElement(T, null, O), K[0] = Y, K[1] = O, K[2] = w;
    else w = K[2];
    let $ = w,
        j;
    if (K[3] !== A) j = A ? ek.createElement(T, {
        dimColor: !0
    }, " ", A) : null, K[3] = A, K[4] = j;
    else j = K[4];
    let H;
    if (K[5] !== $ || K[6] !== j) H = ek.createElement(T, null, $, j), K[5] = $, K[6] = j, K[7] = H;
    else H = K[7];
    let J = H;
    if (z) {
        let M;
        if (K[8] !== J) M = ek.createElement(u, {
            marginTop: 1
        }, J), K[8] = J, K[9] = M;
        else M = K[9];
        return M
    }
    let X;
    if (K[10] !== J) X = ek.createElement(_1, null, J), K[10] = J, K[11] = X;
    else X = K[11];
    return X
}
// @from(Ln 352273, Col 4)
ek
// @from(Ln 352274, Col 4)
Jq7 = L(() => {
    o6();
    u46();
    vd();
    g6();
    N7();
    GK();
    ek = K6(P6(), 1)
})
// @from(Ln 352284, Col 0)
function X4Y(q) {
    let K = [];
    for (let _ of q.matchAll(J4Y))
        if (_[1] && _[4]) K.push({
            teammateId: _[1],
            color: _[2],
            summary: _[3],
            content: _[4].trim()
        });
    return K
}
// @from(Ln 352296, Col 0)
function M4Y(q) {
    if (q === "leader") return "leader";
    return q
}
// @from(Ln 352301, Col 0)
function wjK({
    addMargin: q,
    param: {
        text: K
    },
    isTranscriptMode: _
}) {
    let z = X4Y(K).filter((Y) => {
        if (Qk(Y.content)) return !1;
        try {
            if (n8(Y.content)?.type === "teammate_terminated") return !1
        } catch {}
        return !0
    });
    if (z.length === 0) return null;
    return R_.createElement(u, {
        flexDirection: "column",
        marginTop: q ? 1 : 0,
        width: "100%"
    }, z.map((Y, A) => {
        let O = KG(Y.color),
            w = M4Y(Y.teammateId),
            $ = ig8(Y.content, w);
        if ($) return R_.createElement(R_.Fragment, {
            key: A
        }, $);
        let j = r$K(Y.content);
        if (j) return R_.createElement(R_.Fragment, {
            key: A
        }, j);
        let H = a$K(Y.content);
        if (H) return R_.createElement(R_.Fragment, {
            key: A
        }, H);
        let J = null;
        try {
            J = n8(Y.content)
        } catch {}
        if (J?.type === "idle_notification") return null;
        if (J?.type === "task_completed") {
            let X = J;
            return R_.createElement(u, {
                key: A,
                flexDirection: "column",
                marginTop: 1
            }, R_.createElement(T, {
                color: O
            }, `@${w}${e6.pointer}`), R_.createElement(_1, null, R_.createElement(D4, {
                status: "success"
            }), R_.createElement(T, null, " ", "Completed task #", X.taskId, X.taskSubject && R_.createElement(T, {
                dimColor: !0
            }, " (", X.taskSubject, ")"))))
        }
        return R_.createElement(Xq7, {
            key: A,
            displayName: w,
            inkColor: O,
            content: Y.content,
            summary: Y.summary,
            isTranscriptMode: _
        })
    }))
}
// @from(Ln 352365, Col 0)
function Xq7(q) {
    let K = s(14),
        {
            displayName: _,
            inkColor: z,
            content: Y,
            summary: A,
            isTranscriptMode: O
        } = q,
        w = `@${_}${e6.pointer}`,
        $;
    if (K[0] !== z || K[1] !== w) $ = R_.createElement(T, {
        color: z
    }, w), K[0] = z, K[1] = w, K[2] = $;
    else $ = K[2];
    let j;
    if (K[3] !== A) j = A && R_.createElement(T, null, " ", A), K[3] = A, K[4] = j;
    else j = K[4];
    let H;
    if (K[5] !== $ || K[6] !== j) H = R_.createElement(u, null, $, j), K[5] = $, K[6] = j, K[7] = H;
    else H = K[7];
    let J;
    if (K[8] !== Y || K[9] !== O) J = O && R_.createElement(u, {
        paddingLeft: 2
    }, R_.createElement(T, null, R_.createElement(v5, null, Y))), K[8] = Y, K[9] = O, K[10] = J;
    else J = K[10];
    let X;
    if (K[11] !== H || K[12] !== J) X = R_.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, H, J), K[11] = H, K[12] = J, K[13] = X;
    else X = K[13];
    return X
}
// @from(Ln 352399, Col 4)
R_
// @from(Ln 352399, Col 8)
J4Y
// @from(Ln 352400, Col 4)
Mq7 = L(() => {
    o6();
    Qq();
    rA();
    g6();
    pt();
    e8();
    ZX();
    Y2();
    GK();
    wq7();
    Aq7();
    Oq7();
    R_ = K6(P6(), 1), J4Y = new RegExp(`<${oX}\\s+teammate_id="([^"]+)"(?:\\s+color="([^"]+)")?(?:\\s+summary="([^"]+)")?>\\n?([\\s\\S]*?)\\n?<\\/${oX}>`, "g")
})
// @from(Ln 352416, Col 0)
function P4Y(q) {
    switch (q) {
        case "completed":
            return "success";
        case "failed":
            return "error";
        case "killed":
            return "warning";
        default:
            return "text"
    }
}
// @from(Ln 352429, Col 0)
function $jK(q) {
    let K = s(12),
        {
            addMargin: _,
            param: z
        } = q,
        {
            text: Y
        } = z,
        A;
    if (K[0] !== Y) A = vK(Y, "summary"), K[0] = Y, K[1] = A;
    else A = K[1];
    let O = A;
    if (!O) return null;
    let w;
    if (K[2] !== Y) {
        let M = vK(Y, "status");
        w = P4Y(M), K[2] = Y, K[3] = w
    } else w = K[3];
    let $ = w,
        j = _ ? 1 : 0,
        H;
    if (K[4] !== $) H = sX6.createElement(T, {
        color: $
    }, $9), K[4] = $, K[5] = H;
    else H = K[5];
    let J;
    if (K[6] !== O || K[7] !== H) J = sX6.createElement(T, null, H, " ", O), K[6] = O, K[7] = H, K[8] = J;
    else J = K[8];
    let X;
    if (K[9] !== j || K[10] !== J) X = sX6.createElement(u, {
        marginTop: j
    }, J), K[9] = j, K[10] = J, K[11] = X;
    else X = K[11];
    return X
}
// @from(Ln 352465, Col 4)
sX6
// @from(Ln 352466, Col 4)
jjK = L(() => {
    o6();
    A3();
    g6();
    _7();
    sX6 = K6(P6(), 1)
})
// @from(Ln 352474, Col 0)
function ag8(q) {
    let K = s(8),
        {
            param: _,
            addMargin: z
        } = q,
        {
            text: Y
        } = _,
        A;
    if (K[0] !== Y) A = vK(Y, "bash-input"), K[0] = Y, K[1] = A;
    else A = K[1];
    let O = A;
    if (!O) return null;
    let w = z ? 1 : 0,
        $;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) $ = tX6.createElement(T, {
        color: "bashBorder"
    }, "! "), K[2] = $;
    else $ = K[2];
    let j;
    if (K[3] !== O) j = tX6.createElement(T, {
        color: "text"
    }, O), K[3] = O, K[4] = j;
    else j = K[4];
    let H;
    if (K[5] !== w || K[6] !== j) H = tX6.createElement(u, {
        flexDirection: "row",
        marginTop: w,
        backgroundColor: "bashMessageBackgroundColor",
        paddingRight: 1
    }, $, j), K[5] = w, K[6] = j, K[7] = H;
    else H = K[7];
    return H
}
// @from(Ln 352509, Col 4)
tX6
// @from(Ln 352510, Col 4)
Pq7 = L(() => {
    o6();
    g6();
    _7();
    tX6 = K6(P6(), 1)
})
// @from(Ln 352517, Col 0)
function HjK(q) {
    let K = s(10),
        {
            content: _,
            verbose: z
        } = q,
        Y;
    if (K[0] !== _) {
        let J = vK(_, "bash-stdout") ?? "";
        Y = vK(J, "persisted-output") ?? J, K[0] = _, K[1] = Y
    } else Y = K[1];
    let A = Y,
        O;
    if (K[2] !== _) O = vK(_, "bash-stderr") ?? "", K[2] = _, K[3] = O;
    else O = K[3];
    let w = O,
        $;
    if (K[4] !== w || K[5] !== A) $ = {
        stdout: A,
        stderr: w
    }, K[4] = w, K[5] = A, K[6] = $;
    else $ = K[6];
    let j = !!z,
        H;
    if (K[7] !== $ || K[8] !== j) H = Wq7.createElement(FX6, {
        content: $,
        verbose: j
    }), K[7] = $, K[8] = j, K[9] = H;
    else H = K[9];
    return H
}
// @from(Ln 352548, Col 4)
Wq7
// @from(Ln 352549, Col 4)
JjK = L(() => {
    o6();
    $g8();
    _7();
    Wq7 = K6(P6(), 1)
})
// @from(Ln 352556, Col 0)
function XjK(q) {
    let K = s(19),
        {
            addMargin: _,
            param: z
        } = q,
        {
            text: Y
        } = z,
        A;
    if (K[0] !== Y) A = vK(Y, LW), K[0] = Y, K[1] = A;
    else A = K[1];
    let O = A,
        w;
    if (K[2] !== Y) w = vK(Y, "command-args"), K[2] = Y, K[3] = w;
    else w = K[3];
    let $ = w,
        j = vK(Y, "skill-format") === "true";
    if (!O) return null;
    if (j) {
        let D = _ ? 1 : 0,
            Z;
        if (K[4] === Symbol.for("react.memo_cache_sentinel")) Z = AG.createElement(T, {
            color: "subtle"
        }, e6.pointer, " "), K[4] = Z;
        else Z = K[4];
        let G;
        if (K[5] !== O) G = AG.createElement(T, null, Z, AG.createElement(T, {
            color: "text"
        }, "Skill(", O, ")")), K[5] = O, K[6] = G;
        else G = K[6];
        let f;
        if (K[7] !== D || K[8] !== G) f = AG.createElement(u, {
            flexDirection: "column",
            marginTop: D,
            backgroundColor: "userMessageBackground",
            paddingRight: 1
        }, G), K[7] = D, K[8] = G, K[9] = f;
        else f = K[9];
        return f
    }
    let H;
    if (K[10] !== $ || K[11] !== O) H = [O, $].filter(Boolean), K[10] = $, K[11] = O, K[12] = H;
    else H = K[12];
    let J = `/${H.join(" ")}`,
        X = _ ? 1 : 0,
        M;
    if (K[13] === Symbol.for("react.memo_cache_sentinel")) M = AG.createElement(T, {
        color: "subtle"
    }, e6.pointer, " "), K[13] = M;
    else M = K[13];
    let P;
    if (K[14] !== J) P = AG.createElement(T, null, M, AG.createElement(T, {
        color: "text"
    }, J)), K[14] = J, K[15] = P;
    else P = K[15];
    let W;
    if (K[16] !== X || K[17] !== P) W = AG.createElement(u, {
        flexDirection: "column",
        marginTop: X,
        backgroundColor: "userMessageBackground",
        paddingRight: 1
    }, P), K[16] = X, K[17] = P, K[18] = W;
    else W = K[18];
    return W
}
// @from(Ln 352622, Col 4)
AG
// @from(Ln 352623, Col 4)
MjK = L(() => {
    o6();
    Qq();
    rA();
    g6();
    _7();
    AG = K6(P6(), 1)
})
// @from(Ln 352632, Col 0)
function WjK(q) {
    let K = s(4),
        {
            content: _
        } = q,
        z, Y;
    if (K[0] !== _) {
        Y = Symbol.for("react.early_return_sentinel");
        q: {
            let A = vK(_, "local-command-stdout"),
                O = vK(_, "local-command-stderr");
            if (!A && !O) {
                let w;
                if (K[3] === Symbol.for("react.memo_cache_sentinel")) w = uY.createElement(_1, null, uY.createElement(T, {
                    dimColor: !0
                }, Yy)), K[3] = w;
                else w = K[3];
                Y = w;
                break q
            }
            if (z = [], A?.trim()) z.push(uY.createElement(PjK, {
                key: "stdout"
            }, A.trim()));
            if (O?.trim()) z.push(uY.createElement(PjK, {
                key: "stderr"
            }, O.trim()))
        }
        K[0] = _, K[1] = z, K[2] = Y
    } else z = K[1], Y = K[2];
    if (Y !== Symbol.for("react.early_return_sentinel")) return Y;
    return z
}
// @from(Ln 352665, Col 0)
function PjK(q) {
    let K = s(5),
        {
            children: _
        } = q;
    if (_.startsWith(`${eH} `) || _.startsWith(`${dZ} `)) {
        let A;
        if (K[0] !== _) A = uY.createElement(W4Y, null, _), K[0] = _, K[1] = A;
        else A = K[1];
        return A
    }
    let z;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) z = uY.createElement(T, {
        dimColor: !0
    }, "  ⎿  "), K[2] = z;
    else z = K[2];
    let Y;
    if (K[3] !== _) Y = uY.createElement(u, {
        flexDirection: "row"
    }, z, uY.createElement(u, {
        flexDirection: "column",
        flexGrow: 1
    }, uY.createElement(xw, null, _))), K[3] = _, K[4] = Y;
    else Y = K[4];
    return Y
}
// @from(Ln 352692, Col 0)
function W4Y(q) {
    let K = s(19),
        {
            children: _
        } = q,
        z = _[0],
        Y, A, O;
    if (K[0] !== _) {
        let P = _.indexOf(`
`),
            W = P === -1 ? _.slice(2) : _.slice(2, P);
        A = P === -1 ? "" : _.slice(P + 1).trim();
        let D = W.indexOf(" · ");
        Y = D === -1 ? W : W.slice(0, D), O = D === -1 ? "" : W.slice(D), K[0] = _, K[1] = Y, K[2] = A, K[3] = O
    } else Y = K[1], A = K[2], O = K[3];
    let w = O,
        $;
    if (K[4] !== z) $ = uY.createElement(T, {
        color: "background"
    }, z, " "), K[4] = z, K[5] = $;
    else $ = K[5];
    let j;
    if (K[6] !== Y) j = uY.createElement(T, {
        bold: !0
    }, Y), K[6] = Y, K[7] = j;
    else j = K[7];
    let H;
    if (K[8] !== w) H = w && uY.createElement(T, {
        dimColor: !0
    }, w), K[8] = w, K[9] = H;
    else H = K[9];
    let J;
    if (K[10] !== $ || K[11] !== j || K[12] !== H) J = uY.createElement(T, null, $, j, H), K[10] = $, K[11] = j, K[12] = H, K[13] = J;
    else J = K[13];
    let X;
    if (K[14] !== A) X = A && uY.createElement(u, {
        flexDirection: "row"
    }, uY.createElement(T, {
        dimColor: !0
    }, "  ⎿  "), uY.createElement(T, {
        dimColor: !0
    }, A)), K[14] = A, K[15] = X;
    else X = K[15];
    let M;
    if (K[16] !== J || K[17] !== X) M = uY.createElement(u, {
        flexDirection: "column"
    }, J, X), K[16] = J, K[17] = X, K[18] = M;
    else M = K[18];
    return M
}
// @from(Ln 352742, Col 4)
uY
// @from(Ln 352743, Col 4)
DjK = L(() => {
    o6();
    A3();
    g6();
    _7();
    ry();
    GK();
    uY = K6(P6(), 1)
})
// @from(Ln 352753, Col 0)
function D4Y() {
    return LJ(["Got it.", "Good to know.", "Noted."])
}
// @from(Ln 352757, Col 0)
function ZjK(q) {
    let K = s(10),
        {
            text: _,
            addMargin: z
        } = q,
        Y;
    if (K[0] !== _) Y = vK(_, "user-memory-input"), K[0] = _, K[1] = Y;
    else Y = K[1];
    let A = Y,
        O;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) O = D4Y(), K[2] = O;
    else O = K[2];
    let w = O;
    if (!A) return null;
    let $ = z ? 1 : 0,
        j;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) j = HS.createElement(T, {
        color: "remember",
        backgroundColor: "memoryBackgroundColor"
    }, "#"), K[3] = j;
    else j = K[3];
    let H;
    if (K[4] !== A) H = HS.createElement(u, null, j, HS.createElement(T, {
        backgroundColor: "memoryBackgroundColor",
        color: "text"
    }, " ", A, " ")), K[4] = A, K[5] = H;
    else H = K[5];
    let J;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) J = HS.createElement(_1, {
        height: 1
    }, HS.createElement(T, {
        dimColor: !0
    }, w)), K[6] = J;
    else J = K[6];
    let X;
    if (K[7] !== $ || K[8] !== H) X = HS.createElement(u, {
        flexDirection: "column",
        marginTop: $,
        width: "100%"
    }, H, J), K[7] = $, K[8] = H, K[9] = X;
    else X = K[9];
    return X
}
// @from(Ln 352801, Col 4)
HS
// @from(Ln 352802, Col 4)
fjK = L(() => {
    o6();
    uc();
    g6();
    _7();
    GK();
    HS = K6(P6(), 1)
})
// @from(Ln 352811, Col 0)
function sg8(q) {
    let K = s(6),
        {
            addMargin: _,
            planContent: z
        } = q,
        Y = _ ? 1 : 0,
        A;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) A = tt.createElement(u, {
        marginBottom: 1
    }, tt.createElement(T, {
        bold: !0,
        color: "planMode"
    }, "Plan to implement")), K[0] = A;
    else A = K[0];
    let O;
    if (K[1] !== z) O = tt.createElement(xw, null, z), K[1] = z, K[2] = O;
    else O = K[2];
    let w;
    if (K[3] !== Y || K[4] !== O) w = tt.createElement(u, {
        flexDirection: "column",
        borderStyle: "round",
        borderColor: "planMode",
        marginTop: Y,
        paddingX: 1
    }, A, O), K[3] = Y, K[4] = O, K[5] = w;
    else w = K[5];
    return w
}
// @from(Ln 352840, Col 4)
tt
// @from(Ln 352841, Col 4)
Dq7 = L(() => {
    o6();
    g6();
    ry();
    tt = K6(P6(), 1)
})
// @from(Ln 352848, Col 0)
function vjK() {
    return et.useContext(GjK)
}
// @from(Ln 352852, Col 0)
function TjK(q) {
    let K = s(9),
        {
            isFirst: _,
            useBriefLayout: z,
            children: Y
        } = q,
        A = z ? 0 : Z4Y,
        O = A * 2,
        w;
    if (K[0] !== _ || K[1] !== O) w = {
        isQueued: !0,
        isFirst: _,
        paddingWidth: O
    }, K[0] = _, K[1] = O, K[2] = w;
    else w = K[2];
    let $ = w,
        j;
    if (K[3] !== Y || K[4] !== A) j = et.createElement(u, {
        paddingX: A
    }, Y), K[3] = Y, K[4] = A, K[5] = j;
    else j = K[5];
    let H;
    if (K[6] !== j || K[7] !== $) H = et.createElement(GjK.Provider, {
        value: $
    }, j), K[6] = j, K[7] = $, K[8] = H;
    else H = K[8];
    return H
}
// @from(Ln 352881, Col 4)
et
// @from(Ln 352881, Col 8)
GjK
// @from(Ln 352881, Col 13)
Z4Y = 2
// @from(Ln 352882, Col 4)
Zq7 = L(() => {
    o6();
    g6();
    et = K6(P6(), 1), GjK = et.createContext(void 0)
})
// @from(Ln 352888, Col 0)
function tg8(q, K = new Date) {
    let _ = new Date(q);
    if (Number.isNaN(_.getTime())) return "";
    let z = T4Y(),
        Y = VjK(K) - VjK(_),
        A = Math.round(Y / 86400000);
    if (A === 0) return ew8(z, f4Y).format(_);
    if (A > 0 && A < 7) return ew8(z, G4Y).format(_);
    return ew8(z, v4Y).format(_)
}
// @from(Ln 352899, Col 0)
function T4Y() {
    let q = process.env.LC_ALL || process.env.LC_TIME || process.env.LANG || "";
    if (fq7.has(q)) return fq7.get(q);
    let K = V4Y(q);
    return fq7.set(q, K), K
}
// @from(Ln 352906, Col 0)
function V4Y(q) {
    if (!q || q === "C" || q === "POSIX") return;
    let K = i5(i5(q, "."), "@");
    if (!K) return;
    let _ = K.replaceAll("_", "-");
    try {
        return new Intl.DateTimeFormat(_), _
    } catch {
        return
    }
}
// @from(Ln 352918, Col 0)
function VjK(q) {
    return new Date(q.getFullYear(), q.getMonth(), q.getDate()).getTime()
}
// @from(Ln 352921, Col 4)
f4Y
// @from(Ln 352921, Col 9)
G4Y
// @from(Ln 352921, Col 14)
v4Y
// @from(Ln 352921, Col 19)
fq7
// @from(Ln 352922, Col 4)
Gq7 = L(() => {
    IZ();
    f4Y = {
        hour: "numeric",
        minute: "2-digit"
    }, G4Y = {
        weekday: "long",
        hour: "numeric",
        minute: "2-digit"
    }, v4Y = {
        weekday: "long",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }, fq7 = new Map
})
// @from(Ln 352940, Col 0)
function EjK(q) {
    let K = s(25),
        {
            text: _,
            useBriefLayout: z,
            timestamp: Y
        } = q,
        A = vjK(),
        O = A?.isQueued ?? !1,
        $ = NjK.useContext(Vs) ? "suggestion" : "subtle",
        j = typeof _ === "object";
    if (z) {
        let P;
        if (K[0] !== Y) P = Y ? tg8(Y) : "", K[0] = Y, K[1] = P;
        else P = K[1];
        let W = P,
            D = O ? "subtle" : "text",
            Z = O ? "subtle" : "briefLabelYou",
            G;
        if (K[2] !== Z) G = k3.createElement(T, {
            color: Z
        }, "You"), K[2] = Z, K[3] = G;
        else G = K[3];
        let f;
        if (K[4] !== W) f = W ? k3.createElement(T, {
            dimColor: !0
        }, " ", W) : null, K[4] = W, K[5] = f;
        else f = K[5];
        let v;
        if (K[6] !== G || K[7] !== f) v = k3.createElement(u, {
            flexDirection: "row"
        }, G, f), K[6] = G, K[7] = f, K[8] = v;
        else v = K[8];
        let V;
        if (K[9] !== _ || K[10] !== D || K[11] !== j) V = j ? k3.createElement(k3.Fragment, null, k3.createElement(T, {
            color: D
        }, _.head), k3.createElement(kjK, {
            hiddenLines: _.hiddenLines,
            indent: 2
        }), k3.createElement(T, {
            color: D
        }, _.tail)) : k3.createElement(T, {
            color: D
        }, _), K[9] = _, K[10] = D, K[11] = j, K[12] = V;
        else V = K[12];
        let k;
        if (K[13] !== v || K[14] !== V) k = k3.createElement(u, {
            flexDirection: "column",
            paddingLeft: 2
        }, v, V), K[13] = v, K[14] = V, K[15] = k;
        else k = K[15];
        return k
    }
    let H = 3 + (A?.paddingWidth ?? 0),
        J;
    if (K[16] !== $) J = k3.createElement(u, {
        flexShrink: 0
    }, k3.createElement(T, {
        color: $
    }, e6.pointer, " ")), K[16] = $, K[17] = J;
    else J = K[17];
    let X;
    if (K[18] !== H || K[19] !== _ || K[20] !== j) X = j ? k3.createElement(u, {
        flexDirection: "column"
    }, k3.createElement(vq7, {
        text: _.head
    }), k3.createElement(kjK, {
        hiddenLines: _.hiddenLines,
        indent: H
    }), k3.createElement(vq7, {
        text: _.tail
    })) : k3.createElement(vq7, {
        text: _
    }), K[18] = H, K[19] = _, K[20] = j, K[21] = X;
    else X = K[21];
    let M;
    if (K[22] !== J || K[23] !== X) M = k3.createElement(u, {
        flexDirection: "row"
    }, J, X), K[22] = J, K[23] = X, K[24] = M;
    else M = K[24];
    return M
}
// @from(Ln 353023, Col 0)
function kjK(q) {
    let K = s(3),
        {
            hiddenLines: _,
            indent: z
        } = q,
        Y = `(${_} ${_===1?"line":"lines"} hidden)`,
        A;
    if (K[0] !== z || K[1] !== Y) A = k3.createElement(zA, {
        title: Y,
        titleAlign: "start",
        color: "subtle",
        padding: z
    }), K[0] = z, K[1] = Y, K[2] = A;
    else A = K[2];
    return A
}
// @from(Ln 353041, Col 0)
function vq7(q) {
    let K = s(3),
        {
            text: _
        } = q,
        z, Y;
    if (K[0] !== _) {
        Y = Symbol.for("react.early_return_sentinel");
        q: {
            let A = Ps() ? Vh8(_) : [];
            if (A.length === 0) {
                Y = k3.createElement(T, {
                    color: "text"
                }, _);
                break q
            }
            let O = [],
                w = 0;
            for (let $ of A) {
                if ($.start > w) O.push(k3.createElement(T, {
                    key: `plain-${w}`,
                    color: "text"
                }, _.slice(w, $.start)));
                for (let j = $.start; j < $.end; j++) O.push(k3.createElement(T, {
                    key: `rb-${j}`,
                    color: Dp(j - $.start)
                }, _[j]));
                w = $.end
            }
            if (w < _.length) O.push(k3.createElement(T, {
                key: `plain-${w}`,
                color: "text"
            }, _.slice(w)));z = k3.createElement(T, null, O)
        }
        K[0] = _, K[1] = z, K[2] = Y
    } else z = K[1], Y = K[2];
    if (Y !== Symbol.for("react.early_return_sentinel")) return Y;
    return z
}
// @from(Ln 353080, Col 4)
k3
// @from(Ln 353080, Col 8)
NjK
// @from(Ln 353081, Col 4)
yjK = L(() => {
    o6();
    Qq();
    Zq7();
    g6();
    Gq7();
    NR();
    VR();
    wy();
    k3 = K6(P6(), 1), NjK = K6(P6(), 1)
})
// @from(Ln 353093, Col 0)
function hjK({
    addMargin: q,
    param: {
        text: K
    },
    isTranscriptMode: _,
    timestamp: z
}) {
    let Y = M8((H) => H.isBriefOnly),
        A = M8((H) => H.viewingAgentTaskId),
        O = b96.useMemo(() => S6(process.env.CLAUDE_CODE_BRIEF), []),
        w = (aG() || cL() && (O || u8("tengu_kairos_brief", !1))) && Y && !_ && !A,
        $ = b96.useMemo(() => {
            if (K.length <= k4Y) return K;
            let H = K.slice(0, LjK),
                J = K.slice(-N4Y),
                X = tz(K, `
`, LjK) - tz(J, `
`);
            return {
                head: H,
                hiddenLines: X,
                tail: J
            }
        }, [K]),
        j = b96.useContext(Vs);
    if (!K) return j6(Error("No content found in user prompt message")), null;
    return b96.default.createElement(u, {
        flexDirection: "column",
        marginTop: q ? 1 : 0,
        backgroundColor: j ? "messageActionsBackground" : w ? void 0 : "userMessageBackground",
        paddingRight: w ? 0 : 1
    }, b96.default.createElement(EjK, {
        text: $,
        useBriefLayout: w,
        timestamp: w ? z : void 0
    }))
}
// @from(Ln 353131, Col 4)
b96
// @from(Ln 353131, Col 9)
k4Y = 1e4
// @from(Ln 353132, Col 4)
LjK = 2500
// @from(Ln 353133, Col 4)
N4Y = 2500
// @from(Ln 353134, Col 4)
RjK = L(() => {
    y8();
    g6();
    B1();
    N7();
    Q8();
    U8();
    wy();
    yjK();
    b96 = K6(P6(), 1)
})
// @from(Ln 353146, Col 0)
function E4Y(q) {
    let K = [],
        _ = /<mcp-resource-update\s+server="([^"]+)"\s+uri="([^"]+)"[^>]*>(?:[\s\S]*?<reason>([^<]+)<\/reason>)?/g,
        z;
    while ((z = _.exec(q)) !== null) K.push({
        kind: "resource",
        server: z[1] ?? "",
        target: z[2] ?? "",
        reason: z[3]
    });
    let Y = /<mcp-polling-update\s+type="([^"]+)"\s+server="([^"]+)"\s+tool="([^"]+)"[^>]*>(?:[\s\S]*?<reason>([^<]+)<\/reason>)?/g;
    while ((z = Y.exec(q)) !== null) K.push({
        kind: "polling",
        server: z[2] ?? "",
        target: z[3] ?? "",
        reason: z[4]
    });
    return K
}
// @from(Ln 353166, Col 0)
function y4Y(q) {
    if (q.startsWith("file://")) {
        let K = q.slice(7),
            _ = K.split("/");
        return _[_.length - 1] || K
    }
    if (q.length > 40) return q.slice(0, 39) + "…";
    return q
}
// @from(Ln 353176, Col 0)
function SjK(q) {
    let K = s(12),
        {
            addMargin: _,
            param: z
        } = q,
        {
            text: Y
        } = z,
        A, O, w, $, j;
    if (K[0] !== _ || K[1] !== Y) {
        j = Symbol.for("react.early_return_sentinel");
        q: {
            let J = E4Y(Y);
            if (J.length === 0) {
                j = null;
                break q
            }
            A = u,
            O = "column",
            w = _ ? 1 : 0,
            $ = J.map(L4Y)
        }
        K[0] = _, K[1] = Y, K[2] = A, K[3] = O, K[4] = w, K[5] = $, K[6] = j
    } else A = K[2], O = K[3], w = K[4], $ = K[5], j = K[6];
    if (j !== Symbol.for("react.early_return_sentinel")) return j;
    let H;
    if (K[7] !== A || K[8] !== O || K[9] !== w || K[10] !== $) H = qN.createElement(A, {
        flexDirection: O,
        marginTop: w
    }, $), K[7] = A, K[8] = O, K[9] = w, K[10] = $, K[11] = H;
    else H = K[11];
    return H
}
// @from(Ln 353211, Col 0)
function L4Y(q, K) {
    return qN.createElement(u, {
        key: K
    }, qN.createElement(T, null, qN.createElement(T, {
        color: "success"
    }, Kg7), " ", qN.createElement(T, {
        dimColor: !0
    }, q.server, ":"), " ", qN.createElement(T, {
        color: "suggestion"
    }, q.kind === "resource" ? y4Y(q.target) : q.target), q.reason && qN.createElement(T, {
        dimColor: !0
    }, " · ", q.reason)))
}
// @from(Ln 353224, Col 4)
qN
// @from(Ln 353225, Col 4)
CjK = L(() => {
    o6();
    A3();
    g6();
    qN = K6(P6(), 1)
})
// @from(Ln 353231, Col 4)
bjK = {}
// @from(Ln 353236, Col 0)
function S4Y(q) {
    let K = q.lastIndexOf(":");
    return K === -1 ? q : q.slice(K + 1)
}
// @from(Ln 353241, Col 0)
function b4Y(q) {
    let K = s(29),
        {
            addMargin: _,
            param: z
        } = q,
        {
            text: Y
        } = z,
        A, O, w, $, j, H, J, X, M, P, W;
    if (K[0] !== _ || K[1] !== Y) {
        M = Symbol.for("react.early_return_sentinel");
        q: {
            let v = h4Y.exec(Y);
            if (!v) {
                M = null;
                break q
            }
            let [, V, k, N] = v;W = R4Y.exec(k ?? "")?.[1];
            let R = (N ?? "").trim().replace(/\s+/g, " ");
            if (P = j4(R, C4Y), w = u, X = _ ? 1 : 0, O = T, K[13] === Symbol.for("react.memo_cache_sentinel")) H = qe.createElement(T, {
                color: "suggestion"
            }, _g7),
            K[13] = H;
            else H = K[13];J = " ",
            A = T,
            $ = !0,
            j = S4Y(V ?? "")
        }
        K[0] = _, K[1] = Y, K[2] = A, K[3] = O, K[4] = w, K[5] = $, K[6] = j, K[7] = H, K[8] = J, K[9] = X, K[10] = M, K[11] = P, K[12] = W
    } else A = K[2], O = K[3], w = K[4], $ = K[5], j = K[6], H = K[7], J = K[8], X = K[9], M = K[10], P = K[11], W = K[12];
    if (M !== Symbol.for("react.early_return_sentinel")) return M;
    let D = W ? ` · ${W}` : "",
        Z;
    if (K[14] !== A || K[15] !== $ || K[16] !== j || K[17] !== D) Z = qe.createElement(A, {
        dimColor: $
    }, j, D, ":"), K[14] = A, K[15] = $, K[16] = j, K[17] = D, K[18] = Z;
    else Z = K[18];
    let G;
    if (K[19] !== O || K[20] !== H || K[21] !== J || K[22] !== Z || K[23] !== P) G = qe.createElement(O, null, H, J, Z, " ", P), K[19] = O, K[20] = H, K[21] = J, K[22] = Z, K[23] = P, K[24] = G;
    else G = K[24];
    let f;
    if (K[25] !== w || K[26] !== G || K[27] !== X) f = qe.createElement(w, {
        marginTop: X
    }, G), K[25] = w, K[26] = G, K[27] = X, K[28] = f;
    else f = K[28];
    return f
}
// @from(Ln 353289, Col 4)
qe
// @from(Ln 353289, Col 8)
h4Y
// @from(Ln 353289, Col 13)
R4Y
// @from(Ln 353289, Col 18)
C4Y = 60
// @from(Ln 353290, Col 4)
IjK = L(() => {
    o6();
    A3();
    rA();
    g6();
    c7();
    qe = K6(P6(), 1), h4Y = new RegExp(`<${Tf6}\\s+source="([^"]+)"([^>]*)>\\n?([\\s\\S]*?)\\n?</${Tf6}>`), R4Y = /\buser="([^"]+)"/
})
// @from(Ln 353299, Col 0)
function qM6(q) {
    let K = s(53),
        {
            addMargin: _,
            param: z,
            verbose: Y,
            planContent: A,
            isTranscriptMode: O,
            timestamp: w
        } = q;
    if (!z.text || z.text.trim() === Yy) return null;
    if (A) {
        let j;
        if (K[0] !== _ || K[1] !== A) j = t2.createElement(sg8, {
            addMargin: _,
            planContent: A
        }), K[0] = _, K[1] = A, K[2] = j;
        else j = K[2];
        return j
    }
    if (vK(z.text, T16)) return null;
    if (z.text.includes(`<${lU6}>`)) return null;
    if (z.text.startsWith("<bash-stdout") || z.text.startsWith("<bash-stderr")) {
        let j;
        if (K[3] !== z.text || K[4] !== Y) j = t2.createElement(HjK, {
            content: z.text,
            verbose: Y
        }), K[3] = z.text, K[4] = Y, K[5] = j;
        else j = K[5];
        return j
    }
    if (z.text.startsWith("<local-command-stdout") || z.text.startsWith("<local-command-stderr")) {
        let j;
        if (K[6] !== z.text) j = t2.createElement(WjK, {
            content: z.text
        }), K[6] = z.text, K[7] = j;
        else j = K[7];
        return j
    }
    if (z.text === M36 || z.text === of) {
        let j;
        if (K[8] === Symbol.for("react.memo_cache_sentinel")) j = t2.createElement(_1, {
            height: 1
        }, t2.createElement(gl, null)), K[8] = j;
        else j = K[8];
        return j
    }
    if (z.text.includes("<bash-input>")) {
        let j;
        if (K[17] !== _ || K[18] !== z) j = t2.createElement(ag8, {
            addMargin: _,
            param: z
        }), K[17] = _, K[18] = z, K[19] = j;
        else j = K[19];
        return j
    }
    if (z.text.includes(`<${LW}>`)) {
        let j;
        if (K[20] !== _ || K[21] !== z) j = t2.createElement(XjK, {
            addMargin: _,
            param: z
        }), K[20] = _, K[21] = z, K[22] = j;
        else j = K[22];
        return j
    }
    if (z.text.includes("<user-memory-input>")) {
        let j;
        if (K[23] !== _ || K[24] !== z.text) j = t2.createElement(ZjK, {
            addMargin: _,
            text: z.text
        }), K[23] = _, K[24] = z.text, K[25] = j;
        else j = K[25];
        return j
    }
    if (z4() && z.text.includes(`<${oX}`)) {
        let j;
        if (K[26] !== _ || K[27] !== O || K[28] !== z) j = t2.createElement(wjK, {
            addMargin: _,
            param: z,
            isTranscriptMode: O
        }), K[26] = _, K[27] = O, K[28] = z, K[29] = j;
        else j = K[29];
        return j
    }
    if (z.text.includes(`<${TA}`)) {
        let j;
        if (K[30] !== _ || K[31] !== z) j = t2.createElement($jK, {
            addMargin: _,
            param: z
        }), K[30] = _, K[31] = z, K[32] = j;
        else j = K[32];
        return j
    }
    if (z.text.includes("<mcp-resource-update") || z.text.includes("<mcp-polling-update")) {
        let j;
        if (K[33] !== _ || K[34] !== z) j = t2.createElement(SjK, {
            addMargin: _,
            param: z
        }), K[33] = _, K[34] = z, K[35] = j;
        else j = K[35];
        return j
    }
    if (z.text.includes('<channel source="')) {
        let j;
        if (K[44] === Symbol.for("react.memo_cache_sentinel")) j = (IjK(), B7(bjK)), K[44] = j;
        else j = K[44];
        let {
            UserChannelMessage: H
        } = j, J;
        if (K[45] !== _ || K[46] !== z) J = t2.createElement(H, {
            addMargin: _,
            param: z
        }), K[45] = _, K[46] = z, K[47] = J;
        else J = K[47];
        return J
    }
    let $;
    if (K[48] !== _ || K[49] !== O || K[50] !== z || K[51] !== w) $ = t2.createElement(hjK, {
        addMargin: _,
        param: z,
        isTranscriptMode: O,
        timestamp: w
    }), K[48] = _, K[49] = O, K[50] = z, K[51] = w, K[52] = $;
    else $ = K[52];
    return $
}
// @from(Ln 353425, Col 4)
t2
// @from(Ln 353426, Col 4)
eg8 = L(() => {
    o6();
    rA();
    fO();
    _7();
    cC6();
    GK();
    jjK();
    Pq7();
    JjK();
    MjK();
    DjK();
    fjK();
    Dq7();
    RjK();
    CjK();
    Mq7();
    t2 = K6(P6(), 1)
})