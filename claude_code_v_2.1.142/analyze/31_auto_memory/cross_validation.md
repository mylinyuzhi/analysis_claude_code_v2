# Cross-Validation: v2.1.88 → v2.1.142 (and v2.1.112 → v2.1.142 delta) — Auto Memory

This document is the consolidated cross-reference between the v2.1.88 TypeScript source (`/lyz/codespace/3rd/claude-code/src/memdir/`), the v2.1.112 obfuscated source (`/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.112/source/chunks.*.mjs`), and the v2.1.142 obfuscated source (`/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`).

The v2.1.113 → v2.1.142 changelog does not mention auto memory explicitly, but reading the bundle reveals nine clusters of changes, all *additive* (new dispatch branches, new prompt sections, new tiny variant) or *tightening* (additional rejection rules, narrower trusted-settings sources). No v2.1.112 invariant is violated.

## 1. Source File Map

### v2.1.88 TypeScript (the readable reference)

| File | Lines | Purpose |
|------|-------|---------|
| `src/memdir/memdir.ts` | 507 | Entrypoint name, caps, prompt builders, dispatcher |
| `src/memdir/memoryTypes.ts` | 271 | Taxonomy, prompt sections, frontmatter spec |
| `src/memdir/paths.ts` | 278 | Path resolution, enablement chain, security validation |
| `src/memdir/memoryAge.ts` | 53 | Day count, freshness caveat |
| `src/memdir/memoryScan.ts` | 94 | Directory walk, manifest format |
| `src/memdir/findRelevantMemories.ts` | 141 | Selector + synthesizer |
| `src/memdir/teamMemPaths.ts` | 292 | Team paths, traversal defense |
| `src/memdir/teamMemPrompts.ts` | 100 | Team-combined prompt |

### v2.1.142 obfuscated (the source under analysis)

All in `cli_inner_pretty.js`:

| Location | Functions | Maps to v2.1.88 |
|----------|-----------|------------------|
| 139749-139857 | `x9`, `Pi$`, `Wi$`, `zF`, `lh1`, `gM`, `VTK`, `vTK`, `ih1`, `Zi$`, `rh1`, `YKH`, `YF`, `N5$`, constants, `UY` | paths.ts |
| 141682-141687, 142678-142954 | `xj`, `jKH`, `d5$`, `TK6`, `JKH`, `B5$`, `oi$`, `PKH`, `jl`, `VK6`, `mVK`, `VZH`, `c5$`, `BVK`, `pVK`, `UVK` | memdir.ts (default path) |
| 142167-142340 | `yVK`, `hVK`, `IVK`, `SVK` | memdir.ts (tiny + simple + dream variants) |
| 141788-141813, 141889, 141909-141975, 141988-142165, 142349-142482 | `tO`, `PVK`, `XKH`, `ci$`, `VVK`, `LK6`, `_S1`, `ZZH`, `JK6`, `WK6`, `li$`, `U5$`, `GZH`, `vVK`, `TZH`, `jBH`, `kVK`, `NVK`, `EVK`, `ZK6`, `GK6`, `AS1`, `PK6`, `jK6`, `XK6`, `KS1` | memoryTypes.ts |
| 217408-217445, 217444-217461 | `q36`, `K36`, `_36`, `e6_`, `A36`, `iiK`, `$36` | findRelevantMemories.ts + memoryAge.ts |
| 237066-237286 | `jz_`, `SO$`, `RO$`, `FK7`, `Lz_`, `gK7`, `Pz_`, `Jz_`, `Xz_`, line/file caps | memoryScan.ts + findRelevantMemories.ts |
| 142484-142596 | `zS1`, `g5$`, `Dl`, `ii$`, `RVK`, `CVK`, `bVK`, `YS1`, `ri$`, `Q5$`, `uT` | teamMemPaths.ts |
| 142597-142671 | `fS1` on `xVK` namespace | teamMemPrompts.ts |
| 398197-398295, 425073-425091, 426132-426140 | `Oq5` (analog of `RMY`), `oo7` (`startRelevantMemoryPrefetch`), `_h6` (`memoryHeader`), `ao7`, `Mq5` (`collectSurfacedMemories`), the message-renderer cases | attachments.ts + messages.ts cases |

