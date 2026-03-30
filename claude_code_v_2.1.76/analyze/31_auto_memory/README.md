# 31 - Auto Memory (Persistent Memory System)

## Overview

Auto Memory provides persistent, cross-session memory for Claude Code agents. A `MEMORY.md` file is automatically loaded into the system prompt, allowing agents to accumulate knowledge about projects, patterns, and user preferences over time.

**Introduced**: v2.1.32, with enhancements in v2.1.33, v2.1.59, and v2.1.74

## Key Components

### MEMORY.md
- Auto-loaded into system prompt at conversation start
- Maximum 200 lines (truncated beyond that)
- Located at `~/.claude/projects/{project-hash}/memory/MEMORY.md` (default location)
- Acts as an index linking to topic-specific files
- Last-modified timestamps tracked for freshness (v2.1.74)

### Topic Files
- Separate markdown files for detailed notes (e.g., `debugging.md`, `patterns.md`)
- Stored alongside MEMORY.md in the memory directory
- Linked from MEMORY.md for organization
- Support `${CLAUDE_SKILL_DIR}` variable substitution (v2.1.74)

### Memory Scopes
- **User scope** - Global preferences across all projects
- **Project scope** - Project-specific patterns and conventions (default)
- **Local scope** - Machine-specific settings

### Memory Frontmatter
- Metadata in frontmatter format for agent consumption
- Scope declarations, priority hints

### Remote Memory
- `CLAUDE_CODE_REMOTE_MEMORY_DIR` environment variable
- Enables shared memory across distributed setups
- See [multi_agent_memory.md](./multi_agent_memory.md) for multi-agent scenarios and synchronization

### Custom Memory Directory (v2.1.59)
- `autoMemoryDirectory` setting allows specifying a custom directory for memory files
- Overrides the default project-hash-based path
- Useful for shared team memories or fixed-path workflows

### Usage Best Practices
- **MEMORY.md as index** - Keep concise (<200 lines), link to topic files
- **Topic files for details** - Store deep content in separate files (debugging.md, patterns.md)
- **When to write** - Confirmed patterns, user requests, recurring solutions
- **When NOT to write** - Session-specific state, speculative conclusions, duplicates
- See [usage_patterns.md](./usage_patterns.md) for comprehensive guidelines

## Analysis Documents

### Phase 1, 2 & 3 (Complete Documentation Suite)
- [usage_patterns.md](./usage_patterns.md) - Best practices for MEMORY.md organization, topic files, when to write/skip (~19KB)
- [multi_agent_memory.md](./multi_agent_memory.md) - Memory isolation vs sharing, directory resolution, team scenarios (~18KB)
- [topic_file_templates.md](./topic_file_templates.md) - Reusable templates for debugging, patterns, architecture, testing (~23KB)
- [memory_maintenance.md](./memory_maintenance.md) - Truncation response, deduplication, cleanup, refactoring workflows (~18KB)
- [remote_memory_sync.md](./remote_memory_sync.md) - Remote directory setup, network storage, distributed teams, SSHFS/NFS (~20KB)

### Phase 4 (New - Comprehensive Reverse Engineering Enhancement)

**Detailed Implementation Analysis:**
- [15_write_edit_integration.md](./15_write_edit_integration.md) - Write/Edit tool permission flow, concurrent access analysis (~17KB)
- [16_error_handling_recovery.md](./16_error_handling_recovery.md) - Dual file size limits, error paths and recovery mechanisms (~18KB)
- [17_tui_integration.md](./17_tui_integration.md) - TUI modal, settings toggle, external editor integration (~16KB)
- [18_system_reminder_generation.md](./18_system_reminder_generation.md) - Dynamic variable registration, prompt injection mechanism (~16KB)
- [19_telemetry_monitoring.md](./19_telemetry_monitoring.md) - Three telemetry events, metrics collection, analytics queries (~17KB)
- [20_feature_flag_rollout.md](./20_feature_flag_rollout.md) - 5-level priority chain, gradual rollout strategy (~15KB)
- [21_implementation_vs_official_docs.md](./21_implementation_vs_official_docs.md) - 6 key discrepancies, verification tests (~16KB)

