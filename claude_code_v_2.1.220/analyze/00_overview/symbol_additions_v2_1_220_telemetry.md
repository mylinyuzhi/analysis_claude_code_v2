# Symbol additions — v2.1.220 telemetry (`44_telemetry`)

**Staged for merge. Not yet merged into the symbol index files.**

| Group below | Merge into |
|---|---|
| `## Module: Telemetry - OTel event emission and attributes` | `symbol_index_infra_platform.md` |
| `## Module: Telemetry - content truncation` | `symbol_index_infra_platform.md` |
| `## Module: Telemetry - OTLP exporters and metrics` | `symbol_index_infra_platform.md` |
| `## Module: Telemetry - cost and usage metering` | `symbol_index_infra_platform.md` |
| `## Module: Telemetry - Cloud gateway metering and managed settings` | `symbol_index_infra_platform.md` |
| `## Module: Telemetry - GrowthBook feature flags` | `symbol_index_infra_platform.md` |
| `## Module: Telemetry - env-var schema` | `symbol_index_infra_platform.md` |
| `## Module: Permissions - decision telemetry` | `symbol_index_infra_platform.md` (permissions section) |

All `File:Line` values are `cli_inner_pretty.js` line numbers in the **2.1.220** bundle
(`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`, 872,596 lines,
`build_sha 4073f595`). Every row's line was read during this analysis. Line numbers are stable only
within this build — the durable anchor is the string literal / gate / env-var name noted in the
Readable column or in `44_telemetry/`.

Rows sorted alphabetically by Readable name within each module section.

---

## Module: Telemetry - OTel event emission and attributes

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `fe` | `attrString` | cli_inner_pretty.js:141-143 | function |
| `Kro` | `buildToolSourceAttribute` | cli_inner_pretty.js:152007-152010 | function |
| `Got` | `buildSubagentOtelAttributes` | cli_inner_pretty.js:111449-111458 | function |
| `nZ` | `buildWorkflowAnalyticsContext` | cli_inner_pretty.js:111463-111466 | function |
| `D5r` | `buildWorkflowOtelAttributes` | cli_inner_pretty.js:111459-111462 | function |
| `elu` | `ClaudeCodeContextManager` | cli_inner_pretty.js:167293-167321 | class |
| `Ac` | `emitOtelLogEvent` | cli_inner_pretty.js:167354-167372 | function |
| `sat` | `enterSpanScope` | cli_inner_pretty.js:168030-168033 | function |
| `z1g` | `eventSequence` | cli_inner_pretty.js:167412 | variable |
| `aat` | `exitSpanScope` | cli_inner_pretty.js:168035-168038 | function |
| `Uio` | `getActiveOrStoredContext` | cli_inner_pretty.js:167328-167331 | function |
| `FY` | `getCurrentOtelContext` | cli_inner_pretty.js:168023-168025 | function |
| `tlu` | `getStoredInteractionContext` | cli_inner_pretty.js:167325-167327 | function |
| `qRt` | `getTelemetryAttributes` | cli_inner_pretty.js:167170-167209 | function |
| `HW` | `getTracer` | cli_inner_pretty.js:168020-168022 | function |
| `hie` | `isEnhancedTelemetryOrBetaTracingEnabled` | cli_inner_pretty.js:168004-168006 | function |
| `yn` | `isNonInteractive` | cli_inner_pretty.js:3286-3288 | function |
| `olu` | `isOtelAssistantResponseLoggingEnabled` | cli_inner_pretty.js:167343-167345 | function |
| `yes` | `isEnhancedTelemetryBetaEnabled` | cli_inner_pretty.js:167998-168003 | function |
| `_g` | `isOtelToolDetailsLoggingEnabled` | cli_inner_pretty.js:151970-151972 | function |
| `zro` | `isSdkHostServer` | cli_inner_pretty.js:151999-152001 | function |
| `mde` | `isSubagentContext` | cli_inner_pretty.js:111442-111444 | function |
| `K1g` | `isUserPromptLoggingEnabled` | cli_inner_pretty.js:167337-167339 | function |
| `j1g` | `OTEL_METRICS_INCLUDE_DEFAULTS` | cli_inner_pretty.js:167246-167252 | object |
| `qP` | `isBetaTracingEnabled` | cli_inner_pretty.js:167433-167436 | function |
| `G1g` | `parseOtelResourceAttributes` | cli_inner_pretty.js:167253-167270 | function |
| `P9r` | `redactIfDisabled` | cli_inner_pretty.js:167340-167342 | function |
| `X1g` | `resolveLogRecordTraceContext` | cli_inner_pretty.js:167346-167353 | function |
| `les` | `setStoredInteractionContext` | cli_inner_pretty.js:167322-167324 | function |
| `Bio` | `storedInteractionContext` | cli_inner_pretty.js:167332 | variable |
| `r$g` | `startInteractionSpan` | cli_inner_pretty.js:168042-168072 | function |
| `W$e` | `endInteractionSpan` | cli_inner_pretty.js:168083-168093 | function |
| `S8e` | `otelContextManager` | cli_inner_pretty.js:167335 | variable |
| `Y1g` | `w3cTraceContextPropagator` | cli_inner_pretty.js:167425 | variable |
| `YRt` | `buildSpanAttributes` | cli_inner_pretty.js:168039-168041 | function |
| `Vio` | `runWithInteractionSpan` | cli_inner_pretty.js:168073-168082 | function |
| `Rlu` | `setToolCallIdAttributes` | cli_inner_pretty.js:168016-168019 | function |
| `KRt` | `setSpanErrorStatus` | cli_inner_pretty.js:168013-168015 | function |
| `urr` | `getActiveScopedSpan` | cli_inner_pretty.js:168026-168029 | function |