## 2. Per-Function Cross-Validation Table

The following table captures every memdir function from the v2.1.88 source and its obfuscated equivalents in v2.1.112 and v2.1.142.

| v2.1.88 TS Name | v2.1.112 Obf | v2.1.142 Obf | Behavior Identical? | Notes |
|------------------|---------------|---------------|----------------------|-------|
| `ENTRYPOINT_NAME` | `YW` / `SE_` | `xj` / `nh1` | Yes | Constant `"MEMORY.md"`; two literal copies exist in both versions |
| `MAX_ENTRYPOINT_LINES` | `Ve` | `jKH` | Yes | Constant `200` |
| `MAX_ENTRYPOINT_BYTES` | `Zz8` | `d5$` | Yes | Constant `25000` |
| `AUTO_MEM_DISPLAY_NAME` | `ptY` | `TK6` | Yes | Constant `"auto memory"` |
| `DIR_EXISTS_GUIDANCE` | `FM6` | `JKH` | Yes | Same prompt text |
| `DIRS_EXIST_GUIDANCE` | `sd8` | `B5$` | Yes | Same prompt text |
| `truncateEntrypointContent` | `eU1` | `oi$` | Yes | Bit-identical algorithm: trim, line-cap-200, byte-cap-25K-at-last-newline, contextual warning |
| `ensureMemoryDirExists` | `Iu6` | `PKH` | Yes | Recursive mkdir, debug-level swallow on error |
| `logMemoryDirCounts` | `TW6` | `jl` | Yes | Fire-and-forget readdir + count + emit `tengu_memdir_loaded` |
| `buildMemoryLines` (default) | `neK` | `VK6` | Effectively yes | v2.1.142 adds optional 5th param `forcePassThrough`; default false. Also handles `memoryDir === null` for simple-prompt branch. |
| `buildMemoryPrompt` (agent) | `ieK` | `mVK` | Effectively yes | v2.1.142 passes `forcePassThrough=true` to `buildMemoryLines` to bypass bouncer |
| `buildAssistantDailyLogPrompt` (KAIROS) | inlined inside `fz8` | **REMOVED** | n/a | KAIROS dispatch removed from `loadMemoryPrompt`; log path layout only appears in `/dream` asset |
| `buildSearchingPastContextSection` | `Dz8` | `VZH` | Yes | `tengu_coral_fern`-gated grep guidance |
| `loadMemoryPrompt` | `fz8` | `c5$` | **Algorithmic change**: 5 dispatch branches in v2.1.142 (was 3 in v2.1.112). New: cowork-verbatim, simple-system-prompt, tiny-memory branches. Removed: KAIROS. Preserved: team-mem, single-auto, disabled-telemetry. |
| `MEMORY_TYPES` | `SC4` | `JK6` | Yes | `['user','feedback','project','reference']` |
| `TINY_MEMORY_TYPES` | (n/a — no tiny variant taught) | `WK6` | **New** | `['user','feedback','project']` (drops `reference` from prompt examples) |
| `parseMemoryType` | `CC4` | `VVK` | Yes | `find(t === raw)` with string guard |
| `TYPES_SECTION_COMBINED` | `bC4` | `li$` | Yes | XML with `<scope>` per type |
| `TYPES_SECTION_INDIVIDUAL` | `IC4` (with co-existing `iJY` variant) | `U5$` | Yes | XML without `<scope>` |
| `TYPES_SECTION_COMBINED_TINY` | (n/a) | `GK6` | **New** | Tiny variant with `<body_structure>` and 3 types |
| `TYPES_SECTION_INDIVIDUAL_TINY` | (n/a) | `ZK6` | **New** | Tiny variant with `<body_structure>` and 3 types |
| `TYPES_SECTION_BOUNCER` builder | (n/a) | `_S1` | **New** | 4-bullet pointer to `memory-types` skill (gated on `tengu_ochre_finch`) |
| `maybeSwapToBouncer` | (n/a) | `ZZH` | **New** | Runtime swap between full TYPES_SECTION_* and BOUNCER |
| `isBouncerEnabled` | (n/a) | `LK6` | **New** | `tengu_ochre_finch` gate |
| `BOUNCER_TYPE_DESCRIPTIONS` | (n/a) | `KS1` | **New** | One-line per-type descriptions used by `_S1` |
| `MEMORY_TYPES_SKILL_NAME` | (n/a) | `XK6` | **New** | Constant `"memory-types"` |
| `WHAT_NOT_TO_SAVE_SECTION` | `aH6` | `GZH` | Yes | Same text |
| `MEMORY_DRIFT_CAVEAT` | `ji1` | `PK6` | Yes | Same text |
| `MEMORY_DRIFT_CAVEAT_TINY` | (n/a) | `AS1` | **New** | Tiny variant with "delete the stale memory file" verb shift |
| `WHEN_TO_ACCESS_SECTION` (non-tiny) | `xC4` / `PkK` | `vVK` | Mostly yes | v2.1.142 merges the "ignore" instruction into one bullet (tightens text by ~5 tokens) |
| `WHEN_TO_ACCESS_SECTION_TINY` | (n/a) | `NVK` | **New** | Tiny variant |
| `TRUSTING_RECALL_SECTION` | `sH6` | `TZH` | Yes | Same text, same header `## Before recommending from memory` |
| `RECALLED_IN_TOOL_RESULTS_SECTION` | (n/a) | `EVK` | **New** | Tells model how to interpret `<system-reminder>`-wrapped recall blocks |
| `MEMORY_FRONTMATTER_EXAMPLE` | `mh6` (top-level `type:`) | `jBH` (`metadata.type:` nested) | **Schema change** | Frontmatter `type` field now nested under `metadata` |
| `MEMORY_FRONTMATTER_EXAMPLE_TINY` | (n/a) | `kVK` | **New** | Tiny variant with 3 types in `metadata.type` |
| `ci$` (frontmatter builder) | (inlined templating) | `ci$` cli_inner_pretty.js:141909-141924 | **New helper** | Takes a type-list array, builds the frontmatter example |
| `WIKILINK_GUIDANCE` (`[[name]]`) | (n/a) | `jK6` | **New** | Cross-reference convention taught in prompt |
| `isAutoMemoryEnabled` | `x3` | `x9` | Effectively yes | v2.1.142 adds `Rd()` (toggle-memory) check at step 1 and `Pi$()` (CCR sentinel) check between CCR-without-store and settings |
| `isCcrSentinelDisabled` | (n/a) | `Pi$` | **New** | `tengu_sepia_cormorant` + `tengu_umber_petrel` cohort-level kill-switch |
| `isToggleMemoryDisabled` | (n/a) | `Rd` | **New** | Session-level `/toggle-memory` flag |
| `isExtractModeActive` | `Lk8` | `Wi$` | Yes | `tengu_passport_quail` + non-interactive logic unchanged |
| `getMemoryBaseDir` | `X46` | `zF` | Yes | `CLAUDE_CODE_REMOTE_MEMORY_DIR` env or `~/.claude` |
| `getAutoMemEntrypointDirname` | `RE_` | `lh1` | Yes | Returns `"memory"` or `"tiny_memory"` based on `tengu_billiard_aviary` |
| `isTinyMemoryEnabled` | `wH` | `gM` | Yes | `tengu_billiard_aviary` boolean |
| `validateMemoryPath` | `Vq4` | `VTK` | Mostly yes | v2.1.142 adds explicit rejection of `restNorm.startsWith('..' + sep)` family alongside the existing `restNorm === '..'` |
| `getAutoMemPathOverride` | `kq4` | `vTK` | Yes | Same env var (`CLAUDE_COWORK_MEMORY_PATH_OVERRIDE`), same validator |
| `getAutoMemPathSetting` | `CE_` (4 sources) | `ih1` (3 sources) | **Tightened** | v2.1.142 removes `localSettings` from the override-source list (was: policy → flag → local → user; now: policy → flag → user) |
| `hasAutoMemPathOverride` | `hk8` | `Zi$` | Yes | True iff env-var override is set |
| `getAutoMemBase` | `bE_` | `rh1` | Yes | Canonical git root or project root |
| `getAutoMemEntrypoint` | `Rk8` | `YKH` | Yes | `join(autoMemDir, "MEMORY.md")` |
| `isAutoMemPath` | `YR` | `YF` | Yes | Normalize + prefix |
| `isAutoMemPathWithoutTeam` | (newly exported in chunks; not in v2.1.88 src directly) | `N5$` | Yes | Same algorithm |
| `getAutoMemPath` | `Nw` | `UY` | Yes | Memoized: env override → settings override → computed; cache key `(projectRoot, isTinyMemoryEnabled)` |
| `getAutoMemDailyLogPath` (KAIROS helper) | exported in chunks.64 | **REMOVED** | n/a | KAIROS gone |
| `memoryAgeDays` | `a5z` | `e6_` | Yes | Bit-identical |
| `memoryFreshnessText` | `$Q1` | `A36` | Yes | Bit-identical |
| `memoryFreshnessNote` | `RZ4` | `iiK` | Yes | Bit-identical |
| `memoryAge` (deleted from v2.1.112) | (removed) | (still removed) | n/a | Never coming back |
| `scanMemoryFiles` | `t88` | `SO$` | Mostly yes | v2.1.142 reads `metadata.*` fields via `LKH` instead of top-level fields; tiny cap dropped from 500 → 250 |
| `formatMemoryManifest` | `e88` | `RO$` | Yes | Bit-identical |
| `parseISODateOrNull` | `dMz` | `jz_` | Yes | Bit-identical |
| `MEMDIR_QUERY_SOURCE` | `YQ1` | `$36` | Yes | `"memdir_relevance"` |
| `findRelevantMemoriesSelector` | `uC4` | `FK7` | Yes | Same shape: cached state, alreadySurfaced filter, byFilename map |
| `selectRelevantMemoriesSideQuery` | `nMz` | `Lz_` | Yes | Same JSON schema, same `max_tokens: 256`, same cache_control, same error logging |
| `synthesizeRelevantMemories` | `mC4` | `gK7` | Yes | Same selector-style dispatch |
| `synthesizeMemorySideQuery` | `iMz` | `Pz_` | Yes | Same `max_tokens: 2000`, same JSON schema, same fact-cap-of-7 |
| `SELECT_MEMORIES_SYSTEM_PROMPT` | `cMz` | `Jz_` | Yes | Text identical |
| `SYNTHESIZE_MEMORIES_SYSTEM_PROMPT` | `lMz` | `Xz_` | Yes | Text identical |
| `getSelectorStateForDir` | `AQ1` | `q36` | Yes | `stateByDir.get` |
| `initSelectorStateForDir` | `OQ1` | `K36` | Yes | Manifest as message[0], cache_control: ephemeral |
| `appendSelectorQAToState` | `wQ1` | `_36` | Yes | Append (user q, assistant a) to chain |
| `createMemorySelectorState` | `dK6` | (helper exists; anonymous in this analysis) | Yes | Map + lastUsage |
| `memoryHeader` | `B97` | `_h6` | Yes | Bit-identical — staleness + `Memory: path:` |
| `readMemoriesForSurfacing` | `CMY` | (caller body inside `Oq5`) | Yes | Same caps (200 lines, 4096 bytes), same truncation note, same header pre-computation |
| `getRelevantMemoryAttachments` | `RMY` | `Oq5` | Yes | Same agent-mention expansion, same selector/synthesis dispatch, same attachment shape |
| `startRelevantMemoryPrefetch` | `ikK` | `oo7` | Yes | Same gates, same `tengu_memdir_prefetch_collected` telemetry |
| `collectSurfacedMemories` | `SMY` | `Mq5` | Yes | Same scan-of-history pattern |
| `filterDuplicateMemoryAttachments` | (inline in v2.1.112) | `ao7` | Yes | Promoted to standalone function in v2.1.142, same behavior |
| `relevant_memories` renderer case | chunks.165 | cli_inner_pretty.js:425073-425091 | Yes | Same preamble, same per-memory rendering, same isMeta |
| `nested_memory` renderer case | chunks.166 | cli_inner_pretty.js:426132-426140 | Yes | Same `Contents of <path>:` framing |
| `EXCLUDED_PREFETCH_QUERY_SOURCES` | `bMY` | `Dq5` | Yes | Same set of `extract_memories`, `auto_dream`, `prompt_suggestion`, `speculation`, `compact` |
| `RELEVANT_MEMORIES_CONFIG.MAX_SESSION_BYTES` | `_MY.MAX_SESSION_BYTES = 61440` | `m65.MAX_SESSION_BYTES = 61440` | Yes | 60 KB unchanged |
| Team paths module (`teamMemPaths.ts`) | chunks.83 | cli_inner_pretty.js:142484-142596 | Bit-equivalent | Every function preserved; see [team_paths.md](./team_paths.md) for per-function mapping |
| `buildCombinedMemoryPrompt` (non-tiny) | `BtY` | `fS1` (on `xVK` namespace) | Mostly yes | Same structure, uses v2.1.142 frontmatter format (`metadata.type` nested) and optional bouncer-swap |
| `buildCombinedMemoryPromptTiny` | (n/a) | `hVK` | **New** | Tiny dual-dir prompt |
| `buildMemoryLinesTiny` | (n/a) | `yVK` | **New** | Tiny single-dir prompt |
| `buildSimpleMemoryPrompt` | (n/a) | `IVK` | **New** | Compressed prompt for simple-system-prompt branch |
| `buildDreamPrompt` | (n/a) | `SVK` | **New** | `/dream` offline-pruning prompt |
| `shouldUseFullMemoryForAgent` | (n/a) | `BVK` | **New** | Predicate combining auto-on, !tiny, !team, !simple |
| `getSimpleAgentHeader` | (n/a) | `pVK` | **New** | One-line agent header for full-default mode |
| `buildAgentMemoryPrompt` | (n/a) | `UVK` | **New entrypoint** | Per-agent dispatcher |

