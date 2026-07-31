# Symbol index — Integration infrastructure (v2.1.220)

**Scope:** LSP, Chrome, IDE, UI components, plugins, code indexing, shell parser, slash commands.

All `File:Line` values are line numbers in the **2.1.220** bundle
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines, `build_sha 4073f595`). A line tagged `(193)` inside a description refers to
the 2.1.193 baseline and is never used as a `File:Line` value.

> ⚠ **Do not reconcile these symbols against a 2.1.193 index by name.** Identifiers are
> re-mangled between builds and ids are REUSED for unrelated declarations — the #1 analysis
> trap in this tree (`_CONVENTIONS.md` §4 trap 1). Confirmed collisions include `cOt`, `BEy`,
> `OKt`, `yBc` and `lor`. Each source `symbol_additions_*` file lists its own theme's collisions.

> ⚠ **155 obfuscated ids are named two different ways** across the four indexes, and 59 carry
> differing `File:Line` values. Before trusting a row here, check
> [`symbol_alias_conflicts.md`](symbol_alias_conflicts.md) — a mechanically generated register of
> every such disagreement. Same id, two names means at most one analyst was right.

> **Provenance.** Mechanically merged from the per-theme `symbol_additions_v2_1_220_*.md`
> files listed at the bottom, which remain the authoritative sources and additionally carry
> per-theme gate/env-var censuses and notes that are deliberately not duplicated here.
> Rows are deduplicated and sorted by the Obfuscated column within each module section.

---

## Module: Accessibility / Screen Reader

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _tu | getScreenReaderModeBanner | cli_inner_pretty.js:156224 | function |
| AJr | buildAccessibilityProps | cli_inner_pretty.js:253924 | function |
| Ast | getScreenReaderEnvForChildren | cli_inner_pretty.js:156246 | function |
| Cno | screenReaderDetector | cli_inner_pretty.js:156271 | variable |
| cVr | pushAnnouncement | cli_inner_pretty.js:156250 | function |
| d2 | renderMarkdownToken | cli_inner_pretty.js:635788 | function |
| Dho | sanitizeForScreenReader | cli_inner_pretty.js:257355 | function |
| Ea | useScreenReaderEnabled | cli_inner_pretty.js:260431 | function |
| eIg | AX_SCREEN_READER_GATE (`"tengu_ax_screen_reader"`) | cli_inner_pretty.js:156258 | constant |
| Etu | getStartupQuietRemainingMs | cli_inner_pretty.js:156237 | function |
| eut | MAX_TREE_DEPTH (256) | cli_inner_pretty.js:254907 | constant |
| h9e | EMPTY_PRESERVE_RANGES | cli_inner_pretty.js:257481 | constant |
| Hno | endStartupQuietWindow | cli_inner_pretty.js:156234 | function |
| htu | MAX_ANNOUNCEMENTS (16) | cli_inner_pretty.js:156265 | constant |
| jXs | announceDeletedText | cli_inner_pretty.js:559690 | function |
| kL | isScreenReaderMode | cli_inner_pretty.js:156221 | function |
| kV_ | setupTerminalApp | cli_inner_pretty.js:558487 | function |
| Laa | renderTableAsSentences | cli_inner_pretty.js:636191 | function |
| Lho | shiftPreserveRanges | cli_inner_pretty.js:257411 | function |
| LJr | renderNodeToScreenReaderOutput | cli_inner_pretty.js:257375 | function |
| nRt | announcementQueue | cli_inner_pretty.js:156266 | variable |
| Ouy | isGraphemeBoundary | cli_inner_pretty.js:257792 | function |
| rIg | MAX_QUIET_MS (600000) | cli_inner_pretty.js:156262 | constant |
| Stu | beginStartupQuietWindow | cli_inner_pretty.js:156231 | function |
| tIg | DEFAULT_QUIET_MS (3000) | cli_inner_pretty.js:156261 | constant |
| vtu | drainAnnouncements | cli_inner_pretty.js:156253 | function |
| wuy | flattenBoxChildren | cli_inner_pretty.js:257417 | function |
| Ysr | reportTreeDepthExceeded | cli_inner_pretty.js:254897 | function |
| ytu | ScreenReaderModeDetector | cli_inner_pretty.js:156198 | class |
| Yue | getPermissionModeIndicator | cli_inner_pretty.js:58478 | function |

## Module: Accessibility/UI — left-arrow guard (for cross-reference only)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Fyp | commitLeftArrowAction | cli_inner_pretty.js:559664-559683 | function |
| GV_ | ATTACH_CONFIRM_MIN_MS | cli_inner_pretty.js:559686 | constant |
| Nyp | resolveLeftArrowAction | cli_inner_pretty.js:559650-559662 | function |
| Oyp | LEFT_ARROW_ABSORB_MS | cli_inner_pretty.js:559685 | constant |
| UXs | LEFT_ARROW_FEEDBACK_MS | cli_inner_pretty.js:559684 | constant |

## Module: Artifacts — one symbol recorded here only to prevent a mis-attribution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `wbd` | `isFramePublishContextEnabled` (`tengu_frame_publish_context`) — **Artifact publishing, NOT Remote Control** | cli_inner_pretty.js:381715-381717 | function |

## Module: Auth — OAuth scope-downgrade retry (`.216` Chrome 403 loop)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aXi` | `isInvalidScopeError` | cli_inner_pretty.js:155362 | function |
| `fV` | `hasClaudeAiScopes` | cli_inner_pretty.js:155356 | function |
| `k$e` | `refreshOAuthToken` | cli_inner_pretty.js:155360 | function |
| `trt` | `CLAUDE_AI_OAUTH_SCOPES` | cli_inner_pretty.js:24671 | constant |

## Module: Chrome Bridge (transport)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `H3_` | `isValidChromePermissionMode` | cli_inner_pretty.js:537608 | function |
| `I3_` | `getBridgeWebSocketUrl` | cli_inner_pretty.js:537611 | function |
| `L3_` | `runClaudeInChromeMcpServer` | cli_inner_pretty.js:537708 | function |
| `R3_` | `isLocalBridge` | cli_inner_pretty.js:537616 | function |
| `Tcp` | `createChromeContext` | cli_inner_pretty.js:537619 | function |
| `y3_` | `TELEMETRY_EVENT_ALLOWLIST` | cli_inner_pretty.js:537275 | constant |

