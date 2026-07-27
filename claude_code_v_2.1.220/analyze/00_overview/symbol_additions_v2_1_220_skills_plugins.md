# Symbol additions — v2.1.220, theme `skills_plugins`

Staged for merge. Every row's `File:Line` was read in
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js` during the module pass.
`File:Line` is always `cli_inner_pretty.js:<line>` unless tagged `(193)`.

Source documents:
[`../45_skills/README.md`](../45_skills/README.md) ·
[`../45_skills/skill_context_fork_background.md`](../45_skills/skill_context_fork_background.md) ·
[`../45_skills/skill_loading_and_stacking.md`](../45_skills/skill_loading_and_stacking.md) ·
[`../45_skills/plugin_config_and_security.md`](../45_skills/plugin_config_and_security.md)

> **Re-mangling warning.** Three identifiers in this file are re-used in 2.1.193 for unrelated
> declarations. Never import a 2.1.193 name:
> - `lor` — 220: `referencesUserConfig` (`:214417`). **193: a git-progress line filter** (`:591395 (193)`).
> - `qde` — 220: `coerceFrontmatterBoolean` (`:158204`). 193 has 6 hits on this name, none related.
> - `Lr` — 220: the base `ClaudeError` class (`:19800`). 193 used `Lr` for the merged-settings accessor
>   (`:58428 (193)`, the function 220 calls `eo`).

---

## Module: Skills

> Merge into `symbol_index_core_features.md`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Ig` | quoteLossyFrontmatterValues | cli_inner_pretty.js:158018 | function |
| `$hy` | validateAgentFrontmatterName | cli_inner_pretty.js:269867 | function |
| `$on` | buildScopedSkillVariantNote | cli_inner_pretty.js:340684 | function |
| `BIg` | expandBracePatterns | cli_inner_pretty.js:158159 | function |
| `Cdd` | buildTaskNotificationBlock | cli_inner_pretty.js:342123 | function |
| `CBe` | ARTIFACT_DESIGN_SKILL_ID (`"artifact-design"`) | cli_inner_pretty.js:318657 | constant |
| `DIg` | CANONICAL_FRONTMATTER_KEYS (58 entries) | cli_inner_pretty.js:157899 | constant |
| `Ddd` | FORK_SCOPING_MAX_BYTES (524288) | cli_inner_pretty.js:342387 | constant |
| `EJi` | detectInlineHashHazard | cli_inner_pretty.js:158059 | function |
| `F6S` | buildDatavizCalloutForArtifactDesign | cli_inner_pretty.js:772270 | function |
| `FIg` | MAX_EXPANSION_BYTES (4194304) | cli_inner_pretty.js:158228 | constant |
| `FP` | looseScalarField (alias of `_Ji`) | cli_inner_pretty.js:157737 | variable |
| `FTo` | forkedSkillScopingSchema | cli_inner_pretty.js:342113 | object |
| `Hst` | looseScalarOrStringArrayField | cli_inner_pretty.js:157727 | variable |
| `HIg` | baseCommandFrontmatterShadowSchema | cli_inner_pretty.js:157739 | object |
| `IIg` | agentFrontmatterShadowSchema | cli_inner_pretty.js:157828 | object |
| `IY` | normalizeFrontmatterDescription | cli_inner_pretty.js:158190 | function |
| `Ist` | looseScalarField (alias of `_Ji`) | cli_inner_pretty.js:157738 | variable |
| `JWu` | loadAgentFromMarkdown | cli_inner_pretty.js:269945 | function |
| `LIg` | STRICT_SHADOW_SCHEMAS (`skill`/`agent`/`output-style`) | cli_inner_pretty.js:157886 | object |
| `Lp` | parseFrontmatter | cli_inner_pretty.js:158070 | function |
| `MIg` | YAML_NEEDS_QUOTING_RE | cli_inner_pretty.js:158236 | constant |
| `Mse` | VERIFY_SKILL_ID (`"verify"`) | cli_inner_pretty.js:318664 | constant |
| `NIg` | MAX_EXPANDED_PATTERNS (1000) | cli_inner_pretty.js:158227 | constant |
| `OIg` | quoteYamlScalarsFallback | cli_inner_pretty.js:157984 | function |
| `Oom` | registerDatavizSkill | cli_inner_pretty.js:777520 | function |
| `PIg` | SLASH_ONLY_FRONTMATTER_KEYS | cli_inner_pretty.js:157962 | constant |
| `Pse` | ARTIFACT_CAPABILITIES_SKILL_ID (`"artifact-capabilities"`) | cli_inner_pretty.js:318658 | constant |
| `RAo` | resolveSkillExecutionContext | cli_inner_pretty.js:326547 | function |
| `RIg` | outputStyleFrontmatterShadowSchema | cli_inner_pretty.js:157870 | object |
| `Rst` | FRONTMATTER_MAX_LINES (30) | cli_inner_pretty.js:158223 | constant |
| `S0o` | findPriorSkillContent | cli_inner_pretty.js:346523 | function |
| `Sd` | userFacingCommandName | cli_inner_pretty.js:326533 | function |
| `Tdd` | TASK_NOTIFICATION_DESC_MAX (4096) | cli_inner_pretty.js:342147 | constant |
| `VTo` | spawnForkedSkillAsBackgroundAgent | cli_inner_pretty.js:342400 | function |
| `Yt` | parseTruthyToken (carryover; `:1938 (193)`) | cli_inner_pretty.js:1950 | function |
| `ZNy` | elideDuplicateSkillInvocation | cli_inner_pretty.js:346748 | function |
| `Zno` | expandPathsFrontmatter | cli_inner_pretty.js:158136 | function |
| `aNy` | dispatchForkedSlashCommand | cli_inner_pretty.js:343059 | function |
| `bJi` | skillFrontmatterShadowSchema | cli_inner_pretty.js:157776 | object |
| `bru` | splitAndExpandPatternList | cli_inner_pretty.js:158139 | function |
| `bvo` | DATAVIZ_SKILL_ID (`"dataviz"`) | cli_inner_pretty.js:318659 | constant |
| `c8S` | DATAVIZ_SKILL_FILES (9 bundled files) | cli_inner_pretty.js:777505 | object |
| `cNy` | dispatchSlashCommandByType | cli_inner_pretty.js:343504 | function |
| `dRt` | FRONTMATTER_MAX_BYTES (65536) | cli_inner_pretty.js:158224 | constant |
| `efo` | classifyMemoryPinnedState (absent/malformed/true/false) | cli_inner_pretty.js:235443 | function |
| `eoo` | parsePositiveIntegerField | cli_inner_pretty.js:158184 | function |
| `epd` | MAX_STACKED_COMMANDS (5) | cli_inner_pretty.js:344087 | constant |
| `eRs` | metaMessageText | cli_inner_pretty.js:346513 | function |
| `fny` | readClaudeMdPathsFrontmatter | cli_inner_pretty.js:235627 | function |
| `gV` | parseYaml (`Bun.YAML.parse`) | cli_inner_pretty.js:157974 | function |
| `gru` | canonicalizeFrontmatterKey | cli_inner_pretty.js:157893 | function |
| `hru` | emitFrontmatterProbeOnce | cli_inner_pretty.js:157707 | function |
| `iOA` | CANONICAL_KEY_BY_NORMALIZED_NAME | cli_inner_pretty.js:157961 | constant |
| `iin` | COMPACTION_TRUNCATION_MARKER | cli_inner_pretty.js:346536 | constant |
| `jFs` | buildSkillMetadataFromFrontmatter | cli_inner_pretty.js:438444 | function |
| `jrm` | registerArtifactDesignSkill | cli_inner_pretty.js:772278 | function |
| `lNy` | processSlashCommand (exported name, `:343015`) | cli_inner_pretty.js:343268 | function |
| `mru` | FRONTMATTER_PROBE_SEEN | cli_inner_pretty.js:157891 | variable |
| `ntr` | stringifyYaml | cli_inner_pretty.js:157977 | function |
| `otr` | coerceFrontmatterBooleanDefaultFalse | cli_inner_pretty.js:158201 | function |
| `pRt` | FRONTMATTER_STRICT_FENCE_RE | cli_inner_pretty.js:158237 | constant |
| `qde` | coerceFrontmatterBoolean | cli_inner_pretty.js:158204 | function |
| `qTo` | resolveForkBackgroundMode | cli_inner_pretty.js:342396 | function |
| `roo` | validateShellFrontmatterValue | cli_inner_pretty.js:158212 | function |
| `rpd` | formatSkillLoadingMetadata (exported name, `:343020`) | cli_inner_pretty.js:343872 | function |
| `sOA` | SLASH_ONLY_KEYS_NORMALIZED | cli_inner_pretty.js:157972 | constant |
| `sn_` | readSkillPathsFrontmatter | cli_inner_pretty.js:438436 | function |
| `su` | parseFalsyToken (carryover; `:1944 (193)`) | cli_inner_pretty.js:1956 | function |
| `tcn` | buildSkillPromptCommand | cli_inner_pretty.js:438492 | function |
| `too` | collectDeclaredFrontmatterFields | cli_inner_pretty.js:158197 | function |
| `tpd` | peelStackedPromptCommands (exported name, `:343017`) | cli_inner_pretty.js:343833 | function |
| `uRt` | reportFrontmatterShadowMismatch | cli_inner_pretty.js:157712 | function |
| `vJi` | asPlainObjectOrEmpty | cli_inner_pretty.js:158132 | function |
| `vct` | substituteCommandArguments | cli_inner_pretty.js:237706 | function |
| `w9` | isSkillOverriddenOff | cli_inner_pretty.js:326365 | function |
| `wZ` | FRONTMATTER_FENCE_RE | cli_inner_pretty.js:158237 | constant |
| `xfo` | SUBSTITUTION_SENTINEL (`"￿"`) | cli_inner_pretty.js:237746 | constant |
| `yk` | isCommandEnabled | cli_inner_pretty.js:326536 | function |
| `yru` | describeEmptyFrontmatterHazard | cli_inner_pretty.js:158127 | function |
| `_Ji` | looseScalarUnion (string\|number\|boolean\|null) | cli_inner_pretty.js:157724 | variable |
| `_ru` | VALID_SHELL_VALUES (`["bash","powershell"]`) | cli_inner_pretty.js:158238 | constant |

