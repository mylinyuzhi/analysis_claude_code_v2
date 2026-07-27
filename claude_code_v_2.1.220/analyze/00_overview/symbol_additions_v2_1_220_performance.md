# Symbol additions — v2.1.220, theme `performance`

Staged for merge. Performance is a cross-cutting theme, so the groups below route to **three**
different index files; each `## Module:` block names its destination. Merge each block into the
matching module section of that file, creating the section if absent, and keep rows alphabetical by
the Obfuscated column inside each section.

All `File:Line` values are `cli_inner_pretty.js` line numbers in the **2.1.220** bundle
(`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`) that were read during
this pass. Rows tagged `(193)` in a description refer to the baseline bundle
(`/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`) and are never used as
the File:Line value.

Source documents: [`../50_performance/README.md`](../50_performance/README.md),
[`memory_bounds_and_leaks.md`](../50_performance/memory_bounds_and_leaks.md),
[`cpu_and_caching.md`](../50_performance/cpu_and_caching.md),
[`disk_and_transcript.md`](../50_performance/disk_and_transcript.md).

**Duplicate check performed** against the eight existing `symbol_additions_v2_1_220_*.md` files and
the four `symbol_index_*.md` files. Two overlaps are noted inline (`WB`/`mM` with the permissions
theme; `Ldt`/`Txy` are new).

---

## Module: Core execution — bounded file reads and truncation

> Merge into: `symbol_index_core_execution.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bws` | `readCachedFileContent` | cli_inner_pretty.js:310485 | function |
| `Bye` | `readTextFileBoundedAsync` | cli_inner_pretty.js:50067 | function |
| `F4l` | `assertReadableRegularFile` (EISDIR / ERR_NOT_REGULAR_FILE / ERR_FILE_TOO_LARGE) | cli_inner_pretty.js:49998 | function |
| `GHe` | `cloneFileStateCache` (dump/load copy, `stripSeededFromContext`) | cli_inner_pretty.js:309814 | function |
| `Iir` | `FileTooLargeError` | cli_inner_pretty.js:235355 | class |
| `Kry` | `sliceLinesFromLoadedFile` (whole-file path; throws `Rir` at :235185) | cli_inner_pretty.js:235139 | function |
| `Nxy` | `FILE_STATE_CONTENT_RETENTION_LIMIT` (`4096`) | cli_inner_pretty.js:309833 | constant |
| `OWe` | `readTextFileBounded` | cli_inner_pretty.js:50045 | function |
| `OZu` | `EditFileReadCache` (LRU; 193 twin `B8a` FIFO `:375738 (193)`) | cli_inner_pretty.js:310451 | class |
| `Qry` | `streamLinesFromFile` (`createReadStream`, `highWaterMark: 524288`) | cli_inner_pretty.js:235315 | function |
| `Rir` | `SelectedRangeTooLargeError` (the `.208` long-single-line error) | cli_inner_pretty.js:235367 | class |
| `SZu` | `ReadFileStateCache` (`Buffer.byteLength` sizing; carryover from `:233652 (193)`) | cli_inner_pretty.js:309753 | class |
| `S9` | `FILE_STATE_CACHE_MAX_ENTRIES` (`5000`) | cli_inner_pretty.js:309831 | constant |
| `TSs` | `BYTES_PER_TOKEN_READ_BUDGET` (`128`) | cli_inner_pretty.js:284307 | constant |
| `Vry` | `WHOLE_FILE_READ_THRESHOLD` (`10485760`) | cli_inner_pretty.js:235348 | constant |
| `_Il` | `flattenString` (`Buffer.from(s,"utf16le").toString("utf16le")` — breaks V8 SlicedString) | cli_inner_pretty.js:20687 | function |
| `atn` | `fileStateCacheToObject` | cli_inner_pretty.js:309808 | function |
| `eky` | `EDIT_CACHE_MAX_ENTRIES` (`1000`) | cli_inner_pretty.js:310489 | constant |
| `ej` | `readTextFileBoundedSync` | cli_inner_pretty.js:50064 | function |
| `gEo` | `mergeFileStateCaches` (newest-timestamp wins) | cli_inner_pretty.js:309822 | function |
| `lFe` | `readFileWithLineRange` (gained the `maxSelectedBytes` option) | cli_inner_pretty.js:235119 | function |
| `m8` | `truncateEnd` (surrogate-safe, flattening) | cli_inner_pretty.js:20681 | function |
| `ma` | `truncateStart` (surrogate-safe, flattening; 65 call sites; 193 twin `ZI` `:10187 (193)`, 14) | cli_inner_pretty.js:20675 | function |
| `p6` | `createFileStateCache` | cli_inner_pretty.js:309805 | function |
| `rky` | `editFileReadCacheSingleton` | cli_inner_pretty.js:310496 | variable |
| `tky` | `EDIT_CACHE_MAX_CHARS` (`16777216`) | cli_inner_pretty.js:310490 | constant |
| `zry` | `NON_REGULAR_FILE_HARD_CAP` (`134217728`) | cli_inner_pretty.js:235349 | constant |
| `$xy` | `FILE_STATE_CACHE_MAX_BYTES` (`26214400`) | cli_inner_pretty.js:309832 | constant |

