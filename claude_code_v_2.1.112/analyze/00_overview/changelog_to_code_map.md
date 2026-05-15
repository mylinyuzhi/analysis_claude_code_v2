# Changelog to Code Map: v2.1.89 - v2.1.112

This is the canonical per-bullet code-traceability index for the v2.1.88 baseline -> v2.1.112 changelog window. For each changelog bullet point, this document records:

- **Theme** - one of: auto-mode, permissions, hooks, skills, plan-mode, compact, cache, recap, bash, sandbox, mcp, subagent, tui, focus, resume, transcripts, plugins, model, effort, voice, push, mobile, slash-cmd, telemetry, lsp, ide, idle, misc.
- **v2.1.88 source path** - file in `claude-code-kim/src/` (i.e. `/lyz/codespace/3rd/claude-code/src/`) when the feature already existed; otherwise `absent in 2.1.88`.
- **v2.1.112 chunk file(s)** - `chunks.NN.mjs` found by grepping the obfuscated build.
- **Implementation hint** - one-line description of what kind of code change this is (new schema field, fix to error path, etc.).

Companion documents:

- [`changelog_analysis.md`](changelog_analysis.md) - narrative architectural analysis (not a per-bullet index)
- [`file_index.md`](file_index.md) - chunk -> topical role map
- [`symbol_index_*.md`](.) - obfuscated -> readable symbol mappings
- [`symbol_additions_unit_18.md`](symbol_additions_unit_18.md) - symbols cited by this map (cross-referenced from canonical indices)

Versions are listed newest first. Within each version, bullets are grouped by theme.

---

## v2.1.112

| Bullet excerpt | Theme | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|-------|----------------|----------------|---------------------|
| Fixed "claude-opus-4-7 is temporarily unavailable" for auto mode | auto-mode | `utils/model/`, `utils/autoModeDenials.ts` | `chunks.80.mjs`, `chunks.116.mjs` | Hotfix to model availability check inside auto-mode dispatcher; lifts Opus 4.7 from a denylist consulted by the unavailable-prompt builder |

---

## v2.1.111

### model / effort

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Claude Opus 4.7 xhigh is now available! Use /effort to tune speed vs. intelligence | `utils/effort.ts`, `commands/effort/` | `chunks.80.mjs:2835`, `chunks.181.mjs:1672` | New tier added to `EFFORT_LEVELS` array (`UI`); welcome banner `pdK` updated |
| Auto mode is now available for Max subscribers when using Opus 4.7 | `utils/autoMode*.ts`, `utils/model/` | `chunks.80.mjs`, `chunks.61.mjs` | Gating: `isMaxPlan` (`ch`) + `isOpus47Model` together unlock auto mode |
| Added `xhigh` effort level for Opus 4.7, sitting between `high` and `max` | `utils/effort.ts` | `chunks.80.mjs:2708-2755` (`bt6` `modelSupportsXhigh`, `wy6` downgrade) | New enum member; per-model resolver downgrades xhigh -> high for non-4.7 models |
| `/effort` now opens an interactive slider when called without arguments | `commands/effort/index.ts` | `chunks.168.mjs:740-750` | Interactive picker JSX; new keybindings `modelPicker:decreaseEffort` / `increaseEffort` (`KhY`) |
| Auto mode no longer requires `--enable-auto-mode` | `utils/cliArgs.ts`, `utils/autoModeDenials.ts` | `chunks.222.mjs`, `chunks.106.mjs` | Argparser change: gate removed; default-on for eligible tiers |

### slash-cmd

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added "Auto (match terminal)" theme option that matches your terminal's dark/light mode | `commands/theme/`, `components/ThemePicker.tsx` | `chunks.168.mjs:444`, `chunks.169.mjs:1456` | New option in theme picker that reads terminal-supplied DARK/LIGHT via OSC 11 sniff |
| Added `/less-permission-prompts` skill | `skills/bundled/` (absent — new) | `chunks.211.mjs:1403` | New bundled skill; `p25` (description), `WjA` (full prompt) |
| Added `/ultrareview` for running comprehensive code review in the cloud | `commands/` (absent) | `chunks.183.mjs:2170` (`ulK`), `chunks.183.mjs` (`wW6` preflight) | Local-JSX command; description is a getter that reads preflight cost/runtime estimates each render |

### bash / sandbox / windows

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Windows: PowerShell tool is progressively rolling out | `tools/PowerShellTool/` | `chunks.117.mjs`, `chunks.131.mjs` | New env-var gate `CLAUDE_CODE_USE_POWERSHELL_TOOL`; staged rollout via feature flag |
| Read-only bash commands with glob patterns (e.g. `ls *.ts`) and commands starting with `cd <project-dir> &&` no longer trigger a permission prompt | `tools/BashTool/`, permission rules | `chunks.149.mjs`, `chunks.83.mjs` | Bash classifier hardening; glob expansion treated as read-only; `cd <project>` prefix recognized as safe |

### cli / resume / tui

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Suggest the closest matching subcommand when `claude <word>` is invoked with a near-miss typo | `utils/cliArgs.ts`, `entrypoints/` | `chunks.222.mjs` | Levenshtein-distance fallback at argparser top-level |
| Plan files are now named after your prompt (e.g. `fix-auth-race-snug-otter.md`) | `utils/planModeV2.ts`, `utils/plans.ts` | plan-mode chunks (`chunks.106.mjs`, `chunks.146.mjs`) | Filename builder: `slugify(promptSummary) + '-' + randomAdjective + '-' + randomAnimal` |
| Improved `/setup-vertex` and `/setup-bedrock` to show the actual `settings.json` path when `CLAUDE_CONFIG_DIR` is set | `commands/install*` | `chunks.214.mjs` (Vertex), Bedrock wizard chunks | Reads `CLAUDE_CONFIG_DIR` for displayed path; seed model list from existing pins; "with 1M context" toggle |
| `/skills` menu now supports sorting by estimated token count | `commands/skills/`, `components/skills/` | skills picker chunks | New sort mode; `t` keybinding toggles |
| `Ctrl+U` now clears the entire input buffer; press `Ctrl+Y` to restore | `keybindings/`, `hooks/useInputBuffer.ts` | `chunks.168.mjs` (keybindings) | New default keybinding entry + restore-yank stack |
| `Ctrl+L` now forces a full screen redraw in addition to clearing the prompt input | `keybindings/`, `ink.ts` | `chunks.168.mjs`, `chunks.65.mjs` | Forces alt-screen full repaint |
| Transcript view footer now shows `[` (dump to scrollback) and `v` (open in editor) shortcuts | `components/VirtualMessageList.tsx`, transcript footer | transcript chunks | Footer pill update; reused existing actions |
| The "+N lines" marker for truncated long pastes is now a full-width rule | `utils/messages` | message render chunks | UI: replace centered text marker with horizontal rule |

### plugins / hooks / telemetry

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Headless `--output-format stream-json` now includes `plugin_errors` on the init event when plugins are demoted for unsatisfied dependencies | `utils/plugins/`, headless schemas | `chunks.18.mjs` (plugin schema), headless init chunk | New init-event field; plugin loader emits demotion list |
| Added `OTEL_LOG_RAW_API_BODIES` environment variable | `utils/telemetry/`, `utils/api.ts` | `chunks.116.mjs`, `chunks.130.mjs` | New env-var gate inside the OTEL emit path |
| Suppressed spurious decompression, network, and transient error messages | `utils/errors.ts`, network/stream paths | `chunks.215.mjs`, `chunks.106.mjs` | Filters added; transient errors no longer escalate to user-visible toasts |
| Reverted the v2.1.110 cap on non-streaming fallback retries | `utils/api.ts` (retry path) | `chunks.214.mjs`, `chunks.106.mjs` | Reverted the cap added in 2.1.110 |
| Improved plugin error handling: dependency errors now distinguish conflicting, invalid, and overly complex version requirements | `utils/plugins/`, plugin loader | `chunks.18.mjs` (schema), `chunks.157.mjs`, `chunks.177.mjs` | Error enum widened; semver classifier inside resolver |

### fixes - TUI / IDE / terminal

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed terminal display tearing (random characters, drifting input) in iTerm2 + tmux setups | `ink.ts`, terminal helpers | `chunks.65.mjs`, terminal-render chunks | Synchronized output detection; tmux passthrough flag |
| Fixed `@` file suggestions re-scanning the entire project on every turn in non-git working directories | `hooks/fileSuggestions.ts`, `utils/contextSuggestions.ts` | suggestion chunks | Cache key now keyed on cwd+isGit; ignore-list short-circuits non-git path |
| Fixed LSP diagnostics from before an edit appearing after it | `services/lsp/` | LSP chunks | Diagnostic queue purged on tool-confirmed write |
| Fixed tab-completing `/resume` immediately resuming an arbitrary titled session | `commands/resume/` | resume picker chunks | Distinguish "tab-complete" vs "select" in picker |
| Fixed `/context` grid rendering with extra blank lines between rows | `components/ContextVisualization.tsx` | `/context` chunk | Row-spacing CSS fix |
| Fixed `/clear` dropping the session name set by `/rename` | `commands/clear/`, `commands/rename/`, `utils/sessionTitle.ts` | clear/rename chunks | Preserve session-name on clear handler |
| Fixed Claude calling a non-existent `commit` skill and showing "Unknown skill: commit" for users without a custom `/commit` command | `skills/`, `utils/slashCommandParsing.ts` | skill/command resolver chunks | Built-in command fallback when `/commit` skill missing |
| Fixed 429 rate-limit errors on Bedrock/Vertex/Foundry referencing status.claude.com | `utils/api.ts`, `services/rateLimitMessages.ts` | rate-limit message chunks | Provider-specific status URL selection |
| Fixed feedback surveys appearing back-to-back after dismissing one | `components/FeedbackSurvey/` | feedback chunks | Dismissed-state propagation race fix |
| Fixed bare URLs in bash/PowerShell/MCP tool output being unclickable when the terminal wraps them | `utils/hyperlink.ts` | hyperlink chunks | URL-wrap detection: emit OSC 8 link per visual segment |
| Windows: `CLAUDE_ENV_FILE` and SessionStart hook environment files now apply | `utils/sessionEnvironment.ts`, `utils/managedEnv.ts` | env chunks | Windows path resolution fix |
| Windows: permission rules with drive-letter paths are now correctly root-anchored | `utils/permissions/`, `utils/windowsPaths.ts` | permission chunks | Drive-letter normalization in rule matcher |

---

## v2.1.110

### tui / focus / mobile

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added `/tui` command and `tui` setting | `commands/` (absent for `/tui`), settings schema | `chunks.185.mjs:397-454` (`bcY`, `IcY`, `n$7`), `chunks.19.mjs:547` | New slash command + settings schema field; runtime renderer swap inside same conversation |
| Added push notification tool | `tools/` (absent) | `chunks.101.mjs:1261-1271` (`ic="PushNotification"`) | Deferred tool; emits to mobile via Remote Control; double-gated by `tengu_amber_sentinel` and per-user opt-in |
| Changed `Ctrl+O` to toggle between normal and verbose transcript only; focus view is now toggled separately with the new `/focus` command | `keybindings/`, `commands/`, `hooks/useTurnDiffs.ts` | `chunks.189.mjs:1450-1475` (`FoY`), focus chunks | Keybinding refactor + new `/focus` command split from former Ctrl+O behavior |
| Added `autoScrollEnabled` config | `utils/config.ts` | `chunks.151.mjs:2323-2327` | New settings.json field; consulted in fullscreen scroll handler |
| Added option to show Claude's last response as commented context in the `Ctrl+G` external editor | `hooks/useTextInput.ts`, `utils/editor.ts` | editor-launch chunks | Config flag; pre-fills external editor buffer |

