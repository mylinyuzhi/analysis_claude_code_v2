
// @from(Ln 573578, Col 0)
async function wPA() {
    XK("run_function_start");

    function q() {
        let j = (H) => H.long?.replace(/^--/, "") ?? H.short?.replace(/^-/, "") ?? "";
        return Object.assign({
            sortSubcommands: !0,
            sortOptions: !0
        }, {
            compareOptions: (H, J) => j(H).localeCompare(j(J))
        })
    }
    let K = new q75().configureHelp(q()).enablePositionalOptions();
    if (XK("run_commander_initialized"), K.hook("preAction", async (j) => {
            if (XK("preAction_start"), await Promise.all([_U7(), NUq()]), XK("preAction_after_mdm"), await k75(), XK("preAction_after_init"), !S6(process.env.CLAUDE_CODE_DISABLE_TERMINAL_TITLE)) process.title = "claude";
            let {
                initSinks: H
            } = await Promise.resolve().then(() => (Lz8(), Ia8));
            H(), XK("preAction_after_sinks");
            let J = j.getOptionValue("pluginDir");
            if (Array.isArray(J) && J.length > 0 && J.every((X) => typeof X === "string")) h81(J), bk("preAction: --plugin-dir inline plugins");
            if (eMA(), XK("preAction_after_migrations"), E1("policySettings")?.forceRemoteSettingsRefresh) {
                let X = await xa1(Ia1);
                if (!X.valid) return tq(X.message)
            } else Ia1();
            kn8(), XK("preAction_after_remote_settings"), XK("preAction_after_settings_sync")
        }), K.name("claude").description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output").argument("[prompt]", "Your prompt", String).helpOption("-h, --help", "Display help for command").option("-d, --debug [filter]", 'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!1p,!file")', (j) => {
            return !0
        }).addOption(new q3("-d2e, --debug-to-stderr", "Enable debug mode (to stderr)").argParser(Boolean).hideHelp()).option("--debug-file <path>", "Write debug logs to a specific file path (implicitly enables debug mode)", () => !0).option("--verbose", "Override verbose mode setting from config", () => !0).option("-p, --print", "Print response and exit (useful for pipes). Note: The workspace trust dialog is skipped when Claude is run with the -p mode. Only use this flag in directories you trust.", () => !0).option("--bare", "Minimal mode: skip hooks, LSP, plugin sync, attribution, auto-memory, background prefetches, keychain reads, and CLAUDE.md auto-discovery. Sets CLAUDE_CODE_SIMPLE=1. Anthropic auth is strictly ANTHROPIC_API_KEY or apiKeyHelper via --settings (OAuth and keychain are never read). 3P providers (Bedrock/Vertex/Foundry) use their own credentials. Skills still resolve via /skill-name. Explicitly provide context via: --system-prompt[-file], --append-system-prompt[-file], --add-dir (CLAUDE.md dirs), --mcp-config, --settings, --agents, --plugin-dir.", () => !0).addOption(new q3("--init", "Run Setup hooks with init trigger, then continue").hideHelp()).addOption(new q3("--init-only", "Run Setup and SessionStart:startup hooks, then exit").hideHelp()).addOption(new q3("--maintenance", "Run Setup hooks with maintenance trigger, then continue").hideHelp()).addOption(new q3("--output-format <format>", 'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)').choices(["text", "json", "stream-json"])).addOption(new q3("--json-schema <schema>", 'JSON Schema for structured output validation. Example: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}').argParser(String)).option("--include-hook-events", "Include all hook lifecycle events in the output stream (only works with --output-format=stream-json)", () => !0).option("--include-partial-messages", "Include partial message chunks as they arrive (only works with --print and --output-format=stream-json)", () => !0).addOption(new q3("--session-mirror", "Emit transcript_mirror frames on stdout (SDK-internal; set by ProcessTransport when sessionStore is configured)").hideHelp()).addOption(new q3("--input-format <format>", 'Input format (only works with --print): "text" (default), or "stream-json" (realtime streaming input)').choices(["text", "stream-json"])).option("--mcp-debug", "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)", () => !0).option("--dangerously-skip-permissions", "Bypass all permission checks. Recommended only for sandboxes with no internet access.", () => !0).option("--allow-dangerously-skip-permissions", "Enable bypassing all permission checks as an option, without it being enabled by default. Recommended only for sandboxes with no internet access.", () => !0).addOption(new q3("--thinking <mode>", "Thinking mode: enabled (equivalent to adaptive), disabled").choices(["enabled", "adaptive", "disabled"]).hideHelp()).addOption(new q3("--thinking-display <display>", "How thinking content appears in the response").choices(["summarized", "omitted"]).hideHelp()).addOption(new q3("--max-thinking-tokens <tokens>", "[DEPRECATED. Use --thinking instead for newer models] Maximum number of thinking tokens (only works with --print)").argParser(Number).hideHelp()).addOption(new q3("--max-turns <turns>", "Maximum number of agentic turns in non-interactive mode. This will early exit the conversation after the specified number of turns. (only works with --print)").argParser(Number).hideHelp()).addOption(new q3("--max-budget-usd <amount>", "Maximum dollar amount to spend on API calls (only works with --print)").argParser((j) => {
            let H = Number(j);
            if (isNaN(H) || H <= 0) throw Error("--max-budget-usd must be a positive number greater than 0");
            return H
        })).addOption(new q3("--task-budget <tokens>", "API-side task budget in tokens (output_config.task_budget)").argParser((j) => {
            let H = Number(j);
            if (isNaN(H) || H <= 0 || !Number.isInteger(H)) throw Error("--task-budget must be a positive integer");
            return H
        }).hideHelp()).option("--replay-user-messages", "Re-emit user messages from stdin back on stdout for acknowledgment (only works with --input-format=stream-json and --output-format=stream-json)", () => !0).addOption(new q3("--enable-auth-status", "Enable auth status messages in SDK mode").default(!1).hideHelp()).option("--allowedTools, --allowed-tools <tools...>", 'Comma or space-separated list of tool names to allow (e.g. "Bash(git *) Edit")').option("--tools <tools...>", 'Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names (e.g. "Bash,Edit,Read").').option("--disallowedTools, --disallowed-tools <tools...>", 'Comma or space-separated list of tool names to deny (e.g. "Bash(git *) Edit")').option("--mcp-config <configs...>", "Load MCP servers from JSON files or strings (space-separated)").addOption(new q3("--permission-prompt-tool <tool>", "MCP tool to use for permission prompts (only works with --print)").argParser(String).hideHelp()).addOption(new q3("--system-prompt <prompt>", "System prompt to use for the session").argParser(String)).addOption(new q3("--system-prompt-file <file>", "Read system prompt from a file").argParser(String).hideHelp()).addOption(new q3("--append-system-prompt <prompt>", "Append a system prompt to the default system prompt").argParser(String)).addOption(new q3("--append-system-prompt-file <file>", "Read system prompt from a file and append to the default system prompt").argParser(String).hideHelp()).addOption(new q3("--exclude-dynamic-system-prompt-sections", "Move per-machine sections (cwd, env info, memory paths, git status) from the system prompt into the first user message. Improves cross-user prompt-cache reuse. Only applies with the default system prompt (ignored with --system-prompt).").default(!1)).addOption(new q3("--permission-mode <mode>", "Permission mode to use for the session").argParser(String).choices(jv)).option("-c, --continue", "Continue the most recent conversation in the current directory", () => !0).option("-r, --resume [value]", "Resume a conversation by session ID, or open interactive picker with optional search term", (j) => j || !0).option("--fork-session", "When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)", () => !0).addOption(new q3("--prefill <text>", "Pre-fill the prompt input with text without submitting it").hideHelp()).addOption(new q3("--deep-link-origin", "Signal that this session was launched from a deep link").hideHelp()).addOption(new q3("--deep-link-repo <slug>", "Repo slug the deep link ?repo= parameter resolved to the current cwd").hideHelp()).addOption(new q3("--deep-link-last-fetch <ms>", "FETCH_HEAD mtime in epoch ms, precomputed by the deep link trampoline").argParser((j) => {
            let H = Number(j);
            return Number.isFinite(H) ? H : void 0
        }).hideHelp()).option("--from-pr [value]", "Resume a session linked to a PR by PR number/URL, or open interactive picker with optional search term", (j) => j || !0).option("--no-session-persistence", "Disable session persistence - sessions will not be saved to disk and cannot be resumed (only works with --print)").addOption(new q3("--resume-session-at <message id>", "When resuming, only messages up to and including the assistant message with <message.id> (use with --resume in print mode)").argParser(String).hideHelp()).addOption(new q3("--rewind-files <user-message-id>", "Restore files to state at the specified user message and exit (requires --resume)").hideHelp()).option("--model <model>", "Model for the current session. Provide an alias for the latest model (e.g. 'sonnet' or 'opus') or a model's full name (e.g. 'claude-sonnet-4-6').").addOption(new q3("--effort <level>", "Effort level for the current session (low, medium, high, xhigh, max)").argParser((j) => {
            let H = j.toLowerCase(),
                J = ["low", "medium", "high", "xhigh", "max"];
            if (!J.includes(H)) throw new e15(`It must be one of: ${J.join(", ")}`);
            return H
        })).option("--agent <agent>", "Agent for the current session. Overrides the 'agent' setting.").option("--betas <betas...>", "Beta headers to include in API requests (API key users only)").option("--fallback-model <model>", "Enable automatic fallback to specified model when default model is overloaded (only works with --print)").addOption(new q3("--workload <tag>", "Workload tag for billing-header attribution (cc_workload). Process-scoped; set by SDK daemon callers that spawn subprocesses for cron work. (only works with --print)").hideHelp()).option("--settings <file-or-json>", "Path to a settings JSON file or a JSON string to load additional settings from").option("--add-dir <directories...>", "Additional directories to allow tool access to").option("--ide", "Automatically connect to IDE on startup if exactly one valid IDE is available", () => !0).option("--strict-mcp-config", "Only use MCP servers from --mcp-config, ignoring all other MCP configurations", () => !0).option("--session-id <uuid>", "Use a specific session ID for the conversation (must be a valid UUID)").option("-n, --name <name>", "Set a display name for this session (shown in /resume and terminal title)").option("--agents <json>", `JSON object defining custom agents (e.g. '{"reviewer": {"description": "Reviews code", "prompt": "You are a code reviewer"}}')`).option("--setting-sources <sources>", "Comma-separated list of setting sources to load (user, project, local).").option("--plugin-dir <path>", "Load plugins from a directory for this session only (repeatable: --plugin-dir A --plugin-dir B)", (j, H) => [...H, j], []).option("--disable-slash-commands", "Disable all skills", () => !0).option("--chrome", "Enable Claude in Chrome integration").option("--no-chrome", "Disable Claude in Chrome integration").option("--file <specs...>", "File resources to download at startup. Format: file_id:relative_path (e.g., --file file_abc:doc.txt file_def:img.png)").action(async (j, H) => {
            if (XK("action_handler_start"), H.bare) process.env.CLAUDE_CODE_SIMPLE = "1";
            if (j === "code") d("tengu_code_prompt_ignored", {}), Dz6("Tip: You can launch Claude Code with just `claude`"), j = void 0;
            if (j && typeof j === "string" && !/\s/.test(j) && j.length > 0) {
                if (d("tengu_single_word_prompt", {
                        length: j.length
                    }), !H.print && !H.continue && !H.resume && /^[a-zA-Z][a-zA-Z-]*$/.test(j)) await JPA(j, K)
            }
            let J = !1,
                X, {
                    debug: M = !1,
                    debugToStderr: P = !1,
                    dangerouslySkipPermissions: W,
                    allowDangerouslySkipPermissions: D = !1,
                    tools: Z = [],
                    allowedTools: G = [],
                    disallowedTools: f = [],
                    mcpConfig: v = [],
                    permissionMode: V,
                    addDir: k = [],
                    fallbackModel: N,
                    betas: R = [],
                    ide: h = !1,
                    sessionId: C,
                    includeHookEvents: x,
                    includePartialMessages: B,
                    sessionMirror: m
                } = H;
            if (H.prefill) DI1(H.prefill);
            let S, F = H.agents,
                U = H.agent,
                g = H.outputFormat,
                c = H.inputFormat,
                n = v7().viewMode,
                l = n ? n === "focus" : H8().briefTranscript ?? !1,
                z6 = H.verbose ?? (n ? n === "verbose" : l ? !1 : H8().verbose),
                A6 = H.print,
                e = H.init ?? !1,
                i = H.initOnly ?? !1,
                O6 = H.maintenance ?? !1,
                J6 = H.disableSlashCommands || !1,
                $6 = XI6() ? H.worktree : void 0,
                H6 = typeof $6 === "string" ? $6 : void 0,
                q6 = $6 !== void 0,
                o;
            if (H6) {
                let F1 = va8(H6);
                if (F1 !== null) o = F1, H6 = void 0
            }
            let _6 = XI6() && H.tmux === !0;
            if (_6) {
                if (!q6) return tq("Error: --tmux requires --worktree");
                if (y1() === "windows") return tq("Error: --tmux is not supported on Windows");
                if (!await MJ7()) return tq(`Error: tmux is not installed.
${PJ7()}`)
            }
            let r;
            if (z4()) {
                let F1 = HPA(H);
                r = F1;
                let Mq = F1.agentId || F1.agentName || F1.teamName,
                    p4 = F1.agentId && F1.agentName && F1.teamName;
                if (Mq && !p4) return tq("Error: --agent-id, --agent-name, and --team-name must all be provided together");
                if (F1.agentId && F1.agentName && F1.teamName) sX5().setDynamicTeamContext?.({
                    agentId: F1.agentId,
                    agentName: F1.agentName,
                    teamName: F1.teamName,
                    color: F1.agentColor,
                    planModeRequired: F1.planModeRequired ?? !1,
                    parentSessionId: F1.parentSessionId
                });
                if (F1.teammateMode) nMA().setCliTeammateModeOverride?.(F1.teammateMode)
            }
            let t = H.sdkUrl ?? void 0,
                Y6 = B || S6(process.env.CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES);
            if (x || S6(process.env.CLAUDE_CODE_REMOTE)) ZC4(!0);
            if (t) {
                if (!c) c = "stream-json";
                if (!g) g = "stream-json";
                if (H.verbose === void 0) z6 = !0;
                if (!H.print) A6 = !0
            }
            let X6 = H.teleport ?? null,
                M6 = H.remote,
                W6 = M6 === !0 ? "" : M6 ?? null,
                V6 = H.remoteControl ?? H.rc,
                f6 = !1,
                G6 = typeof V6 === "string" && V6.length > 0 ? V6 : void 0,
                k6 = H.remoteControlSessionNamePrefix;
            if (k6) process.env.CLAUDE_REMOTE_CONTROL_SESSION_NAME_PREFIX = k6;
            if (C) {
                if ((H.continue || H.resume) && !H.forkSession) return tq("Error: --session-id can only be used with --continue or --resume if --fork-session is also specified.");
                if (!t) {
                    let F1 = sp(C);
                    if (!F1) return tq("Error: Invalid session ID. Must be a valid UUID.");
                    if (!(H.forkSession && H.resume === F1) && m88(F1)) return tq(`Error: Session ID ${F1} is already in use.`)
                }
            }
            let T6 = H.file;
            if (T6 && T6.length > 0) {
                let F1 = qW();
                if (!F1) return tq("Error: Session token required for file downloads. CLAUDE_CODE_SESSION_ACCESS_TOKEN must be set.");
                let Mq = process.env.CLAUDE_CODE_REMOTE_SESSION_ID || I8(),
                    p4 = DwK(T6);
                if (p4.length > 0) {
                    let Gq = {
                        baseUrl: process.env.ANTHROPIC_BASE_URL || r7().BASE_API_URL,
                        oauthToken: F1,
                        sessionId: Mq
                    };
                    S = PwK(p4, Gq)
                }
            }
            let v6 = I7();
            if (N && H.model && N === H.model) return tq("Error: Fallback model cannot be the same as the main model. Please specify a different model for --fallback-model.");
            let L6 = H.systemPrompt;
            if (H.systemPromptFile) {
                if (H.systemPrompt) return tq("Error: Cannot use both --system-prompt and --system-prompt-file. Please use only one.");
                try {
                    let F1 = wA8(H.systemPromptFile);
                    L6 = T07(F1, "utf8")
                } catch (F1) {
                    if (Q1(F1) === "ENOENT") return tq(`Error: System prompt file not found: ${wA8(H.systemPromptFile)}`);
                    return tq(`Error reading system prompt file: ${b6(F1)}`)
                }
            }
            let y6 = H.appendSystemPrompt;
            if (H.appendSystemPromptFile) {
                if (H.appendSystemPrompt) return tq("Error: Cannot use both --append-system-prompt and --append-system-prompt-file. Please use only one.");
                try {
                    let F1 = wA8(H.appendSystemPromptFile);
                    y6 = T07(F1, "utf8")
                } catch (F1) {
                    if (Q1(F1) === "ENOENT") return tq(`Error: Append system prompt file not found: ${wA8(H.appendSystemPromptFile)}`);
                    return tq(`Error reading append system prompt file: ${b6(F1)}`)
                }
            }
            if (z4() && r?.agentId && r?.agentName && r?.teamName) {
                let F1 = lMA().TEAMMATE_SYSTEM_PROMPT_ADDENDUM;
                y6 = y6 ? `${y6}

${F1}` : F1
            }
            let {
                mode: c6,
                notification: Z8
            } = dY7({
                permissionModeCli: V,
                dangerouslySkipPermissions: W
            });
            if (S81(c6 === "bypassPermissions"), H.enableAutoMode || V === "auto" || c6 === "auto" || !V && rY7()) rMA?.setAutoModeFlagCli(!0);
            let N8 = {};
            if (v && v.length > 0) {
                let F1 = v.map((Gq) => Gq.trim()).filter((Gq) => Gq.length > 0),
                    Mq = {},
                    p4 = [];
                for (let Gq of F1) {
                    let P4 = null,
                        Z3 = [],
                        Q5 = k5(Gq);
                    if (Q5) {
                        let Q3 = z48({
                            configObject: Q5,
                            filePath: "command line",
                            expandVars: !0,
                            scope: "dynamic"
                        });
                        if (Q3.config) P4 = Q3.config.mcpServers;
                        else Z3 = Q3.errors
                    } else {
                        let Q3 = wA8(Gq),
                            e4 = zC6({
                                filePath: Q3,
                                expandVars: !0,
                                scope: "dynamic"
                            });
                        if (e4.config) P4 = e4.config.mcpServers;
                        else Z3 = e4.errors
                    }
                    if (Z3.length > 0) p4.push(...Z3);
                    else if (P4) Mq = {
                        ...Mq,
                        ...P4
                    }
                }
                if (p4.length > 0) {
                    let Gq = p4.map((P4) => `${P4.path?P4.path+": ":""}${P4.message}`).join(`
`);
                    return E(`--mcp-config validation failed (${p4.length} errors): ${Gq}`, {
                        level: "error"
                    }), tq(`Error: Invalid MCP configuration:
${Gq}`)
                }
                if (Object.keys(Mq).length > 0) {
                    let Gq = Object.entries(Mq).filter(([, e4]) => e4.type !== "sdk").map(([e4]) => e4),
                        P4 = null;
                    if (Gq.some(rH6)) P4 = `Invalid MCP configuration: "${Ex}" is a reserved MCP name.`;
                    else if (Gq.some(_$6)) P4 = `Invalid MCP configuration: "${QE}" is a reserved MCP name.`;
                    if (P4) return tq(`Error: ${P4}`);
                    let Z3 = c0(Mq, (e4) => ({
                            ...e4,
                            scope: "dynamic"
                        })),
                        {
                            allowed: Q5,
                            blocked: Q3
                        } = s36(Z3);
                    if (Q3.length > 0) Dz6(`Warning: MCP ${O7(Q3.length,"server")} blocked by enterprise policy: ${Q3.join(", ")}`);
                    N8 = {
                        ...N8,
                        ...Q5
                    }
                }
            }
            let R6 = H;
            R81(R6.chrome);
            let p6 = yo8(R6.chrome) && i7(),
                q8 = !p6 && ku6();
            if (p6) {
                let F1 = y1();
                try {
                    d("tengu_claude_in_chrome_setup", {
                        platform: F1
                    });
                    let {
                        mcpConfig: Mq,
                        allowedTools: p4,
                        systemPrompt: Gq
                    } = Ij7();
                    if (N8 = {
                            ...N8,
                            ...Mq
                        }, G.push(...p4), Gq) y6 = y6 ? `${Gq}

${y6}` : Gq
                } catch (Mq) {
                    return d("tengu_claude_in_chrome_setup_failed", {
                        platform: F1
                    }), E(`[Claude in Chrome] Error: ${Mq}`), j6(Mq), tq("Error: Failed to run with Claude in Chrome.")
                }
            } else if (q8) try {
                let {
                    mcpConfig: F1
                } = Ij7();
                N8 = {
                    ...N8,
                    ...F1
                };
                let Mq = wC4;
                y6 = y6 ? `${y6}

${Mq}` : Mq
            } catch (F1) {
                E(`[Claude in Chrome] Error (auto-enable): ${F1}`)
            }
            let L8 = H.strictMcpConfig || !1;
            if (e36()) {
                if (L8) return tq("You cannot use --strict-mcp-config when an enterprise MCP config is present");
                if (N8 && !N_K(N8)) return tq("You cannot dynamically configure MCP servers when an enterprise MCP config is present")
            }
            if (y1() === "macos" && (!I7() || !1) && ll8()) try {
                let {
                    setupComputerUseMCP: F1
                } = await Promise.resolve().then(() => (JJ5(), HJ5)), {
                    mcpConfig: Mq,
                    allowedTools: p4
                } = F1();
                N8 = {
                    ...N8,
                    ...Mq
                }, G.push(...p4)
            } catch (F1) {
                E(`[Computer Use MCP] Setup failed: ${b6(F1)}`)
            }
            Ap6(k);
            let w8;
            {
                let F1 = (Z3, Q5) => {
                        let Q3 = [],
                            e4 = [];
                        for (let T5 of Z3)
                            if (T5.startsWith("plugin:")) {
                                let i4 = T5.slice(7),
                                    h9 = i4.indexOf("@");
                                if (h9 <= 0 || h9 === i4.length - 1) e4.push(T5);
                                else Q3.push({
                                    kind: "plugin",
                                    name: i4.slice(0, h9),
                                    marketplace: i4.slice(h9 + 1)
                                })
                            } else if (T5.startsWith("server:") && T5.length > 7) Q3.push({
                            kind: "server",
                            name: T5.slice(7)
                        });
                        else e4.push(T5);
                        if (e4.length > 0) tq(`${Q5} entries must be tagged: ${e4.join(", ")}
` + `  plugin:<name>@<marketplace>  — plugin-provided channel (allowlist enforced)
` + "  server:<name>                — manually configured MCP server");
                        return Q3
                    },
                    Mq = H,
                    p4 = Mq.channels,
                    Gq = Mq.dangerouslyLoadDevelopmentChannels,
                    P4 = [];
                if (p4 && p4.length > 0) P4 = F1(p4, "--channels"), xi(P4);
                if (!v6) {
                    if (Gq && Gq.length > 0) w8 = F1(Gq, "--dangerously-load-development-channels")
                }
                if (P4.length > 0 || (w8?.length ?? 0) > 0) {
                    let Z3 = (Q5) => {
                        let Q3 = Q5.flatMap((e4) => e4.kind === "plugin" ? [`${e4.name}@${e4.marketplace}`] : []);
                        return Q3.length > 0 ? Q3.sort().join(",") : void 0
                    };
                    d("tengu_mcp_channel_flags", {
                        channels_count: P4.length,
                        dev_count: w8?.length ?? 0,
                        plugins: Z3(P4),
                        dev_plugins: Z3(w8 ?? [])
                    })
                }
            }
            if (Z.length > 0) {
                let {
                    BRIEF_TOOL_NAME: F1,
                    LEGACY_BRIEF_TOOL_NAME: Mq
                } = (vh(), B7(TU)), {
                    isBriefEntitled: p4
                } = (rF(), B7(Xe)), Gq = iR(Z);
                if ((Gq.includes(F1) || Gq.includes(Mq)) && p4()) dg(!0)
            }
            let {
                toolPermissionContext: x8,
                warnings: a6,
                overlyBroadBashPermissions: D8
            } = await Aw5({
                allowedTools: G,
                disallowedTools: f,
                baseTools: Z,
                permissionMode: c6,
                allowDangerouslySkipPermissions: D,
                addDirs: k
            });
            a6.forEach(Dz6), B9K();
            let Q6 = v6 && !L8 && !e36() && !S9() ? DX6().then((F1) => {
                let {
                    allowed: Mq,
                    blocked: p4
                } = s36(F1);
                if (p4.length > 0) Dz6(`Warning: claude.ai MCP ${O7(p4.length,"server")} blocked by enterprise policy: ${p4.join(", ")}`);
                return Mq
            }) : Promise.resolve({});
            E("[STARTUP] Loading MCP configs...");
            let W8 = Date.now(),
                G8, s6 = (L8 || S9() ? Promise.resolve({
                    servers: {}
                }) : ZX6(N8)).then((F1) => {
                    return G8 = Date.now() - W8, F1
                });
            if (c && c !== "text" && c !== "stream-json") return tq(`Error: Invalid input format "${c}".`);
            if (c === "stream-json" && g !== "stream-json") return tq("Error: --input-format=stream-json requires output-format=stream-json.");
            if (t) {
                if (c !== "stream-json" || g !== "stream-json") return tq("Error: --sdk-url requires both --input-format=stream-json and --output-format=stream-json.")
            }
            if (H.replayUserMessages) {
                if (c !== "stream-json" || g !== "stream-json") return tq("Error: --replay-user-messages requires both --input-format=stream-json and --output-format=stream-json.")
            }
            if (Y6) {
                if (!v6 || g !== "stream-json") return tq("Error: --include-partial-messages requires --print and --output-format=stream-json.")
            }
            if (H.sessionPersistence === !1 && !v6) return tq("Error: --no-session-persistence can only be used with --print mode.");
            let h6 = await OPA(j || "", c ?? "text");
            XK("action_after_input_prompt");
            let _8;
            if (AW4({
                    isNonInteractiveSession: v6
                }) && H.jsonSchema) _8 = n8(H.jsonSchema);
            XK("action_before_setup"), E("[STARTUP] Running setup()...");
            let R8 = Date.now(),
                {
                    setup: x6
                } = await Promise.resolve().then(() => (we8(), Oe8)),
                i6 = void 0,
                v8 = b8();
            if (process.env.CLAUDE_CODE_ENTRYPOINT !== "local-agent") V25(), OH5();
            let f1 = !!YPA?.host,
                g8 = x6(v8, f1 ? "default" : c6, f1 ? !1 : D, q6, H6, _6, C ? sp(C) : void 0, o, i6),
                w6 = q6 ? null : eD(v8),
                D6 = q6 ? null : FR(v8);
            w6?.catch(() => {}), D6?.catch(() => {}), await g8, E(`[STARTUP] setup() completed in ${Date.now()-R8}ms`), XK("action_after_setup");
            let U6 = !!H.replayUserMessages;
            if (I7()) Fn(), fj(), $2(), YZ8();
            let F6 = H.name?.trim();
            if (F6) BH7(F6);
            let z8 = H.model || process.env.ANTHROPIC_MODEL,
                l6 = H.model === "default" ? ZP() : H.model,
                j8 = N === "default" ? ZP() : N,
                f8 = q6 ? b8() : v8;
            if (Na() && Object.keys(H8().cachedGrowthBookFeatures ?? {}).length === 0) await aQ(DI(), 300, "gb-before-tools").catch(() => {});
            E("[STARTUP] Loading commands and agents...");
            let p8 = Date.now(),
                o8 = await ww5({
                    cwd: f8,
                    toolPermissionContext: x8,
                    applyCoordinatorFilter: !0,
                    agentsJson: F,
                    agentSetting: U,
                    commandsPromise: w6,
                    agentDefsPromise: D6,
                    onToolsLoaded: () => XK("action_tools_loaded")
                }),
                n1 = o8.tools,
                c1 = o8.mainThreadAgentDefinition,
                {
                    commands: dq,
                    agentDefinitions: uq,
                    cliAgents: h4
                } = o8,
                cq = U ?? gQ6("agent");
            if (!U && cq) c1 = VW7(uq.activeAgents, cq), _m(c1?.agentType);
            if (E(`[STARTUP] Commands and agents loaded in ${Date.now()-p8}ms`), XK("action_commands_loaded"), _8) {
                let F1 = OR8(_8);
                if ("tool" in F1) n1 = [...n1, F1.tool], d("tengu_structured_output_enabled", {
                    schema_property_count: Object.keys(_8.properties || {}).length,
                    has_required_fields: Boolean(_8.required)
                });
                else d("tengu_structured_output_failure", {
                    error: "Invalid JSON schema"
                })
            }
            if (c1) d("tengu_agent_flag", {
                agentType: Vj(c1) ? c1.agentType : "custom",
                ...U && {
                    source: "cli"
                }
            });
            if (c1?.agentType) Mz8(c1.agentType);
            if (v6 && c1 && !Vj(c1)) {
                let F1 = c1.getSystemPrompt();
                if (F1) {
                    if (!L6) L6 = F1
                }
            }
            if (c1?.initialPrompt) {
                let F1 = c1.initialPrompt;
                if (typeof h6 === "string") h6 = h6 ? `${F1}

${h6}` : F1;
                else if (!h6) h6 = F1
            }
            let {
                effectiveModel: C1,
                initialMainLoopModel: W7,
                resolvedInitialModel: $4
            } = $H5({
                userSpecifiedModel: l6,
                agentModel: c1?.model
            }), t4;
            if (vx()) {
                let F1 = H.advisor;
                if (F1) {
                    if (E(`[AdvisorTool] --advisor ${F1}`), !Nh6($4)) return tq(`Error: The model "${$4}" does not support the advisor tool.`);
                    let Mq = Of(K5(F1));
                    if (!b88(Mq)) return tq(`Error: The model "${F1}" cannot be used as an advisor.`)
                }
                if (t4 = F1 ?? jS4(), t4) E(`[AdvisorTool] Advisor model: ${t4}`)
            }
            if (z4() && r?.agentId && r?.agentName && r?.teamName && r?.agentType) {
                let F1 = uq.activeAgents.find((Mq) => Mq.agentType === r.agentType);
                if (F1) {
                    let Mq;
                    if (F1.source === "built-in") E(`[teammate] Built-in agent ${r.agentType} - skipping custom prompt (not supported)`);
                    else Mq = F1.getSystemPrompt();
                    if (F1.memory) d("tengu_agent_memory_loaded", {
                        ...!1,
                        scope: F1.memory,
                        source: "teammate"
                    });
                    if (Mq) {
                        let p4 = `
# Custom Agent Instructions
${Mq}`;
                        y6 = y6 ? `${y6}

${p4}` : p4
                    }
                } else E(`[teammate] Custom agent ${r.agentType} not found in available agents`)
            }
            if (Me8(H), !I7() && !cL() && v7().defaultView === "chat") {
                let {
                    isBriefEntitled: F1
                } = (rF(), B7(Xe));
                if (F1()) dg(!0)
            }
            let x4, DK, _q, QY = !1;
            if (!v6) {
                let F1 = j25(!1);
                DK = F1.getFpsMetrics, _q = F1.stats;
                let {
                    createRoot: Mq
                } = await Promise.resolve().then(() => (g6(), kd));
                x4 = await Mq(F1.renderOptions), d("tengu_timer", {
                    event: "startup",
                    durationMs: Math.round(process.uptime() * 1000)
                }), E("[STARTUP] Running showSetupScreens()...");
                let p4 = Date.now();
                if (QY = await w25(x4, f1 ? "default" : c6, f1 ? !1 : D, dq, p6, w8), E(`[STARTUP] showSetupScreens() completed in ${Date.now()-p4}ms`), V6 !== void 0) {
                    let {
                        getBridgeDisabledReason: P4
                    } = await Promise.resolve().then(() => (aR(), co1)), Z3 = await P4();
                    if (f6 = Z3 === null, Z3) Dz6(`${Z3}
--rc flag ignored.`)
                }
                if (QY && j?.trim().toLowerCase() === "/login") j = "";
                if (QY) {
                    if (E1("policySettings")?.forceRemoteSettingsRefresh) {
                        let P4 = await xa1(V78);
                        if (!P4.valid) return await Uu(x4, P4.message)
                    } else V78();
                    LK8(), Rk6(), O$6(), Promise.resolve().then(() => (kJ6(), oo1)).then((P4) => {
                        return P4.clearTrustedDeviceToken(), P4.enrollTrustedDevice()
                    })
                }
                let Gq = await Ma();
                if (!Gq.valid) await Uu(x4, Gq.message)
            }
            if (process.exitCode !== void 0) {
                E("Graceful shutdown initiated, skipping further initialization");
                return
            }
            if (kMK(), !v6) {
                let {
                    errors: F1
                } = bm(), Mq = F1.filter((p4) => !p4.mcpErrorMetadata);
                if (Mq.length > 0) await Z25(x4, {
                    settingsErrors: Mq,
                    onExit: () => j5(1)
                })
            }
            let vz = u8("tengu_cicada_nap_ms", 0),
                JY = H8().startupPrefetchedAt ?? 0;
            if (!(S9() || vz > 0 && Date.now() - JY < vz)) {
                let F1 = JY > 0 ? ` last ran ${Math.round((Date.now()-JY)/1000)}s ago` : "";
                if (E(`Starting background startup prefetches${F1}`), CM4().catch((Mq) => j6(Mq)), eO5(), GdK(), !u8("tengu_miraculo_the_bard", !1)) FZ8();
                else qT1();
                if (vz > 0) d8((Mq) => ({
                    ...Mq,
                    startupPrefetchedAt: Date.now()
                }))
            } else E(`Skipping startup prefetches, last ran ${Math.round((Date.now()-JY)/1000)}s ago`), qT1();
            if (!v6) k95();
            let {
                servers: DA
            } = await s6;
            E(`[STARTUP] MCP configs resolved in ${G8}ms (awaited at +${Date.now()-W8}ms)`);
            let U9 = {
                    ...DA,
                    ...N8
                },
                BH = {},
                gj = {};
            for (let [F1, Mq] of Object.entries(U9)) {
                let p4 = Mq;
                if (p4.type === "sdk") BH[F1] = p4;
                else gj[F1] = p4
            }
            XK("action_mcp_configs_loaded");
            let FA = v6 ? Promise.resolve({
                    clients: [],
                    tools: [],
                    commands: []
                }) : Z98(gj),
                UG = v6 ? Promise.resolve({
                    clients: [],
                    tools: [],
                    commands: []
                }) : Q6.then((F1) => Object.keys(F1).length > 0 ? Z98(F1) : {
                    clients: [],
                    tools: [],
                    commands: []
                }),
                QG = Promise.all([FA, UG]).then(([F1, Mq]) => ({
                    clients: [...F1.clients, ...Mq.clients],
                    tools: j2([...F1.tools, ...Mq.tools], "name"),
                    commands: j2([...F1.commands, ...Mq.commands], "name")
                })),
                XY = i || e || O6 || v6 || H.continue || H.resume ? null : F66({
                    kind: "session-start",
                    source: "startup",
                    agentType: c1?.agentType,
                    model: $4
                }),
                UX = [];
            QG.catch(() => {});
            let gA = [],
                ZA = [],
                k4 = [],
                fA = DK6(),
                MY = fA !== !1 ? {
                    type: "adaptive"
                } : {
                    type: "disabled"
                };
            if (H.thinking === "adaptive" || H.thinking === "enabled") fA = !0, MY = {
                type: "adaptive"
            };
            else if (H.thinking === "disabled") fA = !1, MY = {
                type: "disabled"
            };
            else {
                let F1 = process.env.MAX_THINKING_TOKENS ? parseInt(process.env.MAX_THINKING_TOKENS, 10) : H.maxThinkingTokens;
                if (F1 !== void 0) {
                    if (F1 > 0) fA = !0, MY = {
                        type: "enabled",
                        budgetTokens: F1
                    };
                    else if (F1 === 0) fA = !1, MY = {
                        type: "disabled"
                    }
                }
            }
            if (MY.type !== "disabled" && (H.thinkingDisplay === "summarized" || H.thinkingDisplay === "omitted")) MY.display = H.thinkingDisplay;
            if (j1("info", "started", {
                    version: {
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.112",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-04-16T18:33:19Z"
                    }.VERSION,
                    is_native_binary: v$()
                }), eq(async () => {
                    j1("info", "exited")
                }), $PA({
                    hasInitialPrompt: Boolean(j),
                    hasStdin: Boolean(h6),
                    verbose: z6,
                    debug: M,
                    debugToStderr: P,
                    print: A6 ?? !1,
                    outputFormat: g ?? "text",
                    inputFormat: c ?? "text",
                    numAllowedTools: G.length,
                    numDisallowedTools: f.length,
                    mcpClientCount: Object.keys(U9).length,
                    worktreeEnabled: q6,
                    skipWebFetchPreflight: v7().skipWebFetchPreflight,
                    githubActionInputs: process.env.GITHUB_ACTION_INPUTS,
                    dangerouslySkipPermissionsPassed: W ?? !1,
                    permissionMode: c6,
                    modeIsBypass: c6 === "bypassPermissions",
                    allowDangerouslySkipPermissionsPassed: D,
                    systemPromptFlag: L6 ? H.systemPromptFile ? "file" : "flag" : void 0,
                    appendSystemPromptFlag: y6 ? H.appendSystemPromptFile ? "file" : "flag" : void 0,
                    thinkingConfig: MY,
                    assistantActivationPath: void 0
                }), L85(gj, x8), _R6(null, "initialization"), oMA(), lZq().then((F1) => {
                    if (!F1) return;
                    if (F6) NQ(F6);
                    aZ8().then((Mq) => {
                        if (Mq >= 2) d("tengu_concurrent_sessions", {
                            num_sessions: Mq
                        })
                    })
                }), S9());
            else if (v6) await A_7(), XK("action_after_plugins_init"), r97().then(() => WM6());
            else A_7().then(async () => {
                XK("action_after_plugins_init"), await r97(), WM6()
            });
            let UA = i || e ? "init" : O6 ? "maintenance" : null;
            if (i) {
                Fn(), await F66({
                    kind: "setup",
                    trigger: "init",
                    forceSyncExecution: !0
                }), await F66({
                    kind: "session-start",
                    source: "startup",
                    forceSyncExecution: !0
                }), j5(0);
                return
            }
            if (v6) {
                if (g === "stream-json" || g === "json") OT7(!0);
                Fn(), pa8();
                let F1 = H.continue || H.resume || X6 || UA ? void 0 : F66({
                    kind: "session-start",
                    source: "startup"
                });
                F1?.catch(() => {}), XK("before_validateForceLoginOrg");
                let Mq = await Ma();
                if (!Mq.valid) return tq(Mq.message);
                let p4 = J6 ? [] : yu6(dq),
                    Gq = W36(),
                    P4 = {
                        ...Gq,
                        mcp: {
                            ...Gq.mcp,
                            clients: gA,
                            commands: k4,
                            tools: ZA
                        },
                        toolPermissionContext: x8,
                        effortValue: CF1(H.effort),
                        autoCompactWindow: H.autocompact ?? v7().autoCompactWindow,
                        ...q5() && {
                            fastMode: sv1(C1 ?? null)
                        },
                        ...vx() && t4 && {
                            advisorModel: t4
                        },
                        ...{}
                    },
                    Z3 = new mY8,
                    Q5 = rE(P4, (T5) => T66(T5, Z3));
                if (x8.mode === "bypassPermissions" || D) iY7(x8);
                if (yK8(x8, Q5.getState().fastMode).then(({
                        updateContext: T5
                    }) => {
                        Q5.setState((i4) => {
                            let h9 = T5(i4.toolPermissionContext);
                            if (h9 === i4.toolPermissionContext) return i4;
                            return {
                                ...i4,
                                toolPermissionContext: h9
                            }
                        })
                    }), H.sessionPersistence === !1) I81(!0);
                a61(Qgq(R));
                let Q3 = EH5({
                    regularMcpConfigs: gj,
                    claudeaiConfigPromise: Q6,
                    state: {
                        getClients: () => Q5.getState().mcp.clients,
                        applyMcpUpdate: (T5) => Q5.setState((i4) => ({
                            ...i4,
                            mcp: T5(i4.mcp)
                        }))
                    }
                });
                if (XK("before_connectMcp"), await Q3.connect(), XK("after_connectMcp_claudeai"), !S9()) Ke8(), Promise.resolve().then(() => (VP7(), P_5)).then((T5) => T5.startBackgroundHousekeeping());
                tX5(), XK("before_print_import");
                let {
                    runHeadless: e4
                } = await Promise.resolve().then(() => (TX5(), vX5));
                XK("after_print_import"), e4(h6, () => Q5.getState(), Q5.setState, p4, n1, BH, uq.activeAgents, {
                    continue: H.continue,
                    resume: H.resume,
                    verbose: z6,
                    outputFormat: g,
                    jsonSchema: _8,
                    permissionPromptToolName: H.permissionPromptTool,
                    allowedTools: G,
                    thinkingConfig: MY,
                    maxTurns: H.maxTurns,
                    maxBudgetUsd: H.maxBudgetUsd,
                    taskBudget: H.taskBudget ? {
                        total: H.taskBudget
                    } : void 0,
                    systemPrompt: L6,
                    appendSystemPrompt: y6,
                    appendSubagentSystemPrompt: void 0,
                    excludeDynamicSections: H.excludeDynamicSystemPromptSections || void 0,
                    userSpecifiedModel: C1,
                    fallbackModel: j8,
                    teleport: X6,
                    sdkUrl: t,
                    replayUserMessages: U6,
                    includePartialMessages: Y6,
                    sessionMirror: m,
                    forkSession: H.forkSession || !1,
                    resumeSessionAt: H.resumeSessionAt || void 0,
                    rewindFiles: H.rewindFiles,
                    enableAuthStatus: H.enableAuthStatus,
                    agent: U,
                    workload: H.workload,
                    setupTrigger: UA ?? void 0,
                    sessionStartHooksPromise: F1,
                    sessionState: Z3
                });
                return
            }
            d("tengu_startup_manual_model_config", {
                cli_flag: H.model,
                env_var: process.env.ANTHROPIC_MODEL,
                settings_file: (v7() || {}).model,
                subscriptionType: MK(),
                agent: cq
            });
            let PY = It8($4),
                Q9 = [];
            if (Z8) Q9.push({
                key: "permission-mode-notification",
                text: Z8,
                priority: "high"
            });
            if (PY) Q9.push({
                key: "model-deprecation-warning",
                text: PY,
                color: "warning",
                priority: "high"
            });
            if (D8.length > 0) {
                let F1 = F4(D8.map((P4) => P4.ruleDisplay)),
                    Mq = F1.join(", "),
                    p4 = F4(D8.map((P4) => P4.sourceDisplay)).join(", "),
                    Gq = F1.length;
                Q9.push({
                    key: "overly-broad-bash-notification",
                    text: `${Mq} allow ${O7(Gq,"rule")} from ${p4} ${O7(Gq,"was","were")} ignored — not available for Ants, please use auto-mode instead`,
                    color: "warning",
                    priority: "high"
                })
            }
            let ww = {
                    ...x8,
                    mode: z4() && sX5().isPlanModeRequired() ? "plan" : x8.mode
                },
                gw = cL(),
                QJ = f6 || zd() || J,
                h0 = !1,
                $$ = {
                    settings: v7(),
                    tasks: {},
                    taskDecorations: {},
                    agentNameRegistry: new Map,
                    agentTypesInvokedThisSession: new Set,
                    verbose: z6 ?? H8().verbose ?? !1,
                    mainLoopModel: W7,
                    mainLoopModelForSession: null,
                    isBriefOnly: gw,
                    briefTranscript: z6 ? !1 : l,
                    expandedView: H8().showSpinnerTree ? "teammates" : H8().showExpandedTodos ? "tasks" : "none",
                    showTeammateMessagePreview: z4() ? !1 : void 0,
                    selectedIPAgentIndex: -1,
                    coordinatorTaskIndex: -1,
                    viewSelectionMode: "none",
                    footerSelection: null,
                    toolPermissionContext: ww,
                    agent: c1?.agentType,
                    agentDefinitions: uq,
                    skillTruncationStats: null,
                    mcp: {
                        clients: [],
                        tools: [],
                        commands: [],
                        resources: {},
                        resourceTemplates: {},
                        pluginReconnectKey: 0
                    },
                    plugins: {
                        enabled: [],
                        disabled: [],
                        commands: [],
                        errors: [],
                        installationStatus: {
                            marketplaces: [],
                            plugins: []
                        },
                        needsRefresh: !1
                    },
                    statusLineText: void 0,
                    kairosEnabled: J,
                    remoteSessionUrl: void 0,
                    remoteConnectionStatus: "connecting",
                    remoteBackgroundTaskCount: 0,
                    replBridgeEnabled: QJ || h0,
                    replBridgeExplicit: f6,
                    replBridgeOutboundOnly: h0,
                    replBridgeConnected: !1,
                    replBridgeSessionActive: !1,
                    replBridgeReconnecting: !1,
                    replBridgeConnectUrl: void 0,
                    replBridgeSessionUrl: void 0,
                    replBridgeEnvironmentId: void 0,
                    replBridgeSessionId: void 0,
                    replBridgeError: void 0,
                    replBridgeInitialName: G6,
                    showRemoteCallout: !1,
                    notifications: {
                        current: null,
                        queue: Q9
                    },
                    autoUpdaterResult: null,
                    elicitation: {
                        queue: []
                    },
                    todos: {},
                    replContexts: {},
                    remoteAgentTaskSuggestions: [],
                    fileHistory: {
                        snapshots: [],
                        trackedFiles: new Set,
                        snapshotSequence: 0
                    },
                    attribution: oR6(),
                    thinkingEnabled: fA,
                    promptSuggestionEnabled: mu8(),
                    awaySummaryEnabled: UR6(),
                    sessionHooks: new Map,
                    inbox: {
                        messages: []
                    },
                    promptSuggestion: {
                        text: null,
                        promptId: null,
                        shownAt: 0,
                        acceptedAt: 0,
                        generationRequestId: null
                    },
                    speculation: hJ6,
                    speculationSessionTimeSavedMs: 0,
                    workerSandboxPermissions: {
                        queue: [],
                        selectedIndex: 0
                    },
                    pendingWorkerRequest: null,
                    pendingSandboxRequest: null,
                    authVersion: 0,
                    initialMessage: h6 ? {
                        message: t8({
                            content: String(h6)
                        })
                    } : null,
                    effortValue: CF1(H.effort),
                    autoCompactWindow: H.autocompact ?? v7().autoCompactWindow,
                    activeOverlays: new Set,
                    fastMode: sv1($4),
                    ...vx() && t4 && {
                        advisorModel: t4
                    },
                    teamContext: b_5?.(),
                    teammateColors: {
                        assignments: new Map,
                        index: 0
                    },
                    storedImagePaths: new Map,
                    imageDescriptions: new Map,
                    classifierApprovals: {
                        approvals: new Map,
                        checking: new Set
                    },
                    webBrowser: B7(Ea1).getDefaultWebBrowserState()
                };
            if (h6) SE6(String(h6));
            let j$ = ZA;
            d8((F1) => ({
                ...F1,
                numStartups: (F1.numStartups ?? 0) + 1
            })), setImmediate(() => {
                tMA(), tX5()
            });
            let a$ = null,
                dJ = a$ ? a$.then((F1) => F1.createSessionTurnUploader()).catch(() => null) : null,
                dY = {
                    debug: M || P,
                    commands: [...dq, ...k4],
                    initialTools: j$,
                    mcpClients: gA,
                    autoConnectIdeFlag: h,
                    mainThreadAgentDefinition: c1,
                    disableSlashCommands: J6,
                    dynamicMcpConfig: N8,
                    strictMcpConfig: L8,
                    systemPrompt: L6,
                    appendSystemPrompt: y6,
                    thinkingConfig: MY,
                    ...dJ && {
                        onTurnComplete: (F1) => {
                            dJ.then((Mq) => Mq?.(F1))
                        }
                    }
                },
                V2 = {
                    modeApi: iMA,
                    mainThreadAgentDefinition: c1,
                    agentDefinitions: uq,
                    currentCwd: f8,
                    cliAgents: h4,
                    initialState: $$,
                    permissionModeCliSet: V !== void 0 || Boolean(W)
                };
            if (H.continue) {
                let F1 = !1;
                try {
                    let Mq = performance.now(),
                        {
                            clearSessionCaches: p4
                        } = await Promise.resolve().then(() => (un8(), uA7));
                    p4();
                    let Gq = await Ft(void 0, void 0);
                    if (!Gq) return d("tengu_continue", {
                        success: !1
                    }), await Uu(x4, "No conversation found to continue");
                    let P4 = await uP7(Gq, {
                        forkSession: !!H.forkSession,
                        includeAttribution: !0,
                        transcriptPath: Gq.fullPath
                    }, V2);
                    if (P4.restoredAgentDef) c1 = P4.restoredAgentDef;
                    Me8(H), v07(H), d("tengu_continue", {
                        success: !0,
                        resume_duration_ms: Math.round(performance.now() - Mq)
                    }), F1 = !0, await rY8(x4, {
                        getFpsMetrics: DK,
                        stats: _q,
                        initialState: P4.initialState
                    }, {
                        ...dY,
                        mainThreadAgentDefinition: P4.restoredAgentDef ?? c1,
                        initialMessages: P4.messages,
                        initialFileHistorySnapshots: P4.fileHistorySnapshots,
                        initialContentReplacements: P4.contentReplacements,
                        initialAgentName: P4.agentName,
                        initialAgentColor: P4.agentColor
                    }, P06)
                } catch (Mq) {
                    if (!F1) d("tengu_continue", {
                        success: !1
                    });
                    j6(Mq), process.exit(1)
                }
            } else if (H.resume || H.fromPr || X6 || W6 !== null) {
                let {
                    clearSessionCaches: F1
                } = await Promise.resolve().then(() => (un8(), uA7));
                F1();
                let Mq = null,
                    p4 = void 0,
                    Gq = sp(H.resume),
                    P4 = void 0,
                    Z3 = null,
                    Q5 = void 0;
                if (H.fromPr) {
                    if (H.fromPr === !0) Q5 = !0;
                    else if (typeof H.fromPr === "string") Q5 = H.fromPr
                }
                if (H.resume && typeof H.resume === "string" && !Gq) {
                    let e4 = H.resume.trim();
                    if (e4) {
                        let T5 = await Zu(e4, {
                            exact: !0
                        });
                        if (T5.length === 1) Z3 = T5[0], Gq = xY(Z3) ?? null;
                        else P4 = e4
                    }
                }
                if (W6 !== null || X6) {
                    if (await m98(), !N5("allow_remote_sessions")) return await Uu(x4, "Error: Remote sessions are disabled by your organization's policy.", () => WK(1))
                }
                if (W6 !== null) {
                    let e4 = W6.length > 0,
                        T5 = u8("tengu_remote_backend", !1);
                    if (!T5 && !e4) return await Uu(x4, `Error: --remote requires a description.
Usage: claude --remote "your task description"`, () => WK(1));
                    d("tengu_remote_create_session", {
                        has_initial_prompt: String(e4)
                    });
                    let i4 = await rj(),
                        h9 = await j77(x4, e4 ? W6 : null, new AbortController().signal, "remote", i4 || void 0);
                    if (!h9) return d("tengu_remote_create_session_error", {
                        error: "unable_to_create_session"
                    }), await Uu(x4, "Error: Unable to create remote session", () => WK(1));
                    if (d("tengu_remote_create_session_success", {
                            session_id: h9.id
                        }), !T5) process.stdout.write(`Created remote session: ${h9.title}
`), process.stdout.write(`View: ${g2(h9.id)}?m=0
`), process.stdout.write(`Resume with: claude --teleport ${h9.id}
`), await WK(0), process.exit(0);
                    Q81(!0), SZ(pP(h9.id));
                    let wz;
                    try {
                        wz = await TX()
                    } catch (nM) {
                        return j6(r1(nM)), await Uu(x4, `Error: ${b6(nM)||"Failed to authenticate"}`, () => WK(1))
                    }
                    let {
                        getClaudeAIOAuthTokens: WY
                    } = await Promise.resolve().then(() => (T7(), zR)), cJ = () => WY()?.accessToken ?? wz.accessToken, JO = U95(h9.id, cJ, wz.orgUUID, e4), pH = `${g2(h9.id)}?m=0`, Uw = eO(`/remote-control is active. Code in CLI or at ${pH}`, "info"), H$ = e4 ? t8({
                        content: W6
                    }) : null, WW = {
                        ...$$,
                        remoteSessionUrl: pH
                    }, VZ = keK(dq);
                    await rY8(x4, {
                        getFpsMetrics: DK,
                        stats: _q,
                        initialState: WW
                    }, {
                        debug: M || P,
                        commands: VZ,
                        initialTools: [],
                        initialMessages: H$ ? [Uw, H$] : [Uw],
                        mcpClients: [],
                        autoConnectIdeFlag: h,
                        mainThreadAgentDefinition: c1,
                        disableSlashCommands: J6,
                        remoteSessionConfig: JO,
                        thinkingConfig: MY
                    }, P06);
                    return
                } else if (X6) {
                    if (X6 === !0 || X6 === "") {
                        d("tengu_teleport_interactive_mode", {}), E("selectAndResumeTeleportTask: Starting teleport flow...");
                        let e4 = await f25(x4);
                        if (!e4) await WK(0), process.exit(0);
                        let {
                            branchError: T5
                        } = await zK8(e4.branch);
                        Mq = _K8(e4.log, T5)
                    } else if (typeof X6 === "string") {
                        d("tengu_teleport_resume_session", {
                            mode: "direct"
                        });
                        try {
                            let e4 = await w36(X6),
                                T5 = await qg8(e4);
                            if (T5.status === "mismatch" || T5.status === "not_in_repo") {
                                let wz = T5.sessionRepo;
                                if (wz) {
                                    let WY = Qt8(wz),
                                        cJ = await dt8(WY);
                                    if (cJ.length > 0) {
                                        let JO = await G25(x4, {
                                            targetRepo: wz,
                                            initialPaths: cJ
                                        });
                                        if (JO) process.chdir(JO), l$(JO), dL(JO);
                                        else await WK(0)
                                    } else throw new dj(`You must run claude --teleport ${X6} from a checkout of ${wz}.`, Y8.red(`You must run claude --teleport ${X6} from a checkout of ${Y8.bold(wz)}.
`))
                                }
                            } else if (T5.status === "error") throw new dj(T5.errorMessage || "Failed to validate session", Y8.red(`Error: ${T5.errorMessage||"Failed to validate session"}
`));
                            await $77();
                            let {
                                teleportWithProgress: i4
                            } = await Promise.resolve().then(() => (yX5(), EX5)), h9 = await i4(x4, X6);
                            Yp6({
                                sessionId: X6
                            }), Mq = h9.messages
                        } catch (e4) {
                            let T5 = e4 instanceof dj;
                            if (!T5) j6(e4);
                            await Uu(x4, T5 ? e4.message : b6(e4), () => WK(1))
                        }
                    }
                }
                if (Gq) {
                    let e4 = Gq,
                        T5 = "load_error";
                    try {
                        let i4 = performance.now(),
                            h9 = await Ft(Z3 ?? e4, void 0);
                        if (!h9) {
                            d("tengu_session_resumed", {
                                entrypoint: "cli_flag",
                                success: !1,
                                failure_reason: "not_found"
                            });
                            let WY = `No conversation found with session ID: ${e4}`;
                            return E(WY, {
                                level: "error"
                            }), await Uu(x4, WY, () => WK(1))
                        }
                        T5 = "processing_error";
                        let wz = Z3?.fullPath ?? h9.fullPath;
                        if (p4 = await uP7(h9, {
                                forkSession: !!H.forkSession,
                                sessionIdOverride: e4,
                                transcriptPath: wz
                            }, V2), p4.restoredAgentDef) c1 = p4.restoredAgentDef;
                        d("tengu_session_resumed", {
                            entrypoint: "cli_flag",
                            success: !0,
                            resume_duration_ms: Math.round(performance.now() - i4)
                        })
                    } catch (i4) {
                        d("tengu_session_resumed", {
                            entrypoint: "cli_flag",
                            success: !1,
                            failure_reason: T5,
                            error_name: r1(i4).name
                        }), j6(i4), await Uu(x4, `Failed to resume session ${e4}`)
                    }
                }
                if (S) try {
                    let e4 = await S,
                        T5 = w7(e4, (i4) => !i4.success);
                    if (T5 > 0) Dz6(`Warning: ${T5}/${e4.length} file(s) failed to download.`)
                } catch (e4) {
                    return await Uu(x4, `Error downloading files: ${b6(e4)}`)
                }
                let Q3 = p4 ?? (Array.isArray(Mq) ? {
                    messages: Mq,
                    fileHistorySnapshots: void 0,
                    agentName: void 0,
                    agentColor: void 0,
                    restoredAgentDef: c1,
                    initialState: $$,
                    contentReplacements: void 0
                } : void 0);
                if (Q3) Me8(H), v07(H), await rY8(x4, {
                    getFpsMetrics: DK,
                    stats: _q,
                    initialState: Q3.initialState
                }, {
                    ...dY,
                    mainThreadAgentDefinition: Q3.restoredAgentDef ?? c1,
                    initialMessages: Q3.messages,
                    initialFileHistorySnapshots: Q3.fileHistorySnapshots,
                    initialContentReplacements: Q3.contentReplacements,
                    initialAgentName: Q3.agentName,
                    initialAgentColor: Q3.agentColor
                }, P06);
                else await v25(x4, {
                    getFpsMetrics: DK,
                    stats: _q,
                    initialState: $$
                }, OW6(Y7()), {
                    ...dY,
                    initialSearchQuery: P4,
                    forkSession: H.forkSession,
                    filterByPr: Q5
                })
            } else {
                let F1 = XY && UX.length === 0 ? XY : void 0;
                XK("action_after_hooks"), Me8(H), v07(H);
                let Mq = null;
                if (H.deepLinkOrigin) d("tengu_deep_link_opened", {
                    has_prefill: Boolean(H.prefill),
                    has_repo: Boolean(H.deepLinkRepo)
                }), Mq = eO(PH5({
                    cwd: b8(),
                    prefillLength: H.prefill?.length,
                    repo: H.deepLinkRepo,
                    lastFetch: H.deepLinkLastFetch !== void 0 ? new Date(H.deepLinkLastFetch) : void 0
                }), "warning");
                else if (H.prefill) Mq = eO("Launched with a pre-filled prompt — review it before pressing Enter.", "warning");
                let p4 = [...Mq ? [Mq] : [], ...HH5({
                        onboardingShown: QY
                    })],
                    Gq = p4.length > 0 || UX.length > 0 ? [...p4, ...UX] : void 0;
                await rY8(x4, {
                    getFpsMetrics: DK,
                    stats: _q,
                    initialState: $$
                }, {
                    ...dY,
                    initialMessages: Gq,
                    pendingHookMessages: F1
                }, P06)
            }
        }).version(`${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION} (Claude Code)`, "-v, --version", "Output the version number"), K.option("-w, --worktree [name]", "Create a new git worktree for this session (optionally specify a name)"), K.option("--tmux", "Create a tmux session for the worktree (requires --worktree). Uses iTerm2 native panes when available; use --tmux=classic for traditional tmux."), vx()) K.addOption(new q3("--advisor <model>", "Enable the server-side advisor tool with the specified model (alias or full ID).").hideHelp());
    K.addOption(new q3("--enable-auto-mode", "Opt in to auto mode").hideHelp()), K.addOption(new q3("--brief", "Enable SendUserMessage tool for agent-to-user communication")), K.addOption(new q3("--channels <servers...>", "MCP servers whose channel notifications (inbound push) should register this session. Space-separated server names.").hideHelp()), K.addOption(new q3("--dangerously-load-development-channels <servers...>", "Load channel servers not on the approved allowlist. For local channel development only. Shows a confirmation dialog at startup.").hideHelp()), K.addOption(new q3("--agent-id <id>", "Teammate agent ID").hideHelp()), K.addOption(new q3("--agent-name <name>", "Teammate display name").hideHelp()), K.addOption(new q3("--team-name <name>", "Team name for swarm coordination").hideHelp()), K.addOption(new q3("--agent-color <color>", "Teammate UI color").hideHelp()), K.addOption(new q3("--plan-mode-required", "Require plan mode before implementation").hideHelp()), K.addOption(new q3("--parent-session-id <id>", "Parent session ID for analytics correlation").hideHelp()), K.addOption(new q3("--teammate-mode <mode>", 'How to spawn teammates: "tmux", "in-process", or "auto"').choices(["auto", "tmux", "in-process"]).hideHelp()), K.addOption(new q3("--agent-type <type>", "Custom agent type for this teammate").hideHelp()), K.addOption(new q3("--sdk-url <url>", "Use remote WebSocket endpoint for SDK I/O streaming (only with -p and stream-json format)").hideHelp()), K.addOption(new q3("--teleport [session]", "Resume a teleport session, optionally specify session ID").hideHelp()), K.addOption(new q3("--remote [description]", "Create a remote session with the given description").hideHelp()), K.addOption(new q3("--remote-control [name]", "Start an interactive session with Remote Control enabled (optionally named)").argParser((j) => j || !0).hideHelp()), K.addOption(new q3("--rc [name]", "Alias for --remote-control").argParser((j) => j || !0).hideHelp()), K.option("--remote-control-session-name-prefix <prefix>", "Prefix for auto-generated Remote Control session names (default: hostname)"), XK("run_main_options_built");
    let _ = process.argv.includes("-p") || process.argv.includes("--print"),
        z = process.argv.some((j) => j.startsWith("cc://") || j.startsWith("cc+unix://"));
    if (_ && !z) return XK("run_before_parse"), await K.parseAsync(process.argv), XK("run_after_parse"), K;
    let Y = K.command("mcp").description("Configure and manage MCP servers").configureHelp(q()).enablePositionalOptions();
    if (Y.command("serve").description("Start the Claude Code MCP server").option("-d, --debug", "Enable debug mode", () => !0).option("--verbose", "Override verbose mode setting from config", () => !0).action(async ({
            debug: j,
            verbose: H
        }) => {
            let {
                mcpServeHandler: J
            } = await Promise.resolve().then(() => (Cz6(), Sz6));
            await J({
                debug: j,
                verbose: H
            })
        }), vH5(Y), xe()) VH5(Y);
    Y.command("remove <name>").description("Remove an MCP server").option("-s, --scope <scope>", "Configuration scope (local, user, or project) - if not specified, removes from whichever scope it exists in").action(async (j, H) => {
        let [{
            mcpRemoveHandler: J
        }, {
            createSubcommandRoot: X
        }] = await Promise.all([Promise.resolve().then(() => (Cz6(), Sz6)), Promise.resolve().then(() => (Fj(), pj))]);
        await J(await X(), j, H), process.exit(0)
    }), Y.command("list").description("List configured MCP servers. Note: The workspace trust dialog is skipped and stdio servers from .mcp.json are spawned for health checks. Only use this command in directories you trust.").action(async () => {
        let [{
            mcpListHandler: j
        }, {
            createSubcommandRoot: H
        }] = await Promise.all([Promise.resolve().then(() => (Cz6(), Sz6)), Promise.resolve().then(() => (Fj(), pj))]);
        await j(await H())
    }), Y.command("get <name>").description("Get details about an MCP server. Note: The workspace trust dialog is skipped and stdio servers from .mcp.json are spawned for health checks. Only use this command in directories you trust.").action(async (j) => {
        let [{
            mcpGetHandler: H
        }, {
            createSubcommandRoot: J
        }] = await Promise.all([Promise.resolve().then(() => (Cz6(), Sz6)), Promise.resolve().then(() => (Fj(), pj))]);
        await H(await J(), j)
    }), Y.command("add-json <name> <json>").description("Add an MCP server (stdio or SSE) with a JSON string").option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").option("--client-secret", "Prompt for OAuth client secret (or set MCP_CLIENT_SECRET env var)").action(async (j, H, J) => {
        let [{
            mcpAddJsonHandler: X
        }, {
            createSubcommandRoot: M
        }] = await Promise.all([Promise.resolve().then(() => (Cz6(), Sz6)), Promise.resolve().then(() => (Fj(), pj))]);
        await X(await M(), j, H, J), process.exit(0)
    }), Y.command("add-from-claude-desktop").description("Import MCP servers from Claude Desktop (Mac and WSL only)").option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").action(async (j) => {
        let {
            mcpAddFromDesktopHandler: H
        } = await Promise.resolve().then(() => (Cz6(), Sz6));
        await H(j)
    }), Y.command("reset-project-choices").description("Reset all approved and rejected project-scoped (.mcp.json) servers within this project").action(async () => {
        let [{
            mcpResetChoicesHandler: j
        }, {
            createSubcommandRoot: H
        }] = await Promise.all([Promise.resolve().then(() => (Cz6(), Sz6)), Promise.resolve().then(() => (Fj(), pj))]);
        await j(await H()), process.exit(0)
    });
    let A = K.command("auth").description("Manage authentication").configureHelp(q());
    A.command("login").description("Sign in to your Anthropic account").option("--email <email>", "Pre-populate email address on the login page").option("--sso", "Force SSO login flow").option("--console", "Use Anthropic Console (API usage billing) instead of Claude subscription").option("--claudeai", "Use Claude subscription (default)").action(async ({
        email: j,
        sso: H,
        console: J,
        claudeai: X
    }) => {
        let {
            authLogin: M
        } = await Promise.resolve().then(() => (OC6(), gp8));
        await M({
            email: j,
            sso: H,
            console: J,
            claudeai: X
        })
    }), A.command("status").description("Show authentication status").option("--json", "Output as JSON (default)").option("--text", "Output as human-readable text").action(async (j) => {
        let [{
            authStatus: H
        }, {
            createSubcommandRoot: J
        }] = await Promise.all([Promise.resolve().then(() => (OC6(), gp8)), Promise.resolve().then(() => (Fj(), pj))]);
        await H(await J(), j)
    }), A.command("logout").description("Log out from your Anthropic account").action(async () => {
        let [{
            authLogout: j
        }, {
            createSubcommandRoot: H
        }] = await Promise.all([Promise.resolve().then(() => (OC6(), gp8)), Promise.resolve().then(() => (Fj(), pj))]);
        await j(await H()), process.exit(0)
    });
    let O = () => new q3("--cowork", "Use cowork_plugins directory").hideHelp(),
        w = K.command("plugin").alias("plugins").description("Manage Claude Code plugins").configureHelp(q());
    w.command("validate <path>").description("Validate a plugin or marketplace manifest").addOption(O()).action(async (j, H) => {
        let [{
            pluginValidateHandler: J
        }, {
            createSubcommandRoot: X
        }] = await Promise.all([Promise.resolve().then(() => (du(), Qu)), Promise.resolve().then(() => (Fj(), pj))]);
        await J(await X(), j, H)
    }), w.command("list").description("List installed plugins").option("--json", "Output as JSON").option("--available", "Include available plugins from marketplaces (requires --json)").addOption(O()).action(async (j) => {
        let [{
            pluginListHandler: H
        }, {
            createSubcommandRoot: J
        }] = await Promise.all([Promise.resolve().then(() => (du(), Qu)), Promise.resolve().then(() => (Fj(), pj))]);
        await H(await J(), j), process.exit(0)
    });
    let $ = w.command("marketplace").description("Manage Claude Code marketplaces").configureHelp(q());
    if ($.command("add <source>").description("Add a marketplace from a URL, path, or GitHub repo").addOption(O()).option("--sparse <paths...>", "Limit checkout to specific directories via git sparse-checkout (for monorepos). Example: --sparse .claude-plugin plugins").option("--scope <scope>", "Where to declare the marketplace: user (default), project, or local").action(async (j, H) => {
            let [{
                marketplaceAddHandler: J
            }, {
                createSubcommandRoot: X
            }] = await Promise.all([Promise.resolve().then(() => (du(), Qu)), Promise.resolve().then(() => (Fj(), pj))]);
            await J(await X(), j, H)
        }), $.command("list").description("List all configured marketplaces").option("--json", "Output as JSON").addOption(O()).action(async (j) => {
            let [{
                marketplaceListHandler: H
            }, {
                createSubcommandRoot: J
            }] = await Promise.all([Promise.resolve().then(() => (du(), Qu)), Promise.resolve().then(() => (Fj(), pj))]);
            await H(await J(), j), process.exit(0)
        }), $.command("remove <name>").alias("rm").description("Remove a configured marketplace").addOption(O()).action(async (j, H) => {
            let [{
                marketplaceRemoveHandler: J
            }, {
                createSubcommandRoot: X
            }] = await Promise.all([Promise.resolve().then(() => (du(), Qu)), Promise.resolve().then(() => (Fj(), pj))]);
            await J(await X(), j, H), process.exit(0)
        }), $.command("update [name]").description("Update marketplace(s) from their source - updates all if no name specified").addOption(O()).action(async (j, H) => {
            let [{
                marketplaceUpdateHandler: J
            }, {
                createSubcommandRoot: X
            }] = await Promise.all([Promise.resolve().then(() => (du(), Qu)), Promise.resolve().then(() => (Fj(), pj))]);
            await J(await X(), j, H)
        }), w.command("install <plugin>").alias("i").description("Install a plugin from available marketplaces (use plugin@marketplace for specific marketplace)").option("-s, --scope <scope>", "Installation scope: user, project, or local", "user").addOption(O()).action(async (j, H) => {
            let [{
                pluginInstallHandler: J
            }, {
                createSubcommandRoot: X
            }] = await Promise.all([Promise.resolve().then(() => (du(), Qu)), Promise.resolve().then(() => (Fj(), pj))]);
            await J(await X(), j, H)
        }), w.command("uninstall <plugin>").alias("remove").alias("rm").description("Uninstall an installed plugin").option("-s, --scope <scope>", "Uninstall from scope: user, project, or local", "user").option("--keep-data", "Preserve the plugin's persistent data directory (~/.claude/plugins/data/{id}/)").addOption(O()).action(async (j, H) => {
            let [{
                pluginUninstallHandler: J
            }, {
                createSubcommandRoot: X
            }] = await Promise.all([Promise.resolve().then(() => (du(), Qu)), Promise.resolve().then(() => (Fj(), pj))]);
            await J(await X(), j, H)
        }), w.command("enable <plugin>").description("Enable a disabled plugin").option("-s, --scope <scope>", `Installation scope: ${vG.join(", ")} (default: auto-detect)`).addOption(O()).action(async (j, H) => {
            let [{
                pluginEnableHandler: J
            }, {
                createSubcommandRoot: X
            }] = await Promise.all([Promise.resolve().then(() => (du(), Qu)), Promise.resolve().then(() => (Fj(), pj))]);
            await J(await X(), j, H), process.exit(0)
        }), w.command("disable [plugin]").description("Disable an enabled plugin").option("-a, --all", "Disable all enabled plugins").option("-s, --scope <scope>", `Installation scope: ${vG.join(", ")} (default: auto-detect)`).addOption(O()).action(async (j, H) => {
            let [{
                pluginDisableHandler: J
            }, {
                createSubcommandRoot: X
            }] = await Promise.all([Promise.resolve().then(() => (du(), Qu)), Promise.resolve().then(() => (Fj(), pj))]);
            await J(await X(), j, H)
        }), w.command("update <plugin>").description("Update a plugin to the latest version (restart required to apply)").option("-s, --scope <scope>", `Installation scope: ${dP6.join(", ")} (default: user)`).addOption(O()).action(async (j, H) => {
            let {
                pluginUpdateHandler: J
            } = await Promise.resolve().then(() => (du(), Qu));
            await J(j, H)
        }), K.command("setup-token").description("Set up a long-lived authentication token (requires Claude subscription)").action(async () => {
            let [{
                setupTokenHandler: j
            }, {
                createRoot: H
            }] = await Promise.all([Promise.resolve().then(() => (Fj(), pj)), Promise.resolve().then(() => (g6(), kd))]), J = await H(XF(!1));
            await j(J)
        }), K.command("agents").description("List configured agents").option("--setting-sources <sources>", "Comma-separated list of setting sources to load (user, project, local).").action(async () => {
            let [{
                agentsHandler: j
            }, {
                createSubcommandRoot: H
            }] = await Promise.all([Promise.resolve().then(() => (nX5(), lX5)), Promise.resolve().then(() => (Fj(), pj))]);
            await j(await H()), process.exit(0)
        }), Pn8() !== "disabled") {
        let j = K.command("auto-mode").description("Inspect auto mode classifier configuration");
        j.command("defaults").description("Print the default auto mode environment, allow, and deny rules as JSON").action(async () => {
            let [{
                autoModeDefaultsHandler: H
            }, {
                createSubcommandRoot: J
            }] = await Promise.all([Promise.resolve().then(() => (Xe8(), Je8)), Promise.resolve().then(() => (Fj(), pj))]);
            await H(await J()), process.exit(0)
        }), j.command("config").description("Print the effective auto mode config as JSON: your settings where set, defaults otherwise").action(async () => {
            let [{
                autoModeConfigHandler: H
            }, {
                createSubcommandRoot: J
            }] = await Promise.all([Promise.resolve().then(() => (Xe8(), Je8)), Promise.resolve().then(() => (Fj(), pj))]);
            await H(await J()), process.exit(0)
        }), j.command("critique").description("Get AI feedback on your custom auto mode rules").option("--model <model>", "Override which model is used").action(async (H) => {
            let [{
                autoModeCritiqueHandler: J
            }, {
                createSubcommandRoot: X
            }] = await Promise.all([Promise.resolve().then(() => (Xe8(), Je8)), Promise.resolve().then(() => (Fj(), pj))]);
            await J(await X(), H), process.exit()
        })
    }
    return K.command("remote-control", {
        hidden: !0
    }).alias("rc").description("Connect your local environment for remote-control sessions via claude.ai/code").action(async () => {
        let {
            bridgeMain: j
        } = await Promise.resolve().then(() => (cJ7(), dJ7));
        await j(process.argv.slice(3))
    }), K.command("doctor").description("Check the health of your Claude Code auto-updater. Note: The workspace trust dialog is skipped and stdio servers from .mcp.json are spawned for health checks. Only use this command in directories you trust.").action(async () => {
        let [{
            doctorHandler: j
        }, {
            createRoot: H
        }] = await Promise.all([Promise.resolve().then(() => (Fj(), pj)), Promise.resolve().then(() => (g6(), kd))]), J = await H(XF(!1));
        await j(J)
    }), K.command("update").alias("upgrade").description("Check for updates and install if available").action(async () => {
        let {
            update: j
        } = await Promise.resolve().then(() => (aX5(), oX5));
        await j()
    }), K.command("install [target]").description("Install Claude Code native build. Use [target] to specify version (stable, latest, or specific version)").option("--force", "Force installation even if already installed").action(async (j, H) => {
        let {
            installHandler: J
        } = await Promise.resolve().then(() => (Fj(), pj));
        await J(j, H)
    }), XK("run_before_parse"), await K.parseAsync(process.argv), XK("run_after_parse"), XK("main_after_run"), jF6(), K
}
// @from(Ln 575109, Col 0)
async function $PA({
    hasInitialPrompt: q,
    hasStdin: K,
    verbose: _,
    debug: z,
    debugToStderr: Y,
    print: A,
    outputFormat: O,
    inputFormat: w,
    numAllowedTools: $,
    numDisallowedTools: j,
    mcpClientCount: H,
    worktreeEnabled: J,
    skipWebFetchPreflight: X,
    githubActionInputs: M,
    dangerouslySkipPermissionsPassed: P,
    permissionMode: W,
    modeIsBypass: D,
    allowDangerouslySkipPermissionsPassed: Z,
    systemPromptFlag: G,
    appendSystemPromptFlag: f,
    thinkingConfig: v,
    assistantActivationPath: V
}) {
    try {
        let k = wK4();
        d("tengu_init", {
            entrypoint: "claude",
            hasInitialPrompt: q,
            hasStdin: K,
            verbose: _,
            debug: z,
            debugToStderr: Y,
            print: A,
            outputFormat: O,
            inputFormat: w,
            numAllowedTools: $,
            numDisallowedTools: j,
            mcpClientCount: H,
            worktree: J,
            skipWebFetchPreflight: X,
            ...M && {
                githubActionInputs: M
            },
            dangerouslySkipPermissionsPassed: P,
            permissionMode: W,
            modeIsBypass: D,
            inProtectedNamespace: kC(),
            ...pu6(),
            apiKeySource: Vw({
                skipRetrievingKeyFromApiKeyHelper: !0
            }).source,
            allowDangerouslySkipPermissionsPassed: Z,
            thinkingType: v.type,
            ...G && {
                systemPromptFlag: G
            },
            ...f && {
                appendSystemPromptFlag: f
            },
            ...k && {
                noFlickerEnvVar: k
            },
            is_simple: S9() || void 0,
            is_coordinator: void 0,
            ...V && {
                assistantActivationPath: V
            },
            autoUpdatesChannel: v7().autoUpdatesChannel ?? "latest",
            ...{}
        })
    } catch (k) {
        j6(k)
    }
}
// @from(Ln 575185, Col 0)
function v07(q) {}
// @from(Ln 575187, Col 0)
function Me8(q) {
    let K = q.brief,
        _ = S6(process.env.CLAUDE_CODE_BRIEF);
    if (!K && !_) return;
    let {
        isBriefEntitled: z
    } = (rF(), B7(Xe)), Y = z();
    if (Y) dg(!0);
    d("tengu_brief_mode_enabled", {
        enabled: Y,
        gated: !Y,
        source: _ ? "env" : "flag"
    })
}
// @from(Ln 575202, Col 0)
function jPA() {
    (process.stderr.isTTY ? process.stderr : process.stdout.isTTY ? process.stdout : void 0)?.write(aB)
}
// @from(Ln 575206, Col 0)
function HPA(q) {
    if (typeof q !== "object" || q === null) return {};
    let K = q,
        _ = K.teammateMode;
    return {
        agentId: typeof K.agentId === "string" ? K.agentId : void 0,
        agentName: typeof K.agentName === "string" ? K.agentName : void 0,
        teamName: typeof K.teamName === "string" ? K.teamName : void 0,
        agentColor: typeof K.agentColor === "string" ? K.agentColor : void 0,
        planModeRequired: typeof K.planModeRequired === "boolean" ? K.planModeRequired : void 0,
        parentSessionId: typeof K.parentSessionId === "string" ? K.parentSessionId : void 0,
        teammateMode: _ === "auto" || _ === "tmux" || _ === "in-process" ? _ : void 0,
        agentType: typeof K.agentType === "string" ? K.agentType : void 0
    }
}
// @from(Ln 575221, Col 0)
async function JPA(q, K) {
    let _ = K.commands.filter((A) => !(("_hidden" in A) && A._hidden)).flatMap((A) => [A.name(), ...A.aliases()]),
        z = q.toLowerCase(),
        Y = z !== q && _.includes(z) ? z : Yb6(z, _.map((A) => ({
            name: A
        })));
    if (!Y) return;
    d("tengu_unknown_command_suggestion", {}), process.stderr.write([Y8.red(e6.cross) + ` unknown command "${q}"`, Y8.dim(`  ${fU.last} `) + "Did you mean " + Y8.bold(`claude ${Y}`) + "?", "", Y8.dim("Run ") + Y8.dim.bold("claude --help") + Y8.dim(" to list commands, or ") + Y8.dim.bold(`claude -p "${q}"`) + Y8.dim(" to send as a prompt."), ""].join(`
`));
    try {
        await Promise.race([Promise.all([ka(), Ra()]), l7(500, void 0, {
            unref: !0
        })])
    } catch {}
    process.exit(1)
}
// @from(Ln 575237, Col 4)
sX5 = () => (zY(), B7(wT1))
// @from(Ln 575238, Col 4)
lMA = () => B7($NK)
// @from(Ln 575239, Col 4)
nMA = () => (QX6(), B7(G77))
// @from(Ln 575240, Col 4)
iMA = null
// @from(Ln 575241, Col 4)
rMA
// @from(Ln 575241, Col 9)
G07 = 11
// @from(Ln 575242, Col 4)
YPA = void 0
// @from(Ln 575243, Col 4)
gW7 = L(() => {
    ag();
    bO1();
    FR1();
    eJ7();
    Y3();
    Qq();
    G16();
    tI();
    yW6();
    A3();
    z3();
    hk();
    YX7();
    II();
    tO5();
    BB();
    B1();
    qw5();
    sF8();
    a_6();
    rR();
    dC1();
    J2();
    tR6();
    td();
    is();
    fO();
    NY8();
    T7();
    h1();
    Ga6();
    hf();
    zf();
    bz8();
    _7();
    NK();
    aR6();
    ox();
    zK6();
    $t8();
    e8();
    yP7();
    Yw5();
    O46();
    J$6();
    BB();
    B1();
    C8();
    Na8();
    Ka6();
    Ow5();
    $w5();
    y8();
    kW7();
    CA();
    T25();
    R46();
    FW7();
    dI();
    oW();
    UW7();
    wH5();
    jH5();
    JH5();
    cP();
    Xh6();
    ht();
    DW6();
    AJ();
    IX6();
    oW7();
    ZH5();
    Q8();
    jP7();
    nO();
    br8();
    pK();
    OH7();
    mO();
    U8();
    wW7();
    Sq();
    jQ();
    OP();
    vX();
    uR();
    yD();
    aK8();
    iK6();
    WX6();
    J58();
    Jy();
    BI();
    g4();
    hX8();
    a1();
    Li();
    sK6();
    GH5();
    cW();
    dc();
    TH5();
    kH5();
    Ox8();
    tS6();
    rD();
    e38();
    rP7();
    cM6();
    ip();
    R9();
    sR();
    Va();
    oI6();
    wf();
    n7();
    K8();
    m8();
    Yq();
    CY();
    o88();
    WR1();
    $G();
    hY8();
    aY();
    LH5();
    y8();
    RH5();
    CH5();
    IH5();
    uH5();
    mH5();
    pH5();
    gH5();
    QH5();
    cH5();
    nH5();
    rH5();
    MP7();
    aH5();
    QR6();
    nl();
    LJ6();
    rR6();
    du6();
    Cf();
    pv();
    VA();
    oY8();
    vH();
    ix6();
    yY();
    sP7();
    VX();
    sk();
    NR();
    B26();
    tD();
    process.env.NoDefaultCurrentDirectoryInExePath = "1";
    XK("main_tsx_entry");
    tg7();
    kUq();
    rMA = (Kn(), B7(Pe));
    XK("main_tsx_imports_loaded");
    if (aMA()) process.exit(1)
})
// @from(Ln 575416, Col 0)
async function XPA() {
    let q = process.argv.slice(2);
    if (q.length === 1 && (q[0] === "--version" || q[0] === "-v" || q[0] === "-V")) {
        console.log(`${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION} (Claude Code)`);
        return
    }
    let {
        profileCheckpoint: K
    } = await Promise.resolve().then(() => (ag(), RT7));
    if (K("cli_entry"), process.argv[2] === "--claude-in-chrome-mcp") {
        K("cli_claude_in_chrome_mcp_path");
        let {
            runClaudeInChromeMcpServer: A
        } = await Promise.resolve().then(() => (qY7(), ez7));
        await A();
        return
    } else if (process.argv[2] === "--chrome-native-host") {
        K("cli_chrome_native_host_path");
        let {
            runChromeNativeHost: A
        } = await Promise.resolve().then(() => (w15(), O15));
        await A();
        return
    } else if (process.argv[2] === "--computer-use-mcp") {
        K("cli_computer_use_mcp_path");
        let {
            runComputerUseMcpServer: A
        } = await Promise.resolve().then(() => (lz7(), cz7));
        await A();
        return
    }
    if (q[0] === "remote-control" || q[0] === "rc" || q[0] === "remote" || q[0] === "sync" || q[0] === "bridge") {
        K("cli_bridge_path");
        let {
            enableConfigs: A
        } = await Promise.resolve().then(() => (h1(), P46));
        A();
        let {
            getBridgeDisabledReason: O,
            checkBridgeMinVersion: w
        } = await Promise.resolve().then(() => (aR(), co1)), {
            BRIDGE_LOGIN_ERROR: $
        } = await Promise.resolve().then(() => XlK), {
            bridgeMain: j
        } = await Promise.resolve().then(() => (cJ7(), dJ7)), {
            exitWithError: H
        } = await Promise.resolve().then(() => M71), {
            getClaudeAIOAuthTokens: J
        } = await Promise.resolve().then(() => (T7(), zR));
        if (!J()?.accessToken) H($);
        let X = await O();
        if (X) H(`Error: ${X}`);
        let M = w();
        if (M) H(M);
        let {
            waitForPolicyLimitsToLoad: P,
            isPolicyAllowed: W
        } = await Promise.resolve().then(() => (J2(), Du8));
        if (await P(), !W("allow_remote_control")) H("Error: Remote Control is disabled by your organization's policy.");
        await j(q.slice(1));
        return
    }
    if (!1) switch (q[0]) {
        case "logs":
        case "attach":
        case "kill":
        case "rm":
        default:
    }
    if ((q.includes("--tmux") || q.includes("--tmux=classic")) && (q.includes("-w") || q.includes("--worktree") || q.some((A) => A.startsWith("--worktree=")))) {
        K("cli_tmux_worktree_fast_path");
        let {
            enableConfigs: A
        } = await Promise.resolve().then(() => (h1(), P46));
        A();
        let {
            isWorktreeModeEnabled: O
        } = await Promise.resolve().then(() => LTK);
        if (O()) {
            let {
                execIntoTmuxWorktree: w
            } = await Promise.resolve().then(() => (tD(), M85)), $ = await w(q);
            if ($.handled) return;
            if ($.error) {
                let {
                    exitWithError: j
                } = await Promise.resolve().then(() => M71);
                j($.error)
            }
        }
    }
    if (q.length === 1 && (q[0] === "--update" || q[0] === "--upgrade")) process.argv = [process.argv[0], process.argv[1], "update"];
    if (q.includes("--bare")) process.env.CLAUDE_CODE_SIMPLE = "1";
    let {
        startCapturingEarlyInput: z
    } = await Promise.resolve().then(() => (Ga6(), oK4));
    z(), K("cli_before_main_import");
    let {
        main: Y
    } = await Promise.resolve().then(() => (gW7(), eX5));
    K("cli_after_main_import"), await Y(), K("cli_after_main_complete")
}