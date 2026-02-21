# Status Line Feature — Deep Reverse Engineering Analysis

> **Version:** Claude Code 2.1.38
> **Feature:** `/statusline` slash command + `statusline-setup` subagent + runtime UI component
> **Key files:** `chunks.167.mjs`, `chunks.90.mjs`, `chunks.142.mjs`, `chunks.183.mjs`, `chunks.141.mjs`, `chunks.184.mjs`, `chunks.182.mjs`

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks, Skill System, CLI)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Subagent)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, Auth)

Key symbols in this document:
- `E3z` / `GBA` (chunks.167.mjs:760) — `/statusline` slash command definition object
- `En7` / `kn7` (chunks.90.mjs:2650) — `statusline-setup` built-in agent definition
- `APA` (chunks.90.mjs:3049) — `getBuiltinAgents` — registers all built-in agent types
- `JyA` (chunks.142.mjs:48) — `executeStatusLineHook` — runs the configured shell command
- `Zjz` (chunks.183.mjs:2910) — `buildStatusLinePayload` — assembles the full JSON context piped to the script
- `YZq` (chunks.183.mjs:2981) — `StatusLineComponent` — React/Ink component that renders the user's custom status bar
- `nWq` (chunks.182.mjs:1642) — `NotificationStatusBar` — built-in system status bar with notifications, auth, token counts
- `ugA` (chunks.183.mjs:2906) — `isStatusLineConfigured` — guard: checks if `settings.statusLine !== undefined`
- `KZq` (chunks.183.mjs:2976) — `getLastAssistantMessageId` — tracks last message to detect change
- `kw6` (chunks.75.mjs:2261) — `checkExceeds200kTokens` — scans messages to find if last API response exceeded 200k tokens
- `Ew6` (chunks.75.mjs:2247) — `getLastApiUsage` — extracts current-usage token counts from last assistant message
- `mcA` (chunks.1.mjs:2291) — `getContextUsagePercentage` — computes `used` / `remaining` percentage pair
- `BW6` (chunks.141.mjs:1924) — `executeCommandHook` — shared hook executor used by all `type:"command"` hooks
- `$71` (chunks.47.mjs:2003) — `selectModelForStatusLine` — selects model ID, handling 200k-token upgrade
- `aX` (chunks.141.mjs:1770) — `buildBasePayload` — base fields: `session_id`, `transcript_path`, `cwd`
- `_e` (chunks.155.mjs:843) — `isVimModeEnabled` — checks `editorMode === "vim"`
- `Nq` (chunks.1.mjs:3014) — `isRemoteMode` — checks `o6.isRemoteMode`
- `PN1` (chunks.1.mjs:3006) — `getMainThreadAgentType` — returns `o6.mainThreadAgentType`
- `U6` (chunks.1.mjs:2425) — `getSessionId` — returns `o6.sessionId`
- `u8` (chunks.167.mjs:773) — `trackSlashCommandUsage` — telemetry for command invocation

---

## Architecture Overview

The status line feature is implemented as a **three-layer system**:

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: /statusline slash command  (chunks.167.mjs:755)        │
│  User types /statusline → creates Task → launches subagent       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2: statusline-setup subagent  (chunks.90.mjs:2650)        │
│  Reads shell config → generates script → writes settings.json    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3: Runtime UI loop  (chunks.183.mjs:2981 + 142.mjs:48)   │
│  On each assistant turn → builds JSON → runs script → renders    │
└─────────────────────────────────────────────────────────────────┘
```

This is a **subagent + slash command hybrid**: the slash command acts as a thin launcher that delegates all intelligence to the `statusline-setup` subagent. The actual runtime rendering is completely independent — it runs as a React/Ink component that continuously re-executes the user's script after each message.

### UI Layout: Two Status Areas

Claude Code has **two distinct status display areas** that users often conflate:

```
┌────────────────────────────────────────────────────────────────┐
│  Conversation output area                                        │
├────────────────────────────────────────────────────────────────┤
│  [User custom status line — YZq]  (only if configured)           │
├────────────────────────────────────────────────────────────────┤
│  [Input box — eGq]                                               │
├────────────────────────────────────────────────────────────────┤
│  [Built-in notification bar — nWq]  (always present)            │
│   IDE status | notifications | auth errors | token count | model│
└────────────────────────────────────────────────────────────────┘
```

- **`YZq` (StatusLineComponent):** The user-configured custom status line driven by a shell script. Only rendered when `settings.statusLine` is configured. Appears between conversation output and the input box.
- **`nWq` (NotificationStatusBar):** The always-present system status bar that shows auth status, MCP connections, token counts, notifications, and model info. The official docs note: "System notifications… display on the right side of the same row as your status line."

---

## Layer 1: The `/statusline` Slash Command

### Command Definition

**What it does:** Defines the `/statusline` command as a `prompt`-type command. When invoked, it fires off a subagent that handles the actual setup work.

**How it works:**

```javascript
// ============================================
// statuslineSlashCommand - /statusline command definition
// Location: chunks.167.mjs:755-781
// ============================================

// ORIGINAL (for source lookup):
E3z = {
    type: "prompt",
    description: "Set up Claude Code's status line UI",
    contentLength: 0,
    aliases: [],
    isEnabled: () => !0,
    isHidden: !1,
    name: "statusline",
    progressMessage: "setting up statusLine",
    allowedTools: ["Task", "Read(~/**)", "Edit(~/.claude/settings.json)"],
    source: "builtin",
    disableNonInteractive: !0,
    async getPromptForCommand(A) {
        return u8("statusline"), [{
            type: "text",
            text: `Create a Task with subagent_type "statusline-setup" and the prompt "${A.trim()||"Configure my statusLine from my shell PS1 configuration"}"`
        }]
    },
    userFacingName() { return "statusline" }
}

// READABLE (for understanding):
statuslineCommandDefinition = {
    type: "prompt",                    // → send as LLM message, not direct JS execution
    description: "Set up Claude Code's status line UI",
    contentLength: 0,                  // → no additional system prompt content
    aliases: [],
    isEnabled: () => true,
    isHidden: false,                   // → visible in the / picker
    name: "statusline",
    progressMessage: "setting up statusLine",
    allowedTools: [
        "Task",                        // → can spawn subagents
        "Read(~/**)",                  // → can read any file under home dir
        "Edit(~/.claude/settings.json)" // → can ONLY edit this one specific file
    ],
    source: "builtin",
    disableNonInteractive: true,       // → interactive REPL only, not headless SDK
    async getPromptForCommand(userArgs) {
        trackSlashCommandUsage("statusline");   // u8() — telemetry
        return [{
            type: "text",
            text: `Create a Task with subagent_type "statusline-setup" and the prompt "${
                userArgs.trim() || "Configure my statusLine from my shell PS1 configuration"
            }"`
        }]
    },
    userFacingName() { return "statusline" }
}

