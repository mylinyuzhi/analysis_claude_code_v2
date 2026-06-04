# Module 07 — Compaction (v2.1.156)

## Overview

Compaction in Claude Code v2.1.156 is no longer a single algorithm — it is a family of **co-existing strategies** chosen by a multi-level **threshold ladder** and a 4-source context-window resolution. The strategies are: **proactive / full compaction** (replace the whole conversation with one summary), **reactive / partial compaction** (group-walk summarize the oldest groups after a "prompt too long" rejection), **micro-compaction** (keep-recent tool-result clearing, now negotiated server-side via `context_hint`), the **/rewind partial compactor** (direction-aware summarize-from / summarize-up-to), and the now-**removed** session-memory experiment that an earlier release had carried. Before each turn the agent loop computes the message token count, resolves the effective context window from four prioritized sources (env > settings > experiment > auto), maps it through a single ordered level enum (`ok | warn | compact | blocked`), and — when the level reaches `compact`/`blocked` — hands off to the auto-compact dispatcher (`DX4`), which routes to the full pipeline (`_eH`), delegates to the reactive lane (`lA8`) for explicitly-windowed local contexts, or trips one of two circuit breakers (consecutive-failure and the new rapid-refill/thrashing breaker). Micro-compaction (`K04`) and the `/rewind` partial compactor (`qX4`) are separate lanes, and a PostCompact tail (hook event + prompt-cache baseline reset) runs after every successful compaction. The v2.1.156 source build is a **single prettified bundle**, `cli_inner_pretty.js` — there are no `chunks.NN.mjs` files in this build — so every v2.1.156 citation below is of the form `cli_inner_pretty.js:<line>`. v2.1.88 is the cross-validation baseline, cited as `<relative-path>.ts:<line-or-symbol>`.

## Architecture: Where Each Path Plugs In

```
                          ┌───────────────────────────────────────────────┐
                          │           Agent main loop (per turn)            │
                          └───────────────────────┬───────────────────────┘
                                                  │
                          ┌───────────────────────▼───────────────────────┐
                          │ THRESHOLD CHECK                                 │
                          │   Xl  → {window, configured, source}            │
                          │         (env > settings > experiment > auto)    │
                          │   _qH → effective window (− output reserve)      │
                          │   Jv$/YX4 → autocompact + precompute thresholds │
                          │   fX4 → LEVEL ENUM {level, pctLeft}              │
                          │         level ∈ { ok | warn | compact | blocked}│
                          └───────────────────────┬───────────────────────┘
                                                  │ level ≥ compact
                          ┌───────────────────────▼───────────────────────┐
                          │ DISPATCHER  DX4 / autoCompactIfNeeded           │
                          │   (async generator; yield*-pumps compact events)│
                          │   gate cascade: DISABLE_COMPACT → J0() enabled  │
                          │   → breakers → thresholdSource routing          │
                          └───────┬───────────────┬───────────────┬────────┘
                                  │               │               │
              thresholdSource     │               │               │ breaker trips
              == "auto"           │               │ source != auto │
              (or remote)         │               │ && isLocal()   │
                                  ▼               ▼               ▼
                   ┌──────────────────────┐ ┌──────────────┐ ┌──────────────────────┐
                   │ FULL COMPACT  _eH /   │ │ REACTIVE lA8 │ │ CIRCUIT BREAKERS      │
                   │ compactConversation   │ │ group-walk   │ │  _c6 = 3  consecutive │
                   │  16-phase try/finally │ │ xA8 +bv7/mc5 │ │       failures        │
                   │  HEAD-trunc PTL retry │ │ ucH PTL ext. │ │  fc6  rapid-refill:   │
                   │  forked _X4 summarize │ │ uc5 summarize│ │   Y08=3 trips within  │
                   │  cold-compact (Mc6)   │ │ precompute   │ │   Yc6=3 turn window   │
                   └───────────┬──────────┘ └──────┬───────┘ └──────────────────────┘
                               │                   │
                               └─────────┬─────────┘
                                         ▼
                          ┌───────────────────────────────────────────────┐
                          │ PostCompact TAIL                                │
                          │   pendingPostCompaction one-shot telemetry      │
                          │   PostCompact hook event (zJH)                  │
                          │   notifyCompaction → cache-break baseline reset │
                          │   runPostCompactCleanup                         │
                          └───────────────────────────────────────────────┘

   ────────────── SEPARATE LANES (not gated by the threshold ladder) ──────────────

   MICRO-COMPACT (K04 / Vi6 / Zk$)              /REWIND PARTIAL (qX4)
     server-driven context_hint negotiation       direction ∈ {from, up_to}
     beta k76; client clears only on              shared PTL retry slicer ($X4, HX4=3)
     HTTP 422/424 (P69) or stream 4xx (W69)       directional preserved-segment anchor
     controller kLz; 20000-token floor (Ti6)      errorSink (KX4) + onResponseLength
     disk-persist (vLz) → reversible pointer
```

## Document Map

