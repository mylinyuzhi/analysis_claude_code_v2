# Auto Memory: Comprehensive Algorithm Analysis

## Overview

This document provides source-level analysis of the key algorithms in the Auto Memory system. Each algorithm is analyzed with:
- Complete ORIGINAL (obfuscated) and READABLE (deobfuscated) code
- Step-by-step logic explanation
- Decision trees and flow diagrams
- Edge cases and error handling

**Version**: Claude Code v2.1.76
**Verified**: 2026-03-21 - All symbols cross-validated against source code

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

---

## 1. Memory Prompt Selection Algorithm (ID1)

### 1.1 Complete Source Code

```javascript
// ============================================
// getAutoMemory - Main async entry point for memory prompt selection
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
    // Check if auto memory is enabled
    const isEnabled = isAutoMemoryEnabled();
    const useFileBasedFormat = getFeatureFlag("tengu_swinburne_dune", false);

    // Branch 1: Team memory enabled (dual memory system)
    if (isTeamMemoryEnabled()) {
        const userMemoryDir = getAutoMemoryDirectory();
        const teamMemoryDir = getTeamMemoryPath();

        // Ensure both directories exist
        await ensureMemoryDirExists(teamMemoryDir);

        // Record telemetry for both directories
        recordMemoryDirLoadMetrics(userMemoryDir, { memory_type: "auto" });
        recordMemoryDirLoadMetrics(teamMemoryDir, { memory_type: "team" });

        // Return appropriate prompt format based on flags
        if (getFeatureFlag("tengu_passport_quail", false)) {
            return buildExtractModeTypedCombinedPrompt(); // Background agent mode
        }
        if (useFileBasedFormat) {
            return buildTypedCombinedMemoryPrompt(); // File-based format
        }
        return buildCombinedMemoryPrompt(); // Default dual prompt
    }

    // Branch 2: Single memory (auto memory only)
    if (isEnabled) {
        const memoryDir = getAutoMemoryDirectory();
        await ensureMemoryDirExists(memoryDir);
        recordMemoryDirLoadMetrics(memoryDir, { memory_type: "auto" });

        // Return appropriate format
        if (getFeatureFlag("tengu_passport_quail", false)) {
            return buildBackgroundAgentMemoryPrompt("auto memory", memoryDir);
        }
        if (useFileBasedFormat) {
            return buildMemoryIndex("auto memory", memoryDir);
        }
        return buildAutoMemoryPromptSimple(); // Default simple prompt
    }

    // Branch 3: Memory disabled - log telemetry and return null
    recordTelemetry("tengu_memdir_disabled", {
        disabled_by_env_var: isTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
        disabled_by_setting: !isTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) &&
                             getUserSettings().autoMemoryEnabled === false
    });

    // Also log team memory disabled if flag is set
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
// t6 → isTruthy
// mA → getUserSettings
// d → recordTelemetry
```

### 1.2 Decision Tree

```
                        Entry: getAutoMemory()
                                │
                                ▼
                    ┌───────────────────────┐
                    │ isTeamMemoryEnabled()? │
                    └───────────┬───────────┘
                          │           │
                        YES           NO
                          │           │
                          ▼           ▼
            ┌─────────────────┐   ┌───────────────────┐
            │ Ensure both     │   │ isAutoMemoryEnabled()?
            │ directories exist│   └─────────┬─────────┘
            │ Record telemetry │             │
            └────────┬────────┘           YES │ NO
                     │                        │   │
                     ▼                        ▼   ▼
        ┌────────────────────────┐    ┌──────────┐ ┌──────────────┐
        │ tengu_passport_quail?  │    │ Ensure   │ │ Log disabled │
        └────────────┬───────────┘    │ dir,     │ │ telemetry    │
                     │                │ telemetry│ │ Return null  │
              YES ───┼─── NO          └────┬─────┘ └──────────────┘
               │          │                │
               ▼          ▼                ▼
    ┌──────────────┐ ┌───────────────┐ ┌─────────────────────────┐
    │ bv9: Extract │ │ tengu_swin-   │ │ tengu_passport_quail?   │
    │ Mode Typed   │ │ burne_dune?   │ └────────────┬────────────┘
    │ Combined     │ └───────┬───────┘       YES    │     NO
    └──────────────┘         │                  │         │
                      YES ───┼─── NO            ▼         ▼
                       │          │        ┌─────────┐ ┌────────────┐
                       ▼          ▼        │ xv9:    │ │ tengu_     │
               ┌────────────┐ ┌──────────┐ │Background│ │swinburne_ │
               │ Iv9: Typed │ │ Cv9:     │ │ Agent   │ │dune?       │
               │ Combined   │ │ Combined │ │ Prompt  │ └─────┬──────┘
               └────────────┘ └──────────┘ └─────────┘  YES  │  NO
                                                         │     │
                                                         ▼     ▼
                                                    ┌────────┐ ┌────────┐
                                                    │ U14:   │ │ uv9:   │
                                                    │ Memory │ │ Simple │
                                                    │ Index  │ │ Prompt │
                                                    └────────┘ └────────┘
```

