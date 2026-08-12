# Changelog Analysis — Claude Code v2.1.220 → v2.1.227

**What this document is.** This is the primary changelog report for the 2.1.227 analysis tree. It
preserves the complete published release-note window supplied for 2.1.221 through 2.1.227, then
separates the release attribution from what can actually be proved in the available 2.1.227 and
2.1.220 bundles. The exhaustive bullet-level verdict and module-routing ledger is in
[`changelog_to_code_map.md`](changelog_to_code_map.md).

**Evidence boundary.** The target is
`/lyz/codespace/claude-code-bomb/versions/2.1.227/extract/cli_inner_pretty.js`; the baseline is the
corresponding 2.1.220 bundle. There are no intermediate 2.1.221–2.1.226 bundles in the supplied corpus.
Consequently, the binary diff proves that a mechanism exists by 2.1.227 and did not exist in 2.1.220,
but the changelog—not the bytes—assigns that delta to a particular intermediate release.

---

## 1. Authoritative changelog

The text in this section is preserved as supplied. It is source material, not a claim that every item
has already been independently attributed to one intermediate binary.

## 2.1.227

- Fixed feature flags being evaluated without the user's subscription tier when a session started with an expired login token, which could wrongly prompt Max plan users to enable usage credits for Fable
- Fixed every Bash command failing under `claude-code-action` with `allowed_non_write_users` on GitHub-hosted runners
- Fixed `/tui` bringing back a conversation that had been rewound to before its first message
- Improved slash-command menu: blue now marks only the selected row, matched characters are bolded instead of recolored, and emoji or accented names keep their glyphs
- Improved performance: fewer event-loop stalls on file-not-found suggestions and at-mention size checks

## 2.1.226

- Bug fixes and reliability improvements

## 2.1.225

- Added gateway spend-limit support to Claude Code's usage warning; the limit-reached message now names the cap, its reset time, and the operator's message (requires the gateway on 2.1.225)
- Added a workspace trust prompt to `claude agents` for untrusted directories, matching the behavior of `claude`
- Fixed a transient 401 replacing a long-lived `CLAUDE_CODE_OAUTH_TOKEN` with a stored login's short-lived token, breaking headless sessions until restart
- Fixed MCP OAuth servers on macOS intermittently failing with a burst of 401 errors, as if never authenticated, after a keychain read timed out
- Fixed auto mode counting a safety-filter refusal of its own permission check toward the consecutive-block limit; the action is still denied, but the model is now told to move on rather than retry
- Fixed cross-session messages staying parked without a notice or expiry in headless sessions and during startup
- Fixed conversation history breaking on Remote Control session resume after very large conversations were compacted
- Fixed hovering over a session in another project in the agents list changing the directory the next agent starts in
- Fixed `claude self-hosted-runner` registering and then failing every session when `--base-dir` cannot be created or written; it now exits at startup with a clear error
- Fixed Claude Code on the web sessions being misreported as stuck, re-sending a growing event backlog on every reconnect
- Improved Remote Control: photos attached from the Claude app are now shown to Claude directly instead of being read from disk with a separate tool call
- [VSCode] Fixed Focus view folding away the latest to-do list, a pending question's context, and settled answers; thinking-only folds show "Thought for Ns" and re-collapse when their turn completes
- SendMessage can now start a conversation with your Remote Control sessions on other machines by name (`ListAgents` shows them as `name [ref]`), instead of only replying after they message you first
- SendMessage: a Remote Control recipient you already confirmed is never swapped for a same-named session on this machine when its own list couldn't be checked

## 2.1.224

