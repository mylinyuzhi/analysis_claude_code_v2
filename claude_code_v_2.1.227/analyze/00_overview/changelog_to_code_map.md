# Changelog-to-code map — Claude Code v2.1.220 → v2.1.227

This ledger accounts for all **130 release-note bullets** supplied for 2.1.221 through 2.1.227.
The complete, unabridged text remains in [`changelog_analysis.md`](changelog_analysis.md); this file
adds evidence status, source anchors where verified, and module routing. It does not turn an unverified
release note into a code claim.

**Evidence boundary.** Only the 2.1.220 baseline and 2.1.227 target bundles are available. Intermediate
release attribution comes from the changelog. Exact code comparison establishes only the aggregate
window delta.

---

## 1. Evidence verdicts

| Verdict | Meaning |
|---|---|
| `WINDOW_NEW` | Stable target mechanism is absent from 2.1.220 and present in 2.1.227. |
| `WINDOW_DELTA` | The mechanism exists in both bundles, but a narrower changed branch is verified. |
| `CARRYOVER+DELTA` | The headline mechanism predates this window; only its extension is new. |
| `SERVER_DEPENDENT` | The claim depends primarily on gateway/service behavior not established by this CLI bundle. |
| `EXTERNAL_SURFACE` | The item belongs to the VS Code extension or another artifact outside the supplied bundle. |
| `UNANCHORED` | No sufficiently specific two-bundle anchor has yet been established. This is not a finding that the fix is absent. |

### Evidence Classification Under Missing Intermediate Bundles

**What it does:** Gives every changelog bullet an explicit, falsifiable evidence status without assigning
false precision to releases whose binaries are missing.

**How it works:**
1. Preserve the release and wording exactly in the primary changelog.
2. Search stable literals, schemas, command objects, and control-flow branches in both available bundles.
3. Mark target-only mechanisms as `WINDOW_NEW`; mark changed branches around carryover mechanisms as
   `WINDOW_DELTA`.
4. Use `CARRYOVER+DELTA` when the changelog headline names an older surface but the window adds policy,
   transports, fields, or safeguards.
5. Separate VS Code and service/gateway claims because the Linux CLI bundle cannot prove their complete
   implementation.
6. Leave timing fixes, platform-only branches, and ambiguous minifier matches `UNANCHORED` until a narrow
   executable anchor is demonstrated.

**Why this approach:**
- Stable-literal counts alone confuse moved code, shared strings, and old mechanisms with new behavior.
- Treating the changelog as chronology but not binary provenance retains useful release intent.
- Explicit gaps make future intermediate-bundle work incremental: each row can be upgraded independently.
- The trade-off is a conservative anchored share; this is preferable to confident but non-reproducible
  attribution.

**Key insight:** An unanchored row is tracked work, not discarded work. It records exactly where the report
must avoid claiming more than the current corpus proves.

## 2. Window totals

| Evidence verdict | Bullets | Share |
|---|---:|---:|
| `WINDOW_NEW` | 10 | 7.7% |
| `WINDOW_DELTA` | 19 | 14.6% |
| `CARRYOVER+DELTA` | 2 | 1.5% |
| `SERVER_DEPENDENT` | 4 | 3.1% |
| `EXTERNAL_SURFACE` | 4 | 3.1% |
| `UNANCHORED` | 91 | 70.0% |
| **Total** | **130** | **100%** |

The anchored rows are deliberately concentrated on post-2.1.220 additions and architectural policy
changes. Fix-only rows remain in this ledger even when the current pass did not isolate their narrow
branch.

## 3. Per-release ledger

### 2.1.227 — 5 bullets

*WINDOW_DELTA 5*