### 1.3 Feature Flag Matrix

| Flag | Effect | Prompt Returned |
|------|--------|-----------------|
| (none) | Default | `uv9` (simple) or `Cv9` (team) |
| `tengu_swinburne_dune` | File-based format | `U14` (single) or `Iv9` (team) |
| `tengu_passport_quail` | Background agent mode | `xv9` (single) or `bv9` (team) |
| `tengu_herring_clock` | Team memory enabled | Enables dual memory |

---

## 2. Enable/Disable Priority Chain (Z3)

### 2.1 Complete Source Code

```javascript
// ============================================
// isAutoMemoryEnabled - 5-level priority chain for memory enablement
// Location: chunks.50.mjs:2401-2409
// ============================================

// ORIGINAL (for source lookup):
function Z3() {
    let A = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;
    if (t6(A)) return !1;
    if (xz(A)) return !0;
    if (t6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return !1;
    let q = mA();
    if (q.autoMemoryEnabled !== void 0) return q.autoMemoryEnabled;
    return !0
}

// READABLE (for understanding):
function isAutoMemoryEnabled() {
    const disableEnvVar = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;

    // Priority 1: Explicit disable via env var (truthy value like "1", "true")
    if (isTruthy(disableEnvVar)) return false;

    // Priority 2: Explicit enable via env var (falsy non-empty like "0", "false")
    if (isFalsy(disableEnvVar)) return true;

    // Priority 3: Remote mode requires memory dir
    if (isTruthy(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return false;  // Remote without memory dir = disable
    }

    // Priority 4: User setting in config
    const settings = getUserSettings();
    if (settings.autoMemoryEnabled !== undefined) {
        return settings.autoMemoryEnabled;
    }

    // Priority 5: Default to enabled
    return true;
}

// Mapping: Z3 → isAutoMemoryEnabled, t6 → isTruthy, xz → isFalsy, mA → getUserSettings
```

### 2.2 Priority Chain Analysis

**What it does**: Determines if auto memory should be active using a 5-level priority chain.

**How it works**:
1. **Priority 1 (Highest)**: `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` → Force disable
2. **Priority 2**: `CLAUDE_CODE_DISABLE_AUTO_MEMORY=0` → Force enable
3. **Priority 3**: Remote mode check → Disable if remote without memory dir
4. **Priority 4**: User settings → Use configured value
5. **Priority 5 (Lowest)**: Default → Enabled

**Why this approach**:
- **Environment override**: Critical for testing, CI/CD, enterprise control
- **Remote mode handling**: Prevents memory issues in remote sessions without storage
- **User preference**: Allows per-user toggle in settings UI
- **Default enabled**: Non-breaking default for new installations

**Edge cases**:
- `DISABLE_AUTO_MEMORY=""` (empty string) → Falls through to lower priorities
- `DISABLE_AUTO_MEMORY="0"` → Force enable (explicit opt-out of disable)
- Remote mode with `REMOTE_MEMORY_DIR` set → Works normally

---

## 3. Directory Resolution Algorithm (uH)

### 3.1 Complete Source Code

