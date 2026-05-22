# Symbol Index — Integration Infrastructure (v2.1.113 → v2.1.142)

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

*(No new mapped symbols this window — v2.1.142 LSP work was UI-only in the `/plugin` details renderer. See themes below.)*

Known new themes for this window:

- `/plugin` details and `claude plugin details` show LSP servers a plugin provides (v2.1.142)
- LSP diagnostic summaries expand on click/Ctrl+O with expand hint (v2.1.121)
- Diagnostic queue purged on tool-confirmed write (v2.1.110 baseline behavior, refined for native build)

---

## Module: Chrome / Browser

Claude-in-Chrome extension integration, headless browser shim for background agents, shared-tab handling.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AL8` | `isClaudeInChromeEnabled` (returns false in non-TTY workers — keeps shim out of unattached bg sessions) | cli_inner_pretty.js:493305-493314 | function |
| `daH` | `isClaudeInChromeAutoEnableEligible` (only when interactive) | cli_inner_pretty.js:493315-493322 | function |

Known new themes for this window:

- Background agents crash-looping when Chrome extension connected without shared tab (v2.1.142 fix)
- Clicking links in attached `claude agents` session: headless browser shim no longer applies while attached (v2.1.142 fix)

---

## Module: IDE

VS Code / Cursor / Windsurf / JetBrains integration, in-chat mic, voice mode, diff view, shell integration lock files, editor launching from TUI.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dj5` | `envDefaultEditor` (memoized lookup of `$VISUAL`/`$EDITOR` with fallback search) | cli_inner_pretty.js:445829-445833 | function |
| `Fj5` | `TERMINAL_EDITOR_REGEX` (`/\b(vi|vim|nvim|nano|emacs|pico|micro|helix|hx)\b/`) | cli_inner_pretty.js:445827 | constant |
| `Lj8` | `openInEditorAsync` (the `v` shortcut handler — spawns the editor) | cli_inner_pretty.js:445773-445806 | function |
| `Ox6` | `getEditorDisplayName` (human-readable label shown in dialogs) | cli_inner_pretty.js:445811-445816 | function |
| `Uj5` | `GUI_EDITORS` (`["code","cursor","windsurf","codium","subl","atom","gedit","notepad++","notepad"]`) | cli_inner_pretty.js:445826 | constant |
| `cD` | `getEditorDisplayName` (alt-path label resolver) | cli_inner_pretty.js (utility) | function |
| `gj5` | `EDITORS_NEEDING_G_FLAG` (vscode-likes that need `-g file:line`) | cli_inner_pretty.js:445828 | constant |
| `xy` | `resolvePreferredEditor` (`attacherCaps?.editor ?? envDefaultEditor`) | cli_inner_pretty.js:445808-445810 | function |
| `IfH` | `setSessionTerminalTitle` | cli_inner_pretty.js:567194 | function |

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

React components, Ink rendering, fullscreen mode, alt-screen, autoscroll, focus mode, transcript view, status line, footer, dialogs, spinner.

### Agent Fleet Dashboard (v2.1.139 — `claude agents`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `EQ4` | `FleetViewDashboard` (React component for agent-view list, search box, status filters) | cli_inner_pretty.js:567084+ | function |
| `JN4` | `agentsCommandTitle` / `STORE_OPEN_AGENT_VIEW_FLAG` | cli_inner_pretty.js:569095 | function |
| `NQ4` | `iconForJobState` | cli_inner_pretty.js:566153-566158 | function |
| `Qg4` | `renderDispatchDefaultsChips` (React component showing the three defaults as colored chips next to the dispatch input) | cli_inner_pretty.js:565479-565503 | function |
| `So5` | `JOB_KIND_LABELS` (`{agent:"background", repo, skill, routine}`) | cli_inner_pretty.js:569361 | constant |
| `_j8` | `formatExitMessage` / `formatTuiHistoryLabel` | cli_inner_pretty.js:569095 | function |
| `ao5` | `mountFleetView` (agents-view loop: render UI, attach to selected job, repeat) | cli_inner_pretty.js:569079-569208 | function |
| `og4` | `STATE_LABELS` (`{review:"Ready for review", blocked:"Needs input", working:"Working", done:"Completed"}`) | cli_inner_pretty.js:569355 | constant |
| `rg4` | `STATE_BUCKET_ORDER` (`["review","blocked","working","done"]`) | cli_inner_pretty.js:569354 | constant |
| `yQ4` | `mountFleetViewFromLeftArrow` (the `←←` shortcut: tear down REPL, mount agent view) | cli_inner_pretty.js:569366-569381 | function |

