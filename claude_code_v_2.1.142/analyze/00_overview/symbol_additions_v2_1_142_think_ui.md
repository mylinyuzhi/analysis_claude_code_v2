# Symbol Additions — v2.1.142 Unit 12: 19_think_level + 02_ui

Symbols discovered while analyzing the thinking/effort and UI changes between v2.1.113 and v2.1.142. All locations are line numbers inside `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (single-bundle build for 2.1.142 — the older multi-`chunks.NN.mjs` split is gone in this release).

To merge into the appropriate `symbol_index_*.md` once unit work completes:
- Effort/thinking symbols → `symbol_index_core_features.md` (Module: Thinking Mode / Effort)
- UI / TUI / spinner symbols → `symbol_index_core_features.md` (Module: CLI / UI) and `symbol_index_infra_integration.md` (Module: UI Components / Slash Commands)

---

## Module: Effort Level Resolution (19_think_level)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `CP` | `modelSupportsEffort` (effort-parameter capability gate) | cli_inner_pretty.js:198795-198811 | function |
| `fY$` | `modelSupportsMaxEffort` (blocklist-driven max gate) | cli_inner_pretty.js:198812-198828 | function |
| `OY$` | `modelSupportsXhigh` (Opus 4.7-only xhigh gate) | cli_inner_pretty.js:198829-198847 | function |
| `Z3H` | `resolveAppliedEffort` (env→opus47-default→state→default with downgrade) | cli_inner_pretty.js:198874-198884 | function |
| `He$` | `isOpus47LaunchDefaultActive` (model is opus-4-7 AND !unpinOpus47LaunchEffort) | cli_inner_pretty.js:198871-198873 | function |
| `$e$` | `getDefaultEffortForModel` (opus-4-7 → "xhigh", else "high") | cli_inner_pretty.js:198951-198954 | function |
| `IUH` | `readEnvEffortLevel` (`CLAUDE_CODE_EFFORT_LEVEL`, "auto"/"unset" → null) | cli_inner_pretty.js:198867-198870 | function |
| `aT` | `resolveEffortForApi` (`resolveAppliedEffort(model, state) ?? "high"`) — used to build `CLAUDE_EFFORT` env var | cli_inner_pretty.js:198908-198911 | function |
| `CZ` | `resolveEffortForApiIfSupported` (returns undefined when model doesn't support effort) | cli_inner_pretty.js:198912-198914 | function |
| `SUH` | `formatEffortStatusBarSuffix` (" with high effort" / " with xhigh effort") | cli_inner_pretty.js:198915-198920 | function |
| `wY$` | `persistEffortAndUnpinOpus47` (saves `effortLevel` + sets unpinOpus47LaunchEffort) | cli_inner_pretty.js:198895-198903 | function |
| `sA6` | `resolveEffortFromCli` (CLI `--effort` arg path; latches unpin when set) | cli_inner_pretty.js:198904-198907 | function |
| `DC` | `parseEffortInput` (low/medium/high/xhigh/max + numeric) | cli_inner_pretty.js:198851-198859 | function |
| `G3H` | `parseEffortLevelStrict` (low/medium/high/xhigh only — string source) | cli_inner_pretty.js:198860-198863 | function |
| `H0H` | `isValidEffortLevel` (low/medium/high/xhigh/max) | cli_inner_pretty.js:198848-198850 | function |
| `$0H` | `coerceToEffortLevel` (typeof check, defaults to "high") | cli_inner_pretty.js:198924-198927 | function |
| `Ht1` | `getEffortDescription` (level → human description) | cli_inner_pretty.js:198928-198941 | function |
| `tA6` | `getEffortDescriptionWithBurnHint` (appends "burns fastest" on Pro/Opus 4.6) | cli_inner_pretty.js:198942-198950 | function |
| `ngK` | `resolveSettingsEffortLevel` (cli.effort → settings.effortLevel) | cli_inner_pretty.js:198972-198976 | function |
| `MY$` | `effortApplyWouldChange` (whether commit changes resolved effort, used for confirmation gate) | cli_inner_pretty.js:198885-198894 | function |
| `aA6` | `XHIGH_MODELS_LABEL` ("Opus 4.7 only") | cli_inner_pretty.js:198956 | constant |
| `cgK` | `MAX_MODELS_LABEL` ("Opus 4.6/4.7, Sonnet 4.6") | cli_inner_pretty.js:198957 | constant |
| `sF` | `EFFORT_LEVELS` (`["low","medium","high","xhigh","max"]`) | cli_inner_pretty.js:198970 | constant |
| `Ey5` | `applyEffortLevel` (typed-arg dispatch, surfaces env-override conflict) | cli_inner_pretty.js:496721-496749 | function |
| `EL8` | `executeEffort` (`auto`/`unset` → `clearEffortLevel`, otherwise applyEffortLevel) | cli_inner_pretty.js:496770-496775 | function |
| `yy5` | `clearEffortLevel` (`/effort auto` — persists + emits "set to auto") | cli_inner_pretty.js:496757-496769 | function |
| `NL8` | `showCurrentEffort` (`/effort current`/`status`) | cli_inner_pretty.js:496750-496756 | function |
| `Ny5` | `parseEffortArg` (auto/unset → `{value:void 0}`, valid level → `{value}`) | cli_inner_pretty.js:496706-496710 | function |
| `T04` | `dispatchEffortToRemoteSession` (sends apply_flag_settings via control transport) | cli_inner_pretty.js:496711-496720 | function |
| `VU6` | `commitEffortAndNotify` (run EL8, update AppState, call onDone) | cli_inner_pretty.js:496786-496796 | function |
| `Sy5` | `EffortApplyAndCloseFC` (typed-arg path; renders cache-miss confirmation when needed) | cli_inner_pretty.js:496797-496846 | component |
| `hy5` | `ShowCurrentEffortFC` (read-only `/effort current` renderer) | cli_inner_pretty.js:496776-496785 | component |
| `py5` | `EffortSliderComponent` (interactive 5-position slider with env-override awareness) | cli_inner_pretty.js:496927-497117 | component |
| `vZ$` | `EffortLevelLabel` (per-level styled label for slider) | cli_inner_pretty.js:496853-496879 | component |
| `my5` | `RainbowAnimatedLevelLabel` (max-level cycling rainbow) | cli_inner_pretty.js:496880-496900 | component |
| `By5` | `ShimmerLevelLabel` (xhigh shimmer animation) | cli_inner_pretty.js:496901-496926 | component |
| `Fy5` | `nextEffortIndex` (clamp at last position) | cli_inner_pretty.js:497121-497123 | function |
| `gy5` | `prevEffortIndex` (clamp at 0) | cli_inner_pretty.js:497124-497126 | function |
| `Uy5` | `sliderLabelSpacer` (returns whitespace pad by index) | cli_inner_pretty.js:497118-497120 | function |
| `x1H` | `SLIDER_LEVELS` (5-position config with color styling) | cli_inner_pretty.js:496703 | constant |
| `Z04` | `DEFAULT_SLIDER_INDEX` (= 3, xhigh) | cli_inner_pretty.js (initializer near 496935-496948) | constant |
| `kL8` | `EFFORT_HELP_TEXT` (`/effort` help string referencing xhigh) | cli_inner_pretty.js:497171-497185 | constant |
| `unpinOpus47LaunchEffort` | App-config flag — latches once user makes their first effort choice | cli_inner_pretty.js:198871-198873, :198901-198902 | variable |
| `tengu_effort_command` | telemetry event for `/effort` use | cli_inner_pretty.js:496730, :496761 | constant |

## Module: Status Line + Hook Effort Plumbing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `mU5` (or surrounding `cU$` builder, see source) | `buildStatusLinePayload` (assembles JSON for status line / `/feedback` redaction) | cli_inner_pretty.js:535631-535672 | function |
| (inline) | `statusLinePayload.effort` (`{ level }`) and `statusLinePayload.thinking.enabled` | cli_inner_pretty.js:535657-535658 | object field |
| (inline) | `HookInputSchema.effort.level` (Zod schema field) | cli_inner_pretty.js:237705-237716 | object field |
| (inline) | `setHookEnvFromInput.CLAUDE_EFFORT` (parses input.effort.level into env var) | cli_inner_pretty.js:520867-520869 | function |
| (inline) | `bashToolExtraEnv.CLAUDE_EFFORT` (injects for Bash commands) | cli_inner_pretty.js:419634-419636 | function |
| (inline) | `slashCommandSubstitution.${CLAUDE_EFFORT}` (replaces token in command bodies) | cli_inner_pretty.js:399003, :406269 | function |
| `lm5` | `applyOutputConfigEffort` (sets `output_config.effort` if `modelSupportsEffort`) | cli_inner_pretty.js:524795-524803 | function |
| `WxH` | `EFFORT_BETA_HEADER` (anthropic-beta value enabling `output_config.effort`) | cli_inner_pretty.js (referenced from 524801-524802) | constant |

## Module: Bedrock ARN Effort Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `k7` | `resolveModelCanonicalId` (model id with ARN→backing-model resolution) | cli_inner_pretty.js:97419-97427 | function |
| `Nj` | `stripModelVersionSuffixToCanonicalId` (matches claude-opus-4-7 / etc.) | cli_inner_pretty.js:97401-97418 | function |
| `abH` | `loadBedrockInferenceProfileBackingModel` (async GetInferenceProfileCommand, caches result) | cli_inner_pretty.js:90502-90523 | function |
| `av8` | `getInferenceProfileBackingModel` (read from in-memory cache) | cli_inner_pretty.js:3172-3174 | function |
| `sv8` | `setInferenceProfileBackingModel` (write to cache, called by abH after async lookup) | cli_inner_pretty.js:3175-3177 | function |
| `U$.inferenceProfileBackingModels` | Cache map: ARN → backing model id | cli_inner_pretty.js:2300 | variable |

## Module: Stream Idle Byte-Watchdog (19_think_level — v2.1.139 fix)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `U$6` | `getStreamIdleTimeoutMs` (`max(env CLAUDE_STREAM_IDLE_TIMEOUT_MS, 300000)`) | cli_inner_pretty.js:128278-128280 | function |
| `TV1` | `wrapStreamWithByteWatchdog` (re-armable byte watchdog with sleep/suspend rescue) | cli_inner_pretty.js:128281-128392 | function |
| `VV1` | `isByteWatchdogEnabled` (feature flag `tengu_stream_watchdog_default_on`) | cli_inner_pretty.js:128393-128397 | function |
| `vV1` | `fetchWithByteWatchdog` (fetch wrapper that wraps SSE body) | cli_inner_pretty.js:128398-128428 | function |
| `$l$` | `StreamIdleTimeoutError` (carries `idleMs`/`bytesReceived`/`ttfbMs`/`bodyReadPending`/`cfRay`) | cli_inner_pretty.js:128470-128485 | class |
| `tengu_byte_watchdog_fired_late` | telemetry event for sleep/wake re-arms | cli_inner_pretty.js:128349 | constant |
| `cli_byte_watchdog_fired` | structured warn event for fired watchdog | cli_inner_pretty.js:128341 | constant |
| `cli_streaming_idle_warning` | structured warn event for soft-idle (no chunk for N seconds) | cli_inner_pretty.js:525384 | constant |

---

## Module: Spinner + Thinking Hints (02_ui — v2.1.116 / v2.1.141)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Py7` | `SpinnerComponent` (renders glimmer + thinking-status + tokens) | cli_inner_pretty.js:328468-328694 | component |
| `oB_` | `getThinkingHintForElapsed` (returns "thinking" / "still thinking" / "thinking more" / "thinking some more" / "almost done thinking") | cli_inner_pretty.js:328461-328467 | function |
| `nG6` | `useStallDetector` (tracks `timeSinceLastToken`, eases `stalledIntensity` 0→1 over 10s past idle threshold) | cli_inner_pretty.js:328245-328274 | function |
| `wy7` | `computeCompactingPercent` (asymptote at 95%, `1 - exp(-elapsed/90s)`) | cli_inner_pretty.js:328456-328459 | function |
| `lB_` | `STILL_THINKING_MS` (= 10_000) | cli_inner_pretty.js:328735 | constant |
| `nB_` | `THINKING_MORE_MS` (= 20_000) | cli_inner_pretty.js:328736 | constant |
| `iB_` | `THINKING_SOME_MORE_MS` (= 30_000) | cli_inner_pretty.js:328737 | constant |
| `rB_` | `ALMOST_DONE_THINKING_MS` (= 45_000) | cli_inner_pretty.js:328738 | constant |
| `Xy7` | `THINKING_WARM_START_MS` (= 10_000 — start fading spinner to amber) | cli_inner_pretty.js:328733 | constant |
| `cB_` | `THINKING_WARM_FULL_MS` (= 20_000 — full amber) | cli_inner_pretty.js:328734 | constant |
| `FB_` | `STALL_TELEMETRY_THRESHOLDS_MS` (`[10000, 45000, 300000]`) | cli_inner_pretty.js:328758 | constant |
| `gB_` | `SPINNER_DIM_RGB` (`{r:153,g:153,b:153}`) | cli_inner_pretty.js:328759 | constant |
| `QB_` | `SPINNER_BRIGHT_RGB` (`{r:185,g:185,b:185}`) | cli_inner_pretty.js:328760 | constant |
| `Dy7` | `THINKING_LABEL_WIDTH` (precomputed width of `"thinking"`) | cli_inner_pretty.js:328757 | constant |
| `BB_` | `SPINNER_LONG_RESPONSE_TOKENS` (= 16000, threshold for revealing time) | cli_inner_pretty.js:328724 | constant |
| `Jy7` | `SPINNER_SHIMMER_DELAY_MS` (= 3000, before the dim↔bright oscillation starts) | cli_inner_pretty.js:328731 | constant |
| `dB_` | `SPINNER_SHIMMER_PERIOD_S` (= 2) | cli_inner_pretty.js:328732 | constant |
| `tengu_spinner_stalled_ui` | telemetry event for crossing a stall threshold | cli_inner_pretty.js:328520 | constant |
| `tengu_spinner_stall_cleared` | telemetry event when tokens resume | cli_inner_pretty.js:328506 | constant |