---

## Module: Core execution — tool pool assembly

> Merge into: `symbol_index_core_execution.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `G7` | `assembleToolPool` (193 twin `AJ` `:444188 (193)`) | cli_inner_pretty.js:425008 | function |
| `nve` | `filterToolsByDenyRules` (holds the `.208` hoist `let r = mM(t);`) | cli_inner_pretty.js:425004 | function |

---

## Module: Core execution — process stdout lifecycle

> Merge into: `symbol_index_core_execution.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bzt` | `handleStreamGoneErrors` (export name at :20509) | cli_inner_pretty.js:20520 | function |
| `Js` | `writeToStdout` (maintains `bytesWritten` / `bytesFlushed`) | cli_inner_pretty.js:20542 | function |
| `OUn` | `getStdoutDrainBudgetMs` (`clamp(pending/262144·1000, 2000, 30000)`) | cli_inner_pretty.js:20578 | function |
| `Uzt` | `isStdinUnusableError` | cli_inner_pretty.js:20516 | function |
| `dCi` | `registerProcessIOErrorHandlers` | cli_inner_pretty.js:20530 | function |
| `dIl` | `writeIfWritable` | cli_inner_pretty.js:20538 | function |
| `f9m` | `ASSUMED_PIPE_THROUGHPUT_BPS` (`262144`) | cli_inner_pretty.js:20646 | constant |
| `fIl` | `bytesWrittenToStdout` | cli_inner_pretty.js:20641 | variable |
| `fWe` | `markStdoutDrainExternallyClocked` (export name at :20507) | cli_inner_pretty.js:20561 | function |
| `gIl` | `getPendingStdoutBytes` | cli_inner_pretty.js:20572 | function |
| `jzt` | `drainStdoutBeforeExit` (`{ scaleBudgetToQueue }`; export name at :20513) | cli_inner_pretty.js:20552 | function |
| `m9m` | `DRAIN_BUDGET_CEILING_MS` (`30000`) | cli_inner_pretty.js:20647 | constant |
| `mIl` | `bytesFlushedToStdout` | cli_inner_pretty.js:20642 | variable |
| `pCi` | `stdoutErrorLatched` | cli_inner_pretty.js:20648 | variable |
| `pIl` | `anythingWasWrittenToStdout` | cli_inner_pretty.js:20639 | variable |
| `p9m` | `awaitExternalDrainClock` | cli_inner_pretty.js:20569 | function |

---

## Module: Core execution — message normalization (eliminations, not deltas)

> Merge into: `symbol_index_core_execution.md`
> These rows are recorded because they were read and **ruled out** as the `.216` quadratic-normalization
> anchor. Their presence in the index saves the next reader the same work.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `NN` | `normalizeMessagesForWire` (193 twin `Dx` `:600274 (193)`; 220 added a 4th options param) | cli_inner_pretty.js:531420 | function |
| `U9s` | `stripCrossModelThinking` (**carryover**, byte-equivalent to `YSo` `:602157 (193)`) | cli_inner_pretty.js:533670 | function |
| `Y0` | `estimateConversationTokens` (usage-anchored; **carryover**) | cli_inner_pretty.js:442572 | function |
| `Ztp` | `dropOrphanedToolResults` (193 twin `jJl` `:602202 (193)`) | cli_inner_pretty.js:533713 | function |
| `eOd` | `findLastUsageAnchor` (**carryover**) | cli_inner_pretty.js:442577 | function |
| `Jtp` | `stripThinkingFromOtherModels` | cli_inner_pretty.js:533684 | function |
| `m1_` | `buildRequestMessages` (193 twin `LGf` `:594226 (193)`) | cli_inner_pretty.js:509336 | function |
| `n0o` | `estimateAssistantMessageChars` | cli_inner_pretty.js:442563 | function |

---

## Module: State — session transcript store

> Merge into: `symbol_index_core_execution.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AVs` | `MAX_TRANSCRIPT_READ_BYTES` (`52428800`; export name at :522990) | cli_inner_pretty.js:527411 | constant |
| `Asp` | `flushSessionStorageAtExit` (logs the degraded-writer warning at :523307) | cli_inner_pretty.js:523299 | function |
| `Csp` | `hydrateForkContext` (cache + in-flight coalescing; 193 twin `$jf` `:582742 (193)`) | cli_inner_pretty.js:524292 | function |
| `EB_` | `loadForkContextPrefix` (byte accounting + dual-criterion eviction) | cli_inner_pretty.js:524300 | function |
| `EVs` | `setTranscriptLocalGcEnabled` (export name at :522854; single caller :849846) | cli_inner_pretty.js:523003 | function |
| `Hws` | `recordFileHistoryDelta` (writes `type: "file-history-delta"`) | cli_inner_pretty.js:524337 | function |
| `Q2o` | `forkPrefixInFlight` (promise-dedup map) | cli_inner_pretty.js:527595 | variable |
| `Rd` | `getSessionStorage` (lazily constructs `wsp`, registers the exit hooks at :523315) | cli_inner_pretty.js:523313 | function |
| `Tsp` | `OBSERVER_REF_TAIL_SCAN_BYTES` (`1048576`) | cli_inner_pretty.js:527422 | constant |
| `_B_` | `FORK_CONTEXT_CACHE_MAX_ENTRIES` (`4`; 193 twin `Mjf = 4` `:585522 (193)` — carryover) | cli_inner_pretty.js:527423 | constant |
| `bB_` | `FORK_CONTEXT_CACHE_MAX_BYTES` (`16777216`) | cli_inner_pretty.js:527424 | constant |
| `eCi` | `serializeEntry` (`JSON.stringify(e) + "\n"`; the fork-cache byte estimator) | cli_inner_pretty.js:19819 | function |
| `fEo` | `recordFileHistorySnapshot` (193 twin `LWt` `:582774 (193)`) | cli_inner_pretty.js:524334 | function |
| `fRe` | `forkPrefixCache` (`Map<parentLastUuid, {slice, bytes}>`) | cli_inner_pretty.js:527595 | variable |
| `lxt` | `extractFieldFromLastEntryOfTypeStrict` (export name at :51300) | cli_inner_pretty.js:51379 | function |
| `nB_` | `TRANSCRIPT_GC_RETENTION_CLASS` (4-class table; `boundary-cleared` 220=7/193=0) | cli_inner_pretty.js:527551 | object |
| `oB_` | `getTranscriptGcRetentionClass` (fail-open default `"accumulate"`) | cli_inner_pretty.js:523006 | function |
| `psp` | `ENTRY_APPEND_POLICY` (export name at :522995) | cli_inner_pretty.js:527516 | object |
| `wsp` | `SessionStorage` (holds `planReAppendSessionMetadata` :523596, `normalizeLastPrompt` :523586) | cli_inner_pretty.js:523360 | class |
| `xVs` | `reAppendSessionMetadataAtExit` (`process.on("exit")`, registered :523315) | cli_inner_pretty.js:523292 | function |

---

## Module: State — file history and checkpoints

> Merge into: `symbol_index_core_execution.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `A1` | `isFileCheckpointingEnabled` | cli_inner_pretty.js:308954 | function |
| `Hxy` | `notifySnapshotContentChanges` (193 twin `z2p` `:371040 (193)`) | cli_inner_pretty.js:309602 | function |
| `Ldt` | `resolveBackupPath` (two validations before joining `file-history/<sessionId>/<name>`) | cli_inner_pretty.js:309258 | function |
| `Txy` | `BACKUP_FILENAME_RE` (`/^[0-9a-f]{16}@v\d+$/`) | cli_inner_pretty.js:309674 | constant |
| `UHe` | `reduceFileHistoryState` (`"track"` now writes a delta; 193 twin `gDe` `:370591 (193)`) | cli_inner_pretty.js:308856 | function |
| `Xcr` | `readFileNoFollow` (`O_NONBLOCK | O_NOFOLLOW`, null on any error) | cli_inner_pretty.js:309628 | function |
| `bxy` | `deleteEvictedBackupFiles` (mark-and-sweep unlink; called at :308915) | cli_inner_pretty.js:308937 | function |
| `dCt` | `MAX_SNAPSHOTS` (`100`; 193 twin `a9a = 100` `:371076 (193)` — carryover) | cli_inner_pretty.js:24774 | constant |
| `dZu` | `debugDumpFileHistoryState` (no-op unless `Ixy`) | cli_inner_pretty.js:309642 | function |

