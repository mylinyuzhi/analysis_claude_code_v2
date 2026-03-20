# Auto Memory (MEMORY.md) Logic Analysis

## Module Overview

The Auto Memory system provides Claude Code with persistent knowledge across sessions. It revolves around a special file, `MEMORY.md`, which is automatically managed and injected into the system prompt.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions and constants in this document:
- `MEMORY_MD_FILENAME` (`o2` / `BG3`) - The filename "MEMORY.md"
- `MEMORY_MAX_LINES` (`uj`) - The 200-line hard limit for prompt injection
- `AUTO_MEMORY_DISPLAY_NAME` (`p14`) - Display name "auto memory"
- `MEMORY_DIR_EXISTS_HINT` (`Uf8`) - Hint for existing directory
- `DUAL_MEMORY_DIR_EXISTS_HINT` (`pf8`) - Hint for dual memory directories
- `MEMORY_SUBDIR_NAME` (`mG3`) - Subdirectory name "memory"
- `getAutoMemory` (`ID1`) - Async function that reads and prepares memory content
- `buildMemoryPrompt` (`Q14`) - Function that constructs the memory section of the system prompt
- `buildMemoryIndex` (`U14`) - File-based memory prompt builder
- `buildBackgroundAgentMemoryPrompt` (`xv9`) - Background agent memory prompt
- `buildAutoMemoryPromptSimple` (`uv9`) - Simple memory prompt builder
- `buildSearchContextSection` (`Dt`) - Search guidance builder
- `ensureMemoryDirExists` (`CD1`) - Async directory creation
- `recordMemoryDirLoadMetrics` (`DF6`) - Telemetry recording
- `isAutoMemoryEnabled` (`Z3`) - Function that checks if memory is enabled
- `getAutoMemoryDirectory` (`uH`) - Lazy-evaluated memory directory path
- `isAutoMemoryPath` (`Da`) - Path validation for memory files
- `validateMemoryPath` (`QJ7`) - Path validation with security checks
- `getDaysSinceTimestamp` (`dJ7`) - Staleness calculation
- `formatRelativeTime` (`cJ7`) - Time formatting
- `buildStalenessWarning` (`Cz8`) - Staleness warning message
- `formatStalenessReminder` (`lJ7`) - System-reminder wrapper
- `loadMemoryFileWithIncludeSupport` (`xD1`) - Enhanced loading via @include (see [28_memory_file_loading.md](./28_memory_file_loading.md))

## Memory Lifecycle

1. **Storage**: Memory files are stored in a persistent directory (e.g., `~/.claude/projects/{hash}/memory/` or custom `autoMemoryDirectory`).
2. **Reading**: At the start of every turn, the system calls `ID1` (getAutoMemory).
3. **Truncation**: If `MEMORY.md` exceeds 200 lines, only the first 200 are kept.
4. **Injection**: The content is wrapped in a memory section and added to the system prompt.
5. **Modification**: The agent uses standard `Write` or `Edit` tools to update `MEMORY.md` as it learns new patterns or user preferences.

---

## Core Helper Functions

### ensureMemoryDirExists (CD1)

// ============================================
// ensureMemoryDirExists - Async directory creation with silent failure
// Location: chunks.84.mjs:261-271
// ============================================

// ORIGINAL (for source lookup):
async function CD1(A) {
    let q = $1();
    try {
        await q.mkdir(A)
    } catch (K) {
        let Y = K instanceof Error && "code" in K && typeof K.code === "string" ? K.code : void 0;
        k(`ensureMemoryDirExists failed for ${A}: ${Y??String(K)}`, {
            level: "debug"
        })
    }
}

// READABLE (for understanding):
async function ensureMemoryDirExists(memoryDir) {
    const fs = getFileSystem();
    try {
        await fs.mkdir(memoryDir);
    } catch (error) {
        // Silent failure - directory likely already exists
        const errorCode = error instanceof Error && "code" in error && typeof error.code === "string"
            ? error.code
            : undefined;
        logDebug(`ensureMemoryDirExists failed for ${memoryDir}: ${errorCode ?? String(error)}`);
    }
}

// Mapping: CD1 → ensureMemoryDirExists, $1 → getFileSystem, k → logDebug, A → memoryDir

**What it does:** Creates the memory directory if it doesn't exist, with silent failure on error.

**Why silent failure?**
- Directory may already exist (EEXIST)
- Race conditions with parallel agents
- Non-critical operation - file reads will fail gracefully later if directory truly missing

---

### recordMemoryDirLoadMetrics (DF6)

// ============================================
// recordMemoryDirLoadMetrics - Telemetry for memory directory loading
// Location: chunks.84.mjs:273-288
// ============================================

// ORIGINAL (for source lookup):
function DF6(A, q) {
    $1().readdir(A).then((Y) => {
        let z = 0, _ = 0;
        for (let w of Y)
            if (w.isFile()) z++;
            else if (w.isDirectory()) _++;
        d("tengu_memdir_loaded", {
            ...q,
            total_file_count: z,
            total_subdir_count: _
        })
    }, () => {
        d("tengu_memdir_loaded", q)
    })
}

// READABLE (for understanding):
function recordMemoryDirLoadMetrics(memoryDir, metrics) {
    getFileSystem().readdir(memoryDir).then((entries) => {
        let fileCount = 0;
        let subdirCount = 0;

        for (const entry of entries) {
            if (entry.isFile()) fileCount++;
            else if (entry.isDirectory()) subdirCount++;
        }

        recordTelemetry("tengu_memdir_loaded", {
            ...metrics,
            total_file_count: fileCount,
            total_subdir_count: subdirCount
        });
    }, () => {
        // Fallback if readdir fails - still log basic metrics
        recordTelemetry("tengu_memdir_loaded", metrics);
    });
}

// Mapping: DF6 → recordMemoryDirLoadMetrics, $1 → getFileSystem, d → recordTelemetry
//          A → memoryDir, q → metrics (content_length, line_count, was_truncated, memory_type)

**What it does:** Records telemetry about memory directory contents after each load.

**Telemetry event data:**
- `content_length` - Size of MEMORY.md in bytes
- `line_count` - Number of lines (may exceed 200 if truncated)
- `was_truncated` - Boolean indicating if truncation occurred
- `memory_type` - "auto" or "agent"
- `total_file_count` - Number of files in memory directory (including topic files)
- `total_subdir_count` - Number of subdirectories

