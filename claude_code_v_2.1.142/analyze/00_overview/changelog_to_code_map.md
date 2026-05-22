# Changelog to Code Map — v2.1.113 → v2.1.142

This is the per-bullet code-traceability index for the v2.1.113 → v2.1.142 changelog window. For each changelog bullet, this table records:

- **Theme** — one of: claude-agents, /goal, claude-api, routines, native-binary, plan-mode, hooks, mcp, permissions, sandbox, compact, cache, thinking, ui, model, effort, telemetry, oauth, plugins, slash-cmd, voice, ide, lsp, resume, transcript, vim, focus, status, fast-mode, misc.
- **v2.1.142 decl** — `cli_unpack_pretty/unknown/<id>.js`, `cli_inner_pretty.js:<line>`, or `(unmapped)` if not yet pinpointed.
- **Implementation hint** — one-line description of the change shape.

Companion documents:

- [`changelog_analysis.md`](changelog_analysis.md) — narrative architectural analysis
- [`file_index.md`](file_index.md) — extracted-file inventory
- [`symbol_index_*.md`](.) — obfuscated → readable symbol mappings (skeletons in unit 01)

Versions are listed newest first.

---

## v2.1.142

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| Added new `claude agents` flags: `--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`, `--permission-mode`, `--model`, `--effort`, `--dangerously-skip-permissions` | claude-agents | `cli_inner_pretty.js:77-79,117-119` (argparser) + dispatcher | argparser entries for each new flag + dispatcher forwards to spawned session |
| Fast mode now uses Opus 4.7 by default (previously Opus 4.6). Set `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1` to pin fast mode to Opus 4.6 | fast-mode | `cli_inner_pretty.js:96906` (`CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` env-var read) | Fast-mode model picker reads env override; default constant flipped |
| Plugins with a root-level `SKILL.md` and no `skills/` subdirectory are now surfaced as a skill | plugins | (unmapped) plugin-loader skill discovery | Plugin manifest reader checks for root SKILL.md when `skills/` is absent |
| The `/plugin` details pane and `claude plugin details` now show LSP servers a plugin provides | plugins / lsp | (unmapped) plugin-details renderer | Plugin details renderer iterates `manifest.lspServers` |
| `/web-setup` warns before replacing an existing GitHub App connection | slash-cmd | (unmapped) /web-setup command handler | Pre-replace confirmation modal |
| Fixed `MCP_TOOL_TIMEOUT` not raising the per-request fetch timeout for remote HTTP and SSE MCP servers, which capped tool calls at 60 seconds regardless of the configured value | mcp | `cli_inner_pretty.js:413222,413347` (two MCP timeout readers) + env-var anchor at line 273690 | `parseInt(process.env.MCP_TOOL_TIMEOUT)` now passes through to AbortController + fetch timeout |
| Fixed background sessions not recognizing pre-existing git worktrees, blocking Edit while EnterWorktree refused to create a duplicate | claude-agents | (unmapped) dispatcher worktree-detect path | Dispatcher consults `git worktree list`; skip `EnterWorktree` if cwd is already a worktree |
| Fixed background sessions disappearing and daemon reconnect failing after macOS sleep/wake — the daemon now detects clock jumps instead of treating them as elapsed idle time | claude-agents | (unmapped) daemon idle-accounting | Switched from `Date.now()`-diff to monotonic clock / heartbeat |
| Fixed daemon not exiting cleanly after the binary is upgraded (e.g. `brew upgrade`), causing dispatched agents to crash-loop on the deleted path | claude-agents | (unmapped) daemon self-monitor | Daemon stat's its own binary path; exits if file disappears |
| Fixed background agents crash-looping when the Claude-in-Chrome extension is connected without a shared tab | claude-agents / chrome | (unmapped) chrome-extension bridge | Guard the shared-tab requirement in the bridge handshake |
| Fixed clicking links in an attached `claude agents` session — the background worker's headless browser shim no longer applies while attached | claude-agents / chrome | (unmapped) browser-link dispatch | Check "attached" state before applying the headless shim |
| Fixed `claude agents` "v to open in editor" using the daemon's default editor instead of your shell's `$EDITOR`/`$VISUAL` | claude-agents / ide | (unmapped) editor-open handler | Resolve `$EDITOR`/`$VISUAL` at attach time, not daemon-start time |
| Fixed `claude agents` deadlocking on Windows with network-drive working directories; Ctrl+C now works during startup | claude-agents / ui | (unmapped) startup loop | Add SIGINT/Ctrl+C handling during startup; non-blocking fs probe for network drives |
| Fixed background-color bleed when attaching to a `claude agents` session from Apple Terminal or other 256-color-only terminals | claude-agents / ui | (unmapped) terminal capability detect | Detect 256-color-only terminals; emit explicit bg reset on attach |
| Fixed `claude --bg --dangerously-skip-permissions` not persisting across retire/wake | claude-agents / permissions | (unmapped) per-session state writer | Add `permissionMode` to persisted session state |
| Fixed session titles being derived from the URL when the first message is a link | session-title | (unmapped) session-title builder | URL-only first messages now skip title derivation |
| Fixed redundant `set_model` requests from remote clients injecting duplicate `/model` breadcrumbs into the transcript | model | (unmapped) set_model dispatch | Dedupe `set_model` requests; emit breadcrumb only on actual change |
| Fixed plugins using `skills: ["./"]` showing a false "path escapes plugin directory" error | plugins / skills | (unmapped) plugin-skills resolver | Special-case `./` as "use frontmatter name" |
| Fixed plugin cache cleanup deleting the active plugin version directory when no installation metadata is present | plugins | (unmapped) plugin cache cleanup | Bail cleanup if `installed_plugins.json` missing or unparseable |
| Fixed `/plugin` browse pane showing "0 installs" for newly published plugins | plugins / ui | (unmapped) marketplace stats panel | Distinguish "not yet recorded" from "0 installs" in stats fetch |
| Fixed plugin advisories not naming every `plugin.json` key that shadows a default folder | plugins | (unmapped) plugin validator | Iterate all default-folder keys for shadow detection |
| Improved reactive compaction: the first summarize attempt now seeds from the original request's overflow size, avoiding a wasted near-full-context retry | compact | (unmapped) reactive-compact dispatcher | Pass overflow size to summarize as budget input |
| Improved hook configuration error: configuring a prompt- or agent-type hook for `SessionStart`/`Setup`/`SubagentStart` now shows a clear "use a command-type hook instead" error | hooks | (unmapped) hook-config validator | Validator widened with hook-type / event-type compatibility matrix |
| Removed stale `/model claude-sonnet-4-20250514` suggestion from Usage Policy refusal messages | model | (unmapped) usage-policy refusal builder | String constant updated |

---

## v2.1.141

### claude-agents

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Added `claude agents --cwd <path>` to scope the session list to a directory | (unmapped) `claude agents` argparser | New cwd arg passed into dashboard filter |
| `claude agents`: launching a session no longer fails when the pre-warmed background worker is unhealthy — now falls back to a fresh launch | (unmapped) dispatcher | Health check + fresh-launch fallback |
| `claude agents` no longer shows empty placeholder sessions left over from backgrounding a fresh REPL, and shows onboarding text when entered via ← with no other agents | `EQ4.js` (dashboard) | Filter empty-stub entries; onboarding-text branch |
| Empty idle background sessions left over from `←` are now automatically retired by the daemon after 5 minutes | (unmapped) daemon retirement sweep | 5-min idle timer per stub session |
| `claude agents`: agents that finish work but leave a background shell running now move to Completed instead of staying under Working | `EQ4.js` (status classifier) | Status classifier consults shell-state distinctly from work-state |
| Fixed `claude agents` showing the agent-type list instead of the dashboard when launched through a wrapper that adds flags | (unmapped) `claude agents` entrypoint | Skip agent-type list when extra args present |
| Fixed `claude agents` opening a crashed session firing redundant dispatches when the working directory was deleted | (unmapped) reopen handler | Guard against missing cwd before dispatch |

### hooks

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Added `terminalSequence` field to hook JSON output so hooks can emit desktop notifications, window titles, and bells without a controlling terminal | `cli_inner_pretty.js:238108,519030` (field carriers) + schema at `520586` | New field + dispatch path |
| Fixed hooks receiving a non-existent `transcript_path` after `EnterWorktree` switches the working directory | (unmapped) hook input builder | Recompute `transcript_path` after cwd change |
| Improved spinner feedback during long thinking periods — the spinner now warms to amber after 10 seconds to signal Claude is still working | ui / thinking | spinner renderer | 10s timer transitions color |

### oauth / managed settings

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Added `ANTHROPIC_WORKSPACE_ID` environment variable for workload identity federation — scopes the minted token to a specific workspace when the federation rule covers more than one | `cli_inner_pretty.js:4167,4192,4335` (WIF token-mint reads + error message) | Pass workspace id into mint claim |
| Added `CLAUDE_CODE_PLUGIN_PREFER_HTTPS` to clone GitHub plugin sources over HTTPS instead of SSH, for environments without a GitHub SSH key | `cli_inner_pretty.js:228651,229761` (env var probes in plugin git-clone path) | Set git protocol based on env var |
| Fixed desktop and third-party provider sessions incorrectly inheriting `apiKeyHelper`/`ANTHROPIC_AUTH_TOKEN` from host managed-settings | auth | (unmapped) auth resolver | Skip managed-settings auth keys for non-host-API sessions |
| Bedrock: `awsCredentialExport` now always runs when configured instead of being skipped when ambient AWS credentials resolve, fixing auth for cross-account access | auth | (unmapped) Bedrock credential resolver | Remove "skip on ambient" guard |
| Fixed Remote Control MCP connectors all failing with 401 when the worker session token rotated mid-session | mcp / oauth | (unmapped) remote-control session token | Pass new token on rotation event |
| Fixed Remote Control automatically re-enrolling a trusted device when the server rejects a stale token, instead of looping through `/login` | oauth | (unmapped) trusted-device flow | Re-enroll path on stale-token-reject |

### mcp

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Fixed plugin details pane showing 0 MCP servers for plugins that declare them via `.mcp.json` | plugins | (unmapped) plugin-details renderer | Merge `.mcp.json` discovery into MCP count |
| Fixed plugin MCP servers with unset config variables showing a generic connection failure instead of a "config issue" message with a fix-it hint; malformed `.mcp.json` entries no longer drop other MCP servers | plugins / mcp | (unmapped) plugin-MCP loader | Distinguish "config-issue" vs "connection-failure"; isolate per-entry parse failures |
| Fixed MCP server configs using POSIX shell parameter expansions (e.g. `${var%pattern}`) being incorrectly flagged as missing environment variables | mcp | (unmapped) MCP config env-var detector | Parse POSIX `${var%pattern}` shape distinctly from `${var}` |
| Fixed MCP HTTP/SSE servers returning 403 on connect showing as "failed" instead of "needs auth" | mcp | (unmapped) MCP HTTP connect | 403 → "needs auth" status |
| Fixed remote MCP servers disconnecting unnecessarily when the optional server-events stream failed to reconnect — tool calls continue over POST | mcp | (unmapped) MCP HTTP transport | Tool POST channel keeps running when SSE drops |

