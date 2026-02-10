
// @from(Ln 430802, Col 0)
function M$q(A) {
    let q = e(3),
        {
            onDone: K
        } = A,
        Y, z;
    if (q[0] !== K) Y = () => {
        K(`Usage: /tag <tag-name>

Toggle a searchable tag on the current session.
Run the same command again to remove the tag.
Tags are displayed after the branch name in /resume and can be searched with /.

Examples:
  /tag bugfix        # Add tag
  /tag bugfix        # Remove tag (toggle)
  /tag feature-auth
  /tag wip`, {
            display: "system"
        })
    }, z = [K], q[0] = K, q[1] = Y, q[2] = z;
    else Y = q[1], z = q[2];
    return A_.useEffect(Y, z), null
}
// @from(Ln 430826, Col 0)
async function $3z(A, q, K) {
    if (K = K?.trim() || "", Gw1.includes(K) || Ww1.includes(K)) return A_.createElement(M$q, {
        onDone: A
    });
    if (!K) return A_.createElement(M$q, {
        onDone: A
    });
    return A_.createElement(H3z, {
        tagName: K,
        onDone: A
    })
}
// @from(Ln 430838, Col 4)
A_
// @from(Ln 430839, Col 4)
W$q = v(() => {
    i1();
    m1();
    B6();
    lq();
    q3();
    vz();
    U5();
    Bq();
    u6();
    A_ = o(X1(), 1)
})
// @from(Ln 430851, Col 4)
O3z
// @from(Ln 430851, Col 9)
G$q
// @from(Ln 430852, Col 4)
Z$q = v(() => {
    O3z = {
        type: "local-jsx",
        name: "tag",
        userFacingName() {
            return "tag"
        },
        description: "Toggle a searchable tag on the current session",
        isEnabled: () => !1,
        isHidden: !1,
        argumentHint: "<tag-name>",
        load: () => Promise.resolve().then(() => (W$q(), P$q))
    }, G$q = O3z
})
// @from(Ln 430866, Col 4)
f$q = {}
// @from(Ln 430871, Col 0)
function _3z(A) {
    let q = e(14),
        {
            onDone: K
        } = A,
        z = $j().outputStyle ?? Wj,
        w;
    if (q[0] !== z || q[1] !== K) w = () => {
        c("tengu_output_style_command_menu", {
            action: "cancel"
        }), K(`Kept output style as ${H6.bold(z)}`, {
            display: "system"
        })
    }, q[0] = z, q[1] = K, q[2] = w;
    else w = q[2];
    let H = w,
        $;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) $ = {
        context: "Confirmation"
    }, q[3] = $;
    else $ = q[3];
    DA("confirm:no", H, $);
    let O;
    if (q[4] !== z || q[5] !== K) O = function(M) {
        c("tengu_output_style_command_menu", {
            action: M,
            from_style: z,
            to_style: M
        }), Z7("localSettings", {
            outputStyle: M
        }), K(`Set output style to ${H6.bold(M)}`)
    }, q[4] = z, q[5] = K, q[6] = O;
    else O = q[6];
    let _ = O,
        J;
    if (q[7] !== z || q[8] !== K) J = function() {
        K(`Kept output style as ${H6.bold(z)}`, {
            display: "system"
        })
    }, q[7] = z, q[8] = K, q[9] = J;
    else J = q[9];
    let X = J,
        D;
    if (q[10] !== z || q[11] !== X || q[12] !== _) D = kc.createElement(_V6, {
        initialStyle: z,
        onComplete: _,
        onCancel: X,
        isStandaloneCommand: !0
    }), q[10] = z, q[11] = X, q[12] = _, q[13] = D;
    else D = q[13];
    return D
}
// @from(Ln 430924, Col 0)
function J3z(A, q) {
    if (A in q) return A;
    let K = A.toLowerCase();
    for (let Y of Object.keys(q))
        if (Y.toLowerCase() === K) return Y;
    return null
}
// @from(Ln 430932, Col 0)
function X3z({
    args: A,
    onDone: q
}) {
    return V91(h6()).then((K) => {
        let Y = J3z(A, K);
        if (!Y) {
            q(`Invalid output style: ${A}`);
            return
        }
        Z7("localSettings", {
            outputStyle: Y
        }), q(`Set output style to ${H6.bold(Y)}`)
    }), null
}
// @from(Ln 430948, Col 0)
function D3z(A) {
    let {
        onDone: q
    } = A, K = $j();
    return q(`Current output style: ${K.outputStyle??Wj}`), null
}
// @from(Ln 430954, Col 0)
async function j3z(A, q, K) {
    if (u8("output-style"), K = K?.trim() || "", Gw1.includes(K)) return c("tengu_output_style_command_inline_help", {
        args: K
    }), kc.createElement(D3z, {
        onDone: A
    });
    if (Ww1.includes(K)) {
        A("Run /output-style to open the output style selection menu, or /output-style [styleName] to set the output style.", {
            display: "system"
        });
        return
    }
    if (K) return c("tengu_output_style_command_inline", {
        args: K
    }), kc.createElement(X3z, {
        args: K,
        onDone: A
    });
    return kc.createElement(_3z, {
        onDone: A
    })
}
// @from(Ln 430976, Col 4)
kc
// @from(Ln 430977, Col 4)
V$q = v(() => {
    i1();
    lIA();
    K7();
    u6();
    q3();
    p8();
    cp();
    Em();
    N7();
    vz();
    v3();
    kc = o(X1(), 1)
})
// @from(Ln 430991, Col 4)
M3z
// @from(Ln 430991, Col 9)
N$q
// @from(Ln 430992, Col 4)
T$q = v(() => {
    M3z = {
        type: "local-jsx",
        name: "output-style",
        userFacingName() {
            return "output-style"
        },
        description: "Set the output style directly or from a selection menu",
        isEnabled: () => !0,
        isHidden: !1,
        argumentHint: "[style]",
        load: () => Promise.resolve().then(() => (V$q(), f$q))
    }, N$q = M3z
})
// @from(Ln 431006, Col 0)
async function v$q() {
    let A = await rW1();
    if (A.length === 0) return {
        availableEnvironments: [],
        selectedEnvironment: null,
        selectedEnvironmentSource: null
    };
    let K = C8()?.remote?.defaultEnvironmentId,
        Y = A[0],
        z = null;
    if (K) {
        let w = A.find((H) => H.environment_id === K);
        if (w) {
            Y = w;
            for (let H = gf.length - 1; H >= 0; H--) {
                let $ = gf[H];
                if (!$ || $ === "flagSettings") continue;
                if (y7($)?.remote?.defaultEnvironmentId === K) {
                    z = $;
                    break
                }
            }
        }
    }
    return {
        availableEnvironments: A,
        selectedEnvironment: Y,
        selectedEnvironmentSource: z
    }
}
// @from(Ln 431036, Col 4)
E$q = v(() => {
    p8();
    E$();
    QW6()
})
// @from(Ln 431042, Col 0)
function k$q(A) {
    let q = e(27),
        {
            onDone: K
        } = A,
        [Y, z] = Ue.useState("loading"),
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = [], q[0] = w;
    else w = q[0];
    let [H, $] = Ue.useState(w), [O, _] = Ue.useState(null), [J, X] = Ue.useState(null), [D, j] = Ue.useState(null), M, P;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) M = () => {
        (async function() {
            try {
                let T = await v$q();
                $(T.availableEnvironments), _(T.selectedEnvironment), X(T.selectedEnvironmentSource), z(null)
            } catch (T) {
                let k = T,
                    y = k instanceof Error ? k.message : String(k);
                K1(k instanceof Error ? k : Error(y)), j(y), z(null)
            }
        })()
    }, P = [], q[1] = M, q[2] = P;
    else M = q[1], P = q[2];
    Ue.useEffect(M, P);
    let W;
    if (q[3] !== H || q[4] !== K) W = function(N) {
        if (N === "cancel") {
            K();
            return
        }
        z("updating");
        let T = H.find((k) => k.environment_id === N);
        if (!T) {
            K("Error: Selected environment not found");
            return
        }
        Z7("localSettings", {
            remote: {
                defaultEnvironmentId: T.environment_id
            }
        }), K(`Set default remote environment to ${H6.bold(T.name)} (${T.environment_id})`)
    }, q[3] = H, q[4] = K, q[5] = W;
    else W = q[5];
    let G = W;
    if (Y === "loading") {
        let Z;
        if (q[6] === Symbol.for("react.memo_cache_sentinel")) Z = hK.createElement(Yd1, {
            message: "Loading environments…"
        }), q[6] = Z;
        else Z = q[6];
        let N;
        if (q[7] !== K) N = hK.createElement(w8, {
            title: Nd1,
            onCancel: K,
            hideInputGuide: !0
        }, Z), q[7] = K, q[8] = N;
        else N = q[8];
        return N
    }
    if (D) {
        let Z;
        if (q[9] !== D) Z = hK.createElement(V, {
            color: "error"
        }, "Error: ", D), q[9] = D, q[10] = Z;
        else Z = q[10];
        let N;
        if (q[11] !== K || q[12] !== Z) N = hK.createElement(w8, {
            title: Nd1,
            onCancel: K
        }, Z), q[11] = K, q[12] = Z, q[13] = N;
        else N = q[13];
        return N
    }
    if (!O) {
        let Z;
        if (q[14] === Symbol.for("react.memo_cache_sentinel")) Z = hK.createElement(V, null, "No remote environments available."), q[14] = Z;
        else Z = q[14];
        let N;
        if (q[15] !== K) N = hK.createElement(w8, {
            title: Nd1,
            subtitle: XBA,
            onCancel: K
        }, Z), q[15] = K, q[16] = N;
        else N = q[16];
        return N
    }
    if (H.length === 1) {
        let Z;
        if (q[17] !== K || q[18] !== O) Z = hK.createElement(W3z, {
            environment: O,
            onDone: K
        }), q[17] = K, q[18] = O, q[19] = Z;
        else Z = q[19];
        return Z
    }
    let f;
    if (q[20] !== H || q[21] !== G || q[22] !== Y || q[23] !== K || q[24] !== O || q[25] !== J) f = hK.createElement(G3z, {
        environments: H,
        selectedEnvironment: O,
        selectedEnvironmentSource: J,
        loadingState: Y,
        onSelect: G,
        onCancel: K
    }), q[20] = H, q[21] = G, q[22] = Y, q[23] = K, q[24] = O, q[25] = J, q[26] = f;
    else f = q[26];
    return f
}
// @from(Ln 431150, Col 0)
function P3z(A) {
    let q = e(7),
        {
            environment: K
        } = A,
        Y;
    if (q[0] !== K.name) Y = hK.createElement(V, {
        bold: !0
    }, K.name), q[0] = K.name, q[1] = Y;
    else Y = q[1];
    let z;
    if (q[2] !== K.environment_id) z = hK.createElement(V, {
        dimColor: !0
    }, "(", K.environment_id, ")"), q[2] = K.environment_id, q[3] = z;
    else z = q[3];
    let w;
    if (q[4] !== Y || q[5] !== z) w = hK.createElement(V, null, l1.tick, " Using ", Y, " ", z), q[4] = Y, q[5] = z, q[6] = w;
    else w = q[6];
    return w
}
// @from(Ln 431171, Col 0)
function W3z(A) {
    let q = e(6),
        {
            environment: K,
            onDone: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = {
        context: "Confirmation"
    }, q[0] = z;
    else z = q[0];
    DA("confirm:yes", Y, z);
    let w;
    if (q[1] !== K) w = hK.createElement(P3z, {
        environment: K
    }), q[1] = K, q[2] = w;
    else w = q[2];
    let H;
    if (q[3] !== Y || q[4] !== w) H = hK.createElement(w8, {
        title: Nd1,
        subtitle: XBA,
        onCancel: Y
    }, w), q[3] = Y, q[4] = w, q[5] = H;
    else H = q[5];
    return H
}
// @from(Ln 431198, Col 0)
function G3z(A) {
    let q = e(18),
        {
            environments: K,
            selectedEnvironment: Y,
            selectedEnvironmentSource: z,
            loadingState: w,
            onSelect: H,
            onCancel: $
        } = A,
        O;
    if (q[0] !== z) O = z && z !== "localSettings" ? ` (from ${vi(z)} settings)` : "", q[0] = z, q[1] = O;
    else O = q[1];
    let _ = O,
        J;
    if (q[2] !== Y.name) J = hK.createElement(V, {
        bold: !0
    }, Y.name), q[2] = Y.name, q[3] = J;
    else J = q[3];
    let X;
    if (q[4] !== _ || q[5] !== J) X = hK.createElement(V, null, "Currently using: ", J, _), q[4] = _, q[5] = J, q[6] = X;
    else X = q[6];
    let D = X,
        j;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) j = hK.createElement(V, {
        dimColor: !0
    }, XBA), q[7] = j;
    else j = q[7];
    let M;
    if (q[8] !== K || q[9] !== w || q[10] !== H || q[11] !== Y.environment_id) M = w === "updating" ? hK.createElement(Yd1, {
        message: "Updating…"
    }) : hK.createElement(kA, {
        options: K.map(Z3z),
        defaultValue: Y.environment_id,
        onChange: H,
        onCancel: () => H("cancel"),
        layout: "compact-vertical"
    }), q[8] = K, q[9] = w, q[10] = H, q[11] = Y.environment_id, q[12] = M;
    else M = q[12];
    let P;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) P = hK.createElement(V, {
        dimColor: !0
    }, hK.createElement(oA, null, hK.createElement(YA, {
        shortcut: "Enter",
        action: "select"
    }), hK.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))), q[13] = P;
    else P = q[13];
    let W;
    if (q[14] !== $ || q[15] !== D || q[16] !== M) W = hK.createElement(w8, {
        title: Nd1,
        subtitle: D,
        onCancel: $,
        hideInputGuide: !0
    }, j, M, P), q[14] = $, q[15] = D, q[16] = M, q[17] = W;
    else W = q[17];
    return W
}
// @from(Ln 431261, Col 0)
function Z3z(A) {
    return {
        label: hK.createElement(V, null, A.name, " ", hK.createElement(V, {
            dimColor: !0
        }, "(", A.environment_id, ")")),
        value: A.environment_id
    }
}
// @from(Ln 431269, Col 4)
hK
// @from(Ln 431269, Col 8)
Ue
// @from(Ln 431269, Col 12)
Nd1 = "Select Remote Environment"
// @from(Ln 431270, Col 4)
XBA = "Configure environments at: https://claude.ai/code"
// @from(Ln 431271, Col 4)
L$q = v(() => {
    i1();
    m1();
    K7();
    Bq();
    U5();
    b7();
    nbA();
    E$q();
    p8();
    y6();
    q3();
    E$();
    wK();
    BK();
    HK();
    hK = o(X1(), 1), Ue = o(X1(), 1)
})
// @from(Ln 431289, Col 4)
R$q = {}
// @from(Ln 431293, Col 0)
async function f3z(A) {
    return DBA.createElement(k$q, {
        onDone: A
    })
}
// @from(Ln 431298, Col 4)
DBA
// @from(Ln 431299, Col 4)
y$q = v(() => {
    L$q();
    DBA = o(X1(), 1)
})
// @from(Ln 431303, Col 4)
C$q
// @from(Ln 431304, Col 4)
S$q = v(() => {
    J7();
    mV();
    C$q = {
        type: "local-jsx",
        name: "remote-env",
        userFacingName() {
            return "remote-env"
        },
        description: "Configure the default remote environment for teleport sessions",
        isEnabled: () => i8() && p0("allow_remote_sessions"),
        get isHidden() {
            return !i8() || !p0("allow_remote_sessions")
        },
        load: () => Promise.resolve().then(() => (y$q(), R$q))
    }
})
// @from(Ln 431321, Col 4)
h$q = {}
// @from(Ln 431325, Col 0)
async function MBA(A, q) {
    try {
        if (i8()) {
            let Y = a4(),
                z = !1;
            if (Y?.subscriptionType && Y?.rateLimitTier) z = Y.subscriptionType === "max" && Y.rateLimitTier === "default_claude_max_20x";
            else if (Y?.accessToken) {
                let w = await DH1(Y.accessToken);
                z = w?.organization?.organization_type === "claude_max" && w?.organization?.rate_limit_tier === "default_claude_max_20x"
            }
            if (z) return setTimeout(() => {
                A("You are already on the highest Max subscription plan. For additional usage, run /login to switch to an API usage-billed account.")
            }, 0), null
        }
        return await zY("https://claude.ai/upgrade/max"), jBA.createElement(QP1, {
            startingMessage: "Starting new login following /upgrade. Exit with Ctrl-C to use existing account.",
            onDone: (Y) => {
                q.onChangeAPIKey(), A(Y ? "Login successful" : "Login interrupted")
            }
        })
    } catch (K) {
        K1(K), setTimeout(() => {
            A("Failed to open browser. Please visit https://claude.ai/upgrade/max to upgrade.")
        }, 0)
    }
    return null
}
// @from(Ln 431352, Col 4)
jBA
// @from(Ln 431353, Col 4)
PBA = v(() => {
    y6();
    J7();
    Oj();
    _M6();
    pv1();
    jBA = o(X1(), 1)
})
// @from(Ln 431361, Col 4)
V3z
// @from(Ln 431361, Col 9)
dN6
// @from(Ln 431362, Col 4)
WBA = v(() => {
    J7();
    V3z = {
        type: "local-jsx",
        name: "upgrade",
        description: "Upgrade to Max for higher rate limits and more Opus",
        isEnabled: () => !process.env.DISABLE_UPGRADE_COMMAND && !cC() && dK() !== "enterprise",
        isHidden: !1,
        load: () => Promise.resolve().then(() => (PBA(), h$q)),
        userFacingName() {
            return "upgrade"
        }
    }, dN6 = V3z
})
// @from(Ln 431376, Col 4)
x$q = {}
// @from(Ln 431381, Col 0)
function N3z(A) {
    let q = e(21),
        {
            onDone: K,
            context: Y
        } = A,
        [z, w] = I$q.useState(null),
        H = Eo(),
        $;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = dK(), q[0] = $;
    else $ = q[0];
    let O = $,
        _;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) _ = Sn(), q[1] = _;
    else _ = q[1];
    let J = _,
        X = u3()?.hasExtraUsageEnabled === !0,
        j = O === "max" && J === "default_claude_max_20x",
        M = O === "team" || O === "enterprise",
        P;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) P = {
        label: "Stop and wait for limit to reset",
        value: "cancel"
    }, q[2] = P;
    else P = q[2];
    let W;
    if (q[3] !== H.overageDisabledReason || q[4] !== H.overageStatus) {
        if (W = [P], os.isEnabled()) {
            let B = iu(),
                S = M && !B,
                m = H.overageDisabledReason === "out_of_credits" || H.overageDisabledReason === "org_level_disabled_until" || H.overageDisabledReason === "org_service_zero_credit_limit";
            if (S && m);
            else {
                let b = H.overageStatus === "rejected" || H.overageStatus === "allowed_warning",
                    g;
                if (S) g = b ? "Request more" : "Request extra usage";
                else g = X ? "Add funds to continue with extra usage" : "Switch to extra usage";
                let U;
                if (q[6] !== g) U = {
                    label: g,
                    value: "extra-usage"
                }, q[6] = g, q[7] = U;
                else U = q[7];
                W.push(U)
            }
        }
        if (!j && !M && dN6.isEnabled()) {
            let B;
            if (q[8] === Symbol.for("react.memo_cache_sentinel")) B = {
                label: "Upgrade your plan",
                value: "upgrade"
            }, q[8] = B;
            else B = q[8];
            W.push(B)
        }
        q[3] = H.overageDisabledReason, q[4] = H.overageStatus, q[5] = W
    } else W = q[5];
    let G = W,
        f;
    if (q[9] !== K) f = function() {
        c("tengu_rate_limit_options_menu_cancel", {}), K(void 0, {
            display: "skip"
        })
    }, q[9] = K, q[10] = f;
    else f = q[10];
    let Z = f,
        N;
    if (q[11] !== Y || q[12] !== Z || q[13] !== K) N = function(S) {
        if (S === "upgrade") c("tengu_rate_limit_options_menu_select_upgrade", {}), MBA(K, Y).then((m) => {
            if (m) w(m)
        });
        else if (S === "extra-usage") c("tengu_rate_limit_options_menu_select_extra_usage", {}), NvA(K, Y).then((m) => {
            if (m) w(m)
        });
        else if (S === "cancel") Z()
    }, q[11] = Y, q[12] = Z, q[13] = K, q[14] = N;
    else N = q[14];
    let T = N;
    if (z) return z;
    let k;
    if (q[15] !== T || q[16] !== G) k = cN6.default.createElement(kA, {
        options: G,
        onChange: T,
        visibleOptionCount: G.length
    }), q[15] = T, q[16] = G, q[17] = k;
    else k = q[17];
    let y;
    if (q[18] !== Z || q[19] !== k) y = cN6.default.createElement(w8, {
        title: "What do you want to do?",
        onCancel: Z,
        color: "suggestion",
        borderDimColor: !1
    }, k), q[18] = Z, q[19] = k, q[20] = y;
    else y = q[20];
    return y
}
// @from(Ln 431477, Col 0)
async function T3z(A, q) {
    return cN6.default.createElement(N3z, {
        onDone: A,
        context: q
    })
}
// @from(Ln 431483, Col 4)
cN6
// @from(Ln 431483, Col 9)
I$q
// @from(Ln 431484, Col 4)
b$q = v(() => {
    i1();
    U5();
    Bq();
    u6();
    J7();
    WBA();
    PBA();
    YQ1();
    TvA();
    cA();
    nu();
    cN6 = o(X1(), 1), I$q = o(X1(), 1)
})
// @from(Ln 431498, Col 4)
v3z
// @from(Ln 431498, Col 9)
u$q
// @from(Ln 431499, Col 4)
B$q = v(() => {
    J7();
    v3z = {
        type: "local-jsx",
        name: "rate-limit-options",
        userFacingName() {
            return "rate-limit-options"
        },
        description: "Show options when rate limit is reached",
        isEnabled: () => {
            if (!i8()) return !1;
            return !0
        },
        isHidden: !0,
        load: () => Promise.resolve().then(() => (b$q(), x$q))
    }, u$q = v3z
})
// @from(Ln 431516, Col 4)
E3z
// @from(Ln 431516, Col 9)
GBA
// @from(Ln 431517, Col 4)
m$q = v(() => {
    v3();
    E3z = {
        type: "prompt",
        description: "Set up Claude Code's status line UI",
        contentLength: 0,
        aliases: [],
        isEnabled: () => !0,
        isHidden: !1,
        name: "statusline",
        progressMessage: "setting up statusLine",
        allowedTools: ["Task", "Read(~/**)", "Edit(~/.claude/settings.json)"],
        source: "builtin",
        disableNonInteractive: !0,
        async getPromptForCommand(A) {
            return u8("statusline"), [{
                type: "text",
                text: `Create a Task with subagent_type "statusline-setup" and the prompt "${A.trim()||"Configure my statusLine from my shell PS1 configuration"}"`
            }]
        },
        userFacingName() {
            return "statusline"
        }
    }, GBA = E3z
})
// @from(Ln 431542, Col 4)
F$q = () => {}
// @from(Ln 431543, Col 4)
Q$q = R((lN6) => {
    (function(A) {
        A.black = "\x1B[30m", A.red = "\x1B[31m", A.green = "\x1B[32m", A.yellow = "\x1B[33m", A.blue = "\x1B[34m", A.magenta = "\x1B[35m", A.cyan = "\x1B[36m", A.lightgray = "\x1B[37m", A.default = "\x1B[39m", A.darkgray = "\x1B[90m", A.lightred = "\x1B[91m", A.lightgreen = "\x1B[92m", A.lightyellow = "\x1B[93m", A.lightblue = "\x1B[94m", A.lightmagenta = "\x1B[95m", A.lightcyan = "\x1B[96m", A.white = "\x1B[97m", A.reset = "\x1B[0m";

        function q(K, Y) {
            return Y === void 0 ? K : Y + K + A.reset
        }
        A.colored = q, A.plot = function(K, Y = void 0) {
            if (typeof K[0] == "number") K = [K];
            Y = typeof Y < "u" ? Y : {};
            let z = typeof Y.min < "u" ? Y.min : K[0][0],
                w = typeof Y.max < "u" ? Y.max : K[0][0];
            for (let N = 0; N < K.length; N++)
                for (let T = 0; T < K[N].length; T++) z = Math.min(z, K[N][T]), w = Math.max(w, K[N][T]);
            let H = ["┼", "┤", "╶", "╴", "─", "╰", "╭", "╮", "╯", "│"],
                $ = Math.abs(w - z),
                O = typeof Y.offset < "u" ? Y.offset : 3,
                _ = typeof Y.padding < "u" ? Y.padding : "           ",
                J = typeof Y.height < "u" ? Y.height : $,
                X = typeof Y.colors < "u" ? Y.colors : [],
                D = $ !== 0 ? J / $ : 1,
                j = Math.round(z * D),
                M = Math.round(w * D),
                P = Math.abs(M - j),
                W = 0;
            for (let N = 0; N < K.length; N++) W = Math.max(W, K[N].length);
            W = W + O;
            let G = typeof Y.symbols < "u" ? Y.symbols : H,
                f = typeof Y.format < "u" ? Y.format : function(N) {
                    return (_ + N.toFixed(2)).slice(-_.length)
                },
                Z = Array(P + 1);
            for (let N = 0; N <= P; N++) {
                Z[N] = Array(W);
                for (let T = 0; T < W; T++) Z[N][T] = " "
            }
            for (let N = j; N <= M; ++N) {
                let T = f(P > 0 ? w - (N - j) * $ / P : N, N - j);
                Z[N - j][Math.max(O - T.length, 0)] = T, Z[N - j][O - 1] = N == 0 ? G[0] : G[1]
            }
            for (let N = 0; N < K.length; N++) {
                let T = X[N % X.length],
                    k = Math.round(K[N][0] * D) - j;
                Z[P - k][O - 1] = q(G[0], T);
                for (let y = 0; y < K[N].length - 1; y++) {
                    let B = Math.round(K[N][y + 0] * D) - j,
                        S = Math.round(K[N][y + 1] * D) - j;
                    if (B == S) Z[P - B][y + O] = q(G[4], T);
                    else {
                        Z[P - S][y + O] = q(B > S ? G[5] : G[6], T), Z[P - B][y + O] = q(B > S ? G[7] : G[8], T);
                        let m = Math.min(B, S),
                            b = Math.max(B, S);
                        for (let g = m + 1; g < b; g++) Z[P - g][y + O] = q(G[9], T)
                    }
                }
            }
            return Z.map(function(N) {
                return N.join("")
            }).join(`
`)
        }
    })(typeof lN6 > "u" ? lN6.asciichart = {} : lN6)
})
// @from(Ln 431612, Col 0)
async function ZBA(A) {
    while (iN6) await iN6;
    let q;
    iN6 = new Promise((K) => {
        q = K
    });
    try {
        return await A()
    } finally {
        iN6 = null, q?.()
    }
}
// @from(Ln 431625, Col 0)
function g$q() {
    return L3z(O8(), y3z)
}
// @from(Ln 431629, Col 0)
function nN6() {
    return {
        version: rN6,
        lastComputedDate: null,
        dailyActivity: [],
        dailyModelTokens: [],
        modelUsage: {},
        totalSessions: 0,
        totalMessages: 0,
        longestSession: null,
        firstSessionDate: null,
        hourCounts: {},
        totalSpeculationTimeSavedMs: 0,
        shotDistribution: {}
    }
}
// @from(Ln 431646, Col 0)
function fBA() {
    let A = b1(),
        q = g$q();
    try {
        if (!A.existsSync(q)) return h("Stats cache does not exist, returning empty cache"), nN6();
        let K = A.readFileSync(q, {
                encoding: "utf-8"
            }),
            Y = _A(K);
        if (Y.version !== rN6) return h(`Stats cache version mismatch (got ${Y.version}, expected ${rN6}), returning empty cache`), nN6();
        if (!Array.isArray(Y.dailyActivity) || !Array.isArray(Y.dailyModelTokens) || typeof Y.totalSessions !== "number" || typeof Y.totalMessages !== "number") return h("Stats cache has invalid structure, returning empty cache"), nN6();
        return Y
    } catch (K) {
        return h(`Failed to load stats cache: ${K instanceof Error?K.message:String(K)}`), nN6()
    }
}
// @from(Ln 431663, Col 0)
function o91(A) {
    let q = b1(),
        K = g$q(),
        Y = `${K}.${R3z(8).toString("hex")}.tmp`;
    try {
        let z = O8();
        if (!q.existsSync(z)) q.mkdirSync(z);
        let w = Q1(A, null, 2);
        c8(Y, w, {
            encoding: "utf-8",
            mode: 384,
            flush: !0
        }), q.renameSync(Y, K), h(`Stats cache saved successfully (lastComputedDate: ${A.lastComputedDate})`)
    } catch (z) {
        K1(z);
        try {
            if (q.existsSync(Y)) q.unlinkSync(Y)
        } catch {}
    }
}
// @from(Ln 431684, Col 0)
function Td1(A, q, K) {
    let Y = new Map;
    for (let D of A.dailyActivity) Y.set(D.date, {
        ...D
    });
    for (let D of q.dailyActivity) {
        let j = Y.get(D.date);
        if (j) j.messageCount += D.messageCount, j.sessionCount += D.sessionCount, j.toolCallCount += D.toolCallCount;
        else Y.set(D.date, {
            ...D
        })
    }
    let z = new Map;
    for (let D of A.dailyModelTokens) z.set(D.date, {
        ...D.tokensByModel
    });
    for (let D of q.dailyModelTokens) {
        let j = z.get(D.date);
        if (j)
            for (let [M, P] of Object.entries(D.tokensByModel)) j[M] = (j[M] || 0) + P;
        else z.set(D.date, {
            ...D.tokensByModel
        })
    }
    let w = {
        ...A.modelUsage
    };
    for (let [D, j] of Object.entries(q.modelUsage))
        if (w[D]) w[D] = {
            inputTokens: w[D].inputTokens + j.inputTokens,
            outputTokens: w[D].outputTokens + j.outputTokens,
            cacheReadInputTokens: w[D].cacheReadInputTokens + j.cacheReadInputTokens,
            cacheCreationInputTokens: w[D].cacheCreationInputTokens + j.cacheCreationInputTokens,
            webSearchRequests: w[D].webSearchRequests + j.webSearchRequests,
            costUSD: w[D].costUSD + j.costUSD,
            contextWindow: Math.max(w[D].contextWindow, j.contextWindow),
            maxOutputTokens: Math.max(w[D].maxOutputTokens, j.maxOutputTokens)
        };
        else w[D] = {
            ...j
        };
    let H = {
        ...A.hourCounts
    };
    for (let [D, j] of Object.entries(q.hourCounts)) {
        let M = parseInt(D, 10);
        H[M] = (H[M] || 0) + j
    }
    let $ = A.totalSessions + q.sessionStats.length,
        O = A.totalMessages + q.sessionStats.reduce((D, j) => D + j.messageCount, 0),
        _ = A.longestSession;
    for (let D of q.sessionStats)
        if (!_ || D.duration > _.duration) _ = D;
    let J = A.firstSessionDate;
    for (let D of q.sessionStats)
        if (!J || D.timestamp < J) J = D.timestamp;
    return {
        version: rN6,
        lastComputedDate: K,
        dailyActivity: Array.from(Y.values()).sort((D, j) => D.date.localeCompare(j.date)),
        dailyModelTokens: Array.from(z.entries()).map(([D, j]) => ({
            date: D,
            tokensByModel: j
        })).sort((D, j) => D.date.localeCompare(j.date)),
        modelUsage: w,
        totalSessions: $,
        totalMessages: O,
        longestSession: _,
        firstSessionDate: J,
        hourCounts: H,
        totalSpeculationTimeSavedMs: A.totalSpeculationTimeSavedMs + q.totalSpeculationTimeSavedMs
    }
}
// @from(Ln 431758, Col 0)
function XF(A) {
    let K = A.toISOString().split("T")[0];
    if (!K) throw Error("Invalid ISO date string");
    return K
}
// @from(Ln 431764, Col 0)
function U$q() {
    return XF(new Date)
}
// @from(Ln 431768, Col 0)
function VBA() {
    let A = new Date;
    return A.setDate(A.getDate() - 1), XF(A)
}
// @from(Ln 431773, Col 0)
function lZ1(A, q) {
    return A < q
}
// @from(Ln 431776, Col 4)
rN6 = 2
// @from(Ln 431777, Col 4)
y3z = "stats-cache.json"
// @from(Ln 431778, Col 4)
iN6 = null
// @from(Ln 431779, Col 4)
NBA = v(() => {
    hA();
    _8();
    m6();
    Z6();
    y6();
    m6()
})
// @from(Ln 431791, Col 0)
async function iZ1(A, q = {}) {
    let {
        fromDate: K,
        toDate: Y
    } = q, z = b1(), w = new Map, H = new Map, $ = [], O = new Map, _ = 0, J = 0, X = {}, D = void 0, j = new Set, M = 20;
    for (let P = 0; P < A.length; P += M) {
        let W = A.slice(P, P + M),
            G = await Promise.all(W.map(async (f) => {
                try {
                    if (K) try {
                        let N = await z.stat(f),
                            T = XF(N.mtime);
                        if (lZ1(T, K)) return {
                            sessionFile: f,
                            entries: null,
                            error: null,
                            skipped: !0
                        }
                    } catch {}
                    let Z = await ZQ(f);
                    return {
                        sessionFile: f,
                        entries: Z,
                        error: null,
                        skipped: !1
                    }
                } catch (Z) {
                    return {
                        sessionFile: f,
                        entries: null,
                        error: Z,
                        skipped: !1
                    }
                }
            }));
        for (let {
                sessionFile: f,
                entries: Z,
                error: N,
                skipped: T
            }
            of G) {
            if (T) continue;
            if (N || !Z) {
                h(`Failed to read session file ${f}: ${N instanceof Error?N.message:String(N)}`);
                continue
            }
            let k = C3z(f, ".jsonl"),
                y = [];
            for (let r of Z)
                if (vI(r)) y.push(r);
                else if (r.type === "speculation-accept") J += r.timeSavedMs;
            if (y.length === 0) continue;
            let B = y.filter((r) => !r.isSidechain);
            if (B.length === 0) continue;
            let S = B[0],
                m = B[B.length - 1],
                b = new Date(S.timestamp),
                g = new Date(m.timestamp),
                U = XF(b);
            if (K && lZ1(U, K)) continue;
            if (Y && lZ1(Y, U)) continue;
            let x = g.getTime() - b.getTime();
            $.push({
                sessionId: k,
                duration: x,
                messageCount: B.length,
                timestamp: S.timestamp
            }), _ += B.length;
            let p = w.get(U) || {
                date: U,
                messageCount: 0,
                sessionCount: 0,
                toolCallCount: 0
            };
            p.sessionCount++, p.messageCount += B.length, w.set(U, p);
            let l = b.getHours();
            O.set(l, (O.get(l) || 0) + 1);
            for (let r of B)
                if (r.type === "assistant") {
                    let s = r.message?.content;
                    if (Array.isArray(s)) {
                        for (let O1 of s)
                            if (O1.type === "tool_use") {
                                let T1 = w.get(U);
                                T1.toolCallCount++
                            }
                    }
                    if (r.message?.usage) {
                        let O1 = r.message.usage,
                            T1 = r.message.model || "unknown";
                        if (T1 === eD1) continue;
                        if (!X[T1]) X[T1] = {
                            inputTokens: 0,
                            outputTokens: 0,
                            cacheReadInputTokens: 0,
                            cacheCreationInputTokens: 0,
                            webSearchRequests: 0,
                            costUSD: 0,
                            contextWindow: 0,
                            maxOutputTokens: 0
                        };
                        X[T1].inputTokens += O1.input_tokens || 0, X[T1].outputTokens += O1.output_tokens || 0, X[T1].cacheReadInputTokens += O1.cache_read_input_tokens || 0, X[T1].cacheCreationInputTokens += O1.cache_creation_input_tokens || 0;
                        let N1 = (O1.input_tokens || 0) + (O1.output_tokens || 0);
                        if (N1 > 0) {
                            let j1 = H.get(U) || {};
                            j1[T1] = (j1[T1] || 0) + N1, H.set(U, j1)
                        }
                    }
                }
        }
    }
    return {
        dailyActivity: Array.from(w.values()).sort((P, W) => P.date.localeCompare(W.date)),
        dailyModelTokens: Array.from(H.entries()).map(([P, W]) => ({
            date: P,
            tokensByModel: W
        })).sort((P, W) => P.date.localeCompare(W.date)),
        modelUsage: X,
        sessionStats: $,
        hourCounts: Object.fromEntries(O),
        totalMessages: _,
        totalSpeculationTimeSavedMs: J,
        ...{}
    }
}
// @from(Ln 431917, Col 0)
async function TBA() {
    let A = oI(),
        q = b1();
    try {
        await q.stat(A)
    } catch {
        return []
    }
    let Y = (await q.readdir(A)).filter((w) => w.isDirectory()).map((w) => oN6(A, w.name));
    return (await Promise.all(Y.map(async (w) => {
        try {
            let H = await q.readdir(w),
                $ = H.filter((J) => J.isFile() && J.name.endsWith(".jsonl")).map((J) => oN6(w, J.name)),
                O = H.filter((J) => J.isDirectory()),
                _ = await Promise.all(O.map(async (J) => {
                    let X = oN6(w, J.name, "subagents");
                    try {
                        return (await q.readdir(X)).filter((j) => j.isFile() && j.name.endsWith(".jsonl") && j.name.startsWith("agent-")).map((j) => oN6(X, j.name))
                    } catch {
                        return []
                    }
                }));
            return [...$, ..._.flat()]
        } catch (H) {
            return h(`Failed to read project directory ${w}: ${H instanceof Error?H.message:String(H)}`), []
        }
    }))).flat()
}
// @from(Ln 431946, Col 0)
function S3z(A, q) {
    let K = new Map;
    for (let Z of A.dailyActivity) K.set(Z.date, {
        ...Z
    });
    if (q)
        for (let Z of q.dailyActivity) {
            let N = K.get(Z.date);
            if (N) N.messageCount += Z.messageCount, N.sessionCount += Z.sessionCount, N.toolCallCount += Z.toolCallCount;
            else K.set(Z.date, {
                ...Z
            })
        }
    let Y = new Map;
    for (let Z of A.dailyModelTokens) Y.set(Z.date, {
        ...Z.tokensByModel
    });
    if (q)
        for (let Z of q.dailyModelTokens) {
            let N = Y.get(Z.date);
            if (N)
                for (let [T, k] of Object.entries(Z.tokensByModel)) N[T] = (N[T] || 0) + k;
            else Y.set(Z.date, {
                ...Z.tokensByModel
            })
        }
    let z = {
        ...A.modelUsage
    };
    if (q)
        for (let [Z, N] of Object.entries(q.modelUsage))
            if (z[Z]) z[Z] = {
                inputTokens: z[Z].inputTokens + N.inputTokens,
                outputTokens: z[Z].outputTokens + N.outputTokens,
                cacheReadInputTokens: z[Z].cacheReadInputTokens + N.cacheReadInputTokens,
                cacheCreationInputTokens: z[Z].cacheCreationInputTokens + N.cacheCreationInputTokens,
                webSearchRequests: z[Z].webSearchRequests + N.webSearchRequests,
                costUSD: z[Z].costUSD + N.costUSD,
                contextWindow: Math.max(z[Z].contextWindow, N.contextWindow),
                maxOutputTokens: Math.max(z[Z].maxOutputTokens, N.maxOutputTokens)
            };
            else z[Z] = {
                ...N
            };
    let w = new Map;
    for (let [Z, N] of Object.entries(A.hourCounts)) w.set(parseInt(Z, 10), N);
    if (q)
        for (let [Z, N] of Object.entries(q.hourCounts)) {
            let T = parseInt(Z, 10);
            w.set(T, (w.get(T) || 0) + N)
        }
    let H = Array.from(K.values()).sort((Z, N) => Z.date.localeCompare(N.date)),
        $ = c$q(H),
        O = Array.from(Y.entries()).map(([Z, N]) => ({
            date: Z,
            tokensByModel: N
        })).sort((Z, N) => Z.date.localeCompare(N.date)),
        _ = A.totalSessions + (q?.sessionStats.length || 0),
        J = A.totalMessages + (q?.totalMessages || 0),
        X = A.longestSession;
    if (q) {
        for (let Z of q.sessionStats)
            if (!X || Z.duration > X.duration) X = Z
    }
    let D = A.firstSessionDate,
        j = null;
    if (q)
        for (let Z of q.sessionStats) {
            if (!D || Z.timestamp < D) D = Z.timestamp;
            if (!j || Z.timestamp > j) j = Z.timestamp
        }
    if (!j && H.length > 0) j = H[H.length - 1].date;
    let M = H.length > 0 ? H.reduce((Z, N) => N.messageCount > Z.messageCount ? N : Z).date : null,
        P = w.size > 0 ? Array.from(w.entries()).reduce((Z, [N, T]) => T > Z[1] ? [N, T] : Z)[0] : null,
        W = D && j ? Math.ceil((new Date(j).getTime() - new Date(D).getTime()) / 86400000) + 1 : 0,
        G = A.totalSpeculationTimeSavedMs + (q?.totalSpeculationTimeSavedMs || 0);
    return {
        totalSessions: _,
        totalMessages: J,
        totalDays: W,
        activeDays: K.size,
        streaks: $,
        dailyActivity: H,
        dailyModelTokens: O,
        longestSession: X,
        modelUsage: z,
        firstSessionDate: D,
        lastSessionDate: j,
        peakActivityDay: M,
        peakActivityHour: P,
        totalSpeculationTimeSavedMs: G
    }
}
// @from(Ln 432039, Col 0)
async function h3z() {
    let A = await TBA();
    if (A.length === 0) return l$q();
    let q = await ZBA(async () => {
            let z = fBA(),
                w = VBA(),
                H = z;
            if (!z.lastComputedDate) {
                h("Stats cache empty, processing all historical data");
                let $ = await iZ1(A, {
                    toDate: w
                });
                if ($.sessionStats.length > 0) H = Td1(z, $, w), o91(H)
            } else if (lZ1(z.lastComputedDate, w)) {
                let $ = d$q(z.lastComputedDate);
                h(`Stats cache stale (${z.lastComputedDate}), processing ${$} to ${w}`);
                let O = await iZ1(A, {
                    fromDate: $,
                    toDate: w
                });
                if (O.sessionStats.length > 0 || O.dailyActivity.length > 0) H = Td1(z, O, w), o91(H);
                else H = {
                    ...z,
                    lastComputedDate: w
                }, o91(H)
            }
            return H
        }),
        K = U$q(),
        Y = await iZ1(A, {
            fromDate: K,
            toDate: K
        });
    return S3z(q, Y)
}
// @from(Ln 432074, Col 0)
async function vBA(A) {
    if (A === "all") return h3z();
    let q = await TBA();
    if (q.length === 0) return l$q();
    let K = new Date,
        Y = A === "7d" ? 7 : 30,
        z = new Date(K);
    z.setDate(K.getDate() - Y + 1);
    let w = XF(z),
        H = await iZ1(q, {
            fromDate: w
        });
    return I3z(H)
}
// @from(Ln 432089, Col 0)
function I3z(A) {
    let q = [...A.dailyActivity].sort((D, j) => D.date.localeCompare(j.date)),
        K = [...A.dailyModelTokens].sort((D, j) => D.date.localeCompare(j.date)),
        Y = c$q(q),
        z = null;
    for (let D of A.sessionStats)
        if (!z || D.duration > z.duration) z = D;
    let w = null,
        H = null;
    for (let D of A.sessionStats) {
        if (!w || D.timestamp < w) w = D.timestamp;
        if (!H || D.timestamp > H) H = D.timestamp
    }
    let $ = q.length > 0 ? q.reduce((D, j) => j.messageCount > D.messageCount ? j : D).date : null,
        O = Object.entries(A.hourCounts),
        _ = O.length > 0 ? parseInt(O.reduce((D, [j, M]) => M > parseInt(D[1].toString()) ? [j, M] : D)[0], 10) : null,
        J = w && H ? Math.ceil((new Date(H).getTime() - new Date(w).getTime()) / 86400000) + 1 : 0;
    return {
        totalSessions: A.sessionStats.length,
        totalMessages: A.totalMessages,
        totalDays: J,
        activeDays: A.dailyActivity.length,
        streaks: Y,
        dailyActivity: q,
        dailyModelTokens: K,
        longestSession: z,
        modelUsage: A.modelUsage,
        firstSessionDate: w,
        lastSessionDate: H,
        peakActivityDay: $,
        peakActivityHour: _,
        totalSpeculationTimeSavedMs: A.totalSpeculationTimeSavedMs
    }
}
// @from(Ln 432123, Col 0)
async function p$q() {
    let A = await TBA();
    if (A.length === 0) return;
    await ZBA(async () => {
        let q = fBA(),
            K = VBA();
        if (q.lastComputedDate === K) {
            h("Stats cache is up to date");
            return
        }
        if (!q.lastComputedDate) {
            h("Stats cache empty, processing all historical data in background");
            let Y = await iZ1(A, {
                toDate: K
            });
            if (Y.sessionStats.length > 0) {
                let z = Td1(q, Y, K);
                o91(z), h(`Stats cache updated with ${Y.sessionStats.length} sessions`)
            }
        } else if (lZ1(q.lastComputedDate, K)) {
            let Y = d$q(q.lastComputedDate);
            h(`Stats cache stale (${q.lastComputedDate}), processing ${Y} to ${K} in background`);
            let z = await iZ1(A, {
                fromDate: Y,
                toDate: K
            });
            if (z.sessionStats.length > 0 || z.dailyActivity.length > 0) {
                let w = Td1(q, z, K);
                o91(w), h(`Stats cache updated with ${z.sessionStats.length} new sessions`)
            } else {
                let w = {
                    ...q,
                    lastComputedDate: K
                };
                o91(w), h("Stats cache lastComputedDate updated (no new data)")
            }
        }
    })
}
// @from(Ln 432163, Col 0)
function d$q(A) {
    let q = new Date(A);
    return q.setDate(q.getDate() + 1), XF(q)
}
// @from(Ln 432168, Col 0)
function c$q(A) {
    if (A.length === 0) return {
        currentStreak: 0,
        longestStreak: 0,
        currentStreakStart: null,
        longestStreakStart: null,
        longestStreakEnd: null
    };
    let q = new Date;
    q.setHours(0, 0, 0, 0);
    let K = 0,
        Y = null,
        z = new Date(q),
        w = new Set(A.map((_) => _.date));
    while (!0) {
        let _ = XF(z);
        if (!w.has(_)) break;
        K++, Y = _, z.setDate(z.getDate() - 1)
    }
    let H = 0,
        $ = null,
        O = null;
    if (A.length > 0) {
        let _ = Array.from(w).sort(),
            J = 1,
            X = _[0];
        for (let D = 1; D < _.length; D++) {
            let j = new Date(_[D - 1]),
                M = new Date(_[D]);
            if (Math.round((M.getTime() - j.getTime()) / 86400000) === 1) J++;
            else {
                if (J > H) H = J, $ = X, O = _[D - 1];
                J = 1, X = _[D]
            }
        }
        if (J > H) H = J, $ = X, O = _[_.length - 1]
    }
    return {
        currentStreak: K,
        longestStreak: H,
        currentStreakStart: Y,
        longestStreakStart: $,
        longestStreakEnd: O
    }
}
// @from(Ln 432214, Col 0)
function l$q() {
    return {
        totalSessions: 0,
        totalMessages: 0,
        totalDays: 0,
        activeDays: 0,
        streaks: {
            currentStreak: 0,
            longestStreak: 0,
            currentStreakStart: null,
            longestStreakStart: null,
            longestStreakEnd: null
        },
        dailyActivity: [],
        dailyModelTokens: [],
        longestSession: null,
        modelUsage: {},
        firstSessionDate: null,
        lastSessionDate: null,
        peakActivityDay: null,
        peakActivityHour: null,
        totalSpeculationTimeSavedMs: 0
    }
}
// @from(Ln 432238, Col 4)
EBA = v(() => {
    lq();
    _8();
    AH();
    Z6();
    NBA();
    N8()
})
// @from(Ln 432247, Col 0)
function x3z(A) {
    let q = A.map((K) => K.messageCount).filter((K) => K > 0).sort((K, Y) => K - Y);
    if (q.length === 0) return null;
    return {
        p25: q[Math.floor(q.length * 0.25)],
        p50: q[Math.floor(q.length * 0.5)],
        p75: q[Math.floor(q.length * 0.75)]
    }
}
// @from(Ln 432257, Col 0)
function kBA(A, q = {}) {
    let {
        terminalWidth: K = 80,
        showMonthLabels: Y = !0
    } = q, z = 4, w = K - 4, H = Math.min(52, Math.max(10, w)), $ = new Map;
    for (let f of A) $.set(f.date, f);
    let O = x3z(A),
        _ = new Date;
    _.setHours(0, 0, 0, 0);
    let J = new Date(_);
    J.setDate(_.getDate() - _.getDay());
    let X = new Date(J);
    X.setDate(X.getDate() - (H - 1) * 7);
    let D = Array.from({
            length: 7
        }, () => Array(H).fill("")),
        j = [],
        M = -1,
        P = new Date(X);
    for (let f = 0; f < H; f++)
        for (let Z = 0; Z < 7; Z++) {
            if (P > _) {
                D[Z][f] = " ", P.setDate(P.getDate() + 1);
                continue
            }
            let N = XF(P),
                T = $.get(N);
            if (Z === 0) {
                let y = P.getMonth();
                if (y !== M) j.push({
                    month: y,
                    week: f
                }), M = y
            }
            let k = b3z(T?.messageCount || 0, O);
            D[Z][f] = u3z(k), P.setDate(P.getDate() + 1)
        }
    let W = [];
    if (Y) {
        let f = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            Z = j.map((k) => k.month),
            N = Math.floor(H / Math.max(Z.length, 1)),
            T = Z.map((k) => f[k].padEnd(N)).join("");
        W.push("    " + T)
    }
    let G = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let f = 0; f < 7; f++) {
        let N = ([1, 3, 5].includes(f) ? G[f].padEnd(3) : "   ") + " " + D[f].join("");
        W.push(N)
    }
    return W.push(""), W.push("    Less " + [pe("░"), pe("▒"), pe("▓"), pe("█")].join(" ") + " More"), W.join(`
`)
}
// @from(Ln 432311, Col 0)
function b3z(A, q) {
    if (A === 0 || !q) return 0;
    if (A >= q.p75) return 4;
    if (A >= q.p50) return 3;
    if (A >= q.p25) return 2;
    return 1
}
// @from(Ln 432319, Col 0)
function u3z(A) {
    switch (A) {
        case 0:
            return H6.gray("·");
        case 1:
            return pe("░");
        case 2:
            return pe("▒");
        case 3:
            return pe("▓");
        case 4:
            return pe("█");
        default:
            return H6.gray("·")
    }
}
// @from(Ln 432335, Col 4)
pe
// @from(Ln 432336, Col 4)
i$q = v(() => {
    NBA();
    q3();
    pe = H6.hex("#da7756")
})
// @from(Ln 432342, Col 0)
function bN(A) {
    if (kd1 === Lc.length) Lc.push(Lc.length + 1);
    let q = kd1;
    return kd1 = Lc[q], Lc[q] = A, q
}
// @from(Ln 432348, Col 0)
function $f(A) {
    return Lc[A]
}
// @from(Ln 432352, Col 0)
function B3z(A) {
    if (A < 132) return;
    Lc[A] = kd1, kd1 = A
}
// @from(Ln 432357, Col 0)
function Rc(A) {
    let q = $f(A);
    return B3z(A), q
}
// @from(Ln 432362, Col 0)
function sN6() {
    if (vd1 === null || vd1.byteLength === 0) vd1 = new Uint8Array(KK.memory.buffer);
    return vd1
}
// @from(Ln 432367, Col 0)
function RBA(A, q, K) {
    if (K === void 0) {
        let $ = tN6.encode(A),
            O = q($.length, 1) >>> 0;
        return sN6().subarray(O, O + $.length).set($), Ld1 = $.length, O
    }
    let Y = A.length,
        z = q(Y, 1) >>> 0,
        w = sN6(),
        H = 0;
    for (; H < Y; H++) {
        let $ = A.charCodeAt(H);
        if ($ > 127) break;
        w[z + H] = $
    }
    if (H !== Y) {
        if (H !== 0) A = A.slice(H);
        z = K(z, Y, Y = H + A.length * 3, 1) >>> 0;
        let $ = sN6().subarray(z + H, z + Y),
            O = m3z(A, $);
        H += O.written, z = K(z, Y, H, 1) >>> 0
    }
    return Ld1 = H, z
}
// @from(Ln 432392, Col 0)
function yBA(A) {
    return A === void 0 || A === null
}
// @from(Ln 432396, Col 0)
function hj() {
    if (Ed1 === null || Ed1.byteLength === 0) Ed1 = new Int32Array(KK.memory.buffer);
    return Ed1
}
// @from(Ln 432401, Col 0)
function eN6(A, q) {
    return A = A >>> 0, o$q.decode(sN6().subarray(A, A + q))
}
// @from(Ln 432405, Col 0)
function F3z(A, q) {
    if (!(A instanceof q)) throw Error(`expected instance of ${q.name}`);
    return A.ptr
}
// @from(Ln 432410, Col 0)
function Q3z(A, q) {
    try {
        return A.apply(this, q)
    } catch (K) {
        KK.__wbindgen_exn_store(bN(K))
    }
}
// @from(Ln 432417, Col 0)
async function d3z(A, q) {
    if (typeof Response === "function" && A instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === "function") try {
            return await WebAssembly.instantiateStreaming(A, q)
        } catch (Y) {
            if (A.headers.get("Content-Type") != "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", Y);
            else throw Y
        }
        let K = await A.arrayBuffer();
        return await WebAssembly.instantiate(K, q)
    } else {
        let K = await WebAssembly.instantiate(A, q);
        if (K instanceof WebAssembly.Instance) return {
            instance: K,
            module: A
        };
        else return K
    }
}
// @from(Ln 432437, Col 0)
function c3z() {
    let A = {};
    return A.wbg = {}, A.wbg.__wbg_new_28c511d9baebfa89 = function(q, K) {
        let Y = Error(eN6(q, K));
        return bN(Y)
    }, A.wbg.__wbindgen_memory = function() {
        let q = KK.memory;
        return bN(q)
    }, A.wbg.__wbg_buffer_12d079cc21e14bdb = function(q) {
        let K = $f(q).buffer;
        return bN(K)
    }, A.wbg.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb = function(q, K, Y) {
        let z = new Uint8Array($f(q), K >>> 0, Y >>> 0);
        return bN(z)
    }, A.wbg.__wbindgen_object_drop_ref = function(q) {
        Rc(q)
    }, A.wbg.__wbg_new_63b92bc8671ed464 = function(q) {
        let K = new Uint8Array($f(q));
        return bN(K)
    }, A.wbg.__wbg_values_839f3396d5aac002 = function(q) {
        let K = $f(q).values();
        return bN(K)
    }, A.wbg.__wbg_next_196c84450b364254 = function() {
        return Q3z(function(q) {
            let K = $f(q).next();
            return bN(K)
        }, arguments)
    }, A.wbg.__wbg_done_298b57d23c0fc80c = function(q) {
        return $f(q).done
    }, A.wbg.__wbg_value_d93c65011f51a456 = function(q) {
        let K = $f(q).value;
        return bN(K)
    }, A.wbg.__wbg_instanceof_Uint8Array_2b3bbecd033d19f6 = function(q) {
        let K;
        try {
            K = $f(q) instanceof Uint8Array
        } catch (z) {
            K = !1
        }
        return K
    }, A.wbg.__wbindgen_string_get = function(q, K) {
        let Y = $f(K),
            z = typeof Y === "string" ? Y : void 0;
        var w = yBA(z) ? 0 : RBA(z, KK.__wbindgen_malloc, KK.__wbindgen_realloc),
            H = Ld1;
        hj()[q / 4 + 1] = H, hj()[q / 4 + 0] = w
    }, A.wbg.__wbg_new_16b304a2cfa7ff4a = function() {
        return bN([])
    }, A.wbg.__wbindgen_string_new = function(q, K) {
        let Y = eN6(q, K);
        return bN(Y)
    }, A.wbg.__wbg_push_a5b05aedc7234f9f = function(q, K) {
        return $f(q).push($f(K))
    }, A.wbg.__wbg_length_c20a40f15020d68a = function(q) {
        return $f(q).length
    }, A.wbg.__wbg_set_a47bac70306a19a7 = function(q, K, Y) {
        $f(q).set($f(K), Y >>> 0)
    }, A.wbg.__wbindgen_throw = function(q, K) {
        throw Error(eN6(q, K))
    }, A
}
// @from(Ln 432499, Col 0)
function l3z(A, q) {}
// @from(Ln 432501, Col 0)
function i3z(A, q) {
    return KK = A.exports, a$q.__wbindgen_wasm_module = q, Ed1 = null, vd1 = null, KK
}
// @from(Ln 432504, Col 0)
async function a$q(A) {
    if (KK !== void 0) return KK;
    if (typeof A > "u") A = new URL("index_bg.wasm", void 0);
    let q = c3z();
    if (typeof A === "string" || typeof Request === "function" && A instanceof Request || typeof URL === "function" && A instanceof URL) A = fetch(A);
    l3z(q);
    let {
        instance: K,
        module: Y
    } = await d3z(await A, q);
    return i3z(K, Y)
}
// @from(Ln 432517, Col 0)
function r3z(A) {
    return Object.prototype.hasOwnProperty.call(A, "fontBuffers")
}
// @from(Ln 432520, Col 4)
KK
// @from(Ln 432520, Col 8)
Lc
// @from(Ln 432520, Col 12)
kd1
// @from(Ln 432520, Col 17)
Ld1 = 0
// @from(Ln 432521, Col 4)
vd1 = null
// @from(Ln 432522, Col 4)
tN6
// @from(Ln 432522, Col 9)
m3z
// @from(Ln 432522, Col 14)
Ed1 = null
// @from(Ln 432523, Col 4)
o$q
// @from(Ln 432523, Col 9)
n$q
// @from(Ln 432523, Col 14)
LBA = class A {
        static __wrap(q) {
            q = q >>> 0;
            let K = Object.create(A.prototype);
            return K.__wbg_ptr = q, n$q.register(K, K.__wbg_ptr, K), K
        }
        __destroy_into_raw() {
            let q = this.__wbg_ptr;
            return this.__wbg_ptr = 0, n$q.unregister(this), q
        }
        free() {
            let q = this.__destroy_into_raw();
            KK.__wbg_bbox_free(q)
        }
        get x() {
            return KK.__wbg_get_bbox_x(this.__wbg_ptr)
        }
        set x(q) {
            KK.__wbg_set_bbox_x(this.__wbg_ptr, q)
        }
        get y() {
            return KK.__wbg_get_bbox_y(this.__wbg_ptr)
        }
        set y(q) {
            KK.__wbg_set_bbox_y(this.__wbg_ptr, q)
        }
        get width() {
            return KK.__wbg_get_bbox_width(this.__wbg_ptr)
        }
        set width(q) {
            KK.__wbg_set_bbox_width(this.__wbg_ptr, q)
        }
        get height() {
            return KK.__wbg_get_bbox_height(this.__wbg_ptr)
        }
        set height(q) {
            KK.__wbg_set_bbox_height(this.__wbg_ptr, q)
        }
    }