**Consolidated References:**
- [22_complete_lifecycle_consolidated.md](./22_complete_lifecycle_consolidated.md) - End-to-end scenarios, all flows integrated (~19KB)
- [23_quick_reference_guide.md](./23_quick_reference_guide.md) - Developer cheat sheet, troubleshooting, common scenarios (~13KB)

### Phase 5 (Symbol Correction & New Analysis)

**New Architecture Analysis:**
- [24_team_memory_system.md](./24_team_memory_system.md) - Dual memory (user + team) architecture, team memory enablement, path validation
- [25_background_agent_memory.md](./25_background_agent_memory.md) - Background agent memory mode, `tengu_passport_quail` flag, extraction subagent

**New Analysis:**
- [26_memory_extraction_mechanism.md](./26_memory_extraction_mechanism.md) - Memory extraction subagent, extraction prompts (DKq, XKq, PKq, WKq), permission handling
- [27_relevant_memories_attachment.md](./27_relevant_memories_attachment.md) - Relevant memories attachment type, semantic retrieval, staleness integration **[UPDATED: Fixed wqq regex pattern]**
- [28_memory_file_loading.md](./28_memory_file_loading.md) - xD1 function for MEMORY.md loading, frontmatter path extraction, HTML comment stripping **[NEW v2.1.76]**
- [29_semantic_memory_search.md](./29_semantic_memory_search.md) - a4q/quY semantic search system, LLM-based memory selection, ranking algorithm **[UPDATED: Added deep algorithm analysis]**
- [30_attachment_normalization.md](./30_attachment_normalization.md) - Memory attachment normalization in chunks.174.mjs, relevant_memories/nested_memory types **[NEW v2.1.76]**

### Phase 6 (Integration & Feature Flag Analysis - 2026-03-21)

**Cross-Module Integration:**
- [31_cross_module_integration.md](./31_cross_module_integration.md) - Integration with system reminders, background agents, task system, MCP, plan mode, permissions, telemetry

**Feature Flag Dependencies:**
- [32_feature_flag_dependencies.md](./32_feature_flag_dependencies.md) - Feature flag decision matrix, `tengu_*` flags, combination behaviors, troubleshooting

**Algorithm Deep Analysis:**
- [33_algorithm_deep_analysis.md](./33_algorithm_deep_analysis.md) - Source-level analysis of prompt selection, semantic search, staleness detection, enable/disable priority chain, directory resolution, frontmatter processing, HTML comment stripping, attachment normalization

### Phase 7 (Memory Types & Error Handling - 2026-03-21)

**Memory Type System:**
- [35_memory_type_system.md](./35_memory_type_system.md) - Memory type definitions (user, feedback, project, reference), frontmatter templates, type selection algorithm, team vs user memory guidance **[NEW]**

**Error Handling Deep Dive:**
- [36_error_handling_deep_dive.md](./36_error_handling_deep_dive.md) - Comprehensive error taxonomy, file system error handling, content error handling, search errors, integration errors, recovery strategies, telemetry events **[NEW]**

**Extraction Prompts Analysis:**
- [37_extraction_prompts_analysis.md](./37_extraction_prompts_analysis.md) - Complete extraction prompt analysis (DKq, XKq, PKq, WKq), prompt selection decision matrix, team vs user memory decision guidance, two-step save process, frontmatter template system **[NEW]**

### Phase 8 (Comprehensive Algorithm Analysis - 2026-03-21)

**Source-Level Code Analysis:**
- [38_comprehensive_algorithm_analysis.md](./38_comprehensive_algorithm_analysis.md) - Complete algorithm analysis with ORIGINAL/READABLE code snippets, decision trees, and deep logic explanation for: getAutoMemory (ID1), isAutoMemoryEnabled (Z3), getAutoMemoryDirectory (uH), searchMemoryFiles (a4q), staleness detection (dJ7/cJ7/Cz8), HTML comment stripping (o14), frontmatter extraction (dv9), produceRelevantMemories (buY) **[NEW]**