### ui / fixes

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| `/feedback` can now include recent sessions (last 24 hours or 7 days) for issues spanning more than the current session | slash-cmd | (unmapped) `/feedback` handler | Add recent-sessions multi-select |
| Rewind menu: added "Summarize up to here" to compress earlier context while keeping recent turns intact | compact / ui | (unmapped) rewind menu | New menu entry calling partial-compact path |
| Auto mode permission dialog now explains when a `permissions.ask` rule caused the prompt | permissions / ui | (unmapped) auto-mode dialog | New reason message |
| Restored the "view diff in your IDE" option on file-edit permission prompts when an IDE is connected | ide / ui | (unmapped) edit permission prompt | Re-add diff-in-IDE action when IDE detected |
| Background agents launched via `/bg` or `←←` now preserve the current permission mode instead of reverting to default | claude-agents / permissions | (unmapped) bg-launch path | Capture current mode before launch |
| Improved plugin menu navigation: `→`/Tab switch tabs, `↑` moves to the tab strip, and tab headers and search box are clickable in fullscreen mode | plugins / ui | (unmapped) /plugin keymap | Tab-bar focus & click hit-test in fullscreen |
| Fixed background side-queries sending an unavailable Haiku model ID on Bedrock/Vertex/Foundry when no `ANTHROPIC_SMALL_FAST_MODEL` override is set — now falls back to the main-loop model | model | (unmapped) side-query model resolver | Fallback chain: small-fast → main-loop |
| Fixed `claude daemon status` and `/doctor` on Windows throwing when the daemon pipe key file is locked or unreadable — now shows the underlying error instead of an opaque failure | claude-agents / ui | (unmapped) daemon-status reader | Catch + surface IOError |
| Fixed background jobs on a custom `ANTHROPIC_BASE_URL` gateway not getting auto-named — the namer now uses the main model when no Haiku model is configured | model | (unmapped) job-namer | Fallback model chain |
| Fixed `/model` in one session silently changing the autocompact threshold in other concurrent sessions | model / compact | (unmapped) `/model` handler | Scope autocompact threshold to current session |
| Fixed switching permission mode while a tool-permission prompt is open not auto-dismissing the prompt when the new setting permits the tool | permissions / ui | (unmapped) mode-change dispatcher | Re-evaluate open prompts on mode change |
| Fixed pressing Enter while a permission/dialog prompt is open also submitting text in the input box | ui | (unmapped) input handler | Suppress input submission while modal open |
| Fixed markdown tables with cell wrapping falling back to the vertical key-value layout instead of rendering as a bordered grid (regression in 2.1.136) | ui | (unmapped) markdown table renderer | Wrapping-cells path uses grid layout |
| Fixed cancelled prompts being removed from Up-arrow history when auto-restored into the input box, avoiding duplicate entries | ui | (unmapped) prompt history store | Auto-restore moves entry to current draft slot |
| Fixed prompts cancelled with Ctrl+C/Esc before any response being dropped from Up-arrow history | ui | (unmapped) prompt history store | Save-on-cancel path |
| Fixed Ctrl+C not interrupting a running turn while in vim INSERT/VISUAL mode | vim | (unmapped) vim mode key handler | Propagate Ctrl+C through INSERT/VISUAL |
| Fixed alternative `chat:submit` keybindings (e.g. `meta+enter`, `ctrl+enter`) not working when `enter` is rebound to `chat:newline` | ui / keybindings | (unmapped) keybinding dispatcher | Keep submit handler when enter is rebound |
| Fixed prompt suggestions being silently disabled when an output style was configured | ui | (unmapped) suggestion gate | Output-style != suggestion-off |
| Fixed `spinnerVerbs` setting not being honored in turn-completion messages | ui | (unmapped) spinner verbs lookup | Read setting in turn-completion path |
| Fixed AskUserQuestion popup hiding the last line of preceding chat content | ui | (unmapped) AskUserQuestion overlay | Adjust overlay top-padding |
| Fixed Web Search status showing "Did 0 searches" when searches returned errors | tools / ui | (unmapped) WebSearch status formatter | Distinguish "0 results" vs "0 successful searches" |
| Fixed multi-line statusline output dropping or corrupting rows when any line exceeds terminal width | status / ui | (unmapped) statusline renderer | Per-line width budget + clip |
| Fixed light-ansi theme using invisible white for diff context lines on light backgrounds — now uses black | ui / theme | (unmapped) theme palette | Diff-context color override for light themes |
| Fixed error overlay dumping minified bundle source that hid the original error message | ui | (unmapped) error overlay | Map stack frames before display; surface message first |
| Fixed pressing Enter after typing a feedback survey rating digit submitting it as a chat message instead of the rating | slash-cmd / ui | (unmapped) feedback rating handler | Capture Enter while rating-input has focus |
| Fixed pressing `x` on a selected subagent in the agent panel typing into the prompt instead of stopping the agent | ui | (unmapped) agent-panel keymap | Route `x` to stop-agent action |
| Fixed session title being derived from plugin monitor notifications before the user's first prompt | session-title | (unmapped) session-title builder | Skip plugin-monitor messages in derivation |
| Fixed "Allowed by PermissionRequest hook" repeating once per tool call under a collapsed read/search group | permissions / ui | (unmapped) collapsible-group renderer | Dedupe banner per group |
| Fixed `/tui` silently dropping running background shells and subagents — now refuses and asks to wait for them to finish | slash-cmd / ui | (unmapped) /tui handler | Pre-switch active-jobs check |
| Fixed welcome banner showing "API Usage Billing" on Bedrock, Vertex, Foundry, and other third-party providers — now shows the provider name | ui / model | (unmapped) welcome banner | Provider-aware billing label |
| Fixed `/mcp` server list not keeping the focused server visible in short terminals in fullscreen mode | mcp / ui | (unmapped) /mcp picker | Scroll-to-focused on overflow |
| Fixed redaction in `/feedback` bundles producing invalid JSON for quoted values like session IDs | slash-cmd | (unmapped) /feedback bundler | Properly JSON-escape redacted values |
| Fixed early analytics events being silently dropped when fired before logger initialization | telemetry | (unmapped) analytics buffer | Pre-init queue, flush on init |
| Fixed `claude plugin install` failing for plugins whose marketplace `ref` no longer exists upstream when a `sha` is also pinned | plugins | (unmapped) plugin installer | Fall back to sha when ref missing |
| Fixed a race where early OTel spans could be silently dropped in SDK/headless mode with beta tracing enabled | telemetry | (unmapped) OTel SDK init | Buffer spans until provider ready |
| Fixed custom `voice:pushToTalk` keybindings and `"space": null` unbinds being silently ignored | voice / keybindings | (unmapped) keybinding loader | Honor `null` unbind value |
| Fixed Windows Alt+V image paste reporting "no image found" when the clipboard contains a screenshot | ui | (unmapped) Windows clipboard reader | Try multiple clipboard formats |
| Fixed SDK "Claude Code native binary not found" on Linux when both glibc and musl platform packages are installed | native-binary | (unmapped) binary resolver | Prefer matching libc; clearer error |
| `[VSCode]` Fixed in-chat mic showing no feedback when the microphone produced only silence — now shows "No audio detected" | ide | (unmapped) VS Code voice UI | Silence-detection + status text |
| `[VSCode]` Voice mode: the WSL error now suggests installing `sox libsox-fmt-pulse` for WSLg users | ide / voice | (unmapped) VS Code WSL voice err | Updated error string |

---

## v2.1.140

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| Improved Agent tool `subagent_type` matching to accept case- and separator-insensitive values (e.g. `"Code Reviewer"` resolves to `code-reviewer`) | subagent | (unmapped) Agent tool input validator | Normalize input via slugify |
| Updated agent color palette | ui | (unmapped) agent color picker | New palette constant |
| Fixed `/goal` silently hanging when `disableAllHooks` or `allowManagedHooksOnly` is set — now shows a clear message instead of an indicator that never resolves | /goal | (unmapped) /goal command pre-check | Detect hooks-disabled before installing |
| Fixed a regression in settings hot-reload where symlinked settings files caused misattributed change events and spurious `ConfigChange` hooks | hooks / settings | (unmapped) settings watcher | Resolve symlinks before dedup |
| Fixed `claude --bg` failing with "connection dropped mid-request" when the background service was about to idle-exit | claude-agents | (unmapped) bg-launch path | Retry on idle-exit race |
| Fixed background service startup failing on machines with enterprise endpoint security by allowing more time | claude-agents | (unmapped) bg-launch path | Longer startup timeout |
| Fixed remote managed settings not retrying on 401 — now retries once with a force-refreshed token | settings / oauth | (unmapped) managed-settings fetcher | Retry once with force-refresh |
| Fixed managed `extraKnownMarketplaces` auto-update policy not being persisted to `known_marketplaces.json` | plugins | (unmapped) plugin marketplace store | Persist on auto-update event |
| Fixed `/loop` scheduling redundant wakeups to poll for background tasks that already notify on completion | steering | (unmapped) /loop scheduler | Skip polling when bg tasks self-notify |
| Fixed a recurring event-loop stall on Windows when a missing executable (e.g. `gh`) triggered synchronous `where.exe` re-spawns on every check | platform | (unmapped) Windows exec resolver | Cache negative `where.exe` results |
| Fixed `Read` tool calls failing validation when `offset` is passed as a whitespace-padded or `+`-prefixed string | tools | (unmapped) Read tool schema | Coerce whitespace/`+` prefix |
| Fixed native terminal cursor not staying at the input caret when the terminal loses focus | ui | (unmapped) input-caret renderer | Persist cursor pos on blur |
| Plugins now warn when a default component folder (e.g. `commands/`) is silently ignored because `plugin.json` sets the matching key. Shown in `/doctor`, `claude plugin list`, and `/plugin`. | plugins | (unmapped) plugin validator + UI surfaces | Detect-and-warn pass |

---

## v2.1.139

### claude-agents (new feature)

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Added agent view (Research Preview): a single list of every Claude Code session — running, blocked on you, or done. Run `claude agents` to get started | `EQ4.js` (dashboard) + daemon | New subcommand + React dashboard + per-OS daemon |

### /goal (new feature)

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Added `/goal` command: set a completion condition and Claude keeps working across turns until it's met. Works in interactive, `-p`, and Remote Control. Shows live elapsed/turns/tokens as an overlay panel | `T6A` (cmd def), `Xk4.js` (overlay), prompt at `cli_inner_pretty.js:486759`, `active_goal` event | Session-scoped Stop hook + overlay + `active_goal` event |

### slash-cmd / plugins / hooks

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Added `/scroll-speed` command to tune mouse wheel scroll speed with a live preview | (unmapped) /scroll-speed | New slash command + setting |
| Added `claude plugin details <name>` to show a plugin's component inventory and projected per-session token cost | (unmapped) plugin-details subcmd | New subcommand |
| Added transcript view navigation: `?` for keyboard shortcuts, `{`/`}` to jump between user prompts, `v` to toggle shortcut panel | ui | (unmapped) transcript view keymap | New keymap entries |
| Added hook `args: string[]` field (exec form) that spawns the command directly without a shell, so path placeholders never need quoting | hooks | (unmapped) hook schema | Schema widened with `args` exec form |
| Added hook `continueOnBlock` config option for `PostToolUse` — set to `true` to feed the hook's rejection reason back to Claude and continue the turn | hooks | (unmapped) hook dispatch | Re-emit blocked reason to model |
| MCP stdio servers now receive `CLAUDE_PROJECT_DIR` in their environment, matching hooks. Plugin configs can reference `${CLAUDE_PROJECT_DIR}` in commands | mcp / plugins | (unmapped) MCP stdio launcher | Inject env var; resolve placeholder |
| Compaction prompt now asks the model to preserve sensitive user instructions | compact | (unmapped) compact prompt builder | Prompt string updated |
| `/mcp` Reconnect now picks up `.mcp.json` edits without a restart, and shows the HTTP status and URL when reconnecting fails | mcp | (unmapped) /mcp reconnect | Re-read `.mcp.json`; expose status/url on fail |
| `/context all` per-skill token estimates now account for the model's tokenizer and show rounded values | slash-cmd | (unmapped) /context renderer | Use model tokenizer; round to nearest 100 |
| `claude plugin install <name>@<marketplace>` now auto-refreshes the marketplace and retries before reporting a plugin as not found | plugins | (unmapped) plugin installer | Refresh-then-retry |
| `/plugin` installed-plugin details now show hook event names and MCP server names cleanly | plugins / ui | (unmapped) plugin-details renderer | Distinct field per type |
| `/context` now shows the providing plugin's name for plugin-sourced skills | slash-cmd | (unmapped) /context renderer | Plugin attribution per skill |
| Remote MCP server reconnect retry on transient failures is now enabled for all users | mcp | (unmapped) MCP reconnect | Remove rollout gate |
| API requests from subagents now carry `x-claude-code-agent-id` / `x-claude-code-parent-agent-id` headers, and `claude_code.llm_request` OTEL spans include `agent_id` / `parent_agent_id` attributes | subagent / telemetry | (unmapped) subagent API client | Add headers; surface on span |
| Remote Control, `/schedule`, claude.ai MCP connectors, and notification preferences are now disabled when `ANTHROPIC_API_KEY` / `apiKeyHelper` / `ANTHROPIC_AUTH_TOKEN` is set, even if a Claude.ai login also exists | auth | (unmapped) feature-gate resolver | Suppress claude.ai surfaces when API-key auth present |

### permissions

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Fixed `Skill(name *)` permission rules — the wildcard form now works as a prefix match, matching `Bash(ls *)` behavior | permissions | (unmapped) permission rule matcher | Add Skill prefix-match branch |
| Fixed `autoAllowBashIfSandboxed` not auto-approving commands with shell expansions like `$VAR` and `$(cmd)` | permissions / sandbox | (unmapped) autoAllow classifier | Treat expansions as safe in sandbox |