## 3. Algorithmic Invariants — Confirmed Bit-Equivalent

The following invariants are bit-equivalent across v2.1.88 → v2.1.112 → v2.1.142:

1. **`MEMORY.md` filename**: `'MEMORY.md'` literal in every version.
2. **200-line / 25 KB caps**: Same constants, same algorithm.
3. **Line-first then byte-at-last-newline truncation**: Identical step-by-step logic.
4. **Three contextual warning forms**: "byte only", "line only", "both" branches with identical text.
5. **Empty-file placeholder string**: "Your MEMORY.md is currently empty..." identical.
6. **`'auto memory'` display name literal**: Same string.
7. **`memory_type` telemetry tag**: `'auto'` for `loadMemoryPrompt`, `'agent'` for `buildMemoryPrompt`. Same logic.
8. **`tengu_memdir_disabled` payload shape**: Same `{disabled_by_env_var, disabled_by_setting}` keys.
9. **Closed `MEMORY_TYPES`**: Same 4-element array.
10. **`parseMemoryType` semantics**: Same string-only validator, same `find(t === raw)` linear scan.
11. **`getAutoMemPath` memoization**: Same cache key shape (`projectRoot|tinyFlag` in v2.1.112 and v2.1.142; bare `projectRoot` in v2.1.88).
12. **`isAutoMemPath` normalize-then-prefix**: Same path-traversal defense.
13. **`validateMemoryPath` core rejections**: Same 6-class rejection set (`!isAbsolute`, length<3, drive root, UNC, double-slash, null byte).
14. **`memoryAgeDays` / `memoryFreshnessText` / `memoryFreshnessNote`**: All three bit-equivalent.
15. **`scanMemoryFiles` core algorithm**: Single-pass read+stat, `Promise.allSettled`, outer try/catch returning `[]`.
16. **`formatMemoryManifest` layout**: Same per-memory line, same body-indent for synthesis.
17. **`findRelevantMemories` cache state machine**: Same `stateByDir` map, same manifest-as-cached-msg-0, same append-only Q/A chain.
18. **`memoryHeader` staleness + path format**: Same conditional prepend.
19. **`relevant_memories` and `nested_memory` renderer cases**: Identical message shapes.
20. **Team-paths validation defense layers**: All 5 sanitization checks, realpath ancestor walk, post-realpath containment all preserved.

