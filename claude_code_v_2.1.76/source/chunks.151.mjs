
// @from(Ln 384447, Col 4)
W9q = E(() => {
    TW6();
    Ly1();
    $5();
    nz6();
    D9q = ["Bash(git checkout --branch:*)", "Bash(git checkout -b:*)", "Bash(git add:*)", "Bash(git status:*)", "Bash(git push:*)", "Bash(git commit:*)", "Bash(gh pr create:*)", "Bash(gh pr edit:*)", "Bash(gh pr view:*)", "Bash(gh pr merge:*)", "ToolSearch", "mcp__slack__send_message", "mcp__claude_ai_Slack__slack_send_message"];
    DpY = {
        type: "prompt",
        name: "commit-push-pr",
        description: "Commit, push, and open a PR",
        allowedTools: D9q,
        context: "fork",
        get contentLength() {
            return X9q("main").length
        },
        isEnabled: () => !0,
        isHidden: !1,
        progressMessage: "creating commit and PR",
        userFacingName() {
            return "commit-push-pr"
        },
        source: "builtin",
        async getPromptForCommand(A, q) {
            let [K, Y] = await Promise.all([oT(), c3q(q.getAppState)]), z = X9q(K, Y);
            if (A && A.trim()) z += `

## Additional instructions from user

${A.trim()}`;
            return [{
                type: "text",
                text: await uB(z, {
                    ...q,
                    getAppState() {
                        let w = q.getAppState();
                        return {
                            ...w,
                            toolPermissionContext: {
                                ...w.toolPermissionContext,
                                alwaysAllowRules: {
                                    ...w.toolPermissionContext.alwaysAllowRules,
                                    command: D9q
                                }
                            }
                        }
                    }
                }, "/commit-push-pr")
            }]
        }
    }, P9q = DpY
})
// @from(Ln 384498, Col 4)
f9q = {}
// @from(Ln 384502, Col 0)
async function WpY(A, q, K, Y) {
    q.onCompactProgress?.({
        type: "hooks_start",
        hookType: "pre_compact"
    }), q.setSDKStatus?.("compacting");
    try {
        let [z, _] = await Promise.all([sT6({
            trigger: "manual",
            customInstructions: K || null
        }, q.abortController.signal), G9q(q, A)]), w = zp8(K, z.newCustomInstructions);
        q.setStreamMode?.("requesting"), q.setResponseLength?.(() => 0), q.onCompactProgress?.({
            type: "compact_start"
        });
        let O = await Y.reactiveCompactOnPromptTooLong(A, _, {
            customInstructions: w,
            trigger: "manual"
        });
        if (!O.ok) switch (O.reason) {
            case "too_few_groups":
                throw Error(aT6);
            case "aborted":
                throw Error(zl);
            case "exhausted":
            case "error":
                throw Error(oT6)
        }
        K16(void 0), gl(), bc6(), a2.cache.clear?.();
        let $ = [z.userDisplayMessage, O.result.userDisplayMessage].filter(Boolean).join(`
`) || void 0;
        return {
            type: "compact",
            compactionResult: {
                ...O.result,
                userDisplayMessage: $
            },
            displayText: oQ8(q, $)
        }
    } finally {
        q.setStreamMode?.("requesting"), q.setResponseLength?.(() => 0), q.onCompactProgress?.({
            type: "compact_end"
        }), q.setSDKStatus?.(null)
    }
}
// @from(Ln 384546, Col 0)
function oQ8(A, q) {
    let K = LZ6("tip"),
        Y = PX("app:toggleTranscript", "Global", "ctrl+o"),
        z = [...A.options.verbose ? [] : [`(${Y} to see full summary)`], ...q ? [q] : [], ...K ? [K] : []];
    return O1.dim("Compacted " + z.join(`
`))
}
// @from(Ln 384553, Col 0)
async function G9q(A, q) {
    let K = A.getAppState(),
        Y = await R0(A.options.tools, A.options.mainLoopModel, Array.from(K.toolPermissionContext.additionalWorkingDirectories.keys()), A.options.mcpClients),
        z = cg({
            mainThreadAgentDefinition: void 0,
            toolUseContext: A,
            customSystemPrompt: A.options.customSystemPrompt,
            defaultSystemPrompt: Y,
            appendSystemPrompt: A.options.appendSystemPrompt
        }),
        [_, w] = await Promise.all([a2(), mw()]);
    return {
        systemPrompt: z,
        userContext: _,
        systemContext: w,
        toolUseContext: A,
        forkContextMessages: q
    }
}
// @from(Ln 384572, Col 4)
Z9q = null
// @from(Ln 384573, Col 4)
PpY = async (A, q) => {
        let {
            abortController: K,
            messages: Y
        } = q;
        if (Y.length === 0) throw Error("No messages to compact");
        let z = A.trim();
        try {
            if (!z) {
                let $ = await lE1(Y, q.agentId);
                if ($) return a2.cache.clear?.(), gl(), bc6(), {
                    type: "compact",
                    compactionResult: $,
                    displayText: oQ8(q)
                }
            }
            if (Z9q?.isReactiveOnlyMode()) return await WpY(Y, q, z, Z9q);
            let w = (await pg(Y, q)).messages,
                O = await mf6(w, q, await G9q(q, w), !1, z, !1);
            return K16(void 0), bc6(), a2.cache.clear?.(), gl(), {
                type: "compact",
                compactionResult: O,
                displayText: oQ8(q, O.userDisplayMessage)
            }
        } catch (_) {
            if (K.signal.aborted) throw Error("Compaction canceled.");
            else if ($r(_, aT6)) throw Error(aT6);
            else if ($r(_, oT6)) throw Error(oT6);
            else throw _6(_), Error(`Error during compaction: ${_}`)
        }
    }
