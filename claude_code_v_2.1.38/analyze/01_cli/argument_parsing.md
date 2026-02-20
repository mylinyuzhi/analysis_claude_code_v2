# CLI Argument Parsing

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI Module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - State Management

Key functions in this document:
- `commanderSetup` (aGz) - Main argument definition function in chunks.190.mjs:999
- `mainEntry` (nGz) - Validation and post-processing in chunks.189.mjs:931
- `cliEntry` (qZz) - Entry dispatch after commander parse in chunks.190.mjs:167

---

## Overview

Claude Code v2.1.38 uses `commander` (obfuscated `UT6`) as its CLI framework. Argument definitions live in `commanderSetup` (`aGz`, chunks.190.mjs:999), and the bulk of validation and cross-flag consistency checking runs inside `mainEntry` (`nGz`, chunks.189.mjs:931) immediately after commander parses `process.argv`.

The argument surface has grown substantially beyond what casual users see in `--help`. Roughly half of all flags are hidden from help output using commander's `.hideHelp()` method. This document catalogues every flag, its parser type, its visibility, the validation rules that govern it, and the design rationale behind each decision.

---

## 1. Flag Type System

Before the flag inventory, understanding commander's three parsing patterns is essential because they determine what values the rest of the code actually receives.

### Pattern A: `() => !0` (boolean-always-true parser)

**What it does:** Returns `true` regardless of any string the shell passes in. The flag is a pure on/off switch.

**How it works:**
1. Commander calls the argParser function with whatever the user typed after the flag (or nothing).
2. The function ignores its argument entirely and returns `true`.
3. The options object always holds boolean `true`, never `"true"` (string).

**Why this approach:** Avoids the subtle commander.js bug where `--flag` gives the string `"true"` and `--flag false` is misinterpreted. Explicit coercion to primitive `true` makes downstream `if (options.print)` checks unambiguous.

**Key insight:** Flags using this pattern cannot accept values at all. Any text after them is treated as the next positional argument, not as a flag value.

Flags using this pattern:
- `--print` / `-p`
- `--verbose`
- `--dangerously-skip-permissions`
- `--fork-session`
- `--ide`
- `--strict-mcp-config`
- `--disable-slash-commands`
- `--init-only`
- `--maintenance`
- `--include-partial-messages`
- `--replay-user-messages`
- `--enable-auth-status`

### Pattern B: `(w) => w || !0` (value-or-true parser)

**What it does:** Returns the user-supplied string value when one is given, or `true` when the flag is bare.

**How it works:**
1. If user writes `--resume abc123`, commander calls parser with `"abc123"` and the function returns `"abc123"`.
2. If user writes `--resume` alone, commander calls parser with `undefined` or the next positional; since falsy, `|| !0` returns `true`.

**Why this approach:** Some flags are meaningful both ways. `--resume` alone opens an interactive picker (so `true` signals "pick for me"), while `--resume <id>` jumps directly to a session. A single coercion handles both modes cleanly.

Flags using this pattern:
- `--resume` / `-r`
- `--from-pr`

### Pattern C: Custom parsers (validated coercion)

**What it does:** Validates the user's input against a domain rule before storing it.

Flags using custom parsers:
- `--max-budget-usd`: Must be a positive number.
- `--effort`: Must be one of four allowed strings.
- `--debug-to-stderr`: `argParser(Boolean)` — converts string `"true"`/`"false"`.
- `--max-thinking-tokens`: `argParser(Number)` — converts to integer.
- `--max-turns`: `argParser(Number)` — converts to integer.
- `--debug [filter]`: Commander's optional-value syntax; argParser discards the filter string and returns `true` (the filter capability exists in code but is unused in 2.1.38).

---

## 2. Complete Flag Inventory

Flags are grouped by functional category. Each entry notes: visibility (visible/hidden in `--help`), parser type, and whether print mode is required.

### 2.1 Execution Modes

**`-p, --print`** (visible, Pattern A)
Non-interactive mode. Prints the response and exits without opening the TUI. Automatically skips all trust dialogs. Most of the "print-only" constraint flags (--max-turns, --max-budget-usd, etc.) depend on this being set. Sets internal boolean `z1` in `mainEntry`.

**`--init`** (hidden, Pattern A)
Runs Setup hooks with the `init` trigger, then continues into the normal session. Intended for first-run initialization flows where hook authors need to perform one-time setup (writing config files, downloading dependencies, etc.) before the real session begins.

**`--init-only`** (hidden, Pattern A)
Runs Setup hooks followed by SessionStart hooks, then exits without starting a session. Used in CI/automation to verify that hook setup succeeds before committing to a full run.

**`--maintenance`** (hidden, Pattern A)
Runs Setup hooks with the `maintenance` trigger variant. Distinct from `init` to allow hook authors to differentiate between first-run setup and periodic maintenance (e.g., package updates, cache invalidation).

**`-c, --continue`** (visible, boolean)
Continues the most recent conversation in the current directory by loading its transcript. Mutually exclusive with `--resume`.

**`-r, --resume [value]`** (visible, Pattern B)
Resumes a conversation by Session ID (when value is a string) or opens an interactive picker (when bare). Mutually exclusive with `--continue`.

**`--fork-session`** (visible, Pattern A)
When resuming or continuing, creates a new Session ID rather than reusing the original. This preserves the original branch while allowing the current session to diverge. Required when `--session-id` is combined with `--continue` or `--resume`.