### plugins / mcp

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Improved `/plugin` Installed tab - items needing attention and favorites appear at the top | `commands/plugin/`, `components/plugins/` | plugin tab chunks | Sort by (needsAttention DESC, isFavorite DESC, name ASC); collapsed disabled |
| Improved `/doctor` to warn when an MCP server is defined in multiple config scopes with different endpoints | `commands/doctor/` | doctor chunks | Duplicate-scope detector for mcp.json/settings.json |

### resume / recap

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| `--resume`/`--continue` now resurrects unexpired scheduled tasks | `commands/resume/`, `utils/cronScheduler.ts` | resume + scheduler chunks | Re-arms scheduled jobs from persisted state |
| `/context`, `/exit`, and `/reload-plugins` now work from Remote Control (mobile/web) clients | `commands/`, `utils/remote/` | remote control chunks | Whitelist expansion in remote command dispatcher |
| Session recap is now enabled for users with telemetry disabled (Bedrock, Vertex, Foundry, `DISABLE_TELEMETRY`) | `services/awaySummary.ts`, `hooks/useAwaySummary.ts` | `chunks.194.mjs`, `chunks.117.mjs` | Removed telemetry-required gate; new opt-out env `CLAUDE_CODE_ENABLE_AWAY_SUMMARY=0` |

### bash / tools

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Write tool now informs the model when you edit the proposed content in the IDE diff before accepting | `tools/FileWriteTool/`, `services/ide` | Write tool + IDE chunks | New synthetic post-tool-use message with edit diff |
| Bash tool now enforces the documented maximum timeout instead of accepting arbitrarily large values | `tools/BashTool/` | Bash tool chunk | Param validator: clamp to documented max |
| SDK/headless sessions now read `TRACEPARENT`/`TRACESTATE` from the environment | `entrypoints/`, `utils/telemetry/` | `chunks.100.mjs`, `chunks.144.mjs` | OTEL span linkage from env vars |

### fixes

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed MCP tool calls hanging indefinitely when the server connection drops mid-response on SSE/HTTP transports | `services/mcp/`, `utils/mcpWebSocketTransport.ts` | mcp transport chunks | Drop-detect + reject pending invocations |
| Fixed non-streaming fallback retries causing multi-minute hangs when the API is unreachable | `utils/api.ts` | `chunks.214.mjs`, `chunks.106.mjs` | Added per-attempt timeout (later partially reverted in 2.1.111) |
| Fixed session recap, local slash-command output, and other system status lines not appearing in focus mode | `components/StatusNotices.tsx`, focus chunks | `chunks.189.mjs`, focus rendering | Status-line filter in focus mode widened |
| Fixed high CPU usage in fullscreen when text is selected while a tool is running | `ink.ts`, `hooks/useCopyOnSelect.ts` | render chunks | Pause redraw loop while selection is active |
| Fixed plugin install not honoring dependencies declared in `plugin.json` | `utils/plugins/`, plugin loader | `chunks.157.mjs` | Resolver consults plugin.json deps regardless of marketplace manifest |
| Fixed skills with `disable-model-invocation: true` failing when invoked via `/<skill>` mid-message | `skills/`, `utils/slashCommandParsing.ts` | skill registry chunks | Distinguish user-initiated vs model-initiated invocation |
| Fixed `--resume` sometimes showing the first prompt instead of the `/rename` name | `commands/resume/`, `utils/sessionTitle.ts` | resume chunks | Title preference fallback ordering |
| Fixed queued messages briefly appearing twice during multi-tool-call turns | `hooks/useCommandQueue.ts`, `hooks/useQueueProcessor.ts` | queue chunks | Idempotent enqueue on dedup-key |
| Fixed session cleanup not removing the full session directory including subagent transcripts | `utils/cleanup.ts`, `utils/sessionStorage.ts` | cleanup chunks | Recursive directory removal in subagent path |
| Fixed dropped keystrokes after the CLI relaunches | `entrypoints/`, `utils/earlyInput.ts` | startup chunks | Early-input buffer flushed after relaunch |
| Fixed garbled startup rendering in macOS Terminal.app and other terminals that don't support synchronized output | `ink.ts`, terminal capability detection | render chunks | Capability detection: fall back to non-sync rendering |
| Hardened "Open in editor" actions against command injection from untrusted filenames | `utils/editor.ts`, hyperlink/file handlers | editor chunks | Argv-passing instead of shell string |
| Fixed `PermissionRequest` hooks returning `updatedInput` not being re-checked against `permissions.deny` rules | `hooks/`, `utils/permissions/`, `utils/classifierApprovalsHook.ts` | `chunks.193.mjs`, permission chunks | Re-evaluate deny rules after hook rewrites input |
| `setMode:'bypassPermissions'` updates now respect `disableBypassPermissionsMode` | settings + permissions | `chunks.19.mjs`, permission chunks | New check in setMode handler |
| Fixed `PreToolUse` hook `additionalContext` being dropped when the tool call fails | `hooks/`, tool execution path | `chunks.193.mjs`, tool exec | Always pass additionalContext to result builder even on tool error |
| Fixed stdio MCP servers that print stray non-JSON lines to stdout being disconnected on the first stray line (regression in 2.1.105) | `services/mcp/`, stdio transport | mcp transport chunks | Tolerate non-JSON line; skip + warn instead of disconnect |
| Fixed headless/SDK session auto-title firing an extra Haiku request when `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` or `CLAUDE_CODE_DISABLE_TERMINAL_TITLE` is set | `utils/sessionTitle.ts`, entrypoints | sessionTitle chunks | Gate Haiku call on disable flags |
| Fixed potential excessive memory allocation when piped (non-TTY) Ink output contains a single very wide line | `ink.ts`, render path | render chunks | Width-cap on single-line wrap |
| Fixed `/skills` menu not scrolling when the list overflows the modal in fullscreen mode | `commands/skills/`, skills picker | skills picker chunks | Add scroll keybindings to picker |
| Fixed Remote Control sessions showing a generic error instead of prompting for re-login when the session is too old | `utils/remote/`, auth | remote auth chunks | Distinguish auth-expired vs other errors |
| Fixed Remote Control session renames from claude.ai not persisting the title to the local CLI session | `commands/rename/`, `utils/remote/` | rename + remote chunks | Apply remote-trigger rename to local session-name store |

---

## v2.1.109

| Bullet excerpt | Theme | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|-------|----------------|----------------|---------------------|
| Improved the extended-thinking indicator with a rotating progress hint | thinking | `components/ThinkingToggle.tsx`, `utils/thinking.ts` | thinking indicator chunks | New animated string array; cycles on tick |

---

## v2.1.108

### cache / model

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added `ENABLE_PROMPT_CACHING_1H` env var | `utils/api.ts` (cache TTL) | `chunks.194.mjs:1034-1043` (`o85` is1HourCacheEligible) | New env-var path; `ENABLE_PROMPT_CACHING_1H_BEDROCK` deprecated alias |
| Added `FORCE_PROMPT_CACHING_5M` | `utils/api.ts` | `chunks.194.mjs` | Forces 5-minute TTL override |
| Added recap feature to provide context when returning to a session | `services/awaySummary.ts`, `hooks/useAwaySummary.ts` | `chunks.189.mjs:2782-2792` (`LaY`) | New `/recap` slash command wrapping awaySummary; `CLAUDE_CODE_ENABLE_AWAY_SUMMARY` override |
| Improved `/model` to warn before switching models mid-conversation | `commands/model/`, `components/ModelPicker.tsx` | model picker chunks | Pre-switch confirmation modal |

### slash-cmd / skills

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| The model can now discover and invoke built-in slash commands like `/init`, `/review`, and `/security-review` via the Skill tool | `tools/SkillTool/`, built-in skills | skill tool chunks, `chunks.211.mjs` | Skill registry now includes built-in slash commands; description-based discovery |
| `/undo` is now an alias for `/rewind` | `commands/rewind/` | `chunks.188.mjs` | New alias entry; aliases include `["checkpoint","undo"]` |

### resume

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Improved `/resume` picker to default to sessions from the current directory; press `Ctrl+A` to show all projects | `commands/resume/`, picker hooks | resume picker chunks | New default filter; Ctrl+A toggles |

### errors / messages

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Improved error messages: server rate limits are now distinguished from plan usage limits | `services/rateLimitMessages.ts`, `utils/api.ts` | rate-limit message chunks | Distinct message paths for 429 vs entitlement |
| 5xx/529 errors show a link to status.claude.com; unknown slash commands suggest the closest match | `utils/api.ts`, `utils/slashCommandParsing.ts` | error builders, slash parser | Status-link injection; Levenshtein near-miss |

### perf / misc

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Reduced memory footprint for file reads, edits, and syntax highlighting by loading language grammars on demand | `utils/cliHighlight.ts`, grammars | `chunks.102.mjs` (grammars) | Lazy import per language |
| Added "verbose" indicator when viewing the detailed transcript (`Ctrl+O`) | `components/VirtualMessageList.tsx` | transcript chunks | Footer pill update |
| Added a warning at startup when prompt caching is disabled via `DISABLE_PROMPT_CACHING*` | `utils/api.ts`, startup banner | startup chunks | Boot-time warning emit |

### fixes

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed paste not working in the `/login` code prompt | `commands/login/` | login chunks | Paste handler bridged to login screen |
| Fixed subscribers who set `DISABLE_TELEMETRY` falling back to 5-minute prompt cache TTL instead of 1 hour | `utils/api.ts` | `chunks.194.mjs` | Decouple cache-TTL eligibility from telemetry flag |
| Fixed Agent tool prompting for permission in auto mode when the safety classifier's transcript exceeded its context window | `services/classifierApprovals*`, agent tool | classifier chunks, `chunks.141.mjs` | Truncate/window transcript before classifier call |
| Fixed Bash tool producing no output when `CLAUDE_ENV_FILE` (e.g. `~/.zprofile`) ends with a `#` comment line | `utils/managedEnv.ts`, `utils/sessionEnvironment.ts` | env loader chunks | Comment-line tolerance in env-file parser |
| Fixed `claude --resume <session-id>` losing the session's custom name and color set via `/rename` | `commands/resume/`, `utils/sessionTitle.ts` | resume chunks | Persistence read fixed |
| Fixed session titles showing placeholder example text when the first message is a short greeting | `utils/sessionTitle.ts` | sessionTitle chunks | Minimum-prompt-length gate on title generation |
| Fixed terminal escape codes appearing as garbage text in the prompt input after `--teleport` | `commands/teleport/`, `utils/teleport/` | teleport chunks | Drain pending terminal sequences before prompt restore |
| Fixed `/feedback` retry: pressing Enter to resubmit after a failure now works without first editing the description | `components/FeedbackSurvey/` | feedback chunks | Retry-state reset on enter |
| Fixed `--teleport` and `--resume <id>` precondition errors exiting silently | `commands/teleport/`, resume | teleport chunks | Promote silent exits to stderr+code-1 |
| Fixed Remote Control session titles set in the web UI being overwritten by auto-generated titles after the third message | `utils/sessionTitle.ts`, remote | sessionTitle chunks | Skip auto-title when remote-set title exists |
| Fixed `--resume` truncating sessions when the transcript contained a self-referencing message | `utils/conversationRecovery.ts` | resume chunks | Self-ref detection in chain rebuild |
| Fixed transcript write failures (e.g., disk full) being silently dropped instead of being logged | `utils/sessionStorage.ts` | session storage chunks | Promote write errors to logger |
| Fixed diacritical marks (accents, umlauts, cedillas) being dropped from responses when the `language` setting is configured | `utils/markdown.ts`, language post-process | post-process chunks | Unicode normalization preserves combining marks |
| Fixed policy-managed plugins never auto-updating when running from a different project than where they were first installed | `utils/plugins/` | plugin update chunks | Use global policy-managed cache, not project-relative |

