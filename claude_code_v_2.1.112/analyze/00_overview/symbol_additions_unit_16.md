# Symbol Additions — Unit 16: think_level effort + Opus 4.7

This file lists new and refined symbol mappings discovered while analyzing
`19_think_level/` (effort levels, model selection, `/effort` slider, Opus 4.7
auto mode, `/model` switch warning). These mappings supplement
`symbol_index.md` and should eventually be merged into
`symbol_index_core_features.md` (effort/model topics) and
`symbol_index_infra_platform.md` (model selection helpers).

---

## Module: Effort / Model (chunks.80.mjs)

### Effort gates and resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `QI` | `modelSupportsEffort` (`opus-4-7`, `opus-4-6`, `sonnet-4-6` → true) | chunks.80.mjs:2684-2692 | function |
| `Ct6` | `modelSupportsMaxEffort` (blocklist-driven; default-allow unknown models) | chunks.80.mjs:2701-2706 | function |
| `bt6` | `modelSupportsXhigh` (Opus 4.7 only) | chunks.80.mjs:2708-2712 | function |
| `Nh8` | `isValidEffortLevel` (against EFFORT_LEVELS) | chunks.80.mjs:2714-2716 | function |
| `id` | `parseEffortValue` | chunks.80.mjs:2718-2726 | function |
| `It6` | `parseSettingsEffortLevel` (filters numeric/`max`) | chunks.80.mjs:2728-2731 | function |
| `n8z` | `readSettingsEffortLevel` | chunks.80.mjs:2733-2735 | function |
| `EM4` | `resolvePickerEffortPersistence` | chunks.80.mjs:2737-2739 | function |
| `Zj6` | `readEnvEffortLevel` (`CLAUDE_CODE_EFFORT_LEVEL` parser; `unset`/`auto` → null) | chunks.80.mjs:2741-2744 | function |
| `wy6` | `resolveAppliedEffort` (env → appState → default; max/xhigh downgrade to high) | chunks.80.mjs:2746-2755 | function |
| `CF1` | `unpinAndApplyEffort` (sets `unpinOpus47LaunchEffort=true` + applies effort) | chunks.80.mjs:2757-2764 | function |
| `$y6` | `resolveAppliedEffortOrHigh` | chunks.80.mjs:2766-2769 | function |
| `jy6` | `formatEffortDescription` (` with <level> effort` suffix) | chunks.80.mjs:2771-2776 | function |
| `NM4` | `isValidNumericEffort` | chunks.80.mjs:2778-2780 | function |
| `xt6` | `coerceEffortLevel` (numeric or unknown → `high`) | chunks.80.mjs:2782-2785 | function |
| `i8z` | `getEffortLevelDescription` | chunks.80.mjs:2787-2799 | function |
| `bF1` | `getEffortLevelDescriptionForUI` (adds "burns fastest" hint on Pro `high` w/ `tengu_slate_finch`) | chunks.80.mjs:2802-2809 | function |
| `IF1` | `getDefaultEffortForModel` (Opus 4.7 → `xhigh`; Opus 4.6 Pro/Max → `medium`) | chunks.80.mjs:2811-2819 | function |
| `kh8` | `modelSupportsAdaptiveThinking` | chunks.80.mjs:2653-2660 | function |
| `l8z` | `stripModelVersionSuffix` (`-v2:0`, `-20251022`) | chunks.80.mjs:2694-2699 | function |

### Effort/Model constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `UI` | `EFFORT_LEVELS` (`["low","medium","high","xhigh","max"]`) | chunks.80.mjs:2835 | constant |
| `c8z` | `MAX_EFFORT_BLOCKLIST` (Set of `claude-3-*`, `claude-sonnet-4-*` 4-0/4-5, `claude-opus-4-0/1/5`) | chunks.80.mjs:2836 | constant |