**`--from-pr [value]`** (hidden, Pattern B)
Resumes a session linked to a specific pull request. When given a PR number or URL, it looks up the associated session; when bare, opens a picker filtered to sessions with linked PRs.

**`--teleport [session]`** (hidden, optional string)
Resumes a "teleport" session — a remote-hosted session that can be picked up from a different machine. The session identifier is typically a teleport URL or token rather than a local Session ID.

**`--remote [description]`** (hidden, optional string)
Creates a remote session via SSH tunnel. The optional description appears in session listings for identification.

**`--resume-session-at <message-id>`** (hidden, required string)
When resuming a session, replays only messages up to and including the specified assistant message ID. Allows re-running from a midpoint of an earlier conversation. Must be used with `--resume` in print mode.

**`--rewind-files <user-message-id>`** (hidden, required string)
Restores all files modified since the specified user message to their state at that point in time, then exits. Requires `--resume`. A destructive operation used for automated rollback scenarios.

**`--no-session-persistence`** (hidden, Pattern A)
Disables writing the conversation transcript to disk. Validated: can only be used with `--print`. Useful for ephemeral automation where transcript storage is unwanted or forbidden.

**`--session-id <uuid>`** (hidden, required string)
Forces a specific UUID as the Session ID for the new conversation. Validated: must be a valid UUID format; must not collide with an already-in-use session. Cannot be combined with `--continue`/`--resume` unless `--fork-session` is also set.

### 2.2 Configuration and Models

**`--model <model>`** (visible, string)
Specifies the model alias (e.g., `sonnet`, `opus`) or full model ID. Overrides the model in settings.

**`--fallback-model <model>`** (hidden, string)
Designates an automatic fallback when the primary model returns an overload error (HTTP 529). Print mode only. Validated: cannot be the same as `--model`. The fallback is typically a smaller, more available model (e.g., `haiku` when primary is `opus`).

**`--effort <level>`** (visible, custom parser)
Sets the reasoning effort level. Custom parser validates against the allowed list: `["low", "medium", "high", "max"]`. Throws `kXq` (a Commander-specific error class) if an invalid value is given, which triggers commander's built-in error message. The `max` level has additional runtime restrictions (see Validation section).

**`--betas <betas...>`** (hidden, variadic string)
Beta header names to append to every API request. Restricted to API key users only (not claude.ai subscribers). Allows early access to pre-release model capabilities without waiting for a version update.

**`--settings <file>`** (visible, string)
Path to a JSON settings file or a raw JSON string. Merges with the user's normal settings.

**`--setting-sources <sources>`** (hidden, string)
Comma-separated list limiting which setting source layers are loaded: `user`, `project`, `local`. Useful in locked-down environments where only a specific layer should apply.

**`--agent <agent>`** (visible, string)
Overrides the agent type from settings. Controls which built-in agent configuration is used.

**`--agents <json>`** (hidden, string)
A JSON object defining custom named agents with `description` and `prompt` fields. Example:
```
'{"reviewer": {"description": "Reviews code", "prompt": "You are a code reviewer"}}'
```
Allows programmatic injection of custom agent personas without requiring a settings file.

**`--system-prompt <prompt>`** (visible, string)
Sets the system prompt directly. Mutually exclusive with `--system-prompt-file` and `--append-system-prompt`/`--append-system-prompt-file`.

**`--system-prompt-file <file>`** (hidden, string)
Reads the system prompt from a file. Mutually exclusive with `--system-prompt` and append variants.

**`--append-system-prompt <prompt>`** (hidden, string)
Appends additional content to the existing system prompt. Mutually exclusive with `--append-system-prompt-file` and the non-append system prompt flags.

**`--append-system-prompt-file <file>`** (hidden, string)
Reads append content from a file. Mutually exclusive with `--append-system-prompt` and non-append variants.

### 2.3 Input and Output Formats

**`--output-format <fmt>`** (visible, string)
Controls the output serialization. Three values:
- `text` (default) — plain text for human consumption
- `json` — structured JSON result object written after completion
- `stream-json` — newline-delimited JSON events streamed as they occur

**`--input-format <fmt>`** (visible, string)
Controls how stdin is interpreted. Two values:
- `text` (default) — raw text becomes the user message
- `stream-json` — stdin is expected to be a stream of JSON event objects (SDK integration mode)

**`--json-schema <schema>`** (visible, string)
A JSON Schema string. When provided, the model's response is validated against this schema and the output is forced to `json` format. Used for structured data extraction workflows.

**`--include-partial-messages`** (hidden, Pattern A)
Emits partial message chunks in `stream-json` output as they arrive, rather than only emitting complete messages. Validated: requires both `--print` and `--output-format=stream-json`. Essential for real-time progress display in SDK consumers.

**`--replay-user-messages`** (hidden, Pattern A)
Re-emits each user message received on stdin back to stdout as an acknowledgment event before processing it. Requires `stream-json` on both input and output formats. Used by SDK consumers that need explicit confirmation the message was received before waiting for the assistant response.

### 2.4 Tools and MCP

**`--tools <tools...>`** (visible, variadic string)
The master tool allow-list. Pass `""` (empty string) to disable all tools, or `"default"` to enable the default built-in set. Individual tool names restrict to exactly those tools.

**`--allowed-tools <tools...>`** (visible, variadic string)
Adds tools to the allow-list without replacing the default set. Additive with `--tools`.

**`--disallowed-tools <tools...>`** (visible, variadic string)
Removes tools from the allow-list. Processed after `--tools` and `--allowed-tools`.

