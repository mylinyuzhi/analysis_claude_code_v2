# Changelog

## 2.1.183

- Improved auto mode safety: destructive git commands (`git reset --hard`, `git checkout -- .`, `git clean -fd`, `git stash drop`) are now blocked when you didn't ask to discard local work, `git commit --amend` is blocked when the commit wasn't made by the agent this session, and `terraform destroy`/`pulumi destroy`/`cdk destroy` are blocked unless you asked for the specific stack
- Added a warning when the requested model is deprecated or automatically updated to a newer model, shown on stderr in print mode (`-p`) and now also covering models set in agent frontmatter
- Added `attribution.sessionUrl` setting to omit the claude.ai session link from commits and PRs in web and Remote Control sessions
- Added `/config --help` to list all available shorthand keys for `/config key=value`
- Changed `/config` toggle behavior: Enter and Space both change the selected setting, and Esc now saves and closes instead of reverting
- Removed the startup "setup issues" line under the logo — run `/doctor` to see configuration issues or use `--debug`
- Fixed `thinking.disabled.display: Extra inputs are not permitted` 400 errors on subagent spawns and session-title generation for affected configurations
- Fixed WebSearch returning empty results in subagents
- Fixed the terminal cursor being stranded above the prompt after navigating history in vim mode with the native cursor enabled
- Fixed fullscreen TUI corruption (statusline mid-screen, duplicated spinner rows, merged text) in Windows Terminal under heavy nested-subagent load
- Fixed turns silently completing with no visible output when the model returned only a thinking block; Claude now re-prompts once
- Fixed user-level skills appearing multiple times in slash-command autocomplete when multiple plugins are enabled
- Fixed MCP servers requiring authentication exposing auth-stub tools to the model in headless/SDK mode
- Fixed tmux teammate panes failing to launch when the shell has slow rc-file initialization, and keystrokes typed during agent spawn leaking into the new tmux pane instead of the leader prompt
- Fixed background tasks started by a teammate being killed when the teammate finishes a turn
- Fixed scheduled task and webhook trigger deliveries being treated as keyboard input; they now classify as task notifications and can no longer approve a pending action or set the session title in auto mode
- Fixed focus mode showing "Ran N PostToolUse hooks" timing lines under each response

## 2.1.181

- Added `/config key=value` syntax to set any setting from the prompt (e.g. `/config thinking=false`) — works in interactive, `-p`, and Remote Control
- Added `sandbox.allowAppleEvents` opt-in setting that lets sandboxed commands send Apple Events on macOS
- Added `CLAUDE_CLIENT_PRESENCE_FILE` environment variable: point it at a marker file to suppress mobile push notifications while you're at the machine
- Upgraded the bundled Bun runtime to 1.4
- Improved streaming of long paragraphs: text now appears line-by-line instead of waiting for the first line break
- Improved auto-retry: API connection drops mid-thinking now automatically retry instead of showing "Connection closed while thinking"
- Improved the subagent panel: idle subagents auto-hide after 30s, the list caps at 5 rows with scroll hints, and keyboard hints now show in the footer
- Improved the MCP OAuth browser page to match Claude Code's visual style and auto-close on success
- Changed fullscreen mode URL opening to require Cmd+click (macOS) / Ctrl+click, matching native terminal behavior
- Changed the `Improved N memories` line to no longer list individual files outside verbose mode
- Fixed prompt caching not reading on custom `ANTHROPIC_BASE_URL` and on Foundry due to a per-request attestation token changing every turn
- Fixed Write/Edit producing 0-byte or truncated files on network drives and cloud-synced folders
- Fixed `open`, `osascript`, and browser-based auth flows failing with error -600 on macOS by adding the Apple Events entitlement
- Fixed a startup regression (~120ms per launch in fresh environments, introduced in 2.1.169): the first prompt no longer waits for the managed-settings fetch when no MCP servers are configured
- Fixed startup blocking with a blank terminal for up to 15 seconds when the account settings fetch is slow on a degraded network
- Fixed startup crash (`TypeError: Cannot read properties of null`) when `.claude.json` contains corrupted null project entries
- Fixed macOS TUI freezing at session start (Ctrl+C unresponsive) when Spotlight is busy reindexing
- Fixed long-running idle sessions losing their history when another Claude Code process ran the 30-day transcript cleanup
- Fixed foreground subagents spawning unbounded nested chains; they now respect the same 5-level depth limit as background subagents
- Fixed `/recap` and conversation forks using the previous model immediately after a model switch
- Fixed subagent "Thinking" duration showing the parent agent's elapsed time instead of the subagent's own
- Fixed subagents blocked on a nested agent showing a ticking elapsed time instead of "waiting" in the agent panel
- Fixed the API retry indicator ("Retrying in 0s · attempt N/10") staying on screen after the retry succeeded
- Fixed AWS `awsCredentialExport` credentials with a short remaining lifetime causing credential refreshes every minute, and now accepts the JSON shape from `aws configure export-credentials`
- Fixed `claude mcp get`/`list` showing `✓ Connected` when tools/list fails; they now show `! Connected · tools fetch failed` with the error detail
- Fixed `/remote-control` leaving a stale "connecting…" line; it now confirms in the transcript once connected
- Fixed ExitWorktree refusing to remove a clean worktree with "Could not verify worktree state" when bare `git` cannot be resolved on Windows
- Fixed settings changes (such as `/effort` or `/model`) failing with ENOENT when `~/.claude/settings.json` is a relative symlink under a symlinked `~/.claude`
- Fixed IDE selection line numbers in context reminders being off by one (IntelliJ and VS Code)
- Fixed Ctrl+C in fullscreen after a native terminal selection (modifier+drag) overwriting the clipboard with the app's prior selection
- Fixed Ctrl+V showing "No image found in clipboard" instead of pasting when the clipboard contains text
- Fixed agent creation failing with "EEXIST: file already exists" when the agents directory already exists (Windows/OneDrive)
- Fixed AskUserQuestion preview content being cut off at the dialog edge instead of word-wrapping
- Fixed AskUserQuestion multi-select questions silently dropping a typed "Other" free-text answer when submitting
- Fixed `/stats` "Most active day" and daily token chart dates showing one day early in UTC-negative timezones
- Fixed `/copy` and copy-on-select on Linux not detecting a clipboard utility installed after Claude Code started
- Fixed tab-indented code rendering with incorrect indentation in the Write (create-file) preview
- Fixed user prompts queued mid-turn not showing a full-width background highlight in the transcript
- Fixed the activity spinner's pulse dwelling on the wrong glyph size in Ghostty