### Effort Slider Components (v2.1.111 onward)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `By5` | `ShimmerLevelLabel` (xhigh shimmer animation) | cli_inner_pretty.js:496901-496926 | component |
| `Fy5` | `nextEffortIndex` (clamp at last position) | cli_inner_pretty.js:497121-497123 | function |
| `Sy5` | `EffortApplyAndCloseFC` (typed-arg path; renders cache-miss confirmation when needed) | cli_inner_pretty.js:496797-496846 | component |
| `Uy5` | `sliderLabelSpacer` (returns whitespace pad by index) | cli_inner_pretty.js:497118-497120 | function |
| `Z04` | `DEFAULT_SLIDER_INDEX` (= 3, xhigh) | cli_inner_pretty.js (initializer near 496935-496948) | constant |
| `gy5` | `prevEffortIndex` (clamp at 0) | cli_inner_pretty.js:497124-497126 | function |
| `hy5` | `ShowCurrentEffortFC` (read-only `/effort current` renderer) | cli_inner_pretty.js:496776-496785 | component |
| `kL8` | `EFFORT_HELP_TEXT` (`/effort` help string referencing xhigh) | cli_inner_pretty.js:497171-497185 | constant |
| `my5` | `RainbowAnimatedLevelLabel` (max-level cycling rainbow) | cli_inner_pretty.js:496880-496900 | component |
| `py5` | `EffortSliderComponent` (interactive 5-position slider with env-override awareness) | cli_inner_pretty.js:496927-497117 | component |
| `vZ$` | `EffortLevelLabel` (per-level styled label for slider) | cli_inner_pretty.js:496853-496879 | component |
| `x1H` | `SLIDER_LEVELS` (5-position config with color styling) | cli_inner_pretty.js:496703 | constant |

### Goal Overlay UI (v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `FF6` | `useMemoCacheGoal` (React memo-cache helper for LabeledField) | cli_inner_pretty.js:507770 | reference |
| `Fg5` | `BADGE_DOT_INTERVAL_FRAC` (= `0.18`) | cli_inner_pretty.js:544515 | constant |
| `Lk4` | `goalOverlayPanelModule` | cli_inner_pretty.js:507771-507785 | module |
| `Qg5` | `tickHelperIncr` (= `H + 1`) | cli_inner_pretty.js:544505-544507 | function |
| `UF6` | `LabeledField` (the "Label: value" row) | cli_inner_pretty.js:507749-507768 | function (React) |
| `Ug5` | `BADGE_PULSE_PERIOD_MS` (= `4000`) | cli_inner_pretty.js:544514 | constant |
| `V28` | `BADGE_DOTS` (= `20`) | cli_inner_pretty.js:544513 | constant |
| `Xk4` | `GoalOverlayPanel` (rendered for /goal dialog) | cli_inner_pretty.js (referenced) | function |
| `bR5` | `incrementHelper` (= `H + 1`) | cli_inner_pretty.js:507743-507745 | function |
| `dg5` | `setAtSelector` (= `H.activeGoal?.setAt`) | cli_inner_pretty.js:544508-544510 | function |
| `gg5` | `tickHelperModulo` (= `(H + 1) % V28`) | cli_inner_pretty.js:544502-544504 | function |
| `kR$` | `ICON_PAUSE` (= `"⏸"` U+23F8) | cli_inner_pretty.js:48416 | constant |
| `vR$` | `ICON_PULSE` (= `"◎"` U+25CE) | cli_inner_pretty.js:48414 | constant |
| `xR5` | `activeGoalSelector` | cli_inner_pretty.js:507746-507748 | function |