## Module: `/scroll-speed` Command + Setting (02_ui — v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `lT5` | `scrollSpeedCommandDef` (`local-jsx`, fullscreen-only, JetBrains-disabled) | cli_inner_pretty.js:476708-476720 | object |
| `VJ4` | `scrollSpeedCommandDefAlias` (assigned from `lT5`) | cli_inner_pretty.js:476720 | object |
| `WJ4` | `ScrollSpeedDialog` (interactive ←/→/Enter/r picker, writes env + settings) | cli_inner_pretty.js:476494-476601 | component |
| `LJ4` | `ScrollSpeedRow` (label/value row) | cli_inner_pretty.js:476602-476616 | component |
| `pT5` | `renderScrollSpeedTrack` (`■■■···`) | cli_inner_pretty.js:476617-476620 | function |
| `UT5` | `describeTerminal` (term + platform + xterm.js/wt hint) | cli_inner_pretty.js:476621-476627 | function |
| `FT5` | `getTerminalDisplayName` (Cursor / Windsurf / iTerm2 / Terminal.app / …) | cli_inner_pretty.js:476628-476651 | function |
| `gT5` | `getPlatformDisplayName` (darwin → macOS, etc.) | cli_inner_pretty.js:476652-476663 | function |
| `QT5` | `describeEditorSensitivity` (VS Code / Cursor wheel sensitivity hint) | cli_inner_pretty.js:476664-476669 | function |
| `cT5` | `scrollSpeedCommandEntrypoint` (resolves editor sensitivity, then renders dialog) | cli_inner_pretty.js:476693-476697 | function |
| `dT5` | `SCROLL_SPEED_RULER_MSG_THRESHOLD` (= 20 — hide demo ruler when transcript shorter) | cli_inner_pretty.js:476692 | constant |
| `ZaH` | `CLAUDE_CODE_SCROLL_SPEED` (env var name) | cli_inner_pretty.js:476675 | constant |
| `WX8` | `MIN_SCROLL_SPEED` (= 1) | cli_inner_pretty.js:476673 | constant |
| `$Z$` | `MAX_SCROLL_SPEED` (= 10) | cli_inner_pretty.js:476674 | constant |
| `tengu_scroll_speed_set` | telemetry event when value saved | cli_inner_pretty.js:476541 | constant |