## 2.1.179

- Fixed mid-stream connection drops: partial responses are now preserved instead of showing a raw error, and the spinner no longer gets stuck at "running tool"
- Fixed mouse-wheel scrolling in WSL2 under Windows Terminal and VS Code (regression in 2.1.172)
- Fixed a sandbox `denyRead`/`allowRead` glob over a large directory tree making the Bash tool description enormous and the session unusable on Linux
- Fixed the feedback survey capturing a single-digit reply as a session rating immediately after a turn completes
- Fixed the welcome screen stacking multiple promotional banners — at most one promo now shows per session
- Fixed Ctrl+O not showing the subagent's transcript when viewing a subagent
- Fixed clicking the prompt input not returning focus from the subagent/footer panel
- Fixed remote session background tasks appearing stuck as "still running" between turns
- Improved plugin loading performance in remote sessions

## 2.1.178

- Agent teams: removed the `TeamCreate` and `TeamDelete` tools. With `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` set, every session now has one implicit team — spawn teammates directly with the Agent tool's `name` parameter, no setup step needed. The `team_name` parameter on the Agent tool is still accepted but ignored.
- Added `Tool(param:value)` syntax for permission rules to match a tool's input parameters (with `*` wildcard), e.g. `Agent(model:opus)` to block Opus subagents
- Skills in nested `.claude/skills` directories now load when working on files there; on a name clash, the nested skill appears as `<dir>:<name>` so both stay available
- Nested `.claude/` directories: the agent, workflow, and output-style closest to the working directory now wins when names collide; project-scope workflow saves now target the closest existing `.claude/workflows/`
- Improved auto mode: subagent spawns are now evaluated by the classifier before launch, closing a gap where a subagent could request a blocked action without review
- Improved `/doctor` with consistent flat tree layout across all sections, clearer section status icons, and highlighted command names
- Improved the skill listing truncation warning to show how many skill descriptions are affected
- Changed the workflow prompt keyword to use a purple shimmer highlight and trigger only on explicit phrases like "run a workflow" or "workflow:", not on any mention of the word
- Improved Remote Control error messages: connection failures now show a persistent red "/rc failed" indicator in the footer, and the "not yet enabled" error now explains whether it's a gate, a check failure, stale entitlement, or org policy
- `/bug` now requires a description before submitting, and no longer uses model-refusal text as the GitHub issue title
- Fixed a crash (out-of-memory) when the CLI inherits a stale websocket/OAuth file-descriptor environment variable from a parent process
- Fixed Claude in Chrome silently failing to connect when the OAuth token belongs to a different account than the Claude Code login
- Fixed nested `.claude/skills` skills with directory-qualified names being blocked by permission prompts in non-interactive runs
- Fixed several subagent issues: viewing a subagent's transcript now shows tool results and live progress, messages sent while it finishes its turn are no longer dropped, and backgrounding a running subagent (ctrl+b) no longer restarts it from scratch
- Fixed `claude agents` workers failing with `401 Invalid bearer token` when the daemon was started from a shell with a custom API gateway via `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN`
- Fixed compaction not honoring `--fallback-model`: compaction now falls back to the configured fallback model chain on overload or model-availability errors
- Fixed model requests continuing to fail with auth errors after credentials were refreshed outside the session, due to a stale cached request configuration
- Fixed background sessions created with `/bg` or `←←` after a turn finished showing "Working" forever in the agents list
- Fixed Linux sandbox failing to start when `.claude/skills` or `.claude/hooks` is a symlink
- Fixed `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE=1` preventing fresh marketplace installs from cloning
- Fixed MCP server-level specs (`mcp__server`, `mcp__server__*`, `mcp__*`) in subagent `disallowedTools` being silently ignored
- Fixed vim mode undo: `u` now steps through NORMAL/VISUAL-mode commands one at a time instead of merging commands in quick succession into a single undo step
- Fixed statusline links with custom URI schemes (e.g. `vscode://`) not opening when clicked in `claude agents`
- [VSCode] Fixed pressing Esc to dismiss a CJK IME candidate window canceling the running Claude task

