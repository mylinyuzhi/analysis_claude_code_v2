# Changelog

## 2.1.156

- Fixed an issue when using Opus 4.8 where thinking blocks were modified, leading to API errors.

## 2.1.154

- Opus 4.8 is here! Now defaults to high effort · /effort xhigh for your hardest tasks
- Introducing dynamic workflows: ask Claude to create a workflow and it orchestrates work across tens to hundreds of agents in the background, so you can take on larger, more complex tasks. Run `/workflows` to view your runs
- Fast mode on Opus 4.8 is now available at a fraction of its previous cost: 2x the standard rate for 2.5x the speed
- The lean system prompt is now the default for all models except Haiku, Sonnet, and Opus 4.7 and earlier
- Claude now reserves the multiple-choice question prompt for decisions it genuinely cannot make itself, instead of asking when it already has enough context to proceed
- `/simplify` now runs a cleanup-only review (reuse, simplification, efficiency, altitude) and applies the fixes, instead of running the full `/code-review --fix` bug-hunting review
- Renamed the `/effort` slider labels from "Speed"/"Intelligence" to "Faster"/"Smarter" for clarity
- `claude agents`: type `! <command>` to run a shell command as a background session you can attach to and detach from. Also available as `claude --bg --exec '<command>'`
- `claude agents`: `/logout` now signs you out instead of being sent to a background session
- `←←` to open the agents view now works on Bedrock, Vertex, Foundry, and with telemetry disabled
- Claude in Chrome: pick which connected browser to use via `/chrome` → "Select browser…", or in-chat when a browser action runs with multiple connected
- Plugins can now declare `defaultEnabled: false` in `plugin.json` or a marketplace entry; enable them with `/plugin` or `claude plugin enable`. Dependencies of enabled plugins are still enabled automatically
- The `/plugin` Discover tab now pins plugins whose relevance signals match the current directory with a "suggested for this directory" annotation
- Streaming tool execution is now always enabled, including when telemetry is disabled or on Bedrock/Vertex/Foundry (previously behind a feature flag)
- Stdio MCP server subprocesses now receive `CLAUDE_CODE_SESSION_ID` and `CLAUDECODE=1` in their environment
- `claude mcp list`/`get` now show unapproved `.mcp.json` servers as `⏸ Pending approval` instead of auto-approving and connecting when output is piped
- `/remote-control` autocomplete now shows "Disconnect Remote Control" when Remote Control is already active
- Added Claude Opus 4.8 support and 4.7 → 4.8 migration guidance to the `/claude-api` skill
- Deprecated `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` (will be removed on 06/01). To use fast mode on Opus 4.6, switch with `/model claude-opus-4-6[1m]` and then `/fast on`
- Improved the auto-mode classifier's detection of data exfiltration, particularly bulk transfers of repository contents
- Fixed `rm -rf $HOME` not being blocked as a dangerous path when `HOME` has a trailing slash
- Fixed `$TMPDIR` resolving to different directories in sandboxed vs unsandboxed Bash commands within the same session
- Fixed unreadable highlighted-row text in `claude agents` when the Claude Code theme doesn't match the terminal background
- Fixed background-agent completion notifications triggering premature "out of context" behavior on some 1M-context models
- Fixed background-session classifier losing the user's goal when a scheduled `/command` fires
- Fixed pinned background sessions respawning every minute after a Claude Code update, causing repeated agent-start notifications and process churn at idle
- Fixed background sessions stuck at "blocked", "running", or "working" not retiring after the idle grace period
- Fixed subagents in background sessions bypassing the worktree-isolation guard and writing to the shared checkout
- Fixed orphaned `claude --bg-pty-host` processes spinning at 100% CPU after the daemon exits on macOS
- Fixed number key shortcuts not working for options shown below the divider in option dialogs
- Fixed `worktree.baseRef: "head"` resolving to the main checkout's HEAD instead of the current worktree's HEAD when spawning subagents or calling `EnterWorktree` from inside a linked worktree
- Fixed a stray leading space on wrapped lines when the previous line ended exactly at the terminal width
- Fixed intermittent terminal rendering corruption in VS Code by capping the number of distinct colors the thinking spinner produces
- Fixed plan file names including `[Image #N]` / `[Pasted text #N]` placeholders when a plan-mode prompt starts with pasted images or text
- Fixed a phantom expand/click affordance on colored tool output: short ANSI-colored lines that fit on screen no longer show a "ctrl+o to expand" hint
- Fixed a single invalid `allowedMcpServers`/`deniedMcpServers` entry in managed settings discarding all managed-settings policy; the bad entry is now dropped with a `claude doctor` warning
- Fixed API 400 errors on models that don't support the effort parameter when `CLAUDE_CODE_ALWAYS_ENABLE_EFFORT` is set
- Windows: Fixed update failures caused by `claude.exe` being in use showing a generic error instead of telling you to close other sessions and retry
- Removed the stale "& for background" hint from the shortcuts help panel
- [VSCode] Auto mode no longer requires the bypass-permissions setting to appear in the mode picker, and a dismissable notice on the new-session screen explains auto mode the first time it's active
- Fixed the task panel below the prompt showing a stray unselectable "main" row when only a workflow is running
- Fixed /mcp tools list and tool detail rendering when MCP servers have long or multi-line tool names or long descriptions
- Fixed the /model picker not showing fast mode pricing on the Default option for API (pay-as-you-go) users when fast mode is on
- Fixed auto mode incorrectly blocking actions with "could not evaluate this action" when the safety classifier ran out of output tokens while reasoning