## Module: Alternate-Screen Toggle (02_ui — v2.1.132)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Y76` | `isAlternateScreenForceDisabled` (`NO_FLICKER=0` OR `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN`) | cli_inner_pretty.js:146488-146490 | function |
| `lq` | `isFullscreenMode` (now consults `Y76` in layer 1) | cli_inner_pretty.js:146491-146520 | function |
| `vr$` | `shouldEnableMouseTracking` (returns false when `Y76` is true) | cli_inner_pretty.js:146524-146529 | function |
| `tYH` | `reportFullscreenReason` (telemetry-friendly reason code, includes `env_off`) | cli_inner_pretty.js:146530-146544 | function |
| `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN` | new env var (force-disable alt screen) | cli_inner_pretty.js:482157 | constant |

## Module: Transcript Navigation + Help (02_ui — v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ri4` | `TranscriptFooterBar` (renders `v` to open editor, `?` for help hint, etc.) | cli_inner_pretty.js:579410-579475 | component |
| `si4` | `TranscriptHelpMenu` (overlay listing `{`/`}`/`?`/`v`/`g`/`G`/`/`/`n`/`N`/`[` etc.) | cli_inner_pretty.js:579501-579607 | component |
| `$HA` | `TranscriptSearchBar` (`/` query + n/N navigation) | cli_inner_pretty.js:579608-579675 | component |
| `HHA` | `TranscriptStatusOrSearchBadge` (count badge / "verbose") | cli_inner_pretty.js:579476-579500 | component |
| `transcript:toggleShowAll` | action — Ctrl+E | cli_inner_pretty.js:167530 | constant |
| `transcript:exit` | action — q / Esc / Ctrl+C | cli_inner_pretty.js:167531-167533 | constant |
| `scroll:halfPageUp`/`halfPageDown` | Ctrl+U / Ctrl+D | cli_inner_pretty.js:167534-167535 | constant |
| `scroll:fullPageUp`/`fullPageDown` | Ctrl+B / Ctrl+F / space / b | cli_inner_pretty.js:167536-167545 | constant |
| `scroll:top`/`bottom` | g / G / home / end | cli_inner_pretty.js:167540-167549 | constant |

