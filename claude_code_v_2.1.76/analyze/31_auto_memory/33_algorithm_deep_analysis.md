# Auto Memory: Algorithm Deep Analysis

## Overview

This document provides source-level analysis of the key algorithms in the Auto Memory system. Each algorithm is analyzed for decision points, complexity, edge cases, and design rationale.

**Version**: Claude Code v2.1.76

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

---

## 1. Memory Prompt Selection Algorithm (ID1)

### 1.1 Decision Tree

**What it does**: Selects the appropriate memory prompt format based on feature flags and memory configuration.

**Source Code**: chunks.84.mjs:382-411

```javascript
// ============================================
// getAutoMemory - Memory prompt selection algorithm
// Location: chunks.84.mjs:382-411
// ============================================

// ORIGINAL (for source lookup):
async function ID1() {
    let A = Z3(),
        q = w8("tengu_swinburne_dune", !1);
    if (F14.isTeamMemoryEnabled()) {
        let K = uH(),
            Y = F14.getTeamMemPath();
        if (await CD1(Y), DF6(K, { memory_type: "auto" }), DF6(Y, { memory_type: "team" }),
            w8("tengu_passport_quail", !1)) return Qf8.buildExtractModeTypedCombinedPrompt();
        if (q) return Qf8.buildTypedCombinedMemoryPrompt();
        return Qf8.buildCombinedMemoryPrompt()
    }
    if (A) {
        let K = uH();
        if (await CD1(K), DF6(K, { memory_type: "auto" }), w8("tengu_passport_quail", !1))
            return xv9("auto memory", K).join("\n");
        if (q) return U14("auto memory", K).join("\n");
        return uv9()
    }
    if (d("tengu_memdir_disabled", {
        disabled_by_env_var: t6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
        disabled_by_setting: !t6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) && mA().autoMemoryEnabled === !1
    }), w8("tengu_herring_clock", !1)) d("tengu_team_memdir_disabled", {});
    return null
}

// READABLE (for understanding):
async function getAutoMemory() {
    const isEnabled = isAutoMemoryEnabled();                    // Z3()
    const useFileBasedFormat = getFeatureFlag("tengu_swinburne_dune", false);

    // BRANCH 1: Team Memory Mode (dual memory)
    if (isTeamMemoryEnabled()) {
        const userMemoryDir = getAutoMemoryDirectory();
        const teamMemoryDir = getTeamMemoryPath();

        await ensureMemoryDirExists(teamMemoryDir);              // CD1()
        recordMemoryDirLoadMetrics(userMemoryDir, { memory_type: "auto" });
        recordMemoryDirLoadMetrics(teamMemoryDir, { memory_type: "team" });

        // Sub-branch: Background agent extraction mode
        if (getFeatureFlag("tengu_passport_quail", false)) {
            return buildExtractModeTypedCombinedPrompt();        // bv9
        }
        // Sub-branch: File-based format
        if (useFileBasedFormat) {
            return buildTypedCombinedMemoryPrompt();
        }
        // Default: Standard combined prompt
        return buildCombinedMemoryPrompt();
    }

    // BRANCH 2: Single Memory Mode
    if (isEnabled) {
        const memoryDir = getAutoMemoryDirectory();
        await ensureMemoryDirExists(memoryDir);                   // CD1()
        recordMemoryDirLoadMetrics(memoryDir, { memory_type: "auto" });

        // Sub-branch: Background agent mode
        if (getFeatureFlag("tengu_passport_quail", false)) {
            return buildBackgroundAgentMemoryPrompt("auto memory", memoryDir);  // xv9
        }
        // Sub-branch: File-based format
        if (useFileBasedFormat) {
            return buildMemoryIndex("auto memory", memoryDir);   // U14
        }
        // Default: Simple prompt
        return buildAutoMemoryPromptSimple();                    // uv9
    }

    // BRANCH 3: Memory Disabled
    recordTelemetry("tengu_memdir_disabled", {
        disabled_by_env_var: isTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
        disabled_by_setting: !isTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) &&
                             getUserSettings().autoMemoryEnabled === false
    });

    if (getFeatureFlag("tengu_herring_clock", false)) {
        recordTelemetry("tengu_team_memdir_disabled", {});
    }

    return null;
}

// Mapping:
// ID1 → getAutoMemory
// Z3 → isAutoMemoryEnabled
// w8 → getFeatureFlag
// uH → getAutoMemoryDirectory
// CD1 → ensureMemoryDirExists
// DF6 → recordMemoryDirLoadMetrics
// xv9 → buildBackgroundAgentMemoryPrompt
// U14 → buildMemoryIndex
// uv9 → buildAutoMemoryPromptSimple
// d → recordTelemetry
// t6 → isTruthy
// mA → getUserSettings
```

### 1.2 Algorithm Analysis

**Complexity**: O(1) - Constant time decision tree

**Decision Matrix**:

| Condition | Result Function | Prompt Type |
|-----------|-----------------|-------------|
| Team + Background | `bv9` | Extract mode, combined |
| Team + File-based | `buildTypedCombinedMemoryPrompt` | File-based, combined |
| Team + Default | `buildCombinedMemoryPrompt` | Standard, combined |
| Single + Background | `xv9` | Restricted mode |
| Single + File-based | `U14` | File-based index |
| Single + Default | `uv9` | Simple prompt |
| Disabled | `null` | No memory |

