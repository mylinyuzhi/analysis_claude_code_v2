# Symbol Additions — Unit 5: 31_auto_memory team integration (v2.1.112)

Symbols introduced/relocated for the team memory subsystem in v2.1.112. These map the obfuscated names in `source/chunks.*.mjs` to readable names that correspond 1:1 with `claude-code-kim/src/` (v2.1.88) identifiers.

Scope: `src/memdir/teamMemPaths.ts`, `src/memdir/teamMemPrompts.ts`, and the `nested_memory` / `relevant_memories` plumbing in `src/utils/messages.ts` + `src/utils/attachments.ts`.

---

## Module: Team Memory Paths (`src/memdir/teamMemPaths.ts`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `TD` | `PathTraversalError` (class) | chunks.83.mjs:2098, 2105-2110 | class |
| `$qz` | `sanitizePathKey` | chunks.83.mjs:2005-2019 | function |
| `Ye6` | `isTeamMemoryEnabled` | chunks.83.mjs:2021-2024 | function |
| `vp` | `getTeamMemPath` | chunks.83.mjs:2026-2028 | function |
| `HR8` | `isTeamMemSyncActive` (synthetic — checks `isTeamMemoryEnabled() && getTeamMemSyncState() === "has-content"`) | chunks.83.mjs:2030-2033 | function |
| `JW4` | `realpathDeepestExisting` | chunks.83.mjs:2035-2052 | function |
| `XW4` | `isRealPathWithinTeamDir` | chunks.83.mjs:2054-2065 | function |
| `MW4` | `isTeamMemPath` | chunks.83.mjs:2067-2071 | function |
| `jqz` | `validateTeamMemWritePath` | chunks.83.mjs:2073-2081 | function |
| `JR8` | `validateTeamMemKey` | chunks.83.mjs:2083-2092 | function |
| `Ae6` | `isTeamMemFile` | chunks.83.mjs:2094-2096 | function |
| `Tp` | team memory paths module-export object | chunks.83.mjs:2003 | object |
| `Wqz` / `Ka8` / `VkK` / `ImK` / `$XY` | wrapped re-export handles of the team-paths module (each chunk imports it under its own local) | chunks.83.mjs:2183, 192.mjs:88-113, 154.mjs:315-340, 173.mjs (uses `ImK`), 154.mjs:499 | re-export |
| `jR8` | `pathSep` (= `path.sep`, used by `getTeamMemPath`) | chunks.83.mjs (referenced) | constant |
| `yg1` | `joinPath` (= `path.join`) | chunks.83.mjs (referenced) | function |
| `Lg1` | `resolvePath` (= `path.resolve`) | chunks.83.mjs:2068, 2075 | function |
| `jW4` | `dirname` (= `path.dirname`) | chunks.83.mjs:2038 | function |
| `HW4` | `realpath` (= `fs.promises.realpath`) | chunks.83.mjs:2039, 2057 | function |
| `wqz` | `lstat` (= `fs.promises.lstat`) | chunks.83.mjs:2044 | function |
| `Q1` | `getErrnoCode` | chunks.83.mjs:2042, 2059 | function |
| `Nw` | `getAutoMemPath` | chunks.83.mjs:2027, 192.mjs:66-67 | function |
| `x3` | `isAutoMemoryEnabled` | chunks.83.mjs:2022 | function |
| `u8` | `getFeatureValue_CACHED_MAY_BE_STALE` (Growthbook flag reader) | chunks.83.mjs:2023, many | function |
| `X81` | `getTeamMemSyncState` (returns `"has-content"` when the watcher has populated the team dir) | chunks.83.mjs:2032 | function |

---

## Module: Team Memory Prompt Builder (`src/memdir/teamMemPrompts.ts`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BtY` | `buildCombinedMemoryPrompt` (team + private dual-directory prompt) | chunks.191.mjs:3104-3110 | function |
| `ceK` | team prompts module-export object | chunks.191.mjs:3102 | object |
| `FtY` | wrapped re-export of the team-prompts module (used by `getAutoMemoryPromptForSession` in chunks.192) | chunks.191.mjs:3098-3099, 192.mjs:94, 113-114 | re-export |
| `leK` | team-prompts module initializer (lazy import) | chunks.191.mjs:3112-3117 | function |
| `sd8` | `DIRS_EXIST_GUIDANCE` (string asserting both memory dirs already exist) | chunks.191.mjs:3108 | constant |
| `bC4` | `TYPES_SECTION_COMBINED` (4-type taxonomy text array) | chunks.191.mjs:3108 | constant |
| `aH6` | `WHAT_NOT_TO_SAVE_SECTION` | chunks.191.mjs:3108 | constant |
| `ji1` | `MEMORY_DRIFT_CAVEAT` | chunks.191.mjs:3108 | constant |
| `sH6` | `TRUSTING_RECALL_SECTION` | chunks.191.mjs:3108 | constant |
| `mh6` | `MEMORY_FRONTMATTER_EXAMPLE` (lines for YAML example) | chunks.191.mjs:3107 | constant |
| `YW` | `ENTRYPOINT_NAME` (= `"MEMORY.md"`) | chunks.191.mjs:3107 | constant |
| `Ve` | `MAX_ENTRYPOINT_LINES` | chunks.191.mjs:3107 | constant |
| `Dz8` | `buildSearchingPastContextSection` | chunks.191.mjs:3108 | function |

