# Symbol Index — Integration Infrastructure (v2.1.113 → v2.1.142)

> Symbol additions for v2.1.142 are tracked in 00_overview/symbol_additions_v2_1_142_*.md files. Consolidation into this index is a future pass.

This index catalogs obfuscated → readable mappings for the **integration infrastructure** symbols introduced or changed between v2.1.113 and v2.1.142. Scope: LSP, Chrome/Browser, IDE, UI Components, Plugin System, Code Indexing, Shell Parser, Slash Commands.

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Plan, Background Agents, /goal, Todo, Compact, Hooks, Skills, Thinking, Steering, CLI
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry

## File:Line Format

For v2.1.142, the canonical source citation is `cli_unpack_pretty/unknown/<obfuscated>.js` (per-decl isolated file). When surrounding context matters, cite `cli_inner_pretty.js:<line>` instead.

---

## Module: LSP

Language Server Protocol client, diagnostic queue, server lifecycle, plugin LSP server discovery.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- `/plugin` details and `claude plugin details` show LSP servers a plugin provides (v2.1.142)
- LSP diagnostic summaries expand on click/Ctrl+O with expand hint (v2.1.121)
- Diagnostic queue purged on tool-confirmed write (v2.1.110 baseline behavior, refined for native build)

---

## Module: Chrome / Browser

Claude-in-Chrome extension integration, headless browser shim for background agents, shared-tab handling.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- Background agents crash-looping when Chrome extension connected without shared tab (v2.1.142 fix)
- Clicking links in attached `claude agents` session: headless browser shim no longer applies while attached (v2.1.142 fix)

---

## Module: IDE

VS Code / Cursor / Windsurf / JetBrains integration, in-chat mic, voice mode, diff view, shell integration lock files.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- VS Code Cmd/Ctrl+Shift+T to reopen recently closed session (v2.1.139)
- VS Code `claudeCode.enableReopenClosedSessionShortcut` setting (v2.1.139)
- VS Code voice mode WSL error suggests `sox libsox-fmt-pulse` (v2.1.141)
- VS Code in-chat mic "No audio detected" feedback (v2.1.141)
- VS Code `claudeCode.claudeProcessWrapper` unsupported-platform when binary not bundled (v2.1.133 fix)
- VS Code "Manage Plugins" panel breaking on multiple large marketplaces (v2.1.117 fix)
- VS Code voice dictation respects `accessibility.voice.speechLanguage` (v2.1.121)
- VS Code voice dictation respects `~/.claude/settings.json` `language` setting (v2.1.120)
- VS Code voice dictation first-recording silent-while-mic-permission-prompt (v2.1.119 fix)
- VS Code `/usage` opens native Account & Usage dialog (v2.1.120)
- VS Code `/context` opens native token usage dialog (v2.1.121)
- VS Code `/clear` not clearing conversation context and transcript (v2.1.129 fix)
- VS Code extension activation failures on Windows (v2.1.131, v2.1.137 fixes)
- VS Code 1.92–1.104 trackpad scroll speed (v2.1.126/132)
- JetBrains IDE 2025.2 scroll-wheel handling (v2.1.132)
- Cursor / VS Code: smoother fullscreen scrolling via `/terminal-setup` (v2.1.116)
- Restore "view diff in your IDE" on file-edit permission prompt (v2.1.141)
- IDE shell-integration lock files respecting `CLAUDE_CONFIG_DIR` (v2.1.136 fix)
- IDE effort change silently dropped (v2.1.133 fix)
- Cursor / VS Code 1.92–1.104 mouse-wheel speed (v2.1.139/140 fixes)

---

## Module: UI Components

React components, Ink rendering, fullscreen mode, alt-screen, autoscroll, focus mode, transcript view, status line, footer, dialogs.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new symbols (preliminary):

- `EQ4` — agents dashboard React component
- `Xk4` — /goal active-overlay React component
- Various keypath helpers in cli_unpack_pretty/decls/functions for fullscreen rendering

Known new themes for this window:

- Custom named themes from `/theme` + plugin-shipped themes via `themes/` (v2.1.118)
- Auto (match terminal) theme option (v2.1.111 from prior, refined in v2.1.116 fullscreen interactions)
- `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1` (v2.1.132)
- "Pasting…" footer hint during Ctrl+V image paste (v2.1.132)
- Thinking spinner inline-progressive (v2.1.116)
- 10-sec amber warmup spinner (v2.1.141)
- Rotating amber spinner during long thinking (v2.1.141)
- Background-color bleed on 256-color terminals (v2.1.142 fix)
- Markdown tables w/ cell wrapping vertical fallback (v2.1.141 fix)
- Light-ansi theme invisible white diff context (v2.1.141 fix)
- Hyperlinks dark navy on dark themes (v2.1.139 fix)
- Border-embedded text overflow on CJK/emoji (v2.1.139 fix)
- Fuzzy-match highlighting splitting emoji (v2.1.139 fix)
- Devanagari Indic-script column alignment (v2.1.116 fix)
- ProgressBar full-block for almost-full fractional cell (v2.1.139 fix)
- Multi-line statusline output corruption (v2.1.141 fix)
- Cursor mid-grapheme on Ctrl+E/A/K/U/arrow (v2.1.132 fix)
- Vim operators corrupting NFD-decomposed accented chars (v2.1.132 fix)
- Welcome banner column overflow on CJK (v2.1.136 fix)
- "Jump to bottom" overlay CJK color artifacts (v2.1.136 fix)
- Wide markdown tables stale bordered render in scrollback (v2.1.136 fix)
- Mid-line slash-command autocomplete (v2.1.136 fix)
- Long URLs clickable when wrapped (v2.1.113/121)
- Fullscreen typing input not jumping scroll (v2.1.121)
- Scrollable dialogs overflowing terminal (v2.1.121)
- Bash mode up-arrow history (v2.1.139 fix)
- Up-arrow history for cancelled-with-Ctrl+C prompts (v2.1.141 fix)
- Cancelled prompts auto-restore not duplicating history (v2.1.141 fix)
- Vim Space in NORMAL = cursor right (v2.1.128 fix)
- AskUserQuestion popup hiding last line of preceding chat (v2.1.141 fix)
- Bold headers with keycap/ZWJ/skin-tone emoji losing trailing chars (v2.1.129 fix)
- `/usage` ProgressBars overlapping "Resets …" labels (v2.1.119 fix)
- Pressing `x` on selected subagent typing into prompt (v2.1.141 fix)
- Pressing Enter on permission dialog submitting text (v2.1.141 fix)
- Error overlay dumping minified bundle source (v2.1.141 fix)
- Spurious "Stream idle timeout" 5min after response (v2.1.139 fix)
- Welcome banner "API Usage Billing" on third-party providers (v2.1.141 fix)
- Spinner tips hidden when user already has desktop app / skills / agents (v2.1.120)
- `spinnerVerbs` setting in turn-completion messages (v2.1.141 fix)
- `spinnerTipsOverride.excludeDefault` not suppressing time-based tips (v2.1.122 fix)
- Markdown link labels lost on no-OSC-8 terminals: render as `label (url)` (v2.1.128 fix)
- Scrolling re-engaging auto-follow with `autoScrollEnabled: false` (v2.1.136 fix)
- Prompt-input undo (Ctrl+_) skipping state (v2.1.117 fix)
- Ctrl+L blanking conversation history (v2.1.129 fix)
- Ctrl+L clearing prompt input (v2.1.121 fix — now redraw-only)
- Ctrl+G external editor blanking conversation (v2.1.129 fix)
- Ctrl+Z hanging in wrapper processes (v2.1.116 fix)
- Cursor blinking on tab names / list pointers (v2.1.139 fix)
- Slash command autocomplete capped at 3–5 (v2.1.132 fix)
- Slash command picker jumping while typing (v2.1.120 fix)
- Slash command suggestions highlight matched chars (v2.1.119)
- `/skills` filter search box (v2.1.121)
- `/skills` Enter pre-fills `/<skill-name>` (v2.1.119 fix)
- `/config` search match by value (v2.1.116)
- `/doctor` opens during response (v2.1.116)
- `/config` tab navigation focus (v2.1.128 fix)
- `/config` settings persist to `~/.claude/settings.json` (v2.1.119)
- "Continue" button parallel to "Don't ask again" in auto-mode opt-in (v2.1.118)
- "Marketplace 'inline' not found" for `--plugin-dir` plugins (v2.1.128 fix)
- `/plugin` browse pane "0 installs" for newly published plugins (v2.1.142 fix)
- `/plugin` Components panel labels (v2.1.128 fix)
- `/plugin` Installed tab dedup (v2.1.116 fix)
- `/plugin` details: 0 MCP servers for `.mcp.json`-declared (v2.1.141 fix)
- `/plugin` details: hook event names / MCP server names cleanly (v2.1.139)
- `/plugin` Uninstall reports "Enabled" instead of "Uninstalled" (v2.1.126 fix)
- `/plugin` Errors tab includes plugins skipped due to version constraint (v2.1.118)
- `/plugin` menu Tab/Right navigation, clickable tab strip (v2.1.141)
- `/plugin update` not preserving cross-plugin symlinks (v2.1.139 fix)
- `/feedback` includes recent sessions (24h or 7d) (v2.1.141)
- `/insights` Time-of-Day chart unparseable-timestamp skew (v2.1.139 fix)
- `/insights` malformed `tool input` field crash (v2.1.136 fix)
- `/insights` Windows EBUSY crash (v2.1.113 fix)
- `/mcp` server list scrolling in short terminals (v2.1.141 fix)
- `/scroll-speed` slash command (v2.1.139)
- `/branch` rejecting >50MB transcripts (v2.1.116 fix)
- `/branch` invalid forks from rewound timelines (v2.1.122 fix)
- `/branch` multi-line session title (v2.1.136 fix)
- `/copy` "Full response" markdown table alignment (v2.1.113 fix)
- "copied N chars" toast overcounting emoji (v2.1.113 fix)
- `/usage` Ctrl+S hang on Linux/X11 (v2.1.132 fix)
- `/usage` weekly reset showing time of day (v2.1.136 fix)
- `/usage` dialog clipped without no-flicker (v2.1.121 fix)
- `/usage` stale OAuth token (v2.1.121 fix)
- `/usage` memory leak (v2.1.121 fix)
- `/cost`/`/stats` merged into `/usage` (v2.1.118)
- `/fork` writes pointer not full conversation (v2.1.118 fix)
- `/rewind` and other overlays not responding after `claude --resume` (v2.1.120 fix)
- `/rewind` "(no prompt)" for image attachments (v2.1.119 fix)
- `/rename` failing on resumed sessions ending at compact boundary (v2.1.128 fix)
- `/extra-usage` from Remote Control (v2.1.113)
- "Refine with Ultraplan" remote session URL in transcript (v2.1.113 fix)
- `/ultrareview` non-interactive CLI (v2.1.120)
- `/ultrareview` parallelized checks, diffstat, animated launching (v2.1.113)
- `/loop` wakeups: "Claude resuming /loop wakeup" (v2.1.113)
- Auto-compact `auto` label in auto mode (v2.1.120)
- Auto-compact display "auto" no token count (v2.1.120)
- Rewind menu "Summarize up to here" (v2.1.141)
- `/release-notes` stuck on old version after failed refresh (v2.1.136 fix)
- `/effort auto` confirmation "Effort level set to max" (v2.1.113 fix)
- `/effort` picker reflecting `CLAUDE_CODE_EFFORT_LEVEL` (v2.1.132 fix)
- `/effort` in one session changing autocompact threshold in others (v2.1.141 fix)
- `/web-setup` warns before replacing existing GitHub App (v2.1.142)
- `/desktop` Esc dismissing (v2.1.136 fix)
- `/branch` linking PR in worktree (v2.1.119 fix)