**Why this approach**:
- **Feature flag driven**: Enables A/B testing and gradual rollout
- **Fail-safe**: Returns `null` cleanly when disabled
- **Telemetry integrated**: Every path logs appropriate metrics

### 1.3 Edge Cases

| Edge Case | Handling |
|-----------|----------|
| Directory creation fails | Silent catch in `CD1`, continues |
| Team memory flag but no team dir | Uses default user memory |
| All flags disabled | Returns simple prompt (`uv9`) |
| Feature flags not loaded | Uses default values (`false`) |

---

## 2. Semantic Memory Search Algorithm (a4q, AuY, quY)

### 2.1 Overview

**What it does**: Uses an LLM to semantically select relevant memory files based on user query.

**Key insight**: Instead of keyword matching, the system uses a fast LLM to understand the semantic relationship between the query and memory file metadata.

### 2.2 Phase 1: File Discovery and Ranking (AuY)

**Source Code**: chunks.146.mjs:2784-2819

```javascript
// ============================================
// listAndRankMemoryFiles - Discover and rank memory files
// Location: chunks.146.mjs:2784-2819
// ============================================

// ORIGINAL (for source lookup):
async function AuY(A, q) {
    try {
        let Y = (await nxY(A, { recursive: !0 }))
            .filter((O) => O.endsWith(".md") && axY(O) !== "MEMORY.md"),
            _ = (await Promise.allSettled(Y.map(async (O) => {
                let $ = oxY(A, O), H = await rxY($);
                return { relativePath: O, filePath: $, mtimeMs: H.mtimeMs }
            })))
            .filter((O) => O.status === "fulfilled")
            .map((O) => O.value)
            .sort((O, $) => $.mtimeMs - O.mtimeMs)
            .slice(0, sxY);
        return (await Promise.allSettled(_.map(async ({ relativePath: O, filePath: $, mtimeMs: H }) => {
            let { content: j } = await h36($, 0, txY, void 0, q),
                { frontmatter: J } = BH(j, $);
            return {
                filename: O,
                filePath: $,
                mtimeMs: H,
                description: J.description || null,
                type: S14(J.type)
            }
        })))
        .filter((O) => O.status === "fulfilled")
        .map((O) => O.value)
    } catch {
        return []
    }
}

// READABLE (for understanding):
async function listAndRankMemoryFiles(memoryDir, abortSignal) {
    try {
        // Step 1: Recursively list all files
        const allFiles = await recursiveReaddir(memoryDir, { recursive: true });

        // Step 2: Filter to .md files, exclude MEMORY.md
        const mdFiles = allFiles.filter(
            (file) => file.endsWith(".md") && path.basename(file) !== "MEMORY.md"
        );

        // Step 3: Get file stats in parallel (with error tolerance)
        const fileStats = await Promise.allSettled(
            mdFiles.map(async (file) => {
                const fullPath = path.join(memoryDir, file);
                const stat = await fs.stat(fullPath);
                return {
                    relativePath: file,
                    filePath: fullPath,
                    mtimeMs: stat.mtimeMs
                };
            })
        );

        // Step 4: Sort by modification time (newest first) and limit
        const sortedFiles = fileStats
            .filter((result) => result.status === "fulfilled")
            .map((result) => result.value)
            .sort((a, b) => b.mtimeMs - a.mtimeMs)
            .slice(0, MAX_FILES_TO_CONSIDER);  // 200

        // Step 5: Extract metadata from each file
        const filesWithMetadata = await Promise.allSettled(
            sortedFiles.map(async (file) => {
                // Read first 30 lines for frontmatter
                const { content } = await readFileWithLimit(
                    file.filePath, 0, PREVIEW_LINES, undefined, abortSignal
                );
                const { frontmatter } = parseFrontmatter(content, file.filePath);
                return {
                    filename: file.relativePath,
                    filePath: file.filePath,
                    mtimeMs: file.mtimeMs,
                    description: frontmatter.description || null,
                    type: parseMemoryType(frontmatter.type)
                };
            })
        );

        return filesWithMetadata
            .filter((result) => result.status === "fulfilled")
            .map((result) => result.value);

    } catch {
        return [];  // Graceful degradation
    }
}

// Mapping:
// AuY → listAndRankMemoryFiles
// nxY → recursiveReaddir
// axY → path.basename
// oxY → path.join
// rxY → fs.stat
// h36 → readFileWithLimit
// BH → parseFrontmatter
// S14 → parseMemoryType
// sxY → MAX_FILES_TO_CONSIDER (200)
// txY → PREVIEW_LINES (30)
```

**Algorithm Steps**:

1. **Discovery**: Recursive scan, filter to `.md` files
2. **Sorting**: By modification time (newest first)
3. **Limiting**: Cap at 200 files
4. **Metadata Extraction**: Parse frontmatter for description and type

**Why sort by mtime?**
- Recently modified files are more likely relevant
- Simple heuristic with O(n log n) complexity
- No complex indexing required