// @from(Ln 432562, Col 4)
r$q
// @from(Ln 432562, Col 9)
g3z = class A {
        static __wrap(q) {
            q = q >>> 0;
            let K = Object.create(A.prototype);
            return K.__wbg_ptr = q, r$q.register(K, K.__wbg_ptr, K), K
        }
        __destroy_into_raw() {
            let q = this.__wbg_ptr;
            return this.__wbg_ptr = 0, r$q.unregister(this), q
        }
        free() {
            let q = this.__destroy_into_raw();
            KK.__wbg_renderedimage_free(q)
        }
        get width() {
            return KK.renderedimage_width(this.__wbg_ptr) >>> 0
        }
        get height() {
            return KK.renderedimage_height(this.__wbg_ptr) >>> 0
        }
        asPng() {
            try {
                let z = KK.__wbindgen_add_to_stack_pointer(-16);
                KK.renderedimage_asPng(z, this.__wbg_ptr);
                var q = hj()[z / 4 + 0],
                    K = hj()[z / 4 + 1],
                    Y = hj()[z / 4 + 2];
                if (Y) throw Rc(K);
                return Rc(q)
            } finally {
                KK.__wbindgen_add_to_stack_pointer(16)
            }
        }
        get pixels() {
            let q = KK.renderedimage_pixels(this.__wbg_ptr);
            return Rc(q)
        }
    }