| File | Topic | One-line |
|------|-------|----------|
| [threshold_and_window_resolution.md](./threshold_and_window_resolution.md) | Threshold ladder & context-window resolution | Deobfuscation of v2.1.156's compaction threshold ladder and 4-source context-window resolution (`Xl`/`_qH`/`Jv$`/`YX4`/`fX4`), with dual-version snippets, two worked numeric examples, and a cross-validation against v2.1.88. |
| [autocompact_dispatcher_and_breakers.md](./autocompact_dispatcher_and_breakers.md) | Auto-compact dispatcher & the two breakers | Deobfuscation of the v2.1.156 auto-compact dispatcher (`DX4`/`autoCompactIfNeeded`), its gate cascade, the circuit breaker (`_c6`=3) and the NEW rapid-refill/thrashing breaker (`fc6`, `Y08`=3 within `Yc6`=3), reactive routing, and cold-compact, with dual-version snippets and v2.1.88 cross-validation. |
| [compaction_pipeline.md](./compaction_pipeline.md) | Full-compaction pipeline (compactConversation) | Deobfuscation of the v2.1.156 full/proactive pipeline (`compactConversation`/`_eH`): the 16-phase try/catch/finally, the HEAD-truncation PTL retry loop, the cache-prefix-gated forked summarize call (`streamCompactSummary`/`_X4`), summary extraction, and full cross-validation against v2.1.88 with verifier corrections applied (`lN` tests `EZ` not `Rd`; `Rd` defined @186902). |
| [reactive_compaction.md](./reactive_compaction.md) | Reactive (partial / PTL-driven) compaction | Deep-dive on the reactive (partial / PTL-driven) lane: the group-walk (`xA8`), `initialTokenGap` seeding (`bv7`/`mc5`), PTL extraction (`ucH`), and the v2.1.156 `DX4` thresholdSource proactive→reactive routing + precompute fast-path, with full v2.1.88 cross-validation. |
| [micro_compact.md](./micro_compact.md) | Micro-compaction (keep-recent tool-result clearing) | Deobfuscation of v2.1.156 keep-recent micro-compaction: the `Vi6`/`Zk$`/`K04` clearing engine, the server-driven `context_hint` reactive controller (`kLz`), the 20000-token floor, disk-persist reversibility, and the full delta vs the v2.1.88 time-based micro-compactor. |
| [session_memory_and_partial_compact.md](./session_memory_and_partial_compact.md) | Session-memory & /rewind partial compaction | Documents that v2.1.156 fully removed the v2.1.88 session-memory compaction experiment, and deep-analyzes the surviving `/rewind` partial compactor (`qX4`) with its `up_to`/`from` direction discriminator, shared PTL retry slicer, and directional preserved-segment anchor; verifier corrections applied (`session_memory` has 4 hits across gRPC+OTel, `xA8` starts at 271231 with `mc5` helper at 271227). |
| [summary_prompt_templates.md](./summary_prompt_templates.md) | Summary meta-prompt templates | Documents the v2.1.156 summarizer meta-prompt layer: three builders (`bA8`/`Cv7`), four body templates (full/partial-from/partial-up_to), the no-tools sandwich + `<analysis>`/`<summary>` contract, the new security-preservation clause, `xc5` extraction, and the `jP$` replacement-seed (with new `replStateCleared` param); cross-validated against v2.1.88. Verifier correction applied: the `up_to` template's quoted clause is the second sentence of `cli_inner_pretty.js:270835`, not its opening words. |
| [postcompact_and_prompt_cache.md](./postcompact_and_prompt_cache.md) | PostCompact hook & prompt-cache break | Deobfuscation of the v2.1.156 post-compaction tail: the `pendingPostCompaction` one-shot telemetry flag, the PostCompact hook event, `notifyCompaction` cache-break baseline reset, the `cacheBreak:false` prompt-prefix memo gate, and `runPostCompactCleanup` — with all verifier corrections applied (`Jc` gate = Cowork OR claude-desktop, not a `PROMPT_CACHE_BREAK_DETECTION` env var; progress-emit sites 423285/423478; `Pc5` is a constant; `DE` only at 271350; `prevMessageCount` not a top-level payload field; `KrH` = `reAppendSessionMetadata` not `notifyCompaction`). |
| [cross_validation.md](./cross_validation.md) | Verification log | Line-by-line verification log: every symbol/anchor/numeric claim in this module re-checked against `cli_inner_pretty.js` and the v2.1.88 `src/` tree, with corrections folded back into the docs above. |
| [../00_overview/symbol_additions_v2_1_156_compact.md](../00_overview/symbol_additions_v2_1_156_compact.md) | Symbols | This module's new/renamed symbols (threshold ladder, dispatcher, breakers, reactive lane, micro-compact, partial compactor, prompts, PostCompact). |

## Key v2.1.88 → v2.1.156 Evolution

This section distills the concrete deltas per lane. Throughout, v2.1.156 symbols are bare obfuscated names (lookups in [../00_overview/symbol_additions_v2_1_156_compact.md](../00_overview/symbol_additions_v2_1_156_compact.md)); v2.1.88 symbols are cited by their `src/` path.

### Threshold ladder & context-window resolution