---

## v2.1.107

| Bullet excerpt | Theme | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|-------|----------------|----------------|---------------------|
| Show thinking hints sooner during long operations | thinking | `utils/thinking.ts`, indicator components | thinking indicator chunks | Reduced hint-display delay threshold |

---

## v2.1.105

### tools / agent

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added `path` parameter to the `EnterWorktree` tool | `tools/EnterWorktreeTool/` | `chunks.151.mjs` (`bjY`), `chunks.98.mjs` | New `path` zod field; switches to existing worktree directly |

### hooks / compact

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added PreCompact hook support: hooks can now block compaction by exiting with code 2 or returning `{"decision":"block"}` | `hooks/`, `services/compact/autoCompact.ts` | `chunks.101.mjs:1568`, `chunks.155.mjs:116`, `chunks.159.mjs:535` | Dispatcher checks `blockedBy`; error swallowed without burning failure counter |

### plugins

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added background monitor support for plugins via a top-level `monitors` manifest key | `utils/plugins/` | `chunks.18.mjs:2251` (`wi5`/`XO1`) | New manifest schema (`PluginMonitorSchema`); arms on session-start or skill-invoke trigger |

### slash-cmd / loop

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| `/proactive` is now an alias for `/loop` | `commands/loop/` (or local-jsx) | loop chunks | Alias entry added |

### api / streaming

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Improved stalled API stream handling: streams now abort after 5 minutes of no data and retry non-streaming | `utils/api.ts`, stream handler | `chunks.214.mjs`, `chunks.106.mjs` | New per-stream 5-min idle timeout; falls back to non-streaming retry |
| Improved network error messages: connection errors now show a retry message immediately instead of a silent spinner | `utils/api.ts`, status display | api+status chunks | Immediate-status message on connection error |

### ui / files

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Improved file write display: long single-line writes (e.g. minified JSON) are now truncated in the UI | `tools/FileWriteTool/`, `components/FileEditToolUpdatedMessage.tsx` | file write display chunks | UI-only truncation at render time |
| Improved `/doctor` layout with status icons; press `f` to have Claude fix reported issues | `commands/doctor/` | doctor chunks | Tabular layout + `f` keybinding for autofix |
| Improved `/config` labels and descriptions for clarity | `commands/config/`, `components/Settings/` | config chunks | String table revisions |
| Improved skill description handling: raised the listing cap from 250 to 1,536 characters | `skills/`, `skills/loadSkillsDir.ts` | skill loader chunks | Const change + warn-on-truncate |
| Improved `WebFetch` to strip `<style>` and `<script>` contents from fetched pages | `tools/WebFetchTool/` | WebFetch chunk | Pre-injection HTML cleanup |
| Improved stale agent worktree cleanup to remove worktrees whose PR was squash-merged | `utils/worktree.ts`, `utils/backgroundHousekeeping.ts` | worktree cleanup chunks | PR-state check via GitHub API |
| Improved MCP large-output truncation prompt to give format-specific recipes | `services/mcp/`, `utils/mcpOutputStorage.ts` | mcp output chunks | Format-detected recipes inline |

### fixes

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed images attached to queued messages (sent while Claude is working) being dropped | `hooks/useCommandQueue.ts`, `utils/imagePaste.ts` | queue chunks | Attach images to queued message envelope |
| Fixed screen going blank when the prompt input wraps to a second line in long conversations | `components/PromptInput/`, `ink.ts` | render chunks | Layout calc fix for multi-line input |
| Fixed leading whitespace getting copied when selecting multi-line assistant responses in fullscreen mode | `hooks/useCopyOnSelect.ts` | copy chunks | Strip prefix whitespace on copy |
| Fixed leading whitespace being trimmed from assistant messages, breaking ASCII art and indented diagrams | `utils/messages`, markdown render | message render chunks | Preserve leading whitespace in code/preserved blocks |
| Fixed garbled bash output when commands print clickable file links | `tools/BashTool/`, output renderer | bash output chunks | OSC 8 hyperlink passthrough |
| Fixed alt+enter not inserting a newline in terminals using ESC-prefix alt encoding, and Ctrl+J not inserting a newline (regression in 2.1.100) | `keybindings/`, `hooks/useTextInput.ts` | key handler chunks | Key encoding dispatch fix |
| Fixed duplicate "Creating worktree" text in EnterWorktree/ExitWorktree tool display | `tools/EnterWorktreeTool/`, `tools/ExitWorktreeTool/` | worktree tool chunks | Single status emit |
| Fixed queued user prompts disappearing from focus mode | `hooks/useCommandQueue.ts`, focus chunks | queue chunks | Queue visible in focus view |
| Fixed one-shot scheduled tasks re-firing repeatedly when the file watcher missed the post-fire cleanup | `utils/cronScheduler.ts`, `utils/cronTasksLock.ts` | scheduler chunks | Cleanup on completion (idempotent) |
| Fixed inbound channel notifications being silently dropped after the first message for Team/Enterprise users | `hooks/useInboxPoller.ts`, team chunks | inbox chunks | Reset processed-state per-message |
| Fixed marketplace plugins with `package.json` and lockfile not having dependencies installed automatically | `utils/plugins/` | `chunks.157.mjs` | Run npm install on plugin update |
| Fixed marketplace auto-update leaving the official marketplace in a broken state when a plugin process holds files open | `utils/plugins/` | plugin update chunks | Atomic update via tmp dir + rename |
| Fixed "Resume this session with..." hint not printing on exit after `/resume`, `--worktree`, or `/branch` | `commands/exit/`, `entrypoints/` | exit hint chunks | Hint emit covers more exit paths |
| Fixed feedback survey shortcut keys firing when typed at the end of a longer prompt | `components/FeedbackSurvey/` | feedback chunks | Disable shortcuts when buffer non-empty |
| Fixed stdio MCP server emitting malformed (non-JSON) output hanging the session | `services/mcp/`, stdio transport | mcp stdio chunks | Detect non-JSON early; fail fast (later relaxed in 2.1.110) |
| Fixed MCP tools missing on the first turn of headless/remote-trigger sessions when MCP servers connect asynchronously | `services/mcp/`, headless | mcp + headless chunks | Wait for connect-pending before first turn |
| Fixed `/model` picker on AWS Bedrock in non-US regions persisting invalid `us.*` model IDs | `commands/model/`, AWS provider | model picker + Bedrock chunks | Defer persistence until profile discovery completes |
| Fixed 429 rate-limit errors showing a raw JSON dump instead of a clean message for API-key, Bedrock, and Vertex users | `services/rateLimitMessages.ts`, `utils/api.ts` | rate-limit chunks | Catch 429 JSON; render clean message |
| Fixed crash on resume when session contains malformed text blocks | `utils/conversationRecovery.ts` | resume chunks | Defensive block-shape check |
| Fixed `/help` dropping the tab bar, Shortcuts heading, and footer at short terminal heights | `components/HelpV2/` | help chunks | Layout reflow on small terminal |
| Fixed malformed keybinding entry values in `keybindings.json` being silently loaded instead of rejected with a clear error | `keybindings/`, `utils/settings/` | keybindings parser chunks | Zod validation surfaces parse errors |
| Fixed `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` in one project's settings permanently disabling usage metrics for all projects on the machine | `services/internalLogging.ts`, settings | logging chunks | Scope check per-project, not global |
| Fixed washed-out 16-color palette when using Ghostty, Kitty, Alacritty, WezTerm, foot, rio, or Contour over SSH/mosh | `utils/theme.ts`, color detection | theme chunks | Terminal-capability detection fallback |
| Fixed Bash tool suggesting `acceptEdits` permission mode when exiting plan mode would downgrade from a higher permission level | `utils/planModeV2.ts`, `tools/BashTool/` | plan mode chunks | Compare current vs suggested mode rank |

---

## v2.1.101

### bash / network / certs

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added `/team-onboarding` command to generate a teammate ramp-up guide | `commands/` (absent) | `chunks.190.mjs:195-210` (`jsY`) | Prompt-type slash command |
| Added OS CA certificate store trust by default | `utils/caCerts.ts`, `utils/caCertsConfig.ts`, `utils/mtls.ts` | `chunks.19.mjs:2150-2167` (`Mr5`/`NU7`) | Resolver merges OS store with bundled; opt-out via `CLAUDE_CODE_CERT_STORE=bundled` |
| `/ultraplan` and other remote-session features now auto-create a default cloud environment | `utils/ultraplan/`, `commands/ultraplan.tsx` | `chunks.180.mjs` (or ultraplan chunks), `chunks.196.mjs`, `chunks.200.mjs` | New `useDefaultEnvironment: true` flag in env setup |

### plan / focus / mcp

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Improved brief mode to retry once when Claude responds with plain text instead of a structured message | `commands/brief.ts`, `tools/BriefTool/` | brief tool chunks | Once-retry with structured-output enforcement |
| Improved focus mode: Claude now writes more self-contained summaries | `services/awaySummary.ts`, system prompt | focus + system-prompt chunks | System-prompt addition for focus mode |
| Improved tool-not-available errors | `tools/Tool.ts`, tool execution | tool-error chunks | Distinguish not-available vs not-found |
| Improved rate-limit retry messages to show which limit was hit and when it resets | `services/rateLimitMessages.ts` | rate-limit chunks | Parse retry-after + limit-id from response |
| Improved refusal error messages to include the API-provided explanation | `utils/api.ts`, error builders | error chunks | Pass-through API refusal text |
| Improved `claude -p --resume <name>` to accept session titles set via `/rename` or `--name` | `commands/resume/`, headless | resume chunks | Title -> session-id lookup |
| Improved settings resilience: an unrecognized hook event name in `settings.json` no longer causes the entire file to be ignored | `utils/settings/`, hooks schema | settings parser chunks | Reject only the bad entry, not the file |
| Improved plugin hooks from plugins force-enabled by managed settings to run when `allowManagedHooksOnly` is set | `utils/plugins/`, hooks | plugin hooks chunks | Trust managed-plugins under restricted hook mode |
| Improved `/plugin` and `claude plugin update` to show a warning when the marketplace could not be refreshed | `commands/plugin/` | plugin chunks | Warning emit on refresh failure |
| Improved plan mode to hide the "Refine with Ultraplan" option when the user's org or auth setup can't reach Claude Code on the web | `utils/planModeV2.ts`, ultraplan availability | plan mode + ultraplan chunks | Feature-gate based on auth |
| Improved beta tracing to honor `OTEL_LOG_USER_PROMPTS`, `OTEL_LOG_TOOL_DETAILS`, and `OTEL_LOG_TOOL_CONTENT` | `utils/telemetry/` | telemetry chunks | Per-attribute env opt-in |
| Improved SDK `query()` to clean up subprocess and temp files when consumers `break` from `for await` or use `await using` | `entrypoints/`, SDK | sdk chunks | Async-iterator cleanup using disposable pattern |

