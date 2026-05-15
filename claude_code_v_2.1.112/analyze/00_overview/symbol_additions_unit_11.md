# Symbol Additions — Unit 11: 02_ui (TUI / Fullscreen / Focus / Notifications)

Symbols discovered while analyzing the TUI/rendering changes between v2.1.88 and v2.1.112. These should be merged into the canonical `symbol_index.md` once all 18 units complete.

Source-of-truth pairing: v2.1.88 readable names come from `/lyz/codespace/3rd/claude-code/src/` (TypeScript) where they already existed; v2.1.110+ additions are reconstructed from the obfuscated chunks plus changelog narrative.

---

## Module: Fullscreen Renderer Cascade

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `lq` | `isFullscreenMode` | chunks.65.mjs:1491-1505 | function |
| `Ph_` | `isFullscreenActive` (`isInteractive() && isFullscreenMode()`) | chunks.65.mjs:1517-1519 | function |
| `Xa6` | `isTmuxIntegrationMode` (cached, lazy probe) | chunks.65.mjs:1486-1489 | function |
| `Mh_` | `probeTmuxControlModeSync` (one-shot subprocess probe) | chunks.65.mjs:1460-1483 | function |
| `wK4` | `getNoFlickerEnvState` (`"on"`/`"off"`/`undefined`) | chunks.65.mjs:1507-1511 | function |
| `sb1` | `isMouseTrackingEnabled` | chunks.65.mjs:1513-1515 | function |
| `$K4` | `maybeGetTmuxMouseHint` (one-time hint when fullscreen + tmux mouse off) | chunks.65.mjs:1521-1535 | function |
| `jK4` | `maybeGetTmuxFocusHint` (one-time hint when tmux focus-events off) | chunks.65.mjs:1537-1551 | function |
| `Ja6` | `sharedFlagState` (module-level mutable cache for once-per-session flags) | chunks.65.mjs:1553 | variable |
| `HK4` | `fullscreenModuleExports` (`{}` wrapper) | chunks.65.mjs:1565 | object |
| `Jh_` | `createFlagState` (constructor for `Ja6`-like state objects, used in tests) | chunks.65.mjs (utility) | function |
| `Hh_` | `spawnSync` (re-exported from child_process) | chunks.65.mjs | function |
| `tengu_pewter_brook` | feature flag for fullscreen staged rollout | chunks.65.mjs:1504 (string literal) | constant |