---

### buildSearchContextSection (Dt)

// ============================================
// buildSearchContextSection - Build search guidance for memory files
// Location: chunks.84.mjs:373-379
// ============================================

// ORIGINAL (for source lookup):
function Dt(A) {
    if (!w8("tengu_coral_fern", !1)) return [];
    let q = mj(AA()),
        K = n$(),
        Y = K ? `grep -rn "<search term>" ${A} --include="*.md"` : `${N9} with pattern="<search term>" path="${A}" glob="*.md"`,
        z = K ? `grep -rn "<search term>" ${q}/ --include="*.jsonl"` : `${N9} with pattern="<search term>" path="${q}/" glob="*.jsonl"`;
    return ["## Searching past context", "", "When looking for past context:", "1. Search topic files in your memory directory:", "```", Y, "```", "2. Session transcript logs (last resort — large files, slow):", "```", z, "```", "Use narrow search terms (error messages, file paths, function names) rather than broad keywords.", ""]
}

// READABLE (for understanding):
function buildSearchContextSection(memoryDir) {
    // Check feature flag for search context
    if (!getFeatureFlag("tengu_coral_fern", false)) {
        return [];
    }

    const transcriptDir = getTranscriptDir(getSessionDir());
    const isShellMode = isShellEnabled();

    // Build grep command for memory files
    const memorySearchCmd = isShellMode
        ? `grep -rn "<search term>" ${memoryDir} --include="*.md"`
        : `Grep with pattern="<search term>" path="${memoryDir}" glob="*.md"`;

    // Build grep command for transcript logs
    const transcriptSearchCmd = isShellMode
        ? `grep -rn "<search term>" ${transcriptDir}/ --include="*.jsonl"`
        : `Grep with pattern="<search term>" path="${transcriptDir}/" glob="*.jsonl"`;

    return [
        "## Searching past context",
        "",
        "When looking for past context:",
        "1. Search topic files in your memory directory:",
        "```",
        memorySearchCmd,
        "```",
        "2. Session transcript logs (last resort — large files, slow):",
        "```",
        transcriptSearchCmd,
        "```",
        "Use narrow search terms (error messages, file paths, function names) rather than broad keywords.",
        ""
    ];
}

// Mapping: Dt → buildSearchContextSection, w8 → getFeatureFlag, mj → getTranscriptDir
//          AA → getSessionDir, n$ → isShellEnabled, N9 → "Grep", A → memoryDir

**What it does:** Generates search guidance section for memory prompts, helping agents find past context.

**Feature flag:** `tengu_coral_fern` - When disabled, returns empty array (no search section).

**Search targets:**
1. **Memory files** - Topic files (*.md) in memory directory
2. **Transcript logs** - Session JSONL files (last resort due to size)

**Key insight:** This section teaches agents how to use Grep tool for searching memory content, rather than relying solely on what's loaded in MEMORY.md.

## Core Building Functions

### buildMemoryPrompt (Q14)

// ============================================
// buildMemoryPrompt - Core prompt construction with truncation
// Location: chunks.84.mjs:290-322
// ============================================

// ORIGINAL (for source lookup):
function Q14(A) {
    let { displayName: q, memoryDir: K, extraGuidelines: Y } = A,
        z = $1(), _ = K + o2, w = "";
    try { w = z.readFileSync(_, { encoding: "utf-8" }) } catch {}
    let O = [`# ${q}`, "", `You have a persistent ${q} directory at \`${K}\`. ${Uf8} Its contents persist across conversations.`, "", `As you work, consult your memory files to build on previous experience. When you encounter a mistake that seems like it could be common, check your ${q} for relevant notes — and if nothing is written yet, record what you learned.`, "", "Guidelines:", `- \`${o2}\` is always loaded into your system prompt — lines after ${uj} will be truncated, so keep it concise`, "- Create separate topic files (e.g., `debugging.md`, `patterns.md`) for detailed notes and link to them from MEMORY.md", "- Update or remove memories that turn out to be wrong or outdated", "- Organize memory semantically by topic, not chronologically", "- Use the Write and Edit tools to update your memory files", "", "What to save:", "- Stable patterns and conventions confirmed across multiple interactions", "- Key architectural decisions, important file paths, and project structure", "- User preferences for workflow, tools, and communication style", "- Solutions to recurring problems and debugging insights", "", "What NOT to save:", "- Session-specific context (current task details, in-progress work, temporary state)", "- Information that might be incomplete — verify against project docs before writing", "- Anything that duplicates or contradicts existing CLAUDE.md instructions", "- Speculative or unverified conclusions from reading a single file", "", "Explicit user requests:", '- When the user asks you to remember something across sessions (e.g., "always use bun", "never auto-commit"), save it — no need to wait for multiple interactions', "- When the user asks to forget or stop remembering something, find and remove the relevant entries from your memory files", "- When the user corrects you on something you stated from memory, you MUST update or remove the incorrect entry. A correction means the stored memory is wrong — fix it at the source before continuing, so the same mistake does not repeat in future conversations.", ...Y ?? [], ""];
    if (O.push(...Dt(K)), w.trim()) {
        let $ = w.trim().split("\n"), H = $.length > uj, j = q === p14 ? "auto" : "agent";
        DF6(K, { content_length: w.length, line_count: $.length, was_truncated: H, memory_type: j });
        let J = w.trim();
        if (H) J = $.slice(0, uj).join("\n") + "\n\n> WARNING: ${o2} is ${$.length} lines (limit: ${uj}). Only the first ${uj} lines were loaded. Move detailed content into separate topic files and keep ${o2} as a concise index.";
        O.push(`## ${o2}`, "", J)
    } else O.push(`## ${o2}`, "", `Your ${o2} is currently empty. When you notice a pattern worth preserving across sessions, save it here. Anything in ${o2} will be included in your system prompt next time.`);
    return O.join("\n")
}