### fixes

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed a command injection vulnerability in the POSIX `which` fallback used by LSP binary detection | `utils/which.ts`, `services/lsp/` | which/LSP chunks | execFile (argv) instead of shell exec |
| Fixed a memory leak where long sessions retained dozens of historical copies of the message list in the virtual scroller | `components/VirtualMessageList.tsx` | virtual scroller chunks | Weak-ref / cap on history list |
| Fixed `--resume`/`--continue` losing conversation context on large sessions when the loader anchored on a dead-end branch | `utils/conversationRecovery.ts` | resume chunks | Anchor on live conversation branch |
| Fixed `--resume` chain recovery bridging into an unrelated subagent conversation | `utils/conversationRecovery.ts` | resume chunks | Subagent isolation check in chain rebuild |
| Fixed a crash on `--resume` when a persisted Edit/Write tool result was missing its `file_path` | `tools/FileEditTool/`, `tools/FileWriteTool/`, resume | resume + tool result chunks | Defensive field check on rehydrate |
| Fixed a hardcoded 5-minute request timeout | `utils/api.ts` | api chunks | Replace hard 5-min cap with `API_TIMEOUT_MS` env-driven setting |
| Fixed `permissions.deny` rules not overriding a PreToolUse hook's `permissionDecision: "ask"` | `hooks/`, `utils/permissions/` | `chunks.193.mjs`, permissions chunks | Deny rule wins over hook ask |
| Fixed `--setting-sources` without `user` causing background cleanup to ignore `cleanupPeriodDays` and delete conversation history older than 30 days | `utils/backgroundHousekeeping.ts`, settings sources | housekeeping chunks | Default-to-30 only when user source missing entirely |
| Fixed Bedrock SigV4 authentication failing with 403 when `ANTHROPIC_AUTH_TOKEN`, `apiKeyHelper`, or `ANTHROPIC_CUSTOM_HEADERS` set an Authorization header | `utils/aws.ts`, `utils/auth.ts` | aws auth chunks | Strip non-SigV4 Authorization header |
| Fixed `claude -w <name>` failing with "already exists" after a previous session's worktree cleanup left a stale directory | `commands/branch/`, `utils/worktree.ts` | worktree chunks | Cleanup stale dir before creation |
| Fixed subagents not inheriting MCP tools from dynamically-injected servers | `services/mcp/`, subagent | mcp + subagent chunks | Pass dynamic MCP server list to subagent |
| Fixed sub-agents running in isolated worktrees being denied Read/Edit access to files inside their own worktree | `utils/permissions/`, worktree | permission + worktree chunks | Worktree path resolution in permission check |
| Fixed sandboxed Bash commands failing with `mktemp: No such file or directory` after a fresh boot | `utils/sandbox/` | sandbox chunks | Ensure /tmp exists in sandbox |
| Fixed `claude mcp serve` tool calls failing with "Tool execution failed" in MCP clients that validate `outputSchema` | `services/mcp/`, mcp serve | mcp serve chunks | Conformant outputSchema emission |
| Fixed `RemoteTrigger` tool's `run` action sending an empty body | `tools/RemoteTriggerTool/` | RemoteTrigger chunks | Include body in run action POST |
| Fixed several `/resume` picker issues | `commands/resume/`, resume picker | resume chunks | Multiple narrow fixes per change |
| Fixed Grep tool ENOENT when the embedded ripgrep binary path becomes stale | `tools/GrepTool/`, `utils/ripgrep.ts` | grep tool chunks | Re-detect rg binary; fall back to system rg |
| Fixed `/btw` writing a copy of the entire conversation to disk on every use | `commands/btw/` | btw chunks | Diff-only persistence |
| Fixed `/context` Free space and Messages breakdown disagreeing with the header percentage | `components/ContextVisualization.tsx`, `commands/context/` | context chunks | Single source of token totals |
| Fixed several plugin issues | `utils/plugins/`, plugin loader | plugin chunks | Multiple narrow fixes (frontmatter, ENAMETOOLONG, Discover view, cache, skill frontmatter fields) |
| Fixed the `/mcp` menu offering OAuth-specific actions for MCP servers configured with `headersHelper` | `commands/mcp/`, mcp menu | mcp menu chunks | Differentiate auth method when showing actions |
| Fixed `ctrl+]`, `ctrl+\`, and `ctrl+^` keybindings not firing in terminals that send raw C0 control bytes | `keybindings/`, key encoder | key chunks | Recognize raw C0 control bytes |
| Fixed `/login` OAuth URL rendering with padding that prevented clean mouse selection | `commands/login/`, oauth UI | login chunks | Strip padding around URL |
| Fixed rendering issues: flicker in non-fullscreen mode, scrollback wiped, mouse-scroll escape sequences | `ink.ts`, terminal render | render chunks | Multiple narrow render fixes |
| Fixed crash when `settings.json` env values are numbers instead of strings | `utils/settings/`, schema | settings parser chunks | Coerce env values to string |
| Fixed in-app settings writes not refreshing the in-memory snapshot | `utils/settings/`, `hooks/useSettings.ts` | settings hook chunks | Invalidate snapshot after write |
| Fixed custom keybindings (`~/.claude/keybindings.json`) not loading on Bedrock, Vertex, and other third-party providers | `keybindings/`, provider init | keybindings + provider chunks | Load keybindings before provider init |
| Fixed `claude --continue -p` not correctly continuing sessions created by `-p` or the SDK | `commands/resume/`, headless | resume chunks | Headless session-type detection |
| Fixed several Remote Control issues | `utils/remote/`, remote control | remote control chunks | Multiple narrow fixes (worktrees, disconnect, brief mode, SSH org-uuid) |
| Fixed `/insights` sometimes omitting the report file link from its response | `commands/insights.ts` | insights chunks | Always include link in response |
| [VSCode] Fixed the file attachment below the chat input not clearing when the last editor tab is closed | IDE integration | ide-vsc chunks | VS Code extension fix |

---

## v2.1.98

### tools / sandbox / vertex

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added interactive Google Vertex AI setup wizard accessible from the login screen | `commands/login/`, setup screens | `chunks.214.mjs` (Vertex wizard JSX) | New onboarding JSX flow |
| Added `CLAUDE_CODE_PERFORCE_MODE` env var | `tools/FileEditTool/`, `tools/FileWriteTool/`, `tools/NotebookEditTool/` | `chunks.16.mjs:3070-3076` (`mY1`), `chunks.16.mjs:3320` (`gf6`, `Ff6`) | Edit/Write/NotebookEdit gate; readonly-aware error with `p4 edit` hint |
| Added Monitor tool for streaming events from background scripts | `tools/` (absent) | `chunks.101.mjs:1288-1339` (`cI4`/`lI4`) | New deferred tool; line-based stdout streaming |
| Added subprocess sandboxing with PID namespace isolation on Linux when `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` is set | `utils/sandbox/`, `utils/subprocessEnv.ts` | sandbox chunks | New unshare-based sandboxing path |
| Added `CLAUDE_CODE_SCRIPT_CAPS` env var to limit per-session script invocations | `utils/sandbox/`, script execution | sandbox chunks | Counter + cap |
| Added `--exclude-dynamic-system-prompt-sections` flag to print mode | `entrypoints/`, system prompt | sysprompt + headless chunks | New flag; cross-user prompt-cache friendly |
| Added `workspace.git_worktree` to the status line JSON input | `components/StatusLine.tsx`, `utils/getWorktreePaths.ts` | statusline chunks | New field in status-line JSON |
| Added W3C `TRACEPARENT` env var to Bash tool subprocesses when OTEL tracing is enabled | `tools/BashTool/`, `utils/telemetry/` | `chunks.100.mjs`, `chunks.144.mjs` | Subprocess env injection for OTEL parenting |
| LSP: Claude Code now identifies itself to language servers via `clientInfo` | `services/lsp/` | LSP chunks | LSP initialize-request enrichment |

### bash / permissions security

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed a Bash tool permission bypass where a backslash-escaped flag could be auto-allowed | `tools/BashTool/`, `utils/permissions/` | bash perm chunks (`chunks.83.mjs`, `chunks.149.mjs`) | Classifier normalizes escaped flags before matching |
| Fixed compound Bash commands bypassing forced permission prompts | `tools/BashTool/`, permission classifier | bash perm chunks | Apply force-prompt to all segments |
| Fixed read-only commands with env-var prefixes not prompting unless the var is known-safe | `tools/BashTool/`, env-var classifier | bash perm chunks | Allowlist of safe env-var prefixes |
| Fixed redirects to `/dev/tcp/...` or `/dev/udp/...` not prompting | `tools/BashTool/` | bash perm chunks | New deny-by-default rule for /dev/{tcp,udp} |
| Fixed stalled streaming responses timing out | `utils/api.ts` | stream chunks | (Precursor to 2.1.105 stall handling) |
| Fixed 429 retries burning all attempts in ~13s | `utils/api.ts` | api retry chunks | Apply exponential backoff as minimum |
| Fixed MCP OAuth `oauth.authServerMetadataUrl` config override not being honored on token refresh after restart | `services/mcp/oauth/` | mcp oauth chunks | Persist override across token refresh |
| Fixed capital letters being dropped to lowercase on xterm and VS Code integrated terminal when the kitty keyboard protocol is active | `keybindings/`, key encoder | key chunks | Kitty protocol case-preservation |
| Fixed macOS text replacements deleting the trigger word instead of inserting the substitution | `keybindings/`, IME | key chunks | IME interception fix |
| Fixed `--dangerously-skip-permissions` being silently downgraded to accept-edits mode after approving a write to a protected path via Bash | `utils/permissions/`, planMode | permission chunks | Preserve mode after protected-path approval |
| Fixed managed-settings allow rules remaining active after an admin removed them | `services/remoteManagedSettings/`, permissions | settings chunks | Re-evaluate allow rules on remote refresh |
| Fixed `permissions.additionalDirectories` changes not applying mid-session | `utils/permissions/`, settings | permission chunks | Hot-reload additionalDirectories |
| Fixed removing a directory from `additionalDirectories` revoking access to the same directory passed via `--add-dir` | `utils/permissions/`, cliArgs | permission chunks | Treat --add-dir as separate source |
| Fixed `Bash(cmd:*)` and `Bash(git commit *)` wildcard permission rules failing to match commands with extra spaces or tabs | `utils/permissions/`, rule matcher | permission chunks | Tokenize on whitespace not exact-char |
| Fixed `Bash(...)` deny rules being downgraded to a prompt for piped commands that mix `cd` with other segments | `utils/permissions/` | permission chunks | All-segment deny check |
| Fixed false Bash permission prompts for `cut -d /`, `paste -d /`, etc. | `utils/permissions/` | bash perm chunks | Argument-position-aware classifier |
| Fixed permission rules with names matching JavaScript prototype properties (e.g. `toString`) | `utils/permissions/`, settings | permission chunks | Use Map/Object.create(null) for rule store |
| Fixed agent team members not inheriting the leader's permission mode when using `--dangerously-skip-permissions` | `coordinator/`, subagent | team chunks (`chunks.137.mjs`, etc.) | Permission mode propagation |

### ui / fixes / improvements

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed a crash in fullscreen mode when hovering over MCP tool results | `ink.ts`, mcp result render | render chunks | Hover handler null-check |
| Fixed copying wrapped URLs in fullscreen mode inserting spaces at line breaks | `hooks/useCopyOnSelect.ts` | copy chunks | Join wrapped URL segments before copy |
| Fixed file-edit diffs disappearing from the UI on `--resume` when the edited file was larger than 10KB | `tools/FileEditTool/`, resume | diff chunks | Restore diff for large files |
| Fixed several `/resume` picker issues | `commands/resume/`, resume picker | resume chunks | Multiple narrow fixes |
| Fixed `/export` not honoring absolute paths and `~`, and silently rewriting user-supplied extensions to `.txt` | `commands/export/` | export chunks | Preserve user-provided path and extension |
| Fixed `/effort max` being denied for unknown or future model IDs | `commands/effort/`, `utils/effort.ts` | `chunks.80.mjs` | Permissive fallback for unrecognized model |
| Fixed slash command picker breaking when a plugin's frontmatter `name` is a YAML boolean keyword | `utils/slashCommandParsing.ts`, `utils/frontmatterParser.ts` | parser chunks | Always parse-string for `name` field |
| Fixed rate-limit upsell text being hidden after message remounts | `components/Messages.tsx`, rate-limit notice | notice chunks | Persist visibility across remount |
| Fixed MCP tools with `_meta["anthropic/maxResultSizeChars"]` not bypassing the token-based persist layer | `services/mcp/`, `utils/mcpOutputStorage.ts` | `chunks.162.mjs` (`Zz7`/`M98`) | _meta annotation overrides persist gate |
| Fixed voice mode leaking dozens of space characters into the input when re-holding the push-to-talk key | `services/voice.ts`, `utils/voice` | voice chunks | Drop input while previous transcript pending |
| Fixed `DISABLE_AUTOUPDATER` not fully suppressing the npm registry version check and symlink modification | `utils/autoUpdater.ts` | auto-updater chunks | Honor flag in all check paths |
| Fixed a memory leak where Remote Control permission handler entries were retained for the lifetime of the session | `utils/remote/`, permissions | remote chunks | Remove handler on permission resolved |
| Fixed background subagents that fail with an error not reporting partial progress to the parent agent | `coordinator/`, subagent | subagent chunks | Emit partial progress on failure |
| Fixed prompt-type Stop/SubagentStop hooks failing on long sessions, and hook evaluator API errors showing "JSON validation failed" instead of the real message | `hooks/`, classifier | hook chunks | Pass real error through |
| Fixed feedback survey rendering when dismissed | `components/FeedbackSurvey/` | feedback chunks | Render-when-dismissed regression fix |
| Fixed Bash `grep -f FILE` / `rg -f FILE` not prompting when reading a pattern file outside the working directory | `utils/permissions/`, bash classifier | bash perm chunks | Detect -f file arg outside cwd |
| Fixed stale subagent worktree cleanup removing worktrees that contain untracked files | `utils/worktree.ts`, `utils/backgroundHousekeeping.ts` | worktree cleanup chunks | Check git-status before cleanup |
| Fixed `sandbox.network.allowMachLookup` not taking effect on macOS | `utils/sandbox/` | sandbox chunks | macOS sandbox-exec rule generation |
| Improved `/resume` filter hint labels and added project/worktree/branch names | `commands/resume/`, picker | resume picker chunks | Filter label format update |
| Improved footer indicators to stay on the mode-indicator row | `components/StatusLine.tsx`, `components/StatusNotices.tsx` | statusline chunks | Layout fix: mode-row anchoring |
| Improved `/agents` with a tabbed layout | `commands/agents/`, `components/agents/` | agents chunks | Tab Running/Library + Run/View actions |
| Improved `/reload-plugins` to pick up plugin-provided skills without requiring a restart | `commands/reload-plugins/`, plugin loader | plugin chunks | Hot-reload skills on plugin reload |
| Improved Accept Edits mode to auto-approve filesystem commands prefixed with safe env vars or process wrappers | `utils/permissions/`, planMode | permission chunks | Wrapper-prefix recognition (`LANG=C rm`, `timeout 5 mkdir`) |
| Improved Vim mode: `j`/`k` in NORMAL mode now navigate history and select the footer pill | `vim/`, `components/VimTextInput.tsx` | vim chunks | New normal-mode key bindings |
| Improved hook errors in the transcript to include the first line of stderr | `hooks/`, error builder | hook chunks | Stderr-line inclusion in error message |
| Improved OTEL tracing: interaction spans now correctly wrap full turns under concurrent SDK calls | `utils/telemetry/`, spans | telemetry chunks | Span lifecycle fix |
| Improved transcript entries to carry final token usage instead of streaming placeholders | `utils/messages`, transcript | transcript chunks | Replace stream-placeholder with final at turn end |
| Updated the `/claude-api` skill to cover Managed Agents alongside Claude API | `skills/bundled/`, `skills/bundled/claude-api` | skill chunks | Skill prompt rewrite |
| [VSCode] Fixed false-positive "requires git-bash" error on Windows when `CLAUDE_CODE_GIT_BASH_PATH` is set or Git is installed at a default location | IDE integration | ide-vsc chunks | Skip git-bash check when explicit path set |
| Fixed `CLAUDE_CODE_MAX_CONTEXT_TOKENS` to honor `DISABLE_COMPACT` when it is set | `services/compact/`, `utils/api.ts` | compact chunks (`chunks.107.mjs`/`chunks.159.mjs`) | Skip MaxContextTokens-based compaction when disabled |
| Dropped `/compact` hints when `DISABLE_COMPACT` is set | `commands/compact/`, banner | compact chunks | Suppress hint emit |

---

## v2.1.97

### features

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added focus view toggle (`Ctrl+O`) in `NO_FLICKER` mode showing prompt, one-line tool summary with edit diffstats, and final response | `components/VirtualMessageList.tsx`, focus | focus + transcript chunks | Initial Ctrl+O focus implementation (refined in 2.1.110) |
| Added `refreshInterval` status line setting | `components/StatusLine.tsx`, settings | statusline chunks | New setting in `statusLine` schema |
| Added `workspace.git_worktree` to the status line JSON input | `components/StatusLine.tsx` | statusline chunks | Same as v2.1.98 (re-shipped) |
| Added `● N running` indicator in `/agents` next to agent types with live subagent instances | `commands/agents/`, `components/agents/` | agents chunks | Counter rendered next to agent type |
| Added syntax highlighting for Cedar policy files (`.cedar`, `.cedarpolicy`) | `utils/cliHighlight.ts` | `chunks.102.mjs` (`xZz` grammar) | New grammar definition |

### bash / permissions (carryover from v2.1.98 work)

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed `--dangerously-skip-permissions` being silently downgraded to accept-edits mode after approving a write to a protected path | `utils/permissions/` | permission chunks | Preserve mode after protected-path approval |
| Fixed and hardened Bash tool permissions, tightening checks around env-var prefixes and network redirects | `tools/BashTool/`, permissions | bash perm chunks | Multi-pass classifier hardening |
| Fixed permission rules with names matching JavaScript prototype properties | `utils/permissions/` | permission chunks | Object.create(null) for rule store |
| Fixed managed-settings allow rules remaining active after an admin removed them until process restart | `services/remoteManagedSettings/` | settings chunks | Re-evaluate allow rules on remote refresh |
| Fixed `permissions.additionalDirectories` changes in settings not applying mid-session | `utils/permissions/` | permission chunks | Hot-reload additionalDirectories |
| Fixed removing a directory from `settings.permissions.additionalDirectories` revoking access to the same directory passed via `--add-dir` | `utils/permissions/` | permission chunks | Treat --add-dir as separate source |

### mcp / api / network

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed MCP HTTP/SSE connections accumulating ~50 MB/hr of unreleased buffers when servers reconnect | `services/mcp/`, transports | mcp transport chunks | Buffer cleanup on reconnect |
| Fixed MCP OAuth `oauth.authServerMetadataUrl` not being honored on token refresh after restart | `services/mcp/oauth/` | mcp oauth chunks | Persist override |
| Fixed 429 retries burning all attempts in ~13 seconds when the server returns a small `Retry-After` | `utils/api.ts` | api retry chunks | Apply exponential backoff as minimum |
| Fixed rate-limit upgrade options disappearing after context compaction | `components/Messages.tsx`, rate-limit notice | notice chunks | Persist notice across compact |

### resume / no-flicker fixes

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed several `/resume` picker issues | `commands/resume/`, picker | resume chunks | Multiple narrow fixes |
| Fixed file-edit diffs disappearing on `--resume` when the edited file was larger than 10KB | `tools/FileEditTool/`, resume | diff chunks | Restore diff for large files |
| Fixed `--resume` cache misses and lost mid-turn input from attachment messages not being saved | `utils/conversationRecovery.ts`, `utils/attachments.ts` | resume + attachment chunks | Persist attachment messages |
| Fixed messages typed while Claude is working not being persisted to the transcript | `hooks/useCommandQueue.ts`, transcript | queue + transcript chunks | Persist queued message immediately |
| Fixed prompt-type `Stop`/`SubagentStop` hooks failing on long sessions | `hooks/` | hook chunks | Truncate transcript before classifier |
| Fixed subagents with worktree isolation or `cwd:` override leaking their working directory back to the parent session's Bash tool | `coordinator/`, subagent | subagent chunks (`chunks.155.mjs`) | Scope cwd to subagent |
| Fixed compaction writing duplicate multi-MB subagent transcript files on prompt-too-long retries | `services/compact/`, subagent transcript | compact chunks | Dedupe writes on retry |
| Fixed `claude plugin update` reporting "already at the latest version" for git-based marketplace plugins when the remote had newer commits | `utils/plugins/` | plugin chunks | Use git fetch + comparison |
| Fixed slash command picker breaking when a plugin's frontmatter `name` is a YAML boolean keyword | `utils/slashCommandParsing.ts`, frontmatter parser | parser chunks | Always parse-string for `name` field |
| Fixed copying wrapped URLs in `NO_FLICKER` mode inserting spaces at line breaks | `hooks/useCopyOnSelect.ts` | copy chunks | Join wrapped URL segments |
| Fixed scroll rendering artifacts in `NO_FLICKER` mode when running inside zellij | `ink.ts`, terminal capability | render chunks | zellij detection + non-sync fallback |
| Fixed a crash in `NO_FLICKER` mode when hovering over MCP tool results | `ink.ts`, mcp render | render chunks | Hover handler null-check |
| Fixed a `NO_FLICKER` mode memory leak where API retries left stale streaming state | `utils/api.ts`, streaming | stream chunks | Cleanup stream state on retry |
| Fixed slow mouse-wheel scrolling in `NO_FLICKER` mode on Windows Terminal | `ink.ts`, scroll handler | render chunks | Throttle scroll events |
| Fixed custom status line not displaying in `NO_FLICKER` mode on terminals shorter than 24 rows | `components/StatusLine.tsx` | statusline chunks | Show statusline regardless of height |
| Fixed Shift+Enter and Alt/Cmd+arrow shortcuts not working in Warp with `NO_FLICKER` mode | `keybindings/`, Warp detection | key chunks | Warp-specific key encoding |
| Fixed Korean/Japanese/Unicode text becoming garbled when copied in no-flicker mode on Windows | `hooks/useCopyOnSelect.ts` | copy chunks | Windows clipboard charset fix |
| Fixed Bedrock SigV4 authentication failing when `AWS_BEARER_TOKEN_BEDROCK` or `ANTHROPIC_BEDROCK_BASE_URL` are set to empty strings | `utils/aws.ts` | aws chunks | Treat empty-string env as unset |

### improvements

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Improved Accept Edits mode to auto-approve filesystem commands prefixed with safe env vars or process wrappers | `utils/permissions/`, planMode | permission chunks | (See v2.1.98 entry) |
| Improved auto mode and bypass-permissions mode to auto-approve sandbox network access prompts | `utils/sandbox/`, `utils/autoModeDenials.ts` | sandbox + auto-mode chunks | New auto-approve path for sandbox network |
| Improved sandbox: `sandbox.network.allowMachLookup` now takes effect on macOS | `utils/sandbox/` | sandbox chunks | macOS sandbox-exec rule generation |
| Improved image handling: pasted and attached images are now compressed to the same token budget as images read via the Read tool | `utils/imagePaste.ts`, `utils/imageResizer.ts` | image chunks | Unified token-budget compression |
| Improved slash command and `@`-mention completion to trigger after CJK sentence punctuation | `hooks/useTypeahead.tsx`, `utils/slashCommandParsing.ts` | suggestion chunks | Recognize CJK punctuation as word boundary |
| Improved Bridge sessions to show the local git repo, branch, and working directory on the claude.ai session card | `bridge/`, session metadata | bridge chunks | Extra fields in bridge session payload |
| Improved footer layout: indicators (Focus, notifications) now stay on the mode-indicator row | `components/StatusLine.tsx`, `components/StatusNotices.tsx` | statusline chunks | Layout fix |
| Improved context-low warning to show as a transient footer notification instead of a persistent row | `components/StatusNotices.tsx`, `components/TokenWarning.tsx` | notice chunks | Notice promoted to transient |
| Improved markdown blockquotes to show a continuous left bar across wrapped lines | `utils/markdown.ts`, markdown render | markdown chunks | Continuous-bar wrap rendering |
| Improved session transcript size by skipping empty hook entries and capping stored pre-edit file copies | `utils/sessionStorage.ts`, hooks | session storage chunks | Skip-empty + cap-snapshots |
| Improved transcript accuracy: per-block entries now carry the final token usage instead of the streaming placeholder | `utils/messages`, transcript | transcript chunks | (Same as v2.1.98 entry) |
| Improved Bash tool OTEL tracing: subprocesses now inherit a W3C `TRACEPARENT` env var | `tools/BashTool/`, `utils/telemetry/` | bash + telemetry chunks | (Same as v2.1.98 entry) |
| Updated `/claude-api` skill to cover Managed Agents alongside the Claude API | `skills/bundled/` | skill chunks | (Same as v2.1.98 entry) |

---

## v2.1.96

| Bullet excerpt | Theme | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|-------|----------------|----------------|---------------------|
| Fixed Bedrock requests failing with `403 "Authorization header is missing"` when using `AWS_BEARER_TOKEN_BEDROCK` or `CLAUDE_CODE_SKIP_BEDROCK_AUTH` (regression in 2.1.94) | bedrock | `utils/aws.ts`, `utils/auth.ts` | aws auth chunks | Hotfix: include Authorization header when not using SigV4 |

---

## v2.1.94

### model / effort

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added support for Amazon Bedrock powered by Mantle, set `CLAUDE_CODE_USE_MANTLE=1` | `utils/aws.ts`, `utils/api.ts` | `chunks.116.mjs:297-298` (`aNz`/`BR6`), `chunks.131.mjs`, `chunks.60.mjs` | New provider variant; env-var gated |
| Changed default effort level from medium to high for API-key, Bedrock/Vertex/Foundry, Team, and Enterprise users | `utils/effort.ts`, `utils/model/` | `chunks.80.mjs` (`IF1` getDefaultEffortForModel) | Resolver: tier-based default; Pro/Max on 4.6 stay at medium |

### mcp / plugins / hooks

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added compact `Slacked #channel` header with a clickable channel link for Slack MCP send-message tool calls | `services/mcp/`, mcp renderer | `chunks.161.mjs:777-797` (`FhK`, `iGY`, `lGY`) | Custom MCP tool renderer for Slack send-message |
| Added `keep-coding-instructions` frontmatter field support for plugin output styles | `outputStyles/`, plugin loader | `chunks.156.mjs:420`, `chunks.165.mjs:485-494` (`ht6`) | Schema field; preserves coding instructions when output style overrides |
| Added `hookSpecificOutput.sessionTitle` to `UserPromptSubmit` hooks for setting the session title | `hooks/`, `utils/sessionTitle.ts` | hook + sessionTitle chunks | New return-field in UserPromptSubmit hook |
| Plugin skills declared via `"skills": ["./"]` now use the skill's frontmatter `name` for the invocation name instead of the directory basename | `utils/plugins/`, skill loader | plugin chunks | Skill-name resolution: prefer frontmatter |