## 2.1.176

- Session titles are now generated in the language of your conversation (set the `language` setting to pin a specific language)
- Added `footerLinksRegexes` setting for regex-matched link badges in the footer row, configurable via user or managed settings
- Improved Bedrock credential caching: credentials from `awsCredentialExport` are now cached until their `Expiration` instead of a fixed 1 hour
- Fixed `availableModels` enforcement: alias model picks can no longer be redirected to a blocked model via `ANTHROPIC_DEFAULT_*_MODEL` environment variables, and `/fast` now refuses to toggle when it would switch to a model outside the allowlist
- Fixed auto mode failing on Fable 5 for organizations without Opus 4.8 enabled — the classifier now falls back to the best available Opus model
- Fixed hook `if` conditions for Read/Edit/Write tool paths: documented patterns like `Edit(src/**)`, `Read(~/.ssh/**)`, and `Read(.env)` now match correctly
- Fixed Linux sandbox failing to start when `.claude/settings.json` is a symlink with an absolute target
- Fixed `/copy` and mouse-selection copy not reaching the system clipboard inside tmux over SSH, and tmux paste buffer not loading on versions older than 3.2
- Fixed Remote Control connecting from web/mobile silently switching the session's model
- Fixed Remote Control disconnect notifications showing a bare numeric code instead of a human-readable reason, and connection failures adding a duplicate line to the conversation transcript
- Fixed Remote Control sessions not disconnecting when you sign in to a different account
- Fixed `/cd` and worktree moves leaving the session reporting the previous directory's git branch
- Fixed `claude agents`: pressing back in one window no longer detaches other windows attached to the same session
- Fixed backgrounded sessions showing "Working" forever when `/bg` mid-turn had nothing left to continue
- Fixed background agent search by PR URL: PRs opened during scheduled wakeups or while a job was blocked now appear in `claude agents` search
- Fixed the agents view input showing no text cursor on Windows
- Fixed `claude --bg -cn <name>` not seeding the session name
- Fixed background sessions to neutralize Windows network paths in persisted state before respawn
- Fixed background-session respawn rejecting malformed resume IDs from corrupted state files
- Fixed the Windows background-service daemon not starting when `~/.claude/daemon` has the ReadOnly attribute set
- Fixed cloud sessions failing with "Could not resolve authentication method" when idle for too long before being claimed
- Background sessions now show clearer guidance when a window left open across an auto-update can't submit a reply, and `claude daemon status` explains version-skew behavior

## 2.1.175

- Added `enforceAvailableModels` managed setting — when enabled, the `availableModels` allowlist also constrains the Default model (a Default that would resolve to a disallowed model now falls back to the first allowed model), and user or project settings can no longer widen a managed `availableModels` list

## 2.1.174

- Added `wheelScrollAccelerationEnabled` setting to disable mouse-wheel scroll acceleration in fullscreen mode
- Fixed the `/model` picker hiding the model family that Default resolves to — Opus now appears as its own row on Max/Team Premium/Enterprise plans, Sonnet on Pro/Team plans, and Opus on pay-as-you-go API accounts
- Fixed `/model` picker showing a hardcoded Sonnet version label when `ANTHROPIC_DEFAULT_SONNET_MODEL` pins a different Sonnet
- Fixed the "Fable 5 is now consuming usage credits" banner incorrectly showing for enterprise accounts with usage-based billing
- Fixed Bedrock GovCloud regions (`us-gov-*`) deriving the wrong inference profile prefix (`global` instead of `us-gov`), causing 400 errors on derived model IDs
- Fixed background sessions inheriting another session's `ANTHROPIC_*` provider env (gateway URL, custom headers, `/model` aliases) from the shell that started the background daemon
- Fixed a 1-2 second pause when exiting Claude Code shortly after a shell command was interrupted or killed on macOS and Linux
- Fixed git commit co-author attribution showing an incorrect model name for some models
- Fixed the `/advisor` dialog pre-selecting a saved advisor model that is blocked by the `availableModels` allowlist
- Fixed skill hot-reload re-sending the entire skill listing when a single skill changed; only changed skills are now re-announced
- Fixed Workflow tool `agent()` subagents missing per-agent attribution headers
- [VSCode] Added usage attribution to the Account & usage dialog (`/usage`) showing cache misses, long context, subagents, and per-skill/agent/plugin/MCP breakdowns over the last 24h or 7d
- Fixed pre-warmed background workers failing with "Could not resolve authentication method" when claimed after sitting idle

## 2.1.173

- Fixed Fable 5 model names with a `[1m]` suffix not being normalized — Fable 5 includes 1M context by default, so the suffix is now stripped automatically
- Fixed a spurious "sandbox dependencies missing" startup warning on Windows when sandbox was enabled in settings

## 2.1.172