## 4. v2.1.112 → v2.1.142 Delta Summary

### Additions (new in v2.1.142)

| Cluster | Symbol(s) | Purpose |
|---------|-----------|---------|
| Tiny memory variant | `yVK`, `hVK`, `WK6`, `ZK6`, `GK6`, `kVK`, `Dz_=200`, `Mz_=250` | One-fact-per-file mode with `metadata.type` schema and wikilinks |
| Simple system prompt branch | `IVK`, `LY()` integration in `c5$` | Compressed memory section for high-volume deployments |
| Cowork verbatim env var | `CLAUDE_COWORK_MEMORY_GUIDELINES` branch in `c5$` | Full operator-controlled memory body via env var |
| Skill-pointer types section | `_S1`, `ZZH`, `LK6`, `KS1`, `XK6` | 4-bullet variant pointing at `memory-types` skill (gated on `tengu_ochre_finch`) |
| Recalled-in-tool-results prompt section | `EVK` | New system-prompt-level rule about `<system-reminder>`-wrapped recall blocks (tiny variant) |
| Tiny drift caveat verb shift | `AS1` | "delete the stale memory file" instead of "update or remove" |
| Frontmatter helper | `ci$`, `LKH`, `qS1`, `$S1` | Build / read `metadata.*` nested frontmatter |
| Wikilink convention | `jK6` | `[[name]]` cross-references taught in prompt |
| CCR sentinel disable | `Pi$()`, `tengu_sepia_cormorant`, `tengu_umber_petrel` | Cohort-level memory kill-switch |
| Session-level toggle-memory | `Rd()` integration in `x9` | Per-session `/toggle-memory` flag |
| Dream-pruning prompt | `SVK` | Offline memory-pruning prompt for `/dream` agent |
| Agent-memory entrypoint | `UVK`, `BVK`, `pVK` | New per-agent dispatch logic |
| `isAutoMemPathWithoutTeam` | `N5$` | Exported predicate for "auto-mem minus team subtree" |