### Subscriber-tier helpers (chunks.61.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `MK` | `getCurrentTier` | chunks.61.mjs:1201-1207 | function |
| `JB` | `isProPlan` (`MK() === "pro"`) | chunks.61.mjs:1225-1227 | function |
| `ch` | `isMaxPlan` (`MK() === "max"`) | chunks.61.mjs:1209-1211 | function |
| `Yq6` | `isTeamMax5xPlan` (`MK() === "team"` + `tQ() === "default_claude_max_5x"`) | chunks.61.mjs:1217-1219 | function |
| `O2_` | `isTeamPlan` | chunks.61.mjs:1213-1215 | function |
| `mV8` | `isEnterprisePlan` | chunks.61.mjs:1221-1223 | function |
| `tQ` | `getRateLimitTier` | chunks.61.mjs:1229-1236 | function |
| `BV8` | `getTierDisplayName` | chunks.61.mjs:1238-1251 | function |

### Model resolution (chunks.44.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `LE` | `getDefaultOpusModel` (returns `opus47` when `KA()` true) | chunks.44.mjs:560-564 | function |
| `Af` | `getDefaultSonnetModel` | chunks.44.mjs:566-570 | function |
| `xT6` | `getDefaultHaikuModel` | chunks.44.mjs:572-575 | function |
| `Aw6` | `isOpusFamilyModel` | chunks.44.mjs:534-537 | function |
| `hv` | `getInitialMainLoopModel` (Max/Team-Max5x → Opus 4.7; else Sonnet) | chunks.44.mjs:592-596 | function |
| `ZP` | `getInitialMainLoopModelId` (= `K5(hv())`) | chunks.44.mjs:598-600 | function |
| `AX` | `resolveModelFamilyId` (strips date suffix, normalizes `claude-<family>-<ver>`) | chunks.44.mjs:602-619 | function |
| `o5` | `resolveModelId` (`AX(zZ8(model))`) | chunks.44.mjs:621-623 | function |
| `uT6` | `getDefaultModelDescription` | chunks.44.mjs:625-631 | function |
| `Ub` | `getConfiguredModel` (env/settings model) | chunks.44.mjs:539-548 | function |
| `G5` | `getActiveModel` (configured ?? initial) | chunks.44.mjs:550-554 | function |
| `OM` | `getSmallFastModel` (`ANTHROPIC_SMALL_FAST_MODEL` ?? default haiku) | chunks.44.mjs:530-532 | function |
| `YX` | `isOpus47LaunchEligibleTier` (gates 1M context label on Max-tier Opus 4.7) | chunks.44.mjs:644-648 | function |
| `HB` | `selectMainLoopModelForMode` (opusplan/haiku plan-mode overrides) | chunks.44.mjs:580-590 | function |
| `bF9` | `getSonnetModelWithContextSuffix` | chunks.44.mjs:577-579 | function |

---

## Module: Effort Slider (chunks.189.mjs)

### Slider component + handlers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `IoY` | `EffortSliderComponent` (5-position slider, ←/→/Enter handler) | chunks.189.mjs:1193-1341 | function |
| `koY` | `setEffortValueFromSlider` (persists `effortLevel`, fires telemetry, sets unpin flag, returns message) | chunks.189.mjs:980-1019 | function |
| `KtK` | `formatCurrentEffortMessage` (`/effort current` output) | chunks.189.mjs:1021-1031 | function |
| `NoY` | `clearEffortLevel` (`/effort auto`/`unset`) | chunks.189.mjs:1033-1059 | function |
| `sj7` | `executeEffortArg` (dispatches `auto`/`unset`/level) | chunks.189.mjs:1061-1068 | function |
| `EoY` | `ShowCurrentEffortFC` (functional component) | chunks.189.mjs:1070-1077 | function |
| `LoY` | `ApplyEffortAndCloseFC` (sets AppState then `onDone(message)`) | chunks.189.mjs:1083-1104 | function |
| `zz8` | `EffortLevelLabel` (renders single level; rainbow/shimmer/normal) | chunks.189.mjs:1106-1143 | function |
| `CoY` | `RainbowAnimatedLabel` (used for `max`) | chunks.189.mjs:1145-1164 | function |
| `boY` | `ShimmerAnimatedLabel` (used for `xhigh`, color `#d0b4ff`) | chunks.189.mjs:1166-1191 | function |
| `xoY` | `getEffortLabelSpacer` (per-position pad widths) | chunks.189.mjs:1343-1345 | function |
| `uoY` | `nextEffortIndex` (clamped right) | chunks.189.mjs:1347-1349 | function |
| `moY` | `prevEffortIndex` (clamped left) | chunks.189.mjs:1351-1353 | function |
| `BoY` | `selectEffortValueFromAppState` | chunks.189.mjs:1355-1357 | function |
| `poY` | `effortCommandEntrypoint` (the `/effort` async handler) | chunks.189.mjs:1359-1383 | function |