**`--add-dir <directories...>`** (visible, variadic string)
Grants tool access (read/write) to additional directories beyond the default working directory. Multiple values are accepted. Useful when the agent needs to read from one repository and write to another.

**`--mcp-config <configs...>`** (visible, variadic string)
Loads MCP server definitions from JSON files or inline JSON strings. Multiple values are merged.

**`--strict-mcp-config`** (visible, Pattern A)
When set, only the MCP servers from `--mcp-config` are used; all servers from user/project config files are ignored. Provides hermetic control over MCP connections in automated pipelines. Has enterprise guard: cannot be used when an enterprise MCP config is present.

**`--plugin-dir <paths...>`** (hidden, variadic string)
Loads plugins from the specified directories at startup. Repeatable. Bypasses the normal plugin discovery mechanism.

**`--chrome` / `--no-chrome`** (visible, boolean pair)
Enables or explicitly disables the Claude-in-Chrome browser integration. `--no-chrome` takes precedence.

**`--permission-prompt-tool <tool>`** (hidden, string)
Specifies an MCP tool name that should be called when a permission prompt would normally appear. Allows programmatic permission approval in headless integrations — the named tool receives the permission request and returns an approval or denial.

### 2.5 Debug and Permissions

**`-d, --debug [filter]`** (visible, custom)
Enables debug mode. The optional filter string is accepted by commander but the filter value is discarded in 2.1.38 — the parser returns `true` regardless of what follows the flag. Full debug output is always enabled when the flag is present.

**`-d2e, --debug-to-stderr`** (hidden, `argParser(Boolean)`)
Redirects all debug log output to stderr instead of the normal debug log file. Used when integrating Claude Code into pipelines where stdout must remain clean.

**`--debug-file <path>`** (visible, string)
Writes debug output to a specific file path in addition to or instead of the default location.

**`--verbose`** (visible, Pattern A)
Enables verbose logging. When set by the user, it also suppresses some auto-verbose behaviors that would otherwise activate in SDK URL mode.

**`--permission-mode <mode>`** (visible, string)
Sets the permission strategy. Valid values include `bypassPermissions` (skips all checks) and mode strings that map to configured MCP permission handlers.

**`--dangerously-skip-permissions`** (visible, Pattern A)
Enables the permission bypass as an available option but does not necessarily activate it immediately. The intent is to allow runtime switching into bypass mode for automated contexts that need to confirm the sandbox is present before committing to bypass. Distinct from `--permission-mode bypassPermissions` in that the latter activates immediately.

**`--allow-dangerously-skip-permissions`** (hidden, Pattern A)
Makes the `--dangerously-skip-permissions` bypass mode available as a runtime-switchable option. The flag itself doesn't skip permissions; it unlocks the ability to do so.

**`--enable-auth-status`** (hidden, Pattern A)
Enables auth status messages in SDK stream-json output. Adds authentication state change events to the event stream, useful for SDK consumers that need to handle re-authentication flows.

### 2.6 Constraints and Limits

**`--max-thinking-tokens <n>`** (hidden, `argParser(Number)`)
Caps the thinking token budget at `n`. Print mode only. Allows fine-grained control over reasoning depth when cost or latency is a concern.

**`--max-turns <n>`** (hidden, `argParser(Number)`)
Limits the number of agent turns (tool-use/response cycles) before forced exit. Print mode only. Prevents runaway agents in automated pipelines.

**`--max-budget-usd <amount>`** (hidden, custom parser)
Sets a dollar ceiling on API spend for the session. Print mode only. The custom parser enforces `> 0`:

```javascript
// ============================================
// maxBudgetParser - Validates max-budget-usd flag value
// Location: chunks.189.mjs (near commanderSetup)
// ============================================

// ORIGINAL (for source lookup):
(w) => { let H = Number(w); if (isNaN(H) || H <= 0) throw Error("--max-budget-usd must be a positive number greater than 0"); return H }

// READABLE (for understanding):
(inputStr) => {
    let amount = Number(inputStr);
    if (isNaN(amount) || amount <= 0) {
        throw Error("--max-budget-usd must be a positive number greater than 0");
    }
    return amount;
}

// Mapping: w→inputStr, H→amount
```

**Why positive-only:** A budget of zero would immediately abort every request, which is never the user's intent. The constraint prevents a common configuration mistake.

### 2.7 SDK and Remote Integration

**`--sdk-url <url>`** (hidden, string)
Connects to an external SDK endpoint rather than spawning a local agent. When set, the following defaults are forced:
- `--input-format` → `stream-json`
- `--output-format` → `stream-json`
- `--verbose` → `true` (if not explicitly set)
- `--print` → `true` (if not explicitly set)

This is the core mechanism by which editor extensions and IDE plugins drive Claude Code as a backend service.

**`--mcp-cli`** (hidden, Pattern A)
Not a subcommand but a top-level flag. Starts an internal MCP CLI mode for programmatic communication over stdio. Used by IDE integrations that need to speak the MCP protocol directly with Claude Code.

**`--ide`** (hidden, Pattern A)
Automatically connects to an IDE on startup if exactly one valid IDE connection is available. If zero or multiple IDEs are found, the flag has no effect (no error). Designed for convenience in single-IDE setups.

**`--file <specs...>`** (hidden, variadic string)
Downloads file resources at startup. Format: `file_id:relative_path`. Requires the `CLAUDE_CODE_SESSION_ACCESS_TOKEN` environment variable. Used in cloud-hosted session contexts where files must be fetched before the agent can work with them.

