# Symbol Additions — Unit 03 (Auto Memory Core: memdir + types + paths)

New symbols discovered while writing `31_auto_memory/` for v2.1.112. These belong to the **Core Features** category (auto memory). When the project rolls these into the main `symbol_index_core_features.md`, they should land under a `## Module: Auto Memory` section.

## Module: Auto Memory — Core (memdir.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `YW` | `ENTRYPOINT_NAME` (= `"MEMORY.md"`) | chunks.153.mjs:2139 | constant |
| `SE_` | `MEMORY_MD_FILENAME` (= `"MEMORY.md"`, alt in paths.ts mirror) | chunks.64.mjs:1374 | constant |
| `Ve` | `MAX_ENTRYPOINT_LINES` (= 200) | chunks.153.mjs:2141 | constant |
| `Zz8` | `MAX_ENTRYPOINT_BYTES` (= 25000) | chunks.192.mjs:90 | constant |
| `ptY` | `AUTO_MEM_DISPLAY_NAME` (= `"auto memory"`) | chunks.192.mjs:92 | constant |
| `FM6` | `DIR_EXISTS_GUIDANCE` (string literal) | chunks.153.mjs:2143 | constant |
| `sd8` | `DIRS_EXIST_GUIDANCE` (combined-mode string) | chunks.153.mjs:2145 | constant |
| `eU1` | `truncateEntrypointContent` | chunks.191.mjs:3119 | function |
| `Iu6` | `ensureMemoryDirExists` | chunks.191.mjs:3153 | function |
| `TW6` | `logMemoryDirCounts` | chunks.191.mjs:3165 | function |
| `neK` | `buildMemoryLines` | chunks.192.mjs:3 | function |
| `ieK` | `buildMemoryPrompt` | chunks.192.mjs:9 | function |
| `fz8` | `loadMemoryPrompt` | chunks.192.mjs:45 | function |
| `Dz8` | `buildSearchingPastContextSection` | chunks.192.mjs:36 | function |
| `DkK` | `buildMemoryLines (individual variant in chunks.153)` | chunks.153.mjs:2147 | function |
| `ZkK` | `buildCombinedMemoryLines (chunks.153 variant)` | chunks.153.mjs:2153 | function |
| `fkK` | `buildDreamPruningPrompt` | chunks.153.mjs:2159 | function |
| `vkK` | `buildExtractionSubagentPrompt` | chunks.153.mjs:2225 | function |
| `Ka8` | `teamMemPaths` module | chunks.192.mjs:88 | object |
| `FtY` | `teamMemPrompts` module | chunks.192.mjs:94 | object |

## Module: Auto Memory — Types (memoryTypes.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `SC4` | `MEMORY_TYPES` (= `['user','feedback','project','reference']`) | chunks.99.mjs:538 | constant |
| `CC4` | `parseMemoryType` | chunks.99.mjs:516 | function |
| `bC4` | `TYPES_SECTION_COMBINED` (with `<scope>` tags) | chunks.99.mjs body | constant |
| `IC4` | `TYPES_SECTION_INDIVIDUAL` (no scope tags) | chunks.99.mjs body | constant |
| `aH6` | `WHAT_NOT_TO_SAVE_SECTION` | chunks.99.mjs body | constant |
| `ji1` | `MEMORY_DRIFT_CAVEAT` | chunks.99.mjs:529 | constant |
| `xC4` | `WHEN_TO_ACCESS_SECTION` (chunks.99 variant) | chunks.99.mjs body | constant |
| `PkK` | `WHEN_TO_ACCESS_SECTION` (chunks.153 alt) | chunks.153.mjs body | constant |
| `sH6` | `TRUSTING_RECALL_SECTION` ("## Before recommending from memory") | chunks.99.mjs body | constant |
| `mh6` | `MEMORY_FRONTMATTER_EXAMPLE` (3-field form: name/description/type) | chunks.99.mjs body | constant |
| `MkK` | `MEMORY_FRONTMATTER_EXAMPLE` (2-field form: name/type) | chunks.153.mjs:2198 | constant |
| `WkK` | `RECALLED_MEMORIES_SECTION` ("## Recalled memories in tool results") | chunks.153.mjs body | constant |
| `nJY` | `MEMORY_DRIFT_CAVEAT (chunks.153 stale-and-delete variant)` | chunks.153.mjs:2186 | constant |
| `iJY` | `TYPES_SECTION_INDIVIDUAL (chunks.153 one-fact variant)` | chunks.153.mjs body | constant |
| `rJY` | `TYPES_SECTION_COMBINED (chunks.153 one-fact variant)` | chunks.153.mjs body | constant |
| `t88` | `scanMemoryFiles` | chunks.99.mjs:553 | function |
| `e88` | `formatMemoryManifest` | chunks.99.mjs:587 | function |
| `dMz` | `parseISODateOrNull` | chunks.99.mjs:542 | function |
| `FMz` | `MAX_MEMORY_FILES` (= 200) | chunks.99.mjs:603 | constant |
| `gMz` | `MAX_MEMORY_FILES_TINY` (= 500) | chunks.99.mjs:605 | constant |
| `UMz` | `FRONTMATTER_MAX_LINES` (= 30) | chunks.99.mjs:607 | constant |
| `QMz` | `FRONTMATTER_MAX_LINES_TINY` (= 200) | chunks.99.mjs:609 | constant |