## Module: Chrome extension setup and native host

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$5u` | `resolveViaAppPaths` | cli_inner_pretty.js:267035 | function |
| `A_s` | `execFailureFields` | cli_inner_pretty.js:267214 | function |
| `Bmy` | `WINDOWS_APP_PATHS_KEY` | cli_inner_pretty.js:267104 | constant |
| `D9e` | `openInChrome` | cli_inner_pretty.js:267221 | function |
| `gjt` | `CHROME_EXTENSION_RECONNECT_URL` | cli_inner_pretty.js:663934 | constant |
| `Gmy` | `parseRegQueryDefaultValue` | cli_inner_pretty.js:267019 | function |
| `H_s` | `getAllSocketPaths` | cli_inner_pretty.js:267293 | function |
| `iDb` | `registerNativeHostInWindowsRegistry` | cli_inner_pretty.js:664093 | function |
| `j5u` | `claudeInChromeModule` | cli_inner_pretty.js:267114 | object |
| `MX` | `isChromeExtensionInstalled` | cli_inner_pretty.js:663927 | function |
| `N5u` | `spawnDetached` | cli_inner_pretty.js:267085 | function |
| `oDb` | `getAllNativeMessagingHostsDirs` (Windows arm) | cli_inner_pretty.js:664034 | function |
| `P5u` | `APP_PATHS_REG_TIMEOUT_MS` (1e4) | cli_inner_pretty.js:267105 | constant |
| `PQr` | `getSecureSocketPath` | cli_inner_pretty.js:267274 | function |
| `Qar` | `getSocketDir` | cli_inner_pretty.js:267271 | function |
| `U5u` | `getWindowsPipeName` | cli_inner_pretty.js:267308 | function |
| `Umy` | `APP_PATHS_STAT_TIMEOUT_MS` (5000) | cli_inner_pretty.js:267106 | constant |
| `Wmy` | `expandWindowsEnvPlaceholders` | cli_inner_pretty.js:267030 | function |
| `Wva` | `installChromeNativeHostManifest` | cli_inner_pretty.js:664042 | function |
| `Yva` | `claudeInChromeSetupModule` | cli_inner_pretty.js:663918 | object |
| `zmy` | `probeLegacyChromeSockets` | cli_inner_pretty.js:267278 | function |

## Module: Chrome file upload (`.211` hardening)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `a$_` | `prepareChromeFileUploadInput` | cli_inner_pretty.js:514094 | function |
| `Bvs` | `chromeFileUploadModule` | cli_inner_pretty.js:514070 | object |
| `Bxu` | `restoreAttachmentDisplayName` | cli_inner_pretty.js:217627 | function |
| `c$_` | `openAndSnapshotUploadFile` | cli_inner_pretty.js:514269 | function |
| `Cor` | `getSessionUploadsDir` | cli_inner_pretty.js:217615 | function |
| `d$_` | `mimeTypeForUploadPath` | cli_inner_pretty.js:514299 | function |
| `d2o` | `verifyHandleBinding` | cli_inner_pretty.js:514249 | function |
| `Fxu` | `isReservedAfterTrailingUnderscores` | cli_inner_pretty.js:217621 | function |
| `HKg` | `suffixIfWindowsUnsafeName` | cli_inner_pretty.js:217624 | function |
| `IKg` | `ATTACHMENT_DIGEST_LRU_MAX` (1024) | cli_inner_pretty.js:217645 | constant |
| `jQi` | `DOS_DEVICE_SUFFIX_RE` | cli_inner_pretty.js:162387 | constant |
| `jrp` | `prepareFileUploadPaths` | cli_inner_pretty.js:514130 | function |
| `jxu` | `lookupAttachmentDigest` | cli_inner_pretty.js:217640 | function |
| `l$_` | `validateUploadPath` | cli_inner_pretty.js:514159 | function |
| `Nxu` | `buildAttachmentStoredName` | cli_inner_pretty.js:217618 | function |
| `qrp` | `readBoundedToSnapshot` | cli_inner_pretty.js:514234 | function |
| `t8s` | `FILE_UPLOAD_MAX_TOTAL_BYTES` (10485760) | cli_inner_pretty.js:514308 | constant |
| `Tou` | `isWindowsReservedOrTrailingDotName` | cli_inner_pretty.js:162382 | function |
| `UQi` | `TRAILING_DOT_OR_SPACE_RE` | cli_inner_pretty.js:162387 | constant |
| `Urp` | `uploadDeniedMessage` | cli_inner_pretty.js:514127 | function |
| `Uxu` | `registerAttachmentDigest` | cli_inner_pretty.js:217632 | function |
| `Vrp` | `readlinkFailureVerdict` | cli_inner_pretty.js:514246 | function |
| `Wrp` | `uploadRootsForSession` | cli_inner_pretty.js:514079 | function |

## Module: Chrome install upsell (`.198` GA)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bge` | `chromeInstallUpsellLatch` | cli_inner_pretty.js:773899 | variable |
| `gD_` | `CHROME_SLASH_COMMAND` (`/chrome`) | cli_inner_pretty.js:501557 | object |
| `hqS` | `runChromeInstallUpsellDialog` | cli_inner_pretty.js:773937 | function |
| `ocl` | `offerChromeInstallOnce` | cli_inner_pretty.js:773920 | function |
| `VGS` | `trackChromeInstallUpsellShown` | cli_inner_pretty.js:768701 | function |
| `vnm` | `shouldOfferChromeInstall` | cli_inner_pretty.js:773897 | function |
| `Vsl` | `CHROME_UPSELL_SKIP_OPTION` | cli_inner_pretty.js:768699 | constant |

## Module: Chrome screenshot `save_to_disk` (`.211`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Fl` | `SCREENSHOT_MIME_TO_EXT` | cli_inner_pretty.js:43774 | object |
| `BFl` | `writeScreenshotsToDisk` | cli_inner_pretty.js:43697 | function |
| `eEh` | `screenshotCounter` | cli_inner_pretty.js:43768 | variable |
| `NFl` | `getOrCreateScreenshotTempDir` | cli_inner_pretty.js:43675 | function |
| `tEh` | `resolveScreenshotSaveDir` | cli_inner_pretty.js:43683 | function |
| `vjn` | `memoisedScreenshotTempDir` | cli_inner_pretty.js:43769 | variable |
| `ZSh` | `SCREENSHOT_SAVED_PREFIX` (`"Screenshot saved to: "`) | cli_inner_pretty.js:43767 | constant |

## Module: Emoji Completion

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| aLS | getEmoji | cli_inner_pretty.js:746056 | function |
| aQa | EMOJI_PREFIX_RE | cli_inner_pretty.js:747123 | constant |
| hLS | wasClosingColonJustTyped | cli_inner_pretty.js:746077 | function |
| iLS | MAX_EMOJI_SUGGESTIONS (20) | cli_inner_pretty.js:746071 | constant |
| lLS | getEmojiSuggestions | cli_inner_pretty.js:746059 | function |
| mLS | EMOJI_INLINE_RE | cli_inner_pretty.js:747124 | constant |
| NRn | emojiModule | cli_inner_pretty.js:747125 | variable |
| Oli | EMOJI_BY_SHORTCODE (1,567 entries) | cli_inner_pretty.js:744484 | object |
| sLS | SHORTCODE_KEYS | cli_inner_pretty.js:746075 | variable |
| sQa | SLACK_CHANNEL_RE | cli_inner_pretty.js:747122 | constant |
| w5f | emojiExports | cli_inner_pretty.js:746054 | object |

## Module: Environment / work bridge (`claude bridge`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aW_` | `summarizeToolInvocation` | cli_inner_pretty.js:545326 | function |
| `igt` | `getBridgePollIntervalConfig` | cli_inner_pretty.js:545275 | function |
| `lW_` | `parseBridgeActivityLine` | cli_inner_pretty.js:545332 | function |
| `nW_` | `bridgePollConfigSchema` | cli_inner_pretty.js:545286 | object |
| `sfp` | `POLL_INTERVAL_REFINE_MESSAGE` | cli_inner_pretty.js:545285 | constant |
| `t7e` | `assertBridgeApiStatus` | cli_inner_pretty.js:541809 | function |
| `X4o` | `sanitizeSessionIdForFilename` | cli_inner_pretty.js:545323 | function |
| `Ybr` | `BRIDGE_POLL_DEFAULTS` | cli_inner_pretty.js:545264 | object |

## Module: Host surfaces (Desktop, Cowork, reserved MCP names)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AEy` | `BROWSER_CONTROL_SERVER_NAMES` | cli_inner_pretty.js:289043 | constant |
| `fkg` | `CLAUDE_BROWSER_SERVER_NAME` | cli_inner_pretty.js:151629 | constant |
| `gkg` | `NORMALISED_RESERVED_SERVER_NAMES` | cli_inner_pretty.js:151634 | constant |
| `Hxm` | `hasStoppableRunningTasks` | cli_inner_pretty.js:843370 | function |
| `Ixm` | `shouldReportSessionRunning` | cli_inner_pretty.js:843373 | function |
| `K9u` | `RESERVED_DESKTOP_PANE_NAMES` | cli_inner_pretty.js:289042 | constant |
| `pkg` | `CLAUDE_PREVIEW_SERVER_NAME` | cli_inner_pretty.js:151628 | constant |
| `Qhr` | `isDesktopHandoffAvailable` | cli_inner_pretty.js:449721 | function |
| `Rxm` | `shouldReportRunningForBgTasks` | cli_inner_pretty.js:843383 | function |
| `wl_` | `DESKTOP_SLASH_COMMAND` (`/desktop`) | cli_inner_pretty.js:449727 | object |

