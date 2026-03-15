# CLI Argument Parsing

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI Module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - State Management

Key functions in this document:
- `commanderSetup` (aGz) - Main argument definition function in chunks.198.mjs:999
- `mainEntry` (nGz) - Validation and post-processing in chunks.197.mjs:931
- `cliEntry` (qZz) - Entry dispatch after commander parse in chunks.198.mjs:167

---

## Overview

Claude Code v2.1.76 uses `commander` (obfuscated `UT6`) as its CLI framework. Argument definitions live in `commanderSetup` (`aGz`, chunks.198.mjs:999), and the bulk of validation and cross-flag consistency checking runs inside `mainEntry` (`nGz`, chunks.197.mjs:931) immediately after commander parses `process.argv`.

The argument surface has grown substantially beyond what casual users see in `--help`. Roughly half of all flags are hidden from help output using commander's `.hideHelp()` method. This document catalogues every flag, its parser type, its visibility, the validation rules that govern it, and the design rationale behind each decision.

**Changes in v2.1.76:**
- Added `-n`/`--name` flag for session naming
- Added `--worktree` flag with `sparsePaths` support for git worktree isolation
- `ExitWorktree` tool added (pairs with `EnterWorktree`)
- `claude auth login/status/logout` subcommands added
- Effort levels simplified: `max` removed, valid values are now `low`, `medium`, `high`

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
- `--effort`: Must be one of three allowed strings (low, medium, high) in v2.1.76.
- `--debug-to-stderr`: `argParser(Boolean)` — converts string `"true"`/`"false"`.
- `--max-thinking-tokens`: `argParser(Number)` — converts to integer.
- `--max-turns`: `argParser(Number)` — converts to integer.
- `--debug [filter]`: Commander's optional-value syntax; argParser discards the filter string and returns `true`.

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

**`-n, --name <name>`** (visible, string) — **New in v2.1.76**
Assigns a human-readable name to the session. The name appears in the prompt bar and is preserved through compaction. Allows users to identify sessions by descriptive labels (e.g., `--name "bugfix/auth-flow"`) rather than opaque UUIDs.

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

**`--worktree`** (hidden, string) — **New in v2.1.76**
Activates git worktree isolation for the session. When specified, Claude Code creates or attaches to a git worktree. May include `sparsePaths` configuration to limit which paths are checked out in the sparse worktree. The `EnterWorktree` and `ExitWorktree` tools (added v2.1.72) can also be used at runtime to transition into/out of worktree isolation.

### 2.2 Configuration and Models

**`--model <model>`** (visible, string)
Specifies the model alias (e.g., `sonnet`, `opus`) or full model ID. Overrides the model in settings.

**`--fallback-model <model>`** (hidden, string)
Designates an automatic fallback when the primary model returns an overload error (HTTP 529). Print mode only. Validated: cannot be the same as `--model`. The fallback is typically a smaller, more available model (e.g., `haiku` when primary is `opus`).

**`--effort <level>`** (visible, custom parser) — **Updated in v2.1.76**
Sets the reasoning effort level. Custom parser validates against the allowed list: `["low", "medium", "high"]`. The `max` level was removed in v2.1.76 — use `high` for maximum available effort. Throws an error if an invalid value is given.

**`--betas <betas...>`** (hidden, variadic string)
Beta header names to append to every API request. Restricted to API key users only (not claude.ai subscribers). Allows early access to pre-release model capabilities without waiting for a version update.

**`--settings <file>`** (visible, string)
Path to a JSON settings file or a raw JSON string. Merges with the user's normal settings.

**`--setting-sources <sources>`** (hidden, string)
Comma-separated list limiting which setting source layers are loaded: `user`, `project`, `local`. Useful in locked-down environments where only a specific layer should apply.

**`--agent <agent>`** (visible, string)
Overrides the agent type from settings. Controls which built-in agent configuration is used.

**`--agents <json>`** (hidden, string)
A JSON object defining custom named agents with `description` and `prompt` fields.