## Module: Vim Visual Mode (02_ui — v2.1.118)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ms$` | `useVimModeStateMachine` (returns offset + render state) | cli_inner_pretty.js:549782 | hook |
| (inline) | `vimEnterVisual` (`{ mode: "VISUAL", kind: "char"|"line", anchor, command }`) | cli_inner_pretty.js:549825-549832 | function |
| (inline) | `processVisualOp` (visualOp/visualReplace/visualCase/visualPaste/visualIndent/visualChange) | cli_inner_pretty.js:549890-549908 | function |
| (inline) | `visualEnterOnVOrCapitalV` (NORMAL→VISUAL on `v` or `V`) | cli_inner_pretty.js:549950-549953 | function |

## Module: `/usage` Command Merge (02_ui — v2.1.118)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `nB6` | `usageCommandDef` (`local-jsx`, aliases `cost`,`stats`) | cli_inner_pretty.js:481069-481078 | object |
| `iB6` | `usageCommandDefHeadless` (`local`, supportsNonInteractive=true) | cli_inner_pretty.js:481079-481090 | object |

## Module: Custom Themes + Named Slugs (02_ui — v2.1.118)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `qL4` | `ThemeEditorDialog` (name + slug + color picker; persists per-slug) | cli_inner_pretty.js:481434-481605 | component |
| `IBH` | `CustomThemeContext` (provides `customThemes`/`activeCustomTheme`/`reloadCustomThemes`/`setPreviewOverrides`) | cli_inner_pretty.js:146732, :146766 | context |
| `HfH` | `useCustomThemes` (context consumer) | cli_inner_pretty.js:146765-146770 | hook |
| `lV5` | `suggestThemeSlug` (slugify name) | cli_inner_pretty.js:481471-481473 | function |
| `IZH` | `isValidHexColor` (validates override entry) | cli_inner_pretty.js:481521 | function |
| `rK6` | `saveCustomTheme` (writes themes/<slug>.json) | cli_inner_pretty.js:481498-481501 | function |
| `KB` | `removeObjectKey` (immutable Object.fromEntries(filter)) | (utility) | function |