// READABLE (for understanding):
function buildMemoryPrompt({ displayName, memoryDir, extraGuidelines }) {
    const fs = getFileSystem();
    const memoryFilePath = memoryDir + "MEMORY.md";

    // STEP 1: Ensure directory exists (silent fail if already exists)
    try { fs.mkdirSync(memoryDir); } catch {}

    // STEP 2: Read file content (empty string if doesn't exist)
    let content = "";
    try { content = fs.readFileSync(memoryFilePath, { encoding: "utf-8" }); } catch {}

    // STEP 3: Build instruction header
    let promptLines = [
        `# ${displayName}`,
        "",
        `You have a persistent ${displayName} directory at \`${memoryDir}\`...`,
        "Guidelines:",
        "- `MEMORY.md` is always loaded — lines after 200 will be truncated",
        "- Create separate topic files for detailed notes",
        "- Update or remove memories that turn out to be wrong",
        "- Organize memory semantically, not chronologically",
        ...extraGuidelines ?? [],
        ""
    ];

    // STEP 4: Process content
    if (content.trim()) {
        const lines = content.trim().split("\n");
        const wasTruncated = lines.length > 200;
        const memoryType = displayName === "auto memory" ? "auto" : "agent";

        // Record telemetry
        recordMemoryDirLoadMetrics(memoryDir, {
            content_length: content.length,
            line_count: lines.length,
            was_truncated: wasTruncated,
            memory_type: memoryType
        });

        // STEP 5: Truncate if necessary
        let displayContent = content.trim();
        if (wasTruncated) {
            displayContent = lines.slice(0, 200).join("\n") +
                "\n\n> WARNING: MEMORY.md is " + lines.length + " lines (limit: 200). " +
                "Only the first 200 lines were loaded. Move detailed content into " +
                "separate topic files and keep MEMORY.md as a concise index.";
        }

        promptLines.push("## MEMORY.md", "", displayContent);
    } else {
        // STEP 6: Empty file handling
        promptLines.push(
            "## MEMORY.md",
            "",
            "Your MEMORY.md is currently empty. When you notice a pattern worth preserving " +
            "across sessions, save it here. Anything in MEMORY.md will be included in your " +
            "system prompt next time."
        );
    }

    return promptLines.join("\n");
}

// Mapping:
// Q14 → buildMemoryPrompt
// o2 → "MEMORY.md"
// uj → 200
// p14 → "auto memory"
// DF6 → recordMemoryDirLoadMetrics
// $1 → getFileSystem

**Algorithm steps**:

**Phase 1 - Setup**:
1. Extract parameters: `displayName`, `memoryDir`, `extraGuidelines`
2. Get filesystem interface
3. Build memory file path: `{memoryDir}/MEMORY.md`
4. Create directory if missing (silent fail if exists)

**Phase 2 - Read**:
1. Try to read file with UTF-8 encoding
2. Catch any errors (file not found, permissions, etc.)
3. Default to empty string if read fails

**Phase 3 - Format Header**:
1. Build instruction header with display name
2. Add directory path explanation
3. Include usage guidelines
4. Append any extra scope-specific guidelines

**Phase 4 - Content Processing**:
1. If content exists:
   - Split into lines array
   - Check if exceeds 200 lines
   - Record telemetry (length, line count, truncation status)
   - If truncated: keep only first 200 lines, append warning
   - If not truncated: use full content
2. If content empty: show helpful "getting started" message

**Phase 5 - Return**:
1. Join all prompt lines with newlines
2. Return as single string for system prompt injection

---

## Truncation and Warning Logic

**What it does:** Prevents the system prompt from being overwhelmed by a massive memory file, while encouraging the agent to use a modular "Topic" approach.

**How it works:**
1. Loads all lines from `MEMORY.md`.
2. Checks if `lineCount > 200`.
3. If yes, slices the array to `[0, 200]`.
4. Appends a warning message to the injected prompt explaining that content was truncated.

### Truncation Warning Format

**Exact warning text** (chunks.84.mjs):

```
> WARNING: MEMORY.md is {actualLineCount} lines (limit: 200). Only the first 200 lines were loaded. Move detailed content into separate topic files and keep MEMORY.md as a concise index.
```

**Example**:
```
## MEMORY.md

# Project Patterns

- Use bun instead of npm
- Always run tests before commit
...
[197 more lines]

> WARNING: MEMORY.md is 247 lines (limit: 200). Only the first 200 lines were loaded. Move detailed content into separate topic files and keep MEMORY.md as a concise index.
```

**Visual indicator**: `>` prefix creates blockquote formatting in markdown

---

## Strategy: Indexing vs. Storage

The system explicitly instructs the agent:
- **`MEMORY.md`** should be a **concise index** of high-level patterns and links.
- **Topic Files** (e.g., `patterns.md`, `user_preferences.md`) should store the **detailed content**.
- This ensures that the core context window is used efficiently while still allowing the agent to "Read" deeper context when needed via the `Read` tool on specific topic files.

**Key insight:** The 200-line limit is a deliberate design choice to prevent "memory bloat" and force the model to organize its long-term knowledge hierarchically.

---

## Custom Directory Logic (v2.1.59)

When `autoMemoryDirectory` is set in user settings, the memory path resolution short-circuits:

// ============================================
// getAutoMemoryDirectory - Directory resolution with custom override
// Location: chunks.50.mjs:2468-2473 (lazy-evaluated)
// ============================================

// READABLE (for understanding):
function getAutoMemoryDirectory() {
    // Priority 1: Cowork memory path override
    const coworkOverride = getCoworkMemoryPathOverride();
    if (coworkOverride) return coworkOverride;

    // Priority 2: Custom directory from settings (v2.1.59)
    const customDir = getCustomMemoryDirectory();
    if (customDir) return customDir;

    // Priority 3: Default project-hash based path
    const homeDir = getHomeDirectory();
    const projectsDir = path.join(homeDir, "projects");
    const projectHash = hashPath(getCurrentContextPath());
    return path.join(projectsDir, projectHash, "memory") + "/";
}

// Mapping: uH → getAutoMemoryDirectory, UJ7 → getCoworkMemoryPathOverride,
//          gG3 → getCustomMemoryDirectory, Ma → getHomeDirectory

**Use case**: Teams that want a shared, stable memory path without relying on project hashes.

---

## Staleness Detection (v2.1.76)

The system now includes staleness detection for memory freshness:

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

**What it does:** Provides staleness detection so agents know when memory may be outdated.

**How it works:**
1. Calculate days since last modification
2. If > 1 day, generate warning message
3. Wrap in `<system-reminder>` tags for injection into prompts

