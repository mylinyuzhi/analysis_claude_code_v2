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
[`../31_auto_memory/memory_index_size_budget.md`](../31_auto_memory/memory_index_size_budget.md).

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