### Slider constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `J66` | `SLIDER_LEVELS` (5 entries with `value`+`color`: low=warning, medium=success, high=permission, xhigh=autoAccept-shimmer, max=rainbow-animated) | chunks.189.mjs:1412-1427 | constant |
| `hoY` | `SLIDER_TICK_POSITIONS` (`[1, 10, 20, 30, 40]`) | chunks.189.mjs:1427 | constant |
| `RoY` | `SLIDER_LABEL_SPACERS` (`[5, 5, 5, 6]`) | chunks.189.mjs:1427 | constant |
| `esK` | `DEFAULT_SLIDER_INDEX` (= 3, the `xhigh` position) | chunks.189.mjs:1391 | constant |
| `qtK` | `SLIDER_TRACK_WIDTH` (= 42) | chunks.189.mjs:1393 | constant |
| `SoY` | `SHIMMER_HIGHLIGHT_COLOR` (= `"#d0b4ff"`) | chunks.189.mjs:1399 | constant |
| `VoY` | `EFFORT_HELP_ARGS` (`["help","-h","--help"]`) | chunks.189.mjs:1411 | constant |
| `YtK` | `effortCommandDef` (`/effort` slash command descriptor) | chunks.189.mjs:1430-1444 | object |

---

## Module: Effort Slider (chunks.168.mjs — embedded in ModelPicker)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `KhY` | `applyEffortChange` (cycles `low/medium/high[/xhigh][/max]` based on model gates) | chunks.168.mjs:951-959 | function |
| `eA7` | `getDefaultEffortForCurrentModel` (= `xt6(IF1(resolved))`) | chunks.168.mjs:961-964 | function |
| `qO7` | `resolveModelOrInitial` (= `K5(model)` or `ZP()` for `__NO_PREFERENCE__`) | chunks.168.mjs:928-931 | function |
| `HxK` | `EffortGlyph` (renders a colored ▲ glyph for the picker) | chunks.168.mjs:933-949 | function |
| `eLY` | `selectEffortValueState` (AppState selector) | chunks.168.mjs:920-922 | function |
| `qhY` | `selectFastModeState` (gated by `q5()`) | chunks.168.mjs:924-926 | function |
| `sLY` | `setUnpinOpus47LaunchEffortFlag` (idempotent setter) | chunks.168.mjs:906-911 | function |
| `tLY` | `mapNullToNoPreference` | chunks.168.mjs:913-918 | function |
| `nn8` | `MODEL_NO_PREFERENCE_SENTINEL` (`"__NO_PREFERENCE__"`) | chunks.168.mjs:970 | constant |
| `NP6` | `isBilledAsExtraUsage` (returns true when subscription tier requires extra-usage billing for selected model) | chunks.168.mjs:995-1006 | function |
| `gH6` | `formatEffortLabel` (e.g. xHigh, High, Max) | utility | function |

---