- **NEW REFACTOR — single level enum.** v2.1.88 `calculateTokenWarningState` returned five fields `{percentLeft, isAboveWarningThreshold, isAboveErrorThreshold, isAboveAutoCompactThreshold, isAtBlockingLimit}` (`autoCompact.ts:93-145`). v2.1.156 `fX4` (`cli_inner_pretty.js:423873`) collapses these into ONE ordered enum `{level: ok|warn|compact|blocked, pctLeft}`. The redundant `error` level is **removed** — in v2.1.88 `ERROR_THRESHOLD_BUFFER_TOKENS == WARNING_THRESHOLD_BUFFER_TOKENS == 20000`, so error and warning fired identically. The `isAboveWarning/Error/AutoCompact/blocking` booleans are gone.
- **NEW — 4-source window resolver `Xl`** (`cli_inner_pretty.js:423915`). v2.1.88 had only `getContextWindowForModel` returning a bare number, with env `CLAUDE_CODE_AUTO_COMPACT_WINDOW` handled INLINE inside `getEffectiveContextWindowSize` (`autoCompact.ts:40-46`). v2.1.156 extracts a full `{window, configured, source}` resolver with explicit precedence env > settings > experiment > auto. NEW sources: `settings` (saved `autoCompactWindow`) and `experiment` (Opus-4.8).
- **NEW — precompute threshold concept.** `YX4` (`cli_inner_pretty.js:423870`) and `precomputeBufferFraction` (`qc6`=0.2). Does NOT exist in v2.1.88. Adds a proactive-work gate at eff − 20% that is min-clamped under the autocompact threshold. Consumed by `tv7` (`cli_inner_pretty.js:423976`).
- **NEW — string parser `Ac6`** (`cli_inner_pretty.js:423889`) with `[100,1000]`-as-thousands shorthand and `[1e5,1e6]` clamp (constants `zc6`=1e5, `jX4`=1e6). v2.1.88 used plain `parseInt` with no shorthand and only checked `parsed > 0`.
- **NEW — three GrowthBook experiment gates:** `tengu_amber_redwood2` (`wX4`, Opus-4.8 window), `tengu_amber_redwood3` (`Pc`, reactive mode), `tengu_amber_rokovoko` (`tb_`, precompute fraction). NONE in v2.1.88.
- **NEW — env override `CLAUDE_CODE_COLD_COMPACT`** (`Mc6`, `cli_inner_pretty.js:423951`) feeding the cold-compact path. **NEW — `sb_`** (`cli_inner_pretty.js:423944`) raw-cap blocking base so the blocking limit tracks the true model cap even when the autocompact window is shrunk; v2.1.88 used `actualContextWindow = getEffectiveContextWindowSize` directly for blocking (`autoCompact.ts:122-124`).
- **NEW — rapid-refill thrash breaker** `fc6`/`Oc6` with constants `Yc6`=3, `Y08`=3 (`cli_inner_pretty.js:423948`, `424129-424130`). v2.1.88 only had the consecutive-failure circuit breaker (`MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES`=3, preserved as `_c6`=3).
- **CHANGED — `MAX_CONTEXT_TOKENS` gating.** v2.1.88 gated `CLAUDE_CODE_MAX_CONTEXT_TOKENS` behind `USER_TYPE === 'ant'` (`context.ts:60-66`); v2.1.156 `Ov` gates it behind `DISABLE_COMPACT` being truthy (`cli_inner_pretty.js:130166`). **CHANGED — env-validation centralized** into `n$H` (`cli_inner_pretty.js:220968`) replacing inline `parseInt`+`isNaN` checks.
- **PRESERVED constants:** `AUTOCOMPACT_BUFFER_TOKENS` 13000 (`zX4`), WARNING buffer 20000 (inline), `MANUAL_COMPACT` 3000 (`AX4`), `MAX_OUTPUT_TOKENS_FOR_SUMMARY` 20000 (`MX4`), `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` 3 (`_c6`), default window 200000 (`P36`).

### Auto-compact dispatcher & the two breakers

1. **NEW rapid-refill ('thrashing') breaker entirely:** counter `fc6`/`computeRapidRefillStreak` (`cli_inner_pretty.js:423948`), constants `Yc6`=RAPID_REFILL_TURN_WINDOW(3) and `Y08`=RAPID_REFILL_TRIP(3) (`cli_inner_pretty.js:424129-424130`), tracking field `consecutiveRapidRefills` (added to `AutoCompactTrackingState`), result fields `rapidRefillBreakerTripped`, telemetry `t$('compact_auto','compact_auto_rapid_refill_breaker')` + `tengu_auto_compact_rapid_refill_breaker`, and user message `Oc6`/`THRASHING_USER_MESSAGE` (`cli_inner_pretty.js:424155`). None exist in v2.1.88 (grep of `src/` for `rapidRefill`/`consecutiveRapidRefills` returns nothing).
2. **NEW reactive routing:** `thresholdSource` resolver `ab_`/`getThresholdSource` + `Xl` provenance machinery (env|settings|experiment|auto), the `M != 'auto' && isLocal()` routing branch to `lA8`/`reactiveCompact` (`cli_inner_pretty.js:424018-424058`), and result fields `thresholdSource` + `routedThroughReactive` carried into `tengu_auto_compact_succeeded`. no `reactiveCompact.ts` file exists on disk in v2.1.88's external `src/services/compact/` tree (which has `autoCompact`/`compact`/`microCompact`/`sessionMemoryCompact`/`apiMicrocompact`/`compactWarningHook`/`compactWarningState`/`grouping`/`postCompactCleanup`/`prompt`/`timeBasedMCConfig`).
3. **NEW `isLocal` gate** `_JH = !isEnvTruthy(CLAUDE_CODE_REMOTE)` (`cli_inner_pretty.js:423988`) plus a redwood3 (`Pc`) / configured-window (`EH$`) local-mode suppression inside `eb_` (`cli_inner_pretty.js:423994`) — v2.1.88's equivalent suppression was instead `feature()`-gated `REACTIVE_COMPACT` / `CONTEXT_COLLAPSE` / `session_memory` / `marble_origami` guards in `shouldAutoCompact`.
4. **NEW cold-compact flag** `Mc6 = CLAUDE_CODE_COLD_COMPACT` (`cli_inner_pretty.js:423951`) threaded as the 8th arg into `_eH`.
5. **NEW precompute machinery:** `precomputeBufferFraction` (`qc6`=0.2 via `tengu_amber_rokovoko`), `getPrecomputeThreshold` `YX4` (`cli_inner_pretty.js:423870`), experiment window `wX4` via `tengu_amber_redwood2` (`cli_inner_pretty.js:423906`).
6. **`DX4`/`autoCompactIfNeeded` is now an ASYNC GENERATOR** (`cli_inner_pretty.js:424002`) that `yield*`-pumps compact events via `Xv$` and returns the result. v2.1.88's `autoCompactIfNeeded` was a plain async function returning `{wasCompacted, compactionResult, consecutiveFailures}`.
7. v2.1.88's `trySessionMemoryCompaction`-first branch is no longer inline in the dispatcher body (it moved into the reactive/local routines).
- **Unchanged in name/intent:** circuit breaker constant value 3 (`_c6` == `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES`), `isAutoCompactEnabled` `J0`, the `DISABLE_COMPACT` first-gate, the `recompactionInfo` shape, the buffer constants (13000/20000/3000), and the per-turn tracking reset-on-compact / merge-on-failure pattern.

