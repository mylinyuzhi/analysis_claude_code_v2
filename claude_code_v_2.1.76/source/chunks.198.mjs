
// @from(Ln 512888, Col 0)
async function OVz() {
    Zq("run_function_start");

    function A() {
        let w = (O) => O.long?.replace(/^--/, "") ?? O.short?.replace(/^-/, "") ?? "";
        return Object.assign({
            sortSubcommands: !0,
            sortOptions: !0
        }, {
            compareOptions: (O, $) => w(O).localeCompare(w($))
        })
    }
    let q = new fkq().configureHelp(A()).enablePositionalOptions();
    Zq("run_commander_initialized"), q.hook("preAction", async (w) => {
        Zq("preAction_start"), await Wvq(), Zq("preAction_after_mdm"), await rVq(), Zq("preAction_after_init");
        let {
            initializeErrorLogSink: O
        } = await Promise.resolve().then(() => (WC1(), do8));
        O(), o_6(), Zq("preAction_after_sinks");
        let $ = w.getOptionValue("pluginDir");
        if (Array.isArray($) && $.length > 0 && $.every((H) => typeof H === "string")) xu1($), XZ("preAction: --plugin-dir inline plugins");
        eNz(), Zq("preAction_after_migrations"), jV4(), IR8(), Zq("preAction_after_remote_settings"), Zq("preAction_after_settings_sync")
    }), q.name("claude").description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output").argument("[prompt]", "Your prompt", String).helpOption("-h, --help", "Display help for command").option("-d, --debug [filter]", 'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!1p,!file")', (w) => {
        return !0
    }).addOption(new VK("-d2e, --debug-to-stderr", "Enable debug mode (to stderr)").argParser(Boolean).hideHelp()).option("--debug-file <path>", "Write debug logs to a specific file path (implicitly enables debug mode)", () => !0).option("--verbose", "Override verbose mode setting from config", () => !0).option("-p, --print", "Print response and exit (useful for pipes). Note: The workspace trust dialog is skipped when Claude is run with the -p mode. Only use this flag in directories you trust.", () => !0).addOption(new VK("--init", "Run Setup hooks with init trigger, then continue").hideHelp()).addOption(new VK("--init-only", "Run Setup and SessionStart:startup hooks, then exit").hideHelp()).addOption(new VK("--maintenance", "Run Setup hooks with maintenance trigger, then continue").hideHelp()).addOption(new VK("--output-format <format>", 'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)').choices(["text", "json", "stream-json"])).addOption(new VK("--json-schema <schema>", 'JSON Schema for structured output validation. Example: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}').argParser(String)).option("--include-partial-messages", "Include partial message chunks as they arrive (only works with --print and --output-format=stream-json)", () => !0).addOption(new VK("--input-format <format>", 'Input format (only works with --print): "text" (default), or "stream-json" (realtime streaming input)').choices(["text", "stream-json"])).option("--mcp-debug", "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)", () => !0).option("--dangerously-skip-permissions", "Bypass all permission checks. Recommended only for sandboxes with no internet access.", () => !0).option("--allow-dangerously-skip-permissions", "Enable bypassing all permission checks as an option, without it being enabled by default. Recommended only for sandboxes with no internet access.", () => !0).addOption(new VK("--thinking <mode>", "Thinking mode: enabled (equivalent to adaptive), disabled").choices(["enabled", "adaptive", "disabled"]).hideHelp()).addOption(new VK("--max-thinking-tokens <tokens>", "[DEPRECATED. Use --thinking instead for newer models] Maximum number of thinking tokens (only works with --print)").argParser(Number).hideHelp()).addOption(new VK("--max-turns <turns>", "Maximum number of agentic turns in non-interactive mode. This will early exit the conversation after the specified number of turns. (only works with --print)").argParser(Number).hideHelp()).addOption(new VK("--max-budget-usd <amount>", "Maximum dollar amount to spend on API calls (only works with --print)").argParser((w) => {
        let O = Number(w);
        if (isNaN(O) || O <= 0) throw Error("--max-budget-usd must be a positive number greater than 0");
        return O
    })).option("--replay-user-messages", "Re-emit user messages from stdin back on stdout for acknowledgment (only works with --input-format=stream-json and --output-format=stream-json)", () => !0).addOption(new VK("--enable-auth-status", "Enable auth status messages in SDK mode").default(!1).hideHelp()).option("--allowedTools, --allowed-tools <tools...>", 'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")').option("--tools <tools...>", 'Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names (e.g. "Bash,Edit,Read").').option("--disallowedTools, --disallowed-tools <tools...>", 'Comma or space-separated list of tool names to deny (e.g. "Bash(git:*) Edit")').option("--mcp-config <configs...>", "Load MCP servers from JSON files or strings (space-separated)").addOption(new VK("--permission-prompt-tool <tool>", "MCP tool to use for permission prompts (only works with --print)").argParser(String).hideHelp()).addOption(new VK("--system-prompt <prompt>", "System prompt to use for the session").argParser(String)).addOption(new VK("--system-prompt-file <file>", "Read system prompt from a file").argParser(String).hideHelp()).addOption(new VK("--append-system-prompt <prompt>", "Append a system prompt to the default system prompt").argParser(String)).addOption(new VK("--append-system-prompt-file <file>", "Read system prompt from a file and append to the default system prompt").argParser(String).hideHelp()).addOption(new VK("--permission-mode <mode>", "Permission mode to use for the session").argParser(String).choices(CW)).option("-c, --continue", "Continue the most recent conversation in the current directory", () => !0).option("-r, --resume [value]", "Resume a conversation by session ID, or open interactive picker with optional search term", (w) => w || !0).option("--fork-session", "When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)", () => !0).addOption(new VK("--prefill <text>", "Pre-fill the prompt input with text without submitting it").hideHelp()).addOption(new VK("--deep-link-origin", "Signal that this session was launched from a deep link").hideHelp()).option("--from-pr [value]", "Resume a session linked to a PR by PR number/URL, or open interactive picker with optional search term", (w) => w || !0).option("--no-session-persistence", "Disable session persistence - sessions will not be saved to disk and cannot be resumed (only works with --print)").addOption(new VK("--resume-session-at <message id>", "When resuming, only messages up to and including the assistant message with <message.id> (use with --resume in print mode)").argParser(String).hideHelp()).addOption(new VK("--rewind-files <user-message-id>", "Restore files to state at the specified user message and exit (requires --resume)").hideHelp()).option("--model <model>", "Model for the current session. Provide an alias for the latest model (e.g. 'sonnet' or 'opus') or a model's full name (e.g. 'claude-sonnet-4-6').").addOption(new VK("--effort <level>", "Effort level for the current session (low, medium, high, max)").argParser((w) => {
        let O = w.toLowerCase(),
            $ = ["low", "medium", "high", "max"];
        if (!$.includes(O)) throw new Gkq(`It must be one of: ${$.join(", ")}`);
        return O
    })).option("--agent <agent>", "Agent for the current session. Overrides the 'agent' setting.").option("--betas <betas...>", "Beta headers to include in API requests (API key users only)").option("--fallback-model <model>", "Enable automatic fallback to specified model when default model is overloaded (only works with --print)").addOption(new VK("--workload <tag>", "Workload tag for billing-header attribution (cc_workload). Process-scoped; set by SDK daemon callers that spawn subprocesses for cron work. (only works with --print)").hideHelp()).option("--settings <file-or-json>", "Path to a settings JSON file or a JSON string to load additional settings from").option("--add-dir <directories...>", "Additional directories to allow tool access to").option("--ide", "Automatically connect to IDE on startup if exactly one valid IDE is available", () => !0).option("--strict-mcp-config", "Only use MCP servers from --mcp-config, ignoring all other MCP configurations", () => !0).option("--session-id <uuid>", "Use a specific session ID for the conversation (must be a valid UUID)").option("-n, --name <name>", "Set a display name for this session (shown in /resume and terminal title)").option("--agents <json>", `JSON object defining custom agents (e.g. '{"reviewer": {"description": "Reviews code", "prompt": "You are a code reviewer"}}')`).option("--setting-sources <sources>", "Comma-separated list of setting sources to load (user, project, local).").option("--plugin-dir <path>", "Load plugins from a directory for this session only (repeatable: --plugin-dir A --plugin-dir B)", (w, O) => [...O, w], []).option("--disable-slash-commands", "Disable all skills", () => !0).option("--chrome", "Enable Claude in Chrome integration").option("--no-chrome", "Disable Claude in Chrome integration").option("--file <specs...>", "File resources to download at startup. Format: file_id:relative_path (e.g., --file file_abc:doc.txt file_def:img.png)").action(async (w, O) => {
        if (Zq("action_handler_start"), w === "code") d("tengu_code_prompt_ignored", {}), console.warn(O1.yellow("Tip: You can launch Claude Code with just `claude`")), w = void 0;
        if (w && typeof w === "string" && !/\s/.test(w) && w.length > 0) d("tengu_single_word_prompt", {
            length: w.length
        });
        let $ = !1,
            H, {
                debug: j = !1,
                debugToStderr: J = !1,
                dangerouslySkipPermissions: M,
                allowDangerouslySkipPermissions: D = !1,
                tools: X = [],
                allowedTools: P = [],
                disallowedTools: W = [],
                mcpConfig: Z = [],
                permissionMode: G,
                addDir: f = [],
                fallbackModel: v,
                betas: N = [],
                ide: V = !1,
                sessionId: L,
                includePartialMessages: h
            } = O;
        if (O.prefill) Tj8(O.prefill);
        let R, u = O.agents,
            I = O.agent,
            g = O.outputFormat,
            B = O.inputFormat,
            b = O.verbose ?? X1().verbose,
            p = O.print,
            Q = O.init ?? !1,
            U = O.initOnly ?? !1,
            r = O.maintenance ?? !1,
            e = O.disableSlashCommands || !1,
            Y6 = !1,
            H6 = Y6 ? typeof Y6 === "string" ? Y6 : $T8 : void 0,
            J6 = ST6() ? O.worktree : void 0,
            K6 = typeof J6 === "string" ? J6 : void 0,
            s = J6 !== void 0,
            X6;
        if (K6) {
            let Q1 = lN1(K6);
            if (Q1 !== null) X6 = Q1, K6 = void 0
        }
        let z6 = ST6() && O.tmux === !0;
        if (z6) {
            if (!s) process.stderr.write(O1.red(`Error: --tmux requires --worktree
`)), process.exit(1);
            if (y8() === "windows") process.stderr.write(O1.red(`Error: --tmux is not supported on Windows
`)), process.exit(1);
            if (!await mu8()) process.stderr.write(O1.red(`Error: tmux is not installed.
${Bu8()}
`)), process.exit(1)
        }
        let N6;
        if (E7()) {
            let Q1 = jVz(O);
            N6 = Q1;
            let zA = Q1.agentId || Q1.agentName || Q1.teamName,
                gA = Q1.agentId && Q1.agentName && Q1.teamName;
            if (zA && !gA) process.stderr.write(O1.red(`Error: --agent-id, --agent-name, and --team-name must all be provided together
`)), process.exit(1);
            if (Q1.agentId && Q1.agentName && Q1.teamName) EFq().setDynamicTeamContext?.({
                agentId: Q1.agentId,
                agentName: Q1.agentName,
                teamName: Q1.teamName,
                color: Q1.agentColor,
                planModeRequired: Q1.planModeRequired ?? !1,
                parentSessionId: Q1.parentSessionId
            });
            if (Q1.teammateMode) cNz().setCliTeammateModeOverride?.(Q1.teammateMode)
        }
        let $6 = O.sdkUrl ?? void 0,
            n = h || t6(process.env.CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES);
        if ($6) {
            if (!B) B = "stream-json";
            if (!g) g = "stream-json";
            if (O.verbose === void 0) b = !0;
            if (!O.print) p = !0
        }
        let o = O.teleport ?? null,
            a = O.remote,
            i = a === !0 ? "" : a ?? null,
            l = O.remoteControl ?? O.rc,
            q6 = !1,
            w6 = typeof l === "string" && l.length > 0 ? l : void 0;
        if (L) {
            if ((O.continue || O.resume) && !O.forkSession) process.stderr.write(O1.red(`Error: --session-id can only be used with --continue or --resume if --fork-session is also specified.
`)), process.exit(1);
            if (!$6) {
                let Q1 = nk(L);
                if (!Q1) process.stderr.write(O1.red(`Error: Invalid session ID. Must be a valid UUID.
`)), process.exit(1);
                if (fU6(Q1)) process.stderr.write(O1.red(`Error: Session ID ${Q1} is already in use.
`)), process.exit(1)
            }
        }
        let O6 = O.file;
        if (O6 && O6.length > 0) {
            let Q1 = UW();
            if (!Q1) process.stderr.write(O1.red(`Error: Session token required for file downloads. CLAUDE_CODE_SESSION_ACCESS_TOKEN must be set.
`)), process.exit(1);
            let zA = process.env.CLAUDE_CODE_REMOTE_SESSION_ID || R1(),
                gA = Nkq(O6);
            if (gA.length > 0) {
                let k7 = {
                    baseUrl: process.env.ANTHROPIC_BASE_URL || P7().BASE_API_URL,
                    oauthToken: Q1,
                    sessionId: zA
                };
                R = vkq(gA, k7)
            }
        }
        let L6 = q7();
        if (v && O.model && v === O.model) process.stderr.write(O1.red(`Error: Fallback model cannot be the same as the main model. Please specify a different model for --fallback-model.
`)), process.exit(1);
        let y6 = O.systemPrompt;
        if (O.systemPromptFile) {
            if (O.systemPrompt) process.stderr.write(O1.red(`Error: Cannot use both --system-prompt and --system-prompt-file. Please use only one.
`)), process.exit(1);
            try {
                let Q1 = ca6(O.systemPromptFile);
                y6 = kFq(Q1, "utf8")
            } catch (Q1) {
                if (Q1.code === "ENOENT") process.stderr.write(O1.red(`Error: System prompt file not found: ${ca6(O.systemPromptFile)}
`)), process.exit(1);
                process.stderr.write(O1.red(`Error reading system prompt file: ${_1(Q1)}
`)), process.exit(1)
            }
        }
        let G6 = O.appendSystemPrompt;
        if (O.appendSystemPromptFile) {
            if (O.appendSystemPrompt) process.stderr.write(O1.red(`Error: Cannot use both --append-system-prompt and --append-system-prompt-file. Please use only one.
`)), process.exit(1);
            try {
                let Q1 = ca6(O.appendSystemPromptFile);
                G6 = kFq(Q1, "utf8")
            } catch (Q1) {
                if (Q1.code === "ENOENT") process.stderr.write(O1.red(`Error: Append system prompt file not found: ${ca6(O.appendSystemPromptFile)}
`)), process.exit(1);
                process.stderr.write(O1.red(`Error reading append system prompt file: ${_1(Q1)}
`)), process.exit(1)
            }
        }
        if (E7() && N6?.agentId && N6?.agentName && N6?.teamName) {
            let Q1 = dNz().TEAMMATE_SYSTEM_PROMPT_ADDENDUM;
            G6 = G6 ? `${G6}

${Q1}` : Q1
        }
        let {
            mode: R6,
            notification: T6
        } = pn8({
            permissionModeCli: G,
            dangerouslySkipPermissions: M
        });
        if (mu1(R6 === "bypassPermissions"), O.enableAutoMode || G === "auto" || R6 === "auto" || !G && KS1()) nNz?.setAutoModeFlagCli(!0);
        let D6 = {};
        if (Z && Z.length > 0) {
            let Q1 = Z.map((k7) => k7.trim()).filter((k7) => k7.length > 0),
                zA = {},
                gA = [];
            for (let k7 of Q1) {
                let Q4 = null,
                    X5 = [],
                    sq = WK(k7);
                if (sq) {
                    let g4 = DQ6({
                        configObject: sq,
                        filePath: "command line",
                        expandVars: !0,
                        scope: "dynamic"
                    });
                    if (g4.config) Q4 = g4.config.mcpServers;
                    else X5 = g4.errors
                } else {
                    let g4 = ca6(k7),
                        v4 = HZ6({
                            filePath: g4,
                            expandVars: !0,
                            scope: "dynamic"
                        });
                    if (v4.config) Q4 = v4.config.mcpServers;
                    else X5 = v4.errors
                }
                if (X5.length > 0) gA.push(...X5);
                else if (Q4) zA = {
                    ...zA,
                    ...Q4
                }
            }
            if (gA.length > 0) {
                let k7 = gA.map((Q4) => `${Q4.path?Q4.path+": ":""}${Q4.message}`).join(`
`);
                k(`--mcp-config validation failed (${gA.length} errors): ${k7}`, {
                    level: "error"
                }), process.stderr.write(`Error: Invalid MCP configuration:
${k7}
`), process.exit(1)
            }
            if (Object.keys(zA).length > 0) {
                if (Object.keys(zA).some(W96)) throw Error(`Invalid MCP configuration: "${lv}" is a reserved MCP name.`);
                let k7 = K36(zA, (Q4) => ({
                    ...Q4,
                    scope: "dynamic"
                }));
                D6 = {
                    ...D6,
                    ...k7
                }
            }
        }
        let Q6 = O;
        uu1(Q6.chrome);
        let k6 = zh1(Q6.chrome) && iA(),
            Z6 = !k6 && kN6();
        if (k6) {
            let Q1 = y8();
            try {
                d("tengu_claude_in_chrome_setup", {
                    platform: Q1
                });
                let {
                    mcpConfig: zA,
                    allowedTools: gA,
                    systemPrompt: k7
                } = dl8();
                if (D6 = {
                        ...D6,
                        ...zA
                    }, P.push(...gA), k7) G6 = G6 ? `${k7}

${G6}` : k7
            } catch (zA) {
                d("tengu_claude_in_chrome_setup_failed", {
                    platform: Q1
                }), k(`[Claude in Chrome] Error: ${zA}`), _6(zA), console.error("Error: Failed to run with Claude in Chrome."), process.exit(1)
            }
        } else if (Z6) try {
            let {
                mcpConfig: Q1
            } = dl8();
            D6 = {
                ...D6,
                ...Q1
            }, G6 = G6 ? `${G6}

${cF8}` : cF8
        } catch (Q1) {
            k(`[Claude in Chrome] Error (auto-enable): ${Q1}`)
        }
        let u6 = O.strictMcpConfig || !1;
        if (JZ6()) {
            if (u6) process.stderr.write(O1.red("You cannot use --strict-mcp-config when an enterprise MCP config is present")), process.exit(1);
            if (D6 && !vw4(D6)) process.stderr.write(O1.red("You cannot dynamically configure MCP servers when an enterprise MCP config is present")), process.exit(1)
        }
        if (ak6(f), X.length > 0) {
            let {
                BRIEF_TOOL_NAME: Q1,
                LEGACY_BRIEF_TOOL_NAME: zA
            } = (gu(), k4(UQ)), {
                isBriefEntitled: gA
            } = (qF(), k4(xl)), k7 = Kh(X);
            if ((k7.includes(Q1) || k7.includes(zA)) && gA()) Lx(!0)
        }
        let C6 = await Qn8({
                allowedToolsCli: P,
                disallowedToolsCli: W,
                baseToolsCli: X,
                permissionMode: R6,
                allowDangerouslySkipPermissions: D,
                addDirs: f
            }),
            o6 = C6.toolPermissionContext,
            {
                warnings: V6,
                dangerousPermissions: b6,
                overlyBroadBashPermissions: E6
            } = C6;
        if (b6.length > 0) o6 = Vi(o6);
        V6.forEach((Q1) => {
            console.error(Q1)
        }), eQ4(), k("[STARTUP] Loading MCP configs...");
        let U6 = Date.now(),
            c6, K1 = (u6 ? Promise.resolve({
                servers: {}
            }) : jZ6()).then((Q1) => {
                return c6 = Date.now() - U6, Q1
            }),
            j6 = L6 && !u6 && !JZ6() ? Z96() : Promise.resolve({});
        if (B && B !== "text" && B !== "stream-json") console.error(`Error: Invalid input format "${B}".`), process.exit(1);
        if (B === "stream-json" && g !== "stream-json") console.error("Error: --input-format=stream-json requires output-format=stream-json."), process.exit(1);
        if ($6) {
            if (B !== "stream-json" || g !== "stream-json") console.error("Error: --sdk-url requires both --input-format=stream-json and --output-format=stream-json."), process.exit(1)
        }
        let W6 = !!O.replayUserMessages;
        if (O.replayUserMessages) {
            if (B !== "stream-json" || g !== "stream-json") console.error("Error: --replay-user-messages requires both --input-format=stream-json and --output-format=stream-json."), process.exit(1)
        }
        if (n) {
            if (!L6 || g !== "stream-json") Gn("Error: --include-partial-messages requires --print and --output-format=stream-json."), process.exit(1)
        }
        if (O.sessionPersistence === !1 && !L6) Gn("Error: --no-session-persistence can only be used with --print mode."), process.exit(1);
        let d6 = await wVz(w || "", B ?? "text");
        Zq("action_after_input_prompt"), hb1(O);
        let S6 = FX(o6);
        if (Zq("action_tools_loaded"), !L6) Promise.resolve().then(() => (Tu6(), Yk7)).then((Q1) => Q1.initLayout());
        let g6;
        if (DY4({
                isNonInteractiveSession: L6
            }) && O.jsonSchema) g6 = i1(O.jsonSchema);
        if (g6) {
            let Q1 = aP1(g6);
            if ("tool" in Q1) S6 = [...S6, Q1.tool], d("tengu_structured_output_enabled", {
                schema_property_count: Object.keys(g6.properties || {}).length,
                has_required_fields: Boolean(g6.required)
            });
            else d("tengu_structured_output_failure", {
                error: "Invalid JSON schema"
            })
        }
        Zq("action_before_setup"), k("[STARTUP] Running setup()...");
        let D1 = Date.now(),
            {
                setup: J1
            } = await Promise.resolve().then(() => (nC1(), iC1)),
            E1 = void 0;
        if (await J1(iNz(), R6, D, s, K6, z6, L ? nk(L) : void 0, X6, E1), k(`[STARTUP] setup() completed in ${Date.now()-D1}ms`), Zq("action_after_setup"), q7()) bF(), mw();
        let K8 = O.name?.trim();
        if (K8) Wr8(K8);
        let e8 = O.model || process.env.ANTHROPIC_MODEL,
            n8 = O.model === "default" ? g0() : O.model,
            H7 = v === "default" ? g0() : v,
            GA = G1();
        k("[STARTUP] Loading commands and agents...");
        let h8 = Date.now(),
            [U8, P4] = await Promise.all([I0(GA), UI(GA)]);
        k(`[STARTUP] Commands and agents loaded in ${Date.now()-h8}ms`), Zq("action_commands_loaded");
        let T4 = [];
        if (u) try {
            let Q1 = WK(u);
            if (Q1) T4 = _Q6(Q1, "flagSettings")
        } catch (Q1) {
            _6(Q1)
        }
        let $4 = [...P4.allAgents, ...T4],
            qA = {
                ...P4,
                allAgents: $4,
                activeAgents: dv($4)
            },
            d7 = I ?? mA().agent,
            W4;
        if (d7) {
            if (W4 = qA.activeAgents.find((Q1) => Q1.agentType === d7), !W4) k(`Warning: agent "${d7}" not found. Available agents: ${qA.activeAgents.map((Q1)=>Q1.agentType).join(", ")}. Using default behavior.`)
        }
        if (Wp(W4?.agentType), W4) d("tengu_agent_flag", {
            agentType: Qj(W4) ? W4.agentType : "custom",
            ...I && {
                source: "cli"
            }
        });
        if (W4?.agentType) qo6(W4.agentType);
        if (L6 && W4 && !y6 && !Qj(W4)) {
            let Q1 = W4.getSystemPrompt();
            if (Q1) y6 = Q1
        }
        let Dz = n8;
        if (!Dz && W4?.model && W4.model !== "inherit") Dz = H5(W4.model);
        MW(Dz), Mu1(uR() || null);
        let JK = xw6(),
            F3 = H5(JK ?? g0());
        if (E7() && N6?.agentId && N6?.agentName && N6?.teamName && N6?.agentType) {
            let Q1 = qA.activeAgents.find((zA) => zA.agentType === N6.agentType);
            if (Q1) {
                let zA;
                if (Q1.source === "built-in") k(`[teammate] Built-in agent ${N6.agentType} - skipping custom prompt (not supported)`);
                else zA = Q1.getSystemPrompt();
                if (Q1.memory) d("tengu_agent_memory_loaded", {
                    ...{},
                    scope: Q1.memory,
                    source: "teammate"
                });
                if (zA) {
                    let gA = `
# Custom Agent Instructions
${zA}`;
                    G6 = G6 ? `${G6}

${gA}` : gA
                }
            } else k(`[teammate] Custom agent ${N6.agentType} not found in available agents`)
        }
        if (Sb1(O), !q7() && !KG() && mA().defaultView === "chat") {
            let {
                isBriefEntitled: Q1
            } = (qF(), k4(xl));
            if (Q1()) Lx(!0)
        }
        let MK, k3, M5;
        if (!L6) {
            let Q1 = gEq(!1);
            k3 = Q1.getFpsMetrics, M5 = Q1.stats;
            let {
                createRoot: zA
            } = await Promise.resolve().then(() => (i6(), pu6));
            MK = await zA(Q1.renderOptions), k("[STARTUP] Running showSetupScreens()...");
            let gA = Date.now(),
                k7 = await BEq(MK, R6, D, U8, k6);
            if (k(`[STARTUP] showSetupScreens() completed in ${Date.now()-gA}ms`), l !== void 0) {
                let {
                    isBridgeEnabledBlocking: X5
                } = await Promise.resolve().then(() => (MF(), hy1));
                if (q6 = await X5(), !q6) process.stderr.write(O1.yellow(`Remote Control is not enabled for your account; --rc flag ignored.
`))
            }
            if (k7 && w?.trim().toLowerCase() === "/login") w = "";
            if (k7) pG1(), yU6(), r$6(), EY6();
            let Q4 = await Yl();
            if (!Q4.valid) await zx(MK, Q4.message)
        }
        if (process.exitCode !== void 0) {
            k("Graceful shutdown initiated, skipping further initialization");
            return
        }
        if (dm8(), !L6) {
            let {
                errors: Q1
            } = lq6(), zA = Q1.filter((gA) => !gA.mcpErrorMetadata);
            if (zA.length > 0) {
                let {
                    InvalidSettingsDialog: gA
                } = await Promise.resolve().then(() => (fRq(), GRq));
                await Qh(MK, (k7) => wT.default.createElement(gA, {
                    settingsErrors: zA,
                    onContinue: k7,
                    onExit: () => fK(1)
                }))
            }
        }
        let x5 = w8("tengu_cicada_nap_ms", 0),
            E2 = X1().startupPrefetchedAt ?? 0;
        if (!(x5 > 0 && Date.now() - E2 < x5)) {
            let Q1 = E2 > 0 ? ` last ran ${Math.round((Date.now()-E2)/1000)}s ago` : "";
            if (k(`Starting background startup prefetches${Q1}`), jA4().catch((zA) => _6(zA)), Mjq(), !w8("tengu_miraculo_the_bard", !1)) n21();
            else vO8();
            if (!w8("tengu_miraculo_the_bard2", !1)) $LA();
            if (!L6) oEq();
            if (x5 > 0) d1((zA) => ({
                ...zA,
                startupPrefetchedAt: Date.now()
            }))
        } else k(`Skipping startup prefetches, last ran ${Math.round((Date.now()-E2)/1000)}s ago`), vO8();
        let {
            servers: x9
        } = await K1;
        k(`[STARTUP] MCP configs resolved in ${c6}ms (awaited at +${Date.now()-U6}ms)`);
        let J9 = {
                ...x9,
                ...D6
            },
            sw = {},
            UY = {};
        for (let [Q1, zA] of Object.entries(J9)) {
            let gA = zA;
            if (gA.type === "sdk") sw[Q1] = gA;
            else UY[Q1] = gA
        }
        Zq("action_mcp_configs_loaded");
        let dY = Fr6(UY),
            Bq = j6.then((Q1) => Object.keys(Q1).length > 0 ? Fr6(Q1) : {
                clients: [],
                tools: [],
                commands: []
            }),
            YA = Promise.all([dY, Bq]).then(([Q1, zA]) => ({
                clients: [...Q1.clients, ...zA.clients],
                tools: K0([...Q1.tools, ...zA.tools], "name"),
                commands: [...Q1.commands, ...zA.commands]
            })),
            E3 = U || Q || r || L6 || O.continue || O.resume ? null : C0("startup", {
                agentType: W4?.agentType,
                model: F3
            }),
            u9 = (d6 || L6) && !t6(process.env.MCP_CONNECTION_NONBLOCKING),
            u5 = u9 ? void 0 : YA,
            KK, cY;
        if (u9 && E3)[KK, cY] = await Promise.all([YA, E3]);
        else if (u9) KK = await YA, cY = [];
        else KK = {
            clients: [],
            tools: [],
            commands: []
        }, cY = [];
        let {
            clients: B4,
            tools: lY,
            commands: e3
        } = KK, D5 = fD6(), WY = D5 !== !1 ? {
            type: "adaptive"
        } : {
            type: "disabled"
        };
        if (O.thinking === "adaptive" || O.thinking === "enabled") D5 = !0, WY = {
            type: "adaptive"
        };
        else if (O.thinking === "disabled") D5 = !1, WY = {
            type: "disabled"
        };
        else {
            let Q1 = process.env.MAX_THINKING_TOKENS ? parseInt(process.env.MAX_THINKING_TOKENS, 10) : O.maxThinkingTokens;
            if (Q1 !== void 0) {
                if (Q1 > 0) D5 = !0, WY = {
                    type: "enabled",
                    budgetTokens: Q1
                };
                else if (Q1 === 0) D5 = !1, WY = {
                    type: "disabled"
                }
            }
        }
        if (U1("info", "started", {
                version: {
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.76",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-03-14T00:12:49Z"
                }.VERSION,
                is_native_binary: rY()
            }), E4(async () => {
                U1("info", "exited")
            }), $Vz({
                hasInitialPrompt: Boolean(w),
                hasStdin: Boolean(d6),
                verbose: b,
                debug: j,
                debugToStderr: J,
                print: p ?? !1,
                outputFormat: g ?? "text",
                inputFormat: B ?? "text",
                numAllowedTools: P.length,
                numDisallowedTools: W.length,
                mcpClientCount: Object.keys(J9).length,
                worktreeEnabled: s,
                skipWebFetchPreflight: mA().skipWebFetchPreflight,
                githubActionInputs: process.env.GITHUB_ACTION_INPUTS,
                dangerouslySkipPermissionsPassed: M ?? !1,
                permissionMode: R6,
                modeIsBypass: R6 === "bypassPermissions",
                allowDangerouslySkipPermissionsPassed: D,
                systemPromptFlag: y6 ? O.systemPromptFile ? "file" : "flag" : void 0,
                appendSystemPromptFlag: G6 ? O.appendSystemPromptFile ? "file" : "flag" : void 0,
                thinkingConfig: WY,
                assistantActivationPath: void 0
            }), hGq(UY, o6), QP1(null, "initialization"), rNz(), Kyq().then((Q1) => {
                if (!Q1) return;
                pC1().then((zA) => {
                    if (zA >= 2) d("tengu_concurrent_sessions", {
                        num_sessions: zA
                    })
                })
            }), L6) await Ek8(), Zq("action_after_plugins_init"), Bk8().then(() => Pz6());
        else Ek8().then(async () => {
            Zq("action_after_plugins_init"), await Bk8(), Pz6()
        });
        let y2 = U || Q ? "init" : r ? "maintenance" : null;
        if (U) {
            bF(), await oN1("init", {
                forceSyncExecution: !0
            }), await C0("startup", {
                forceSyncExecution: !0
            }), fK(0);
            return
        }
        if (L6) {
            if (g === "stream-json" || g === "json") rAA(!0);
            bF(), ZC1();
            let Q1 = await Yl();
            if (!Q1.valid) process.stderr.write(Q1.message + `
`), process.exit(1);
            let zA = e ? [] : U8.filter((sq) => sq.type === "prompt" && !sq.disableNonInteractive || sq.type === "local" && sq.supportsNonInteractive),
                gA = z16(),
                k7 = {
                    ...gA,
                    mcp: {
                        ...gA.mcp,
                        clients: B4,
                        commands: e3,
                        tools: lY
                    },
                    toolPermissionContext: o6,
                    effortValue: TD6(O.effort) ?? AO8(),
                    ...Dq() ? {
                        fastMode: fO8(Dz ?? null)
                    } : {}
                };
            if (Dq() && mA().fastMode === !0 && !k7.fastMode) {
                let sq = ra();
                if (sq) process.stderr.write(`[WARN] ${sq}. Using ${Ok}.
`)
            }
            let Q4 = WX1(k7, bi);
            if (o6.mode === "bypassPermissions" || D) cn8(o6);
            if (Dc6(o6, Q4.getState().fastMode).then(({
                    updateContext: sq
                }) => {
                    Q4.setState((g4) => {
                        let v4 = sq(g4.toolPermissionContext);
                        if (v4 === g4.toolPermissionContext) return g4;
                        return {
                            ...g4,
                            toolPermissionContext: v4
                        }
                    })
                }), O.sessionPersistence === !1) gu1(!0);
            Du1(Fvq(N)), mC1(), Promise.resolve().then(() => (Ua8(), RRq)).then((sq) => sq.startBackgroundHousekeeping());
            let {
                runHeadless: X5
            } = await Promise.resolve().then(() => (zSq(), YSq));
            X5(d6, () => Q4.getState(), Q4.setState, zA, S6, sw, qA.activeAgents, {
                continue: O.continue,
                resume: O.resume,
                verbose: b,
                outputFormat: g,
                jsonSchema: g6,
                permissionPromptToolName: O.permissionPromptTool,
                allowedTools: P,
                thinkingConfig: WY,
                maxTurns: O.maxTurns,
                maxBudgetUsd: O.maxBudgetUsd,
                systemPrompt: y6,
                appendSystemPrompt: G6,
                userSpecifiedModel: Dz,
                fallbackModel: H7,
                teleport: o,
                sdkUrl: $6,
                replayUserMessages: W6,
                includePartialMessages: n,
                forkSession: O.forkSession || !1,
                resumeSessionAt: O.resumeSessionAt || void 0,
                rewindFiles: O.rewindFiles,
                enableAuthStatus: O.enableAuthStatus,
                agent: I,
                workload: O.workload,
                setupTrigger: y2 ?? void 0,
                mcpDeferredPromise: u5
            });
            return
        }
        let {
            App: s6
        } = await Promise.resolve().then(() => (HSq(), $Sq));
        d("tengu_startup_manual_model_config", {
            cli_flag: O.model,
            env_var: process.env.ANTHROPIC_MODEL,
            settings_file: (mA() || {}).model,
            subscriptionType: CK(),
            agent: d7
        });
        let A1 = BC1(F3),
            f1 = [];
        if (T6) f1.push({
            key: "permission-mode-notification",
            text: T6,
            priority: "high"
        });
        if (A1) f1.push({
            key: "model-deprecation-warning",
            text: A1,
            color: "warning",
            priority: "high"
        });
        if (E6.length > 0) {
            let Q1 = [...new Set(E6.map((zA) => zA.sourceDisplay))].join(", ");
            f1.push({
                key: "overly-broad-bash-notification",
                text: `Bash(*) allow rule from ${Q1} was ignored — Bash(*) is not available for Ants, please use auto-mode instead`,
                color: "warning",
                priority: "high"
            })
        }
        let h1 = {
                ...o6,
                mode: E7() && EFq().isPlanModeRequired() ? "plan" : o6.mode
            },
            u1 = KG(),
            j8 = {
                settings: mA(),
                tasks: {},
                agentNameRegistry: new Map,
                verbose: b ?? X1().verbose ?? !1,
                mainLoopModel: JK,
                mainLoopModelForSession: null,
                isBriefOnly: u1,
                expandedView: X1().showSpinnerTree ? "teammates" : X1().showExpandedTodos ? "tasks" : "none",
                showTeammateMessagePreview: E7() ? !1 : void 0,
                selectedIPAgentIndex: -1,
                viewSelectionMode: "none",
                toolPermissionContext: h1,
                agent: W4?.agentType,
                agentDefinitions: qA,
                mcp: {
                    clients: [],
                    tools: [],
                    commands: [],
                    resources: {},
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
                kairosEnabled: $,
                remoteSessionUrl: void 0,
                replBridgeEnabled: q6 || e66() || $,
                replBridgeExplicit: q6,
                replBridgeConnected: !1,
                replBridgeSessionActive: !1,
                replBridgeReconnecting: !1,
                replBridgeConnectUrl: void 0,
                replBridgeSessionUrl: void 0,
                replBridgeEnvironmentId: void 0,
                replBridgeSessionId: void 0,
                replBridgeError: void 0,
                replBridgeInitialName: w6,
                showRemoteCallout: !1,
                notifications: {
                    current: null,
                    queue: f1
                },
                elicitation: {
                    queue: []
                },
                todos: {},
                fileHistory: {
                    snapshots: [],
                    trackedFiles: new Set,
                    snapshotSequence: 0
                },
                attribution: g06(),
                thinkingEnabled: D5,
                promptSuggestionEnabled: Yy1(),
                feedbackSurvey: {
                    timeLastShown: null,
                    submitCountAtLastAppearance: null
                },
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
                speculation: q16,
                speculationSessionTimeSavedMs: 0,
                skillImprovement: {
                    suggestion: null
                },
                workerSandboxPermissions: {
                    queue: [],
                    selectedIndex: 0
                },
                pendingWorkerRequest: null,
                pendingSandboxRequest: null,
                prStatus: {
                    number: null,
                    url: null,
                    reviewState: null,
                    lastUpdated: 0
                },
                authVersion: 0,
                initialMessage: d6 ? {
                    message: p1({
                        content: String(d6)
                    })
                } : null,
                effortValue: TD6(O.effort) ?? AO8(),
                activeOverlays: new Set,
                fastMode: fO8(F3),
                teamContext: Lkq?.()
            };
        if (d6) M36(String(d6));
        let l8 = lY;
        aNz();
        let p8 = null,
            {
                REPL: o8
            } = await Promise.resolve().then(() => (at8(), Fgq)),
            a8 = p8 ? p8.then((Q1) => Q1.createSessionTurnUploader()).catch(() => null) : null,
            $A = {
                debug: j || J,
                commands: [...U8, ...e3],
                initialTools: l8,
                mcpClients: B4,
                autoConnectIdeFlag: V,
                mainThreadAgentDefinition: W4,
                disableSlashCommands: e,
                dynamicMcpConfig: D6,
                strictMcpConfig: u6,
                systemPrompt: y6,
                appendSystemPrompt: G6,
                taskListId: H6,
                thinkingConfig: WY,
                ...a8 ? {
                    onTurnComplete: (Q1) => {
                        a8.then((zA) => zA?.(Q1))
                    }
                } : {}
            },
            G7 = {
                modeApi: lNz,
                mainThreadAgentDefinition: W4,
                agentDefinitions: qA,
                currentCwd: GA,
                cliAgents: T4,
                initialState: j8
            };
        if (O.continue) {
            let Q1 = !1;
            try {
                let zA = performance.now(),
                    {
                        clearSessionCaches: gA
                    } = await Promise.resolve().then(() => (Ny1(), kQ8));
                gA();
                let k7 = await h66(void 0, void 0);
                if (!k7) return d("tengu_continue", {
                    success: !1
                }), await zx(MK, "No conversation found to continue");
                let Q4 = await Ia8(k7, {
                    forkSession: !!O.forkSession,
                    includeAttribution: !0
                }, G7);
                if (Q4.restoredAgentDef) W4 = Q4.restoredAgentDef;
                if (om8(Q4.messages)) Jz6();
                hb1(O), Sb1(O), d("tengu_continue", {
                    success: !0,
                    resume_duration_ms: Math.round(performance.now() - zA)
                }), Q1 = !0, await OV6(MK, wT.default.createElement(s6, {
                    getFpsMetrics: k3,
                    stats: M5,
                    initialState: Q4.initialState
                }, wT.default.createElement(o8, {
                    ...$A,
                    mainThreadAgentDefinition: Q4.restoredAgentDef ?? W4,
                    initialMessages: Q4.messages,
                    initialFileHistorySnapshots: Q4.fileHistorySnapshots,
                    initialContentReplacements: Q4.contentReplacements,
                    initialAgentName: Q4.agentName,
                    initialAgentColor: Q4.agentColor
                })))
            } catch (zA) {
                if (!Q1) d("tengu_continue", {
                    success: !1
                });
                _6(zA), process.exit(1)
            }
        } else if (O.resume || O.fromPr || o || i !== null) {
            let {
                clearSessionCaches: Q1
            } = await Promise.resolve().then(() => (Ny1(), kQ8));
            Q1();
            let zA = null,
                gA = void 0,
                k7 = nk(O.resume),
                Q4 = void 0,
                X5 = null,
                sq = void 0;
            if (O.fromPr) {
                if (O.fromPr === !0) sq = !0;
                else if (typeof O.fromPr === "string") sq = O.fromPr
            }
            if (O.resume && typeof O.resume === "string" && !k7) {
                let v4 = O.resume.trim();
                if (v4) {
                    let Cq = await GF(v4, {
                        exact: !0
                    });
                    if (Cq.length === 1) X5 = Cq[0], k7 = n_(X5) ?? null;
                    else Q4 = v4
                }
            }
            if (i !== null || o) await EU6();
            if (i !== null && !qD("allow_remote_control")) return await zx(MK, "Error: Remote Control is disabled by your organization's policy.", () => Vq(1));
            if (o && !qD("allow_remote_sessions")) return await zx(MK, "Error: Remote sessions are disabled by your organization's policy.", () => Vq(1));
            if (i !== null) {
                let v4 = i.length > 0,
                    Cq = w8("tengu_remote_backend", !1);
                if (!Cq && !v4) return await zx(MK, `Error: --remote requires a description.
Usage: claude --remote "your task description"`, () => Vq(1));
                d("tengu_remote_create_session", {
                    has_initial_prompt: String(v4)
                });
                let E5 = await kj(),
                    hK = await Am8(MK, v4 ? i : null, new AbortController().signal, E5 || void 0);
                if (!hK) return d("tengu_remote_create_session_error", {
                    error: "unable_to_create_session"
                }), await zx(MK, "Error: Unable to create remote session", () => Vq(1));
                if (d("tengu_remote_create_session_success", {
                        session_id: hK.id
                    }), !Cq) process.stdout.write(`Created remote session: ${hK.title}
`), process.stdout.write(`View: ${hZ(hK.id)}?m=0
`), process.stdout.write(`Resume with: claude --teleport ${hK.id}
`), await Vq(0), process.exit(0);
                nu1(!0), _P(eJ(hK.id));
                let j3;
                try {
                    j3 = await k0()
                } catch (L2) {
                    return _6(L2 instanceof Error ? L2 : Error("Failed to authenticate for remote session")), await zx(MK, `Error: ${L2 instanceof Error?L2.message:"Failed to authenticate"}`, () => Vq(1))
                }
                let A9 = Ryq(hK.id, j3.accessToken, j3.orgUUID, v4),
                    u7 = `${hZ(hK.id)}?m=0`,
                    Xz = P$(`/remote-control is active. Code in CLI or at ${u7}`, "info"),
                    iY = v4 ? p1({
                        content: i
                    }) : null,
                    gq = {
                        ...j8,
                        remoteSessionUrl: u7
                    },
                    Pz = EZq(U8);
                await OV6(MK, wT.default.createElement(s6, {
                    getFpsMetrics: k3,
                    stats: M5,
                    initialState: gq
                }, wT.default.createElement(o8, {
                    debug: j || J,
                    commands: Pz,
                    initialTools: [],
                    initialMessages: iY ? [Xz, iY] : [Xz],
                    mcpClients: [],
                    autoConnectIdeFlag: V,
                    mainThreadAgentDefinition: W4,
                    disableSlashCommands: e,
                    remoteSessionConfig: A9,
                    thinkingConfig: WY
                })));
                return
            } else if (o) {
                if (o === !0 || o === "") {
                    d("tengu_teleport_interactive_mode", {}), k("selectAndResumeTeleportTask: Starting teleport flow...");
                    let {
                        TeleportResumeWrapper: v4
                    } = await Promise.resolve().then(() => (ngq(), igq)), Cq = await Qh(MK, (hK) => wT.default.createElement(v4, {
                        onComplete: hK,
                        onCancel: () => hK(null),
                        source: "cliArg"
                    }));
                    if (!Cq) await Vq(0), process.exit(0);
                    let {
                        branchError: E5
                    } = await Ml6(Cq.branch);
                    zA = Jl6(Cq.log, E5)
                } else if (typeof o === "string") {
                    d("tengu_teleport_resume_session", {
                        mode: "direct"
                    });
                    try {
                        let v4 = await jf6(o),
                            Cq = await MV1(v4);
                        if (Cq.status === "mismatch" || Cq.status === "not_in_repo") {
                            let j3 = Cq.sessionRepo;
                            if (j3) {
                                let A9 = ekq(j3),
                                    u7 = await AEq(A9);
                                if (u7.length > 0) {
                                    let {
                                        TeleportRepoMismatchDialog: Xz
                                    } = await Promise.resolve().then(() => (ogq(), rgq)), iY = await Qh(MK, (gq) => wT.default.createElement(Xz, {
                                        targetRepo: j3,
                                        initialPaths: u7,
                                        onSelectPath: gq,
                                        onCancel: () => gq(null)
                                    }));
                                    if (iY) process.chdir(iY), VO(iY), Jp(iY);
                                    else await Vq(0)
                                } else throw new yM(`You must run claude --teleport ${o} from a checkout of ${j3}.`, O1.red(`You must run claude --teleport ${o} from a checkout of ${O1.bold(j3)}.
`))
                            }
                        } else if (Cq.status === "error") throw new yM(Cq.errorMessage || "Failed to validate session", O1.red(`Error: ${Cq.errorMessage||"Failed to validate session"}
`));
                        await eu8();
                        let {
                            teleportWithProgress: E5
                        } = await Promise.resolve().then(() => (AFq(), egq)), hK = await E5(MK, o);
                        ok6({
                            sessionId: o
                        }), zA = hK.messages
                    } catch (v4) {
                        if (v4 instanceof yM) process.stderr.write(v4.formattedMessage + `
`);
                        else _6(v4), process.stderr.write(O1.red(`Error: ${_1(v4)}
`));
                        await Vq(1)
                    }
                }
            }
            if (k7) {
                let v4 = k7;
                try {
                    let Cq = performance.now(),
                        E5 = await h66(X5 ?? v4, void 0);
                    if (!E5) return d("tengu_session_resumed", {
                        entrypoint: "cli_flag",
                        success: !1
                    }), await zx(MK, `No conversation found with session ID: ${v4}`);
                    let hK = X5?.fullPath ?? E5.fullPath;
                    if (gA = await Ia8(E5, {
                            forkSession: !!O.forkSession,
                            sessionIdOverride: v4,
                            transcriptPath: hK
                        }, G7), gA.restoredAgentDef) W4 = gA.restoredAgentDef;
                    d("tengu_session_resumed", {
                        entrypoint: "cli_flag",
                        success: !0,
                        resume_duration_ms: Math.round(performance.now() - Cq)
                    })
                } catch (Cq) {
                    d("tengu_session_resumed", {
                        entrypoint: "cli_flag",
                        success: !1
                    }), _6(Cq), await zx(MK, `Failed to resume session ${v4}`)
                }
            }
            if (R) try {
                let v4 = await R,
                    Cq = v4.filter((E5) => !E5.success).length;
                if (Cq > 0) process.stderr.write(O1.yellow(`Warning: ${Cq}/${v4.length} file(s) failed to download.
`))
            } catch (v4) {
                return await zx(MK, `Error downloading files: ${_1(v4)}`)
            }
            let g4 = gA ?? (Array.isArray(zA) ? {
                messages: zA,
                fileHistorySnapshots: void 0,
                agentName: void 0,
                agentColor: void 0,
                restoredAgentDef: W4,
                initialState: j8,
                contentReplacements: void 0
            } : void 0);
            if (g4) {
                if (om8(g4.messages)) Jz6();
                hb1(O), Sb1(O), await OV6(MK, wT.default.createElement(s6, {
                    getFpsMetrics: k3,
                    stats: M5,
                    initialState: g4.initialState
                }, wT.default.createElement(o8, {
                    ...$A,
                    mainThreadAgentDefinition: g4.restoredAgentDef ?? W4,
                    initialMessages: g4.messages,
                    initialFileHistorySnapshots: g4.fileHistorySnapshots,
                    initialContentReplacements: g4.contentReplacements,
                    initialAgentName: g4.agentName,
                    initialAgentColor: g4.agentColor
                })))
            } else {
                let [v4, {
                    ResumeConversation: Cq
                }] = await Promise.all([al(AA()), Promise.resolve().then(() => (YFq(), KFq))]);
                await OV6(MK, wT.default.createElement(s6, {
                    getFpsMetrics: k3,
                    stats: M5,
                    initialState: j8
                }, wT.default.createElement(aj, null, wT.default.createElement(Cq, {
                    ...$A,
                    worktreePaths: v4,
                    initialSearchQuery: Q4,
                    forkSession: O.forkSession,
                    filterByPr: sq
                }))))
            }
        } else {
            let Q1 = E3 && cY.length === 0 ? E3 : void 0;
            Zq("action_after_hooks"), hb1(O), Sb1(O);
            let zA = null,
                gA = zA ? [zA, ...cY] : cY.length > 0 ? cY : void 0;
            await OV6(MK, wT.default.createElement(s6, {
                getFpsMetrics: k3,
                stats: M5,
                initialState: j8
            }, wT.default.createElement(o8, {
                ...$A,
                initialMessages: gA,
                pendingHookMessages: Q1
            })))
        }
    }).version(`${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION} (Claude Code)`, "-v, --version", "Output the version number"), q.option("-w, --worktree [name]", "Create a new git worktree for this session (optionally specify a name)"), q.option("--tmux", "Create a tmux session for the worktree (requires --worktree). Uses iTerm2 native panes when available; use --tmux=classic for traditional tmux."), q.addOption(new VK("--enable-auto-mode", "Opt in to auto mode").hideHelp()), q.addOption(new VK("--brief", "Enable SendUserMessage tool for agent-to-user communication")), q.addOption(new VK("--agent-id <id>", "Teammate agent ID").hideHelp()), q.addOption(new VK("--agent-name <name>", "Teammate display name").hideHelp()), q.addOption(new VK("--team-name <name>", "Team name for swarm coordination").hideHelp()), q.addOption(new VK("--agent-color <color>", "Teammate UI color").hideHelp()), q.addOption(new VK("--plan-mode-required", "Require plan mode before implementation").hideHelp()), q.addOption(new VK("--parent-session-id <id>", "Parent session ID for analytics correlation").hideHelp()), q.addOption(new VK("--teammate-mode <mode>", 'How to spawn teammates: "tmux", "in-process", or "auto"').choices(["auto", "tmux", "in-process"]).hideHelp()), q.addOption(new VK("--agent-type <type>", "Custom agent type for this teammate").hideHelp()), q.addOption(new VK("--sdk-url <url>", "Use remote WebSocket endpoint for SDK I/O streaming (only with -p and stream-json format)").hideHelp()), q.addOption(new VK("--teleport [session]", "Resume a teleport session, optionally specify session ID").hideHelp()), q.addOption(new VK("--remote [description]", "Create a remote session with the given description").hideHelp()), q.addOption(new VK("--remote-control [name]", "Start an interactive session with Remote Control enabled (optionally named)").argParser((w) => w || !0).hideHelp()), q.addOption(new VK("--rc [name]", "Alias for --remote-control").argParser((w) => w || !0).hideHelp());
    let K = q.command("mcp").description("Configure and manage MCP servers").helpOption("-h, --help", "Display help for command").configureHelp(A()).enablePositionalOptions();
    K.command("serve").description("Start the Claude Code MCP server").helpOption("-h, --help", "Display help for command").option("-d, --debug", "Enable debug mode", () => !0).option("--verbose", "Override verbose mode setting from config", () => !0).action(async ({
        debug: w,
        verbose: O
    }) => {
        let {
            mcpServeHandler: $
        } = await Promise.resolve().then(() => (f86(), G86));
        await $({
            debug: w,
            verbose: O
        })
    }), aEq(K), K.command("remove <name>").description("Remove an MCP server").option("-s, --scope <scope>", "Configuration scope (local, user, or project) - if not specified, removes from whichever scope it exists in").helpOption("-h, --help", "Display help for command").action(async (w, O) => {
        let {
            mcpRemoveHandler: $
        } = await Promise.resolve().then(() => (f86(), G86));
        await $(w, O)
    }), K.command("list").description("List configured MCP servers").helpOption("-h, --help", "Display help for command").action(async () => {
        let {
            mcpListHandler: w
        } = await Promise.resolve().then(() => (f86(), G86));
        await w()
    }), K.command("get <name>").description("Get details about an MCP server").helpOption("-h, --help", "Display help for command").action(async (w) => {
        let {
            mcpGetHandler: O
        } = await Promise.resolve().then(() => (f86(), G86));
        await O(w)
    }), K.command("add-json <name> <json>").description("Add an MCP server (stdio or SSE) with a JSON string").option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").option("--client-secret", "Prompt for OAuth client secret (or set MCP_CLIENT_SECRET env var)").helpOption("-h, --help", "Display help for command").action(async (w, O, $) => {
        let {
            mcpAddJsonHandler: H
        } = await Promise.resolve().then(() => (f86(), G86));
        await H(w, O, $)
    }), K.command("add-from-claude-desktop").description("Import MCP servers from Claude Desktop (Mac and WSL only)").option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").helpOption("-h, --help", "Display help for command").action(async (w) => {
        let {
            mcpAddFromDesktopHandler: O
        } = await Promise.resolve().then(() => (f86(), G86));
        await O(w)
    }), K.command("reset-project-choices").description("Reset all approved and rejected project-scoped (.mcp.json) servers within this project").helpOption("-h, --help", "Display help for command").action(async () => {
        let {
            mcpResetChoicesHandler: w
        } = await Promise.resolve().then(() => (f86(), G86));
        await w()
    });
    let Y = q.command("auth").description("Manage authentication").helpOption("-h, --help", "Display help for command").configureHelp(A());
    Y.command("login").description("Sign in to your Anthropic account").option("--email <email>", "Pre-populate email address on the login page").option("--sso", "Force SSO login flow").helpOption("-h, --help", "Display help for command").action(async ({
        email: w,
        sso: O
    }) => {
        let {
            authLogin: $
        } = await Promise.resolve().then(() => (Oc6(), Sv1));
        await $({
            email: w,
            sso: O
        })
    }), Y.command("status").description("Show authentication status").option("--json", "Output as JSON (default)").option("--text", "Output as human-readable text").helpOption("-h, --help", "Display help for command").action(async (w) => {
        let {
            authStatus: O
        } = await Promise.resolve().then(() => (Oc6(), Sv1));
        await O(w)
    }), Y.command("logout").description("Log out from your Anthropic account").helpOption("-h, --help", "Display help for command").action(async () => {
        let {
            authLogout: w
        } = await Promise.resolve().then(() => (Oc6(), Sv1));
        await w()
    });
    let z = q.command("plugin").alias("plugins").description("Manage Claude Code plugins").helpOption("-h, --help", "Display help for command").configureHelp(A());
    z.command("validate <path>").description("Validate a plugin or marketplace manifest").addOption(new VK("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, O) => {
        let {
            pluginValidateHandler: $
        } = await Promise.resolve().then(() => (th(), sh));
        await $(w, O)
    }), z.command("list").description("List installed plugins").option("--json", "Output as JSON").option("--available", "Include available plugins from marketplaces (requires --json)").addOption(new VK("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w) => {
        let {
            pluginListHandler: O
        } = await Promise.resolve().then(() => (th(), sh));
        await O(w)
    });
    let _ = z.command("marketplace").description("Manage Claude Code marketplaces").helpOption("-h, --help", "Display help for command").configureHelp(A());
    if (_.command("add <source>").description("Add a marketplace from a URL, path, or GitHub repo").addOption(new VK("--cowork", "Use cowork_plugins directory").hideHelp()).option("--sparse <paths...>", "Limit checkout to specific directories via git sparse-checkout (for monorepos). Example: --sparse .claude-plugin plugins").option("--scope <scope>", "Where to declare the marketplace: user (default), project, or local").helpOption("-h, --help", "Display help for command").action(async (w, O) => {
            let {
                marketplaceAddHandler: $
            } = await Promise.resolve().then(() => (th(), sh));
            await $(w, O)
        }), _.command("list").description("List all configured marketplaces").option("--json", "Output as JSON").addOption(new VK("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w) => {
            let {
                marketplaceListHandler: O
            } = await Promise.resolve().then(() => (th(), sh));
            await O(w)
        }), _.command("remove <name>").alias("rm").description("Remove a configured marketplace").addOption(new VK("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, O) => {
            let {
                marketplaceRemoveHandler: $
            } = await Promise.resolve().then(() => (th(), sh));
            await $(w, O)
        }), _.command("update [name]").description("Update marketplace(s) from their source - updates all if no name specified").addOption(new VK("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, O) => {
            let {
                marketplaceUpdateHandler: $
            } = await Promise.resolve().then(() => (th(), sh));
            await $(w, O)
        }), z.command("install <plugin>").alias("i").description("Install a plugin from available marketplaces (use plugin@marketplace for specific marketplace)").option("-s, --scope <scope>", "Installation scope: user, project, or local", "user").addOption(new VK("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, O) => {
            let {
                pluginInstallHandler: $
            } = await Promise.resolve().then(() => (th(), sh));
            await $(w, O)
        }), z.command("uninstall <plugin>").alias("remove").alias("rm").description("Uninstall an installed plugin").option("-s, --scope <scope>", "Uninstall from scope: user, project, or local", "user").addOption(new VK("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, O) => {
            let {
                pluginUninstallHandler: $
            } = await Promise.resolve().then(() => (th(), sh));
            await $(w, O)
        }), z.command("enable <plugin>").description("Enable a disabled plugin").option("-s, --scope <scope>", `Installation scope: ${i0.join(", ")} (default: auto-detect)`).addOption(new VK("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, O) => {
            let {
                pluginEnableHandler: $
            } = await Promise.resolve().then(() => (th(), sh));
            await $(w, O)
        }), z.command("disable [plugin]").description("Disable an enabled plugin").option("-a, --all", "Disable all enabled plugins").option("-s, --scope <scope>", `Installation scope: ${i0.join(", ")} (default: auto-detect)`).addOption(new VK("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, O) => {
            let {
                pluginDisableHandler: $
            } = await Promise.resolve().then(() => (th(), sh));
            await $(w, O)
        }), z.command("update <plugin>").description("Update a plugin to the latest version (restart required to apply)").option("-s, --scope <scope>", `Installation scope: ${O_6.join(", ")} (default: user)`).addOption(new VK("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, O) => {
            let {
                pluginUpdateHandler: $
            } = await Promise.resolve().then(() => (th(), sh));
            await $(w, O)
        }), q.command("setup-token").description("Set up a long-lived authentication token (requires Claude subscription)").helpOption("-h, --help", "Display help for command").action(async () => {
            let [{
                setupTokenHandler: w
            }, {
                createRoot: O
            }] = await Promise.all([Promise.resolve().then(() => (Rb1(), Lb1)), Promise.resolve().then(() => (i6(), pu6))]), $ = await O(xc(!1));
            await w($)
        }), q.command("agents").description("List configured agents").helpOption("-h, --help", "Display help for command").option("--setting-sources <sources>", "Comma-separated list of setting sources to load (user, project, local).").action(async () => {
            let {
                agentsHandler: w
            } = await Promise.resolve().then(() => (TFq(), fFq));
            await w(), process.exit(0)
        }), J16() !== "disabled") {
        let w = q.command("auto-mode").description("Inspect auto mode classifier configuration").helpOption("-h, --help", "Display help for command");
        w.command("defaults").description("Print the default auto mode environment, allow, and deny rules as JSON").helpOption("-h, --help", "Display help for command").action(async () => {
            let {
                autoModeDefaultsHandler: O
            } = await Promise.resolve().then(() => (Ae8(), et8));
            O(), process.exit(0)
        }), w.command("config").description("Print the effective auto mode config as JSON: your settings where set, defaults otherwise").helpOption("-h, --help", "Display help for command").action(async () => {
            let {
                autoModeConfigHandler: O
            } = await Promise.resolve().then(() => (Ae8(), et8));
            O(), process.exit(0)
        })
    } {
        let {
            isBridgeEnabled: w
        } = await Promise.resolve().then(() => (MF(), hy1));
        q.command("remote-control", {
            hidden: !w()
        }).alias("rc").description("Connect your local environment for remote-control sessions via claude.ai/code").helpOption("-h, --help", "Display help for command").action(async () => {
            let {
                bridgeMain: O
            } = await Promise.resolve().then(() => (no8(), io8));
            await O(process.argv.slice(3))
        })
    }
    return q.command("doctor").description("Check the health of your Claude Code auto-updater").helpOption("-h, --help", "Display help for command").action(async () => {
        let [{
            doctorHandler: w
        }, {
            createRoot: O
        }] = await Promise.all([Promise.resolve().then(() => (Rb1(), Lb1)), Promise.resolve().then(() => (i6(), pu6))]), $ = await O(xc(!1));
        await w($)
    }), q.command("update").alias("upgrade").description("Check for updates and install if available").helpOption("-h, --help", "Display help for command").action(async () => {
        let {
            update: w
        } = await Promise.resolve().then(() => (VFq(), NFq));
        await w()
    }), q.command("install [target]").description("Install Claude Code native build. Use [target] to specify version (stable, latest, or specific version)").option("--force", "Force installation even if already installed").helpOption("-h, --help", "Display help for command").action(async (w, O) => {
        let {
            installHandler: $
        } = await Promise.resolve().then(() => (Rb1(), Lb1));
        await $(w, O)
    }), Zq("run_before_parse"), await q.parseAsync(process.argv), Zq("run_after_parse"), Zq("main_after_run"), YE6(), q
}
// @from(Ln 514206, Col 0)
async function $Vz({
    hasInitialPrompt: A,
    hasStdin: q,
    verbose: K,
    debug: Y,
    debugToStderr: z,
    print: _,
    outputFormat: w,
    inputFormat: O,
    numAllowedTools: $,
    numDisallowedTools: H,
    mcpClientCount: j,
    worktreeEnabled: J,
    skipWebFetchPreflight: M,
    githubActionInputs: D,
    dangerouslySkipPermissionsPassed: X,
    permissionMode: P,
    modeIsBypass: W,
    allowDangerouslySkipPermissionsPassed: Z,
    systemPromptFlag: G,
    appendSystemPromptFlag: f,
    thinkingConfig: v,
    assistantActivationPath: N
}) {
    try {
        d("tengu_init", {
            entrypoint: "claude",
            hasInitialPrompt: A,
            hasStdin: q,
            verbose: K,
            debug: Y,
            debugToStderr: z,
            print: _,
            outputFormat: w,
            inputFormat: O,
            numAllowedTools: $,
            numDisallowedTools: H,
            mcpClientCount: j,
            worktree: J,
            skipWebFetchPreflight: M,
            ...D && {
                githubActionInputs: D
            },
            dangerouslySkipPermissionsPassed: X,
            permissionMode: P,
            modeIsBypass: W,
            allowDangerouslySkipPermissionsPassed: Z,
            thinkingType: v.type,
            ...G && {
                systemPromptFlag: G
            },
            ...f && {
                appendSystemPromptFlag: f
            },
            is_simple: t6(process.env.CLAUDE_CODE_SIMPLE) || void 0,
            is_coordinator: void 0,
            ...N && {
                assistantActivationPath: N
            },
            autoUpdatesChannel: mA().autoUpdatesChannel ?? "latest",
            ...{}
        })
    } catch (V) {
        _6(V)
    }
}
// @from(Ln 514273, Col 0)
function hb1(A) {}
// @from(Ln 514275, Col 0)
function Sb1(A) {
    let q = A.brief,
        K = t6(process.env.CLAUDE_CODE_BRIEF);
    if (!q && !K) return;
    let {
        isBriefEntitled: Y
    } = (qF(), k4(xl)), z = Y();
    if (z) Lx(!0);
    d("tengu_brief_mode_toggled", {
        enabled: z,
        gated: !z,
        source: K ? "env" : "flag"
    })
}
// @from(Ln 514290, Col 0)
function HVz() {
    (process.stderr.isTTY ? process.stderr : process.stdout.isTTY ? process.stdout : void 0)?.write(xC)
}
// @from(Ln 514294, Col 0)
function jVz(A) {
    if (typeof A !== "object" || A === null) return {};
    let q = A,
        K = q.teammateMode;
    return {
        agentId: typeof q.agentId === "string" ? q.agentId : void 0,
        agentName: typeof q.agentName === "string" ? q.agentName : void 0,
        teamName: typeof q.teamName === "string" ? q.teamName : void 0,
        agentColor: typeof q.agentColor === "string" ? q.agentColor : void 0,
        planModeRequired: typeof q.planModeRequired === "boolean" ? q.planModeRequired : void 0,
        parentSessionId: typeof q.parentSessionId === "string" ? q.parentSessionId : void 0,
        teammateMode: K === "auto" || K === "tmux" || K === "in-process" ? K : void 0,
        agentType: typeof q.agentType === "string" ? q.agentType : void 0
    }
}
// @from(Ln 514309, Col 4)
wT
// @from(Ln 514309, Col 8)
EFq = () => (zz(), k4(KT8))
// @from(Ln 514310, Col 4)
dNz = () => k4(rl4)
// @from(Ln 514311, Col 4)
cNz = () => (Bf6(), k4(wu8))
// @from(Ln 514312, Col 4)
lNz = null
// @from(Ln 514313, Col 4)
nNz
// @from(Ln 514314, Col 4)
Ta8 = E(() => {
    XS();
    Cr8();
    ZI();
    bu6();
    JA();
    g1();
    oo8();
    HA();
    qV6();
    Hm();
    fC1();
    Akq();
    Tkq();
    aK();
    MD1();
    dd();
    F5();
    bv();
    $a8();
    x16();
    Ar1();
    AN();
    $G6();
    IX();
    BB();
    Qz();
    Uo6();
    fA();
    k8();
    wk();
    FW();
    YK();
    VU6();
    gL();
    g1();
    Ha8();
    ud();
    k1();
    Oq();
    Mg();
    FEq();
    va8();
    z4();
    i8();
    LS1();
    D$();
    J0();
    A8();
    T1();
    Mz6();
    Na8();
    R_6();
    ln6();
    $5();
    wO8();
    nEq();
    K_();
    Uv();
    fX();
    yl6();
    Oq();
    TU8();
    xI();
    HA();
    V1();
    ip();
    Lo6();
    GK6();
    QP();
    ac();
    if6();
    Va8();
    rD();
    rJ();
    jy();
    y66();
    Bw();
    ka8();
    xJ();
    sEq();
    ZV8();
    WZ();
    $Z6();
    Sa8();
    Fz6();
    SR();
    KY();
    La8();
    xd();
    lA();
    H1();
    s8();
    SA();
    c_();
    io6();
    O2();
    WR();
    T1();
    wyq();
    $yq();
    jyq();
    Myq();
    Dyq();
    Pyq();
    Zyq();
    fyq();
    vyq();
    Vyq();
    Eyq();
    Lyq();
    xa8();
    Ib();
    A16();
    cT6();
    do6();
    Mf();
    u_();
    RC1();
    tH();
    _N6();
    Lz();
    S66();
    EZ();
    jm();
    _76();
    jN();
    wT = t(P6(), 1);
    Zq("main_tsx_entry");
    Dvq();
    nNz = k4(VT6);
    Zq("main_tsx_imports_loaded");
    if (oNz()) process.exit(1)
})
// @from(Ln 514453, Col 0)
async function JVz() {
    let A = process.argv.slice(2);
    if (A.length === 1 && (A[0] === "--version" || A[0] === "-v" || A[0] === "-V")) {
        console.log(`${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION} (Claude Code)`);
        return
    }
    let {
        profileCheckpoint: q
    } = await Promise.resolve().then(() => (XS(), z7A));
    if (q("cli_entry"), process.argv[2] === "--claude-in-chrome-mcp") {
        q("cli_claude_in_chrome_mcp_path");
        let {
            runClaudeInChromeMcpServer: _
        } = await Promise.resolve().then(() => (wn8(), _n8));
        await _();
        return
    } else if (process.argv[2] === "--chrome-native-host") {
        q("cli_chrome_native_host_path");
        let {
            runChromeNativeHost: _
        } = await Promise.resolve().then(() => (XVq(), DVq));
        await _();
        return
    }
    if (A[0] === "remote-control" || A[0] === "rc" || A[0] === "remote" || A[0] === "sync" || A[0] === "bridge") {
        q("cli_bridge_path");
        let {
            enableConfigs: _
        } = await Promise.resolve().then(() => (k8(), Vo6));
        _();
        let {
            isBridgeEnabledBlocking: w,
            checkBridgeMinVersion: O
        } = await Promise.resolve().then(() => (MF(), hy1)), {
            BRIDGE_LOGIN_ERROR: $
        } = await Promise.resolve().then(() => APq), {
            bridgeMain: H
        } = await Promise.resolve().then(() => (no8(), io8)), {
            getClaudeAIOAuthTokens: j
        } = await Promise.resolve().then(() => (fA(), S16));
        if (!j()?.accessToken) console.error($), process.exit(1);
        if (!await w()) console.error("Error: Remote Control is not yet enabled for your account."), process.exit(1);
        let J = O();
        if (J) console.error(J), process.exit(1);
        let {
            waitForPolicyLimitsToLoad: M,
            isPolicyAllowed: D
        } = await Promise.resolve().then(() => (AN(), xR8));
        if (await M(), !D("allow_remote_control")) console.error("Error: Remote Control is disabled by your organization's policy."), process.exit(1);
        await H(A.slice(1));
        return
    }
    if ((A.includes("--tmux") || A.includes("--tmux=classic")) && (A.includes("-w") || A.includes("--worktree") || A.some((_) => _.startsWith("--worktree=")))) {
        q("cli_tmux_worktree_fast_path");
        let {
            enableConfigs: _
        } = await Promise.resolve().then(() => (k8(), Vo6));
        _();
        let {
            isWorktreeModeEnabled: w
        } = await Promise.resolve().then(() => aAq);
        if (w()) {
            let {
                execIntoTmuxWorktree: O
            } = await Promise.resolve().then(() => (jN(), $n4)), $ = await O(A);
            if ($.handled) return;
            if ($.error) console.error($.error), process.exit(1)
        }
    }
    if (A.length === 1 && (A[0] === "--update" || A[0] === "--upgrade")) process.argv = [process.argv[0], process.argv[1], "update"];
    let {
        startCapturingEarlyInput: Y
    } = await Promise.resolve().then(() => (bu6(), Ey7));
    Y(), q("cli_before_main_import");
    let {
        main: z
    } = await Promise.resolve().then(() => (Ta8(), yFq));
    q("cli_after_main_import"), await z(), q("cli_after_main_complete")
}