---

## Module: Memory Header / Attachment Injection (`src/utils/messages.ts` + `src/utils/attachments.ts`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `B97` | `memoryHeader` (renders the `Memory: <path>:` prefix used by `relevant_memories` items) | chunks.155.mjs:2152-2157 | function |
| `$Q1` | `memoryFreshnessText` (optional staleness line prepended to header) | chunks.155.mjs:2153 | function |
| `CMY` | `loadAndFormatRelevantMemories` (turns `{path, mtimeMs}` records into `{header, content}` records — calls `memoryHeader` once at attachment-creation time) | chunks.155.mjs:2126-2150 | function |
| `SMY` | `collectRelevantMemoryStats` (Set of paths + total bytes, drives dedup/budget caps in `ikK`) | chunks.155.mjs:2114-2124 | function |
| `ikK` | `startRelevantMemoryPrefetch` (begins the async recall request that produces `relevant_memories` attachments) | chunks.155.mjs:2159-2185 | function |
| `_MY` | `RELEVANT_MEMORY_BUDGETS` (object with `MAX_SESSION_BYTES`) | chunks.155.mjs:2167 | constant |
| `bMY` | `relevantMemoryConsumedTurns` (per-turn Set guarding against double-fetch) | chunks.155.mjs:2161 | variable |
| `RMY` | `recallMemoryRequest` (network call that the prefetch awaits) | chunks.155.mjs:2170 | function |
| `x97` | `MAX_MEMORY_LINES` (line cap before truncating a memory file body) | chunks.155.mjs:2135-2138 | constant |
| `xNK` | `MAX_MEMORY_BYTES` (byte cap before truncating a memory file body) | chunks.155.mjs:2135-2138 | constant |
| `xq` | `FILE_READ_TOOL_NAME` (interpolated into the truncation-pointer message) | chunks.155.mjs:2138 | constant |
| `hMY` | `renderNestedMemoryAttachment` (server-side fork that converts a `nested_memory` attachment into a user-meta message) | chunks.155.mjs:1508 | function |
| `t8` | `createUserMessage` (`isMeta` carrier used by `nested_memory` and `relevant_memories` renderers) | many | function |
| `X_` | `wrapMessagesInSystemReminder` | many | function |
| `cRK` | `hasSynthesisMemory` (helper used by `lRK` to decide whether to keep `relevant_memories` after compaction) | chunks.162.mjs:2085 | function |

---

## Module: Team Memory Auto-Extraction Hooks (cross-cutting)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `vkK` | `buildExtractMemoriesPrompt` (takes `(messageCount, entrypointBytes, teamMemoryEnabled)` — selects team vs private extraction prompt variant) | chunks.154.mjs:225 | function |
| `wXY` | `TEAM_MEMORY_DREAM_SECTION` (consolidator prompt block — instructs the auto-dream agent how to treat `team/`) | chunks.154.mjs:421 | constant |
| `fkK` / `P38` | `buildAutoDreamUserPromptWithTeam` (variants of the dream prompt that include team memory awareness when enabled) | chunks.154.mjs:525 | function |
| `qXY` | `extractWrittenMemoryPaths` (parses the extract-subagent transcript for written file paths) | chunks.154.mjs:239 | function |
| `oJY` | `basename` (`path.basename`) | chunks.154.mjs:245 | function |
| `w7` | `countWhere` (counts elements that match a predicate) | chunks.154.mjs:246 | function |
| `_c8` | `formatMemoryWriteNotification` (builds the per-turn append-system-message announcing saved memories; mutated with `teamCount`) | chunks.154.mjs:259 | function |

---

## Notes on Module Wrapping

The team-paths module (`Tp` at chunks.83.mjs:2003) is exported and re-imported via Webpack-style module wrappers under different local handles in each consumer chunk:

- chunks.83.mjs binds it to **`Wqz`** (used at line 2115 by `PW4` to exclude team memory from auto-managed CLAUDE.md detection).
- chunks.192.mjs binds it to **`Ka8`** (used at lines 52, 65 by the prompt dispatcher).
- chunks.154.mjs binds it to **`VkK`** (used at lines 213, 246 by `extractMemories`).
- chunks.173.mjs binds it to **`ImK`** (used at lines 1646, 1650 by the memory-folder TUI option).
- chunks.154.mjs:499 references it as **`$XY`** (used by `IkK`/auto-dream when team memory enabled).

All five handles point at the same set of exports (`isTeamMemoryEnabled`, `getTeamMemPath`, `getTeamMemEntrypoint`, `isTeamMemPath`, `validateTeamMemWritePath`, `validateTeamMemKey`, `isTeamMemFile`). The duplication is a side-effect of Webpack bundling each chunk's `require()` to its own variable; semantically it is a single module.