**`--system-prompt <prompt>`** (visible, string)
Sets the system prompt directly. Mutually exclusive with `--system-prompt-file` and append variants.

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
Emits partial message chunks in `stream-json` output as they arrive, rather than only emitting complete messages. Validated: requires both `--print` and `--output-format=stream-json`.

**`--replay-user-messages`** (hidden, Pattern A)
Re-emits each user message received on stdin back to stdout as an acknowledgment event before processing it. Requires `stream-json` on both input and output formats.

### 2.4 Tools and MCP

**`--tools <tools...>`** (visible, variadic string)
The master tool allow-list. Pass `""` (empty string) to disable all tools, or `"default"` to enable the default built-in set. Individual tool names restrict to exactly those tools.

**`--allowed-tools <tools...>`** (visible, variadic string)
Adds tools to the allow-list without replacing the default set. Additive with `--tools`.

**`--disallowed-tools <tools...>`** (visible, variadic string)
Removes tools from the allow-list. Processed after `--tools` and `--allowed-tools`.

**`--add-dir <directories...>`** (visible, variadic string)
Grants tool access (read/write) to additional directories beyond the default working directory. Multiple values are accepted.

**`--mcp-config <configs...>`** (visible, variadic string)
Loads MCP server definitions from JSON files or inline JSON strings. Multiple values are merged.

**`--strict-mcp-config`** (visible, Pattern A)
When set, only the MCP servers from `--mcp-config` are used; all servers from user/project config files are ignored.

**`--plugin-dir <paths...>`** (hidden, variadic string)
Loads plugins from the specified directories at startup. Repeatable. Bypasses the normal plugin discovery mechanism.

**`--chrome` / `--no-chrome`** (visible, boolean pair)
Enables or explicitly disables the Claude-in-Chrome browser integration. `--no-chrome` takes precedence.

**`--permission-prompt-tool <tool>`** (hidden, string)
Specifies an MCP tool name that should be called when a permission prompt would normally appear.

### 2.5 Debug and Permissions

**`-d, --debug [filter]`** (visible, custom)
Enables debug mode. The optional filter string controls which categories are shown.

**`-d2e, --debug-to-stderr`** (hidden, `argParser(Boolean)`)
Redirects all debug log output to stderr instead of the normal debug log file.

**`--debug-file <path>`** (visible, string)
Writes debug output to a specific file path.

**`--verbose`** (visible, Pattern A)
Enables verbose logging.

**`--permission-mode <mode>`** (visible, string)
Sets the permission strategy. Valid values include `bypassPermissions` and mode strings that map to configured MCP permission handlers.

**`--dangerously-skip-permissions`** (visible, Pattern A)
Enables the permission bypass as an available option.

**`--allow-dangerously-skip-permissions`** (hidden, Pattern A)
Makes the `--dangerously-skip-permissions` bypass mode available as a runtime-switchable option.

**`--enable-auth-status`** (hidden, Pattern A)
Enables auth status messages in SDK stream-json output.

### 2.6 Constraints and Limits

**`--max-thinking-tokens <n>`** (hidden, `argParser(Number)`)
Caps the thinking token budget at `n`. Print mode only.

**`--max-turns <n>`** (hidden, `argParser(Number)`)
Limits the number of agent turns before forced exit. Print mode only.

**`--max-budget-usd <amount>`** (hidden, custom parser)
Sets a dollar ceiling on API spend for the session. Print mode only. The custom parser enforces `> 0`:

