
// @from(Ln 506171, Col 0)
function ZBq(A) {
    let q = A6(4),
        {
            mcpClients: K
        } = A,
        Y = K === void 0 ? LTz : K,
        {
            addNotification: z
        } = o4(),
        _, w;
    if (q[0] !== z || q[1] !== Y) _ = () => {
        if (t4()) return;
        let O = Y.filter(CTz),
            $ = Y.filter(STz),
            H = Y.filter(hTz),
            j = Y.filter(RTz);
        if (O.length === 0 && $.length === 0 && H.length === 0 && j.length === 0) return;
        if (O.length > 0) z({
            key: "mcp-failed",
            jsx: QY.createElement(QY.Fragment, null, QY.createElement(T, {
                color: "error"
            }, O.length, " MCP", " ", O.length === 1 ? "server" : "servers", " failed"), QY.createElement(T, {
                dimColor: !0
            }, " · /mcp")),
            priority: "medium"
        });
        if ($.length > 0) z({
            key: "mcp-claudeai-failed",
            jsx: QY.createElement(QY.Fragment, null, QY.createElement(T, {
                color: "error"
            }, $.length, " claude.ai", " ", $.length === 1 ? "connector" : "connectors", " ", "unavailable"), QY.createElement(T, {
                dimColor: !0
            }, " · /mcp")),
            priority: "medium"
        });
        if (H.length > 0) z({
            key: "mcp-needs-auth",
            jsx: QY.createElement(QY.Fragment, null, QY.createElement(T, {
                color: "warning"
            }, H.length, " MCP", " ", H.length === 1 ? "server needs" : "servers need", " ", "auth"), QY.createElement(T, {
                dimColor: !0
            }, " · /mcp")),
            priority: "medium"
        });
        if (j.length > 0) z({
            key: "mcp-claudeai-needs-auth",
            jsx: QY.createElement(QY.Fragment, null, QY.createElement(T, {
                color: "warning"
            }, j.length, " claude.ai", " ", j.length === 1 ? "connector needs" : "connectors need", " ", "auth"), QY.createElement(T, {
                dimColor: !0
            }, " · /mcp")),
            priority: "medium"
        })
    }, w = [z, Y], q[0] = z, q[1] = Y, q[2] = _, q[3] = w;
    else _ = q[2], w = q[3];
    WBq.useEffect(_, w)
}
// @from(Ln 506229, Col 0)
function RTz(A) {
    return A.type === "needs-auth" && A.config.type === "claudeai-proxy" && PE8(A.name)
}
// @from(Ln 506233, Col 0)
function hTz(A) {
    return A.type === "needs-auth" && A.config.type !== "claudeai-proxy"
}
// @from(Ln 506237, Col 0)
function STz(A) {
    return A.type === "failed" && A.config.type === "claudeai-proxy" && PE8(A.name)
}
// @from(Ln 506241, Col 0)
function CTz(A) {
    return A.type === "failed" && A.config.type !== "sse-ide" && A.config.type !== "ws-ide" && A.config.type !== "claudeai-proxy"
}
// @from(Ln 506244, Col 4)
QY
// @from(Ln 506244, Col 8)
WBq
// @from(Ln 506244, Col 13)
LTz
// @from(Ln 506245, Col 4)
GBq = E(() => {
    e6();
    i6();
    T1();
    wz();
    $Z6();
    QY = t(P6(), 1), WBq = t(P6(), 1), LTz = []
})
// @from(Ln 506254, Col 0)
function fBq() {
    let {
        addNotification: A
    } = o4(), q = M1((_) => _.toolPermissionContext.mode), K = M1((_) => _.toolPermissionContext.isAutoModeAvailable), Y = ma6.useRef(!1), z = ma6.useRef(q);
    ma6.useEffect(() => {
        let _ = z.current;
        if (z.current = q, t4()) return;
        if (Y.current) return;
        if (!(q === "default" && _ !== "default" && _ !== "auto" && !K && s16())) return;
        let O = dn8();
        if (!O) return;
        Y.current = !0, A({
            key: "auto-mode-unavailable",
            text: qS1(O),
            color: "warning",
            priority: "medium"
        })
    }, [q, K, A])
}
// @from(Ln 506273, Col 4)
ma6
// @from(Ln 506274, Col 4)
TBq = E(() => {
    T1();
    wz();
    NA();
    i8();
    rJ();
    ma6 = t(P6(), 1)
})
// @from(Ln 506283, Col 0)
function vBq() {
    let A = A6(9),
        {
            addNotification: q
        } = o4(),
        K = xA(),
        [Y, z] = rZ.useState(!0),
        _;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) _ = new Set, A[0] = _;
    else _ = A[0];
    let w = rZ.useRef(_),
        O;
    if (A[1] !== q || A[2] !== K) O = (D, X) => {
        let P = `${D}:${X}`;
        if (w.current.has(P)) return;
        w.current.add(P), k(`LSP error: ${D} - ${X}`), K((Z) => {
            let G = new Set(Z.plugins.errors.map(bTz)),
                f = `generic-error:${D}:${X}`;
            if (G.has(f)) return Z;
            return {
                ...Z,
                plugins: {
                    ...Z.plugins,
                    errors: [...Z.plugins.errors, {
                        type: "generic-error",
                        source: D,
                        error: X
                    }]
                }
            }
        });
        let W = D.startsWith("plugin:") ? D.split(":")[1] ?? D : D;
        q({
            key: `lsp-error-${D}`,
            jsx: rZ.createElement(rZ.Fragment, null, rZ.createElement(T, {
                color: "error"
            }, "LSP for ", W, " failed"), rZ.createElement(T, {
                dimColor: !0
            }, " · /plugin for details")),
            priority: "medium",
            timeoutMs: 8000
        })
    }, A[1] = q, A[2] = K, A[3] = O;
    else O = A[3];
    let $ = O,
        H;
    if (A[4] !== $) H = () => {
        if (t4()) return;
        let D = qT6();
        if (D.status === "failed") {
            $("lsp-manager", D.error.message), z(!1);
            return
        }
        if (D.status === "pending" || D.status === "not-started") return;
        let X = vl();
        if (X) {
            let P = X.getAllServers();
            for (let [W, Z] of P)
                if (Z.state === "error" && Z.lastError) $(W, Z.lastError.message)
        }
    }, A[4] = $, A[5] = H;
    else H = A[5];
    let j = H;
    OX(j, Y ? ITz : null);
    let J, M;
    if (A[6] !== j) J = () => {
        if (t4()) return;
        j()
    }, M = [j], A[6] = j, A[7] = J, A[8] = M;
    else J = A[7], M = A[8];
    rZ.useEffect(J, M)
}
// @from(Ln 506356, Col 0)
function bTz(A) {
    if (A.type === "generic-error") return `generic-error:${A.source}:${A.error}`;
    return `${A.type}:${A.source}`
}
// @from(Ln 506360, Col 4)
rZ
// @from(Ln 506360, Col 8)
ITz = 5000
// @from(Ln 506361, Col 4)
NBq = E(() => {
    e6();
    i6();
    T1();
    wz();
    NA();
    Pv();
    Ib();
    H1();
    rZ = t(P6(), 1)
})
// @from(Ln 506372, Col 0)
async function kBq(A) {
    if (!A || !A.trim()) return k("[binaryCheck] Empty command provided, returning false"), !1;
    let q = A.trim(),
        K = VBq.get(q);
    if (K !== void 0) return k(`[binaryCheck] Cache hit for '${q}': ${K}`), K;
    let Y = !1;
    if (await EM(q).catch(() => null)) Y = !0;
    return VBq.set(q, Y), k(`[binaryCheck] Binary '${q}' ${Y?"found":"not found"}`), Y
}
// @from(Ln 506381, Col 4)
VBq
// @from(Ln 506382, Col 4)
EBq = E(() => {
    H1();
    Oy();
    VBq = new Map
})
// @from(Ln 506391, Col 0)
function mTz(A) {
    return nV.has(A.toLowerCase())
}
// @from(Ln 506395, Col 0)
function BTz(A) {
    if (!A) return null;
    if (typeof A === "string") return k("[lspRecommendation] Skipping string path lspServers (not readable from marketplace)"), null;
    if (Array.isArray(A)) {
        for (let q of A) {
            if (typeof q === "string") continue;
            let K = LBq(q);
            if (K) return K
        }
        return null
    }
    return LBq(A)
}
// @from(Ln 506409, Col 0)
function yBq(A) {
    return typeof A === "object" && A !== null
}
// @from(Ln 506413, Col 0)
function LBq(A) {
    let q = new Set,
        K = null;
    for (let [Y, z] of Object.entries(A)) {
        if (!yBq(z)) continue;
        if (!K && typeof z.command === "string") K = z.command;
        let _ = z.extensionToLanguage;
        if (yBq(_))
            for (let w of Object.keys(_)) q.add(w.toLowerCase())
    }
    if (!K || q.size === 0) return null;
    return {
        extensions: q,
        command: K
    }
}
// @from(Ln 506429, Col 0)
async function gTz() {
    let A = new Map;
    try {
        let q = await C3();
        for (let K of Object.keys(q)) try {
            let Y = await j0(K),
                z = mTz(K);
            for (let _ of Y.plugins) {
                if (!_.lspServers) continue;
                let w = BTz(_.lspServers);
                if (!w) continue;
                let O = `${_.name}@${K}`;
                A.set(O, {
                    entry: _,
                    marketplaceName: K,
                    extensions: w.extensions,
                    command: w.command,
                    isOfficial: z
                })
            }
        } catch (Y) {
            k(`[lspRecommendation] Failed to load marketplace ${K}: ${Y}`)
        }
    } catch (q) {
        k(`[lspRecommendation] Failed to load marketplaces config: ${q}`)
    }
    return A
}
// @from(Ln 506457, Col 0)
async function RBq(A) {
    if (FTz()) return k("[lspRecommendation] Recommendations are disabled"), [];
    let q = xTz(A).toLowerCase();
    if (!q) return k("[lspRecommendation] No file extension found"), [];
    k(`[lspRecommendation] Looking for LSP plugins for ${q}`);
    let K = await gTz(),
        z = X1().lspRecommendationNeverPlugins ?? [],
        _ = [];
    for (let [O, $] of K) {
        if (!$.extensions.has(q)) continue;
        if (z.includes(O)) {
            k(`[lspRecommendation] Skipping ${O} (in never suggest list)`);
            continue
        }
        if (iB(O)) {
            k(`[lspRecommendation] Skipping ${O} (already installed)`);
            continue
        }
        _.push({
            info: $,
            pluginId: O
        })
    }
    let w = [];
    for (let {
            info: O,
            pluginId: $
        }
        of _)
        if (await kBq(O.command)) w.push({
            info: O,
            pluginId: $
        }), k(`[lspRecommendation] Binary '${O.command}' found for ${$}`);
        else k(`[lspRecommendation] Skipping ${$} (binary '${O.command}' not found)`);
    return w.sort((O, $) => {
        if (O.info.isOfficial && !$.info.isOfficial) return -1;
        if (!O.info.isOfficial && $.info.isOfficial) return 1;
        return 0
    }), w.map(({
        info: O,
        pluginId: $
    }) => ({
        pluginId: $,
        pluginName: O.entry.name,
        marketplaceName: O.marketplaceName,
        description: O.entry.description,
        isOfficial: O.isOfficial,
        extensions: Array.from(O.extensions),
        command: O.command
    }))
}
// @from(Ln 506509, Col 0)
function hBq(A) {
    d1((q) => {
        let K = q.lspRecommendationNeverPlugins ?? [];
        if (K.includes(A)) return q;
        return {
            ...q,
            lspRecommendationNeverPlugins: [...K, A]
        }
    }), k(`[lspRecommendation] Added ${A} to never suggest`)
}
// @from(Ln 506520, Col 0)
function SBq() {
    d1((A) => {
        let q = (A.lspRecommendationIgnoredCount ?? 0) + 1;
        return {
            ...A,
            lspRecommendationIgnoredCount: q
        }
    }), k("[lspRecommendation] Incremented ignored count")
}
// @from(Ln 506530, Col 0)
function FTz() {
    let A = X1();
    return A.lspRecommendationDisabled === !0 || (A.lspRecommendationIgnoredCount ?? 0) >= uTz
}
// @from(Ln 506534, Col 4)
uTz = 5
// @from(Ln 506535, Col 4)
CBq = E(() => {
    Aw();
    IW();
    fX();
    EBq();
    k8();
    H1()
})
// @from(Ln 506548, Col 0)
function IBq() {
    let A = A6(11),
        q = M1(cTz),
        {
            addNotification: K
        } = o4(),
        [Y, z] = ah.useState(null),
        _;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) _ = new Set, A[0] = _;
    else _ = A[0];
    let w = ah.useRef(_),
        O = ah.useRef(!1),
        $, H;
    if (A[1] !== Y || A[2] !== q) $ = () => {
        if (t4()) return;
        if (Y) return;
        if (O.current) return;
        if (Uu1()) return;
        let D = [];
        for (let P of q)
            if (!w.current.has(P)) w.current.add(P), D.push(P);
        if (D.length === 0) return;
        O.current = !0, X(D).finally(() => {
            O.current = !1
        });
        async function X(P) {
            for (let W of P) try {
                let G = (await RBq(W))[0];
                if (G) {
                    k(`[useLspPluginRecommendation] Found match: ${G.pluginName} for ${W}`), z({
                        pluginId: G.pluginId,
                        pluginName: G.pluginName,
                        pluginDescription: G.description,
                        fileExtension: pTz(W),
                        shownAt: Date.now()
                    }), du1(!0);
                    return
                }
            } catch (Z) {
                _6(Z)
            }
        }
    }, H = [q, Y], A[1] = Y, A[2] = q, A[3] = $, A[4] = H;
    else $ = A[3], H = A[4];
    ah.useEffect($, H);
    let j;
    if (A[5] !== K || A[6] !== Y) j = (D) => {
        if (!Y) return;
        let {
            pluginId: X,
            pluginName: P,
            shownAt: W
        } = Y;
        k(`[useLspPluginRecommendation] User response: ${D} for ${P}`);
        A: switch (D) {
            case "yes": {
                lTz(X, P, K);
                break A
            }
            case "no": {
                let Z = Date.now() - W;
                if (Z >= UTz) k(`[useLspPluginRecommendation] Timeout detected (${Z}ms), incrementing ignored count`), SBq();
                break A
            }
            case "never": {
                hBq(X);
                break A
            }
            case "disable":
                d1(dTz)
        }
        z(null)
    }, A[5] = K, A[6] = Y, A[7] = j;
    else j = A[7];
    let J = j,
        M;
    if (A[8] !== J || A[9] !== Y) M = {
        recommendation: Y,
        handleResponse: J
    }, A[8] = J, A[9] = Y, A[10] = M;
    else M = A[10];
    return M
}
// @from(Ln 506632, Col 0)
function dTz(A) {
    if (A.lspRecommendationDisabled) return A;
    return {
        ...A,
        lspRecommendationDisabled: !0
    }
}
// @from(Ln 506640, Col 0)
function cTz(A) {
    return A.fileHistory.trackedFiles
}
// @from(Ln 506643, Col 0)
async function lTz(A, q, K) {
    try {
        k(`[useLspPluginRecommendation] Installing plugin: ${A}`);
        let Y = await Qv(A);
        if (!Y) throw Error(`Plugin ${A} not found in marketplace`);
        let z = typeof Y.entry.source === "string" ? QTz(Y.marketplaceInstallLocation, Y.entry.source) : void 0;
        await ap6(A, Y.entry, "user", void 0, z);
        let _ = L8("userSettings");
        TA("userSettings", {
            enabledPlugins: {
                ..._?.enabledPlugins,
                [A]: !0
            }
        }), k(`[useLspPluginRecommendation] Plugin installed: ${A}`), K({
            key: "lsp-plugin-installed",
            jsx: ah.createElement(T, {
                color: "success"
            }, a6.tick, " ", q, " installed · restart to apply"),
            priority: "immediate",
            timeoutMs: 5000
        })
    } catch (Y) {
        _6(Y), K({
            key: "lsp-plugin-install-failed",
            jsx: ah.createElement(T, {
                color: "error"
            }, "Failed to install ", q),
            priority: "immediate",
            timeoutMs: 5000
        })
    }
}
// @from(Ln 506675, Col 4)
ah
// @from(Ln 506675, Col 8)
UTz = 28000
// @from(Ln 506676, Col 4)
bBq = E(() => {
    e6();
    b7();
    i6();
    NA();
    wz();
    k8();
    T1();
    k1();
    H1();
    CBq();
    M96();
    Aw();
    i8();
    ah = t(P6(), 1)
})
// @from(Ln 506693, Col 0)
function xBq() {}
// @from(Ln 506695, Col 0)
function uBq({
    pluginName: A,
    pluginDescription: q,
    fileExtension: K,
    onResponse: Y
}) {
    let z = k5.useRef(Y);
    z.current = Y, k5.useEffect(() => {
        let O = setTimeout(($) => $.current("no"), iTz, z);
        return () => clearTimeout(O)
    }, []);

    function _(O) {
        switch (O) {
            case "yes":
                Y("yes");
                break;
            case "no":
                Y("no");
                break;
            case "never":
                Y("never");
                break;
            case "disable":
                Y("disable");
                break
        }
    }
    return k5.createElement(cz, {
        title: "LSP Plugin Recommendation"
    }, k5.createElement(m, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, k5.createElement(m, {
        marginBottom: 1
    }, k5.createElement(T, {
        dimColor: !0
    }, "LSP provides code intelligence like go-to-definition and error checking")), k5.createElement(m, null, k5.createElement(T, {
        dimColor: !0
    }, "Plugin:"), k5.createElement(T, null, " ", A)), q && k5.createElement(m, null, k5.createElement(T, {
        dimColor: !0
    }, q)), k5.createElement(m, null, k5.createElement(T, {
        dimColor: !0
    }, "Triggered by:"), k5.createElement(T, null, " ", K, " files")), k5.createElement(m, {
        marginTop: 1
    }, k5.createElement(T, null, "Would you like to install this LSP plugin?")), k5.createElement(m, null, k5.createElement(T8, {
        options: [{
            label: k5.createElement(T, null, "Yes, install ", k5.createElement(T, {
                bold: !0
            }, A)),
            value: "yes"
        }, {
            label: "No, not now",
            value: "no"
        }, {
            label: k5.createElement(T, null, "Never for ", k5.createElement(T, {
                bold: !0
            }, A)),
            value: "never"
        }, {
            label: "Disable all LSP recommendations",
            value: "disable"
        }],
        onChange: _,
        onCancel: () => Y("no")
    }))))
}
// @from(Ln 506763, Col 4)
k5
// @from(Ln 506763, Col 8)
iTz = 30000
// @from(Ln 506764, Col 4)
mBq = E(() => {
    i6();
    v3();
    NZ();
    k5 = t(P6(), 1)
})
// @from(Ln 506771, Col 0)
function gBq() {
    let A = A6(20),
        {
            addNotification: q
        } = o4(),
        K = M1(oTz),
        Y;
    A: {
        if (!K) {
            let P;
            if (A[0] === Symbol.for("react.memo_cache_sentinel")) P = {
                totalFailed: 0,
                failedMarketplacesCount: 0,
                failedPluginsCount: 0
            }, A[0] = P;
            else P = A[0];
            Y = P;
            break A
        }
        let H;
        if (A[1] !== K.marketplaces) H = K.marketplaces.filter(rTz),
        A[1] = K.marketplaces,
        A[2] = H;
        else H = A[2];
        let j = H,
            J;
        if (A[3] !== K.plugins) J = K.plugins.filter(nTz),
        A[3] = K.plugins,
        A[4] = J;
        else J = A[4];
        let M = J,
            D = j.length + M.length,
            X;
        if (A[5] !== j.length || A[6] !== M.length || A[7] !== D) X = {
            totalFailed: D,
            failedMarketplacesCount: j.length,
            failedPluginsCount: M.length
        },
        A[5] = j.length,
        A[6] = M.length,
        A[7] = D,
        A[8] = X;
        else X = A[8];Y = X
    }
    let {
        totalFailed: z,
        failedMarketplacesCount: _,
        failedPluginsCount: w
    } = Y, O;
    if (A[9] !== q || A[10] !== _ || A[11] !== w || A[12] !== K || A[13] !== z) O = () => {
        if (t4()) return;
        if (!K) {
            k("No installation status to monitor");
            return
        }
        if (z === 0) return;
        if (k(`Plugin installation status: ${_} failed marketplaces, ${w} failed plugins`), z === 0) return;
        k(`Adding notification for ${z} failed installations`), q({
            key: "plugin-install-failed",
            jsx: dF.createElement(dF.Fragment, null, dF.createElement(T, {
                color: "error"
            }, z, " plugin", z === 1 ? "" : "s", " failed to install"), dF.createElement(T, {
                dimColor: !0
            }, " · /plugin for details")),
            priority: "medium"
        })
    }, A[9] = q, A[10] = _, A[11] = w, A[12] = K, A[13] = z, A[14] = O;
    else O = A[14];
    let $;
    if (A[15] !== q || A[16] !== _ || A[17] !== w || A[18] !== z) $ = [q, z, _, w], A[15] = q, A[16] = _, A[17] = w, A[18] = z, A[19] = $;
    else $ = A[19];
    BBq.useEffect(O, $)
}
// @from(Ln 506845, Col 0)
function nTz(A) {
    return A.status === "failed"
}
// @from(Ln 506849, Col 0)
function rTz(A) {
    return A.status === "failed"
}
// @from(Ln 506853, Col 0)
function oTz(A) {
    return A.plugins.installationStatus
}
// @from(Ln 506856, Col 4)
dF
// @from(Ln 506856, Col 8)
BBq
// @from(Ln 506857, Col 4)
FBq = E(() => {
    e6();
    i6();
    T1();
    wz();
    NA();
    H1();
    dF = t(P6(), 1), BBq = t(P6(), 1)
})
// @from(Ln 506867, Col 0)
function pBq() {
    let A = A6(7),
        {
            addNotification: q
        } = o4(),
        K;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) K = [], A[0] = K;
    else K = A[0];
    let [Y, z] = Ba6.useState(K), _, w;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) _ = () => {
        if (t4()) return;
        return fwq((j) => {
            k(`Plugin autoupdate notification: ${j.length} plugin(s) updated`), z(j)
        })
    }, w = [], A[1] = _, A[2] = w;
    else _ = A[1], w = A[2];
    Ba6.useEffect(_, w);
    let O, $;
    if (A[3] !== q || A[4] !== Y) O = () => {
        if (t4()) return;
        if (Y.length === 0) return;
        let H = Y.map(aTz),
            j = H.length <= 2 ? H.join(" and ") : `${H.length} plugins`;
        q({
            key: "plugin-autoupdate-restart",
            jsx: cF.createElement(cF.Fragment, null, cF.createElement(T, {
                color: "success"
            }, H.length === 1 ? "Plugin" : "Plugins", " updated:", " ", j), cF.createElement(T, {
                dimColor: !0
            }, " · Run /reload-plugins to apply")),
            priority: "low",
            timeoutMs: 1e4
        }), k(`Showing plugin autoupdate notification for: ${H.join(", ")}`)
    }, $ = [Y, q], A[3] = q, A[4] = Y, A[5] = O, A[6] = $;
    else O = A[5], $ = A[6];
    Ba6.useEffect(O, $)
}
// @from(Ln 506905, Col 0)
function aTz(A) {
    let q = A.indexOf("@");
    return q > 0 ? A.substring(0, q) : A
}
// @from(Ln 506909, Col 4)
cF
// @from(Ln 506909, Col 8)
Ba6
// @from(Ln 506910, Col 4)
QBq = E(() => {
    e6();
    i6();
    T1();
    wz();
    hL1();
    H1();
    cF = t(P6(), 1), Ba6 = t(P6(), 1)
})
// @from(Ln 506920, Col 0)
function lt8(A, q, K, Y) {
    A((z) => ({
        ...z,
        plugins: {
            ...z.plugins,
            installationStatus: {
                ...z.plugins.installationStatus,
                marketplaces: z.plugins.installationStatus.marketplaces.map((_) => _.name === q ? {
                    ..._,
                    status: K,
                    error: Y
                } : _)
            }
        }
    }))
}
// @from(Ln 506936, Col 0)
async function UBq(A) {
    k("performBackgroundPluginInstallations called");
    try {
        let q = _e(),
            K = await C3().catch(() => ({})),
            Y = Os8(q, K),
            z = [...Y.missing, ...Y.sourceChanged.map((O) => O.name)];
        if (A((O) => ({
                ...O,
                plugins: {
                    ...O.plugins,
                    installationStatus: {
                        marketplaces: z.map(($) => ({
                            name: $,
                            status: "pending"
                        })),
                        plugins: []
                    }
                }
            })), z.length === 0) return;
        k(`Installing ${z.length} marketplace(s) in background`);
        let _ = await HI1({
                onProgress: (O) => {
                    switch (O.type) {
                        case "installing":
                            lt8(A, O.name, "installing");
                            break;
                        case "installed":
                            lt8(A, O.name, "installed");
                            break;
                        case "failed":
                            lt8(A, O.name, "failed", O.error);
                            break
                    }
                }
            }),
            w = {
                installed_count: _.installed.length,
                updated_count: _.updated.length,
                failed_count: _.failed.length,
                up_to_date_count: _.upToDate.length
            };
        if (d("tengu_marketplace_background_install", w), U1("info", "tengu_marketplace_background_install", w), _.installed.length > 0) {
            QI(), k(`Auto-refreshing plugins after ${_.installed.length} new marketplace(s) installed`);
            try {
                await TN6(A)
            } catch (O) {
                _6(O), k(`Auto-refresh failed, falling back to needsRefresh: ${O}`, {
                    level: "warn"
                }), XZ("performBackgroundPluginInstallations: auto-refresh failed"), A(($) => {
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
        } else if (_.updated.length > 0) QI(), XZ("performBackgroundPluginInstallations: marketplaces reconciled"), A((O) => {
            if (O.plugins.needsRefresh) return O;
            return {
                ...O,
                plugins: {
                    ...O.plugins,
                    needsRefresh: !0
                }
            }
        })
    } catch (q) {
        _6(q)
    }
}
// @from(Ln 507010, Col 4)
dBq = E(() => {
    H1();
    k1();
    V1();
    u_();
    $s8();
    Aw();
    tH();
    eR1()
})
// @from(Ln 507020, Col 0)
async function cBq(A) {
    if (k("performStartupChecks called"), !l_()) {
        k("Trust not accepted for current directory - skipping plugin installations");
        return
    }
    try {
        if (k("Starting background plugin installations"), await KW1()) QI(), XZ("performStartupChecks: seed marketplaces changed"), A((K) => {
            if (K.plugins.needsRefresh) return K;
            return {
                ...K,
                plugins: {
                    ...K.plugins,
                    needsRefresh: !0
                }
            }
        });
        await UBq(A)
    } catch (q) {
        k(`Error initiating background plugin installations: ${q}`)
    }
}
// @from(Ln 507041, Col 4)
lBq = E(() => {
    H1();
    dBq();
    Aw();
    tH();
    k8()
})
// @from(Ln 507049, Col 0)
function iBq() {
    let A = A6(11),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = e0.getInstance().getStatus(), A[0] = q;
    else q = A[0];
    let [K, Y] = Wb1.useState(q), z, _;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) z = () => {
        return e0.getInstance().subscribe(Y)
    }, _ = [], A[1] = z, A[2] = _;
    else z = A[1], _ = A[2];
    if (Wb1.useEffect(z, _), !K.isAuthenticating && !K.error && K.output.length === 0) return null;
    if (!K.isAuthenticating && !K.error) return null;
    let w;
    if (A[3] === Symbol.for("react.memo_cache_sentinel")) w = R26.default.createElement(T, {
        bold: !0,
        color: "permission"
    }, "Cloud Authentication"), A[3] = w;
    else w = A[3];
    let O;
    if (A[4] !== K.output) O = K.output.length > 0 && R26.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, K.output.slice(-5).map(sTz)), A[4] = K.output, A[5] = O;
    else O = A[5];
    let $;
    if (A[6] !== K.error) $ = K.error && R26.default.createElement(m, {
        marginTop: 1
    }, R26.default.createElement(T, {
        color: "error"
    }, K.error)), A[6] = K.error, A[7] = $;
    else $ = A[7];
    let H;
    if (A[8] !== O || A[9] !== $) H = R26.default.createElement(m, {
        flexDirection: "column",
        borderStyle: "round",
        borderColor: "permission",
        paddingX: 1,
        marginY: 1
    }, w, O, $), A[8] = O, A[9] = $, A[10] = H;
    else H = A[10];
    return H
}
// @from(Ln 507092, Col 0)
function sTz(A, q) {
    return R26.default.createElement(T, {
        key: q,
        dimColor: !0
    }, A)
}
// @from(Ln 507098, Col 4)
R26
// @from(Ln 507098, Col 9)
Wb1
// @from(Ln 507099, Col 4)
nBq = E(() => {
    e6();
    i6();
    R26 = t(P6(), 1), Wb1 = t(P6(), 1)
})
// @from(Ln 507105, Col 0)
function rBq(A) {
    let q = A6(17),
        {
            addNotification: K
        } = o4(),
        Y = j66(),
        z;
    if (q[0] !== Y || q[1] !== A) z = FT8(Y, A), q[0] = Y, q[1] = A, q[2] = z;
    else z = q[2];
    let _ = z,
        w;
    if (q[3] !== Y) w = pT8(Y), q[3] = Y, q[4] = w;
    else w = q[4];
    let O = w,
        $ = h26.useRef(null),
        H;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) H = CK(), q[5] = H;
    else H = q[5];
    let j = H,
        J;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) J = fI(), q[6] = J;
    else J = q[6];
    let M = J,
        D = j === "team" || j === "enterprise",
        [X, P] = h26.useState(!1),
        W, Z;
    if (q[7] !== K || q[8] !== Y.isUsingOverage || q[9] !== X || q[10] !== O) W = () => {
        if (t4()) return;
        if (Y.isUsingOverage && !X && (!D || M)) K({
            key: "limit-reached",
            text: O,
            priority: "immediate"
        }), P(!0);
        else if (!Y.isUsingOverage && X) P(!1)
    }, Z = [Y.isUsingOverage, O, X, K, M, D], q[7] = K, q[8] = Y.isUsingOverage, q[9] = X, q[10] = O, q[11] = W, q[12] = Z;
    else W = q[11], Z = q[12];
    h26.useEffect(W, Z);
    let G, f;
    if (q[13] !== K || q[14] !== _) G = () => {
        if (t4()) return;
        if (_ && _ !== $.current) $.current = _, K({
            key: "rate-limit-warning",
            jsx: ga6.createElement(T, null, ga6.createElement(T, {
                color: "warning"
            }, _)),
            priority: "high"
        })
    }, f = [_, K], q[13] = K, q[14] = _, q[15] = G, q[16] = f;
    else G = q[15], f = q[16];
    h26.useEffect(G, f)
}
// @from(Ln 507156, Col 4)
ga6
// @from(Ln 507156, Col 9)
h26
// @from(Ln 507157, Col 4)
oBq = E(() => {
    e6();
    T1();
    wz();
    Wc6();
    ud();
    i6();
    k8();
    fA();
    ga6 = t(P6(), 1), h26 = t(P6(), 1)
})
// @from(Ln 507169, Col 0)
function aBq(A) {
    let q = A6(4),
        {
            addNotification: K
        } = o4(),
        Y = Zb1.useRef(null),
        z, _;
    if (q[0] !== K || q[1] !== A) z = () => {
        if (t4()) return;
        let w = BC1(A);
        if (w && w !== Y.current) Y.current = w, K({
            key: "model-deprecation-warning",
            text: w,
            color: "warning",
            priority: "high"
        });
        if (!w) Y.current = null
    }, _ = [A, K], q[0] = K, q[1] = A, q[2] = z, q[3] = _;
    else z = q[2], _ = q[3];
    Zb1.useEffect(z, _)
}
// @from(Ln 507190, Col 4)
Zb1
// @from(Ln 507191, Col 4)
sBq = E(() => {
    e6();
    T1();
    wz();
    va8();
    Zb1 = t(P6(), 1)
})
// @from(Ln 507199, Col 0)
function tBq() {
    let A = A6(3),
        {
            addNotification: q
        } = o4(),
        K = Gb1.useRef(!1),
        Y, z;
    if (A[0] !== q) Y = () => {
        if (t4()) return;
        if (K.current || rY() || t6(process.env.DISABLE_INSTALLATION_CHECKS)) return;
        ug().then((_) => {
            if (K.current || _ === "development") return;
            K.current = !0, q({
                timeoutMs: 15000,
                key: "npm-deprecation-warning",
                text: tTz,
                color: "warning",
                priority: "high"
            })
        })
    }, z = [q], A[0] = q, A[1] = Y, A[2] = z;
    else Y = A[1], z = A[2];
    Gb1.useEffect(Y, z)
}
// @from(Ln 507223, Col 4)
Gb1
// @from(Ln 507223, Col 9)
tTz = "Claude Code has switched from npm to native installer. Run `claude install` or see https://docs.anthropic.com/en/docs/claude-code/getting-started for more options."
// @from(Ln 507224, Col 4)
eBq = E(() => {
    e6();
    T1();
    wz();
    tc();
    A8();
    Gb1 = t(P6(), 1)
})
// @from(Ln 507233, Col 0)
function Agq(A) {
    let q = A6(26),
        {
            ideSelection: K,
            mcpClients: Y,
            ideInstallationStatus: z
        } = A,
        {
            addNotification: _,
            removeNotification: w
        } = o4(),
        {
            status: O,
            ideName: $
        } = LV6(Y),
        H = lF.useRef(!1),
        j;
    if (q[0] !== z) j = z ? FC(z?.ideType) : !1, q[0] = z, q[1] = j;
    else j = q[1];
    let J = j,
        M = z?.error || J,
        D = O === "connected" && (K?.filePath || K?.text && K.lineCount > 0),
        X = O === "connected" && !D,
        P = M && !J && !X && !D,
        W = M && J && !X && !D,
        Z, G;
    if (q[2] !== _ || q[3] !== O || q[4] !== w || q[5] !== W) Z = () => {
        if (t4()) return;
        if (FM() || O !== null || W) {
            w("ide-status-hint");
            return
        }
        if (H.current || (X1().ideHintShownCount ?? 0) >= eTz) return;
        let R = setTimeout(Avz, 3000, H, _);
        return () => clearTimeout(R)
    }, G = [_, w, O, W], q[2] = _, q[3] = O, q[4] = w, q[5] = W, q[6] = Z, q[7] = G;
    else Z = q[6], G = q[7];
    lF.useEffect(Z, G);
    let f, v;
    if (q[8] !== _ || q[9] !== $ || q[10] !== O || q[11] !== w || q[12] !== P || q[13] !== W) f = () => {
        if (t4()) return;
        if (P || W || O !== "disconnected" || !$) {
            w("ide-status-disconnected");
            return
        }
        _({
            key: "ide-status-disconnected",
            text: `${$} disconnected`,
            color: "error",
            priority: "medium"
        })
    }, v = [_, w, O, $, P, W], q[8] = _, q[9] = $, q[10] = O, q[11] = w, q[12] = P, q[13] = W, q[14] = f, q[15] = v;
    else f = q[14], v = q[15];
    lF.useEffect(f, v);
    let N, V;
    if (q[16] !== _ || q[17] !== w || q[18] !== W) N = () => {
        if (t4()) return;
        if (!W) {
            w("ide-status-jetbrains-disconnected");
            return
        }
        _({
            key: "ide-status-jetbrains-disconnected",
            text: "IDE plugin not connected · /status for info",
            priority: "medium"
        })
    }, V = [_, w, W], q[16] = _, q[17] = w, q[18] = W, q[19] = N, q[20] = V;
    else N = q[19], V = q[20];
    lF.useEffect(N, V);
    let L, h;
    if (q[21] !== _ || q[22] !== w || q[23] !== P) L = () => {
        if (t4()) return;
        if (!P) {
            w("ide-status-install-error");
            return
        }
        _({
            key: "ide-status-install-error",
            text: "IDE extension install failed (see /status for info)",
            color: "error",
            priority: "medium"
        })
    }, h = [_, w, P], q[21] = _, q[22] = w, q[23] = P, q[24] = L, q[25] = h;
    else L = q[24], h = q[25];
    lF.useEffect(L, h)
}
// @from(Ln 507320, Col 0)
function Avz(A, q) {
    pX6(!0).then((K) => {
        let Y = K[0]?.name;
        if (Y && !A.current) A.current = !0, d1(qvz), q({
            key: "ide-status-hint",
            jsx: lF.default.createElement(T, {
                dimColor: !0
            }, "/ide for ", lF.default.createElement(T, {
                color: "ide"
            }, Y)),
            priority: "low"
        })
    })
}
// @from(Ln 507335, Col 0)
function qvz(A) {
    return {
        ...A,
        ideHintShownCount: (A.ideHintShownCount ?? 0) + 1
    }
}
// @from(Ln 507341, Col 4)
lF
// @from(Ln 507341, Col 8)
eTz = 5
// @from(Ln 507342, Col 4)
qgq = E(() => {
    e6();
    T1();
    i6();
    wz();
    Sw();
    II1();
    k8();
    lF = t(P6(), 1)
})
// @from(Ln 507353, Col 0)
function Ygq() {
    let A = A6(3),
        {
            addNotification: q
        } = o4(),
        K, Y;
    if (A[0] !== q) K = () => {
        if (t4()) return;
        let z = X1(),
            _ = Boolean(z.legacyOpusMigrationTimestamp),
            w = z.legacyOpusMigrationTimestamp ?? z.opusProMigrationTimestamp;
        if (w) {
            if (Date.now() - w < 3000) q({
                key: "opus-pro-update",
                text: _ ? "Model updated to Opus 4.6 · Set CLAUDE_CODE_DISABLE_LEGACY_MODEL_REMAP=1 to opt out" : "Model updated to Opus 4.6",
                color: "suggestion",
                priority: "high",
                timeoutMs: _ ? 8000 : 3000
            })
        }
    }, Y = [q], A[0] = q, A[1] = K, A[2] = Y;
    else K = A[1], Y = A[2];
    Kgq.useEffect(K, Y)
}
// @from(Ln 507377, Col 4)
Kgq
// @from(Ln 507378, Col 4)
zgq = E(() => {
    e6();
    T1();
    wz();
    k8();
    Kgq = t(P6(), 1)
})
// @from(Ln 507386, Col 0)
function wgq() {
    let A = A6(3),
        {
            addNotification: q
        } = o4(),
        K, Y;
    if (A[0] !== q) K = () => {
        if (t4()) return;
        let _ = X1().sonnet45To46MigrationTimestamp;
        if (_) {
            if (Date.now() - _ < 3000) q({
                key: "sonnet-46-update",
                text: "Model updated to Sonnet 4.6",
                color: "suggestion",
                priority: "high",
                timeoutMs: 3000
            })
        }
    }, Y = [q], A[0] = q, A[1] = K, A[2] = Y;
    else K = A[1], Y = A[2];
    _gq.useEffect(K, Y)
}
// @from(Ln 507408, Col 4)
_gq
// @from(Ln 507409, Col 4)
Ogq = E(() => {
    e6();
    T1();
    wz();
    k8();
    _gq = t(P6(), 1)
})
// @from(Ln 507417, Col 0)
function Hgq() {
    let A = A6(3),
        {
            addNotification: q
        } = o4(),
        K, Y;
    if (A[0] !== q) K = () => {
        if (t4()) return;
        if (X1().subscriptionNoticeCount ?? 0 >= Kvz) return;
        zvz().then((z) => {
            if (z === null) return;
            d1(Yvz), d("tengu_switch_to_subscription_notice_shown", {}), q({
                key: "switch-to-subscription",
                jsx: Fa6.createElement(T, {
                    color: "suggestion"
                }, "Use your existing Claude ", z, " plan with Claude Code", Fa6.createElement(T, {
                    color: "text",
                    dimColor: !0
                }, " ", "· /login to activate")),
                priority: "low"
            })
        })
    }, Y = [q], A[0] = q, A[1] = K, A[2] = Y;
    else K = A[1], Y = A[2];
    $gq.useEffect(K, Y)
}
// @from(Ln 507444, Col 0)
function Yvz(A) {
    return {
        ...A,
        subscriptionNoticeCount: (A.subscriptionNoticeCount ?? 0) + 1
    }
}
// @from(Ln 507450, Col 0)
async function zvz() {
    if (iA()) return null;
    let A = await kW4();
    if (!A) return null;
    if (A.account.has_claude_max) return "Max";
    if (A.account.has_claude_pro) return "Pro";
    return null
}
// @from(Ln 507458, Col 4)
Fa6
// @from(Ln 507458, Col 9)
$gq
// @from(Ln 507458, Col 14)
Kvz = 3
// @from(Ln 507459, Col 4)
jgq = E(() => {
    e6();
    i6();
    RZ6();
    T1();
    k8();
    V1();
    fA();
    wz();
    Fa6 = t(P6(), 1), $gq = t(P6(), 1)
})
// @from(Ln 507471, Col 0)
function Jgq(A) {
    if (!("text" in A)) return 1;
    let q = A.text.match(/^(\d+)/);
    return q?.[1] ? parseInt(q[1], 10) : 1
}
// @from(Ln 507477, Col 0)
function _vz(A, q) {
    return Mgq(Jgq(A) + 1)
}
// @from(Ln 507481, Col 0)
function Mgq(A) {
    return {
        key: "teammate-spawn",
        text: A === 1 ? "1 agent spawned" : `${A} agents spawned`,
        priority: "low",
        timeoutMs: 5000,
        fold: _vz
    }
}
// @from(Ln 507491, Col 0)
function wvz(A, q) {
    return Dgq(Jgq(A) + 1)
}
// @from(Ln 507495, Col 0)
function Dgq(A) {
    return {
        key: "teammate-shutdown",
        text: A === 1 ? "1 agent shut down" : `${A} agents shut down`,
        priority: "low",
        timeoutMs: 5000,
        fold: wvz
    }
}
// @from(Ln 507505, Col 0)
function Xgq() {
    let A = M1((z) => z.tasks),
        {
            addNotification: q
        } = o4(),
        K = pa6.useRef(new Set),
        Y = pa6.useRef(new Set);
    pa6.useEffect(() => {
        if (t4()) return;
        for (let [z, _] of Object.entries(A)) {
            if (!M$(_)) continue;
            if (_.status === "running" && !K.current.has(z)) K.current.add(z), q(Mgq(1));
            if (_.status === "completed" && !Y.current.has(z)) Y.current.add(z), q(Dgq(1))
        }
    }, [A, q])
}
// @from(Ln 507521, Col 4)
pa6
// @from(Ln 507522, Col 4)
Pgq = E(() => {
    T1();
    NA();
    wz();
    pa6 = t(P6(), 1)
})
// @from(Ln 507529, Col 0)
function fgq() {
    let A = A6(13),
        {
            addNotification: q
        } = o4(),
        K = M1(jvz),
        Y = xA(),
        z, _;
    if (A[0] !== q || A[1] !== K || A[2] !== Y) z = () => {
        if (t4()) return;
        if (!Dq()) return;
        return Rf7((j) => {
            if (j) q({
                key: Ggq,
                color: "fastMode",
                priority: "immediate",
                text: "Fast mode is now available · /fast to turn on"
            });
            else if (K) Y(Hvz), q({
                key: Ggq,
                color: "warning",
                priority: "immediate",
                text: "Fast mode has been disabled by your organization"
            })
        })
    }, _ = [q, K, Y], A[0] = q, A[1] = K, A[2] = Y, A[3] = z, A[4] = _;
    else z = A[3], _ = A[4];
    fb1.useEffect(z, _);
    let w, O;
    if (A[5] !== q || A[6] !== Y) w = () => {
        if (t4()) return;
        if (!Dq()) return;
        return yf7((j) => {
            Y($vz), q({
                key: Ovz,
                color: "warning",
                priority: "immediate",
                text: j
            })
        })
    }, O = [q, Y], A[5] = q, A[6] = Y, A[7] = w, A[8] = O;
    else w = A[7], O = A[8];
    fb1.useEffect(w, O);
    let $, H;
    if (A[9] !== q || A[10] !== K) $ = () => {
        if (t4()) return;
        if (!K) return;
        return Vf7({
            onCooldownTriggered(j, J) {
                let M = UK(j - Date.now(), {
                        hideTrailingZeros: !0
                    }),
                    D = Jvz(J, M);
                q({
                    key: Wgq,
                    invalidates: [Zgq],
                    text: D,
                    color: "warning",
                    priority: "immediate"
                })
            },
            onCooldownExpired() {
                q({
                    key: Zgq,
                    invalidates: [Wgq],
                    color: "fastMode",
                    text: "Fast limit reset · now using fast mode",
                    priority: "immediate"
                })
            }
        })
    }, H = [q, K], A[9] = q, A[10] = K, A[11] = $, A[12] = H;
    else $ = A[11], H = A[12];
    fb1.useEffect($, H)
}
// @from(Ln 507605, Col 0)
function $vz(A) {
    return {
        ...A,
        fastMode: !1
    }
}
// @from(Ln 507612, Col 0)
function Hvz(A) {
    return {
        ...A,
        fastMode: !1
    }
}
// @from(Ln 507619, Col 0)
function jvz(A) {
    return A.fastMode
}
// @from(Ln 507623, Col 0)
function Jvz(A, q) {
    switch (A) {
        case "overloaded":
            return `Fast mode overloaded and is temporarily unavailable · resets in ${q}`;
        case "rate_limit":
            return `Fast limit reached and temporarily disabled · resets in ${q}`
    }
}
// @from(Ln 507631, Col 4)
fb1
// @from(Ln 507631, Col 9)
Wgq = "fast-mode-cooldown-started"
// @from(Ln 507632, Col 4)
Zgq = "fast-mode-cooldown-expired"
// @from(Ln 507633, Col 4)
Ggq = "fast-mode-org-changed"
// @from(Ln 507634, Col 4)
Ovz = "fast-mode-overage-rejected"
// @from(Ln 507635, Col 4)
Tgq = E(() => {
    e6();
    T1();
    wz();
    FW();
    NA();
    M4();
    fb1 = t(P6(), 1)
})
// @from(Ln 507645, Col 0)
function vgq(A) {
    let q = A6(8),
        {
            onRun: K,
            onCancel: Y,
            reason: z
        } = A,
        _ = Tb1.useRef(!1),
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = {
        context: "Confirmation"
    }, q[0] = w;
    else w = q[0];
    D8("confirm:no", Y, w);
    let O, $;
    if (q[1] !== K) O = () => {
        if (!_.current) _.current = !0, K()
    }, $ = [K], q[1] = K, q[2] = O, q[3] = $;
    else O = q[2], $ = q[3];
    Tb1.useEffect(O, $);
    let H;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) H = KW.createElement(m, null, KW.createElement(T, {
        bold: !0
    }, "Running feedback capture...")), q[4] = H;
    else H = q[4];
    let j;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) j = KW.createElement(m, null, KW.createElement(T, {
        dimColor: !0
    }, "Press ", KW.createElement(a1, {
        shortcut: "Esc",
        action: "cancel"
    }), " anytime")), q[5] = j;
    else j = q[5];
    let J;
    if (q[6] !== z) J = KW.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, H, j, KW.createElement(m, null, KW.createElement(T, {
        dimColor: !0
    }, "Reason: ", z))), q[6] = z, q[7] = J;
    else J = q[7];
    return J
}
// @from(Ln 507689, Col 0)
function Ngq(A) {
    return !1;
    switch (A) {
        case "feedback_survey_bad":
            return !1;
        case "feedback_survey_good":
            return !1;
        default:
            return !1
    }
}
// @from(Ln 507701, Col 0)
function Vgq(A) {
    return "/issue"
}
// @from(Ln 507705, Col 0)
function kgq(A) {
    switch (A) {
        case "feedback_survey_bad":
            return 'You responded "Bad" to the feedback survey';
        case "feedback_survey_good":
            return 'You responded "Good" to the feedback survey';
        default:
            return "Unknown reason"
    }
}
// @from(Ln 507715, Col 4)
KW
// @from(Ln 507715, Col 8)
Tb1
// @from(Ln 507716, Col 4)
Egq = E(() => {
    e6();
    i6();
    _7();
    Lq();
    KW = t(P6(), 1), Tb1 = t(P6(), 1)
})
// @from(Ln 507724, Col 0)
function ygq() {
    return null
}
// @from(Ln 507728, Col 0)
function Xvz(A) {
    for (let q of A) {
        if (q.type !== "assistant") continue;
        let K = q.message.content;
        if (!Array.isArray(K)) continue;
        for (let Y of K) {
            if (Y.type !== "tool_use" || !("name" in Y)) continue;
            let z = Y.name;
            if (z.startsWith("mcp__")) return !1;
            if (z === Q7) {
                let w = Y.input?.command || "";
                if (Mvz.some((O) => O.test(w))) return !1
            }
        }
    }
    return !0
}
// @from(Ln 507746, Col 0)
function Pvz(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (K.type !== "user") continue;
        let Y = Fg(K);
        if (!Y) continue;
        return Dvz.some((z) => z.test(Y))
    }
    return !1
}
// @from(Ln 507757, Col 0)
function Lgq(A, q) {
    return !1
}
// @from(Ln 507760, Col 4)
Qa6
// @from(Ln 507760, Col 9)
Mvz
// @from(Ln 507760, Col 14)
Dvz
// @from(Ln 507760, Col 19)
Wvz = 3
// @from(Ln 507761, Col 4)
Zvz = 1800000
// @from(Ln 507762, Col 4)
Rgq = E(() => {
    JA();
    Qa6 = t(P6(), 1), Mvz = [/\bcurl\b/, /\bwget\b/, /\bssh\b/, /\bkubectl\b/, /\bsrun\b/, /\bdocker\b/, /\bbq\b/, /\bgsutil\b/, /\bgcloud\b/, /\baws\b/, /\bgit\s+push\b/, /\bgit\s+pull\b/, /\bgit\s+fetch\b/, /\bgh\s+(pr|issue)\b/, /\bnc\b/, /\bncat\b/, /\btelnet\b/, /\bftp\b/], Dvz = [/^no[,!]\s/i, /\bthat'?s (wrong|incorrect|not (what|right|correct))\b/i, /\bnot what I (asked|wanted|meant|said)\b/i, /\bI (said|asked|wanted|told you|already said)\b/i, /\bwhy did you\b/i, /\byou should(n'?t| not)? have\b/i, /\byou were supposed to\b/i, /\btry again\b/i, /\b(undo|revert) (that|this|it|what you)\b/i]
})
// @from(Ln 507766, Col 4)
Gvz
// @from(Ln 507766, Col 9)
fvz
// @from(Ln 507767, Col 4)
hgq = E(() => {
    e6();
    i6();
    T1();
    Gvz = t(P6(), 1), fvz = t(P6(), 1)
})
// @from(Ln 507773, Col 4)
it8 = {}
// @from(Ln 507779, Col 0)
function kvz({
    setInputValueRaw: A,
    inputValueRef: q,
    insertTextRef: K
}) {
    let {
        addNotification: Y
    } = o4(), z = GM.useRef(null), _ = GM.useRef(""), w = GM.useRef(null), O = GM.useCallback((W, {
        char: Z = " ",
        anchor: G = !1,
        floor: f = 0
    } = {}) => {
        let v = q.current,
            N = K.current?.cursorOffset ?? v.length,
            V = v.slice(0, N),
            L = v.slice(N),
            h = 0;
        while (h < V.length && V[V.length - 1 - h] === Z) h++;
        let R = Math.max(0, Math.min(h - f, W)),
            u = h - R,
            I = V.slice(0, V.length - R),
            g = "";
        if (G) {
            if (z.current = I, _.current = L, L.length > 0 && !/^\s/.test(L)) g = " "
        }
        let B = I + g + L;
        if (G) w.current = B;
        if (B === v && R === 0) return u;
        if (K.current) K.current.setInputWithCursor(B, I.length);
        else A(B);
        return u
    }, [A, q, K]), $ = GM.useCallback(() => {
        let W = z.current;
        if (W === null) return;
        let Z = _.current;
        z.current = null, _.current = "";
        let G = W + Z;
        if (K.current) K.current.setInputWithCursor(G, W.length);
        else A(G)
    }, [A, K]), H = (M1((W) => W.voiceEnabled) ?? !1) && GI(), j = M1((W) => W.voiceFocusMode) ?? !1, J = M1((W) => W.voiceState) ?? "idle", M = M1((W) => W.voiceInterimTranscript) ?? "";
    GM.useEffect(() => {
        if (J === "recording" && z.current === null) {
            let W = q.current,
                Z = K.current?.cursorOffset ?? W.length;
            z.current = W.slice(0, Z), _.current = W.slice(Z), w.current = W
        }
        if (J === "idle") z.current = null, _.current = "", w.current = null
    }, [J, q, K]), GM.useEffect(() => {
        if (z.current === null) return;
        let W = z.current,
            Z = _.current;
        if (q.current !== w.current) return;
        let G = W.length > 0 && !/\s$/.test(W) && M.length > 0,
            f = Z.length > 0 && !/^\s/.test(Z),
            v = G ? " " : "",
            N = f ? " " : "",
            V = W + v + M + N + Z,
            L = W.length + v.length + M.length;
        if (K.current) K.current.setInputWithCursor(V, L);
        else A(V);
        w.current = V
    }, [M, A, q, K]);
    let D = GM.useCallback((W) => {
            let Z = z.current;
            if (Z === null) return;
            let G = _.current;
            if (q.current !== w.current) return;
            let f = Z.length > 0 && !/\s$/.test(Z) && W.length > 0,
                v = G.length > 0 && !/^\s/.test(G) && W.length > 0,
                N = f ? " " : "",
                V = v ? " " : "",
                L = Z + N + W + V + G,
                h = Z.length + N.length + W.length;
            if (K.current) K.current.setInputWithCursor(L, h);
            else A(L);
            w.current = L, z.current = Z + N + W
        }, [A, q, K]),
        X = Tvz.useVoice({
            onTranscript: D,
            onError: (W) => {
                Y({
                    key: "voice-error",
                    text: W,
                    color: "error",
                    priority: "immediate",
                    timeoutMs: 1e4
                })
            },
            enabled: H,
            focusMode: j
        }),
        P = GM.useMemo(() => {
            if (z.current === null) return null;
            if (M.length === 0) return null;
            let W = z.current,
                Z = W.length > 0 && !/\s$/.test(W) && M.length > 0,
                G = W.length + (Z ? 1 : 0),
                f = G + M.length;
            return {
                start: G,
                end: f
            }
        }, [M]);
    return {
        stripTrailing: O,
        resetAnchor: $,
        handleKeyEvent: X.handleKeyEvent,
        interimRange: P
    }
}
// @from(Ln 507890, Col 0)
function Evz({
    voiceHandleKeyEvent: A,
    stripTrailing: q,
    resetAnchor: K,
    isActive: Y
}) {
    let z = S5(),
        _ = xA(),
        w = Wv(),
        O = he(),
        $ = M1((W) => W.voiceState) ?? "idle",
        H = GM.useMemo(() => {
            if (!w) return Vvz;
            let W = null;
            for (let Z of w.bindings) {
                if (Z.context !== "Chat") continue;
                if (Z.chord.length !== 1) continue;
                let G = Z.chord[0];
                if (!G) continue;
                if (Z.action === "voice:pushToTalk") W = G;
                else if (W !== null && W$1(G, W)) W = null
            }
            return W
        }, [w]),
        j = H !== null && H.key.length === 1 && !H.ctrl && !H.alt && !H.shift && !H.meta ? H.key : null,
        J = GM.useRef(0),
        M = GM.useRef(0),
        D = GM.useRef(0),
        X = GM.useRef(!1),
        P = GM.useRef(null);
    return GM.useEffect(() => {
        if ($ === "idle") X.current = !1, J.current = 0, M.current = 0, D.current = 0, _((W) => {
            if (!W.voiceWarmingUp) return W;
            return {
                ...W,
                voiceWarmingUp: !1
            }
        })
    }, [$, _]), jA((W, Z, G) => {
        if (!((z.getState().voiceEnabled ?? !1) && GI())) return;
        if (!Y || O) return;
        if (H === null) return;
        let v;
        if (j !== null) {
            if (Z.ctrl || Z.meta || Z.shift) return;
            if (W[0] !== j) return;
            if (W.length > 1 && W !== j.repeat(W.length)) return;
            v = W.length
        } else {
            if (!FL7(W, Z, H)) return;
            v = 1
        }
        let N = z.getState().voiceState ?? "idle";
        if (X.current && N !== "idle") {
            if (G.stopImmediatePropagation(), j !== null) q(v, {
                char: j,
                floor: D.current
            });
            A();
            return
        }
        let V = J.current;
        if (J.current += v, J.current >= Nvz) {
            if (G.stopImmediatePropagation(), P.current) clearTimeout(P.current), P.current = null;
            if (J.current = 0, X.current = !0, _((L) => {
                    if (!L.voiceWarmingUp) return L;
                    return {
                        ...L,
                        voiceWarmingUp: !1
                    }
                }), j !== null) D.current = q(M.current + v, {
                char: j,
                anchor: !0
            }), M.current = 0;
            else q(0, {
                anchor: !0
            });
            if (A(), (z.getState().voiceState ?? "idle") === "idle") X.current = !1, K();
            return
        }
        if (j !== null)
            if (V >= Sgq) G.stopImmediatePropagation(), q(v, {
                char: j,
                floor: M.current
            });
            else M.current += v;
        else G.stopImmediatePropagation();
        if (J.current >= Sgq) _((L) => {
            if (L.voiceWarmingUp) return L;
            return {
                ...L,
                voiceWarmingUp: !0
            }
        });
        if (P.current) clearTimeout(P.current);
        P.current = setTimeout((L, h, R, u) => {
            L.current = null, h.current = 0, R.current = 0, u((I) => {
                if (!I.voiceWarmingUp) return I;
                return {
                    ...I,
                    voiceWarmingUp: !1
                }
            })
        }, vvz, P, J, M, _)
    }, {
        isActive: !0
    }), null
}
// @from(Ln 507998, Col 4)
GM
// @from(Ln 507998, Col 8)
Tvz
// @from(Ln 507998, Col 13)
vvz = 120
// @from(Ln 507999, Col 4)
Nvz = 5
// @from(Ln 508000, Col 4)
Sgq = 2
// @from(Ln 508001, Col 4)
Vvz
// @from(Ln 508002, Col 4)
nt8 = E(() => {
    i6();
    NA();
    wz();
    fZ();
    Rm();
    Uu6();
    Id();
    GM = t(P6(), 1), Tvz = (Si8(), k4(MZq)), Vvz = {
        key: " ",
        ctrl: !1,
        alt: !1,
        shift: !1,
        meta: !1,
        super: !1
    }
})
// @from(Ln 508019, Col 4)
Cgq = {}
// @from(Ln 508024, Col 0)
function yvz({
    isLoading: A,
    assistantMode: q = !1
}) {
    let K = vb1.useRef(A);
    K.current = A;
    let Y = S5(),
        z = xA();
    vb1.useEffect(() => {
        if (!kR()) return;
        let _ = (O) => w0({
                value: O,
                mode: "prompt",
                priority: "later",
                isMeta: !0,
                workload: rA1
            }),
            w = Ds8({
                onFire: _,
                onFireTask: (O) => {
                    if (O.agentId) {
                        let $ = _g(O.agentId, Y.getState().tasks);
                        if ($ && !LJ6($.status)) {
                            tQ6($.id, O.prompt, z);
                            return
                        }
                        k(`[ScheduledTasks] teammate ${O.agentId} gone, removing orphaned cron ${O.id}`), yz6([O.id]);
                        return
                    }
                    _(O.prompt)
                },
                isLoading: () => K.current,
                assistantMode: q,
                getJitterConfig: Ws8,
                isKilled: () => !kR()
            });
        return w.start(), () => w.stop()
    }, [q])
}
// @from(Ln 508063, Col 4)
vb1
// @from(Ln 508064, Col 4)
Igq = E(() => {
    Xs8();
    Zs8();
    aH();
    nt();
    E76();
    Rz6();
    NA();
    sk();
    H1();
    qL();
    vb1 = t(P6(), 1)
})
// @from(Ln 508077, Col 4)
Fgq = {}
// @from(Ln 508089, Col 0)
function Bvz(A) {
    let q = A6(3),
        {
            showAllInTranscript: K,
            virtualScroll: Y
        } = A,
        z = Rq("app:toggleTranscript", "Global", "ctrl+o"),
        _ = Rq("transcript:toggleShowAll", "Transcript", "ctrl+e"),
        w = Rq("scroll:pageUp", "Scroll", "PgUp"),
        O = Rq("scroll:pageDown", "Scroll", "PgDn"),
        $ = Y ? ` · ${w}/${O} to scroll` : ` · ${_} to ${K?"collapse":"show all"}`,
        H;
    if (q[0] !== $ || q[1] !== z) H = b8.createElement(m, {
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
    }, b8.createElement(T, {
        dimColor: !0
    }, "Showing detailed transcript · ", z, " to toggle", $)), q[0] = $, q[1] = z, q[2] = H;
    else H = q[2];
    return H
}
// @from(Ln 508119, Col 0)
function mgq(A) {
    let q = A6(5),
        {
            isAnimating: K,
            title: Y,
            disabled: z
        } = A,
        _ = p_(),
        [w, O] = N8.useState(0),
        $, H;
    if (q[0] !== z || q[1] !== K || q[2] !== _) $ = () => {
        if (z || !K || !_) return;
        let J = setInterval(Fvz, gvz, O);
        return () => clearInterval(J)
    }, H = [z, K, _], q[0] = z, q[1] = K, q[2] = _, q[3] = $, q[4] = H;
    else $ = q[3], H = q[4];
    N8.useEffect($, H);
    let j = K ? Bgq[w] ?? ugq : ugq;
    return M$1(z ? null : `${j} ${Y}`), null
}
// @from(Ln 508140, Col 0)
function Fvz(A) {
    return A(pvz)
}
// @from(Ln 508144, Col 0)
function pvz(A) {
    return (A + 1) % Bgq.length
}