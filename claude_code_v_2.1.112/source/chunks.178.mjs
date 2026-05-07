
// @from(Ln 456791, Col 0)
function MFK({
    setViewState: q,
    setResult: K,
    onManageComplete: _,
    onSearchModeChange: z,
    targetPlugin: Y,
    targetMarketplace: A,
    action: O
}) {
    let w = M8((h6) => h6.mcp.clients),
        $ = M8((h6) => h6.mcp.tools),
        j = M8((h6) => h6.plugins.errors),
        H = xx6(),
        [J, X] = C_.useState(!1),
        M = C_.useCallback((h6) => {
            X(h6), z?.(h6)
        }, [z]),
        P = K2(),
        W = bP(),
        D = s1(),
        {
            columns: Z
        } = D,
        {
            rows: G
        } = Fd(D),
        [f, v] = C_.useState("plugin-list"),
        {
            query: V,
            setQuery: k,
            cursorOffset: N,
            handleKeyDown: R,
            handlePaste: h
        } = bS({
            isActive: f === "plugin-list" && J,
            onExit: () => {
                M(!1)
            }
        }),
        [C, x] = C_.useState(null),
        [B, m] = C_.useState([]),
        [S, F] = C_.useState([]),
        [U, g] = C_.useState(!0),
        [c, n] = C_.useState(new Map),
        l = C_.useRef(!1),
        z6 = C_.useRef(void 0),
        A6 = m_6(),
        e = E8.useCallback(() => {
            if (f === "plugin-details") v("plugin-list"), x(null), L6(null);
            else if (typeof f === "object" && f.type === "failed-plugin-details") v("plugin-list"), L6(null);
            else if (f === "configuring") v("plugin-details"), c6(null);
            else if (typeof f === "object" && (f.type === "plugin-options" || f.type === "configuring-options")) {
                if (v("plugin-list"), x(null), K("Plugin enabled. Configuration skipped — run /reload-plugins to apply."), _) _()
            } else if (typeof f === "object" && f.type === "flagged-detail") v("plugin-list"), L6(null);
            else if (typeof f === "object" && f.type === "mcp-detail") v("plugin-list"), L6(null);
            else if (typeof f === "object" && f.type === "mcp-tools") v({
                type: "mcp-detail",
                client: f.client
            });
            else if (typeof f === "object" && f.type === "mcp-tool-detail") v({
                type: "mcp-tools",
                client: f.client
            });
            else {
                if (c.size > 0) {
                    K("Run /reload-plugins to apply plugin changes.");
                    return
                }
                q({
                    type: "menu"
                })
            }
        }, [f, q, c, K]);
    G1("confirm:no", e, {
        context: "Confirmation",
        isActive: (f !== "plugin-list" || !J) && f !== "confirm-project-uninstall" && !(typeof f === "object" && f.type === "confirm-data-cleanup")
    });
    let i = (h6) => {
            if (h6.type === "connected") return "connected";
            if (h6.type === "disabled") return "disabled";
            if (h6.type === "pending") return "pending";
            if (h6.type === "needs-auth") return "needs-auth";
            return "failed"
        },
        O6 = C_.useMemo(() => {
            let h6 = y7(),
                _8 = new Map;
            for (let l6 of w)
                if (l6.name.startsWith("plugin:")) {
                    let j8 = l6.name.split(":");
                    if (j8.length >= 3) {
                        let f8 = j8[1],
                            p8 = j8.slice(2).join(":"),
                            o8 = _8.get(f8) || [];
                        o8.push({
                            displayName: p8,
                            client: l6
                        }), _8.set(f8, o8)
                    }
                } let R8 = [];
            for (let l6 of S) {
                let j8 = `${l6.plugin.name}@${l6.marketplace}`,
                    f8 = h6?.enabledPlugins?.[j8] !== !1,
                    p8 = j.filter((n1) => ("plugin" in n1) && n1.plugin === l6.plugin.name || n1.source === j8 || n1.source.startsWith(`${l6.plugin.name}@`)),
                    o8 = l6.plugin.isBuiltin ? "builtin" : l6.scope || "user";
                R8.push({
                    item: {
                        type: "plugin",
                        id: j8,
                        name: l6.plugin.name,
                        description: l6.plugin.manifest.description,
                        marketplace: l6.marketplace,
                        scope: o8,
                        isEnabled: f8,
                        errorCount: p8.length,
                        errors: p8,
                        plugin: l6.plugin,
                        pendingEnable: l6.pendingEnable,
                        pendingUpdate: l6.pendingUpdate,
                        pendingToggle: c.get(j8)
                    },
                    originalScope: o8,
                    childMcps: _8.get(l6.plugin.name) || []
                })
            }
            let x6 = new Set(R8.map(({
                    item: l6
                }) => l6.id)),
                i6 = new Set(R8.map(({
                    item: l6
                }) => l6.name)),
                v8 = new Map;
            for (let l6 of j) {
                if (x6.has(l6.source) || "plugin" in l6 && typeof l6.plugin === "string" && i6.has(l6.plugin)) continue;
                let j8 = v8.get(l6.source) || [];
                j8.push(l6), v8.set(l6.source, j8)
            }
            let f1 = p_6(),
                g8 = [];
            for (let [l6, j8] of v8) {
                if (l6 in H) continue;
                let f8 = Z4(l6),
                    p8 = f8.name || l6,
                    o8 = f8.marketplace || "unknown",
                    n1 = f1.get(l6),
                    c1 = n1 === "flag" || n1 === void 0 ? "user" : n1;
                g8.push({
                    type: "failed-plugin",
                    id: l6,
                    name: p8,
                    marketplace: o8,
                    scope: c1,
                    errorCount: j8.length,
                    errors: j8
                })
            }
            let w6 = [];
            for (let l6 of w) {
                if (l6.name === "ide") continue;
                if (l6.name.startsWith("plugin:")) continue;
                w6.push({
                    type: "mcp",
                    id: `mcp:${l6.name}`,
                    name: l6.name,
                    description: void 0,
                    scope: l6.config.scope,
                    status: i(l6),
                    client: l6
                })
            }
            let D6 = {
                    flagged: -1,
                    project: 0,
                    local: 1,
                    user: 2,
                    enterprise: 3,
                    managed: 4,
                    dynamic: 5,
                    builtin: 6
                },
                U6 = [],
                F6 = new Map;
            for (let {
                    item: l6,
                    originalScope: j8,
                    childMcps: f8
                }
                of R8) {
                let p8 = l6.scope;
                if (!F6.has(p8)) F6.set(p8, []);
                F6.get(p8).push(l6);
                for (let {
                        displayName: o8,
                        client: n1
                    }
                    of f8) {
                    let c1 = j8 === "builtin" ? "user" : j8;
                    if (!F6.has(c1)) F6.set(c1, []);
                    F6.get(c1).push({
                        type: "mcp",
                        id: `mcp:${n1.name}`,
                        name: o8,
                        description: void 0,
                        scope: c1,
                        status: i(n1),
                        client: n1,
                        indented: !0
                    })
                }
            }
            for (let l6 of w6) {
                let j8 = l6.scope;
                if (!F6.has(j8)) F6.set(j8, []);
                F6.get(j8).push(l6)
            }
            for (let l6 of g8) {
                let j8 = l6.scope;
                if (!F6.has(j8)) F6.set(j8, []);
                F6.get(j8).push(l6)
            }
            for (let [l6, j8] of Object.entries(H)) {
                let f8 = Z4(l6),
                    p8 = f8.name || l6,
                    o8 = f8.marketplace || "unknown";
                if (!F6.has("flagged")) F6.set("flagged", []);
                F6.get("flagged").push({
                    type: "flagged-plugin",
                    id: l6,
                    name: p8,
                    marketplace: o8,
                    scope: "flagged",
                    reason: "delisted",
                    text: "Removed from marketplace",
                    flaggedAt: j8.flaggedAt
                })
            }
            let z8 = [...F6.keys()].sort((l6, j8) => (D6[l6] ?? 99) - (D6[j8] ?? 99));
            for (let l6 of z8) {
                let j8 = F6.get(l6),
                    f8 = [],
                    p8 = [],
                    o8 = 0;
                while (o8 < j8.length) {
                    let n1 = j8[o8];
                    if (n1.type === "plugin" || n1.type === "failed-plugin" || n1.type === "flagged-plugin") {
                        let c1 = [n1];
                        o8++;
                        let dq = j8[o8];
                        while (dq?.type === "mcp" && dq.indented) c1.push(dq), o8++, dq = j8[o8];
                        f8.push(c1)
                    } else if (n1.type === "mcp" && !n1.indented) p8.push(n1), o8++;
                    else o8++
                }
                f8.sort((n1, c1) => n1[0].name.localeCompare(c1[0].name)), p8.sort((n1, c1) => n1.name.localeCompare(c1.name));
                for (let n1 of f8) U6.push(...n1);
                U6.push(...p8)
            }
            return U6
        }, [S, w, j, c, H]),
        J6 = C_.useMemo(() => O6.filter((h6) => h6.type === "flagged-plugin").map((h6) => h6.id), [O6]);
    C_.useEffect(() => {
        if (J6.length > 0) wFK(J6)
    }, [J6]);
    let [$6, H6] = C_.useState(() => new Set(H8().favoritePlugins ?? [])), q6 = C_.useCallback((h6) => {
        H6((_8) => {
            let R8 = new Set(_8);
            if (R8.has(h6)) R8.delete(h6);
            else R8.add(h6);
            return d8((x6) => ({
                ...x6,
                favoritePlugins: [...R8]
            })), R8
        })
    }, []), [o, _6] = C_.useState(!1), r = C_.useMemo(() => {
        if (V) {
            let i6 = V.toLowerCase();
            return O6.filter((v8) => v8.name.toLowerCase().includes(i6) || ("description" in v8) && v8.description?.toLowerCase().includes(i6)).map((v8) => ({
                kind: "item",
                section: "main",
                item: v8
            }))
        }
        let h6 = [],
            _8 = null,
            R8 = (i6, v8) => {
                let f1 = _8?.section !== i6;
                if (f1) {
                    if (h6.length > 0 && h6.at(-1)?.kind !== "disabled-header") h6.push({
                        kind: "spacer"
                    });
                    if (i6 === "attention" || i6 === "favorites") h6.push({
                        kind: "section-header",
                        section: i6
                    })
                }
                if ((i6 === "main" || i6 === "disabled") && (f1 || _8?.item.scope !== v8.scope)) {
                    if (!f1) h6.push({
                        kind: "spacer"
                    });
                    h6.push({
                        kind: "scope-header",
                        scope: v8.scope
                    })
                }
                let g8 = !f1 && _8?.item.type === "plugin",
                    w6 = v8.type === "mcp" && v8.indented && !g8 ? {
                        ...v8,
                        indented: !1
                    } : v8;
                h6.push({
                    kind: "item",
                    section: i6,
                    item: w6
                }), _8 = {
                    section: i6,
                    item: w6
                }
            };
        for (let i6 of O6)
            if (JFK(i6)) R8("attention", i6);
        for (let i6 of O6)
            if ($6.has(i6.id)) R8("favorites", i6);
        for (let i6 of O6)
            if (!Xw7(i6)) R8("main", i6);
        let x6 = O6.filter(Xw7);
        if (x6.length > 0) {
            if (h6.length > 0) h6.push({
                kind: "spacer"
            });
            if (h6.push({
                    kind: "disabled-header",
                    count: x6.length
                }), o)
                for (let i6 of x6) R8("disabled", i6)
        }
        return h6
    }, [O6, V, $6, o]), t = C_.useCallback((h6, _8) => {
        let R8 = _8 === -1 ? Math.min(h6, r.length - 1) : h6;
        for (let x6 = R8; x6 >= 0 && x6 < r.length; x6 += _8)
            if (Z_8(r[x6])) return x6;
        return -1
    }, [r]), [Y6, X6] = C_.useState(0), M6 = C_.useRef(null);
    C_.useEffect(() => {
        if (r.length === 0) return;
        let h6 = M6.current;
        if (h6) {
            M6.current = null;
            let _8 = r.findIndex((R8) => R8.kind === "item" && R8.section === h6.section && R8.item.id === h6.id);
            if (_8 !== -1) {
                X6(_8);
                return
            }
        }
        if (!Z_8(r[Y6])) {
            let _8 = t(Y6, 1),
                R8 = t(Y6, -1);
            X6(_8 !== -1 ? _8 : R8 !== -1 ? R8 : 0)
        }
    }, [r, Y6, t]);
    let W6 = W ? Math.max(8, G - 10) : 8,
        V6 = QP6({
            totalItems: r.length,
            selectedIndex: Y6,
            maxVisible: W6
        }),
        [f6, G6] = C_.useState(0),
        [k6, T6] = C_.useState(!1),
        [v6, L6] = C_.useState(null),
        [y6, c6] = C_.useState(null),
        [Z8, N8] = C_.useState(!1),
        [R6, p6] = C_.useState(!1);
    C_.useEffect(() => {
        if (!C) {
            p6(!1);
            return
        }
        async function h6() {
            let _8 = C.plugin.manifest.mcpServers,
                R8 = !1;
            if (_8) R8 = typeof _8 === "string" && Zx(_8) || Array.isArray(_8) && _8.some((x6) => typeof x6 === "string" && Zx(x6));
            if (!R8) try {
                let x6 = mx6.join(C.plugin.path, ".."),
                    i6 = mx6.join(x6, ".claude-plugin", "marketplace.json"),
                    v8 = await cP6.readFile(i6, "utf-8"),
                    g8 = n8(v8).plugins?.find((w6) => w6.name === C.plugin.name);
                if (g8?.mcpServers) {
                    let w6 = g8.mcpServers;
                    R8 = typeof w6 === "string" && Zx(w6) || Array.isArray(w6) && w6.some((D6) => typeof D6 === "string" && Zx(D6))
                }
            } catch (x6) {
                E(`Failed to read raw marketplace.json: ${x6}`)
            }
            p6(R8)
        }
        h6()
    }, [C]), C_.useEffect(() => {
        async function h6() {
            g(!0);
            try {
                let {
                    enabled: _8,
                    disabled: R8
                } = await sW(), x6 = y7(), i6 = hxY([..._8, ...R8]), v8 = {};
                for (let w6 of i6) {
                    let D6 = w6.source.split("@")[1] || "local";
                    if (!v8[D6]) v8[D6] = [];
                    v8[D6].push(w6)
                }
                let f1 = [];
                for (let [w6, D6] of Object.entries(v8)) {
                    let U6 = w7(D6, (z8) => {
                            let l6 = `${z8.name}@${w6}`;
                            return x6?.enabledPlugins?.[l6] !== !1
                        }),
                        F6 = D6.length - U6;
                    f1.push({
                        name: w6,
                        installedPlugins: D6,
                        enabledCount: U6,
                        disabledCount: F6
                    })
                }
                f1.sort((w6, D6) => {
                    if (w6.name === "claude-plugin-directory") return -1;
                    if (D6.name === "claude-plugin-directory") return 1;
                    return w6.name.localeCompare(D6.name)
                }), m(f1);
                let g8 = [];
                for (let w6 of f1)
                    for (let D6 of w6.installedPlugins) {
                        let U6 = `${D6.name}@${w6.name}`,
                            F6 = D6.isBuiltin ? "builtin" : pi8(U6).scope;
                        g8.push({
                            plugin: D6,
                            marketplace: w6.name,
                            scope: F6,
                            pendingEnable: void 0,
                            pendingUpdate: !1
                        })
                    }
                F(g8), X6(0)
            } finally {
                g(!1)
            }
        }
        h6()
    }, []), C_.useEffect(() => {
        if (l.current) return;
        if (Y && B.length > 0 && !U) {
            let {
                name: h6,
                marketplace: _8
            } = Z4(Y), R8 = A ?? _8, x6 = R8 ? B.filter((v8) => v8.name === R8) : B;
            for (let v8 of x6) {
                let f1 = v8.installedPlugins.find((g8) => g8.name === h6);
                if (f1) {
                    let g8 = `${f1.name}@${v8.name}`,
                        {
                            scope: w6
                        } = pi8(g8),
                        D6 = {
                            plugin: f1,
                            marketplace: v8.name,
                            scope: w6,
                            pendingEnable: void 0,
                            pendingUpdate: !1
                        };
                    x(D6), v("plugin-details"), z6.current = O, l.current = !0;
                    return
                }
            }
            let i6 = O6.find((v8) => v8.type === "failed-plugin" && v8.name === h6);
            if (i6 && i6.type === "failed-plugin") v({
                type: "failed-plugin-details",
                plugin: {
                    id: i6.id,
                    name: i6.name,
                    marketplace: i6.marketplace,
                    errors: i6.errors,
                    scope: i6.scope
                }
            }), l.current = !0;
            if (!l.current && O) l.current = !0, K(`Plugin "${Y}" is not installed in this project`)
        }
    }, [Y, A, B, U, O6, O, K]);
    let q8 = async (h6) => {
        if (!C) return;
        let _8 = C.scope || "user",
            R8 = _8 === "builtin";
        if (R8 && (h6 === "update" || h6 === "uninstall")) {
            L6("Built-in plugins cannot be updated or uninstalled.");
            return
        }
        if (!R8 && !Rx6(_8) && h6 !== "update") {
            L6("This plugin is managed by your organization. Contact your admin to disable it.");
            return
        }
        T6(!0), L6(null);
        try {
            let x6 = `${C.plugin.name}@${C.marketplace}`,
                i6;
            switch (h6) {
                case "enable": {
                    let F6 = await Sx6(x6);
                    if (!F6.success) throw Error(F6.message);
                    break
                }
                case "disable": {
                    let F6 = await Cx6(x6);
                    if (!F6.success) throw Error(F6.message);
                    i6 = F6.reverseDependents;
                    break
                }
                case "uninstall": {
                    if (R8) break;
                    if (!Rx6(_8)) break;
                    if (spK(x6)) {
                        T6(!1), v("confirm-project-uninstall");
                        return
                    }
                    let F6 = OZ().plugins[x6],
                        l6 = !F6 || F6.length <= 1 ? await oZ4(x6) : null;
                    if (l6) {
                        T6(!1), v({
                            type: "confirm-data-cleanup",
                            size: l6
                        });
                        return
                    }
                    let j8 = await ie(x6, _8);
                    if (!j8.success) throw Error(j8.message);
                    i6 = j8.reverseDependents;
                    break
                }
                case "update": {
                    if (R8) break;
                    let F6 = await bx6(x6, _8);
                    if (!F6.success) throw Error(F6.message);
                    if (F6.alreadyUpToDate || F6.skipped) {
                        if (K(F6.message), _) await _();
                        q({
                            type: "menu"
                        });
                        return
                    }
                    break
                }
            }
            YO();
            let v8 = `${C.plugin.name}@${C.marketplace}`;
            if (y7()?.enabledPlugins?.[v8] !== !1) {
                T6(!1), v({
                    type: "plugin-options"
                });
                return
            }
            let w6 = h6 === "enable" ? "Enabled" : h6 === "disable" ? "Disabled" : h6 === "update" ? "Updated" : "Uninstalled",
                D6 = i6 && i6.length > 0 ? ` · required by ${i6.join(", ")}` : "",
                U6 = `✓ ${w6} ${C.plugin.name}${D6}. Run /reload-plugins to apply.`;
            if (K(U6), _) await _();
            q({
                type: "menu"
            })
        } catch (x6) {
            T6(!1);
            let i6 = x6 instanceof Error ? x6.message : String(x6);
            L6(`Failed to ${h6}: ${i6}`), j6(r1(x6))
        }
    }, L8 = C_.useRef(q8);
    L8.current = q8, C_.useEffect(() => {
        if (f === "plugin-details" && C && z6.current) {
            let h6 = z6.current;
            z6.current = void 0, L8.current(h6)
        }
    }, [f, C]);
    let w8 = E8.useCallback(() => {
            let h6 = r[Y6];
            if (!Z_8(h6)) return;
            if (h6.kind === "disabled-header") {
                _6((R8) => !R8);
                return
            }
            let _8 = h6.item;
            if (_8.type === "flagged-plugin") return;
            if (_8.type === "plugin") {
                let R8 = `${_8.plugin.name}@${_8.marketplace}`,
                    x6 = y7(),
                    i6 = c.get(R8),
                    v8 = x6?.enabledPlugins?.[R8] !== !1,
                    f1 = _8.scope;
                if (f1 === "builtin" || Rx6(f1)) {
                    let w6 = new Map(c);
                    if (i6) w6.delete(R8), (async () => {
                        try {
                            if (i6 === "will-disable") await Sx6(R8);
                            else await Cx6(R8);
                            YO()
                        } catch (D6) {
                            j6(D6)
                        }
                    })();
                    else w6.set(R8, v8 ? "will-disable" : "will-enable"), (async () => {
                        try {
                            if (v8) await Cx6(R8);
                            else await Sx6(R8);
                            YO()
                        } catch (D6) {
                            j6(D6)
                        }
                    })();
                    n(w6)
                }
            } else if (_8.type === "mcp") A6(_8.client.name)
        }, [Y6, r, c, S, A6]),
        x8 = E8.useCallback(() => {
            let h6 = r[Y6];
            if (!Z_8(h6)) return;
            if (h6.kind === "disabled-header") {
                _6((R8) => !R8);
                return
            }
            let _8 = h6.item;
            if (_8.type === "plugin") {
                let R8 = S.find((x6) => x6.plugin.name === _8.plugin.name && x6.marketplace === _8.marketplace);
                if (R8) x(R8), v("plugin-details"), G6(0), L6(null)
            } else if (_8.type === "flagged-plugin") v({
                type: "flagged-detail",
                plugin: {
                    id: _8.id,
                    name: _8.name,
                    marketplace: _8.marketplace,
                    reason: _8.reason,
                    text: _8.text,
                    flaggedAt: _8.flaggedAt
                }
            }), L6(null);
            else if (_8.type === "failed-plugin") v({
                type: "failed-plugin-details",
                plugin: {
                    id: _8.id,
                    name: _8.name,
                    marketplace: _8.marketplace,
                    errors: _8.errors,
                    scope: _8.scope
                }
            }), G6(0), L6(null);
            else if (_8.type === "mcp") v({
                type: "mcp-detail",
                client: _8.client
            }), L6(null)
        }, [Y6, r, S]);
    L7({
        "select:previous": () => {
            let h6 = t(Y6 - 1, -1);
            if (h6 === -1) M(!0);
            else V6.handleSelectionChange(h6, X6)
        },
        "select:next": () => {
            let h6 = t(Y6 + 1, 1);
            if (h6 !== -1) V6.handleSelectionChange(h6, X6)
        },
        "select:accept": x8
    }, {
        context: "Select",
        isActive: f === "plugin-list" && !J
    });
    let a6 = E8.useCallback(() => {
        let h6 = r[Y6];
        if (h6?.kind !== "item") return;
        M6.current = {
            section: h6.section,
            id: h6.item.id
        }, q6(h6.item.id)
    }, [r, Y6, q6]);
    L7({
        "plugin:toggle": w8,
        "plugin:favorite": a6
    }, {
        context: "Plugin",
        isActive: f === "plugin-list" && !J
    });
    let D8 = E8.useCallback(() => {
        if (typeof f !== "object" || f.type !== "flagged-detail") return;
        $FK(f.plugin.id), v("plugin-list")
    }, [f]);
    L7({
        "select:accept": D8
    }, {
        context: "Select",
        isActive: typeof f === "object" && f.type === "flagged-detail"
    });
    let Q6 = E8.useMemo(() => {
        if (f !== "plugin-details" || !C) return [];
        let h6 = y7(),
            _8 = `${C.plugin.name}@${C.marketplace}`,
            R8 = h6?.enabledPlugins?.[_8] !== !1,
            x6 = C.marketplace === "builtin",
            i6 = [];
        if (i6.push({
                label: R8 ? "Disable plugin" : "Enable plugin",
                action: () => void q8(R8 ? "disable" : "enable")
            }), i6.push({
                label: $6.has(_8) ? "Remove from favorites" : "Add to favorites",
                action: () => q6(_8)
            }), !x6) {
            if (i6.push({
                    label: C.pendingUpdate ? "Unmark for update" : "Mark for update",
                    action: async () => {
                        try {
                            let v8 = await LxY(C.plugin.name, C.marketplace);
                            if (v8) {
                                L6(v8);
                                return
                            }
                            let f1 = [...S],
                                g8 = f1.findIndex((w6) => w6.plugin.name === C.plugin.name && w6.marketplace === C.marketplace);
                            if (g8 !== -1) f1[g8].pendingUpdate = !C.pendingUpdate, F(f1), x({
                                ...C,
                                pendingUpdate: !C.pendingUpdate
                            })
                        } catch (v8) {
                            L6(v8 instanceof Error ? v8.message : "Failed to check plugin update availability")
                        }
                    }
                }), R6) i6.push({
                label: "Configure",
                action: async () => {
                    N8(!0);
                    try {
                        let v8 = C.plugin.manifest.mcpServers,
                            f1 = null;
                        if (typeof v8 === "string" && Zx(v8)) f1 = v8;
                        else if (Array.isArray(v8)) {
                            for (let D6 of v8)
                                if (typeof D6 === "string" && Zx(D6)) {
                                    f1 = D6;
                                    break
                                }
                        }
                        if (!f1) {
                            L6("No MCPB file found in plugin"), N8(!1);
                            return
                        }
                        let g8 = `${C.plugin.name}@${C.marketplace}`,
                            w6 = await P88(f1, C.plugin.path, g8, void 0, void 0, !0);
                        if ("status" in w6 && w6.status === "needs-config") c6(w6), v("configuring");
                        else L6("Failed to load MCPB for configuration")
                    } catch (v8) {
                        let f1 = b6(v8);
                        L6(`Failed to load configuration: ${f1}`)
                    } finally {
                        N8(!1)
                    }
                }
            });
            if (C.plugin.manifest.userConfig && Object.keys(C.plugin.manifest.userConfig).length > 0) i6.push({
                label: "Configure options",
                action: () => {
                    v({
                        type: "configuring-options",
                        schema: C.plugin.manifest.userConfig
                    })
                }
            });
            i6.push({
                label: "Update now",
                action: () => void q8("update")
            }), i6.push({
                label: "Uninstall",
                action: () => void q8("uninstall")
            })
        }
        if (C.plugin.manifest.homepage) i6.push({
            label: "Open homepage",
            action: () => void J3(C.plugin.manifest.homepage)
        });
        if (C.plugin.manifest.repository) i6.push({
            label: "View repository",
            action: () => void J3(C.plugin.manifest.repository)
        });
        return i6.push({
            label: "Back to plugin list",
            action: () => {
                v("plugin-list"), x(null), L6(null)
            }
        }), i6
    }, [f, C, R6, S, $6, q6]);
    L7({
        "select:previous": () => {
            if (f6 > 0) G6(f6 - 1)
        },
        "select:next": () => {
            if (f6 < Q6.length - 1) G6(f6 + 1)
        },
        "select:accept": () => {
            if (Q6[f6]) Q6[f6].action()
        }
    }, {
        context: "Select",
        isActive: f === "plugin-details" && !!C
    }), L7({
        "select:accept": () => {
            if (typeof f === "object" && f.type === "failed-plugin-details")(async () => {
                T6(!0), L6(null);
                let h6 = f.plugin.id,
                    _8 = f.plugin.scope,
                    R8 = Rx6(_8) ? await ie(h6, _8, !1) : await ie(h6, "user", !1),
                    x6 = R8.success;
                if (!x6) {
                    for (let i6 of $v) {
                        let v8 = E1(i6);
                        if (v8?.enabledPlugins?.[h6] !== void 0) P7(i6, {
                            enabledPlugins: {
                                ...v8.enabledPlugins,
                                [h6]: void 0
                            }
                        }), x6 = !0
                    }
                    YO()
                }
                if (x6) {
                    if (_) await _();
                    T6(!1), v("plugin-list")
                } else T6(!1), L6(R8.message)
            })()
        }
    }, {
        context: "Select",
        isActive: typeof f === "object" && f.type === "failed-plugin-details" && f.plugin.scope !== "managed"
    }), L7({
        "confirm:yes": () => {
            if (!C) return;
            T6(!0), L6(null);
            let h6 = `${C.plugin.name}@${C.marketplace}`,
                {
                    error: _8
                } = P7("localSettings", {
                    enabledPlugins: {
                        ...E1("localSettings")?.enabledPlugins,
                        [h6]: !1
                    }
                });
            if (_8) {
                T6(!1), L6(`Failed to write settings: ${_8.message}`);
                return
            }
            if (YO(), K(`✓ Disabled ${C.plugin.name} in .claude/settings.local.json. Run /reload-plugins to apply.`), _) _();
            q({
                type: "menu"
            })
        },
        "confirm:no": () => {
            v("plugin-details"), L6(null)
        }
    }, {
        context: "Confirmation",
        isActive: f === "confirm-project-uninstall" && !!C && !k6
    });

    function W8(h6) {
        if (h6.ctrl || h6.meta || k6) return;
        if (!C) return;
        let _8 = `${C.plugin.name}@${C.marketplace}`,
            R8 = C.scope;
        if (!R8 || R8 === "builtin" || !Rx6(R8)) return;
        let x6 = async (i6) => {
            T6(!0), L6(null);
            try {
                let v8 = await ie(_8, R8, i6);
                if (!v8.success) throw Error(v8.message);
                YO();
                let f1 = i6 ? "" : " · data preserved";
                if (K(`${e6.tick} ${v8.message}${f1}`), _) _();
                q({
                    type: "menu"
                })
            } catch (v8) {
                T6(!1), L6(v8 instanceof Error ? v8.message : String(v8))
            }
        };
        if (h6.key === "y" || h6.key === "Y") h6.preventDefault(), x6(!0);
        else if (h6.key === "n" || h6.key === "N") h6.preventDefault(), x6(!1);
        else if (h6.key === "escape") h6.preventDefault(), v("plugin-details"), L6(null)
    }
    E8.useEffect(() => {
        X6(0)
    }, [V]);

    function G8(h6) {
        if (J) {
            R(h6);
            return
        }
        if (h6.ctrl || h6.meta) return;
        if (h6.key === "/") h6.preventDefault(), M(!0), k(""), X6(0);
        else if (h6.key.length === 1 && h6.key !== " ") h6.preventDefault(), M(!0), k(h6.key), X6(0)
    }

    function s6(h6) {
        if (J) {
            h(h6);
            return
        }
        let _8 = (h6.text.split(/\r\n|\r|\n/, 2)[0] ?? "").trim();
        if (!_8) return;
        h6.preventDefault(), M(!0), k(_8), X6(0)
    }
    if (U) return E8.createElement(T, null, "Loading installed plugins…");
    if (O6.length === 0) return E8.createElement(u, {
        flexDirection: "column"
    }, E8.createElement(u, {
        marginBottom: 1
    }, E8.createElement(T, {
        bold: !0
    }, "Manage plugins")), E8.createElement(T, null, "No plugins or MCP servers installed."), E8.createElement(u, {
        marginTop: 1
    }, E8.createElement(T, {
        dimColor: !0
    }, E8.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    }))));
    if (typeof f === "object" && f.type === "plugin-options" && C) {
        let _8 = function(R8) {
                if (K(R8), _) _();
                q({
                    type: "menu"
                })
            },
            h6 = `${C.plugin.name}@${C.marketplace}`;
        return E8.createElement(yx6, {
            plugin: C.plugin,
            pluginId: h6,
            onDone: (R8, x6) => {
                switch (R8) {
                    case "configured":
                        _8(`✓ Enabled and configured ${C.plugin.name}. Run /reload-plugins to apply.`);
                        break;
                    case "skipped":
                        _8(`✓ Enabled ${C.plugin.name}. Run /reload-plugins to apply.`);
                        break;
                    case "error":
                        _8(`Failed to save configuration: ${x6}`);
                        break
                }
            }
        })
    }
    if (typeof f === "object" && f.type === "configuring-options" && C) {
        let h6 = `${C.plugin.name}@${C.marketplace}`;
        return E8.createElement(P_8, {
            title: `Configure ${C.plugin.name}`,
            subtitle: "Plugin options",
            configSchema: f.schema,
            initialValues: ID(h6),
            onSave: (_8) => {
                try {
                    Tb8(h6, _8, f.schema), YO(), K("Configuration saved. Run /reload-plugins for changes to take effect.")
                } catch (R8) {
                    L6(`Failed to save configuration: ${b6(R8)}`)
                }
                v("plugin-details")
            },
            onCancel: () => v("plugin-details")
        })
    }
    if (f === "configuring" && y6 && C) {
        let R8 = function() {
                c6(null), v("plugin-details")
            },
            h6 = `${C.plugin.name}@${C.marketplace}`;
        async function _8(x6) {
            if (!y6 || !C) return;
            try {
                let i6 = C.plugin.manifest.mcpServers,
                    v8 = null;
                if (typeof i6 === "string" && Zx(i6)) v8 = i6;
                else if (Array.isArray(i6)) {
                    for (let f1 of i6)
                        if (typeof f1 === "string" && Zx(f1)) {
                            v8 = f1;
                            break
                        }
                }
                if (!v8) {
                    L6("No MCPB file found"), v("plugin-details");
                    return
                }
                await P88(v8, C.plugin.path, h6, void 0, x6), L6(null), c6(null), v("plugin-details"), K("Configuration saved. Run /reload-plugins for changes to take effect.")
            } catch (i6) {
                let v8 = b6(i6);
                L6(`Failed to save configuration: ${v8}`), v("plugin-details")
            }
        }
        return E8.createElement(P_8, {
            title: `Configure ${y6.manifest.name}`,
            subtitle: `Plugin: ${C.plugin.name}`,
            configSchema: y6.configSchema,
            initialValues: y6.existingConfig,
            onSave: _8,
            onCancel: R8
        })
    }
    if (typeof f === "object" && f.type === "flagged-detail") {
        let h6 = f.plugin;
        return E8.createElement(u, {
            flexDirection: "column"
        }, E8.createElement(u, null, E8.createElement(T, {
            bold: !0
        }, h6.name, " @ ", h6.marketplace)), E8.createElement(u, {
            marginBottom: 1
        }, E8.createElement(T, {
            dimColor: !0
        }, "Status: "), E8.createElement(T, {
            color: "error"
        }, "Removed")), E8.createElement(u, {
            marginBottom: 1,
            flexDirection: "column"
        }, E8.createElement(T, {
            color: "error"
        }, "Removed from marketplace · reason: ", h6.reason), E8.createElement(T, null, h6.text), E8.createElement(T, {
            dimColor: !0
        }, "Flagged on ", new Date(h6.flaggedAt).toLocaleDateString())), E8.createElement(u, {
            marginTop: 1,
            flexDirection: "column"
        }, E8.createElement(u, null, E8.createElement(T, null, e6.pointer, " "), E8.createElement(T, {
            color: "suggestion"
        }, "Dismiss"))), E8.createElement(z1, null, E8.createElement(v1, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "dismiss"
        }), E8.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "back"
        })))
    }
    if (f === "confirm-project-uninstall" && C) return E8.createElement(u, {
        flexDirection: "column"
    }, E8.createElement(T, {
        bold: !0,
        color: "warning"
    }, C.plugin.name, " is enabled in .claude/settings.json (shared with your team)"), E8.createElement(u, {
        marginTop: 1,
        flexDirection: "column"
    }, E8.createElement(T, null, "Disable it just for you in .claude/settings.local.json?"), E8.createElement(T, {
        dimColor: !0
    }, "This has the same effect as uninstalling, without affecting other contributors.")), v6 && E8.createElement(u, {
        marginTop: 1
    }, E8.createElement(T, {
        color: "error"
    }, v6)), E8.createElement(u, {
        marginTop: 1
    }, k6 ? E8.createElement(T, {
        dimColor: !0
    }, "Disabling…") : E8.createElement(z1, null, E8.createElement(v1, {
        action: "confirm:yes",
        context: "Confirmation",
        fallback: "y",
        description: "disable"
    }), E8.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))));
    if (typeof f === "object" && f.type === "confirm-data-cleanup" && C) return E8.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: W8
    }, E8.createElement(T, {
        bold: !0
    }, C.plugin.name, " has ", f.size.human, " of persistent data"), E8.createElement(u, {
        marginTop: 1,
        flexDirection: "column"
    }, E8.createElement(T, null, "Delete it along with the plugin?"), E8.createElement(T, {
        dimColor: !0
    }, K68(`${C.plugin.name}@${C.marketplace}`))), v6 && E8.createElement(u, {
        marginTop: 1
    }, E8.createElement(T, {
        color: "error"
    }, v6)), E8.createElement(u, {
        marginTop: 1
    }, k6 ? E8.createElement(T, {
        dimColor: !0
    }, "Uninstalling…") : E8.createElement(T, null, E8.createElement(T, {
        bold: !0
    }, "y"), " to delete · ", E8.createElement(T, {
        bold: !0
    }, "n"), " to keep ·", " ", E8.createElement(T, {
        bold: !0
    }, "esc"), " to cancel")));
    if (f === "plugin-details" && C) {
        let h6 = y7(),
            _8 = `${C.plugin.name}@${C.marketplace}`,
            R8 = h6?.enabledPlugins?.[_8] !== !1,
            x6 = j.filter((v8) => ("plugin" in v8) && v8.plugin === C.plugin.name || v8.source === _8 || v8.source.startsWith(`${C.plugin.name}@`)),
            i6 = x6.length === 0 ? null : E8.createElement(u, {
                flexDirection: "column",
                marginBottom: 1
            }, E8.createElement(T, {
                bold: !0,
                color: "error"
            }, x6.length, " ", O7(x6.length, "error"), ":"), x6.map((v8, f1) => {
                let g8 = ux6(v8);
                return E8.createElement(u, {
                    key: f1,
                    flexDirection: "column",
                    marginLeft: 2
                }, E8.createElement(T, {
                    color: "error"
                }, g_6(v8)), g8 && E8.createElement(T, {
                    dimColor: !0,
                    italic: !0
                }, e6.arrowRight, " ", g8))
            }));
        return E8.createElement(u, {
            flexDirection: "column"
        }, E8.createElement(u, null, E8.createElement(T, {
            bold: !0
        }, C.plugin.name, " @ ", C.marketplace)), E8.createElement(u, null, E8.createElement(T, {
            dimColor: !0
        }, "Scope: "), E8.createElement(T, null, C.scope || "user")), C.plugin.manifest.version && E8.createElement(u, null, E8.createElement(T, {
            dimColor: !0
        }, "Version: "), E8.createElement(T, null, C.plugin.manifest.version)), C.plugin.manifest.description && E8.createElement(u, {
            marginBottom: 1
        }, E8.createElement(T, null, C.plugin.manifest.description)), C.plugin.manifest.author && E8.createElement(u, null, E8.createElement(T, {
            dimColor: !0
        }, "Author: "), E8.createElement(T, null, C.plugin.manifest.author.name)), E8.createElement(u, {
            marginBottom: 1
        }, E8.createElement(T, {
            dimColor: !0
        }, "Status: "), E8.createElement(T, {
            color: R8 ? "success" : "warning"
        }, R8 ? "Enabled" : "Disabled"), C.pendingUpdate && E8.createElement(T, {
            color: "suggestion"
        }, " · Marked for update")), E8.createElement(yxY, {
            plugin: C.plugin,
            marketplace: C.marketplace
        }), i6, E8.createElement(u, {
            marginTop: 1,
            flexDirection: "column"
        }, Q6.map((v8, f1) => {
            let g8 = f1 === f6;
            return E8.createElement(u, {
                key: f1
            }, g8 && E8.createElement(T, null, e6.pointer, " "), !g8 && E8.createElement(T, null, "  "), E8.createElement(T, {
                bold: g8,
                color: v8.label.includes("Uninstall") ? "error" : v8.label.includes("Update") ? "suggestion" : void 0
            }, v8.label))
        })), k6 && E8.createElement(u, {
            marginTop: 1
        }, E8.createElement(T, null, "Processing…")), v6 && E8.createElement(u, {
            marginTop: 1
        }, E8.createElement(T, {
            color: "error"
        }, v6)), E8.createElement(u, {
            marginTop: 1
        }, E8.createElement(T, {
            dimColor: !0,
            italic: !0
        }, E8.createElement(z1, null, E8.createElement(v1, {
            action: "select:previous",
            context: "Select",
            fallback: "↑",
            description: "navigate"
        }), E8.createElement(v1, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "select"
        }), E8.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "back"
        })))))
    }
    if (typeof f === "object" && f.type === "failed-plugin-details") {
        let h6 = f.plugin,
            _8 = h6.errors[0],
            R8 = _8 ? g_6(_8) : "Failed to load";
        return E8.createElement(u, {
            flexDirection: "column"
        }, E8.createElement(T, null, E8.createElement(T, {
            bold: !0
        }, h6.name), E8.createElement(T, {
            dimColor: !0
        }, " @ ", h6.marketplace), E8.createElement(T, {
            dimColor: !0
        }, " (", h6.scope, ")")), E8.createElement(T, {
            color: "error"
        }, R8), h6.scope === "managed" ? E8.createElement(u, {
            marginTop: 1
        }, E8.createElement(T, {
            dimColor: !0
        }, "Managed by your organization — contact your admin")) : E8.createElement(u, {
            marginTop: 1
        }, E8.createElement(T, {
            color: "suggestion"
        }, e6.pointer, " "), E8.createElement(T, {
            bold: !0
        }, "Remove")), k6 && E8.createElement(T, null, "Processing…"), v6 && E8.createElement(T, {
            color: "error"
        }, v6), E8.createElement(u, {
            marginTop: 1
        }, E8.createElement(T, {
            dimColor: !0,
            italic: !0
        }, E8.createElement(z1, null, h6.scope !== "managed" && E8.createElement(v1, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "remove"
        }), E8.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "back"
        })))))
    }
    if (typeof f === "object" && f.type === "mcp-detail") {
        let h6 = f.client,
            _8 = Ll($, h6.name).length,
            R8 = () => {
                v({
                    type: "mcp-tools",
                    client: h6
                })
            },
            x6 = () => {
                v("plugin-list")
            },
            i6 = (g8) => {
                if (g8) K(g8);
                v("plugin-list")
            },
            v8 = h6.config.scope,
            f1 = h6.config.type;
        if (f1 === "stdio") {
            let g8 = {
                name: h6.name,
                client: h6,
                scope: v8,
                transport: "stdio",
                config: h6.config
            };
            return E8.createElement(j_8, {
                server: g8,
                serverToolsCount: _8,
                onViewTools: R8,
                onCancel: x6,
                onComplete: i6,
                borderless: !0
            })
        } else if (f1 === "sse") {
            let g8 = {
                name: h6.name,
                client: h6,
                scope: v8,
                transport: "sse",
                isAuthenticated: void 0,
                config: h6.config
            };
            return E8.createElement(FP6, {
                server: g8,
                serverToolsCount: _8,
                onViewTools: R8,
                onCancel: x6,
                onComplete: i6,
                borderless: !0
            })
        } else if (f1 === "http") {
            let g8 = {
                name: h6.name,
                client: h6,
                scope: v8,
                transport: "http",
                isAuthenticated: void 0,
                config: h6.config
            };
            return E8.createElement(FP6, {
                server: g8,
                serverToolsCount: _8,
                onViewTools: R8,
                onCancel: x6,
                onComplete: i6,
                borderless: !0
            })
        } else if (f1 === "claudeai-proxy") {
            let g8 = {
                name: h6.name,
                client: h6,
                scope: v8,
                transport: "claudeai-proxy",
                isAuthenticated: void 0,
                config: h6.config
            };
            return E8.createElement(FP6, {
                server: g8,
                serverToolsCount: _8,
                onViewTools: R8,
                onCancel: x6,
                onComplete: i6,
                borderless: !0
            })
        }
        return v("plugin-list"), null
    }
    if (typeof f === "object" && f.type === "mcp-tools") {
        let h6 = f.client,
            _8 = h6.config.scope,
            R8 = h6.config.type,
            x6;
        if (R8 === "stdio") x6 = {
            name: h6.name,
            client: h6,
            scope: _8,
            transport: "stdio",
            config: h6.config
        };
        else if (R8 === "sse") x6 = {
            name: h6.name,
            client: h6,
            scope: _8,
            transport: "sse",
            isAuthenticated: void 0,
            config: h6.config
        };
        else if (R8 === "http") x6 = {
            name: h6.name,
            client: h6,
            scope: _8,
            transport: "http",
            isAuthenticated: void 0,
            config: h6.config
        };
        else x6 = {
            name: h6.name,
            client: h6,
            scope: _8,
            transport: "claudeai-proxy",
            isAuthenticated: void 0,
            config: h6.config
        };
        return E8.createElement(J_8, {
            server: x6,
            onSelectTool: (i6) => {
                v({
                    type: "mcp-tool-detail",
                    client: h6,
                    tool: i6
                })
            },
            onBack: () => v({
                type: "mcp-detail",
                client: h6
            })
        })
    }
    if (typeof f === "object" && f.type === "mcp-tool-detail") {
        let {
            client: h6,
            tool: _8
        } = f, R8 = h6.config.scope, x6 = h6.config.type, i6;
        if (x6 === "stdio") i6 = {
            name: h6.name,
            client: h6,
            scope: R8,
            transport: "stdio",
            config: h6.config
        };
        else if (x6 === "sse") i6 = {
            name: h6.name,
            client: h6,
            scope: R8,
            transport: "sse",
            isAuthenticated: void 0,
            config: h6.config
        };
        else if (x6 === "http") i6 = {
            name: h6.name,
            client: h6,
            scope: R8,
            transport: "http",
            isAuthenticated: void 0,
            config: h6.config
        };
        else i6 = {
            name: h6.name,
            client: h6,
            scope: R8,
            transport: "claudeai-proxy",
            isAuthenticated: void 0,
            config: h6.config
        };
        return E8.createElement(H_8, {
            tool: _8,
            server: i6,
            onBack: () => v({
                type: "mcp-tools",
                client: h6
            })
        })
    }
    let u6 = V6.getVisibleItems(r);
    return E8.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: G8,
        onPaste: s6
    }, E8.createElement(u, {
        marginBottom: 1
    }, E8.createElement(wg, {
        query: V,
        isFocused: J,
        isTerminalFocused: P,
        width: Z - 4,
        cursorOffset: N
    })), r.length === 0 && V && E8.createElement(u, {
        marginBottom: 1
    }, E8.createElement(T, {
        dimColor: !0
    }, 'No items match "', V, '"')), V6.scrollPosition.canScrollUp && E8.createElement(u, null, E8.createElement(T, {
        dimColor: !0
    }, " ", e6.arrowUp, " more above")), u6.map((h6, _8) => {
        let R8 = V6.toActualIndex(_8),
            x6 = R8 === Y6 && !J;
        switch (h6.kind) {
            case "spacer":
                return E8.createElement(u, {
                    key: `spacer:${R8}`,
                    height: 1
                });
            case "section-header":
                return E8.createElement(u, {
                    key: `section:${h6.section}`,
                    paddingLeft: 2
                }, E8.createElement(T, {
                    dimColor: h6.section !== "attention",
                    color: h6.section === "attention" ? "warning" : void 0,
                    bold: !0
                }, h6.section === "attention" ? "Needs attention" : "Favorites"));
            case "scope-header":
                return E8.createElement(u, {
                    key: `scope:${R8}`,
                    paddingLeft: 4
                }, E8.createElement(T, {
                    dimColor: !0
                }, NxY(h6.scope)));
            case "disabled-header":
                return E8.createElement(u, {
                    key: "section:disabled",
                    paddingLeft: 2
                }, E8.createElement(T, {
                    color: x6 ? "suggestion" : void 0
                }, x6 ? `${e6.pointer} ` : "  ", o ? e6.arrowDown : e6.arrowRight, " Show disabled ", E8.createElement(T, {
                    dimColor: !0
                }, "(", h6.count, ")")));
            case "item":
                return E8.createElement(jFK, {
                    key: `${h6.section}:${h6.item.id}`,
                    item: h6.item,
                    isSelected: x6
                })
        }
    }), V6.scrollPosition.canScrollDown && E8.createElement(u, null, E8.createElement(T, {
        dimColor: !0
    }, " ", e6.arrowDown, " more below")), E8.createElement(u, {
        marginTop: 1,
        marginLeft: 1
    }, E8.createElement(T, {
        dimColor: !0,
        italic: !0
    }, E8.createElement(z1, null, E8.createElement(T, null, "type to search"), E8.createElement(v1, {
        action: "plugin:toggle",
        context: "Plugin",
        fallback: "Space",
        description: "toggle"
    }), E8.createElement(v1, {
        action: "plugin:favorite",
        context: "Plugin",
        fallback: "f",
        description: "favorite"
    }), E8.createElement(v1, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "details"
    }), E8.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    })))), c.size > 0 && E8.createElement(u, {
        marginLeft: 1
    }, E8.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "Run /reload-plugins to apply changes")))
}
// @from(Ln 458298, Col 4)
E8
// @from(Ln 458298, Col 8)
C_
// @from(Ln 458299, Col 4)
PFK = L(() => {
    Qq();
    bK();
    Nq();
    Li8();
    hi8();
    Ri8();
    Si8();
    EP6();
    Mk();
    R_6();
    I4();
    g6();
    C7();
    z68();
    B_6();
    iD();
    Ix6();
    N7();
    Nj();
    h1();
    K8();
    m8();
    U8();
    uR();
    yD();
    m$();
    W88();
    Jy();
    di8();
    aW();
    vH();
    Gx();
    AH6();
    X_8();
    aY();
    a1();
    e8();
    Jw7();
    Aw7();
    mi8();
    HFK();
    W_8();
    E8 = K6(P6(), 1), C_ = K6(P6(), 1)
})
// @from(Ln 458345, Col 0)
function WFK(q) {
    if (!q) return {
        type: "menu"
    };
    let K = q.trim().split(/\s+/);
    switch (K[0]?.toLowerCase()) {
        case "help":
        case "--help":
        case "-h":
            return {
                type: "help"
            };
        case "install":
        case "i": {
            let z = K[1];
            if (!z) return {
                type: "install"
            };
            let Y = z.lastIndexOf("@");
            if (Y > 0) {
                let O = z.slice(0, Y),
                    w = z.slice(Y + 1);
                return {
                    type: "install",
                    plugin: O,
                    marketplace: w
                }
            }
            if (!z.startsWith("@") && (z.startsWith("http://") || z.startsWith("https://") || z.startsWith("file://") || z.includes("/") || z.includes("\\"))) return {
                type: "install",
                marketplace: z
            };
            return {
                type: "install",
                plugin: z
            }
        }
        case "manage":
            return {
                type: "manage"
            };
        case "uninstall":
            return {
                type: "uninstall", plugin: K[1]
            };
        case "enable":
            return {
                type: "enable", plugin: K[1]
            };
        case "disable":
            return {
                type: "disable", plugin: K[1]
            };
        case "validate":
            return {
                type: "validate", path: K.slice(1).join(" ").trim() || void 0
            };
        case "marketplace":
        case "market": {
            let z = K[1]?.toLowerCase(),
                Y = K.slice(2).join(" ");
            switch (z) {
                case "add":
                    return {
                        type: "marketplace", action: "add", target: Y
                    };
                case "remove":
                case "rm":
                    return {
                        type: "marketplace", action: "remove", target: Y
                    };
                case "update":
                    return {
                        type: "marketplace", action: "update", target: Y
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
// @from(Ln 458443, Col 0)
function bxY(q) {
    let K = _$.basename(q),
        _ = _$.basename(_$.dirname(q));
    if (K === "plugin.json") return "plugin";
    if (K === "marketplace.json") return "marketplace";
    if (_ === ".claude-plugin") return "plugin";
    return "unknown"
}
// @from(Ln 458452, Col 0)
function Ww7(q) {
    return q.issues.map((K) => ({
        path: K.path.join(".") || "root",
        message: K.message,
        code: K.code
    }))
}
// @from(Ln 458460, Col 0)
function f_8(q, K, _, z) {
    if (q.includes("..")) _.push({
        path: K,
        message: z ? `Path contains "..": ${q}. ${z}` : `Path contains ".." which could be a path traversal attempt: ${q}`
    })
}
// @from(Ln 458467, Col 0)
function IxY(q) {
    let K = q.replace(/^(\.\.\/)+/, "");
    return `Plugin source paths are resolved relative to the marketplace root (the directory containing .claude-plugin/), not relative to marketplace.json. Use "${K!==q?`./${K}`:"./plugins/my-plugin"}" instead of "${q}".`
}
// @from(Ln 458471, Col 0)
async function Mw7(q) {
    let K = [],
        _ = [],
        z = _$.resolve(q),
        Y;
    try {
        Y = await Bx6(z, {
            encoding: "utf-8"
        })
    } catch ($) {
        let j = Q1($),
            H;
        if (j === "ENOENT") H = `File not found: ${z}`;
        else if (j === "EISDIR") H = `Path is not a file: ${z}`;
        else H = `Failed to read file: ${b6($)}`;
        return {
            success: !1,
            errors: [{
                path: "file",
                message: H,
                code: j
            }],
            warnings: [],
            filePath: z,
            fileType: "plugin"
        }
    }
    let A;
    try {
        A = n8(Y)
    } catch ($) {
        return {
            success: !1,
            errors: [{
                path: "json",
                message: `Invalid JSON syntax: ${b6($)}`
            }],
            warnings: [],
            filePath: z,
            fileType: "plugin"
        }
    }
    if (A && typeof A === "object") {
        let $ = A;
        if ($.commands)(Array.isArray($.commands) ? $.commands : [$.commands]).forEach((H, J) => {
            if (typeof H === "string") f_8(H, `commands[${J}]`, K)
        });
        if ($.agents)(Array.isArray($.agents) ? $.agents : [$.agents]).forEach((H, J) => {
            if (typeof H === "string") f_8(H, `agents[${J}]`, K)
        });
        if ($.skills)(Array.isArray($.skills) ? $.skills : [$.skills]).forEach((H, J) => {
            if (typeof H === "string") f_8(H, `skills[${J}]`, K)
        })
    }
    let O = A;
    if (typeof A === "object" && A !== null) {
        let $ = A,
            j = Object.keys($).filter((H) => CxY.has(H));
        if (j.length > 0) {
            let H = {
                ...$
            };
            for (let J of j) delete H[J], _.push({
                path: J,
                message: `Field '${J}' belongs in the marketplace entry (marketplace.json), ` + "not plugin.json. It's harmless here but unused — Claude Code " + "ignores it at load time."
            });
            O = H
        }
    }
    let w = IQ6().strict().safeParse(O);
    if (!w.success) K.push(...Ww7(w.error));
    if (w.success) {
        let $ = w.data;
        if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test($.name)) _.push({
            path: "name",
            message: `Plugin name "${$.name}" is not kebab-case. Claude Code accepts it, but the Claude.ai marketplace sync requires kebab-case (lowercase letters, digits, and hyphens only, e.g., "my-plugin").`
        });
        if (!$.version) _.push({
            path: "version",
            message: 'No version specified. Consider adding a version following semver (e.g., "1.0.0")'
        });
        if (!$.description) _.push({
            path: "description",
            message: "No description provided. Adding a description helps users understand what your plugin does"
        });
        if (!$.author) _.push({
            path: "author",
            message: "No author information provided. Consider adding author details for plugin attribution"
        })
    }
    return {
        success: K.length === 0,
        errors: K,
        warnings: _,
        filePath: z,
        fileType: "plugin"
    }
}
// @from(Ln 458569, Col 0)
async function Pw7(q) {
    let K = [],
        _ = [],
        z = _$.resolve(q),
        Y;
    try {
        Y = await Bx6(z, {
            encoding: "utf-8"
        })
    } catch ($) {
        let j = Q1($),
            H;
        if (j === "ENOENT") H = `File not found: ${z}`;
        else if (j === "EISDIR") H = `Path is not a file: ${z}`;
        else H = `Failed to read file: ${b6($)}`;
        return {
            success: !1,
            errors: [{
                path: "file",
                message: H,
                code: j
            }],
            warnings: [],
            filePath: z,
            fileType: "marketplace"
        }
    }
    let A;
    try {
        A = n8(Y)
    } catch ($) {
        return {
            success: !1,
            errors: [{
                path: "json",
                message: `Invalid JSON syntax: ${b6($)}`
            }],
            warnings: [],
            filePath: z,
            fileType: "marketplace"
        }
    }
    if (A && typeof A === "object") {
        let $ = A;
        if (Array.isArray($.plugins)) $.plugins.forEach((j, H) => {
            if (j && typeof j === "object" && "source" in j) {
                let J = j.source;
                if (typeof J === "string") f_8(J, `plugins[${H}].source`, K, IxY(J));
                if (J && typeof J === "object" && "path" in J && typeof J.path === "string") f_8(J.path, `plugins[${H}].source.path`, K)
            }
        })
    }
    let w = g16().extend({
        plugins: y.array(MO1().strict())
    }).strict().safeParse(A);
    if (!w.success) K.push(...Ww7(w.error));
    if (w.success) {
        let $ = w.data;
        if (!$.plugins || $.plugins.length === 0) _.push({
            path: "plugins",
            message: "Marketplace has no plugins defined"
        });
        if ($.plugins) {
            $.plugins.forEach((J, X) => {
                if ($.plugins.filter((P) => P.name === J.name).length > 1) K.push({
                    path: `plugins[${X}].name`,
                    message: `Duplicate plugin name "${J.name}" found in marketplace`
                })
            });
            let j = _$.dirname(z),
                H = _$.basename(j) === ".claude-plugin" ? _$.dirname(j) : j;
            for (let [J, X] of $.plugins.entries()) {
                if (!X.version || typeof X.source !== "string" || !X.source.startsWith("./")) continue;
                let M = _$.join(H, X.source),
                    P = _$.join(M, ".claude-plugin", "plugin.json"),
                    W;
                try {
                    let D = await Bx6(P, {
                        encoding: "utf-8"
                    });
                    try {
                        let Z = n8(D);
                        if (typeof Z.version === "string") W = Z.version
                    } catch (Z) {
                        _.push({
                            path: `plugins[${J}].source`,
                            message: `Could not parse ${_$.relative(H,P)} for version cross-check: ${b6(Z)}`
                        })
                    }
                } catch (D) {
                    if (!t1(D) && Q1(D) !== "ENOTDIR") _.push({
                        path: `plugins[${J}].source`,
                        message: `Could not read ${_$.relative(H,P)} for version cross-check: ${b6(D)}`
                    })
                }
                if (W && W !== X.version) {
                    let D = _$.relative(H, P);
                    _.push({
                        path: `plugins[${J}].version`,
                        message: `Entry declares version "${X.version}" but ${D} says "${W}". ` + "At install time, plugin.json wins (calculatePluginVersion precedence) — the entry version is silently ignored. " + `Update this entry to "${W}" to match.`
                    })
                }
            }
        }
        if (!$.metadata?.description) _.push({
            path: "metadata.description",
            message: "No marketplace description provided. Adding a description helps users understand what this marketplace offers"
        })
    }
    return {
        success: K.length === 0,
        errors: K,
        warnings: _,
        filePath: z,
        fileType: "marketplace"
    }
}
// @from(Ln 458687, Col 0)
function xxY(q, K, _) {
    let z = [],
        Y = [],
        A = K.match(zy6);
    if (!A) return Y.push({
        path: "frontmatter",
        message: "No frontmatter block found. Add YAML frontmatter between --- delimiters at the top of the file to set description and other metadata."
    }), {
        success: !0,
        errors: z,
        warnings: Y,
        filePath: q,
        fileType: _
    };
    let O = A[1] || "",
        w;
    try {
        w = yt6(O)
    } catch (J) {
        return z.push({
            path: "frontmatter",
            message: `YAML frontmatter failed to parse: ${b6(J)}. At runtime this ${_} loads with empty metadata (all frontmatter fields silently dropped).`
        }), {
            success: !1,
            errors: z,
            warnings: Y,
            filePath: q,
            fileType: _
        }
    }
    if (w === null || typeof w !== "object" || Array.isArray(w)) return z.push({
        path: "frontmatter",
        message: `Frontmatter must be a YAML mapping (key: value pairs), got ${Array.isArray(w)?"an array":w===null?"null":typeof w}.`
    }), {
        success: !1,
        errors: z,
        warnings: Y,
        filePath: q,
        fileType: _
    };
    let $ = w;
    if ($.description !== void 0) {
        let J = $.description;
        if (typeof J !== "string" && typeof J !== "number" && typeof J !== "boolean" && J !== null) z.push({
            path: "description",
            message: `description must be a string, got ${Array.isArray(J)?"array":typeof J}. At runtime this value is dropped.`
        })
    } else Y.push({
        path: "description",
        message: `No description in frontmatter. A description helps users and Claude understand when to use this ${_}.`
    });
    if ($.name !== void 0 && $.name !== null && typeof $.name !== "string") z.push({
        path: "name",
        message: `name must be a string, got ${typeof $.name}.`
    });
    let j = $["allowed-tools"];
    if (j !== void 0 && j !== null) {
        if (typeof j !== "string" && !Array.isArray(j)) z.push({
            path: "allowed-tools",
            message: `allowed-tools must be a string or array of strings, got ${typeof j}.`
        });
        else if (Array.isArray(j) && j.some((J) => typeof J !== "string")) z.push({
            path: "allowed-tools",
            message: "allowed-tools array must contain only strings."
        })
    }
    let H = $.shell;
    if (H !== void 0 && H !== null)
        if (typeof H !== "string") z.push({
            path: "shell",
            message: `shell must be a string, got ${typeof H}.`
        });
        else {
            let J = H.trim().toLowerCase();
            if (J !== "bash" && J !== "powershell") z.push({
                path: "shell",
                message: `shell must be 'bash' or 'powershell', got '${H}'.`
            })
        } return {
        success: z.length === 0,
        errors: z,
        warnings: Y,
        filePath: q,
        fileType: _
    }
}
// @from(Ln 458773, Col 0)
async function uxY(q) {
    let K;
    try {
        K = await Bx6(q, {
            encoding: "utf-8"
        })
    } catch (Y) {
        if (Q1(Y) === "ENOENT") return {
            success: !0,
            errors: [],
            warnings: [],
            filePath: q,
            fileType: "hooks"
        };
        return {
            success: !1,
            errors: [{
                path: "file",
                message: `Failed to read file: ${b6(Y)}`
            }],
            warnings: [],
            filePath: q,
            fileType: "hooks"
        }
    }
    let _;
    try {
        _ = n8(K)
    } catch (Y) {
        return {
            success: !1,
            errors: [{
                path: "json",
                message: `Invalid JSON syntax: ${b6(Y)}. At runtime this breaks the entire plugin load.`
            }],
            warnings: [],
            filePath: q,
            fileType: "hooks"
        }
    }
    let z = WX8().safeParse(_);
    if (!z.success) return {
        success: !1,
        errors: Ww7(z.error),
        warnings: [],
        filePath: q,
        fileType: "hooks"
    };
    return {
        success: !0,
        errors: [],
        warnings: [],
        filePath: q,
        fileType: "hooks"
    }
}
// @from(Ln 458829, Col 0)
async function DFK(q, K) {
    let _;
    try {
        _ = await RxY(q, {
            withFileTypes: !0
        })
    } catch (Y) {
        let A = Q1(Y);
        if (A === "ENOENT" || A === "ENOTDIR") return [];
        throw Y
    }
    if (K) return _.filter((Y) => Y.isDirectory()).map((Y) => _$.join(q, Y.name, "SKILL.md"));
    let z = [];
    for (let Y of _) {
        let A = _$.join(q, Y.name);
        if (Y.isDirectory()) z.push(...await DFK(A, !1));
        else if (Y.isFile() && Y.name.toLowerCase().endsWith(".md")) z.push(A)
    }
    return z
}
// @from(Ln 458849, Col 0)
async function ZFK(q) {
    let K = [],
        _ = [
            ["skill", _$.join(q, "skills")],
            ["agent", _$.join(q, "agents")],
            ["command", _$.join(q, "commands")]
        ];
    for (let [Y, A] of _) {
        let O = await DFK(A, Y === "skill");
        for (let w of O) {
            let $;
            try {
                $ = await Bx6(w, {
                    encoding: "utf-8"
                })
            } catch (H) {
                if (t1(H)) continue;
                K.push({
                    success: !1,
                    errors: [{
                        path: "file",
                        message: `Failed to read: ${b6(H)}`
                    }],
                    warnings: [],
                    filePath: w,
                    fileType: Y
                });
                continue
            }
            let j = xxY(w, $, Y);
            if (j.errors.length > 0 || j.warnings.length > 0) K.push(j)
        }
    }
    let z = await uxY(_$.join(q, "hooks", "hooks.json"));
    if (z.errors.length > 0 || z.warnings.length > 0) K.push(z);
    return K
}
// @from(Ln 458886, Col 0)
async function ci8(q) {
    let K = _$.resolve(q),
        _ = null;
    try {
        _ = await SxY(K)
    } catch (Y) {
        if (!t1(Y)) throw Y
    }
    if (_?.isDirectory()) {
        let Y = _$.join(K, ".claude-plugin", "marketplace.json"),
            A = await Pw7(Y),
            O = A.errors[0]?.code;
        if (O !== "ENOENT" && O !== "ENOTDIR") return A;
        let w = _$.join(K, ".claude-plugin", "plugin.json"),
            $ = await Mw7(w),
            j = $.errors[0]?.code;
        if (j !== "ENOENT" && j !== "ENOTDIR") return $;
        return {
            success: !1,
            errors: [{
                path: "directory",
                message: "No manifest found in directory. Expected .claude-plugin/marketplace.json or .claude-plugin/plugin.json"
            }],
            warnings: [],
            filePath: K,
            fileType: "plugin"
        }
    }
    switch (bxY(q)) {
        case "plugin":
            return Mw7(q);
        case "marketplace":
            return Pw7(q);
        case "unknown": {
            try {
                let Y = await Bx6(K, {
                        encoding: "utf-8"
                    }),
                    A = n8(Y);
                if (Array.isArray(A.plugins)) return Pw7(q)
            } catch (Y) {
                if (Q1(Y) === "ENOENT") return {
                    success: !1,
                    errors: [{
                        path: "file",
                        message: `File not found: ${K}`
                    }],
                    warnings: [],
                    filePath: K,
                    fileType: "plugin"
                }
            }
            return Mw7(q)
        }
    }
}
// @from(Ln 458942, Col 4)
CxY
// @from(Ln 458943, Col 4)
Dw7 = L(() => {
    p7();
    m8();
    Lf();
    e8();
    Hv();
    CxY = new Set(["category", "source", "tags", "strict", "id"])
})
// @from(Ln 458952, Col 0)
function GFK(q) {
    let K = s(5),
        {
            onComplete: _,
            path: z
        } = q,
        Y, A;
    if (K[0] !== _ || K[1] !== z) Y = () => {
        (async function() {
            if (!z) {
                _(`Usage: /plugin validate <path>

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
                let j = await ci8(z),
                    H = "";
                if (H = H + `Validating ${j.fileType} manifest: ${j.filePath}

`, j.errors.length > 0) H = H + `${e6.cross} Found ${j.errors.length} ${O7(j.errors.length,"error")}:

`, j.errors.forEach((J) => {
                    H = H + `  ${e6.pointer} ${J.path}: ${J.message}
`
                }), H = H + `
`;
                if (j.warnings.length > 0) H = H + `${e6.warning} Found ${j.warnings.length} ${O7(j.warnings.length,"warning")}:

`, j.warnings.forEach((J) => {
                    H = H + `  ${e6.pointer} ${J.path}: ${J.message}
`
                }), H = H + `
`;
                if (j.success) {
                    if (j.warnings.length > 0) H = H + `${e6.tick} Validation passed with warnings
`;
                    else H = H + `${e6.tick} Validation passed
`;
                    process.exitCode = 0
                } else H = H + `${e6.cross} Validation failed
`, process.exitCode = 1;
                _(H)
            } catch (j) {
                let H = j;
                process.exitCode = 2, j6(H), _(`${e6.cross} Unexpected error during validation: ${b6(H)}`)
            }
        })()
    }, A = [_, z], K[0] = _, K[1] = z, K[2] = Y, K[3] = A;
    else Y = K[2], A = K[3];
    fFK.useEffect(Y, A);
    let O;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) O = G_8.createElement(u, {
        flexDirection: "column"
    }, G_8.createElement(T, null, "Running validation...")), K[4] = O;
    else O = K[4];
    return O
}
// @from(Ln 459021, Col 4)
G_8
// @from(Ln 459021, Col 9)
fFK
// @from(Ln 459022, Col 4)
vFK = L(() => {
    o6();
    Qq();
    g6();
    m8();
    U8();
    Dw7();
    G_8 = K6(P6(), 1), fFK = K6(P6(), 1)
})
// @from(Ln 459032, Col 0)
function mxY(q) {
    let K = s(4),
        {
            onComplete: _
        } = q,
        z, Y;
    if (K[0] !== _) z = () => {
        (async function() {
            try {
                let $ = await Dz(),
                    j = Object.keys($);
                if (j.length === 0) _("No marketplaces configured");
                else _(`Configured marketplaces:
${j.map(BxY).join(`
`)}`)
            } catch ($) {
                _(`Error loading marketplaces: ${b6($)}`)
            }
        })()
    }, Y = [_], K[0] = _, K[1] = z, K[2] = Y;
    else z = K[1], Y = K[2];
    HZ.useEffect(z, Y);
    let A;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) A = e1.createElement(T, null, "Loading marketplaces..."), K[3] = A;
    else A = K[3];
    return A
}
// @from(Ln 459060, Col 0)
function BxY(q) {
    return `  • ${q}`
}
// @from(Ln 459064, Col 0)
function pxY() {
    return null
}
// @from(Ln 459068, Col 0)
function Zw7(q) {
    let K = [],
        _ = [{
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
            source: A,
            scope: O
        }
        of _)
        if (E1(A)?.extraKnownMarketplaces?.[q]) K.push({
            source: A,
            scope: O
        });
    let z = E1("policySettings"),
        Y = Boolean(z?.extraKnownMarketplaces?.[q]);
    return {
        editableSources: K,
        isInPolicy: Y
    }
}
// @from(Ln 459097, Col 0)
function TFK(q) {
    let {
        editableSources: K,
        isInPolicy: _
    } = Zw7(q);
    if (K.length > 0) return {
        kind: "remove-extra-marketplace",
        name: q,
        sources: K
    };
    if (_) return {
        kind: "managed-only",
        name: q
    };
    return {
        kind: "navigate",
        tab: "marketplaces",
        viewState: {
            type: "manage-marketplaces",
            targetMarketplace: q,
            action: "remove"
        }
    }
}
// @from(Ln 459122, Col 0)
function FxY(q) {
    return {
        kind: "navigate",
        tab: "installed",
        viewState: {
            type: "manage-plugins",
            targetPlugin: q,
            action: "uninstall"
        }
    }
}
// @from(Ln 459134, Col 0)
function fw7(q) {
    return gxY.has(q.type)
}
// @from(Ln 459138, Col 0)
function Gw7(q) {
    if ("pluginId" in q && q.pluginId) return q.pluginId;
    if ("plugin" in q && q.plugin) return q.plugin;
    if (q.source.includes("@")) return q.source.split("@")[0];
    return
}
// @from(Ln 459145, Col 0)
function UxY(q, K, _, z, Y, A, O) {
    let w = [];
    for (let H of A) {
        let J = "pluginId" in H ? H.pluginId : ("plugin" in H) ? H.plugin : void 0;
        w.push({
            label: J ?? H.source,
            message: g_6(H),
            guidance: "Restart to retry loading plugins",
            action: {
                kind: "none"
            }
        })
    }
    let $ = new Set;
    for (let H of q) {
        $.add(H.name);
        let J = TFK(H.name),
            X = Zw7(H.name),
            M = X.isInPolicy ? "managed" : X.editableSources[0]?.scope;
        w.push({
            label: H.name,
            message: H.error ?? "Installation failed",
            guidance: J.kind === "managed-only" ? "Managed by your organization — contact your admin" : void 0,
            action: J,
            scope: M
        })
    }
    for (let H of K) {
        let J = "marketplace" in H ? H.marketplace : H.source;
        if ($.has(J)) continue;
        $.add(J);
        let X = TFK(J),
            M = Zw7(J),
            P = M.isInPolicy ? "managed" : M.editableSources[0]?.scope;
        w.push({
            label: J,
            message: g_6(H),
            guidance: X.kind === "managed-only" ? "Managed by your organization — contact your admin" : ux6(H),
            action: X,
            scope: P
        })
    }
    for (let H of Y) {
        if ($.has(H.name)) continue;
        $.add(H.name), w.push({
            label: H.name,
            message: H.error,
            action: {
                kind: "remove-installed-marketplace",
                name: H.name
            }
        })
    }
    let j = new Set;
    for (let H of _) {
        let J = Gw7(H);
        if (J && j.has(J)) continue;
        if (J) j.add(J);
        let X = "marketplace" in H ? H.marketplace : void 0,
            M = J ? O.get(H.source) ?? O.get(J) : void 0;
        w.push({
            label: J ? X ? `${J} @ ${X}` : J : H.source,
            message: g_6(H),
            guidance: ux6(H),
            action: J ? FxY(J) : {
                kind: "none"
            },
            scope: M
        })
    }
    for (let H of z) w.push({
        label: H.source,
        message: g_6(H),
        guidance: ux6(H),
        action: {
            kind: "none"
        }
    });
    return w
}
// @from(Ln 459226, Col 0)
function QxY(q, K) {
    for (let {
            source: _
        }
        of K) {
        let z = E1(_);
        if (!z) continue;
        let Y = {};
        if (z.extraKnownMarketplaces?.[q]) Y.extraKnownMarketplaces = {
            ...z.extraKnownMarketplaces,
            [q]: void 0
        };
        if (z.enabledPlugins) {
            let A = `@${q}`,
                O = !1,
                w = {
                    ...z.enabledPlugins
                };
            for (let $ in w)
                if ($.endsWith(A)) w[$] = void 0, O = !0;
            if (O) Y.enabledPlugins = w
        }
        if (Object.keys(Y).length > 0) P7(_, Y)
    }
}
// @from(Ln 459252, Col 0)
function dxY(q) {
    let K = s(26),
        {
            setViewState: _,
            setActiveTab: z,
            markPluginsChanged: Y
        } = q,
        A = M8(sxY),
        O = M8(axY),
        w = R7(),
        [$, j] = HZ.useState(0),
        [H, J] = HZ.useState(null),
        X;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) X = [], K[0] = X;
    else X = K[0];
    let [M, P] = HZ.useState(X), W, D;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) W = () => {
        (async () => {
            try {
                let H6 = await Dz(),
                    {
                        failures: q6
                    } = await Rp(H6);
                P(q6)
            } catch {}
        })()
    }, D = [], K[1] = W, K[2] = D;
    else W = K[1], D = K[2];
    HZ.useEffect(W, D);
    let Z = O.marketplaces.filter(oxY),
        G = new Set(Z.map(rxY)),
        f = A.filter(fw7),
        v = A.filter((H6) => (H6.type === "marketplace-not-found" || H6.type === "marketplace-load-failed" || H6.type === "marketplace-blocked-by-policy") && !G.has(H6.marketplace)),
        V = A.filter(ixY),
        k = A.filter(nxY),
        N = p_6(),
        R = UxY(Z, v, V, k, M, f, N),
        h;
    if (K[3] !== _) h = () => {
        _({
            type: "menu"
        })
    }, K[3] = _, K[4] = h;
    else h = K[4];
    let C;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) C = {
        context: "Confirmation"
    }, K[5] = C;
    else C = K[5];
    G1("confirm:no", h, C);
    let x = () => {
            let H6 = R[$];
            if (!H6) return;
            let {
                action: q6
            } = H6;
            q: switch (q6.kind) {
                case "navigate": {
                    z(q6.tab), _(q6.viewState);
                    break q
                }
                case "remove-extra-marketplace": {
                    let o = q6.sources.map(lxY).join(", ");
                    QxY(q6.name, q6.sources), YO(), w((_6) => ({
                        ..._6,
                        plugins: {
                            ..._6.plugins,
                            errors: _6.plugins.errors.filter((r) => !(("marketplace" in r) && r.marketplace === q6.name)),
                            installationStatus: {
                                ..._6.plugins.installationStatus,
                                marketplaces: _6.plugins.installationStatus.marketplaces.filter((r) => r.name !== q6.name)
                            }
                        }
                    })), J(`${e6.tick} Removed "${q6.name}" from ${o} settings`), Y();
                    break q
                }
                case "remove-installed-marketplace": {
                    (async () => {
                        try {
                            await RI6(q6.name), YO(), P((o) => o.filter((_6) => _6.name !== q6.name)), J(`${e6.tick} Removed marketplace "${q6.name}"`), Y()
                        } catch (o) {
                            let _6 = o;
                            J(`Failed to remove "${q6.name}": ${_6 instanceof Error?_6.message:String(_6)}`)
                        }
                    })();
                    break q
                }
                case "managed-only":
                    break q;
                case "none":
            }
        },
        B;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) B = () => j(cxY), K[6] = B;
    else B = K[6];
    let m = R.length > 0,
        S;
    if (K[7] !== m) S = {
        context: "Select",
        isActive: m
    }, K[7] = m, K[8] = S;
    else S = K[8];
    L7({
        "select:previous": B,
        "select:next": () => j((H6) => Math.min(R.length - 1, H6 + 1)),
        "select:accept": x
    }, S);
    let F = Math.min($, Math.max(0, R.length - 1));
    if (F !== $) j(F);
    let U = R[F]?.action,
        g = U && U.kind !== "none" && U.kind !== "managed-only";
    if (R.length === 0) {
        let H6;
        if (K[9] === Symbol.for("react.memo_cache_sentinel")) H6 = e1.createElement(u, {
            marginLeft: 1
        }, e1.createElement(T, {
            dimColor: !0
        }, "No plugin errors")), K[9] = H6;
        else H6 = K[9];
        let q6;
        if (K[10] === Symbol.for("react.memo_cache_sentinel")) q6 = e1.createElement(u, {
            flexDirection: "column"
        }, H6, e1.createElement(u, {
            marginTop: 1
        }, e1.createElement(T, {
            dimColor: !0,
            italic: !0
        }, e1.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "back"
        })))), K[10] = q6;
        else q6 = K[10];
        return q6
    }
    let c = u,
        n = "column",
        l;
    if (K[11] !== F) l = (H6, q6) => {
        let o = q6 === F;
        return e1.createElement(u, {
            key: q6,
            marginLeft: 1,
            flexDirection: "column",
            marginBottom: 1
        }, e1.createElement(T, null, e1.createElement(T, {
            color: o ? "suggestion" : "error"
        }, o ? e6.pointer : e6.cross, " "), e1.createElement(T, {
            bold: o
        }, H6.label), H6.scope && e1.createElement(T, {
            dimColor: !0
        }, " (", H6.scope, ")")), e1.createElement(u, {
            marginLeft: 3
        }, e1.createElement(T, {
            color: "error"
        }, H6.message)), H6.guidance && e1.createElement(u, {
            marginLeft: 3
        }, e1.createElement(T, {
            dimColor: !0,
            italic: !0
        }, H6.guidance)))
    }, K[11] = F, K[12] = l;
    else l = K[12];
    let z6 = R.map(l),
        A6;
    if (K[13] !== H) A6 = H && e1.createElement(u, {
        marginTop: 1,
        marginLeft: 1
    }, e1.createElement(T, {
        color: "claude"
    }, H)), K[13] = H, K[14] = A6;
    else A6 = K[14];
    let e;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) e = e1.createElement(v1, {
        action: "select:previous",
        context: "Select",
        fallback: "↑",
        description: "navigate"
    }), K[15] = e;
    else e = K[15];
    let i;
    if (K[16] !== g) i = g && e1.createElement(v1, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "resolve"
    }), K[16] = g, K[17] = i;
    else i = K[17];
    let O6;
    if (K[18] === Symbol.for("react.memo_cache_sentinel")) O6 = e1.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    }), K[18] = O6;
    else O6 = K[18];
    let J6;
    if (K[19] !== i) J6 = e1.createElement(u, {
        marginTop: 1
    }, e1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, e1.createElement(z1, null, e, i, O6))), K[19] = i, K[20] = J6;
    else J6 = K[20];
    let $6;
    if (K[21] !== c || K[22] !== z6 || K[23] !== A6 || K[24] !== J6) $6 = e1.createElement(c, {
        flexDirection: n
    }, z6, A6, J6), K[21] = c, K[22] = z6, K[23] = A6, K[24] = J6, K[25] = $6;
    else $6 = K[25];
    return $6
}
// @from(Ln 459465, Col 0)
function cxY(q) {
    return Math.max(0, q - 1)
}
// @from(Ln 459469, Col 0)
function lxY(q) {
    return q.scope
}
// @from(Ln 459473, Col 0)
function nxY(q) {
    if (fw7(q)) return !1;
    if (q.type === "marketplace-not-found" || q.type === "marketplace-load-failed" || q.type === "marketplace-blocked-by-policy") return !1;
    return Gw7(q) === void 0
}
// @from(Ln 459479, Col 0)
function ixY(q) {
    if (fw7(q)) return !1;
    if (q.type === "marketplace-not-found" || q.type === "marketplace-load-failed" || q.type === "marketplace-blocked-by-policy") return !1;
    return Gw7(q) !== void 0
}
// @from(Ln 459485, Col 0)
function rxY(q) {
    return q.name
}
// @from(Ln 459489, Col 0)
function oxY(q) {
    return q.status === "failed"
}
// @from(Ln 459493, Col 0)
function axY(q) {
    return q.plugins.installationStatus
}
// @from(Ln 459497, Col 0)
function sxY(q) {
    return q.plugins.errors
}
// @from(Ln 459501, Col 0)
function txY(q) {
    switch (q.type) {
        case "help":
            return {
                type: "help"
            };
        case "validate":
            return {
                type: "validate", path: q.path
            };
        case "install":
            if (q.marketplace) return {
                type: "browse-marketplace",
                targetMarketplace: q.marketplace,
                targetPlugin: q.plugin
            };
            if (q.plugin) return {
                type: "discover-plugins",
                targetPlugin: q.plugin
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
                type: "manage-plugins", targetPlugin: q.plugin, action: "uninstall"
            };
        case "enable":
            return {
                type: "manage-plugins", targetPlugin: q.plugin, action: "enable"
            };
        case "disable":
            return {
                type: "manage-plugins", targetPlugin: q.plugin, action: "disable"
            };
        case "marketplace":
            if (q.action === "list") return {
                type: "marketplace-list"
            };
            if (q.action === "add") return {
                type: "add-marketplace",
                initialValue: q.target
            };
            if (q.action === "remove") return {
                type: "manage-marketplaces",
                targetMarketplace: q.target,
                action: "remove"
            };
            if (q.action === "update") return {
                type: "manage-marketplaces",
                targetMarketplace: q.target,
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
// @from(Ln 459569, Col 0)
function exY(q) {
    if (q.type === "manage-plugins") return "installed";
    if (q.type === "manage-marketplaces") return "marketplaces";
    return "discover"
}