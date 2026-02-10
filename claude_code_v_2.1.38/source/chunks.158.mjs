
// @from(Ln 405448, Col 0)
function GsY(A) {
    let q = e(6),
        {
            reason: K
        } = A;
    switch (K) {
        case "git-not-installed": {
            let Y;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = e6.createElement(e6.Fragment, null, e6.createElement(V, {
                dimColor: !0
            }, "Git is required to install marketplaces."), e6.createElement(V, {
                dimColor: !0
            }, "Please install git and restart Claude Code.")), q[0] = Y;
            else Y = q[0];
            return Y
        }
        case "all-blocked-by-policy": {
            let Y;
            if (q[1] === Symbol.for("react.memo_cache_sentinel")) Y = e6.createElement(e6.Fragment, null, e6.createElement(V, {
                dimColor: !0
            }, "Your organization policy does not allow any external marketplaces."), e6.createElement(V, {
                dimColor: !0
            }, "Contact your administrator.")), q[1] = Y;
            else Y = q[1];
            return Y
        }
        case "policy-restricts-sources": {
            let Y;
            if (q[2] === Symbol.for("react.memo_cache_sentinel")) Y = e6.createElement(e6.Fragment, null, e6.createElement(V, {
                dimColor: !0
            }, "Your organization restricts which marketplaces can be added."), e6.createElement(V, {
                dimColor: !0
            }, "Switch to the Marketplaces tab to view allowed sources.")), q[2] = Y;
            else Y = q[2];
            return Y
        }
        case "all-marketplaces-failed": {
            let Y;
            if (q[3] === Symbol.for("react.memo_cache_sentinel")) Y = e6.createElement(e6.Fragment, null, e6.createElement(V, {
                dimColor: !0
            }, "Failed to load marketplace data."), e6.createElement(V, {
                dimColor: !0
            }, "Check your network connection.")), q[3] = Y;
            else Y = q[3];
            return Y
        }
        case "all-plugins-installed": {
            let Y;
            if (q[4] === Symbol.for("react.memo_cache_sentinel")) Y = e6.createElement(e6.Fragment, null, e6.createElement(V, {
                dimColor: !0
            }, "All available plugins are already installed."), e6.createElement(V, {
                dimColor: !0
            }, "Check for new plugins later or add more marketplaces.")), q[4] = Y;
            else Y = q[4];
            return Y
        }
        case "no-marketplaces-configured":
        default: {
            let Y;
            if (q[5] === Symbol.for("react.memo_cache_sentinel")) Y = e6.createElement(e6.Fragment, null, e6.createElement(V, {
                dimColor: !0
            }, "No plugins available."), e6.createElement(V, {
                dimColor: !0
            }, "Add a marketplace first using the Marketplaces tab.")), q[5] = Y;
            else Y = q[5];
            return Y
        }
    }
}
// @from(Ln 405517, Col 4)
e6
// @from(Ln 405517, Col 8)
tO
// @from(Ln 405518, Col 4)
AKq = v(() => {
    i1();
    m1();
    K7();
    b7();
    mq();
    HZ1();
    $Z1();
    p$();
    Xa();
    p8();
    tR();
    u6();
    y6();
    Z6();
    Oj();
    ad();
    mM();
    Sp1();
    vxA();
    mV6();
    HK();
    BK();
    e6 = o(X1(), 1), tO = o(X1(), 1)
})
// @from(Ln 405543, Col 4)
qKq = {}
// @from(Ln 405556, Col 0)
async function VZ1() {
    let A = C8(),
        q = [];
    if (A.enabledPlugins) {
        for (let [K, Y] of Object.entries(A.enabledPlugins))
            if (K.includes("@") && Y) q.push(K)
    }
    return q
}
// @from(Ln 405566, Col 0)
function NZ1() {
    let A = new Map,
        q = [{
            scope: "managed",
            source: "policySettings"
        }, {
            scope: "user",
            source: "userSettings"
        }, {
            scope: "project",
            source: "projectSettings"
        }, {
            scope: "local",
            source: "localSettings"
        }, {
            scope: "flag",
            source: "flagSettings"
        }];
    for (let {
            scope: K,
            source: Y
        }
        of q) {
        let z = y7(Y);
        if (!z?.enabledPlugins) continue;
        for (let [w, H] of Object.entries(z.enabledPlugins)) {
            if (!w.includes("@")) continue;
            if (H === !0) A.set(w, K);
            else if (H === !1) A.delete(w)
        }
    }
    return h(`Found ${A.size} enabled plugins with scopes: ${Array.from(A.entries()).map(([K,Y])=>`${K}(${Y})`).join(", ")}`), A
}
// @from(Ln 405600, Col 0)
function fsY(A) {
    return A !== "flag"
}
// @from(Ln 405604, Col 0)
function VsY(A) {
    return EXA[A]
}
// @from(Ln 405607, Col 0)
async function TZ1() {
    IXA().catch((K) => {
        K1(K instanceof Error ? K : Error(String(K)))
    });
    let A = CXA(),
        q = Object.keys(A.plugins);
    return h(`Found ${q.length} installed plugins (V2 format)`), q
}
// @from(Ln 405615, Col 0)
async function kxA(A) {
    try {
        let q = await TZ1(),
            K = [];
        for (let Y of A)
            if (!q.includes(Y)) try {
                if (await a0(Y)) K.push(Y)
            } catch (z) {
                h(`Failed to check plugin ${Y} in marketplace: ${z}`)
            }
        return K
    } catch (q) {
        return K1(q instanceof Error ? q : Error(String(q))), []
    }
}
// @from(Ln 405630, Col 0)
async function LxA(A, q, K = "user") {
    let Y = K !== "user" ? h6() : void 0,
        z = kB(K),
        w = y7(z),
        H = {
            ...w?.enabledPlugins
        },
        $ = [],
        O = [];
    for (let _ = 0; _ < A.length; _++) {
        let J = A[_];
        if (!J) continue;
        if (q) q(J, _ + 1, A.length);
        try {
            let X = await a0(J);
            if (!X) {
                O.push({
                    name: J,
                    error: "Plugin not found in any marketplace"
                });
                continue
            }
            let {
                entry: D,
                marketplaceInstallLocation: j
            } = X;
            if (!tx(D.source)) await HE(J, D, K, Y);
            else On4({
                pluginId: J,
                installPath: ZsY(j, D.source),
                version: D.version
            }, K, Y);
            H[J] = !0, $.push(J)
        } catch (X) {
            let D = X instanceof Error ? X.message : String(X);
            O.push({
                name: J,
                error: D
            }), K1(X instanceof Error ? X : Error(String(X)))
        }
    }
    return Z7(z, {
        ...w,
        enabledPlugins: H
    }), {
        installed: $,
        failed: O
    }
}
// @from(Ln 405679, Col 4)
vZ1 = v(() => {
    p8();
    p$();
    y6();
    Z6();
    p8();
    N0();
    ad();
    Qq1();
    N7();
    mM()
})
// @from(Ln 405696, Col 0)
function FV6(A) {
    if (!ZP.includes(A)) throw Error(`Invalid scope "${A}". Must be one of: ${ZP.join(", ")}`)
}
// @from(Ln 405700, Col 0)
function I91(A) {
    return ZP.includes(A)
}
// @from(Ln 405704, Col 0)
function We(A) {
    return A === "project" || A === "local" ? y8() : void 0
}
// @from(Ln 405708, Col 0)
function TsY(A, q, K) {
    let Y = "";
    if (Object.keys(K?.enabledPlugins || {}).forEach((z) => {
            if (z === A || z === q.name || z.startsWith(`${q.name}@`)) Y = z
        }), !Y) Y = A.includes("@") ? A : q.name;
    return Y
}
// @from(Ln 405716, Col 0)
function vsY(A, q) {
    let {
        name: K,
        marketplace: Y
    } = Da(A);
    return q.find((z) => {
        if (z.name === A || z.name === K) return !0;
        if (Y && z.source) return z.name === K && z.source.includes(`@${Y}`);
        return !1
    })
}
// @from(Ln 405728, Col 0)
function EsY(A) {
    let {
        name: q
    } = Da(A), K = uM();
    if (K.plugins[A]?.length) return {
        pluginId: A,
        pluginName: q
    };
    let Y = Object.keys(K.plugins).find((z) => {
        let {
            name: w
        } = Da(z);
        return w === q && (K.plugins[z]?.length ?? 0) > 0
    });
    if (Y) return {
        pluginId: Y,
        pluginName: q
    };
    return null
}
// @from(Ln 405749, Col 0)
function S91(A) {
    let K = uM().plugins[A];
    if (!K || K.length === 0) return {
        scope: "user"
    };
    let Y = y8(),
        z = K.find(($) => $.scope === "local" && $.projectPath === Y);
    if (z) return {
        scope: z.scope,
        projectPath: z.projectPath
    };
    let w = K.find(($) => $.scope === "project" && $.projectPath === Y);
    if (w) return {
        scope: w.scope,
        projectPath: w.projectPath
    };
    let H = K.find(($) => $.scope === "user");
    if (H) return {
        scope: H.scope
    };
    return {
        scope: K[0].scope,
        projectPath: K[0].projectPath
    }
}
// @from(Ln 405774, Col 0)
async function KKq(A, q = "user") {
    FV6(q);
    let {
        name: K,
        marketplace: Y
    } = Da(A), z, w, H;
    if (Y) {
        let W = await a0(A);
        if (W) z = W.entry, w = Y, H = W.marketplaceInstallLocation
    } else {
        let W = await n5();
        for (let [G, f] of Object.entries(W)) try {
            let N = (await NZ(G)).plugins.find((T) => T.name === K);
            if (N) {
                z = N, w = G, H = f.installLocation;
                break
            }
        } catch (Z) {
            K1(Z instanceof Error ? Z : Error(`Failed to load marketplace "${G}": ${Z}`));
            continue
        }
    }
    if (!z || !w) {
        let W = Y ? `marketplace "${Y}"` : "any configured marketplace";
        return {
            success: !1,
            message: `Plugin "${K}" not found in ${W}`
        }
    }
    let $ = z,
        O = `${$.name}@${w}`,
        _ = We(q),
        J, {
            source: X
        } = $;
    if (tx(X)) {
        if (!H) return {
            success: !1,
            message: `Cannot install local plugin "${K}" without marketplace install location`
        };
        J = RxA(H, X)
    }
    await HE(O, $, q, _, J);
    let D = kB(q),
        M = {
            ...y7(D)?.enabledPlugins,
            [O]: !0
        },
        {
            error: P
        } = Z7(D, {
            enabledPlugins: M
        });
    if (P) return {
        success: !1,
        message: `Failed to update settings: ${P.message}`
    };
    return Uw(), {
        success: !0,
        message: `Successfully installed plugin: ${O} (scope: ${q})`,
        pluginId: O,
        pluginName: $.name,
        scope: q
    }
}
// @from(Ln 405839, Col 0)
async function QV6(A, q = "user") {
    FV6(q);
    let {
        enabled: K,
        disabled: Y
    } = await iY(), z = [...K, ...Y], w = vsY(A, z), H = kB(q), $ = y7(H), O, _;
    if (w) O = TsY(A, w, $), _ = w.name;
    else {
        let f = EsY(A);
        if (!f) return {
            success: !1,
            message: `Plugin "${A}" not found in installed plugins`
        };
        O = f.pluginId, _ = f.pluginName
    }
    let J = We(q),
        D = uM().plugins[O],
        j = D?.find((f) => f.scope === q && f.projectPath === J);
    if (!j) {
        let {
            scope: f
        } = S91(O);
        if (f !== q && D && D.length > 0) return {
            success: !1,
            message: `Plugin "${A}" is installed in ${f} scope, not ${q}. Use --scope ${f} to uninstall.`
        };
        return {
            success: !1,
            message: `Plugin "${A}" is not installed in ${q} scope. Use --scope to specify the correct scope.`
        }
    }
    let M = j.installPath,
        P = {
            ...$?.enabledPlugins
        };
    P[O] = void 0, Z7(H, {
        enabledPlugins: P
    }), Uw(), $b7(O, q, J);
    let G = uM().plugins[O];
    if ((!G || G.length === 0) && M) tW1(M);
    return {
        success: !0,
        message: `Successfully uninstalled plugin: ${_} (scope: ${q})`,
        pluginId: O,
        pluginName: _,
        scope: q
    }
}
// @from(Ln 405887, Col 0)
async function yxA(A, q, K) {
    let Y = q ? "enable" : "disable";
    if (K) FV6(K);
    let z = uM(),
        w = NZ1(),
        H = A.includes("@") ? A : null,
        O = Object.keys(z.plugins).find((D) => {
            if (H) return D === H;
            return D.startsWith(`${A}@`)
        });
    if (!O) return {
        success: !1,
        message: `Plugin "${A}" is not installed`
    };
    let _ = w.has(O);
    if (q && _) return {
        success: !1,
        message: `Plugin "${A}" is already enabled`
    };
    if (!q && !_) return {
        success: !1,
        message: `Plugin "${A}" is already disabled`
    };
    let [J] = O.split("@"), X;
    if (K) {
        let D = We(K);
        X = {
            scope: K,
            projectPath: D
        };
        let j = S91(O);
        if (j.scope !== K) return {
            success: !1,
            message: `Plugin "${A}" is installed at ${j.scope} scope, not ${K}. Use --scope ${j.scope} or omit --scope to auto-detect.`
        }
    } else X = S91(O);
    if (!I91(X.scope)) return {
        success: !1,
        message: `Managed plugins cannot be ${Y}d. They can only be updated.`
    };
    try {
        let D = kB(X.scope),
            M = (y7(D) || {}).enabledPlugins || {},
            {
                error: P
            } = Z7(D, {
                enabledPlugins: {
                    ...M,
                    [O]: q
                }
            });
        if (P) throw P;
        Uw()
    } catch (D) {
        return K1(D instanceof Error ? D : Error(`Failed to ${Y} plugin`)), {
            success: !1,
            message: D instanceof Error ? D.message : `Failed to ${Y} plugin`
        }
    }
    return {
        success: !0,
        message: `Successfully ${Y}d plugin: ${J} (scope: ${X.scope})`,
        pluginId: O,
        pluginName: J,
        scope: X.scope
    }
}
// @from(Ln 405954, Col 0)
async function x91(A, q) {
    return yxA(A, !0, q)
}
// @from(Ln 405957, Col 0)
async function hp1(A, q) {
    return yxA(A, !1, q)
}
// @from(Ln 405960, Col 0)
async function YKq() {
    let A = NZ1();
    if (A.size === 0) return {
        success: !0,
        message: "No enabled plugins to disable"
    };
    let q = [],
        K = [];
    for (let [Y] of A) {
        let z = await yxA(Y, !1);
        if (z.success) q.push(Y);
        else K.push(`${Y}: ${z.message}`)
    }
    if (K.length > 0) return {
        success: !1,
        message: `Disabled ${q.length} plugin${q.length===1?"":"s"}, ${K.length} failed:
${K.join(`
`)}`
    };
    return {
        success: !0,
        message: `Disabled ${q.length} plugin${q.length===1?"":"s"}`
    }
}
// @from(Ln 405984, Col 0)
async function EZ1(A, q) {
    let {
        name: K,
        marketplace: Y
    } = Da(A), z = Y ? `${K}@${Y}` : A, w = await a0(A);
    if (!w) return {
        success: !1,
        message: `Plugin "${K}" not found`,
        pluginId: z,
        scope: q
    };
    let {
        entry: H,
        marketplaceInstallLocation: $
    } = w, _ = ja().plugins[z];
    if (!_ || _.length === 0) return {
        success: !1,
        message: `Plugin "${K}" is not installed`,
        pluginId: z,
        scope: q
    };
    let J = We(q),
        X = _.find((D) => D.scope === q && D.projectPath === J);
    if (!X) {
        let D = J ? `${q} (${J})` : q;
        return {
            success: !1,
            message: `Plugin "${K}" is not installed at scope ${D}`,
            pluginId: z,
            scope: q
        }
    }
    return ksY({
        pluginId: z,
        pluginName: K,
        entry: H,
        marketplaceInstallLocation: $,
        installation: X,
        scope: q,
        projectPath: J
    })
}
// @from(Ln 406026, Col 0)
async function ksY({
    pluginId: A,
    pluginName: q,
    entry: K,
    marketplaceInstallLocation: Y,
    installation: z,
    scope: w,
    projectPath: H
}) {
    let $ = b1(),
        O = z.version,
        _, J, X = !1;
    if (typeof K.source !== "string") {
        let D = await F51(K.source, {
            manifest: {
                name: K.name
            }
        });
        _ = D.path, X = !0, J = await od(A, K.source, D.manifest, D.path, K.version)
    } else {
        if (!$.existsSync(Y)) return {
            success: !1,
            message: `Marketplace directory not found at ${Y}`,
            pluginId: A,
            scope: w
        };
        let D = $.statSync(Y).isDirectory() ? Y : NsY(Y);
        if (_ = RxA(D, K.source), !$.existsSync(_)) return {
            success: !1,
            message: `Plugin source not found at ${_}`,
            pluginId: A,
            scope: w
        };
        let j, M = RxA(_, ".claude-plugin", "plugin.json");
        try {
            j = XG6(M, K.name, K.source)
        } catch {}
        J = await od(A, K.source, j, _, K.version)
    }
    try {
        let D = RB(A, J);
        if (z.version === J || z.installPath === D) return {
            success: !0,
            message: `${q} is already at the latest version (${J}).`,
            pluginId: A,
            newVersion: J,
            oldVersion: O,
            alreadyUpToDate: !0,
            scope: w
        };
        if (!$.existsSync(D)) await JG6(_, A, J, K);
        let M = z.installPath;
        if (Ob7(A, w, H, D, J), M && M !== D) {
            let G = ja();
            if (!Object.values(G.plugins).some((Z) => Z.some((N) => N.installPath === M)) && $.existsSync(M)) tW1(M)
        }
        let P = H ? `${w} (${H})` : w;
        return {
            success: !0,
            message: `Plugin "${q}" updated from ${O||"unknown"} to ${J} for scope ${P}. Restart to apply changes.`,
            pluginId: A,
            newVersion: J,
            oldVersion: O,
            scope: w
        }
    } finally {
        if (X && _ !== RB(A, J)) $.rmSync(_, {
            recursive: !0,
            force: !0
        })
    }
}
// @from(Ln 406098, Col 4)
ZP
// @from(Ln 406098, Col 8)
h91
// @from(Ln 406099, Col 4)
kZ1 = v(() => {
    VJ();
    mM();
    ad();
    p$();
    N0();
    p8();
    tR();
    Qq1();
    B6();
    _G6();
    _8();
    y6();
    vZ1();
    ZP = ["user", "project", "local"], h91 = ["user", "project", "local", "managed"]
})
// @from(Ln 406116, Col 0)
function zKq(A) {
    let q = e(61),
        {
            pluginName: K,
            serverName: Y,
            configSchema: z,
            onSave: w,
            onCancel: H
        } = A,
        $;
    if (q[0] !== z) $ = Object.keys(z), q[0] = z, q[1] = $;
    else $ = q[1];
    let O = $,
        [_, J] = gV6.useState(0),
        X;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) X = {}, q[2] = X;
    else X = q[2];
    let [D, j] = gV6.useState(X), [M, P] = gV6.useState(""), W = O[_], G = W ? z[W] : null, f;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) f = {
        context: "Settings"
    }, q[3] = f;
    else f = q[3];
    DA("confirm:no", H, f);
    let Z;
    if (q[4] !== W || q[5] !== _ || q[6] !== M || q[7] !== O.length) Z = () => {
        if (_ < O.length - 1 && W) j((M1) => ({
            ...M1,
            [W]: M
        })), J(ysY), P("")
    }, q[4] = W, q[5] = _, q[6] = M, q[7] = O.length, q[8] = Z;
    else Z = q[8];
    let N = Z,
        T;
    if (q[9] !== z || q[10] !== W || q[11] !== _ || q[12] !== M || q[13] !== O || q[14] !== w || q[15] !== D) T = () => {
        if (!W) return;
        let M1 = {
            ...D,
            [W]: M
        };
        if (_ === O.length - 1) {
            let z1 = {};
            for (let Y1 of O) {
                let _1 = M1[Y1] || "",
                    $1 = z[Y1];
                if ($1?.type === "number") {
                    let G1 = Number(_1);
                    z1[Y1] = isNaN(G1) ? _1 : G1
                } else if ($1?.type === "boolean") z1[Y1] = J6(_1);
                else z1[Y1] = _1
            }
            w(z1)
        } else j(M1), J(RsY), P("")
    }, q[9] = z, q[10] = W, q[11] = _, q[12] = M, q[13] = O, q[14] = w, q[15] = D, q[16] = T;
    else T = q[16];
    let k = T,
        y;
    if (q[17] !== k || q[18] !== N) y = {
        "confirm:nextField": N,
        "confirm:yes": k
    }, q[17] = k, q[18] = N, q[19] = y;
    else y = q[19];
    let B;
    if (q[20] === Symbol.for("react.memo_cache_sentinel")) B = {
        context: "Confirmation"
    }, q[20] = B;
    else B = q[20];
    c7(y, B);
    let S;
    if (q[21] === Symbol.for("react.memo_cache_sentinel")) S = (M1, z1) => {
        if (z1.backspace || z1.delete) {
            P(LsY);
            return
        }
        if (M1 && !z1.ctrl && !z1.meta && !z1.tab && !z1.return) P((Y1) => Y1 + M1)
    }, q[21] = S;
    else S = q[21];
    if (D8(S), !G || !W) return null;
    let m = G.sensitive === !0,
        b = G.required === !0,
        g;
    if (q[22] !== M || q[23] !== m) g = m ? "*".repeat(UA(M)) : M, q[22] = M, q[23] = m, q[24] = g;
    else g = q[24];
    let U = g,
        x = `Configure ${Y}`,
        p = `Plugin: ${K}`,
        l = G.title || W,
        r;
    if (q[25] !== b) r = b && SN.default.createElement(V, {
        color: "error"
    }, " *"), q[25] = b, q[26] = r;
    else r = q[26];
    let s;
    if (q[27] !== l || q[28] !== r) s = SN.default.createElement(V, {
        bold: !0
    }, l, r), q[27] = l, q[28] = r, q[29] = s;
    else s = q[29];
    let O1;
    if (q[30] !== G.description) O1 = G.description && SN.default.createElement(V, {
        dimColor: !0
    }, G.description), q[30] = G.description, q[31] = O1;
    else O1 = q[31];
    let T1;
    if (q[32] === Symbol.for("react.memo_cache_sentinel")) T1 = SN.default.createElement(V, null, l1.pointerSmall, " "), q[32] = T1;
    else T1 = q[32];
    let N1;
    if (q[33] !== U) N1 = SN.default.createElement(V, null, U), q[33] = U, q[34] = N1;
    else N1 = q[34];
    let j1;
    if (q[35] === Symbol.for("react.memo_cache_sentinel")) j1 = SN.default.createElement(V, null, "█"), q[35] = j1;
    else j1 = q[35];
    let q1;
    if (q[36] !== N1) q1 = SN.default.createElement(I, {
        marginTop: 1
    }, T1, N1, j1), q[36] = N1, q[37] = q1;
    else q1 = q[37];
    let t;
    if (q[38] !== s || q[39] !== O1 || q[40] !== q1) t = SN.default.createElement(I, {
        flexDirection: "column"
    }, s, O1, q1), q[38] = s, q[39] = O1, q[40] = q1, q[41] = t;
    else t = q[41];
    let J1 = _ + 1,
        D1;
    if (q[42] !== O.length || q[43] !== J1) D1 = SN.default.createElement(V, {
        dimColor: !0
    }, "Field ", J1, " of ", O.length), q[42] = O.length, q[43] = J1, q[44] = D1;
    else D1 = q[44];
    let Z1;
    if (q[45] !== _ || q[46] !== O.length) Z1 = _ < O.length - 1 && SN.default.createElement(V, {
        dimColor: !0
    }, "Tab: Next field · Enter: Save and continue"), q[45] = _, q[46] = O.length, q[47] = Z1;
    else Z1 = q[47];
    let E1;
    if (q[48] !== _ || q[49] !== O.length) E1 = _ === O.length - 1 && SN.default.createElement(V, {
        dimColor: !0
    }, "Enter: Save configuration"), q[48] = _, q[49] = O.length, q[50] = E1;
    else E1 = q[50];
    let a;
    if (q[51] !== D1 || q[52] !== Z1 || q[53] !== E1) a = SN.default.createElement(I, {
        flexDirection: "column"
    }, D1, Z1, E1), q[51] = D1, q[52] = Z1, q[53] = E1, q[54] = a;
    else a = q[54];
    let A1;
    if (q[55] !== H || q[56] !== x || q[57] !== p || q[58] !== t || q[59] !== a) A1 = SN.default.createElement(w8, {
        title: x,
        subtitle: p,
        onCancel: H,
        isCancelActive: !1
    }, t, a), q[55] = H, q[56] = x, q[57] = p, q[58] = t, q[59] = a, q[60] = A1;
    else A1 = q[60];
    return A1
}
// @from(Ln 406268, Col 0)
function LsY(A) {
    return A.slice(0, -1)
}
// @from(Ln 406272, Col 0)
function RsY(A) {
    return A + 1
}
// @from(Ln 406276, Col 0)
function ysY(A) {
    return A + 1
}
// @from(Ln 406279, Col 4)
SN
// @from(Ln 406279, Col 8)
gV6
// @from(Ln 406280, Col 4)
wKq = v(() => {
    i1();
    m1();
    K7();
    Bq();
    b7();
    hA();
    LY();
    SN = o(X1(), 1), gV6 = o(X1(), 1)
})
// @from(Ln 406291, Col 0)
function HKq(A) {
    let q = e(113),
        {
            item: K,
            isSelected: Y
        } = A,
        [z] = T7();
    if (K.type === "plugin") {
        let N, T;
        if (K.pendingToggle) {
            let T1;
            if (q[0] !== z) T1 = k8("suggestion", z)(l1.arrowRight), q[0] = z, q[1] = T1;
            else T1 = q[1];
            N = T1, T = K.pendingToggle === "will-enable" ? "will enable" : "will disable"
        } else if (K.errorCount > 0) {
            let T1;
            if (q[2] !== z) T1 = k8("error", z)(l1.cross), q[2] = z, q[3] = T1;
            else T1 = q[3];
            N = T1, T = `${K.errorCount} error${K.errorCount!==1?"s":""}`
        } else if (!K.isEnabled) {
            let T1;
            if (q[4] !== z) T1 = k8("inactive", z)(l1.radioOff), q[4] = z, q[5] = T1;
            else T1 = q[5];
            N = T1, T = "disabled"
        } else {
            let T1;
            if (q[6] !== z) T1 = k8("success", z)(l1.tick), q[6] = z, q[7] = T1;
            else T1 = q[7];
            N = T1, T = "enabled"
        }
        let k = Y ? "suggestion" : void 0,
            y = Y ? `${l1.pointer} ` : "  ",
            B;
        if (q[8] !== k || q[9] !== y) B = Kq.createElement(V, {
            color: k
        }, y), q[8] = k, q[9] = y, q[10] = B;
        else B = q[10];
        let S = Y ? "suggestion" : void 0,
            m;
        if (q[11] !== K.name || q[12] !== S) m = Kq.createElement(V, {
            color: S
        }, K.name), q[11] = K.name, q[12] = S, q[13] = m;
        else m = q[13];
        let b = !Y,
            g;
        if (q[14] === Symbol.for("react.memo_cache_sentinel")) g = Kq.createElement(V, {
            backgroundColor: "userMessageBackground"
        }, "Plugin"), q[14] = g;
        else g = q[14];
        let U;
        if (q[15] !== b) U = Kq.createElement(V, {
            dimColor: b
        }, " ", g), q[15] = b, q[16] = U;
        else U = q[16];
        let x;
        if (q[17] !== K.marketplace) x = Kq.createElement(V, {
            dimColor: !0
        }, " · ", K.marketplace), q[17] = K.marketplace, q[18] = x;
        else x = q[18];
        let p = !Y,
            l;
        if (q[19] !== N || q[20] !== p) l = Kq.createElement(V, {
            dimColor: p
        }, " · ", N, " "), q[19] = N, q[20] = p, q[21] = l;
        else l = q[21];
        let r = !Y,
            s;
        if (q[22] !== T || q[23] !== r) s = Kq.createElement(V, {
            dimColor: r
        }, T), q[22] = T, q[23] = r, q[24] = s;
        else s = q[24];
        let O1;
        if (q[25] !== l || q[26] !== s || q[27] !== B || q[28] !== m || q[29] !== U || q[30] !== x) O1 = Kq.createElement(I, null, B, m, U, x, l, s), q[25] = l, q[26] = s, q[27] = B, q[28] = m, q[29] = U, q[30] = x, q[31] = O1;
        else O1 = q[31];
        return O1
    }
    if (K.type === "failed-plugin") {
        let N;
        if (q[32] !== z) N = k8("error", z)(l1.cross), q[32] = z, q[33] = N;
        else N = q[33];
        let T = N,
            k = `failed to load · ${K.errorCount} error${K.errorCount!==1?"s":""}`,
            y = Y ? "suggestion" : void 0,
            B = Y ? `${l1.pointer} ` : "  ",
            S;
        if (q[34] !== y || q[35] !== B) S = Kq.createElement(V, {
            color: y
        }, B), q[34] = y, q[35] = B, q[36] = S;
        else S = q[36];
        let m = Y ? "suggestion" : void 0,
            b;
        if (q[37] !== K.name || q[38] !== m) b = Kq.createElement(V, {
            color: m
        }, K.name), q[37] = K.name, q[38] = m, q[39] = b;
        else b = q[39];
        let g = !Y,
            U;
        if (q[40] === Symbol.for("react.memo_cache_sentinel")) U = Kq.createElement(V, {
            backgroundColor: "userMessageBackground"
        }, "Plugin"), q[40] = U;
        else U = q[40];
        let x;
        if (q[41] !== g) x = Kq.createElement(V, {
            dimColor: g
        }, " ", U), q[41] = g, q[42] = x;
        else x = q[42];
        let p;
        if (q[43] !== K.marketplace) p = Kq.createElement(V, {
            dimColor: !0
        }, " · ", K.marketplace), q[43] = K.marketplace, q[44] = p;
        else p = q[44];
        let l = !Y,
            r;
        if (q[45] !== T || q[46] !== l) r = Kq.createElement(V, {
            dimColor: l
        }, " · ", T, " "), q[45] = T, q[46] = l, q[47] = r;
        else r = q[47];
        let s = !Y,
            O1;
        if (q[48] !== k || q[49] !== s) O1 = Kq.createElement(V, {
            dimColor: s
        }, k), q[48] = k, q[49] = s, q[50] = O1;
        else O1 = q[50];
        let T1;
        if (q[51] !== p || q[52] !== r || q[53] !== O1 || q[54] !== S || q[55] !== b || q[56] !== x) T1 = Kq.createElement(I, null, S, b, x, p, r, O1), q[51] = p, q[52] = r, q[53] = O1, q[54] = S, q[55] = b, q[56] = x, q[57] = T1;
        else T1 = q[57];
        return T1
    }
    let w, H;
    if (K.status === "connected") {
        let N;
        if (q[58] !== z) N = k8("success", z)(l1.tick), q[58] = z, q[59] = N;
        else N = q[59];
        w = N, H = "connected"
    } else if (K.status === "disabled") {
        let N;
        if (q[60] !== z) N = k8("inactive", z)(l1.radioOff), q[60] = z, q[61] = N;
        else N = q[61];
        w = N, H = "disabled"
    } else if (K.status === "pending") {
        let N;
        if (q[62] !== z) N = k8("inactive", z)(l1.radioOff), q[62] = z, q[63] = N;
        else N = q[63];
        w = N, H = "connecting…"
    } else if (K.status === "needs-auth") {
        let N;
        if (q[64] !== z) N = k8("warning", z)(l1.triangleUpOutline), q[64] = z, q[65] = N;
        else N = q[65];
        w = N, H = "needs auth"
    } else {
        let N;
        if (q[66] !== z) N = k8("error", z)(l1.cross), q[66] = z, q[67] = N;
        else N = q[67];
        w = N, H = "failed"
    }
    if (K.indented) {
        let N = Y ? "suggestion" : void 0,
            T = Y ? `${l1.pointer} ` : "  ",
            k;
        if (q[68] !== N || q[69] !== T) k = Kq.createElement(V, {
            color: N
        }, T), q[68] = N, q[69] = T, q[70] = k;
        else k = q[70];
        let y = !Y,
            B;
        if (q[71] !== y) B = Kq.createElement(V, {
            dimColor: y
        }, "└ "), q[71] = y, q[72] = B;
        else B = q[72];
        let S = Y ? "suggestion" : void 0,
            m;
        if (q[73] !== K.name || q[74] !== S) m = Kq.createElement(V, {
            color: S
        }, K.name), q[73] = K.name, q[74] = S, q[75] = m;
        else m = q[75];
        let b = !Y,
            g;
        if (q[76] === Symbol.for("react.memo_cache_sentinel")) g = Kq.createElement(V, {
            backgroundColor: "userMessageBackground"
        }, "MCP"), q[76] = g;
        else g = q[76];
        let U;
        if (q[77] !== b) U = Kq.createElement(V, {
            dimColor: b
        }, " ", g), q[77] = b, q[78] = U;
        else U = q[78];
        let x = !Y,
            p;
        if (q[79] !== w || q[80] !== x) p = Kq.createElement(V, {
            dimColor: x
        }, " · ", w, " "), q[79] = w, q[80] = x, q[81] = p;
        else p = q[81];
        let l = !Y,
            r;
        if (q[82] !== H || q[83] !== l) r = Kq.createElement(V, {
            dimColor: l
        }, H), q[82] = H, q[83] = l, q[84] = r;
        else r = q[84];
        let s;
        if (q[85] !== U || q[86] !== p || q[87] !== r || q[88] !== k || q[89] !== B || q[90] !== m) s = Kq.createElement(I, null, k, B, m, U, p, r), q[85] = U, q[86] = p, q[87] = r, q[88] = k, q[89] = B, q[90] = m, q[91] = s;
        else s = q[91];
        return s
    }
    let $ = Y ? "suggestion" : void 0,
        O = Y ? `${l1.pointer} ` : "  ",
        _;
    if (q[92] !== $ || q[93] !== O) _ = Kq.createElement(V, {
        color: $
    }, O), q[92] = $, q[93] = O, q[94] = _;
    else _ = q[94];
    let J = Y ? "suggestion" : void 0,
        X;
    if (q[95] !== K.name || q[96] !== J) X = Kq.createElement(V, {
        color: J
    }, K.name), q[95] = K.name, q[96] = J, q[97] = X;
    else X = q[97];
    let D = !Y,
        j;
    if (q[98] === Symbol.for("react.memo_cache_sentinel")) j = Kq.createElement(V, {
        backgroundColor: "userMessageBackground"
    }, "MCP"), q[98] = j;
    else j = q[98];
    let M;
    if (q[99] !== D) M = Kq.createElement(V, {
        dimColor: D
    }, " ", j), q[99] = D, q[100] = M;
    else M = q[100];
    let P = !Y,
        W;
    if (q[101] !== w || q[102] !== P) W = Kq.createElement(V, {
        dimColor: P
    }, " · ", w, " "), q[101] = w, q[102] = P, q[103] = W;
    else W = q[103];
    let G = !Y,
        f;
    if (q[104] !== H || q[105] !== G) f = Kq.createElement(V, {
        dimColor: G
    }, H), q[104] = H, q[105] = G, q[106] = f;
    else f = q[106];
    let Z;
    if (q[107] !== W || q[108] !== f || q[109] !== _ || q[110] !== X || q[111] !== M) Z = Kq.createElement(I, null, _, X, M, W, f), q[107] = W, q[108] = f, q[109] = _, q[110] = X, q[111] = M, q[112] = Z;
    else Z = q[112];
    return Z
}
// @from(Ln 406535, Col 4)
Kq
// @from(Ln 406536, Col 4)
$Kq = v(() => {
    i1();
    m1();
    b7();
    Kq = o(X1(), 1)
})
// @from(Ln 406543, Col 0)
function CxA(A) {
    switch (A.type) {
        case "path-not-found":
            return `${A.component} path not found: ${A.path}`;
        case "git-auth-failed":
            return `Git ${A.authType.toUpperCase()} authentication failed for ${A.gitUrl}`;
        case "git-timeout":
            return `Git ${A.operation} timed out for ${A.gitUrl}`;
        case "network-error":
            return `Network error accessing ${A.url}${A.details?`: ${A.details}`:""}`;
        case "manifest-parse-error":
            return `Failed to parse manifest at ${A.manifestPath}: ${A.parseError}`;
        case "manifest-validation-error":
            return `Invalid manifest at ${A.manifestPath}: ${A.validationErrors.join(", ")}`;
        case "plugin-not-found":
            return `Plugin '${A.pluginId}' not found in marketplace '${A.marketplace}'`;
        case "marketplace-not-found":
            return `Marketplace '${A.marketplace}' not found`;
        case "marketplace-load-failed":
            return `Failed to load marketplace '${A.marketplace}': ${A.reason}`;
        case "repository-scan-failed":
            return `Failed to scan repository at ${A.repositoryPath}: ${A.reason}`;
        case "mcp-config-invalid":
            return `Invalid MCP server config for '${A.serverName}': ${A.validationError}`;
        case "hook-load-failed":
            return `Failed to load hooks from ${A.hookPath}: ${A.reason}`;
        case "component-load-failed":
            return `Failed to load ${A.component} from ${A.path}: ${A.reason}`;
        case "mcpb-download-failed":
            return `Failed to download MCPB from ${A.url}: ${A.reason}`;
        case "mcpb-extract-failed":
            return `Failed to extract MCPB ${A.mcpbPath}: ${A.reason}`;
        case "mcpb-invalid-manifest":
            return `MCPB manifest invalid at ${A.mcpbPath}: ${A.validationError}`;
        case "marketplace-blocked-by-policy":
            return A.blockedByBlocklist ? `Marketplace '${A.marketplace}' is blocked by enterprise policy` : `Marketplace '${A.marketplace}' is not in the allowed marketplace list`;
        case "generic-error":
            return A.error;
        default:
            return "Unknown error"
    }
}
// @from(Ln 406586, Col 0)
function SxA(A) {
    switch (A.type) {
        case "path-not-found":
            return "Check that the path in your manifest or marketplace config is correct";
        case "git-auth-failed":
            return A.authType === "ssh" ? "Configure SSH keys or use HTTPS URL instead" : "Configure credentials or use SSH URL instead";
        case "git-timeout":
        case "network-error":
            return "Check your internet connection and try again";
        case "manifest-parse-error":
            return "Check manifest file syntax in the plugin directory";
        case "manifest-validation-error":
            return "Check manifest file follows the required schema";
        case "plugin-not-found":
            return `Plugin may not exist in marketplace '${A.marketplace}'`;
        case "marketplace-not-found":
            return A.availableMarketplaces.length > 0 ? `Available marketplaces: ${A.availableMarketplaces.join(", ")}` : "Add the marketplace first using /plugin marketplace add";
        case "mcp-config-invalid":
            return "Check MCP server configuration in .mcp.json or manifest";
        case "hook-load-failed":
            return "Check hooks.json file syntax and structure";
        case "component-load-failed":
            return `Check ${A.component} directory structure and file permissions`;
        case "mcpb-download-failed":
            return "Check your internet connection and URL accessibility";
        case "mcpb-extract-failed":
            return "Verify the MCPB file is valid and not corrupted";
        case "mcpb-invalid-manifest":
            return "Contact the plugin author about the invalid manifest";
        case "marketplace-blocked-by-policy":
            if (A.blockedByBlocklist) return "This marketplace source is explicitly blocked by your administrator";
            return A.allowedSources.length > 0 ? `Allowed sources: ${A.allowedSources.join(", ")}` : "Contact your administrator to configure allowed marketplace sources";
        case "repository-scan-failed":
        case "marketplace-load-failed":
        case "generic-error":
            return null;
        default:
            return null
    }
}
// @from(Ln 406627, Col 0)
function _Kq(A) {
    let q = e(31),
        {
            setViewState: K
        } = A,
        Y = v6(CsY),
        [z, w] = OKq.useState(0),
        H;
    if (q[0] !== Y.length || q[1] !== z) H = {
        totalItems: Y.length,
        selectedIndex: z
    }, q[0] = Y.length, q[1] = z, q[2] = H;
    else H = q[2];
    let $ = Me(H),
        O;
    if (q[3] !== K) O = () => {
        K({
            type: "menu"
        })
    }, q[3] = K, q[4] = O;
    else O = q[4];
    let _ = O,
        J;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Confirmation"
    }, q[5] = J;
    else J = q[5];
    DA("confirm:no", _, J);
    let X;
    if (q[6] !== Y.length || q[7] !== $ || q[8] !== z) X = (N, T) => {
        if (Y.length === 0) return;
        if (T.upArrow && z > 0) $.handleSelectionChange(z - 1, w);
        else if (T.downArrow && z < Y.length - 1) $.handleSelectionChange(z + 1, w)
    }, q[6] = Y.length, q[7] = $, q[8] = z, q[9] = X;
    else X = q[9];
    D8(X);
    let D, j, M, P, W;
    if (q[10] !== Y || q[11] !== $ || q[12] !== z) {
        let N = $.getVisibleItems(Y);
        if (D = I, j = "column", q[18] === Symbol.for("react.memo_cache_sentinel")) M = QK.createElement(I, {
            marginBottom: 1
        }, QK.createElement(V, {
            bold: !0
        }, "Plugin Errors")), q[18] = M;
        else M = q[18];
        if (q[19] !== $.scrollPosition.canScrollUp) P = $.scrollPosition.canScrollUp && QK.createElement(I, {
            marginLeft: 2
        }, QK.createElement(V, {
            dimColor: !0
        }, l1.arrowUp, " more above")), q[19] = $.scrollPosition.canScrollUp, q[20] = P;
        else P = q[20];
        W = Y.length === 0 ? QK.createElement(I, {
            marginLeft: 2
        }, QK.createElement(V, {
            dimColor: !0
        }, "No plugin errors")) : N.map((T, k) => {
            let y = $.toActualIndex(k),
                B = "plugin" in T ? T.plugin : void 0,
                S = SxA(T),
                m = y === z;
            return QK.createElement(I, {
                key: y,
                marginLeft: 2,
                flexDirection: "column",
                marginBottom: 1
            }, QK.createElement(V, null, QK.createElement(V, {
                color: m ? "suggestion" : "error"
            }, m ? l1.pointer : l1.cross, " "), B ? QK.createElement(QK.Fragment, null, QK.createElement(V, {
                bold: m
            }, B), QK.createElement(V, {
                dimColor: !0
            }, " from ", T.source)) : QK.createElement(V, {
                dimColor: !0
            }, T.source)), QK.createElement(I, {
                marginLeft: 3
            }, QK.createElement(V, {
                color: "error",
                dimColor: !0
            }, CxA(T))), S && QK.createElement(I, {
                marginLeft: 3
            }, QK.createElement(V, {
                dimColor: !0,
                italic: !0
            }, l1.arrowRight, " ", S)))
        }), q[10] = Y, q[11] = $, q[12] = z, q[13] = D, q[14] = j, q[15] = M, q[16] = P, q[17] = W
    } else D = q[13], j = q[14], M = q[15], P = q[16], W = q[17];
    let G;
    if (q[21] !== $.scrollPosition.canScrollDown) G = $.scrollPosition.canScrollDown && QK.createElement(I, {
        marginLeft: 2
    }, QK.createElement(V, {
        dimColor: !0
    }, l1.arrowDown, " more below")), q[21] = $.scrollPosition.canScrollDown, q[22] = G;
    else G = q[22];
    let f;
    if (q[23] === Symbol.for("react.memo_cache_sentinel")) f = QK.createElement(I, {
        marginTop: 1
    }, QK.createElement(V, {
        dimColor: !0,
        italic: !0
    }, QK.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "close"
    }))), q[23] = f;
    else f = q[23];
    let Z;
    if (q[24] !== D || q[25] !== j || q[26] !== M || q[27] !== P || q[28] !== W || q[29] !== G) Z = QK.createElement(D, {
        flexDirection: j
    }, M, P, W, G, f), q[24] = D, q[25] = j, q[26] = M, q[27] = P, q[28] = W, q[29] = G, q[30] = Z;
    else Z = q[30];
    return Z
}
// @from(Ln 406741, Col 0)
function CsY(A) {
    return A.plugins.errors
}
// @from(Ln 406744, Col 4)
QK
// @from(Ln 406744, Col 8)
OKq
// @from(Ln 406745, Col 4)
hxA = v(() => {
    i1();
    m1();
    K7();
    d8();
    Sp1();
    b7();
    BK();
    QK = o(X1(), 1), OKq = o(X1(), 1)
})
// @from(Ln 406757, Col 0)
async function JKq(A) {
    try {
        return (await u91.readdir(A, {
            withFileTypes: !0
        })).filter((K) => K.isFile() && K.name.endsWith(".md")).map((K) => {
            return b91.basename(K.name, ".md")
        })
    } catch (q) {
        let K = q instanceof Error ? q.message : String(q);
        return h(`Failed to read plugin components from ${A}: ${K}`, {
            level: "error"
        }), K1(q instanceof Error ? q : Error(`Failed to read plugin components: ${K}`)), []
    }
}
// @from(Ln 406771, Col 0)
async function SsY(A) {
    try {
        let q = await u91.readdir(A, {
                withFileTypes: !0
            }),
            K = [];
        for (let Y of q)
            if (Y.isDirectory() || Y.isSymbolicLink()) {
                let z = b91.join(A, Y.name, "SKILL.md");
                try {
                    await u91.access(z), K.push(Y.name)
                } catch {}
            } return K
    } catch (q) {
        let K = q instanceof Error ? q.message : String(q);
        return h(`Failed to read skill directories from ${A}: ${K}`, {
            level: "error"
        }), K1(q instanceof Error ? q : Error(`Failed to read skill directories: ${K}`)), []
    }
}
// @from(Ln 406792, Col 0)
function hsY({
    plugin: A,
    marketplace: q
}) {
    let [K, Y] = u2.useState(null), [z, w] = u2.useState(!0), [H, $] = u2.useState(null);
    if (u2.useEffect(() => {
            async function _() {
                try {
                    let X = (await NZ(q)).plugins.find((D) => D.name === A.name);
                    if (X) {
                        let D = [];
                        if (A.commandsPath) D.push(A.commandsPath);
                        if (A.commandsPaths) D.push(...A.commandsPaths);
                        let j = [];
                        for (let N of D)
                            if (typeof N === "string") {
                                let T = await JKq(N);
                                j.push(...T)
                            } let M = [];
                        if (A.agentsPath) M.push(A.agentsPath);
                        if (A.agentsPaths) M.push(...A.agentsPaths);
                        let P = [];
                        for (let N of M)
                            if (typeof N === "string") {
                                let T = await JKq(N);
                                P.push(...T)
                            } let W = [];
                        if (A.skillsPath) W.push(A.skillsPath);
                        if (A.skillsPaths) W.push(...A.skillsPaths);
                        let G = [];
                        for (let N of W)
                            if (typeof N === "string") {
                                let T = await SsY(N);
                                G.push(...T)
                            } let f = [];
                        if (A.hooksConfig) f.push(Object.keys(A.hooksConfig));
                        if (X.hooks) f.push(X.hooks);
                        let Z = [];
                        if (A.mcpServers) Z.push(Object.keys(A.mcpServers));
                        if (X.mcpServers) Z.push(X.mcpServers);
                        Y({
                            commands: j.length > 0 ? j : null,
                            agents: P.length > 0 ? P : null,
                            skills: G.length > 0 ? G : null,
                            hooks: f.length > 0 ? f : null,
                            mcpServers: Z.length > 0 ? Z : null
                        })
                    } else $(`Plugin ${A.name} not found in marketplace`)
                } catch (J) {
                    $(J instanceof Error ? J.message : "Failed to load components")
                } finally {
                    w(!1)
                }
            }
            _()
        }, [A.name, A.commandsPath, A.commandsPaths, A.agentsPath, A.agentsPaths, A.skillsPath, A.skillsPaths, A.hooksConfig, A.mcpServers, q]), z) return null;
    if (H) return qA.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, qA.createElement(V, {
        bold: !0
    }, "Components:"), qA.createElement(V, {
        dimColor: !0
    }, "Error: ", H));
    if (!K) return null;
    if (!(K.commands || K.agents || K.skills || K.hooks || K.mcpServers)) return null;
    return qA.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, qA.createElement(V, {
        bold: !0
    }, "Installed components:"), K.commands ? qA.createElement(V, {
        dimColor: !0
    }, "• Commands:", " ", typeof K.commands === "string" ? K.commands : Array.isArray(K.commands) ? K.commands.join(", ") : Object.keys(K.commands).join(", ")) : null, K.agents ? qA.createElement(V, {
        dimColor: !0
    }, "• Agents:", " ", typeof K.agents === "string" ? K.agents : Array.isArray(K.agents) ? K.agents.join(", ") : Object.keys(K.agents).join(", ")) : null, K.skills ? qA.createElement(V, {
        dimColor: !0
    }, "• Skills:", " ", typeof K.skills === "string" ? K.skills : Array.isArray(K.skills) ? K.skills.join(", ") : Object.keys(K.skills).join(", ")) : null, K.hooks ? qA.createElement(V, {
        dimColor: !0
    }, "• Hooks:", " ", typeof K.hooks === "string" ? K.hooks : Array.isArray(K.hooks) ? K.hooks.map(String).join(", ") : typeof K.hooks === "object" && K.hooks !== null ? Object.keys(K.hooks).join(", ") : String(K.hooks)) : null, K.mcpServers ? qA.createElement(V, {
        dimColor: !0
    }, "• MCP Servers:", " ", typeof K.mcpServers === "string" ? K.mcpServers : Array.isArray(K.mcpServers) ? K.mcpServers.map(String).join(", ") : typeof K.mcpServers === "object" && K.mcpServers !== null ? Object.keys(K.mcpServers).join(", ") : String(K.mcpServers)) : null)
}
// @from(Ln 406875, Col 0)
async function IsY(A, q) {
    let Y = (await NZ(q))?.plugins.find((z) => z.name === A);
    if (Y && typeof Y.source === "string") return `Local plugins cannot be updated remotely. To update, modify the source at: ${Y.source}`;
    return null
}
// @from(Ln 406881, Col 0)
function XKq({
    setViewState: A,
    setResult: q,
    onManageComplete: K,
    onSearchModeChange: Y,
    targetPlugin: z,
    targetMarketplace: w,
    action: H
}) {
    let $ = v6((H1) => H1.mcp.clients),
        O = v6((H1) => H1.mcp.tools),
        _ = v6((H1) => H1.plugins.errors),
        [J, X] = u2.useState(!1),
        D = u2.useCallback((H1) => {
            X(H1), Y?.(H1)
        }, [Y]),
        j = k_(),
        {
            columns: M
        } = Z8(),
        [P, W] = u2.useState("plugin-list"),
        {
            query: G,
            setQuery: f,
            cursorOffset: Z
        } = qF({
            isActive: P === "plugin-list" && J,
            onExit: () => {
                D(!1)
            }
        }),
        [N, T] = u2.useState(null),
        [k, y] = u2.useState([]),
        [B, S] = u2.useState([]),
        [m, b] = u2.useState(!0),
        [g, U] = u2.useState(!1),
        [x, p] = u2.useState(new Map),
        l = Xe(),
        r = qA.useCallback(() => {
            if (P === "plugin-details") W("plugin-list"), T(null), a(null);
            else if (P === "configuring") W("plugin-details"), M1(null);
            else if (typeof P === "object" && P.type === "mcp-detail") W("plugin-list"), a(null);
            else if (typeof P === "object" && P.type === "mcp-tools") W({
                type: "mcp-detail",
                client: P.client
            });
            else if (typeof P === "object" && P.type === "mcp-tool-detail") W({
                type: "mcp-tools",
                client: P.client
            });
            else A({
                type: "menu"
            })
        }, [P, A]);
    DA("confirm:no", r, {
        context: "Confirmation",
        isActive: P !== "plugin-list" || !J
    });
    let s = (H1) => {
            if (H1.type === "connected") return "connected";
            if (H1.type === "disabled") return "disabled";
            if (H1.type === "pending") return "pending";
            if (H1.type === "needs-auth") return "needs-auth";
            if (H1.type === "proxy") return "connected";
            return "failed"
        },
        O1 = u2.useMemo(() => {
            let H1 = C8(),
                y1 = new Map;
            for (let N6 of $)
                if (N6.name.startsWith("plugin:")) {
                    let F6 = N6.name.split(":");
                    if (F6.length >= 3) {
                        let P1 = F6[1],
                            k1 = F6.slice(2).join(":"),
                            o1 = y1.get(P1) || [];
                        o1.push({
                            displayName: k1,
                            client: N6
                        }), y1.set(P1, o1)
                    }
                } let B1 = [];
            for (let N6 of B) {
                let F6 = `${N6.plugin.name}@${N6.marketplace}`,
                    P1 = H1?.enabledPlugins?.[F6] !== !1,
                    k1 = _.filter((o1) => ("plugin" in o1) && o1.plugin === N6.plugin.name || o1.source === F6 || o1.source.startsWith(`${N6.plugin.name}@`));
                B1.push({
                    item: {
                        type: "plugin",
                        id: F6,
                        name: N6.plugin.name,
                        description: N6.plugin.manifest.description,
                        marketplace: N6.marketplace,
                        scope: N6.scope || "user",
                        isEnabled: P1,
                        errorCount: k1.length,
                        errors: k1,
                        plugin: N6.plugin,
                        pendingEnable: N6.pendingEnable,
                        pendingUpdate: N6.pendingUpdate,
                        pendingToggle: x.get(F6)
                    },
                    childMcps: y1.get(N6.plugin.name) || []
                })
            }
            let A6 = new Set(B1.map(({
                    item: N6
                }) => N6.id)),
                O6 = new Set(B1.map(({
                    item: N6
                }) => N6.name)),
                P6 = new Map;
            for (let N6 of _) {
                if (A6.has(N6.source) || "plugin" in N6 && typeof N6.plugin === "string" && O6.has(N6.plugin)) continue;
                let F6 = P6.get(N6.source) || [];
                F6.push(N6), P6.set(N6.source, F6)
            }
            let V6 = [];
            for (let [N6, F6] of P6) {
                let P1 = N6.split("@"),
                    k1 = P1[0] || N6,
                    o1 = P1[1] || "unknown";
                V6.push({
                    type: "failed-plugin",
                    id: N6,
                    name: k1,
                    marketplace: o1,
                    scope: "user",
                    errorCount: F6.length,
                    errors: F6
                })
            }
            let q6 = [];
            for (let N6 of $) {
                if (N6.name === "ide") continue;
                if (N6.name.startsWith("plugin:")) continue;
                q6.push({
                    type: "mcp",
                    id: `mcp:${N6.name}`,
                    name: N6.name,
                    description: void 0,
                    scope: N6.config.scope,
                    status: s(N6),
                    client: N6
                })
            }
            let p1 = {
                    project: 0,
                    local: 1,
                    user: 2,
                    enterprise: 3,
                    managed: 4,
                    dynamic: 5
                },
                K6 = [],
                j6 = new Map;
            for (let {
                    item: N6,
                    childMcps: F6
                }
                of B1) {
                let P1 = N6.scope;
                if (!j6.has(P1)) j6.set(P1, []);
                j6.get(P1).push(N6);
                for (let {
                        displayName: k1,
                        client: o1
                    }
                    of F6) {
                    let _6 = N6.scope;
                    if (!j6.has(_6)) j6.set(_6, []);
                    j6.get(_6).push({
                        type: "mcp",
                        id: `mcp:${o1.name}`,
                        name: k1,
                        description: void 0,
                        scope: _6,
                        status: s(o1),
                        client: o1,
                        indented: !0
                    })
                }
            }
            for (let N6 of q6) {
                let F6 = N6.scope;
                if (!j6.has(F6)) j6.set(F6, []);
                j6.get(F6).push(N6)
            }
            for (let N6 of V6) {
                let F6 = N6.scope;
                if (!j6.has(F6)) j6.set(F6, []);
                j6.get(F6).push(N6)
            }
            let M6 = [...j6.keys()].sort((N6, F6) => (p1[N6] ?? 99) - (p1[F6] ?? 99));
            for (let N6 of M6) {
                let F6 = j6.get(N6),
                    P1 = [],
                    k1 = [],
                    o1 = 0;
                while (o1 < F6.length) {
                    let _6 = F6[o1];
                    if (_6.type === "plugin" || _6.type === "failed-plugin") {
                        let z6 = [_6];
                        o1++;
                        let w6 = F6[o1];
                        while (w6?.type === "mcp" && w6.indented) z6.push(w6), o1++, w6 = F6[o1];
                        P1.push(z6)
                    } else if (_6.type === "mcp" && !_6.indented) k1.push(_6), o1++;
                    else o1++
                }
                P1.sort((_6, z6) => _6[0].name.localeCompare(z6[0].name)), k1.sort((_6, z6) => _6.name.localeCompare(z6.name));
                for (let _6 of P1) K6.push(..._6);
                K6.push(...k1)
            }
            return K6
        }, [B, $, _, x]),
        T1 = u2.useMemo(() => {
            if (!G) return O1;
            let H1 = G.toLowerCase();
            return O1.filter((y1) => y1.name.toLowerCase().includes(H1) || y1.description?.toLowerCase().includes(H1))
        }, [O1, G]),
        [N1, j1] = u2.useState(0),
        q1 = Me({
            totalItems: T1.length,
            selectedIndex: N1,
            maxVisible: 8
        }),
        [t, J1] = u2.useState(0),
        [D1, Z1] = u2.useState(!1),
        [E1, a] = u2.useState(null),
        [A1, M1] = u2.useState(null),
        [z1, Y1] = u2.useState(!1),
        [_1, $1] = u2.useState(!1);
    u2.useEffect(() => {
        if (!N) {
            $1(!1);
            return
        }
        async function H1() {
            let y1 = N.plugin.manifest.mcpServers,
                B1 = !1;
            if (y1) B1 = typeof y1 === "string" && XR(y1) || Array.isArray(y1) && y1.some((A6) => typeof A6 === "string" && XR(A6));
            if (!B1) try {
                let A6 = b91.join(N.plugin.path, ".."),
                    O6 = b91.join(A6, ".claude-plugin", "marketplace.json"),
                    P6 = await u91.readFile(O6, "utf-8"),
                    q6 = _A(P6).plugins?.find((p1) => p1.name === N.plugin.name);
                if (q6?.mcpServers) {
                    let p1 = q6.mcpServers;
                    B1 = typeof p1 === "string" && XR(p1) || Array.isArray(p1) && p1.some((K6) => typeof K6 === "string" && XR(K6))
                }
            } catch (A6) {
                h(`Failed to read raw marketplace.json: ${A6}`)
            }
            $1(B1)
        }
        H1()
    }, [N]), u2.useEffect(() => {
        async function H1() {
            b(!0);
            try {
                let {
                    enabled: y1,
                    disabled: B1
                } = await iY(), A6 = [...y1, ...B1], O6 = C8(), P6 = {};
                for (let p1 of A6) {
                    let K6 = p1.source.split("@")[1] || "local";
                    if (!P6[K6]) P6[K6] = [];
                    P6[K6].push(p1)
                }
                let V6 = [];
                for (let [p1, K6] of Object.entries(P6)) {
                    let j6 = K6.filter((N6) => {
                            let F6 = `${N6.name}@${p1}`;
                            return O6?.enabledPlugins?.[F6] !== !1
                        }).length,
                        M6 = K6.length - j6;
                    V6.push({
                        name: p1,
                        installedPlugins: K6,
                        enabledCount: j6,
                        disabledCount: M6
                    })
                }
                V6.sort((p1, K6) => {
                    if (p1.name === "claude-plugin-directory") return -1;
                    if (K6.name === "claude-plugin-directory") return 1;
                    return p1.name.localeCompare(K6.name)
                }), y(V6);
                let q6 = [];
                for (let p1 of V6)
                    for (let K6 of p1.installedPlugins) {
                        let j6 = `${K6.name}@${p1.name}`,
                            {
                                scope: M6
                            } = S91(j6);
                        q6.push({
                            plugin: K6,
                            marketplace: p1.name,
                            scope: M6,
                            pendingEnable: void 0,
                            pendingUpdate: !1
                        })
                    }
                S(q6), j1(0)
            } finally {
                b(!1)
            }
        }
        H1()
    }, []), u2.useEffect(() => {
        if (z && k.length > 0 && !m) {
            let H1 = w ? k.filter((y1) => y1.name === w) : k;
            for (let y1 of H1) {
                let B1 = y1.installedPlugins.find((A6) => A6.name === z);
                if (B1) {
                    let A6 = `${B1.name}@${y1.name}`,
                        {
                            scope: O6
                        } = S91(A6),
                        P6 = {
                            plugin: B1,
                            marketplace: y1.name,
                            scope: O6,
                            pendingEnable: void 0,
                            pendingUpdate: !1
                        };
                    T(P6), W("plugin-details");
                    break
                }
            }
        }
    }, [z, w, k, m]);
    let G1 = async (H1) => {
        if (!N) return;
        let y1 = N.scope || "user";
        if (!I91(y1) && H1 !== "update") {
            a("Managed plugins can only be updated, not enabled, disabled, or uninstalled.");
            return
        }
        Z1(!0), a(null);
        try {
            let B1 = `${N.plugin.name}@${N.marketplace}`,
                A6 = We(y1);
            switch (H1) {
                case "enable": {
                    if (!I91(y1)) break;
                    if (!BM(B1)) {
                        let q6 = await a0(B1);
                        if (q6) {
                            let {
                                entry: p1,
                                marketplaceInstallLocation: K6
                            } = q6, j6 = tx(p1.source) ? b91.join(K6, p1.source) : void 0;
                            await HE(B1, p1, y1, A6, j6)
                        }
                    }
                    let V6 = await x91(B1, y1);
                    if (!V6.success) throw Error(V6.message);
                    break
                }
                case "disable": {
                    if (!I91(y1)) break;
                    let V6 = await hp1(B1, y1);
                    if (!V6.success) throw Error(V6.message);
                    break
                }
                case "uninstall": {
                    if (!I91(y1)) break;
                    let V6 = await QV6(B1, y1);
                    if (!V6.success) throw Error(V6.message);
                    break
                }
                case "update": {
                    let V6 = await EZ1(B1, y1);
                    if (!V6.success) throw Error(V6.message);
                    if (V6.alreadyUpToDate) {
                        if (q(`${N.plugin.name} is already at the latest version (${V6.newVersion}).`), K) await K();
                        A({
                            type: "menu"
                        });
                        return
                    }
                    break
                }
            }
            Uw();
            let P6 = `✓ ${H1==="enable"?"Enabled":H1==="disable"?"Disabled":H1==="update"?"Updated":"Uninstalled"} ${N.plugin.name}. Restart Claude Code to apply changes.`;
            if (q(P6), K) await K();
            A({
                type: "menu"
            })
        } catch (B1) {
            Z1(!1);
            let A6 = B1 instanceof Error ? B1.message : String(B1);
            a(`Failed to ${H1}: ${A6}`), K1(B1 instanceof Error ? B1 : Error(`Failed to ${H1} plugin: ${String(B1)}`))
        }
    }, L1 = qA.useCallback(() => {
        if (N1 >= T1.length) return;
        let H1 = T1[N1];
        if (H1?.type === "plugin") {
            let y1 = `${H1.plugin.name}@${H1.marketplace}`,
                B1 = C8(),
                A6 = x.get(y1),
                O6 = B1?.enabledPlugins?.[y1] !== !1,
                P6 = H1.scope || "user";
            if (I91(P6)) {
                let V6 = new Map(x);
                if (A6) V6.delete(y1);
                else V6.set(y1, O6 ? "will-disable" : "will-enable"), (async () => {
                    try {
                        if (O6) await hp1(y1, P6);
                        else await x91(y1, P6);
                        Uw(), U(!0)
                    } catch (q6) {
                        K1(q6 instanceof Error ? q6 : Error(String(q6)))
                    }
                })();
                p(V6)
            }
        } else if (H1?.type === "mcp") l(H1.client.name)
    }, [N1, T1, x, B, l]), x1 = qA.useCallback(() => {
        if (N1 >= T1.length) return;
        let H1 = T1[N1];
        if (H1?.type === "plugin") {
            let y1 = B.find((B1) => B1.plugin.name === H1.plugin.name && B1.marketplace === H1.marketplace);
            if (y1) T(y1), W("plugin-details"), J1(0), a(null)
        } else if (H1?.type === "failed-plugin") A({
            type: "plugin-errors"
        });
        else if (H1?.type === "mcp") W({
            type: "mcp-detail",
            client: H1.client
        }), a(null)
    }, [N1, T1, B, A]);
    c7({
        "select:previous": () => {
            if (N1 === 0) D(!0);
            else q1.handleSelectionChange(N1 - 1, j1)
        },
        "select:next": () => {
            if (N1 < T1.length - 1) q1.handleSelectionChange(N1 + 1, j1)
        },
        "select:accept": x1
    }, {
        context: "Select",
        isActive: P === "plugin-list" && !J
    }), c7({
        "plugin:toggle": L1
    }, {
        context: "Plugin",
        isActive: P === "plugin-list" && !J
    });
    let f1 = qA.useMemo(() => {
        if (P !== "plugin-details" || !N) return [];
        let H1 = C8(),
            y1 = `${N.plugin.name}@${N.marketplace}`,
            B1 = H1?.enabledPlugins?.[y1] !== !1,
            A6 = [];
        if (A6.push({
                label: B1 ? "Disable plugin" : "Enable plugin",
                action: () => void G1(B1 ? "disable" : "enable")
            }), A6.push({
                label: N.pendingUpdate ? "Unmark for update" : "Mark for update",
                action: async () => {
                    try {
                        let O6 = await IsY(N.plugin.name, N.marketplace);
                        if (O6) {
                            a(O6);
                            return
                        }
                        let P6 = [...B],
                            V6 = P6.findIndex((q6) => q6.plugin.name === N.plugin.name && q6.marketplace === N.marketplace);
                        if (V6 !== -1) P6[V6].pendingUpdate = !N.pendingUpdate, S(P6), T({
                            ...N,
                            pendingUpdate: !N.pendingUpdate
                        })
                    } catch (O6) {
                        a(O6 instanceof Error ? O6.message : "Failed to check plugin update availability")
                    }
                }
            }), _1) A6.push({
            label: "Configure",
            action: async () => {
                Y1(!0);
                try {
                    let O6 = N.plugin.manifest.mcpServers,
                        P6 = null;
                    if (typeof O6 === "string" && XR(O6)) P6 = O6;
                    else if (Array.isArray(O6)) {
                        for (let p1 of O6)
                            if (typeof p1 === "string" && XR(p1)) {
                                P6 = p1;
                                break
                            }
                    }
                    if (!P6) {
                        a("No MCPB file found in plugin"), Y1(!1);
                        return
                    }
                    let V6 = `${N.plugin.name}@${N.marketplace}`,
                        q6 = await hu1(P6, N.plugin.path, V6, void 0, void 0, !0);
                    if ("status" in q6 && q6.status === "needs-config") M1(q6), W("configuring");
                    else a("Failed to load MCPB for configuration")
                } catch (O6) {
                    let P6 = O6 instanceof Error ? O6.message : String(O6);
                    a(`Failed to load configuration: ${P6}`)
                } finally {
                    Y1(!1)
                }
            }
        });
        if (A6.push({
                label: "Update now",
                action: () => void G1("update")
            }), A6.push({
                label: "Uninstall",
                action: () => void G1("uninstall")
            }), N.plugin.manifest.homepage) A6.push({
            label: "Open homepage",
            action: () => void zY(N.plugin.manifest.homepage)
        });
        if (N.plugin.manifest.repository) A6.push({
            label: "View on GitHub",
            action: () => void zY(N.plugin.manifest.repository)
        });
        return A6.push({
            label: "Back to plugin list",
            action: () => {
                W("plugin-list"), T(null), a(null)
            }
        }), A6
    }, [P, N, _1, B]);
    if (c7({
            "select:previous": () => {
                if (t > 0) J1(t - 1)
            },
            "select:next": () => {
                if (t < f1.length - 1) J1(t + 1)
            },
            "select:accept": () => {
                if (f1[t]) f1[t].action()
            }
        }, {
            context: "Select",
            isActive: P === "plugin-details" && !!N
        }), qA.useEffect(() => {
            j1(0)
        }, [G]), D8((H1, y1) => {
            let B1 = !y1.ctrl && !y1.meta;
            if (J) return;
            if (H1 === "/" && B1) D(!0), f(""), j1(0);
            else if (B1 && H1.length > 0 && !/^\s+$/.test(H1) && H1 !== "j" && H1 !== "k" && H1 !== " ") D(!0), f(H1), j1(0)
        }, {
            isActive: P === "plugin-list"
        }), m) return qA.createElement(V, null, "Loading installed plugins…");
    if (O1.length === 0) return qA.createElement(I, {
        flexDirection: "column"
    }, qA.createElement(I, {
        marginBottom: 1
    }, qA.createElement(V, {
        bold: !0
    }, "Manage plugins")), qA.createElement(V, null, "No plugins or MCP servers installed."), qA.createElement(I, {
        marginTop: 1
    }, qA.createElement(V, {
        dimColor: !0
    }, "Esc to go back")));
    if (P === "configuring" && A1 && N) {
        let B1 = function() {
                M1(null), W("plugin-details")
            },
            H1 = `${N.plugin.name}@${N.marketplace}`;
        async function y1(A6) {
            if (!A1 || !N) return;
            try {
                let O6 = N.plugin.manifest.mcpServers,
                    P6 = null;
                if (typeof O6 === "string" && XR(O6)) P6 = O6;
                else if (Array.isArray(O6)) {
                    for (let V6 of O6)
                        if (typeof V6 === "string" && XR(V6)) {
                            P6 = V6;
                            break
                        }
                }
                if (!P6) {
                    a("No MCPB file found"), W("plugin-details");
                    return
                }
                await hu1(P6, N.plugin.path, H1, void 0, A6), a(null), M1(null), W("plugin-details"), q("Configuration saved. Restart Claude Code for changes to take effect.")
            } catch (O6) {
                let P6 = O6 instanceof Error ? O6.message : String(O6);
                a(`Failed to save configuration: ${P6}`), W("plugin-details")
            }
        }
        return qA.createElement(zKq, {
            pluginName: N.plugin.name,
            serverName: A1.manifest.name,
            configSchema: A1.configSchema,
            onSave: y1,
            onCancel: B1
        })
    }
    if (P === "plugin-details" && N) {
        let H1 = C8(),
            y1 = `${N.plugin.name}@${N.marketplace}`,
            B1 = H1?.enabledPlugins?.[y1] !== !1,
            A6 = _.filter((P6) => ("plugin" in P6) && P6.plugin === N.plugin.name || P6.source === y1 || P6.source.startsWith(`${N.plugin.name}@`)),
            O6 = A6.length === 0 ? null : qA.createElement(I, {
                flexDirection: "column",
                marginBottom: 1
            }, qA.createElement(V, {
                bold: !0,
                color: "error"
            }, A6.length, " error", A6.length !== 1 ? "s" : "", ":"), A6.map((P6, V6) => {
                let q6 = SxA(P6);
                return qA.createElement(I, {
                    key: V6,
                    flexDirection: "column",
                    marginLeft: 2
                }, qA.createElement(V, {
                    color: "error"
                }, CxA(P6)), q6 && qA.createElement(V, {
                    dimColor: !0,
                    italic: !0
                }, l1.arrowRight, " ", q6))
            }));
        return qA.createElement(I, {
            flexDirection: "column"
        }, qA.createElement(I, null, qA.createElement(V, {
            bold: !0
        }, N.plugin.name, " @ ", N.marketplace)), qA.createElement(I, null, qA.createElement(V, {
            dimColor: !0
        }, "Scope: "), qA.createElement(V, null, N.scope || "user")), N.plugin.manifest.version && qA.createElement(I, null, qA.createElement(V, {
            dimColor: !0
        }, "Version: "), qA.createElement(V, null, N.plugin.manifest.version)), N.plugin.manifest.description && qA.createElement(I, {
            marginBottom: 1
        }, qA.createElement(V, null, N.plugin.manifest.description)), N.plugin.manifest.author && qA.createElement(I, null, qA.createElement(V, {
            dimColor: !0
        }, "Author: "), qA.createElement(V, null, N.plugin.manifest.author.name)), qA.createElement(I, {
            marginBottom: 1
        }, qA.createElement(V, {
            dimColor: !0
        }, "Status: "), qA.createElement(V, {
            color: B1 ? "success" : "warning"
        }, B1 ? "Enabled" : "Disabled"), N.pendingUpdate && qA.createElement(V, {
            color: "suggestion"
        }, " · Marked for update")), qA.createElement(hsY, {
            plugin: N.plugin,
            marketplace: N.marketplace
        }), O6, qA.createElement(I, {
            marginTop: 1,
            flexDirection: "column"
        }, f1.map((P6, V6) => {
            let q6 = V6 === t;
            return qA.createElement(I, {
                key: V6
            }, q6 && qA.createElement(V, null, l1.pointer, " "), !q6 && qA.createElement(V, null, "  "), qA.createElement(V, {
                bold: q6,
                color: P6.label.includes("Uninstall") ? "error" : P6.label.includes("Update") ? "suggestion" : void 0
            }, P6.label))
        })), D1 && qA.createElement(I, {
            marginTop: 1
        }, qA.createElement(V, null, "Processing…")), E1 && qA.createElement(I, {
            marginTop: 1
        }, qA.createElement(V, {
            color: "error"
        }, E1)), qA.createElement(I, {
            marginTop: 1
        }, qA.createElement(V, {
            dimColor: !0,
            italic: !0
        }, qA.createElement(oA, null, qA.createElement(NA, {
            action: "select:previous",
            context: "Select",
            fallback: "↑",
            description: "navigate"
        }), qA.createElement(NA, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "select"
        }), qA.createElement(NA, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "back"
        })))))
    }
    if (typeof P === "object" && P.type === "mcp-detail") {
        let H1 = P.client,
            y1 = Bm(O, H1.name).length,
            B1 = () => {
                W({
                    type: "mcp-tools",
                    client: H1
                })
            },
            A6 = () => {
                W("plugin-list")
            },
            O6 = (q6) => {
                if (q6) q(q6);
                W("plugin-list")
            },
            P6 = H1.config.scope,
            V6 = H1.config.type;
        if (V6 === "stdio") {
            let q6 = {
                name: H1.name,
                client: H1,
                scope: P6,
                transport: "stdio",
                config: H1.config
            };
            return qA.createElement(kp1, {
                server: q6,
                serverToolsCount: y1,
                onViewTools: B1,
                onCancel: A6,
                onComplete: O6,
                borderless: !0
            })
        } else if (V6 === "sse") {
            let q6 = {
                name: H1.name,
                client: H1,
                scope: P6,
                transport: "sse",
                isAuthenticated: void 0,
                config: H1.config
            };
            return qA.createElement(y91, {
                server: q6,
                serverToolsCount: y1,
                onViewTools: B1,
                onCancel: A6,
                onComplete: O6,
                borderless: !0
            })
        } else if (V6 === "http") {
            let q6 = {
                name: H1.name,
                client: H1,
                scope: P6,
                transport: "http",
                isAuthenticated: void 0,
                config: H1.config
            };
            return qA.createElement(y91, {
                server: q6,
                serverToolsCount: y1,
                onViewTools: B1,
                onCancel: A6,
                onComplete: O6,
                borderless: !0
            })
        } else if (V6 === "claudeai-proxy") {
            let q6 = {
                name: H1.name,
                client: H1,
                scope: P6,
                transport: "claudeai-proxy",
                isAuthenticated: void 0,
                config: H1.config
            };
            return qA.createElement(y91, {
                server: q6,
                serverToolsCount: y1,
                onViewTools: B1,
                onCancel: A6,
                onComplete: O6,
                borderless: !0
            })
        }
        return W("plugin-list"), null
    }
    if (typeof P === "object" && P.type === "mcp-tools") {
        let H1 = P.client,
            y1 = H1.config.scope,
            B1 = H1.config.type,
            A6;
        if (B1 === "stdio") A6 = {
            name: H1.name,
            client: H1,
            scope: y1,
            transport: "stdio",
            config: H1.config
        };
        else if (B1 === "sse") A6 = {
            name: H1.name,
            client: H1,
            scope: y1,
            transport: "sse",
            isAuthenticated: void 0,
            config: H1.config
        };
        else if (B1 === "http") A6 = {
            name: H1.name,
            client: H1,
            scope: y1,
            transport: "http",
            isAuthenticated: void 0,
            config: H1.config
        };
        else A6 = {
            name: H1.name,
            client: H1,
            scope: y1,
            transport: "claudeai-proxy",
            isAuthenticated: void 0,
            config: H1.config
        };
        return qA.createElement(Lp1, {
            server: A6,
            onSelectTool: (O6) => {
                W({
                    type: "mcp-tool-detail",
                    client: H1,
                    tool: O6
                })
            },
            onBack: () => W({
                type: "mcp-detail",
                client: H1
            })
        })
    }
    if (typeof P === "object" && P.type === "mcp-tool-detail") {
        let {
            client: H1,
            tool: y1
        } = P, B1 = H1.config.scope, A6 = H1.config.type, O6;
        if (A6 === "stdio") O6 = {
            name: H1.name,
            client: H1,
            scope: B1,
            transport: "stdio",
            config: H1.config
        };
        else if (A6 === "sse") O6 = {
            name: H1.name,
            client: H1,
            scope: B1,
            transport: "sse",
            isAuthenticated: void 0,
            config: H1.config
        };
        else if (A6 === "http") O6 = {
            name: H1.name,
            client: H1,
            scope: B1,
            transport: "http",
            isAuthenticated: void 0,
            config: H1.config
        };
        else O6 = {
            name: H1.name,
            client: H1,
            scope: B1,
            transport: "claudeai-proxy",
            isAuthenticated: void 0,
            config: H1.config
        };
        return qA.createElement(Rp1, {
            tool: y1,
            server: O6,
            onBack: () => W({
                type: "mcp-tools",
                client: H1
            })
        })
    }
    let R1 = q1.getVisibleItems(T1);
    return qA.createElement(I, {
        flexDirection: "column"
    }, qA.createElement(I, {
        marginBottom: 1
    }, qA.createElement(AF, {
        query: G,
        isFocused: J,
        isTerminalFocused: j,
        width: M - 4,
        cursorOffset: Z
    })), T1.length === 0 && G && qA.createElement(I, {
        marginBottom: 1
    }, qA.createElement(V, {
        dimColor: !0
    }, 'No items match "', G, '"')), q1.scrollPosition.canScrollUp && qA.createElement(I, null, qA.createElement(V, {
        dimColor: !0
    }, " ", l1.arrowUp, " more above")), R1.map((H1, y1) => {
        let A6 = q1.toActualIndex(y1) === N1 && !J,
            O6 = y1 > 0 ? R1[y1 - 1] : null,
            P6 = !O6 || O6.scope !== H1.scope,
            V6 = (q6) => {
                switch (q6) {
                    case "project":
                        return "Project";
                    case "local":
                        return "Local";
                    case "user":
                        return "User";
                    case "enterprise":
                        return "Enterprise";
                    case "managed":
                        return "Managed";
                    case "dynamic":
                        return "Built-in";
                    default:
                        return q6
                }
            };
        return qA.createElement(qA.Fragment, {
            key: H1.id
        }, P6 && qA.createElement(I, {
            marginTop: y1 > 0 ? 1 : 0,
            paddingLeft: 2
        }, qA.createElement(V, {
            dimColor: !0
        }, V6(H1.scope))), qA.createElement(HKq, {
            item: H1,
            isSelected: A6
        }))
    }), q1.scrollPosition.canScrollDown && qA.createElement(I, null, qA.createElement(V, {
        dimColor: !0
    }, " ", l1.arrowDown, " more below")), qA.createElement(I, {
        marginTop: 1,
        marginLeft: 1
    }, qA.createElement(V, {
        dimColor: !0,
        italic: !0
    }, qA.createElement(oA, null, qA.createElement(V, null, "type to search"), qA.createElement(NA, {
        action: "plugin:toggle",
        context: "Plugin",
        fallback: "Space",
        description: "toggle"
    }), qA.createElement(NA, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "details"
    }), qA.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    })))), g && qA.createElement(I, {
        marginLeft: 1
    }, qA.createElement(V, {
        dimColor: !0,
        italic: !0
    }, "Restart to apply plugin changes")))
}
// @from(Ln 407834, Col 4)
qA
// @from(Ln 407834, Col 8)
u2
// @from(Ln 407835, Col 4)
DKq = v(() => {
    m1();
    HZ1();
    $Z1();
    mq();
    b7();
    VJ();
    p$();
    N0();
    p8();
    tR();
    Oj();
    y6();
    Z6();
    mM();
    ad();
    kZ1();
    wKq();
    I0A();
    Sp1();
    m6();
    d8();
    $Kq();
    SV6();
    hV6();
    IV6();
    xV6();
    tX();
    hxA();
    De();
    HK();
    BK();
    K7();
    qA = o(X1(), 1), u2 = o(X1(), 1)
})
// @from(Ln 407870, Col 0)
async function UV6() {
    let A = C8(),
        q = new Map;
    if (A.extraKnownMarketplaces)
        for (let [K, Y] of Object.entries(A.extraKnownMarketplaces)) q.set(K, Y);
    return q
}
// @from(Ln 407877, Col 0)
async function pV6(A) {
    try {
        let q = await n5(),
            K = [];
        for (let [Y] of A)
            if (!q[Y]) K.push(Y);
        return K
    } catch (q) {
        return K1(q instanceof Error ? q : Error(String(q))), []
    }
}
// @from(Ln 407888, Col 4)
IxA = v(() => {
    p8();
    p$();
    y6();
    m6()
})
// @from(Ln 407898, Col 0)
function xxA(A, q, K, Y) {
    A((z) => ({
        ...z,
        plugins: {
            ...z.plugins,
            installationStatus: {
                ...z.plugins.installationStatus,
                marketplaces: z.plugins.installationStatus.marketplaces.map((w) => w.name === q ? {
                    ...w,
                    status: K,
                    error: Y
                } : w)
            }
        }
    }))
}
// @from(Ln 407915, Col 0)
function bxA(A, q, K, Y) {
    A((z) => ({
        ...z,
        plugins: {
            ...z.plugins,
            installationStatus: {
                ...z.plugins.installationStatus,
                plugins: z.plugins.installationStatus.plugins.map((w) => w.id === q ? {
                    ...w,
                    status: K,
                    error: Y
                } : w)
            }
        }
    }))
}
// @from(Ln 407931, Col 0)
async function bsY(A, q, K) {
    let Y = [],
        z = [];
    for (let $ of A) {
        let O = q.get($);
        if (!O) continue;
        xxA(K, $, "installing");
        try {
            await wE(O.source), Y.push($), xxA(K, $, "installed"), AG1(), Sv(), await usY($, K)
        } catch (_) {
            let J = _ instanceof Error ? _.message : String(_);
            z.push({
                name: $,
                error: J
            }), xxA(K, $, "failed", J), K1(_ instanceof Error ? _ : Error(String(_)))
        }
    }
    let w = {};
    for (let $ of A) {
        let O = q.get($);
        if (O) {
            let _ = `source_type_${O.source.source}`;
            w[_] = (w[_] ?? 0) + 1
        }
    }
    let H = {
        installed_count: Y.length,
        failed_count: z.length,
        total_count: A.length,
        ...w
    };
    if (c("tengu_marketplace_background_install", H), H8("info", "tengu_marketplace_background_install", H), Y.length > 0) K(($) => {
        if ($.plugins.needsRefresh) return $;
        return {
            ...$,
            plugins: {
                ...$.plugins,
                needsRefresh: !0
            }
        }
    });
    return {
        installed: Y,
        failed: z
    }
}
// @from(Ln 407977, Col 0)
async function usY(A, q) {
    try {
        let Y = (await VZ1()).filter((z) => z.endsWith(`@${A}`));
        if (Y.length > 0) {
            let z = await kxA(Y);
            if (z.length > 0) h(`Installing ${z.length} plugins from newly installed marketplace ${A}`), await dV6(z, q)
        }
    } catch (K) {
        K1(K instanceof Error ? K : Error(String(K)))
    }
}
// @from(Ln 407988, Col 0)
async function dV6(A, q) {
    let K = [],
        Y = [],
        z = NZ1(),
        w = new Map;
    for (let H of A) {
        bxA(q, H, "installing");
        try {
            let $ = await a0(H);
            if (!$) throw Error("Plugin not found in any marketplace");
            let O = z.get(H),
                {
                    entry: _,
                    marketplaceInstallLocation: J
                } = $,
                X = tx(_.source) ? xsY(J, _.source) : void 0;
            if (O === "flag") {
                let D = X ?? _.source;
                await F51(D, {
                    manifest: _
                })
            } else {
                let D = O || "user",
                    j = We(D);
                if (await HE(H, _, D, j, X), D !== "managed") {
                    if (C8().enabledPlugins?.[H] !== !0) {
                        let W = w.get(D) ?? {};
                        W[H] = !0, w.set(D, W)
                    }
                }
            }
            K.push(H), bxA(q, H, "installed")
        } catch ($) {
            let O = $ instanceof Error ? $.message : String($);
            Y.push({
                name: H,
                error: O
            }), bxA(q, H, "failed", O), K1($ instanceof Error ? $ : Error(String($)))
        }
    }
    for (let [H, $] of w)
        if (Object.keys($).length > 0) {
            let O = kB(H),
                _ = y7(O);
            Z7(O, {
                ..._,
                enabledPlugins: {
                    ..._?.enabledPlugins,
                    ...$
                }
            })
        } return {
        installed: K,
        failed: Y
    }
}
// @from(Ln 408044, Col 0)
async function cV6(A) {
    h("performBackgroundPluginInstallations called");
    try {
        let q = [],
            K = [],
            Y = await n5(),
            z = await UV6();
        if (z.size > 0) {
            h(`Found ${z.size} extra marketplaces in settings`);
            let $ = await pV6(z);
            if ($.length > 0) {
                h(`Installing ${$.length} marketplaces automatically`);
                for (let O of $) {
                    let _ = z.get(O);
                    if (_) q.push({
                        name: O,
                        marketplace: _
                    })
                }
            }
        }
        let w = await VZ1(),
            H = [];
        if (w.length > 0) {
            h(`Found ${w.length} enabled plugins`);
            let $ = await TZ1(),
                O = w.filter((J) => !$.includes(J));
            h(`Found ${O.length} missing plugins (not installed): ${O.join(", ")}`);
            let _ = [];
            for (let J of O) {
                let [, X] = J.split("@");
                if (!X) _.push(J);
                else if (X in Y || z.has(X) || q.some((D) => D.name === X)) _.push(J);
                else H.push(J)
            }
            if (H.length > 0) {
                let J = [...new Set(H.map((X) => X.split("@")[1]))];
                h(`Cannot install ${H.length} plugins because their marketplaces are not installed or configured: ${J.join(", ")}`), h(`Uninstallable plugins: ${H.join(", ")}`)
            }
            if (_.length > 0) h(`Installing ${_.length} plugins automatically`), K.push(..._)
        }
        if (h(`Setting installation status: ${q.length} marketplaces, ${K.length} installable plugins, ${H.length} uninstallable plugins`), A(($) => ({
                ...$,
                plugins: {
                    ...$.plugins,
                    installationStatus: {
                        marketplaces: q.map(({
                            name: O
                        }) => ({
                            name: O,
                            status: "pending"
                        })),
                        plugins: [...K.map((O) => {
                            let [_] = O.split("@");
                            return {
                                id: O,
                                name: _ || O,
                                status: "pending"
                            }
                        }), ...H.map((O) => {
                            let [_, J] = O.split("@");
                            return {
                                id: O,
                                name: _ || O,
                                status: "failed",
                                error: `Marketplace '${J}' is not installed or configured`
                            }
                        })]
                    }
                }
            })), q.length > 0) bsY(q.map(($) => $.name), z, A).catch(($) => {
            K1($ instanceof Error ? $ : Error(String($)))
        });
        if (K.length > 0) {
            let $ = K.filter((O) => {
                let [, _] = O.split("@");
                return !q.some((J) => J.name === _)
            });
            if ($.length > 0) dV6($, A).catch((O) => {
                K1(O instanceof Error ? O : Error(String(O)))
            })
        }
    } catch (q) {
        K1(q instanceof Error ? q : Error(String(q)))
    }
}
// @from(Ln 408130, Col 4)
lV6 = v(() => {
    Z6();
    y6();
    u6();
    f0();
    IxA();
    vZ1();
    Qq1();
    kZ1();
    p$();
    p$();
    VJ();
    ad();
    N0();
    p8()
})
// @from(Ln 408147, Col 0)
function ZE(A) {
    let q = e(5),
        {
            status: K,
            withSpace: Y
        } = A,
        z = Y === void 0 ? !1 : Y,
        w = BsY[K],
        H = !w.color,
        $ = z && " ",
        O;
    if (q[0] !== w.color || q[1] !== w.icon || q[2] !== H || q[3] !== $) O = jKq.default.createElement(V, {
        color: w.color,
        dimColor: H
    }, w.icon, $), q[0] = w.color, q[1] = w.icon, q[2] = H, q[3] = $, q[4] = O;
    else O = q[4];
    return O
}
// @from(Ln 408165, Col 4)
jKq
// @from(Ln 408165, Col 9)
BsY
// @from(Ln 408166, Col 4)
iV6 = v(() => {
    i1();
    b7();
    m1();
    jKq = o(X1(), 1), BsY = {
        success: {
            icon: l1.tick,
            color: "success"
        },
        error: {
            icon: l1.cross,
            color: "error"
        },
        warning: {
            icon: l1.warning,
            color: "warning"
        },
        info: {
            icon: l1.info,
            color: "suggestion"
        },
        pending: {
            icon: l1.circle,
            color: void 0
        },
        loading: {
            icon: "…",
            color: void 0
        }
    }
})
// @from(Ln 408198, Col 0)
function msY(A) {
    switch (A.type) {
        case "path-not-found":
            return `${A.component} path not found: ${A.path}`;
        case "git-auth-failed":
            return `Git ${A.authType.toUpperCase()} authentication failed for ${A.gitUrl}`;
        case "git-timeout":
            return `Git ${A.operation} timed out for ${A.gitUrl}`;
        case "network-error":
            return `Network error accessing ${A.url}${A.details?`: ${A.details}`:""}`;
        case "manifest-parse-error":
            return `Failed to parse manifest at ${A.manifestPath}: ${A.parseError}`;
        case "manifest-validation-error":
            return `Invalid manifest at ${A.manifestPath}: ${A.validationErrors.join(", ")}`;
        case "plugin-not-found":
            return `Plugin '${A.pluginId}' not found in marketplace '${A.marketplace}'`;
        case "marketplace-not-found":
            return `Marketplace '${A.marketplace}' not found`;
        case "marketplace-load-failed":
            return `Failed to load marketplace '${A.marketplace}': ${A.reason}`;
        case "repository-scan-failed":
            return `Failed to scan repository at ${A.repositoryPath}: ${A.reason}`;
        case "mcp-config-invalid":
            return `Invalid MCP server config for '${A.serverName}': ${A.validationError}`;
        case "hook-load-failed":
            return `Failed to load hooks from ${A.hookPath}: ${A.reason}`;
        case "component-load-failed":
            return `Failed to load ${A.component} from ${A.path}: ${A.reason}`;
        case "mcpb-download-failed":
            return `Failed to download MCPB from ${A.url}: ${A.reason}`;
        case "mcpb-extract-failed":
            return `Failed to extract MCPB ${A.mcpbPath}: ${A.reason}`;
        case "mcpb-invalid-manifest":
            return `MCPB manifest invalid at ${A.mcpbPath}: ${A.validationError}`;
        case "marketplace-blocked-by-policy":
            return A.blockedByBlocklist ? `Marketplace '${A.marketplace}' is blocked by enterprise policy` : `Marketplace '${A.marketplace}' is not in the allowed marketplace list`;
        case "generic-error":
            return A.error;
        default:
            return "Unknown error"
    }
}
// @from(Ln 408241, Col 0)
function MKq(A) {
    switch (A.type) {
        case "path-not-found":
            return "→ Check that the path in your manifest or marketplace config is correct";
        case "git-auth-failed":
            return A.authType === "ssh" ? "→ Configure SSH keys or use HTTPS URL instead" : "→ Configure credentials or use SSH URL instead";
        case "git-timeout":
        case "network-error":
            return "→ Check your internet connection and try again";
        case "manifest-parse-error":
            return "→ Check manifest file syntax in the plugin directory";
        case "manifest-validation-error":
            return "→ Check manifest file follows the required schema";
        case "plugin-not-found":
            return `→ Plugin may not exist in marketplace '${A.marketplace}'`;
        case "marketplace-not-found":
            return A.availableMarketplaces.length > 0 ? `→ Available marketplaces: ${A.availableMarketplaces.join(", ")}` : "→ Add the marketplace first using /plugin marketplace add";
        case "mcp-config-invalid":
            return "→ Check MCP server configuration in .mcp.json or manifest";
        case "hook-load-failed":
            return "→ Check hooks.json file syntax and structure";
        case "component-load-failed":
            return `→ Check ${A.component} directory structure and file permissions`;
        case "mcpb-download-failed":
            return "→ Check your internet connection and URL accessibility";
        case "mcpb-extract-failed":
            return "→ Verify the MCPB file is valid and not corrupted";
        case "mcpb-invalid-manifest":
            return "→ Contact the plugin author about the invalid manifest";
        case "marketplace-blocked-by-policy":
            if (A.blockedByBlocklist) return "→ This marketplace source is explicitly blocked by your administrator";
            return A.allowedSources.length > 0 ? `→ Allowed sources: ${A.allowedSources.join(", ")}` : "→ Contact your administrator to configure allowed marketplace sources";
        case "repository-scan-failed":
        case "marketplace-load-failed":
        case "generic-error":
            return null;
        default:
            return null
    }
}