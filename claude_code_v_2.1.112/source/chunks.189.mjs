
// @from(Ln 489267, Col 4)
gj7 = L(() => {
    trY = {
        type: "local-jsx",
        name: "exit",
        aliases: ["quit"],
        description: "Exit the REPL",
        immediate: !0,
        load: () => Promise.resolve().then(() => (GsK(), fsK))
    }, VsK = {
        type: "local",
        name: "exit",
        supportsNonInteractive: !0,
        description: "Exit the REPL",
        load: () => Promise.resolve().then(() => (TsK(), vsK))
    }, Kz8 = trY
})
// @from(Ln 489283, Col 4)
NsK = {}
// @from(Ln 489288, Col 0)
async function ksK() {
    let q = await oA("claude");
    if (q) return {
        cmd: q,
        prefixArgs: []
    };
    return CC6()
}
// @from(Ln 489296, Col 4)
erY = async (q, K) => {
    let _ = K.getAppState().teamContext?.teamName,
        z = _?.startsWith("assistant-") ? _ : void 0;
    return er8({
        launcher: await ksK(),
        env: z ? {
            CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME: z
        } : void 0,
        preSpawn: () => process.stdout.write(Y8.dim(`
Switching from ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION} to latest… conversation will continue

`))
    })
}
// @from(Ln 489310, Col 4)
EsK = L(() => {
    Y3();
    l$7();
    BF8();
    n0()
})
// @from(Ln 489316, Col 4)
qoY
// @from(Ln 489316, Col 9)
ysK
// @from(Ln 489317, Col 4)
LsK = L(() => {
    qoY = {
        type: "local",
        name: "update",
        description: "Switch to the latest version (conversation continues)",
        supportsNonInteractive: !1,
        isEnabled: () => !1,
        isHidden: !0,
        load: () => Promise.resolve().then(() => (EsK(), NsK))
    }, ysK = qoY
})
// @from(Ln 489336, Col 0)
function YoY(q) {
    let K = zoY(q) === "" ? `${q}.txt` : q;
    return Wq(K)
}
// @from(Ln 489340, Col 0)
async function So8(q, K) {
    let _ = YoY(q);
    return await KoY(_oY(_), {
        recursive: !0
    }), aJ(_, K, {
        encoding: "utf-8",
        flush: !0
    }), _
}
// @from(Ln 489349, Col 4)
Uj7 = L(() => {
    b9();
    e8()
})
// @from(Ln 489354, Col 0)
function hsK({
    content: q,
    defaultFilename: K,
    onDone: _
}) {
    let [, z] = QM.useState(null), [Y, A] = QM.useState(K), [O, w] = QM.useState(K.length), [$, j] = QM.useState(!1), {
        columns: H
    } = s1(), J = QM.useCallback(() => {
        j(!1), z(null)
    }, []), X = async (Z) => {
        if (Z === "clipboard") {
            let G = await hP(q);
            if (G) process.stdout.write(G);
            _({
                success: !0,
                message: "Conversation copied to clipboard"
            })
        } else if (Z === "file") z("file"), j(!0)
    }, M = async () => {
        try {
            let Z = await So8(Y, q);
            _({
                success: !0,
                message: `Conversation exported to: ${Z}`
            })
        } catch (Z) {
            _({
                success: !1,
                message: `Failed to export conversation: ${Z instanceof Error?Z.message:"Unknown error"}`
            })
        }
    }, P = QM.useCallback(() => {
        if ($) J();
        else _({
            success: !1,
            message: "Export cancelled"
        })
    }, [$, J, _]), W = [{
        label: "Copy to clipboard",
        value: "clipboard",
        description: "Copy the conversation to your system clipboard"
    }, {
        label: "Save to file",
        value: "file",
        description: "Save the conversation to a file in the current directory"
    }];

    function D(Z) {
        if ($) return QM.default.createElement(z1, null, QM.default.createElement(A8, {
            chord: "enter",
            action: "save"
        }), QM.default.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
        }));
        if (Z.pending) return QM.default.createElement(T, null, "Press ", Z.keyName, " again to exit");
        return QM.default.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        })
    }
    return G1("confirm:no", P, {
        context: "Settings",
        isActive: $
    }), QM.default.createElement(R1, {
        title: "Export Conversation",
        subtitle: "Select export method:",
        color: "permission",
        onCancel: P,
        inputGuide: D,
        isCancelActive: !$
    }, !$ ? QM.default.createElement(A1, {
        options: W,
        onChange: X,
        onCancel: P
    }) : QM.default.createElement(u, {
        flexDirection: "column"
    }, QM.default.createElement(T, null, "Enter filename:"), QM.default.createElement(u, {
        flexDirection: "row",
        gap: 1,
        marginTop: 1
    }, QM.default.createElement(T, null, ">"), QM.default.createElement(l4, {
        value: Y,
        onChange: A,
        onSubmit: M,
        focus: !0,
        showCursor: !0,
        columns: H,
        cursorOffset: O,
        onChangeCursorOffset: w
    }))))
}
// @from(Ln 489450, Col 4)
QM
// @from(Ln 489451, Col 4)
RsK = L(() => {
    Uj7();
    I4();
    HX();
    g6();
    C7();
    bK();
    gK();
    Nq();
    S4();
    u7();
    NY();
    QM = K6(P6(), 1)
})
// @from(Ln 489466, Col 0)
function AoY({
    children: q
}) {
    let {
        bindings: K
    } = Ds6(RI), _ = H66.useRef(null), z = H66.useRef(new Map), Y = H66.useRef(new Set).current;
    return H66.default.createElement(Qy8, {
        bindings: K,
        pendingChordRef: _,
        pendingChord: null,
        setPendingChord: () => {},
        activeContexts: Y,
        registerActiveContext: () => {},
        unregisterActiveContext: () => {},
        handlerRegistryRef: z
    }, q)
}
// @from(Ln 489484, Col 0)
function OoY(q) {
    if (!("message" in q)) return 1;
    let K = q.message.content;
    return Array.isArray(K) ? K.length : 1
}
// @from(Ln 489489, Col 0)
async function woY(q, K, _, {
    columns: z,
    verbose: Y = !1,
    chunkSize: A = 40,
    onProgress: O
} = {}) {
    let w = (j) => gq8(H66.default.createElement(kX, null, H66.default.createElement(AoY, null, H66.default.createElement(zW6, {
            messages: q,
            tools: K,
            commands: [],
            verbose: Y,
            toolJSX: null,
            toolUseConfirmQueue: [],
            inProgressToolUseIDs: new Set,
            isMessageSelectorVisible: !1,
            conversationId: "export",
            screen: "prompt",
            streamingToolUses: [],
            showAllInTranscript: !0,
            isLoading: !1,
            renderRange: j,
            disableRenderCap: !0
        }))), z),
        $ = A;
    for (let j of q) $ += OoY(j);
    for (let j = 0; j < $; j += A) {
        let H = await w([j, j + A]);
        if (MO(H).trim() === "") break;
        await _(H), O?.(j + A)
    }
}
// @from(Ln 489520, Col 0)
async function Co8(q, K = [], _) {
    let z = [];
    return await woY(q, K, (Y) => void z.push(MO(Y)), {
        columns: _
    }), z.join("")
}
// @from(Ln 489526, Col 4)
H66
// @from(Ln 489527, Col 4)
Qj7 = L(() => {
    p_8();
    mN();
    jp();
    yd();
    JF();
    yt();
    H66 = K6(P6(), 1)
})
// @from(Ln 489536, Col 4)
IsK = {}
// @from(Ln 489543, Col 0)
function $oY(q) {
    let K = q.getFullYear(),
        _ = String(q.getMonth() + 1).padStart(2, "0"),
        z = String(q.getDate()).padStart(2, "0"),
        Y = String(q.getHours()).padStart(2, "0"),
        A = String(q.getMinutes()).padStart(2, "0"),
        O = String(q.getSeconds()).padStart(2, "0");
    return `${K}-${_}-${z}-${Y}${A}${O}`
}
// @from(Ln 489553, Col 0)
function CsK(q) {
    let K = q.find((Y) => Y.type === "user");
    if (!K || K.type !== "user") return "";
    let _ = K.message?.content,
        z = "";
    if (typeof _ === "string") z = _.trim();
    else if (Array.isArray(_)) {
        let Y = _.find((A) => A.type === "text");
        if (Y && "text" in Y) z = Y.text.trim()
    }
    if (z = z.split(`
`)[0] || "", z.length > 50) z = z.substring(0, 49) + "…";
    return z
}
// @from(Ln 489568, Col 0)
function bsK(q) {
    return q.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}