### 2.3 Phase 2: LLM Selection (quY)

**Source Code**: chunks.146.mjs:2821-2868

```javascript
// ============================================
// selectMemoriesWithLLM - Use LLM for semantic selection
// Location: chunks.146.mjs:2821-2868
// ============================================

// ORIGINAL (for source lookup):
async function quY(A, q, K, Y) {
    let z = new Set(q.map((O) => O.filename)),
        _ = q.map((O) => {
            let $ = O.type ? `[${O.type}] ` : "",
                H = new Date(O.mtimeMs).toISOString();
            return O.description
                ? `- ${$}${O.filename} (${H}): ${O.description}`
                : `- ${$}${O.filename} (${H})`
        }).join("\n"),
        w = Y.length > 0 ? "\n\nRecently used tools: ${Y.join(", ")}" : "";
    try {
        let $ = (await _h({
            model: Ef(),
            system: exY,
            skipSystemPromptPrefix: !0,
            messages: [{
                role: "user",
                content: `Query: ${A}\n\nAvailable memories:\n${_}${w}`
            }],
            max_tokens: 256,
            output_format: {
                type: "json_schema",
                schema: {
                    type: "object",
                    properties: {
                        selected_memories: {
                            type: "array",
                            items: { type: "string" }
                        }
                    },
                    required: ["selected_memories"],
                    additionalProperties: !1
                }
            },
            signal: K
        })).content.find((j) => j.type === "text");
        if (!$ || $.type !== "text") return [];
        return i1($.text).selected_memories.filter((j) => z.has(j))
    } catch {
        return []
    }
}

// READABLE (for understanding):
async function selectMemoriesWithLLM(searchText, memoryFiles, abortSignal, toolContext) {
    // Step 1: Build validation set for response verification
    const validFilenames = new Set(memoryFiles.map((f) => f.filename));

    // Step 2: Format file list with metadata
    const fileList = memoryFiles.map((file) => {
        const typePrefix = file.type ? `[${file.type}] ` : "";
        const timestamp = new Date(file.mtimeMs).toISOString();
        return file.description
            ? `- ${typePrefix}${file.filename} (${timestamp}): ${file.description}`
            : `- ${typePrefix}${file.filename} (${timestamp})`;
    }).join("\n");

    // Step 3: Add tool context hint
    const toolContextNote = toolContext.length > 0
        ? `\n\nRecently used tools: ${toolContext.join(", ")}`
        : "";

    try {
        // Step 4: Call fast model with structured output
        const response = await callLLM({
            model: getFastModel(),           // Ef() - likely Haiku
            system: MEMORY_SELECTION_PROMPT,  // exY constant
            skipSystemPromptPrefix: true,
            messages: [{
                role: "user",
                content: `Query: ${searchText}\n\nAvailable memories:\n${fileList}${toolContextNote}`
            }],
            max_tokens: 256,
            output_format: {
                type: "json_schema",
                schema: {
                    type: "object",
                    properties: {
                        selected_memories: {
                            type: "array",
                            items: { type: "string" }
                        }
                    },
                    required: ["selected_memories"],
                    additionalProperties: false
                }
            },
            signal: abortSignal
        });

        // Step 5: Parse and validate response
        const textContent = response.content.find((c) => c.type === "text");
        if (!textContent || textContent.type !== "text") return [];

        return parseJSON(textContent.text).selected_memories.filter(
            (filename) => validFilenames.has(filename)
        );

    } catch {
        return [];  // Graceful degradation
    }
}

// Mapping:
// quY → selectMemoriesWithLLM
// _h → callLLM
// Ef → getFastModel
// exY → MEMORY_SELECTION_PROMPT
// i1 → parseJSON
```

**Why use LLM for selection?**

| Aspect | Keyword Search | LLM Selection |
|--------|---------------|---------------|
| Semantic understanding | ❌ | ✅ |
| Cross-topic relevance | ❌ | ✅ |
| Context awareness | ❌ | ✅ (tool context) |
| Description-aware | ❌ | ✅ |
| Latency | ~10ms | ~1-2s |
| Cost | Free | Small |

**Design trade-off**: Accepts ~1-2s latency for semantic understanding.

### 2.4 LLM Selection Prompt (exY)

**Source Code**: chunks.146.mjs:2874-2880

```javascript
exY = `You are selecting memories that will be useful to Claude Code as it processes a user's query. You will be given the user's query and a list of available memory files with their filenames and descriptions.

Return a list of filenames for the memories that will clearly be useful to Claude Code as it processes the user's query (up to 5). Only include memories that you are certain will be helpful based on their name and description.
- If you are unsure if a memory will be useful in processing the user's query, then do not include it in your list. Be selective and discerning.
- If there are no memories in the list that would clearly be useful, feel free to return an empty list.
- If a list of recently-used tools is provided, do not select memories that are usage reference or API documentation for those tools (Claude Code is already exercising them). DO still select memories containing warnings, gotchas, or known issues about those tools — active use is exactly when those matter.
`
```

