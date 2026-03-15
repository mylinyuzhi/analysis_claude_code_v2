
// @from(Ln 401764, Col 0)
function Rwq({
    error: A,
    setError: q,
    result: K,
    setResult: Y,
    setViewState: z,
    onInstallComplete: _,
    onSearchModeChange: w,
    targetPlugin: O
}) {
    let [$, H] = $H.useState("plugin-list"), [j, J] = $H.useState(null), [M, D] = $H.useState([]), [X, P] = $H.useState(!0), [W, Z] = $H.useState(null), [G, f] = $H.useState(!1), v = $H.useCallback((i) => {
        f(i), w?.(i)
    }, [w]), {
        query: N,
        setQuery: V,
        cursorOffset: L
    } = Th({
        isActive: $ === "plugin-list" && G && !X,
        onExit: () => {
            v(!1)
        }
    }), h = p_(), {
        columns: R
    } = KA(), u = $H.useMemo(() => {
        if (!N) return M;
        let i = N.toLowerCase();
        return M.filter((l) => l.entry.name.toLowerCase().includes(i) || l.entry.description?.toLowerCase().includes(i) || l.marketplaceName.toLowerCase().includes(i))
    }, [M, N]), [I, g] = $H.useState(0), [B, b] = $H.useState(new Set), [p, Q] = $H.useState(new Set), U = Uv6({
        totalItems: u.length,
        selectedIndex: I
    });
    $H.useEffect(() => {
        g(0)
    }, [N]);
    let [r, e] = $H.useState(0), [Y6, H6] = $H.useState(!1), [J6, K6] = $H.useState(null), [s, X6] = $H.useState(null), [z6, N6] = $H.useState(null);
    $H.useEffect(() => {
        async function i() {
            try {
                let l = await C3(),
                    {
                        marketplaces: q6,
                        failures: w6
                    } = await mI(l),
                    O6 = [];
                for (let {
                        name: T6,
                        data: D6
                    }
                    of q6)
                    if (D6)
                        for (let Q6 of D6.plugins) {
                            let k6 = UB(Q6.name, T6);
                            O6.push({
                                entry: Q6,
                                marketplaceName: T6,
                                pluginId: k6,
                                isInstalled: nW6(k6)
                            })
                        }
                let L6 = O6.filter((T6) => !T6.isInstalled);
                try {
                    let T6 = await cv6();
                    if (Z(T6), T6) L6.sort((D6, Q6) => {
                        let k6 = T6.get(D6.pluginId) ?? 0,
                            Z6 = T6.get(Q6.pluginId) ?? 0;
                        if (k6 !== Z6) return Z6 - k6;
                        return D6.entry.name.localeCompare(Q6.entry.name)
                    });
                    else L6.sort((D6, Q6) => D6.entry.name.localeCompare(Q6.entry.name))
                } catch (T6) {
                    k(`Failed to fetch install counts: ${_1(T6)}`), L6.sort((D6, Q6) => D6.entry.name.localeCompare(Q6.entry.name))
                }
                D(L6);
                let y6 = Object.keys(l).length;
                if (L6.length === 0) {
                    let T6 = await y_4({
                        configuredMarketplaceCount: y6,
                        failedMarketplaceCount: w6.length
                    });
                    N6(T6)
                }
                let G6 = q6.filter((T6) => T6.data !== null).length,
                    R6 = iW6(w6, G6);
                if (R6)
                    if (R6.type === "warning") X6(R6.message + ". Showing available plugins.");
                    else throw Error(R6.message);
                if (O) {
                    let T6 = O6.find((D6) => D6.entry.name === O);
                    if (T6)
                        if (T6.isInstalled) q(`Plugin '${T6.pluginId}' is already installed. Use '/plugin' to manage existing plugins.`);
                        else J(T6), H("plugin-details");
                    else q(`Plugin "${O}" not found in any marketplace`)
                }
            } catch (l) {
                q(l instanceof Error ? l.message : "Failed to load plugins")
            } finally {
                P(!1)
            }
        }
        i()
    }, [q, O]);
    let $6 = async () => {
        if (B.size === 0) return;
        let i = M.filter((O6) => B.has(O6.pluginId));
        Q(new Set(i.map((O6) => O6.pluginId)));
        let l = 0,
            q6 = 0,
            w6 = [];
        for (let O6 of i) {
            let L6 = await qZ6({
                pluginId: O6.pluginId,
                entry: O6.entry,
                marketplaceName: O6.marketplaceName,
                scope: "user"
            });
            if (L6.success) l++;
            else q6++, w6.push({
                name: O6.entry.name,
                reason: L6.error
            })
        }
        if (Q(new Set), b(new Set), HY(), q6 === 0) {
            let O6 = `✓ Installed ${l} plugin${l!==1?"s":""}. Run /reload-plugins to activate.`;
            Y(O6)
        } else if (l === 0) q(`Failed to install: ${lW6(w6,!0)}`);
        else {
            let O6 = `✓ Installed ${l} of ${l+q6} plugins. Failed: ${lW6(w6,!1)}. Run /reload-plugins to activate successfully installed plugins.`;
            Y(O6)
        }
        if (l > 0) {
            if (_) await _()
        }
        z({
            type: "menu"
        })
    }, n = async (i, l = "user") => {
        H6(!0), K6(null);
        let q6 = await qZ6({
            pluginId: i.pluginId,
            entry: i.entry,
            marketplaceName: i.marketplaceName,
            scope: l
        });
        if (q6.success) {
            if (Y(q6.message), _) await _();
            z({
                type: "menu"
            })
        } else H6(!1), K6(q6.error)
    };
    $H.useEffect(() => {
        if (A) Y(A)
    }, [A, Y]), D8("confirm:no", () => {
        H("plugin-list"), J(null)
    }, {
        context: "Confirmation",
        isActive: $ === "plugin-details"
    }), D8("confirm:no", () => {
        z({
            type: "menu"
        })
    }, {
        context: "Confirmation",
        isActive: $ === "plugin-list" && !G
    }), jA((i, l) => {
        let q6 = !l.ctrl && !l.meta;
        if (!G) {
            if (i === "/" && q6) v(!0), V("");
            else if (q6 && i.length > 0 && !/^\s+$/.test(i) && i !== "j" && i !== "k" && i !== "i") v(!0), V(i)
        }
    }, {
        isActive: $ === "plugin-list" && !X
    }), tA({
        "select:previous": () => {
            if (I === 0) v(!0);
            else U.handleSelectionChange(I - 1, g)
        },
        "select:next": () => {
            if (I < u.length - 1) U.handleSelectionChange(I + 1, g)
        },
        "select:accept": () => {
            if (I === u.length && B.size > 0) $6();
            else if (I < u.length) {
                let i = u[I];
                if (i)
                    if (i.isInstalled) z({
                        type: "manage-plugins",
                        targetPlugin: i.entry.name,
                        targetMarketplace: i.marketplaceName
                    });
                    else J(i), H("plugin-details"), e(0), K6(null)
            }
        }
    }, {
        context: "Select",
        isActive: $ === "plugin-list" && !G
    }), tA({
        "plugin:toggle": () => {
            if (I < u.length) {
                let i = u[I];
                if (i && !i.isInstalled) {
                    let l = new Set(B);
                    if (l.has(i.pluginId)) l.delete(i.pluginId);
                    else l.add(i.pluginId);
                    b(l)
                }
            }
        },
        "plugin:install": () => {
            if (B.size > 0) $6()
        }
    }, {
        context: "Plugin",
        isActive: $ === "plugin-list" && !G
    });
    let o = s1.useMemo(() => {
        if (!j) return [];
        let i = j.entry.homepage,
            l = N16(j);
        return dv6(i, l)
    }, [j]);
    if (tA({
            "select:previous": () => {
                if (r > 0) e(r - 1)
            },
            "select:next": () => {
                if (r < o.length - 1) e(r + 1)
            },
            "select:accept": () => {
                if (!j) return;
                let i = o[r]?.action,
                    l = j.entry.homepage,
                    q6 = N16(j);
                if (i === "install-user") n(j, "user");
                else if (i === "install-project") n(j, "project");
                else if (i === "install-local") n(j, "local");
                else if (i === "homepage" && l) R9(l);
                else if (i === "github" && q6) R9(`https://github.com/${q6}`);
                else if (i === "back") H("plugin-list"), J(null)
            }
        }, {
            context: "Select",
            isActive: $ === "plugin-details" && !!j
        }), X) return s1.createElement(T, null, "Loading…");
    if (A) return s1.createElement(T, {
        color: "error"
    }, A);
    if ($ === "plugin-details" && j) {
        let i = j.entry.homepage,
            l = N16(j),
            q6 = dv6(i, l);
        return s1.createElement(m, {
            flexDirection: "column"
        }, s1.createElement(m, {
            marginBottom: 1
        }, s1.createElement(T, {
            bold: !0
        }, "Plugin details")), s1.createElement(m, {
            flexDirection: "column",
            marginBottom: 1
        }, s1.createElement(T, {
            bold: !0
        }, j.entry.name), s1.createElement(T, {
            dimColor: !0
        }, "from ", j.marketplaceName), j.entry.version && s1.createElement(T, {
            dimColor: !0
        }, "Version: ", j.entry.version), j.entry.description && s1.createElement(m, {
            marginTop: 1
        }, s1.createElement(T, null, j.entry.description)), j.entry.author && s1.createElement(m, {
            marginTop: 1
        }, s1.createElement(T, {
            dimColor: !0
        }, "By:", " ", typeof j.entry.author === "string" ? j.entry.author : j.entry.author.name))), s1.createElement(CL1, null), J6 && s1.createElement(m, {
            marginBottom: 1
        }, s1.createElement(T, {
            color: "error"
        }, "Error: ", J6)), s1.createElement(m, {
            flexDirection: "column"
        }, q6.map((w6, O6) => s1.createElement(m, {
            key: w6.action
        }, r === O6 && s1.createElement(T, null, "> "), r !== O6 && s1.createElement(T, null, "  "), s1.createElement(T, {
            bold: r === O6
        }, Y6 && w6.action.startsWith("install-") ? "Installing…" : w6.label)))), s1.createElement(m, {
            marginTop: 1
        }, s1.createElement(T, {
            dimColor: !0
        }, s1.createElement(C8, null, s1.createElement(O8, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "select"
        }), s1.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "back"
        })))))
    }
    if (M.length === 0) return s1.createElement(m, {
        flexDirection: "column"
    }, s1.createElement(m, {
        marginBottom: 1
    }, s1.createElement(T, {
        bold: !0
    }, "Discover plugins")), s1.createElement(riY, {
        reason: z6
    }), s1.createElement(m, {
        marginTop: 1
    }, s1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "Esc to go back")));
    let a = U.getVisibleItems(u);
    return s1.createElement(m, {
        flexDirection: "column"
    }, s1.createElement(m, null, s1.createElement(T, {
        bold: !0
    }, "Discover plugins"), U.needsPagination && s1.createElement(T, {
        dimColor: !0
    }, " ", "(", U.scrollPosition.current, "/", U.scrollPosition.total, ")")), s1.createElement(m, {
        marginBottom: 1
    }, s1.createElement(fh, {
        query: N,
        isFocused: G,
        isTerminalFocused: h,
        width: R - 4,
        cursorOffset: L
    })), s && s1.createElement(m, {
        marginBottom: 1
    }, s1.createElement(T, {
        color: "warning"
    }, a6.warning, " ", s)), u.length === 0 && N && s1.createElement(m, {
        marginBottom: 1
    }, s1.createElement(T, {
        dimColor: !0
    }, 'No plugins match "', N, '"')), U.scrollPosition.canScrollUp && s1.createElement(m, null, s1.createElement(T, {
        dimColor: !0
    }, " ", a6.arrowUp, " more above")), a.map((i, l) => {
        let q6 = U.toActualIndex(l),
            w6 = I === q6,
            O6 = B.has(i.pluginId),
            L6 = p.has(i.pluginId),
            y6 = l === a.length - 1;
        return s1.createElement(m, {
            key: `${U.startIndex}-${i.pluginId}`,
            flexDirection: "column",
            marginBottom: y6 && !A ? 0 : 1
        }, s1.createElement(m, null, s1.createElement(T, {
            color: w6 && !G ? "suggestion" : void 0
        }, w6 && !G ? a6.pointer : " ", " "), s1.createElement(T, null, L6 ? a6.ellipsis : O6 ? a6.radioOn : a6.radioOff, " ", i.entry.name, s1.createElement(T, {
            dimColor: !0
        }, " · ", i.marketplaceName), i.entry.tags?.includes("community-managed") && s1.createElement(T, {
            dimColor: !0
        }, " [Community Managed]"), W && i.marketplaceName === db && s1.createElement(T, {
            dimColor: !0
        }, " · ", IL1(W.get(i.pluginId) ?? 0), " ", "installs"))), i.entry.description && s1.createElement(m, {
            marginLeft: 4
        }, s1.createElement(T, {
            dimColor: !0
        }, i.entry.description.length > 60 ? i.entry.description.substring(0, 57) + "..." : i.entry.description)))
    }), U.scrollPosition.canScrollDown && s1.createElement(m, null, s1.createElement(T, {
        dimColor: !0
    }, " ", a6.arrowDown, " more below")), A && s1.createElement(m, {
        marginTop: 1
    }, s1.createElement(T, {
        color: "error"
    }, a6.cross, " ", A)), s1.createElement(niY, {
        hasSelection: B.size > 0,
        canToggle: I < u.length && !u[I]?.isInstalled
    }))
}
// @from(Ln 402136, Col 0)
function niY(A) {
    let q = A6(10),
        {
            hasSelection: K,
            canToggle: Y
        } = A,
        z;
    if (q[0] !== K) z = K && s1.createElement(O8, {
        action: "plugin:install",
        context: "Plugin",
        fallback: "i",
        description: "install",
        bold: !0
    }), q[0] = K, q[1] = z;
    else z = q[1];
    let _;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) _ = s1.createElement(T, null, "type to search"), q[2] = _;
    else _ = q[2];
    let w;
    if (q[3] !== Y) w = Y && s1.createElement(O8, {
        action: "plugin:toggle",
        context: "Plugin",
        fallback: "Space",
        description: "toggle"
    }), q[3] = Y, q[4] = w;
    else w = q[4];
    let O, $;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) O = s1.createElement(O8, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "details"
    }), $ = s1.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    }), q[5] = O, q[6] = $;
    else O = q[5], $ = q[6];
    let H;
    if (q[7] !== z || q[8] !== w) H = s1.createElement(m, {
        marginTop: 1
    }, s1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, s1.createElement(C8, null, z, _, w, O, $))), q[7] = z, q[8] = w, q[9] = H;
    else H = q[9];
    return H
}
// @from(Ln 402186, Col 0)
function riY(A) {
    let q = A6(6),
        {
            reason: K
        } = A;
    switch (K) {
        case "git-not-installed": {
            let Y;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = s1.createElement(s1.Fragment, null, s1.createElement(T, {
                dimColor: !0
            }, "Git is required to install marketplaces."), s1.createElement(T, {
                dimColor: !0
            }, "Please install git and restart Claude Code.")), q[0] = Y;
            else Y = q[0];
            return Y
        }
        case "all-blocked-by-policy": {
            let Y;
            if (q[1] === Symbol.for("react.memo_cache_sentinel")) Y = s1.createElement(s1.Fragment, null, s1.createElement(T, {
                dimColor: !0
            }, "Your organization policy does not allow any external marketplaces."), s1.createElement(T, {
                dimColor: !0
            }, "Contact your administrator.")), q[1] = Y;
            else Y = q[1];
            return Y
        }
        case "policy-restricts-sources": {
            let Y;
            if (q[2] === Symbol.for("react.memo_cache_sentinel")) Y = s1.createElement(s1.Fragment, null, s1.createElement(T, {
                dimColor: !0
            }, "Your organization restricts which marketplaces can be added."), s1.createElement(T, {
                dimColor: !0
            }, "Switch to the Marketplaces tab to view allowed sources.")), q[2] = Y;
            else Y = q[2];
            return Y
        }
        case "all-marketplaces-failed": {
            let Y;
            if (q[3] === Symbol.for("react.memo_cache_sentinel")) Y = s1.createElement(s1.Fragment, null, s1.createElement(T, {
                dimColor: !0
            }, "Failed to load marketplace data."), s1.createElement(T, {
                dimColor: !0
            }, "Check your network connection.")), q[3] = Y;
            else Y = q[3];
            return Y
        }
        case "all-plugins-installed": {
            let Y;
            if (q[4] === Symbol.for("react.memo_cache_sentinel")) Y = s1.createElement(s1.Fragment, null, s1.createElement(T, {
                dimColor: !0
            }, "All available plugins are already installed."), s1.createElement(T, {
                dimColor: !0
            }, "Check for new plugins later or add more marketplaces.")), q[4] = Y;
            else Y = q[4];
            return Y
        }
        case "no-marketplaces-configured":
        default: {
            let Y;
            if (q[5] === Symbol.for("react.memo_cache_sentinel")) Y = s1.createElement(s1.Fragment, null, s1.createElement(T, {
                dimColor: !0
            }, "No plugins available."), s1.createElement(T, {
                dimColor: !0
            }, "Add a marketplace first using the Marketplaces tab.")), q[5] = Y;
            else Y = q[5];
            return Y
        }
    }
}
// @from(Ln 402255, Col 4)
s1
// @from(Ln 402255, Col 8)
$H
// @from(Ln 402256, Col 4)
hwq = E(() => {
    e6();
    i6();
    _7();
    b7();
    _q();
    H16();
    j16();
    Aw();
    dB();
    Uv();
    H1();
    kX();
    M96();
    fX();
    SL1();
    Yd8();
    zd8();
    bL1();
    lv6();
    Xq();
    OK();
    s8();
    xL1();
    s1 = t(P6(), 1), $H = t(P6(), 1)
})
// @from(Ln 402283, Col 0)
function oiY(A, q, K, Y) {
    let z = {};
    for (let _ of A) {
        let w = K[_],
            O = q[_] ?? "";
        if (w?.sensitive === !0 && O === "" && Y?.[_] !== void 0) continue;
        if (w?.type === "number") {
            if (O.trim() === "") continue;
            let $ = Number(O);
            z[_] = Number.isNaN($) ? O : $
        } else if (w?.type === "boolean") z[_] = t6(O);
        else z[_] = O
    }
    return z
}
// @from(Ln 402299, Col 0)
function Swq(A) {
    let q = A6(70),
        {
            title: K,
            subtitle: Y,
            configSchema: z,
            initialValues: _,
            onSave: w,
            onCancel: O
        } = A,
        $;
    if (q[0] !== z) $ = Object.keys(z), q[0] = z, q[1] = $;
    else $ = q[1];
    let H = $,
        j;
    if (q[2] !== z || q[3] !== _) j = (l) => {
        if (z[l]?.sensitive === !0) return "";
        let q6 = _?.[l];
        return q6 === void 0 ? "" : String(q6)
    }, q[2] = z, q[3] = _, q[4] = j;
    else j = q[4];
    let J = j,
        [M, D] = uL1.useState(0),
        X;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) X = {}, q[5] = X;
    else X = q[5];
    let [P, W] = uL1.useState(X), Z;
    if (q[6] !== H[0] || q[7] !== J) Z = () => H[0] ? J(H[0]) : "", q[6] = H[0], q[7] = J, q[8] = Z;
    else Z = q[8];
    let [G, f] = uL1.useState(Z), v = H[M], N = v ? z[v] : null, V;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) V = {
        context: "Settings"
    }, q[9] = V;
    else V = q[9];
    D8("confirm:no", O, V);
    let L;
    if (q[10] !== v || q[11] !== M || q[12] !== G || q[13] !== H || q[14] !== J) L = () => {
        if (M < H.length - 1 && v) {
            W((q6) => ({
                ...q6,
                [v]: G
            })), D(tiY);
            let l = H[M + 1];
            f(l ? J(l) : "")
        }
    }, q[10] = v, q[11] = M, q[12] = G, q[13] = H, q[14] = J, q[15] = L;
    else L = q[15];
    let h = L,
        R;
    if (q[16] !== z || q[17] !== v || q[18] !== M || q[19] !== G || q[20] !== H || q[21] !== J || q[22] !== _ || q[23] !== w || q[24] !== P) R = () => {
        if (!v) return;
        let l = {
            ...P,
            [v]: G
        };
        if (M === H.length - 1) w(oiY(H, l, z, _));
        else {
            W(l), D(siY);
            let q6 = H[M + 1];
            f(q6 ? J(q6) : "")
        }
    }, q[16] = z, q[17] = v, q[18] = M, q[19] = G, q[20] = H, q[21] = J, q[22] = _, q[23] = w, q[24] = P, q[25] = R;
    else R = q[25];
    let u = R,
        I;
    if (q[26] !== u || q[27] !== h) I = {
        "confirm:nextField": h,
        "confirm:yes": u
    }, q[26] = u, q[27] = h, q[28] = I;
    else I = q[28];
    let g;
    if (q[29] === Symbol.for("react.memo_cache_sentinel")) g = {
        context: "Confirmation"
    }, q[29] = g;
    else g = q[29];
    tA(I, g);
    let B;
    if (q[30] === Symbol.for("react.memo_cache_sentinel")) B = (l, q6) => {
        if (q6.backspace || q6.delete) {
            f(aiY);
            return
        }
        if (l && !q6.ctrl && !q6.meta && !q6.tab && !q6.return) f((w6) => w6 + l)
    }, q[30] = B;
    else B = q[30];
    if (jA(B), !N || !v) return null;
    let b = N.sensitive === !0,
        p = N.required === !0,
        Q;
    if (q[31] !== G || q[32] !== b) Q = b ? "*".repeat(f8(G)) : G, q[31] = G, q[32] = b, q[33] = Q;
    else Q = q[33];
    let U = Q,
        r = N.title || v,
        e;
    if (q[34] !== p) e = p && LN.default.createElement(T, {
        color: "error"
    }, " *"), q[34] = p, q[35] = e;
    else e = q[35];
    let Y6;
    if (q[36] !== r || q[37] !== e) Y6 = LN.default.createElement(T, {
        bold: !0
    }, r, e), q[36] = r, q[37] = e, q[38] = Y6;
    else Y6 = q[38];
    let H6;
    if (q[39] !== N.description) H6 = N.description && LN.default.createElement(T, {
        dimColor: !0
    }, N.description), q[39] = N.description, q[40] = H6;
    else H6 = q[40];
    let J6;
    if (q[41] === Symbol.for("react.memo_cache_sentinel")) J6 = LN.default.createElement(T, null, a6.pointerSmall, " "), q[41] = J6;
    else J6 = q[41];
    let K6;
    if (q[42] !== U) K6 = LN.default.createElement(T, null, U), q[42] = U, q[43] = K6;
    else K6 = q[43];
    let s;
    if (q[44] === Symbol.for("react.memo_cache_sentinel")) s = LN.default.createElement(T, null, "█"), q[44] = s;
    else s = q[44];
    let X6;
    if (q[45] !== K6) X6 = LN.default.createElement(m, {
        marginTop: 1
    }, J6, K6, s), q[45] = K6, q[46] = X6;
    else X6 = q[46];
    let z6;
    if (q[47] !== Y6 || q[48] !== H6 || q[49] !== X6) z6 = LN.default.createElement(m, {
        flexDirection: "column"
    }, Y6, H6, X6), q[47] = Y6, q[48] = H6, q[49] = X6, q[50] = z6;
    else z6 = q[50];
    let N6 = M + 1,
        $6;
    if (q[51] !== H.length || q[52] !== N6) $6 = LN.default.createElement(T, {
        dimColor: !0
    }, "Field ", N6, " of ", H.length), q[51] = H.length, q[52] = N6, q[53] = $6;
    else $6 = q[53];
    let n;
    if (q[54] !== M || q[55] !== H.length) n = M < H.length - 1 && LN.default.createElement(T, {
        dimColor: !0
    }, "Tab: Next field · Enter: Save and continue"), q[54] = M, q[55] = H.length, q[56] = n;
    else n = q[56];
    let o;
    if (q[57] !== M || q[58] !== H.length) o = M === H.length - 1 && LN.default.createElement(T, {
        dimColor: !0
    }, "Enter: Save configuration"), q[57] = M, q[58] = H.length, q[59] = o;
    else o = q[59];
    let a;
    if (q[60] !== $6 || q[61] !== n || q[62] !== o) a = LN.default.createElement(m, {
        flexDirection: "column"
    }, $6, n, o), q[60] = $6, q[61] = n, q[62] = o, q[63] = a;
    else a = q[63];
    let i;
    if (q[64] !== O || q[65] !== Y || q[66] !== z6 || q[67] !== a || q[68] !== K) i = LN.default.createElement(m8, {
        title: K,
        subtitle: Y,
        onCancel: O,
        isCancelActive: !1
    }, z6, a), q[64] = O, q[65] = Y, q[66] = z6, q[67] = a, q[68] = K, q[69] = i;
    else i = q[69];
    return i
}
// @from(Ln 402458, Col 0)
function aiY(A) {
    return A.slice(0, -1)
}
// @from(Ln 402462, Col 0)
function siY(A) {
    return A + 1
}
// @from(Ln 402466, Col 0)
function tiY(A) {
    return A + 1
}
// @from(Ln 402469, Col 4)
LN
// @from(Ln 402469, Col 8)
uL1
// @from(Ln 402470, Col 4)
Cwq = E(() => {
    e6();
    i6();
    _7();
    wq();
    b7();
    A8();
    q3();
    LN = t(P6(), 1), uL1 = t(P6(), 1)
})
// @from(Ln 402481, Col 0)
function Iwq(A) {
    let q = A6(138),
        {
            item: K,
            isSelected: Y
        } = A,
        [z] = z7();
    if (K.type === "plugin") {
        let v, N;
        if (K.pendingToggle) {
            let Y6;
            if (q[0] !== z) Y6 = kA("suggestion", z)(a6.arrowRight), q[0] = z, q[1] = Y6;
            else Y6 = q[1];
            v = Y6, N = K.pendingToggle === "will-enable" ? "will enable" : "will disable"
        } else if (K.errorCount > 0) {
            let Y6;
            if (q[2] !== z) Y6 = kA("error", z)(a6.cross), q[2] = z, q[3] = Y6;
            else Y6 = q[3];
            v = Y6, N = `${K.errorCount} error${K.errorCount!==1?"s":""}`
        } else if (!K.isEnabled) {
            let Y6;
            if (q[4] !== z) Y6 = kA("inactive", z)(a6.radioOff), q[4] = z, q[5] = Y6;
            else Y6 = q[5];
            v = Y6, N = "disabled"
        } else {
            let Y6;
            if (q[6] !== z) Y6 = kA("success", z)(a6.tick), q[6] = z, q[7] = Y6;
            else Y6 = q[7];
            v = Y6, N = "enabled"
        }
        let V = Y ? "suggestion" : void 0,
            L = Y ? `${a6.pointer} ` : "  ",
            h;
        if (q[8] !== V || q[9] !== L) h = g7.createElement(T, {
            color: V
        }, L), q[8] = V, q[9] = L, q[10] = h;
        else h = q[10];
        let R = Y ? "suggestion" : void 0,
            u;
        if (q[11] !== K.name || q[12] !== R) u = g7.createElement(T, {
            color: R
        }, K.name), q[11] = K.name, q[12] = R, q[13] = u;
        else u = q[13];
        let I = !Y,
            g;
        if (q[14] === Symbol.for("react.memo_cache_sentinel")) g = g7.createElement(T, {
            backgroundColor: "userMessageBackground"
        }, "Plugin"), q[14] = g;
        else g = q[14];
        let B;
        if (q[15] !== I) B = g7.createElement(T, {
            dimColor: I
        }, " ", g), q[15] = I, q[16] = B;
        else B = q[16];
        let b;
        if (q[17] !== K.marketplace) b = g7.createElement(T, {
            dimColor: !0
        }, " · ", K.marketplace), q[17] = K.marketplace, q[18] = b;
        else b = q[18];
        let p = !Y,
            Q;
        if (q[19] !== v || q[20] !== p) Q = g7.createElement(T, {
            dimColor: p
        }, " · ", v, " "), q[19] = v, q[20] = p, q[21] = Q;
        else Q = q[21];
        let U = !Y,
            r;
        if (q[22] !== N || q[23] !== U) r = g7.createElement(T, {
            dimColor: U
        }, N), q[22] = N, q[23] = U, q[24] = r;
        else r = q[24];
        let e;
        if (q[25] !== Q || q[26] !== r || q[27] !== h || q[28] !== u || q[29] !== B || q[30] !== b) e = g7.createElement(m, null, h, u, B, b, Q, r), q[25] = Q, q[26] = r, q[27] = h, q[28] = u, q[29] = B, q[30] = b, q[31] = e;
        else e = q[31];
        return e
    }
    if (K.type === "flagged-plugin") {
        let v;
        if (q[32] !== z) v = kA("warning", z)(a6.warning), q[32] = z, q[33] = v;
        else v = q[33];
        let N = v,
            V = Y ? "suggestion" : void 0,
            L = Y ? `${a6.pointer} ` : "  ",
            h;
        if (q[34] !== V || q[35] !== L) h = g7.createElement(T, {
            color: V
        }, L), q[34] = V, q[35] = L, q[36] = h;
        else h = q[36];
        let R = Y ? "suggestion" : void 0,
            u;
        if (q[37] !== K.name || q[38] !== R) u = g7.createElement(T, {
            color: R
        }, K.name), q[37] = K.name, q[38] = R, q[39] = u;
        else u = q[39];
        let I = !Y,
            g;
        if (q[40] === Symbol.for("react.memo_cache_sentinel")) g = g7.createElement(T, {
            backgroundColor: "userMessageBackground"
        }, "Plugin"), q[40] = g;
        else g = q[40];
        let B;
        if (q[41] !== I) B = g7.createElement(T, {
            dimColor: I
        }, " ", g), q[41] = I, q[42] = B;
        else B = q[42];
        let b;
        if (q[43] !== K.marketplace) b = g7.createElement(T, {
            dimColor: !0
        }, " · ", K.marketplace), q[43] = K.marketplace, q[44] = b;
        else b = q[44];
        let p = !Y,
            Q;
        if (q[45] !== N || q[46] !== p) Q = g7.createElement(T, {
            dimColor: p
        }, " · ", N, " "), q[45] = N, q[46] = p, q[47] = Q;
        else Q = q[47];
        let U = !Y,
            r;
        if (q[48] !== U) r = g7.createElement(T, {
            dimColor: U
        }, "removed"), q[48] = U, q[49] = r;
        else r = q[49];
        let e;
        if (q[50] !== b || q[51] !== Q || q[52] !== r || q[53] !== h || q[54] !== u || q[55] !== B) e = g7.createElement(m, null, h, u, B, b, Q, r), q[50] = b, q[51] = Q, q[52] = r, q[53] = h, q[54] = u, q[55] = B, q[56] = e;
        else e = q[56];
        return e
    }
    if (K.type === "failed-plugin") {
        let v;
        if (q[57] !== z) v = kA("error", z)(a6.cross), q[57] = z, q[58] = v;
        else v = q[58];
        let N = v,
            V = `failed to load · ${K.errorCount} error${K.errorCount!==1?"s":""}`,
            L = Y ? "suggestion" : void 0,
            h = Y ? `${a6.pointer} ` : "  ",
            R;
        if (q[59] !== L || q[60] !== h) R = g7.createElement(T, {
            color: L
        }, h), q[59] = L, q[60] = h, q[61] = R;
        else R = q[61];
        let u = Y ? "suggestion" : void 0,
            I;
        if (q[62] !== K.name || q[63] !== u) I = g7.createElement(T, {
            color: u
        }, K.name), q[62] = K.name, q[63] = u, q[64] = I;
        else I = q[64];
        let g = !Y,
            B;
        if (q[65] === Symbol.for("react.memo_cache_sentinel")) B = g7.createElement(T, {
            backgroundColor: "userMessageBackground"
        }, "Plugin"), q[65] = B;
        else B = q[65];
        let b;
        if (q[66] !== g) b = g7.createElement(T, {
            dimColor: g
        }, " ", B), q[66] = g, q[67] = b;
        else b = q[67];
        let p;
        if (q[68] !== K.marketplace) p = g7.createElement(T, {
            dimColor: !0
        }, " · ", K.marketplace), q[68] = K.marketplace, q[69] = p;
        else p = q[69];
        let Q = !Y,
            U;
        if (q[70] !== N || q[71] !== Q) U = g7.createElement(T, {
            dimColor: Q
        }, " · ", N, " "), q[70] = N, q[71] = Q, q[72] = U;
        else U = q[72];
        let r = !Y,
            e;
        if (q[73] !== V || q[74] !== r) e = g7.createElement(T, {
            dimColor: r
        }, V), q[73] = V, q[74] = r, q[75] = e;
        else e = q[75];
        let Y6;
        if (q[76] !== p || q[77] !== U || q[78] !== e || q[79] !== R || q[80] !== I || q[81] !== b) Y6 = g7.createElement(m, null, R, I, b, p, U, e), q[76] = p, q[77] = U, q[78] = e, q[79] = R, q[80] = I, q[81] = b, q[82] = Y6;
        else Y6 = q[82];
        return Y6
    }
    let _, w;
    if (K.status === "connected") {
        let v;
        if (q[83] !== z) v = kA("success", z)(a6.tick), q[83] = z, q[84] = v;
        else v = q[84];
        _ = v, w = "connected"
    } else if (K.status === "disabled") {
        let v;
        if (q[85] !== z) v = kA("inactive", z)(a6.radioOff), q[85] = z, q[86] = v;
        else v = q[86];
        _ = v, w = "disabled"
    } else if (K.status === "pending") {
        let v;
        if (q[87] !== z) v = kA("inactive", z)(a6.radioOff), q[87] = z, q[88] = v;
        else v = q[88];
        _ = v, w = "connecting…"
    } else if (K.status === "needs-auth") {
        let v;
        if (q[89] !== z) v = kA("warning", z)(a6.triangleUpOutline), q[89] = z, q[90] = v;
        else v = q[90];
        _ = v, w = "Enter to auth"
    } else {
        let v;
        if (q[91] !== z) v = kA("error", z)(a6.cross), q[91] = z, q[92] = v;
        else v = q[92];
        _ = v, w = "failed"
    }
    if (K.indented) {
        let v = Y ? "suggestion" : void 0,
            N = Y ? `${a6.pointer} ` : "  ",
            V;
        if (q[93] !== v || q[94] !== N) V = g7.createElement(T, {
            color: v
        }, N), q[93] = v, q[94] = N, q[95] = V;
        else V = q[95];
        let L = !Y,
            h;
        if (q[96] !== L) h = g7.createElement(T, {
            dimColor: L
        }, "└ "), q[96] = L, q[97] = h;
        else h = q[97];
        let R = Y ? "suggestion" : void 0,
            u;
        if (q[98] !== K.name || q[99] !== R) u = g7.createElement(T, {
            color: R
        }, K.name), q[98] = K.name, q[99] = R, q[100] = u;
        else u = q[100];
        let I = !Y,
            g;
        if (q[101] === Symbol.for("react.memo_cache_sentinel")) g = g7.createElement(T, {
            backgroundColor: "userMessageBackground"
        }, "MCP"), q[101] = g;
        else g = q[101];
        let B;
        if (q[102] !== I) B = g7.createElement(T, {
            dimColor: I
        }, " ", g), q[102] = I, q[103] = B;
        else B = q[103];
        let b = !Y,
            p;
        if (q[104] !== _ || q[105] !== b) p = g7.createElement(T, {
            dimColor: b
        }, " · ", _, " "), q[104] = _, q[105] = b, q[106] = p;
        else p = q[106];
        let Q = !Y,
            U;
        if (q[107] !== w || q[108] !== Q) U = g7.createElement(T, {
            dimColor: Q
        }, w), q[107] = w, q[108] = Q, q[109] = U;
        else U = q[109];
        let r;
        if (q[110] !== B || q[111] !== p || q[112] !== U || q[113] !== V || q[114] !== h || q[115] !== u) r = g7.createElement(m, null, V, h, u, B, p, U), q[110] = B, q[111] = p, q[112] = U, q[113] = V, q[114] = h, q[115] = u, q[116] = r;
        else r = q[116];
        return r
    }
    let O = Y ? "suggestion" : void 0,
        $ = Y ? `${a6.pointer} ` : "  ",
        H;
    if (q[117] !== O || q[118] !== $) H = g7.createElement(T, {
        color: O
    }, $), q[117] = O, q[118] = $, q[119] = H;
    else H = q[119];
    let j = Y ? "suggestion" : void 0,
        J;
    if (q[120] !== K.name || q[121] !== j) J = g7.createElement(T, {
        color: j
    }, K.name), q[120] = K.name, q[121] = j, q[122] = J;
    else J = q[122];
    let M = !Y,
        D;
    if (q[123] === Symbol.for("react.memo_cache_sentinel")) D = g7.createElement(T, {
        backgroundColor: "userMessageBackground"
    }, "MCP"), q[123] = D;
    else D = q[123];
    let X;
    if (q[124] !== M) X = g7.createElement(T, {
        dimColor: M
    }, " ", D), q[124] = M, q[125] = X;
    else X = q[125];
    let P = !Y,
        W;
    if (q[126] !== _ || q[127] !== P) W = g7.createElement(T, {
        dimColor: P
    }, " · ", _, " "), q[126] = _, q[127] = P, q[128] = W;
    else W = q[128];
    let Z = !Y,
        G;
    if (q[129] !== w || q[130] !== Z) G = g7.createElement(T, {
        dimColor: Z
    }, w), q[129] = w, q[130] = Z, q[131] = G;
    else G = q[131];
    let f;
    if (q[132] !== W || q[133] !== G || q[134] !== H || q[135] !== J || q[136] !== X) f = g7.createElement(m, null, H, J, X, W, G), q[132] = W, q[133] = G, q[134] = H, q[135] = J, q[136] = X, q[137] = f;
    else f = q[137];
    return f
}
// @from(Ln 402776, Col 4)
g7
// @from(Ln 402777, Col 4)
bwq = E(() => {
    e6();
    i6();
    b7();
    g7 = t(P6(), 1)
})
// @from(Ln 402784, Col 0)
function V16(A) {
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
        case "mcp-config-invalid":
            return `Invalid MCP server config for '${A.serverName}': ${A.validationError}`;
        case "mcp-server-suppressed-duplicate": {
            let q = A.duplicateOf.startsWith("plugin:") ? `server provided by plugin '${A.duplicateOf.split(":")[1]??"?"}'` : `already-configured '${A.duplicateOf}'`;
            return `MCP server '${A.serverName}' skipped — same command/URL as ${q}`
        }
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
        case "dependency-unsatisfied":
            return A.reason === "not-enabled" ? `Dependency '${A.dependency}' is disabled` : `Dependency '${A.dependency}' is not installed`;
        case "generic-error":
            return A.error;
        default:
            return "Unknown error"
    }
}
// @from(Ln 402831, Col 0)
function iv6(A) {
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
        case "mcp-server-suppressed-duplicate": {
            if (A.duplicateOf.startsWith("plugin:")) return `Disable plugin '${A.duplicateOf.split(":")[1]??"the other plugin"}' if you want this plugin's version instead`;
            return `Remove '${A.duplicateOf}' from your MCP config if you want the plugin's version instead`
        }
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
        case "dependency-unsatisfied":
            return A.reason === "not-enabled" ? `Enable '${A.dependency}' or uninstall '${A.plugin}'` : `Install '${A.dependency}' or uninstall '${A.plugin}'`;
        case "marketplace-load-failed":
        case "generic-error":
            return null;
        default:
            return null
    }
}
// @from(Ln 402889, Col 0)
function xwq() {
    return eiY(eH(), _nY)
}
// @from(Ln 402893, Col 0)
function OnY(A) {
    let q = i1(A);
    if (typeof q !== "object" || q === null || !("plugins" in q) || typeof q.plugins !== "object" || q.plugins === null) return {};
    let K = q.plugins,
        Y = {};
    for (let [z, _] of Object.entries(K))
        if (_ && typeof _ === "object" && "flaggedAt" in _ && typeof _.flaggedAt === "string") {
            let w = {
                flaggedAt: _.flaggedAt
            };
            if ("seenAt" in _ && typeof _.seenAt === "string") w.seenAt = _.seenAt;
            Y[z] = w
        } return Y
}
// @from(Ln 402907, Col 0)
async function mL1() {
    try {
        let A = await qnY(xwq(), {
            encoding: "utf-8"
        });
        return OnY(A)
    } catch {
        return {}
    }
}
// @from(Ln 402917, Col 0)
async function BL1(A) {
    let q = xwq(),
        K = `${q}.${AnY(8).toString("hex")}.tmp`;
    try {
        await $1().mkdir(eH());
        let Y = B6({
            plugins: A
        }, null, 2);
        await KnY(K, Y, {
            encoding: "utf-8",
            mode: 384
        }), await YnY(K, q), RN = A
    } catch (Y) {
        _6(Y);
        try {
            await znY(K)
        } catch {}
    }
}
// @from(Ln 402936, Col 0)
async function uwq() {
    let A = await mL1(),
        q = Date.now(),
        K = !1;
    for (let [Y, z] of Object.entries(A))
        if (z.seenAt && q - new Date(z.seenAt).getTime() >= wnY) delete A[Y], K = !0;
    if (RN = A, K) await BL1(A)
}
// @from(Ln 402945, Col 0)
function nv6() {
    return RN ?? {}
}
// @from(Ln 402948, Col 0)
async function mwq(A) {
    if (RN === null) RN = await mL1();
    let q = {
        ...RN,
        [A]: {
            flaggedAt: new Date().toISOString()
        }
    };
    await BL1(q), k(`Flagged plugin: ${A}`)
}
// @from(Ln 402958, Col 0)
async function Bwq(A) {
    if (RN === null) RN = await mL1();
    let q = new Date().toISOString(),
        K = !1,
        Y = {
            ...RN
        };
    for (let z of A) {
        let _ = Y[z];
        if (_ && !_.seenAt) Y[z] = {
            ..._,
            seenAt: q
        }, K = !0
    }
    if (K) await BL1(Y)
}
// @from(Ln 402974, Col 0)
async function gwq(A) {
    if (RN === null) RN = await mL1();
    if (!(A in RN)) return;
    let {
        [A]: q, ...K
    } = RN;
    RN = K, await BL1(K)
}
// @from(Ln 402982, Col 4)
_nY = "flagged-plugins.json"
// @from(Ln 402983, Col 4)
wnY = 172800000
// @from(Ln 402984, Col 4)
RN = null
// @from(Ln 402985, Col 4)
gL1 = E(() => {
    SA();
    ze();
    H1();
    k1();
    g1()
})
// @from(Ln 403005, Col 0)
function Od8() {
    return $nY(eH(), DnY)
}
// @from(Ln 403009, Col 0)
function Qwq(A) {
    return typeof A === "object" && A !== null && typeof A.plugin === "string" && typeof A.added_at === "string" && typeof A.reason === "string" && typeof A.text === "string"
}
// @from(Ln 403012, Col 0)
async function PnY() {
    try {
        let A = await pwq(Od8(), {
                encoding: "utf-8"
            }),
            q = i1(A);
        if (typeof q !== "object" || q === null || !("plugins" in q) || !Array.isArray(q.plugins)) return [];
        return q.plugins.filter(Qwq)
    } catch {
        return []
    }
}
// @from(Ln 403025, Col 0)
function Uwq(A) {
    return new Map(A.map((q) => [q.plugin, q]))
}
// @from(Ln 403029, Col 0)
function WnY() {
    if (Sn6 === null) Sn6 = new Map;
    return Sn6
}
// @from(Ln 403033, Col 0)
async function ZnY() {
    Sn6 = Uwq(await PnY())
}
// @from(Ln 403037, Col 0)
function dwq(A) {
    let q = WnY().get(A);
    if (!q) return null;
    return {
        reason: q.reason,
        text: q.text
    }
}
// @from(Ln 403045, Col 0)
async function GnY() {
    try {
        let A = await pwq(Od8(), {
                encoding: "utf-8"
            }),
            q = i1(A);
        if (typeof q !== "object" || q === null || !("fetchedAt" in q) || typeof q.fetchedAt !== "string") return !1;
        let K = new Date(q.fetchedAt).getTime();
        return !Number.isNaN(K) && Date.now() - K < XnY
    } catch {
        return !1
    }
}
// @from(Ln 403058, Col 0)
async function fnY(A) {
    let q = Od8(),
        K = `${q}.${HnY(8).toString("hex")}.tmp`;
    try {
        let Y = eH();
        await $1().mkdir(Y);
        let z = B6({
            fetchedAt: new Date().toISOString(),
            plugins: A
        }, null, 2);
        await MnY(K, z, {
            encoding: "utf-8",
            mode: 384
        }), await jnY(K, q), Sn6 = Uwq(A), k("Security messages saved successfully")
    } catch (Y) {
        _6(Y);
        try {
            await JnY(K)
        } catch {}
    }
}
// @from(Ln 403079, Col 0)
async function TnY(A = !1) {
    if (await ZnY(), !A && await GnY()) {
        k("Security messages are fresh (<1h old), skipping fetch");
        return
    }
    try {
        k(`Fetching plugin security messages from ${Fwq}`);
        let q = await X8.get(Fwq, {
            timeout: 5000,
            params: {
                t: Date.now()
            }
        });
        if (!q.data?.plugins || !Array.isArray(q.data.plugins)) throw Error("Invalid response format from plugin security messages");
        let K = q.data.plugins.filter(Qwq);
        await fnY(K)
    } catch (q) {
        k(`Failed to fetch plugin security messages: ${_1(q)}`, {
            level: "error"
        })
    }
}
// @from(Ln 403102, Col 0)
function vnY(A, q, K) {
    let Y = new Set(q.plugins.map((w) => w.name)),
        z = `@${K}`,
        _ = [];
    for (let w of Object.keys(A.plugins)) {
        if (!w.endsWith(z)) continue;
        let O = w.slice(0, -z.length);
        if (!Y.has(O)) _.push(w)
    }
    return _
}
// @from(Ln 403113, Col 0)
async function FL1() {
    await TnY(), await uwq();
    let A = DZ(),
        q = nv6(),
        K = await eW6(),
        Y = [];
    for (let z of Object.keys(K)) try {
        let _ = await j0(z);
        if (!_.forceRemoveDeletedPlugins) continue;
        let w = vnY(A, _, z);
        for (let O of w) {
            if (O in q) continue;
            let $ = A.plugins[O] ?? [];
            if (!$.some((j) => j.scope === "user" || j.scope === "project" || j.scope === "local")) continue;
            for (let j of $) {
                let {
                    scope: J
                } = j;
                if (J !== "user" && J !== "project" && J !== "local") continue;
                try {
                    await v16(O, J)
                } catch (M) {
                    k(`Failed to auto-uninstall delisted plugin ${O} from ${J}: ${_1(M)}`, {
                        level: "error"
                    })
                }
            }
            await mwq(O), Y.push(O)
        }
    } catch (_) {
        k(`Failed to check for delisted plugins in "${z}": ${_1(_)}`, {
            level: "warn"
        })
    }
    return Y
}
// @from(Ln 403149, Col 4)
DnY = "blocklist.json"
// @from(Ln 403150, Col 4)
Fwq = "https://raw.githubusercontent.com/anthropics/claude-plugins-official/refs/heads/security/security.json"
// @from(Ln 403151, Col 4)
XnY = 3600000
// @from(Ln 403152, Col 4)
Sn6 = null
// @from(Ln 403153, Col 4)
pL1 = E(() => {
    kK();
    SA();
    ze();
    H1();
    k1();
    g1();
    fX();
    Aw();
    pv6();
    gL1();
    s8()
})
// @from(Ln 403168, Col 0)
async function cwq(A) {
    try {
        return (await J_6.readdir(A, {
            withFileTypes: !0
        })).filter((K) => K.isFile() && K.name.endsWith(".md")).map((K) => {
            return rv6.basename(K.name, ".md")
        })
    } catch (q) {
        let K = _1(q);
        return k(`Failed to read plugin components from ${A}: ${K}`, {
            level: "error"
        }), _6(q instanceof Error ? q : Error(`Failed to read plugin components: ${K}`)), []
    }
}
// @from(Ln 403182, Col 0)
async function NnY(A) {
    try {
        let q = await J_6.readdir(A, {
                withFileTypes: !0
            }),
            K = [];
        for (let Y of q)
            if (Y.isDirectory() || Y.isSymbolicLink()) {
                let z = rv6.join(A, Y.name, "SKILL.md");
                try {
                    await J_6.access(z), K.push(Y.name)
                } catch {}
            } return K
    } catch (q) {
        let K = _1(q);
        return k(`Failed to read skill directories from ${A}: ${K}`, {
            level: "error"
        }), _6(q instanceof Error ? q : Error(`Failed to read skill directories: ${K}`)), []
    }
}
// @from(Ln 403203, Col 0)
function VnY({
    plugin: A,
    marketplace: q
}) {
    let [K, Y] = DY.useState(null), [z, _] = DY.useState(!0), [w, O] = DY.useState(null);
    if (DY.useEffect(() => {
            async function H() {
                try {
                    if (q === "builtin") {
                        let M = G24(A.name);
                        if (M) {
                            let D = M.skills?.map((W) => W.name) ?? [],
                                X = M.hooks ? Object.keys(M.hooks) : [],
                                P = M.mcpServers ? Object.keys(M.mcpServers) : [];
                            Y({
                                commands: null,
                                agents: null,
                                skills: D.length > 0 ? D : null,
                                hooks: X.length > 0 ? X : null,
                                mcpServers: P.length > 0 ? P : null
                            })
                        } else O(`Built-in plugin ${A.name} not found`);
                        _(!1);
                        return
                    }
                    let J = (await j0(q)).plugins.find((M) => M.name === A.name);
                    if (J) {
                        let M = [];
                        if (A.commandsPath) M.push(A.commandsPath);
                        if (A.commandsPaths) M.push(...A.commandsPaths);
                        let D = [];
                        for (let v of M)
                            if (typeof v === "string") {
                                let N = await cwq(v);
                                D.push(...N)
                            } let X = [];
                        if (A.agentsPath) X.push(A.agentsPath);
                        if (A.agentsPaths) X.push(...A.agentsPaths);
                        let P = [];
                        for (let v of X)
                            if (typeof v === "string") {
                                let N = await cwq(v);
                                P.push(...N)
                            } let W = [];
                        if (A.skillsPath) W.push(A.skillsPath);
                        if (A.skillsPaths) W.push(...A.skillsPaths);
                        let Z = [];
                        for (let v of W)
                            if (typeof v === "string") {
                                let N = await NnY(v);
                                Z.push(...N)
                            } let G = [];
                        if (A.hooksConfig) G.push(Object.keys(A.hooksConfig));
                        if (J.hooks) G.push(J.hooks);
                        let f = [];
                        if (A.mcpServers) f.push(Object.keys(A.mcpServers));
                        if (J.mcpServers) f.push(J.mcpServers);
                        Y({
                            commands: D.length > 0 ? D : null,
                            agents: P.length > 0 ? P : null,
                            skills: Z.length > 0 ? Z : null,
                            hooks: G.length > 0 ? G : null,
                            mcpServers: f.length > 0 ? f : null
                        })
                    } else O(`Plugin ${A.name} not found in marketplace`)
                } catch (j) {
                    O(j instanceof Error ? j.message : "Failed to load components")
                } finally {
                    _(!1)
                }
            }
            H()
        }, [A.name, A.commandsPath, A.commandsPaths, A.agentsPath, A.agentsPaths, A.skillsPath, A.skillsPaths, A.hooksConfig, A.mcpServers, q]), z) return null;
    if (w) return W1.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, W1.createElement(T, {
        bold: !0
    }, "Components:"), W1.createElement(T, {
        dimColor: !0
    }, "Error: ", w));
    if (!K) return null;
    if (!(K.commands || K.agents || K.skills || K.hooks || K.mcpServers)) return null;
    return W1.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, W1.createElement(T, {
        bold: !0
    }, "Installed components:"), K.commands ? W1.createElement(T, {
        dimColor: !0
    }, "• Commands:", " ", typeof K.commands === "string" ? K.commands : Array.isArray(K.commands) ? K.commands.join(", ") : Object.keys(K.commands).join(", ")) : null, K.agents ? W1.createElement(T, {
        dimColor: !0
    }, "• Agents:", " ", typeof K.agents === "string" ? K.agents : Array.isArray(K.agents) ? K.agents.join(", ") : Object.keys(K.agents).join(", ")) : null, K.skills ? W1.createElement(T, {
        dimColor: !0
    }, "• Skills:", " ", typeof K.skills === "string" ? K.skills : Array.isArray(K.skills) ? K.skills.join(", ") : Object.keys(K.skills).join(", ")) : null, K.hooks ? W1.createElement(T, {
        dimColor: !0
    }, "• Hooks:", " ", typeof K.hooks === "string" ? K.hooks : Array.isArray(K.hooks) ? K.hooks.map(String).join(", ") : typeof K.hooks === "object" && K.hooks !== null ? Object.keys(K.hooks).join(", ") : String(K.hooks)) : null, K.mcpServers ? W1.createElement(T, {
        dimColor: !0
    }, "• MCP Servers:", " ", typeof K.mcpServers === "string" ? K.mcpServers : Array.isArray(K.mcpServers) ? K.mcpServers.map(String).join(", ") : typeof K.mcpServers === "object" && K.mcpServers !== null ? Object.keys(K.mcpServers).join(", ") : String(K.mcpServers)) : null)
}
// @from(Ln 403303, Col 0)
async function knY(A, q) {
    let Y = (await j0(q))?.plugins.find((z) => z.name === A);
    if (Y && typeof Y.source === "string") return `Local plugins cannot be updated remotely. To update, modify the source at: ${Y.source}`;
    return null
}
// @from(Ln 403309, Col 0)
function EnY(A) {
    let q = L8("policySettings")?.enabledPlugins;
    if (!q) return A;
    return A.filter((K) => {
        let Y = K.source.split("@")[1] || "local",
            z = `${K.name}@${Y}`;
        return q[z] !== !1
    })
}