## Module: `/tui` Command + Setting

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bcY` | `tuiCommandHandler` (async dispatcher with relaunch) | chunks.185.mjs:397-431 | function |
| `IcY` | `tuiCommandDef` (slash command registration) | chunks.185.mjs:444-454 | object |
| `KiK` | `tuiCommandDefAlias` (assigned from `IcY`) | chunks.185.mjs:453 | object |
| `n$7` | `validTuiModes` (`["default", "fullscreen"]`) | chunks.185.mjs:438 | constant |
| `er8` | `relaunchSession` (process re-spawn with same session-id) | chunks.185.mjs:354-381 | function |
| `qiK` | `loadTuiHandler` (lazy import) | chunks.185.mjs:432 | function |
| `enK` | `tuiCommandModule` (loaded module object) | chunks.185.mjs:393 | object |
| `udK` | `tuiJustSwitchedBanner` (post-relaunch one-shot banner) | chunks.181.mjs:1474-1509 | function |
| `xdK` | `fullscreenUpsellBanner` (`/tui fullscreen` suggestion) | chunks.181.mjs:1457-1472 | function |
| `IdK` | `recordFullscreenUpsellSeen` (telemetry + counter) | chunks.181.mjs:1445-1455 | function |
| `bdK` | `useFullscreenUpsellEligibility` (React hook) | chunks.181.mjs:1440-1443 | function |
| `RdK` | `FullscreenUpsellGlyph` (shimmering "Try" icon) | chunks.181.mjs:1457 (via `K = mw.createElement(RdK,null)`) | component |
| `ogY` | `evaluateFullscreenUpsellEligibility` (init for the hook) | chunks.181.mjs (initializer) | function |
| `rgY` | `FULLSCREEN_UPSELL_MAX_SHOWN` (`3`) | chunks.181.mjs:1515 | constant |
| `CdK` | re-exported React (for module isolation) | chunks.181.mjs:1513,1527 | variable |
| `mw` | re-exported React (parallel import) | chunks.181.mjs:1511,1527 | variable |
| `tengu_tui_command` | telemetry event for `/tui` use | chunks.185.mjs:422 (string literal) | constant |
| `tengu_fullscreen_upsell_shown` | telemetry event for upsell display | chunks.181.mjs:1452 (string literal) | constant |

## Module: `/focus` Command + Brief Transcript State

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `FoY` | `focusCommandDef` (slash command definition) | chunks.189.mjs:1450-1475 | object |
| `OtK` | `focusCommandDefAlias` (assigned from `FoY`) | chunks.189.mjs:1474 | object |
| `wtK` | `loadFocusCommandDef` (lazy assign wrapper) | chunks.189.mjs:1450 | function |
| `briefTranscript` | `AppState.briefTranscript` field | chunks.117.mjs:2620 (default), chunks.64.mjs:2118 (in config schema) | variable |
| `viewMode` | settings.json `viewMode: "default"\|"verbose"\|"focus"` | chunks.19.mjs:510 | constant |
| `rRK` | `collapseForFocusMode` (transcript filter) | chunks.182.mjs:1505 | function |
| `tengu_brief_mode_toggled` | telemetry event for `/focus` and `/brief` | chunks.205.mjs:513, chunks.189.mjs:1587 | constant |

## Module: Ctrl+O / Transcript View Actions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `app:toggleTranscript` | global action handle for Ctrl+O | chunks.205.mjs:527 (registration), chunks.72.mjs:2226 (in `wm1` action list) | constant |
| `transcript:toggleShowAll` | transcript-context action for Ctrl+E | chunks.205.mjs:550 (registration), chunks.72.mjs:1818 (default `ctrl+e` binding) | constant |
| `transcript:exit` | transcript-context action for Escape | chunks.205.mjs:553, chunks.72.mjs:1819-1820 | constant |
| `tengu_toggle_transcript` | telemetry event for Ctrl+O | chunks.205.mjs:486 | constant |
| `tengu_transcript_toggle_show_all` | telemetry event for Ctrl+E | chunks.205.mjs:494 | constant |
| `tengu_transcript_exit` | telemetry event for transcript-exit | chunks.205.mjs:500 | constant |
| `iO5` | `TranscriptFooter` (bottom-bar layout with [/v hints) | chunks.208.mjs:2404-2454 | function |
| `I2A` | `TranscriptStatus` (right-side status/search badge) | chunks.208.mjs:2456-2482 | function |
| `gmK` | `detectExternalEditor` (resolves `$EDITOR`/`$VISUAL`/defaults) | chunks.208.mjs (utility) | function |

## Module: PushNotification Tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AJY` | `PushNotificationTool` (deferred tool wrapper) | chunks.152.mjs:2184-2295 | object |
| `ic` | `PUSH_NOTIFICATION_TOOL_NAME` (string `"PushNotification"`) | chunks.101.mjs:1261 | constant |
| `cI4` | `PUSH_DESCRIPTION` (short description) | chunks.152.mjs (via JVK init) | constant |
| `lI4` | `PUSH_FULL_PROMPT` (long behavior-guidance prompt) | chunks.152.mjs (via JVK init) | constant |
| `_JY` | `pushInputSchema` (Zod) | chunks.152.mjs:2173-2175 | function |
| `zJY` | `pushOutputSchema` (Zod) | chunks.152.mjs:2176-2183 | function |
| `YJY` | `USER_IDLE_THRESHOLD_MS` (`300000` = 5 minutes; also feature-flag cache TTL) | chunks.152.mjs:2160 | constant |
| `wVK` | `renderToolUseMessage` (PushNotification UI) | chunks.152.mjs:2231 | function |
| `$VK` | `renderToolResultMessage` (PushNotification UI) | chunks.152.mjs:2232 | function |
| `JVK` | `loadPushNotificationToolModule` (lazy init) | chunks.152.mjs:2164-2296 | function |
| `HVK` | `pushNotificationToolModuleExports` (`{}` wrapper) | chunks.152.mjs:2154 | object |
| `UVK` | `PushNotificationToolExportRef` (handle in tools registry) | chunks.153.mjs:696 | object |
| `wr1` | `getPushSystemPromptAugment` (returns "" or "When an event lands..." sentence) | chunks.101.mjs | function |
| `e56` | `isPushNotificationEnabled` (`I18() && agentPushNotifEnabled`) | chunks.101.mjs | function |
| `I18` | `isAmberSentinelGateEnabled` (`u8("tengu_amber_sentinel", false)`) | chunks.101.mjs | function |
| `q11` | `isRemoteControlBridgeActive` | chunks.* (utility) | function |
| `n61` | `isUserActivelyPresent` (last-keystroke heuristic) | chunks.* (utility) | function |
| `AV` | `lastKeystrokeAt` (timestamp) | chunks.* (utility) | function |
| `vD6` | `getTerminalFocus` (terminal-focus-state read) | chunks.* (utility) | function |
| `agentPushNotifEnabled` | user config field for opt-in | chunks.64.mjs:2118 (in config schema), chunks.151.mjs (schema) | constant |
| `tengu_kairos_push_notifications` | feature flag | chunks.101.mjs:1250, chunks.152.mjs:2197 (string literal) | constant |
| `tengu_push_notification_send` | telemetry event | chunks.152.mjs:2249 (string literal) | constant |