- Added self-hosted environments: `claude self-hosted-runner` turns your own machines or containers into a place Claude Code web, mobile, and desktop sessions can run, on Team and Enterprise plans
- Added `archive` plugin source: install plugins from a zip over HTTPS without git or npm, with optional SHA-256 pinning
- Added a cancel-and-confirm step when removing an unavailable paste changes a command's text
- Added `ANTHROPIC_BEDROCK_REGION_PREFIX` env var for Bedrock to prefer a specific cross-region inference profile over the `AWS_REGION`-derived one
- Added `crossSessionInbound` and `dialogExpiry` settings: cross-session messages sent to a session running with bypassed permissions are held for your approval, and messages to other sessions auto-deliver
- Added sandbox credential-masking options: `extract` and `onExtractNoMatch` for structured env values, `decode: "jwt"` with `maskClaims` for JWT-aware masking, and `awsPairs`/`sigv4` for AWS SigV4 re-signing; these need `network.tlsTerminate` and are honored only from user, managed, or `--settings` settings
- Added cross-session `SendMessage`: Claude Code sessions can now message each other, on any of your machines, with `ListAgents` to discover them (macOS and Linux)
- Fixed long (>200 char) project paths resolving to another project's session directory under a shared sanitized prefix; session list, rename, fork, delete and `/resume` no longer cross projects
- Fixed `SendMessage` reporting "Message sent" when the write to a teammate's inbox had actually failed; failed deliveries are now reported as errors
- Fixed sandbox filesystem deny entries written with a trailing slash (e.g. `denyRead: "~/.aws/"`) being silently bypassable on Linux and macOS
- Fixed sandbox violation details never appearing in Bash tool results; Claude now sees which file or network access was denied and why
- Fixed MCP tools that connect mid-turn being deferred for tool search without their names announced to the model
- Fixed plugin install records being silently corrupted when the same plugin is installed in multiple projects
- Fixed recalled or restored paste content occasionally attaching wrong data or silently losing text when the paste had aged out or placeholder numbers collided
- Fixed copy-on-select on Wayland sometimes not reaching the clipboard; the two selection writes no longer race
- Fixed the feedback survey's transcript share silently failing on long sessions; a failed share now shows an error instead of a success message
- Fixed Remote Control auto-start intermittently failing with "Remote credentials fetch failed" on a cold start with a stale login token
- Fixed Remote Control and SDK clients showing a blank "(no content)" message after `/clear` and other output-less commands
- Fixed a Remote Control session recreated after its server session expired uploading prior local conversation history into the new session
- Improved fullscreen mode to keep the full pre-compaction history in scrollback across repeated compactions, instead of only the most recent interval
- Improved Remote Control: attached web and mobile clients now see compaction progress and the post-compaction boundary instead of a silent pause; `/clear` resets now propagate to attached clients
- Improved Remote Control: connection failures now show a persistent failure indicator with details and a reconnect shortcut, instead of only an 8-second toast
- Removed the 200-subagent-per-session spawn cap; long-running sessions no longer refuse new agents (concurrency and depth limits still apply)
- Changed managed settings: the approval prompt no longer re-appears after re-login or org switching when the organization's settings are unchanged
- Changed the feedback-survey transcript share: with your consent it now also uploads the last request's model settings — the system prompt (which includes your `CLAUDE.md` instructions), tool definitions, and model parameters. Secrets are redacted as before, and these fields are dropped first if the share is too large
- Changed the Bash tool description to always note that command output is displayed to the model, not reliably to the user
- Changed recalled paste placeholder numbers to renumber when accepted into the input
- Changed Remote Control to archive the stale server session instead of leaving a dead one listed when a fresh session is minted after compaction or `/resume`
- [VSCode] Fixed the extension showing Remote Control as connected after the connection failed
- Fixed a session resume silently reconnecting Remote Control after the user turned it off (`--resume`, SDK hosts, and the VS Code extension)
- [VSCode] Fixed sessions not honoring `remoteControlAtStartup` when explicitly enabled

## 2.1.223

- Added owner wildcard entries (`"owner/*"`) to the `strictKnownMarketplaces` and `blockedMarketplaces` managed settings for allowing or blocking all marketplace repos under a GitHub org
- Added a warning when workflow agents, forked skills, slash commands, or resumed background agents' requested subagent model is restricted and the parent model runs instead
- Added a `/teleport` hint in cloud sessions showing how to continue locally with `claude --teleport <session id>`
- Fixed a Bash permission bypass where a crafted command could hide parts of itself from permission checks
- Fixed permission prompts so commands padded with tabs or invisible Unicode can no longer hide part of the command from the approval dialog
- Fixed workflow scripts being able to use dynamic `import()` to run code outside the workflow sandbox
- Fixed a permission gap where an agent definition's `bypassPermissions` mode ignored the org bypass-permissions disable policy
- Fixed resuming a session after a mid-session `/cd` coming back empty
- Fixed gateway model discovery hiding Claude models registered under provider-prefixed IDs such as `vertex_ai/claude-*` or `bedrock/anthropic.claude-*`
- Fixed `modelOverrides` keys that aren't Anthropic model IDs being treated as the session's canonical model ID; unknown keys are now ignored as documented
- Fixed managed settings: server-delivered settings no longer disable the env block of a machine-local `managed-settings.json` or MDM profile; admin env now merges per key
- Fixed sandboxed commands failing to start on Linux when `sandbox.filesystem.denyWrite` covers the working directory
- Fixed forked background agents getting stuck "already resuming" for the rest of the session when rebuilding the fork's parent prompt failed during resume
- Fixed a resumed session failing every turn, or leaving the interactive app on an unresponsive error screen, when its history held a malformed diagnostics attachment
- Fixed a rare hang when parsing unusual `git push` output
- Changed `CLAUDE_CODE_DISABLE_1M_CONTEXT` to hold every Claude model with a native 1M window to 200K via auto-compaction, not just a fixed list; a startup warning now appears when auto-compaction isn't holding the session to 200K
- Changed auto-compact to keep sessions on unrecognized model IDs within the assumed context window instead of letting them grow past it; set `CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT=1` to restore the previous behavior
- Changed `/review` to be an alias of `/code-review`, which reviews the current diff or a PR (`/code-review <level> <pr#>`); use `/code-review ultra` for a deep cloud review
- Changed `/code-review` with no effort level to reuse the level you typed last; type a level like `/code-review high` to change it

