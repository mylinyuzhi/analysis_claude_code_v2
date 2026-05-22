# Symbol Additions: v2.1.142 Auto Memory (Unit 03)

All obfuscated → readable mappings discovered while deobfuscating the auto-memory subsystem in v2.1.142. Source file is `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` throughout; line numbers below refer to that file.

Where a v2.1.112 equivalent exists, it is listed in the rightmost column for traceability across versions. New-in-v2.1.142 entries have `(new)` in that column.

## Module: Auto Memory — Core (memdir.ts equivalent)

| Obfuscated | Readable | File:Line | Type | v2.1.112 |
|------------|----------|-----------|------|----------|
| `xj` | ENTRYPOINT_NAME | cli_inner_pretty.js:141682 | constant | `YW` |
| `nh1` | ENTRYPOINT_NAME (alias used inside paths block) | cli_inner_pretty.js:139836 | constant | `SE_` |
| `jKH` | MAX_ENTRYPOINT_LINES | cli_inner_pretty.js:141683 | constant | `Ve` |
| `d5$` | MAX_ENTRYPOINT_BYTES | cli_inner_pretty.js:142953 | constant | `Zz8` |
| `TK6` | AUTO_MEM_DISPLAY_NAME | cli_inner_pretty.js:142954 | constant | `ptY` |
| `JKH` | DIR_EXISTS_GUIDANCE | cli_inner_pretty.js:141684 | constant | `FM6` |
| `B5$` | DIRS_EXIST_GUIDANCE | cli_inner_pretty.js:141686 | constant | `sd8` |
| `oi$` | truncateEntrypointContent | cli_inner_pretty.js:142678-142716 | function | `eU1` |
| `PKH` | ensureMemoryDirExists | cli_inner_pretty.js:142717-142725 | function | `Iu6` |
| `jl` | logMemoryDirCounts | cli_inner_pretty.js:142726-142742 | function | `TW6` |
| `VK6` | buildMemoryLines (default path) | cli_inner_pretty.js:142743-142804 | function | `neK` |
| `mVK` | buildMemoryPrompt (agent-memory variant) | cli_inner_pretty.js:142805-142828 | function | `ieK` |
| `yVK` | buildMemoryLinesTiny (single-dir tiny) | cli_inner_pretty.js:142167-142215 | function | (new) |
| `hVK` | buildCombinedMemoryPromptTiny (dual-dir tiny) | cli_inner_pretty.js:142216-142272 | function | (new) |
| `IVK` | buildSimpleMemoryPrompt | cli_inner_pretty.js:142273-142312 | function | (new) |
| `SVK` | buildDreamPrompt | cli_inner_pretty.js:142313-142340 | function | (new) |
| `VZH` | buildSearchingPastContextSection | cli_inner_pretty.js:142829-142854 | function | `Dz8` |
| `c5$` | loadMemoryPrompt (top-level dispatcher) | cli_inner_pretty.js:142855-142927 | function | `fz8` |
| `BVK` | shouldUseFullMemoryForAgent | cli_inner_pretty.js:142928-142934 | function | (new) |
| `pVK` | getSimpleAgentHeader | cli_inner_pretty.js:142935-142939 | function | (new) |
| `UVK` | buildAgentMemoryPrompt | cli_inner_pretty.js:142940-142951 | function | (new) |

## Module: Auto Memory — Types Taxonomy (memoryTypes.ts equivalent)