```javascript
// ============================================
// getAutoMemoryDirectory - Lazy-evaluated memory directory resolution
// Location: chunks.50.mjs:2468-2473
// ============================================

// ORIGINAL (for source lookup):
// uH = e1(() => {
//     let A = UJ7() ?? gG3();
//     if (A) return A;
//     let q = wz1(Ma(), "projects");
//     return (wz1(q, BD(FG3()), mG3) + pJ7).normalize("NFC")
// }, () => qY())

// READABLE (for understanding):
const getAutoMemoryDirectory = memoizeLazy(() => {
    // Priority 1: Cowork memory path override
    const coworkOverride = getCoworkMemoryPathOverride();
    if (coworkOverride) return coworkOverride;

    // Priority 2: Custom directory from settings
    const customDir = getCustomMemoryDirectory();
    if (customDir) return customDir;

    // Priority 3: Default project-hash based path
    const homeDir = getHomeDirectory();
    const projectsDir = joinPath(homeDir, "projects");
    return (joinPath(projectsDir, hashPath(getCurrentContextPath()), "memory") + pathSeparator)
        .normalize("NFC");
}, () => getCurrentContextPath());

// Mapping:
// uH → getAutoMemoryDirectory
// e1 → memoizeLazy (caches result, re-evaluates when dependency changes)
// UJ7 → getCoworkMemoryPathOverride
// gG3 → getCustomMemoryDirectory
// wz1 → joinPath
// Ma → getHomeDirectory
// BD → hashPath
// FG3 → getCurrentContextPath
// mG3 → "memory"
// pJ7 → pathSeparator
// qY → getCurrentContextPath (dependency function for cache invalidation)
```

### 3.2 Resolution Priority Chain

```
getAutoMemoryDirectory()
        │
        ▼
┌─────────────────────────────┐
│ CLAUDE_COWORK_MEMORY_PATH_  │
│ OVERRIDE env var set?       │
└─────────────┬───────────────┘
              │
        YES ──┼── NO
              │    │
              ▼    ▼
         ┌───────────────────────────┐
         │ autoMemoryDirectory in    │
         │ user settings?            │
         └─────────────┬─────────────┘
                       │
                 YES ──┼── NO
                       │    │
                       ▼    ▼
                  Return   ┌───────────────────────────────────┐
                  custom    │ Default path construction:        │
                  path      │ {home}/projects/{hash}/memory/    │
                           └───────────────────────────────────┘
```

### 3.3 Path Construction Details

**Components**:
- `{home}`: `~/.claude/` or `CLAUDE_CODE_REMOTE_MEMORY_DIR`
- `{hash}`: Hash of `process.cwd()` (project identifier)
- `memory`: Fixed subdirectory name

**Example paths**:
```
Default: ~/.claude/projects/abc123def/memory/
Custom:  ~/team-shared/claude-memory/
Remote:  /shared/claude/projects/abc123def/memory/
Cowork:  /cowork/shared-memory/
```

---

## 4. Semantic Memory Search Algorithm (a4q, AuY, quY)

### 4.1 Complete Source Code - Main Entry

```javascript
// ============================================
// searchMemoryFiles - Semantic memory search with LLM-based selection
// Location: chunks.146.mjs:2773-2782
// ============================================

// ORIGINAL (for source lookup):
async function a4q(A, q, K, Y = []) {
    let z = await AuY(q, K);
    if (z.length === 0) return [];
    let _ = await quY(A, z, K, Y),
        w = new Map(z.map((O) => [O.filename, O]));
    return _.map((O) => w.get(O)).filter((O) => O !== void 0).map((O) => ({
        path: O.filePath,
        mtimeMs: O.mtimeMs
    }))
}

// READABLE (for understanding):
async function searchMemoryFiles(searchText, memoryDir, abortSignal, recentToolNames = []) {
    // Step 1: List and rank memory files
    const memoryFiles = await listAndRankMemoryFiles(memoryDir, abortSignal);
    if (memoryFiles.length === 0) return [];

    // Step 2: LLM-based selection
    const selectedFilenames = await selectMemoriesWithLLM(
        searchText,
        memoryFiles,
        abortSignal,
        recentToolNames
    );

    // Step 3: Map filenames back to full paths
    const fileMap = new Map(memoryFiles.map(f => [f.filename, f]));
    return selectedFilenames
        .map(filename => fileMap.get(filename))
        .filter(file => file !== undefined)
        .map(file => ({
            path: file.filePath,
            mtimeMs: file.mtimeMs
        }));
}

// Mapping:
// a4q → searchMemoryFiles
// AuY → listAndRankMemoryFiles
// quY → selectMemoriesWithLLM
// A → searchText
// q → memoryDir
// K → abortSignal
// Y → recentToolNames
```