### Spinner + Thinking Hints (v2.1.116 / v2.1.141)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BB_` | `SPINNER_LONG_RESPONSE_TOKENS` (= 16000, threshold for revealing time) | cli_inner_pretty.js:328724 | constant |
| `Dy7` | `THINKING_LABEL_WIDTH` (precomputed width of `"thinking"`) | cli_inner_pretty.js:328757 | constant |
| `FB_` | `STALL_TELEMETRY_THRESHOLDS_MS` (`[10000, 45000, 300000]`) | cli_inner_pretty.js:328758 | constant |
| `Jy7` | `SPINNER_SHIMMER_DELAY_MS` (= 3000, before the dim↔bright oscillation starts) | cli_inner_pretty.js:328731 | constant |
| `Py7` | `SpinnerComponent` (renders glimmer + thinking-status + tokens) | cli_inner_pretty.js:328468-328694 | component |
| `QB_` | `SPINNER_BRIGHT_RGB` (`{r:185,g:185,b:185}`) | cli_inner_pretty.js:328760 | constant |
| `Xy7` | `THINKING_WARM_START_MS` (= 10_000 — start fading spinner to amber) | cli_inner_pretty.js:328733 | constant |
| `cB_` | `THINKING_WARM_FULL_MS` (= 20_000 — full amber) | cli_inner_pretty.js:328734 | constant |
| `dB_` | `SPINNER_SHIMMER_PERIOD_S` (= 2) | cli_inner_pretty.js:328732 | constant |
| `gB_` | `SPINNER_DIM_RGB` (`{r:153,g:153,b:153}`) | cli_inner_pretty.js:328759 | constant |
| `iB_` | `THINKING_SOME_MORE_MS` (= 30_000) | cli_inner_pretty.js:328737 | constant |
| `lB_` | `STILL_THINKING_MS` (= 10_000) | cli_inner_pretty.js:328735 | constant |
| `nB_` | `THINKING_MORE_MS` (= 20_000) | cli_inner_pretty.js:328736 | constant |
| `nG6` | `useStallDetector` (tracks `timeSinceLastToken`, eases `stalledIntensity` 0→1 over 10s past idle threshold) | cli_inner_pretty.js:328245-328274 | function |
| `oB_` | `getThinkingHintForElapsed` (returns "thinking" / "still thinking" / "thinking more" / "thinking some more" / "almost done thinking") | cli_inner_pretty.js:328461-328467 | function |
| `rB_` | `ALMOST_DONE_THINKING_MS` (= 45_000) | cli_inner_pretty.js:328738 | constant |
| `wy7` | `computeCompactingPercent` (asymptote at 95%, `1 - exp(-elapsed/90s)`) | cli_inner_pretty.js:328456-328459 | function |

### Theme Editor + Custom Themes (v2.1.118)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `HfH` | `useCustomThemes` (context consumer) | cli_inner_pretty.js:146765-146770 | hook |
| `IBH` | `CustomThemeContext` (provides `customThemes`/`activeCustomTheme`/`reloadCustomThemes`/`setPreviewOverrides`) | cli_inner_pretty.js:146732, :146766 | context |
| `IZH` | `isValidHexColor` (validates override entry) | cli_inner_pretty.js:481521 | function |
| `KB` | `removeObjectKey` (immutable Object.fromEntries(filter)) | cli_inner_pretty.js (utility) | function |
| `lV5` | `suggestThemeSlug` (slugify name) | cli_inner_pretty.js:481471-481473 | function |
| `qL4` | `ThemeEditorDialog` (name + slug + color picker; persists per-slug) | cli_inner_pretty.js:481434-481605 | component |
| `rK6` | `saveCustomTheme` (writes themes/<slug>.json) | cli_inner_pretty.js:481498-481501 | function |

### Skills Dialog (v2.1.121 filter, v2.1.129 overrides)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AG` | `useFilterInputController` | cli_inner_pretty.js (hook) | function |
| `DN` | `FilterTextInput` (rendered inside SkillsDialog) | cli_inner_pretty.js (utility component) | function (React) |
| `kB6` | `SKILL_OVERRIDE_VALUES` (= `["on", "name-only", "user-invocable-only", "off"]`) | cli_inner_pretty.js:477208 | constant |
| `rT5` | `SKILL_OVERRIDE_STYLES` | cli_inner_pretty.js:477209-477214 | object |
| `sT5` | `SkillRow` | cli_inner_pretty.js:477137-477182 | function (React component) |
| `tT5` | `renderSkillsDialog` (React render wrapper) | cli_inner_pretty.js:477218+ | function |
| `uJ4` | `SkillsDialog` | cli_inner_pretty.js:476909-477136 | function (React component) |
| `xJ4` | `formatSkillSource` | cli_inner_pretty.js:476897-476908 | function |