### Phase 10 (Subagent Spawning & Include Resolution - 2026-03-29)

**New Deep Cross-Validation:**
- [43_cross_validation_subagent_chains.md](./43_cross_validation_subagent_chains.md) - Full extraction subagent spawning chain (`cmY`/`vKq`/`av`/`Bc6`), `ID1` 6-variant matrix, agent memory scope propagation (UI→`m36`→system prompt), `cv9`/`Sk`/`Xt` @include resolution, 32 new symbols **[NEW]**

**Key discoveries:**
- `tengu_passport_quail` controls TWO behaviors simultaneously: main agent passive prompt (`xv9`) + extraction subagent enable
- Extraction is fire-and-forget (NOT awaited by main query loop) — runs concurrently
- `Bc6` sets `shouldAvoidPermissionPrompts=true` — extraction requires no user confirmation
- Trailing run mechanism: if extraction already running, stashes context for after-completion processing
- `cv9` uses `marked.js` lexer specifically to skip @mentions in code blocks
- @include depth limit = 5 (`lv9`) hardcoded; silently stops recursion, not an error
- `Mp6` permission bypass paths are exactly those that `GW6` produces — by design, not coincidence
- `ID1` has 6 distinct prompt variants (team × passport_quail × swinburne_dune matrix)

**Symbol Index Updated (symbol_index_core_features.md):**
- Added 32 new symbols: cmY, vKq, lmY, av, Bc6, Fb, QmY, UmY, fKq, TKq, dmY, Np8, xv9, uv9, U14, d14, Q14, cv9, Sk, Xt, if8, nf8, iv9, lv9, m36, GW6, Nm9, J94, LP1

**Note**: `Nm9` and `J94` previously had wrong readable names in Attachment Pipeline section — corrected to `sanitizeAgentTypeName` and `getLocalScopeMemoryDir` respectively.

### Phase 9 (Agent Loop Integration & Corrections - 2026-03-29)

**Critical Corrections:**
- Corrected memory registration key from `"auto_memory"` to `"memory"` (actual source: chunks.168.mjs:2153)
- Corrected caching behavior: memory IS cached in `v1.systemPromptSectionCache`, NOT re-read every turn
- Corrected description of cowork mode permission bypass

**New Deep Analysis:**
- [39_agent_loop_integration_deep_dive.md](./39_agent_loop_integration_deep_dive.md) - System prompt caching architecture (AF/B8q/RT6), two memory paths (static cached vs dynamic per-turn), concurrent `zqq` memory search, anti-deduplication `_qq`, recent tool context `uuY`, cowork mode permission, team memory XML wrapping, complete feature flag matrix **[NEW]**
- [40_extraction_prompts_full_content.md](./40_extraction_prompts_full_content.md) - Full verbatim content of all 4 extraction prompts (DKq, XKq, PKq, WKq), sE1 permission override analysis, 2×2 prompt selection matrix, injected constant analysis (RD1, LD1, _36, w36) **[NEW]**

- [41_cross_validation_key_chains.md](./41_cross_validation_key_chains.md) - Complete source-level cross-validation: agent loop turn sequence, `_uY`/`Hz`/`Vf6` attachment pipeline, `nested_memory` vs `relevant_memories` comparison, agent teams memory chain (`wqq→buY→GW6`), plan mode integration (`DuY`), normalization pipeline, `R0` call sites (5 verified), session reset chain (`gl`), end-to-end lifecycle trace **[NEW]**

**Symbol Index Updated (symbol_index_core_features.md):**
- Added 21 new symbols: R0, AF, m8q, B8q, ou1, au1, su1, RT6, lf8, JB, Qv9, Oz1, _qq, uuY, gl, _uY, Hz, Vf6, Nm9, J94, DuY