**Key instructions**:
1. **Maximum 5** - Limit to prevent context bloat
2. **Selectivity** - "Only include memories you are certain will be helpful"
3. **Empty list allowed** - Don't force selection
4. **Tool context awareness** - Don't select docs for tools already in use, DO select warnings

---

## 3. Staleness Detection Algorithm (dJ7, cJ7, Cz8)

### 3.1 Overview

**What it does**: Calculates memory age and generates warnings for stale content.

**Key insight**: Memories are point-in-time observations that may become outdated. Staleness warnings help agents verify before asserting facts.

### 3.2 Implementation

**Source Code**: chunks.50.mjs:2476-2498

```javascript
// ============================================
// Staleness Detection Functions
// Location: chunks.50.mjs:2476-2498
// ============================================

// ORIGINAL (for source lookup):
function dJ7(A) {
    return Math.max(0, Math.floor((Date.now() - A) / 86400000))
}
function cJ7(A) {
    let q = dJ7(A);
    if (q === 0) return "today";
    if (q === 1) return "yesterday";
    return `${q} days ago`
}
function Cz8(A) {
    let q = dJ7(A);
    if (q <= 1) return "";
    return `This memory is ${q} days old. ` +
        "Memories are point-in-time observations, not live state — " +
        "claims about code behavior or file:line citations may be outdated. " +
        "Verify against current code before asserting as fact."
}
function lJ7(A) {
    let q = Cz8(A);
    if (!q) return "";
    return `<system-reminder>${q}</system-reminder>\n`
}

// READABLE (for understanding):
function getDaysSinceTimestamp(timestamp) {
    return Math.max(0, Math.floor((Date.now() - timestamp) / 86400000));
}

function formatRelativeTime(timestamp) {
    const days = getDaysSinceTimestamp(timestamp);
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    return `${days} days ago`;
}

function buildStalenessWarning(timestamp) {
    const days = getDaysSinceTimestamp(timestamp);
    if (days <= 1) return "";  // Fresh - no warning

    return `This memory is ${days} days old. ` +
           "Memories are point-in-time observations, not live state — " +
           "claims about code behavior or file:line citations may be outdated. " +
           "Verify against current code before asserting as fact.";
}

function formatStalenessReminder(timestamp) {
    const warning = buildStalenessWarning(timestamp);
    if (!warning) return "";
    return `<system-reminder>${warning}</system-reminder>\n`;
}

// Mapping:
// dJ7 → getDaysSinceTimestamp
// cJ7 → formatRelativeTime
// Cz8 → buildStalenessWarning
// lJ7 → formatStalenessReminder
```

### 3.3 Algorithm Analysis

**Complexity**: O(1) - Simple arithmetic

**Warning Threshold**: Only warns if > 1 day old

**Why 1 day threshold?**
- Fresh memories (< 1 day) likely still accurate
- Avoids noise for recently updated content
- Balances helpfulness vs annoyance

### 3.4 Integration with System Reminders

```
Memory file loaded
    │
    ├── Get mtimeMs from file stat
    │
    ├── Call buildStalenessWarning(mtimeMs)
    │   │
    │   ├── If days <= 1: Return ""
    │   └── If days > 1: Return warning message
    │
    ├── In normalizeAttachmentForAPI:
    │   │
    │   ├── If warning exists: Prepend warning to content
    │   └── Use formatRelativeTime for "today"/"yesterday"/"N days ago"
    │
    └── Wrap in <system-reminder> tags
```

**Output Examples**:

Fresh memory (0-1 days):
```xml
<system-reminder>
Memory (saved today): /path/to/file.md:

# Content here
</system-reminder>
```

Stale memory (> 1 day):
```xml
<system-reminder>
This memory is 5 days old. Memories are point-in-time observations, not live state — claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact.

Memory: /path/to/file.md:

# Content here
</system-reminder>
```

---

## 4. Enable/Disable Priority Chain (Z3)

### 4.1 Overview

**What it does**: Determines if auto memory is enabled using a 5-level priority chain.

### 4.2 Implementation

**Source Code**: chunks.50.mjs:2401-2409

```javascript
// ============================================
// isAutoMemoryEnabled - 5-level priority chain
// Location: chunks.50.mjs:2401-2409
// ============================================

// ORIGINAL (for source lookup):
function Z3() {
    let A = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;
    if (t6(A)) return !1;                         // Priority 1: Explicit disable
    if (xz(A)) return !0;                         // Priority 2: Explicit enable
    if (t6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR)
        return !1;                                // Priority 3: Remote without dir
    let q = mA();
    if (q.autoMemoryEnabled !== void 0)
        return q.autoMemoryEnabled;               // Priority 4: User setting
    return !0                                     // Priority 5: Default enabled
}

// READABLE (for understanding):
function isAutoMemoryEnabled() {
    const disableEnvVar = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;

    // Priority 1: Explicit disable via env var (truthy: "1", "true", "yes")
    if (isTruthy(disableEnvVar)) return false;

    // Priority 2: Explicit enable via env var (falsy non-empty: "0", "false")
    if (isFalsy(disableEnvVar)) return true;

    // Priority 3: Remote mode requires memory directory
    if (isTruthy(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return false;
    }

    // Priority 4: User setting
    const settings = getUserSettings();
    if (settings.autoMemoryEnabled !== undefined) {
        return settings.autoMemoryEnabled;
    }

    // Priority 5: Default to enabled
    return true;
}

// Mapping:
// Z3 → isAutoMemoryEnabled
// t6 → isTruthy
// xz → isFalsy
// mA → getUserSettings
```