### 2.8 Teammates and Swarm

All flags in this group are hidden.

**`--agent-id <id>`** — The UUID identifying this process as a specific teammate in a swarm.

**`--agent-name <name>`** — Display name for this teammate shown in swarm status views.

**`--team-name <name>`** — The team namespace for swarm coordination. All teammates sharing a team-name can communicate via the mailbox system.

**`--teammate-mode <mode>`** — Controls how new teammate processes are spawned. Values: `auto` (system chooses), `tmux` (tmux pane), `in-process` (shared process).

**Why all hidden:** These flags are set programmatically when Claude Code spawns child instances. Exposing them in `--help` would confuse users who would never set them manually.

### 2.9 Deprecated Flags

**`--mcp-debug`** (hidden)
Identical in effect to `--debug`. Kept for backward compatibility with scripts and configurations that used this flag before the debug system was unified. New code should use `--debug`.

### 2.10 Subcommand-Related Flags at Top Level

**`--disable-slash-commands`** (hidden, Pattern A)
Disables the entire slash command (skills) subsystem. No `/` commands will be available during the session. Used in locked-down environments or when the operator wants to prevent skill invocation.

**`--setting-sources <sources>`** (hidden, string)
Already listed in Section 2.2 but repeated here for context: this flag directly controls which layers of the settings hierarchy are consulted, enabling settings isolation without editing files.

---

## 3. Argument Validation Logic

All 15 cross-flag consistency checks run sequentially in `mainEntry` (`nGz`, chunks.189.mjs) after commander parses `process.argv`. The order is significant: early checks can short-circuit later ones.

### Validation 1: Single-Word Prompt Detection

**Location:** chunks.189.mjs:1029-1031

```javascript
// ============================================
// singleWordPromptTelemetry - Fires telemetry when prompt has no spaces
// Location: chunks.189.mjs:1029-1031
// ============================================

// ORIGINAL (for source lookup):
if (w && typeof w === "string" && !/\s/.test(w) && w.length > 0)
    c("tengu_single_word_prompt", { length: w.length });

// READABLE (for understanding):
if (promptText && typeof promptText === "string" && !/\s/.test(promptText) && promptText.length > 0) {
    trackTelemetry("tengu_single_word_prompt", { length: promptText.length });
}

// Mapping: w→promptText, c→trackTelemetry
```

**What it does:** Fires a telemetry event when the user provides a prompt with no whitespace characters.

**Why this matters:** Single-word prompts are a telemetry signal for accidental invocations. A user who types `claude fix` intends a two-word command, but a user who types `claude` followed by `fix` as a bare shell word may have made a shell-quoting mistake. This telemetry helps the team understand misuse patterns without blocking the request.

**Key insight:** This is a pure telemetry check — it does not alter behavior. The prompt is still processed normally.

### Validation 2: "code" Prompt Trap

**Location:** chunks.189.mjs:1028

```javascript
// ============================================
// codePromptTrap - Silently ignores prompt="code" to catch common mistake
// Location: chunks.189.mjs:1028
// ============================================

// ORIGINAL (for source lookup):
if (w === "code") c("tengu_code_prompt_ignored", {}), console.warn(...), w = void 0;

// READABLE (for understanding):
if (promptText === "code") {
    trackTelemetry("tengu_code_prompt_ignored", {});
    console.warn("'code' is not a valid prompt. Did you mean to just run `claude`?");
    promptText = undefined;
}

// Mapping: w→promptText, c→trackTelemetry
```

**What it does:** If the entire prompt is the string `"code"`, it is discarded and replaced with `undefined`, which causes Claude Code to start in interactive mode rather than sending "code" as a message.

