
// @from(Ln 403319, Col 0)
function lwq({
    setViewState: A,
    setResult: q,
    onManageComplete: K,
    onSearchModeChange: Y,
    targetPlugin: z,
    targetMarketplace: _,
    action: w
}) {
    let O = M1((Z6) => Z6.mcp.clients),
        $ = M1((Z6) => Z6.mcp.tools),
        H = M1((Z6) => Z6.plugins.errors),
        j = nv6(),
        [J, M] = DY.useState(!1),
        D = DY.useCallback((Z6) => {
            M(Z6), Y?.(Z6)
        }, [Y]),
        X = p_(),
        {
            columns: P
        } = KA(),
        [W, Z] = DY.useState("plugin-list"),
        {
            query: G,
            setQuery: f,
            cursorOffset: v
        } = Th({
            isActive: W === "plugin-list" && J,
            onExit: () => {
                D(!1)
            }
        }),
        [N, V] = DY.useState(null),
        [L, h] = DY.useState([]),
        [R, u] = DY.useState([]),
        [I, g] = DY.useState(!0),
        [B, b] = DY.useState(new Map),
        p = DY.useRef(!1),
        Q = DY.useRef(void 0),
        U = G16(),
        r = W1.useCallback(() => {
            if (W === "plugin-details") Z("plugin-list"), V(null), a(null);
            else if (typeof W === "object" && W.type === "failed-plugin-details") Z("plugin-list"), a(null);
            else if (W === "configuring") Z("plugin-details"), l(null);
            else if (typeof W === "object" && (W.type === "plugin-options" || W.type === "configuring-options")) {
                if (Z("plugin-list"), V(null), q("Plugin enabled. Configuration skipped — run /reload-plugins to apply."), K) K()
            } else if (W === "confirm-project-uninstall") Z("plugin-details"), a(null);
            else if (typeof W === "object" && W.type === "flagged-detail") Z("plugin-list"), a(null);
            else if (typeof W === "object" && W.type === "mcp-detail") Z("plugin-list"), a(null);
            else if (typeof W === "object" && W.type === "mcp-tools") Z({
                type: "mcp-detail",
                client: W.client
            });
            else if (typeof W === "object" && W.type === "mcp-tool-detail") Z({
                type: "mcp-tools",
                client: W.client
            });
            else {
                if (B.size > 0) {
                    q("Run /reload-plugins to apply plugin changes.");
                    return
                }
                A({
                    type: "menu"
                })
            }
        }, [W, A, B, q]);
    D8("confirm:no", r, {
        context: "Confirmation",
        isActive: W !== "plugin-list" || !J
    });
    let e = (Z6) => {
            if (Z6.type === "connected") return "connected";
            if (Z6.type === "disabled") return "disabled";
            if (Z6.type === "pending") return "pending";
            if (Z6.type === "needs-auth") return "needs-auth";
            return "failed"
        },
        Y6 = DY.useMemo(() => {
            let Z6 = PA(),
                u6 = new Map;
            for (let d6 of O)
                if (d6.name.startsWith("plugin:")) {
                    let S6 = d6.name.split(":");
                    if (S6.length >= 3) {
                        let g6 = S6[1],
                            D1 = S6.slice(2).join(":"),
                            J1 = u6.get(g6) || [];
                        J1.push({
                            displayName: D1,
                            client: d6
                        }), u6.set(g6, J1)
                    }
                } let C6 = [];
            for (let d6 of R) {
                let S6 = `${d6.plugin.name}@${d6.marketplace}`,
                    g6 = Z6?.enabledPlugins?.[S6] !== !1,
                    D1 = H.filter((E1) => ("plugin" in E1) && E1.plugin === d6.plugin.name || E1.source === S6 || E1.source.startsWith(`${d6.plugin.name}@`)),
                    J1 = d6.plugin.isBuiltin ? "builtin" : d6.scope || "user";
                C6.push({
                    item: {
                        type: "plugin",
                        id: S6,
                        name: d6.plugin.name,
                        description: d6.plugin.manifest.description,
                        marketplace: d6.marketplace,
                        scope: J1,
                        isEnabled: g6,
                        errorCount: D1.length,
                        errors: D1,
                        plugin: d6.plugin,
                        pendingEnable: d6.pendingEnable,
                        pendingUpdate: d6.pendingUpdate,
                        pendingToggle: B.get(S6)
                    },
                    originalScope: J1,
                    childMcps: u6.get(d6.plugin.name) || []
                })
            }
            let o6 = new Set(C6.map(({
                    item: d6
                }) => d6.id)),
                V6 = new Set(C6.map(({
                    item: d6
                }) => d6.name)),
                b6 = new Map;
            for (let d6 of H) {
                if (o6.has(d6.source) || "plugin" in d6 && typeof d6.plugin === "string" && V6.has(d6.plugin)) continue;
                let S6 = b6.get(d6.source) || [];
                S6.push(d6), b6.set(d6.source, S6)
            }
            let E6 = T16(),
                U6 = [];
            for (let [d6, S6] of b6) {
                if (d6 in j) continue;
                let g6 = n3(d6),
                    D1 = g6.name || d6,
                    J1 = g6.marketplace || "unknown",
                    E1 = E6.get(d6),
                    K8 = E1 === "flag" || E1 === void 0 ? "user" : E1;
                U6.push({
                    type: "failed-plugin",
                    id: d6,
                    name: D1,
                    marketplace: J1,
                    scope: K8,
                    errorCount: S6.length,
                    errors: S6
                })
            }
            let c6 = [];
            for (let d6 of O) {
                if (d6.name === "ide") continue;
                if (d6.name.startsWith("plugin:")) continue;
                c6.push({
                    type: "mcp",
                    id: `mcp:${d6.name}`,
                    name: d6.name,
                    description: void 0,
                    scope: d6.config.scope,
                    status: e(d6),
                    client: d6
                })
            }
            let K1 = {
                    flagged: -1,
                    project: 0,
                    local: 1,
                    user: 2,
                    enterprise: 3,
                    managed: 4,
                    dynamic: 5,
                    builtin: 6
                },
                j6 = [],
                W6 = new Map;
            for (let {
                    item: d6,
                    originalScope: S6,
                    childMcps: g6
                }
                of C6) {
                let D1 = d6.scope;
                if (!W6.has(D1)) W6.set(D1, []);
                W6.get(D1).push(d6);
                for (let {
                        displayName: J1,
                        client: E1
                    }
                    of g6) {
                    let K8 = S6 === "builtin" ? "user" : S6;
                    if (!W6.has(K8)) W6.set(K8, []);
                    W6.get(K8).push({
                        type: "mcp",
                        id: `mcp:${E1.name}`,
                        name: J1,
                        description: void 0,
                        scope: K8,
                        status: e(E1),
                        client: E1,
                        indented: !0
                    })
                }
            }
            for (let d6 of c6) {
                let S6 = d6.scope;
                if (!W6.has(S6)) W6.set(S6, []);
                W6.get(S6).push(d6)
            }
            for (let d6 of U6) {
                let S6 = d6.scope;
                if (!W6.has(S6)) W6.set(S6, []);
                W6.get(S6).push(d6)
            }
            for (let [d6, S6] of Object.entries(j)) {
                let g6 = n3(d6),
                    D1 = g6.name || d6,
                    J1 = g6.marketplace || "unknown",
                    E1 = dwq(d6);
                if (!W6.has("flagged")) W6.set("flagged", []);
                W6.get("flagged").push({
                    type: "flagged-plugin",
                    id: d6,
                    name: D1,
                    marketplace: J1,
                    scope: "flagged",
                    reason: E1?.reason ?? "delisted",
                    text: E1?.text ?? "Removed from marketplace",
                    flaggedAt: S6.flaggedAt
                })
            }
            let n6 = [...W6.keys()].sort((d6, S6) => (K1[d6] ?? 99) - (K1[S6] ?? 99));
            for (let d6 of n6) {
                let S6 = W6.get(d6),
                    g6 = [],
                    D1 = [],
                    J1 = 0;
                while (J1 < S6.length) {
                    let E1 = S6[J1];
                    if (E1.type === "plugin" || E1.type === "failed-plugin" || E1.type === "flagged-plugin") {
                        let K8 = [E1];
                        J1++;
                        let e8 = S6[J1];
                        while (e8?.type === "mcp" && e8.indented) K8.push(e8), J1++, e8 = S6[J1];
                        g6.push(K8)
                    } else if (E1.type === "mcp" && !E1.indented) D1.push(E1), J1++;
                    else J1++
                }
                g6.sort((E1, K8) => E1[0].name.localeCompare(K8[0].name)), D1.sort((E1, K8) => E1.name.localeCompare(K8.name));
                for (let E1 of g6) j6.push(...E1);
                j6.push(...D1)
            }
            return j6
        }, [R, O, H, B, j]),
        H6 = DY.useMemo(() => Y6.filter((Z6) => Z6.type === "flagged-plugin").map((Z6) => Z6.id), [Y6]);
    DY.useEffect(() => {
        if (H6.length > 0) Bwq(H6)
    }, [H6]);
    let J6 = DY.useMemo(() => {
            if (!G) return Y6;
            let Z6 = G.toLowerCase();
            return Y6.filter((u6) => u6.name.toLowerCase().includes(Z6) || ("description" in u6) && u6.description?.toLowerCase().includes(Z6))
        }, [Y6, G]),
        [K6, s] = DY.useState(0),
        X6 = Uv6({
            totalItems: J6.length,
            selectedIndex: K6,
            maxVisible: 8
        }),
        [z6, N6] = DY.useState(0),
        [$6, n] = DY.useState(!1),
        [o, a] = DY.useState(null),
        [i, l] = DY.useState(null),
        [q6, w6] = DY.useState(!1),
        [O6, L6] = DY.useState(!1);
    DY.useEffect(() => {
        if (!N) {
            L6(!1);
            return
        }
        async function Z6() {
            let u6 = N.plugin.manifest.mcpServers,
                C6 = !1;
            if (u6) C6 = typeof u6 === "string" && WL(u6) || Array.isArray(u6) && u6.some((o6) => typeof o6 === "string" && WL(o6));
            if (!C6) try {
                let o6 = rv6.join(N.plugin.path, ".."),
                    V6 = rv6.join(o6, ".claude-plugin", "marketplace.json"),
                    b6 = await J_6.readFile(V6, "utf-8"),
                    U6 = i1(b6).plugins?.find((c6) => c6.name === N.plugin.name);
                if (U6?.mcpServers) {
                    let c6 = U6.mcpServers;
                    C6 = typeof c6 === "string" && WL(c6) || Array.isArray(c6) && c6.some((K1) => typeof K1 === "string" && WL(K1))
                }
            } catch (o6) {
                k(`Failed to read raw marketplace.json: ${o6}`)
            }
            L6(C6)
        }
        Z6()
    }, [N]), DY.useEffect(() => {
        async function Z6() {
            g(!0);
            try {
                let {
                    enabled: u6,
                    disabled: C6
                } = await _z(), o6 = PA(), V6 = EnY([...u6, ...C6]), b6 = {};
                for (let c6 of V6) {
                    let K1 = c6.source.split("@")[1] || "local";
                    if (!b6[K1]) b6[K1] = [];
                    b6[K1].push(c6)
                }
                let E6 = [];
                for (let [c6, K1] of Object.entries(b6)) {
                    let j6 = K1.filter((n6) => {
                            let d6 = `${n6.name}@${c6}`;
                            return o6?.enabledPlugins?.[d6] !== !1
                        }).length,
                        W6 = K1.length - j6;
                    E6.push({
                        name: c6,
                        installedPlugins: K1,
                        enabledCount: j6,
                        disabledCount: W6
                    })
                }
                E6.sort((c6, K1) => {
                    if (c6.name === "claude-plugin-directory") return -1;
                    if (K1.name === "claude-plugin-directory") return 1;
                    return c6.name.localeCompare(K1.name)
                }), h(E6);
                let U6 = [];
                for (let c6 of E6)
                    for (let K1 of c6.installedPlugins) {
                        let j6 = `${K1.name}@${c6.name}`,
                            W6 = K1.isBuiltin ? "builtin" : LL1(j6).scope;
                        U6.push({
                            plugin: K1,
                            marketplace: c6.name,
                            scope: W6,
                            pendingEnable: void 0,
                            pendingUpdate: !1
                        })
                    }
                u(U6), s(0)
            } finally {
                g(!1)
            }
        }
        Z6()
    }, []), DY.useEffect(() => {
        if (p.current) return;
        if (z && L.length > 0 && !I) {
            let {
                name: Z6,
                marketplace: u6
            } = n3(z), C6 = _ ?? u6, o6 = C6 ? L.filter((b6) => b6.name === C6) : L;
            for (let b6 of o6) {
                let E6 = b6.installedPlugins.find((U6) => U6.name === Z6);
                if (E6) {
                    let U6 = `${E6.name}@${b6.name}`,
                        {
                            scope: c6
                        } = LL1(U6),
                        K1 = {
                            plugin: E6,
                            marketplace: b6.name,
                            scope: c6,
                            pendingEnable: void 0,
                            pendingUpdate: !1
                        };
                    V(K1), Z("plugin-details"), Q.current = w, p.current = !0;
                    return
                }
            }
            let V6 = Y6.find((b6) => b6.type === "failed-plugin" && b6.name === Z6);
            if (V6 && V6.type === "failed-plugin") Z({
                type: "failed-plugin-details",
                plugin: {
                    id: V6.id,
                    name: V6.name,
                    marketplace: V6.marketplace,
                    errors: V6.errors,
                    scope: V6.scope
                }
            }), p.current = !0;
            if (!p.current && w) p.current = !0, q(`Plugin "${z}" is not installed in this project`)
        }
    }, [z, _, L, I, Y6, w, q]);
    let y6 = async (Z6) => {
        if (!N) return;
        let u6 = N.scope || "user",
            C6 = u6 === "builtin";
        if (C6 && (Z6 === "update" || Z6 === "uninstall")) {
            a("Built-in plugins cannot be updated or uninstalled.");
            return
        }
        if (!C6 && !$_6(u6) && Z6 !== "update") {
            a("This plugin is managed by your organization. Contact your admin to disable it.");
            return
        }
        n(!0), a(null);
        try {
            let o6 = `${N.plugin.name}@${N.marketplace}`,
                V6;
            switch (Z6) {
                case "enable": {
                    if (C6) {
                        let K1 = await ol(o6);
                        if (!K1.success) throw Error(K1.message);
                        break
                    }
                    if (!$_6(u6)) break;
                    let c6 = await ol(o6, u6);
                    if (!c6.success) throw Error(c6.message);
                    break
                }
                case "disable": {
                    if (C6) {
                        let K1 = await H_6(o6);
                        if (!K1.success) throw Error(K1.message);
                        V6 = K1.reverseDependents;
                        break
                    }
                    if (!$_6(u6)) break;
                    let c6 = await H_6(o6, u6);
                    if (!c6.success) throw Error(c6.message);
                    V6 = c6.reverseDependents;
                    break
                }
                case "uninstall": {
                    if (C6) break;
                    if (!$_6(u6)) break;
                    if (Wwq(o6)) {
                        n(!1), Z("confirm-project-uninstall");
                        return
                    }
                    let c6 = await v16(o6, u6);
                    if (!c6.success) throw Error(c6.message);
                    V6 = c6.reverseDependents;
                    break
                }
                case "update": {
                    if (C6) break;
                    let c6 = await Fv6(o6, u6);
                    if (!c6.success) throw Error(c6.message);
                    if (c6.alreadyUpToDate) {
                        if (q(`${N.plugin.name} is already at the latest version (${c6.newVersion}).`), K) await K();
                        A({
                            type: "menu"
                        });
                        return
                    }
                    break
                }
            }
            HY();
            let b6 = Z6 === "enable" ? "Enabled" : Z6 === "disable" ? "Disabled" : Z6 === "update" ? "Updated" : "Uninstalled",
                E6 = V6 && V6.length > 0 ? ` · required by ${V6.join(", ")}` : "",
                U6 = `✓ ${b6} ${N.plugin.name}${E6}. Run /reload-plugins to apply.`;
            if (q(U6), K) await K();
            A({
                type: "menu"
            })
        } catch (o6) {
            n(!1);
            let V6 = o6 instanceof Error ? o6.message : String(o6);
            a(`Failed to ${Z6}: ${V6}`), _6(o6 instanceof Error ? o6 : Error(`Failed to ${Z6} plugin: ${String(o6)}`))
        }
    }, G6 = DY.useRef(y6);
    G6.current = y6, DY.useEffect(() => {
        if (W === "plugin-details" && N && Q.current) {
            let Z6 = Q.current;
            Q.current = void 0, G6.current(Z6)
        }
    }, [W, N]);
    let R6 = W1.useCallback(() => {
            if (K6 >= J6.length) return;
            let Z6 = J6[K6];
            if (Z6?.type === "flagged-plugin") return;
            if (Z6?.type === "plugin") {
                let u6 = `${Z6.plugin.name}@${Z6.marketplace}`,
                    C6 = PA(),
                    o6 = B.get(u6),
                    V6 = C6?.enabledPlugins?.[u6] !== !1,
                    b6 = Z6.scope,
                    E6 = b6 === "builtin";
                if (E6 || $_6(b6)) {
                    let U6 = new Map(B);
                    if (o6) U6.delete(u6), (async () => {
                        try {
                            if (o6 === "will-disable") await ol(u6, E6 ? void 0 : b6);
                            else await H_6(u6, E6 ? void 0 : b6);
                            HY()
                        } catch (c6) {
                            _6(c6)
                        }
                    })();
                    else U6.set(u6, V6 ? "will-disable" : "will-enable"), (async () => {
                        try {
                            if (V6) await H_6(u6, E6 ? void 0 : b6);
                            else await ol(u6, E6 ? void 0 : b6);
                            HY()
                        } catch (c6) {
                            _6(c6)
                        }
                    })();
                    b(U6)
                }
            } else if (Z6?.type === "mcp") U(Z6.client.name)
        }, [K6, J6, B, R, U]),
        T6 = W1.useCallback(() => {
            if (K6 >= J6.length) return;
            let Z6 = J6[K6];
            if (Z6?.type === "plugin") {
                let u6 = R.find((C6) => C6.plugin.name === Z6.plugin.name && C6.marketplace === Z6.marketplace);
                if (u6) V(u6), Z("plugin-details"), N6(0), a(null)
            } else if (Z6?.type === "flagged-plugin") Z({
                type: "flagged-detail",
                plugin: {
                    id: Z6.id,
                    name: Z6.name,
                    marketplace: Z6.marketplace,
                    reason: Z6.reason,
                    text: Z6.text,
                    flaggedAt: Z6.flaggedAt
                }
            }), a(null);
            else if (Z6?.type === "failed-plugin") Z({
                type: "failed-plugin-details",
                plugin: {
                    id: Z6.id,
                    name: Z6.name,
                    marketplace: Z6.marketplace,
                    errors: Z6.errors,
                    scope: Z6.scope
                }
            }), N6(0), a(null);
            else if (Z6?.type === "mcp") Z({
                type: "mcp-detail",
                client: Z6.client
            }), a(null)
        }, [K6, J6, R]);
    tA({
        "select:previous": () => {
            if (K6 === 0) D(!0);
            else X6.handleSelectionChange(K6 - 1, s)
        },
        "select:next": () => {
            if (K6 < J6.length - 1) X6.handleSelectionChange(K6 + 1, s)
        },
        "select:accept": T6
    }, {
        context: "Select",
        isActive: W === "plugin-list" && !J
    }), tA({
        "plugin:toggle": R6
    }, {
        context: "Plugin",
        isActive: W === "plugin-list" && !J
    });
    let D6 = W1.useCallback(() => {
        if (typeof W !== "object" || W.type !== "flagged-detail") return;
        gwq(W.plugin.id), Z("plugin-list")
    }, [W]);
    tA({
        "select:accept": D6
    }, {
        context: "Select",
        isActive: typeof W === "object" && W.type === "flagged-detail"
    });
    let Q6 = W1.useMemo(() => {
        if (W !== "plugin-details" || !N) return [];
        let Z6 = PA(),
            u6 = `${N.plugin.name}@${N.marketplace}`,
            C6 = Z6?.enabledPlugins?.[u6] !== !1,
            o6 = N.marketplace === "builtin",
            V6 = [];
        if (V6.push({
                label: C6 ? "Disable plugin" : "Enable plugin",
                action: () => void y6(C6 ? "disable" : "enable")
            }), !o6) {
            if (V6.push({
                    label: N.pendingUpdate ? "Unmark for update" : "Mark for update",
                    action: async () => {
                        try {
                            let b6 = await knY(N.plugin.name, N.marketplace);
                            if (b6) {
                                a(b6);
                                return
                            }
                            let E6 = [...R],
                                U6 = E6.findIndex((c6) => c6.plugin.name === N.plugin.name && c6.marketplace === N.marketplace);
                            if (U6 !== -1) E6[U6].pendingUpdate = !N.pendingUpdate, u(E6), V({
                                ...N,
                                pendingUpdate: !N.pendingUpdate
                            })
                        } catch (b6) {
                            a(b6 instanceof Error ? b6.message : "Failed to check plugin update availability")
                        }
                    }
                }), O6) V6.push({
                label: "Configure",
                action: async () => {
                    w6(!0);
                    try {
                        let b6 = N.plugin.manifest.mcpServers,
                            E6 = null;
                        if (typeof b6 === "string" && WL(b6)) E6 = b6;
                        else if (Array.isArray(b6)) {
                            for (let K1 of b6)
                                if (typeof K1 === "string" && WL(K1)) {
                                    E6 = K1;
                                    break
                                }
                        }
                        if (!E6) {
                            a("No MCPB file found in plugin"), w6(!1);
                            return
                        }
                        let U6 = `${N.plugin.name}@${N.marketplace}`,
                            c6 = await rI6(E6, N.plugin.path, U6, void 0, void 0, !0);
                        if ("status" in c6 && c6.status === "needs-config") l(c6), Z("configuring");
                        else a("Failed to load MCPB for configuration")
                    } catch (b6) {
                        let E6 = _1(b6);
                        a(`Failed to load configuration: ${E6}`)
                    } finally {
                        w6(!1)
                    }
                }
            });
            V6.push({
                label: "Update now",
                action: () => void y6("update")
            }), V6.push({
                label: "Uninstall",
                action: () => void y6("uninstall")
            })
        }
        if (N.plugin.manifest.homepage) V6.push({
            label: "Open homepage",
            action: () => void R9(N.plugin.manifest.homepage)
        });
        if (N.plugin.manifest.repository) V6.push({
            label: "View repository",
            action: () => void R9(N.plugin.manifest.repository)
        });
        return V6.push({
            label: "Back to plugin list",
            action: () => {
                Z("plugin-list"), V(null), a(null)
            }
        }), V6
    }, [W, N, O6, R]);
    if (tA({
            "select:previous": () => {
                if (z6 > 0) N6(z6 - 1)
            },
            "select:next": () => {
                if (z6 < Q6.length - 1) N6(z6 + 1)
            },
            "select:accept": () => {
                if (Q6[z6]) Q6[z6].action()
            }
        }, {
            context: "Select",
            isActive: W === "plugin-details" && !!N
        }), tA({
            "select:accept": () => {
                if (typeof W === "object" && W.type === "failed-plugin-details")(async () => {
                    n(!0), a(null);
                    let Z6 = W.plugin.id,
                        u6 = W.plugin.scope,
                        C6 = $_6(u6) ? await v16(Z6, u6) : await v16(Z6),
                        o6 = C6.success;
                    if (!o6) {
                        let V6 = ["userSettings", "projectSettings", "localSettings"];
                        for (let b6 of V6) {
                            let E6 = L8(b6);
                            if (E6?.enabledPlugins?.[Z6] !== void 0) TA(b6, {
                                enabledPlugins: {
                                    ...E6.enabledPlugins,
                                    [Z6]: void 0
                                }
                            }), o6 = !0
                        }
                        HY()
                    }
                    if (o6) {
                        if (K) await K();
                        n(!1), Z("plugin-list")
                    } else n(!1), a(C6.message)
                })()
            }
        }, {
            context: "Select",
            isActive: typeof W === "object" && W.type === "failed-plugin-details" && W.plugin.scope !== "managed"
        }), jA((Z6) => {
            if (!N) return;
            if (Z6 === "y" || Z6 === "Y") {
                n(!0), a(null);
                let u6 = `${N.plugin.name}@${N.marketplace}`,
                    {
                        error: C6
                    } = TA("localSettings", {
                        enabledPlugins: {
                            ...L8("localSettings")?.enabledPlugins,
                            [u6]: !1
                        }
                    });
                if (C6) {
                    n(!1), a(`Failed to write settings: ${C6.message}`);
                    return
                }
                if (HY(), q(`✓ Disabled ${N.plugin.name} in .claude/settings.local.json. Run /reload-plugins to apply.`), K) K();
                A({
                    type: "menu"
                })
            } else if (Z6 === "n" || Z6 === "N") Z("plugin-details")
        }, {
            isActive: W === "confirm-project-uninstall" && !!N && !$6
        }), W1.useEffect(() => {
            s(0)
        }, [G]), jA((Z6, u6) => {
            let C6 = !u6.ctrl && !u6.meta;
            if (J) return;
            if (Z6 === "/" && C6) D(!0), f(""), s(0);
            else if (C6 && Z6.length > 0 && !/^\s+$/.test(Z6) && Z6 !== "j" && Z6 !== "k" && Z6 !== " ") D(!0), f(Z6), s(0)
        }, {
            isActive: W === "plugin-list"
        }), I) return W1.createElement(T, null, "Loading installed plugins…");
    if (Y6.length === 0) return W1.createElement(m, {
        flexDirection: "column"
    }, W1.createElement(m, {
        marginBottom: 1
    }, W1.createElement(T, {
        bold: !0
    }, "Manage plugins")), W1.createElement(T, null, "No plugins or MCP servers installed."), W1.createElement(m, {
        marginTop: 1
    }, W1.createElement(T, {
        dimColor: !0
    }, "Esc to go back")));
    if (W === "configuring" && i && N) {
        let C6 = function() {
                l(null), Z("plugin-details")
            },
            Z6 = `${N.plugin.name}@${N.marketplace}`;
        async function u6(o6) {
            if (!i || !N) return;
            try {
                let V6 = N.plugin.manifest.mcpServers,
                    b6 = null;
                if (typeof V6 === "string" && WL(V6)) b6 = V6;
                else if (Array.isArray(V6)) {
                    for (let E6 of V6)
                        if (typeof E6 === "string" && WL(E6)) {
                            b6 = E6;
                            break
                        }
                }
                if (!b6) {
                    a("No MCPB file found"), Z("plugin-details");
                    return
                }
                await rI6(b6, N.plugin.path, Z6, void 0, o6), a(null), l(null), Z("plugin-details"), q("Configuration saved. Run /reload-plugins for changes to take effect.")
            } catch (V6) {
                let b6 = _1(V6);
                a(`Failed to save configuration: ${b6}`), Z("plugin-details")
            }
        }
        return W1.createElement(Swq, {
            title: `Configure ${i.manifest.name}`,
            subtitle: `Plugin: ${N.plugin.name}`,
            configSchema: i.configSchema,
            initialValues: i.existingConfig,
            onSave: u6,
            onCancel: C6
        })
    }
    if (typeof W === "object" && W.type === "flagged-detail") {
        let Z6 = W.plugin;
        return W1.createElement(m, {
            flexDirection: "column"
        }, W1.createElement(m, null, W1.createElement(T, {
            bold: !0
        }, Z6.name, " @ ", Z6.marketplace)), W1.createElement(m, {
            marginBottom: 1
        }, W1.createElement(T, {
            dimColor: !0
        }, "Status: "), W1.createElement(T, {
            color: "error"
        }, "Removed")), W1.createElement(m, {
            marginBottom: 1,
            flexDirection: "column"
        }, W1.createElement(T, {
            color: "error"
        }, "Removed from marketplace · reason: ", Z6.reason), W1.createElement(T, null, Z6.text), W1.createElement(T, {
            dimColor: !0
        }, "Flagged on ", new Date(Z6.flaggedAt).toLocaleDateString())), W1.createElement(m, {
            marginTop: 1,
            flexDirection: "column"
        }, W1.createElement(m, null, W1.createElement(T, null, a6.pointer, " "), W1.createElement(T, {
            color: "suggestion"
        }, "Dismiss"))), W1.createElement(C8, null, W1.createElement(O8, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "dismiss"
        }), W1.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "back"
        })))
    }
    if (W === "confirm-project-uninstall" && N) return W1.createElement(m, {
        flexDirection: "column"
    }, W1.createElement(T, {
        bold: !0,
        color: "warning"
    }, N.plugin.name, " is enabled in .claude/settings.json (shared with your team)"), W1.createElement(m, {
        marginTop: 1,
        flexDirection: "column"
    }, W1.createElement(T, null, "Disable it just for you in .claude/settings.local.json?"), W1.createElement(T, {
        dimColor: !0
    }, "This has the same effect as uninstalling, without affecting other contributors.")), o && W1.createElement(m, {
        marginTop: 1
    }, W1.createElement(T, {
        color: "error"
    }, o)), W1.createElement(m, {
        marginTop: 1
    }, $6 ? W1.createElement(T, {
        dimColor: !0
    }, "Disabling…") : W1.createElement(T, null, W1.createElement(T, {
        bold: !0
    }, "y"), " to disable · ", W1.createElement(T, {
        bold: !0
    }, "n"), " to cancel")));
    if (W === "plugin-details" && N) {
        let Z6 = PA(),
            u6 = `${N.plugin.name}@${N.marketplace}`,
            C6 = Z6?.enabledPlugins?.[u6] !== !1,
            o6 = H.filter((b6) => ("plugin" in b6) && b6.plugin === N.plugin.name || b6.source === u6 || b6.source.startsWith(`${N.plugin.name}@`)),
            V6 = o6.length === 0 ? null : W1.createElement(m, {
                flexDirection: "column",
                marginBottom: 1
            }, W1.createElement(T, {
                bold: !0,
                color: "error"
            }, o6.length, " error", o6.length !== 1 ? "s" : "", ":"), o6.map((b6, E6) => {
                let U6 = iv6(b6);
                return W1.createElement(m, {
                    key: E6,
                    flexDirection: "column",
                    marginLeft: 2
                }, W1.createElement(T, {
                    color: "error"
                }, V16(b6)), U6 && W1.createElement(T, {
                    dimColor: !0,
                    italic: !0
                }, a6.arrowRight, " ", U6))
            }));
        return W1.createElement(m, {
            flexDirection: "column"
        }, W1.createElement(m, null, W1.createElement(T, {
            bold: !0
        }, N.plugin.name, " @ ", N.marketplace)), W1.createElement(m, null, W1.createElement(T, {
            dimColor: !0
        }, "Scope: "), W1.createElement(T, null, N.scope || "user")), N.plugin.manifest.version && W1.createElement(m, null, W1.createElement(T, {
            dimColor: !0
        }, "Version: "), W1.createElement(T, null, N.plugin.manifest.version)), N.plugin.manifest.description && W1.createElement(m, {
            marginBottom: 1
        }, W1.createElement(T, null, N.plugin.manifest.description)), N.plugin.manifest.author && W1.createElement(m, null, W1.createElement(T, {
            dimColor: !0
        }, "Author: "), W1.createElement(T, null, N.plugin.manifest.author.name)), W1.createElement(m, {
            marginBottom: 1
        }, W1.createElement(T, {
            dimColor: !0
        }, "Status: "), W1.createElement(T, {
            color: C6 ? "success" : "warning"
        }, C6 ? "Enabled" : "Disabled"), N.pendingUpdate && W1.createElement(T, {
            color: "suggestion"
        }, " · Marked for update")), W1.createElement(VnY, {
            plugin: N.plugin,
            marketplace: N.marketplace
        }), V6, W1.createElement(m, {
            marginTop: 1,
            flexDirection: "column"
        }, Q6.map((b6, E6) => {
            let U6 = E6 === z6;
            return W1.createElement(m, {
                key: E6
            }, U6 && W1.createElement(T, null, a6.pointer, " "), !U6 && W1.createElement(T, null, "  "), W1.createElement(T, {
                bold: U6,
                color: b6.label.includes("Uninstall") ? "error" : b6.label.includes("Update") ? "suggestion" : void 0
            }, b6.label))
        })), $6 && W1.createElement(m, {
            marginTop: 1
        }, W1.createElement(T, null, "Processing…")), o && W1.createElement(m, {
            marginTop: 1
        }, W1.createElement(T, {
            color: "error"
        }, o)), W1.createElement(m, {
            marginTop: 1
        }, W1.createElement(T, {
            dimColor: !0,
            italic: !0
        }, W1.createElement(C8, null, W1.createElement(O8, {
            action: "select:previous",
            context: "Select",
            fallback: "↑",
            description: "navigate"
        }), W1.createElement(O8, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "select"
        }), W1.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "back"
        })))))
    }
    if (typeof W === "object" && W.type === "failed-plugin-details") {
        let Z6 = W.plugin,
            u6 = Z6.errors[0],
            C6 = u6 ? V16(u6) : "Failed to load";
        return W1.createElement(m, {
            flexDirection: "column"
        }, W1.createElement(T, null, W1.createElement(T, {
            bold: !0
        }, Z6.name), W1.createElement(T, {
            dimColor: !0
        }, " @ ", Z6.marketplace), W1.createElement(T, {
            dimColor: !0
        }, " (", Z6.scope, ")")), W1.createElement(T, {
            color: "error"
        }, C6), Z6.scope === "managed" ? W1.createElement(m, {
            marginTop: 1
        }, W1.createElement(T, {
            dimColor: !0
        }, "Managed by your organization — contact your admin")) : W1.createElement(m, {
            marginTop: 1
        }, W1.createElement(T, {
            color: "suggestion"
        }, a6.pointer, " "), W1.createElement(T, {
            bold: !0
        }, "Remove")), $6 && W1.createElement(T, null, "Processing…"), o && W1.createElement(T, {
            color: "error"
        }, o), W1.createElement(m, {
            marginTop: 1
        }, W1.createElement(T, {
            dimColor: !0,
            italic: !0
        }, W1.createElement(C8, null, Z6.scope !== "managed" && W1.createElement(O8, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "remove"
        }), W1.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "back"
        })))))
    }
    if (typeof W === "object" && W.type === "mcp-detail") {
        let Z6 = W.client,
            u6 = eB($, Z6.name).length,
            C6 = () => {
                Z({
                    type: "mcp-tools",
                    client: Z6
                })
            },
            o6 = () => {
                Z("plugin-list")
            },
            V6 = (U6) => {
                if (U6) q(U6);
                Z("plugin-list")
            },
            b6 = Z6.config.scope,
            E6 = Z6.config.type;
        if (E6 === "stdio") {
            let U6 = {
                name: Z6.name,
                client: Z6,
                scope: b6,
                transport: "stdio",
                config: Z6.config
            };
            return W1.createElement(En6, {
                server: U6,
                serverToolsCount: u6,
                onViewTools: C6,
                onCancel: o6,
                onComplete: V6,
                borderless: !0
            })
        } else if (E6 === "sse") {
            let U6 = {
                name: Z6.name,
                client: Z6,
                scope: b6,
                transport: "sse",
                isAuthenticated: void 0,
                config: Z6.config
            };
            return W1.createElement(z_6, {
                server: U6,
                serverToolsCount: u6,
                onViewTools: C6,
                onCancel: o6,
                onComplete: V6,
                borderless: !0
            })
        } else if (E6 === "http") {
            let U6 = {
                name: Z6.name,
                client: Z6,
                scope: b6,
                transport: "http",
                isAuthenticated: void 0,
                config: Z6.config
            };
            return W1.createElement(z_6, {
                server: U6,
                serverToolsCount: u6,
                onViewTools: C6,
                onCancel: o6,
                onComplete: V6,
                borderless: !0
            })
        } else if (E6 === "claudeai-proxy") {
            let U6 = {
                name: Z6.name,
                client: Z6,
                scope: b6,
                transport: "claudeai-proxy",
                isAuthenticated: void 0,
                config: Z6.config
            };
            return W1.createElement(z_6, {
                server: U6,
                serverToolsCount: u6,
                onViewTools: C6,
                onCancel: o6,
                onComplete: V6,
                borderless: !0
            })
        }
        return Z("plugin-list"), null
    }
    if (typeof W === "object" && W.type === "mcp-tools") {
        let Z6 = W.client,
            u6 = Z6.config.scope,
            C6 = Z6.config.type,
            o6;
        if (C6 === "stdio") o6 = {
            name: Z6.name,
            client: Z6,
            scope: u6,
            transport: "stdio",
            config: Z6.config
        };
        else if (C6 === "sse") o6 = {
            name: Z6.name,
            client: Z6,
            scope: u6,
            transport: "sse",
            isAuthenticated: void 0,
            config: Z6.config
        };
        else if (C6 === "http") o6 = {
            name: Z6.name,
            client: Z6,
            scope: u6,
            transport: "http",
            isAuthenticated: void 0,
            config: Z6.config
        };
        else o6 = {
            name: Z6.name,
            client: Z6,
            scope: u6,
            transport: "claudeai-proxy",
            isAuthenticated: void 0,
            config: Z6.config
        };
        return W1.createElement(yn6, {
            server: o6,
            onSelectTool: (V6) => {
                Z({
                    type: "mcp-tool-detail",
                    client: Z6,
                    tool: V6
                })
            },
            onBack: () => Z({
                type: "mcp-detail",
                client: Z6
            })
        })
    }
    if (typeof W === "object" && W.type === "mcp-tool-detail") {
        let {
            client: Z6,
            tool: u6
        } = W, C6 = Z6.config.scope, o6 = Z6.config.type, V6;
        if (o6 === "stdio") V6 = {
            name: Z6.name,
            client: Z6,
            scope: C6,
            transport: "stdio",
            config: Z6.config
        };
        else if (o6 === "sse") V6 = {
            name: Z6.name,
            client: Z6,
            scope: C6,
            transport: "sse",
            isAuthenticated: void 0,
            config: Z6.config
        };
        else if (o6 === "http") V6 = {
            name: Z6.name,
            client: Z6,
            scope: C6,
            transport: "http",
            isAuthenticated: void 0,
            config: Z6.config
        };
        else V6 = {
            name: Z6.name,
            client: Z6,
            scope: C6,
            transport: "claudeai-proxy",
            isAuthenticated: void 0,
            config: Z6.config
        };
        return W1.createElement(Ln6, {
            tool: u6,
            server: V6,
            onBack: () => Z({
                type: "mcp-tools",
                client: Z6
            })
        })
    }
    let k6 = X6.getVisibleItems(J6);
    return W1.createElement(m, {
        flexDirection: "column"
    }, W1.createElement(m, {
        marginBottom: 1
    }, W1.createElement(fh, {
        query: G,
        isFocused: J,
        isTerminalFocused: X,
        width: P - 4,
        cursorOffset: v
    })), J6.length === 0 && G && W1.createElement(m, {
        marginBottom: 1
    }, W1.createElement(T, {
        dimColor: !0
    }, 'No items match "', G, '"')), X6.scrollPosition.canScrollUp && W1.createElement(m, null, W1.createElement(T, {
        dimColor: !0
    }, " ", a6.arrowUp, " more above")), k6.map((Z6, u6) => {
        let o6 = X6.toActualIndex(u6) === K6 && !J,
            V6 = u6 > 0 ? k6[u6 - 1] : null,
            b6 = !V6 || V6.scope !== Z6.scope,
            E6 = (U6) => {
                switch (U6) {
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
                        return "Built-in";
                    case "dynamic":
                        return "Built-in";
                    default:
                        return U6
                }
            };
        return W1.createElement(W1.Fragment, {
            key: Z6.id
        }, b6 && W1.createElement(m, {
            marginTop: u6 > 0 ? 1 : 0,
            paddingLeft: 2
        }, W1.createElement(T, {
            dimColor: Z6.scope !== "flagged",
            color: Z6.scope === "flagged" ? "warning" : void 0,
            bold: Z6.scope === "flagged"
        }, E6(Z6.scope))), W1.createElement(Iwq, {
            item: Z6,
            isSelected: o6
        }))
    }), X6.scrollPosition.canScrollDown && W1.createElement(m, null, W1.createElement(T, {
        dimColor: !0
    }, " ", a6.arrowDown, " more below")), W1.createElement(m, {
        marginTop: 1,
        marginLeft: 1
    }, W1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, W1.createElement(C8, null, W1.createElement(T, null, "type to search"), W1.createElement(O8, {
        action: "plugin:toggle",
        context: "Plugin",
        fallback: "Space",
        description: "toggle"
    }), W1.createElement(O8, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "details"
    }), W1.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    })))), B.size > 0 && W1.createElement(m, {
        marginLeft: 1
    }, W1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "Run /reload-plugins to apply changes")))
}
// @from(Ln 404557, Col 4)
W1
// @from(Ln 404557, Col 8)
DY
// @from(Ln 404558, Col 4)
iwq = E(() => {
    i6();
    H16();
    j16();
    _q();
    b7();
    tH();
    Aw();
    i8();
    Uv();
    __6();
    kX();
    k1();
    H1();
    ep6();
    BI();
    pv6();
    Cwq();
    qz1();
    xL1();
    eu();
    SL1();
    g1();
    NA();
    bwq();
    TL1();
    vL1();
    NL1();
    VL1();
    qM();
    f16();
    Xq();
    gL1();
    pL1();
    OK();
    _7();
    s8();
    W1 = t(P6(), 1), DY = t(P6(), 1)
})
// @from(Ln 404603, Col 0)
function RnY(A) {
    let q = Eh.basename(A),
        K = Eh.basename(Eh.dirname(A));
    if (q === "plugin.json") return "plugin";
    if (q === "marketplace.json") return "marketplace";
    if (K === ".claude-plugin") return "plugin";
    return "unknown"
}
// @from(Ln 404612, Col 0)
function nwq(A) {
    return A.issues.map((q) => ({
        path: q.path.join(".") || "root",
        message: q.message,
        code: q.code
    }))
}
// @from(Ln 404620, Col 0)
function Cn6(A, q, K, Y) {
    if (A.includes("..")) K.push({
        path: q,
        message: Y ? `Path contains "..": ${A}. ${Y}` : `Path contains ".." which could be a path traversal attempt: ${A}`
    })
}
// @from(Ln 404627, Col 0)
function hnY(A) {
    let q = A.replace(/^(\.\.\/)+/, "");
    return `Plugin source paths are resolved relative to the marketplace root (the directory containing .claude-plugin/), not relative to marketplace.json. Use "${q!==A?`./${q}`:"./plugins/my-plugin"}" instead of "${A}".`
}
// @from(Ln 404631, Col 0)
async function Hd8(A) {
    let q = [],
        K = [],
        Y = Eh.resolve(A),
        z;
    try {
        z = await Jd8(Y, {
            encoding: "utf-8"
        })
    } catch ($) {
        let H = $.code,
            j;
        if (H === "ENOENT") j = `File not found: ${Y}`;
        else if (H === "EISDIR") j = `Path is not a file: ${Y}`;
        else j = `Failed to read file: ${_1($)}`;
        return {
            success: !1,
            errors: [{
                path: "file",
                message: j,
                code: H
            }],
            warnings: [],
            filePath: Y,
            fileType: "plugin"
        }
    }
    let _;
    try {
        _ = i1(z)
    } catch ($) {
        return {
            success: !1,
            errors: [{
                path: "json",
                message: `Invalid JSON syntax: ${_1($)}`
            }],
            warnings: [],
            filePath: Y,
            fileType: "plugin"
        }
    }
    if (_ && typeof _ === "object") {
        let $ = _;
        if ($.commands)(Array.isArray($.commands) ? $.commands : [$.commands]).forEach((j, J) => {
            if (typeof j === "string") Cn6(j, `commands[${J}]`, q)
        });
        if ($.agents)(Array.isArray($.agents) ? $.agents : [$.agents]).forEach((j, J) => {
            if (typeof j === "string") Cn6(j, `agents[${J}]`, q)
        });
        if ($.skills)(Array.isArray($.skills) ? $.skills : [$.skills]).forEach((j, J) => {
            if (typeof j === "string") Cn6(j, `skills[${J}]`, q)
        })
    }
    let w = _;
    if (typeof _ === "object" && _ !== null) {
        let $ = _,
            H = Object.keys($).filter((j) => LnY.has(j));
        if (H.length > 0) {
            let j = {
                ...$
            };
            for (let J of H) delete j[J], K.push({
                path: J,
                message: `Field '${J}' belongs in the marketplace entry (marketplace.json), ` + "not plugin.json. It's harmless here but unused — Claude Code " + "ignores it at load time."
            });
            w = j
        }
    }
    let O = x46().strict().safeParse(w);
    if (!O.success) q.push(...nwq(O.error));
    if (O.success) {
        let $ = O.data;
        if (!$.version) K.push({
            path: "version",
            message: 'No version specified. Consider adding a version following semver (e.g., "1.0.0")'
        });
        if (!$.description) K.push({
            path: "description",
            message: "No description provided. Adding a description helps users understand what your plugin does"
        });
        if (!$.author) K.push({
            path: "author",
            message: "No author information provided. Consider adding author details for plugin attribution"
        })
    }
    return {
        success: q.length === 0,
        errors: q,
        warnings: K,
        filePath: Y,
        fileType: "plugin"
    }
}
// @from(Ln 404725, Col 0)
async function jd8(A) {
    let q = [],
        K = [],
        Y = Eh.resolve(A),
        z;
    try {
        z = await Jd8(Y, {
            encoding: "utf-8"
        })
    } catch ($) {
        let H = $.code,
            j;
        if (H === "ENOENT") j = `File not found: ${Y}`;
        else if (H === "EISDIR") j = `Path is not a file: ${Y}`;
        else j = `Failed to read file: ${_1($)}`;
        return {
            success: !1,
            errors: [{
                path: "file",
                message: j,
                code: H
            }],
            warnings: [],
            filePath: Y,
            fileType: "marketplace"
        }
    }
    let _;
    try {
        _ = i1(z)
    } catch ($) {
        return {
            success: !1,
            errors: [{
                path: "json",
                message: `Invalid JSON syntax: ${_1($)}`
            }],
            warnings: [],
            filePath: Y,
            fileType: "marketplace"
        }
    }
    if (_ && typeof _ === "object") {
        let $ = _;
        if (Array.isArray($.plugins)) $.plugins.forEach((H, j) => {
            if (H && typeof H === "object" && "source" in H) {
                let J = H.source;
                if (typeof J === "string") Cn6(J, `plugins[${j}].source`, q, hnY(J));
                if (J && typeof J === "object" && "path" in J && typeof J.path === "string") Cn6(J.path, `plugins[${j}].source.path`, q)
            }
        })
    }
    let O = Vo().extend({
        plugins: C.array(G58().strict())
    }).strict().safeParse(_);
    if (!O.success) q.push(...nwq(O.error));
    if (O.success) {
        let $ = O.data;
        if (!$.plugins || $.plugins.length === 0) K.push({
            path: "plugins",
            message: "Marketplace has no plugins defined"
        });
        if ($.plugins) $.plugins.forEach((H, j) => {
            if ($.plugins.filter((M) => M.name === H.name).length > 1) q.push({
                path: `plugins[${j}].name`,
                message: `Duplicate plugin name "${H.name}" found in marketplace`
            })
        });
        if (!$.metadata?.description) K.push({
            path: "metadata.description",
            message: "No marketplace description provided. Adding a description helps users understand what this marketplace offers"
        })
    }
    return {
        success: q.length === 0,
        errors: q,
        warnings: K,
        filePath: Y,
        fileType: "marketplace"
    }
}
// @from(Ln 404806, Col 0)
async function QL1(A) {
    let q = Eh.resolve(A),
        K = null;
    try {
        K = await ynY(q)
    } catch (z) {
        if (z.code !== "ENOENT") throw z
    }
    if (K?.isDirectory()) {
        let z = Eh.join(q, ".claude-plugin", "marketplace.json"),
            _ = await jd8(z);
        if (_.errors[0]?.code !== "ENOENT") return _;
        let w = Eh.join(q, ".claude-plugin", "plugin.json"),
            O = await Hd8(w);
        if (O.errors[0]?.code !== "ENOENT") return O;
        return {
            success: !1,
            errors: [{
                path: "directory",
                message: "No manifest found in directory. Expected .claude-plugin/marketplace.json or .claude-plugin/plugin.json"
            }],
            warnings: [],
            filePath: q,
            fileType: "plugin"
        }
    }
    switch (RnY(A)) {
        case "plugin":
            return Hd8(A);
        case "marketplace":
            return jd8(A);
        case "unknown": {
            try {
                let z = await Jd8(q, {
                        encoding: "utf-8"
                    }),
                    _ = i1(z);
                if (Array.isArray(_.plugins)) return jd8(A)
            } catch (z) {
                if (z.code === "ENOENT") return {
                    success: !1,
                    errors: [{
                        path: "file",
                        message: `File not found: ${q}`
                    }],
                    warnings: [],
                    filePath: q,
                    fileType: "plugin"
                }
            }
            return Hd8(A)
        }
    }
}
// @from(Ln 404860, Col 4)
LnY
// @from(Ln 404861, Col 4)
Md8 = E(() => {
    K7();
    IW();
    g1();
    s8();
    LnY = new Set(["category", "source", "tags", "strict", "id"])
})
// @from(Ln 404869, Col 0)
function owq({
    onComplete: A,
    path: q
}) {
    return rwq.useEffect(() => {
        async function K() {
            if (!q) {
                A(`Usage: /plugin validate <path>

Validate a plugin or marketplace manifest file or directory.

Examples:
  /plugin validate .claude-plugin/plugin.json
  /plugin validate /path/to/plugin-directory
  /plugin validate .

When given a directory, automatically validates .claude-plugin/marketplace.json
or .claude-plugin/plugin.json (prefers marketplace if both exist).

Or from the command line:
  claude plugin validate <path>`);
                return
            }
            try {
                let Y = await QL1(q),
                    z = "";
                if (z += `Validating ${Y.fileType} manifest: ${Y.filePath}

`, Y.errors.length > 0) z += `${a6.cross} Found ${Y.errors.length} error${Y.errors.length===1?"":"s"}:

`, Y.errors.forEach((_) => {
                    z += `  ${a6.pointer} ${_.path}: ${_.message}
`
                }), z += `
`;
                if (Y.warnings.length > 0) z += `${a6.warning} Found ${Y.warnings.length} warning${Y.warnings.length===1?"":"s"}:

`, Y.warnings.forEach((_) => {
                    z += `  ${a6.pointer} ${_.path}: ${_.message}
`
                }), z += `
`;
                if (Y.success) {
                    if (Y.warnings.length > 0) z += `${a6.tick} Validation passed with warnings
`;
                    else z += `${a6.tick} Validation passed
`;
                    process.exitCode = 0
                } else z += `${a6.cross} Validation failed
`, process.exitCode = 1;
                A(z)
            } catch (Y) {
                process.exitCode = 2, _6(Y), A(`${a6.cross} Unexpected error during validation: ${_1(Y)}`)
            }
        }
        K()
    }, [A, q]), In6.createElement(m, {
        flexDirection: "column"
    }, In6.createElement(T, null, "Running validation..."))
}
// @from(Ln 404929, Col 4)
In6
// @from(Ln 404929, Col 9)
rwq
// @from(Ln 404930, Col 4)
awq = E(() => {
    i6();
    Md8();
    b7();
    k1();
    s8();
    In6 = t(P6(), 1), rwq = t(P6(), 1)
})
// @from(Ln 404939, Col 0)
function swq(A) {
    if (!A) return {
        type: "menu"
    };
    let q = A.trim().split(/\s+/);
    switch (q[0]?.toLowerCase()) {
        case "help":
        case "--help":
        case "-h":
            return {
                type: "help"
            };
        case "install":
        case "i": {
            let Y = q[1];
            if (!Y) return {
                type: "install"
            };
            if (Y.includes("@")) {
                let [_, w] = Y.split("@");
                return {
                    type: "install",
                    plugin: _,
                    marketplace: w
                }
            }
            if (Y.startsWith("http://") || Y.startsWith("https://") || Y.startsWith("file://") || Y.includes("/") || Y.includes("\\")) return {
                type: "install",
                marketplace: Y
            };
            return {
                type: "install",
                plugin: Y
            }
        }
        case "manage":
            return {
                type: "manage"
            };
        case "uninstall":
            return {
                type: "uninstall", plugin: q[1]
            };
        case "enable":
            return {
                type: "enable", plugin: q[1]
            };
        case "disable":
            return {
                type: "disable", plugin: q[1]
            };
        case "validate":
            return {
                type: "validate", path: q.slice(1).join(" ").trim() || void 0
            };
        case "marketplace":
        case "market": {
            let Y = q[1]?.toLowerCase(),
                z = q.slice(2).join(" ");
            switch (Y) {
                case "add":
                    return {
                        type: "marketplace", action: "add", target: z
                    };
                case "remove":
                case "rm":
                    return {
                        type: "marketplace", action: "remove", target: z
                    };
                case "update":
                    return {
                        type: "marketplace", action: "update", target: z
                    };
                case "list":
                    return {
                        type: "marketplace", action: "list"
                    };
                default:
                    return {
                        type: "marketplace"
                    }
            }
        }
        default:
            return {
                type: "menu"
            }
    }
}
// @from(Ln 405029, Col 0)
function SnY(A) {
    let q = A6(4),
        {
            onComplete: K
        } = A,
        Y, z;
    if (q[0] !== K) Y = () => {
        (async function() {
            try {
                let $ = await C3(),
                    H = Object.keys($);
                if (H.length === 0) K("No marketplaces configured");
                else K(`Configured marketplaces:
${H.map(CnY).join(`
`)}`)
            } catch ($) {
                K(`Error loading marketplaces: ${_1($)}`)
            }
        })()
    }, z = [K], q[0] = K, q[1] = Y, q[2] = z;
    else Y = q[1], z = q[2];
    cX.useEffect(Y, z);
    let _;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) _ = R8.createElement(T, null, "Loading marketplaces..."), q[3] = _;
    else _ = q[3];
    return _
}
// @from(Ln 405057, Col 0)
function CnY(A) {
    return `  • ${A}`
}
// @from(Ln 405061, Col 0)
function InY() {
    return null
}
// @from(Ln 405065, Col 0)
function Dd8(A) {
    let q = [],
        K = [{
            source: "userSettings",
            scope: "user"
        }, {
            source: "projectSettings",
            scope: "project"
        }, {
            source: "localSettings",
            scope: "local"
        }];
    for (let {
            source: _,
            scope: w
        }
        of K)
        if (L8(_)?.extraKnownMarketplaces?.[A]) q.push({
            source: _,
            scope: w
        });
    let Y = L8("policySettings"),
        z = Boolean(Y?.extraKnownMarketplaces?.[A]);
    return {
        editableSources: q,
        isInPolicy: z
    }
}
// @from(Ln 405094, Col 0)
function twq(A) {
    let {
        editableSources: q,
        isInPolicy: K
    } = Dd8(A);
    if (q.length > 0) return {
        kind: "remove-extra-marketplace",
        name: A,
        sources: q
    };
    if (K) return {
        kind: "managed-only",
        name: A
    };
    return {
        kind: "navigate",
        tab: "marketplaces",
        viewState: {
            type: "manage-marketplaces",
            targetMarketplace: A,
            action: "remove"
        }
    }
}
// @from(Ln 405119, Col 0)
function bnY(A) {
    return {
        kind: "navigate",
        tab: "installed",
        viewState: {
            type: "manage-plugins",
            targetPlugin: A,
            action: "uninstall"
        }
    }
}
// @from(Ln 405131, Col 0)
function Xd8(A) {
    return xnY.has(A.type)
}
// @from(Ln 405135, Col 0)
function Pd8(A) {
    if ("pluginId" in A && A.pluginId) return A.pluginId;
    if ("plugin" in A && A.plugin) return A.plugin;
    if (A.source.includes("@")) return A.source.split("@")[0];
    return
}
// @from(Ln 405142, Col 0)
function unY(A, q, K, Y, z, _, w) {
    let O = [];
    for (let j of _) {
        let J = "pluginId" in j ? j.pluginId : ("plugin" in j) ? j.plugin : void 0;
        O.push({
            label: J ?? j.source,
            message: V16(j),
            guidance: "Restart to retry loading plugins",
            action: {
                kind: "none"
            }
        })
    }
    let $ = new Set;
    for (let j of A) {
        $.add(j.name);
        let J = twq(j.name),
            M = Dd8(j.name),
            D = M.isInPolicy ? "managed" : M.editableSources[0]?.scope;
        O.push({
            label: j.name,
            message: j.error ?? "Installation failed",
            guidance: J.kind === "managed-only" ? "Managed by your organization — contact your admin" : void 0,
            action: J,
            scope: D
        })
    }
    for (let j of q) {
        let J = "marketplace" in j ? j.marketplace : j.source;
        if ($.has(J)) continue;
        $.add(J);
        let M = twq(J),
            D = Dd8(J),
            X = D.isInPolicy ? "managed" : D.editableSources[0]?.scope;
        O.push({
            label: J,
            message: V16(j),
            guidance: M.kind === "managed-only" ? "Managed by your organization — contact your admin" : iv6(j),
            action: M,
            scope: X
        })
    }
    for (let j of z) {
        if ($.has(j.name)) continue;
        $.add(j.name), O.push({
            label: j.name,
            message: j.error,
            action: {
                kind: "remove-installed-marketplace",
                name: j.name
            }
        })
    }
    let H = new Set;
    for (let j of K) {
        let J = Pd8(j);
        if (J && H.has(J)) continue;
        if (J) H.add(J);
        let M = "marketplace" in j ? j.marketplace : void 0,
            D = J ? w.get(j.source) ?? w.get(J) : void 0;
        O.push({
            label: J ? M ? `${J} @ ${M}` : J : j.source,
            message: V16(j),
            guidance: iv6(j),
            action: J ? bnY(J) : {
                kind: "none"
            },
            scope: D
        })
    }
    for (let j of Y) O.push({
        label: j.source,
        message: V16(j),
        guidance: iv6(j),
        action: {
            kind: "none"
        }
    });
    return O
}
// @from(Ln 405223, Col 0)
function mnY(A, q) {
    for (let {
            source: K
        }
        of q) {
        let Y = L8(K);
        if (!Y) continue;
        let z = {};
        if (Y.extraKnownMarketplaces?.[A]) z.extraKnownMarketplaces = {
            ...Y.extraKnownMarketplaces,
            [A]: void 0
        };
        if (Y.enabledPlugins) {
            let _ = `@${A}`,
                w = !1,
                O = {
                    ...Y.enabledPlugins
                };
            for (let $ in O)
                if ($.endsWith(_)) O[$] = void 0, w = !0;
            if (w) z.enabledPlugins = O
        }
        if (Object.keys(z).length > 0) TA(K, z)
    }
}
// @from(Ln 405249, Col 0)
function BnY(A) {
    let q = A6(26),
        {
            setViewState: K,
            setActiveTab: Y,
            markPluginsChanged: z
        } = A,
        _ = M1(lnY),
        w = M1(cnY),
        O = xA(),
        [$, H] = cX.useState(0),
        [j, J] = cX.useState(null),
        M;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) M = [], q[0] = M;
    else M = q[0];
    let [D, X] = cX.useState(M), P, W;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) P = () => {
        (async () => {
            try {
                let $6 = await C3(),
                    {
                        failures: n
                    } = await mI($6);
                X(n)
            } catch {}
        })()
    }, W = [], q[1] = P, q[2] = W;
    else P = q[1], W = q[2];
    cX.useEffect(P, W);
    let Z = w.marketplaces.filter(dnY),
        G = new Set(Z.map(UnY)),
        f = _.filter(Xd8),
        v = _.filter(($6) => ($6.type === "marketplace-not-found" || $6.type === "marketplace-load-failed" || $6.type === "marketplace-blocked-by-policy") && !G.has($6.marketplace)),
        N = _.filter(QnY),
        V = _.filter(pnY),
        L = T16(),
        h = unY(Z, v, N, V, D, f, L),
        R;
    if (q[3] !== K) R = () => {
        K({
            type: "menu"
        })
    }, q[3] = K, q[4] = R;
    else R = q[4];
    let u;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) u = {
        context: "Confirmation"
    }, q[5] = u;
    else u = q[5];
    D8("confirm:no", R, u);
    let I = () => {
            let $6 = h[$];
            if (!$6) return;
            let {
                action: n
            } = $6;
            A: switch (n.kind) {
                case "navigate": {
                    Y(n.tab), K(n.viewState);
                    break A
                }
                case "remove-extra-marketplace": {
                    let o = n.sources.map(FnY).join(", ");
                    mnY(n.name, n.sources), HY(), O((a) => ({
                        ...a,
                        plugins: {
                            ...a.plugins,
                            errors: a.plugins.errors.filter((i) => !(("marketplace" in i) && i.marketplace === n.name)),
                            installationStatus: {
                                ...a.plugins.installationStatus,
                                marketplaces: a.plugins.installationStatus.marketplaces.filter((i) => i.name !== n.name)
                            }
                        }
                    })), J(`${a6.tick} Removed "${n.name}" from ${o} settings`), z();
                    break A
                }
                case "remove-installed-marketplace": {
                    (async () => {
                        try {
                            await AZ6(n.name), HY(), X((o) => o.filter((a) => a.name !== n.name)), J(`${a6.tick} Removed marketplace "${n.name}"`), z()
                        } catch (o) {
                            let a = o;
                            J(`Failed to remove "${n.name}": ${a instanceof Error?a.message:String(a)}`)
                        }
                    })();
                    break A
                }
                case "managed-only":
                    break A;
                case "none":
            }
        },
        g;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) g = () => H(gnY), q[6] = g;
    else g = q[6];
    let B = h.length > 0,
        b;
    if (q[7] !== B) b = {
        context: "Select",
        isActive: B
    }, q[7] = B, q[8] = b;
    else b = q[8];
    tA({
        "select:previous": g,
        "select:next": () => H(($6) => Math.min(h.length - 1, $6 + 1)),
        "select:accept": I
    }, b);
    let p = Math.min($, Math.max(0, h.length - 1));
    if (p !== $) H(p);
    let Q = h[p]?.action,
        U = Q && Q.kind !== "none" && Q.kind !== "managed-only";
    if (h.length === 0) {
        let $6;
        if (q[9] === Symbol.for("react.memo_cache_sentinel")) $6 = R8.createElement(m, {
            marginLeft: 1
        }, R8.createElement(T, {
            dimColor: !0
        }, "No plugin errors")), q[9] = $6;
        else $6 = q[9];
        let n;
        if (q[10] === Symbol.for("react.memo_cache_sentinel")) n = R8.createElement(m, {
            flexDirection: "column"
        }, $6, R8.createElement(m, {
            marginTop: 1
        }, R8.createElement(T, {
            dimColor: !0,
            italic: !0
        }, R8.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "back"
        })))), q[10] = n;
        else n = q[10];
        return n
    }
    let r = m,
        e = "column",
        Y6;
    if (q[11] !== p) Y6 = ($6, n) => {
        let o = n === p;
        return R8.createElement(m, {
            key: n,
            marginLeft: 1,
            flexDirection: "column",
            marginBottom: 1
        }, R8.createElement(T, null, R8.createElement(T, {
            color: o ? "suggestion" : "error"
        }, o ? a6.pointer : a6.cross, " "), R8.createElement(T, {
            bold: o
        }, $6.label), $6.scope && R8.createElement(T, {
            dimColor: !0
        }, " (", $6.scope, ")")), R8.createElement(m, {
            marginLeft: 3
        }, R8.createElement(T, {
            color: "error"
        }, $6.message)), $6.guidance && R8.createElement(m, {
            marginLeft: 3
        }, R8.createElement(T, {
            dimColor: !0,
            italic: !0
        }, $6.guidance)))
    }, q[11] = p, q[12] = Y6;
    else Y6 = q[12];
    let H6 = h.map(Y6),
        J6;
    if (q[13] !== j) J6 = j && R8.createElement(m, {
        marginTop: 1,
        marginLeft: 1
    }, R8.createElement(T, {
        color: "claude"
    }, j)), q[13] = j, q[14] = J6;
    else J6 = q[14];
    let K6;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) K6 = R8.createElement(O8, {
        action: "select:previous",
        context: "Select",
        fallback: "↑",
        description: "navigate"
    }), q[15] = K6;
    else K6 = q[15];
    let s;
    if (q[16] !== U) s = U && R8.createElement(O8, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "resolve"
    }), q[16] = U, q[17] = s;
    else s = q[17];
    let X6;
    if (q[18] === Symbol.for("react.memo_cache_sentinel")) X6 = R8.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    }), q[18] = X6;
    else X6 = q[18];
    let z6;
    if (q[19] !== s) z6 = R8.createElement(m, {
        marginTop: 1
    }, R8.createElement(T, {
        dimColor: !0,
        italic: !0
    }, R8.createElement(C8, null, K6, s, X6))), q[19] = s, q[20] = z6;
    else z6 = q[20];
    let N6;
    if (q[21] !== r || q[22] !== H6 || q[23] !== J6 || q[24] !== z6) N6 = R8.createElement(r, {
        flexDirection: e
    }, H6, J6, z6), q[21] = r, q[22] = H6, q[23] = J6, q[24] = z6, q[25] = N6;
    else N6 = q[25];
    return N6
}
// @from(Ln 405462, Col 0)
function gnY(A) {
    return Math.max(0, A - 1)
}
// @from(Ln 405466, Col 0)
function FnY(A) {
    return A.scope
}
// @from(Ln 405470, Col 0)
function pnY(A) {
    if (Xd8(A)) return !1;
    if (A.type === "marketplace-not-found" || A.type === "marketplace-load-failed" || A.type === "marketplace-blocked-by-policy") return !1;
    return Pd8(A) === void 0
}
// @from(Ln 405476, Col 0)
function QnY(A) {
    if (Xd8(A)) return !1;
    if (A.type === "marketplace-not-found" || A.type === "marketplace-load-failed" || A.type === "marketplace-blocked-by-policy") return !1;
    return Pd8(A) !== void 0
}
// @from(Ln 405482, Col 0)
function UnY(A) {
    return A.name
}
// @from(Ln 405486, Col 0)
function dnY(A) {
    return A.status === "failed"
}
// @from(Ln 405490, Col 0)
function cnY(A) {
    return A.plugins.installationStatus
}
// @from(Ln 405494, Col 0)
function lnY(A) {
    return A.plugins.errors
}
// @from(Ln 405498, Col 0)
function inY(A) {
    switch (A.type) {
        case "help":
            return {
                type: "help"
            };
        case "validate":
            return {
                type: "validate", path: A.path
            };
        case "install":
            if (A.marketplace) return {
                type: "browse-marketplace",
                targetMarketplace: A.marketplace,
                targetPlugin: A.plugin
            };
            if (A.plugin) return {
                type: "discover-plugins",
                targetPlugin: A.plugin
            };
            return {
                type: "discover-plugins"
            };
        case "manage":
            return {
                type: "manage-plugins"
            };
        case "uninstall":
            return {
                type: "manage-plugins", targetPlugin: A.plugin, action: "uninstall"
            };
        case "enable":
            return {
                type: "manage-plugins", targetPlugin: A.plugin, action: "enable"
            };
        case "disable":
            return {
                type: "manage-plugins", targetPlugin: A.plugin, action: "disable"
            };
        case "marketplace":
            if (A.action === "list") return {
                type: "marketplace-list"
            };
            if (A.action === "add") return {
                type: "add-marketplace",
                initialValue: A.target
            };
            if (A.action === "remove") return {
                type: "manage-marketplaces",
                targetMarketplace: A.target,
                action: "remove"
            };
            if (A.action === "update") return {
                type: "manage-marketplaces",
                targetMarketplace: A.target,
                action: "update"
            };
            return {
                type: "marketplace-menu"
            };
        case "menu":
        default:
            return {
                type: "discover-plugins"
            }
    }
}
// @from(Ln 405566, Col 0)
function nnY(A) {
    if (A.type === "manage-plugins") return "installed";
    if (A.type === "manage-marketplaces") return "marketplaces";
    return "discover"
}
// @from(Ln 405572, Col 0)
function ewq(A) {
    let q = A6(75),
        {
            onComplete: K,
            args: Y,
            showMcpRedirectMessage: z
        } = A,
        _, w;
    if (q[0] !== Y) _ = swq(Y), w = inY(_), q[0] = Y, q[1] = _, q[2] = w;
    else _ = q[1], w = q[2];
    let O = w,
        [$, H] = cX.useState(O),
        j;
    if (q[3] !== O) j = nnY(O), q[3] = O, q[4] = j;
    else j = q[4];
    let [J, M] = cX.useState(j), [D, X] = cX.useState($.type === "add-marketplace" ? $.initialValue || "" : ""), [P, W] = cX.useState(0), [Z, G] = cX.useState(null), [f, v] = cX.useState(null), [N, V] = cX.useState(!1), L = xA(), h = M1(onY), R = h > 0 ? `Errors (${h})` : "Errors", u = IK(), I = _.type === "marketplace" && _.action === "add" && _.target !== void 0, g;
    if (q[5] !== L) g = () => {
        L(rnY)
    }, q[5] = L, q[6] = g;
    else g = q[6];
    let B = g,
        b;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) b = (R6) => {
        let T6 = R6;
        M(T6), G(null);
        A: switch (T6) {
            case "discover": {
                H({
                    type: "discover-plugins"
                });
                break A
            }
            case "installed": {
                H({
                    type: "manage-plugins"
                });
                break A
            }
            case "marketplaces": {
                H({
                    type: "manage-marketplaces"
                });
                break A
            }
            case "errors":
        }
    }, q[7] = b;
    else b = q[7];
    let p = b,
        Q, U;
    if (q[8] !== K || q[9] !== f || q[10] !== $.type) Q = () => {
        if ($.type === "menu" && !f) K()
    }, U = [$.type, f, K], q[8] = K, q[9] = f, q[10] = $.type, q[11] = Q, q[12] = U;
    else Q = q[11], U = q[12];
    cX.useEffect(Q, U);
    let r, e;
    if (q[13] !== J || q[14] !== $.type) r = () => {
        if ($.type === "browse-marketplace" && J !== "discover") M("discover")
    }, e = [$.type, J], q[13] = J, q[14] = $.type, q[15] = r, q[16] = e;
    else r = q[15], e = q[16];
    cX.useEffect(r, e);
    let Y6;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) Y6 = () => {
        M("marketplaces"), H({
            type: "manage-marketplaces"
        }), X(""), G(null)
    }, q[17] = Y6;
    else Y6 = q[17];
    let H6 = Y6,
        J6 = $.type === "add-marketplace",
        K6;
    if (q[18] !== J6) K6 = {
        context: "Settings",
        isActive: J6
    }, q[18] = J6, q[19] = K6;
    else K6 = q[19];
    D8("confirm:no", H6, K6);
    let s, X6;
    if (q[20] !== K || q[21] !== f) s = () => {
        if (f) K(f)
    }, X6 = [f, K], q[20] = K, q[21] = f, q[22] = s, q[23] = X6;
    else s = q[22], X6 = q[23];
    cX.useEffect(s, X6);
    let z6, N6;
    if (q[24] !== K || q[25] !== $.type) z6 = () => {
        if ($.type === "help") K()
    }, N6 = [$.type, K], q[24] = K, q[25] = $.type, q[26] = z6, q[27] = N6;
    else z6 = q[26], N6 = q[27];
    if (cX.useEffect(z6, N6), $.type === "help") {
        let R6;
        if (q[28] === Symbol.for("react.memo_cache_sentinel")) R6 = R8.createElement(m, {
            flexDirection: "column"
        }, R8.createElement(T, {
            bold: !0
        }, "Plugin Command Usage:"), R8.createElement(T, null, " "), R8.createElement(T, {
            dimColor: !0
        }, "Installation:"), R8.createElement(T, null, " /plugin install - Browse and install plugins"), R8.createElement(T, null, " ", "/plugin install <marketplace> - Install from specific marketplace"), R8.createElement(T, null, " /plugin install <plugin> - Install specific plugin"), R8.createElement(T, null, " ", "/plugin install <plugin>@<market> - Install plugin from marketplace"), R8.createElement(T, null, " "), R8.createElement(T, {
            dimColor: !0
        }, "Management:"), R8.createElement(T, null, " /plugin manage - Manage installed plugins"), R8.createElement(T, null, " /plugin enable <plugin> - Enable a plugin"), R8.createElement(T, null, " /plugin disable <plugin> - Disable a plugin"), R8.createElement(T, null, " /plugin uninstall <plugin> - Uninstall a plugin"), R8.createElement(T, null, " "), R8.createElement(T, {
            dimColor: !0
        }, "Marketplaces:"), R8.createElement(T, null, " /plugin marketplace - Marketplace management menu"), R8.createElement(T, null, " /plugin marketplace add - Add a marketplace"), R8.createElement(T, null, " ", "/plugin marketplace add <path/url> - Add marketplace directly"), R8.createElement(T, null, " /plugin marketplace update - Update marketplaces"), R8.createElement(T, null, " ", "/plugin marketplace update <name> - Update specific marketplace"), R8.createElement(T, null, " /plugin marketplace remove - Remove a marketplace"), R8.createElement(T, null, " ", "/plugin marketplace remove <name> - Remove specific marketplace"), R8.createElement(T, null, " /plugin marketplace list - List all marketplaces"), R8.createElement(T, null, " "), R8.createElement(T, {
            dimColor: !0
        }, "Validation:"), R8.createElement(T, null, " ", "/plugin validate <path> - Validate a manifest file or directory"), R8.createElement(T, null, " "), R8.createElement(T, {
            dimColor: !0
        }, "Other:"), R8.createElement(T, null, " /plugin - Main plugin menu"), R8.createElement(T, null, " /plugin help - Show this help"), R8.createElement(T, null, " /plugins - Alias for /plugin")), q[28] = R6;
        else R6 = q[28];
        return R6
    }
    if ($.type === "validate") {
        let R6;
        if (q[29] !== K || q[30] !== $.path) R6 = R8.createElement(owq, {
            onComplete: K,
            path: $.path
        }), q[29] = K, q[30] = $.path, q[31] = R6;
        else R6 = q[31];
        return R6
    }
    if ($.type === "marketplace-menu") return H({
        type: "menu"
    }), null;
    if ($.type === "marketplace-list") {
        let R6;
        if (q[32] !== K) R6 = R8.createElement(SnY, {
            onComplete: K
        }), q[32] = K, q[33] = R6;
        else R6 = q[33];
        return R6
    }
    if ($.type === "add-marketplace") {
        let R6;
        if (q[34] !== I || q[35] !== P || q[36] !== Z || q[37] !== D || q[38] !== B || q[39] !== f) R6 = R8.createElement(Mwq, {
            inputValue: D,
            setInputValue: X,
            cursorOffset: P,
            setCursorOffset: W,
            error: Z,
            setError: G,
            result: f,
            setResult: v,
            setViewState: H,
            onAddComplete: B,
            cliMode: I
        }), q[34] = I, q[35] = P, q[36] = Z, q[37] = D, q[38] = B, q[39] = f, q[40] = R6;
        else R6 = q[40];
        return R6
    }
    let $6;
    if (q[41] !== J || q[42] !== z) $6 = z && J === "installed" ? R8.createElement(InY, null) : void 0, q[41] = J, q[42] = z, q[43] = $6;
    else $6 = q[43];
    let n;
    if (q[44] !== Z || q[45] !== B || q[46] !== f || q[47] !== $.targetMarketplace || q[48] !== $.targetPlugin || q[49] !== $.type) n = R8.createElement(Hw, {
        id: "discover",
        title: "Discover"
    }, $.type === "browse-marketplace" ? R8.createElement(ywq, {
        error: Z,
        setError: G,
        result: f,
        setResult: v,
        setViewState: H,
        onInstallComplete: B,
        targetMarketplace: $.targetMarketplace,
        targetPlugin: $.targetPlugin
    }) : R8.createElement(Rwq, {
        error: Z,
        setError: G,
        result: f,
        setResult: v,
        setViewState: H,
        onInstallComplete: B,
        onSearchModeChange: V,
        targetPlugin: $.type === "discover-plugins" ? $.targetPlugin : void 0
    })), q[44] = Z, q[45] = B, q[46] = f, q[47] = $.targetMarketplace, q[48] = $.targetPlugin, q[49] = $.type, q[50] = n;
    else n = q[50];
    let o = $.type === "manage-plugins" ? $.targetPlugin : void 0,
        a = $.type === "manage-plugins" ? $.targetMarketplace : void 0,
        i = $.type === "manage-plugins" ? $.action : void 0,
        l;
    if (q[51] !== B || q[52] !== o || q[53] !== a || q[54] !== i) l = R8.createElement(Hw, {
        id: "installed",
        title: "Installed"
    }, R8.createElement(lwq, {
        setViewState: H,
        setResult: v,
        onManageComplete: B,
        onSearchModeChange: V,
        targetPlugin: o,
        targetMarketplace: a,
        action: i
    })), q[51] = B, q[52] = o, q[53] = a, q[54] = i, q[55] = l;
    else l = q[55];
    let q6 = $.type === "manage-marketplaces" ? $.targetMarketplace : void 0,
        w6 = $.type === "manage-marketplaces" ? $.action : void 0,
        O6;
    if (q[56] !== Z || q[57] !== u || q[58] !== B || q[59] !== q6 || q[60] !== w6) O6 = R8.createElement(Hw, {
        id: "marketplaces",
        title: "Marketplaces"
    }, R8.createElement(vwq, {
        setViewState: H,
        error: Z,
        setError: G,
        setResult: v,
        exitState: u,
        onManageComplete: B,
        targetMarketplace: q6,
        action: w6
    })), q[56] = Z, q[57] = u, q[58] = B, q[59] = q6, q[60] = w6, q[61] = O6;
    else O6 = q[61];
    let L6;
    if (q[62] !== B) L6 = R8.createElement(BnY, {
        setViewState: H,
        setActiveTab: M,
        markPluginsChanged: B
    }), q[62] = B, q[63] = L6;
    else L6 = q[63];
    let y6;
    if (q[64] !== R || q[65] !== L6) y6 = R8.createElement(Hw, {
        id: "errors",
        title: R
    }, L6), q[64] = R, q[65] = L6, q[66] = y6;
    else y6 = q[66];
    let G6;
    if (q[67] !== J || q[68] !== N || q[69] !== $6 || q[70] !== n || q[71] !== l || q[72] !== O6 || q[73] !== y6) G6 = R8.createElement(S3, {
        color: "suggestion"
    }, R8.createElement(Gh, {
        title: "Plugins",
        selectedTab: J,
        onTabChange: p,
        color: "suggestion",
        disableNavigation: N,
        banner: $6
    }, n, l, O6, y6)), q[67] = J, q[68] = N, q[69] = $6, q[70] = n, q[71] = l, q[72] = O6, q[73] = y6, q[74] = G6;
    else G6 = q[74];
    return G6
}
// @from(Ln 405807, Col 0)
function rnY(A) {
    return A.plugins.needsRefresh ? A : {
        ...A,
        plugins: {
            ...A.plugins,
            needsRefresh: !0
        }
    }
}
// @from(Ln 405817, Col 0)
function onY(A) {
    let q = A.plugins.errors.length;
    for (let K of A.plugins.installationStatus.marketplaces)
        if (K.status === "failed") q++;
    return q
}
// @from(Ln 405823, Col 4)
R8
// @from(Ln 405823, Col 8)
cX
// @from(Ln 405823, Col 12)
xnY
// @from(Ln 405824, Col 4)
Wd8 = E(() => {
    e6();
    i6();
    _7();
    PO();
    __6();
    dB();
    Aw();
    Uv();
    NA();
    FJ();
    oz6();
    Dwq();
    Nwq();
    Lwq();
    hwq();
    iwq();
    awq();
    Aw();
    i8();
    Xq();
    OK();
    b7();
    s8();
    R8 = t(P6(), 1), cX = t(P6(), 1);
    xnY = new Set(["git-auth-failed", "git-timeout", "network-error"])
})
// @from(Ln 405851, Col 4)
AOq = {}
// @from(Ln 405856, Col 0)
function anY(A) {
    let q = A6(7),
        {
            action: K,
            target: Y,
            onComplete: z
        } = A,
        _ = M1(tnY),
        w = G16(),
        O = UL1.useRef(!1),
        $, H;
    if (q[0] !== K || q[1] !== _ || q[2] !== z || q[3] !== Y || q[4] !== w) $ = () => {
        if (O.current) return;
        O.current = !0;
        let j = K === "enable",
            J = _.filter(snY),
            M = Y === "all" ? J.filter((D) => j ? D.type === "disabled" : D.type !== "disabled") : J.filter((D) => D.name === Y);
        if (M.length === 0) {
            z(Y === "all" ? `All MCP servers are already ${j?"enabled":"disabled"}` : `MCP server "${Y}" not found`);
            return
        }
        for (let D of M) w(D.name);
        z(Y === "all" ? `${j?"Enabled":"Disabled"} ${M.length} MCP server(s)` : `MCP server "${Y}" ${j?"enabled":"disabled"}`)
    }, H = [K, Y, _, w, z], q[0] = K, q[1] = _, q[2] = z, q[3] = Y, q[4] = w, q[5] = $, q[6] = H;
    else $ = q[5], H = q[6];
    return UL1.useEffect($, H), null
}
// @from(Ln 405884, Col 0)
function snY(A) {
    return A.name !== "ide"
}
// @from(Ln 405888, Col 0)
function tnY(A) {
    return A.mcp.clients
}
// @from(Ln 405891, Col 0)
async function enY(A, q, K) {
    if (K) {
        let Y = K.trim().split(/\s+/);
        if (Y[0] === "no-redirect") return bn6.default.createElement(kL1, {
            onComplete: A
        });
        if (Y[0] === "reconnect" && Y[1]) return bn6.default.createElement(oU8, {
            serverName: Y.slice(1).join(" "),
            onComplete: A
        });
        if (Y[0] === "enable" || Y[0] === "disable") return bn6.default.createElement(anY, {
            action: Y[0],
            target: Y.length > 1 ? Y.slice(1).join(" ") : "all",
            onComplete: A
        })
    }
    return bn6.default.createElement(kL1, {
        onComplete: A
    })
}
// @from(Ln 405911, Col 4)
bn6
// @from(Ln 405911, Col 9)
UL1
// @from(Ln 405912, Col 4)
qOq = E(() => {
    e6();
    jwq();
    aU8();
    f16();
    NA();
    Wd8();
    bn6 = t(P6(), 1), UL1 = t(P6(), 1)
})
// @from(Ln 405921, Col 4)
ArY
// @from(Ln 405921, Col 9)
KOq
// @from(Ln 405922, Col 4)
YOq = E(() => {
    ArY = {
        type: "local-jsx",
        name: "mcp",
        description: "Manage MCP servers",
        isEnabled: () => !0,
        isHidden: !1,
        immediate: !0,
        argumentHint: "[enable|disable [server-name]]",
        load: () => Promise.resolve().then(() => (qOq(), AOq)),
        userFacingName() {
            return "mcp"
        }
    }, KOq = ArY
})
// @from(Ln 405937, Col 4)
Zd8 = x((kIO, zOq) => {
    zOq.exports = function() {
        return typeof Promise === "function" && Promise.prototype && Promise.prototype.then
    }
})
// @from(Ln 405942, Col 4)
k16 = x((KrY) => {
    var Gd8, qrY = [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706];
    KrY.getSymbolSize = function(q) {
        if (!q) throw Error('"version" cannot be null or undefined');
        if (q < 1 || q > 40) throw Error('"version" should be in range from 1 to 40');
        return q * 4 + 17
    };
    KrY.getSymbolTotalCodewords = function(q) {
        return qrY[q]
    };
    KrY.getBCHDigit = function(A) {
        let q = 0;
        while (A !== 0) q++, A >>>= 1;
        return q
    };
    KrY.setToSJISFunction = function(q) {
        if (typeof q !== "function") throw Error('"toSJISFunc" is not a valid function.');
        Gd8 = q
    };
    KrY.isKanjiModeEnabled = function() {
        return typeof Gd8 < "u"
    };
    KrY.toSJIS = function(q) {
        return Gd8(q)
    }
})
// @from(Ln 405968, Col 4)
dL1 = x((jrY) => {
    jrY.L = {
        bit: 1
    };
    jrY.M = {
        bit: 0
    };
    jrY.Q = {
        bit: 3
    };
    jrY.H = {
        bit: 2
    };

    function HrY(A) {
        if (typeof A !== "string") throw Error("Param is not a string");
        switch (A.toLowerCase()) {
            case "l":
            case "low":
                return jrY.L;
            case "m":
            case "medium":
                return jrY.M;
            case "q":
            case "quartile":
                return jrY.Q;
            case "h":
            case "high":
                return jrY.H;
            default:
                throw Error("Unknown EC Level: " + A)
        }
    }
    jrY.isValid = function(q) {
        return q && typeof q.bit < "u" && q.bit >= 0 && q.bit < 4
    };
    jrY.from = function(q, K) {
        if (jrY.isValid(q)) return q;
        try {
            return HrY(q)
        } catch (Y) {
            return K
        }
    }
})
// @from(Ln 406013, Col 4)
MOq = x((LIO, JOq) => {
    function jOq() {
        this.buffer = [], this.length = 0
    }
    jOq.prototype = {
        get: function(A) {
            let q = Math.floor(A / 8);
            return (this.buffer[q] >>> 7 - A % 8 & 1) === 1
        },
        put: function(A, q) {
            for (let K = 0; K < q; K++) this.putBit((A >>> q - K - 1 & 1) === 1)
        },
        getLengthInBits: function() {
            return this.length
        },
        putBit: function(A) {
            let q = Math.floor(this.length / 8);
            if (this.buffer.length <= q) this.buffer.push(0);
            if (A) this.buffer[q] |= 128 >>> this.length % 8;
            this.length++
        }
    };
    JOq.exports = jOq
})
// @from(Ln 406037, Col 4)
XOq = x((RIO, DOq) => {
    function xn6(A) {
        if (!A || A < 1) throw Error("BitMatrix size must be defined and greater than 0");
        this.size = A, this.data = new Uint8Array(A * A), this.reservedBit = new Uint8Array(A * A)
    }
    xn6.prototype.set = function(A, q, K, Y) {
        let z = A * this.size + q;
        if (this.data[z] = K, Y) this.reservedBit[z] = !0
    };
    xn6.prototype.get = function(A, q) {
        return this.data[A * this.size + q]
    };
    xn6.prototype.xor = function(A, q, K) {
        this.data[A * this.size + q] ^= K
    };
    xn6.prototype.isReserved = function(A, q) {
        return this.reservedBit[A * this.size + q]
    };
    DOq.exports = xn6
})
// @from(Ln 406057, Col 4)
WOq = x((DrY) => {
    var MrY = k16().getSymbolSize;
    DrY.getRowColCoords = function(q) {
        if (q === 1) return [];
        let K = Math.floor(q / 7) + 2,
            Y = MrY(q),
            z = Y === 145 ? 26 : Math.ceil((Y - 13) / (2 * K - 2)) * 2,
            _ = [Y - 7];
        for (let w = 1; w < K - 1; w++) _[w] = _[w - 1] - z;
        return _.push(6), _.reverse()
    };
    DrY.getPositions = function(q) {
        let K = [],
            Y = DrY.getRowColCoords(q),
            z = Y.length;
        for (let _ = 0; _ < z; _++)
            for (let w = 0; w < z; w++) {
                if (_ === 0 && w === 0 || _ === 0 && w === z - 1 || _ === z - 1 && w === 0) continue;
                K.push([Y[_], Y[w]])
            }
        return K
    }
})
// @from(Ln 406080, Col 4)
ZOq = x((WrY) => {
    var PrY = k16().getSymbolSize;
    WrY.getPositions = function(q) {
        let K = PrY(q);
        return [
            [0, 0],
            [K - 7, 0],
            [0, K - 7]
        ]
    }
})
// @from(Ln 406091, Col 4)
VOq = x((frY) => {
    frY.Patterns = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
    };
    var M_6 = {
        N1: 3,
        N2: 3,
        N3: 40,
        N4: 10
    };
    frY.isValid = function(q) {
        return q != null && q !== "" && !isNaN(q) && q >= 0 && q <= 7
    };
    frY.from = function(q) {
        return frY.isValid(q) ? parseInt(q, 10) : void 0
    };
    frY.getPenaltyN1 = function(q) {
        let K = q.size,
            Y = 0,
            z = 0,
            _ = 0,
            w = null,
            O = null;
        for (let $ = 0; $ < K; $++) {
            z = _ = 0, w = O = null;
            for (let H = 0; H < K; H++) {
                let j = q.get($, H);
                if (j === w) z++;
                else {
                    if (z >= 5) Y += M_6.N1 + (z - 5);
                    w = j, z = 1
                }
                if (j = q.get(H, $), j === O) _++;
                else {
                    if (_ >= 5) Y += M_6.N1 + (_ - 5);
                    O = j, _ = 1
                }
            }
            if (z >= 5) Y += M_6.N1 + (z - 5);
            if (_ >= 5) Y += M_6.N1 + (_ - 5)
        }
        return Y
    };
    frY.getPenaltyN2 = function(q) {
        let K = q.size,
            Y = 0;
        for (let z = 0; z < K - 1; z++)
            for (let _ = 0; _ < K - 1; _++) {
                let w = q.get(z, _) + q.get(z, _ + 1) + q.get(z + 1, _) + q.get(z + 1, _ + 1);
                if (w === 4 || w === 0) Y++
            }
        return Y * M_6.N2
    };
    frY.getPenaltyN3 = function(q) {
        let K = q.size,
            Y = 0,
            z = 0,
            _ = 0;
        for (let w = 0; w < K; w++) {
            z = _ = 0;
            for (let O = 0; O < K; O++) {
                if (z = z << 1 & 2047 | q.get(w, O), O >= 10 && (z === 1488 || z === 93)) Y++;
                if (_ = _ << 1 & 2047 | q.get(O, w), O >= 10 && (_ === 1488 || _ === 93)) Y++
            }
        }
        return Y * M_6.N3
    };
    frY.getPenaltyN4 = function(q) {
        let K = 0,
            Y = q.data.length;
        for (let _ = 0; _ < Y; _++) K += q.data[_];
        return Math.abs(Math.ceil(K * 100 / Y / 5) - 10) * M_6.N4
    };

    function GrY(A, q, K) {
        switch (A) {
            case frY.Patterns.PATTERN000:
                return (q + K) % 2 === 0;
            case frY.Patterns.PATTERN001:
                return q % 2 === 0;
            case frY.Patterns.PATTERN010:
                return K % 3 === 0;
            case frY.Patterns.PATTERN011:
                return (q + K) % 3 === 0;
            case frY.Patterns.PATTERN100:
                return (Math.floor(q / 2) + Math.floor(K / 3)) % 2 === 0;
            case frY.Patterns.PATTERN101:
                return q * K % 2 + q * K % 3 === 0;
            case frY.Patterns.PATTERN110:
                return (q * K % 2 + q * K % 3) % 2 === 0;
            case frY.Patterns.PATTERN111:
                return (q * K % 3 + (q + K) % 2) % 2 === 0;
            default:
                throw Error("bad maskPattern:" + A)
        }
    }
    frY.applyMask = function(q, K) {
        let Y = K.size;
        for (let z = 0; z < Y; z++)
            for (let _ = 0; _ < Y; _++) {
                if (K.isReserved(_, z)) continue;
                K.xor(_, z, GrY(q, _, z))
            }
    };
    frY.getBestMask = function(q, K) {
        let Y = Object.keys(frY.Patterns).length,
            z = 0,
            _ = 1 / 0;
        for (let w = 0; w < Y; w++) {
            K(w), frY.applyMask(w, q);
            let O = frY.getPenaltyN1(q) + frY.getPenaltyN2(q) + frY.getPenaltyN3(q) + frY.getPenaltyN4(q);
            if (frY.applyMask(w, q), O < _) _ = O, z = w
        }
        return z
    }
})