> Notes for the merge: the `Ac` / `Jc` name pair is a classic re-mangle trap — in 2.1.193 the same
> function is `Jc` at `:195214 (193)`. The named identifier from the v2.1.88 tree is `logOTelEvent`
> (`3rd/claude-code/src/utils/telemetry/events.ts:21`), and `qRt` is `getTelemetryAttributes`
> (`3rd/claude-code/src/utils/telemetryAttributes.ts`), `P9r` is `redactIfDisabled` (same file as
> `logOTelEvent`, line 17).

---

## Module: Telemetry - content truncation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dud` | `isRawApiBodyLoggingEnabled` | cli_inner_pretty.js:339435-339437 | function |
| `Pud` | `emitRawApiBodyEvent` | cli_inner_pretty.js:339446-339461 | function |
| `Lud` | `resolveRawApiBodyMode` | cli_inner_pretty.js:339430-339434 | function |
| `V1g` | `resolveOtelContentMaxLength` | cli_inner_pretty.js:167272-167279 | function |
| `q1g` | `TELEMETRY_CONTENT_LIMIT_BYTES` | cli_inner_pretty.js:167289 | constant |
| `WP` | `truncateTelemetryContent` | cli_inner_pretty.js:167280-167288 | function |
| `Mud` | `redactThinkingBlocks` | cli_inner_pretty.js:339462-339468 | function |
| `Oud` | `emitApiResponseBodyEvent` | cli_inner_pretty.js:339482-339488 | function |
| `hTo` | `emitApiRequestBodyEvent` | cli_inner_pretty.js:339477-339481 | function |

> `q1g = 61440` is `MAX_CONTENT_SIZE = 60 * 1024 // 60KB (Honeycomb limit is 64KB, staying safe)` in
> `3rd/claude-code/src/utils/telemetry/betaSessionTracing.ts:70`; `WP` is `truncateContent` in the
> same file at line 103. 2.1.193 had **two** copies of the truncator (`CD`/`xcp` at `:285861`/`:286044
> (193)` and an inline one with `Qbl` at `:468089-468100`/`:468132 (193)`); 2.1.220 unified them.