**Why 1-day threshold?**
- Fresh memory (0-1 days) is likely accurate
- Older memory may have outdated file:line references
- Warning encourages verification without blocking usage

**Integration with System Reminder:**
The `lJ7` function wraps warnings in `<system-reminder>` tags, which are processed by the system reminder module (04_system_reminder). This allows the staleness warning to appear inline in the conversation context.

---

## Team Memory Combined Prompts

When team memory is enabled (`tengu_herring_clock` feature flag), the system generates combined prompts that include both user memory and team memory. There are three variants:

### buildCombinedMemoryPrompt (Cv9)

// ============================================
// buildCombinedMemoryPrompt - Standard dual-memory prompt
// Location: chunks.84.mjs:230-235
// ============================================

// ORIGINAL (for source lookup):
function Cv9() {
    let A = uH(),
        q = Lk();
    return ["# Memory", "", `You have two persistent memory systems. ${pf8}`, "",
        `1. **User memory** at \`${A}\` — private between you and the user`,
        `2. **Team memory** at \`${q}\` — shared with all users in the same organization`,
        "",
        // ... extensive guidance for user vs team memory ...
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
        `1. **User memory** at \`${userMemoryDir}\` — private between you and the user`,
        `2. **Team memory** at \`${teamMemoryDir}\` — shared with all users in the same organization`,
        "",
        "## You MUST access memories when:",
        "- Specific known memories (personal or team) seem relevant",
        "- The user refers to work from prior conversations",
        "- The user explicitly asks you to check memory, recall, or remember",
        "",
        "## You MUST save memories when:",
        "- You encounter information useful in future conversations",
        "- The user describes their goals or project context",
        "- The user explicitly asks you to remember something",
        "",
        "## What to save in user memory (private):",
        "- User preferences for workflow, tools, communication",
        "- Personal project context",
        "- Solutions unlikely to recur for other users",
        "",
        "## What to save in team memory (shared):",
        "- Reusable patterns and conventions",
        "- Project architecture decisions",
        "- Solutions likely to recur across users",
        "",
        "## What not to save:",
        "- Sensitive data (API keys, credentials) in team memory",
        "- Ephemeral task details",
        "- User-specific preferences in team memory",
        "",
        ...buildSearchContextSection(userMemoryDir)
    ].join("\n");
}

// Mapping: Cv9 → buildCombinedMemoryPrompt, uH → getAutoMemoryDirectory,
//          Lk → getTeamMemoryDirectory, pf8 → DUAL_MEMORY_DIR_EXISTS_HINT,
//          Dt → buildSearchContextSection

**What it does:** Generates the standard dual-memory prompt for team-enabled sessions.

**Key content:**
- Clear distinction between user (private) and team (shared) memory
- Guidance for choosing which memory to use
- Explicit warnings about not saving sensitive data in team memory

---

### buildTypedCombinedMemoryPrompt (Iv9)

// ============================================
// buildTypedCombinedMemoryPrompt - File-based dual-memory with frontmatter
// Location: chunks.84.mjs:237-242
// ============================================

// ORIGINAL (for source lookup):
function Iv9() {
    let A = uH(),
        q = Lk();
    return ["# Memory", "",
        `You have a persistent, file-based memory system with two directories: a private directory at \`${A}\` and a shared team directory at \`${q}\`. ${pf8}`,
        "",
        // ... includes LD1 (TEAM_SCOPE_DEFINITIONS) and _36 (MEMORY_DONT_SAVE_SECTION) ...
        ...LD1, ..._36,
        "- You MUST avoid saving sensitive data within shared team memories.",
        "",
        // ... two-step save process with frontmatter ...
        ...Dt(A)
    ].join("\n")
}

// READABLE (for understanding):
function buildTypedCombinedMemoryPrompt() {
    const userMemoryDir = getAutoMemoryDirectory();
    const teamMemoryDir = getTeamMemoryDirectory();

    return [
        "# Memory",
        "",
        `You have a persistent, file-based memory system with two directories:`,
        `- private directory at \`${userMemoryDir}\``,
        `- shared team directory at \`${teamMemoryDir}\``,
        "",
        "## Memory scope",
        "",
        "There are two scope levels:",
        `- private: memories private between you and the current user`,
        `- team: memories shared with all users in this project`,
        "",
        ...TEAM_SCOPE_DEFINITIONS,  // LD1
        ...MEMORY_DONT_SAVE_SECTION,  // _36
        "- You MUST avoid saving sensitive data within shared team memories.",
        "",
        "## How to save memories",
        "",
        "Saving a memory is a two-step process:",
        "",
        "**Step 1** — write to file using frontmatter format:",
        ...FRONTMATTER_TEMPLATE,  // w36
        "",
        "**Step 2** — add pointer to that file in the directory's MEMORY.md",
        "",
        ...buildSearchContextSection(userMemoryDir)
    ].join("\n");
}

// Mapping: Iv9 → buildTypedCombinedMemoryPrompt, LD1 → TEAM_SCOPE_DEFINITIONS,
//          _36 → MEMORY_DONT_SAVE_SECTION, w36 → FRONTMATTER_TEMPLATE

**What it does:** Generates the file-based dual-memory prompt with typed frontmatter support.

**Key difference from Cv9:**
- Uses two-step save process (frontmatter file + MEMORY.md index)
- Includes TEAM_SCOPE_DEFINITIONS (LD1) for type guidance
- More structured approach to memory organization

---

### buildExtractModeTypedCombinedPrompt (bv9)

// ============================================
// buildExtractModeTypedCombinedPrompt - Background agent extraction mode
// Location: chunks.84.mjs:244-251
// ============================================

// ORIGINAL (for source lookup):
function bv9() {
    {
        let A = uH(),
            q = Lk();
        return ["# Memory", "",
            `You have a persistent, file-based memory system with two directories: a private directory at \`${A}\` and a shared team directory at \`${q}\`.`,
            "",
            `Each directory has a \`${o2}\` index of memory files, loaded into your conversation context (first ${uj} lines).`,
            "",
            "A background agent automatically extracts and saves memories from this conversation.",
            "If the user asks you to remember or forget something, acknowledge it — the save happens automatically.",
            "You should not write to memory files yourself.",
            "",
            ...Dt(A)
        ].join("\n")
    }
    return ""
}

