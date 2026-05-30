# Symbol Additions — v2.1.156 Lean System Prompt (module `44_lean_prompt`)

These mappings cover every obfuscated identifier introduced or touched by the v2.1.156 lean-system-prompt
module: the memoized lean-vs-full gate (`X3`), its model-class allow-list (`c45`), the `-eap` bypass
(`gM6`), the server/growthbook force-lean override (`d45`), the provider classifier (`UA`/`Zq`/`oR`) and
model-id normalization (`O7`/`HD`/`Gi$`), the env/bool override parsers (`xH`/`k4`), the memoize primitive
(`cx8`/`v8`), the assembler swap (`N0`) and the section cache (`DE`/`uv7`/`SYH`/`Qm8`/`gm8`), the lean
`# Harness` section (`oXz`) and the six full section builders (`QXz`/`gXz`/`dXz`/`cXz`/`lXz`/`rXz`), the
within-section lean variants (`uXz`/`mXz`/`fLz`+`YLz`/`ALz`/`rKq`+`OLz`), the lean-aware tool descriptions
(`z44`, `W47`), the memory/auto-mode/agent-listing lean flips (`SFK`/`HR_`), and the distinct Fast-Mode
opus cousins (`Wj`/`m76`/`ki`/`uB`).

Each row gives the v2.1.156 obfuscated identifier, the readable name (matched to the v2.1.88 TypeScript
source where a precursor exists), `file:line`, and type. Every line was verified by reading
`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` at that location.