## Module: Model Switch Warning (chunks.188.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `taK` | `ModelSwitchConfirmationDialog` ("Switch model?" + cache-invalidation warning + Yes/No picker) | chunks.188.mjs:2206-2266 | function |
| `aaK` | `resolveModelOrInitialForPicker` | chunks.188.mjs:2268-2270 | function |
| `WrY` | `isModelPickerCommand` (filters `--model` aliases) | chunks.188.mjs:2272-2274 | function |
| `DrY` | `needsOpus1mWarning` (non-Pro/Max-eligible asking for Opus[1m]) | chunks.188.mjs:2276-2279 | function |
| `ZrY` | `needsSonnet1mWarning` | chunks.188.mjs:2281-2284 | function |
| `frY` | `ShowCurrentModelFC` (`/model` no-arg output) | chunks.188.mjs:2286-2294 | function |
| `GrY` | `selectEffortValueState` (alt) | chunks.188.mjs:2296-2298 | function |
| `TrY` | `mainLoopModelSelector` | chunks.188.mjs (vicinity) | function |
| `vrY` | `mainLoopModelForSessionSelector` | chunks.188.mjs (vicinity) | function |
| `fL` | `formatModelName` (pretty model name for UI) | utility | function |
| `Y8` | `chalkStyles` (ANSI color writer) | utility | object |

---

## Module: Welcome Banner — Opus 4.7

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `UdK` | `opus47WelcomeDialog` (renders the "Opus 4.7 is here" + "Welcome to Opus 4.7 xhigh!" launch dialog) | chunks.181.mjs:1662-1677 | function |
| `pdK` | `OPUS47_WELCOME_TOAST` (= `"Welcome to Opus 4.7 xhigh! · /effort to tune speed vs. intelligence"`) | chunks.181.mjs:1685 | constant |
| `qUY` | `OPUS47_WELCOME_HEADLINE` (= `"Welcome to Opus 4.7 xhigh!"`) | chunks.181.mjs:1687 | constant |

---

## Module: AppState (Opus 4.7 launch effort flag)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `H8` | `getAppConfig` | utility | function |
| `d8` | `updateAppConfig` (immutable updater) | utility | function |
| `.unpinOpus47LaunchEffort` | App-config flag; once true, the auto `xhigh` default for Opus 4.7 is "released" and user-applied effort sticks | chunks.168.mjs/189.mjs (referenced) | boolean |

---

## v2.1.88 → v2.1.112 equivalents (think_level scope)

| Concept | v2.1.88 file | v2.1.112 chunk |
|---------|--------------|----------------|
| `EFFORT_LEVELS` (4 → 5) | `src/utils/effort.ts:13-18` (4 levels) | `chunks.80.mjs:2835` (5 levels incl. `xhigh`) |
| `modelSupportsEffort` | `src/utils/effort.ts:22-49` | `chunks.80.mjs:2684-2692` (adds `opus-4-7` check) |
| `modelSupportsMaxEffort` (deny logic) | `src/utils/effort.ts:51-65` (allowlist: only `opus-4-6` + ant overrides) | `chunks.80.mjs:2701-2706` (**blocklist**: deny only known legacy/Sonnet/older Opus) |
| `getDefaultEffortForModel` | `src/utils/effort.ts:279-329` (no `opus-4-7` default) | `chunks.80.mjs:2811-2819` (Opus 4.7 → `xhigh`) |
| `/effort` command def | `src/commands/effort/index.ts:8` (`[low|medium|high|max|auto]`) | `chunks.189.mjs:1430-1444` (`[low|medium|high|xhigh|max|auto]`) |
| `/effort` interactive slider | (no slider in 2.1.88) | `chunks.189.mjs:1193-1341` (`IoY` component) |
| `--effort` CLI flag | (none in 2.1.88) | `chunks.222.mjs:42-46` (validator includes `xhigh`) |
| `/model` mid-conversation warning | (no warning in 2.1.88) | `chunks.188.mjs:2206-2266` (`taK`) |
| `unpinOpus47LaunchEffort` config | (n/a in 2.1.88) | `chunks.168.mjs:906-911`, app-config flag |
| Opus 4.7 welcome banner | (n/a in 2.1.88) | `chunks.181.mjs:1662-1687` |
