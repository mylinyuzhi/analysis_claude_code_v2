
// @from(Ln 455106, Col 0)
async function bx6(q, K) {
    let {
        name: _,
        marketplace: z
    } = Z4(q), Y = z ? `${_}@${z}` : q, A;
    if (z) {
        let D = (await Dz())[z]?.source;
        if (D && (D.source === "github" || D.source === "git" || D.source === "url")) try {
            await P_6(z, void 0, {
                skipIfRecent: !0
            })
        } catch (Z) {
            A = `marketplace not refreshed (${b6(Z)})`, E(`Failed to refresh marketplace '${z}' before update; using cached data: ${b6(Z)}`, {
                level: "warn"
            })
        }
    }
    let O = await mf(q);
    if (!O) return {
        success: !1,
        message: `Plugin "${_}" not found`,
        pluginId: Y,
        scope: K
    };
    let {
        entry: w,
        marketplaceInstallLocation: $
    } = O, H = mR().plugins[Y];
    if (!H || H.length === 0) return {
        success: !1,
        message: `Plugin "${_}" is not installed`,
        pluginId: Y,
        scope: K
    };
    let J = apK(K),
        X = H.filter((W) => W.scope === K),
        M = X.find((W) => W.projectPath === J);
    if (!M && X.length > 1) E(`updatePluginOp: ${X.length} ${K}-scope installs, none match CWD '${J}'; updating '${X[0]?.projectPath}' only`, {
        level: "warn"
    });
    let P = M ?? X[0];
    if (!P) {
        let W = J ? `${K} (${J})` : K;
        return {
            success: !1,
            message: `Plugin "${_}" is not installed at scope ${W}`,
            pluginId: Y,
            scope: K
        }
    }
    return HxY({
        pluginId: Y,
        pluginName: _,
        entry: w,
        marketplaceInstallLocation: $,
        installation: P,
        scope: K,
        projectPath: P.projectPath,
        refreshWarning: A
    })
}
// @from(Ln 455167, Col 0)
async function HxY({
    pluginId: q,
    pluginName: K,
    entry: _,
    marketplaceInstallLocation: z,
    installation: Y,
    scope: A,
    projectPath: O,
    refreshWarning: w
}) {
    let $ = V8(),
        j = Y.version,
        H, J, X, M = !1,
        P;
    if (typeof _.source !== "string") {
        let W = await f68(_.source, {
            manifest: {
                name: _.name
            }
        });
        H = W.path, M = !0, P = W.gitCommitSha, X = W.manifest?.version, J = await us(q, _.source, W.manifest, W.path, _.version, W.gitCommitSha)
    } else {
        let W;
        try {
            W = await $.stat(z)
        } catch (G) {
            if (t1(G)) return {
                success: !1,
                message: `Marketplace directory not found at ${z}`,
                pluginId: q,
                scope: A
            };
            throw G
        }
        let D = W.isDirectory() ? z : AxY(z);
        H = OxY(D, _.source);
        try {
            await $.stat(H)
        } catch (G) {
            if (t1(G)) return {
                success: !1,
                message: `Plugin source not found at ${H}`,
                pluginId: q,
                scope: A
            };
            throw G
        }
        let Z;
        try {
            Z = (await k68(H, _.name, _.source)).manifest
        } catch {}
        X = Z?.version, J = await us(q, _.source, Z, H, _.version)
    }
    try {
        let {
            enabled: W,
            disabled: D
        } = await sW(), Z = $f4(q, [...W, ...D]);
        if (Z.length > 0) {
            let R = hx6.valid(X) ?? hx6.coerce(X)?.version,
                h = Z.filter(({
                    constraint: C
                }) => C.version !== void 0 && R !== void 0 && !hx6.satisfies(R, C.version)).map(({
                    plugin: C
                }) => C.source);
            if (h.length > 0) return {
                success: !0,
                skipped: !0,
                message: `Skipped — ${h.join(", ")} requires ${K} at a version range that ${X??J} does not satisfy`,
                pluginId: q,
                scope: A,
                blockedBy: h,
                oldVersion: j
            }
        }
        let G = Sp(q, J),
            f = yL6(q, J);
        if (Y.version === J || Y.installPath === G || Y.installPath === f) {
            let R = `${K} is already at the latest version (${J}).`;
            return {
                success: !0,
                message: w ? `${R} Warning: ${w} — version shown may be stale.` : R,
                pluginId: q,
                newVersion: J,
                oldVersion: j,
                alreadyUpToDate: !0,
                scope: A
            }
        }
        G = await rS8(H, q, J, _);
        let V = Y.installPath;
        if (ZEK(q, A, O, G, J, P), V && V !== G) {
            let R = mR();
            if (!Object.values(R.plugins).some((C) => C.some((x) => x.installPath === V))) await hI6(V)
        }
        let k = O ? `${A} (${O})` : A,
            N = `Plugin "${K}" updated from ${j||"unknown"} to ${J} for scope ${k}. Restart to apply changes.`;
        return {
            success: !0,
            message: w ? `${N} Warning: ${w}.` : N,
            pluginId: q,
            newVersion: J,
            oldVersion: j,
            scope: A
        }
    } finally {
        if (M && H !== Sp(q, J)) await $.rm(H, {
            recursive: !0,
            force: !0
        })
    }
}
// @from(Ln 455279, Col 4)
hx6
// @from(Ln 455279, Col 9)
vG
// @from(Ln 455279, Col 13)
dP6
// @from(Ln 455280, Col 4)
Ix6 = L(() => {
    y8();
    z68();
    K8();
    m8();
    Yq();
    U8();
    uR();
    vS8();
    yD();
    m$();
    Jy();
    aW();
    Y56();
    vH();
    Gx();
    AH6();
    X_8();
    yS8();
    a1();
    hx6 = K6(Pd(), 1), vG = ["user", "project", "local"], dP6 = ["user", "project", "local", "managed"]
})
// @from(Ln 455303, Col 0)
function qFK(q) {
    if (Fi8 = q, D_8 !== null && D_8.length > 0) q(D_8), D_8 = null;
    return () => {
        Fi8 = null
    }
}
// @from(Ln 455309, Col 0)
async function JxY() {
    let q = await Dz(),
        K = X_6(),
        _ = new Set;
    for (let [z, Y] of Object.entries(q)) {
        let A = K[z]?.autoUpdate;
        if (A !== void 0 ? A : bQ6(z, Y)) _.add(z.toLowerCase())
    }
    return _
}
// @from(Ln 455319, Col 0)
async function XxY(q, K) {
    let _ = !1;
    for (let {
            scope: z
        }
        of K) try {
        let Y = await bx6(q, z);
        if (Y.success && !Y.alreadyUpToDate && !Y.skipped) _ = !0, E(`Plugin autoupdate: updated ${q} from ${Y.oldVersion} to ${Y.newVersion}`);
        else if (Y.skipped) E(`Plugin autoupdate: ${q} ${Y.message}`);
        else if (!Y.alreadyUpToDate) E(`Plugin autoupdate: failed to update ${q}: ${Y.message}`, {
            level: "warn"
        })
    } catch (Y) {
        E(`Plugin autoupdate: error updating ${q}: ${b6(Y)}`, {
            level: "warn"
        })
    }
    return _ ? q : null
}
// @from(Ln 455338, Col 0)
async function Hw7(q) {
    let K = mR(),
        _ = Object.keys(K.plugins);
    if (_.length === 0) return [];
    return (await Promise.allSettled(_.map(async (Y) => {
        let {
            marketplace: A
        } = Z4(Y);
        if (!A || !q.has(A.toLowerCase())) return null;
        let O = K.plugins[Y];
        if (!O || O.length === 0) return null;
        let w = O.filter(O_7);
        if (w.length === 0) return null;
        return XxY(Y, w)
    }))).filter((Y) => Y.status === "fulfilled" && Y.value !== null).map((Y) => Y.value)
}
// @from(Ln 455354, Col 0)
async function MxY(q) {
    return Hw7(q)
}
// @from(Ln 455358, Col 0)
function KFK() {
    return (async () => {
        if (ok6()) {
            E("Plugin autoupdate: skipped (auto-updater disabled)");
            return
        }
        try {
            let q = await JxY();
            if (q.size === 0) return;
            let _ = (await Promise.allSettled(Array.from(q).map(async (Y) => {
                try {
                    await P_6(Y, void 0, {
                        disableCredentialHelper: !0
                    })
                } catch (A) {
                    E(`Plugin autoupdate: failed to refresh marketplace ${Y}: ${b6(A)}`, {
                        level: "warn"
                    })
                }
            }))).filter((Y) => Y.status === "rejected");
            if (_.length > 0) E(`Plugin autoupdate: ${_.length} marketplace refresh(es) failed`, {
                level: "warn"
            });
            E("Plugin autoupdate: checking installed plugins");
            let z = await MxY(q);
            if (z.length > 0)
                if (Fi8) Fi8(z);
                else D_8 = z
        } catch (q) {
            j6(q)
        }
    })()
}
// @from(Ln 455391, Col 4)
Fi8 = null
// @from(Ln 455392, Col 4)
D_8 = null
// @from(Ln 455393, Col 4)
gi8 = L(() => {
    Ix6();
    h1();
    K8();
    m8();
    U8();
    yD();
    m$();
    aW();
    Hv()
})
// @from(Ln 455405, Col 0)
function _FK({
    setViewState: q,
    error: K,
    setError: _,
    setResult: z,
    exitState: Y,
    onManageComplete: A,
    targetMarketplace: O,
    action: w
}) {
    let [$, j] = jZ.useState([]), [H, J] = jZ.useState(!0), [X, M] = jZ.useState(0), [P, W] = jZ.useState(!1), [D, Z] = jZ.useState(null), [G, f] = jZ.useState(null), [v, V] = jZ.useState(null), [k, N] = jZ.useState("list"), [R, h] = jZ.useState(null), [C, x] = jZ.useState(0), B = jZ.useRef(!1), m = jZ.useRef(void 0), S = jZ.useRef(!0);
    jZ.useEffect(() => () => {
        S.current = !1, clearTimeout(m.current)
    }, []), jZ.useEffect(() => {
        async function O6() {
            try {
                let J6 = await Dz(),
                    {
                        enabled: $6,
                        disabled: H6
                    } = await sW(),
                    q6 = [...$6, ...H6],
                    {
                        marketplaces: o,
                        failures: _6
                    } = await Rp(J6),
                    r = [];
                for (let {
                        name: X6,
                        config: M6,
                        data: W6
                    }
                    of o) {
                    let V6 = q6.filter((f6) => f6.source.endsWith(`@${X6}`));
                    r.push({
                        name: X6,
                        source: O68(M6.source),
                        lastUpdated: M6.lastUpdated,
                        pluginCount: W6?.plugins.length,
                        installedPlugins: V6,
                        pendingUpdate: !1,
                        pendingRemove: !1,
                        autoUpdate: bQ6(X6, M6)
                    })
                }
                r.sort((X6, M6) => {
                    if (X6.name === "claude-plugin-directory") return -1;
                    if (M6.name === "claude-plugin-directory") return 1;
                    return X6.name.localeCompare(M6.name)
                }), j(r);
                let t = w7(o, (X6) => X6.data !== null),
                    Y6 = $L6(_6, t);
                if (Y6)
                    if (Y6.type === "warning") Z(Y6.message);
                    else throw Error(Y6.message);
                if (O && !B.current && !K) {
                    B.current = !0;
                    let X6 = r.findIndex((M6) => M6.name === O);
                    if (X6 >= 0) {
                        let M6 = r[X6];
                        if (w) {
                            M(X6 + 1);
                            let W6 = r.map((V6, f6) => f6 === X6 ? {
                                ...V6,
                                pendingUpdate: w === "update",
                                pendingRemove: w === "remove"
                            } : V6);
                            j(W6), g(W6)
                        } else if (M6) M(X6 + 1), h(M6), clearTimeout(m.current), N("details")
                    } else if (_) _(`Marketplace not found: ${O}`)
                }
            } catch (J6) {
                if (_) _(J6 instanceof Error ? J6.message : "Failed to load marketplaces");
                Z(J6 instanceof Error ? J6.message : "Failed to load marketplaces")
            } finally {
                J(!1)
            }
        }
        O6()
    }, [O, w, K]);
    let F = () => {
            return $.some((O6) => O6.pendingUpdate || O6.pendingRemove)
        },
        U = () => {
            let O6 = w7($, ($6) => $6.pendingUpdate),
                J6 = w7($, ($6) => $6.pendingRemove);
            return {
                updateCount: O6,
                removeCount: J6
            }
        },
        g = async (O6) => {
            let J6 = O6 || $,
                $6 = k === "details";
            W(!0), Z(null), f(null), V(null);
            try {
                let H6 = E1("userSettings"),
                    q6 = 0,
                    o = 0,
                    _6 = new Set;
                for (let G6 of J6) {
                    if (G6.pendingRemove) {
                        if (G6.installedPlugins && G6.installedPlugins.length > 0) {
                            let k6 = {
                                ...H6?.enabledPlugins
                            };
                            for (let T6 of G6.installedPlugins) {
                                let v6 = Jc(T6.name, G6.name);
                                k6[v6] = !1
                            }
                            P7("userSettings", {
                                enabledPlugins: k6
                            })
                        }
                        await RI6(G6.name), o++, d("tengu_marketplace_removed", {
                            marketplace_name: G6.name,
                            plugins_uninstalled: G6.installedPlugins?.length || 0
                        });
                        continue
                    }
                    if (G6.pendingUpdate) await P_6(G6.name, (k6) => {
                        V(k6)
                    }), q6++, _6.add(G6.name.toLowerCase()), d("tengu_marketplace_updated", {
                        marketplace_name: G6.name
                    })
                }
                let r = 0;
                if (_6.size > 0) r = (await Hw7(_6)).length;
                if (YO(), A) await A();
                if (!S.current) return;
                let t = await Dz(),
                    {
                        enabled: Y6,
                        disabled: X6
                    } = await sW();
                if (!S.current) return;
                let M6 = [...Y6, ...X6],
                    {
                        marketplaces: W6
                    } = await Rp(t);
                if (!S.current) return;
                let V6 = [];
                for (let {
                        name: G6,
                        config: k6,
                        data: T6
                    }
                    of W6) {
                    let v6 = M6.filter((L6) => L6.source.endsWith(`@${G6}`));
                    V6.push({
                        name: G6,
                        source: O68(k6.source),
                        lastUpdated: k6.lastUpdated,
                        pluginCount: T6?.plugins.length,
                        installedPlugins: v6,
                        pendingUpdate: !1,
                        pendingRemove: !1,
                        autoUpdate: bQ6(G6, k6)
                    })
                }
                if (V6.sort((G6, k6) => {
                        if (G6.name === "claude-plugin-directory") return -1;
                        if (k6.name === "claude-plugin-directory") return 1;
                        return G6.name.localeCompare(k6.name)
                    }), j(V6), $6 && R) {
                    let G6 = V6.find((k6) => k6.name === R.name);
                    if (G6) h(G6)
                }
                let f6 = [];
                if (q6 > 0) {
                    let G6 = r > 0 ? ` (${r} ${O7(r,"plugin")} bumped)` : "";
                    f6.push(`Updated ${q6} ${O7(q6,"marketplace")}${G6}`)
                }
                if (o > 0) f6.push(`Removed ${o} ${O7(o,"marketplace")}`);
                if (f6.length > 0) {
                    let G6 = `${e6.tick} ${f6.join(", ")}`;
                    if ($6) f(G6);
                    else {
                        if (!S.current) return;
                        z(G6), clearTimeout(m.current), m.current = setTimeout(q, 2000, {
                            type: "menu"
                        })
                    }
                } else if (!$6) {
                    if (!S.current) return;
                    q({
                        type: "menu"
                    })
                }
            } catch (H6) {
                let q6 = b6(H6);
                if (!S.current) return;
                if (Z(q6), _) _(q6)
            } finally {
                if (S.current) W(!1), V(null)
            }
        }, c = async () => {
            if (!R) return;
            let O6 = $.map((J6) => J6.name === R.name ? {
                ...J6,
                pendingRemove: !0
            } : J6);
            j(O6), await g(O6)
        }, n = (O6) => {
            if (!O6) return [];
            let J6 = [{
                label: `Browse plugins (${O6.pluginCount??0})`,
                value: "browse"
            }, {
                label: "Update marketplace",
                secondaryLabel: O6.lastUpdated ? `(last updated ${new Date(O6.lastUpdated).toLocaleDateString()})` : void 0,
                value: "update"
            }];
            if (!ok6()) J6.push({
                label: O6.autoUpdate ? "Disable auto-update" : "Enable auto-update",
                value: "toggle-auto-update"
            });
            return J6.push({
                label: "Remove marketplace",
                value: "remove"
            }), J6
        }, l = async (O6) => {
            let J6 = !O6.autoUpdate;
            try {
                await XEK(O6.name, J6), j(($6) => $6.map((H6) => H6.name === O6.name ? {
                    ...H6,
                    autoUpdate: J6
                } : H6)), h(($6) => $6 ? {
                    ...$6,
                    autoUpdate: J6
                } : $6)
            } catch ($6) {
                Z($6 instanceof Error ? $6.message : "Failed to update setting")
            }
        };
    G1("confirm:no", () => {
        clearTimeout(m.current), N("list"), x(0)
    }, {
        context: "Confirmation",
        isActive: !P && (k === "details" || k === "confirm-remove")
    }), G1("confirm:no", () => {
        clearTimeout(m.current), j((O6) => O6.map((J6) => ({
            ...J6,
            pendingUpdate: !1,
            pendingRemove: !1
        }))), M(0)
    }, {
        context: "Confirmation",
        isActive: !P && k === "list" && F()
    }), G1("confirm:no", () => {
        q({
            type: "menu"
        })
    }, {
        context: "Confirmation",
        isActive: !P && k === "list" && !F()
    }), L7({
        "select:previous": () => M((O6) => Math.max(0, O6 - 1)),
        "select:next": () => {
            let O6 = $.length + 1;
            M((J6) => Math.min(O6 - 1, J6 + 1))
        },
        "select:accept": () => {
            clearTimeout(m.current);
            let O6 = X - 1;
            if (X === 0) q({
                type: "add-marketplace"
            });
            else if (F()) g();
            else {
                let J6 = $[O6];
                if (J6) h(J6), N("details"), x(0)
            }
        }
    }, {
        context: "Select",
        isActive: !P && k === "list"
    });

    function z6(O6) {
        if (O6.ctrl || O6.meta || P) return;
        let J6 = X - 1;
        if ((O6.key === "u" || O6.key === "U") && J6 >= 0) O6.preventDefault(), clearTimeout(m.current), j(($6) => $6.map((H6, q6) => q6 === J6 ? {
            ...H6,
            pendingUpdate: !H6.pendingUpdate,
            pendingRemove: H6.pendingUpdate ? H6.pendingRemove : !1
        } : H6));
        else if ((O6.key === "r" || O6.key === "R") && J6 >= 0) {
            let $6 = $[J6];
            if ($6) O6.preventDefault(), h($6), clearTimeout(m.current), N("confirm-remove")
        }
    }
    L7({
        "select:previous": () => x((O6) => Math.max(0, O6 - 1)),
        "select:next": () => {
            let O6 = n(R);
            x((J6) => Math.min(O6.length - 1, J6 + 1))
        },
        "select:accept": () => {
            if (clearTimeout(m.current), !R) return;
            let J6 = n(R)[C];
            if (J6?.value === "browse") q({
                type: "browse-marketplace",
                targetMarketplace: R.name
            });
            else if (J6?.value === "update") {
                let $6 = $.map((H6) => H6.name === R.name ? {
                    ...H6,
                    pendingUpdate: !0
                } : H6);
                j($6), g($6)
            } else if (J6?.value === "toggle-auto-update") l(R);
            else if (J6?.value === "remove") N("confirm-remove")
        }
    }, {
        context: "Select",
        isActive: !P && k === "details"
    });

    function A6(O6) {
        if (O6.ctrl || O6.meta || P) return;
        if (O6.key === "y" || O6.key === "Y") O6.preventDefault(), clearTimeout(m.current), c();
        else if (O6.key === "n" || O6.key === "N") O6.preventDefault(), clearTimeout(m.current), N("list"), h(null)
    }
    if (H) return $1.createElement(T, null, "Loading marketplaces…");
    if ($.length === 0) return $1.createElement(u, {
        flexDirection: "column"
    }, $1.createElement(u, {
        marginBottom: 1
    }, $1.createElement(T, {
        bold: !0
    }, "Manage marketplaces")), $1.createElement(u, {
        flexDirection: "row",
        gap: 1
    }, $1.createElement(T, {
        color: "suggestion"
    }, e6.pointer, " +"), $1.createElement(T, {
        bold: !0,
        color: "suggestion"
    }, "Add Marketplace")), $1.createElement(u, {
        marginLeft: 3
    }, $1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, Y.pending ? $1.createElement($1.Fragment, null, "Press ", Y.keyName, " again to go back") : $1.createElement(z1, null, $1.createElement(v1, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "select"
    }), $1.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })))));
    if (k === "confirm-remove" && R) {
        let O6 = R.installedPlugins?.length || 0;
        return $1.createElement(u, {
            flexDirection: "column",
            tabIndex: 0,
            autoFocus: !0,
            onKeyDown: A6
        }, $1.createElement(T, {
            bold: !0,
            color: "warning"
        }, "Remove marketplace ", $1.createElement(T, {
            italic: !0
        }, R.name), "?"), $1.createElement(u, {
            flexDirection: "column"
        }, O6 > 0 && $1.createElement(u, {
            marginTop: 1
        }, $1.createElement(T, {
            color: "warning"
        }, "This will also uninstall ", O6, " ", O7(O6, "plugin"), " from this marketplace:")), R.installedPlugins && R.installedPlugins.length > 0 && $1.createElement(u, {
            flexDirection: "column",
            marginTop: 1,
            marginLeft: 2
        }, R.installedPlugins.map((J6) => $1.createElement(T, {
            key: J6.name,
            dimColor: !0
        }, "• ", J6.name))), $1.createElement(u, {
            marginTop: 1
        }, $1.createElement(T, null, "Press ", $1.createElement(T, {
            bold: !0
        }, "y"), " to confirm or ", $1.createElement(T, {
            bold: !0
        }, "n"), " to cancel"))))
    }
    if (k === "details" && R) {
        let O6 = R.pendingUpdate || P,
            J6 = n(R);
        return $1.createElement(u, {
            flexDirection: "column"
        }, $1.createElement(T, {
            bold: !0
        }, R.name), $1.createElement(T, {
            dimColor: !0
        }, R.source), $1.createElement(u, {
            marginTop: 1
        }, $1.createElement(T, null, R.pluginCount || 0, " available", " ", O7(R.pluginCount || 0, "plugin"))), R.installedPlugins && R.installedPlugins.length > 0 && $1.createElement(u, {
            flexDirection: "column",
            marginTop: 1
        }, $1.createElement(T, {
            bold: !0
        }, "Installed plugins (", R.installedPlugins.length, "):"), $1.createElement(u, {
            flexDirection: "column",
            marginLeft: 1
        }, R.installedPlugins.map(($6) => $1.createElement(u, {
            key: $6.name,
            flexDirection: "row",
            gap: 1
        }, $1.createElement(T, null, e6.bullet), $1.createElement(u, {
            flexDirection: "column"
        }, $1.createElement(T, null, $6.name), $1.createElement(T, {
            dimColor: !0
        }, $6.manifest.description)))))), O6 && $1.createElement(u, {
            marginTop: 1,
            flexDirection: "column"
        }, $1.createElement(T, {
            color: "claude"
        }, "Updating marketplace…"), v && $1.createElement(T, {
            dimColor: !0
        }, v)), !O6 && G && $1.createElement(u, {
            marginTop: 1
        }, $1.createElement(T, {
            color: "claude"
        }, G)), !O6 && D && $1.createElement(u, {
            marginTop: 1
        }, $1.createElement(T, {
            color: "error"
        }, D)), !O6 && $1.createElement(u, {
            flexDirection: "column",
            marginTop: 1
        }, J6.map(($6, H6) => {
            if (!$6) return null;
            let q6 = H6 === C;
            return $1.createElement(u, {
                key: $6.value
            }, $1.createElement(T, {
                color: q6 ? "suggestion" : void 0
            }, q6 ? e6.pointer : " ", " ", $6.label), $6.secondaryLabel && $1.createElement(T, {
                dimColor: !0
            }, " ", $6.secondaryLabel))
        })), !O6 && !ok6() && R.autoUpdate && $1.createElement(u, {
            marginTop: 1
        }, $1.createElement(T, {
            dimColor: !0
        }, "Auto-update enabled. Claude Code will automatically update this marketplace and its installed plugins.")), $1.createElement(u, {
            marginLeft: 3
        }, $1.createElement(T, {
            dimColor: !0,
            italic: !0
        }, O6 ? $1.createElement($1.Fragment, null, "Please wait…") : $1.createElement(z1, null, $1.createElement(v1, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "select"
        }), $1.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
        })))))
    }
    let {
        updateCount: e,
        removeCount: i
    } = U();
    return $1.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: z6
    }, $1.createElement(u, {
        marginBottom: 1
    }, $1.createElement(T, {
        bold: !0
    }, "Manage marketplaces")), $1.createElement(u, {
        flexDirection: "row",
        gap: 1,
        marginBottom: 1
    }, $1.createElement(T, {
        color: X === 0 ? "suggestion" : void 0
    }, X === 0 ? e6.pointer : " ", " +"), $1.createElement(T, {
        bold: !0,
        color: X === 0 ? "suggestion" : void 0
    }, "Add Marketplace")), $1.createElement(u, {
        flexDirection: "column"
    }, $.map((O6, J6) => {
        let $6 = J6 + 1 === X,
            H6 = [];
        if (O6.pendingUpdate) H6.push("UPDATE");
        if (O6.pendingRemove) H6.push("REMOVE");
        return $1.createElement(u, {
            key: O6.name,
            flexDirection: "row",
            gap: 1,
            marginBottom: 1
        }, $1.createElement(T, {
            color: $6 ? "suggestion" : void 0
        }, $6 ? e6.pointer : " ", " ", O6.pendingRemove ? e6.cross : e6.bullet), $1.createElement(u, {
            flexDirection: "column",
            flexGrow: 1
        }, $1.createElement(u, {
            flexDirection: "row",
            gap: 1
        }, $1.createElement(T, {
            bold: !0,
            strikethrough: O6.pendingRemove,
            dimColor: O6.pendingRemove
        }, O6.name === "claude-plugins-official" && $1.createElement(T, {
            color: "claude"
        }, "✻ "), O6.name, O6.name === "claude-plugins-official" && $1.createElement(T, {
            color: "claude"
        }, " ✻")), H6.length > 0 && $1.createElement(T, {
            color: "warning"
        }, "[", H6.join(", "), "]")), $1.createElement(T, {
            dimColor: !0
        }, O6.source), $1.createElement(T, {
            dimColor: !0
        }, O6.pluginCount !== void 0 && $1.createElement($1.Fragment, null, O6.pluginCount, " available"), O6.installedPlugins && O6.installedPlugins.length > 0 && $1.createElement($1.Fragment, null, " • ", O6.installedPlugins.length, " installed"), O6.lastUpdated && $1.createElement($1.Fragment, null, " ", "• Updated", " ", new Date(O6.lastUpdated).toLocaleDateString()))))
    })), F() && $1.createElement(u, {
        marginTop: 1,
        flexDirection: "column"
    }, $1.createElement(T, null, $1.createElement(T, {
        bold: !0
    }, "Pending changes:"), " ", $1.createElement(T, {
        dimColor: !0
    }, $1.createElement(v1, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "apply"
    }))), e > 0 && $1.createElement(T, null, "• Update ", e, " ", O7(e, "marketplace")), i > 0 && $1.createElement(T, {
        color: "warning"
    }, "• Remove ", i, " ", O7(i, "marketplace"))), P && $1.createElement(u, {
        marginTop: 1
    }, $1.createElement(T, {
        color: "claude"
    }, "Processing changes…")), D && $1.createElement(u, {
        marginTop: 1
    }, $1.createElement(T, {
        color: "error"
    }, D)), $1.createElement(PxY, {
        exitState: Y,
        hasPendingActions: F()
    }))
}
// @from(Ln 455954, Col 0)
function PxY(q) {
    let K = s(18),
        {
            exitState: _,
            hasPendingActions: z
        } = q;
    if (_.pending) {
        let J;
        if (K[0] !== _.keyName) J = $1.createElement(u, {
            marginTop: 1
        }, $1.createElement(T, {
            dimColor: !0,
            italic: !0
        }, "Press ", _.keyName, " again to go back")), K[0] = _.keyName, K[1] = J;
        else J = K[1];
        return J
    }
    let Y;
    if (K[2] !== z) Y = z && $1.createElement(v1, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "apply changes"
    }), K[2] = z, K[3] = Y;
    else Y = K[3];
    let A;
    if (K[4] !== z) A = !z && $1.createElement(v1, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "select"
    }), K[4] = z, K[5] = A;
    else A = K[5];
    let O;
    if (K[6] !== z) O = !z && $1.createElement(A8, {
        chord: "u",
        action: "update"
    }), K[6] = z, K[7] = O;
    else O = K[7];
    let w;
    if (K[8] !== z) w = !z && $1.createElement(A8, {
        chord: "r",
        action: "remove"
    }), K[8] = z, K[9] = w;
    else w = K[9];
    let $ = z ? "cancel" : "go back",
        j;
    if (K[10] !== $) j = $1.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: $
    }), K[10] = $, K[11] = j;
    else j = K[11];
    let H;
    if (K[12] !== Y || K[13] !== A || K[14] !== O || K[15] !== w || K[16] !== j) H = $1.createElement(u, {
        marginTop: 1
    }, $1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, $1.createElement(z1, null, Y, A, O, w, j))), K[12] = Y, K[13] = A, K[14] = O, K[15] = w, K[16] = j, K[17] = H;
    else H = K[17];
    return H
}
// @from(Ln 456018, Col 4)
$1
// @from(Ln 456018, Col 8)
jZ
// @from(Ln 456019, Col 4)
zFK = L(() => {
    o6();
    Qq();
    C8();
    bK();
    Nq();
    u7();
    g6();
    C7();
    h1();
    m8();
    uR();
    Xc();
    m$();
    gi8();
    vH();
    Hv();
    a1();
    $1 = K6(P6(), 1), jZ = K6(P6(), 1)
})
// @from(Ln 456052, Col 0)
function YFK() {
    return vxY(gP(), TxY)
}
// @from(Ln 456056, Col 0)
function kxY(q) {
    let K = n8(q);
    if (typeof K !== "object" || K === null || !("plugins" in K) || typeof K.plugins !== "object" || K.plugins === null) return {};
    let _ = K.plugins,
        z = {};
    for (let [Y, A] of Object.entries(_))
        if (A && typeof A === "object" && "flaggedAt" in A && typeof A.flaggedAt === "string") {
            let O = {
                flaggedAt: A.flaggedAt
            };
            if ("seenAt" in A && typeof A.seenAt === "string") O.seenAt = A.seenAt;
            z[Y] = O
        } return z
}
// @from(Ln 456070, Col 0)
async function Ui8() {
    try {
        let q = await DxY(YFK(), {
            encoding: "utf-8"
        });
        return kxY(q)
    } catch {
        return {}
    }
}
// @from(Ln 456080, Col 0)
async function Qi8(q) {
    let K = YFK(),
        _ = `${K}.${WxY(8).toString("hex")}.tmp`;
    try {
        await V8().mkdir(gP());
        let z = I6({
            plugins: q
        }, null, 2);
        await GxY(_, z, {
            encoding: "utf-8",
            mode: 384
        }), await ZxY(_, K), WL = q
    } catch (z) {
        j6(z);
        try {
            await fxY(_)
        } catch {}
    }
}
// @from(Ln 456099, Col 0)
async function AFK() {
    let q = await Ui8(),
        K = Date.now(),
        _ = !1;
    for (let [z, Y] of Object.entries(q))
        if (Y.seenAt && K - new Date(Y.seenAt).getTime() >= VxY) delete q[z], _ = !0;
    if (WL = q, _) await Qi8(q)
}
// @from(Ln 456108, Col 0)
function xx6() {
    return WL ?? {}
}
// @from(Ln 456111, Col 0)
async function OFK(q) {
    if (WL === null) WL = await Ui8();
    let K = {
        ...WL,
        [q]: {
            flaggedAt: new Date().toISOString()
        }
    };
    await Qi8(K), E(`Flagged plugin: ${q}`)
}
// @from(Ln 456121, Col 0)
async function wFK(q) {
    if (WL === null) WL = await Ui8();
    let K = new Date().toISOString(),
        _ = !1,
        z = {
            ...WL
        };
    for (let Y of q) {
        let A = z[Y];
        if (A && !A.seenAt) z[Y] = {
            ...A,
            seenAt: K
        }, _ = !0
    }
    if (_) await Qi8(z)
}
// @from(Ln 456137, Col 0)
async function $FK(q) {
    if (WL === null) WL = await Ui8();
    if (!(q in WL)) return;
    let {
        [q]: K, ..._
    } = WL;
    WL = _, await Qi8(_)
}
// @from(Ln 456145, Col 4)
TxY = "flagged-plugins.json"
// @from(Ln 456146, Col 4)
VxY = 172800000
// @from(Ln 456147, Col 4)
WL = null
// @from(Ln 456148, Col 4)
di8 = L(() => {
    K8();
    Yq();
    U8();
    e8();
    Jy()
})
// @from(Ln 456156, Col 0)
function g_6(q) {
    switch (q.type) {
        case "path-not-found":
            return `${q.component} path not found: ${q.path}`;
        case "path-traversal":
            return `${q.component} path escapes plugin directory: ${q.path}`;
        case "git-auth-failed":
            return `Git ${q.authType.toUpperCase()} authentication failed for ${q.gitUrl}`;
        case "git-timeout":
            return `Git ${q.operation} timed out for ${q.gitUrl}`;
        case "network-error":
            return `Network error accessing ${q.url}${q.details?`: ${q.details}`:""}`;
        case "manifest-parse-error":
            return `Failed to parse manifest at ${q.manifestPath}: ${q.parseError}`;
        case "manifest-validation-error":
            return `Invalid manifest at ${q.manifestPath}: ${q.validationErrors.join(", ")}`;
        case "plugin-not-found":
            return `Plugin "${q.pluginId}" not found in marketplace "${q.marketplace}"`;
        case "marketplace-not-found":
            return `Marketplace "${q.marketplace}" not found`;
        case "marketplace-load-failed":
            return `Failed to load marketplace "${q.marketplace}": ${q.reason}`;
        case "mcp-config-invalid":
            return `Invalid MCP server config for "${q.serverName}": ${q.validationError}`;
        case "mcp-server-suppressed-duplicate": {
            let _ = q.duplicateOf.startsWith("plugin:") ? `server provided by plugin "${q.duplicateOf.split(":")[1]??"?"}"` : `already-configured "${q.duplicateOf}"`;
            return `MCP server "${q.serverName}" skipped — same command/URL as ${_}`
        }
        case "hook-load-failed":
            return `Failed to load hooks from ${q.hookPath}: ${q.reason}`;
        case "component-load-failed":
            return `Failed to load ${q.component} from ${q.path}: ${q.reason}`;
        case "mcpb-download-failed":
            return `Failed to download MCPB from ${q.url}: ${q.reason}`;
        case "mcpb-extract-failed":
            return `Failed to extract MCPB ${q.mcpbPath}: ${q.reason}`;
        case "mcpb-invalid-manifest":
            return `MCPB manifest invalid at ${q.mcpbPath}: ${q.validationError}`;
        case "marketplace-blocked-by-policy":
            return q.blockedByBlocklist ? `Marketplace "${q.marketplace}" is blocked by enterprise policy` : `Marketplace "${q.marketplace}" is not in the allowed marketplace list`;
        case "dependency-unsatisfied":
            return q.reason === "not-enabled" ? `Dependency "${q.dependency}" is disabled` : `Dependency "${q.dependency}" is not installed`;
        case "dependency-version-unsatisfied":
            return `Requires "${q.dependency}" ${q.required}, installed ${q.installed??"version unknown"}`;
        case "lsp-config-invalid":
            return `Invalid LSP server config for "${q.serverName}": ${q.validationError}`;
        case "lsp-server-start-failed":
            return `LSP server "${q.serverName}" failed to start: ${q.reason}`;
        case "lsp-server-crashed":
            return q.signal ? `LSP server "${q.serverName}" crashed with signal ${q.signal}` : `LSP server "${q.serverName}" crashed with exit code ${q.exitCode??"unknown"}`;
        case "lsp-request-timeout":
            return `LSP server "${q.serverName}" timed out on ${q.method} after ${q.timeoutMs}ms`;
        case "lsp-request-failed":
            return `LSP server "${q.serverName}" ${q.method} failed: ${q.error}`;
        case "plugin-cache-miss":
            return `Plugin "${q.plugin}" not cached at ${q.installPath}`;
        case "generic-error":
            return q.error
    }
    return GH(q)
}
// @from(Ln 456218, Col 0)
function ux6(q) {
    switch (q.type) {
        case "path-not-found":
            return "Check that the path in your manifest or marketplace config is correct";
        case "path-traversal":
            return 'Paths in plugin.json must not use ".." to reference files outside the plugin directory';
        case "git-auth-failed":
            return q.authType === "ssh" ? "Configure SSH keys or use HTTPS URL instead" : "Configure credentials or use SSH URL instead";
        case "git-timeout":
        case "network-error":
            return "Check your internet connection and try again";
        case "manifest-parse-error":
            return "Check manifest file syntax in the plugin directory";
        case "manifest-validation-error":
            return "Check manifest file follows the required schema";
        case "plugin-not-found":
            return `Plugin may not exist in marketplace "${q.marketplace}"`;
        case "marketplace-not-found":
            return q.availableMarketplaces.length > 0 ? `Available marketplaces: ${q.availableMarketplaces.join(", ")}` : "Add the marketplace first using /plugin marketplace add";
        case "mcp-config-invalid":
            return "Check MCP server configuration in .mcp.json or manifest";
        case "mcp-server-suppressed-duplicate": {
            if (q.duplicateOf.startsWith("plugin:")) return `Disable plugin "${q.duplicateOf.split(":")[1]??"the other plugin"}" if you want this plugin's version instead`;
            return `Remove "${q.duplicateOf}" from your MCP config if you want the plugin's version instead`
        }
        case "hook-load-failed":
            return "Check hooks.json file syntax and structure";
        case "component-load-failed":
            return `Check ${q.component} directory structure and file permissions`;
        case "mcpb-download-failed":
            return "Check your internet connection and URL accessibility";
        case "mcpb-extract-failed":
            return "Verify the MCPB file is valid and not corrupted";
        case "mcpb-invalid-manifest":
            return "Contact the plugin author about the invalid manifest";
        case "marketplace-blocked-by-policy":
            if (q.blockedByBlocklist) return "This marketplace source is explicitly blocked by your administrator";
            return q.allowedSources.length > 0 ? `Allowed sources: ${q.allowedSources.join(", ")}` : "Contact your administrator to configure allowed marketplace sources";
        case "dependency-unsatisfied":
            return q.reason === "not-enabled" ? `Enable "${q.dependency}" or uninstall "${q.plugin}"` : `Install "${q.dependency}" or uninstall "${q.plugin}"`;
        case "dependency-version-unsatisfied":
            return `Update "${q.dependency}" to satisfy ${q.required}, or uninstall "${q.plugin}"`;
        case "lsp-config-invalid":
            return "Check LSP server configuration in the plugin manifest";
        case "lsp-server-start-failed":
        case "lsp-server-crashed":
        case "lsp-request-timeout":
        case "lsp-request-failed":
            return "Check LSP server logs with --debug for details";
        case "plugin-cache-miss":
            return "Run /plugins to refresh the plugin cache";
        case "marketplace-load-failed":
        case "generic-error":
            return null
    }
    let K = q;
    return null
}
// @from(Ln 456276, Col 4)
Jw7 = () => {}
// @from(Ln 456278, Col 0)
function jFK(q) {
    let K = s(143),
        {
            item: _,
            isSelected: z
        } = q,
        [Y] = Zq();
    if (_.type === "plugin") {
        let v, V;
        if (_.pendingToggle) {
            let l;
            if (K[0] !== Y) l = d7("suggestion", Y)(e6.arrowRight), K[0] = Y, K[1] = l;
            else l = K[1];
            v = l, V = _.pendingToggle === "will-enable" ? "will enable" : "will disable"
        } else if (_.errorCount > 0) {
            let l;
            if (K[2] !== Y) l = d7("error", Y)(e6.cross), K[2] = Y, K[3] = l;
            else l = K[3];
            v = l;
            let z6 = _.errorCount,
                A6;
            if (K[4] !== _.errorCount) A6 = O7(_.errorCount, "error"), K[4] = _.errorCount, K[5] = A6;
            else A6 = K[5];
            V = `${z6} ${A6}`
        } else if (!_.isEnabled) {
            let l;
            if (K[6] !== Y) l = d7("inactive", Y)(e6.radioOff), K[6] = Y, K[7] = l;
            else l = K[7];
            v = l, V = "disabled"
        } else {
            let l;
            if (K[8] !== Y) l = d7("success", Y)(e6.tick), K[8] = Y, K[9] = l;
            else l = K[9];
            v = l, V = "enabled"
        }
        let k = z ? "suggestion" : void 0,
            N = z ? `${e6.pointer} ` : "  ",
            R;
        if (K[10] !== k || K[11] !== N) R = O4.createElement(T, {
            color: k
        }, N), K[10] = k, K[11] = N, K[12] = R;
        else R = K[12];
        let h = z ? "suggestion" : void 0,
            C;
        if (K[13] !== _.name || K[14] !== h) C = O4.createElement(T, {
            color: h
        }, _.name), K[13] = _.name, K[14] = h, K[15] = C;
        else C = K[15];
        let x = !z,
            B;
        if (K[16] === Symbol.for("react.memo_cache_sentinel")) B = O4.createElement(T, {
            backgroundColor: "userMessageBackground"
        }, "Plugin"), K[16] = B;
        else B = K[16];
        let m;
        if (K[17] !== x) m = O4.createElement(T, {
            dimColor: x
        }, " ", B), K[17] = x, K[18] = m;
        else m = K[18];
        let S;
        if (K[19] !== _.marketplace) S = O4.createElement(T, {
            dimColor: !0
        }, " · ", _.marketplace), K[19] = _.marketplace, K[20] = S;
        else S = K[20];
        let F = !z,
            U;
        if (K[21] !== v || K[22] !== F) U = O4.createElement(T, {
            dimColor: F
        }, " · ", v, " "), K[21] = v, K[22] = F, K[23] = U;
        else U = K[23];
        let g = !z,
            c;
        if (K[24] !== V || K[25] !== g) c = O4.createElement(T, {
            dimColor: g
        }, V), K[24] = V, K[25] = g, K[26] = c;
        else c = K[26];
        let n;
        if (K[27] !== U || K[28] !== c || K[29] !== R || K[30] !== C || K[31] !== m || K[32] !== S) n = O4.createElement(u, null, R, C, m, S, U, c), K[27] = U, K[28] = c, K[29] = R, K[30] = C, K[31] = m, K[32] = S, K[33] = n;
        else n = K[33];
        return n
    }
    if (_.type === "flagged-plugin") {
        let v;
        if (K[34] !== Y) v = d7("warning", Y)(e6.warning), K[34] = Y, K[35] = v;
        else v = K[35];
        let V = v,
            k = z ? "suggestion" : void 0,
            N = z ? `${e6.pointer} ` : "  ",
            R;
        if (K[36] !== k || K[37] !== N) R = O4.createElement(T, {
            color: k
        }, N), K[36] = k, K[37] = N, K[38] = R;
        else R = K[38];
        let h = z ? "suggestion" : void 0,
            C;
        if (K[39] !== _.name || K[40] !== h) C = O4.createElement(T, {
            color: h
        }, _.name), K[39] = _.name, K[40] = h, K[41] = C;
        else C = K[41];
        let x = !z,
            B;
        if (K[42] === Symbol.for("react.memo_cache_sentinel")) B = O4.createElement(T, {
            backgroundColor: "userMessageBackground"
        }, "Plugin"), K[42] = B;
        else B = K[42];
        let m;
        if (K[43] !== x) m = O4.createElement(T, {
            dimColor: x
        }, " ", B), K[43] = x, K[44] = m;
        else m = K[44];
        let S;
        if (K[45] !== _.marketplace) S = O4.createElement(T, {
            dimColor: !0
        }, " · ", _.marketplace), K[45] = _.marketplace, K[46] = S;
        else S = K[46];
        let F = !z,
            U;
        if (K[47] !== V || K[48] !== F) U = O4.createElement(T, {
            dimColor: F
        }, " · ", V, " "), K[47] = V, K[48] = F, K[49] = U;
        else U = K[49];
        let g = !z,
            c;
        if (K[50] !== g) c = O4.createElement(T, {
            dimColor: g
        }, "removed"), K[50] = g, K[51] = c;
        else c = K[51];
        let n;
        if (K[52] !== S || K[53] !== U || K[54] !== c || K[55] !== R || K[56] !== C || K[57] !== m) n = O4.createElement(u, null, R, C, m, S, U, c), K[52] = S, K[53] = U, K[54] = c, K[55] = R, K[56] = C, K[57] = m, K[58] = n;
        else n = K[58];
        return n
    }
    if (_.type === "failed-plugin") {
        let v;
        if (K[59] !== Y) v = d7("error", Y)(e6.cross), K[59] = Y, K[60] = v;
        else v = K[60];
        let V = v,
            k = _.errorCount,
            N;
        if (K[61] !== _.errorCount) N = O7(_.errorCount, "error"), K[61] = _.errorCount, K[62] = N;
        else N = K[62];
        let R = `failed to load · ${k} ${N}`,
            h = z ? "suggestion" : void 0,
            C = z ? `${e6.pointer} ` : "  ",
            x;
        if (K[63] !== h || K[64] !== C) x = O4.createElement(T, {
            color: h
        }, C), K[63] = h, K[64] = C, K[65] = x;
        else x = K[65];
        let B = z ? "suggestion" : void 0,
            m;
        if (K[66] !== _.name || K[67] !== B) m = O4.createElement(T, {
            color: B
        }, _.name), K[66] = _.name, K[67] = B, K[68] = m;
        else m = K[68];
        let S = !z,
            F;
        if (K[69] === Symbol.for("react.memo_cache_sentinel")) F = O4.createElement(T, {
            backgroundColor: "userMessageBackground"
        }, "Plugin"), K[69] = F;
        else F = K[69];
        let U;
        if (K[70] !== S) U = O4.createElement(T, {
            dimColor: S
        }, " ", F), K[70] = S, K[71] = U;
        else U = K[71];
        let g;
        if (K[72] !== _.marketplace) g = O4.createElement(T, {
            dimColor: !0
        }, " · ", _.marketplace), K[72] = _.marketplace, K[73] = g;
        else g = K[73];
        let c = !z,
            n;
        if (K[74] !== V || K[75] !== c) n = O4.createElement(T, {
            dimColor: c
        }, " · ", V, " "), K[74] = V, K[75] = c, K[76] = n;
        else n = K[76];
        let l = !z,
            z6;
        if (K[77] !== R || K[78] !== l) z6 = O4.createElement(T, {
            dimColor: l
        }, R), K[77] = R, K[78] = l, K[79] = z6;
        else z6 = K[79];
        let A6;
        if (K[80] !== U || K[81] !== g || K[82] !== n || K[83] !== z6 || K[84] !== x || K[85] !== m) A6 = O4.createElement(u, null, x, m, U, g, n, z6), K[80] = U, K[81] = g, K[82] = n, K[83] = z6, K[84] = x, K[85] = m, K[86] = A6;
        else A6 = K[86];
        return A6
    }
    let A, O;
    if (_.status === "connected") {
        let v;
        if (K[87] !== Y) v = d7("success", Y)(e6.tick), K[87] = Y, K[88] = v;
        else v = K[88];
        A = v, O = "connected"
    } else if (_.status === "disabled") {
        let v;
        if (K[89] !== Y) v = d7("inactive", Y)(e6.radioOff), K[89] = Y, K[90] = v;
        else v = K[90];
        A = v, O = "disabled"
    } else if (_.status === "pending") {
        let v;
        if (K[91] !== Y) v = d7("inactive", Y)(e6.radioOff), K[91] = Y, K[92] = v;
        else v = K[92];
        A = v, O = "connecting…"
    } else if (_.status === "needs-auth") {
        let v;
        if (K[93] !== Y) v = d7("warning", Y)(e6.triangleUpOutline), K[93] = Y, K[94] = v;
        else v = K[94];
        A = v;
        let V;
        if (K[95] === Symbol.for("react.memo_cache_sentinel")) V = O4.createElement(v1, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "auth"
        }), K[95] = V;
        else V = K[95];
        O = V
    } else {
        let v;
        if (K[96] !== Y) v = d7("error", Y)(e6.cross), K[96] = Y, K[97] = v;
        else v = K[97];
        A = v, O = "failed"
    }
    if (_.indented) {
        let v = z ? "suggestion" : void 0,
            V = z ? `${e6.pointer} ` : "  ",
            k;
        if (K[98] !== v || K[99] !== V) k = O4.createElement(T, {
            color: v
        }, V), K[98] = v, K[99] = V, K[100] = k;
        else k = K[100];
        let N = !z,
            R;
        if (K[101] !== N) R = O4.createElement(T, {
            dimColor: N
        }, "└ "), K[101] = N, K[102] = R;
        else R = K[102];
        let h = z ? "suggestion" : void 0,
            C;
        if (K[103] !== _.name || K[104] !== h) C = O4.createElement(T, {
            color: h
        }, _.name), K[103] = _.name, K[104] = h, K[105] = C;
        else C = K[105];
        let x = !z,
            B;
        if (K[106] === Symbol.for("react.memo_cache_sentinel")) B = O4.createElement(T, {
            backgroundColor: "userMessageBackground"
        }, "MCP"), K[106] = B;
        else B = K[106];
        let m;
        if (K[107] !== x) m = O4.createElement(T, {
            dimColor: x
        }, " ", B), K[107] = x, K[108] = m;
        else m = K[108];
        let S = !z,
            F;
        if (K[109] !== A || K[110] !== S) F = O4.createElement(T, {
            dimColor: S
        }, " · ", A, " "), K[109] = A, K[110] = S, K[111] = F;
        else F = K[111];
        let U = !z,
            g;
        if (K[112] !== O || K[113] !== U) g = O4.createElement(T, {
            dimColor: U
        }, O), K[112] = O, K[113] = U, K[114] = g;
        else g = K[114];
        let c;
        if (K[115] !== m || K[116] !== F || K[117] !== g || K[118] !== k || K[119] !== R || K[120] !== C) c = O4.createElement(u, null, k, R, C, m, F, g), K[115] = m, K[116] = F, K[117] = g, K[118] = k, K[119] = R, K[120] = C, K[121] = c;
        else c = K[121];
        return c
    }
    let w = z ? "suggestion" : void 0,
        $ = z ? `${e6.pointer} ` : "  ",
        j;
    if (K[122] !== w || K[123] !== $) j = O4.createElement(T, {
        color: w
    }, $), K[122] = w, K[123] = $, K[124] = j;
    else j = K[124];
    let H = z ? "suggestion" : void 0,
        J;
    if (K[125] !== _.name || K[126] !== H) J = O4.createElement(T, {
        color: H
    }, _.name), K[125] = _.name, K[126] = H, K[127] = J;
    else J = K[127];
    let X = !z,
        M;
    if (K[128] === Symbol.for("react.memo_cache_sentinel")) M = O4.createElement(T, {
        backgroundColor: "userMessageBackground"
    }, "MCP"), K[128] = M;
    else M = K[128];
    let P;
    if (K[129] !== X) P = O4.createElement(T, {
        dimColor: X
    }, " ", M), K[129] = X, K[130] = P;
    else P = K[130];
    let W = !z,
        D;
    if (K[131] !== A || K[132] !== W) D = O4.createElement(T, {
        dimColor: W
    }, " · ", A, " "), K[131] = A, K[132] = W, K[133] = D;
    else D = K[133];
    let Z = !z,
        G;
    if (K[134] !== O || K[135] !== Z) G = O4.createElement(T, {
        dimColor: Z
    }, O), K[134] = O, K[135] = Z, K[136] = G;
    else G = K[136];
    let f;
    if (K[137] !== D || K[138] !== G || K[139] !== j || K[140] !== J || K[141] !== P) f = O4.createElement(u, null, j, J, P, D, G), K[137] = D, K[138] = G, K[139] = j, K[140] = J, K[141] = P, K[142] = f;
    else f = K[142];
    return f
}
// @from(Ln 456591, Col 4)
O4
// @from(Ln 456592, Col 4)
HFK = L(() => {
    o6();
    Qq();
    bK();
    g6();
    O4 = K6(P6(), 1)
})
// @from(Ln 456600, Col 0)
function Z_8(q) {
    return q?.kind === "item" || q?.kind === "disabled-header"
}
// @from(Ln 456604, Col 0)
function JFK(q) {
    switch (q.type) {
        case "plugin":
            return q.isEnabled && q.errorCount > 0;
        case "failed-plugin":
        case "flagged-plugin":
            return !0;
        case "mcp":
            return q.status === "needs-auth" || q.status === "failed"
    }
}
// @from(Ln 456616, Col 0)
function Xw7(q) {
    return q.type === "plugin" && !q.isEnabled || q.type === "mcp" && q.status === "disabled"
}
// @from(Ln 456622, Col 0)
function NxY(q) {
    switch (q) {
        case "flagged":
            return "Flagged";
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
        case "builtin":
        case "dynamic":
            return "Built-in";
        default:
            return q
    }
}
// @from(Ln 456643, Col 0)
async function XFK(q) {
    try {
        return (await cP6.readdir(q, {
            withFileTypes: !0
        })).filter((_) => _.isFile() && _.name.endsWith(".md")).map((_) => {
            return mx6.basename(_.name, ".md")
        })
    } catch (K) {
        let _ = b6(K);
        return E(`Failed to read plugin components from ${q}: ${_}`, {
            level: "error"
        }), j6(r1(K)), []
    }
}
// @from(Ln 456657, Col 0)
async function ExY(q) {
    try {
        let K = await cP6.readdir(q, {
                withFileTypes: !0
            }),
            _ = [];
        for (let z of K)
            if (z.isDirectory() || z.isSymbolicLink()) {
                let Y = mx6.join(q, z.name, "SKILL.md");
                try {
                    if ((await cP6.stat(Y)).isFile()) _.push(z.name)
                } catch {}
            } return _
    } catch (K) {
        let _ = b6(K);
        return E(`Failed to read skill directories from ${q}: ${_}`, {
            level: "error"
        }), j6(r1(K)), []
    }
}
// @from(Ln 456678, Col 0)
function yxY({
    plugin: q,
    marketplace: K
}) {
    let [_, z] = C_.useState(null), [Y, A] = C_.useState(!0), [O, w] = C_.useState(null);
    if (C_.useEffect(() => {
            async function j() {
                try {
                    if (K === "builtin") {
                        let X = Kf4(q.name);
                        if (X) {
                            let M = X.skills?.map((D) => D.name) ?? [],
                                P = X.hooks ? Object.keys(X.hooks) : [],
                                W = X.mcpServers ? Object.keys(X.mcpServers) : [];
                            z({
                                commands: null,
                                agents: null,
                                skills: M.length > 0 ? M : null,
                                hooks: P.length > 0 ? P : null,
                                mcpServers: W.length > 0 ? W : null
                            })
                        } else w(`Built-in plugin ${q.name} not found`);
                        A(!1);
                        return
                    }
                    let J = (await xf(K)).plugins.find((X) => X.name === q.name);
                    if (J) {
                        let X = [];
                        if (q.commandsPath) X.push(q.commandsPath);
                        if (q.commandsPaths) X.push(...q.commandsPaths);
                        let M = [];
                        for (let v of X)
                            if (typeof v === "string") {
                                let V = await XFK(v);
                                M.push(...V)
                            } let P = [];
                        if (q.agentsPath) P.push(q.agentsPath);
                        if (q.agentsPaths) P.push(...q.agentsPaths);
                        let W = [];
                        for (let v of P)
                            if (typeof v === "string") {
                                let V = await XFK(v);
                                W.push(...V)
                            } let D = [];
                        if (q.skillsPath) D.push(q.skillsPath);
                        if (q.skillsPaths) D.push(...q.skillsPaths);
                        let Z = [];
                        for (let v of D)
                            if (typeof v === "string") {
                                let V = await ExY(v);
                                Z.push(...V)
                            } let G = [];
                        if (q.hooksConfig) G.push(Object.keys(q.hooksConfig));
                        if (J.hooks) G.push(J.hooks);
                        let f = [];
                        if (q.mcpServers) f.push(Object.keys(q.mcpServers));
                        if (J.mcpServers) f.push(J.mcpServers);
                        z({
                            commands: M.length > 0 ? M : null,
                            agents: W.length > 0 ? W : null,
                            skills: Z.length > 0 ? Z : null,
                            hooks: G.length > 0 ? G : null,
                            mcpServers: f.length > 0 ? f : null
                        })
                    } else w(`Plugin ${q.name} not found in marketplace`)
                } catch (H) {
                    w(H instanceof Error ? H.message : "Failed to load components")
                } finally {
                    A(!1)
                }
            }
            j()
        }, [q.name, q.commandsPath, q.commandsPaths, q.agentsPath, q.agentsPaths, q.skillsPath, q.skillsPaths, q.hooksConfig, q.mcpServers, K]), Y) return null;
    if (O) return E8.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, E8.createElement(T, {
        bold: !0
    }, "Components:"), E8.createElement(T, {
        dimColor: !0
    }, "Error: ", O));
    if (!_) return null;
    if (!(_.commands || _.agents || _.skills || _.hooks || _.mcpServers)) return null;
    return E8.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, E8.createElement(T, {
        bold: !0
    }, "Installed components:"), _.commands ? E8.createElement(T, {
        dimColor: !0
    }, "• Commands:", " ", typeof _.commands === "string" ? _.commands : Array.isArray(_.commands) ? _.commands.join(", ") : Object.keys(_.commands).join(", ")) : null, _.agents ? E8.createElement(T, {
        dimColor: !0
    }, "• Agents:", " ", typeof _.agents === "string" ? _.agents : Array.isArray(_.agents) ? _.agents.join(", ") : Object.keys(_.agents).join(", ")) : null, _.skills ? E8.createElement(T, {
        dimColor: !0
    }, "• Skills:", " ", typeof _.skills === "string" ? _.skills : Array.isArray(_.skills) ? _.skills.join(", ") : Object.keys(_.skills).join(", ")) : null, _.hooks ? E8.createElement(T, {
        dimColor: !0
    }, "• Hooks:", " ", typeof _.hooks === "string" ? _.hooks : Array.isArray(_.hooks) ? _.hooks.map(String).join(", ") : typeof _.hooks === "object" && _.hooks !== null ? Object.keys(_.hooks).join(", ") : String(_.hooks)) : null, _.mcpServers ? E8.createElement(T, {
        dimColor: !0
    }, "• MCP Servers:", " ", typeof _.mcpServers === "string" ? _.mcpServers : Array.isArray(_.mcpServers) ? _.mcpServers.map(String).join(", ") : typeof _.mcpServers === "object" && _.mcpServers !== null ? Object.keys(_.mcpServers).join(", ") : String(_.mcpServers)) : null)
}
// @from(Ln 456778, Col 0)
async function LxY(q, K) {
    let z = (await xf(K))?.plugins.find((Y) => Y.name === q);
    if (z && typeof z.source === "string") return `Local plugins cannot be updated remotely. To update, modify the source at: ${z.source}`;
    return null
}
// @from(Ln 456784, Col 0)
function hxY(q) {
    return q.filter((K) => {
        let _ = K.source.split("@")[1] || "local";
        return !Rk(`${K.name}@${_}`)
    })
}