// @from(Ln 432600, Col 4)
U3z
// @from(Ln 432600, Col 9)
p3z = class {
        __destroy_into_raw() {
            let A = this.__wbg_ptr;
            return this.__wbg_ptr = 0, U3z.unregister(this), A
        }
        free() {
            let A = this.__destroy_into_raw();
            KK.__wbg_resvg_free(A)
        }
        constructor(A, q, K) {
            try {
                let O = KK.__wbindgen_add_to_stack_pointer(-16);
                var Y = yBA(q) ? 0 : RBA(q, KK.__wbindgen_malloc, KK.__wbindgen_realloc),
                    z = Ld1;
                KK.resvg_new(O, bN(A), Y, z, yBA(K) ? 0 : bN(K));
                var w = hj()[O / 4 + 0],
                    H = hj()[O / 4 + 1],
                    $ = hj()[O / 4 + 2];
                if ($) throw Rc(H);
                return this.__wbg_ptr = w >>> 0, this
            } finally {
                KK.__wbindgen_add_to_stack_pointer(16)
            }
        }
        get width() {
            return KK.resvg_width(this.__wbg_ptr)
        }
        get height() {
            return KK.resvg_height(this.__wbg_ptr)
        }
        render() {
            try {
                let Y = KK.__wbindgen_add_to_stack_pointer(-16);
                KK.resvg_render(Y, this.__wbg_ptr);
                var A = hj()[Y / 4 + 0],
                    q = hj()[Y / 4 + 1],
                    K = hj()[Y / 4 + 2];
                if (K) throw Rc(q);
                return g3z.__wrap(A)
            } finally {
                KK.__wbindgen_add_to_stack_pointer(16)
            }
        }
        toString() {
            let A, q;
            try {
                let z = KK.__wbindgen_add_to_stack_pointer(-16);
                KK.resvg_toString(z, this.__wbg_ptr);
                var K = hj()[z / 4 + 0],
                    Y = hj()[z / 4 + 1];
                return A = K, q = Y, eN6(K, Y)
            } finally {
                KK.__wbindgen_add_to_stack_pointer(16), KK.__wbindgen_free(A, q, 1)
            }
        }
        innerBBox() {
            let A = KK.resvg_innerBBox(this.__wbg_ptr);
            return A === 0 ? void 0 : LBA.__wrap(A)
        }
        getBBox() {
            let A = KK.resvg_getBBox(this.__wbg_ptr);
            return A === 0 ? void 0 : LBA.__wrap(A)
        }
        cropByBBox(A) {
            F3z(A, LBA), KK.resvg_cropByBBox(this.__wbg_ptr, A.__wbg_ptr)
        }
        imagesToResolve() {
            try {
                let Y = KK.__wbindgen_add_to_stack_pointer(-16);
                KK.resvg_imagesToResolve(Y, this.__wbg_ptr);
                var A = hj()[Y / 4 + 0],
                    q = hj()[Y / 4 + 1],
                    K = hj()[Y / 4 + 2];
                if (K) throw Rc(q);
                return Rc(A)
            } finally {
                KK.__wbindgen_add_to_stack_pointer(16)
            }
        }
        resolveImage(A, q) {
            try {
                let z = KK.__wbindgen_add_to_stack_pointer(-16),
                    w = RBA(A, KK.__wbindgen_malloc, KK.__wbindgen_realloc),
                    H = Ld1;
                KK.resvg_resolveImage(z, this.__wbg_ptr, w, H, bN(q));
                var K = hj()[z / 4 + 0],
                    Y = hj()[z / 4 + 1];
                if (Y) throw Rc(K)
            } finally {
                KK.__wbindgen_add_to_stack_pointer(16)
            }
        }
    }