### 4.2 Complete Source Code - List and Rank

```javascript
// ============================================
// listAndRankMemoryFiles - List memory files with metadata and rank by mtime
// Location: chunks.146.mjs:2784-2819
// ============================================

// ORIGINAL (for source lookup):
async function AuY(A, q) {
    try {
        let Y = (await nxY(A, { recursive: !0 }))
            .filter((O) => O.endsWith(".md") && axY(O) !== "MEMORY.md"),
            _ = (await Promise.allSettled(Y.map(async (O) => {
                let $ = oxY(A, O),
                    H = await rxY($);
                return {
                    relativePath: O,
                    filePath: $,
                    mtimeMs: H.mtimeMs
                };
            }))).filter((O) => O.status === "fulfilled").map((O) => O.value)
            .sort((O, $) => $.mtimeMs - O.mtimeMs).slice(0, sxY);
        return (await Promise.allSettled(_.map(async ({
            relativePath: O,
            filePath: $,
            mtimeMs: H
        }) => {
            let { content: j } = await h36($, 0, txY, void 0, q),
                { frontmatter: J } = BH(j, $);
            return {
                filename: O,
                filePath: $,
                mtimeMs: H,
                description: J.description || null,
                type: S14(J.type)
            };
        }))).filter((O) => O.status === "fulfilled").map((O) => O.value)
    } catch {
        return []
    }
}

// READABLE (for understanding):
async function listAndRankMemoryFiles(memoryDir, abortSignal) {
    try {
        // Step 1: List all .md files recursively (exclude MEMORY.md)
        const allFiles = (await readDirRecursive(memoryDir, { recursive: true }))
            .filter(file => file.endsWith(".md") && getBaseName(file) !== "MEMORY.md");

        // Step 2: Get file stats and sort by modification time (newest first)
        const fileStats = (await Promise.allSettled(allFiles.map(async (relativePath) => {
            const filePath = joinPath(memoryDir, relativePath);
            const stats = await getFileStats(filePath);
            return {
                relativePath,
                filePath,
                mtimeMs: stats.mtimeMs
            };
        })))
            .filter(result => result.status === "fulfilled")
            .map(result => result.value)
            .sort((a, b) => b.mtimeMs - a.mtimeMs)  // Newest first
            .slice(0, MAX_FILES_TO_CONSIDER);  // Limit to 200

        // Step 3: Extract frontmatter for description and type
        return (await Promise.allSettled(fileStats.map(async ({
            relativePath,
            filePath,
            mtimeMs
        }) => {
            // Read first 30 lines for preview
            const { content } = await readFileWithLimit(filePath, 0, PREVIEW_LINES, undefined, abortSignal);
            const { frontmatter } = parseFrontmatter(content, filePath);

            return {
                filename: relativePath,
                filePath,
                mtimeMs,
                description: frontmatter.description || null,
                type: validateMemoryType(frontmatter.type)  // "user", "feedback", etc.
            };
        })))
            .filter(result => result.status === "fulfilled")
            .map(result => result.value);
    } catch {
        return [];  // Graceful degradation on error
    }
}

// Mapping:
// AuY → listAndRankMemoryFiles
// nxY → readDirRecursive
// oxY → joinPath
// rxY → getFileStats
// h36 → readFileWithLimit
// BH → parseFrontmatter
// S14 → validateMemoryType
// sxY → MAX_FILES_TO_CONSIDER (200)
// txY → PREVIEW_LINES (30)
```

### 4.3 Complete Source Code - LLM Selection