### fixes

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed agents appearing stuck after a 429 rate-limit response with a long Retry-After header | `utils/api.ts`, agent retry | agent + api chunks | Surface error immediately on long Retry-After |
| Fixed Console login on macOS silently failing with "Not logged in" when the login keychain is locked | `services/oauth/`, `utils/auth.ts`, doctor | auth + doctor chunks | Surface keychain-locked error; doctor diagnoses |
| Fixed plugin skill hooks defined in YAML frontmatter being silently ignored | `utils/plugins/`, plugin loader | plugin chunks | Read hooks from frontmatter |
| Fixed plugin hooks failing with "No such file or directory" when `CLAUDE_PLUGIN_ROOT` was not set | `utils/plugins/`, plugin env | plugin chunks | Default CLAUDE_PLUGIN_ROOT from plugin install dir |
| Fixed `${CLAUDE_PLUGIN_ROOT}` resolving to the marketplace source directory instead of the installed cache for local-marketplace plugins on startup | `utils/plugins/` | plugin chunks | Resolve to installed cache |
| Fixed scrollback showing the same diff repeated and blank pages in long-running sessions | `ink.ts`, render | render chunks | Diff dedupe in scrollback |
| Fixed multiline user prompts in the transcript indenting wrapped lines under the `❯` caret instead of under the text | `components/Messages.tsx` | message render chunks | Wrap-line indent fix |
| Fixed Shift+Space inserting the literal word "space" instead of a space character in search inputs | `keybindings/`, key handler | key chunks | Key encoding fix |
| Fixed hyperlinks opening two browser tabs when clicked inside tmux running in an xterm.js-based terminal | `utils/hyperlink.ts` | hyperlink chunks | Single-click dedupe |
| Fixed an alt-screen rendering bug where content height changes mid-scroll could leave compounding ghost lines | `ink.ts`, scroll handler | render chunks | Reset on height change |
| Fixed `FORCE_HYPERLINK` environment variable being ignored when set via `settings.json` `env` | `utils/hyperlink.ts`, settings env | hyperlink chunks | Read env from settings.env |
| Fixed native terminal cursor not tracking the selected tab in dialogs | `components/TagTabs.tsx`, render | tabs chunks | Update cursor position on tab change |
| Fixed Bedrock invocation of Sonnet 3.5 v2 by using the `us.` inference profile ID | `utils/aws.ts`, model | aws chunks | Map Sonnet 3.5 v2 to `us.` profile |
| Fixed SDK/print mode not preserving the partial assistant response in conversation history when interrupted mid-stream | `entrypoints/`, headless | sdk chunks | Persist partial response on interrupt |
| Improved `--resume` to resume sessions from other worktrees of the same repo directly | `commands/resume/`, `utils/worktree.ts` | resume + worktree chunks | Same-repo resume traversal |
| Fixed CJK and other multibyte text being corrupted with U+FFFD in stream-json input/output when chunk boundaries split a UTF-8 sequence | `entrypoints/`, stream-json | sdk + streaming chunks | UTF-8 byte-stream buffering |
| [VSCode] Reduced cold-open subprocess work on starting a session | IDE integration | ide-vsc chunks | Defer optional subprocesses |
| [VSCode] Fixed dropdown menus selecting the wrong item when the mouse was over the list while typing or using arrow keys | IDE integration | ide-vsc chunks | Disable mouse-hover while typing |
| [VSCode] Added a warning banner when `settings.json` files fail to parse | IDE integration | ide-vsc chunks | Parse-error banner |