// @from(Ln 489571, Col 0)
async function joY(q) {
    let K = q.options.tools || [];
    return Co8(q.messages, K)
}
// @from(Ln 489575, Col 0)
async function HoY(q, K, _) {
    let z = await joY(K),
        Y = _.trim();
    if (Y) {
        try {
            let $ = await So8(Y, z);
            q(`Conversation exported to: ${$}`)
        } catch ($) {
            q(`Failed to export conversation: ${$ instanceof Error?$.message:"Unknown error"}`)
        }
        return null
    }
    let A = CsK(K.messages),
        O = $oY(new Date),
        w;
    if (A) {
        let $ = bsK(A);
        w = $ ? `${O}-${$}.txt` : `conversation-${O}.txt`
    } else w = `conversation-${O}.txt`;
    return SsK.default.createElement(hsK, {
        content: z,
        defaultFilename: w,
        onDone: ($) => {
            q($.message)
        }
    })
}
// @from(Ln 489602, Col 4)
SsK
// @from(Ln 489603, Col 4)
xsK = L(() => {
    RsK();
    Qj7();
    Uj7();
    SsK = K6(P6(), 1)
})
// @from(Ln 489609, Col 4)
JoY
// @from(Ln 489609, Col 9)
dj7
// @from(Ln 489610, Col 4)
usK = L(() => {
    JoY = {
        type: "local-jsx",
        name: "export",
        description: "Export the current conversation to a file or clipboard",
        argumentHint: "[filename]",
        load: () => Promise.resolve().then(() => (xsK(), IsK))
    }, dj7 = JoY
})
// @from(Ln 489619, Col 4)
msK
// @from(Ln 489620, Col 4)
BsK = L(() => {
    Ko8();
    Sq();
    msK = {
        type: "local-jsx",
        name: "model",
        get description() {
            return `Set the AI model for Claude Code (currently ${YJ(G5())})`
        },
        argumentHint: "[model]",
        get immediate() {
            return Pu6()
        },
        load: () => Promise.resolve().then(() => (xj7(), eaK))
    }
})
// @from(Ln 489636, Col 0)
async function psK() {
    let q = await AF();
    if (q.length === 0) return {
        availableEnvironments: [],
        selectedEnvironment: null,
        selectedEnvironmentSource: null
    };
    let _ = y7()?.remote?.defaultEnvironmentId,
        z = q.find((A) => A.kind !== "bridge") ?? q[0],
        Y = null;
    if (_) {
        let A = q.find((O) => O.environment_id === _);
        if (A) {
            z = A;
            for (let O = wv.length - 1; O >= 0; O--) {
                let w = wv[O];
                if (!w || w === "flagSettings") continue;
                if (E1(w)?.remote?.defaultEnvironmentId === _) {
                    Y = w;
                    break
                }
            }
        }
    }
    return {
        availableEnvironments: q,
        selectedEnvironment: z,
        selectedEnvironmentSource: Y
    }
}
// @from(Ln 489666, Col 4)
FsK = L(() => {
    aY();
    a1();
    IR6()
})
// @from(Ln 489672, Col 0)
function gsK(q) {
    let K = s(27),
        {
            onDone: _
        } = q,
        [z, Y] = $z6.useState("loading"),
        A;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) A = [], K[0] = A;
    else A = K[0];
    let [O, w] = $z6.useState(A), [$, j] = $z6.useState(null), [H, J] = $z6.useState(null), [X, M] = $z6.useState(null), P, W;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) P = () => {
        let f = !1;
        return async function() {
            try {
                let k = await psK();
                if (f) return;
                w(k.availableEnvironments), j(k.selectedEnvironment), J(k.selectedEnvironmentSource), Y(null)
            } catch (k) {
                let N = k;
                if (f) return;
                let R = r1(N);
                j6(R), M(R.message), Y(null)
            }
        }(), () => {
            f = !0
        }
    }, W = [], K[1] = P, K[2] = W;
    else P = K[1], W = K[2];
    $z6.useEffect(P, W);
    let D;
    if (K[3] !== O || K[4] !== _) D = function(v) {
        if (v === "cancel") {
            _();
            return
        }
        Y("updating");
        let V = O.find((k) => k.environment_id === v);
        if (!V) {
            _("Error: Selected environment not found");
            return
        }
        P7("localSettings", {
            remote: {
                defaultEnvironmentId: V.environment_id
            }
        }), _(`Set default remote environment to ${Y8.bold(V.name)} (${V.environment_id})`)
    }, K[3] = O, K[4] = _, K[5] = D;
    else D = K[5];
    let Z = D;
    if (z === "loading") {
        let f;
        if (K[6] === Symbol.for("react.memo_cache_sentinel")) f = W3.createElement(Q$, {
            message: "Loading environments…"
        }), K[6] = f;
        else f = K[6];
        let v;
        if (K[7] !== _) v = W3.createElement(R1, {
            title: _z8,
            onCancel: _,
            hideInputGuide: !0
        }, f), K[7] = _, K[8] = v;
        else v = K[8];
        return v
    }
    if (X) {
        let f;
        if (K[9] !== X) f = W3.createElement(T, {
            color: "error"
        }, "Error: ", X), K[9] = X, K[10] = f;
        else f = K[10];
        let v;
        if (K[11] !== _ || K[12] !== f) v = W3.createElement(R1, {
            title: _z8,
            onCancel: _
        }, f), K[11] = _, K[12] = f, K[13] = v;
        else v = K[13];
        return v
    }
    if (!$) {
        let f;
        if (K[14] === Symbol.for("react.memo_cache_sentinel")) f = W3.createElement(T, null, "No remote environments available."), K[14] = f;
        else f = K[14];
        let v;
        if (K[15] !== _) v = W3.createElement(R1, {
            title: _z8,
            subtitle: cj7,
            onCancel: _
        }, f), K[15] = _, K[16] = v;
        else v = K[16];
        return v
    }
    if (O.length === 1) {
        let f;
        if (K[17] !== _ || K[18] !== $) f = W3.createElement(MoY, {
            environment: $,
            onDone: _
        }), K[17] = _, K[18] = $, K[19] = f;
        else f = K[19];
        return f
    }
    let G;
    if (K[20] !== O || K[21] !== Z || K[22] !== z || K[23] !== _ || K[24] !== $ || K[25] !== H) G = W3.createElement(PoY, {
        environments: O,
        selectedEnvironment: $,
        selectedEnvironmentSource: H,
        loadingState: z,
        onSelect: Z,
        onCancel: _
    }), K[20] = O, K[21] = Z, K[22] = z, K[23] = _, K[24] = $, K[25] = H, K[26] = G;
    else G = K[26];
    return G
}
// @from(Ln 489785, Col 0)
function XoY(q) {
    let K = s(7),
        {
            environment: _
        } = q,
        z;
    if (K[0] !== _.name) z = W3.createElement(T, {
        bold: !0
    }, _.name), K[0] = _.name, K[1] = z;
    else z = K[1];
    let Y;
    if (K[2] !== _.environment_id) Y = W3.createElement(T, {
        dimColor: !0
    }, "(", _.environment_id, ")"), K[2] = _.environment_id, K[3] = Y;
    else Y = K[3];
    let A;
    if (K[4] !== z || K[5] !== Y) A = W3.createElement(T, null, e6.tick, " Using ", z, " ", Y), K[4] = z, K[5] = Y, K[6] = A;
    else A = K[6];
    return A
}
// @from(Ln 489806, Col 0)
function MoY(q) {
    let K = s(6),
        {
            environment: _,
            onDone: z
        } = q,
        Y;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = {
        context: "Confirmation"
    }, K[0] = Y;
    else Y = K[0];
    G1("confirm:yes", z, Y);
    let A;
    if (K[1] !== _) A = W3.createElement(XoY, {
        environment: _
    }), K[1] = _, K[2] = A;
    else A = K[2];
    let O;
    if (K[3] !== z || K[4] !== A) O = W3.createElement(R1, {
        title: _z8,
        subtitle: cj7,
        onCancel: z
    }, A), K[3] = z, K[4] = A, K[5] = O;
    else O = K[5];
    return O
}
// @from(Ln 489833, Col 0)
function PoY(q) {
    let K = s(18),
        {
            environments: _,
            selectedEnvironment: z,
            selectedEnvironmentSource: Y,
            loadingState: A,
            onSelect: O,
            onCancel: w
        } = q,
        $;
    if (K[0] !== Y) $ = Y && Y !== "localSettings" ? ` (from ${u16(Y)} settings)` : "", K[0] = Y, K[1] = $;
    else $ = K[1];
    let j = $,
        H;
    if (K[2] !== z.name) H = W3.createElement(T, {
        bold: !0
    }, z.name), K[2] = z.name, K[3] = H;
    else H = K[3];
    let J;
    if (K[4] !== j || K[5] !== H) J = W3.createElement(T, null, "Currently using: ", H, j), K[4] = j, K[5] = H, K[6] = J;
    else J = K[6];
    let X = J,
        M;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) M = W3.createElement(T, {
        dimColor: !0
    }, cj7), K[7] = M;
    else M = K[7];
    let P;
    if (K[8] !== _ || K[9] !== A || K[10] !== O || K[11] !== z.environment_id) P = A === "updating" ? W3.createElement(Q$, {
        message: "Updating…"
    }) : W3.createElement(A1, {
        options: _.map(WoY),
        defaultValue: z.environment_id,
        onChange: O,
        onCancel: () => O("cancel"),
        layout: "compact-vertical"
    }), K[8] = _, K[9] = A, K[10] = O, K[11] = z.environment_id, K[12] = P;
    else P = K[12];
    let W;
    if (K[13] === Symbol.for("react.memo_cache_sentinel")) W = W3.createElement(T, {
        dimColor: !0
    }, W3.createElement(z1, null, W3.createElement(A8, {
        chord: "enter",
        action: "select"
    }), W3.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))), K[13] = W;
    else W = K[13];
    let D;
    if (K[14] !== w || K[15] !== X || K[16] !== P) D = W3.createElement(R1, {
        title: _z8,
        subtitle: X,
        onCancel: w,
        hideInputGuide: !0
    }, M, P, W), K[14] = w, K[15] = X, K[16] = P, K[17] = D;
    else D = K[17];
    return D
}
// @from(Ln 489896, Col 0)
function WoY(q) {
    return {
        label: W3.createElement(T, null, q.name, " ", W3.createElement(T, {
            dimColor: !0
        }, "(", q.environment_id, ")")),
        value: q.environment_id
    }
}
// @from(Ln 489904, Col 4)
W3
// @from(Ln 489904, Col 8)
$z6
// @from(Ln 489904, Col 13)
_z8 = "Select Remote Environment"
// @from(Ln 489905, Col 4)
cj7 = "Configure environments at: https://claude.ai/code"
// @from(Ln 489906, Col 4)
UsK = L(() => {
    o6();
    Y3();
    Qq();
    g6();
    C7();
    m8();
    U8();
    aY();
    a1();
    FsK();
    bK();
    gK();
    Nq();
    S4();
    u7();
    Qy();
    W3 = K6(P6(), 1), $z6 = K6(P6(), 1)
})
// @from(Ln 489925, Col 4)
QsK = {}
// @from(Ln 489929, Col 0)
async function DoY(q) {
    return lj7.createElement(gsK, {
        onDone: q
    })
}
// @from(Ln 489934, Col 4)
lj7
// @from(Ln 489935, Col 4)
dsK = L(() => {
    UsK();
    lj7 = K6(P6(), 1)
})
// @from(Ln 489939, Col 4)
csK
// @from(Ln 489940, Col 4)
lsK = L(() => {
    J2();
    T7();
    csK = {
        type: "local-jsx",
        name: "remote-env",
        description: "Configure the default remote environment for teleport sessions",
        isEnabled: () => i7() && N5("allow_remote_sessions"),
        get isHidden() {
            return !i7() || !N5("allow_remote_sessions")
        },
        load: () => Promise.resolve().then(() => (dsK(), QsK))
    }
})
// @from(Ln 489954, Col 4)
nsK = {}
// @from(Ln 489958, Col 0)
async function ij7(q, K) {
    try {
        if (i7()) {
            let z = o7(),
                Y = !1;
            if (z?.subscriptionType && z?.rateLimitTier) Y = z.subscriptionType === "max" && z.rateLimitTier === "default_claude_max_20x";
            else if (z?.accessToken) {
                let A = await JQ(z.accessToken);
                Y = A?.organization?.organization_type === "claude_max" && A?.organization?.rate_limit_tier === "default_claude_max_20x"
            }
            if (Y) return setTimeout(q, 0, "You are already on the highest Max subscription plan. For additional usage, run /login to switch to an API usage-billed account."), null
        }
        return await J3("https://claude.ai/upgrade/max"), nj7.createElement(rC6, {
            startingMessage: "Starting new login following /upgrade. Exit with Ctrl-C to use existing account.",
            onDone: (z) => {
                K.onChangeAPIKey(), q(z ? "Login successful" : "Login interrupted")
            }
        })
    } catch (_) {
        j6(_), setTimeout(q, 0, "Failed to open browser. Please visit https://claude.ai/upgrade/max to upgrade.")
    }
    return null
}
// @from(Ln 489981, Col 4)
nj7
// @from(Ln 489982, Col 4)
rj7 = L(() => {
    WT6();
    T7();
    Nj();
    U8();
    pg8();
    nj7 = K6(P6(), 1)
})
// @from(Ln 489990, Col 4)
ZoY
// @from(Ln 489990, Col 9)
jz6
// @from(Ln 489991, Col 4)
oj7 = L(() => {
    T7();
    Q8();
    ZoY = {
        type: "local-jsx",
        name: "upgrade",
        description: "Upgrade to Max for higher rate limits and more Opus",
        availability: ["claude-ai"],
        isEnabled: () => !S6(process.env.DISABLE_UPGRADE_COMMAND) && MK() !== "enterprise",
        load: () => Promise.resolve().then(() => (rj7(), nsK))
    }, jz6 = ZoY
})
// @from(Ln 490003, Col 4)
isK = {}
// @from(Ln 490008, Col 0)
function foY(q) {
    let K = s(28),
        {
            onDone: _,
            context: z
        } = q,
        [Y, A] = Nu6.useState(null),
        O = h96(),
        w;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = MK(), K[0] = w;
    else w = K[0];
    let $ = w,
        j;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) j = tQ(), K[1] = j;
    else j = K[1];
    let H = j,
        J = k_()?.hasExtraUsageEnabled === !0,
        M = $ === "max" && H === "default_claude_max_20x",
        P = $ === "team" || $ === "enterprise",
        W = u8("tengu_jade_anvil_4", !1),
        D;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) D = u8("tengu_coral_beacon", !1), K[2] = D;
    else D = K[2];
    let Z = D,
        G = O.upgradePaths,
        f;
    q: {
        let x;
        if (K[3] !== O.overageDisabledReason || K[4] !== O.overageStatus || K[5] !== G) {
            x = [];
            let F = G !== void 0;
            if (L96.isEnabled()) {
                let g = Ib(),
                    c = P && !g,
                    n;
                if (F) n = G.includes("overage");
                else {
                    let l = O.overageDisabledReason === "out_of_credits" || O.overageDisabledReason === "org_level_disabled_until" || O.overageDisabledReason === "org_service_zero_credit_limit";
                    n = !(c && l)
                }
                if (n) {
                    let l = O.overageStatus === "rejected" || O.overageStatus === "allowed_warning",
                        z6;
                    if (c) z6 = l ? "Request more" : "Request extra usage";
                    else z6 = J ? "Add funds to continue with extra usage" : "Switch to extra usage";
                    let A6;
                    if (K[7] !== z6) A6 = {
                        label: z6,
                        value: "extra-usage"
                    }, K[7] = z6, K[8] = A6;
                    else A6 = K[8];
                    x.push(A6)
                }
            }
            if (F ? G.includes("upgrade_plan") && jz6.isEnabled() : !M && !P && jz6.isEnabled()) {
                let g;
                if (K[9] === Symbol.for("react.memo_cache_sentinel")) g = {
                    label: "Upgrade your plan",
                    value: "upgrade"
                }, K[9] = g;
                else g = K[9];
                x.push(g)
            }
            if (Z && !P && jz6.isEnabled()) {
                let g;
                if (K[10] === Symbol.for("react.memo_cache_sentinel")) g = {
                    label: M ? "Switch to Team plan" : "Upgrade to Team plan",
                    value: "team"
                }, K[10] = g;
                else g = K[10];
                x.push(g)
            }
            K[3] = O.overageDisabledReason, K[4] = O.overageStatus, K[5] = G, K[6] = x
        } else x = K[6];
        let B;
        if (K[11] === Symbol.for("react.memo_cache_sentinel")) B = {
            label: "Stop and wait for limit to reset",
            value: "cancel"
        },
        K[11] = B;
        else B = K[11];
        let m = B;
        if (W) {
            let F;
            if (K[12] !== x) F = [...x, m], K[12] = x, K[13] = F;
            else F = K[13];
            f = F;
            break q
        }
        let S;
        if (K[14] !== x) S = [m, ...x],
        K[14] = x,
        K[15] = S;
        else S = K[15];f = S
    }
    let v = f,
        V;
    if (K[16] !== _) V = function() {
        d("tengu_rate_limit_options_menu_cancel", {}), _(void 0, {
            display: "skip"
        })
    }, K[16] = _, K[17] = V;
    else V = K[17];
    let k = V,
        N;
    if (K[18] !== z || K[19] !== k || K[20] !== _) N = function(B) {
        if (B === "upgrade") d("tengu_rate_limit_options_menu_select_upgrade", {}), ij7(_, z).then((m) => {
            if (m) A(m)
        });
        else if (B === "team") d("tengu_rate_limit_options_menu_select_team", {}), J3(aj7).then((m) => {
            _(m ? `Opening ${aj7} in your browser. Run /login after upgrading to use your new plan.` : `Could not open a browser. Visit ${aj7} to upgrade, then run /login.`)
        });
        else if (B === "extra-usage") d("tengu_rate_limit_options_menu_select_extra_usage", {}), Kq7(_, z).then((m) => {
            if (m) A(m)
        });
        else if (B === "cancel") k()
    }, K[18] = z, K[19] = k, K[20] = _, K[21] = N;
    else N = K[21];
    let R = N;
    if (Y) return Y;
    let h;
    if (K[22] !== R || K[23] !== v) h = Nu6.default.createElement(A1, {
        options: v,
        onChange: R,
        visibleOptionCount: v.length
    }), K[22] = R, K[23] = v, K[24] = h;
    else h = K[24];
    let C;
    if (K[25] !== k || K[26] !== h) C = Nu6.default.createElement(R1, {
        title: "What do you want to do?",
        onCancel: k,
        color: "suggestion"
    }, h), K[25] = k, K[26] = h, K[27] = C;
    else C = K[27];
    return C
}
// @from(Ln 490144, Col 0)
async function GoY(q, K) {
    return Nu6.default.createElement(foY, {
        onDone: q,
        context: K
    })
}
// @from(Ln 490150, Col 4)
Nu6
// @from(Ln 490150, Col 9)
aj7 = "https://claude.ai/create/team"
// @from(Ln 490151, Col 4)
rsK = L(() => {
    o6();
    gK();
    S4();
    B1();
    C8();
    hK8();
    T7();
    HQ();
    Nj();
    _q7();
    aC6();
    oj7();
    rj7();
    Nu6 = K6(P6(), 1)
})
// @from(Ln 490167, Col 4)
voY
// @from(Ln 490167, Col 9)
osK
// @from(Ln 490168, Col 4)
asK = L(() => {
    T7();
    voY = {
        type: "local-jsx",
        name: "rate-limit-options",
        description: "Show options when rate limit is reached",
        isEnabled: () => i7() || !1,
        isHidden: !0,
        load: () => Promise.resolve().then(() => (rsK(), isK))
    }, osK = voY
})
// @from(Ln 490179, Col 4)
ToY
// @from(Ln 490179, Col 9)
ssK
// @from(Ln 490180, Col 4)
tsK = L(() => {
    sY();
    ToY = {
        type: "prompt",
        description: "Set up Claude Code's status line UI",
        contentLength: 0,
        aliases: [],
        name: "statusline",
        progressMessage: "setting up statusLine",
        allowedTools: [T4, "Read(~/**)", "Edit(~/.claude/settings.json)"],
        source: "builtin",
        disableNonInteractive: !0,
        disableModelInvocation: !0,
        async getPromptForCommand(q) {
            let K = q.trim() || "Configure my statusLine from my shell PS1 configuration";
            return [{
                type: "text",
                text: `Create an ${T4} with subagent_type "statusline-setup" and the prompt "${K}"`
            }]
        }
    }, ssK = ToY
})
// @from(Ln 490202, Col 4)
_tK = {}
// @from(Ln 490210, Col 0)
function koY(q) {
    let K = It6(q);
    if (K !== void 0) {
        let A = P7("userSettings", {
            effortLevel: K
        });
        if (A.error) return {
            message: `Failed to set effort level: ${A.error.message}`
        }
    }
    d("tengu_effort_command", {
        effort: q
    }), d8((A) => A.unpinOpus47LaunchEffort ? A : {
        ...A,
        unpinOpus47LaunchEffort: !0
    });
    let _ = Zj6();
    if (_ !== void 0 && _ !== q) {
        let A = process.env.CLAUDE_CODE_EFFORT_LEVEL;
        if (K === void 0) return {
            message: `Not applied: CLAUDE_CODE_EFFORT_LEVEL=${A} overrides effort this session, and ${q} is session-only (nothing saved)`,
            effortUpdate: {
                value: q
            }
        };
        return {
            message: `CLAUDE_CODE_EFFORT_LEVEL=${A} overrides this session — clear it and ${q} takes over`,
            effortUpdate: {
                value: q
            }
        }
    }
    let z = bF1(q);
    return {
        message: `Set effort level to ${q}${K!==void 0?"":" (this session only)"}: ${z}`,
        effortUpdate: {
            value: q
        }
    }
}
// @from(Ln 490251, Col 0)
function KtK(q, K) {
    let _ = Zj6(),
        z = _ === null ? void 0 : _ ?? q;
    if (z === void 0) return {
        message: `Effort level: auto (currently ${$y6(K,q)})`
    };
    let Y = bF1(z);
    return {
        message: `Current effort level: ${z} (${Y})`
    }
}
// @from(Ln 490263, Col 0)
function NoY() {
    let q = P7("userSettings", {
        effortLevel: void 0
    });
    if (q.error) return {
        message: `Failed to set effort level: ${q.error.message}`
    };
    d("tengu_effort_command", {
        effort: "auto"
    }), d8((_) => _.unpinOpus47LaunchEffort ? _ : {
        ..._,
        unpinOpus47LaunchEffort: !0
    });
    let K = Zj6();
    if (K !== void 0 && K !== null) return {
        message: `Cleared effort from settings, but CLAUDE_CODE_EFFORT_LEVEL=${process.env.CLAUDE_CODE_EFFORT_LEVEL} still controls this session`,
        effortUpdate: {
            value: void 0
        }
    };
    return {
        message: "Effort level set to auto",
        effortUpdate: {
            value: void 0
        }
    }
}
// @from(Ln 490291, Col 0)
function sj7(q) {
    let K = q.toLowerCase();
    if (K === "auto" || K === "unset") return NoY();
    if (!Nh8(K)) return {
        message: `Invalid argument: ${q}. Valid options are: low, medium, high, xhigh, max, auto`
    };
    return koY(K)
}
// @from(Ln 490300, Col 0)
function EoY(q) {
    let {
        onDone: K
    } = q, _ = M8(yoY), z = s2(), {
        message: Y
    } = KtK(_, z);
    return K(Y), null
}
// @from(Ln 490309, Col 0)
function yoY(q) {
    return q.effortValue
}
// @from(Ln 490313, Col 0)
function LoY(q) {
    let K = s(6),
        {
            result: _,
            onDone: z
        } = q,
        Y = R7(),
        {
            effortUpdate: A,
            message: O
        } = _,
        w, $;
    if (K[0] !== A || K[1] !== O || K[2] !== z || K[3] !== Y) w = () => {
        if (A) Y((j) => ({
            ...j,
            effortValue: A.value
        }));
        z(O)
    }, $ = [Y, A, O, z], K[0] = A, K[1] = O, K[2] = z, K[3] = Y, K[4] = w, K[5] = $;
    else w = K[4], $ = K[5];
    return B4.useEffect(w, $), null
}
// @from(Ln 490336, Col 0)
function zz8(q) {
    let K = s(9),
        {
            level: _,
            selected: z
        } = q;
    if (!z) {
        let A;
        if (K[0] !== _.value) A = B4.createElement(T, {
            dimColor: !0
        }, _.value), K[0] = _.value, K[1] = A;
        else A = K[1];
        return A
    }
    if (_.color === "rainbow-animated") {
        let A;
        if (K[2] !== _.value) A = B4.createElement(CoY, {
            text: _.value
        }), K[2] = _.value, K[3] = A;
        else A = K[3];
        return A
    }
    if (_.color === "autoAccept-shimmer") {
        let A;
        if (K[4] !== _.value) A = B4.createElement(boY, {
            text: _.value
        }), K[4] = _.value, K[5] = A;
        else A = K[5];
        return A
    }
    let Y;
    if (K[6] !== _.color || K[7] !== _.value) Y = B4.createElement(T, {
        bold: !0,
        color: _.color
    }, _.value), K[6] = _.color, K[7] = _.value, K[8] = Y;
    else Y = K[8];
    return Y
}
// @from(Ln 490375, Col 0)
function CoY(q) {
    let K = s(5),
        {
            text: _
        } = q,
        [, z] = _O(100),
        Y = Math.floor(z / 100),
        A;
    if (K[0] !== _) A = [..._], K[0] = _, K[1] = A;
    else A = K[1];
    let O;
    if (K[2] !== Y || K[3] !== A) O = B4.createElement(T, {
        bold: !0
    }, A.map((w, $) => B4.createElement(T, {
        key: $,
        color: Dp($ + Y)
    }, w))), K[2] = Y, K[3] = A, K[4] = O;
    else O = K[4];
    return O
}
// @from(Ln 490396, Col 0)
function boY(q) {
    let K = s(5),
        {
            text: _
        } = q,
        [, z] = _O(100),
        Y = _.length + 4,
        A = Math.floor(z / 100) % Y,
        O;
    if (K[0] !== _) O = [..._], K[0] = _, K[1] = O;
    else O = K[1];
    let w;
    if (K[2] !== A || K[3] !== O) w = B4.createElement(T, {
        bold: !0
    }, O.map(($, j) => {
        let H = j === A,
            J = j === A - 1 || j === A + 1;
        return B4.createElement(T, {
            key: j,
            color: H ? SoY : "autoAccept",
            bold: H || J
        }, $)
    })), K[2] = A, K[3] = O, K[4] = w;
    else w = K[4];
    return w
}
// @from(Ln 490423, Col 0)
function IoY(q) {
    let K = s(48),
        {
            onDone: _
        } = q,
        z = M8(BoY),
        Y = R7(),
        A;
    q: {
        if (!z) {
            A = esK;
            break q
        }
        let $6;
        if (K[0] !== z) $6 = J66.findIndex((q6) => q6.value === z),
        K[0] = z,
        K[1] = $6;
        else $6 = K[1];
        let H6 = $6;A = H6 === -1 ? esK : H6
    }
    let O = A,
        [w, $] = B4.useState(O),
        j;
    if (K[2] !== w || K[3] !== _ || K[4] !== Y) j = ($6, H6) => {
        if (H6.leftArrow) $(moY);
        else if (H6.rightArrow) $(uoY);
        else if (H6.return) {
            let q6 = J66[w],
                o = sj7(q6.value);
            if (o.effortUpdate) Y((_6) => ({
                ..._6,
                effortValue: o.effortUpdate.value
            }));
            _(o.message)
        } else if (H6.escape || H6.ctrl && ($6 === "c" || $6 === "d")) _("Cancelled")
    }, K[2] = w, K[3] = _, K[4] = Y, K[5] = j;
    else j = K[5];
    XR(j);
    let H = hoY[w],
        J;
    if (K[6] !== H) J = "─".repeat(H), K[6] = H, K[7] = J;
    else J = K[7];
    let X = J,
        M;
    if (K[8] !== H) M = "─".repeat(qtK - H - 1), K[8] = H, K[9] = M;
    else M = K[9];
    let P = M,
        W;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) W = " ".repeat(qtK - 5 - 12), K[10] = W;
    else W = K[10];
    let D = W,
        Z = xoY,
        G;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) G = B4.createElement(u, {
        height: 1
    }), K[11] = G;
    else G = K[11];
    let f;
    if (K[12] === Symbol.for("react.memo_cache_sentinel")) f = B4.createElement(u, null, B4.createElement(T, null, "Speed"), B4.createElement(T, null, D), B4.createElement(T, null, "Intelligence")), K[12] = f;
    else f = K[12];
    let v;
    if (K[13] !== X) v = B4.createElement(T, {
        dimColor: !0
    }, X), K[13] = X, K[14] = v;
    else v = K[14];
    let V;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) V = B4.createElement(T, {
        bold: !0
    }, "▲"), K[15] = V;
    else V = K[15];
    let k;
    if (K[16] !== P) k = B4.createElement(T, {
        dimColor: !0
    }, P), K[16] = P, K[17] = k;
    else k = K[17];
    let N;
    if (K[18] !== k || K[19] !== v) N = B4.createElement(u, null, v, V, k), K[18] = k, K[19] = v, K[20] = N;
    else N = K[20];
    let R = w === 0,
        h;
    if (K[21] !== R) h = B4.createElement(zz8, {
        level: J66[0],
        selected: R
    }), K[21] = R, K[22] = h;
    else h = K[22];
    let C;
    if (K[23] === Symbol.for("react.memo_cache_sentinel")) C = B4.createElement(T, null, Z(0)), K[23] = C;
    else C = K[23];
    let x = w === 1,
        B;
    if (K[24] !== x) B = B4.createElement(zz8, {
        level: J66[1],
        selected: x
    }), K[24] = x, K[25] = B;
    else B = K[25];
    let m;
    if (K[26] === Symbol.for("react.memo_cache_sentinel")) m = B4.createElement(T, null, Z(1)), K[26] = m;
    else m = K[26];
    let S = w === 2,
        F;
    if (K[27] !== S) F = B4.createElement(zz8, {
        level: J66[2],
        selected: S
    }), K[27] = S, K[28] = F;
    else F = K[28];
    let U;
    if (K[29] === Symbol.for("react.memo_cache_sentinel")) U = B4.createElement(T, null, Z(2)), K[29] = U;
    else U = K[29];
    let g = w === 3,
        c;
    if (K[30] !== g) c = B4.createElement(zz8, {
        level: J66[3],
        selected: g
    }), K[30] = g, K[31] = c;
    else c = K[31];
    let n;
    if (K[32] === Symbol.for("react.memo_cache_sentinel")) n = B4.createElement(T, null, Z(3)), K[32] = n;
    else n = K[32];
    let l = w === 4,
        z6;
    if (K[33] !== l) z6 = B4.createElement(zz8, {
        level: J66[4],
        selected: l
    }), K[33] = l, K[34] = z6;
    else z6 = K[34];
    let A6;
    if (K[35] !== h || K[36] !== B || K[37] !== F || K[38] !== c || K[39] !== z6) A6 = B4.createElement(u, null, h, C, B, m, F, U, c, n, z6), K[35] = h, K[36] = B, K[37] = F, K[38] = c, K[39] = z6, K[40] = A6;
    else A6 = K[40];
    let e;
    if (K[41] !== N || K[42] !== A6) e = B4.createElement(u, {
        flexDirection: "column",
        alignItems: "center",
        width: "100%"
    }, f, N, A6), K[41] = N, K[42] = A6, K[43] = e;
    else e = K[43];
    let i, O6;
    if (K[44] === Symbol.for("react.memo_cache_sentinel")) i = B4.createElement(u, {
        height: 2
    }), O6 = B4.createElement(T, {
        dimColor: !0
    }, "←/→ to change effort · Enter to confirm"), K[44] = i, K[45] = O6;
    else i = K[44], O6 = K[45];
    let J6;
    if (K[46] !== e) J6 = B4.createElement(u, {
        flexDirection: "column"
    }, G, e, i, O6), K[46] = e, K[47] = J6;
    else J6 = K[47];
    return J6
}
// @from(Ln 490573, Col 0)
function xoY(q) {
    return " ".repeat(RoY[q])
}
// @from(Ln 490577, Col 0)
function uoY(q) {
    return Math.min(J66.length - 1, q + 1)
}
// @from(Ln 490581, Col 0)
function moY(q) {
    return Math.max(0, q - 1)
}
// @from(Ln 490585, Col 0)
function BoY(q) {
    return q.effortValue
}
// @from(Ln 490588, Col 0)
async function poY(q, K, _) {
    if (_ = _?.trim() || "", VoY.includes(_)) {
        q(`Usage: /effort [low|medium|high|xhigh|max|auto]

Effort levels:
- low: Quick, straightforward implementation
- medium: Balanced approach with standard testing
- high: Comprehensive implementation with extensive testing
- xhigh: Extended reasoning with thorough analysis (Opus 4.7 only)
- max: Maximum capability with deepest reasoning (Opus 4.6/4.7 only)
- auto: Use the default effort level for your model`);
        return
    }
    if (_ === "current" || _ === "status") return B4.createElement(EoY, {
        onDone: q
    });
    if (!_) return B4.createElement(IoY, {
        onDone: q
    });
    let z = sj7(_);
    return B4.createElement(LoY, {
        result: z,
        onDone: q
    })
}
// @from(Ln 490613, Col 4)
B4
// @from(Ln 490613, Col 8)
VoY
// @from(Ln 490613, Col 13)
J66
// @from(Ln 490613, Col 18)
esK = 3
// @from(Ln 490614, Col 4)
qtK = 42
// @from(Ln 490615, Col 4)
hoY
// @from(Ln 490615, Col 9)
RoY
// @from(Ln 490615, Col 14)
SoY = "#d0b4ff"
// @from(Ln 490616, Col 4)
ztK = L(() => {
    o6();
    oy();
    g6();
    C8();
    N7();
    h1();
    hf();
    a1();
    NR();
    B4 = K6(P6(), 1), VoY = ["help", "-h", "--help"];
    J66 = [{
        value: "low",
        color: "warning"
    }, {
        value: "medium",
        color: "success"
    }, {
        value: "high",
        color: "permission"
    }, {
        value: "xhigh",
        color: "autoAccept-shimmer"
    }, {
        value: "max",
        color: "rainbow-animated"
    }], hoY = [1, 10, 20, 30, 40], RoY = [5, 5, 5, 6]
})
// @from(Ln 490644, Col 4)
YtK
// @from(Ln 490645, Col 4)
AtK = L(() => {
    Ko8();
    YtK = {
        type: "local-jsx",
        name: "effort",
        description: "Set effort level for model usage",
        argumentHint: "[low|medium|high|xhigh|max|auto]",
        get immediate() {
            return Pu6()
        },
        load: () => Promise.resolve().then(() => (ztK(), _tK))
    }
})
// @from(Ln 490658, Col 4)
FoY
// @from(Ln 490658, Col 9)
OtK
// @from(Ln 490659, Col 4)
wtK = L(() => {
    h1();
    nO();
    FoY = {
        type: "local-jsx",
        name: "focus",
        description: "Toggle focus view (show only your prompt, a tool summary, and the final response)",
        isEnabled: lq,
        immediate: !0,
        load: () => Promise.resolve({
            async call(q, K) {
                let _ = !K.getAppState().briefTranscript;
                if (K.setAppState((z) => z.briefTranscript === _ ? z : {
                        ...z,
                        briefTranscript: _
                    }), H8().briefTranscript !== _) d8((z) => ({
                    ...z,
                    briefTranscript: _
                }));
                return q(_ ? "Focus view enabled" : "Focus view disabled", {
                    display: "system"
                }), null
            }
        })
    }, OtK = FoY
})
// @from(Ln 490685, Col 4)
$tK = {}
// @from(Ln 490689, Col 4)
tj7
// @from(Ln 490689, Col 9)
goY = async (q, K) => {
    return tj7.createElement(b_6, {
        onClose: q,
        context: K,
        defaultTab: "Stats"
    })
}
// @from(Ln 490696, Col 4)
jtK = L(() => {
    a98();
    tj7 = K6(P6(), 1)
})
// @from(Ln 490700, Col 4)
UoY
// @from(Ln 490700, Col 9)
ej7
// @from(Ln 490701, Col 4)
HtK = L(() => {
    UoY = {
        type: "local-jsx",
        name: "stats",
        description: "Show your Claude Code usage statistics and activity",
        load: () => Promise.resolve().then(() => (jtK(), $tK))
    }, ej7 = UoY
})
// @from(Ln 490709, Col 4)
JtK
// @from(Ln 490710, Col 4)
XtK = L(() => {
    JtK = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 490717, Col 4)
MtK
// @from(Ln 490718, Col 4)
PtK = L(() => {
    MtK = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 490726, Col 0)
function y_(q) {
    return q.userFacingName?.() ?? q.name
}
// @from(Ln 490730, Col 0)
function X66(q) {
    return q.isEnabled?.() ?? !0
}
// @from(Ln 490733, Col 4)
DtK = {}
// @from(Ln 490738, Col 0)
function coY() {
    let q = u8("tengu_kairos_brief_config", WtK),
        K = doY().safeParse(q);
    return K.success ? K.data : WtK
}
// @from(Ln 490743, Col 4)
doY
// @from(Ln 490743, Col 9)
WtK
// @from(Ln 490743, Col 14)
loY
// @from(Ln 490743, Col 19)
noY
// @from(Ln 490744, Col 4)
ZtK = L(() => {
    p7();
    y8();
    B1();
    C8();
    vh();
    rF();
    doY = C6(() => y.object({
        enable_slash_command: y.boolean()
    })), WtK = {
        enable_slash_command: !1
    };
    loY = {
        type: "local-jsx",
        name: "brief",
        description: "Toggle brief-only mode",
        isEnabled: () => {
            return coY().enable_slash_command
        },
        immediate: !0,
        load: () => Promise.resolve({
            async call(q, K) {
                let z = !K.getAppState().isBriefOnly;
                if (z && !aQ8()) return d("tengu_brief_mode_toggled", {
                    enabled: !1,
                    gated: !0,
                    source: "slash_command"
                }), q("Brief tool is not enabled for your account", {
                    display: "system"
                }), null;
                dg(z), K.setAppState((A) => {
                    if (A.isBriefOnly === z) return A;
                    return {
                        ...A,
                        isBriefOnly: z
                    }
                }), d("tengu_brief_mode_toggled", {
                    enabled: z,
                    gated: !1,
                    source: "slash_command"
                });
                let Y = aG() ? void 0 : [`<system-reminder>
${z?`Brief mode is now enabled. Use the ${U16} tool for all user-facing output — plain text outside it is hidden from the user's view.`:`Brief mode is now disabled. The ${U16} tool is no longer available — reply with plain text.`}
</system-reminder>`];
                return q(z ? "Brief-only mode enabled" : "Brief-only mode disabled", {
                    display: "system",
                    metaMessages: Y
                }), null
            }
        })
    }, noY = loY
})
// @from(Ln 490796, Col 4)
ftK = {}
// @from(Ln 490803, Col 0)
async function Yz8() {
    let q = await Ek8("tengu_bridge_repl_v2_config", qH7),
        K = ioY().safeParse(q);
    return K.success ? K.data : qH7
}
// @from(Ln 490808, Col 0)
async function Az8() {
    let q = await Yz8();
    if (q.min_version && Qa({
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION, q.min_version)) return `Your version of Claude Code (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION}) is too old for Remote Control.
Version ${q.min_version} or higher is required. Run \`claude update\` to update.`;
    return null
}
// @from(Ln 490821, Col 0)
async function roY() {
    return (await Yz8()).should_show_app_upgrade_message
}
// @from(Ln 490824, Col 4)
qH7
// @from(Ln 490824, Col 9)
ioY
// @from(Ln 490825, Col 4)
Oz8 = L(() => {
    p7();
    B1();
    qH7 = {
        init_retry_max_attempts: 3,
        init_retry_base_delay_ms: 500,
        init_retry_jitter_fraction: 0.25,
        init_retry_max_delay_ms: 4000,
        http_timeout_ms: 1e4,
        uuid_dedup_buffer_size: 2000,
        heartbeat_interval_ms: 20000,
        heartbeat_jitter_fraction: 0.1,
        token_refresh_buffer_ms: 300000,
        teardown_archive_timeout_ms: 1500,
        connect_timeout_ms: 15000,
        min_version: "0.0.0",
        should_show_app_upgrade_message: !1
    }, ioY = C6(() => y.object({
        init_retry_max_attempts: y.number().int().min(1).max(10).default(3),
        init_retry_base_delay_ms: y.number().int().min(100).default(500),
        init_retry_jitter_fraction: y.number().min(0).max(1).default(0.25),
        init_retry_max_delay_ms: y.number().int().min(500).default(4000),
        http_timeout_ms: y.number().int().min(2000).default(1e4),
        uuid_dedup_buffer_size: y.number().int().min(100).max(50000).default(2000),
        heartbeat_interval_ms: y.number().int().min(5000).max(30000).default(20000),
        heartbeat_jitter_fraction: y.number().min(0).max(0.5).default(0.1),
        token_refresh_buffer_ms: y.number().int().min(30000).max(1800000).default(300000),
        teardown_archive_timeout_ms: y.number().int().min(500).max(2000).default(1500),
        connect_timeout_ms: y.number().int().min(5000).max(60000).default(15000),
        min_version: y.string().refine((q) => {
            try {
                return Qa(q, "0.0.0"), !0
            } catch {
                return !1
            }
        }).default("0.0.0"),
        should_show_app_upgrade_message: y.boolean().default(!1)
    }))
})
// @from(Ln 490865, Col 0)
function GtK({
    onDone: q
}) {
    let K = cT.useRef(q);
    K.current = q;
    let _ = cT.useCallback(() => {
        K.current("dismiss")
    }, []);
    cT.useEffect(() => {
        d8((A) => {
            if (A.remoteDialogSeen) return A;
            return {
                ...A,
                remoteDialogSeen: !0
            }
        })
    }, []);
    let z = cT.useCallback((A) => {
        K.current(A)
    }, []);
    return cT.default.createElement(IY, {
        title: "Remote Control"
    }, cT.default.createElement(u, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, cT.default.createElement(u, {
        marginBottom: 1,
        flexDirection: "column"
    }, cT.default.createElement(T, null, "Remote Control lets you access this CLI session from the web (claude.ai/code) or the Claude app, so you can pick up where you left off on any device."), cT.default.createElement(T, null, " "), cT.default.createElement(T, null, "You can disconnect remote access anytime by running /remote-control again.")), cT.default.createElement(u, null, cT.default.createElement(A1, {
        options: [{
            label: "Enable Remote Control for this session",
            description: "Opens a secure connection to claude.ai.",
            value: "enable"
        }, {
            label: "Never mind",
            description: "You can always enable it later with /remote-control.",
            value: "dismiss"
        }],
        onChange: z,
        onCancel: _
    }))))
}
// @from(Ln 490909, Col 0)
function vtK() {
    if (H8().remoteDialogSeen) return !1;
    if (!mx()) return !1;
    if (!o7()?.accessToken) return !1;
    return !0
}
// @from(Ln 490915, Col 4)
cT
// @from(Ln 490916, Col 4)
KH7 = L(() => {
    aR();
    g6();
    T7();
    h1();
    gK();
    pD();
    cT = K6(P6(), 1)
})
// @from(Ln 490925, Col 4)
TtK = {}
// @from(Ln 490930, Col 0)
function ooY(q) {
    let K = s(10),
        {
            onDone: _,
            name: z
        } = q,
        Y = R7(),
        A = M8(toY),
        O = M8(soY),
        w = M8(aoY),
        [$, j] = Hz6.useState(!1),
        H;
    if (K[0] !== z || K[1] !== _ || K[2] !== A || K[3] !== O || K[4] !== w || K[5] !== Y) H = () => {
        if ((A || O) && !w) {
            j(!0);
            return
        }
        let X = !1;
        return (async () => {
            let M = await jaY();
            if (X) return;
            if (M) {
                d("tengu_bridge_command", {
                    action: "preflight_failed"
                }), _(M, {
                    display: "system"
                });
                return
            }
            if (vtK()) {
                Y((P) => {
                    if (P.showRemoteCallout) return P;
                    return {
                        ...P,
                        showRemoteCallout: !0,
                        replBridgeInitialName: z
                    }
                }), _("", {
                    display: "system"
                });
                return
            }
            d("tengu_bridge_command", {
                action: "connect"
            }), Y((P) => {
                if (P.replBridgeEnabled && !P.replBridgeOutboundOnly) return P;
                return {
                    ...P,
                    replBridgeEnabled: !0,
                    replBridgeExplicit: !0,
                    replBridgeOutboundOnly: !1,
                    replBridgeInitialName: z
                }
            }), _("Remote Control connecting…", {
                display: "system"
            })
        })(), () => {
            X = !0
        }
    }, K[0] = z, K[1] = _, K[2] = A, K[3] = O, K[4] = w, K[5] = Y, K[6] = H;
    else H = K[6];
    let J;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) J = [], K[7] = J;
    else J = K[7];
    if (Hz6.useEffect(H, J), $) {
        let X;
        if (K[8] !== _) X = lz.createElement(eoY, {
            onDone: _
        }), K[8] = _, K[9] = X;
        else X = K[9];
        return X
    }
    return null
}
// @from(Ln 491005, Col 0)
function aoY(q) {
    return q.replBridgeOutboundOnly
}
// @from(Ln 491009, Col 0)
function soY(q) {
    return q.replBridgeEnabled
}
// @from(Ln 491013, Col 0)
function toY(q) {
    return q.replBridgeConnected
}
// @from(Ln 491017, Col 0)
function eoY(q) {
    let K = s(61),
        {
            onDone: _
        } = q;
    A2("bridge-disconnect-dialog");
    let z = R7(),
        Y = M8($aY),
        A = M8(waY),
        O = M8(OaY),
        [w, $] = Hz6.useState(2),
        [j, H] = Hz6.useState(!1),
        [J, X] = Hz6.useState(""),
        M = O ? Y : A,
        P, W;
    if (K[0] !== M || K[1] !== j) P = () => {
        if (!j || !M) {
            X("");
            return
        }
        yu(M, {
            type: "utf8",
            errorCorrectionLevel: "L",
            small: !0
        }).then(X).catch(() => X(""))
    }, W = [j, M], K[0] = M, K[1] = j, K[2] = P, K[3] = W;
    else P = K[2], W = K[3];
    Hz6.useEffect(P, W);
    let D;
    if (K[4] !== _ || K[5] !== z) D = function() {
        z(AaY), d("tengu_bridge_command", {
            action: "disconnect"
        }), _(Q_8, {
            display: "system"
        })
    }, K[4] = _, K[5] = z, K[6] = D;
    else D = K[6];
    let Z = D,
        G;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) G = function() {
        H(YaY)
    }, K[7] = G;
    else G = K[7];
    let f = G,
        v;
    if (K[8] !== _) v = function() {
        _(void 0, {
            display: "skip"
        })
    }, K[8] = _, K[9] = v;
    else v = K[9];
    let V = v,
        k, N;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) k = () => $(zaY), N = () => $(_aY), K[10] = k, K[11] = N;
    else k = K[10], N = K[11];
    let R;
    if (K[12] !== w || K[13] !== V || K[14] !== Z) R = {
        "select:next": k,
        "select:previous": N,
        "select:accept": () => {
            if (w === 0) Z();
            else if (w === 1) f();
            else V()
        }
    }, K[12] = w, K[13] = V, K[14] = Z, K[15] = R;
    else R = K[15];
    let h;
    if (K[16] === Symbol.for("react.memo_cache_sentinel")) h = {
        context: "Select"
    }, K[16] = h;
    else h = K[16];
    L7(R, h);
    let C, x, B, m, S, F, U, g, c;
    if (K[17] !== M || K[18] !== V || K[19] !== J || K[20] !== j) {
        let t = J ? J.split(`
`).filter(KaY) : [];
        x = R1, U = "Remote Control", g = V, c = !0, C = u, B = "column", m = 1;
        let Y6 = M ? ` at ${M}` : "";
        if (K[30] !== Y6) S = lz.createElement(T, null, "This session is available via Remote Control", Y6, "."), K[30] = Y6, K[31] = S;
        else S = K[31];
        F = j && t.length > 0 && lz.createElement(u, {
            flexDirection: "column"
        }, t.map(qaY)), K[17] = M, K[18] = V, K[19] = J, K[20] = j, K[21] = C, K[22] = x, K[23] = B, K[24] = m, K[25] = S, K[26] = F, K[27] = U, K[28] = g, K[29] = c
    } else C = K[21], x = K[22], B = K[23], m = K[24], S = K[25], F = K[26], U = K[27], g = K[28], c = K[29];
    let n = w === 0,
        l;
    if (K[32] === Symbol.for("react.memo_cache_sentinel")) l = lz.createElement(T, null, "Disconnect this session"), K[32] = l;
    else l = K[32];
    let z6;
    if (K[33] !== n) z6 = lz.createElement(TR, {
        isFocused: n
    }, l), K[33] = n, K[34] = z6;
    else z6 = K[34];
    let A6 = w === 1,
        e = j ? "Hide QR code" : "Show QR code",
        i;
    if (K[35] !== e) i = lz.createElement(T, null, e), K[35] = e, K[36] = i;
    else i = K[36];
    let O6;
    if (K[37] !== A6 || K[38] !== i) O6 = lz.createElement(TR, {
        isFocused: A6
    }, i), K[37] = A6, K[38] = i, K[39] = O6;
    else O6 = K[39];
    let J6 = w === 2,
        $6;
    if (K[40] === Symbol.for("react.memo_cache_sentinel")) $6 = lz.createElement(T, null, "Continue"), K[40] = $6;
    else $6 = K[40];
    let H6;
    if (K[41] !== J6) H6 = lz.createElement(TR, {
        isFocused: J6
    }, $6), K[41] = J6, K[42] = H6;
    else H6 = K[42];
    let q6;
    if (K[43] !== z6 || K[44] !== O6 || K[45] !== H6) q6 = lz.createElement(u, {
        flexDirection: "column"
    }, z6, O6, H6), K[43] = z6, K[44] = O6, K[45] = H6, K[46] = q6;
    else q6 = K[46];
    let o;
    if (K[47] === Symbol.for("react.memo_cache_sentinel")) o = lz.createElement(T, {
        dimColor: !0
    }, lz.createElement(z1, null, lz.createElement(A8, {
        chord: "enter",
        action: "select"
    }), lz.createElement(A8, {
        chord: "escape",
        action: "continue"
    }))), K[47] = o;
    else o = K[47];
    let _6;
    if (K[48] !== C || K[49] !== B || K[50] !== m || K[51] !== S || K[52] !== F || K[53] !== q6) _6 = lz.createElement(C, {
        flexDirection: B,
        gap: m
    }, S, F, q6, o), K[48] = C, K[49] = B, K[50] = m, K[51] = S, K[52] = F, K[53] = q6, K[54] = _6;
    else _6 = K[54];
    let r;
    if (K[55] !== x || K[56] !== U || K[57] !== g || K[58] !== c || K[59] !== _6) r = lz.createElement(x, {
        title: U,
        onCancel: g,
        hideInputGuide: c
    }, _6), K[55] = x, K[56] = U, K[57] = g, K[58] = c, K[59] = _6, K[60] = r;
    else r = K[60];
    return r
}
// @from(Ln 491161, Col 0)
function qaY(q, K) {
    return lz.createElement(T, {
        key: K
    }, q)
}
// @from(Ln 491167, Col 0)
function KaY(q) {
    return q.length > 0
}
// @from(Ln 491171, Col 0)
function _aY(q) {
    return (q - 1 + 3) % 3
}
// @from(Ln 491175, Col 0)
function zaY(q) {
    return (q + 1) % 3
}
// @from(Ln 491179, Col 0)
function YaY(q) {
    return !q
}
// @from(Ln 491183, Col 0)
function AaY(q) {
    if (!q.replBridgeEnabled) return q;
    return {
        ...q,
        replBridgeEnabled: !1,
        replBridgeExplicit: !1,
        replBridgeOutboundOnly: !1
    }
}
// @from(Ln 491193, Col 0)
function OaY(q) {
    return q.replBridgeSessionActive
}
// @from(Ln 491197, Col 0)
function waY(q) {
    return q.replBridgeConnectUrl
}
// @from(Ln 491201, Col 0)
function $aY(q) {
    return q.replBridgeSessionUrl
}
// @from(Ln 491204, Col 0)
async function jaY() {
    let {
        waitForPolicyLimitsToLoad: q,
        isPolicyAllowed: K
    } = await Promise.resolve().then(() => (J2(), Du8));
    if (await q(), !K("allow_remote_control")) return "Remote Control is disabled by your organization's policy.";
    let _ = await Uo1();
    if (_) return _;
    let z = await Az8();
    if (z) return z;
    if (!DS()) return Ou6;
    return E("[bridge] Prerequisites passed, enabling bridge"), null
}
// @from(Ln 491217, Col 0)
async function HaY(q, K, _) {
    let z = _.trim() || void 0;
    return lz.createElement(ooY, {
        onDone: q,
        name: z
    })
}
// @from(Ln 491224, Col 4)
lz
// @from(Ln 491224, Col 8)
Hz6
// @from(Ln 491225, Col 4)
VtK = L(() => {
    o6();
    lx6();
    qn();
    aR();
    Oz8();
    Nq();
    S4();
    u7();
    xE6();
    KH7();
    CP();
    g6();
    C7();
    C8();
    N7();
    K8();
    lz = K6(P6(), 1), Hz6 = K6(P6(), 1)
})
// @from(Ln 491244, Col 4)
ktK = {}
// @from(Ln 491248, Col 4)
JaY
// @from(Ln 491248, Col 9)
XaY
// @from(Ln 491249, Col 4)
NtK = L(() => {
    aR();
    JaY = {
        type: "local-jsx",
        name: "remote-control",
        aliases: ["rc"],
        description: "Connect this terminal for remote-control sessions",
        argumentHint: "[name]",
        isEnabled: mx,
        get isHidden() {
            return !mx()
        },
        immediate: !0,
        load: () => Promise.resolve().then(() => (VtK(), TtK))
    }, XaY = JaY
})
// @from(Ln 491269, Col 0)
function LtK(q) {
    return q.replace(/([a-z])([A-Z])/g, "$1 $2").split(/[-_./\s]+/).map((K) => K.trim()).filter((K) => K.length > 2 && K.length <= 20)
}
// @from(Ln 491273, Col 0)
function PaY(q) {
    let K = ytK(q).replace(/\.[^.]+$/, "");
    return LtK(K)
}
// @from(Ln 491277, Col 0)
async function _H7(q) {
    let K = new Set(MaY);
    try {
        let _ = c9();
        if (_) {
            let z = ytK(_);
            if (z.length > 2 && z.length <= 50) K.add(z)
        }
    } catch {}
    try {
        let _ = await rj();
        if (_)
            for (let z of LtK(_)) K.add(z)
    } catch {}
    if (q)
        for (let _ of q) {
            if (K.size >= EtK) break;
            for (let z of PaY(_)) K.add(z)
        }
    return [...K].slice(0, EtK)
}
// @from(Ln 491298, Col 4)
MaY
// @from(Ln 491298, Col 9)
EtK = 50
// @from(Ln 491299, Col 4)
htK = L(() => {
    y8();
    pK();
    MaY = ["MCP", "symlink", "grep", "regex", "localhost", "codebase", "TypeScript", "JSON", "OAuth", "webhook", "gRPC", "dotfiles", "subagent", "worktree"]
})
// @from(Ln 491304, Col 4)
CtK = {}
// @from(Ln 491312, Col 0)
function wz8(q) {
    if (!q) return {
        code: zH7
    };
    let K = q.toLowerCase().trim();
    if (!K) return {
        code: zH7
    };
    if (RtK.has(K)) return {
        code: K
    };
    let _ = WaY[K];
    if (_) return {
        code: _
    };
    let z = i5(K, "-");
    if (z && RtK.has(z)) return {
        code: z
    };
    return {
        code: zH7,
        fellBackFrom: q
    }
}
// @from(Ln 491337, Col 0)
function StK(q) {
    let K = q.length >> 1;
    if (K === 0) return 0;
    let _ = 0;
    for (let A = 0; A < q.length - 1; A += 2) {
        let O = (q[A] | q[A + 1] << 8) << 16 >> 16;
        _ += O * O
    }
    let z = Math.sqrt(_ / K),
        Y = Math.min(z / 2000, 1);
    return Math.sqrt(Y)
}
// @from(Ln 491350, Col 0)
function vaY({
    onTranscript: q,
    onError: K,
    enabled: _,
    focusMode: z,
    mode: Y = "hold"
}) {
    let [A, O] = HY.useState("idle"), w = HY.useRef("idle"), $ = HY.useRef(null), j = HY.useRef(""), H = HY.useRef(q), J = HY.useRef(K), X = HY.useRef(null), M = HY.useRef(null), P = HY.useRef(!1), W = HY.useRef(null), D = HY.useRef(!1), Z = HY.useRef(!1), G = HY.useRef(null), f = HY.useRef(null), v = HY.useRef(null), V = HY.useRef(!1), k = HY.useRef(0), N = HY.useRef(0), R = HY.useRef(!1), h = HY.useRef([]), C = HY.useRef(!1), x = HY.useRef(0), B = HY.useRef(0), m = HY.useRef(!1), S = HY.useRef(!1), F = HY.useRef([]), U = K2(), g = js6();
    H.current = q, J.current = K;

    function c($6) {
        w.current = $6, O($6), g((H6) => {
            if (H6.voiceState === $6) return H6;
            return {
                ...H6,
                voiceState: $6
            }
        })
    }
    let n = HY.useCallback(() => {
        if (N.current++, X.current) clearTimeout(X.current), X.current = null;
        if (M.current) clearTimeout(M.current), M.current = null;
        if (W.current) clearTimeout(W.current), W.current = null;
        if (G.current) clearTimeout(G.current), G.current = null;
        if (f.current) clearTimeout(f.current), f.current = null;
        if (v.current) clearTimeout(v.current), v.current = null;
        if (V.current = !1, Z.current = !1, M66?.stopRecording(), $.current) $.current.close(), $.current = null;
        j.current = "", F.current = [], h.current = [], g(($6) => {
            if ($6.voiceInterimTranscript === "" && !$6.voiceAudioLevels.length) return $6;
            return {
                ...$6,
                voiceInterimTranscript: "",
                voiceAudioLevels: []
            }
        })
    }, [g]);

    function l() {
        E("[voice] finishRecording: stopping recording, transitioning to processing"), x.current++;
        let $6 = D.current;
        if (D.current = !1, Z.current = !1, f.current) clearTimeout(f.current), f.current = null;
        if (v.current) clearTimeout(v.current), v.current = null;
        c("processing"), M66?.stopRecording();
        let H6 = Date.now() - k.current,
            q6 = m.current,
            o = R.current,
            _6 = B.current,
            r = S.current,
            t = N.current,
            Y6 = () => N.current !== t;
        E("[voice] Recording stopped"), ($.current ? $.current.finalize() : Promise.resolve(void 0)).then(async (M6) => {
            if (Y6()) return;
            if (M6 === "no_data_timeout" && q6 && r && !$6 && _6 === 0 && j.current.trim() === "" && !C.current && h.current.length > 0) {
                if (C.current = !0, E(`[voice] Silent-drop detected (no_data_timeout, ${String(h.current.length)} chunks); replaying on fresh connection`), d("tengu_voice_silent_drop_replay", {
                        recordingDurationMs: H6,
                        chunkCount: h.current.length
                    }), $.current) $.current.close(), $.current = null;
                let V6 = h.current;
                if (await l7(250), Y6()) return;
                let f6 = wz8(v7().language),
                    G6 = await _H7();
                if (Y6()) return;
                if (await new Promise((k6) => {
                        Ed8({
                            onTranscript: (T6, v6) => {
                                if (Y6()) return;
                                if (v6 && T6.trim()) {
                                    if (j.current) j.current += " ";
                                    j.current += T6.trim()
                                }
                            },
                            onError: () => k6(),
                            onClose: () => {},
                            onReady: (T6) => {
                                if (Y6()) {
                                    T6.close(), k6();
                                    return
                                }
                                $.current = T6;
                                let v6 = 32000,
                                    L6 = [],
                                    y6 = 0;
                                for (let c6 of V6) {
                                    if (y6 > 0 && y6 + c6.length > v6) T6.send(Buffer.concat(L6)), L6 = [], y6 = 0;
                                    L6.push(c6), y6 += c6.length
                                }
                                if (L6.length) T6.send(Buffer.concat(L6));
                                T6.finalize().then(() => {
                                    T6.close(), k6()
                                })
                            }
                        }, {
                            language: f6.code,
                            keyterms: G6
                        }).then((T6) => {
                            if (!T6) k6()
                        }, () => k6())
                    }), Y6()) return
            }
            h.current = [];
            let W6 = j.current.trim();
            if (E(`[voice] Final transcript assembled (${String(W6.length)} chars): "${W6.slice(0,200)}"`), d("tengu_voice_recording_completed", {
                    transcriptChars: W6.length + _6,
                    recordingDurationMs: H6,
                    hadAudioSignal: q6,
                    retried: o,
                    silentDropRetried: C.current,
                    wsConnected: r,
                    focusTriggered: $6
                }), $.current) $.current.close(), $.current = null;
            if (W6) E(`[voice] Injecting transcript (${String(W6.length)} chars)`), H.current(W6);
            else if (_6 === 0 && H6 > 2000)
                if (!r) J.current?.("Voice connection failed. Check your network and try again.");
                else if (!q6) J.current?.("No audio detected from microphone. Check that the correct input device is selected and that Claude Code has microphone access.");
            else J.current?.("No speech detected.");
            j.current = "", g((V6) => {
                if (V6.voiceInterimTranscript === "") return V6;
                return {
                    ...V6,
                    voiceInterimTranscript: ""
                }
            }), c("idle")
        }).catch((M6) => {
            if (j6(r1(M6)), !Y6()) c("idle")
        })
    }
    HY.useEffect(() => {
        if (_ && !M66) Promise.resolve().then(() => (JI6(), HI6)).then(($6) => {
            M66 = $6
        })
    }, [_]);

    function z6() {
        if (G.current) clearTimeout(G.current);
        G.current = setTimeout(($6, H6, q6, o, _6) => {
            if ($6.current = null, H6.current === "recording" && q6.current) E("[voice] Focus silence timeout — tearing down session"), o.current = !0, _6()
        }, faY, G, w, D, V, l)
    }

    function A6() {}

    function e() {}
    HY.useEffect(() => {
        if (!_ || !z) {
            if (D.current && w.current === "recording") E("[voice] Focus mode disabled during recording, finishing"), l();
            return
        }
        let $6 = !1;
        if (U && w.current === "idle" && !V.current) {
            let H6 = () => {
                if ($6 || w.current !== "idle" || V.current) return;
                E("[voice] Focus gained, starting recording session"), D.current = !0, i(), z6()
            };
            if (M66) H6();
            else Promise.resolve().then(() => (JI6(), HI6)).then((q6) => {
                M66 = q6, H6()
            })
        } else if (!U) {
            if (V.current = !1, w.current === "recording") E("[voice] Focus lost, finishing recording"), l()
        }
        return () => {
            $6 = !0
        }
    }, [_, z, U]);
    async function i() {
        if (!M66) {
            J.current?.("Voice module not loaded yet. Try again in a moment.");
            return
        }
        c("recording"), k.current = Date.now(), j.current = "", P.current = !1, m.current = !1, R.current = !1, C.current = !1, h.current = [], B.current = 0, S.current = !1;
        let $6 = ++N.current,
            H6 = await M66.checkRecordingAvailability();
        if (!H6.available) {
            E(`[voice] Recording not available: ${H6.reason??"unknown"}`), J.current?.(H6.reason ?? "Audio recording is not available."), n(), c("idle");
            return
        }
        E("[voice] Starting recording session, connecting voice stream"), g((M6) => {
            if (!M6.voiceError) return M6;
            return {
                ...M6,
                voiceError: null
            }
        });
        let q6 = [];
        if (E("[voice] startRecording: buffering audio while WebSocket connects"), F.current = [], !await M66.startRecording((M6) => {
                let W6 = Buffer.from(M6);
                if (!D.current) h.current.push(W6);
                if ($.current) $.current.send(W6);
                else q6.push(W6);
                let V6 = StK(M6);
                if (!m.current && V6 > 0.01) m.current = !0;
                let f6 = F.current;
                if (f6.length >= GaY) f6.shift();
                f6.push(V6);
                let G6 = [...f6];
                F.current = G6, g((k6) => ({
                    ...k6,
                    voiceAudioLevels: G6
                }))
            }, () => {
                if (w.current === "recording") l()
            }, {
                silenceDetection: !1
            })) {
            j6(Error("[voice] Recording failed — no audio tool found")), J.current?.("Failed to start audio capture. Check that your microphone is accessible."), n(), c("idle"), g((M6) => ({
                ...M6,
                voiceError: "Recording failed — no audio tool found"
            }));
            return
        }
        let _6 = v7().language,
            r = wz8(_6);
        d("tengu_voice_recording_started", {
            focusTriggered: D.current,
            sttLanguage: r.code,
            sttLanguageIsDefault: !_6?.trim(),
            sttLanguageFellBack: r.fellBackFrom !== void 0,
            systemLocaleLanguage: PT7()
        });
        let t = !1,
            Y6 = () => N.current !== $6,
            X6 = (M6) => {
                let W6 = x.current;
                Ed8({
                    onTranscript: (V6, f6) => {
                        if (Y6()) return;
                        if (t = !0, E(`[voice] onTranscript: isFinal=${String(f6)} text="${V6}"`), f6 && V6.trim())
                            if (D.current) E(`[voice] Focus mode: flushing final transcript immediately: "${V6.trim()}"`), H.current(V6.trim()), B.current += V6.trim().length, g((G6) => {
                                if (G6.voiceInterimTranscript === "") return G6;
                                return {
                                    ...G6,
                                    voiceInterimTranscript: ""
                                }
                            }), j.current = "", z6();
                            else {
                                if (j.current) j.current += " ";
                                j.current += V6.trim(), E(`[voice] Accumulated final transcript: "${j.current}"`), g((G6) => {
                                    let k6 = j.current;
                                    if (G6.voiceInterimTranscript === k6) return G6;
                                    return {
                                        ...G6,
                                        voiceInterimTranscript: k6
                                    }
                                })
                            }
                        else if (!f6) {
                            if (D.current) z6();
                            let G6 = V6.trim(),
                                k6 = j.current ? j.current + (G6 ? " " + G6 : "") : G6;
                            g((T6) => {
                                if (T6.voiceInterimTranscript === k6) return T6;
                                return {
                                    ...T6,
                                    voiceInterimTranscript: k6
                                }
                            })
                        }
                    },
                    onError: (V6, f6) => {
                        if (Y6()) {
                            E(`[voice] ignoring onError from stale session: ${V6}`);
                            return
                        }
                        if (x.current !== W6) {
                            E(`[voice] ignoring stale onError from superseded attempt: ${V6}`);
                            return
                        }
                        if (!f6?.fatal && !t && w.current === "recording") {
                            if (!R.current) {
                                R.current = !0, E(`[voice] early voice_stream error (pre-transcript), retrying once: ${V6}`), d("tengu_voice_stream_early_retry", {}), $.current = null, x.current++, setTimeout((G6, k6, T6) => {
                                    if (G6.current === "recording") k6(T6)
                                }, 250, w, X6, M6);
                                return
                            }
                        }
                        x.current++, j6(Error(`[voice] voice_stream error: ${V6}`)), J.current?.(`Voice stream error: ${V6}`), q6.length = 0, D.current = !1, n(), c("idle")
                    },
                    onClose: () => {},
                    onReady: (V6) => {
                        if (Y6() || w.current !== "recording") {
                            V6.close();
                            return
                        }
                        $.current = V6, S.current = !0;
                        let f6 = 32000;
                        if (q6.length > 0) {
                            let G6 = 0;
                            for (let v6 of q6) G6 += v6.length;
                            let k6 = [
                                    []
                                ],
                                T6 = 0;
                            for (let v6 of q6) {
                                if (T6 > 0 && T6 + v6.length > f6) k6.push([]), T6 = 0;
                                k6.at(-1).push(v6), T6 += v6.length
                            }
                            E(`[voice] onReady: flushing ${String(q6.length)} buffered chunks (${String(G6)} bytes) as ${String(k6.length)} coalesced frame(s)`);
                            for (let v6 of k6) V6.send(Buffer.concat(v6))
                        }
                        if (q6.length = 0, M.current) clearTimeout(M.current);
                        if (P.current) M.current = setTimeout((G6, k6, T6) => {
                            if (G6.current = null, k6.current === "recording") T6()
                        }, YH7, M, w, l)
                    }
                }, {
                    language: r.code,
                    keyterms: M6
                }).then((V6) => {
                    if (Y6()) {
                        V6?.close();
                        return
                    }
                    if (!V6) {
                        E("[voice] Failed to connect to voice_stream (no OAuth token?)"), J.current?.("Voice mode requires a Claude.ai account. Please run /login to sign in."), q6.length = 0, n(), c("idle");
                        return
                    }
                    if (w.current !== "recording") {
                        q6.length = 0, V6.close();
                        return
                    }
                })
            };
        _H7().then(X6)
    }
    let O6 = HY.useCallback(($6 = DaY) => {
        if (!_ || !h37()) return;
        if (D.current) return;
        if (z && V.current) {
            E("[voice] Re-arming focus recording after silence timeout"), V.current = !1, D.current = !0, i(), z6();
            return
        }
        let H6 = w.current;
        if (H6 === "processing") return;
        if (H6 === "idle") E("[voice] handleKeyEvent: idle, starting recording session immediately"), i(), W.current = setTimeout((q6, o, _6, r, t) => {
            if (q6.current = null, o.current === "recording" && !_6.current) E("[voice] No auto-repeat seen, arming release timer via fallback"), _6.current = !0, r.current = setTimeout((Y6, X6, M6) => {
                if (Y6.current = null, X6.current === "recording") M6()
            }, YH7, r, o, t)
        }, $6, W, w, P, M, l);
        else if (H6 === "recording") {
            if (P.current = !0, W.current) clearTimeout(W.current), W.current = null
        }
        if (M.current) clearTimeout(M.current);
        if (w.current === "recording" && P.current) M.current = setTimeout((q6, o, _6) => {
            if (q6.current = null, o.current === "recording") _6()
        }, YH7, M, w, l)
    }, [_, z, Y, n]);
    HY.useEffect(() => {
        if (!_ && w.current !== "idle") n(), c("idle");
        return () => {
            n()
        }
    }, [_, n]);
    let J6 = HY.useCallback(() => {
        if (w.current === "idle") return;
        E("[voice] cancelRecording: discarding without submit"), n(), c("idle")
    }, [n]);
    return {
        state: A,
        handleKeyEvent: O6,
        cancelRecording: J6
    }
}
// @from(Ln 491712, Col 4)
HY
// @from(Ln 491712, Col 8)
zH7 = "en"
// @from(Ln 491713, Col 4)
WaY
// @from(Ln 491713, Col 9)
RtK
// @from(Ln 491713, Col 14)
M66 = null
// @from(Ln 491714, Col 4)
YH7 = 200
// @from(Ln 491715, Col 4)
DaY = 600
// @from(Ln 491716, Col 4)
ZaY = 2000
// @from(Ln 491717, Col 4)
faY = 5000
// @from(Ln 491718, Col 4)
GaY = 16
// @from(Ln 491719, Col 4)
AH7 = L(() => {
    B$6();
    ea6();
    C8();
    htK();
    yd8();
    K8();
    m8();
    IZ();
    U8();
    a1();
    HY = K6(P6(), 1), WaY = {
        english: "en",
        spanish: "es",
        español: "es",
        espanol: "es",
        french: "fr",
        français: "fr",
        francais: "fr",
        japanese: "ja",
        日本語: "ja",
        german: "de",
        deutsch: "de",
        portuguese: "pt",
        português: "pt",
        portugues: "pt",
        italian: "it",
        italiano: "it",
        korean: "ko",
        한국어: "ko",
        hindi: "hi",
        हिन्दी: "hi",
        हिंदी: "hi",
        indonesian: "id",
        "bahasa indonesia": "id",
        bahasa: "id",
        russian: "ru",
        русский: "ru",
        polish: "pl",
        polski: "pl",
        turkish: "tr",
        türkçe: "tr",
        turkce: "tr",
        dutch: "nl",
        nederlands: "nl",
        ukrainian: "uk",
        українська: "uk",
        greek: "el",
        ελληνικά: "el",
        czech: "cs",
        čeština: "cs",
        cestina: "cs",
        danish: "da",
        dansk: "da",
        swedish: "sv",
        svenska: "sv",
        norwegian: "no",
        norsk: "no"
    }, RtK = new Set(["en", "es", "fr", "ja", "de", "pt", "it", "ko", "hi", "id", "ru", "pl", "tr", "nl", "uk", "el", "cs", "da", "sv", "no"])
})
// @from(Ln 491779, Col 4)
ItK = {}
// @from(Ln 491784, Col 0)
function VaY(q) {
    return
}
// @from(Ln 491787, Col 4)
TaY = 2
// @from(Ln 491788, Col 4)
kaY = async (q) => {
        if (!SM6()) {
            if (!jX()) return {
                type: "text",
                value: "Voice mode requires a Claude.ai account. Please run /login to sign in."
            };
            return {
                type: "text",
                value: "Voice mode is not available."
            }
        }
        let K = v7(),
            _ = K.voice?.enabled ?? K.voiceEnabled === !0,
            z = VaY(q);
        if (z === "invalid") return {
            type: "text",
            value: `Unknown mode: "${q.trim()}". Use hold, tap, or off.`
        };
        if (z === "off" || z === void 0 && _) {
            if (P7("userSettings", {
                    voiceEnabled: !1,
                    voice: {
                        ...K.voice,
                        enabled: !1
                    }
                }).error) return {
                type: "text",
                value: "Failed to update settings. Check your settings file for syntax errors."
            };
            return d("tengu_voice_toggled", {
                enabled: !1
            }), {
                type: "text",
                value: "Voice mode disabled."
            }
        }
        let {
            isVoiceStreamAvailable: Y
        } = await Promise.resolve().then(() => (yd8(), R37)), {
            checkRecordingAvailability: A
        } = await Promise.resolve().then(() => (JI6(), HI6)), O = await A();
        if (!O.available) return {
            type: "text",
            value: O.reason ?? "Voice mode is not available in this environment."
        };
        if (!Y()) return {
            type: "text",
            value: "Voice mode requires a Claude.ai account. Please run /login to sign in."
        };
        let {
            checkVoiceDependencies: w,
            requestMicrophonePermission: $
        } = await Promise.resolve().then(() => (JI6(), HI6)), j = await w();
        if (!j.available) return {
            type: "text",
            value: `No audio recording tool found.${j.installCommand?`
Install audio recording tools? Run: ${j.installCommand}`:`
Install SoX manually for audio recording.`}`
        };
        if (!await $()) {
            let V;
            if (process.platform === "win32") V = "Settings → Privacy → Microphone";
            else if (process.platform === "linux") V = "your system's audio settings";
            else V = "System Settings → Privacy & Security → Microphone";
            return {
                type: "text",
                value: `Microphone access is denied. To enable it, go to ${V}, then run /voice again.`
            }
        }
        let H = z === "hold" || z === "tap" ? z : K.voice?.mode ?? "hold";
        if (P7("userSettings", {
                voiceEnabled: !0,
                voice: {
                    ...K.voice,
                    enabled: !0,
                    mode: H
                }
            }).error) return {
            type: "text",
            value: "Failed to update settings. Check your settings file for syntax errors."
        };
        d("tengu_voice_toggled", {
            enabled: !0,
            tap_mode: H === "tap"
        });
        let M = `Hold ${WJ("voice:pushToTalk","Chat","Space")} to record.`,
            P = "",
            W = wz8(K.language),
            D = H8(),
            Z = D.voiceLangHintLastLanguage !== W.code,
            G = Z ? 0 : D.voiceLangHintShownCount ?? 0,
            f = !W.fellBackFrom && G < TaY,
            v = "";
        if (W.fellBackFrom) v = ` Note: "${W.fellBackFrom}" is not a supported dictation language; using English. Change it via /config.`;
        else if (f) v = ` Dictation language: ${W.code} (/config to change).`;
        if (Z || f) d8((V) => ({
            ...V,
            voiceLangHintShownCount: G + (f ? 1 : 0),
            voiceLangHintLastLanguage: W.code
        }));
        return {
            type: "text",
            value: `Voice mode enabled${P}. ${M}${v}`
        }
    }
// @from(Ln 491893, Col 4)
xtK = L(() => {
    AH7();
    zp();
    C8();
    T7();
    h1();
    a1();
    __6()
})
// @from(Ln 491902, Col 4)
utK = {}
// @from(Ln 491906, Col 4)
NaY
// @from(Ln 491906, Col 9)
EaY
// @from(Ln 491907, Col 4)
mtK = L(() => {
    __6();
    NaY = {
        type: "local",
        name: "voice",
        description: "Toggle voice mode",
        argumentHint: void 0,
        availability: ["claude-ai"],
        isEnabled: () => K_6(),
        get isHidden() {
            return !SM6()
        },
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (xtK(), ItK))
    }, EaY = NaY
})
// @from(Ln 491923, Col 4)
BtK = {}
// @from(Ln 491927, Col 4)
yaY = async (q, K) => {
    let _ = await Vu8(K.abortController.signal);
    if (_ === null) {
        if (K.abortController.signal.aborted) return {
            type: "text",
            value: "Recap cancelled."
        };
        return {
            type: "text",
            value: "No recap available — needs at least one completed turn, or generation failed."
        }
    }
    return {
        type: "text",
        value: _
    }
}
// @from(Ln 491943, Col 3)
LaY
// @from(Ln 491943, Col 8)
haY
// @from(Ln 491944, Col 4)
ptK = L(() => {
    B1();
    QR6();
    LaY = {
        type: "local",
        name: "recap",
        description: "Generate a one-line session recap now",
        isEnabled: () => u8("tengu_sedge_lantern", !0),
        supportsNonInteractive: !1,
        load: () => Promise.resolve({
            call: yaY
        })
    }, haY = LaY
})
// @from(Ln 491958, Col 0)
async function Io8() {
    if (!await oA("gh")) return "not_installed";
    let {
        exitCode: K
    } = await Xh("gh", ["auth", "token"], {
        stdout: "ignore",
        stderr: "ignore",
        timeout: 5000,
        reject: !1
    });
    return K === 0 ? "authenticated" : "not_authenticated"
}
// @from(Ln 491970, Col 4)
OH7 = L(() => {
    NV();
    n0()
})
// @from(Ln 491974, Col 0)
async function FtK(q) {
    let K, _;
    try {
        ({
            accessToken: K,
            orgUUID: _
        } = await TX())
    } catch {
        return {
            ok: !1,
            error: {
                kind: "not_signed_in"
            }
        }
    }
    let z = `${r7().BASE_API_URL}/v1/code/github/import-token`,
        Y = {
            ...bA(K),
            "anthropic-beta": RaY,
            "x-organization-uuid": _
        };
    try {
        let A = await Z1.post(z, {
            token: q.reveal()
        }, {
            headers: Y,
            timeout: 15000,
            validateStatus: () => !0
        });
        if (A.status === 200) return {
            ok: !0,
            result: A.data
        };
        if (A.status === 400) return {
            ok: !1,
            error: {
                kind: "invalid_token"
            }
        };
        if (A.status === 401) return {
            ok: !1,
            error: {
                kind: "not_signed_in"
            }
        };
        return E(`import-token returned ${A.status}`, {
            level: "error"
        }), {
            ok: !1,
            error: {
                kind: "server",
                status: A.status
            }
        }
    } catch (A) {
        if (Z1.isAxiosError(A)) E(`import-token network error: ${A.code??"unknown"}`, {
            level: "error"
        });
        return {
            ok: !1,
            error: {
                kind: "network"
            }
        }
    }
}
// @from(Ln 492040, Col 0)
async function gtK() {
    try {
        return await TX(), !0
    } catch {
        return !1
    }
}
// @from(Ln 492048, Col 0)
function xo8() {
    return `${r7().CLAUDE_AI_ORIGIN}/code`
}
// @from(Ln 492051, Col 4)
RaY = "ccr-byoc-2025-07-29"
// @from(Ln 492052, Col 4)
wH7
// @from(Ln 492053, Col 4)
UtK = L(() => {
    CK();
    z3();
    K8();
    VX();
    wH7 = class wH7 {
        #q;
        constructor(q) {
            this.#q = q
        }
        reveal() {
            return this.#q
        }
        toString() {
            return "[REDACTED:gh-token]"
        }
        toJSON() {
            return "[REDACTED:gh-token]"
        } [Symbol.for("nodejs.util.inspect.custom")]() {
            return "[REDACTED:gh-token]"
        }
    }
})
// @from(Ln 492076, Col 4)
QtK = {}
// @from(Ln 492080, Col 0)
async function SaY() {
    if (!await gtK()) return {
        status: "not_signed_in"
    };
    let q = await Io8();
    if (q === "not_installed") return {
        status: "gh_not_installed"
    };
    if (q === "not_authenticated") return {
        status: "gh_not_authenticated"
    };
    let {
        stdout: K
    } = await Xh("gh", ["auth", "token"], {
        stdout: "pipe",
        stderr: "ignore",
        timeout: 5000,
        reject: !1
    }), _ = K.trim();
    if (!_) return {
        status: "gh_not_authenticated"
    };
    return {
        status: "has_gh_token",
        token: new wH7(_)
    }
}
// @from(Ln 492108, Col 0)
function CaY(q, K) {
    switch (q.kind) {
        case "not_signed_in":
            return `Login failed. Please visit ${K} and login using the GitHub App`;
        case "invalid_token":
            return "GitHub rejected that token. Run `gh auth login` and try again.";
        case "server":
            return `Server error (${q.status}). Try again in a moment.`;
        case "network":
            return "Couldn't reach the server. Check your connection."
    }
}
// @from(Ln 492121, Col 0)
function baY({
    onDone: q
}) {
    let [K, _] = uo8.useState({
        name: "checking"
    });
    uo8.useEffect(() => {
        d("tengu_remote_setup_started", {}), SaY().then(async (O) => {
            switch (O.status) {
                case "not_signed_in":
                    d("tengu_remote_setup_result", {
                        result: "not_signed_in"
                    }), q("Not signed in to Claude. Run /login first.");
                    return;
                case "gh_not_installed":
                case "gh_not_authenticated": {
                    let w = `${xo8()}/onboarding?step=alt-auth`;
                    await J3(w), d("tengu_remote_setup_result", {
                        result: O.status
                    }), q(O.status === "gh_not_installed" ? `GitHub CLI not found. Install it via https://cli.github.com/, then run \`gh auth login\`, or connect GitHub on the web: ${w}` : `GitHub CLI not authenticated. Run \`gh auth login\` and try again, or connect GitHub on the web: ${w}`);
                    return
                }
                case "has_gh_token":
                    _({
                        name: "confirm",
                        token: O.token
                    })
            }
        })
    }, []);
    let z = () => {
            d("tengu_remote_setup_result", {
                result: "cancelled"
            }), q()
        },
        Y = async (O) => {
            _({
                name: "uploading"
            });
            let w = await FtK(O);
            if (!w.ok) {
                d("tengu_remote_setup_result", {
                    result: "import_failed",
                    error_kind: w.error.kind
                }), q(CaY(w.error, xo8()));
                return
            }
            let $ = !0;
            try {
                $ = (await AF()).length === 0
            } catch {
                $ = !0
            }
            if ($) try {
                await bR6()
            } catch (H) {
                E(`[web-setup] Failed to create default environment: ${H}`, {
                    level: "warn"
                })
            }
            let j = xo8();
            await J3(j), d("tengu_remote_setup_result", {
                result: "success"
            }), q(`Connected as ${w.result.github_username}. Opened ${j}`)
        };
    if (K.name === "checking") return SG.createElement(Q$, {
        message: "Checking login status…"
    });
    if (K.name === "uploading") return SG.createElement(Q$, {
        message: "Connecting GitHub to Claude…"
    });
    let A = K.token;
    return SG.createElement(R1, {
        title: "Connect Claude on the web to GitHub?",
        onCancel: z,
        hideInputGuide: !0
    }, SG.createElement(u, {
        flexDirection: "column"
    }, SG.createElement(T, null, "Claude on the web requires connecting to your GitHub account to clone and push code on your behalf."), SG.createElement(T, {
        dimColor: !0
    }, "Your local credentials are used to authenticate with GitHub")), SG.createElement(A1, {
        options: [{
            label: "Continue",
            value: "send"
        }, {
            label: "Cancel",
            value: "cancel"
        }],
        onChange: (O) => {
            if (O === "send") Y(A);
            else z()
        },
        onCancel: z
    }))
}
// @from(Ln 492216, Col 0)
async function IaY(q) {
    return SG.createElement(baY, {
        onDone: q
    })
}
// @from(Ln 492221, Col 4)
SG
// @from(Ln 492221, Col 8)
uo8
// @from(Ln 492222, Col 4)
dtK = L(() => {
    g_();
    S4();
    Qy();
    g6();
    C8();
    Nj();
    K8();
    OH7();
    NV();
    IR6();
    UtK();
    SG = K6(P6(), 1), uo8 = K6(P6(), 1)
})
// @from(Ln 492236, Col 4)
ctK = {}
// @from(Ln 492240, Col 4)
xaY
// @from(Ln 492240, Col 9)
uaY
// @from(Ln 492241, Col 4)
ltK = L(() => {
    B1();
    J2();
    xaY = {
        type: "local-jsx",
        name: "web-setup",
        description: "Setup Claude Code on the web (requires connecting your GitHub account)",
        availability: ["claude-ai"],
        isEnabled: () => u8("tengu_cobalt_lantern", !1) && N5("allow_remote_sessions") && N5("allow_quick_web_setup"),
        get isHidden() {
            return !N5("allow_remote_sessions") || !N5("allow_quick_web_setup")
        },
        load: () => Promise.resolve().then(() => (dtK(), QtK))
    }, uaY = xaY
})
// @from(Ln 492265, Col 0)
async function rtK(q, K) {
    let _ = {
            slashCommandCounts: new Map,
            mcpServerCounts: new Map,
            sessionDescriptors: [],
            sessionFileCount: 0
        },
        z = Date.now() - K * 24 * 60 * 60 * 1000,
        Y;
    try {
        Y = await maY(q)
    } catch (A) {
        if (D5(A)) return _;
        throw A
    }
    for (let A of Y) {
        if (FaY(A) !== ".jsonl") continue;
        let O = gaY(q, A),
            w;
        try {
            w = await paY(O)
        } catch (H) {
            if (D5(H)) continue;
            throw H
        }
        if (!w.isFile()) continue;
        if (w.mtimeMs < z || w.size > UaY) continue;
        let $;
        try {
            $ = await BaY(O, "utf-8")
        } catch (H) {
            if (D5(H)) continue;
            throw H
        }
        _.sessionFileCount++;
        let j = {
            prNumbers: []
        };
        for (let H of $.split(`
`)) {
            if (H.length < 10) continue;
            if (H.includes(itK) || H.includes(laY))
                for (let J of H.matchAll(daY)) {
                    let X = J[1];
                    _.slashCommandCounts.set(X, (_.slashCommandCounts.get(X) ?? 0) + 1)
                }
            if (H.includes(naY) && H.includes('"name":"mcp__'))
                for (let J of H.matchAll(caY)) {
                    let X = J[1];
                    _.mcpServerCounts.set(X, (_.mcpServerCounts.get(X) ?? 0) + 1)
                }
            if (H.includes(iaY)) {
                let J = aaY.exec(H);
                if (J) j.title = J[1]
            }
            if (H.includes(raY)) {
                let J = saY.exec(H);
                if (J) {
                    let X = Number(J[1]);
                    if (!j.prNumbers.includes(X)) j.prNumbers.push(X)
                }
            }
            if (!j.firstMessage && H.includes(oaY) && !H.includes(itK) && !H.includes('"content":[')) {
                let J = taY.exec(H);
                if (J) {
                    let X = J[1].replace(/\\n/g, " ").replace(/\\"/g, '"');
                    if (X.length > 3 && !X.startsWith("<")) j.firstMessage = X.slice(0, QaY)
                }
            }
        }
        if (j.title || j.prNumbers.length > 0 || j.firstMessage) _.sessionDescriptors.push(j)
    }
    if (_.sessionDescriptors.length > ntK) _.sessionDescriptors.sort((A, O) => {
        let w = (A.title ? 2 : 0) + (A.prNumbers.length > 0 ? 1 : 0);
        return (O.title ? 2 : 0) + (O.prNumbers.length > 0 ? 1 : 0) - w
    }), _.sessionDescriptors = _.sessionDescriptors.slice(0, ntK);
    return _
}
// @from(Ln 492343, Col 4)
UaY = 52428800
// @from(Ln 492344, Col 4)
QaY = 200
// @from(Ln 492345, Col 4)
ntK = 60
// @from(Ln 492346, Col 4)
daY
// @from(Ln 492346, Col 9)
caY
// @from(Ln 492346, Col 14)
itK = '"content":"<command-name>/'
// @from(Ln 492347, Col 4)
laY = '"content":"<command-message>'
// @from(Ln 492348, Col 4)
naY = '"type":"tool_use"'
// @from(Ln 492349, Col 4)
iaY = '"type":"custom-title"'
// @from(Ln 492350, Col 4)
raY = '"type":"pr-link"'
// @from(Ln 492351, Col 4)
oaY = '"role":"user"'
// @from(Ln 492352, Col 4)
aaY
// @from(Ln 492352, Col 9)
saY
// @from(Ln 492352, Col 14)
taY
// @from(Ln 492353, Col 4)
otK = L(() => {
    m8();
    daY = /<command-name>\/([\w:-]+)<\/command-name>/g, caY = /"name":"mcp__([^"]+?)__([^"]+)"/g, aaY = /"customTitle":"([^"]+)"/, saY = /"prNumber":(\d+)/, taY = /"role":"user"[^}]*"content":"([^"]+)"/
})
// @from(Ln 492357, Col 4)
Bo8 = {}
// @from(Ln 492371, Col 0)
function zsY(q) {
    try {
        return new URL(q).origin
    } catch {
        return
    }
}
// @from(Ln 492378, Col 0)
async function YsY(q) {
    try {
        let K = await eaY(KsY(q, ".mcp.json"), "utf8"),
            _ = n8(K);
        if (_ && typeof _ === "object" && "mcpServers" in _ && _.mcpServers && typeof _.mcpServers === "object") return _.mcpServers
    } catch (K) {
        if (!t1(K)) E(`team-onboarding: failed to read .mcp.json: ${K instanceof Error?K.message:String(K)}`, {
            level: "error"
        })
    }
    return {}
}