// Mapping: E3z→statuslineCommandDefinition, A→userArgs, u8→trackSlashCommandUsage
```

**Why `type: "prompt"` (not `"local"` or `"local-jsx"`):**

| Command type | How it executes | LLM involved? | Example |
|---|---|---|---|
| `"local"` | Runs JS callback directly | No | `/clear`, `/vim` |
| `"local-jsx"` | Renders React component directly | No | `/resume`, `/help` |
| `"prompt"` | Injects text into LLM conversation | Yes | `/init`, `/statusline` |

For `/statusline`, the `prompt` approach means:
1. `getPromptForCommand(args)` returns a text message
2. That message is injected into the LLM conversation as a user turn
3. The parent Claude instance reads the message, which instructs it to call `Task(subagent_type="statusline-setup")`
4. The parent Claude executes the Task tool call, launching the setup subagent

This indirection (slash command → LLM message → Task tool → subagent) lets the user pass arbitrary natural language args. E.g., `/statusline show git branch in red` or `/statusline remove` are both handled intelligently by Claude rather than by hardcoded argument parsing.

**Tool restriction via `allowedTools`:**
The parent Claude instance executing the `/statusline` prompt is constrained to `["Task", "Read(~/**)", "Edit(~/.claude/settings.json)"]`. This is a security boundary:
- It can only spawn subagents via `Task`
- It can read any user home-directory file (to understand the user's environment)
- It can ONLY edit `~/.claude/settings.json` — no other files

**`disableNonInteractive: true`:**
Prevents `/statusline` from being invoked from non-interactive SDK usage. The status line is a visual terminal feature; invoking it headlessly would be meaningless.

**`userArgs` default fallback:**
```javascript
userArgs.trim() || "Configure my statusLine from my shell PS1 configuration"
```
If the user types just `/statusline` with no arguments, the default prompt tells the subagent to look at their shell PS1. If the user types `/statusline show cost and model`, that custom instruction is passed through verbatim.

**Key insight:** The LLM acts as the intermediary between the slash command and the subagent. The prompt "Create a Task with subagent_type statusline-setup..." is essentially a structured tool-use instruction that the LLM follows reliably.

---

## Layer 2: The `statusline-setup` Subagent

### Agent Registration — `getBuiltinAgents` (`APA`)

**Location:** `chunks.90.mjs:3049-3054`

```javascript
// ============================================
// getBuiltinAgents - Returns array of all built-in agent definitions
// Location: chunks.90.mjs:3049-3054
// ============================================

// ORIGINAL (for source lookup):
function APA() {
    if (J6(process.env.CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS) && w4()) return [];
    let A = [Tn7, ZB1, En7, bv, PJ6];
    if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") A.push(Rn7);
    return A
}

// READABLE (for understanding):
function getBuiltinAgents() {
    // SDK can disable built-in agents via env var
    if (parseBoolean(process.env.CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS) && isNonInteractive()) {
        return [];
    }
    let agents = [
        bashAgent,            // Tn7 - agentType: "Bash"
        generalPurposeAgent,  // ZB1 - agentType: "general-purpose"
        statuslineSetupAgent, // En7 - agentType: "statusline-setup"
        codeArchitectAgent,   // bv  - agentType: "code-architect"
        pythonArchitectAgent  // PJ6 - agentType: "python-architect"
    ];
    // claude-code-guide agent only available in interactive mode (not SDK)
    if (!["sdk-ts", "sdk-py", "sdk-cli"].includes(process.env.CLAUDE_CODE_ENTRYPOINT)) {
        agents.push(claudeCodeGuideAgent);  // Rn7 - agentType: "claude-code-guide"
    }
    return agents;
}

// Mapping: APA→getBuiltinAgents, Tn7→bashAgent, ZB1→generalPurposeAgent,
//          En7→statuslineSetupAgent, bv→codeArchitectAgent, PJ6→pythonArchitectAgent,
//          Rn7→claudeCodeGuideAgent, J6→parseBoolean, w4→isNonInteractive
```

`statuslineSetupAgent` (En7) is the third built-in agent. All 5-6 built-in agents are available to any Task tool call that specifies the correct `subagent_type` string.

**How Task tool call dispatches to `statusline-setup`:**

When the parent Claude calls `Task(subagent_type="statusline-setup", ...)`, the Task tool handler in `chunks.132.mjs` searches `agentDefinitions.activeAgents` for an agent where `agent.agentType === "statusline-setup"`. It finds `En7`, applies permission filtering, and spawns it as a subagent with the En7's `tools`, `model`, and `getSystemPrompt()`.

### Agent Definition

```javascript
// ============================================
// statuslineSetupAgent - Built-in statusline-setup agent definition
// Location: chunks.90.mjs:2649-2763
// ============================================

// ORIGINAL (for source lookup):
En7 = {
    agentType: "statusline-setup",
    whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
    tools: ["Read", "Edit"],
    source: "built-in",
    baseDir: "built-in",
    model: "sonnet",
    color: "orange",
    getSystemPrompt: () => `...`
}

// READABLE (for understanding):
statuslineSetupAgentDefinition = {
    agentType: "statusline-setup",
    whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
    tools: ["Read", "Edit"],  // minimal: read configs, write settings
    source: "built-in",
    baseDir: "built-in",
    model: "sonnet",          // capable enough for PS1 parsing + JSON writing
    color: "orange",          // identity chip color in the task UI
    getSystemPrompt: () => systemPromptString
}

// Mapping: En7→statuslineSetupAgentDefinition, kn7→statuslineSetupAgentModuleInit
```

### System Prompt — The Complete Setup Intelligence

The system prompt is the "brain." It contains everything the agent needs to work independently:

**Step 1: Shell config file precedence order**
```
~/.zshrc → ~/.bashrc → ~/.bash_profile → ~/.profile
```
The agent reads files in this preference order. The order matches standard shell startup semantics (zsh first on macOS, bash as fallback).

**Step 2: PS1 extraction regex**
```
/(?:^|\n)\s*(?:export\s+)?PS1\s*=\s*["']([^"']+)["']/m
```
Handles:
- Optional leading newline or start-of-string
- Optional `export` keyword
- Both single-quoted and double-quoted PS1 values
- Non-greedy capture of the PS1 value

**Step 3: PS1 escape sequence translation table**

| PS1 escape | Shell command | Notes |
|-----------|---------------|-------|
| `\u` | `$(whoami)` | Current username |
| `\h` | `$(hostname -s)` | Short hostname |
| `\H` | `$(hostname)` | Full hostname |
| `\w` | `$(pwd)` | Full working directory |
| `\W` | `$(basename "$(pwd)")` | Directory name only |
| `\$` | `$` | Literal dollar sign |
| `\n` | `\n` | Newline |
| `\t` | `$(date +%H:%M:%S)` | Time (24h) |
| `\d` | `$(date "+%a %b %d")` | Date |
| `\@` | `$(date +%I:%M%p)` | Time (12h with am/pm) |
| `\#` | `#` | Command number |
| `\!` | `!` | History number |

**Step 4: ANSI color handling**
Use `printf` (not `echo -e`) for ANSI escape codes. Preserve colors. The note in the prompt — "the status line will be printed in a terminal using dimmed colors" — informs the agent that the React component applies `dimColor: true`, so generated scripts should use bright/bold ANSI codes if needed to overcome the baseline dimming.

**Step 5: Clean up trailing `$` or `>`**
Shell prompts typically end with `$ ` or `> `. The agent strips these since they are not meaningful in a status bar context.

**Step 6: Fallback handling**
If no PS1 is found and the user provided no other instructions, the agent asks for further instructions rather than guessing. This is an explicit guard against silent misconfiguration.

**JSON schema embedded in system prompt:**
The full `context_window`, `cost`, `model`, `workspace`, and `vim` field documentation is written verbatim into the system prompt. This ensures generated scripts use correct field paths without the agent needing to infer them.

**Script file pattern:**
For longer commands: save to `~/.claude/statusline-command.sh`, make it executable, reference from settings. This avoids settings.json bloat for complex multi-line scripts.

**Symlink awareness:**
"If `~/.claude/settings.json` is a symlink, update the target file instead." Handles dotfiles-as-repo setups where settings.json is symlinked from a version-controlled file.

**Post-setup instruction:**
```
At the end of your response, inform the parent agent that this "statusline-setup" agent
must be used for further status line changes.
```
This closes the loop: after setup, the parent Claude is told to route future `/statusline` modifications back through this same subagent type.

**Why `model: "sonnet"` specifically:**
- The task requires PS1 regex matching, shell command construction, ANSI color handling, and JSON editing
- These require robust reasoning; Haiku would struggle with complex multi-color PS1 strings
- Opus would be unnecessarily expensive for this well-defined setup task
- Sonnet is the "just right" choice