| Obfuscated | Readable | File:Line | Type | v2.1.112 |
|------------|----------|-----------|------|----------|
| `JK6` | MEMORY_TYPES | cli_inner_pretty.js:141990 | constant | `SC4` |
| `WK6` | TINY_MEMORY_TYPES | cli_inner_pretty.js:142352 | constant | (new) |
| `XK6` | MEMORY_TYPES_SKILL_NAME | cli_inner_pretty.js:141977 | constant | (new) |
| `KS1` | BOUNCER_TYPE_DESCRIPTIONS | cli_inner_pretty.js:141991-141997 | object | (new) |
| `VVK` | parseMemoryType | cli_inner_pretty.js:141954-141957 | function | `CC4` |
| `LK6` | isBouncerEnabled | cli_inner_pretty.js:141958-141960 | function | (new) |
| `_S1` | buildTypesSectionBouncer | cli_inner_pretty.js:141961-141972 | function | (new) |
| `ZZH` | maybeSwapToBouncer | cli_inner_pretty.js:141973-141975 | function | (new) |
| `li$` | TYPES_SECTION_COMBINED | cli_inner_pretty.js:141998-142067 | constant | `bC4` |
| `U5$` | TYPES_SECTION_INDIVIDUAL | cli_inner_pretty.js:142068-142133 | constant | `IC4` |
| `GK6` | TYPES_SECTION_COMBINED_TINY | cli_inner_pretty.js:142423-142482 | constant | (new) |
| `ZK6` | TYPES_SECTION_INDIVIDUAL_TINY | cli_inner_pretty.js:142366-142422 | constant | (new) |
| `GZH` | WHAT_NOT_TO_SAVE_SECTION | cli_inner_pretty.js:142134-142144 | constant | `aH6` |
| `PK6` | MEMORY_DRIFT_CAVEAT | cli_inner_pretty.js:141982-141983 | constant | `ji1` |
| `AS1` | MEMORY_DRIFT_CAVEAT_TINY | cli_inner_pretty.js:142343-142344 | constant | (new) |
| `vVK` | WHEN_TO_ACCESS_SECTION | cli_inner_pretty.js:142145-142151 | constant | `xC4` / `PkK` |
| `NVK` | WHEN_TO_ACCESS_SECTION_TINY | cli_inner_pretty.js:142354-142360 | constant | (new) |
| `TZH` | TRUSTING_RECALL_SECTION | cli_inner_pretty.js:142152-142164 | constant | `sH6` |
| `EVK` | RECALLED_IN_TOOL_RESULTS_SECTION | cli_inner_pretty.js:142361-142365 | constant | (new) |
| `jBH` | MEMORY_FRONTMATTER_EXAMPLE (default, all 4 types) | cli_inner_pretty.js:142165 | constant | `mh6` / `MkK` (schema-changed) |
| `kVK` | MEMORY_FRONTMATTER_EXAMPLE_TINY (3 types) | cli_inner_pretty.js:142353 | constant | (new) |
| `jK6` | WIKILINK_GUIDANCE | cli_inner_pretty.js:141950-141952 | constant | (new) |
| `ci$` | buildFrontmatterExample | cli_inner_pretty.js:141909-141924 | function | (new) |
| `eI1` | (string) "memory" — type label | cli_inner_pretty.js:141927 | constant | (existed but not deobfuscated in v2.1.112 set) |
| `DK6` | coerceNonEmptyStringOrNull | cli_inner_pretty.js:141928 | function | (helper) |
| `HS1` | isPlainObject (helper) | cli_inner_pretty.js:141929 | function | (helper) |
| `$S1` | validateMetadataFrontmatter | cli_inner_pretty.js:141930-141937 | function | (new — schema validator) |
| `LKH` | readMetadataField | cli_inner_pretty.js:141938 | function | (new — metadata accessor) |
| `qS1` | slugifyName | cli_inner_pretty.js:141940-141945 | function | (new) |
| `sI1` | METADATA_RESERVED_KEYS (`["name","description","metadata"]`) | cli_inner_pretty.js:141949 | constant | (new) |
| `tI1` | METADATA_SLUG_REGEX (`/^[a-z0-9_-]+$/`) | cli_inner_pretty.js:141949 | constant | (new) |

## Module: Auto Memory — Frontmatter Parsing (utils/frontmatterParser.ts equivalent)

| Obfuscated | Readable | File:Line | Type | v2.1.112 |
|------------|----------|-----------|------|----------|
| `tO` | parseFrontmatter | cli_inner_pretty.js:141788-141809 | function | `p2` |
| `PVK` | coerceToFrontmatterDict | cli_inner_pretty.js:141810-141813 | function | (helper, was inline in v2.1.112) |
| `XKH` | FRONTMATTER_RE | cli_inner_pretty.js:141889 | regex | `zy6` (now tolerates trailing whitespace after opening `---`) |
| `aI1` | autoQuoteYaml | cli_inner_pretty.js:141761-141787 | function | `g8z` |
| `iYH` | parseYaml (Bun.YAML.parse wrapper) | cli_inner_pretty.js:141751-141753 | function | `yt6` |
| `Fi$` | stringifyYaml (Bun.YAML.stringify wrapper) | cli_inner_pretty.js:141754-141760 | function | (helper) |
| `iI1` | KNOWN_FRONTMATTER_KEYS (50-ish field allowlist) | cli_inner_pretty.js:141694-141748 | constant | (existed; expanded) |
| `JAY` | KNOWN_FRONTMATTER_KEYS_LOOKUP (Map) | cli_inner_pretty.js:141749 | constant | (helper) |
| `rI1` | normalizeFrontmatterKey (lowercase + strip dashes/underscores) | cli_inner_pretty.js:141688-141690 | function | (helper) |