```javascript
// ============================================
// maxBudgetParser - Validates max-budget-usd flag value
// Location: chunks.197.mjs (near commanderSetup)
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

**`--mcp-cli`** (hidden, Pattern A)
Not a subcommand but a top-level flag. Starts an internal MCP CLI mode for programmatic communication over stdio.

**`--ide`** (hidden, Pattern A)
Automatically connects to an IDE on startup if exactly one valid IDE connection is available.

**`--file <specs...>`** (hidden, variadic string)
Downloads file resources at startup. Format: `file_id:relative_path`. Requires the `CLAUDE_CODE_SESSION_ACCESS_TOKEN` environment variable.

### 2.8 Teammates and Swarm

All flags in this group are hidden.

**`--agent-id <id>`** — The UUID identifying this process as a specific teammate in a swarm.

**`--agent-name <name>`** — Display name for this teammate shown in swarm status views.

**`--team-name <name>`** — The team namespace for swarm coordination.

**`--teammate-mode <mode>`** — Controls how new teammate processes are spawned. Values: `auto`, `tmux`, `in-process`.

**Why all hidden:** These flags are set programmatically when Claude Code spawns child instances. Exposing them in `--help` would confuse users who would never set them manually.

### 2.9 Auth Subcommands — New in v2.1.76

The `claude auth` subcommand family was added in v2.1.41:

**`claude auth login`**
Initiates the Claude authentication flow. Opens the browser for OAuth login or prompts for API key entry.

**`claude auth status`**
Displays the current authentication status: logged in/out, account email, subscription type.

**`claude auth logout`**
Clears stored credentials and logs out of the current account.

**Why separate auth subcommands:** Previously auth management was embedded in the setup wizard flow. Dedicated subcommands allow scripting and CI pipelines to manage auth state explicitly without starting an interactive session.

### 2.10 Deprecated Flags

**`--mcp-debug`** (hidden)
Identical in effect to `--debug`. Kept for backward compatibility with scripts and configurations that used this flag before the debug system was unified. New code should use `--debug`.

---

## 3. Argument Validation Logic

All cross-flag consistency checks run sequentially in `mainEntry` (`nGz`, chunks.197.mjs) after commander parses `process.argv`. The order is significant: early checks can short-circuit later ones.

### Validation 1: Single-Word Prompt Detection

**Location:** chunks.197.mjs:1029-1031

```javascript
// ============================================
// singleWordPromptTelemetry - Fires telemetry when prompt has no spaces
// Location: chunks.197.mjs:1029-1031
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

**Key insight:** This is a pure telemetry check — it does not alter behavior.

### Validation 2: "code" Prompt Trap

**Location:** chunks.197.mjs:1028

```javascript
// ============================================
// codePromptTrap - Silently ignores prompt="code" to catch common mistake
// Location: chunks.197.mjs:1028
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

**What it does:** If the entire prompt is the string `"code"`, it is discarded and replaced with `undefined`, which causes Claude Code to start in interactive mode.

**Why this happens:** New users often try to launch Claude Code as `claude code`, thinking `code` is a subcommand. The trap converts this into a normal interactive session.

### Validation 3: SDK URL Forces stream-json Defaults

**Location:** chunks.197.mjs:1091-1096

```javascript
// ============================================
// sdkUrlDefaultEnforcer - Forces stream-json when SDK URL is set
// Location: chunks.197.mjs:1091-1096
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

**Why this approach:** SDK URL mode is meaningless without stream-json I/O. Rather than requiring the caller to always specify all four flags, the defaults are applied automatically.

### Validation 4: Session ID + Continue/Resume Requires fork-session

**Location:** chunks.197.mjs:1101-1108

**What it does:** Three sub-checks in sequence:
1. If `--session-id` is combined with `--continue`/`--resume` without `--fork-session`, reject.
2. Validate that the value is a well-formed UUID.
3. Verify the UUID is not already active in another process.

**Why the fork-session requirement:** `--continue` and `--resume` load an existing session's transcript. If a new `--session-id` is forced simultaneously, two sessions would claim the same state. `--fork-session` explicitly signals "copy the transcript into a new session."

### Validation 5: --file Requires Session Access Token

**Location:** chunks.197.mjs:1113-1125

**What it does:** If `--file <specs...>` is provided but `CLAUDE_CODE_SESSION_ACCESS_TOKEN` is not set, emits an error to stderr and exits.

### Validation 6: Fallback Model Cannot Equal Primary Model

**Location:** chunks.197.mjs:1128-1129

**What it does:** Rejects configurations where `--fallback-model` equals `--model`.

### Validation 7: Effort Level Restrictions (Updated in v2.1.76)

**Location:** chunks.197.mjs:1130-1133