## 2.1.153

- Added `skipLfs` option to `github`/`git` plugin marketplace sources to skip Git LFS downloads during clone and update
- Claude Code now shows a one-time notice when your npm global install can't auto-update; `/doctor` lists the fixes
- Status line commands now receive `COLUMNS` and `LINES` environment variables so scripts can size output to the terminal width
- `claude agents`: autocomplete in the dispatch input now suggests native slash commands and bundled skills, not just project skills
- `claude agents`: PR column now shows `PR #N` for a single PR or `N PRs` for multiple
- `claude doctor` now shows the result of your last update attempt
- Combined the separate "needs authentication" startup notifications for MCP servers and connectors into a single message
- macOS: background agents now appear as "Claude Code" in Privacy & Security and keep their permission grants across upgrades
- Fixed stateful MCP servers without the optional GET SSE stream reconnect-looping on `tools/list` (regression in v2.1.147)
- Fixed a regression where a custom API gateway could receive the user's Anthropic OAuth credential instead of the gateway's own token
- Fixed subagent (Agent tool) frontmatter MCP servers ignoring `--strict-mcp-config`, `--bare`, remote mode, enterprise managed MCP config, and managed-settings MCP server allow/deny policies
- `--strict-mcp-config` no longer strips inline `mcpServers` from explicitly-passed agent definitions (`--agents` / SDK `agents`), and blocked subagent MCP servers now surface a visible warning
- Fixed the Windows PowerShell installer reporting "Installation complete!" when installation actually failed
- Fixed `claude update` installing the latest version instead of the configured release channel's version for npm installations
- Fixed excessive memory usage (multiple GB) when resuming a session by transcript file path on machines with many stored sessions
- Fixed `claude agents` and `claude --bg` running on a stale daemon started before binary-takeover support, even after upgrading
- Fixed a hang where the CLI could fail to exit when stdin was closed without EOF in stream-json mode, leaving a stale session marker behind
- Fixed malformed `file://` links in Claude's responses not being clickable in the terminal
- Fixed `claude --help` rendering unwrapped output on terminals narrower than 92 columns
- Fixed MCP tool progress notifications not rendering in the collapsed tool view
- Fixed `Agent` tool with `subagent_type: 'claude'` running in an undocumented temporary worktree, which could silently discard outputs written to gitignored paths
- `/bg` while Claude is responding now continues the response in the background session instead of dropping it
- Fixed `/btw` keyboard shortcuts becoming unresponsive in background sessions while a task is running
- Fixed background sessions writing temp files to `$CLAUDE_JOB_DIR` triggering a "sensitive file" permission prompt
- Fixed recovering a background agent whose working directory was deleted showing a truncated stack trace instead of a clear error message
- Fixed `EnterWorktree` not being available immediately in background sessions (previously required `ToolSearch` first)
- Fixed `cmd+k` in iTerm2/Terminal.app not repainting attached background sessions
- Fixed the IME candidate window appearing at the bottom of the screen instead of next to the input caret in attached background sessions on Windows
- Fixed background-color bleed when attaching to a background agent from 256-color-only terminals after the agent had rendered file diffs
- Fixed `/copy` and copy-on-select silently failing to update the system clipboard when attached to a background session inside tmux
- Fixed opening `claude agents` with Remote Control enabled leaving zombie session entries on the Code tab after exiting
- Fixed `/rename` in background sessions not updating the session banner immediately
- Fixed Windows update rollback: if a Windows update fails, Claude Code now restores the original executable by copy and tells you how to recover
- [VSCode] Fixed Claude Code processes not shutting down cleanly when VS Code closed on Windows, causing false "unclean exit" reports and orphaned MCP servers
- `/model` now saves your selection as the default for new sessions (matching the IDE). Press `s` in the picker to switch models for the current session only.
- If you customized the `modelPicker:setAsDefault` keybinding, rename it to `modelPicker:thisSessionOnly` in keybindings.json (the `d` action was replaced by `s`)