## Module: Auto Memory — Paths (paths.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `x3` | `isAutoMemoryEnabled` | chunks.64.mjs:1301 | function |
| `Lk8` | `isExtractModeActive` | chunks.64.mjs:1313 | function |
| `X46` | `getMemoryBaseDir` | chunks.64.mjs:1318 | function |
| `RE_` | `getAutoMemEntrypointDirname` (returns `"memory"` or `"tiny_memory"`) | chunks.64.mjs:1323 | function |
| `wH` | `isTinyMemoryEnabled` (= `getFeatureValue("tengu_billiard_aviary")`) | chunks.64.mjs:1327 | function |
| `Vq4` | `validateMemoryPath` | chunks.64.mjs:1331 | function |
| `kq4` | `getAutoMemPathOverride` (env-var) | chunks.64.mjs:1345 | function |
| `CE_` | `getAutoMemPathSetting` (settings.json) | chunks.64.mjs:1349 | function |
| `hk8` | `hasAutoMemPathOverride` | chunks.64.mjs:1354 | function |
| `bE_` | `getAutoMemBase` (canonical git root) | chunks.64.mjs:1358 | function |
| `Rk8` | `getAutoMemEntrypoint` (= `<autoMemPath>/MEMORY.md`) | chunks.64.mjs:1362 | function |
| `YR` | `isAutoMemPath` (path-membership predicate) | chunks.64.mjs:1366 | function |
| `Nw` | `getAutoMemPath` (memoized full resolver) | chunks.64.mjs:1386 | function |
| `LE_` | `AUTO_MEM_DIRNAME` (= `"memory"`) | chunks.64.mjs:1370 | constant |
| `hE_` | `TINY_MEM_DIRNAME` (= `"tiny_memory"`) | chunks.64.mjs:1372 | constant |
| `Tq4` | `PATH_SEP` (= `path.sep`) | chunks.64.mjs (referenced) | constant |
| `EE_` | `homedir` (Node `os.homedir` re-export) | chunks.64.mjs (referenced) | function |
| `wb1` | `normalize` (Node `path.normalize` re-export) | chunks.64.mjs (referenced) | function |
| `yE_` | `isAbsolute` (Node `path.isAbsolute` re-export) | chunks.64.mjs (referenced) | function |
| `yk8` | `join` (Node `path.join` re-export) | chunks.64.mjs (referenced) | function |
| `AP` | `sanitizePath` | chunks.64.mjs (referenced) | function |
| `c9` | `getProjectRoot` | chunks.64.mjs (referenced) | function |
| `zj` | `findCanonicalGitRoot` | chunks.64.mjs (referenced) | function |
| `v7` | `getInitialSettings` | chunks.64.mjs (referenced) | function |
| `E1` | `getSettingsForSource` | chunks.64.mjs (referenced) | function |
| `S6` | `isEnvTruthy` | chunks.64.mjs (referenced) | function |
| `c5` | `isEnvDefinedFalsy` | chunks.64.mjs (referenced) | function |
| `P1` | `memoize` (lodash-es memoize re-export) | chunks.64.mjs (referenced) | function |
| `A7` | `getClaudeConfigHomeDir` | chunks.64.mjs (referenced) | function |
| `Qg` | `isAutoMemoryDisableShortCircuit` (v2.1.112-only addition not in v2.1.88) | chunks.64.mjs:1302 | function |