---

## v2.1.92

### settings / permissions / providers

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added `forceRemoteSettingsRefresh` policy setting | `services/remoteManagedSettings/`, settings schema | `chunks.19.mjs` (settings schema) | New schema field; fail-closed when fetch fails |
| Added interactive Bedrock setup wizard | `commands/login/`, setup screens | Bedrock wizard chunks (around `chunks.214.mjs`) | New JSX onboarding flow |
| Added per-model and cache-hit breakdown to `/cost` for subscription users | `commands/cost/`, `utils/billing.ts`, `cost-tracker.ts` | cost chunks | New breakdown rendering |
| `/release-notes` is now an interactive version picker | `commands/release-notes/`, `utils/releaseNotes.ts` | `chunks.180.mjs` (`pFY`), `chunks.181.mjs`, `chunks.73.mjs` | Local-JSX command (was static text) |
| Remote Control session names now use your hostname as the default prefix | `utils/remote/`, session naming | remote chunks | Default-prefix computation from hostname |
| Pro users now see a footer hint when returning to a session after the prompt cache has expired | `utils/api.ts`, cache + footer | cache + footer chunks | Hint emission when cache miss expected |

### fixes

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed subagent spawning permanently failing with "Could not determine pane count" after tmux windows are killed or renumbered | `utils/tmuxSocket.ts`, subagent spawn | tmux + subagent chunks | Retry pane count read |
| Fixed prompt-type Stop hooks incorrectly failing when the small fast model returns `ok:false`, and restored `preventContinuation:true` semantics for non-Stop prompt-type hooks | `hooks/`, classifier | hook chunks | Distinct semantics per hook event |
| Fixed tool input validation failures when streaming emits array/object fields as JSON-encoded strings | `tools/Tool.ts`, stream | tool validation chunks | Coerce stringified JSON to native |
| Fixed an API 400 error that could occur when extended thinking produced a whitespace-only text block alongside real content | `utils/api.ts`, thinking | api chunks | Strip whitespace-only block before send |
| Fixed accidental feedback survey submissions from auto-pilot keypresses and consecutive-prompt digit collisions | `components/FeedbackSurvey/` | feedback chunks | Debounce key handler |
| Fixed misleading "esc to interrupt" hint appearing alongside "esc to clear" when a text selection exists in fullscreen mode during processing | `components/StatusLine.tsx`, hints | statusline chunks | Hint-state selection awareness |
| Fixed Homebrew install update prompts to use the cask's release channel | `utils/autoUpdater.ts`, install | updater chunks | Channel-aware update messaging |
| Fixed `ctrl+e` jumping to the end of the next line when already at end of line in multiline prompts | `keybindings/`, text input | key chunks | EOL-detection in cursor mover |
| Fixed an issue where the same message could appear at two positions when scrolling up in fullscreen mode (iTerm2, Ghostty, and other terminals with DEC 2026 support) | `ink.ts`, scroll | render chunks | Dedup on scroll-up |
| Fixed idle-return "/clear to save X tokens" hint showing cumulative session tokens instead of current context size | `hooks/useAwaySummary.ts`, context | idle return chunks | Use current ctx size for hint |
| Fixed plugin MCP servers stuck "connecting" on session start when they duplicate a claude.ai connector that is unauthenticated | `services/mcp/`, plugin | mcp + plugin chunks | Detect duplicate and dedupe |
| Improved Write tool diff computation speed for large files (60% faster on files with tabs/`&`/`$`) | `utils/diff.ts`, `tools/FileWriteTool/` | diff chunks | Diff algorithm optimization |
| Removed `/tag` command | `commands/tag/` | (removed) | Command removed |
| Removed `/vim` command | `commands/vim/` | (removed) | Command removed; vim mode toggled via `/config` |
| Linux sandbox now ships the `apply-seccomp` helper in both npm and native builds | `utils/sandbox/`, native | sandbox chunks | Add helper to installer |