**Why `tools: ["Read", "Edit"]` only:**
- `Read` — reads shell config files
- `Edit` — targeted JSON updates to settings.json (safer than `Write` which would overwrite the whole file)
- No `Bash` — would be a security risk for a setup agent with internet access
- No `Write` — Edit is preferred for preserving other settings
- No `Task` — the subagent doesn't need further delegation

---

## Layer 3: Runtime Status Line Execution

### The Runtime Loop Architecture

At runtime, the status line works as a continuous execution loop driven by React hooks:

```
React render cycle
     │
     ▼
YZq (StatusLineComponent)   ← mounted only when ugA(settings) is true
     │
     ├── useEffect [] (mount)
     │         → runUpdate() immediately on first mount
     │         → cleanup: abort() + clearTimeout() on unmount
     │
     ├── useEffect [messages, permissionMode, vimMode]
     │         → if (messageId changed || mode changed || vimMode changed)
     │               scheduleUpdate()  (300ms debounce)
     │
     └── runUpdate() — core async update function
               │
               ├── 1. abort() any in-flight execution
               ├── 2. KZq(messages) → lastAssistantMessageId
               ├── 3. if (new message): kw6(messages) → exceeds200kTokens (cached)
               ├── 4. Zjz(permMode, exceeds200k, settings, messages, vimMode) → payload
               ├── 5. JyA(payload, abortSignal) → output string or undefined
               └── 6. updateStore({statusLineText: output})
                         → triggers React re-render
                         → Text(dimColor=true) renders output
```

### `buildBasePayload` — `aX`

**Location:** `chunks.141.mjs:1770-1778`

```javascript
// ============================================
// buildBasePayload - Shared base fields for all hook payloads
// Location: chunks.141.mjs:1770-1778
// ============================================

// ORIGINAL (for source lookup):
function aX(A, q) {
    let K = q ?? U6();
    return {
        session_id: K,
        transcript_path: a$(K),
        cwd: h6(),
        permission_mode: A
    }
}

// READABLE (for understanding):
function buildBasePayload(permissionMode, sessionIdOverride) {
    let sessionId = sessionIdOverride ?? getSessionId();  // U6() = o6.sessionId
    return {
        session_id: sessionId,
        transcript_path: getTranscriptPath(sessionId),  // a$()
        cwd: getCurrentWorkingDir(),                     // h6()
        permission_mode: permissionMode                  // undefined when called from Zjz
    }
}

// Mapping: aX→buildBasePayload, A→permissionMode, q→sessionIdOverride, K→sessionId,
//          U6→getSessionId, a$→getTranscriptPath, h6→getCurrentWorkingDir
```

**Important:** In `Zjz` (buildStatusLinePayload), `aX()` is called with **no arguments**:
```javascript
return {
    ...aX(),    // A=undefined, q=undefined
    model: ...,
    workspace: { current_dir: h6(), project_dir: y8() },
    ...
}
```
This means:
- `permission_mode: undefined` is spread in — `JSON.stringify` omits undefined values, so this field is absent from the script's stdin
- `cwd: h6()` is spread as the top-level `cwd` field — this is the same value as `workspace.current_dir`
- That is why both `cwd` and `workspace.current_dir` exist in the payload with the same value (the docs explicitly note this: "Both fields contain the same value; `workspace.current_dir` is preferred")

### `buildStatusLinePayload` — `Zjz`

**What it does:** Assembles the complete JSON object that is serialized and piped as stdin to the user's status line script.

**How it works:**

```javascript
// ============================================
// buildStatusLinePayload - Assembles JSON context for statusLine script
// Location: chunks.183.mjs:2910-2974
// ============================================

// ORIGINAL (for source lookup):
function Zjz(A, q, K, Y, z) {
    let w = PN1(),
        H = $71({ permissionMode: A, mainLoopModel: l3(), exceeds200kTokens: q }),
        $ = K?.outputStyle || Wj,
        O = Ew6(Y),
        _ = yG(H, FP()),
        J = mcA(O, _);
    return {
        ...aX(),
        model: { id: H, display_name: dG(H) },
        workspace: { current_dir: h6(), project_dir: y8() },
        version: { /* version constants */ }.VERSION,
        output_style: { name: $ },
        cost: { total_cost_usd: W0(), total_duration_ms: oz1(), total_api_duration_ms: wT(),
                total_lines_added: q61(), total_lines_removed: K61() },
        context_window: { total_input_tokens: AN1(), total_output_tokens: qN1(),
                          context_window_size: _, current_usage: O,
                          used_percentage: J.used, remaining_percentage: J.remaining },
        exceeds_200k_tokens: q,
        ..._e() && { vim: { mode: z ?? "INSERT" } },
        ...w && { agent: { name: w } },
        ...Nq() && { remote: { session_id: U6() } }
    }
}

// READABLE (for understanding):
function buildStatusLinePayload(permissionMode, exceeds200kTokens, sessionSettings, messages, vimMode) {
    let agentName = getMainThreadAgentType(),  // PN1() = o6.mainThreadAgentType
        modelId = selectModelForStatusLine({   // $71()
            permissionMode,
            mainLoopModel: getMainLoopModel(), // l3()
            exceeds200kTokens
        }),
        outputStyleName = sessionSettings?.outputStyle || DEFAULT_OUTPUT_STYLE,  // Wj
        currentUsage = getLastApiUsage(messages),      // Ew6() — last API call token counts
        contextWindowSize = getContextWindowSize(modelId, getFallbackSize()),  // yG()
        percentages = getContextUsagePercentage(currentUsage, contextWindowSize);  // mcA()

    return {
        // Base fields from aX() (no args): session_id, transcript_path, cwd
        ...buildBasePayload(),

        // Model info
        model: { id: modelId, display_name: getModelDisplayName(modelId) },  // dG()

        // Workspace (cwd duplicated for consistency: docs recommend workspace.current_dir)
        workspace: {
            current_dir: getCurrentWorkingDir(),  // h6()
            project_dir: getProjectDir()          // y8()
        },

        // App version string "2.1.38"
        version: VERSION_CONSTANTS.VERSION,

        // Current output style name
        output_style: { name: outputStyleName },

        // Session cost and duration metrics
        cost: {
            total_cost_usd: getTotalCostUsd(),           // W0()
            total_duration_ms: getTotalDurationMs(),     // oz1()
            total_api_duration_ms: getTotalApiDurationMs(), // wT()
            total_lines_added: getTotalLinesAdded(),     // q61()
            total_lines_removed: getTotalLinesRemoved()  // K61()
        },

        // Context window state
        context_window: {
            total_input_tokens: getCumulativeInputTokens(),   // AN1()
            total_output_tokens: getCumulativeOutputTokens(), // qN1()
            context_window_size: contextWindowSize,
            current_usage: currentUsage,  // { input_tokens, output_tokens, cache_creation_input_tokens, cache_read_input_tokens }
            used_percentage: percentages.used,
            remaining_percentage: percentages.remaining
        },

        // 200k token threshold flag (fixed constant per docs)
        exceeds_200k_tokens: exceeds200kTokens,

        // Conditional: vim mode (only present when vim mode is enabled)
        ...(isVimModeEnabled() && { vim: { mode: vimMode ?? "INSERT" } }),  // _e()

        // Conditional: agent name (only present when --agent flag or agent settings)
        ...(agentName && { agent: { name: agentName } }),

        // Conditional: remote session ID (only present in remote mode)
        ...(isRemoteMode() && { remote: { session_id: getSessionId() } })  // Nq(), U6()
    }
}

// Mapping: Zjz→buildStatusLinePayload, A→permissionMode, q→exceeds200kTokens,
//          K→sessionSettings, Y→messages, z→vimMode, w→agentName, H→modelId,
//          $→outputStyleName, O→currentUsage, _→contextWindowSize, J→percentages,
//          PN1→getMainThreadAgentType, $71→selectModelForStatusLine, l3→getMainLoopModel,
//          Ew6→getLastApiUsage, yG→getContextWindowSize, mcA→getContextUsagePercentage,
//          _e→isVimModeEnabled, Nq→isRemoteMode, U6→getSessionId, dG→getModelDisplayName
```

