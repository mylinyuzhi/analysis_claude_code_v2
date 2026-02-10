
// @from(Ln 394002, Col 0)
function A7q({
    onClose: A,
    context: q,
    setTabsHidden: K,
    setIsWarning: Y,
    setHideMargin: z,
    onSearchModeChange: w
}) {
    let [H, $] = T7(), [O, _] = aZ.useState(f6()), [J, X] = aZ.useState(A6q()), D = s6.useRef(f6()), [j, M] = aZ.useState(l4()), P = s6.useRef(l4()), [W, G] = aZ.useState(j?.outputStyle || Wj), f = s6.useRef(W), [Z, N] = aZ.useState(j?.language), T = s6.useRef(Z), [k, y] = aZ.useState(0), [B, S] = aZ.useState(!0), m = aZ.useCallback((f1) => {
        S(f1), w?.(f1)
    }, [w]), b = B, g = k_(), U = v6((f1) => f1.mainLoopModel), x = v6((f1) => f1.verbose), p = v6((f1) => f1.thinkingEnabled), l = v6((f1) => i4() ? f1.fastMode : !1), r = v6((f1) => f1.promptSuggestionEnabled), s = L7(), [O1, T1] = aZ.useState({}), N1 = s6.useRef(p), [j1, q1] = aZ.useState(!1), [t, J1] = aZ.useState(null), {
        query: D1,
        setQuery: Z1,
        cursorOffset: E1
    } = qF({
        isActive: b && t === null,
        onExit: () => {
            m(!1)
        }
    }), a = N$6(q.options.mcpClients), A1 = !J6(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING), M1 = OjA(), z1 = KZ1();
    async function Y1(f1) {
        c("tengu_config_model_changed", {
            from_model: U,
            to_model: f1
        }), s((H1) => ({
            ...H1,
            mainLoopModel: f1
        })), T1((H1) => {
            let y1 = _S(f1);
            if ("model" in H1) {
                let {
                    model: B1,
                    ...A6
                } = H1;
                return {
                    ...A6,
                    model: y1
                }
            }
            return {
                ...H1,
                model: y1
            }
        })
    }

    function _1(f1) {
        jA((R1) => ({
            ...R1,
            verbose: f1
        })), _({
            ...f6(),
            verbose: f1
        }), s((R1) => ({
            ...R1,
            verbose: f1
        })), T1((R1) => {
            if ("verbose" in R1) {
                let {
                    verbose: H1,
                    ...y1
                } = R1;
                return y1
            }
            return {
                ...R1,
                verbose: f1
            }
        })
    }
    let $1 = [{
            id: "autoCompactEnabled",
            label: "Auto-compact",
            value: O.autoCompactEnabled,
            type: "boolean",
            onChange(f1) {
                jA((R1) => ({
                    ...R1,
                    autoCompactEnabled: f1
                })), _({
                    ...f6(),
                    autoCompactEnabled: f1
                }), c("tengu_auto_compact_setting_changed", {
                    enabled: f1
                })
            }
        }, {
            id: "spinnerTipsEnabled",
            label: "Show tips",
            value: j?.spinnerTipsEnabled ?? !0,
            type: "boolean",
            onChange(f1) {
                Z7("localSettings", {
                    spinnerTipsEnabled: f1
                }), M((R1) => ({
                    ...R1,
                    spinnerTipsEnabled: f1
                })), c("tengu_tips_setting_changed", {
                    enabled: f1
                })
            }
        }, {
            id: "prefersReducedMotion",
            label: "Reduce motion",
            value: j?.prefersReducedMotion ?? !1,
            type: "boolean",
            onChange(f1) {
                Z7("localSettings", {
                    prefersReducedMotion: f1
                }), M((R1) => ({
                    ...R1,
                    prefersReducedMotion: f1
                })), c("tengu_reduce_motion_setting_changed", {
                    enabled: f1
                })
            }
        }, {
            id: "thinkingEnabled",
            label: "Thinking mode",
            value: p ?? !0,
            type: "boolean",
            onChange(f1) {
                s((R1) => ({
                    ...R1,
                    thinkingEnabled: f1
                })), Z7("userSettings", {
                    alwaysThinkingEnabled: f1 ? void 0 : !1
                }), c("tengu_thinking_toggled", {
                    enabled: f1
                })
            }
        }, ...i4() && lH() ? [{
            id: "fastMode",
            label: `Fast mode (${$S} only)`,
            value: !!l,
            type: "boolean",
            onChange(f1) {
                if (e81(), Z7("userSettings", {
                        fastMode: f1 ? !0 : void 0
                    }), f1) s((R1) => ({
                    ...R1,
                    mainLoopModel: zC1,
                    mainLoopModelForSession: null,
                    fastMode: !0
                })), T1((R1) => ({
                    ...R1,
                    model: zC1,
                    "Fast mode": "ON"
                }));
                else s((R1) => ({
                    ...R1,
                    fastMode: !1
                })), T1((R1) => ({
                    ...R1,
                    "Fast mode": "OFF"
                }))
            }
        }] : [], ...x8("tengu_chomp_inflection", !0) ? [{
            id: "promptSuggestionEnabled",
            label: "Prompt suggestions",
            value: r,
            type: "boolean",
            onChange(f1) {
                s((R1) => ({
                    ...R1,
                    promptSuggestionEnabled: f1
                })), Z7("userSettings", {
                    promptSuggestionEnabled: f1 ? void 0 : !1
                })
            }
        }] : [], ...[], ...A1 ? [{
            id: "fileCheckpointingEnabled",
            label: "Rewind code (checkpoints)",
            value: O.fileCheckpointingEnabled,
            type: "boolean",
            onChange(f1) {
                jA((R1) => ({
                    ...R1,
                    fileCheckpointingEnabled: f1
                })), _({
                    ...f6(),
                    fileCheckpointingEnabled: f1
                }), c("tengu_file_history_snapshots_setting_changed", {
                    enabled: f1
                })
            }
        }] : [], {
            id: "verbose",
            label: "Verbose output",
            value: x,
            type: "boolean",
            onChange: _1
        }, {
            id: "terminalProgressBarEnabled",
            label: "Terminal progress bar",
            value: O.terminalProgressBarEnabled,
            type: "boolean",
            onChange(f1) {
                jA((R1) => ({
                    ...R1,
                    terminalProgressBarEnabled: f1
                })), _({
                    ...f6(),
                    terminalProgressBarEnabled: f1
                }), c("tengu_terminal_progress_bar_setting_changed", {
                    enabled: f1
                })
            }
        }, {
            id: "defaultPermissionMode",
            label: "Default permission mode",
            value: j?.permissions?.defaultMode || "default",
            options: (() => {
                let f1 = ["default", "plan"],
                    R1 = l8() ? ["bypassPermissions"] : ["bypassPermissions", "delegate"];
                return [...f1, ...qA1.filter((H1) => !f1.includes(H1) && !R1.includes(H1))]
            })(),
            type: "enum",
            onChange(f1) {
                let R1 = KA1(jC(f1)),
                    H1 = Z7("userSettings", {
                        permissions: {
                            ...j?.permissions,
                            defaultMode: R1
                        }
                    });
                if (H1.error) {
                    K1(H1.error);
                    return
                }
                M((y1) => ({
                    ...y1,
                    permissions: {
                        ...y1?.permissions,
                        defaultMode: R1
                    }
                })), T1((y1) => ({
                    ...y1,
                    defaultPermissionMode: f1
                })), c("tengu_config_changed", {
                    setting: "defaultPermissionMode",
                    value: f1
                })
            }
        }, {
            id: "respectGitignore",
            label: "Respect .gitignore in file picker",
            value: O.respectGitignore,
            type: "boolean",
            onChange(f1) {
                jA((R1) => ({
                    ...R1,
                    respectGitignore: f1
                })), _({
                    ...f6(),
                    respectGitignore: f1
                }), c("tengu_respect_gitignore_setting_changed", {
                    enabled: f1
                })
            }
        }, z1 ? {
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
            value: H,
            type: "managedEnum",
            onChange: $
        }, {
            id: "notifChannel",
            label: "Notifications",
            value: O.preferredNotifChannel,
            options: ["auto", "iterm2", "terminal_bell", "iterm2_with_bell", "kitty", "ghostty", "notifications_disabled"],
            type: "enum",
            onChange(f1) {
                jA((R1) => ({
                    ...R1,
                    preferredNotifChannel: f1
                })), _({
                    ...f6(),
                    preferredNotifChannel: f1
                })
            }
        }, {
            id: "outputStyle",
            label: "Output style",
            value: W,
            type: "managedEnum",
            onChange: () => {}
        }, {
            id: "language",
            label: "Language",
            value: Z ?? "Default (English)",
            type: "managedEnum",
            onChange: () => {}
        }, {
            id: "editorMode",
            label: "Editor mode",
            value: O.editorMode === "emacs" ? "normal" : O.editorMode || "normal",
            options: ["normal", "vim"],
            type: "enum",
            onChange(f1) {
                jA((R1) => ({
                    ...R1,
                    editorMode: f1
                })), _({
                    ...f6(),
                    editorMode: f1
                }), c("tengu_editor_mode_changed", {
                    mode: f1,
                    source: "config_panel"
                })
            }
        }, ...[], ...x8("tengu_code_diff_cli", !1) ? [{
            id: "codeDiffFooterEnabled",
            label: "Show code diff footer",
            value: O.codeDiffFooterEnabled ?? !0,
            type: "boolean",
            onChange(f1) {
                jA((R1) => {
                    if (R1.codeDiffFooterEnabled === f1) return R1;
                    return {
                        ...R1,
                        codeDiffFooterEnabled: f1
                    }
                }), _({
                    ...f6(),
                    codeDiffFooterEnabled: f1
                }), c("tengu_code_diff_footer_setting_changed", {
                    enabled: f1
                })
            }
        }] : [], ...x8("tengu_pr_status_cli", !1) ? [{
            id: "prStatusFooterEnabled",
            label: "Show PR status footer",
            value: O.prStatusFooterEnabled ?? !0,
            type: "boolean",
            onChange(f1) {
                jA((R1) => {
                    if (R1.prStatusFooterEnabled === f1) return R1;
                    return {
                        ...R1,
                        prStatusFooterEnabled: f1
                    }
                }), _({
                    ...f6(),
                    prStatusFooterEnabled: f1
                }), c("tengu_pr_status_footer_setting_changed", {
                    enabled: f1
                })
            }
        }] : [], {
            id: "model",
            label: "Model",
            value: U === null ? "Default (recommended)" : U,
            type: "managedEnum",
            onChange: Y1
        }, ...a ? [{
            id: "diffTool",
            label: "Diff tool",
            value: O.diffTool ?? "auto",
            options: ["terminal", "auto"],
            type: "enum",
            onChange(f1) {
                jA((R1) => ({
                    ...R1,
                    diffTool: f1
                })), _({
                    ...f6(),
                    diffTool: f1
                }), c("tengu_diff_tool_changed", {
                    tool: f1,
                    source: "config_panel"
                })
            }
        }] : [], ...!bX() ? [{
            id: "autoConnectIde",
            label: "Auto-connect to IDE (external terminal)",
            value: O.autoConnectIde ?? !1,
            type: "boolean",
            onChange(f1) {
                jA((R1) => ({
                    ...R1,
                    autoConnectIde: f1
                })), _({
                    ...f6(),
                    autoConnectIde: f1
                }), c("tengu_auto_connect_ide_changed", {
                    enabled: f1,
                    source: "config_panel"
                })
            }
        }] : [], ...bX() ? [{
            id: "autoInstallIdeExtension",
            label: "Auto-install IDE extension",
            value: O.autoInstallIdeExtension ?? !0,
            type: "boolean",
            onChange(f1) {
                jA((R1) => ({
                    ...R1,
                    autoInstallIdeExtension: f1
                })), _({
                    ...f6(),
                    autoInstallIdeExtension: f1
                }), c("tengu_auto_install_ide_extension_changed", {
                    enabled: f1,
                    source: "config_panel"
                })
            }
        }] : [], {
            id: "claudeInChromeDefaultEnabled",
            label: "Claude in Chrome enabled by default",
            value: O.claudeInChromeDefaultEnabled ?? !0,
            type: "boolean",
            onChange(f1) {
                jA((R1) => ({
                    ...R1,
                    claudeInChromeDefaultEnabled: f1
                })), _({
                    ...f6(),
                    claudeInChromeDefaultEnabled: f1
                }), c("tengu_claude_in_chrome_setting_changed", {
                    enabled: f1
                })
            }
        }, ...l8() ? (() => {
            let f1 = XEA();
            return [{
                id: "teammateMode",
                label: f1 ? `Teammate mode [overridden: ${f1}]` : "Teammate mode",
                value: O.teammateMode ?? "auto",
                options: ["auto", "tmux", "in-process"],
                type: "enum",
                onChange(H1) {
                    if (H1 !== "auto" && H1 !== "tmux" && H1 !== "in-process") return;
                    DEA(H1), jA((y1) => ({
                        ...y1,
                        teammateMode: H1
                    })), _({
                        ...f6(),
                        teammateMode: H1
                    }), c("tengu_teammate_mode_changed", {
                        mode: H1
                    })
                }
            }]
        })() : [], ...M1 ? [{
            id: "showExternalIncludesDialog",
            label: "External CLAUDE.md includes",
            value: (() => {
                if (sz().hasClaudeMdExternalIncludesApproved) return "true";
                else return "false"
            })(),
            type: "managedEnum",
            onChange() {}
        }] : [], ...process.env.ANTHROPIC_API_KEY ? [{
            id: "apiKey",
            label: s6.createElement(V, null, "Use custom API key:", " ", s6.createElement(V, {
                bold: !0
            }, cT(process.env.ANTHROPIC_API_KEY))),
            searchText: "Use custom API key",
            value: Boolean(process.env.ANTHROPIC_API_KEY && O.customApiKeyResponses?.approved?.includes(cT(process.env.ANTHROPIC_API_KEY))),
            type: "boolean",
            onChange(f1) {
                jA((R1) => {
                    let H1 = {
                        ...R1
                    };
                    if (!H1.customApiKeyResponses) H1.customApiKeyResponses = {
                        approved: [],
                        rejected: []
                    };
                    if (!H1.customApiKeyResponses.approved) H1.customApiKeyResponses = {
                        ...H1.customApiKeyResponses,
                        approved: []
                    };
                    if (!H1.customApiKeyResponses.rejected) H1.customApiKeyResponses = {
                        ...H1.customApiKeyResponses,
                        rejected: []
                    };
                    if (process.env.ANTHROPIC_API_KEY) {
                        let y1 = cT(process.env.ANTHROPIC_API_KEY);
                        if (f1) H1.customApiKeyResponses = {
                            ...H1.customApiKeyResponses,
                            approved: [...(H1.customApiKeyResponses.approved ?? []).filter((B1) => B1 !== y1), y1],
                            rejected: (H1.customApiKeyResponses.rejected ?? []).filter((B1) => B1 !== y1)
                        };
                        else H1.customApiKeyResponses = {
                            ...H1.customApiKeyResponses,
                            approved: (H1.customApiKeyResponses.approved ?? []).filter((B1) => B1 !== y1),
                            rejected: [...(H1.customApiKeyResponses.rejected ?? []).filter((B1) => B1 !== y1), y1]
                        }
                    }
                    return H1
                }), _(f6())
            }
        }] : []],
        G1 = s6.useMemo(() => {
            if (!D1) return $1;
            let f1 = D1.toLowerCase();
            return $1.filter((R1) => {
                if (R1.id.toLowerCase().includes(f1)) return !0;
                return ("searchText" in R1 ? R1.searchText : R1.label).toLowerCase().includes(f1)
            })
        }, [$1, D1]);
    s6.useEffect(() => {
        if (k >= G1.length) y(Math.max(0, G1.length - 1))
    }, [G1.length, k]);
    let L1 = aZ.useCallback(() => {
        if (t !== null) return;
        let f1 = Object.entries(O1).map(([y1, B1]) => {
                return c("tengu_config_changed", {
                    key: y1,
                    value: B1
                }), `Set ${y1} to ${H6.bold(B1)}`
            }),
            R1 = Boolean(process.env.ANTHROPIC_API_KEY && D.current.customApiKeyResponses?.approved?.includes(cT(process.env.ANTHROPIC_API_KEY))),
            H1 = Boolean(process.env.ANTHROPIC_API_KEY && O.customApiKeyResponses?.approved?.includes(cT(process.env.ANTHROPIC_API_KEY)));
        if (R1 !== H1) f1.push(`${H1?"Enabled":"Disabled"} custom API key`), c("tengu_config_changed", {
            key: "env.ANTHROPIC_API_KEY",
            value: H1
        });
        if (O.theme !== D.current.theme) f1.push(`Set theme to ${H6.bold(O.theme)}`);
        if (O.preferredNotifChannel !== D.current.preferredNotifChannel) f1.push(`Set notifications to ${H6.bold(O.preferredNotifChannel)}`);
        if (W !== f.current) f1.push(`Set output style to ${H6.bold(W)}`);
        if (Z !== T.current) f1.push(`Set response language to ${H6.bold(Z??"Default (English)")}`);
        if (O.editorMode !== D.current.editorMode) f1.push(`Set editor mode to ${H6.bold(O.editorMode||"emacs")}`);
        if (O.diffTool !== D.current.diffTool) f1.push(`Set diff tool to ${H6.bold(O.diffTool)}`);
        if (O.autoConnectIde !== D.current.autoConnectIde) f1.push(`${O.autoConnectIde?"Enabled":"Disabled"} auto-connect to IDE`);
        if (O.autoInstallIdeExtension !== D.current.autoInstallIdeExtension) f1.push(`${O.autoInstallIdeExtension?"Enabled":"Disabled"} auto-install IDE extension`);
        if (O.autoCompactEnabled !== D.current.autoCompactEnabled) f1.push(`${O.autoCompactEnabled?"Enabled":"Disabled"} auto-compact`);
        if (O.respectGitignore !== D.current.respectGitignore) f1.push(`${O.respectGitignore?"Enabled":"Disabled"} respect .gitignore in file picker`);
        if (O.terminalProgressBarEnabled !== D.current.terminalProgressBarEnabled) f1.push(`${O.terminalProgressBarEnabled?"Enabled":"Disabled"} terminal progress bar`);
        if (j?.autoUpdatesChannel !== P.current?.autoUpdatesChannel) f1.push(`Set auto-update channel to ${H6.bold(j?.autoUpdatesChannel??"latest")}`);
        if (f1.length > 0) A(f1.join(`
`));
        else A("Config dialog dismissed", {
            display: "system"
        })
    }, [t, O1, O, U, W, Z, j?.autoUpdatesChannel, i4() ? j?.fastMode : void 0, A]);
    DA("confirm:no", L1, {
        context: "Settings",
        isActive: t === null
    });
    let x1 = aZ.useCallback(() => {
        let f1 = G1[k];
        if (!f1 || !f1.onChange) return;
        if (f1.type === "boolean") {
            if (f1.onChange(!f1.value), f1.id === "thinkingEnabled") {
                if (!f1.value === N1.current) q1(!1);
                else if (q.messages.some((y1) => y1.type === "assistant")) q1(!0)
            }
            return
        }
        if (f1.id === "theme" || f1.id === "model" || f1.id === "showExternalIncludesDialog" || f1.id === "outputStyle" || f1.id === "language") switch (f1.id) {
            case "theme":
                J1(0), K(!0), z(!0);
                return;
            case "model":
                J1(1), K(!0);
                return;
            case "showExternalIncludesDialog":
                J1(2), K(!0), Y(!0);
                return;
            case "outputStyle":
                J1(3), K(!0);
                return;
            case "language":
                J1(5), K(!0);
                return
        }
        if (f1.id === "autoUpdatesChannel") {
            if (z1) {
                J1(6), K(!0);
                return
            }
            if ((j?.autoUpdatesChannel ?? "latest") === "latest") J1(4), K(!0);
            else Z7("userSettings", {
                autoUpdatesChannel: "latest",
                minimumVersion: void 0
            }), M((H1) => ({
                ...H1,
                autoUpdatesChannel: "latest",
                minimumVersion: void 0
            })), c("tengu_autoupdate_channel_changed", {
                channel: "latest"
            });
            return
        }
        if (f1.type === "enum") {
            let H1 = (f1.options.indexOf(f1.value) + 1) % f1.options.length;
            f1.onChange(f1.options[H1]);
            return
        }
    }, [z1, G1, k, j?.autoUpdatesChannel, K, z, Y]);
    return c7({
        "select:previous": () => {
            if (q1(!1), k === 0) m(!0);
            else y((f1) => Math.max(0, f1 - 1))
        },
        "select:next": () => {
            q1(!1), y((f1) => Math.min(G1.length - 1, f1 + 1))
        },
        "select:accept": x1,
        "settings:search": () => {
            m(!0), Z1("")
        }
    }, {
        context: "Settings",
        isActive: t === null && !b
    }), D8((f1, R1) => {
        if (R1.escape) {
            if (D1.length > 0) Z1("");
            else m(!1);
            return
        }
        if (R1.return || R1.downArrow) m(!1), y(0)
    }, {
        isActive: b && t === null
    }), D8((f1, R1) => {
        if (!R1.ctrl && !R1.meta && f1.length > 0 && !/^\s+$/.test(f1)) m(!0), Z1(f1)
    }, {
        isActive: !b && t === null
    }), s6.createElement(I, {
        flexDirection: "column",
        width: "100%"
    }, t === 0 ? s6.createElement(s6.Fragment, null, s6.createElement(zZ1, {
        initialTheme: H,
        onThemeSelect: (f1) => {
            $(f1), J1(null), z(!1), K(!1)
        },
        onCancel: () => {
            J1(null), z(!1), K(!1)
        },
        hideEscToCancel: !0,
        skipExitHandling: !0
    }), s6.createElement(I, {
        marginLeft: 1
    }, s6.createElement(V, {
        dimColor: !0,
        italic: !0
    }, s6.createElement(oA, null, s6.createElement(YA, {
        shortcut: "Enter",
        action: "select"
    }), s6.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))))) : t === 1 ? s6.createElement(s6.Fragment, null, s6.createElement(wZ1, {
        initial: U,
        onSelect: (f1, R1) => {
            Y1(f1), J1(null), K(!1)
        },
        onCancel: () => {
            J1(null), K(!1)
        },
        showPenguinsNotice: i4() ? l && x$(U) && lH() : !1
    }), s6.createElement(V, {
        dimColor: !0
    }, s6.createElement(oA, null, s6.createElement(YA, {
        shortcut: "Enter",
        action: "confirm"
    }), s6.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))) : t === 2 ? s6.createElement(s6.Fragment, null, s6.createElement(OV6, {
        onDone: () => {
            J1(null), K(!1), Y(!1)
        },
        externalIncludes: su1()
    }), s6.createElement(V, {
        dimColor: !0
    }, s6.createElement(oA, null, s6.createElement(YA, {
        shortcut: "Enter",
        action: "confirm"
    }), s6.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "disable external includes"
    })))) : t === 3 ? s6.createElement(s6.Fragment, null, s6.createElement(_V6, {
        initialStyle: W,
        onComplete: (f1) => {
            G(f1 ?? Wj), J1(null), K(!1), Z7("localSettings", {
                outputStyle: f1
            }), c("tengu_output_style_changed", {
                style: f1 ?? Wj,
                source: "config_panel",
                settings_source: "localSettings"
            })
        },
        onCancel: () => {
            J1(null), K(!1)
        }
    }), s6.createElement(V, {
        dimColor: !0
    }, s6.createElement(oA, null, s6.createElement(YA, {
        shortcut: "Enter",
        action: "confirm"
    }), s6.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))) : t === 5 ? s6.createElement(s6.Fragment, null, s6.createElement(t8q, {
        initialLanguage: Z,
        onComplete: (f1) => {
            N(f1), J1(null), K(!1), Z7("userSettings", {
                language: f1
            }), c("tengu_language_changed", {
                language: f1 ?? "default",
                source: "config_panel"
            })
        },
        onCancel: () => {
            J1(null), K(!1)
        }
    }), s6.createElement(V, {
        dimColor: !0
    }, s6.createElement(oA, null, s6.createElement(YA, {
        shortcut: "Enter",
        action: "confirm"
    }), s6.createElement(NA, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })))) : t === 6 ? s6.createElement(w8, {
        title: "Enable Auto-Updates",
        onCancel: () => {
            J1(null), K(!1)
        },
        hideBorder: !0,
        hideInputGuide: !0
    }, z1 !== "config" ? s6.createElement(s6.Fragment, null, s6.createElement(V, null, "Auto-updates are controlled by an environment variable and cannot be changed here."), s6.createElement(V, {
        dimColor: !0
    }, "Unset", " ", z1?.includes("NONESSENTIAL") ? "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC" : "DISABLE_AUTOUPDATER", " ", "to re-enable auto-updates.")) : s6.createElement(kA, {
        options: [{
            label: "Enable with latest channel",
            value: "latest"
        }, {
            label: "Enable with stable channel",
            value: "stable"
        }],
        onChange: (f1) => {
            J1(null), K(!1), jA((R1) => ({
                ...R1,
                autoUpdates: !0
            })), _({
                ...f6(),
                autoUpdates: !0
            }), Z7("userSettings", {
                autoUpdatesChannel: f1,
                minimumVersion: void 0
            }), M((R1) => ({
                ...R1,
                autoUpdatesChannel: f1,
                minimumVersion: void 0
            })), c("tengu_autoupdate_enabled", {
                channel: f1
            })
        }
    })) : t === 4 ? s6.createElement(o8q, {
        currentVersion: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION,
        onChoice: (f1) => {
            if (J1(null), K(!1), f1 === "cancel") return;
            let R1 = {
                autoUpdatesChannel: "stable"
            };
            if (f1 === "stay") R1.minimumVersion = {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.38",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-02-10T00:04:56Z"
            }.VERSION;
            Z7("userSettings", R1), M((H1) => ({
                ...H1,
                ...R1
            })), c("tengu_autoupdate_channel_changed", {
                channel: "stable",
                minimum_version_set: f1 === "stay"
            })
        }
    }) : s6.createElement(I, {
        flexDirection: "column",
        marginY: 1,
        gap: 1
    }, s6.createElement(V, null, "Configure Claude Code preferences"), s6.createElement(AF, {
        query: D1,
        isFocused: b,
        isTerminalFocused: g,
        cursorOffset: E1,
        placeholder: "Search settings..."
    }), s6.createElement(I, {
        flexDirection: "column"
    }, G1.length === 0 ? s6.createElement(V, {
        dimColor: !0,
        italic: !0
    }, 'No settings match "', D1, '"') : G1.map((f1, R1) => {
        let H1 = R1 === k;
        return s6.createElement(s6.Fragment, {
            key: f1.id
        }, s6.createElement(I, null, s6.createElement(I, {
            width: 44
        }, s6.createElement(V, {
            color: H1 ? "suggestion" : void 0
        }, H1 ? l1.pointer : " ", " ", f1.label)), s6.createElement(I, {
            key: H1 ? "selected" : "unselected"
        }, f1.type === "boolean" ? s6.createElement(s6.Fragment, null, s6.createElement(V, {
            color: H1 ? "suggestion" : void 0
        }, f1.value.toString()), j1 && f1.id === "thinkingEnabled" && s6.createElement(V, {
            color: "warning"
        }, " ", "Changing thinking mode mid-conversation will increase latency and may reduce quality.")) : f1.id === "theme" ? s6.createElement(V, {
            color: H1 ? "suggestion" : void 0
        }, (() => {
            return {
                dark: "Dark mode",
                light: "Light mode",
                "dark-daltonized": "Dark mode (colorblind-friendly)",
                "light-daltonized": "Light mode (colorblind-friendly)",
                "dark-ansi": "Dark mode (ANSI colors only)",
                "light-ansi": "Light mode (ANSI colors only)"
            } [f1.value.toString()] || f1.value.toString()
        })()) : f1.id === "notifChannel" ? s6.createElement(V, {
            color: H1 ? "suggestion" : void 0
        }, (() => {
            switch (f1.value.toString()) {
                case "auto":
                    return "Auto";
                case "iterm2":
                    return s6.createElement(s6.Fragment, null, "iTerm2 ", s6.createElement(V, {
                        dimColor: !0
                    }, "(OSC 9)"));
                case "terminal_bell":
                    return s6.createElement(s6.Fragment, null, "Terminal Bell ", s6.createElement(V, {
                        dimColor: !0
                    }, "(\\a)"));
                case "kitty":
                    return s6.createElement(s6.Fragment, null, "Kitty ", s6.createElement(V, {
                        dimColor: !0
                    }, "(OSC 99)"));
                case "ghostty":
                    return s6.createElement(s6.Fragment, null, "Ghostty ", s6.createElement(V, {
                        dimColor: !0
                    }, "(OSC 777)"));
                case "iterm2_with_bell":
                    return "iTerm2 w/ Bell";
                case "notifications_disabled":
                    return "Disabled";
                default:
                    return f1.value.toString()
            }
        })()) : f1.id === "defaultPermissionMode" ? s6.createElement(V, {
            color: H1 ? "suggestion" : void 0
        }, CQ(f1.value)) : f1.id === "autoUpdatesChannel" && z1 ? s6.createElement(I, {
            flexDirection: "column"
        }, s6.createElement(V, {
            color: H1 ? "suggestion" : void 0
        }, "disabled"), s6.createElement(V, {
            dimColor: !0
        }, "(", z1, ")")) : s6.createElement(V, {
            color: H1 ? "suggestion" : void 0
        }, f1.value.toString()))))
    })), b ? s6.createElement(V, {
        dimColor: !0
    }, s6.createElement(oA, null, s6.createElement(V, null, "Type to filter"), s6.createElement(YA, {
        shortcut: "Enter/↓",
        action: "select"
    }), s6.createElement(NA, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "clear"
    }))) : s6.createElement(V, {
        dimColor: !0
    }, s6.createElement(oA, null, s6.createElement(NA, {
        action: "select:accept",
        context: "Settings",
        fallback: "Enter/Space",
        description: "change"
    }), s6.createElement(NA, {
        action: "settings:search",
        context: "Settings",
        fallback: "/",
        description: "search"
    }), s6.createElement(NA, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })))))
}
// @from(Ln 394916, Col 4)
s6
// @from(Ln 394916, Col 8)
aZ
// @from(Ln 394917, Col 4)
q7q = v(() => {
    m1();
    K7();
    b7();
    cA();
    $R1();
    cA();
    q3();
    oj();
    y6();
    u6();
    wV6();
    d8();
    $V6();
    e7();
    cIA();
    a8q();
    Bq();
    wY();
    lIA();
    e8q();
    dD();
    wK();
    BK();
    HK();
    HZ1();
    q$();
    p8();
    Em();
    hA();
    mU1();
    U4();
    S9();
    KW1();
    $Z1();
    OJ();
    s6 = o(X1(), 1), aZ = o(X1(), 1)
})
// @from(Ln 394955, Col 0)
async function K7q() {
    if (!i8()) return {};
    let A = a4();
    if (A && uQ(A.expiresAt)) return null;
    let q = DH();
    if (q.error) throw Error(`Auth error: ${q.error}`);
    let K = {
            "Content-Type": "application/json",
            "User-Agent": XH(),
            ...q.headers
        },
        Y = `${P4().BASE_API_URL}/api/oauth/usage`;
    return (await sA.get(Y, {
        headers: K,
        timeout: 5000
    })).data
}
// @from(Ln 394972, Col 4)
Y7q = v(() => {
    y5();
    B0();
    Uz();
    J7();
    Pk()
})
// @from(Ln 394980, Col 0)
function Wp1() {
    if (!x8("tengu_copper_lantern", !1)) return !1;
    if (!dC()) return !1;
    let A = dK();
    if (A !== "pro" && A !== "max") return !1;
    if (f6().hasVisitedExtraUsage) return !1;
    let K = u3();
    if (K?.subscriptionCreatedAt) {
        let Y = ep("tengu_copper_lantern_config", {
            meridian: "2026-02-05T07:59:00Z"
        });
        if (new Date(K.subscriptionCreatedAt) >= new Date(Y.meridian)) return !1
    }
    return !0
}
// @from(Ln 394996, Col 0)
function DrY() {
    if ((f6().opus46FeedSeenCount ?? 0) >= XrY) return !1;
    return !0
}
// @from(Ln 395001, Col 0)
function jrY() {
    if (!x8("tengu_silver_lantern", !1)) return null;
    if (Wp1()) return i4() ? "promo-copper" : "promo";
    if (DrY()) return "launch-only";
    return null
}
// @from(Ln 395008, Col 0)
function JV6() {
    let [A] = z7q.useState(MrY);
    return A
}
// @from(Ln 395013, Col 0)
function MrY() {
    return jrY()
}
// @from(Ln 395017, Col 0)
function XV6() {
    let q = (f6().opus46FeedSeenCount ?? 0) + 1;
    jA((K) => ({
        ...K,
        opus46FeedSeenCount: q
    })), c("tengu_opus46_feed_shown", {
        seen_count: q
    })
}
// @from(Ln 395027, Col 0)
function PrY(A) {
    switch (A) {
        case "promo-copper":
            return i4() && lH() ? "Opus 4.6 is here · $50 free extra usage · Try fast mode or use it when you hit a limit /extra-usage to enable" : "Opus 4.6 is here · $50 free extra usage · /extra-usage to enable";
        case "promo":
            return "Opus 4.6 is here · $50 free extra usage · /extra-usage to enable";
        case "launch-only":
            return "Opus 4.6 is here · Most capable for ambitious work"
    }
}
// @from(Ln 395038, Col 0)
function WrY(A) {
    switch (A) {
        case "promo-copper":
        case "promo":
            return 39;
        case "launch-only":
            return 0
    }
}
// @from(Ln 395048, Col 0)
function w7q(A) {
    let q = e(9),
        {
            variant: K,
            maxWidth: Y
        } = A,
        z, w, H;
    if (q[0] !== Y || q[1] !== K) {
        w = Symbol.for("react.early_return_sentinel");
        A: {
            let O = PrY(K);
            if (H = Y ? DY(O, Y) : O, z = WrY(K), z > 0 && z < H.length) {
                w = mI.createElement(V, {
                    dimColor: !0
                }, mI.createElement(V, {
                    color: "claude"
                }, H.slice(0, z)), H.slice(z));
                break A
            }
        }
        q[0] = Y, q[1] = K, q[2] = z, q[3] = w, q[4] = H
    } else z = q[2], w = q[3], H = q[4];
    if (w !== Symbol.for("react.early_return_sentinel")) return w;
    if (z > 0) {
        let O;
        if (q[5] !== H) O = mI.createElement(V, {
            dimColor: !0
        }, mI.createElement(V, {
            color: "claude"
        }, H)), q[5] = H, q[6] = O;
        else O = q[6];
        return O
    }
    let $;
    if (q[7] !== H) $ = mI.createElement(V, {
        dimColor: !0
    }, H), q[7] = H, q[8] = $;
    else $ = q[8];
    return $
}
// @from(Ln 395088, Col 4)
mI
// @from(Ln 395088, Col 8)
z7q
// @from(Ln 395088, Col 13)
XrY = 3
// @from(Ln 395089, Col 4)
Gp1 = v(() => {
    i1();
    m1();
    cA();
    J7();
    U4();
    u6();
    OJ();
    vq();
    mI = o(X1(), 1), z7q = o(X1(), 1)
})
// @from(Ln 395101, Col 0)
function H7q(A) {
    let q = e(34),
        {
            title: K,
            limit: Y,
            maxWidth: z,
            showTimeInReset: w,
            extraSubtext: H
        } = A,
        $ = w === void 0 ? !0 : w,
        {
            utilization: O,
            resets_at: _
        } = Y;
    if (O === null) return null;
    let J = `${Math.floor(O)}% used`,
        X;
    if (_) {
        let D;
        if (q[0] !== _ || q[1] !== $) D = S17(_, !0, $), q[0] = _, q[1] = $, q[2] = D;
        else D = q[2];
        X = `Resets ${D}`
    }
    if (H)
        if (X) X = `${H} · ${X}`;
        else X = H;
    if (z >= 62) {
        let D;
        if (q[3] !== K) D = f7.createElement(V, {
            bold: !0
        }, K), q[3] = K, q[4] = D;
        else D = q[4];
        let j = O / 100,
            M;
        if (q[5] !== j) M = f7.createElement(ig1, {
            ratio: j,
            width: 50,
            fillColor: "rate_limit_fill",
            emptyColor: "rate_limit_empty"
        }), q[5] = j, q[6] = M;
        else M = q[6];
        let P;
        if (q[7] !== J) P = f7.createElement(V, null, J), q[7] = J, q[8] = P;
        else P = q[8];
        let W;
        if (q[9] !== M || q[10] !== P) W = f7.createElement(I, {
            flexDirection: "row",
            gap: 1
        }, M, P), q[9] = M, q[10] = P, q[11] = W;
        else W = q[11];
        let G;
        if (q[12] !== X) G = X && f7.createElement(V, {
            dimColor: !0
        }, X), q[12] = X, q[13] = G;
        else G = q[13];
        let f;
        if (q[14] !== D || q[15] !== W || q[16] !== G) f = f7.createElement(I, {
            flexDirection: "column"
        }, D, W, G), q[14] = D, q[15] = W, q[16] = G, q[17] = f;
        else f = q[17];
        return f
    } else {
        let D;
        if (q[18] !== K) D = f7.createElement(V, {
            bold: !0
        }, K), q[18] = K, q[19] = D;
        else D = q[19];
        let j;
        if (q[20] !== X) j = X && f7.createElement(f7.Fragment, null, f7.createElement(V, null, " "), f7.createElement(V, {
            dimColor: !0
        }, "· ", X)), q[20] = X, q[21] = j;
        else j = q[21];
        let M;
        if (q[22] !== D || q[23] !== j) M = f7.createElement(V, null, D, j), q[22] = D, q[23] = j, q[24] = M;
        else M = q[24];
        let P = O / 100,
            W;
        if (q[25] !== z || q[26] !== P) W = f7.createElement(ig1, {
            ratio: P,
            width: z,
            fillColor: "rate_limit_fill",
            emptyColor: "rate_limit_empty"
        }), q[25] = z, q[26] = P, q[27] = W;
        else W = q[27];
        let G;
        if (q[28] !== J) G = f7.createElement(V, null, J), q[28] = J, q[29] = G;
        else G = q[29];
        let f;
        if (q[30] !== M || q[31] !== W || q[32] !== G) f = f7.createElement(I, {
            flexDirection: "column"
        }, M, W, G), q[30] = M, q[31] = W, q[32] = G, q[33] = f;
        else f = q[33];
        return f
    }
}
// @from(Ln 395197, Col 0)
function $7q() {
    let [A, q] = OZ1.useState(null), [K, Y] = OZ1.useState(null), [z, w] = OZ1.useState(!0), {
        columns: H
    } = Z8(), $ = H - 2, O = Math.min($, 80), _ = f7.useCallback(async () => {
        w(!0), Y(null);
        try {
            let X = await K7q();
            q(X)
        } catch (X) {
            K1(X);
            let D = X,
                j = D.response?.data ? Q1(D.response.data) : void 0;
            Y(j ? `Failed to load usage data: ${j}` : "Failed to load usage data")
        } finally {
            w(!1)
        }
    }, []);
    if (OZ1.useEffect(() => {
            _()
        }, [_]), DA("settings:retry", () => {
            _()
        }, {
            context: "Settings",
            isActive: !!K && !z
        }), K) return f7.createElement(I, {
        flexDirection: "column",
        marginTop: 1,
        gap: 1
    }, f7.createElement(V, {
        color: "error"
    }, "Error: ", K), f7.createElement(V, {
        dimColor: !0
    }, f7.createElement(oA, null, f7.createElement(NA, {
        action: "settings:retry",
        context: "Settings",
        fallback: "r",
        description: "retry"
    }), f7.createElement(NA, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    }))));
    if (!A) return f7.createElement(I, {
        flexDirection: "column",
        marginTop: 1,
        gap: 1
    }, f7.createElement(V, {
        dimColor: !0
    }, "Loading usage data…"), f7.createElement(V, {
        dimColor: !0
    }, f7.createElement(NA, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })));
    let J = [{
        title: "Current session",
        limit: A.five_hour
    }, {
        title: "Current week (all models)",
        limit: A.seven_day
    }, {
        title: "Current week (Sonnet only)",
        limit: A.seven_day_sonnet
    }];
    return f7.createElement(I, {
        flexDirection: "column",
        marginTop: 1,
        gap: 1,
        width: "100%"
    }, J.some(({
        limit: X
    }) => X) || f7.createElement(V, {
        dimColor: !0
    }, "/usage is only available for subscription plans."), J.map(({
        title: X,
        limit: D
    }) => D && f7.createElement(H7q, {
        key: X,
        title: X,
        limit: D,
        maxWidth: O
    })), A.extra_usage && f7.createElement(GrY, {
        extraUsage: A.extra_usage,
        maxWidth: O
    }), Wp1() ? i4() && lH() ? f7.createElement(V, {
        dimColor: !0
    }, f7.createElement(V, {
        color: "claude"
    }, "$50 free extra usage"), " · for fast mode or when you hit limits /extra-usage to enable") : f7.createElement(V, {
        dimColor: !0
    }, f7.createElement(V, {
        color: "claude"
    }, "$50 free extra usage"), " · /extra-usage to enable") : null, f7.createElement(V, {
        dimColor: !0
    }, f7.createElement(NA, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })))
}
// @from(Ln 395302, Col 0)
function GrY(A) {
    let q = e(20),
        {
            extraUsage: K,
            maxWidth: Y
        } = A,
        z = dK();
    if (!(z === "pro" || z === "max")) return !1;
    if (!K.is_enabled) {
        if (os.isEnabled()) {
            let Z;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) Z = f7.createElement(I, {
                flexDirection: "column"
            }, f7.createElement(V, {
                bold: !0
            }, nIA), f7.createElement(V, {
                dimColor: !0
            }, "Extra usage not enabled • /extra-usage to enable")), q[0] = Z;
            else Z = q[0];
            return Z
        }
        return null
    }
    if (K.monthly_limit === null) {
        let Z;
        if (q[1] === Symbol.for("react.memo_cache_sentinel")) Z = f7.createElement(I, {
            flexDirection: "column"
        }, f7.createElement(V, {
            bold: !0
        }, nIA), f7.createElement(V, {
            dimColor: !0
        }, "Unlimited")), q[1] = Z;
        else Z = q[1];
        return Z
    }
    if (typeof K.used_credits !== "number" || typeof K.utilization !== "number") return null;
    let H = K.used_credits / 100,
        $;
    if (q[2] !== H) $ = JC1(H, 2), q[2] = H, q[3] = $;
    else $ = q[3];
    let O = $,
        _ = K.monthly_limit / 100,
        J;
    if (q[4] !== _) J = JC1(_, 2), q[4] = _, q[5] = J;
    else J = q[5];
    let X = J,
        D, j, M, P;
    if (q[6] !== K.utilization) {
        let Z = new Date,
            N = new Date(Z.getFullYear(), Z.getMonth() + 1, 1);
        D = H7q, P = nIA, j = K.utilization, M = N.toISOString(), q[6] = K.utilization, q[7] = D, q[8] = j, q[9] = M, q[10] = P
    } else D = q[7], j = q[8], M = q[9], P = q[10];
    let W;
    if (q[11] !== j || q[12] !== M) W = {
        utilization: j,
        resets_at: M
    }, q[11] = j, q[12] = M, q[13] = W;
    else W = q[13];
    let G = `${O} / ${X} spent`,
        f;
    if (q[14] !== D || q[15] !== Y || q[16] !== P || q[17] !== W || q[18] !== G) f = f7.createElement(D, {
        title: P,
        limit: W,
        showTimeInReset: !1,
        extraSubtext: G,
        maxWidth: Y
    }), q[14] = D, q[15] = Y, q[16] = P, q[17] = W, q[18] = G, q[19] = f;
    else f = q[19];
    return f
}
// @from(Ln 395372, Col 4)
f7
// @from(Ln 395372, Col 8)
OZ1
// @from(Ln 395372, Col 13)
nIA = "Extra usage"
// @from(Ln 395373, Col 4)
O7q = v(() => {
    i1();
    m1();
    mq();
    Y7q();
    y6();
    iyA();
    BK();
    HK();
    K7();
    YQ1();
    DL();
    J7();
    vq();
    m6();
    Gp1();
    OJ();
    f7 = o(X1(), 1), OZ1 = o(X1(), 1)
})
// @from(Ln 395393, Col 0)
function _Z1(A) {
    let q = e(28),
        {
            onClose: K,
            context: Y,
            defaultTab: z
        } = A,
        [w, H] = Zp1.useState(!1),
        [$, O] = Zp1.useState(!1),
        [_, J] = Zp1.useState(!1),
        [X, D] = Zp1.useState(z === "Config"),
        j;
    if (q[0] !== K || q[1] !== w) j = () => {
        if (w) return;
        K("Status dialog dismissed", {
            display: "system"
        })
    }, q[0] = K, q[1] = w, q[2] = j;
    else j = q[2];
    let M = j,
        P = !w,
        W;
    if (q[3] !== P) W = {
        context: "Settings",
        isActive: P
    }, q[3] = P, q[4] = W;
    else W = q[4];
    DA("confirm:no", M, W);
    let G;
    if (q[5] !== Y) G = mJ.createElement(LH, {
        key: "status",
        title: "Status"
    }, mJ.createElement(d8q, {
        context: Y
    })), q[5] = Y, q[6] = G;
    else G = q[6];
    let f;
    if (q[7] !== Y || q[8] !== K) f = mJ.createElement(LH, {
        key: "config",
        title: "Config"
    }, mJ.createElement(A7q, {
        context: Y,
        onClose: K,
        setTabsHidden: H,
        setIsWarning: O,
        setHideMargin: J,
        onSearchModeChange: D
    })), q[7] = Y, q[8] = K, q[9] = f;
    else f = q[9];
    let Z;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) Z = mJ.createElement(LH, {
        key: "usage",
        title: "Usage"
    }, mJ.createElement($7q, null)), q[10] = Z;
    else Z = q[10];
    let N;
    if (q[11] !== G || q[12] !== f) N = [G, f, Z], q[11] = G, q[12] = f, q[13] = N;
    else N = q[13];
    let T = N,
        k = $ ? "warning" : "permission",
        y = !$,
        B;
    if (q[14] !== k || q[15] !== y) B = mJ.createElement(CY, {
        dividerColor: k,
        dividerDimColor: y
    }), q[14] = k, q[15] = y, q[16] = B;
    else B = q[16];
    let S = _ ? 0 : 1,
        m;
    if (q[17] !== X || q[18] !== z || q[19] !== T || q[20] !== w) m = mJ.createElement($y, {
        title: "Settings:",
        color: "permission",
        defaultTab: z,
        hidden: w,
        disableNavigation: X
    }, T), q[17] = X, q[18] = z, q[19] = T, q[20] = w, q[21] = m;
    else m = q[21];
    let b;
    if (q[22] !== S || q[23] !== m) b = mJ.createElement(I, {
        marginX: S
    }, m), q[22] = S, q[23] = m, q[24] = b;
    else b = q[24];
    let g;
    if (q[25] !== B || q[26] !== b) g = mJ.createElement(I, {
        flexDirection: "column"
    }, B, b), q[25] = B, q[26] = b, q[27] = g;
    else g = q[27];
    return g
}
// @from(Ln 395482, Col 4)
mJ
// @from(Ln 395482, Col 8)
Zp1
// @from(Ln 395483, Col 4)
DV6 = v(() => {
    i1();
    m1();
    K7();
    kW();
    X91();
    c8q();
    q7q();
    O7q();
    mJ = o(X1(), 1), Zp1 = o(X1(), 1)
})
// @from(Ln 395494, Col 4)
_7q = {}
// @from(Ln 395498, Col 4)
rIA
// @from(Ln 395498, Col 9)
ZrY = async (A, q) => {
    return rIA.createElement(_Z1, {
        onClose: A,
        context: q,
        defaultTab: "Config"
    })
}
// @from(Ln 395505, Col 4)
J7q = v(() => {
    DV6();
    rIA = o(X1(), 1)
})
// @from(Ln 395509, Col 4)
frY
// @from(Ln 395509, Col 9)
X7q
// @from(Ln 395510, Col 4)
D7q = v(() => {
    frY = {
        aliases: ["settings"],
        type: "local-jsx",
        name: "config",
        description: "Open config panel",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (J7q(), _7q)),
        userFacingName() {
            return "config"
        }
    }, X7q = frY
})
// @from(Ln 395525, Col 0)
function VrY(A) {
    return `${Math.round(A/1000)}k`
}
// @from(Ln 395529, Col 0)
function j7q(A) {
    let q = new Map;
    for (let Y of A) {
        let z = Na1(Y.source),
            w = q.get(z) || [];
        w.push(Y), q.set(z, w)
    }
    for (let [Y, z] of q.entries()) q.set(Y, z.sort((w, H) => H.tokens - w.tokens));
    let K = new Map;
    for (let Y of NrY) {
        let z = q.get(Y);
        if (z) K.set(Y, z)
    }
    return K
}
// @from(Ln 395545, Col 0)
function M7q(A) {
    let q = e(95),
        {
            data: K
        } = A,
        {
            categories: Y,
            totalTokens: z,
            rawMaxTokens: w,
            percentage: H,
            gridRows: $,
            model: O,
            memoryFiles: _,
            mcpTools: J,
            deferredBuiltinTools: X,
            agents: D,
            skills: j,
            messageBreakdown: M
        } = K,
        P, W, G, f, Z, N, T, k, y, B, S, m, b, g, U, x, p, l, r, s;
    if (q[0] !== Y || q[1] !== X.length || q[2] !== $ || q[3] !== O || q[4] !== H || q[5] !== w || q[6] !== z) {
        let a = Y.filter(nrY),
            A1;
        if (q[27] !== Y) A1 = Y.some(irY), q[27] = Y, q[28] = A1;
        else A1 = q[28];
        Z = A1, f = X.length > 0;
        let M1 = Y.find(lrY);
        if (G = I, B = "column", S = 1, q[29] === Symbol.for("react.memo_cache_sentinel")) m = GA.createElement(V, {
            bold: !0
        }, "Context Usage"), q[29] = m;
        else m = q[29];
        W = I, T = "row", k = 2;
        let z1;
        if (q[30] !== $) z1 = $.map(drY), q[30] = $, q[31] = z1;
        else z1 = q[31];
        if (q[32] !== z1) y = GA.createElement(I, {
            flexDirection: "column",
            flexShrink: 0
        }, z1), q[32] = z1, q[33] = y;
        else y = q[33];
        P = I, N = "column", b = 0, g = 0;
        let Y1;
        if (q[34] !== z) Y1 = Math.round(z / 1000), q[34] = z, q[35] = Y1;
        else Y1 = q[35];
        let _1;
        if (q[36] !== w) _1 = Math.round(w / 1000), q[36] = w, q[37] = _1;
        else _1 = q[37];
        if (q[38] !== O || q[39] !== H || q[40] !== Y1 || q[41] !== _1) U = GA.createElement(V, {
            dimColor: !0
        }, O, " · ", Y1, "k/", _1, "k tokens (", H, "%)"), q[38] = O, q[39] = H, q[40] = Y1, q[41] = _1, q[42] = U;
        else U = q[42];
        if (q[43] === Symbol.for("react.memo_cache_sentinel")) x = GA.createElement(V, null, " "), p = GA.createElement(V, {
            dimColor: !0,
            italic: !0
        }, "Estimated usage by category"), q[43] = x, q[44] = p;
        else x = q[43], p = q[44];
        let $1;
        if (q[45] !== w) $1 = (G1, L1) => {
            let x1 = hD(G1.tokens),
                f1 = G1.isDeferred ? "N/A" : `${(G1.tokens/w*100).toFixed(1)}%`,
                R1 = G1.name === jV6,
                H1 = G1.name,
                y1 = G1.isDeferred ? " " : R1 ? "⛝" : "⛁";
            return GA.createElement(I, {
                key: L1
            }, GA.createElement(V, {
                color: G1.color
            }, y1), GA.createElement(V, null, " ", H1, ": "), GA.createElement(V, {
                dimColor: !0
            }, x1, " tokens (", f1, ")"))
        }, q[45] = w, q[46] = $1;
        else $1 = q[46];
        if (l = a.map($1), q[47] !== Y || q[48] !== w) r = (Y.find(prY)?.tokens ?? 0) > 0 && GA.createElement(I, null, GA.createElement(V, {
            dimColor: !0
        }, "⛶"), GA.createElement(V, null, " Free space: "), GA.createElement(V, {
            dimColor: !0
        }, VrY(Y.find(UrY)?.tokens || 0), " ", "(", ((Y.find(grY)?.tokens || 0) / w * 100).toFixed(1), "%)")), q[47] = Y, q[48] = w, q[49] = r;
        else r = q[49];
        s = M1 && M1.tokens > 0 && GA.createElement(I, null, GA.createElement(V, {
            color: M1.color
        }, "⛝"), GA.createElement(V, {
            dimColor: !0
        }, " ", M1.name, ": "), GA.createElement(V, {
            dimColor: !0
        }, hD(M1.tokens), " tokens (", (M1.tokens / w * 100).toFixed(1), "%)")), q[0] = Y, q[1] = X.length, q[2] = $, q[3] = O, q[4] = H, q[5] = w, q[6] = z, q[7] = P, q[8] = W, q[9] = G, q[10] = f, q[11] = Z, q[12] = N, q[13] = T, q[14] = k, q[15] = y, q[16] = B, q[17] = S, q[18] = m, q[19] = b, q[20] = g, q[21] = U, q[22] = x, q[23] = p, q[24] = l, q[25] = r, q[26] = s
    } else P = q[7], W = q[8], G = q[9], f = q[10], Z = q[11], N = q[12], T = q[13], k = q[14], y = q[15], B = q[16], S = q[17], m = q[18], b = q[19], g = q[20], U = q[21], x = q[22], p = q[23], l = q[24], r = q[25], s = q[26];
    let O1;
    if (q[50] !== P || q[51] !== N || q[52] !== b || q[53] !== g || q[54] !== U || q[55] !== x || q[56] !== p || q[57] !== l || q[58] !== r || q[59] !== s) O1 = GA.createElement(P, {
        flexDirection: N,
        gap: b,
        flexShrink: g
    }, U, x, p, l, r, s), q[50] = P, q[51] = N, q[52] = b, q[53] = g, q[54] = U, q[55] = x, q[56] = p, q[57] = l, q[58] = r, q[59] = s, q[60] = O1;
    else O1 = q[60];
    let T1;
    if (q[61] !== W || q[62] !== T || q[63] !== k || q[64] !== y || q[65] !== O1) T1 = GA.createElement(W, {
        flexDirection: T,
        gap: k
    }, y, O1), q[61] = W, q[62] = T, q[63] = k, q[64] = y, q[65] = O1, q[66] = T1;
    else T1 = q[66];
    let N1;
    if (q[67] !== Z || q[68] !== J) N1 = J.length > 0 && GA.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, GA.createElement(I, null, GA.createElement(V, {
        bold: !0
    }, "MCP tools"), GA.createElement(V, {
        dimColor: !0
    }, " ", "· /mcp", Z ? " (loaded on-demand)" : "")), J.some(QrY) && GA.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, GA.createElement(V, {
        dimColor: !0
    }, "Loaded"), J.filter(FrY).map(mrY)), Z && J.some(BrY) && GA.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, GA.createElement(V, {
        dimColor: !0
    }, "Available"), J.filter(urY).map(brY)), !Z && J.map(xrY)), q[67] = Z, q[68] = J, q[69] = N1;
    else N1 = q[69];
    let j1;
    if (q[70] !== X || q[71] !== f) j1 = f && GA.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, GA.createElement(I, null, GA.createElement(V, {
        bold: !0
    }, "Deferred system tools"), GA.createElement(V, {
        dimColor: !0
    }, " (loaded on-demand)")), X.some(IrY) && GA.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, GA.createElement(V, {
        dimColor: !0
    }, "Loaded"), X.filter(hrY).map(SrY)), X.some(CrY) && GA.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, GA.createElement(V, {
        dimColor: !0
    }, "Available"), X.filter(yrY).map(RrY))), q[70] = X, q[71] = f, q[72] = j1;
    else j1 = q[72];
    let q1;
    if (q[73] !== D) q1 = D.length > 0 && GA.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, GA.createElement(I, null, GA.createElement(V, {
        bold: !0
    }, "Custom agents"), GA.createElement(V, {
        dimColor: !0
    }, " · /agents")), Array.from(j7q(D).entries()).map(krY)), q[73] = D, q[74] = q1;
    else q1 = q[74];
    let t;
    if (q[75] !== _) t = _.length > 0 && GA.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, GA.createElement(I, null, GA.createElement(V, {
        bold: !0
    }, "Memory files"), GA.createElement(V, {
        dimColor: !0
    }, " · /memory")), _.map(ErY)), q[75] = _, q[76] = t;
    else t = q[76];
    let J1;
    if (q[77] !== j) J1 = j && j.tokens > 0 && GA.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, GA.createElement(I, null, GA.createElement(V, {
        bold: !0
    }, "Skills"), GA.createElement(V, {
        dimColor: !0
    }, " · /skills")), Array.from(j7q(j.skillFrontmatter).entries()).map(TrY)), q[77] = j, q[78] = J1;
    else J1 = q[78];
    let D1;
    if (q[79] !== M) D1 = M && !1, q[79] = M, q[80] = D1;
    else D1 = q[80];
    let Z1;
    if (q[81] !== N1 || q[82] !== j1 || q[83] !== q1 || q[84] !== t || q[85] !== J1 || q[86] !== D1) Z1 = GA.createElement(I, {
        flexDirection: "column",
        marginLeft: -1
    }, N1, j1, q1, t, J1, D1), q[81] = N1, q[82] = j1, q[83] = q1, q[84] = t, q[85] = J1, q[86] = D1, q[87] = Z1;
    else Z1 = q[87];
    let E1;
    if (q[88] !== G || q[89] !== B || q[90] !== S || q[91] !== m || q[92] !== T1 || q[93] !== Z1) E1 = GA.createElement(G, {
        flexDirection: B,
        paddingLeft: S
    }, m, T1, Z1), q[88] = G, q[89] = B, q[90] = S, q[91] = m, q[92] = T1, q[93] = Z1, q[94] = E1;
    else E1 = q[94];
    return E1
}
// @from(Ln 395732, Col 0)
function TrY(A) {
    let [q, K] = A;
    return GA.createElement(I, {
        key: q,
        flexDirection: "column",
        marginTop: 1
    }, GA.createElement(V, {
        dimColor: !0
    }, q), K.map(vrY))
}
// @from(Ln 395743, Col 0)
function vrY(A, q) {
    return GA.createElement(I, {
        key: q
    }, GA.createElement(V, null, "└ ", A.name, ": "), GA.createElement(V, {
        dimColor: !0
    }, hD(A.tokens), " tokens"))
}
// @from(Ln 395751, Col 0)
function ErY(A, q) {
    return GA.createElement(I, {
        key: q
    }, GA.createElement(V, null, "└ ", L3(A.path), ": "), GA.createElement(V, {
        dimColor: !0
    }, hD(A.tokens), " tokens"))
}
// @from(Ln 395759, Col 0)
function krY(A) {
    let [q, K] = A;
    return GA.createElement(I, {
        key: q,
        flexDirection: "column",
        marginTop: 1
    }, GA.createElement(V, {
        dimColor: !0
    }, q), K.map(LrY))
}
// @from(Ln 395770, Col 0)
function LrY(A, q) {
    return GA.createElement(I, {
        key: q
    }, GA.createElement(V, null, "└ ", A.agentType, ": "), GA.createElement(V, {
        dimColor: !0
    }, hD(A.tokens), " tokens"))
}
// @from(Ln 395778, Col 0)
function RrY(A, q) {
    return GA.createElement(I, {
        key: q
    }, GA.createElement(V, {
        dimColor: !0
    }, "└ ", A.name))
}
// @from(Ln 395786, Col 0)
function yrY(A) {
    return !A.isLoaded
}
// @from(Ln 395790, Col 0)
function CrY(A) {
    return !A.isLoaded
}
// @from(Ln 395794, Col 0)
function SrY(A, q) {
    return GA.createElement(I, {
        key: q
    }, GA.createElement(V, null, "└ ", A.name, ": "), GA.createElement(V, {
        dimColor: !0
    }, hD(A.tokens), " tokens"))
}
// @from(Ln 395802, Col 0)
function hrY(A) {
    return A.isLoaded
}
// @from(Ln 395806, Col 0)
function IrY(A) {
    return A.isLoaded
}
// @from(Ln 395810, Col 0)
function xrY(A, q) {
    return GA.createElement(I, {
        key: q
    }, GA.createElement(V, null, "└ ", A.name, ": "), GA.createElement(V, {
        dimColor: !0
    }, hD(A.tokens), " tokens"))
}
// @from(Ln 395818, Col 0)
function brY(A, q) {
    return GA.createElement(I, {
        key: q
    }, GA.createElement(V, {
        dimColor: !0
    }, "└ ", A.name))
}
// @from(Ln 395826, Col 0)
function urY(A) {
    return !A.isLoaded
}
// @from(Ln 395830, Col 0)
function BrY(A) {
    return !A.isLoaded
}
// @from(Ln 395834, Col 0)
function mrY(A, q) {
    return GA.createElement(I, {
        key: q
    }, GA.createElement(V, null, "└ ", A.name, ": "), GA.createElement(V, {
        dimColor: !0
    }, hD(A.tokens), " tokens"))
}
// @from(Ln 395842, Col 0)
function FrY(A) {
    return A.isLoaded
}
// @from(Ln 395846, Col 0)
function QrY(A) {
    return A.isLoaded
}
// @from(Ln 395850, Col 0)
function grY(A) {
    return A.name === "Free space"
}
// @from(Ln 395854, Col 0)
function UrY(A) {
    return A.name === "Free space"
}
// @from(Ln 395858, Col 0)
function prY(A) {
    return A.name === "Free space"
}
// @from(Ln 395862, Col 0)
function drY(A, q) {
    return GA.createElement(I, {
        key: q,
        flexDirection: "row",
        marginLeft: -1
    }, A.map(crY))
}
// @from(Ln 395870, Col 0)
function crY(A, q) {
    if (A.categoryName === "Free space") return GA.createElement(V, {
        key: q,
        dimColor: !0
    }, "⛶ ");
    if (A.categoryName === jV6) return GA.createElement(V, {
        key: q,
        color: A.color
    }, "⛝ ");
    return GA.createElement(V, {
        key: q,
        color: A.color
    }, A.squareFullness >= 0.7 ? "⛁ " : "⛀ ")
}
// @from(Ln 395885, Col 0)
function lrY(A) {
    return A.name === jV6
}
// @from(Ln 395889, Col 0)
function irY(A) {
    return A.isDeferred && A.name.includes("MCP")
}
// @from(Ln 395893, Col 0)
function nrY(A) {
    return A.tokens > 0 && A.name !== "Free space" && A.name !== jV6 && !A.isDeferred
}
// @from(Ln 395896, Col 4)
GA
// @from(Ln 395896, Col 8)
jV6 = "Autocompact buffer"
// @from(Ln 395897, Col 4)
NrY
// @from(Ln 395898, Col 4)
P7q = v(() => {
    i1();
    m1();
    E$();
    wq();
    vq();
    GA = o(X1(), 1);
    NrY = ["Project", "User", "Managed", "Plugin", "Built-in"]
})
// @from(Ln 395911, Col 0)
function orY(A) {
    let q = e(5),
        {
            children: K
        } = A,
        {
            exit: Y
        } = vD1(),
        z, w;
    if (q[0] !== Y) z = () => {
        let $ = setTimeout(Y, 0);
        return () => clearTimeout($)
    }, w = [Y], q[0] = Y, q[1] = z, q[2] = w;
    else z = q[1], w = q[2];
    G7q.useLayoutEffect(z, w);
    let H;
    if (q[3] !== K) H = Oe.createElement(Oe.Fragment, null, K), q[3] = K, q[4] = H;
    else H = q[4];
    return H
}
// @from(Ln 395932, Col 0)
function srY(A) {
    let q = A.indexOf(W7q);
    if (q === -1) return A;
    let K = q + W7q.length,
        Y = A.indexOf(arY, K);
    if (Y === -1) return A;
    return A.slice(K, Y)
}
// @from(Ln 395941, Col 0)
function oIA(A) {
    return new Promise(async (q) => {
        let K = "",
            Y = new rrY;
        Y.on("data", (w) => {
            K += w.toString()
        }), await (await _Z(Oe.createElement(orY, null, A), {
            stdout: Y,
            debug: !0
        })).waitUntilExit(), await q(srY(K))
    })
}
// @from(Ln 395953, Col 0)
async function JZ1(A) {
    let q = await oIA(A);
    return JH(q)
}
// @from(Ln 395957, Col 4)
Oe
// @from(Ln 395957, Col 8)
G7q
// @from(Ln 395957, Col 13)
W7q = "\x1B[?2026h"
// @from(Ln 395958, Col 4)
arY = "\x1B[?2026l"
// @from(Ln 395959, Col 4)
fp1 = v(() => {
    i1();
    m1();
    XL();
    Oe = o(X1(), 1), G7q = o(X1(), 1)
})
// @from(Ln 395965, Col 4)
Z7q = {}
// @from(Ln 395969, Col 0)
async function trY(A, q) {
    let {
        messages: K,
        getAppState: Y,
        options: {
            mainLoopModel: z,
            tools: w
        }
    } = q;
    u8("context");
    let H = EN(K),
        {
            messages: $
        } = await gm(H),
        O = process.stdout.columns || 80,
        _ = await Y(),
        J = await iZ6($, z, async () => _.toolPermissionContext, w, _.agentDefinitions, O, q, void 0, H),
        X = await oIA(aIA.createElement(M7q, {
            data: J
        }));
    return A(X), null
}
// @from(Ln 395991, Col 4)
aIA
// @from(Ln 395992, Col 4)
f7q = v(() => {
    P7q();
    IG1();
    fp1();
    Qt();
    N8();
    v3();
    aIA = o(X1(), 1)
})
// @from(Ln 396001, Col 4)
V7q = {}
// @from(Ln 396005, Col 0)
async function erY(A, q) {
    let {
        messages: K,
        getAppState: Y,
        options: {
            mainLoopModel: z,
            tools: w,
            agentDefinitions: H
        }
    } = q, $ = EN(K), {
        messages: O
    } = await gm($), _ = await Y(), J = await iZ6(O, z, async () => _.toolPermissionContext, w, H, void 0, q, void 0, $);
    return {
        type: "text",
        value: AoY(J)
    }
}
// @from(Ln 396023, Col 0)
function AoY(A) {
    let {
        categories: q,
        totalTokens: K,
        rawMaxTokens: Y,
        percentage: z,
        model: w,
        memoryFiles: H,
        mcpTools: $,
        agents: O,
        skills: _,
        messageBreakdown: J
    } = A, X = `## Context Usage

`;
    X += `**Model:** ${w}  
`, X += `**Tokens:** ${hD(K)} / ${hD(Y)} (${z}%)

`;
    let D = q.filter((j) => j.tokens > 0 && j.name !== "Free space" && j.name !== "Autocompact buffer");
    if (D.length > 0) {
        X += `### Estimated usage by category

`, X += `| Category | Tokens | Percentage |
`, X += `|----------|--------|------------|
`;
        for (let P of D) {
            let W = (P.tokens / Y * 100).toFixed(1);
            X += `| ${P.name} | ${hD(P.tokens)} | ${W}% |
`
        }
        let j = q.find((P) => P.name === "Free space");
        if (j && j.tokens > 0) {
            let P = (j.tokens / Y * 100).toFixed(1);
            X += `| Free space | ${hD(j.tokens)} | ${P}% |
`
        }
        let M = q.find((P) => P.name === "Autocompact buffer");
        if (M && M.tokens > 0) {
            let P = (M.tokens / Y * 100).toFixed(1);
            X += `| Autocompact buffer | ${hD(M.tokens)} | ${P}% |
`
        }
        X += `
`
    }
    if ($.length > 0) {
        X += `### MCP Tools

`, X += `| Tool | Server | Tokens |
`, X += `|------|--------|--------|
`;
        for (let j of $) X += `| ${j.name} | ${j.serverName} | ${hD(j.tokens)} |
`;
        X += `
`
    }
    if (O.length > 0) {
        X += `### Custom Agents

`, X += `| Agent Type | Source | Tokens |
`, X += `|------------|--------|--------|
`;
        for (let j of O) {
            let M;
            switch (j.source) {
                case "projectSettings":
                    M = "Project";
                    break;
                case "userSettings":
                    M = "User";
                    break;
                case "localSettings":
                    M = "Local";
                    break;
                case "flagSettings":
                    M = "Flag";
                    break;
                case "policySettings":
                    M = "Policy";
                    break;
                case "plugin":
                    M = "Plugin";
                    break;
                case "built-in":
                    M = "Built-in";
                    break;
                default:
                    M = String(j.source)
            }
            X += `| ${j.agentType} | ${M} | ${hD(j.tokens)} |
`
        }
        X += `
`
    }
    if (H.length > 0) {
        X += `### Memory Files

`, X += `| Type | Path | Tokens |
`, X += `|------|------|--------|
`;
        for (let j of H) X += `| ${j.type} | ${j.path} | ${hD(j.tokens)} |
`;
        X += `
`
    }
    if (_ && _.tokens > 0 && _.skillFrontmatter.length > 0) {
        X += `### Skills

`, X += `| Skill | Source | Tokens |
`, X += `|-------|--------|--------|
`;
        for (let j of _.skillFrontmatter) X += `| ${j.name} | ${Na1(j.source)} | ${hD(j.tokens)} |
`;
        X += `
`
    }
    return X
}
// @from(Ln 396143, Col 4)
N7q = v(() => {
    IG1();
    Qt();
    N8();
    E$();
    vq()
})
// @from(Ln 396150, Col 4)
T7q
// @from(Ln 396150, Col 9)
v7q
// @from(Ln 396151, Col 4)
E7q = v(() => {
    B6();
    T7q = {
        name: "context",
        description: "Visualize current context usage as a colored grid",
        isEnabled: () => !w4(),
        isHidden: !1,
        type: "local-jsx",
        load: () => Promise.resolve().then(() => (f7q(), Z7q)),
        userFacingName() {
            return this.name
        }
    }, v7q = {
        type: "local",
        name: "context",
        supportsNonInteractive: !0,
        description: "Show current context usage",
        get isHidden() {
            return !w4()
        },
        isEnabled() {
            return w4()
        },
        load: () => Promise.resolve().then(() => (N7q(), V7q)),
        userFacingName() {
            return "context"
        }
    }
})
// @from(Ln 396180, Col 4)
k7q = {}
// @from(Ln 396184, Col 4)
qoY = async () => {
    if (u8("cost"), i8()) {
        let A;
        if (Pv.isUsingOverage) A = "You are currently using your overages to power your Claude Code usage. We will automatically switch you back to your subscription rate limits when they reset";
        else A = "You are currently using your subscription to power your Claude Code usage";
        return {
            type: "text",
            value: A
        }
    }
    return {
        type: "text",
        value: T7A()
    }
}
// @from(Ln 396199, Col 4)
L7q = v(() => {
    DL();
    J7();
    nu();
    v3()
})
// @from(Ln 396205, Col 4)
KoY
// @from(Ln 396205, Col 9)
sIA
// @from(Ln 396206, Col 4)
R7q = v(() => {
    J7();
    KoY = {
        type: "local",
        name: "cost",
        description: "Show the total cost and duration of the current session",
        isEnabled: () => !0,
        get isHidden() {
            return i8()
        },
        supportsNonInteractive: !0,
        load: () => Promise.resolve().then(() => (L7q(), k7q)),
        userFacingName() {
            return "cost"
        }
    }, sIA = KoY
})
// @from(Ln 396223, Col 4)
y7q = () => {}
// @from(Ln 396224, Col 4)
C7q = v(() => {
    v3()
})
// @from(Ln 396228, Col 0)
function MV6() {
    let A = e(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = Vp1.createElement(V, {
        color: "permission"
    }, "Press ", Vp1.createElement(V, {
        bold: !0
    }, "Enter"), " to continue…"), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 396239, Col 4)
Vp1
// @from(Ln 396240, Col 4)
tIA = v(() => {
    i1();
    m1();
    Vp1 = o(X1(), 1)
})
// @from(Ln 396246, Col 0)
function WV6() {
    let A = e(6),
        {
            addNotification: q,
            removeNotification: K
        } = iq(),
        [Y, z] = PV6.useState(YoY),
        w;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) w = () => {
        let {
            errors: _
        } = Jc();
        z(_)
    }, A[0] = w;
    else w = A[0];
    bD1(w);
    let $, O;
    if (A[1] !== q || A[2] !== Y || A[3] !== K) $ = () => {
        if (Nq()) return;
        if (Y.length > 0) {
            let _ = `Found ${Y.length} invalid settings ${Y.length===1?"file":"files"} · /doctor for details`;
            q({
                key: S7q,
                text: _,
                color: "warning",
                priority: "high",
                timeoutMs: 60000
            })
        } else K(S7q)
    }, O = [Y, q, K], A[1] = q, A[2] = Y, A[3] = K, A[4] = $, A[5] = O;
    else $ = A[4], O = A[5];
    return PV6.useEffect($, O), Y
}
// @from(Ln 396280, Col 0)
function YoY() {
    let {
        errors: A
    } = Jc();
    return A
}
// @from(Ln 396286, Col 4)
PV6
// @from(Ln 396286, Col 9)
S7q = "settings-errors"
// @from(Ln 396287, Col 4)
eIA = v(() => {
    i1();
    B6();
    Dp1();
    o26();
    h2();
    PV6 = o(X1(), 1)
})
// @from(Ln 396296, Col 0)
function h7q(A, q = {}) {
    let {
        showValues: K = !0,
        hideFunctions: Y = !1,
        themeName: z = "dark",
        treeCharColors: w = {}
    } = q, H = [], $ = new WeakSet;

    function O(X, D) {
        if (!D) return X;
        return k8(D, z)(X)
    }

    function _(X, D, j, M = 0) {
        if (typeof X === "string") {
            H.push(D + O(X, w.value));
            return
        }
        if (typeof X !== "object" || X === null) {
            if (K) {
                let W = String(X);
                H.push(D + O(W, w.value))
            }
            return
        }
        if ($.has(X)) {
            H.push(D + O("[Circular]", w.value));
            return
        }
        $.add(X);
        let P = Object.keys(X).filter((W) => {
            let G = X[W];
            if (Y && typeof G === "function") return !1;
            return !0
        });
        P.forEach((W, G) => {
            let f = X[W],
                Z = G === P.length - 1,
                N = M === 0 && G === 0 ? "" : D,
                T = Z ? Np1.lastBranch : Np1.branch,
                k = O(T, w.treeChar),
                y = W.trim() === "" ? "" : O(W, w.key),
                B = N + k + (y ? " " + y : ""),
                S = W.trim() !== "";
            if (f && typeof f === "object" && $.has(f)) {
                let m = O("[Circular]", w.value);
                H.push(B + (S ? ": " : B ? " " : "") + m)
            } else if (f && typeof f === "object" && !Array.isArray(f)) {
                H.push(B);
                let m = Z ? Np1.empty : Np1.line,
                    b = O(m, w.treeChar),
                    g = N + b + " ";
                _(f, g, Z, M + 1)
            } else if (Array.isArray(f)) H.push(B + (S ? ": " : B ? " " : "") + "[Array(" + f.length + ")]");
            else if (K) {
                let m = typeof f === "function" ? "[Function]" : String(f),
                    b = O(m, w.value);
                B += (S ? ": " : B ? " " : "") + b, H.push(B)
            } else H.push(B)
        })
    }
    let J = Object.keys(A);
    if (J.length === 0) return O("(empty)", w.value);
    if (J.length === 1 && J[0] !== void 0 && J[0].trim() === "" && typeof A[J[0]] === "string") {
        let X = J[0],
            D = O(Np1.lastBranch, w.treeChar),
            j = O(A[X], w.value);
        return D + " " + j
    }
    return _(A, "", !0), H.join(`
`)
}
// @from(Ln 396368, Col 4)
Np1
// @from(Ln 396369, Col 4)
I7q = v(() => {
    b7();
    m1();
    Np1 = {
        branch: l1.lineUpDownRight,
        lastBranch: l1.lineUpRight,
        line: l1.lineVertical,
        empty: " "
    }
})
// @from(Ln 396380, Col 0)
function zoY(A) {
    let q = {};
    return A.forEach((K) => {
        if (!K.path) {
            q[""] = K.message;
            return
        }
        let Y = K.path.split("."),
            z = K.path;
        if (K.invalidValue !== null && K.invalidValue !== void 0 && Y.length > 0) {
            let w = [];
            for (let H = 0; H < Y.length; H++) {
                let $ = Y[H];
                if (!$) continue;
                let O = parseInt($, 10);
                if (!isNaN(O) && H === Y.length - 1) {
                    let _;
                    if (typeof K.invalidValue === "string") _ = `"${K.invalidValue}"`;
                    else if (K.invalidValue === null) _ = "null";
                    else if (K.invalidValue === void 0) _ = "undefined";
                    else _ = String(K.invalidValue);
                    w.push(_)
                } else w.push($)
            }
            z = w.join(".")
        }
        KrA(q, z, K.message, Object)
    }), q
}
// @from(Ln 396410, Col 0)
function GV6(A) {
    let q = e(9),
        {
            errors: K
        } = A,
        [Y] = T7();
    if (K.length === 0) return null;
    let z, w, H;
    if (q[0] !== K || q[1] !== Y) {
        let O = K.reduce($oY, {}),
            _ = Object.keys(O).sort();
        z = I, w = "column", H = _.map((J) => {
            let X = O[J] || [];
            X.sort(HoY);
            let D = zoY(X),
                j = new Map;
            X.forEach((P) => {
                if (P.suggestion || P.docLink) {
                    let W = `${P.suggestion||""}|${P.docLink||""}`;
                    if (!j.has(W)) j.set(W, {
                        suggestion: P.suggestion,
                        docLink: P.docLink
                    })
                }
            });
            let M = h7q(D, {
                showValues: !0,
                themeName: Y,
                treeCharColors: {
                    treeChar: "inactive",
                    key: "text",
                    value: "inactive"
                }
            });
            return A0.createElement(I, {
                key: J,
                flexDirection: "column"
            }, A0.createElement(V, null, J), A0.createElement(I, {
                marginLeft: 1
            }, A0.createElement(V, {
                dimColor: !0
            }, M)), j.size > 0 && A0.createElement(I, {
                flexDirection: "column",
                marginTop: 1
            }, Array.from(j.values()).map(woY)))
        }), q[0] = K, q[1] = Y, q[2] = z, q[3] = w, q[4] = H
    } else z = q[2], w = q[3], H = q[4];
    let $;
    if (q[5] !== z || q[6] !== w || q[7] !== H) $ = A0.createElement(z, {
        flexDirection: w
    }, H), q[5] = z, q[6] = w, q[7] = H, q[8] = $;
    else $ = q[8];
    return $
}
// @from(Ln 396465, Col 0)
function woY(A, q) {
    return A0.createElement(I, {
        key: `suggestion-pair-${q}`,
        flexDirection: "column",
        marginBottom: 1
    }, A.suggestion && A0.createElement(V, {
        dimColor: !0,
        wrap: "wrap"
    }, A.suggestion), A.docLink && A0.createElement(V, {
        dimColor: !0,
        wrap: "wrap"
    }, "Learn more: ", A.docLink))
}
// @from(Ln 396479, Col 0)
function HoY(A, q) {
    if (!A.path && q.path) return -1;
    if (A.path && !q.path) return 1;
    return (A.path || "").localeCompare(q.path || "")
}
// @from(Ln 396485, Col 0)
function $oY(A, q) {
    let K = q.file || "(file not specified)";
    if (!A[K]) A[K] = [];
    return A[K].push(q), A
}
// @from(Ln 396490, Col 4)
A0
// @from(Ln 396491, Col 4)
AxA = v(() => {
    i1();
    m1();
    YrA();
    I7q();
    A0 = o(X1(), 1)
})
// @from(Ln 396499, Col 0)
function OoY(A) {
    let q = e(26),
        {
            scope: K,
            parsingErrors: Y,
            warnings: z
        } = A,
        w = Y.length > 0,
        H = z.length > 0;
    if (!w && !H) return null;
    let $;
    if (q[0] !== w || q[1] !== H) $ = (w || H) && _$.default.createElement(V, {
        color: w ? "error" : "warning"
    }, "[", w ? "Failed to parse" : "Contains warnings", "]", " "), q[0] = w, q[1] = H, q[2] = $;
    else $ = q[2];
    let O;
    if (q[3] !== K) O = cg1(K), q[3] = K, q[4] = O;
    else O = q[4];
    let _;
    if (q[5] !== O) _ = _$.default.createElement(V, null, O), q[5] = O, q[6] = _;
    else _ = q[6];
    let J;
    if (q[7] !== $ || q[8] !== _) J = _$.default.createElement(I, null, $, _), q[7] = $, q[8] = _, q[9] = J;
    else J = q[9];
    let X;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) X = _$.default.createElement(V, {
        dimColor: !0
    }, "Location: "), q[10] = X;
    else X = q[10];
    let D;
    if (q[11] !== K) D = KG(K), q[11] = K, q[12] = D;
    else D = q[12];
    let j;
    if (q[13] !== D) j = _$.default.createElement(I, null, X, _$.default.createElement(V, {
        dimColor: !0
    }, D)), q[13] = D, q[14] = j;
    else j = q[14];
    let M;
    if (q[15] !== Y) M = Y.map(JoY), q[15] = Y, q[16] = M;
    else M = q[16];
    let P;
    if (q[17] !== z) P = z.map(_oY), q[17] = z, q[18] = P;
    else P = q[18];
    let W;
    if (q[19] !== M || q[20] !== P) W = _$.default.createElement(I, {
        marginLeft: 1,
        flexDirection: "column"
    }, M, P), q[19] = M, q[20] = P, q[21] = W;
    else W = q[21];
    let G;
    if (q[22] !== W || q[23] !== J || q[24] !== j) G = _$.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, J, j, W), q[22] = W, q[23] = J, q[24] = j, q[25] = G;
    else G = q[25];
    return G
}
// @from(Ln 396557, Col 0)
function _oY(A, q) {
    let K = A.mcpErrorMetadata?.serverName;
    return _$.default.createElement(I, {
        key: `warning-${q}`
    }, _$.default.createElement(V, null, _$.default.createElement(V, {
        dimColor: !0
    }, "└ "), _$.default.createElement(V, {
        color: "warning"
    }, "[Warning]"), _$.default.createElement(V, {
        dimColor: !0
    }, " ", K && `[${K}] `, A.path && A.path !== "" ? `${A.path}: ` : "", A.message)))
}
// @from(Ln 396570, Col 0)
function JoY(A, q) {
    let K = A.mcpErrorMetadata?.serverName;
    return _$.default.createElement(I, {
        key: `error-${q}`
    }, _$.default.createElement(V, null, _$.default.createElement(V, {
        dimColor: !0
    }, "└ "), _$.default.createElement(V, {
        color: "error"
    }, "[Error]"), _$.default.createElement(V, {
        dimColor: !0
    }, " ", K && `[${K}] `, A.path && A.path !== "" ? `${A.path}: ` : "", A.message)))
}
// @from(Ln 396583, Col 0)
function fV6() {
    let A = e(2),
        q, K;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) {
        K = Symbol.for("react.early_return_sentinel");
        A: {
            let Y = xJ("user"),
                z = xJ("project"),
                w = xJ("local"),
                H = xJ("enterprise"),
                $ = [{
                    scope: "user",
                    config: Y
                }, {
                    scope: "project",
                    config: z
                }, {
                    scope: "local",
                    config: w
                }, {
                    scope: "enterprise",
                    config: H
                }],
                O = $.some(joY),
                _ = $.some(DoY);
            if (!O && !_) {
                K = null;
                break A
            }
            q = _$.default.createElement(I, {
                flexDirection: "column",
                marginTop: 1,
                marginBottom: 1
            }, _$.default.createElement(V, {
                bold: !0
            }, "MCP Config Diagnostics"), _$.default.createElement(I, {
                marginTop: 1
            }, _$.default.createElement(V, {
                dimColor: !0
            }, "For help configuring MCP servers, see:", " ", _$.default.createElement(d7, {
                url: "https://code.claude.com/docs/en/mcp"
            }, "https://code.claude.com/docs/en/mcp"))), $.map(XoY))
        }
        A[0] = q, A[1] = K
    } else q = A[0], K = A[1];
    if (K !== Symbol.for("react.early_return_sentinel")) return K;
    return q
}
// @from(Ln 396632, Col 0)
function XoY(A) {
    let {
        scope: q,
        config: K
    } = A;
    return _$.default.createElement(OoY, {
        key: q,
        scope: q,
        parsingErrors: ZV6(K.errors, "fatal"),
        warnings: ZV6(K.errors, "warning")
    })
}
// @from(Ln 396645, Col 0)
function DoY(A) {
    let {
        config: q
    } = A;
    return ZV6(q.errors, "warning").length > 0
}
// @from(Ln 396652, Col 0)
function joY(A) {
    let {
        config: q
    } = A;
    return ZV6(q.errors, "fatal").length > 0
}
// @from(Ln 396659, Col 0)
function ZV6(A, q) {
    return A.filter((K) => K.mcpErrorMetadata?.severity === q)
}
// @from(Ln 396662, Col 4)
_$
// @from(Ln 396663, Col 4)
qxA = v(() => {
    i1();
    m1();
    nW();
    tX();
    m1();
    _$ = o(X1(), 1)
})
// @from(Ln 396672, Col 0)
function x7q() {
    let A = e(2);
    if (!Hv()) return null;
    let q, K;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) {
        K = Symbol.for("react.early_return_sentinel");
        A: {
            let Y = yq7();
            if (Y.length === 0) {
                K = null;
                break A
            }
            let z = Y.filter(GoY),
                w = Y.filter(WoY);q = FJ.default.createElement(I, {
                flexDirection: "column",
                marginTop: 1,
                marginBottom: 1
            }, FJ.default.createElement(V, {
                bold: !0,
                color: z.length > 0 ? "error" : "warning"
            }, "Keybinding Configuration Issues"), FJ.default.createElement(I, null, FJ.default.createElement(V, {
                dimColor: !0
            }, "Location: "), FJ.default.createElement(V, {
                dimColor: !0
            }, R71())), FJ.default.createElement(I, {
                marginLeft: 1,
                flexDirection: "column",
                marginTop: 1
            }, z.map(PoY), w.map(MoY)))
        }
        A[0] = q, A[1] = K
    } else q = A[0], K = A[1];
    if (K !== Symbol.for("react.early_return_sentinel")) return K;
    return q
}
// @from(Ln 396708, Col 0)
function MoY(A, q) {
    return FJ.default.createElement(I, {
        key: `warning-${q}`,
        flexDirection: "column"
    }, FJ.default.createElement(I, null, FJ.default.createElement(V, {
        dimColor: !0
    }, "└ "), FJ.default.createElement(V, {
        color: "warning"
    }, "[Warning]"), FJ.default.createElement(V, {
        dimColor: !0
    }, " ", A.message)), A.suggestion && FJ.default.createElement(I, {
        marginLeft: 3
    }, FJ.default.createElement(V, {
        dimColor: !0
    }, "→ ", A.suggestion)))
}
// @from(Ln 396725, Col 0)
function PoY(A, q) {
    return FJ.default.createElement(I, {
        key: `error-${q}`,
        flexDirection: "column"
    }, FJ.default.createElement(I, null, FJ.default.createElement(V, {
        dimColor: !0
    }, "└ "), FJ.default.createElement(V, {
        color: "error"
    }, "[Error]"), FJ.default.createElement(V, {
        dimColor: !0
    }, " ", A.message)), A.suggestion && FJ.default.createElement(I, {
        marginLeft: 3
    }, FJ.default.createElement(V, {
        dimColor: !0
    }, "→ ", A.suggestion)))
}
// @from(Ln 396742, Col 0)
function WoY(A) {
    return A.severity === "warning"
}
// @from(Ln 396746, Col 0)
function GoY(A) {
    return A.severity === "error"
}
// @from(Ln 396749, Col 4)
FJ
// @from(Ln 396750, Col 4)
b7q = v(() => {
    i1();
    m1();
    AU();
    FJ = o(X1(), 1)
})
// @from(Ln 396757, Col 0)
function u7q() {
    return gL6().map((q) => ({
        name: q.name,
        value: process.env[q.name],
        ...q.validate(process.env[q.name])
    })).filter((q) => q.status !== "valid")
}
// @from(Ln 396764, Col 4)
B7q = v(() => {
    B6()
})
// @from(Ln 396768, Col 0)
function Tp1(A) {
    if (!A) return 0;
    return A.activeAgents.filter((q) => q.source !== "built-in").reduce((q, K) => {
        let Y = `${K.agentType}: ${K.whenToUse}`;
        return q + A2(Y)
    }, 0)
}
// @from(Ln 396775, Col 4)
T91 = 15000
// @from(Ln 396776, Col 4)
KxA = v(() => {
    vv()
})
// @from(Ln 396779, Col 0)
async function ZoY() {
    let A = DK1();
    if (A.length === 0) return null;
    let q = A.sort((Y, z) => z.content.length - Y.content.length).map((Y) => `${Y.path}: ${Y.content.length.toLocaleString()} chars`);
    return {
        type: "claudemd_files",
        severity: "warning",
        message: A.length === 1 ? `Large CLAUDE.md file detected (${A[0].content.length.toLocaleString()} chars > ${Cp.toLocaleString()})` : `${A.length} large CLAUDE.md files detected (each > ${Cp.toLocaleString()} chars)`,
        details: q,
        currentValue: A.length,
        threshold: Cp
    }
}
// @from(Ln 396792, Col 0)
async function foY(A) {
    if (!A) return null;
    let q = Tp1(A);
    if (q <= T91) return null;
    let K = A.activeAgents.filter((z) => z.source !== "built-in").map((z) => {
            let w = `${z.agentType}: ${z.whenToUse}`;
            return {
                name: z.agentType,
                tokens: A2(w)
            }
        }).sort((z, w) => w.tokens - z.tokens),
        Y = K.slice(0, 5).map((z) => `${z.name}: ~${z.tokens.toLocaleString()} tokens`);
    if (K.length > 5) Y.push(`(${K.length-5} more custom agents)`);
    return {
        type: "agent_descriptions",
        severity: "warning",
        message: `Large agent descriptions (~${q.toLocaleString()} tokens > ${T91.toLocaleString()})`,
        details: Y,
        currentValue: q,
        threshold: T91
    }
}
// @from(Ln 396814, Col 0)
async function VoY(A, q, K) {
    let Y = A.filter((z) => z.isMcp);
    if (Y.length === 0) return null;
    if (O$()) return null;
    try {
        let z = l3(),
            {
                mcpToolTokens: w,
                mcpToolDetails: H
            } = await yU1(A, q, K, z);
        if (w <= XZ1) return null;
        let $ = new Map;
        for (let J of H) {
            let D = J.name.split("__")[1] || "unknown",
                j = $.get(D) || {
                    count: 0,
                    tokens: 0
                };
            $.set(D, {
                count: j.count + 1,
                tokens: j.tokens + J.tokens
            })
        }
        let O = Array.from($.entries()).sort((J, X) => X[1].tokens - J[1].tokens),
            _ = O.slice(0, 5).map(([J, X]) => `${J}: ${X.count} tools (~${X.tokens.toLocaleString()} tokens)`);
        if (O.length > 5) _.push(`(${O.length-5} more servers)`);
        return {
            type: "mcp_tools",
            severity: "warning",
            message: `Large MCP tools context (~${w.toLocaleString()} tokens > ${XZ1.toLocaleString()})`,
            details: _,
            currentValue: w,
            threshold: XZ1
        }
    } catch (z) {
        let w = Y.reduce((H, $) => {
            let O = ($.name?.length || 0) + $.description.length;
            return H + A2(O.toString())
        }, 0);
        if (w <= XZ1) return null;
        return {
            type: "mcp_tools",
            severity: "warning",
            message: `Large MCP tools context (~${w.toLocaleString()} tokens estimated > ${XZ1.toLocaleString()})`,
            details: [`${Y.length} MCP tools detected (token count estimated)`],
            currentValue: w,
            threshold: XZ1
        }
    }
}
// @from(Ln 396864, Col 0)
async function NoY(A) {
    let q = await A(),
        K = b8.isSandboxingEnabled() && b8.isAutoAllowBashIfSandboxedEnabled(),
        Y = pD1(q, {
            sandboxAutoAllowEnabled: K
        });
    if (Y.length === 0) return null;
    let z = Y.flatMap((w) => [`${M9(w.rule.ruleValue)}: ${w.reason}`, `  Fix: ${w.fix}`]);
    return {
        type: "unreachable_rules",
        severity: "warning",
        message: `${Y.length} unreachable permission rule${Y.length===1?"":"s"} detected`,
        details: z,
        currentValue: Y.length,
        threshold: 0
    }
}
// @from(Ln 396881, Col 0)
async function m7q(A, q, K) {
    let [Y, z, w, H] = await Promise.all([ZoY(), foY(q), VoY(A, K, q), NoY(K)]);
    return {
        claudeMdWarning: Y,
        agentWarning: z,
        mcpWarning: w,
        unreachableRulesWarning: H
    }
}
// @from(Ln 396890, Col 4)
XZ1 = 25000
// @from(Ln 396891, Col 4)
F7q = v(() => {
    dD();
    KxA();
    IG1();
    vv();
    Tj();
    e7();
    Dw6();
    k2()
})
// @from(Ln 396902, Col 0)
function Q7q() {
    let A = e(2);
    if (!b8.isSupportedPlatform()) return null;
    if (!b8.isSandboxEnabledInSettings()) return null;
    let q, K;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) {
        K = Symbol.for("react.early_return_sentinel");
        A: {
            let Y = b8.checkDependencies(),
                z = Y.errors.length > 0,
                w = Y.warnings.length > 0;
            if (!z && !w) {
                K = null;
                break A
            }
            q = Lj.default.createElement(I, {
                flexDirection: "column"
            }, Lj.default.createElement(V, {
                bold: !0
            }, "Sandbox"), Lj.default.createElement(V, null, "└ Status: ", Lj.default.createElement(V, {
                color: z ? "error" : "warning"
            }, z ? "Missing dependencies" : "Available (with warnings)")), Y.errors.map(voY), Y.warnings.map(ToY), z && Lj.default.createElement(V, {
                dimColor: !0
            }, "└ Run /sandbox for install instructions"))
        }
        A[0] = q, A[1] = K
    } else q = A[0], K = A[1];
    if (K !== Symbol.for("react.early_return_sentinel")) return K;
    return q
}
// @from(Ln 396933, Col 0)
function ToY(A, q) {
    return Lj.default.createElement(V, {
        key: q,
        color: "warning"
    }, "└ ", A)
}
// @from(Ln 396940, Col 0)
function voY(A, q) {
    return Lj.default.createElement(V, {
        key: q,
        color: "error"
    }, "└ ", A)
}
// @from(Ln 396946, Col 4)
Lj
// @from(Ln 396947, Col 4)
g7q = v(() => {
    i1();
    m1();
    k2();
    Lj = o(X1(), 1)
})
// @from(Ln 396953, Col 4)
U7q = {}
// @from(Ln 396961, Col 0)
function EoY(A) {
    let q = e(8),
        {
            promise: K
        } = A,
        Y = o8.use(K);
    if (!Y.latest) {
        let $;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = o8.default.createElement(V, {
            dimColor: !0
        }, "└ Failed to fetch versions"), q[0] = $;
        else $ = q[0];
        return $
    }
    let z;
    if (q[1] !== Y.stable) z = Y.stable && o8.default.createElement(V, null, "└ Stable version: ", Y.stable), q[1] = Y.stable, q[2] = z;
    else z = q[2];
    let w;
    if (q[3] !== Y.latest) w = o8.default.createElement(V, null, "└ Latest version: ", Y.latest), q[3] = Y.latest, q[4] = w;
    else w = q[4];
    let H;
    if (q[5] !== z || q[6] !== w) H = o8.default.createElement(o8.default.Fragment, null, z, w), q[5] = z, q[6] = w, q[7] = H;
    else H = q[7];
    return H
}