**What changed in v2.1.76:** The `max` effort level was removed. The valid values are now strictly `low`, `medium`, and `high`. If `max` is passed, the custom parser throws an `InvalidArgumentError` immediately at parse time, rather than a deferred runtime check.

```javascript
// ============================================
// effortLevelValidator - Validates effort level (v2.1.76: no max)
// Location: chunks.197.mjs:1023
// ============================================

// ORIGINAL (for source lookup):
(w) => {
    let H = ["low", "medium", "high"];
    if (!H.includes(w)) throw new kXq(`It must be one of: ${H.join(", ")}`);
    return w
}

// READABLE (for understanding):
(value) => {
    let validLevels = ["low", "medium", "high"];
    if (!validLevels.includes(value)) {
        throw new InvalidArgumentError(`It must be one of: ${validLevels.join(", ")}`);
    }
    return value;
}

// Mapping: kXq→InvalidArgumentError, w→value, H→validLevels
```

**Why max was removed:** The `max` effort level required special-case gating (print-mode only, API key only). v2.1.76 simplifies the effort model: `high` is the maximum interactive effort level and has the same behavior as the former interactive `high`. The `max` distinction (formerly only in print mode) is no longer exposed.

### Validation 8: System Prompt Mutual Exclusion

**Location:** chunks.197.mjs:1135-1148

**What it does:** `--system-prompt` and `--system-prompt-file` are mutually exclusive. If both are provided, emits an error.

### Validation 9: Append System Prompt Mutual Exclusion

**Location:** chunks.197.mjs:1149-1162

**What it does:** `--append-system-prompt` and `--append-system-prompt-file` are mutually exclusive with each other.

### Validation 10: stream-json Consistency

**Location:** chunks.197.mjs:1294-1295

**What it does:** Blocks the combination of `stream-json` input format with non-stream-json output format.

### Validation 11: SDK URL Requires Both stream-json

**Location:** chunks.197.mjs:1296-1298

**What it does:** If `--sdk-url` is set but the formats are not both `stream-json`, emits an error.

### Validation 12: replay-user-messages Requires stream-json

**Location:** chunks.197.mjs:1299-1301

**What it does:** The `--replay-user-messages` flag requires both input and output to be `stream-json`.

### Validation 13: include-partial-messages Requires print + stream-json

**Location:** chunks.197.mjs:1302-1304

**What it does:** `--include-partial-messages` requires `--print` and `--output-format=stream-json`.

### Validation 14: no-session-persistence Print Only

**Location:** chunks.197.mjs:1305

**What it does:** `--no-session-persistence` can only be used in print mode.

### Validation 15: Worker/Teammate Flag Completeness

**Location:** chunks.197.mjs:1306-1315

**What it does:** When `--agent-id` is given, `--agent-name` and `--team-name` must also be present. The converse also applies: partial teammate context flags are rejected.

---

## 4. Key Design Decisions

### Why So Many Hidden Flags

Commander's `.hideHelp()` is used extensively to reduce the `--help` surface to the flags that casual users actually need. Hidden flags fall into three categories:
1. **Internal flags** (`--agent-id`, `--team-name`) set programmatically by spawned subprocesses
2. **Power-user flags** (`--betas`, `--max-turns`) that require understanding of the underlying API
3. **Legacy flags** (`--mcp-debug`) kept for backward compatibility

### Why Commander Over Manual Parsing

Commander provides type coercion, automatic help generation, and variadic argument handling. The alternative — writing `process.argv.slice(2)` parsing by hand — would require reimplementing error messages, mutual exclusion logic, and help text. The tradeoff is commander's bundled size, which is acceptable given Claude Code's already-large bundle.

### The `() => !0` Pattern vs. Native Boolean Flags

Commander's native boolean flags (no argParser) produce `undefined` when absent and the string `"true"` when present. The `() => !0` pattern produces `undefined` when absent and the primitive `true` when present. Downstream code uses `if (options.flag)` checks, which work identically for both. The `() => !0` pattern is used to ensure downstream strict equality checks (`=== true`) work correctly.