### 4.3 Priority Matrix

| Priority | Check | Result | Use Case |
|----------|-------|--------|----------|
| 1 | `DISABLE_AUTO_MEMORY=1` | Disabled | CI/CD, testing |
| 2 | `DISABLE_AUTO_MEMORY=0` | Enabled | Override |
| 3 | Remote + no dir | Disabled | Safety measure |
| 4 | User setting | Per setting | User preference |
| 5 | Default | Enabled | Normal operation |

**Why this priority?**
1. **Env var highest** - Enables enterprise control, CI/CD override
2. **Remote safety** - Prevents errors in distributed setups
3. **User setting** - Persists across sessions
4. **Default enabled** - Best default for new users

---

## 5. Memory Extraction Prompt Selection

### 5.1 Overview

**What it does**: Selects the appropriate extraction prompt based on memory mode and format.

### 5.2 Decision Matrix

```
                    isTeamMemoryEnabled()?
                           │
              ┌────────────┴────────────┐
              │ YES                     │ NO
              ▼                         ▼
     tengu_swinburne_dune?       tengu_swinburne_dune?
              │                          │
       ┌──────┴──────┐            ┌──────┴──────┐
       │YES          │NO          │YES          │NO
       ▼             ▼            ▼             ▼
    ┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐
    │ WKq  │     │ PKq  │     │ XKq  │     │ DKq  │
    │Team+ │     │Team  │     │File- │     │Standard
    │File  │     │Standard   │Based │     │Format
    └──────┘     └──────┘     └──────┘     └──────┘
```

### 5.3 Prompt Content Differences

| Prompt | Team Support | File-Based | Key Difference |
|--------|-------------|------------|----------------|
| `DKq` | No | No | Standard extraction |
| `XKq` | No | Yes | Two-step save with frontmatter |
| `PKq` | Yes | No | User vs team memory guidance |
| `WKq` | Yes | Yes | Combined: team + frontmatter |

---

## Summary

### Algorithm Complexity Summary

| Algorithm | Complexity | Typical Time | Timeout |
|-----------|------------|--------------|---------|
| Prompt Selection (ID1) | O(1) | <1ms | None |
| Enable Check (Z3) | O(1) | <1ms | None |
| Staleness (dJ7) | O(1) | <1ms | None |
| File Discovery (AuY) | O(n) | ~100ms | Inherited |
| LLM Selection (quY) | O(n) | 1-2s | 5s total |
| Total Search (a4q) | O(n log n) | ~2s | 5s |

### Key Design Decisions

1. **LLM for semantic search** - Trade latency for understanding
2. **200-line limit** - Predictable context usage
3. **1-day staleness threshold** - Balance warning vs noise
4. **5-level priority chain** - Enterprise control + user preference
5. **Feature flag driven** - A/B testing + gradual rollout

---

## 6. Combined Prompt Selection Algorithm

### 6.1 Overview

**What it does**: Selects the appropriate combined memory prompt format based on feature flags when team memory is enabled.

**Key insight**: The system has three combined prompt variants for team memory, each optimized for different use cases.

### 6.2 Decision Tree with Combined Prompts

```
                    isTeamMemoryEnabled()?
                            │
                ┌───────────┴───────────┐
                │ YES                    │ NO
                ▼                        ▼
        tengu_passport_quail?      tengu_passport_quail?
                │                         │
         ┌──────┴──────┐           ┌──────┴──────┐
         │YES          │NO         │YES          │NO
         ▼             ▼           ▼             ▼
      ┌──────┐     tengu_      ┌──────┐     tengu_
      │ bv9  │   swinburne?    │ xv9  │   swinburne?
      │Extract│     │          │BgAgent    │
      └──────┘  ┌────┴────┐    └──────┘  ┌────┴────┐
                │YES      │NO             │YES      │NO
                ▼         ▼               ▼         ▼
            ┌──────┐  ┌──────┐       ┌──────┐  ┌──────┐
            │ Iv9  │  │ Cv9  │       │ U14  │  │ uv9  │
            │Typed │  │Std   │       │Index │  │Simple│
            └──────┘  └──────┘       └──────┘  └──────┘
```

### 6.3 Combined Prompt Analysis

#### buildCombinedMemoryPrompt (Cv9)

**Source Code**: chunks.84.mjs:230-235

```javascript
// ============================================
// buildCombinedMemoryPrompt - Standard dual-memory prompt
// Location: chunks.84.mjs:230-235
// ============================================

// ORIGINAL (for source lookup):
function Cv9() {
    let A = uH(), q = Lk();
    return ["# Memory", "", `You have two persistent memory systems. ${pf8}`, "",
        `1. **User memory** at \`${A}\` — private between you and the user`,
        `2. **Team memory** at \`${q}\` — shared with all users in the same organization`,
        // ... extensive content ...
        ...Dt(A)
    ].join("\n")
}