// READABLE (for understanding):
function buildExtractModeTypedCombinedPrompt() {
    const userMemoryDir = getAutoMemoryDirectory();
    const teamMemoryDir = getTeamMemoryDirectory();

    return [
        "# Memory",
        "",
        `You have a persistent, file-based memory system with two directories:`,
        `- private directory at \`${userMemoryDir}\``,
        `- shared team directory at \`${teamMemoryDir}\``,
        "",
        `Each directory has a MEMORY.md index of memory files, loaded into your context (first 200 lines).`,
        "",
        "**You should not write to memory files yourself.**",
        "A background agent automatically extracts and saves memories from this conversation.",
        "If the user asks you to remember or forget something, acknowledge it — the save happens automatically.",
        "",
        ...buildSearchContextSection(userMemoryDir)
    ].join("\n");
}

// Mapping: bv9 → buildExtractModeTypedCombinedPrompt, o2 → "MEMORY.md", uj → 200

**What it does:** Generates the extraction-mode prompt for background agents with team memory.

**Key difference from Iv9:**
- Explicitly tells agent NOT to write to memory files
- Background extraction subagent handles saving
- Simpler prompt - no save instructions needed

**When used:** When `tengu_passport_quail` feature flag is enabled (background agent memory mode).

---

## Prompt Selection Decision Matrix

| isTeamMemoryEnabled | tengu_passport_quail | tengu_swinburne_dune | Prompt Function |
|---------------------|----------------------|----------------------|-----------------|
| Yes | Yes | * | `bv9` (Extract mode) |
| Yes | No | Yes | `Iv9` (Typed, file-based) |
| Yes | No | No | `Cv9` (Standard combined) |
| No | Yes | * | `xv9` (Background single) |
| No | No | Yes | `U14` (File-based single) |
| No | No | No | `uv9` (Simple single) |

**Feature flags explained:**
- `tengu_herring_clock` - Enables team memory (checked by `SD1` / isTeamMemoryEnabled)
- `tengu_passport_quail` - Background agent extraction mode
- `tengu_swinburne_dune` - File-based format with frontmatter

---

## Empty Memory Handling

**Default message** (chunks.84.mjs):

```
Your MEMORY.md is currently empty. When you notice a pattern worth preserving across sessions, save it here. Anything in MEMORY.md will be included in your system prompt next time.
```

**Purpose**:
- **Onboarding**: Explains what MEMORY.md is for
- **Call to action**: Encourages agent to start saving patterns
- **Immediate feedback**: Shows memory system is active (just empty)

---

## Algorithm Deep-Dive: Truncation Strategy

### The 200-Line Limit Decision

**What it does:** Enforces a hard limit on the number of lines loaded from MEMORY.md into the system prompt, preventing context window exhaustion.

**How it works:**

```
buildMemoryPrompt() Flow:
1. Read file content from disk
2. Split content by newlines → lines array
3. Check: lines.length > 200?
   ├── YES → Truncate to first 200 lines
   │         Append warning message
   │         Log truncation event
   └── NO  → Use full content
4. Inject into system prompt
```

**Detailed Algorithm** (chunks.84.mjs:303-318):

```javascript
// Phase 1: Content read and split
if (content.trim()) {
    const lines = content.trim().split("\n");
    const wasTruncated = lines.length > 200;
    const memoryType = displayName === "auto memory" ? "auto" : "agent";

    // Phase 2: Telemetry recording (async, non-blocking)
    recordMemoryDirLoadMetrics(memoryDir, {
        content_length: content.length,    // Bytes
        line_count: lines.length,          // Total lines (even if truncated)
        was_truncated: wasTruncated,       // Boolean
        memory_type: memoryType            // "auto" or "agent"
    });

    // Phase 3: Truncation logic
    let displayContent = content.trim();
    if (wasTruncated) {
        displayContent = lines.slice(0, 200).join("\n") + `

> WARNING: MEMORY.md is ${lines.length} lines (limit: 200).
> Only the first 200 lines were loaded.
> Move detailed content into separate topic files and keep MEMORY.md as a concise index.`;
    }

    promptLines.push("## MEMORY.md", "", displayContent);
}
```

**Why 200 lines?**

The limit was chosen through the following considerations:

1. **Context window budgeting**: At ~4 tokens/line average, 200 lines ≈ 800 tokens. This is a small fraction of the 200K+ context window.
2. **Prompt engineering**: 200 lines provides enough space for meaningful content while leaving room for other prompt sections.
3. **Cognitive load**: Longer files become harder to navigate; 200 lines forces hierarchical organization.
4. **Performance**: Truncation is O(n) in lines, so limiting to 200 keeps the operation fast.

**Trade-offs:**

| Aspect | Choice | Alternative (not chosen) |
|--------|--------|--------------------------|
| **Hard vs Soft limit** | Hard truncation | Dynamic limit based on context |
| **Warning visibility** | In-prompt warning | Separate notification |
| **Recovery** | Agent must edit file | Automatic archiving |

---

## Algorithm Deep-Dive: Enable/Disable Priority Chain

### The Priority Chain

**What it does:** Determines whether auto memory should be active through a 5-level priority chain.

**Decision Flow**:

```
isAutoMemoryEnabled() Evaluation:
│
├─ Priority 1: CLAUDE_CODE_DISABLE_AUTO_MEMORY env var
│   ├─ "1", "true", "yes" → return false (disabled)
│   └─ "0", "false", "no" → return true (enabled)
│
├─ Priority 2: Remote mode check
│   ├─ CLAUDE_CODE_REMOTE=1 AND no CLAUDE_CODE_REMOTE_MEMORY_DIR
│   │   → return false (disabled - no storage location)
│   └─ Otherwise → continue
│
├─ Priority 3: User settings
│   ├─ autoMemoryEnabled: false → return false
│   └─ autoMemoryEnabled: true → return true
│
└─ Priority 4: Default
    └─ return true (enabled by default)
```

**Why this priority chain?**

1. **Environment variable first**: Enables enterprise-level control for CI/CD, testing, and security policies.
2. **Remote mode special case**: When running remotely without a memory directory, memory must be disabled to prevent errors.
3. **User settings**: Allows per-user preference that can be overridden by environment.
4. **Default enabled**: New users get the feature automatically.

**Implementation** (chunks.50.mjs:2401-2408):