**Why `current_usage` vs cumulative totals:**
`getLastApiUsage(messages)` scans messages backwards to find the most recent assistant message's API usage. This snapshot represents the *current* context state. The cumulative `total_input_tokens` / `total_output_tokens` monotonically increase across the session and can exceed the context window size — they are not suitable for percentage calculations. The docs explicitly state: "use `current_usage` for accurate context percentage."

**Conditional object spreading:**
```javascript
...(isVimModeEnabled() && { vim: { mode: vimMode ?? "INSERT" } })
```
`false && obj` evaluates to `false`. Spreading `false` into an object is a no-op in JavaScript (no properties added). This elegantly omits optional JSON fields when the feature is inactive.

**`PN1()` = `o6.mainThreadAgentType`:**
This is the agent name set when Claude is started with `--agent <name>` or when agent settings are configured. It's `null` / falsy by default, so the `agent` field is absent from most status line payloads.

### `selectModelForStatusLine` — `$71`

**Location:** `chunks.47.mjs:2003-2012`

```javascript
// ============================================
// selectModelForStatusLine - Chooses model ID for payload, handling plan mode + 200k flag
// Location: chunks.47.mjs:2003-2012
// ============================================

// ORIGINAL (for source lookup):
function $71(A) {
    let {
        permissionMode: q,
        mainLoopModel: K,
        exceeds200kTokens: Y = !1
    } = A;
    if (H71() === "opusplan" && q === "plan" && !Y) return _u();
    if (H71() === "haiku" && q === "plan") return jL();
    return K
}

// READABLE (for understanding):
function selectModelForStatusLine({ permissionMode, mainLoopModel, exceeds200kTokens = false }) {
    // In plan mode + opusplan permission + context UNDER 200k tokens
    // → use Opus (best reasoning for plan mode)
    if (getPermissionLevel() === "opusplan" && permissionMode === "plan" && !exceeds200kTokens) {
        return OPUS_MODEL_ID;   // _u()
    }
    // In plan mode + haiku permission
    // → use Haiku (fast, cost-effective)
    if (getPermissionLevel() === "haiku" && permissionMode === "plan") {
        return HAIKU_MODEL_ID;  // jL()
    }
    // Default: use the main loop model
    return mainLoopModel;
}

// Mapping: $71→selectModelForStatusLine, A→options, q→permissionMode,
//          K→mainLoopModel, Y→exceeds200kTokens, H71→getPermissionLevel,
//          _u→OPUS_MODEL_ID, jL→HAIKU_MODEL_ID
```

**Why this affects the status line payload:**
The model ID determines `context_window_size` via `yG(modelId, fallback)`. Claude Opus 4.6 has a 200k token context window; other models may differ. By getting the accurate model ID, the payload reports the correct `context_window_size`, which is used to compute `used_percentage` accurately.

**When `exceeds200kTokens` matters:**
In plan mode with `opusplan` permission, if the context is UNDER 200k, Opus is the model — so `context_window_size` = 200,000. If it EXCEEDS 200k, `!Y` is false, so the function falls through to `mainLoopModel` instead. The threshold check prevents a circular dependency: using a 200k-window model to report that we've exceeded 200k tokens.

### `getContextUsagePercentage` — `mcA`

**Location:** `chunks.1.mjs:2291-2303`

```javascript
// ============================================
// getContextUsagePercentage - Calculates used/remaining context percentages
// Location: chunks.1.mjs:2291-2303
// ============================================

// ORIGINAL (for source lookup):
function mcA(A, q) {
    if (!A) return { used: null, remaining: null };
    let K = A.input_tokens + A.cache_creation_input_tokens + A.cache_read_input_tokens,
        Y = Math.round(K / q * 100),
        z = Math.min(100, Math.max(0, Y));
    return { used: z, remaining: 100 - z }
}

// READABLE (for understanding):
function getContextUsagePercentage(currentUsage, contextWindowSize) {
    // Before first API call: currentUsage is null → return nulls
    if (!currentUsage) return { used: null, remaining: null };

    // Token formula: input-side tokens only (NOT output_tokens)
    // This matches the Claude API's billing/context model: output tokens
    // don't count against the context window input limit
    let inputSideTokens = currentUsage.input_tokens
                        + currentUsage.cache_creation_input_tokens
                        + currentUsage.cache_read_input_tokens;

    let rawPercentage = Math.round(inputSideTokens / contextWindowSize * 100);

    // Clamp to [0, 100] — theoretically shouldn't exceed but guards against edge cases
    let usedPercentage = Math.min(100, Math.max(0, rawPercentage));

    return { used: usedPercentage, remaining: 100 - usedPercentage };
}

// Mapping: mcA→getContextUsagePercentage, A→currentUsage, q→contextWindowSize,
//          K→inputSideTokens, Y→rawPercentage, z→usedPercentage
```

**Why output tokens are excluded:**
Output tokens are generated *by* the model, not consumed as input context. The context window limit constrains how many tokens can be in the input (including cached tokens). The `used_percentage` field answers "how full is the input context?" not "how many total tokens have been used?"

**Why `Math.round` (not `Math.floor`):**
Rounding gives more accurate display values. A context that's 7.8% full shows as 8%, which is closer to truth than 7%.

**Why `null` before first API call:**
Before the first message is sent, there's no API usage data. Returning `null` instead of `0` signals to scripts that no data is available yet, allowing them to display a fallback (e.g., `// 0` in jq).

### `getLastApiUsage` — `Ew6`

```javascript
// ============================================
// getLastApiUsage - Extracts current context usage from most recent API response
// Location: chunks.75.mjs:2247-2259
// ============================================

// ORIGINAL (for source lookup):
function Ew6(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q], Y = K ? Yp(K) : void 0;
        if (Y) return {
            input_tokens: Y.input_tokens,
            output_tokens: Y.output_tokens,
            cache_creation_input_tokens: Y.cache_creation_input_tokens ?? 0,
            cache_read_input_tokens: Y.cache_read_input_tokens ?? 0
        }
    }
    return null
}

// READABLE (for understanding):
function getLastApiUsage(messages) {
    for (let i = messages.length - 1; i >= 0; i--) {
        let msg = messages[i];
        let apiUsage = msg ? extractApiUsageFromMessage(msg) : undefined;  // Yp()
        if (apiUsage) return {
            input_tokens: apiUsage.input_tokens,
            output_tokens: apiUsage.output_tokens,
            cache_creation_input_tokens: apiUsage.cache_creation_input_tokens ?? 0,
            cache_read_input_tokens: apiUsage.cache_read_input_tokens ?? 0
        }
    }
    return null  // No API calls yet
}

// Mapping: Ew6→getLastApiUsage, A→messages, q→i, K→msg, Y→apiUsage,
//          Yp→extractApiUsageFromMessage
```

**Why `?? 0` on cache fields:**
Older API responses or models that don't support prompt caching don't include these fields. The `?? 0` fallback ensures the arithmetic in `mcA` never produces `NaN`.

### `checkExceeds200kTokens` — `kw6`