### Telemetry / gates (Skills)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `"tengu_frontmatter_shadow_mismatch"` | frontmatter shadow-schema field mismatch | cli_inner_pretty.js:157720 | constant |
| `"tengu_frontmatter_shadow_unknown_key"` | frontmatter shadow-schema unknown key | cli_inner_pretty.js:157717 | constant |
| `"tengu_skill_scoped_variant_note"` | directory-scoped skill variant note emitted | cli_inner_pretty.js:340696 | constant |
| `"tengu_slash_command_forked"` | forked slash-command dispatch | cli_inner_pretty.js:343069 | constant |
| `"tengu_stacked_slash_commands"` | stacked slash-skill expansion (`stacked_count`) | cli_inner_pretty.js:343685 | constant |
| `"forked_skill_depth_cap"` | background fork refused: over spawn depth | cli_inner_pretty.js:342439 | constant |
| `"forked_skill_depth_chain_cap"` | background fork refused: depth + spawn cap (throws) | cli_inner_pretty.js:342433 | constant |
| `"forked_skill_live_duplicate"` | background fork refused: same skill already live | cli_inner_pretty.js:342426 | constant |
| `"forked_skill_scoping_unpersistable"` | background fork refused: scoping record invalid | cli_inner_pretty.js:342449 | constant |
| `"forked_skill_scoping_write_failed"` | background fork refused: scoping write failed | cli_inner_pretty.js:342453 | constant |
| `"forked_skill_spawn_cap"` | background fork refused: session spawn cap | cli_inner_pretty.js:342442 | constant |