## 2.1.222

- Fixed worktree-isolated sessions and their subagents being able to run destructive git commands against the main checkout; isolation now applies to file edits and Bash in every session type
- Fixed PreToolUse auto-allow hooks bypassing tool restrictions in background agent tasks (summaries, compaction, renames)
- Fixed `/usage-credits` on Team and Enterprise showing "you've already sent a usage credit request" for members whose earlier request was dismissed, blocking them from sending a new one
- Fixed the startup connectivity check hanging and then failing behind an HTTPS proxy; it now uses the same proxy-aware transport as API requests and times out with a clear message
- Fixed "Connection closed mid-response" errors being reported on responses that had actually completed
- Fixed `/usage` overattributing usage to MCP servers: a server's share now reflects only the requests that actually consumed its tool results, instead of every turn after any call to it
- Fixed sessions not linking to pull requests created after the branch was pushed, including through the GitHub REST API
- Fixed org-restricted `model: opus`-style subagent and teammate family aliases dropping to the parent model instead of stepping down to the newest org-allowed model in the family
- Fixed stream idle timeout firing on custom `ANTHROPIC_BASE_URL` gateways despite server keep-alive pings arriving on the wire
- Fixed claude.ai connectors being falsely marked as needing authorization when the session token is invalid — they now show a `/login` hint instead
- Fixed tool errors not being displayed for tools no longer available locally, for example after an MCP server is removed
- Fixed `SendMessage` rejecting a long summary — it now truncates instead, so sends no longer fail on a character limit
- Fixed the spinner's effort label in a subagent's transcript view showing the session's effort level instead of the subagent's own `effort:` setting
- Fixed rare crashes when a file watcher hit a filesystem error or during file-watcher teardown
- Fixed screen readers re-reading the whole input line on every backspace in `--ax-screen-reader` mode — end-of-line deletions now echo just the deleted characters
- Fixed host model-selection keys not taking precedence over a stale on-disk `managed-settings.json` when `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST` is set
- Improved auto mode safety: messages sent to other agent sessions via `SendMessage` are now evaluated by the permission classifier before dispatch
- Improved the refusal when Claude tries to invoke a skill with `disable-model-invocation`: Claude is now told to ask you to run the skill instead of replicating its workflow
- Improved the `/diff` view, the Remote Control workspace diff, and file-edit diffs in Claude Code on the web sessions to use raw git blob content, ignoring workspace-configured diff drivers and textconv
- Changed Remote Control auto-start so repo-local settings (`.claude/settings.json` or `.claude/settings.local.json`) can no longer turn it on (they can still turn it off); enable it at user scope via `/config`
- Removed ultraplan feature

## 2.1.221

