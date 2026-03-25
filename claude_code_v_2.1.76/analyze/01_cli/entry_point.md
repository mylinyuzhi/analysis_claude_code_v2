# CLI Entry Point Analysis - Claude Code v2.1.76

> Deep analysis of the CLI entry point and Commander.js setup in chunks.198.mjs.
>
> **Source**: `chunks.198.mjs` (lines 3-500+)

---

## Main Entry Function: `run` (OVz)

```javascript
// ============================================
// run (OVz) - Main CLI entry point with Commander.js setup
// Location: chunks.198.mjs:3-500
// ============================================

// ORIGINAL (for source lookup):
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
    // ... Commander.js setup with 50+ flags
}

// READABLE (for understanding):
async function run() {
    trackFunctionStart("run_function_start");

    // Helper for option sorting
    function createHelpConfiguration() {
        let getOptionName = (option) =>
            option.long?.replace(/^--/, "") ??
            option.short?.replace(/^-/, "") ?? "";
        return Object.assign({
            sortSubcommands: true,
            sortOptions: true
        }, {
            compareOptions: (a, b) => getOptionName(a).localeCompare(getOptionName(b))
        });
    }

    // Create Commander program
    let program = new Command()
        .configureHelp(createHelpConfiguration())
        .enablePositionalOptions();

    // ... rest of setup
}

// Mapping: OVz→run, fkq→Command, Zq→trackFunctionStart, A→createHelpConfiguration
```

---

## preAction Hook

The `preAction` hook runs before the main action handler:

```javascript
// ============================================
// preAction Hook - Initialization sequence
// Location: chunks.198.mjs:16-24
// ============================================

// ORIGINAL (for source lookup):
q.hook("preAction", async (w) => {
    Zq("preAction_start"), await Wvq(), Zq("preAction_after_mdm"),
    await rVq(), Zq("preAction_after_init");
    let {
        initializeErrorLogSink: O
    } = await Promise.resolve().then(() => (WC1(), do8));
    O(), o_6(), Zq("preAction_after_sinks");
    let $ = w.getOptionValue("pluginDir");
    if (Array.isArray($) && $.length > 0 && $.every((H) => typeof H === "string"))
        xu1($), XZ("preAction: --plugin-dir inline plugins");
    eNz(), Zq("preAction_after_migrations"),
    jV4(), IR8(), Zq("preAction_after_remote_settings"),
    Zq("preAction_after_settings_sync")
})

// READABLE (for understanding):
program.hook("preAction", async (command) => {
    trackFunctionStart("preAction_start");

    // 1. Initialize MDM (Multi-Device Management)
    await initializeMdm();
    trackFunctionStart("preAction_after_mdm");

    // 2. Run initialization routines
    await runInitializers();
    trackFunctionStart("preAction_after_init");

    // 3. Set up error logging sink
    let { initializeErrorLogSink } = await import("./error-sink");
    initializeErrorLogSink();
    initializeOutputSink();
    trackFunctionStart("preAction_after_sinks");

    // 4. Load inline plugins from --plugin-dir
    let pluginDirs = command.getOptionValue("pluginDir");
    if (Array.isArray(pluginDirs) && pluginDirs.length > 0) {
        registerInlinePlugins(pluginDirs);
        debugLog("preAction: --plugin-dir inline plugins");
    }

    // 5. Run migrations and sync settings
    runMigrations();
    trackFunctionStart("preAction_after_migrations");

    syncSettingsFromProject();
    syncRemoteSettings();
    trackFunctionStart("preAction_after_remote_settings");
    trackFunctionStart("preAction_after_settings_sync");
});

// Mapping: Wvq→initializeMdm, rVq→runInitializers, xu1→registerInlinePlugins,
//   eNz→runMigrations, jV4→syncSettingsFromProject, IR8→syncRemoteSettings
```

### preAction Initialization Sequence

```
preAction_start
      │
      ▼
initializeMdm() ─────────────────────► preAction_after_mdm
      │
      ▼
runInitializers() ──────────────────► preAction_after_init
      │
      ▼
initializeErrorLogSink() ───────────► preAction_after_sinks
      │
      ▼
registerInlinePlugins() ────────────► (inline plugins loaded)
      │
      ▼
runMigrations() ────────────────────► preAction_after_migrations
      │
      ▼
syncSettingsFromProject() ──────────► preAction_after_remote_settings
      │
      ▼
syncRemoteSettings() ───────────────► preAction_after_settings_sync
```

---

## Complete CLI Flags Reference

### Input/Output Flags

