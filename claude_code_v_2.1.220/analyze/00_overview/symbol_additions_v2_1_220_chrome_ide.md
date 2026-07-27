# Symbol additions — v2.1.220, theme `chrome_ide`

Produced by the `56_chrome_ide/` module pass. Every row's `File:Line` was read in
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines) during this pass. Baseline rows, where given, are tagged `(193)` and refer to
`/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.

**Every group below merges into
[`symbol_index_infra_integration.md`](symbol_index_infra_integration.md)** (LSP / Chrome / IDE / UI /
plugin / slash-command integrations), except where a group header says otherwise.

> Reminder from `_CONVENTIONS.md` §4.1: these ids are re-mangled per build and are **reused** across
> unrelated declarations. Re-derive from the string / gate / env-var anchor in the third column
> before using any of them against another bundle.

---

## Module: Chrome Bridge (transport)

→ merge into `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `H3_` | `isValidChromePermissionMode` | cli_inner_pretty.js:537608 | function |
| `I3_` | `getBridgeWebSocketUrl` | cli_inner_pretty.js:537611 | function |
| `L3_` | `runClaudeInChromeMcpServer` | cli_inner_pretty.js:537708 | function |
| `R3_` | `isLocalBridge` | cli_inner_pretty.js:537616 | function |
| `Tcp` | `createChromeContext` | cli_inner_pretty.js:537619 | function |
| `y3_` | `TELEMETRY_EVENT_ALLOWLIST` | cli_inner_pretty.js:537275 | constant |

---

## Module: Chrome extension setup and native host

→ merge into `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$5u` | `resolveViaAppPaths` | cli_inner_pretty.js:267035 | function |
| `A_s` | `execFailureFields` | cli_inner_pretty.js:267214 | function |
| `Bmy` | `WINDOWS_APP_PATHS_KEY` | cli_inner_pretty.js:267104 | constant |
| `D9e` | `openInChrome` | cli_inner_pretty.js:267221 | function |
| `Gmy` | `parseRegQueryDefaultValue` | cli_inner_pretty.js:267019 | function |
| `H_s` | `getAllSocketPaths` | cli_inner_pretty.js:267293 | function |
| `MX` | `isChromeExtensionInstalled` | cli_inner_pretty.js:663927 | function |
| `N5u` | `spawnDetached` | cli_inner_pretty.js:267085 | function |
| `P5u` | `APP_PATHS_REG_TIMEOUT_MS` (1e4) | cli_inner_pretty.js:267105 | constant |
| `PQr` | `getSecureSocketPath` | cli_inner_pretty.js:267274 | function |
| `Qar` | `getSocketDir` | cli_inner_pretty.js:267271 | function |
| `U5u` | `getWindowsPipeName` | cli_inner_pretty.js:267308 | function |
| `Umy` | `APP_PATHS_STAT_TIMEOUT_MS` (5000) | cli_inner_pretty.js:267106 | constant |
| `Wmy` | `expandWindowsEnvPlaceholders` | cli_inner_pretty.js:267030 | function |
| `Wva` | `installChromeNativeHostManifest` | cli_inner_pretty.js:664042 | function |
| `Yva` | `claudeInChromeSetupModule` | cli_inner_pretty.js:663918 | object |
| `gjt` | `CHROME_EXTENSION_RECONNECT_URL` | cli_inner_pretty.js:663934 | constant |
| `iDb` | `registerNativeHostInWindowsRegistry` | cli_inner_pretty.js:664093 | function |
| `j5u` | `claudeInChromeModule` | cli_inner_pretty.js:267114 | object |
| `oDb` | `getAllNativeMessagingHostsDirs` (Windows arm) | cli_inner_pretty.js:664034 | function |
| `zmy` | `probeLegacyChromeSockets` | cli_inner_pretty.js:267278 | function |

---

## Module: Chrome install upsell (`.198` GA)

→ merge into `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Vsl` | `CHROME_UPSELL_SKIP_OPTION` | cli_inner_pretty.js:768699 | constant |
| `VGS` | `trackChromeInstallUpsellShown` | cli_inner_pretty.js:768701 | function |
| `bge` | `chromeInstallUpsellLatch` | cli_inner_pretty.js:773899 | variable |
| `gD_` | `CHROME_SLASH_COMMAND` (`/chrome`) | cli_inner_pretty.js:501557 | object |
| `hqS` | `runChromeInstallUpsellDialog` | cli_inner_pretty.js:773937 | function |
| `ocl` | `offerChromeInstallOnce` | cli_inner_pretty.js:773920 | function |
| `vnm` | `shouldOfferChromeInstall` | cli_inner_pretty.js:773897 | function |