### Full-compaction pipeline (compactConversation / `_eH`, `cli_inner_pretty.js:423130`)

1. **NEW `stripNonEssential` parameter** (`Y`, default false) on `_eH`/`compactConversation` and threaded into `_X4`(`streamCompactSummary`). In v2.1.88 `streamCompactSummary` ALWAYS applied `stripImagesFromMessages`+`stripReinjectedAttachments` unconditionally; in v2.1.156 the strip pipeline is conditional and ESCALATED: when `stripNonEssential`, `_X4` additionally runs `db_` (drop non-queued attachments) and `cb_` (truncate `tool_use` inputs AND `tool_result` content to `oJ4`=100 chars, dropping cache-control blocks). New, more-aggressive token-reduction mode that force-disables the cache-prefix gate (`G/f = !Y && …`).
2. **NEW `hintText` parameter** (`f`) surfaced into the `compact_start` event (`{type:'compact_start', hintText}`). v2.1.88 emitted bare `{type:'compact_start'}`.
3. **Event-bus refactor:** v2.1.88 used discrete context callbacks (`context.onCompactProgress`, `setSDKStatus`, `setStreamMode`, `setResponseLength`). v2.1.156 funnels everything through a single `context.onCompactEvent?.({type:…})` dispatcher with sub-types `compact_progress`/`sdk_status`/`stream_mode`, plus a separate `onResponseLength` (`M`) setter passed as a parameter.
4. **NEW OTEL compaction span:** `xP$('claude_code.compaction',{spanType:'compaction',attrs:{trigger,message_count}})` at entry; `mY8` attributes (`pre/post_compact_tokens`,`success`) + `EEH` error + `L.end()` in finally; plus the `iwH('compaction')` OTLP gauge. No such span in v2.1.88 `compact.ts`.
5. **NEW telemetry fields:** `tengu_compact_cache_sharing_success` now logs `forkAssistantMessageCount` (and richer fallback fields `lastAssistantKind`/`assistantTextLength`/`stopReason` via `lb_`@`cli_inner_pretty.js:423527`). `tengu_compact_ptl_retry` exists in both, but the partial path adds `path:'partial'`.
6. **NEW feature-health telemetry wrapper:** every success/failure now also fires `SH(j)`/`uH(j,code)` (`tengu_feature_ok`/`bad` with `compact_auto|compact_manual` label) — not present in v2.1.88.
7. **PreCompact-hook BLOCK path is new/expanded:** `A08` + `PzH`(`PreCompactBlockedError`) + `KeH` constant + `blockedBy` field in `Wc`. v2.1.88 `executePreCompactHooks` returned only `{newCustomInstructions,userDisplayMessage}` with no block/abort semantics, and `addErrorNotificationIfNeeded` (`KX4`) did not special-case a block message.
8. **Streaming-retry removed from the full path:** v2.1.88 `streamCompactSummary` had a `tengu_compact_streaming_retry` loop (`MAX_COMPACT_STREAMING_RETRIES`, sleep+retry, gated by `tengu_compact_streaming_retry`). v2.1.156 `_X4` has NO streaming retry — a single streaming pass, then throws `NH$`. The retry concept moved entirely to the reactive lane.
9. **NEW summary-message context flags in `jP$`:** the 5th arg (`$H` = REPL-state) appends a "Your REPL VM state has been cleared" notice, and there is a 4th "recent messages preserved verbatim" arg — neither existed in v2.1.88 `getCompactUserSummaryMessage`.
10. **NEW reactive lane** (`uc5`/`xA8`/`bv7`/`mc5`) and the `/compact` command's reactive-only + session-memory routing (`commands/compact.ts`) — orthogonal sibling lanes that did not exist as such in the v2.1.88 `compact.ts` proactive code.
11. **Skill re-injection budgeting** (`aA8` with `Fb_`=5000 per-skill cap + `sJ4` truncation marker + `Qb_`=25000 budget) matches the v2.1.88 `createSkillAttachmentIfNeeded` constants (themselves a recent addition); `preCompactDiscoveredTools` carry-over (`P8H`/`extractDiscoveredToolNames`) is present in both.