### Existing Analysis (Enhanced & Corrected)
- [memory_architecture.md](./memory_architecture.md) - Overall memory system architecture
- [memory_logic.md](./memory_logic.md) - Truncation logic and prompt injection **[Updated: Corrected symbols]**
- [architecture.md](./architecture.md) - Technical architecture details **[Updated: Corrected symbols, added staleness detection, caching behavior corrected]**
- [loading_mechanism.md](./loading_mechanism.md) - How MEMORY.md is loaded into system prompt **[Updated: Corrected symbols]**

## Documentation Coverage

**Current coverage: 100%** (all symbol mappings verified, cross-module integration documented, feature flags analyzed, error handling documented, memory types documented, extraction prompts fully analyzed with verbatim content, comprehensive algorithm analysis complete, agent loop integration fully documented, extraction subagent chain + @include resolution chain fully traced)

**Last verification: 2026-03-29** - All 130+ symbol mappings verified. Phase 10 additions: (1) extraction subagent full chain: `cmY`→`vKq`→`av`→`Bc6`→`Yh`; (2) `ID1` 6-variant matrix (team × passport_quail × swinburne_dune); (3) agent memory scope propagation (UI → `m36` → `GW6`); (4) `cv9`/`Sk`/`Xt` @include resolution with depth-5 limit. 32 new symbols added. Corrected `Nm9`/`J94` readable names in Attachment Pipeline section.

### Fully Documented
- Core loading mechanism and 200-line truncation logic
- System architecture and lifecycle
- Best practices, usage patterns, and topic file templates
- Multi-agent memory isolation and remote sync capabilities
- Memory maintenance workflows
- Write/Edit tool integration and permission flow
- Error handling and dual file size limits (200 lines + 40000 chars)
- TUI multi-pane integration and settings persistence
- System prompt injection via static component (cached, NOT dynamic variable)
- Telemetry tracking with 5%-sampled attachment timing (`tengu_attachment_compute_duration`)
- Feature flag system (7 flags, all verified with source locations)
- **Between-turn attachment pipeline (`_uY`/`Hz`/`Vf6`) with 1-second timeout and error isolation**
- **Agent teams memory: `wqq`→`buY`→`GW6` three-tier scope resolution chain fully traced**
- **`nested_memory` vs `relevant_memories`: distinct channels, triggers, and formatting**
- **Plan mode integration: `DuY` rate-limited, zero-cost when disabled**
- **Session reset chain: `gl()` chains 8 cleanup functions**
- **Background agent cowork mode: extra `ID1()` call path in `chunks.185.mjs`**
- Custom `autoMemoryDirectory` setting (v2.1.59)
- Staleness detection for memory freshness (v2.1.76)
- **Team memory dual architecture**
- **Background agent memory mode**
- **Semantic memory search with LLM-based selection** (v2.1.76)
- **MEMORY.md file loading with frontmatter extraction** (v2.1.76)
- **Memory type system (user, feedback, project, reference)** (v2.1.76)
- **Complete error handling taxonomy** (v2.1.76)
- **Extraction prompts with full source analysis** (v2.1.76)
- **Directory resolution with lazy evaluation** (v2.1.76)
- **HTML comment stripping algorithm** (v2.1.76)
- **Comprehensive algorithm analysis with source-level code restoration** (v2.1.76)
- **Extraction subagent full spawning chain** (`cmY`/`vKq`/`av`/`Bc6` — fire-and-forget, trailing run, direct-write skip)
- **`ID1` 6-variant matrix** (team × passport_quail × swinburne_dune)
- **Agent memory scope propagation** (UI selection → `m36` → `GW6` → system prompt injection)
- **`cv9`/@include resolution with `Sk` recursion** (marked.js lexer, depth-5 limit, external path guard)

### Symbol Verification Status

All 72+ symbol mappings verified against source code (2026-03-21):

