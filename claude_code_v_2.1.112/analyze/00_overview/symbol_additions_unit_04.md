# Symbol Additions — Unit 4 (Auto Memory Operations: Scan / Relevance / Age / Attachment)

Symbols discovered while analyzing the auto-memory pipeline in v2.1.112 — directory scanning, Sonnet-driven relevance selection (selector + synthesis modes), staleness/age primitives, and attachment normalization.

Source-of-truth paths (v2.1.88 deobfuscated):
- `/lyz/codespace/3rd/claude-code/src/memdir/findRelevantMemories.ts` (141 lines)
- `/lyz/codespace/3rd/claude-code/src/memdir/memoryScan.ts` (94 lines)
- `/lyz/codespace/3rd/claude-code/src/memdir/memoryAge.ts` (53 lines)
- `/lyz/codespace/3rd/claude-code/src/utils/attachments.ts` (`memoryHeader`, `readMemoriesForSurfacing`, `getRelevantMemoryAttachments`, `MemoryPrefetch`, `startRelevantMemoryPrefetch`, `collectSurfacedMemories`)
- `/lyz/codespace/3rd/claude-code/src/utils/messages.ts:81, 3700, 3708-3722` (`memoryHeader` import, `nested_memory` case, `relevant_memories` case)

---

## Module: Memory Scan (`memoryScan.ts`)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `t88` | `scanMemoryFiles` | chunks.99.mjs:553-585 | function |
| `e88` | `formatMemoryManifest` | chunks.99.mjs:587-601 | function |
| `dMz` | `parseISODate` (YYYY-MM-DD only, returns ms or null) | chunks.99.mjs:542-551 | function |
| `mMz` | `readdir` (`fs/promises`) | chunks.99.mjs (import) | function |
| `BMz` | `basename` (`path`) | chunks.99.mjs (import) | function |
| `pMz` | `join` (`path`) | chunks.99.mjs (import) | function |
| `m56` | `readFileInRange` (shared utility) | utility | function |
| `p2` | `parseFrontmatter` | chunks.86.mjs | function |
| `FMz` | `SCAN_FILE_CAP` (`200`) — selector-mode max per directory | chunks.99.mjs:603 | constant |
| `gMz` | `SYNTHESIS_FILE_CAP` (`500`) — synthesis-mode max per directory | chunks.99.mjs:605 | constant |
| `UMz` | `FRONTMATTER_ONLY_LINE_BUDGET` (`30`) — read budget per file in selector mode | chunks.99.mjs:607 | constant |
| `QMz` | `FULL_BODY_LINE_BUDGET` (`200`) — read budget per file in synthesis mode | chunks.99.mjs:609 | constant |

## Module: Find Relevant Memories — Selector Mode (`findRelevantMemories.ts`)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `uC4` | `findRelevantMemoriesSelector` | chunks.99.mjs:618-629 | function |
| `nMz` | `selectRelevantMemoriesSideQuery` | chunks.99.mjs:631-685 | function |
| `cMz` | `SELECT_MEMORIES_SYSTEM_PROMPT` | chunks.99.mjs:768-775 | constant |
| `dR` | `sideQuery` (shared Sonnet side-call utility) | utility | function |
| `Af` | `getDefaultSonnetModel` | utility | function |
| `n8` | `jsonParse` | utility | function |
| `b6` | `errorMessage` | utility | function |
| `YQ1` | `MEMDIR_QUERY_SOURCE` (`"memdir_relevance"`) | chunks.86.mjs:2680 | constant |

## Module: Find Relevant Memories — Synthesis Mode

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `mC4` | `synthesizeRelevantMemories` | chunks.99.mjs:687-695 | function |
| `iMz` | `synthesizeMemorySideQuery` | chunks.99.mjs:697-766 | function |
| `lMz` | `SYNTHESIZE_MEMORIES_SYSTEM_PROMPT` | chunks.99.mjs:777-797 | constant |
| `wH` | `isSynthesisEnabled` (= `u8("tengu_billiard_aviary", false)`) | chunks.64.mjs:1327-1329 | function |

## Module: Memory Selector State Machine (per-session, per-directory cache)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `dK6` | `createMemorySelectorState` (initializes `{ stateByDir, lastUsage }`) | chunks.86.mjs:2624-2629 | function |
| `sj6` | `clearMemorySelectorState` (resets both fields on compact) | chunks.86.mjs:2631-2634 | function |
| `AQ1` | `getSelectorStateForDir` | chunks.86.mjs:2636-2638 | function |
| `OQ1` | `initSelectorStateForDir` (builds manifest user message with `cache_control`) | chunks.86.mjs:2640-2657 | function |
| `wQ1` | `appendSelectorQAToState` (appends Q/A turn pair to cached chain) | chunks.86.mjs:2659-2678 | function |