### resume / fixes

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Fixed a deadlock where expired credentials and the `forceRemoteSettingsRefresh` policy setting blocked `claude auth login`/`logout`/`status` with no way to recover | oauth | (unmapped) auth flow | Bypass forceRemoteSettingsRefresh during auth ops |
| Fixed a bug where a hook writing to the terminal could corrupt an on-screen interactive prompt; hooks now run without terminal access | hooks | (unmapped) hook spawner | Detach stdout/stderr from terminal |
| Fixed unbounded memory growth when an HTTP/SSE MCP server streams non-protocol data — response bodies now capped at 16 MB per SSE frame | mcp | (unmapped) MCP SSE reader | 16 MB frame cap |
| Fixed settings hot-reload not detecting edits to symlinked `~/.claude/settings.json` | settings | (unmapped) settings watcher | Follow symlinks in watcher |
| Fixed plugin details failing to load when the marketplace key differs from the manifest name | plugins | (unmapped) plugin-details lookup | Cross-key fallback |
| Fixed `/model` picker "Default" row not reflecting `ANTHROPIC_DEFAULT_OPUS_MODEL`/`ANTHROPIC_DEFAULT_SONNET_MODEL` overrides | model | (unmapped) /model picker | Honor env defaults in label |
| Fixed spurious "stream idle timeout" 5 minutes after a response completed, caused by the watchdog timer not being cleared on stream cancellation | api | (unmapped) stream watchdog | Clear timer on cancel |
| Fixed silent `exit 1` when 10+ MCP servers are configured and the cache directory is unwritable — the error message now includes the underlying cause | mcp | (unmapped) MCP cache | Surface unwritable-dir error |
| Fixed a typing cursor blinking on tab names, list pointers, and select rows in dialogs | ui | (unmapped) dialog renderers | Hide cursor in non-input cells |
| Fixed transcript view letter shortcuts not working after mouse click | ui | (unmapped) transcript keymap | Restore keyboard focus after click |
| Fixed Bash-mode up-arrow history repeating the first entry and clobbering the in-progress draft | ui | (unmapped) bash-mode history | Don't overwrite draft on first up-arrow |
| Fixed pasting or dropping multiple images only inserting the last one | ui | (unmapped) image paste handler | Iterate image list |
| Fixed hyperlinks using unreadable dark navy on dark themes — they now adapt to the active theme | ui / theme | (unmapped) link color | Theme-aware color |
| Fixed model picker showing a redundant "Current model" row for third-party users whose model is set to the `opus` alias | model / ui | (unmapped) /model picker | Dedup alias rows |
| Fixed legacy Opus picker entry on PAYG 3P providers resolving to the same model as the default entry | model | (unmapped) model alias resolver | Suppress duplicate |
| Fixed mouse wheel scrolling speed in Cursor and VS Code 1.92–1.104; the trackpad now scrolls at a steady rate and the mouse wheel keeps ~3 lines per notch | ide / ui | (unmapped) scroll-event normalizer | Per-editor scroll throttle |
| Fixed scroll behavior in Windows Terminal and VS Code when attached to background sessions | ide / ui | (unmapped) scroll-event normalizer | Platform-specific tuning |
| Fixed MCP resources from disconnected servers lingering in `@server:` autocomplete | mcp / ui | (unmapped) @-mention autocomplete | Filter disconnected servers |
| Fixed two-file diff snippets over-reporting the number of truncated lines by one | ui | (unmapped) diff truncation counter | Off-by-one fix |
| Fixed Grep results not relativizing Windows drive-letter paths and count mode reporting wrong totals for single-file paths | tools | (unmapped) Grep result formatter | Drive-letter handling + single-file count |
| Fixed border-embedded text overflowing on CJK/emoji due to visual cell width miscalculation | ui | (unmapped) text renderer | Use visual cell width |
| Fixed fuzzy-match highlighting splitting emoji and astral-plane characters mid-pair | ui | (unmapped) fuzzy highlighter | Grapheme-aware split |
| Fixed skill argument names containing regex metacharacters breaking argument substitution | skills | (unmapped) skill arg substitutor | Escape metachars in regex source |
| Fixed ProgressBar rendering a full block for an almost-full fractional cell | ui | (unmapped) ProgressBar | Round-half-down on last cell |
| Fixed task polling and `fs.watch` being resurrected when the last subscriber leaves while a fetch is in flight | tasks | (unmapped) task subscriber tracker | Guard against in-flight resurrection |
| Fixed plugin dependency resolution leaving a stale count when the manifest name differs from the source identifier | plugins | (unmapped) plugin dep resolver | Track count by source id |
| Fixed Insights Time-of-Day chart skewing when a session has an unparseable timestamp | telemetry / ui | (unmapped) Insights aggregator | Skip unparseable rows |
| Fixed keybindings using only the cmd/super/win modifier being flagged as unparseable | ui / keybindings | (unmapped) keybinding parser | Accept lone modifier |
| Fixed `claude_code.active_time.total` OpenTelemetry metric not being emitted in `--print` mode | telemetry | (unmapped) active-time emitter | Enable in print-mode |
| Fixed `claude plugin update` not preserving cross-plugin symlinks inside a marketplace | plugins | (unmapped) plugin updater | Preserve symlinks |
| `[VSCode]` Press Cmd/Ctrl+Shift+T to reopen the most recently closed session tab, configurable via `claudeCode.enableReopenClosedSessionShortcut` | ide | (unmapped) VS Code extension | New keybinding + setting |

---

## v2.1.138, v2.1.137

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| v2.1.138: Internal fixes | misc | (unmapped) | (no public bullets) |
| v2.1.137: `[VSCode]` Fixed extension failing to activate on Windows | ide | (unmapped) VS Code extension | Windows activation path |

---

## v2.1.136

### settings / auto-mode

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Added `CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL` to re-enable the session quality survey for enterprises capturing responses through OpenTelemetry | telemetry | (unmapped) feedback survey gate | New env-var override |
| Added `settings.autoMode.hard_deny` for auto mode classifier rules that block unconditionally regardless of user intent or allow exceptions | permissions | (unmapped) auto-mode classifier | New rule tier |

### mcp / oauth

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Fixed MCP servers configured in `.mcp.json`, plugins, and claude.ai connectors silently disappearing after `/clear` in the VS Code extension, JetBrains plugin, and Agent SDK | mcp / ide | (unmapped) /clear handler | Preserve MCP connections through /clear |
| Fixed a rare login loop where a concurrent credential write could overwrite a freshly-rotated OAuth token and force re-login | oauth | (unmapped) credentials writer | Atomic write + retry |
| Fixed MCP OAuth refresh tokens being lost when multiple servers refresh concurrently — users with several remote MCP servers should no longer need daily re-authentication | mcp / oauth | (unmapped) MCP token refresh | Cross-server lock |

### thinking / api

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Fixed an API error (400) when extended thinking emitted a redacted thinking block after a tool call | thinking | (unmapped) request builder | Strip redacted-thinking blocks from next-turn request |

### resume

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Fixed `--resume` / `--continue` not finding sessions when the project path contains underscores | resume | (unmapped) resume project resolver | Encode underscores in path normalization |

### plan-mode

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Fixed plan mode not blocking file writes when a matching `Edit(...)` allow rule exists | plan-mode | (unmapped) plan-mode permission check | Plan-mode takes precedence over Edit-allow rules |

### ui / fixes

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| WSL2: image paste from Windows clipboard now works via a PowerShell fallback when xclip/wl-paste cannot read image data | ui | (unmapped) WSL clipboard reader | PowerShell fallback path |
| Fixed plugin `Stop`/`UserPromptSubmit` hooks failing when cache cleanup deletes a version still in use by a running session | plugins / hooks | (unmapped) plugin cache cleanup | Pin in-use versions |
| Improved visual consistency across slash command dialogs | ui | (unmapped) slash command dialog | Standardized footer hints |
| Fixed colors appearing at wrong positions in bash command output and markdown code blocks | ui | (unmapped) ANSI parser | Correct byte-to-cell mapping |
| Fixed ReasonML diffs rendering corrupted "undefined" text artifacts at word-diff boundaries | ui | (unmapped) word-diff for ReasonML | Skip undefined tokens |
| Fixed worktree exit dialog warning about uncommitted files in the wrong directory after worktree removal | ui | (unmapped) worktree exit dialog | Refresh cwd before check |
| Fixed `@` file picker not matching files created mid-session in small non-git directories | ui | (unmapped) @ file picker | Re-scan on miss |
| Fixed `@`-mention file picker not finding files in directories with more than 100 entries | ui | (unmapped) @ file picker | Drop 100-entry limit |
| Fixed failed tool calls not being click-to-expand in fullscreen mode when their output was truncated | ui | (unmapped) tool-call renderer | Expand on click |
| Fixed Backspace and Ctrl+Backspace getting swapped after using Ctrl+G to open an external editor on terminals with persistent extended-key modes | ui | (unmapped) external editor return | Reset extended-key mode |
| Fixed `/usage` weekly reset showing time of day instead of the calendar date | slash-cmd | (unmapped) /usage formatter | Date format string |
| Fixed welcome banner ellipsis causing column overflow on CJK terminals | ui | (unmapped) welcome banner | CJK width handling |
| Fixed `/insights` crash when session history contains tool calls with malformed input fields | slash-cmd | (unmapped) /insights aggregator | Skip malformed rows |
| Fixed a renderer crash when a tool's collapsibility classification changes mid-session | ui | (unmapped) tool renderer | Defensive classification check |
| Fixed a `skills` entry in `plugin.json` hiding the plugin's default `skills/` directory, and listing a file path now shows an error instead of failing silently | plugins / skills | (unmapped) plugin-skills loader | Merge default + manifest skills; explicit path-list error |
| Fixed IDE shell-integration lock files not respecting `CLAUDE_CONFIG_DIR` | ide | (unmapped) shell-integration | Use CONFIG_DIR for lock files |
| Fixed trailing whitespace in copied terminal output during streaming | ui | (unmapped) copy buffer | Trim trailing whitespace |
| Fixed plugin uninstall and enable/disable not matching slugs case-insensitively | plugins | (unmapped) plugin slug matcher | Lowercase compare |
| Fixed tool error truncation marker showing a negative count for surrogate-pair strings | ui | (unmapped) truncation counter | Grapheme-aware count |
| Fixed env vars from `CLAUDE_ENV_FILE` SessionStart hooks going stale after `/resume` or `/clear` | hooks | (unmapped) SessionStart hook runner | Re-run on /resume and /clear |
| Fixed `/branch` saving a multi-line session title when given a pasted multi-line name | slash-cmd | (unmapped) /branch handler | Strip newlines from title |
| Fixed a stray leading space on the second line of wrapped text at the column boundary | ui | (unmapped) text wrapper | Off-by-one fix |
| Fixed Esc not dismissing dialogs in `/install-github-app`, `/desktop`, `/resume`, and `/web-setup` | slash-cmd / ui | (unmapped) shared dialog dismiss | Connect Esc handler in shared component |
| Fixed `/doctor` MCP schema errors not naming the missing field or showing the source file path | slash-cmd | (unmapped) /doctor MCP check | Include field + path |
| Fixed Bash permission prompts showing an internal parser diagnostic instead of a user-readable explanation | permissions / ui | (unmapped) Bash classifier UI | Map diagnostic to user message |
| Fixed plugin slash commands with spaces (e.g. `/myplugin review`) not resolving to their namespaced form | plugins / slash-cmd | (unmapped) slash command parser | Allow internal whitespace as separator |
| Fixed `AskUserQuestion` discarding multi-select answers when supplied as an array | ui | (unmapped) AskUserQuestion handler | Handle array answers |
| Fixed `/clear <name>` not labeling the cleared session for `/resume` | slash-cmd | (unmapped) /clear handler | Pass label to /resume index |
| Fixed `CronList` output missing qualifiers and the scheduled prompt | steering | (unmapped) CronList tool | Include qualifiers + prompt |
| Fixed "Jump to bottom" overlay leaving color artifacts on CJK characters in fullscreen mode | ui | (unmapped) overlay clear logic | CJK-aware clear |
| Fixed wide markdown tables leaving a stale bordered render in terminal scrollback while streaming | ui | (unmapped) markdown table renderer | Clear stale frame |
| Fixed pasted text being silently dropped when a long prompt with a pasted-text placeholder was auto-truncated | ui | (unmapped) prompt truncation | Preserve pasted-text payload |
| Fixed `/release-notes` getting stuck on an old version after a failed changelog refresh | slash-cmd | (unmapped) /release-notes | Retry on next open |
| Fixed `/mcp` server list not scrolling when there are more servers than fit in the terminal | mcp / ui | (unmapped) /mcp picker | Add scroll keymap |
| Fixed mid-input slash command autocomplete not working after an initial slash command | ui | (unmapped) slash autocomplete | Re-arm autocomplete after first command |
| Fixed scrolling to bottom re-engaging auto-follow with `autoScrollEnabled: false` | ui | (unmapped) auto-follow handler | Respect setting |
| Fixed prompt suggestions being auto-submitted by Enter on an empty input instead of requiring Tab or arrow to accept | ui | (unmapped) suggestion handler | Require explicit accept |
| Fixed keyboard shortcut hints not reflecting rebound keys from `keybindings.json` | ui / keybindings | (unmapped) hint renderer | Look up from rebind table |
| Fixed `/settings` language change being reverted on Escape after confirming | slash-cmd | (unmapped) /settings dialog | Apply on confirm, not on dismiss |
| Fixed `/terminal-setup` only appearing in autocomplete on exact name match instead of partial prefixes | slash-cmd | (unmapped) /terminal-setup name | Prefix match |
| Fixed "Chat about this" on an `AskUserQuestion` dialog erasing the question text | ui | (unmapped) AskUserQuestion "Chat about this" | Preserve question text |
| Fixed MCP tool results being invisible when the server returns content blocks | mcp | (unmapped) MCP result renderer | Handle content blocks |
| Improved error message when `--worktree` collides with an existing or stale worktree | slash-cmd | (unmapped) --worktree handler | Detailed error per collision type |
| Changed plugin marketplace removal key to `d` (matching delete elsewhere) instead of `r` which collided with retry | plugins / keybindings | (unmapped) marketplace keymap | Key rebind |

---

