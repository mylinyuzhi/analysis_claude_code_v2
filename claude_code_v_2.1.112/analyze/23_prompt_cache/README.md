# Prompt Cache and Session Recap (23_prompt_cache) — v2.1.112

## Overview

This module covers two intertwined feature arcs landed between **v2.1.88** and **v2.1.112**:

1. **Prompt cache TTL evolution** — A unified `ENABLE_PROMPT_CACHING_1H` env var (v2.1.108), a `FORCE_PROMPT_CACHING_5M` opt-out (v2.1.108), and a set of cache-miss fixes covering `--resume`, attachment messages, and tool-schema stability (v2.1.89, v2.1.90, v2.1.97).
2. **Session recap (`/recap`)** — The `/recap` slash command (v2.1.108) plus the underlying `generateAwaySummary` infrastructure (renamed conceptually `generateSessionRecap` in the changelog), and the auto-recap-on-blur logic (v2.1.108-v2.1.110).

Both arcs share a common goal: **reduce the cost (compute + tokens) of returning to a session.** The cache work eliminates re-paying for the same prefix; the recap work eliminates re-reading the transcript.

Plus one cross-cutting reliability item:

3. **Autocompact thrash circuit-breaker** (v2.1.89) — Detects when a compaction succeeds but the context refills to the limit within 3 turns, three times in a row, and stops with an actionable error instead of looping forever.

## Module Structure

| Document | Purpose |
|----------|---------|
| [cache_1h_ttl.md](./cache_1h_ttl.md) | `ENABLE_PROMPT_CACHING_1H` env var, allowlist-gated 1-hour TTL, Bedrock variant deprecation |
| [force_5m_ttl.md](./force_5m_ttl.md) | `FORCE_PROMPT_CACHING_5M` hard override that downgrades any session to 5-min TTL |
| [recap_feature.md](./recap_feature.md) | `/recap` slash command, `/config` toggle, telemetry-disabled fallback |
| [away_summary.md](./away_summary.md) | Deep deobfuscation of `generateAwaySummary` (1-3 sentence "while you were away" recap) |
| [prompt_cache_miss_fixes.md](./prompt_cache_miss_fixes.md) | Three cache-miss fixes: `--resume` (v2.1.90), attachment messages (v2.1.97), tool-schema bytes (v2.1.89) |
| [autocompact_thrash_fix.md](./autocompact_thrash_fix.md) | v2.1.89 autocompact thrash detection — 3-refill-within-3-turns-3-times breaker |

## Architecture: Cache TTL Decision Tree

```
                  ┌──────────────────────────────────┐
                  │   getCacheControl(querySource)    │  chunks.194.mjs:1019
                  │   (function `ex`)                 │
                  └────────────────┬─────────────────┘
                                   │
                                   ▼
                  ┌──────────────────────────────────┐
                  │   is1HourCacheEligible(source)?   │  chunks.194.mjs:1034
                  │   (function `o85`)                │
                  └────────────────┬─────────────────┘
                                   │
            ┌──────────────────────┼──────────────────────┐
            ▼                      ▼                      ▼
   FORCE_PROMPT_CACHING_5M  ENABLE_PROMPT_CACHING_1H   Subscriber + not
   set?  → return false      OR (Bedrock AND _1H_     in overage?
   (downgrade override)      _BEDROCK)? → return true    │
                             (explicit opt-in)            ▼
                                                  Check allowlist for
                                                  this querySource
                                                  (repl_main_thread*,
                                                  sdk, auto_mode by default)
                                   │
                                   ▼
                              { type: "ephemeral",
                                ttl: "1h"  // only if eligible
                              }
```

The output is folded into every `cache_control` marker on system-prompt blocks, tool-schema blocks, and user-message anchors (`addCacheBreakpoints`, chunks.194.mjs:3063 in v2.1.88's `services/api/claude.ts:3063`).

## Architecture: Session Recap

```
                  ┌─────────────────────────────────┐
                  │  Trigger paths                   │
                  └──┬──────────────────────────┬───┘
                     │                          │
   Auto: terminal    │                          │  Manual: user
   blurred ≥ 5 min   │                          │  types `/recap`
   AND idle          ▼                          ▼
            useAwaySummaryEffect            recapCommand
            (chunks.206.mjs:2535)           (chunks.189.mjs:2782)
                     │                          │
                     └──────────────┬───────────┘
                                    │
                                    ▼
                  ┌─────────────────────────────────┐
                  │  generateAwaySummary (Vu8)       │  chunks.116.mjs:898
                  │                                  │
                  │  1. Load CacheSafeParams         │
                  │  2. Run small-fast-model         │
                  │     with last 30 messages +      │
                  │     "stepped away" prompt        │
                  │  3. skipCacheWrite: true         │
                  │     (don't pollute the cache)    │
                  │  4. Return 1-2 sentence summary  │
                  └─────────────────────────────────┘
                                    │
                                    ▼
                  ┌─────────────────────────────────┐
                  │  Display as system message      │
                  │  with subtype "away_summary"    │
                  │  ("(disable recaps in /config)"  │
                  │   appended for first 3 times)    │
                  └─────────────────────────────────┘
```

## Architecture: Autocompact Thrash Breaker

```
       autocompact() called
              │
              ▼
   ┌────────────────────────────────────────┐
   │  BREAKER A: consecutive failures ≥ 3?   │  (was tracked in 2.1.88,
   │  → silently skip                        │   but never *terminated*;
   │  (catches crashing compactions)         │   v2.1.89 adds the gate)
   └─────────────┬──────────────────────────┘
                 │ pass
                 ▼
   ┌────────────────────────────────────────┐
   │  shouldCompact()? (gDY)                 │
   │  → no, return early                     │
   └─────────────┬──────────────────────────┘
                 │ yes (over threshold)
                 ▼
   ┌────────────────────────────────────────┐
   │  BREAKER B (NEW v2.1.89):               │
   │  prev compacted AND turnCounter < 3 AND │
   │  consecutiveRapidRefills + 1 ≥ 3?       │
   │  → emit user-visible thrash error       │
   │  (catches successful-but-pointless      │
   │   compactions)                          │
   └─────────────┬──────────────────────────┘
                 │ pass
                 ▼
       Run compaction; on success update
       (compacted=true, turnCounter=0,
        consecutiveRapidRefills=H)
```

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Tools, LLM API)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode, Compact, Hooks, etc.)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP, Permissions, Auth)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (LSP, IDE, UI)
> - [symbol_additions_unit_15.md](../00_overview/symbol_additions_unit_15.md) - New symbols discovered in this unit