## Module: Memory Age & Staleness (`memoryAge.ts`)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `a5z` | `memoryAgeDays` (floor-rounded days since mtime, clamped at 0) | chunks.86.mjs:2682-2684 | function |
| `$Q1` | `memoryFreshnessText` (plain-text caveat for memories > 1 day old) | chunks.86.mjs:2686-2690 | function |
| `RZ4` | `memoryFreshnessNote` (`<system-reminder>`-wrapped caveat) | chunks.86.mjs:2692-2697 | function |
| `lyK` | `fileReadMtimeMap` (WeakMap<File, mtimeMs> for FileReadTool memory hint) | chunks.158.mjs:2712, chunks.159.mjs:370 | variable |
| `EDY` | `fileReadMemoryNote` (calls `memoryFreshnessNote` if path is in `lyK`) | chunks.158.mjs:2432-2436 | function |

**Notable removal:** v2.1.88 exports a `memoryAge(mtimeMs): string` returning `"today" / "yesterday" / "N days ago"`. v2.1.112 **does not have this function**; the prose was deleted because day-boundary drift across turns broke prompt-cache stability.

## Module: Attachment Normalization (memdir half of `attachments.ts` + `messages.ts`)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `B97` | `memoryHeader` (staleness + path prefix, conditional) | chunks.155.mjs:2152-2157 | function |
| `CMY` | `readMemoriesForSurfacing` (read selected files, enforce caps, compute header) | chunks.155.mjs:2126-2150 | function |
| `RMY` | `getRelevantMemoryAttachments` (per-dir selector or synthesis dispatch) | chunks.155.mjs:2076-2112 | function |
| `SMY` | `collectSurfacedMemories` (scan messages → `{paths, totalBytes}`) | chunks.155.mjs:2114-2124 | function |
| `ikK` | `startRelevantMemoryPrefetch` (non-blocking, returns `MemoryPrefetch` handle) | chunks.155.mjs:2159-2206 | function |
| `qMY` | `agentMemoryReadFileStateKey` (builds the readFileState key for an agent memory cite) | chunks.155.mjs:~2087 | function |
| `UNK` | `extractAgentMentions` (parses `@agent-name` references from query text) | chunks.155.mjs:2077 (callsite) | function |
| `Jh6` | `getAgentMemoryDir` (per-agent memory directory) | chunks.155.mjs:2080 (callsite) | function |
| `Nw` | `getAutoMemPath` (default auto-memory directory) | chunks.64.mjs:1386 | function |
| `MR8` | `markFilePathRead` (records a path in readFileState to suppress re-surfacing) | chunks.155.mjs:~2087 | function |
| `tv` | `createChildAbortController` (chains the prefetch signal to turn abort) | utility | function |
| `bMY` | `EXCLUDED_PREFETCH_QUERY_SOURCES` (`Set<string>` of internal sources that skip prefetch) | chunks.155.mjs:2823 | constant |
| `_MY` | `RELEVANT_MEMORIES_CONFIG` (`{ MAX_SESSION_BYTES: 61440 }`) | chunks.155.mjs:2817-2818 | constant |
| `x97` | `MEMORY_READ_MAX_LINES` (`200`) | chunks.155.mjs:2719 | constant |
| `xNK` | `MEMORY_READ_MAX_BYTES` (`4096`) | chunks.155.mjs:2721 | constant |
| `xq` | `FILE_READ_TOOL_NAME` (string constant `"Read"`) | utility | constant |
| `t8` | `createUserMessage` (factory used by both attachment cases) | utility | function |
| `X_` | `wrapMessagesInSystemReminder` (opens/closes `<system-reminder>` user messages) | utility | function |
| `it` | `getUserMessageText` (extracts text from a `Message`) | utility | function |
| `j6` | `logError` | utility | function |
| `uw8` | `isAbortError` | utility | function |

## Module: Attachment Normalization — Case Handlers

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| (case) | `relevant_memories normalization` | chunks.165.mjs:2549-2561 | case |
| (case) | `nested_memory normalization` | chunks.166.mjs:812-817 | case |

## Module: Feature Gates Referenced by Memory Pipeline

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `x3` | `isAutoMemoryEnabled` | chunks.64.mjs:1301 | function |
| `u8` | `getFeatureValue_CACHED_MAY_BE_STALE` (`tengu_moth_copse`, `tengu_billiard_aviary`) | utility | function |
| `wH` | `isSynthesisEnabled` (`tengu_billiard_aviary`) | chunks.64.mjs:1327-1329 | function |
| `tengu_moth_copse` | feature flag enabling the relevant-memory prefetch | growthbook | flag |
| `tengu_billiard_aviary` | feature flag enabling the synthesis side-call mode | growthbook | flag |