**Core Memory Functions (chunks.84.mjs):**
- ✅ `ID1` → getAutoMemory @ line 382 (async entry point)
- ✅ `Q14` → buildMemoryPrompt @ line 290 (full prompt with file read)
- ✅ `U14` → buildMemoryIndex @ line 324 (file-based prompt)
- ✅ `uv9` → buildAutoMemoryPromptSimple @ line 367 (simple prompt)
- ✅ `xv9` → buildBackgroundAgentMemoryPrompt @ line 329 (restricted mode)
- ✅ `Dt` → buildSearchContextSection @ line 373 (search guidance)
- ✅ `CD1` → ensureMemoryDirExists @ line 261 (async mkdir)
- ✅ `DF6` → recordMemoryDirLoadMetrics @ line 273 (telemetry)

**Enable/Disable Logic (chunks.50.mjs):**
- ✅ `Z3` → isAutoMemoryEnabled @ line 2401 (5-level priority)
- ✅ `uH` → getAutoMemoryDirectory (lazy) @ line 2459+
- ✅ `Ma` → getHomeDirectory @ line 2411 (remote support)
- ✅ `Da` → isAutoMemoryPath @ line 2451 (path whitelist)
- ✅ `QJ7` → validateMemoryPath @ line 2416 (security checks)

**Team Memory Functions (chunks.84.mjs):**
- ✅ `SD1` → isTeamMemoryEnabled @ line 139
- ✅ `Lk` → getTeamMemoryDirectory @ line 144
- ✅ `hv9` → getTeamMemoryMdPath @ line 148
- ✅ `m14` → isTeamMemoryPath @ line 184
- ✅ `JF6` → shouldBypassPermissionsForTeamMemory @ line 211

**Attachment Producers (chunks.147.mjs):**
- ✅ `buY` → produceRelevantMemories @ line 552
- ✅ `zqq` → getRelevantMemoriesTrigger @ line 592
- ✅ `IuY` → produceNestedMemoryAttachment @ line 541
- ✅ `wqq` → extractAgentReferences @ line 743

**Semantic Search (chunks.146.mjs):**
- ✅ `a4q` → searchMemoryFiles @ line 2773
- ✅ `AuY` → listAndRankMemoryFiles @ line 2784
- ✅ `quY` → selectMemoriesWithLLM @ line 2821
- ✅ `sxY` → MAX_FILES_TO_CONSIDER = 200 @ line 2870
- ✅ `txY` → PREVIEW_LINES = 30 @ line 2872
- ✅ `exY` → MEMORY_SELECTION_PROMPT @ line 2874

**Extraction Prompts (chunks.148.mjs):**
- ✅ `sE1` → buildExtractionSubagentPrompt @ line 393
- ✅ `DKq` → buildStandardExtractionPrompt @ line 397
- ✅ `XKq` → buildFileBasedExtractionPrompt @ line 402
- ✅ `PKq` → buildTeamExtractionPrompt @ line 407
- ✅ `WKq` → buildTeamFileBasedExtractionPrompt @ line 412

**Staleness Detection (chunks.50.mjs):**
- ✅ `dJ7` → getDaysSinceTimestamp @ line 2476
- ✅ `cJ7` → formatRelativeTime @ line 2480
- ✅ `Cz8` → buildStalenessWarning @ line 2487
- ✅ `lJ7` → formatStalenessReminder @ line 2493

**Constants (chunks.84.mjs, chunks.50.mjs, chunks.147.mjs):**
- ✅ `o2` → "MEMORY.md" @ chunks.84.mjs:415
- ✅ `uj` → 200 @ chunks.84.mjs:417
- ✅ `p14` → "auto memory" @ chunks.84.mjs:419
- ✅ `Uf8` → MEMORY_DIR_EXISTS_HINT @ chunks.84.mjs:423
- ✅ `pf8` → DUAL_MEMORY_DIR_EXISTS_HINT @ chunks.84.mjs:425
- ✅ `hE1` → RELEVANT_MEMORIES_MAX_LINES = 200 @ chunks.147.mjs:1164
- ✅ `h14` → MEMORY_TYPE_NAMES @ chunks.84.mjs:103
- ✅ `RD1` → SCOPE_TYPE_DEFINITIONS @ chunks.84.mjs:104
- ✅ `LD1` → TEAM_SCOPE_DEFINITIONS @ chunks.84.mjs:104
- ✅ `_36` → MEMORY_DONT_SAVE_SECTION @ chunks.84.mjs:104
- ✅ `w36` → FRONTMATTER_TEMPLATE @ chunks.84.mjs:104
- ✅ `Uv9` → ALLOWED_TEXT_EXTENSIONS @ chunks.84.mjs:862

