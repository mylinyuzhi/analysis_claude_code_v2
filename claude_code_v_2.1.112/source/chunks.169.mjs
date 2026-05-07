
// @from(Ln 437570, Col 0)
function SxK({
    onClose: q,
    context: K,
    setTabsHidden: _,
    onIsSearchModeChange: z,
    contentHeight: Y
}) {
    let {
        headerFocused: A,
        focusHeader: O
    } = uX(), w = bP(), [, $] = Zq(), j = $N6(), [H, J] = CH.useState(H8()), X = a8.useRef(H8()), [M, P] = CH.useState(v7()), W = a8.useRef(v7()), [D, Z] = CH.useState(M?.outputStyle || lk), G = a8.useRef(D), [f, v] = CH.useState(M?.language), V = a8.useRef(f), [k, N] = CH.useState(0), [R, h] = CH.useState(0), [C, x] = CH.useState(!0), B = K2(), {
        rows: m,
        columns: S
    } = s1(), F = Math.min(44, Math.max(14, S - 16)), U = Y ?? Math.min(Math.floor(m * 0.8), 30), g = Math.max(5, U - 10), c = M8((x6) => x6.mainLoopModel), n = M8((x6) => x6.verbose), l = M8((x6) => x6.thinkingEnabled), z6 = M8((x6) => q5() ? x6.fastMode : !1), A6 = M8((x6) => x6.promptSuggestionEnabled), e = M8((x6) => x6.awaySummaryEnabled), i = Wn8() || L98() === "enabled", O6 = (rF(), B7(Xe)).isBriefEntitled(), J6 = R7(), [$6, H6] = CH.useState({}), q6 = a8.useRef(l), [o] = CH.useState(() => E1("localSettings")), [_6] = CH.useState(() => E1("userSettings")), r = a8.useRef(j), t = H9(), [Y6] = CH.useState(() => {
        let x6 = t.getState();
        return {
            mainLoopModel: x6.mainLoopModel,
            mainLoopModelForSession: x6.mainLoopModelForSession,
            verbose: x6.verbose,
            thinkingEnabled: x6.thinkingEnabled,
            fastMode: x6.fastMode,
            promptSuggestionEnabled: x6.promptSuggestionEnabled,
            awaySummaryEnabled: x6.awaySummaryEnabled,
            isBriefOnly: x6.isBriefOnly,
            replBridgeEnabled: x6.replBridgeEnabled,
            replBridgeOutboundOnly: x6.replBridgeOutboundOnly,
            settings: x6.settings
        }
    }), [X6] = CH.useState(() => cL()), M6 = a8.useRef(!1), W6 = a8.useRef({}), V6 = () => Object.keys(W6.current).length > 0;
    a8.useEffect(() => kxK(() => J(H8())), []);
    let [f6, G6] = CH.useState(!1), [k6, T6] = CH.useState(null), {
        query: v6,
        setQuery: L6,
        cursorOffset: y6,
        handleKeyDown: c6,
        handlePaste: Z8
    } = bS({
        isActive: C && k6 === null && !A,
        onExit: () => x(!1),
        onExitUp: O,
        passthroughCtrlKeys: ["c", "d"]
    }), N8 = C && !A;
    a8.useEffect(() => {
        z?.(N8)
    }, [N8, z]);
    let R6 = rb8(K.options.mcpClients),
        p6 = !S6(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING),
        q8 = a8.use(GJ(!0)),
        L8 = wS8(q8),
        w8 = j$6();

    function x8(x6) {
        d("tengu_config_model_changed", {
            from_model: c,
            to_model: x6
        }), J6((v8) => ({
            ...v8,
            mainLoopModel: x6,
            mainLoopModelForSession: null
        })), H6((v8) => {
            let f1 = hE(x6) + (NP6(x6, !1, YX()) ? " · Billed as extra usage" : "");
            if ("model" in v8) {
                let {
                    model: g8,
                    ...w6
                } = v8;
                return {
                    ...w6,
                    model: f1
                }
            }
            return {
                ...v8,
                model: f1
            }
        })
    }

    function a6(x6) {
        d8((i6) => ({
            ...i6,
            verbose: x6
        })), J({
            ...H8(),
            verbose: x6
        }), J6((i6) => ({
            ...i6,
            verbose: x6
        })), H6((i6) => {
            if ("verbose" in i6) {
                let {
                    verbose: v8,
                    ...f1
                } = i6;
                return f1
            }
            return {
                ...i6,
                verbose: x6
            }
        })
    }
    let D8 = [{
            id: "autoCompactEnabled",
            label: "Auto-compact",
            value: H.autoCompactEnabled,
            type: "boolean",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    autoCompactEnabled: x6
                })), J({
                    ...H8(),
                    autoCompactEnabled: x6
                }), d("tengu_auto_compact_setting_changed", {
                    enabled: x6
                })
            }
        }, {
            id: "spinnerTipsEnabled",
            label: "Show tips",
            value: M?.spinnerTipsEnabled ?? !0,
            type: "boolean",
            onChange(x6) {
                P7("localSettings", {
                    spinnerTipsEnabled: x6
                }), P((i6) => ({
                    ...i6,
                    spinnerTipsEnabled: x6
                })), d("tengu_tips_setting_changed", {
                    enabled: x6
                })
            }
        }, {
            id: "prefersReducedMotion",
            label: "Reduce motion",
            value: M?.prefersReducedMotion ?? !1,
            type: "boolean",
            onChange(x6) {
                P7("localSettings", {
                    prefersReducedMotion: x6
                }), P((i6) => ({
                    ...i6,
                    prefersReducedMotion: x6
                })), J6((i6) => ({
                    ...i6,
                    settings: {
                        ...i6.settings,
                        prefersReducedMotion: x6
                    }
                })), d("tengu_reduce_motion_setting_changed", {
                    enabled: x6
                })
            }
        }, {
            id: "thinkingEnabled",
            label: "Thinking mode",
            value: l ?? !0,
            type: "boolean",
            onChange(x6) {
                J6((i6) => ({
                    ...i6,
                    thinkingEnabled: x6
                })), P7("userSettings", {
                    alwaysThinkingEnabled: x6 ? void 0 : !1
                }), d("tengu_thinking_toggled", {
                    enabled: x6
                })
            }
        }, ...q5() && AM() ? [{
            id: "fastMode",
            label: `Fast mode (${wB} only)`,
            value: !!z6,
            type: "boolean",
            onChange(x6) {
                if (zw6(), P7("userSettings", {
                        fastMode: x6 ? !0 : void 0
                    }), x6) J6((i6) => ({
                    ...i6,
                    mainLoopModel: $n6(),
                    mainLoopModelForSession: null,
                    fastMode: !0
                })), H6((i6) => ({
                    ...i6,
                    model: $n6(),
                    "Fast mode": "ON"
                }));
                else J6((i6) => ({
                    ...i6,
                    fastMode: !1
                })), H6((i6) => ({
                    ...i6,
                    "Fast mode": "OFF"
                }))
            }
        }] : [], ...u8("tengu_chomp_inflection", !1) ? [{
            id: "promptSuggestionEnabled",
            label: "Prompt suggestions",
            value: A6,
            type: "boolean",
            onChange(x6) {
                J6((i6) => ({
                    ...i6,
                    promptSuggestionEnabled: x6
                })), P7("userSettings", {
                    promptSuggestionEnabled: x6 ? void 0 : !1
                })
            }
        }] : [], ...u8("tengu_sedge_lantern", !0) ? [{
            id: "awaySummaryEnabled",
            label: "Session recap",
            value: e,
            type: "boolean",
            onChange(x6) {
                J6((i6) => ({
                    ...i6,
                    awaySummaryEnabled: x6
                })), P7("userSettings", {
                    awaySummaryEnabled: x6 ? void 0 : !1
                })
            }
        }] : [], ...[], ...[], ...p6 ? [{
            id: "fileCheckpointingEnabled",
            label: "Rewind code (checkpoints)",
            value: H.fileCheckpointingEnabled,
            type: "boolean",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    fileCheckpointingEnabled: x6
                })), J({
                    ...H8(),
                    fileCheckpointingEnabled: x6
                }), d("tengu_file_history_snapshots_setting_changed", {
                    enabled: x6
                })
            }
        }] : [], {
            id: "verbose",
            label: "Verbose output",
            value: n,
            type: "boolean",
            onChange: a6
        }, {
            id: "terminalProgressBarEnabled",
            label: "Terminal progress bar",
            value: H.terminalProgressBarEnabled,
            type: "boolean",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    terminalProgressBarEnabled: x6
                })), J({
                    ...H8(),
                    terminalProgressBarEnabled: x6
                }), d("tengu_terminal_progress_bar_setting_changed", {
                    enabled: x6
                })
            }
        }, ...u8("tengu_terminal_sidebar", !1) ? [{
            id: "showStatusInTerminalTab",
            label: "Show status in terminal tab",
            value: H.showStatusInTerminalTab ?? !1,
            type: "boolean",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    showStatusInTerminalTab: x6
                })), J({
                    ...H8(),
                    showStatusInTerminalTab: x6
                }), d("tengu_terminal_tab_status_setting_changed", {
                    enabled: x6
                })
            }
        }] : [], {
            id: "showTurnDuration",
            label: "Show turn duration",
            value: H.showTurnDuration,
            type: "boolean",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    showTurnDuration: x6
                })), J({
                    ...H8(),
                    showTurnDuration: x6
                }), d("tengu_show_turn_duration_setting_changed", {
                    enabled: x6
                })
            }
        }, {
            id: "defaultPermissionMode",
            label: "Default permission mode",
            value: M?.permissions?.defaultMode || "default",
            options: (() => {
                let x6 = ["default", "plan"],
                    i6 = jv,
                    v8 = ["bypassPermissions"];
                if (!i) v8.push("auto");
                return [...x6, ...i6.filter((f1) => !x6.includes(f1) && !v8.includes(f1))]
            })(),
            type: "enum",
            onChange(x6) {
                let i6 = yV(x6),
                    v8 = Jg7(i6) ? Sm(i6) : i6,
                    f1 = P7("userSettings", {
                        permissions: {
                            ...M?.permissions,
                            defaultMode: v8
                        }
                    });
                if (f1.error) {
                    j6(f1.error);
                    return
                }
                P((g8) => ({
                    ...g8,
                    permissions: {
                        ...g8?.permissions,
                        defaultMode: v8
                    }
                })), H6((g8) => ({
                    ...g8,
                    defaultPermissionMode: x6
                })), d("tengu_config_changed", {
                    setting: "defaultPermissionMode",
                    value: x6
                })
            }
        }, ...i ? [{
            id: "useAutoModeDuringPlan",
            label: "Use auto mode during plan",
            value: M?.useAutoModeDuringPlan ?? !0,
            type: "boolean",
            onChange(x6) {
                P7("userSettings", {
                    useAutoModeDuringPlan: x6
                }), P((i6) => ({
                    ...i6,
                    useAutoModeDuringPlan: x6
                })), J6((i6) => {
                    let v8 = dR6(i6.toolPermissionContext);
                    if (v8 === i6.toolPermissionContext) return i6;
                    return {
                        ...i6,
                        toolPermissionContext: v8
                    }
                }), H6((i6) => ({
                    ...i6,
                    "Use auto mode during plan": x6
                }))
            }
        }] : [], {
            id: "respectGitignore",
            label: "Respect .gitignore in file picker",
            value: H.respectGitignore,
            type: "boolean",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    respectGitignore: x6
                })), J({
                    ...H8(),
                    respectGitignore: x6
                }), d("tengu_respect_gitignore_setting_changed", {
                    enabled: x6
                })
            }
        }, {
            id: "copyFullResponse",
            label: "Skip the /copy picker",
            value: H.copyFullResponse,
            type: "boolean",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    copyFullResponse: x6
                })), J({
                    ...H8(),
                    copyFullResponse: x6
                }), d("tengu_config_changed", {
                    setting: "copyFullResponse",
                    value: String(x6)
                })
            }
        }, ...lq() ? [{
            id: "copyOnSelect",
            label: "Copy on select",
            value: H.copyOnSelect ?? !0,
            type: "boolean",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    copyOnSelect: x6
                })), J({
                    ...H8(),
                    copyOnSelect: x6
                }), d("tengu_config_changed", {
                    setting: "copyOnSelect",
                    value: String(x6)
                })
            }
        }, {
            id: "autoScrollEnabled",
            label: "Auto-scroll",
            value: H.autoScrollEnabled,
            type: "boolean",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    autoScrollEnabled: x6
                })), J({
                    ...H8(),
                    autoScrollEnabled: x6
                }), d("tengu_config_changed", {
                    setting: "autoScrollEnabled",
                    value: String(x6)
                })
            }
        }] : [], w8 ? {
            id: "autoUpdatesChannel",
            label: "Auto-update channel",
            value: "disabled",
            type: "managedEnum",
            onChange() {}
        } : {
            id: "autoUpdatesChannel",
            label: "Auto-update channel",
            value: M?.autoUpdatesChannel ?? "latest",
            type: "managedEnum",
            onChange() {}
        }, {
            id: "theme",
            label: "Theme",
            value: j,
            type: "managedEnum",
            onChange: $
        }, {
            id: "notifChannel",
            label: "Local notifications",
            value: H.preferredNotifChannel,
            options: ["auto", "iterm2", "terminal_bell", "iterm2_with_bell", "kitty", "ghostty", "notifications_disabled"],
            type: "enum",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    preferredNotifChannel: x6
                })), J({
                    ...H8(),
                    preferredNotifChannel: x6
                })
            }
        }, ...I18() && !o3() && o7()?.accessToken ? [...dI4() ? [{
            id: "inputNeededNotifEnabled",
            label: "Push when actions required",
            value: H.inputNeededNotifEnabled ?? !1,
            type: "boolean",
            onChange(x6) {
                if (!("inputNeededNotifEnabled" in W6.current)) W6.current.inputNeededNotifEnabled = H8().inputNeededNotifEnabled;
                d8((i6) => ({
                    ...i6,
                    inputNeededNotifEnabled: x6
                })), J({
                    ...H8(),
                    inputNeededNotifEnabled: x6
                }), zO7(), d("tengu_push_notif_pref_changed", {
                    key: "inputNeededNotifEnabled",
                    value: String(x6)
                })
            }
        }] : [], {
            id: "agentPushNotifEnabled",
            label: "Push when Claude decides",
            value: H.agentPushNotifEnabled ?? !1,
            type: "boolean",
            onChange(x6) {
                if (!("agentPushNotifEnabled" in W6.current)) W6.current.agentPushNotifEnabled = H8().agentPushNotifEnabled;
                d8((i6) => ({
                    ...i6,
                    agentPushNotifEnabled: x6
                })), J({
                    ...H8(),
                    agentPushNotifEnabled: x6
                }), zO7(), d("tengu_push_notif_pref_changed", {
                    key: "agentPushNotifEnabled",
                    value: String(x6)
                })
            }
        }] : [], {
            id: "outputStyle",
            label: "Output style",
            value: D,
            type: "managedEnum",
            onChange: () => {}
        }, ...O6 ? [{
            id: "defaultView",
            label: "Default view",
            value: M?.defaultView === void 0 ? "default" : String(M.defaultView),
            options: ["transcript", "chat", "default"],
            type: "enum",
            onChange(x6) {
                let i6 = x6 === "default" ? void 0 : x6;
                P7("localSettings", {
                    defaultView: i6
                }), P((f1) => ({
                    ...f1,
                    defaultView: i6
                }));
                let v8 = i6 === "chat";
                J6((f1) => {
                    if (f1.isBriefOnly === v8) return f1;
                    return {
                        ...f1,
                        isBriefOnly: v8
                    }
                }), dg(v8), H6((f1) => ({
                    ...f1,
                    "Default view": x6
                })), d("tengu_default_view_setting_changed", {
                    value: i6 ?? "unset"
                })
            }
        }] : [], {
            id: "language",
            label: "Language",
            value: f ?? "Default (English)",
            type: "managedEnum",
            onChange: () => {}
        }, {
            id: "editorMode",
            label: "Editor mode",
            value: H.editorMode === "emacs" ? "normal" : H.editorMode || "normal",
            options: ["normal", "vim"],
            type: "enum",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    editorMode: x6
                })), J({
                    ...H8(),
                    editorMode: x6
                }), d("tengu_editor_mode_changed", {
                    mode: x6,
                    source: "config_panel"
                })
            }
        }, {
            id: "externalEditorContext",
            label: "Show last response in external editor",
            value: H.externalEditorContext ?? !1,
            type: "boolean",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    externalEditorContext: x6
                })), J({
                    ...H8(),
                    externalEditorContext: x6
                }), d("tengu_external_editor_context_changed", {
                    enabled: x6
                })
            }
        }, {
            id: "prStatusFooterEnabled",
            label: "Show PR status footer",
            value: H.prStatusFooterEnabled ?? !0,
            type: "boolean",
            onChange(x6) {
                d8((i6) => {
                    if (i6.prStatusFooterEnabled === x6) return i6;
                    return {
                        ...i6,
                        prStatusFooterEnabled: x6
                    }
                }), J({
                    ...H8(),
                    prStatusFooterEnabled: x6
                }), d("tengu_pr_status_footer_setting_changed", {
                    enabled: x6
                })
            }
        }, {
            id: "model",
            label: "Model",
            value: c === null ? "Default (recommended)" : c,
            type: "managedEnum",
            onChange: x8
        }, ...R6 ? [{
            id: "diffTool",
            label: "Diff tool",
            value: H.diffTool ?? "auto",
            options: ["terminal", "auto"],
            type: "enum",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    diffTool: x6
                })), J({
                    ...H8(),
                    diffTool: x6
                }), d("tengu_diff_tool_changed", {
                    tool: x6,
                    source: "config_panel"
                })
            }
        }] : [], ...!q0() ? [{
            id: "autoConnectIde",
            label: "Auto-connect to IDE (external terminal)",
            value: H.autoConnectIde ?? !1,
            type: "boolean",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    autoConnectIde: x6
                })), J({
                    ...H8(),
                    autoConnectIde: x6
                }), d("tengu_auto_connect_ide_changed", {
                    enabled: x6,
                    source: "config_panel"
                })
            }
        }] : [], ...q0() ? [{
            id: "autoInstallIdeExtension",
            label: "Auto-install IDE extension",
            value: H.autoInstallIdeExtension ?? !0,
            type: "boolean",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    autoInstallIdeExtension: x6
                })), J({
                    ...H8(),
                    autoInstallIdeExtension: x6
                }), d("tengu_auto_install_ide_extension_changed", {
                    enabled: x6,
                    source: "config_panel"
                })
            }
        }] : [], {
            id: "claudeInChromeDefaultEnabled",
            label: "Claude in Chrome enabled by default",
            value: H.claudeInChromeDefaultEnabled ?? !0,
            type: "boolean",
            onChange(x6) {
                d8((i6) => ({
                    ...i6,
                    claudeInChromeDefaultEnabled: x6
                })), J({
                    ...H8(),
                    claudeInChromeDefaultEnabled: x6
                }), d("tengu_claude_in_chrome_setting_changed", {
                    enabled: x6
                })
            }
        }, ...z4() ? (() => {
            let x6 = Z77();
            return [{
                id: "teammateMode",
                label: x6 ? `Teammate mode [overridden: ${x6}]` : "Teammate mode",
                value: H.teammateMode ?? "auto",
                options: ["auto", "tmux", "in-process"],
                type: "enum",
                onChange(v8) {
                    if (v8 !== "auto" && v8 !== "tmux" && v8 !== "in-process") return;
                    f77(v8), d8((f1) => ({
                        ...f1,
                        teammateMode: v8
                    })), J({
                        ...H8(),
                        teammateMode: v8
                    }), d("tengu_teammate_mode_changed", {
                        mode: v8
                    })
                }
            }, {
                id: "teammateDefaultModel",
                label: "Default teammate model",
                value: RxK(H.teammateDefaultModel),
                type: "managedEnum",
                onChange() {}
            }]
        })() : [], ...mx() ? [{
            id: "remoteControlAtStartup",
            label: "Enable Remote Control for all sessions",
            value: H.remoteControlAtStartup === void 0 ? "default" : String(H.remoteControlAtStartup),
            options: ["true", "false", "default"],
            type: "enum",
            onChange(x6) {
                if (x6 === "default") d8((v8) => {
                    if (v8.remoteControlAtStartup === void 0) return v8;
                    let f1 = {
                        ...v8
                    };
                    return delete f1.remoteControlAtStartup, f1
                }), J({
                    ...H8(),
                    remoteControlAtStartup: void 0
                });
                else {
                    let v8 = x6 === "true";
                    d8((f1) => {
                        if (f1.remoteControlAtStartup === v8) return f1;
                        return {
                            ...f1,
                            remoteControlAtStartup: v8
                        }
                    }), J({
                        ...H8(),
                        remoteControlAtStartup: v8
                    })
                }
                let i6 = zd();
                J6((v8) => {
                    if (v8.replBridgeEnabled === i6 && !v8.replBridgeOutboundOnly) return v8;
                    return {
                        ...v8,
                        replBridgeEnabled: i6,
                        replBridgeOutboundOnly: !1
                    }
                })
            }
        }] : [], ...L8 ? [{
            id: "showExternalIncludesDialog",
            label: "External CLAUDE.md includes",
            value: (() => {
                if (Ew().hasClaudeMdExternalIncludesApproved) return "true";
                else return "false"
            })(),
            type: "managedEnum",
            onChange() {}
        }] : [], ...process.env.ANTHROPIC_API_KEY && !CZ() ? [{
            id: "apiKey",
            label: a8.createElement(T, null, "Use custom API key:", " ", a8.createElement(T, {
                bold: !0
            }, VE(process.env.ANTHROPIC_API_KEY))),
            searchText: "Use custom API key",
            value: Boolean(process.env.ANTHROPIC_API_KEY && H.customApiKeyResponses?.approved?.includes(VE(process.env.ANTHROPIC_API_KEY))),
            type: "boolean",
            onChange(x6) {
                d8((i6) => {
                    let v8 = {
                        ...i6
                    };
                    if (!v8.customApiKeyResponses) v8.customApiKeyResponses = {
                        approved: [],
                        rejected: []
                    };
                    if (!v8.customApiKeyResponses.approved) v8.customApiKeyResponses = {
                        ...v8.customApiKeyResponses,
                        approved: []
                    };
                    if (!v8.customApiKeyResponses.rejected) v8.customApiKeyResponses = {
                        ...v8.customApiKeyResponses,
                        rejected: []
                    };
                    if (process.env.ANTHROPIC_API_KEY) {
                        let f1 = VE(process.env.ANTHROPIC_API_KEY);
                        if (x6) v8.customApiKeyResponses = {
                            ...v8.customApiKeyResponses,
                            approved: [...(v8.customApiKeyResponses.approved ?? []).filter((g8) => g8 !== f1), f1],
                            rejected: (v8.customApiKeyResponses.rejected ?? []).filter((g8) => g8 !== f1)
                        };
                        else v8.customApiKeyResponses = {
                            ...v8.customApiKeyResponses,
                            approved: (v8.customApiKeyResponses.approved ?? []).filter((g8) => g8 !== f1),
                            rejected: [...(v8.customApiKeyResponses.rejected ?? []).filter((g8) => g8 !== f1), f1]
                        }
                    }
                    return v8
                }), J(H8())
            }
        }] : []],
        Q6 = a8.useMemo(() => {
            if (!v6) return D8;
            let x6 = v6.toLowerCase();
            return D8.filter((i6) => {
                if (i6.id.toLowerCase().includes(x6)) return !0;
                return ("searchText" in i6 ? i6.searchText : i6.label).toLowerCase().includes(x6)
            })
        }, [D8, v6]);
    a8.useEffect(() => {
        if (k >= Q6.length) {
            let x6 = Math.max(0, Q6.length - 1);
            N(x6), h(Math.max(0, x6 - g + 1));
            return
        }
        h((x6) => {
            if (k < x6) return k;
            if (k >= x6 + g) return k - g + 1;
            return x6
        })
    }, [Q6.length, k, g]);
    let W8 = CH.useCallback((x6) => {
            h((i6) => {
                if (x6 < i6) return x6;
                if (x6 >= i6 + g) return x6 - g + 1;
                return i6
            })
        }, [g]),
        G8 = CH.useCallback(() => {
            if (k6 !== null) return;
            let x6 = Object.entries($6).map(([g8, w6]) => {
                    return d("tengu_config_changed", {
                        key: g8,
                        value: w6
                    }), `Set ${g8} to ${Y8.bold(w6)}`
                }),
                i6 = CZ() ? void 0 : process.env.ANTHROPIC_API_KEY,
                v8 = Boolean(i6 && X.current.customApiKeyResponses?.approved?.includes(VE(i6))),
                f1 = Boolean(i6 && H.customApiKeyResponses?.approved?.includes(VE(i6)));
            if (v8 !== f1) x6.push(`${f1?"Enabled":"Disabled"} custom API key`), d("tengu_config_changed", {
                key: "env.ANTHROPIC_API_KEY",
                value: f1
            });
            if (H.theme !== X.current.theme) x6.push(`Set theme to ${Y8.bold(H.theme)}`);
            if (H.preferredNotifChannel !== X.current.preferredNotifChannel) x6.push(`Set notifications to ${Y8.bold(H.preferredNotifChannel)}`);
            if (D !== G.current) x6.push(`Set output style to ${Y8.bold(D)}`);
            if (f !== V.current) x6.push(`Set response language to ${Y8.bold(f??"Default (English)")}`);
            if (H.editorMode !== X.current.editorMode) x6.push(`Set editor mode to ${Y8.bold(H.editorMode||"emacs")}`);
            if (H.diffTool !== X.current.diffTool) x6.push(`Set diff tool to ${Y8.bold(H.diffTool)}`);
            if (H.autoConnectIde !== X.current.autoConnectIde) x6.push(`${H.autoConnectIde?"Enabled":"Disabled"} auto-connect to IDE`);
            if (H.autoInstallIdeExtension !== X.current.autoInstallIdeExtension) x6.push(`${H.autoInstallIdeExtension?"Enabled":"Disabled"} auto-install IDE extension`);
            if (H.autoCompactEnabled !== X.current.autoCompactEnabled) x6.push(`${H.autoCompactEnabled?"Enabled":"Disabled"} auto-compact`);
            if (H.autoScrollEnabled !== X.current.autoScrollEnabled) x6.push(`${H.autoScrollEnabled?"Enabled":"Disabled"} auto-scroll`);
            if (H.respectGitignore !== X.current.respectGitignore) x6.push(`${H.respectGitignore?"Enabled":"Disabled"} respect .gitignore in file picker`);
            if (H.copyFullResponse !== X.current.copyFullResponse) x6.push(`${H.copyFullResponse?"Enabled":"Disabled"} always copy full response`);
            if (H.copyOnSelect !== X.current.copyOnSelect) x6.push(`${H.copyOnSelect?"Enabled":"Disabled"} copy on select`);
            if (H.terminalProgressBarEnabled !== X.current.terminalProgressBarEnabled) x6.push(`${H.terminalProgressBarEnabled?"Enabled":"Disabled"} terminal progress bar`);
            if (H.showStatusInTerminalTab !== X.current.showStatusInTerminalTab) x6.push(`${H.showStatusInTerminalTab?"Enabled":"Disabled"} terminal tab status`);
            if (H.showTurnDuration !== X.current.showTurnDuration) x6.push(`${H.showTurnDuration?"Enabled":"Disabled"} turn duration`);
            if (H.remoteControlAtStartup !== X.current.remoteControlAtStartup) {
                let g8 = H.remoteControlAtStartup === void 0 ? "Reset Remote Control to default" : `${H.remoteControlAtStartup?"Enabled":"Disabled"} Remote Control for all sessions`;
                x6.push(g8)
            }
            if (M?.autoUpdatesChannel !== W.current?.autoUpdatesChannel) x6.push(`Set auto-update channel to ${Y8.bold(M?.autoUpdatesChannel??"latest")}`);
            if (x6.length > 0) q(x6.join(`
`));
            else q("Config dialog dismissed", {
                display: "system"
            })
        }, [k6, $6, H, c, D, f, M?.autoUpdatesChannel, q5() ? M?.fastMode : void 0, q]),
        s6 = CH.useCallback(() => {
            if (j !== r.current) $(r.current);
            d8((f1) => {
                let g8 = W6.current;
                return {
                    ...X.current,
                    inputNeededNotifEnabled: "inputNeededNotifEnabled" in g8 ? g8.inputNeededNotifEnabled : f1.inputNeededNotifEnabled,
                    agentPushNotifEnabled: "agentPushNotifEnabled" in g8 ? g8.agentPushNotifEnabled : f1.agentPushNotifEnabled
                }
            });
            let x6 = o;
            P7("localSettings", {
                spinnerTipsEnabled: x6?.spinnerTipsEnabled,
                prefersReducedMotion: x6?.prefersReducedMotion,
                defaultView: x6?.defaultView,
                outputStyle: x6?.outputStyle
            });
            let i6 = _6;
            P7("userSettings", {
                alwaysThinkingEnabled: i6?.alwaysThinkingEnabled,
                fastMode: i6?.fastMode,
                promptSuggestionEnabled: i6?.promptSuggestionEnabled,
                awaySummaryEnabled: i6?.awaySummaryEnabled,
                autoUpdatesChannel: i6?.autoUpdatesChannel,
                minimumVersion: i6?.minimumVersion,
                language: i6?.language,
                ...{
                    useAutoModeDuringPlan: i6?.useAutoModeDuringPlan
                },
                syntaxHighlightingDisabled: i6?.syntaxHighlightingDisabled,
                permissions: i6?.permissions === void 0 ? void 0 : {
                    ...i6.permissions,
                    defaultMode: i6.permissions.defaultMode
                }
            });
            let v8 = Y6;
            if (J6((f1) => ({
                    ...f1,
                    mainLoopModel: v8.mainLoopModel,
                    mainLoopModelForSession: v8.mainLoopModelForSession,
                    verbose: v8.verbose,
                    thinkingEnabled: v8.thinkingEnabled,
                    fastMode: v8.fastMode,
                    promptSuggestionEnabled: v8.promptSuggestionEnabled,
                    awaySummaryEnabled: v8.awaySummaryEnabled,
                    isBriefOnly: v8.isBriefOnly,
                    replBridgeEnabled: v8.replBridgeEnabled,
                    replBridgeOutboundOnly: v8.replBridgeOutboundOnly,
                    settings: v8.settings,
                    toolPermissionContext: dR6(f1.toolPermissionContext)
                })), cL() !== X6) dg(X6);
            if (V6() && !o3()) LxK(W6.current)
        }, [j, $, o, _6, Y6, X6, J6]),
        u6 = CH.useCallback(() => {
            if (k6 !== null) return;
            if (M6.current) s6();
            q("Config dialog dismissed", {
                display: "system"
            })
        }, [k6, s6, q]);
    G1("confirm:no", u6, {
        context: "Settings",
        isActive: k6 === null && !C && !A
    }), G1("settings:close", G8, {
        context: "Settings",
        isActive: k6 === null && !C && !A
    });
    let h6 = CH.useCallback(() => {
            let x6 = Q6[k];
            if (!x6 || !x6.onChange) return;
            if (x6.type === "boolean") {
                if (M6.current = !0, x6.onChange(!x6.value), x6.id === "thinkingEnabled") {
                    if (!x6.value === q6.current) G6(!1);
                    else if (K.messages.some((f1) => f1.type === "assistant")) G6(!0)
                }
                return
            }
            if (x6.id === "theme" || x6.id === "model" || x6.id === "teammateDefaultModel" || x6.id === "showExternalIncludesDialog" || x6.id === "outputStyle" || x6.id === "language") switch (x6.id) {
                case "theme":
                    T6("Theme"), _(!0);
                    return;
                case "model":
                    T6("Model"), _(!0);
                    return;
                case "teammateDefaultModel":
                    T6("TeammateModel"), _(!0);
                    return;
                case "showExternalIncludesDialog":
                    T6("ExternalIncludes"), _(!0);
                    return;
                case "outputStyle":
                    T6("OutputStyle"), _(!0);
                    return;
                case "language":
                    T6("Language"), _(!0);
                    return
            }
            if (x6.id === "autoUpdatesChannel") {
                if (w8) {
                    T6("EnableAutoUpdates"), _(!0);
                    return
                }
                if ((M?.autoUpdatesChannel ?? "latest") === "latest") T6("ChannelDowngrade"), _(!0);
                else M6.current = !0, P7("userSettings", {
                    autoUpdatesChannel: "latest",
                    minimumVersion: void 0
                }), P((v8) => ({
                    ...v8,
                    autoUpdatesChannel: "latest",
                    minimumVersion: void 0
                })), d("tengu_autoupdate_channel_changed", {
                    channel: "latest"
                });
                return
            }
            if (x6.type === "enum") {
                M6.current = !0;
                let v8 = (x6.options.indexOf(x6.value) + 1) % x6.options.length;
                x6.onChange(x6.options[v8]);
                return
            }
        }, [w8, Q6, k, M?.autoUpdatesChannel, _]),
        _8 = (x6) => {
            G6(!1);
            let i6 = Math.max(0, Math.min(Q6.length - 1, k + x6));
            N(i6), W8(i6)
        };
    L7({
        "select:previous": () => {
            if (k === 0) G6(!1), x(!0), h(0);
            else _8(-1)
        },
        "select:next": () => _8(1),
        "scroll:lineUp": () => _8(-1),
        "scroll:lineDown": () => _8(1),
        "select:accept": h6,
        "settings:search": () => {
            x(!0), L6("")
        }
    }, {
        context: "Settings",
        isActive: k6 === null && !C && !A
    });
    let R8 = CH.useCallback((x6) => {
        if (k6 !== null) return;
        if (A) return;
        if (C) {
            if (c6(x6), x6.key === "escape") {
                if (x6.preventDefault(), v6.length > 0) L6("");
                else x(!1);
                return
            }
            if (x6.key === "return" || x6.key === "down") x6.preventDefault(), x(!1), N(0), h(0);
            return
        }
        if (x6.key === "left" || x6.key === "right" || x6.key === "tab") {
            x6.preventDefault(), h6();
            return
        }
        if (x6.ctrl || x6.meta) return;
        if (x6.key.length === 1 && x6.key !== " ") x6.preventDefault(), x(!0), L6(x6.key)
    }, [k6, A, C, v6, L6, c6, h6]);
    return a8.createElement(u, {
        flexDirection: "column",
        width: "100%",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: R8,
        onPaste: Z8
    }, k6 === "Theme" ? a8.createElement(a8.Fragment, null, a8.createElement(Zx6, {
        onThemeSelect: (x6) => {
            M6.current = !0, $(x6), T6(null), _(!1)
        },
        onCancel: () => {
            T6(null), _(!1)
        },
        hideEscToCancel: !0,
        skipExitHandling: !0
    }), a8.createElement(u, null, a8.createElement(T, {
        dimColor: !0,
        italic: !0
    }, a8.createElement(z1, null, a8.createElement(A8, {
        chord: "enter",
        action: "select"
    }), a8.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))))) : k6 === "Model" ? a8.createElement(a8.Fragment, null, a8.createElement(kP6, {
        initial: c,
        onSelect: (x6, i6) => {
            M6.current = !0, x8(x6), T6(null), _(!1)
        },
        onCancel: () => {
            T6(null), _(!1)
        },
        showFastModeNotice: q5() ? z6 && zX(c) && AM() : !1
    }), a8.createElement(T, {
        dimColor: !0
    }, a8.createElement(z1, null, a8.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), a8.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))) : k6 === "TeammateModel" ? a8.createElement(a8.Fragment, null, a8.createElement(kP6, {
        initial: H.teammateDefaultModel ?? null,
        skipSettingsWrite: !0,
        headerText: "Default model for newly spawned teammates. The leader can override via the tool call's model parameter.",
        onSelect: (x6, i6) => {
            if (T6(null), _(!1), H.teammateDefaultModel === void 0 && x6 === null) return;
            M6.current = !0, d8((v8) => v8.teammateDefaultModel === x6 ? v8 : {
                ...v8,
                teammateDefaultModel: x6
            }), J({
                ...H8(),
                teammateDefaultModel: x6
            }), H6((v8) => ({
                ...v8,
                teammateDefaultModel: RxK(x6)
            })), d("tengu_teammate_default_model_changed", {
                model: x6
            })
        },
        onCancel: () => {
            T6(null), _(!1)
        }
    }), a8.createElement(T, {
        dimColor: !0
    }, a8.createElement(z1, null, a8.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), a8.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))) : k6 === "ExternalIncludes" ? a8.createElement(a8.Fragment, null, a8.createElement(KO7, {
        onDone: () => {
            T6(null), _(!1)
        },
        externalIncludes: ay6(q8)
    }), a8.createElement(T, {
        dimColor: !0
    }, a8.createElement(z1, null, a8.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), a8.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "disable external includes"
    })))) : k6 === "OutputStyle" ? a8.createElement(a8.Fragment, null, a8.createElement(WxK, {
        initialStyle: D,
        onComplete: (x6) => {
            M6.current = !0, Z(x6 ?? lk), T6(null), _(!1), P7("localSettings", {
                outputStyle: x6
            }), d("tengu_output_style_changed", {
                style: x6 ?? lk,
                source: "config_panel",
                settings_source: "localSettings"
            })
        },
        onCancel: () => {
            T6(null), _(!1)
        }
    }), a8.createElement(T, {
        dimColor: !0
    }, a8.createElement(z1, null, a8.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), a8.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))) : k6 === "Language" ? a8.createElement(a8.Fragment, null, a8.createElement(ZxK, {
        initialLanguage: f,
        onComplete: (x6) => {
            M6.current = !0, v(x6), T6(null), _(!1), P7("userSettings", {
                language: x6
            }), d("tengu_language_changed", {
                language: x6 ?? "default",
                source: "config_panel"
            })
        },
        onCancel: () => {
            T6(null), _(!1)
        }
    }), a8.createElement(T, {
        dimColor: !0
    }, a8.createElement(z1, null, a8.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), a8.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })))) : k6 === "EnableAutoUpdates" ? a8.createElement(R1, {
        title: "Enable Auto-Updates",
        onCancel: () => {
            T6(null), _(!1)
        },
        hideBorder: !0,
        hideInputGuide: !0
    }, w8?.type !== "config" ? a8.createElement(a8.Fragment, null, a8.createElement(T, null, w8?.type === "env" ? "Auto-updates are controlled by an environment variable and cannot be changed here." : "Auto-updates are disabled in development builds."), w8?.type === "env" && a8.createElement(T, {
        dimColor: !0
    }, "Unset ", w8.envVar, " to re-enable auto-updates.")) : a8.createElement(A1, {
        options: [{
            label: "Enable with latest channel",
            value: "latest"
        }, {
            label: "Enable with stable channel",
            value: "stable"
        }],
        onChange: (x6) => {
            M6.current = !0, T6(null), _(!1), d8((i6) => ({
                ...i6,
                autoUpdates: !0
            })), J({
                ...H8(),
                autoUpdates: !0
            }), P7("userSettings", {
                autoUpdatesChannel: x6,
                minimumVersion: void 0
            }), P((i6) => ({
                ...i6,
                autoUpdatesChannel: x6,
                minimumVersion: void 0
            })), d("tengu_autoupdate_enabled", {
                channel: x6
            })
        }
    })) : k6 === "ChannelDowngrade" ? a8.createElement(XxK, {
        currentVersion: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION,
        onChoice: (x6) => {
            if (T6(null), _(!1), x6 === "cancel") return;
            M6.current = !0;
            let i6 = {
                autoUpdatesChannel: "stable"
            };
            if (x6 === "stay") i6.minimumVersion = {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.VERSION;
            P7("userSettings", i6), P((v8) => ({
                ...v8,
                ...i6
            })), d("tengu_autoupdate_channel_changed", {
                channel: "stable",
                minimum_version_set: x6 === "stay"
            })
        }
    }) : a8.createElement(u, {
        flexDirection: "column",
        gap: 1,
        marginY: w ? void 0 : 1
    }, a8.createElement(wg, {
        query: v6,
        isFocused: C && !A,
        isTerminalFocused: B,
        cursorOffset: y6,
        placeholder: "Search settings…"
    }), a8.createElement(u, {
        flexDirection: "column"
    }, Q6.length === 0 ? a8.createElement(T, {
        dimColor: !0,
        italic: !0
    }, 'No settings match "', v6, '"') : a8.createElement(a8.Fragment, null, R > 0 && a8.createElement(T, {
        dimColor: !0
    }, e6.arrowUp, " ", R, " more above"), Q6.slice(R, R + g).map((x6, i6) => {
        let f1 = R + i6 === k && !A && !C;
        return a8.createElement(a8.Fragment, {
            key: x6.id
        }, a8.createElement(u, null, a8.createElement(u, {
            width: F,
            flexShrink: 0,
            marginRight: 1
        }, a8.createElement(T, {
            color: f1 ? "suggestion" : void 0,
            wrap: "truncate-end"
        }, f1 ? e6.pointer : " ", " ", x6.label)), a8.createElement(u, {
            key: f1 ? "selected" : "unselected",
            flexGrow: 1,
            minWidth: 0
        }, x6.type === "boolean" ? a8.createElement(T, {
            color: f1 ? "suggestion" : void 0,
            wrap: "truncate-end"
        }, x6.value.toString()) : x6.id === "theme" ? a8.createElement(T, {
            color: f1 ? "suggestion" : void 0,
            wrap: "truncate-end"
        }, MhY[x6.value.toString()] ?? x6.value.toString()) : x6.id === "notifChannel" ? a8.createElement(T, {
            color: f1 ? "suggestion" : void 0,
            wrap: "truncate-end"
        }, a8.createElement(WhY, {
            value: x6.value.toString()
        })) : x6.id === "defaultPermissionMode" ? a8.createElement(T, {
            color: f1 ? "suggestion" : void 0,
            wrap: "truncate-end"
        }, yr(x6.value)) : x6.id === "autoUpdatesChannel" && w8 ? a8.createElement(T, {
            color: f1 ? "suggestion" : void 0,
            wrap: "truncate-end"
        }, "disabled", " ", a8.createElement(T, {
            dimColor: !0
        }, "(", eo6(w8), ")")) : a8.createElement(T, {
            color: f1 ? "suggestion" : void 0,
            wrap: "truncate-end"
        }, x6.value.toString()))), (x6.id === "inputNeededNotifEnabled" || x6.id === "agentPushNotifEnabled") && a8.createElement(PhY, null), f6 && x6.id === "thinkingEnabled" && a8.createElement(u, {
            paddingLeft: 2
        }, a8.createElement(T, {
            color: "warning"
        }, "Changing thinking mode mid-conversation will increase latency and may reduce quality.")))
    }), R + g < Q6.length && a8.createElement(T, {
        dimColor: !0
    }, e6.arrowDown, " ", Q6.length - R - g, " ", "more below"))), A ? a8.createElement(T, {
        dimColor: !0
    }, a8.createElement(z1, null, a8.createElement(A8, {
        chord: ["left", "right", "tab"],
        action: "switch",
        format: {
            keyCase: "lower"
        }
    }), a8.createElement(A8, {
        chord: "down",
        action: "return"
    }), a8.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "close"
    }))) : C ? a8.createElement(T, {
        dimColor: !0
    }, a8.createElement(z1, null, a8.createElement(T, null, "Type to filter"), a8.createElement(A8, {
        chord: ["enter", "down"],
        action: "select"
    }), a8.createElement(A8, {
        chord: "up",
        action: "tabs"
    }), a8.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "clear"
    }))) : a8.createElement(T, {
        dimColor: !0
    }, a8.createElement(z1, null, a8.createElement(v1, {
        action: "select:accept",
        context: "Settings",
        fallback: "Space",
        description: "change"
    }), a8.createElement(v1, {
        action: "settings:close",
        context: "Settings",
        fallback: "Enter",
        description: "save"
    }), a8.createElement(v1, {
        action: "settings:search",
        context: "Settings",
        fallback: "/",
        description: "search"
    }), a8.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })))))
}
// @from(Ln 438896, Col 0)
function RxK(q) {
    if (q === void 0) return hE(JK8());
    if (q === null) return "Default (leader's model)";
    return hE(q)
}
// @from(Ln 438902, Col 0)
function WhY(q) {
    let K = s(4),
        {
            value: _
        } = q;
    switch (_) {
        case "auto":
            return "Auto";
        case "iterm2": {
            let z;
            if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = a8.createElement(T, null, "iTerm2 ", a8.createElement(T, {
                dimColor: !0
            }, "(OSC 9)")), K[0] = z;
            else z = K[0];
            return z
        }
        case "terminal_bell": {
            let z;
            if (K[1] === Symbol.for("react.memo_cache_sentinel")) z = a8.createElement(T, null, "Terminal Bell ", a8.createElement(T, {
                dimColor: !0
            }, "(\\a)")), K[1] = z;
            else z = K[1];
            return z
        }
        case "kitty": {
            let z;
            if (K[2] === Symbol.for("react.memo_cache_sentinel")) z = a8.createElement(T, null, "Kitty ", a8.createElement(T, {
                dimColor: !0
            }, "(OSC 99)")), K[2] = z;
            else z = K[2];
            return z
        }
        case "ghostty": {
            let z;
            if (K[3] === Symbol.for("react.memo_cache_sentinel")) z = a8.createElement(T, null, "Ghostty ", a8.createElement(T, {
                dimColor: !0
            }, "(OSC 777)")), K[3] = z;
            else z = K[3];
            return z
        }
        case "iterm2_with_bell":
            return "iTerm2 w/ Bell";
        case "notifications_disabled":
            return "Disabled";
        default:
            return _
    }
}
// @from(Ln 438950, Col 4)
a8
// @from(Ln 438950, Col 8)
CH
// @from(Ln 438950, Col 12)
MhY
// @from(Ln 438950, Col 17)
PhY = function() {
    if (CH.useSyncExternalStore(VxK, TxK, () => {
            return
        })?.has_active_channel !== !1) return null;
    return a8.createElement(T, {
        color: "warning",
        wrap: "truncate-end"
    }, "  ", Yg7, " No mobile registered ·", " ", a8.createElement(yq, {
        url: "https://claude.com/download#mobile"
    }, "get the app"), " and turn on notif")
}
// @from(Ln 438961, Col 4)
CxK = L(() => {
    o6();
    g6();
    u46();
    C7();
    Qq();
    A3();
    h1();
    il6();
    h1();
    Y3();
    OP();
    vX();
    U8();
    C8();
    aR();
    cn8();
    N7();
    in8();
    Sq();
    rn8();
    _O7();
    MxK();
    S4();
    g_();
    DxK();
    fxK();
    PM();
    u7();
    bK();
    Nq();
    BT();
    Mk();
    EP6();
    kj();
    a1();
    y8();
    ec();
    Q8();
    B1();
    YO7();
    q36();
    T7();
    G$();
    fO();
    QX6();
    k77();
    R_6();
    I4();
    zf();
    nO();
    AO7();
    a8 = K6(P6(), 1), CH = K6(P6(), 1);
    MhY = {
        auto: "Auto (match terminal)",
        dark: "Dark mode",
        light: "Light mode",
        "dark-daltonized": "Dark mode (colorblind-friendly)",
        "light-daltonized": "Light mode (colorblind-friendly)",
        "dark-ansi": "Dark mode (ANSI colors only)",
        "light-ansi": "Light mode (ANSI colors only)"
    }
})
// @from(Ln 439025, Col 0)
function wO7() {
    let q = rX6();
    if (!q || !q.available || q.granted) return !1;
    return oC6(q) !== null
}
// @from(Ln 439031, Col 0)
function $O7() {
    if (!wO7()) return !1;
    let q = H8();
    if (q.hasVisitedExtraUsage) return !1;
    if ((q.overageCreditUpsellSeenCount ?? 0) >= DhY) return !1;
    return !0
}
// @from(Ln 439039, Col 0)
function ZhY() {
    if (rX6() !== null) return;
    L$K()
}
// @from(Ln 439044, Col 0)
function sn8() {
    let [q] = bxK.useState(fhY);
    return q
}
// @from(Ln 439049, Col 0)
function fhY() {
    return ZhY(), $O7()
}
// @from(Ln 439053, Col 0)
function tn8() {
    let q = 0;
    d8((K) => {
        return q = (K.overageCreditUpsellSeenCount ?? 0) + 1, {
            ...K,
            overageCreditUpsellSeenCount: q
        }
    }), d("tengu_overage_credit_upsell_shown", {
        seen_count: q
    })
}
// @from(Ln 439065, Col 0)
function GhY(q) {
    return `${q} in extra usage for third-party apps · /extra-usage`
}
// @from(Ln 439069, Col 0)
function OO7(q) {
    return `${q} in extra usage`
}
// @from(Ln 439073, Col 0)
function en8(q) {
    let K = s(8),
        {
            maxWidth: _,
            twoLine: z
        } = q,
        Y, A;
    if (K[0] !== _ || K[1] !== z) {
        A = Symbol.for("react.early_return_sentinel");
        q: {
            let O = rX6();
            if (!O) {
                A = null;
                break q
            }
            let w = oC6(O);
            if (!w) {
                A = null;
                break q
            }
            if (z) {
                let J = OO7(w),
                    X;
                if (K[4] !== _) X = _ ? w5(an8, _) : an8, K[4] = _, K[5] = X;
                else X = K[5];
                let M;
                if (K[6] !== X) M = pT.createElement(T, {
                    dimColor: !0
                }, X), K[6] = X, K[7] = M;
                else M = K[7];
                A = pT.createElement(pT.Fragment, null, pT.createElement(T, {
                    color: "claude"
                }, _ ? w5(J, _) : J), M);
                break q
            }
            let $ = GhY(w),
                j = _ ? w5($, _) : $,
                H = Math.min(OO7(w).length, j.length);Y = pT.createElement(T, {
                dimColor: !0
            }, pT.createElement(T, {
                color: "claude"
            }, j.slice(0, H)), j.slice(H))
        }
        K[0] = _, K[1] = z, K[2] = Y, K[3] = A
    } else Y = K[2], A = K[3];
    if (A !== Symbol.for("react.early_return_sentinel")) return A;
    return Y
}
// @from(Ln 439122, Col 0)
function IxK() {
    let q = rX6(),
        K = q ? oC6(q) : null,
        _ = K ? OO7(K) : "extra usage credit";
    return {
        title: _,
        lines: [],
        customContent: {
            content: pT.createElement(T, {
                dimColor: !0
            }, an8),
            width: Math.max(_.length, an8.length)
        }
    }
}
// @from(Ln 439137, Col 4)
pT
// @from(Ln 439137, Col 8)
bxK
// @from(Ln 439137, Col 13)
DhY = 3
// @from(Ln 439138, Col 4)
an8 = "On us. Works on third-party apps · /extra-usage"
// @from(Ln 439139, Col 4)
r98 = L(() => {
    o6();
    g6();
    C8();
    Fg8();
    h1();
    c7();
    pT = K6(P6(), 1), bxK = K6(P6(), 1)
})
// @from(Ln 439158, Col 0)
function QhY(q) {
    let K = q.toLowerCase();
    if (K.includes("opus")) return 5;
    if (K.includes("haiku")) return 1;
    return 3
}
// @from(Ln 439165, Col 0)
function dhY(q) {
    return (q.cached + q.uncached * 10 + q.cacheCreate * 12.5 + q.output * 50) * q.modelTier
}
// @from(Ln 439168, Col 0)
async function BxK() {
    let {
        records: q,
        oversizedFiles: K
    } = await chY(7), _ = Date.now() - 86400000;
    return {
        day: mxK(q.filter((z) => z.ts >= _)),
        week: mxK(q),
        oversizedFiles: K
    }
}
// @from(Ln 439179, Col 0)
async function chY(q) {
    let K = Date.now() - q * 24 * 60 * 60 * 1000,
        _ = uf6(),
        z;
    try {
        z = await jO7(_)
    } catch ($) {
        if (D5($)) return {
            records: [],
            oversizedFiles: []
        };
        throw $
    }
    let A = (await Promise.all(z.map(($) => lhY(qi8(_, $))))).flat(),
        O = [],
        w = [];
    for (let $ = 0; $ < A.length; $ += uxK) {
        let j = A.slice($, $ + uxK),
            H = await Promise.all(j.map((J) => nhY(J, K)));
        for (let J = 0; J < H.length; J++) {
            let X = H[J];
            if (X === "oversized") w.push(j[J]);
            else
                for (let M of X) O.push(M)
        }
    }
    return {
        records: ihY(O),
        oversizedFiles: w
    }
}
// @from(Ln 439210, Col 0)
async function lhY(q) {
    let K;
    try {
        K = await jO7(q, {
            withFileTypes: !0
        })
    } catch (A) {
        if (D5(A)) return [];
        throw A
    }
    let _ = [],
        z = [];
    for (let A of K)
        if (A.isFile() && xxK(A.name) === ".jsonl") _.push(qi8(q, A.name));
        else if (A.isDirectory()) z.push(A.name);
    let Y = await Promise.all(z.map(async (A) => {
        let O = qi8(q, A, "subagents");
        try {
            return (await jO7(O, {
                recursive: !0
            })).filter(($) => xxK($) === ".jsonl").map(($) => qi8(O, $))
        } catch (w) {
            if (D5(w)) return [];
            throw w
        }
    }));
    for (let A of Y)
        for (let O of A) _.push(O);
    return _
}
// @from(Ln 439240, Col 0)
async function nhY(q, K) {
    let _;
    try {
        _ = await ThY(q)
    } catch (O) {
        if (D5(O)) return [];
        throw O
    }
    if (!_.isFile() || _.mtimeMs < K) return [];
    if (_.size > VhY) return "oversized";
    let z;
    try {
        z = await vhY(q, "utf-8")
    } catch (O) {
        if (D5(O)) return [];
        throw O
    }
    let Y = [],
        A = 0;
    while (A < z.length) {
        let O = z.indexOf(`
`, A);
        if (O === -1) O = z.length;
        let w = z.slice(A, O);
        if (A = O + 1, !w.includes(ShY) || !w.includes(ChY)) continue;
        let $ = bhY.exec(w),
            j = IhY.exec(w);
        if (!$ || !j) continue;
        let H = Date.parse($[1]);
        if (Number.isNaN(H) || H < K) continue;
        let J = Number(phY.exec(w)?.[1] ?? 0),
            X = Number(FhY.exec(w)?.[1] ?? 0),
            M = Number(ghY.exec(w)?.[1] ?? 0),
            P = Number(UhY.exec(w)?.[1] ?? 0);
        if (J + X + M + P === 0) continue;
        Y.push({
            ts: H,
            sessionId: j[1],
            cached: P,
            cacheCreate: M,
            uncached: J,
            output: X,
            isSubagent: rhY(w),
            modelTier: QhY(xhY.exec(w)?.[1] ?? ""),
            uuid: uhY.exec(w)?.[1] ?? mhY.exec(w)?.[1] ?? BhY.exec(w)?.[1] ?? ""
        })
    }
    return Y
}
// @from(Ln 439290, Col 0)
function ihY(q) {
    let K = new Set,
        _ = [];
    for (let z of q) {
        if (z.uuid && K.has(z.uuid)) continue;
        if (z.uuid) K.add(z.uuid);
        _.push(z)
    }
    return _
}
// @from(Ln 439301, Col 0)
function rhY(q) {
    return q.includes('"isSidechain":true') || q.includes('"isSidechain": true')
}
// @from(Ln 439305, Col 0)
function mxK(q) {
    let K = 0,
        _ = 0,
        z = 0,
        Y = 0,
        A = 0,
        O = new Map,
        w = new Map;
    for (let W of q) {
        let D = dhY(W);
        K += D;
        let Z = W.cached + W.cacheCreate + W.uncached;
        if (W.uncached > khY) _ += D, z++;
        if (Z > NhY) Y += D, A++;
        let G = O.get(W.sessionId);
        if (!G) G = {
            cost: 0,
            subCost: 0,
            subCount: 0,
            hours: new Set
        }, O.set(W.sessionId, G);
        if (G.cost += D, W.isSubagent) G.subCost += D, G.subCount++;
        G.hours.add(Math.floor(W.ts / 3600000));
        let f = Math.floor(W.ts / LhY),
            v = w.get(f);
        if (!v) v = {
            sids: new Set,
            cost: 0,
            count: 0
        }, w.set(f, v);
        v.sids.add(W.sessionId), v.cost += D, v.count++
    }
    let $ = 0,
        j = 0;
    for (let W of w.values())
        if (W.sids.size >= hhY) $ += W.cost, j += W.count;
    let H = 0,
        J = 0,
        X = 0,
        M = 0;
    for (let W of O.values()) {
        if (W.subCount >= EhY || W.cost > 0 && W.subCost / W.cost > yhY) H += W.cost, J++;
        if (W.hours.size >= RhY) X += W.cost, M++
    }
    let P = [{
        key: "cache_miss",
        cost: _,
        count: z
    }, {
        key: "long_context",
        cost: Y,
        count: A
    }, {
        key: "subagent_heavy",
        cost: H,
        count: J
    }, {
        key: "high_parallel",
        cost: $,
        count: j
    }, {
        key: "cron",
        cost: X,
        count: M
    }];
    return P.sort((W, D) => D.cost - W.cost), {
        totalCost: K,
        requestCount: q.length,
        sessionCount: O.size,
        behaviors: P
    }
}
// @from(Ln 439377, Col 4)
VhY = 209715200
// @from(Ln 439378, Col 4)
uxK = 16
// @from(Ln 439379, Col 4)
khY = 1e5
// @from(Ln 439380, Col 4)
NhY = 150000
// @from(Ln 439381, Col 4)
EhY = 3
// @from(Ln 439382, Col 4)
yhY = 0.5
// @from(Ln 439383, Col 4)
LhY = 300000
// @from(Ln 439384, Col 4)
hhY = 4
// @from(Ln 439385, Col 4)
RhY = 8
// @from(Ln 439386, Col 4)
ShY = '"type":"assistant"'
// @from(Ln 439387, Col 4)
ChY = '"usage":{'
// @from(Ln 439388, Col 4)
bhY
// @from(Ln 439388, Col 9)
IhY
// @from(Ln 439388, Col 14)
xhY
// @from(Ln 439388, Col 19)
uhY
// @from(Ln 439388, Col 24)
mhY
// @from(Ln 439388, Col 29)
BhY
// @from(Ln 439388, Col 34)
phY
// @from(Ln 439388, Col 39)
FhY
// @from(Ln 439388, Col 44)
ghY
// @from(Ln 439388, Col 49)
UhY
// @from(Ln 439389, Col 4)
pxK = L(() => {
    m8();
    hm();
    bhY = /"timestamp":"([^"]+)"/, IhY = /"sessionId":"([^"]+)"/, xhY = /"model":"([^"]+)"/, uhY = /"requestId":"([^"]+)"/, mhY = /"id":"(msg_[^"]+)"/, BhY = /"uuid":"([^"]+)"/, phY = /"input_tokens":(\d+)/, FhY = /"output_tokens":(\d+)/, ghY = /"cache_creation_input_tokens":(\d+)/, UhY = /"cache_read_input_tokens":(\d+)/
})
// @from(Ln 439395, Col 0)
function UxK(q) {
    let K = s(2),
        {
            maxWidth: _
        } = q;
    if (!u8("tengu_birch_compass", !1)) return null;
    let z = MK();
    if (z !== "pro" && z !== "max") return null;
    let Y;
    if (K[0] !== _) Y = kK.createElement(ahY, {
        maxWidth: _
    }), K[0] = _, K[1] = Y;
    else Y = K[1];
    return Y
}
// @from(Ln 439411, Col 0)
function ahY(q) {
    let K = s(5),
        {
            maxWidth: _
        } = q,
        [z] = yP6.useState(shY),
        Y;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = kK.createElement(JO7, null), K[0] = Y;
    else Y = K[0];
    let A;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) A = kK.createElement(u, {
        flexDirection: "column"
    }, Y, kK.createElement(u, {
        marginTop: 1
    }, kK.createElement(T, {
        dimColor: !0
    }, "Scanning local sessions…"))), K[1] = A;
    else A = K[1];
    let O = A,
        w;
    if (K[2] !== _ || K[3] !== z) w = kK.createElement(yP6.Suspense, {
        fallback: O
    }, kK.createElement(ehY, {
        maxWidth: _,
        scanPromise: z
    })), K[2] = _, K[3] = z, K[4] = w;
    else w = K[4];
    return w
}
// @from(Ln 439441, Col 0)
function shY() {
    return BxK().catch(thY)
}
// @from(Ln 439445, Col 0)
function thY(q) {
    return j6(q), {
        day: FxK,
        week: FxK,
        oversizedFiles: []
    }
}
// @from(Ln 439453, Col 0)
function HO7(q) {
    if (q.totalCost === 0) return [];
    return q.behaviors.filter((K) => K.cost / q.totalCost * 100 >= gxK)
}
// @from(Ln 439458, Col 0)
function ehY(q) {
    let K = s(46),
        {
            maxWidth: _,
            scanPromise: z
        } = q,
        Y = yP6.use(z),
        [A, O] = yP6.useState("day"),
        w = Y.oversizedFiles.length > 0,
        $;
    if (K[0] !== Y.day) $ = HO7(Y.day), K[0] = Y.day, K[1] = $;
    else $ = K[1];
    let j = $.length > 0,
        H;
    if (K[2] !== Y.week) H = HO7(Y.week), K[2] = Y.week, K[3] = H;
    else H = K[3];
    let J = H.length > 0,
        X = !w && (j || J),
        M;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) M = {
        "settings:periodDay": () => O("day"),
        "settings:periodWeek": () => O("week")
    }, K[4] = M;
    else M = K[4];
    let P;
    if (K[5] !== X) P = {
        context: "Settings",
        isActive: X
    }, K[5] = X, K[6] = P;
    else P = K[6];
    if (L7(M, P), w) {
        let B;
        if (K[7] === Symbol.for("react.memo_cache_sentinel")) B = kK.createElement(JO7, null), K[7] = B;
        else B = K[7];
        let m;
        if (K[8] !== Y.oversizedFiles.length) m = kK.createElement(T, {
            color: "error",
            wrap: "wrap"
        }, "Cannot compute breakdown — ", Y.oversizedFiles.length, " session file(s) exceed 200MB and would skew results:"), K[8] = Y.oversizedFiles.length, K[9] = m;
        else m = K[9];
        let S;
        if (K[10] !== Y.oversizedFiles) S = Y.oversizedFiles.slice(0, 3).map(qRY), K[10] = Y.oversizedFiles, K[11] = S;
        else S = K[11];
        let F;
        if (K[12] !== Y.oversizedFiles.length) F = Y.oversizedFiles.length > 3 && kK.createElement(T, {
            dimColor: !0
        }, "…and ", Y.oversizedFiles.length - 3, " more"), K[12] = Y.oversizedFiles.length, K[13] = F;
        else F = K[13];
        let U;
        if (K[14] !== m || K[15] !== S || K[16] !== F) U = kK.createElement(u, {
            flexDirection: "column"
        }, B, kK.createElement(u, {
            marginTop: 1,
            flexDirection: "column"
        }, m, S, F)), K[14] = m, K[15] = S, K[16] = F, K[17] = U;
        else U = K[17];
        return U
    }
    if (!j && !J) return null;
    let W = A === "day" ? Y.day : Y.week,
        D, Z, G, f, v, V, k, N, R;
    if (K[18] !== _ || K[19] !== A || K[20] !== W) {
        let B = HO7(W);
        if (Z = u, R = "column", K[30] === Symbol.for("react.memo_cache_sentinel")) G = kK.createElement(JO7, null), K[30] = G;
        else G = K[30];
        let m = A === "day" ? "24h" : "7d";
        if (K[31] !== m) f = kK.createElement(u, {
            marginTop: 1
        }, kK.createElement(T, {
            dimColor: !0,
            wrap: "wrap"
        }, "Last ", m, " · these are independent characteristics of your usage, not a breakdown")), K[31] = m, K[32] = f;
        else f = K[32];
        D = u, v = 1, V = "column", k = 1, N = B.length === 0 ? kK.createElement(T, {
            dimColor: !0
        }, "Nothing over ", gxK, "% in this period — try the other window.") : B.map((S) => kK.createElement(KRY, {
            key: S.key,
            stat: S,
            totalCost: W.totalCost,
            maxWidth: _
        })), K[18] = _, K[19] = A, K[20] = W, K[21] = D, K[22] = Z, K[23] = G, K[24] = f, K[25] = v, K[26] = V, K[27] = k, K[28] = N, K[29] = R
    } else D = K[21], Z = K[22], G = K[23], f = K[24], v = K[25], V = K[26], k = K[27], N = K[28], R = K[29];
    let h;
    if (K[33] !== D || K[34] !== v || K[35] !== V || K[36] !== k || K[37] !== N) h = kK.createElement(D, {
        marginTop: v,
        flexDirection: V,
        gap: k
    }, N), K[33] = D, K[34] = v, K[35] = V, K[36] = k, K[37] = N, K[38] = h;
    else h = K[38];
    let C;
    if (K[39] === Symbol.for("react.memo_cache_sentinel")) C = kK.createElement(u, {
        marginTop: 1
    }, kK.createElement(T, {
        dimColor: !0
    }, kK.createElement(z1, null, kK.createElement(v1, {
        action: "settings:periodDay",
        context: "Settings",
        fallback: "d",
        description: "day"
    }), kK.createElement(v1, {
        action: "settings:periodWeek",
        context: "Settings",
        fallback: "w",
        description: "week"
    })))), K[39] = C;
    else C = K[39];
    let x;
    if (K[40] !== Z || K[41] !== G || K[42] !== f || K[43] !== h || K[44] !== R) x = kK.createElement(Z, {
        flexDirection: R
    }, G, f, h, C), K[40] = Z, K[41] = G, K[42] = f, K[43] = h, K[44] = R, K[45] = x;
    else x = K[45];
    return x
}
// @from(Ln 439572, Col 0)
function qRY(q) {
    return kK.createElement(T, {
        key: q,
        dimColor: !0,
        wrap: "truncate-start"
    }, q)
}
// @from(Ln 439580, Col 0)
function JO7() {
    let q = s(1),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = kK.createElement(u, {
        flexDirection: "column"
    }, kK.createElement(T, {
        bold: !0,
        wrap: "wrap"
    }, "What's contributing to your limits usage?"), kK.createElement(T, {
        dimColor: !0,
        wrap: "wrap"
    }, "Approximate, based on local sessions on this machine — does not include other devices or claude.ai")), q[0] = K;
    else K = q[0];
    return K
}
// @from(Ln 439596, Col 0)
function KRY(q) {
    let K = s(22),
        {
            stat: _,
            totalCost: z,
            maxWidth: Y
        } = q,
        A = ohY[_.key],
        O, w, $, j, H, J;
    if (K[0] !== Y || K[1] !== A || K[2] !== _.cost || K[3] !== z) {
        let W = Math.round(_.cost / z * 100);
        w = u, H = "column", J = Y, O = T, $ = "wrap", j = A.headline(W), K[0] = Y, K[1] = A, K[2] = _.cost, K[3] = z, K[4] = O, K[5] = w, K[6] = $, K[7] = j, K[8] = H, K[9] = J
    } else O = K[4], w = K[5], $ = K[6], j = K[7], H = K[8], J = K[9];
    let X;
    if (K[10] !== O || K[11] !== $ || K[12] !== j) X = kK.createElement(O, {
        wrap: $
    }, j), K[10] = O, K[11] = $, K[12] = j, K[13] = X;
    else X = K[13];
    let M;
    if (K[14] !== A.body) M = kK.createElement(u, {
        paddingLeft: 1
    }, kK.createElement(T, {
        dimColor: !0,
        wrap: "wrap"
    }, A.body)), K[14] = A.body, K[15] = M;
    else M = K[15];
    let P;
    if (K[16] !== w || K[17] !== H || K[18] !== J || K[19] !== X || K[20] !== M) P = kK.createElement(w, {
        flexDirection: H,
        width: J
    }, X, M), K[16] = w, K[17] = H, K[18] = J, K[19] = X, K[20] = M, K[21] = P;
    else P = K[21];
    return P
}
// @from(Ln 439630, Col 4)
kK
// @from(Ln 439630, Col 8)
yP6
// @from(Ln 439630, Col 13)
ohY
// @from(Ln 439630, Col 18)
gxK = 10
// @from(Ln 439631, Col 4)
FxK
// @from(Ln 439632, Col 4)
QxK = L(() => {
    o6();
    g6();
    C7();
    B1();
    T7();
    pxK();
    U8();
    bK();
    Nq();
    kK = K6(P6(), 1), yP6 = K6(P6(), 1), ohY = {
        cache_miss: {
            headline: (q) => `${q}% of your usage hit a >100k-token cache miss`,
            body: "Uncached input is expensive, and often happens when sending a message to a session that has gone idle. /compact before stepping away keeps the cold-start small."
        },
        long_context: {
            headline: (q) => `${q}% of your usage was at >150k context`,
            body: "Longer sessions are more expensive even when cached. /compact mid-task, /clear when switching to new tasks."
        },
        subagent_heavy: {
            headline: (q) => `${q}% of your usage came from subagent-heavy sessions`,
            body: "Each subagent runs its own requests. Be deliberate about spawning them — and consider configuring a cheaper model for simpler subagents."
        },
        high_parallel: {
            headline: (q) => `${q}% of your usage was while 4+ sessions ran in parallel`,
            body: "All sessions share one limit. If you don't need them all at once, queueing uses it more evenly."
        },
        cron: {
            headline: (q) => `${q}% of your usage came from sessions active for 8+ hours`,
            body: "These are often background/loop sessions. Continuous usage can add up quickly so make sure it is intentional."
        }
    }, FxK = {
        totalCost: 0,
        requestCount: 0,
        sessionCount: 0,
        behaviors: []
    }
})
// @from(Ln 439671, Col 0)
function dxK(q) {
    let K = s(34),
        {
            title: _,
            limit: z,
            maxWidth: Y,
            showTimeInReset: A,
            extraSubtext: O
        } = q,
        w = A === void 0 ? !0 : A,
        {
            utilization: $,
            resets_at: j
        } = z;
    if ($ === null) return null;
    let H = `${Math.floor($)}% used`,
        J;
    if (j) {
        let X;
        if (K[0] !== j || K[1] !== w) X = TT7(j, !0, w), K[0] = j, K[1] = w, K[2] = X;
        else X = K[2];
        J = `Resets ${X}`
    }
    if (O)
        if (J) J = `${O} · ${J}`;
        else J = O;
    if (Y >= 62) {
        let X;
        if (K[3] !== _) X = sq.createElement(T, {
            bold: !0
        }, _), K[3] = _, K[4] = X;
        else X = K[4];
        let M = $ / 100,
            P;
        if (K[5] !== M) P = sq.createElement(wP6, {
            ratio: M,
            width: 50,
            fillColor: "rate_limit_fill",
            emptyColor: "rate_limit_empty"
        }), K[5] = M, K[6] = P;
        else P = K[6];
        let W;
        if (K[7] !== H) W = sq.createElement(T, null, H), K[7] = H, K[8] = W;
        else W = K[8];
        let D;
        if (K[9] !== P || K[10] !== W) D = sq.createElement(u, {
            flexDirection: "row",
            gap: 1
        }, P, W), K[9] = P, K[10] = W, K[11] = D;
        else D = K[11];
        let Z;
        if (K[12] !== J) Z = J && sq.createElement(T, {
            dimColor: !0
        }, J), K[12] = J, K[13] = Z;
        else Z = K[13];
        let G;
        if (K[14] !== X || K[15] !== D || K[16] !== Z) G = sq.createElement(u, {
            flexDirection: "column"
        }, X, D, Z), K[14] = X, K[15] = D, K[16] = Z, K[17] = G;
        else G = K[17];
        return G
    } else {
        let X;
        if (K[18] !== _) X = sq.createElement(T, {
            bold: !0
        }, _), K[18] = _, K[19] = X;
        else X = K[19];
        let M;
        if (K[20] !== J) M = J && sq.createElement(sq.Fragment, null, sq.createElement(T, null, " "), sq.createElement(T, {
            dimColor: !0
        }, "· ", J)), K[20] = J, K[21] = M;
        else M = K[21];
        let P;
        if (K[22] !== X || K[23] !== M) P = sq.createElement(T, null, X, M), K[22] = X, K[23] = M, K[24] = P;
        else P = K[24];
        let W = $ / 100,
            D;
        if (K[25] !== Y || K[26] !== W) D = sq.createElement(wP6, {
            ratio: W,
            width: Y,
            fillColor: "rate_limit_fill",
            emptyColor: "rate_limit_empty"
        }), K[25] = Y, K[26] = W, K[27] = D;
        else D = K[27];
        let Z;
        if (K[28] !== H) Z = sq.createElement(T, null, H), K[28] = H, K[29] = Z;
        else Z = K[29];
        let G;
        if (K[30] !== P || K[31] !== D || K[32] !== Z) G = sq.createElement(u, {
            flexDirection: "column"
        }, P, D, Z), K[30] = P, K[31] = D, K[32] = Z, K[33] = G;
        else G = K[33];
        return G
    }
}
// @from(Ln 439767, Col 0)
function cxK() {
    let [q, K] = fx6.useState(null), [_, z] = fx6.useState(null), [Y, A] = fx6.useState(!0), {
        columns: O
    } = s1(), w = O - 2, $ = Math.min(w, 80), j = sq.useCallback(async () => {
        A(!0), z(null);
        try {
            let M = await gg8();
            K(M)
        } catch (M) {
            j6(M);
            let P = M,
                W = P.response?.data ? I6(P.response.data) : void 0;
            z(W ? `Failed to load usage data: ${W}` : "Failed to load usage data")
        } finally {
            A(!1)
        }
    }, []);
    if (fx6.useEffect(() => {
            j()
        }, [j]), G1("settings:retry", () => {
            j()
        }, {
            context: "Settings",
            isActive: !!_ && !Y
        }), _) return sq.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, sq.createElement(T, {
        color: "error"
    }, "Error: ", _), sq.createElement(T, {
        dimColor: !0
    }, sq.createElement(z1, null, sq.createElement(v1, {
        action: "settings:retry",
        context: "Settings",
        fallback: "r",
        description: "retry"
    }), sq.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    }))));
    if (!q) return sq.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, sq.createElement(T, {
        dimColor: !0
    }, "Loading usage data…"), sq.createElement(T, {
        dimColor: !0
    }, sq.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })));
    let H = MK(),
        J = H === "max" || H === "team" || H === null,
        X = [{
            title: "Current session",
            limit: q.five_hour
        }, {
            title: "Current week (all models)",
            limit: q.seven_day
        }, ...J ? [{
            title: "Current week (Sonnet only)",
            limit: q.seven_day_sonnet
        }] : []];
    return sq.createElement(u, {
        flexDirection: "column",
        gap: 1,
        width: "100%"
    }, X.some(({
        limit: M
    }) => M) || sq.createElement(T, {
        dimColor: !0
    }, "/usage is only available for subscription plans."), X.map(({
        title: M,
        limit: P
    }) => P && sq.createElement(dxK, {
        key: M,
        title: M,
        limit: P,
        maxWidth: $
    })), sq.createElement(UxK, {
        maxWidth: $
    }), q.extra_usage && sq.createElement(_RY, {
        extraUsage: q.extra_usage,
        maxWidth: $
    }), wO7() && sq.createElement(en8, {
        maxWidth: $
    }), sq.createElement(T, {
        dimColor: !0
    }, sq.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })))
}
// @from(Ln 439867, Col 0)
function _RY(q) {
    let K = s(20),
        {
            extraUsage: _,
            maxWidth: z
        } = q,
        Y = MK();
    if (!(Y === "pro" || Y === "max")) return !1;
    if (!_.is_enabled) {
        if (L96.isEnabled()) {
            let f;
            if (K[0] === Symbol.for("react.memo_cache_sentinel")) f = sq.createElement(u, {
                flexDirection: "column"
            }, sq.createElement(T, {
                bold: !0
            }, XO7), sq.createElement(T, {
                dimColor: !0
            }, "Extra usage not enabled · /extra-usage to enable")), K[0] = f;
            else f = K[0];
            return f
        }
        return null
    }
    if (_.monthly_limit === null) {
        let f;
        if (K[1] === Symbol.for("react.memo_cache_sentinel")) f = sq.createElement(u, {
            flexDirection: "column"
        }, sq.createElement(T, {
            bold: !0
        }, XO7), sq.createElement(T, {
            dimColor: !0
        }, "Unlimited")), K[1] = f;
        else f = K[1];
        return f
    }
    if (typeof _.used_credits !== "number" || typeof _.utilization !== "number") return null;
    let O = _.used_credits / 100,
        w;
    if (K[2] !== O) w = p88(O, 2), K[2] = O, K[3] = w;
    else w = K[3];
    let $ = w,
        j = _.monthly_limit / 100,
        H;
    if (K[4] !== j) H = p88(j, 2), K[4] = j, K[5] = H;
    else H = K[5];
    let J = H,
        X, M, P, W;
    if (K[6] !== _.utilization) {
        let f = new Date,
            v = new Date(f.getFullYear(), f.getMonth() + 1, 1);
        X = dxK, W = XO7, M = _.utilization, P = v.toISOString(), K[6] = _.utilization, K[7] = X, K[8] = M, K[9] = P, K[10] = W
    } else X = K[7], M = K[8], P = K[9], W = K[10];
    let D;
    if (K[11] !== M || K[12] !== P) D = {
        utilization: M,
        resets_at: P
    }, K[11] = M, K[12] = P, K[13] = D;
    else D = K[13];
    let Z = `${$} / ${J} spent`,
        G;
    if (K[14] !== X || K[15] !== z || K[16] !== W || K[17] !== D || K[18] !== Z) G = sq.createElement(X, {
        title: W,
        limit: D,
        showTimeInReset: !1,
        extraSubtext: Z,
        maxWidth: z
    }), K[14] = X, K[15] = z, K[16] = W, K[17] = D, K[18] = Z, K[19] = G;
    else G = K[19];
    return G
}
// @from(Ln 439937, Col 4)
sq
// @from(Ln 439937, Col 8)
fx6
// @from(Ln 439937, Col 13)
XO7 = "Extra usage"
// @from(Ln 439938, Col 4)
lxK = L(() => {
    o6();
    aC6();
    Tx();
    T7();
    I4();
    g6();
    C7();
    e77();
    c7();
    U8();
    e8();
    bK();
    Nq();
    Jl8();
    r98();
    QxK();
    sq = K6(P6(), 1), fx6 = K6(P6(), 1)
})
// @from(Ln 439957, Col 4)
nxK = p((Ki8) => {
    (function(q) {
        q.black = "\x1B[30m", q.red = "\x1B[31m", q.green = "\x1B[32m", q.yellow = "\x1B[33m", q.blue = "\x1B[34m", q.magenta = "\x1B[35m", q.cyan = "\x1B[36m", q.lightgray = "\x1B[37m", q.default = "\x1B[39m", q.darkgray = "\x1B[90m", q.lightred = "\x1B[91m", q.lightgreen = "\x1B[92m", q.lightyellow = "\x1B[93m", q.lightblue = "\x1B[94m", q.lightmagenta = "\x1B[95m", q.lightcyan = "\x1B[96m", q.white = "\x1B[97m", q.reset = "\x1B[0m";

        function K(_, z) {
            return z === void 0 ? _ : z + _ + q.reset
        }
        q.colored = K, q.plot = function(_, z = void 0) {
            if (typeof _[0] == "number") _ = [_];
            z = typeof z < "u" ? z : {};
            let Y = typeof z.min < "u" ? z.min : _[0][0],
                A = typeof z.max < "u" ? z.max : _[0][0];
            for (let v = 0; v < _.length; v++)
                for (let V = 0; V < _[v].length; V++) Y = Math.min(Y, _[v][V]), A = Math.max(A, _[v][V]);
            let O = ["┼", "┤", "╶", "╴", "─", "╰", "╭", "╮", "╯", "│"],
                w = Math.abs(A - Y),
                $ = typeof z.offset < "u" ? z.offset : 3,
                j = typeof z.padding < "u" ? z.padding : "           ",
                H = typeof z.height < "u" ? z.height : w,
                J = typeof z.colors < "u" ? z.colors : [],
                X = w !== 0 ? H / w : 1,
                M = Math.round(Y * X),
                P = Math.round(A * X),
                W = Math.abs(P - M),
                D = 0;
            for (let v = 0; v < _.length; v++) D = Math.max(D, _[v].length);
            D = D + $;
            let Z = typeof z.symbols < "u" ? z.symbols : O,
                G = typeof z.format < "u" ? z.format : function(v) {
                    return (j + v.toFixed(2)).slice(-j.length)
                },
                f = Array(W + 1);
            for (let v = 0; v <= W; v++) {
                f[v] = Array(D);
                for (let V = 0; V < D; V++) f[v][V] = " "
            }
            for (let v = M; v <= P; ++v) {
                let V = G(W > 0 ? A - (v - M) * w / W : v, v - M);
                f[v - M][Math.max($ - V.length, 0)] = V, f[v - M][$ - 1] = v == 0 ? Z[0] : Z[1]
            }
            for (let v = 0; v < _.length; v++) {
                let V = J[v % J.length],
                    k = Math.round(_[v][0] * X) - M;
                f[W - k][$ - 1] = K(Z[0], V);
                for (let N = 0; N < _[v].length - 1; N++) {
                    let R = Math.round(_[v][N + 0] * X) - M,
                        h = Math.round(_[v][N + 1] * X) - M;
                    if (R == h) f[W - R][N + $] = K(Z[4], V);
                    else {
                        f[W - h][N + $] = K(R > h ? Z[5] : Z[6], V), f[W - R][N + $] = K(R > h ? Z[7] : Z[8], V);
                        let C = Math.min(R, h),
                            x = Math.max(R, h);
                        for (let B = C + 1; B < x; B++) f[W - B][N + $] = K(Z[9], V)
                    }
                }
            }
            return f.map(function(v) {
                return v.join("")
            }).join(`
`)
        }
    })(typeof Ki8 > "u" ? Ki8.asciichart = {} : Ki8)
})
// @from(Ln 440029, Col 0)
async function rxK(q) {
    while (_i8) await _i8;
    let K;
    _i8 = new Promise((_) => {
        K = _
    });
    try {
        return await q()
    } finally {
        _i8 = null, K?.()
    }
}
// @from(Ln 440042, Col 0)
function oxK() {
    return ARY(A7(), wRY)
}
// @from(Ln 440046, Col 0)
function MO7() {
    return {
        version: LP6,
        lastComputedDate: null,
        dailyActivity: [],
        dailyModelTokens: [],
        modelUsage: {},
        totalSessions: 0,
        totalMessages: 0,
        longestSession: null,
        firstSessionDate: null,
        hourCounts: {},
        totalSpeculationTimeSavedMs: 0,
        shotDistribution: {}
    }
}
// @from(Ln 440063, Col 0)
function $RY(q) {
    if (typeof q.version !== "number" || q.version < ORY || q.version > LP6) return null;
    if (!Array.isArray(q.dailyActivity) || !Array.isArray(q.dailyModelTokens) || typeof q.totalSessions !== "number" || typeof q.totalMessages !== "number") return null;
    return {
        version: LP6,
        lastComputedDate: q.lastComputedDate ?? null,
        dailyActivity: q.dailyActivity,
        dailyModelTokens: q.dailyModelTokens,
        modelUsage: q.modelUsage ?? {},
        totalSessions: q.totalSessions,
        totalMessages: q.totalMessages,
        longestSession: q.longestSession ?? null,
        firstSessionDate: q.firstSessionDate ?? null,
        hourCounts: q.hourCounts ?? {},
        totalSpeculationTimeSavedMs: q.totalSpeculationTimeSavedMs ?? 0,
        shotDistribution: q.shotDistribution
    }
}
// @from(Ln 440081, Col 0)
async function axK() {
    let q = V8(),
        K = oxK();
    try {
        let _ = await q.readFile(K, {
                encoding: "utf-8"
            }),
            z = n8(_);
        if (z.version !== LP6) {
            let Y = $RY(z);
            if (!Y) return E(`Stats cache version ${z.version} not migratable (expected ${LP6}), returning empty cache`), MO7();
            return E(`Migrated stats cache from v${z.version} to v${LP6}`), await o98(Y), Y
        }
        if (!Array.isArray(z.dailyActivity) || !Array.isArray(z.dailyModelTokens) || typeof z.totalSessions !== "number" || typeof z.totalMessages !== "number") return E("Stats cache has invalid structure, returning empty cache"), MO7();
        return z
    } catch (_) {
        return E(`Failed to load stats cache: ${b6(_)}`), MO7()
    }
}
// @from(Ln 440100, Col 0)
async function o98(q) {
    let K = V8(),
        _ = oxK(),
        z = `${_}.${zRY(8).toString("hex")}.tmp`;
    try {
        let Y = A7();
        await K.mkdir(Y);
        let A = I6(q, null, 2),
            O = await YRY(z, "w", 384);
        try {
            await O.writeFile(A, {
                encoding: "utf-8"
            }), await O.sync()
        } finally {
            await O.close()
        }
        await K.rename(z, _), E(`Stats cache saved successfully (lastComputedDate: ${q.lastComputedDate})`)
    } catch (Y) {
        j6(Y);
        try {
            await K.unlink(z)
        } catch {}
    }
}
// @from(Ln 440125, Col 0)
function PO7(q, K, _) {
    let z = new Map;
    for (let X of q.dailyActivity) z.set(X.date, {
        ...X
    });
    for (let X of K.dailyActivity) {
        let M = z.get(X.date);
        if (M) M.messageCount += X.messageCount, M.sessionCount += X.sessionCount, M.toolCallCount += X.toolCallCount;
        else z.set(X.date, {
            ...X
        })
    }
    let Y = new Map;
    for (let X of q.dailyModelTokens) Y.set(X.date, {
        ...X.tokensByModel
    });
    for (let X of K.dailyModelTokens) {
        let M = Y.get(X.date);
        if (M)
            for (let [P, W] of Object.entries(X.tokensByModel)) M[P] = (M[P] || 0) + W;
        else Y.set(X.date, {
            ...X.tokensByModel
        })
    }
    let A = {
        ...q.modelUsage
    };
    for (let [X, M] of Object.entries(K.modelUsage))
        if (A[X]) A[X] = {
            inputTokens: A[X].inputTokens + M.inputTokens,
            outputTokens: A[X].outputTokens + M.outputTokens,
            cacheReadInputTokens: A[X].cacheReadInputTokens + M.cacheReadInputTokens,
            cacheCreationInputTokens: A[X].cacheCreationInputTokens + M.cacheCreationInputTokens,
            webSearchRequests: A[X].webSearchRequests + M.webSearchRequests,
            costUSD: A[X].costUSD + M.costUSD,
            contextWindow: Math.max(A[X].contextWindow, M.contextWindow),
            maxOutputTokens: Math.max(A[X].maxOutputTokens, M.maxOutputTokens)
        };
        else A[X] = {
            ...M
        };
    let O = {
        ...q.hourCounts
    };
    for (let [X, M] of Object.entries(K.hourCounts)) {
        let P = parseInt(X, 10);
        O[P] = (O[P] || 0) + M
    }
    let w = q.totalSessions + K.sessionStats.length,
        $ = q.totalMessages + K.sessionStats.reduce((X, M) => X + M.messageCount, 0),
        j = q.longestSession;
    for (let X of K.sessionStats)
        if (!j || X.duration > j.duration) j = X;
    let H = q.firstSessionDate;
    for (let X of K.sessionStats)
        if (!H || X.timestamp < H) H = X.timestamp;
    return {
        version: LP6,
        lastComputedDate: _,
        dailyActivity: Array.from(z.values()).sort((X, M) => X.date.localeCompare(M.date)),
        dailyModelTokens: Array.from(Y.entries()).map(([X, M]) => ({
            date: X,
            tokensByModel: M
        })).sort((X, M) => X.date.localeCompare(M.date)),
        modelUsage: A,
        totalSessions: w,
        totalMessages: $,
        longestSession: j,
        firstSessionDate: H,
        hourCounts: O,
        totalSpeculationTimeSavedMs: q.totalSpeculationTimeSavedMs + K.totalSpeculationTimeSavedMs
    }
}
// @from(Ln 440199, Col 0)
function $g(q) {
    let _ = q.toISOString().split("T")[0];
    if (!_) throw Error("Invalid ISO date string");
    return _
}
// @from(Ln 440205, Col 0)
function WO7() {
    return $g(new Date)
}
// @from(Ln 440209, Col 0)
function sxK() {
    let q = new Date;
    return q.setDate(q.getDate() - 1), $g(q)
}
// @from(Ln 440214, Col 0)
function Gx6(q, K) {
    return q < K
}
// @from(Ln 440217, Col 4)
LP6 = 3
// @from(Ln 440218, Col 4)
ORY = 1
// @from(Ln 440219, Col 4)
wRY = "stats-cache.json"
// @from(Ln 440220, Col 4)
_i8 = null
// @from(Ln 440221, Col 4)
DO7 = L(() => {
    K8();
    Q8();
    m8();
    Yq();
    U8();
    e8()
})
// @from(Ln 440230, Col 0)
function jRY(q) {
    let K = q.map((_) => _.messageCount).filter((_) => _ > 0).sort((_, z) => _ - z);
    if (K.length === 0) return null;
    return {
        p25: K[Math.floor(K.length * 0.25)],
        p50: K[Math.floor(K.length * 0.5)],
        p75: K[Math.floor(K.length * 0.75)]
    }
}
// @from(Ln 440240, Col 0)
function ZO7(q, K = {}) {
    let {
        terminalWidth: _ = 80,
        showMonthLabels: z = !0
    } = K, Y = 4, A = _ - 4, O = Math.min(52, Math.max(10, A)), w = new Map;
    for (let G of q) w.set(G.date, G);
    let $ = jRY(q),
        j = new Date;
    j.setHours(0, 0, 0, 0);
    let H = new Date(j);
    H.setDate(j.getDate() - j.getDay());
    let J = new Date(H);
    J.setDate(J.getDate() - (O - 1) * 7);
    let X = Array.from({
            length: 7
        }, () => Array(O).fill("")),
        M = [],
        P = -1,
        W = new Date(J);
    for (let G = 0; G < O; G++)
        for (let f = 0; f < 7; f++) {
            if (W > j) {
                X[f][G] = " ", W.setDate(W.getDate() + 1);
                continue
            }
            let v = $g(W),
                V = w.get(v);
            if (f === 0) {
                let N = W.getMonth();
                if (N !== P) M.push({
                    month: N,
                    week: G
                }), P = N
            }
            let k = HRY(V?.messageCount || 0, $);
            X[f][G] = JRY(k), W.setDate(W.getDate() + 1)
        }
    let D = [];
    if (z) {
        let G = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            f = M.map((k) => k.month),
            v = Math.floor(O / Math.max(f.length, 1)),
            V = f.map((k) => G[k].padEnd(v)).join("");
        D.push("    " + V)
    }
    let Z = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let G = 0; G < 7; G++) {
        let v = ([1, 3, 5].includes(G) ? Z[G].padEnd(3) : "   ") + " " + X[G].join("");
        D.push(v)
    }
    return D.push(""), D.push("    Less " + [S_6("░"), S_6("▒"), S_6("▓"), S_6("█")].join(" ") + " More"), D.join(`
`)
}
// @from(Ln 440294, Col 0)
function HRY(q, K) {
    if (q === 0 || !K) return 0;
    if (q >= K.p75) return 4;
    if (q >= K.p50) return 3;
    if (q >= K.p25) return 2;
    return 1
}
// @from(Ln 440302, Col 0)
function JRY(q) {
    switch (q) {
        case 0:
            return Y8.gray("·");
        case 1:
            return S_6("░");
        case 2:
            return S_6("▒");
        case 3:
            return S_6("▓");
        case 4:
            return S_6("█");
        default:
            return Y8.gray("·")
    }
}
// @from(Ln 440318, Col 4)
S_6
// @from(Ln 440319, Col 4)
txK = L(() => {
    Y3();
    DO7();
    S_6 = Y8.hex("#da7756")
})
// @from(Ln 440325, Col 0)
function KuK(q) {
    let K = [],
        _ = q.split(`
`);
    for (let z of _) {
        let Y = [],
            A = hP6,
            O = !1,
            w = 0;
        while (w < z.length) {
            if (z[w] === "\x1B" && z[w + 1] === "[") {
                let H = w + 2;
                while (H < z.length && !/[A-Za-z]/.test(z[H])) H++;
                if (z[H] === "m") {
                    let J = z.slice(w + 2, H).split(";").map(Number),
                        X = 0;
                    while (X < J.length) {
                        let M = J[X];
                        if (M === 0) A = hP6, O = !1;
                        else if (M === 1) O = !0;
                        else if (M >= 30 && M <= 37) A = exK[M] || hP6;
                        else if (M >= 90 && M <= 97) A = exK[M] || hP6;
                        else if (M === 39) A = hP6;
                        else if (M === 38) {
                            if (J[X + 1] === 5 && J[X + 2] !== void 0) {
                                let P = J[X + 2];
                                A = XRY(P), X += 2
                            } else if (J[X + 1] === 2 && J[X + 2] !== void 0 && J[X + 3] !== void 0 && J[X + 4] !== void 0) A = {
                                r: J[X + 2],
                                g: J[X + 3],
                                b: J[X + 4]
                            }, X += 4
                        }
                        X++
                    }
                }
                w = H + 1;
                continue
            }
            let $ = w;
            while (w < z.length && z[w] !== "\x1B") w++;
            let j = z.slice($, w);
            if (j) Y.push({
                text: j,
                color: A,
                bold: O
            })
        }
        if (Y.length === 0) Y.push({
            text: "",
            color: hP6,
            bold: !1
        });
        K.push(Y)
    }
    return K
}
// @from(Ln 440383, Col 0)
function XRY(q) {
    if (q < 16) return [{
        r: 0,
        g: 0,
        b: 0
    }, {
        r: 128,
        g: 0,
        b: 0
    }, {
        r: 0,
        g: 128,
        b: 0
    }, {
        r: 128,
        g: 128,
        b: 0
    }, {
        r: 0,
        g: 0,
        b: 128
    }, {
        r: 128,
        g: 0,
        b: 128
    }, {
        r: 0,
        g: 128,
        b: 128
    }, {
        r: 192,
        g: 192,
        b: 192
    }, {
        r: 128,
        g: 128,
        b: 128
    }, {
        r: 255,
        g: 0,
        b: 0
    }, {
        r: 0,
        g: 255,
        b: 0
    }, {
        r: 255,
        g: 255,
        b: 0
    }, {
        r: 0,
        g: 0,
        b: 255
    }, {
        r: 255,
        g: 0,
        b: 255
    }, {
        r: 0,
        g: 255,
        b: 255
    }, {
        r: 255,
        g: 255,
        b: 255
    }][q] || hP6;
    if (q < 232) {
        let _ = q - 16,
            z = Math.floor(_ / 36),
            Y = Math.floor(_ % 36 / 6),
            A = _ % 6;
        return {
            r: z === 0 ? 0 : 55 + z * 40,
            g: Y === 0 ? 0 : 55 + Y * 40,
            b: A === 0 ? 0 : 55 + A * 40
        }
    }
    let K = (q - 232) * 10 + 8;
    return {
        r: K,
        g: K,
        b: K
    }
}
// @from(Ln 440467, Col 4)
exK
// @from(Ln 440467, Col 9)
hP6
// @from(Ln 440467, Col 14)
quK