| # | Type | Bullet (abridged) | Theme | Evidence | Anchor | Covered in |
|---:|---|---|---|---|---|---|
| 1 | FIXED | Fixed feature flags being evaluated without the user's subscription tier when a session started with an… | auth_models | **WINDOW_DELTA** | `sRa.createClient` `:617746-617803`; `aRa` `:618113-618155`; baseline constructor `:156831-156868` | [auth ordering](../55_auth_providers/auth_provider_runtime.md) · [feature evaluation](../44_telemetry/telemetry_feature_flags_usage_and_export.md) |
| 2 | FIXED | Fixed every Bash command failing under `claude-code-action` with `allowed_non_write_users` on GitHub-hosted… | permissions_sandbox | **WINDOW_DELTA** | `v_s` `:129272-129307`; preflight/config `:129325-129380`, `:129565-129665` (causal mapping inferred) | [CI hardening state](../51_headless_sdk/forwarding_and_ci_hardening.md) |
| 3 | FIXED | Fixed `/tui` bringing back a conversation that had been rewound to before its first message | terminal_ui | **WINDOW_DELTA** | `W6t` `:485928-485936`; call `:821588`; explicit `leafUuid: null` | [resume-leaf persistence](../43_slash_commands/slash_command_registry_dispatch_and_menu.md) |
| 4 | IMPROVED | Improved slash-command menu: blue now marks only the selected row, matched characters are bolded instead of… | terminal_ui | **WINDOW_DELTA** | `AZt` `:740166-740214`; `qsm` `:740302-740316`; `Vsm` `:740404-740536` | [Unicode-safe suggestion rendering](../43_slash_commands/slash_command_registry_dispatch_and_menu.md) |
| 5 | IMPROVED | Improved performance: fewer event-loop stalls on file-not-found suggestions and at-mention size checks | performance_reliability | **WINDOW_DELTA** | `Cmt` `:48690-48703`; `Fso` `:49091-49097`; call `:593307` | [stall reduction](../50_performance/io_stall_reductions.md) |

### 2.1.226 — 1 bullets

*UNANCHORED 1*

| # | Type | Bullet (abridged) | Theme | Evidence | Anchor | Covered in |
|---:|---|---|---|---|---|---|
| 1 | GENERIC | Bug fixes and reliability improvements | misc | **UNANCHORED** | — | — |

### 2.1.225 — 14 bullets

*SERVER_DEPENDENT 2 · UNANCHORED 5 · WINDOW_NEW 1 · WINDOW_DELTA 5 · EXTERNAL_SURFACE 1*

| # | Type | Bullet (abridged) | Theme | Evidence | Anchor | Covered in |
|---:|---|---|---|---|---|---|
| 1 | ADDED | Added gateway spend-limit support to Claude Code's usage warning; the limit-reached message now names the cap,… | usage_telemetry | **SERVER_DEPENDENT** | — | — |
| 2 | ADDED | Added a workspace trust prompt to `claude agents` for untrusted directories, matching the behavior of `claude` | background_agents | **WINDOW_NEW** | `kuH`/`xuH` `:962544-962601`; fast-path await `:978885-978886` | [agents workspace trust](../36_background_agents/agents_workspace_trust.md) |
| 3 | FIXED | Fixed a transient 401 replacing a long-lived `CLAUDE_CODE_OAUTH_TOKEN` with a stored login's short-lived… | auth_models | **WINDOW_DELTA** | preserve-source branch in `ZIS` `:616342-616437`, especially `:616370-616380` | [source-preserving 401 recovery](../55_auth_providers/auth_provider_runtime.md) |
| 4 | FIXED | Fixed MCP OAuth servers on macOS intermittently failing with a burst of 401 errors, as if never authenticated,… | mcp | **UNANCHORED** | — | — |
| 5 | FIXED | Fixed auto mode counting a safety-filter refusal of its own permission check toward the consecutive-block… | permissions_sandbox | **UNANCHORED** | — | — |
| 6 | FIXED | Fixed cross-session messages staying parked without a notice or expiry in headless sessions and during startup | agent_team | **WINDOW_DELTA** | `BJp` `:565236-565274` | [cross-session policy](../30_agent_team/cross_session_messaging_policy_and_pins.md) |
| 7 | FIXED | Fixed conversation history breaking on Remote Control session resume after very large conversations were… | remote_control | **UNANCHORED** | — | — |
| 8 | FIXED | Fixed hovering over a session in another project in the agents list changing the directory the next agent… | background_agents | **UNANCHORED** | — | — |
| 9 | FIXED | Fixed `claude self-hosted-runner` registering and then failing every session when `--base-dir` cannot be… | self_hosted_runner | **WINDOW_DELTA** | `mKh` `:973397-973414` runs before registration in `dhH` | [runner preflight](../60_self_hosted_runner/runner_command_lifecycle.md) |
| 10 | FIXED | Fixed Claude Code on the web sessions being misreported as stuck, re-sending a growing event backlog on every… | remote_control | **SERVER_DEPENDENT** | — | — |
| 11 | IMPROVED | Improved Remote Control: photos attached from the Claude app are now shown to Claude directly instead of being… | remote_control | **UNANCHORED** | — | — |
| 12 | FIXED | [VSCode] Fixed Focus view folding away the latest to-do list, a pending question's context, and settled… | terminal_ui | **EXTERNAL_SURFACE** | — | — |
| 13 | CHANGED | SendMessage can now start a conversation with your Remote Control sessions on other machines by name… | agent_team | **WINDOW_DELTA** | `NRn` `:564572-564844` | [recipient resolution](../30_agent_team/cross_session_messaging_policy_and_pins.md) |
| 14 | CHANGED | SendMessage: a Remote Control recipient you already confirmed is never swapped for a same-named session on… | agent_team | **WINDOW_DELTA** | `kJp` `:564944-564987` | [recipient pinning](../30_agent_team/cross_session_messaging_policy_and_pins.md) |

