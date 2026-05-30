# Symbol Additions — v2.1.156 Opus 4.8 + Effort Levels (module `43_model_opus48`)

These mappings cover every obfuscated identifier introduced or touched by the v2.1.156 Opus-4.8 / effort-level
module: the seven-provider `claude-opus-4-8` config object and registry wiring, the canonical-id / label /
membership / 1M-context / output-token / cost resolution functions, the matured effort-level system
(`xhigh` enum, per-model `high`/`xhigh` defaults, the dual launch latch, the `A2`-gated effort injection that
fixes the 400 errors), the `/effort` slider Faster/Smarter relabel and its `ultracode` rail, fast-mode 2x
pricing with the deprecated `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE`, and the thinking-signature 400 hotfix
(`B87` → `cG4`).

Each row gives the v2.1.156 obfuscated identifier, the readable name (matched to the v2.1.88 TypeScript source
where a precursor exists), `file:line`, and type. Every line was verified by reading
`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` at that location.

Cross-validated against:
- v2.1.156 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/utils/model/configs.ts`, `src/utils/effort.ts`,
  `src/utils/fastMode.ts`, `src/utils/messages.ts`
- v2.1.142 reference module: `claude_code_v_2.1.142/analyze/19_think_level/`

> Home-index routing (single source of truth): when merged, the model-resolution / pricing / fast-mode /
> 1M-context rows belong in `symbol_index_infra_platform.md` (Model Selection); the effort capability gates,
> resolver, launch latch, `ultracode`, and `/effort` UI rows belong in `symbol_index_core_features.md`
> (Effort / Thinking); the slider-render UI components (`kF`/`mr4`/`lYz`/`UltraRippleText` helpers) belong in
> `symbol_index_infra_integration.md` (UI Components). They live here together while the v2.1.156 module is
> under review.

> Naming notes (canonical names, unified across all module docs as of the cross-validation pass):
> - `q48` → `getDefaultEffortForModel` (the 2.1.88 precursor `getDefaultEffortForModel` keeps the name stable;
>   the earlier `getLaunchDefaultEffortForModel` form has been retired from the docs).
> - `or` → `resolveAppliedEffort`, verified at cli_inner_pretty.js:184909-184919 (the `function or` opens at
>   184909 and its closing `}` is at 184919). An earlier 184910-184920 citation was off-by-one and is corrected.
> - `vP` → `stripContextSuffix` — `H.replace(/\[(1|2)m\]/gi, "")` (the earlier `stripSyntheticMarker` form retired).
> - `RL5` → `getEffortDescription`; `YP6` → `getEffortDescriptionWithBurnHint` (the earlier
>   `getDefaultEffortDescription` / `getEffortDescriptionWithHint` forms retired).
> - `Vx` → `ultracodeAvailable` (the earlier `isXhighAvailable` form retired).

---

## Module: Opus 4.8 + Effort Levels

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `A2` | `modelSupportsEffort` (effort-param capability gate; allow-list 4-8/4-7/4-6/sonnet-4-6, deny claude-3-*/4-0/4-1/sonnet-4-5/haiku-4-5; the gate that prevents 400s) | cli_inner_pretty.js:184798-184814 | function |
| `a$7` | `MAX_EFFORT_CAPABILITY_TAG` (`"Opus 4.6+, Sonnet 4.6"`) | cli_inner_pretty.js:184994 | constant |
| `a3K` | `getBestModel` (`"best"` alias resolver; delegates to `TT`) | cli_inner_pretty.js:98717-98719 | function |
| `AkH` | `isOpusLaunchDefaultActive` (per-model launch pin still engaged? reads `unpinOpus47/48LaunchEffort`) | cli_inner_pretty.js:184896-184900 | function |
| `ar` | `isUltracodeActive` (slider initial-index ultracode-rail predicate) | cli_inner_pretty.js:184856-184858 | function |
| `B87` | `isThinkingSignatureError` (NEW 2.1.156 400-matcher for modified/invalid thinking-block signatures) | cli_inner_pretty.js:186575-186583 | function |
| `BB` | `OPUS_STANDARD_COST` (input 5 / output 25 per Mtok — baseline 1x) | cli_inner_pretty.js:98526-98532 | constant |
| `bx1` | `OPUS_48_FAST_COST` (input 10 / output 50 — exactly 2x standard, Opus 4.8 fast) | cli_inner_pretty.js:98540-98546 | constant |
| `C0H` | `isOpus4xFamily` (membership over the opus-4-0/4-1/4-5/4-6/4-7/4-8 canonical set) | cli_inner_pretty.js:98690-98699 | function |
| `c7K` | `CANONICAL_ID_TO_KEY` (reverse map firstParty id → short registry key) | cli_inner_pretty.js:91851 | variable |
| `cG4` | `stripSignedThinkingBlocks` (recovery: drop signed/redacted blocks, insert `[Thinking removed]`, identity-stable) | cli_inner_pretty.js:446238-446252 | function |
| `CT` | `SYNTHETIC_MODEL_MARKER` (`"<synthetic>"` model sentinel; exempted from cross-model strip) | cli_inner_pretty.js:143447 | constant |
| `CUH` | `EFFORT_BETA_HEADER` (`KX("effort","effort-2025-11-24")`) | cli_inner_pretty.js:98127 | constant |
| `Cx1` | `OPUS_LEGACY_FAST_COST` (input 30 / output 150 — 6x standard, Opus 4.6/4.7 fast) | cli_inner_pretty.js:98533-98539 | constant |
| `cYz` | `DEFAULT_SLIDER_INDEX` (`3` → slider opens on `xhigh`) | cli_inner_pretty.js:527511 | constant |
| `d7K` | `CANONICAL_MODEL_IDS` (`Object.values(j3).map(c => c.firstParty)`) | cli_inner_pretty.js:91850 | variable |
| `dG4` | `stripCrossModelThinkingBlocks` (proactive: strip signed thinking from other-model turns at request build) | cli_inner_pretty.js:446235-446237 | function |
| `dN` | `EFFORT_LEVELS_WITH_MAX` (`["low","medium","high","xhigh","max"]` — resolvable set incl. legacy `max`) | cli_inner_pretty.js:185009 | variable |
| `E1H` | `normalizeEffortLabel` (coerce any non-`dN` string to `"high"`) | cli_inner_pretty.js:184960-184963 | function |
| `e$7` | `effortValueFromContext` (CLI `--effort` ?? ultracode→xhigh ?? persisted level) | cli_inner_pretty.js:185012-185017 | function |
| `eE8` | `getEffortHelpText` (`/effort` usage string; `ultracode` option gated on `Vx()`, capability tags inlined) | cli_inner_pretty.js:526897-526913 | function |
| `Ev` | `getDisplayedEffortLevel` (`normalizeEffortLabel(or(model,app) ?? "high")` — status-bar / slider source of truth) | cli_inner_pretty.js:184944-184947 | function |
| `Gi$` | `reverseLookupOverride` (maps a user `modelOverrides` value back to its short key) | cli_inner_pretty.js:91967-91977 | function |
| `gG4` | `isSignedThinkingBlock` (predicate: `redacted_thinking`, or `thinking` with non-empty `signature`) | cli_inner_pretty.js:446086-446090 | function |
| `HD` | `normalizeModelIdToCanonical` (substring matcher; any vendor id → canonical `claude-…`; tolerates `[1m]`) | cli_inner_pretty.js:98751-98769 | function |
| `HF6` | `filterSignedThinkingBlocks` (generic predicate-driven per-message signed-block stripper, no placeholder) | cli_inner_pretty.js:446218-446234 | function |
| `I9` | `isFastModeEnabled` (firstParty provider AND `!CLAUDE_CODE_DISABLE_FAST_MODE` kill-switch) | cli_inner_pretty.js:98189-98192 | function |
| `Ir4` | `BASE_SLIDER_TRIANGLE_POSITIONS` (`[1,10,20,30,40]` caret columns) | cli_inner_pretty.js:527553 | variable |
| `j3` | `MODEL_CONFIG_REGISTRY` (short-key → config map; `opus48: Xi$` is the new key) | cli_inner_pretty.js:91835-91849 | object |
| `Ji$` | `OPUS_47_MODEL_CONFIG` (the 4.7 seven-provider block 4.8 was cloned from) | cli_inner_pretty.js:91815-91824 | object |
| `jZ` | `isFastModeAvailable` (`I9() && Ne() === null`) | cli_inner_pretty.js:98196-98199 | function |
| `kF` | `UltraRippleText` (per-character ripple-colored text for the `ultracode` rail) | cli_inner_pretty.js:527205-527238 | function |
| `ki` | `isOpus46FastModeOverride` (reads deprecated `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE`, removal 06/01) | cli_inner_pretty.js:98240-98242 | function |
| `KkH` | `isResolvableEffortLevel` (`dN.includes(level)` — accepts `max` at runtime even when schema rejects it) | cli_inner_pretty.js:184859-184861 | function |
| `LE8` | `setFastModeSetting` (persist `fastMode`, send `apply_flag_settings`, auto-switch to a fast-eligible Opus) | cli_inner_pretty.js:513667-513682 | function |
| `LMH` | `getMaxOutputTokens` (per-model `{default, upperLimit}`; Opus 4.8 → 64K/128K) | cli_inner_pretty.js:130194-130218 | function |
| `lYz` | `LevelLabelRenderer` (renders one slider tick label: color/shimmer/rainbow/ripple) | cli_inner_pretty.js:527132-527172 | function |
| `m76` | `getInitialFastModeSetting` (session-start fast-mode resolution; honors `fastModePerSessionOptIn`) | cli_inner_pretty.js:98249-98256 | function |
| `m87` | `matchBetaHeaderError` (sibling 400-matcher: rejected `anthropic-beta` cache-diagnosis header) | cli_inner_pretty.js:186564-186566 | function |
| `mH` | `applyModelMenuEffort` (`/model` menu effort apply; ultracode → `SI()`+`Pi_`, else persist + reset ultracode) | cli_inner_pretty.js:460906-460921 | function |
| `mr4` | `getSliderGeometry` (5-tick base ladder + optional 6th `ultracode` rail when `Vx()`) | cli_inner_pretty.js:527105-527131 | function |
| `mUH` | `getFastModeModelId` (`"claude-opus-4-6"`/`"opus"` + optional `[1m]`) | cli_inner_pretty.js:98246-98248 | function |
| `mx1` | `resolveModelCost` (map model id + request speed → per-Mtok cost table; routes current Opus to fast pricing) | cli_inner_pretty.js:98467-98480 | function |
| `Ne` | `getFastModeUnavailableReason` (layered org/SDK/network reason string, or null = available) | cli_inner_pretty.js:98216-98238 | function |
| `NLz` | `applyEffortRequestParam` (params assembler; `delete $.effort` when `!A2(model)`, pushes `CUH` beta) | cli_inner_pretty.js:556648-556656 | function |
| `NN` | `getDefaultSonnetModel` (default Sonnet selector; `sonnet45` fallback on `!UA()`, else `sonnet46`) | cli_inner_pretty.js:98726-98730 | function |
| `NZ` | `workflowsEnabled` (workflows-enabled predicate; `allow_workflows` capability + non-pro default-on, no hard-disable) | cli_inner_pretty.js:184757-184763 | function |
| `O6$` | `BASE_TRACK_WIDTH` (`42` — slider base track width) | cli_inner_pretty.js:527507 | constant |
| `O7` | `resolveModelCanonicalId` (override- and inference-profile-ARN-aware canonical resolver over `HD`) | cli_inner_pretty.js:98770-98778 | function |
| `oR` | `providerDefaultsEffortOn` (firstParty/anthropicAws/foundry/mantle → effort-on by default) | cli_inner_pretty.js:91894-91896 | function |
| `or` | `resolveAppliedEffort` (final effort: env ?? launch-default-if-pinned ?? app-state ?? model-default; clamps max/xhigh→high) | cli_inner_pretty.js:184909-184919 | function |
| `ow$` | `modelSupportsMaxEffort` (gate for `max`; allow 4-8/4-7/4-6/sonnet-4-6) | cli_inner_pretty.js:184816-184833 | function |
| `p87` | `matchThinkingTypeError` (sibling 400-matcher: `thinking.type` enabled/adaptive mismatch; returns rejected value) | cli_inner_pretty.js:186584-186590 | function |
| `PE8` | `applyFastMode` (`/fast` toggle: re-check availability, persist, emit `tengu_fast_mode_toggled`, build pricing message) | cli_inner_pretty.js:513683-513695 | function |
| `Pi_` | `setUltracodeAppState` (reducer: `{...s, effortValue:"xhigh", ultracode:true}`) | cli_inner_pretty.js:461114-461116 | function |
| `pjH` | `toPersistableEffort` / `coerceStringLevel` (admit only low/medium/high/xhigh — never `max`) | cli_inner_pretty.js:184880-184883 | function |
| `pQ_` | `filterTrailingThinkingBlocks` (drop trailing thinking from last assistant turn; emits `tengu_filtered_trailing_thinking_block`) | cli_inner_pretty.js:446091-446110 | function |
| `q0` | `getAppliedEffortForRequest` (`A2(model) ? Ev(model,app) : undefined`) | cli_inner_pretty.js:184948-184950 | function |
| `q48` | `getDefaultEffortForModel` (per-model launch default: Opus 4.8 → `high`, Opus 4.7 → `xhigh`, else `high`) | cli_inner_pretty.js:184987-184991 | function |
| `Q76` | `getClaudePrefixedLabel` (`Claude Opus 4.8` form; `Claude (id)` fallback) | cli_inner_pretty.js:98866-98870 | function |
| `qy$` | `RIPPLE_RAMP` (8-step violet ripple color ramp, RGB (62,22,118)→(140,80,240)) | cli_inner_pretty.js:527565-527569 | variable |
| `R4H` | `isProTier` (`getSubscriptionTier() === "pro"`) | cli_inner_pretty.js:131611-131613 | function |
| `R5z` | `fastSlashHandler` (`/fast [on|off]` non-interactive arg parsing; bare `/fast` toggles) | cli_inner_pretty.js:513925-513935 | function |
| `RL5` | `getEffortDescription` (per-level prose; `xhigh` interpolates `_P6`) | cli_inner_pretty.js:184964-184977 | function |
| `rm8` | `getInferenceProfileBackingModel` (read cached Bedrock application-inference-profile → backing model) | cli_inner_pretty.js:3258-3260 | function |
| `S0H` | `selectFastModePricing` (fast on + `claude-opus-4-8` → `bx1`; else `Cx1`; else `BB`) | cli_inner_pretty.js:98451-98457 | function |
| `s$7` | `EFFORT_ALIASES` (`{ med: "medium" }`) | cli_inner_pretty.js:185010 | variable |
| `Sh9` | `VERTEX_REGION_TABLE` (canonical id → Vertex region env-var; `claude-opus-4-8` row ordered newest-first) | cli_inner_pretty.js:3618-3632 | variable |
| `si` | `get3PModelCapabilityOverride` (memoized `ANTHROPIC_*_MODEL_SUPPORTED_CAPABILITIES` env reader; `undefined` for 1P) | cli_inner_pretty.js:130257-130275 | variable |
| `SI` | `unpinOpusLaunchEffortLatch` (release BOTH 4.7 and 4.8 launch pins together via locked config writer) | cli_inner_pretty.js:184902-184908 | function |
| `T8q` | `BASE_SLIDER_LEVELS` (the 5 base slider ticks low/medium/high/xhigh/max) | cli_inner_pretty.js:527555-527561 | variable |
| `TT` | `getDefaultOpusModel` (default Opus: opus48 on firstParty, opus47 on anthropicAws/gateway, opus46 on 3P) | cli_inner_pretty.js:98720-98725 | function |
| `uB` | `getFastModeModelLabel` (`ki() ? "Opus 4.6" : "Opus 4.8"`) | cli_inner_pretty.js:98243-98245 | function |
| `UA` | `isOpusLaunchTierEligible` (firstParty OR anthropicAws OR gateway) | cli_inner_pretty.js:91891-91893 | function |
| `Ur4` | `rippleDistance` (euclidean distance to ripple origin, ×2 aspect correction) | cli_inner_pretty.js:527194-527197 | function |
| `Vx` | `ultracodeAvailable` (`workflowsEnabled() && (model === undefined || modelSupportsXhighEffort(model))`) | cli_inner_pretty.js:184853-184855 | function |
| `vP` | `stripContextSuffix` (`/\[(1|2)m\]/gi` removal of the `[1m]`/`[2m]` context-tier suffix) | cli_inner_pretty.js:98935-98937 | function |
| `vx` | `parseEffortValue` (lowercase + `med→medium` alias + level/parseInt fallback) | cli_inner_pretty.js:184870-184879 | function |
| `Wj` | `isFastModeEligibleModel` (opus-4-6/4-7/4-8; narrowed to 4-6 under the override) | cli_inner_pretty.js:98257-98263 | function |
| `wv$` | `isThinkingOrRedacted` (predicate: `thinking` OR `redacted_thinking`, signed or not) | cli_inner_pretty.js:446083-446085 | function |
| `wZ` | `getCurrentModelId` (session-effective model id; threads `TT() + (VP()?"[1m]":"")`) | cli_inner_pretty.js:98741-98747 | function |
| `$w` | `getModelDisplayName` (full label, e.g. `Opus 4.8 (1M context)`; undefined on foundry) | cli_inner_pretty.js:98916-98934 | function |
| `Xi$` | `OPUS_48_MODEL_CONFIG` (seven-provider id map for `claude-opus-4-8` + `eagerInputStreaming`) | cli_inner_pretty.js:91825-91833 | object |
| `xP6` | `matchMidConvSystemRoleError` (sibling 400-matcher: rejected mid-conversation `role:"system"`) | cli_inner_pretty.js:186568-186574 | function |
| `xUH` | `FAST_MODE_BETA_HEADER` (`KX("speed","fast-mode-2026-02-01")`) | cli_inner_pretty.js:98131 | constant |
| `xYz` | `parseEffortArg` (`/effort <arg>`; `auto`/`unset`→undefined, `ultracode`→xhigh when `Vx()`, else strict parse) | cli_inner_pretty.js:526915-526921 | function |
| `ycH` | `modelSupportsXhighEffort` (gate for `xhigh`; allow **Opus 4.8/4.7 only**) | cli_inner_pretty.js:184834-184851 | function |
| `Yz` | `getResolvedModelMap` (registry after applying user `modelOverrides`) | cli_inner_pretty.js:91986-91990 | function |
| `YP6` | `getEffortDescriptionWithBurnHint` (append "burns fastest — medium handles most tasks" on high+Pro+`tengu_slate_finch`) | cli_inner_pretty.js:184978-184986 | function |
| `yx1` | `disabledReasonMessage` (org-status reason code → user-facing fast-mode string; `/usage-credits` rename) | cli_inner_pretty.js:98200-98215 | function |
| `zkH` | `readEnvEffortLevel` (`CLAUDE_CODE_EFFORT_LEVEL`; `unset`/`auto`→null tri-state) | cli_inner_pretty.js:184892-184895 | function |
| `Zj` | `getModelShortLabelOrId` (short label with raw-id fallback) | cli_inner_pretty.js:98861-98865 | function |
| `ZOH` | `getModelShortLabel` (compact label, e.g. `Opus 4.8`, `(1M context)` via `[1m]` suffix) | cli_inner_pretty.js:98828-98860 | function |
| `zP6` | `readUltracodeFlag` (`i6().ultracode === true`; side-effect calls `SI()` to release the latch) | cli_inner_pretty.js:184884-184887 | function |
| `zv` | `formatCost` (format a cost table as `"$X/$Y per Mtok"`) | cli_inner_pretty.js:98501-98503 | function |
| `_P6` | `XHIGH_CAPABILITY_TAG` (`"Opus 4.8/4.7 only"`) | cli_inner_pretty.js:184993 | constant |

---

## Cross-validation notes

- **Opus 4.8 is a wholly new model.** The 2.1.88 `ALL_MODEL_CONFIGS` registry (configs.ts:87-99) ceilings at
  `opus46`; the 2.1.88 config shape has only four provider keys (firstParty/bedrock/vertex/foundry). `Xi$`/`Ji$`
  add `anthropicAws`/`mantle`/`gateway` and a per-config `eagerInputStreaming` flag. Confidence: HIGH.
- **Effort lineage.** `A2`/`ow$`/`or`/`zkH`/`vx` are direct descendants of 2.1.88 `modelSupportsEffort`/
  `modelSupportsMaxEffort`/`resolveAppliedEffort`/`getEffortEnvOverride`/`parseEffortValue` (`src/utils/effort.ts`).
  `ycH` (`modelSupportsXhighEffort`), the launch latch (`AkH`/`SI`), `ultracode` (`Vx`/`Pi_`/`zP6`), and the
  `A2`-gated injection (`NLz`) are NEW post-2.1.88. Confidence: HIGH on the lineage, NEW marked where stated.
- **Fast mode.** Availability machinery (`I9`/`Ne`/`jZ`/`m76`/`yx1`) tracks 2.1.88 `src/utils/fastMode.ts`
  near-1:1 (restructured). The dual-tier pricing (`bx1` 2x vs `Cx1` 6x), the override trio (`ki`/`uB`/`mUH`),
  and the eligibility expansion to 4-6/4-7/4-8 (`Wj`) are NEW. Confidence: HIGH.
- **Thinking-signature hotfix.** `B87` (matcher) and `tengu_thinking_signature_strip_retry` are NEW in 2.1.156;
  the strip primitives (`cG4`/`HF6`/`gG4`/`pQ_`) evolve 2.1.88 `stripSignatureBlocks` /
  `filterTrailingThinkingFromLastAssistant`. Confidence: MEDIUM-HIGH.
