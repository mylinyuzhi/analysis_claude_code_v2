
// @from(Ln 552884, Col 0)
async function h$A(q) {
    let {
        findBedrockUpgradeCandidates: K,
        upgradeKey: _
    } = await Promise.resolve().then(() => (IW7(), bW7)), z = await qe8("bedrock-upgrade", K());
    if (z.length === 0) return;
    let Y = H8().bedrockDeclinedUpgrades ?? {},
        A = z.filter((j) => Y[j.tier] !== _(j));
    if (A.length === 0) return;
    let {
        updateSettingsForSource: O
    } = await Promise.resolve().then(() => (a1(), UQ6)), {
        ThirdPartyModelUpgradeDialog: w
    } = await Promise.resolve().then(() => (uW7(), xW7)), $ = !1;
    for (let j of A)
        if (await sT(q, (J) => mH.default.createElement(w, {
                tierLabel: bm6[j.tier],
                fromName: j.fromMarketingName,
                toName: j.toMarketingName,
                toProviderId: j.toBedrockId,
                onDone: J
            }))) {
            let J = j.tier === "haiku" ? {
                    ANTHROPIC_DEFAULT_HAIKU_MODEL: j.toBedrockId,
                    ...j.envVar === "ANTHROPIC_SMALL_FAST_MODEL" && {
                        ANTHROPIC_SMALL_FAST_MODEL: j.toBedrockId
                    }
                } : {
                    [j.envVar]: j.toBedrockId
                },
                {
                    error: X
                } = O("userSettings", {
                    env: J
                });
            if (X) {
                d("tengu_bedrock_upgrade_save_failed", {
                    tier: j.tier
                });
                let {
                    Text: M
                } = await Promise.resolve().then(() => (g6(), kd));
                await qA8(q, (P) => {
                    return setTimeout(P, 2000), mH.default.createElement(M, {
                        color: "error"
                    }, "Failed to save ", bm6[j.tier], " upgrade to settings.")
                })
            } else {
                for (let M of Object.keys(J)) process.env[M] = j.toBedrockId;
                $ = !0, d("tengu_bedrock_upgrade_accepted", {
                    tier: j.tier,
                    from_key: j.fromKey,
                    to_key: j.toKey
                })
            }
        } else d8((J) => ({
            ...J,
            bedrockDeclinedUpgrades: {
                ...J.bedrockDeclinedUpgrades,
                [j.tier]: _(j)
            }
        })), d("tengu_bedrock_upgrade_declined", {
            tier: j.tier,
            from_key: j.fromKey,
            to_key: j.toKey
        });
    if ($) d("tengu_bedrock_upgrade_relaunch", {}), await $25(q)
}
// @from(Ln 552952, Col 0)
async function $25(q) {
    let {
        Text: K
    } = await Promise.resolve().then(() => (g6(), kd));
    q.render(mH.default.createElement(K, {
        dimColor: !0
    }, "Restarting Claude Code to apply the new model…"));
    let {
        sleep: _
    } = await Promise.resolve().then(() => yUq);
    await _(250), q.unmount();
    let {
        execRelaunch: z
    } = await Promise.resolve().then(() => (bC6(), d48));
    await z()
}
// @from(Ln 552968, Col 0)
async function R$A(q) {
    let {
        checkBedrockDefaultAvailability: K
    } = await Promise.resolve().then(() => (IW7(), bW7)), _ = await qe8("bedrock-fallback", K());
    if (_.length === 0) return;
    for (let O of _) {
        if (process.env[O.envVar] = O.fallbackBedrockId, O.tier === "haiku") process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL = O.fallbackBedrockId;
        d("tengu_bedrock_default_fallback", {
            tier: O.tier,
            default_key: O.defaultKey,
            fallback_key: O.fallbackKey
        })
    }
    let {
        Box: z,
        Text: Y
    } = await Promise.resolve().then(() => (g6(), kd)), A = _.map((O) => `${bm6[O.tier]}: ${O.defaultName} not available — using ${O.fallbackName} for this session`);
    await qA8(q, (O) => {
        return setTimeout(O, 1500), mH.default.createElement(z, {
            flexDirection: "column"
        }, A.map((w) => mH.default.createElement(Y, {
            key: w,
            color: "warning"
        }, w)))
    })
}
// @from(Ln 552994, Col 0)
async function S$A(q) {
    let {
        findVertexUpgradeCandidates: K,
        vertexUpgradeKey: _
    } = await Promise.resolve().then(() => (pW7(), BW7)), z = await qe8("vertex-upgrade", K());
    if (z.length === 0) return;
    let Y = H8().vertexDeclinedUpgrades ?? {},
        A = z.filter((j) => Y[j.tier] !== _(j));
    if (A.length === 0) return;
    let {
        updateSettingsForSource: O
    } = await Promise.resolve().then(() => (a1(), UQ6)), {
        ThirdPartyModelUpgradeDialog: w
    } = await Promise.resolve().then(() => (uW7(), xW7)), $ = !1;
    for (let j of A)
        if (await sT(q, (J) => mH.default.createElement(w, {
                tierLabel: bm6[j.tier],
                fromName: j.fromMarketingName,
                toName: j.toMarketingName,
                toProviderId: j.toVertexId,
                onDone: J
            }))) {
            let J = j.tier === "haiku" ? {
                    ANTHROPIC_DEFAULT_HAIKU_MODEL: j.toVertexId,
                    ...j.envVar === "ANTHROPIC_SMALL_FAST_MODEL" && {
                        ANTHROPIC_SMALL_FAST_MODEL: j.toVertexId
                    }
                } : {
                    [j.envVar]: j.toVertexId
                },
                {
                    error: X
                } = O("userSettings", {
                    env: J
                });
            if (X) {
                d("tengu_vertex_upgrade_save_failed", {
                    tier: j.tier
                });
                let {
                    Text: M
                } = await Promise.resolve().then(() => (g6(), kd));
                await qA8(q, (P) => {
                    return setTimeout(P, 2000), mH.default.createElement(M, {
                        color: "error"
                    }, "Failed to save ", bm6[j.tier], " upgrade to settings.")
                })
            } else {
                for (let M of Object.keys(J)) process.env[M] = j.toVertexId;
                $ = !0, d("tengu_vertex_upgrade_accepted", {
                    tier: j.tier,
                    from_key: j.fromKey,
                    to_key: j.toKey
                })
            }
        } else d8((J) => ({
            ...J,
            vertexDeclinedUpgrades: {
                ...J.vertexDeclinedUpgrades,
                [j.tier]: _(j)
            }
        })), d("tengu_vertex_upgrade_declined", {
            tier: j.tier,
            from_key: j.fromKey,
            to_key: j.toKey
        });
    if ($) d("tengu_vertex_upgrade_relaunch", {}), await $25(q)
}
// @from(Ln 553062, Col 0)
async function C$A(q) {
    let {
        checkVertexDefaultAvailability: K
    } = await Promise.resolve().then(() => (pW7(), BW7)), _ = await qe8("vertex-fallback", K());
    if (_.length === 0) return;
    for (let O of _) {
        if (process.env[O.envVar] = O.fallbackVertexId, O.tier === "haiku") process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL = O.fallbackVertexId;
        d("tengu_vertex_default_fallback", {
            tier: O.tier,
            default_key: O.defaultKey,
            fallback_key: O.fallbackKey
        })
    }
    let {
        Box: z,
        Text: Y
    } = await Promise.resolve().then(() => (g6(), kd)), A = _.map((O) => `${bm6[O.tier]}: ${O.defaultName} not available — using ${O.fallbackName} for this session`);
    await qA8(q, (O) => {
        return setTimeout(O, 1500), mH.default.createElement(z, {
            flexDirection: "column"
        }, A.map((w) => mH.default.createElement(Y, {
            key: w,
            color: "warning"
        }, w)))
    })
}
// @from(Ln 553089, Col 0)
function j25(q) {
    let K = 0,
        _ = XF(q);
    if (_.stdin) d("tengu_stdin_interactive", {});
    let z = new yW7,
        Y = wX7();
    C61(Y);
    let A = process.env.CLAUDE_CODE_FRAME_TIMING_LOG;
    return {
        getFpsMetrics: () => z.getMetrics(),
        stats: Y,
        renderOptions: {
            ..._,
            onFrame: (O) => {
                if (z.record(O.durationMs), Y.observe("frame_duration_ms", O.durationMs), A && O.phases) {
                    let w = JSON.stringify({
                        total: O.durationMs,
                        ...O.phases,
                        rss: process.memoryUsage.rss(),
                        cpu: process.cpuUsage()
                    }) + `
`;
                    E$A(A, w)
                }
                if (IN6()) return;
                for (let w of O.flickers) {
                    if (w.reason === "resize") continue;
                    let $ = Date.now();
                    if ($ - K < 1000) d("tengu_flicker", {
                        desiredHeight: w.desiredHeight,
                        actualHeight: w.availableHeight,
                        reason: w.reason
                    });
                    K = $
                }
            }
        }
    }
}
// @from(Ln 553128, Col 4)
mH
// @from(Ln 553128, Col 8)
bm6
// @from(Ln 553128, Col 13)
O25 = 20000
// @from(Ln 553129, Col 4)
FW7 = L(() => {
    C8();
    CY();
    y8();
    $X7();
    hk();
    YX7();
    la();
    ql();
    gW7();
    B1();
    mR6();
    Pw5();
    JF();
    du6();
    il6();
    PM();
    h1();
    K8();
    Dw5();
    Q8();
    m8();
    oY8();
    U8();
    bz8();
    x9();
    aR6();
    A48();
    a1();
    mH = K6(P6(), 1);
    bm6 = {
        sonnet: "Sonnet",
        opus: "Opus",
        haiku: "Haiku"
    }
})
// @from(Ln 553165, Col 4)
H25 = {}
// @from(Ln 553170, Col 0)
function b$A(q) {
    let K = s(20),
        {
            settingsErrors: _,
            onContinue: z,
            onExit: Y
        } = q,
        A;
    if (K[0] !== z || K[1] !== Y) A = function(f) {
        if (f === "exit") Y();
        else z()
    }, K[0] = z, K[1] = Y, K[2] = A;
    else A = K[2];
    let O = A,
        w;
    if (K[3] !== _) w = _.some(I$A), K[3] = _, K[4] = w;
    else w = K[4];
    let $ = w,
        j;
    if (K[5] !== $) j = $ ? [{
        label: "Exit and fix manually",
        value: "exit"
    }, {
        label: "Continue without these settings",
        value: "continue"
    }] : [{
        label: "Continue",
        value: "continue"
    }, {
        label: "Exit and fix manually",
        value: "exit"
    }], K[5] = $, K[6] = j;
    else j = K[6];
    let H = j,
        J = $ ? "Settings Error" : "Settings Warning",
        X = $ ? Y : z,
        M;
    if (K[7] !== _) M = KA8.default.createElement(Wi8, {
        errors: _
    }), K[7] = _, K[8] = M;
    else M = K[8];
    let P = $ ? "Files with errors are skipped entirely, not just the invalid settings." : "The values listed above were skipped; the rest of the file is in effect.",
        W;
    if (K[9] !== P) W = KA8.default.createElement(T, {
        dimColor: !0
    }, P), K[9] = P, K[10] = W;
    else W = K[10];
    let D;
    if (K[11] !== O || K[12] !== H) D = KA8.default.createElement(A1, {
        options: H,
        onChange: O
    }), K[11] = O, K[12] = H, K[13] = D;
    else D = K[13];
    let Z;
    if (K[14] !== J || K[15] !== X || K[16] !== M || K[17] !== W || K[18] !== D) Z = KA8.default.createElement(R1, {
        title: J,
        onCancel: X,
        color: "warning"
    }, M, W, D), K[14] = J, K[15] = X, K[16] = M, K[17] = W, K[18] = D, K[19] = Z;
    else Z = K[19];
    return Z
}
// @from(Ln 553233, Col 0)
function I$A(q) {
    return q.severity !== "warning"
}
// @from(Ln 553236, Col 4)
KA8
// @from(Ln 553237, Col 4)
J25 = L(() => {
    o6();
    g6();
    g_();
    S4();
    RO7();
    KA8 = K6(P6(), 1)
})
// @from(Ln 553245, Col 4)
X25 = {}
// @from(Ln 553250, Col 0)
function x$A(q) {
    let K = s(18),
        {
            targetRepo: _,
            initialPaths: z,
            onSelectPath: Y,
            onCancel: A
        } = q,
        [O, w] = lM.useState(z),
        [$, j] = lM.useState(null),
        [H, J] = lM.useState(!1),
        X;
    if (K[0] !== O || K[1] !== A || K[2] !== Y || K[3] !== _) X = async (G) => {
        if (G === "cancel") {
            A();
            return
        }
        if (J(!0), j(null), await fw5(G, _)) {
            Y(G);
            return
        }
        Gw5(_, G);
        let v = O.filter((V) => V !== G);
        w(v), J(!1), j(`${S3(G)} no longer contains the correct repository. Select another path.`)
    }, K[0] = O, K[1] = A, K[2] = Y, K[3] = _, K[4] = X;
    else X = K[4];
    let M = X,
        P;
    if (K[5] !== O) {
        let G;
        if (K[7] === Symbol.for("react.memo_cache_sentinel")) G = {
            label: "Cancel",
            value: "cancel"
        }, K[7] = G;
        else G = K[7];
        P = [...O.map(u$A), G], K[5] = O, K[6] = P
    } else P = K[6];
    let W = P,
        D;
    if (K[8] !== O.length || K[9] !== $ || K[10] !== M || K[11] !== W || K[12] !== _ || K[13] !== H) D = O.length > 0 ? lM.default.createElement(lM.default.Fragment, null, lM.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, $ && lM.default.createElement(T, {
        color: "error"
    }, $), lM.default.createElement(T, null, "Open Claude Code in ", lM.default.createElement(T, {
        bold: !0
    }, _), ":")), H ? lM.default.createElement(u, null, lM.default.createElement(Y5, null), lM.default.createElement(T, null, " Validating repository…")) : lM.default.createElement(A1, {
        options: W,
        onChange: (G) => void M(G)
    })) : lM.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, $ && lM.default.createElement(T, {
        color: "error"
    }, $), lM.default.createElement(T, {
        dimColor: !0
    }, "Run claude --teleport from a checkout of ", _)), K[8] = O.length, K[9] = $, K[10] = M, K[11] = W, K[12] = _, K[13] = H, K[14] = D;
    else D = K[14];
    let Z;
    if (K[15] !== A || K[16] !== D) Z = lM.default.createElement(R1, {
        title: "Teleport to Repo",
        onCancel: A,
        color: "background"
    }, D), K[15] = A, K[16] = D, K[17] = Z;
    else Z = K[17];
    return Z
}
// @from(Ln 553318, Col 0)
function u$A(q) {
    return {
        label: lM.default.createElement(T, null, "Use ", lM.default.createElement(T, {
            bold: !0
        }, S3(q))),
        value: q
    }
}
// @from(Ln 553326, Col 4)
lM
// @from(Ln 553327, Col 4)
M25 = L(() => {
    o6();
    g6();
    eK();
    oY8();
    g_();
    S4();
    Ej();
    lM = K6(P6(), 1)
})
// @from(Ln 553337, Col 4)
W25 = {}
// @from(Ln 553345, Col 0)
function B$A(q) {
    let K = parseInt(q, 10);
    if (!isNaN(K) && K > 0) return K;
    let _ = q.match(/github\.com\/[^/]+\/[^/]+\/pull\/(\d+)/);
    if (_?.[1]) return parseInt(_[1], 10);
    return null
}
// @from(Ln 553353, Col 0)
function p$A({
    commands: q,
    worktreePaths: K,
    initialTools: _,
    mcpClients: z,
    dynamicMcpConfig: Y,
    debug: A,
    mainThreadAgentDefinition: O,
    autoConnectIdeFlag: w,
    strictMcpConfig: $ = !1,
    systemPrompt: j,
    appendSystemPrompt: H,
    initialSearchQuery: J,
    disableSlashCommands: X = !1,
    forkSession: M,
    filterByPr: P,
    thinkingConfig: W,
    onTurnComplete: D
}) {
    let {
        rows: Z
    } = s1(), G = M8((o) => o.agentDefinitions), f = R7(), [v, V] = Oz.default.useState([]), [k, N] = Oz.default.useState(!0), [R, h] = Oz.default.useState(!1), [C, x] = Oz.default.useState(!1), [B, m] = Oz.default.useState(null), [S, F] = Oz.default.useState(null), U = Oz.default.useRef(null), [g, c] = Oz.default.useState(0), n = Oz.default.useRef(0), l = Oz.default.useRef(0), z6 = Oz.default.useMemo(() => {
        let o = v.filter((_6) => !_6.isSidechain);
        if (P !== void 0) {
            if (P === !0) o = o.filter((_6) => _6.prNumber !== void 0);
            else if (typeof P === "number") o = o.filter((_6) => _6.prNumber === P);
            else if (typeof P === "string") {
                let _6 = B$A(P);
                if (_6 !== null) o = o.filter((r) => r.prNumber === _6)
            }
        }
        return o
    }, [v, P]), A6 = K66(), e = Oz.default.useMemo(() => S6(process.env.CLAUDE_CODE_DISABLE_TERMINAL_TITLE), []);
    eN6(B || e ? null : "claude · resume"), Oz.default.useEffect(() => {
        Pz8(K).then((o) => {
            U.current = o, n.current = o.logs.length, V(o.logs), N(!1)
        }).catch((o) => {
            j6(o), N(!1)
        })
    }, [K]);
    let i = Oz.default.useRef(!1),
        O6 = Oz.default.useCallback((o) => {
            if (i.current) return;
            let _6 = U.current;
            if (!_6 || _6.nextIndex >= _6.allStatLogs.length) return;
            i.current = !0;
            let r = !1;
            vW6(_6.allStatLogs, _6.nextIndex, o).then((t) => {
                if (U.current !== _6) return;
                if (_6.nextIndex = t.nextIndex, t.logs.length > 0) {
                    let Y6 = n.current;
                    t.logs.forEach((X6, M6) => {
                        X6.value = Y6 + M6
                    }), V((X6) => X6.concat(t.logs)), n.current += t.logs.length
                } else if (_6.nextIndex < _6.allStatLogs.length) r = !0
            }).finally(() => {
                if (i.current = !1, r) O6(o)
            })
        }, []),
        J6 = Oz.default.useCallback((o) => {
            N(!0);
            let _6 = ++l.current,
                r = U.current;
            U.current = null, c((Y6) => Y6 + 1), (o ? ao8() : Pz8(K)).then((Y6) => {
                if (l.current !== _6) return;
                U.current = Y6, n.current = Y6.logs.length, V(Y6.logs)
            }).catch((Y6) => {
                if (l.current !== _6) return;
                if (r !== null) U.current = r;
                V((X6) => X6.slice()), j6(Y6)
            }).finally(() => {
                if (l.current !== _6) return;
                N(!1)
            })
        }, [K]),
        $6 = Oz.default.useCallback(() => {
            let o = !C;
            x(o), J6(o)
        }, [C, J6]);

    function H6() {
        process.exit(1)
    }
    async function q6(o) {
        h(!0);
        let _6 = performance.now(),
            r = Cr8(o, C, K);
        if (r.isCrossProject) {
            if (!r.isSameRepoWorktree) {
                let X6 = await hP(r.command);
                if (X6) process.stdout.write(X6);
                F(r.command);
                return
            }
        }
        let t = !1,
            Y6 = "load_error";
        try {
            let X6 = await Ft(o, void 0);
            if (!X6) throw d("tengu_session_resumed", {
                entrypoint: "picker",
                success: !1,
                failure_reason: "not_found"
            }), t = !0, Error("Failed to load conversation");
            if (Y6 = "processing_error", X6.sessionId && !M) SZ(pP(X6.sessionId), o.fullPath ? m$A(o.fullPath) : null), await kY8(), await Gu(), eb8(X6.sessionId);
            else if (M && X6.contentReplacements?.length) await dM6(X6.contentReplacements);
            let {
                agentDefinition: M6
            } = _06(X6.agentSetting, O, G);
            f((V6) => ({
                ...V6,
                agent: M6?.agentType
            }));
            let W6 = yY8(X6.agentName, X6.agentColor);
            if (W6) f((V6) => ({
                ...V6,
                standaloneAgentContext: W6
            }));
            if (NQ(X6.agentName), In(M ? {
                    ...X6,
                    worktreeSession: void 0
                } : X6), !M) {
                if (LY8(X6.worktreeSession), X6.sessionId) bn()
            }
            d("tengu_session_resumed", {
                entrypoint: "picker",
                success: !0,
                resume_duration_ms: Math.round(performance.now() - _6)
            }), V([]), m({
                messages: X6.messages,
                fileHistorySnapshots: X6.fileHistorySnapshots,
                contentReplacements: X6.contentReplacements,
                agentName: X6.agentName,
                agentColor: X6.agentColor === "default" ? void 0 : X6.agentColor,
                mainThreadAgentDefinition: M6
            })
        } catch (X6) {
            if (!t) d("tengu_session_resumed", {
                entrypoint: "picker",
                success: !1,
                failure_reason: Y6,
                error_name: r1(X6).name
            });
            throw j6(X6), X6
        }
    }
    if (S) return Oz.default.createElement(U$A, {
        command: S
    });
    if (B) return Oz.default.createElement(GW7, {
        debug: A,
        commands: q,
        initialTools: _,
        initialMessages: B.messages,
        initialFileHistorySnapshots: B.fileHistorySnapshots,
        initialContentReplacements: B.contentReplacements,
        initialAgentName: B.agentName,
        initialAgentColor: B.agentColor,
        mcpClients: z,
        dynamicMcpConfig: Y,
        strictMcpConfig: $,
        systemPrompt: j,
        appendSystemPrompt: H,
        mainThreadAgentDefinition: B.mainThreadAgentDefinition,
        autoConnectIdeFlag: w,
        disableSlashCommands: X,
        thinkingConfig: W,
        onTurnComplete: D
    });
    if (k && (v.length === 0 || z6.length === 0)) return Oz.default.createElement(u, null, Oz.default.createElement(Y5, null), Oz.default.createElement(T, null, " Loading conversations…"));
    if (R) return Oz.default.createElement(u, null, Oz.default.createElement(Y5, null), Oz.default.createElement(T, null, " Resuming conversation…"));
    if (z6.length === 0 && !k) return Oz.default.createElement(F$A, null);
    return Oz.default.createElement(Er8, {
        logs: z6,
        maxHeight: Z,
        onCancel: H6,
        onSelect: q6,
        onLogsChanged: A6 ? () => J6(C) : void 0,
        onLoadMore: O6,
        initialSearchQuery: J,
        isLoading: k,
        reloadGeneration: g,
        showAllProjects: C,
        onToggleAllProjects: $6,
        onAgenticSearch: Sr8
    })
}
// @from(Ln 553541, Col 0)
function F$A() {
    let q = s(3),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = {
        context: "Global"
    }, q[0] = K;
    else K = q[0];
    G1("app:interrupt", g$A, K);
    let _;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) _ = Oz.default.createElement(T, null, "No conversations found to resume."), q[1] = _;
    else _ = q[1];
    let z;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) z = Oz.default.createElement(u, {
        flexDirection: "column"
    }, _, Oz.default.createElement(T, {
        dimColor: !0
    }, "Press", " ", Oz.default.createElement(A8, {
        chord: "ctrl+c",
        action: "exit and start a new conversation",
        format: {
            modCase: "title",
            charCase: "upper"
        }
    }), ".")), q[2] = z;
    else z = q[2];
    return z
}
// @from(Ln 553569, Col 0)
function g$A() {
    process.exit(1)
}
// @from(Ln 553573, Col 0)
function U$A(q) {
    let K = s(8),
        {
            command: _
        } = q,
        z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = [], K[0] = z;
    else z = K[0];
    Oz.default.useEffect(Q$A, z);
    let Y;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) Y = Oz.default.createElement(T, null, "This conversation is from a different directory."), K[1] = Y;
    else Y = K[1];
    let A;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) A = Oz.default.createElement(T, null, "To resume, run:"), K[2] = A;
    else A = K[2];
    let O;
    if (K[3] !== _) O = Oz.default.createElement(u, {
        flexDirection: "column"
    }, A, Oz.default.createElement(T, null, " ", _)), K[3] = _, K[4] = O;
    else O = K[4];
    let w;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) w = Oz.default.createElement(T, {
        dimColor: !0
    }, "(Command copied to clipboard)"), K[5] = w;
    else w = K[5];
    let $;
    if (K[6] !== O) $ = Oz.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, Y, O, w), K[6] = O, K[7] = $;
    else $ = K[7];
    return $
}
// @from(Ln 553607, Col 0)
function Q$A() {
    let q = setTimeout(d$A, 100);
    return () => clearTimeout(q)
}
// @from(Ln 553612, Col 0)
function d$A() {
    process.exit(0)
}
// @from(Ln 553615, Col 4)
Oz
// @from(Ln 553616, Col 4)
D25 = L(() => {
    o6();
    I4();
    y8();
    u7();
    w$7();
    Ej();
    Tx();
    Uu1();
    HX();
    g6();
    C7();
    C8();
    N7();
    Cf();
    H$7();
    NY8();
    wf();
    IX6();
    J$7();
    Q8();
    m8();
    U8();
    _7();
    hY8();
    g4();
    vW7();
    Oz = K6(P6(), 1)
})
// @from(Ln 553645, Col 0)
async function Z25(q, K) {
    let {
        InvalidSettingsDialog: _
    } = await Promise.resolve().then(() => (J25(), H25));
    return sT(q, (z) => W06.default.createElement(_, {
        settingsErrors: K.settingsErrors,
        onContinue: z,
        onExit: K.onExit
    }))
}
// @from(Ln 553655, Col 0)
async function f25(q) {
    let {
        TeleportResumeWrapper: K
    } = await Promise.resolve().then(() => (F$7(), unK));
    return sT(q, (_) => W06.default.createElement(K, {
        onComplete: _,
        onCancel: () => _(null),
        source: "cliArg"
    }))
}
// @from(Ln 553665, Col 0)
async function G25(q, K) {
    let {
        TeleportRepoMismatchDialog: _
    } = await Promise.resolve().then(() => (M25(), X25));
    return sT(q, (z) => W06.default.createElement(_, {
        targetRepo: K.targetRepo,
        initialPaths: K.initialPaths,
        onSelectPath: z,
        onCancel: () => z(null)
    }))
}
// @from(Ln 553676, Col 0)
async function v25(q, K, _, z) {
    let [Y, {
        ResumeConversation: A
    }, {
        App: O
    }] = await Promise.all([_, Promise.resolve().then(() => (D25(), W25)), Promise.resolve().then(() => (HX7(), jX7))]);
    await P06(q, W06.default.createElement(O, {
        getFpsMetrics: K.getFpsMetrics,
        stats: K.stats,
        initialState: K.initialState
    }, W06.default.createElement(TM, null, W06.default.createElement(A, {
        ...z,
        worktreePaths: Y
    }))))
}
// @from(Ln 553691, Col 4)
W06
// @from(Ln 553692, Col 4)
T25 = L(() => {
    FW7();
    ql();
    W06 = K6(P6(), 1)
})
// @from(Ln 553698, Col 0)
function V25() {}
// @from(Ln 553700, Col 0)
function D06(q, K, _) {
    j6(q);
    let z = _ ? `${K} plugin "${_}"` : K === "disable-all" ? "disable all plugins" : `${K} plugins`;
    console.error(`${e6.cross} Failed to ${z}: ${b6(q)}`);
    let Y = _ ? (() => {
        let {
            name: A,
            marketplace: O
        } = Z4(_);
        return {
            _PROTO_plugin_name: A,
            ...O && {
                _PROTO_marketplace_name: O
            },
            ...xR(A, O, Xy())
        }
    })() : {};
    d("tengu_plugin_command_failed", {
        command: K,
        error_category: Vf4(q),
        ...Y
    }), process.exit(1)
}
// @from(Ln 553723, Col 0)
async function k25(q, K = "user") {
    try {
        let _ = await tpK(q, K);
        if (!_.success) throw Error(_.message);
        let {
            name: z,
            marketplace: Y
        } = Z4(_.pluginId || q);
        return d("tengu_plugin_installed_cli", {
            _PROTO_plugin_name: z,
            ...Y && {
                _PROTO_marketplace_name: Y
            },
            scope: _.scope || K,
            install_source: "cli-explicit",
            ...xR(z, Y, Xy())
        }), _.message
    } catch (_) {
        D06(_, "install", q)
    }
}
// @from(Ln 553744, Col 0)
async function N25(q, K = "user", _ = !1) {
    try {
        let z = await ie(q, K, !_);
        if (!z.success) throw Error(z.message);
        let {
            name: Y,
            marketplace: A
        } = Z4(z.pluginId || q);
        return d("tengu_plugin_uninstalled_cli", {
            _PROTO_plugin_name: Y,
            ...A && {
                _PROTO_marketplace_name: A
            },
            scope: z.scope || K,
            ...xR(Y, A, Xy())
        }), z.message
    } catch (z) {
        D06(z, "uninstall", q)
    }
}
// @from(Ln 553764, Col 0)
async function E25(q, K) {
    try {
        let _ = await Cx6(q, K);
        if (!_.success) throw Error(_.message);
        let {
            name: z,
            marketplace: Y
        } = Z4(_.pluginId || q);
        return d("tengu_plugin_disabled_cli", {
            _PROTO_plugin_name: z,
            ...Y && {
                _PROTO_marketplace_name: Y
            },
            scope: _.scope,
            ...xR(z, Y, Xy())
        }), `${e6.tick} ${_.message}`
    } catch (_) {
        D06(_, "disable", q)
    }
}
// @from(Ln 553784, Col 0)
async function y25() {
    try {
        let q = await epK();
        if (!q.success) throw Error(q.message);
        return d("tengu_plugin_disabled_all_cli", {}), `${e6.tick} ${q.message}`
    } catch (q) {
        D06(q, "disable-all")
    }
}
// @from(Ln 553793, Col 0)
async function L25(q, K) {
    try {
        f4(`Checking for updates for plugin "${q}" at ${K} scope…
`);
        let _ = await bx6(q, K);
        if (!_.success) throw Error(_.message);
        if (f4(`${e6.tick} ${_.message}
`), !_.alreadyUpToDate && !_.skipped) {
            let {
                name: z,
                marketplace: Y
            } = Z4(_.pluginId || q);
            d("tengu_plugin_updated_cli", {
                _PROTO_plugin_name: z,
                ...Y && {
                    _PROTO_marketplace_name: Y
                },
                old_version: _.oldVersion || "unknown",
                new_version: _.newVersion || "unknown",
                ...xR(z, Y, Xy())
            })
        }
        await WK(0)
    } catch (_) {
        D06(_, "update", q)
    }
}
// @from(Ln 553820, Col 4)
UW7 = L(() => {
    Qq();
    m8();
    CY();
    U8();
    iK6();
    aW();
    sK6();
    C8();
    Ix6()
})
// @from(Ln 553832, Col 0)
function l$A(q) {
    return `# Batch: Parallel Work Orchestration

You are orchestrating a large, parallelizable change across this codebase.

## User Instruction

${q}

## Phase 1: Research and Plan (Plan Mode)

Call the \`${d56}\` tool now to enter plan mode, then:

1. **Understand the scope.** Launch one or more subagents (in the foreground — you need their results) to deeply research what this instruction touches. Find all the files, patterns, and call sites that need to change. Understand the existing conventions so the migration is consistent.

2. **Decompose into independent units.** Break the work into ${h25}–${R25} self-contained units. Each unit must:
   - Be independently implementable in an isolated git worktree (no shared state with sibling units)
   - Be mergeable on its own without depending on another unit's PR landing first
   - Be roughly uniform in size (split large units, merge trivial ones)

   Scale the count to the actual work: few files → closer to ${h25}; hundreds of files → closer to ${R25}. Prefer per-directory or per-module slicing over arbitrary file lists.

3. **Determine the e2e test recipe.** Figure out how a worker can verify its change actually works end-to-end — not just that unit tests pass. Look for:
   - A \`claude-in-chrome\` skill or browser-automation tool (for UI changes: click through the affected flow, screenshot the result)
   - A \`tmux\` or CLI-verifier skill (for CLI changes: launch the app interactively, exercise the changed behavior)
   - A dev-server + curl pattern (for API changes: start the server, hit the affected endpoints)
   - An existing e2e/integration test suite the worker can run

   If you cannot find a concrete e2e path, use the \`${AO}\` tool to ask the user how to verify this change end-to-end. Offer 2–3 specific options based on what you found (e.g., "Screenshot via chrome extension", "Run \`bun run dev\` and curl the endpoint", "No e2e — unit tests are sufficient"). Do not skip this — the workers cannot ask the user themselves.

   Write the recipe as a short, concrete set of steps that a worker can execute autonomously. Include any setup (start a dev server, build first) and the exact command/interaction to verify.

4. **Write the plan.** In your plan file, include:
   - A summary of what you found during research
   - A numbered list of work units — for each: a short title, the list of files/directories it covers, and a one-line description of the change
   - The e2e test recipe (or "skip e2e because …" if the user chose that)
   - The exact worker instructions you will give each agent (the shared template)

5. Call \`${Fk}\` to present the plan for approval.

## Phase 2: Spawn Workers (After Plan Approval)

Once the plan is approved, spawn one background agent per work unit using the \`${T4}\` tool. **All agents must use \`isolation: "worktree"\` and \`run_in_background: true\`.** Launch them all in a single message block so they run in parallel.

For each agent, the prompt must be fully self-contained. Include:
- The overall goal (the user's instruction)
- This unit's specific task (title, file list, change description — copied verbatim from your plan)
- Any codebase conventions you discovered that the worker needs to follow
- The e2e test recipe from your plan (or "skip e2e because …")
- The worker instructions below, copied verbatim:

\`\`\`
${c$A}
\`\`\`

Use \`subagent_type: "general-purpose"\` unless a more specific agent type fits.

## Phase 3: Track Progress

After launching all workers, render an initial status table:

| # | Unit | Status | PR |
|---|------|--------|----|
| 1 | <title> | running | — |
| 2 | <title> | running | — |

As background-agent completion notifications arrive, parse the \`PR: <url>\` line from each agent's result and re-render the table with updated status (\`done\` / \`failed\`) and PR links. Keep a brief failure note for any agent that did not produce a PR.

When all agents have reported, render the final table and a one-line summary (e.g., "22/24 units landed as PRs").
`
}
// @from(Ln 553904, Col 0)
function S25() {
    MA({
        name: "batch",
        description: "Research and plan a large-scale change, then execute it in parallel across 5–30 isolated worktree agents that each open a PR.",
        whenToUse: "Use when the user wants to make a sweeping, mechanical change across many files (migrations, refactors, bulk renames) that can be decomposed into independent parallel units.",
        argumentHint: "<instruction>",
        userInvocable: !0,
        disableModelInvocation: !0,
        async getPromptForCommand(q) {
            let K = q.trim();
            if (!K) return [{
                type: "text",
                text: i$A
            }];
            if (!await qX()) return [{
                type: "text",
                text: n$A
            }];
            return [{
                type: "text",
                text: l$A(K)
            }]
        }
    })
}
// @from(Ln 553929, Col 4)
h25 = 5
// @from(Ln 553930, Col 4)
R25 = 30
// @from(Ln 553931, Col 4)
c$A
// @from(Ln 553931, Col 9)
n$A = "This is not a git repository. The `/batch` command requires a git repo because it spawns agents in isolated git worktrees and creates PRs from each. Initialize a repo first, or run this from inside an existing one."
// @from(Ln 553932, Col 4)
i$A = `Provide an instruction describing the batch change you want to make.

Examples:
  /batch migrate from react to vue
  /batch replace all uses of lodash with native equivalents
  /batch add type annotations to all untyped function parameters`