// READABLE (for understanding):
function buildCombinedMemoryPrompt() {
    const userMemoryDir = getAutoMemoryDirectory();
    const teamMemoryDir = getTeamMemoryDirectory();

    return [
        "# Memory",
        "",
        `You have two persistent memory systems. ${DUAL_MEMORY_DIR_EXISTS_HINT}`,
        "",
        `1. **User memory** at \`${userMemoryDir}\` — private`,
        `2. **Team memory** at \`${teamMemoryDir}\` — shared`,
        "",
        // ... extensive guidance ...
        ...buildSearchContextSection(userMemoryDir)
    ].join("\n");
}

// Mapping: Cv9 → buildCombinedMemoryPrompt, uH → getAutoMemoryDirectory,
//          Lk → getTeamMemoryDirectory, pf8 → DUAL_MEMORY_DIR_EXISTS_HINT
```

**Characteristics:**
- Standard format for team memory
- Direct write to MEMORY.md allowed
- No frontmatter required
- Simpler for users to manage

#### buildTypedCombinedMemoryPrompt (Iv9)

**Source Code**: chunks.84.mjs:237-242

```javascript
// ============================================
// buildTypedCombinedMemoryPrompt - File-based with frontmatter
// Location: chunks.84.mjs:237-242
// ============================================

// ORIGINAL (for source lookup):
function Iv9() {
    let A = uH(), q = Lk();
    return ["# Memory", "",
        `You have a persistent, file-based memory system...`,
        ...LD1, ..._36, "- You MUST avoid saving sensitive data...",
        ...w36, // Frontmatter template
        ...Dt(A)
    ].join("\n")
}

// Mapping: Iv9 → buildTypedCombinedMemoryPrompt, LD1 → TEAM_SCOPE_DEFINITIONS,
//          _36 → MEMORY_DONT_SAVE_SECTION, w36 → FRONTMATTER_TEMPLATE
```

**Characteristics:**
- Two-step save process (frontmatter file + MEMORY.md index)
- Includes TEAM_SCOPE_DEFINITIONS (LD1)
- Structured memory organization
- Type metadata for semantic search

#### buildExtractModeTypedCombinedPrompt (bv9)

**Source Code**: chunks.84.mjs:244-251

```javascript
// ============================================
// buildExtractModeTypedCombinedPrompt - Background agent mode
// Location: chunks.84.mjs:244-251
// ============================================

// ORIGINAL (for source lookup):
function bv9() {
    {
        let A = uH(), q = Lk();
        return ["# Memory", "",
            `You have a persistent, file-based memory system...`,
            "",
            "**You should not write to memory files yourself.**",
            "A background agent automatically extracts and saves memories...",
            ...Dt(A)
        ].join("\n")
    }
    return ""
}

// Mapping: bv9 → buildExtractModeTypedCombinedPrompt
```

**Characteristics:**
- Read-only memory for main agent
- Background extraction subagent handles saves
- Simplified prompt (no save instructions)
- Used when `tengu_passport_quail` is enabled

### 6.4 Feature Flag Combination Matrix

| tengu_herring_clock | tengu_passport_quail | tengu_swinburne_dune | Prompt |
|---------------------|----------------------|----------------------|--------|
| ✓ (team enabled) | ✓ | * | `bv9` |
| ✓ | ✗ | ✓ | `Iv9` |
| ✓ | ✗ | ✗ | `Cv9` |
| ✗ | ✓ | * | `xv9` |
| ✗ | ✗ | ✓ | `U14` |
| ✗ | ✗ | ✗ | `uv9` |

**Feature flag purposes:**
- `tengu_herring_clock`: Enables team memory (dual directories)
- `tengu_passport_quail`: Background agent extraction mode
- `tengu_swinburne_dune`: File-based format with frontmatter

---

## 7. Directory Resolution Algorithm (uH, Ma, gG3)

### 6.1 Overview

**What it does**: Resolves the memory directory path based on settings, environment variables, and current context.

**Key insight**: Uses lazy evaluation to cache the result and avoid recomputing on every access.

### 6.2 Implementation

**Source Code**: chunks.50.mjs:2411-2473

```javascript
// ============================================
// Directory Resolution Functions
// Location: chunks.50.mjs:2411-2473
// ============================================

// ORIGINAL (for source lookup):
function Ma() {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    return c8()
}

// Lazy evaluation wrapper for uH
// uH is defined via e1() memoization helper

// READABLE (for understanding):
function getHomeDirectory() {
    // Remote memory directory takes precedence
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    }
    return getLocalHomeDirectory();  // ~/.claude/
}

function getAutoMemoryDirectory() {
    // Lazy evaluation - computed once per context change
    const homeDir = getHomeDirectory();
    const customDir = getCustomMemoryDirectory();

    if (customDir) {
        return normalizePath(customDir);
    }

    const contextPath = getCurrentContextPath();
    const projectHash = hashPath(contextPath);

    return normalizePath(path.join(homeDir, "projects", projectHash, "memory"));
}