## Module: Integrations — GitHub PR status for agent rows

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_Iy` | `resolvePrStatusViaGhCli` (`gh pr view --json …`) | cli_inner_pretty.js:316063-316078 | function |
| `AIy` | `resolvePrStatusDirect` (ETag cache, same-origin manual redirects) | cli_inner_pretty.js:316083-316164 | function |
| `Btd` | `reportPrAuthState` (edge-triggered `tengu_gh_pr_status_auth_state`) | cli_inner_pretty.js:316079-316082 | function |
| `Ktd` | `resolvePrStatusForBranch` (gate picks REST vs `gh`) | cli_inner_pretty.js:316054-316059 | function |
| `mur` | `prAuthHintText` (`gh auth login for PR status`) | cli_inner_pretty.js:316035-316042 | function |
| `rvo` | `prHealth` (`merged`/`inactive`/`error`/`warning`/…) | cli_inner_pretty.js:316241-316248 | function |

## Module: LSP — open-document lifecycle

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `SQu` | `createLspServerManager` (returns 11 methods at :307337; 193's `closeFile` / `getSupportedExtensions` are gone) | cli_inner_pretty.js:307167 | function |
| `zCy` | `LSP_MAX_OPEN_DOCUMENTS` (`50`) | cli_inner_pretty.js:307353 | constant |

## Module: Plugins

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `"maxLifetimeShows"` | per-tip lifetime impression cap (filter at `:814944`) | cli_inner_pretty.js:815597 | constant |
| `"pluginUsageLspGraceAppliedIds"` | one-shot LSP grace ledger key | cli_inner_pretty.js:214905 | constant |
| `"tengu_cobalt_plinth_dataviz"` | gates the dataviz callout injected into `artifact-design` | cli_inner_pretty.js:772274 | constant |
| `_Cu` | computePluginDisuse | cli_inner_pretty.js:215055 | function |
| `_Qu` | createLspClient (built **before** the extension claim in 220) | cli_inner_pretty.js:307210 (call site) | function |
| `a5g` | PLUGIN_CONFIG_SCOPES (`user`/`flag`/`policy`) | cli_inner_pretty.js:191083 | constant |
| `Abd` | isArtifactSharedScopeListingDisabled (`tengu_cobalt_plinth_osier`, default `!1`, **NEW**) | cli_inner_pretty.js:381697 | function |
| `aCy` | resolvePluginLspServerConfig | cli_inner_pretty.js:303710 | function |
| `C5y` | isArtifactPutGuardEnabled (`tengu_cobalt_plinth_putguard`, default `!0`, carryover) | cli_inner_pretty.js:381712 | function |
| `C8` | FILE_SETTING_SCOPES (`user`/`project`/`local`) | cli_inner_pretty.js:57679 | 38_permissions |
| `cPs` | isArtifactPublicReadEnabled (`tengu_cobalt_plinth_sedge`, default `!1`, **NEW**) | cli_inner_pretty.js:381703 | function |
| `csn` | isArtifactToolEnabled (`tengu_cobalt_plinth_fern`, default `!0`, carryover) | cli_inner_pretty.js:381688 | function |
| `cxo` | isArtifactMultiFilePublishEnabled (`tengu_cobalt_plinth_bracken`, default `!1`, **NEW**) | cli_inner_pretty.js:381700 | function |
| `dsn` | isSlateLanternEnabled (`tengu_slate_lantern`) | cli_inner_pretty.js:381709 | function |
| `Eke` | pluginOptionsStorageKey | cli_inner_pretty.js:214313 | function |
| `eo` | readEffectiveSettings (193 called this `Lr`, `:58428 (193)`) | cli_inner_pretty.js:63161 | 38_permissions |
| `Fbs` | renameReplacingLockedTarget | cli_inner_pretty.js:278485 | function |
| `fyy` | pickExistingPluginInstallRecord | cli_inner_pretty.js:279585 | function |
| `g7` | expandEnvVarReferences | cli_inner_pretty.js:267981 | function |
| `Ggy` | syncInstalledPluginsFromSettings | cli_inner_pretty.js:277771 | function |
| `H3r` | AUTO_MODE_TRUSTED_SCOPES (same 3-element literal) | cli_inner_pretty.js:63681 | 38_permissions |
| `hCu` | applyLspDisuseGraceOnce | cli_inner_pretty.js:214904 | function |
| `hee` | getMaxSubagentSpawnDepth | cli_inner_pretty.js:230896 | 53_subagent_limits |
| `hEe` | isLocalSettingsRepoTracked (`{onIndeterminate}`) | cli_inner_pretty.js:535971 | function |
| `jue` | RENAME_RETRY_CODES (`EXDEV`/`EPERM`/`EEXIST`/`EBUSY`) — carryover, `SBe :46613 (193)` | cli_inner_pretty.js:49993 | constant |
| `Jue` | pluginIdSchema | cli_inner_pretty.js:59999 | object |
| `KXu` | getAllLspServers | cli_inner_pretty.js:303787 | function |
| `lCy` | namespacePluginLspServers | cli_inner_pretty.js:303757 | function |
| `LE` | isBackgroundTasksDisabled (`CLAUDE_CODE_DISABLE_BACKGROUND_TASKS`) | cli_inner_pretty.js:230330 | 36_background_agents |
| `lor` | referencesUserConfig — **193's `lor` is unrelated** | cli_inner_pretty.js:214417 | function |
| `lPs` | isArtifactLangParamEnabled (`tengu_cobalt_plinth_laurel`, default `!1`, **NEW**) | cli_inner_pretty.js:381694 | function |
| `Lr` (class) | ClaudeError | cli_inner_pretty.js:19800 | 57_api_reliability |
| `mCu` | touchPluginUsage | cli_inner_pretty.js:214890 | function |
| `muo` | substituteUserConfigForSkillContent (carryover, `nOn :279580 (193)`) | cli_inner_pretty.js:214424 | function |
| `n_o` | findInstalledPluginDir | cli_inner_pretty.js:279599 | function |
| `nUS` | resolvePluginMonitor | cli_inner_pretty.js:764143 | function |
| `NW` | readPluginOptions (memoised) | cli_inner_pretty.js:214446 | variable |
| `nyy` | placePluginBinaryAsset | cli_inner_pretty.js:278435 | function |
| `o_o` | findInstalledPluginDirUnknownVersion | cli_inner_pretty.js:279608 | function |
| `oUS` | resolveAllPluginMonitors | cli_inner_pretty.js:764163 | function |
| `Pr` | readSettingsScope | cli_inner_pretty.js:63153 | 38_permissions |
| `PSo` | collectLspExtensionConflicts | cli_inner_pretty.js:303731 | function |
| `q2o` | buildAndRunHookCommand (the `.207` refusal at `:519965`) | cli_inner_pretty.js:519921 | function |
| `rSe` | describeHookCommandForError | cli_inner_pretty.js:215859 | function |
| `sDt` | substituteUserConfig (carryover, `ibe :279570 (193)`) | cli_inner_pretty.js:214407 | function |
| `T5y` | isArtifactReaderPersistEnabled (`tengu_cobalt_plinth_reader_persist`, carryover) | cli_inner_pretty.js:381706 | function |
| `TYr` | computeDisuseAges | cli_inner_pretty.js:214921 | function |
| `usn` | isSaffronAnchorEnabled (`tengu_saffron_anchor`) | cli_inner_pretty.js:381692 | function |
| `V$` | SETTING_SCOPES (5-element ordered list) | cli_inner_pretty.js:57678 | 38_permissions |
| `wbd` | isFramePublishContextEnabled (`tengu_frame_publish_context`) | cli_inner_pretty.js:381715 | function |
| `WCr` | readTipLifetimeShownCount | cli_inner_pretty.js:675592 | function |
| `wT` | getAllowedSettingSources | cli_inner_pretty.js:57664 | 38_permissions |
| `Xbe` | substitutePluginPathVars | cli_inner_pretty.js:214398 | function |
| `yaf` | readPluginSuggestionShownCount | cli_inner_pretty.js:675595 | function |
| `YI` | isPluginDisabledByPolicy | cli_inner_pretty.js:237995 | function |
| `yn` | isNonInteractiveSession | cli_inner_pretty.js:3286 | 51_headless_sdk |
| `Yzr` | readTrustedPluginConfig | cli_inner_pretty.js:191064 | function |
| `zXu` | loadPluginLspServers | cli_inner_pretty.js:303765 | function |

## Module: Prompt Input and Vim Mode

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _ba | NON_TEXT_KEY_NAMES | cli_inner_pretty.js:657435 | constant |
| b5 (inside prompt) | helpShortcutInputFilter | cli_inner_pretty.js:754123 | function |
| bba | isChangeLikeRecord | cli_inner_pretty.js:656872 | function |
| C (inside Sba) | recordPendingRemapChar | cli_inner_pretty.js:656913 | function |
| D (inside KGf) | runHistorySearchScan | cli_inner_pretty.js:743417 | function |
| dba | getVimInsertModeRemaps | cli_inner_pretty.js:656561 | function |
| ERt | firstGrapheme | cli_inner_pretty.js:160210 | function |
| f5e (inside prompt) | handleSingleCharKey | cli_inner_pretty.js:754023 | function |
| F7p | REMAP_TIMEOUT_MS (1000) | cli_inner_pretty.js:656564 | constant |
| Fyp | applyLeftArrowTransition | cli_inner_pretty.js:559664 | function |
| gba | dispatchVimNormalCommand | cli_inner_pretty.js:656594 | function |
| gPo | expandLatestPastePlaceholder | cli_inner_pretty.js:454789 | function |
| GV_ | MIN_CONFIRM_GAP_MS (150) | cli_inner_pretty.js:559686 | constant |
| H (inside Sba) | exitInsertMode | cli_inner_pretty.js:656935 | function |
| IUs | openHistoryStream | cli_inner_pretty.js:454804 | function |
| JLr | acceptSuggestionForPattern | cli_inner_pretty.js:746119 | function |
| kDt | PASTE_COLLAPSE_THRESHOLD (800) | cli_inner_pretty.js:223060 | constant |
| lkb | VISUAL_COMMANDS | cli_inner_pretty.js:656838 | object |
| M (inside KGf) | cancelHistorySearchScan | cli_inner_pretty.js:743411 | function |
| Nyp | classifyLeftArrowPress | cli_inner_pretty.js:559650 | function |
| Oyp | REPEAT_WINDOW_MS (1000) | cli_inner_pretty.js:559685 | constant |
| Pay | decodeCsiUToPasteText | cli_inner_pretty.js:242971 | function |
| Sba | useVimInput | cli_inner_pretty.js:656887 | function |
| SFu | csiUSequenceToByte | cli_inner_pretty.js:242961 | function |
| tjt | applyLinewiseOperator | cli_inner_pretty.js:655902 | function |
| ugr | PASTE_REEXPAND_MAX_BYTES (1e5) | cli_inner_pretty.js:455019 | constant |
| uve | expandAllPastePlaceholders | cli_inner_pretty.js:454778 | function |
| UXs | ARM_TTL_MS (3000) | cli_inner_pretty.js:559684 | constant |
| Vde | countGraphemes | cli_inner_pretty.js:160220 | function |
| W7p | resolveNormalModeKey | cli_inner_pretty.js:656620 | function |
| wfs | decodeModifierBitmask | cli_inner_pretty.js:242883 | function |
| Wzo | substituteChars (vim `s`) | cli_inner_pretty.js:655968 | function |
| Xxb | NORMAL_COMMANDS | cli_inner_pretty.js:656801 | object |
| xZ | lastGrapheme | cli_inner_pretty.js:160214 | function |
| yPo | historyEntryGenerator | cli_inner_pretty.js:454804 | function |
| yx | useTextInput | cli_inner_pretty.js:657471 | function |
| Yxb | parseVimInsertModeRemaps | cli_inner_pretty.js:656551 | function |
| zN | findPastePlaceholders | cli_inner_pretty.js:454766 | function |

## Module: REPL bridge / remote code sessions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aHs` | `buildGitSessionContext` | cli_inner_pretty.js:333660 | function |
| `cHs` | `reportGitSessionContext` | cli_inner_pretty.js:333699 | function |
| `Ckd` | `shouldSweepBridgePlaceholders` | cli_inner_pretty.js:415181 | function |
| `eCb` | `REMOTE_READ_DEFAULT_BYTES` (1e6) | cli_inner_pretty.js:652757 | constant |
| `K1t` | `isCreateSessionFailure` | cli_inner_pretty.js:333737 | function |
| `kIo` | `PendingPlaceholderQueue` | cli_inner_pretty.js:415150 | class |
| `Kwo` | `createCodeSession` | cli_inner_pretty.js:333753 | function |
| `lHs` | `gitSessionContextModule` | cli_inner_pretty.js:333658 | object |
| `Ovn` | `readFileForRemote` | cli_inner_pretty.js:652721 | function |
| `PKp` | `remoteFileReadModule` | cli_inner_pretty.js:652719 | object |
| `rcd` | `isGroupingRejection` | cli_inner_pretty.js:333740 | function |
| `szo` | `REMOTE_READ_MAX_BYTES` (1e7) | cli_inner_pretty.js:652758 | constant |
| `wkd` | `stripSessionIdPrefix` | cli_inner_pretty.js:415178 | function |
| `Y1t` | `isCredentialsFailure` | cli_inner_pretty.js:333801 | function |