---

## v2.1.91

### mcp / plugins / skills

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added MCP tool result persistence override via `_meta["anthropic/maxResultSizeChars"]` annotation | `services/mcp/`, `utils/mcpOutputStorage.ts` | `chunks.162.mjs:578-617` (`Zz7`/`M98`), `chunks.83.mjs` (`Vg1=500000`) | New _meta annotation; hard cap 500K |
| Added `disableSkillShellExecution` setting | settings schema, skill loader | `chunks.19.mjs` (schema) | New setting; disables `!command` inline shell |
| Added support for multi-line prompts in `claude-cli://open?q=` deep links | `utils/deepLink/`, `utils/desktopDeepLink.ts` | deepLink chunks | Decode `%0A` in query string |
| Plugins can now ship executables under `bin/` and invoke them as bare commands from the Bash tool | `utils/plugins/`, plugin loader | plugin chunks | Resolve PATH addition for plugin bin/ |

### fixes / improvements

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed transcript chain breaks on `--resume` that could lose conversation history when async transcript writes fail silently | `utils/conversationRecovery.ts`, `utils/sessionStorage.ts` | resume chunks | Catch async write errors |
| Fixed `cmd+delete` not deleting to start of line on iTerm2, kitty, WezTerm, Ghostty, and Windows Terminal | `keybindings/`, key handler | key chunks | Recognize cmd+delete sequence per-terminal |
| Fixed plan mode in remote sessions losing track of the plan file after a container restart | `utils/planModeV2.ts`, remote | plan mode + remote chunks | Persist plan-file id across restart |
| Fixed JSON schema validation for `permissions.defaultMode: "auto"` in settings.json | `utils/permissions/`, settings | schema chunks | Add `auto` to enum |
| Fixed Windows version cleanup not protecting the active version's rollback copy | `utils/autoUpdater.ts`, Windows | updater chunks | Skip active-version rollback in cleanup |
| `/feedback` now explains why it's unavailable instead of disappearing from the slash menu | `commands/feedback/` | feedback command chunks | Render unavailable-with-reason |
| Improved `/claude-api` skill guidance for agent design patterns | `skills/bundled/claude-api` | skill chunks | Skill prompt rewrite |
| Improved performance: faster `stripAnsi` on Bun by routing through `Bun.stripANSI` | `utils/stringUtils.ts` or ansi util | string-utils chunks | Runtime-dispatch on Bun |
| Edit tool now uses shorter `old_string` anchors | `tools/FileEditTool/`, system prompt | Edit tool chunks | Prompt-engineering change in tool description |

---

## v2.1.90

### features

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added `/powerup` - interactive lessons teaching Claude Code features with animated demos | `commands/` (absent) | `chunks.180.mjs:961, 1396-1403` (`KQK`, `qQK`, `Xg`) | New local-JSX command with lesson state |
| Added `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE` env var | `utils/plugins/` | plugin chunks | Skip cache wipe on git pull fail |
| Added `.husky` to protected directories (acceptEdits mode) | `utils/permissions/`, planMode | permission chunks | Add to protected-dirs list |

### fixes / hardening

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed an infinite loop where the rate-limit options dialog would repeatedly auto-open after hitting your usage limit | `components/RateLimitOptions`, rate-limit | rate-limit chunks | Dedup auto-open trigger |
| Fixed `--resume` causing a full prompt-cache miss on the first request for users with deferred tools, MCP servers, or custom agents (regression since v2.1.69) | `utils/api.ts`, prompt cache | api + cache chunks | Order tool/MCP/agent before cache-key |
| Fixed `Edit`/`Write` failing with "File content has changed" when a PostToolUse format-on-save hook rewrites the file between consecutive edits | `tools/FileEditTool/`, `tools/FileWriteTool/`, `utils/fileStateCache.ts` | `chunks.16.mjs` (file cache) | Refresh file state cache after format hook |
| Fixed `PreToolUse` hooks that emit JSON to stdout and exit with code 2 not correctly blocking the tool call | `hooks/`, hook evaluator | `chunks.193.mjs` | Treat exit-2+JSON as block |
| Fixed collapsed search/read summary badge appearing multiple times in fullscreen scrollback when a CLAUDE.md file auto-loads during a tool call | `utils/collapseReadSearch.ts`, `utils/claudemd.ts` | collapse chunks | Dedup on autoload |
| Fixed auto mode not respecting explicit user boundaries | `utils/autoModeDenials.ts`, system prompt | auto mode chunks | Inject user boundaries into auto-mode classifier prompt |
| Fixed click-to-expand hover text being nearly invisible on light terminal themes | `utils/theme.ts`, hyperlink | theme chunks | Theme-aware hover color |
| Fixed UI crash when malformed tool input reached the permission dialog | `components/permissions/` | permission dialog chunks | Defensive render on malformed input |
| Fixed headers disappearing when scrolling `/model`, `/config`, and other selection screens | `components/Settings/`, selection screens | settings chunks | Sticky header rendering |
| Hardened PowerShell tool permission checks: trailing `&` background job bypass, `-ErrorAction Break` debugger hang, archive-extraction TOCTOU, and parse-fail fallback deny-rule degradation | `tools/PowerShellTool/`, permissions | powershell chunks | Multi-issue hardening |
| Improved performance: eliminated per-turn JSON.stringify of MCP tool schemas on cache-key lookup | `utils/toolSchemaCache.ts`, prompt cache | toolSchemaCache chunks | Cache serialized schemas |
| Improved performance: SSE transport now handles large streamed frames in linear time | `services/mcp/`, sse transport | sse chunks | Linear-time frame parser |
| Improved performance: SDK sessions with long conversations no longer slow down quadratically on transcript writes | `entrypoints/`, sdk transcript | sdk chunks | Append-only / incremental writes |
| Improved `/resume` all-projects view to load project sessions in parallel | `commands/resume/`, picker | resume picker chunks | Promise.all over project sessions |
| Changed `--resume` picker to no longer show sessions created by `claude -p` or SDK invocations | `commands/resume/`, picker | resume picker chunks | Filter out headless sessions |
| Removed `Get-DnsClientCache` and `ipconfig /displaydns` from auto-allow (DNS cache privacy) | `utils/permissions/`, powershell allowlist | permission chunks | Remove from auto-allow list |

---

## v2.1.89

### hooks (defer, PermissionDenied)

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added `"defer"` permission decision to `PreToolUse` hooks | `hooks/`, `utils/permissions/`, `utils/classifierApprovalsHook.ts` | `chunks.193.mjs:34-130` | New 4th enum value in `permissionBehaviorSchema`; switch widened; `useDeferredHookMessages.ts` hook path |
| Added `PermissionDenied` hook that fires after auto mode classifier denials | `hooks/`, `utils/autoModeDenials.ts`, `utils/classifierApprovalsHook.ts` | `chunks.153.mjs` (PermissionDenied wiring) | Was feature-flagged (`TRANSCRIPT_CLASSIFIER`) in 2.1.88; graduates to default; message simplified |

### tui (NO_FLICKER intro)

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added `CLAUDE_CODE_NO_FLICKER=1` environment variable to opt into flicker-free alt-screen rendering with virtualized scrollback | `ink.ts`, `utils/fullscreen.ts`, render | `chunks.65.mjs:1491-1505` (`lq` isFullscreenMode) | New env-var path in renderer cascade |

### subagent / mcp

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Added named subagents to `@` mention typeahead suggestions | `hooks/useTypeahead.tsx`, `hooks/unifiedSuggestions.ts` | typeahead chunks | Include subagent names in suggestion list |
| Added `MCP_CONNECTION_NONBLOCKING=true` for `-p` mode | `services/mcp/`, headless | mcp + headless chunks | Skip MCP connection wait |
| Bounded `--mcp-config` server connections at 5s | `services/mcp/`, `utils/cliArgs.ts` | mcp connection chunks | 5s timeout cap |

### auto mode / permissions

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Auto mode: denied commands now show a notification and appear in `/permissions` -> Recent tab where you can retry with `r` | `utils/autoModeDenials.ts`, `commands/permissions/` | auto mode + permissions chunks | New notification path + Recent tab |
| Fixed `Edit(//path/**)` and `Read(//path/**)` allow rules to check the resolved symlink target | `utils/permissions/`, path resolution | permission chunks | Resolve symlink before rule check |

### voice

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed voice push-to-talk not activating for some modifier-combo bindings | `services/voice.ts`, voice key handler | voice chunks | Modifier-combo dispatch fix |
| Fixed voice mode on Windows failing with "WebSocket upgrade rejected with HTTP 101" | `services/voice.ts`, voice stream | voice chunks | Windows WS upgrade handling |
| Fixed voice mode failing to request microphone permission on macOS Apple Silicon | `voice/voiceModeEnabled.ts`, `services/voice.ts` | voice chunks | macOS permission request fix |