### Scroll Speed Dialog (v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Z$` | `MAX_SCROLL_SPEED` (= 10) | cli_inner_pretty.js:476674 | constant |
| `FT5` | `getTerminalDisplayName` (Cursor / Windsurf / iTerm2 / Terminal.app / …) | cli_inner_pretty.js:476628-476651 | function |
| `LJ4` | `ScrollSpeedRow` (label/value row) | cli_inner_pretty.js:476602-476616 | component |
| `QT5` | `describeEditorSensitivity` (VS Code / Cursor wheel sensitivity hint) | cli_inner_pretty.js:476664-476669 | function |
| `UT5` | `describeTerminal` (term + platform + xterm.js/wt hint) | cli_inner_pretty.js:476621-476627 | function |
| `WJ4` | `ScrollSpeedDialog` (interactive ←/→/Enter/r picker, writes env + settings) | cli_inner_pretty.js:476494-476601 | component |
| `WX8` | `MIN_SCROLL_SPEED` (= 1) | cli_inner_pretty.js:476673 | constant |
| `ZaH` | `CLAUDE_CODE_SCROLL_SPEED` (env var name) | cli_inner_pretty.js:476675 | constant |
| `dT5` | `SCROLL_SPEED_RULER_MSG_THRESHOLD` (= 20 — hide demo ruler when transcript shorter) | cli_inner_pretty.js:476692 | constant |
| `gT5` | `getPlatformDisplayName` (darwin → macOS, etc.) | cli_inner_pretty.js:476652-476663 | function |
| `pT5` | `renderScrollSpeedTrack` (`■■■···`) | cli_inner_pretty.js:476617-476620 | function |

### Alternate-Screen Toggle (v2.1.132)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Y76` | `isAlternateScreenForceDisabled` (`NO_FLICKER=0` OR `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN`) | cli_inner_pretty.js:146488-146490 | function |
| `lq` | `isFullscreenMode` (now consults `Y76` in layer 1) | cli_inner_pretty.js:146491-146520 | function |
| `tYH` | `reportFullscreenReason` (telemetry-friendly reason code, includes `env_off`) | cli_inner_pretty.js:146530-146544 | function |
| `vr$` | `shouldEnableMouseTracking` (returns false when `Y76` is true) | cli_inner_pretty.js:146524-146529 | function |

### Pasting Footer Hint (v2.1.132)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Sm4` | `useFooterMessages` (composes pasting / paste-again / vim mode hints) | cli_inner_pretty.js:550843 | hook |

### Vim Visual Mode (v2.1.118)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ms$` | `useVimModeStateMachine` (returns offset + render state) | cli_inner_pretty.js:549782 | hook |

### Transcript Navigation + Help (v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$HA` | `TranscriptSearchBar` (`/` query + n/N navigation) | cli_inner_pretty.js:579608-579675 | component |
| `HHA` | `TranscriptStatusOrSearchBadge` (count badge / "verbose") | cli_inner_pretty.js:579476-579500 | component |
| `ri4` | `TranscriptFooterBar` (renders `v` to open editor, `?` for help hint, etc.) | cli_inner_pretty.js:579410-579475 | component |
| `si4` | `TranscriptHelpMenu` (overlay listing `{`/`}`/`?`/`v`/`g`/`G`/`/`/`n`/`N`/`[` etc.) | cli_inner_pretty.js:579501-579607 | component |

### Feedback Component (v2.1.141 — recent sessions)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ef5` | `feedbackCommandEntrypoint` (resolves availability, then renders) | cli_inner_pretty.js:429635-429640 | function |
| `P74` | `FeedbackComponent` (top-level UI; reads transcript scope) | cli_inner_pretty.js (loaded from W74) | component |
| `Vf5` | `FEEDBACK_TRANSCRIPT_SCOPE_LABELS` (session/day/week → human strings) | cli_inner_pretty.js:429613-429616 | constant |
| `Z74` | `renderFeedbackComponent` (props: messages, mode, initialDescription) | cli_inner_pretty.js:429625-429634 | function |
| `vf5` | `FEEDBACK_TRANSCRIPT_SCOPE_OPTIONS` (radio choices for "This session", "+24h", "+7d") | cli_inner_pretty.js:429617-429621 | constant |

### Plan Mode Slash UI (v2.1.119)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Pv5` | `PlanPreviewComponent` | cli_inner_pretty.js:483777 | React component |
| `UT7` | `renderInkComponent` (Ink render utility) | cli_inner_pretty.js (utility) | async function |

### Plan Mode Tool Renderers (v2.1.132)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cc7` | `renderExitPlanModeToolUseMessage` | cli_inner_pretty.js:381706 | function |
| `il7` | `renderEnterPlanModeToolUseMessage` | cli_inner_pretty.js:383828 | function |
| `lc7` | `renderExitPlanModeToolResultMessage` | cli_inner_pretty.js:381707 | function |
| `nc7` | `renderExitPlanModeToolUseRejectedMessage` | cli_inner_pretty.js:381708 | function |
| `ol7` | `renderEnterPlanModeToolUseRejectedMessage` | cli_inner_pretty.js:383830 | function |
| `rl7` | `renderEnterPlanModeToolResultMessage` | cli_inner_pretty.js:383829 | function |

