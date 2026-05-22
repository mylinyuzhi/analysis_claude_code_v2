# Symbol Additions — Ant-Promoted Features (v2.1.142)

Symbols discovered during the C2 deep-dive on promoted/removed/disabled features. See `40_ant_promoted/10_promoted_*.md` for full context.

## /ultraplan

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `sQ` | `isUltraplanEnabled` | cli_inner_pretty.js:475282 | function |
| `$J4` | `ultraplanSlashCommand` | cli_inner_pretty.js:475814 | object |
| `DT5` | `ultraplanCallImpl` | cli_inner_pretty.js:~475730 | function |
| `JX8` | `getUltraplanShape` | cli_inner_pretty.js:~475790 | function |
| `pjH` | `CCR_TERMS_URL` (ultraplan variant) | cli_inner_pretty.js:~475818 | constant |
| `YdH` | `isCloudCodeRunnerBridgeAvailable` | cli_inner_pretty.js:272755 | function |
| `I6` | `isCurrentlyInRemoteWorkspace` | cli_inner_pretty.js:3104 | function |

Stored in `symbol_index_core_features.md` under Module: Plan Mode.

## /ultrareview + claude ultrareview

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `V1H` | `isUltrareviewEnabled` | cli_inner_pretty.js:474757 | function |
| `JaH` | `getReviewBughunterConfig` | cli_inner_pretty.js:474742 | function |
| `Or` | `getDurationNote` | cli_inner_pretty.js:474749 | function |
| `CEH` | `getCostNote` | cli_inner_pretty.js:474745 | function |
| `xj4` | `getReviewBughunterModel` | cli_inner_pretty.js:474753 | function |
| `fJ4` | `ultrareviewSlashCommand` | cli_inner_pretty.js:476334 | object |
| `ST5` | `reviewCommandLocal` | cli_inner_pretty.js:476323 | object |
| `rqA` | `ultrareviewCliHandler` | cli_inner_pretty.js:604787 | function |
| `aqA` | `pollUntilReviewComplete` | cli_inner_pretty.js:604868 | function |
| `oqA` | `extractRemoteError` | cli_inner_pretty.js:604858 | function |
| `tqA` | `formatFindings` | cli_inner_pretty.js:~604850 | function |
| `OB6` | `buildBlockedAction` | cli_inner_pretty.js:474765 | function |
| `mj4` | `fetchUltrareviewPreflight` | cli_inner_pretty.js:474768 | function |
| `lqA` | `DEFAULT_TIMEOUT_MIN` (ultrareview CLI) | cli_inner_pretty.js:~604796 | constant |
| `fX8` | `launchUltrareview` | cli_inner_pretty.js (referenced from CLI) | function |
| `jaH` | `globalTaskRegistry` | cli_inner_pretty.js (referenced from CLI) | object |

Stored in `symbol_index_core_features.md` under Module: CLI.

