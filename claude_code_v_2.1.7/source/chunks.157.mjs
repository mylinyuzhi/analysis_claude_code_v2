
// @from(Ln 469708, Col 0)
async function J_7() {
  x9("run_function_start");

  function A() {
    let X = (I) => I.long?.replace(/^--/, "") ?? I.short?.replace(/^-/, "") ?? "";
    return Object.assign({
      sortSubcommands: !0,
      sortOptions: !0
    }, {
      compareOptions: (I, D) => X(I).localeCompare(X(D))
    })
  }
  let Q = new O$1().configureHelp(A());
  x9("run_commander_initialized"), Q.hook("preAction", async () => {
    x9("preAction_start");
    let X = zI9();
    if (X instanceof Promise) await X;
    x9("preAction_after_init"), K12(), sR7(), x9("preAction_after_migrations"), zL2(), x9("preAction_after_remote_settings")
  }), Q.name("claude").description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output").argument("[prompt]", "Your prompt", String).helpOption("-h, --help", "Display help for command").option("-d, --debug [filter]", 'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!statsig,!file")', (X) => {
    return !0
  }).addOption(new LK("-d2e, --debug-to-stderr", "Enable debug mode (to stderr)").argParser(Boolean).hideHelp()).option("--verbose", "Override verbose mode setting from config", () => !0).option("-p, --print", "Print response and exit (useful for pipes). Note: The workspace trust dialog is skipped when Claude is run with the -p mode. Only use this flag in directories you trust.", () => !0).addOption(new LK("--output-format <format>", 'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)').choices(["text", "json", "stream-json"])).addOption(new LK("--json-schema <schema>", 'JSON Schema for structured output validation. Example: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}').argParser(String)).option("--include-partial-messages", "Include partial message chunks as they arrive (only works with --print and --output-format=stream-json)", () => !0).addOption(new LK("--input-format <format>", 'Input format (only works with --print): "text" (default), or "stream-json" (realtime streaming input)').choices(["text", "stream-json"])).option("--mcp-debug", "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)", () => !0).option("--dangerously-skip-permissions", "Bypass all permission checks. Recommended only for sandboxes with no internet access.", () => !0).option("--allow-dangerously-skip-permissions", "Enable bypassing all permission checks as an option, without it being enabled by default. Recommended only for sandboxes with no internet access.", () => !0).addOption(new LK("--max-thinking-tokens <tokens>", "Maximum number of thinking tokens.  (only works with --print)").argParser(Number).hideHelp()).addOption(new LK("--max-turns <turns>", "Maximum number of agentic turns in non-interactive mode. This will early exit the conversation after the specified number of turns. (only works with --print)").argParser(Number).hideHelp()).addOption(new LK("--max-budget-usd <amount>", "Maximum dollar amount to spend on API calls (only works with --print)").argParser((X) => {
    let I = Number(X);
    if (isNaN(I) || I <= 0) throw Error("--max-budget-usd must be a positive number greater than 0");
    return I
  })).option("--replay-user-messages", "Re-emit user messages from stdin back on stdout for acknowledgment (only works with --input-format=stream-json and --output-format=stream-json)", () => !0).addOption(new LK("--enable-auth-status", "Enable auth status messages in SDK mode").default(!1).hideHelp()).option("--allowedTools, --allowed-tools <tools...>", 'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")').option("--tools <tools...>", 'Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names (e.g. "Bash,Edit,Read").').option("--disallowedTools, --disallowed-tools <tools...>", 'Comma or space-separated list of tool names to deny (e.g. "Bash(git:*) Edit")').option("--mcp-config <configs...>", "Load MCP servers from JSON files or strings (space-separated)").addOption(new LK("--permission-prompt-tool <tool>", "MCP tool to use for permission prompts (only works with --print)").argParser(String).hideHelp()).addOption(new LK("--system-prompt <prompt>", "System prompt to use for the session").argParser(String)).addOption(new LK("--system-prompt-file <file>", "Read system prompt from a file").argParser(String).hideHelp()).addOption(new LK("--append-system-prompt <prompt>", "Append a system prompt to the default system prompt").argParser(String)).addOption(new LK("--append-system-prompt-file <file>", "Read system prompt from a file and append to the default system prompt").argParser(String).hideHelp()).addOption(new LK("--permission-mode <mode>", "Permission mode to use for the session").argParser(String).choices(NP)).option("-c, --continue", "Continue the most recent conversation in the current directory", () => !0).option("-r, --resume [value]", "Resume a conversation by session ID, or open interactive picker with optional search term", (X) => X || !0).option("--fork-session", "When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)", () => !0).option("--no-session-persistence", "Disable session persistence - sessions will not be saved to disk and cannot be resumed (only works with --print)").addOption(new LK("--resume-session-at <message id>", "When resuming, only messages up to and including the assistant message with <message.id> (use with --resume in print mode)").argParser(String).hideHelp()).addOption(new LK("--rewind-files <user-message-id>", "Restore files to state at the specified user message and exit (requires --resume)").hideHelp()).option("--model <model>", "Model for the current session. Provide an alias for the latest model (e.g. 'sonnet' or 'opus') or a model's full name (e.g. 'claude-sonnet-4-5-20250929').").option("--agent <agent>", "Agent for the current session. Overrides the 'agent' setting.").option("--betas <betas...>", "Beta headers to include in API requests (API key users only)").option("--fallback-model <model>", "Enable automatic fallback to specified model when default model is overloaded (only works with --print)").option("--settings <file-or-json>", "Path to a settings JSON file or a JSON string to load additional settings from").option("--add-dir <directories...>", "Additional directories to allow tool access to").option("--ide", "Automatically connect to IDE on startup if exactly one valid IDE is available", () => !0).option("--strict-mcp-config", "Only use MCP servers from --mcp-config, ignoring all other MCP configurations", () => !0).option("--session-id <uuid>", "Use a specific session ID for the conversation (must be a valid UUID)").option("--agents <json>", `JSON object defining custom agents (e.g. '{"reviewer": {"description": "Reviews code", "prompt": "You are a code reviewer"}}')`).option("--setting-sources <sources>", "Comma-separated list of setting sources to load (user, project, local).").option("--plugin-dir <paths...>", "Load plugins from directories for this session only (repeatable)").option("--disable-slash-commands", "Disable all skills", () => !0).option("--chrome", "Enable Claude in Chrome integration").option("--no-chrome", "Disable Claude in Chrome integration").action(async (X, I) => {
    if (x9("action_handler_start"), X === "code") l("tengu_code_prompt_ignored", {}), console.warn(I1.yellow("Tip: You can launch Claude Code with just `claude`")), X = void 0;
    if (X && typeof X === "string" && !/\s/.test(X) && X.length > 0) l("tengu_single_word_prompt", {
      length: X.length
    });
    let {
      debug: D = !1,
      debugToStderr: W = !1,
      dangerouslySkipPermissions: K,
      allowDangerouslySkipPermissions: V = !1,
      tools: F = [],
      allowedTools: H = [],
      disallowedTools: E = [],
      mcpConfig: z = [],
      permissionMode: $,
      addDir: O = [],
      fallbackModel: L,
      betas: M = [],
      ide: _ = !1,
      sessionId: j,
      includePartialMessages: x,
      pluginDir: b = []
    } = I, S = I.agents, u = I.agent;
    if (b.length > 0) Af0(b), Bt();
    Py2();
    let {
      outputFormat: f,
      inputFormat: AA
    } = I, n = I.verbose ?? L1().verbose, y = I.print, p = I.loopy, GA = void 0, WA = GA ? /^\d+$/.test(GA) ? Number(GA) : a1(GA) : void 0, MA = p ?? WA, TA = MA !== void 0 && MA !== !1, bA = TA ? typeof MA === "number" ? MA : 0 : void 0;
    if (TA) process.env.CLAUDE_CODE_LOOPY_MODE = "true", l("tengu_loopy_mode_started", {
      interval_ms: bA
    });
    let jA = I.disableSlashCommands || !1,
      OA = !1,
      IA = OA ? typeof OA === "string" ? OA : e10 : void 0,
      HA = void 0,
      ZA = typeof HA === "string" ? HA : void 0,
      zA = HA !== void 0,
      wA = I,
      _A = void 0,
      s = void 0,
      t = I.sdkUrl ?? void 0;
    if (t) {
      if (!AA) AA = "stream-json";
      if (!f) f = "stream-json";
      if (I.verbose === void 0) n = !0;
      if (!I.print) y = !0
    }
    let BA = I.teleport ?? null,
      DA = I.remote ?? null;
    if (j) {
      if ((I.continue || I.resume) && !I.forkSession) process.stderr.write(I1.red(`Error: --session-id can only be used with --continue or --resume if --fork-session is also specified.
`)), process.exit(1);
      let PQ = BU(j);
      if (!PQ) process.stderr.write(I1.red(`Error: Invalid session ID. Must be a valid UUID.
`)), process.exit(1);
      if (bJ9(PQ)) process.stderr.write(I1.red(`Error: Session ID ${PQ} is already in use.
`)), process.exit(1)
    }
    let CA = p2();
    if (L && I.model && L === I.model) process.stderr.write(I1.red(`Error: Fallback model cannot be the same as the main model. Please specify a different model for --fallback-model.
`)), process.exit(1);
    let FA = I.systemPrompt;
    if (I.systemPromptFile) {
      if (I.systemPrompt) process.stderr.write(I1.red(`Error: Cannot use both --system-prompt and --system-prompt-file. Please use only one.
`)), process.exit(1);
      try {
        let PQ = Ny0(I.systemPromptFile);
        if (!XU1(PQ)) process.stderr.write(I1.red(`Error: System prompt file not found: ${PQ}
`)), process.exit(1);
        FA = HL9(PQ, "utf8")
      } catch (PQ) {
        process.stderr.write(I1.red(`Error reading system prompt file: ${PQ instanceof Error?PQ.message:String(PQ)}
`)), process.exit(1)
      }
    }
    let xA = I.appendSystemPrompt;
    if (I.appendSystemPromptFile) {
      if (I.appendSystemPrompt) process.stderr.write(I1.red(`Error: Cannot use both --append-system-prompt and --append-system-prompt-file. Please use only one.
`)), process.exit(1);
      try {
        let PQ = Ny0(I.appendSystemPromptFile);
        if (!XU1(PQ)) process.stderr.write(I1.red(`Error: Append system prompt file not found: ${PQ}
`)), process.exit(1);
        xA = HL9(PQ, "utf8")
      } catch (PQ) {
        process.stderr.write(I1.red(`Error reading append system prompt file: ${PQ instanceof Error?PQ.message:String(PQ)}
`)), process.exit(1)
      }
    }
    if (TA) xA = xA ? `${xA}


You are an autonomous agent. Explore this codebase, follow your interests, and act decisively without asking permission.

You receive [Tick] prompts when idle. Use these to:
- Continue working on the current task
- Check for new work (PR comments, failing CI, task lists)
- Explore areas that interest you

Use Sleep to pace yourself:
- Sleep(60000) after completing a major milestone
- Sleep(30000) between related operations
- Sleep(5000-10000) when polling for something (CI status, PR reviews)
- Don't sleep if there's immediate work to do

When working on a task, own it end-to-end: implement, test, handle feedback, iterate until done.` : `
You are an autonomous agent. Explore this codebase, follow your interests, and act decisively without asking permission.

You receive [Tick] prompts when idle. Use these to:
- Continue working on the current task
- Check for new work (PR comments, failing CI, task lists)
- Explore areas that interest you

Use Sleep to pace yourself:
- Sleep(60000) after completing a major milestone
- Sleep(30000) between related operations
- Sleep(5000-10000) when polling for something (CI status, PR reviews)
- Don't sleep if there's immediate work to do

When working on a task, own it end-to-end: implement, test, handle feedback, iterate until done.`;
    let {
      mode: mA,
      notification: G1
    } = HJ9({
      permissionModeCli: $,
      dangerouslySkipPermissions: K
    });
    Bf0(mA === "bypassPermissions");
    let J1 = {};
    if (z && z.length > 0) {
      let PQ = z.map((Y6) => Y6.trim()).filter((Y6) => Y6.length > 0),
        z2 = {},
        w4 = [];
      for (let Y6 of PQ) {
        let eB = null,
          L4 = [],
          L5 = c5(Y6);
        if (L5) {
          let B8 = efA({
            configObject: L5,
            filePath: "command line",
            expandVars: !0,
            scope: "dynamic"
          });
          if (B8.config) eB = B8.config.mcpServers;
          else L4 = B8.errors
        } else {
          let B8 = Ny0(Y6),
            F6 = dEA({
              filePath: B8,
              expandVars: !0,
              scope: "dynamic"
            });
          if (F6.config) eB = F6.config.mcpServers;
          else L4 = F6.errors
        }
        if (L4.length > 0) w4.push(...L4);
        else if (eB) z2 = {
          ...z2,
          ...eB
        }
      }
      if (w4.length > 0) {
        let Y6 = w4.map((eB) => `${eB.path?eB.path+": ":""}${eB.message}`).join(`
`);
        throw Error(`Invalid MCP configuration:
${Y6}`)
      }
      if (Object.keys(z2).length > 0) {
        if (Object.keys(z2).some(uEA)) throw Error(`Invalid MCP configuration: "${Ej}" is a reserved MCP name.`);
        let Y6 = I1A(z2, (eB) => ({
          ...eB,
          scope: "dynamic"
        }));
        J1 = {
          ...J1,
          ...Y6
        }
      }
    }
    let A1 = az1(I.chrome) && qB(),
      n1 = !A1 && I$A();
    if (A1) {
      let PQ = $Q();
      try {
        l("tengu_claude_in_chrome_setup", {
          platform: PQ
        });
        let {
          mcpConfig: z2,
          allowedTools: w4,
          systemPrompt: Y6
        } = oz1();
        if (J1 = {
            ...J1,
            ...z2
          }, H.push(...w4), Y6) xA = xA ? `${Y6}

${xA}` : Y6
      } catch (z2) {
        l("tengu_claude_in_chrome_setup_failed", {
          platform: PQ
        }), k(`[Claude in Chrome] Error: ${z2}`), e(z2 instanceof Error ? z2 : Error(String(z2))), console.error("Error: Failed to run with Claude in Chrome."), process.exit(1)
      }
    } else if (n1) try {
      let {
        mcpConfig: PQ
      } = oz1();
      J1 = {
        ...J1,
        ...PQ
      }, xA = xA ? `${xA}

${xT0}` : xT0
    } catch (PQ) {
      k(`[Claude in Chrome] Error (auto-enable): ${PQ}`)
    }
    let S1 = I.strictMcpConfig || !1;
    if (AhA()) {
      if (S1) process.stderr.write(I1.red("You cannot use --strict-mcp-config when an enterprise MCP config is present")), process.exit(1);
      if (J1 && !Jr2(J1)) process.stderr.write(I1.red("You cannot dynamically configure MCP servers when an enterprise MCP config is present")), process.exit(1)
    }
    let L0, VQ, {
      toolPermissionContext: t0,
      warnings: QQ
    } = EJ9({
      allowedToolsCli: H,
      disallowedToolsCli: E,
      baseToolsCli: F,
      permissionMode: mA,
      allowDangerouslySkipPermissions: V,
      addDirs: O
    });
    QQ.forEach((PQ) => {
      console.error(PQ)
    }), ym2(), k("[STARTUP] Loading MCP configs...");
    let y1 = Date.now(),
      {
        servers: qQ
      } = S1 ? {
        servers: {}
      } : CA ? await it() : await cEA();
    k(`[STARTUP] MCP configs loaded in ${Date.now()-y1}ms`);
    let K1 = {
        ...qQ,
        ...J1
      },
      $1 = {},
      i1 = {};
    for (let [PQ, z2] of Object.entries(K1)) {
      let w4 = z2;
      if (w4.type === "sdk") $1[PQ] = w4;
      else i1[PQ] = w4
    }
    if (x9("action_mcp_configs_loaded"), AA && AA !== "text" && AA !== "stream-json") console.error(`Error: Invalid input format "${AA}".`), process.exit(1);
    if (AA === "stream-json" && f !== "stream-json") console.error("Error: --input-format=stream-json requires output-format=stream-json."), process.exit(1);
    if (t) {
      if (AA !== "stream-json" || f !== "stream-json") console.error("Error: --sdk-url requires both --input-format=stream-json and --output-format=stream-json."), process.exit(1)
    }
    if (I.replayUserMessages) {
      if (AA !== "stream-json" || f !== "stream-json") console.error("Error: --replay-user-messages requires both --input-format=stream-json and --output-format=stream-json."), process.exit(1)
    }
    if (x) {
      if (!CA || f !== "stream-json") Tl("Error: --include-partial-messages requires --print and --output-format=stream-json."), process.exit(1)
    }
    if (I.sessionPersistence === !1 && !CA) Tl("Error: --no-session-persistence can only be used with --print mode."), process.exit(1);
    let c0 = await Y_7(X || "", AA ?? "text");
    x9("action_after_input_prompt");
    let b0 = F$(t0);
    x9("action_tools_loaded");
    let UA;
    if (w32({
        isNonInteractiveSession: CA
      }) && I.jsonSchema) UA = AQ(I.jsonSchema);
    if (UA) {
      let PQ = xZ1(UA);
      if (PQ) b0 = [...b0, PQ], l("tengu_structured_output_enabled", {
        schema_property_count: Object.keys(UA.properties || {}).length,
        has_required_fields: Boolean(UA.required)
      });
      else l("tengu_structured_output_failure", {
        error: "Invalid JSON schema"
      })
    }
    x9("action_before_setup"), k("[STARTUP] Running setup()...");
    let RA = Date.now();
    await IU1(qy0(), mA, V, zA, ZA, j ? BU(j) : void 0), k(`[STARTUP] setup() completed in ${Date.now()-RA}ms`), x9("action_after_setup");
    let D1 = I.model === "default" ? wu() : I.model,
      U1 = L === "default" ? wu() : L,
      V1 = o1();
    k("[STARTUP] Loading commands and agents...");
    let H1 = Date.now(),
      [Y0, c1] = await Promise.all([Aj(V1), _52(V1)]);
    k(`[STARTUP] Commands and agents loaded in ${Date.now()-H1}ms`), x9("action_commands_loaded");
    let p0 = [];
    if (S) try {
      let PQ = c5(S);
      if (PQ) p0 = NY1(PQ, "flagSettings")
    } catch (PQ) {
      e(PQ instanceof Error ? PQ : Error(String(PQ)))
    }
    let HQ = [...c1.allAgents, ...p0],
      nB = {
        ...c1,
        allAgents: HQ,
        activeAgents: mb(HQ)
      },
      AB = u ?? r3().agent,
      RB;
    if (AB) {
      if (RB = nB.activeAgents.find((PQ) => PQ.agentType === AB), !RB) k(`Warning: agent "${AB}" not found. Available agents: ${nB.activeAgents.map((PQ)=>PQ.agentType).join(", ")}. Using default behavior.`)
    }
    if (Cf0(RB?.agentType), !CA) {
      k("[STARTUP] Running showSetupScreens()...");
      let PQ = Date.now(),
        z2 = await $L9(mA, V, Y0, A1);
      if (k(`[STARTUP] showSetupScreens() completed in ${Date.now()-PQ}ms`), z2 && X?.trim().toLowerCase() === "/login") X = ""
    }
    if (process.exitCode !== void 0) {
      k("Graceful shutdown initiated, skipping further initialization");
      return
    }
    if (!CA) {
      let {
        errors: PQ
      } = kP(), z2 = PQ.filter((w4) => !w4.mcpErrorMetadata);
      if (z2.length > 0) await ZN9(z2)
    }
    prB().catch((PQ) => e(PQ)), AeQ(), _89(), bN9(p2()), MV9();
    let C9 = PF1(i1),
      c2 = VQ === void 0 && (c0 || CA) && !a1(process.env.MCP_CONNECTION_NONBLOCKING) ? await C9 : {
        clients: [],
        tools: [],
        commands: []
      },
      F9 = L0 ? L0 : c2.clients,
      m3 = VQ ? VQ : c2.tools,
      s0 = VQ ? [] : c2.commands,
      u1;
    if (VQ !== void 0) u1 = new buA(F9, m3);
    else if (ue()) u1 = new buA(F9, m3), u1.start().then(({
      url: PQ
    }) => {
      let z2 = u1.getSecret();
      q8A({
        url: PQ,
        key: z2
      }), k(`[MCP CLI Endpoint] Started at ${PQ}`)
    }).catch((PQ) => {
      e(PQ instanceof Error ? PQ : Error(String(PQ)))
    }), C6(async () => {
      await u1?.stop()
    });
    OB("info", "started"), C6(async () => {
      OB("info", "exited")
    }), X_7({
      hasInitialPrompt: Boolean(X),
      hasStdin: Boolean(c0),
      verbose: n,
      debug: D,
      debugToStderr: W,
      print: y ?? !1,
      outputFormat: f ?? "text",
      inputFormat: AA ?? "text",
      numAllowedTools: H.length,
      numDisallowedTools: E.length,
      mcpClientCount: Object.keys(K1).length,
      worktreeEnabled: zA,
      skipWebFetchPreflight: r3().skipWebFetchPreflight,
      githubActionInputs: process.env.GITHUB_ACTION_INPUTS,
      dangerouslySkipPermissionsPassed: K ?? !1,
      modeIsBypass: mA === "bypassPermissions",
      allowDangerouslySkipPermissionsPassed: V,
      systemPromptFlag: FA ? I.systemPromptFile ? "file" : "flag" : void 0,
      appendSystemPromptFlag: xA ? I.appendSystemPromptFile ? "file" : "flag" : void 0
    }), hA9(i1, t0), q71(null, "initialization"), lR7(), nR7(), await E32(), x9("action_after_plugins_init"), fo2();
    let IQ = D1;
    if (!IQ && RB?.model && RB.model !== "inherit") IQ = FX(RB.model);
    if (dAA(IQ), CA) {
      if (f === "stream-json" || f === "json") Of0(!0);
      L8A(), IS0();
      let PQ = jA ? [] : Y0.filter((w4) => w4.type === "prompt" && !w4.disableNonInteractive || w4.type === "local" && w4.supportsNonInteractive),
        z2 = HzA();
      if (z2 = {
          ...z2,
          mcp: {
            ...z2.mcp,
            clients: F9,
            commands: s0,
            tools: m3
          },
          toolPermissionContext: t0
        }, t0.mode === "bypassPermissions" || V) zJ9(t0);
      if (I.sessionPersistence === !1) Jf0(!0);
      kb0(LeQ(M)), hw9(c0, async () => z2, (w4) => {
        let Y6 = z2;
        z2 = w4(z2), dp({
          newState: z2,
          oldState: Y6
        })
      }, PQ, b0, $1, nB.activeAgents, {
        continue: I.continue,
        resume: I.resume,
        verbose: n,
        outputFormat: f,
        jsonSchema: UA,
        permissionPromptToolName: I.permissionPromptTool,
        allowedTools: H,
        maxThinkingTokens: I.maxThinkingTokens,
        maxTurns: I.maxTurns,
        maxBudgetUsd: I.maxBudgetUsd,
        systemPrompt: FA,
        appendSystemPrompt: xA,
        userSpecifiedModel: D1,
        fallbackModel: U1,
        teleport: BA,
        sdkUrl: t,
        replayUserMessages: I.replayUserMessages,
        includePartialMessages: x,
        forkSession: I.forkSession || !1,
        resumeSessionAt: I.resumeSessionAt || void 0,
        rewindFiles: I.rewindFiles,
        enableAuthStatus: I.enableAuthStatus,
        loopy: TA
      });
      return
    }
    let tB = Z_7(!1);
    c$0(), l("tengu_startup_manual_model_config", {
      cli_flag: I.model,
      env_var: process.env.ANTHROPIC_MODEL,
      settings_file: (r3() || {}).model,
      subscriptionType: N6(),
      agent: AB
    });
    let U9 = I.model || process.env.ANTHROPIC_MODEL || r3().model;
    if (qB() && !MR() && U9 !== void 0 && GA1(U9)) {
      let PQ = ju() ? "turn on /extra-usage or " : "";
      console.error(I1.yellow(`Your plan doesn't include Opus in Claude Code. You can ${PQ}/upgrade to Max to access it. The current model is now Sonnet.`))
    }
    vb0(ZA1() || null);
    let V4 = LdA(),
      j6 = FX(V4 ?? wu()),
      z8 = nC1(j6),
      T6 = [];
    if (G1) T6.push({
      key: "permission-mode-notification",
      text: G1,
      priority: "high"
    });
    if (z8) T6.push({
      key: "model-deprecation-warning",
      text: z8,
      color: "warning",
      priority: "high"
    });
    let i8 = q0(),
      Q8 = {
        ...t0,
        mode: t0.mode
      },
      $G = {
        settings: r3(),
        tasks: {},
        verbose: n ?? L1().verbose ?? !1,
        mainLoopModel: V4,
        mainLoopModelForSession: null,
        showExpandedTodos: L1().showExpandedTodos ?? !1,
        showExpandedIPAgents: !1,
        selectedIPAgentIndex: 0,
        toolPermissionContext: Q8,
        agent: RB?.agentType,
        agentDefinitions: nB,
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
          queue: T6
        },
        elicitation: {
          queue: []
        },
        todos: {
          [i8]: Cb(i8)
        },
        fileHistory: {
          snapshots: [],
          trackedFiles: new Set
        },
        attribution: z91(),
        thinkingEnabled: q91(),
        promptSuggestionEnabled: uH1(),
        feedbackSurvey: {
          timeLastShown: null,
          submitCountAtLastAppearance: null
        },
        sessionHooks: {},
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
        speculation: FzA,
        speculationSessionTimeSavedMs: 0,
        promptCoaching: {
          tip: null,
          shownAt: 0
        },
        queuedCommands: [],
        linkedAttachments: [],
        workerPermissions: {
          queue: [],
          selectedIndex: 0
        },
        workerSandboxPermissions: {
          queue: [],
          selectedIndex: 0
        },
        pendingWorkerRequest: null,
        pendingSandboxRequest: null,
        gitDiff: {
          stats: null,
          perFileStats: new Map,
          hunks: new Map,
          lastUpdated: 0
        },
        authVersion: 0,
        initialMessage: c0 ? {
          message: H0({
            content: String(c0)
          })
        } : null,
        teamContext: pR7?.computeInitialTeamContext()
      };
    if (c0) A2A(String(c0));
    let t7 = VQ ? [] : m3;
    if (oR7(), I.continue) try {
      l("tengu_continue", {}), XE1();
      let PQ = await Zt(void 0, void 0);
      if (!PQ) console.error("No conversation found to continue"), process.exit(1);
      if (!I.forkSession) {
        if (PQ.sessionId) pw(lz(PQ.sessionId)), await wj(), NOA(PQ.sessionId)
      }
      let z2 = $G,
        {
          waitUntilExit: w4
        } = await Y5(K3.default.createElement(b5, {
          initialState: z2,
          onChangeAppState: dp
        }, K3.default.createElement(v$A, {
          debug: D || W,
          commands: [...Y0, ...s0],
          initialTools: t7,
          initialMessages: PQ.messages,
          initialFileHistorySnapshots: PQ.fileHistorySnapshots,
          mcpClients: F9,
          dynamicMcpConfig: J1,
          mcpCliEndpoint: u1,
          autoConnectIdeFlag: _,
          strictMcpConfig: S1,
          systemPrompt: FA,
          appendSystemPrompt: xA,
          mainThreadAgentDefinition: RB,
          disableSlashCommands: jA,
          taskListId: IA,
          autoTickIntervalMs: bA
        })), tB);
      await w4(), await w3(0)
    } catch (PQ) {
      e(PQ instanceof Error ? PQ : Error(String(PQ))), process.exit(1)
    } else if (I.resume || BA || DA) {
      XE1();
      let PQ = null,
        z2 = void 0,
        w4 = BU(I.resume),
        Y6 = void 0;
      if (I.resume && typeof I.resume === "string" && !w4) {
        let eB = I.resume.trim();
        if (eB) {
          let L4 = await Q$A(eB, {
            exact: !0
          });
          if (L4.length === 1) w4 = xX(L4[0]) ?? null;
          else Y6 = eB
        }
      }
      if (DA) {
        l("tengu_remote_create_session", {
          description_length: String(DA.length)
        });
        let eB = await iu2(DA, new AbortController().signal);
        if (!eB) l("tengu_remote_create_session_error", {
          error: "unable_to_create_session"
        }), process.stderr.write(I1.red(`Error: Unable to create remote session
`)), await w3(1), process.exit(1);
        l("tengu_remote_create_session_success", {
          session_id: eB.id
        }), process.stdout.write(`Created remote session: ${eB.title}
`), process.stdout.write(`View: https://claude.ai/code/${eB.id}?m=0
`), process.stdout.write(`Resume with: claude --teleport ${eB.id}
`), await w3(0), process.exit(0)
      } else if (BA) {
        if (BA === !0 || BA === "") {
          l("tengu_teleport_interactive_mode", {});
          let eB = await DL9();
          if (!eB) await w3(0), process.exit(0);
          let {
            branchError: L4
          } = await BEA(eB.branch);
          PQ = QEA(eB.log, L4)
        } else if (typeof BA === "string") {
          l("tengu_teleport_resume_session", {
            mode: "direct"
          });
          try {
            let eB = await xkA(BA),
              L4 = await Xq0(eB);
            if (L4.status === "mismatch" || L4.status === "not_in_repo") {
              let B8 = L4.sessionRepo;
              if (B8) {
                let F6 = aw9(B8),
                  cG = ow9(F6);
                if (cG.length > 0) {
                  let P6 = await new Promise(async (pG) => {
                    let {
                      unmount: T3
                    } = await Y5(K3.default.createElement(b5, null, K3.default.createElement(vJ, null, K3.default.createElement(tw9, {
                      targetRepo: B8,
                      initialPaths: cG,
                      onSelectPath: (RY) => {
                        T3(), pG(RY)
                      },
                      onCancel: () => {
                        T3(), pG(null)
                      }
                    }))), FY(!1))
                  });
                  if (P6) process.chdir(P6), DO(P6), Lb0(P6);
                  else await w3(0)
                } else throw new uK(`You must run claude --teleport ${BA} from a checkout of ${B8}.`, I1.red(`You must run claude --teleport ${BA} from a checkout of ${I1.bold(B8)}.
`))
              }
            } else if (L4.status === "error") throw new uK(L4.errorMessage || "Failed to validate session", I1.red(`Error: ${L4.errorMessage||"Failed to validate session"}
`));
            await _K1();
            let L5 = await QL9(BA);
            PdA({
              sessionId: BA
            }), PQ = L5.messages
          } catch (eB) {
            if (eB instanceof uK) process.stderr.write(eB.formattedMessage + `
`);
            else e(eB instanceof Error ? eB : Error(String(eB))), process.stderr.write(I1.red(`Error: ${eB instanceof Error?eB.message:String(eB)}
`));
            await w3(1)
          }
        }
      }
      if (w4) {
        let eB = w4;
        try {
          let L4 = await Zt(eB, void 0);
          if (!L4) console.error(`No conversation found with session ID: ${eB}`), process.exit(1);
          if (PQ = L4.messages, z2 = L4.fileHistorySnapshots, l("tengu_session_resumed", {
              entrypoint: "cli_flag"
            }), !I.forkSession) pw(lz(eB)), await wj(), NOA(eB)
        } catch (L4) {
          e(L4 instanceof Error ? L4 : Error(String(L4))), console.error(`Failed to resume session ${eB}`), process.exit(1)
        }
      }
      if (Array.isArray(PQ)) {
        let {
          waitUntilExit: eB
        } = await Y5(K3.default.createElement(b5, {
          initialState: $G,
          onChangeAppState: dp
        }, K3.default.createElement(v$A, {
          debug: D || W,
          commands: [...Y0, ...s0],
          initialTools: t7,
          initialMessages: PQ,
          initialFileHistorySnapshots: z2,
          mcpClients: F9,
          dynamicMcpConfig: J1,
          mcpCliEndpoint: u1,
          autoConnectIdeFlag: _,
          strictMcpConfig: S1,
          systemPrompt: FA,
          appendSystemPrompt: xA,
          mainThreadAgentDefinition: RB,
          disableSlashCommands: jA,
          taskListId: IA,
          autoTickIntervalMs: bA
        })), tB);
        await eB(), await w3(0)
      } else {
        let eB = await Jk(EQ());
        await Y5(K3.default.createElement(XN9, {
          commands: [...Y0, ...s0],
          debug: D || W,
          worktreePaths: eB,
          initialTools: t7,
          mcpClients: F9,
          dynamicMcpConfig: J1,
          mcpCliEndpoint: u1,
          appState: $G,
          onChangeAppState: dp,
          strictMcpConfig: S1,
          systemPrompt: FA,
          appendSystemPrompt: xA,
          initialSearchQuery: Y6,
          disableSlashCommands: jA,
          forkSession: I.forkSession,
          taskListId: IA
        }), tB)
      }
    } else {
      let PQ = await WU("startup", void 0, RB?.agentType);
      x9("action_after_hooks");
      let {
        waitUntilExit: z2
      } = await Y5(K3.default.createElement(b5, {
        initialState: $G,
        onChangeAppState: dp
      }, K3.default.createElement(v$A, {
        debug: D || W,
        commands: [...Y0, ...s0],
        initialTools: t7,
        initialMessages: PQ,
        mcpClients: F9,
        dynamicMcpConfig: J1,
        autoConnectIdeFlag: _,
        strictMcpConfig: S1,
        systemPrompt: FA,
        appendSystemPrompt: xA,
        mcpCliEndpoint: u1,
        mainThreadAgentDefinition: RB,
        disableSlashCommands: jA,
        taskListId: IA,
        autoTickIntervalMs: bA
      })), tB);
      await z2(), await w3(0)
    }
  }).version(`${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION} (Claude Code)`, "-v, --version", "Output the version number"), Q.addOption(new LK("--sdk-url <url>", "Use remote WebSocket endpoint for SDK I/O streaming (only with -p and stream-json format)").hideHelp()), Q.addOption(new LK("--teleport [session]", "Resume a teleport session, optionally specify session ID").hideHelp()), Q.addOption(new LK("--remote <description>", "Create a remote session with the given description").hideHelp());
  let B = Q.command("mcp").description("Configure and manage MCP servers").helpOption("-h, --help", "Display help for command").configureHelp(A()).enablePositionalOptions();
  B.command("serve").description("Start the Claude Code MCP server").helpOption("-h, --help", "Display help for command").option("-d, --debug", "Enable debug mode", () => !0).option("--verbose", "Override verbose mode setting from config", () => !0).action(async ({
    debug: X,
    verbose: I
  }) => {
    let D = qy0();
    if (l("tengu_mcp_start", {}), !XU1(D)) console.error(`Error: Directory ${D} does not exist`), process.exit(1);
    try {
      await IU1(D, "default", !1, !1, void 0), await WN9(D, X ?? !1, I ?? !1)
    } catch (W) {
      console.error("Error: Failed to start MCP server:", W), process.exit(1)
    }
  }), KL9(B), B.command("remove <name>").description("Remove an MCP server").option("-s, --scope <scope>", "Configuration scope (local, user, or project) - if not specified, removes from whichever scope it exists in").helpOption("-h, --help", "Display help for command").action(async (X, I) => {
    try {
      if (I.scope) {
        let H = z$A(I.scope);
        l("tengu_mcp_delete", {
          name: X,
          scope: H
        }), WL0(X, H), process.stdout.write(`Removed MCP server ${X} from ${H} config
`), process.stdout.write(`File modified: ${N$(H)}
`), process.exit(0)
      }
      let D = JG(),
        W = L1(),
        {
          servers: K
        } = GW("project"),
        V = !!K[X],
        F = [];
      if (D.mcpServers?.[X]) F.push("local");
      if (V) F.push("project");
      if (W.mcpServers?.[X]) F.push("user");
      if (F.length === 0) process.stderr.write(`No MCP server found with name: "${X}"
`), process.exit(1);
      else if (F.length === 1) {
        let H = F[0];
        l("tengu_mcp_delete", {
          name: X,
          scope: H
        }), WL0(X, H), process.stdout.write(`Removed MCP server "${X}" from ${H} config
`), process.stdout.write(`File modified: ${N$(H)}
`), process.exit(0)
      } else process.stderr.write(`MCP server "${X}" exists in multiple scopes:
`), F.forEach((H) => {
        process.stderr.write(`  - ${HgA(H)} (${N$(H)})
`)
      }), process.stderr.write(`
To remove from a specific scope, use:
`), F.forEach((H) => {
        process.stderr.write(`  claude mcp remove "${X}" -s ${H}
`)
      }), process.exit(1)
    } catch (D) {
      process.stderr.write(`${D.message}
`), process.exit(1)
    }
  }), B.command("list").description("List configured MCP servers").helpOption("-h, --help", "Display help for command").action(async () => {
    l("tengu_mcp_list", {});
    let {
      servers: X
    } = await it();
    if (Object.keys(X).length === 0) console.log("No MCP servers configured. Use `claude mcp add` to add a server.");
    else {
      console.log(`Checking MCP server health...
`);
      let I = Object.entries(X),
        D = await DS0(I, async ([W, K]) => ({
          name: W,
          server: K,
          status: await EL9(W, K)
        }), {
          concurrency: HL0()
        });
      for (let {
          name: W,
          server: K,
          status: V
        }
        of D)
        if (K.type === "sse") console.log(`${W}: ${K.url} (SSE) - ${V}`);
        else if (K.type === "http") console.log(`${W}: ${K.url} (HTTP) - ${V}`);
      else if (K.type === "claudeai-proxy") console.log(`${W}: ${K.url} - ${V}`);
      else if (!K.type || K.type === "stdio") {
        let F = Array.isArray(K.args) ? K.args : [];
        console.log(`${W}: ${K.command} ${F.join(" ")} - ${V}`)
      }
    }
    await w3(0)
  }), B.command("get <name>").description("Get details about an MCP server").helpOption("-h, --help", "Display help for command").action(async (X) => {
    l("tengu_mcp_get", {
      name: X
    });
    let I = vs(X);
    if (!I) console.error(`No MCP server found with name: ${X}`), process.exit(1);
    console.log(`${X}:`), console.log(`  Scope: ${HgA(I.scope)}`);
    let D = await EL9(X, I);
    if (console.log(`  Status: ${D}`), I.type === "sse") {
      if (console.log("  Type: sse"), console.log(`  URL: ${I.url}`), I.headers) {
        console.log("  Headers:");
        for (let [W, K] of Object.entries(I.headers)) console.log(`    ${W}: ${K}`)
      }
    } else if (I.type === "http") {
      if (console.log("  Type: http"), console.log(`  URL: ${I.url}`), I.headers) {
        console.log("  Headers:");
        for (let [W, K] of Object.entries(I.headers)) console.log(`    ${W}: ${K}`)
      }
    } else if (I.type === "stdio") {
      console.log("  Type: stdio"), console.log(`  Command: ${I.command}`);
      let W = Array.isArray(I.args) ? I.args : [];
      if (console.log(`  Args: ${W.join(" ")}`), I.env) {
        console.log("  Environment:");
        for (let [K, V] of Object.entries(I.env)) console.log(`    ${K}=${V}`)
      }
    }
    console.log(`
To remove this server, run: claude mcp remove "${X}" -s ${I.scope}`), await w3(0)
  }), B.command("add-json <name> <json>").description("Add an MCP server (stdio or SSE) with a JSON string").option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").helpOption("-h, --help", "Display help for command").action(async (X, I, D) => {
    try {
      let W = z$A(D.scope),
        K = c5(I);
      uf(X, K, W);
      let V = K && typeof K === "object" && "type" in K ? String(K.type || "stdio") : "stdio";
      l("tengu_mcp_add", {
        scope: W,
        source: "json",
        type: V
      }), console.log(`Added ${V} MCP server ${X} to ${W} config`), process.exit(0)
    } catch (W) {
      console.error(W.message), process.exit(1)
    }
  }), B.command("add-from-claude-desktop").description("Import MCP servers from Claude Desktop (Mac and WSL only)").option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").helpOption("-h, --help", "Display help for command").action(async (X) => {
    try {
      let I = z$A(X.scope),
        D = $Q();
      l("tengu_mcp_add", {
        scope: I,
        platform: D,
        source: "desktop"
      });
      let W = xq9();
      if (Object.keys(W).length === 0) console.log("No MCP servers found in Claude Desktop configuration or configuration file does not exist."), process.exit(0);
      let {
        unmount: K
      } = await Y5(K3.default.createElement(b5, null, K3.default.createElement(vJ, null, K3.default.createElement(Tq9, {
        servers: W,
        scope: I,
        onDone: () => {
          K()
        }
      }))), {
        exitOnCtrlC: !0
      })
    } catch (I) {
      console.error(I.message), process.exit(1)
    }
  }), B.command("reset-project-choices").description("Reset all approved and rejected project-scoped (.mcp.json) servers within this project").helpOption("-h, --help", "Display help for command").action(async () => {
    l("tengu_mcp_reset_mcpjson_choices", {}), BZ((X) => ({
      ...X,
      enabledMcpjsonServers: [],
      disabledMcpjsonServers: [],
      enableAllProjectMcpServers: !1
    })), console.log("All project-scoped (.mcp.json) server approvals and rejections have been reset."), console.log("You will be prompted for approval next time you start Claude Code."), process.exit(0)
  });

  function G(X, I) {
    e(X instanceof Error ? X : Error(String(X))), console.error(`${tA.cross} Failed to ${I}: ${X instanceof Error?X.message:String(X)}`), process.exit(1)
  }
  let Z = Q.command("plugin").description("Manage Claude Code plugins").helpOption("-h, --help", "Display help for command").configureHelp(A());
  Z.command("validate <path>").description("Validate a plugin or marketplace manifest").helpOption("-h, --help", "Display help for command").action((X) => {
    try {
      let I = Az1(X);
      if (console.log(`Validating ${I.fileType} manifest: ${I.filePath}
`), I.errors.length > 0) console.log(`${tA.cross} Found ${I.errors.length} error${I.errors.length===1?"":"s"}:
`), I.errors.forEach((D) => {
        console.log(`  ${tA.pointer} ${D.path}: ${D.message}`)
      }), console.log("");
      if (I.warnings.length > 0) console.log(`${tA.warning} Found ${I.warnings.length} warning${I.warnings.length===1?"":"s"}:
`), I.warnings.forEach((D) => {
        console.log(`  ${tA.pointer} ${D.path}: ${D.message}`)
      }), console.log("");
      if (I.success) {
        if (I.warnings.length > 0) console.log(`${tA.tick} Validation passed with warnings`);
        else console.log(`${tA.tick} Validation passed`);
        process.exit(0)
      } else console.log(`${tA.cross} Validation failed`), process.exit(1)
    } catch (I) {
      e(I instanceof Error ? I : Error(String(I))), console.error(`${tA.cross} Unexpected error during validation: ${I instanceof Error?I.message:String(I)}`), process.exit(2)
    }
  });
  let Y = Z.command("marketplace").description("Manage Claude Code marketplaces").helpOption("-h, --help", "Display help for command").configureHelp(A());
  Y.command("add <source>").description("Add a marketplace from a URL, path, or GitHub repo").helpOption("-h, --help", "Display help for command").action(async (X) => {
    try {
      let I = nE1(X);
      if (!I) console.error(`${tA.cross} Invalid marketplace source format. Try: owner/repo, https://..., or ./path`), process.exit(1);
      if ("error" in I) console.error(`${tA.cross} ${I.error}`), process.exit(1);
      let D = I;
      console.log("Adding marketplace...");
      let {
        name: W
      } = await NS(D, (V) => {
        console.log(V)
      });
      NY();
      let K = D.source;
      if (D.source === "github") K = D.repo;
      l("tengu_marketplace_added", {
        source_type: K
      }), console.log(`${tA.tick} Successfully added marketplace: ${W}`), process.exit(0)
    } catch (I) {
      G(I, "add marketplace")
    }
  }), Y.command("list").description("List all configured marketplaces").helpOption("-h, --help", "Display help for command").action(async () => {
    try {
      let X = await D5(),
        I = Object.keys(X);
      if (I.length === 0) console.log("No marketplaces configured"), process.exit(0);
      console.log(`Configured marketplaces:
`), I.forEach((D) => {
        let W = X[D];
        if (console.log(`  ${tA.pointer} ${D}`), W?.source) {
          let K = W.source;
          if (K.source === "github") console.log(`    Source: GitHub (${K.repo})`);
          else if (K.source === "git") console.log(`    Source: Git (${K.url})`);
          else if (K.source === "url") console.log(`    Source: URL (${K.url})`);
          else if (K.source === "directory") console.log(`    Source: Directory (${K.path})`);
          else if (K.source === "file") console.log(`    Source: File (${K.path})`)
        }
        console.log("")
      }), process.exit(0)
    } catch (X) {
      G(X, "list marketplaces")
    }
  }), Y.command("remove <name>").alias("rm").description("Remove a configured marketplace").helpOption("-h, --help", "Display help for command").action(async (X) => {
    try {
      await _Z1(X), NY(), l("tengu_marketplace_removed", {
        marketplace_name: X
      }), console.log(`${tA.tick} Successfully removed marketplace: ${X}`), process.exit(0)
    } catch (I) {
      G(I, "remove marketplace")
    }
  }), Y.command("update [name]").description("Update marketplace(s) from their source - updates all if no name specified").helpOption("-h, --help", "Display help for command").action(async (X) => {
    try {
      if (X) console.log(`Updating marketplace: ${X}...`), await Rr(X, (I) => {
        console.log(I)
      }), NY(), l("tengu_marketplace_updated", {
        marketplace_name: X
      }), console.log(`${tA.tick} Successfully updated marketplace: ${X}`), process.exit(0);
      else {
        let I = await D5(),
          D = Object.keys(I);
        if (D.length === 0) console.log("No marketplaces configured"), process.exit(0);
        console.log(`Updating ${D.length} marketplace(s)...`), await X32(), NY(), l("tengu_marketplace_updated_all", {
          count: D.length
        }), console.log(`${tA.tick} Successfully updated ${D.length} marketplace(s)`), process.exit(0)
      }
    } catch (I) {
      G(I, "update marketplace(s)")
    }
  }), Z.command("install <plugin>").alias("i").description("Install a plugin from available marketplaces (use plugin@marketplace for specific marketplace)").option("-s, --scope <scope>", "Installation scope: user, project, or local", "user").helpOption("-h, --help", "Display help for command").action(async (X, I) => {
    let D = I.scope || "user";
    if (!jU.includes(D)) console.error(`Invalid scope: ${D}. Must be one of: ${jU.join(", ")}.`), process.exit(1);
    l("tengu_plugin_install_command", {
      plugin: X,
      scope: D
    }), await ON9(X, D)
  }), Z.command("uninstall <plugin>").alias("remove").alias("rm").description("Uninstall an installed plugin").option("-s, --scope <scope>", "Uninstall from scope: user, project, or local", "user").helpOption("-h, --help", "Display help for command").action(async (X, I) => {
    let D = I.scope || "user";
    if (!jU.includes(D)) console.error(`Invalid scope: ${D}. Must be one of: ${jU.join(", ")}.`), process.exit(1);
    l("tengu_plugin_uninstall_command", {
      plugin: X,
      scope: D
    }), await MN9(X, D)
  }), Z.command("enable <plugin>").description("Enable a disabled plugin").option("-s, --scope <scope>", `Installation scope: ${jU.join(", ")} (default: user)`).helpOption("-h, --help", "Display help for command").action(async (X, I) => {
    let D = "user";
    if (I.scope) {
      if (!jU.includes(I.scope)) process.stderr.write(`Invalid scope "${I.scope}". Valid scopes: ${jU.join(", ")}
`), process.exit(1);
      D = I.scope
    }
    l("tengu_plugin_enable_command", {
      plugin: X,
      scope: D
    }), await RN9(X, D)
  }), Z.command("disable <plugin>").description("Disable an enabled plugin").option("-s, --scope <scope>", `Installation scope: ${jU.join(", ")} (default: user)`).helpOption("-h, --help", "Display help for command").action(async (X, I) => {
    let D = "user";
    if (I.scope) {
      if (!jU.includes(I.scope)) process.stderr.write(`Invalid scope "${I.scope}". Valid scopes: ${jU.join(", ")}
`), process.exit(1);
      D = I.scope
    }
    l("tengu_plugin_disable_command", {
      plugin: X,
      scope: D
    }), await _N9(X, D)
  }), Z.command("update <plugin>").description("Update a plugin to the latest version (restart required to apply)").option("-s, --scope <scope>", `Installation scope: ${OgA.join(", ")} (default: user)`).helpOption("-h, --help", "Display help for command").action(async (X, I) => {
    l("tengu_plugin_update_command", {});
    let D = "user";
    if (I.scope) {
      if (!OgA.includes(I.scope)) process.stderr.write(`Invalid scope "${I.scope}". Valid scopes: ${OgA.join(", ")}
`), process.exit(1);
      D = I.scope
    }
    await jN9(X, D)
  }), Q.command("setup-token").description("Set up a long-lived authentication token (requires Claude subscription)").helpOption("-h, --help", "Display help for command").action(async () => {
    if (l("tengu_setup_token_command", {}), await sI(), !iq()) process.stderr.write(I1.yellow(`Warning: You already have authentication configured via environment variable or API key helper.
`)), process.stderr.write(I1.yellow(`The setup-token command will create a new OAuth token which you can use instead.
`));
    await new Promise(async (X) => {
      let {
        unmount: I
      } = await Y5(K3.default.createElement(b5, {
        onChangeAppState: dp
      }, K3.default.createElement(T, {
        flexDirection: "column",
        gap: 1
      }, K3.default.createElement(ha, {
        items: [K3.default.createElement(BU1, {
          key: "welcome"
        })]
      }, (D) => D), K3.default.createElement(_s, {
        onDone: () => {
          I(), X()
        },
        mode: "setup-token",
        startingMessage: "This will guide you through long-lived (1-year) auth token setup for your Claude account. Claude subscription required."
      }))))
    }), process.exit(0)
  });

  function J({
    onDone: X
  }) {
    return SC1(), K3.default.createElement(xE1, {
      onDone: X
    })
  }
  return Q.command("doctor").description("Check the health of your Claude Code auto-updater").helpOption("-h, --help", "Display help for command").action(async () => {
    l("tengu_doctor_command", {}), await new Promise(async (X) => {
      let {
        unmount: I
      } = await Y5(K3.default.createElement(b5, null, K3.default.createElement(fE1, {
        dynamicMcpConfig: void 0,
        isStrictMcpConfig: !1
      }, K3.default.createElement(J, {
        onDone: () => {
          I(), X()
        }
      }))), FY(!1))
    }), process.exit(0)
  }), Q.command("update").description("Check for updates and install if available").helpOption("-h, --help", "Display help for command").action(mw9), Q.command("install [target]").description("Install Claude Code native build. Use [target] to specify version (stable, latest, or specific version)").option("--force", "Force installation even if already installed").helpOption("-h, --help", "Display help for command").action(async (X, I) => {
    await IU1(qy0(), "default", !1, !1, void 0), await new Promise((D) => {
      let W = [];
      if (X) W.push(X);
      if (I.force) W.push("--force");
      lw9.call((K) => {
        D(), process.exit(K.includes("failed") ? 1 : 0)
      }, {}, W)
    })
  }), x9("run_before_parse"), await Q.parseAsync(process.argv), x9("run_after_parse"), x9("main_after_run"), Mh0(), Q
}
// @from(Ln 470859, Col 0)
async function X_7({
  hasInitialPrompt: A,
  hasStdin: Q,
  verbose: B,
  debug: G,
  debugToStderr: Z,
  print: Y,
  outputFormat: J,
  inputFormat: X,
  numAllowedTools: I,
  numDisallowedTools: D,
  mcpClientCount: W,
  worktreeEnabled: K,
  skipWebFetchPreflight: V,
  githubActionInputs: F,
  dangerouslySkipPermissionsPassed: H,
  modeIsBypass: E,
  allowDangerouslySkipPermissionsPassed: z,
  systemPromptFlag: $,
  appendSystemPromptFlag: O
}) {
  try {
    let L = await pBB();
    l("tengu_init", {
      entrypoint: "claude",
      hasInitialPrompt: A,
      hasStdin: Q,
      verbose: B,
      debug: G,
      debugToStderr: Z,
      print: Y,
      outputFormat: J,
      inputFormat: X,
      numAllowedTools: I,
      numDisallowedTools: D,
      mcpClientCount: W,
      worktree: K,
      skipWebFetchPreflight: V,
      ...F && {
        githubActionInputs: F
      },
      dangerouslySkipPermissionsPassed: H,
      modeIsBypass: E,
      allowDangerouslySkipPermissionsPassed: z,
      ...$ && {
        systemPromptFlag: $
      },
      ...O && {
        appendSystemPromptFlag: O
      },
      ...L && {
        rh: L
      }
    })
  } catch (L) {
    e(L instanceof Error ? L : Error(String(L)))
  }
}
// @from(Ln 470918, Col 0)
function I_7() {
  (process.stderr.isTTY ? process.stderr : process.stdout.isTTY ? process.stdout : void 0)?.write(TP)
}
// @from(Ln 470921, Col 4)
K3
// @from(Ln 470921, Col 8)
pR7 = null
// @from(Ln 470922, Col 4)
UL9 = w(() => {
  aAA();
  A0();
  tQ();
  Vm();
  DI9();
  $I9();
  w6();
  UI9();
  p3();
  G0A();
  fuA();
  MT0();
  LI9();
  RI9();
  GM0();
  xI9();
  cC();
  vhA();
  RpA();
  vI9();
  A0();
  Kf();
  fA();
  mx0();
  OS();
  wz1();
  uP0();
  az();
  Pr();
  Z3();
  Pq9();
  yq9();
  QA1();
  iFA();
  A$A();
  c3();
  GQ();
  Q2();
  gOA();
  sVA();
  bB0();
  v1();
  d4();
  IS();
  d4();
  gq9();
  Bc();
  RkA();
  uR0();
  Kx0();
  px0();
  GN9();
  RR0();
  YN9();
  nz();
  l2();
  hx0();
  GB();
  JN9();
  IN9();
  KN9();
  kT0();
  fQ();
  WV();
  _S();
  mbA();
  LN9();
  L_0();
  HI();
  Lx();
  W_0();
  TN9();
  PN();
  Lx();
  B2();
  yN9();
  nT0();
  Se();
  ZI();
  C0();
  fN9();
  vI();
  d_();
  qS0();
  d4();
  iZ();
  KbA();
  pN9();
  BI();
  eN9();
  Yw9();
  Z0();
  Qx0();
  lBA();
  bc();
  xx();
  Xd();
  Jw9();
  Oa();
  mL();
  Iw9();
  Ww9();
  jN();
  ys();
  uy();
  eHA();
  DE1();
  Gt();
  LR();
  fx0();
  Vb();
  Ou();
  C0();
  hB();
  Hp();
  Kw9();
  Dd();
  OVA();
  C0();
  RR();
  GK();
  ms();
  T1();
  Fw9();
  Ew9();
  $w9();
  Uw9();
  Nw9();
  Lw9();
  Mw9();
  Y8A();
  uw9();
  dw9();
  cw9();
  zgA();
  UF();
  t4();
  iw9();
  Jt();
  zf();
  zy0();
  ew9();
  BL9();
  WL9();
  Y_();
  hhA();
  yJ();
  nX();
  XX();
  G$();
  PJ();
  VL9();
  Ox();
  VY0();
  DQ();
  Vb();
  V2();
  fz1();
  Ux0();
  B2A();
  YI();
  lx0();
  Y8A();
  oc();
  NJ();
  QS0();
  $F();
  $$A();
  PL();
  FL9();
  K3 = c(QA(), 1);
  x9("main_tsx_entry");
  x9("main_tsx_imports_loaded");
  if (aR7()) process.exit(1)
})
// @from(Ln 471126, Col 4)
oP0
// @from(Ln 471126, Col 9)
pX9 = !1
// @from(Ln 471128, Col 0)
function lX9() {
  if (oP0 === void 0) oP0 = cX9();
  return oP0
}
// @from(Ln 471133, Col 0)
function P$() {
  let A = ue(),
    Q = lX9();
  if (!pX9) {
    if (pX9 = !0, A && Q === null) {
      let B = S$1(),
        G = H$A();
      console.error(I1.yellow(`Warning: MCP endpoint file not found at ${B} (session: ${G}). Falling back to state file.`))
    }
  }
  return A && Q !== null
}
// @from(Ln 471145, Col 0)
class yuA extends Error {
  constructor(A) {
    super(A);
    this.name = "ConnectionFailedError"
  }
}
// @from(Ln 471151, Col 0)
async function vuA(A, Q, B, G) {
  let Z = Date.now();
  try {
    let Y = await Q();
    if (!P$()) {
      let J = typeof B === "function" ? B(Y) : B || {};
      await kl("tengu_mcp_cli_command_executed", {
        command: A,
        success: !0,
        duration_ms: Date.now() - Z,
        ...J
      })
    }
    return {
      success: !0,
      data: Y
    }
  } catch (Y) {
    let J = Y instanceof Error ? Y : Error(String(Y));
    if (console.error(I1.red("Error:"), J.message), !P$()) {
      let X = typeof B === "object" ? B : {};
      await kl("tengu_mcp_cli_command_executed", {
        command: A,
        success: !1,
        error_type: J.constructor.name,
        duration_ms: Date.now() - Z,
        ...X,
        ...G
      })
    }
    return {
      success: !1,
      error: J
    }
  }
}
// @from(Ln 471188, Col 0)
function me() {
  let A = U$1();
  if (!CU7(A)) {
    let Q = H$A();
    throw Error(`MCP state file not found at ${A} (session: ${Q}). Is Claude Code running?`)
  }
  try {
    return AQ($U7(A, "utf-8"))
  } catch (Q) {
    throw Error(`Error reading MCP state file ${A}: ${Q instanceof Error?Q.message:String(Q)}`)
  }
}
// @from(Ln 471201, Col 0)
function iX9(A, Q) {
  if (A.configs?.[Q]) return A.configs[Q];
  let B = A.normalizedNames?.[Q];
  if (B && A.configs?.[B]) return A.configs[B];
  return
}
// @from(Ln 471208, Col 0)
function UU7(A, Q) {
  if (A.resources?.[Q]) return A.resources[Q];
  let B = A.normalizedNames?.[Q];
  if (B && A.resources?.[B]) return A.resources[B];
  return []
}
// @from(Ln 471215, Col 0)
function rP0(A) {
  let Q = A.split("/");
  if (Q.length !== 2 || !Q[0] || !Q[1]) throw Error(`Invalid tool identifier '${A}'. Expected format: <server>/<tool>`);
  return {
    server: Q[0],
    tool: Q[1]
  }
}
// @from(Ln 471223, Col 0)
async function w8A(A, Q, B = 1e4) {
  let G = lX9();
  if (!G) throw Error("MCP CLI endpoint not enabled");
  try {
    let Z = await xQ({
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
      let Y = m.object({
          error: m.string().optional(),
          type: m.string().optional()
        }).safeParse(Z.data),
        J = Y.success ? Y.data : {},
        X = Error(J.error || `HTTP ${Z.status}: ${Z.statusText}`);
      if (J.type) X.name = J.type;
      throw X
    }
    return A.parse(Z.data)
  } catch (Z) {
    if (xQ.isAxiosError(Z)) {
      if (Z.code === "ECONNREFUSED") throw Error("Connection refused - is the MCP endpoint running?");
      if (Z.code === "ETIMEDOUT" || Z.message.includes("timeout")) throw Error("Request timeout");
      if (Z.message.startsWith("HTTP ")) throw Z;
      throw Error(`Network error: ${Z.message}`)
    }
    throw Z
  }
}
// @from(Ln 471259, Col 4)
de = new O$1().name("mcp-cli").description("Interact with MCP servers and tools").version("1.0.0")
// @from(Ln 471338, Col 0)
async function qU7(A, Q, B, G) {
  let Z = me(),
    Y = iX9(Z, Q);
  if (!Y) throw Error(`Server '${Q}' not found`);
  if (G.debug) console.error(`Connecting to ${Q} (${Y.type})...`);
  let J = await C3A(Q, Y);
  if (J.client.type !== "connected") throw N8A(Q, J.client.type) ?? new yuA(`Failed to connect to server '${Q}'`);
  let X = (() => {
    let K = `mcp__${e3(Q)}__${e3(A)}`;
    return Z.tools.find((F) => F.name === K)?.originalToolName || A
  })();
  if (G.debug) console.error(`Calling tool ${X}...`);
  let I = parseInt(G.timeout || "", 10) || U3A(),
    D = await J.client.client.request({
      method: "tools/call",
      params: {
        name: X,
        arguments: B
      }
    }, iC, {
      signal: AbortSignal.timeout(I)
    });
  return J.client.client.close(), D
}
// @from(Ln 471476, Col 0)
async function NU7(A, Q, B) {
  let G = me(),
    Z = iX9(G, A);
  if (!Z) throw Error(`Server '${A}' not found`);
  if (B.debug) console.error(`Connecting to ${A} (${Z.type})...`);
  let Y = await C3A(A, Z);
  if (Y.client.type !== "connected") throw N8A(A, Y.client.type) ?? new yuA(`Failed to connect to server '${A}'`);
  if (B.debug) console.error(`Reading resource: ${Q}`);
  let J = parseInt(B.timeout || "", 10) || U3A(),
    X = await Y.client.client.readResource({
      uri: Q
    }, {
      signal: AbortSignal.timeout(J)
    });
  return Y.client.client.close(), X
}
// @from(Ln 471548, Col 0)
async function nX9(A) {
  if (nOA(), !P$()) Ru();
  try {
    if (await de.parseAsync(A, {
        from: "user"
      }), !P$()) await (await Ru())?.flush();
    return 0
  } catch (Q) {
    if (console.error(I1.red("Error:"), Q), !P$()) await (await Ru())?.flush();
    return 1
  }
}
// @from(Ln 471567, Col 4)
wU7 = "https://claude.ai/chrome"
// @from(Ln 471568, Col 2)
LU7 = "https://github.com/anthropics/claude-code/issues/new?labels=bug,claude-in-chrome"
// @from(Ln 471569, Col 0)
async function oX9() {
  let A = new rX9,
    Q = {
      serverName: "Claude in Chrome",
      logger: A,
      socketPath: sfA(),
      clientTypeId: "claude-code",
      onAuthenticationError: () => {
        A.warn("Authentication error occurred. Please ensure you are logged into the Claude browser extension.")
      },
      onToolCallDisconnected: () => {
        return `Browser extension is not connected. Please ensure the Claude browser extension is installed and running (${wU7}). If this is your first time connecting to Chrome, you may need to restart Chrome for the installation to take effect. If you continue to experience issues, please report a bug: ${LU7}`
      }
    },
    B = PT0(Q),
    G = new kuA;
  k("[Claude in Chrome] Starting MCP server"), await B.connect(G), k("[Claude in Chrome] MCP server started")
}
// @from(Ln 471587, Col 0)
class rX9 {
  debug(A, ...Q) {
    k(x$1(A, ...Q), {
      level: "debug"
    })
  }
  info(A, ...Q) {
    k(x$1(A, ...Q), {
      level: "info"
    })
  }
  warn(A, ...Q) {
    k(x$1(A, ...Q), {
      level: "warn"
    })
  }
  error(A, ...Q) {
    k(x$1(A, ...Q), {
      level: "error"
    })
  }
}
// @from(Ln 471624, Col 4)
jU7 = "1.0.0"
// @from(Ln 471625, Col 2)
eP0 = 1048576
// @from(Ln 471626, Col 2)
eX9 = void 0
// @from(Ln 471628, Col 0)
function FW(A, ...Q) {
  if (eX9) {
    let B = new Date().toISOString(),
      G = Q.length > 0 ? " " + eA(Q) : "",
      Z = `[${B}] [Claude Chrome Native Host] ${A}${G}
`;
    try {
      _U7(eX9, Z)
    } catch {}
  }
  console.error(`[Claude Chrome Native Host] ${A}`, ...Q)
}
// @from(Ln 471641, Col 0)
function C$A(A) {
  let Q = Buffer.from(A, "utf-8"),
    B = Buffer.alloc(4);
  B.writeUInt32LE(Q.length, 0), process.stdout.write(B), process.stdout.write(Q)
}
// @from(Ln 471646, Col 0)
async function AI9() {
  FW("Initializing...");
  let A = new QI9,
    Q = new BI9;
  await A.start();
  while (!0) {
    let B = await Q.read();
    if (B === null) break;
    await A.handleMessage(B)
  }
  await A.stop()
}
// @from(Ln 471658, Col 0)
class QI9 {
  mcpClients = new Map;
  nextClientId = 1;
  server = null;
  running = !1;
  async start() {
    if (this.running) return;
    let A = sfA();
    if (FW(`Creating socket listener: ${A}`), tP0() !== "win32" && sX9(A)) try {
      if (RU7(A).isSocket()) tX9(A)
    } catch {}
    this.server = OU7((Q) => this.handleMcpClient(Q)), await new Promise((Q, B) => {
      this.server.listen(A, () => {
        if (FW("Socket server listening for connections"), tP0() !== "win32") try {
          MU7(A, 384), FW("Socket permissions set to 0600")
        } catch (G) {
          FW("Failed to set socket permissions:", G)
        }
        this.running = !0, Q()
      }), this.server.on("error", (G) => {
        FW("Socket server error:", G), B(G)
      })
    })
  }
  async stop() {
    if (!this.running) return;
    for (let [, Q] of this.mcpClients) Q.socket.destroy();
    if (this.mcpClients.clear(), this.server) await new Promise((Q) => {
      this.server.close(() => Q())
    }), this.server = null;
    let A = sfA();
    if (tP0() !== "win32" && sX9(A)) try {
      tX9(A), FW("Cleaned up socket file")
    } catch {}
    this.running = !1
  }
  async isRunning() {
    return this.running
  }
  async getClientCount() {
    return this.mcpClients.size
  }
  async handleMessage(A) {
    let Q = AQ(A);
    switch (FW(`Handling Chrome message type: ${Q.type}`), Q.type) {
      case "ping":
        FW("Responding to ping"), C$A(eA({
          type: "pong",
          timestamp: Date.now()
        }));
        break;
      case "get_status":
        C$A(eA({
          type: "status_response",
          native_host_version: jU7
        }));
        break;
      case "tool_response": {
        if (this.mcpClients.size > 0) {
          FW(`Forwarding tool response to ${this.mcpClients.size} MCP clients`);
          let {
            type: B,
            ...G
          } = Q, Z = Buffer.from(eA(G), "utf-8"), Y = Buffer.alloc(4);
          Y.writeUInt32LE(Z.length, 0);
          let J = Buffer.concat([Y, Z]);
          for (let [X, I] of this.mcpClients) try {
            I.socket.write(J)
          } catch (D) {
            FW(`Failed to send to MCP client ${X}:`, D)
          }
        }
        break
      }
      case "notification": {
        if (this.mcpClients.size > 0) {
          FW(`Forwarding notification to ${this.mcpClients.size} MCP clients`);
          let {
            type: B,
            ...G
          } = Q, Z = Buffer.from(eA(G), "utf-8"), Y = Buffer.alloc(4);
          Y.writeUInt32LE(Z.length, 0);
          let J = Buffer.concat([Y, Z]);
          for (let [X, I] of this.mcpClients) try {
            I.socket.write(J)
          } catch (D) {
            FW(`Failed to send notification to MCP client ${X}:`, D)
          }
        }
        break
      }
      default:
        FW(`Unknown message type: ${Q.type}`), C$A(eA({
          type: "error",
          error: `Unknown message type: ${Q.type}`
        }))
    }
  }
  handleMcpClient(A) {
    let Q = this.nextClientId++,
      B = {
        id: Q,
        socket: A,
        buffer: Buffer.alloc(0)
      };
    this.mcpClients.set(Q, B), FW(`MCP client ${Q} connected. Total clients: ${this.mcpClients.size}`), C$A(eA({
      type: "mcp_connected"
    })), A.on("data", (G) => {
      B.buffer = Buffer.concat([B.buffer, G]);
      while (B.buffer.length >= 4) {
        let Z = B.buffer.readUInt32LE(0);
        if (Z === 0 || Z > eP0) {
          FW(`Invalid message length from MCP client ${Q}: ${Z}`), A.destroy();
          return
        }
        if (B.buffer.length < 4 + Z) break;
        let Y = B.buffer.slice(4, 4 + Z);
        B.buffer = B.buffer.slice(4 + Z);
        try {
          let J = AQ(Y.toString("utf-8"));
          FW(`Forwarding tool request from MCP client ${Q}: ${J.method}`), C$A(eA({
            type: "tool_request",
            method: J.method,
            params: J.params
          }))
        } catch (J) {
          FW(`Failed to parse tool request from MCP client ${Q}:`, J)
        }
      }
    }), A.on("error", (G) => {
      FW(`MCP client ${Q} error: ${G}`)
    }), A.on("close", () => {
      FW(`MCP client ${Q} disconnected. Remaining clients: ${this.mcpClients.size-1}`), this.mcpClients.delete(Q), C$A(eA({
        type: "mcp_disconnected"
      }))
    })
  }
}
// @from(Ln 471796, Col 0)
class BI9 {
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
    if (A === 0 || A > eP0) {
      FW(`Invalid message length: ${A}`), this.pendingResolve(null), this.pendingResolve = null;
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
      if (A > 0 && A <= eP0 && this.buffer.length >= 4 + A) {
        let Q = this.buffer.subarray(4, 4 + A);
        return this.buffer = this.buffer.subarray(4 + A), Q.toString("utf-8")
      }
    }
    return new Promise((A) => {
      this.pendingResolve = A, this.tryProcessMessage()
    })
  }
}
// @from(Ln 471849, Col 0)
async function D_7() {
  let A = process.argv.slice(2);
  if (A.length === 1 && (A[0] === "--version" || A[0] === "-v" || A[0] === "-V")) {
    x9("cli_version_fast_path"), console.log(`${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION} (Claude Code)`);
    return
  }
  if (A[0] === "--mcp-cli" && jJ()) {
    let B = A.slice(1);
    process.exit(await nX9(B))
  }
  if (A[0] === "--ripgrep") {
    x9("cli_ripgrep_path");
    let B = A.slice(1),
      {
        ripgrepMain: G
      } = await Promise.resolve().then(() => (ZI9(), GI9));
    process.exitCode = G(B);
    return
  }
  if (process.argv[2] === "--claude-in-chrome-mcp") {
    x9("cli_claude_in_chrome_mcp_path"), await oX9();
    return
  } else if (process.argv[2] === "--chrome-native-host") {
    x9("cli_chrome_native_host_path"), await AI9();
    return
  }
  x9("cli_before_main_import");
  let {
    main: Q
  } = await Promise.resolve().then(() => (UL9(), CL9));
  x9("cli_after_main_import"), await Q(), x9("cli_after_main_complete")
}