- [VSCode] Added Focus view: a chat-menu toggle that hides tool activity behind an expandable per-turn summary with a live running-tool indicator, toggled with `Ctrl+Alt+F` or the "Claude Code: Toggle Focus view" command
- Added `mode: "mask"` for sandbox credential files on Linux and WSL — sandboxed commands read a sentinel copy (the whole file, or just the spans captured by an `extract` regex) while the sandbox proxy substitutes the real value on egress; on macOS file masking falls back to `deny`
- Added warnings to `claude plugin validate` when a marketplace or plugin name would be rejected by Claude Desktop's managed marketplace sync
- Added a `prompt-audit` subcommand to the `claude-api` skill for auditing prompts and tool descriptions for patterns written for older models
- Fixed a Bash tool permission-check bypass where zsh could execute hidden commands in `[[ ]]` regex conditionals; affected commands now prompt for permission
- Fixed PowerShell permission checks mishandling paths containing quote characters on Windows; such paths now prompt for approval
- Fixed the thinking toggle having no effect for the rest of a session that started with thinking off; disabling an MCP server mid-connect no longer silently reverts
- Fixed MCP servers from `--mcp-config` not being connected before the first turn in print mode (`-p`), which made the model emit tool calls as literal text
- Fixed @-mentioned files being silently dropped when pressing Esc to retract a prompt and resubmitting it
- Fixed a crash when preparing API requests for SDK MCP tools named after built-in object properties such as `constructor`
- Fixed WebSearch failing with a 400 error at effort `xhigh`/`max` when thinking is disabled
- Fixed sandboxed large uploads failing with TLS errors through the sandbox proxy
- Fixed Team and Enterprise spend-limit message incorrectly blaming the org's monthly limit instead of your individual spend limit
- Fixed Bedrock authentication with AWS SSO named profiles failing in desktop-managed sessions on Windows machines that set a stray `HOME` environment variable
- Fixed `CLAUDE_CODE_RESUME_INTERRUPTED_TURN=0` not disabling interrupted-turn auto-resume; falsy values are now honored
- Fixed a rare wake-from-sleep race where two Claude Code processes could both refresh the same MCP connector or WIF OAuth token at once, forcing re-authentication
- Fixed renaming a session from Claude Code Desktop or claude.ai not updating the CLI's session name; session names from every rename surface are now sanitized
- Fixed plugin- and org-delivered skills named after terminal-only built-ins (e.g. `/help`, `/feedback`) being un-invocable in non-interactive sessions
- Fixed the "Plugins changed" notification lingering after plugins were reloaded instead of clearing
- Fixed Vim mode: the yank register now survives dialogs, history search, and the transcript view instead of being silently emptied
- Fixed Vim mode: undoing back to an empty prompt now arms the "press ← again" confirm before returning to the agent view
- Improved tool search on Google Vertex AI: re-enabled for Claude 4.5-generation and newer models
- Improved auto mode: permission checks for parallel tool calls are now cache-efficient, and switching modes while a check is pending reliably prompts instead of applying the stale result
- Reduced prompt-cache costs for auto-mode permission checks by reusing the cached conversation prefix across decisions
- Improved Stats panel to count cache tokens in its token totals, with a breakdown by input, output, cache read, and cache write
- Improved `/ultrareview` error messages when a repo shares no history with its base: a checkout with no branches is now refused up front with advice to create one, and refusal hints no longer suggest `git fetch --unshallow` on clones that are already complete
- Improved Windows startup: process creation times are now read via a native kernel32 call instead of spawning PowerShell, so endpoint security tools that gate `powershell.exe` no longer prompt
- Changed background sessions to commit and push to preserve work, open a draft PR only when the task calls for one, follow your CLAUDE.md git instructions, and always end by reporting where the work lives
- Changed `/plugin install` to refresh a stale marketplace catalog and retry before reporting a plugin not found
- Changed plugins installed from `/plugin` to activate immediately when safe, instead of always requiring `/reload-plugins`
- Changed plugins to accept `"."` as a `skills` path, and the root-level `SKILL.md` validation error now suggests using the plugin root
- Changed `/status` to show the session kind: `interactive`, or a background job that is `attached` or `unattended`
- Changed emoji autocomplete to accept common alternate shortcodes like `:thumbsup:`, `:thumbsdown:`, and `:love:`
- Changed sessions forked with `/fork` to create a new worktree of their own instead of working in the original session's checkout
- Changed Claude in Chrome to close the browser tabs it opens once it no longer needs them
- Changed fast mode to report on the stream when usage credits run out mid-session, instead of failing silently
- Changed Monitor: a watch that exits without producing any output now says so instead of reporting "stream ended"
- Changed the Gateway `model` field validation: non-string values are rejected with a 400 instead of being forwarded
- Removed the repeated "Permission mode changed while the auto-mode classifier call was queued" notice from approval prompts

---

## 2. Window summary

The changelog contains seven published releases and 130 scoped bullets. Six releases describe concrete
behaviour; 2.1.226 is intentionally unscoped. The window is not one feature launch. It is a coordinated
hardening pass across cross-session messaging, Remote Control, permissions and sandboxing, background
worktrees, plugins, model/context policy, and the new self-hosted execution surface.

### Release Attribution Under a Two-Bundle Diff

**What it does:** Prevents an intermediate release label from being mistaken for binary proof.

**How it works:**
1. The changelog assigns every promise to 2.1.221 through 2.1.227.
2. Exact literals and executable branches are compared between the 2.1.220 baseline and 2.1.227 target.
3. A target-only anchor proves a window delta, not the exact intermediate release that introduced it.
4. A literal present in both bundles is treated as carryover until a narrower changed branch is found.
5. Pure timing, layout, server, gateway, VS Code, or macOS-only changes remain explicitly unanchored when
   the Linux CLI bundle cannot establish them.

**Why this approach:**
- The alternatives are either to trust every release boundary as code provenance or to discard the
  useful chronology entirely. Keeping chronology and proof as separate columns preserves both.
- Exact target/baseline comparison resists false positives caused by minifier remangling and code motion.
- The trade-off is that several real fixes cannot be attributed below the seven-release window without
  the missing intermediate binaries.

**Key insight:** “Present in 2.1.227” and “introduced in 2.1.224” are different claims. The first can be
proved from the target; the second is release-note attribution unless a 2.1.223/2.1.224 pair exists.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](symbol_index_infra_integration.md) - Integrations

This document intentionally carries no local mapping table. Symbols discovered while tracing individual
items belong in the four canonical indexes and in their owning module documents.
