# Symbol Additions — Compaction (v2.1.156 → v2.1.183)

> **Home index:** these rows fold into `symbol_index_core_features.md` under `## Module: Compact`
> (the v2.1.156 rows there get a NEW v2.1.183 obfuscated alias — every readable name was re-minified
> between 2.1.157 and 2.1.183, so the whole module section needs the alias swap). The subagent /
> tool-execution-adjacent rows (`vF` fallback-error class, `FW` model-unavailable error, `SAi` fallback
> chain resolver, `Qtt` last-usage scan, `$T` message-token estimator, reactive engine `TGn`) also
> belong in `symbol_index_core_execution.md` (Loop / LLM-API) — cross-link rather than duplicate.

This file consolidates every obfuscated identifier touched by the v2.1.156 → v2.1.183 compaction delta:
the four real behavioral deltas (1. `--fallback-model` honoring in the summarize call; 2. the
1M-context-without-credits auto-compact-back clamp; 3. the window resolver growing from 4 to 6 sources;
4. the precompute arm table + remote-reactive gate + dispatcher prefix-overflow pre-check) PLUS the
pure re-minification renames of the otherwise-unchanged threshold ladder, dispatcher/breakers, and
full/partial pipeline (so the writer of any downstream doc can re-map a v2.1.156 name to its v2.1.183
alias without re-deriving). Rows are grouped by sub-area and sorted by `file:line` within each group.
Every `File:Line` is `cli_inner_pretty.js` **in the v2.1.183 bundle**
(`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`). The v2.1.156
obfuscated alias is carried in each Description (e.g. "v2.1.156 `Jv$`") so the rename is traceable.

Unchanged carryover (formulas, reactive group-walk, micro-compact `context_hint`, summary prompt
templates, PostCompact tail) is documented in the v2.1.156 tree and merely re-mapped here — see
`../../../claude_code_v_2.1.156/analyze/00_overview/symbol_additions_v2_1_156_compact.md` and the
`07_compact/` baseline docs.

**Cross-validated against:**
- **v2.1.183 bundle self-check** (`cli_inner_pretty.js`, TARGET): every row below re-read at its
  declaration line. Threshold/window block 226742–226983 + the model hard-cap block 134105–134192;
  session flag accessors 2965–2968; rate-limit mapper / credits-error 229176–229611; dispatcher /
  full / partial / summarize pipeline 460676–461687; fallback-chain helpers 461078–461476 and the
  `vF`/`FW` error classes 460488/461476; reactive engine `TGn` @453256; UI window-source label
  `J5p` @478040.
- **v2.1.156 bundle before-picture** (`cli_inner_pretty.js`): the threshold ladder lived at
  ~423864–424155 and the dispatcher/pipeline at ~422983–424123; `_X4` summarize @423539 (single-pass,
  `model: mainLoopModel` hardcoded, `throw Error(NH$)`); `Xl` 4-source resolver @423915; `_JH` bare
  remote check @423988; `Ov` hard cap @130165 (no `ARr` clamp). Grep-proof 0-counts for the new
  mechanisms (`tengu_1m_credits_clamp_activated`, `longContext1mCreditsBlocked`,
  `source: "clientdata"`, `source: "model-default"`, `rowan_thicket`, `tengu_amber_moleskin`,
  `tengu_precompute_arm_table_malformed`, `tengu_reactive_compact_remote`,
  `tengu_auto_compact_prefix_overflow`) all returned **0** in the v2.1.156 bundle.
- **v2.1.88 TypeScript reference** (`/lyz/codespace/3rd/claude-code/src/services/compact/`): used to
  anchor the carried-over readable names (`getAutoCompactThreshold`, `getEffectiveContextWindowSize`,
  `calculateTokenWarningState`, `compactConversation`, `autoCompactIfNeeded`, `parseWindowString`,
  `MAX_OUTPUT_TOKENS_FOR_SUMMARY`) — these readable names are stable across all three versions;
  v2.1.183 only changes the obfuscated alias (and, for the four deltas, the body).

---