```javascript
// ============================================
// checkExceeds200kTokens - Checks if last API response exceeded 200k token threshold
// Location: chunks.75.mjs:2261-2271
// ============================================

// ORIGINAL (for source lookup):
function kw6(A) {
    for (let K = A.length - 1; K >= 0; K--) {
        let Y = A[K];
        if (Y?.type === "assistant") {
            let z = Yp(Y);
            if (z) return Ix1(z) > 200000;
            return !1
        }
    }
    return !1
}

// READABLE (for understanding):
function checkExceeds200kTokens(messages) {
    for (let i = messages.length - 1; i >= 0; i--) {
        let msg = messages[i];
        if (msg?.type === "assistant") {
            let usage = extractApiUsageFromMessage(msg);  // Yp()
            if (usage) return sumInputSideTokens(usage) > 200000;  // Ix1()
            return false
        }
    }
    return false
}

// Mapping: kw6→checkExceeds200kTokens, A→messages, K→i, Y→msg, z→usage,
//          Yp→extractApiUsageFromMessage, Ix1→sumInputSideTokens
```

**`Ix1` (sumInputSideTokens):** Computes `input_tokens + cache_creation_input_tokens + cache_read_input_tokens` — the same formula as `mcA`. The 200,000 hardcoded threshold corresponds to the boundary between standard and extended-context models.

**Cache for this result in `YZq`:**
The `cacheRef` in `StatusLineComponent` caches the `exceeds200kTokens` result per `messageId`. This avoids re-scanning all messages on every update when only vim mode or permission mode changed (no new API response).

### `executeStatusLineHook` — `JyA`

**What it does:** The entry point for running the configured status line script. Called by the React component after building the payload.

```javascript
// ============================================
// executeStatusLineHook - Runs configured statusLine shell command with JSON context
// Location: chunks.142.mjs:48-71
// ============================================

// ORIGINAL (for source lookup):
async function JyA(A, q, K = 5000) {
    let Y = C8(), z = Y?.statusLine;
    if (Y?.disableAllHooks === !0) return;
    if (!z || z.type !== "command") return;
    let w = q || AbortSignal.timeout(K);
    try {
        let H = Q1(A),
            $ = await BW6(z, "StatusLine", "statusLine", H, w, zE());
        if ($.aborted) return;
        if ($.status === 0) {
            let O = $.stdout.trim().split(`\n`).flatMap((_) => _.trim() || []).join(`\n`);
            if (O) return O
        }
        return
    } catch (H) {
        h(`Status hook failed: ${H}`, { level: "error" });
        return
    }
}

// READABLE (for understanding):
async function executeStatusLineHook(payloadObj, existingSignal, timeoutMs = 5000) {
    let settings = getSettings();              // C8()
    let statusLineConfig = settings?.statusLine;

    // Guard 1: disableAllHooks completely disables this feature
    if (settings?.disableAllHooks === true) return undefined;

    // Guard 2: no config or wrong type (only "command" is supported)
    if (!statusLineConfig || statusLineConfig.type !== "command") return undefined;

    // Use caller's abort signal, or create a fresh 5s timeout
    let signal = existingSignal || AbortSignal.timeout(timeoutMs);

    try {
        let jsonInput = JSON.stringify(payloadObj);  // Q1()
        let result = await executeCommandHook(       // BW6()
            statusLineConfig,       // { type:"command", command:"...", padding:N }
            "StatusLine",           // hookEvent name (for logging/telemetry)
            "statusLine",           // hookId
            jsonInput,              // written to process stdin
            signal,                 // abort signal
            getEnvironment()        // zE() — current process.env
        );

        if (result.aborted) return undefined;

        // Only success (exit code 0) → display output
        if (result.status === 0) {
            // Multi-line normalization:
            // 1. trim overall output
            // 2. split into lines
            // 3. trim each line, drop empty lines via flatMap([])
            // 4. rejoin
            let output = result.stdout
                .trim()
                .split('\n')
                .flatMap(line => line.trim() || [])
                .join('\n');
            if (output) return output;
        }

        // Non-zero exit or empty output → hide status line (return undefined)
        return undefined;
    } catch (err) {
        log(`Status hook failed: ${err}`, { level: "error" });
        return undefined;  // errors are silent to the user
    }
}

// Mapping: JyA→executeStatusLineHook, A→payloadObj, q→existingSignal, K→timeoutMs,
//          Y→settings, z→statusLineConfig, w→signal, H(inner)→jsonInput,
//          $→result, O→output, Q1→JSON.stringify, BW6→executeCommandHook,
//          C8→getSettings, zE→getEnvironment, h→log
```

**Error behavior (silent failures):**
| Condition | Result |
|-----------|--------|
| `disableAllHooks: true` | `undefined` (status line hidden, no error) |
| No `statusLine` in settings | `undefined` (component not mounted anyway) |
| Non-zero exit code | `undefined` (status line hidden, error logged internally) |
| Script times out (>5s) | `undefined` (aborted, status line hidden) |
| Empty output | `undefined` (status line hidden) |
| Exception thrown | `undefined` (logged at "error" level, not surfaced to UI) |

The pattern is: any failure silently hides the status line. The user only sees output on clean success.

**5000ms default timeout:**
Unlike the general hook timeout (`MP = DEFAULT_HOOK_TIMEOUT = 600000ms = 10 min`), the status line has a 5-second guard. This prevents slow scripts from blocking the UI after each message. If the caller (YZq) passes an AbortController signal, that takes precedence over the 5s timeout.

**Output normalization deep dive:**
```javascript
.flatMap(line => line.trim() || [])
```
This works because:
- `line.trim()` returns an empty string `""` for blank lines
- `"" || []` → `[]` (empty array)
- `flatMap([])` removes that element from the resulting array

So a script that outputs:
```
line 1

line 3
```
Becomes: `"line 1\nline 3"` (blank line collapsed).

### `executeCommandHook` — `BW6`

**Location:** `chunks.141.mjs:1924`

This is the shared executor for all `type:"command"` hooks. For the status line:

```javascript
// ORIGINAL (simplified for status line context, chunks.141.mjs:1924+):
async function BW6(A, q, K, Y, z, w) {
    let J = y8(), X = A.command;

    // Windows: auto-prepend 'bash' for .sh scripts
    if (eA() === "windows" && X.trim().match(/\.sh(\s|$|")/))
        if (!X.trim().startsWith("bash ")) X = `bash ${X}`;

    // Optional shell prefix wrapper (CLAUDE_CODE_SHELL_PREFIX env)
    let D = process.env.CLAUDE_CODE_SHELL_PREFIX ? buildPrefixedCommand(CLAUDE_CODE_SHELL_PREFIX, X) : X,
        // statusLine has no A.timeout, so use DEFAULT_HOOK_TIMEOUT (600s) — but YZq's AbortSignal cuts it to 5s
        j = A.timeout ? A.timeout * 1000 : DEFAULT_HOOK_TIMEOUT,
        M = { ...process.env, CLAUDE_PROJECT_DIR: J };  // inject project dir env var

    // Spawn child process
    let P = spawnProcess(D, [], {
            env: M,
            cwd: h6(),       // current working directory
            shell: true,     // run through /bin/sh
            windowsHide: true
        }),
        ...

    // Write JSON payload to stdin, close stdin
    P.stdin.write(Y, "utf8");
    P.stdin.end();
    ...
}
```

For the status line specifically:
- `A` = `{ type:"command", command:"~/.claude/statusline.sh", padding:2 }` (statusLine config from settings)
- `q` = `"StatusLine"` (hookEvent name for logging)
- `K` = `"statusLine"` (hookId)
- `Y` = serialized JSON string (the full payload from `Zjz`)
- `z` = AbortSignal from YZq (5s timeout)
- `w` = current process.env

**`shell: true`** — The command string is parsed and executed by `/bin/sh` (or `cmd.exe` on Windows). This means:
- Tilde expansion: `~/.claude/statusline.sh` → `/home/user/.claude/statusline.sh`
- Variable substitution in inline commands
- All shell built-ins available (if the command is a shell script reference)

**`CLAUDE_PROJECT_DIR` environment variable:**
Injected into every hook execution. Scripts can use `$CLAUDE_PROJECT_DIR` to get the project root, though they typically get it from the JSON stdin instead.