```javascript
// ============================================
// I/O Flags - Print mode, input/output format
// Location: chunks.198.mjs:25-40
// ============================================

// ORIGINAL:
.option("-p, --print", "Print response and exit...", () => !0)
.addOption(new VK("--output-format <format>", '...').choices(["text", "json", "stream-json"]))
.addOption(new VK("--json-schema <schema>", '...').argParser(String))
.option("--include-partial-messages", "...", () => !0)
.addOption(new VK("--input-format <format>", '...').choices(["text", "stream-json"]))

// READABLE:
.option("-p, --print", "Print response and exit (useful for pipes). Note: The workspace trust dialog is skipped when Claude is run with the -p mode. Only use this flag in directories you trust.", () => true)
.addOption(new Option("--output-format <format>", 'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)').choices(["text", "json", "stream-json"]))
.addOption(new Option("--json-schema <schema>", 'JSON Schema for structured output validation').argParser(String))
.option("--include-partial-messages", "Include partial message chunks as they arrive", () => true)
.addOption(new Option("--input-format <format>", 'Input format (only works with --print): "text" (default), or "stream-json" (realtime streaming input)').choices(["text", "stream-json"]))
```

### Debug Flags

```javascript
// ============================================
// Debug Flags - Logging and debugging
// Location: chunks.198.mjs:25-28
// ============================================

// ORIGINAL:
.option("-d, --debug [filter]", '...', (w) => { return !0 })
.addOption(new VK("-d2e, --debug-to-stderr", "...").argParser(Boolean).hideHelp())
.option("--debug-file <path>", "...", () => !0)
.option("--verbose", "...", () => !0)
.option("--mcp-debug", "[DEPRECATED. Use --debug instead]...", () => !0)

// READABLE:
.option("-d, --debug [filter]", 'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!1p,!file")', () => true)
.addOption(new Option("-d2e, --debug-to-stderr", "Enable debug mode (to stderr)").argParser(Boolean).hideHelp())
.option("--debug-file <path>", "Write debug logs to a specific file path", () => true)
.option("--verbose", "Override verbose mode setting from config", () => true)
.option("--mcp-debug", "[DEPRECATED. Use --debug instead] Enable MCP debug mode", () => true)
```

### Permission Flags

```javascript
// ============================================
// Permission Flags - Security and access control
// Location: chunks.198.mjs:31-35
// ============================================

// ORIGINAL:
.option("--dangerously-skip-permissions", "...", () => !0)
.option("--allow-dangerously-skip-permissions", "...", () => !0)
.option("--allowedTools, --allowed-tools <tools...>", '...')
.option("--tools <tools...>", '...')
.option("--disallowedTools, --disallowed-tools <tools...>", '...')
.addOption(new VK("--permission-mode <mode>", "...").argParser(String).choices(CW))

// READABLE:
.option("--dangerously-skip-permissions", "Bypass all permission checks. Recommended only for sandboxes with no internet access.", () => true)
.option("--allow-dangerously-skip-permissions", "Enable bypassing all permission checks as an option", () => true)
.option("--allowedTools, --allowed-tools <tools...>", 'Comma or space-separated list of tool names to allow (e.g., "Bash(git:*) Edit")')
.option("--tools <tools...>", 'Specify the list of available tools. Use "" to disable all, "default" for all, or specify tool names')
.option("--disallowedTools, --disallowed-tools <tools...>", 'Comma or space-separated list of tool names to deny')
.addOption(new Option("--permission-mode <mode>", "Permission mode").argParser(String).choices(["accept", "plan", "auto", "dontAsk"]))
```

### Session Flags

```javascript
// ============================================
// Session Flags - Conversation management
// Location: chunks.198.mjs:36-40
// ============================================

// ORIGINAL:
.option("-c, --continue", "...", () => !0)
.option("-r, --resume [value]", "...", (w) => w || !0)
.option("--fork-session", "...", () => !0)
.addOption(new VK("--prefill <text>", "...").hideHelp())
.option("--session-id <uuid>", "...")
.option("-n, --name <name>", "...")

// READABLE:
.option("-c, --continue", "Continue the most recent conversation in the current directory", () => true)
.option("-r, --resume [value]", "Resume a conversation by session ID, or open interactive picker", (v) => v || true)
.option("--fork-session", "When resuming, create a new session ID instead of reusing the original", () => true)
.addOption(new Option("--prefill <text>", "Pre-fill the prompt input without submitting").hideHelp())
.option("--session-id <uuid>", "Use a specific session ID for the conversation (must be a valid UUID)")
.option("-n, --name <name>", "Set a display name for this session (shown in /resume and terminal title)")
```

### Model/Agent Flags

```javascript
// ============================================
// Model/Agent Flags - AI configuration
// Location: chunks.198.mjs:41-45
// ============================================

// ORIGINAL:
.option("--model <model>", "...")
.addOption(new VK("--effort <level>", "...").argParser((w) => {
    let O = w.toLowerCase(), $ = ["low", "medium", "high", "max"];
    if (!$.includes(O)) throw new Gkq(`It must be one of: ${$.join(", ")}`);
    return O
}))
.option("--agent <agent>", "...")
.option("--betas <betas...>", "...")
.option("--fallback-model <model>", "...")

// READABLE:
.option("--model <model>", "Model for the current session (sonnet, opus, claude-sonnet-4-6)")
.addOption(new Option("--effort <level>", "Effort level (low, medium, high, max)")
    .argParser((v) => {
        let lower = v.toLowerCase();
        let valid = ["low", "medium", "high", "max"];
        if (!valid.includes(lower)) throw new InvalidArgumentError(`It must be one of: ${valid.join(", ")}`);
        return lower;
    }))
.option("--agent <agent>", "Agent for the current session. Overrides the 'agent' setting.")
.option("--betas <betas...>", "Beta headers to include in API requests (API key users only)")
.option("--fallback-model <model>", "Enable automatic fallback when default model is overloaded")
```