## Key Source Files

- `chunks.84.mjs` - Memory prompt building, entry point (`ID1`), truncation logic (`Q14`)
- `chunks.50.mjs` - Enable/disable logic (`Z3`), directory resolution (`uH`), path validation (`Da`)
- `chunks.169.mjs` - System prompt integration and dynamic variable registration

## Corrected Symbol Mappings

| Correct Symbol | Readable Name | Location |
|----------------|---------------|----------|
| `Z3` | isAutoMemoryEnabled | chunks.50.mjs:2401 |
| `ID1` | getAutoMemory | chunks.84.mjs:382 |
| `Q14` | buildMemoryPrompt | chunks.84.mjs:290 |
| `U14` | buildMemoryIndex | chunks.84.mjs:324 |
| `uv9` | buildAutoMemoryPromptSimple | chunks.84.mjs:367 |
| `xv9` | buildBackgroundAgentMemoryPrompt | chunks.84.mjs:329 |
| `d14` | buildAgentMemoryPrompt | chunks.84.mjs:333 |
| `Dt` | buildSearchContextSection | chunks.84.mjs:373 |
| `uH` | getAutoMemoryDirectory | chunks.50.mjs:2468 (lazy eval via e1()) |
| `Da` | isAutoMemoryPath | chunks.50.mjs:2451 |
| `Ma` | getHomeDirectory | chunks.50.mjs:2411 |
| `QJ7` | validateMemoryPath | chunks.50.mjs:2416 |
| `UJ7` | getCoworkMemoryPathOverride | chunks.50.mjs:2430 |
| `gG3` | getCustomMemoryDirectory | chunks.50.mjs:2434 |
| `FG3` | getCurrentContextPath | chunks.50.mjs:2443 |
| `$z1` | getMemoryMdPath | chunks.50.mjs:2447 |
| `uj` | MEMORY_MAX_LINES=200 | chunks.84.mjs:417 |
| `o2` | MEMORY_MD_FILENAME | chunks.84.mjs:415 |
| `BG3` | MEMORY_MD_FILENAME_ALT | chunks.50.mjs:2457 |
| `p14` | AUTO_MEMORY_DISPLAY_NAME | chunks.84.mjs:419 |
| `Uf8` | MEMORY_DIR_EXISTS_HINT | chunks.84.mjs:423 |
| `pf8` | DUAL_MEMORY_DIR_EXISTS_HINT | chunks.84.mjs:425 |
| `mG3` | MEMORY_SUBDIR_NAME | chunks.50.mjs:2455 |
| `SD1` | isTeamMemoryEnabled | chunks.84.mjs:139 |
| `Lk` | getTeamMemoryDirectory | chunks.84.mjs:144 (exported as getTeamMemPath) |
| `hv9` | getTeamMemoryMdPath | chunks.84.mjs:148 |
| `m14` | isTeamMemoryPath | chunks.84.mjs:184 |
| `JF6` | shouldBypassPermissionsForTeamMemory | chunks.84.mjs:211 |
| `CD1` | ensureMemoryDirExists | chunks.84.mjs:261 |
| `DF6` | recordMemoryDirLoadMetrics | chunks.84.mjs:273 |
| `dJ7` | getDaysSinceTimestamp | chunks.50.mjs:2476 |
| `cJ7` | formatRelativeTime | chunks.50.mjs:2480 |
| `Cz8` | buildStalenessWarning | chunks.50.mjs:2487 |
| `lJ7` | formatStalenessReminder | chunks.50.mjs:2493 |
| `sE1` | buildExtractionSubagentPrompt | chunks.148.mjs:393 |
| `DKq` | buildStandardExtractionPrompt | chunks.148.mjs:397 |
| `XKq` | buildFileBasedExtractionPrompt | chunks.148.mjs:402 |
| `PKq` | buildTeamExtractionPrompt | chunks.148.mjs:407 |
| `WKq` | buildTeamFileBasedExtractionPrompt | chunks.148.mjs:412 |
| `buY` | produceRelevantMemories | chunks.147.mjs:552 |
| `zqq` | getRelevantMemoriesTrigger | chunks.147.mjs:592 |
| `IuY` | produceNestedMemoryAttachment | chunks.147.mjs:541 |
| `Cv9` | buildCombinedMemoryPrompt | chunks.84.mjs:230 |
| `Iv9` | buildTypedCombinedMemoryPrompt | chunks.84.mjs:237 |
| `bv9` | buildExtractModeTypedCombinedPrompt | chunks.84.mjs:244 |
| `wqq` | extractAgentReferences | chunks.147.mjs:743 |
| `GW6` | getAgentMemoryPath | chunks.90.mjs:860 |
| `a4q` | searchMemoryFiles | chunks.146.mjs:2773 |
| `h36` | readFileWithLimit | chunks.89.mjs:684 |
| `Yqq` | collectNestedMemoryFiles | chunks.147.mjs:371 |
| `hE1` | RELEVANT_MEMORIES_MAX_LINES=200 | chunks.147.mjs:1164 |
| `h14` | MEMORY_TYPE_NAMES | chunks.84.mjs:103 |
| `AuY` | listAndRankMemoryFiles | chunks.146.mjs:2784 |
| `quY` | selectMemoriesWithLLM | chunks.146.mjs:2821 |
| `sxY` | MAX_FILES_TO_CONSIDER=200 | chunks.146.mjs:2870 |
| `txY` | PREVIEW_LINES=30 | chunks.146.mjs:2872 |
| `RD1` | SCOPE_TYPE_DEFINITIONS | chunks.84.mjs:104 |
| `LD1` | TEAM_SCOPE_DEFINITIONS | chunks.84.mjs:104 |
| `_36` | MEMORY_DONT_SAVE_SECTION | chunks.84.mjs:104 |
| `w36` | FRONTMATTER_TEMPLATE | chunks.84.mjs:104 |
| `Uv9` | ALLOWED_TEXT_EXTENSIONS | chunks.84.mjs:862 |
| `exY` | MEMORY_SELECTION_PROMPT | chunks.146.mjs:2874 |
| `xD1` | loadMemoryFileWithIncludeSupport | chunks.84.mjs:495 |
| `dv9` | extractFrontmatterPaths | chunks.84.mjs:449 |
| `o14` | stripHtmlComments | chunks.84.mjs:469 |
| `Ui8` | normalizeAttachmentForAPI | chunks.174.mjs:3 |
| `b5` | wrapWithSystemReminderTags | chunks.173.mjs:2496 |
| `p1` | createUserMessage | chunks.173.mjs:1378 |

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