---

## Module: Permissions — rule matching cost

> Merge into: `symbol_index_infra_platform.md`
> **Overlap note:** `WB`, `mM`, `N_r`, `fg`, `nfn` may already exist in
> [`symbol_additions_v2_1_220_permissions.md`](./symbol_additions_v2_1_220_permissions.md) or in
> `symbol_index_infra_platform.md` under the permissions module. If so, keep the existing row and
> discard the duplicate — the readable names below are chosen to match the 220 export table at
> `:513085-513088`, which is authoritative.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bfe` | `getAskRules` (export `getAskRuleForTool: () => PIe` at :513088) | cli_inner_pretty.js:513240 | function |
| `N_r` | `collectRulesFromSources` (parse + allocate per rule) | cli_inner_pretty.js:513228 | function |
| `SMi` | `matchToolNameGlob` (**still** builds a fresh `RegExp` per call — the un-taken optimisation) | cli_inner_pretty.js:60306 | function |
| `WB` | `getDenyRuleForTool` (gained the 3rd `precomputedDenyRules` param; export at :513085) | cli_inner_pretty.js:513293 | function |
| `fg` | `parsePermissionRule` (`Tool(arg)` splitter) | cli_inner_pretty.js:60333 | function |
| `mM` | `getDenyRules` | cli_inner_pretty.js:513237 | function |
| `nfn` | `PERMISSION_RULE_SOURCES` (10 sources; base five are `V$` at :57678) | cli_inner_pretty.js:514067 | constant |
| `ofn` | `matchesToolRule` | cli_inner_pretty.js:513243 | function |
| `wKe` | `isEndConversationTool` (the `.214` carve-out guarding `WB`) | cli_inner_pretty.js:513105 | function |

---

## Module: Settings — bounded loading

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `MWe` | `isNotRegularFileError` | cli_inner_pretty.js:50020 | function |
| `Wwm` | `loadSettingsFromFlag` (the `--settings` handler; error text at :833488) | cli_inner_pretty.js:833468 | function |
| `Xye` | `MAX_SETTINGS_FILE_BYTES` (`2097152`; 7 call sites) | cli_inner_pretty.js:62620 | constant |
| `fa_` | `MAX_AUTO_MODE_SECTION_BYTES` (`Xye / 4`) | cli_inner_pretty.js:447658 | constant |

---

## Module: MCP — result size and stderr

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dmy` | `DEFAULT_MCP_OUTPUT_TOKEN_LIMIT` (`25000`) | cli_inner_pretty.js:266655 | constant |
| `HQr` | `mcpResultExceedsTokenLimit` | cli_inner_pretty.js:266629 | function |
| `Lmy` | `MCP_RESULT_PRECHECK_RATIO` (`0.5`) | cli_inner_pretty.js:266653 | constant |
| `MFe` | `stripMetaFromTextBlocks` | cli_inner_pretty.js:266551 | function |
| `Mmy` | `truncateMcpContentBlocks` (now calls `ma`; 193 twin `KKd` used raw `.slice` `:244811 (193)`) | cli_inner_pretty.js:266595 | function |
| `OFe` | `truncateMcpResultIfOversized` | cli_inner_pretty.js:266649 | function |
| `Omy` | `applyMcpResultTruncation` | cli_inner_pretty.js:266639 | function |
| `Pmy` | `buildMcpTruncationNotice` | cli_inner_pretty.js:266588 | function |
| `R9e` | `getMcpOutputCharBudget` (`tyo() * 4`) | cli_inner_pretty.js:266585 | function |
| `b5u` | `MCP_IMAGE_TOKEN_ESTIMATE` (`1600`) | cli_inner_pretty.js:266654 | constant |
| `gMt` | `estimateMcpResultTokens` | cli_inner_pretty.js:266575 | function |
| `tyo` | `getMcpOutputTokenLimit` (`MAX_MCP_OUTPUT_TOKENS` → gate `tengu_velvet_ibis.mcp_tool` → `Dmy`) | cli_inner_pretty.js:266544 | function |