### Removals (in v2.1.142 but were in v2.1.112)

| Cluster | Removed Symbol | What was removed |
|---------|---------------|------------------|
| KAIROS dispatch | inlined daily-log branch in `fz8` | The append-only daily-log paradigm — no longer fires from `loadMemoryPrompt`. Only documentation remnants in `/dream` skill asset. |
| `getAutoMemDailyLogPath` | (was exported in v2.1.112 paths) | Helper for KAIROS log path layout — gone with the dispatch |
| `localSettings` as override source | (was in `CE_` cascade) | Tightened: `autoMemoryDirectory` no longer read from `localSettings` |

### Tightenings

| Cluster | Change |
|---------|--------|
| `validateMemoryPath` tilde expansion | Adds explicit rejection of `restNorm.startsWith('..' + sep)` and `startsWith('..\\')` patterns |
| `isAutoMemoryEnabled` | Adds two new gates: `Rd()` at step 1 and `Pi$()` at step 6 |
| Synthesis file cap | Dropped from 500 → 250 |
| Tiny memory restricted taxonomy | Drops `reference` from tiny prompt examples (`WK6 = ['user','feedback','project']`) |
| WHEN_TO_ACCESS_SECTION | Two-clause "ignore memory" instruction merged into one bullet (tighter by ~5 tokens) |

