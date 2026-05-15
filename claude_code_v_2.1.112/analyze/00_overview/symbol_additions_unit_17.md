# Symbol Additions — Unit 17 (Slash Commands 2.1.88 -> 2.1.112)

Symbols discovered during Unit 17 analysis of new and changed slash commands in v2.1.112. These should be merged into the canonical `symbol_index.md` (Module: Slash Commands section) once all 18 units complete.

Each row pairs a v2.1.112 obfuscated identifier with the readable name confirmed against the v2.1.88 source at `/lyz/codespace/3rd/claude-code/src/`.

Note: rows already present in `symbol_index.md` (e.g. `qQK`, `KQK`, `eUK`, `tUK`, `Xg`, `LaY`, `haY`, `yaY`, `jsY`, `ulK`, `wW6`, `bcY`, `IcY`, `FoY`) are retained for cross-reference and to make this file self-contained.

---

## Module: Slash Commands — `/ultrareview` (v2.1.111)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ulK` | `ultrareviewCommandDef` | chunks.183.mjs:2168-2176 | object |
| `wW6` | `isUltrareviewEnabled` | chunks.183.mjs (called from ulK) | function |
| `s_6` | `getRuntimeEstimate` | chunks.183.mjs:536-539 | function |
| `Au6` | `getCostEstimate` | chunks.183.mjs:531-534 | function |
| `Yu6` | `getUltrareviewConfig` | chunks.183.mjs:527-529 | function |
| `EdY` | `ULTRAREVIEW_DOC_URL` | chunks.183.mjs (referenced in description getter) | constant |
| `xlK` | `initUltrareviewModule` | chunks.183.mjs (load path) | function |
| `IlK` | `ultrareviewComponent` | chunks.183.mjs | component |
| `mlK` | `ultrareviewLazyExport` | chunks.183.mjs:2178 | object |
| `hdY` | `ultrareviewQrComponent` (renders preflight QR) | chunks.183.mjs:2181-... | function |

## Module: Slash Commands — `/recap` (v2.1.108)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `LaY` | `recapCommandDef` | chunks.189.mjs:2782-2792 | object |
| `haY` | `recapCommandExport` | chunks.189.mjs:2791 | object |
| `yaY` | `recapCommandHandler` (call:) | chunks.189.mjs | function |
| `ptK` | `recapCommandRegistrar` (init block) | chunks.189.mjs:2779 | function |

## Module: Slash Commands — `/rewind` + `/undo` alias (alias added v2.1.108)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `jiY` | `rewindCommandDef` | chunks.188.mjs:142-152 | object |
| `ooK` | `rewindCommandExport` | chunks.188.mjs:151 | object |
| `aoK` | `rewindCommandRegistrar` | chunks.188.mjs:142 | function |
| `roK` | `rewindCommandLazyModule` | chunks.188.mjs (load:) | object |

## Module: Slash Commands — `/focus` (v2.1.110)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `FoY` | `focusCommandDef` | chunks.189.mjs:1450-1475 | object |
| `OtK` | `focusCommandExport` | chunks.189.mjs:1474 | object |
| `wtK` | `focusCommandRegistrar` | chunks.189.mjs:1450 | function |
| `lq` | `isFullscreenMode` (focus gate `isEnabled`) | chunks.65.mjs | function |
| `H8` | `getUserSettings` (focus persistence read) | chunks (utility) | function |
| `d8` | `updateUserSettings` (focus persistence write) | chunks (utility) | function |

## Module: Slash Commands — `/tui` (v2.1.110)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `IcY` | `tuiCommandDef` | chunks.185.mjs:444-454 | object |
| `KiK` | `tuiCommandExport` | chunks.185.mjs:453 | object |
| `bcY` | `tuiCommandHandler` (lambda) | chunks.185.mjs:397-431 | function |
| `qiK` | `tuiCommandRegistrar` (init) | chunks.185.mjs:433-439 | function |
| `n$7` | `TUI_RENDERER_MODES` (`["default", "fullscreen"]`) | chunks.185.mjs:438 | constant |
| `enK` | `tuiCommandLazyModule` | chunks.185.mjs (load:) | object |