- Sub-agents can now spawn their own sub-agents (up to 5 levels deep)
- Amazon Bedrock now reads the AWS region from `~/.aws` config files when `AWS_REGION` isn't set, matching AWS SDK precedence; `/status` shows where the region came from
- Added a search bar when browsing a marketplace's plugins in `/plugin`
- Added `model` attribute to the `claude_code.lines_of_code.count` OTEL metric
- Fixed sessions using 1M context without usage credits getting permanently stuck — the session now automatically compacts back under the standard context limit
- Fixed a repeating "an image in the conversation could not be processed and was removed" error when the conversation contained multiple images
- Fixed the agents view keeping a session under Working with a busy spinner for up to 30 seconds after the worker replied
- Fixed background agents potentially reading another directory's project settings (`.mcp.json` approvals, trust) when dispatched onto a pre-warmed worker
- Fixed background-session attach failing with EAUTH for sessions started on an older version after the daemon auto-updated
- Fixed a background sub-agent staying stuck as "active" in the agent panel after a nested agent it spawned was stopped
- Fixed `/model` suggestions in the `claude agents` dispatch input rendering with a misleading slash prefix and showing models disabled for your org
- Fixed `availableModels` restrictions not being applied to subagent model overrides, the agent dispatch model picker, and the advisor model
- Fixed `availableModels` allowlists hiding the `/model` picker's Opus and Sonnet 1M rows when entries use version-specific IDs like `claude-opus-4-8`
- Fixed the `/model` picker on Bedrock offering models the provider doesn't serve — selecting one silently switched the session model and lit the selection marker on multiple rows
- Fixed model IDs getting a doubled 1M-context suffix (e.g. `[1M][1m]`) when `ANTHROPIC_DEFAULT_OPUS_MODEL` already includes one
- Fixed `opusplan` model setting not shipping with 1M context in plan mode for entitled users; the `opusplan[1m]` workaround now also correctly switches to Opus in plan mode
- Fixed `WebFetch(domain:*.example.com)` wildcard domain rules never matching subdomains in allow, deny, and ask position, and file permission rules with mid-pattern wildcards (e.g. `Read(secrets-*/config.json)`) being rejected at startup
- Fixed up-arrow prompt history showing the main agent's prompts while a subagent's chat tab is open
- Fixed memory recall not finding mounted team memory stores (`CLAUDE_MEMORY_STORES`) in remote sessions
- Fixed workflow validation rejecting scripts whose prompt strings or comments merely mention `Date.now()`/`Math.random()`
- Disable mouse tracking on Windows consoles that don't fully support it
- Fixed the `/plugin` marketplace list losing its cursor after backing out of a long plugin list, and Esc from the plugin browser returning to the wrong tab
- Improved performance in long conversations by removing redundant message normalization and avoiding full message-history transforms when streaming tool-use state is unchanged
- Reduced idle CPU usage: `/goal` status chip no longer re-renders the terminal at 5 Hz while idle, and fewer UI re-renders while subagents run in parallel
- Improved Claude in Chrome tool loading: browser tools now load in a single batched call instead of one per tool
- Improved the non-interactive Usage Policy refusal message to suggest starting a new session or changing your model
- `/code-review` now keeps the `ultra` option visible when you're not signed in to claude.ai, with an explanation that the cloud review requires a claude.ai account
- Shortened the Remote Control footer indicator to "/rc active" and hid it on narrow terminals
- Stopped promoting `/loop` in remote sessions, where pending loops don't keep the container alive
- [VSCode] Fixed PowerShell tool calls rendering as raw JSON instead of a proper command display and permission dialog, and stripped ANSI escape codes from displayed shell output

## 2.1.170

- Introducing Claude Fable 5: a Mythos-class model that we’ve made safe for general use. Fable’s capabilities exceed those of any model we’ve ever made generally available. Update to version 2.1.170 for access. https://www.anthropic.com/news/claude-fable-5-mythos-5
- Fixed sessions not saving transcripts (and not appearing in --resume) when launched from the VS Code integrated terminal or any shell that inherited Claude Code environment variables.

## 2.1.169