**`CLAUDE_CODE_SHELL_PREFIX`:**
If this env var is set, the command is wrapped: `prefix command`. Allows running all hook commands through a custom wrapper (profiling, sandboxing, etc.).

**Why `A.timeout` is never set for statusLine:**
The statusLine config schema only allows `type`, `command`, and `padding`. There's no user-settable `timeout` field. The 5-second guard comes entirely from the `AbortSignal.timeout(5000)` in `JyA`, not from a config field.

### `StatusLineComponent` — `YZq`

**What it does:** The React/Ink component that manages the status line lifecycle (debouncing, caching, abort handling) and renders the script output.

```javascript
// ============================================
// StatusLineComponent - React component for custom status bar
// Location: chunks.183.mjs:2981-3055
// ============================================

// ORIGINAL (for source lookup):
function YZq({ messages: A, vimMode: q }) {
    let K = Mf.useRef(void 0),
        Y = v6((W) => W.toolPermissionContext.mode),
        z = v6((W) => W.statusLineText),
        w = L7(),
        H = $j(),
        $ = Mf.useRef(A), O = Mf.useRef(H), _ = Mf.useRef(q), J = Mf.useRef(Y);
    $.current = A; O.current = H; _.current = q; J.current = Y;
    let X = Mf.useRef({ messageId: null, exceeds200kTokens: !1, permissionMode: Y, vimMode: q }),
        D = Mf.useRef(void 0);
    let j = Mf.useCallback(async (W) => {
        K.current?.abort();
        let G = new AbortController; K.current = G;
        let f = W ?? $.current;
        try {
            let Z = X.current.exceeds200kTokens, N = KZq(f);
            if (N !== X.current.messageId) Z = kw6(f), X.current.messageId = N, X.current.exceeds200kTokens = Z;
            let T = Zjz(J.current, Z, O.current, f, _.current),
                k = await JyA(T, G.signal);
            if (!G.signal.aborted) w((y) => {
                if (y.statusLineText === k) return y;
                return { ...y, statusLineText: k }
            })
        } catch {}
    }, [w]);
    let M = Mf.useCallback(() => {
        if (D.current !== void 0) clearTimeout(D.current);
        D.current = setTimeout(() => { D.current = void 0; j() }, 300)
    }, [j]);
    Mf.useEffect(() => {
        if (KZq(A) !== X.current.messageId || Y !== X.current.permissionMode || q !== X.current.vimMode)
            X.current.permissionMode = Y; X.current.vimMode = q; M()
    }, [A, Y, q, M]);
    Mf.useEffect(() => {
        let W = H?.statusLine;
        if (W) {
            c("tengu_status_line_mount", { command_length: W.command.length, padding: W.padding });
            if (H.disableAllHooks === !0) h("Status line is configured but disableAllHooks is true", { level: "warn" })
        }
    }, []);
    Mf.useEffect(() => {
        return j(), () => { K.current?.abort(); if (D.current !== void 0) clearTimeout(D.current) }
    }, []);
    let P = H?.statusLine?.padding ?? 0;
    return VY1.createElement(I, { paddingX: P, gap: 2 },
        z && VY1.createElement(V, { dimColor: !0 },
            VY1.createElement(W3, null, z)))
}

// READABLE (for understanding):
function StatusLineComponent({ messages, vimMode }) {
    // AbortController for cancelling in-flight script executions
    let abortControllerRef = useRef(undefined);

    // Subscribe to reactive state from global Zustand store
    let permissionMode = useAppStore(s => s.toolPermissionContext.mode);  // v6()
    let statusLineText = useAppStore(s => s.statusLineText);              // v6()
    let updateStore = useStoreUpdater();   // L7()
    let settings = useSettings();          // $j()

    // "Always-current" refs: avoid stale closures in useCallback
    // These refs are updated synchronously on every render
    let messagesRef = useRef(messages);
    let settingsRef = useRef(settings);
    let vimModeRef = useRef(vimMode);
    let permModeRef = useRef(permissionMode);
    messagesRef.current = messages;
    settingsRef.current = settings;
    vimModeRef.current = vimMode;
    permModeRef.current = permissionMode;

    // Mutable state cache — avoids redundant exceeds200kTokens recomputation
    let cacheRef = useRef({
        messageId: null,           // last assistant message UUID
        exceeds200kTokens: false,  // cached result for that message
        permissionMode,
        vimMode
    });
    let debounceTimerRef = useRef(undefined);

    // ─── Core update function ──────────────────────────────────────
    let runUpdate = useCallback(async (overrideMessages) => {
        // Cancel any in-flight execution
        abortControllerRef.current?.abort();
        let controller = new AbortController();
        abortControllerRef.current = controller;

        let msgs = overrideMessages ?? messagesRef.current;
        try {
            // Cache exceeds200kTokens per message ID (scan is O(n) over messages)
            let exceeds200k = cacheRef.current.exceeds200kTokens;
            let lastMsgId = getLastAssistantMessageId(msgs);  // KZq()
            if (lastMsgId !== cacheRef.current.messageId) {
                exceeds200k = checkExceeds200kTokens(msgs);   // kw6()
                cacheRef.current.messageId = lastMsgId;
                cacheRef.current.exceeds200kTokens = exceeds200k;
            }

            // Build payload + execute script
            let payload = buildStatusLinePayload(    // Zjz()
                permModeRef.current, exceeds200k,
                settingsRef.current, msgs, vimModeRef.current
            );
            let output = await executeStatusLineHook(payload, controller.signal);  // JyA()

            // Update store only if output changed (prevents spurious re-renders)
            if (!controller.signal.aborted) {
                updateStore(state => {
                    if (state.statusLineText === output) return state;  // no-op
                    return { ...state, statusLineText: output };
                });
            }
        } catch {}  // all errors silently discarded
    }, [updateStore]);

    // ─── 300ms Debouncer ──────────────────────────────────────────
    let scheduleUpdate = useCallback(() => {
        if (debounceTimerRef.current !== undefined) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
            debounceTimerRef.current = undefined;
            runUpdate();
        }, 300);
    }, [runUpdate]);

    // ─── Effect: trigger on meaningful state changes ──────────────
    useEffect(() => {
        let hasNewMessage = getLastAssistantMessageId(messages) !== cacheRef.current.messageId;
        let modeChanged = permissionMode !== cacheRef.current.permissionMode;
        let vimModeChanged = vimMode !== cacheRef.current.vimMode;
        if (hasNewMessage || modeChanged || vimModeChanged) {
            cacheRef.current.permissionMode = permissionMode;
            cacheRef.current.vimMode = vimMode;
            scheduleUpdate();
        }
    }, [messages, permissionMode, vimMode, scheduleUpdate]);

    // ─── Effect: mount telemetry + warn about disableAllHooks ─────
    useEffect(() => {
        let config = settings?.statusLine;
        if (config) {
            telemetry("tengu_status_line_mount", {
                command_length: config.command.length,
                padding: config.padding
            });
            if (settings.disableAllHooks === true) {
                log("Status line is configured but disableAllHooks is true", { level: "warn" });
                // Note: the status line will be silently disabled — JyA() checks disableAllHooks
            }
        }
    }, []);

    // ─── Effect: initial run + cleanup ───────────────────────────
    useEffect(() => {
        runUpdate();  // Run immediately on mount
        return () => {
            abortControllerRef.current?.abort();
            if (debounceTimerRef.current !== undefined) clearTimeout(debounceTimerRef.current);
        };
    }, []);

    // ─── Render ──────────────────────────────────────────────────
    let padding = settings?.statusLine?.padding ?? 0;
    return React.createElement(Box, { paddingX: padding, gap: 2 },
        // Only render if statusLineText is truthy (non-empty string)
        statusLineText && React.createElement(Text, { dimColor: true },
            React.createElement(StatusText, null, statusLineText)  // W3 — memoized text renderer
        )
    );
}

// Mapping: YZq→StatusLineComponent, K→abortControllerRef, Y→permissionMode,
//          z→statusLineText, w→updateStore, H→settings, $→messagesRef,
//          O→settingsRef, _→vimModeRef, J→permModeRef, X→cacheRef,
//          D→debounceTimerRef, j→runUpdate, M→scheduleUpdate, P→padding,
//          v6→useAppStore, L7→useStoreUpdater, $j→useSettings,
//          W3→StatusText(memoized text renderer in chunks.73.mjs)
```