// @from(Ln 432693, Col 4)
n3z
// @from(Ln 432693, Col 9)
CBA = !1
// @from(Ln 432694, Col 4)
SBA = async (A) => {
        if (CBA) throw Error("Already initialized. The `initWasm()` function can be used only once.");
        await n3z(await A), CBA = !0
    }
// @from(Ln 432697, Col 7)
s$q
// @from(Ln 432698, Col 4)
t$q = v(() => {
    Lc = Array(128).fill(void 0);
    Lc.push(void 0, null, !0, !1);
    kd1 = Lc.length;
    tN6 = typeof TextEncoder < "u" ? new TextEncoder("utf-8") : {
        encode: () => {
            throw Error("TextEncoder not available")
        }
    }, m3z = typeof tN6.encodeInto === "function" ? function(A, q) {
        return tN6.encodeInto(A, q)
    } : function(A, q) {
        let K = tN6.encode(A);
        return q.set(K), {
            read: A.length,
            written: K.length
        }
    };
    o$q = typeof TextDecoder < "u" ? new TextDecoder("utf-8", {
        ignoreBOM: !0,
        fatal: !0
    }) : {
        decode: () => {
            throw Error("TextDecoder not available")
        }
    };
    if (typeof TextDecoder < "u") o$q.decode();
    n$q = typeof FinalizationRegistry > "u" ? {
        register: () => {},
        unregister: () => {}
    } : new FinalizationRegistry((A) => KK.__wbg_bbox_free(A >>> 0)), r$q = typeof FinalizationRegistry > "u" ? {
        register: () => {},
        unregister: () => {}
    } : new FinalizationRegistry((A) => KK.__wbg_renderedimage_free(A >>> 0)), U3z = typeof FinalizationRegistry > "u" ? {
        register: () => {},
        unregister: () => {}
    } : new FinalizationRegistry((A) => KK.__wbg_resvg_free(A >>> 0));
    n3z = a$q, s$q = class extends p3z {
        constructor(A, q) {
            if (!CBA) throw Error("Wasm has not been initialized. Call `initWasm()` function.");
            let K = q?.font;
            if (!!K && r3z(K)) {
                let Y = {
                    ...q,
                    font: {
                        ...K,
                        fontBuffers: void 0
                    }
                };
                super(A, JSON.stringify(Y), K.fontBuffers)
            } else super(A, JSON.stringify(q))
        }
    }
})
// @from(Ln 432752, Col 0)
function o3z(A) {
    let q = [],
        K = A.split(`
`);
    for (let Y of K) {
        let z = [],
            w = a91,
            H = !1,
            $ = 0;
        while ($ < Y.length) {
            if (Y[$] === "\x1B" && Y[$ + 1] === "[") {
                let J = $ + 2;
                while (J < Y.length && !/[A-Za-z]/.test(Y[J])) J++;
                if (Y[J] === "m") {
                    let X = Y.slice($ + 2, J).split(";").map(Number),
                        D = 0;
                    while (D < X.length) {
                        let j = X[D];
                        if (j === 0) w = a91, H = !1;
                        else if (j === 1) H = !0;
                        else if (j >= 30 && j <= 37) w = e$q[j] || a91;
                        else if (j >= 90 && j <= 97) w = e$q[j] || a91;
                        else if (j === 39) w = a91;
                        else if (j === 38) {
                            if (X[D + 1] === 5 && X[D + 2] !== void 0) {
                                let M = X[D + 2];
                                w = a3z(M), D += 2
                            } else if (X[D + 1] === 2 && X[D + 2] !== void 0 && X[D + 3] !== void 0 && X[D + 4] !== void 0) w = {
                                r: X[D + 2],
                                g: X[D + 3],
                                b: X[D + 4]
                            }, D += 4
                        }
                        D++
                    }
                }
                $ = J + 1;
                continue
            }
            let O = $;
            while ($ < Y.length && Y[$] !== "\x1B") $++;
            let _ = Y.slice(O, $);
            if (_) z.push({
                text: _,
                color: w,
                bold: H
            })
        }
        if (z.length === 0) z.push({
            text: "",
            color: a91,
            bold: !1
        });
        q.push(z)
    }
    return q
}
// @from(Ln 432810, Col 0)
function a3z(A) {
    if (A < 16) return [{
        r: 0,
        g: 0,
        b: 0
    }, {
        r: 128,
        g: 0,
        b: 0
    }, {
        r: 0,
        g: 128,
        b: 0
    }, {
        r: 128,
        g: 128,
        b: 0
    }, {
        r: 0,
        g: 0,
        b: 128
    }, {
        r: 128,
        g: 0,
        b: 128
    }, {
        r: 0,
        g: 128,
        b: 128
    }, {
        r: 192,
        g: 192,
        b: 192
    }, {
        r: 128,
        g: 128,
        b: 128
    }, {
        r: 255,
        g: 0,
        b: 0
    }, {
        r: 0,
        g: 255,
        b: 0
    }, {
        r: 255,
        g: 255,
        b: 0
    }, {
        r: 0,
        g: 0,
        b: 255
    }, {
        r: 255,
        g: 0,
        b: 255
    }, {
        r: 0,
        g: 255,
        b: 255
    }, {
        r: 255,
        g: 255,
        b: 255
    }][A] || a91;
    if (A < 232) {
        let K = A - 16,
            Y = Math.floor(K / 36),
            z = Math.floor(K % 36 / 6),
            w = K % 6;
        return {
            r: Y === 0 ? 0 : 55 + Y * 40,
            g: z === 0 ? 0 : 55 + z * 40,
            b: w === 0 ? 0 : 55 + w * 40
        }
    }
    let q = (A - 232) * 10 + 8;
    return {
        r: q,
        g: q,
        b: q
    }
}
// @from(Ln 432895, Col 0)
function s3z(A) {
    return A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
}
// @from(Ln 432899, Col 0)
function AOq(A, q = {}) {
    let {
        fontFamily: K = "Menlo, Monaco, monospace",
        fontSize: Y = 14,
        lineHeight: z = 22,
        paddingX: w = 24,
        paddingY: H = 24,
        backgroundColor: $ = `rgb(${hBA.r}, ${hBA.g}, ${hBA.b})`,
        borderRadius: O = 8
    } = q, _ = o3z(A);
    while (_.length > 0 && _[_.length - 1].every((P) => P.text.trim() === "")) _.pop();
    let J = Y * 0.6,
        X = Math.max(..._.map((P) => P.reduce((W, G) => W + G.text.length, 0))),
        D = Math.ceil(X * J + w * 2),
        j = _.length * z + H * 2,
        M = `<svg xmlns="http://www.w3.org/2000/svg" width="${D}" height="${j}" viewBox="0 0 ${D} ${j}">
`;
    M += `  <rect width="100%" height="100%" fill="${$}" rx="${O}" ry="${O}"/>
`, M += `  <style>
`, M += `    text { font-family: ${K}; font-size: ${Y}px; white-space: pre; }
`, M += `    .b { font-weight: bold; }
`, M += `  </style>
`;
    for (let P = 0; P < _.length; P++) {
        let W = _[P],
            G = H + (P + 1) * z - (z - Y) / 2;
        M += `  <text x="${w}" y="${G}" xml:space="preserve">`;
        for (let f of W) {
            if (!f.text) continue;
            let Z = `rgb(${f.color.r}, ${f.color.g}, ${f.color.b})`,
                N = f.bold ? ' class="b"' : "";
            M += `<tspan fill="${Z}"${N}>${s3z(f.text)}</tspan>`
        }
        M += `</text>
`
    }
    return M += "</svg>", M
}
// @from(Ln 432937, Col 4)
e$q
// @from(Ln 432937, Col 9)
a91
// @from(Ln 432937, Col 14)
hBA
// @from(Ln 432938, Col 4)
qOq = v(() => {
    e$q = {
        30: {
            r: 0,
            g: 0,
            b: 0
        },
        31: {
            r: 205,
            g: 49,
            b: 49
        },
        32: {
            r: 13,
            g: 188,
            b: 121
        },
        33: {
            r: 229,
            g: 229,
            b: 16
        },
        34: {
            r: 36,
            g: 114,
            b: 200
        },
        35: {
            r: 188,
            g: 63,
            b: 188
        },
        36: {
            r: 17,
            g: 168,
            b: 205
        },
        37: {
            r: 229,
            g: 229,
            b: 229
        },
        90: {
            r: 102,
            g: 102,
            b: 102
        },
        91: {
            r: 241,
            g: 76,
            b: 76
        },
        92: {
            r: 35,
            g: 209,
            b: 139
        },
        93: {
            r: 245,
            g: 245,
            b: 67
        },
        94: {
            r: 59,
            g: 142,
            b: 234
        },
        95: {
            r: 214,
            g: 112,
            b: 214
        },
        96: {
            r: 41,
            g: 184,
            b: 219
        },
        97: {
            r: 255,
            g: 255,
            b: 255
        }
    }, a91 = {
        r: 229,
        g: 229,
        b: 229
    }, hBA = {
        r: 30,
        g: 30,
        b: 30
    }
})
// @from(Ln 433047, Col 0)
function K5z() {
    let A = KOq(q5z(import.meta.url));
    return xBA(KOq(Hp1()), "resvg.wasm")
}
// @from(Ln 433052, Col 0)
function Y5z() {
    if (!D9() || typeof Bun > "u" || !Bun.embeddedFiles) return null;
    for (let A of Bun.embeddedFiles) {
        let q = A.name;
        if (q && q.endsWith("resvg.wasm")) return A
    }
    return null
}
// @from(Ln 433060, Col 0)
async function z5z() {
    if (IBA) return;
    if (D9()) {
        let K = Y5z();
        if (K) {
            let Y = await K.arrayBuffer();
            await SBA(new Uint8Array(Y)), IBA = !0;
            return
        }
    }
    let A = K5z();
    if (!bBA(A)) throw Error(`resvg WASM file not found at: ${A}`);
    let q = YOq(A);
    await SBA(q), IBA = !0
}
// @from(Ln 433075, Col 0)
async function w5z() {
    if (AT6) return [AT6];
    let A = eA(),
        q = [];
    if (A === "macos") q.push("/System/Library/Fonts/Menlo.ttc", "/System/Library/Fonts/Monaco.dfont", "/Library/Fonts/Courier New.ttf");
    else if (A === "linux") q.push("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", "/usr/share/fonts/TTF/DejaVuSansMono.ttf", "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf", "/usr/share/fonts/truetype/ubuntu/UbuntuMono-R.ttf");
    else if (A === "windows") q.push("C:\\Windows\\Fonts\\consola.ttf", "C:\\Windows\\Fonts\\cour.ttf");
    for (let K of q) try {
        if (bBA(K)) return AT6 = YOq(K), [AT6]
    } catch {}
    return []
}
// @from(Ln 433087, Col 0)
async function zOq(A, q) {
    if (!D9()) return {
        success: !1,
        message: "Screenshot copying is not available in this build"
    };
    try {
        await z5z();
        let K = xBA(A5z(), "claude-code-screenshots");
        if (!bBA(K)) e3z(K, {
            recursive: !0
        });
        let Y = Date.now(),
            z = AOq(A, q),
            w = xBA(K, `screenshot-${Y}.png`),
            H = await w5z(),
            _ = new s$q(z, {
                fitTo: {
                    mode: "zoom",
                    value: 4
                },
                font: {
                    fontBuffers: H,
                    defaultFontFamily: "Menlo",
                    monospaceFamily: "Menlo"
                }
            }).render().asPng();
        c8(w, _);
        let J = await H5z(w);
        try {
            t3z(w)
        } catch {}
        return J
    } catch (K) {
        return K1(K instanceof Error ? K : Error(String(K))), {
            success: !1,
            message: `Failed to copy screenshot: ${K instanceof Error?K.message:"Unknown error"}`
        }
    }
}
// @from(Ln 433126, Col 0)
async function H5z(A) {
    let q = eA();
    if (q === "macos") {
        let Y = `set the clipboard to (read (POSIX file "${A.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}") as «class PNGf»)`,
            z = await d4("osascript", ["-e", Y], {
                timeout: 5000
            });
        if (z.code === 0) return {
            success: !0,
            message: "Screenshot copied to clipboard"
        };
        return {
            success: !1,
            message: `Failed to copy to clipboard: ${z.stderr}`
        }
    }
    if (q === "linux") {
        if ((await d4("xclip", ["-selection", "clipboard", "-t", "image/png", "-i", A], {
                timeout: 5000
            })).code === 0) return {
            success: !0,
            message: "Screenshot copied to clipboard"
        };
        if ((await d4("xsel", ["--clipboard", "--input", "--type", "image/png"], {
                timeout: 5000
            })).code === 0) return {
            success: !0,
            message: "Screenshot copied to clipboard"
        };
        return {
            success: !1,
            message: "Failed to copy to clipboard. Please install xclip or xsel: sudo apt install xclip"
        }
    }
    if (q === "windows") {
        let K = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Clipboard]::SetImage([System.Drawing.Image]::FromFile('${A.replace(/'/g,"''")}'))`,
            Y = await d4("powershell", ["-NoProfile", "-Command", K], {
                timeout: 5000
            });
        if (Y.code === 0) return {
            success: !0,
            message: "Screenshot copied to clipboard"
        };
        return {
            success: !1,
            message: `Failed to copy to clipboard: ${Y.stderr}`
        }
    }
    return {
        success: !1,
        message: `Screenshot to clipboard is not supported on ${q}`
    }
}
// @from(Ln 433179, Col 4)
IBA = !1
// @from(Ln 433180, Col 4)
AT6 = null
// @from(Ln 433181, Col 4)
wOq = v(() => {
    m6();
    t$q();
    x3();
    qOq();
    y6();
    tq();
    am()
})
// @from(Ln 433191, Col 0)
function O5z(A) {
    return new Date(A).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    })
}
// @from(Ln 433198, Col 0)
function _5z(A) {
    let q = qT6.indexOf(A);
    return qT6[(q + 1) % qT6.length]
}
// @from(Ln 433203, Col 0)
function J5z() {
    return vBA("all").then((A) => {
        if (!A || A.totalSessions === 0) return {
            type: "empty"
        };
        return {
            type: "success",
            data: A
        }
    }).catch((A) => {
        return {
            type: "error",
            message: A instanceof Error ? A.message : "Failed to load stats"
        }
    })
}
// @from(Ln 433220, Col 0)
function _Oq(A) {
    let q = e(4),
        {
            onClose: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = J5z(), q[0] = Y;
    else Y = q[0];
    let z = Y,
        w;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) w = W8.default.createElement(I, {
        marginTop: 1
    }, W8.default.createElement(c4, null), W8.default.createElement(V, null, " Loading your Claude Code stats…")), q[1] = w;
    else w = q[1];
    let H;
    if (q[2] !== K) H = W8.default.createElement(Of.Suspense, {
        fallback: w
    }, W8.default.createElement(X5z, {
        allTimePromise: z,
        onClose: K
    })), q[2] = K, q[3] = H;
    else H = q[3];
    return H
}
// @from(Ln 433245, Col 0)
function X5z(A) {
    let q = e(36),
        {
            allTimePromise: K,
            onClose: Y
        } = A,
        z = Of.use(K),
        [w, H] = Of.useState("all"),
        $;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = {}, q[0] = $;
    else $ = q[0];
    let [O, _] = Of.useState($), [J, X] = Of.useState(!1), [D, j] = Of.useState("Overview"), [M, P] = Of.useState(null), W, G;
    if (q[1] !== w || q[2] !== O) W = () => {
        if (w === "all") return;
        if (O[w]) return;
        let x = !1;
        return X(!0), vBA(w).then((p) => {
            if (!x) _((l) => ({
                ...l,
                [w]: p
            })), X(!1)
        }).catch(() => {
            if (!x) X(!1)
        }), () => {
            x = !0
        }
    }, G = [w, O], q[1] = w, q[2] = O, q[3] = W, q[4] = G;
    else W = q[3], G = q[4];
    Of.useEffect(W, G);
    let f = w === "all" ? z.type === "success" ? z.data : null : O[w] ?? (z.type === "success" ? z.data : null),
        Z = z.type === "success" ? z.data : null,
        N;
    if (q[5] !== Y) N = () => {
        Y("Stats dialog dismissed", {
            display: "system"
        })
    }, q[5] = Y, q[6] = N;
    else N = q[6];
    let T = N,
        k;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) k = {
        context: "Confirmation"
    }, q[7] = k;
    else k = q[7];
    DA("confirm:no", T, k);
    let y;
    if (q[8] !== D || q[9] !== w || q[10] !== f || q[11] !== Y) y = (x, p) => {
        if (p.ctrl && (x === "c" || x === "d")) Y("Stats dialog dismissed", {
            display: "system"
        });
        if (p.tab) j(D5z);
        if (x === "r" && !p.ctrl && !p.meta) H(_5z(w));
        if (D9() && p.ctrl && x === "s" && f) v5z(f, D, P)
    }, q[8] = D, q[9] = w, q[10] = f, q[11] = Y, q[12] = y;
    else y = q[12];
    if (D8(y), z.type === "error") {
        let x;
        if (q[13] !== z.message) x = W8.default.createElement(I, {
            marginTop: 1
        }, W8.default.createElement(V, {
            color: "error"
        }, "Failed to load stats: ", z.message)), q[13] = z.message, q[14] = x;
        else x = q[14];
        return x
    }
    if (z.type === "empty") {
        let x;
        if (q[15] === Symbol.for("react.memo_cache_sentinel")) x = W8.default.createElement(I, {
            marginTop: 1
        }, W8.default.createElement(V, {
            color: "warning"
        }, "No stats available yet. Start using Claude Code!")), q[15] = x;
        else x = q[15];
        return x
    }
    if (!f || !Z) {
        let x;
        if (q[16] === Symbol.for("react.memo_cache_sentinel")) x = W8.default.createElement(I, {
            marginTop: 1
        }, W8.default.createElement(c4, null), W8.default.createElement(V, null, " Loading stats…")), q[16] = x;
        else x = q[16];
        return x
    }
    let B;
    if (q[17] !== Z || q[18] !== w || q[19] !== f || q[20] !== J) B = W8.default.createElement(LH, {
        title: "Overview"
    }, W8.default.createElement(j5z, {
        stats: f,
        allTimeStats: Z,
        dateRange: w,
        isLoading: J
    })), q[17] = Z, q[18] = w, q[19] = f, q[20] = J, q[21] = B;
    else B = q[21];
    let S;
    if (q[22] !== w || q[23] !== f || q[24] !== J) S = W8.default.createElement(LH, {
        title: "Models"
    }, W8.default.createElement(W5z, {
        stats: f,
        dateRange: w,
        isLoading: J
    })), q[22] = w, q[23] = f, q[24] = J, q[25] = S;
    else S = q[25];
    let m;
    if (q[26] !== B || q[27] !== S) m = W8.default.createElement(I, {
        flexDirection: "row",
        gap: 1,
        marginBottom: 1
    }, W8.default.createElement($y, {
        title: "",
        color: "claude",
        defaultTab: "Overview"
    }, B, S)), q[26] = B, q[27] = S, q[28] = m;
    else m = q[28];
    let b;
    if (q[29] !== M) b = D9() && W8.default.createElement(W8.default.Fragment, null, " · ctrl+s to copy", M ? ` · ${M}` : ""), q[29] = M, q[30] = b;
    else b = q[30];
    let g;
    if (q[31] !== b) g = W8.default.createElement(I, {
        paddingLeft: 1
    }, W8.default.createElement(V, {
        dimColor: !0
    }, "Esc to cancel · r to cycle dates", b)), q[31] = b, q[32] = g;
    else g = q[32];
    let U;
    if (q[33] !== g || q[34] !== m) U = W8.default.createElement(I, {
        flexDirection: "column",
        marginX: 1,
        marginTop: 1
    }, m, g), q[33] = g, q[34] = m, q[35] = U;
    else U = q[35];
    return U
}
// @from(Ln 433378, Col 0)
function D5z(A) {
    return A === "Overview" ? "Models" : "Overview"
}
// @from(Ln 433382, Col 0)
function JOq(A) {
    let q = e(9),
        {
            dateRange: K,
            isLoading: Y
        } = A,
        z;
    if (q[0] !== K) z = qT6.map((O, _) => W8.default.createElement(V, {
        key: O
    }, _ > 0 && W8.default.createElement(V, {
        dimColor: !0
    }, " · "), O === K ? W8.default.createElement(V, {
        bold: !0,
        color: "claude"
    }, HOq[O]) : W8.default.createElement(V, {
        dimColor: !0
    }, HOq[O]))), q[0] = K, q[1] = z;
    else z = q[1];
    let w;
    if (q[2] !== z) w = W8.default.createElement(I, null, z), q[2] = z, q[3] = w;
    else w = q[3];
    let H;
    if (q[4] !== Y) H = Y && W8.default.createElement(c4, null), q[4] = Y, q[5] = H;
    else H = q[5];
    let $;
    if (q[6] !== w || q[7] !== H) $ = W8.default.createElement(I, {
        marginBottom: 1,
        gap: 1
    }, w, H), q[6] = w, q[7] = H, q[8] = $;
    else $ = q[8];
    return $
}
// @from(Ln 433415, Col 0)
function j5z({
    stats: A,
    allTimeStats: q,
    dateRange: K,
    isLoading: Y
}) {
    let {
        columns: z
    } = Z8(), w = Object.entries(A.modelUsage).sort(([, X], [, D]) => D.inputTokens + D.outputTokens - (X.inputTokens + X.outputTokens)), H = w[0], $ = w.reduce((X, [, D]) => X + D.inputTokens + D.outputTokens, 0), O = Of.useMemo(() => XOq(A, $), [A, $]), _ = K === "7d" ? 7 : K === "30d" ? 30 : A.totalDays, J = null;
    return W8.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, q.dailyActivity.length > 0 && W8.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, W8.default.createElement(W3, null, kBA(q.dailyActivity, {
        terminalWidth: z
    }))), W8.default.createElement(JOq, {
        dateRange: K,
        isLoading: Y
    }), W8.default.createElement(I, {
        flexDirection: "row",
        gap: 4,
        marginBottom: 1
    }, W8.default.createElement(I, {
        flexDirection: "column",
        width: 28
    }, H && W8.default.createElement(V, {
        wrap: "truncate"
    }, "Favorite model:", " ", W8.default.createElement(V, {
        color: "claude",
        bold: !0
    }, dG(H[0])))), W8.default.createElement(I, {
        flexDirection: "column",
        width: 28
    }, W8.default.createElement(V, {
        wrap: "truncate"
    }, "Total tokens:", " ", W8.default.createElement(V, {
        color: "claude"
    }, Y3($))))), W8.default.createElement(I, {
        flexDirection: "row",
        gap: 4
    }, W8.default.createElement(I, {
        flexDirection: "column",
        width: 28
    }, W8.default.createElement(V, {
        wrap: "truncate"
    }, "Sessions:", " ", W8.default.createElement(V, {
        color: "claude"
    }, Y3(A.totalSessions)))), W8.default.createElement(I, {
        flexDirection: "column",
        width: 28
    }, A.longestSession && W8.default.createElement(V, {
        wrap: "truncate"
    }, "Longest session:", " ", W8.default.createElement(V, {
        color: "claude"
    }, Xz(A.longestSession.duration))))), W8.default.createElement(I, {
        flexDirection: "row",
        gap: 4
    }, W8.default.createElement(I, {
        flexDirection: "column",
        width: 28
    }, W8.default.createElement(V, {
        wrap: "truncate"
    }, "Active days: ", W8.default.createElement(V, {
        color: "claude"
    }, A.activeDays), W8.default.createElement(V, {
        color: "subtle"
    }, "/", _))), W8.default.createElement(I, {
        flexDirection: "column",
        width: 28
    }, W8.default.createElement(V, {
        wrap: "truncate"
    }, "Longest streak:", " ", W8.default.createElement(V, {
        color: "claude",
        bold: !0
    }, A.streaks.longestStreak), " ", A.streaks.longestStreak === 1 ? "day" : "days"))), W8.default.createElement(I, {
        flexDirection: "row",
        gap: 4
    }, W8.default.createElement(I, {
        flexDirection: "column",
        width: 28
    }, A.peakActivityDay && W8.default.createElement(V, {
        wrap: "truncate"
    }, "Most active day:", " ", W8.default.createElement(V, {
        color: "claude"
    }, O5z(A.peakActivityDay)))), W8.default.createElement(I, {
        flexDirection: "column",
        width: 28
    }, W8.default.createElement(V, {
        wrap: "truncate"
    }, "Current streak:", " ", W8.default.createElement(V, {
        color: "claude",
        bold: !0
    }, q.streaks.currentStreak), " ", q.streaks.currentStreak === 1 ? "day" : "days"))), !1, J && W8.default.createElement(W8.default.Fragment, null, W8.default.createElement(I, {
        marginTop: 1
    }, W8.default.createElement(V, null, "Shot distribution")), W8.default.createElement(I, {
        flexDirection: "row",
        gap: 4
    }, W8.default.createElement(I, {
        flexDirection: "column",
        width: 28
    }, W8.default.createElement(V, {
        wrap: "truncate"
    }, J.buckets[0].label, ":", " ", W8.default.createElement(V, {
        color: "claude"
    }, J.buckets[0].count), W8.default.createElement(V, {
        color: "subtle"
    }, " (", J.buckets[0].pct, "%)"))), W8.default.createElement(I, {
        flexDirection: "column",
        width: 28
    }, W8.default.createElement(V, {
        wrap: "truncate"
    }, J.buckets[1].label, ":", " ", W8.default.createElement(V, {
        color: "claude"
    }, J.buckets[1].count), W8.default.createElement(V, {
        color: "subtle"
    }, " (", J.buckets[1].pct, "%)")))), W8.default.createElement(I, {
        flexDirection: "row",
        gap: 4
    }, W8.default.createElement(I, {
        flexDirection: "column",
        width: 28
    }, W8.default.createElement(V, {
        wrap: "truncate"
    }, J.buckets[2].label, ":", " ", W8.default.createElement(V, {
        color: "claude"
    }, J.buckets[2].count), W8.default.createElement(V, {
        color: "subtle"
    }, " (", J.buckets[2].pct, "%)"))), W8.default.createElement(I, {
        flexDirection: "column",
        width: 28
    }, W8.default.createElement(V, {
        wrap: "truncate"
    }, J.buckets[3].label, ":", " ", W8.default.createElement(V, {
        color: "claude"
    }, J.buckets[3].count), W8.default.createElement(V, {
        color: "subtle"
    }, " (", J.buckets[3].pct, "%)")))), W8.default.createElement(I, {
        flexDirection: "row",
        gap: 4
    }, W8.default.createElement(I, {
        flexDirection: "column",
        width: 28
    }, W8.default.createElement(V, {
        wrap: "truncate"
    }, "Avg/session:", " ", W8.default.createElement(V, {
        color: "claude"
    }, J.avgShots))))), O && W8.default.createElement(I, {
        marginTop: 1
    }, W8.default.createElement(V, {
        color: "suggestion"
    }, O)))
}
// @from(Ln 433570, Col 0)
function XOq(A, q) {
    let K = [];
    if (q > 0) {
        let z = M5z.filter((w) => q >= w.tokens);
        for (let w of z) {
            let H = q / w.tokens;
            if (H >= 2) K.push(`You've used ~${Math.floor(H)}x more tokens than ${w.name}`);
            else K.push(`You've used the same number of tokens as ${w.name}`)
        }
    }
    if (A.longestSession) {
        let z = A.longestSession.duration / 60000;
        for (let w of P5z) {
            let H = z / w.minutes;
            if (H >= 2) K.push(`Your longest session is ~${Math.floor(H)}x longer than ${w.name}`)
        }
    }
    if (K.length === 0) return "";
    let Y = Math.floor(Math.random() * K.length);
    return K[Y]
}
// @from(Ln 433592, Col 0)
function W5z(A) {
    let q = e(13),
        {
            stats: K,
            dateRange: Y,
            isLoading: z
        } = A,
        [w, H] = Of.useState(0),
        {
            columns: $
        } = Z8(),
        O = Object.entries(K.modelUsage).sort(N5z);
    if (D8((S, m) => {
            if (m.downArrow && w < O.length - 4) H((b) => Math.min(b + 2, O.length - 4));
            if (m.upArrow && w > 0) H(V5z)
        }), O.length === 0) {
        let S;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) S = W8.default.createElement(I, null, W8.default.createElement(V, {
            color: "subtle"
        }, "No model usage data available")), q[0] = S;
        else S = q[0];
        return S
    }
    let _ = O.reduce(f5z, 0),
        J = DOq(K.dailyModelTokens, O.map(Z5z), $),
        X = O.slice(w, w + 4),
        D = Math.ceil(X.length / 2),
        j = X.slice(0, D),
        M = X.slice(D),
        P = w > 0,
        W = w < O.length - 4,
        G = O.length > 4,
        f;
    if (q[1] !== Y || q[2] !== z) f = W8.default.createElement(JOq, {
        dateRange: Y,
        isLoading: z
    }), q[1] = Y, q[2] = z, q[3] = f;
    else f = q[3];
    let Z = I,
        N = "column",
        T = 36,
        k = M.map((S) => {
            let [m, b] = S;
            return W8.default.createElement($Oq, {
                key: m,
                model: m,
                usage: b,
                totalTokens: _
            })
        }),
        y;
    if (q[4] !== Z || q[5] !== k) y = W8.default.createElement(Z, {
        flexDirection: N,
        width: T
    }, k), q[4] = Z, q[5] = k, q[6] = y;
    else y = q[6];
    let B;
    if (q[7] !== W || q[8] !== P || q[9] !== O || q[10] !== w || q[11] !== G) B = G && W8.default.createElement(I, {
        marginTop: 1
    }, W8.default.createElement(V, {
        color: "subtle"
    }, P ? l1.arrowUp : " ", " ", W ? l1.arrowDown : " ", " ", w + 1, "-", Math.min(w + 4, O.length), " of", " ", O.length, " models (↑↓ to scroll)")), q[7] = W, q[8] = P, q[9] = O, q[10] = w, q[11] = G, q[12] = B;
    else B = q[12];
    return W8.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, J && W8.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, W8.default.createElement(V, {
        bold: !0
    }, "Tokens per Day"), W8.default.createElement(W3, null, J.chart), W8.default.createElement(V, {
        color: "subtle"
    }, J.xAxisLabels), W8.default.createElement(I, null, J.legend.map(G5z))), f, W8.default.createElement(I, {
        flexDirection: "row",
        gap: 4
    }, W8.default.createElement(I, {
        flexDirection: "column",
        width: 36
    }, j.map((S) => {
        let [m, b] = S;
        return W8.default.createElement($Oq, {
            key: m,
            model: m,
            usage: b,
            totalTokens: _
        })
    })), y), B)
}
// @from(Ln 433682, Col 0)
function G5z(A, q) {
    return W8.default.createElement(V, {
        key: A.model
    }, q > 0 ? " · " : "", W8.default.createElement(W3, null, A.coloredBullet), " ", A.model)
}
// @from(Ln 433688, Col 0)
function Z5z(A) {
    let [q] = A;
    return q
}
// @from(Ln 433693, Col 0)
function f5z(A, q) {
    let [, K] = q;
    return A + K.inputTokens + K.outputTokens
}
// @from(Ln 433698, Col 0)
function V5z(A) {
    return Math.max(A - 2, 0)
}
// @from(Ln 433702, Col 0)
function N5z(A, q) {
    let [, K] = A, [, Y] = q;
    return Y.inputTokens + Y.outputTokens - (K.inputTokens + K.outputTokens)
}
// @from(Ln 433707, Col 0)
function $Oq(A) {
    let q = e(21),
        {
            model: K,
            usage: Y,
            totalTokens: z
        } = A,
        H = (Y.inputTokens + Y.outputTokens) / z * 100,
        $;
    if (q[0] !== H) $ = H.toFixed(1), q[0] = H, q[1] = $;
    else $ = q[1];
    let O = $,
        _;
    if (q[2] !== K) _ = dG(K), q[2] = K, q[3] = _;
    else _ = q[3];
    let J;
    if (q[4] !== _) J = W8.default.createElement(V, {
        bold: !0
    }, _), q[4] = _, q[5] = J;
    else J = q[5];
    let X;
    if (q[6] !== O) X = W8.default.createElement(V, {
        color: "subtle"
    }, "(", O, "%)"), q[6] = O, q[7] = X;
    else X = q[7];
    let D;
    if (q[8] !== J || q[9] !== X) D = W8.default.createElement(V, null, l1.bullet, " ", J, " ", X), q[8] = J, q[9] = X, q[10] = D;
    else D = q[10];
    let j;
    if (q[11] !== Y.inputTokens) j = Y3(Y.inputTokens), q[11] = Y.inputTokens, q[12] = j;
    else j = q[12];
    let M;
    if (q[13] !== Y.outputTokens) M = Y3(Y.outputTokens), q[13] = Y.outputTokens, q[14] = M;
    else M = q[14];
    let P;
    if (q[15] !== j || q[16] !== M) P = W8.default.createElement(V, {
        color: "subtle"
    }, "  ", "In: ", j, " · Out:", " ", M), q[15] = j, q[16] = M, q[17] = P;
    else P = q[17];
    let W;
    if (q[18] !== D || q[19] !== P) W = W8.default.createElement(I, {
        flexDirection: "column"
    }, D, P), q[18] = D, q[19] = P, q[20] = W;
    else W = q[20];
    return W
}
// @from(Ln 433754, Col 0)
function DOq(A, q, K) {
    if (A.length < 2 || q.length === 0) return null;
    let Y = 7,
        z = K - Y,
        w = Math.min(52, Math.max(20, z)),
        H;
    if (A.length >= w) H = A.slice(-w);
    else {
        let M = Math.floor(w / A.length);
        H = [];
        for (let P of A)
            for (let W = 0; W < M; W++) H.push(P)
    }
    let $ = MW(f6().theme),
        O = [LK6($.suggestion), LK6($.success), LK6($.warning)],
        _ = [],
        J = [],
        X = q.slice(0, 3);
    for (let M = 0; M < X.length; M++) {
        let P = X[M],
            W = H.map((G) => G.tokensByModel[P] || 0);
        if (W.some((G) => G > 0)) {
            _.push(W);
            let G = [$.suggestion, $.success, $.warning];
            J.push({
                model: dG(P),
                coloredBullet: sg(l1.bullet, G[M % G.length])
            })
        }
    }
    if (_.length === 0) return null;
    let D = OOq.plot(_, {
            height: 8,
            colors: O.slice(0, _.length),
            format: (M) => {
                let P;
                if (M >= 1e6) P = (M / 1e6).toFixed(1) + "M";
                else if (M >= 1000) P = (M / 1000).toFixed(0) + "k";
                else P = M.toFixed(0);
                return P.padStart(6)
            }
        }),
        j = T5z(H, H.length, Y);
    return {
        chart: D,
        legend: J,
        xAxisLabels: j
    }
}
// @from(Ln 433804, Col 0)
function T5z(A, q, K) {
    if (A.length === 0) return "";
    let Y = Math.min(4, Math.max(2, Math.floor(A.length / 8))),
        z = A.length - 6,
        w = Math.floor(z / (Y - 1)) || 1,
        H = [];
    for (let _ = 0; _ < Y; _++) {
        let J = Math.min(_ * w, A.length - 1),
            D = new Date(A[J].date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            });
        H.push({
            pos: J,
            label: D
        })
    }
    let $ = " ".repeat(K),
        O = 0;
    for (let {
            pos: _,
            label: J
        }
        of H) {
        let X = Math.max(1, _ - O);
        $ += " ".repeat(X) + J, O = _ + J.length
    }
    return $
}
// @from(Ln 433833, Col 0)
async function v5z(A, q, K) {
    K("copying…");
    let Y = E5z(A, q),
        z = await zOq(Y);
    K(z.success ? "copied!" : "copy failed"), setTimeout(() => K(null), 2000)
}
// @from(Ln 433840, Col 0)
function E5z(A, q) {
    let K = [];
    if (q === "Overview") K.push(...L5z(A));
    else K.push(...R5z(A));
    while (K.length > 0 && k5z(K[K.length - 1]).trim() === "") K.pop();
    if (K.length > 0) {
        let Y = K[K.length - 1],
            z = UA(Y),
            w = q === "Overview" ? 70 : 80,
            H = "/stats",
            $ = Math.max(2, w - z - 6);
        K[K.length - 1] = Y + " ".repeat($) + H6.gray("/stats")
    }
    return K.join(`
`)
}
// @from(Ln 433857, Col 0)
function k5z(A) {
    return A.replace(/\x1b\[[0-9;]*m/g, "")
}
// @from(Ln 433861, Col 0)
function L5z(A) {
    let q = [],
        K = MW(f6().theme),
        Y = (W) => sg(W, K.claude),
        z = 18,
        w = 40,
        H = 18,
        $ = (W, G, f, Z) => {
            let N = (W + ":").padEnd(18),
                T = N.length + G.length,
                k = Math.max(2, 40 - T),
                y = (f + ":").padEnd(18);
            return N + Y(G) + " ".repeat(k) + y + Y(Z)
        };
    if (A.dailyActivity.length > 0) q.push(kBA(A.dailyActivity, {
        terminalWidth: 56
    })), q.push("");
    let O = Object.entries(A.modelUsage).sort(([, W], [, G]) => G.inputTokens + G.outputTokens - (W.inputTokens + W.outputTokens)),
        _ = O[0],
        J = O.reduce((W, [, G]) => W + G.inputTokens + G.outputTokens, 0);
    if (_) q.push($("Favorite model", dG(_[0]), "Total tokens", Y3(J)));
    q.push(""), q.push($("Sessions", Y3(A.totalSessions), "Longest session", A.longestSession ? Xz(A.longestSession.duration) : "N/A"));
    let X = `${A.streaks.currentStreak} ${A.streaks.currentStreak===1?"day":"days"}`,
        D = `${A.streaks.longestStreak} ${A.streaks.longestStreak===1?"day":"days"}`;
    q.push($("Current streak", X, "Longest streak", D));
    let j = `${A.activeDays}/${A.totalDays}`,
        M = A.peakActivityHour !== null ? `${A.peakActivityHour}:00-${A.peakActivityHour+1}:00` : "N/A";
    q.push($("Active days", j, "Peak hour", M)), q.push("");
    let P = XOq(A, J);
    return q.push(Y(P)), q.push(H6.gray(`Stats from the last ${A.totalDays} days`)), q
}
// @from(Ln 433893, Col 0)
function R5z(A) {
    let q = [],
        K = Object.entries(A.modelUsage).sort(([, $], [, O]) => O.inputTokens + O.outputTokens - ($.inputTokens + $.outputTokens));
    if (K.length === 0) return q.push(H6.gray("No model usage data available")), q;
    let Y = K[0],
        z = K.reduce(($, [, O]) => $ + O.inputTokens + O.outputTokens, 0),
        w = DOq(A.dailyModelTokens, K.map(([$]) => $), 80);
    if (w) {
        q.push(H6.bold("Tokens per Day")), q.push(w.chart), q.push(H6.gray(w.xAxisLabels));
        let $ = w.legend.map((O) => `${O.coloredBullet} ${O.model}`).join(" · ");
        q.push($), q.push("")
    }
    q.push(`${l1.star} Favorite: ${H6.magenta.bold(dG(Y?.[0]||""))} · ${l1.circle} Total: ${H6.magenta(Y3(z))} tokens`), q.push("");
    let H = K.slice(0, 3);
    for (let [$, O] of H) {
        let J = ((O.inputTokens + O.outputTokens) / z * 100).toFixed(1);
        q.push(`${l1.bullet} ${H6.bold(dG($))} ${H6.gray(`(${J}%)`)}`), q.push(H6.dim(`  In: ${Y3(O.inputTokens)} · Out: ${Y3(O.outputTokens)}`))
    }
    return q
}
// @from(Ln 433913, Col 4)
W8
// @from(Ln 433913, Col 8)
Of
// @from(Ln 433913, Col 12)
OOq
// @from(Ln 433913, Col 17)
HOq
// @from(Ln 433913, Col 22)
qT6
// @from(Ln 433913, Col 27)
M5z
// @from(Ln 433913, Col 32)
P5z