# Changelog

## 2.1.142

- Added new `claude agents` flags: `--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`, `--permission-mode`, `--model`, `--effort`, and `--dangerously-skip-permissions` to configure dispatched background sessions
- Fast mode now uses Opus 4.7 by default (previously Opus 4.6). Set `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1` to pin fast mode to Opus 4.6
- Plugins with a root-level `SKILL.md` and no `skills/` subdirectory are now surfaced as a skill
- The `/plugin` details pane and `claude plugin details` now show LSP servers a plugin provides
- `/web-setup` warns before replacing an existing GitHub App connection
- Fixed `MCP_TOOL_TIMEOUT` not raising the per-request fetch timeout for remote HTTP and SSE MCP servers, which capped tool calls at 60 seconds regardless of the configured value
- Fixed background sessions not recognizing pre-existing git worktrees, blocking Edit while EnterWorktree refused to create a duplicate
- Fixed background sessions disappearing and daemon reconnect failing after macOS sleep/wake — the daemon now detects clock jumps instead of treating them as elapsed idle time
- Fixed daemon not exiting cleanly after the binary is upgraded (e.g. `brew upgrade`), causing dispatched agents to crash-loop on the deleted path
- Fixed background agents crash-looping when the Claude-in-Chrome extension is connected without a shared tab
- Fixed clicking links in an attached `claude agents` session — the background worker's headless browser shim no longer applies while attached
- Fixed `claude agents` "v to open in editor" using the daemon's default editor instead of your shell's `$EDITOR`/`$VISUAL`
- Fixed `claude agents` deadlocking on Windows with network-drive working directories; Ctrl+C now works during startup
- Fixed background-color bleed when attaching to a `claude agents` session from Apple Terminal or other 256-color-only terminals
- Fixed `claude --bg --dangerously-skip-permissions` not persisting across retire/wake
- Fixed session titles being derived from the URL when the first message is a link
- Fixed redundant `set_model` requests from remote clients injecting duplicate `/model` breadcrumbs into the transcript
- Fixed plugins using `skills: ["./"]` showing a false "path escapes plugin directory" error
- Fixed plugin cache cleanup deleting the active plugin version directory when no installation metadata is present
- Fixed `/plugin` browse pane showing "0 installs" for newly published plugins
- Fixed plugin advisories not naming every `plugin.json` key that shadows a default folder
- Improved reactive compaction: the first summarize attempt now seeds from the original request's overflow size, avoiding a wasted near-full-context retry
- Improved hook configuration error: configuring a prompt- or agent-type hook for `SessionStart`/`Setup`/`SubagentStart` now shows a clear "use a command-type hook instead" error
- Removed stale `/model claude-sonnet-4-20250514` suggestion from Usage Policy refusal messages

## 2.1.141

- Added `terminalSequence` field to hook JSON output so hooks can emit desktop notifications, window titles, and bells without a controlling terminal
- Added `CLAUDE_CODE_PLUGIN_PREFER_HTTPS` to clone GitHub plugin sources over HTTPS instead of SSH, for environments without a GitHub SSH key
- Added `ANTHROPIC_WORKSPACE_ID` environment variable for workload identity federation — scopes the minted token to a specific workspace when the federation rule covers more than one
- Added `claude agents --cwd <path>` to scope the session list to a directory
- `/feedback` can now include recent sessions (last 24 hours or 7 days) for issues spanning more than the current session
- Rewind menu: added "Summarize up to here" to compress earlier context while keeping recent turns intact
- Auto mode permission dialog now explains when a `permissions.ask` rule caused the prompt
- Restored the "view diff in your IDE" option on file-edit permission prompts when an IDE is connected
- Background agents launched via `/bg` or `←←` now preserve the current permission mode instead of reverting to default
- `claude agents`: agents that finish work but leave a background shell running now move to Completed instead of staying under Working
- Improved spinner feedback during long thinking periods — the spinner now warms to amber after 10 seconds to signal Claude is still working
- Improved plugin menu navigation: `→`/Tab switch tabs, `↑` moves to the tab strip, and tab headers and search box are clickable in fullscreen mode
- Fixed background side-queries sending an unavailable Haiku model ID on Bedrock/Vertex/Foundry/gateway when no `ANTHROPIC_SMALL_FAST_MODEL` override is set — now falls back to the main-loop model
- Fixed `claude daemon status` and `/doctor` on Windows throwing when the daemon pipe key file is locked or unreadable — now shows the underlying error instead of an opaque failure
- Fixed `claude agents` showing the agent-type list instead of the dashboard when launched through a wrapper that adds flags
- Fixed `claude agents` opening a crashed session firing redundant dispatches when the working directory was deleted
- Fixed background jobs on a custom `ANTHROPIC_BASE_URL` gateway not getting auto-named — the namer now uses the main model when no Haiku model is configured
- Fixed `/model` in one session silently changing the autocompact threshold in other concurrent sessions
- Fixed switching permission mode while a tool-permission prompt is open not auto-dismissing the prompt when the new setting permits the tool
- Fixed pressing Enter while a permission/dialog prompt is open also submitting text in the input box
- Fixed hooks receiving a non-existent `transcript_path` after `EnterWorktree` switches the working directory
- Fixed markdown tables with cell wrapping falling back to the vertical key-value layout instead of rendering as a bordered grid (regression in 2.1.136)
- Fixed cancelled prompts being removed from Up-arrow history when auto-restored into the input box, avoiding duplicate entries
- Fixed prompts cancelled with Ctrl+C/Esc before any response being dropped from Up-arrow history
- Fixed Ctrl+C not interrupting a running turn while in vim INSERT/VISUAL mode
- Fixed alternative `chat:submit` keybindings (e.g. `meta+enter`, `ctrl+enter`) not working when `enter` is rebound to `chat:newline`
- Fixed prompt suggestions being silently disabled when an output style was configured
- Fixed `spinnerVerbs` setting not being honored in turn-completion messages
- Fixed AskUserQuestion popup hiding the last line of preceding chat content
- Fixed Web Search status showing "Did 0 searches" when searches returned errors
- Fixed multi-line statusline output dropping or corrupting rows when any line exceeds terminal width
- Fixed light-ansi theme using invisible white for diff context lines on light backgrounds — now uses black
- Fixed error overlay dumping minified bundle source that hid the original error message
- Fixed pressing Enter after typing a feedback survey rating digit submitting it as a chat message instead of the rating
- Fixed pressing `x` on a selected subagent in the agent panel typing into the prompt instead of stopping the agent
- Fixed session title being derived from plugin monitor notifications before the user's first prompt
- Fixed "Allowed by PermissionRequest hook" repeating once per tool call under a collapsed read/search group
- Fixed `/tui` silently dropping running background shells and subagents — now refuses and asks to wait for them to finish
- Fixed welcome banner showing "API Usage Billing" on Bedrock, Vertex, Foundry, and other third-party providers — now shows the provider name
- Fixed `/mcp` server list not keeping the focused server visible in short terminals in fullscreen mode
- Fixed redaction in `/feedback` bundles producing invalid JSON for quoted values like session IDs
- Fixed desktop and third-party provider sessions incorrectly inheriting `apiKeyHelper`/`ANTHROPIC_AUTH_TOKEN` from host managed-settings
- Fixed early analytics events being silently dropped when fired before logger initialization
- Fixed `claude plugin install` failing for plugins whose marketplace `ref` no longer exists upstream when a `sha` is also pinned
- Fixed plugin details pane showing 0 MCP servers for plugins that declare them via `.mcp.json`
- Fixed plugin MCP servers with unset config variables showing a generic connection failure instead of a "config issue" message with a fix-it hint; malformed `.mcp.json` entries no longer drop other MCP servers
- Fixed MCP server configs using POSIX shell parameter expansions (e.g. `${var%pattern}`) being incorrectly flagged as missing environment variables
- Fixed MCP HTTP/SSE servers returning 403 on connect showing as "failed" instead of "needs auth"
- Fixed remote MCP servers disconnecting unnecessarily when the optional server-events stream failed to reconnect — tool calls continue over POST
- Fixed Remote Control MCP connectors all failing with 401 when the worker session token rotated mid-session
- Fixed Remote Control automatically re-enrolling a trusted device when the server rejects a stale token, instead of looping through `/login`
- Fixed a race where early OTel spans could be silently dropped in SDK/headless mode with beta tracing enabled
- Fixed custom `voice:pushToTalk` keybindings and `"space": null` unbinds being silently ignored
- Fixed Windows Alt+V image paste reporting "no image found" when the clipboard contains a screenshot
- Fixed SDK "Claude Code native binary not found" on Linux when both glibc and musl platform packages are installed
- Bedrock: `awsCredentialExport` now always runs when configured instead of being skipped when ambient AWS credentials resolve, fixing auth for cross-account access
- [VSCode] Fixed in-chat mic showing no feedback when the microphone produced only silence — now shows "No audio detected"
- [VSCode] Voice mode: the WSL error now suggests installing `sox libsox-fmt-pulse` for WSLg users
- `claude agents`: launching a session no longer fails when the pre-warmed background worker is unhealthy — now falls back to a fresh launch
- `claude agents` no longer shows empty placeholder sessions left over from backgrounding a fresh REPL, and shows onboarding text when entered via ← with no other agents
- Empty idle background sessions left over from `←` are now automatically retired by the daemon after 5 minutes