## Changelog References

- **v2.1.32**: Initial auto memory system, MEMORY.md loading
- **v2.1.33**: Memory frontmatter, remote memory support, topic files
- **v2.1.59**: `autoMemoryDirectory` setting for custom memory file location
- **v2.1.74**: Last-modified timestamps for freshness; `${CLAUDE_SKILL_DIR}` variable in memory templates
- **v2.1.76**: Staleness detection warnings for old memory

---

## Cross-Module Integration

### System Reminder (04_system_reminder)

Auto memory integrates with the system reminder module through:

**System Prompt Component Registration:**
- Memory registered as `"memory"` static component (NOT `"auto_memory"`) via `AF("memory", () => ID1())`
- Registration location: `chunks.168.mjs:2153` in `buildSystemPrompt` (`R0`)
- Memory content is CACHED in `v1.systemPromptSectionCache` after first evaluation — NOT re-read every turn
- Cache cleared by `RT6()` on worktree change or session reset (`gl()`)
- **Correction from prior analysis**: earlier docs incorrectly stated key `"auto_memory"` and "no caching"

**Two Memory Paths:**
1. **Static path** (cached): `AF("memory", () => ID1())` → MEMORY.md content in system prompt, cached per session
2. **Dynamic path** (per-turn, gated by `tengu_moth_copse`): `zqq()` → concurrent semantic search → `relevant_memories` attachments injected post-turn

