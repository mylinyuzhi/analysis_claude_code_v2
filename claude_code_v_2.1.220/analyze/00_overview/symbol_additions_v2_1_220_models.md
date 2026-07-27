# Symbol additions from `47_models/` (v2.1.220) — staged for merge

Format per [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §6:
`| Obfuscated | Readable | File:Line | Type |`, sorted alphabetically by obfuscated name inside each
module section.

**Every line number below was read in the 2.1.220 bundle**
(`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`, 872,596 lines,
build `4073f595`). File column is `cli_inner_pretty.js` throughout; only the line range is given.

⚠ **Symbol ids are re-mangled between builds and old ids get reused.** None of these names may be
carried into another tree. The stable anchor is always the string literal / gate / env var noted in the
Readable column.

---

## Merge routing

| Group below | Merge into |
|---|---|
| `## Module: Model Selection` | `symbol_index_infra_platform.md` |
| `## Module: Model Catalogue` | `symbol_index_infra_platform.md` (new subsection under Model Selection) |
| `## Module: Fast Mode` | `symbol_index_infra_platform.md` (new subsection under Model Selection) |
| `## Module: Model Pricing` | `symbol_index_infra_platform.md` (Telemetry/cost adjacency — keep with Model Selection) |
| `## Module: Provider Resolution` | `symbol_index_infra_platform.md` |
| `## Module: Model Picker UI` | `symbol_index_infra_integration.md` (UI Components) |
| `## Module: Model Capabilities` | `symbol_index_infra_platform.md` (Model Selection) |

---

## Module: Model Catalogue

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Ti` | `resolvePricingTier` — `entry.pricing` token → cost record via `yQ().pricing_tiers` | cli_inner_pretty.js:14511-14516 | function |
| `B8m` | `providerIdsSchema` — 8-provider zod object, `.loose()` | cli_inner_pretty.js:14535-14548 | object |
| `csc` | `CATALOG_MODEL_IDS` — 17-id sync list; `Oig()` throws if a catalogue id is missing from it | cli_inner_pretty.js:86580-86598 | constant |
| `Ekl` | `pricingTierSchema` — `{input, output, cache_write_5m, cache_write_1h, cache_read, web_search}` | cli_inner_pretty.js:14549-14560 | object |
| `G8m` | `modelCatalogueSchema` — top-level schema (`schema_version`, `pricing_tiers`, `models`, `aliases`, `defaults`, `best`, `latest_per_family`, `alias_migration`) | cli_inner_pretty.js:14630-14643 | object |
| `iRc` | `resolveBestFamily` — reads `yQ().best`, honours it only if the family is in `m7n` and `.available()`; else `"opus"` | cli_inner_pretty.js:110496-110500 | function |
| `j8m` | `aliasEntrySchema` — `{default, per_provider?}` | cli_inner_pretty.js:14627-14629 | object |
| `m1e` | `MODEL_ALIASES` — `["sonnet","opus","haiku","fable","best","sonnet[1m]","opus[1m]","fable[1m]","opusplan"]` | cli_inner_pretty.js:86599 | constant |
| `m7n` | `BEST_FAMILY_REGISTRY` — `{ fable: { available, defaultModel, builtinDefault } }`, one entry | cli_inner_pretty.js:111372 | object |
| `MFr` | `catalogueIdForProviderId` — reverse lookup via `V8m` | cli_inner_pretty.js:14505-14507 | function |
| `Oig` | `buildCatalogueCostTable` — catalogue → `{id: ModelCosts}`; throws `"model catalog id missing from CATALOG_MODEL_IDS"` | cli_inner_pretty.js:109742-109755 | function |
| `PFr` | `getModelCatalogue` (alias of `yQ`) — memoised `safeParse` | cli_inner_pretty.js:14653-14656 | function |
| `q8m` | `catalogueByIdIndex` — memoised `id → entry` map | cli_inner_pretty.js:14658-14662 | function |
| `qlE` | `ALIAS_MIGRATION_MAP` — `{}`; **not** wired to `yQ().alias_migration`, so `rTm` is inert | cli_inner_pretty.js:833757 | constant |
| `Rjr` | `FAMILY_ALIASES` — `["sonnet","opus","haiku","fable"]` | cli_inner_pretty.js:86600 | constant |
| `rTm` | `migrateModelAlias` — emits `tengu_alias_migration`; unreachable in 2.1.220 (empty map) | cli_inner_pretty.js:833732-833744 | function |
| `Se` | `memoiseNullary` — `() => (t ??= e())` | cli_inner_pretty.js:14498-14501 | function |
| `Skl` | `BAKED_MODEL_CATALOGUE` — the declarative catalogue; doc-comment under key `"//"` at :14009 | cli_inner_pretty.js:14008-14496 | object |
| `sRc` | `resolveBestModel` — `m7n[best].defaultModel()` with the `Fji` re-entrancy latch | cli_inner_pretty.js:110501-110514 | function |
| `U8m` | `modelEntrySchema` — includes 6 fields no entry populates (`slogan`, `fallback_chain`, `picker`, `deprecation`, `min_cli_version`) | cli_inner_pretty.js:14561-14626 | object |
| `V8m` | `providerIdToCatalogueIdIndex` — throws `"model catalog: provider id collision across distinct entries"` | cli_inner_pretty.js:14663-14674 | function |
| `vkl` | `resolveAliasForProvider` — `aliases[alias].per_provider[provider] ?? aliases[alias].default` | cli_inner_pretty.js:14523-14529 | function |
| `W2n` | `stripTrailingZeroSuffix` — `replace(/-0$/, "")` | cli_inner_pretty.js:14502-14504 | function |
| `W8m` | `EMPTY_CATALOGUE` — `schema_version: 0` fail-soft fallback | cli_inner_pretty.js:14644-14652 | constant |
| `ww` | `getCatalogueEntry` — `id → entry` accessor | cli_inner_pretty.js:14508-14510 | function |
| `yQ` | `getModelCatalogue` — memoised validated catalogue accessor | cli_inner_pretty.js:14657 | function |

---

## Module: Model Capabilities

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ait` | `defaultEffortForModel` — `ww(lo(e))?.default_effort ?? "high"` | cli_inner_pretty.js:119625-119627 | function |
| `Aws` | `advisorRankForModel` — `ww(lo(vi(e)))?.advisor_rank` | cli_inner_pretty.js:308413-308415 | function |
| `Ede` | `getEnvDeclaredCapability` — 3P-only per-model capability declaration; inert when `rm()`; memoised on `"<id>:<cap>"` | cli_inner_pretty.js:118826-118844 | function |
| `eqe` | `supportsMaxEffort` — 4-layer predicate (`max_effort`) | cli_inner_pretty.js:119376-119398 | function |
| `eug` | `MODEL_CAPABILITY_ENV_PAIRS` — 5 rows of `{modelEnvVar, capabilitiesEnvVar}`; `_SUPPORTED_CAPABILITIES` 220=15/193=15 | cli_inner_pretty.js:118804-118825 | constant |
| `F6e` | `isFableModelId` — `e.includes("claude-fable-5")` | cli_inner_pretty.js:110515-110517 | function |
| `I_e` | `supportsXhighEffort` — 4-layer predicate (`xhigh_effort`) | cli_inner_pretty.js:119393-119413 | function |
| `IP` | `isNative1MModel` — `context.native_1m` + provider check; contains the dead id `claude-mythos-preview` | cli_inner_pretty.js:150201-150209 | function |
| `KFc` | `isMythosFamilyId` — `e.startsWith("claude-mythos-")` | cli_inner_pretty.js:118789-118791 | function |
| `M$` | `modelHasCapability` — **tri-state**: `true` \| `undefined`, never `false`; `undefined` is what makes the hardcoded deny-lists load-bearing | cli_inner_pretty.js:14517-14522 | function |
| `O6e` | `is1MContextDisabled` — `CLAUDE_CODE_DISABLE_1M_CONTEXT` | cli_inner_pretty.js:150194-150196 | function |
| `oQt` | `isMythos5ModelId` — `e.includes("claude-mythos-5")` | cli_inner_pretty.js:110518-110520 | function |
| `Q8` | `supports1MBeta` — `context.supports_1m_beta` \| provider default | cli_inner_pretty.js:150232-150238 | function |
| `Qkt` | `isFableAvailable` — requires a **server-provided non-disabled** Fable row in `additional_model_options` | cli_inner_pretty.js:110521-110533 | function |
| `RQt` | `rejectsDisabledThinking` — `rejects_disabled_thinking` capability | cli_inner_pretty.js:119691-119709 | function |
| `Ser` | `supportsMidConversationSystem` — deny-list then `M$(r,"mid_conv_system") \|\| r === "claude-mythos-5"`; **Sonnet 5 passes** (the `.201` revert) | cli_inner_pretty.js:150505-150526 | function |
| `SWi` | `supportsThinking` — `Ede(e,"thinking")` then `!lo(e).includes("claude-3-")` | cli_inner_pretty.js:119685-119689 | function |
| `Uot` | `isLegacy200kOnlyModel` — the shared 5-id legacy exclusion list | cli_inner_pretty.js:150223-150231 | function |
| `v5r` | `isMythos5Canonical` — `Qs(lo(e)) === "claude-mythos-5"` | cli_inner_pretty.js:150546-150548 (decl at 110546-110548) | function |
| `W1e` | `needsFable5Mitigations` — `M$(e,"fable_5_mitigations") \|\| e === "claude-mythos-5"` | cli_inner_pretty.js:118784-118787 | function |
| `wws` | `advisorRankForModelGated` — drops Fable when `!Qkt()` and Mythos when `!_7n()`; the `.210` server-side path | cli_inner_pretty.js:308417-308424 | function |
| `xT` | `isFableSelection` — canonical id or `ANTHROPIC_DEFAULT_FABLE_MODEL` match | cli_inner_pretty.js:110543-110545 | function |
| `z8m` | `externalCapabilityResolver` — declared and called (`:14521`) but **never assigned**; an unused extension seam | cli_inner_pretty.js:14530 | variable |
| `Zcg` | `needsFullSystemPrompt` — inverted-polarity `lean_prompt` probe (returns `!1` when the capability is present) | cli_inner_pretty.js:118727-118742 | function |
| `ZXn` | `usesOpus5PromptBundle` — `M$(lo(e),"opus_5_prompt_bundle") === !0 && !Ke(Qcg,!1)` | cli_inner_pretty.js:118701-118704 | function |
| `_7n` | `isMythosAvailable` — first-party + official base URL + enabled server row | cli_inner_pretty.js:110534-110537 | function |
| `$xg` | `provider1MSupport` — `native_1m_3p`; the `gateway` arm requires bedrock **and** vertex **and** foundry | cli_inner_pretty.js:150210-150222 | function |

---

## Module: Provider Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Zh` | `toLegacyModelConfig` — snake_case `provider_ids` → camelCase config; `gateway ?? first_party` | cli_inner_pretty.js:100171-100185 | function |
| `Cu_` | `findBedrockUpgradeCandidates` — skips env defaults the probe itself wrote via `Qfe` | cli_inner_pretty.js:455754-… | function |
| `d7n` | `reverseModelOverride` — id → override key using an explicit `overridesMap` | cli_inner_pretty.js:100206-100210 (decl 110206-110210) | function |
| `dj` | `hasFirstPartyCapabilities` — `firstParty \| ClaudePlatform \| foundry \| mantle` | cli_inner_pretty.js:100352-100354 | function |
| `f_e` | `FIRST_PARTY_ID_TO_LEGACY_KEY` — reverse of `Ul` | cli_inner_pretty.js:100266 | constant |
| `FZh` | `providerSignsWithAwsCredentials` — exhaustive switch; `anthropicGoogleCloud` on the **false** side | cli_inner_pretty.js:100288-100301 | function |
| `Hn` | `getAPIProvider` — 8-way enum, `gateway` short-circuits first, `anthropicGoogleCloud` added in this window | cli_inner_pretty.js:100302-100317 | function |
| `Hot` | `reverseModelOverrideFromConfig` — same as `d7n` but reads `eo().modelOverrides` | cli_inner_pretty.js:100449-100460 | function |
| `i4i` | `OPUS_PREFERENCE_ORDER` — `["opus5","opus48","opus47","opus46","opus45"]` (193: no `opus5`) | cli_inner_pretty.js:100264 | constant |
| `iW` | `isClaudePlatformProvider` — `anthropicAws \| anthropicGoogleCloud`; 220-only category | cli_inner_pretty.js:100346-100348 | function |
| `Km` | `getModelConfigsForCurrentProvider` — provider-projected `Ul` | cli_inner_pretty.js:100468-100472 | function |
| `mkt` | `getSecondaryProvider` — `bedrock + CLAUDE_CODE_USE_MANTLE → "mantle"` | cli_inner_pretty.js:100324-100327 | function |
| `NZh` | `buildLegacyModelConfigs` — derives `Ul` from the catalogue; throws `"model catalog missing entry for CATALOG_ID_TO_KEY id"` | cli_inner_pretty.js:100186-100198 | function |
| `ny` | `getProviderForModel` — per-model provider with the mantle/`anthropic.` fallback | cli_inner_pretty.js:100331-100342 | function |
| `OZh` | `CATALOG_ID_TO_KEY` — 16 rows; `"claude-opus-5": "opus5"` at :100233; **no `claude-mythos-5` row** | cli_inner_pretty.js:100218-100235 | constant |
| `pGr` | `projectConfigsForProvider` — provider column of `Ul` with 3P fallback | cli_inner_pretty.js:100405-100414 | function |
| `pJt` | `THIRD_PARTY_PROVIDER_ENV_VARS` — 220-only; `anthropicGoogleCloud → CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD` | cli_inner_pretty.js:100393-100400 | object |
| `QK` | `assertNamedConfigHasAll3P` — throws `"named model config export has null 3P provider id"` | cli_inner_pretty.js:100199-100207 | function |
| `Qfe` | `envDefaultWasWrittenByProbe` — compares `ANTHROPIC_DEFAULT_*_MODEL` against `CLAUDE_CODE_3P_PROBE_WROTE_*_DEFAULT` (220=6/193=0) | cli_inner_pretty.js:455727-455731 | function |
| `QQ` | `legacyConfigForProviderId` — linear scan over `Ul` | cli_inner_pretty.js:100208-100213 | function |
| `qlp` | `isGoogleCredentialAuthError` — Vertex-equivalent 401 handling for Claude Platform on Google Cloud | cli_inner_pretty.js:534892-534899 | function |
| `rm` | `usesFirstPartyModelIds` — `firstParty \| ClaudePlatform \| gateway` | cli_inner_pretty.js:100343-100345 | function |
| `run` | `recordProbeWrittenEnvDefault` — sets `CLAUDE_CODE_3P_PROBE_WROTE_{SONNET,OPUS}_DEFAULT` | cli_inner_pretty.js:455721-455724 | function |
| `s4i` | `LEGACY_MODEL_KEYS` — `Object.keys(Ul)` | cli_inner_pretty.js:100465 | constant |
| `ybc` | `MYTHOS5_LEGACY_CONFIG` — hand-written, all 8 provider ids populated; **contradicts** the catalogue's all-null entry | cli_inner_pretty.js:100253-100263 | object |
| `Yig` | `PROVIDER_KEY_TO_CATALOG_KEY` — camelCase → snake_case bridge for alias lookup | cli_inner_pretty.js:111373-111382 | object |
| `Ul` | `MODEL_CONFIGS` — derived camelCase table (193's `Kc`) | cli_inner_pretty.js:100236 | constant |
| `ZK` | `THIRD_PARTY_PROVIDER_LABELS` — 7 rows; `"Claude Platform on Google Cloud"` at :100389 | cli_inner_pretty.js:100384-100392 | object |
| `_bc` | `ALL_FIRST_PARTY_MODEL_IDS` | cli_inner_pretty.js:100265 | constant |

---

## Module: Model Selection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `A5r` | `getDefaultOpusModelWithSuffix` — walks `i4i` for the first permitted Opus | cli_inner_pretty.js:110549-110556 | function |
| `A7n` | `describeDefaultModelRow` — renders `" · Org default"` / `" · Set by your organization"` | cli_inner_pretty.js:111164-111176 | function |
| `aRc` | `applyContextSuffix` — appends `[1m]` when the source carried it | cli_inner_pretty.js:110557-110560 | function |
| `b7n` | `resolveFamilyAliasFromCatalogue` — `vkl(alias, Yig[provider])` then map through `f_e` | cli_inner_pretty.js:110607-110612 | function |
| `B6e` | `getHaikuDefault` | cli_inner_pretty.js:110640-110644 | function |
| `C5r` | `noFallbackTripwire` — throws the `CLAUDE_CODE_NO_MODEL_FALLBACK` unreachable-branch error | cli_inner_pretty.js:111088-111095 | function |
| `cRc` | `resolveBaselineSetting` — provider-shaped baseline (mantle / bedrock+vertex / else sonnet) | cli_inner_pretty.js:110770-110783 | function |
| `CT` | `getSonnetDefault` | cli_inner_pretty.js:110632-110635 | function |
| `EE` | `getOpusDefault` — `ANTHROPIC_DEFAULT_OPUS_MODEL` else `N6e()` | cli_inner_pretty.js:110621-110625 | function |
| `E7n` | `resolveEnforcedAvailableModel` — `availableModels` + `modelOverrides` enforcement (not dissected) | cli_inner_pretty.js:110784-110936 | function |
| `f5r` | `newestPermittedModelInFamily` — reverse scan of `Ul` | cli_inner_pretty.js:110162-110168 | function |
| `fde` | `canAppend1MSuffix` | cli_inner_pretty.js:110937-110941 | function |
| `h7n` | `sonnetDefaultFromConfigs` — `b7n("sonnet", …) ?? e.sonnet46` | cli_inner_pretty.js:110637-110639 | function |
| `iQt` | `resolveModelWithAttribution` — the 4-level ladder; `attribution ∈ {"org","enforced","entitlement","tier"}` | cli_inner_pretty.js:110736-110751 | function |
| `j6e` | `findNonFableFallbackModel` — returns `null` under `CLAUDE_CODE_NO_MODEL_FALLBACK` | cli_inner_pretty.js:111099-111107 | function |
| `jji` | `maybeSeedSonnetDefault` — ignores probe-written env defaults | cli_inner_pretty.js:110561-110573 | function |
| `KA` | `getResolvedDefaultModel` — `vi(Z$())` | cli_inner_pretty.js:111082-111084 | function |
| `KO` | `is1MContextOffered` | cli_inner_pretty.js:111186-111190 | function |
| `l0t` | `setResolvedOrgDefault` — writes `Ot.resolvedOrgDefault` (220=3/193=0) | cli_inner_pretty.js:110057-110059 (decl 3057-3059) | function |
| `lo` | `normaliseToCatalogueId` — override reverse-map, inference-profile resolution, then `YO` | cli_inner_pretty.js:111141-111148 | function |
| `lRc` | `validateOrgDefaultModel` — enforced+entitlement check, `null` if unusable | cli_inner_pretty.js:110728-110732 | function |
| `mb` | `getModelDisplayName` — `ww(t).display_name` (+ `" (1M context)"`); returns `undefined` on Foundry | cli_inner_pretty.js:111291-111299 | function |
| `N6e` | `opusDefaultFromConfigs` — `b7n("opus", …) ?? e.opus5` | cli_inner_pretty.js:110626-110628 | function |
| `Nji` | `getOrgModelDefaultCache` — strict shape validation, org-UUID binding, control-char scrub | cli_inner_pretty.js:154491-154507 | function |
| `nm` | `getModelLabel` — server/gateway row label, then `Poe`, then the raw id | cli_inner_pretty.js:111217-111225 | function |
| `Ooe` | `canonicalIdWithout1M` — `Qs(lo(e))` | cli_inner_pretty.js:111155-111157 | function |
| `Oi` | `getSessionModelResolved` | cli_inner_pretty.js:110491-110495 | function |
| `Poe` | `catalogueDisplayNameWithSuffix` — uses `context.supports_1m_suffix` | cli_inner_pretty.js:111211-111216 | function |
| `S7n` | `stepDownToEntitledFamily` — opus→sonnet→haiku walk under entitlement | cli_inner_pretty.js:110752-110769 | function |
| `U6e` | `getValidatedOrgDefaultModel` | cli_inner_pretty.js:110723-110727 | function |
| `VCe` | `isModelFallbackForbidden` — `CLAUDE_CODE_NO_MODEL_FALLBACK` (220=6/193=0) | cli_inner_pretty.js:111085-111087 | function |
| `vi` | `resolveModelAlias` — the alias switch incl. `"best"` → `sRc()` | cli_inner_pretty.js:111232-111253 | function |
| `Vji` | `haikuDefaultFromConfigs` | cli_inner_pretty.js:110645-110647 | function |
| `w5r` | `getFableDefault` | cli_inner_pretty.js:110613-110616 | function |
| `Wji` | `fableDefaultFromConfigs` | cli_inner_pretty.js:110617-110620 | function |
| `wSi` | `getResolvedOrgDefault` — reads `Ot.resolvedOrgDefault`; `undefined` = unresolved, `null` = none | cli_inner_pretty.js:3054-3056 | function |
| `x5r` | `buildAvailabilityFallbackChain` — collapses to `[primary]` under the no-fallback env var | cli_inner_pretty.js:111096-111099 | function |
| `Y8` | `force1MSuffix` — idempotent `[1m]` append | cli_inner_pretty.js:110720-110722 | function |
| `Ykt` | `isLegacyModelRemapEnabled` — `!CLAUDE_CODE_DISABLE_LEGACY_MODEL_REMAP` | cli_inner_pretty.js:111255-111257 | function |
| `YO` | `canonicaliseModelId` — reverse index, regional `us.anthropic.` retry, then a 17-branch substring ladder | cli_inner_pretty.js:111109-111140 | function |
| `Z$` | `getSessionModelSetting` — `iQt().setting` | cli_inner_pretty.js:110733-110735 | function |
| `ZJt` | `getModelAccessEntitlements` — validated `modelAccessCache` rows | cli_inner_pretty.js:154485-154490 | function |
| `$1e` | `getAdditionalModelOptions` — validated `additionalModelOptionsCache` rows | cli_inner_pretty.js:154474-154484 | function |

---

## Module: Model Pricing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `a7n` | `FAST_MODE_COSTS_TIER_10_50` — `{10, 50, 12.5, 20, 1, 0.01}`; the changelog's "$10/$50" | cli_inner_pretty.js:109843-109850 | constant |
| `BIc` | `formatDollars` — `$N` for integers, `$N.NN` otherwise | cli_inner_pretty.js:109803-109806 | function |
| `Dig` | `COSTS_TIER_5_25` — `{5, 25, 6.25, 10, 0.5, 0.01}` | cli_inner_pretty.js:109827-109834 | constant |
| `Dji` | `resolveModelCosts` — **fast-mode cost substitution** on `usage.speed === "fast"`; disproves ground-truth §6.5 | cli_inner_pretty.js:109772-109784 | function |
| `Fot` | `MODEL_COSTS` — `{fable: a7n, mythos: a7n, ...Oig()}`; the spread wins | cli_inner_pretty.js:109853 | constant |
| `GIc` | `tierToModelCosts` — throws `"model catalog entry has incomplete pricing"` | cli_inner_pretty.js:109726-109738 | function |
| `jIc` | `formatCataloguePriceForModel` | cli_inner_pretty.js:109720-109725 | function |
| `Kkt` | `costForTokenUsage` — forwards `speed` into `Dji` | cli_inner_pretty.js:109792-109802 | function |
| `l7n` | `DEFAULT_MODEL_COSTS` — alias of `Dig` | cli_inner_pretty.js:109851 | constant |
| `Lji` | `computeCostFromUsage` — the per-turn dollar accumulator | cli_inner_pretty.js:109763-109771 | function |
| `M6e` | `formatPricePerMtok` — `"$X/$Y per Mtok"` | cli_inner_pretty.js:109807-109809 | function |
| `Mig` | `isKnownCatalogueId` — `Pig.has(e)` | cli_inner_pretty.js:109739-109741 | function |
| `Nig` | `reportUnknownModelCost` — `tengu_unknown_model_cost` | cli_inner_pretty.js:109785-109787 | function |
| `Pig` | `CATALOG_MODEL_ID_SET` — `new Set(csc)` | cli_inner_pretty.js:109852 | constant |
| `Roe` | `costForApiUsage` | cli_inner_pretty.js:109788-109791 | function |
| `UIc` | `FAST_MODE_COSTS_OPUS_46_47` — `{30, 150, 37.5, 60, 3, 0.01}` (6× base) | cli_inner_pretty.js:109835-109842 | constant |
| `WIc` | `formatModelPriceFromCosts` — `Fot[lo(e)]` → `M6e` | cli_inner_pretty.js:109810-109815 | function |
| `zkt` | `costsForFastModeDisplay` — display-side twin of `Dji` | cli_inner_pretty.js:109715-109719 | function |
| `$ig` | `cacheWriteCost` — splits 1h vs 5m ephemeral cache writes | cli_inner_pretty.js:109756-109762 | function |

---

## Module: Fast Mode

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `a5r` | `isFastModeActiveForModel` — `Q$ && mv && xji(eo())` | cli_inner_pretty.js:109455-109460 | function |
| `dde` | `resetFastModeCooldown` | cli_inner_pretty.js:109513-109515 | function |
| `d_r` | `applyFastModeToggle` — settings write + Remote Control `apply_flag_settings` + model coercion | cli_inner_pretty.js:499792-499809 | function |
| `eBo` | `runFastModeCommand` — builds `"Fast mode ON … · $X/$Y per Mtok"`; hardcodes `"claude-opus-5"` fallback at :499818 | cli_inner_pretty.js:499810-499824 | function |
| `FIc` | `isTransientFastModeReason` — `network_error \| unknown` (was inline in 193) | cli_inner_pretty.js:109577-109579 | function |
| `Hig` | `KNOWN_DISABLED_REASONS` — `free \| preference \| extra_usage_disabled \| network_error \| unknown` | cli_inner_pretty.js:109710 | constant |
| `HIc` | `describeOrgDisabledReason` — 5-arm reason→string map | cli_inner_pretty.js:109386-109401 | function |
| `HU` | `resolveFastModeAfterModelSwitch` — the `.208` restore/downgrade decision | cli_inner_pretty.js:109475-109482 | function |
| `i7n` | `getFastModeCooldownState` — **lazy** expiry check, re-enables on read | cli_inner_pretty.js:109498-109504 | function |
| `Iig` | `normaliseServerDisabledReason` — unknown → `"unknown"`, null → `"preference"` | cli_inner_pretty.js:109571-109573 | function |
| `IU` | `emitFastModeToggleTelemetry` — `tengu_fast_mode_toggled` with `source: "model_switch_restore" \| "model_switch_downgrade"` and `remote: CS()`; 11 call sites | cli_inner_pretty.js:109483-109490 | function |
| `kig` | `describeOverageRejection` — 9-arm usage-credit reason map | cli_inner_pretty.js:109523-109545 | function |
| `kmt` | `buildFastModeSuffix` — `" · Fast mode ON/OFF"` + `announceKeptOn` | cli_inner_pretty.js:450667-450676 | function |
| `l5r` | `isSpendCapReason` — reasons that must NOT clear the user's `fastMode` setting | cli_inner_pretty.js:109546-109548 | function |
| `Lig` | `FAST_MODE_PREFETCH_INTERVAL_MS` — `30000` | cli_inner_pretty.js:109714 | constant |
| `LIc` | `getOpus47FastModeSunsetDate` — gate `tengu_sunset_penguin_opus47`, default `"2026-07-25"`; returns `null` once passed | cli_inner_pretty.js:109491-109497 | function |
| `MIc` | `enterFastModeCooldown` — emits `tengu_fast_mode_fallback_triggered` | cli_inner_pretty.js:109505-109512 | function |
| `mv` | `isFastModeEligibleModel` — catalogue capability **then** `opus-4-7 \|\| opus-4-8 \|\| opus-5` substring; **Opus 4.7 still passes** | cli_inner_pretty.js:109467-109474 | function |
| `NIc` | `handleOverageRejection` — `tengu_fast_mode_overage_rejected` | cli_inner_pretty.js:109549-109561 | function |
| `o7n` | `skipFastModeOrgCheck` — `CLAUDE_CODE_SKIP_FAST_MODE_ORG_CHECK` | cli_inner_pretty.js:109379-109381 | function |
| `OIc` | `disableFastModeFromServer` — clears `userSettings.fastMode` + `penguinModeOrgEnabled` | cli_inner_pretty.js:109516-109522 | function |
| `pB` | `fastModeOrgStatus` — `{status: "pending"\|"enabled"\|"disabled", reason?, source?}` | cli_inner_pretty.js:109711 | variable |
| `Q$` | `isFastModeAvailable` — `ude(e) === null` | cli_inner_pretty.js:109382-109385 | function |
| `Rig` | `fetchOrgFastModeStatus` — `GET /api/claude_code_penguin_mode` | cli_inner_pretty.js:109588-109595 | function |
| `Rji` | `guessFastModeStatusOffline` — seeds from cached `penguinModeOrgEnabled` | cli_inner_pretty.js:109596-109606 | function |
| `RIc` | `isFastModeToggleVisible` | cli_inner_pretty.js:109451-109454 | function |
| `s5r` | `isServerDisabled` | cli_inner_pretty.js:109574-109576 | function |
| `sY` | `fastModeTriState` — `"cooldown" \| "on" \| "off"` | cli_inner_pretty.js:109565-109570 | function |
| `Tji` | `setFastModeOrgStatus` — emits only on a real transition or reason change | cli_inner_pretty.js:109580-109587 | function |
| `ude` | `getFastModeUnavailableMessage` — code → string + debug log | cli_inner_pretty.js:109418-109423 | function |
| `uNd` | `buildFastModeChangeAnnouncement` — the `.218` `/config model=` notice, key `model-switch-fast-mode` (220=1/193=0) | cli_inner_pretty.js:450677-450680 | function |
| `uW` | `fastModeFlagshipLabel` — hardcoded `"Opus 5"` (193 returned `"Opus 4.8"`) | cli_inner_pretty.js:109445-109447 | function |
| `Vkt` | `fastModeAliasWithSuffix` — `"opus"` + optional `"[1m]"` | cli_inner_pretty.js:109448-109450 | function |
| `vl` | `isFastModeBuildEnabled` — firstParty + `!CLAUDE_CODE_DISABLE_FAST_MODE` | cli_inner_pretty.js:109375-109378 | function |
| `WCe` | `isFastModeInCooldown` | cli_inner_pretty.js:109562-109564 | function |
| `xig` | `describeUnavailabilityCode` — 10-arm code → user string | cli_inner_pretty.js:109424-109444 | function |
| `XJt` | `fastModeCooldownState` — `{status: "active"\|"cooldown", resetAt?, reason?}` | cli_inner_pretty.js:109701 | variable |
| `xji` | `isFastModeAllowedByPolicy` — `fastMode` → `fastModePerSessionOptIn` → `policySettings` → `flagSettings`; byte-equivalent to 193's `HOr` | cli_inner_pretty.js:109461-109466 | function |
| `z8` | `getFastModeUnavailableCode` — **220-only reason-code layer** (193 returned strings); takes an optional prospective model | cli_inner_pretty.js:109402-109417 | function |
| `ZFo` | `buildOpus47FastModeDeprecationNotice` — key `opus47-fast-mode-deprecation` (220=1/193=0) | cli_inner_pretty.js:499782-499791 | function |

---

## Module: Model Picker UI

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AJn` | `buildSonnet5Row` | cli_inner_pretty.js:120055-120065 | function |
| `Aug` | `orgAttributionSuffix` — `" · Set by your organization"` / `" · Org default"` | cli_inner_pretty.js:119999-120002 | function |
| `dit` | `substituteUnavailableRows` — entitlement-driven row substitution pass | cli_inner_pretty.js:120590-120603 | function |
| `DWi` | `buildOpusRowMinimal` | cli_inner_pretty.js:120244-120247 | function |
| `e2c` | `substituteRowValue` — what a row becomes after entitlement filtering | cli_inner_pretty.js:120570-120589 | function |
| `EJn` | `buildDefaultRow` — `"Default (recommended)"` + attribution + pricing | cli_inner_pretty.js:120006-120018 | function |
| `Goe` | `buildPricingSuffix` — per-row `{pricingSuffix, promoListPrice}`; the `.206` fix | cli_inner_pretty.js:120048-120054 | function |
| `Gug` | `disableFableRowsWithoutCredits` — `" — requires usage credits"` + `Fable (disabled)` | cli_inner_pretty.js:120656-120664 | function |
| `HWi` | `buildFableRow` | cli_inner_pretty.js:120093-120102 | function |
| `jug` | `assembleRawPickerRows` — custom option, gateway discovery, server rows, `availableModels` | cli_inner_pretty.js:120494-120559 | function |
| `KBc` | `orgDefaultSuffix` — `" · Org default"` (220=2/193=0) | cli_inner_pretty.js:120003-120005 | function |
| `kWi` | `REQUIRES_USAGE_CREDITS_SUFFIX` — `" · Requires usage credits"` (220=1/**193=2** inline appends) | cli_inner_pretty.js:120715 | constant |
| `NQt` | `isFableRowValue` | cli_inner_pretty.js:120649-120651 | function |
| `nqe` | `decorateRowsWithModelMeta` — adds `resolvedModel`, `promoListPrice`, effort flags | cli_inner_pretty.js:120604-120639 | function |
| `OQt` | `rowsReferToSameModel` | cli_inner_pretty.js:120641-120648 | function |
| `Oug` | `ensureFamilyRowPresent` | cli_inner_pretty.js:120288-120293 | function |
| `OWi` | `buildPickerOptionsWithTelemetry` — `model_picker_options` with `dropped`/`duplicates`/reason sets (220=4/193=0) | cli_inner_pretty.js:120435-120453 | function |
| `pit` | `buildPickerOptions` — dedupe → org suffix → Fable credit gate → error overrides → disabled-last | cli_inner_pretty.js:120456-120493 | function |
| `PWi` | `buildOpus1MRow` | cli_inner_pretty.js:120263-120275 | function |
| `Tug` | `normaliseFableCreditSuffix` — **strip-then-re-append**, the idempotent `.219` #9 fix | cli_inner_pretty.js:120087-120092 | function |
| `Uug` | `recordDroppedRow` — `entitlement_denied` / `allowlist_filtered` | cli_inner_pretty.js:120432-120435 | function |
| `UBc` | `buildOpus5With1MRow` — `label: "Opus (1M context)"` set at source | cli_inner_pretty.js:120200-120210 | function |
| `vde` | `pickerBuildStats` — `{dropped, duplicates, dropReasons, disabledReasons}` | cli_inner_pretty.js:120718 | variable |
| `VBc` | `isFableIdPattern` — the dated/versioned/`[1m]` Fable regex | cli_inner_pretty.js:120652-120655 | function |
| `wJn` | `familyOfModelValue` — `fable \| opus \| sonnet \| haiku \| null` | cli_inner_pretty.js:120702-120709 | function |
| `wug` | `sonnet5PromoPricing` — `"$2/$10 per Mtok · promo through <date>"`, `promoListPrice: "$3/$15"` | cli_inner_pretty.js:120043-120047 | function |
| `XBc` | `buildOpus5Row` | cli_inner_pretty.js:120147-120157 | function |
| `xWi` | `ensureAliasRowsPresent` | cli_inner_pretty.js:120282-120287 | function |
| `YBc` | `fableCreditSuffixIfNeeded` | cli_inner_pretty.js:120084-120086 | function |
| `_5r` | `pricingSuffixForModel` — gated by `uGr()` (first-party pricing only) | cli_inner_pretty.js:111178-111184 | function |
| `$Qt` | `insertFableRowAfterFamilyBlock` — the `.206` #14 anchor-recovery fix; 193's `yat` at `:236104-236123 (193)` used the *default* family instead of the *actual* anchor family | cli_inner_pretty.js:120665-120701 | function |
| `$Wi` | `resolveRowValueForSelection` | cli_inner_pretty.js:120561-120566 | function |
| `ZBc` | `noModelRestrictionsActive` | cli_inner_pretty.js:120567-120569 | function |

---

## Adjacent symbols read while working here (route to their own modules)

| Obfuscated | Readable | File:Line | Type | Owning module |
|------------|----------|-----------|------|---------------|
| `JIc` | `MODEL_RETIREMENT_TABLE` — camelCase `retirementDates` per provider; the one per-model dataset the catalogue rewrite did **not** absorb (cf. the empty `deprecation` schema slot at `:14616-14622`) | cli_inner_pretty.js:110053-110134 | object | model selection / deprecation |
| `Mcn` | `persistModelAsDefault` — `yi("userSettings", {model})` | cli_inner_pretty.js:450890-450892 | function | slash_commands |
| `Pcn` | `applyModelSwitch` — calls `IU` + `kmt` + `X2s` | cli_inner_pretty.js:450878-450889 | function | slash_commands |
| `qWf` | `buildLeaderCommandNotice` — `"/model changes the team lead's model, not this teammate's"` | cli_inner_pretty.js:748982-748998 | function | agent_team / UI |
| `Xep` | `buildLatestModelsPromptSection` — consumes `yQ().latest_per_family` for the claude-api skill | cli_inner_pretty.js:508104-508110 | function | skills_plugins |
| `X2s` | `buildModelSwitchOverrideNotice` — `"Your organization's default (X) applies on restart"` | cli_inner_pretty.js:450893-450929 | function | slash_commands |
| `xmt` | `fetchBootstrapData` — writes `orgModelDefaultCache` / `modelAccessCache` / `additionalModelOptionsCache` | cli_inner_pretty.js:450414-450499 | function | auth_providers |
| `$l_` | `bootstrapResponseSchema` — `org_model_default` at `:450610-450615`; the server row transform at `:450567-450582` **lost** 193's `Requires usage credits` append (`:350736-350738 (193)`) | cli_inner_pretty.js:450558-450640 | object | auth_providers |