// Mapping:
// Ma → getHomeDirectory
// uH → getAutoMemoryDirectory (lazy via e1())
// gG3 → getCustomMemoryDirectory
// FG3 → getCurrentContextPath
// BD → hashPath
// Sz8 → normalizePath
```

### 6.3 Resolution Priority

```
1. Custom Directory (autoMemoryDirectory setting)
        │
        ├── If set: Use custom path
        │
        └── If not set:
                │
                ▼
2. Remote Memory Directory (CLAUDE_CODE_REMOTE_MEMORY_DIR)
        │
        ├── If set: Use remote path
        │
        └── If not set:
                │
                ▼
3. Local Home Directory
        │
        └── ~/.claude/projects/{hash}/memory/
```

### 6.4 Path Hashing

The project hash is computed from the current working directory:

```javascript
function hashPath(contextPath) {
    // Creates a consistent hash for the project
    // Example: /Users/user/project → "a1b2c3d4"
    return crypto.createHash('sha256')
        .update(contextPath)
        .digest('hex')
        .slice(0, 16);
}
```

**Why hashing:**
- Unique per project
- Safe for filesystem (no special characters)
- Consistent across sessions

---

## 7. Frontmatter Processing Algorithm (dv9, BH)

### 7.1 Overview

**What it does**: Extracts YAML frontmatter from memory files and processes path filters.

### 7.2 Implementation

**Source Code**: chunks.84.mjs:449-467

```javascript
// ============================================
// extractFrontmatterPaths - Extract paths from frontmatter
// Location: chunks.84.mjs:449-467
// ============================================

// ORIGINAL (for source lookup):
function dv9(A) {
    let { frontmatter: q, content: K } = BH(A);
    if (!q.paths) return { content: K };
    let Y = sz1(q.paths).map((z) => {
        return z.endsWith("/**") ? z.slice(0, -3) : z
    }).filter((z) => z.length > 0);
    if (Y.length === 0 || Y.every((z) => z === "**")) return { content: K };
    return { content: K, paths: Y }
}

// READABLE (for understanding):
function extractFrontmatterPaths(content) {
    // Step 1: Parse frontmatter
    const { frontmatter, content: bodyContent } = parseFrontmatter(content);

    // Step 2: Check if paths are defined
    if (!frontmatter.paths) {
        return { content: bodyContent };
    }

    // Step 3: Process path patterns
    const processedPaths = ensureArray(frontmatter.paths)
        .map((path) => {
            // Strip /** suffix (glob pattern)
            return path.endsWith("/**") ? path.slice(0, -3) : path;
        })
        .filter((path) => path.length > 0);

    // Step 4: Handle catch-all patterns
    if (processedPaths.length === 0 || processedPaths.every((p) => p === "**")) {
        return { content: bodyContent };  // No filtering needed
    }

    return { content: bodyContent, paths: processedPaths };
}