Key symbols in this module:
- `is1HourCacheEligible` (`o85`) - Eligibility decision for 1-hour cache TTL (chunks.194.mjs:1034)
- `getCacheControl` (`ex`) - Builds the `cache_control` object that's attached to a block (chunks.194.mjs:1019)
- `getPromptCache1hAllowlist` (`i81`) - Reads cached allowlist from session state (chunks.1.mjs:3240)
- `setPromptCache1hAllowlist` (`r81`) - Stores cached allowlist (chunks.1.mjs:3244)
- `getAPIProvider` (`pq`) - Returns `"bedrock" | "vertex" | "foundry" | "firstParty" | …` (chunks.41.mjs:2678)
- `isSubscriber` (`i7`) - True iff user is an Anthropic subscriber (chunks.61.mjs:1170)
- `generateAwaySummary` (`Vu8`) - LLM-driven 1-2 sentence recap generator (chunks.116.mjs:898)
- `extractAssistantText` (`wEz`) - Flattens text-only assistant content to a single string (chunks.116.mjs:938)
- `AWAY_SUMMARY_PROMPT` (`OEz`) - String literal prompt for the recap call (chunks.116.mjs:942)
- `recapCommand` (`LaY`) - The `/recap` slash command registration (chunks.189.mjs:2782)
- `runRecapCommand` (`yaY`) - Command handler that calls `generateAwaySummary` (chunks.189.mjs:2757)
- `isAwaySummaryEnabled` (`UR6`) - 5-step enablement chain (chunks.116.mjs:889)
- `autocompactDispatcher` (`QkK`) - The dual-breaker autocompact entry point (chunks.159.mjs:1379)
- `MAX_RAPID_REFILLS` (`jLK = 3`) - Rapid-refill threshold (chunks.159.mjs:1461)
- `RAPID_REFILL_TURN_WINDOW` (`a_7 = 3`) - Turn-count window for "rapid" (chunks.159.mjs:1459)
- `MAX_CONSECUTIVE_FAILURES` (`wLK = 3`) - Failure-count threshold (chunks.159.mjs:1457)
- `THRASH_ERROR_MESSAGE` (`okK`) - User-visible message when the rapid-refill breaker trips (chunks.159.mjs:1484)

## Version Notes (v2.1.88 → v2.1.112)

| Item | v2.1.88 | v2.1.112 | Version added |
|------|---------|----------|----------------|
| `ENABLE_PROMPT_CACHING_1H_BEDROCK` env var | Present in `services/api/claude.ts:398` | Still honored as Bedrock-specific fallback | pre-2.1.88 |
| `ENABLE_PROMPT_CACHING_1H` env var (unified) | Absent | Present in `chunks.194.mjs:1036` | **v2.1.108** |
| `FORCE_PROMPT_CACHING_5M` env var | Absent | Present in `chunks.194.mjs:1035` | **v2.1.108** |
| Allowlist (`tengu_prompt_cache_1h_config`) | Absent | Present, default `["repl_main_thread*", "sdk", "auto_mode"]` | v2.1.108 |
| `generateAwaySummary` (recap LLM call) | Present in `services/awaySummary.ts:29` | Present in `chunks.116.mjs:898`, prompt rewritten | pre-2.1.88 |
| `/recap` slash command | Absent (only auto on terminal blur) | Present in `chunks.189.mjs:2782` | **v2.1.108** |
| `CLAUDE_CODE_ENABLE_AWAY_SUMMARY` env var | Absent | Present in `chunks.116.mjs:890` | v2.1.108 |
| `awaySummaryEnabled` in `/config` | Absent | Present | v2.1.108 |
| Autocompact rapid-refill breaker (`jLK=3`) | Absent | Present in `chunks.159.mjs:1391-1397` | **v2.1.89** |
| Autocompact consecutive-failure breaker terminator (`wLK=3`) | Counter tracked, no gate | Counter + gate at line 1383 | v2.1.89 |
| Cache miss on `--resume` with deferred tools | Bug | Fixed | v2.1.90 |
| Cache miss on `--resume` with attachment messages | Bug | Fixed | v2.1.97 |
| Cache miss on tool-schema bytes changing mid-session | Bug | Fixed (deterministic serialization) | v2.1.89 |
| Subscribers with `DISABLE_TELEMETRY` falling back to 5-min TTL | Bug | Fixed | v2.1.108 |
| Recap for telemetry-disabled users | Disabled | Enabled (Bedrock, Vertex, Foundry, `DISABLE_TELEMETRY`) | v2.1.110 |