### resume / edit / transcript

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed Edit/Write tools doubling CRLF on Windows and stripping Markdown hard line breaks | `tools/FileEditTool/`, `tools/FileWriteTool/`, `utils/file.ts` | `chunks.16.mjs` (`S16` writeFileWithEol) | EOL normalization fix |
| Fixed `StructuredOutput` schema cache bug causing ~50% failure rate when using multiple schemas | `tools/`, structured output | structured output chunks | Cache-key includes schema id |
| Fixed memory leak where large JSON inputs were retained as LRU cache keys | `utils/`, cache | cache chunks | Hash large inputs as cache keys |
| Fixed a crash when removing a message from very large session files (over 50MB) | `utils/sessionStorage.ts` | session storage chunks | Stream-based message removal |
| Fixed LSP server zombie state after crash | `services/lsp/`, lsp client | lsp chunks | Auto-restart on next request |
| Fixed prompt history entries containing CJK or emoji being silently dropped when they fall on a 4KB boundary in `~/.claude/history.jsonl` | `utils/`, history persistence | `chunks.75.mjs` | UTF-8 boundary buffering |
| Fixed `/stats` undercounting tokens by excluding subagent usage | `commands/stats/`, `utils/stats.ts`, `utils/statsCache.ts` | stats chunks | Include subagent in stats |
| Fixed `/stats` losing historical data beyond 30 days when the stats cache format changes | `utils/statsCache.ts` | stats chunks | Migration logic on format change |
| Fixed `-p --resume` hangs when the deferred tool input exceeds 64KB or no deferred marker exists | `commands/resume/`, `hooks/useDeferredHookMessages.ts` | resume + defer chunks | Handle >64KB and missing marker |
| Fixed `-p --continue` not resuming deferred tools | `commands/resume/`, `--continue` | resume chunks | Apply defer path to --continue |
| Fixed `claude-cli://` deep links not opening on macOS | `utils/deepLink/`, macOS bridge | deepLink chunks | macOS URL handler registration |
| Fixed MCP tool errors truncating to only the first content block when the server returns multi-element error content | `services/mcp/`, mcp output | mcp output chunks | Iterate all error content blocks |
| Fixed skill reminders and other system context being dropped when sending messages with images via the SDK | `entrypoints/`, sdk + system context | sdk chunks | Preserve system context with images |
| Fixed PreToolUse/PostToolUse hooks to receive `file_path` as an absolute path for Write/Edit/Read tools | `hooks/`, tool exec | hook chunks | Resolve to absolute path |

### compact (circuit breakers)

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed autocompact thrash loop - now detects when context refills to the limit immediately after compacting three times in a row and stops with an actionable error | `services/compact/autoCompact.ts`, `services/compact/microCompact.ts` | `chunks.159.mjs:1379-1428` (`QkK`, `wLK=3`, `jLK=3`, `a_7=3`) | Two circuit breakers: consecutive-failure + rapid-refill |

### cache / context

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed prompt cache misses in long sessions caused by tool schema bytes changing mid-session | `utils/toolSchemaCache.ts`, prompt cache | cache chunks | Stable serialization of tool schemas |
| Fixed nested CLAUDE.md files being re-injected dozens of times in long sessions that read many files | `utils/claudemd.ts`, system prompt | claudemd chunks | Dedup CLAUDE.md injection |

### resume / errors

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Fixed `--resume` crash when transcript contains a tool result from an older CLI version or interrupted write | `utils/conversationRecovery.ts` | resume chunks | Defensive shape check |
| Fixed misleading "Rate limit reached" message when the API returned an entitlement error | `services/rateLimitMessages.ts`, `utils/api.ts` | rate-limit chunks | Distinguish 429 vs entitlement |
| Fixed hooks `if` condition filtering not matching compound commands (`ls && git push`) or commands with env-var prefixes | `hooks/`, hook evaluator | hook chunks | Tokenize compound + env-prefix |
| Fixed collapsed search/read group badges duplicating in terminal scrollback during heavy parallel tool use | `utils/collapseReadSearch.ts` | collapse chunks | Single-emit on parallel use |
| Fixed notification `invalidates` not clearing the currently-displayed notification immediately | `hooks/notifs/`, notification | notification chunks | Apply invalidates synchronously |
| Fixed prompt briefly disappearing after submit when background messages arrived during processing | `hooks/useCommandQueue.ts`, prompt input | input chunks | Re-render prompt after background msg |
| Fixed Devanagari and other combining-mark text being truncated in assistant output | `utils/markdown.ts`, post-process | render chunks | Combining-mark aware truncation |
| Fixed rendering artifacts on main-screen terminals after layout shifts | `ink.ts`, render | render chunks | Layout-shift redraw |
| Fixed Shift+Enter submitting instead of inserting a newline on Windows Terminal Preview 1.25 | `keybindings/` | key chunks | Windows Terminal Preview 1.25 detection |
| Fixed periodic UI jitter during streaming in iTerm2 when running inside tmux | `ink.ts`, render | render chunks | iTerm2+tmux jitter fix |
| Fixed PowerShell tool incorrectly reporting failures when commands like `git push` wrote progress to stderr on Windows PowerShell 5.1 | `tools/PowerShellTool/` | powershell chunks | Treat stderr progress as info on 5.1 |
| Fixed a potential out-of-memory crash when the Edit tool was used on very large files (>1 GiB) | `tools/FileEditTool/`, `utils/file.ts` | edit chunks | Stream-based edit for >1 GiB |

### improvements

| Bullet excerpt | v2.1.88 source | v2.1.112 chunk | Implementation hint |
|----------------|----------------|----------------|---------------------|
| Improved collapsed tool summary to show "Listed N directories" for `ls`/`tree`/`du` instead of "Read N files" | `utils/collapseReadSearch.ts`, `utils/toolUseSummary` | collapse chunks | Detect ls/tree/du commands and re-label |
| Improved Bash tool to warn when a formatter/linter command modifies files you have previously read | `tools/BashTool/`, `utils/fileStateCache.ts` | bash chunks | Post-command file-cache check + warning |
| Improved `@`-mention typeahead to rank source files above MCP resources with similar names | `hooks/useTypeahead.tsx`, `hooks/unifiedSuggestions.ts` | typeahead chunks | Rerank source files |
| Improved PowerShell tool prompt with version-appropriate syntax guidance (5.1 vs 7+) | `tools/PowerShellTool/`, prompt | powershell chunks | Version-aware system prompt |
| Changed `Edit` to work on files viewed via `Bash` with `sed -n` or `cat`, without requiring a separate `Read` call first | `tools/FileEditTool/`, `utils/readEditContext.ts`, `utils/fileStateCache.ts` | edit + bash chunks | Bash-output file content marks read-state |
| Changed hook output over 50K characters to be saved to disk with a file path + preview instead of being injected directly into context | `hooks/`, hook output | hook chunks | New disk-spill path |
| Changed `cleanupPeriodDays: 0` in settings.json to be rejected with a validation error | `utils/settings/`, schema | schema chunks | Reject 0 with clear error |
| Changed thinking summaries to no longer be generated by default in interactive sessions - set `showThinkingSummaries: true` in settings.json to restore | `utils/thinking.ts`, settings | thinking + settings chunks | Default off; new opt-in field |
| Documented `TaskCreated` hook event and its blocking behavior | `hooks/`, docs | hook chunks | Docstring change; no code change |
| Preserved task notifications when backgrounding a running command with Ctrl+B | `tools/BashTool/`, `hooks/useSessionBackgrounding.ts` | bash + backgrounding chunks | Preserve task notification queue |
| PowerShell tool on Windows: external-command arguments containing both a double-quote and whitespace now prompt instead of auto-allowing | `tools/PowerShellTool/`, permissions | powershell chunks | New prompt-trigger rule |
| `/env` now applies to PowerShell tool commands (previously only affected Bash) | `commands/env/`, powershell env | env + powershell chunks | Apply /env vars to powershell subprocesses |
| `/usage` now hides redundant "Current week (Sonnet only)" bar for Pro and Enterprise plans | `commands/usage/`, `utils/billing.ts` | usage chunks | Hide bar for Pro/Enterprise |
| Image paste no longer inserts a trailing space | `utils/imagePaste.ts` | imagePaste chunks | Strip trailing space |
| Pasting `!command` into an empty prompt now enters bash mode, matching typed `!` behavior | `utils/imagePaste.ts`, prompt input | input chunks | Bash-mode trigger on paste |
| `/buddy` is here for April 1st - hatch a small creature that watches you code | `buddy/`, `commands/` | seasonal (not in v2.1.112 build); `chunks.190.mjs:87` only mentions "onboarding buddy" | `feature('BUDDY')` gate; not compiled into 2.1.112 source - seasonal rollout |

---

## Discovery notes

Some bullets reference internal mechanisms that don't surface as easily-searchable strings (e.g. "fixed periodic UI jitter"). For those, the chunk hint is best-effort and the v2.1.88 source path points to the most likely location. The implementation hint summarizes the kind of change rather than the exact line.

For bullets where the chunk file is named ambiguously (e.g. "rate-limit chunks", "render chunks"), the actual file can be located by grepping the obfuscated source for a distinctive string from the changelog text or from the v2.1.88 source:

```bash
cd /lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.112/source
grep -l "<distinctive-string>" chunks.*.mjs
```

Chunks frequently referenced by this map (in order of recurrence):

- `chunks.16.mjs` - file I/O, Edit/Write internals, Perforce
- `chunks.18.mjs` - plugin manifest schema
- `chunks.19.mjs` - settings schema, CA cert resolver
- `chunks.65.mjs` - fullscreen / TUI renderer detection
- `chunks.80.mjs` - effort levels and model resolver
- `chunks.83.mjs`, `chunks.149.mjs` - Bash permission classifier
- `chunks.100.mjs`, `chunks.116.mjs`, `chunks.144.mjs` - telemetry/OTEL
- `chunks.101.mjs` - Monitor + PushNotification deferred tools
- `chunks.106.mjs`, `chunks.214.mjs` - API streaming + retries
- `chunks.151.mjs` - EnterWorktree, settings descriptions
- `chunks.155.mjs`, `chunks.159.mjs` - compact dispatcher, circuit breakers
- `chunks.157.mjs` - plugin loader
- `chunks.161.mjs`, `chunks.162.mjs` - MCP renderers and `_meta` wrapper
- `chunks.168.mjs` - keybindings
- `chunks.180.mjs`, `chunks.181.mjs` - powerup, release notes, welcome banner
- `chunks.183.mjs` - ultrareview
- `chunks.185.mjs` - /tui command
- `chunks.188.mjs` - /rewind, /undo
- `chunks.189.mjs` - /focus, /recap
- `chunks.190.mjs` - /team-onboarding
- `chunks.193.mjs` - hook permission-decision dispatch (defer/PermissionDenied)
- `chunks.194.mjs` - prompt cache TTL
- `chunks.211.mjs` - skills registry (less-permission-prompts, claude-api)
- `chunks.214.mjs` - Vertex setup wizard
- `chunks.222.mjs` - CLI argparser

See [`file_index.md`](file_index.md) for the inverse mapping (chunk -> features).