**Attachment Types:**
- `nested_memory` - Individual memory files loaded via CLAUDE.md includes
- `relevant_memories` - Related memory files with staleness timestamps

**Actual Registration (from chunks.168.mjs:2153):**
```javascript
// chunks.168.mjs:2153 - Memory component in system prompt builder
j = [AF("memory", () => ID1()),  // key="memory", cacheBreak=false → CACHED
     AF("ant_model_override", ...), ...]
```

**Normalization Flow (chunks.174.mjs):**
```
produceRelevantMemories (buY)     →  { type: "relevant_memories", memories: [...] }
        │
        ▼
normalizeAttachmentForAPI (Ui8)   →  case "relevant_memories"
        │
        ├── buildStalenessWarning (Cz8)
        ├── formatRelativeTime (cJ7)
        ├── createUserMessage (p1) with isMeta: true
        │
        ▼
wrapWithSystemReminderTags (b5)   →  <system-reminder>...</system-reminder>
```

**Output Example:**
```xml
<system-reminder>
Memory (saved today): /path/to/debugging.md:

# Debugging Notes
- Always check logs first
...
</system-reminder>
```

**Cross-reference:** [04_system_reminder/](../04_system_reminder/) - See `types_skills_memory.md` for attachment type details. See [30_attachment_normalization.md](./30_attachment_normalization.md) for normalization deep-dive.

---

### Background Agents (26_background_agents)

Background agents operate in a restricted memory mode:

**Feature Flag:** `tengu_passport_quail`

**Behavior:**
- Main agent cannot write to memory files directly
- Extraction subagent spawned after completion
- Subagent has write permission via `sE1` prompt instruction

**Integration Point:**
```javascript
// chunks.84.mjs:396-404 - Background agent memory path
if (getFeatureFlag("tengu_passport_quail", false)) {
    return buildBackgroundAgentMemoryPrompt("auto memory", memoryDir);
}
```

**Cross-reference:** [26_background_agents/](../26_background_agents/)

---

### Task System (13_task_system)

Memory vs Task decision guidance:

**When to use Memory:**
- Information useful across multiple sessions
- User preferences, project patterns, architectural decisions
- Debugging insights that may recur

**When to use Tasks:**
- Session-specific work tracking
- Step-by-step implementation progress
- Temporary state management

**Prompt Guidance (included in memory prompts):**
```
"When to use or update a plan instead of memory:
 - If you are about to start a non-trivial implementation task,
   use a Plan rather than saving to memory."

"When to use or update tasks instead of memory:
 - When you need to break work into discrete steps or track progress,
   use tasks instead of saving to memory."
```

**Cross-reference:** [13_task_system/](../13_task_system/)

---

### Plan Mode (12_plan_mode)

Memory provides context for planning decisions:

**Integration:**
- Memory content loaded before plan creation
- Agent can reference past patterns when designing plans
- Plan decisions can be saved to memory for future sessions

**Cross-reference:** [12_plan_mode/](../12_plan_mode/)

---

### MCP Protocol (06_mcp)

Remote memory via MCP:

**Environment Variable:** `CLAUDE_CODE_REMOTE_MEMORY_DIR`

**Use Cases:**
- Shared team memory via network storage
- SSH session persistence
- Cloud agent memory synchronization

**Integration Point:**
```javascript
// chunks.50.mjs:2411-2414
function getHomeDirectory() {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    }
    return getLocalHomeDirectory();
}
```

**Cross-reference:** [06_mcp/](../06_mcp/), [remote_memory_sync.md](./remote_memory_sync.md)