// @from(Ln 384604, Col 4)
T9q = E(() => {
    s8();
    bv();
    _l();
    jE();
    pc6();
    eR();
    jN1();
    iE1();
    eT6();
    k1();
    nE1();
    bt();
    aK();
    WZ1();
    ld();
    hw()
})
// @from(Ln 384622, Col 4)
ZpY
// @from(Ln 384622, Col 9)
v9q
// @from(Ln 384623, Col 4)
N9q = E(() => {
    A8();
    ZpY = {
        type: "local",
        name: "compact",
        description: "Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]",
        isEnabled: () => !t6(process.env.DISABLE_COMPACT),
        isHidden: !1,
        supportsNonInteractive: !0,
        argumentHint: "<optional custom summarization instructions>",
        load: () => Promise.resolve().then(() => (T9q(), f9q)),
        userFacingName() {
            return "compact"
        }
    }, v9q = ZpY
})
// @from(Ln 384640, Col 0)
function Gh(A) {
    let q = A6(11),
        {
            title: K,
            color: Y,
            defaultTab: z,
            children: _,
            hidden: w,
            useFullWidth: O,
            selectedTab: $,
            onTabChange: H,
            banner: j,
            disableNavigation: J
        } = A,
        {
            columns: M
        } = KA(),
        D = _.map(fpY),
        X = z ? D.findIndex((r) => z === r[0]) : 0,
        P = $ !== void 0,
        [W, Z] = rz6.useState(X !== -1 ? X : 0),
        G = P ? D.findIndex((r) => r[0] === $) : -1,
        f = P ? G !== -1 ? G : 0 : W,
        v = (r) => {
            let e = (f + D.length + r) % D.length,
                Y6 = D[e]?.[0];
            if (P && H && Y6) H(Y6);
            else Z(e)
        },
        N = !w && !J,
        V;
    if (q[0] !== N) V = {
        context: "Tabs",
        isActive: N
    }, q[0] = N, q[1] = V;
    else V = q[1];
    tA({
        "tabs:next": () => v(1),
        "tabs:previous": () => v(-1)
    }, V);
    let L = K ? f8(K) + 1 : 0,
        h = D.reduce(GpY, 0),
        R = L + h + 21,
        u = O ? Math.max(0, M - R) : 0,
        I = O ? M : void 0,
        g = m,
        B = "column",
        b = !w && JF.default.createElement(m, {
            flexDirection: "row",
            gap: 1
        }, K !== void 0 && JF.default.createElement(T, {
            bold: !0,
            color: Y
        }, K), D.map((r, e) => {
            let [Y6, H6] = r;
            return JF.default.createElement(T, {
                key: Y6,
                backgroundColor: Y && f === e ? Y : void 0,
                color: Y && f === e ? "inverseText" : void 0,
                bold: f === e
            }, " ", H6, " ")
        }), JF.default.createElement(T, {
            dimColor: !0
        }, "(←/→ or tab to cycle)"), u > 0 && JF.default.createElement(T, null, " ".repeat(u))),
        p = w ? 0 : 1,
        Q;
    if (q[2] !== _ || q[3] !== I || q[4] !== p) Q = JF.default.createElement(m, {
        width: I,
        marginTop: p
    }, _), q[2] = _, q[3] = I, q[4] = p, q[5] = Q;
    else Q = q[5];
    let U;
    if (q[6] !== g || q[7] !== j || q[8] !== b || q[9] !== Q) U = JF.default.createElement(g, {
        flexDirection: B
    }, b, j, Q), q[6] = g, q[7] = j, q[8] = b, q[9] = Q, q[10] = U;
    else U = q[10];
    return JF.default.createElement(aQ8.Provider, {
        value: {
            selectedTab: D[f][0],
            width: I
        }
    }, U)
}
// @from(Ln 384724, Col 0)
function GpY(A, q) {
    let [, K] = q;
    return A + (K ? f8(K) : 0) + 2 + 1
}
// @from(Ln 384729, Col 0)
function fpY(A) {
    return [A.props.id ?? A.props.title, A.props.title]
}
// @from(Ln 384733, Col 0)
function Hw(A) {
    let q = A6(3),
        {
            title: K,
            id: Y,
            children: z
        } = A,
        {
            selectedTab: _,
            width: w
        } = rz6.useContext(aQ8);
    if (_ !== (Y ?? K)) return null;
    let O;
    if (q[0] !== z || q[1] !== w) O = JF.default.createElement(m, {
        width: w
    }, z), q[0] = z, q[1] = w, q[2] = O;
    else O = q[2];
    return O
}
// @from(Ln 384753, Col 0)
function V9q() {
    let {
        width: A
    } = rz6.useContext(aQ8);
    return A
}
// @from(Ln 384759, Col 4)
JF
// @from(Ln 384759, Col 8)
rz6
// @from(Ln 384759, Col 13)
aQ8
// @from(Ln 384760, Col 4)
oz6 = E(() => {
    e6();
    i6();
    _7();
    _q();
    q3();
    JF = t(P6(), 1), rz6 = t(P6(), 1), aQ8 = rz6.createContext({
        selectedTab: void 0,
        width: void 0
    })
})
// @from(Ln 384772, Col 0)
function k9q(A) {
    let q = A6(3),
        K, Y;
    if (q[0] !== A) {
        Y = Symbol.for("react.early_return_sentinel");
        A: {
            let {
                context: z,
                flat: _
            } = A === void 0 ? {} : A,
            w = vO(),
            O = [];
            if (z?.readFileState) jB(z.readFileState).forEach((j) => {
                let J = z.readFileState.get(j);
                if (J && j.endsWith("/CLAUDE.md") && !w.some((M) => M.path === j)) O.push({
                    path: j,
                    content: J.content,
                    type: "Project",
                    isNested: !0
                })
            });
            let $ = [...w, ...O];
            if ($.length === 0) {
                Y = null;
                break A
            }
            if (_) {
                Y = zJ.createElement(m, {
                    flexDirection: "row",
                    columnGap: 1,
                    flexWrap: "wrap"
                }, $.map((j, J) => {
                    let M = $K(j.path),
                        D = j.isNested ? "nested" : qp8(j.type),
                        X = J < $.length - 1 ? "," : "";
                    return zJ.createElement(m, {
                        key: J,
                        flexDirection: "row",
                        flexShrink: 0
                    }, zJ.createElement(T, null, D, " "), zJ.createElement(T, {
                        dimColor: !0
                    }, "(", M, ")"), zJ.createElement(T, null, X))
                }));
                break A
            }
            let H = new Map;K = zJ.createElement(m, {
                flexDirection: "column"
            }, $.map((j, J) => {
                let M = $K(j.path),
                    D = j.isNested ? "nested: " : `${qp8(j.type)}: `,
                    X = j.parent ? (H.get(j.parent) ?? 0) + 1 : 0;
                if (H.set(j.path, X), X === 0) return zJ.createElement(T, {
                    key: J
                }, zJ.createElement(T, {
                    dimColor: !0
                }, " L "), `${D}${M}`);
                else {
                    let P = "  ".repeat(X - 1);
                    return zJ.createElement(T, {
                        key: J
                    }, " ".repeat(D.length + 2), P, zJ.createElement(T, {
                        dimColor: !0
                    }, " L "), M)
                }
            }))
        }
        q[0] = A, q[1] = K, q[2] = Y
    } else K = q[1], Y = q[2];
    if (Y !== Symbol.for("react.early_return_sentinel")) return Y;
    return K
}
// @from(Ln 384843, Col 4)
zJ
// @from(Ln 384844, Col 4)
E9q = E(() => {
    e6();
    i6();
    lM();
    Z7();
    Kp8();
    tP();
    zJ = t(P6(), 1)
})
// @from(Ln 384854, Col 0)
function TpY() {
    let A = R1(),
        K = ek(A) ?? $3.createElement(T, {
            dimColor: !0
        }, "/rename to add a name");
    return [{
        label: "Version",
        value: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION
    }, {
        label: "Session name",
        value: K
    }, {
        label: "Session ID",
        value: A
    }, {
        label: "cwd",
        value: G1()
    }, ...Rv1(), ...hv1()]
}
// @from(Ln 384881, Col 0)
function vpY({
    mainLoopModel: A,
    mcp: q,
    theme: K,
    context: Y
}) {
    return [{
        label: "Model",
        value: hU4(A)
    }, ...VU4(q.clients, Y.options.ideInstallationStatus, K), ...kU4(q.clients, K), {
        label: "Memory",
        value: $3.createElement(k9q, {
            context: Y,
            flat: !0
        })
    }, ...NU4(), ...yU4()]
}
// @from(Ln 384898, Col 0)
async function NpY() {
    return [...await LU4(), ...await RU4(), ...EU4()]
}
// @from(Ln 384902, Col 0)
function VpY(A) {
    let q = A6(8),
        {
            value: K
        } = A;
    if (Array.isArray(K)) {
        let Y;
        if (q[0] !== K) {
            let _;
            if (q[2] !== K.length) _ = (w, O) => $3.createElement(T, {
                key: O
            }, w, O < K.length - 1 ? "," : ""), q[2] = K.length, q[3] = _;
            else _ = q[3];
            Y = K.map(_), q[0] = K, q[1] = Y
        } else Y = q[1];
        let z;
        if (q[4] !== Y) z = $3.createElement(m, {
            flexWrap: "wrap",
            columnGap: 1,
            flexShrink: 99
        }, Y), q[4] = Y, q[5] = z;
        else z = q[5];
        return z
    }
    if (typeof K === "string") {
        let Y;
        if (q[6] !== K) Y = $3.createElement(T, null, K), q[6] = K, q[7] = Y;
        else Y = q[7];
        return Y
    }
    return K
}
// @from(Ln 384935, Col 0)
function y9q(A) {
    let q = A6(18),
        {
            context: K
        } = A,
        Y = M1(RpY),
        z = M1(LpY),
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = [], q[0] = _;
    else _ = q[0];
    let [w, O] = $3.useState(_), $;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) $ = [], q[1] = $;
    else $ = q[1];
    let [H, j] = $3.useState($), [J] = z7(), M, D;
    if (q[2] !== K || q[3] !== Y || q[4] !== z || q[5] !== J) M = () => {
        (async function() {
            let N = [TpY(), vpY({
                    mainLoopModel: Y,
                    mcp: z,
                    theme: J,
                    context: K
                })],
                V = await NpY();
            O(N), j(V)
        })()
    }, D = [Y, z, J, K], q[2] = K, q[3] = Y, q[4] = z, q[5] = J, q[6] = M, q[7] = D;
    else M = q[6], D = q[7];
    $3.useEffect(M, D);
    let X;
    if (q[8] !== w) X = w.map(EpY), q[8] = w, q[9] = X;
    else X = q[9];
    let P;
    if (q[10] !== H) P = H.length > 0 && $3.createElement(m, {
        flexDirection: "column",
        paddingBottom: 1
    }, $3.createElement(T, {
        bold: !0
    }, "System Diagnostics"), H.map(kpY)), q[10] = H, q[11] = P;
    else P = q[11];
    let W;
    if (q[12] !== X || q[13] !== P) W = $3.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, X, P), q[12] = X, q[13] = P, q[14] = W;
    else W = q[14];
    let Z;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) Z = $3.createElement(T, {
        dimColor: !0
    }, $3.createElement(O8, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })), q[15] = Z;
    else Z = q[15];
    let G;
    if (q[16] !== W) G = $3.createElement(m, {
        flexDirection: "column"
    }, W, Z), q[16] = W, q[17] = G;
    else G = q[17];
    return G
}
// @from(Ln 384998, Col 0)
function kpY(A, q) {
    return $3.createElement(m, {
        key: q,
        flexDirection: "row",
        gap: 1,
        paddingX: 1
    }, $3.createElement(T, {
        color: "error"
    }, a6.warning), typeof A === "string" ? $3.createElement(T, {
        wrap: "wrap"
    }, A) : A)
}
// @from(Ln 385011, Col 0)
function EpY(A, q) {
    return A.length > 0 && $3.createElement(m, {
        key: q,
        flexDirection: "column"
    }, A.map(ypY))
}
// @from(Ln 385018, Col 0)
function ypY(A, q) {
    let {
        label: K,
        value: Y
    } = A;
    return $3.createElement(m, {
        key: q,
        flexDirection: "row",
        gap: 1,
        flexShrink: 0
    }, K !== void 0 && $3.createElement(T, {
        bold: !0
    }, K, ":"), $3.createElement(VpY, {
        value: Y
    }))
}
// @from(Ln 385035, Col 0)
function LpY(A) {
    return A.mcp
}
// @from(Ln 385039, Col 0)
function RpY(A) {
    return A.mainLoopModel
}
// @from(Ln 385042, Col 4)
$3
// @from(Ln 385043, Col 4)
L9q = E(() => {
    e6();
    i6();
    b7();
    NA();
    T1();
    E9q();
    ib8();
    lA();
    Oq();
    OK();
    $3 = t(P6(), 1)
})
// @from(Ln 385056, Col 0)
async function R9q() {
    if (process.platform === "darwin") {
        let A = qU();
        if ((await q9(`security delete-generic-password -a $USER -s "${A}"`, {
                shell: !0,
                reject: !1
            })).exitCode !== 0) throw Error("Failed to delete keychain entry")
    }
}
// @from(Ln 385066, Col 0)
function vN(A) {
    return A.slice(-20)
}
// @from(Ln 385069, Col 4)
qn6 = E(() => {
    Gq6();
    WW()
})
// @from(Ln 385073, Col 4)
hy1 = {}
// @from(Ln 385080, Col 0)
function dl() {
    return w8("tengu_ccr_bridge", !1)
}
// @from(Ln 385083, Col 0)
async function Kn6() {
    return zn6("tengu_ccr_bridge")
}
// @from(Ln 385087, Col 0)
function Yn6() {
    {
        let A = mf("tengu_bridge_min_version", {
            minVersion: "0.0.0"
        });
        if (A.minVersion && iD6({
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.VERSION, A.minVersion)) return `Your version of Claude Code (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION}) is too old for Remote Control.
Version ${A.minVersion} or higher is required. Run \`claude update\` to update.`
    }
    return null
}
// @from(Ln 385104, Col 4)
MF = E(() => {
    HA()
})
// @from(Ln 385108, Col 0)
function Gv6(A) {
    let q = A6(59),
        {
            onThemeSelect: K,
            showIntroText: Y,
            helpText: z,
            showHelpTextBelow: _,
            hideEscToCancel: w,
            skipExitHandling: O,
            onCancel: $
        } = A,
        H = Y === void 0 ? !1 : Y,
        j = z === void 0 ? "" : z,
        J = _ === void 0 ? !1 : _,
        M = w === void 0 ? !1 : w,
        D = O === void 0 ? !1 : O,
        [X] = z7(),
        P = yX6(),
        {
            columns: W
        } = KA(),
        Z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Z = rm8(), q[0] = Z;
    else Z = q[0];
    let G = Z,
        f;
    if (q[1] !== X) f = G === null ? La4(X) : null, q[1] = X, q[2] = f;
    else f = q[2];
    let v = f,
        {
            setPreviewTheme: N,
            savePreview: V,
            cancelPreview: L
        } = Y$1(),
        h = M1(SpY) ?? !1,
        R = xA();
    f$1("ThemePicker");
    let u = Rq("theme:toggleSyntaxHighlighting", "ThemePicker", "ctrl+t"),
        I;
    if (q[3] !== R || q[4] !== h) I = () => {
        if (G === null) {
            let i = !h;
            TA("userSettings", {
                syntaxHighlightingDisabled: i
            }), R((l) => ({
                ...l,
                settings: {
                    ...l.settings,
                    syntaxHighlightingDisabled: i
                }
            }))
        }
    }, q[3] = R, q[4] = h, q[5] = I;
    else I = q[5];
    let g;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) g = {
        context: "ThemePicker"
    }, q[6] = g;
    else g = q[6];
    D8("theme:toggleSyntaxHighlighting", I, g);
    let B = IK(D ? hpY : void 0),
        b;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) b = [...[], {
        label: "Dark mode",
        value: "dark"
    }, {
        label: "Light mode",
        value: "light"
    }, {
        label: "Dark mode (colorblind-friendly)",
        value: "dark-daltonized"
    }, {
        label: "Light mode (colorblind-friendly)",
        value: "light-daltonized"
    }, {
        label: "Dark mode (ANSI colors only)",
        value: "dark-ansi"
    }, {
        label: "Light mode (ANSI colors only)",
        value: "light-ansi"
    }], q[7] = b;
    else b = q[7];
    let p = b,
        Q;
    if (q[8] !== H) Q = H ? jK.createElement(T, null, "Let's get started.") : jK.createElement(T, {
        bold: !0,
        color: "permission"
    }, "Theme"), q[8] = H, q[9] = Q;
    else Q = q[9];
    let U;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) U = jK.createElement(T, {
        bold: !0
    }, "Choose the text style that looks best with your terminal"), q[10] = U;
    else U = q[10];
    let r;
    if (q[11] !== j || q[12] !== J) r = j && !J && jK.createElement(T, {
        dimColor: !0
    }, j), q[11] = j, q[12] = J, q[13] = r;
    else r = q[13];
    let e;
    if (q[14] !== r) e = jK.createElement(m, {
        flexDirection: "column"
    }, U, r), q[14] = r, q[15] = e;
    else e = q[15];
    let Y6;
    if (q[16] !== N) Y6 = (i) => {
        N(i)
    }, q[16] = N, q[17] = Y6;
    else Y6 = q[17];
    let H6;
    if (q[18] !== K || q[19] !== V) H6 = (i) => {
        V(), K(i)
    }, q[18] = K, q[19] = V, q[20] = H6;
    else H6 = q[20];
    let J6;
    if (q[21] !== L || q[22] !== $ || q[23] !== D) J6 = D ? () => {
        L(), $?.()
    } : async () => {
        L(), await Vq(0)
    }, q[21] = L, q[22] = $, q[23] = D, q[24] = J6;
    else J6 = q[24];
    let K6;
    if (q[25] !== Y6 || q[26] !== H6 || q[27] !== J6 || q[28] !== P) K6 = jK.createElement(T8, {
        options: p,
        onFocus: Y6,
        onChange: H6,
        onCancel: J6,
        visibleOptionCount: p.length,
        defaultValue: P,
        defaultFocusValue: P
    }), q[25] = Y6, q[26] = H6, q[27] = J6, q[28] = P, q[29] = K6;
    else K6 = q[29];
    let s;
    if (q[30] !== Q || q[31] !== e || q[32] !== K6) s = jK.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, Q, e, K6), q[30] = Q, q[31] = e, q[32] = K6, q[33] = s;
    else s = q[33];
    let X6;
    if (q[34] === Symbol.for("react.memo_cache_sentinel")) X6 = {
        oldStart: 1,
        newStart: 1,
        oldLines: 3,
        newLines: 3,
        lines: [" function greet() {", '-  console.log("Hello, World!");', '+  console.log("Hello, Claude!");', " }"]
    }, q[34] = X6;
    else X6 = q[34];
    let z6;
    if (q[35] !== W) z6 = jK.createElement(m, {
        flexDirection: "column",
        borderTop: !0,
        borderBottom: !0,
        borderLeft: !1,
        borderRight: !1,
        borderStyle: "dashed",
        borderColor: "subtle"
    }, jK.createElement(DN, {
        patch: X6,
        dim: !1,
        filePath: "demo.js",
        firstLine: null,
        width: W
    })), q[35] = W, q[36] = z6;
    else z6 = q[36];
    let N6 = G === "env" ? `Syntax highlighting disabled (via CLAUDE_CODE_SYNTAX_HIGHLIGHT=${process.env.CLAUDE_CODE_SYNTAX_HIGHLIGHT})` : G === "build" ? "Syntax highlighting available only in native build" : h ? `Syntax highlighting disabled (${u} to enable)` : v ? `Syntax theme: ${v.theme}${v.source?` (from ${v.source})`:""} (${u} to disable)` : `Syntax highlighting enabled (${u} to disable)`,
        $6;
    if (q[37] !== N6) $6 = jK.createElement(T, {
        dimColor: !0
    }, " ", N6), q[37] = N6, q[38] = $6;
    else $6 = q[38];
    let n;
    if (q[39] !== z6 || q[40] !== $6) n = jK.createElement(m, {
        flexDirection: "column",
        width: "100%"
    }, z6, $6), q[39] = z6, q[40] = $6, q[41] = n;
    else n = q[41];
    let o;
    if (q[42] !== s || q[43] !== n) o = jK.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, s, n), q[42] = s, q[43] = n, q[44] = o;
    else o = q[44];
    let a = o;
    if (!H) {
        let i;
        if (q[45] !== a) i = jK.createElement(m, {
            flexDirection: "column"
        }, a), q[45] = a, q[46] = i;
        else i = q[46];
        let l;
        if (q[47] !== j || q[48] !== J) l = J && j && jK.createElement(m, {
            marginLeft: 3
        }, jK.createElement(T, {
            dimColor: !0
        }, j)), q[47] = j, q[48] = J, q[49] = l;
        else l = q[49];
        let q6;
        if (q[50] !== B || q[51] !== M) q6 = !M && jK.createElement(m, null, jK.createElement(T, {
            dimColor: !0,
            italic: !0
        }, B.pending ? jK.createElement(jK.Fragment, null, "Press ", B.keyName, " again to exit") : jK.createElement(C8, null, jK.createElement(a1, {
            shortcut: "Enter",
            action: "select"
        }), jK.createElement(a1, {
            shortcut: "Esc",
            action: "cancel"
        })))), q[50] = B, q[51] = M, q[52] = q6;
        else q6 = q[52];
        let w6;
        if (q[53] !== l || q[54] !== q6) w6 = jK.createElement(m, {
            marginTop: 1
        }, l, q6), q[53] = l, q[54] = q6, q[55] = w6;
        else w6 = q[55];
        let O6;
        if (q[56] !== i || q[57] !== w6) O6 = jK.createElement(jK.Fragment, null, i, w6), q[56] = i, q[57] = w6, q[58] = O6;
        else O6 = q[58];
        return O6
    }
    return a
}
// @from(Ln 385329, Col 0)
function hpY() {}
// @from(Ln 385331, Col 0)
function SpY(A) {
    return A.settings.syntaxHighlightingDisabled
}
// @from(Ln 385334, Col 4)
jK
// @from(Ln 385335, Col 4)
Sy1 = E(() => {
    e6();
    i6();
    o9();
    p66();
    PO();
    c_();
    i6();
    _q();
    Lq();
    Xq();
    Mz6();
    i8();
    NA();
    _7();
    Rj();
    Rm();
    jK = t(P6(), 1)
})
// @from(Ln 385355, Col 0)
function S9q(A, q) {
    if (!yC(q)) return;
    let K = rq6(q, A) ?? "high",
        Y = la(K);
    return `${_n6(Y)} ${Y} · /effort`
}
// @from(Ln 385362, Col 0)
function _n6(A) {
    switch (A) {
        case "low":
            return Vw4;
        case "medium":
            return kw4;
        case "high":
            return vE8;
        case "max":
            return Ew4;
        default:
            return vE8
    }
}
// @from(Ln 385376, Col 4)
Cy1 = E(() => {
    qw();
    wk()
})
// @from(Ln 385381, Col 0)
function fv6(A) {
    let q = A6(82),
        {
            initial: K,
            sessionModel: Y,
            onSelect: z,
            onCancel: _,
            isStandaloneCommand: w,
            showFastModeNotice: O,
            headerText: $,
            skipSettingsWrite: H
        } = A,
        j = xA(),
        J = IK(),
        M = K === null ? by1 : K,
        [D, X] = Iy1.useState(M),
        P = M1(xpY),
        [W, Z] = Iy1.useState(!1),
        G = M1(bpY),
        f;
    if (q[0] !== G) f = G !== void 0 ? la(G) : void 0, q[0] = G, q[1] = f;
    else f = q[1];
    let [v, N] = Iy1.useState(f), V = P ?? !1, L;
    if (q[2] !== V) L = Ez6(V), q[2] = V, q[3] = L;
    else L = q[3];
    let h = L,
        R;
    A: {
        if (K !== null && !h.some((V6) => V6.value === K)) {
            let V6;
            if (q[4] !== K) V6 = oR(K), q[4] = K, q[5] = V6;
            else V6 = q[5];
            let b6;
            if (q[6] !== K || q[7] !== V6) b6 = {
                value: K,
                label: V6,
                description: "Current model"
            }, q[6] = K, q[7] = V6, q[8] = b6;
            else b6 = q[8];
            let E6;
            if (q[9] !== h || q[10] !== b6) E6 = [...h, b6], q[9] = h, q[10] = b6, q[11] = E6;
            else E6 = q[11];
            R = E6;
            break A
        }
        R = h
    }
    let u = R,
        I;
    if (q[12] !== u) I = u.map(IpY), q[12] = u, q[13] = I;
    else I = q[13];
    let g = I,
        B;
    if (q[14] !== M || q[15] !== g) B = g.some((V6) => V6.value === M) ? M : g[0]?.value ?? void 0, q[14] = M, q[15] = g, q[16] = B;
    else B = q[16];
    let b = B,
        p = Math.min(10, g.length),
        Q = Math.max(0, g.length - p),
        U;
    if (q[17] !== D || q[18] !== g) U = g.find((V6) => V6.value === D)?.label, q[17] = D, q[18] = g, q[19] = U;
    else U = q[19];
    let r = U,
        e, Y6;
    if (q[20] !== D) {
        let V6 = tQ8(D);
        e = V6 ? yC(V6) : !1, Y6 = V6 ? hx6(V6) : !1, q[20] = D, q[21] = e, q[22] = Y6
    } else e = q[21], Y6 = q[22];
    let H6 = Y6,
        J6;
    if (q[23] !== D) J6 = sQ8(D), q[23] = D, q[24] = J6;
    else J6 = q[24];
    let K6 = J6,
        s = v === "max" && !H6 ? "high" : v,
        X6;
    if (q[25] !== G || q[26] !== W) X6 = (V6) => {
        if (X(V6), !W && G === void 0) N(sQ8(V6))
    }, q[25] = G, q[26] = W, q[27] = X6;
    else X6 = q[27];
    let z6 = X6,
        N6;
    if (q[28] !== K6 || q[29] !== e || q[30] !== H6) N6 = (V6) => {
        if (!e) return;
        N((b6) => upY(b6 ?? K6, V6, H6)), Z(!0)
    }, q[28] = K6, q[29] = e, q[30] = H6, q[31] = N6;
    else N6 = q[31];
    let $6 = N6,
        n;
    if (q[32] !== $6) n = {
        "modelPicker:decreaseEffort": () => $6("left"),
        "modelPicker:increaseEffort": () => $6("right")
    }, q[32] = $6, q[33] = n;
    else n = q[33];
    let o;
    if (q[34] === Symbol.for("react.memo_cache_sentinel")) o = {
        context: "ModelPicker"
    }, q[34] = o;
    else o = q[34];
    tA(n, o);
    let a;
    if (q[35] !== v || q[36] !== W || q[37] !== z || q[38] !== j || q[39] !== H) a = function(b6) {
        if (d("tengu_model_command_menu_effort", {
                effort: v
            }), !H) {
            let c6 = cG7(v, sQ8(b6), L8("userSettings")?.effortLevel, W),
                K1 = nq6(c6);
            if (K1 !== void 0) TA("userSettings", {
                effortLevel: K1
            });
            j((j6) => ({
                ...j6,
                effortValue: c6
            }))
        }
        let E6 = tQ8(b6),
            U6 = W && E6 && yC(E6) ? v : void 0;
        if (b6 === by1) {
            z(null, U6);
            return
        }
        z(b6, U6)
    }, q[35] = v, q[36] = W, q[37] = z, q[38] = j, q[39] = H, q[40] = a;
    else a = q[40];
    let i = a,
        l;
    if (q[41] === Symbol.for("react.memo_cache_sentinel")) l = a4.createElement(T, {
        color: "remember",
        bold: !0
    }, "Select model"), q[41] = l;
    else l = q[41];
    let q6 = $ ?? "Switch between Claude models. Applies to this session and future Claude Code sessions. For other/previous model names, specify with --model.",
        w6;
    if (q[42] !== q6) w6 = a4.createElement(T, {
        dimColor: !0
    }, q6), q[42] = q6, q[43] = w6;
    else w6 = q[43];
    let O6;
    if (q[44] !== Y) O6 = Y && a4.createElement(T, {
        dimColor: !0
    }, "Currently using ", oR(Y), " for this session (set by plan mode). Selecting a model will undo this."), q[44] = Y, q[45] = O6;
    else O6 = q[45];
    let L6;
    if (q[46] !== w6 || q[47] !== O6) L6 = a4.createElement(m, {
        marginBottom: 1,
        flexDirection: "column"
    }, l, w6, O6), q[46] = w6, q[47] = O6, q[48] = L6;
    else L6 = q[48];
    let y6 = _ ?? CpY,
        G6;
    if (q[49] !== z6 || q[50] !== i || q[51] !== b || q[52] !== M || q[53] !== g || q[54] !== y6 || q[55] !== p) G6 = a4.createElement(m, {
        flexDirection: "column"
    }, a4.createElement(T8, {
        defaultValue: M,
        defaultFocusValue: b,
        options: g,
        onChange: i,
        onFocus: z6,
        onCancel: y6,
        visibleOptionCount: p
    })), q[49] = z6, q[50] = i, q[51] = b, q[52] = M, q[53] = g, q[54] = y6, q[55] = p, q[56] = G6;
    else G6 = q[56];
    let R6;
    if (q[57] !== Q) R6 = Q > 0 && a4.createElement(m, {
        paddingLeft: 3
    }, a4.createElement(T, {
        dimColor: !0
    }, "and ", Q, " more…")), q[57] = Q, q[58] = R6;
    else R6 = q[58];
    let T6;
    if (q[59] !== G6 || q[60] !== R6) T6 = a4.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, G6, R6), q[59] = G6, q[60] = R6, q[61] = T6;
    else T6 = q[61];
    let D6;
    if (q[62] !== s || q[63] !== K6 || q[64] !== r || q[65] !== e) D6 = a4.createElement(m, {
        marginBottom: 1,
        flexDirection: "column"
    }, e ? a4.createElement(T, {
        dimColor: !0
    }, a4.createElement(C9q, {
        effort: s
    }), " ", EU(s), " effort", s === K6 ? " (default)" : "", " ", a4.createElement(T, {
        color: "subtle"
    }, "← → to adjust")) : a4.createElement(T, {
        color: "subtle"
    }, a4.createElement(C9q, {
        effort: void 0
    }), " Effort not supported", r ? ` for ${r}` : "")), q[62] = s, q[63] = K6, q[64] = r, q[65] = e, q[66] = D6;
    else D6 = q[66];
    let Q6;
    if (q[67] !== O) Q6 = Dq() ? O ? a4.createElement(m, {
        marginBottom: 1
    }, a4.createElement(T, {
        dimColor: !0
    }, "Fast mode is ", a4.createElement(T, {
        bold: !0
    }, "ON"), " and available with", " ", Ok, " only (/fast). Switching to other models turn off fast mode.")) : yj() && !Jm() ? a4.createElement(m, {
        marginBottom: 1
    }, a4.createElement(T, {
        dimColor: !0
    }, "Use ", a4.createElement(T, {
        bold: !0
    }, "/fast"), " to turn on Fast mode (", Ok, " only).")) : null : null, q[67] = O, q[68] = Q6;
    else Q6 = q[68];
    let k6;
    if (q[69] !== L6 || q[70] !== T6 || q[71] !== D6 || q[72] !== Q6) k6 = a4.createElement(m, {
        flexDirection: "column"
    }, L6, T6, D6, Q6), q[69] = L6, q[70] = T6, q[71] = D6, q[72] = Q6, q[73] = k6;
    else k6 = q[73];
    let Z6;
    if (q[74] !== J || q[75] !== w) Z6 = w && a4.createElement(T, {
        dimColor: !0,
        italic: !0
    }, J.pending ? a4.createElement(a4.Fragment, null, "Press ", J.keyName, " again to exit") : a4.createElement(C8, null, a4.createElement(a1, {
        shortcut: "Enter",
        action: "confirm"
    }), a4.createElement(O8, {
        action: "select:cancel",
        context: "Select",
        fallback: "Esc",
        description: "exit"
    }))), q[74] = J, q[75] = w, q[76] = Z6;
    else Z6 = q[76];
    let u6;
    if (q[77] !== k6 || q[78] !== Z6) u6 = a4.createElement(m, {
        flexDirection: "column"
    }, k6, Z6), q[77] = k6, q[78] = Z6, q[79] = u6;
    else u6 = q[79];
    let C6 = u6;
    if (!w) return C6;
    let o6;
    if (q[80] !== C6) o6 = a4.createElement(S3, {
        color: "permission"
    }, C6), q[80] = C6, q[81] = o6;
    else o6 = q[81];
    return o6
}
// @from(Ln 385619, Col 0)
function CpY() {}
// @from(Ln 385621, Col 0)
function IpY(A) {
    return {
        ...A,
        value: A.value === null ? by1 : A.value
    }
}
// @from(Ln 385628, Col 0)
function bpY(A) {
    return A.effortValue
}
// @from(Ln 385632, Col 0)
function xpY(A) {
    return Dq() ? A.fastMode : !1
}
// @from(Ln 385636, Col 0)
function tQ8(A) {
    if (!A) return;
    return A === by1 ? g0() : H5(A)
}
// @from(Ln 385641, Col 0)
function C9q(A) {
    let q = A6(5),
        {
            effort: K
        } = A,
        Y = K ? "claude" : "subtle",
        z = K ?? "low",
        _;
    if (q[0] !== z) _ = _n6(z), q[0] = z, q[1] = _;
    else _ = q[1];
    let w;
    if (q[2] !== Y || q[3] !== _) w = a4.createElement(T, {
        color: Y
    }, _), q[2] = Y, q[3] = _, q[4] = w;
    else w = q[4];
    return w
}
// @from(Ln 385659, Col 0)
function upY(A, q, K) {
    let Y = K ? ["low", "medium", "high", "max"] : ["low", "medium", "high"],
        z = Y.indexOf(A),
        _ = z !== -1 ? z : Y.indexOf("high");
    if (q === "right") return Y[(_ + 1) % Y.length];
    else return Y[(_ - 1 + Y.length) % Y.length]
}
// @from(Ln 385667, Col 0)
function sQ8(A) {
    let q = tQ8(A) ?? g0(),
        K = Cx6(q);
    return K !== void 0 ? la(K) : "high"
}
// @from(Ln 385672, Col 4)
a4
// @from(Ln 385672, Col 8)
Iy1
// @from(Ln 385672, Col 13)
by1 = "__NO_PREFERENCE__"
// @from(Ln 385673, Col 4)
xy1 = E(() => {
    e6();
    i6();
    Cy1();
    _7();
    Ou6();
    wi6();
    z4();
    wk();
    i8();
    NA();
    o9();
    PO();
    FJ();
    Lq();
    OK();
    Xq();
    V1();
    FW();
    a4 = t(P6(), 1), Iy1 = t(P6(), 1)
})
// @from(Ln 385695, Col 0)
function az6(A, q, K) {
    if (!iA()) return !1;
    if (q) return !0;
    if (A === null || !Cf(A)) return !1;
    let Y = A.toLowerCase().replace(/\[1m\]$/, "").trim(),
        z = Y === "opus" || Y.includes("opus-4-6"),
        _ = Y === "sonnet" || Y.includes("sonnet-4-6");
    if (z && K) return !1;
    return z || _
}
// @from(Ln 385705, Col 4)
uy1 = E(() => {
    fA();
    xJ()
})
// @from(Ln 385709, Col 4)
I9q = {}
// @from(Ln 385714, Col 0)
function eQ8(A) {
    let q = A6(18),
        {
            onDone: K,
            isStandaloneDialog: Y,
            externalIncludes: z
        } = A,
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = [], q[0] = _;
    else _ = q[0];
    DF.default.useEffect(FpY, _);
    let w;
    if (q[1] !== K) w = (G) => {
        if (G === "no") d("tengu_claude_md_external_includes_dialog_declined", {}), c2(gpY);
        else d("tengu_claude_md_external_includes_dialog_accepted", {}), c2(BpY);
        K()
    }, q[1] = K, q[2] = w;
    else w = q[2];
    let O = w,
        $;
    if (q[3] !== O) $ = () => {
        O("no")
    }, q[3] = O, q[4] = $;
    else $ = q[4];
    let H = $,
        j = !Y,
        J = !Y,
        M;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) M = DF.default.createElement(T, null, "This project's CLAUDE.md imports files outside the current working directory. Never allow this for third-party repositories."), q[5] = M;
    else M = q[5];
    let D;
    if (q[6] !== z) D = z && z.length > 0 && DF.default.createElement(m, {
        flexDirection: "column"
    }, DF.default.createElement(T, {
        dimColor: !0
    }, "External imports:"), z.map(mpY)), q[6] = z, q[7] = D;
    else D = q[7];
    let X;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) X = DF.default.createElement(T, {
        dimColor: !0
    }, "Important: Only use Claude Code with files you trust. Accessing untrusted files may pose security risks", " ", DF.default.createElement(y7, {
        url: "https://code.claude.com/docs/en/security"
    }), " "), q[8] = X;
    else X = q[8];
    let P;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) P = [{
        label: "Yes, allow external imports",
        value: "yes"
    }, {
        label: "No, disable external imports",
        value: "no"
    }], q[9] = P;
    else P = q[9];
    let W;
    if (q[10] !== O) W = DF.default.createElement(T8, {
        options: P,
        onChange: (G) => O(G)
    }), q[10] = O, q[11] = W;
    else W = q[11];
    let Z;
    if (q[12] !== H || q[13] !== W || q[14] !== j || q[15] !== J || q[16] !== D) Z = DF.default.createElement(m8, {
        title: "Allow external CLAUDE.md file imports?",
        color: "warning",
        onCancel: H,
        hideBorder: j,
        hideInputGuide: J
    }, M, D, X, W), q[12] = H, q[13] = W, q[14] = j, q[15] = J, q[16] = D, q[17] = Z;
    else Z = q[17];
    return Z
}
// @from(Ln 385785, Col 0)
function mpY(A, q) {
    return DF.default.createElement(T, {
        key: q,
        dimColor: !0
    }, "  ", A.path)
}
// @from(Ln 385792, Col 0)
function BpY(A) {
    return {
        ...A,
        hasClaudeMdExternalIncludesApproved: !0,
        hasClaudeMdExternalIncludesWarningShown: !0
    }
}
// @from(Ln 385800, Col 0)
function gpY(A) {
    return {
        ...A,
        hasClaudeMdExternalIncludesApproved: !1,
        hasClaudeMdExternalIncludesWarningShown: !0
    }
}
// @from(Ln 385808, Col 0)
function FpY() {
    d("tengu_claude_md_includes_dialog_shown", {})
}
// @from(Ln 385811, Col 4)
DF
// @from(Ln 385812, Col 4)
AU8 = E(() => {
    e6();
    i6();
    o9();
    k8();
    V1();
    i6();
    wq();
    DF = t(P6(), 1)
})
// @from(Ln 385823, Col 0)
function b9q(A) {
    let q = A6(17),
        {
            currentVersion: K,
            onChoice: Y
        } = A,
        z;
    if (q[0] !== Y) z = function(W) {
        Y(W)
    }, q[0] = Y, q[1] = z;
    else z = q[1];
    let _ = z,
        w;
    if (q[2] !== Y) w = function() {
        Y("cancel")
    }, q[2] = Y, q[3] = w;
    else w = q[3];
    let O = w,
        $;
    if (q[4] !== K) $ = wn6.default.createElement(T, null, "The stable channel may have an older version than what you're currently running (", K, ")."), q[4] = K, q[5] = $;
    else $ = q[5];
    let H;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) H = wn6.default.createElement(T, {
        dimColor: !0
    }, "How would you like to handle this?"), q[6] = H;
    else H = q[6];
    let j;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) j = {
        label: "Allow possible downgrade to stable version",
        value: "downgrade"
    }, q[7] = j;
    else j = q[7];
    let J = `Stay on current version (${K}) until stable catches up`,
        M;
    if (q[8] !== J) M = [j, {
        label: J,
        value: "stay"
    }], q[8] = J, q[9] = M;
    else M = q[9];
    let D;
    if (q[10] !== _ || q[11] !== M) D = wn6.default.createElement(T8, {
        options: M,
        onChange: _
    }), q[10] = _, q[11] = M, q[12] = D;
    else D = q[12];
    let X;
    if (q[13] !== O || q[14] !== $ || q[15] !== D) X = wn6.default.createElement(m8, {
        title: "Switch to Stable Channel",
        onCancel: O,
        color: "permission",
        hideBorder: !0,
        hideInputGuide: !0
    }, $, H, D), q[13] = O, q[14] = $, q[15] = D, q[16] = X;
    else X = q[16];
    return X
}
// @from(Ln 385879, Col 4)
wn6
// @from(Ln 385880, Col 4)
x9q = E(() => {
    e6();
    i6();
    o9();
    wq();
    wn6 = t(P6(), 1)
})
// @from(Ln 385888, Col 0)
function u9q(A) {
    return Object.entries(A).map(([q, K]) => ({
        label: K?.name ?? ppY,
        value: q,
        description: K?.description ?? QpY
    }))
}
// @from(Ln 385896, Col 0)
function m9q(A) {
    let q = A6(16),
        {
            initialStyle: K,
            onComplete: Y,
            onCancel: z,
            isStandaloneCommand: _
        } = A,
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = [], q[0] = w;
    else w = q[0];
    let [O, $] = On6.useState(w), [H, j] = On6.useState(!0), J, M;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) J = () => {
        Tv6(G1()).then((v) => {
            let N = u9q(v);
            $(N), j(!1)
        }).catch(() => {
            let v = u9q(aY6);
            $(v), j(!1)
        })
    }, M = [], q[1] = J, q[2] = M;
    else J = q[1], M = q[2];
    On6.useEffect(J, M);
    let D;
    if (q[3] !== Y) D = (v) => {
        Y(v)
    }, q[3] = Y, q[4] = D;
    else D = q[4];
    let X = D,
        P = !_,
        W = !_,
        Z;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) Z = vE.createElement(m, {
        marginTop: 1
    }, vE.createElement(T, {
        dimColor: !0
    }, "This changes how Claude Code communicates with you")), q[5] = Z;
    else Z = q[5];
    let G;
    if (q[6] !== X || q[7] !== K || q[8] !== H || q[9] !== O) G = vE.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, Z, H ? vE.createElement(T, {
        dimColor: !0
    }, "Loading output styles…") : vE.createElement(T8, {
        options: O,
        onChange: X,
        visibleOptionCount: 10,
        defaultValue: K
    })), q[6] = X, q[7] = K, q[8] = H, q[9] = O, q[10] = G;
    else G = q[10];
    let f;
    if (q[11] !== z || q[12] !== P || q[13] !== W || q[14] !== G) f = vE.createElement(m8, {
        title: "Preferred output style",
        onCancel: z,
        hideInputGuide: P,
        hideBorder: W
    }, G), q[11] = z, q[12] = P, q[13] = W, q[14] = G, q[15] = f;
    else f = q[15];
    return f
}
// @from(Ln 385957, Col 4)
vE
// @from(Ln 385957, Col 8)
On6
// @from(Ln 385957, Col 13)
ppY = "Default"
// @from(Ln 385958, Col 4)
QpY = "Claude completes coding tasks efficiently and provides concise responses"
// @from(Ln 385959, Col 4)
B9q = E(() => {
    e6();
    i6();
    v3();
    aB();
    lA();
    wq();
    vE = t(P6(), 1), On6 = t(P6(), 1)
})
// @from(Ln 385969, Col 0)
function g9q(A) {
    let q = A6(13),
        {
            initialLanguage: K,
            onComplete: Y,
            onCancel: z
        } = A,
        [_, w] = qU8.useState(K),
        [O, $] = qU8.useState((K ?? "").length),
        H;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) H = {
        context: "Settings"
    }, q[0] = H;
    else H = q[0];
    D8("confirm:no", z, H);
    let j;
    if (q[1] !== _ || q[2] !== Y) j = function() {
        let f = _?.trim();
        Y(f || void 0)
    }, q[1] = _, q[2] = Y, q[3] = j;
    else j = q[3];
    let J = j,
        M;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) M = sz6.default.createElement(T, null, "Enter your preferred response and voice language:"), q[4] = M;
    else M = q[4];
    let D;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) D = sz6.default.createElement(T, null, a6.pointer), q[5] = D;
    else D = q[5];
    let X = _ ?? "",
        P;
    if (q[6] !== O || q[7] !== J || q[8] !== X) P = sz6.default.createElement(m, {
        flexDirection: "row",
        gap: 1
    }, D, sz6.default.createElement(J5, {
        value: X,
        onChange: w,
        onSubmit: J,
        focus: !0,
        showCursor: !0,
        placeholder: `e.g., Japanese, 日本語, Español${a6.ellipsis}`,
        columns: 60,
        cursorOffset: O,
        onChangeCursorOffset: $
    })), q[6] = O, q[7] = J, q[8] = X, q[9] = P;
    else P = q[9];
    let W;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) W = sz6.default.createElement(T, {
        dimColor: !0
    }, "Leave empty for default (English)"), q[10] = W;
    else W = q[10];
    let Z;
    if (q[11] !== P) Z = sz6.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, M, P, W), q[11] = P, q[12] = Z;
    else Z = q[12];
    return Z
}
// @from(Ln 386027, Col 4)
sz6
// @from(Ln 386027, Col 9)
qU8
// @from(Ln 386028, Col 4)
F9q = E(() => {
    e6();
    i6();
    AH();
    b7();
    _7();
    sz6 = t(P6(), 1), qU8 = t(P6(), 1)
})
// @from(Ln 386037, Col 0)
function fh(A) {
    let q = A6(15),
        {
            query: K,
            placeholder: Y,
            isFocused: z,
            isTerminalFocused: _,
            prefix: w,
            width: O,
            cursorOffset: $
        } = A,
        H = Y === void 0 ? "Search…" : Y,
        j = w === void 0 ? "⌕" : w,
        J = $ ?? K.length,
        M = z ? "suggestion" : void 0,
        D = !z,
        X = !z,
        P;
    if (q[0] !== z || q[1] !== _ || q[2] !== J || q[3] !== H || q[4] !== K) P = z ? QX.default.createElement(QX.default.Fragment, null, K ? _ ? QX.default.createElement(QX.default.Fragment, null, QX.default.createElement(T, null, K.slice(0, J)), QX.default.createElement(T, {
        inverse: !0
    }, J < K.length ? K[J] : " "), J < K.length && QX.default.createElement(T, null, K.slice(J + 1))) : QX.default.createElement(T, null, K) : _ ? QX.default.createElement(QX.default.Fragment, null, QX.default.createElement(T, {
        inverse: !0
    }, H.charAt(0)), QX.default.createElement(T, {
        dimColor: !0
    }, H.slice(1))) : QX.default.createElement(T, {
        dimColor: !0
    }, H)) : K ? QX.default.createElement(T, null, K) : QX.default.createElement(T, null, H), q[0] = z, q[1] = _, q[2] = J, q[3] = H, q[4] = K, q[5] = P;
    else P = q[5];
    let W;
    if (q[6] !== j || q[7] !== X || q[8] !== P) W = QX.default.createElement(T, {
        dimColor: X
    }, j, " ", P), q[6] = j, q[7] = X, q[8] = P, q[9] = W;
    else W = q[9];
    let Z;
    if (q[10] !== M || q[11] !== D || q[12] !== W || q[13] !== O) Z = QX.default.createElement(m, {
        flexShrink: 0,
        borderStyle: "round",
        borderColor: M,
        borderDimColor: D,
        paddingX: 1,
        width: O
    }, W), q[10] = M, q[11] = D, q[12] = W, q[13] = O, q[14] = Z;
    else Z = q[14];
    return Z
}
// @from(Ln 386082, Col 4)
QX
// @from(Ln 386083, Col 4)
H16 = E(() => {
    e6();
    i6();
    QX = t(P6(), 1)
})
// @from(Ln 386089, Col 0)
function UpY(A, q) {
    if (A.ctrl && (q === "k" || q === "u" || q === "w")) return !0;
    if (A.meta && A.backspace) return !0;
    return !1
}
// @from(Ln 386095, Col 0)
function dpY(A, q) {
    return (A.ctrl || A.meta) && q === "y"
}
// @from(Ln 386099, Col 0)
function Th({
    isActive: A,
    onExit: q,
    onExitUp: K,
    columns: Y,
    passthroughCtrlKeys: z = [],
    initialQuery: _ = ""
}) {
    let {
        columns: w
    } = KA(), O = Y ?? w, [$, H] = $n6.useState(_), [j, J] = $n6.useState(_.length), M = $n6.useCallback((D) => {
        H(D), J(D.length)
    }, []);
    return jA((D, X) => {
        let P = RK.fromText($, O, j);
        if (X.ctrl && z.includes(D.toLowerCase())) return;
        if (!UpY(X, D)) RF6();
        if (!dpY(X, D)) hF6();
        if (X.return || X.downArrow) {
            q();
            return
        }
        if (X.upArrow) {
            if (K) K();
            return
        }
        if (X.escape) {
            if ($.length > 0) H(""), J(0);
            else q();
            return
        }
        if (X.backspace) {
            if (X.meta) {
                let {
                    cursor: Z,
                    killed: G
                } = P.deleteWordBefore();
                Sd(G, "prepend"), H(Z.text), J(Z.offset);
                return
            }
            if ($.length === 0) {
                q();
                return
            }
            let W = P.backspace();
            H(W.text), J(W.offset);
            return
        }
        if (X.delete) {
            let W = P.del();
            H(W.text), J(W.offset);
            return
        }
        if (X.leftArrow && (X.ctrl || X.meta || X.fn)) {
            let W = P.prevWord();
            J(W.offset);
            return
        }
        if (X.rightArrow && (X.ctrl || X.meta || X.fn)) {
            let W = P.nextWord();
            J(W.offset);
            return
        }
        if (X.leftArrow) {
            let W = P.left();
            J(W.offset);
            return
        }
        if (X.rightArrow) {
            let W = P.right();
            J(W.offset);
            return
        }
        if (X.home) {
            J(0);
            return
        }
        if (X.end) {
            J($.length);
            return
        }
        if (X.ctrl) {
            switch (D.toLowerCase()) {
                case "a":
                    J(0);
                    return;
                case "e":
                    J($.length);
                    return;
                case "b":
                    J(P.left().offset);
                    return;
                case "f":
                    J(P.right().offset);
                    return;
                case "d": {
                    let W = P.del();
                    H(W.text), J(W.offset);
                    return
                }
                case "h": {
                    if ($.length === 0) {
                        q();
                        return
                    }
                    let W = P.backspace();
                    H(W.text), J(W.offset);
                    return
                }
                case "k": {
                    let {
                        cursor: W,
                        killed: Z
                    } = P.deleteToLineEnd();
                    Sd(Z, "append"), H(W.text), J(W.offset);
                    return
                }
                case "u": {
                    let {
                        cursor: W,
                        killed: Z
                    } = P.deleteToLineStart();
                    Sd(Z, "prepend"), H(W.text), J(W.offset);
                    return
                }
                case "w": {
                    let {
                        cursor: W,
                        killed: Z
                    } = P.deleteWordBefore();
                    Sd(Z, "prepend"), H(W.text), J(W.offset);
                    return
                }
                case "y": {
                    let W = qX1();
                    if (W.length > 0) {
                        let Z = P.offset,
                            G = P.insert(W);
                        KX1(Z, W.length), H(G.text), J(G.offset)
                    }
                    return
                }
            }
            return
        }
        if (X.meta) {
            switch (D.toLowerCase()) {
                case "b":
                    J(P.prevWord().offset);
                    return;
                case "f":
                    J(P.nextWord().offset);
                    return;
                case "d": {
                    let W = P.deleteWordAfter();
                    H(W.text), J(W.offset);
                    return
                }
                case "y": {
                    let W = YX1();
                    if (W) {
                        let {
                            text: Z,
                            start: G,
                            length: f
                        } = W, v = $.slice(0, G), N = $.slice(G + f), V = v + Z + N, L = G + Z.length;
                        zX1(Z.length), H(V), J(L)
                    }
                    return
                }
            }
            return
        }
        if (X.tab) return;
        if (D) {
            let W = P.insert(D);
            H(W.text), J(W.offset)
        }
    }, {
        isActive: A
    }), {
        query: $,
        setQuery: M,
        cursorOffset: j
    }
}
// @from(Ln 386285, Col 4)
$n6
// @from(Ln 386286, Col 4)
j16 = E(() => {
    i6();
    j36();
    _q();
    $n6 = t(P6(), 1)
})
// @from(Ln 386293, Col 0)
function p9q({
    onClose: A,
    context: q,
    setTabsHidden: K,
    onSearchModeChange: Y,
    onIsSearchModeChange: z
}) {
    let [, _] = z7(), w = yX6(), [O, $] = _J.useState(X1()), H = B1.useRef(X1()), [j, J] = _J.useState(mA()), M = B1.useRef(mA()), [D, X] = _J.useState(j?.outputStyle || hf), P = B1.useRef(D), [W, Z] = _J.useState(j?.language), G = B1.useRef(W), [f, v] = _J.useState(0), [N, V] = _J.useState(0), [L, h] = _J.useState(!0), R = p_(), {
        rows: u
    } = KA(), I = Math.max(5, u - 15), g = M1((E6) => E6.mainLoopModel), B = M1((E6) => E6.verbose), b = M1((E6) => E6.thinkingEnabled), p = M1((E6) => Dq() ? E6.fastMode : !1), Q = M1((E6) => E6.promptSuggestionEnabled), U = my1() || J16() === "enabled", r = (qF(), k4(xl)).isBriefEntitled(), e = xA(), [Y6, H6] = _J.useState({}), J6 = B1.useRef(b), [K6] = _J.useState(() => L8("localSettings")), [s] = _J.useState(() => L8("userSettings")), X6 = B1.useRef(w), z6 = S5(), [N6] = _J.useState(() => {
        let E6 = z6.getState();
        return {
            mainLoopModel: E6.mainLoopModel,
            mainLoopModelForSession: E6.mainLoopModelForSession,
            verbose: E6.verbose,
            thinkingEnabled: E6.thinkingEnabled,
            fastMode: E6.fastMode,
            promptSuggestionEnabled: E6.promptSuggestionEnabled,
            isBriefOnly: E6.isBriefOnly,
            replBridgeEnabled: E6.replBridgeEnabled,
            settings: E6.settings
        }
    }), [$6] = _J.useState(() => KG()), n = B1.useRef(!1), [o, a] = _J.useState(!1), [i, l] = _J.useState(null), {
        query: q6,
        setQuery: w6,
        cursorOffset: O6
    } = Th({
        isActive: L && i === null,
        onExit: () => {
            h(!1)
        }
    }), L6 = L && q6.length > 0;
    B1.useEffect(() => {
        Y?.(L6)
    }, [L6, Y]), B1.useEffect(() => {
        z?.(L)
    }, [L, z]);
    let y6 = L$1(q.options.mcpClients),
        G6 = !t6(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING),
        R6 = mD1(),
        T6 = hY6();
    async function D6(E6) {
        d("tengu_config_model_changed", {
            from_model: g,
            to_model: E6
        }), e((c6) => ({
            ...c6,
            mainLoopModel: E6,
            mainLoopModelForSession: null
        })), H6((c6) => {
            let K1 = oR(E6) + (az6(E6, !1, pH()) ? " · Billed as extra usage" : "");
            if ("model" in c6) {
                let {
                    model: j6,
                    ...W6
                } = c6;
                return {
                    ...W6,
                    model: K1
                }
            }
            return {
                ...c6,
                model: K1
            }
        })
    }

    function Q6(E6) {
        d1((U6) => ({
            ...U6,
            verbose: E6
        })), $({
            ...X1(),
            verbose: E6
        }), e((U6) => ({
            ...U6,
            verbose: E6
        })), H6((U6) => {
            if ("verbose" in U6) {
                let {
                    verbose: c6,
                    ...K1
                } = U6;
                return K1
            }
            return {
                ...U6,
                verbose: E6
            }
        })
    }
    let k6 = [{
            id: "autoCompactEnabled",
            label: "Auto-compact",
            value: O.autoCompactEnabled,
            type: "boolean",
            onChange(E6) {
                d1((U6) => ({
                    ...U6,
                    autoCompactEnabled: E6
                })), $({
                    ...X1(),
                    autoCompactEnabled: E6
                }), d("tengu_auto_compact_setting_changed", {
                    enabled: E6
                })
            }
        }, {
            id: "spinnerTipsEnabled",
            label: "Show tips",
            value: j?.spinnerTipsEnabled ?? !0,
            type: "boolean",
            onChange(E6) {
                TA("localSettings", {
                    spinnerTipsEnabled: E6
                }), J((U6) => ({
                    ...U6,
                    spinnerTipsEnabled: E6
                })), d("tengu_tips_setting_changed", {
                    enabled: E6
                })
            }
        }, {
            id: "prefersReducedMotion",
            label: "Reduce motion",
            value: j?.prefersReducedMotion ?? !1,
            type: "boolean",
            onChange(E6) {
                TA("localSettings", {
                    prefersReducedMotion: E6
                }), J((U6) => ({
                    ...U6,
                    prefersReducedMotion: E6
                })), e((U6) => ({
                    ...U6,
                    settings: {
                        ...U6.settings,
                        prefersReducedMotion: E6
                    }
                })), d("tengu_reduce_motion_setting_changed", {
                    enabled: E6
                })
            }
        }, {
            id: "thinkingEnabled",
            label: "Thinking mode",
            value: b ?? !0,
            type: "boolean",
            onChange(E6) {
                e((U6) => ({
                    ...U6,
                    thinkingEnabled: E6
                })), TA("userSettings", {
                    alwaysThinkingEnabled: E6 ? void 0 : !1
                }), d("tengu_thinking_toggled", {
                    enabled: E6
                })
            }
        }, ...Dq() && yj() ? [{
            id: "fastMode",
            label: `Fast mode (${Ok} only)`,
            value: !!p,
            type: "boolean",
            onChange(E6) {
                if (aq6(), TA("userSettings", {
                        fastMode: E6 ? !0 : void 0
                    }), E6) e((U6) => ({
                    ...U6,
                    mainLoopModel: Bx6(),
                    mainLoopModelForSession: null,
                    fastMode: !0
                })), H6((U6) => ({
                    ...U6,
                    model: Bx6(),
                    "Fast mode": "ON"
                }));
                else e((U6) => ({
                    ...U6,
                    fastMode: !1
                })), H6((U6) => ({
                    ...U6,
                    "Fast mode": "OFF"
                }))
            }
        }] : [], ...w8("tengu_chomp_inflection", !0) ? [{
            id: "promptSuggestionEnabled",
            label: "Prompt suggestions",
            value: Q,
            type: "boolean",
            onChange(E6) {
                e((U6) => ({
                    ...U6,
                    promptSuggestionEnabled: E6
                })), TA("userSettings", {
                    promptSuggestionEnabled: E6 ? void 0 : !1
                })
            }
        }] : [], ...[], ...[], ...G6 ? [{
            id: "fileCheckpointingEnabled",
            label: "Rewind code (checkpoints)",
            value: O.fileCheckpointingEnabled,
            type: "boolean",
            onChange(E6) {
                d1((U6) => ({
                    ...U6,
                    fileCheckpointingEnabled: E6
                })), $({
                    ...X1(),
                    fileCheckpointingEnabled: E6
                }), d("tengu_file_history_snapshots_setting_changed", {
                    enabled: E6
                })
            }
        }] : [], {
            id: "verbose",
            label: "Verbose output",
            value: B,
            type: "boolean",
            onChange: Q6
        }, {
            id: "terminalProgressBarEnabled",
            label: "Terminal progress bar",
            value: O.terminalProgressBarEnabled,
            type: "boolean",
            onChange(E6) {
                d1((U6) => ({
                    ...U6,
                    terminalProgressBarEnabled: E6
                })), $({
                    ...X1(),
                    terminalProgressBarEnabled: E6
                }), d("tengu_terminal_progress_bar_setting_changed", {
                    enabled: E6
                })
            }
        }, {
            id: "defaultPermissionMode",
            label: "Default permission mode",
            value: j?.permissions?.defaultMode || "default",
            options: (() => {
                let E6 = ["default", "plan"],
                    U6 = CW,
                    c6 = ["bypassPermissions"];
                if (!U) c6.push("auto");
                return [...E6, ...U6.filter((K1) => !E6.includes(K1) && !c6.includes(K1))]
            })(),
            type: "enum",
            onChange(E6) {
                let U6 = wC(E6),
                    c6 = W57(U6) ? _C(U6) : U6,
                    K1 = TA("userSettings", {
                        permissions: {
                            ...j?.permissions,
                            defaultMode: c6
                        }
                    });
                if (K1.error) {
                    _6(K1.error);
                    return
                }
                J((j6) => ({
                    ...j6,
                    permissions: {
                        ...j6?.permissions,
                        defaultMode: c6
                    }
                })), H6((j6) => ({
                    ...j6,
                    defaultPermissionMode: E6
                })), d("tengu_config_changed", {
                    setting: "defaultPermissionMode",
                    value: E6
                })
            }
        }, {
            id: "respectGitignore",
            label: "Respect .gitignore in file picker",
            value: O.respectGitignore,
            type: "boolean",
            onChange(E6) {
                d1((U6) => ({
                    ...U6,
                    respectGitignore: E6
                })), $({
                    ...X1(),
                    respectGitignore: E6
                }), d("tengu_respect_gitignore_setting_changed", {
                    enabled: E6
                })
            }
        }, {
            id: "copyFullResponse",
            label: "Always copy full response (skip /copy picker)",
            value: O.copyFullResponse,
            type: "boolean",
            onChange(E6) {
                d1((U6) => ({
                    ...U6,
                    copyFullResponse: E6
                })), $({
                    ...X1(),
                    copyFullResponse: E6
                }), d("tengu_config_changed", {
                    setting: "copyFullResponse",
                    value: String(E6)
                })
            }
        }, ...[], T6 ? {
            id: "autoUpdatesChannel",
            label: "Auto-update channel",
            value: "disabled",
            type: "managedEnum",
            onChange() {}
        } : {
            id: "autoUpdatesChannel",
            label: "Auto-update channel",
            value: j?.autoUpdatesChannel ?? "latest",
            type: "managedEnum",
            onChange() {}
        }, {
            id: "theme",
            label: "Theme",
            value: w,
            type: "managedEnum",
            onChange: _
        }, {
            id: "notifChannel",
            label: "Notifications",
            value: O.preferredNotifChannel,
            options: ["auto", "iterm2", "terminal_bell", "iterm2_with_bell", "kitty", "ghostty", "notifications_disabled"],
            type: "enum",
            onChange(E6) {
                d1((U6) => ({
                    ...U6,
                    preferredNotifChannel: E6
                })), $({
                    ...X1(),
                    preferredNotifChannel: E6
                })
            }
        }, {
            id: "outputStyle",
            label: "Output style",
            value: D,
            type: "managedEnum",
            onChange: () => {}
        }, ...r ? [{
            id: "defaultView",
            label: "What you see by default",
            value: j?.defaultView === void 0 ? "default" : String(j.defaultView),
            options: ["transcript", "chat", "default"],
            type: "enum",
            onChange(E6) {
                let U6 = E6 === "default" ? void 0 : E6;
                if (TA("localSettings", {
                        defaultView: U6
                    }), J((c6) => ({
                        ...c6,
                        defaultView: U6
                    })), e((c6) => {
                        let K1 = U6 === "chat";
                        if (c6.isBriefOnly === K1) return c6;
                        return {
                            ...c6,
                            isBriefOnly: K1
                        }
                    }), U6 === "chat") Lx(!0);
                H6((c6) => ({
                    ...c6,
                    "Default view": E6
                })), d("tengu_default_view_setting_changed", {
                    value: U6 ?? "unset"
                })
            }
        }] : [], {
            id: "language",
            label: "Language",
            value: W ?? "Default (English)",
            type: "managedEnum",
            onChange: () => {}
        }, {
            id: "editorMode",
            label: "Editor mode",
            value: O.editorMode === "emacs" ? "normal" : O.editorMode || "normal",
            options: ["normal", "vim"],
            type: "enum",
            onChange(E6) {
                d1((U6) => ({
                    ...U6,
                    editorMode: E6
                })), $({
                    ...X1(),
                    editorMode: E6
                }), d("tengu_editor_mode_changed", {
                    mode: E6,
                    source: "config_panel"
                })
            }
        }, ...w8("tengu_pr_status_cli", !1) ? [{
            id: "prStatusFooterEnabled",
            label: "Show PR status footer",
            value: O.prStatusFooterEnabled ?? !0,
            type: "boolean",
            onChange(E6) {
                d1((U6) => {
                    if (U6.prStatusFooterEnabled === E6) return U6;
                    return {
                        ...U6,
                        prStatusFooterEnabled: E6
                    }
                }), $({
                    ...X1(),
                    prStatusFooterEnabled: E6
                }), d("tengu_pr_status_footer_setting_changed", {
                    enabled: E6
                })
            }
        }] : [], {
            id: "model",
            label: "Model",
            value: g === null ? "Default (recommended)" : g,
            type: "managedEnum",
            onChange: D6
        }, ...y6 ? [{
            id: "diffTool",
            label: "Diff tool",
            value: O.diffTool ?? "auto",
            options: ["terminal", "auto"],
            type: "enum",
            onChange(E6) {
                d1((U6) => ({
                    ...U6,
                    diffTool: E6
                })), $({
                    ...X1(),
                    diffTool: E6
                }), d("tengu_diff_tool_changed", {
                    tool: E6,
                    source: "config_panel"
                })
            }
        }] : [], ...!FM() ? [{
            id: "autoConnectIde",
            label: "Auto-connect to IDE (external terminal)",
            value: O.autoConnectIde ?? !1,
            type: "boolean",
            onChange(E6) {
                d1((U6) => ({
                    ...U6,
                    autoConnectIde: E6
                })), $({
                    ...X1(),
                    autoConnectIde: E6
                }), d("tengu_auto_connect_ide_changed", {
                    enabled: E6,
                    source: "config_panel"
                })
            }
        }] : [], ...FM() ? [{
            id: "autoInstallIdeExtension",
            label: "Auto-install IDE extension",
            value: O.autoInstallIdeExtension ?? !0,
            type: "boolean",
            onChange(E6) {
                d1((U6) => ({
                    ...U6,
                    autoInstallIdeExtension: E6
                })), $({
                    ...X1(),
                    autoInstallIdeExtension: E6
                }), d("tengu_auto_install_ide_extension_changed", {
                    enabled: E6,
                    source: "config_panel"
                })
            }
        }] : [], {
            id: "claudeInChromeDefaultEnabled",
            label: "Claude in Chrome enabled by default",
            value: O.claudeInChromeDefaultEnabled ?? !0,
            type: "boolean",
            onChange(E6) {
                d1((U6) => ({
                    ...U6,
                    claudeInChromeDefaultEnabled: E6
                })), $({
                    ...X1(),
                    claudeInChromeDefaultEnabled: E6
                }), d("tengu_claude_in_chrome_setting_changed", {
                    enabled: E6
                })
            }
        }, ...E7() ? (() => {
            let E6 = zu8();
            return [{
                id: "teammateMode",
                label: E6 ? `Teammate mode [overridden: ${E6}]` : "Teammate mode",
                value: O.teammateMode ?? "auto",
                options: ["auto", "tmux", "in-process"],
                type: "enum",
                onChange(c6) {
                    if (c6 !== "auto" && c6 !== "tmux" && c6 !== "in-process") return;
                    _u8(c6), d1((K1) => ({
                        ...K1,
                        teammateMode: c6
                    })), $({
                        ...X1(),
                        teammateMode: c6
                    }), d("tengu_teammate_mode_changed", {
                        mode: c6
                    })
                }
            }]
        })() : [], ...dl() ? [{
            id: "remoteControlAtStartup",
            label: "Enable Remote Control for all sessions",
            value: O.remoteControlAtStartup === void 0 ? "default" : String(O.remoteControlAtStartup),
            options: ["true", "false", "default"],
            type: "enum",
            onChange(E6) {
                if (E6 === "default") d1((c6) => {
                    if (c6.remoteControlAtStartup === void 0) return c6;
                    let K1 = {
                        ...c6
                    };
                    return delete K1.remoteControlAtStartup, K1
                }), $({
                    ...X1(),
                    remoteControlAtStartup: void 0
                });
                else {
                    let c6 = E6 === "true";
                    d1((K1) => {
                        if (K1.remoteControlAtStartup === c6) return K1;
                        return {
                            ...K1,
                            remoteControlAtStartup: c6
                        }
                    }), $({
                        ...X1(),
                        remoteControlAtStartup: c6
                    })
                }
                let U6 = e66();
                e((c6) => {
                    if (c6.replBridgeEnabled === U6) return c6;
                    return {
                        ...c6,
                        replBridgeEnabled: U6
                    }
                })
            }
        }] : [], ...R6 ? [{
            id: "showExternalIncludesDialog",
            label: "External CLAUDE.md includes",
            value: (() => {
                if (d2().hasClaudeMdExternalIncludesApproved) return "true";
                else return "false"
            })(),
            type: "managedEnum",
            onChange() {}
        }] : [], ...process.env.ANTHROPIC_API_KEY && !zG() ? [{
            id: "apiKey",
            label: B1.createElement(T, null, "Use custom API key:", " ", B1.createElement(T, {
                bold: !0
            }, vN(process.env.ANTHROPIC_API_KEY))),
            searchText: "Use custom API key",
            value: Boolean(process.env.ANTHROPIC_API_KEY && O.customApiKeyResponses?.approved?.includes(vN(process.env.ANTHROPIC_API_KEY))),
            type: "boolean",
            onChange(E6) {
                d1((U6) => {
                    let c6 = {
                        ...U6
                    };
                    if (!c6.customApiKeyResponses) c6.customApiKeyResponses = {
                        approved: [],
                        rejected: []
                    };
                    if (!c6.customApiKeyResponses.approved) c6.customApiKeyResponses = {
                        ...c6.customApiKeyResponses,
                        approved: []
                    };
                    if (!c6.customApiKeyResponses.rejected) c6.customApiKeyResponses = {
                        ...c6.customApiKeyResponses,
                        rejected: []
                    };
                    if (process.env.ANTHROPIC_API_KEY) {
                        let K1 = vN(process.env.ANTHROPIC_API_KEY);
                        if (E6) c6.customApiKeyResponses = {
                            ...c6.customApiKeyResponses,
                            approved: [...(c6.customApiKeyResponses.approved ?? []).filter((j6) => j6 !== K1), K1],
                            rejected: (c6.customApiKeyResponses.rejected ?? []).filter((j6) => j6 !== K1)
                        };
                        else c6.customApiKeyResponses = {
                            ...c6.customApiKeyResponses,
                            approved: (c6.customApiKeyResponses.approved ?? []).filter((j6) => j6 !== K1),
                            rejected: [...(c6.customApiKeyResponses.rejected ?? []).filter((j6) => j6 !== K1), K1]
                        }
                    }
                    return c6
                }), $(X1())
            }
        }] : []],
        Z6 = B1.useMemo(() => {
            if (!q6) return k6;
            let E6 = q6.toLowerCase();
            return k6.filter((U6) => {
                if (U6.id.toLowerCase().includes(E6)) return !0;
                return ("searchText" in U6 ? U6.searchText : U6.label).toLowerCase().includes(E6)
            })
        }, [k6, q6]);
    B1.useEffect(() => {
        if (f >= Z6.length) {
            let E6 = Math.max(0, Z6.length - 1);
            v(E6), V(Math.max(0, E6 - I + 1));
            return
        }
        V((E6) => {
            if (f < E6) return f;
            if (f >= E6 + I) return f - I + 1;
            return E6
        })
    }, [Z6.length, f, I]);
    let u6 = _J.useCallback((E6) => {
            V((U6) => {
                if (E6 < U6) return E6;
                if (E6 >= U6 + I) return E6 - I + 1;
                return U6
            })
        }, [I]),
        C6 = _J.useCallback(() => {
            if (i !== null) return;
            let E6 = Object.entries(Y6).map(([j6, W6]) => {
                    return d("tengu_config_changed", {
                        key: j6,
                        value: W6
                    }), `Set ${j6} to ${O1.bold(W6)}`
                }),
                U6 = zG() ? void 0 : process.env.ANTHROPIC_API_KEY,
                c6 = Boolean(U6 && H.current.customApiKeyResponses?.approved?.includes(vN(U6))),
                K1 = Boolean(U6 && O.customApiKeyResponses?.approved?.includes(vN(U6)));
            if (c6 !== K1) E6.push(`${K1?"Enabled":"Disabled"} custom API key`), d("tengu_config_changed", {
                key: "env.ANTHROPIC_API_KEY",
                value: K1
            });
            if (O.theme !== H.current.theme) E6.push(`Set theme to ${O1.bold(O.theme)}`);
            if (O.preferredNotifChannel !== H.current.preferredNotifChannel) E6.push(`Set notifications to ${O1.bold(O.preferredNotifChannel)}`);
            if (D !== P.current) E6.push(`Set output style to ${O1.bold(D)}`);
            if (W !== G.current) E6.push(`Set response language to ${O1.bold(W??"Default (English)")}`);
            if (O.editorMode !== H.current.editorMode) E6.push(`Set editor mode to ${O1.bold(O.editorMode||"emacs")}`);
            if (O.diffTool !== H.current.diffTool) E6.push(`Set diff tool to ${O1.bold(O.diffTool)}`);
            if (O.autoConnectIde !== H.current.autoConnectIde) E6.push(`${O.autoConnectIde?"Enabled":"Disabled"} auto-connect to IDE`);
            if (O.autoInstallIdeExtension !== H.current.autoInstallIdeExtension) E6.push(`${O.autoInstallIdeExtension?"Enabled":"Disabled"} auto-install IDE extension`);
            if (O.autoCompactEnabled !== H.current.autoCompactEnabled) E6.push(`${O.autoCompactEnabled?"Enabled":"Disabled"} auto-compact`);
            if (O.respectGitignore !== H.current.respectGitignore) E6.push(`${O.respectGitignore?"Enabled":"Disabled"} respect .gitignore in file picker`);
            if (O.copyFullResponse !== H.current.copyFullResponse) E6.push(`${O.copyFullResponse?"Enabled":"Disabled"} always copy full response`);
            if (O.copyOnSelect !== H.current.copyOnSelect) E6.push(`${O.copyOnSelect?"Enabled":"Disabled"} copy on select`);
            if (O.terminalProgressBarEnabled !== H.current.terminalProgressBarEnabled) E6.push(`${O.terminalProgressBarEnabled?"Enabled":"Disabled"} terminal progress bar`);
            if (O.remoteControlAtStartup !== H.current.remoteControlAtStartup) {
                let j6 = O.remoteControlAtStartup === void 0 ? "Reset Remote Control to default" : `${O.remoteControlAtStartup?"Enabled":"Disabled"} Remote Control for all sessions`;
                E6.push(j6)
            }
            if (j?.autoUpdatesChannel !== M.current?.autoUpdatesChannel) E6.push(`Set auto-update channel to ${O1.bold(j?.autoUpdatesChannel??"latest")}`);
            if (E6.length > 0) A(E6.join(`
`));
            else A("Config dialog dismissed", {
                display: "system"
            })
        }, [i, Y6, O, g, D, W, j?.autoUpdatesChannel, Dq() ? j?.fastMode : void 0, A]),
        o6 = _J.useCallback(() => {
            if (w !== X6.current) _(X6.current);
            d1(() => H.current);
            let E6 = K6;
            TA("localSettings", {
                spinnerTipsEnabled: E6?.spinnerTipsEnabled,
                prefersReducedMotion: E6?.prefersReducedMotion,
                defaultView: E6?.defaultView,
                outputStyle: E6?.outputStyle
            });
            let U6 = s;
            TA("userSettings", {
                alwaysThinkingEnabled: U6?.alwaysThinkingEnabled,
                fastMode: U6?.fastMode,
                promptSuggestionEnabled: U6?.promptSuggestionEnabled,
                autoUpdatesChannel: U6?.autoUpdatesChannel,
                minimumVersion: U6?.minimumVersion,
                language: U6?.language,
                syntaxHighlightingDisabled: U6?.syntaxHighlightingDisabled,
                permissions: U6?.permissions === void 0 ? void 0 : {
                    ...U6.permissions,
                    defaultMode: U6.permissions.defaultMode
                }
            });
            let c6 = N6;
            if (e((K1) => ({
                    ...K1,
                    mainLoopModel: c6.mainLoopModel,
                    mainLoopModelForSession: c6.mainLoopModelForSession,
                    verbose: c6.verbose,
                    thinkingEnabled: c6.thinkingEnabled,
                    fastMode: c6.fastMode,
                    promptSuggestionEnabled: c6.promptSuggestionEnabled,
                    isBriefOnly: c6.isBriefOnly,
                    replBridgeEnabled: c6.replBridgeEnabled,
                    settings: c6.settings
                })), KG() !== $6) Lx($6)
        }, [w, _, K6, s, N6, $6, e]),
        V6 = _J.useCallback(() => {
            if (i !== null) return;
            if (n.current) o6();
            A("Config dialog dismissed", {
                display: "system"
            })
        }, [i, o6, A]);
    D8("confirm:no", V6, {
        context: "Settings",
        isActive: i === null && !L
    }), D8("settings:close", C6, {
        context: "Settings",
        isActive: i === null && !L
    });
    let b6 = _J.useCallback(() => {
        let E6 = Z6[f];
        if (!E6 || !E6.onChange) return;
        if (E6.type === "boolean") {
            if (n.current = !0, E6.onChange(!E6.value), E6.id === "thinkingEnabled") {
                if (!E6.value === J6.current) a(!1);
                else if (q.messages.some((K1) => K1.type === "assistant")) a(!0)
            }
            return
        }
        if (E6.id === "theme" || E6.id === "model" || E6.id === "showExternalIncludesDialog" || E6.id === "outputStyle" || E6.id === "language") switch (E6.id) {
            case "theme":
                l("Theme"), K(!0);
                return;
            case "model":
                l("Model"), K(!0);
                return;
            case "showExternalIncludesDialog":
                l("ExternalIncludes"), K(!0);
                return;
            case "outputStyle":
                l("OutputStyle"), K(!0);
                return;
            case "language":
                l("Language"), K(!0);
                return
        }
        if (E6.id === "autoUpdatesChannel") {
            if (T6) {
                l("EnableAutoUpdates"), K(!0);
                return
            }
            if ((j?.autoUpdatesChannel ?? "latest") === "latest") l("ChannelDowngrade"), K(!0);
            else n.current = !0, TA("userSettings", {
                autoUpdatesChannel: "latest",
                minimumVersion: void 0
            }), J((c6) => ({
                ...c6,
                autoUpdatesChannel: "latest",
                minimumVersion: void 0
            })), d("tengu_autoupdate_channel_changed", {
                channel: "latest"
            });
            return
        }
        if (E6.type === "enum") {
            n.current = !0;
            let c6 = (E6.options.indexOf(E6.value) + 1) % E6.options.length;
            E6.onChange(E6.options[c6]);
            return
        }
    }, [T6, Z6, f, j?.autoUpdatesChannel, K]);
    return tA({
        "select:previous": () => {
            if (a(!1), f === 0) h(!0), V(0);
            else {
                let E6 = Math.max(0, f - 1);
                v(E6), u6(E6)
            }
        },
        "select:next": () => {
            a(!1);
            let E6 = Math.min(Z6.length - 1, f + 1);
            v(E6), u6(E6)
        },
        "select:accept": b6,
        "settings:search": () => {
            h(!0), w6("")
        }
    }, {
        context: "Settings",
        isActive: i === null && !L
    }), jA((E6, U6) => {
        if (U6.escape) {
            if (q6.length > 0) w6("");
            else h(!1);
            return
        }
        if (U6.return || U6.downArrow) h(!1), v(0), V(0)
    }, {
        isActive: L && i === null
    }), jA((E6, U6) => {
        if (!U6.ctrl && !U6.meta && E6.length > 0 && !/^\s+$/.test(E6)) h(!0), w6(E6)
    }, {
        isActive: !L && i === null
    }), B1.createElement(m, {
        flexDirection: "column",
        width: "100%"
    }, i === "Theme" ? B1.createElement(B1.Fragment, null, B1.createElement(Gv6, {
        onThemeSelect: (E6) => {
            n.current = !0, _(E6), l(null), K(!1)
        },
        onCancel: () => {
            l(null), K(!1)
        },
        hideEscToCancel: !0,
        skipExitHandling: !0
    }), B1.createElement(m, null, B1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, B1.createElement(C8, null, B1.createElement(a1, {
        shortcut: "Enter",
        action: "select"
    }), B1.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))))) : i === "Model" ? B1.createElement(B1.Fragment, null, B1.createElement(fv6, {
        initial: g,
        onSelect: (E6, U6) => {
            n.current = !0, D6(E6), l(null), K(!1)
        },
        onCancel: () => {
            l(null), K(!1)
        },
        showFastModeNotice: Dq() ? p && FH(g) && yj() : !1
    }), B1.createElement(T, {
        dimColor: !0
    }, B1.createElement(C8, null, B1.createElement(a1, {
        shortcut: "Enter",
        action: "confirm"
    }), B1.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))) : i === "ExternalIncludes" ? B1.createElement(B1.Fragment, null, B1.createElement(eQ8, {
        onDone: () => {
            l(null), K(!1)
        },
        externalIncludes: E06()
    }), B1.createElement(T, {
        dimColor: !0
    }, B1.createElement(C8, null, B1.createElement(a1, {
        shortcut: "Enter",
        action: "confirm"
    }), B1.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "disable external includes"
    })))) : i === "OutputStyle" ? B1.createElement(B1.Fragment, null, B1.createElement(m9q, {
        initialStyle: D,
        onComplete: (E6) => {
            n.current = !0, X(E6 ?? hf), l(null), K(!1), TA("localSettings", {
                outputStyle: E6
            }), d("tengu_output_style_changed", {
                style: E6 ?? hf,
                source: "config_panel",
                settings_source: "localSettings"
            })
        },
        onCancel: () => {
            l(null), K(!1)
        }
    }), B1.createElement(T, {
        dimColor: !0
    }, B1.createElement(C8, null, B1.createElement(a1, {
        shortcut: "Enter",
        action: "confirm"
    }), B1.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))) : i === "Language" ? B1.createElement(B1.Fragment, null, B1.createElement(g9q, {
        initialLanguage: W,
        onComplete: (E6) => {
            n.current = !0, Z(E6), l(null), K(!1), TA("userSettings", {
                language: E6
            }), d("tengu_language_changed", {
                language: E6 ?? "default",
                source: "config_panel"
            })
        },
        onCancel: () => {
            l(null), K(!1)
        }
    }), B1.createElement(T, {
        dimColor: !0
    }, B1.createElement(C8, null, B1.createElement(a1, {
        shortcut: "Enter",
        action: "confirm"
    }), B1.createElement(O8, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })))) : i === "EnableAutoUpdates" ? B1.createElement(m8, {
        title: "Enable Auto-Updates",
        onCancel: () => {
            l(null), K(!1)
        },
        hideBorder: !0,
        hideInputGuide: !0
    }, T6 !== "config" ? B1.createElement(B1.Fragment, null, B1.createElement(T, null, "Auto-updates are controlled by an environment variable and cannot be changed here."), B1.createElement(T, {
        dimColor: !0
    }, "Unset", " ", T6?.includes("NONESSENTIAL") ? "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC" : "DISABLE_AUTOUPDATER", " ", "to re-enable auto-updates.")) : B1.createElement(T8, {
        options: [{
            label: "Enable with latest channel",
            value: "latest"
        }, {
            label: "Enable with stable channel",
            value: "stable"
        }],
        onChange: (E6) => {
            n.current = !0, l(null), K(!1), d1((U6) => ({
                ...U6,
                autoUpdates: !0
            })), $({
                ...X1(),
                autoUpdates: !0
            }), TA("userSettings", {
                autoUpdatesChannel: E6,
                minimumVersion: void 0
            }), J((U6) => ({
                ...U6,
                autoUpdatesChannel: E6,
                minimumVersion: void 0
            })), d("tengu_autoupdate_enabled", {
                channel: E6
            })
        }
    })) : i === "ChannelDowngrade" ? B1.createElement(b9q, {
        currentVersion: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION,
        onChoice: (E6) => {
            if (l(null), K(!1), E6 === "cancel") return;
            n.current = !0;
            let U6 = {
                autoUpdatesChannel: "stable"
            };
            if (E6 === "stay") U6.minimumVersion = {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.VERSION;
            TA("userSettings", U6), J((c6) => ({
                ...c6,
                ...U6
            })), d("tengu_autoupdate_channel_changed", {
                channel: "stable",
                minimum_version_set: E6 === "stay"
            })
        }
    }) : B1.createElement(m, {
        flexDirection: "column",
        marginY: 1,
        gap: 1
    }, B1.createElement(T, null, "Configure Claude Code preferences"), B1.createElement(fh, {
        query: q6,
        isFocused: L,
        isTerminalFocused: R,
        cursorOffset: O6,
        placeholder: "Search settings..."
    }), B1.createElement(m, {
        flexDirection: "column"
    }, Z6.length === 0 ? B1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, 'No settings match "', q6, '"') : B1.createElement(B1.Fragment, null, N > 0 && B1.createElement(T, {
        dimColor: !0
    }, a6.arrowUp, " ", N, " more above"), Z6.slice(N, N + I).map((E6, U6) => {
        let K1 = N + U6 === f;
        return B1.createElement(B1.Fragment, {
            key: E6.id
        }, B1.createElement(m, null, B1.createElement(m, {
            width: 44
        }, B1.createElement(T, {
            color: K1 ? "suggestion" : void 0
        }, K1 ? a6.pointer : " ", " ", E6.label)), B1.createElement(m, {
            key: K1 ? "selected" : "unselected"
        }, E6.type === "boolean" ? B1.createElement(B1.Fragment, null, B1.createElement(T, {
            color: K1 ? "suggestion" : void 0
        }, E6.value.toString()), o && E6.id === "thinkingEnabled" && B1.createElement(T, {
            color: "warning"
        }, " ", "Changing thinking mode mid-conversation will increase latency and may reduce quality.")) : E6.id === "theme" ? B1.createElement(T, {
            color: K1 ? "suggestion" : void 0
        }, (() => {
            return {
                auto: "Auto (follow system)",
                dark: "Dark mode",
                light: "Light mode",
                "dark-daltonized": "Dark mode (colorblind-friendly)",
                "light-daltonized": "Light mode (colorblind-friendly)",
                "dark-ansi": "Dark mode (ANSI colors only)",
                "light-ansi": "Light mode (ANSI colors only)"
            } [E6.value.toString()] || E6.value.toString()
        })()) : E6.id === "notifChannel" ? B1.createElement(T, {
            color: K1 ? "suggestion" : void 0
        }, (() => {
            switch (E6.value.toString()) {
                case "auto":
                    return "Auto";
                case "iterm2":
                    return B1.createElement(B1.Fragment, null, "iTerm2 ", B1.createElement(T, {
                        dimColor: !0
                    }, "(OSC 9)"));
                case "terminal_bell":
                    return B1.createElement(B1.Fragment, null, "Terminal Bell", " ", B1.createElement(T, {
                        dimColor: !0
                    }, "(\\a)"));
                case "kitty":
                    return B1.createElement(B1.Fragment, null, "Kitty ", B1.createElement(T, {
                        dimColor: !0
                    }, "(OSC 99)"));
                case "ghostty":
                    return B1.createElement(B1.Fragment, null, "Ghostty", " ", B1.createElement(T, {
                        dimColor: !0
                    }, "(OSC 777)"));
                case "iterm2_with_bell":
                    return "iTerm2 w/ Bell";
                case "notifications_disabled":
                    return "Disabled";
                default:
                    return E6.value.toString()
            }
        })()) : E6.id === "defaultPermissionMode" ? B1.createElement(T, {
            color: K1 ? "suggestion" : void 0
        }, QQ(E6.value)) : E6.id === "autoUpdatesChannel" && T6 ? B1.createElement(m, {
            flexDirection: "column"
        }, B1.createElement(T, {
            color: K1 ? "suggestion" : void 0
        }, "disabled"), B1.createElement(T, {
            dimColor: !0
        }, "(", T6, ")")) : B1.createElement(T, {
            color: K1 ? "suggestion" : void 0
        }, E6.value.toString()))))
    }), N + I < Z6.length && B1.createElement(T, {
        dimColor: !0
    }, a6.arrowDown, " ", Z6.length - N - I, " ", "more below"))), L ? B1.createElement(T, {
        dimColor: !0
    }, B1.createElement(C8, null, B1.createElement(T, null, "Type to filter"), B1.createElement(a1, {
        shortcut: "Enter/↓",
        action: "select"
    }), B1.createElement(O8, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "clear"
    }))) : B1.createElement(T, {
        dimColor: !0
    }, B1.createElement(C8, null, B1.createElement(O8, {
        action: "select:accept",
        context: "Settings",
        fallback: "Space",
        description: "change"
    }), B1.createElement(O8, {
        action: "settings:close",
        context: "Settings",
        fallback: "Enter",
        description: "save"
    }), B1.createElement(O8, {
        action: "settings:search",
        context: "Settings",
        fallback: "/",
        description: "search"
    }), B1.createElement(O8, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })))))
}
// @from(Ln 387388, Col 4)
B1
// @from(Ln 387388, Col 8)
_J
// @from(Ln 387389, Col 4)
Q9q = E(() => {
    i6();
    _7();
    b7();
    k8();
    qn6();
    k8();
    aK();
    rD();
    rJ();
    k1();
    V1();
    MF();
    Sy1();
    NA();
    xy1();
    z4();
    uy1();
    AU8();
    x9q();
    wq();
    o9();
    B9q();
    F9q();
    lM();
    Lq();
    OK();
    Xq();
    H16();
    Sw();
    i8();
    T1();
    aB();
    A8();
    HA();
    Qz();
    Bf6();
    j16();
    _q();
    FW();
    Tb();
    B1 = t(P6(), 1), _J = t(P6(), 1)
})
// @from(Ln 387432, Col 0)
async function U9q() {
    if (!iA() || !XG()) return {};
    let A = sA();
    if (A && Yg(A.expiresAt)) return null;
    let q = QO();
    if (q.error) throw Error(`Auth error: ${q.error}`);
    let K = {
            "Content-Type": "application/json",
            "User-Agent": pO(),
            ...q.headers
        },
        Y = `${P7().BASE_API_URL}/api/oauth/usage`;
    return (await X8.get(Y, {
        headers: K,
        timeout: 5000
    })).data
}
// @from(Ln 387449, Col 4)
d9q = E(() => {
    kK();
    RM();
    F5();
    fA();
    W0()
})