## Module: Remote Control — Client surfaces (`useRemoteSession`, bootstrap checklist, model picker)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$$S` | `BOOTSTRAP_SESSION_START_SLACK_MS` (5000) | cli_inner_pretty.js:755413 | constant |
| `cqt` | `replyChannelAdapter` — **(dead)** module-level `null` sentinel; darkens the whole reply channel | cli_inner_pretty.js:757708 | variable |
| `edm` | `emitBackgroundResultSeen` (agent-view latency probe, NOT a Working/Idle flap fix) | cli_inner_pretty.js:802458-802475 | function |
| `F$S` | `applyBootstrapStepTransition` (started/completed/failed/skipped table) | cli_inner_pretty.js:755331-755365 | function |
| `hkf` | `remoteModelPickerLoader` (`list_models` control request; `tengu_remote_model_picker`) | cli_inner_pretty.js:715334 | function |
| `K9f` | `MAX_BOOTSTRAP_STEPS` (32) | cli_inner_pretty.js:755409 | constant |
| `M$S` | `DEFAULT_BOOTSTRAP_STEPS` (`["provision","clone","setup_script","start_cc"]`) | cli_inner_pretty.js:755416 | constant |
| `N$S` | `isLiveBootstrapFrame` (±60 s of now **and** ≥ sessionStart − 5 s) | cli_inner_pretty.js:755274-755279 | function |
| `O$S` | `BOOTSTRAP_LIVE_WINDOW_MS` (60000) | cli_inner_pretty.js:755412 | constant |
| `P$S` | `BOOTSTRAP_STALE_CUTOFF_MS` (300000) | cli_inner_pretty.js:755410 | constant |
| `pui` | `seedRemoteBootstrapState` | cli_inner_pretty.js:755280-755292 | function |
| `Wr` | `markReplyChannelActive` — **(dead)**, all three call sites are behind `cqt !== null` | cli_inner_pretty.js:757201-757210 | function |
| `X9f` | `foldRemoteBootstrapFrame` (session_mode, expected_steps replacement, detail attach) | cli_inner_pretty.js:755293-755330 | function |
| `Y9f` | `isStaleBootstrapFrame` (>5 min old) | cli_inner_pretty.js:755268-755273 | function |
| `yrl` | `finalizeBootstrapChecklist` (`start_cc` completed ⇒ sweep pending→skipped) | cli_inner_pretty.js:755366 | function |
| `z9f` | `sanitizeStepLabel` (strip CR/LF, 512-char cap) | cli_inner_pretty.js:755261-755267 | function |

## Module: Remote Control — Nudges and upsells (growth surface, NOT correctness)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_5a` | `recordRemoteControlPermissionNudgeShown` | cli_inner_pretty.js:720540-720543 | function |
| `_Lf` | `resolveRemoteControlLongTurnNudgeConfig` (90 s default, 5…3600 clamp, 07:00–21:00 window) | cli_inner_pretty.js:720442-720468 | function |
| `ALf` | `canShowRemoteControlLongTurnNudge` | cli_inner_pretty.js:720515-720523 | function |
| `bLf` | `isWithinNudgeDayWindow` | cli_inner_pretty.js:720469-720473 | function |
| `CLf` | `canShowRemoteControlReadyPush` (**the `.214` explicit-enable guard**) | cli_inner_pretty.js:720555-720565 | function |
| `ELf` | `recordRemoteControlUpsellShown` | cli_inner_pretty.js:720500-720502 | function |
| `f5a` | `resolveRemoteControlPermissionNudgeConfig` (upsell, NOT an ordering fix) | cli_inner_pretty.js:720478-720494 | function |
| `m5a` | `shouldShowRemoteControlUpsell` | cli_inner_pretty.js:720495-720499 | function |
| `SLf` | `bumpGlobalCounter` (monotonic, never decreases) | cli_inner_pretty.js:720474-720477 | function |
| `TLf` | `resolveRemoteControlReadyPushConfig` (`tengu_kairos_ready_nudge`) | cli_inner_pretty.js:720544-720554 | function |
| `umS` | `hasEverUsedRemoteControl` | cli_inner_pretty.js:720503-720505 | function |
| `wLf` | `recordRemoteControlLongTurnNudgeShown` | cli_inner_pretty.js:720524-720535 | function |
| `xLf` | `recordRemoteControlReadyPushShown` | cli_inner_pretty.js:720566 | function |
| `y5a` | `canShowRemoteControlPermissionNudge` | cli_inner_pretty.js:720536-720539 | function |