- Self-hosted runner: added a `post-session` lifecycle hook that runs after the session ends and before the workspace is deleted, so you can snapshot uncommitted work or export logs; also made the child-process SIGTERM→SIGKILL window configurable (default unchanged at 5s)
- Added `--safe-mode` flag (and `CLAUDE_CODE_SAFE_MODE`) to start Claude Code with all customizations (CLAUDE.md, plugins, skills, hooks, MCP servers) disabled for troubleshooting
- Added `/cd` command to move a session to a new working directory without breaking the prompt cache mid-session
- Added a `disableBundledSkills` setting and `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS` environment variable to hide bundled skills, workflows, and built-in slash commands from the model
- Fixed Up/Down arrows jumping to command history past the wrapped rows of a long input line — they now move through each visual row first, and history recall enters at the near edge
- Fixed enterprise managed MCP policies (`allowedMcpServers`/`deniedMcpServers`) not being enforced on reconnect, IDE-typed configs, `--mcp-config` servers during the first session after install, or before remote settings loaded; also fixed slow cold starts for orgs without remote settings
- Fixed a ~30-50ms UI stall at the start of each turn for macOS users logged in with claude.ai credentials
- Fixed `claude -p` being slow or appearing to hang on Windows while waiting for the slash-command/skill scan (regression in 2.1.161)
- Fixed Remote Control getting stuck on "reconnecting" after resuming a session when an OAuth token refresh happened at the same time
- Fixed Git Credential Manager's "Connect to GitHub" popup appearing on Windows at startup when background git commands ran without cached credentials
- Fixed footer hints (e.g. "esc to interrupt") not showing for users with a custom statusline
- Fixed stale permission and dialog prompts reappearing every time you reattached to a remote session whose worker had died while waiting on them
- Fixed `claude agents --json` omitting blocked and just-dispatched background sessions; added `--all` to include completed sessions, plus new `id` and `state` fields
- Fixed agents view leaving a stale/garbled frame after navigating back from an agent on WSL in Windows Terminal
- Fixed background agents ignoring project-level settings `env` values (e.g. `ANTHROPIC_MODEL`) when dispatched onto a pre-warmed worker
- Fixed MCPB plugin cache being spuriously invalidated on Windows, causing unnecessary re-extraction
- Fixed plugin `.in_use` PID lock files accumulating without bound; stale markers from crashed sessions are now swept once per day
- Fixed untrusted project settings being able to set OTEL client-certificate paths without trust confirmation
- `/workflows` now opens immediately even while a turn is in progress
- Improved `TaskCreate` reliability: malformed inputs are repaired automatically and validation errors for unloaded tools include the schema
- Improved the error message shown when your organization has disabled API key authentication, with guidance based on where the active API key comes from
- Reduced CPU usage while responses stream and during spinner animations
- Restored a default 5-minute idle timeout on Vertex/Foundry so a stalled stream aborts instead of hanging indefinitely; set `API_FORCE_IDLE_TIMEOUT=0` to opt out
- Remote-managed settings with an invalid entry now apply their remaining valid policies and surface the validation error, instead of silently dropping the whole payload
- Background sessions now preserve `--ide`, `--chrome`, `--bare`, `--remote-control`, and other flags across retire→wake, and respawn state validation was hardened
- Background sessions are now told that shared-checkout edits are blocked until they enter a worktree, avoiding a wasted rejected edit before `EnterWorktree`
- The "CLAUDE.md is too long" warning threshold now scales with the model's context window
- Auto-updater on Windows now stops retrying within a session once `claude.exe` is held by another process
- Improved color contrast for skill tags in the slash-command menu
- Promo credit claims for Apple/Google-billed subscribers without a payment method now explain where to add one
- Added a tip suggesting `claude agents` when running multiple concurrent sessions

## 2.1.168

- Bug fixes and reliability improvements

## 2.1.167

- Bug fixes and reliability improvements

## 2.1.166

- Added `fallbackModel` setting to configure up to three fallback models tried in order when the primary model is overloaded or unavailable; `--fallback-model` now also applies to interactive sessions
- Added glob pattern support in deny rule tool-name position (`"*"` denies all tools); allow rules reject non-MCP globs, and unknown tool names in deny rules warn at startup
- Hardened cross-session messaging: messages relayed via `SendMessage` from other Claude sessions no longer carry user authority — receivers refuse relayed permission requests, and auto mode blocks them
- `MAX_THINKING_TOKENS=0`, `--thinking disabled`, and the per-model thinking toggle now disable thinking on models that think by default via the Claude API (3P providers unchanged)
- Claude Code now retries a turn once on the fallback model when the API rejects an unexpected non-retryable error; auth, rate-limit, request-size, and transport errors still surface immediately
- `claude update` now announces the target version before downloading instead of going silent
- `claude agents`: typing a URL into the list now filters to the session whose first prompt contained it
- Fixed a recurring "image could not be processed" error and extra token usage when an unprocessable image was sent in a session
- Fixed remote sessions becoming permanently stuck when a brief backend disruption occurred during worker registration at startup
- Fixed flickering in JetBrains IDE terminals (IntelliJ, PyCharm, WebStorm, etc.) on 2026.1+ by enabling synchronized output
- Fixed Shift+non-ASCII characters (e.g. Shift+ä → Ä) being dropped in terminals using the Kitty keyboard protocol (WezTerm, Ghostty, kitty)
- Fixed PowerShell command validation occasionally hanging far past its time budget on Windows when a killed process's children held its output pipes
- Fixed orphaned `claude --bg-pty-host` processes spinning at 100% CPU after the daemon dies while connected on macOS
- Fixed voice mode requiring `/login` to clear a stale auth check after toggling `/voice`
- Fixed managed settings with an invalid entry silently disabling enforcement of their remaining valid policies
- Fixed managed-settings `allowedMcpServers`/`deniedMcpServers` predicates not matching when they use `${VAR}` references
- Fixed background agent sessions that entered a git worktree crash-looping with "No conversation found" when reopened from `claude agents`
- Fixed duplicated thinking text in the Ctrl+O transcript view while streaming
- Fixed `/doctor` showing a contradictory failed "Not inside a remote session" check when run inside a remote session
- Fixed the cursor sticking at the end of the first line when typing a multiline prompt in the `claude agents` dispatch and reply inputs
- Fixed blank lines appearing between background agent rows in the task list on terminals without Unicode support

## 2.1.165

- Bug fixes and reliability improvements

## 2.1.163

