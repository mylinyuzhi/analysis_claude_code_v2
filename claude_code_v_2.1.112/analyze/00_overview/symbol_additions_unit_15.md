# Symbol Additions — Unit 15 (Prompt Cache + Session Recap v2.1.88 → v2.1.112)

Symbols discovered while analyzing the prompt-cache-TTL evolution (`ENABLE_PROMPT_CACHING_1H`, `FORCE_PROMPT_CACHING_5M`), the `/recap` slash command and `generateAwaySummary` infrastructure, the cache-miss fixes across v2.1.89-v2.1.97, and the autocompact thrash circuit-breaker in v2.1.89.

Source of truth for v2.1.88 names:
- `/lyz/codespace/3rd/claude-code/src/services/awaySummary.ts` (`generateAwaySummary`, `RECENT_MESSAGE_WINDOW`, `buildAwaySummaryPrompt`)
- `/lyz/codespace/3rd/claude-code/src/hooks/useAwaySummary.ts` (`useAwaySummary` React hook)
- `/lyz/codespace/3rd/claude-code/src/services/api/claude.ts` (`should1hCacheTTL`, `ENABLE_PROMPT_CACHING_1H_BEDROCK`, `getPromptCache1hEligible`, `getPromptCache1hAllowlist`)
- `/lyz/codespace/3rd/claude-code/src/services/compact/autoCompact.ts` (`autoCompactIfNeeded` — counter only, no rapid-refill gate)

---

## Module: Prompt Cache — TTL Decision (chunks.194.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `o85` | `is1HourCacheEligible` (decision tree: force-5m? 1H opt-in? subscriber? allowlist?) | chunks.194.mjs:1034-1043 | function |
| `ex` | `getCacheControl` (builds `{type: "ephemeral", ttl?: "1h", scope?: "global"}`) | chunks.194.mjs:1019-1032 | function |
| `n85` | `isPromptCachingEnabled` (DISABLE_PROMPT_CACHING and model-specific knobs) | chunks.194.mjs:1002-1016 | function |
| `S6` | `parseExplicitTrue` (boolean env-var parser: matches `"1"`, `"true"`, etc.) | utility | function |
| `c5` | `parseExplicitFalse` (boolean env-var parser: matches `"0"`, `"false"`, etc.) | utility | function |
| `u8` | `getFeatureValue` (GrowthBook feature flag reader with default) | utility | function |
| `i7` | `isSubscriber` (true iff jX() + scopes match subscriber claim) | chunks.61.mjs:1170-1173 | function |
| `pq` | `getAPIProvider` (returns `"bedrock"\|"foundry"\|"vertex"\|"firstParty"\|...`) | chunks.41.mjs:2678 | function |
| `Zk` | `rateLimitState` (object with `isUsingOverage` flag) | global state | variable |

### Env vars discovered

| Env var | Added | Purpose | Decision priority |
|---------|-------|---------|-------------------|
| `ENABLE_PROMPT_CACHING_1H` | v2.1.108 | Opt into 1-hour TTL on any provider | 2 |
| `FORCE_PROMPT_CACHING_5M` | v2.1.108 | Hard override forcing 5-min TTL | 1 (highest) |
| `ENABLE_PROMPT_CACHING_1H_BEDROCK` | pre-2.1.88 | Bedrock-specific legacy 1-hour opt-in | 3 |
| `DISABLE_PROMPT_CACHING` | pre-2.1.88 | Global cache off-switch | (separate function) |
| `DISABLE_PROMPT_CACHING_HAIKU` | pre-2.1.88 | Per-model cache off-switch | (separate function) |
| `DISABLE_PROMPT_CACHING_SONNET` | pre-2.1.88 | Per-model cache off-switch | (separate function) |
| `DISABLE_PROMPT_CACHING_OPUS` | pre-2.1.88 | Per-model cache off-switch | (separate function) |

### Feature flags

| GrowthBook key | Default | Purpose |
|---------------|---------|---------|
| `tengu_prompt_cache_1h_config` | `{allowlist: ["repl_main_thread*", "sdk", "auto_mode"]}` | querySource allowlist for 1-hour TTL |