## 2.1.152

- `/code-review --fix` now applies review findings to your working tree after the review, surfacing reuse, simplification, and efficiency suggestions; `/simplify` now invokes `/code-review --fix`
- Skills and slash commands can now set `disallowed-tools` in frontmatter to remove tools from the model while the skill is active
- Added `/reload-skills` command to re-scan skill directories without restarting the session
- `SessionStart` hooks can now return `reloadSkills: true` to re-scan skill directories, making skills installed by the hook available in the same session
- `SessionStart` hooks can now set the session title via `hookSpecificOutput.sessionTitle` on startup and resume
- Added a `MessageDisplay` hook event that lets hooks transform or hide assistant message text as it is displayed
- Added `pluginSuggestionMarketplaces` managed setting: admins can allowlist org marketplaces whose plugins may be suggested via context-aware tips
- `claude plugin marketplace remove` now accepts `--scope user|project|local` for symmetry with `marketplace add`, `install`, and `uninstall`
- Claude Code now switches to your configured `--fallback-model` for the rest of the session when the primary model is not found, instead of failing every request
- Auto mode no longer requires opt-in consent
- Vim mode: `/` in NORMAL mode now opens reverse history search (like Ctrl+R), matching bash/zsh vi-mode
- The `/usage` breakdown now includes large session files; files are scanned with a streaming read so memory usage stays flat
- Thinking summaries in the collapsed group now stay readable for at least 3 seconds, render as markdown, and cap at 10 lines (`Ctrl+O` shows the full thinking)
- In fullscreen mode, the "Thinking for Ns" indicator now counts up live while the model is thinking, and keeps its value if you interrupt mid-thought
- Simplified the Workflow tool's inline progress display — live agent counts now show only in the persistent workflow status row below the prompt
- The post-response timer now shows "Waiting for N background agents/workflows to finish" when backgrounded agents or workflows are still running, and reports the cumulative time once their results are processed
- Added the session entrypoint as an OpenTelemetry metric attribute (`app.entrypoint`, opt-in via `OTEL_METRICS_INCLUDE_ENTRYPOINT=true`)
- Fixed terminal styling degrading in very long sessions by recycling the renderer's style pool
- Fixed the sandbox-enabled warning not appearing in condensed startup mode — it now shows in every layout
- Fixed the loading spinner showing "still thinking"/"almost done thinking" while a tool is running, and reset the thinking status to "thinking" after each tool
- Fixed focus mode showing a spurious "N messages hidden" count on turns with no hidden activity
- Fixed clicking a link inside an expanded tool result collapsing the section instead of opening the link
- Fixed markdown table cell borders inheriting the color of inline code, wrapped continuation lines losing their style, and empty header cells showing a label in the narrow-terminal stacked layout
- Fixed plugin MCP servers with the same command but different environment variables being incorrectly deduplicated
- Fixed `/doctor` reporting "marketplace not found" or "plugin not found" for stale `enabledPlugins` entries referencing removed marketplaces or dropped plugins
- Fixed plugins that track a git branch silently no longer receiving updates after the plugin registry was rebuilt
- Fixed remote MCP servers failing to connect in Claude Code Remote sessions when the egress proxy is enabled
- Fixed the effort-change confirmation dialog appearing when the conversation has no messages or when switching between effort levels that resolve to the same underlying value
- Fixed the Agent tool description referencing an agent list that is never delivered when running with `--bare` or with attachments disabled
- Fixed a background worker crash in `claude agents` when accepting a stale permission prompt after a subagent was cancelled
- Fixed `cache_creation_input_tokens` reporting as 0 in transcript and result usage when the API reports cache writes only via the nested `cache_creation` breakdown
- Fixed the PushNotification tool incorrectly reporting "Mobile push not sent (Remote Control inactive)" in SDK-hosted sessions when Remote Control is enabled
- Fixed sessions getting stuck after a model or login switch left stale thinking-block signatures in history; now stripped proactively with a retry safety-net