---

## Action Handler

```javascript
// ============================================
// Action Handler - Main execution after parsing
// Location: chunks.198.mjs:36-500
// ============================================

// ORIGINAL (for source lookup):
.action(async (w, O) => {
    if (Zq("action_handler_start"), w === "code")
        d("tengu_code_prompt_ignored", {}),
        console.warn(O1.yellow("Tip: You can launch Claude Code with just `claude`")),
        w = void 0;
    // ... extensive option processing ...

    let L6 = q7();  // isNonInteractive
    // ... mode-specific initialization ...

    if (!L6) {
        // Interactive mode - render REPL
        let { createRoot: zA } = await Promise.resolve().then(() => (i6(), pu6));
        MK = await zA(renderOptions);
        // ... show setup screens ...
    }
    // ... headless mode handled separately ...
})

// READABLE (for understanding):
.action(async (prompt, options) => {
    trackFunctionStart("action_handler_start");

    // Handle legacy "code" argument
    if (prompt === "code") {
        trackEvent("tengu_code_prompt_ignored", {});
        console.warn(chalk.yellow("Tip: You can launch Claude Code with just `claude`"));
        prompt = undefined;
    }

    // Extract options
    let {
        debug = false,
        debugToStderr = false,
        dangerouslySkipPermissions,
        allowDangerouslySkipPermissions = false,
        tools = [],
        allowedTools = [],
        disallowedTools = [],
        mcpConfig = [],
        permissionMode,
        addDir = [],
        fallbackModel,
        betas = [],
        ide = false,
        sessionId,
        includePartialMessages
    } = options;

    // Determine mode
    let isNonInteractive = checkNonInteractive();

    // Build permission context
    let { toolPermissionContext, warnings } = await buildPermissionContext({
        allowedToolsCli: allowedTools,
        disallowedToolsCli: disallowedTools,
        baseToolsCli: tools,
        permissionMode,
        allowDangerouslySkipPermissions,
        addDirs: addDir
    });

    // Branch based on mode
    if (!isNonInteractive) {
        // Interactive REPL mode
        let { createRoot } = await import("ink");
        let root = await createRoot(renderOptions);
        await showSetupScreens(root, permissionMode);
        // ... continue with REPL ...
    } else {
        // Print/SDK mode - run headless
        await runHeadless(options);
    }
});

// Mapping: w→prompt, O→options, q7→isNonInteractive, d→trackEvent,
//   O1→chalk, Zq→trackFunctionStart
```

---

## Mode Detection Logic

```javascript
// ============================================
// Mode Detection - Determine execution mode
// Location: chunks.198.mjs:108-115, chunks.1.mjs:2720-2726
// ============================================

// ORIGINAL (for source lookup):
// In action handler:
let $6 = O.sdkUrl ?? void 0,
    n = h || t6(process.env.CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES);
if ($6) {
    if (!B) B = "stream-json";
    if (!g) g = "stream-json";
    if (O.verbose === void 0) b = !0;
    if (!O.print) p = !0
}
// ...
let L6 = q7();  // isNonInteractive

// Helper functions in chunks.1.mjs:
function q7() { return !v1.isInteractive }  // isNonInteractive
function DW() { return v1.isInteractive }    // isInteractive

// READABLE (for understanding):
let sdkUrl = options.sdkUrl ?? undefined;
let includePartialMessages = options.includePartialMessages ||
    parseBoolean(process.env.CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES);

// SDK mode auto-configuration
if (sdkUrl) {
    if (!inputFormat) inputFormat = "stream-json";
    if (!outputFormat) outputFormat = "stream-json";
    if (options.verbose === undefined) verbose = true;
    if (!options.print) print = true;  // SDK mode implies print
}

let isNonInteractive = checkNonInteractive();  // Returns !isInteractive flag

// Mode determination:
// 1. SDK mode: sdkUrl is set → runHeadless with stream I/O
// 2. Print mode: --print flag → runHeadless with text I/O
// 3. Interactive: neither → render REPL component

// Mapping: $6→sdkUrl, n→includePartialMessages, L6→isNonInteractive,
//   B→inputFormat, g→outputFormat, b→verbose, p→print
```

---

## Source References

| Component | File | Key Functions |
|-----------|------|---------------|
| Entry Point | chunks.198.mjs | `run` (OVz), action handler |
| Main Entry | chunks.197.mjs | `mainEntry` (_Vz) |
| Headless | chunks.187.mjs | `runHeadless` (BXz), `initializeSession` (FXz) |
| State | chunks.1.mjs | `isNonInteractive` (q7), `isInteractive` (DW) |

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76