// Mapping:
// dv9 → extractFrontmatterPaths
// BH → parseFrontmatter
// sz1 → ensureArray
```

### 7.3 Path Processing Rules

| Input Pattern | Output | Use Case |
|---------------|--------|----------|
| `./src/**` | `./src` | All files under src |
| `./lib` | `./lib` | Specific directory |
| `**` | (removed) | Catch-all - no filtering |
| `` (empty) | (filtered out) | Invalid pattern |

### 7.4 Frontmatter Example

```markdown
---
name: api-patterns
description: API design patterns for this project
type: project
paths:
  - ./src/api/**
  - ./lib/services/**
---

# API Patterns

All API endpoints follow RESTful conventions...
```

**Processing result:**
```javascript
{
    content: "# API Patterns\n\nAll API endpoints follow RESTful conventions...",
    paths: ["./src/api", "./lib/services"]
}
```

---

## 8. HTML Comment Stripping Algorithm (o14)

### 8.1 Overview

**What it does**: Removes HTML comments from memory content while preserving other content.

### 8.2 Implementation

**Source Code**: chunks.84.mjs:469-493

```javascript
// ============================================
// stripHtmlComments - Remove HTML comments from markdown
// Location: chunks.84.mjs:469-493
// ============================================

// ORIGINAL (for source lookup):
function o14(A) {
    if (!A.includes("<!--")) return { content: A, stripped: !1 };
    let q = new tW().lex(A), K = "", Y = !1, z = /<!--[\s\S]*?-->/g;
    for (let _ of q) {
        if (_.type === "html") {
            let w = _.raw.trimStart();
            if (w.startsWith("<!--") && w.includes("-->")) {
                let O = _.raw.replace(z, "");
                if (Y = !0, O.trim().length > 0) K += O;
                continue
            }
        }
        K += _.raw
    }
    return { content: K, stripped: Y }
}

// READABLE (for understanding):
function stripHtmlComments(content) {
    // Quick check - no comments
    if (!content.includes("<!--")) {
        return { content: content, stripped: false };
    }

    // Parse markdown into tokens
    const lexer = new MarkdownLexer();
    const tokens = lexer.lex(content);

    let result = "";
    let wasStripped = false;
    const commentPattern = /<!--[\s\S]*?-->/g;

    for (const token of tokens) {
        if (token.type === "html") {
            const trimmed = token.raw.trimStart();

            // Check if this is a comment block
            if (trimmed.startsWith("<!--") && trimmed.includes("-->")) {
                // Remove comments but keep any remaining content
                const withoutComments = token.raw.replace(commentPattern, "");
                wasStripped = true;

                if (withoutComments.trim().length > 0) {
                    result += withoutComments;
                }
                continue;
            }
        }
        // Keep non-comment tokens unchanged
        result += token.raw;
    }

    return { content: result, stripped: wasStripped };
}

// Mapping:
// o14 → stripHtmlComments
// tW → MarkdownLexer
```

### 8.3 Why Strip HTML Comments?

**Use case**: Memory authors can leave private notes that won't be shown to the LLM:

```markdown
# Project Conventions

<!-- TODO: Update this when API changes -->
<!-- Last reviewed: 2024-01-15 -->
<!-- Private note: This is work in progress -->

Use TypeScript for all new files.
```

**After stripping:**
```markdown
# Project Conventions

Use TypeScript for all new files.
```

### 8.4 Edge Cases

| Input | Output | Reason |
|-------|--------|--------|
| No comments | Original content | Quick exit |
| `<!-- comment -->` | `` | Pure comment removed |
| `<!-- c1 --><!-- c2 -->` | `` | Multiple comments |
| `text <!-- c --> more` | `text  more` | Comment in middle |
| `<div>HTML</div>` | `<div>HTML</div>` | Non-comment HTML preserved |

---

## 9. Attachment Normalization Algorithm (Ui8)

### 9.1 Overview

**What it does**: Transforms memory attachment objects into LLM API message format.

### 9.2 Memory Case Handling

**Source Code**: chunks.174.mjs:172-184

```javascript
// ============================================
// relevant_memories case - Normalize memory files with staleness
// Location: chunks.174.mjs:172-184
// ============================================

// ORIGINAL (for source lookup):
case "relevant_memories":
    return b5(A.memories.map((K) => {
        let Y = Cz8(K.mtimeMs),
            z = Y ? `${Y}\n\nMemory: ${K.path}:` : `Memory (saved ${cJ7(K.mtimeMs)}): ${K.path}:`;
        return p1({
            content: `${z}\n\n${K.content}`,
            isMeta: !0
        })
    }));

// READABLE (for understanding):
case "relevant_memories":
    return wrapWithSystemReminderTags(
        attachment.memories.map((memory) => {
            // Step 1: Check staleness (> 1 day old)
            const stalenessWarning = buildStalenessWarning(memory.mtimeMs);

            // Step 2: Format header with or without warning
            const header = stalenessWarning
                ? `${stalenessWarning}\n\nMemory: ${memory.path}:`
                : `Memory (saved ${formatRelativeTime(memory.mtimeMs)}): ${memory.path}:`;

            // Step 3: Create meta message with header + content
            return createUserMessage({
                content: `${header}\n\n${memory.content}`,
                isMeta: true  // Hidden from user UI
            });
        })
    );

// Mapping:
// b5 → wrapWithSystemReminderTags
// Cz8 → buildStalenessWarning
// cJ7 → formatRelativeTime
// p1 → createUserMessage
```

### 9.3 Normalization Flow

```
Memory Attachment Input
{ type: "relevant_memories", memories: [...] }
        │
        ▼
┌───────────────────────────────────────┐
│ For each memory:                      │
│                                       │
│ 1. Get mtimeMs from file stat         │
│ 2. Build staleness warning (if > 1d)  │
│ 3. Format header with timestamp       │
│ 4. Create user message with isMeta    │
│                                       │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│ wrapWithSystemReminderTags:           │
│                                       │
│ <system-reminder>                     │
│ Memory (saved today): /path/to/file:  │
│                                       │
│ # Content here                        │
│ </system-reminder>                    │
└───────────────────────────────────────┘
        │
        ▼
API Message Array
[{ role: "user", content: "...", isMeta: true }]
```

---

## Summary

### Complete Algorithm List

| Algorithm | Function(s) | Location | Complexity |
|-----------|-------------|----------|------------|
| Prompt Selection | `ID1` | chunks.84.mjs:382 | O(1) |
| Enable Check | `Z3` | chunks.50.mjs:2401 | O(1) |
| Staleness Detection | `dJ7`, `cJ7`, `Cz8` | chunks.50.mjs:2476 | O(1) |
| Directory Resolution | `uH`, `Ma` | chunks.50.mjs:2411 | O(1) |
| File Discovery | `AuY` | chunks.146.mjs:2784 | O(n log n) |
| LLM Selection | `quY` | chunks.146.mjs:2821 | O(n) |
| Frontmatter Processing | `dv9` | chunks.84.mjs:449 | O(n) |
| Comment Stripping | `o14` | chunks.84.mjs:469 | O(n) |
| Attachment Normalization | `Ui8` | chunks.174.mjs:3 | O(n) |

### Design Principles

1. **Fail-safe defaults** - Return null/empty on errors
2. **Lazy evaluation** - Cache computed values
3. **Graceful degradation** - Continue with partial data
4. **Feature flag control** - Enable A/B testing
5. **Telemetry integration** - Track usage and errors