## Module: Remote Control — Session state & wire schemas

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bkd` | `respondToBridgeControlRequest` (bridge control-request responder) | cli_inner_pretty.js:414723 | function |
| `Bkm` | `isStaleArchivedEndSession` (`epoch>1 && reason==="archived"`) — carryover | cli_inner_pretty.js:844945-844947 | function |
| `cln` | `buildSessionUrl` (`${base}/v1/code/sessions/${id}`) | cli_inner_pretty.js:416746-416748 | function |
| `F7y` | `stripStreamSuffixFromUrl` | cli_inner_pretty.js:416378-416382 | function |
| `H7y` | `foldBlockedPostTurnSummaryToNeedInput` | cli_inner_pretty.js:416204-416208 | function |
| `I7y` | `hasStatusCategory` | cli_inner_pretty.js:416209-416211 | function |
| `jkd` | `parseWorkSecret` (base64url, `version: 1`, `session_ingress_token`) | cli_inner_pretty.js:416727-416739 | function |
| `LIo` | `sessionIdSuffixMatches` (last `_`-segment, ≥4 chars) | cli_inner_pretty.js:416740-416745 | function |
| `mdE` | `BackgroundTasksChangedSchema` (REPLACE-semantics level event) | cli_inner_pretty.js:837667-837683 | function |
| `Ukm` | `isRespawnedWorker` (`epoch > 1`) | cli_inner_pretty.js:844948-844950 | function |

## Module: Remote Control — Slash command & CLI entrypoint

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `FBt` | `BRIDGE_LOGIN_HINT` (`"/login"`) | cli_inner_pretty.js:498071 | constant |
| `i_r` | `BRIDGE_LOGIN_ERROR` (used by the `claude rc` entrypoint at `:546777`) | cli_inner_pretty.js:498069 | constant |
| `iP_` | `REMOTE_CONTROL_COMMAND` (`name: "remote-control"`, `aliases: ["rc"]`) | cli_inner_pretty.js:503373-503388 | object |
| `NBt` | `BRIDGE_LOGIN_INSTRUCTION` | cli_inner_pretty.js:498066-498067 | constant |
| `oP_` | `isRemoteControlCommandEnabled` (**the `.206` logged-out carve-out**) | cli_inner_pretty.js:503352-503366 | function |
| `xve` | `REMOTE_CONTROL_DISCONNECTED_MSG` | cli_inner_pretty.js:498070 | constant |

## Module: Remote Control — Transport (CCRClient + SSE)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$7y` | `SSE_POST_BACKOFF_CAP_MS` (8000) | cli_inner_pretty.js:416389 | constant |
| `$kd` | `errorNameOf` (error → code/name) | cli_inner_pretty.js:415569-415574 | function |
| `A$s` | `classifyTaskStatusBatch` (edge-vs-level metric attribution) | cli_inner_pretty.js:415578-415585 | function |
| `A7y` | `MAX_SERVER_HEARTBEAT_MS` (300000) | cli_inner_pretty.js:416215 | constant |
| `aln` | `SSE_POST_RETRY_ATTEMPTS` (10) | cli_inner_pretty.js:416387 | constant |
| `D7y` | `SSE_RECONNECT_BASE_MS` (1000) | cli_inner_pretty.js:416383 | constant |
| `E7y` | `DEFAULT_HEARTBEAT_INTERVAL_MS` (20000) | cli_inner_pretty.js:416213 | constant |
| `iln` | `CCRClient` (worker-side Remote Control client) | cli_inner_pretty.js:415586 | class |
| `iln.closeExceptInternalEvents` | phase-1 shutdown (keeps the internal-event queue alive) | cli_inner_pretty.js:416184-416192 | function |
| `iln.handleEpochMismatch` | 409 → diagnostic → `onEpochMismatch()` (default `process.exit(1)`) | cli_inner_pretty.js:415932-415939 | function |
| `iln.initialize` | reads `CLAUDE_CODE_WORKER_EPOCH`, registers, starts the heartbeat | cli_inner_pretty.js:415751-415817 | function |
| `iln.paginatedGet` | cursor pagination with `after_event_id` anchor fallback | cli_inner_pretty.js:416055-416109 | function |
| `iln.registerShutdownCleanup` | phase-2 pre-exit flush, 3 s budget | cli_inner_pretty.js:416193-416202 | function |
| `iln.request` | shared request path; `{ timeout, parseBody }` options | cli_inner_pretty.js:415828 | function |
| `iln.sendHeartbeat` | closed-guard + server-driven interval adoption | cli_inner_pretty.js:415955-415981 | function |
| `iln.startHeartbeat` | refuses to arm on a closed client | cli_inner_pretty.js:415940-415951 | function |
| `k7y` | `PRE_EXIT_INTERNAL_FLUSH_MS` (3000) | cli_inner_pretty.js:416223 | constant |
| `Lkd` | `REMOTE_CONTROL_SESSION_CONFIG_DEFAULTS` (14 fields) | cli_inner_pretty.js:415327-415342 | object |
| `lln` | `SSETransport` (inbound frame stream) | cli_inner_pretty.js:416401 | class |
| `lln.handleConnectionError` | header-refreshing exponential reconnect | cli_inner_pretty.js:416610-416631 | function |
| `lln.handleSSEFrame` | envelope-vs-payload vetting + veto | cli_inner_pretty.js:416571-416609 | function |
| `lln.onLivenessTimeout` | 45 s silence watchdog | cli_inner_pretty.js:416632-416640 | function |
| `M7y` | `SSE_PERMANENT_STATUSES` (`new Set([401,403,404])`) | cli_inner_pretty.js:416400 | constant |
| `Nkd` | `isRetriableWorkerRegisterFailure` | cli_inner_pretty.js:415575-415577 | function |
| `O7y` | `SSE_POST_BACKOFF_BASE_MS` (500) | cli_inner_pretty.js:416388 | constant |
| `Okd` | `MAX_EPHEMERAL_STREAM_EVENT_BYTES` (61440) | cli_inner_pretty.js:416217 | constant |
| `oln` | `EventUploadQueue` (batching queue, backpressure, drop breaker) | cli_inner_pretty.js:415372 | class |
| `P7y` | `SSE_RECONNECT_CAP_MS` (30000) | cli_inner_pretty.js:416384 | constant |
| `rmt` | `RemoteControlClientError` (`reason`, `httpStatus`) | cli_inner_pretty.js:416219 | class |
| `S7y` | `REMOTE_CONTROL_SESSION_CONFIG_SCHEMA` (clamping zod) | cli_inner_pretty.js:415343-415368 | function |
| `tmt` | `isPermanentClientStatus` (400/413/422) | cli_inner_pretty.js:415566-415568 | function |
| `Ukd` | `SSE_LIVENESS_TIMEOUT_MS` (45000) | cli_inner_pretty.js:416385 | constant |
| `v$s` | `MAX_PRESERVED_EVENT_IDS` (1536) | cli_inner_pretty.js:416218 | constant |
| `v7y` | `MIN_SERVER_HEARTBEAT_MS` (10000) | cli_inner_pretty.js:416214 | constant |
| `w7y` | `STREAM_EVENT_COALESCE_MS` (100) | cli_inner_pretty.js:416216 | constant |
| `x7y` | `WORKER_STATE_PREFETCH_BUDGET_MS` (10000) | cli_inner_pretty.js:416222 | constant |

## Module: Remote Control — agent-fan publishing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bHs | agentFanStore | cli_inner_pretty.js:334800 | variable |
| Bpt | hashFanItems | cli_inner_pretty.js:334776-334784 | function |
| Fpt | budgetBucket | cli_inner_pretty.js:334772-334775 | function |
| hon | agentFanSnapshot | cli_inner_pretty.js:334797, :334800 | variable |
| lol | buildAgentFanItems | cli_inner_pretty.js:764295-… | function |
| Mcd | subscribeBridgePublishers | cli_inner_pretty.js:335449-335488 | function |
| mol | AgentFanPublisherEffect | cli_inner_pretty.js:764424-764460 | function |
| Mx | isReplBridgeActive | cli_inner_pretty.js:3969-3971 | function |
| Ocd | publishAgentFan | cli_inner_pretty.js:335489-335505 | function |
| SHs | setAgentFanSnapshot | cli_inner_pretty.js:334788-334793 | function |
| spr | getAgentFanSnapshot | cli_inner_pretty.js:334794-334796 | function |
| yn | isNonInteractive | cli_inner_pretty.js:3286-3288 | function |
| Z1t | getInFlightSummary | cli_inner_pretty.js:334785-334787 | function |