### MessageSelector (Partial Compact / Rewind — v2.1.141)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Hc6` | `messageSelector` (Partial Compact / Summarize-up-to-here picker) | cli_inner_pretty.js:539845-540197 | function |
| `ed6` | `isSummarizeAction` | cli_inner_pretty.js:539842-539844 | function |
| `iF5` | `renderRestoreOptionDiffStats` | cli_inner_pretty.js:540241+ | function |
| `lF5` | `summarizeOptionDescription` | cli_inner_pretty.js:540199-540212 | function |
| `nF5` | `renderRestoreOptionStatus` | cli_inner_pretty.js:540213-540240 | function |

### ANSI / Terminal Plumbing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$C` | `settingsPathFormatter` | cli_inner_pretty.js:174506 | function |
| `BOH` | `rememberLastResolutionColor` (caches requested→canonical color mapping for spinner UI) | cli_inner_pretty.js (called from 351396) | function |
| `I4` | `newline` | cli_inner_pretty.js:174378 | constant |
| `Nf` | `SUBAGENT_COLOR_NAMES` / `AGENT_COLOR_PALETTE` (red/blue/green/yellow/purple/orange/pink/cyan) | cli_inner_pretty.js:231368 | constant |
| `Tf` | `csiBuilderAlt` | cli_inner_pretty.js:221405 | object |
| `UP` | `AGENT_COLOR_TUI_KEYS` (per-color theme keys — `red_FOR_SUBAGENTS_ONLY`, …) | cli_inner_pretty.js:231369-231378 | constant |
| `Y$` | `textStyle` | cli_inner_pretty.js:174506 | object |
| `eM` | `csiPrefix` | cli_inner_pretty.js:221719 | constant |
| `jq` | `colorize` | cli_inner_pretty.js:174378 | function |
| `jz$` | `scrollSensitivityValue` | cli_inner_pretty.js:174506 | constant |
| `tM` | `csiPrefixAlt` | cli_inner_pretty.js:221405 | constant |
| `tuiFullscreenBannerCopy` | tuiFullscreenBannerCopy | cli_inner_pretty.js:573972 | constant string |
| `vf` | `csiBuilder` | cli_inner_pretty.js:221719 | object |

### Transcript Keybindings (v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `scroll:fullPageUp`/`fullPageDown` | Ctrl+B / Ctrl+F / space / b | cli_inner_pretty.js:167536-167545 | constant |
| `scroll:halfPageUp`/`halfPageDown` | Ctrl+U / Ctrl+D | cli_inner_pretty.js:167534-167535 | constant |
| `scroll:top`/`bottom` | g / G / home / end | cli_inner_pretty.js:167540-167549 | constant |
| `transcript:exit` | action — q / Esc / Ctrl+C | cli_inner_pretty.js:167531-167533 | constant |
| `transcript:toggleShowAll` | action — Ctrl+E | cli_inner_pretty.js:167530 | constant |

### Status Line + Hooks

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `mU5` | `buildStatusLinePayload` (assembles JSON for status line / `/feedback` redaction) | cli_inner_pretty.js:535631-535672 | function |

### Telemetry Events (UI/Spinner)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `tengu_byte_watchdog_fired_late` | telemetry event for sleep/wake re-arms | cli_inner_pretty.js:128349 | event |
| `tengu_scroll_speed_set` | telemetry event when scroll-speed saved | cli_inner_pretty.js:476541 | event |
| `tengu_spinner_stall_cleared` | telemetry event when tokens resume | cli_inner_pretty.js:328506 | event |
| `tengu_spinner_stalled_ui` | telemetry event for crossing a stall threshold | cli_inner_pretty.js:328520 | event |

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

### Plugin Loader (v2.1.136 + v2.1.142)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `H2` | `SKILLS_DIR_SENTINEL` (= `"skills-dir"`) | cli_inner_pretty.js:218312 | constant |
| `H_` | `fileExists` (used by root SKILL.md detection) | cli_inner_pretty.js:230212 | function |
| `LQ6` | `countPluginHooksByOrigin` | cli_inner_pretty.js:521098-521106 | function |
| `U88` | `loadPluginFromDir` | cli_inner_pretty.js:230049+ | function |
| `V36` | `recordAdvisoryMarketplaceTransition` | cli_inner_pretty.js (utility) | function |
| `VjH` | `formatPluginErrorMessage` | cli_inner_pretty.js:457508-457548+ | function |
| `WTH` | `resolvePluginPathRelative` | cli_inner_pretty.js:229990-229995 | function |
| `Yn` | `INLINE_MARKETPLACE_SENTINEL` (= `"inline"`) | cli_inner_pretty.js:218311 | constant |
| `bM6` | `getPluginBinPaths` | cli_inner_pretty.js:230997-231006 | function |
| `kg` | `validatePluginComponentPaths` | cli_inner_pretty.js:229997-230032 | function |
| `lY` | `getEnabledPlugins` | cli_inner_pretty.js (referenced) | function |
| `nX5` | `scanSkillsPaths` (skills directory walker — accepts root SKILL.md) | cli_inner_pretty.js:457453-457486 | function |
| `r__` | `manifestPathsCoverDefaultFolder` | cli_inner_pretty.js:230034-230048 | function |