**Why this happens:** New users often try to launch Claude Code as `claude code`, thinking `code` is a subcommand (similar to VS Code's `code .`). Without this trap, Claude Code would send `"code"` as a literal prompt to the model, producing a confusing response. The trap converts this into a normal interactive session.

**Key insight:** This is a UX guardrail that catches the single most common first-time user mistake without requiring a formal subcommand handler.

### Validation 3: SDK URL Forces stream-json Defaults

**Location:** chunks.189.mjs:1091-1096

```javascript
// ============================================
// sdkUrlDefaultEnforcer - Forces stream-json when SDK URL is set
// Location: chunks.189.mjs:1091-1096
// ============================================

// ORIGINAL (for source lookup):
if (D1) {
    if (!b) b = "stream-json";
    if (!m) m = "stream-json";
    if (H.verbose === void 0) g = !0;
    if (!H.print) U = !0
}

// READABLE (for understanding):
if (sdkUrl) {
    if (!inputFormat) inputFormat = "stream-json";
    if (!outputFormat) outputFormat = "stream-json";
    if (options.verbose === undefined) verboseEnabled = true;
    if (!options.print) printMode = true;
}

// Mapping: D1→sdkUrl, b→inputFormat, m→outputFormat, H→options, g→verboseEnabled, U→printMode
```

**What it does:** When `--sdk-url` is provided, all four SDK-required defaults are applied if not already explicitly set by the user.

**Why this approach:** SDK URL mode is meaningless without stream-json I/O — the entire point is machine-readable event streaming. Rather than requiring the caller to always specify all four flags, the defaults are applied automatically. The `if (!b)` guard ensures an explicit `--input-format=text` is never overridden.

**Key insight:** The verbose default (`H.verbose === void 0`) uses strict undefined check rather than falsy check. This distinguishes between "user did not set verbose" (undefined) and "user explicitly set verbose=false" (false). The distinction matters because SDK mode normally wants verbose, but an explicit `--no-verbose` should be respected.

### Validation 4: Session ID + Continue/Resume Requires fork-session

**Location:** chunks.189.mjs:1101-1108

```javascript
// ============================================
// sessionIdConflictGuard - Validates session-id usage with continue/resume
// Location: chunks.189.mjs:1101-1108
// ============================================

// ORIGINAL (for source lookup):
if (N) {
    if ((H.continue || H.resume) && !H.forkSession)
        process.stderr.write(H6.red("Error: --session-id can only be used with --continue or --resume if --fork-session is also specified."))
    let TA = xv(N);
    if (!TA) process.stderr.write(H6.red("Error: Invalid session ID. Must be a valid UUID."))
    if (zm1(TA)) process.stderr.write(H6.red(`Error: Session ID ${TA} is already in use.`))
}

// READABLE (for understanding):
if (sessionId) {
    if ((options.continue || options.resume) && !options.forkSession) {
        process.stderr.write(chalk.red("Error: --session-id can only be used with --continue or --resume if --fork-session is also specified."));
    }
    let parsed = parseUuid(sessionId);
    if (!parsed) {
        process.stderr.write(chalk.red("Error: Invalid session ID. Must be a valid UUID."));
    }
    if (isSessionInUse(parsed)) {
        process.stderr.write(chalk.red(`Error: Session ID ${parsed} is already in use.`));
    }
}

// Mapping: N→sessionId, H→options, xv→parseUuid, zm1→isSessionInUse, TA→parsed, H6→chalk
```

**What it does:** Three sub-checks in sequence:
1. If `--session-id` is combined with `--continue`/`--resume` without `--fork-session`, reject.
2. Validate that the value is a well-formed UUID.
3. Verify the UUID is not already active in another process.

**Why the fork-session requirement:** `--continue` and `--resume` load an existing session's transcript. If a new `--session-id` is forced simultaneously, two sessions would claim the same state. `--fork-session` explicitly signals "copy the transcript into a new session," making the intent unambiguous.

**Why check in-use sessions:** Two processes writing to the same session simultaneously would corrupt the transcript. The in-use check prevents this race condition.

### Validation 5: --file Requires Session Access Token

**Location:** chunks.189.mjs:1113-1125

**What it does:** If `--file <specs...>` is provided but `CLAUDE_CODE_SESSION_ACCESS_TOKEN` is not set, emits an error to stderr and exits.

**Why this design:** The `--file` flag downloads resources from a cloud file storage service. This service requires authentication via the session token. Attempting to download without a token would produce an opaque network error; the explicit validation produces a clear, actionable message.

### Validation 6: Fallback Model Cannot Equal Primary Model

**Location:** chunks.189.mjs:1128-1129

```javascript
// ============================================
// fallbackModelIdentityCheck - Prevents fallback=primary model config
// Location: chunks.189.mjs:1128-1129
// ============================================

// ORIGINAL (for source lookup):
if (G && H.model && G === H.model)
    process.stderr.write(H6.red("Error: Fallback model cannot be the same as the main model."))

// READABLE (for understanding):
if (fallbackModel && options.model && fallbackModel === options.model) {
    process.stderr.write(chalk.red("Error: Fallback model cannot be the same as the main model."));
}

// Mapping: G→fallbackModel, H→options, H6→chalk
```

**What it does:** Rejects configurations where `--fallback-model` equals `--model`.

**Why this matters:** A fallback to the same model provides no resilience — if the primary is overloaded, the "fallback" would be equally unavailable. This catches a common copy-paste mistake where a user specifies a full model ID in both flags.

**Key insight:** The check only fires when both flags are explicitly set. If only `--model` is set (no fallback), or only `--fallback-model` is set (primary is from settings), the check is skipped. Identity is checked by string equality on the canonical model ID after alias resolution.

### Validation 7: Effort "max" Restrictions

**Location:** chunks.189.mjs:1130-1133

```javascript
// ============================================
// effortMaxRestrictions - Two-condition block for effort=max
// Location: chunks.189.mjs:1130-1133
// ============================================

// ORIGINAL (for source lookup):
if (H.effort === "max" && (!z1 || i8())) {
    let TA = !z1 ? 'Effort level "max" is not available in interactive mode.'
               : 'Effort level "max" is not available for Claude.ai subscribers.';
    yl(TA)
}

// READABLE (for understanding):
if (options.effort === "max" && (!printMode || isClaudeAiSubscriber())) {
    let errorMessage = !printMode
        ? 'Effort level "max" is not available in interactive mode.'
        : 'Effort level "max" is not available for Claude.ai subscribers.';
    exitWithError(errorMessage);
}

// Mapping: H→options, z1→printMode, i8→isClaudeAiSubscriber, TA→errorMessage, yl→exitWithError
```

**What it does:** Blocks `--effort max` under two independent conditions:
1. Interactive mode (no `--print`): `max` effort is unavailable.
2. Claude.ai subscriber accounts: `max` effort is unavailable regardless of mode.

**Why two separate restrictions:**

The interactive-mode restriction exists because `max` effort triggers extended thinking with very large token budgets. In interactive mode, this would create extremely long waiting times with no progress feedback — a poor UX. Print mode callers are expected to handle long waits programmatically.

The subscriber restriction exists because `max` effort uses API features that are only accessible via API key billing, not through the Claude.ai subscription. The subscriber check (`i8()`) queries the auth state to distinguish the two billing modes.

**Key insight:** The conditions use OR (`!z1 || i8()`), meaning either condition alone is sufficient to block. The error message text is chosen based on which condition triggered, giving the user a specific actionable explanation.

### Validation 8: System Prompt Mutual Exclusion

**Location:** chunks.189.mjs:1135-1148

**What it does:** `--system-prompt` and `--system-prompt-file` are mutually exclusive. If both are provided, emits an error. Similarly, each is mutually exclusive with the append variants (`--append-system-prompt`, `--append-system-prompt-file`).

**Why:** The system prompt is a single string. Allowing both a full replacement and an append simultaneously creates ambiguous ordering. The explicit mutual exclusion forces the caller to decide which semantics they want.

### Validation 9: Append System Prompt Mutual Exclusion

**Location:** chunks.189.mjs:1149-1162

**What it does:** `--append-system-prompt` and `--append-system-prompt-file` are mutually exclusive with each other (can only pick one source for the append content).

### Validation 10: stream-json Consistency

**Location:** chunks.189.mjs:1294-1295

```javascript
// ============================================
// streamJsonConsistency - Enforces stream-json requires stream-json output
// Location: chunks.189.mjs:1294-1295
// ============================================

// ORIGINAL (for source lookup):
if (b === "stream-json" && m !== "stream-json")
    console.error("Error: --input-format=stream-json requires output-format=stream-json.")

// READABLE (for understanding):
if (inputFormat === "stream-json" && outputFormat !== "stream-json") {
    console.error("Error: --input-format=stream-json requires output-format=stream-json.");
}

// Mapping: b→inputFormat, m→outputFormat
```

**What it does:** Blocks the combination of `stream-json` input format with non-stream-json output format.

**Why:** The stream-json input format delivers a sequence of structured events to the process. If the output format is plain `text` or `json`, the process would be unable to emit corresponding structured events back to the SDK consumer. The protocol only works when both sides are stream-json.

### Validation 11: SDK URL Requires Both stream-json

**Location:** chunks.189.mjs:1296-1298

**What it does:** If `--sdk-url` is set but after all defaults are applied the formats are not both `stream-json`, emits an error.

**Why:** This is a belt-and-suspenders check after Validation 3. Even though Validation 3 sets stream-json defaults for sdk-url, a caller could explicitly override with `--output-format=text`. This validation catches that override and rejects the inconsistent config.

### Validation 12: replay-user-messages Requires stream-json

**Location:** chunks.189.mjs:1299-1301

**What it does:** `--replay-user-messages` is only meaningful when both input and output are `stream-json`.

**Why:** The replay mechanism re-emits user message events on the output stream. If the output is not stream-json, there is no event stream to emit on. The input must also be stream-json because the replay mechanism reads structured input events.

### Validation 13: include-partial-messages Requirements

**Location:** chunks.189.mjs:1302-1304

```javascript
// ============================================
// includePartialMessagesRequirements - Guards partial message streaming
// Location: chunks.189.mjs:1302-1304
// ============================================

// ORIGINAL (for source lookup):
if (Z1) {
    if (!z1 || m !== "stream-json")
        yl("Error: --include-partial-messages requires --print and --output-format=stream-json.")
}

// READABLE (for understanding):
if (includePartialMessages) {
    if (!printMode || outputFormat !== "stream-json") {
        exitWithError("Error: --include-partial-messages requires --print and --output-format=stream-json.");
    }
}

// Mapping: Z1→includePartialMessages, z1→printMode, m→outputFormat, yl→exitWithError
```

**What it does:** Requires that `--include-partial-messages` only be used with both `--print` and `--output-format=stream-json`.

**Why the double requirement:** Partial messages are streaming chunks from the model's token-by-token output. Emitting them requires:
1. A stream-json output channel to carry the chunk events.
2. Print mode because interactive mode's TUI already handles partial rendering internally — duplicating partial events to the stream would produce garbled output.

### Validation 14: no-session-persistence Requires print

**Location:** chunks.189.mjs:1305

```javascript
// ============================================
// sessionPersistenceRequiresPrint - Guards no-session-persistence flag
// Location: chunks.189.mjs:1305
// ============================================

// ORIGINAL (for source lookup):
if (H.sessionPersistence === !1 && !z1)
    yl("Error: --no-session-persistence can only be used with --print mode.")

// READABLE (for understanding):
if (options.sessionPersistence === false && !printMode) {
    exitWithError("Error: --no-session-persistence can only be used with --print mode.");
}

// Mapping: H→options, z1→printMode, yl→exitWithError
```

**What it does:** Blocks `--no-session-persistence` in interactive mode.

**Why:** In interactive mode, session persistence is how the user can `--continue` or `--resume` later. Disabling it interactively would silently erase the session without any warning, surprising the user. In print mode, the caller explicitly controls the conversation lifecycle and can opt out of persistence knowingly.

### Validation 15: Enterprise MCP Guards

**Location:** chunks.189.mjs:1269-1271

```javascript
// ============================================
// enterpriseMcpGuards - Blocks MCP config overrides in enterprise contexts
// Location: chunks.189.mjs:1269-1271
// ============================================

// ORIGINAL (for source lookup):
if (pg1()) {
    if (y1) process.stderr.write("You cannot use --strict-mcp-config when an enterprise MCP config is present")
    if (x1 && !hn4(x1)) process.stderr.write("You cannot dynamically configure MCP servers when an enterprise MCP config is present")
}

// READABLE (for understanding):
if (hasEnterpriseMcpConfig()) {
    if (strictMcpConfig) {
        process.stderr.write("You cannot use --strict-mcp-config when an enterprise MCP config is present");
    }
    if (mcpConfig && !isMcpConfigAllowedByEnterprise(mcpConfig)) {
        process.stderr.write("You cannot dynamically configure MCP servers when an enterprise MCP config is present");
    }
}

// Mapping: pg1→hasEnterpriseMcpConfig, y1→strictMcpConfig, x1→mcpConfig, hn4→isMcpConfigAllowedByEnterprise
```

**What it does:** When an enterprise MCP policy config is detected, blocks two operations:
1. `--strict-mcp-config` (would allow overriding the enterprise-mandated servers).
2. `--mcp-config` with servers that the enterprise policy does not explicitly allow.

**Why enterprise takes precedence:** Enterprise MCP configs are deployed by IT administrators to enforce security policies (e.g., only connecting to vetted MCP servers). If user flags could override them, the policy would be meaningless. The enterprise config layer is checked first; only configs it approves are permitted.

**Key insight:** The second guard uses `isMcpConfigAllowedByEnterprise` rather than a blanket ban. Enterprises can allowlist specific dynamic configs; this check distinguishes between an allowed dynamic addition and an unauthorized one.

---

## 4. Custom Effort Parser Deep Dive

The `--effort` flag uses a custom parser that integrates with commander's error-reporting system rather than writing to stderr manually:

```javascript
// ============================================
// effortArgParser - Validates and coerces --effort flag value
// Location: chunks.189.mjs (commanderSetup argParser for --effort)
// ============================================

// ORIGINAL (for source lookup):
(w) => {
    let H = ["low", "medium", "high", "max"];
    if (!H.includes(w)) throw new kXq(`It must be one of: ${H.join(", ")}`);
    return w
}

// READABLE (for understanding):
(inputValue) => {
    let allowedLevels = ["low", "medium", "high", "max"];
    if (!allowedLevels.includes(inputValue)) {
        throw new CommanderInvalidArgumentError(`It must be one of: ${allowedLevels.join(", ")}`);
    }
    return inputValue;
}

// Mapping: w→inputValue, H→allowedLevels, kXq→CommanderInvalidArgumentError
```

**What it does:** Throws `kXq` (commander's `InvalidArgumentError`) when the value is not in the allowed list.

**Why throw rather than write to stderr:** Commander catches `InvalidArgumentError` and formats it with the flag name, the bad value, and the hint message, producing:

```
error: option '--effort <level>' argument 'extreme' is invalid. It must be one of: low, medium, high, max
```

Throwing commander's error type produces better-formatted output than a manual `process.stderr.write` and also triggers commander's exit code logic correctly.

**Key insight:** The allowed list `["low", "medium", "high", "max"]` is defined inline inside the parser closure, not as a module-level constant. This means the allowed values are not programmatically accessible from outside the parser — they exist only at parse time.

---

## 5. Hidden vs Visible Flag Categories

### Why flags are hidden

Commander's `.hideHelp()` method removes a flag from `--help` output while keeping it fully functional. Claude Code uses this aggressively. The rationale varies by flag group:

**Internal implementation details (never user-facing):**
- `--agent-id`, `--agent-name`, `--team-name`, `--teammate-mode` — set programmatically when spawning child processes
- `--sdk-url` — set by IDE extensions, not by users
- `--teleport`, `--remote` — internal session transport mechanisms
- `--debug-to-stderr` — pipeline plumbing flag

**Advanced/dangerous flags that casual users should not discover:**
- `--dangerously-skip-permissions`, `--allow-dangerously-skip-permissions` — security bypass
- `--permission-prompt-tool` — programmatic permission handling
- `--system-prompt-file`, `--append-system-prompt-file` — file-based prompt injection
- `--no-session-persistence` — data loss risk

**Print-mode-only flags hidden to reduce visible complexity:**
- `--max-thinking-tokens`, `--max-turns`, `--max-budget-usd` — only meaningful in non-interactive use
- `--include-partial-messages`, `--replay-user-messages` — SDK streaming features
- `--resume-session-at`, `--rewind-files` — advanced session manipulation

**Deprecated:**
- `--mcp-debug` — backward compat alias for `--debug`

**Too specialized for general use:**
- `--enable-auth-status` — SDK auth event streaming
- `--setting-sources` — settings layer isolation
- `--plugin-dir` — developer workflow
- `--betas` — pre-release model features (API key only)
- `--file` — cloud-hosted session file downloads

### Visible flags

The following flags appear in `--help` output:
- `-p, --print`
- `-c, --continue`
- `-r, --resume [value]`
- `--fork-session`
- `--model <model>`
- `--effort <level>`
- `--settings <file>`
- `--agent <agent>`
- `--system-prompt <prompt>`
- `--output-format <fmt>`
- `--input-format <fmt>`
- `--json-schema <schema>`
- `--tools <tools...>`
- `--allowed-tools <tools...>`
- `--disallowed-tools <tools...>`
- `--add-dir <directories...>`
- `--mcp-config <configs...>`
- `--strict-mcp-config`
- `--chrome` / `--no-chrome`
- `-d, --debug [filter]`
- `--debug-file <path>`
- `--verbose`
- `--permission-mode <mode>`
- `--dangerously-skip-permissions`

---

## 6. MCP Subcommand System

The `mcp` subcommand is registered as a commander subcommand (not a flag). It has its own sub-subcommands:

### `mcp serve`
Starts Claude Code as an MCP server itself, accepting MCP protocol connections on stdio. This is the primary mechanism by which IDE extensions (VS Code, JetBrains, etc.) integrate Claude Code as a backend. The IDE speaks MCP; Claude Code responds on the same protocol it uses to talk to other MCP servers.

### `mcp add <name>`
Registers a new MCP server configuration. Stores the server definition in the user's MCP config file. Accepts options for the transport type (stdio/SSE), command, arguments, and environment variables.

### `mcp remove <name>`
Removes a named MCP server from the configuration.

### `mcp list`
Displays all configured MCP servers with their connection status.

### `mcp get <name>`
Shows detailed configuration and status for a single named MCP server.

### `mcp reset-project-config`
Deletes the project-level MCP configuration, reverting to user-level settings only. Used to recover from broken project configs.

### `--mcp-cli` (top-level flag, not subcommand)
This is distinct from the subcommands above. `--mcp-cli` is a top-level boolean flag that switches Claude Code into an MCP protocol listener on stdio, intended for programmatic communication within IDE extension processes. Unlike `mcp serve` (which exposes Claude Code as an MCP server for other clients), `--mcp-cli` creates a lower-level internal communication channel.

---

## 7. Other Subcommands

Beyond `mcp`, the CLI registers several other subcommands:

### `claude update` / `claude upgrade`
Triggers the auto-updater to download and install the latest version of Claude Code. The two aliases (`update` and `upgrade`) are functionally identical and both delegate to `updateCheckCommand` (`yGz`, chunks.189.mjs:371).

### `claude doctor`
Runs diagnostic checks on the Claude Code installation: verifies authentication, checks connectivity to the Anthropic API, validates MCP server configs, and reports any configuration problems. Delegates to `doctorCommand` (`LGz`, chunks.189.mjs:313).

### `claude setup-token`
Interactive flow for configuring a long-lived authentication token. Used in environments where the OAuth browser flow is unavailable (headless servers, CI machines). Delegates to `setupTokenCommand` (`vGz`, chunks.189.mjs:267).

---

## 8. Post-Parse Processing Flow

After all flags are parsed and validated, the CLI proceeds through a specific sequence before launching the main application:

```
parse argv
    ↓
validation checks (15 sequential checks)
    ↓
apply SDK URL defaults (if --sdk-url)
    ↓
apply verbose defaults
    ↓
resolve effort from env/settings/flags (priority: flag > env > settings > model default)
    ↓
set up debug logging (--debug / --debug-file / --debug-to-stderr)
    ↓
determine entry point (interactive REPL vs print-mode pipeline)
    ↓
showSetupScreens (gRq) if first run
    ↓
launch cliEntry (qZz) with fully resolved options
```

The options object passed to `cliEntry` is the fully-normalized view after all validation and defaulting. Downstream code does not re-read `process.argv` — it only sees the normalized options.

---

## 9. Environment Variable Interactions

Several CLI flags interact with or are overridden by environment variables. The priority is generally: explicit flag > environment variable > settings file > compiled default.

Key environment variables that affect flag behavior:
- `DISABLE_COMPACT` — equivalent to disabling auto-compaction; checked in compaction code, not in argument parsing
- `CLAUDE_CODE_SESSION_ACCESS_TOKEN` — required by `--file`; also affects `--enable-auth-status`
- `ANTHROPIC_API_KEY` — presence/absence affects whether `--betas` is allowed (API key users only)
- `CLAUDE_CODE_EFFORT` — sets effort level; overridden by `--effort` flag if both present
- `CLAUDE_CODE_MAX_THINKING_TOKENS` — sets thinking token limit; overridden by `--max-thinking-tokens` flag

---

## Code Reference: commanderSetup Structure

```javascript
// ============================================
// commanderSetup - Main argument definition function
// Location: chunks.190.mjs:999
// ============================================

// ORIGINAL (for source lookup):
function aGz() {
    let q = new UT6.Command();
    q.name("claude")
     .description("Claude Code CLI")
     .option("-p, --print", "Non-interactive mode", () => !0)
     .option("-d, --debug [filter]", "Enable debug", () => !0)
     .option("--effort <level>", "Reasoning effort", (w) => {
         let H = ["low","medium","high","max"];
         if (!H.includes(w)) throw new kXq(`It must be one of: ${H.join(", ")}`);
         return w
     })
     // ... (50+ more options) ...
    return q
}

// READABLE (for understanding):
function commanderSetup() {
    let program = new Commander.Command();
    program.name("claude")
           .description("Claude Code CLI")
           .option("-p, --print", "Non-interactive mode", () => true)
           .option("-d, --debug [filter]", "Enable debug", () => true)
           .option("--effort <level>", "Reasoning effort", (inputValue) => {
               let allowedLevels = ["low","medium","high","max"];
               if (!allowedLevels.includes(inputValue)) {
                   throw new CommanderInvalidArgumentError(`It must be one of: ${allowedLevels.join(", ")}`);
               }
               return inputValue;
           })
           // ... additional options ...
    return program;
}

// Mapping: aGz→commanderSetup, q→program, UT6→Commander, kXq→CommanderInvalidArgumentError
```