---

## Module: Prompt Cache — Session State (chunks.1.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `i81` | `getPromptCache1hAllowlist` (reads `B8.promptCache1hAllowlist`) | chunks.1.mjs:3240-3242 | function |
| `r81` | `setPromptCache1hAllowlist` (writes `B8.promptCache1hAllowlist`) | chunks.1.mjs:3244-3246 | function |
| `B8.promptCache1hAllowlist` | session-stable allowlist cache (initialized to null in chunks.1.mjs:2342) | chunks.1.mjs:2342 | property |
| `eO8` | `setHasDevChannels` (adjacent state setter, sample of B8 setter pattern) | chunks.1.mjs:3236-3238 | function |

---

## Module: Cache Marker Placement (chunks.194.mjs — duplicates from compact module)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `addCacheBreakpoints` | `addCacheBreakpoints` (exported for testing — v2.1.88 name retained) | chunks.194.mjs:3063 | function |
| `markerIndex = skipCacheWrite ? messages.length - 2 : messages.length - 1` | cache marker placement formula | chunks.194.mjs:3089 | expression |
| `buildSystemPromptBlocks` | `buildSystemPromptBlocks` (v2.1.88 name retained) | chunks.194.mjs:3213-3237 | function |

---

## Module: Session Recap — Generator (chunks.116.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Vu8` | `generateAwaySummary` (1-2 sentence recap LLM call; v2.1.88 name retained) | chunks.116.mjs:898-936 | function |
| `wEz` | `extractAssistantText` (flatMap → filter text → join → trim) | chunks.116.mjs:938-940 | function |
| `OEz` | `AWAY_SUMMARY_PROMPT` (`"The user stepped away..."` string literal) | chunks.116.mjs:942 | constant |
| `UR6` | `isAwaySummaryEnabled` (5-step enablement chain) | chunks.116.mjs:889-896 | function |
| `XJ6` | `getSavedCacheSafeParams` (returns the session's stored CacheSafeParams for forking) | chunks.116.mjs:900 | function |
| `rP` | `runForkQuery` (standard fork-query entry point — used by recap, compact, microcompact) | chunks.116.mjs:908 | function |
| `t8` | `createUserMessage` (synthetic user message builder; v2.1.88 name `createUserMessage`) | chunks.116.mjs:909 | function |
| `gR6` | `useSettingsChangeSubscription` (React hook factory; sets up settings-change listener) | chunks.116.mjs:873-879 | function |
| `ku8` | `handleSettingsChange` (settings-change side-effect dispatcher; flips `awaySummaryEnabled` based on `isAwaySummaryEnabled()`) | chunks.116.mjs:954-989 | function |

### Env vars

| Env var | Added | Purpose |
|---------|-------|---------|
| `CLAUDE_CODE_ENABLE_AWAY_SUMMARY` | v2.1.108 | Force-on/off recap (steps 1-2 of `isAwaySummaryEnabled`) |

### Feature flags

| GrowthBook key | Default | Purpose |
|---------------|---------|---------|
| `tengu_sedge_lantern` | `true` | Kill switch for the recap feature |
| `tengu_sedge_lantern_config` | `{delayMs: QP7}` | Configurable blur delay (chunks.206.mjs:2549) |

---

## Module: Session Recap — /recap Slash Command (chunks.189.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `LaY` | `recapCommand` (slash command spec object) | chunks.189.mjs:2782-2790 | object |
| `haY` | `recapCommandAlias` (re-export of `LaY`) | chunks.189.mjs:2791 | object |
| `yaY` | `runRecapCommand` (async handler that calls `generateAwaySummary`) | chunks.189.mjs:2757-2773 | function |
| `ptK` | `recapCommandDef` (the lazy-init wrapper) | chunks.189.mjs:2779-2792 | function |

---

## Module: Session Recap — useAwaySummaryEffect Hook (chunks.206.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (anonymous useEffect) | `useAwaySummaryEffect` (terminal-blur → trigger-recap React effect) | chunks.206.mjs:2535-2620 | function |
| `sa6` | `getTerminalFocusState` (returns `"focused"\|"blurred"\|"unknown"`) | chunks.206.mjs (utility) | function |
| `ta6` | `subscribeTerminalFocus` (DECSET 1004 subscription) | chunks.206.mjs (utility) | function |
| `QP7` | `DEFAULT_BLUR_DELAY_MS` (constant, ~5min) | chunks.206.mjs (constant) | constant |
| `tCK` | `createAwaySummaryMessage` (builds system message with subtype `"away_summary"`) | chunks.206.mjs (utility) | function |
| `LY5` | `hasSummarySinceLastUserTurn` (idempotency guard) | chunks.206.mjs (utility) | function |
| `AAA` | `shouldGenerateAwaySummary` (focus state + load state predicate) | chunks.206.mjs (utility) | function |
| `_AA` | `MIN_BLUR_DURATION_MS` (minimum away time before recap counts as "away") | chunks.206.mjs (constant) | constant |

---

## Module: Session Recap — Config Integration (chunks.169.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (config row literal) | `awaySummaryConfigRow` (id="awaySummaryEnabled", label="Session recap") | chunks.169.mjs:212-222 | object |
| `M8((x6) => x6.awaySummaryEnabled)` | `useAwaySummaryEnabled` (Zustand selector for the setting) | chunks.169.mjs:16 | function call |

---

## Module: Autocompact Thrash Breaker (chunks.159.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `QkK` | `autocompactDispatcher` (dual-breaker reactive compact entry point) | chunks.159.mjs:1379-1428 | function |
| `gDY` | `shouldCompact` (predicate: tokens > threshold?) | chunks.159.mjs:1370-1377 | function |
| `vI6` | `performCompaction` (the actual compact LLM call) | chunks.159.mjs:574-747 | function |
| `UDY` | `resetCompactState` (post-compact state cleanup + experiment notification) | chunks.159.mjs:1430-1441 | function |
| `FDY` | `isColdCompactEligible` (90-min-stale-cache predicate) | chunks.159.mjs (utility) | function |
| `wLK` | `MAX_CONSECUTIVE_FAILURES` (= 3) | chunks.159.mjs:1457 | constant |
| `a_7` | `RAPID_REFILL_TURN_WINDOW` (= 3) | chunks.159.mjs:1459 | constant |
| `jLK` | `MAX_RAPID_REFILLS` (= 3) | chunks.159.mjs:1461 | constant |
| `okK` | `THRASH_ERROR_MESSAGE` (the user-visible "Autocompact is thrashing..." string) | chunks.159.mjs:1463, 1484 | constant |
| `GI6` | `PRECOMPACT_BLOCKED_PREFIX` ("Compaction blocked by PreCompact hook") | chunks.159.mjs (constant) | constant |
| `uDY` | `MAX_TOOL_USE_RESULT_TOKENS` (= 20000) | chunks.159.mjs:1443 | constant |
| `o_7` | `MIN_AUTOCOMPACT_BYTES_FREED` (= 1e5) | chunks.159.mjs:1445 | constant |
| `$LK` | `MAX_PROMPT_CACHE_TTL_MS` (= 1e6 — adjacent constant, possibly unrelated) | chunks.159.mjs:1447 | constant |
| `t_7` | (related adjacent threshold = 13000) | chunks.159.mjs:1449 | constant |
| `mDY` | (related adjacent threshold = 20000) | chunks.159.mjs:1451 | constant |
| `BDY` | (related adjacent threshold = 20000) | chunks.159.mjs:1453 | constant |
| `e_7` | (related adjacent threshold = 3000) | chunks.159.mjs:1455 | constant |
| `pDY` | (related = 5400000, possibly 90-min cold threshold) | chunks.159.mjs:1465 | constant |

---

## Module: Autocompact — Agent Loop Consumer (chunks.154.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (yy main loop block) | `agentMainLoop` (consumer of `autocompactDispatcher` return value) | chunks.154.mjs:880-1226 | function |
| (telemetry event name) | `tengu_auto_compact_rapid_refill_breaker` (fires when breaker B trips) | chunks.154.mjs:1023 | event |
| (telemetry event name) | `tengu_auto_compact_succeeded` (fires after a successful compaction) | chunks.154.mjs:1041 | event |
| `_9` | `buildErrorMessage` (constructs a synthetic user-error message; v2.1.88 name `buildErrorMessage`) | chunks.154.mjs:1028 | function |

---

## Module: AppState — autoCompactWindow + awaySummaryEnabled

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `awaySummaryEnabled` | session-state flag derived from settings (cached for instant access) | chunks.116.mjs:987-988, chunks.117.mjs:2691, chunks.222.mjs:945 | property |
| `autoCompactTracking` | per-turn tracker (compacted? turnId? turnCounter? consecutiveFailures? consecutiveRapidRefills?) | chunks.154.mjs:961, 978, 1325, 1357, 1379, 1408, 1448, 1629 | property |

---

## Module: Auto-Recap React Hook (v2.1.88 baseline — unchanged in 2.1.112 except cache-age math)

| v2.1.88 symbol | Description |
|----------------|-------------|
| `useAwaySummary` (React hook) | The blur-timer + abort-controller orchestrator |
| `BLUR_DELAY_MS = 5 * 60_000` | Hard-coded 5-min blur threshold |
| `hasSummarySinceLastUserTurn` | Idempotency check — only one recap per user-turn boundary |
| `createAwaySummaryMessage` | Builds the system message with subtype `"away_summary"` |

The 2.1.112 version adds cache-age awareness (`j.current`, `H.current` — cache hit timestamps, 1-hour vs 5-min eligibility) so the recap can short-circuit when the cache is stale (recap would force a full re-cache write).

---

## Module: AnalyticsEvent Coverage

New telemetry events introduced for this module's features:

| Event | Module | Description |
|-------|--------|-------------|
| `tengu_auto_compact_rapid_refill_breaker` | autocompact | Fired when breaker B trips with `consecutiveRapidRefills`, `turnsSincePreviousCompact`, `queryChainId`, `queryDepth` |
| `tengu_api_cache_breakpoints` | prompt cache | Fired on each request showing where cache markers were placed |
| `tengu_prompt_cache_break` | prompt cache | Fired when a cache break is detected (with reason codes: `systemPromptChanged`, `attachmentMissing`, etc.) |
| `tengu_powerup_lesson_opened` | (unrelated, but discovered) | /powerup lesson tracking |

---

## Cross-References

- `addCacheBreakpoints`, `buildSystemPromptBlocks` — also referenced in [07_compact/cache_prefix_compact.md](../07_compact/cache_prefix_compact.md)
- `MAX_RAPID_REFILLS`, `MAX_CONSECUTIVE_FAILURES`, `autocompactDispatcher` — also referenced in [07_compact/edge_cases_and_failures.md](../07_compact/edge_cases_and_failures.md) and [by_version/v2.1.89.md](../by_version/v2.1.89.md)
- `generateAwaySummary`, `recapCommand` — also referenced in [by_version/v2.1.107-109.md](../by_version/v2.1.107-109.md)

---

## Verification

Symbols cross-validated against:
- v2.1.88 source: `grep -l "ENABLE_PROMPT_CACHING\|generateAwaySummary\|awaySummary" /lyz/codespace/3rd/claude-code/src/` — confirms presence of `awaySummary.ts:29` (`generateAwaySummary`) and `services/api/claude.ts:398` (`ENABLE_PROMPT_CACHING_1H_BEDROCK`); confirms ABSENCE of `ENABLE_PROMPT_CACHING_1H`, `FORCE_PROMPT_CACHING_5M`, `consecutiveRapidRefills`.
- v2.1.112 chunks: `grep -l "FORCE_PROMPT_CACHING_5M\|tengu_prompt_cache_1h_config" /lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.112/source/chunks.*.mjs` — confirms `chunks.194.mjs` for cache TTL, `chunks.116.mjs` for awaySummary, `chunks.189.mjs` for /recap, `chunks.159.mjs` for thrash breaker.
