
// @from(Start 14865953, End 14911985)
async function hu3() {
  M9("run_function_start");
  let A = new fJ1;
  M9("run_commander_initialized"), A.hook("preAction", async () => {
    M9("preAction_start");
    let Y = FU9();
    if (Y instanceof Promise) await Y;
    M9("preAction_after_init"), ju3(), M9("preAction_after_migrations")
  }), A.name("claude").description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output").argument("[prompt]", "Your prompt", String).helpOption("-h, --help", "Display help for command").option("-d, --debug [filter]", 'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!statsig,!file")', (Y) => {
    return !0
  }).addOption(new BF("-d2e, --debug-to-stderr", "Enable debug mode (to stderr)").argParser(Boolean).hideHelp()).option("--verbose", "Override verbose mode setting from config", () => !0).option("-p, --print", "Print response and exit (useful for pipes). Note: The workspace trust dialog is skipped when Claude is run with the -p mode. Only use this flag in directories you trust.", () => !0).addOption(new BF("--output-format <format>", 'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)').choices(["text", "json", "stream-json"])).addOption(new BF("--json-schema <schema>", 'JSON Schema for structured output validation. Example: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}').argParser(String)).option("--include-partial-messages", "Include partial message chunks as they arrive (only works with --print and --output-format=stream-json)", () => !0).addOption(new BF("--input-format <format>", 'Input format (only works with --print): "text" (default), or "stream-json" (realtime streaming input)').choices(["text", "stream-json"])).option("--mcp-debug", "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)", () => !0).option("--dangerously-skip-permissions", "Bypass all permission checks. Recommended only for sandboxes with no internet access.", () => !0).option("--allow-dangerously-skip-permissions", "Enable bypassing all permission checks as an option, without it being enabled by default. Recommended only for sandboxes with no internet access.", () => !0).addOption(new BF("--max-thinking-tokens <tokens>", "Maximum number of thinking tokens.  (only works with --print)").argParser(Number).hideHelp()).addOption(new BF("--max-turns <turns>", "Maximum number of agentic turns in non-interactive mode. This will early exit the conversation after the specified number of turns. (only works with --print)").argParser(Number).hideHelp()).addOption(new BF("--max-budget-usd <amount>", "Maximum dollar amount to spend on API calls (only works with --print)").argParser((Y) => {
    let J = Number(Y);
    if (isNaN(J) || J <= 0) throw Error("--max-budget-usd must be a positive number greater than 0");
    return J
  }).hideHelp()).option("--replay-user-messages", "Re-emit user messages from stdin back on stdout for acknowledgment (only works with --input-format=stream-json and --output-format=stream-json)", () => !0).addOption(new BF("--enable-auth-status", "Enable auth status messages in SDK mode").default(!1).hideHelp()).option("--allowedTools, --allowed-tools <tools...>", 'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")').option("--tools <tools...>", 'Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names (e.g. "Bash,Edit,Read"). Only works with --print mode.').option("--disallowedTools, --disallowed-tools <tools...>", 'Comma or space-separated list of tool names to deny (e.g. "Bash(git:*) Edit")').option("--mcp-config <configs...>", "Load MCP servers from JSON files or strings (space-separated)").addOption(new BF("--permission-prompt-tool <tool>", "MCP tool to use for permission prompts (only works with --print)").argParser(String).hideHelp()).addOption(new BF("--system-prompt <prompt>", "System prompt to use for the session").argParser(String)).addOption(new BF("--system-prompt-file <file>", "Read system prompt from a file").argParser(String).hideHelp()).addOption(new BF("--append-system-prompt <prompt>", "Append a system prompt to the default system prompt").argParser(String)).addOption(new BF("--append-system-prompt-file <file>", "Read system prompt from a file and append to the default system prompt").argParser(String).hideHelp()).addOption(new BF("--permission-mode <mode>", "Permission mode to use for the session").argParser(String).choices(kR)).option("-c, --continue", "Continue the most recent conversation", () => !0).option("-r, --resume [value]", "Resume a conversation by session ID, or open interactive picker with optional search term", (Y) => Y || !0).option("--fork-session", "When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)", () => !0).addOption(new BF("--resume-session-at <message id>", "When resuming, only messages up to and including the assistant message with <message.id> (use with --resume in print mode)").argParser(String).hideHelp()).option("--model <model>", "Model for the current session. Provide an alias for the latest model (e.g. 'sonnet' or 'opus') or a model's full name (e.g. 'claude-sonnet-4-5-20250929').").option("--agent <agent>", "Agent for the current session. Overrides the 'agent' setting.").option("--betas <betas...>", "Beta headers to include in API requests (API key users only)").option("--fallback-model <model>", "Enable automatic fallback to specified model when default model is overloaded (only works with --print)").option("--settings <file-or-json>", "Path to a settings JSON file or a JSON string to load additional settings from").option("--add-dir <directories...>", "Additional directories to allow tool access to").option("--ide", "Automatically connect to IDE on startup if exactly one valid IDE is available", () => !0).option("--strict-mcp-config", "Only use MCP servers from --mcp-config, ignoring all other MCP configurations", () => !0).option("--session-id <uuid>", "Use a specific session ID for the conversation (must be a valid UUID)").option("--agents <json>", `JSON object defining custom agents (e.g. '{"reviewer": {"description": "Reviews code", "prompt": "You are a code reviewer"}}')`).option("--setting-sources <sources>", "Comma-separated list of setting sources to load (user, project, local).").option("--plugin-dir <paths...>", "Load plugins from directories for this session only (repeatable)").action(async (Y, J) => {
    if (M9("action_handler_start"), Y === "code") GA("tengu_code_prompt_ignored", {}), console.warn(tA.yellow("Tip: You can launch Claude Code with just `claude`")), Y = void 0;
    if (Y && typeof Y === "string" && !/\s/.test(Y) && Y.length > 0) GA("tengu_single_word_prompt", {
      length: Y.length
    });
    let {
      debug: W = !1,
      debugToStderr: X = !1,
      dangerouslySkipPermissions: V,
      allowDangerouslySkipPermissions: F = !1,
      tools: K = [],
      allowedTools: D = [],
      disallowedTools: H = [],
      mcpConfig: C = [],
      permissionMode: E,
      addDir: U = [],
      fallbackModel: q,
      betas: w = [],
      ide: N = !1,
      sessionId: R,
      includePartialMessages: T,
      pluginDir: y = []
    } = J, v = J.agents, x = J.agent;
    if (y.length > 0) Zz0(y), _IA();
    let {
      outputFormat: p,
      inputFormat: u
    } = J, e = J.verbose ?? N1().verbose, l = J.print;
    if (_10() && (J.strictMcpConfig || J.mcpConfig)) process.stderr.write(tA.red("You cannot dynamically configure your MCP configuration when an enterprise MCP config is present")), process.exit(1);
    let k = J.strictMcpConfig || !1,
      m = !1,
      o = J,
      IA = !1,
      FA = J.sdkUrl ?? void 0;
    if (FA) {
      if (!u) u = "stream-json";
      if (!p) p = "stream-json";
      if (J.verbose === void 0) e = !0;
      if (!J.print) l = !0
    }
    let zA = J.teleport ?? null,
      NA = J.remote ?? null;
    if (R) {
      if (J.continue || J.resume) process.stderr.write(tA.red(`Error: --session-id cannot be used with --continue or --resume.
`)), process.exit(1);
      let G0 = nE(R);
      if (!G0) process.stderr.write(tA.red(`Error: Invalid session ID. Must be a valid UUID.
`)), process.exit(1);
      if (aE9(G0)) process.stderr.write(tA.red(`Error: Session ID ${G0} is already in use.
`)), process.exit(1)
    }
    let OA = N6();
    if (q && J.model && q === J.model) process.stderr.write(tA.red(`Error: Fallback model cannot be the same as the main model. Please specify a different model for --fallback-model.
`)), process.exit(1);
    let mA = J.systemPrompt;
    if (J.systemPromptFile) {
      if (J.systemPrompt) process.stderr.write(tA.red(`Error: Cannot use both --system-prompt and --system-prompt-file. Please use only one.
`)), process.exit(1);
      try {
        let G0 = SD0(J.systemPromptFile);
        if (!YW1(G0)) process.stderr.write(tA.red(`Error: System prompt file not found: ${G0}
`)), process.exit(1);
        mA = nw9(G0, "utf8")
      } catch (G0) {
        process.stderr.write(tA.red(`Error reading system prompt file: ${G0 instanceof Error?G0.message:String(G0)}
`)), process.exit(1)
      }
    }
    let wA = J.appendSystemPrompt;
    if (J.appendSystemPromptFile) {
      if (J.appendSystemPrompt) process.stderr.write(tA.red(`Error: Cannot use both --append-system-prompt and --append-system-prompt-file. Please use only one.
`)), process.exit(1);
      try {
        let G0 = SD0(J.appendSystemPromptFile);
        if (!YW1(G0)) process.stderr.write(tA.red(`Error: Append system prompt file not found: ${G0}
`)), process.exit(1);
        wA = nw9(G0, "utf8")
      } catch (G0) {
        process.stderr.write(tA.red(`Error reading append system prompt file: ${G0 instanceof Error?G0.message:String(G0)}
`)), process.exit(1)
      }
    }
    let {
      mode: qA,
      notification: KA
    } = SE9({
      permissionModeCli: E,
      dangerouslySkipPermissions: V
    });
    Yz0(qA === "bypassPermissions");
    let yA = {};
    if (C && C.length > 0) {
      let G0 = C.map((sQ) => sQ.trim()).filter((sQ) => sQ.length > 0),
        yQ = {},
        aQ = [];
      for (let sQ of G0) {
        let K0 = null,
          mB = [],
          e2 = f7(sQ);
        if (e2) {
          let s8 = ZMA({
            configObject: e2,
            filePath: "command line",
            expandVars: !0,
            scope: "dynamic"
          });
          if (s8.config) K0 = s8.config.mcpServers;
          else mB = s8.errors
        } else {
          let s8 = SD0(sQ),
            K5 = BYA({
              filePath: s8,
              expandVars: !0,
              scope: "dynamic"
            });
          if (K5.config) K0 = K5.config.mcpServers;
          else mB = K5.errors
        }
        if (mB.length > 0) aQ.push(...mB);
        else if (K0) yQ = {
          ...yQ,
          ...K0
        }
      }
      if (aQ.length > 0) {
        let sQ = aQ.map((K0) => `${K0.path?K0.path+": ":""}${K0.message}`).join(`
`);
        throw Error(`Invalid MCP configuration:
${sQ}`)
      }
      if (Object.keys(yQ).length > 0) {
        let sQ = ns(yQ, (K0) => ({
          ...K0,
          scope: "dynamic"
        }));
        yA = {
          ...yA,
          ...sQ
        }
      }
    }
    let {
      toolPermissionContext: oA,
      warnings: X1
    } = _E9({
      allowedToolsCli: D,
      disallowedToolsCli: H,
      baseToolsCli: K,
      permissionMode: qA,
      allowDangerouslySkipPermissions: F,
      addDirs: U
    });
    X1.forEach((G0) => {
      console.error(G0)
    }), OA2();
    let {
      servers: WA
    } = k ? {
      servers: {}
    } : await fk(), EA = {
      ...WA,
      ...yA
    }, MA = {}, DA = {};
    for (let [G0, yQ] of Object.entries(EA)) {
      let aQ = yQ;
      if (aQ.type === "sdk") MA[G0] = aQ;
      else DA[G0] = aQ
    }
    if (M9("action_mcp_configs_loaded"), u && u !== "text" && u !== "stream-json") console.error(`Error: Invalid input format "${u}".`), process.exit(1);
    if (u === "stream-json" && p !== "stream-json") console.error("Error: --input-format=stream-json requires output-format=stream-json."), process.exit(1);
    if (FA) {
      if (u !== "stream-json" || p !== "stream-json") console.error("Error: --sdk-url requires both --input-format=stream-json and --output-format=stream-json."), process.exit(1)
    }
    if (J.replayUserMessages) {
      if (u !== "stream-json" || p !== "stream-json") console.error("Error: --replay-user-messages requires both --input-format=stream-json and --output-format=stream-json."), process.exit(1)
    }
    if (T) {
      if (!OA || p !== "stream-json") Sj("Error: --include-partial-messages requires --print and --output-format=stream-json."), process.exit(1)
    }
    if (K.length > 0 && !OA) Sj("Error: --tools can only be used with --print mode."), process.exit(1);
    let $A = await fu3(Y || "", u ?? "text");
    M9("action_after_input_prompt");
    let TA = LC(oA);
    M9("action_tools_loaded");
    let rA;
    if (n59({
        isNonInteractiveSession: OA
      }) && J.jsonSchema) rA = JSON.parse(J.jsonSchema);
    if (rA) {
      let G0 = yI1(rA);
      if (G0) TA = [...TA, G0], GA("tengu_structured_output_enabled", {
        schema_property_count: Object.keys(rA.properties || {}).length,
        has_required_fields: Boolean(rA.required)
      });
      else GA("tengu_structured_output_failure", {
        error: "Invalid JSON schema"
      })
    }
    M9("action_before_setup"), await JW1(jD0(), qA, F, m, R ? nE(R) : void 0), M9("action_after_setup");
    let iA = J.model === "default" ? jt() : J.model,
      J1 = q === "default" ? jt() : q,
      [w1, jA] = await Promise.all([sE(), Kf2()]);
    M9("action_commands_loaded");
    let eA = [];
    if (v) try {
      let G0 = f7(v);
      if (G0) eA = A31(G0, "flagSettings")
    } catch (G0) {
      AA(G0 instanceof Error ? G0 : Error(String(G0)))
    }
    let t1 = [...jA.allAgents, ...eA],
      v1 = {
        ...jA,
        allAgents: t1,
        activeAgents: ky(t1)
      },
      F0 = x ?? $T().agent,
      g0;
    if (F0) {
      if (g0 = v1.activeAgents.find((G0) => G0.agentType === F0), !g0) g(`Warning: agent "${F0}" not found. Available agents: ${v1.activeAgents.map((G0)=>G0.agentType).join(", ")}. Using default behavior.`)
    }
    if (!OA) {
      if (await rw9(qA, F, w1) && Y?.trim().toLowerCase() === "/login") Y = ""
    }
    if (process.exitCode !== void 0) {
      g("Graceful shutdown initiated, skipping further initialization");
      return
    }
    TI2().catch((G0) => AA(G0)), D8B(), L59(), pw9(), v$9(N6());
    let p0 = $21(DA),
      n0 = $A || OA ? await p0 : {
        clients: [],
        tools: [],
        commands: []
      },
      _1 = n0.clients,
      zQ = n0.tools,
      W1 = n0.commands,
      O1;
    if (xVA()) O1 = new PD0(_1, zQ), O1.start().then(({
      url: G0
    }) => {
      let yQ = O1.getSecret();
      pJ1({
        url: G0,
        key: yQ
      }), g(`[MCP CLI Endpoint] Started at ${G0}`)
    }).catch((G0) => {
      AA(G0 instanceof Error ? G0 : Error(String(G0)))
    }), PG(async () => {
      await O1?.stop()
    });
    k6("info", "started"), PG(async () => {
      k6("info", "exited")
    }), gu3({
      hasInitialPrompt: Boolean(Y),
      hasStdin: Boolean($A),
      verbose: e,
      debug: W,
      debugToStderr: X,
      print: l ?? !1,
      outputFormat: p ?? "text",
      inputFormat: u ?? "text",
      numAllowedTools: D.length,
      numDisallowedTools: H.length,
      mcpClientCount: Object.keys(EA).length,
      worktree: m,
      skipWebFetchPreflight: $T().skipWebFetchPreflight,
      githubActionInputs: process.env.GITHUB_ACTION_INPUTS,
      dangerouslySkipPermissionsPassed: V ?? !1,
      modeIsBypass: qA === "bypassPermissions",
      allowDangerouslySkipPermissionsPassed: F,
      systemPromptFlag: mA ? J.systemPromptFile ? "file" : "flag" : void 0,
      appendSystemPromptFlag: wA ? J.appendSystemPromptFile ? "file" : "flag" : void 0
    }), MX9(DA, oA), P91(null, "initialization"), Mu3(), Ou3(), await L39(), M9("action_after_plugins_init");
    let a1 = iA;
    if (!a1 && g0?.model && g0.model !== "inherit") a1 = UD(g0.model);
    if (Ts(a1), OA) {
      if (p === "stream-json" || p === "json") Dz0(!0);
      BD0();
      let G0 = w1.filter((aQ) => aQ.type === "prompt" && !aQ.disableNonInteractive || aQ.type === "local" && aQ.supportsNonInteractive),
        yQ = wp();
      if (yQ = {
          ...yQ,
          mcp: {
            ...yQ.mcp,
            clients: _1,
            commands: W1,
            tools: zQ
          },
          toolPermissionContext: oA
        }, oA.mode === "bypassPermissions" || F) yE9(oA);
      Rw9($A, async () => yQ, (aQ) => {
        let sQ = yQ;
        yQ = aQ(yQ), Yu({
          newState: yQ,
          oldState: sQ
        })
      }, G0, TA, MA, v1.activeAgents, {
        continue: J.continue,
        resume: J.resume,
        verbose: e,
        outputFormat: p,
        jsonSchema: rA,
        permissionPromptToolName: J.permissionPromptTool,
        allowedTools: D,
        maxThinkingTokens: J.maxThinkingTokens,
        maxTurns: J.maxTurns,
        maxBudgetUsd: J.maxBudgetUsd,
        systemPrompt: mA,
        appendSystemPrompt: wA,
        userSpecifiedModel: iA,
        fallbackModel: J1,
        sdkBetas: w.length > 0 ? w : void 0,
        teleport: zA,
        sdkUrl: FA,
        replayUserMessages: J.replayUserMessages,
        includePartialMessages: T,
        forkSession: J.forkSession || !1,
        resumeSessionAt: J.resumeSessionAt || void 0,
        enableAuthStatus: J.enableAuthStatus
      });
      return
    }
    let C0 = bu3(!1);
    P_2(), GA("tengu_startup_manual_model_config", {
      cli_flag: J.model,
      env_var: process.env.ANTHROPIC_MODEL,
      settings_file: ($T() || {}).model,
      subscriptionType: f4(),
      agent: F0
    });
    let v0 = J.model || process.env.ANTHROPIC_MODEL || $T().model;
    if (BB() && !pw() && v0 !== void 0 && KT(v0)) console.error(tA.yellow("Your plan doesn't include Opus in Claude Code. You can turn on /extra-usage or /upgrade to Max to access it. The current model is now Sonnet."));
    xE0(mnA() || null);
    let k0 = e1(),
      f0 = {
        settings: $T(),
        backgroundTasks: {},
        verbose: e ?? N1().verbose ?? !1,
        mainLoopModel: UkA(),
        mainLoopModelForSession: null,
        showExpandedTodos: N1().showExpandedTodos ?? !1,
        toolPermissionContext: oA,
        agentDefinitions: v1,
        mcp: {
          clients: [],
          tools: [],
          commands: [],
          resources: {}
        },
        plugins: {
          enabled: [],
          disabled: [],
          commands: [],
          agents: [],
          errors: [],
          installationStatus: {
            marketplaces: [],
            plugins: []
          }
        },
        statusLineText: void 0,
        notifications: {
          current: null,
          queue: KA ? [{
            key: "permission-mode-notification",
            text: KA,
            priority: "high"
          }] : []
        },
        elicitation: {
          queue: []
        },
        todos: {
          [k0]: Nh(k0)
        },
        fileHistory: {
          snapshots: [],
          trackedFiles: new Set
        },
        thinkingEnabled: VrA(),
        feedbackSurvey: {
          timeLastShown: null,
          submitCountAtLastAppearance: null
        },
        sessionHooks: {},
        promptSuggestion: {
          text: null,
          shownAt: 0
        },
        queuedCommands: [],
        gitDiff: {
          stats: null,
          hunks: new Map,
          lastUpdated: 0,
          version: 0
        }
      };
    if (Tu3(), J.continue) try {
      GA("tengu_continue", {});
      let G0 = await ki(void 0, void 0);
      if (!G0) console.error("No conversation found to continue"), process.exit(1);
      if (!J.forkSession) {
        if (G0.sessionId) zR(G0.sessionId), await Fx()
      }
      await VG(d3.default.createElement(yG, {
        initialState: f0,
        onChangeAppState: Yu
      }, d3.default.createElement(WVA, {
        debug: W || X,
        initialPrompt: $A,
        commands: [...w1, ...W1],
        initialTools: zQ,
        initialMessages: G0.messages,
        initialFileHistorySnapshots: G0.fileHistorySnapshots,
        mcpClients: _1,
        dynamicMcpConfig: yA,
        mcpCliEndpoint: O1,
        autoConnectIdeFlag: N,
        strictMcpConfig: k,
        appendSystemPrompt: wA,
        mainThreadAgentDefinition: g0
      })), C0)
    } catch (G0) {
      AA(G0 instanceof Error ? G0 : Error(String(G0))), process.exit(1)
    } else if (J.resume || zA || NA) {
      let G0 = null,
        yQ = void 0,
        aQ = nE(J.resume),
        sQ = void 0;
      if (J.resume && typeof J.resume === "string" && !aQ) {
        let K0 = J.resume.trim();
        if (K0) {
          let mB = await mXA(K0, {
            exact: !0
          });
          if (mB.length === 1) aQ = VP(mB[0]) ?? null;
          else sQ = K0
        }
      }
      if (NA) {
        GA("tengu_remote_create_session", {
          description_length: String(NA.length)
        });
        let K0 = await zP2(NA, new AbortController().signal);
        if (!K0) GA("tengu_remote_create_session_error", {
          error: "unable_to_create_session"
        }), process.stderr.write(tA.red(`Error: Unable to create remote session
`)), await v6(1), process.exit(1);
        GA("tengu_remote_create_session_success", {
          session_id: K0.id
        }), process.stdout.write(`Created remote session: ${K0.title}
`), process.stdout.write(`View: https://claude.ai/code/${K0.id}?m=0
`), process.stdout.write(`Resume with: claude --teleport ${K0.id}
`), await v6(0), process.exit(0)
      } else if (zA) {
        if (zA === !0 || zA === "") {
          GA("tengu_teleport_interactive_mode", {});
          let K0 = await mw9();
          if (!K0) await v6(0), process.exit(0);
          G0 = (await kRA(Pg(K0.log), K0.branch)).messages
        } else if (typeof zA === "string") {
          GA("tengu_teleport_resume_session", {
            mode: "direct"
          });
          try {
            let K0 = await DP2(zA);
            if (K0.status === "mismatch" || K0.status === "not_in_repo") {
              let e2 = K0.sessionRepo;
              if (e2) {
                let s8 = JU9(e2),
                  K5 = WU9(s8);
                if (K5.length > 0) {
                  let g6 = await new Promise(async (c3) => {
                    let {
                      unmount: tZ
                    } = await VG(d3.default.createElement(yG, null, d3.default.createElement(xw9, {
                      targetRepo: e2,
                      initialPaths: K5,
                      onSelectPath: (H7) => {
                        tZ(), c3(H7)
                      },
                      onCancel: () => {
                        tZ(), c3(null)
                      }
                    })), {
                      exitOnCtrlC: !1
                    })
                  });
                  if (g6) process.chdir(g6), Bq(g6), NE0(g6);
                  else await v6(0)
                } else throw new XI(`You must run claude --teleport ${zA} from a checkout of ${e2}.`, tA.red(`You must run claude --teleport ${zA} from a checkout of ${tA.bold(e2)}.
`))
              }
            } else if (K0.status === "error") throw new XI(K0.errorMessage || "Failed to validate session", tA.red(`Error: ${K0.errorMessage||"Failed to validate session"}
`));
            await c61();
            let mB = await EP2(zA);
            G0 = (await kRA(Pg(mB.log), mB.branch)).messages
          } catch (K0) {
            if (K0 instanceof XI) process.stderr.write(K0.formattedMessage + `
`);
            else AA(K0 instanceof Error ? K0 : Error(String(K0))), process.stderr.write(`Error: ${K0 instanceof Error?K0.message:String(K0)}
`);
            await v6(1)
          }
        }
      }
      if (aQ) {
        let K0 = aQ;
        try {
          let mB = await ki(K0, void 0);
          if (!mB) console.error(`No conversation found with session ID: ${K0}`), process.exit(1);
          if (G0 = mB.messages, yQ = mB.fileHistorySnapshots, GA("tengu_session_resumed", {
              entrypoint: "cli_flag"
            }), !J.forkSession) zR(K0), await Fx()
        } catch (mB) {
          AA(mB instanceof Error ? mB : Error(String(mB))), console.error(`Failed to resume session ${K0}`), process.exit(1)
        }
      }
      if (Array.isArray(G0)) await VG(d3.default.createElement(yG, {
        initialState: f0,
        onChangeAppState: Yu
      }, d3.default.createElement(WVA, {
        debug: W || X,
        initialPrompt: $A,
        commands: [...w1, ...W1],
        initialTools: zQ,
        initialMessages: G0,
        initialFileHistorySnapshots: yQ,
        mcpClients: _1,
        dynamicMcpConfig: yA,
        mcpCliEndpoint: O1,
        autoConnectIdeFlag: N,
        strictMcpConfig: k,
        appendSystemPrompt: wA,
        mainThreadAgentDefinition: g0
      })), C0);
      else {
        let K0 = await eP();
        if (!K0.length) console.error("No conversations found to resume"), process.exit(1);
        await VG(d3.default.createElement(D$9, {
          commands: [...w1, ...W1],
          debug: W || X,
          initialLogs: K0,
          initialTools: zQ,
          mcpClients: _1,
          dynamicMcpConfig: yA,
          mcpCliEndpoint: O1,
          appState: f0,
          onChangeAppState: Yu,
          strictMcpConfig: k,
          systemPrompt: mA,
          appendSystemPrompt: wA,
          initialSearchQuery: sQ
        }), C0)
      }
    } else {
      let G0 = await wq("startup");
      M9("action_after_hooks"), await VG(d3.default.createElement(yG, {
        initialState: f0,
        onChangeAppState: Yu
      }, d3.default.createElement(WVA, {
        debug: W || X,
        commands: [...w1, ...W1],
        initialPrompt: $A,
        initialTools: zQ,
        initialMessages: G0,
        mcpClients: _1,
        dynamicMcpConfig: yA,
        autoConnectIdeFlag: N,
        strictMcpConfig: k,
        systemPrompt: mA,
        appendSystemPrompt: wA,
        mcpCliEndpoint: O1,
        mainThreadAgentDefinition: g0
      })), C0)
    }
  }).version(`${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION} (Claude Code)`, "-v, --version", "Output the version number"), A.addOption(new BF("--sdk-url <url>", "Use remote WebSocket endpoint for SDK I/O streaming (only with -p and stream-json format)").hideHelp()), A.addOption(new BF("--teleport [session]", "Resume a teleport session, optionally specify session ID").hideHelp()), A.addOption(new BF("--remote <description>", "Create a remote session with the given description").hideHelp());
  let Q = A.command("mcp").description("Configure and manage MCP servers").helpOption("-h, --help", "Display help for command");
  Q.command("serve").description("Start the Claude Code MCP server").helpOption("-h, --help", "Display help for command").option("-d, --debug", "Enable debug mode", () => !0).option("--verbose", "Override verbose mode setting from config", () => !0).action(async ({
    debug: Y,
    verbose: J
  }) => {
    let W = jD0();
    if (GA("tengu_mcp_start", {}), !YW1(W)) console.error(`Error: Directory ${W} does not exist`), process.exit(1);
    try {
      await JW1(W, "default", !1, !1, void 0), await w$9(W, Y ?? !1, J ?? !1)
    } catch (X) {
      console.error("Error: Failed to start MCP server:", X), process.exit(1)
    }
  }), Q.command("add <name> <commandOrUrl> [args...]").description(`Add an MCP server to Claude Code.

Examples:
  # Add HTTP server:
  claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

  # Add SSE server:
  claude mcp add --transport sse asana https://mcp.asana.com/sse

  # Add stdio server:
  claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=YOUR_KEY -- npx -y airtable-mcp-server`).option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").option("-t, --transport <transport>", "Transport type (stdio, sse, http). Defaults to stdio if not specified.").option("-e, --env <env...>", "Set environment variables (e.g. -e KEY=value)").option("-H, --header <header...>", 'Set WebSocket headers (e.g. -H "X-Api-Key: abc123" -H "X-Custom: value")').helpOption("-h, --help", "Display help for command").action(async (Y, J, W, X) => {
    if (!Y) console.error("Error: Server name is required."), console.error("Usage: claude mcp add <name> <command> [args...]"), process.exit(1);
    else if (!J) console.error("Error: Command is required when server name is provided."), console.error("Usage: claude mcp add <name> <command> [args...]"), process.exit(1);
    try {
      let V = fSA(X.scope),
        F = Uz9(X.transport),
        K = X.transport !== void 0,
        D = J.startsWith("http://") || J.startsWith("https://") || J.startsWith("localhost") || J.endsWith("/sse") || J.endsWith("/mcp");
      if (GA("tengu_mcp_add", {
          type: F,
          scope: V,
          source: "command",
          transport: F,
          transportExplicit: K,
          looksLikeUrl: D
        }), F === "sse") {
        if (!J) console.error("Error: URL is required for SSE transport."), process.exit(1);
        let H = X.header ? fK0(X.header) : void 0;
        if (K1A(Y, {
            type: "sse",
            url: J,
            headers: H
          }, V), process.stdout.write(`Added SSE MCP server ${Y} with URL: ${J} to ${V} config
`), H) process.stdout.write(`Headers: ${JSON.stringify(H,null,2)}
`)
      } else if (F === "http") {
        if (!J) console.error("Error: URL is required for HTTP transport."), process.exit(1);
        let H = X.header ? fK0(X.header) : void 0;
        if (K1A(Y, {
            type: "http",
            url: J,
            headers: H
          }, V), process.stdout.write(`Added HTTP MCP server ${Y} with URL: ${J} to ${V} config
`), H) process.stdout.write(`Headers: ${JSON.stringify(H,null,2)}
`)
      } else {
        if (!K && D) process.stderr.write(`
Warning: The command "${J}" looks like a URL, but is being interpreted as a stdio server as --transport was not specified.
`), process.stderr.write(`If this is an HTTP server, use: claude mcp add --transport http ${Y} ${J}
`), process.stderr.write(`If this is an SSE server, use: claude mcp add --transport sse ${Y} ${J}
`);
        let H = hH0(X.env);
        K1A(Y, {
          type: "stdio",
          command: J,
          args: W || [],
          env: H
        }, V), process.stdout.write(`Added stdio MCP server ${Y} with command: ${J} ${(W||[]).join(" ")} to ${V} config
`)
      }
      process.stdout.write(`File modified: ${YN(V)}
`), process.exit(0)
    } catch (V) {
      console.error(V.message), process.exit(1)
    }
  }), Q.command("remove <name>").description("Remove an MCP server").option("-s, --scope <scope>", "Configuration scope (local, user, or project) - if not specified, removes from whichever scope it exists in").helpOption("-h, --help", "Display help for command").action(async (Y, J) => {
    try {
      if (J.scope) {
        let D = fSA(J.scope);
        GA("tengu_mcp_delete", {
          name: Y,
          scope: D
        }), S10(Y, D), process.stdout.write(`Removed MCP server ${Y} from ${D} config
`), process.stdout.write(`File modified: ${YN(D)}
`), process.exit(0)
      }
      let W = j5(),
        X = N1(),
        {
          servers: V
        } = sX("project"),
        F = !!V[Y],
        K = [];
      if (W.mcpServers?.[Y]) K.push("local");
      if (F) K.push("project");
      if (X.mcpServers?.[Y]) K.push("user");
      if (K.length === 0) process.stderr.write(`No MCP server found with name: "${Y}"
`), process.exit(1);
      else if (K.length === 1) {
        let D = K[0];
        GA("tengu_mcp_delete", {
          name: Y,
          scope: D
        }), S10(Y, D), process.stdout.write(`Removed MCP server "${Y}" from ${D} config
`), process.stdout.write(`File modified: ${YN(D)}
`), process.exit(0)
      } else process.stderr.write(`MCP server "${Y}" exists in multiple scopes:
`), K.forEach((D) => {
        process.stderr.write(`  - ${iQA(D)} (${YN(D)})
`)
      }), process.stderr.write(`
To remove from a specific scope, use:
`), K.forEach((D) => {
        process.stderr.write(`  claude mcp remove "${Y}" -s ${D}
`)
      }), process.exit(1)
    } catch (W) {
      process.stderr.write(`${W.message}
`), process.exit(1)
    }
  }), Q.command("list").description("List configured MCP servers").helpOption("-h, --help", "Display help for command").action(async () => {
    GA("tengu_mcp_list", {});
    let {
      servers: Y
    } = await fk();
    if (Object.keys(Y).length === 0) console.log("No MCP servers configured. Use `claude mcp add` to add a server.");
    else {
      console.log(`Checking MCP server health...
`);
      for (let [J, W] of Object.entries(Y)) {
        let X = await aw9(J, W);
        if (W.type === "sse") console.log(`${J}: ${W.url} (SSE) - ${X}`);
        else if (W.type === "http") console.log(`${J}: ${W.url} (HTTP) - ${X}`);
        else if (!W.type || W.type === "stdio") {
          let V = Array.isArray(W.args) ? W.args : [];
          console.log(`${J}: ${W.command} ${V.join(" ")} - ${X}`)
        }
      }
    }
    process.exit(0)
  }), Q.command("get <name>").description("Get details about an MCP server").helpOption("-h, --help", "Display help for command").action(async (Y) => {
    GA("tengu_mcp_get", {
      name: Y
    });
    let J = GYA(Y);
    if (!J) console.error(`No MCP server found with name: ${Y}`), process.exit(1);
    console.log(`${Y}:`), console.log(`  Scope: ${iQA(J.scope)}`);
    let W = await aw9(Y, J);
    if (console.log(`  Status: ${W}`), J.type === "sse") {
      if (console.log("  Type: sse"), console.log(`  URL: ${J.url}`), J.headers) {
        console.log("  Headers:");
        for (let [X, V] of Object.entries(J.headers)) console.log(`    ${X}: ${V}`)
      }
    } else if (J.type === "http") {
      if (console.log("  Type: http"), console.log(`  URL: ${J.url}`), J.headers) {
        console.log("  Headers:");
        for (let [X, V] of Object.entries(J.headers)) console.log(`    ${X}: ${V}`)
      }
    } else if (J.type === "stdio") {
      console.log("  Type: stdio"), console.log(`  Command: ${J.command}`);
      let X = Array.isArray(J.args) ? J.args : [];
      if (console.log(`  Args: ${X.join(" ")}`), J.env) {
        console.log("  Environment:");
        for (let [V, F] of Object.entries(J.env)) console.log(`    ${V}=${F}`)
      }
    }
    console.log(`
To remove this server, run: claude mcp remove "${Y}" -s ${J.scope}`), process.exit(0)
  }), Q.command("add-json <name> <json>").description("Add an MCP server (stdio or SSE) with a JSON string").option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").helpOption("-h, --help", "Display help for command").action(async (Y, J, W) => {
    try {
      let X = fSA(W.scope),
        V = f7(J);
      K1A(Y, V, X);
      let F = V && typeof V === "object" && "type" in V ? String(V.type || "stdio") : "stdio";
      GA("tengu_mcp_add", {
        scope: X,
        source: "json",
        type: F
      }), console.log(`Added ${F} MCP server ${Y} to ${X} config`), process.exit(0)
    } catch (X) {
      console.error(X.message), process.exit(1)
    }
  }), Q.command("add-from-claude-desktop").description("Import MCP servers from Claude Desktop (Mac and WSL only)").option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").helpOption("-h, --help", "Display help for command").action(async (Y) => {
    try {
      let J = fSA(Y.scope),
        W = dQ();
      GA("tengu_mcp_add", {
        scope: J,
        platform: W,
        source: "desktop"
      });
      let X = pU9();
      if (Object.keys(X).length === 0) console.log("No MCP servers found in Claude Desktop configuration or configuration file does not exist."), process.exit(0);
      let {
        unmount: V
      } = await VG(d3.default.createElement(yG, null, d3.default.createElement(mU9, {
        servers: X,
        scope: J,
        onDone: () => {
          V()
        }
      })), {
        exitOnCtrlC: !0
      })
    } catch (J) {
      console.error(J.message), process.exit(1)
    }
  }), Q.command("reset-project-choices").description("Reset all approved and rejected project-scoped (.mcp.json) servers within this project").helpOption("-h, --help", "Display help for command").action(async () => {
    GA("tengu_mcp_reset_mcpjson_choices", {});
    let Y = j5();
    AY({
      ...Y,
      enabledMcpjsonServers: [],
      disabledMcpjsonServers: [],
      enableAllProjectMcpServers: !1
    }), console.log("All project-scoped (.mcp.json) server approvals and rejections have been reset."), console.log("You will be prompted for approval next time you start Claude Code."), process.exit(0)
  });

  function B(Y, J) {
    AA(Y instanceof Error ? Y : Error(String(Y))), console.error(`${H1.cross} Failed to ${J}: ${Y instanceof Error?Y.message:String(Y)}`), process.exit(1)
  }
  let G = A.command("plugin").description("Manage Claude Code plugins").helpOption("-h, --help", "Display help for command");
  G.command("validate <path>").description("Validate a plugin or marketplace manifest").helpOption("-h, --help", "Display help for command").action((Y) => {
    try {
      let J = qJ1(Y);
      if (console.log(`Validating ${J.fileType} manifest: ${J.filePath}
`), J.errors.length > 0) console.log(`${H1.cross} Found ${J.errors.length} error${J.errors.length===1?"":"s"}:
`), J.errors.forEach((W) => {
        console.log(`  ${H1.pointer} ${W.path}: ${W.message}`)
      }), console.log("");
      if (J.warnings.length > 0) console.log(`${H1.warning} Found ${J.warnings.length} warning${J.warnings.length===1?"":"s"}:
`), J.warnings.forEach((W) => {
        console.log(`  ${H1.pointer} ${W.path}: ${W.message}`)
      }), console.log("");
      if (J.success) {
        if (J.warnings.length > 0) console.log(`${H1.tick} Validation passed with warnings`);
        else console.log(`${H1.tick} Validation passed`);
        process.exit(0)
      } else console.log(`${H1.cross} Validation failed`), process.exit(1)
    } catch (J) {
      AA(J instanceof Error ? J : Error(String(J))), console.error(`${H1.cross} Unexpected error during validation: ${J instanceof Error?J.message:String(J)}`), process.exit(2)
    }
  });
  let Z = G.command("marketplace").description("Manage Claude Code marketplaces").helpOption("-h, --help", "Display help for command");
  Z.command("add <source>").description("Add a marketplace from a URL, path, or GitHub repo").helpOption("-h, --help", "Display help for command").action(async (Y) => {
    try {
      let J = wJ1(Y);
      if (!J) console.error(`${H1.cross} Invalid marketplace source format. Try: owner/repo, https://..., or ./path`), process.exit(1);
      if ("error" in J) console.error(`${H1.cross} ${J.error}`), process.exit(1);
      let W = J;
      console.log("Adding marketplace...");
      let {
        name: X
      } = await rAA(W, (F) => {
        console.log(F)
      });
      AF();
      let V = W.source;
      if (W.source === "github") V = W.repo;
      GA("tengu_marketplace_added", {
        source_type: V
      }), console.log(`${H1.tick} Successfully added marketplace: ${X}`), process.exit(0)
    } catch (J) {
      B(J, "add marketplace")
    }
  }), Z.command("list").description("List all configured marketplaces").helpOption("-h, --help", "Display help for command").action(async () => {
    try {
      let Y = await pZ(),
        J = Object.keys(Y);
      if (J.length === 0) console.log("No marketplaces configured"), process.exit(0);
      console.log(`Configured marketplaces:
`), J.forEach((W) => {
        let X = Y[W];
        if (console.log(`  ${H1.pointer} ${W}`), X?.source) {
          let V = X.source;
          if (V.source === "github") console.log(`    Source: GitHub (${V.repo})`);
          else if (V.source === "git") console.log(`    Source: Git (${V.url})`);
          else if (V.source === "url") console.log(`    Source: URL (${V.url})`);
          else if (V.source === "directory") console.log(`    Source: Directory (${V.path})`);
          else if (V.source === "file") console.log(`    Source: File (${V.path})`)
        }
        console.log("")
      }), process.exit(0)
    } catch (Y) {
      B(Y, "list marketplaces")
    }
  }), Z.command("remove <name>").alias("rm").description("Remove a configured marketplace").helpOption("-h, --help", "Display help for command").action(async (Y) => {
    try {
      await ZB1(Y), AF(), GA("tengu_marketplace_removed", {
        marketplace_name: Y
      }), console.log(`${H1.tick} Successfully removed marketplace: ${Y}`), process.exit(0)
    } catch (J) {
      B(J, "remove marketplace")
    }
  }), Z.command("update [name]").description("Update marketplace(s) from their source - updates all if no name specified").helpOption("-h, --help", "Display help for command").action(async (Y) => {
    try {
      if (Y) console.log(`Updating marketplace: ${Y}...`), await IB1(Y, (J) => {
        console.log(J)
      }), AF(), GA("tengu_marketplace_updated", {
        marketplace_name: Y
      }), console.log(`${H1.tick} Successfully updated marketplace: ${Y}`), process.exit(0);
      else {
        let J = await pZ(),
          W = Object.keys(J);
        if (W.length === 0) console.log("No marketplaces configured"), process.exit(0);
        console.log(`Updating ${W.length} marketplace(s)...`), await i22(), AF(), GA("tengu_marketplace_updated_all", {
          count: W.length
        }), console.log(`${H1.tick} Successfully updated ${W.length} marketplace(s)`), process.exit(0)
      }
    } catch (J) {
      B(J, "update marketplace(s)")
    }
  }), G.command("install <plugin>").alias("i").description("Install a plugin from available marketplaces (use plugin@marketplace for specific marketplace)").helpOption("-h, --help", "Display help for command").action(async (Y) => {
    GA("tengu_plugin_install_command", {
      plugin: Y
    }), await L$9(Y)
  }), G.command("uninstall <plugin>").alias("remove").alias("rm").description("Uninstall an installed plugin").helpOption("-h, --help", "Display help for command").action(async (Y) => {
    GA("tengu_plugin_uninstall_command", {
      plugin: Y
    }), await M$9(Y)
  }), G.command("enable <plugin>").description("Enable a disabled plugin").helpOption("-h, --help", "Display help for command").action(async (Y) => {
    GA("tengu_plugin_enable_command", {
      plugin: Y
    }), await O$9(Y)
  }), G.command("disable <plugin>").description("Disable an enabled plugin").helpOption("-h, --help", "Display help for command").action(async (Y) => {
    GA("tengu_plugin_disable_command", {
      plugin: Y
    }), await R$9(Y)
  }), A.command("setup-token").description("Set up a long-lived authentication token (requires Claude subscription)").helpOption("-h, --help", "Display help for command").action(async () => {
    if (GA("tengu_setup_token_command", {}), await kJ(), !JU()) process.stderr.write(tA.yellow(`Warning: You already have authentication configured via environment variable or API key helper.
`)), process.stderr.write(tA.yellow(`The setup-token command will create a new OAuth token which you can use instead.
`));
    await new Promise(async (Y) => {
      let {
        unmount: J
      } = await VG(d3.default.createElement(yG, {
        onChangeAppState: Yu
      }, d3.default.createElement(S, {
        flexDirection: "column",
        gap: 1
      }, d3.default.createElement(Zp, {
        items: [d3.default.createElement(eJ1, {
          key: "welcome"
        })]
      }, (W) => W), d3.default.createElement(Vn, {
        onDone: () => {
          J(), Y()
        },
        mode: "setup-token",
        startingMessage: "This will guide you through long-lived (1-year) auth token setup for your Claude account. Claude subscription required."
      }))))
    }), process.exit(0)
  });

  function I({
    onDone: Y
  }) {
    return $I1(), d3.default.createElement(iY1, {
      onDone: Y
    })
  }
  return A.command("doctor").description("Check the health of your Claude Code auto-updater").helpOption("-h, --help", "Display help for command").action(async () => {
    GA("tengu_doctor_command", {}), await new Promise(async (Y) => {
      let {
        unmount: J
      } = await VG(d3.default.createElement(yG, null, d3.default.createElement(_Z1, {
        dynamicMcpConfig: void 0,
        isStrictMcpConfig: !1
      }, d3.default.createElement(I, {
        onDone: () => {
          J(), Y()
        }
      }))), {
        exitOnCtrlC: !1
      })
    }), process.exit(0)
  }), A.command("update").description("Check for updates and install if available").helpOption("-h, --help", "Display help for command").action(jw9), A.command("install [target]").description("Install Claude Code native build. Use [target] to specify version (stable, latest, or specific version)").option("--force", "Force installation even if already installed").helpOption("-h, --help", "Display help for command").action(async (Y, J) => {
    await JW1(jD0(), "default", !1, !1, void 0), await new Promise((W) => {
      let X = [];
      if (Y) X.push(Y);
      if (J.force) X.push("--force");
      kw9.call(() => {
        W(), process.exit(0)
      }, {}, X)
    })
  }), M9("run_before_parse"), await A.parseAsync(process.argv), M9("run_after_parse"), M9("main_after_run"), wz0(), A
}
// @from(Start 14911986, End 14913211)
async function gu3({
  hasInitialPrompt: A,
  hasStdin: Q,
  verbose: B,
  debug: G,
  debugToStderr: Z,
  print: I,
  outputFormat: Y,
  inputFormat: J,
  numAllowedTools: W,
  numDisallowedTools: X,
  mcpClientCount: V,
  worktree: F,
  skipWebFetchPreflight: K,
  githubActionInputs: D,
  dangerouslySkipPermissionsPassed: H,
  modeIsBypass: C,
  allowDangerouslySkipPermissionsPassed: E,
  systemPromptFlag: U,
  appendSystemPromptFlag: q
}) {
  try {
    let w = await uCB();
    GA("tengu_init", {
      entrypoint: "claude",
      hasInitialPrompt: A,
      hasStdin: Q,
      verbose: B,
      debug: G,
      debugToStderr: Z,
      print: I,
      outputFormat: Y,
      inputFormat: J,
      numAllowedTools: W,
      numDisallowedTools: X,
      mcpClientCount: V,
      worktree: F,
      skipWebFetchPreflight: K,
      ...D && {
        githubActionInputs: D
      },
      dangerouslySkipPermissionsPassed: H,
      modeIsBypass: C,
      allowDangerouslySkipPermissionsPassed: E,
      ...U && {
        systemPromptFlag: U
      },
      ...q && {
        appendSystemPromptFlag: q
      },
      ...w && {
        rh: w
      }
    })
  } catch (w) {
    AA(w instanceof Error ? w : Error(String(w)))
  }
}
// @from(Start 14913213, End 14913348)
function uu3() {
  (process.stderr.isTTY ? process.stderr : process.stdout.isTTY ? process.stdout : void 0)?.write(`\x1B[?25h${Iu1}`)
}
// @from(Start 14913353, End 14913355)
d3
// @from(Start 14913361, End 14914694)
tw9 = L(() => {
  js();
  AU9();
  HU9();
  unA();
  EU9();
  gB();
  c5();
  It();
  GD0();
  MU9();
  PU9();
  _U9();
  $V0();
  wV0();
  qxA();
  hA();
  ZY1();
  Ty();
  RI1();
  iK0();
  yq();
  eXA();
  F9();
  dU9();
  lU9();
  giA();
  vjA();
  Q3();
  jQ();
  gB();
  vzA();
  hYA();
  Vm1();
  Xm1();
  g1();
  S7();
  Pi();
  S7();
  sU9();
  SRA();
  AF0();
  nW0();
  JD0();
  F$9();
  pV0();
  gE();
  t2();
  MB();
  K$9();
  H$9();
  q$9();
  FK0();
  hQ();
  cE();
  fP();
  dMA();
  YK0();
  oH();
  sQA();
  BK0();
  T$9();
  za();
  V9();
  S$9();
  k$9();
  PV();
  b$9();
  hQ();
  LF();
  Sy();
  AZ0();
  S7();
  OZ();
  N50();
  d$9();
  u2();
  o$9();
  q0();
  hW0();
  eaA();
  ZIA();
  uy();
  Bh();
  t$9();
  Zw();
  Aw9();
  Ok();
  tJA();
  sj();
  vYA();
  k1A();
  u_();
  gb();
  _0();
  z9();
  $QA();
  Qw9();
  Ti();
  CYA();
  _0();
  fV();
  V0();
  Gw9();
  Iw9();
  Jw9();
  Xw9();
  Fw9();
  CrA();
  Tw9();
  Sw9();
  ijA();
  NE();
  _8();
  yw9();
  $0A();
  nJ1();
  vw9();
  dw9();
  CU();
  kW();
  HH();
  RZ();
  tM();
  nX();
  IQ0();
  AQ();
  u_();
  U2();
  XJ1();
  QjA();
  NX0();
  LV();
  WD0();
  tXA();
  th();
  lw9();
  $J();
  iw9();
  dH();
  lJ1();
  NIA();
  d3 = BA(VA(), 1);
  M9("main_tsx_entry");
  M9("main_tsx_imports_loaded");
  if (Ru3()) process.exit(1)
})
// @from(Start 14914894, End 14914897)
AD0
// @from(Start 14914899, End 14914907)
cz9 = !1
// @from(Start 14914910, End 14914976)
function pz9() {
  if (AD0 === void 0) AD0 = dz9();
  return AD0
}
// @from(Start 14914978, End 14915277)
function TC() {
  let A = xVA(),
    Q = pz9();
  if (!cz9) {
    if (cz9 = !0, A && Q === null) {
      let B = cJ1(),
        G = SVA();
      console.error(tA.yellow(`Warning: MCP endpoint file not found at ${B} (session: ${G}). Falling back to state file.`))
    }
  }
  return A && Q !== null
}
// @from(Start 14915278, End 14915382)
class uSA extends Error {
  constructor(A) {
    super(A);
    this.name = "ConnectionFailedError"
  }
}
// @from(Start 14915383, End 14916198)
async function mSA(A, Q, B, G) {
  let Z = Date.now();
  try {
    let I = await Q();
    if (!TC()) {
      let Y = typeof B === "function" ? B(I) : B || {};
      await eu("tengu_mcp_cli_command_executed", {
        command: A,
        success: !0,
        duration_ms: Date.now() - Z,
        ...Y
      })
    }
    return {
      success: !0,
      data: I
    }
  } catch (I) {
    let Y = I instanceof Error ? I : Error(String(I));
    if (console.error(tA.red("Error:"), Y.message), !TC()) {
      let J = typeof B === "object" ? B : {};
      await eu("tengu_mcp_cli_command_executed", {
        command: A,
        success: !1,
        error_type: Y.constructor.name,
        duration_ms: Date.now() - Z,
        ...J,
        ...G
      })
    }
    return {
      success: !1,
      error: Y
    }
  }
}
// @from(Start 14916200, End 14916530)
function ka() {
  let A = kK0();
  if (!zh3(A)) {
    let Q = SVA();
    throw Error(`MCP state file not found at ${A} (session: ${Q}). Is Claude Code running?`)
  }
  try {
    return JSON.parse(Eh3(A, "utf-8"))
  } catch (Q) {
    throw Error(`Error reading MCP state file ${A}: ${Q instanceof Error?Q.message:String(Q)}`)
  }
}
// @from(Start 14916532, End 14916688)
function lz9(A, Q) {
  if (A.configs?.[Q]) return A.configs[Q];
  let B = A.normalizedNames?.[Q];
  if (B && A.configs?.[B]) return A.configs[B];
  return
}
// @from(Start 14916690, End 14916857)
function Uh3(A, Q) {
  if (A.resources?.[Q]) return A.resources[Q];
  let B = A.normalizedNames?.[Q];
  if (B && A.resources?.[B]) return A.resources[B];
  return []
}
// @from(Start 14916859, End 14917071)
function QD0(A) {
  let Q = A.split("/");
  if (Q.length !== 2 || !Q[0] || !Q[1]) throw Error(`Invalid tool identifier '${A}'. Expected format: <server>/<tool>`);
  return {
    server: Q[0],
    tool: Q[1]
  }
}
// @from(Start 14917072, End 14918011)
async function eQA(A, Q, B = 1e4) {
  let G = pz9();
  if (!G) throw Error("MCP CLI endpoint not enabled");
  try {
    let Z = await YQ({
      method: "POST",
      url: `${G.url}/mcp`,
      data: Q,
      headers: {
        Authorization: `Bearer ${G.key}`,
        "Content-Type": "application/json"
      },
      timeout: B,
      validateStatus: () => !0
    });
    if (Z.status >= 400) {
      let I = Z.data,
        Y = Error(I.error || `HTTP ${Z.status}: ${Z.statusText}`);
      if (I.type) Y.name = I.type;
      throw Y
    }
    return A.parse(Z.data)
  } catch (Z) {
    if (YQ.isAxiosError(Z)) {
      if (Z.code === "ECONNREFUSED") throw Error("Connection refused - is the MCP endpoint running?");
      if (Z.code === "ETIMEDOUT" || Z.message.includes("timeout")) throw Error("Request timeout");
      if (Z.message.startsWith("HTTP ")) throw Z;
      throw Error(`Network error: ${Z.message}`)
    }
    throw Z
  }
}
// @from(Start 14918016, End 14918114)
ya = new fJ1().name("mcp-cli").description("Interact with MCP servers and tools").version("1.0.0")
// @from(Start 14920757, End 14921505)
async function $h3(A, Q, B, G) {
  let Z = ka(),
    I = lz9(Z, Q);
  if (!I) throw Error(`Server '${Q}' not found`);
  if (G.debug) console.error(`Connecting to ${Q} (${I.type})...`);
  let Y = await D1A(Q, I);
  if (Y.client.type !== "connected") throw tQA(Q, Y.client.type) ?? new uSA(`Failed to connect to server '${Q}'`);
  let J = (() => {
    let V = `mcp__${n7(Q)}__${n7(A)}`;
    return Z.tools.find((K) => K.name === V)?.originalToolName || A
  })();
  if (G.debug) console.error(`Calling tool ${J}...`);
  let W = await Y.client.client.request({
    method: "tools/call",
    params: {
      name: J,
      arguments: B
    }
  }, aT, {
    signal: AbortSignal.timeout(parseInt(G.timeout, 10))
  });
  return Y.client.client.close(), W
}
// @from(Start 14925284, End 14925829)
async function wh3(A, Q, B) {
  let G = ka(),
    Z = lz9(G, A);
  if (!Z) throw Error(`Server '${A}' not found`);
  if (B.debug) console.error(`Connecting to ${A} (${Z.type})...`);
  let I = await D1A(A, Z);
  if (I.client.type !== "connected") throw tQA(A, I.client.type) ?? new uSA(`Failed to connect to server '${A}'`);
  if (B.debug) console.error(`Reading resource: ${Q}`);
  let Y = await I.client.client.readResource({
    uri: Q
  }, {
    signal: AbortSignal.timeout(parseInt(B.timeout, 10))
  });
  return I.client.client.close(), Y
}
// @from(Start 14927863, End 14928148)
async function iz9(A) {
  if (PiA(), !TC()) nb();
  try {
    if (await ya.parseAsync(A, {
        from: "user"
      }), !TC()) await (await nb())?.flush();
    return 0
  } catch (Q) {
    if (console.error(tA.red("Error:"), Q), !TC()) await (await nb())?.flush();
    return 1
  }
}
// @from(Start 14928153, End 14928166)
nz9 = 1048576
// @from(Start 14928169, End 14928252)
function qh3(A, ...Q) {
  console.error(`[Claude Chrome Native Host] ${A}`, ...Q)
}
// @from(Start 14928253, End 14929714)
class Nh3 {
  buffer = Buffer.alloc(0);
  pendingResolve = null;
  closed = !1;
  constructor() {
    process.stdin.on("data", (A) => {
      this.buffer = Buffer.concat([this.buffer, A]), this.tryProcessMessage()
    }), process.stdin.on("end", () => {
      if (this.closed = !0, this.pendingResolve) this.pendingResolve(null), this.pendingResolve = null
    }), process.stdin.on("error", () => {
      if (this.closed = !0, this.pendingResolve) this.pendingResolve(null), this.pendingResolve = null
    })
  }
  tryProcessMessage() {
    if (!this.pendingResolve) return;
    if (this.buffer.length < 4) return;
    let A = this.buffer.readUInt32LE(0);
    if (A === 0 || A > nz9) {
      qh3(`Invalid message length: ${A}`), this.pendingResolve(null), this.pendingResolve = null;
      return
    }
    if (this.buffer.length < 4 + A) return;
    let Q = this.buffer.subarray(4, 4 + A);
    this.buffer = this.buffer.subarray(4 + A);
    let B = Q.toString("utf-8");
    this.pendingResolve(B), this.pendingResolve = null
  }
  async read() {
    if (this.closed) return null;
    if (this.buffer.length >= 4) {
      let A = this.buffer.readUInt32LE(0);
      if (A > 0 && A <= nz9 && this.buffer.length >= 4 + A) {
        let Q = this.buffer.subarray(4, 4 + A);
        return this.buffer = this.buffer.subarray(4 + A), Q.toString("utf-8")
      }
    }
    return new Promise((A) => {
      this.pendingResolve = A, this.tryProcessMessage()
    })
  }
}
// @from(Start 14929802, End 14930795)
async function mu3() {
  let A = process.argv.slice(2);
  if (A.length === 1 && (A[0] === "--version" || A[0] === "-v" || A[0] === "-V")) {
    M9("cli_version_fast_path"), console.log(`${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION} (Claude Code)`);
    return
  }
  if (bZ() && A[0] === "--mcp-cli") {
    let B = A.slice(1);
    process.exit(await iz9(B))
  }
  if (A[0] === "--ripgrep") {
    M9("cli_ripgrep_path");
    let B = A.slice(1),
      {
        ripgrepMain: G
      } = await Promise.resolve().then(() => (sz9(), az9));
    process.exitCode = G(B);
    return
  }
  M9("cli_before_main_import");
  let {
    main: Q
  } = await Promise.resolve().then(() => (tw9(), ow9));
  M9("cli_after_main_import"), await Q(), M9("cli_after_main_complete")
}