---

## Module: Chrome file upload (`.211` hardening)

→ merge into `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bvs` | `chromeFileUploadModule` | cli_inner_pretty.js:514070 | object |
| `Bxu` | `restoreAttachmentDisplayName` | cli_inner_pretty.js:217627 | function |
| `Cor` | `getSessionUploadsDir` | cli_inner_pretty.js:217615 | function |
| `Fxu` | `isReservedAfterTrailingUnderscores` | cli_inner_pretty.js:217621 | function |
| `HKg` | `suffixIfWindowsUnsafeName` | cli_inner_pretty.js:217624 | function |
| `IKg` | `ATTACHMENT_DIGEST_LRU_MAX` (1024) | cli_inner_pretty.js:217645 | constant |
| `Nxu` | `buildAttachmentStoredName` | cli_inner_pretty.js:217618 | function |
| `Tou` | `isWindowsReservedOrTrailingDotName` | cli_inner_pretty.js:162382 | function |
| `UQi` | `TRAILING_DOT_OR_SPACE_RE` | cli_inner_pretty.js:162387 | constant |
| `Urp` | `uploadDeniedMessage` | cli_inner_pretty.js:514127 | function |
| `Uxu` | `registerAttachmentDigest` | cli_inner_pretty.js:217632 | function |
| `Vrp` | `readlinkFailureVerdict` | cli_inner_pretty.js:514246 | function |
| `Wrp` | `uploadRootsForSession` | cli_inner_pretty.js:514079 | function |
| `a$_` | `prepareChromeFileUploadInput` | cli_inner_pretty.js:514094 | function |
| `c$_` | `openAndSnapshotUploadFile` | cli_inner_pretty.js:514269 | function |
| `d$_` | `mimeTypeForUploadPath` | cli_inner_pretty.js:514299 | function |
| `d2o` | `verifyHandleBinding` | cli_inner_pretty.js:514249 | function |
| `jQi` | `DOS_DEVICE_SUFFIX_RE` | cli_inner_pretty.js:162387 | constant |
| `jrp` | `prepareFileUploadPaths` | cli_inner_pretty.js:514130 | function |
| `jxu` | `lookupAttachmentDigest` | cli_inner_pretty.js:217640 | function |
| `l$_` | `validateUploadPath` | cli_inner_pretty.js:514159 | function |
| `qrp` | `readBoundedToSnapshot` | cli_inner_pretty.js:514234 | function |
| `t8s` | `FILE_UPLOAD_MAX_TOTAL_BYTES` (10485760) | cli_inner_pretty.js:514308 | constant |

---

## Module: Chrome screenshot `save_to_disk` (`.211`)

→ merge into `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Fl` | `SCREENSHOT_MIME_TO_EXT` | cli_inner_pretty.js:43774 | object |
| `BFl` | `writeScreenshotsToDisk` | cli_inner_pretty.js:43697 | function |
| `NFl` | `getOrCreateScreenshotTempDir` | cli_inner_pretty.js:43675 | function |
| `ZSh` | `SCREENSHOT_SAVED_PREFIX` (`"Screenshot saved to: "`) | cli_inner_pretty.js:43767 | constant |
| `eEh` | `screenshotCounter` | cli_inner_pretty.js:43768 | variable |
| `tEh` | `resolveScreenshotSaveDir` | cli_inner_pretty.js:43683 | function |
| `vjn` | `memoisedScreenshotTempDir` | cli_inner_pretty.js:43769 | variable |

---

## Module: Environment / work bridge (`claude bridge`)