## 2.1.140

- Improved Agent tool `subagent_type` matching to accept case- and separator-insensitive values (e.g. `"Code Reviewer"` resolves to `code-reviewer`)
- Updated agent color palette
- Fixed `/goal` silently hanging when `disableAllHooks` or `allowManagedHooksOnly` is set — now shows a clear message instead of an indicator that never resolves
- Fixed a regression in settings hot-reload where symlinked settings files caused misattributed change events and spurious `ConfigChange` hooks
- Fixed `claude --bg` failing with "connection dropped mid-request" when the background service was about to idle-exit
- Fixed background service startup failing on machines with enterprise endpoint security by allowing more time
- Fixed remote managed settings not retrying on 401 — now retries once with a force-refreshed token
- Fixed managed `extraKnownMarketplaces` auto-update policy not being persisted to `known_marketplaces.json`
- Fixed `/loop` scheduling redundant wakeups to poll for background tasks that already notify on completion
- Fixed a recurring event-loop stall on Windows when a missing executable (e.g. `gh`) triggered synchronous `where.exe` re-spawns on every check
- Fixed `Read` tool calls failing validation when `offset` is passed as a whitespace-padded or `+`-prefixed string
- Fixed native terminal cursor not staying at the input caret when the terminal loses focus
- Plugins now warn when a default component folder (e.g. `commands/`) is silently ignored because `plugin.json` sets the matching key. Shown in `/doctor`, `claude plugin list`, and `/plugin`.

## 2.1.139

- Added agent view (Research Preview): a single list of every Claude Code session — running, blocked on you, or done. Run `claude agents` to get started. See https://code.claude.com/docs/en/agent-view
- Added `/goal` command: set a completion condition and Claude keeps working across turns until it's met. Works in interactive, `-p`, and Remote Control. Shows live elapsed/turns/tokens as an overlay panel
- Added `/scroll-speed` command to tune mouse wheel scroll speed with a live preview
- Added `claude plugin details <name>` to show a plugin's component inventory and projected per-session token cost
- Added transcript view navigation: `?` for keyboard shortcuts, `{`/`}` to jump between user prompts, `v` to toggle shortcut panel
- Added hook `args: string[]` field (exec form) that spawns the command directly without a shell, so path placeholders never need quoting
- Added hook `continueOnBlock` config option for `PostToolUse` — set to `true` to feed the hook's rejection reason back to Claude and continue the turn
- MCP stdio servers now receive `CLAUDE_PROJECT_DIR` in their environment, matching hooks. Plugin configs can reference `${CLAUDE_PROJECT_DIR}` in commands
- Compaction prompt now asks the model to preserve sensitive user instructions
- `/mcp` Reconnect now picks up `.mcp.json` edits without a restart, and shows the HTTP status and URL when reconnecting fails
- `/context all` per-skill token estimates now account for the model's tokenizer and show rounded values
- `claude plugin install <name>@<marketplace>` now auto-refreshes the marketplace and retries before reporting a plugin as not found
- `/plugin` installed-plugin details now show hook event names and MCP server names cleanly
- `/context` now shows the providing plugin's name for plugin-sourced skills
- Remote MCP server reconnect retry on transient failures is now enabled for all users
- API requests from subagents now carry `x-claude-code-agent-id` / `x-claude-code-parent-agent-id` headers, and `claude_code.llm_request` OTEL spans include `agent_id` / `parent_agent_id` attributes
- Remote Control, `/schedule`, claude.ai MCP connectors, and notification preferences are now disabled when `ANTHROPIC_API_KEY` / `apiKeyHelper` / `ANTHROPIC_AUTH_TOKEN` is set, even if a Claude.ai login also exists. Unset the API key to use these features
- Fixed a deadlock where expired credentials and the `forceRemoteSettingsRefresh` policy setting blocked `claude auth login`/`logout`/`status` with no way to recover
- Fixed `autoAllowBashIfSandboxed` not auto-approving commands with shell expansions like `$VAR` and `$(cmd)`
- Fixed a bug where a hook writing to the terminal could corrupt an on-screen interactive prompt; hooks now run without terminal access
- Fixed unbounded memory growth when an HTTP/SSE MCP server streams non-protocol data — response bodies now capped at 16 MB per SSE frame
- Fixed `Skill(name *)` permission rules — the wildcard form now works as a prefix match, matching `Bash(ls *)` behavior
- Fixed settings hot-reload not detecting edits to symlinked `~/.claude/settings.json`
- Fixed plugin details failing to load when the marketplace key differs from the manifest name
- Fixed `/model` picker "Default" row not reflecting `ANTHROPIC_DEFAULT_OPUS_MODEL`/`ANTHROPIC_DEFAULT_SONNET_MODEL` overrides
- Fixed spurious "stream idle timeout" 5 minutes after a response completed, caused by the watchdog timer not being cleared on stream cancellation
- Fixed silent `exit 1` when 10+ MCP servers are configured and the cache directory is unwritable — the error message now includes the underlying cause
- Fixed a typing cursor blinking on tab names, list pointers, and select rows in dialogs
- Fixed transcript view letter shortcuts not working after mouse click
- Fixed Bash-mode up-arrow history repeating the first entry and clobbering the in-progress draft
- Fixed pasting or dropping multiple images only inserting the last one
- Fixed hyperlinks using unreadable dark navy on dark themes — they now adapt to the active theme
- Fixed model picker showing a redundant "Current model" row for third-party users whose model is set to the `opus` alias
- Fixed legacy Opus picker entry on PAYG 3P providers resolving to the same model as the default entry
- Fixed mouse wheel scrolling speed in Cursor and VS Code 1.92–1.104; the trackpad now scrolls at a steady rate and the mouse wheel keeps ~3 lines per notch
- Fixed scroll behavior in Windows Terminal and VS Code when attached to background sessions
- Fixed MCP resources from disconnected servers lingering in `@server:` autocomplete
- Fixed two-file diff snippets over-reporting the number of truncated lines by one
- Fixed Grep results not relativizing Windows drive-letter paths and count mode reporting wrong totals for single-file paths
- Fixed border-embedded text overflowing on CJK/emoji due to visual cell width miscalculation
- Fixed fuzzy-match highlighting splitting emoji and astral-plane characters mid-pair
- Fixed skill argument names containing regex metacharacters breaking argument substitution
- Fixed ProgressBar rendering a full block for an almost-full fractional cell
- Fixed task polling and `fs.watch` being resurrected when the last subscriber leaves while a fetch is in flight
- Fixed plugin dependency resolution leaving a stale count when the manifest name differs from the source identifier
- Fixed Insights Time-of-Day chart skewing when a session has an unparseable timestamp
- Fixed keybindings using only the cmd/super/win modifier being flagged as unparseable
- Fixed `claude_code.active_time.total` OpenTelemetry metric not being emitted in `--print` mode
- Fixed `claude plugin update` not preserving cross-plugin symlinks inside a marketplace
- [VSCode] Press Cmd/Ctrl+Shift+T to reopen the most recently closed session tab, configurable via `claudeCode.enableReopenClosedSessionShortcut`