---

## Module: Auto-update — streaming download

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Cj_` | `getStallTimeoutMs` (`CLAUDE_CODE_STALL_TIMEOUT_MS_FOR_TESTING` ?? `Tj_`) | cli_inner_pretty.js:540187 | function |
| `Dbr` | `MAX_DOWNLOAD_ATTEMPTS` (`3`) | cli_inner_pretty.js:540392 | constant |
| `Tj_` | `DOWNLOAD_STALL_TIMEOUT_MS` (`120000`) | cli_inner_pretty.js:540391 | constant |
| `kj_` | `downloadBinaryToFile` (streaming; 193 twin `X1p` `:352459 (193)` used `arraybuffer`) | cli_inner_pretty.js:540200 | function |
| `kup` | `isRetryableDownloadTransportError` | cli_inner_pretty.js:540193 | function |
| `xj_` | `getDownloadDeadlineMs` (`CLAUDE_CODE_DOWNLOAD_DEADLINE_MS_FOR_TESTING` ?? `xup`) | cli_inner_pretty.js:540191 | function |
| `xup` | `DOWNLOAD_DEADLINE_MS` (`600000`) | cli_inner_pretty.js:540393 | constant |

---

## Module: Feature flags — performance gates

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Srh` | `CLAUDE_CODE_TRANSCRIPT_LOCAL_GC` (env accessor) | cli_inner_pretty.js:30992 | variable |
| `hgi` | `isCcrDeltaRehydrateEnabled` (gate `tengu_ccr_delta_rehydrate`, 220=1/193=1) | cli_inner_pretty.js:840674 | function |
| `kCm` | `isTranscriptLocalGcEnabled` (gate `tengu_transcript_local_gc`, **default false**) | cli_inner_pretty.js:840677 | function |