→ merge into `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `X4o` | `sanitizeSessionIdForFilename` | cli_inner_pretty.js:545323 | function |
| `Ybr` | `BRIDGE_POLL_DEFAULTS` | cli_inner_pretty.js:545264 | object |
| `aW_` | `summarizeToolInvocation` | cli_inner_pretty.js:545326 | function |
| `igt` | `getBridgePollIntervalConfig` | cli_inner_pretty.js:545275 | function |
| `lW_` | `parseBridgeActivityLine` | cli_inner_pretty.js:545332 | function |
| `nW_` | `bridgePollConfigSchema` | cli_inner_pretty.js:545286 | object |
| `sfp` | `POLL_INTERVAL_REFINE_MESSAGE` | cli_inner_pretty.js:545285 | constant |
| `t7e` | `assertBridgeApiStatus` | cli_inner_pretty.js:541809 | function |

---

## Module: REPL bridge / remote code sessions

→ merge into `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ckd` | `shouldSweepBridgePlaceholders` | cli_inner_pretty.js:415181 | function |
| `K1t` | `isCreateSessionFailure` | cli_inner_pretty.js:333737 | function |
| `Kwo` | `createCodeSession` | cli_inner_pretty.js:333753 | function |
| `Ovn` | `readFileForRemote` | cli_inner_pretty.js:652721 | function |
| `PKp` | `remoteFileReadModule` | cli_inner_pretty.js:652719 | object |
| `Y1t` | `isCredentialsFailure` | cli_inner_pretty.js:333801 | function |
| `aHs` | `buildGitSessionContext` | cli_inner_pretty.js:333660 | function |
| `cHs` | `reportGitSessionContext` | cli_inner_pretty.js:333699 | function |
| `eCb` | `REMOTE_READ_DEFAULT_BYTES` (1e6) | cli_inner_pretty.js:652757 | constant |
| `kIo` | `PendingPlaceholderQueue` | cli_inner_pretty.js:415150 | class |
| `lHs` | `gitSessionContextModule` | cli_inner_pretty.js:333658 | object |
| `rcd` | `isGroupingRejection` | cli_inner_pretty.js:333740 | function |
| `szo` | `REMOTE_READ_MAX_BYTES` (1e7) | cli_inner_pretty.js:652758 | constant |
| `wkd` | `stripSessionIdPrefix` | cli_inner_pretty.js:415178 | function |

---

## Module: SDK `set_cwd` control request (IDE / Desktop hosts)

→ merge into `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `QKo` | `INVISIBLE_CHARS_RE` | cli_inner_pretty.js:663724 | constant |
| `Rva` | `setCwdControlModule` | cli_inner_pretty.js:663496 | object |
| `aef` | `safeWireMessage` | cli_inner_pretty.js:663601 | function |
| `eYo` | `validateCdTarget` | cli_inner_pretty.js:663504 | function |
| `kxm` | `isSessionBusyForCwdChange` | cli_inner_pretty.js:843367 | function |
| `qLb` | `handleSetCwdControlRequest` | cli_inner_pretty.js:663604 | function |

---

## Module: Host surfaces (Desktop, Cowork, reserved MCP names)

→ merge into `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AEy` | `BROWSER_CONTROL_SERVER_NAMES` | cli_inner_pretty.js:289043 | constant |
| `Hxm` | `hasStoppableRunningTasks` | cli_inner_pretty.js:843370 | function |
| `Ixm` | `shouldReportSessionRunning` | cli_inner_pretty.js:843373 | function |
| `K9u` | `RESERVED_DESKTOP_PANE_NAMES` | cli_inner_pretty.js:289042 | constant |
| `Qhr` | `isDesktopHandoffAvailable` | cli_inner_pretty.js:449721 | function |
| `Rxm` | `shouldReportRunningForBgTasks` | cli_inner_pretty.js:843383 | function |
| `fkg` | `CLAUDE_BROWSER_SERVER_NAME` | cli_inner_pretty.js:151629 | constant |
| `gkg` | `NORMALISED_RESERVED_SERVER_NAMES` | cli_inner_pretty.js:151634 | constant |
| `pkg` | `CLAUDE_PREVIEW_SERVER_NAME` | cli_inner_pretty.js:151628 | constant |
| `wl_` | `DESKTOP_SLASH_COMMAND` (`/desktop`) | cli_inner_pretty.js:449727 | object |

---

## Module: Auth — OAuth scope-downgrade retry (`.216` Chrome 403 loop)