## v2.1.133

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| Added `worktree.baseRef` setting (`fresh` | `head`) to choose whether `--worktree`, `EnterWorktree`, and agent-isolation worktrees branch from `origin/<default>` or local `HEAD` | settings / worktree | (unmapped) worktree creator | Read setting; default `fresh` |
| Added `sandbox.bwrapPath` and `sandbox.socatPath` managed settings (Linux/WSL) to specify custom bubblewrap and socat binary locations | sandbox | (unmapped) sandbox launcher | Honor settings paths |
| Added `parentSettingsBehavior` admin-tier key (`'first-wins' | 'merge'`) to let admins opt SDK `managedSettings` (parent tier) into the policy merge | settings | (unmapped) settings merger | New policy branch |
| Hooks now receive the active effort level via the `effort.level` JSON input field and the `$CLAUDE_EFFORT` environment variable, and Bash tool commands can read `$CLAUDE_EFFORT` | hooks / effort | (unmapped) hook input + Bash env | Add field + env var |
| Improved focus mode behavior | focus | (unmapped) /focus handler | Refinement |
| Improved memory usage by releasing warm-spare background workers under memory pressure | claude-agents | (unmapped) bg worker pool | Memory-pressure listener |
| Fixed parallel sessions all dead-ending at 401 after a refresh-token race wiped shared credentials | oauth | (unmapped) shared credentials | Atomic refresh |
| Fixed `Edit`/`Write` allow rules scoped to a drive root (`C:\`) or POSIX `/` matching incorrectly and always prompting | permissions | (unmapped) permission rule matcher | Root-path matching fix |
| Fixed an unhandled rejection (`ECOMPROMISED`) when a history or session-log file lock is compromised by clock skew or slow disk | platform | (unmapped) file-lock handler | Catch ECOMPROMISED |
| Fixed pressing Esc during conversation compaction showing a spurious "Error compacting conversation" notification | compact / ui | (unmapped) compact dispatcher | Distinguish user-abort from error |
| Fixed `HTTP(S)_PROXY` / `NO_PROXY` / mTLS not being respected for the full MCP OAuth flow including discovery, dynamic client registration, token exchange, and token refresh | mcp / oauth / proxy | (unmapped) MCP OAuth flow | Pipe proxy config through every step |
| Fixed Read/Write/Edit being denied on mapped network drives passed via `--add-dir` / SDK `additionalDirectories` | permissions | (unmapped) path-allowlist matcher | Recognize mapped network drives |
| Fixed Remote Control stop/interrupt from claude.ai not fully canceling the CLI session the same way local Esc does, causing queued messages to never advance after interrupting a stuck tool or prompt | remote-control | (unmapped) Remote Control stop | Mirror local-Esc cancel chain |
| Fixed `/effort` in one session unexpectedly changing the effort level of other concurrent sessions, and a related issue where an IDE effort change could be silently dropped | effort | (unmapped) /effort dispatcher | Scope per-session |
| Fixed subagents not discovering project, user, or plugin skills via the Skill tool | subagent / skills | (unmapped) Skill tool init for subagents | Inherit skill registry |
| `claude --help` now lists `--remote-control` alongside `--remote-control-session-name-prefix` | cli | (unmapped) help renderer | Include flag |
| `[VSCode]` Fixed `claudeCode.claudeProcessWrapper` failing with "Unsupported platform" when the extension build doesn't bundle a Claude binary | ide | (unmapped) VS Code extension | Detect bundled binary; clearer error |

---

## v2.1.132

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| Added `CLAUDE_CODE_SESSION_ID` environment variable to the Bash tool subprocess environment, matching the `session_id` passed to hooks | tools / hooks | (unmapped) Bash spawn env | Inject session ID |
| Added `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1` env var to opt out of the fullscreen alternate-screen renderer | ui | (unmapped) renderer init | Check env var |
| Added a "Pasting…" footer hint while a Ctrl+V image paste is being read from the clipboard | ui | (unmapped) paste footer | Progressive status |
| Fixed external SIGINT (e.g. IDE stop button, `kill -INT`) not running graceful shutdown — terminal modes are now restored and the `--resume` hint is printed | native-binary / ui | (unmapped) SIGINT handler | Graceful shutdown chain |
| Fixed an uncaught exception when the terminal is closed or SSH disconnects mid-session under the native build | native-binary | (unmapped) SIGHUP handler | Catch exception |
| Fixed `--resume` failing with `no low surrogate in string` when a tool error truncation split an emoji | resume | (unmapped) resume sanitizer | Sanitize on load |
| Fixed `--permission-mode` flag being ignored when resuming a plan-mode session | plan-mode | (unmapped) resume handler | Apply flag on resume |
| Fixed fullscreen mode showing a blank screen after laptop sleep/wake or Ctrl+Z/`fg` until the next keystroke or stream output | ui | (unmapped) renderer wake | Force redraw on focus event |
| Fixed cursor landing mid-grapheme on Ctrl+E/A/K/U/arrow keys | ui | (unmapped) cursor mover | Grapheme-aware navigation |
| Fixed vim operators corrupting text containing decomposed (NFD) accented characters | vim | (unmapped) vim operator | NFD-aware text manipulation |
| Fixed pasting text starting with `/` silently swallowing the input or triggering an unknown-command reply | ui | (unmapped) slash handler | Detect paste-start vs typed-start |
| Fixed pasting dumping stray escape sequences into the prompt when focus events or mouse-tracking reports interleave with the bracketed paste | ui | (unmapped) paste handler | Filter bracketed-paste payload |
| Fixed mouse wheel scrolling being too fast in Cursor and VS Code 1.92–1.104 due to an upstream xterm.js bug | ide | (unmapped) scroll normalizer | Per-version scaling |
| Fixed scroll-wheel handling in JetBrains IDE 2025.2 terminals | ide | (unmapped) scroll normalizer | JetBrains 2025.2 path |
| Fixed `/usage` Ctrl+S hanging when copying the stats screenshot to the clipboard on Linux/X11 | slash-cmd | (unmapped) /usage clipboard | Use async clipboard API |
| Fixed `/terminal-setup` showing a contradictory error in Windows Terminal | slash-cmd | (unmapped) /terminal-setup | Detect Windows Terminal |
| Fixed `/effort` picker not reflecting the `CLAUDE_CODE_EFFORT_LEVEL` env var override | effort | (unmapped) /effort picker | Read env var |
| Fixed `/status` showing the wrong default model for some users | slash-cmd | (unmapped) /status | Re-resolve default model |
| Fixed slash command autocomplete popup being capped at ~3–5 visible commands | slash-cmd / ui | (unmapped) slash autocomplete | Scale with terminal height |
| Fixed statusline `context_window` token counts reflecting cumulative session totals | status | (unmapped) statusline renderer | Compute current-context tokens |
| Fixed Alt+T (thinking toggle) not working on macOS terminals without "Option as Meta" enabled | thinking / ui | (unmapped) key parser | Detect raw Alt sequence |
| Fixed dead keyboard input on Windows after re-opening a background session from `claude agents` | claude-agents / ui | (unmapped) attach handler | Reset stdin mode |
| Fixed unbounded memory growth (10GB+ RSS) when a stdio MCP server writes non-protocol data to stdout | mcp | (unmapped) MCP stdio reader | Bounded buffer |
| Fixed MCP servers that connect but fail `tools/list` silently showing 0 tools | mcp | (unmapped) MCP setup | Retry + "tools fetch failed" status |
| Fixed unauthorized claude.ai MCP connectors showing as "failed" instead of "needs auth" | mcp | (unmapped) MCP connector status | Differentiate states |
| Improved visual consistency in slash command dialogs | ui | (unmapped) shared dialog component | Spacing fix |
| Updated the `/tui fullscreen` startup banner to describe additional renderer benefits | ui | (unmapped) /tui banner | Banner copy update |
| Fixed Bedrock and Vertex 400 errors when `ENABLE_PROMPT_CACHING_1H` is set | cache / auth | (unmapped) API request builder | Conditional cache TTL by provider |

---

## v2.1.131

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| Fixed VS Code extension failing to activate on Windows due to a hardcoded build path in the bundled SDK (`createRequire` polyfill bug) | ide | (unmapped) VS Code extension SDK shim | createRequire polyfill |
| Fixed Mantle endpoint authentication failing with missing `x-api-key` header | auth | (unmapped) Mantle auth | Add x-api-key header |

---

## v2.1.129

### slash-cmd / plugins / cli

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Added `--plugin-url <url>` flag to fetch a plugin `.zip` archive from a URL for the current session | plugins / cli | (unmapped) argparser | Download + register session-scoped plugin |
| Added `CLAUDE_CODE_FORCE_SYNC_OUTPUT=1` env var to force-enable synchronized output | ui | (unmapped) terminal capability | Skip auto-detection |
| Added `CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE` for Homebrew or WinGet installations | platform | (unmapped) auto-updater | Run pkg-mgr upgrade in background |
| Plugin manifests: `themes` and `monitors` should now be declared under `"experimental": { ... }` | plugins | (unmapped) plugin manifest schema | Schema migration with warning on top-level |
| Gateway `/v1/models` discovery for the `/model` picker is now opt-in via `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1` | model | (unmapped) /model picker | Gate added |
| Ctrl+R history picker now defaults to searching all prompts across all projects | ui | (unmapped) Ctrl+R picker | Switch default scope; Ctrl+S narrows |
| Third-party deployments no longer see spinner tips pointing at first-party Anthropic surfaces | ui | (unmapped) spinner tips | Provider-aware tip filter |
| `skillOverrides` setting now works: `off` hides from model and `/`, `user-invocable-only` hides from model only, `name-only` collapses description | skills | (unmapped) skill registry | Honor override levels |
| The `claude_code.pull_request.count` OTel metric now counts PRs/MRs created via MCP tools | telemetry | (unmapped) PR counter | Include MCP-tool path |
| Policy refusal error messages now include the API Request ID | api / ui | (unmapped) refusal builder | Include request id |

### fixes

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Fixed API errors with unrecognized 400 status codes showing raw JSON instead of the underlying error message | api / ui | (unmapped) API error formatter | Surface message field |
| Fixed `/clear` not resetting the terminal tab title after a conversation | slash-cmd | (unmapped) /clear handler | Reset OSC 0/2 title |
| Fixed session title chip from `/rename` disappearing while a permission or other dialog is active | session-title / ui | (unmapped) status chip | Persist across dialog |
| Fixed agent panel below the prompt being hidden when subagents are running (regression in 2.1.122) | ui | (unmapped) agent panel | Show during sub-agent runs |
| Fixed external-editor handoff (Ctrl+G) blanking the conversation history above the prompt | ui | (unmapped) editor handoff | Preserve conversation buffer |
| Fixed `/context` dumping its rendered ASCII visualization grid into the conversation, wasting ~1.6k tokens per call | slash-cmd | (unmapped) /context renderer | Don't echo grid |
| Fixed `/agents` Library list arrow-key navigation | slash-cmd | (unmapped) /agents Library | Scroll-to-focused on overflow |
| Fixed `/branch` success message not including the new branch's session id for `/resume` | slash-cmd | (unmapped) /branch | Include session id |
| Fixed bold headers with keycap/ZWJ/skin-tone emoji losing trailing characters in fullscreen mode | ui | (unmapped) header renderer | Width calc fix |
| Fixed server-managed settings policy not applying for enterprise/team users whose stored OAuth credentials lacked the `user:inference` scope | settings / oauth | (unmapped) settings resolver | Don't fail-closed on missing scope |
| Fixed OAuth refresh race after wake-from-sleep that could log out all running sessions | oauth | (unmapped) OAuth refresh on wake | Sequenced refresh |
| Fixed 1-hour prompt cache TTL being silently downgraded to 5 minutes | cache | (unmapped) cache TTL gate | Don't downgrade |
| Fixed cache-miss warning appearing spuriously after `/clear` or compaction when changing `/effort` or `/model` | cache / ui | (unmapped) cache-miss warning | Suppress after reset events |
| Fixed `Bash(mkdir *)`, `Bash(touch *)` and similar allow rules not being honored for in-project paths | permissions | (unmapped) Bash classifier | In-project path detection |
| Fixed `deniedMcpServers` patterns with a `*://` scheme wildcard not matching mixed-case hostnames | mcp / permissions | (unmapped) MCP rule matcher | Case-insensitive hostname |
| Fixed harmless WebSocket warning being logged as an error in `--debug` during voice mode | voice | (unmapped) voice logger | Downgrade to warn |
| `[VSCode]` Fixed `/clear` not clearing the conversation context and displayed transcript | ide | (unmapped) VS Code extension | Wire /clear into transcript reset |

---

## v2.1.128

### features

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Bare `/color` (no args) now picks a random session color | slash-cmd | (unmapped) /color | Random pick when no arg |
| `/mcp` now shows the tool count for connected servers and flags servers that connected with 0 tools | mcp / ui | (unmapped) /mcp picker | Show count + flag |
| `--plugin-dir` now accepts `.zip` plugin archives in addition to directories | plugins / cli | (unmapped) --plugin-dir parser | Detect .zip |
| `--channels` now works with console (API key) authentication | api | (unmapped) --channels gate | Allow API-key auth |
| Updated `/model` picker: collapsed duplicate Opus 4.7 entries | model | (unmapped) /model picker | Dedup logic |
| Subprocesses (Bash, hooks, MCP, LSP) no longer inherit `OTEL_*` environment variables | telemetry | (unmapped) subprocess env scrub | Filter OTEL_ prefix |
| MCP: `workspace` is now a reserved server name | mcp | (unmapped) MCP config loader | Reserved-name list |
| Reconnecting MCP servers no longer flood the conversation with full tool-name lists | mcp | (unmapped) MCP reconnect | Summarize re-announce |
| SDK hosts now receive a persistent `localSettings` suggestion for Bash permission prompts | permissions | (unmapped) SDK permission UI | Persistent suggestion |
| `EnterWorktree` now creates the new branch from local HEAD as documented | tools | (unmapped) EnterWorktree | Branch from HEAD |
| Auto mode: when the classifier can't evaluate an action, the error now includes a hint | permissions | (unmapped) auto-mode classifier | Hint in error message |

### fixes

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Fixed focus mode briefly dimming the previous response when submitting a new prompt | focus | (unmapped) focus renderer | Skip dim during submit |
| Fixed stray "4;0;" desktop notification on every `/exit` in Kitty and other terminals that interpret OSC 9 as a notification | ui | (unmapped) /exit handler | Don't emit OSC 9 |
| Fixed Remote Control showing an empty "Opening your options…" message on rate limit | remote-control | (unmapped) Remote Control | Surface rate-limit message |
| Fixed drag-and-drop image upload hanging on "Pasting text…" when the image read fails | ui | (unmapped) drag-drop handler | Catch + abort |
| Fixed crash loop when piping very large input (>10 MB) to `claude -p` via stdin | platform | (unmapped) stdin reader | Stream parse |
| Fixed long URLs not being individually clickable on every wrapped row in fullscreen mode | ui | (unmapped) URL renderer | Per-row OSC 8 |
| Fixed `/plugin` Components panel showing "Marketplace 'inline' not found" for plugins loaded via `--plugin-dir` | plugins / ui | (unmapped) /plugin renderer | Handle inline marketplace |
| Fixed MCP tool results dropping images when the server returns both structured content and content blocks | mcp | (unmapped) MCP result merger | Preserve both |
| Fixed fenced code blocks inside list items carrying leading whitespace into the clipboard | ui | (unmapped) copy buffer | Strip leading list-item indent |
| Fixed tab navigation in `/config` stranding focus | slash-cmd | (unmapped) /config tabs | Restore tab focus |
| Fixed markdown link labels being lost on terminals without OSC 8 hyperlink support | ui | (unmapped) link renderer | `label (url)` fallback |
| Fixed sessions on 1M-context models with a smaller autocompact window being falsely blocked with "Prompt is too long" | compact | (unmapped) autocompact gate | Don't block when below model max |
| Fixed parallel shell tool calls: a failing read-only command no longer cancels sibling calls | tools | (unmapped) parallel tool runner | Independent error scopes |
| Fixed banner showing "with X effort" on models that don't support effort | effort / ui | (unmapped) welcome banner | Gate on effort support |
| Fixed `/fast` on 3P providers fuzzy-matching to an unrelated skill instead of showing "not available" | model / slash-cmd | (unmapped) /fast handler | Provider-aware availability |
| Fixed Bedrock default model resolving to `global.*` instead of the region-appropriate prefix | model / auth | (unmapped) Bedrock default | Region-aware prefix |
| Fixed vim mode: `Space` in NORMAL mode now moves the cursor right | vim | (unmapped) vim NORMAL keymap | Space → right |
| Fixed terminal progress indicator (OSC 9;4) flickering off between tool calls | ui | (unmapped) OSC 9;4 emitter | Hold across turn |
| Fixed `/rename` without args failing on resumed sessions whose last entry is a compact boundary | session-title | (unmapped) /rename | Walk past compact boundary |
| Fixed stale "remote-control is active" status lines from prior sessions appearing after `--resume`/`--continue` | remote-control | (unmapped) status filter | Filter per session id |
| Fixed stale `installed_plugins.json` entries pointing at deleted cache directories polluting PATH | plugins | (unmapped) plugin PATH builder | Stat-check entries |
| Fixed MCP stdio servers receiving corrupted arguments when `CLAUDE_CODE_SHELL_PREFIX` is set | mcp | (unmapped) MCP stdio spawn | Proper arg quoting |
| Fixed sub-agent progress summaries missing the prompt cache (~3× `cache_creation` reduction) | subagent / cache | (unmapped) sub-agent summary | Enable cache for summary |
| Fixed `/plugin update` never detecting new versions of npm-sourced plugins | plugins | (unmapped) plugin updater | Version check for npm sources |
| Fixed sub-agent summaries firing repeatedly while a sub-agent's transcript is static | subagent | (unmapped) sub-agent summary | Dedup by transcript hash |
| Headless `--output-format stream-json`: `init.plugin_errors` now includes `--plugin-dir` load failures | plugins / headless | (unmapped) stream-json init | Aggregate plugin errors |

---

## v2.1.126

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| The `/model` picker now lists models from your gateway's `/v1/models` endpoint when `ANTHROPIC_BASE_URL` points at an Anthropic-compatible gateway | model | (unmapped) /model picker | Gateway model discovery (later opt-in in 2.1.129) |
| Added `claude project purge [path]` to delete all Claude Code state for a project | cli | (unmapped) project purge subcmd | New subcommand + dry-run/yes/interactive flags |
| `--dangerously-skip-permissions` now bypasses prompts for writes to `.claude/`, `.git/`, `.vscode/`, shell config files | permissions | (unmapped) skip-perms checker | Expand bypass list with catastrophic-removal safety net |
| `claude auth login` now accepts the OAuth code pasted into the terminal | oauth | (unmapped) auth login | OOB code paste fallback |
| `claude_code.skill_activated` OpenTelemetry event now fires for user-typed slash commands and carries a new `invocation_trigger` attribute | telemetry | (unmapped) skill_activated emit | Add trigger attribute |
| Auto mode: the spinner now turns red when a permission check stalls | permissions / ui | (unmapped) spinner color | Stall detection |
| Host-managed deployments no longer auto-disable analytics on Bedrock/Vertex/Foundry | telemetry / auth | (unmapped) analytics gate | Honor host-managed flag |
| Windows: PowerShell 7 installed via the Microsoft Store, MSI without PATH, or `.NET global tool` is now detected | platform | (unmapped) Windows PowerShell detect | Probe known install locations |
| Windows: when the PowerShell tool is enabled, Claude now treats PowerShell as the primary shell | platform | (unmapped) shell selection | PowerShell-first on Windows |
| Read tool: removed the per-file malware-assessment reminder | tools | (unmapped) Read tool prompt | Remove malware reminder |
| **Security:** Fixed `allowManagedDomainsOnly` / `allowManagedReadPathsOnly` being ignored when a higher-priority managed-settings source lacked a `sandbox` block | sandbox | (unmapped) managed-settings merger | Inherit allowOnly flags through merge |
| Fixed pasting an image larger than 2000px breaking the session | ui | (unmapped) image paste handler | Downscale + retry |
| Fixed showing the login screen for "OAuth not allowed for organization" errors | oauth | (unmapped) login error handler | Distinct path |
| Fixed OAuth login failing with timeout on slow or proxied connections, in IPv6-only devcontainers | oauth | (unmapped) OAuth flow | Timeout + IPv6 path |
| Fixed a rare race where a concurrent credential write could clear a valid OAuth refresh token | oauth | (unmapped) credentials writer | Locking |
| Fixed API retry countdown sticking at "0s" | api / ui | (unmapped) retry countdown | Tick timer |
| Fixed "Stream idle timeout" error after waking Mac from sleep mid-request | api | (unmapped) stream watchdog | Reset on wake |
| Fixed background and remote sessions falsely aborting with "Stream idle timeout" during long model thinking pauses | api | (unmapped) stream watchdog | Skip during thinking |
| Fixed a hang where the assistant could finish thinking but show no output after a run of empty turns | thinking | (unmapped) turn completion | Detect empty turns |
| Fixed overly fast trackpad scrolling in Cursor and VS Code 1.92–1.104 integrated terminals | ide | (unmapped) scroll normalizer | Tune for these IDEs |
| Fixed claude.ai MCP connectors being suppressed by manual servers stuck in needs-auth state | mcp | (unmapped) MCP listing | Show despite needs-auth conflict |
| Fixed Japanese/Korean/Chinese text rendering as garbled characters on Windows in no-flicker mode | ui | (unmapped) Windows ANSI handling | Use UTF-16 output |
| Fixed `Ctrl+L` clearing the prompt input | ui | (unmapped) keybinding | Force-redraw only |
| Fixed deferred tools (WebSearch, WebFetch, etc.) not being available to skills with `context: fork` and other subagents on their first turn | tools / subagent | (unmapped) tool registry | Include deferred tools in fork inheritance |
| Fixed plan-mode tools being unavailable in interactive sessions launched with `--channels` | plan-mode | (unmapped) plan-mode init | Apply tools regardless of channels mode |
| Fixed `/plugin` Uninstall reporting "Enabled" instead of "Uninstalled" | plugins / ui | (unmapped) /plugin Uninstall | Correct status message |
| Bounded total size of file-modified reminders when a linter touches many files at once | ui | (unmapped) file-modified reminder | Cap total size |
| Fixed `/remote-control` retries appearing stuck on "connecting…" | remote-control | (unmapped) reconnect status | Show result per attempt |
| Fixed Remote Control failure notification not showing the error reason for initial connection failures | remote-control | (unmapped) connect error | Include reason |
| Windows: clipboard writes no longer expose copied content in process command-line arguments | platform | (unmapped) Windows clipboard | Use stdin pipe |
| PowerShell tool: bare `--` is no longer mis-flagged as the `--%` stop-parsing token | permissions | (unmapped) PowerShell classifier | Distinguish |
| Fixed Agent SDK hang when the model emits a malformed tool name in a parallel tool call batch | sdk | (unmapped) tool dispatcher | Bail on malformed |

---

## v2.1.123

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| Fixed OAuth authentication failing with a 401 retry loop when `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` is set | oauth | (unmapped) auth retry | Don't retry on beta-gated 401 |

---

## v2.1.122

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| Added `ANTHROPIC_BEDROCK_SERVICE_TIER` environment variable | auth | (unmapped) Bedrock client | Send X-Amzn-Bedrock-Service-Tier header |
| Pasting a PR URL into the `/resume` search box now finds the session that created that PR | resume | (unmapped) /resume search | PR URL match (GitHub, GHE, GitLab, Bitbucket) |
| `/mcp` now shows claude.ai connectors hidden by a manually-added server with the same URL | mcp / ui | (unmapped) /mcp listing | Show hidden connectors |
| Clarified the `/mcp` message shown when an MCP server is still unauthorized after the browser sign-in flow | mcp | (unmapped) /mcp messaging | Better copy |
| OpenTelemetry: numeric attributes on `api_request`/`api_error` log events are now emitted as numbers, not strings | telemetry | (unmapped) OTel emitter | Type-coerce numerics |
| OpenTelemetry: added `claude_code.at_mention` log event | telemetry | (unmapped) @-mention OTel | New event |
| Fixed `/branch` producing forks that fail with "tool_use ids were found without tool_result blocks" | slash-cmd | (unmapped) /branch transcript copy | Filter rewound entries |
| Fixed `/model` not showing the Effort option for Bedrock application inference profile ARNs | model / auth | (unmapped) /model picker | Detect IP ARN, honor effort |
| Fixed Vertex AI / Bedrock returning `invalid_request_error: output_config` | auth | (unmapped) API request builder | Conditional output_config |
| Fixed Vertex AI `count_tokens` endpoint returning 400 errors for users behind proxy gateways | auth | (unmapped) Vertex count_tokens | Proxy-compatible request |
| Fixed `spinnerTipsOverride.excludeDefault` not suppressing the time-based spinner tips | ui | (unmapped) spinner tips | Honor excludeDefault for time-based |
| Fixed ToolSearch missing MCP tools that connected after session start in nonblocking mode | tools | (unmapped) ToolSearch index | Re-index on MCP connect |
| Fixed `!exit` / `!quit` in bash mode terminating the CLI instead of running as a shell command | ui | (unmapped) bash-mode handler | Don't intercept !exit/!quit |
| Fixed images sent to newer models being resized to 2576px per side instead of the correct 2000px maximum | model / ui | (unmapped) image resize | 2000px cap |
| Fixed remote control session idle status redrawing twice per second | remote-control | (unmapped) status update rate | Throttle |
| Fixed assistant messages appearing blank in some sessions due to a stale view preference | state / ui | (unmapped) view preference | Clear on session load |
| Fixed a malformed hooks entry in `settings.json` no longer invalidating the entire file | settings / hooks | (unmapped) settings loader | Skip malformed entry |
| Voice mode: keybindings bound to Caps Lock now show an error | voice | (unmapped) keybinding parser | Caps Lock detection |

---

## v2.1.121

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| Added `alwaysLoad` option to MCP server config | mcp | (unmapped) MCP config schema | New option; skip ToolSearch deferral |
| Added `claude plugin prune` to remove orphaned auto-installed plugin dependencies | plugins / cli | (unmapped) plugin prune subcmd | New subcommand |
| Added a type-to-filter search box to `/skills` | slash-cmd / ui | (unmapped) /skills picker | Filter box |
| PostToolUse hooks can now replace tool output for all tools via `hookSpecificOutput.updatedToolOutput` | hooks | (unmapped) hook dispatch | Honor field for all tools |
| Fullscreen mode: typing into the prompt no longer jumps scroll back to the bottom | ui | (unmapped) scroll on input | Preserve scroll pos |
| Dialogs that overflow the terminal are now scrollable | ui | (unmapped) dialog renderer | Add scroll handlers |
| Clicking any line of a long URL that wraps across rows in fullscreen mode now opens the full URL | ui | (unmapped) URL hit-test | Multi-row URL handling |
| SDK and `claude -p`: `CLAUDE_CODE_FORK_SUBAGENT=1` now works in non-interactive sessions | subagent | (unmapped) fork-subagent gate | Allow in -p mode |
| `--dangerously-skip-permissions` no longer prompts for writes to `.claude/skills/`, `.claude/agents/`, and `.claude/commands/` | permissions | (unmapped) skip-perms checker | Expand bypass set |
| `/terminal-setup` now enables iTerm2's "Applications in terminal may access clipboard" setting so `/copy` works, including from tmux | platform | (unmapped) /terminal-setup | iTerm2 prefs writer |
| MCP servers that hit a transient error during startup now auto-retry up to 3 times | mcp | (unmapped) MCP setup | Retry policy |
| The terminal tab session title is now generated in your configured `language` setting | ui | (unmapped) tab title | Use language setting |
| Claude.ai connectors with the same upstream URL are now deduplicated | mcp | (unmapped) MCP listing | Dedup by URL |
| Vertex AI: support X.509 certificate-based Workload Identity Federation (mTLS ADC) | auth | (unmapped) Vertex auth | mTLS ADC path |
| Faster startup after upgrading: removed the Recent Activity panel from the release-notes splash | ui | (unmapped) release-notes splash | Remove panel |
| LSP diagnostic summaries now expand on click/ctrl+o and show the expand hint | lsp / ui | (unmapped) LSP diagnostics renderer | Expand action |
| SDK: `mcp_authenticate` now supports `redirectUri` for custom scheme completion and claude.ai connectors | sdk / mcp | (unmapped) mcp_authenticate | redirectUri param |
| OpenTelemetry: added `stop_reason`, `gen_ai.response.finish_reasons`, and `user_system_prompt` to LLM request spans | telemetry | (unmapped) OTel attrs | New attrs; gate user_system_prompt on OTEL_LOG_USER_PROMPTS |
| `[VSCode]` Voice dictation now respects the `accessibility.voice.speechLanguage` setting | ide / voice | (unmapped) VS Code voice | Read setting |
| `[VSCode]` `/context` now opens a native token usage dialog | ide / slash-cmd | (unmapped) VS Code /context | Native dialog |
| Fixed unbounded memory growth (multi-GB RSS) when processing many images in a session | ui / memory | (unmapped) image cache | Bounded LRU |
| Fixed `/usage` leaking up to ~2GB of memory on machines with large transcript histories | slash-cmd / memory | (unmapped) /usage | Streamed parse |
| Fixed memory leak when long-running tools fail to emit a clear progress event | tools | (unmapped) tool progress | Release on tool end |
| Fixed Bash tool becoming permanently unusable when the directory Claude was started in is deleted or moved mid-session | tools | (unmapped) Bash tool cwd | Re-anchor cwd |
| Fixed `--resume` crashing on startup in external builds | resume | (unmapped) resume init | External-build path |
| Fixed `--resume` failing on large sessions when a transcript line was corrupted | resume | (unmapped) transcript loader | Skip corrupt line |
| Fixed `thinking.type.enabled is not supported` error when using Bedrock application inference profile ARNs | thinking / auth | (unmapped) Bedrock IP request | Detect IP ARN; skip thinking param |
| Fixed Microsoft 365 MCP OAuth failing with duplicate or unsupported `prompt` parameter | mcp / oauth | (unmapped) MCP OAuth | Filter prompt param for MS365 |
| Fixed scrollback duplication when pressing Ctrl+L or triggering a redraw in non-fullscreen mode | ui | (unmapped) redraw path | Don't duplicate scrollback |
| Fixed claude.ai MCP connectors silently disappearing when the connector-list fetch hits a transient auth error at startup | mcp | (unmapped) MCP listing | Retry transient auth errors |
| Fixed "Always allow" rules for built-in tools in remote sessions not surviving worker restarts | permissions | (unmapped) remote permission state | Persist across worker restart |
| Fixed `NO_PROXY` not being respected for all HTTP clients when set via `managed-settings.json` under the native build | platform / proxy | (unmapped) HTTP client init | Read managed-settings proxy |
| Fixed managed settings approval prompt exiting the session even when accepted | settings | (unmapped) approval handler | Continue on accept |
| Fixed `/usage` returning "rate limited" after a stale OAuth token | slash-cmd / oauth | (unmapped) /usage fetch | Refresh on 401 |
| Fixed invalid legacy enum values in `settings.json` invalidating the entire settings file | settings | (unmapped) settings parser | Coerce invalid enums |
| Fixed `/usage` dialog content being clipped when no-flicker mode is off | slash-cmd / ui | (unmapped) /usage dialog | Resize handler |
| Fixed `/focus` showing "Unknown command" when the fullscreen renderer is off | focus / slash-cmd | (unmapped) /focus handler | Show hint instead |
| Fixed embedded grep/find/rg shell wrappers failing when the running binary is deleted mid-session | native-binary / tools | (unmapped) embedded tool resolver | Fallback to installed |
| Reduced peak file descriptor usage during `find` in the Bash tool on large directory trees | tools | (unmapped) find runner | Stream output |

---

## v2.1.120

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| Windows: Git for Windows (Git Bash) is no longer required — when absent, Claude Code uses PowerShell as the shell tool | platform | (unmapped) Windows shell detect | PowerShell fallback |
| Added `claude ultrareview [target]` subcommand to run `/ultrareview` non-interactively from CI or scripts | cli / slash-cmd | (unmapped) ultrareview subcmd | New subcommand |
| Skills can now reference the current effort level with `${CLAUDE_EFFORT}` in their content | skills / effort | (unmapped) skill template renderer | Substitute env var |
| Set `AI_AGENT` environment variable for subprocesses so `gh` can attribute traffic to Claude Code | telemetry | (unmapped) subprocess env | Set AI_AGENT |
| Spinner tips that recommend installing the desktop app or creating skills/agents are now hidden when you already have them | ui | (unmapped) spinner tips | Suppress when feature present |
| Show a "use PgUp/PgDn to scroll" hint when the terminal sends arrow keys instead of scroll events | ui | (unmapped) scroll handler | Show hint on arrow-key scroll attempt |
| Faster session start when you have many claude.ai connectors configured but not authorized | mcp | (unmapped) connector init | Skip needs-auth at startup |
| The auto mode denial message now links to the configuration docs | permissions / ui | (unmapped) denial message | Add docs link |
| `claude plugin validate` now accepts `$schema`, `version`, and `description` at the top level of `marketplace.json` and `$schema` in `plugin.json` | plugins | (unmapped) plugin validator | Allow these top-level keys |
| Auto-compact in auto mode now displays `auto` (lowercase, no token count) | compact / ui | (unmapped) auto-compact UI | Show "auto" label |
| Fixed pressing Esc during a stdio MCP tool call closing the entire server connection (regression in 2.1.105) | mcp | (unmapped) MCP stdio Esc handler | Abort tool only |
| Fixed `/rewind` and other interactive overlays not responding to keyboard input after launching with `claude --resume` | resume / ui | (unmapped) input focus | Restore focus on resume |
| Fixed terminal scrollback duplication in non-fullscreen mode | ui | (unmapped) redraw path | Don't duplicate |
| Fixed `DISABLE_TELEMETRY` / `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` not suppressing usage metrics telemetry | telemetry | (unmapped) telemetry gate | Honor env vars for usage metrics |
| Fixed false-positive "Dangerous rm operation" permission prompts in auto mode for multi-line bash commands containing both a pipe and a redirect | permissions | (unmapped) rm-danger classifier | Don't false-flag pipe+redirect cases |
| Fixed long selection menus clipping below the terminal in fullscreen mode | ui | (unmapped) menu scrolling | Keep focused option on screen |
| Fixed Write tool output collapsing instead of expanding when clicking "+N lines" in fullscreen | tools / ui | (unmapped) Write tool renderer | Expand on click |
| Fixed slash command picker jumping while typing | slash-cmd / ui | (unmapped) slash autocomplete | Stabilize sort |
| Fixed `/plugin` marketplace failing to load when one entry uses an unrecognized source format | plugins | (unmapped) marketplace loader | Continue on entry parse fail |
| `[VSCode]` `/usage` now opens the native Account & Usage dialog | ide | (unmapped) VS Code /usage | Native dialog |
| `[VSCode]` Voice dictation now respects the `language` setting in `~/.claude/settings.json` | ide / voice | (unmapped) VS Code voice | Read language setting |
| Fixed `find` in the Bash tool exhausting open file descriptors on large directory trees | tools / platform | (unmapped) find runner | Stream + close descriptors |

---

## v2.1.119

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| `/config` settings (theme, editor mode, verbose, etc.) now persist to `~/.claude/settings.json` and participate in project/local/policy override precedence | settings / slash-cmd | (unmapped) /config | Write to settings.json |
| Added `prUrlTemplate` setting to point the footer PR badge at a custom code-review URL | settings / ui | (unmapped) PR badge | Use template |
| Added `CLAUDE_CODE_HIDE_CWD` environment variable to hide the working directory in the startup logo | ui | (unmapped) startup logo | Honor env var |
| `--from-pr` now accepts GitLab merge-request, Bitbucket pull-request, and GitHub Enterprise PR URLs | cli | (unmapped) --from-pr parser | Add hosts |
| `--print` mode now honors the agent's `tools:` and `disallowedTools:` frontmatter | cli / subagent | (unmapped) print-mode tool registry | Apply frontmatter |
| `--agent <name>` now honors the agent definition's `permissionMode` for built-in agents | subagent / permissions | (unmapped) --agent runner | Honor agent permission mode |
| PowerShell tool commands can now be auto-approved in permission mode, matching Bash behavior | permissions | (unmapped) PowerShell auto-approve | Mirror Bash logic |
| Hooks: `PostToolUse` and `PostToolUseFailure` hook inputs now include `duration_ms` | hooks | (unmapped) hook input | Add field |
| Subagent and SDK MCP server reconfiguration now connects servers in parallel instead of serially | subagent / mcp | (unmapped) MCP connector | Parallel connect |
| Plugins pinned by another plugin's version constraint now auto-update to the highest satisfying git tag | plugins | (unmapped) plugin updater | Resolve highest satisfying |
| Vim mode: Esc in INSERT no longer pulls a queued message back into the input; press Esc again to interrupt | vim | (unmapped) vim INSERT keymap | Distinguish first/second Esc |
| Slash command suggestions now highlight the characters that matched your query | slash-cmd / ui | (unmapped) suggestion renderer | Highlight matched chars |
| Slash command picker now wraps long descriptions onto a second line | slash-cmd / ui | (unmapped) suggestion renderer | Multi-line description |
| `owner/repo#N` shorthand links in output now use your git remote's host instead of always pointing at github.com | ui | (unmapped) link resolver | Use git remote host |
| Security: `blockedMarketplaces` now correctly enforces `hostPattern` and `pathPattern` entries | plugins | (unmapped) marketplace matcher | Apply both fields |
| OpenTelemetry: `tool_result` and `tool_decision` events now include `tool_use_id`; `tool_result` also includes `tool_input_size_bytes` | telemetry | (unmapped) tool_result emit | Add fields |
| Status line: stdin JSON now includes `effort.level` and `thinking.enabled` | status / hooks | (unmapped) statusline input | Add fields |
| Fixed pasting CRLF content (Windows clipboards, Xcode console) inserting an extra blank line | ui | (unmapped) paste handler | Strip lone CR |
| Fixed multi-line paste losing newlines in terminals using kitty keyboard protocol sequences | ui | (unmapped) paste handler | Kitty bracketed-paste tolerance |
| Fixed Glob and Grep tools disappearing on native macOS/Linux builds when the Bash tool is denied | tools | (unmapped) embedded tool gate | Keep Glob/Grep when Bash denied |
| Fixed scrolling up in fullscreen mode snapping back to the bottom every time a tool finishes | ui | (unmapped) scroll-on-tool-end | Preserve user scroll pos |
| Fixed MCP HTTP connections failing with "Invalid OAuth error response" when servers returned non-JSON bodies | mcp / oauth | (unmapped) MCP OAuth error handler | Tolerate non-JSON |
| Fixed Rewind overlay showing "(no prompt)" for messages with image attachments | ui | (unmapped) rewind renderer | Show image attachment marker |
| Fixed auto mode overriding plan mode with conflicting "Execute immediately" instructions | plan-mode | (unmapped) auto-mode + plan-mode | Plan-mode wins |
| Fixed async `PostToolUse` hooks that emit no response payload writing empty entries to the session transcript | hooks | (unmapped) hook output handler | Skip empty payloads |
| Fixed spinner staying on when a subagent task notification is orphaned in the queue | ui | (unmapped) spinner state | Clear on orphan |
| Tool search is now disabled by default on Vertex AI to avoid an unsupported beta header error (opt in with `ENABLE_TOOL_SEARCH`) | tools / auth | (unmapped) ToolSearch gate | Disable on Vertex unless opted in |
| Fixed `@`-file Tab completion replacing the entire prompt when used inside a slash command with an absolute path | ui | (unmapped) @ completion | Replace only the @-token |
| Fixed a stray `p` character appearing at the prompt on startup in macOS Terminal.app via Docker or SSH | ui | (unmapped) startup input flush | Discard pre-init input |
| Fixed `${ENV_VAR}` placeholders in `headers` for HTTP/SSE/WebSocket MCP servers not being substituted before requests | mcp | (unmapped) MCP request builder | Substitute headers |
| Fixed MCP OAuth client secret stored via `--client-secret` not being sent during token exchange | mcp / oauth | (unmapped) MCP OAuth exchange | Include client_secret |
| Fixed `/skills` Enter key closing the dialog instead of pre-filling `/<skill-name>` | slash-cmd / ui | (unmapped) /skills picker | Enter pre-fills |
| Fixed `/agents` detail view mislabeling built-in tools unavailable to subagents as "Unrecognized" | slash-cmd / ui | (unmapped) /agents detail | Distinguish unavailable |
| Fixed MCP servers from plugins not spawning on Windows when the plugin cache was incomplete | plugins / mcp | (unmapped) plugin MCP launcher | Pre-check cache |
| Fixed `/export` showing the current default model instead of the model the conversation actually used | model / ui | (unmapped) /export | Read conversation-used model |
| Fixed verbose output setting not persisting after restart | settings | (unmapped) verbose setting | Persist correctly |
| Fixed `/usage` progress bars overlapping with their "Resets …" labels | ui | (unmapped) /usage renderer | Reserve label space |
| Fixed plugin MCP servers failing when `${user_config.*}` references an optional field left blank | plugins / mcp | (unmapped) user_config resolver | Allow blank optional |
| Fixed list items containing a sentence-final number wrapping the number onto its own line | ui | (unmapped) markdown list wrapper | Prevent number-orphan |
| Fixed `/plan` and `/plan open` not acting on the existing plan when entering plan mode | plan-mode | (unmapped) /plan handler | Detect existing plan |
| Fixed skills invoked before auto-compaction being re-executed against the next user message | skills / compact | (unmapped) invoked-skills carryover | Dedupe across compact |
| Fixed `/reload-plugins` and `/doctor` reporting load errors for disabled plugins | plugins | (unmapped) plugin error filter | Skip disabled |
| Fixed Agent tool with `isolation: "worktree"` reusing stale worktrees from prior sessions | subagent | (unmapped) Agent worktree picker | Detect stale worktrees |
| Fixed disabled MCP servers appearing as "failed" in `/status` | mcp / status | (unmapped) status renderer | Show "disabled" instead |
| Fixed `TaskList` returning tasks in arbitrary filesystem order instead of sorted by ID | tools | (unmapped) TaskList tool | Sort by ID |
| Fixed spurious "GitHub API rate limit exceeded" hints when `gh` output contained PR titles mentioning "rate limit" | ui | (unmapped) gh output parser | Match against exit code, not substring |
| Fixed SDK/bridge `read_file` not correctly enforcing size cap on growing files | sdk / tools | (unmapped) read_file bridge | Re-check size on read |
| Fixed PR not linked to session when working in a git worktree | slash-cmd | (unmapped) PR detection | Walk worktrees |
| Fixed `/doctor` warning about MCP server entries overridden by a higher-precedence scope | slash-cmd / mcp | (unmapped) /doctor | Distinguish "overridden" from "broken" |
| Windows: removed false-positive "Windows requires 'cmd /c' wrapper" MCP config warning | mcp / platform | (unmapped) MCP config validator | Don't warn |
| `[VSCode]` Fixed voice dictation's first recording producing nothing on macOS while the microphone permission prompt is showing | ide / voice | (unmapped) VS Code voice | Wait for permission |

---

## v2.1.118

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| Added vim visual mode (`v`) and visual-line mode (`V`) with selection, operators, and visual feedback | vim | (unmapped) vim mode | Implement v/V modes |
| Merged `/cost` and `/stats` into `/usage` | slash-cmd | (unmapped) /usage | Redirect entries |
| Create and switch between named custom themes from `/theme` | ui / theme | (unmapped) /theme | Theme registry |
| Hooks can now invoke MCP tools directly via `type: "mcp_tool"` | hooks / mcp | (unmapped) hook dispatch | New hook type |
| Added `DISABLE_UPDATES` env var to completely block all update paths including manual `claude update` | platform | (unmapped) updater gate | New env var |
| WSL on Windows can now inherit Windows-side managed settings via the `wslInheritsWindowsSettings` policy key | settings / platform | (unmapped) settings resolver | Cross-WSL settings inherit |
| Auto mode: include `"$defaults"` in `autoMode.allow`, `autoMode.soft_deny`, or `autoMode.environment` to add custom rules alongside the built-in list | permissions | (unmapped) auto-mode merger | Add $defaults alias |
| Added a "Don't ask again" option to the auto mode opt-in prompt | permissions / ui | (unmapped) auto-mode opt-in | Persist on opt-in |
| Added `claude plugin tag` to create release git tags for plugins with version validation | plugins / cli | (unmapped) plugin tag subcmd | New subcommand |
| `--continue`/`--resume` now find sessions that added the current directory via `/add-dir` | resume | (unmapped) /resume | Include /add-dir paths |
| `/color` now syncs the session accent color to claude.ai/code when Remote Control is connected | slash-cmd / remote-control | (unmapped) /color | Sync to Remote Control |
| The `/model` picker now honors `ANTHROPIC_DEFAULT_*_MODEL_NAME`/`_DESCRIPTION` overrides when using a custom `ANTHROPIC_BASE_URL` gateway | model | (unmapped) /model picker | Read overrides |
| When auto-update skips a plugin due to another plugin's version constraint, the skip now appears in `/doctor` and the `/plugin` Errors tab | plugins | (unmapped) plugin auto-update | Emit skip events |
| Fixed `/mcp` menu hiding OAuth Authenticate/Re-authenticate actions for servers configured with `headersHelper`, and HTTP/SSE MCP servers with custom headers being stuck in "needs authentication" after a transient 401 | mcp / oauth | (unmapped) /mcp menu + auth recover | Show auth actions; recover from 401 |
| Fixed MCP servers whose OAuth token response omits `expires_in` requiring re-authentication every hour | mcp / oauth | (unmapped) MCP token parser | Default expiry if absent |
| Fixed MCP step-up authorization silently refreshing instead of prompting for re-consent when the server's `insufficient_scope` 403 names a scope the current token already has | mcp / oauth | (unmapped) MCP auth flow | Detect re-consent need |
| Fixed an unhandled promise rejection when an MCP server's OAuth flow times out or is cancelled | mcp / oauth | (unmapped) MCP OAuth flow | Catch rejection |
| Fixed MCP OAuth refresh proceeding without its cross-process lock under contention | mcp / oauth | (unmapped) MCP OAuth refresh | Cross-process lock |
| Fixed macOS keychain race where a concurrent MCP token refresh could overwrite a freshly-refreshed OAuth token | mcp / oauth | (unmapped) keychain writer | Lock + check |
| Fixed OAuth token refresh failing when the server revokes a token before its local expiry time | oauth | (unmapped) OAuth refresh | Handle pre-expiry revoke |
| Fixed credential save crash on Linux/Windows corrupting `~/.claude/.credentials.json` | oauth | (unmapped) credentials writer | Atomic write |
| Fixed `/login` having no effect in a session launched with `CLAUDE_CODE_OAUTH_TOKEN` | oauth | (unmapped) /login handler | Clear env token |
| Fixed unreadable text in the "new messages" scroll pill and `/plugin` badges | ui | (unmapped) pill renderer | Improve contrast |
| Fixed plan acceptance dialog offering "auto mode" instead of "bypass permissions" when running with `--dangerously-skip-permissions` | plan-mode | (unmapped) plan dialog | Provider-mode-aware copy |
| Fixed agent-type hooks failing with "Messages are required for agent hooks" when configured for events other than `Stop` or `SubagentStop` | hooks | (unmapped) hook validator | Allow non-Stop events |
| Fixed `prompt` hooks re-firing on tool calls made by an agent-hook verifier subagent | hooks / subagent | (unmapped) hook context propagation | Track verifier subagent origin |
| Fixed `/fork` writing the full parent conversation to disk per fork | slash-cmd | (unmapped) /fork | Write pointer instead |
| Fixed Alt+K / Alt+X / Alt+^ / Alt+_ freezing keyboard input | ui | (unmapped) key parser | Don't freeze on these |
| Fixed connecting to a remote session overwriting your local `model` setting in `~/.claude/settings.json` | remote-control / settings | (unmapped) remote-control init | Scope model override |
| Fixed typeahead showing "No commands match" error when pasting file paths that start with `/` | ui | (unmapped) typeahead | Detect path-paste |
| Fixed `plugin install` on an already-installed plugin not re-resolving a dependency installed at the wrong version | plugins | (unmapped) plugin installer | Re-resolve deps |
| Fixed unhandled errors from file watcher on invalid paths or fd exhaustion | platform | (unmapped) file watcher | Catch + recover |
| Fixed Remote Control sessions getting archived on transient CCR initialization blips during JWT refresh | remote-control | (unmapped) Remote Control state | Tolerate transient init blips |
| Fixed subagents resumed via `SendMessage` not restoring the explicit `cwd` they were spawned with | subagent | (unmapped) SendMessage resume | Restore cwd |

---

## v2.1.117

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| Forked subagents can now be enabled on external builds by setting `CLAUDE_CODE_FORK_SUBAGENT=1` | subagent | (unmapped) fork-subagent gate | Lift external-build restriction |
| Agent frontmatter `mcpServers` are now loaded for main-thread agent sessions via `--agent` | subagent / mcp | (unmapped) --agent runner | Honor mcpServers frontmatter |
| Improved `/model`: selections now persist across restarts even when the project pins a different model | model | (unmapped) /model picker | Distinguish session vs project pin |
| The `/resume` command now offers to summarize stale, large sessions before re-reading them | resume | (unmapped) /resume | Pre-summarize prompt |
| Faster startup when both local and claude.ai MCP servers are configured (concurrent connect now default) | mcp | (unmapped) MCP startup | Concurrent connect default |
| `plugin install` on an already-installed plugin now installs any missing dependencies | plugins | (unmapped) plugin installer | Continue past "already installed" |
| Plugin dependency errors now say "not installed" with an install hint, and `claude plugin marketplace add` now auto-resolves missing dependencies from configured marketplaces | plugins | (unmapped) plugin dep resolver | Clearer error + auto-resolve |
| Managed-settings `blockedMarketplaces` and `strictKnownMarketplaces` are now enforced on plugin install, update, refresh, and autoupdate | plugins | (unmapped) plugin policy enforce | Apply policy at all entry points |
| Advisor Tool (experimental): dialog now carries an "experimental" label, learn-more link, and startup notification when enabled; sessions no longer get stuck with "Advisor tool result content could not be processed" errors on every prompt and `/compact` | tools | (unmapped) Advisor Tool wiring | Wire experimental UI + error recovery |
| The `cleanupPeriodDays` retention sweep now also covers `~/.claude/tasks/`, `~/.claude/shell-snapshots/`, and `~/.claude/backups/` | platform | (unmapped) cleanup sweep | Extended path list |
| OpenTelemetry: `user_prompt` events now include `command_name` and `command_source` for slash commands; `cost.usage`, `token.usage`, `api_request`, and `api_error` now include an `effort` attribute | telemetry | (unmapped) OTel emitters | New fields |
| Native builds on macOS and Linux: the `Glob` and `Grep` tools are replaced by embedded `bfs` and `ugrep` available through the Bash tool | tools / native-binary | (unmapped) embedded tool resolver | bfs/ugrep wrappers |
| Windows: cached `where.exe` executable lookups per process for faster subprocess launches | platform | (unmapped) where.exe cache | Per-process cache |
| Default effort for Pro/Max subscribers on Opus 4.6 and Sonnet 4.6 is now `high` (was `medium`) | effort | (unmapped) getDefaultEffortForModel | New tier-model mapping |
| Fixed Plain-CLI OAuth sessions dying with "Please run /login" when the access token expires mid-session — the token is now refreshed reactively on 401 | oauth | (unmapped) API client 401 handler | Reactive refresh |
| Fixed `WebFetch` hanging on very large HTML pages by truncating input before HTML-to-markdown conversion | tools | (unmapped) WebFetch | Truncate before convert |
| Fixed a crash when a proxy returns HTTP 204 No Content | api / proxy | (unmapped) HTTP response handler | Handle 204 without body |
| Fixed `/login` having no effect when launched with `CLAUDE_CODE_OAUTH_TOKEN` env var and that token expires | oauth | (unmapped) /login handler | Clear env token on /login |
| Fixed prompt-input undo (`Ctrl+_`) doing nothing immediately after typing, and skipping a state on each undo step | ui | (unmapped) undo stack | Snapshot on each char |
| Fixed `NO_PROXY` not being respected for remote API requests when running under Bun | platform / proxy | (unmapped) HTTP client init | Bun-specific NO_PROXY handling |
| Fixed rare spurious escape/return triggers when key names arrive as coalesced text over slow connections | ui | (unmapped) key event parser | Distinguish text from key |
| Fixed SDK `reload_plugins` reconnecting all user MCP servers serially | sdk / mcp | (unmapped) reload_plugins | Parallel reconnect |
| Fixed Bedrock application-inference-profile requests failing with 400 when backed by Opus 4.7 with thinking disabled | thinking / auth | (unmapped) Bedrock IP request | Strip thinking config when disabled |
| Fixed MCP `elicitation/create` requests auto-cancelling in print/SDK mode when the server finishes connecting mid-turn | mcp | (unmapped) MCP elicitation handler | Don't auto-cancel during connect |
| Fixed subagents running a different model than the main agent incorrectly flagging file reads with a malware warning | subagent / tools | (unmapped) malware-warning gate | Apply per-model |
| Fixed idle re-render loop when background tasks are present, reducing memory growth on Linux | ui / memory | (unmapped) render scheduler | Skip when idle |
| `[VSCode]` Fixed "Manage Plugins" panel breaking when multiple large marketplaces are configured | ide | (unmapped) VS Code plugins panel | Streamed render |
| Fixed Opus 4.7 sessions showing inflated `/context` percentages and autocompacting too early — Claude Code was computing against a 200K context window instead of Opus 4.7's native 1M | compact / model | (unmapped) context window resolver | Use 1M for Opus 4.7 |

---

## v2.1.116

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| `/resume` on large sessions is significantly faster (up to 67% on 40MB+ sessions) and handles sessions with many dead-fork entries more efficiently | resume | (unmapped) resume loader | Streamed parser; dead-fork pruning |
| Faster MCP startup when multiple stdio servers are configured; `resources/templates/list` is now deferred to first `@`-mention | mcp | (unmapped) MCP startup | Defer templates/list |
| Smoother fullscreen scrolling in VS Code, Cursor, and Windsurf terminals — `/terminal-setup` now configures the editor's scroll sensitivity | ide / ui | (unmapped) /terminal-setup | Per-editor scroll settings |
| Thinking spinner now shows progress inline ("still thinking", "thinking more", "almost done thinking") | thinking / ui | (unmapped) thinking spinner | Inline progressive states |
| `/config` search now matches option values (e.g. searching "vim" finds the Editor mode setting) | slash-cmd | (unmapped) /config search | Match values |
| `/doctor` can now be opened while Claude is responding | slash-cmd | (unmapped) /doctor | Allow during turn |
| `/reload-plugins` and background plugin auto-update now auto-install missing plugin dependencies | plugins | (unmapped) plugin reload | Auto-install deps |
| Bash tool now surfaces a hint when `gh` commands hit GitHub's API rate limit | tools | (unmapped) Bash tool output | Detect gh rate limit |
| The Usage tab in Settings now shows your 5-hour and weekly usage immediately and no longer fails when the usage endpoint is rate-limited | settings / ui | (unmapped) Usage tab | Immediate render + rate-limit fallback |
| Agent frontmatter `hooks:` now fire when running as a main-thread agent via `--agent` | subagent / hooks | (unmapped) --agent runner | Honor hooks frontmatter |
| Slash command menu now shows "No commands match" when your filter has zero results | slash-cmd / ui | (unmapped) slash autocomplete | Zero-result state |
| Security: sandbox auto-allow no longer bypasses the dangerous-path safety check for `rm`/`rmdir` targeting `/`, `$HOME`, or other critical system directories | sandbox / permissions | (unmapped) sandbox auto-allow | Always apply dangerous-path check |
| Claude Code and installer now use `https://downloads.claude.ai/claude-code-releases` instead of `https://storage.googleapis.com/claude-code-dist-...` | platform | (unmapped) installer URLs | New base URL |
| Fixed Devanagari and other Indic scripts rendering with broken column alignment | ui | (unmapped) Indic width handling | Grapheme-aware width |
| Fixed Ctrl+- not triggering undo in terminals using the Kitty keyboard protocol | ui / keybindings | (unmapped) Kitty keymap | Add Ctrl+- |
| Fixed Cmd+Left/Right not jumping to line start/end in terminals that use the Kitty keyboard protocol | ui / keybindings | (unmapped) Kitty keymap | Add Cmd+Left/Right |
| Fixed Ctrl+Z hanging the terminal when Claude Code is launched via a wrapper process | platform / ui | (unmapped) signal handler | Handle Ctrl+Z under wrapper |
| Fixed scrollback duplication in inline mode | ui | (unmapped) redraw path | Dedup scrollback |
| Fixed modal search dialogs overflowing the screen at short terminal heights | ui | (unmapped) modal dialog | Add scroll |
| Fixed scattered blank cells and disappearing composer chrome in the VS Code integrated terminal | ide | (unmapped) renderer | VS Code-specific path |
| Fixed an intermittent API 400 error related to cache control TTL ordering | cache / api | (unmapped) cache control builder | Order TTLs deterministically |
| Fixed `/branch` rejecting conversations with transcripts larger than 50MB | slash-cmd | (unmapped) /branch | Stream conversation |
| Fixed `/resume` silently showing an empty conversation on large session files | resume / ui | (unmapped) /resume loader | Surface load error |
| Fixed `/plugin` Installed tab showing the same item twice when it appears under Needs attention or Favorites | plugins / ui | (unmapped) /plugin Installed tab | Dedup across sections |
| Fixed `/update` and `/tui` not working after entering a worktree mid-session | slash-cmd | (unmapped) /update + /tui | Re-init after EnterWorktree |

---

## v2.1.114

| Bullet excerpt | Theme | v2.1.142 decl | Implementation hint |
|----------------|-------|---------------|---------------------|
| Fixed a crash in the permission dialog when an agent teams teammate requested tool permission | permissions / ui | (unmapped) teammate permission dialog | Guard against missing teammate data |

---

## v2.1.113

### native-binary cutover

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Changed the CLI to spawn a native Claude Code binary (via a per-platform optional dependency) instead of bundled JavaScript | native-binary | npm launcher + per-platform Bun-compiled binary |

### sandbox / permissions / bash

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Added `sandbox.network.deniedDomains` setting to block specific domains even when a broader `allowedDomains` wildcard would otherwise permit them | sandbox | (unmapped) sandbox config | Subtractive deny list |
| Bash tool: multi-line commands whose first line is a comment now show the full command in the transcript, closing a UI-spoofing vector | permissions / ui | (unmapped) Bash transcript | Strip-leading-comment removed |
| Running `cd <current-directory> && git …` no longer triggers a permission prompt when the `cd` is a no-op | permissions | (unmapped) Bash classifier | No-op cd recognized |
| Security: on macOS, `/private/{etc,var,tmp,home}` paths are now treated as dangerous removal targets under `Bash(rm:*)` allow rules | permissions | (unmapped) dangerous-path matcher | Add macOS /private/* |
| Security: Bash deny rules now match commands wrapped in `env`/`sudo`/`watch`/`ionice`/`setsid` and similar exec wrappers | permissions | (unmapped) Bash classifier | Match wrapped command |
| Security: `Bash(find:*)` allow rules no longer auto-approve `find -exec`/`-delete` | permissions | (unmapped) find classifier | Distinguish -exec/-delete |
| Fixed Bash `dangerouslyDisableSandbox` running commands outside the sandbox without a permission prompt | permissions / sandbox | (unmapped) sandbox bypass gate | Always prompt |

### ui / fullscreen / fixes

| Bullet excerpt | v2.1.142 decl | Implementation hint |
|----------------|---------------|---------------------|
| Fullscreen mode: Shift+↑/↓ now scrolls the viewport when extending a selection past the visible edge | ui | (unmapped) selection extender | Scroll on extend |
| `Ctrl+A` and `Ctrl+E` now move to the start/end of the current logical line in multiline input | ui | (unmapped) input keymap | Logical-line nav |
| Windows: `Ctrl+Backspace` now deletes the previous word | ui / keybindings | (unmapped) Windows keymap | Add Ctrl+Backspace |
| Long URLs in responses and bash output stay clickable when they wrap across lines | ui | (unmapped) URL renderer | OSC 8 per wrap segment |
| Improved `/loop`: pressing Esc now cancels pending wakeups, and wakeups display as "Claude resuming /loop wakeup" for clarity | steering | (unmapped) /loop handler | Esc + label |
| `/extra-usage` now works from Remote Control (mobile/web) clients | remote-control / slash-cmd | (unmapped) /extra-usage | Allow on Remote Control |
| Remote Control clients can now query `@`-file autocomplete suggestions | remote-control / ui | (unmapped) @ completion | Expose to Remote Control |
| Improved `/ultrareview`: faster launch with parallelized checks, diffstat in the launch dialog, and animated launching state | slash-cmd | (unmapped) /ultrareview | Parallelize + diffstat + animation |
| Subagents that stall mid-stream now fail with a clear error after 10 minutes instead of hanging silently | subagent | (unmapped) subagent watchdog | 10-min timeout |
| Fixed MCP concurrent-call timeout handling where a message for one tool call could silently disarm another call's watchdog | mcp | (unmapped) MCP watchdog | Per-call timer |
| Fixed Cmd-backspace / `Ctrl+U` to once again delete from the cursor to the start of the line | ui | (unmapped) input keymap | Restore delete-to-start |
| Fixed markdown tables breaking when a cell contains an inline code span with a pipe character | ui | (unmapped) markdown table parser | Escape pipe in code span |
| Fixed session recap auto-firing while composing unsent text in the prompt | ui | (unmapped) recap trigger | Skip when prompt has draft |
| Fixed `/copy` "Full response" not aligning markdown table columns | slash-cmd | (unmapped) /copy formatter | Preserve table alignment |
| Fixed messages typed while viewing a running subagent being hidden from its transcript and misattributed to the parent AI | subagent / ui | (unmapped) subagent transcript router | Route msgs to active subagent |
| Fixed `/effort auto` confirmation — now says "Effort level set to max" to match the status bar label | effort / ui | (unmapped) /effort confirmation | Update string |
| Fixed the "copied N chars" toast overcounting emoji and other multi-code-unit characters | ui | (unmapped) copy toast | Grapheme count |
| Fixed `/insights` crashing with `EBUSY` on Windows | slash-cmd / platform | (unmapped) /insights | Windows file-lock handling |
| Fixed exit confirmation dialog mislabeling one-shot scheduled tasks as recurring | ui | (unmapped) exit dialog | Detect one-shot |
| Fixed slash/@ completion menu not sitting flush against the prompt border in fullscreen mode | ui | (unmapped) completion menu | Flush layout |
| Fixed `CLAUDE_CODE_EXTRA_BODY` `output_config.effort` causing 400 errors on subagent calls to models that don't support effort and on Vertex AI | api / effort | (unmapped) extra-body merger | Conditional effort field |
| Fixed prompt cursor disappearing when `NO_COLOR` is set | ui | (unmapped) cursor renderer | Don't disable cursor on NO_COLOR |
| Fixed `ToolSearch` ranking so pasted MCP tool names surface the actual tool instead of description-matching siblings | tools | (unmapped) ToolSearch ranker | Exact-name boost |
| Fixed compacting a resumed long-context session failing with "Extra usage is required for long context requests" | compact / api | (unmapped) compact extra-usage gate | Pass extra-usage flag |
| Fixed `plugin install` succeeding when a dependency version conflicts with an already-installed plugin — now reports `range-conflict` | plugins | (unmapped) plugin installer | Detect range conflicts |
| Fixed "Refine with Ultraplan" not showing the remote session URL in the transcript | remote-control / slash-cmd | (unmapped) Ultraplan refine | Surface URL |
| Fixed SDK image content blocks that fail to process crashing the session — now degrade to a text placeholder | sdk | (unmapped) SDK image processor | Fallback to placeholder |
| Fixed Remote Control sessions not streaming subagent transcripts | remote-control / subagent | (unmapped) Remote Control stream | Forward sub-agent transcript |
| Fixed Remote Control sessions not being archived when Claude Code exits | remote-control | (unmapped) session archive | Archive on exit |
| Fixed `thinking.type.enabled is not supported` 400 error when using Opus 4.7 via a Bedrock Application Inference Profile ARN | thinking / auth | (unmapped) Bedrock IP request | Detect ARN |

---

## Coverage Stats

Total bullets mapped above: ~600+ table rows across all 23 published releases in this window — v2.1.113, v2.1.114, v2.1.116–v2.1.123, v2.1.126, v2.1.128, v2.1.129, v2.1.131–v2.1.133, v2.1.136–v2.1.142. The seven skipped numbers (v2.1.115, .124, .125, .127, .130, .134, .135) were never published; v2.1.138 was internal-only.

The `(unmapped)` entries represent decls that haven't been pinpointed to a specific obfuscated identifier yet — they will be filled in as subsequent units explore each module. The string anchors and theme labels are still recorded so a unit owner can pick up the trail.

---

## See Also

- [`changelog_analysis.md`](changelog_analysis.md) — narrative architectural analysis
- [`file_index.md`](file_index.md) — extracted-file inventory
- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, LLM API, Tools, Agents, Subagent, State
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Plan, Background Agents, /goal, Compact, Hooks, Skills, Thinking, Steering, CLI
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands
- The v2.1.112 baseline lives at `../../../claude_code_v_2.1.112/analyze/00_overview/changelog_to_code_map.md`