---

## Module: Plugin System

Plugin manifest schema, marketplace, cache cleanup, dependency resolution, plugin-loader, plugin component types (skills, hooks, MCP, themes, monitors, LSP servers, commands).

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- Root SKILL.md surfaces as skill (no `skills/` subdir) (v2.1.142)
- Plugin LSP server discovery (v2.1.142 — shown in `/plugin` details)
- Plugin cache cleanup deleting active version directory (v2.1.142 fix)
- Plugin advisories naming `plugin.json` shadow keys (v2.1.140, refined v2.1.142)
- Plugin marketplace `ref` no longer exists upstream when `sha` pinned (v2.1.141 fix)
- Plugin uses `skills: ["./"]` false path-escape error (v2.1.142 fix)
- Plugin `themes`/`monitors` under `"experimental"` (v2.1.129)
- `claude plugin tag` (v2.1.118)
- `claude plugin prune` (v2.1.121)
- `claude plugin details <name>` (v2.1.139)
- `claude plugin install <name>@<marketplace>` auto-refresh and retry (v2.1.139)
- `claude plugin update` cross-plugin symlink preservation (v2.1.139 fix)
- `claude plugin install` re-resolves dep at wrong version (v2.1.118 fix)
- `claude plugin install` already-installed plugin installs missing deps (v2.1.117)
- `--plugin-url <url>` (v2.1.129)
- `--plugin-dir` accepts `.zip` archives (v2.1.128)
- `--plugin-dir` for `claude agents` (v2.1.142)
- `claude plugin validate` accepts `$schema`/`version`/`description` (v2.1.120)
- `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE` (existing)
- `CLAUDE_CODE_PLUGIN_PREFER_HTTPS` (v2.1.141)
- `blockedMarketplaces` `hostPattern`/`pathPattern` enforcement (v2.1.119)
- `blockedMarketplaces`/`strictKnownMarketplaces` enforced on install/update/refresh (v2.1.117)
- `extraKnownMarketplaces` auto-update persistence (v2.1.140 fix)
- Plugin advisories listing `plugin.json` keys shadowing default folders (v2.1.140)
- Plugin uninstall/enable/disable case-insensitive slug matching (v2.1.136 fix)
- Plugin Stop/UserPromptSubmit hooks failing during cache cleanup (v2.1.136 fix)
- Plugin `${user_config.*}` optional blank fields (v2.1.119 fix)
- Plugin slash commands with spaces (e.g. `/myplugin review`) (v2.1.136 fix)
- Plugin MCP servers spawn on Windows (v2.1.119 fix)
- Plugin MCP servers `${ENV_VAR}` in `headers` (v2.1.119 fix)
- Plugin disabled-MCP-server "failed" status (v2.1.119 fix)
- Plugin auto-update skips shown in `/doctor` and `/plugin` Errors tab (v2.1.118)
- Plugin pinned by version constraint auto-updates to highest tag (v2.1.119)
- Plugin install on conflicting dep version: `range-conflict` (v2.1.113 fix)
- Plugin dependency resolution stale-count fix (v2.1.139 fix)
- Plugin marketplace removal key `d` instead of `r` (v2.1.136)