Cross-validated against:
- v2.1.156 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/constants/prompts.ts` (`getSystemPrompt`,
  `getSimpleIntroSection`, `getSimpleSystemSection`, `getSimpleDoingTasksSection`,
  `getSimpleToneAndStyleSection`); `src/utils/model/*`
- v2.1.156 sibling module: `claude_code_v_2.1.156/analyze/43_model_opus48/` (shares the provider/
  normalization/Fast-Mode neighbourhood: `O7`/`HD`/`Gi$`/`UA`/`Zq`/`Wj`/`m76`/`ki`/`uB`)

> Home-index routing (single source of truth): when merged, the gate / provider / normalization / memoize /
> env-parser / Fast-Mode rows belong in `symbol_index_infra_platform.md` (Model Selection, Prompt Building);
> the assembler / section-cache / section-builder / tool-description / reminder rows belong in
> `symbol_index_core_execution.md` (System Prompts, Tools). They live here together while the v2.1.156
> module is under review.

> Naming / disambiguation notes:
> - `c45` returns `true` for **full** (it is "is this a model that keeps the FULL prompt"), not for lean.
>   `X3` negates it: `!c45(model)`. Easy to misread the polarity.
> - `cx8` and `v8` are the same lodash `memoize` — `v8 = cx8` at cli_inner_pretty.js:1492; `cx8` is the
>   definition (1475-1486), `v8` is the assigned alias actually used to wrap `X3`.
> - `UA` (`{firstParty, anthropicAws, gateway}`) and `oR` (`{firstParty, anthropicAws, foundry, mantle}`)
>   are *different* provider-class predicates. The lean gate uses `UA`; `oR` is shown only for contrast.
> - `Wj`/`m76`/`ki`/`uB` belong to the **Fast Mode** path (sibling module `43_model_opus48`), NOT the lean
>   gate; included here because the docs explicitly disambiguate them from `X3`.
> - The scout anchor labels `z44` "Read tool-result trimming"; the verified function at 376250-376251 is the
>   **Todo** tool-description picker (`Y0_`/`f0_` are Todo descriptions). The `X3`-driven mechanism is
>   identical; the canonical readable name below is `getTodoToolDescription` (`z44`).

---

## Module: Lean System Prompt

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ALz` | `focusModeFullText` (full focus-mode body; spells out "This overrides earlier guidance…") | cli_inner_pretty.js:555896-555897 | constant |
| `BXz` | `buildHooksSection` (hooks-trust bullet, shared by lean inline and full `# System`) | cli_inner_pretty.js:555418-555420 | function |
| `c45` | `isFullPromptModel` (static allow-list; `true` ⇒ keep FULL prompt: claude-3-*/haiku/sonnet/opus-4-0..4-7; `false` ⇒ lean for opus-4-8; unknown id → `!UA()`) | cli_inner_pretty.js:143847-143862 | function |
| `cKq` | `isSimplePromptMode` (`CLAUDE_CODE_SIMPLE` hard short-circuit → CWD+Date only; predates lean) | cli_inner_pretty.js:555588-555590 | function |
| `cXz` | `buildFullExecutingActionsSection` (full `# Executing actions with care`; largest full block; `rKq==="compact"` variant) | cli_inner_pretty.js:555494-555510 | function |
| `cx8` | `memoize` (lodash memoize definition; default cache key = first arg) | cli_inner_pretty.js:1475-1486 | function |
| `d45` | `isForcedLeanModel` (server/growthbook force-lean: `clientDataCache.simple_system_prompt` OR `tengu_velvet_cascade.models`; additive-only) | cli_inner_pretty.js:143839-143845 | function |
| `DE` | `makeSection` (wraps name + compute closure into `{name, compute, cacheBreak:false}` cacheable record) | cli_inner_pretty.js:271350-271352 | function |
| `Dv` | `initLeanPromptModule` (lazy module init that assigns the memoized `X3`) | cli_inner_pretty.js:143865-143877 | variable |
| `dXz` | `buildFullDoingTasksSection` (full `# Doing tasks`; gated by `keepCodingInstructions`; `tengu_verified_vs_assumed` bullet) | cli_inner_pretty.js:555461-555493 | function |
| `fLz` | `buildFocusModeSection` (focus-mode selector; lean ⇒ `YLz`, full ⇒ `ALz`; null when not focus/non-interactive) | cli_inner_pretty.js:555862-555867 | function |
| `gm8` | `clearSystemPromptSectionCache` (clears the per-session section cache Map) | cli_inner_pretty.js:3202-3204 | function |
| `gM6` | `isEarlyAccessModel` (`/-eap($|\[)/i` raw-id test; checked before normalization to force lean-eligibility) | cli_inner_pretty.js:143836-143838 | function |
| `gXz` | `buildFullSystemSection` (full `# System`; 6 bullets incl. `BXz` hooks paragraph + context-compression) | cli_inner_pretty.js:555449-555460 | function |
| `HR_` | `buildAutoModeReminder` (auto-mode classifier; lean models return `[]` — no `auto_mode` reminder injected) | cli_inner_pretty.js:412889-412893 | function |
| `i6$` | `latestModelIds` (`{opus:"claude-opus-4-8", sonnet:"claude-sonnet-4-6", haiku:"claude-haiku-4-5-…"}`; opus = lean default) | cli_inner_pretty.js:555940 | variable |
| `k4` | `parseBoolFalse` (explicit-false env parser: `0/false/no/off`; NOT the complement of `xH`) | cli_inner_pretty.js:1801-1806 | function |
| `ki` | `isOpus46FastModeOverride` (reads `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE`; Fast Mode, not lean) | cli_inner_pretty.js:98240-98242 | function |
| `lXz` | `buildFullUsingToolsSection` (full `# Using your tools`; Todo usage, dedicated-tools-over-shell, parallel calls) | cli_inner_pretty.js:555511-555534 | function |
| `m76` | `getInitialFastModeSetting` (session-start fast-mode predicate; calls `Wj`; Fast Mode, not lean) | cli_inner_pretty.js:98249-98255 | function |
| `mXz` | `buildActionCautionSection` (lean-ONLY one-liner condensing the full `# Executing actions` section; null under full) | cli_inner_pretty.js:555414-555417 | function |
| `N0` | `buildSystemPromptSections` (main async assembler; terminal switch picks lean 1-section vs full 6-section body; consumes `X3`) | cli_inner_pretty.js:555614-555658 | function |
| `O7` | `normalizeModelId` (canonical id resolver: override-alias `Gi$` → inference-profile ARN → `HD`) | cli_inner_pretty.js:98770-98778 | function |
| `oR` | `isFirstPartyOrFoundryMantle` (provider class `{firstParty, anthropicAws, foundry, mantle}`; contrast with `UA`, NOT used by lean gate) | cli_inner_pretty.js:91894-91895 | function |
| `OLz` | `buildInvestigateFirstSection` (emits investigate-first guidance unless `rKq` mode is "off") | cli_inner_pretty.js:555878-555881 | function |
| `oU` | `prependBullets` (converts string list to ` - bullet` / `  - subbullet` lines) | cli_inner_pretty.js:555439-555441 | function |
| `oXz` | `leanHarnessSection` (the single lean body: role + cyber-risk + `# Harness` 6 bullets) | cli_inner_pretty.js:555591-555607 | function |
| `Qm8` | `setSystemPromptSectionCacheEntry` (writes a computed section into the cache Map) | cli_inner_pretty.js:3199-3201 | function |
| `QXz` | `buildFullIntroSection` (full intro: "You are an interactive agent…" + cyber-risk + no-URL-guessing) | cli_inner_pretty.js:555442-555448 | function |
| `rKq` | `investigateFirstMode` (clarifying-question policy; only opus-4-7 opts in; forced "off" under lean) | cli_inner_pretty.js:555868-555877 | function |
| `rXz` | `buildFullToneAndStyleSection` (full `# Tone and style`; no-emojis, concise, `file_path:line_number`, no colon before tool calls) | cli_inner_pretty.js:555578-555587 | function |
| `SFK` | `isMemoryAutoLoadSection` (memory sub-behavior gate; `if (X3(H)) return !1` — suppressed for lean) | cli_inner_pretty.js:145119-145124 | function |
| `SYH` | `getSystemPromptSectionCache` (accessor for the per-session section cache Map) | cli_inner_pretty.js:3196-3197 | function |
| `UA` | `isFirstPartyProvider` (provider class `{firstParty, anthropicAws, gateway}`; behind `c45`'s unknown-id fall-through) | cli_inner_pretty.js:91891-91893 | function |
| `uB` | `getFastModeModelLabel` (`ki() ? "Opus 4.6" : "Opus 4.8"`; Fast Mode label, not lean) | cli_inner_pretty.js:98243-98245 | function |
| `uv7` | `computeCachedSections` (resolves each `DE` section via cache; computes at most once per session) | cli_inner_pretty.js:271353-271362 | function |
| `uXz` | `buildAntiVerbositySection` (lean one-liner "Write code that reads like the surrounding code…" vs full `# Text output` block) | cli_inner_pretty.js:555399-555413 | function |
| `v8` | `memoize` (alias `v8 = cx8`; the form actually used to wrap `X3`) | cli_inner_pretty.js:1492 | variable |
| `W47` | `getWebFetchToolDescription` (lean ⇒ short blurb, full ⇒ long "IMPORTANT: WebFetch WILL FAIL…"; selected by `X3`) | cli_inner_pretty.js:206793-206797 | function |
| `Wj` | `isOpus46OrNewer` (Fast-Mode opus membership test opus-4-6/4-7/4-8; guarded by `I9()`; NOT the lean gate) | cli_inner_pretty.js:98257-98263 | function |
| `X3` | `isLeanSystemPrompt` (memoized top-level gate; `true` ⇒ lean: `!c45(model) || d45(model)`, env override first) | cli_inner_pretty.js:143864, 143872-143877 | variable |
| `xH` | `parseBoolTrue` (explicit-true env parser: `1/true/yes/on`, case-insensitive trimmed) | cli_inner_pretty.js:1795-1799 | function |
| `YLz` | `focusModeLeanText` (lean focus-mode body; tighter single-paragraph with enumerated "investigated/found/changed…") | cli_inner_pretty.js:555898-555899 | constant |
| `z44` | `getTodoToolDescription` (lean ⇒ terse `Y0_`, full ⇒ multi-section `f0_`; selected by `X3`) | cli_inner_pretty.js:376250-376251 | function |
| `Zq` | `currentProvider` (resolves provider from env: bedrock/foundry/anthropicAws/mantle/vertex else firstParty) | cli_inner_pretty.js:91853-91864 | function |
| `Gi$` | `resolveModelOverrideAlias` (reverse-map a user `modelOverrides` value back to its key; used by `O7`) | cli_inner_pretty.js:91967-91977 | function |
| `HD` | `canonicalizeOpusModelId` (substring waterfall: any vendor/dated id → canonical `claude-…`; strips trailing `-YYYYMMDD`) | cli_inner_pretty.js:98751-98768 | function |

---

## Cross-validation notes

- **The per-model lean/full gate is NEW post-2.1.88 (HIGH confidence).** A grep of the entire v2.1.88
  `src/` for `isLeanSystemPrompt`, `isFullPromptModel`, `isForcedLeanModel`, `isEarlyAccessModel`,
  `velvet_cascade`, `simple_system_prompt`, and `SIMPLE_SYSTEM_PROMPT` returns no matches. v2.1.88
  `getSystemPrompt` (src/constants/prompts.ts:444-577) always emits the full 6-section body; the `model`
  parameter is used only for env-info, never to branch the body. So `X3`/`c45`/`d45`/`gM6` and the
  `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` env override are net-new in the v2.1.154 window.
- **The `CLAUDE_CODE_SIMPLE` path (`cKq`) has a genuine v2.1.88 precursor (HIGH).** It maps 1:1 to the
  `isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)` short-circuit at src/constants/prompts.ts:450-454 → CWD+Date
  stub. This is the only "trimmed" mode that existed pre-2.1.154, and it is orthogonal to (and far more
  aggressive than) lean.
- **The full section builders carry forward from 2.1.88 (HIGH).** `QXz`/`gXz`/`dXz`/`rXz` are near-verbatim
  copies of `getSimpleIntroSection`/`getSimpleSystemSection`/`getSimpleDoingTasksSection`/
  `getSimpleToneAndStyleSection`, same `oU`/`prependBullets` helper and `keepCodingInstructions` gating.
  Minor wording edits and the `tengu_verified_vs_assumed` gate (replacing the 2.1.88 `USER_TYPE==='ant'`
  gate in `dXz`) are the only deltas; section identity and assembly are unchanged.
- **Lineage of the shared helpers (HIGH).** `O7`/`HD`/`Gi$`/`UA`/`Zq` are the same model-resolution/provider
  helpers documented in `43_model_opus48`; `xH`/`k4` are the codebase-wide env-bool parsers; `cx8`/`v8` are
  lodash memoize. None are lean-specific — the lean gate *reuses* them — but they are listed here because
  the lean docs consume them directly.
- **Fast-Mode cousins are deliberately listed for disambiguation (HIGH).** `Wj`/`m76`/`ki`/`uB` gate Fast
  Mode (sibling `43_model_opus48`), not the lean prompt; the lean docs include them only to warn against
  conflating the two opus-4.x tests.