```javascript
// ============================================
// selectMemoriesWithLLM - Use LLM to select most relevant memories
// Location: chunks.146.mjs:2821-2868
// ============================================

// ORIGINAL (for source lookup):
async function quY(A, q, K, Y) {
    let z = new Set(q.map((O) => O.filename)),
        _ = q.map((O) => {
            let $ = O.type ? `[${O.type}] ` : "",
                H = new Date(O.mtimeMs).toISOString();
            return O.description ? `- ${$}${O.filename} (${H}): ${O.description}` : `- ${$}${O.filename} (${H})`
        }).join("\n"),
        w = Y.length > 0 ? `\n\nRecently used tools: ${Y.join(", ")}` : "";
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
async function selectMemoriesWithLLM(searchText, memoryFiles, abortSignal, recentToolNames) {
    // Build set of valid filenames for validation
    const validFilenames = new Set(memoryFiles.map(f => f.filename));

    // Format memory list for LLM
    const memoryList = memoryFiles.map(file => {
        const typePrefix = file.type ? `[${file.type}] ` : "";
        const timestamp = new Date(file.mtimeMs).toISOString();
        return file.description
            ? `- ${typePrefix}${file.filename} (${timestamp}): ${file.description}`
            : `- ${typePrefix}${file.filename} (${timestamp})`;
    }).join("\n");

    // Add context about recently used tools
    const toolContext = recentToolNames.length > 0
        ? `\n\nRecently used tools: ${recentToolNames.join(", ")}`
        : "";

    try {
        // Call LLM with structured output
        const response = await callLLM({
            model: getSmallFastModel(),  // Fast model for selection
            system: MEMORY_SELECTION_PROMPT,
            skipSystemPromptPrefix: true,
            messages: [{
                role: "user",
                content: `Query: ${searchText}\n\nAvailable memories:\n${memoryList}${toolContext}`
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

        // Extract text response
        const textContent = response.content.find(c => c.type === "text");
        if (!textContent || textContent.type !== "text") return [];

        // Parse JSON and validate against known filenames
        const parsed = JSON.parse(textContent.text);
        return parsed.selected_memories.filter(filename => validFilenames.has(filename));
    } catch {
        return [];  // Graceful degradation
    }
}

// Mapping:
// quY → selectMemoriesWithLLM
// _h → callLLM
// Ef → getSmallFastModel
// exY → MEMORY_SELECTION_PROMPT
// i1 → JSON.parse
// A → searchText
// q → memoryFiles
// K → abortSignal
// Y → recentToolNames
```

### 4.4 Algorithm Flow

```
searchMemoryFiles(searchText, memoryDir)
        │
        ▼
┌─────────────────────────────────────┐
│ listAndRankMemoryFiles()            │
│ ┌─────────────────────────────────┐ │
│ │ 1. List all .md files           │ │
│ │ 2. Exclude MEMORY.md            │ │
│ │ 3. Get mtime for each           │ │
│ │ 4. Sort by mtime (newest first) │ │
│ │ 5. Limit to 200 files           │ │
│ │ 6. Read first 30 lines each     │ │
│ │ 7. Extract frontmatter          │ │
│ └─────────────────────────────────┘ │
└─────────────────┬───────────────────┘
                  │
                  ▼
          memoryFiles[]
                  │
                  ▼
┌─────────────────────────────────────┐
│ selectMemoriesWithLLM()             │
│ ┌─────────────────────────────────┐ │
│ │ 1. Format file list for LLM     │ │
│ │    - filename, timestamp, desc  │ │
│ │ 2. Add tool context             │ │
│ │ 3. Call fast LLM model          │ │
│ │ 4. Parse JSON response          │ │
│ │ 5. Validate against known files │ │
│ └─────────────────────────────────┘ │
└─────────────────┬───────────────────┘
                  │
                  ▼
          selectedFilenames[]
                  │
                  ▼
┌─────────────────────────────────────┐
│ Map back to { path, mtimeMs }       │
└─────────────────┬───────────────────┘
                  │
                  ▼
            Return results
```

---

## 5. Staleness Detection Algorithm (dJ7, cJ7, Cz8)

### 5.1 Complete Source Code

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
    return `This memory is ${q} days old. ` + "Memories are point-in-time observations, not live state — " + "claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact."
}
function lJ7(A) {
    let q = Cz8(A);
    if (!q) return "";
    return `<system-reminder>${q}</system-reminder>\n`
}