```javascript
function isAutoMemoryEnabled() {
    const disableEnvVar = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;

    // Priority 1: Explicit disable via env var (truthy value)
    if (isTruthy(disableEnvVar)) return false;

    // Priority 2: Explicit enable via env var (falsy non-empty)
    if (isFalsy(disableEnvVar)) return true;

    // Priority 3: Remote mode without memory directory
    if (isTruthy(process.env.CLAUDE_CODE_REMOTE) &&
        !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return false;
    }

    // Priority 4: User setting
    const settings = getUserSettings();
    if (settings.autoMemoryEnabled !== undefined) {
        return settings.autoMemoryEnabled;
    }

    // Priority 5: Default enabled
    return true;
}
```

**Edge Cases:**

| Scenario | Result | Reason |
|----------|--------|--------|
| `DISABLE_AUTO_MEMORY=""` (empty string) | Continue checking | Empty string is neither truthy nor falsy in this context |
| `DISABLE_AUTO_MEMORY="0"` | Enabled | Explicit opt-in via falsy value |
| Remote mode with `REMOTE_MEMORY_DIR` set | Continue checking | Memory directory available |
| `autoMemoryEnabled: undefined` in settings | Default enabled | Undefined means use default |

---

## Algorithm Deep-Dive: Directory Path Resolution

### Path Resolution Strategy

**What it does:** Computes the memory directory path through a multi-source resolution chain.

**Resolution Chain**:

```
getAutoMemoryDirectory() Resolution:
│
├─ Source 1: CLAUDE_COWORK_MEMORY_PATH_OVERRIDE env var
│   └─ If set and valid → return normalized path
│
├─ Source 2: autoMemoryDirectory in settings
│   └─ If set in policy/flag/local/user settings → return normalized path
│
└─ Source 3: Default project-hash path
    └─ return {home}/projects/{hash}/memory/
```

**Path Validation** (chunks.50.mjs:2416-2428):

The `QJ7` function validates custom paths with multiple security checks:

```javascript
function validateMemoryPath(path, allowTildeExpansion) {
    if (!path) return undefined;

    let resolvedPath = path;

    // Expand ~/ if allowed
    if (allowTildeExpansion && path.startsWith("~/")) {
        const rest = path.slice(2);
        resolvedPath = joinPath(getHomeDirectory(), rest);
    }

    // Normalize and strip trailing slashes
    const normalized = normalizePath(resolvedPath).replace(/[/\\]+$/, "");

    // Security validations
    if (!isValidPath(normalized)) return undefined;
    if (normalized.length < 3) return undefined;           // Too short
    if (/^[A-Za-z]:$/.test(normalized)) return undefined;  // Drive letter only
    if (normalized.startsWith("\\\\")) return undefined;   // UNC path
    if (normalized.startsWith("//")) return undefined;     // UNC path (Unix)
    if (normalized.includes("\x00")) return undefined;     // Null byte

    return (normalized + "/").normalize("NFC");
}
```

**Why these security checks?**

- **Minimum length (3)**: Prevents paths like "a" or "ab"
- **Drive letter exclusion**: Prevents paths like "C:" on Windows
- **UNC path exclusion**: Prevents network path injection
- **Null byte check**: Prevents path traversal via null injection
- **NFC normalization**: Ensures consistent Unicode handling

**Hash-based Default Path:**

```javascript
// Default path construction
const homeDir = getHomeDirectory();               // ~/.claude/ or REMOTE_MEMORY_DIR
const projectsDir = joinPath(homeDir, "projects");
const projectHash = hashPath(getCurrentContextPath());  // SHA-256 or similar
return joinPath(projectsDir, projectHash, "memory") + "/";
```

**Why hashing?**

- **Path obfuscation**: Prevents sensitive directory names from appearing in memory paths
- **Consistent length**: Hash is always same length regardless of original path
- **Collision resistance**: Different projects get different memory directories
- **Privacy**: Working directory path not directly visible in memory path

---

## Main Entry Point: getAutoMemory (ID1)

### Complete Algorithm

// ============================================
// getAutoMemory - Main async entry point for memory system
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
        if (await CD1(K), DF6(K, { memory_type: "auto" }),
            w8("tengu_passport_quail", !1)) return xv9("auto memory", K).join("\n");
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
    const isEnabled = isAutoMemoryEnabled();
    const useFileBasedFormat = getFeatureFlag("tengu_swinburne_dune", false);

    // BRANCH 1: Team memory enabled (dual memory system)
    if (isTeamMemoryEnabled()) {
        const userMemoryDir = getAutoMemoryDirectory();
        const teamMemoryDir = getTeamMemoryPath();

        // Ensure team memory directory exists
        await ensureMemoryDirExists(teamMemoryDir);

        // Record telemetry for both directories
        recordMemoryDirLoadMetrics(userMemoryDir, { memory_type: "auto" });
        recordMemoryDirLoadMetrics(teamMemoryDir, { memory_type: "team" });

        // Return appropriate prompt based on flags
        if (getFeatureFlag("tengu_passport_quail", false)) {
            return buildExtractModeTypedCombinedPrompt();  // Background agent mode
        }
        if (useFileBasedFormat) {
            return buildTypedCombinedMemoryPrompt();  // File-based with team
        }
        return buildCombinedMemoryPrompt();  // Standard dual memory
    }

    // BRANCH 2: Single memory (auto memory only)
    if (isEnabled) {
        const memoryDir = getAutoMemoryDirectory();

        // Ensure directory exists
        await ensureMemoryDirExists(memoryDir);

        // Record telemetry
        recordMemoryDirLoadMetrics(memoryDir, { memory_type: "auto" });

        // Return appropriate prompt based on flags
        if (getFeatureFlag("tengu_passport_quail", false)) {
            return buildBackgroundAgentMemoryPrompt("auto memory", memoryDir);  // Background agent
        }
        if (useFileBasedFormat) {
            return buildMemoryIndex("auto memory", memoryDir);  // File-based format
        }
        return buildAutoMemoryPromptSimple();  // Default simple prompt
    }

    // BRANCH 3: Memory disabled - log telemetry and return null
    recordTelemetry("tengu_memdir_disabled", {
        disabled_by_env_var: isTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
        disabled_by_setting: !isTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) &&
                             getUserSettings().autoMemoryEnabled === false
    });

    // Log team memory disabled if feature flag is set
    if (getFeatureFlag("tengu_herring_clock", false)) {
        recordTelemetry("tengu_team_memdir_disabled", {});
    }

    return null;
}