→ merge into `symbol_index_infra_platform.md` (auth)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aXi` | `isInvalidScopeError` | cli_inner_pretty.js:155362 | function |
| `fV` | `hasClaudeAiScopes` | cli_inner_pretty.js:155356 | function |
| `k$e` | `refreshOAuthToken` | cli_inner_pretty.js:155360 | function |
| `trt` | `CLAUDE_AI_OAUTH_SCOPES` | cli_inner_pretty.js:24671 | constant |

---

## Feature gates and telemetry events added by this pass

All confirmed `220>0 / 193=0` with `grep -c` over both bundles.

| Gate / event | 220 | 193 | 2.1.220 line | Owner doc |
|---|---|---|---|---|
| `tengu_bridge_outcome_branch_dropped` | 1 | 0 | cli_inner_pretty.js:333702 | `56_chrome_ide/bridge_transport.md` |
| `tengu_bridge_placeholder_sweep` | 1 | 0 | cli_inner_pretty.js:415184 | `56_chrome_ide/bridge_transport.md` |
| `tengu_bridge_read_file_served` | 2 | 0 | cli_inner_pretty.js:652737 | `56_chrome_ide/bridge_transport.md` |
| `tengu_bridge_repl_env_expired_fresh_session` | 1 | 0 | cli_inner_pretty.js:417056 | `56_chrome_ide/bridge_transport.md` |
| `tengu_bridge_revision_guess_used` | 1 | 0 | cli_inner_pretty.js:333708 | `56_chrome_ide/bridge_transport.md` |
| `tengu_ccr_v2_session_crud_cli` | 1 | 0 | cli_inner_pretty.js:535754 | `56_chrome_ide/bridge_transport.md` |
| `tengu_chrome_install_upsell` | 2 | 0 | cli_inner_pretty.js:773913 | `56_chrome_ide/chrome_ga_and_hardening.md` |
| `tengu_chrome_install_upsell_shown` | 1 | 0 | cli_inner_pretty.js:768702 | `56_chrome_ide/chrome_ga_and_hardening.md` |
| `tengu_dead_probe_chrome_legacy_socket` | 1 | 0 | cli_inner_pretty.js:267285 | `56_chrome_ide/chrome_ga_and_hardening.md` |
| `tengu_oauth_refresh_invalid_scope_fallback` | 1 | 0 | cli_inner_pretty.js:155363 | `56_chrome_ide/ide_and_desktop.md` |

Carryover gates re-verified in this pass (do **not** report as new):
`tengu_bridge_poll_interval_config` (`:545276`), `tengu_bridge_spawn_mode_chosen` (`:546864`, 1/1),
`tengu_ccr_v2_send_events_cli` (`:535751`, 1/1 — `:603988 (193)`), `tengu_chrome_bridge_account_mismatch`
(`:537676`), and every `chrome_bridge_*` event (26/26).

---

## Env vars added / removed by this pass

| Env var | 220 | 193 | 2.1.220 accessor | Note |
|---|---|---|---|---|
| `CLAUDE_CODE_BRIDGE_SESSION_ID` | 6 | 0 | cli_inner_pretty.js:32163 (`sah`) | set on the spawned child at `:332295` |
| `CLAUDE_BRIDGE_REATTACH_GROUPING` | 5 | 0 | cli_inner_pretty.js:32182 (`qsh`) | one-shot handshake, deleted after read `:737604` |
| `CLAUDE_BRIDGE_USE_CCR_V2` | **0** | 2 | — | **REMOVED**; replaced by two gates (see above). 193 accessor `:43197 (193)` |

Carryover env vars re-verified: `LOCAL_BRIDGE` (3/3, `:32007`),
`CLAUDE_CHROME_PERMISSION_MODE` (4/4, read `:537627`),
`CLAUDE_CODE_IS_COWORK` (`:32129`), `CLAUDE_CODE_BG_TASKS_REPORT_RUNNING` (4/2 — count grew, name
pre-existed).

---

## Endpoints recorded by this pass (all read in 2.1.220)

| URL / path | Line | Bridge |
|---|---|---|
| `wss://bridge.claudeusercontent.com` | :537614 | Chrome |
| `wss://bridge-staging.claudeusercontent.com` | :537613 | Chrome |
| `ws://localhost:8765` | :537612 | Chrome (dev) |
| `POST /v1/environments/bridge` | :541657 | environment/work |
| `GET  /v1/environments/{id}/work/poll` | :541691 | environment/work |
| `POST /v1/environments/{id}/work/{workId}/ack` | :541714 | environment/work |
| `POST /v1/environments/{id}/work/{workId}/stop` | :541725 | environment/work |
| `POST /v1/environments/{id}/work/{workId}/heartbeat` | :541785 | environment/work |
| `DELETE /v1/environments/bridge/{id}` | :541737 | environment/work |
| `POST /v1/environments/{id}/bridge/reconnect` | :541771 | environment/work |
| `POST /v1/code/sessions` | :333754 | REPL bridge |
| `POST /v1/code/sessions/{id}/archive` (v2) / `/v1/sessions/{id}/archive` (v1) | :541748 | either, gate-selected |