---

## Module: Plugins

> Merge into `symbol_index_infra_integration.md`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Eke` | pluginOptionsStorageKey | cli_inner_pretty.js:214313 | function |
| `Fbs` | renameReplacingLockedTarget | cli_inner_pretty.js:278485 | function |
| `Ggy` | syncInstalledPluginsFromSettings | cli_inner_pretty.js:277771 | function |
| `Jue` | pluginIdSchema | cli_inner_pretty.js:59999 | object |
| `NW` | readPluginOptions (memoised) | cli_inner_pretty.js:214446 | variable |
| `Xbe` | substitutePluginPathVars | cli_inner_pretty.js:214398 | function |
| `YI` | isPluginDisabledByPolicy | cli_inner_pretty.js:237995 | function |
| `Yzr` | readTrustedPluginConfig | cli_inner_pretty.js:191064 | function |
| `a5g` | PLUGIN_CONFIG_SCOPES (`user`/`flag`/`policy`) | cli_inner_pretty.js:191083 | constant |
| `fyy` | pickExistingPluginInstallRecord | cli_inner_pretty.js:279585 | function |
| `g7` | expandEnvVarReferences | cli_inner_pretty.js:267981 | function |
| `hCu` | applyLspDisuseGraceOnce | cli_inner_pretty.js:214904 | function |
| `hEe` | isLocalSettingsRepoTracked (`{onIndeterminate}`) | cli_inner_pretty.js:535971 | function |
| `jue` | RENAME_RETRY_CODES (`EXDEV`/`EPERM`/`EEXIST`/`EBUSY`) — carryover, `SBe :46613 (193)` | cli_inner_pretty.js:49993 | constant |
| `lor` | referencesUserConfig — **193's `lor` is unrelated** | cli_inner_pretty.js:214417 | function |
| `mCu` | touchPluginUsage | cli_inner_pretty.js:214890 | function |
| `muo` | substituteUserConfigForSkillContent (carryover, `nOn :279580 (193)`) | cli_inner_pretty.js:214424 | function |
| `nUS` | resolvePluginMonitor | cli_inner_pretty.js:764143 | function |
| `n_o` | findInstalledPluginDir | cli_inner_pretty.js:279599 | function |
| `nyy` | placePluginBinaryAsset | cli_inner_pretty.js:278435 | function |
| `oUS` | resolveAllPluginMonitors | cli_inner_pretty.js:764163 | function |
| `o_o` | findInstalledPluginDirUnknownVersion | cli_inner_pretty.js:279608 | function |
| `q2o` | buildAndRunHookCommand (the `.207` refusal at `:519965`) | cli_inner_pretty.js:519921 | function |
| `rSe` | describeHookCommandForError | cli_inner_pretty.js:215859 | function |
| `sDt` | substituteUserConfig (carryover, `ibe :279570 (193)`) | cli_inner_pretty.js:214407 | function |
| `TYr` | computeDisuseAges | cli_inner_pretty.js:214921 | function |
| `WCr` | readTipLifetimeShownCount | cli_inner_pretty.js:675592 | function |
| `yaf` | readPluginSuggestionShownCount | cli_inner_pretty.js:675595 | function |
| `_Cu` | computePluginDisuse | cli_inner_pretty.js:215055 | function |
| `"pluginUsageLspGraceAppliedIds"` | one-shot LSP grace ledger key | cli_inner_pretty.js:214905 | constant |
| `"maxLifetimeShows"` | per-tip lifetime impression cap (filter at `:814944`) | cli_inner_pretty.js:815597 | constant |

### Plugin LSP

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `PSo` | collectLspExtensionConflicts | cli_inner_pretty.js:303731 | function |
| `aCy` | resolvePluginLspServerConfig | cli_inner_pretty.js:303710 | function |
| `lCy` | namespacePluginLspServers | cli_inner_pretty.js:303757 | function |
| `zXu` | loadPluginLspServers | cli_inner_pretty.js:303765 | function |
| `KXu` | getAllLspServers | cli_inner_pretty.js:303787 | function |
| `_Qu` | createLspClient (built **before** the extension claim in 220) | cli_inner_pretty.js:307210 (call site) | function |

### Artifact gate family (`tengu_cobalt_plinth_*`)

> Also merge into `symbol_index_infra_integration.md`. Four of these are **220-only** and default to
> `false` — undocumented dark-launched Artifact capabilities.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Abd` | isArtifactSharedScopeListingDisabled (`tengu_cobalt_plinth_osier`, default `!1`, **NEW**) | cli_inner_pretty.js:381697 | function |
| `C5y` | isArtifactPutGuardEnabled (`tengu_cobalt_plinth_putguard`, default `!0`, carryover) | cli_inner_pretty.js:381712 | function |
| `T5y` | isArtifactReaderPersistEnabled (`tengu_cobalt_plinth_reader_persist`, carryover) | cli_inner_pretty.js:381706 | function |
| `cPs` | isArtifactPublicReadEnabled (`tengu_cobalt_plinth_sedge`, default `!1`, **NEW**) | cli_inner_pretty.js:381703 | function |
| `csn` | isArtifactToolEnabled (`tengu_cobalt_plinth_fern`, default `!0`, carryover) | cli_inner_pretty.js:381688 | function |
| `cxo` | isArtifactMultiFilePublishEnabled (`tengu_cobalt_plinth_bracken`, default `!1`, **NEW**) | cli_inner_pretty.js:381700 | function |
| `dsn` | isSlateLanternEnabled (`tengu_slate_lantern`) | cli_inner_pretty.js:381709 | function |
| `lPs` | isArtifactLangParamEnabled (`tengu_cobalt_plinth_laurel`, default `!1`, **NEW**) | cli_inner_pretty.js:381694 | function |
| `usn` | isSaffronAnchorEnabled (`tengu_saffron_anchor`) | cli_inner_pretty.js:381692 | function |
| `wbd` | isFramePublishContextEnabled (`tengu_frame_publish_context`) | cli_inner_pretty.js:381715 | function |
| `"tengu_cobalt_plinth_dataviz"` | gates the dataviz callout injected into `artifact-design` | cli_inner_pretty.js:772274 | constant |