### Plugin Marketplaces (v2.1.140 + v2.1.141)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Af4` | `PLUGIN_TAG_USAGE` | cli_inner_pretty.js:460543 | constant |
| `Fp5` | `pluginTagHandlerImpl` | cli_inner_pretty.js:533305 | function |
| `Yo` | `getInlinePluginUrls` | cli_inner_pretty.js:336845, 336963 | function |
| `extraKnownMarketplaces` | `extraKnownMarketplacesSetting` | cli_inner_pretty.js:50625 | settings schema |
| `kv8` | `fetchAndExtractPluginZips` | cli_inner_pretty.js:605932 | function |
| `knownMarketplacesJsonPath` | knownMarketplacesJsonPath | cli_inner_pretty.js:228733 | path helper |
| `tp5` | `pluginPruneHandlerImpl` | cli_inner_pretty.js:533306 | function |

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

*(No new mapped symbols this window — work was confined to error-handling refinements. See themes below.)*

Known new themes for this window:

- `@`-mention file picker not matching files in dirs with >100 entries (v2.1.136 fix)
- `@`-mention file picker not matching mid-session created files in small non-git dirs (v2.1.136 fix)
- `@`-file Tab completion replacing entire prompt inside slash command with absolute path (v2.1.119 fix)
- MCP `@server:` autocomplete includes resources from disconnected servers (v2.1.139 fix)
- `@`-mention OTel event (v2.1.122)

---

## Module: Shell Parser

Bash command parser (for permission classification), PowerShell parser, shell expansion handling, dangerous-rm detector.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$q4` | `isDangerousPowerShellPermission` | cli_inner_pretty.js:422162 | function |
| `Uh6` | `EXEC_WRAPPERS` | cli_inner_pretty.js:403959 | constant |
| `XP$` | `SHELL_WRAPPERS` | cli_inner_pretty.js:403959 | constant |
| `_q4` | `findOverlyBroadPowerShellPermissions` | cli_inner_pretty.js:422173 | function |
| `gz6` | `FIND_DANGEROUS_OPERATORS` | cli_inner_pretty.js:205646 | constant |

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

Slash command parser, command registry, /<command> typo suggestions, slash-cmd autocomplete, plugin commands, command/skill resolution, Remote Control thin-client dispatch.

### Command Registry & Dispatch

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Eg6` | `getLocalJsxCommands` (`/agents`, `/effort`, `/goal`, etc.) | cli_inner_pretty.js:514163-514267 | function |
| `HG` | `getCommandsForContext` (the consumer) | cli_inner_pretty.js:513810-513822 | function |
| `NE4` | `getRemoteControlSlashCommandList` (filters via `fx5`) | cli_inner_pretty.js:513898-513900 | function |
| `TE4` | `getAllCommands` (memoised orchestrator) | cli_inner_pretty.js:514269-514285 | function |
| `UU_` | `REMOTE_AGENT_COMMAND_NAMES` | cli_inner_pretty.js:335940 | constant |
| `Xy` | `findCommand` (resolves a name in the available commands map) | cli_inner_pretty.js (utility) | function |
| `Yx5` | `getCommandRequirements` (returns `{ workspace, ink }`) | cli_inner_pretty.js:513884-513894 | function |
| `fx5` | `isThinClientDispatchable` | cli_inner_pretty.js:513895-513897 | function |
| `gZ` | `getModelFacingCommands` (filters via XG$) | cli_inner_pretty.js:514286-514288 | function |
| `kb` | `getLocalJsxCommandNames` (set of names+aliases) | cli_inner_pretty.js:514268 | function |

### Argument Substitution (v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Vx` | `escapeRegex` | cli_inner_pretty.js:9491-9493 | function |
| `iH8` | `parseArgumentNames` | cli_inner_pretty.js:217467-217473 | function |
| `rH8` | `escapeShellBang` | cli_inner_pretty.js:217510-217514 | function |
| `riK` | `formatProgressiveArgumentHint` | cli_inner_pretty.js:217474-217478 | function |
| `uFH` | `substituteArgsInPrompt` | cli_inner_pretty.js:217479-217509 | function |
| `z36` | `parseArgumentString` | cli_inner_pretty.js:217462-217466 | function |