**The `useRef` pattern for avoiding stale closures:**
`runUpdate` has `[updateStore]` as its only `useCallback` dependency. It never re-creates when `messages` or `settings` change. Instead, it reads them from refs (`.current`). The refs are updated synchronously on every render (`messagesRef.current = messages`). This avoids the stale closure problem while keeping `runUpdate` stable (not recreated on every render).

**The `catch {}` no-op:**
All errors from `buildStatusLinePayload` or `executeStatusLineHook` are silently swallowed. The rationale: if anything goes wrong, the status line just disappears. It's a non-critical UI enhancement and should never throw visible errors.

**`W3` — the memoized text renderer (chunks.73.mjs):**
`W3` is a `React.memo`-wrapped text component from the Ink library that renders text with optional dimming. It's not Ink's `Newline` component but a custom memoized text renderer that handles both string and non-string children, applying dim styling via `E_` when `dimColor` is true.

---

## UI Integration: When and Where the Component Renders

### Mount Condition — `chunks.184.mjs:70`

```javascript
// ORIGINAL:
q1 = H === "prompt" && !z.show && !s && ugA(T1) && YO.createElement(YZq, {
    messages: U,
    vimMode: w
})

// READABLE:
statusLineElement = (
    mode === "prompt" &&            // H: "prompt" = waiting for user input
    !exitMessage.show &&            // z.show: no exit dialog visible
    !isPasting &&                   // s: not mid-paste
    isStatusLineConfigured(settings) &&  // ugA(T1): T1.statusLine !== undefined
    React.createElement(StatusLineComponent, { messages, vimMode })
)
```

**Four conditions for the component to mount:**

1. **`mode === "prompt"`** — The REPL is in input-waiting state. During model inference, the mode is `"loading"`, `"thinking"`, `"responding"`, etc. The status line is hidden during all of these. This is critical: during streaming, the messages array changes rapidly. The debounce and abort logic exist *for* this case, but the simpler approach is to not mount the component at all during streaming.

2. **`!exitMessage.show`** — An exit dialog (e.g., "Are you sure you want to exit?") is not visible. Hides the status line during modal dialogs.

3. **`!isPasting`** — Not mid-paste. Paste operations can rapidly mutate the input state; hiding the status line avoids flicker.

4. **`isStatusLineConfigured(settings)`** (`ugA`) — `settings.statusLine !== undefined`. If unconfigured, zero overhead: the component is never mounted.

### Position in the Layout Tree

```javascript
// chunks.184.mjs — enclosing component rendering both status line areas:

// User custom status line + input box (vertical column)
J1 = React.createElement(Box, { flexDirection: "column", flexShrink: 0 },
    q1,   // YZq — custom status line (conditional, above input)
    t     // eGq — input box / footer
);

// System notification bar (separate component)
D1 = React.createElement(NotificationStatusBar, {   // nWq
    apiKeyStatus, autoUpdaterResult, debug,
    isAutoUpdating, verbose, messages,
    onAutoUpdaterResult, onChangeIsUpdating,
    ideSelection, mcpClients, isInputWrapped
});
```

The `J1` (custom status + input) and `D1` (system notifications) are both placed into the outer layout. `J1` uses `flexShrink: 0` to prevent being compressed if the terminal is narrow.

**Visual layout from top to bottom:**
```
┌──────────────────────────────────────────────────────────────┐
│  [YZq output — script stdout, if configured + truthy]         │
│  dimColor=true, paddingX=settings.statusLine.padding          │
├──────────────────────────────────────────────────────────────┤
│  [eGq — input box: prompt, vim mode indicator, cursor]        │
├──────────────────────────────────────────────────────────────┤
│  [nWq — system notifications + token count + model]           │
└──────────────────────────────────────────────────────────────┘
```

---

## The `NotificationStatusBar` — `nWq`

**Location:** `chunks.182.mjs:1642`

```javascript
// READABLE summary of nWq:
function NotificationStatusBar({
    apiKeyStatus,       // "valid" | "invalid" | "missing"
    autoUpdaterResult,  // { hasUpdate, version, ... }
    debug,              // boolean
    isAutoUpdating,     // boolean
    verbose,            // boolean - shows token count
    messages,           // for token calculation
    onAutoUpdaterResult, onChangeIsUpdating,
    ideSelection,       // IDE file selection info
    mcpClients,         // MCP client configurations
    isInputWrapped      // external editor mode
}) {
    // Notification system: rotate through current notification
    let currentNotification = notificationStore.current;

    return (
        <Container>
            <Row>
                {/* MCP / IDE status indicator */}
                <IDEStatusComponent ideSelection={ideSelection} mcpClients={mcpClients} />

                {/* Current rotating notification (jsx or text) */}
                {currentNotification && (
                    "jsx" in currentNotification
                        ? <Component>{currentNotification.jsx}</Component>
                        : <Text color={currentNotification.color} dim={!currentNotification.color}>
                              {currentNotification.text}
                          </Text>
                )}

                {/* Usage overage indicator */}
                {isUsingOverage && !isTeamAccount && <Text dim>Now using extra usage</Text>}

                {/* Auth errors */}
                {(apiKeyStatus === "invalid" || apiKeyStatus === "missing") &&
                    <Text color="error">Not logged in · Run /login</Text>}

                {/* Debug mode */}
                {debug && <Text color="warning">Debug mode</Text>}

                {/* Token count in verbose mode */}
                {apiKeyStatus === "valid" && verbose && <Text dim>{tokenCount} tokens</Text>}

                {/* Token usage bar + model name */}
                <TokenUsageBar tokenUsage={tokenCount} model={currentModel} />
            </Row>
        </Container>
    );
}
```

**Notification priorities (rendered in sequence):**
1. IDE/MCP status indicator — always shown if IDE integration active
2. Current notification — MCP errors, auto-updates, token warnings (rotated from notification queue)
3. Usage overage — when on non-team plan and using overage tokens
4. Auth error — "Not logged in · Run /login" in red
5. Debug mode indicator — in yellow
6. Token count — in verbose mode only
7. Token usage bar + model name — always shown

**Notifications that appear in `nWq`'s rotating queue:**
Per the official docs: "MCP server errors, auto-updates, and token warnings." These are the "System notifications" that "display on the right side of the same row as your status line."

---

## Tip/Hint System Integration

**Location:** `chunks.176.mjs:1329-1332`

```javascript
{
    id: "status-line",
    content: async () => "Use /statusline to set up a custom status line that will display beneath the input box",
    cooldownSessions: 25,         // Show at most once every 25 sessions
    isRelevant: async () => getSettings().statusLine === void 0  // Only when not configured
}
```

This integrates with the rotating tip system. After 25 sessions without a status line configured, the user sees a hint about `/statusline`. `cooldownSessions: 25` prevents this from appearing too frequently while still surfacing the feature.

Once the status line is configured (`settings.statusLine !== undefined`), `isRelevant` returns false and the tip is permanently suppressed.

---

## Settings Schema

**Location:** `chunks.15.mjs:529-533`

```javascript
// Zod validation schema:
statusLine: z.object({
    type: z.literal("command"),     // Only "command" type supported
    command: z.string(),            // Shell command or path to script
    padding: z.number().optional()  // Extra horizontal spacing (characters)
}).optional()
.describe("Custom status line display configuration")
```

