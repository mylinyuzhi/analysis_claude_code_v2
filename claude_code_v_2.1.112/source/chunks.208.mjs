
// @from(Ln 544854, Col 0)
async function bt8(q) {
    let K = X_6();
    if (Object.keys(K).length === 0) return {
        installed: [],
        updated: [],
        failed: [],
        upToDate: [],
        skipped: []
    };
    let _;
    try {
        _ = await Dz()
    } catch (H) {
        j6(H), _ = {}
    }
    let z = YW7(K, _, {
            projectRoot: Y7()
        }),
        Y = [...z.missing.map((H) => ({
            name: H,
            source: xA5(K[H].source),
            action: "install"
        })), ...z.sourceChanged.map(({
            name: H,
            declaredSource: J
        }) => ({
            name: H,
            source: J,
            action: "update"
        }))],
        A = [],
        O = [];
    for (let H of Y) {
        if (q?.skip?.(H.name, H.source)) {
            A.push(H.name);
            continue
        }
        if (H.action === "update" && Wh(H.source) && !await a3(H.source.path)) {
            E(`[reconcile] '${H.name}' declared path does not exist; keeping materialized entry`), A.push(H.name);
            continue
        }
        O.push(H)
    }
    if (O.length === 0) return {
        installed: [],
        updated: [],
        failed: [],
        upToDate: z.upToDate,
        skipped: A
    };
    E(`[reconcile] ${O.length} marketplace(s): ${O.map((H)=>`${H.name}(${H.action})`).join(", ")}`);
    let w = [],
        $ = [],
        j = [];
    for (let H = 0; H < O.length; H++) {
        let {
            name: J,
            source: X,
            action: M
        } = O[H];
        q?.onProgress?.({
            type: "installing",
            name: J,
            action: M,
            index: H + 1,
            total: O.length
        });
        try {
            let P = await M_6(X);
            if (M === "install") w.push(J);
            else $.push(J);
            q?.onProgress?.({
                type: "installed",
                name: J,
                alreadyMaterialized: P.alreadyMaterialized
            })
        } catch (P) {
            let W = b6(P);
            j.push({
                name: J,
                error: W
            }), q?.onProgress?.({
                type: "failed",
                name: J,
                error: W
            }), j6(P)
        }
    }
    return {
        installed: w,
        updated: $,
        failed: j,
        upToDate: z.upToDate,
        skipped: A
    }
}
// @from(Ln 544951, Col 0)
function xA5(q, K) {
    if ((q.source === "directory" || q.source === "file") && !nOA(q.path)) {
        let _ = K ?? Y7(),
            z = zj(_);
        return {
            ...q,
            path: iOA(z ?? _, q.path)
        }
    }
    return q
}
// @from(Ln 544962, Col 4)
AW7 = L(() => {
    JU();
    y8();
    K8();
    m8();
    eK();
    pK();
    U8();
    m$();
    Hv()
})
// @from(Ln 544974, Col 0)
function OW7(q, K, _, z) {
    q((Y) => ({
        ...Y,
        plugins: {
            ...Y.plugins,
            installationStatus: {
                ...Y.plugins.installationStatus,
                marketplaces: Y.plugins.installationStatus.marketplaces.map((A) => A.name === K ? {
                    ...A,
                    status: _,
                    error: z
                } : A)
            }
        }
    }))
}
// @from(Ln 544990, Col 0)
async function uA5(q) {
    E("performBackgroundPluginInstallations called");
    try {
        let K = X_6(),
            _ = await Dz().catch(() => ({})),
            z = YW7(K, _),
            Y = [...z.missing, ...z.sourceChanged.map((w) => w.name)];
        if (q((w) => ({
                ...w,
                plugins: {
                    ...w.plugins,
                    installationStatus: {
                        marketplaces: Y.map(($) => ({
                            name: $,
                            status: "pending"
                        })),
                        plugins: []
                    }
                }
            })), Y.length === 0) return;
        E(`Installing ${Y.length} marketplace(s) in background`);
        let A = await bt8({
                onProgress: (w) => {
                    switch (w.type) {
                        case "installing":
                            OW7(q, w.name, "installing");
                            break;
                        case "installed":
                            OW7(q, w.name, "installed");
                            break;
                        case "failed":
                            OW7(q, w.name, "failed", w.error);
                            break
                    }
                }
            }),
            O = {
                installed_count: A.installed.length,
                updated_count: A.updated.length,
                failed_count: A.failed.length,
                up_to_date_count: A.upToDate.length
            };
        if (d("tengu_marketplace_background_install", O), j1("info", "tengu_marketplace_background_install", O), A.installed.length > 0) {
            J_6(), E(`Auto-refreshing plugins after ${A.installed.length} new marketplace(s) installed`);
            try {
                await PW6(q)
            } catch (w) {
                j6(w), E(`Auto-refresh failed, falling back to needsRefresh: ${w}`, {
                    level: "warn"
                }), bk("performBackgroundPluginInstallations: auto-refresh failed"), q(($) => {
                    if ($.plugins.needsRefresh) return $;
                    return {
                        ...$,
                        plugins: {
                            ...$.plugins,
                            needsRefresh: !0
                        }
                    }
                })
            }
        } else if (A.updated.length > 0) J_6(), bk("performBackgroundPluginInstallations: marketplaces reconciled"), q((w) => {
            if (w.plugins.needsRefresh) return w;
            return {
                ...w,
                plugins: {
                    ...w.plugins,
                    needsRefresh: !0
                }
            }
        })
    } catch (K) {
        j6(K)
    }
}
// @from(Ln 545064, Col 4)
mA5 = L(() => {
    K8();
    VA();
    U8();
    m$();
    vH();
    AW7();
    Vo8();
    C8()
})
// @from(Ln 545074, Col 0)
async function BA5(q) {
    if (E("performStartupChecks called"), !EA()) {
        E("Trust not accepted for current directory - skipping plugin installations");
        return
    }
    try {
        if (E("Starting background plugin installations"), await yc8()) J_6(), bk("performStartupChecks: seed marketplaces changed"), q((_) => {
            if (_.plugins.needsRefresh) return _;
            return {
                ..._,
                plugins: {
                    ..._.plugins,
                    needsRefresh: !0
                }
            }
        });
        await uA5(q)
    } catch (K) {
        E(`Error initiating background plugin installations: ${K}`)
    }
}
// @from(Ln 545095, Col 4)
pA5 = L(() => {
    mA5();
    h1();
    K8();
    m$();
    vH()
})
// @from(Ln 545103, Col 0)
function FA5() {
    let q = s(11),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = wD.getInstance().getStatus(), q[0] = K;
    else K = q[0];
    let [_, z] = eS.useState(K), Y, A;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) Y = () => {
        return wD.getInstance().subscribe(z)
    }, A = [], q[1] = Y, q[2] = A;
    else Y = q[1], A = q[2];
    if (eS.useEffect(Y, A), !_.isAuthenticating && !_.error && _.output.length === 0) return null;
    if (!_.isAuthenticating && !_.error) return null;
    let O;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) O = eS.default.createElement(T, {
        bold: !0,
        color: "permission"
    }, "Cloud Authentication"), q[3] = O;
    else O = q[3];
    let w;
    if (q[4] !== _.output) w = _.output.length > 0 && eS.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, _.output.slice(-5).map(oOA)), q[4] = _.output, q[5] = w;
    else w = q[5];
    let $;
    if (q[6] !== _.error) $ = _.error && eS.default.createElement(u, {
        marginTop: 1
    }, eS.default.createElement(T, {
        color: "error"
    }, _.error)), q[6] = _.error, q[7] = $;
    else $ = q[7];
    let j;
    if (q[8] !== w || q[9] !== $) j = eS.default.createElement(u, {
        flexDirection: "column",
        borderStyle: "round",
        borderColor: "permission",
        paddingX: 1,
        marginY: 1
    }, O, w, $), q[8] = w, q[9] = $, q[10] = j;
    else j = q[10];
    return j
}
// @from(Ln 545146, Col 0)
function oOA(q, K) {
    let _ = q.match(rOA);
    if (!_) return eS.default.createElement(T, {
        key: K,
        dimColor: !0
    }, q);
    let z = _[0],
        Y = _.index ?? 0,
        A = q.slice(0, Y),
        O = q.slice(Y + z.length);
    return eS.default.createElement(T, {
        key: K,
        dimColor: !0
    }, A, eS.default.createElement(yq, {
        url: z
    }, z), O)
}
// @from(Ln 545163, Col 4)
eS
// @from(Ln 545163, Col 8)
rOA
// @from(Ln 545164, Col 4)
gA5 = L(() => {
    o6();
    g6();
    uZ8();
    eS = K6(P6(), 1), rOA = /https?:\/\/\S+/
})
// @from(Ln 545171, Col 0)
function UA5(q) {
    let K = s(22),
        {
            addNotification: _
        } = EK(),
        z = h96(),
        Y = M8(aOA),
        A;
    if (K[0] !== z || K[1] !== q) A = uF1(z, q), K[0] = z, K[1] = q, K[2] = A;
    else A = K[2];
    let O = A,
        w;
    if (K[3] !== z || K[4] !== Y || K[5] !== q) w = hM4(z, q, Y), K[3] = z, K[4] = Y, K[5] = q, K[6] = w;
    else w = K[6];
    let $ = w,
        j;
    if (K[7] !== z) j = mF1(z), K[7] = z, K[8] = j;
    else j = K[8];
    let H = j,
        J = $06.useRef(null),
        X;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) X = MK(), K[9] = X;
    else X = K[9];
    let M = X,
        P;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) P = Ib(), K[10] = P;
    else P = K[10];
    let W = P,
        D = M === "team" || M === "enterprise",
        [Z, G] = $06.useState(!1),
        f, v;
    if (K[11] !== _ || K[12] !== z.isUsingOverage || K[13] !== Z || K[14] !== H) f = () => {
        if (nK()) return;
        if (z.isUsingOverage && !Z && (!D || W)) _({
            key: "limit-reached",
            text: H,
            priority: "immediate"
        }), G(!0);
        else if (!z.isUsingOverage && Z) G(!1)
    }, v = [z.isUsingOverage, H, Z, _, W, D], K[11] = _, K[12] = z.isUsingOverage, K[13] = Z, K[14] = H, K[15] = f, K[16] = v;
    else f = K[15], v = K[16];
    $06.useEffect(f, v);
    let V, k;
    if (K[17] !== _ || K[18] !== $ || K[19] !== O) V = () => {
        if (nK()) return;
        if (O && O !== J.current) {
            if (J.current = O, _({
                    key: "rate-limit-warning",
                    jsx: w06.createElement(T, null, w06.createElement(T, {
                        color: "warning"
                    }, O), $ && w06.createElement(T, {
                        dimColor: !0
                    }, " · ", $.text)),
                    priority: "high"
                }), $) d("tengu_rate_limit_lever_hint", {
                lever: $.lever
            })
        }
    }, k = [O, $, _], K[17] = _, K[18] = $, K[19] = O, K[20] = V, K[21] = k;
    else V = K[20], k = K[21];
    $06.useEffect(V, k)
}
// @from(Ln 545234, Col 0)
function aOA(q) {
    return q.effortValue
}
// @from(Ln 545237, Col 4)
w06
// @from(Ln 545237, Col 9)
$06
// @from(Ln 545238, Col 4)
QA5 = L(() => {
    o6();
    kY();
    g6();
    C8();
    dI();
    hK8();
    Jy6();
    N7();
    T7();
    HQ();
    y8();
    w06 = K6(P6(), 1), $06 = K6(P6(), 1)
})
// @from(Ln 545253, Col 0)
function tOA(q) {
    let K = q.toLowerCase(),
        _ = pq();
    for (let [z, Y] of Object.entries(sOA)) {
        let A = Y.retirementDates[_];
        if (!K.includes(z) || !A) continue;
        return {
            isDeprecated: !0,
            modelName: Y.modelName,
            retirementDate: A
        }
    }
    return {
        isDeprecated: !1
    }
}
// @from(Ln 545270, Col 0)
function It8(q) {
    if (!q) return null;
    let K = tOA(q);
    if (!K.isDeprecated) return null;
    let _ = new Date(K.retirementDate),
        Y = !Number.isNaN(_.getTime()) && _ < new Date ? "was retired on" : "will be retired on";
    return `⚠ ${K.modelName} ${Y} ${K.retirementDate}. Consider switching to a newer model.`
}
// @from(Ln 545278, Col 4)
sOA
// @from(Ln 545279, Col 4)
wW7 = L(() => {
    x9();
    sOA = {
        "claude-3-opus": {
            modelName: "Claude 3 Opus",
            retirementDates: {
                firstParty: "January 5, 2026",
                bedrock: "January 15, 2026",
                vertex: "January 5, 2026",
                foundry: "January 5, 2026",
                anthropicAws: null,
                mantle: null
            }
        },
        "claude-3-7-sonnet": {
            modelName: "Claude 3.7 Sonnet",
            retirementDates: {
                firstParty: "February 19, 2026",
                bedrock: "April 28, 2026",
                vertex: "May 11, 2026",
                foundry: "February 19, 2026",
                anthropicAws: null,
                mantle: null
            }
        },
        "claude-3-5-haiku": {
            modelName: "Claude 3.5 Haiku",
            retirementDates: {
                firstParty: "February 19, 2026",
                bedrock: null,
                vertex: null,
                foundry: null,
                anthropicAws: null,
                mantle: null
            }
        }
    }
})
// @from(Ln 545318, Col 0)
function dA5(q) {
    let K = s(4),
        {
            addNotification: _
        } = EK(),
        z = xt8.useRef(null),
        Y, A;
    if (K[0] !== _ || K[1] !== q) Y = () => {
        if (nK()) return;
        let O = It8(q);
        if (O && O !== z.current) z.current = O, _({
            key: "model-deprecation-warning",
            text: O,
            color: "warning",
            priority: "high"
        });
        if (!O) z.current = null
    }, A = [q, _], K[0] = _, K[1] = q, K[2] = Y, K[3] = A;
    else Y = K[2], A = K[3];
    xt8.useEffect(Y, A)
}
// @from(Ln 545339, Col 4)
xt8
// @from(Ln 545340, Col 4)
cA5 = L(() => {
    o6();
    kY();
    wW7();
    y8();
    xt8 = K6(P6(), 1)
})
// @from(Ln 545348, Col 0)
function lA5() {
    pu(qwA)
}
// @from(Ln 545351, Col 0)
async function qwA() {
    if (v$() || S6(process.env.DISABLE_INSTALLATION_CHECKS)) return null;
    if (await Rt() === "development") return null;
    return {
        timeoutMs: 15000,
        key: "npm-deprecation-warning",
        text: eOA,
        color: "warning",
        priority: "high"
    }
}
// @from(Ln 545362, Col 4)
eOA = "Claude Code has switched from npm to native installer. Run `claude install` or see https://docs.anthropic.com/en/docs/claude-code/getting-started for more options."
// @from(Ln 545363, Col 4)
nA5 = L(() => {
    n36();
    Q8();
    A06()
})
// @from(Ln 545369, Col 0)
function rA5() {
    let q = s(5),
        {
            addNotification: K,
            removeNotification: _
        } = EK(),
        z = M8(KwA),
        Y, A;
    if (q[0] !== K || q[1] !== _ || q[2] !== z) Y = () => {}, A = [z, K, _], q[0] = K, q[1] = _, q[2] = z, q[3] = Y, q[4] = A;
    else Y = q[3], A = q[4];
    iA5.useEffect(Y, A)
}
// @from(Ln 545382, Col 0)
function KwA(q) {
    return q.skillTruncationStats
}
// @from(Ln 545385, Col 4)
iA5
// @from(Ln 545386, Col 4)
oA5 = L(() => {
    o6();
    y8();
    kY();
    N7();
    iA5 = K6(P6(), 1)
})
// @from(Ln 545394, Col 0)
function sA5() {
    let q = s(4),
        K = R7(),
        _ = M8(YwA),
        z, Y;
    if (q[0] !== _ || q[1] !== K) z = () => {
        return
    }, Y = [_, K], q[0] = _, q[1] = K, q[2] = z, q[3] = Y;
    else z = q[2], Y = q[3];
    aA5.useEffect(z, Y)
}
// @from(Ln 545406, Col 0)
function _wA(q) {
    return q.name
}
// @from(Ln 545410, Col 0)
function zwA(q) {
    return u56(q) === "name-only"
}
// @from(Ln 545414, Col 0)
function YwA(q) {
    return q.mainLoopModel
}
// @from(Ln 545417, Col 4)
aA5
// @from(Ln 545418, Col 4)
tA5 = L(() => {
    o6();
    JU();
    y8();
    CA();
    N7();
    Xh6();
    AJ();
    U8();
    aA5 = K6(P6(), 1)
})
// @from(Ln 545430, Col 0)
function eA5(q) {
    let K = s(26),
        {
            ideSelection: _,
            mcpClients: z,
            ideInstallationStatus: Y
        } = q,
        {
            addNotification: A,
            removeNotification: O
        } = EK(),
        {
            status: w,
            ideName: $
        } = Wm6(z),
        j = tn.useRef(!1),
        H;
    if (K[0] !== Y) H = Y ? Up(Y?.ideType) : !1, K[0] = Y, K[1] = H;
    else H = K[1];
    let J = H,
        X = Y?.error || J,
        M = w === "connected" && (_?.filePath || _?.text && _.lineCount > 0),
        P = w === "connected" && !M,
        W = X && !J && !P && !M,
        D = X && J && !P && !M,
        Z, G;
    if (K[2] !== A || K[3] !== w || K[4] !== O || K[5] !== D) Z = () => {
        if (nK()) return;
        if (q0() || w !== null || D) {
            O("ide-status-hint");
            return
        }
        if (j.current || (H8().ideHintShownCount ?? 0) >= AwA) return;
        let h = setTimeout(OwA, 3000, j, A);
        return () => clearTimeout(h)
    }, G = [A, O, w, D], K[2] = A, K[3] = w, K[4] = O, K[5] = D, K[6] = Z, K[7] = G;
    else Z = K[6], G = K[7];
    tn.useEffect(Z, G);
    let f, v;
    if (K[8] !== A || K[9] !== $ || K[10] !== w || K[11] !== O || K[12] !== W || K[13] !== D) f = () => {
        if (nK()) return;
        if (W || D || w !== "disconnected" || !$) {
            O("ide-status-disconnected");
            return
        }
        A({
            key: "ide-status-disconnected",
            text: `${$} disconnected`,
            color: "error",
            priority: "medium"
        })
    }, v = [A, O, w, $, W, D], K[8] = A, K[9] = $, K[10] = w, K[11] = O, K[12] = W, K[13] = D, K[14] = f, K[15] = v;
    else f = K[14], v = K[15];
    tn.useEffect(f, v);
    let V, k;
    if (K[16] !== A || K[17] !== O || K[18] !== D) V = () => {
        if (nK()) return;
        if (!D) {
            O("ide-status-jetbrains-disconnected");
            return
        }
        A({
            key: "ide-status-jetbrains-disconnected",
            text: "IDE plugin not connected · /status for info",
            priority: "medium"
        })
    }, k = [A, O, D], K[16] = A, K[17] = O, K[18] = D, K[19] = V, K[20] = k;
    else V = K[19], k = K[20];
    tn.useEffect(V, k);
    let N, R;
    if (K[21] !== A || K[22] !== O || K[23] !== W) N = () => {
        if (nK()) return;
        if (!W) {
            O("ide-status-install-error");
            return
        }
        A({
            key: "ide-status-install-error",
            text: "IDE extension install failed (see /status for info)",
            color: "error",
            priority: "medium"
        })
    }, R = [A, O, W], K[21] = A, K[22] = O, K[23] = W, K[24] = N, K[25] = R;
    else N = K[24], R = K[25];
    tn.useEffect(N, R)
}
// @from(Ln 545517, Col 0)
function OwA(q, K) {
    Vh6(!0).then((_) => {
        let z = _[0]?.name;
        if (z && !q.current) q.current = !0, d8(wwA), K({
            key: "ide-status-hint",
            jsx: tn.default.createElement(T, {
                dimColor: !0
            }, "/ide for ", tn.default.createElement(T, {
                color: "ide"
            }, z)),
            priority: "low"
        })
    })
}
// @from(Ln 545532, Col 0)
function wwA(q) {
    return {
        ...q,
        ideHintShownCount: (q.ideHintShownCount ?? 0) + 1
    }
}
// @from(Ln 545538, Col 4)
tn
// @from(Ln 545538, Col 8)
AwA = 5
// @from(Ln 545539, Col 4)
qO5 = L(() => {
    o6();
    kY();
    g6();
    h1();
    kj();
    y8();
    Ms8();
    tn = K6(P6(), 1)
})
// @from(Ln 545550, Col 0)
function _O5() {
    pu(jwA)
}
// @from(Ln 545554, Col 0)
function jwA() {
    let q = H8(),
        K = [];
    for (let _ of $wA) {
        let z = _(q);
        if (z) K.push(z)
    }
    return K.length > 0 ? K : null
}
// @from(Ln 545564, Col 0)
function KO5(q) {
    return q !== void 0 && Date.now() - q < 3000
}
// @from(Ln 545567, Col 4)
$wA
// @from(Ln 545568, Col 4)
zO5 = L(() => {
    h1();
    A06();
    $wA = [(q) => {
        if (!KO5(q.sonnet45To46MigrationTimestamp)) return;
        return {
            key: "sonnet-46-update",
            text: "Model updated to Sonnet 4.6",
            color: "suggestion",
            priority: "high",
            timeoutMs: 3000
        }
    }, (q) => {
        let K = Boolean(q.legacyOpusMigrationTimestamp),
            _ = q.legacyOpusMigrationTimestamp ?? q.opusProMigrationTimestamp;
        if (!KO5(_)) return;
        return {
            key: "opus-pro-update",
            text: K ? "Model updated to Opus 4.7 · Set CLAUDE_CODE_DISABLE_LEGACY_MODEL_REMAP=1 to opt out" : "Model updated to Opus 4.7",
            color: "suggestion",
            priority: "high",
            timeoutMs: K ? 8000 : 3000
        }
    }]
})
// @from(Ln 545594, Col 0)
function YO5() {
    pu(JwA)
}
// @from(Ln 545597, Col 0)
async function JwA() {
    if ((H8().subscriptionNoticeCount ?? 0) >= HwA) return null;
    let q = await MwA();
    if (q === null) return null;
    return d8(XwA), d("tengu_switch_to_subscription_notice_shown", {}), {
        key: "switch-to-subscription",
        jsx: UY8.createElement(T, {
            color: "suggestion"
        }, "Use your existing Claude ", q, " plan with Claude Code", UY8.createElement(T, {
            color: "text",
            dimColor: !0
        }, " ", "· /login to activate")),
        priority: "low"
    }
}
// @from(Ln 545613, Col 0)
function XwA(q) {
    return {
        ...q,
        subscriptionNoticeCount: (q.subscriptionNoticeCount ?? 0) + 1
    }
}
// @from(Ln 545619, Col 0)
async function MwA() {
    if (i7()) return null;
    let q = await fMq();
    if (!q) return null;
    if (q.account.has_claude_max) return "Max";
    if (q.account.has_claude_pro) return "Pro";
    return null
}
// @from(Ln 545627, Col 4)
UY8
// @from(Ln 545627, Col 9)
HwA = 3
// @from(Ln 545628, Col 4)
AO5 = L(() => {
    WT6();
    T7();
    g6();
    C8();
    h1();
    A06();
    UY8 = K6(P6(), 1)
})
// @from(Ln 545638, Col 0)
function OO5(q) {
    if (!("text" in q)) return 1;
    let K = q.text.match(/^(\d+)/);
    return K?.[1] ? parseInt(K[1], 10) : 1
}
// @from(Ln 545644, Col 0)
function PwA(q, K) {
    return wO5(OO5(q) + 1)
}
// @from(Ln 545648, Col 0)
function wO5(q) {
    return {
        key: "teammate-spawn",
        text: q === 1 ? "1 agent spawned" : `${q} agents spawned`,
        priority: "low",
        timeoutMs: 5000,
        fold: PwA
    }
}
// @from(Ln 545658, Col 0)
function WwA(q, K) {
    return $O5(OO5(q) + 1)
}
// @from(Ln 545662, Col 0)
function $O5(q) {
    return {
        key: "teammate-shutdown",
        text: q === 1 ? "1 agent shut down" : `${q} agents shut down`,
        priority: "low",
        timeoutMs: 5000,
        fold: WwA
    }
}
// @from(Ln 545672, Col 0)
function jO5() {
    let q = M8((Y) => Y.tasks),
        {
            addNotification: K
        } = EK(),
        _ = QY8.useRef(new Set),
        z = QY8.useRef(new Set);
    QY8.useEffect(() => {
        if (nK()) return;
        for (let [Y, A] of Object.entries(q)) {
            if (!EJ(A)) continue;
            if (A.status === "running" && !_.current.has(Y)) _.current.add(Y), K(wO5(1));
            if (A.status === "completed" && !z.current.has(Y)) z.current.add(Y), K($O5(1))
        }
    }, [q, K])
}
// @from(Ln 545688, Col 4)
QY8
// @from(Ln 545689, Col 4)
HO5 = L(() => {
    y8();
    kY();
    N7();
    QY8 = K6(P6(), 1)
})
// @from(Ln 545696, Col 0)
function PO5() {
    let q = s(13),
        {
            addNotification: K
        } = EK(),
        _ = M8(GwA),
        z = R7(),
        Y, A;
    if (q[0] !== K || q[1] !== _ || q[2] !== z) Y = () => {
        if (nK()) return;
        if (!q5()) return;
        return bZq((H) => {
            if (H) K({
                key: MO5,
                color: "fastMode",
                priority: "immediate",
                text: "Fast mode is now available · /fast to turn on"
            });
            else if (_) z(fwA), K({
                key: MO5,
                color: "warning",
                priority: "immediate",
                text: "Fast mode has been disabled by your organization"
            })
        })
    }, A = [K, _, z], q[0] = K, q[1] = _, q[2] = z, q[3] = Y, q[4] = A;
    else Y = q[3], A = q[4];
    ut8.useEffect(Y, A);
    let O, w;
    if (q[5] !== K || q[6] !== z) O = () => {
        if (nK()) return;
        if (!q5()) return;
        return SZq((H) => {
            z(ZwA), K({
                key: DwA,
                color: "warning",
                priority: "immediate",
                text: H
            })
        })
    }, w = [K, z], q[5] = K, q[6] = z, q[7] = O, q[8] = w;
    else O = q[7], w = q[8];
    ut8.useEffect(O, w);
    let $, j;
    if (q[9] !== K || q[10] !== _) $ = () => {
        if (nK()) return;
        if (!_) return;
        let H = EZq((X, M) => {
                let P = C5(X - Date.now(), {
                        hideTrailingZeros: !0
                    }),
                    W = vwA(M, P);
                K({
                    key: JO5,
                    invalidates: [XO5],
                    text: W,
                    color: "warning",
                    priority: "immediate"
                })
            }),
            J = yZq(() => {
                K({
                    key: XO5,
                    invalidates: [JO5],
                    color: "fastMode",
                    text: "Fast limit reset · now using fast mode",
                    priority: "immediate"
                })
            });
        return () => {
            H(), J()
        }
    }, j = [K, _], q[9] = K, q[10] = _, q[11] = $, q[12] = j;
    else $ = q[11], j = q[12];
    ut8.useEffect($, j)
}
// @from(Ln 545773, Col 0)
function ZwA(q) {
    return {
        ...q,
        fastMode: !1
    }
}
// @from(Ln 545780, Col 0)
function fwA(q) {
    return {
        ...q,
        fastMode: !1
    }
}
// @from(Ln 545787, Col 0)
function GwA(q) {
    return q.fastMode
}
// @from(Ln 545791, Col 0)
function vwA(q, K) {
    switch (q) {
        case "overloaded":
            return `Fast mode overloaded and is temporarily unavailable · resets in ${K}`;
        case "rate_limit":
            return `Fast limit reached and temporarily disabled · resets in ${K}`
    }
}
// @from(Ln 545799, Col 4)
ut8
// @from(Ln 545799, Col 9)
JO5 = "fast-mode-cooldown-started"
// @from(Ln 545800, Col 4)
XO5 = "fast-mode-cooldown-expired"
// @from(Ln 545801, Col 4)
MO5 = "fast-mode-org-changed"
// @from(Ln 545802, Col 4)
DwA = "fast-mode-overage-rejected"
// @from(Ln 545803, Col 4)
WO5 = L(() => {
    o6();
    kY();
    N7();
    zf();
    c7();
    y8();
    ut8 = K6(P6(), 1)
})
// @from(Ln 545813, Col 0)
function DO5(q) {
    let K = s(8),
        {
            onRun: _,
            onCancel: z,
            reason: Y
        } = q,
        A = mt8.useRef(!1),
        O;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) O = {
        context: "Confirmation"
    }, K[0] = O;
    else O = K[0];
    G1("confirm:no", z, O);
    let w, $;
    if (K[1] !== _) w = () => {
        if (!A.current) A.current = !0, _()
    }, $ = [_], K[1] = _, K[2] = w, K[3] = $;
    else w = K[2], $ = K[3];
    mt8.useEffect(w, $);
    let j;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) j = pG.createElement(u, null, pG.createElement(T, {
        bold: !0
    }, "Running feedback capture...")), K[4] = j;
    else j = K[4];
    let H;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) H = pG.createElement(u, null, pG.createElement(T, {
        dimColor: !0
    }, "Press ", pG.createElement(A8, {
        chord: "escape",
        action: "cancel"
    }), " anytime")), K[5] = H;
    else H = K[5];
    let J;
    if (K[6] !== Y) J = pG.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, j, H, pG.createElement(u, null, pG.createElement(T, {
        dimColor: !0
    }, "Reason: ", Y))), K[6] = Y, K[7] = J;
    else J = K[7];
    return J
}
// @from(Ln 545857, Col 0)
function ZO5(q) {
    return !1;
    switch (q) {
        case "feedback_survey_bad":
            return !1;
        case "feedback_survey_good":
            return !1;
        default:
            return !1
    }
}
// @from(Ln 545869, Col 0)
function fO5(q) {
    return "/issue"
}
// @from(Ln 545873, Col 0)
function GO5(q) {
    switch (q) {
        case "feedback_survey_bad":
            return 'You responded "Bad" to the feedback survey';
        case "feedback_survey_good":
            return 'You responded "Good" to the feedback survey';
        default:
            return "Unknown reason"
    }
}
// @from(Ln 545883, Col 4)
pG
// @from(Ln 545883, Col 8)
mt8
// @from(Ln 545884, Col 4)
vO5 = L(() => {
    o6();
    u7();
    g6();
    C7();
    pG = K6(P6(), 1), mt8 = K6(P6(), 1)
})
// @from(Ln 545892, Col 0)
function TO5() {
    return null
}
// @from(Ln 545896, Col 0)
function kwA(q) {
    for (let K of q) {
        if (K.type !== "assistant") continue;
        let _ = K.message.content;
        if (!Array.isArray(_)) continue;
        for (let z of _) {
            if (z.type !== "tool_use" || !("name" in z)) continue;
            let Y = z.name;
            if (Y.startsWith("mcp__")) return !1;
            if (Y === S7) {
                let O = z.input?.command || "";
                if (TwA.some((w) => w.test(O))) return !1
            }
        }
    }
    return !0
}
// @from(Ln 545914, Col 0)
function NwA(q) {
    for (let K = q.length - 1; K >= 0; K--) {
        let _ = q[K];
        if (_.type !== "user") continue;
        let z = it(_);
        if (!z) continue;
        return VwA.some((Y) => Y.test(z))
    }
    return !1
}
// @from(Ln 545925, Col 0)
function VO5(q, K) {
    return !1
}
// @from(Ln 545928, Col 4)
dY8
// @from(Ln 545928, Col 9)
TwA
// @from(Ln 545928, Col 14)
VwA
// @from(Ln 545928, Col 19)
EwA = 3
// @from(Ln 545929, Col 4)
ywA = 1800000
// @from(Ln 545930, Col 4)
kO5 = L(() => {
    _7();
    dY8 = K6(P6(), 1), TwA = [/\bcurl\b/, /\bwget\b/, /\bssh\b/, /\bkubectl\b/, /\bsrun\b/, /\bdocker\b/, /\bbq\b/, /\bgsutil\b/, /\bgcloud\b/, /\baws\b/, /\bgit\s+push\b/, /\bgit\s+pull\b/, /\bgit\s+fetch\b/, /\bgh\s+(pr|issue)\b/, /\bnc\b/, /\bncat\b/, /\btelnet\b/, /\bftp\b/], VwA = [/^no[,!]\s/i, /\bthat'?s (wrong|incorrect|not (what|right|correct))\b/i, /\bnot what I (asked|wanted|meant|said)\b/i, /\bI (said|asked|wanted|told you|already said)\b/i, /\bwhy did you\b/i, /\byou should(n'?t| not)? have\b/i, /\byou were supposed to\b/i, /\btry again\b/i, /\b(undo|revert) (that|this|it|what you)\b/i]
})
// @from(Ln 545934, Col 4)
LwA
// @from(Ln 545934, Col 9)
hwA
// @from(Ln 545935, Col 4)
NO5 = L(() => {
    o6();
    y8();
    g6();
    LwA = K6(P6(), 1), hwA = K6(P6(), 1)
})
// @from(Ln 545942, Col 0)
function $W7(q) {
    let K = s(7),
        {
            children: _,
            mouseTracking: z
        } = q,
        Y = z === void 0 ? !0 : z,
        A = j06.useContext(C46),
        O = j06.useContext(I46),
        w, $;
    if (K[0] !== Y || K[1] !== O) w = () => {
        let J = KO.get(process.stdout);
        if (!O) return;
        return O(oa6 + "\x1B[2J\x1B[H" + (Y ? S$6 : "")), J?.setAltScreenActive(!0, Y), () => {
            J?.setAltScreenActive(!1), J?.clearTextSelection(), O((Y ? da : "") + bN6)
        }
    }, $ = [O, Y], K[0] = Y, K[1] = O, K[2] = w, K[3] = $;
    else w = K[2], $ = K[3];
    j06.useInsertionEffect(w, $);
    let j = A?.rows ?? 24,
        H;
    if (K[4] !== _ || K[5] !== j) H = j06.default.createElement(JH, {
        flexDirection: "column",
        height: j,
        width: "100%",
        flexShrink: 0
    }, _), K[4] = _, K[5] = j, K[6] = H;
    else H = K[6];
    return H
}
// @from(Ln 545972, Col 4)
j06
// @from(Ln 545973, Col 4)
EO5 = L(() => {
    o6();
    Yk();
    R46();
    Gd();
    na();
    qs6();
    j06 = K6(P6(), 1)
})
// @from(Ln 545983, Col 0)
function yO5(q, K, _) {
    let z = Sm6.useRef(!1),
        Y = Sm6.useRef(_);
    Y.current = _, Sm6.useEffect(() => {
        if (!K) return;
        return q.subscribe(() => {
            let O = q.getState(),
                w = q.hasSelection();
            if (O?.isDragging) {
                z.current = !1;
                return
            }
            if (!w) {
                z.current = !1;
                return
            }
            if (z.current) return;
            if (!(H8().copyOnSelect ?? !0)) return;
            let j = q.copySelectionNoClear();
            if (!j || !j.trim()) {
                z.current = !0;
                return
            }
            z.current = !0, Y.current?.(j)
        })
    }, [K, q])
}
// @from(Ln 546011, Col 0)
function LO5(q) {
    let [K] = Zq();
    Sm6.useEffect(() => {
        q.setSelectionBgColor(DD(K).selectionBg)
    }, [q, K])
}
// @from(Ln 546017, Col 4)
Sm6
// @from(Ln 546018, Col 4)
hO5 = L(() => {
    jN6();
    h1();
    tB();
    Sm6 = K6(P6(), 1)
})
// @from(Ln 546025, Col 0)
function QwA(q) {
    if (q.wheelUp || q.wheelDown) return !1;
    if (q.pageUp || q.pageDown) return !1;
    if ((q.home || q.end) && q.ctrl) return !1;
    if ((q.leftArrow || q.rightArrow || q.upArrow || q.downArrow || q.home || q.end) && (q.shift || q.meta || q.super)) return !1;
    return !0
}
// @from(Ln 546033, Col 0)
function dwA(q, K) {
    if (K.upArrow || K.downArrow || K.home || K.end) return !0;
    if (q.length !== 1) return !1;
    if (K.ctrl) return "udbfnp".includes(q);
    return "jkgGb ".includes(q)
}
// @from(Ln 546040, Col 0)
function CO5(q, K, _) {
    if (!q.xtermJs) {
        if (q.wheelMode && _ - q.time > mwA) q.wheelMode = !1, q.burstCount = 0, q.mult = q.base;
        if (q.pendingFlip) {
            if (q.pendingFlip = !1, K !== q.dir || _ - q.time > bwA) return q.dir = K, q.time = _, q.mult = q.base, Math.floor(q.mult);
            q.wheelMode = !0
        }
        let w = _ - q.time;
        if (K !== q.dir && q.dir !== 0) return q.pendingFlip = !0, q.time = _, 0;
        if (q.dir = K, q.time = _, q.wheelMode)
            if (w < SO5)
                if (++q.burstCount >= 5) q.wheelMode = !1, q.burstCount = 0, q.mult = q.base;
                else return 1;
        else q.burstCount = 0;
        if (q.wheelMode) {
            let $ = Math.pow(0.5, w / RO5),
                j = Math.max(xwA, q.base * 2),
                H = 1 + (q.mult - 1) * $ + IwA * $;
            return q.mult = Math.min(j, H, q.mult + uwA), Math.floor(q.mult)
        }
        if (w > RwA) q.mult = q.base;
        else {
            let $ = Math.max(CwA, q.base * 2);
            q.mult = Math.min($, q.mult + SwA)
        }
        return Math.floor(q.mult)
    }
    let z = _ - q.time,
        Y = K === q.dir;
    if (q.time = _, q.dir = K, Y && z < SO5) return 1;
    if (!Y || z > UwA) q.mult = 2, q.frac = 0;
    else {
        let w = Math.pow(0.5, z / RO5),
            $ = z >= pwA ? FwA : gwA;
        q.mult = Math.min($, 1 + (q.mult - 1) * w + BwA * w)
    }
    let A = q.mult + q.frac,
        O = Math.floor(A);
    return q.frac = A - O, O
}
// @from(Ln 546081, Col 0)
function cwA() {
    let q = process.platform === "win32" || process.env.WT_SESSION ? 3 : 1,
        K = process.env.CLAUDE_CODE_SCROLL_SPEED;
    if (!K) return q;
    let _ = parseFloat(K);
    return Number.isNaN(_) || _ <= 0 ? q : Math.min(_, 20)
}
// @from(Ln 546089, Col 0)
function lwA(q = !1, K = 1) {
    return {
        time: 0,
        mult: K,
        dir: 0,
        xtermJs: q,
        frac: 0,
        base: K,
        pendingFlip: !1,
        wheelMode: !1,
        burstCount: 0
    }
}
// @from(Ln 546103, Col 0)
function bO5() {
    let q = ca(),
        K = cwA();
    return E(`wheel accel: ${q?"decay (xterm.js)":"window (native)"} · base=${K} · TERM_PROGRAM=${process.env.TERM_PROGRAM??"unset"}`), lwA(q, K)
}
// @from(Ln 546109, Col 0)
function jW7({
    scrollRef: q,
    isActive: K,
    onScroll: _,
    isModal: z = !1
}) {
    let Y = aN6(),
        {
            addNotification: A
        } = EK(),
        O = p66.useRef(null);

    function w(M) {
        let P = e44(),
            W = M.length,
            D;
        switch (P) {
            case "native":
                D = `copied ${W} chars to clipboard`;
                break;
            case "tmux-buffer":
                D = `copied ${W} chars to tmux buffer · paste with prefix + ]`;
                break;
            case "osc52":
                D = `sent ${W} chars via OSC 52 · check terminal clipboard settings if paste fails`;
                break
        }
        A({
            key: "selection-copied",
            text: D,
            color: "suggestion",
            priority: "immediate",
            timeoutMs: P === "native" ? 2000 : 4000
        })
    }

    function $() {
        let M = Y.copySelection();
        if (M) w(M)
    }

    function j(M, P) {
        let W = Y.getState();
        if (!W?.anchor || !W.focus) return;
        let D = M.getViewportTop(),
            Z = D + M.getViewportHeight() - 1;
        if (W.anchor.row < D || W.anchor.row > Z) return;
        if (W.focus.row < D || W.focus.row > Z) return;
        let G = Math.max(0, M.getScrollHeight() - M.getViewportHeight()),
            f = M.getScrollTop() + M.getPendingDelta(),
            v = Math.max(0, Math.min(G, f + P)) - f;
        if (v === 0) return;
        if (v > 0) Y.captureScrolledRows(D, D + v - 1, "above"), Y.shiftSelection(-v, D, Z);
        else {
            let V = -v;
            Y.captureScrolledRows(Z - V + 1, Z, "below"), Y.shiftSelection(V, D, Z)
        }
    }
    L7({
        "scroll:pageUp": () => {
            let M = q.current;
            if (!M) return;
            let P = -Math.max(1, Math.floor(M.getViewportHeight() / 2));
            j(M, P);
            let W = cY8(M, P);
            _?.(W, M)
        },
        "scroll:pageDown": () => {
            let M = q.current;
            if (!M) return;
            let P = Math.max(1, Math.floor(M.getViewportHeight() / 2));
            j(M, P);
            let W = cY8(M, P);
            _?.(W, M)
        },
        "scroll:lineUp": () => {
            Y.clearSelection();
            let M = q.current;
            if (!M || M.getScrollHeight() <= M.getViewportHeight()) return !1;
            O.current ??= bO5(), swA(M, CO5(O.current, -1, performance.now())), _?.(!1, M)
        },
        "scroll:lineDown": () => {
            Y.clearSelection();
            let M = q.current;
            if (!M || M.getScrollHeight() <= M.getViewportHeight()) return !1;
            O.current ??= bO5();
            let P = CO5(O.current, 1, performance.now()),
                W = awA(M, P);
            _?.(W, M)
        },
        "scroll:top": () => {
            let M = q.current;
            if (!M) return;
            j(M, -(M.getScrollTop() + M.getPendingDelta())), M.scrollTo(0), _?.(!1, M)
        },
        "scroll:bottom": () => {
            let M = q.current;
            if (!M) return;
            let P = Math.max(0, M.getScrollHeight() - M.getViewportHeight());
            j(M, P - (M.getScrollTop() + M.getPendingDelta())), M.scrollTo(P), M.scrollToBottom(), _?.(!0, M)
        },
        "selection:copy": $
    }, {
        context: "Scroll",
        isActive: K
    });

    function H(M) {
        let P = q.current;
        if (!P) return;
        let W = ewA(P, M, (D) => j(P, D));
        if (W === null) return;
        _?.(W, P)
    }

    function J(M, P) {
        let W = twA(M, P);
        if (!W) return !1;
        for (let D = 0; D < M.length; D++) H(W);
        return !0
    }
    L7({
        "scroll:halfPageUp": () => H("halfPageUp"),
        "scroll:halfPageDown": () => H("halfPageDown"),
        "scroll:fullPageUp": () => H("fullPageUp"),
        "scroll:fullPageDown": () => H("fullPageDown")
    }, {
        context: "Scroll",
        isActive: K
    }), L7({
        "scroll:lineUp": () => H("lineUp"),
        "scroll:lineDown": () => H("lineDown"),
        "scroll:halfPageUp": () => H("halfPageUp"),
        "scroll:halfPageDown": () => H("halfPageDown"),
        "scroll:fullPageUp": () => H("fullPageUp"),
        "scroll:fullPageDown": () => H("fullPageDown"),
        "scroll:top": () => H("top"),
        "scroll:bottom": () => H("bottom")
    }, {
        context: "Transcript",
        isActive: K && z
    });

    function X(M) {
        if (!Y.hasSelection()) return !1;
        Y.moveFocus(M)
    }
    return L7({
        "selection:extendLeft": () => X("left"),
        "selection:extendRight": () => X("right"),
        "selection:extendUp": () => X("up"),
        "selection:extendDown": () => X("down"),
        "selection:extendLineStart": () => X("lineStart"),
        "selection:extendLineEnd": () => X("lineEnd")
    }, {
        context: "Scroll",
        isActive: K
    }), XR((M, P, W) => {
        if (z && J(M, P)) {
            W.stopImmediatePropagation();
            return
        }
        if (!Y.hasSelection()) return;
        if (P.escape) {
            Y.clearSelection(), W.stopImmediatePropagation();
            return
        }
        if (P.ctrl && !P.shift && !P.meta && M === "c") {
            $(), W.stopImmediatePropagation();
            return
        }
        if (z && dwA(M, P)) return;
        if (QwA(P)) Y.clearSelection()
    }, {
        isActive: K
    }), rwA(q, Y, K, _), yO5(Y, K, w), LO5(Y), null
}
// @from(Ln 546287, Col 0)
function rwA(q, K, _, z) {
    let Y = p66.useRef(null),
        A = p66.useRef(0),
        O = p66.useRef(0),
        w = p66.useRef(0),
        $ = p66.useRef(z);
    $.current = z, p66.useEffect(() => {
        if (!_) return;

        function j() {
            if (A.current = 0, Y.current) clearInterval(Y.current), Y.current = null
        }

        function H() {
            let P = K.getState(),
                W = q.current,
                D = A.current;
            if (!P?.isDragging || !P.focus || !W || D === 0 || ++w.current > iwA) {
                j();
                return
            }
            if (W.getPendingDelta() !== 0) return;
            let Z = W.getViewportTop(),
                G = Z + W.getViewportHeight() - 1;
            if (D < 0) {
                if (W.getScrollTop() <= 0) {
                    j();
                    return
                }
                let f = Math.min(Bt8, W.getScrollTop());
                K.captureScrolledRows(G - f + 1, G, "below"), K.shiftAnchor(f, 0, G), W.scrollBy(-Bt8)
            } else {
                let f = Math.max(0, W.getScrollHeight() - W.getViewportHeight());
                if (W.getScrollTop() >= f) {
                    j();
                    return
                }
                let v = Math.min(Bt8, f - W.getScrollTop());
                K.captureScrolledRows(Z, Z + v - 1, "above"), K.shiftAnchor(-v, Z, G), W.scrollBy(Bt8)
            }
            $.current?.(!1, W)
        }

        function J(P) {
            if (O.current = P, A.current === P) return;
            if (j(), A.current = P, w.current = 0, H(), A.current === P) Y.current = setInterval(H, nwA)
        }

        function X() {
            let P = q.current;
            if (!P) {
                j();
                return
            }
            let W = P.getViewportTop(),
                D = W + P.getViewportHeight() - 1,
                Z = K.getState();
            if (!Z?.isDragging || Z.scrolledOffAbove.length === 0 && Z.scrolledOffBelow.length === 0) O.current = 0;
            let G = owA(Z, W, D, O.current);
            if (G === 0) {
                if (O.current !== 0 && Z?.focus) {
                    let f = Z.focus.row < W ? -1 : Z.focus.row > D ? 1 : 0;
                    if (f !== 0 && f !== O.current) Z.scrolledOffAbove = [], Z.scrolledOffBelow = [], Z.scrolledOffAboveSW = [], Z.scrolledOffBelowSW = [], O.current = 0
                }
                j()
            } else J(G)
        }
        let M = K.subscribe(X);
        return () => {
            M(), j(), O.current = 0
        }
    }, [_, q, K])
}
// @from(Ln 546361, Col 0)
function owA(q, K, _, z = 0) {
    if (!q?.isDragging || !q.anchor || !q.focus) return 0;
    let Y = q.focus.row,
        A = Y < K ? -1 : Y > _ ? 1 : 0;
    if (z !== 0) return A === z ? A : 0;
    if (q.anchor.row < K || q.anchor.row > _) return 0;
    return A
}
// @from(Ln 546370, Col 0)
function cY8(q, K) {
    let _ = Math.max(0, q.getScrollHeight() - q.getViewportHeight()),
        z = q.getScrollTop() + q.getPendingDelta() + K;
    if (z >= _) return q.scrollTo(_), q.scrollToBottom(), !0;
    return q.scrollTo(Math.max(0, z)), !1
}
// @from(Ln 546377, Col 0)
function awA(q, K) {
    let _ = Math.max(0, q.getScrollHeight() - q.getViewportHeight());
    if (q.getScrollTop() + q.getPendingDelta() + K >= _) return q.scrollToBottom(), !0;
    return q.scrollBy(K), !1
}
// @from(Ln 546383, Col 0)
function swA(q, K) {
    if (q.getScrollTop() + q.getPendingDelta() - K <= 0) {
        q.scrollTo(0);
        return
    }
    q.scrollBy(-K)
}
// @from(Ln 546391, Col 0)
function twA(q, K) {
    if (q.length < 2) return null;
    let _ = q[0];
    if (!_ || q !== _.repeat(q.length)) return null;
    if (K.ctrl || K.meta) return null;
    if (_ === "G" || _ === "g" && K.shift) return "bottom";
    if (K.shift) return null;
    switch (_) {
        case "g":
            return "top";
        case "j":
            return "lineDown";
        case "k":
            return "lineUp";
        case " ":
            return "fullPageDown";
        case "b":
            return "fullPageUp";
        default:
            return null
    }
}
// @from(Ln 546414, Col 0)
function ewA(q, K, _) {
    switch (K) {
        case null:
            return null;
        case "lineUp":
        case "lineDown": {
            let z = K === "lineDown" ? 1 : -1;
            return _(z), cY8(q, z)
        }
        case "halfPageUp":
        case "halfPageDown": {
            let z = Math.max(1, Math.floor(q.getViewportHeight() / 2)),
                Y = K === "halfPageDown" ? z : -z;
            return _(Y), cY8(q, Y)
        }
        case "fullPageUp":
        case "fullPageDown": {
            let z = Math.max(1, q.getViewportHeight()),
                Y = K === "fullPageDown" ? z : -z;
            return _(Y), cY8(q, Y)
        }
        case "top":
            return _(-(q.getScrollTop() + q.getPendingDelta())), q.scrollTo(0), !1;
        case "bottom": {
            let z = Math.max(0, q.getScrollHeight() - q.getViewportHeight());
            return _(z - (q.getScrollTop() + q.getPendingDelta())), q.scrollTo(z), q.scrollToBottom(), !0
        }
    }
}
// @from(Ln 546443, Col 4)
p66
// @from(Ln 546443, Col 9)
RwA = 40
// @from(Ln 546444, Col 4)
SwA = 0.3
// @from(Ln 546445, Col 4)
CwA = 6
// @from(Ln 546446, Col 4)
bwA = 200
// @from(Ln 546447, Col 4)
IwA = 15
// @from(Ln 546448, Col 4)
xwA = 15
// @from(Ln 546449, Col 4)
uwA = 3
// @from(Ln 546450, Col 4)
mwA = 1500
// @from(Ln 546451, Col 4)
RO5 = 150
// @from(Ln 546452, Col 4)
BwA = 5
// @from(Ln 546453, Col 4)
SO5 = 5
// @from(Ln 546454, Col 4)
pwA = 80
// @from(Ln 546455, Col 4)
FwA = 3
// @from(Ln 546456, Col 4)
gwA = 6
// @from(Ln 546457, Col 4)
UwA = 500
// @from(Ln 546458, Col 4)
Bt8 = 2
// @from(Ln 546459, Col 4)
nwA = 50
// @from(Ln 546460, Col 4)
iwA = 200
// @from(Ln 546461, Col 4)
IO5 = L(() => {
    kY();
    hO5();
    BE8();
    la();
    HX();
    g6();
    C7();
    K8();
    p66 = K6(P6(), 1)
})
// @from(Ln 546473, Col 0)
function H06(q) {
    return (K, _) => {
        q((z) => {
            if (_ === void 0) {
                if (!(K in z.replContexts)) return z;
                let {
                    [K]: Y, ...A
                } = z.replContexts;
                return {
                    ...z,
                    replContexts: A
                }
            }
            if (z.replContexts[K] === _) return z;
            return {
                ...z,
                replContexts: {
                    ...z.replContexts,
                    [K]: _
                }
            }
        })
    }
}
// @from(Ln 546497, Col 4)
HW7 = {}
// @from(Ln 546503, Col 0)
function Y2A(q, K) {
    if ((q.key === "return" ? "enter" : q.key.toLowerCase()) !== K.key) return !1;
    if (q.ctrl !== K.ctrl) return !1;
    if (q.shift !== K.shift) return !1;
    if (q.meta !== (K.alt || K.meta)) return !1;
    if (q.superKey !== K.super) return !1;
    return !0
}
// @from(Ln 546512, Col 0)
function O2A({
    setInputValueRaw: q,
    inputValueRef: K,
    insertTextRef: _
}) {
    let {
        addNotification: z
    } = EK(), Y = PW.useRef(null), A = PW.useRef(""), O = PW.useRef(null), w = PW.useCallback((Z, {
        char: G = " ",
        anchor: f = !1,
        floor: v = 0
    } = {}) => {
        let V = K.current,
            k = _.current?.cursorOffset ?? V.length,
            N = V.slice(0, k),
            R = V.slice(k),
            h = G === " " ? VA6(N) : N,
            C = 0;
        while (C < h.length && h[h.length - 1 - C] === G) C++;
        let x = Math.max(0, Math.min(C - v, Z)),
            B = C - x,
            m = N.slice(0, N.length - x),
            S = "";
        if (f) {
            if (Y.current = m, A.current = R, R.length > 0 && !/^\s/.test(R)) S = " "
        }
        let F = m + S + R;
        if (f) O.current = F;
        if (F === V && x === 0) return B;
        if (_.current) _.current.setInputWithCursor(F, m.length);
        else q(F);
        return B
    }, [q, K, _]), $ = PW.useCallback(() => {
        let Z = Y.current;
        if (Z === null) return;
        let G = A.current;
        Y.current = null, A.current = "";
        let f = Z + G;
        if (_.current) _.current.setInputWithCursor(f, Z.length);
        else q(f)
    }, [q, _]), j = FW6(), H = !1, J = "hold", X = oE((Z) => Z.voiceState), M = oE((Z) => Z.voiceInterimTranscript);
    PW.useEffect(() => {
        if (X === "recording" && Y.current === null) {
            let Z = K.current,
                G = _.current?.cursorOffset ?? Z.length;
            Y.current = Z.slice(0, G), A.current = Z.slice(G), O.current = Z
        }
        if (X === "idle") Y.current = null, A.current = "", O.current = null
    }, [X, K, _]), PW.useEffect(() => {
        if (Y.current === null) return;
        let Z = Y.current,
            G = A.current;
        if (K.current !== O.current) return;
        let f = Z.length > 0 && !/\s$/.test(Z) && M.length > 0,
            v = G.length > 0 && !/^\s/.test(G),
            V = f ? " " : "",
            k = v ? " " : "",
            N = Z + V + M + k + G,
            R = Z.length + V.length + M.length;
        if (_.current) _.current.setInputWithCursor(N, R);
        else q(N);
        O.current = N
    }, [M, q, K, _]);
    let P = PW.useCallback((Z) => {
            let G = Y.current;
            if (G === null) return;
            let f = A.current;
            if (K.current !== O.current) return;
            let v = G.length > 0 && !/\s$/.test(G) && Z.length > 0,
                V = f.length > 0 && !/^\s/.test(f) && Z.length > 0,
                k = v ? " " : "",
                N = V ? " " : "",
                R = G + k + Z + N + f,
                h = G.length + k.length + Z.length;
            if (_.current) _.current.setInputWithCursor(R, h);
            else q(R);
            O.current = R, Y.current = G + k + Z
        }, [q, K, _, !1, "hold"]),
        W = q2A.useVoice({
            onTranscript: P,
            onError: (Z) => {
                z({
                    key: "voice-error",
                    text: Z,
                    color: "error",
                    priority: "immediate",
                    timeoutMs: 1e4
                })
            },
            enabled: j,
            focusMode: !1,
            mode: "hold"
        }),
        D = PW.useMemo(() => {
            if (Y.current === null) return null;
            if (M.length === 0) return null;
            let Z = Y.current,
                G = Z.length > 0 && !/\s$/.test(Z) && M.length > 0,
                f = Z.length + (G ? 1 : 0),
                v = f + M.length;
            return {
                start: f,
                end: v
            }
        }, [M]);
    return {
        stripTrailing: w,
        resetAnchor: $,
        handleKeyEvent: W.handleKeyEvent,
        cancelRecording: W.cancelRecording,
        interimRange: D
    }
}
// @from(Ln 546626, Col 0)
function w2A({
    voiceHandleKeyEvent: q,
    voiceCancelRecording: K,
    stripTrailing: _,
    resetAnchor: z,
    isActive: Y,
    inputValueRef: A
}) {
    let O = cu1(),
        w = js6(),
        $ = lv(),
        j = o46(),
        H = FW6(),
        J = oE((V) => V.voiceState),
        X = "hold",
        M = PW.useMemo(() => {
            if (!$) return A2A;
            let V = null;
            for (let k of $.bindings) {
                if (k.context !== "Chat") continue;
                if (k.chord.length !== 1) continue;
                let N = k.chord[0];
                if (!N) continue;
                if (k.action === "voice:pushToTalk") V = N;
                else if (V !== null && eE8(N, V)) V = null
            }
            return V
        }, [$]),
        P = M !== null && M.key.length === 1 && !M.ctrl && !M.alt && !M.shift && !M.meta && !M.super ? M.key : null,
        W = PW.useRef(0),
        D = PW.useRef(0),
        Z = PW.useRef(0),
        G = PW.useRef(!1),
        f = PW.useRef(null);
    return PW.useEffect(() => {
        if (J !== "recording") G.current = !1, Z.current = 0, w((V) => {
            if (!V.voiceWarmingUp) return V;
            return {
                ...V,
                voiceWarmingUp: !1
            }
        })
    }, [J, w]), {
        handleKeyDown: (V) => {
            if (!H) return;
            if (!Y || j) return;
            if (M === null) return;
            let k;
            if (P !== null) {
                if (V.ctrl || V.meta || V.shift) return;
                let h = P === " " ? VA6(V.key) : V.key;
                if (h[0] !== P) return;
                if (h.length > 1 && h !== P.repeat(h.length)) return;
                k = h.length
            } else {
                if (!Y2A(V, M)) return;
                k = 1
            }
            let N = O().voiceState;
            if (G.current && N !== "idle") {
                if (V.stopImmediatePropagation(), P !== null) _(k, {
                    char: P,
                    floor: Z.current
                });
                q();
                return
            }
            if (N === "recording") {
                if (P === null) V.stopImmediatePropagation();
                return
            }
            if (N === "processing" && P === null) {
                V.stopImmediatePropagation();
                return
            }
            let R = W.current;
            if (W.current += k, P === null || N === "idle" && W.current >= z2A) {
                if (V.stopImmediatePropagation(), f.current) clearTimeout(f.current), f.current = null;
                if (W.current = 0, G.current = !0, w((h) => {
                        if (!h.voiceWarmingUp) return h;
                        return {
                            ...h,
                            voiceWarmingUp: !1
                        }
                    }), P !== null) Z.current = _(D.current + k, {
                    char: P,
                    anchor: !0
                }), D.current = 0, q();
                else _(0, {
                    anchor: !0
                }), q(_2A);
                if (O().voiceState === "idle") G.current = !1, z();
                return
            }
            if (R >= xO5) V.stopImmediatePropagation(), _(k, {
                char: P,
                floor: D.current
            });
            else D.current += k;
            if (N === "idle" && W.current >= xO5) w((h) => {
                if (h.voiceWarmingUp) return h;
                return {
                    ...h,
                    voiceWarmingUp: !0
                }
            });
            if (f.current) clearTimeout(f.current);
            f.current = setTimeout((h, C, x, B) => {
                h.current = null, C.current = 0, x.current = 0, B((m) => {
                    if (!m.voiceWarmingUp) return m;
                    return {
                        ...m,
                        voiceWarmingUp: !1
                    }
                })
            }, K2A, f, W, D, w)
        }
    }
}
// @from(Ln 546745, Col 4)
PW
// @from(Ln 546745, Col 8)
q2A
// @from(Ln 546745, Col 13)
K2A = 120
// @from(Ln 546746, Col 4)
_2A = 2000
// @from(Ln 546747, Col 4)
z2A = 5
// @from(Ln 546748, Col 4)
xO5 = 2
// @from(Ln 546749, Col 4)
A2A
// @from(Ln 546750, Col 4)
JW7 = L(() => {
    kY();
    CP();
    B$6();
    jp();
    fs6();
    N7();
    Ps8();
    PW = K6(P6(), 1), q2A = (AH7(), B7(CtK));
    A2A = {
        key: " ",
        ctrl: !1,
        alt: !1,
        shift: !1,
        meta: !1,
        super: !1
    }
})
// @from(Ln 546779, Col 0)
function nY8(q) {
    return BO5(q ?? c9(), J2A)
}
// @from(Ln 546782, Col 0)
async function pO5(q) {
    let K;
    try {
        K = await j2A(nY8(q), "utf8")
    } catch {
        return
    }
    let _ = X2A().safeParse(k5(K, !1));
    return _.success ? _.data : void 0
}
// @from(Ln 546792, Col 0)
async function uO5(q, K) {
    let _ = nY8(K),
        z = I6(q);
    try {
        return await MW7(_, z, {
            flag: "wx"
        }), !0
    } catch (Y) {
        let A = Q1(Y);
        if (A === "EEXIST") return !1;
        if (A === "ENOENT") {
            await $2A(H2A(_), {
                recursive: !0
            });
            try {
                return await MW7(_, z, {
                    flag: "wx"
                }), !0
            } catch (O) {
                if (Q1(O) === "EEXIST") return !1;
                throw O
            }
        }
        throw Y
    }
}
// @from(Ln 546819, Col 0)
function XW7(q) {
    pt8?.(), pt8 = eq(async () => {
        await iY8(q)
    })
}
// @from(Ln 546824, Col 0)
async function PW7(q) {
    let K = q?.dir,
        _ = q?.lockIdentity ?? I8(),
        z = {
            sessionId: _,
            pid: process.pid,
            acquiredAt: Date.now()
        };
    if (await uO5(z, K)) return lY8 = void 0, XW7(q), E(`[ScheduledTasks] acquired scheduler lock (PID ${process.pid})`), !0;
    let Y = await pO5(K);
    if (Y?.sessionId === _) {
        if (Y.pid !== process.pid) await MW7(nY8(K), I6(z)), XW7(q);
        return !0
    }
    if (Y && mT6(Y.pid)) {
        if (lY8 !== Y.sessionId) lY8 = Y.sessionId, E(`[ScheduledTasks] scheduler lock held by session ${Y.sessionId} (PID ${Y.pid})`);
        return !1
    }
    if (Y) E(`[ScheduledTasks] recovering stale scheduler lock from PID ${Y.pid}`);
    if (await mO5(nY8(K)).catch(() => {}), await uO5(z, K)) return lY8 = void 0, XW7(q), !0;
    return !1
}
// @from(Ln 546846, Col 0)
async function iY8(q) {
    pt8?.(), pt8 = void 0, lY8 = void 0;
    let K = q?.dir,
        _ = q?.lockIdentity ?? I8(),
        z = await pO5(K);
    if (!z || z.sessionId !== _) return;
    try {
        await mO5(nY8(K)), E("[ScheduledTasks] released scheduler lock")
    } catch {}
}
// @from(Ln 546856, Col 4)
J2A
// @from(Ln 546856, Col 9)
X2A
// @from(Ln 546856, Col 14)
pt8
// @from(Ln 546856, Col 19)
lY8
// @from(Ln 546857, Col 4)
FO5 = L(() => {
    p7();
    y8();
    R9();
    K8();
    m8();
    Ow6();
    mO();
    e8();
    J2A = BO5(".claude", "scheduled_tasks.lock"), X2A = C6(() => y.object({
        sessionId: y.string(),
        pid: y.number(),
        acquiredAt: y.number()
    }))
})
// @from(Ln 546872, Col 4)
dO5 = {}
// @from(Ln 546879, Col 0)
function UO5(q, K, _) {
    if (_ === 0) return !1;
    return Boolean(q.recurring && !q.permanent && K - q.createdAt >= _)
}
// @from(Ln 546884, Col 0)
function WW7(q) {
    let {
        onFire: K,
        isLoading: _,
        assistantMode: z = !1,
        onFireTask: Y,
        onMissed: A,
        dir: O,
        lockIdentity: w,
        getJitterConfig: $,
        isKilled: j,
        filter: H,
        getExtraTasks: J
    } = q, X = O || w ? {
        dir: O,
        lockIdentity: w
    } : void 0, M = [], P = [], W = new Map, D = new Set, Z = new Set, G = null, f = null, v = null, V = null, k = !1, N = !1;
    async function R(x) {
        let B = await Qy6(O),
            m = J ? await J().catch((U) => {
                return E(`[ScheduledTasks] getExtraTasks failed: ${U}`), []
            }) : [];
        if (k) return;
        if (M = B, P = m, !x) return;
        let S = Date.now(),
            F = Z04(B, S).filter((U) => !U.recurring && !D.has(U.id) && (!H || H(U)));
        if (F.length > 0) {
            for (let U of F) D.add(U.id), W.set(U.id, 1 / 0);
            if (d("tengu_scheduled_task_missed", {
                    count: F.length,
                    taskIds: F.map((U) => U.id).join(",")
                }), A) A(F);
            else K(QO5(F));
            hs(F.map((U) => U.id), O).catch((U) => E(`[ScheduledTasks] failed to remove missed tasks: ${U}`)), E(`[ScheduledTasks] surfaced ${F.length} missed one-shot task(s)`)
        }
    }

    function h() {
        if (j?.()) return;
        if (_() && !z) return;
        let x = Date.now(),
            B = new Set,
            m = [],
            S = $?.() ?? Ep;

        function F(U, g) {
            if (H && !H(U)) return;
            if (B.add(U.id), Z.has(U.id)) return;
            let c = W.get(U.id);
            if (c === void 0) c = U.recurring ? DU1(U.cron, U.lastFiredAt ?? U.createdAt, U.id, S) ?? 1 / 0 : QR8(U.cron, U.createdAt, U.id, S) ?? 1 / 0, W.set(U.id, c), E(`[ScheduledTasks] scheduled ${U.id} for ${c===1/0?"never":new Date(c).toISOString()}`);
            if (x < c) return;
            if (E(`[ScheduledTasks] firing ${U.id}${U.recurring?" (recurring)":""}`), d("tengu_scheduled_task_fire", {
                    recurring: U.recurring ?? !1,
                    taskId: U.id,
                    autonomousLoopDefault: P2A.isLoopDefaultSentinel(U.prompt)
                }), Y) Y(U);
            else K(U.prompt);
            let n = UO5(U, x, S.recurringMaxAgeMs);
            if (n) {
                let l = Math.floor((x - U.createdAt) / 1000 / 60 / 60);
                E(`[ScheduledTasks] recurring task ${U.id} aged out (${l}h since creation), deleting after final fire`), d("tengu_scheduled_task_expired", {
                    taskId: U.id,
                    ageHours: l
                })
            }
            if (U.recurring && !n) {
                let l = DU1(U.cron, x, U.id, S) ?? 1 / 0;
                if (W.set(U.id, l), !g) m.push(U.id)
            } else if (g) Ci([U.id]), W.delete(U.id);
            else Z.add(U.id), W.set(U.id, 1 / 0), hs([U.id], O).catch((l) => E(`[ScheduledTasks] failed to remove task ${U.id}: ${l}`)).finally(() => Z.delete(U.id))
        }
        if (N) {
            for (let U of M) F(U, !1);
            if (m.length > 0) {
                for (let U of m) Z.add(U);
                W04(m, x, O).catch((U) => E(`[ScheduledTasks] failed to persist lastFiredAt: ${U}`)).finally(() => {
                    for (let U of m) Z.delete(U)
                })
            }
        }
        if (O === void 0)
            for (let U of nL()) F(U, !0);
        for (let U of P) F(U, !0);
        if (B.size === 0) {
            W.clear();
            return
        }
        for (let U of W.keys())
            if (!B.has(U)) W.delete(U)
    }
    async function C() {
        if (k) return;
        if (G) clearInterval(G), G = null;
        let {
            default: x
        } = await Promise.resolve().then(() => (AE6(), dA4));
        if (k) return;
        if (N = await PW7(X).catch(() => !1), k) {
            if (N) N = !1, iY8(X);
            return
        }
        if (!N) v = setInterval(() => {
            PW7(X).then((m) => {
                if (k) {
                    if (m) iY8(X);
                    return
                }
                if (m) {
                    if (N = !0, v) clearInterval(v), v = null
                }
            }).catch((m) => E(String(m), {
                level: "error"
            }))
        }, D2A), v.unref?.();
        R(!0).then(h);
        let B = Ls(O);
        V = x.watch(B, {
            persistent: !1,
            ignoreInitial: !0,
            awaitWriteFinish: {
                stabilityThreshold: W2A
            },
            ignorePermissionErrors: !0
        }), V.on("add", () => void R(!1)), V.on("change", () => void R(!1)), V.on("unlink", () => {
            if (!k) M = [], W.clear()
        }), f = setInterval(h, gO5), f.unref?.()
    }
    return {
        start() {
            if (k = !1, O !== void 0) {
                E(`[ScheduledTasks] scheduler start() — dir=${O}, hasTasks=${gR8(O)}`), C();
                return
            }
            if (E(`[ScheduledTasks] scheduler start() — enabled=${LD6()}, hasTasks=${gR8()}`), !LD6() && (z || J !== void 0 || gR8())) Si(!0);
            if (LD6()) {
                C();
                return
            }
            G = setInterval((x) => {
                if (LD6()) x()
            }, gO5, C), G.unref?.()
        },
        stop() {
            if (k = !0, G) clearInterval(G), G = null;
            if (f) clearInterval(f), f = null;
            if (v) clearInterval(v), v = null;
            if (V?.close(), V = null, N) N = !1, iY8(X)
        },
        getNextFireTime() {
            let x = 1 / 0;
            for (let B of W.values())
                if (B < x) x = B;
            return x === 1 / 0 ? null : x
        }
    }
}
// @from(Ln 547041, Col 0)
function QO5(q) {
    let K = q.length > 1,
        _ = `The following one-shot scheduled task${K?"s were":" was"} missed while Claude was not running. ${K?"They have":"It has"} already been removed from .claude/scheduled_tasks.json.

Do NOT execute ${K?"these prompts":"this prompt"} yet. First use the AskUserQuestion tool to ask whether to run ${K?"each one":"it"} now. Only execute if the user confirms.`,
        z = q.map((Y) => {
            let A = `[${Np(Y.cron)}, created ${new Date(Y.createdAt).toLocaleString()}]`,
                O = (Y.prompt.match(/`+/g) ?? []).reduce(($, j) => Math.max($, j.length), 0),
                w = "`".repeat(Math.max(3, O + 1));
            return `${A}
${w}
${Y.prompt}
${w}`
        });
    return `${_}

${z.join(`

`)}`
}
// @from(Ln 547061, Col 4)
P2A
// @from(Ln 547061, Col 9)
gO5 = 1000
// @from(Ln 547062, Col 4)
W2A = 300
// @from(Ln 547063, Col 4)
D2A = 5000
// @from(Ln 547064, Col 4)
DW7 = L(() => {
    y8();
    C8();
    Uj6();
    yp();
    FO5();
    K8();
    P2A = (HR6(), B7(jR6))
})
// @from(Ln 547073, Col 4)
lO5 = {}
// @from(Ln 547078, Col 0)
function f2A({
    isLoading: q,
    assistantMode: K = !1,
    setMessages: _
}) {
    let z = Ft8.useRef(q);
    z.current = q;
    let Y = H9(),
        A = R7(),
        O = EX();
    Ft8.useEffect(() => {
        if (!uD()) return;
        let w = (H) => LY({
                value: Z2A.resolveLoopDefaultFire(H),
                mode: "prompt",
                priority: "later",
                isMeta: !0,
                workload: pV8
            }),
            $ = void 0,
            j = WW7({
                onFire: w,
                onFireTask: (H) => {
                    if (H.agentId) {
                        let X = mc(H.agentId, Y.getState().tasks);
                        if (X && !np(X.status)) {
                            f18(X.id, H.prompt, O);
                            return
                        }
                        E(`[ScheduledTasks] teammate ${H.agentId} gone, removing orphaned cron ${H.id}`), hs([H.id]);
                        return
                    }
                    let J = sCK(`Running scheduled task (${G2A(new Date)})`);
                    _((X) => [...X, J]), w(H.prompt)
                },
                isLoading: () => z.current,
                assistantMode: K,
                getJitterConfig: xK6,
                isKilled: () => !uD(),
                getExtraTasks: cO5 && $ ? () => cO5.getRoutineCronTasks(c9(), $) : void 0
            });
        return j.start(), () => {
            j.stop()
        }
    }, [K, _, Y.getState, O])
}
// @from(Ln 547125, Col 0)
function G2A(q) {
    return q.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }).replace(/,? at |, /, " ").replace(/ ([AP]M)/, (K, _) => _.toLowerCase())
}
// @from(Ln 547133, Col 4)
Ft8
// @from(Ln 547133, Col 9)
Z2A
// @from(Ln 547133, Col 14)
cO5 = null
// @from(Ln 547134, Col 4)
nO5 = L(() => {
    $S();
    y8();
    N7();
    $T();
    hx();
    QR();
    ve6();
    DW7();
    yp();
    K8();
    b$();
    _7();
    m26();
    Ft8 = K6(P6(), 1), Z2A = (HR6(), B7(jR6))
})
// @from(Ln 547150, Col 4)
sO5 = {}
// @from(Ln 547165, Col 0)
function iO5(q) {
    let K = s(11),
        {
            showAllInTranscript: _,
            virtualScroll: z,
            searchBadge: Y,
            suppressShowAll: A,
            status: O
        } = q,
        w = A === void 0 ? !1 : A,
        $ = V3("app:toggleTranscript", "Global", "ctrl+o"),
        j = V3("transcript:toggleShowAll", "Transcript", "ctrl+e"),
        H;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) H = gmK(), K[0] = H;
    else H = K[0];
    let J = H,
        X = J ? `open in ${J}` : "open in editor",
        M = Y ? " · n/N to navigate" : z ? ` · ${e6.arrowUp}${e6.arrowDown} scroll · [ to print output · v to ${X}` : w ? ` · v to ${X}` : ` · ${j} to ${_?"collapse":"show all"}`,
        P;
    if (K[1] !== M || K[2] !== $) P = l8.createElement(T, {
        dimColor: !0
    }, "Showing detailed transcript · ", $, " to toggle", M), K[1] = M, K[2] = $, K[3] = P;
    else P = K[3];
    let W;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) W = l8.createElement(u, {
        flexGrow: 1
    }), K[4] = W;
    else W = K[4];
    let D;
    if (K[5] !== Y || K[6] !== O) D = l8.createElement(I2A, {
        status: O,
        searchBadge: Y
    }), K[5] = Y, K[6] = O, K[7] = D;
    else D = K[7];
    let Z;
    if (K[8] !== P || K[9] !== D) Z = l8.createElement(u, {
        noSelect: !0,
        alignItems: "center",
        alignSelf: "center",
        borderTopDimColor: !0,
        borderBottom: !1,
        borderLeft: !1,
        borderRight: !1,
        borderStyle: "single",
        marginTop: 1,
        paddingLeft: 2,
        width: "100%"
    }, P, W, D), K[8] = P, K[9] = D, K[10] = Z;
    else Z = K[10];
    return Z
}
// @from(Ln 547217, Col 0)
function I2A(q) {
    let K = s(6),
        {
            status: _,
            searchBadge: z
        } = q;
    if (_) {
        let A;
        if (K[0] !== _) A = l8.createElement(T, null, _, " "), K[0] = _, K[1] = A;
        else A = K[1];
        return A
    }
    if (z) {
        let A;
        if (K[2] !== z.count || K[3] !== z.current) A = l8.createElement(T, {
            dimColor: !0
        }, z.current, "/", z.count, "  "), K[2] = z.count, K[3] = z.current, K[4] = A;
        else A = K[4];
        return A
    }
    let Y;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) Y = l8.createElement(T, {
        dimColor: !0
    }, "verbose "), K[5] = Y;
    else Y = K[5];
    return Y
}
// @from(Ln 547245, Col 0)
function x2A({
    jumpRef: q,
    count: K,
    current: _,
    onClose: z,
    onCancel: Y,
    setHighlight: A,
    initialQuery: O
}) {
    let {
        query: w,
        cursorOffset: $,
        handleKeyDown: j,
        handlePaste: H
    } = bS({
        isActive: !0,
        initialQuery: O,
        onExit: () => z(w),
        onCancel: Y
    }), [J, X] = l8.useState("building");
    l8.useEffect(() => {
        let D = !0,
            Z = q.current?.warmSearchIndex;
        if (!Z) {
            X(null);
            return
        }
        return X("building"), Z().then((G) => {
            if (!D) return;
            if (G < 20) X(null);
            else X({
                ms: G
            }), setTimeout(() => D && X(null), 2000)
        }), () => {
            D = !1
        }
    }, []);
    let M = J !== "building";
    X1.useEffect(() => {
        if (!M) return;
        q.current?.setSearchQuery(w), A(w)
    }, [w, M]);
    let P = $,
        W = P < w.length ? w[P] : " ";
    return l8.createElement(u, {
        borderTopDimColor: !0,
        borderBottom: !1,
        borderLeft: !1,
        borderRight: !1,
        borderStyle: "single",
        marginTop: 1,
        paddingLeft: 2,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: j,
        onPaste: H,
        width: "100%",
        noSelect: !0
    }, l8.createElement(T, null, "/"), l8.createElement(T, null, w.slice(0, P)), l8.createElement(T, {
        inverse: !0
    }, W), P < w.length && l8.createElement(T, null, w.slice(P + 1)), l8.createElement(u, {
        flexGrow: 1
    }), J === "building" ? l8.createElement(T, {
        dimColor: !0
    }, "indexing… ") : J ? l8.createElement(T, {
        dimColor: !0
    }, "indexed in ", J.ms, "ms ") : K === 0 && w ? l8.createElement(T, {
        color: "error"
    }, "no matches ") : K > 0 ? l8.createElement(T, {
        dimColor: !0
    }, _, "/", K, "  ") : null)
}
// @from(Ln 547318, Col 0)
function oO5(q) {
    let K = s(6),
        {
            isAnimating: _,
            title: z,
            disabled: Y,
            noPrefix: A
        } = q,
        O = K2(),
        [w, $] = X1.useState(0),
        j, H;
    if (K[0] !== Y || K[1] !== _ || K[2] !== A || K[3] !== O) j = () => {
        if (Y || A || !_ || !O) return;
        let X = setInterval(m2A, u2A, $);
        return () => clearInterval(X)
    }, H = [Y, A, _, O], K[0] = Y, K[1] = _, K[2] = A, K[3] = O, K[4] = j, K[5] = H;
    else j = K[4], H = K[5];
    X1.useEffect(j, H);
    let J = _ ? aO5[w] ?? rO5 : rO5;
    return eN6(Y ? null : A ? z : `${J} ${z}`), null
}
// @from(Ln 547340, Col 0)
function m2A(q) {
    return q(B2A)
}
// @from(Ln 547344, Col 0)
function B2A(q) {
    return (q + 1) % aO5.length
}