- Added `requiredMinimumVersion` and `requiredMaximumVersion` managed settings — Claude Code refuses to start if its version is outside the allowed range and directs the user to an approved version
- Added `/plugin list` command to list installed plugins, with `--enabled`/`--disabled` filters
- Added a "c to copy" shortcut to `/btw` that copies the raw markdown answer to the clipboard, preserving formatting when pasted elsewhere
- Hooks: Stop and SubagentStop hooks can now return `hookSpecificOutput.additionalContext` to give Claude feedback and keep the turn going without being labeled a hook error
- Skills: added `\$` escape syntax to include a literal `$` before a digit in command bodies
- stdio MCP servers now receive the same `CLAUDE_CODE_SESSION_ID` as hooks/Bash on `--resume`
- Fixed `claude -p` hanging forever after its final result when a backgrounded command never exits — background shells are now stopped ~5s after the result once stdin closes
- Fixed `claude -p` failing with "ANTHROPIC_API_KEY required" on Bedrock/Vertex/Foundry when `CI=true` and no Anthropic API key is set
- Fixed bash commands failing under bazel and EDR-protected Go workflows: `$TMPDIR` was overridden to `/tmp/claude-{uid}` for all commands instead of only sandboxed ones (regression in 2.1.154)
- Fixed Bash commands failing on Windows with "EEXIST: file already exists" on the session-env directory when it has the read-only attribute or is inside OneDrive
- Fixed org-managed permission rules not applying for the entire session when the managed settings fetch completed during startup on a fresh config directory
- Fixed background sessions in `claude agents` losing their running background tasks when reattached after a Claude Code update
- Fixed terminal misalignment and a multi-second hang when exiting the agent view by pressing Esc
- Fixed clicking Stop on a background-task chip in the desktop app not clearing the chip when the underlying process was already gone
- Fixed keyboard input becoming permanently unresponsive after a paste operation whose end marker is dropped by the terminal
- Fixed hook `if: "Bash(...)"` conditions firing on every Bash command containing `$()` or `$VAR`; the pattern now matches against commands inside subshells and backticks too
- Fixed deny rules on home-directory paths (e.g. `Read(~/Desktop/**)`) not blocking Bash commands that reference the path via `$HOME`
- Fixed a stray "(no content)" line left in the transcript after closing panel dialogs like /mcp and /plugins
- Background agent sessions now update to a new Claude Code version in the background, so opening a session after an update no longer waits on a cold restart
- Clearer descriptions for built-in commands and skills in the / menu
- The subscription-switch suggestion now shows in the startup announcement slot instead of a toast
- `claude agents` dispatching from the state-grouped view now starts the session in the directory the agent view was opened from

## 2.1.162