### Renamings (no behavior change)

| v2.1.112 | v2.1.142 |
|----------|----------|
| `YW` / `SE_` | `xj` / `nh1` (ENTRYPOINT_NAME) |
| `Ve` | `jKH` (MAX_ENTRYPOINT_LINES) |
| `Zz8` | `d5$` (MAX_ENTRYPOINT_BYTES) |
| `ptY` | `TK6` (AUTO_MEM_DISPLAY_NAME) |
| `eU1` | `oi$` (truncateEntrypointContent) |
| `Iu6` | `PKH` (ensureMemoryDirExists) |
| `TW6` | `jl` (logMemoryDirCounts) |
| `neK` | `VK6` (buildMemoryLines) |
| `ieK` | `mVK` (buildMemoryPrompt) |
| `fz8` | `c5$` (loadMemoryPrompt) |
| `Dz8` | `VZH` (buildSearchingPastContextSection) |
| `Nw` | `UY` (getAutoMemPath) |
| `x3` | `x9` (isAutoMemoryEnabled) |
| `Vq4` | `VTK` (validateMemoryPath) |
| `CC4` | `VVK` (parseMemoryType) |
| `SC4` | `JK6` (MEMORY_TYPES) |
| `aH6` | `GZH` (WHAT_NOT_TO_SAVE_SECTION) |
| `xC4` | `vVK` (WHEN_TO_ACCESS_SECTION) |
| `sH6` | `TZH` (TRUSTING_RECALL_SECTION) |
| `ji1` | `PK6` (MEMORY_DRIFT_CAVEAT) |
| `bC4` | `li$` (TYPES_SECTION_COMBINED) |
| `IC4` | `U5$` (TYPES_SECTION_INDIVIDUAL) |
| `mh6` / `MkK` | `jBH` (MEMORY_FRONTMATTER_EXAMPLE — now nested schema) |
| `p2` | `tO` (parseFrontmatter) |
| `a5z` | `e6_` (memoryAgeDays) |
| `$Q1` | `A36` (memoryFreshnessText) |
| `RZ4` | `iiK` (memoryFreshnessNote) |
| `B97` | `_h6` (memoryHeader) |
| `t88` | `SO$` (scanMemoryFiles) |
| `e88` | `RO$` (formatMemoryManifest) |
| `dMz` | `jz_` (parseISODateOrNull) |
| `uC4` | `FK7` (findRelevantMemoriesSelector) |
| `nMz` | `Lz_` (selectRelevantMemoriesSideQuery) |
| `mC4` | `gK7` (synthesizeRelevantMemories) |
| `iMz` | `Pz_` (synthesizeMemorySideQuery) |
| `AQ1` | `q36` (getSelectorStateForDir) |
| `OQ1` | `K36` (initSelectorStateForDir) |
| `wQ1` | `_36` (appendSelectorQAToState) |
| `BtY` | `fS1` (buildCombinedMemoryPrompt) |
| `Ye6` | `g5$` (isTeamMemoryEnabled) |
| `vp` | `Dl` (getTeamMemPath) |
| `MW4` | `bVK` (isTeamMemPath) |
| `Ae6` | `Q5$` (isTeamMemFile) |
| `JW4` | `RVK` (realpathDeepestExisting) |
| `XW4` | `CVK` (isRealPathWithinTeamDir) |
| `jqz` | `YS1` (validateTeamMemWritePath) |
| `JR8` | `ri$` (validateTeamMemKey) |
| `$qz` | `zS1` (sanitizePathKey) |
| `TD` | `uT` (PathTraversalError) |
| `RMY` | `Oq5` (getRelevantMemoryAttachments) |
| `ikK` | `oo7` (startRelevantMemoryPrefetch) |
| `CMY` | inline in `Oq5` (readMemoriesForSurfacing) |
| `SMY` | `Mq5` (collectSurfacedMemories) |
| `bMY` | `Dq5` (EXCLUDED_PREFETCH_QUERY_SOURCES) |
| `_MY` | `m65` (RELEVANT_MEMORIES_CONFIG) |