### Reactive (partial / PTL-driven) compaction

`reactiveCompact` existed in v2.1.88 as a `feature('REACTIVE_COMPACT')`-gated, ant-only module (require at `query.ts:15-16`, used as the 413/PTL fallback at `query.ts:1120`; name-referenced in `autoCompact.ts:207` and `compact.ts:686`), compiled OUT of external builds (so no `reactiveCompact.ts` is on disk in the external v2.1.88 tree). What is genuinely NEW in v2.1.156 is the dispatcher-level reactive ROUTING fork (the `thresholdSource!=="auto"` branch), `getThresholdSource`/`ab_`, and the `routedThroughReactive` result field — none of which exist in v2.1.88.

Concrete deltas observable from v2.1.142 → v2.1.156 (symbol renames are re-minification; structure is stable):
- **`xA8`** (was `uq8` in v2.1.142) — group-walk; same seed branch (`q?.initialTokenGap !== void 0 && z>3`), same media-strip retry, same `exhausted`/`too_few_groups` taxonomy. NEW success result: `forkAssistantMessageCount` is now carried out of the walk (`cli_inner_pretty.js:271286`) and into `tengu_reactive_compact_succeeded`.
- **`bv7`** (was `B47`) and **`mc5`** (was `L3_`) — byte-for-byte identical logic; only the names changed.
- **`riH`** (was `hQH`) === v2.1.88 `groupMessagesByApiRound`, unchanged.
- **`ucH`** (was `mUH`) — the PTL overflow extractor; same regex/semantics.
- **NEW `thresholdSource` routing in `DX4`:** `M = ab_(model, window)` producing `'env'|'settings'|'experiment'|'auto'`, and the gate `K !== void 0 && M !== "auto" && _JH()` that routes proactive→reactive, plus the `tengu_auto_compact_routed_reactive` event and `routedThroughReactive` return field. In v2.1.142 reactive was driven primarily by the loop's PTL handler; v2.1.156 additionally lets the *proactive* generator delegate to the reactive lane for explicitly-windowed contexts.
- **NEW precompute path:** `sv7` builds `{outcome, swap, emittedEarlyCompactStart}`; `lA8` accepts `precomputed`/`precomputeOutcome` and a precomputed summarize closure; `nA8`/`lA8` emit precompute telemetry (`statusAtPTL`, `leadMs`, `totalMs`, `borrowed`, `messagesSinceTokens`) and `transition.reason` `'precomputed_compact_swap'`. The loop tracks `hasAttemptedReactiveCompact` and `borrowFrom` (`G.precomputeSourceKey`).
- The reactive lane now has its OWN circuit-breaker accounting inside `DX4` (`consecutiveFailures` + `routedThroughReactive` flag in `tengu_auto_compact_circuit_breaker`), distinct from the full path's breaker, both bounded by `_c6`=3.

### Micro-compaction (keep-recent tool-result clearing)

1. **NEW trigger mechanism:** v2.1.88 fired keep-recent clearing on a CLIENT-SIDE TIME GAP (`maybeTimeBasedMicrocompact`: `(Date.now()-lastAssistant)/60000 >= gapThresholdMinutes=60`, flag `tengu_slate_heron`, config `TimeBasedMCConfig`). v2.1.156 replaces this with a SERVER-DRIVEN reactive `context_hint` negotiation: the new beta `k76 = KX('context_hint','context-hint-2026-04-09')` (`cli_inner_pretty.js:98137`) is attached when local `Vi6` says ≥ `Ti6` tokens are reclaimable, and the client only runs clearing when the server REJECTS with HTTP 422/424 (`P69`) or a streaming `invalid_request_error` (`W69`). The new controller `kLz`/`createContextHintController` (`cli_inner_pretty.js:556535`) with `buildRequestParams`/`onRequestError`/`classifyStreamError`/`onStreamFallback`/`strip` is entirely post-v2.1.88.
2. **NEW master flag** `tengu_hazel_osprey` (`X69`) replaces `tengu_slate_heron` as the on/off gate, plus NEW `tengu_hazel_osprey_floor` (`L69`, default `VLz`=75000) advertised as `target_tokens_saved`.
3. **NEW minimum-savings gate** `Ti6`=20000 (`cli_inner_pretty.js:447284`, `556547`): v2.1.88 had NO floor (it fired on any non-zero `tokensSaved`, `microCompact.ts:494`).
4. **NEW disk persistence in the clearing path:** `K04` now takes a persist callback (`vLz`, `cli_inner_pretty.js:556496`) and writes cleared content to disk, replacing it with a `<persisted-output>Tool result saved to: <path>\n\nUse Read to view</persisted-output>` pointer (reversible); v2.1.88 `maybeTimeBasedMicrocompact` ALWAYS used the bare `TIME_BASED_MC_CLEARED_MESSAGE` placeholder. The `Wg_` predicate (`cli_inner_pretty.js:447250`) was correspondingly extended to recognize BOTH the placeholder AND a `Dg_('<persisted-output>')` prefix as "already cleared".
5. **NEW telemetry:** `tengu_context_hint_reject` (`V69`) and `tengu_context_hint_busy_fallback` (`KS8`); the inherited `tengu_time_based_microcompact` event KEEPS its name but now carries `trigger:'context_hint'` instead of `gapMinutes`/`gapThresholdMinutes`.
6. **NEW history-side wiring:** `onHintCleared` (`cli_inner_pretty.js:451442`) re-applies `Zk$` to persisted history AND evicts cleared Read files from `readFileState` via `q04` — `q04` (`collectClearedReadFilePaths`) has no v2.1.88 analog in `microCompact.ts`.
7. **REMOVED:** the `microcompact_boundary` CONSTRUCTION site (v2.1.88 `createMicrocompactBoundaryMessage`, `messages.ts:4557`) is gone — only the render-skip survives (`cli_inner_pretty.js:394644`).
8. **Constants stable:** `Gi6`/`Ti6`'s placeholder text, `keepRecent`=5 (`k69`), `IMAGE_MAX_TOKEN_SIZE`=2000 (`Jg_`) all match v2.1.88. The v2.1.88 `cachedMicrocompact` (cache_edits API) and `apiMicrocompact` (clear_tool_uses_20250919) paths are NOT the subject here; the keep-recent path analyzed is the descendant of `maybeTimeBasedMicrocompact` specifically.