## /fast

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_9` | `isFastModeEnabled` | cli_inner_pretty.js:96854 | function |
| `Da` | `getFastModeUnavailableReason` | cli_inner_pretty.js:96881 | function |
| `Cc` | `isOpus46FastModeOverride` | cli_inner_pretty.js:96905 | function |
| `Yu` | `getFastModeModelDisplay` | cli_inner_pretty.js:96908 | function |
| `VxH` | `getFastModeModelId` | cli_inner_pretty.js:96911 | function |
| `Pi8` | `getInitialFastModeSetting` | cli_inner_pretty.js:96914 | function |
| `Uw` | `isFastModeSupportedByModel` | cli_inner_pretty.js:96922 | function |
| `Wi8` | `getFastModeRuntimeState` | cli_inner_pretty.js:96929 | function |
| `nsq` | `triggerFastModeCooldown` | cli_inner_pretty.js:96936 | function |
| `RzH` | `clearFastModeCooldown` | cli_inner_pretty.js:96944 | function |
| `isq` | `disableFastModeForPreference` | cli_inner_pretty.js:96947 | function |
| `Ev5` | `fastInteractiveCommand` | cli_inner_pretty.js:484225 | object |
| `KP4` | `fastNonInteractiveCommand` | cli_inner_pretty.js:484242 | object |
| `Ap6` | `fastCommandDefaultExport` | cli_inner_pretty.js:484252 | variable |
| `IaH` | `isImmediateModelCommandEnabled` | cli_inner_pretty.js:483882 | function |

Stored in `symbol_index_core_features.md` under Module: CLI.

## claude agents (dashboard CLI)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `RC5` | `detectInvocationKind` | cli_inner_pretty.js:509150 | function |
| `rmH` | `isAgentViewDisabled` | cli_inner_pretty.js:139859 | function |
| `KG$` | `ensureDaemonRunningWithInstallOffer` | cli_inner_pretty.js:509189 | function |
| `bP8` | `backgroundedJobHelpFooter` | cli_inner_pretty.js:510749 | function |
| `IN4` | `extractExtraArgsForBgSubcommand` | cli_inner_pretty.js:510760 | function |
| `Xg6` | `warnOnExtraArgs` | cli_inner_pretty.js:510785 | function |
| `Lg6` | `resolveBgSessionIdFromPrefix` | cli_inner_pretty.js:510789 | function |
| `aC5` | `claudeLogsHandler` | cli_inner_pretty.js:510816 | function |
| `SC5` | `shouldStartDaemonAtAll` | cli_inner_pretty.js:509146 | function |
| `bC5` | `shouldShowInstallPrompt` | cli_inner_pretty.js:509166 | function |
| `disableAgentView` | (setting) | cli_inner_pretty.js:50523 | schema field |
| `defaultToAgentsView` | (setting) | cli_inner_pretty.js:140657 | schema field |

Stored in `symbol_index_core_features.md` under Module: CLI.

## /goal (dual export)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BR5` | `goalInteractiveCommand` | cli_inner_pretty.js:507850 | object |
| `pR5` | `goalNonInteractiveCommand` | cli_inner_pretty.js:507858 | object |
| `UR5` | `goalCommandDefaultExport` | cli_inner_pretty.js:507870 | variable |
| `T6` | `isNonInteractive` | cli_inner_pretty.js:2677 | function |
| `Xv` | `isInteractive` | cli_inner_pretty.js:2680 | function |

Stored in `symbol_index_core_features.md` under Module: /goal Command.

## Bridge / Remote Control

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `uk` | `isRemoteControlAvailable` | cli_inner_pretty.js:272764 | function |
| `UK8` | `isDisabledByManagedSettings` | cli_inner_pretty.js:272761 | function |
| `qX6` | `isRemoteControlAvailableAsync` | cli_inner_pretty.js:272769 | function |
| `Ph5` | `remoteControlCommand` | cli_inner_pretty.js:497963 | object |
| `Wh5` | `remoteControlCommandDefaultExport` | cli_inner_pretty.js:497976 | variable |
| `EN5` | `bridgeKickCommand` | cli_inner_pretty.js:492234 | object |
| `KZ4` | `bridgeKickCommandDefaultExport` | cli_inner_pretty.js:492242 | variable |
| `NN5` | `bridgeKickHandler` | cli_inner_pretty.js:492128 | function |
| `$Z4` | `getBridgeDebugHandle` | cli_inner_pretty.js:492110 | function |
| `Up6` | `BRIDGE_KICK_USAGE` | cli_inner_pretty.js:492118 | constant |
| `disableRemoteControl` | (setting) | cli_inner_pretty.js:50529 | schema field |

Stored in `symbol_index_infra_platform.md` under new Module: Bridge / Remote Control.

## Undercover mode

No 2.1.142 symbols — feature is absent. See `40_ant_promoted/10_promoted_undercover_mode.md` for v2.1.88 source reference.

## Cross-checks

- All symbols above verified by direct line lookup in cli_inner_pretty.js
- Line numbers may shift slightly between binary rebuilds; consult surrounding context for resolution
- See `40_ant_promoted/` for the deep-dive analysis