// Mapping:
// ID1 → getAutoMemory, Z3 → isAutoMemoryEnabled, w8 → getFeatureFlag
// uH → getAutoMemoryDirectory, CD1 → ensureMemoryDirExists, DF6 → recordMemoryDirLoadMetrics
// xv9 → buildBackgroundAgentMemoryPrompt, U14 → buildMemoryIndex, uv9 → buildAutoMemoryPromptSimple
// d → recordTelemetry, t6 → isTruthy, mA → getUserSettings
// F14.isTeamMemoryEnabled → isTeamMemoryEnabled, F14.getTeamMemPath → getTeamMemoryPath
// Qf8.buildExtractModeTypedCombinedPrompt → buildExtractModeTypedCombinedPrompt
// Qf8.buildTypedCombinedMemoryPrompt → buildTypedCombinedMemoryPrompt
// Qf8.buildCombinedMemoryPrompt → buildCombinedMemoryPrompt

### Feature Flag Decision Matrix

| Feature Flag | Purpose | Effect When Enabled |
|-------------|---------|---------------------|
| `tengu_swinburne_dune` | File-based format | Use `buildMemoryIndex` instead of `buildAutoMemoryPromptSimple` |
| `tengu_passport_quail` | Background agent mode | Return extraction-mode prompts, main agent can't write memory |
| `tengu_herring_clock` | Team memory enablement | Enable dual memory system (user + team) |
| `tengu_coral_fern` | Search context | Add "Searching past context" section to memory prompts |

### Prompt Selection Flow

```
getAutoMemory() Entry
        │
        ├─── isTeamMemoryEnabled()?
        │    ├─── YES ───┬─── tengu_passport_quail? ────→ buildExtractModeTypedCombinedPrompt()
        │    │           ├─── tengu_swinburne_dune? ────→ buildTypedCombinedMemoryPrompt()
        │    │           └─── default ───────────────────→ buildCombinedMemoryPrompt()
        │    │
        │    └─── NO
        │
        ├─── isAutoMemoryEnabled()?
        │    ├─── YES ───┬─── tengu_passport_quail? ────→ buildBackgroundAgentMemoryPrompt()
        │    │           ├─── tengu_swinburne_dune? ────→ buildMemoryIndex()
        │    │           └─── default ───────────────────→ buildAutoMemoryPromptSimple()
        │    │
        │    └─── NO ────→ Log telemetry, return null
```

### Integration with System Prompt

The `getAutoMemory` function is registered as a dynamic variable in the system prompt builder:

```javascript
// chunks.169.mjs - Dynamic variable registration
registerDynamicVariable("auto_memory",
    () => getAutoMemory(),  // ID1 - evaluated fresh on every turn
    "MEMORY.md is read from disk each turn"
);
```

**Key insight:** Memory is evaluated fresh on every turn, ensuring the agent always sees the latest file contents. This enables:
- Hot-reload of memory without restart
- Multi-agent coordination (file system is source of truth)
- Immediate visibility of updates made via Write/Edit tools

---

## 9. Memory File Loading via @include System

### 9.1 The xD1 Function

Memory files can also be loaded through the @include system used for CLAUDE.md processing. This provides an alternative loading path with additional features like path filtering and comment stripping.

// ============================================
// xD1 - Memory file loading with @include support
// Location: chunks.84.mjs:495-534
// ============================================

// ORIGINAL (for source lookup):
function xD1(A, q) {
    try {
        let Y = $1().readFileSync(A, { encoding: "utf-8" }),
            z = pv9(A).toLowerCase();
        if (z && !Uv9.has(z)) return k(`Skipping non-text file in @include: ${A}`), null;
        let { content: _, paths: w } = dv9(Y),
            { content: O } = o14(_), $ = O;
        if (q === "AutoMem" || q === "TeamMem") {
            let j = O.trimEnd().split("\n");
            if (j.length > uj) $ = j.slice(0, uj).join("\n") + "\n\n> WARNING: MEMORY.md is ${j.length} lines...";
        }
        let H = $ !== Y;
        return { path: A, type: q, content: $, globs: w, contentDiffersFromDisk: H, rawContent: H ? Y : void 0 }
    } catch (K) {
        let Y = K.code;
        if (Y === "ENOENT" || Y === "EISDIR") return null;
        if (Y === "EACCES") d("tengu_claude_md_permission_error", { is_access_error: 1, has_home_dir: A.includes(c8()) ? 1 : 0 })
    }
    return null
}

// READABLE (for understanding):
function loadMemoryFileWithIncludeSupport(filePath, fileType) {
    try {
        // Step 1: Read file content
        const fs = getFileSystem();
        const rawContent = fs.readFileSync(filePath, { encoding: "utf-8" });

        // Step 2: Check file extension
        const extension = getFileExtension(filePath).toLowerCase();
        if (extension && !ALLOWED_TEXT_EXTENSIONS.has(extension)) {
            logDebug(`Skipping non-text file in @include: ${filePath}`);
            return null;
        }

        // Step 3: Extract frontmatter paths
        const { content, paths } = extractFrontmatterPaths(rawContent);

        // Step 4: Strip HTML comments
        const { content: strippedContent } = stripHtmlComments(content);

        // Step 5: Apply truncation for memory types
        let finalContent = strippedContent;
        if (fileType === "AutoMem" || fileType === "TeamMem") {
            const lines = strippedContent.trimEnd().split("\n");
            if (lines.length > 200) {
                finalContent = lines.slice(0, 200).join("\n") +
                    "\n\n> WARNING: MEMORY.md is " + lines.length +
                    " lines (limit: 200). Only the first 200 lines were loaded...";
            }
        }

        // Step 6: Check if content was modified
        const wasModified = finalContent !== rawContent;

        return {
            path: filePath,
            type: fileType,
            content: finalContent,
            globs: paths,
            contentDiffersFromDisk: wasModified,
            rawContent: wasModified ? rawContent : undefined
        };
    } catch (error) {
        const errorCode = error.code;
        if (errorCode === "ENOENT" || errorCode === "EISDIR") return null;
        if (errorCode === "EACCES") {
            recordTelemetry("tengu_claude_md_permission_error", {
                is_access_error: 1,
                has_home_dir: filePath.includes(getHomeDir()) ? 1 : 0
            });
        }
    }
    return null;
}