## Module: Compact — Threshold & Window Resolution

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `uG` | `isRedwood3Reactive` | cli_inner_pretty.js:226742-226745 | function | `if (xr()) return !1; return !!ct("tengu_amber_redwood3","")` — reactive-mode gate; non-interactive → false. **Rename only**, byte-identical to v2.1.156 `Pc` (@423902). |
| `Kw` | `isAutoCompactEnabled` | cli_inner_pretty.js:226746-226750 | function | False if `DISABLE_COMPACT` / `DISABLE_AUTO_COMPACT` truthy, else the `autoCompactEnabled` config (default true). **Rename only** of v2.1.156 `J0` (@423983); matches v2.1.88 `isAutoCompactEnabled`. |
| `S7` | `isLocalOrRemoteReactiveAllowed` | cli_inner_pretty.js:226751-226758 | function | **CHANGED (DELTA 4b)**: was a bare "are we local" check; now `if (CLAUDE_CODE_REMOTE) { allowed only if tengu_reactive_compact_remote (cached in YNi) }`. So remote sessions CAN run reactive/proactive compaction when the new flag is on. v2.1.156 `_JH` (@423988) returned `!isEnvTruthy(CLAUDE_CODE_REMOTE)` unconditionally. |
| `yae` | `validateEnvInt` | cli_inner_pretty.js:226769-... | function | Validates an env int with default/upper bounds → `{effective, status: valid\|invalid\|capped}`. **Rename only** of v2.1.156 `n$H` (@220968). |
| `JNi` | `isValidFraction` | cli_inner_pretty.js:226785 | function | `[0,1)` per-fraction validator for the precompute arm table. **NEW** helper supporting DELTA 4a (no v2.1.156 equivalent — v2.1.156 had only the scalar `tb_`). |
| `gwd` | `parseArmEntry` | cli_inner_pretty.js:226788 | function | Parses one arm entry; requires valid `repl` + `sdk` fractions (`JNi`). **NEW** (DELTA 4a). |
| `eBi` | `parseArmTable` | cli_inner_pretty.js:226795 | function | Validates the `tengu_amber_moleskin` payload into `{entries, defaultEntry}`; strict all-or-nothing → null on any bad entry. **NEW** (DELTA 4a). |
| `tBi` | `matchArm` | cli_inner_pretty.js:226813 | function | Exact `windowSize` match → that entry, else `default` arm, else null; returns `{kind:"exact"\|"default", entry, matchedWindowKey?}`. **NEW** (DELTA 4a). |
| `gwn` | `getAutoCompactThreshold` | cli_inner_pretty.js:226818-226823 | function | `let n = e - 13000; … return Math.min(Math.floor(e*(r/100)), n)` — `effectiveWindow − 13000` with `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` floor. The 'compact'-band boundary. **Rename only** of v2.1.156 `Jv$` (@423864); formula identical; matches v2.1.88 `getAutoCompactThreshold`. |
| `mqr` | `getPrecomputeThreshold` | cli_inner_pretty.js:226824-226826 | function | `Math.min(e - Math.round(e*t.precomputeBufferFraction), gwn(e,t))` — earlier speculative-precompute trigger. **Rename only** of v2.1.156 `YX4` (@423870). |
| `nBi` | `calculateTokenWarningState` | cli_inner_pretty.js:226827-... | function | Banded classifier → `{level: ok\|warn\|compact\|blocked, pctLeft}`; `warn = threshold−20000`, `blocked = blockingBase−3000`. **Rename only** of v2.1.156 `fX4` (@423873); v2.1.88 `calculateTokenWarningState`. |
| `QNi` | `AUTOCOMPACT_BUFFER_TOKENS` | cli_inner_pretty.js:226839 | constant | `13000` — buffer subtracted from the effective window for the autocompact threshold. **Rename only** of v2.1.156 `zX4` (@423885). |
| `ZNi` | `MANUAL_COMPACT_BUFFER_TOKENS` | cli_inner_pretty.js:226840 | constant | `3000` — buffer subtracted from the blocking base for the hard blocking limit. **Rename only** of v2.1.156 `AX4` (@423886). |
| `fqr` | `DEFAULT_PRECOMPUTE_BUFFER_FRACTION` | cli_inner_pretty.js:226841 | constant | `0.2` — default precompute buffer fraction (`tengu_amber_rokovoko` scalar override). **Rename only** of v2.1.156 `qc6` (@423887). |
| `yqr` | `parseWindowString` | cli_inner_pretty.js:226843 | function | Parses `'auto'`/`Nm`/`Nk`/`N` window strings, `[100,1000]`-as-thousands shorthand, clamps to `[hwn=1e5 .. hqr=1e6]`. **Rename only** of v2.1.156 `Ac6` (@423889); byte-identical; v2.1.88 `parseWindowString`. |
| `_qr` | `opus48ExperimentWindow` | cli_inner_pretty.js:226856-... | function | `if (e!=="claude-opus-4-8") return; ct("tengu_amber_redwood2","")` — Opus-4.8-only autocompact-window override (source `'experiment'` in `z2`). **Rename only** of v2.1.156 `wX4` (@423906). |
| `ywd` | `clientDataWindow` | cli_inner_pretty.js:226865-226874 | function | **NEW (DELTA 3)**: reads `hti()?.rowan_thicket[model]` (clientDataCache) then `yti()?.[model]` (autoCompactWindowsCache), validated integer in `[hwn,hqr]`, else null. The `'clientdata'` window source. No v2.1.156 equivalent (`rowan_thicket` grep = 0 in v2.1.156). |
| `z2` | `getAutoCompactWindow` | cli_inner_pretty.js:226875-226894 | function | **CHANGED (DELTA 3)**: 6-source resolver returning `{window, configured, source}`, precedence `env > settings > clientdata > experiment > model-default > auto`. v2.1.156 `Xl` (@423915) had only 4 (env > settings > experiment > auto). The two NEW sources are `clientdata` (`ywd` @226888) and `model-default` (the 1M→200k clamp via `hwd`/`ARr` @226891). |
| `qCe` | `isConfiguredWindow` | cli_inner_pretty.js:226895-226898 | function | **CHANGED (DELTA 3)**: true iff `z2().source ∈ {env, settings, clientdata, model-default}` — now treats the two new sources as "configured". v2.1.156 `EH$` (@423931) recognized only `env`/`settings`. |
| `ywn` | `getAutoCompactWindowSource` | cli_inner_pretty.js:226899-226901 | function | Returns just the `.source` field of `z2` — the `thresholdSource` that routes reactive vs full in the dispatcher. **Rename only** of v2.1.156 `ab_` (@423935). |
| `oee` | `getEffectiveContextWindowSize` | cli_inner_pretty.js:226902-226907 | function | `resolvedWindow − min(maxOutputTokens, sBi=20000)` via `z2`. **Rename only** of v2.1.156 `_qH` (@423938); v2.1.88 `getEffectiveContextWindowSize`. |
| `_wd` | `getEffectiveContextWindowSizeRaw` | cli_inner_pretty.js:226908-226911 | function | `tH(e, Wb()) − min(maxOutputTokens, 20000)` — effective window over the RAW model cap (`tH`), ignoring env/settings/experiment; the blocking-limit base. **Rename only** of v2.1.156 `sb_` (@423944). |
| `Swd` | `reportArmTableMalformed` | cli_inner_pretty.js:226912 | function | One-shot (`oBi` latch) emit of `tengu_precompute_arm_table_malformed{payloadType}`. **NEW** (DELTA 4a). |
| `gqr` | `getPrecomputeBufferFraction` (scalar) | cli_inner_pretty.js:226916-226919 | function | `ct("tengu_amber_rokovoko", fqr=0.2)` validated `[0,1)` — the scalar fraction, now the **fallback** when the arm table is absent/malformed. **Rename only** of v2.1.156 `tb_` (@423954). |
| `bqr` | `getPrecomputeArm` | cli_inner_pretty.js:226920-226934 | function | **NEW (DELTA 4a)**: resolves `ct(bwd="tengu_amber_moleskin", null)` into a per-windowSize, `{repl,sdk}`-surface fraction; returns `{fraction, source: scalar\|malformed\|table_exact\|table_default}`. Falls back to `gqr()` at every failure. v2.1.156 had no arm table. |
| `Ewd` | `getPrecomputeBufferFractionResolved` | cli_inner_pretty.js:226935-226937 | function | `return bqr(e,t,n).fraction` — the resolved fraction fed into `Sqr` thresholdOverrides. **NEW** wrapper (DELTA 4a; extends v2.1.156 scalar `tb_`). |
| `Sqr` | `getThresholdOverrides` | cli_inner_pretty.js:226938-226947 | function | Reads `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` + `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE`; **CHANGED (DELTA 4a)**: now sets `precomputeBufferFraction: Ewd(e,t,n)` (arm-table-resolved) instead of the v2.1.156 scalar `tb_()`. v2.1.156 `jc6` (@423958). |
| `lMt` | `getAutoCompactThresholdForModel` | cli_inner_pretty.js:226948-226950 | function | `gwn(oee(e,t), Sqr(e,t))` — public autocompact threshold; also reused by the new prefix-overflow check `Yjp`. **Rename only** of v2.1.156 `DU6` (@423968); v2.1.88 `getAutoCompactThreshold`. |
| `VCe` | `calculateTokenWarningStatePublic` | cli_inner_pretty.js:226951-226955 | function | `nBi(tokens, oee(model, enabled?settings:undefined), Sqr(...), _wd(model))` — public warning-state wrapper; blocking base = raw cap (`_wd`). **Rename only** of v2.1.156 `WRH` (@423971). |
| `iBi` | `isAbovePrecomputeOrCompact` | cli_inner_pretty.js:226956-... | function | True when `tokens >= (precompute threshold when not redwood3/configured, else autocompact threshold)`; the proactive-work gate, with a `l < jQ`=200k standard-window floor for the configured/redwood3 path. **Rename only** of v2.1.156 `tv7` (@423976) (the `jQ` floor ties into the 1M clamp). |
| `sBi` | `MAX_OUTPUT_TOKENS_FOR_SUMMARY` | cli_inner_pretty.js:226965 | constant | `20000` — summary output reserve subtracted from the window. **Rename only** of v2.1.156 `MX4` (@424124); v2.1.88 same. |
| `hwn` | `WINDOW_MIN` | cli_inner_pretty.js:226966 | constant | `1e5` (100k) — lower clamp for parsed/env/configured/clientdata windows. **Rename only** of v2.1.156 `zc6` (@424125). |
| `hqr` | `WINDOW_MAX` | cli_inner_pretty.js:226967 | constant | `1e6` (1M) — upper clamp for parsed/env/configured/clientdata windows. **Rename only** of v2.1.156 `jX4` (@424126). |
| `rBi` | `AUTO_WINDOW_TABLE` | cli_inner_pretty.js:226968 (init :226982) | object | Per-model auto-window override table, initialized to empty `{}` — `'auto'` still always falls back to the model hard cap. **Rename only** of v2.1.156 `ob_` (@424154). |
| `hwd` | `MODEL_DEFAULT_CLAMP_SET` | cli_inner_pretty.js:226969 (init :226982) | object | **NEW (DELTA 3)**: `new Set(["claude-sonnet-4-6","claude-opus-4-6"])` — models always clamped to `jQ`=200k by the `'model-default'` source. No v2.1.156 equivalent. |
| `bwd` | `PRECOMPUTE_ARM_FLAG` | cli_inner_pretty.js:226970 | constant | **NEW (DELTA 4a)**: `"tengu_amber_moleskin"` — the GrowthBook flag key read by `bqr`. |
| `oBi` | `armTableMalformedLatch` | cli_inner_pretty.js:226971 (init :226971) | variable | **NEW (DELTA 4a)**: one-shot guard (`= !1`) so `Swd` fires `tengu_precompute_arm_table_malformed` at most once per session. |
| `vqr` | `RECOVERY_TIMEOUT_MS` | cli_inner_pretty.js:227081 | constant | **NEW (DELTA 4)**: `600000` — reactive-routing precompute-swap recovery timeout (the dispatcher's 7th-param swap guard). No v2.1.156 equivalent. |
| `Qtt` | `latestAssistantUsage` | cli_inner_pretty.js:227130 | function | Newest-first scan for the prior request's billed `message.usage`; feeds the new prefix-overflow probe `Yjp`. (Subagent/loop-adjacent — also belongs in `symbol_index_core_execution.md`.) |
| `J5p` | `autoCompactWindowHelpString` | cli_inner_pretty.js:478040 | function | **CHANGED (DELTA 3)**: `/config` window-source label; now branches on `'clientdata'` alongside experiment/env/settings/auto, and caps the auto arms. v2.1.156 `Pn_` (@458315) had no clientdata branch. (UI — cross-link `symbol_index_infra_integration.md`.) |

## Module: Compact — Model Hard-Cap & 1M-Credits Clamp (DELTA 2)

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `N8e` | `get1mCreditsBlocked` | cli_inner_pretty.js:2965-2967 | function | **NEW (DELTA 2)**: `return Ot.longContext1mCreditsBlocked` — session flag getter (init `false` @2624). No v2.1.156 equivalent (`longContext1mCreditsBlocked` grep = 0 in v2.1.156). |
| `Wtr` | `set1mCreditsBlocked` | cli_inner_pretty.js:2968-2970 | function | **NEW (DELTA 2)**: `Ot.longContext1mCreditsBlocked = e` — flag setter; latched true by the 429 mapper `$Cd`. |
| `Ot.longContext1mCreditsBlocked` | `SESSION.longContext1mCreditsBlocked` | cli_inner_pretty.js:2624 (init), 2966, 2969 | variable | **NEW (DELTA 2)**: session-global boolean; true once a "credits required for long context" 429 is seen, forcing the 1M model down to 200k for the rest of the session. |
| `tH` | `getContextWindowForModel` | cli_inner_pretty.js:134105-134110 | function | **CHANGED (DELTA 2)**: model hard cap; new branch `if (ARr(e,t)) return jQ` (@134108) clamps a credits-blocked 1M model to 200k. v2.1.156 `Ov` (@130165) had no clamp branch — `MAX_CONTEXT_TOKENS → 1m-suffix → header → … → P36`. v2.1.88 `getContextWindowForModel`. |
| `Ati` | `getMaxContextTokensOverride` | cli_inner_pretty.js:134111-... | function | `CLAUDE_CODE_MAX_CONTEXT_TOKENS`, honored only when `DISABLE_COMPACT` truthy. **Extracted helper** (was inline in v2.1.156 `Ov`). |
| `ARr` | `is1mClampActive` | cli_inner_pretty.js:134118-134120 | function | **NEW (DELTA 2)**: `return N8e() && Ati() === void 0 && gti(e,t) > jQ` — three-guard gate (credits-blocked AND no manual override AND raw window > 200k). Consumed by `tH` @134108 and `z2` @226891. No v2.1.156 equivalent. |
| `gti` | `rawModelWindow` | cli_inner_pretty.js:134121-... | function | Raw per-model window (`1e6` for `[1m]`/header/family, else `mxt`=200000) — the inner of the old `Ov`. **Extracted helper** in v2.1.183. |
| `mxt` | `DEFAULT_WINDOW` | cli_inner_pretty.js:134191 | constant | `200000` — default model context window (numerically equal to `jQ`, distinct meaning). **Rename of** v2.1.156 default (the old default-window literal inside `Ov`). |
| `jQ` | `STANDARD_WINDOW` | cli_inner_pretty.js:134192 | constant | `200000` — the standard window and the 1M-clamp target. **Rename only** of v2.1.156 `P36` (`MODEL_CONTEXT_WINDOW_DEFAULT` @130223). |
| `$Cd` | `rateLimitErrorMapper` | cli_inner_pretty.js:229176-229208 | function | **CHANGED (DELTA 2)**: 429 error mapper; new branch `if (s && Fwn(e.message) && !N8e()) { Wtr(!0); G("tengu_1m_credits_clamp_activated", {}) }` (@229192) latches the flag + emits the new event; the message branch (@229199) returns a "Usage credits required for 1M context" user error. No clamp logic in the v2.1.156 ancestor. |
| `Fwn` | `is1mCreditsError` | cli_inner_pretty.js:229606-... | function | **NEW (DELTA 2)**: `e.includes("Extra usage is required for long context") \|\| e.includes("Usage credits are required for long context")` — the credits-required 429 detector. |
| `DFi` | `is1mCreditsApiError` | cli_inner_pretty.js:229611-... | function | **NEW (DELTA 2)**: reactive-lane detector for a 1M-credits summarize failure; anchors the reactive token gap at `jQ` (@233040) so the reactive lane re-windows to 200k too. |

## Module: Compact — Autocompact Dispatcher & Breakers

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `Igo` | `computeRapidRefillStreak` | cli_inner_pretty.js:461481 | function | Rapid-refill counter: `prev.compacted===!0 && prev.turnCounter < Ggo(3) ? +1 : 0`. **Rename only**, byte-identical to v2.1.156 `fc6` (@423948). |
| `Yjp` | `prefixOverflowCheck` | cli_inner_pretty.js:461484-... | function | **NEW (DELTA 4c)**: computes the fixed cache-prefix token weight (via `Qtt` last-usage + `$T` estimate) vs the `lMt` threshold; returns a diagnostic payload when compaction physically cannot help. Drives `tengu_auto_compact_prefix_overflow{...,wouldHaveBlocked:!0}` (@461543). No v2.1.156 equivalent. |
| `Wgo` | `isColdCompact` | cli_inner_pretty.js:461516 | function | `return st(process.env.CLAUDE_CODE_COLD_COMPACT)`. **Rename only** of v2.1.156 `Mc6` (@423951). |
| `Xjp` | `shouldAutoCompact` | cli_inner_pretty.js:461519-... | function | Loop predicate; **only change is the local-mode gate `_JH→S7`** (`if (S7() && !uG() && !qCe(t,n)) return !1`). v2.1.156 `eb_` (@423991); v2.1.88 (predicate within `autoCompactIfNeeded`). |
| `Ego` | `autoCompactIfNeeded` | cli_inner_pretty.js:461531-... | function | `async function* Ego(...)` per-turn dispatcher; **CHANGED**: gained the §DELTA-4c prefix-overflow probe (`Yjp` @461537) and the §DELTA-4 recovery-timeout precompute-swap callback (7th param, guarded by `vqr`). Core gate cascade + reactive routing fork otherwise unchanged. **Rename of** v2.1.156 `DX4` (@424002); v2.1.88 `autoCompactIfNeeded`. |
| `Jjp` | `autoWindowSpinnerHint` | cli_inner_pretty.js:461655-... | function | **CHANGED (DELTA 3)**: spinner hint "Compacting at auto window…"; now matches `source !== "experiment" && source !== "clientdata"` (suppresses the hint for the new clientdata source too). **Rename of** v2.1.156 `Hx_` (@424095). |
| `jgo` | `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` | cli_inner_pretty.js:461663 | constant | `3` — circuit-breaker trip. **Rename only**, value unchanged, of v2.1.156 `_c6` (@424128). |
| `Ggo` | `RAPID_REFILL_TURN_WINDOW` | cli_inner_pretty.js:461664 | constant | `3` — a refill is "rapid" if `turnCounter < 3` since the prior compact. **Rename only** of v2.1.156 `Yc6` (@424129). |
| `cWn` | `RAPID_REFILL_BREAKER_COUNT` | cli_inner_pretty.js:461665 | constant | `3` — rapid-refill ("thrash") breaker trips after 3 consecutive rapid refills. **Rename only** of v2.1.156 `Y08` (@424130). |
| `wgo` | `THRASHING_USER_MESSAGE` | cli_inner_pretty.js:461687 | constant | User-facing "Autocompact is thrashing…" message; same text, interpolates `Ggo`/`cWn`. **Rename only** of v2.1.156 `Oc6` (@424155). |
| `Rt` | `logFeatureSad` | cli_inner_pretty.js:44575-... | function | Emits `tengu_feature_sad{feature_name, error_code, ...}`; used by the new `Yjp` overflow probe (`"compact_auto","compact_auto_prefix_overflow"`) and the rapid-refill breaker. **Rename of** the v2.1.156 `t$` (@41596). |
| `TGn` | `reactiveCompact` | cli_inner_pretty.js:453256-... | function | Reactive-lane orchestrator; target of the dispatcher's reactive routing fork. **Rename of** v2.1.156 `lA8` (@272213). (Loop-execution-adjacent — also `symbol_index_core_execution.md`.) |

## Module: Compact — Full / Partial Pipeline & Fallback-Model Summarize (DELTA 1)

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `vF` | `FallbackTriggeredError` | cli_inner_pretty.js:460488 | class | Error class the request layer raises to request a model fall-over; carries `originalModel`/`fallbackModel`/`reason`. Caught inside the new `del` fallback loop (@461264). Pre-existing in v2.1.156 but **NOT previously caught in the compaction path** (the compact summarize did not participate in fallback). (Also `symbol_index_core_execution.md`.) |
| `zut` | `compactConversation` | cli_inner_pretty.js:460676-... | function | Full (whole-conversation) compaction pipeline; OTEL span `D$t("claude_code.compaction",{spanType:"compaction"…})` @460682; HEAD-truncation PTL retry loop; `tengu_compact` event @460793. Retains the same 16-phase shape. **Rename only** of v2.1.156 `_eH` (@423130); v2.1.88 `compactConversation`. |
| `D$t` | `openTracingSpan` | cli_inner_pretty.js:460682 (call) | function | Starts the `'claude_code.compaction'` OTEL span (no-op unless telemetry enabled). **Rename of** v2.1.156 `xP$` (@276662). |
| `cel` | `partialCompact` | cli_inner_pretty.js:460886-... | function | Direction-aware partial compactor (`s="from"` default @460886) for `/rewind summarize`; same `up_to`/`from` discriminator, shared PTL slicer, directional anchor, `tengu_partial_compact`/`_failed` (@460991/460946). **Rename only** of v2.1.156 `qX4` (@423340). |
| `ICn` | `buildFallbackChain` | cli_inner_pretty.js:461078-461087 | function | **NEW in the compact path (DELTA 1)**: `(Array.isArray(t)?t:t!==void 0?[t]:[]).filter(r=>!XHe(e,r))` — normalizes `fallbackModel` (string\|array\|undefined) into a deduped chain, dropping fallbacks whose window is smaller than the primary's. No equivalent in v2.1.156 `_X4`. |
| `del` | `streamCompactSummary` | cli_inner_pretty.js:461088-461285 | function | **CHANGED (DELTA 1, HEADLINE)**: the summarize LLM call; now wraps the streaming body in a `while(!0)` model-fallback chain loop — builds `y = [primary, ...ICn(...).filter(≠primary)]`, threads `fallbackModel: y[_+1]` into the request, catches `vF`, emits `tengu_model_fallback_triggered{query_source:"compact", …}` (@461266), advances `_++`, retries; throws `FW` for `reason==="model_blocked"`. v2.1.156 `_X4` (@423539) was single-pass: `model: mainLoopModel` hardcoded (@423637), `throw Error(NH$)` on failure (@423678), no `fallbackModel`. The cache-prefix fork is also fallback-aware now (@461118). |
| `FW` | `ModelUnavailableError` | cli_inner_pretty.js:461476 | class | Sentinel error thrown for `reason === "model_blocked"` (`"${model} is currently unavailable."` @461284); classified by `Kjp`. **NEW** error class in the compact path (DELTA 1). |
| `Kjp` | `isModelUnavailableError` | cli_inner_pretty.js:461478-... | function | Classifier for `FW`. **NEW** (DELTA 1). |

## Module: Compact — Shared / Cross-Cutting Symbols Cited by the Delta

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `XHe` | `isSmallerWindow` | cli_inner_pretty.js:102376 | function | Window-size comparator used by `ICn`'s chain filter; calls `getContextWindowForModel` (`tH`) to drop fallbacks with a smaller window than the primary. (Model — `symbol_index_infra_platform.md`.) |
| `gti` (model) | `rawModelWindow` | cli_inner_pretty.js:134121 | function | (cross-ref to the 1M-clamp group) raw per-model window. |
| `x_` | `displayModelName` | cli_inner_pretty.js:145276 | function | Model display formatter; used in the `tengu_model_fallback_triggered` payload (`fallback_model: x_(x)`). (Model.) |
| `SAi` | `resolveFallbackModelChain` | cli_inner_pretty.js:149264-... | function | Resolves `--fallback-model` / `settings.fallbackModel` into a deduped chain capped at `xJu`=3 (@149325). Confirms the 2.1.166 `fallbackModel` setting (up-to-three) that the compact loop now honors. (Model — `symbol_index_infra_platform.md`.) |
| `xJu` | `MAX_FALLBACK_MODELS` | cli_inner_pretty.js:149325 | constant | `3` — cap on the `--fallback-model` chain length. (NOTE: dossier open-question — the schema parser `H.array(H.string())` @55907 has no explicit max-3; this `xJu` cap is the enforcement site.) |
| `MBn` | `isThinkingEnabledForModel` | cli_inner_pretty.js:368570-... | function | clientdata (`cedar_lagoon`) per-model thinking gate consulted inside the `del` fallback loop (each fallback link recomputes its thinking config). |
| `$T` | `estimateMessagesTokens` | cli_inner_pretty.js:462778 | function | Per-message token-estimate sum; feeds the prefix-token computation inside `Yjp`. (Loop/token-accounting — also `symbol_index_core_execution.md`.) |

---

## Fold-in note

These rows fold into `00_overview/symbol_index_core_features.md` under `## Module: Compact`. On merge:

- **This is a RENAME-heavy delta.** Every v2.1.156 Compact symbol got a new v2.1.183 obfuscated alias
  (the whole threshold-ladder/dispatcher/pipeline block was re-minified and moved: ladder
  ~423864→226742-226983, dispatcher/pipeline ~423130→460676-461687, model cap ~130165→134105). When
  merging, REPLACE the v2.1.156 obfuscated column for each readable name with its v2.1.183 alias above
  (the v2.1.156 alias is preserved in the Description so the lineage 88/156/183 stays traceable). Do
  NOT create duplicate readable-name rows.
- **Four genuinely-new behavioral clusters** to preserve as v2.1.183 callouts:
  1. Fallback-model summarize (DELTA 1): `ICn`, the rewritten `del`, `FW`/`Kjp`, plus the
     `vF`/`SAi`/`xJu`/`XHe`/`x_`/`MBn` supporting cast (most of which also live in the Model /
     core-execution indexes — cross-link, don't duplicate).
  2. 1M-credits clamp (DELTA 2): `N8e`/`Wtr`/`SESSION.longContext1mCreditsBlocked`, `Fwn`/`DFi`,
     `ARr`, the `tH` clamp branch, `Ati`/`gti`/`mxt`, the `$Cd` mapper, event
     `tengu_1m_credits_clamp_activated`.
  3. 6-source window resolver (DELTA 3): `ywd` (`rowan_thicket` clientdata), the `model-default`
     source + `hwd` clamp set, the updated `z2`/`qCe`/`J5p`.
  4. Precompute arm table + remote-reactive gate + prefix-overflow (DELTA 4): `bqr`/`eBi`/`gwd`/
     `JNi`/`tBi`/`Swd`/`Ewd`/`bwd`/`oBi`, the changed `S7` (remote-reactive flag), `Yjp` prefix
     overflow + `Qtt`/`$T`, and `vqr` recovery timeout.
- **Cross-index overlap** (cross-link, do not duplicate): the model-cap / fallback symbols
  (`tH`/`Ati`/`gti`/`mxt`/`jQ`/`XHe`/`x_`/`SAi`/`xJu`/`MBn`/`vF`/`FW`) and the rate-limit mapper
  (`$Cd`/`Fwn`/`DFi`) overlap `symbol_index_infra_platform.md` (Model selection / rate-limit) and
  `symbol_index_core_execution.md` (LLM-API loop / fallback). The reactive engine `TGn`, the
  dispatcher `Ego`/`Xjp`, and token-estimator `$T`/`Qtt` overlap `symbol_index_core_execution.md`. The
  UI window-source label `J5p` overlaps `symbol_index_infra_integration.md`. The Compact module owns
  the threshold/window/precompute-arm/dispatcher-breaker/summarize rows.
- **Unchanged carryover** (reactive group-walk internals, micro-compact `context_hint`, summary-prompt
  templates, PostCompact / cache-break) is NOT re-listed here — its symbols (renamed only) stay
  documented in
  `../../../claude_code_v_2.1.156/analyze/00_overview/symbol_additions_v2_1_156_compact.md`. The
  micro-compact `context_hint` beta string `context-hint-2026-04-09` is UNCHANGED across both builds.

## Related Symbols

> Mapping tables in this file ARE the source of truth for the v2.1.183 compact deltas (this is a
> `symbol_additions` file). For the broader indexes see:
> - [symbol_index_core_features.md](symbol_index_core_features.md) — Compact module home
> - [symbol_index_core_execution.md](symbol_index_core_execution.md) — Loop / LLM-API / dispatcher / fallback-error overlap
> - [symbol_index_infra_platform.md](symbol_index_infra_platform.md) — Model context window / rate-limit mapper / telemetry
> - [symbol_index_infra_integration.md](symbol_index_infra_integration.md) — `/config` window-source UI labels
>
> Module docs for these deltas:
> - [../07_compact/README.md](../07_compact/README.md) — delta overview + rename map
> - [../07_compact/fallback_model_in_compaction.md](../07_compact/fallback_model_in_compaction.md) — DELTA 1
> - [../07_compact/one_million_credits_clamp.md](../07_compact/one_million_credits_clamp.md) — DELTA 2
> - [../07_compact/window_resolver_six_sources.md](../07_compact/window_resolver_six_sources.md) — DELTA 3 + 4a
> - [../07_compact/dispatcher_delta.md](../07_compact/dispatcher_delta.md) — DELTA 4b/4c + dispatcher renames