## Module: Auto Memory — Path Resolution (paths.ts equivalent)

| Obfuscated | Readable | File:Line | Type | v2.1.112 |
|------------|----------|-----------|------|----------|
| `x9` | isAutoMemoryEnabled | cli_inner_pretty.js:139749-139760 | function | `x3` |
| `Rd` | isToggleMemoryDisabled (`/toggle-memory`) | (referenced inside `x9`; defined elsewhere) | function | (new) |
| `Pi$` | isCcrSentinelDisabled | cli_inner_pretty.js:139761-139768 | function | (new) |
| `LTK` | isPathPrefixMember | (referenced inside `Pi$`; defined elsewhere) | function | (helper) |
| `Wi$` | isExtractModeActive | cli_inner_pretty.js:139769-139772 | function | `Lk8` |
| `zF` | getMemoryBaseDir | cli_inner_pretty.js:139773-139776 | function | `X46` |
| `lh1` | getAutoMemEntrypointDirname | cli_inner_pretty.js:139777-139779 | function | `RE_` |
| `gM` | isTinyMemoryEnabled | cli_inner_pretty.js:139780-139782 | function | `wH` |
| `VTK` | validateMemoryPath | cli_inner_pretty.js:139783-139803 | function | `Vq4` |
| `vTK` | getAutoMemPathOverride | cli_inner_pretty.js:139804-139806 | function | `kq4` |
| `ih1` | getAutoMemPathSetting | cli_inner_pretty.js:139807-139813 | function | `CE_` (sources narrowed in v2.1.142) |
| `Zi$` | hasAutoMemPathOverride | cli_inner_pretty.js:139814-139816 | function | `hk8` |
| `rh1` | getAutoMemBase | cli_inner_pretty.js:139817-139819 | function | `bE_` |
| `YKH` | getAutoMemEntrypoint | cli_inner_pretty.js:139820-139822 | function | `Rk8` |
| `YF` | isAutoMemPath | cli_inner_pretty.js:139823-139825 | function | `YR` |
| `N5$` | isAutoMemPathWithoutTeam | cli_inner_pretty.js:139826-139831 | function | `Xi$` (negation helper) |
| `Xi$` | isTeamSubpath (used by `N5$`) | (referenced; defined elsewhere) | function | (helper) |
| `dh1` | AUTO_MEM_DIRNAME ("memory") | cli_inner_pretty.js:139834 | constant | `LE_` |
| `ch1` | TINY_MEM_DIRNAME ("tiny_memory") | cli_inner_pretty.js:139835 | constant | `hE_` |
| `UY` | getAutoMemPath (memoized resolver) | cli_inner_pretty.js:139849-139857 | function | `Nw` |
| `TTK` | os module (require('os')) | cli_inner_pretty.js:139832, 139848 | module | (require alias) |
| `EE` | path module (require('path')) | cli_inner_pretty.js:139832, 139848 | module | (require alias) |
| `L8` | memoize (used by `UY`) | (referenced; defined elsewhere) | function | `P1` |
| `R9` | getProjectRoot (used by memo key) | cli_inner_pretty.js:2342 | function | `c9` |
| `DO` | sanitizePath | (referenced inside `UY`) | function | `AP` |
| `BY` | findCanonicalGitRoot (used by `rh1`) | (referenced; defined elsewhere) | function | (helper) |

## Module: Auto Memory — Memory Age (memoryAge.ts equivalent)

| Obfuscated | Readable | File:Line | Type | v2.1.112 |
|------------|----------|-----------|------|----------|
| `e6_` | memoryAgeDays | cli_inner_pretty.js:217444-217446 | function | `a5z` |
| `A36` | memoryFreshnessText | cli_inner_pretty.js:217447-217455 | function | `$Q1` |
| `iiK` | memoryFreshnessNote | cli_inner_pretty.js:217456-217461 | function | `RZ4` |

## Module: Auto Memory — Memory Scan (memoryScan.ts equivalent)

