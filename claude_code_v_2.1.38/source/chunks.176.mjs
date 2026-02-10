
// @from(Ln 453742, Col 0)
function sT6(A) {
    let q = e(17),
        {
            customApiKeyTruncated: K,
            onDone: Y
        } = A,
        z;
    if (q[0] !== K || q[1] !== Y) z = function(P) {
        A: switch (P) {
            case "yes": {
                jA((W) => ({
                    ...W,
                    customApiKeyResponses: {
                        ...W.customApiKeyResponses,
                        approved: [...W.customApiKeyResponses?.approved ?? [], K]
                    }
                })), Y();
                break A
            }
            case "no":
                jA((W) => ({
                    ...W,
                    customApiKeyResponses: {
                        ...W.customApiKeyResponses,
                        rejected: [...W.customApiKeyResponses?.rejected ?? [], K]
                    }
                })), Y()
        }
    }, q[0] = K, q[1] = Y, q[2] = z;
    else z = q[2];
    let w = z,
        H;
    if (q[3] !== w) H = () => w("no"), q[3] = w, q[4] = H;
    else H = q[4];
    let $;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) $ = Bc.default.createElement(V, {
        bold: !0
    }, "ANTHROPIC_API_KEY"), q[5] = $;
    else $ = q[5];
    let O;
    if (q[6] !== K) O = Bc.default.createElement(V, null, $, Bc.default.createElement(V, null, ": sk-ant-...", K)), q[6] = K, q[7] = O;
    else O = q[7];
    let _;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) _ = Bc.default.createElement(V, null, "Do you want to use this API key?"), q[8] = _;
    else _ = q[8];
    let J;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) J = {
        label: "Yes",
        value: "yes"
    }, q[9] = J;
    else J = q[9];
    let X;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) X = [J, {
        label: Bc.default.createElement(V, null, "No (", Bc.default.createElement(V, {
            bold: !0
        }, "recommended"), ")"),
        value: "no"
    }], q[10] = X;
    else X = q[10];
    let D;
    if (q[11] !== w) D = Bc.default.createElement(kA, {
        defaultValue: "no",
        defaultFocusValue: "no",
        options: X,
        onChange: (M) => w(M),
        onCancel: () => w("no")
    }), q[11] = w, q[12] = D;
    else D = q[12];
    let j;
    if (q[13] !== H || q[14] !== O || q[15] !== D) j = Bc.default.createElement(w8, {
        title: "Detected a custom API key in your environment",
        color: "warning",
        onCancel: H
    }, O, _, D), q[13] = H, q[14] = O, q[15] = D, q[16] = j;
    else j = q[16];
    return j
}
// @from(Ln 453819, Col 4)
Bc
// @from(Ln 453820, Col 4)
sFA = v(() => {
    i1();
    m1();
    cA();
    wY();
    Bq();
    Bc = o(X1(), 1)
})
// @from(Ln 453829, Col 0)
function GDq(A) {
    let q = e(13),
        {
            settingsErrors: K,
            onContinue: Y,
            onExit: z
        } = A,
        w;
    if (q[0] !== Y || q[1] !== z) w = function(j) {
        if (j === "exit") z();
        else Y()
    }, q[0] = Y, q[1] = z, q[2] = w;
    else w = q[2];
    let H = w,
        $;
    if (q[3] !== K) $ = Oc1.default.createElement(GV6, {
        errors: K
    }), q[3] = K, q[4] = $;
    else $ = q[4];
    let O;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) O = Oc1.default.createElement(V, {
        dimColor: !0
    }, "Files with errors are skipped entirely, not just the invalid settings."), q[5] = O;
    else O = q[5];
    let _;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) _ = [{
        label: "Exit and fix manually",
        value: "exit"
    }, {
        label: "Continue without these settings",
        value: "continue"
    }], q[6] = _;
    else _ = q[6];
    let J;
    if (q[7] !== H) J = Oc1.default.createElement(kA, {
        options: _,
        onChange: H
    }), q[7] = H, q[8] = J;
    else J = q[8];
    let X;
    if (q[9] !== z || q[10] !== $ || q[11] !== J) X = Oc1.default.createElement(w8, {
        title: "Settings Error",
        onCancel: z,
        color: "warning",
        borderDimColor: !1
    }, $, O, J), q[9] = z, q[10] = $, q[11] = J, q[12] = X;
    else X = q[12];
    return X
}
// @from(Ln 453878, Col 4)
Oc1
// @from(Ln 453879, Col 4)
ZDq = v(() => {
    i1();
    m1();
    wY();
    AxA();
    Bq();
    Oc1 = o(X1(), 1)
})
// @from(Ln 453888, Col 0)
function N$z(A) {
    let q = A.toLowerCase(),
        K = E4();
    for (let [Y, z] of Object.entries(V$z)) {
        let w = z.retirementDates[K];
        if (!q.includes(Y) || !w) continue;
        return {
            isDeprecated: !0,
            modelName: z.modelName,
            retirementDate: w
        }
    }
    return {
        isDeprecated: !1
    }
}
// @from(Ln 453905, Col 0)
function tT6(A) {
    if (!A) return null;
    let q = N$z(A);
    if (!q.isDeprecated) return null;
    return `⚠ ${q.modelName} will be retired on ${q.retirementDate}. Consider switching to a newer model.`
}
// @from(Ln 453911, Col 4)
V$z
// @from(Ln 453912, Col 4)
tFA = v(() => {
    UH();
    V$z = {
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
// @from(Ln 453945, Col 0)
function jf1(A, q) {
    K1(A instanceof Error ? A : Error(String(A))), console.error(`${l1.cross} Failed to ${q}: ${A instanceof Error?A.message:String(A)}`), process.exit(1)
}
// @from(Ln 453948, Col 0)
async function fDq(A, q = "user") {
    try {
        console.log(`Installing plugin "${A}"...`);
        let K = await KKq(A, q);
        if (!K.success) throw Error(K.message);
        console.log(`${l1.tick} ${K.message}`), c("tengu_plugin_installed_cli", {
            plugin_id: K.pluginId || A,
            marketplace_name: K.pluginId?.split("@")[1] || "unknown",
            scope: K.scope || q
        }), process.exit(0)
    } catch (K) {
        jf1(K, `install plugin "${A}"`)
    }
}
// @from(Ln 453962, Col 0)
async function VDq(A, q = "user") {
    try {
        let K = await QV6(A, q);
        if (!K.success) throw Error(K.message);
        console.log(`${l1.tick} ${K.message}`), c("tengu_plugin_uninstalled_cli", {
            plugin_id: K.pluginId || A,
            scope: K.scope || q
        }), process.exit(0)
    } catch (K) {
        jf1(K, `uninstall plugin "${A}"`)
    }
}
// @from(Ln 453974, Col 0)
async function NDq(A, q) {
    try {
        let K = await x91(A, q);
        if (!K.success) throw Error(K.message);
        console.log(`${l1.tick} ${K.message}`), c("tengu_plugin_enabled_cli", {
            plugin_id: K.pluginId || A,
            scope: K.scope
        }), process.exit(0)
    } catch (K) {
        jf1(K, `enable plugin "${A}"`)
    }
}
// @from(Ln 453986, Col 0)
async function TDq(A, q) {
    try {
        let K = await hp1(A, q);
        if (!K.success) throw Error(K.message);
        console.log(`${l1.tick} ${K.message}`), c("tengu_plugin_disabled_cli", {
            plugin_id: K.pluginId || A,
            scope: K.scope
        }), process.exit(0)
    } catch (K) {
        jf1(K, `disable plugin "${A}"`)
    }
}
// @from(Ln 453998, Col 0)
async function vDq() {
    try {
        let A = await YKq();
        if (!A.success) throw Error(A.message);
        console.log(`${l1.tick} ${A.message}`), c("tengu_plugin_disabled_all_cli", {}), process.exit(0)
    } catch (A) {
        jf1(A, "disable all plugins")
    }
}
// @from(Ln 454007, Col 0)
async function EDq(A, q) {
    try {
        Q4(`Checking for updates for plugin "${A}" at ${q} scope…
`);
        let K = await EZ1(A, q);
        if (!K.success) throw Error(K.message);
        if (Q4(`${l1.tick} ${K.message}
`), !K.alreadyUpToDate) c("tengu_plugin_updated_cli", {
            plugin_id: A,
            old_version: K.oldVersion || "unknown",
            new_version: K.newVersion || "unknown"
        });
        await nK(0)
    } catch (K) {
        jf1(K, `update plugin "${A}"`)
    }
}
// @from(Ln 454024, Col 4)
eFA = v(() => {
    b7();
    y6();
    u6();
    w$();
    kZ1()
})
// @from(Ln 454041, Col 0)
function eT6(A = "claude-prompt", q = ".md") {
    let K = E$z();
    return T$z(v$z(), `${A}-${K}${q}`)
}
// @from(Ln 454045, Col 4)
AQA = () => {}
// @from(Ln 454047, Col 0)
function RDq() {
    if (qQA !== void 0) return qQA;
    try {
        return i2(kDq)
    } catch {
        return !1
    }
}
// @from(Ln 454056, Col 0)
function yDq() {
    if (KQA !== void 0) return KQA;
    try {
        return i2(LDq)
    } catch {
        return !1
    }
}
// @from(Ln 454065, Col 0)
function k$z(A, q) {
    let K = BX6(A);
    if (K === 0) return;
    let Y = K !== null ? {
        ...q,
        sample_rate: K
    } : q;
    if (RDq()) WvA(A, Y);
    if (yDq()) _GA(A, Y);
    FX6(A, Y)
}
// @from(Ln 454076, Col 0)
async function L$z(A, q) {
    let K = BX6(A);
    if (K === 0) return;
    let Y = K !== null ? {
        ...q,
        sample_rate: K
    } : q;
    if (RDq()) await WvA(A, Y);
    if (yDq()) _GA(A, Y);
    FX6(A, Y)
}
// @from(Ln 454087, Col 0)
async function CDq() {
    qQA = i2(kDq), KQA = i2(LDq)
}
// @from(Ln 454091, Col 0)
function SDq() {
    ziA({
        logEvent: k$z,
        logEventAsync: L$z
    })
}
// @from(Ln 454097, Col 4)
kDq = "tengu_log_segment_events"
// @from(Ln 454098, Col 4)
LDq = "tengu_log_datadog_events"
// @from(Ln 454099, Col 4)
qQA = void 0
// @from(Ln 454100, Col 4)
KQA = void 0
// @from(Ln 454101, Col 4)
YQA = v(() => {
    U4();
    GvA();
    JGA();
    qm1();
    u6()
})
// @from(Ln 454109, Col 0)
function hDq(A) {
    let q = e(7),
        {
            onAccept: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = [], q[0] = Y;
    else Y = q[0];
    mc.default.useEffect(C$z, Y);
    let z;
    if (q[1] !== K) z = function(X) {
        A: switch (X) {
            case "accept": {
                c("tengu_bypass_permissions_mode_dialog_accept", {}), jA(y$z), K();
                break A
            }
            case "decline":
                w3(1)
        }
    }, q[1] = K, q[2] = z;
    else z = q[2];
    let w = z,
        H = R$z,
        $;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) $ = mc.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, mc.default.createElement(V, null, "In Bypass Permissions mode, Claude Code will not ask for your approval before running potentially dangerous commands.", mc.default.createElement(LX, null), "This mode should only be used in a sandboxed container/VM that has restricted internet access and can easily be restored if damaged."), mc.default.createElement(V, null, "By proceeding, you accept all responsibility for actions taken while running in Bypass Permissions mode."), mc.default.createElement(d7, {
        url: "https://code.claude.com/docs/en/security"
    })), q[3] = $;
    else $ = q[3];
    let O;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) O = [{
        label: "No, exit",
        value: "decline"
    }, {
        label: "Yes, I accept",
        value: "accept"
    }], q[4] = O;
    else O = q[4];
    let _;
    if (q[5] !== w) _ = mc.default.createElement(w8, {
        title: "WARNING: Claude Code running in Bypass Permissions mode",
        color: "error",
        onCancel: H
    }, $, mc.default.createElement(kA, {
        options: O,
        onChange: (J) => w(J)
    })), q[5] = w, q[6] = _;
    else _ = q[6];
    return _
}
// @from(Ln 454162, Col 0)
function R$z() {
    w3(0)
}
// @from(Ln 454166, Col 0)
function y$z(A) {
    if (A.bypassPermissionsModeAccepted === !0) return A;
    return {
        ...A,
        bypassPermissionsModeAccepted: !0
    }
}
// @from(Ln 454174, Col 0)
function C$z() {
    c("tengu_bypass_permissions_mode_dialog_shown", {})
}
// @from(Ln 454177, Col 4)
mc
// @from(Ln 454178, Col 4)
IDq = v(() => {
    i1();
    m1();
    wY();
    cA();
    u6();
    m1();
    w$();
    Bq();
    mc = o(X1(), 1)
})
// @from(Ln 454190, Col 0)
function xDq(A) {
    let q = e(20),
        {
            onDone: K
        } = A,
        [Y, z] = Ij.default.useState(!1),
        w, H;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = () => {
        c("tengu_claude_in_chrome_onboarding_shown", {}), Ec().then(z), jA(I$z)
    }, H = [], q[0] = w, q[1] = H;
    else w = q[0], H = q[1];
    Ij.default.useEffect(w, H);
    let $;
    if (q[2] !== K) $ = (W, G) => {
        if (G.return) K()
    }, q[2] = K, q[3] = $;
    else $ = q[3];
    D8($);
    let O;
    if (q[4] !== Y) O = !Y && Ij.default.createElement(Ij.default.Fragment, null, Ij.default.createElement(LX, null), Ij.default.createElement(LX, null), "Requires the Chrome extension. Get started at", " ", Ij.default.createElement(d7, {
        url: S$z
    })), q[4] = Y, q[5] = O;
    else O = q[5];
    let _;
    if (q[6] !== O) _ = Ij.default.createElement(V, null, "Claude in Chrome works with the Chrome extension to let you control your browser directly from Claude Code. You can navigate websites, fill forms, capture screenshots, record GIFs, and debug with console logs and network requests.", O), q[6] = O, q[7] = _;
    else _ = q[7];
    let J;
    if (q[8] !== Y) J = Y && Ij.default.createElement(Ij.default.Fragment, null, " ", "(", Ij.default.createElement(d7, {
        url: h$z
    }), ")"), q[8] = Y, q[9] = J;
    else J = q[9];
    let X;
    if (q[10] !== J) X = Ij.default.createElement(V, {
        dimColor: !0
    }, "Site-level permissions are inherited from the Chrome extension. Manage permissions in the Chrome extension settings to control which sites Claude can browse, click, and type on", J, "."), q[10] = J, q[11] = X;
    else X = q[11];
    let D;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) D = Ij.default.createElement(V, {
        bold: !0,
        color: "chromeYellow"
    }, "/chrome"), q[12] = D;
    else D = q[12];
    let j;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) j = Ij.default.createElement(V, {
        dimColor: !0
    }, "For more info, use", " ", D, " ", "or visit ", Ij.default.createElement(d7, {
        url: "https://code.claude.com/docs/en/chrome"
    })), q[13] = j;
    else j = q[13];
    let M;
    if (q[14] !== _ || q[15] !== X) M = Ij.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, _, X, j), q[14] = _, q[15] = X, q[16] = M;
    else M = q[16];
    let P;
    if (q[17] !== K || q[18] !== M) P = Ij.default.createElement(w8, {
        title: "Claude in Chrome (Beta)",
        onCancel: K,
        color: "chromeYellow"
    }, M), q[17] = K, q[18] = M, q[19] = P;
    else P = q[19];
    return P
}
// @from(Ln 454255, Col 0)
function I$z(A) {
    return {
        ...A,
        hasCompletedClaudeInChromeOnboarding: !0
    }
}
// @from(Ln 454261, Col 4)
Ij
// @from(Ln 454261, Col 8)
S$z = "https://claude.ai/chrome"
// @from(Ln 454262, Col 4)
h$z = "https://clau.de/chrome/permissions"
// @from(Ln 454263, Col 4)
bDq = v(() => {
    i1();
    m1();
    m1();
    cA();
    u6();
    r91();
    Bq();
    Ij = o(X1(), 1)
})
// @from(Ln 454274, Col 0)
function BDq(A) {
    let q = e(3),
        {
            getFpsMetrics: K,
            children: Y
        } = A,
        z;
    if (q[0] !== Y || q[1] !== K) z = Mf1.default.createElement(uDq.Provider, {
        value: K
    }, Y), q[0] = Y, q[1] = K, q[2] = z;
    else z = q[2];
    return z
}
// @from(Ln 454288, Col 0)
function mDq() {
    return Mf1.useContext(uDq)
}
// @from(Ln 454291, Col 4)
Mf1
// @from(Ln 454291, Col 9)
uDq
// @from(Ln 454292, Col 4)
zQA = v(() => {
    i1();
    Mf1 = o(X1(), 1), uDq = Mf1.createContext(void 0)
})
// @from(Ln 454297, Col 0)
function K11({
    newState: A,
    oldState: q
}) {
    if (A.mainLoopModel !== q.mainLoopModel && A.mainLoopModel === null) Z7("userSettings", {
        model: void 0
    }), CG(null);
    if (A.mainLoopModel !== q.mainLoopModel && A.mainLoopModel !== null) Z7("userSettings", {
        model: A.mainLoopModel
    }), CG(A.mainLoopModel);
    if (A.expandedView !== q.expandedView) {
        let K = A.expandedView === "tasks",
            Y = A.expandedView === "teammates";
        if (f6().showExpandedTodos !== K || f6().showSpinnerTree !== Y) jA((z) => ({
            ...z,
            showExpandedTodos: K,
            showSpinnerTree: Y
        }))
    }
    if (q !== null && A.todos !== q.todos)
        for (let K in A.todos) $K1(A.todos[K], K);
    if (A.verbose !== q.verbose && f6().verbose !== A.verbose) {
        let K = A.verbose;
        jA((Y) => ({
            ...Y,
            verbose: K
        }))
    }
    if (A.feedbackSurvey.timeLastShown !== q.feedbackSurvey.timeLastShown && A.feedbackSurvey.timeLastShown !== null) {
        let K = A.feedbackSurvey.timeLastShown;
        jA((Y) => ({
            ...Y,
            feedbackSurveyState: {
                lastShownTime: K
            }
        }))
    }
    if (O$() && A.mcp !== q.mcp) {
        if (CJq(A.mcp.clients, A.mcp.tools, A.mcp.resources), bc()) _f1()
    }
    if (A.queuedCommands !== q.queuedCommands) XR6(A.queuedCommands.length);
    if (A.settings !== q.settings) try {
        if (i86(), n86(), A.settings.env !== q.settings.env) q11()
    } catch (K) {
        K1(K instanceof Error ? K : Error(`Failed to apply settings changes: ${K}`))
    }
}
// @from(Ln 454344, Col 4)
Av6 = v(() => {
    cA();
    cA();
    B6();
    p8();
    pB();
    qf1();
    Tj();
    qc1();
    J7();
    y6();
    Hc1()
})
// @from(Ln 454358, Col 0)
function Pf1(A) {
    let q = e(6),
        {
            getFpsMetrics: K,
            initialState: Y,
            children: z
        } = A,
        w;
    if (q[0] !== z || q[1] !== Y) w = wQA.default.createElement(u_, {
        initialState: Y,
        onChangeAppState: K11
    }, z), q[0] = z, q[1] = Y, q[2] = w;
    else w = q[2];
    let H;
    if (q[3] !== K || q[4] !== w) H = wQA.default.createElement(BDq, {
        getFpsMetrics: K
    }, w), q[3] = K, q[4] = w, q[5] = H;
    else H = q[5];
    return H
}
// @from(Ln 454378, Col 4)
wQA
// @from(Ln 454379, Col 4)
FDq = v(() => {
    i1();
    zQA();
    d8();
    Av6();
    wQA = o(X1(), 1)
})
// @from(Ln 454387, Col 0)
function qv6() {
    let A = e(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = HQA.default.createElement(V, null, "MCP servers may execute code or access system resources. All tool calls require approval. Learn more in the", " ", HQA.default.createElement(d7, {
        url: "https://code.claude.com/docs/en/mcp"
    }, "MCP documentation"), "."), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 454396, Col 4)
HQA
// @from(Ln 454397, Col 4)
$QA = v(() => {
    i1();
    m1();
    m1();
    HQA = o(X1(), 1)
})
// @from(Ln 454404, Col 0)
function QDq(A) {
    let q = e(20),
        {
            serverNames: K,
            onDone: Y
        } = A,
        z;
    if (q[0] !== Y || q[1] !== K) z = function(W) {
        let G = C8() || {},
            f = G.enabledMcpjsonServers || [],
            Z = G.disabledMcpjsonServers || [],
            [N, T] = anA(K, (k) => W.includes(k));
        if (c("tengu_mcp_multidialog_choice", {
                approved: N.length,
                rejected: T.length
            }), N.length > 0) {
            let k = [...new Set([...f, ...N])];
            Z7("localSettings", {
                enabledMcpjsonServers: k
            })
        }
        if (T.length > 0) {
            let k = [...new Set([...Z, ...T])];
            Z7("localSettings", {
                disabledMcpjsonServers: k
            })
        }
        Y()
    }, q[0] = Y, q[1] = K, q[2] = z;
    else z = q[2];
    let w = z,
        H;
    if (q[3] !== Y || q[4] !== K) H = () => {
        let W = (C8() || {}).disabledMcpjsonServers || [],
            G = [...new Set([...W, ...K])];
        Z7("localSettings", {
            disabledMcpjsonServers: G
        }), Y()
    }, q[3] = Y, q[4] = K, q[5] = H;
    else H = q[5];
    let $ = H,
        O = `${K.length} new MCP servers found in .mcp.json`,
        _;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) _ = fy.default.createElement(qv6, null), q[6] = _;
    else _ = q[6];
    let J;
    if (q[7] !== K) J = K.map(x$z), q[7] = K, q[8] = J;
    else J = q[8];
    let X;
    if (q[9] !== w || q[10] !== K || q[11] !== J) X = fy.default.createElement(PZ1, {
        options: J,
        defaultValue: K,
        onSubmit: w
    }), q[9] = w, q[10] = K, q[11] = J, q[12] = X;
    else X = q[12];
    let D;
    if (q[13] !== $ || q[14] !== O || q[15] !== X) D = fy.default.createElement(w8, {
        title: O,
        subtitle: "Select any you wish to enable.",
        color: "warning",
        onCancel: $,
        hideInputGuide: !0
    }, _, X), q[13] = $, q[14] = O, q[15] = X, q[16] = D;
    else D = q[16];
    let j;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) j = fy.default.createElement(I, {
        paddingX: 1
    }, fy.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, fy.default.createElement(oA, null, fy.default.createElement(YA, {
        shortcut: "Space",
        action: "select"
    }), fy.default.createElement(YA, {
        shortcut: "Enter",
        action: "confirm"
    }), fy.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "reject all"
    })))), q[17] = j;
    else j = q[17];
    let M;
    if (q[18] !== D) M = fy.default.createElement(fy.default.Fragment, null, D, j), q[18] = D, q[19] = M;
    else M = q[19];
    return M
}
// @from(Ln 454493, Col 0)
function x$z(A) {
    return {
        label: A,
        value: A
    }
}
// @from(Ln 454499, Col 4)
fy
// @from(Ln 454500, Col 4)
gDq = v(() => {
    i1();
    m1();
    kV6();
    p8();
    snA();
    $QA();
    u6();
    wK();
    BK();
    HK();
    Bq();
    fy = o(X1(), 1)
})
// @from(Ln 454515, Col 0)
function UDq(A) {
    let q = e(13),
        {
            serverName: K,
            onDone: Y
        } = A,
        z;
    if (q[0] !== Y || q[1] !== K) z = function(j) {
        c("tengu_mcp_dialog_choice", {
            choice: j
        });
        A: switch (j) {
            case "yes":
            case "yes_all": {
                let P = (C8() || {}).enabledMcpjsonServers || [];
                if (!P.includes(K)) Z7("localSettings", {
                    enabledMcpjsonServers: [...P, K]
                });
                if (j === "yes_all") Z7("localSettings", {
                    enableAllProjectMcpServers: !0
                });
                Y();
                break A
            }
            case "no": {
                let P = (C8() || {}).disabledMcpjsonServers || [];
                if (!P.includes(K)) Z7("localSettings", {
                    disabledMcpjsonServers: [...P, K]
                });
                Y()
            }
        }
    }, q[0] = Y, q[1] = K, q[2] = z;
    else z = q[2];
    let w = z,
        H = `New MCP server found in .mcp.json: ${K}`,
        $;
    if (q[3] !== w) $ = () => w("no"), q[3] = w, q[4] = $;
    else $ = q[4];
    let O;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) O = Kv6.default.createElement(qv6, null), q[5] = O;
    else O = q[5];
    let _;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) _ = [{
        label: "Use this and all future MCP servers in this project",
        value: "yes_all"
    }, {
        label: "Use this MCP server",
        value: "yes"
    }, {
        label: "Continue without using this MCP server",
        value: "no"
    }], q[6] = _;
    else _ = q[6];
    let J;
    if (q[7] !== w) J = Kv6.default.createElement(kA, {
        options: _,
        onChange: (D) => w(D),
        onCancel: () => w("no")
    }), q[7] = w, q[8] = J;
    else J = q[8];
    let X;
    if (q[9] !== H || q[10] !== $ || q[11] !== J) X = Kv6.default.createElement(w8, {
        title: H,
        color: "warning",
        onCancel: $
    }, O, J), q[9] = H, q[10] = $, q[11] = J, q[12] = X;
    else X = q[12];
    return X
}
// @from(Ln 454585, Col 4)
Kv6
// @from(Ln 454586, Col 4)
pDq = v(() => {
    i1();
    wY();
    p8();
    $QA();
    u6();
    Bq();
    Kv6 = o(X1(), 1)
})
// @from(Ln 454595, Col 0)
async function dDq(A) {
    let {
        servers: q
    } = xJ("project"), K = Object.keys(q).filter((Y) => GG6(Y) === "pending");
    if (K.length === 0) return;
    await new Promise((Y) => {
        let z = () => void Y();
        if (K.length === 1 && K[0] !== void 0) {
            let w = K[0];
            A.render(OY1.default.createElement(u_, null, OY1.default.createElement(dX, null, OY1.default.createElement(UDq, {
                serverName: w,
                onDone: z
            }))))
        } else A.render(OY1.default.createElement(u_, null, OY1.default.createElement(dX, null, OY1.default.createElement(QDq, {
            serverNames: K,
            onDone: z
        }))))
    })
}
// @from(Ln 454614, Col 4)
OY1
// @from(Ln 454615, Col 4)
cDq = v(() => {
    gDq();
    pDq();
    d8();
    nW();
    tX();
    qd();
    OY1 = o(X1(), 1)
})
// @from(Ln 454625, Col 0)
function lDq(A, q = 20) {
    let K = new Map;
    for (let z of A) K.set(z, (K.get(z) || 0) + 1);
    return Array.from(K.entries()).sort((z, w) => w[1] - z[1]).slice(0, q).map(([z, w]) => `${w.toString().padStart(6)} ${z}`).join(`
`)
}
// @from(Ln 454631, Col 0)
async function b$z() {
    if (xA.platform === "win32") return [];
    if (!await aj()) return [];
    try {
        let A = "",
            {
                stdout: q
            } = await d4("git", ["config", "user.email"], {
                cwd: h6()
            }),
            K = "";
        if (q.trim()) {
            let {
                stdout: H
            } = await d4("git", ["log", "-n", "1000", "--pretty=format:", "--name-only", "--diff-filter=M", `--author=${q.trim()}`], {
                cwd: h6()
            }), $ = H.split(`
`).filter((O) => O.trim());
            K = lDq($)
        }
        if (A = `Files modified by user:
` + K, K.split(`
`).length < 10) {
            let {
                stdout: H
            } = await d4(pq(), ["log", "-n", "1000", "--pretty=format:", "--name-only", "--diff-filter=M"], {
                cwd: h6()
            }), $ = H.split(`
`).filter((_) => _.trim()), O = lDq($);
            A += `

Files modified by other users:
` + O
        }
        let z = (await SX({
            systemPrompt: ["You are an expert at analyzing git history. Given a list of files and their modification counts, return exactly five filenames that are frequently modified and represent core application logic (not auto-generated files, dependencies, or configuration). Make sure filenames are diverse, not all in the same folder, and are a mix of user and other users. Return only the filenames' basenames (without the path) separated by newlines with no explanation."],
            userPrompt: A,
            signal: new AbortController().signal,
            options: {
                querySource: "example_commands_frequently_modified",
                agents: [],
                isNonInteractiveSession: !1,
                hasAppendSystemPrompt: !1,
                mcpTools: []
            }
        })).message.content[0];
        if (!z || z.type !== "text") return [];
        let w = z.text.trim().split(`
`).map((H) => H.trim()).filter((H) => /^\S+\.\w+$/.test(H));
        if (w.length < 5) return [];
        return w
    } catch (A) {
        return K1(A), []
    }
}
// @from(Ln 454686, Col 4)
u$z = 604800000
// @from(Ln 454687, Col 4)
iDq
// @from(Ln 454687, Col 9)
nDq
// @from(Ln 454688, Col 4)
OQA = v(() => {
    cA();
    G5();
    N7();
    yw();
    tq();
    y6();
    zq();
    gl();
    h9();
    iDq = KA(() => {
        let A = sz(),
            q = A.exampleFiles?.length ? pj(A.exampleFiles) : "<filepath>",
            K = ["fix lint errors", "fix typecheck errors", `how does ${q} work?`, `refactor ${q}`, "how do I log an error?", `edit ${q} to...`, `write a test for ${q}`, "create a util logging.py that..."];
        return `Try "${pj(K)}"`
    }), nDq = KA(async () => {
        let A = sz(),
            q = Date.now(),
            K = A.exampleFilesGeneratedAt ?? 0;
        if (q - K > u$z) A.exampleFiles = [];
        if (!A.exampleFiles?.length) b$z().then((Y) => {
            if (Y.length) iH((z) => ({
                ...z,
                exampleFiles: Y,
                exampleFilesGeneratedAt: Date.now()
            }))
        })
    })
})
// @from(Ln 454717, Col 0)
class _QA {
    frameDurations = [];
    firstRenderTime;
    lastRenderTime;
    record(A) {
        let q = performance.now();
        if (this.firstRenderTime === void 0) this.firstRenderTime = q;
        this.lastRenderTime = q, this.frameDurations.push(A)
    }
    getMetrics() {
        if (this.frameDurations.length === 0 || this.firstRenderTime === void 0 || this.lastRenderTime === void 0) return;
        let A = this.lastRenderTime - this.firstRenderTime;
        if (A <= 0) return;
        let K = this.frameDurations.length / (A / 1000),
            Y = [...this.frameDurations].sort(($, O) => O - $),
            z = Math.max(0, Math.ceil(Y.length * 0.01) - 1),
            w = Y[z],
            H = w > 0 ? 1000 / w : 0;
        return {
            averageFps: Math.round(K * 100) / 100,
            low1PctFps: Math.round(H * 100) / 100
        }
    }
}
// @from(Ln 454741, Col 0)
async function rDq(A) {
    let q = await hv(A);
    for (let K of q) {
        if (K.type !== "prompt") continue;
        c("tengu_skill_loaded", {
            skill_name: K.name,
            skill_source: K.source,
            skill_loaded_from: K.loadedFrom
        })
    }
}
// @from(Ln 454752, Col 4)
oDq = v(() => {
    u6();
    c$()
})
// @from(Ln 454757, Col 0)
function aDq(A) {
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
        let w = K,
            H = Y;
        if (!q) console.error("Error: Server name is required."), console.error("Usage: claude mcp add <name> <command> [args...]"), process.exit(1);
        else if (!w) console.error("Error: Command is required when server name is provided."), console.error("Usage: claude mcp add <name> <command> [args...]"), process.exit(1);
        try {
            let $ = HG1(z.scope),
                O = xn4(z.transport),
                _ = z.transport !== void 0,
                J = w.startsWith("http://") || w.startsWith("https://") || w.startsWith("localhost") || w.endsWith("/sse") || w.endsWith("/mcp");
            if (c("tengu_mcp_add", {
                    type: O,
                    scope: $,
                    source: "command",
                    transport: O,
                    transportExplicit: _,
                    looksLikeUrl: J
                }), O === "sse") {
                if (!w) console.error("Error: URL is required for SSE transport."), process.exit(1);
                let X = z.header ? pyA(z.header) : void 0,
                    D = z.callbackPort ? parseInt(z.callbackPort, 10) : void 0,
                    j = z.clientId ? {
                        clientId: z.clientId,
                        ...D ? {
                            callbackPort: D
                        } : {}
                    } : void 0,
                    M = z.clientSecret && z.clientId ? await rg1() : void 0,
                    P = {
                        type: "sse",
                        url: w,
                        headers: X,
                        oauth: j
                    };
                if (ht(q, P, $), M) og1(q, P, M);
                if (process.stdout.write(`Added SSE MCP server ${q} with URL: ${w} to ${$} config
`), X) process.stdout.write(`Headers: ${Q1(X,null,2)}
`)
            } else if (O === "http") {
                if (!w) console.error("Error: URL is required for HTTP transport."), process.exit(1);
                let X = z.header ? pyA(z.header) : void 0,
                    D = z.callbackPort ? parseInt(z.callbackPort, 10) : void 0,
                    j = z.clientId ? {
                        clientId: z.clientId,
                        ...D ? {
                            callbackPort: D
                        } : {}
                    } : void 0,
                    M = z.clientSecret && z.clientId ? await rg1() : void 0,
                    P = {
                        type: "http",
                        url: w,
                        headers: X,
                        oauth: j
                    };
                if (ht(q, P, $), M) og1(q, P, M);
                if (process.stdout.write(`Added HTTP MCP server ${q} with URL: ${w} to ${$} config
`), X) process.stdout.write(`Headers: ${Q1(X,null,2)}
`)
            } else {
                if (z.clientId || z.clientSecret || z.callbackPort) process.stderr.write(`Warning: --client-id, --client-secret, and --callback-port are only supported for HTTP/SSE transports and will be ignored for stdio.
`);
                if (!_ && J) process.stderr.write(`
Warning: The command "${w}" looks like a URL, but is being interpreted as a stdio server as --transport was not specified.
`), process.stderr.write(`If this is an HTTP server, use: claude mcp add --transport http ${q} ${w}
`), process.stderr.write(`If this is an SSE server, use: claude mcp add --transport sse ${q} ${w}
`);
                let X = slA(z.env);
                ht(q, {
                    type: "stdio",
                    command: w,
                    args: H,
                    env: X
                }, $), process.stdout.write(`Added stdio MCP server ${q} with command: ${w} ${H.join(" ")} to ${$} config
`)
            }
            process.stdout.write(`File modified: ${KG($)}
`), process.exit(0)
        } catch ($) {
            console.error($.message), process.exit(1)
        }
    })
}
// @from(Ln 454854, Col 4)
sDq = v(() => {
    nW();
    tX();
    hA();
    m6();
    u6();
    g51()
})
// @from(Ln 454863, Col 0)
function tDq() {
    return f6().tipsHistory || {}
}
// @from(Ln 454867, Col 0)
function B$z(A) {
    jA((q) => {
        if (q.tipsHistory === A) return q;
        return {
            ...q,
            tipsHistory: A
        }
    })
}
// @from(Ln 454877, Col 0)
function eDq(A) {
    let q = tDq(),
        K = f6().numStartups;
    q[A] = K, B$z(q)
}
// @from(Ln 454883, Col 0)
function m$z(A) {
    return tDq()[A] || 0
}
// @from(Ln 454887, Col 0)
function Yv6(A) {
    let q = m$z(A);
    if (q === 0) return 1 / 0;
    return f6().numStartups - q
}
// @from(Ln 454892, Col 4)
JQA = v(() => {
    cA()
})
// @from(Ln 454895, Col 0)
async function Q$z() {
    return "claude-code-plugins" in await n5()
}
// @from(Ln 454898, Col 0)
async function zv6(A) {
    let q = [...g$z, ...U$z],
        K = await Promise.all(q.map((Y) => Y.isRelevant(A)));
    return q.filter((Y, z) => K[z]).filter((Y) => Yv6(Y.id) >= Y.cooldownSessions)
}
// @from(Ln 454903, Col 4)
g$z
// @from(Ln 454903, Col 9)
U$z
// @from(Ln 454904, Col 4)
XQA = v(() => {
    q3();
    cA();
    h9();
    mM();
    p$();
    e7();
    TV6();
    Oq1();
    G5();
    q$();
    x3();
    nU1();
    s2();
    p8();
    JQA();
    lq();
    ZN();
    Z6();
    Tr();
    pM();
    Pc();
    Gp1();
    OJ();
    g$z = [{
        id: "new-user-warmup",
        content: async () => "Start with small features or bug fixes, tell Claude to propose a plan, and verify its suggested edits",
        cooldownSessions: 3,
        async isRelevant() {
            return f6().numStartups < 10
        }
    }, {
        id: "plan-mode-for-complex-tasks",
        content: async () => `Use Plan Mode to prepare for a complex request before making changes. Press ${m0("chat:cycleMode","Chat","shift+tab")} twice to enable.`,
        cooldownSessions: 5,
        isRelevant: async () => {
            let A = f6();
            return (A.lastPlanModeUse ? (Date.now() - A.lastPlanModeUse) / 86400000 : 1 / 0) > 7
        }
    }, {
        id: "default-permission-mode-config",
        content: async () => "Use /config to change your default permission mode (including Plan Mode)",
        cooldownSessions: 10,
        isRelevant: async () => {
            try {
                let A = f6(),
                    q = C8(),
                    K = Boolean(A.lastPlanModeUse),
                    Y = Boolean(q?.permissions?.defaultMode);
                return K && !Y
            } catch (A) {
                return h(`Failed to check default-permission-mode-config tip relevance: ${A}`, {
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
                let A = f6();
                return await Bv1() <= 1 && A.numStartups > 50
            } catch (A) {
                return !1
            }
        }
    }, {
        id: "terminal-setup",
        content: async () => xA.terminal === "Apple_Terminal" ? "Run /terminal-setup to enable convenient terminal integration like Option + Enter for new line and more" : "Run /terminal-setup to enable convenient terminal integration like Shift + Enter for new line and more",
        cooldownSessions: 10,
        async isRelevant() {
            let A = f6();
            if (xA.terminal === "Apple_Terminal") return E91.isEnabled() && !A.optionAsMetaKeyInstalled;
            return E91.isEnabled() && !A.shiftEnterKeyBindingInstalled
        }
    }, {
        id: "shift-enter",
        content: async () => xA.terminal === "Apple_Terminal" ? "Press Option+Enter to send a multi-line message" : "Press Shift+Enter to send a multi-line message",
        cooldownSessions: 10,
        async isRelevant() {
            let A = f6();
            return Boolean((xA.terminal === "Apple_Terminal" ? A.optionAsMetaKeyInstalled : A.shiftEnterKeyBindingInstalled) && A.numStartups > 3)
        }
    }, {
        id: "shift-enter-setup",
        content: async () => xA.terminal === "Apple_Terminal" ? "Run /terminal-setup to enable Option+Enter for new lines" : "Run /terminal-setup to enable Shift+Enter for new lines",
        cooldownSessions: 10,
        async isRelevant() {
            if (!SD1()) return !1;
            let A = f6();
            return !(xA.terminal === "Apple_Terminal" ? A.optionAsMetaKeyInstalled : A.shiftEnterKeyBindingInstalled)
        }
    }, {
        id: "memory-command",
        content: async () => "Use /memory to view and manage Claude memory",
        cooldownSessions: 15,
        async isRelevant() {
            return f6().memoryUsageCount <= 0
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
        isRelevant: async () => !process.env.COLORTERM && H6.level < 3
    }, {
        id: "status-line",
        content: async () => "Use /statusline to set up a custom status line that will display beneath the input box",
        cooldownSessions: 25,
        isRelevant: async () => C8().statusLine === void 0
    }, {
        id: "prompt-queue",
        content: async () => "Hit Enter to queue up additional messages while Claude is working.",
        cooldownSessions: 5,
        async isRelevant() {
            return f6().promptQueueUseCount <= 3
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
        content: async () => `Open the Command Palette (Cmd+Shift+P) and run "Shell Command: Install '${xA.terminal==="vscode"?"code":xA.terminal}' command in PATH" to enable IDE integration`,
        cooldownSessions: 0,
        async isRelevant() {
            if (!Qb1()) return !1;
            if (eA() !== "macos") return !1;
            switch (xA.terminal) {
                case "vscode":
                    return !await ux7();
                case "cursor":
                    return !await xx7();
                case "windsurf":
                    return !await bx7();
                default:
                    return !1
            }
        }
    }, {
        id: "ide-upsell-external-terminal",
        content: async () => "Connect Claude to your IDE · /ide",
        cooldownSessions: 4,
        async isRelevant() {
            if (bX()) return !1;
            if (V$6().length !== 0) return !1;
            return (await Bx7()).length > 0
        }
    }, {
        id: "install-github-app",
        content: async () => "Run /install-github-app to tag @claude right from your Github issues and PRs",
        cooldownSessions: 10,
        isRelevant: async () => !f6().githubActionSetupCount
    }, {
        id: "install-slack-app",
        content: async () => "Run /install-slack-app to use Claude in Slack",
        cooldownSessions: 10,
        isRelevant: async () => !f6().slackAppInstallCount
    }, {
        id: "permissions",
        content: async () => "Use /permissions to pre-approve and pre-deny bash, edit, and MCP tools",
        cooldownSessions: 10,
        async isRelevant() {
            return f6().numStartups > 10
        }
    }, {
        id: "drag-and-drop-images",
        content: async () => "Did you know you can drag and drop image files into your terminal?",
        cooldownSessions: 10,
        isRelevant: async () => !xA.isSSH()
    }, {
        id: "paste-images-mac",
        content: async () => "Paste images into Claude Code using control+v (not cmd+v!)",
        cooldownSessions: 10,
        isRelevant: async () => eA() === "macos"
    }, {
        id: "double-esc",
        content: async () => "Double-tap esc to rewind the conversation to a previous point in time",
        cooldownSessions: 10,
        isRelevant: async () => !z2()
    }, {
        id: "double-esc-code-restore",
        content: async () => "Double-tap esc to rewind the code and/or conversation to a previous point in time",
        cooldownSessions: 10,
        isRelevant: async () => z2()
    }, {
        id: "continue",
        content: async () => "Run claude --continue or claude --resume to resume a conversation",
        cooldownSessions: 10,
        isRelevant: async () => !0
    }, {
        id: "rename-conversation",
        content: async () => "Name your conversations with /rename to find them easily in /resume later",
        cooldownSessions: 15,
        isRelevant: async () => Gc() && f6().numStartups > 10
    }, {
        id: "custom-commands",
        content: async () => "Create skills by adding .md files to .claude/skills/ in your project or ~/.claude/skills/ for skills that work in any project",
        cooldownSessions: 15,
        async isRelevant() {
            return f6().numStartups > 10
        }
    }, {
        id: "shift-tab",
        content: async () => `Hit ${m0("chat:cycleMode","Chat","shift+tab")} to cycle between default mode, auto-accept edit mode, and plan mode`,
        cooldownSessions: 10,
        isRelevant: async () => !0
    }, {
        id: "image-paste",
        content: async () => `Use ${pG1.displayText} to paste images from your clipboard`,
        cooldownSessions: 20,
        isRelevant: async () => !0
    }, {
        id: "custom-agents",
        content: async () => "Use /agents to optimize specific tasks. Eg. Software Architect, Code Writer, Code Reviewer",
        cooldownSessions: 15,
        async isRelevant() {
            return f6().numStartups > 5
        }
    }, {
        id: "agent-flag",
        content: async () => "Use --agent <agent_name> to directly start a conversation with a subagent",
        cooldownSessions: 15,
        async isRelevant() {
            return f6().numStartups > 5
        }
    }, {
        id: "desktop-app",
        content: async () => "Run Claude Code locally or remotely using the Claude desktop app: clau.de/desktop",
        cooldownSessions: 15,
        isRelevant: async () => eA() !== "linux"
    }, {
        id: "web-app",
        content: async () => "Use Claude Code on the web: clau.de/web",
        cooldownSessions: 15,
        isRelevant: async () => !0
    }, {
        id: "mobile-app",
        content: async () => "Use /mobile to get Claude on your phone",
        cooldownSessions: 15,
        isRelevant: async () => !0
    }, {
        id: "opusplan-mode-reminder",
        content: async () => `Your default model setting is Opus Plan Mode. Press ${m0("chat:cycleMode","Chat","shift+tab")} twice to activate Plan Mode and plan with Claude Opus.`,
        cooldownSessions: 2,
        async isRelevant() {
            let A = f6(),
                K = H71() === "opusplan",
                Y = A.lastPlanModeUse ? (Date.now() - A.lastPlanModeUse) / 86400000 : 1 / 0;
            return K && Y > 3
        }
    }, {
        id: "frontend-design-plugin",
        content: async (A) => {
            let q = await Q$z(),
                K = k8("suggestion", A.theme);
            if (!q) return `Working with HTML/CSS? Add the frontend-design plugin:
${K("/plugin marketplace add anthropics/claude-code")}
${K("/plugin install frontend-design@claude-code-plugins")}`;
            return `Working with HTML/CSS? Install the frontend-design plugin:
${K("/plugin install frontend-design@claude-code-plugins")}`
        },
        cooldownSessions: 3,
        async isRelevant(A) {
            if (BM("frontend-design@claude-code-plugins")) return !1;
            if (!A?.readFileState) return !1;
            return Th(A.readFileState).some((K) => /\.(html|css|htm)$/i.test(K))
        }
    }, {
        id: "guest-passes",
        content: async (A) => {
            let q = k8("claude", A.theme),
                K = ke();
            return K ? `Share Claude Code and earn ${q(Ee(K))} of extra usage · ${q("/passes")}` : `You have free guest passes to share · ${q("/passes")}`
        },
        cooldownSessions: 3,
        isRelevant: async () => {
            if (f6().hasVisitedPasses) return !1;
            let {
                eligible: q
            } = DN6();
            return q
        }
    }, {
        id: "overage-promo",
        content: async (A) => {
            let q = k8("claude", A.theme);
            if (i4() && lH()) return `${q("$50 free extra usage")} to try fast mode /extra-usage to enable`;
            return `${q("$50 free extra usage")} · /extra-usage to enable`
        },
        cooldownSessions: 3,
        isRelevant: async () => Wp1()
    }], U$z = []
})
// @from(Ln 455211, Col 0)
function DQA(A, q = process.argv) {
    for (let K = 0; K < q.length; K++) {
        let Y = q[K];
        if (Y?.startsWith(`${A}=`)) return Y.slice(A.length + 1);
        if (Y === A && K + 1 < q.length) return q[K + 1]
    }
    return
}
// @from(Ln 455220, Col 0)
function _c1(A, q) {
    if (A.fileHistorySnapshots && A.fileHistorySnapshots.length > 0) yP6(A.fileHistorySnapshots, (K) => {
        q((Y) => ({
            ...Y,
            fileHistory: K
        }))
    })
}
// @from(Ln 455229, Col 0)
function p$z(A) {
    return
}
// @from(Ln 455233, Col 0)
function jQA(A, q) {
    if (!l8()) return;
    if (!A && !q) return;
    return {
        name: A ?? "",
        color: q
    }
}
// @from(Ln 455242, Col 0)
function d$z(A, q, K) {
    if (q || !A) return {
        agentDefinition: q,
        agentType: void 0
    };
    let Y = K.activeAgents.find((z) => z.agentType === A);
    if (!Y) return h(`Resumed session had agent "${A}" but it is no longer available. Using default behavior.`), {
        agentDefinition: void 0,
        agentType: void 0
    };
    if (AC(Y.agentType), !HT() && Y.model && Y.model !== "inherit") CG(t9(Y.model));
    return {
        agentDefinition: Y,
        agentType: Y.agentType
    }
}
// @from(Ln 455258, Col 0)
async function c$z(A, q, K, Y) {
    return Y
}
// @from(Ln 455261, Col 0)
async function MQA(A, q, K) {
    let Y;
    if (!q.forkSession) {
        let _ = q.sessionIdOverride ?? A.sessionId;
        if (_) {
            if (mP(Yj(_)), q.transcriptPath) eV1(q.transcriptPath);
            await Hy(), Cq6(_)
        }
    }
    if (A.customTitle) id1(A.customTitle);
    let {
        agentDefinition: z,
        agentType: w
    } = d$z(A.agentSetting, K.mainThreadAgentDefinition, K.agentDefinitions), H = q.includeAttribution ? p$z(A) : void 0, $ = jQA(A.agentName, A.agentColor), O = await c$z(!!Y, K.currentCwd, K.cliAgents, K.agentDefinitions);
    return {
        messages: A.messages,
        fileHistorySnapshots: A.fileHistorySnapshots,
        agentName: A.agentName,
        agentColor: A.agentColor,
        restoredAgentDef: z,
        initialState: {
            ...K.initialState,
            ...w && {
                agent: w
            },
            ...H && {
                attribution: H
            },
            ...$ && {
                standaloneAgentContext: $
            },
            agentDefinitions: O
        }
    }
}
// @from(Ln 455296, Col 4)
Jc1 = v(() => {
    uv();
    ZN();
    Mq1();
    S9();
    Z6();
    B6();
    N8();
    DL();
    lq();
    e7()
})
// @from(Ln 455309, Col 0)
function l$z(A) {
    let q = e(16),
        {
            currentStep: K,
            sessionId: Y
        } = A,
        [z, w] = Nv(100),
        H = Math.floor(w / 100) % PQA.length,
        $;
    if (q[0] !== K) $ = (P) => P.key === K, q[0] = K, q[1] = $;
    else $ = q[1];
    let O = A0q.findIndex($),
        _ = PQA[H],
        J;
    if (q[2] !== _) J = lw.createElement(I, {
        marginBottom: 1
    }, lw.createElement(V, {
        bold: !0,
        color: "claude"
    }, _, " Teleporting session…")), q[2] = _, q[3] = J;
    else J = q[3];
    let X;
    if (q[4] !== Y) X = Y && lw.createElement(I, {
        marginBottom: 1
    }, lw.createElement(V, {
        dimColor: !0
    }, Y)), q[4] = Y, q[5] = X;
    else X = q[5];
    let D;
    if (q[6] !== O || q[7] !== H) D = A0q.map((P, W) => {
        let G = W < O,
            f = W === O,
            Z = W > O,
            N, T;
        if (G) N = l1.tick, T = "green";
        else if (f) N = PQA[H], T = "claude";
        else N = l1.circle, T = void 0;
        return lw.createElement(I, {
            key: P.key,
            flexDirection: "row"
        }, lw.createElement(I, {
            width: 2
        }, lw.createElement(V, {
            color: T,
            dimColor: Z
        }, N)), lw.createElement(V, {
            dimColor: Z,
            bold: f
        }, P.label))
    }), q[6] = O, q[7] = H, q[8] = D;
    else D = q[8];
    let j;
    if (q[9] !== D) j = lw.createElement(I, {
        flexDirection: "column",
        marginLeft: 2
    }, D), q[9] = D, q[10] = j;
    else j = q[10];
    let M;
    if (q[11] !== z || q[12] !== J || q[13] !== X || q[14] !== j) M = lw.createElement(I, {
        ref: z,
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1
    }, J, X, j), q[11] = z, q[12] = J, q[13] = X, q[14] = j, q[15] = M;
    else M = q[15];
    return M
}
// @from(Ln 455376, Col 0)
async function K0q(A, q) {
    let K = () => {};

    function Y() {
        let [$, O] = q0q.useState("validating");
        return K = O, lw.createElement(l$z, {
            currentStep: $,
            sessionId: q
        })
    }
    A.render(lw.createElement(u_, null, lw.createElement(Y, null)));
    let z = await Ct(q, K);
    K("checking_out");
    let {
        branchName: w,
        branchError: H
    } = await aW1(z.branch);
    return {
        messages: oW1(z.log, H),
        branchName: w
    }
}
// @from(Ln 455398, Col 4)
lw
// @from(Ln 455398, Col 8)
q0q
// @from(Ln 455398, Col 13)
PQA
// @from(Ln 455398, Col 18)
A0q
// @from(Ln 455399, Col 4)
Y0q = v(() => {
    i1();
    m1();
    b7();
    d8();
    Im();
    lw = o(X1(), 1), q0q = o(X1(), 1), PQA = ["◐", "◓", "◑", "◒"], A0q = [{
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
// @from(Ln 455419, Col 4)
i$z
// @from(Ln 455420, Col 4)
z0q = v(() => {
    R_1();
    i$z = ZK.object({
        session_id: ZK.string(),
        ws_url: ZK.string(),
        work_dir: ZK.string().optional()
    })
})
// @from(Ln 455428, Col 4)
w0q = v(() => {
    m6();
    z0q()
})
// @from(Ln 455436, Col 0)
async function H0q() {
    try {
        let A = await AI();
        if (!A) {
            h("Not in a GitHub repository, skipping path mapping update");
            return
        }
        let q;
        try {
            q = n$z(y8()).normalize("NFC")
        } catch {
            q = y8()
        }
        let K = A.toLowerCase(),
            z = f6().githubRepoPaths?.[K] ?? [];
        if (z.includes(q)) {
            h(`Path ${q} already tracked for repo ${K}`);
            return
        }
        let w = [q, ...z];
        jA((H) => ({
            ...H,
            githubRepoPaths: {
                ...H.githubRepoPaths,
                [K]: w
            }
        })), h(`Added ${q} to tracked paths for repo ${K}`)
    } catch (A) {
        h(`Error updating repo path mapping: ${A}`)
    }
}
// @from(Ln 455468, Col 0)
function $0q(A) {
    let q = f6(),
        K = A.toLowerCase();
    return q.githubRepoPaths?.[K] ?? []
}
// @from(Ln 455474, Col 0)
function O0q(A) {
    return A.filter((q) => r$z(q))
}
// @from(Ln 455477, Col 0)
async function _0q(A, q) {
    try {
        let K = await Is1(A);
        if (!K) return !1;
        let Y = s31(K);
        if (!Y) return !1;
        return Y.toLowerCase() === q.toLowerCase()
    } catch {
        return !1
    }
}
// @from(Ln 455489, Col 0)
function J0q(A, q) {
    let K = f6(),
        Y = A.toLowerCase(),
        z = K.githubRepoPaths?.[Y] ?? [],
        w = z.filter(($) => $ !== q);
    if (w.length === z.length) return;
    let H = {
        ...K.githubRepoPaths
    };
    if (w.length === 0) delete H[Y];
    else H[Y] = w;
    jA(($) => ({
        ...$,
        githubRepoPaths: H
    })), h(`Removed ${q} from tracked paths for repo ${Y}`)
}
// @from(Ln 455505, Col 4)
WQA = v(() => {
    t31();
    cA();
    B6();
    Z6();
    YH1()
})
// @from(Ln 455513, Col 0)
function X0q(A) {
    let q = e(18),
        {
            targetRepo: K,
            initialPaths: Y,
            onSelectPath: z,
            onCancel: w
        } = A,
        [H, $] = Hv6.useState(Y),
        [O, _] = Hv6.useState(null),
        [J, X] = Hv6.useState(!1),
        D;
    if (q[0] !== H || q[1] !== w || q[2] !== z || q[3] !== K) D = async (f) => {
        if (f === "cancel") {
            w();
            return
        }
        if (X(!0), _(null), await _0q(f, K)) {
            z(f);
            return
        }
        J0q(K, f);
        let N = H.filter((T) => T !== f);
        $(N), X(!1), _(`${L3(f)} no longer contains the correct repository. Select another path.`)
    }, q[0] = H, q[1] = w, q[2] = z, q[3] = K, q[4] = D;
    else D = q[4];
    let j = D,
        M;
    if (q[5] !== H) {
        let f;
        if (q[7] === Symbol.for("react.memo_cache_sentinel")) f = {
            label: "Cancel",
            value: "cancel"
        }, q[7] = f;
        else f = q[7];
        M = [...H.map(o$z), f], q[5] = H, q[6] = M
    } else M = q[6];
    let P = M,
        W;
    if (q[8] !== H.length || q[9] !== O || q[10] !== j || q[11] !== P || q[12] !== K || q[13] !== J) W = H.length > 0 ? NP.default.createElement(NP.default.Fragment, null, NP.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, O && NP.default.createElement(V, {
        color: "error"
    }, O), NP.default.createElement(V, null, "Open Claude Code in ", NP.default.createElement(V, {
        bold: !0
    }, K), ":")), J ? NP.default.createElement(I, null, NP.default.createElement(c4, null), NP.default.createElement(V, null, " Validating repository…")) : NP.default.createElement(kA, {
        options: P,
        onChange: (f) => void j(f)
    })) : NP.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, O && NP.default.createElement(V, {
        color: "error"
    }, O), NP.default.createElement(V, {
        dimColor: !0
    }, "Run claude --teleport from a checkout of ", K)), q[8] = H.length, q[9] = O, q[10] = j, q[11] = P, q[12] = K, q[13] = J, q[14] = W;
    else W = q[14];
    let G;
    if (q[15] !== w || q[16] !== W) G = NP.default.createElement(w8, {
        title: "Teleport to Repo",
        onCancel: w,
        color: "background",
        borderDimColor: !0
    }, W), q[15] = w, q[16] = W, q[17] = G;
    else G = q[17];
    return G
}
// @from(Ln 455582, Col 0)
function o$z(A) {
    return {
        label: NP.default.createElement(V, null, "Use ", NP.default.createElement(V, {
            bold: !0
        }, L3(A))),
        value: A
    }
}
// @from(Ln 455590, Col 4)
NP
// @from(Ln 455590, Col 8)
Hv6
// @from(Ln 455591, Col 4)
D0q = v(() => {
    i1();
    m1();
    Bq();
    wY();
    x2();
    wq();
    WQA();
    NP = o(X1(), 1), Hv6 = o(X1(), 1)
})
// @from(Ln 455602, Col 0)
function M0q({
    onSelect: A,
    onCancel: q,
    isEmbedded: K = !1
}) {
    let {
        rows: Y
    } = Z8(), [z, w] = WK.useState([]), [H, $] = WK.useState(null), [O, _] = WK.useState(!0), [J, X] = WK.useState(null), [D, j] = WK.useState(!1), [M, P] = WK.useState(!1), [W, G] = WK.useState(1), f = RK("confirm:no", "Confirmation", "Esc"), Z = WK.useCallback(async () => {
        try {
            _(!0), X(null);
            let U = await AI();
            $(U), h(`Current repository: ${U||"not detected"}`);
            let x = await uI4(),
                p = x;
            if (U) p = x.filter((r) => {
                if (!r.repo) return !1;
                return `${r.repo.owner.login}/${r.repo.name}` === U
            }), h(`Filtered ${p.length} sessions for repo ${U} from ${x.length} total`);
            let l = [...p].sort((r, s) => {
                let O1 = new Date(r.updated_at);
                return new Date(s.updated_at).getTime() - O1.getTime()
            });
            w(l)
        } catch (U) {
            let x = U instanceof Error ? U.message : String(U);
            h(`Error loading code sessions: ${x}`), X(s$z(x))
        } finally {
            _(!1), j(!1)
        }
    }, []), N = () => {
        j(!0), Z()
    };
    DA("confirm:no", q, {
        context: "Confirmation"
    }), D8((U, x) => {
        if (x.ctrl && U === "c") {
            q();
            return
        }
        if (x.ctrl && U === "r" && J) {
            N();
            return
        }
        if (J !== null && x.return) {
            q();
            return
        }
    });
    let T = WK.useCallback(() => {
        P(!0), Z()
    }, [P, Z]);
    if (!M) return WK.default.createElement(UW6, {
        onComplete: T
    });
    if (O) return WK.default.createElement(I, {
        flexDirection: "column",
        padding: 1
    }, WK.default.createElement(I, {
        flexDirection: "row"
    }, WK.default.createElement(c4, null), WK.default.createElement(V, {
        bold: !0
    }, "Loading Claude Code sessions…")), WK.default.createElement(V, {
        dimColor: !0
    }, D ? "Retrying…" : "Fetching your Claude Code sessions…"));
    if (J) return WK.default.createElement(I, {
        flexDirection: "column",
        padding: 1
    }, WK.default.createElement(V, {
        bold: !0,
        color: "error"
    }, "Error loading Claude Code sessions"), t$z(J), WK.default.createElement(V, {
        dimColor: !0
    }, "Press ", WK.default.createElement(V, {
        bold: !0
    }, "Ctrl+R"), " to retry · Press", " ", WK.default.createElement(V, {
        bold: !0
    }, f), " to cancel"));
    if (z.length === 0) return WK.default.createElement(I, {
        flexDirection: "column",
        padding: 1
    }, WK.default.createElement(V, {
        bold: !0
    }, "No Claude Code sessions found", H && WK.default.createElement(V, null, " for ", H)), WK.default.createElement(I, {
        marginTop: 1
    }, WK.default.createElement(V, {
        dimColor: !0
    }, "Press ", WK.default.createElement(V, {
        bold: !0
    }, f), " to cancel")));
    let k = z.map((U) => ({
            ...U,
            timeString: yq6(new Date(U.updated_at))
        })),
        y = Math.max(j0q.length, ...k.map((U) => U.timeString.length)),
        B = k.map(({
            timeString: U,
            title: x,
            id: p
        }) => {
            return {
                label: `${U.padEnd(y," ")}  ${x}`,
                value: p
            }
        }),
        S = 7,
        m = Math.max(1, K ? Math.min(z.length, 5, Y - 6 - S) : Math.min(z.length, Y - 1 - S)),
        b = m + S,
        g = z.length > m;
    return WK.default.createElement(I, {
        flexDirection: "column",
        padding: 1,
        height: b
    }, WK.default.createElement(V, {
        bold: !0
    }, "Select a session to resume", g && WK.default.createElement(V, {
        dimColor: !0
    }, " ", "(", W, " of ", z.length, ")"), H && WK.default.createElement(V, {
        dimColor: !0
    }, " (", H, ")"), ":"), WK.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1,
        flexGrow: 1
    }, WK.default.createElement(I, {
        marginLeft: 2
    }, WK.default.createElement(V, {
        bold: !0
    }, j0q.padEnd(y, " "), a$z, "Session Title")), WK.default.createElement(kA, {
        visibleOptionCount: m,
        options: B,
        onChange: (U) => {
            let x = z.find((p) => p.id === U);
            if (x) A(x)
        },
        onFocus: (U) => {
            let x = B.findIndex((p) => p.value === U);
            if (x >= 0) G(x + 1)
        }
    })), WK.default.createElement(I, {
        flexDirection: "row"
    }, WK.default.createElement(V, {
        dimColor: !0
    }, WK.default.createElement(oA, null, WK.default.createElement(YA, {
        shortcut: "↑/↓",
        action: "select"
    }), WK.default.createElement(YA, {
        shortcut: "Enter",
        action: "confirm"
    }), WK.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))))
}
// @from(Ln 455757, Col 0)
function s$z(A) {
    let q = A.toLowerCase();
    if (q.includes("fetch") || q.includes("network") || q.includes("timeout")) return "network";
    if (q.includes("auth") || q.includes("token") || q.includes("permission") || q.includes("oauth") || q.includes("not authenticated") || q.includes("/login") || q.includes("console account") || q.includes("403")) return "auth";
    if (q.includes("api") || q.includes("rate limit") || q.includes("500") || q.includes("529")) return "api";
    return "other"
}
// @from(Ln 455765, Col 0)
function t$z(A) {
    switch (A) {
        case "network":
            return WK.default.createElement(I, {
                marginY: 1,
                flexDirection: "column"
            }, WK.default.createElement(V, {
                dimColor: !0
            }, "Check your internet connection"));
        case "auth":
            return WK.default.createElement(I, {
                marginY: 1,
                flexDirection: "column"
            }, WK.default.createElement(V, {
                dimColor: !0
            }, "Teleport requires a Claude account"), WK.default.createElement(V, {
                dimColor: !0
            }, "Run ", WK.default.createElement(V, {
                bold: !0
            }, "/login"), ' and select "Claude account with subscription"'));
        case "api":
            return WK.default.createElement(I, {
                marginY: 1,
                flexDirection: "column"
            }, WK.default.createElement(V, {
                dimColor: !0
            }, "Sorry, Claude encountered an error"));
        case "other":
            return WK.default.createElement(I, {
                marginY: 1,
                flexDirection: "row"
            }, WK.default.createElement(V, {
                dimColor: !0
            }, "Sorry, Claude Code encountered an error"))
    }
}
// @from(Ln 455801, Col 4)
WK
// @from(Ln 455801, Col 8)
j0q = "Updated"
// @from(Ln 455802, Col 4)
a$z = "  "
// @from(Ln 455803, Col 4)
P0q = v(() => {
    m1();
    K7();
    wY();
    x2();
    mq();
    Z6();
    WyA();
    vq();
    t31();
    UR();
    wK();
    BK();
    s2();
    HK();
    WK = o(X1(), 1)
})
// @from(Ln 455821, Col 0)
function W0q(A) {
    let q = e(8),
        [K, Y] = $v6.useState(!1),
        [z, w] = $v6.useState(null),
        [H, $] = $v6.useState(null),
        O;
    if (q[0] !== A) O = async (j) => {
        Y(!0), w(null), $(j), c("tengu_teleport_resume_session", {
            source: A,
            session_id: j.id
        });
        try {
            let M = await Ct(j.id);
            return jN1({
                sessionId: j.id
            }), Y(!1), M
        } catch (M) {
            let P = M,
                W = {
                    message: P instanceof vD ? P.message : P instanceof Error ? P.message : String(P),
                    formattedMessage: P instanceof vD ? P.formattedMessage : void 0,
                    isOperationError: P instanceof vD
                };
            return w(W), Y(!1), null
        }
    }, q[0] = A, q[1] = O;
    else O = q[1];
    let _ = O,
        J;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) J = () => {
        w(null)
    }, q[2] = J;
    else J = q[2];
    let X = J,
        D;
    if (q[3] !== z || q[4] !== K || q[5] !== _ || q[6] !== H) D = {
        resumeSession: _,
        isResuming: K,
        error: z,
        selectedSession: H,
        clearError: X
    }, q[3] = z, q[4] = K, q[5] = _, q[6] = H, q[7] = D;
    else D = q[7];
    return D
}
// @from(Ln 455866, Col 4)
$v6
// @from(Ln 455867, Col 4)
G0q = v(() => {
    i1();
    Im();
    qH();
    u6();
    B6();
    $v6 = o(X1(), 1)
})
// @from(Ln 455876, Col 0)
function f0q(A) {
    let q = e(25),
        {
            onComplete: K,
            onCancel: Y,
            onError: z,
            isEmbedded: w,
            source: H
        } = A,
        $ = w === void 0 ? !1 : w,
        {
            resumeSession: O,
            isResuming: _,
            error: J,
            selectedSession: X
        } = W0q(H),
        D, j;
    if (q[0] !== H) D = () => {
        c("tengu_teleport_started", {
            source: H
        })
    }, j = [H], q[0] = H, q[1] = D, q[2] = j;
    else D = q[1], j = q[2];
    Z0q.useEffect(D, j);
    let M;
    if (q[3] !== J || q[4] !== K || q[5] !== z || q[6] !== O) M = async (T) => {
        let k = await O(T);
        if (k) K(k);
        else if (J) {
            if (z) z(J.message, J.formattedMessage)
        }
    }, q[3] = J, q[4] = K, q[5] = z, q[6] = O, q[7] = M;
    else M = q[7];
    let P = M,
        W;
    if (q[8] !== Y) W = () => {
        c("tengu_teleport_cancelled", {}), Y()
    }, q[8] = Y, q[9] = W;
    else W = q[9];
    let G = W,
        f = !!J && !z,
        Z;
    if (q[10] !== f) Z = {
        context: "Global",
        isActive: f
    }, q[10] = f, q[11] = Z;
    else Z = q[11];
    if (DA("app:interrupt", G, Z), _ && X) {
        let T;
        if (q[12] === Symbol.for("react.memo_cache_sentinel")) T = CE.default.createElement(I, {
            flexDirection: "row"
        }, CE.default.createElement(c4, null), CE.default.createElement(V, {
            bold: !0
        }, "Resuming session…")), q[12] = T;
        else T = q[12];
        let k;
        if (q[13] !== X.title) k = CE.default.createElement(I, {
            flexDirection: "column",
            padding: 1
        }, T, CE.default.createElement(V, {
            dimColor: !0
        }, 'Loading "', X.title, '"…')), q[13] = X.title, q[14] = k;
        else k = q[14];
        return k
    }
    if (J && !z) {
        let T;
        if (q[15] === Symbol.for("react.memo_cache_sentinel")) T = CE.default.createElement(V, {
            bold: !0,
            color: "error"
        }, "Failed to resume session"), q[15] = T;
        else T = q[15];
        let k;
        if (q[16] !== J.message) k = CE.default.createElement(V, {
            dimColor: !0
        }, J.message), q[16] = J.message, q[17] = k;
        else k = q[17];
        let y;
        if (q[18] === Symbol.for("react.memo_cache_sentinel")) y = CE.default.createElement(I, {
            marginTop: 1
        }, CE.default.createElement(V, {
            dimColor: !0
        }, "Press ", CE.default.createElement(V, {
            bold: !0
        }, "Esc"), " to cancel")), q[18] = y;
        else y = q[18];
        let B;
        if (q[19] !== k) B = CE.default.createElement(I, {
            flexDirection: "column",
            padding: 1
        }, T, k, y), q[19] = k, q[20] = B;
        else B = q[20];
        return B
    }
    let N;
    if (q[21] !== G || q[22] !== P || q[23] !== $) N = CE.default.createElement(M0q, {
        onSelect: P,
        onCancel: G,
        isEmbedded: $
    }), q[21] = G, q[22] = P, q[23] = $, q[24] = N;
    else N = q[24];
    return N
}
// @from(Ln 455979, Col 4)
CE
// @from(Ln 455979, Col 8)
Z0q
// @from(Ln 455980, Col 4)
V0q = v(() => {
    i1();
    m1();
    K7();
    P0q();
    x2();
    G0q();
    u6();
    CE = o(X1(), 1), Z0q = o(X1(), 1)
})
// @from(Ln 455997, Col 0)
class ZQA {
    server = null;
    secret;
    port = null;
    mcpClients;
    availableTools;
    resources;
    constructor(A, q) {
        this.mcpClients = A, this.availableTools = q || [], this.resources = {}, this.secret = AOz(32).toString("hex")
    }
    async start() {
        if (this.server) throw Error("MCP CLI endpoint already started");
        return new Promise((A, q) => {
            this.server = e$z((K, Y) => {
                this.handleRequest(K, Y)
            }), this.server.on("error", (K) => {
                K1(K), q(K)
            }), this.server.listen(0, "127.0.0.1", () => {
                let K = this.server.address();
                if (!K || typeof K === "string") {
                    q(Error("Failed to get server address"));
                    return
                }
                this.port = K.port;
                let Y = `http://127.0.0.1:${this.port}`;
                h(`[MCP CLI Endpoint] Started on ${Y}`), A({
                    port: this.port,
                    url: Y
                })
            })
        })
    }
    getSecret() {
        return this.secret
    }
    async handleRequest(A, q) {
        if (A.setTimeout(30000), A.on("timeout", () => {
                h("[MCP CLI Endpoint] Request timeout"), q.writeHead(408, {
                    "Content-Type": "application/json"
                }), q.end(Q1({
                    error: "Request Timeout"
                }))
            }), A.method !== "POST" || A.url !== "/mcp") {
            q.writeHead(404, {
                "Content-Type": "application/json"
            }), q.end(Q1({
                error: "Not Found"
            }));
            return
        }
        let K = A.headers.authorization;
        if (!K?.startsWith("Bearer ")) {
            q.writeHead(403, {
                "Content-Type": "application/json"
            }), q.end(Q1({
                error: "Forbidden"
            }));
            return
        }
        let Y = K.slice(7);
        if (!this.validateSecret(Y)) {
            q.writeHead(403, {
                "Content-Type": "application/json"
            }), q.end(Q1({
                error: "Forbidden"
            }));
            return
        }
        let z = 10485760,
            w = 0,
            H = "";
        A.on("data", ($) => {
            if (w += $.length, w > z) {
                h(`[MCP CLI Endpoint] Request too large: ${w} bytes`), q.writeHead(413, {
                    "Content-Type": "application/json"
                }), q.end(Q1({
                    error: "Payload Too Large"
                })), A.destroy();
                return
            }
            H += $.toString()
        }), A.on("end", async () => {
            try {
                let $ = _A(H),
                    O = hXq.parse($),
                    _ = await this.handleCommand(O);
                q.writeHead(200, {
                    "Content-Type": "application/json"
                }), q.end(Q1(_))
            } catch ($) {
                let O = 500;
                if ($ instanceof SyntaxError) O = 400;
                else if ($ && typeof $ === "object" && "name" in $) {
                    if ($.name === "ZodError") O = 400
                }
                q.writeHead(O, {
                    "Content-Type": "application/json"
                }), q.end(Q1({
                    error: $ instanceof Error ? $.message : "Unknown error",
                    type: $ instanceof Error ? $.constructor.name : "Error"
                })), K1($ instanceof Error ? $ : Error(String($)))
            }
        }), A.on("error", ($) => {
            if (K1($), !q.headersSent) q.writeHead(500, {
                "Content-Type": "application/json"
            }), q.end(Q1({
                error: "Internal Server Error"
            }))
        })
    }
    validateSecret(A) {
        try {
            let q = Buffer.from(A),
                K = Buffer.from(this.secret);
            if (q.length !== K.length) return !1;
            return qOz(q, K)
        } catch {
            return !1
        }
    }
    async handleCommand(A) {
        let q = Date.now(),
            K = A.command === "call" ? `mcp__${A.params.server}__${A.params.tool}` : void 0,
            Y, z;
        if (A.command === "call") {
            let w = Jf1(this.mcpClients, A.params.server, this.getNormalizedNames());
            if (w?.type === "connected") Y = U_(w.config), z = w.config.type ?? "stdio"
        }
        try {
            let {
                data: w,
                metadata: H
            } = await this.executeCommand(A), $ = Date.now() - q;
            if (A.command === "call") c("tengu_tool_use_success", {
                toolName: AK(K ?? ""),
                isMcp: !0,
                durationMs: $,
                ...z ? {
                    mcpServerType: z
                } : {},
                ...Y ? {
                    mcpServerBaseUrl: Y
                } : {}
            });
            return c("tengu_mcp_cli_command_executed", {
                command: A.command,
                success: !0,
                duration_ms: $,
                ...H
            }), w
        } catch (w) {
            let H = w instanceof Error ? w : Error(String(w)),
                $ = Date.now() - q,
                O = String(w).slice(0, 2000);
            if (A.command === "call") c("tengu_tool_use_error", {
                toolName: AK(K ?? ""),
                isMcp: !0,
                error: O,
                durationMs: $,
                ...z ? {
                    mcpServerType: z
                } : {},
                ...Y ? {
                    mcpServerBaseUrl: Y
                } : {}
            });
            throw c("tengu_mcp_cli_command_executed", {
                command: A.command,
                success: !1,
                error_type: A.command === "call" ? "tool_execution_failed" : H.constructor,
                duration_ms: Date.now() - q
            }), w
        }
    }
    async executeCommand(A) {
        switch (A.command) {
            case "servers": {
                let q = pT6(this.mcpClients);
                return {
                    data: q,
                    metadata: {
                        server_count: q.length
                    }
                }
            }
            case "tools": {
                let q = dT6(this.availableTools, A.params);
                return {
                    data: q,
                    metadata: {
                        tool_count: q.length,
                        filtered: !!A.params?.server
                    }
                }
            }
            case "info": {
                let q = await cT6(this.availableTools, A.params);
                if (!q) {
                    let K = Jf1(this.mcpClients, A.params.server, this.getNormalizedNames()),
                        Y = YY1(A.params.server, K?.type);
                    if (Y) throw Y;
                    throw new GQA(`Tool '${A.params.toolName}' not found on server '${A.params.server}'`)
                }
                return {
                    data: q,
                    metadata: {
                        tool_found: !0
                    }
                }
            }
            case "grep": {
                let q = lT6(this.availableTools, A.params);
                return {
                    data: q,
                    metadata: {
                        match_count: q.length
                    }
                }
            }
            case "resources": {
                let q = iT6(this.resources, A.params, this.getNormalizedNames());
                return {
                    data: q,
                    metadata: {
                        resource_count: q.length,
                        filtered: !!A.params?.server
                    }
                }
            }
            case "call": {
                let {
                    server: q,
                    tool: K
                } = A.params;
                return {
                    data: await this.callTool(A.params),
                    metadata: {
                        tool_name: `mcp__${q}__${K}`
                    }
                }
            }
            case "read":
                return {
                    data: await this.readResource(A.params), metadata: {
                        server: A.params.server
                    }
                };
            default: {
                let q = A;
                throw Error("Unknown command")
            }
        }
    }
    getConnectedClient(A) {
        let q = Jf1(this.mcpClients, A, this.getNormalizedNames()),
            K = YY1(A, q?.type);
        if (K) throw K;
        return q
    }
    async callTool({
        server: A,
        tool: q,
        args: K,
        timeoutMs: Y
    }) {
        let z = this.getConnectedClient(A),
            w = `mcp__${A}__${q}`,
            H = this.availableTools.find((_) => _.name === w);
        if (this.availableTools.length > 0 && !H) throw new GQA(`Tool '${q}' not found on server '${A}'`);
        let $ = H?.originalMcpToolName || q;
        return await z.client.request({
            method: "tools/call",
            params: {
                name: $,
                arguments: K
            }
        }, ZZ, Y ? {
            signal: AbortSignal.timeout(Y)
        } : void 0)
    }
    async readResource({
        server: A,
        uri: q,
        timeoutMs: K
    }) {
        return await this.getConnectedClient(A).client.readResource({
            uri: q
        }, K ? {
            signal: AbortSignal.timeout(K)
        } : void 0)
    }
    async stop() {
        if (!this.server) return;
        return new Promise((A, q) => {
            this.server.close((K) => {
                if (K) q(K);
                else h("[MCP CLI Endpoint] Stopped"), this.server = null, this.port = null, A()
            })
        })
    }
    updateClients(A) {
        this.mcpClients = A
    }
    updateTools(A) {
        this.availableTools = A
    }
    updateResources(A) {
        this.resources = A
    }
    getNormalizedNames() {
        let A = {};
        for (let q of this.mcpClients) A[P5(q.name)] = q.name;
        return A
    }
}
// @from(Ln 456312, Col 4)
GQA
// @from(Ln 456313, Col 4)
N0q = v(() => {
    gD();
    CFA();
    SFA();
    hFA();
    IFA();
    xFA();
    tX();
    Z6();
    y6();
    u6();
    U$();
    bFA();
    m6();
    GQA = class GQA extends Error {
        constructor(A) {
            super(A);
            this.name = "ToolNotFoundError"
        }
    }
})
// @from(Ln 456335, Col 0)
function T0q() {
    let A = f6();
    if (A.autoUpdates !== !1 || A.autoUpdatesProtectedForNative === !0) return;
    try {
        let q = y7("userSettings") || {};
        Z7("userSettings", {
            ...q,
            env: {
                ...q.env,
                DISABLE_AUTOUPDATER: "1"
            }
        }), c("tengu_migrate_autoupdates_to_settings", {
            was_user_preference: !0,
            already_had_env_var: !!q.env?.DISABLE_AUTOUPDATER
        }), process.env.DISABLE_AUTOUPDATER = "1", jA((K) => {
            let {
                autoUpdates: Y,
                autoUpdatesProtectedForNative: z,
                ...w
            } = K;
            return w
        })
    } catch (q) {
        K1(Error(`Failed to migrate auto-updates: ${q}`)), c("tengu_migrate_autoupdates_error", {
            has_error: !0
        })
    }
}
// @from(Ln 456363, Col 4)
v0q = v(() => {
    cA();
    p8();
    u6();
    y6()
})
// @from(Ln 456370, Col 0)
function E0q() {
    let A = sz(),
        q = A.enableAllProjectMcpServers !== void 0,
        K = A.enabledMcpjsonServers && A.enabledMcpjsonServers.length > 0,
        Y = A.disabledMcpjsonServers && A.disabledMcpjsonServers.length > 0;
    if (!q && !K && !Y) return;
    try {
        let z = y7("localSettings") || {},
            w = {},
            H = [];
        if (q && z.enableAllProjectMcpServers === void 0) w.enableAllProjectMcpServers = A.enableAllProjectMcpServers, H.push("enableAllProjectMcpServers");
        else if (q) H.push("enableAllProjectMcpServers");
        if (K && A.enabledMcpjsonServers) {
            let $ = z.enabledMcpjsonServers || [];
            w.enabledMcpjsonServers = [...new Set([...$, ...A.enabledMcpjsonServers])], H.push("enabledMcpjsonServers")
        }
        if (Y && A.disabledMcpjsonServers) {
            let $ = z.disabledMcpjsonServers || [];
            w.disabledMcpjsonServers = [...new Set([...$, ...A.disabledMcpjsonServers])], H.push("disabledMcpjsonServers")
        }
        if (Object.keys(w).length > 0) Z7("localSettings", w);
        if (H.includes("enableAllProjectMcpServers") || H.includes("enabledMcpjsonServers") || H.includes("disabledMcpjsonServers")) iH(($) => {
            let {
                enableAllProjectMcpServers: O,
                enabledMcpjsonServers: _,
                disabledMcpjsonServers: J,
                ...X
            } = $;
            return X
        });
        c("tengu_migrate_mcp_approval_fields_success", {
            migratedCount: H.length
        })
    } catch {
        c("tengu_migrate_mcp_approval_fields_error", {})
    }
}
// @from(Ln 456407, Col 4)
k0q = v(() => {
    cA();
    p8();
    u6()
})
// @from(Ln 456412, Col 4)
L0q = v(() => {
    p8()
})
// @from(Ln 456419, Col 0)
function R0q() {
    let q = sz().ignorePatterns;
    if (!q || !Array.isArray(q) || q.length === 0) return;
    let K = [];
    for (let w of q) {
        let H = p76(w);
        if (KOz.isAbsolute(H) && !H.startsWith("//")) H = "/" + H;
        K.push({
            toolName: "Read",
            ruleContent: H
        }, {
            toolName: "Edit",
            ruleContent: H
        })
    }
    if (g76({
            ruleValues: K,
            ruleBehavior: "deny"
        }, "localSettings")) try {
        iH((w) => {
            let {
                ignorePatterns: H,
                ...$
            } = w;
            return $
        }), c("tengu_migrate_ignore_patterns_success", {
            ignore_patterns_count: q.length
        })
    } catch (w) {
        K1(Error(`Failed to remove ignorePatterns from config: ${w instanceof Error?w.message:String(w)}`)), c("tengu_migrate_ignore_patterns_config_cleanup_error", {
            ignore_patterns_count: q.length
        })
    } else K1(Error("Failed to migrate ignorePatterns to settings permissions")), c("tengu_migrate_ignore_patterns_error", {
        ignore_patterns_count: q.length
    })
}
// @from(Ln 456455, Col 4)
y0q = v(() => {
    cA();
    u6();
    y6();
    E2();
    KL()
})
// @from(Ln 456463, Col 0)
function C0q() {
    if (f6().opusProMigrationComplete) return;
    if (E4() !== "firstParty" || !DC1()) {
        jA((Y) => ({
            ...Y,
            opusProMigrationComplete: !0
        }));
        return
    }
    if (C8()?.model === void 0) {
        let Y = Date.now();
        jA((z) => ({
            ...z,
            opusProMigrationComplete: !0,
            opusProMigrationTimestamp: Y
        }))
    } else jA((Y) => ({
        ...Y,
        opusProMigrationComplete: !0
    }))
}
// @from(Ln 456484, Col 4)
S0q = v(() => {
    cA();
    p8();
    UH();
    e7()
})
// @from(Ln 456494, Col 0)
function $Oz(A) {
    if (typeof A !== "object" || A === null || !("type" in A)) return !1;
    let q = A.type;
    return typeof q === "string" && HOz.has(q)
}
// @from(Ln 456499, Col 0)
class fQA {
    sessionId;
    orgUuid;
    accessToken;
    callbacks;
    ws = null;
    state = "closed";
    reconnectAttempts = 0;
    pingInterval = null;
    reconnectTimer = null;
    constructor(A, q, K, Y) {
        this.sessionId = A;
        this.orgUuid = q;
        this.accessToken = K;
        this.callbacks = Y
    }
    async connect() {
        if (this.state === "connecting") {
            h("[SessionsWebSocket] Already connecting");
            return
        }
        this.state = "connecting";
        let q = `${P4().BASE_API_URL.replace("https://","wss://")}/v1/sessions/ws/${this.sessionId}/subscribe?organization_uuid=${this.orgUuid}`;
        h(`[SessionsWebSocket] Connecting to ${q}`);
        let K = {
            Authorization: `Bearer ${this.accessToken}`,
            "anthropic-version": "2023-06-01"
        };
        if (typeof Bun < "u") {
            let Y = new globalThis.WebSocket(q, {
                headers: K,
                proxy: H81(q)
            });
            this.ws = Y, Y.addEventListener("open", () => {
                h("[SessionsWebSocket] Connection opened, authenticated via headers"), this.state = "connected", this.reconnectAttempts = 0, this.startPingInterval(), this.callbacks.onConnected?.()
            }), Y.addEventListener("message", (z) => {
                let w = typeof z.data === "string" ? z.data : String(z.data);
                this.handleMessage(w)
            }), Y.addEventListener("error", () => {
                let z = Error("[SessionsWebSocket] WebSocket error");
                K1(z), this.callbacks.onError?.(z)
            }), Y.addEventListener("close", (z) => {
                h(`[SessionsWebSocket] Closed: code=${z.code} reason=${z.reason}`), this.handleClose()
            })
        } else {
            let {
                default: Y
            } = await Promise.resolve().then(() => (zU1(), nG6)), z = new Y(q, {
                headers: K,
                agent: w81(q)
            });
            this.ws = z, z.on("open", () => {
                h("[SessionsWebSocket] Connection opened, authenticated via headers"), this.state = "connected", this.reconnectAttempts = 0, this.startPingInterval(), this.callbacks.onConnected?.()
            }), z.on("message", (w) => {
                this.handleMessage(w.toString())
            }), z.on("error", (w) => {
                K1(Error(`[SessionsWebSocket] Error: ${w.message}`)), this.callbacks.onError?.(w)
            }), z.on("close", (w, H) => {
                h(`[SessionsWebSocket] Closed: code=${w} reason=${H.toString()}`), this.handleClose()
            }), z.on("pong", () => {
                h("[SessionsWebSocket] Pong received")
            })
        }
    }
    handleMessage(A) {
        try {
            let q = _A(A);
            if ($Oz(q)) this.callbacks.onMessage(q);
            else h(`[SessionsWebSocket] Ignoring message type: ${typeof q==="object"&&q!==null&&"type"in q?String(q.type):"unknown"}`)
        } catch (q) {
            K1(Error(`[SessionsWebSocket] Failed to parse message: ${q instanceof Error?q.message:String(q)}`))
        }
    }
    handleClose() {
        if (this.stopPingInterval(), this.state === "closed") return;
        this.ws = null;
        let A = this.state;
        if (this.state = "closed", A === "connected" && this.reconnectAttempts < h0q) this.reconnectAttempts++, h(`[SessionsWebSocket] Scheduling reconnect (attempt ${this.reconnectAttempts}/${h0q})`), this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null, this.connect()
        }, zOz);
        else h("[SessionsWebSocket] Not reconnecting"), this.callbacks.onClose?.()
    }
    startPingInterval() {
        if (this.stopPingInterval(), typeof Bun < "u") return;
        this.pingInterval = setInterval(() => {
            if (this.ws && this.state === "connected") try {
                this.ws.ping()
            } catch {}
        }, wOz)
    }
    stopPingInterval() {
        if (this.pingInterval) clearInterval(this.pingInterval), this.pingInterval = null
    }
    sendControlResponse(A) {
        if (!this.ws || this.state !== "connected") {
            K1(Error("[SessionsWebSocket] Cannot send: not connected"));
            return
        }
        h("[SessionsWebSocket] Sending control response"), this.ws.send(Q1(A))
    }
    sendControlRequest(A) {
        if (!this.ws || this.state !== "connected") {
            K1(Error("[SessionsWebSocket] Cannot send: not connected"));
            return
        }
        let q = {
            type: "control_request",
            request_id: YOz(),
            request: A
        };
        h(`[SessionsWebSocket] Sending control request: ${A.subtype}`), this.ws.send(Q1(q))
    }
    isConnected() {
        return this.state === "connected"
    }
    close() {
        if (h("[SessionsWebSocket] Closing connection"), this.state = "closed", this.stopPingInterval(), this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
        if (this.ws) this.ws.close(), this.ws = null
    }
    reconnect() {
        h("[SessionsWebSocket] Force reconnecting"), this.reconnectAttempts = 0, this.close(), this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null, this.connect()
        }, 500)
    }
}
// @from(Ln 456624, Col 4)
zOz = 2000
// @from(Ln 456625, Col 4)
h0q = 5
// @from(Ln 456626, Col 4)
wOz = 30000
// @from(Ln 456627, Col 4)
HOz
// @from(Ln 456628, Col 4)
I0q = v(() => {
    Z6();
    y6();
    bb();
    Uz();
    m6();
    HOz = new Set(["assistant", "user", "result", "stream_event", "system", "control_request", "control_response", "tool_progress", "auth_status"])
})
// @from(Ln 456637, Col 0)
function OOz(A) {
    return A.type !== "control_request" && A.type !== "control_response"
}
// @from(Ln 456640, Col 0)
class VQA {
    config;
    callbacks;
    websocket = null;
    pendingPermissionRequests = new Map;
    constructor(A, q) {
        this.config = A;
        this.callbacks = q
    }
    connect() {
        h(`[RemoteSessionManager] Connecting to session ${this.config.sessionId}`);
        let A = {
            onMessage: (q) => this.handleMessage(q),
            onConnected: () => {
                h("[RemoteSessionManager] Connected"), this.callbacks.onConnected?.()
            },
            onClose: () => {
                h("[RemoteSessionManager] Disconnected"), this.callbacks.onDisconnected?.()
            },
            onError: (q) => {
                K1(q), this.callbacks.onError?.(q)
            }
        };
        this.websocket = new fQA(this.config.sessionId, this.config.orgUuid, this.config.accessToken, A), this.websocket.connect()
    }
    handleMessage(A) {
        if (A.type === "control_request") {
            this.handleControlRequest(A);
            return
        }
        if (A.type === "control_response") {
            h("[RemoteSessionManager] Received control response");
            return
        }
        if (OOz(A)) this.callbacks.onMessage(A)
    }
    handleControlRequest(A) {
        let {
            request_id: q,
            request: K
        } = A;
        if (K.subtype === "can_use_tool") h(`[RemoteSessionManager] Permission request for tool: ${K.tool_name}`), this.pendingPermissionRequests.set(q, K), this.callbacks.onPermissionRequest(K, q);
        else h(`[RemoteSessionManager] Ignoring control request: ${K.subtype}`)
    }
    async sendMessage(A) {
        h(`[RemoteSessionManager] Sending message to session ${this.config.sessionId}`);
        let q = await JM6(this.config.sessionId, A);
        if (!q) K1(Error(`[RemoteSessionManager] Failed to send message to session ${this.config.sessionId}`));
        return q
    }
    respondToPermissionRequest(A, q) {
        if (!this.pendingPermissionRequests.get(A)) {
            K1(Error(`[RemoteSessionManager] No pending permission request with ID: ${A}`));
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
        h(`[RemoteSessionManager] Sending permission response: ${q.behavior}`), this.websocket?.sendControlResponse(Y)
    }
    isConnected() {
        return this.websocket?.isConnected() ?? !1
    }
    cancelSession() {
        h("[RemoteSessionManager] Sending interrupt signal"), this.websocket?.sendControlRequest({
            subtype: "interrupt"
        })
    }
    getSessionId() {
        return this.config.sessionId
    }
    disconnect() {
        h("[RemoteSessionManager] Disconnecting"), this.websocket?.close(), this.websocket = null, this.pendingPermissionRequests.clear()
    }
    reconnect() {
        h("[RemoteSessionManager] Reconnecting WebSocket"), this.websocket?.reconnect()
    }
}
// @from(Ln 456732, Col 0)
function x0q(A, q, K, Y = !1) {
    return {
        sessionId: A,
        accessToken: q,
        orgUuid: K,
        hasInitialPrompt: Y
    }
}
// @from(Ln 456740, Col 4)
NQA = v(() => {
    Z6();
    y6();
    I0q();
    UR()
})
// @from(Ln 456747, Col 0)
function b0q(A, q) {
    let [K, Y] = Ov6.useState(!1);
    return Ov6.useEffect(() => {
        Y(!1);
        let z = setTimeout(() => {
            Y(!0)
        }, A);
        return () => clearTimeout(z)
    }, [A, q]), K
}
// @from(Ln 456757, Col 4)
Ov6
// @from(Ln 456758, Col 4)
u0q = v(() => {
    Ov6 = o(X1(), 1)
})
// @from(Ln 456761, Col 0)
async function _Oz() {
    try {
        let A = ["https://api.anthropic.com/api/hello", "https://platform.claude.com/v1/oauth/hello"],
            q = async (z) => {
                try {
                    let w = await sA.get(z, {
                        headers: {
                            "User-Agent": Jr()
                        }
                    });
                    if (w.status !== 200) return {
                        success: !1,
                        error: `Failed to connect to ${new URL(z).hostname}: Status ${w.status}`
                    };
                    return {
                        success: !0
                    }
                } catch (w) {
                    return {
                        success: !1,
                        error: `Failed to connect to ${new URL(z).hostname}: ${w instanceof Error?w.code||w.message:String(w)}`
                    }
                }
            }, Y = (await Promise.all(A.map(q))).find((z) => !z.success);
        if (Y) c("tengu_preflight_check_failed", {
            isConnectivityError: !1,
            hasErrorMessage: !!Y.error
        });
        return Y || {
            success: !0
        }
    } catch (A) {
        return K1(A), c("tengu_preflight_check_failed", {
            isConnectivityError: !0
        }), {
            success: !1,
            error: `Connectivity check error: ${A instanceof Error?A.code||A.message:String(A)}`
        }
    }
}