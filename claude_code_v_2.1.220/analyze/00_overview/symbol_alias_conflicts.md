# Symbol alias conflicts — the same obfuscated id, named two ways

**155 obfuscated identifiers** were given **different readable names** by different theme
analysts, and **59** carry differing `File:Line` values. This file is the register of those
disagreements. It is generated mechanically from the four `symbol_index_*.md` files.

> **Why this is not silently deduplicated.** Each name was chosen by an analyst who had read the
> function in context for a specific theme. Picking a winner without re-reading the site would
> destroy information and could enshrine the wrong name. Where the two names are synonyms
> (`cacheWriteCost` / `computeCacheWriteCostUsd`) either is usable. Where they are **semantically
> different** — `Cze` as `evaluateHookIfCondition` vs `matchesPathRule`, `$hy` as
> `explainAgentFrontmatterError` vs `validateAgentFrontmatterName` — **at most one can be right**, and
> the site must be re-read before either is trusted.

> A differing `File:Line` for one id is a stronger signal: either the id is reused (see
> [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §4 trap 1) or one citation is wrong.

---

## 1. Differing readable names

| Obfuscated | Names given | Where |
|------------|-------------|-------|
| `$Ig` | `quoteLossyFrontmatterValues` **vs** `requoteLossyScalars` | core_features/Auto memory — frontmatter pars; core_features/Skills |
| `$hy` | `explainAgentFrontmatterError` **vs** `validateAgentFrontmatterName` | core_features/Agent Team — Leader-facing UI ; core_features/Skills |
| `$ig` | `cacheWriteCost` **vs** `computeCacheWriteCostUsd` | infra_platform/Model Pricing; infra_platform/Telemetry - cost and usage met |
| `AEy` | `BROWSER_CONTROL_SERVER_NAMES` **vs** `HOST_SURFACE_SERVERS` | infra_integration/Host surfaces (Desktop, Cowork; infra_platform/MCP Reserved Names and Permiss |
| `BIg` | `expandBracePatterns` **vs** `expandBracePatternsWithBudget` | core_features/Auto memory — frontmatter pars; core_features/Skills |
| `Cdd` | `buildBackgroundAgentFollowUpBlock` **vs** `buildTaskNotificationBlock` | core_features/Code Review — command dispatch; core_features/Skills |
| `Cv` | `lookupCommandByName` **vs** `resolveCommandByName` | infra_integration/Slash Commands — registry and ; infra_integration/Slash Commands — schema fields |
| `Cze` | `evaluateHookIfCondition` **vs** `matchesPathRule [export-table]` | core_features/Hooks — shared helpers referen; infra_platform/Permissions — rule matching an |
| `D5r` | `buildWorkflowOtelAttributes` **vs** `buildWorkflowOtelAttrs` | infra_platform/Telemetry - OTel event emissio; infra_platform/Telemetry — workflow provenanc |
| `Dig` | `COSTS_TIER_5_25` **vs** `STANDARD_OPUS_RATES` | infra_platform/Model Pricing; infra_platform/Telemetry - cost and usage met |
| `Dky` | `GIT_TREE_REDIRECT_FLAGS` **vs** `GIT_WORKTREE_FLAGS` | infra_platform/Sandbox — worktree path contai; infra_platform/Worktree Isolation Containment |
| `EJi` | `detectInlineHashHazard` **vs** `recordUnprovableInlineHash` | core_features/Auto memory — frontmatter pars; core_features/Skills |
| `EUp` | `layoutMarkdownTable` **vs** `renderMarkdownTable` | infra_integration/Terminal Rendering and Mode Ow; infra_integration/UI components — markdown table |
| `Ede` | `getCustomModelCapabilityOverride` **vs** `getEnvDeclaredCapability` | infra_platform/Model Capabilities; infra_platform/Model Selection |
| `FIg` | `BRACE_EXPANSION_BYTE_BUDGET` **vs** `MAX_EXPANSION_BYTES` | core_features/Auto memory — frontmatter pars; core_features/Skills |
| `Fyp` | `applyLeftArrowGesture` **vs** `applyLeftArrowTransition` **vs** `commitLeftArrowAction` | infra_integration/Accessibility/UI — left-arrow ; infra_integration/Prompt Input and Vim Mode; infra_integration/UI — left-arrow gesture, agent |
| `GIc` | `catalogPricingToModelCosts` **vs** `tierToModelCosts` | infra_platform/Model Pricing; infra_platform/Telemetry - cost and usage met |
| `GV_` | `ATTACH_CONFIRM_MIN_MS` **vs** `MIN_CONFIRM_GAP_MS` | infra_integration/Accessibility/UI — left-arrow ; infra_integration/Prompt Input and Vim Mode; infra_integration/UI — left-arrow gesture, agent |
| `Gcs` | `CERT_ERROR_CODES` **vs** `TLS_CERT_ERROR_CODES` | core_execution/LLM API — transport error taxo; infra_platform/Transport / mTLS / Proxy |
| `H3r` | `AUTO_MODE_TRUSTED_SCOPES` **vs** `AUTO_MODE_TRUSTED_SOURCES` | infra_integration/Plugins; infra_platform/Permissions — auto mode availa |
| `H4` | `isSandboxableBashInput` **vs** `shouldRunUnderSandbox` | core_features/Plan Mode — permission-pipelin; infra_platform/Sandbox — command exclusion an |
| `H7y` | `foldBlockedPostTurnSummaryToNeedInput` **vs** `remapBlockedPostTurnSummary` | infra_integration/Remote Control — Session state; infra_platform/Telemetry - Cloud gateway mete |
| `Hcs` | `applyScheduledTaskPrefix` **vs** `prefixScheduledPromptBanner` **vs** `prefixScheduledTaskBanner` | core_features/Background Agents — Notificati; core_features/Scheduled-Task Prompt Banner (; core_features/Steering / Message Provenance |
| `Hn` | `getAPIProvider` **vs** `getProviderChannel` | infra_platform/Auth Core; infra_platform/Model Selection (Explore inher; infra_platform/Provider Resolution |
| `Hxm` | `hasStoppableRunningTasks` **vs** `shouldHoldResultForRunningTasks` | core_features/set_cwd Control Request; infra_integration/Host surfaces (Desktop, Cowork |
| `Ixm` | `shouldMarkIdleWhileWaiting` **vs** `shouldReportSessionRunning` | core_features/set_cwd Control Request; infra_integration/Host surfaces (Desktop, Cowork |
| `JBe` | `isOneShotExecJob` **vs** `isPlainExecTemplate` | core_features/Background Agents — Job / Sess; core_features/Background Agents — Roster row |
| `JWu` | `loadAgentFromMarkdown` **vs** `parseAgentMarkdownFile` | core_features/Agent Team — Leader-facing UI ; core_features/Skills |
| `K9u` | `PREVIEW_SERVERS` **vs** `RESERVED_DESKTOP_PANE_NAMES` | infra_integration/Host surfaces (Desktop, Cowork; infra_platform/MCP Reserved Names and Permiss |
| `KU_` | `RETRY_SLEEP_CHUNK_MS` **vs** `RETRY_SLEEP_SLICE_MS` | core_execution/LLM API — request retry loop; core_features/Agent Team — Teammate lifecycl |
| `Ke` | `getFeatureValue` **vs** `getFeatureValue_CACHED_MAY_BE_STALE` | infra_platform/Telemetry - GrowthBook feature; infra_platform/Telemetry helpers used by the  |
| `Kep` | `AGENT_AND_WORKFLOW_RESTRAINT_CLAUSE` **vs** `AGENT_TOOL_RESTRAINT_LINES` | core_execution/System Prompts; core_features/Code Review — system-prompt re |
| `Kkt` | `costForTokenUsage` **vs** `priceUsageFromCounters` | infra_platform/Model Pricing; infra_platform/Telemetry - cost and usage met |
| `Lji` | `computeCostFromUsage` **vs** `computeCostUsd` | infra_platform/Model Pricing; infra_platform/Telemetry - cost and usage met |
| `Lky` | `GIT_PATH_FLAGS` **vs** `GIT_VALUE_FLAGS` | infra_platform/Sandbox — worktree path contai; infra_platform/Worktree Isolation Containment |
| `Lpn` | `spawnForkFromDirective` **vs** `spawnForkSubagent` | infra_integration/Slash Commands — `/fork` and `; infra_integration/Slash Commands — `/fork`, `/su |
| `Ltu` | `installAuthedRemoteEvalHook` **vs** `installEvalAuthedOverride` | infra_platform/Feature Gates (auth-coupled); infra_platform/Telemetry - GrowthBook feature |
| `Mig` | `isCatalogModelId` **vs** `isKnownCatalogueId` | infra_platform/Model Pricing; infra_platform/Telemetry - cost and usage met |
| `Mse` | `VERIFY_SKILL_ID` **vs** `VERIFY_SKILL_NAME` | core_features/Code Review — slash-command su; core_features/Skills |
| `NIg` | `BRACE_EXPANSION_RESULT_BUDGET` **vs** `MAX_EXPANDED_PATTERNS` | core_features/Auto memory — frontmatter pars; core_features/Skills |
| `NN` | `normalizeMessagesForApi` **vs** `normalizeMessagesForWire` | core_execution/Agent Loop / LLM API; core_execution/Core execution — message norma |
| `N_r` | `collectRulesFromSources` **vs** `flattenRules` | infra_platform/Permissions — rule matching an; infra_platform/Permissions — rule matching co |
| `Nno` | `refreshFeatureFlagsPeriodically` **vs** `refreshGrowthBookFeatures` | infra_platform/Feature Gates (auth-coupled); infra_platform/Telemetry - GrowthBook feature |
| `Nyp` | `classifyLeftArrowGesture` **vs** `classifyLeftArrowPress` **vs** `resolveLeftArrowAction` | infra_integration/Accessibility/UI — left-arrow ; infra_integration/Prompt Input and Vim Mode; infra_integration/UI — left-arrow gesture, agent |
| `OIg` | `quoteSuspiciousScalars` **vs** `quoteYamlScalarsFallback` | core_features/Auto memory — frontmatter pars; core_features/Skills |
| `Oig` | `buildBakedCostMap` **vs** `buildCatalogueCostTable` | infra_platform/Model Catalogue; infra_platform/Telemetry - cost and usage met |
| `Oyp` | `LEFT_ARROW_ABSORB_MS` **vs** `LEFT_ARROW_REPEAT_MS` **vs** `REPEAT_WINDOW_MS` | infra_integration/Accessibility/UI — left-arrow ; infra_integration/Prompt Input and Vim Mode; infra_integration/UI — left-arrow gesture, agent |
| `QKo` | `INVISIBLE_CHARS_RE` **vs** `UNSAFE_PATH_CHARS_RE` | core_features/set_cwd Control Request; infra_integration/SDK `set_cwd` control request  |
| `QN` | `buildTerminalLink` **vs** `formatHyperlink` | infra_integration/Terminal Rendering and Mode Ow; infra_platform/Auth UI Surfaces |
| `Qcs` | `buildRequestTooLargeAttachmentMessage` **vs** `buildRequestTooLargeMessage` | core_execution/LLM API — context-overflow and; core_features/Compact — request-size and res |
| `Qer` | `resetGrowthBook` **vs** `teardownGrowthBook` | infra_platform/Feature Gates (auth-coupled); infra_platform/Telemetry - GrowthBook feature |
| `Qqs` | `isAutoOrPlanAutoMode` **vs** `isClassifierAdjudicatingMode` | core_features/Plan Mode — mode predicates an; infra_platform/Permissions — classifier adjud |
| `RAo` | `commandExecutionContext` **vs** `resolveCommandContext` **vs** `resolveSkillExecutionContext` | core_features/Code Review — command dispatch; core_features/Skills; infra_integration/Slash Commands — registry and  |
| `Roe` | `costForApiUsage` **vs** `priceUsage` | infra_platform/Model Pricing; infra_platform/Telemetry - cost and usage met |
| `Sd` | `commandDisplayName` **vs** `userFacingCommandName` | core_features/Skills; infra_integration/Slash Commands — registry and ; infra_integration/Slash Commands — schema fields |
| `UIc` | `FAST_MODE_COSTS_OPUS_46_47` **vs** `FAST_RATES_30_150` | infra_platform/Model Pricing; infra_platform/Telemetry - cost and usage met |
| `UXs` | `ARM_BANNER_MS` **vs** `ARM_TTL_MS` **vs** `LEFT_ARROW_FEEDBACK_MS` | infra_integration/Accessibility/UI — left-arrow ; infra_integration/Prompt Input and Vim Mode; infra_integration/UI — left-arrow gesture, agent |
| `UZg` | `SSL_ERROR_CODES` **vs** `TLS_ERROR_CODES_EXTENDED` | core_execution/LLM API — transport error taxo; infra_platform/Transport / mTLS / Proxy |
| `Ucf` | `daemonUnreachableReplyNotice` **vs** `daemonUnreachableText` | core_features/Background Agents — Job Deleti; core_features/Background Agents — Reply deli |
| `Uky` | `isGitRedirectEnvVar` **vs** `isGitRedirectingEnvVar` | infra_platform/Sandbox — worktree path contai; infra_platform/Worktree Isolation Containment |
| `V$` | `SETTINGS_SOURCES` **vs** `SETTING_SCOPES` | infra_integration/Plugins; infra_platform/Sandbox — settings resolution  |
| `VTo` | `launchForkedBackgroundAgent` **vs** `launchForkedSkillAgent` **vs** `spawnForkedSkillAsBackgroundAgent` | core_execution/Agent Tool; core_features/Code Review — command dispatch; core_features/Skills |
| `WB` | `findMatchingDenyRule` **vs** `getDenyRuleForTool` | infra_platform/Permissions — rule matching an; infra_platform/Permissions — rule matching co |
| `WIc` | `formatModelPriceFromCosts` **vs** `formatModelPriceLabel` | infra_platform/Model Pricing; infra_platform/Telemetry - cost and usage met |
| `WU_` | `API_KEY_HELPER_401_LIMIT = 2 → surfaces on the 3rd 401` **vs** `MAX_API_KEY_HELPER_RETRIES` | core_execution/LLM API — request retry loop; infra_platform/API Key Helper |
| `Wie` | `NETWORK_DOWN_CODES` **vs** `UNREACHABLE_CODES` | core_execution/LLM API — transport error taxo; infra_platform/Transport / mTLS / Proxy |
| `XXi` | `growthBookOrgUuidAtInit` **vs** `initialOrgUuid` | infra_platform/Feature Gates (auth-coupled); infra_platform/Telemetry - GrowthBook feature |
| `Xep` | `buildLatestModelIdsSentence` **vs** `buildLatestModelsPromptSection` | core_execution/System Prompts; infra_platform/Model Picker UI |
| `YMi` | `isAutoModeAllowedDuringPlan` **vs** `resolveUseAutoModeDuringPlan` | core_features/Plan Mode — mode predicates an; infra_platform/Permissions — auto mode availa |
| `YXi` | `growthBookAccountUuidAtInit` **vs** `initialAccountUuid` | infra_platform/Feature Gates (auth-coupled); infra_platform/Telemetry - GrowthBook feature |
| `Ydr` | `isBlockedNonExecState` **vs** `isBlockedRespawnableJob` | core_features/Background Agents — Job / Sess; core_features/Background Agents — Roster row |
| `Yse` | `COMPLETED_EVICT_MS` **vs** `TEAMMATE_EVICT_DELAY_MS` | core_features/Agent Team — Teammate lifecycl; core_features/Todo / Tasks — tracker retenti |
| `ZK` | `PROVIDER_DISPLAY_NAMES` **vs** `THIRD_PARTY_PROVIDER_LABELS` | infra_platform/Provider Resolution; infra_platform/Remote Control — Enablement, p |
| `ZU_` | `handleRetryableAuthError` **vs** `refreshAwsAuthAndAllowRetry` | core_execution/LLM API — request retry loop; infra_platform/AWS Credentials |
| `Zdo` | `SCHEDULED_PROMPT_BANNER` **vs** `SCHEDULED_TASK_BANNER` **vs** `SCHEDULED_TASK_PREFIX` | core_features/Background Agents — Notificati; core_features/Scheduled-Task Prompt Banner (; core_features/Steering / Message Provenance |
| `a7n` | `FAST_MODE_COSTS_TIER_10_50` **vs** `FAST_RATES_10_50` | infra_platform/Model Pricing; infra_platform/Telemetry - cost and usage met |
| `aTs` | `GIT_REDIRECT_ENV_VARS` **vs** `GIT_TREE_REDIRECT_ENV_VARS` | infra_platform/Sandbox — worktree path contai; infra_platform/Worktree Isolation Containment |
| `aef` | `replaceIfUnsafePath` **vs** `safeWireMessage` | core_features/set_cwd Control Request; infra_integration/SDK `set_cwd` control request  |
| `bbn` | `MIN_COL_WIDTH` **vs** `MIN_TABLE_COLUMN_WIDTH` | infra_integration/Terminal Rendering and Mode Ow; infra_integration/UI components — markdown table |
| `bft` | `checkRuleBasedPermissions` **vs** `evaluateRulesAndSafetyChecks` | core_features/Plan Mode — permission-pipelin; infra_platform/Permissions — hooks bridge |
| `bpt` | `closestCommandName` **vs** `suggestNearestCommandName` | infra_integration/Slash Commands — registry and ; infra_integration/Slash Commands — schema fields |
| `bqo` | `buildHiddenRowsNotice` **vs** `truncatedRowsNotice` | infra_integration/Terminal Rendering and Mode Ow; infra_integration/UI components — markdown table |
| `bru` | `splitAndExpandPatternList` **vs** `splitAndExpandPatterns` | core_features/Auto memory — frontmatter pars; core_features/Skills |
| `bs` | `startKeepAlive` **vs** `startKeepAlivePump` | core_features/Hooks — `DirectoryAdded` call ; core_features/SDK Control Requests |
| `cIg` | `GROWTHBOOK_REFRESH_INTERVAL_MS` **vs** `getFlagRefreshIntervalMs` | infra_platform/Feature Gates (auth-coupled); infra_platform/Telemetry - GrowthBook feature |
| `dWl` | `PERMISSION_MODE_DESCRIPTORS` **vs** `permissionModeDisplayTable` | infra_platform/Permissions — modes and UI des; infra_platform/Permissions — the `.200` "Manu |
| `dZg` | `SCHEDULED_TASK_BANNER_PREFIX` **vs** `SCHEDULED_TASK_HEADER` | core_features/Background Agents — Notificati; core_features/Scheduled-Task Prompt Banner (; core_features/Steering / Message Provenance |
| `dm` | `isSettledState` **vs** `isTerminalRow` | core_features/Background Agents — Job / Sess; core_features/Background Agents — Roster row |
| `e4_` | `isGoogleAdcLoadFailure` **vs** `isGoogleCredentialMessage` | core_execution/LLM API — request retry loop; infra_platform/AWS Credentials |
| `eOd` | `findCompactAnchorRecord` **vs** `findLastUsageAnchor` | core_execution/Core execution — message norma; infra_platform/Model — token counting |
| `edm` | `emitBackgroundResultSeen` **vs** `emitResultSeenTelemetry` | core_features/Background Agents — Notificati; infra_integration/Remote Control — Client surfac |
| `epd` | `MAX_STACKED_COMMANDS` **vs** `STACKED_COMMAND_CAP` | core_features/Code Review — command dispatch; core_features/Skills |
| `eug` | `CUSTOM_MODEL_ENV_VAR_PAIRS` **vs** `MODEL_CAPABILITY_ENV_PAIRS` | infra_platform/Model Capabilities; infra_platform/Model Selection |
| `f9` | `sanitizeForPrompt` **vs** `sanitizeForRelay` | infra_integration/Terminal Rendering and Mode Ow; infra_platform/MCP Config Validation and Diag |
| `f9m` | `ASSUMED_PIPE_THROUGHPUT_BPS` **vs** `STDOUT_ASSUMED_BYTES_PER_SEC` | core_execution/Core execution — process stdou; core_features/Headless Process IO (stdout dr |
| `fIl` | `bytesWrittenToStdout` **vs** `stdoutBytesQueued` | core_execution/Core execution — process stdou; core_features/Headless Process IO (stdout dr |
| `fL` | `normalizeManualModeAlias` **vs** `normalizePermissionModeAlias` | infra_platform/Permissions — modes and UI des; infra_platform/Permissions — the `.200` "Manu |
| `fg` | `parsePermissionRule` **vs** `parsePermissionRuleString` | core_features/Hooks — shared helpers referen; infra_platform/Permissions — rule matching co |
| `fir` | `buildMediaRemovedMessage` **vs** `buildUnprocessableAttachmentMessage` | core_execution/LLM API — context-overflow and; core_features/Compact — request-size and res |
| `fny` | `readClaudeMdPathsFrontmatter` **vs** `splitFrontmatterAndPaths` | core_features/Auto memory — MEMORY.md index ; core_features/Skills |
| `g7` | `expandEnvPlaceholders` **vs** `expandEnvVarReferences` | infra_integration/Plugins; infra_platform/MCP Managed Policy |
| `gIl` | `getPendingStdoutBytes` **vs** `queuedStdoutBytes` | core_execution/Core execution — process stdou; core_features/Headless Process IO (stdout dr |
| `gV` | `parseYaml` **vs** `yamlParse` | core_features/Auto memory — frontmatter pars; core_features/Skills |
| `gap` | `sanitizeGitignoreSigils` **vs** `sanitizePattern` | core_features/Hooks — shared helpers referen; infra_platform/Permissions — rule matching an |
| `gkg` | `HOST_SURFACE_NAME_SET` **vs** `NORMALISED_RESERVED_SERVER_NAMES` | infra_integration/Host surfaces (Desktop, Cowork; infra_platform/MCP Reserved Names and Permiss |
| `gnn` | `isAutoModePermissionSurface` **vs** `isClassifierAdjudicating` | core_features/Plan Mode — mode predicates an; infra_platform/Permissions — classifier adjud |
| `gu` | `canonicalGitRootLookup` **vs** `findCanonicalGitRoot [export-table]` | core_features/Hooks — shared helpers referen; infra_platform/Permissions — settings scopes  |
| `ied` | `worktreeCwdEscapeRefusal` **vs** `worktreeEscapeMessage` | infra_platform/Sandbox — worktree path contai; infra_platform/Worktree Isolation Containment |
| `jIc` | `formatCatalogPriceLabel` **vs** `formatCataloguePriceForModel` | infra_platform/Model Pricing; infra_platform/Telemetry - cost and usage met |
| `kL` | `isScreenReaderMode` **vs** `isScreenReaderModeEnabled` | infra_integration/Accessibility / Screen Reader; infra_integration/UI — left-arrow gesture, agent |
| `kNt` | `applyOriginBanner` **vs** `frameMidTurnMessage` | core_features/Background Agents — Notificati; core_features/Steering / Message Provenance |
| `kcs` | `applySystemNotificationPrefix` **vs** `prefixSystemNotificationBanner` | core_features/Background Agents — Notificati; core_features/Steering / Message Provenance |
| `l7n` | `DEFAULT_MODEL_COSTS` **vs** `UNKNOWN_MODEL_COSTS` | infra_platform/Model Pricing; infra_platform/Telemetry - cost and usage met |
| `led` | `isNetworkOrDeviceShapedPath` **vs** `isUnsafePathShape` | infra_platform/Sandbox — worktree path contai; infra_platform/Worktree Isolation Containment |
| `lor` | `referencesUserConfig` **vs** `wouldSubstituteUserConfig` | core_features/Hooks — trust and origin; infra_integration/Plugins |
| `m9m` | `DRAIN_BUDGET_CEILING_MS` **vs** `STDOUT_MAX_DRAIN_MS` | core_execution/Core execution — process stdou; core_features/Headless Process IO (stdout dr |
| `mIl` | `bytesFlushedToStdout` **vs** `stdoutBytesFlushed` | core_execution/Core execution — process stdou; core_features/Headless Process IO (stdout dr |
| `mJd` | `FORK_COMMAND_DESCRIPTOR` **vs** `forkCommandDescriptor` | infra_integration/Slash Commands — `/fork` and `; infra_integration/Slash Commands — `/fork`, `/su |
| `m_` | `collapseControlChars` **vs** `scrubControlChars` | core_features/Hooks — trust and origin; infra_integration/Terminal Rendering and Mode Ow |
| `mk` | `detectHyperlinkSupport` **vs** `supportsHyperlinks` | infra_integration/Terminal Rendering and Mode Ow; infra_platform/Auth UI Surfaces |
| `n7t` | `isSettingsEnvVarAllowed` **vs** `isSettingsSourcedEnvVarAllowed` | infra_platform/MCP Managed Policy; infra_platform/Settings / Env Plumbing |
| `nBe` | `NULL_TASK_REGISTRY` **vs** `nullTaskRegistry` | core_execution/Subagent Orchestration Limits; infra_platform/MCP Auto-Backgrounding |
| `nZ` | `buildWorkflowAnalyticsContext` **vs** `buildWorkflowEventFields` | infra_platform/Telemetry - OTel event emissio; infra_platform/Telemetry — workflow provenanc |
| `ntr` | `stringifyYaml` **vs** `yamlStringify` | core_features/Auto memory — frontmatter pars; core_features/Skills |
| `nve` | `filterDeniedTools` **vs** `filterToolsByDenyRules` | core_execution/Core execution — tool pool ass; infra_platform/Permissions — rule matching an |
| `oD` | `outcomeOf` **vs** `stateToOutcome` | core_features/Background Agents — Job / Sess; core_features/Background Agents — Roster row |
| `out` | `explicitHyperlinkPreference` **vs** `getHyperlinkOverride` | infra_integration/Terminal Rendering and Mode Ow; infra_platform/Auth UI Surfaces |
| `p9m` | `awaitExternalDrainClock` **vs** `externalClockGrace` | core_execution/Core execution — process stdou; core_features/Headless Process IO (stdout dr |
| `pIl` | `anythingWasWrittenToStdout` **vs** `everWroteToStdout` | core_execution/Core execution — process stdou; core_features/Headless Process IO (stdout dr |
| `pRt` | `FRONTMATTER_STRICT_FENCE_RE` **vs** `STRICT_FRONTMATTER_RE` | core_features/Auto memory — frontmatter pars; core_features/Skills |
| `pWl` | `permissionModeEnumPreprocessed` **vs** `permissionModeSchema` | infra_platform/Permissions — modes and UI des; infra_platform/Permissions — the `.200` "Manu |
| `pg` | `isSettingSourceEnabled` **vs** `isSettingsSourceActive` | core_features/Auto memory — CLAUDE.md / `.cl; infra_platform/Sandbox — settings resolution  |
| `pvd` | `attachAskRuleForCircuitBreaker` **vs** `relaxCircuitBreakerAskForBash` | core_features/Plan Mode — permission-pipelin; infra_platform/Permissions — Bash static anal |
| `q2o` | `buildAndRunHookCommand` **vs** `spawnHookCommand` | core_features/Hooks — execution and result h; infra_integration/Plugins |
| `qTo` | `resolveForkBackgroundMode` **vs** `shouldRunForkInBackground` **vs** `shouldRunForkedSkillInBackground` | core_execution/Agent Tool; core_features/Code Review — command dispatch; core_features/Skills |
| `qU_` | `RETRY_BACKOFF_BASE_MS` **vs** `RETRY_BASE_DELAY_MS` | core_execution/LLM API — request retry loop; core_features/Agent Team — Teammate lifecycl |
| `qWf` | `buildLeaderCommandNotice` **vs** `getLeaderScopedCommandNotice` | core_features/Agent Team — Leader-facing UI ; infra_integration/UI — left-arrow gesture, agent; infra_platform/Model Picker UI |
| `qie` | `API_TRANSIENT_CODES` **vs** `STALE_CONNECTION_CODES` | core_execution/LLM API — transport error taxo; infra_platform/Transport / mTLS / Proxy |
| `qlp` | `isGcpCredentialError` **vs** `isGoogleCredentialAuthError` **vs** `isGoogleCredentialError` | core_execution/LLM API — request retry loop; infra_platform/AWS Credentials; infra_platform/Provider Resolution |
| `r3r` | `externalPermissionModeSchema` **vs** `permissionModeEnumPreprocessedAlt` | infra_platform/Permissions — modes and UI des; infra_platform/Permissions — the `.200` "Manu |
| `rSe` | `describeHook` **vs** `describeHookCommandForError` | core_features/Hooks — execution and result h; infra_integration/Plugins |
| `sed` | `classifyCwdVsWorktree` **vs** `classifyWorktreeEscape` | infra_platform/Sandbox — worktree path contai; infra_platform/Worktree Isolation Containment |
| `t$_` | `autoModeAdjudication` **vs** `resolvePermissionAfterAsk` | core_features/Plan Mode — permission-pipelin; infra_platform/Permissions — hooks bridge |
| `tpd` | `parseStackedSlashCommands` **vs** `peelStackedPromptCommands` | core_features/Code Review — command dispatch; core_features/Skills |
| `vJi` | `asPlainObject` **vs** `asPlainObjectOrEmpty` | core_features/Auto memory — frontmatter pars; core_features/Skills |
| `vdr` | `nearbyCommandNames` **vs** `nearestNamesWithinEditDistance` | infra_integration/Slash Commands — registry and ; infra_integration/Slash Commands — schema fields |
| `vr` | `delay` **vs** `sleep` | core_features/Headless Process IO (stdout dr; infra_platform/MCP Auto-Backgrounding |
| `vxe` | `refreshGrowthBookAfterAuthChange` **vs** `reinitializeGrowthBook` | infra_platform/Feature Gates (auth-coupled); infra_platform/Telemetry - GrowthBook feature |
| `wZ` | `FRONTMATTER_FENCE_RE` **vs** `FRONTMATTER_RE` | core_features/Auto memory — frontmatter pars; core_features/Skills |
| `x7r` | `AUTOMATED_EVENT_BANNER` **vs** `SYSTEM_NOTIFICATION_BANNER` **vs** `SYSTEM_NOTIFICATION_PREFIX` | core_features/Background Agents — Notificati; core_features/Scheduled-Task Prompt Banner (; core_features/Steering / Message Provenance |
| `yBc` | `normalizeSubagentThinkingDisplay` **vs** `resolveSubagentThinkingDisplay` | core_features/Compact — extended-thinking in; core_features/Subagent Text Forwarding |
| `yUp` | `TABLE_PADDING` **vs** `TABLE_WIDTH_SLACK` | infra_integration/Terminal Rendering and Mode Ow; infra_integration/UI components — markdown table |
| `yn` | `isNonInteractive` **vs** `isNonInteractiveSession` | core_execution/Session state — cost reset and; core_features/Hooks — shared helpers referen; infra_integration/Plugins; infra_integration/Remote Control — agent-fan pub; infra_platform/Telemetry - OTel event emissio |
| `yru` | `describeEmptyFrontmatterHazard` **vs** `emptyKeysHazard` | core_features/Auto memory — frontmatter pars; core_features/Skills |
| `zkt` | `costsForFastModeDisplay` **vs** `getFastModeDisplayCosts` | infra_platform/Model Pricing; infra_platform/Telemetry - cost and usage met |

## 2. Differing File:Line for one id

| Obfuscated | Lines cited | Where |
|------------|-------------|-------|
| `A_f` | `695431-695432` **vs** `695432` | infra_integration; infra_integration |
| `BK` | `58326` **vs** `58326-58329` | infra_platform; infra_platform |
| `Cke` | `215213` **vs** `520091` | core_features; core_features |
| `Cv` | `346396` **vs** `346396-346405` | infra_integration; infra_integration |
| `Ede` | `118826` **vs** `118826-118844` | infra_platform; infra_platform |
| `Fyp` | `559664` **vs** `559664-559683` | infra_integration; infra_integration; infra_integration |
| `GIc` | `109723-109738` **vs** `109726-109738` | infra_platform; infra_platform |
| `Gcs` | `228017` **vs** `228017-228033` | core_execution; infra_platform |
| `H4` | `512818` **vs** `512818-512826` | core_features; infra_platform |
| `Hcs` | `226508` **vs** `226508-226511` | core_features; core_features; core_features |
| `Hn` | `100302-100312` **vs** `100302-100317` | infra_platform; infra_platform; infra_platform |
| `Kep` | `508111` **vs** `508111-508115` | core_execution; core_features |
| `Lpn` | `500337` **vs** `500337-500446` | infra_integration; infra_integration |
| `Nyp` | `559650` **vs** `559650-559662` **vs** `559650-559663` | infra_integration; infra_integration; infra_integration |
| `OOm` | `865407-865412` **vs** `865414` | core_features; infra_platform |
| `QN` | `556647` **vs** `556647-556663` | infra_integration; infra_platform |
| `RAo` | `326547` **vs** `326547-326549` | core_features; core_features; infra_integration |
| `Sd` | `326533` **vs** `326533-326535` | core_features; infra_integration; infra_integration |
| `UZg` | `228034` **vs** `228034-228039` | core_execution; infra_platform |
| `Wie` | `228040` **vs** `228040-228051` | core_execution; infra_platform |
| `Xep` | `508104` **vs** `508104-508110` | core_execution; infra_platform |
| `YU_` | `534522` **vs** `534522-534526` | core_execution; infra_platform |
| `Z3e` | `681118` **vs** `681118-681150` | core_features; core_features |
| `ZU_` | `534877` **vs** `534877-534882` | core_execution; infra_platform |
| `ZXn` | `118700-118704` **vs** `118701-118704` | core_features; infra_platform |
| `aNy` | `343059` **vs** `343059-343170` | core_features; core_features |
| `bpt` | `326568-326578` **vs** `326568-326582` | infra_integration; infra_integration |
| `dWl` | `58495` **vs** `58495-58544` | infra_platform; infra_platform |
| `e4_` | `534883` **vs** `534883-534891` | core_execution; infra_platform |
| `edm` | `802458-802475` **vs** `802458-802476` | core_features; infra_integration |
| `eug` | `118800` **vs** `118804-118825` | infra_platform; infra_platform |
| `f5a` | `720478` **vs** `720478-720494` | infra_integration; infra_platform |
| `fL` | `58323` **vs** `58323-58325` | infra_platform; infra_platform |
| `hee` | `230896` **vs** `230896-230905` | core_execution; infra_integration |
| `jIc` | `109718-109722` **vs** `109720-109725` | infra_platform; infra_platform |
| `kL` | `156221` **vs** `156221-156223` | infra_integration; infra_integration |
| `kNt` | `533914` **vs** `533914-533918` | core_features; core_features |
| `kcn` | `449427` **vs** `449427-449438` | core_execution; core_features |
| `kcs` | `226504` **vs** `226504-226507` | core_features; core_features |
| `mb` | `111291-111298` **vs** `111291-111299` | infra_integration; infra_platform |
| `mk` | `259591` **vs** `259591-259611` | infra_integration; infra_platform |
| `n7t` | `57846` **vs** `57846-57849` | infra_platform; infra_platform |
| `nBe` | `284586` **vs** `284586-284620` | core_execution; infra_platform |
| `nHh` | `57993` **vs** `57993-58175` | infra_platform; infra_platform |
| `out` | `259584` **vs** `259584-259590` | infra_integration; infra_platform |
| `pg` | `57672` **vs** `57672-57674` | core_features; infra_platform |
| `pl` | `33132` **vs** `33132-33139` | core_features; infra_platform |
| `pr` | `24548` **vs** `24548-24552` | core_execution; core_features; infra_platform |
| `qTo` | `342396` **vs** `342396-342399` | core_execution; core_features; core_features |
| `qWf` | `748982` **vs** `748982-748998` | core_features; infra_integration; infra_platform |
| `qie` | `228052` **vs** `228052-228060` | core_execution; infra_platform |
| `qlp` | `534892` **vs** `534892-534898` **vs** `534892-534899` | core_execution; infra_platform; infra_platform |
| `tpd` | `343833` **vs** `343833-343871` | core_features; core_features |
| `vkl` | `14523` **vs** `14523-14529` | infra_platform; infra_platform |
| `wbd` | `381715` **vs** `381715-381717` | infra_integration; infra_integration |
| `x7r` | `226516` **vs** `226516-226521` | core_features; core_features; core_features |
| `yk` | `326536` **vs** `326536-326538` | core_features; infra_integration; infra_integration |
| `yn` | `3286` **vs** `3286-3288` | core_execution; core_features; infra_integration; infra_integration; infra_platform |
| `zkt` | `109713-109717` **vs** `109715-109719` | infra_platform; infra_platform |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](symbol_index_infra_integration.md) - Integrations

Every id in this file is indexed in at least two of the four files above.