| Obfuscated | Readable | File:Line | Type | v2.1.112 |
|------------|----------|-----------|------|----------|
| `jz_` | parseISODateOrNull | cli_inner_pretty.js:237066-237075 | function | `dMz` |
| `SO$` | scanMemoryFiles | cli_inner_pretty.js:237076-237112 | function | `t88` |
| `RO$` | formatMemoryManifest | cli_inner_pretty.js:237113-237130 | function | `e88` |
| `Oz_` | SCAN_FILE_CAP (200) | cli_inner_pretty.js:237133 | constant | `FMz` |
| `Mz_` | SYNTHESIS_FILE_CAP (250) | cli_inner_pretty.js:237134 | constant | `gMz` (was 500) |
| `wz_` | FRONTMATTER_ONLY_LINE_BUDGET (30) | cli_inner_pretty.js:237135 | constant | `UMz` |
| `Dz_` | FULL_BODY_LINE_BUDGET (200) | cli_inner_pretty.js:237136 | constant | `QMz` |
| `UK7` | fs/promises module (require) | cli_inner_pretty.js:237143 | module | `mMz` (readdir wrapper) |
| `x68` | path module (require) | cli_inner_pretty.js:237143 | module | `BMz` / `pMz` |
| `pOH` | readFileInRange | (referenced; defined in shared utils) | function | `m56` |
| `wBH` | parseFrontmatterAndBody | (referenced; wrapper around `tO`) | function | (alias / wrapper) |

## Module: Auto Memory — Find Relevant (findRelevantMemories.ts equivalent)

| Obfuscated | Readable | File:Line | Type | v2.1.112 |
|------------|----------|-----------|------|----------|
| `$36` | MEMDIR_QUERY_SOURCE ("memdir_relevance") | cli_inner_pretty.js:217443 | constant | `YQ1` |
| `q36` | getSelectorStateForDir | cli_inner_pretty.js:217408-217410 | function | `AQ1` |
| `K36` | initSelectorStateForDir | cli_inner_pretty.js:217411-217429 | function | `OQ1` |
| `_36` | appendSelectorQAToState | cli_inner_pretty.js:217431-217445 | function | `wQ1` |
| `FK7` | findRelevantMemoriesSelector | cli_inner_pretty.js:237145-237154 | function | `uC4` |
| `Lz_` | selectRelevantMemoriesSideQuery | cli_inner_pretty.js:237155-237198 | function | `nMz` |
| `gK7` | synthesizeRelevantMemories | cli_inner_pretty.js:237199-237205 | function | `mC4` |
| `Pz_` | synthesizeMemorySideQuery | cli_inner_pretty.js:237206-237257 | function | `iMz` |
| `Jz_` | SELECT_MEMORIES_SYSTEM_PROMPT | cli_inner_pretty.js:237258-237265 | constant | `cMz` |
| `Xz_` | SYNTHESIZE_MEMORIES_SYSTEM_PROMPT | cli_inner_pretty.js:237266-237286 | constant | `lMz` |
| `Sg` | sideQuery (used by `Lz_` / `Pz_`) | (referenced; defined elsewhere) | function | `dR` |
| `lv` | getDefaultSonnetModel | (referenced; defined elsewhere) | function | `Af` |
| `x$` | jsonParse | (referenced; defined elsewhere) | function | `n8` |
| `RH` | markPerfBoundary | (referenced; defined elsewhere) | function | (helper) |
| `J8` | markPerfFailure | (referenced; defined elsewhere) | function | (helper) |
| `N` | logForDebugging | (referenced; defined elsewhere) | function | `E` |
| `ZH` | errorMessage | (referenced; defined elsewhere) | function | `b6` |

## Module: Auto Memory — Attachment Pipeline

| Obfuscated | Readable | File:Line | Type | v2.1.112 |
|------------|----------|-----------|------|----------|
| `_h6` | memoryHeader | cli_inner_pretty.js:398235-398242 | function | `B97` |
| `oo7` | startRelevantMemoryPrefetch | cli_inner_pretty.js:398243-398281 | function | `ikK` |
| `ao7` | filterDuplicateMemoryAttachments | cli_inner_pretty.js:398282-398295 | function | (inline in v2.1.112) |
| `Oq5` | getRelevantMemoryAttachments | (referenced inside `oo7`; full body in cli_inner_pretty.js:398150-398234) | function | `RMY` |
| `Mq5` | collectSurfacedMemories | (referenced inside `oo7`) | function | `SMY` |
| `Dq5` | EXCLUDED_PREFETCH_QUERY_SOURCES | (referenced inside `oo7`) | constant (Set) | `bMY` |
| `m65` | RELEVANT_MEMORIES_CONFIG (`{MAX_SESSION_BYTES: 61440}`) | (referenced inside `oo7`) | constant | `_MY` |
| `Wb` | extractText (last-user-message text) | (referenced inside `oo7`) | function | `it` |
| `nE` | createAbortLink | (referenced inside `oo7`) | function | `tv` |
| `md` | isAbortError | (referenced inside `oo7`) | function | `uw8` |
| `EH` | reportError | (referenced inside `oo7`) | function | `j6` |
| (renderer cases) | `relevant_memories` / `nested_memory` cases | cli_inner_pretty.js:425073-425091 / 426132-426140 | message renderer | (same case shape as v2.1.112) |
| `o_` | wrapMessagesInSystemReminder | (referenced in renderers) | function | `X_` |
| `w8` | createUserMessage | (referenced in renderers) | function | `t8` |