## Module: Slash Commands — `/team-onboarding` (v2.1.101)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `jsY` | `teamOnboardingCommandDef` | chunks.190.mjs:193-231 | object |
| `JsY` | `teamOnboardingCommandExport` | chunks.190.mjs:231 | object |
| `$sY` | `TEAM_ONBOARDING_ALLOWED_TOOLS` (`["Edit(ONBOARDING.md)", "Bash(ls *)"]`) | chunks.190.mjs:193 | constant |
| `$z8` | `teamOnboardingCommandRegistrar` | chunks.190.mjs:180-... | function |
| `wsY` | `DEFAULT_TEAM_ONBOARDING_PROMPT` | chunks.190.mjs (referenced via flag) | constant |
| `OsY` | `DEFAULT_TEAM_ONBOARDING_GUIDE_TEMPLATE` | chunks.190.mjs (referenced via flag) | constant |
| `_sY` | `DEFAULT_TEAM_ONBOARDING_WINDOW_DAYS` | chunks.190.mjs (default fallback) | constant |
| `AsY` | `collectTeamOnboardingUsageData` | chunks.190.mjs:215 | function |
| `HsY` | `getTeamOnboardingDisplayMode` (`"off" | "banner" | "step"`) | chunks.190.mjs:235-... | function |
| `mo8` | `TEAM_ONBOARDING_BANNER_COPY` | chunks.190.mjs:231 | constant |

## Module: Slash Commands — `/loop` + `/proactive` alias (alias added v2.1.105)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ojA` | `loopCommandRegistrar` | chunks.212.mjs:874-... | function |
| `dW7` | `loopDynamicEnabledModule` (returns `isLoopDynamicEnabled()`) | chunks.212.mjs | object |
| `Im6` | `loopDefaultPromptEnabledModule` (returns `isLoopDefaultPromptEnabled()`) | chunks.212.mjs | object |
| `UjA` | `LOOP_INTERVAL_REGEX` (matches `^N[smhd]`) | chunks.212.mjs | constant |
| `gjA` | `LOOP_TRAILING_EVERY_REGEX` (matches `every <N><unit>`) | chunks.212.mjs | constant |
| `QjA` | `parseLoopIntervalMatch` | chunks.212.mjs | function |
| `xm6` | `LOOP_DEFAULT_PROMPT_FALLBACK` | chunks.212.mjs | constant |

## Module: Slash Commands — `/powerup` (v2.1.90)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `qQK` | `registeredPowerupCommand` | chunks.180.mjs:1396-1403 | object |
| `KQK` | `powerupCommandDef` (lazy init) | chunks.180.mjs | function |
| `eUK` | `initPowerupLessons` | chunks.180.mjs | function |
| `tUK` | `powerupLessonComponent` | chunks.180.mjs | component |
| `Xg` | `powerupLessonsArray` | chunks.180.mjs:961 | array |

## Module: Slash Commands — `/release-notes` interactive (v2.1.92)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `pFY` | `releaseNotesCommandDef` | chunks.180.mjs:1701-1708 | object |
| `k27` | `releaseNotesCommandExport` | chunks.180.mjs:1707 | object |
| `WQK` | `releaseNotesCommandRegistrar` | chunks.180.mjs:1701 | function |
| `MQK` | `releaseNotesLazyModule` | chunks.180.mjs:1566 | object |
| `PQK` | `initReleaseNotesModule` | chunks.180.mjs:1688 | function |
| `OQK` | `persistChangelogCacheIfNeeded` | chunks.180.mjs:1409 | function |
| `v27` | `getChangelogCachePath` | chunks.180.mjs:1405-1407 | function |

## Module: Slash Commands — `/setup-bedrock` (v2.1.92) and `/setup-vertex` (v2.1.98)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ecK` | `setupBedrockCommandDef` | chunks.183.mjs:450-461 | object |
| `qlK` | `setupBedrockCommandRegistrar` | chunks.183.mjs:450 | function |
| `scK` | `setupBedrockLazyModule` | chunks.183.mjs (load:) | object |
| `tcK` | `initSetupBedrockModule` | chunks.183.mjs:440 | function |
| `YlK` | `setupVertexCommandDef` | chunks.183.mjs:514-525 | object |
| `AlK` | `setupVertexCommandRegistrar` | chunks.183.mjs:514 | function |
| `_lK` | `setupVertexLazyModule` | chunks.183.mjs:463 | object |
| `zlK` | `initSetupVertexModule` | chunks.183.mjs:504 | function |
| `dQY` | `renderSetupVertexEntry` | chunks.183.mjs:465-468 | function |
| `cQY` | `renderSetupVertexWizard` | chunks.183.mjs:471-498 | function |
| `mF8` | `setupVertexWizardComponent` | chunks.183.mjs | component |

## Module: Slash Commands — `/agents` tabbed (v2.1.98)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `qiY` | `agentsCommandDef` | chunks.187.mjs:2896-2903 | object |
| `BoK` | `agentsCommandExport` | chunks.187.mjs:2902 | object |
| `poK` | `agentsCommandRegistrar` | chunks.187.mjs:2896 | function |
| `moK` | `initAgentsModule` | chunks.187.mjs (load:) | function |
| `uoK` | `agentsLazyModule` | chunks.187.mjs (load:) | object |
| `KiY` | `renderAgentsEntry` | chunks.187.mjs:2907-2912 | function |
| `VFK` | `agentsTabbedComponent` (Running + Library tabs) | chunks (referenced from KiY) | component |
| `goK` | `initAgentsTabbedComponent` | chunks.187.mjs:2916-2919 | function |