---

## Module: LSP — open-document lifecycle

> Merge into: `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `SQu` | `createLspServerManager` (returns 11 methods at :307337; 193's `closeFile` / `getSupportedExtensions` are gone) | cli_inner_pretty.js:307167 | function |
| `zCy` | `LSP_MAX_OPEN_DOCUMENTS` (`50`) | cli_inner_pretty.js:307353 | constant |

*(The manager's inner helpers are local closures with single-letter names: `i` = `touchDocument`
`:307176`, `s` = `evictOverflowDocuments` `:307179`, `o` = `nextDocumentVersion` `:307172`,
`f` = `openFile` `:307277`, `m` = `changeFile` `:307300`, `d` = `sendRequest` `:307263`. They are
listed here for navigation but are not distinct top-level symbols.)*

---

## Module: UI components — Ink renderer paint pass

> Merge into: `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ev` | `nodeRects` (`WeakMap<node, {x,y,width,height}>`; written :257169, read :257180/:257250) | cli_inner_pretty.js:250476 | variable |
| `GUu` | `paintChildNodes` (gained the `depth` argument; 193 twin `lNi` `:174448 (193)`) | cli_inner_pretty.js:257189 | function |
| `Iho` | `paintNode` (per-node paint entry; now takes `depth`) | cli_inner_pretty.js:256820 | function |
| `Whs` | `paintClippedChildren` | cli_inner_pretty.js:257263 | function |
| `_uy` | `hasSiblingOnSameRow` | cli_inner_pretty.js:257217 | function |
| `buy` | `blitEscapingAbsoluteRects` (prune + explicit stack; 193 twin `uNi` `:174493 (193)`) | cli_inner_pretty.js:257235 | function |
| `guy` | `hasAbsolutePositionChanged` (gained the `hasAbsoluteDescendant` prune; 193 twin `sRd` `:174433 (193)`) | cli_inner_pretty.js:257173 | function |
| `yuy` | `clipsBothAxes` | cli_inner_pretty.js:257212 | function |

---

## Module: UI components — markdown table renderer

> Merge into: `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `EUp` | `renderMarkdownTable` (row cap + per-cell memo; 193 twin `tKa` `:380949 (193)`) | cli_inner_pretty.js:636292 | function |
| `M4t` | `wrapCellText` | cli_inner_pretty.js:636281 | function |
| `_Up` | `MAX_TABLE_ROWS` (`200`) | cli_inner_pretty.js:636511 | constant |
| `bUp` | `ANSI_BOLD_ON` | cli_inner_pretty.js:636512 | constant |
| `bbn` | `MIN_TABLE_COLUMN_WIDTH` (`3`) | cli_inner_pretty.js:636509 | constant |
| `bqo` | `buildHiddenRowsNotice` (3 call sites: :636316, :636438, :636492) | cli_inner_pretty.js:636278 | function |
| `yUp` | `TABLE_WIDTH_SLACK` (`4`) | cli_inner_pretty.js:636508 | constant |

---

## Module: Hooks — async hook backgrounding

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Cke` | `isAsyncHookResponse` | cli_inner_pretty.js:520091 | function |
| `Nuo` | `registerHookOutputAccessor` | cli_inner_pretty.js:520119 | function |
| `ee` | `onStderrChunk` (named so it can be detached at :520108) | cli_inner_pretty.js:520081 | function |
| `fip` | `registerBackgroundHookProcess` (return value gates the detach) | cli_inner_pretty.js:520095 | function |
| `te` | `onStdoutChunk` (named so it can be detached at :520107) | cli_inner_pretty.js:520084 | function |