## Module: Auto Memory — Team Memory (teamMemPaths.ts equivalent)

| Obfuscated | Readable | File:Line | Type | v2.1.112 |
|------------|----------|-----------|------|----------|
| `uT` | PathTraversalError | cli_inner_pretty.js:142583-142595 | class | `TD` |
| `zS1` | sanitizePathKey | cli_inner_pretty.js:142495-142510 | function | `$qz` |
| `g5$` | isTeamMemoryEnabled | cli_inner_pretty.js:142511-142514 | function | `Ye6` |
| `Dl` | getTeamMemPath | cli_inner_pretty.js:142515-142517 | function | `vp` |
| `ii$` | isTeamMemoryActiveForCwd | cli_inner_pretty.js:142518-142521 | function | `HR8` |
| `RVK` | realpathDeepestExisting | cli_inner_pretty.js:142522-142543 | function | `JW4` |
| `CVK` | isRealPathWithinTeamDir | cli_inner_pretty.js:142544-142555 | function | `XW4` |
| `bVK` | isTeamMemPath | cli_inner_pretty.js:142556-142560 | function | `MW4` |
| `YS1` | validateTeamMemWritePath | cli_inner_pretty.js:142561-142569 | function | `jqz` |
| `ri$` | validateTeamMemKey | cli_inner_pretty.js:142570-142579 | function | `JR8` |
| `Q5$` | isTeamMemFile | cli_inner_pretty.js:142580-142582 | function | `Ae6` |
| `F5$` | fs/promises module | cli_inner_pretty.js:142589 | module | (require alias) |
| `hE` | path module | cli_inner_pretty.js:142589 | module | (require alias) |
| `_v8` | getTeamMemSyncState | (referenced inside `ii$`) | function | (helper) |
| `O8` | extractErrorCode | (referenced inside team validators) | function | `Q1` |
| `DF` | teamMemPaths namespace export | cli_inner_pretty.js:142484-142494 | namespace | `Ka8` |
| `vZH` | teamMemPaths reference inside memdir block | cli_inner_pretty.js:142855+ | reference | `Ka8` reference |

## Module: Auto Memory — Team Memory Prompts (teamMemPrompts.ts equivalent)

| Obfuscated | Readable | File:Line | Type | v2.1.112 |
|------------|----------|-----------|------|----------|
| `fS1` | buildCombinedMemoryPrompt (function inside namespace) | cli_inner_pretty.js:142599-142671 | function | `BtY` |
| `xVK` | teamMemPrompts namespace | cli_inner_pretty.js:142597-142598 | namespace | `FtY` |
| `OS1` | teamMemPrompts reference inside memdir block | cli_inner_pretty.js:142855+ | reference | `FtY` reference |

## Telemetry Tags (Unchanged Strings)

| Symbol | String | Notes |
|--------|--------|-------|
| `tengu_memdir_loaded` | telemetry event name | Fired by `jl` (logMemoryDirCounts) on directory scan |
| `tengu_memdir_disabled` | telemetry event name | Fired by `c5$` (loadMemoryPrompt) when memory is off |
| `tengu_team_memdir_disabled` | telemetry event name | Fired in the disabled branch when user is in team-mem cohort |
| `tengu_memdir_prefetch_collected` | telemetry event name | Fired on prefetch dispose with latency + cache token counts |
| `tengu_memdir_accessed` | telemetry event name | Fired on per-tool memory access (read/edit/write — cli_inner_pretty.js:418430) |
| `tengu_memdir_file_read` | telemetry event name | Fired specifically on memory file reads (cli_inner_pretty.js:418432) |
| `tengu_memdir_file_edit` | telemetry event name | Fired on memory file edits (cli_inner_pretty.js:418435) |
| `tengu_memdir_file_write` | telemetry event name | Fired on memory file writes (cli_inner_pretty.js:418438) |
| `tengu_auto_memory_toggled` | telemetry event name | Fired by the `/toggle-memory` slash command (cli_inner_pretty.js:445530) |
| `memdir_relevance` | querySource tag | Used by the selector / synthesizer side queries |
| `memory_scan` | perf boundary | Used by `SO$` for scan completion timing |
| `memory_recall_select` | perf boundary | Used by `Lz_` for select-side-query timing |
| `memory_recall_synthesize` | perf boundary | Used by `Pz_` for synthesize-side-query timing |
| `memory_load_prompt` | perf boundary | Used by `c5$` for memory-section build timing |
| `auto_memory_off` | settings flag value | (referenced in error messages cli_inner_pretty.js:518223 / 518365 / 518388) |