---

## Module: Code Indexing

`@`-file mentions, fuzzy file picker, project file scan, ignore-list, virtual scroller.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- `@`-mention file picker not matching files in dirs with >100 entries (v2.1.136 fix)
- `@`-mention file picker not matching mid-session created files in small non-git dirs (v2.1.136 fix)
- `@`-file Tab completion replacing entire prompt inside slash command with absolute path (v2.1.119 fix)
- MCP `@server:` autocomplete includes resources from disconnected servers (v2.1.139 fix)
- `@`-mention OTel event (v2.1.122)

---

## Module: Shell Parser

Bash command parser (for permission classification), PowerShell parser, shell expansion handling, dangerous-rm detector.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- `Bash(mkdir *)`/`Bash(touch *)` allow rules for in-project paths (v2.1.129 fix)
- Bash deny rules match `env`/`sudo`/`watch`/`ionice`/`setsid` wrappers (v2.1.113)
- `Bash(find:*)` no longer auto-approves `find -exec`/`-delete` (v2.1.113)
- macOS `/private/{etc,var,tmp,home}` dangerous removal under `Bash(rm:*)` (v2.1.113)
- Multi-line bash with comment first line shows full command (v2.1.113 UI-spoofing)
- Multi-line bash w/ pipe+redirect false-positive dangerous `rm` (v2.1.120 fix)
- PowerShell `--%` stop-parsing token not mis-flagging bare `--` (v2.1.126 fix)
- PowerShell auto-approve in permission mode (v2.1.119)
- `!exit`/`!quit` in bash mode running as shell command not exiting CLI (v2.1.122 fix)
- `$CLAUDE_EFFORT` available to Bash tool commands (v2.1.133)
- Bash classifier diagnostic showing parser internal (v2.1.136 fix)

---

## Module: Slash Commands

Slash command parser, command registry, /<command> typo suggestions, slash-cmd autocomplete, plugin commands, command/skill resolution.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new symbols (preliminary):

- `T6A` — `/goal` slash command definition
- `ov5` — `/goal` trusted-workspaces error string

Known new slash commands for this window:

- `/goal` — Stop-hook-as-loop (v2.1.139)
- `/scroll-speed` — mouse wheel speed picker (v2.1.139)
- `/claude-api` — Anthropic SDK skill (v2.1.142)
- `/routines` — scheduled remote agents (v2.1.142)

Slash commands list (from `extract/assets/slash_commands.json`): 117 entries — see `file_index.md` for full enumeration.

Known new themes for this window:

- Slash command suggestions highlight matched chars (v2.1.119)
- Slash command picker wraps descriptions on second line (v2.1.119)
- Mid-input slash autocomplete after initial slash command (v2.1.136 fix)
- `/skills` filter search box (v2.1.121)
- `/skills` Enter pre-fills `/<skill-name>` (v2.1.119 fix)
- Plugin slash commands with spaces (v2.1.136 fix)

---

## See Also

- [`changelog_analysis.md`](changelog_analysis.md) — long-form narrative
- [`changelog_to_code_map.md`](changelog_to_code_map.md) — per-bullet pointers
- [`file_index.md`](file_index.md) — extracted-file inventory
- The v2.1.112 baseline lives at `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index.md`