---

## Module: Telemetry - OTLP exporters and metrics

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aYd` | `isTelemetryEnabled` | cli_inner_pretty.js:494720-494722 | function |
| `JKd` | `buildOtlpHttpAgentFactory` | cli_inner_pretty.js:495002-495028 | function |
| `EFo` | `buildOtlpExporterOptions` | cli_inner_pretty.js:494912-494943 | function |
| `cYd` | `parseOtlpHeadersEnv` | cli_inner_pretty.js:494902-494911 | function |
| `sYd` | `getOtlpLogExporters` | cli_inner_pretty.js:494654-494687 | function |
| `tI_` | `getOtlpMetricReaders` | cli_inner_pretty.js:494600-494653 | function |
| `rI_` | `getOtlpTraceExporters` | cli_inner_pretty.js:494688-494718 | function |
| `oI_` | `initializeTelemetry` | cli_inner_pretty.js:494733-494884 | function |
| `kiE` | `initializeTelemetryAndCounters` | cli_inner_pretty.js:827904-827922 | function |
| `Xhl` | `initializeTelemetryOnce` | cli_inner_pretty.js:827891-827903 | function |
| `sI_` | `isLoopbackEndpoint` | cli_inner_pretty.js:494944-494952 | function |
| `lYd` | `isBigQueryMetricsEligible` | cli_inner_pretty.js:494727-494732 | function |
| `nI_` | `buildBigQueryMetricReader` | cli_inner_pretty.js:494723-494726 | function |
| `ZH_` | `METRIC_EXPORT_INTERVAL_MS_DEFAULT` (60000) | cli_inner_pretty.js:495037 | constant |
| `tYd` | `LOGS_EXPORT_INTERVAL_MS_DEFAULT` (5000) | cli_inner_pretty.js:495038 | constant |
| `rYd` | `TRACES_EXPORT_INTERVAL_MS_DEFAULT` (5000) | cli_inner_pretty.js:495039 | constant |
| `FSi` | `setMeterAndCounters` | cli_inner_pretty.js:3178-3198 | function |
| `Att` | `resetCostState` | cli_inner_pretty.js:3114-3126 | function |
| `XKd` | `toBuffer` (OTLP chunk normaliser) | cli_inner_pretty.js:494953-494958 | function |
| `_Fo` | `wrapAgentToBufferBodyAndSetContentLength` | cli_inner_pretty.js:494959-495001 | function |
| `iI_` | `flushTelemetry` | cli_inner_pretty.js:494885-494900 | function |
| `jSi` | `getCostCounter` | cli_inner_pretty.js:3214-3216 | function |
| `R9t` | `getTokenCounter` | cli_inner_pretty.js:3217-3219 | function |
| `J$r` | `getCodeEditToolDecisionCounter` | cli_inner_pretty.js:3220-3222 | function |
| `GSi` | `getActiveTimeCounter` | cli_inner_pretty.js:3223-3225 | function |
| `BSi` | `getSessionCounter` | cli_inner_pretty.js:3202-3204 | function |
| `Q$r` | `getLoggerProvider` | cli_inner_pretty.js:3226-3228 | function |
| `cFo` | `escapePrometheusValue` (vendored) | cli_inner_pretty.js:494056-494058 | function |
| `z5s` | `sanitizePrometheusName` (vendored) | cli_inner_pretty.js:494065-494067 | function |
| `$H_` | `appendTotalSuffix` (vendored) | cli_inner_pretty.js:494068-494071 | function |
| `FH_` | `prometheusTypeForDataPoint` (vendored) | cli_inner_pretty.js:494077-494089 | function |

> `FSi` is `setMeter` in `3rd/claude-code/src/bootstrap/state.ts:948`, where it takes **two**
> parameters — the `{ omitUnits }` third parameter is this window's addition, and `omitUnits` /
> `metricsExporterKinds` are both 220>0 / 193=0. The vendored Prometheus serializer helpers are listed
> because they are the **decoy** for the `.216` `# UNIT` bullet: byte-identical to
> `:349412-349446 (193)`.