### 2.1.224 — 31 bullets

*WINDOW_NEW 4 · UNANCHORED 22 · WINDOW_DELTA 2 · CARRYOVER+DELTA 1 · EXTERNAL_SURFACE 2*

| # | Type | Bullet (abridged) | Theme | Evidence | Anchor | Covered in |
|---:|---|---|---|---|---|---|
| 1 | ADDED | Added self-hosted environments: `claude self-hosted-runner` turns your own machines or containers into a place… | self_hosted_runner | **WINDOW_NEW** | dispatch `:978907-978939`; `dhH` `:977255-977737` | [runner lifecycle](../60_self_hosted_runner/runner_command_lifecycle.md) · [operator suite](../60_self_hosted_runner/operator_tool_suite.md) |
| 2 | ADDED | Added `archive` plugin source: install plugins from a zip over HTTPS without git or npm, with optional SHA-256… | skills_plugins | **WINDOW_NEW** | `BUg` `:56738-56761`; `_pd` `:243178-243209` | [archive installer](../45_skills/plugin_archive_and_marketplace_policy.md) |
| 3 | ADDED | Added a cancel-and-confirm step when removing an unavailable paste changes a command's text | terminal_ui | **UNANCHORED** | — | — |
| 4 | ADDED | Added `ANTHROPIC_BEDROCK_REGION_PREFIX` env var for Bedrock to prefer a specific cross-region inference… | auth_models | **WINDOW_NEW** | `Ffr` `:97473-97476`; `afy` `:97738-97776` | [Bedrock prefix preference](../55_auth_providers/bedrock_region_prefix.md) |
| 5 | ADDED | Added `crossSessionInbound` and `dialogExpiry` settings: cross-session messages sent to a session running with… | agent_team | **WINDOW_NEW** | `$Jp` `:565145-565166`; `BJp` `:565236-565274` | [inbound policy](../30_agent_team/cross_session_messaging_policy_and_pins.md) |
| 6 | ADDED | Added sandbox credential-masking options: `extract` and `onExtractNoMatch` for structured env values, `decode:… | permissions_sandbox | **WINDOW_DELTA** | `AAo` `:156433-156471`; `Q1u` `:156728-156768`; `nHs` `:159233-159250` | [credential masking](../49_sandbox/credential_masking_and_sigv4.md) |
| 7 | ADDED | Added cross-session `SendMessage`: Claude Code sessions can now message each other, on any of your machines,… | agent_team | **CARRYOVER+DELTA** | `NRn` `:564572-564844`; names existed in baseline | [multi-transport messaging](../30_agent_team/cross_session_messaging_policy_and_pins.md) |
| 8 | FIXED | Fixed long (>200 char) project paths resolving to another project's session directory under a shared sanitized… | misc | **UNANCHORED** | — | — |
| 9 | FIXED | Fixed `SendMessage` reporting "Message sent" when the write to a teammate's inbox had actually failed; failed… | agent_team | **UNANCHORED** | — | — |
| 10 | FIXED | Fixed sandbox filesystem deny entries written with a trailing slash (e.g. `denyRead: "~/.aws/"`) being… | permissions_sandbox | **UNANCHORED** | — | — |
| 11 | FIXED | Fixed sandbox violation details never appearing in Bash tool results; Claude now sees which file or network… | permissions_sandbox | **UNANCHORED** | — | — |
| 12 | FIXED | Fixed MCP tools that connect mid-turn being deferred for tool search without their names announced to the model | mcp | **UNANCHORED** | — | — |
| 13 | FIXED | Fixed plugin install records being silently corrupted when the same plugin is installed in multiple projects | skills_plugins | **UNANCHORED** | — | — |
| 14 | FIXED | Fixed recalled or restored paste content occasionally attaching wrong data or silently losing text when the… | terminal_ui | **UNANCHORED** | — | — |
| 15 | FIXED | Fixed copy-on-select on Wayland sometimes not reaching the clipboard; the two selection writes no longer race | terminal_ui | **UNANCHORED** | — | — |
| 16 | FIXED | Fixed the feedback survey's transcript share silently failing on long sessions; a failed share now shows an… | misc | **UNANCHORED** | — | — |
| 17 | FIXED | Fixed Remote Control auto-start intermittently failing with "Remote credentials fetch failed" on a cold start… | remote_control | **UNANCHORED** | — | — |
| 18 | FIXED | Fixed Remote Control and SDK clients showing a blank "(no content)" message after `/clear` and other… | remote_control | **UNANCHORED** | — | — |
| 19 | FIXED | Fixed a Remote Control session recreated after its server session expired uploading prior local conversation… | remote_control | **UNANCHORED** | — | — |
| 20 | IMPROVED | Improved fullscreen mode to keep the full pre-compaction history in scrollback across repeated compactions,… | compact | **UNANCHORED** | — | — |
| 21 | IMPROVED | Improved Remote Control: attached web and mobile clients now see compaction progress and the post-compaction… | remote_control | **UNANCHORED** | — | — |
| 22 | IMPROVED | Improved Remote Control: connection failures now show a persistent failure indicator with details and a… | remote_control | **UNANCHORED** | — | — |
| 23 | REMOVED | Removed the 200-subagent-per-session spawn cap; long-running sessions no longer refuse new agents (concurrency… | background_agents | **WINDOW_DELTA** | target admission `:550909-550939`; baseline count gate `:398391-398400` | [lifetime-cap removal](../36_background_agents/subagent_lifetime_cap_removal.md) |
| 24 | CHANGED | Changed managed settings: the approval prompt no longer re-appears after re-login or org switching when the… | auth_models | **UNANCHORED** | — | — |
| 25 | CHANGED | Changed the feedback-survey transcript share: with your consent it now also uploads the last request's model… | auth_models | **UNANCHORED** | — | — |
| 26 | CHANGED | Changed the Bash tool description to always note that command output is displayed to the model, not reliably… | auth_models | **UNANCHORED** | — | — |
| 27 | CHANGED | Changed recalled paste placeholder numbers to renumber when accepted into the input | terminal_ui | **UNANCHORED** | — | — |
| 28 | CHANGED | Changed Remote Control to archive the stale server session instead of leaving a dead one listed when a fresh… | remote_control | **UNANCHORED** | — | — |
| 29 | FIXED | [VSCode] Fixed the extension showing Remote Control as connected after the connection failed | remote_control | **EXTERNAL_SURFACE** | — | — |
| 30 | FIXED | Fixed a session resume silently reconnecting Remote Control after the user turned it off (`--resume`, SDK… | remote_control | **UNANCHORED** | — | — |
| 31 | FIXED | [VSCode] Fixed sessions not honoring `remoteControlAtStartup` when explicitly enabled | terminal_ui | **EXTERNAL_SURFACE** | — | — |

### 2.1.223 — 19 bullets

*WINDOW_NEW 3 · UNANCHORED 13 · SERVER_DEPENDENT 1 · WINDOW_DELTA 2*

| # | Type | Bullet (abridged) | Theme | Evidence | Anchor | Covered in |
|---:|---|---|---|---|---|---|
| 1 | ADDED | Added owner wildcard entries (`"owner/*"`) to the `strictKnownMarketplaces` and `blockedMarketplaces` managed… | skills_plugins | **WINDOW_NEW** | `BZu` `:215696-215725` | [marketplace policy](../45_skills/plugin_archive_and_marketplace_policy.md) |
| 2 | ADDED | Added a warning when workflow agents, forked skills, slash commands, or resumed background agents' requested… | skills_plugins | **UNANCHORED** | — | — |
| 3 | ADDED | Added a `/teleport` hint in cloud sessions showing how to continue locally with `claude --teleport <session id>` | remote_control | **UNANCHORED** | — | — |
| 4 | FIXED | Fixed a Bash permission bypass where a crafted command could hide parts of itself from permission checks | permissions_sandbox | **UNANCHORED** | — | — |
| 5 | FIXED | Fixed permission prompts so commands padded with tabs or invisible Unicode can no longer hide part of the… | permissions_sandbox | **UNANCHORED** | — | — |
| 6 | FIXED | Fixed workflow scripts being able to use dynamic `import()` to run code outside the workflow sandbox | permissions_sandbox | **UNANCHORED** | — | — |
| 7 | FIXED | Fixed a permission gap where an agent definition's `bypassPermissions` mode ignored the org bypass-permissions… | permissions_sandbox | **UNANCHORED** | — | — |
| 8 | FIXED | Fixed resuming a session after a mid-session `/cd` coming back empty | misc | **UNANCHORED** | — | — |
| 9 | FIXED | Fixed gateway model discovery hiding Claude models registered under provider-prefixed IDs such as… | auth_models | **SERVER_DEPENDENT** | — | — |
| 10 | FIXED | Fixed `modelOverrides` keys that aren't Anthropic model IDs being treated as the session's canonical model ID;… | auth_models | **UNANCHORED** | — | — |
| 11 | FIXED | Fixed managed settings: server-delivered settings no longer disable the env block of a machine-local… | misc | **UNANCHORED** | — | — |
| 12 | FIXED | Fixed sandboxed commands failing to start on Linux when `sandbox.filesystem.denyWrite` covers the working… | permissions_sandbox | **UNANCHORED** | — | — |
| 13 | FIXED | Fixed forked background agents getting stuck "already resuming" for the rest of the session when rebuilding… | background_agents | **UNANCHORED** | — | — |
| 14 | FIXED | Fixed a resumed session failing every turn, or leaving the interactive app on an unresponsive error screen,… | misc | **UNANCHORED** | — | — |
| 15 | FIXED | Fixed a rare hang when parsing unusual `git push` output | performance_reliability | **UNANCHORED** | — | — |
| 16 | CHANGED | Changed `CLAUDE_CODE_DISABLE_1M_CONTEXT` to hold every Claude model with a native 1M window to 200K via… | compact | **WINDOW_DELTA** | `e_f` `:612611-612614`; `q3` `:213719-213742` | [context enforcement](../07_compact/context_window_enforcement.md) |
| 17 | CHANGED | Changed auto-compact to keep sessions on unrecognized model IDs within the assumed context window instead of… | compact | **WINDOW_NEW** | `q3` `:213719-213742`; `NYv` `:922412-922424` | [unknown-model cap](../07_compact/context_window_enforcement.md) |
| 18 | CHANGED | Changed `/review` to be an alias of `/code-review`, which reviews the current diff or a PR (`/code-review… | code_review | **WINDOW_DELTA** | `dyh` `:865096-865132`; baseline `/review` `:497637-497648` | [unified review command](../52_code_review/review_alias_and_effort_memory.md) |
| 19 | CHANGED | Changed `/code-review` with no effort level to reuse the level you typed last; type a level like `/code-review… | code_review | **WINDOW_NEW** | `aBv`–`q3l` `:864809-864818` | [effort memory](../52_code_review/review_alias_and_effort_memory.md) |

### 2.1.222 — 21 bullets

*UNANCHORED 19 · WINDOW_DELTA 1 · SERVER_DEPENDENT 1*

| # | Type | Bullet (abridged) | Theme | Evidence | Anchor | Covered in |
|---:|---|---|---|---|---|---|
| 1 | FIXED | Fixed worktree-isolated sessions and their subagents being able to run destructive git commands against the… | background_agents | **UNANCHORED** | — | — |
| 2 | FIXED | Fixed PreToolUse auto-allow hooks bypassing tool restrictions in background agent tasks (summaries,… | compact | **UNANCHORED** | — | — |
| 3 | FIXED | Fixed `/usage-credits` on Team and Enterprise showing "you've already sent a usage credit request" for members… | usage_telemetry | **UNANCHORED** | — | — |
| 4 | FIXED | Fixed the startup connectivity check hanging and then failing behind an HTTPS proxy; it now uses the same… | performance_reliability | **UNANCHORED** | — | — |
| 5 | FIXED | Fixed "Connection closed mid-response" errors being reported on responses that had actually completed | misc | **UNANCHORED** | — | — |
| 6 | FIXED | Fixed `/usage` overattributing usage to MCP servers: a server's share now reflects only the requests that… | mcp | **UNANCHORED** | — | — |
| 7 | FIXED | Fixed sessions not linking to pull requests created after the branch was pushed, including through the GitHub… | git_review | **UNANCHORED** | — | — |
| 8 | FIXED | Fixed org-restricted `model: opus`-style subagent and teammate family aliases dropping to the parent model… | background_agents | **UNANCHORED** | — | — |
| 9 | FIXED | Fixed stream idle timeout firing on custom `ANTHROPIC_BASE_URL` gateways despite server keep-alive pings… | gateway | **UNANCHORED** | — | — |
| 10 | FIXED | Fixed claude.ai connectors being falsely marked as needing authorization when the session token is invalid —… | mcp | **UNANCHORED** | — | — |
| 11 | FIXED | Fixed tool errors not being displayed for tools no longer available locally, for example after an MCP server… | mcp | **UNANCHORED** | — | — |
| 12 | FIXED | Fixed `SendMessage` rejecting a long summary — it now truncates instead, so sends no longer fail on a… | agent_team | **UNANCHORED** | — | — |
| 13 | FIXED | Fixed the spinner's effort label in a subagent's transcript view showing the session's effort level instead of… | background_agents | **UNANCHORED** | — | — |
| 14 | FIXED | Fixed rare crashes when a file watcher hit a filesystem error or during file-watcher teardown | performance_reliability | **UNANCHORED** | — | — |
| 15 | FIXED | Fixed screen readers re-reading the whole input line on every backspace in `--ax-screen-reader` mode —… | terminal_ui | **UNANCHORED** | — | — |
| 16 | FIXED | Fixed host model-selection keys not taking precedence over a stale on-disk `managed-settings.json` when… | auth_models | **UNANCHORED** | — | — |
| 17 | IMPROVED | Improved auto mode safety: messages sent to other agent sessions via `SendMessage` are now evaluated by the… | agent_team | **WINDOW_DELTA** | classifier precedes cross-session dispatch; resolver `NRn` | [cross-session policy](../30_agent_team/cross_session_messaging_policy_and_pins.md) (transport context) |
| 18 | IMPROVED | Improved the refusal when Claude tries to invoke a skill with `disable-model-invocation`: Claude is now told… | skills_plugins | **UNANCHORED** | — | — |
| 19 | IMPROVED | Improved the `/diff` view, the Remote Control workspace diff, and file-edit diffs in Claude Code on the web… | remote_control | **SERVER_DEPENDENT** | — | — |
| 20 | CHANGED | Changed Remote Control auto-start so repo-local settings (`.claude/settings.json` or… | remote_control | **UNANCHORED** | — | — |
| 21 | REMOVED | Removed ultraplan feature | misc | **UNANCHORED** | — | — |

### 2.1.221 — 39 bullets

*EXTERNAL_SURFACE 1 · CARRYOVER+DELTA 1 · UNANCHORED 31 · WINDOW_NEW 2 · WINDOW_DELTA 4*

| # | Type | Bullet (abridged) | Theme | Evidence | Anchor | Covered in |
|---:|---|---|---|---|---|---|
| 1 | ADDED | [VSCode] Added Focus view: a chat-menu toggle that hides tool activity behind an expandable per-turn summary… | terminal_ui | **EXTERNAL_SURFACE** | — | — |
| 2 | ADDED | Added `mode: "mask"` for sandbox credential files on Linux and WSL — sandboxed commands read a sentinel copy… | permissions_sandbox | **CARRYOVER+DELTA** | mask engine in both bundles; target policy/option expansion | [credential masking](../49_sandbox/credential_masking_and_sigv4.md) |
| 3 | ADDED | Added warnings to `claude plugin validate` when a marketplace or plugin name would be rejected by Claude… | skills_plugins | **WINDOW_NEW** | `Fja` `:672754-672995`; target-only compatibility messages | [plugin validation](../45_skills/plugin_usability_and_prompt_audit.md) |
| 4 | ADDED | Added a `prompt-audit` subcommand to the `claude-api` skill for auditing prompts and tool descriptions for… | skills_plugins | **WINDOW_NEW** | target-only bundled skill row `:886497` | [prompt-audit workflow](../45_skills/plugin_usability_and_prompt_audit.md) |
| 5 | FIXED | Fixed a Bash tool permission-check bypass where zsh could execute hidden commands in `[[ ]]` regex… | permissions_sandbox | **UNANCHORED** | — | — |
| 6 | FIXED | Fixed PowerShell permission checks mishandling paths containing quote characters on Windows; such paths now… | permissions_sandbox | **UNANCHORED** | — | — |
| 7 | FIXED | Fixed the thinking toggle having no effect for the rest of a session that started with thinking off; disabling… | mcp | **UNANCHORED** | — | — |
| 8 | FIXED | Fixed MCP servers from `--mcp-config` not being connected before the first turn in print mode (`-p`), which… | mcp | **UNANCHORED** | — | — |
| 9 | FIXED | Fixed @-mentioned files being silently dropped when pressing Esc to retract a prompt and resubmitting it | misc | **UNANCHORED** | — | — |
| 10 | FIXED | Fixed a crash when preparing API requests for SDK MCP tools named after built-in object properties such as… | mcp | **UNANCHORED** | — | — |
| 11 | FIXED | Fixed WebSearch failing with a 400 error at effort `xhigh`/`max` when thinking is disabled | misc | **UNANCHORED** | — | — |
| 12 | FIXED | Fixed sandboxed large uploads failing with TLS errors through the sandbox proxy | permissions_sandbox | **UNANCHORED** | — | — |
| 13 | FIXED | Fixed Team and Enterprise spend-limit message incorrectly blaming the org's monthly limit instead of your… | usage_telemetry | **UNANCHORED** | — | — |
| 14 | FIXED | Fixed Bedrock authentication with AWS SSO named profiles failing in desktop-managed sessions on Windows… | auth_models | **UNANCHORED** | — | — |
| 15 | FIXED | Fixed `CLAUDE_CODE_RESUME_INTERRUPTED_TURN=0` not disabling interrupted-turn auto-resume; falsy values are now… | misc | **UNANCHORED** | — | — |
| 16 | FIXED | Fixed a rare wake-from-sleep race where two Claude Code processes could both refresh the same MCP connector or… | mcp | **UNANCHORED** | — | — |
| 17 | FIXED | Fixed renaming a session from Claude Code Desktop or claude.ai not updating the CLI's session name; session… | misc | **UNANCHORED** | — | — |
| 18 | FIXED | Fixed plugin- and org-delivered skills named after terminal-only built-ins (e.g. `/help`, `/feedback`) being… | skills_plugins | **UNANCHORED** | — | — |
| 19 | FIXED | Fixed the "Plugins changed" notification lingering after plugins were reloaded instead of clearing | skills_plugins | **UNANCHORED** | — | — |
| 20 | FIXED | Fixed Vim mode: the yank register now survives dialogs, history search, and the transcript view instead of… | terminal_ui | **UNANCHORED** | — | — |
| 21 | FIXED | Fixed Vim mode: undoing back to an empty prompt now arms the "press ← again" confirm before returning to the… | terminal_ui | **UNANCHORED** | — | — |
| 22 | IMPROVED | Improved tool search on Google Vertex AI: re-enabled for Claude 4.5-generation and newer models | auth_models | **UNANCHORED** | — | — |
| 23 | IMPROVED | Improved auto mode: permission checks for parallel tool calls are now cache-efficient, and switching modes… | permissions_sandbox | **UNANCHORED** | — | — |
| 24 | REDUCED | Reduced prompt-cache costs for auto-mode permission checks by reusing the cached conversation prefix across… | permissions_sandbox | **UNANCHORED** | — | — |
| 25 | IMPROVED | Improved Stats panel to count cache tokens in its token totals, with a breakdown by input, output, cache read,… | auth_models | **UNANCHORED** | — | — |
| 26 | IMPROVED | Improved `/ultrareview` error messages when a repo shares no history with its base: a checkout with no… | code_review | **UNANCHORED** | — | — |
| 27 | IMPROVED | Improved Windows startup: process creation times are now read via a native kernel32 call instead of spawning… | performance_reliability | **UNANCHORED** | — | — |
| 28 | CHANGED | Changed background sessions to commit and push to preserve work, open a draft PR only when the task calls for… | background_agents | **WINDOW_DELTA** | `VQb` `:527887-527913`; baseline `:507957-507968` | [work preservation](../36_background_agents/work_preservation_policy.md) |
| 29 | CHANGED | Changed `/plugin install` to refresh a stale marketplace catalog and retry before reporting a plugin not found | skills_plugins | **WINDOW_DELTA** | `hFr` `:670916-670936`; retry in `pUf` | [refresh-on-miss](../45_skills/plugin_usability_and_prompt_audit.md) |
| 30 | CHANGED | Changed plugins installed from `/plugin` to activate immediately when safe, instead of always requiring… | skills_plugins | **WINDOW_DELTA** | `JOm`/`PYE` `:794269-794304` | [safe activation](../45_skills/plugin_usability_and_prompt_audit.md) |
| 31 | CHANGED | Changed plugins to accept `"."` as a `skills` path, and the root-level `SKILL.md` validation error now… | skills_plugins | **WINDOW_DELTA** | schema `:56288-56302`; `CFr` root hint | [root skill path](../45_skills/plugin_usability_and_prompt_audit.md) |
| 32 | CHANGED | Changed `/status` to show the session kind: `interactive`, or a background job that is `attached` or… | terminal_ui | **UNANCHORED** | — | — |
| 33 | CHANGED | Changed emoji autocomplete to accept common alternate shortcodes like `:thumbsup:`, `:thumbsdown:`, and `:love:` | terminal_ui | **UNANCHORED** | — | — |
| 34 | CHANGED | Changed sessions forked with `/fork` to create a new worktree of their own instead of working in the original… | background_agents | **UNANCHORED** | — | — |
| 35 | CHANGED | Changed Claude in Chrome to close the browser tabs it opens once it no longer needs them | performance_reliability | **UNANCHORED** | — | — |
| 36 | CHANGED | Changed fast mode to report on the stream when usage credits run out mid-session, instead of failing silently | usage_telemetry | **UNANCHORED** | — | — |
| 37 | CHANGED | Changed Monitor: a watch that exits without producing any output now says so instead of reporting "stream ended" | performance_reliability | **UNANCHORED** | — | — |
| 38 | CHANGED | Changed the Gateway `model` field validation: non-string values are rejected with a 400 instead of being… | auth_models | **UNANCHORED** | — | — |
| 39 | REMOVED | Removed the repeated "Permission mode changed while the auto-mode classifier call was queued" notice from… | permissions_sandbox | **UNANCHORED** | — | — |


## 4. Gap register and next-pass order

The `UNANCHORED` rows fall into four different kinds of work and should not be treated as one bucket:

1. **Security and authority branches:** permission-check bypasses, worktree isolation, hook authority,
   managed-settings precedence, and authentication replacement deserve the next source pass because a
   wrong explanation would be more harmful than an omitted one.
2. **State-machine fixes:** rewind/resume, Remote Control reconnection, compaction history, paste identity,
   and background-agent recovery need old/new control-flow comparison rather than literal matching.
3. **Platform-only behavior:** macOS keychain, Windows process/PowerShell, Wayland clipboard, and VS Code
   Focus view require the corresponding platform or extension artifacts where available.
4. **Pure timing/layout changes:** races, event ordering, folds, hover state, and visual selection often
   lack a stable literal; tests or intermediate diffs are the strongest evidence.

The deep modules linked above cover the highest-confidence new and changed systems first: cross-session
messaging, self-hosted runner tooling, archive plugins and marketplace policy, credential masking,
context-window enforcement, review-command unification, and event-loop stall reduction.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](symbol_index_infra_integration.md) - Integrations

This ledger introduces no local symbol mappings. Every symbol named in an anchor is defined in the
canonical index owned by its module.