## Module: Slash Commands — `/btw` (fix v2.1.101)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `wyY` | `btwCommandDef` | chunks.166.mjs:2982-2991 | object |
| `dbK` | `btwCommandExport` | chunks.166.mjs:2990 | object |
| `cbK` | `btwCommandRegistrar` | chunks.166.mjs:2982 | function |
| `QbK` | `initBtwModule` | chunks.166.mjs:2955 | function |
| `UbK` | `btwLazyModule` | chunks.166.mjs:2693 | object |

## Module: Slash Commands — `/insights` (fix v2.1.101)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `csY` | `insightsCommandDef` (chunks.190 form) | chunks.190.mjs:2218 | object |
| `rsY` | `insightsCommandDef` (chunks.191 form, used in main slash registry XH7) | chunks.191.mjs:303-316 | object |
| `qeK` | `generateInsightsReport` | chunks.190.mjs:1772 | function |
| `KeK` | `buildInsightsPromptBody` | chunks.190.mjs:1920 | function |
| `YeK` | `initInsightsLazyModule` | chunks.191.mjs:312 | function |
| `zeK` | `insightsLazyModuleHandle` | chunks.191.mjs:312 | object |
| `usY` | `INSIGHTS_SATISFACTION_LEVELS` | chunks.190.mjs:2217 | constant |
| `msY` | `INSIGHTS_GOAL_ACHIEVEMENT_LEVELS` | chunks.190.mjs:2217 | constant |

## Module: Slash Commands — `/effort` interactive slider (v2.1.111)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `YtK` | `effortCommandDef` | chunks.189.mjs:1432-1444 | object |
| `AtK` | `effortCommandRegistrar` | chunks.189.mjs:1432 | function |
| `ztK` | `initEffortModule` | chunks.189.mjs (load:) | function |
| `_tK` | `effortLazyModule` | chunks.189.mjs (load:) | object |
| `Ko8` | `effortDependenciesRegistrar` | chunks.189.mjs:1433 | function |
| `Pu6` | `effortImmediateFlag` (getter for `immediate`) | chunks.189.mjs:1440 | function |
| `bt6` | `modelSupportsXhigh` | chunks.80.mjs (referenced from effort module) | function |

## Module: Slash Commands — `/less-permission-prompts` (v2.1.111)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `p25` | `lessPermissionPromptsRegistrar` | chunks.211.mjs:1401-1419 | function |
| `WjA` | `LESS_PERMISSION_PROMPTS_BODY` (full skill prompt text) | chunks.211.mjs:1421 | constant |
| `F25` | `lessPermissionPromptsRegistrarInit` | chunks.211.mjs:1422-1425 | function |
| `MA` | `registerBuiltinSkill` (skill registration helper) | chunks.211.mjs / 212.mjs (shared) | function |

## Module: Slash Commands — `/buddy` (seasonal v2.1.89, not in 2.1.112 build)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (none) | `buddyCommand` | not compiled into 2.1.112 build | (absent) |

Source-side only: gated by `feature('BUDDY')` at `src/commands.ts:118-124`, code at `src/buddy/companion.ts`, `src/buddy/CompanionSprite.tsx`, `src/buddy/prompt.ts`, `src/commands/buddy/index.js`.

## Module: Slash Commands — Slash registry (shared across all commands)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `fbj` | `BUILTIN_SLASH_COMMAND_PROMPTS_ARRAY` (prompt-type built-ins) | chunks.191.mjs:316 | array |
| `XH7` | `MAIN_SLASH_COMMAND_REGISTRY` (all built-in slash commands, lazy) | chunks.191.mjs:316 | function |
| `UF` | `SLASH_COMMAND_NAME_SET` (name + alias set for lookup) | chunks.191.mjs:316 | function |
| `MH7` | `DISABLE_MODEL_INVOCATION_SET` (commands the model cannot auto-invoke) | chunks.191.mjs:334 | constant |
| `TeK` | `HIDDEN_OR_SPECIAL_COMMAND_SET` | chunks.191.mjs:334 | constant |
| `veK` | `loadAllSlashCommands` (skills + plugins + builtins, lazy) | chunks.191.mjs:317-325 | function |
| `Ty` | `getEnabledSlashCommands` | chunks.191.mjs:326-328 | function |
| `pH6` | `getModelInvocableUserSkills` | chunks.191.mjs:328-334 | function |