### `${CLAUDE_EFFORT}` placeholder (v2.1.120)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$I6` | `formatCommand` (returns a `prompt`-type command object with `getPromptForCommand`) | cli_inner_pretty.js:406196-406299 | function |

### `/branch` and `/fork` (v2.1.116 + v2.1.118)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$f5` | `rebuildParentSystemPrompt` | cli_inner_pretty.js:428023-428034 | function |
| `$k5` | `branchCommandConfig` | cli_inner_pretty.js:486868-486876 | object |
| `Kf5` | `branchSlashCommand` | cli_inner_pretty.js:428245-428247 | function |
| `gK4` | `deriveForkName` | cli_inner_pretty.js:428036-428048 | function |
| `iK4` | `branchCommandWriter` | cli_inner_pretty.js:428076-428184 | function |
| `lR6` | `spawnForkFromDirective` | cli_inner_pretty.js:427943-428022 | function |
| `nK4` | `deriveFirstPromptForBranch` | cli_inner_pretty.js:428069-428075 | function |
| `oR6` | `branchCommandModuleInit` | cli_inner_pretty.js:428249-428264 | function |
| `qW4` | `branchCommandExport` | cli_inner_pretty.js:486876 | variable |
| `qf5` | `uniquifyBranchTitle` | cli_inner_pretty.js:428185-428200 | function |
| `rK4` | `branchAndResume` | cli_inner_pretty.js:428201-428244 | function |

### `/color` (v2.1.128)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `LD8` | `performSetColor` (empty arg → random pick from `Nf`) | cli_inner_pretty.js:476491-476511 | function |
| `d74` | `colorCommandDefHeadless` (non-interactive) | cli_inner_pretty.js:430555-430562 | object |
| `if5` | `COLOR_RESET_ALIASES` (`["default","reset","none","gray","grey"]`) | cli_inner_pretty.js:430533 | constant |
| `of5` | `notifyRemoteBridgeColor` (cross-bridge color sync) | cli_inner_pretty.js:476513-476521 | function |
| `rf5` | `colorCommandRunner` (`local-jsx` entrypoint) | cli_inner_pretty.js:476488-476490 | function |
| `sf5` | `colorCommandDef` (interactive) | cli_inner_pretty.js:430546-430554 | object |

### `/effort` Slash (v2.1.111 onward)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `EL8` | `executeEffort` (`auto`/`unset` → `clearEffortLevel`, otherwise applyEffortLevel) | cli_inner_pretty.js:496770-496775 | function |
| `Ey5` | `applyEffortLevel` (typed-arg dispatch, surfaces env-override conflict) | cli_inner_pretty.js:496721-496749 | function |
| `NL8` | `showCurrentEffort` (`/effort current`/`status`) | cli_inner_pretty.js:496750-496756 | function |
| `Ny5` | `parseEffortArg` (auto/unset → `{value:void 0}`, valid level → `{value}`) | cli_inner_pretty.js:496706-496710 | function |
| `T04` | `dispatchEffortToRemoteSession` (sends apply_flag_settings via control transport) | cli_inner_pretty.js:496711-496720 | function |
| `VU6` | `commitEffortAndNotify` (run EL8, update AppState, call onDone) | cli_inner_pretty.js:496786-496796 | function |
| `yy5` | `clearEffortLevel` (`/effort auto` — persists + emits "set to auto") | cli_inner_pretty.js:496757-496769 | function |

### `/goal` Slash (v2.1.139 + v2.1.140)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BR5` | `goalCommand` (interactive local-jsx variant) | cli_inner_pretty.js:507850-507857 | object |
| `Gk4` | `nonInteractiveGoalModule` | cli_inner_pretty.js:507813-507843 | module |
| `Hx5` | `goalDefault` (= `BR5`; the default export) | cli_inner_pretty.js:514106 | reference |
| `JmH` | `isGoalUsageHint` | cli_inner_pretty.js:574080 | function |
| `ov5` | `GOAL_TRUST_GATE_MSG` (workspace-trust gate message; emitted with `code: "trust_gate"`) | cli_inner_pretty.js:486760 | constant |
| `Ng6` | `goalNonInteractive` (alias reference for non-interactive registration) | cli_inner_pretty.js:514107 | reference |
| `UR5` | `goalDefaultExport` (= `goalCommand`) | cli_inner_pretty.js:507870 | object |
| `Vk4` | `goalCommandExports` | cli_inner_pretty.js:507845-507871 | module |
| `WE4` | `goalCommandModuleRef` | cli_inner_pretty.js:514105 | module reference |
| `Wk4` | `interactiveGoalModule` | cli_inner_pretty.js:507787-507811 | module |
| `mR5` | `goalNonInteractiveCall` (`pR5.call` body) | cli_inner_pretty.js:507815-507839 | function |
| `pR5` | `goalNonInteractive` (non-interactive local variant) | cli_inner_pretty.js:507858-507869 | object |
| `uR5` | `interactiveGoalCall` (`BR5.call` body) | cli_inner_pretty.js:507789-507806 | function |

