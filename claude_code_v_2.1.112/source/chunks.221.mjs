
// @from(Ln 570776, Col 0)
async function fX5(q, K, _, z) {
    let {
        allowed: Y,
        blocked: A
    } = s36(q), O = {};
    for (let Z of A) O[Z] = "Blocked by enterprise policy (allowedMcpServers/deniedMcpServers)";
    let w = {},
        $ = {};
    for (let [Z, G] of Object.entries(Y))
        if (G.type === "sdk") w[Z] = G;
        else $[Z] = G;
    let j = new Set(Object.keys(K.configs)),
        H = new Set(Object.keys(w)),
        J = [],
        X = [],
        M = {
            ...K.configs
        },
        P = [...K.clients],
        W = [...K.tools];
    for (let Z of j)
        if (!H.has(Z)) {
            let G = P.find((v) => v.name === Z);
            if (G && G.type === "connected") await G.cleanup();
            P = P.filter((v) => v.name !== Z);
            let f = `mcp__${Z}__`;
            W = W.filter((v) => !v.name.startsWith(f)), delete M[Z], X.push(Z)
        } for (let [Z, G] of Object.entries(w))
        if (!j.has(Z)) {
            M[Z] = G;
            let f = {
                type: "pending",
                name: Z,
                config: {
                    ...G,
                    scope: "dynamic"
                }
            };
            P = [...P, f], J.push(Z)
        } let D = await GX5($, _, z);
    return {
        response: {
            added: [...J, ...D.response.added],
            removed: [...X, ...D.response.removed],
            errors: {
                ...O,
                ...D.response.errors
            }
        },
        newSdkState: {
            configs: M,
            clients: P,
            tools: W
        },
        newDynamicState: D.newState,
        sdkServersChanged: J.length > 0 || X.length > 0
    }
}
// @from(Ln 570834, Col 0)
async function GX5(q, K, _) {
    let z = new Set(Object.keys(K.configs)),
        Y = new Set(Object.keys(q)),
        A = [...z].filter((G) => !Y.has(G)),
        O = [...Y].filter((G) => !z.has(G)),
        $ = [...z].filter((G) => Y.has(G)).filter((G) => {
            let f = K.configs[G],
                v = q[G];
            if (!f || !v) return !0;
            let V = W07(v);
            return !vRK(f, V)
        }),
        j = [],
        H = [],
        J = {},
        X = [...K.clients],
        M = [...K.tools];
    for (let G of [...A, ...$]) {
        let f = X.find((k) => k.name === G),
            v = K.configs[G];
        if (f && v) {
            if (f.type === "connected") try {
                await f.cleanup()
            } catch (k) {
                j6(k)
            }
            await WG(G, v)
        }
        let V = `mcp__${G}__`;
        if (M = M.filter((k) => !k.name.startsWith(V)), X = X.filter((k) => k.name !== G), A.includes(G)) j.push(G)
    }
    for (let G of [...O, ...$]) {
        let f = q[G];
        if (!f) continue;
        let v = W07(f);
        if (f.type === "sdk") {
            H.push(G);
            continue
        }
        try {
            let V = await OL(G, v);
            if (X.push(V), V.type === "connected") {
                let k = await NS(V);
                M.push(...k)
            } else if (V.type === "failed") J[G] = V.error || "Connection failed";
            H.push(G)
        } catch (V) {
            let k = r1(V);
            J[G] = k.message, j6(k)
        }
    }
    let P = {};
    for (let G of Y) {
        let f = q[G];
        if (f) P[G] = W07(f)
    }
    let W = [],
        D = [];
    for (let [G, f] of Object.entries(q)) {
        if (f.type !== "http" && f.type !== "sse") continue;
        for (let v of f.tools ?? []) {
            let V = tC(G, v.name);
            if (v.permission_policy === "always_allow") W.push(V);
            else if (v.permission_policy === "always_deny") D.push(V)
        }
    }
    let Z = {
        clients: X,
        tools: M,
        configs: P,
        policyRules: new Set([...W, ...D])
    };
    return _((G) => {
        let f = new Set([...Object.keys(K.configs), ...Object.keys(P)]),
            v = G.mcp.tools.filter((x) => {
                for (let B of f)
                    if (x.name.startsWith(`mcp__${B}__`)) return !1;
                return !0
            }),
            V = G.mcp.clients.filter((x) => {
                return !f.has(x.name)
            }),
            k = G.toolPermissionContext,
            N = (x, B) => {
                let m = x.session ?? [],
                    S = m.filter((F) => !K.policyRules.has(F));
                if (S.length === m.length && B.length === 0) return x;
                return {
                    ...x,
                    session: [...S, ...B]
                }
            },
            R = N(k.alwaysAllowRules, W),
            h = N(k.alwaysDenyRules, D),
            C = R === k.alwaysAllowRules && h === k.alwaysDenyRules ? k : {
                ...k,
                alwaysAllowRules: R,
                alwaysDenyRules: h
            };
        return {
            ...G,
            mcp: {
                ...G.mcp,
                tools: [...v, ...M],
                clients: [...V, ...X]
            },
            toolPermissionContext: C
        }
    }), {
        response: {
            added: H,
            removed: j,
            errors: J
        },
        newState: Z
    }
}
// @from(Ln 570952, Col 0)
function wX5(q, K) {
    if (q === null) return;
    if (q === 0) return {
        type: "disabled"
    };
    return {
        type: "enabled",
        budgetTokens: q,
        display: K
    }
}
// @from(Ln 570964, Col 0)
function BXA(q) {
    let K = q instanceof vq,
        _ = K ? Bh8(q) : id8(q),
        z = K && typeof q.status === "number" ? q.status : void 0,
        Y = q instanceof Error && q.cause !== void 0 ? id8(q.cause) : void 0;
    return {
        error_name: _,
        api_error_status: z,
        cause_name: Y
    }
}
// @from(Ln 570975, Col 4)
_X5
// @from(Ln 570975, Col 9)
kXA
// @from(Ln 570975, Col 14)
zX5
// @from(Ln 570975, Col 19)
NXA
// @from(Ln 570975, Col 24)
EXA
// @from(Ln 570975, Col 29)
YX5 = `<system-reminder>
You are running in non-interactive mode and cannot return a response to the user until your team is shut down.

You MUST shut down your team before preparing your final response:
1. Use requestShutdown to ask each team member to shut down gracefully
2. Wait for shutdown approvals
3. Use the cleanup operation to clean up the team
4. Only then provide your final response to the user

The user cannot receive your response until the team is completely shut down.
</system-reminder>

Shut down your team and prepare your final response for the user.`
// @from(Ln 570988, Col 4)
AX5 = 1e4
// @from(Ln 570989, Col 4)
He8
// @from(Ln 570989, Col 9)
je8
// @from(Ln 570989, Col 14)
LXA = "anthropic/permissionDisplay"
// @from(Ln 570990, Col 4)
TX5 = L(() => {
    Vj7();
    tR6();
    yt8();
    CJ5();
    CA();
    uJ5();
    $0();
    tI();
    wo8();
    C8();
    B1();
    aR();
    rv();
    Su8();
    eG();
    K8();
    VA();
    gq();
    cP();
    b$();
    du6();
    U8();
    R18();
    IX6();
    O_8();
    __8();
    aW();
    EJ6();
    cJ5();
    FP();
    b9();
    f78();
    o88();
    lJ5();
    TI8();
    CY();
    R9();
    iJ5();
    n7();
    jU8();
    Wl8();
    J2();
    $96();
    DX7();
    FX7();
    g$();
    mO();
    aP7();
    x$();
    uu6();
    ox6();
    J07();
    Ln8();
    ur8();
    a56();
    kW7();
    ec();
    rA();
    a1();
    zK6();
    _a1();
    zf();
    vX();
    LJ6();
    lf();
    T7();
    Fq8();
    OC6();
    x9();
    uZ8();
    y8();
    td();
    oJ5();
    g4();
    sR();
    xP7();
    oW();
    rD();
    me();
    dl8();
    K9();
    _P();
    fh();
    iD();
    vy6();
    rD();
    mR6();
    Ju6();
    _7();
    EO7();
    rA();
    dI();
    Sq();
    s58();
    hf();
    NR();
    pv();
    jQ();
    y8();
    _7();
    Qc();
    m26();
    cy();
    hY8();
    yY();
    a18();
    pM6();
    Cf();
    e8();
    $t8();
    CA();
    Q8();
    qX5();
    Vo8();
    vH();
    zY();
    ZX();
    BD();
    PX();
    bc();
    B57();
    BP();
    B1();
    m8();
    XX7();
    VY();
    _X5 = (DW7(), B7(dO5)), kXA = (ve6(), B7(f04)), zX5 = (QR(), B7(mS4)), NXA = (HR6(), B7(jR6)), EXA = (M38(), B7(Kc8)), He8 = new Set, je8 = []
})
// @from(Ln 571119, Col 4)
EX5 = {}
// @from(Ln 571125, Col 0)
function NX5(q) {
    let K = s(16),
        {
            currentStep: _,
            sessionId: z
        } = q,
        [Y, A] = _O(100),
        O = Math.floor(A / 100) % D07.length,
        w;
    if (K[0] !== _) w = (W) => W.key === _, K[0] = _, K[1] = w;
    else w = K[1];
    let $ = VX5.findIndex(w),
        j = D07[O],
        H;
    if (K[2] !== j) H = O$.createElement(u, {
        marginBottom: 1
    }, O$.createElement(T, {
        bold: !0,
        color: "claude"
    }, j, " Teleporting session…")), K[2] = j, K[3] = H;
    else H = K[3];
    let J;
    if (K[4] !== z) J = z && O$.createElement(u, {
        marginBottom: 1
    }, O$.createElement(T, {
        dimColor: !0
    }, z)), K[4] = z, K[5] = J;
    else J = K[5];
    let X;
    if (K[6] !== $ || K[7] !== O) X = VX5.map((W, D) => {
        let Z = D < $,
            G = D === $,
            f = D > $,
            v, V;
        if (Z) v = e6.tick, V = "green";
        else if (G) v = D07[O], V = "claude";
        else v = e6.circle, V = void 0;
        return O$.createElement(u, {
            key: W.key,
            flexDirection: "row"
        }, O$.createElement(u, {
            width: 2
        }, O$.createElement(T, {
            color: V,
            dimColor: f
        }, v)), O$.createElement(T, {
            dimColor: f,
            bold: G
        }, W.label))
    }), K[6] = $, K[7] = O, K[8] = X;
    else X = K[8];
    let M;
    if (K[9] !== X) M = O$.createElement(u, {
        flexDirection: "column",
        marginLeft: 2
    }, X), K[9] = X, K[10] = M;
    else M = K[10];
    let P;
    if (K[11] !== Y || K[12] !== H || K[13] !== J || K[14] !== M) P = O$.createElement(u, {
        ref: Y,
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1
    }, H, J, M), K[11] = Y, K[12] = H, K[13] = J, K[14] = M, K[15] = P;
    else P = K[15];
    return P
}
// @from(Ln 571192, Col 0)
async function pXA(q, K) {
    let _ = () => {};

    function z() {
        let [w, $] = kX5.useState("validating");
        return _ = $, O$.createElement(NX5, {
            currentStep: w,
            sessionId: K
        })
    }
    q.render(O$.createElement(kX, null, O$.createElement(z, null)));
    let Y = await uX6(K, _);
    _("checking_out");
    let {
        branchName: A,
        branchError: O
    } = await zK8(Y.branch);
    return {
        messages: _K8(Y.log, O),
        branchName: A
    }
}
// @from(Ln 571214, Col 4)
O$
// @from(Ln 571214, Col 8)
kX5
// @from(Ln 571214, Col 13)
D07
// @from(Ln 571214, Col 18)
VX5
// @from(Ln 571215, Col 4)
yX5 = L(() => {
    o6();
    Qq();
    g6();
    JF();
    sk();
    O$ = K6(P6(), 1), kX5 = K6(P6(), 1), D07 = ["◐", "◓", "◑", "◒"], VX5 = [{
        key: "validating",
        label: "Validating session"
    }, {
        key: "fetching_logs",
        label: "Fetching session logs"
    }, {
        key: "fetching_branch",
        label: "Getting branch info"
    }, {
        key: "checking_out",
        label: "Checking out branch"
    }]
})
// @from(Ln 571236, Col 0)
function LX5(q) {
    let K = s(36),
        {
            servers: _,
            scope: z,
            onDone: Y
        } = q,
        A;
    if (K[0] !== _) A = Object.keys(_), K[0] = _, K[1] = A;
    else A = K[1];
    let O = A,
        w;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) w = {}, K[2] = w;
    else w = K[2];
    let [$, j] = FG.useState(w), H, J;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) H = () => {
        Ct().then((F) => {
            let {
                servers: U
            } = F;
            return j(U)
        })
    }, J = [], K[3] = H, K[4] = J;
    else H = K[3], J = K[4];
    FG.useEffect(H, J);
    let X;
    if (K[5] !== $ || K[6] !== O) X = O.filter((F) => $[F] !== void 0), K[5] = $, K[6] = O, K[7] = X;
    else X = K[7];
    let M = X,
        P = async function(U) {
            let g = 0;
            for (let c of U) {
                let n = _[c];
                if (n) {
                    let l = c;
                    if ($[l] !== void 0) {
                        let z6 = 1;
                        while ($[`${c}_${z6}`] !== void 0) z6++;
                        l = `${c}_${z6}`
                    }
                    await t36(l, n, z), g++
                }
            }
            Z(g)
        }, [W] = Zq(), D;
    if (K[8] !== Y || K[9] !== z || K[10] !== W) D = (F) => {
        if (F > 0) f4(`
${d7("success",W)(`Successfully imported ${F} MCP ${O7(F,"server")} to ${z} config.`)}
`);
        else f4(`
No servers were imported.`);
        Y(), WK()
    }, K[8] = Y, K[9] = z, K[10] = W, K[11] = D;
    else D = K[11];
    let Z = D,
        G;
    if (K[12] !== Z) G = () => {
        Z(0)
    }, K[12] = Z, K[13] = G;
    else G = K[13];
    let f = G,
        v = O.length,
        V;
    if (K[14] !== O.length) V = O7(O.length, "server"), K[14] = O.length, K[15] = V;
    else V = K[15];
    let k = `Found ${v} MCP ${V} in Claude Desktop.`,
        N;
    if (K[16] !== M.length) N = M.length > 0 && FG.default.createElement(T, {
        color: "warning"
    }, "Note: Some servers already exist with the same name. If selected, they will be imported with a numbered suffix."), K[16] = M.length, K[17] = N;
    else N = K[17];
    let R;
    if (K[18] === Symbol.for("react.memo_cache_sentinel")) R = FG.default.createElement(T, null, "Please select the servers you want to import:"), K[18] = R;
    else R = K[18];
    let h, C;
    if (K[19] !== M || K[20] !== O) h = O.map((F) => ({
        label: `${F}${M.includes(F)?" (already exists)":""}`,
        value: F
    })), C = O.filter((F) => !M.includes(F)), K[19] = M, K[20] = O, K[21] = h, K[22] = C;
    else h = K[21], C = K[22];
    let x;
    if (K[23] !== f || K[24] !== P || K[25] !== h || K[26] !== C) x = FG.default.createElement(J36, {
        options: h,
        defaultValue: C,
        onSubmit: P,
        onCancel: f,
        hideIndexes: !0
    }), K[23] = f, K[24] = P, K[25] = h, K[26] = C, K[27] = x;
    else x = K[27];
    let B;
    if (K[28] !== f || K[29] !== k || K[30] !== N || K[31] !== x) B = FG.default.createElement(R1, {
        title: "Import MCP Servers from Claude Desktop",
        subtitle: k,
        color: "success",
        onCancel: f,
        hideInputGuide: !0
    }, N, R, x), K[28] = f, K[29] = k, K[30] = N, K[31] = x, K[32] = B;
    else B = K[32];
    let m;
    if (K[33] === Symbol.for("react.memo_cache_sentinel")) m = FG.default.createElement(u, {
        paddingX: 1
    }, FG.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, FG.default.createElement(z1, null, FG.default.createElement(A8, {
        chord: "space",
        action: "select"
    }), FG.default.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), FG.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))), K[33] = m;
    else m = K[33];
    let S;
    if (K[34] !== B) S = FG.default.createElement(FG.default.Fragment, null, B, m), K[34] = B, K[35] = S;
    else S = K[35];
    return S
}
// @from(Ln 571358, Col 4)
FG
// @from(Ln 571359, Col 4)
hX5 = L(() => {
    o6();
    CY();
    g6();
    rD();
    bK();
    H78();
    Nq();
    S4();
    u7();
    FG = K6(P6(), 1)
})
// @from(Ln 571371, Col 4)
SX5 = {}
// @from(Ln 571376, Col 0)
async function gXA(q, K, _) {
    l$(q);
    let z = RX5(K, _),
        Y = new YA6;
    await z.connect(Y)
}
// @from(Ln 571383, Col 0)
function RX5(q, K) {
    LyK(g_7());
    let z = CR(100),
        Y = new zA6({
            name: "claude/tengu",
            version: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.VERSION
        }, {
            capabilities: {
                tools: {}
            }
        });
    return Y.setRequestHandler(wr, async () => {
        let A = MD(),
            O = YZ(A);
        return {
            tools: await Promise.all(O.map(async (w) => ({
                ...w,
                description: await w.prompt({
                    getToolPermissionContext: async () => A,
                    tools: O,
                    agents: []
                }),
                inputSchema: f_6(w.inputSchema),
                outputSchema: void 0
            })))
        }
    }), Y.setRequestHandler(YU, async ({
        params: {
            name: A,
            arguments: O
        }
    }) => {
        let w = MD(),
            $ = YZ(w),
            j = rK($, A);
        if (!j) throw Error(`Tool ${A} not found`);
        let H = {
            abortController: F5(),
            options: {
                commands: FXA,
                tools: $,
                mainLoopModel: G5(),
                thinkingConfig: {
                    type: "disabled"
                },
                mcpClients: [],
                mcpResources: {},
                isNonInteractiveSession: !0,
                debug: q,
                verbose: K,
                agentDefinitions: {
                    activeAgents: [],
                    allAgents: []
                }
            },
            getAppState: () => W36(),
            setAppState: () => {},
            setToolPermissionContext: () => {},
            taskRegistry: Rr8,
            sessionHooksRegistry: Lr8,
            setClassifierApprovals: vx8,
            setReplContext: () => {},
            setWebBrowserSlice: () => {},
            agentLifecycle: yr8,
            teammateColors: hr8,
            messages: [],
            turnStartIndex: 0,
            readFileState: z,
            setInProgressToolUseIDs: () => {},
            addResponseLength: () => {},
            resetResponseLength: () => {},
            getFileHistoryState: () => {
                return
            },
            applyFileHistoryOp: () => {},
            applyAttributionOp: () => {}
        };
        try {
            if (!j.isEnabled()) throw Error(`Tool ${A} is not enabled`);
            let J = await j.validateInput?.(O ?? {}, H);
            if (J && !J.result) throw Error(`Tool ${A} input is invalid: ${J.message}`);
            let X = await j.call(O ?? {}, H, LX, yj({
                content: []
            }));
            return {
                content: [{
                    type: "text",
                    text: typeof X === "string" ? X : I6(X.data)
                }]
            }
        } catch (J) {
            return j6(J), {
                isError: !0,
                content: [{
                    type: "text",
                    text: (J instanceof Error ? o57(J) : [String(J)]).filter(Boolean).join(`
`).trim() || "Error"
                }]
            }
        }
    }), Y
}
// @from(Ln 571492, Col 4)
FXA
// @from(Ln 571493, Col 4)
CX5 = L(() => {
    mj8();
    Fj8();
    _P();
    ol();
    rR6();
    k$7();
    gq();
    $0();
    x$();
    _u6();
    FP();
    $$7();
    U8();
    _7();
    Sq();
    g$();
    $G();
    e8();
    zu6();
    j$7();
    sb6();
    Ol8();
    FXA = [dr8]
})
// @from(Ln 571518, Col 4)
uX5 = {}
// @from(Ln 571534, Col 0)
async function xX5() {
    let q = y1();
    if (!LY1.includes(q)) throw Error(`Unsupported platform: ${q} - Claude Desktop integration only works on macOS and WSL.`);
    if (q === "macos") return IX5(dXA(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
    let K = process.env.USERPROFILE ? process.env.USERPROFILE.replace(/\\/g, "/") : null;
    if (K) {
        let z = `/mnt/c${K.replace(/^[A-Z]:/,"")}/AppData/Roaming/Claude/claude_desktop_config.json`;
        try {
            return await bX5(z), z
        } catch {}
    }
    try {
        try {
            let z = await UXA("/mnt/c/Users", {
                withFileTypes: !0
            });
            for (let Y of z) {
                if (Y.name === "Public" || Y.name === "Default" || Y.name === "Default User" || Y.name === "All Users") continue;
                let A = IX5("/mnt/c/Users", Y.name, "AppData", "Roaming", "Claude", "claude_desktop_config.json");
                try {
                    return await bX5(A), A
                } catch {}
            }
        } catch {}
    } catch (_) {
        j6(_)
    }
    throw Error("Could not find Claude Desktop config file in Windows. Make sure Claude Desktop is installed on Windows.")
}
// @from(Ln 571563, Col 0)
async function cXA() {
    if (!LY1.includes(y1())) throw Error("Unsupported platform - Claude Desktop integration only works on macOS and WSL.");
    try {
        let q = await xX5(),
            K;
        try {
            K = await QXA(q, {
                encoding: "utf8"
            })
        } catch (A) {
            if (Q1(A) === "ENOENT") return {};
            throw A
        }
        let _ = k5(K);
        if (!_ || typeof _ !== "object") return {};
        let z = _.mcpServers;
        if (!z || typeof z !== "object") return {};
        let Y = {};
        for (let [A, O] of Object.entries(z)) {
            if (!O || typeof O !== "object") continue;
            let w = wO1().safeParse(O);
            if (w.success) Y[A] = w.data
        }
        return Y
    } catch (q) {
        return j6(q), {}
    }
}
// @from(Ln 571591, Col 4)
mX5 = L(() => {
    FA6();
    m8();
    mO();
    U8();
    NK()
})
// @from(Ln 571598, Col 4)
Sz6 = {}
// @from(Ln 571614, Col 0)
async function BX5(q, K) {
    try {
        let _ = await OL(q, K);
        if (_.type === "connected") return "✓ Connected";
        else if (_.type === "needs-auth") return "! Needs authentication";
        else return "✗ Failed to connect"
    } catch (_) {
        return "✗ Connection error"
    }
}
// @from(Ln 571624, Col 0)
async function iXA({
    debug: q,
    verbose: K
}) {
    let _ = nXA();
    d("tengu_mcp_start", {});
    try {
        await lXA(_)
    } catch (z) {
        if (D5(z)) tq(`Error: Directory ${_} does not exist`);
        throw z
    }
    try {
        let {
            setup: z
        } = await Promise.resolve().then(() => (we8(), Oe8));
        await z(_, "default", !1, !1, void 0, !1);
        let {
            startMCPServer: Y
        } = await Promise.resolve().then(() => (CX5(), SX5));
        await Y(_, q ?? !1, K ?? !1)
    } catch (z) {
        tq(`Error: Failed to start MCP server: ${z}`)
    }
}
// @from(Ln 571649, Col 0)
async function rXA(q, K, _) {
    let z = my(K),
        Y = () => {
            if (z && (z.type === "sse" || z.type === "http")) K98(K, z), bhK(K, z)
        },
        A;
    try {
        if (_.scope) {
            let w = KC6(_.scope);
            d("tengu_mcp_delete", {
                name: K,
                scope: w
            }), await a87(K, w), Y(), A = w
        } else {
            let w = Ew(),
                $ = H8(),
                {
                    servers: j
                } = SJ("project"),
                H = !!j[K],
                J = [];
            if (w.mcpServers?.[K]) J.push("local");
            if (H) J.push("project");
            if ($.mcpServers?.[K]) J.push("user");
            if (J.length === 0) {
                let X = [...Object.keys(w.mcpServers ?? {}), ...Object.keys(j), ...Object.keys($.mcpServers ?? {})],
                    M = F4(X).sort();
                return tq(M.length > 0 ? `No MCP server found with name: "${K}". Configured servers: ${M.join(", ")}` : `No MCP server found with name: "${K}". No MCP servers are configured.`)
            } else if (J.length === 1) {
                let X = J[0];
                d("tengu_mcp_delete", {
                    name: K,
                    scope: X
                }), await a87(K, X), Y(), A = X
            } else return process.stderr.write(`MCP server "${K}" exists in multiple scopes:
`), J.forEach((X) => {
                process.stderr.write(`  - ${K48(X)} (${rk(X)})
`)
            }), process.stderr.write(`
To remove from a specific scope, use:
`), J.forEach((X) => {
                process.stderr.write(`  claude mcp remove "${K}" -s ${X}
`)
            }), tq()
        }
    } catch (w) {
        return tq(b6(w))
    }
    let O = _.scope ? K : `"${K}"`;
    q.render(w$.default.createElement(qw, null, w$.default.createElement(u, {
        flexDirection: "column"
    }, w$.default.createElement(T, null, "Removed MCP server ", O, " from ", A, " config"), w$.default.createElement(T, null, "File modified: ", rk(A))))), await q.waitUntilExit()
}
// @from(Ln 571703, Col 0)
function oXA({
    name: q,
    server: K,
    status: _
}) {
    if (K.type === "sse") return `${q}: ${K.url} (SSE) - ${_}`;
    if (K.type === "http") return `${q}: ${K.url} (HTTP) - ${_}`;
    if (K.type === "claudeai-proxy") return `${q}: ${K.url} - ${_}`;
    if (!K.type || K.type === "stdio") {
        let z = Array.isArray(K.args) ? K.args : [];
        return `${q}: ${K.command} ${z.join(" ")} - ${_}`
    }
    return null
}
// @from(Ln 571718, Col 0)
function aXA(q) {
    let K = s(10),
        {
            promise: _
        } = q,
        z = w$.use(_),
        Y, A, O;
    if (K[0] !== z) {
        let j = z.map(oXA).filter(sXA);
        A = qw, Y = T, O = j.join(`
`), K[0] = z, K[1] = Y, K[2] = A, K[3] = O
    } else Y = K[1], A = K[2], O = K[3];
    let w;
    if (K[4] !== Y || K[5] !== O) w = w$.default.createElement(Y, null, O), K[4] = Y, K[5] = O, K[6] = w;
    else w = K[6];
    let $;
    if (K[7] !== A || K[8] !== w) $ = w$.default.createElement(A, null, w), K[7] = A, K[8] = w, K[9] = $;
    else $ = K[9];
    return $
}
// @from(Ln 571739, Col 0)
function sXA(q) {
    return q !== null
}
// @from(Ln 571742, Col 0)
async function tXA(q) {
    d("tengu_mcp_list", {});
    let {
        servers: K
    } = await Ct();
    if (Object.keys(K).length === 0) {
        q.render(w$.default.createElement(qw, null, w$.default.createElement(T, null, "No MCP servers configured. Use `claude mcp add` to add a server."))), await q.waitUntilExit(), await WK(0);
        return
    }
    let _ = Xe6(Object.entries(K), async ([z, Y]) => ({
        name: z,
        server: Y,
        status: await BX5(z, Y)
    }), {
        concurrency: sz7()
    });
    q.render(w$.default.createElement(w$.Suspense, {
        fallback: w$.default.createElement(T, null, "Checking MCP server health…", `

`)
    }, w$.default.createElement(aXA, {
        promise: _
    }))), await q.waitUntilExit(), await WK(0)
}
// @from(Ln 571766, Col 0)
async function eXA(q, K) {
    d("tengu_mcp_get", {
        name: K
    });
    let _ = my(K);
    if (!_) {
        let {
            servers: A
        } = await Ct(), O = Object.keys(A).sort();
        return tq(O.length > 0 ? `No MCP server found with name: "${K}". Configured servers: ${O.join(", ")}` : `No MCP server found with name: "${K}". No MCP servers are configured.`)
    }
    let z = await BX5(K, _),
        Y = [`${K}:`, `  Scope: ${K48(_.scope)}`, `  Status: ${z}`];
    if (_.type === "sse" || _.type === "http") {
        if (Y.push(`  Type: ${_.type}`), Y.push(`  URL: ${_.url}`), _.headers) {
            Y.push("  Headers:");
            for (let [A, O] of Object.entries(_.headers)) Y.push(`    ${A}: ${O}`)
        }
        if (_.oauth?.clientId || _.oauth?.callbackPort) {
            let A = [];
            if (_.oauth.clientId) {
                if (A.push("client_id configured"), gl8(K, _)?.clientSecret) A.push("client_secret configured")
            }
            if (_.oauth.callbackPort) A.push(`callback_port ${_.oauth.callbackPort}`);
            Y.push(`  OAuth: ${A.join(", ")}`)
        }
    } else if (_.type === "stdio") {
        Y.push("  Type: stdio"), Y.push(`  Command: ${_.command}`);
        let A = Array.isArray(_.args) ? _.args : [];
        if (Y.push(`  Args: ${A.join(" ")}`), _.env) {
            Y.push("  Environment:");
            for (let [O, w] of Object.entries(_.env)) Y.push(`    ${O}=${w}`)
        }
    }
    Y.push(""), Y.push(`To remove this server, run: claude mcp remove "${K}" -s ${_.scope}`), q.render(w$.default.createElement(qw, null, w$.default.createElement(T, null, Y.join(`
`)))), await q.waitUntilExit(), await WK(0)
}
// @from(Ln 571803, Col 0)
async function qMA(q, K, _, z) {
    let Y, A;
    try {
        Y = KC6(z.scope);
        let O = k5(_),
            $ = z.clientSecret && O && typeof O === "object" && "type" in O && (O.type === "sse" || O.type === "http") && "url" in O && typeof O.url === "string" && "oauth" in O && O.oauth && typeof O.oauth === "object" && "clientId" in O.oauth ? await _98() : void 0;
        if (await t36(K, O, Y), A = O && typeof O === "object" && "type" in O ? String(O.type || "stdio") : "stdio", $ && O && typeof O === "object" && "type" in O && (O.type === "sse" || O.type === "http") && "url" in O && typeof O.url === "string") z98(K, {
            type: O.type,
            url: O.url
        }, $);
        d("tengu_mcp_add", {
            scope: Y,
            source: "json",
            type: A
        })
    } catch (O) {
        return tq(b6(O))
    }
    q.render(w$.default.createElement(qw, null, w$.default.createElement(T, null, "Added ", A, " MCP server ", K, " to ", Y, " config"))), await q.waitUntilExit()
}
// @from(Ln 571823, Col 0)
async function KMA(q) {
    try {
        let K = KC6(q.scope),
            _ = y1();
        d("tengu_mcp_add", {
            scope: K,
            platform: _,
            source: "desktop"
        });
        let {
            readClaudeDesktopMcpServers: z
        } = await Promise.resolve().then(() => (mX5(), uX5)), Y = await z();
        if (Object.keys(Y).length === 0) Iu("No MCP servers found in Claude Desktop configuration or configuration file does not exist.");
        let {
            unmount: A
        } = await eB(w$.default.createElement(kX, null, w$.default.createElement(TM, null, w$.default.createElement(LX5, {
            servers: Y,
            scope: K,
            onDone: () => {
                A()
            }
        }))), {
            exitOnCtrlC: !0
        })
    } catch (K) {
        tq(b6(K))
    }
}
// @from(Ln 571851, Col 0)
async function _MA(q) {
    d("tengu_mcp_reset_mcpjson_choices", {}), u2((K) => ({
        ...K,
        enabledMcpjsonServers: [],
        disabledMcpjsonServers: [],
        enableAllProjectMcpServers: !1
    })), q.render(w$.default.createElement(qw, null, w$.default.createElement(u, {
        flexDirection: "column"
    }, w$.default.createElement(T, null, "All project-scoped (.mcp.json) server approvals and rejections have been reset."), w$.default.createElement(T, null, "You will be prompted for approval next time you start Claude Code.")))), await q.waitUntilExit()
}
// @from(Ln 571861, Col 4)
w$
// @from(Ln 571862, Col 4)
Cz6 = L(() => {
    o6();
    YU1();
    hX5();
    g6();
    ql();
    C8();
    me();
    oW();
    rD();
    iD();
    JF();
    h1();
    m8();
    CY();
    mO();
    NK();
    yt();
    yW6();
    w$ = K6(P6(), 1)
})
// @from(Ln 571883, Col 4)
FX5 = {}
// @from(Ln 571894, Col 0)
function AMA() {
    let q = X7.platform === "win32",
        K = zMA();
    if (q) return YMA(K, ".local", "bin", "claude.exe").replaceAll("/", "\\");
    return "~/.local/bin/claude"
}
// @from(Ln 571901, Col 0)
function pX5(q) {
    let K = s(5),
        {
            messages: _
        } = q;
    if (_.length === 0) return null;
    let z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = __.default.createElement(u, null, __.default.createElement(T, {
        color: "warning"
    }, __.default.createElement(D4, {
        status: "warning",
        withSpace: !0
    }), "Setup notes:")), K[0] = z;
    else z = K[0];
    let Y;
    if (K[1] !== _) Y = _.map(OMA), K[1] = _, K[2] = Y;
    else Y = K[2];
    let A;
    if (K[3] !== Y) A = __.default.createElement(u, {
        flexDirection: "column",
        gap: 0,
        marginBottom: 1
    }, z, Y), K[3] = Y, K[4] = A;
    else A = K[4];
    return A
}
// @from(Ln 571928, Col 0)
function OMA(q, K) {
    return __.default.createElement(u, {
        key: K,
        marginLeft: 2
    }, __.default.createElement(T, {
        dimColor: !0
    }, "• ", q))
}
// @from(Ln 571937, Col 0)
function wMA({
    onDone: q,
    force: K,
    target: _
}) {
    let [z, Y] = __.useState({
        type: "checking"
    });
    return __.useEffect(() => {
        async function A() {
            try {
                E(`Install: Starting installation process (force=${K}, target=${_})`);
                let O = _ || vu();
                Y({
                    type: "installing",
                    version: O
                }), E(`Install: Calling installLatest(channelOrVersion=${O}, forceReinstall=${K})`);
                let w = await PX6(O, K);
                if (E(`Install: installLatest returned version=${w.latestVersion}, wasUpdated=${w.wasUpdated}, lockFailed=${w.lockFailed}`), w.lockFailed) throw Error("Could not install - another process is currently installing Claude. Please try again in a moment.");
                if (!w.latestVersion) E("Install: Failed to retrieve version information during install", {
                    level: "error"
                });
                if (_ === "latest" || _ === "stable") P7("userSettings", {
                    autoUpdatesChannel: _
                }), E(`Install: Saved autoUpdatesChannel=${_} to user settings`);
                if (!w.wasUpdated) E("Install: Already up to date");
                Y({
                    type: "setting-up"
                });
                let $ = await MX6(!0);
                if (E(`Install: Setup launcher completed with ${$.length} messages`), $.length > 0) $.forEach((P) => E(`Install: Setup message: ${P.message}`));
                E("Install: Cleaning up npm installations after successful install");
                let {
                    removed: j,
                    errors: H,
                    warnings: J
                } = await Q87();
                if (j > 0) E(`Cleaned up ${j} npm installation(s)`);
                if (H.length > 0) E(`Cleanup errors: ${H.join(", ")}`);
                let X = await U87();
                if (X.length > 0) E(`Shell alias cleanup: ${X.map((P)=>P.message).join("; ")}`);
                d("tengu_claude_install_command", {
                    has_version: w.latestVersion ? 1 : 0,
                    forced: K ? 1 : 0
                });
                let M = [...J, ...X.map((P) => P.message)];
                if ($.length > 0) Y({
                    type: "set-up",
                    messages: $.map((P) => P.message)
                }), setTimeout(Y, 2000, {
                    type: "success",
                    version: w.latestVersion || "current",
                    setupMessages: [...$.map((P) => P.message), ...M]
                });
                else E("Install: Shell PATH already configured"), Y({
                    type: "success",
                    version: w.latestVersion || "current",
                    setupMessages: M.length > 0 ? M : void 0
                })
            } catch (O) {
                E(`Install command failed: ${O}`, {
                    level: "error"
                }), Y({
                    type: "error",
                    message: b6(O)
                })
            }
        }
        A()
    }, [K, _]), __.useEffect(() => {
        if (z.type === "success") setTimeout(q, 2000, "Claude Code installation completed successfully", {
            display: "system"
        });
        else if (z.type === "error") setTimeout(q, 3000, "Claude Code installation failed", {
            display: "system"
        })
    }, [z, q]), __.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, z.type === "checking" && __.default.createElement(T, {
        color: "claude"
    }, "Checking installation status..."), z.type === "cleaning-npm" && __.default.createElement(T, {
        color: "warning"
    }, "Cleaning up old npm installations..."), z.type === "installing" && __.default.createElement(T, {
        color: "claude"
    }, "Installing Claude Code native build ", z.version, "..."), z.type === "setting-up" && __.default.createElement(T, {
        color: "claude"
    }, "Setting up launcher and shell integration..."), z.type === "set-up" && __.default.createElement(pX5, {
        messages: z.messages
    }), z.type === "success" && __.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, __.default.createElement(u, null, __.default.createElement(D4, {
        status: "success",
        withSpace: !0
    }), __.default.createElement(T, {
        color: "success",
        bold: !0
    }, "Claude Code successfully installed!")), __.default.createElement(u, {
        marginLeft: 2,
        flexDirection: "column",
        gap: 1
    }, z.version !== "current" && __.default.createElement(u, null, __.default.createElement(T, {
        dimColor: !0
    }, "Version: "), __.default.createElement(T, {
        color: "claude"
    }, z.version)), __.default.createElement(u, null, __.default.createElement(T, {
        dimColor: !0
    }, "Location: "), __.default.createElement(T, {
        color: "text"
    }, AMA()))), __.default.createElement(u, {
        marginLeft: 2,
        flexDirection: "column",
        gap: 1
    }, __.default.createElement(u, {
        marginTop: 1
    }, __.default.createElement(T, {
        dimColor: !0
    }, "Next: Run "), __.default.createElement(T, {
        color: "claude",
        bold: !0
    }, "claude --help"), __.default.createElement(T, {
        dimColor: !0
    }, " to get started"))), z.setupMessages && __.default.createElement(pX5, {
        messages: z.setupMessages
    })), z.type === "error" && __.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, __.default.createElement(u, null, __.default.createElement(D4, {
        status: "error",
        withSpace: !0
    }), __.default.createElement(T, {
        color: "error"
    }, "Installation failed")), __.default.createElement(T, {
        color: "error"
    }, z.message), __.default.createElement(u, {
        marginTop: 1
    }, __.default.createElement(T, {
        dimColor: !0
    }, "Try running with --force to override checks"))))
}
// @from(Ln 572078, Col 4)
__
// @from(Ln 572078, Col 8)
$MA
// @from(Ln 572079, Col 4)
gX5 = L(() => {
    o6();
    C8();
    Y2();
    g6();
    K8();
    D_();
    m8();
    El();
    h_6();
    a1();
    __ = K6(P6(), 1);
    $MA = {
        type: "local-jsx",
        name: "install",
        description: "Install Claude Code native build",
        argumentHint: "[options]",
        async call(q, K, _) {
            let z = _.includes("--force"),
                A = _.filter((w) => !w.startsWith("--"))[0],
                {
                    unmount: O
                } = await eB(__.default.createElement(wMA, {
                    onDone: (w, $) => {
                        O(), q(w, $)
                    },
                    force: z,
                    target: A
                }))
        }
    }
})
// @from(Ln 572111, Col 4)
pj = {}
// @from(Ln 572122, Col 0)
function HMA() {
    return Qu1({
        ...XF(!1),
        patchConsole: !1
    })
}
// @from(Ln 572128, Col 0)
async function JMA(q) {
    d("tengu_setup_token_command", {});
    let K = !jX(),
        {
            ConsoleOAuthFlow: _
        } = await Promise.resolve().then(() => (c48(), QOK));
    await new Promise((z) => {
        q.render(gG.default.createElement(kX, {
            onChangeAppState: T66
        }, gG.default.createElement(TM, null, gG.default.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, gG.default.createElement(Cm6, null), K && gG.default.createElement(u, {
            flexDirection: "column"
        }, gG.default.createElement(T, {
            color: "warning"
        }, "Warning: You already have authentication configured via environment variable or API key helper."), gG.default.createElement(T, {
            color: "warning"
        }, "The setup-token command will create a new OAuth token which you can use instead.")), gG.default.createElement(_, {
            onDone: () => {
                z()
            },
            mode: "setup-token",
            startingMessage: "This will guide you through long-lived (1-year) auth token setup for your Claude account. Claude subscription required."
        })))))
    }), q.unmount(), process.exit(0)
}
// @from(Ln 572156, Col 0)
function MMA(q) {
    let K = s(2),
        {
            onDone: _
        } = q;
    Ht8();
    let z;
    if (K[0] !== _) z = gG.default.createElement(gG.default.Suspense, {
        fallback: null
    }, gG.default.createElement(XMA, {
        onDone: _
    })), K[0] = _, K[1] = z;
    else z = K[1];
    return z
}
// @from(Ln 572171, Col 0)
async function PMA(q) {
    d("tengu_doctor_command", {}), await new Promise((K) => {
        q.render(gG.default.createElement(kX, null, gG.default.createElement(TM, null, gG.default.createElement(Ni8, {
            dynamicMcpConfig: void 0,
            isStrictMcpConfig: !1
        }, gG.default.createElement(MMA, {
            onDone: () => {
                K()
            }
        })))))
    }), q.unmount(), process.exit(0)
}
// @from(Ln 572183, Col 0)
async function WMA(q, K) {
    let {
        setup: _
    } = await Promise.resolve().then(() => (we8(), Oe8));
    await _(jMA(), "default", !1, !1, void 0, !1);
    let {
        install: z
    } = await Promise.resolve().then(() => (gX5(), FX5));
    await new Promise((Y) => {
        let A = [];
        if (q) A.push(q);
        if (K.force) A.push("--force");
        z.call((O) => {
            Y(), process.exit(O.includes("failed") ? 1 : 0)
        }, {}, A)
    })
}
// @from(Ln 572200, Col 4)
gG
// @from(Ln 572200, Col 8)
XMA
// @from(Ln 572201, Col 4)
Fj = L(() => {
    o6();
    nt8();
    bP7();
    g6();
    ql();
    C8();
    B_6();
    JF();
    du6();
    T7();
    aR6();
    gG = K6(P6(), 1);
    XMA = gG.default.lazy(() => Promise.resolve().then(() => (xO7(), EmK)).then((q) => ({
        default: q.Doctor
    })))
})
// @from(Ln 572218, Col 4)
Qu = {}
// @from(Ln 572240, Col 0)
function bz6(q, K) {
    j6(q), tq(`${e6.cross} Failed to ${K}: ${b6(q)}`)
}
// @from(Ln 572244, Col 0)
function QX5(q) {
    let K = [];
    if (q.errors.length > 0) K.push(`${e6.cross} Found ${q.errors.length} ${O7(q.errors.length,"error")}:`, ""), q.errors.forEach((_) => {
        K.push(`  ${e6.pointer} ${_.path}: ${_.message}`)
    }), K.push("");
    if (q.warnings.length > 0) K.push(`${e6.warning} Found ${q.warnings.length} ${O7(q.warnings.length,"warning")}:`, ""), q.warnings.forEach((_) => {
        K.push(`  ${e6.pointer} ${_.path}: ${_.message}`)
    }), K.push("");
    return K
}
// @from(Ln 572254, Col 0)
async function ZMA(q, K, _) {
    if (_.cowork) lL(!0);
    let z, Y = [];
    try {
        if (z = await ci8(K), z.fileType === "plugin") {
            let $ = UX5(z.filePath);
            if (DMA($) === ".claude-plugin") Y = await ZFK(UX5($))
        }
    } catch ($) {
        j6($), console.error(`${e6.cross} Unexpected error during validation: ${b6($)}`), process.exit(2);
        return
    }
    let A = z.success && Y.every(($) => $.success),
        O = z.warnings.length > 0 || Y.some(($) => $.warnings.length > 0),
        w = [`Validating ${z.fileType} manifest: ${z.filePath}`, "", ...QX5(z)];
    for (let $ of Y) w.push(`Validating ${$.fileType}: ${$.filePath}`, ""), w.push(...QX5($));
    w.push(A ? O ? `${e6.tick} Validation passed with warnings` : `${e6.tick} Validation passed` : `${e6.cross} Validation failed`), q.render(g9.default.createElement(qw, null, g9.default.createElement(T, null, w.join(`
`)))), await q.waitUntilExit(), process.exit(A ? 0 : 1)
}
// @from(Ln 572273, Col 0)
async function fMA(q, K) {
    if (K.cowork) lL(!0);
    d("tengu_plugin_list_command", {});
    let _ = OZ(),
        {
            getPluginEditableScopes: z
        } = await Promise.resolve().then(() => (X_8(), UpK)),
        Y = z(),
        A = Object.keys(_.plugins),
        {
            enabled: O,
            disabled: w,
            errors: $
        } = await sW(),
        j = [...O, ...w],
        H = j.filter((M) => M.source.endsWith("@inline")),
        J = $.filter((M) => M.source.endsWith("@inline") || M.source.startsWith("inline["));
    if (K.json) {
        let M = new Map(j.map((D) => [D.source, D])),
            P = [];
        for (let D of A.sort()) {
            let Z = _.plugins[D];
            if (!Z || Z.length === 0) continue;
            let G = Z4(D).name,
                f = $.filter((v) => v.source === D || ("plugin" in v) && v.plugin === G).map(GH);
            for (let v of Z) {
                let V = M.get(D),
                    k;
                if (V) {
                    let N = V.mcpServers || await yl(V);
                    if (N && Object.keys(N).length > 0) k = N
                }
                P.push({
                    id: D,
                    version: v.version || "unknown",
                    scope: v.scope,
                    enabled: Y.has(D),
                    installPath: v.installPath,
                    installedAt: v.installedAt,
                    lastUpdated: v.lastUpdated,
                    projectPath: v.projectPath,
                    mcpServers: k,
                    errors: f.length > 0 ? f : void 0
                })
            }
        }
        for (let D of H) {
            let Z = D.mcpServers || await yl(D),
                G = J.filter((f) => f.source === D.source || ("plugin" in f) && f.plugin === D.name).map(GH);
            P.push({
                id: D.source,
                version: D.manifest.version ?? "unknown",
                scope: "session",
                enabled: D.enabled !== !1,
                installPath: D.path,
                mcpServers: Z && Object.keys(Z).length > 0 ? Z : void 0,
                errors: G.length > 0 ? G : void 0
            })
        }
        for (let D of J.filter((Z) => Z.source.startsWith("inline["))) P.push({
            id: D.source,
            version: "unknown",
            scope: "session",
            enabled: !1,
            installPath: "path" in D ? D.path : "",
            errors: [GH(D)]
        });
        let W;
        if (K.available) {
            let D = [];
            try {
                let [Z, G] = await Promise.all([Dz(), Ex6()]), {
                    marketplaces: f
                } = await Rp(Z);
                for (let {
                        name: v,
                        data: V
                    }
                    of f)
                    if (V)
                        for (let k of V.plugins) {
                            let N = Jc(k.name, v);
                            if (!Hu(N)) D.push({
                                pluginId: N,
                                name: k.name,
                                description: k.description,
                                marketplaceName: v,
                                version: k.version,
                                source: k.source,
                                installCount: G?.get(N)
                            })
                        }
            } catch {}
            W = I6({
                installed: P,
                available: D
            }, null, 2)
        } else W = I6(P, null, 2);
        q.render(g9.default.createElement(qw, null, g9.default.createElement(T, null, W))), await q.waitUntilExit();
        return
    }
    let X = [];
    if (A.length === 0 && H.length === 0) {
        if (J.length === 0) X.push("No plugins installed. Use `claude plugin install` to install a plugin.")
    }
    if (A.length > 0) X.push("Installed plugins:", "");
    for (let M of A.sort()) {
        let P = _.plugins[M];
        if (!P || P.length === 0) continue;
        let W = Z4(M).name,
            D = $.filter((Z) => Z.source === M || ("plugin" in Z) && Z.plugin === W);
        for (let Z of P) {
            let G = Y.has(M),
                f = D.length > 0 ? `${e6.cross} failed to load` : G ? `${e6.tick} enabled` : `${e6.cross} disabled`,
                v = Z.version || "unknown",
                V = Z.scope;
            X.push(`  ${e6.pointer} ${M}`), X.push(`    Version: ${v}`), X.push(`    Scope: ${V}`), X.push(`    Status: ${f}`);
            for (let k of D) X.push(`    Error: ${GH(k)}`);
            X.push("")
        }
    }
    if (H.length > 0 || J.length > 0) {
        X.push("Session-only plugins (--plugin-dir):", "");
        for (let M of H) {
            let P = J.filter((D) => D.source === M.source || ("plugin" in D) && D.plugin === M.name),
                W = P.length > 0 ? `${e6.cross} loaded with errors` : `${e6.tick} loaded`;
            X.push(`  ${e6.pointer} ${M.source}`), X.push(`    Version: ${M.manifest.version??"unknown"}`), X.push(`    Path: ${M.path}`), X.push(`    Status: ${W}`);
            for (let D of P) X.push(`    Error: ${GH(D)}`);
            X.push("")
        }
        for (let M of J.filter((P) => P.source.startsWith("inline["))) X.push(`  ${e6.pointer} ${M.source}: ${e6.cross} ${GH(M)}`, "")
    }
    q.render(g9.default.createElement(qw, null, g9.default.createElement(T, null, X.join(`
`)))), await q.waitUntilExit()
}
// @from(Ln 572409, Col 0)
function GMA(q) {
    let K = s(4),
        {
            promise: _
        } = q,
        z = g9.use(_),
        Y;
    if (K[0] !== z) Y = z.join(`
`), K[0] = z, K[1] = Y;
    else Y = K[1];
    let A;
    if (K[2] !== Y) A = g9.default.createElement(qw, null, g9.default.createElement(T, null, Y)), K[2] = Y, K[3] = A;
    else A = K[3];
    return A
}
// @from(Ln 572424, Col 0)
async function vMA(q, K, _) {
    if (_.cowork) lL(!0);
    let z, Y, A;
    try {
        let w = await bi8(K);
        if (!w) return tq(`${e6.cross} Invalid marketplace source format. Try: owner/repo, https://..., or ./path`);
        if ("error" in w) return tq(`${e6.cross} ${w.error}`);
        if (A = _.scope ?? "user", A !== "user" && A !== "project" && A !== "local") return tq(`${e6.cross} Invalid scope '${A}'. Use: user, project, or local`);
        if (Y = jc(A), z = w, _.sparse && _.sparse.length > 0)
            if (z.source === "github" || z.source === "git") z = {
                ...z,
                sparsePaths: _.sparse
            };
            else return tq(`${e6.cross} --sparse is only supported for github and git marketplace sources (got: ${z.source})`)
    } catch (w) {
        return bz6(w, "add marketplace")
    }
    let O = (async () => {
        try {
            let w = [],
                {
                    name: $,
                    alreadyMaterialized: j,
                    resolvedSource: H
                } = await M_6(z, (X) => {
                    w.push(X)
                });
            h38($, {
                source: H
            }, Y), YO();
            let J = z.source;
            if (z.source === "github") J = z.repo;
            return d("tengu_marketplace_added", {
                source_type: J
            }), w.push(j ? `${e6.tick} Marketplace '${$}' already on disk — declared in ${A} settings` : `${e6.tick} Successfully added marketplace: ${$} (declared in ${A} settings)`), w
        } catch (w) {
            return bz6(w, "add marketplace")
        }
    })();
    q.render(g9.default.createElement(g9.Suspense, {
        fallback: g9.default.createElement(T, null, "Adding marketplace…")
    }, g9.default.createElement(GMA, {
        promise: O
    }))), await q.waitUntilExit(), process.exit(0)
}
// @from(Ln 572469, Col 0)
async function TMA(q, K) {
    if (K.cowork) lL(!0);
    let _;
    try {
        _ = await Dz()
    } catch (A) {
        return bz6(A, "list marketplaces")
    }
    let z = Object.keys(_),
        Y;
    if (K.json) {
        let A = z.sort().map((O) => {
            let w = _[O],
                $ = w?.source;
            return {
                name: O,
                source: $?.source,
                ...$?.source === "github" && {
                    repo: $.repo
                },
                ...$?.source === "git" && {
                    url: $.url
                },
                ...$?.source === "url" && {
                    url: $.url
                },
                ...$?.source === "directory" && {
                    path: $.path
                },
                ...$?.source === "file" && {
                    path: $.path
                },
                installLocation: w?.installLocation
            }
        });
        Y = g9.default.createElement(T, null, I6(A, null, 2))
    } else if (z.length === 0) Y = g9.default.createElement(T, null, "No marketplaces configured");
    else {
        let A = ["Configured marketplaces:", ""];
        z.forEach((O) => {
            let w = _[O];
            if (A.push(`  ${e6.pointer} ${O}`), w?.source) {
                let $ = w.source;
                if ($.source === "github") A.push(`    Source: GitHub (${$.repo})`);
                else if ($.source === "git") A.push(`    Source: Git (${$.url})`);
                else if ($.source === "url") A.push(`    Source: URL (${$.url})`);
                else if ($.source === "directory") A.push(`    Source: Directory (${$.path})`);
                else if ($.source === "file") A.push(`    Source: File (${$.path})`)
            }
            A.push("")
        }), Y = g9.default.createElement(T, null, A.join(`
`))
    }
    q.render(g9.default.createElement(qw, null, Y)), await q.waitUntilExit()
}
// @from(Ln 572524, Col 0)
async function VMA(q, K, _) {
    if (_.cowork) lL(!0);
    try {
        await RI6(K), YO(), d("tengu_marketplace_removed", {
            marketplace_name: K
        })
    } catch (z) {
        bz6(z, "remove marketplace")
    }
    q.render(g9.default.createElement(qw, null, g9.default.createElement(T, null, e6.tick, " Successfully removed marketplace: ", K))), await q.waitUntilExit()
}
// @from(Ln 572536, Col 0)
function kMA(q) {
    let K = s(5),
        {
            promise: _
        } = q,
        {
            messages: z,
            success: Y
        } = g9.use(_),
        A;
    if (K[0] !== z || K[1] !== Y) A = [...z, Y], K[0] = z, K[1] = Y, K[2] = A;
    else A = K[2];
    let w = A.join(`
`),
        $;
    if (K[3] !== w) $ = g9.default.createElement(qw, null, g9.default.createElement(T, null, w)), K[3] = w, K[4] = $;
    else $ = K[4];
    return $
}
// @from(Ln 572555, Col 0)
async function NMA(q, K, _) {
    if (_.cowork) lL(!0);
    let z, Y;
    if (K) {
        z = `Updating marketplace: ${K}...`;
        let A = [];
        Y = P_6(K, (O) => {
            A.push(O)
        }).then(() => {
            return YO(), d("tengu_marketplace_updated", {
                marketplace_name: K
            }), {
                messages: A,
                success: `${e6.tick} Successfully updated marketplace: ${K}`
            }
        }).catch((O) => bz6(O, "update marketplace(s)"))
    } else {
        let A;
        try {
            A = await Dz()
        } catch (w) {
            return bz6(w, "update marketplace(s)")
        }
        let O = Object.keys(A);
        if (O.length === 0) {
            q.render(g9.default.createElement(qw, null, g9.default.createElement(T, null, "No marketplaces configured"))), await q.waitUntilExit(), process.exit(0);
            return
        }
        z = `Updating ${O.length} marketplace(s)...`, Y = JEK().then(() => {
            return YO(), d("tengu_marketplace_updated_all", {
                count: O.length
            }), {
                messages: [],
                success: `${e6.tick} Successfully updated ${O.length} marketplace(s)`
            }
        }).catch((w) => bz6(w, "update marketplace(s)"))
    }
    q.render(g9.default.createElement(g9.Suspense, {
        fallback: g9.default.createElement(T, null, z)
    }, g9.default.createElement(kMA, {
        promise: Y
    }))), await q.waitUntilExit(), process.exit(0)
}
// @from(Ln 572599, Col 0)
function EMA(q) {
    let K = s(2),
        {
            promise: _
        } = q,
        z = g9.use(_),
        Y;
    if (K[0] !== z) Y = g9.default.createElement(qw, null, g9.default.createElement(T, null, e6.tick, " ", z)), K[0] = z, K[1] = Y;
    else Y = K[1];
    return Y
}
// @from(Ln 572610, Col 0)
async function yMA(q, K, _) {
    if (_.cowork) lL(!0);
    let z = _.scope || "user";
    if (_.cowork && z !== "user") tq("--cowork can only be used with user scope");
    if (!vG.includes(z)) tq(`Invalid scope: ${z}. Must be one of: ${vG.join(", ")}.`);
    let {
        name: Y,
        marketplace: A
    } = Z4(K);
    d("tengu_plugin_install_command", {
        _PROTO_plugin_name: Y,
        ...A && {
            _PROTO_marketplace_name: A
        },
        scope: z
    });
    let O = k25(K, z);
    q.render(g9.default.createElement(g9.Suspense, {
        fallback: g9.default.createElement(T, null, `Installing plugin "${K}"...`)
    }, g9.default.createElement(EMA, {
        promise: O
    }))), await q.waitUntilExit(), await WK(0)
}
// @from(Ln 572633, Col 0)
async function LMA(q, K, _) {
    if (_.cowork) lL(!0);
    let z = _.scope || "user";
    if (_.cowork && z !== "user") tq("--cowork can only be used with user scope");
    if (!vG.includes(z)) tq(`Invalid scope: ${z}. Must be one of: ${vG.join(", ")}.`);
    let {
        name: Y,
        marketplace: A
    } = Z4(K);
    d("tengu_plugin_uninstall_command", {
        _PROTO_plugin_name: Y,
        ...A && {
            _PROTO_marketplace_name: A
        },
        scope: z
    });
    let O = await N25(K, z, _.keepData);
    q.render(g9.default.createElement(qw, null, g9.default.createElement(T, null, e6.tick, " ", O))), await q.waitUntilExit(), process.exit(0)
}
// @from(Ln 572652, Col 0)
async function hMA(q, K, _) {
    if (_.cowork) lL(!0);
    let z;
    if (_.scope) {
        if (!vG.includes(_.scope)) tq(`Invalid scope "${_.scope}". Valid scopes: ${vG.join(", ")}`);
        z = _.scope
    }
    if (_.cowork && z !== void 0 && z !== "user") tq("--cowork can only be used with user scope");
    if (_.cowork && z === void 0) z = "user";
    let {
        name: Y,
        marketplace: A
    } = Z4(K);
    d("tengu_plugin_enable_command", {
        _PROTO_plugin_name: Y,
        ...A && {
            _PROTO_marketplace_name: A
        },
        scope: z ?? "auto"
    });
    let O;
    try {
        if (O = await Sx6(K, z), !O.success) throw Error(O.message);
        let w = Z4(O.pluginId || K);
        d("tengu_plugin_enabled_cli", {
            _PROTO_plugin_name: w.name,
            ...w.marketplace && {
                _PROTO_marketplace_name: w.marketplace
            },
            scope: O.scope,
            ...xR(w.name, w.marketplace, Xy())
        })
    } catch (w) {
        return D06(w, "enable", K)
    }
    q.render(g9.default.createElement(qw, null, g9.default.createElement(T, null, e6.tick, " ", O.message))), await q.waitUntilExit()
}
// @from(Ln 572689, Col 0)
async function RMA(q, K, _) {
    if (_.all && K) tq("Cannot use --all with a specific plugin");
    if (!_.all && !K) tq("Please specify a plugin name or use --all to disable all plugins");
    if (_.cowork) lL(!0);
    let z;
    if (_.all) {
        if (_.scope) tq("Cannot use --scope with --all");
        d("tengu_plugin_disable_command", {}), z = await y25()
    } else {
        let Y;
        if (_.scope) {
            if (!vG.includes(_.scope)) tq(`Invalid scope "${_.scope}". Valid scopes: ${vG.join(", ")}`);
            Y = _.scope
        }
        if (_.cowork && Y !== void 0 && Y !== "user") tq("--cowork can only be used with user scope");
        if (_.cowork && Y === void 0) Y = "user";
        let {
            name: A,
            marketplace: O
        } = Z4(K);
        d("tengu_plugin_disable_command", {
            _PROTO_plugin_name: A,
            ...O && {
                _PROTO_marketplace_name: O
            },
            scope: Y ?? "auto"
        }), z = await E25(K, Y)
    }
    q.render(g9.default.createElement(qw, null, g9.default.createElement(T, null, z))), await q.waitUntilExit(), process.exit(0)
}
// @from(Ln 572719, Col 0)
async function SMA(q, K) {
    if (K.cowork) lL(!0);
    let {
        name: _,
        marketplace: z
    } = Z4(q);
    d("tengu_plugin_update_command", {
        _PROTO_plugin_name: _,
        ...z && {
            _PROTO_marketplace_name: z
        }
    });
    let Y = "user";
    if (K.scope) {
        if (!dP6.includes(K.scope)) tq(`Invalid scope "${K.scope}". Valid scopes: ${dP6.join(", ")}`);
        Y = K.scope
    }
    if (K.cowork && Y !== "user") tq("--cowork can only be used with user scope");
    await L25(q, Y)
}
// @from(Ln 572739, Col 4)
g9
// @from(Ln 572740, Col 4)
du = L(() => {
    o6();
    Qq();
    y8();
    g6();
    C8();
    UW7();
    Ix6();
    m8();
    CY();
    U8();
    uR();
    xi8();
    yD();
    iK6();
    Xc();
    m$();
    WX6();
    zw7();
    aW();
    vH();
    Dw7();
    e8();
    yt();
    sK6();
    yW6();
    g9 = K6(P6(), 1)
})
// @from(Ln 572768, Col 4)
lX5 = {}
// @from(Ln 572774, Col 0)
function dX5(q) {
    let K = Ho8(q),
        _ = [q.agentType];
    if (K) _.push(K);
    if (q.memory) _.push(`${q.memory} memory`);
    return _.join(" · ")
}
// @from(Ln 572782, Col 0)
function cX5(q) {
    let K = s(8),
        {
            groups: _,
            totalActive: z
        } = q;
    if (_.length === 0) {
        let w;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = en.default.createElement(T, null, "No agents found."), K[0] = w;
        else w = K[0];
        return w
    }
    let Y;
    if (K[1] !== z) Y = en.default.createElement(T, null, z, " active agents"), K[1] = z, K[2] = Y;
    else Y = K[2];
    let A;
    if (K[3] !== _) A = _.map(CMA), K[3] = _, K[4] = A;
    else A = K[4];
    let O;
    if (K[5] !== Y || K[6] !== A) O = en.default.createElement(u, {
        flexDirection: "column"
    }, Y, A), K[5] = Y, K[6] = A, K[7] = O;
    else O = K[7];
    return O
}
// @from(Ln 572808, Col 0)
function CMA(q) {
    return en.default.createElement(u, {
        key: q.label,
        flexDirection: "column"
    }, en.default.createElement(T, null, " "), en.default.createElement(T, null, q.label, ":"), q.rows.map(bMA))
}
// @from(Ln 572815, Col 0)
function bMA(q, K) {
    return en.default.createElement(T, {
        key: K
    }, `  ${q}`)
}
// @from(Ln 572820, Col 0)
async function IMA(q) {
    let K = b8(),
        {
            allAgents: _
        } = await FR(K),
        z = zT(_),
        Y = jo8(_, z),
        A = [],
        O = 0;
    for (let {
            label: w,
            source: $
        }
        of s_8) {
        let j = Y.filter((J) => J.source === $).sort(Xo8);
        if (j.length === 0) continue;
        let H = j.map((J) => {
            if (J.overriddenBy) return `(shadowed by ${Jo8(J.overriddenBy)}) ${dX5(J)}`;
            return O++, dX5(J)
        });
        A.push({
            label: w,
            rows: H
        })
    }
    q.render(en.default.createElement(qw, null, en.default.createElement(cX5, {
        groups: A,
        totalActive: O
    }))), await q.waitUntilExit()
}
// @from(Ln 572850, Col 4)
en
// @from(Ln 572851, Col 4)
nX5 = L(() => {
    o6();
    g6();
    Mo8();
    cP();
    n7();
    yt();
    en = K6(P6(), 1)
})
// @from(Ln 572860, Col 4)
Je8 = {}
// @from(Ln 572866, Col 0)
async function iX5(q, K) {
    q.render(Iz6.default.createElement(qw, null, Iz6.default.createElement(T, null, I6(K, null, 2)))), await q.waitUntilExit()
}
// @from(Ln 572869, Col 0)
async function xMA(q) {
    await iX5(q, fg8())
}
// @from(Ln 572872, Col 0)
async function uMA(q) {
    let K = HG6(),
        _ = fg8();
    await iX5(q, {
        allow: K?.allow?.length ? K.allow : _.allow,
        soft_deny: K?.soft_deny?.length ? K.soft_deny : _.soft_deny,
        environment: K?.environment?.length ? K.environment : _.environment
    })
}
// @from(Ln 572881, Col 0)
async function BMA(q, K) {
    let _ = HG6();
    if (!((_?.allow?.length ?? 0) > 0 || (_?.soft_deny?.length ?? 0) > 0 || (_?.environment?.length ?? 0) > 0)) {
        q.render(Iz6.default.createElement(qw, null, Iz6.default.createElement(T, null, `No custom auto mode rules found.

Add rules to your settings file under autoMode.{allow, soft_deny, environment}.
Run \`claude auto-mode defaults\` to see the default rules for reference.`))), await q.waitUntilExit();
        return
    }
    let Y = K.model ? K5(K.model) : G5(),
        A = fg8(),
        O = b2K(),
        w = Z07("allow", _?.allow ?? [], A.allow) + Z07("soft_deny", _?.soft_deny ?? [], A.soft_deny) + Z07("environment", _?.environment ?? [], A.environment);
    q.render(Iz6.default.createElement(T, null, "Analyzing your auto mode rules…", `

`));
    let $;
    try {
        let H = (await dR({
            querySource: "auto_mode_critique",
            model: Y,
            system: mMA,
            skipSystemPromptPrefix: !0,
            max_tokens: 4096,
            messages: [{
                role: "user",
                content: `Here is the full classifier system prompt that the auto mode classifier receives:

<classifier_system_prompt>
` + O + `
</classifier_system_prompt>

Here are the user's custom rules that REPLACE the corresponding default sections:

` + w + `
Please critique these custom rules.`
            }]
        })).content.find((J) => J.type === "text");
        $ = H?.type === "text" ? H.text : "No critique was generated. Please try again."
    } catch (j) {
        return q.unmount(), tq("Failed to analyze rules: " + b6(j))
    }
    q.render(Iz6.default.createElement(qw, null, Iz6.default.createElement(T, null, $))), await q.waitUntilExit()
}
// @from(Ln 572926, Col 0)
function Z07(q, K, _) {
    if (K.length === 0) return "";
    let z = K.map((A) => "- " + A).join(`
`),
        Y = _.map((A) => "- " + A).join(`
`);
    return "## " + q + ` (custom rules replacing defaults)
Custom:
` + z + `

Defaults being replaced:
` + Y + `

`
}
// @from(Ln 572941, Col 4)
Iz6
// @from(Ln 572941, Col 9)
mMA = `You are an expert reviewer of auto mode classifier rules for Claude Code.

Claude Code has an "auto mode" that uses an AI classifier to decide whether tool calls should be auto-approved or require user confirmation. Users can write custom rules in three categories:

- **allow**: Actions the classifier should auto-approve
- **soft_deny**: Actions the classifier should block (require user confirmation)
- **environment**: Context about the user's setup that helps the classifier make decisions

Your job is to critique the user's custom rules for clarity, completeness, and potential issues. The classifier is an LLM that reads these rules as part of its system prompt.

For each rule, evaluate:
1. **Clarity**: Is the rule unambiguous? Could the classifier misinterpret it?
2. **Completeness**: Are there gaps or edge cases the rule doesn't cover?
3. **Conflicts**: Do any of the rules conflict with each other?
4. **Actionability**: Is the rule specific enough for the classifier to act on?

Be concise and constructive. Only comment on rules that could be improved. If all rules look good, say so.`
// @from(Ln 572958, Col 4)
Xe8 = L(() => {
    g6();
    m8();
    Sq();
    cX6();
    a1();
    tH6();
    e8();
    yt();
    yW6();
    Iz6 = K6(P6(), 1)
})
// @from(Ln 572980, Col 0)
function UMA() {
    return FMA(A7(), gMA)
}
// @from(Ln 572983, Col 0)
async function QMA() {
    let q;
    try {
        q = await pMA(UMA(), "utf8")
    } catch (_) {
        if (t1(_)) return null;
        throw _
    }
    let K = k5(q, !1);
    if (K && typeof K === "object") {
        let _ = K;
        if (typeof _.pid === "number" && typeof _.version === "string") return K
    }
    return null
}
// @from(Ln 572998, Col 0)
async function dMA() {
    let q = await QMA();
    if (!q) return null;
    try {
        return process.kill(q.pid, 0), q
    } catch {
        return null
    }
}
// @from(Ln 573007, Col 0)
async function f07(q) {
    try {
        let K = await dMA();
        if (!K || K.version === q) return !1;
        return process.kill(K.pid, "SIGTERM"), !0
    } catch {
        return !1
    }
}
// @from(Ln 573016, Col 4)
gMA = "daemon.lock"
// @from(Ln 573017, Col 4)
rX5 = L(() => {
    Q8();
    m8();
    mO();
    e8()
})
// @from(Ln 573023, Col 4)
oX5 = {}
// @from(Ln 573027, Col 0)
async function cMA() {
    d("tengu_update_check", {}), f4(`Current version: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION}
`);
    let q = vu(),
        K = Dp8(),
        _ = K ? K === "claude-code@latest" ? "latest" : "stable" : rS6() ? "stable" : q;
    f4(`Checking for updates to ${_} version...
`), E("update: Starting update check"), E("update: Running diagnostic");
    let z = await $X6();
    if (E(`update: Installation type: ${z.installationType}`), E(`update: Config install method: ${z.configInstallMethod}`), z.multipleInstallations.length > 1) {
        f4(`
`), f4(Y8.yellow("Warning: Multiple installations found") + `
`);
        for (let J of z.multipleInstallations) {
            let X = z.installationType === J.type ? " (currently running)" : "";
            f4(`- ${J.type} at ${J.path}${X}
`)
        }
    }
    if (z.warnings.length > 0) {
        f4(`
`);
        for (let J of z.warnings) E(`update: Warning detected: ${J.issue}`), E(`update: Showing warning: ${J.issue}`), f4(Y8.yellow(`Warning: ${J.issue}
`)), f4(Y8.bold(`Fix: ${J.fix}
`))
    }
    let Y = H8();
    if (!Y.installMethod && z.installationType !== "package-manager") {
        f4(`
`), f4(`Updating configuration to track installation method...
`);
        let J = "unknown";
        switch (z.installationType) {
            case "npm-local":
                J = "local";
                break;
            case "native":
                J = "native";
                break;
            case "npm-global":
                J = "global";
                break;
            default:
                J = "unknown"
        }
        d8((X) => ({
            ...X,
            installMethod: J
        })), f4(`Installation method set to: ${J}
`)
    }
    if (z.installationType === "development") f4(`
`), f4(Y8.yellow("Warning: Cannot update development build") + `
`), await WK(1);
    if (z.installationType === "package-manager") {
        let J = await oS6();
        if (f4(`
`), J === "homebrew") {
            f4(`Claude is managed by Homebrew.
`);
            let X = `brew upgrade ${K??"claude-code"}`,
                M = await Mp8(K ?? "claude-code", _);
            if (M === null) f4(`Could not check for updates (network check skipped or unavailable).
`), f4(`To update manually, run:
`), f4(Y8.bold(`  ${X}`) + `
`);
            else if (!QW({
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.112",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-04-16T18:33:19Z"
                }.VERSION, M)) f4(`Update available: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION} → ${M}
`), f4(`
`), f4(`To update, run:
`), f4(Y8.bold(`  ${X}`) + `
`);
            else f4(`Claude is up to date!
`)
        } else if (J === "winget") {
            f4(`Claude is managed by winget.
`);
            let X = await iS6(_);
            if (X && !QW({
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.112",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-04-16T18:33:19Z"
                }.VERSION, X)) f4(`Update available: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION} → ${X}
`), f4(`
`), f4(`To update, run:
`), f4(Y8.bold("  winget upgrade Anthropic.ClaudeCode") + `
`);
            else f4(`Claude is up to date!
`)
        } else if (J === "apk") {
            f4(`Claude is managed by apk.
`);
            let X = await iS6(_);
            if (X && !QW({
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.112",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-04-16T18:33:19Z"
                }.VERSION, X)) f4(`Update available: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION} → ${X}
`), f4(`
`), f4(`To update, run:
`), f4(Y8.bold("  apk upgrade claude-code") + `
`);
            else f4(`Claude is up to date!
`)
        } else f4(`Claude is managed by a package manager.
`), f4(`Please use your package manager to update.
`);
        await WK(0)
    }
    if (Y.installMethod && z.configInstallMethod !== "not set" && z.installationType !== "package-manager") {
        let {
            installationType: J,
            configInstallMethod: X
        } = z, P = {
            "npm-local": "local",
            "npm-global": "global",
            native: "native",
            development: "development",
            unknown: "unknown"
        } [J] || J;
        if (P !== X && X !== "unknown") f4(`
`), f4(Y8.yellow("Warning: Configuration mismatch") + `
`), f4(`Config expects: ${X} installation
`), f4(`Currently running: ${J}
`), f4(Y8.yellow(`Updating the ${J} installation you are currently using`) + `
`), d8((W) => ({
            ...W,
            installMethod: P
        })), f4(`Config updated to reflect current installation method: ${P}
`)
    }
    if (z.installationType === "native") {
        E("update: Detected native installation, using native updater");
        let J = v7()?.minimumVersion;
        if (J) {
            let X = await Tp8(_).catch(() => null);
            if (X && Lt(X)) f4(Y8.yellow(`The ${_} channel is at ${X}, which is below your minimumVersion setting (${J}). Staying on ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION}.`) + `
`), await WK(0)
        }
        try {
            let X = await PX6(_, !0);
            if (X.lockFailed) {
                let M = X.lockHolderPid ? ` (PID ${X.lockHolderPid})` : "";
                f4(Y8.yellow(`Another Claude process${M} is currently running. Please try again in a moment.`) + `
`), await WK(0)
            }
            if (!X.latestVersion) process.stderr.write(`Failed to check for updates
`), await WK(1);
            if (X.wasUpdated && X.latestVersion !== {
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.112",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-04-16T18:33:19Z"
                }.VERSION) {
                if (f4(Y8.green(`Successfully updated from ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION} to version ${X.latestVersion}`) + `
`), await nm1(), await f07(X.latestVersion)) f4(Y8.dim("Signaled claude daemon to restart") + `
`)
            } else f4(Y8.green(`Claude Code is up to date (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION})`) + `
`);
            await WK(0)
        } catch (X) {
            process.stderr.write(`Error: Failed to install native update
`), process.stderr.write(String(X) + `
`), process.stderr.write(`Try running "claude doctor" for diagnostics
`), await WK(1)
        }
    }
    if (Y.installMethod !== "native") await q48();
    E("update: Checking npm registry for latest version"), E(`update: Package URL: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.PACKAGE_URL}`);
    let A = _ === "stable" ? "stable" : "latest",
        O = `npm view ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.PACKAGE_URL}@${A} version`;
    E(`update: Running: ${O}`);
    let w = await iS6(_);
    if (E(`update: Latest version from npm: ${w||"FAILED"}`), !w) {
        if (E("update: Failed to get latest version from npm registry"), process.stderr.write(Y8.red("Failed to check for updates") + `
`), process.stderr.write(`Unable to fetch latest version from npm registry
`), process.stderr.write(`
`), process.stderr.write(`Possible causes:
`), process.stderr.write(`  • Network connectivity issues
`), process.stderr.write(`  • npm registry is unreachable
`), process.stderr.write(`  • Corporate proxy/firewall blocking npm
`), {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.PACKAGE_URL && !{
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.PACKAGE_URL.startsWith("@anthropic")) process.stderr.write(`  • Internal/development build not published to npm
`);
        process.stderr.write(`
`), process.stderr.write(`Try:
`), process.stderr.write(`  • Check your internet connection
`), process.stderr.write(`  • Run with --debug flag for more details
`);
        let J = {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.PACKAGE_URL || "@anthropic-ai/claude-code";
        process.stderr.write(`  • Manually check: npm view ${J} version
`), process.stderr.write(`  • Check if you need to login: npm whoami
`), await WK(1)
    }
    if (w && Lt(w)) {
        let J = v7()?.minimumVersion;
        f4(Y8.yellow(`The ${_} channel is at ${w}, which is below your minimumVersion setting (${J}). Staying on ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION}.`) + `
`), await WK(0)
    }
    if (w === {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION) f4(Y8.green(`Claude Code is up to date (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION})`) + `
`), await WK(0);
    f4(`New version available: ${w} (current: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION})
`), f4(`Installing update...
`);
    let $ = !1,
        j = "";
    switch (z.installationType) {
        case "npm-local":
            $ = !0, j = "local";
            break;
        case "npm-global":
            $ = !1, j = "global";
            break;
        case "unknown": {
            let J = await AX6();
            $ = J, j = J ? "local" : "global", f4(Y8.yellow("Warning: Could not determine installation type") + `
`), f4(`Attempting ${j} update based on file detection...
`);
            break
        }
        default:
            process.stderr.write(`Error: Cannot update ${z.installationType} installation
`), await WK(1)
    }
    f4(`Using ${j} installation update method...
`), E(`update: Update method determined: ${j}`), E(`update: useLocalUpdate: ${$}`);
    let H;
    if ($) E("update: Calling installOrUpdateClaudePackage() for local update"), H = await Qq8(_);
    else E("update: Calling installGlobalPackage() for global update"), H = await iq8();
    switch (E(`update: Installation status: ${H}`), H) {
        case "success":
            if (f4(Y8.green(`Successfully updated from ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION} to version ${w}`) + `
`), await nm1(), await f07(w)) f4(Y8.dim("Signaled claude daemon to restart") + `
`);
            break;
        case "no_permissions":
            if (process.stderr.write(`Error: Insufficient permissions to install update
`), $) process.stderr.write(`Try manually updating with:
`), process.stderr.write(`  cd ~/.claude/local && npm update ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.PACKAGE_URL}
`);
            else process.stderr.write(`Try running with sudo or fix npm permissions
`), process.stderr.write(`Or consider using native installation with: claude install
`);
            await WK(1);
            break;
        case "install_failed":
            if (process.stderr.write(`Error: Failed to install update
`), $) process.stderr.write(`Try manually updating with:
`), process.stderr.write(`  cd ~/.claude/local && npm update ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.PACKAGE_URL}
`);
            else process.stderr.write(`Or consider using native installation with: claude install
`);
            await WK(1);
            break;
        case "in_progress":
            process.stderr.write(`Error: Another instance is currently performing an update
`), process.stderr.write(`Please wait and try again later
`), await WK(1);
            break
    }
    await WK(0)
}
// @from(Ln 573330, Col 4)
aX5 = L(() => {
    Y3();
    rX5();
    C8();
    ht();
    im1();
    h1();
    K8();
    n36();
    CY();
    OX6();
    I87();
    El();
    Zp8();
    h_6();
    a1()
})
// @from(Ln 573347, Col 4)
eX5 = {}
// @from(Ln 573359, Col 0)
function oMA() {
    try {
        let q = E1("policySettings");
        if (q) {
            let K = QO1(q);
            d("tengu_managed_settings_loaded", {
                keyCount: K.length,
                keys: K.join(",")
            })
        }
    } catch {}
}
// @from(Ln 573372, Col 0)
function aMA() {
    let q = m16(),
        K = process.execArgv.some((z) => {
            if (q) return /--inspect(-brk)?/.test(z);
            else return /--inspect(-brk)?|--debug(-brk)?/.test(z)
        }),
        _ = process.env.NODE_OPTIONS && /--inspect(-brk)?|--debug(-brk)?/.test(process.env.NODE_OPTIONS);
    try {
        return !!global.require("inspector").url() || K || _
    } catch {
        return K || _
    }
}
// @from(Ln 573386, Col 0)
function tX5() {
    let q = K5(cB6() ?? ZP());
    fH5(b8(), ff(q, eM())), Gj().then(async ({
        enabled: K,
        errors: _
    }) => {
        let z = Xy();
        await Promise.all(K.map(async (Y) => {
            if (!Y.mcpServers) {
                let A = await yl(Y, []);
                if (A) Y.mcpServers = A
            }
            if (!Y.lspServers) {
                let A = await $M6(Y, []);
                if (A) Y.lspServers = A
            }
        })), Tf4(K, z, nK6()), kf4(_, z)
    }).catch((K) => j6(K))
}
// @from(Ln 573406, Col 0)
function sMA() {
    let q = {};
    if (process.env.NODE_EXTRA_CA_CERTS) q.has_node_extra_ca_certs = !0;
    if (process.env.CLAUDE_CODE_CLIENT_CERT) q.has_client_cert = !0;
    if (xD6("--use-system-ca")) q.has_use_system_ca = !0;
    if (xD6("--use-openssl-ca")) q.has_use_openssl_ca = !0;
    if (process.env.CLAUDE_CODE_CERT_STORE) q.cert_store = process.env.CLAUDE_CODE_CERT_STORE;
    return q
}
// @from(Ln 573415, Col 0)
async function tMA() {
    if (A46()) return;
    let [q, K, _] = await Promise.all([qX(), rf6(), Io8()]);
    d("tengu_startup_telemetry", {
        is_git: q,
        worktree_count: K,
        gh_auth_status: _,
        sandbox_enabled: Z7.isSandboxingEnabled(),
        are_unsandboxed_commands_allowed: Z7.areUnsandboxedCommandsAllowed(),
        is_auto_bash_allowed_if_sandbox_enabled: Z7.isAutoAllowBashIfSandboxedEnabled(),
        auto_updater_disabled: Yd(),
        prefers_reduced_motion: v7().prefersReducedMotion ?? !1,
        ...sMA()
    })
}
// @from(Ln 573431, Col 0)
function eMA() {
    if (H8().migrationVersion !== G07) hH5(), SH5(), bH5(), iH5(), UH5(), xH5(), dH5(), BH5(), FH5(), lH5(), d8((q) => q.migrationVersion === G07 ? q : {
        ...q,
        migrationVersion: G07
    });
    OQK().catch(() => {})
}
// @from(Ln 573439, Col 0)
function qPA() {
    if (I7()) {
        j1("info", "prefetch_system_context_non_interactive"), fj();
        return
    }
    if (EA()) j1("info", "prefetch_system_context_has_trust"), fj();
    else j1("info", "prefetch_system_context_skipped_no_trust")
}
// @from(Ln 573448, Col 0)
function Ke8() {
    if (S6(process.env.CLAUDE_CODE_EXIT_AFTER_FIRST_RENDER) || S9()) return;
    if (cUq(), $2(), qPA(), kt8(), S6(process.env.CLAUDE_CODE_USE_BEDROCK) && !S6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) uV8();
    if (S6(process.env.CLAUDE_CODE_USE_ANTHROPIC_AWS) && !S6(process.env.CLAUDE_CODE_SKIP_ANTHROPIC_AWS_AUTH)) uV8();
    if (S6(process.env.CLAUDE_CODE_USE_VERTEX) && !S6(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH)) eR1();
    if (yL8(b8(), AbortSignal.timeout(3000), []), Bq4(), c74(), Bgq(), _y.initialize(), !S9()) Em6.initialize();
    if (u8("tengu_drift_lantern", !1)) Promise.resolve().then(() => (eH5(), tH5)).then((q) => q.startEventLoopStallDetector())
}
// @from(Ln 573457, Col 0)
function KPA(q) {
    try {
        let K = q.trim(),
            _ = K.startsWith("{") && K.endsWith("}"),
            z;
        if (_) {
            if (!k5(K)) return tq("Error: Invalid JSON provided to --settings");
            z = vE6("claude-settings", ".json", {
                contentHash: K
            }), aJ(z, K, "utf8")
        } else {
            let {
                resolvedPath: Y
            } = vA(V8(), q);
            try {
                T07(Y, "utf8")
            } catch (A) {
                if (t1(A)) return tq(`Error: Settings file not found: ${Y}`);
                throw A
            }
            z = Y
        }
        P81(z), u0()
    } catch (K) {
        if (K instanceof Error) j6(K);
        return tq(`Error processing settings: ${b6(K)}`)
    }
}
// @from(Ln 573486, Col 0)
function _PA(q) {
    try {
        let K = FF7(q);
        L81(K), u0()
    } catch (K) {
        if (K instanceof Error) j6(K);
        return tq(`Error processing --setting-sources: ${b6(K)}`)
    }
}
// @from(Ln 573496, Col 0)
function zPA() {
    XK("eagerLoadSettings_start");
    let q = aW7("--settings");
    if (q) KPA(q);
    let K = aW7("--setting-sources");
    if (K !== void 0) _PA(K);
    XK("eagerLoadSettings_end")
}
// @from(Ln 573504, Col 0)
async function APA() {
    XK("main_function_start"), zw5(), process.on("exit", () => {
        jPA()
    }), process.on("SIGINT", () => {
        if (process.argv.includes("-p") || process.argv.includes("--print")) return;
        process.exit(0)
    }), XK("main_warning_handler_initialized");
    {
        let $ = process.argv.indexOf("--handle-uri");
        if ($ !== -1 && process.argv[$ + 1]) {
            let {
                enableConfigs: j
            } = await Promise.resolve().then(() => (h1(), P46));
            j();
            let H = process.argv[$ + 1],
                {
                    handleDeepLinkUri: J
                } = await Promise.resolve().then(() => (Y07(), z07)),
                X = await J(H);
            process.exit(X)
        }
        if (process.platform === "darwin" && process.env.__CFBundleIdentifier === "com.anthropic.claude-code-url-handler") {
            let {
                enableConfigs: j
            } = await Promise.resolve().then(() => (h1(), P46));
            j();
            let {
                handleUrlSchemeLaunch: H
            } = await Promise.resolve().then(() => (Y07(), z07)), J = await H();
            process.exit(J ?? 1)
        }
    }
    let q = process.argv.slice(2),
        K = q.includes("-p") || q.includes("--print"),
        _ = q.includes("--init-only"),
        z = q.some(($) => $.startsWith("--sdk-url")),
        Y = K || _ || z || !process.stdout.isTTY;
    if (Y) v46();
    A81(!Y), DH5(Y);
    let O = (() => {
        if (S6(process.env.GITHUB_ACTIONS)) return "github-action";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-ts") return "sdk-typescript";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-py") return "sdk-python";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-cli") return "sdk-cli";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-vscode") return "claude-vscode";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent") return "local-agent";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-desktop") return "claude-desktop";
        let $ = process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN || process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR;
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "remote" || $) return "remote";
        return "cli"
    })();
    $81(O);
    let w = process.env.CLAUDE_CODE_QUESTION_PREVIEW_FORMAT;
    if (w === "markdown" || w === "html") lO8(w);
    else if (!O.startsWith("sdk-") && O !== "claude-desktop" && O !== "local-agent" && O !== "remote") lO8("markdown");
    if (process.env.CLAUDE_CODE_ENVIRONMENT_KIND === "bridge") M81("remote-control");
    XK("main_client_type_determined"), zPA(), XK("main_before_run"), await wPA(), XK("main_after_run")
}
// @from(Ln 573562, Col 0)
async function OPA(q, K) {
    if (!process.stdin.isTTY && !process.argv.includes("mcp")) {
        if (K === "stream-json") return process.stdin.setEncoding("utf8"), process.stdin;
        process.stdin.setEncoding("utf8");
        let _ = "",
            z = (A) => {
                _ += A
            };
        process.stdin.on("data", z);
        let Y = await X71(process.stdin, 3000);
        if (process.stdin.off("data", z), Y) Dz6("Warning: no stdin data received in 3s, proceeding without it. If piping from a slow command, redirect stdin explicitly: < /dev/null to skip, or wait longer.");
        return [q, _].filter(Boolean).join(`
`)
    }
    return q
}