---

## Cross-Version Notes (v2.1.88 → v2.1.112)

### Scan-layer changes

- **Dual-mode read budget** added in v2.1.112: selector mode reads 30 lines per file (frontmatter only), synthesis mode reads 200 lines (full body). v2.1.88 only had the 30-line variant.
- **`MemoryHeader.content` field** added in v2.1.112 — non-null only in synthesis mode. Lets the synthesis prompt cache the entire body manifest in one user message instead of re-reading per query.
- **`MemoryHeader.created` / `last_read` frontmatter fields** plumbed through in v2.1.112. The `created` field is preferred over `mtimeMs` when present (because mtime is fragile under `git checkout` / `rsync`).
- **`MAX_MEMORY_FILES` cap** stayed at 200 for selector mode; new 500-cap for synthesis mode.

### Find-relevant-memories changes

- **Two side-call modes**: selector (`uC4`) and synthesis (`mC4`). v2.1.88 was selector-only.
- **Per-directory state machine**: `MemorySelectorState.stateByDir` caches a `{memories, byFilename, messages}` triple per memdir. The `messages` array is reused across turns with `cache_control: { type: "ephemeral" }` on the manifest and each new query, so subsequent side-calls are nearly free.
- **System prompt rewrite**: the v2.1.112 selector prompt explicitly tells the model it sees a conversation chain (`first message lists ...; subsequent messages each contain one user query`) and adds a `[user] / [project]` conservatism rule plus a no-repeat rule. v2.1.88's prompt had different phrasing and included a `recentTools` paragraph that v2.1.112 has removed.
- **New synthesis system prompt** (`lMz`): instructs Sonnet to extract atomic facts (max 7) from memory bodies, with citations.
- **`recentTools` parameter removed** from the selector entry — v2.1.88's `findRelevantMemories(query, dir, signal, recentTools, alreadySurfaced)` is now `uC4(q, K, selectorState, signal, alreadySurfaced)`. Tool-suppression behaviour is achieved through the broader cached-conversation context instead.

### Age-layer changes

- **`memoryAge()` removed**. v2.1.88's `"today" / "yesterday" / "N days ago"` prose function is gone from v2.1.112. The remaining three functions (`memoryAgeDays`, `memoryFreshnessText`, `memoryFreshnessNote`) are bit-for-bit identical.

### Attachment-layer changes

- **`memoryHeader` simplified**. v2.1.88's `Memory (saved 3 days ago): path:` is replaced by a bare `Memory: path:` (or staleness + `Memory: path:`). This removes the day-boundary drift that previously busted the prompt cache for fresh memories.
- **`"Retrieved for possible relevance — use only if it actually applies"` preamble** added to the first non-synthesis memory in each attachment block. New in v2.1.112; guards against the model treating retrieved memories as user-cited facts.
- **Synthesis attachments** carry a sentinel path `"<synthesis:${dir}>"` and a fixed header `"Recalled from your persistent memory system:"` instead of the per-file `memoryHeader` output.
- **Prefetch gates** added: `!K.agentId` (subagents don't prefetch) and `!bMY.has(querySource)` (internal query sources like compact / auto_dream / speculation skip the prefetch).
- **Prefetch telemetry expanded** to include `cache_read_input_tokens`, `cache_creation_input_tokens`, and `selector_turn_count` (from `selectorState.lastUsage`), letting the team measure the prompt-cache effectiveness of the per-dir state machine.

### Where these symbols are referenced in this unit

- `31_auto_memory/memory_scan.md` — `scanMemoryFiles`, `formatMemoryManifest`, and the dual-mode budget/cap constants
- `31_auto_memory/memory_age.md` — `memoryAgeDays`, `memoryFreshnessText`, `memoryFreshnessNote`, plus v2.1.88's removed `memoryAge` function
- `31_auto_memory/find_relevant_memories.md` — `findRelevantMemoriesSelector` (`uC4`), `synthesizeRelevantMemories` (`mC4`), the side-query helpers, the per-dir state machine, and both system prompts
- `31_auto_memory/attachment_normalization.md` — `memoryHeader` (`B97`), `readMemoriesForSurfacing` (`CMY`), `getRelevantMemoryAttachments` (`RMY`), `startRelevantMemoryPrefetch` (`ikK`), the `relevant_memories` and `nested_memory` normalization cases, the prefetch lifecycle and session-byte budget