## Module: `/color` Random (02_ui — v2.1.128)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `LD8` | `performSetColor` (empty arg → random pick from `Nf`) | cli_inner_pretty.js:476491-476511 | function |
| `rf5` | `colorCommandRunner` (`local-jsx` entrypoint) | cli_inner_pretty.js:476488-476490 | function |
| `of5` | `notifyRemoteBridgeColor` (cross-bridge color sync) | cli_inner_pretty.js:476513-476521 | function |
| `Nf` | `SUBAGENT_COLOR_NAMES` (red/blue/green/yellow/purple/orange/pink/cyan) | cli_inner_pretty.js:231368 | constant |
| `if5` | `COLOR_RESET_ALIASES` (`["default","reset","none","gray","grey"]`) | cli_inner_pretty.js:430533 | constant |
| `sf5` | `colorCommandDef` (interactive) | cli_inner_pretty.js:430546-430554 | object |
| `d74` | `colorCommandDefHeadless` (non-interactive) | cli_inner_pretty.js:430555-430562 | object |

## Module: `/feedback` Recent Sessions (02_ui — v2.1.141)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Vf5` | `FEEDBACK_TRANSCRIPT_SCOPE_LABELS` (session/day/week → human strings) | cli_inner_pretty.js:429613-429616 | constant |
| `vf5` | `FEEDBACK_TRANSCRIPT_SCOPE_OPTIONS` (radio choices for "This session", "+24h", "+7d") | cli_inner_pretty.js:429617-429621 | constant |
| `Z74` | `renderFeedbackComponent` (props: messages, mode, initialDescription) | cli_inner_pretty.js:429625-429634 | function |
| `Ef5` | `feedbackCommandEntrypoint` (resolves availability, then renders) | cli_inner_pretty.js:429635-429640 | function |
| `P74` | `FeedbackComponent` (top-level UI; reads transcript scope) | cli_inner_pretty.js (loaded from W74) | component |

## Module: Pasting Footer Hint (02_ui — v2.1.132)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Sm4` | `useFooterMessages` (composes pasting / paste-again / vim mode hints) | cli_inner_pretty.js:550843 | hook |
| (inline) | `pastingFooterHint` ("Pasting…" dim text when `isPasting`) | cli_inner_pretty.js:550854-550859 | constant |
| (inline) | `pasteAgainHint` ("paste again to expand") | cli_inner_pretty.js:550861-550866 | constant |
| `kill-paste-hint` | toast key — "Ctrl+Y to paste deleted text" | cli_inner_pretty.js:176077 | constant |