## 5. Verdict

**v2.1.142 introduces no breaking behavior for memory-on-disk semantics.** Every disk operation, every validator, every cap, every retrieval algorithm preserved from v2.1.112 still does the same thing. The on-disk format is forward-compatible with v2.1.112 files (legacy top-level `type:` files appear as untyped legacy entries but remain readable).

**v2.1.142 introduces substantial prompt-engineering refinements.** The new tiny variant, the bouncer skill-pointer, the simple-system-prompt branch, the cowork-verbatim env var, the recalled-in-tool-results section, and the wikilink convention all change what the model *learns* about memory. None of them change what the runtime *does* with memory data.

**The biggest single change is the dispatcher shape**: `loadMemoryPrompt` grew from 3 branches to 5, with KAIROS removed and tiny + simple + cowork-verbatim added. This is the structural reflection of the v2.1.13x-2.1.14x prompt experimentation phase — running multiple memory paradigms (single, dual, tiny, simple, verbatim) in parallel under different feature flags.

**Confidence**: HIGH. The cross-validation table maps every v2.1.88 source function to a v2.1.142 obfuscated symbol; bit-equivalence is verified for the 20 invariants above; every new symbol has a clear addition story; every removed symbol has a clear removal rationale (KAIROS dispatch dropped because tiny+simple displaced it).