---

## Module: Telemetry - cost and usage metering

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Oig` | `buildBakedCostMap` | cli_inner_pretty.js:109742-109755 | function |
| `GIc` | `catalogPricingToModelCosts` | cli_inner_pretty.js:109723-109738 | function |
| `$ig` | `computeCacheWriteCostUsd` | cli_inner_pretty.js:109756-109762 | function |
| `Lji` | `computeCostUsd` | cli_inner_pretty.js:109763-109771 | function |
| `Dig` | `STANDARD_OPUS_RATES` (5 / 25) | cli_inner_pretty.js:109827-109834 | object |
| `a7n` | `FAST_RATES_10_50` | cli_inner_pretty.js:109843-109850 | object |
| `UIc` | `FAST_RATES_30_150` | cli_inner_pretty.js:109835-109842 | object |
| `l7n` | `UNKNOWN_MODEL_COSTS` (aliases `Dig`) | cli_inner_pretty.js:109851 | variable |
| `Fot` | `MODEL_COSTS` | cli_inner_pretty.js:109853 | object |
| `zkt` | `getFastModeDisplayCosts` | cli_inner_pretty.js:109713-109717 | function |
| `WIc` | `formatModelPriceLabel` | cli_inner_pretty.js:109810-109815 | function |
| `M6e` | `formatPricePerMtok` | cli_inner_pretty.js:109807-109809 | function |
| `Mig` | `isCatalogModelId` | cli_inner_pretty.js:109739-109741 | function |
| `Kkt` | `priceUsageFromCounters` | cli_inner_pretty.js:109792-109802 | function |
| `Roe` | `priceUsage` | cli_inner_pretty.js:109788-109791 | function |
| `Nig` | `reportUnknownModelCost` | cli_inner_pretty.js:109785-109787 | function |
| `Dji` | `resolveModelCosts` | cli_inner_pretty.js:109772-109784 | function |
| `jIc` | `formatCatalogPriceLabel` | cli_inner_pretty.js:109718-109722 | function |

> `Dji`'s `usage.speed === "fast"` branch at `:109774-109777` is the client-side fast-mode pricing that
> `_GROUND_TRUTH_verified_anchors.md` §6.5 concluded did not exist. `s7u` at `:102553-102565 (193)` is
> the 2.1.193 equivalent; the delta is `|| r === "claude-opus-5"`.

---

## Module: Telemetry - Cloud gateway metering and managed settings

All rows below are in a gateway/proxy server component that is **absent from the 2.1.193 bundle**
(`all upstreams failed` 220=2 / 193=0).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `GMm` | `addContentBlockDeltaChars` | cli_inner_pretty.js:862803-862806 | function |
| `pMm` | `buildManagedSettingsPolicies` | cli_inner_pretty.js:860924-860943 | function |
| `hyE` | `buildManagedTelemetryEnv` | cli_inner_pretty.js:861003-861023 | function |
| `qMm` | `CHARS_PER_TOKEN_ESTIMATE` (4) | cli_inner_pretty.js:862862 | constant |
| `jMm` | `consumeSseUsageFrame` | cli_inner_pretty.js:862763-862802 | function |
| `t_E` | `finalizeSseUsage` | cli_inner_pretty.js:862829-862833 | function |
| `rvl` | `findSseFieldSpan` | cli_inner_pretty.js:862807-862828 | function |
| `vTt` | `isPriceableModelId` | cli_inner_pretty.js:862664-862669 | function |
| `VMm` | `mergeUsageFields` | cli_inner_pretty.js:862850-862859 | function |
| `WMm` | `meterUpstreamResponse` | cli_inner_pretty.js:862689-862723 | function |
| `JyE` | `makeUsageSniffer` | cli_inner_pretty.js:862724-862759 | function |
| `e_E` | `newSseUsageAccumulator` | cli_inner_pretty.js:862760-862762 | function |
| `XyE` | `normalizeUsageForPricing` | cli_inner_pretty.js:862670-862683 | function |
| `BMm` | `priceUsageCents` | cli_inner_pretty.js:862658-862663 | function |
| `r_E` | `parseNonStreamingUsage` | cli_inner_pretty.js:862834-862849 | function |
| `ZyE` | `SSE_ENVELOPE_ALLOWANCE` (80) | cli_inner_pretty.js:862863 | constant |
| `UMm` | `SSE_BUFFER_LIMIT_BYTES` (8388608) | cli_inner_pretty.js:862860 | constant |
| `uyE` | `mergeCatchAllPolicyIntoOthers` | cli_inner_pretty.js:860950-860968 | function |
| `dyE` | `mergePolicyCliSettings` | cli_inner_pretty.js:860969-860978 | function |
| `mMm` | `mergeArrayFieldsDeduped` | cli_inner_pretty.js:860991-861002 | function |
| `fMm` | `stripUndefinedKeys` | cli_inner_pretty.js:860987-860990 | function |
| `J1n` | `isPlainObject` | cli_inner_pretty.js:860944-860946 | function |
| `cyE` | `isCatchAllPolicyMatch` | cli_inner_pretty.js:860947-860949 | function |
| `lyE` | `extractAvailableModels` | cli_inner_pretty.js:860920-860923 | function |
| `o_i` | `selectPolicyForIdentity` | cli_inner_pretty.js:861024-861034 | function |
| `H7y` | `remapBlockedPostTurnSummary` | cli_inner_pretty.js:416204-416208 | function |

---

## Module: Telemetry - GrowthBook feature flags

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `L1e` | `clearMemoizedIdentityState` | cli_inner_pretty.js:106755-106757 | function |
| `zXi` | `coalesceNullFeatureValue` | cli_inner_pretty.js:156630-156632 | function |
| `Mtu` | `flushRecoveredExposures` | cli_inner_pretty.js:156497-156503 | function |
| `hVr` | `getAllGrowthBookFeatures` | cli_inner_pretty.js:156462-156465 | function |
| `Jer` | `getConfigFeatureOverrides` (**stub, returns undefined**) | cli_inner_pretty.js:156459-156461 | function |
| `mVr` | `getEnvFeatureOverrides` (**unreachable body, returns null**) | cli_inner_pretty.js:156432-156443 | function |
| `Ftu` | `getFeatureValueAsync` | cli_inner_pretty.js:156633-156647 | function |
| `Ke` | `getFeatureValue_CACHED_MAY_BE_STALE` | cli_inner_pretty.js:156667-156669 | function |
| `abe` | `getFeatureValue_CACHED_WITH_REFRESH` | cli_inner_pretty.js:156670-156672 | function |
| `Ono` | `getFeatureValue_DEPRECATED` | cli_inner_pretty.js:156648-156650 | function |
| `$no` | `getFeatureValueWithSource` | cli_inner_pretty.js:156651-156666 | function |
| `cIg` | `getFlagRefreshIntervalMs` (21600000) | cli_inner_pretty.js:156726-156728 | function |
| `AW` | `checkGate_CACHED_OR_BLOCKING` | cli_inner_pretty.js:156684-156694 | function |
| `eJi` | `checkSecurityRestrictionGate` | cli_inner_pretty.js:156673-156683 | function |
| `Ltu` | `installAuthedRemoteEvalHook` | cli_inner_pretty.js:156372-156399 | function |
| `lIg` | `isDiskCacheAllowedWithTelemetryOff` | cli_inner_pretty.js:156579-156581 | function |
| `sie` | `isGrowthBookEnabled` | cli_inner_pretty.js:156576-156578 | function |
| `Otu` | `processRemoteEvalPayload` | cli_inner_pretty.js:156504-156562 | function |
| `$tu` | `persistFeatureFlagsToDisk` | cli_inner_pretty.js:156563-156575 | function |
| `Mno` | `recordExposure` | cli_inner_pretty.js:156481-156496 | function |
| `Dtu` | `recoverExperimentAssignmentFromDisk` | cli_inner_pretty.js:156400-156411 | function |
| `Nno` | `refreshFeatureFlagsPeriodically` | cli_inner_pretty.js:156733-156758 | function |
| `vxe` | `reinitializeGrowthBook` | cli_inner_pretty.js:156695-156708 | function |
| `Btu` | `startFlagRefreshTimer` | cli_inner_pretty.js:156759-156773 | function |
| `tJi` | `stopFlagRefreshTimer` | cli_inner_pretty.js:156774-156777 | function |
| `Qer` | `teardownGrowthBook` | cli_inner_pretty.js:156709-156725 | function |
| `R$e` | `activeGrowthBookClient` | cli_inner_pretty.js:156784 | variable |
| `Gde` | `livePayloadValues` | cli_inner_pretty.js:156831 | variable |
| `Tst` | `experimentAssignments` | cli_inner_pretty.js:156831 | variable |
| `Lno` | `nonDefaultFeatureKeys` | cli_inner_pretty.js:156831 | variable |
| `Dno` | `pendingExposures` | cli_inner_pretty.js:156832 | variable |
| `jXi` | `warnedNonObjectFeatures` | cli_inner_pretty.js:156785 | variable |
| `GXi` | `warnedMalformedExperiments` | cli_inner_pretty.js:156786 | variable |
| `WXi` | `warnedValueLessEntries` | cli_inner_pretty.js:156787 | variable |
| `KXi` | `initialAuthHeader` | cli_inner_pretty.js:156791 | variable |
| `YXi` | `initialAccountUuid` | cli_inner_pretty.js:156792 | variable |
| `XXi` | `initialOrgUuid` | cli_inner_pretty.js:156793 | variable |
| `Pno` | `wasInitializedWithAuth` | cli_inner_pretty.js:156790 | variable |
| `oIg` | `isExperimentFeature` | cli_inner_pretty.js:156454-156458 | function |
| `iIg` | `getGrowthBookConfigOverrides` (returns `{}`) | cli_inner_pretty.js:156472-156474 | function |
| `aIg` | `clearGrowthBookConfigOverrides` (stub) | cli_inner_pretty.js:156478-156480 | function |
| `X1e` | `hasLivePayload` | cli_inner_pretty.js:156466-156468 | function |
| `QXi` | `getNonDefaultFeatureKeys` | cli_inner_pretty.js:156469-156471 | function |
| `PP` | `getDynamicConfig_CACHED_MAY_BE_STALE` | cli_inner_pretty.js:156781-156783 | function |
| `P_e` | `getDynamicConfig_BLOCKS_ON_INIT` | cli_inner_pretty.js:156778-156780 | function |
| `u7i` | `getClientDataAtis` | cli_inner_pretty.js:156729-156732 | function |

> Readable names for the exported members were taken from the module's own `tt(...)` export table at
> `:156355-156371`, which is the authoritative source for this module and removes the usual guesswork.

---

## Module: Telemetry - env-var schema

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `WYm` | `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` schema (`int`, `min:1`, `digitsOnly`) | cli_inner_pretty.js:24529 | variable |
| `UYm` | `OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT` schema | cli_inner_pretty.js:24526 | variable |
| `jYm` | `OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT` schema | cli_inner_pretty.js:24527 | variable |
| `GYm` | `OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT` schema | cli_inner_pretty.js:24528 | variable |
| `xYm` | `OTEL_EXPORTER_OTLP_ENDPOINT` schema | cli_inner_pretty.js:24512 | variable |
| `XIl` | `makeIntEnvSchema` | cli_inner_pretty.js:24101-24116 | function |
| `Fd` | `parseLenientInteger` | cli_inner_pretty.js:4441-4444 | function |
| `pUm` | `SCIENTIFIC_NOTATION_REGEX` | cli_inner_pretty.js:4453 | constant |
| `G0l` | `DIGIT_GROUP_REGEX` | cli_inner_pretty.js:4454 | constant |
| `W0l` | `DIGIT_SEPARATOR_REGEX` | cli_inner_pretty.js:4455 | constant |
| `u8` | `parseGroupedInteger` | cli_inner_pretty.js:4445-4450 | function |

> `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` is the **only** genuinely new env var in the telemetry surface
> (220=2 / 193=0). The eleven `OTEL_*` names in `_raw_asset_diff_193_to_220.md`'s "new env vars" block
> are all carryover — they only became detectable because 2.1.220 registered them in the typed
> accessor table at `:24360-24400`.

---

## Module: Permissions - decision telemetry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `i7t` | `CAN_USE_TOOL_ABORTED_REASON` (`"tool permission request aborted"`) | cli_inner_pretty.js:58356 | constant |
| `q5n` | `PERMISSION_STREAM_CLOSED_REASON` | cli_inner_pretty.js:58353 | constant |
| `V5n` | `CAN_USE_TOOL_INVALID_RESULT_REASON` | cli_inner_pretty.js:58354 | constant |
| `z5n` | `CAN_USE_TOOL_REQUEST_FAILED_REASON` | cli_inner_pretty.js:58355 | constant |
| `s7t` | `CAN_USE_TOOL_ABORTED_DECISION_REASON` (`{type:"other", reason: i7t}`) | cli_inner_pretty.js:58383 | object |
| `VPi` | `PERMISSION_STREAM_CLOSED_DECISION_REASON` | cli_inner_pretty.js:58380 | object |
| `G4r` | `CAN_USE_TOOL_INVALID_RESULT_DECISION_REASON` | cli_inner_pretty.js:58381 | object |
| `zPi` | `CAN_USE_TOOL_REQUEST_FAILED_DECISION_REASON` | cli_inner_pretty.js:58382 | object |
| `jPi` | `DECISION_REASON_TYPES` (11 members) | cli_inner_pretty.js:58364-58376 | constant |
| `XJy` | `mapDecisionReasonToTelemetrySource` | cli_inner_pretty.js:425294-425320 | function |
| `YJy` | `mapRuleSourceToTelemetrySource` | cli_inner_pretty.js:425283-425293 | function |
| `Mtd` | `mapDecisionReasonToInternalReason` | cli_inner_pretty.js:315764-315812 | function |
| `LTs` | `mapDecisionReasonToInternalReasonAttr` | cli_inner_pretty.js:315761-315763 | function |
| `Dtd` | `mapClassifierDecisionReason` | cli_inner_pretty.js:315813-315815 | function |
| `Ptd` | `recordToolDecision` | cli_inner_pretty.js:315736-315760 | function |
| `cIy` | `mapPromptSourceToTelemetrySource` | cli_inner_pretty.js:315664-315678 | function |
| `dur` | `buildToolDecisionBaseAttrs` | cli_inner_pretty.js:315679-315686 | function |
| `RTs` | `buildCodeEditDecisionAttrs` | cli_inner_pretty.js:315653-315663 | function |
| `ITs` | `isCodeEditTool` | cli_inner_pretty.js:315650-315652 | function |
| `pIy` | `recordToolDecisionDenied` | cli_inner_pretty.js:315724-315735 | function |
| `DTs` | `pickPermissionResultTelemetryFields` | cli_inner_pretty.js:315816-315820 | function |

> All four `*_REASON` string constants and their `{type:"other", reason}` companions are
> **220>0 / 193=0**. `XJy`'s 2.1.193 counterpart is `Mef` at `:444511-444534 (193)`, whose
> `case "other":` had no reason inspection.
