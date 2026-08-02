# Symbol additions — v2.1.220, theme `auto_memory`

Staged for merge. **Every group below belongs in `symbol_index_core_features.md`** (auto memory is a
core-feature theme per [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §6). Merge each `## Module:` block into
the matching module section of that file, creating the section if absent, and keep rows alphabetical by
the Obfuscated column inside each section.

All `File:Line` values are `cli_inner_pretty.js` line numbers in the **2.1.220** bundle
(`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`) that were read during
this pass. Rows tagged `(193)` in a description refer to the baseline bundle and are never used as the
File:Line value.

Source documents: [`../31_auto_memory/README.md`](../31_auto_memory/README.md),
[`../31_auto_memory/frontmatter_rewrite_safety.md`](../31_auto_memory/frontmatter_rewrite_safety.md),
[`../31_auto_memory/memory_index_size_budget.md`](../31_auto_memory/memory_index_size_budget.md),
[`../31_auto_memory/extraction_pipeline.md`](../31_auto_memory/extraction_pipeline.md), and
[`../31_auto_memory/dream_and_auto_dream.md`](../31_auto_memory/dream_and_auto_dream.md).

---

## Module: Auto memory — frontmatter parsing and rewrite safety

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Ig` | `requoteLossyScalars` (per-line losslessness prover; 220-only) | cli_inner_pretty.js:158018 | function |
| `$nu` | `serializeMemoryFile` (`---` + `Bun.YAML.stringify` + body) | cli_inner_pretty.js:160653 | function |
| `BIg` | `expandBracePatternsWithBudget` (holds the `.217` budget message at :158177) | cli_inner_pretty.js:158159 | function |
| `Bfo` | `stampNewMemoryContent` (three-path stamper; called from Edit :311213 / Write :311525) | cli_inner_pretty.js:238652 | function |
| `DY` | `parseMemoryFrontmatter` (memory-shaped wrapper over `Lp`) | cli_inner_pretty.js:160649 | function |
| `Doy` | `splitModifiedIndentAndComment` (preserves indent + trailing `#` on update) | cli_inner_pretty.js:238704 | function |
| `EJi` | `recordUnprovableInlineHash` (flags keys whose inline `#` cannot be requoted; 220-only) | cli_inner_pretty.js:158059 | function |
| `FIg` | `BRACE_EXPANSION_BYTE_BUDGET` (`4194304`) | cli_inner_pretty.js:158228 | constant |
| `FVr` | `readMetadataString` (non-empty-string metadata reader) | cli_inner_pretty.js:160695 | variable |
| `Loy` | `spliceModifiedLine` (byte splice + semantic re-verification; 220-only) | cli_inner_pretty.js:238669 | function |
| `Lp` | `parseFrontmatter` (shared parser; gained the `quoteLossyValues` mode) | cli_inner_pretty.js:158070 | function |
| `MIg` | `SUSPICIOUS_SCALAR_RE` (`/[{}[\]*&#!\|>%@\`]\|: /`) | cli_inner_pretty.js:158236 | constant |
| `Moy` | `findMetadataBlockEnd` (block scanner tolerant of interior comment runs) | cli_inner_pretty.js:238727 | function |
| `NIg` | `BRACE_EXPANSION_RESULT_BUDGET` (`1000`) | cli_inner_pretty.js:158227 | constant |
| `OIg` | `quoteSuspiciousScalars` (post-throw salvage pass; carryover from 193 `XEd`) | cli_inner_pretty.js:157984 | function |
| `Onu` | `withMetadata` (frozen metadata merge) | cli_inner_pretty.js:160696 | variable |
| `Poy` | `insertModifiedLine` (placement inside `metadata:` / before closing fence) | cli_inner_pretty.js:238711 | function |
| `Roy` | `MODIFIED_LINE_RE` (`/^(\s*)modified\s*:/`) | cli_inner_pretty.js:238755 | constant |
| `Wde` | `isUnderMemoryRoot` | cli_inner_pretty.js:157057 | function |
| `bru` | `splitAndExpandPatterns` (comma splitter feeding the brace expander) | cli_inner_pretty.js:158139 | function |
| `c1u` | `insertAt` (array splice helper) | cli_inner_pretty.js:238708 | function |
| `cps` | `INDENTED_LINE_RE` (`/^\s+\S/`) | cli_inner_pretty.js:238755 | constant |
| `fLg` | `slugifyMemoryName` (kebab-cases `name:` unless already `[a-z0-9_-]+`) | cli_inner_pretty.js:160697 | variable |
| `gV` | `yamlParse` (`Bun.YAML.parse`) | cli_inner_pretty.js:157974 | function |
| `lps` | `BLANK_OR_COMMENT_LINE_RE` (`/^\s*(#\|$)/`) | cli_inner_pretty.js:238755 | constant |
| `ntr` | `yamlStringify` (`Bun.YAML.stringify` + trailing newline) | cli_inner_pretty.js:157977 | function |
| `pFe` | `stripCR` (trailing `\r` remover) | cli_inner_pretty.js:238701 | function |
| `pLg` | `normalizeMemoryFrontmatter` (builds `{name, description, metadata}`) | cli_inner_pretty.js:160687 | variable |
| `pRt` | `STRICT_FRONTMATTER_RE` (whole-line closing fence, CRLF-tolerant; 220-only) | cli_inner_pretty.js:158237 | constant |
| `uLg` | `MEMORY_NODE_TYPE` (`"memory"`, forced first key by `$nu`) | cli_inner_pretty.js:160684 | constant |
| `uie` | `isUnderTeamMemoryDir` | cli_inner_pretty.js:161233 | function |
| `vJi` | `asPlainObject` (non-array object or `{}`) | cli_inner_pretty.js:158132 | function |
| `wZ` | `FRONTMATTER_RE` (lenient fence; carryover from 193 `eye`) | cli_inner_pretty.js:158237 | constant |
| `yru` | `emptyKeysHazard` (lowest-severity rewrite hazard) | cli_inner_pretty.js:158127 | function |

---

## Module: Auto memory — MEMORY.md index size budget

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Axe` | `isMemoryIndexHidden` (`tengu_moth_copse` / `CLAUDE_MEMORY_STORES`) | cli_inner_pretty.js:156959 | function |
| `DS` | `MEMORY_INDEX_FILENAME` (`"MEMORY.md"`) | cli_inner_pretty.js:160637 | constant |
| `FPd` | `deliverMemoryIndexCapNotice` (emits `over_cap`, returns `additionalContext`) | cli_inner_pretty.js:436637 | function |
| `HRt` | `isNestedMemoryStoreRoot` | cli_inner_pretty.js:161961 | function |
| `Htr` | `truncateMemoryForPrompt` (the actual read limit: 200 lines then 25,000 bytes) | cli_inner_pretty.js:161586 | function |
| `Ixe` | `MEMORY_INDEX_BYTE_CAP` (`25000`; carryover, 193 `Kae`) | cli_inner_pretty.js:160639 | constant |
| `Jqe` | `getUserMemoryIndexPath` | cli_inner_pretty.js:157054 | function |
| `NPu` | `stripHtmlComments` | cli_inner_pretty.js:233865 | function |
| `Too` | `MEMORY_INDEX_READ_WINDOW` (`4 * Ixe` = 100,000; 220-only) | cli_inner_pretty.js:160647 | constant |
| `Vtt` | `readFileWindow` (`{content, bytesRead, bytesTotal}`) | cli_inner_pretty.js:20114 | function |
| `aLo` | `buildMemoryIndexCapNotice` (returns `{text, overCap}`; 193 `lKn` returned a string) | cli_inner_pretty.js:434055 | function |
| `atr` | `getMemoryMounts` (`null` on failure) | cli_inner_pretty.js:158545 | function |
| `cie` | `MEMORY_INDEX_LINE_CAP` (`200`; carryover, 193 `RY`) | cli_inner_pretty.js:160638 | constant |
| `fny` | `splitFrontmatterAndPaths` | cli_inner_pretty.js:235627 | function |
| `gt_` | `findUserPromptIndexMount` | cli_inner_pretty.js:434123 | function |
| `ht_` | `WARN_AT_FRAC` (`0.8`; carryover, 193 `Nof`) | cli_inner_pretty.js:434080 | constant |
| `mny` | `loadMemoryFileForPrompt` (the splice order the checker now replays) | cli_inner_pretty.js:235636 | function |
| `oPd` | `checkTeamMemoryIndexCap` (new plumbing, no splice step) | cli_inner_pretty.js:434139 | function |
| `pl` | `formatBytes` | cli_inner_pretty.js:33132 | function |
| `rPd` | `checkUserMemoryIndexCap` (PostToolUse size check for the user index) | cli_inner_pretty.js:434085 | function |
| `sLo` | `chooseBindingSizeBasis` (raw-vs-spliced, compares fractions of cap; 220-only) | cli_inner_pretty.js:434052 | function |
| `sds` | `stripHtmlCommentTokens` | cli_inner_pretty.js:233869 | function |
| `tPd` | `COMPACT_TARGET_FRAC` (`0.7`; carryover, 193 `Xgl`) | cli_inner_pretty.js:434081 | constant |
| `wRt` | `measureTrimmed` (`{trimmed, lineCount, byteCount}`) | cli_inner_pretty.js:160615 | function |
| `xm` | `isAutoMemoryEnabled` | cli_inner_pretty.js:156938 | function |
| `xtr` | `foldPathForCompare` (NFC + lowercase) | cli_inner_pretty.js:160628 | function |

---

## Module: Auto memory — `<cc-memory>` citation surface (undocumented, 220-only)

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bnu` | `CITATION_FILENAMES_ATTR_RE` (`/\bfilenames="([^"]*)"/`) | cli_inner_pretty.js:160806 | constant |
| `Fnu` | `truncateCitationSentence` (300-char cut with surrogate-pair guard) | cli_inner_pretty.js:160750 | function |
| `TRt` | `buildMemoryCitationPromptSection` (gated `## Citing memories` block) | cli_inner_pretty.js:160839 | function |
| `Unu` | `analyzeMemoryCitationTags` (tag/byte counter feeding telemetry) | cli_inner_pretty.js:160716 | function |
| `gLg` | `buildMemoryTypesPromptSection` (gated by `tengu_ochre_finch`) | cli_inner_pretty.js:160815 | function |
| `gQi` | `MEMORY_CITATION_SENTENCE_CAP` (`300`) | cli_inner_pretty.js:160804 | constant |
| `jnu` | `extractMemoryCitations` (`{sentence, filenames, incomplete}` records) | cli_inner_pretty.js:160765 | function |
| `koo` | `MEMORY_CITATION_TAG_GATE` (`"tengu_salt_marsh"`) | cli_inner_pretty.js:160800 | constant |
| `ktr` | `stripCitationTagsFromContent` (identity-preserving array mapper) | cli_inner_pretty.js:160786 | function |
| `mLg` | `parseCitationFilenames` | cli_inner_pretty.js:160757 | function |
| `nk` | `stripMemoryCitationTags` | cli_inner_pretty.js:160712 | function |
| `obm` | `emitMemoryCitationTelemetry` (`tengu_cc_memory_tag_stripped`) | cli_inner_pretty.js:819751 | function |
| `xoo` | `CITATION_TAG_RE` (`/<\/?cc-memory\b[^>]*>/g`) | cli_inner_pretty.js:160806 | constant |
| `yQi` | `CITATION_TAG_NAME` (`"cc-memory"`) | cli_inner_pretty.js:160801 | constant |

---

## Module: Auto memory — CLAUDE.md / `.claude/rules` loading

> Merge into: `symbol_index_core_features.md`
> (Shared with the `system_prompt` theme — if `40_system_prompt` stages the same symbols, keep one copy.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `IMu` | `loadNestedConditionalRules` (gained the `!pg("projectSettings")` early return) | cli_inner_pretty.js:235987 | function |
| `Lpe` | `loadMemoryFile` | cli_inner_pretty.js:235826 | function |
| `Nir` | `collectExternalMemoryParents` | cli_inner_pretty.js:236007 | function |
| `ePt` | `loadRulesDirectory` | cli_inner_pretty.js:235851 | function |
| `ifo` | `loadConditionalRules` (gained the symlink realpath retry at :235996) | cli_inner_pretty.js:235992 | function |
| `pg` | `isSettingSourceEnabled` | cli_inner_pretty.js:57672 | function |
| `ufo` | `loadNestedDirectoryMemoryFiles` (`.claude/rules` now inside the `projectSettings` guard) | cli_inner_pretty.js:235962 | function |

---

## Module: Auto memory — extraction pipeline and path safety

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$My` | `hasMemoryWritesSince` — suppresses a redundant fork after direct Edit/Write memory updates | cli_inner_pretty.js:332441-332457 | function |
| `$wo` | `DELETE_COMMAND_NAMES` (`rm\|remove-item\|ri\|del\|erase`) | cli_inner_pretty.js:332723 | constant |
| `BMy` | `isAllowedPowerShellMemoryDelete` — conservative token/path validator | cli_inner_pretty.js:332487-332502 | function |
| `Cst` | `isProtectedMemoryPath` — normalized protected-segment detector | cli_inner_pretty.js:156903-156912 | function |
| `Dld` | `drainInFlightExtractions` — all in-flight work versus an unref'd timeout | cli_inner_pretty.js:332710-332713 | variable |
| `eHs` | `isModelVisibleMessage` — user/assistant only | cli_inner_pretty.js:332424-332426 | function |
| `FMy` | `DELETE_COMMAND_NAME_RE` | cli_inner_pretty.js:332755 | variable |
| `GMy` | `executeExtractMemories` — public stop-hook dispatcher | cli_inner_pretty.js:332715-332717 | function |
| `gVr` | `isPathInsideUnprotectedMemoryRoot` — exact-root containment plus protected-path rejection | cli_inner_pretty.js:157060-157065 | function |
| `Hf` | `getAutoMemoryRoot` — memoized configured/default memory directory with trailing separator | cli_inner_pretty.js:157093-157102 | variable |
| `Hld` | `isSubstantiveUserProse` — non-meta user text with at least three whitespace tokens | cli_inner_pretty.js:332461-332467 | function |
| `jMy` | `extractWrittenPaths` — deduplicated, root-validated Edit/Write outputs | cli_inner_pretty.js:332577-332589 | function |
| `kld` | `countWhitespaceTokens` | cli_inner_pretty.js:332458-332460 | function |
| `Lld` | `activeMemoryExtractor` — initialized dispatcher tracked by the drain set | cli_inner_pretty.js:332701-332709 | variable |
| `NMy` | `hasSubstantiveUserProseSince` — cursor-aware relevance filter | cli_inner_pretty.js:332468-332479 | function |
| `Nwo` | `createAutoMemCanUseTool` — Read/Grep/Glob, read-only shell, and root-bound Markdown mutations | cli_inner_pretty.js:332536-332567 | function |
| `OMy` | `countModelVisibleMessagesSince` — UUID cursor with compaction fallback | cli_inner_pretty.js:332427-332440 | function |
| `Owo` | `denyAutoMemTool` — deny result plus sanitized telemetry | cli_inner_pretty.js:332480-332486 | function |
| `Rld` | `getWrittenFilePath` — Edit/Write tool block decoder | cli_inner_pretty.js:332568-332576 | function |
| `tHs` | `initExtractMemories` — closure-owned cursor, throttle, coalescing, fork, and drain | cli_inner_pretty.js:332590-332714 | function |
| `Tld` | `buildMemoryExtractionPrompt` — manifest-first, limited-turn tool contract | cli_inner_pretty.js:332357-332407 | function |
| `UMy` | `isAllowedPosixMemoryDelete` — parsed single `rm`, force-only, absolute safe Markdown paths | cli_inner_pretty.js:332503-332532 | function |
| `W1t` | `isAllowedAutoMemWritePath` — `.md` plus exact safe-root containment | cli_inner_pretty.js:332533-332535 | function |
| `WMy` | `drainPendingExtraction` — public bounded shutdown drain | cli_inner_pretty.js:332718-332720 | function |
| `xld` | `MIN_SUBSTANTIVE_USER_PROSE_TOKENS` (`3`) | cli_inner_pretty.js:332722 | constant |

---

## Module: Auto memory — Dream / Auto-Dream

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ald` | `getAutoDreamFeatureConfig` — reads `tengu_onyx_plover` | cli_inner_pretty.js:332330-332332 | function |
| `aOy` | `isAutoDreamGateOpen` — Remote Control, SDK, auto-memory, and preference gate | cli_inner_pretty.js:333167-333172 | function |
| `Bld` | `listSessionsTouchedSince` — current-project transcript mtime census | cli_inner_pretty.js:333090-333093 | function |
| `cOy` | `makeDreamProgressWatcher` — text/tool projection plus root-validated touched paths | cli_inner_pretty.js:333300-333326 | function |
| `eOy` | `DREAM_LOCK_STALE_MS` (`3600000`) | cli_inner_pretty.js:333097 | constant |
| `Fld` | `tryAcquireConsolidationLock` — current-memory-root wrapper | cli_inner_pretty.js:333046-333048 | function |
| `Gld` | `completeDreamTask` — terminal state, metrics, and task event | cli_inner_pretty.js:333140-333144 | function |
| `Gwo` | `rollbackConsolidationLock` — current-memory-root wrapper | cli_inner_pretty.js:333073-333075 | function |
| `iOy` | `DREAM_DELETE_COMMAND_RE` | cli_inner_pretty.js:333372 | variable |
| `Jld` | `executeAutoDream` — public stop-hook dispatcher | cli_inner_pretty.js:333336-333338 | function |
| `jld` | `addDreamTurn` — path dedupe, phase flip, and 30-turn ring | cli_inner_pretty.js:333127-333139 | function |
| `jwo` | `readLastConsolidatedAt` — lock mtime or zero | cli_inner_pretty.js:333039-333045 | function |
| `lOy` | `isAutoDreamForced` — production stub returning false | cli_inner_pretty.js:333173-333175 | function |
| `nHs` | `getConsolidationLockPath` | cli_inner_pretty.js:333036-333038 | function |
| `nOy` | `MAX_DREAM_PROGRESS_TURNS` (`30`) | cli_inner_pretty.js:333150 | constant |
| `oHs` | `isDreamTask` | cli_inner_pretty.js:333108-333110 | function |
| `oOy` | `DREAM_SESSION_SCAN_INTERVAL_MS` (`600000`) | cli_inner_pretty.js:333341 | constant |
| `Pld` | `buildConsolidationPrompt` — four-phase personal/team memory maintenance prompt | cli_inner_pretty.js:332757-332824 | function |
| `Pwo` | `isAutoDreamEnabled` — availability, explicit setting, then server default | cli_inner_pretty.js:332337-332342 | function |
| `Qks` | `isAutoDreamAvailable` — `enabled || available` | cli_inner_pretty.js:332333-332336 | function |
| `qMy` | `TEAM_MEMORY_DREAM_GUIDANCE` — conservative shared-memory pruning rules | cli_inner_pretty.js:332825-332826 | constant |
| `rOy` | `rollbackConsolidationLockAt` — unlink zero-state or restore prior mtime | cli_inner_pretty.js:333076-333089 | function |
| `sOy` | `getAutoDreamScheduleConfig` — independently validated hours/session thresholds | cli_inner_pretty.js:333156-333166 | function |
| `tOy` | `tryAcquireConsolidationLockAt` — PID claim, stale recovery, and read-back verification | cli_inner_pretty.js:333049-333072 | function |
| `Uld` | `registerDreamTask` — visible cancellable background task | cli_inner_pretty.js:333111-333126 | function |
| `uOy` | `countDreamDailyLogs` — recursive Markdown count below `logs/` | cli_inner_pretty.js:333327-333335 | function |
| `Vko` | `DreamTask` — kill handler aborts and rolls the checkpoint back | cli_inner_pretty.js:399409-399427 | object |
| `Vld` | `AUTO_DREAM_DEFAULTS` (`minHours: 24`, `minSessions: 5`) | cli_inner_pretty.js:333373 | object |
| `VMy` | `CLAUDE_MD_RECONCILIATION_GUIDANCE` | cli_inner_pretty.js:332827-332835 | constant |
| `Wld` | `failDreamTask` — terminal failure state, metrics, and task event | cli_inner_pretty.js:333145-333149 | function |
| `Xld` | `initAutoDream` — gate ordering, scheduler, fork transaction, and telemetry | cli_inner_pretty.js:333176-333299 | function |
| `Yld` | `autoDreamRunner` — closure-installed async runner | cli_inner_pretty.js:333178-333298 | variable |
| `ZMy` | `DREAM_LOCK_FILENAME` (`.consolidate-lock`) | cli_inner_pretty.js:333096 | constant |

---

## Telemetry gates touched by this theme

Recorded for cross-reference; gate names are strings, not symbols, so they are not merged as rows.

| Gate | 220 | 193 | Verdict |
|---|---|---|---|
| `tengu_cc_memory_tag_stripped` (`:819762`) | 1 | 0 | net-new — the `<cc-memory>` counter, **not** the frontmatter `#` fix |
| `tengu_salt_marsh` (`:160800`) | 1 | 0 | net-new — gates the citation prompt section, default `!1` |
| `tengu_gorse_fathom` (`:160831`) | 1 | 0 | net-new — gates an extra memory prompt block |
| `tengu_ochre_finch` (`:160813`) | 1 | 1 | carryover — swaps in the generated memory-types block |
| `tengu_moth_copse` (`:156960`) | 1 | 3 | carryover — count went **down**; gates `isMemoryIndexHidden` |
| `tengu_memdir_entrypoint_near_cap` (`:436633`) | 1 | 1 | carryover gate; the `over_cap` **field** is new |
| `tengu_team_mem_prompt_index_near_cap` (`:436629`) | 1 | 1 | carryover gate; same |
| `tengu_billiard_aviary` | 0 | 0 | still absent in both — the 2.1.193 tree's removal finding holds |