### Session-memory & /rewind partial compaction

**REMOVED (session-memory compaction experiment, entirely gone — 0 matches in `cli_inner_pretty.js`):**
- `trySessionMemoryCompaction`, `shouldUseSessionMemoryCompaction`, `calculateMessagesToKeepIndex`, `adjustIndexToPreserveAPIInvariants`, `createCompactionResultFromSessionMemory`.
- State symbols `lastSummarizedMessageId` / `getLastSummarizedMessageId` / `setLastSummarizedMessageId`.
- Background extractor `extractSessionMemory`, `shouldExtractMemory`, `manuallyExtractSessionMemory` (the `/summary` command), `initSessionMemory`, `buildSessionMemoryUpdatePrompt`, `waitForSessionMemoryExtraction`, `truncateSessionMemoryForCompact`, `isSessionMemoryEmpty`.
- Config `DEFAULT_SM_COMPACT_CONFIG {minTokens:10000, minTextBlockMessages:5, maxTokens:40000}` and `DEFAULT_SESSION_MEMORY_CONFIG`.
- Feature gates `tengu_session_memory`, `tengu_sm_compact`, dynamic config `tengu_sm_compact_config` / `tengu_sm_config`.
- Env overrides `ENABLE_CLAUDE_CODE_SM_COMPACT` / `DISABLE_CLAUDE_CODE_SM_COMPACT`.
- Telemetry events `tengu_sm_compact_no_session_memory` / `_empty_template` / `_summarized_id_not_found` / `_resumed_session` / `_threshold_exceeded` / `_error` / `_flag_check`, `tengu_session_memory_extraction` / `_manual_extraction` / `_init` / `_gate_disabled` / `_file_read`.

> Verifier note: the literal string `session_memory` still has 4 hits in `cli_inner_pretty.js`, but 3 are gRPC scaffolding (`grpc-node.max_session_memory`) and 1 (`current_session_memory` @445799) is an attachment-type token explicitly dropped by `normalizeAttachmentForAPI` — none reconstruct the compaction experiment.

**NEW / EVOLVED on the partial-compaction side that conceptually replaced the experiment:**
- The single direction-aware partial compactor is now `qX4` (`cli_inner_pretty.js:423340`; was `_H4` in v2.1.112/142). It now accepts 8 params (`H,$,q,K,_,z,A,Y`) and an explicit `errorSink` (`A` via `KX4`) and `onResponseLength` (`Y`) channel that the v2.1.88 tree did not surface.
- Shared PTL machinery: `$X4` (slicer) + `HX4`=3 (cap) + `aJ4` truncation marker + `z08` user message are now shared verbatim between full compaction `_eH` and partial `qX4` (both at the `C/S<=HX4` guard). This unification is post-v2.1.88.
- Reactive (auto) compaction is now token-gap-guided group stepping: `xA8` loop (`cli_inner_pretty.js:271231`) + `bv7`/`mc5` step sizing (`mc5` helper @`cli_inner_pretty.js:271227`) + `uc5` summarization call, with `tengu_reactive_compact_attempt` telemetry — the sophisticated auto-compaction path that occupies the niche session-memory-compaction targeted.
- Boundary preserved-segment is richer: `xN6` now writes BOTH `preservedSegment{headUuid,anchorUuid,tailUuid}` AND `preservedMessages{anchorUuid,uuids,allUuids}`; resume reader split into `_l5` + `S5H` with anchor-matched reinsertion. v2.1.88's `annotateBoundaryWithPreservedSegment` existed but the dual-field + resume-splicer form here is the evolved shape.
- Partial telemetry `tengu_partial_compact` / `tengu_partial_compact_failed` / `tengu_compact_ptl_retry(path:'partial')` carry `direction` and `trigger:'message_selector'`.
- Renames from v2.1.142: `_H4`→`qX4`, `ed6`→`X4q`, `Hc6`→`L4q`, `lF5`→`BZz`, `jM$`→`PP$`, `qH`(handler)→`$H`.

### Summary meta-prompt templates