## 2.1.138

- Internal fixes

## 2.1.137

- [VSCode] Fixed extension failing to activate on Windows

## 2.1.136

- Added `CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL` to re-enable the session quality survey for enterprises capturing responses through OpenTelemetry
- Added `settings.autoMode.hard_deny` for auto mode classifier rules that block unconditionally regardless of user intent or allow exceptions
- Fixed MCP servers configured in `.mcp.json`, plugins, and claude.ai connectors silently disappearing after `/clear` in the VS Code extension, JetBrains plugin, and Agent SDK
- Fixed a rare login loop where a concurrent credential write could overwrite a freshly-rotated OAuth token and force re-login
- Fixed MCP OAuth refresh tokens being lost when multiple servers refresh concurrently — users with several remote MCP servers should no longer need daily re-authentication
- Fixed an API error (400) when extended thinking emitted a redacted thinking block after a tool call
- Fixed `--resume` / `--continue` not finding sessions when the project path contains underscores
- Fixed plan mode not blocking file writes when a matching `Edit(...)` allow rule exists
- WSL2: image paste from Windows clipboard now works via a PowerShell fallback when xclip/wl-paste cannot read image data
- Fixed plugin `Stop`/`UserPromptSubmit` hooks failing when cache cleanup deletes a version still in use by a running session
- Improved visual consistency across slash command dialogs: standardized footer hints, dialog spacing, and arrow-key styling, and the dialog frame now appears immediately during loading instead of popping in after
- Fixed colors appearing at wrong positions in bash command output and markdown code blocks
- Fixed ReasonML diffs rendering corrupted "undefined" text artifacts at word-diff boundaries
- Fixed worktree exit dialog warning about uncommitted files in the wrong directory after worktree removal
- Fixed `@` file picker not matching files created mid-session in small non-git directories
- Fixed `@`-mention file picker not finding files in directories with more than 100 entries
- Fixed failed tool calls not being click-to-expand in fullscreen mode when their output was truncated
- Fixed Backspace and Ctrl+Backspace getting swapped after using Ctrl+G to open an external editor on terminals with persistent extended-key modes
- Fixed `/usage` weekly reset showing time of day instead of the calendar date
- Fixed welcome banner ellipsis causing column overflow on CJK terminals
- Fixed `/insights` crash when session history contains tool calls with malformed input fields
- Fixed a renderer crash when a tool's collapsibility classification changes mid-session
- Fixed a `skills` entry in `plugin.json` hiding the plugin's default `skills/` directory, and listing a file path now shows an error instead of failing silently
- Fixed IDE shell-integration lock files not respecting `CLAUDE_CONFIG_DIR`
- Fixed trailing whitespace in copied terminal output during streaming
- Fixed plugin uninstall and enable/disable not matching slugs case-insensitively
- Fixed tool error truncation marker showing a negative count for surrogate-pair strings
- Fixed env vars from `CLAUDE_ENV_FILE` SessionStart hooks going stale after `/resume` or `/clear`
- Fixed `/branch` saving a multi-line session title when given a pasted multi-line name
- Fixed a stray leading space on the second line of wrapped text at the column boundary
- Fixed Esc not dismissing dialogs in `/install-github-app`, `/desktop`, `/resume`, and `/web-setup`
- Fixed `/doctor` MCP schema errors not naming the missing field or showing the source file path
- Fixed Bash permission prompts showing an internal parser diagnostic instead of a user-readable explanation
- Fixed plugin slash commands with spaces (e.g. `/myplugin review`) not resolving to their namespaced form
- Fixed `AskUserQuestion` discarding multi-select answers when supplied as an array
- Fixed `/clear <name>` not labeling the cleared session for `/resume`
- Fixed `CronList` output missing qualifiers and the scheduled prompt
- Fixed "Jump to bottom" overlay leaving color artifacts on CJK characters in fullscreen mode
- Fixed wide markdown tables leaving a stale bordered render in terminal scrollback while streaming
- Fixed pasted text being silently dropped when a long prompt with a pasted-text placeholder was auto-truncated
- Fixed `/release-notes` getting stuck on an old version after a failed changelog refresh
- Fixed `/mcp` server list not scrolling when there are more servers than fit in the terminal
- Fixed mid-input slash command autocomplete not working after an initial slash command
- Fixed scrolling to bottom re-engaging auto-follow with `autoScrollEnabled: false`
- Fixed prompt suggestions being auto-submitted by Enter on an empty input instead of requiring Tab or arrow to accept
- Fixed keyboard shortcut hints not reflecting rebound keys from `keybindings.json`
- Fixed `/settings` language change being reverted on Escape after confirming
- Fixed `/terminal-setup` only appearing in autocomplete on exact name match instead of partial prefixes
- Fixed "Chat about this" on an `AskUserQuestion` dialog erasing the question text
- Fixed MCP tool results being invisible when the server returns content blocks
- Improved error message when `--worktree` collides with an existing or stale worktree
- Changed plugin marketplace removal key to `d` (matching delete elsewhere) instead of `r` which collided with retry

## 2.1.133

