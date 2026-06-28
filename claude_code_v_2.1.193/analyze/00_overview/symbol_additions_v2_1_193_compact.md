# Symbol Additions — v2.1.193 — Compaction (thin carryover note)

> Consolidated obfuscated→readable symbol manifest for the **Compaction** subsystem **as it exists in
> v2.1.193** (build `a1938d2a`), analysed in [`../07_compact/`](../07_compact/README.md).
> This window is **behaviorally carryover**: the only source-level change is a behavior-preserving
> refactor of the auto-compact dispatcher's return shape (flat `{wasCompacted}` → discriminated `{kind}`
> union) plus the `CSl`/`VDn`/`VZr` helper extractions and the constant-folded thrash message.
>
> **Routing — these rows fold into [`symbol_index_core_features.md`](./symbol_index_core_features.md),
> "## Module: Compact".**
>
> **All line numbers in the first table are v2.1.193** (`/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`).
> The v2.1.183 names DO NOT apply in v2.1.193 — the bundler re-mangles every build; where a 183 ancestor
> exists it is given in the Description-style trailing note. **Every 193 row below was re-read in the live
> 193 bundle during this pass.**

## Module: Compact — present in v2.1.193 (refactored dispatcher + carryover engine)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Rxo` | `autoCompactDispatcher` — per-turn compaction decision; async generator returning `{kind}` discriminated union (183 `Ego`@461531, flat `{wasCompacted}`) | cli_inner_pretty.js:470250 | function |
| `CSl` | `compactFailedResult` — "failed" factory; +1 `consecutiveFailures`, emits `tengu_auto_compact_circuit_breaker` at `>=3`; consolidates 183's two inline sites (`461606`/`461645`) | cli_inner_pretty.js:470189 | function |
| `VDn` | `rapidRefillBreaker` — struct `{action:"trip"|"proceed", consecutiveRapidRefills}` wrapping the count; 183 inlined `if (Igo(o)>=cWn)` | cli_inner_pretty.js:235130 | function |
| `u8d` | `rapidRefillCount` — bare rapid-refill count; byte-identical to 183 `Igo`@461481 modulo `Ggo`→`3` | cli_inner_pretty.js:235127 | function |
| `lcf` | `autocompactNeeded` — "is compaction needed?" gate (183 `Xjp`) | cli_inner_pretty.js:470238 | function |
| `acf` | `prefixOverflowProbe` — fixed-prefix overflow pre-check; emits `tengu_auto_compact_prefix_overflow` (183 `Yjp`) | cli_inner_pretty.js:470203 | function |
| `ccf` | `autoWindowSpinnerHint` — "Compacting at auto window…" spinner hint string (183 `Jjp`) | cli_inner_pretty.js:470349 | function |
| `WDn` | `resolveThresholdSource` — 6-source window/threshold resolver (183 `ywn`) | cli_inner_pretty.js:235039 | function |
| `VZr` | `makeCompactedState` — success-state factory `{compacted:true, turnId, turnCounter:0, consecutiveFailures:0, consecutiveRapidRefills}`; extracted from 183 inline literal | cli_inner_pretty.js:235134 | function |
| `wSl` | `streamCompactSummary` — summarize loop honoring `--fallback-model`; `query_source:"compact"` @469978 (183 `del`) | cli_inner_pretty.js:469797 | function |
| `Xxo` | `isColdCompact` — `CLAUDE_CODE_COLD_COMPACT` env reader used by the proactive path | cli_inner_pretty.js:470235 | function |
| `wYe` | `getLongContext1mCreditsBlocked` — getter for the 1M-credits-without-credits clamp flag | cli_inner_pretty.js:2876 | function |
| `Lpr` | `setLongContext1mCreditsBlocked` — setter for the 1M-credits clamp flag | cli_inner_pretty.js:2878 | function |
| `ISl` | `FAILURE_BREAKER_MAX` (`3`) — consecutive-failure circuit-breaker cap (183 `jgo`) | cli_inner_pretty.js:470357 | constant |
| `VXi` | `RAPID_REFILL_WINDOW` (`3`) — rapid-refill turn window, used in the warn-log only (183 `Ggo`) | cli_inner_pretty.js:235137 | constant |
| `qZr` | `THRASH_MESSAGE` — static "Autocompact is thrashing… within 3 turns… 3 times in a row…"; 183 template literal `wgo` (identical render) | cli_inner_pretty.js:235138 | constant |
| `pOr` | `CONTEXT_HINT_BETA` — `pE("context_hint","context-hint-2026-04-09")` micro-compaction beta gate (carryover, no version bump) | cli_inner_pretty.js:102179 | object |
| `BIo` | `shouldRunPostCompactBookkeeping` — post-loop helper now taking pre-derived `autocompactRan` boolean (183 `PAo` took raw `compactionResult`/`consecutiveFailures`) | cli_inner_pretty.js:466459 (callsite) | function |

## Module: Compact — v2.1.183 before-picture (refactored/renamed in v2.1.193)

> These are **183** symbols documenting the pre-refactor dispatcher shape. Their 193 counterparts are in
> the table above. Line numbers are **v2.1.183** (`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`).

| Obfuscated (183) | Readable | File:Line (183) | Type |
|------------------|----------|-----------------|------|
| `Ego` | `autoCompactDispatcher` (183 name) — flat `{wasCompacted, compactionResult, rapidRefillBreakerTripped, …}` return; survives as 193 `Rxo` | cli_inner_pretty.js:461531 | function |
| `Igo` | `rapidRefillCount` (183 name) — bare count; survives as 193 `u8d`; struct-wrapped by 193 `VDn` | cli_inner_pretty.js:461481 | function |
| `wgo` | `THRASH_MESSAGE` (183 name) — template literal `…within ${Ggo} turns…${cWn} times…`; constant-folded to 193 `qZr` | cli_inner_pretty.js:461687 | constant |
| `jgo` | `FAILURE_BREAKER_MAX` (`3`) (183 name) — survives as 193 `ISl` | cli_inner_pretty.js:461663 | constant |
| `Ggo` | `RAPID_REFILL_WINDOW` (`3`) (183 name) — `turnCounter <` window; survives as 193 `VXi` / literal `3` | cli_inner_pretty.js:461664 | constant |
| `cWn` | `RAPID_REFILL_TRIP` (`3`) (183 name) — `Igo(o) >= cWn` trip test; survives as `>= 3` inside 193 `VDn` | cli_inner_pretty.js:461665 | constant |
| `PAo` | `shouldRunPostCompactBookkeeping` (183 name) — took raw `compactionResult`/`consecutiveFailures`; survives as 193 `BIo` (pre-derived `autocompactRan`) | cli_inner_pretty.js:457823 (callsite) | function |