1. **NEW security-preservation clause:** v2.1.88 templates (`DETAILED_ANALYSIS_INSTRUCTION_BASE`/`_PARTIAL`, `prompt.ts:31-59`, section 6 lines 73/156/219) contained NO security/sensitive-instruction language. v2.1.156 adds it in TWO places per template: inside the analysis instructions (@`cli_inner_pretty.js:270850`/`270943`/`271091` — "Note any security-relevant instructions or constraints … These MUST be preserved verbatim … so they continue to apply after compaction") and inside section 6 (@`270860`/`270953`/`271101` — "Preserve any security-relevant instructions or constraints verbatim"). This is the single biggest content change.
2. **NEW `jP$` parameter `_`** (`replStateCleared`, the 5th arg) producing the "Your REPL VM state has been cleared as part of this compaction … redefine any you still need." trailer @`cli_inner_pretty.js:271066-271068` — absent from v2.1.88 `getCompactUserSummaryMessage` (which had only `summary`, `suppressFollowUpQuestions`, `transcriptPath`, `recentMessagesPreserved`). Call sites compute it via `$H = yZ() && MJ$(getReplContexts(), agentId)` @`423238`/`271211`.
3. **REFACTOR/INLINING:** v2.1.88 factored the analysis sub-block into named constants `DETAILED_ANALYSIS_INSTRUCTION_BASE`/`_PARTIAL` and the body into `BASE_COMPACT_PROMPT` / `PARTIAL_COMPACT_PROMPT` / `PARTIAL_COMPACT_UP_TO_PROMPT` (5 named consts + `NO_TOOLS_PREAMBLE`/`TRAILER`). v2.1.156 minifies these: the full template and `up_to` template are inlined directly inside `bA8`/`Cv7` (no separate `BASE`/`UP_TO` consts survive as standalone vars), while only the partial-from body (`bc5`) and the trailer (`Iv7`) remain as lazily-initialized module vars under `MN6 = T(()=>…)`.
4. **DROPPED proactive continuation branch in the SEED builder:** v2.1.88 `getCompactUserSummaryMessage` appended an extra "You are running in autonomous/proactive mode…" paragraph when PROACTIVE/KAIROS features were active and `proactiveModule.isProactiveActive()` (`prompt.ts:361-368`); v2.1.156 `jP$` has no such branch — its continuation directive is the single "Resume directly…" paragraph.
5. The model-failure-rate engineering comment (`prompt.ts:12-18`, "2.79% on 4.6 vs 0.01% on 4.5", `maxTurns:1` rationale) is stripped in the minified build, but the design it justified (preamble-first + trailer-last sandwich, `maxTurns:1` @`cli_inner_pretty.js:271167`) is fully preserved.
6. **Constants renamed/obfuscated:** `NO_TOOLS_PREAMBLE`→inlined string, `NO_TOOLS_TRAILER`→`Iv7`, `BASE_COMPACT_PROMPT`→inlined in `bA8`, `PARTIAL_COMPACT_PROMPT`→`bc5`, `PARTIAL_COMPACT_UP_TO_PROMPT`→inlined in `Cv7`, `getCompactPrompt`→`bA8`, `getPartialCompactPrompt`→`Cv7`, `formatCompactSummary`→`xc5`, `getCompactUserSummaryMessage`→`jP$`.

> Verifier note: the `up_to` template's quoted clause is the **second sentence** of `cli_inner_pretty.js:270835`, not its opening words.

### PostCompact hook & prompt-cache break

**CONFIRMED-PRESENT (carried forward, names map cleanly):** `markPostCompaction` (`XxH`/`cli_inner_pretty.js:2540`), `consumePostCompaction` (`vu8`/`2543`), `pendingPostCompaction` state field (`2353`), `notifyCompaction` (`_P$`/`270034`), `notifyCacheDeletion` (`Jv7`/`270029`), `checkResponseForCacheBreak` (`wv7`/`269885`), `getTrackingKey` (`GA8`/`269624`), `MIN_CACHE_MISS_TOKENS`=2000 (`Pc5`/`270054`, a constant), `CACHE_TTL_5MIN_MS`=300000 (`Wc5`), `CACHE_TTL_1HOUR_MS`=3600000 (`sk6`), `MAX_TRACKED_SOURCES`=10 (`Xc5`), `executePostCompactHooks` (`zJH`/`551596`, near-verbatim incl. the "PostCompact [cmd] completed successfully/failed" message strings), `createBaseHookInput` (`w5`/`552312`), `suppressCompactWarning`/`clearCompactWarningSuppression`/`compactWarningStore` (`LEH`/`xv7`/`wP$`).