**Why only `type: "command"`:**
The schema enforces a single type via `z.literal`. There's no `type: "function"` or other variant. This keeps the feature orthogonal to the JavaScript hook system (`type: "function"`) and ensures consistent behavior: status line scripts are always shell processes.

**`padding`:**
Maps to `paddingX: padding` on the Ink `Box` container. Defaults to `0`. The setup agent can set this (e.g., `padding: 2`) when generating scripts that look better with extra indentation.

---

## State Management

### Global Store Entry

**Location:** `chunks.151.mjs:428` and `chunks.189.mjs:1621`

```javascript
// Both store initializations set:
statusLineText: void 0,  // undefined = nothing to display
```

The `statusLineText` store key holds the current rendered output from the script. The render path checks `z && ...` — any falsy value (undefined, null, empty string, 0) results in nothing displayed.

**Why global Zustand state (not local useState):**
1. Persists across component unmount/remount cycles (e.g., vim mode toggle momentarily unmounts the input area)
2. Consistent with other UI state patterns in the codebase
3. The no-op guard `if (state.statusLineText === output) return state` prevents spurious re-renders when the script output is unchanged

---

## Telemetry

**Event:** `"tengu_status_line_mount"` — fires once on component mount

```javascript
telemetry("tengu_status_line_mount", {
    command_length: config.command.length,  // proxy for complexity
    padding: config.padding                 // padding usage
})
```

Privacy-conscious: records command length (not the command itself) and padding value. This tells Anthropic whether users write short inline commands or long script paths, and whether they use padding.

---

## Complete Data Flow Diagram

```
User types /statusline [args]
           │
           ▼
E3z.getPromptForCommand(args)
  ├── trackSlashCommandUsage("statusline")   [u8()]
  └── returns [{ type:"text", text:"Create a Task with subagent_type statusline-setup..." }]
           │
           ▼ (injected into LLM conversation as user message)
Parent Claude instance processes message
  └── calls Task(subagent_type="statusline-setup", prompt="...")
           │
           ▼ (Task tool resolves agent via APA() → En7)
statusline-setup subagent launches
  Tools: [Read, Edit]
  Model: sonnet
  System prompt: PS1 translation table + JSON schema + guidelines
  │
  ├── Read ~/.zshrc / ~/.bashrc / ~/.bash_profile / ~/.profile
  ├── Extract PS1 with regex: /(?:^|\n)\s*(?:export\s+)?PS1\s*=\s*["']([^"']+)["']/m
  ├── Translate PS1 escapes → shell commands (\u → $(whoami), etc.)
  ├── Strip trailing $ or >
  ├── (optionally) Write ~/.claude/statusline-command.sh
  └── Edit ~/.claude/settings.json
      → { "statusLine": { "type":"command", "command":"...", "padding":N } }
           │
           ▼ (settings.json updated; C8() reads fresh on next call)
User sends next message → React re-renders
           │
           ▼ (chunks.184.mjs:70 evaluates mount condition)
mode === "prompt" && !exitMessage.show && !isPasting && ugA(settings)
  → mounts YZq(StatusLineComponent, { messages, vimMode })
           │
           ▼
YZq mounts:
  useEffect[] fires → runUpdate() immediately
  useEffect[mount] → telemetry("tengu_status_line_mount", ...)
           │
           ▼
runUpdate():
  1. KZq(messages)               → lastAssistantMessageId (null on first run)
  2. kw6(messages)               → exceeds200kTokens (false initially)
  3. Zjz(permMode, false, settings, messages, vimMode):
     ├── PN1()                   → agentName = o6.mainThreadAgentType
     ├── $71({...})              → modelId (Opus/Haiku/Sonnet depending on mode)
     ├── Ew6(messages)           → currentUsage = last API token counts (null)
     ├── yG(modelId, fallback)   → contextWindowSize (200000)
     ├── mcA(null, 200000)       → { used: null, remaining: null }
     ├── aX()                    → { session_id, transcript_path, cwd }
     └── returns full payload JSON object
  4. JyA(payload, abortSignal):
     ├── C8() → disableAllHooks? → NO
     ├── statusLineConfig present? → YES
     ├── Q1(payload) → JSON string
     └── BW6(config, "StatusLine", "statusLine", json, signal, env):
         ├── spawn(command, [], {shell:true, cwd, env+CLAUDE_PROJECT_DIR})
         ├── write JSON to process.stdin
         ├── stdin.end()
         ├── wait for exit (signal.abort cancels after 5s)
         └── return {status:0, stdout:"...", stderr:"..."}
  5. normalize stdout → "output string"
  6. updateStore({statusLineText: "output string"})
           │
           ▼
React re-render (statusLineText changed):
  Box(paddingX=padding, gap=2)
  └── Text(dimColor=true)
      └── StatusText(W3)  ← memoized renderer
          └── "output string"   ← visible to user
           │
           ▼
Next assistant message arrives:
  useEffect[messages] fires
  KZq(messages) !== cacheRef.messageId → scheduleUpdate()
  → setTimeout(300ms, runUpdate())
  → repeat cycle
```

---

## Key Design Decisions and Trade-offs

### Decision 1: Slash command as `type: "prompt"` (not `"local"`)
**Trade-off:** Extra LLM inference step vs. direct JS execution.
**Why:** Handles arbitrary natural language args — `/statusline show git branch in red` and `/statusline remove` both work without argument parsing code. The LLM acts as a natural language argument parser for free.

### Decision 2: Dedicated subagent for setup
**Trade-off:** Subagent overhead (model inference + tools) vs. hardcoded JS logic.
**Why:** The setup requires reading real user files, understanding user-specific PS1 syntax, and making contextual decisions about color codes. These are reasoning tasks unsuitable for deterministic code. The subagent approach makes the feature configurable without shipping new code.

### Decision 3: Shell script execution (not in-process JS)
**Trade-off:** Process startup overhead (~30-100ms) per update vs. instant in-process execution.
**Why:** Language-agnostic (users can write in Python, Ruby, Node.js), enables any system tool (git, date, hostname), no Node.js API bindings needed. The debounce and abort mechanisms manage the overhead.

### Decision 4: 300ms debounce
**Trade-off:** Status line lags by up to 300ms after each message.
**Why:** During token streaming, the messages array can update dozens of times per second. The debounce coalesces bursts into a single process spawn. 300ms is imperceptible to humans for a non-interactive display element.

### Decision 5: Abort in-flight executions
**Trade-off:** Potentially never completes during rapid message sequences.
**Why:** Stale script output is worse than blank. The 300ms debounce ensures the in-flight execution completes before the next update fires in normal usage. Only pathologically rapid updates would cause repeated cancellations.

### Decision 6: `dimColor: true` rendering
**Trade-off:** Status line is always visually subdued (dimmed).
**Why:** Creates visual hierarchy — conversation content is primary, status bar is secondary. Users who need bright output can use bold ANSI escape codes (`\033[1m`) which override terminal dimming. The setup agent's system prompt mentions this explicitly so generated scripts can account for it.

### Decision 7: `disableAllHooks` also disables status line
**Trade-off:** Users with `disableAllHooks: true` lose the status line silently.
**Why:** The status line uses the same command-execution infrastructure as hooks (`BW6`). Consistent policy: if you've disabled all external processes, that includes the status line. A warning is logged (`level: "warn"`) but not surfaced to the UI — it's expected behavior, not an error.

### Decision 8: Caching `exceeds200kTokens` per `messageId`
**Trade-off:** Slightly more complex code vs. repeated O(n) message scans.
**Why:** The `kw6` scan iterates all messages backwards. For a 500-turn conversation, this is 500 iterations per debounce. Caching it per `messageId` means it only recomputes when there's a new API response, not on every vim mode toggle or permission mode change.