// @from(Ln 553938, Col 4)
C25 = L(() => {
    sY();
    cp();
    pK();
    k0();
    c$A = `After you finish implementing the change:
1. **Simplify** — Invoke the \`${VH}\` tool with \`skill: "simplify"\` to review and clean up your changes.
2. **Run unit tests** — Run the project's test suite (check for package.json scripts, Makefile targets, or common commands like \`npm test\`, \`bun test\`, \`pytest\`, \`go test\`). If tests fail, fix them.
3. **Test end-to-end** — Follow the e2e test recipe from the coordinator's prompt (below). If the recipe says to skip e2e for this unit, skip it.
4. **Commit and push** — Commit all changes with a clear message, push the branch, and create a PR with \`gh pr create\`. Use a descriptive title. If \`gh\` is not available or the push fails, note it in your final message.
5. **Report** — End with a single line: \`PR: <url>\` so the coordinator can track it. If no PR was created, end with \`PR: none — <reason>\`.`
})
// @from(Ln 553951, Col 0)
function b25() {
    MA({
        name: "claude-in-chrome",
        description: "Automates your Chrome browser to interact with web pages - clicking elements, filling forms, capturing screenshots, reading console logs, and navigating sites. Opens pages in new tabs within your existing Chrome session. Requires site-level permissions before executing (configured in the extension).",
        whenToUse: "When the user wants to interact with web pages, automate browser tasks, capture screenshots, read console logs, or perform any browser-based actions. Always invoke BEFORE attempting to use any mcp__claude-in-chrome__* tools.",
        allowedTools: r$A,
        userInvocable: !0,
        isEnabled: () => ku6(),
        async getPromptForCommand(q) {
            let K = `${AC4}
${o$A}`;
            if (q) K += `
## Task

${q}`;
            return [{
                type: "text",
                text: K
            }]
        }
    })
}
// @from(Ln 553973, Col 4)
r$A
// @from(Ln 553973, Col 9)
o$A = `
Now that this skill is invoked, you have access to Chrome browser automation tools. You can now use the mcp__claude-in-chrome__* tools to interact with web pages.

IMPORTANT: Start by calling mcp__claude-in-chrome__tabs_context_mcp to get information about the user's current browser tabs.
`
// @from(Ln 553978, Col 4)
I25 = L(() => {
    jU6();
    DW6();
    k0();
    r$A = ri.map((q) => `mcp__claude-in-chrome__${q.name}`)
})
// @from(Ln 553989, Col 0)
function x25() {
    MA({
        name: "debug",
        description: "Enable debug logging for this session and help diagnose issues",
        allowedTools: ["Read", "Grep", "Glob"],
        argumentHint: "[issue description]",
        disableModelInvocation: !0,
        userInvocable: !0,
        async getPromptForCommand(q) {
            let K = YT7(),
                _ = yY6(),
                z;
            try {
                let O = await s$A(_),
                    w = Math.min(O.size, t$A),
                    $ = O.size - w,
                    j = await a$A(_, "r");
                try {
                    let {
                        buffer: H,
                        bytesRead: J
                    } = await j.read({
                        buffer: Buffer.alloc(w),
                        position: $
                    }), X = H.toString("utf-8", 0, J).split(`
`).slice(-_e8).join(`
`);
                    z = `Log size: ${o4(O.size)}

### Last ${_e8} lines

\`\`\`
${X}
\`\`\``
                } finally {
                    await j.close()
                }
            } catch (O) {
                z = t1(O) ? "No debug log exists yet — logging was just enabled." : `Failed to read last ${_e8} lines of debug log: ${b6(O)}`
            }
            return [{
                type: "text",
                text: `# Debug Skill

Help the user debug an issue they're encountering in this current Claude Code session.
${K?"":`
## Debug Logging Just Enabled

Debug logging was OFF for this session until now. Nothing prior to this /debug invocation was captured.

Tell the user that debug logging is now active at \`${_}\`, ask them to reproduce the issue, then re-read the log. If they can't reproduce, they can also restart with \`claude --debug\` to capture logs from startup.
`}
## Session Debug Log

The debug log for the current session is at: \`${_}\`

${z}

For additional context, grep for [ERROR] and [WARN] lines across the full file.

## Issue Description

${q||"The user did not describe a specific issue. Read the debug log and summarize any errors, warnings, or notable issues."}

## Settings

Remember that settings are in:
* user - ${Ww("userSettings")}
* project - ${Ww("projectSettings")}
* local - ${Ww("localSettings")}

## Instructions

1. Review the user's issue description
2. The last ${_e8} lines show the debug file format. Look for [ERROR] and [WARN] entries, stack traces, and failure patterns across the file
3. Consider launching the ${ll1} subagent to understand the relevant Claude Code features
4. Explain what you found in plain language
5. Suggest concrete fixes or next steps
`
            }]
        }
    })
}
// @from(Ln 554072, Col 4)
_e8 = 20
// @from(Ln 554073, Col 4)
t$A = 65536
// @from(Ln 554074, Col 4)
u25 = L(() => {
    nl1();
    a1();
    K8();
    m8();
    c7();
    k0()
})
// @from(Ln 554083, Col 0)
function e$A() {
    return QW7(["Context", "Description"], Ws6.map((q) => [`\`${q}\``, nA4[q]]))
}
// @from(Ln 554087, Col 0)
function qjA() {
    let q = {};
    for (let K of OE6)
        for (let [_, z] of Object.entries(K.bindings))
            if (z) {
                if (!q[z]) q[z] = {
                    keys: [],
                    context: K.context
                };
                q[z].keys.push(_)
            } return QW7(["Action", "Default Key(s)", "Context"], wm1.map((K) => {
        let _ = q[K],
            z = _ ? _.keys.map((A) => `\`${A}\``).join(", ") : "(none)",
            Y = _ ? _.context : KjA(K);
        return [`\`${K}\``, z, Y]
    }))
}
// @from(Ln 554105, Col 0)
function KjA(q) {
    let K = q.split(":")[0];
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
    } [K ?? ""] ?? "Unknown"
}
// @from(Ln 554129, Col 0)
function _jA() {
    let q = [];
    q.push("### Non-rebindable (errors)");
    for (let K of Ps6) q.push(`- \`${K.key}\` — ${K.reason}`);
    q.push(""), q.push("### Terminal reserved (errors/warnings)");
    for (let K of Ym1) q.push(`- \`${K.key}\` — ${K.reason} (${K.severity==="error"?"will not work":"may conflict"})`);
    q.push(""), q.push("### macOS reserved (errors)");
    for (let K of Am1) q.push(`- \`${K.key}\` — ${K.reason}`);
    return q.join(`
`)
}
// @from(Ln 554141, Col 0)
function m25() {
    MA({
        name: "keybindings-help",
        description: 'Use when the user wants to customize keyboard shortcuts, rebind keys, add chord bindings, or modify ~/.claude/keybindings.json. Examples: "rebind ctrl+s", "add a chord shortcut", "change the submit key", "customize keybindings".',
        allowedTools: ["Read"],
        userInvocable: !1,
        isEnabled: WR,
        async getPromptForCommand(q) {
            let K = e$A(),
                _ = qjA(),
                z = _jA(),
                Y = [wjA, $jA, jjA, HjA, JjA, XjA, MjA, PjA, `## Reserved Shortcuts

${z}`, `## Available Contexts

${K}`, `## Available Actions

${_}`];
            if (q) Y.push(`## User Request

${q}`);
            return [{
                type: "text",
                text: Y.join(`

`)
            }]
        }
    })
}
// @from(Ln 554172, Col 0)
function QW7(q, K) {
    let _ = q.map(() => "---");
    return [`| ${q.join(" | ")} |`, `| ${_.join(" | ")} |`, ...K.map((z) => `| ${z.join(" | ")} |`)].join(`
`)
}
// @from(Ln 554177, Col 4)
zjA
// @from(Ln 554177, Col 9)
YjA
// @from(Ln 554177, Col 14)
AjA
// @from(Ln 554177, Col 19)
OjA
// @from(Ln 554177, Col 24)
wjA
// @from(Ln 554177, Col 29)
$jA
// @from(Ln 554177, Col 34)
jjA
// @from(Ln 554177, Col 39)
HjA
// @from(Ln 554177, Col 44)
JjA
// @from(Ln 554177, Col 49)
XjA
// @from(Ln 554177, Col 54)
MjA
// @from(Ln 554177, Col 59)
PjA
// @from(Ln 554178, Col 4)
B25 = L(() => {
    rE8();
    yd();
    aE8();
    $m1();
    e8();
    k0();
    zjA = {
        $schema: "https://www.schemastore.org/claude-code-keybindings.json",
        $docs: "https://code.claude.com/docs/en/keybindings",
        bindings: [{
            context: "Chat",
            bindings: {
                "ctrl+e": "chat:externalEditor"
            }
        }]
    }, YjA = {
        context: "Chat",
        bindings: {
            "ctrl+s": null
        }
    }, AjA = {
        context: "Chat",
        bindings: {
            "ctrl+g": null,
            "ctrl+e": "chat:externalEditor"
        }
    }, OjA = {
        context: "Global",
        bindings: {
            "ctrl+k ctrl+t": "app:toggleTodos"
        }
    }, wjA = ["# Keybindings Skill", "", "Create or modify `~/.claude/keybindings.json` to customize keyboard shortcuts.", "", "## CRITICAL: Read Before Write", "", "**Always read `~/.claude/keybindings.json` first** (it may not exist yet). Merge changes with existing bindings — never replace the entire file.", "", "- Use **Edit** tool for modifications to existing files", "- Use **Write** tool only if the file does not exist yet"].join(`
`), $jA = ["## File Format", "", "```json", I6(zjA, null, 2), "```", "", "Always include the `$schema` and `$docs` fields."].join(`
`), jjA = ["## Keystroke Syntax", "", "**Modifiers** (combine with `+`):", "- `ctrl` (alias: `control`)", "- `alt` (aliases: `opt`, `option`) — note: `alt` and `meta` are identical in terminals", "- `shift`", "- `meta` (aliases: `cmd`, `command`)", "", "**Special keys**: `escape`/`esc`, `enter`/`return`, `tab`, `space`, `backspace`, `delete`, `up`, `down`, `left`, `right`", "", "**Chords**: Space-separated keystrokes, e.g. `ctrl+k ctrl+s` (1-second timeout between keystrokes)", "", "**Examples**: `ctrl+shift+p`, `alt+enter`, `ctrl+k ctrl+n`"].join(`
`), HjA = ["## Unbinding Default Shortcuts", "", "Set a key to `null` to remove its default binding:", "", "```json", I6(YjA, null, 2), "```"].join(`
`), JjA = ["## How User Bindings Interact with Defaults", "", "- User bindings are **additive** — they are appended after the default bindings", "- To **move** a binding to a different key: unbind the old key (`null`) AND add the new binding", "- A context only needs to appear in the user's file if they want to change something in that context"].join(`
`), XjA = ["## Common Patterns", "", "### Rebind a key", "To change the external editor shortcut from `ctrl+g` to `ctrl+e`:", "```json", I6(AjA, null, 2), "```", "", "### Add a chord binding", "```json", I6(OjA, null, 2), "```"].join(`
`), MjA = ["## Behavioral Rules", "", "1. Only include contexts the user wants to change (minimal overrides)", "2. Validate that actions and contexts are from the known lists below", "3. Warn the user proactively if they choose a key that conflicts with reserved shortcuts or common tools like tmux (`ctrl+b`) and screen (`ctrl+a`)", "4. When adding a new binding for an existing action, the new binding is additive (existing default still works unless explicitly unbound)", "5. To fully replace a default binding, unbind the old key AND add the new one"].join(`
`), PjA = ["## Validation with /doctor", "", 'The `/doctor` command includes a "Keybinding Configuration Issues" section that validates `~/.claude/keybindings.json`.', "", "### Common Issues and Fixes", "", QW7(["Issue", "Cause", "Fix"], [
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
// @from(Ln 554229, Col 0)
function p25() {
    MA({
        name: "less-permission-prompts",
        description: "Scan your transcripts for common read-only Bash and MCP tool calls, then add a prioritized allowlist to project .claude/settings.json to reduce permission prompts.",
        userInvocable: !0,
        async getPromptForCommand(q) {
            let K = WjA;
            if (q) K += `

## Additional instructions from the user

${q}`;
            return [{
                type: "text",
                text: K
            }]
        }
    })
}
// @from(Ln 554248, Col 4)
WjA = '# Less Permission Prompts\n\nLook through my transcripts\' MCP and bash tool calls, and based on those, make a prioritized list of patterns that I should add to my permission allowlist to reduce permission prompts. Focus on read-only commands.\n\nThe format for permissions is: `Bash(foo*)`, `Bash(foo)`, `Bash(foo bar *)`, `mcp__slack__slack_read_thread`, etc.\n\nThen, add these to the project `.claude/settings.json` under `permissions.allow`.\n\n## Steps\n\n1. **Locate transcripts.** Session transcripts live at `~/.claude/projects/<sanitized-cwd>/*.jsonl`. Each line is a JSON object. Tool calls appear as `assistant` messages with `message.content[]` entries of `type: "tool_use"`. The `name` field identifies the tool (e.g. `"Bash"`, `"mcp__slack__slack_read_thread"`); for Bash, `input.command` is the shell string.\n\n   Scan the recent transcripts across the user\'s projects dir — not just the current project — so the allowlist reflects their actual usage. Cap the scan at a reasonable number of recent sessions (e.g. 50 most-recently-modified JSONL files) so this stays fast.\n\n2. **Extract tool-call frequencies.**\n   - For `Bash` calls: parse `input.command`, take the leading command token (handling `sudo`, `timeout`, pipes, `&&`, env-var prefixes). Record the command + first subcommand pair (e.g. `git status`, `gh pr view`, `ls`, `cat`).\n   - For MCP calls: record the full tool name (e.g. `mcp__slack__slack_read_thread`).\n   - Count occurrences across the scanned transcripts.\n\n3. **Filter to read-only.** Keep only commands that don\'t mutate state. Examples of read-only: `ls`, `cat`, `pwd`, `git status`, `git log`, `git diff`, `git show`, `git branch`, `rg`, `grep`, `find`, `head`, `tail`, `wc`, `file`, `which`, `echo`, `date`, `gh pr view`, `gh pr list`, `gh pr diff`, `gh issue view`, `gh issue list`, `gh run list`, `gh run view`, `gh api` (GET), `bun run typecheck`, `bun run lint`, `bun run test` (for tests that don\'t mutate), `docker ps`, `docker logs`, `kubectl get`, `kubectl describe`, `ps`, `top`, `df`, `du`, `env`, `printenv`, any MCP tool with `read`/`get`/`list`/`search`/`view` in its name.\n\n   Drop anything that writes, deletes, renames, pushes, merges, installs, or runs a build/test that has side effects. When in doubt, leave it out.\n\n   **Never allowlist a pattern that grants arbitrary code execution.** A wildcard rule for any of these (e.g. `Bash(python3:*)`) is equivalent to allowing arbitrary code execution. This list is not exhaustive — apply the same rule to anything in the same category:\n   - Interpreters: `python`/`python3`, `node`, `bun`, `deno`, `ruby`, `perl`, `php`, `lua`, etc.\n   - Shells: `bash`, `sh`, `zsh`, `fish`, `eval`, `exec`, `ssh`, etc.\n   - Package runners: `npx`, `bunx`, `uvx`, `uv run`, etc.\n   - Task-runner wildcards: `npm run *`, `yarn run *`, `pnpm run *`, `bun run *`, `make *`, `just *`, `cargo run *`, `go run *`, etc. — an exact `Bash(bun run typecheck)` is fine, `Bash(bun run *)` is not\n   - `gh api *`, `docker run`/`exec`, `kubectl exec`, `sudo`, and similar\n\n4. **Drop commands Claude Code already auto-allows.** These don\'t need an allowlist entry — they never prompt. If you see any of these in the transcripts, skip them; don\'t suggest them to the user.\n\n   - **Always auto-allowed (any args):** `cal`, `uptime`, `cat`, `head`, `tail`, `wc`, `stat`, `strings`, `hexdump`, `od`, `nl`, `id`, `uname`, `free`, `df`, `du`, `locale`, `groups`, `nproc`, `basename`, `dirname`, `realpath`, `cut`, `paste`, `tr`, `column`, `tac`, `rev`, `fold`, `expand`, `unexpand`, `fmt`, `comm`, `cmp`, `numfmt`, `readlink`, `diff`, `true`, `false`, `sleep`, `which`, `type`, `expr`, `test`, `getconf`, `seq`, `tsort`, `pr`, `echo`, `printf`, `ls`, `cd`, `find`.\n   - **Auto-allowed with zero args only:** `pwd`, `whoami`, `alias`.\n   - **Auto-allowed exact forms:** `claude -h`, `claude --help`, `node -v`, `node --version`, `python --version`, `python3 --version`, `ip addr`.\n   - **Auto-allowed with safe flags only (validated):** `xargs`, `file`, `sed` (read-only expressions), `sort`, `man`, `help`, `netstat`, `ps`, `base64`, `grep`, `egrep`, `fgrep`, `sha256sum`, `sha1sum`, `md5sum`, `tree`, `date`, `hostname`, `info`, `lsof`, `pgrep`, `tput`, `ss`, `fd`, `fdfind`, `aki`, `rg`, `jq`, `uniq`, `history`, `arch`, `ifconfig`, `pyright`.\n   - **All git read-only subcommands:** `git status`, `git log`, `git diff`, `git show`, `git blame`, `git branch`, `git tag`, `git remote`, `git ls-files`, `git ls-remote`, `git config --get`, `git rev-parse`, `git describe`, `git stash list`, `git reflog`, `git shortlog`, `git cat-file`, `git for-each-ref`, `git worktree list`, etc.\n   - **All gh read-only subcommands:** `gh pr view`, `gh pr list`, `gh pr diff`, `gh pr checks`, `gh pr status`, `gh issue view`, `gh issue list`, `gh issue status`, `gh run view`, `gh run list`, `gh workflow list`, `gh workflow view`, `gh repo view`, `gh release view`, `gh release list`, `gh api` (GET), `gh auth status`, etc.\n   - **Docker read-only subcommands:** `docker ps`, `docker images`, `docker logs`, `docker inspect`.\n\n   Source of truth: `src/tools/BashTool/readOnlyValidation.ts` (`READONLY_COMMANDS`, `READONLY_NOARGS`, `READONLY_EXACT`, `COMMAND_ALLOWLIST`) and `src/utils/shell/readOnlyCommandValidation.ts` (`GIT_READ_ONLY_COMMANDS`, `GH_READ_ONLY_COMMANDS`, `DOCKER_READ_ONLY_COMMANDS`, `RIPGREP_READ_ONLY_COMMANDS`, `PYRIGHT_READ_ONLY_COMMANDS`). If the user is in this repo and you\'re unsure whether a command is covered, grep these files rather than guessing.\n\n5. **Pick the pattern form.** Use the narrowest pattern that still covers the observed usage:\n   - If the user runs many variants (`git log`, `git log --oneline`, `git log main..HEAD`): use `Bash(git log *)` — note the space before `*`, which is required for prefix matching to work correctly.\n   - If a single exact invocation is common: use `Bash(foo)` with no wildcard.\n   - For MCP: use the full tool name verbatim (no wildcard needed; they\'re already specific).\n   - Never widen a pattern to the point that it conflicts with the rules above (no arbitrary code execution, no mutation/side effects).\n\n6. **Prioritize.** Rank by count descending. Drop anything that appeared fewer than ~3 times — not worth the allowlist entry. Cap the list at the top ~20 so the user can skim it.\n\n7. **Present the prioritized list to the user** as a markdown table with columns: rank, pattern, count, one-line description. Example:\n\n   | # | Pattern | Count | Notes |\n   |---|---------|-------|-------|\n   | 1 | `Bash(git status *)` | 142 | repo status checks |\n   | 2 | `Bash(gh pr view *)` | 87 | PR inspection |\n   | 3 | `mcp__slack__slack_read_thread` | 54 | Slack thread reads |\n\n8. **Merge into `.claude/settings.json`** in the current project (not `~/.claude/settings.json`, not `.claude/settings.local.json`). Create the file if it doesn\'t exist. Preserve existing keys and existing entries in `permissions.allow`; de-duplicate against what\'s already there; don\'t remove anything; don\'t reorder unrelated fields.\n\n9. **Report back.** Tell the user what you added (count + a few examples), what was already in the allowlist, and what you skipped and why (e.g. "dropped `rm` and `git push` — not read-only; dropped `cat`/`ls`/`git status` — already auto-allowed, no rule needed").\n\nDo not add anything to `permissions.deny` or `permissions.ask`. Do not touch any other settings field.\n'
// @from(Ln 554249, Col 4)
F25 = L(() => {
    k0()
})
// @from(Ln 554253, Col 0)
function U25(q) {
    let K = 0,
        _ = "";
    while (K < q) {
        let z = 10 + Math.floor(Math.random() * 11),
            Y = 0;
        for (let A = 0; A < z && K < q; A++) {
            let O = g25[Math.floor(Math.random() * g25.length)];
            if (_ += O, K++, Y++, A === z - 1 || K >= q) _ += ". ";
            else _ += " "
        }
        if (Y > 0 && Math.random() < 0.2 && K < q) _ += `

`
    }
    return _.trim()
}
// @from(Ln 554271, Col 0)
function Q25() {
    return
}
// @from(Ln 554274, Col 4)
g25
// @from(Ln 554275, Col 4)
d25 = L(() => {
    k0();
    g25 = ["the", "a", "an", "I", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "my", "your", "his", "its", "our", "this", "that", "what", "who", "is", "are", "was", "were", "be", "been", "have", "has", "had", "do", "does", "did", "will", "would", "can", "could", "may", "might", "must", "shall", "should", "make", "made", "get", "got", "go", "went", "come", "came", "see", "saw", "know", "take", "think", "look", "want", "use", "find", "give", "tell", "work", "call", "try", "ask", "need", "feel", "seem", "leave", "put", "time", "year", "day", "way", "man", "thing", "life", "hand", "part", "place", "case", "point", "fact", "good", "new", "first", "last", "long", "great", "little", "own", "other", "old", "right", "big", "high", "small", "large", "next", "early", "young", "few", "public", "bad", "same", "able", "in", "on", "at", "to", "for", "of", "with", "from", "by", "about", "like", "through", "over", "before", "between", "under", "since", "without", "and", "or", "but", "if", "than", "because", "as", "until", "while", "so", "though", "both", "each", "when", "where", "why", "how", "not", "now", "just", "more", "also", "here", "there", "then", "only", "very", "well", "back", "still", "even", "much", "too", "such", "never", "again", "most", "once", "off", "away", "down", "out", "up", "test", "code", "data", "file", "line", "text", "word", "number", "system", "program", "set", "run", "value", "name", "type", "state", "end", "start"]
})
// @from(Ln 554280, Col 0)
function c25() {
    return
}
// @from(Ln 554283, Col 4)
l25 = L(() => {
    VY();
    k0()
})
// @from(Ln 554287, Col 4)
i25 = `# Verifying a CLI change

The handle is direct invocation. The evidence is stdout/stderr/exit code.

## Pattern

1. Build (if the CLI needs building)
2. Run with arguments that exercise the changed code
3. Capture output and exit code
4. Compare to expected

CLIs are usually the simplest to verify — no lifecycle, no ports.

## Worked example

**Diff:** adds a \`--json\` flag to the \`status\` subcommand. New flag
parsing in \`cmd/status.go\`, new output branch.

**Claim (commit msg):** "machine-readable status output."

**Inference:** \`tool status --json\` now exists, emits valid JSON with
the same fields the human output shows. \`tool status\` without the flag
is unchanged.

**Plan:**
1. Build
2. \`tool status\` → human output, same as before (non-regression)
3. \`tool status --json\` → valid JSON, parseable
4. JSON fields match human output fields

**Execute:**
\`\`\`bash
go build -o /tmp/tool ./cmd/tool

/tmp/tool status
# → Status: healthy
# → Uptime: 3h12m
# → Connections: 47

/tmp/tool status --json
# → {"status":"healthy","uptime_seconds":11520,"connections":47}

/tmp/tool status --json | jq -e .status
# → "healthy"
# (jq -e exits nonzero if the path is null/false — cheap validity check)

echo $?
# → 0
\`\`\`

**Verdict:** PASS — flag works, JSON is valid, fields line up.

## What FAIL looks like

- \`unknown flag: --json\` → not wired up, or you're running a stale build
- Output isn't valid JSON (\`jq\` errors) → serialization bug
- \`tool status\` (no flag) changed → regression; the diff touched more
  than it should
- JSON has different field names than expected → claim/code mismatch,
  might be fine, note it

## Reading from stdin, destructive commands

If the CLI reads stdin → pipe in test data.
If it writes files / hits a network / deletes things → point it at a
tmp dir / a mock / a dry-run flag. If there's no safe mode and the
diff touches the destructive path, say so and verify what you can
around it.
`
// @from(Ln 554356, Col 4)
n25 = () => {}
// @from(Ln 554357, Col 4)
o25 = `# Verifying a server/API change

The handle is \`curl\` (or equivalent). The evidence is the response.

## Pattern

1. Start the server (background, with a readiness poll — see below)
2. \`curl\` the route the diff touches, with inputs that hit the changed branch
3. Capture the full response (status + headers + body)
4. Compare to expected

## Lifecycle

If there's a run-skill it handles this. If not:

\`\`\`bash
<start-command> &> /tmp/server.log &
SERVER_PID=$!
for i in {1..30}; do curl -sf localhost:PORT/health >/dev/null && break; sleep 1; done
# ... your curls ...
kill $SERVER_PID
\`\`\`

No readiness endpoint? Poll the route you're about to test until it
stops returning connection-refused, then add a beat.

## Worked example

**Diff:** adds a \`Retry-After\` header to 429 responses in \`rateLimit.ts\`.
**Claim (PR body):** "clients can now back off correctly."

**Inference:** hitting the rate limit should now return \`Retry-After: <n>\`
in the response headers. It didn't before.

**Plan:**
1. Start server
2. Hit the rate-limited endpoint enough times to trigger 429
3. Check the 429 response has \`Retry-After\` header
4. Check the value is a positive integer

**Execute:**
\`\`\`bash
# trigger the limit — 10 fast requests, limit is 5/sec per the diff
for i in {1..10}; do curl -s -o /dev/null -w "%{http_code}\\n" localhost:3000/api/thing; done
# → 200 200 200 200 200 429 429 429 429 429

# capture the 429 headers
curl -si localhost:3000/api/thing | head -20
# → HTTP/1.1 429 Too Many Requests
# → Retry-After: 12
# → ...
\`\`\`

**Verdict:** PASS — \`Retry-After: 12\` present, positive integer.

## What FAIL looks like

- Header absent → the diff didn't take effect, or you're not actually
  hitting the 429 path (check the status code first)
- Header present but value is \`NaN\` / \`undefined\` / negative → the
  logic is wrong
- You got 200s all the way through → you never triggered the changed
  path. Tighten the request burst or check the rate limit config.
`
// @from(Ln 554421, Col 4)
r25 = () => {}
// @from(Ln 554422, Col 4)
s25 = `---
name: runtime-verification
description: Verify that a code change actually does what it's supposed to by running the app and observing behavior. Use when asked to verify a PR, confirm a fix works, test a change manually, check that a feature works, or validate local changes before pushing.
---

**Verification is runtime observation.** You build the app, run it,
drive it to where the changed code executes, and capture what you
see. That capture is your evidence. Nothing else is.

**Don't run tests. Don't typecheck.** CI ran both before you got
here. Running them again proves you can run CI. Not as a warm-up,
not "just to be sure," not as a regression sweep after. The time
goes to running the app instead.

**Don't import-and-call.** \`import { foo } from './src/...'\` then
\`console.log(foo(x))\` is a unit test you wrote. The function did what
the function does — you knew that from reading it. The app never ran.
Whatever calls \`foo\` in the real codebase ends at a CLI, a socket, or
a window. Go there.

## Find the change

Establish the full range first — a branch may be many commits:

\`\`\`bash
git log --oneline @{u}..              # count commits
git diff @{u}.. --stat                # full range, not HEAD~1
gh pr diff                            # if in a PR context
\`\`\`

State the commit count in your report. Large diff truncating? Redirect:
\`git diff @{u}.. > /tmp/d\` then Read it. No diff at all → say so, stop.

**The diff is ground truth. The PR description is a claim about it.**
Read both. If they disagree, that's a finding.

## Surface

The surface is where a user — human or programmatic — meets the
change. That's where you observe.

| Change reaches | Surface | You |
|---|---|---|
| CLI / TUI | terminal | type the command, capture the pane — [example](examples/cli.md) |
| Server / API | socket | send the request, capture the response — [example](examples/server.md) |
| GUI | pixels | drive it under xvfb/Playwright, screenshot |
| Library | package boundary | sample code through the public export — \`import pkg\`, not \`import ./src/...\` |
| Prompt / agent config | the agent | run the agent, capture its behavior |
| CI workflow | Actions | dispatch it, read the run |

**Internal function? Not a surface.** Something in the repo calls it
and that caller ends at one of the rows above. Follow it there. A
bash security gate's surface isn't the function's return value — it's
the CLI prompting or auto-allowing when you type the command.

**No runtime surface at all** — docs-only, type declarations with no
emit, build config that produces no behavioral diff — report
**SKIP — no runtime surface: (reason).** Don't run tests to fill
the space.

**Tests in the diff are the author's evidence, not a surface.** CI
runs them. You'd be re-running CI. Tests-only PR → SKIP, one line.
Mixed src+tests → verify the src, ignore the test files. Reading a
test to learn what to check is fine — it's a spec. But then go run
the app. Checking that assertions match source is code review.

## Get a handle

**Check \`.claude/skills/\` first — even if you already know how to
build and run.** A matching \`verifier-*\` skill is the repo's
evidence-capture protocol: it wraps the session in whatever
recording/screenshot mechanism the review pipeline consumes. Drive
the surface without it and you get a verdict with no replay.

\`\`\`bash
ls .claude/skills/
\`\`\`

- **\`verifier-*\` matching your surface** (CLI verifier for a CLI
  change, etc.) → invoke it with the Skill tool and follow its
  setup. Mismatched surface → skip that one, try the next. Stale
  verifier (fails on mechanics unrelated to the change) → ask the
  user whether to patch it; don't FAIL the change for verifier rot.
- **\`run-*\` but no matching verifier** → use its build/launch
  primitives as your handle.
- **Neither** → cold start from README/package.json/Makefile. Timebox
  ~15min. Stuck → BLOCKED with exactly where, plus a filled-in
  \`/run-skill-generator\` prompt. Got through → mention
  \`/init-verifiers\` in your report so next time is faster.

## Drive it

Smallest path that makes the changed code execute:

- Changed a flag? Run with it.
- Changed a handler? Hit that route.
- Changed error handling? Trigger the error.
- Changed an internal function? Find the CLI command / request / render
  that reaches it. Run that.

**Read your plan back before running.** If every step is build /
typecheck / run test file — you've planned a CI rerun, not a
verification. Find a step that reaches the surface or report BLOCKED.

**The verdict is table stakes. Your observations are the signal.**
A PASS with three sharp "hey, I noticed…" lines is worth more than a
bare PASS. You're the only reviewer who actually *ran* the thing —
anything that made you pause, work around, or go "huh" is information
the author doesn't have. Don't filter for "is this a bug." Filter for
"would I mention this if they were sitting next to me."

**End-to-end, through the real interface.** Pieces passing in
isolation doesn't mean the flow works — seams are where bugs hide.
If users click buttons, test by clicking buttons, not by curling the
API underneath.

## Push on it

The claim checked out — that's the first half. Confirming is step
one, not the job. The PR description is what the author intended;
your value is what they didn't.

The diff told you exactly what's new. Probe *around* it, at the same
surface you just drove:

- **New flag / option** → empty value, passed twice, combined with a
  conflicting flag, typo'd (does the error name it?)
- **New handler / route** → wrong method, malformed body, missing
  required field, oversized payload
- **Changed error path** → the adjacent errors it didn't touch —
  did the refactor catch them too, or only the one in the diff?
- **Interactive / TUI** → Ctrl-C mid-op, resize the pane, paste
  garbage, rapid-fire the key, Esc at the wrong moment
- **State / persistence** → do it twice, do it with stale state
  underneath, do it in two sessions at once
- **Wander** → what's adjacent? What looked off while you were
  confirming? Go back to it.

These aren't a checklist — pick the ones the diff points at. Stop
when you've covered the obvious adjacents or hit something worth a
⚠️. A probe that finds nothing is still a step: "🔍 passed \`--from ''\`
→ clean \`error: --from requires a value\`, exit 2." That the author
didn't test it is exactly why it's worth knowing it holds.

Still not a test run. You're at the surface, typing what a user
would type wrong.

## Capture

Stdout, response bodies, screenshots, pane dumps. Captured output is
evidence; your memory isn't. Something unexpected? Don't route around
it — capture, note, decide if it's the change or the environment.
Unrelated breakage is a finding, not noise.

Shared process state (tmux, ports, lockfiles) — isolate. \`tmux -L
name\`, bind \`:0\`, \`mktemp -d\`. You share a namespace with your host.

## Report

Inline, final message:

\`\`\`
## Verification: <one-line what changed>

**Verdict:** PASS | FAIL | BLOCKED | SKIP

**Claim:** <what it's supposed to do — your read of the diff and/or
the stated claim; note any mismatch>

**Method:** <how you got a handle — which verifier/run-skill, or
cold start; what you launched>

### Steps

Each step is one thing you did to the **running app** and what it
showed. Build/install/checkout are setup, not steps. Test runs and
typecheck don't belong here — they're CI's output.

1. ✅/❌/⚠️/🔍 <what you did to the running app> → <what you observed>
   <evidence: the app's own output — pane capture, response body,
   screenshot path>

🔍 marks a probe — a step off the claim's happy path, trying to
break it. At least one. A Steps list that's all ✅ and no 🔍 is a
happy-path replay: still PASS, but you stopped at the first half.

**Screenshot / sample:** <the one frame a reviewer looks at to see
the feature — image path for GUI/TUI, code block for library/API;
omit for build/types-only>

### Findings
<Things you noticed. Not just bugs — friction, surprises, anything
a first-time user would trip on. "Took three tries to find the right
flag." "Error message on typo was unhelpful." "Default seems odd for
the common case." "Works, but slower than I expected." Lower the bar:
if it made you pause, it goes here. But the pause has to be yours,
from running the app — not from reading the PR page. A red CI check,
a review comment, someone else's bot: visible to anyone already, and
you relaying it isn't an observation. Claim/diff mismatch, pre-existing
breakage, and env notes also belong.

Each probe gets a line here even when it held — "🔍 empty \`--from\`
→ clean error" tells the author what *was* covered, which they
can't see from a bare PASS.

Lead with ⚠️ for lines worth interrupting the reviewer for — those get
hoisted above the PR comment fold. Plain bullets are context they'll
find if they expand. Empty is fine if nothing stuck out — but nothing
sticking out is itself rare.>
\`\`\`

**Verdicts:**
- **PASS** — you ran the app, the change did what it should at its
  surface. Not: tests pass, builds clean, code looks right.
- **FAIL** — you ran it and it doesn't. Or it breaks something else.
  Or claim and diff disagree materially.
- **BLOCKED** — couldn't reach a state where the change is observable.
  Build broke, env missing a dep, handle wouldn't come up. Not a
  verdict on the change. Say exactly where it stopped +
  \`/run-skill-generator\` prompt.
- **SKIP** — no runtime surface exists. Docs-only, types-only,
  tests-only. Nothing went wrong; there's just nothing here to run.
  One line why.

No partial pass. "3 of 4 passed" is FAIL until 4 passes or is
explained away.

**When in doubt, FAIL.** False PASS ships broken code; false FAIL
costs one more human look. Ambiguous output is FAIL with the raw
capture attached — don't interpret.
`
// @from(Ln 554653, Col 4)
a25 = () => {}
// @from(Ln 554654, Col 4)
t25
// @from(Ln 554654, Col 9)
e25
// @from(Ln 554655, Col 4)
q$5 = L(() => {
    n25();
    r25();
    a25();
    t25 = s25, e25 = {
        "examples/cli.md": i25,
        "examples/server.md": o25
    }
})
// @from(Ln 554665, Col 0)
function _$5() {
    return
}
// @from(Ln 554668, Col 4)
K$5
// @from(Ln 554668, Col 9)
GjA
// @from(Ln 554668, Col 14)
vjA
// @from(Ln 554669, Col 4)
z$5 = L(() => {
    Lf();
    k0();
    q$5();
    ({
        frontmatter: K$5,
        content: GjA
    } = p2(t25)), vjA = typeof K$5.description === "string" ? K$5.description : "Verify a code change does what it should by running the app."
})
// @from(Ln 554679, Col 0)
function Y$5() {
    MA({
        name: "simplify",
        description: "Review changed code for reuse, quality, and efficiency, then fix any issues found.",
        userInvocable: !0,
        async getPromptForCommand(q) {
            let K = TjA;
            if (q) K += `

## Additional Focus

${q}`;
            return [{
                type: "text",
                text: K
            }]
        }
    })
}
// @from(Ln 554698, Col 4)
TjA
// @from(Ln 554699, Col 4)
A$5 = L(() => {
    sY();
    k0();
    TjA = `# Simplify: Code Review and Cleanup

Review all changed files for reuse, quality, and efficiency. Fix any issues found.

## Phase 1: Identify Changes

Run \`git diff\` (or \`git diff HEAD\` if there are staged changes) to see what changed. If there are no git changes, review the most recently modified files that the user mentioned or that you edited earlier in this conversation.

## Phase 2: Launch Three Review Agents in Parallel

Use the ${T4} tool to launch all three agents concurrently in a single message. Pass each agent the full diff so it has the complete context.

### Agent 1: Code Reuse Review

For each change:

1. **Search for existing utilities and helpers** that could replace newly written code. Look for similar patterns elsewhere in the codebase — common locations are utility directories, shared modules, and files adjacent to the changed ones.
2. **Flag any new function that duplicates existing functionality.** Suggest the existing function to use instead.
3. **Flag any inline logic that could use an existing utility** — hand-rolled string manipulation, manual path handling, custom environment checks, ad-hoc type guards, and similar patterns are common candidates.

### Agent 2: Code Quality Review

Review the same changes for hacky patterns:

1. **Redundant state**: state that duplicates existing state, cached values that could be derived, observers/effects that could be direct calls
2. **Parameter sprawl**: adding new parameters to a function instead of generalizing or restructuring existing ones
3. **Copy-paste with slight variation**: near-duplicate code blocks that should be unified with a shared abstraction
4. **Leaky abstractions**: exposing internal details that should be encapsulated, or breaking existing abstraction boundaries
5. **Stringly-typed code**: using raw strings where constants, enums (string unions), or branded types already exist in the codebase
6. **Unnecessary JSX nesting**: wrapper Boxes/elements that add no layout value — check if inner component props (flexShrink, alignItems, etc.) already provide the needed behavior
7. **Unnecessary comments**: comments explaining WHAT the code does (well-named identifiers already do that), narrating the change, or referencing the task/caller — delete; keep only non-obvious WHY (hidden constraints, subtle invariants, workarounds)

### Agent 3: Efficiency Review

Review the same changes for efficiency:

1. **Unnecessary work**: redundant computations, repeated file reads, duplicate network/API calls, N+1 patterns
2. **Missed concurrency**: independent operations run sequentially when they could run in parallel
3. **Hot-path bloat**: new blocking work added to startup or per-request/per-render hot paths
4. **Recurring no-op updates**: state/store updates inside polling loops, intervals, or event handlers that fire unconditionally — add a change-detection guard so downstream consumers aren't notified when nothing changed. Also: if a wrapper function takes an updater/reducer callback, verify it honors same-reference returns (or whatever the "no change" signal is) — otherwise callers' early-return no-ops are silently defeated
5. **Unnecessary existence checks**: pre-checking file/resource existence before operating (TOCTOU anti-pattern) — operate directly and handle the error
6. **Memory**: unbounded data structures, missing cleanup, event listener leaks
7. **Overly broad operations**: reading entire files when only a portion is needed, loading all items when filtering for one

## Phase 3: Fix Issues

Wait for all three agents to complete. Aggregate their findings and fix each issue directly. If a finding is a false positive or not worth addressing, note it and move on — do not argue with the finding, just skip it.

When done, briefly summarize what was fixed (or confirm the code was already clean).
`
})
// @from(Ln 554754, Col 0)
function O$5() {
    return
}
// @from(Ln 554757, Col 4)
VjA = `# Skillify {{userDescriptionBlock}}

You are capturing this session's repeatable process as a reusable skill.

Review the conversation above — it is your source material. Pay particular attention to the user's messages (how they steered and corrected the process) and the tools/commands that were actually used.

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
- Ask where the skill should be saved. Suggest a default based on context (repo-specific workflows → repo, cross-repo personal workflows → user). Options:
  - **This repo** (\`.claude/skills/<name>/SKILL.md\`) — for workflows specific to this project
  - **Personal** (\`~/.claude/skills/<name>/SKILL.md\`) — follows you across all repos

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

Create the skill directory and file at the location the user chose in Round 2.

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
- \`allowed-tools\`: Minimum permissions needed (use patterns like \`Bash(gh *)\` not \`Bash\`)
- \`context\`: Only set \`context: fork\` for self-contained skills that don't need mid-process user input.
- \`when_to_use\` is CRITICAL -- tells the model when to auto-invoke. Start with "Use when..." and include trigger phrases. Example: "Use when the user wants to cherry-pick a PR to a release branch. Examples: 'cherry-pick to release', 'CP this PR', 'hotfix'."
- \`arguments\` and \`argument-hint\`: Only include if the skill takes parameters. Use \`$name\` in the body for substitution.

### Step 4: Confirm and Save

Before writing the file, output the complete SKILL.md content as a yaml code block in your response so the user can review it with proper syntax highlighting. Then ask for confirmation using AskUserQuestion with a simple question like "Does this SKILL.md look good to save?" — do NOT use the body field, keep the question concise.

After writing, tell the user:
- Where the skill was saved
- How to invoke it: \`/{{skill-name}} [arguments]\`
- That they can edit the SKILL.md directly to refine it
`
// @from(Ln 554882, Col 4)
w$5 = L(() => {
    k0()
})
// @from(Ln 554886, Col 0)
function $$5() {
    return
}
// @from(Ln 554889, Col 4)
kjA = "# /stuck — diagnose frozen/slow Claude Code sessions\n\nThe user thinks another Claude Code session on this machine is frozen, stuck, or very slow. Investigate and post a report to #claude-code-feedback.\n\n## What to look for\n\nScan for other Claude Code processes (excluding the current one — PID is in `process.pid` but for shell commands just exclude the PID you see running this prompt). Process names are typically `claude` (installed) or `cli` (native dev build).\n\nSigns of a stuck session:\n- **High CPU (≥90%) sustained** — likely an infinite loop. Sample twice, 1-2s apart, to confirm it's not a transient spike.\n- **Process state `D` (uninterruptible sleep)** — often an I/O hang. The `state` column in `ps` output; first character matters (ignore modifiers like `+`, `s`, `<`).\n- **Process state `T` (stopped)** — user probably hit Ctrl+Z by accident.\n- **Process state `Z` (zombie)** — parent isn't reaping.\n- **Very high RSS (≥4GB)** — possible memory leak making the session sluggish.\n- **Stuck child process** — a hung `git`, `node`, or shell subprocess can freeze the parent. Check `pgrep -lP <pid>` for each session.\n\n## Investigation steps\n\n1. **List all Claude Code processes** (macOS/Linux):\n   ```\n   ps -axo pid=,pcpu=,rss=,etime=,state=,comm=,command= | grep -E '(claude|cli)' | grep -v grep\n   ```\n   Filter to rows where `comm` is `claude` or (`cli` AND the command path contains \"claude\").\n\n2. **For anything suspicious**, gather more context:\n   - Child processes: `pgrep -lP <pid>`\n   - If high CPU: sample again after 1-2s to confirm it's sustained\n   - If a child looks hung (e.g., a git command), note its full command line with `ps -p <child_pid> -o command=`\n   - Check the session's debug log if you can infer the session ID: `~/.claude/debug/<session-id>.txt` (the last few hundred lines often show what it was doing before hanging)\n\n3. **Consider a stack dump** for a truly frozen process (advanced, optional):\n   - macOS: `sample <pid> 3` gives a 3-second native stack sample\n   - This is big — only grab it if the process is clearly hung and you want to know *why*\n\n## Report\n\n**Only post to Slack if you actually found something stuck.** If every session looks healthy, tell the user that directly — do not post an all-clear to the channel.\n\nIf you did find a stuck/slow session, post to **#claude-code-feedback** (channel ID: `C07VBSHV7EV`) using the Slack MCP tool. Use ToolSearch to find `slack_send_message` if it's not already loaded.\n\n**Use a two-message structure** to keep the channel scannable:\n\n1. **Top-level message** — one short line: hostname, Claude Code version, and a terse symptom (e.g. \"session PID 12345 pegged at 100% CPU for 10min\" or \"git subprocess hung in D state\"). No code blocks, no details.\n2. **Thread reply** — the full diagnostic dump. Pass the top-level message's `ts` as `thread_ts`. Include:\n   - PID, CPU%, RSS, state, uptime, command line, child processes\n   - Your diagnosis of what's likely wrong\n   - Relevant debug log tail or `sample` output if you captured it\n\nIf Slack MCP isn't available, format the report as a message the user can copy-paste into #claude-code-feedback (and let them know to thread the details themselves).\n\n## Notes\n- Don't kill or signal any processes — this is diagnostic only.\n- If the user gave an argument (e.g., a specific PID or symptom), focus there first.\n"
// @from(Ln 554890, Col 4)
j$5 = L(() => {
    k0()
})
// @from(Ln 554894, Col 0)
function NjA() {
    let q = zr(CW(), {
        io: "input"
    });
    return I6(q, null, 2)
}
// @from(Ln 554901, Col 0)
function X$5() {
    MA({
        name: "update-config",
        description: 'Use this skill to configure the Claude Code harness via settings.json. Automated behaviors ("from now on when X", "each time X", "whenever X", "before/after X") require hooks configured in settings.json - the harness executes these, not Claude, so memory/preferences cannot fulfill them. Also use for: permissions ("allow X", "add permission", "move permission to"), env vars ("set X=Y"), hook troubleshooting, or any changes to settings.json/settings.local.json files. Examples: "allow npm commands", "add bq permission to global settings", "move permission to user settings", "set DEBUG=true", "when claude stops show X". For simple settings like theme/model, use Config tool.',
        allowedTools: ["Read"],
        userInvocable: !0,
        async getPromptForCommand(q) {
            if (q.startsWith("[hooks-only]")) {
                let z = q.slice(12).trim(),
                    Y = H$5 + `

` + J$5;
                if (z) Y += `

## Task

${z}`;
                return [{
                    type: "text",
                    text: Y
                }]
            }
            let K = NjA(),
                _ = yjA;
            if (_ += `

## Full Settings JSON Schema

\`\`\`json
${K}
\`\`\``, q) _ += `

## User Request

${q}`;
            return [{
                type: "text",
                text: _
            }]
        }
    })
}
// @from(Ln 554943, Col 4)
EjA = `## Settings File Locations

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
    "allow": ["Bash(npm *)", "Edit(.claude)", "Read"],
    "deny": ["Bash(rm -rf *)"],
    "ask": ["Write(/etc/*)"],
    "defaultMode": "default" | "plan" | "acceptEdits" | "dontAsk",
    "additionalDirectories": ["/extra/dir"]
  }
}
\`\`\`

**Permission Rule Syntax:**
- Exact match: \`"Bash(npm run test)"\`
- Prefix wildcard: \`"Bash(git *)"\` - matches \`git\`, \`git status\`, \`git commit\`, etc.
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
- \`cleanupPeriodDays\`: Days to keep transcripts before automatic cleanup (default: 30; minimum 1)
- \`respectGitignore\`: Whether to respect .gitignore (default: true)
- \`spinnerTipsEnabled\`: Show tips in spinner
- \`spinnerVerbs\`: Customize spinner verbs (\`{ "mode": "append" | "replace", "verbs": [...] }\`)
- \`spinnerTipsOverride\`: Override spinner tips (\`{ "excludeDefault": true, "tips": ["Custom tip"] }\`)
- \`syntaxHighlightingDisabled\`: Disable diff highlighting
`
// @from(Ln 555033, Col 4)
H$5 = `## Hooks Configuration

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
| PostCompact | "manual"/"auto" | After compaction (receives summary) |
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
        "command": "jq -r '.tool_response.filePath // .tool_input.file_path' | { read -r f; prettier --write \\"$f\\"; } 2>/dev/null || true"
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