**NEW IN v2.1.156 (no v2.1.88 equivalent):**
1. **On-disk persistence of cache-break tracking state:** `getCacheBreakStatePath` (`Ov7`/`cli_inner_pretty.js:269589`) → `cache-break-state-<sessionId>.json`, `loadCacheBreakState` (`Jc5`/`269592`), `persistCacheBreakState` (`DEH`/`269605`). `notifyCompaction` now also calls `DEH()` to flush the reset baseline to disk (`270037`); v2.1.88's `notifyCompaction` was a pure in-memory `state.prevCacheReadTokens=null` with no persistence.
2. **New cache-break attribution dimensions in `tengu_prompt_cache_break`:** `messagesHistoryChanged` + `firstChangedMessageIndex` (computed from a new `messageHashes` array, `269772`/`269794`/`269838-840`; `prevMessageCount` is *not* a top-level payload field), `cacheDiagnosis` + `cacheDiagnosisChanged` (`269721`/`269835`/`269939`), block-level diffing `prevBlockCount`/`newBlockCount`/`changedBlockIndices`/`changedBlockLengthDeltas` (`269846-848`/`269972-975`), and environment tags `isCowork` + `isDesktop` (`269997-998`). v2.1.88 had none of these.
3. **The `Jc()` gate** now force-enables detection when CLAUDE_CODE_IS_COWORK is set (`269583`) — i.e. **the gate is Cowork OR claude-desktop, NOT a `PROMPT_CACHE_BREAK_DETECTION` env var** — and persistence is keyed on cowork mode via `fv7()` (`269587`/`269606`); v2.1.88 had a plain `feature('PROMPT_CACHE_BREAK_DETECTION')` flag.
4. **Renamed analytics-suppression field semantics:** the overage line text changed from "overage state changed (TTL latched, no flip)" (v2.1.88) to "overage state changed (TTL flip expected)" (`269938`).
5. The `cachedMCEnabled`/`cachedMCChanged` pair from v2.1.88 was replaced/renamed by the `cacheDiagnosis` pair.
6. **`postCompactTokens` telemetry:** v2.1.88 used `query.ts` `truePostCompactTokenCount`; v2.1.156 standardizes on `postCompactTokens` (reactive event, `272442`) / `postCompactTokenCount` (result objects, `423299`/`423492`) / `post_compact_tokens` (manual event, `423325`).

> Verifier notes: progress-emit sites are `423285`/`423478`; `DE` appears only at `271350`; `KrH` = `reAppendSessionMetadata`, NOT `notifyCompaction`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact lives here
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Loop integration
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry / model context window
> - [symbol_additions_v2_1_156_compact.md](../00_overview/symbol_additions_v2_1_156_compact.md) - This module’s new symbols

Key functions in this document:

- `autoCompactIfNeeded` (`DX4`) — `cli_inner_pretty.js:424002` — Async-generator dispatcher; gate cascade, breakers, thresholdSource routing
- `compactConversation` (`_eH`) — `cli_inner_pretty.js:423130` — Full/proactive 16-phase pipeline; HEAD-truncation PTL retry; forked summarize
- `streamCompactSummary` (`_X4`) — `cli_inner_pretty.js:423527` (helper `lb_`) — Forked single-pass summarize call; conditional strip pipeline (`db_`/`cb_`)
- `runReactiveCompact` (`lA8`) — `cli_inner_pretty.js:272213` — Reactive lane entry; accepts precompute outcome + summarize closure
- `iterateReactiveGroupWalk` (`xA8`) — `cli_inner_pretty.js:271231` — Group-walk loop; `initialTokenGap` seed; carries `forkAssistantMessageCount`
- `seedPreservedCount` (`bv7`) — reactive lane — Greedy backward token-gap walk (byte-identical to v2.1.142 `B47`)
- `reactiveCompactStepSelector` (`mc5`) — `cli_inner_pretty.js:271227` — Wraps `bv7` with mode discriminator for telemetry
- `extractPtlTokenGap` (`ucH`) — reactive lane — PTL overflow extractor (regex from the "prompt too long" rejection)
- `partialCompact` (`qX4`) — `cli_inner_pretty.js:423340` — `/rewind` direction-aware compactor (`from`/`up_to`); shared PTL slicer
- `applyKeepRecentMicrocompact` (`K04`) — `cli_inner_pretty.js:447282` — Keep-recent tool-result clearing engine; disk-persist callback
- `createContextHintController` (`kLz`) — `cli_inner_pretty.js:556535` — Server-driven `context_hint` reactive controller
- `getAutoCompactWindow` (`Xl`) — `cli_inner_pretty.js:423915` — 4-source window resolver (env > settings > experiment > auto)
- `getEffectiveContextWindowSize` (`_qH`) — `cli_inner_pretty.js:423938` — Subtracts output reserve from the resolved window
- `getAutoCompactThreshold` (`Jv$`) — `cli_inner_pretty.js:423864` — Derives the autocompact gate (window − 13000)
- `getPrecomputeThreshold` (`YX4`) — `cli_inner_pretty.js:423870` — Proactive-work gate at eff − 20% (`qc6`)
- `calculateTokenWarningState` (`fX4`) — `cli_inner_pretty.js:423873` — Single ordered level enum `{level, pctLeft}`
- `computeRapidRefillStreak` (`fc6`) — `cli_inner_pretty.js:423948` — Rapid-refill (thrashing) breaker counter
- `getCompactPrompt` (`bA8`) — summary-prompt layer — Full + up_to summarizer meta-prompt builder
- `getPartialCompactPrompt` (`Cv7`) — summary-prompt layer — Partial summarizer meta-prompt builder
- `getCompactUserSummaryMessage` (`jP$`) — `cli_inner_pretty.js:271066` — Replacement-seed message; new `replStateCleared` arg
- `executePostCompactHooks` (`zJH`) — `cli_inner_pretty.js:551596` — Runs PostCompact hook commands
- `notifyCompaction` (`_P$`) — `cli_inner_pretty.js:270034` — Resets the cache-break baseline; flushes to disk via `DEH`
- `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` (`_c6`) — threshold layer — Consecutive-failure breaker bound (=3)
- `RAPID_REFILL_TRIP` (`Y08`) — `cli_inner_pretty.js:424129-424130` — Rapid-refill trip count (=3) within `Yc6`=3 turn window
- `coldCompactFlag` (`Mc6`) — `cli_inner_pretty.js:423951` — `CLAUDE_CODE_COLD_COMPACT` env override → 8th arg of `_eH`