### `/plan` Slash (v2.1.119 fix)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Wv5` | `planSlashCommandHandler` | cli_inner_pretty.js:483806 | async function |
| `Zv5` | `planSlashCommandDef` | cli_inner_pretty.js:483872 | command definition |

### `/scroll-speed` (v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `VJ4` | `scrollSpeedCommandDefAlias` (assigned from `lT5`) | cli_inner_pretty.js:476720 | object |
| `cT5` | `scrollSpeedCommandEntrypoint` (resolves editor sensitivity, then renders dialog) | cli_inner_pretty.js:476693-476697 | function |
| `lT5` | `scrollSpeedCommandDef` (`local-jsx`, fullscreen-only, JetBrains-disabled) | cli_inner_pretty.js:476708-476720 | object |

### `/skills` and skill discovery (v2.1.121 + v2.1.129 + v2.1.133)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ax5` | `getSkillsFromAllSources` | cli_inner_pretty.js:513752-513791 | function |
| `D9H` | `applyFallbackDeduplication` (drops same-suffix `fallback: true` skills) | cli_inner_pretty.js:513829-513842 | function |
| `Dh6` | `loadPluginSkills` (iterates plugin manifests) | cli_inner_pretty.js (plugin-loader module) | function |
| `GTH` | `getSkillToolListing` | cli_inner_pretty.js:514289-514311 | function |
| `GrK` | `getBuiltinPluginSkills` | cli_inner_pretty.js (builtin plugin module) | function |
| `KI6` | `loadSkillDirCommands` (walks `~/.claude/skills/` and project skills) | cli_inner_pretty.js (skill-loader module) | function |
| `LG$` | `isLocallyDispatchable` | cli_inner_pretty.js:513871-513875 | function |
| `XG$` | `shouldListSkillForModel` (filter predicate) | cli_inner_pretty.js:513858-513870 | function |
| `aT5` | `resolveProjectSkillOverride` | cli_inner_pretty.js:476894-476896 | function |
| `iP8` | `isSkillHiddenFromUser` | cli_inner_pretty.js:513855-513857 | function |
| `kE4` | `isDispatchable` | cli_inner_pretty.js:513881-513883 | function |
| `oT5` | `resolveSkillOverrideLock` | cli_inner_pretty.js:476885-476893 | function |
| `st` | `getSkillOverride` | cli_inner_pretty.js:513847-513849 | function |
| `zG4` | `getBundledSkills` | cli_inner_pretty.js (bundled module) | function |

### `/ultrareview` (v2.1.113 + v2.1.120)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ulK` | `ultrareviewCommandDef` | cli_inner_pretty.js:474830 | object |
| `wlK` | `ultrareviewPreflightSchema` | cli_inner_pretty.js:447 | function |

### `/usage` Merger (v2.1.118)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `iB6` | `usageCommandDefHeadless` (`local`, supportsNonInteractive=true) | cli_inner_pretty.js:481079-481090 | object |
| `nB6` | `usageCommandDef` (`local-jsx`, aliases `cost`,`stats`) | cli_inner_pretty.js:481069-481078 | object |

### `/goal` & `/scroll-speed` Telemetry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `tengu_effort_command` | telemetry event for `/effort` use | cli_inner_pretty.js:496730, :496761 | event |
| `tengu_goal_achieved` | telemetry — Stop-hook success → goal achieved | cli_inner_pretty.js:391761 | event |
| `tengu_goal_restored_on_resume` | telemetry — goal restored on `--resume` | cli_inner_pretty.js:564163 | event |
| `tengu_stop_hook_added` | telemetry — Stop-hook registration via `/goal` | cli_inner_pretty.js:486729 | event |
| `tengu_stop_hook_removed` | telemetry — Stop-hook removal via `/goal` | cli_inner_pretty.js:486743 | event |

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

---

**Status**: Integration symbols consolidated into symbol_index_infra_integration.md as of v2.1.142 deobfuscation work.