## Module: Auto Memory — Shared Utilities

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `p2` | `parseFrontmatter` (used everywhere, not memory-specific) | chunks.80.mjs:2422 | function |
| `zy6` | `FRONTMATTER_RE` (= `/^---\n([\s\S]*?)\n---\n?/`) | chunks.80.mjs (referenced) | constant |
| `yt6` | `parseYaml` (strict) | chunks.80.mjs (referenced) | function |
| `g8z` | `autoQuoteYaml` (second-pass fixup) | chunks.80.mjs (referenced) | function |
| `o4` | `formatFileSize` | chunks.191.mjs (referenced) | function |
| `V8` | `getFsImplementation` | chunks.191.mjs (referenced) | function |
| `E` | `logForDebugging` | chunks.191.mjs (referenced) | function |
| `Q1` | `errorCodeExtractor` (extracts `code` property from Error) | chunks.191.mjs (referenced) | function |
| `d` | `logEvent` | chunks.192.mjs (referenced) | function |
| `u8` | `getFeatureValue_CACHED_MAY_BE_STALE` | chunks.192.mjs (referenced) | function |
| `XT` | `systemPromptSection` (registers a named dynamic section) | chunks.194.mjs (referenced) | function |

## Module: Auto Memory — Telemetry Events

| Event Name | Where Emitted | Payload Fields |
|------------|---------------|----------------|
| `tengu_memdir_loaded` | `logMemoryDirCounts` (`TW6`) chunks.191.mjs:3172 | `memory_type` (`auto` / `team` / `agent`), `content_length`, `line_count`, `was_truncated`, `was_byte_truncated`, `total_file_count`, `total_subdir_count` |
| `tengu_memdir_disabled` | `loadMemoryPrompt` (`fz8`) chunks.192.mjs:81 | `disabled_by_env_var: boolean`, `disabled_by_setting: boolean` |
| `tengu_team_memdir_disabled` | `loadMemoryPrompt` (`fz8`) chunks.192.mjs:84 | (empty) — gated by `tengu_herring_clock` |

## Feature Flags Referenced

| Flag (gb key) | Source-code helper | Effect |
|--------------|-----------------------|--------|
| `tengu_moth_copse` | `loadMemoryPrompt` (`fz8`) chunks.192.mjs:47 | Skip-index mode (single-step save instead of two-step) |
| `tengu_coral_fern` | `buildSearchingPastContextSection` (`Dz8`) chunks.192.mjs:37 | Inject "## Searching past context" guidance |
| `tengu_billiard_aviary` | `isTinyMemoryEnabled` (`wH`) chunks.64.mjs:1328 | One-fact-per-file ("tiny memory") mode, switches dirname `memory` → `tiny_memory` |
| `tengu_herring_clock` | `loadMemoryPrompt` (`fz8`) chunks.192.mjs:84 | Team-memory cohort flag — gates `tengu_team_memdir_disabled` emission |
| `tengu_passport_quail` | `isExtractModeActive` (`Lk8`) chunks.64.mjs:1314 | Enables extractMemories background agent |
| `tengu_slate_thimble` | `isExtractModeActive` (`Lk8`) chunks.64.mjs:1315 | Allows extract mode in non-interactive sessions |
| `KAIROS` (build-time `feature()` flag) | `loadMemoryPrompt` chunks.192.mjs:50 | Assistant daily-log mode |
| `TEAMMEM` (build-time `feature()` flag) | `loadMemoryPrompt` chunks.192.mjs:65 | Team memory dual-directory mode |

## Notes for Symbol-Index Integration

1. **Two `MEMORY.md` literals**: There are two separately-defined `"MEMORY.md"` strings in v2.1.112 — `YW` in chunks.153.mjs:2139 (memdir.ts side) and `SE_` in chunks.64.mjs:1374 (paths.ts side). They are intentionally duplicated rather than shared; the bundler kept them as distinct module-local constants. Both should be mapped, with a cross-reference note.

2. **Two `TYPES_SECTION_*` variant pairs**: chunks.99.mjs has `bC4` / `IC4` (current public taxonomy text) while chunks.153.mjs has `rJY` / `iJY` (one-fact-per-file variant). Both pairs need separate entries — the chunks.153 forms are the experimental tiny-mem prompts.

3. **`Qg()` is v2.1.112-only**: The leading short-circuit in `isAutoMemoryEnabled` (chunks.64.mjs:1302) does not appear in v2.1.88 source. Its symbol name suggests it's part of a broader disable-gate (sandbox / CCR / test-mode), but the actual implementation chunk needs follow-up to identify.

4. **Memoize cache key change**: v2.1.88 uses `() => getProjectRoot()` as the cache key for `getAutoMemPath`. v2.1.112 uses `() => \`${getProjectRoot()}|${isTinyMemoryEnabled()}\``. The flag is now part of the key so flipping it (`tengu_billiard_aviary`) invalidates the path without requiring a restart.