// READABLE (for understanding):
function getDaysSinceTimestamp(timestamp) {
    // Calculate days elapsed since timestamp
    // 86400000 = milliseconds in one day
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

    // Fresh memory (< 2 days) - no warning needed
    if (days <= 1) return "";

    // Stale memory - return warning message
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

### 5.2 Staleness Threshold Analysis

**What it does**: Calculates memory age and generates warnings for stale content.

**Threshold behavior**:
| Days Old | Output | Warning |
|----------|--------|---------|
| 0 | "today" | None |
| 1 | "yesterday" | None |
| 2+ | "N days ago" | Full warning |

**Why 1-day threshold**:
- Memories modified today/yesterday are considered fresh
- 2+ days old may contain outdated file paths or code references
- Warning reminds LLM to verify against current code

---

## 6. HTML Comment Stripping Algorithm (o14)

### 6.1 Complete Source Code

```javascript
// ============================================
// stripHtmlComments - Remove HTML comments from markdown content
// Location: chunks.84.mjs:469-493
// ============================================

// ORIGINAL (for source lookup):
function o14(A) {
    if (!A.includes("<!--")) return {
        content: A,
        stripped: !1
    };
    let q = new tW().lex(A),
        K = "",
        Y = !1,
        z = /<!--[\s\S]*?-->/g;
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
    return {
        content: K,
        stripped: Y
    }
}

// READABLE (for understanding):
function stripHtmlComments(content) {
    // Quick check: no comments to strip
    if (!content.includes("<!--")) {
        return { content, stripped: false };
    }

    // Use markdown lexer to parse content
    const tokens = new MarkdownLexer().lex(content);
    let result = "";
    let wasStripped = false;
    const commentPattern = /<!--[\s\S]*?-->/g;

    for (const token of tokens) {
        if (token.type === "html") {
            const trimmed = token.raw.trimStart();

            // Check if this is an HTML comment
            if (trimmed.startsWith("<!--") && trimmed.includes("-->")) {
                // Remove comment but keep any remaining content
                const withoutComments = token.raw.replace(commentPattern, "");
                wasStripped = true;

                // Only add non-empty content
                if (withoutComments.trim().length > 0) {
                    result += withoutComments;
                }
                continue;
            }
        }
        // Keep all non-comment tokens
        result += token.raw;
    }

    return {
        content: result,
        stripped: wasStripped
    };
}

// Mapping:
// o14 → stripHtmlComments
// tW → MarkdownLexer
// A → content
// q → tokens
// K → result
// Y → wasStripped
```

### 6.2 Algorithm Purpose

**Why strip HTML comments**:
1. Memory files may contain user comments like `<!-- TODO: update this -->`
2. These comments add token overhead without value for the LLM
3. Stripping reduces context window usage
4. Returns `stripped` flag for tracking

---

## 7. Frontmatter Path Extraction (dv9)

### 7.1 Complete Source Code

```javascript
// ============================================
// extractFrontmatterPaths - Extract path globs from memory frontmatter
// Location: chunks.84.mjs:449-467
// ============================================

// ORIGINAL (for source lookup):
function dv9(A) {
    let {
        frontmatter: q,
        content: K
    } = BH(A);
    if (!q.paths) return {
        content: K
    };
    let Y = sz1(q.paths).map((z) => {
        return z.endsWith("/**") ? z.slice(0, -3) : z
    }).filter((z) => z.length > 0);
    if (Y.length === 0 || Y.every((z) => z === "**")) return {
        content: K
    };
    return {
        content: K,
        paths: Y
    }
}

// READABLE (for understanding):
function extractFrontmatterPaths(content) {
    // Parse frontmatter from content
    const { frontmatter, content: bodyContent } = parseFrontmatter(content);

    // No paths defined - return just the content
    if (!frontmatter.paths) {
        return { content: bodyContent };
    }

    // Process path globs
    const paths = ensureArray(frontmatter.paths)
        .map(path => {
            // Remove trailing /** to get base path
            return path.endsWith("/**") ? path.slice(0, -3) : path;
        })
        .filter(path => path.length > 0);

    // Empty paths or only wildcard - ignore
    if (paths.length === 0 || paths.every(p => p === "**")) {
        return { content: bodyContent };
    }

    return {
        content: bodyContent,
        paths  // Directory globs for scope filtering
    };
}

// Mapping:
// dv9 → extractFrontmatterPaths
// BH → parseFrontmatter
// sz1 → ensureArray
// A → content
// q → frontmatter
// K → bodyContent
// Y → paths
```

### 7.2 Purpose

**What it does**: Extracts `paths` array from memory file frontmatter for scope filtering.

**Example frontmatter**:
```yaml
---
name: api-patterns
description: REST API patterns for this project
type: project
paths:
  - src/api/**
  - src/services/**
---

# API Patterns
...
```

**Result**: `{ content: "...", paths: ["src/api", "src/services"] }`

---

## 8. Relevant Memories Attachment Producer (buY)

### 8.1 Complete Source Code

```javascript
// ============================================
// produceRelevantMemories - Produce relevant_memories attachment type
// Location: chunks.147.mjs:552-590
// ============================================

// ORIGINAL (for source lookup):
async function buY(A, q, K, Y) {
    let z = AbortSignal.timeout(5000),
        _ = wqq(A).flatMap((j) => {
            let J = j.replace("agent-", ""),
                M = q.find((D) => D.agentType === J);
            return M?.memory ? [GW6(J, M.memory)] : []
        }),
        w = _.length > 0 ? _ : [uH()],
        $ = (await Promise.all(w.map((j) => a4q(A, j, z, Y).catch(() => [])))).flat()
            .filter((j) => !K.has(j.path)).slice(0, 5),
        H = (await Promise.all($.map(async ({
            path: j,
            mtimeMs: J
        }) => {
            try {
                let M = await h36(j, 0, hE1, void 0, z),
                    D = M.totalLines > hE1,
                    X = D ? M.content + `\n\n> This memory file was truncated to the first ${hE1} lines. Use the ${s7} tool to view the complete file at: ${j}` : M.content;
                return K.set(j, {
                    content: X,
                    timestamp: Date.now(),
                    offset: void 0,
                    limit: D ? hE1 : void 0
                }), {
                    path: j,
                    content: X,
                    mtimeMs: J
                }
            } catch {
                return null
            }
        }))).filter((j) => j !== null);
    if (H.length === 0) return [];
    return [{
        type: "relevant_memories",
        memories: H
    }]
}

// READABLE (for understanding):
async function produceRelevantMemories(searchText, activeAgents, readFileState, toolContext) {
    // 5-second timeout for entire operation
    const abortSignal = AbortSignal.timeout(5000);

    // Step 1: Extract agent references from search text
    const agentRefs = extractAgentReferences(searchText);

    // Step 2: Get agent memory directories if referencing agents
    const agentMemoryDirs = agentRefs.flatMap(ref => {
        const agentType = ref.replace("agent-", "");
        const agent = activeAgents.find(a => a.agentType === agentType);
        return agent?.memory ? [getAgentMemoryPath(agentType, agent.memory)] : [];
    });

    // Step 3: Use agent dirs or default memory directory
    const searchDirs = agentMemoryDirs.length > 0
        ? agentMemoryDirs
        : [getAutoMemoryDirectory()];

    // Step 4: Search all directories in parallel
    const searchResults = (await Promise.all(
        searchDirs.map(dir =>
            searchMemoryFiles(searchText, dir, abortSignal, toolContext)
                .catch(() => [])  // Graceful degradation
        )
    )).flat();

    // Step 5: Filter out already-read files, limit to 5
    const uniqueResults = searchResults
        .filter(r => !readFileState.has(r.path))
        .slice(0, 5);

    // Step 6: Read file contents with truncation
    const memories = (await Promise.all(
        uniqueResults.map(async ({ path, mtimeMs }) => {
            try {
                const fileContent = await readFileWithLimit(
                    path, 0, RELEVANT_MEMORIES_MAX_LINES, undefined, abortSignal
                );

                const wasTruncated = fileContent.totalLines > RELEVANT_MEMORIES_MAX_LINES;
                const content = wasTruncated
                    ? fileContent.content + `\n\n> This memory file was truncated to the first ${RELEVANT_MEMORIES_MAX_LINES} lines. Use the Read tool to view the complete file at: ${path}`
                    : fileContent.content;

                // Update read state cache
                readFileState.set(path, {
                    content,
                    timestamp: Date.now(),
                    offset: undefined,
                    limit: wasTruncated ? RELEVANT_MEMORIES_MAX_LINES : undefined
                });

                return { path, content, mtimeMs };
            } catch {
                return null;
            }
        })
    )).filter(m => m !== null);

    // Step 7: Return attachment or empty array
    if (memories.length === 0) return [];

    return [{
        type: "relevant_memories",
        memories
    }];
}

// Mapping:
// buY → produceRelevantMemories
// wqq → extractAgentReferences
// GW6 → getAgentMemoryPath
// uH → getAutoMemoryDirectory
// a4q → searchMemoryFiles
// h36 → readFileWithLimit
// hE1 → RELEVANT_MEMORIES_MAX_LINES (200)
// s7 → "Read" (tool name)
// z → abortSignal
// A → searchText
// q → activeAgents
// K → readFileState
// Y → toolContext
```

### 8.2 Complete Flow

```
User message received
        │
        ▼
┌───────────────────────────────────────────┐
│ getRelevantMemoriesTrigger (zqq)          │
│ - Check isAutoMemoryEnabled()             │
│ - Check tengu_moth_copse feature flag     │
│ - Find last non-meta user message         │
│ - Extract text content                    │
│ - Validate: must have whitespace          │
└────────────────────┬──────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────┐
│ produceRelevantMemories (buY)             │
│                                           │
│ Step 1: Extract agent @-mentions          │
│         @"debugger (agent)" → agent-debugger │
│                                           │
│ Step 2: Determine search directories      │
│         - Agent dirs if @-mention found   │
│         - Default memory dir otherwise    │
│                                           │
│ Step 3: Semantic search (parallel)        │
│         - listAndRankMemoryFiles()        │
│         - selectMemoriesWithLLM()         │
│         - 5 second timeout                │
│                                           │
│ Step 4: Filter & limit                    │
│         - Exclude already-read files      │
│         - Max 5 results                   │
│                                           │
│ Step 5: Read with truncation              │
│         - Max 200 lines per file          │
│         - Add truncation warning if needed│
│                                           │
│ Step 6: Return attachment                 │
│         { type: "relevant_memories",      │
│           memories: [...] }               │
└────────────────────┬──────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────┐
│ normalizeAttachmentForAPI (Ui8)           │
│ - case "relevant_memories":               │
│   - For each memory:                      │
│     - buildStalenessWarning()             │
│     - formatRelativeTime()                │
│     - createUserMessage(isMeta: true)     │
│   - wrapWithSystemReminderTags()          │
└────────────────────┬──────────────────────┘
                     │
                     ▼
<system-reminder>
Memory (saved today): /path/to/debugging.md:

# Debugging Notes
...
</system-reminder>
```

---

## Summary

This document analyzed 8 key algorithms in the Auto Memory system:

| Algorithm | Location | Purpose |
|-----------|----------|---------|
| Memory Prompt Selection | ID1 @ chunks.84.mjs:382 | Select appropriate prompt format |
| Enable/Disable Priority | Z3 @ chunks.50.mjs:2401 | 5-level enablement chain |
| Directory Resolution | uH @ chunks.50.mjs:2468 | Resolve memory directory path |
| Semantic Search | a4q @ chunks.146.mjs:2773 | LLM-based memory retrieval |
| Staleness Detection | dJ7 @ chunks.50.mjs:2476 | Memory age calculation |
| HTML Comment Stripping | o14 @ chunks.84.mjs:469 | Clean markdown content |
| Frontmatter Extraction | dv9 @ chunks.84.mjs:449 | Extract path globs |
| Attachment Production | buY @ chunks.147.mjs:552 | Create relevant_memories |

**Key architectural insights**:
1. **Lazy evaluation**: Directory resolution uses memoization with dependency tracking
2. **Graceful degradation**: All search operations handle errors and timeouts
3. **LLM-assisted selection**: Semantic search uses fast model for relevance ranking
4. **Freshness tracking**: Staleness warnings remind LLM to verify old memories
5. **5-second timeout**: Search operations have hard timeout to prevent delays