## Module: Settings Schema (TUI-related fields)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `tui` | `tuiSetting` (enum `"default"\|"fullscreen"`) | chunks.19.mjs:547 | constant |
| `viewMode` | `viewModeSetting` (enum `"default"\|"verbose"\|"focus"`) | chunks.19.mjs:510 | constant |
| `autoScrollEnabled` | `autoScrollEnabled` (boolean, fullscreen-only) | chunks.151.mjs:2323-2327 | constant |
| `showThinkingSummaries` | `showThinkingSummariesSetting` (boolean, default false) | chunks.19.mjs:563 | constant |
| `prefersReducedMotion` | `prefersReducedMotionSetting` (a11y) | chunks.19.mjs:559 | constant |
| `briefTranscript` | persistent config field for focus state | chunks.64.mjs:2118 (in syncable list) | constant |
| `CLAUDE_CODE_TUI_JUST_SWITCHED` | internal relaunch marker env var | chunks.185.mjs:427 (string literal) | constant |
| `CLAUDE_CODE_NO_FLICKER` | operator-override env var | chunks.65.mjs:1492-1493 (string literal) | constant |
| `CLAUDE_CODE_DISABLE_MOUSE` | per-env-var mouse-disable | chunks.65.mjs:1514 (string literal) | constant |
| `CLAUDE_CODE_DISABLE_MOUSE_CLICKS` | per-env-var click-ignore | chunks.65.mjs (string literal) | constant |
| `CLAUDE_CODE_DISABLE_VIRTUAL_SCROLL` | disable virtualized scrollback | chunks.182.mjs:1425 (string literal) | constant |
| `CLAUDE_CODE_FORCE_FULLSCREEN_UPSELL` | internal force-show upsell | chunks.185.mjs:429 (string literal) | constant |

## Cross-File Helpers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `v7` | `getUserSettings` | chunks.* (utility) | function |
| `H8` | `getAppConfig` | chunks.* (utility) | function |
| `d8` | `updateAppConfig` (mutate-and-save user config) | chunks.* (utility) | function |
| `P7` | `saveSettings` | chunks.185.mjs:415 | function |
| `M8` | `useAppStateSelector` (Zustand-like read) | chunks.* (utility) | function |
| `R7` | `getAppStateSetter` (mutator) | chunks.205.mjs:440 | function |
| `H9` | `getTeammateRegistry` | chunks.* (utility) | function |
| `V3` | `getShortcutDisplay` | chunks.* (utility) | function |
| `G1` | `useKeybinding` (binds action + handler) | chunks.205.mjs:525 | function |
| `u8` | `getFeatureFlag` | chunks.* (utility) | function |
| `XD` | `getFeatureFlagWithCache` (TTL'd) | chunks.152.mjs:2197 | function |
| `d` | `logEvent` (telemetry dispatch) | chunks.* (utility) | function |
| `wV` | `getIsInteractive` | chunks.* (utility, alias of v2.1.88 `getIsInteractive`) | function |
| `c5` | `parseExplicitFalse` (env-var helper) | chunks.* (utility) | function |
| `S6` | `parseExplicitTrue` (env-var helper, alias of `isEnvTruthy`) | chunks.* (utility) | function |
| `E` | `logForDebugging` | chunks.* (utility) | function |

---

## Notes

### `lq` already in symbol_index.md

The canonical `symbol_index.md` already has `lq → isFullscreenMode` (chunks.65.mjs:1491-1505) and a handful of other TUI-renderer symbols. The entries above expand on that module with the v2.1.110 `/tui` command additions, v2.1.110 `/focus` additions, v2.1.111 transcript footer additions, and the v2.1.110 `PushNotification` tool.

### v2.1.88 baseline cross-check

The following v2.1.88 source files were inspected and confirm the symbol semantics:

- `/lyz/codespace/3rd/claude-code/src/utils/fullscreen.ts` — `isFullscreenEnvEnabled`, `isTmuxControlMode`, `probeTmuxControlModeSync`, `isMouseTrackingEnabled`, `maybeGetTmuxMouseHint` (all exist; `isFullscreenMode` in v2.1.112 adds the `tui` setting case + feature-gate fallback)
- `/lyz/codespace/3rd/claude-code/src/ink/components/AlternateScreen.tsx` — the React mount that writes DEC 1049 + mouse-tracking SGR codes
- `/lyz/codespace/3rd/claude-code/src/components/CtrlOToExpand.tsx` — `app:toggleTranscript` action handle for Ctrl+O (same in v2.1.112)
- `/lyz/codespace/3rd/claude-code/src/screens/REPL.tsx` — top-level fullscreen detection + handling
- `/lyz/codespace/3rd/claude-code/src/commands/` — **no `tui.ts` or `focus.ts` files** (commands added in v2.1.110)
- `/lyz/codespace/3rd/claude-code/src/tools.ts` — references `PushNotification` *name* as a stub but the full tool implementation is v2.1.110

### Telemetry events introduced in this window

| Event | Added | Triggers |
|-------|-------|----------|
| `tengu_tui_command` | v2.1.110 | `/tui` dispatched with valid mode |
| `tengu_fullscreen_upsell_shown` | v2.1.110 | Upsell banner displayed |
| `tengu_brief_mode_toggled` | v2.1.110 | `/focus` or `/brief` toggled |
| `tengu_push_notification_send` | v2.1.110 | Every `PushNotification` call |
| `tengu_toggle_transcript` | (existed) | Ctrl+O fired |
| `tengu_transcript_toggle_show_all` | (existed) | Ctrl+E fired |
| `tengu_transcript_exit` | (existed) | Transcript-exit fired |