## Feature Flags Used

| Flag | Default | Used by | Purpose |
|------|---------|---------|---------|
| `tengu_billiard_aviary` | false | `gM`, `lh1`, `UY` cache key, scan caps, find-relevant dispatch | Enable tiny-memory variant |
| `tengu_herring_clock` | false | `g5$`, disabled-cohort telemetry | Enable team memory |
| `tengu_moth_copse` | false | `c5$` (skipIndex), `oo7` (prefetch gate) | Single-step "skip index" memory writes / enable memdir relevance prefetch |
| `tengu_coral_fern` | false | `VZH` (search context section) | Show "Searching past context" section |
| `tengu_ochre_finch` | false | `LK6`, `ZZH` | Enable BOUNCER (skill-pointer) types section |
| `tengu_passport_quail` | false | `Wi$` (extract mode) | Enable extract-memories background agent |
| `tengu_slate_thimble` | false | `Wi$` | Allow extract mode in non-interactive sessions |
| `tengu_sepia_cormorant` | null | `Pi$` | CCR sentinel-paths allowlist |
| `tengu_umber_petrel` | false | `Pi$` | Enable CCR sentinel-paths kill-switch |
| `tengu_vellum_lantern` | false | `LY` (isSimpleSystemPromptEnabled) | Enable simple-system-prompt branch |

## Environment Variables Used

| Env Var | Used by | Purpose |
|---------|---------|---------|
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | `x9` | Hard env-var disable / explicit enable |
| `CLAUDE_CODE_SIMPLE` | `x9` | `--bare` switch — disables memory |
| `CLAUDE_CODE_REMOTE` + `CLAUDE_CODE_REMOTE_MEMORY_DIR` | `x9`, `zF` | CCR-mode dispatching |
| `CLAUDE_COWORK_MEMORY_PATH_OVERRIDE` | `vTK` | Full-path override for the auto-memory directory |
| `CLAUDE_COWORK_MEMORY_GUIDELINES` | `c5$` | Verbatim override of the `# auto memory` body |
| `CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES` | `c5$`, `UVK` | Additional guidelines appended after the generated body |
| `CLAUDE_CODE_DISABLE_AGENT_VIEW` | `rmH` | Disable the agent fleet UI (orthogonal but adjacent — see cli_inner_pretty.js:139859) |
| `CLAUDE_CODE_AGENT_VIEW_RELAUNCH` | `E5$` | Agent-view relaunch marker (adjacent) |

## Settings Keys (`autoMemoryEnabled`, `autoMemoryDirectory`)

| Source | Read by | Purpose |
|--------|---------|---------|
| `policySettings.autoMemoryEnabled` / `autoMemoryDirectory` | `x9`, `ih1` | Top-priority admin-level setting |
| `flagSettings.autoMemoryDirectory` | `ih1` | CLI-flag-driven setting |
| `userSettings.autoMemoryDirectory` | `ih1` | User-level setting |
| `localSettings.autoMemoryDirectory` | **NOT READ in v2.1.142** | Removed from override sources (was read in v2.1.112) |
| `projectSettings.autoMemoryDirectory` | NOT READ (security) | Never read for memory paths (security risk if `.claude/settings.json` is malicious) |

---

**Status**: Shared System-Prompts row (`tO` parseFrontmatter) consolidated into symbol_index_core_execution.md as of v2.1.142 deobfuscation work. The remainder (auto-memory paths, types taxonomy, scan/recall/synthesize, team memory, attachment pipeline) belongs to the Skills / Memory area of symbol_index_core_features.md and remains pending consolidation.