## Module: Remote control — bridge retryable codes

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_W_` | `BRIDGE_RETRYABLE_CODES` (8 codes; was 5 in 193) | cli_inner_pretty.js:547506 | constant |
| `Y2t` | `BridgeHeadlessPermanentError` | cli_inner_pretty.js:547517 | class |

## Module: SDK `set_cwd` control request (IDE / Desktop hosts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aef` | `safeWireMessage` | cli_inner_pretty.js:663601 | function |
| `eYo` | `validateCdTarget` | cli_inner_pretty.js:663504 | function |
| `kxm` | `isSessionBusyForCwdChange` | cli_inner_pretty.js:843367 | function |
| `QKo` | `INVISIBLE_CHARS_RE` | cli_inner_pretty.js:663724 | constant |
| `qLb` | `handleSetCwdControlRequest` | cli_inner_pretty.js:663604 | function |
| `Rva` | `setCwdControlModule` | cli_inner_pretty.js:663496 | object |

## Module: Slash Commands — `/doctor`, `claude doctor`, `/status`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bV | areBundledSkillsDisabled | cli_inner_pretty.js:162055-162057 | function |
| ctf | statusFourthWarningSection | cli_inner_pretty.js:666494 (call site) | function |
| Doo | isDisabledBundledPromptCommand | cli_inner_pretty.js:162058-162060 | function |
| dtf | statusInstallCheckSection | cli_inner_pretty.js:666062-666064 | function |
| e7e | checkInstall | cli_inner_pretty.js:541048-541138 | function |
| ftf | statusDiagnosticsSection | cli_inner_pretty.js:666101-666122 | function |
| gBb | emptyWarningList | cli_inner_pretty.js:672963-672965 | function |
| gVS | buildDoctorPrompt | cli_inner_pretty.js:785698-785853 | function |
| hBb | statusWarningsOrEmpty | cli_inner_pretty.js:672966-672968 | function |
| Hbr | isNativeInstallerSymlink | cli_inner_pretty.js:539603-539612 | function |
| Hue | isEISDIR | cli_inner_pretty.js:19649-19651 | function |
| Ibr | isNpmShim | cli_inner_pretty.js:539613-539616 | function |
| isb | formatLastUpdateResult | cli_inner_pretty.js:585349 | function |
| JVm | MISSING_OR_UNREADABLE_CODES | cli_inner_pretty.js:19809 | constant |
| kmn | readShellConfigLines | cli_inner_pretty.js:538784-538793 | function |
| Kzs | scanShellConfigsForClaudeAlias | cli_inner_pretty.js:538807-538823 | function |
| LAa | statusWarnings | cli_inner_pretty.js:666493-666495 | function |
| Lbr | getInstallationDiagnostics | cli_inner_pretty.js:539994-540070+ | function |
| mj_ | VERSIONS_DIR_SEGMENT | cli_inner_pretty.js:539621 | constant |
| N2t | getHomebrewCaskName | cli_inner_pretty.js:539643-539645 | function |
| oZS | reportInstallCheckResults | cli_inner_pretty.js:815895-815902 | function |
| ptf | statusProcessWrapperSection | cli_inner_pretty.js:666065-666100 | function |
| Rbr | isHomebrewCaskInstall | cli_inner_pretty.js:539636-539642 | function |
| ti | isMissingOrUnreadablePath | cli_inner_pretty.js:19686-19689 | function |
| Tim | registerDoctorCommand | cli_inner_pretty.js:785855-785880 | function |
| tj_ | TRANSIENT_FS_ERROR_CODES | cli_inner_pretty.js:538845-538855 | constant |
| tq | sanitizeDiagnosticValue | cli_inner_pretty.js:585346-585348 | function |
| ufl | useStartupInstallCheck | cli_inner_pretty.js:815903-815931 | function |
| Uht | getShellConfigPaths | cli_inner_pretty.js:538751-538767 | function |
| vj_ | linuxGlobPatternWarnings | cli_inner_pretty.js:539979-539993 | function |
| Zcp | resolveClaudeAliasTarget | cli_inner_pretty.js:538824-538834 | function |