## 2.1.150

- Internal infrastructure improvements (no user-facing changes)

## 2.1.149

- `/usage` now shows a per-category breakdown of what's driving your limits usage — skills, subagents, plugins, and per-MCP-server cost
- `/diff` detail view can now be scrolled with the keyboard (arrows, `j`/`k`, `PgUp`/`PgDn`, `Space`, `Home`/`End`)
- Markdown output now renders GFM task list checkboxes (`- [ ] todo` / `- [x] done`) instead of plain bullets
- Enterprise: added the `allowAllClaudeAiMcps` managed setting to load claude.ai cloud MCP connectors alongside `managed-mcp.json`
- Fixed a PowerShell permission bypass: built-in `cd` functions (`cd..`, `cd\`, `cd~`, `X:`) changed the working directory undetected, letting a later command read outside the workspace
- Fixed the sandbox write allowlist in git worktrees covering the entire main repository root instead of only the shared `.git` directory (with `hooks/` and `config` denied)
- Fixed PowerShell prefix/wildcard allow rules (e.g. `PowerShell(dotnet.exe build *)`) not pre-approving native executables and scripts
- Fixed a permission-analysis gap where the parser trusted stale variable-tracking values for `PWD`/`OLDPWD`/`DIRSTACK` across `cd`/`pushd`/`popd`
- Fixed `find` in the Bash tool exhausting the macOS system file/vnode table and crashing the host on large directory trees
- Fixed the managed-settings approval dialog leaving the terminal frozen after accepting at startup
- Fixed `/ultraplan` and remote session creation failing with "Could not capture uncommitted changes" when the working tree has no real changes
- Fixed `otelHeadersHelper` failing silently when the script path contains spaces; helper failures are now reported in `/doctor` and the debug log
- Fixed the thinking spinner staying amber across tool calls and onto fresh thinking bursts
- Fixed collapsed Bash output reporting the wrong hidden-line count for outputs with many short lines
- Fixed slash-command argument-hint clipping trailing typed characters when the hint overflows the input box
- Fixed argument-hint and progressive arg suggestions not appearing after Tab-completing a skill whose frontmatter `name:` differs from its directory basename
- Fixed the status bar showing the user's baseline `/effort` setting instead of the effort level applied by skill/agent `effort:` frontmatter
- Fixed Ctrl+O transcript view freezing at the moment it was opened instead of tailing new messages
- Fixed editing a recalled prompt-history entry losing the edit when navigating further up/down with arrow keys
- Fixed `/config` exit summary reporting phantom changes to auto-compact and theme when toggling unrelated settings
- Fixed `/insights` crashing when cached session-meta files are missing optional fields
- Fixed malformed PowerShell and History tool calls with missing input being misclassified as reads in transcript collapsing
- Fixed renaming a Remote Control session from claude.ai or the Claude mobile app not updating the local session name for `claude --resume`
- Fixed a race where a just-submitted prompt could appear twice in the up-arrow history
- Fixed tapping the "Jump to bottom" pill in fullscreen mode not dismissing it immediately
- Improved `/feedback` reports to include the conversation that happened before context compaction, making issues from earlier in long sessions easier to triage

## 2.1.148

- Fixed the Bash tool returning exit code 127 on every command for some users (a regression introduced in 2.1.147)

## 2.1.147

- Pinned background sessions (`Ctrl+T` in `claude agents`) now stay alive when idle, are restarted in place to apply Claude Code updates, and are shed under memory pressure only after non-pinned sessions
- Renamed `/simplify` to `/code-review`. It now reports correctness bugs at a chosen effort level (e.g., `/code-review high`); pass `--comment` to post findings as inline GitHub PR comments. The old cleanup-and-fix behavior has been removed
- Improved auto-updater: retries transient network failures, reports specific error categories and OS error codes on failure, and shows the current version when an update fails
- Improved diff rendering performance for large file edits
- Prompt history no longer records consecutive duplicate entries — recalling a prompt with arrow-up and submitting it again won't add another copy
- Fixed enterprise login restrictions (`forceLoginOrgUUID` and `forceLoginMethod` managed-settings) not being enforced against third-party-provider and API-key sessions
- Fixed `&` in `!` command output displaying as `&amp;`, which broke copy-pasting URLs from commands like `gcloud auth login` on headless machines
- Fixed unknown slash commands silently doing nothing in headless/SDK mode — they now show an error message
- Fixed `/help` rendering a broken tab header and showing only one command per page on small terminals when not in fullscreen mode
- Fixed shell snapshot dropping user functions whose names start with a single underscore, which broke aliases referencing them
- Fixed plugin agents that declare multiple `Agent(...)` types in `tools:` frontmatter dropping all but the last entry
- Fixed hook `if` conditions like `PowerShell(git push*)` never matching — only `PowerShell(*)` worked
- Fixed PowerShell tool dropping output for commands that rely on the default formatter
- Fixed: on Windows, "Yes, and don't ask again" for a PowerShell script invocation now writes a rule that actually matches on subsequent runs
- Fixed PowerShell tool failing on Windows with exit code 1 when `pwsh` is installed via winget or the Microsoft Store
- Fixed `/effort` opening with the slider on the wrong level — it now starts at your current effort
- Fixed paginating MCP servers dropping resources, templates, and prompts past page 1
- Fixed full-screen strobing in attached background sessions on Windows Terminal while Claude is streaming
- Fixed: on Windows, removing a background-job worktree no longer follows NTFS junctions into the main repo
- Fixed `/background` refusing sessions whose only typed input was a skill or custom slash command
- Fixed auto mode suppressing `AskUserQuestion` when the user or a skill explicitly relies on it; the auto-mode classifier now sees the user's answers as intent signal
- Fixed `/theme` "New custom theme" and color editor dialogs not responding to Esc
- Fixed an uncaught exception at the end of streaming sessions when running via the Agent SDK
- Fixed a rare hang when waiting for scroll to settle on Windows
- Fixed stale and doubled rows in the agent view list on Windows when background session results contain wide (CJK) characters
- Fixed pasted text being delivered to agents as an unreadable `[Pasted text #N]` placeholder instead of the actual content
- Fixed plugin component counts in `claude plugin details` and `/plugin` being doubled when a plugin's manifest listed paths overlapping its default directories
- Fixed backgrounded sessions re-prompting for tool permissions you already granted with "don't ask again"
- Fixed GNOME Terminal right-click and middle-click paste not inserting text
- Fixed `CLAUDE_CODE_SUBAGENT_MODEL` not applying to teammate processes spawned by agent teams
- Fixed slash commands followed by a tab or newline being treated as an unknown command
- Fixed several spacing and layout glitches in the `/plugin`, `/status`, `/mobile`, `/sandbox`, and `/permissions` menus
- Fixed stripped images prompting the model to repeatedly re-read media that was no longer present

## 2.1.145

- Added `claude agents --json` to list live Claude sessions as JSON for scripting (tmux-resurrect, status bars, session pickers)
- Added `agent_id` and `parent_agent_id` attributes to `claude_code.tool` OTEL spans, and fixed trace parenting so background subagent spans nest under the dispatching Agent tool span
- Status line JSON input now includes GitHub repo and PR information when detected
- `/plugin` Discover and Browse screens now show a plugin's commands, agents, skills, hooks, and MCP/LSP servers before installation
- `claude agents` terminal tab title now shows the awaiting-input count so an alt-tabbed window tells you when an agent needs attention
- Slash command and @-mention suggestion list now supports mouse hover and click in fullscreen mode
- Stop and SubagentStop hook input now includes `background_tasks` and `session_crons` fields
- Fixed a permission-prompt bypass where bare variable assignments to non-allowlisted environment variables in Bash commands were auto-approved
- Fixed MCP prompt slash commands showing raw server validation errors when a required argument is omitted — the error now names the missing argument and shows expected usage
- Fixed the spinner and elapsed-time display freezing until a keypress after the terminal was resized or refocused
- Fixed the cross-project resume hint failing in default Windows PowerShell 5.1 — Windows now uses `;` as the command separator
- Fixed voice push-to-talk not working in the agent view's reply pane
- Fixed task lists rendering in random order when several tasks are created at once
- Fixed stale "Failed to install Anthropic marketplace" banner showing when the marketplace is already installed
- Fixed the PR badge in the footer not updating immediately after `gh pr create` and other PR-state-changing commands run in-session
- Fixed Agent Teams teammates with non-ASCII names failing every API call due to invalid header encoding
- Fixed `/review` using a deprecated `projectCards` GraphQL query that errored on repos with Classic Projects
- Fixed `claude plugin validate` not flagging `skills:` entries that point at a file instead of a directory — the error now suggests the parent directory
- Fixed an infinite loop where a skill using `context: fork` could repeatedly re-invoke itself instead of running
- Improved the Read tool to return a truncated first page with a "PARTIAL view" notice instead of a hard error when a whole-file read exceeds the token limit

## 2.1.144

- Added `/resume` support for background sessions — sessions started via `claude --bg` or agent view now appear alongside interactive ones, marked with `bg`
- Added elapsed duration to background subagent completion notifications (e.g. "Agent completed · 3h 2m 5s")
- The `/plugin` browse and discover panes now show when a plugin was last updated
- `/model` now changes the model for the current session only; press `d` in the model picker to set a default for new sessions
- Renamed "extra usage" to "usage credits" across CLI copy; `/extra-usage` is now `/usage-credits` (old name still works)
- Fixed startup hanging up to 75s when `api.anthropic.com` is unreachable (captive portal, firewall, VPN issues) — side-channel API calls now time out after 15s
- Fixed garbled terminal output after a missed window-resize event (e.g. dragging a VS Code split-pane divider) — now self-heals on the next frame instead of requiring Ctrl+L
- Fixed progressive terminal display corruption (stale/garbled glyphs) that could appear in very long sessions and only cleared on terminal resize or restart
- Reduced terminal rendering glitches in VS Code by reducing spinner animation color count
- Fixed macOS background sessions crashing with "exit 1 before init" when the project lives under a Full Disk Access-protected folder (regression in 2.1.143)
- Fixed an unrecoverable conversation when reading a file whose image extension doesn't match its contents (e.g. HTML saved as .png) — now falls back to text
- Fewer spurious tool errors during search: `head`/`tail` file views now satisfy the read-before-edit check, and a "no matches" result (exit code 1) from `egrep`, `fgrep`, `git grep`, or `git diff` is no longer reported as a command failure
- Fixed `/branch` failing with "No conversation to branch" after entering a worktree or in some background sessions
- Fixed pressing Escape in the AskUserQuestion notes field aborting the turn instead of returning to answer selection
- Fixed model selection not applying when changed via the IDE model picker or `applyFlagSettings` after startup
- Resumed sessions now keep the model they were using instead of picking up another session's `/model` choice
- Fixed Bedrock and Vertex users unable to select "Opus (1M context)" from the `/model` picker (regression in v2.1.129)
- Fixed remote-session login failing with "Can't access this organization" for users with `forceLoginMethod` and `forceLoginOrgUUID` set
- Fixed MCP servers with paginated `tools/list` responses only returning the first page, silently dropping tools
- Fixed MCP images with unsupported MIME types (e.g. SVG) breaking the conversation — now saved to disk and referenced in the tool result
- Fixed file descriptor exhaustion when a build runs inside a skill directory — non-`.md` files no longer trigger skill reloads
- Fixed session title being generated from plugin monitor output instead of the user's first prompt
- Fixed Skill tool failing with permission error in headless mode (regression in v2.1.141)
- Fixed plugins enabled in your own settings showing "not cached" errors after first load on a fresh machine; plugins enabled only by a project's `.claude/settings.json` now show an actionable `claude plugin install` hint
- Fixed `claude mcp list` silently reporting no servers when `.mcp.json` can't be parsed (e.g. using VS Code's `"servers"` key instead of `"mcpServers"`) — now shows configuration errors
- Fixed background side-queries on custom `ANTHROPIC_BASE_URL` setups and Bedrock Mantle not using Haiku — now falls back correctly when a first-party API key is configured or no Haiku model is set
- Fixed scrolling in attached background sessions on Windows — PgUp/PgDn, mouse wheel, and Ctrl+O transcript navigation now work
- Fixed a crash when closing the terminal while attached to a background session
- Fixed on Windows, pressing ← in `claude agents` leaving the list unresponsive to keyboard input
- Fixed ghost characters at the left edge when switching panes in Agent View on Windows Terminal with CJK content
- `/bg` and `←`-detach now preserve directories added via `/add-dir`
- Fixed Edit/Write refusing with "background session hasn't isolated its changes yet" right after detaching a session that was already editing in place
- Fixed `claude respawn <id>` on a stopped background session showing "stopped" instead of running
- Fixed `/resume` picker not showing sessions forked from a background session
- Fixed opening a session from `claude agents` or running `claude logs <id>` hanging when the background service is unresponsive — now times out after 10s with a recovery hint
- Fixed background Bash tasks spawned by subagents staying "Running" in SDK task panels after the process exits
- Fixed completed or stopped background sessions briefly failing to wake being permanently marked as a startup crash
- Fixed markdown links in `claude agents` attached sessions rendering as plain text instead of clickable hyperlinks
- Fixed custom `spinnerVerbs` applying to the post-turn duration message — past-tense built-ins like "Worked for 5s" are restored there
- `claude agents` / `--bg` rejection messages now name the specific gate (non-TTY, env var, or setting) instead of a generic message
- `claude --bg --name <label>` now echoes the name in the post-spawn confirmation
- `claude agents`: renaming a background session with Ctrl+R now updates the attached session's banner immediately
- Background session worktree isolation guard now applies for non-git VCS users with `WorktreeCreate` hooks configured
- Plugin marketplace add/update now respects `CLAUDE_CODE_PLUGIN_PREFER_HTTPS`
- `/plugin` now returns to the Installed list after enabling, disabling, or uninstalling a plugin
- `/doctor` now shows an exec-form example when a command hook is missing the `command` field
- Skill-listing truncation is no longer shown as a startup notification — run `/doctor` for the full breakdown
- Improved recovery from rare pre-response stream stalls — now retries streaming once instead of falling back to a slower non-streaming request
- Improved SDK/headless MCP startup: pre-wait now overlaps startup instead of blocking before the first turn (up to 2s faster with slow MCP servers)
- The post-survey follow-up hint now appears after every non-dismiss survey response with context-aware copy, making it easier to share more detail via /feedback.

## 2.1.143

- Added plugin dependency enforcement: `claude plugin disable` now refuses when another enabled plugin depends on the target (with a copy-pasteable disable-chain hint), and `claude plugin enable` force-enables transitive dependencies
- Added projected context cost (per-turn and per-invocation token estimates) to the `/plugin` marketplace browse pane
- Added `worktree.bgIsolation: "none"` setting to let background sessions edit the working copy directly without `EnterWorktree`, for repos where worktrees are impractical
- PowerShell tool now passes `-ExecutionPolicy Bypass`. Opt out with `CLAUDE_CODE_POWERSHELL_RESPECT_EXECUTION_POLICY=1`
- Background sessions now preserve the model and effort level you set after waking from idle
- Shift+Tab in attached agent sessions now includes auto mode in the cycle
- Fixed a corrupt `.credentials.json` with a non-array `scopes` value hanging the CLI on startup or silently aborting OAuth token refresh
- Fixed right-click paste in `claude agents` on Windows Terminal and WSL
- Fixed stop hooks that block repeatedly looping forever — the turn now ends with a warning after 8 consecutive blocks (override via `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`)
- Fixed Esc/Ctrl+C not cancelling a pending `/loop` wakeup while Claude is idle between iterations
- Fixed `/goal` evaluator firing while background shells or delegated subagents are still running
- Fixed `NO_COLOR`/`FORCE_COLOR` in settings.json `env` stripping Claude Code's own UI colors — they now apply to subprocesses only
- Fixed agent view spawning repeated PowerShell processes on Windows when listing sessions
- Fixed `/bg` without a prompt sending "continue" to the forked session — the fork now waits for input
- Fixed `--agent <name>` not finding plugin-contributed agents without the `plugin:` prefix
- Fixed deleting a session from agent view not removing its transcript file
- Fixed stale-fragment rendering when scrolling in attached background sessions on Windows Terminal
- Fixed background agents false-positive worker-stall detection storm after host sleep or macOS App Nap
- Fixed 5xx error messages pointing at status.claude.com instead of naming the configured gateway or cloud provider
- The PowerShell tool is now enabled by default on Windows for Bedrock, Vertex, and Foundry users. Opt out with `CLAUDE_CODE_USE_POWERSHELL_TOOL=0`.
- `claude agents` now accepts `--add-dir`, `--settings`, `--mcp-config`, and `--plugin-dir` and applies them to the dashboard and to background sessions dispatched from it
- `claude agents` accepts `--permission-mode`, `--model`, `--effort`, and `--dangerously-skip-permissions` to set defaults for sessions dispatched from the view
- `claude --bg --dangerously-skip-permissions` now persists across retire→wake
- Fixed background sessions silently capturing IDE file references into the warm spare's input, which caused the reference to be prepended to the next prompt dispatched from `claude agents`
- Worktree cleanup no longer falls back to `rm -rf` when `git worktree remove` fails, preventing loss of gitignored or in-progress files
- Fixed background-job sessions on macOS getting "Operation not permitted" errors when reading files under `~/Documents`, `~/Desktop`, or `~/Downloads`, even with Full Disk Access granted.
- `/bg` now preserves `--mcp-config`, `--settings`, `--add-dir`, `--plugin-dir`, and `--strict-mcp-config`, so backgrounded sessions keep their MCP servers and settings across respawn.
- Background sessions launched from `claude agents` now honor `permissions.defaultMode` from settings.json (was previously overridden to auto mode)
- Fixed: on Windows, pressing ← in `claude agents` while a response was streaming could leave the agents list unresponsive to all input
- `/bg` and `←`-detach now preserve `--fallback-model`, so backgrounded workers degrade to the fallback model on overload instead of hard-failing.
- `/bg` and `←`-detach now preserve `--allow-dangerously-skip-permissions`, so the forked worker keeps bypass-permissions available in its Shift+Tab cycle.
- Fixed: background daemon spawn now falls back to the running binary when the `~/.local/bin/claude` launcher is missing or non-executable
- Fixed `claude agents --allow-dangerously-skip-permissions` defaulting dispatched sessions to bypass mode instead of making it available in the permission cycle

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