- Added `worktree.baseRef` setting (`fresh` | `head`) to choose whether `--worktree`, `EnterWorktree`, and agent-isolation worktrees branch from `origin/<default>` or local `HEAD`. **Note:** the default `fresh` changes `EnterWorktree`'s base back to `origin/<default>` (it has been local `HEAD` since 2.1.128) — set `worktree.baseRef: "head"` to keep unpushed commits in new worktrees
- Added `sandbox.bwrapPath` and `sandbox.socatPath` managed settings (Linux/WSL) to specify custom bubblewrap and socat binary locations
- Added `parentSettingsBehavior` admin-tier key (`'first-wins' | 'merge'`) to let admins opt SDK `managedSettings` (parent tier) into the policy merge
- Hooks now receive the active effort level via the `effort.level` JSON input field and the `$CLAUDE_EFFORT` environment variable, and Bash tool commands can read `$CLAUDE_EFFORT`
- Improved focus mode behavior
- Improved memory usage by releasing warm-spare background workers under memory pressure
- Fixed parallel sessions all dead-ending at 401 after a refresh-token race wiped shared credentials
- Fixed `Edit`/`Write` allow rules scoped to a drive root (`C:\`) or POSIX `/` matching incorrectly and always prompting
- Fixed an unhandled rejection (`ECOMPROMISED`) when a history or session-log file lock is compromised by clock skew or slow disk
- Fixed pressing Esc during conversation compaction showing a spurious "Error compacting conversation" notification
- Fixed `HTTP(S)_PROXY` / `NO_PROXY` / mTLS not being respected for the full MCP OAuth flow including discovery, dynamic client registration, token exchange, and token refresh
- Fixed Read/Write/Edit being denied on mapped network drives passed via `--add-dir` / SDK `additionalDirectories`
- Fixed Remote Control stop/interrupt from claude.ai not fully canceling the CLI session the same way local Esc does, causing queued messages to never advance after interrupting a stuck tool or prompt
- Fixed `/effort` in one session unexpectedly changing the effort level of other concurrent sessions, and a related issue where an IDE effort change could be silently dropped
- Fixed subagents not discovering project, user, or plugin skills via the Skill tool
- `claude --help` now lists `--remote-control` alongside `--remote-control-session-name-prefix`
- [VSCode] Fixed `claudeCode.claudeProcessWrapper` failing with "Unsupported platform" when the extension build doesn't bundle a Claude binary

## 2.1.132

- Added `CLAUDE_CODE_SESSION_ID` environment variable to the Bash tool subprocess environment, matching the `session_id` passed to hooks
- Added `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1` env var to opt out of the fullscreen alternate-screen renderer and keep the conversation in the terminal's native scrollback
- Added a "Pasting…" footer hint while a Ctrl+V image paste is being read from the clipboard
- Fixed external SIGINT (e.g. IDE stop button, `kill -INT`) not running graceful shutdown — terminal modes are now restored and the `--resume` hint is printed instead of an abrupt exit
- Fixed an uncaught exception when the terminal is closed or SSH disconnects mid-session under the native build
- Fixed `--resume` failing with `no low surrogate in string` when a tool error truncation split an emoji; pre-corrupted sessions are sanitized on load
- Fixed `--permission-mode` flag being ignored when resuming a plan-mode session with `-p --continue`/`--resume`, and plan mode not being re-applied after `ExitPlanMode` within the same session
- Fixed fullscreen mode showing a blank screen after laptop sleep/wake or Ctrl+Z/`fg` until the next keystroke or stream output
- Fixed cursor landing mid-grapheme on Ctrl+E/A/K/U/arrow keys when an Indic conjunct or ZWJ emoji wraps across lines
- Fixed vim operators corrupting text containing decomposed (NFD) accented characters
- Fixed pasting text starting with `/` silently swallowing the input or triggering an unknown-command reply
- Fixed pasting dumping stray escape sequences into the prompt when focus events or mouse-tracking reports interleave with the bracketed paste
- Fixed mouse wheel scrolling being too fast in Cursor and VS Code 1.92–1.104 due to an upstream xterm.js bug
- Fixed scroll-wheel handling in JetBrains IDE 2025.2 terminals (spurious arrow keys, wrong-direction events, runaway acceleration)
- Fixed `/usage` Ctrl+S hanging when copying the stats screenshot to the clipboard on Linux/X11
- Fixed `/terminal-setup` showing a contradictory error in Windows Terminal — Shift+Enter is natively supported there
- Fixed `/effort` picker not reflecting the `CLAUDE_CODE_EFFORT_LEVEL` env var override
- Fixed `/status` showing the wrong default model for some users
- Fixed slash command autocomplete popup being capped at ~3–5 visible commands instead of scaling with terminal height
- Fixed statusline `context_window` token counts reflecting cumulative session totals instead of current context usage
- Fixed Alt+T (thinking toggle) not working on macOS terminals without "Option as Meta" enabled (iTerm2, Terminal.app defaults)
- Fixed dead keyboard input on Windows after re-opening a background session from `claude agents`
- Fixed unbounded memory growth (10GB+ RSS) when a stdio MCP server writes non-protocol data to stdout
- Fixed MCP servers that connect but fail `tools/list` silently showing 0 tools — they now retry once and show "connected · tools fetch failed" in `/mcp`
- Fixed unauthorized claude.ai MCP connectors showing as "failed" instead of "needs auth", and headless `-p` mode retrying non-transient 4xx connection failures
- Improved visual consistency in slash command dialogs and `/login`, `/upgrade`, `/extra-usage` dialog spacing
- Updated the `/tui fullscreen` startup banner to describe additional renderer benefits (lower memory usage, mouse support, auto-copy on select)
- Fixed Bedrock and Vertex 400 errors when `ENABLE_PROMPT_CACHING_1H` is set

## 2.1.131

- Fixed VS Code extension failing to activate on Windows due to a hardcoded build path in the bundled SDK (`createRequire` polyfill bug)
- Fixed Mantle endpoint authentication failing with missing `x-api-key` header

## 2.1.129

- Added `--plugin-url <url>` flag to fetch a plugin `.zip` archive from a URL for the current session
- Added `CLAUDE_CODE_FORCE_SYNC_OUTPUT=1` env var to force-enable synchronized output on terminals that auto-detection misses (e.g. Emacs `eat`)
- Added `CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE`: when set on Homebrew or WinGet installations, Claude Code runs the upgrade command in the background and prompts to restart
- Plugin manifests: `themes` and `monitors` should now be declared under `"experimental": { ... }`. Top-level declarations still work but `claude plugin validate` will warn
- Gateway `/v1/models` discovery for the `/model` picker is now opt-in via `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1` (was automatic in 2.1.126–2.1.128)
- Ctrl+R history picker now defaults to searching all prompts across all projects, matching pre-2.1.124 behavior. Press Ctrl+S to narrow to the current project or session
- Third-party deployments (Bedrock, Vertex, Foundry, or `ANTHROPIC_BASE_URL` gateway) no longer see spinner tips pointing at first-party Anthropic surfaces
- `skillOverrides` setting now works: `off` hides from model and `/`, `user-invocable-only` hides from model only, `name-only` collapses description
- The `claude_code.pull_request.count` OTel metric now counts PRs/MRs created via MCP tools, not just shell commands
- Policy refusal error messages now include the API Request ID for easier support debugging
- Fixed API errors with unrecognized 400 status codes showing raw JSON instead of the underlying error message
- Fixed `/clear` not resetting the terminal tab title after a conversation
- Fixed session title chip from `/rename` disappearing while a permission or other dialog is active
- Fixed agent panel below the prompt being hidden when subagents are running (regression in 2.1.122)
- Fixed external-editor handoff (Ctrl+G) blanking the conversation history above the prompt
- Fixed `/context` dumping its rendered ASCII visualization grid into the conversation, wasting ~1.6k tokens per call
- Fixed `/agents` Library list arrow-key navigation: the highlighted agent now stays visible when the list exceeds the viewport
- Fixed `/branch` success message not including the new branch's session id for `/resume`
- Fixed bold headers with keycap/ZWJ/skin-tone emoji losing trailing characters in fullscreen mode
- Fixed server-managed settings policy not applying for enterprise/team users whose stored OAuth credentials lacked the `user:inference` scope
- Fixed OAuth refresh race after wake-from-sleep that could log out all running sessions
- Fixed 1-hour prompt cache TTL being silently downgraded to 5 minutes
- Fixed cache-miss warning appearing spuriously after `/clear` or compaction when changing `/effort` or `/model`
- Fixed `Bash(mkdir *)`, `Bash(touch *)` and similar allow rules not being honored for in-project paths
- Fixed `deniedMcpServers` patterns with a `*://` scheme wildcard not matching mixed-case hostnames
- Fixed harmless WebSocket warning being logged as an error in `--debug` during voice mode
- [VSCode] Fixed `/clear` not clearing the conversation context and displayed transcript

## 2.1.128

- Bare `/color` (no args) now picks a random session color
- `/mcp` now shows the tool count for connected servers and flags servers that connected with 0 tools
- `--plugin-dir` now accepts `.zip` plugin archives in addition to directories
- `--channels` now works with console (API key) authentication — console orgs with managed settings must set `channelsEnabled: true` to enable
- Updated `/model` picker: collapsed duplicate Opus 4.7 entries, and current Opus now shows as "Opus" instead of "Opus 4.7"
- Subprocesses (Bash, hooks, MCP, LSP) no longer inherit `OTEL_*` environment variables, so OTEL-instrumented apps run via the Bash tool no longer pick up the CLI's own OTLP endpoint
- MCP: `workspace` is now a reserved server name — existing servers with that name will be skipped with a warning
- Reconnecting MCP servers no longer flood the conversation with full tool-name lists on every reconnect — re-announced tools are summarized by server prefix
- SDK hosts now receive a persistent `localSettings` suggestion for Bash permission prompts, so "Always allow" writes to `.claude/settings.local.json`
- `EnterWorktree` now creates the new branch from local HEAD as documented, instead of `origin/<default-branch>` — unpushed commits are no longer dropped
- Auto mode: when the classifier can't evaluate an action, the error now includes a hint (retry, `/compact`, or run with `--debug`)
- Fixed focus mode briefly dimming the previous response when submitting a new prompt
- Fixed stray "4;0;" desktop notification on every `/exit` in Kitty and other terminals that interpret OSC 9 as a notification
- Fixed Remote Control showing an empty "Opening your options…" message on rate limit instead of actionable upsell options
- Fixed drag-and-drop image upload hanging on "Pasting text…" when the image read fails
- Fixed crash loop when piping very large input (>10 MB) to `claude -p` via stdin
- Fixed long URLs not being individually clickable on every wrapped row in fullscreen mode
- Fixed `/plugin` Components panel showing "Marketplace 'inline' not found" for plugins loaded via `--plugin-dir`
- Fixed MCP tool results dropping images when the server returns both structured content and content blocks
- Fixed fenced code blocks inside list items carrying leading whitespace into the clipboard on copy-paste
- Fixed tab navigation in `/config` stranding focus — the tab header now stays focused so arrows and Esc keep working
- Fixed markdown link labels being lost on terminals without OSC 8 hyperlink support — links now render as `label (url)` instead of just the URL
- Fixed sessions on 1M-context models with a smaller autocompact window being falsely blocked with "Prompt is too long" before reaching the actual API limit
- Fixed parallel shell tool calls: a failing read-only command (grep, git diff, ls) no longer cancels sibling calls
- Fixed banner showing "with X effort" on models that don't support effort
- Fixed `/fast` on 3P providers fuzzy-matching to an unrelated skill instead of showing "not available"
- Fixed Bedrock default model resolving to `global.*` instead of the region-appropriate prefix
- Fixed vim mode: `Space` in NORMAL mode now moves the cursor right, matching standard vi/vim behavior
- Fixed terminal progress indicator (OSC 9;4) flickering off between tool calls — stays visible across the full turn
- Fixed `/rename` without args failing on resumed sessions whose last entry is a compact boundary
- Fixed stale "remote-control is active" status lines from prior sessions appearing after `--resume`/`--continue`
- Fixed stale `installed_plugins.json` entries pointing at deleted cache directories polluting PATH
- Fixed MCP stdio servers receiving corrupted arguments when `CLAUDE_CODE_SHELL_PREFIX` is set and an argument contains spaces or shell metacharacters
- Fixed sub-agent progress summaries missing the prompt cache (~3× `cache_creation` reduction)
- Fixed `/plugin update` never detecting new versions of npm-sourced plugins
- Fixed sub-agent summaries firing repeatedly while a sub-agent's transcript is static, capping worst-case token cost on idle sub-agents
- Headless `--output-format stream-json`: `init.plugin_errors` now includes `--plugin-dir` load failures in addition to dependency demotions

## 2.1.126

- The `/model` picker now lists models from your gateway's `/v1/models` endpoint when `ANTHROPIC_BASE_URL` points at an Anthropic-compatible gateway
- - Added `claude project purge [path]` to delete all Claude Code state for a project (transcripts, tasks, file history, config entry) — supports `--dry-run`, `-y/--yes`, `-i/--interactive`, and `--all`
- `--dangerously-skip-permissions` now bypasses prompts for writes to `.claude/`, `.git/`, `.vscode/`, shell config files, and other previously-protected paths (catastrophic removal commands still prompt as a safety net)
- `claude auth login` now accepts the OAuth code pasted into the terminal when the browser callback can't reach localhost (WSL2, SSH, containers)
- `claude_code.skill_activated` OpenTelemetry event now fires for user-typed slash commands and carries a new `invocation_trigger` attribute (`"user-slash"`, `"claude-proactive"`, or `"nested-skill"`)
- Auto mode: the spinner now turns red when a permission check stalls, instead of looking like the tool is running
- Host-managed deployments (`CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST`) no longer auto-disable analytics on Bedrock/Vertex/Foundry
- Windows: PowerShell 7 installed via the Microsoft Store, MSI without PATH, or `.NET global tool` is now detected
- Windows: when the PowerShell tool is enabled, Claude now treats PowerShell as the primary shell instead of defaulting to Bash
- Read tool: removed the per-file malware-assessment reminder that could cause spurious refusals and "this is not malware" commentary on legacy models
- **Security:** Fixed `allowManagedDomainsOnly` / `allowManagedReadPathsOnly` being ignored when a higher-priority managed-settings source lacked a `sandbox` block
- Fixed pasting an image larger than 2000px breaking the session — images are now downscaled on paste, and oversized images in history are automatically removed and the request retried
- Fixed showing the login screen for "OAuth not allowed for organization" errors — now shows guidance to contact your admin
- Fixed OAuth login failing with timeout on slow or proxied connections, in IPv6-only devcontainers, and when the browser callback can't reach localhost
- Fixed a rare race where a concurrent credential write could clear a valid OAuth refresh token
- Fixed API retry countdown sticking at "0s" instead of counting down between attempts
- Fixed "Stream idle timeout" error after waking Mac from sleep mid-request
- Fixed background and remote sessions falsely aborting with "Stream idle timeout" during long model thinking pauses
- Fixed a hang where the assistant could finish thinking but show no output after a run of empty turns
- Fixed overly fast trackpad scrolling in Cursor and VS Code 1.92–1.104 integrated terminals
- Fixed claude.ai MCP connectors being suppressed by manual servers stuck in needs-auth state
- Fixed Japanese/Korean/Chinese text rendering as garbled characters on Windows in no-flicker mode
- Fixed `Ctrl+L` clearing the prompt input — it now only forces a screen redraw, matching readline behavior
- Fixed deferred tools (WebSearch, WebFetch, etc.) not being available to skills with `context: fork` and other subagents on their first turn
- Fixed plan-mode tools being unavailable in interactive sessions launched with `--channels`
- Fixed `/plugin` Uninstall reporting "Enabled" instead of "Uninstalled"
- Bounded total size of file-modified reminders when a linter touches many files at once
- Fixed `/remote-control` retries appearing stuck on "connecting…" — each retry now shows its result
- Fixed Remote Control failure notification not showing the error reason for initial connection failures
- Windows: clipboard writes no longer expose copied content in process command-line arguments visible to EDR/SIEM telemetry; also fixes >22KB selections not reaching the clipboard
- PowerShell tool: bare `--` (e.g. `git diff -- file`) is no longer mis-flagged as the `--%` stop-parsing token
- Fixed Agent SDK hang when the model emits a malformed tool name in a parallel tool call batch

## 2.1.123

- Fixed OAuth authentication failing with a 401 retry loop when `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` is set

## 2.1.122

- Added `ANTHROPIC_BEDROCK_SERVICE_TIER` environment variable to select a Bedrock service tier (`default`, `flex`, or `priority`), sent as the `X-Amzn-Bedrock-Service-Tier` header
- Pasting a PR URL into the `/resume` search box now finds the session that created that PR (GitHub, GitHub Enterprise, GitLab, and Bitbucket)
- `/mcp` now shows claude.ai connectors hidden by a manually-added server with the same URL, with a hint to remove the duplicate
- Clarified the `/mcp` message shown when an MCP server is still unauthorized after the browser sign-in flow
- OpenTelemetry: numeric attributes on `api_request`/`api_error` log events are now emitted as numbers, not strings
- OpenTelemetry: added `claude_code.at_mention` log event for `@`-mention resolution
- Fixed `/branch` producing forks that fail with "tool_use ids were found without tool_result blocks" when the source session contained entries from rewound timelines
- Fixed `/model` not showing the Effort option for Bedrock application inference profile ARNs, and those ARNs not receiving `output_config.effort`
- Fixed Vertex AI / Bedrock returning `invalid_request_error: output_config: Extra inputs are not permitted` on session-title generation and other structured-output queries
- Fixed Vertex AI `count_tokens` endpoint returning 400 errors for users behind proxy gateways
- Fixed `spinnerTipsOverride.excludeDefault` not suppressing the time-based spinner tips
- Fixed ToolSearch missing MCP tools that connected after session start in nonblocking mode
- Fixed `!exit` / `!quit` in bash mode terminating the CLI instead of running as a shell command
- Fixed images sent to newer models being resized to 2576px per side instead of the correct 2000px maximum
- Fixed remote control session idle status redrawing twice per second, which could flood `tmux -CC` control pipes and pause the terminal
- Fixed assistant messages appearing blank in some sessions due to a stale view preference
- Fixed a malformed hooks entry in `settings.json` no longer invalidating the entire file
- Voice mode: keybindings bound to Caps Lock now show an error since terminals don't deliver Caps Lock as a key event

## 2.1.121

- Added `alwaysLoad` option to MCP server config — when `true`, all tools from that server skip tool-search deferral and are always available
- Added `claude plugin prune` to remove orphaned auto-installed plugin dependencies; `plugin uninstall --prune` cascades
- Added a type-to-filter search box to `/skills` so you can find a skill in long lists without scrolling
- PostToolUse hooks can now replace tool output for all tools via `hookSpecificOutput.updatedToolOutput` (previously MCP-only)
- Fullscreen mode: typing into the prompt no longer jumps scroll back to the bottom after you've scrolled up to read earlier output
- Dialogs that overflow the terminal are now scrollable with arrow keys, PgUp/PgDn, home/end, and mouse wheel in both fullscreen and non-fullscreen modes
- Clicking any line of a long URL that wraps across rows in fullscreen mode now opens the full URL
- SDK and `claude -p`: `CLAUDE_CODE_FORK_SUBAGENT=1` now works in non-interactive sessions
- `--dangerously-skip-permissions` no longer prompts for writes to `.claude/skills/`, `.claude/agents/`, and `.claude/commands/`
- `/terminal-setup` now enables iTerm2's "Applications in terminal may access clipboard" setting so `/copy` works, including from tmux
- MCP servers that hit a transient error during startup now auto-retry up to 3 times instead of staying disconnected
- The terminal tab session title is now generated in your configured `language` setting
- Claude.ai connectors with the same upstream URL are now deduplicated instead of appearing as duplicates
- Vertex AI: support X.509 certificate-based Workload Identity Federation (mTLS ADC)
- Faster startup after upgrading: removed the Recent Activity panel from the release-notes splash
- LSP diagnostic summaries now expand on click/ctrl+o and show the expand hint
- SDK: `mcp_authenticate` now supports `redirectUri` for custom scheme completion and claude.ai connectors
- OpenTelemetry: added `stop_reason`, `gen_ai.response.finish_reasons`, and `user_system_prompt` (gated behind `OTEL_LOG_USER_PROMPTS`) to LLM request spans
- [VSCode] Voice dictation now respects the `accessibility.voice.speechLanguage` setting when no Claude Code language is configured
- [VSCode] `/context` now opens a native token usage dialog
- Fixed unbounded memory growth (multi-GB RSS) when processing many images in a session
- Fixed `/usage` leaking up to ~2GB of memory on machines with large transcript histories
- Fixed memory leak when long-running tools fail to emit a clear progress event
- Fixed Bash tool becoming permanently unusable when the directory Claude was started in is deleted or moved mid-session
- Fixed `--resume` crashing on startup in external builds
- Fixed `--resume` failing on large sessions when a transcript line was corrupted by an unclean shutdown — the corrupt line is now skipped
- Fixed `thinking.type.enabled is not supported` error when using Bedrock application inference profile ARNs
- Fixed Microsoft 365 MCP OAuth failing with duplicate or unsupported `prompt` parameter
- Fixed scrollback duplication when pressing Ctrl+L or triggering a redraw in non-fullscreen mode on tmux, GNOME Terminal, Windows Terminal, and Konsole
- Fixed claude.ai MCP connectors silently disappearing when the connector-list fetch hits a transient auth error at startup
- Fixed "Always allow" rules for built-in tools in remote sessions not surviving worker restarts
- Fixed `NO_PROXY` not being respected for all HTTP clients when set via `managed-settings.json` under the native build
- Fixed managed settings approval prompt exiting the session even when accepted — now applies settings and continues
- Fixed `/usage` returning "rate limited" after a stale OAuth token — now refreshes automatically
- Fixed invalid legacy enum values in `settings.json` invalidating the entire settings file
- Fixed `/usage` dialog content being clipped when no-flicker mode is off
- Fixed `/focus` showing "Unknown command" when the fullscreen renderer is off — now explains how to enable it
- Fixed embedded grep/find/rg shell wrappers failing when the running binary is deleted mid-session — now falls back to installed tools
- Reduced peak file descriptor usage during `find` in the Bash tool on large directory trees

## 2.1.120

- Windows: Git for Windows (Git Bash) is no longer required — when absent, Claude Code uses PowerShell as the shell tool
- Added `claude ultrareview [target]` subcommand to run `/ultrareview` non-interactively from CI or scripts — prints findings to stdout (`--json` for raw output) and exits 0 on completion or 1 on failure
- Skills can now reference the current effort level with `${CLAUDE_EFFORT}` in their content
- Set `AI_AGENT` environment variable for subprocesses so `gh` can attribute traffic to Claude Code
- Spinner tips that recommend installing the desktop app or creating skills/agents are now hidden when you already have them
- Show a "use PgUp/PgDn to scroll" hint when the terminal sends arrow keys instead of scroll events
- Faster session start when you have many claude.ai connectors configured but not authorized
- The auto mode denial message now links to the configuration docs
- `claude plugin validate` now accepts `$schema`, `version`, and `description` at the top level of `marketplace.json` and `$schema` in `plugin.json`
- Auto-compact in auto mode now displays `auto` (lowercase, no token count) instead of a misleading token value
- Fixed pressing Esc during a stdio MCP tool call closing the entire server connection (regression in 2.1.105)
- Fixed `/rewind` and other interactive overlays not responding to keyboard input after launching with `claude --resume`
- Fixed terminal scrollback duplication in non-fullscreen mode (resize, dialog dismiss, long sessions)
- Fixed `DISABLE_TELEMETRY` / `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` not suppressing usage metrics telemetry for API and enterprise users
- Fixed false-positive "Dangerous rm operation" permission prompts in auto mode for multi-line bash commands containing both a pipe and a redirect
- Fixed long selection menus clipping below the terminal in fullscreen mode — the focused option now stays on screen as you scroll
- Fixed Write tool output collapsing instead of expanding when clicking "+N lines" in fullscreen
- Fixed slash command picker jumping while typing, and improved highlight to only match contiguous substrings in blue
- Fixed `/plugin` marketplace failing to load when one entry uses an unrecognized source format — that entry is shown but installing it prompts you to update
- [VSCode] `/usage` now opens the native Account & Usage dialog instead of returning plain-text session cost
- [VSCode] Voice dictation now respects the `language` setting in `~/.claude/settings.json`
- Fixed `find` in the Bash tool exhausting open file descriptors on large directory trees, causing host-wide crashes (macOS/Linux native builds)

## 2.1.119

- `/config` settings (theme, editor mode, verbose, etc.) now persist to `~/.claude/settings.json` and participate in project/local/policy override precedence
- Added `prUrlTemplate` setting to point the footer PR badge at a custom code-review URL instead of github.com
- Added `CLAUDE_CODE_HIDE_CWD` environment variable to hide the working directory in the startup logo
- `--from-pr` now accepts GitLab merge-request, Bitbucket pull-request, and GitHub Enterprise PR URLs
- `--print` mode now honors the agent's `tools:` and `disallowedTools:` frontmatter, matching interactive-mode behavior
- `--agent <name>` now honors the agent definition's `permissionMode` for built-in agents
- PowerShell tool commands can now be auto-approved in permission mode, matching Bash behavior
- Hooks: `PostToolUse` and `PostToolUseFailure` hook inputs now include `duration_ms` (tool execution time, excluding permission prompts and PreToolUse hooks)
- Subagent and SDK MCP server reconfiguration now connects servers in parallel instead of serially
- Plugins pinned by another plugin's version constraint now auto-update to the highest satisfying git tag
- Vim mode: Esc in INSERT no longer pulls a queued message back into the input; press Esc again to interrupt
- Slash command suggestions now highlight the characters that matched your query
- Slash command picker now wraps long descriptions onto a second line instead of truncating
- `owner/repo#N` shorthand links in output now use your git remote's host instead of always pointing at github.com
- Security: `blockedMarketplaces` now correctly enforces `hostPattern` and `pathPattern` entries
- OpenTelemetry: `tool_result` and `tool_decision` events now include `tool_use_id`; `tool_result` also includes `tool_input_size_bytes`
- Status line: stdin JSON now includes `effort.level` and `thinking.enabled`
- Fixed pasting CRLF content (Windows clipboards, Xcode console) inserting an extra blank line between every line
- Fixed multi-line paste losing newlines in terminals using kitty keyboard protocol sequences inside bracketed paste
- Fixed Glob and Grep tools disappearing on native macOS/Linux builds when the Bash tool is denied via permissions
- Fixed scrolling up in fullscreen mode snapping back to the bottom every time a tool finishes
- Fixed MCP HTTP connections failing with "Invalid OAuth error response" when servers returned non-JSON bodies for OAuth discovery requests
- Fixed Rewind overlay showing "(no prompt)" for messages with image attachments
- Fixed auto mode overriding plan mode with conflicting "Execute immediately" instructions
- Fixed async `PostToolUse` hooks that emit no response payload writing empty entries to the session transcript
- Fixed spinner staying on when a subagent task notification is orphaned in the queue
- Tool search is now disabled by default on Vertex AI to avoid an unsupported beta header error (opt in with `ENABLE_TOOL_SEARCH`)
- Fixed `@`-file Tab completion replacing the entire prompt when used inside a slash command with an absolute path
- Fixed a stray `p` character appearing at the prompt on startup in macOS Terminal.app via Docker or SSH
- Fixed `${ENV_VAR}` placeholders in `headers` for HTTP/SSE/WebSocket MCP servers not being substituted before requests
- Fixed MCP OAuth client secret stored via `--client-secret` not being sent during token exchange for servers requiring `client_secret_post`
- Fixed `/skills` Enter key closing the dialog instead of pre-filling `/<skill-name>` in the prompt
- Fixed `/agents` detail view mislabeling built-in tools unavailable to subagents as "Unrecognized"
- Fixed MCP servers from plugins not spawning on Windows when the plugin cache was incomplete
- Fixed `/export` showing the current default model instead of the model the conversation actually used
- Fixed verbose output setting not persisting after restart
- Fixed `/usage` progress bars overlapping with their "Resets …" labels
- Fixed plugin MCP servers failing when `${user_config.*}` references an optional field left blank
- Fixed list items containing a sentence-final number wrapping the number onto its own line
- Fixed `/plan` and `/plan open` not acting on the existing plan when entering plan mode
- Fixed skills invoked before auto-compaction being re-executed against the next user message
- Fixed `/reload-plugins` and `/doctor` reporting load errors for disabled plugins
- Fixed Agent tool with `isolation: "worktree"` reusing stale worktrees from prior sessions
- Fixed disabled MCP servers appearing as "failed" in `/status`
- Fixed `TaskList` returning tasks in arbitrary filesystem order instead of sorted by ID
- Fixed spurious "GitHub API rate limit exceeded" hints when `gh` output contained PR titles mentioning "rate limit"
- Fixed SDK/bridge `read_file` not correctly enforcing size cap on growing files
- Fixed PR not linked to session when working in a git worktree
- Fixed `/doctor` warning about MCP server entries overridden by a higher-precedence scope
- Windows: removed false-positive "Windows requires 'cmd /c' wrapper" MCP config warning
- [VSCode] Fixed voice dictation's first recording producing nothing on macOS while the microphone permission prompt is showing

## 2.1.118

- Added vim visual mode (`v`) and visual-line mode (`V`) with selection, operators, and visual feedback
- Merged `/cost` and `/stats` into `/usage` — both remain as typing shortcuts that open the relevant tab
- Create and switch between named custom themes from `/theme`, or hand-edit JSON files in `~/.claude/themes/`; plugins can also ship themes via a `themes/` directory
- Hooks can now invoke MCP tools directly via `type: "mcp_tool"`
- Added `DISABLE_UPDATES` env var to completely block all update paths including manual `claude update` — stricter than `DISABLE_AUTOUPDATER`
- WSL on Windows can now inherit Windows-side managed settings via the `wslInheritsWindowsSettings` policy key
- Auto mode: include `"$defaults"` in `autoMode.allow`, `autoMode.soft_deny`, or `autoMode.environment` to add custom rules alongside the built-in list instead of replacing it
- Added a "Don't ask again" option to the auto mode opt-in prompt
- Added `claude plugin tag` to create release git tags for plugins with version validation
- `--continue`/`--resume` now find sessions that added the current directory via `/add-dir`
- `/color` now syncs the session accent color to claude.ai/code when Remote Control is connected
- The `/model` picker now honors `ANTHROPIC_DEFAULT_*_MODEL_NAME`/`_DESCRIPTION` overrides when using a custom `ANTHROPIC_BASE_URL` gateway
- When auto-update skips a plugin due to another plugin's version constraint, the skip now appears in `/doctor` and the `/plugin` Errors tab
- Fixed `/mcp` menu hiding OAuth Authenticate/Re-authenticate actions for servers configured with `headersHelper`, and HTTP/SSE MCP servers with custom headers being stuck in "needs authentication" after a transient 401
- Fixed MCP servers whose OAuth token response omits `expires_in` requiring re-authentication every hour
- Fixed MCP step-up authorization silently refreshing instead of prompting for re-consent when the server's `insufficient_scope` 403 names a scope the current token already has
- Fixed an unhandled promise rejection when an MCP server's OAuth flow times out or is cancelled
- Fixed MCP OAuth refresh proceeding without its cross-process lock under contention
- Fixed macOS keychain race where a concurrent MCP token refresh could overwrite a freshly-refreshed OAuth token, causing unexpected "Please run /login" prompts
- Fixed OAuth token refresh failing when the server revokes a token before its local expiry time
- Fixed credential save crash on Linux/Windows corrupting `~/.claude/.credentials.json`
- Fixed `/login` having no effect in a session launched with `CLAUDE_CODE_OAUTH_TOKEN` — the env token is now cleared so disk credentials take effect
- Fixed unreadable text in the "new messages" scroll pill and `/plugin` badges
- Fixed plan acceptance dialog offering "auto mode" instead of "bypass permissions" when running with `--dangerously-skip-permissions`
- Fixed agent-type hooks failing with "Messages are required for agent hooks" when configured for events other than `Stop` or `SubagentStop`
- Fixed `prompt` hooks re-firing on tool calls made by an agent-hook verifier subagent
- Fixed `/fork` writing the full parent conversation to disk per fork — now writes a pointer and hydrates on read
- Fixed Alt+K / Alt+X / Alt+^ / Alt+_ freezing keyboard input
- Fixed connecting to a remote session overwriting your local `model` setting in `~/.claude/settings.json`
- Fixed typeahead showing "No commands match" error when pasting file paths that start with `/`
- Fixed `plugin install` on an already-installed plugin not re-resolving a dependency installed at the wrong version
- Fixed unhandled errors from file watcher on invalid paths or fd exhaustion
- Fixed Remote Control sessions getting archived on transient CCR initialization blips during JWT refresh
- Fixed subagents resumed via `SendMessage` not restoring the explicit `cwd` they were spawned with

## 2.1.117

- Forked subagents can now be enabled on external builds by setting `CLAUDE_CODE_FORK_SUBAGENT=1`
- Agent frontmatter `mcpServers` are now loaded for main-thread agent sessions via `--agent`
- Improved `/model`: selections now persist across restarts even when the project pins a different model, and the startup header shows when the active model comes from a project or managed-settings pin
- The `/resume` command now offers to summarize stale, large sessions before re-reading them, matching the existing `--resume` behavior
- Faster startup when both local and claude.ai MCP servers are configured (concurrent connect now default)
- `plugin install` on an already-installed plugin now installs any missing dependencies instead of stopping at "already installed"
- Plugin dependency errors now say "not installed" with an install hint, and `claude plugin marketplace add` now auto-resolves missing dependencies from configured marketplaces
- Managed-settings `blockedMarketplaces` and `strictKnownMarketplaces` are now enforced on plugin install, update, refresh, and autoupdate
- Advisor Tool (experimental): dialog now carries an "experimental" label, learn-more link, and startup notification when enabled; sessions no longer get stuck with "Advisor tool result content could not be processed" errors on every prompt and `/compact`
- The `cleanupPeriodDays` retention sweep now also covers `~/.claude/tasks/`, `~/.claude/shell-snapshots/`, and `~/.claude/backups/`
- OpenTelemetry: `user_prompt` events now include `command_name` and `command_source` for slash commands; `cost.usage`, `token.usage`, `api_request`, and `api_error` now include an `effort` attribute when the model supports effort levels. Custom/MCP command names are redacted unless `OTEL_LOG_TOOL_DETAILS=1` is set
- Native builds on macOS and Linux: the `Glob` and `Grep` tools are replaced by embedded `bfs` and `ugrep` available through the Bash tool — faster searches without a separate tool round-trip (Windows and npm-installed builds unchanged)
- Windows: cached `where.exe` executable lookups per process for faster subprocess launches
- Default effort for Pro/Max subscribers on Opus 4.6 and Sonnet 4.6 is now `high` (was `medium`)
- Fixed Plain-CLI OAuth sessions dying with "Please run /login" when the access token expires mid-session — the token is now refreshed reactively on 401
- Fixed `WebFetch` hanging on very large HTML pages by truncating input before HTML-to-markdown conversion
- Fixed a crash when a proxy returns HTTP 204 No Content — now surfaces a clear error instead of a `TypeError`
- Fixed `/login` having no effect when launched with `CLAUDE_CODE_OAUTH_TOKEN` env var and that token expires
- Fixed prompt-input undo (`Ctrl+_`) doing nothing immediately after typing, and skipping a state on each undo step
- Fixed `NO_PROXY` not being respected for remote API requests when running under Bun
- Fixed rare spurious escape/return triggers when key names arrive as coalesced text over slow connections
- Fixed SDK `reload_plugins` reconnecting all user MCP servers serially
- Fixed Bedrock application-inference-profile requests failing with 400 when backed by Opus 4.7 with thinking disabled
- Fixed MCP `elicitation/create` requests auto-cancelling in print/SDK mode when the server finishes connecting mid-turn
- Fixed subagents running a different model than the main agent incorrectly flagging file reads with a malware warning
- Fixed idle re-render loop when background tasks are present, reducing memory growth on Linux
- [VSCode] Fixed "Manage Plugins" panel breaking when multiple large marketplaces are configured
- Fixed Opus 4.7 sessions showing inflated `/context` percentages and autocompacting too early — Claude Code was computing against a 200K context window instead of Opus 4.7's native 1M

## 2.1.116

- `/resume` on large sessions is significantly faster (up to 67% on 40MB+ sessions) and handles sessions with many dead-fork entries more efficiently
- Faster MCP startup when multiple stdio servers are configured; `resources/templates/list` is now deferred to first `@`-mention
- Smoother fullscreen scrolling in VS Code, Cursor, and Windsurf terminals — `/terminal-setup` now configures the editor's scroll sensitivity
- Thinking spinner now shows progress inline ("still thinking", "thinking more", "almost done thinking"), replacing the separate hint row
- `/config` search now matches option values (e.g. searching "vim" finds the Editor mode setting)
- `/doctor` can now be opened while Claude is responding, without waiting for the current turn to finish
- `/reload-plugins` and background plugin auto-update now auto-install missing plugin dependencies from marketplaces you've already added
- Bash tool now surfaces a hint when `gh` commands hit GitHub's API rate limit, so agents can back off instead of retrying
- The Usage tab in Settings now shows your 5-hour and weekly usage immediately and no longer fails when the usage endpoint is rate-limited
- Agent frontmatter `hooks:` now fire when running as a main-thread agent via `--agent`
- Slash command menu now shows "No commands match" when your filter has zero results, instead of disappearing
- Security: sandbox auto-allow no longer bypasses the dangerous-path safety check for `rm`/`rmdir` targeting `/`, `$HOME`, or other critical system directories
- Claude Code and installer now use `https://downloads.claude.ai/claude-code-releases` instead of `https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases`
- Fixed Devanagari and other Indic scripts rendering with broken column alignment in the terminal UI
- Fixed Ctrl+- not triggering undo in terminals using the Kitty keyboard protocol (iTerm2, Ghostty, kitty, WezTerm, Windows Terminal)
- Fixed Cmd+Left/Right not jumping to line start/end in terminals that use the Kitty keyboard protocol (Warp fullscreen, kitty, Ghostty, WezTerm)
- Fixed Ctrl+Z hanging the terminal when Claude Code is launched via a wrapper process (e.g. `npx`, `bun run`)
- Fixed scrollback duplication in inline mode where resizing the terminal or large output bursts would repeat earlier conversation history
- Fixed modal search dialogs overflowing the screen at short terminal heights, hiding the search box and keyboard hints
- Fixed scattered blank cells and disappearing composer chrome in the VS Code integrated terminal during scrolling
- Fixed an intermittent API 400 error related to cache control TTL ordering that could occur when a parallel request completed during request setup
- Fixed `/branch` rejecting conversations with transcripts larger than 50MB
- Fixed `/resume` silently showing an empty conversation on large session files instead of reporting the load error
- Fixed `/plugin` Installed tab showing the same item twice when it appears under Needs attention or Favorites
- Fixed `/update` and `/tui` not working after entering a worktree mid-session

## 2.1.114

- Fixed a crash in the permission dialog when an agent teams teammate requested tool permission

## 2.1.113

- Changed the CLI to spawn a native Claude Code binary (via a per-platform optional dependency) instead of bundled JavaScript
- Added `sandbox.network.deniedDomains` setting to block specific domains even when a broader `allowedDomains` wildcard would otherwise permit them
- Fullscreen mode: Shift+↑/↓ now scrolls the viewport when extending a selection past the visible edge
- `Ctrl+A` and `Ctrl+E` now move to the start/end of the current logical line in multiline input, matching readline behavior
- Windows: `Ctrl+Backspace` now deletes the previous word
- Long URLs in responses and bash output stay clickable when they wrap across lines (in terminals with OSC 8 hyperlinks)
- Improved `/loop`: pressing Esc now cancels pending wakeups, and wakeups display as "Claude resuming /loop wakeup" for clarity
- `/extra-usage` now works from Remote Control (mobile/web) clients
- Remote Control clients can now query `@`-file autocomplete suggestions
- Improved `/ultrareview`: faster launch with parallelized checks, diffstat in the launch dialog, and animated launching state
- Subagents that stall mid-stream now fail with a clear error after 10 minutes instead of hanging silently
- Bash tool: multi-line commands whose first line is a comment now show the full command in the transcript, closing a UI-spoofing vector
- Running `cd <current-directory> && git …` no longer triggers a permission prompt when the `cd` is a no-op
- Security: on macOS, `/private/{etc,var,tmp,home}` paths are now treated as dangerous removal targets under `Bash(rm:*)` allow rules
- Security: Bash deny rules now match commands wrapped in `env`/`sudo`/`watch`/`ionice`/`setsid` and similar exec wrappers
- Security: `Bash(find:*)` allow rules no longer auto-approve `find -exec`/`-delete`
- Fixed MCP concurrent-call timeout handling where a message for one tool call could silently disarm another call's watchdog
- Fixed Cmd-backspace / `Ctrl+U` to once again delete from the cursor to the start of the line
- Fixed markdown tables breaking when a cell contains an inline code span with a pipe character
- Fixed session recap auto-firing while composing unsent text in the prompt
- Fixed `/copy` "Full response" not aligning markdown table columns for pasting into GitHub, Notion, or Slack
- Fixed messages typed while viewing a running subagent being hidden from its transcript and misattributed to the parent AI
- Fixed Bash `dangerouslyDisableSandbox` running commands outside the sandbox without a permission prompt
- Fixed `/effort auto` confirmation — now says "Effort level set to max" to match the status bar label
- Fixed the "copied N chars" toast overcounting emoji and other multi-code-unit characters
- Fixed `/insights` crashing with `EBUSY` on Windows
- Fixed exit confirmation dialog mislabeling one-shot scheduled tasks as recurring — now shows a countdown
- Fixed slash/@ completion menu not sitting flush against the prompt border in fullscreen mode
- Fixed `CLAUDE_CODE_EXTRA_BODY` `output_config.effort` causing 400 errors on subagent calls to models that don't support effort and on Vertex AI
- Fixed prompt cursor disappearing when `NO_COLOR` is set
- Fixed `ToolSearch` ranking so pasted MCP tool names surface the actual tool instead of description-matching siblings
- Fixed compacting a resumed long-context session failing with "Extra usage is required for long context requests"
- Fixed `plugin install` succeeding when a dependency version conflicts with an already-installed plugin — now reports `range-conflict`
- Fixed "Refine with Ultraplan" not showing the remote session URL in the transcript
- Fixed SDK image content blocks that fail to process crashing the session — now degrade to a text placeholder
- Fixed Remote Control sessions not streaming subagent transcripts
- Fixed Remote Control sessions not being archived when Claude Code exits
- Fixed `thinking.type.enabled is not supported` 400 error when using Opus 4.7 via a Bedrock Application Inference Profile ARN