## Module: Slash Commands — `/fork` and `/subtask`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `A_f` | `forkCommandModule` (the `{ call: () => forkCommandCall }` export) | cli_inner_pretty.js:695432 | variable |
| `KYb` | `forkCommandCall` (five-guard refusal ladder) | cli_inner_pretty.js:695530-695550 | function |
| `Lpn` | `spawnForkSubagent` (2.1.193's `/fork` spawner, now `/subtask`'s) | cli_inner_pretty.js:500337 | function |
| `mJd` | `FORK_COMMAND_DESCRIPTOR` (`argumentHint: "[prompt]"`) | cli_inner_pretty.js:500537-500543 | object |
| `NL_` | `subtaskCommandCall` (byte-equivalent to 193's `/fork` handler) | cli_inner_pretty.js:500547-500562 | function |
| `v_f` | `ForkProgressComponent` (runs the spawn once, prints the line) | cli_inner_pretty.js:695448 | function |

## Module: Slash Commands — `/fork`, `/subtask`, `/branch`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $L_ | legacyForkCommandCall | cli_inner_pretty.js:500500-500515 | function |
| _Jd | subtaskCommandDescriptor | cli_inner_pretty.js:500572-500579 | object |
| A_f | forkCommandModule | cli_inner_pretty.js:695431-695432 | object |
| D0h | COMMAND_NAME_TAG_RE | cli_inner_pretty.js:49441 | constant |
| lJd | deriveSubtaskAgentName | cli_inner_pretty.js:500461-500474 | function |
| Lpn | spawnForkFromDirective | cli_inner_pretty.js:500337-500446 | function |
| mJd | forkCommandDescriptor | cli_inner_pretty.js:500537-500543 | object |
| ML_ | branchCommandDescriptor | cli_inner_pretty.js:500327-500332 | object |
| nJd | deriveBranchNameFromMessages | cli_inner_pretty.js:500107-500112 | function |
| NL_ | subtaskCommandCall | cli_inner_pretty.js:500547-500562 | function |
| OL_ | rebuildRenderedSystemPrompt | cli_inner_pretty.js:500447-500460 | function |
| oxt | extractPromptFromMessage | cli_inner_pretty.js:49401-49436 | function |
| pJd | forkCommandLegacyDescriptor | cli_inner_pretty.js:500525-500532 | object |
| xLi | SYNTHETIC_PROMPT_PREFIX_RE | cli_inner_pretty.js:49440 | constant |

## Module: Slash Commands — registry and dispatch

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _pt | isImmediateCommand | cli_inner_pretty.js:326550-326553 | function |
| bpt | suggestNearestCommandName | cli_inner_pretty.js:326568-326582 | function |
| Cv | resolveCommandByName | cli_inner_pretty.js:346396-346405 | function |
| Edr | inputLooksLikeSlashCommand | cli_inner_pretty.js:326539-326546 | function |
| GBo | loadAllSlashCommands (merges workflow commands in) | cli_inner_pretty.js:507314-507328 | variable |
| H_r | builtinSlashCommandRegistry | cli_inner_pretty.js:507179 | variable |
| Ic | resolveToolByNameOrAlias | cli_inner_pretty.js:224038-224048 | function |
| JJa | buildCommandMenuRow (emits the `dynamic workflow` tag) | cli_inner_pretty.js:744010-744026 | function |
| jQg | buildNameAndAliasMap | cli_inner_pretty.js:224028-224037 | function |
| KIn | resolveLocalJsxCommandLoader | cli_inner_pretty.js:735719-735722 | function |
| kpd | describeCommandNotModelInvocable | cli_inner_pretty.js:346451-346455 | function |
| M$s | getBundledPromptCommands | cli_inner_pretty.js:419696-419699 | function |
| nft | requireCommandByName | cli_inner_pretty.js:346419-346432 | function |
| nw | loadCommandRegistry | cli_inner_pretty.js:506699 | function |
| O7a | LOCAL_JSX_LOADERS | cli_inner_pretty.js:735728-735807 | object |
| oai | commandUnavailableMessage | cli_inner_pretty.js:735723-735725 | function |
| ou | registerBundledPromptCommand | cli_inner_pretty.js:419629-419695 | function |
| P$s | bundledPromptCommandRegistry | cli_inner_pretty.js:419766 (decl), 419776 (init), 419694 (push) | variable |
| PYe | describeCommandForListing (appends `(dynamic workflow)`) | cli_inner_pretty.js:506916-506918 | function |
| qa | toolMatchesNameOrAlias | cli_inner_pretty.js:224019-224021 | function |
| qM_ | fleetHostCallableCommands | cli_inner_pretty.js:507443 | variable |
| qNy | matchesCommandNameOrAlias | cli_inner_pretty.js:346393-346395 | function |
| R9H | LOCAL_JSX_LOADER_NAMES | cli_inner_pretty.js:735808 | variable |
| RAo | commandExecutionContext | cli_inner_pretty.js:326547-326549 | function |
| Sd | commandDisplayName | cli_inner_pretty.js:326533-326535 | function |
| Uep | getWorkflowCommandsRef (late-bound `HM_`) | cli_inner_pretty.js:507313 | variable |
| vdr | nearestNamesWithinEditDistance | cli_inner_pretty.js:326554-326567 | function |
| vHd | KILL_SWITCH_SURVIVING_COMMANDS | cli_inner_pretty.js:419693 | variable |
| yk | isCommandEnabled | cli_inner_pretty.js:326536-326538 | function |

## Module: Slash Commands — schema fields touched by this theme

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bpt` | closestCommandName | cli_inner_pretty.js:326568-326578 | function |
| `Cv` | lookupCommandByName | cli_inner_pretty.js:346396 | function |
| `Rfe` | splitSlashCommandNameAndArgs | cli_inner_pretty.js:342629-342639 | function |
| `Sd` | commandDisplayName | cli_inner_pretty.js:326533-326535 | function |
| `Spt` | levenshtein | cli_inner_pretty.js:326579-326596 | function |
| `vdr` | nearbyCommandNames | cli_inner_pretty.js:326554-326567 | function |
| `yk` | isCommandEnabled | cli_inner_pretty.js:326536-326538 | function |

## Module: Terminal Rendering and Mode Ownership

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $Rt | hasSeenMouseInput | cli_inner_pretty.js:165006 | function |
| _Up | MAX_TABLE_ROWS (200) | cli_inner_pretty.js:636511 | constant |
| AFe | mouseTrackingEnableSeq | cli_inner_pretty.js:253443 | function |
| bbn | MIN_COL_WIDTH (3) | cli_inner_pretty.js:636509 | constant |
| bqo | truncatedRowsNotice | cli_inner_pretty.js:636278 | function |
| cet | MouseTrackingHost | cli_inner_pretty.js:802308 | function |
| `computeScreenReaderPark` | cursor parking for magnifiers | cli_inner_pretty.js:258440 | function |
| d7 | decSet | cli_inner_pretty.js:253437 | function |
| dHe | detectPlatformForKeyHints | cli_inner_pretty.js:261056 | function |
| EJr | FOCUS_EVENTS_ON (DECSET 1004) | cli_inner_pretty.js:253473 | constant |
| `enterAlternateScreen` | now also resets DECSET 2004 / 2031 | cli_inner_pretty.js:258035 | function |
| Eqo | MarkdownTable (memoised component) | cli_inner_pretty.js:636525 | function |
| EUp | layoutMarkdownTable | cli_inner_pretty.js:636292 | function |
| ew | DEC_MODES | cli_inner_pretty.js:253456 | object |
| `exitAlternateScreen` | restores 2004 / 2031 / 1004 | cli_inner_pretty.js:258049 | function |
| f2u | getSynchronizedOutputTriState | cli_inner_pretty.js:253380 | function |
| f9 | sanitizeForRelay | cli_inner_pretty.js:284228 | function |
| Fpe | MOUSE_OFF (DECRST 1006/1003/1002/1000) | cli_inner_pretty.js:253483 | constant |
| IB | wrapForMultiplexer | cli_inner_pretty.js:216085 | function |
| IPt | FOCUS_EVENTS_OFF (DECRST 1004) | cli_inner_pretty.js:253474 | constant |
| JCu | copyViaNativeTool | cli_inner_pretty.js:216162 | function |
| jsr | THEME_NOTIFY_OFF (DECRST 2031) | cli_inner_pretty.js:253476 | constant |
| kZi | isAlternateScreenDisabled | cli_inner_pretty.js:164907 | function |
| Lo | Link (carries `assumeSupport`) | cli_inner_pretty.js:259616 | function |
| m8e | resolveFullscreenReason | cli_inner_pretty.js:164958 | function |
| m_ | collapseControlChars | cli_inner_pretty.js:217537 | function |
| mFe | KITTY_KEYBOARD_POP (`CSI < u`) | cli_inner_pretty.js:239892 | constant |
| mk | supportsHyperlinks | cli_inner_pretty.js:259591 | function |
| nho | BRACKETED_PASTE_ON (DECSET 2004) | cli_inner_pretty.js:253471 | constant |
| NT | setClipboard | cli_inner_pretty.js:216139 | function |
| `onRenderScreenReader` | the plain-text render path | cli_inner_pretty.js:258299 | function |
| out | getHyperlinkOverride | cli_inner_pretty.js:259584 | function |
| p2u | setSyncOutputProbeResult | cli_inner_pretty.js:253377 | function |
| `prepareTerminalForHandoff` | release mouse + focus modes to a child | cli_inner_pretty.js:258066 | function |
| QN | buildTerminalLink (OSC-8) | cli_inner_pretty.js:556647 | function |
| qSe | decReset | cli_inner_pretty.js:253440 | function |
| Qzg | copyViaTmuxLoadBuffer | cli_inner_pretty.js:216130 | function |
| Ras | ST (ESC backslash) | cli_inner_pretty.js:216351 | constant |
| `reassertTerminalModes` | re-designate G0 ASCII + reapply modes | cli_inner_pretty.js:258576 | function |
| `restoreTerminalAfterHandoff` | reapply mouse + focus modes | cli_inner_pretty.js:258071 | function |
| rMa | JumpToBottomPill | cli_inner_pretty.js:690714 | function |
| Ruo | RESET_G0_ASCII (`ESC(B` + SI) | cli_inner_pretty.js:215968 | constant |
| rUu | probeTerminalCapabilities | cli_inner_pretty.js:254316 | function |
| tho | syncOutputProbeResult | cli_inner_pretty.js:253378 (assigned; declared with tho at :253568) | variable |
| Usr | BRACKETED_PASTE_OFF (DECRST 2004) | cli_inner_pretty.js:253472 | constant |
| Xbr | sanitizeForTerminal | cli_inner_pretty.js:545754 | function |
| xee | isSynchronizedOutputSupported | cli_inner_pretty.js:253384 | function |
| Xly | MOUSE_SCROLL_ON (DECSET 1000+1006) | cli_inner_pretty.js:253482 | constant |
| ybe | getMouseTrackingMode | cli_inner_pretty.js:164997 | function |
| Yly | MOUSE_FULL_ON (DECSET 1000+1002+1003+1006) | cli_inner_pretty.js:253481 | constant |
| yUp | TABLE_PADDING (4) | cli_inner_pretty.js:636508 | constant |
| zCu | SCREEN_DCS_CHUNK (76) | cli_inner_pretty.js:216331 | constant |
| zhb | MAX_WRAPPED_LINES (4) | cli_inner_pretty.js:636510 | constant |

## Module: UI components — Ink renderer paint pass

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_uy` | `hasSiblingOnSameRow` | cli_inner_pretty.js:257217 | function |
| `buy` | `blitEscapingAbsoluteRects` (prune + explicit stack; 193 twin `uNi` `:174493 (193)`) | cli_inner_pretty.js:257235 | function |
| `Ev` | `nodeRects` (`WeakMap<node, {x,y,width,height}>`; written :257169, read :257180/:257250) | cli_inner_pretty.js:250476 | variable |
| `GUu` | `paintChildNodes` (gained the `depth` argument; 193 twin `lNi` `:174448 (193)`) | cli_inner_pretty.js:257189 | function |
| `guy` | `hasAbsolutePositionChanged` (gained the `hasAbsoluteDescendant` prune; 193 twin `sRd` `:174433 (193)`) | cli_inner_pretty.js:257173 | function |
| `Iho` | `paintNode` (per-node paint entry; now takes `depth`) | cli_inner_pretty.js:256820 | function |
| `Whs` | `paintClippedChildren` | cli_inner_pretty.js:257263 | function |
| `yuy` | `clipsBothAxes` | cli_inner_pretty.js:257212 | function |

## Module: UI components — markdown table renderer

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_Up` | `MAX_TABLE_ROWS` (`200`) | cli_inner_pretty.js:636511 | constant |
| `bbn` | `MIN_TABLE_COLUMN_WIDTH` (`3`) | cli_inner_pretty.js:636509 | constant |
| `bqo` | `buildHiddenRowsNotice` (3 call sites: :636316, :636438, :636492) | cli_inner_pretty.js:636278 | function |
| `bUp` | `ANSI_BOLD_ON` | cli_inner_pretty.js:636512 | constant |
| `EUp` | `renderMarkdownTable` (row cap + per-cell memo; 193 twin `tKa` `:380949 (193)`) | cli_inner_pretty.js:636292 | function |
| `M4t` | `wrapCellText` | cli_inner_pretty.js:636281 | function |
| `yUp` | `TABLE_WIDTH_SLACK` (`4`) | cli_inner_pretty.js:636508 | constant |

## Module: UI — `/release-notes`, `/usage`, `/cd` completions, `/upgrade`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| c5a | formatAllReleaseNotes | cli_inner_pretty.js:720257-720264 | function |
| Dni | formatOneVersionReleaseNotes | cli_inner_pretty.js:720250-720256 | function |
| IRf | buildUpgradeUrl | cli_inner_pretty.js:719545-719547 | function |
| Lni | RELEASE_NOTES_SHOW_ALL_SENTINEL | cli_inner_pretty.js:720273 (usage) | constant |
| qRS | COMMANDS_WITH_ARGUMENT_COMPLETIONS | cli_inner_pretty.js:744165 | constant |
| rfS | upgradeCommandCall | cli_inner_pretty.js:719550-719552 | function |
| svt | callUpgradeFromSurface | cli_inner_pretty.js:719553-719596 | function |
| u5a | ReleaseNotesPicker | cli_inner_pretty.js:720268-720340 | function |
| Uof | formatUsageAsOfSuffix | cli_inner_pretty.js:670406-670409 | function |
| wzo | commandDirectorySuggestionSet | cli_inner_pretty.js:654321 | constant |
| Zkn | emitReleaseNotesAsNotice | cli_inner_pretty.js:720265-720267 | function |

## Module: UI — artifact live-watch reconnect (decoy, recorded to prevent a repeat)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DXy` | `ARTIFACT_REWATCH_BACKOFF_DEFAULTS` (`{baseMs:1000, capMs:30000, minUptimeMs:60000, maxConsecutiveFailures:10}`) | cli_inner_pretty.js:420495 | object |
| `eRo` | `ARTIFACT_REWATCH_BACKOFF_CONFIG` (mutable copy of `DXy`, declared `:420476`) | cli_inner_pretty.js:420496 | object |
| `MHd` | `rewatchArtifactWithBackoff` (exponential backoff with ±25 % jitter, shift capped at 5) | cli_inner_pretty.js:420181 | function |
| `OHd` | `stopArtifactWatchWithReason` | cli_inner_pretty.js:420196 | function |

## Module: UI — left-arrow gesture, agent-view chrome, screen reader

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Fyp` | `applyLeftArrowGesture` (only writer of the gesture timestamps) | cli_inner_pretty.js:559664-559683 | function |
| `GV_` | `ATTACH_CONFIRM_MIN_MS` (150) | cli_inner_pretty.js:559686 | constant |
| `Jfo` | `markAttachQuietPending` (sets the `asr` pending flag) | cli_inner_pretty.js:239744-239746 | function |
| `kL` | `isScreenReaderModeEnabled` (makes the status budget `Infinity`) | cli_inner_pretty.js:156221-156223 | function |
| `LXr` | `isInAttachQuietWindow` — **stubbed `return !1`**, branch is dead | cli_inner_pretty.js:239750-239752 | function |
| `Nyp` | `classifyLeftArrowGesture` (fire / arm / absorb / reject) | cli_inner_pretty.js:559650-559663 | function |
| `Oyp` | `LEFT_ARROW_REPEAT_MS` (1,000) | cli_inner_pretty.js:559685 | constant |
| `Qfo` | `drainAttachQuietWindow` (returns on its first iteration) | cli_inner_pretty.js:239753-239759 | function |
| `qWf` | `getLeaderScopedCommandNotice` (`/model` and `/fast` only) | cli_inner_pretty.js:748982-748998 | function |
| `Rps` | `setAttachQuietStamp` (0 clears; honours the pending flag) | cli_inner_pretty.js:239736-239743 | function |
| `UXs` | `ARM_BANNER_MS` (3,000) | cli_inner_pretty.js:559684 | constant |
| `Vke` | `getAttachQuietStamp` (still feeds `freshEnough` despite the dead window) | cli_inner_pretty.js:239747-239749 | function |

## Module: Workflow — `/workflows` progress UI

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _vS | MIN_STATS_COL | cli_inner_pretty.js:729796 | constant |
| Azp | FLAT_AGENT_LIST_TAIL | cli_inner_pretty.js:650879 | constant |
| de | stepOutOfWorkflowDetail | cli_inner_pretty.js:729536-729547 | function |
| eza | WorkflowAgentsPane | cli_inner_pretty.js:728630 | function |
| Fst | formatCompactDuration | cli_inner_pretty.js:160497-160505 | function |
| G9o | WorkflowPhaseRow | cli_inner_pretty.js:650974 | function |
| gvS | buildAgentRowCells | cli_inner_pretty.js:728539-728556 | function |
| Hga | renderFlatAgentList | cli_inner_pretty.js:650746-650811 | function |
| Iga | WorkflowProgressBody | cli_inner_pretty.js:650812-650875 | function |
| iNf | buildCompactAgentRowSegments | cli_inner_pretty.js:728935-728944 | function |
| kga | renderPhaseGroupBox | cli_inner_pretty.js:650629-650745 | function |
| L9o | groupAgentsByPhase | cli_inner_pretty.js:650505-650518 | function |
| lNf | TIME_COL_WIDTH | cli_inner_pretty.js:729794 | constant |
| mb | getModelDisplayName | cli_inner_pretty.js:111291-111298 | function |
| nNf | buildPhaseRowSegments | cli_inner_pretty.js:728897-728919 | function |
| nza | WorkflowAgentSplitPane | cli_inner_pretty.js:729234 | function |
| oNf | buildAgentRowSegments | cli_inner_pretty.js:728920-728934 | function |
| oza | WorkflowAgentSinglePane | cli_inner_pretty.js:729362 | function |
| Q9a | layoutAgentRowSegments | cli_inner_pretty.js:728557-728581 | function |
| qii | computeAgentTitleColumnWidth | cli_inner_pretty.js:728581-728585 | function |
| RTr | partitionWorkflowProgress | cli_inner_pretty.js:650495-650504 | function |
| TTr | formatModelPair | cli_inner_pretty.js:650468-650472 | function |
| tza | WorkflowPhasesAgentsSplitPane | cli_inner_pretty.js:728946 | function |
| vvn | WorkflowAgentTreeRow | cli_inner_pretty.js:650519-… | function |
| yvS | MAX_TITLE_COL | cli_inner_pretty.js:729795 | constant |
| Z9a | WorkflowListWindowIndicator | cli_inner_pretty.js:728617 | function |
| Zl | KeyboardFocusBox | cli_inner_pretty.js:654325-654343 | function |

---

## Source documents

- [`symbol_additions_v2_1_220_accessibility_ui.md`](symbol_additions_v2_1_220_accessibility_ui.md)
- [`symbol_additions_v2_1_220_api_reliability.md`](symbol_additions_v2_1_220_api_reliability.md)
- [`symbol_additions_v2_1_220_background_agents_view.md`](symbol_additions_v2_1_220_background_agents_view.md)
- [`symbol_additions_v2_1_220_chrome_ide.md`](symbol_additions_v2_1_220_chrome_ide.md)
- [`symbol_additions_v2_1_220_code_review.md`](symbol_additions_v2_1_220_code_review.md)
- [`symbol_additions_v2_1_220_compact.md`](symbol_additions_v2_1_220_compact.md)
- [`symbol_additions_v2_1_220_performance.md`](symbol_additions_v2_1_220_performance.md)
- [`symbol_additions_v2_1_220_remote_control.md`](symbol_additions_v2_1_220_remote_control.md)
- [`symbol_additions_v2_1_220_skills_plugins.md`](symbol_additions_v2_1_220_skills_plugins.md)
- [`symbol_additions_v2_1_220_slash_cli.md`](symbol_additions_v2_1_220_slash_cli.md)
- [`symbol_additions_v2_1_220_workflow.md`](symbol_additions_v2_1_220_workflow.md)