---

## Cross-module symbols confirmed but owned elsewhere

Listed for lookup only; the owning module should keep the authoritative row.

| Obfuscated | Readable | File:Line | Owner |
|------------|----------|-----------|-------|
| `C8` | FILE_SETTING_SCOPES (`user`/`project`/`local`) | cli_inner_pretty.js:57679 | 38_permissions |
| `H3r` | AUTO_MODE_TRUSTED_SCOPES (same 3-element literal) | cli_inner_pretty.js:63681 | 38_permissions |
| `LE` | isBackgroundTasksDisabled (`CLAUDE_CODE_DISABLE_BACKGROUND_TASKS`) | cli_inner_pretty.js:230330 | 36_background_agents |
| `Pr` | readSettingsScope | cli_inner_pretty.js:63153 | 38_permissions |
| `V$` | SETTING_SCOPES (5-element ordered list) | cli_inner_pretty.js:57678 | 38_permissions |
| `eo` | readEffectiveSettings (193 called this `Lr`, `:58428 (193)`) | cli_inner_pretty.js:63161 | 38_permissions |
| `hee` | getMaxSubagentSpawnDepth | cli_inner_pretty.js:230896 | 53_subagent_limits |
| `wT` | getAllowedSettingSources | cli_inner_pretty.js:57664 | 38_permissions |
| `yn` | isNonInteractiveSession | cli_inner_pretty.js:3286 | 51_headless_sdk |
| `Lr` (class) | ClaudeError | cli_inner_pretty.js:19800 | 57_api_reliability |