// Mapping:
// xD1 → loadMemoryFileWithIncludeSupport
// $1 → getFileSystem
// pv9 → getFileExtension
// Uv9 → ALLOWED_TEXT_EXTENSIONS
// dv9 → extractFrontmatterPaths
// o14 → stripHtmlComments
// uj → 200
// k → logDebug
// d → recordTelemetry
// c8 → getHomeDir

**What it does:** Loads memory files with support for frontmatter paths, HTML comment stripping, and automatic truncation.

**Key differences from standard memory loading:**
- Supports frontmatter with `paths:` field for conditional loading
- Strips HTML comments (`<!-- -->`) from content
- Returns additional metadata (globs, contentDiffersFromDisk)
- Used by CLAUDE.md @include system

**When used:**
- Loading MEMORY.md via @include directives
- Processing memory files referenced in CLAUDE.md
- Loading memory files in AutoMem/TeamMem contexts

---

### 9.2 HTML Comment Stripping (o14)

// ============================================
// o14 - Strip HTML comments from content
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

    // Parse markdown and process
    const lexer = new MarkdownLexer();
    const tokens = lexer.lex(content);
    let result = "";
    let wasStripped = false;
    const commentPattern = /<!--[\s\S]*?-->/g;

    for (const token of tokens) {
        if (token.type === "html") {
            const trimmed = token.raw.trimStart();
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
        result += token.raw;
    }

    return { content: result, stripped: wasStripped };
}

// Mapping: o14 → stripHtmlComments, tW → MarkdownLexer

**What it does:** Removes HTML comments from markdown content while preserving other HTML elements.

**Why strip comments?**
- Comments can contain outdated instructions or notes
- Reduces token count in memory
- Prevents confusion from conflicting instructions
- Allows memory authors to leave private notes

---

## 10. Advanced Telemetry Events

### 10.1 Memory Telemetry Events

| Event | Trigger | Data Fields |
|-------|---------|-------------|
| `tengu_memdir_loaded` | Memory directory scanned | content_length, line_count, was_truncated, memory_type, total_file_count, total_subdir_count |
| `tengu_memdir_disabled` | Memory system disabled | disabled_by_env_var, disabled_by_setting |
| `tengu_team_memdir_disabled` | Team memory disabled | (no additional data) |
| `tengu_claude_md_permission_error` | Permission error reading memory | is_access_error, has_home_dir |
| `tengu_auto_memory_toggled` | User toggles setting | enabled: boolean |

### 10.2 Telemetry Flow

```
Memory Load Flow with Telemetry:
│
├── getAutoMemory() called
│   │
│   ├── Memory enabled?
│   │   ├── YES → continue
│   │   └── NO → record "tengu_memdir_disabled"
│   │                    ↓
│   │                 return null
│   │
│   ├── ensureMemoryDirExists()
│   │   └── Silent fail on error
│   │
│   ├── recordMemoryDirLoadMetrics()
│   │   ├── Async readdir()
│   │   ├── Count files and subdirs
│   │   └── record "tengu_memdir_loaded"
│   │
│   └── Return memory prompt
```

---

## 11. Error Handling Deep-Dive

### 11.1 Error Categories

| Category | Example | Handling |
|----------|---------|----------|
| **ENOENT** | File doesn't exist | Return empty string/null, show "memory is empty" message |
| **EISDIR** | Path is a directory | Return null, skip loading |
| **EACCES** | Permission denied | Return null, log telemetry |
| **ELOOP** | Symlink loop | Throw PathTraversalError |
| **ENOTDIR** | Not a directory | Return null |

### 11.2 Silent Failure Design

Most memory operations use **silent failure** pattern:

```javascript
// Pattern 1: Empty string on error
try {
    content = fs.readFileSync(path, { encoding: "utf-8" });
} catch {
    content = "";  // Silent - treat as empty
}

// Pattern 2: Null on error
try {
    return parseMemoryFile(content);
} catch {
    return null;  // Silent - skip this file
}

// Pattern 3: Log but continue
try {
    await fs.mkdir(dir);
} catch (error) {
    logDebug(`mkdir failed: ${error.code}`);  // Log but don't throw
}
```

**Why silent failures?**
- Memory is non-critical - session can continue without it
- User may not have created MEMORY.md yet
- Permission issues shouldn't crash the agent
- Graceful degradation improves user experience

---

## 12. Performance Optimization Notes

### 12.1 Lazy Evaluation

The `getAutoMemoryDirectory` function uses lazy evaluation:

```javascript
// chunks.50.mjs:2468-2473
// uH is lazily evaluated and cached
uH = memoize(() => {
    const override = getCoworkMemoryPathOverride() ?? getCustomMemoryDirectory();
    if (override) return override;

    const homeDir = getHomeDirectory();
    const projectsDir = joinPath(homeDir, "projects");
    return joinPath(projectsDir, hashPath(getCurrentContextPath()), "memory") + "/";
}, () => getCurrentContextPath());  // Re-evaluate when context changes
```

**Benefit:** Directory path is computed once and cached, recomputed only when working directory changes.

### 12.2 Async Directory Creation

```javascript
// chunks.84.mjs:261-271
async function ensureMemoryDirExists(dir) {
    const fs = getFileSystem();
    try {
        await fs.mkdir(dir);
    } catch (error) {
        // Silent fail - directory likely exists
        logDebug(`ensureMemoryDirExists failed: ${error.code}`);
    }
}
```

**Why async?**
- Non-blocking for main conversation flow
- Handles race conditions with multiple agents
- Allows parallel memory directory creation

### 12.3 Fire-and-Forget Telemetry

```javascript
// chunks.84.mjs:273-288
function recordMemoryDirLoadMetrics(dir, metadata) {
    // No await - fire and forget
    getFileSystem().readdir(dir).then((entries) => {
        // Count files in background
        recordTelemetry("tengu_memdir_loaded", { ...metadata, fileCount, subdirCount });
    }, () => {
        // Still record basic metrics on failure
        recordTelemetry("tengu_memdir_loaded", metadata);
    });
}
```

**Benefit:** Telemetry never blocks memory loading, even if directory scan is slow.