- `claude agents --json` now includes `waitingFor` showing what a waiting session is blocked on (e.g. permission prompt)
- `--tools`: explicitly listing Grep/Glob now provides the dedicated search tools on native builds with embedded search (previously these names were silently ignored)
- `/effort` now confirms when your chosen level will persist as the default for new sessions
- Clicking a slash command in the autocomplete menu now fills it into your prompt instead of running it immediately; press Enter to run
- Remote Control now shows as a persistent footer pill (with a link to the session) instead of a startup message
- Renamed Windsurf to Devin Desktop in the `/ide` menu, `/terminal-setup`, and `/scroll-speed`, following the editor's rebrand
- Fixed a silent startup hang when the config directory is read-only or unwritable — Claude Code now starts with in-memory config and surfaces startup errors instead of showing a blank screen
- Fixed WebFetch permission rules not being applied to built-in preapproved domains; explicit `WebFetch(domain:...)` deny/ask/allow rules now take precedence over the preapproved-host auto-allow
- Fixed Windows permission rules never matching when spelled with backslashes (`~\`, `\\server\share`) or case-variant paths, and Read deny rules not hiding files from Glob/Grep results
- Fixed an interrupt (Esc) sent at the very start of a turn being silently dropped in stream-json/SDK sessions, leaving the turn running with no "Interrupted" feedback
- Fixed API 400 `no low surrogate in string` errors for classifier side-queries and MCP server descriptions containing emoji near a truncation boundary
- Fixed MCP per-server `timeout` config values below 1000 ms being floored to a 1-second watchdog that aborted every tool call; sub-1000 ms values are now ignored (falling back to `MCP_TOOL_TIMEOUT` or default), and `claude mcp get` annotates them accordingly
- Fixed the LSP tool's `workspaceSymbol` operation returning no results; it now accepts a `query` parameter and passes it to the language server
- Fixed `claude agents` cutting live status text (tool args, replies, prompts, exec output) at 60–120 columns on wide terminals; the status detail now uses the full terminal width
- Fixed `claude agents` truncating long session names at 40 columns; the name column now grows with terminal width
- Fixed `claude agents` attach occasionally bouncing straight back to the session list on the first try after a background-service restart
- Fixed `claude agents` Ctrl+V image paste doing nothing in the dispatch input and the session reply box; pasting with no image now shows a hint
- Fixed backgrounding a session with ← silently losing the conversation when the background service cannot start; the session stays in the list as a failed row you can wake with Enter
- Fixed replies from the agents view that fail to send being lost; they are now queued for delivery on the next session start
- Fixed cross-session messaging (`SendMessage`) silently breaking when `CLAUDE_CODE_TMPDIR` or `$TMPDIR` points at a deep directory
- Fixed opening a running background session from `claude agents` stalling for 5 seconds before attaching
- Quieter startup: notices group by severity, and session info and announcements share a single line per launch
- Startup warnings rewritten to be shorter and clearer, each with a concrete fix
- Launch-prompt warnings (deep link/pre-filled prompt) now stay pinned below the input until you act instead of scrolling away
- Failed turns now show a compact warning line instead of a multi-line red error block
- Improved background service startup and `claude update` verification to wait out endpoint-security scanning of new binaries instead of failing after 5 seconds
- Background dispatch spawn failures now report the error class name when no errno is available
- Removed the "Claude in Chrome enabled" and "marketplace installed" startup messages; model auto-updates and the team-onboarding tip now show as quiet notices under the logo

## 2.1.161

- `OTEL_RESOURCE_ATTRIBUTES` values are now included as labels on metric datapoints, so you can slice usage metrics by custom dimensions like team or repo
- `claude agents` rows now show `done/total` before the detail when work is fanned out; peek shows the longest-running item
- `/mcp` now collapses claude.ai connectors you've never signed in to behind a "Show unused connectors" row
- Parallel tool calls: a failed Bash command no longer cancels other calls in the same batch — each tool returns its own result independently
- Fullscreen mode: clipboard now uses `wl-copy`/`xclip`/`xsel` on Linux when available, copies to both the clipboard and PRIMARY selection for middle-click paste, and the "hold {key} for native selection" hint now shows the correct key per terminal
- Fixed the `/effort` dialog, workflow animations, and prompt keyword shimmer not honoring the "Reduce motion" setting
- Fixed `forceLoginOrgUUID`/`forceLoginMethod` managed-settings policies blocking third-party provider sessions (Bedrock, Vertex, Foundry, Mantle) alongside the org pin (regression in 2.1.146)
- Fixed background subagent output corrupting `claude -p` stdout when using `--output-format text` or `json`
- Fixed `/usage-credits` starting a re-login for Team and Enterprise admins instead of pointing to the organization's usage settings page
- Fixed `/autofix-pr` reporting "cannot run on the default branch" when the session is inside a git worktree or another repository
- Fixed `--resume` picker not showing sessions from the current directory when it isn't a git worktree (e.g., jj workspaces)
- Fixed Windows hooks that invoke bash explicitly (e.g., `/usr/bin/bash script.sh`) failing with "command not found" or "cannot execute binary file"
- Fixed OpenTelemetry log events (`user_prompt`, `api_request`, `tool_result`, `tool_decision`) being silently dropped when emitted before telemetry initialization completed
- Fixed `claude mcp` list/get/add printing secrets to the terminal: `${VAR}` references are no longer expanded, and credential headers and URL secrets are redacted
- Fixed Workflow agents spawned with `isolation: "worktree"` in background sessions being blocked from editing files inside their own worktree
- Fixed background sessions dispatched from `claude agents` booting on a stale model from the daemon's environment instead of the model in `settings.json`
- Fixed a potential crash when rendering Write tool results after resuming a session
- Fixed completed subagents getting stuck showing as running when an error occurs while finalizing their result
- Fixed `EADDRINUSE` errors from tools that bind Unix sockets under `$TMPDIR` when `CLAUDE_CODE_TMPDIR` is set to a deep path
- Improved terminal rendering performance by stabilizing the layout engine's JIT compilation profile
- Improved rendering performance for large file writes
- [VSCode] Added a tip suggesting disabling terminal GPU acceleration (or running `/terminal-setup`) to fix garbled glyphs

## 2.1.160

- Added a prompt before writing to shell startup files (`.zshenv`, `.zlogin`, `.bash_login`) and `~/.config/git/`, which could otherwise lead to unintended command execution
- `acceptEdits` mode now prompts before writing build-tool config files that grant code execution (`.npmrc`, `.yarnrc*`, `bunfig.toml`, `.bazelrc`, `.pre-commit-config.yaml`, `.devcontainer/`, etc.)
- Edit no longer requires a separate Read after viewing a file with `grep`: single-file `grep`/`egrep`/`fgrep` commands now satisfy the read-before-edit check
- Fixed copy-on-select not writing to the Windows clipboard on WSL — now uses PowerShell interop instead of OSC 52, which terminals like MobaXterm don't support
- Fixed restoring a completed session from `claude agents` dropping chat history and re-running the original prompt
- Fixed background sessions re-attached after overnight retire losing their conversation and re-running the original prompt
- Fixed `claude --bg` occasionally failing with "socket missing" when the background daemon was cold-starting on a loaded machine
- Fixed an issue on Windows where the directory a background session was started in could not be deleted after `claude rm` until the background daemon exited
- Fixed background agents that resumed work being shown under Completed in the agents list
- Fixed `claude agents` freezing for several seconds when returning to the session list due to the auto-updater re-checking on every exit
- Fixed Esc, arrow keys, and typing becoming unresponsive on Windows when attached to a background session or in the agent view while the host is under heavy CPU load
- Fixed background agents emitting terminal sync-output markers to terminals that don't support them (Apple Terminal, tmux), causing render artifacts when entering a running agent
- Fixed mouse wheel scrolling prompt history instead of the transcript right after opening a session from the agents list
- Fixed CJK IME composition appearing at the bottom-left of the screen instead of at the input caret in the `claude agents` view
- Fixed valid `file:///C:/...` links being rewritten to a broken path on Windows terminals with hyperlink support
- Fixed voice mode failing to connect when the project directory or branch name contains non-ASCII or special characters
- Fixed the auto mode unavailability message on third-party providers (Bedrock/Vertex/Foundry) to point to the `CLAUDE_CODE_ENABLE_AUTO_MODE` opt-in instead of incorrectly blaming the model
- Fixed `/effort ultracode` incorrectly blaming the dynamic workflows setting when the model cannot run xhigh; ultracode is no longer offered on models that do not support it
- Fixed model-not-found errors suggesting `--model` when running via the SDK or other hosts where the CLI flag doesn't apply
- Fixed Claude's past replies disappearing from scrollback when resuming a brief mode session with brief mode turned off
- Fixed vim mode `p` pasting on the line below instead of at the cursor when the register was yanked with `v$`
- Improved performance of opening recently-inactive background agent sessions in `claude agents`
- Improved auto mode classifier latency by reducing reasoning on routine actions, lowering the chance of "could not evaluate this action" blocks
- Improved background-session teardown (`claude rm`/`stop`, idle reap) to send SIGTERM to running shell subprocesses before SIGKILL, so cleanup handlers run
- Removed `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE`; the environment variable is now a no-op
- Removed the JetBrains plugin install suggestion from startup
- Renamed the dynamic-workflow trigger keyword from `workflow` to `ultracode`. The word "workflow" no longer triggers a run; asking for one in your own words still works. The trigger keyword is highlighted in violet in the prompt input

## 2.1.159

- Internal infrastructure improvements (no user-facing changes)

## 2.1.158

- Auto mode is now available on Bedrock, Vertex, and Foundry for Opus 4.7 and Opus 4.8. Opt in by setting `CLAUDE_CODE_ENABLE_AUTO_MODE=1`

## 2.1.157

- Plugins in `.claude/skills` directories are now automatically loaded, no marketplace required
- Added `claude plugin init <name>` to scaffold a new plugin in `.claude/skills`
- Added autocomplete for `/plugin` arguments: subcommands, installed plugin names, and plugins from known marketplaces
- `claude agents`: the `agent` field in `settings.json` is now honored for dispatched sessions, with `--agent <name>` to override it
- `EnterWorktree` can now switch between Claude-managed worktrees mid-session
- `tool_decision` telemetry events now include `tool_parameters` (bash commands, MCP/skill names) when `OTEL_LOG_TOOL_DETAILS=1`
- Worktrees managed by Claude are now left unlocked when the agent finishes, so `git worktree remove`/`prune` can clean them up
- Fixed unprocessable images (zero-byte, corrupt) attached via paste, MCP, or dialog crashing the request instead of becoming a text placeholder
- Fixed sandbox network permission prompts appearing in auto and bypass-permissions mode when using the desktop app, IDE extensions, or SDK
- Fixed `claude agents` completed sessions not retiring when an idle subagent was still parked or had leaked a backgrounded shell
- Fixed `claude agents` pressing Esc not cancelling a slow "opening…", leaving the list unresponsive
- Fixed background agent worktrees under `.claude/worktrees/` being orphaned after the 30-day job retention sweep
- Fixed background sessions re-attached after a sleep/wake not telling the model the correct date
- Fixed copy-on-select in `claude agents` not reaching the system clipboard inside tmux with `set-clipboard on` (regression in 2.1.153)
- Fixed `--resume` not reporting background subagents that were running when the previous Claude Code process exited
- Fixed the `--resume` session picker leaving its contents on the terminal after exiting in fullscreen mode
- Fixed `--worktree` and `--worktree --tmux` returning to the canonical repo root instead of the current linked worktree
- Fixed the `/model` picker showing an incorrect "Newer version available" hint when the selected model is already the newest in its family; the pinned-model row now shows the model's description instead of its raw ID
- Fixed literal markdown markers (backticks, asterisks) appearing in the in-progress message text in fullscreen mode
- Fixed the terminal freezing after approving the managed-settings security dialog at startup
- Fixed a rare duplicate line appearing in scrollback after the terminal UI redraws
- Fixed right-click paste duplicating the clipboard in the VS Code, Cursor, and Windsurf integrated terminals
- WSL: fixed image paste (`alt+v` keybinding), screenshot paste on Windows 11, and added support for dragging images from Windows Explorer
- Improved performance of long and resumed conversations by eliminating redundant message-rendering recomputations
- `/terminal-setup` now disables GPU acceleration in VS Code/Cursor/Windsurf integrated terminals to prevent garbled-text rendering
- The Feature of the Week credit-claim status now appears as a notification in the status area instead of a line above the prompt
- `claude agents`: slash-command autocomplete in the dispatch input now matches substrings
- Removed the "bash commands will be sandboxed" startup banner — sandbox status still shows in `/status` and when a command is blocked
- Removed the "/ide for …" startup hint toast
- [IDE] Fixed clicking Stop while a background subagent is running not actually stopping it
- [VSCode] Fixed the fast mode indicator not appearing on Opus 4.8
- Pressing backspace right after a workflow trigger keyword now dismisses the workflow request (same as alt+w) instead of deleting a character
- Added a "Workflow keyword trigger" setting in /config to stop the word "workflow" in a prompt from triggering a dynamic workflow