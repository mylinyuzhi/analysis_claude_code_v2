# Auto Memory Loading Mechanism

## Module Overview

This document analyzes the detailed loading, truncation, and formatting mechanisms for MEMORY.md and topic files.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Auto memory symbols

Key functions:
- `buildMemoryPrompt` (`Q14`) - Core loading and formatting logic (chunks.84.mjs:290)
- `buildAutoMemoryPromptSimple` (`uv9`) - Simplified prompt builder (chunks.84.mjs:367)
- `buildMemoryIndex` (`U14`) - Index-style prompt builder (chunks.84.mjs:324)
- `buildBackgroundAgentMemoryPrompt` (`xv9`) - Background agent mode (chunks.84.mjs:329)
- `MEMORY_MAX_LINES` (`uj`) - 200-line limit constant
- `MEMORY_MD_FILENAME` (`o2`) - "MEMORY.md" constant

## Related Documentation (Phase 4)

> For in-depth technical analysis:
> - [18_system_reminder_generation.md](./18_system_reminder_generation.md) - Dynamic variable registration, complete prompt building flow
> - [16_error_handling_recovery.md](./16_error_handling_recovery.md) - Error scenarios, dual limits, recovery mechanisms
> - [19_telemetry_monitoring.md](./19_telemetry_monitoring.md) - `tengu_memdir_loaded` event (tracked during loading)

---

## 1. MEMORY.md Loading Algorithm

### 1.1 Main Entry Point

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
    const isEnabled = isAutoMemoryEnabled();
    const useFileBasedFormat = getFeatureFlag("tengu_swinburne_dune", false);

    // Branch 1: Team memory enabled (dual memory system)
    if (isTeamMemoryEnabled()) {
        const userMemoryDir = getAutoMemoryDirectory();
        const teamMemoryDir = getTeamMemoryPath();

        await ensureMemoryDirExists(teamMemoryDir);
        recordMemoryDirLoadMetrics(userMemoryDir, { memory_type: "auto" });
        recordMemoryDirLoadMetrics(teamMemoryDir, { memory_type: "team" });

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

    if (getFeatureFlag("tengu_herring_clock", false)) {
        recordTelemetry("tengu_team_memdir_disabled", {});
    }

    return null;
}

// Mapping:
// ID1 → getAutoMemory
// Z3 → isAutoMemoryEnabled
// uH → getAutoMemoryDirectory
// CD1 → ensureMemoryDirExists
// DF6 → recordMemoryDirLoadMetrics
// uv9 → buildAutoMemoryPromptSimple
// U14 → buildMemoryIndex
// xv9 → buildBackgroundAgentMemoryPrompt

---

### 1.2 Simple Prompt Builder

// ============================================
// buildAutoMemoryPromptSimple - Simple memory prompt without file reading
// Location: chunks.84.mjs:367-371
// ============================================

// ORIGINAL (for source lookup):
function uv9() {
    let A = uH();
    return ["# auto memory", "", `You have a persistent auto memory directory at \`${A}\`...`,
            "", "As you work, consult your memory files to build on previous experience.",
            ...].join("\n")
}

// READABLE (for understanding):
function buildAutoMemoryPromptSimple() {
    const memoryDir = getAutoMemoryDirectory();

    return [
        "# auto memory",
        "",
        `You have a persistent auto memory directory at \`${memoryDir}\`...`,
        "",
        "As you work, consult your memory files to build on previous experience.",
        "",
        "## How to save memories:",
        "- Organize memory semantically by topic, not chronologically",
        "- Use the Write and Edit tools to update your memory files",
        "- `MEMORY.md` is always loaded — lines after 200 will be truncated",
        "- Create separate topic files for detailed notes",
        "- Update or remove memories that turn out to be wrong",
        "",
        "## What to save:",
        "- Stable patterns and conventions confirmed across multiple interactions",
        "- Key architectural decisions, important file paths, and project structure",
        "- User preferences for workflow, tools, and communication style",
        "- Solutions to recurring problems and debugging insights",
        "",
        "## What NOT to save:",
        "- Session-specific context (current task details, in-progress work, temporary state)",
        "- Information that might be incomplete — verify against project docs before writing",
        "- Anything that duplicates or contradicts existing CLAUDE.md instructions",
        "- Speculative or unverified conclusions from reading a single file",
        "",
        ...buildSearchContextSection(memoryDir)
    ].join("\n");
}

// Mapping: uv9 → buildAutoMemoryPromptSimple, uH → getAutoMemoryDirectory

---

### 1.3 Full Prompt Builder with File Reading

// ============================================
// buildMemoryPrompt - Load MEMORY.md and build system prompt section
// Location: chunks.84.mjs:290-322
// ============================================

// ORIGINAL (for source lookup):
function Q14(A) {
    let { displayName: q, memoryDir: K, extraGuidelines: Y } = A, z = $1(), _ = K + o2, w = "";
    try { z.mkdirSync(K) } catch {}
    try { w = z.readFileSync(_, { encoding: "utf-8" }) } catch {}
    let O = [`# ${q}`, "", `You have a persistent ${q} directory at \`${K}\`...`, ...];
    if (w.trim()) {
        let $ = w.trim().split("\n"), H = $.length > uj, j = q === p14 ? "auto" : "agent";
        DF6(K, { content_length: w.length, line_count: $.length, was_truncated: H, memory_type: j });
        let J = w.trim();
        if (H) J = $.slice(0, uj).join("\n") + "\n\n> WARNING: ${o2} is ${$.length} lines...";
        O.push(`## ${o2}`, "", J)
    } else O.push(`## ${o2}`, "", `Your ${o2} is currently empty...`);
    return O.join("\n")
}

// Mapping: Q14 → buildMemoryPrompt, o2 → "MEMORY.md", uj → 200, p14 → "auto memory", DF6 → recordMemoryDirLoadMetrics

**Algorithm steps**:

**Phase 1 - Setup** (lines 290-298):
1. Extract parameters: `displayName`, `memoryDir`, `extraGuidelines`
2. Get filesystem interface
3. Build memory file path: `{memoryDir}/MEMORY.md`
4. Create directory if missing (silent fail if exists)

**Phase 2 - Read** (lines 296-300):
1. Try to read file with UTF-8 encoding
2. Catch any errors (file not found, permissions, etc.)
3. Default to empty string if read fails

**Phase 3 - Format Header** (lines 301-302):
1. Build instruction header with display name
2. Add directory path explanation
3. Include usage guidelines
4. Append any extra scope-specific guidelines

**Phase 4 - Content Processing** (lines 303-318):
1. If content exists:
   - Split into lines array
   - Check if exceeds 200 lines
   - Record telemetry (length, line count, truncation status)
   - If truncated: keep only first 200 lines, append warning
   - If not truncated: use full content
2. If content empty: show helpful "getting started" message

**Phase 5 - Return** (line 320-322):
1. Join all prompt lines with newlines
2. Return as single string for system prompt injection

---

## 2. Truncation Warning Format

### 2.1 Warning Trigger Condition

```javascript
if (lines.length > MEMORY_MAX_LINES) {
  // Trigger truncation and warning
}
```

### 2.2 Warning Message Template

```markdown
> WARNING: MEMORY.md is {N} lines (limit: 200).
  Only the first 200 lines were loaded.
  Move detailed content into separate topic files and keep MEMORY.md as a concise index.
```

**Placement**: Appended after the 200th line of content, making the warning visible to the agent in context.

---

## 3. Empty MEMORY.md Handling

### 3.1 Default Message

```markdown
Your MEMORY.md is currently empty. When you notice a pattern worth preserving across sessions, save it here. Anything in MEMORY.md will be included in your system prompt next time.
```

**Purpose**:
- **Onboarding**: Explains what MEMORY.md is for
- **Call to action**: Encourages agent to start saving patterns
- **Immediate feedback**: Shows memory system is active (just empty)

---

## 4. Topic File Loading

### 4.1 Discovery Mechanism

**Topic files are NOT auto-loaded**. Discovery happens via:

1. **Manual linking from MEMORY.md**:
```markdown
## Debugging Patterns

See [debugging.md](./debugging.md) for detailed troubleshooting notes.
```

2. **Grep search** (via `buildSearchContextSection` - `Dt` function):
```
When looking for past context:
1. Search topic files in your memory directory:
   Grep with pattern="<term>" path="{memoryDir}" glob="*.md"
```

3. **Direct Read tool usage**:
```javascript
await Read({ file_path: "~/.claude/projects/X/memory/debugging.md" });
```

---

### 4.2 Search Context Section

// ============================================
// buildSearchContextSection - Build search guidance for memory
// Location: chunks.84.mjs:373-380
// ============================================

// ORIGINAL (for source lookup):
function Dt(A) {
    if (!w8("tengu_coral_fern", !1)) return [];
    let q = mj(AA()),
        K = n$(),
        Y = K ? `grep -rn "<search term>" ${A} --include="*.md"` : `${N9} with pattern="<search term>" path="${A}" glob="*.md"`,
        z = K ? `grep -rn "<search term>" ${q}/ --include="*.jsonl"` : `${N9} with pattern="<search term>" path="${q}/" glob="*.jsonl"`;
    return ["## Searching past context", "", "When looking for past context:",
            "1. Search topic files in your memory directory:", "```", Y, "```",
            "2. Session transcript logs (last resort — large files, slow):", "```", z, "```",
            "Use narrow search terms (error messages, file paths, function names) rather than broad keywords.", ""]
}

// READABLE (for understanding):
function buildSearchContextSection(memoryDir) {
    if (!getFeatureFlag("tengu_coral_fern", false)) return [];

    const transcriptDir = getTranscriptBasePath();
    const isTerminalMode = isTerminalSession();

    const topicSearchCmd = isTerminalMode
        ? `grep -rn "<search term>" ${memoryDir} --include="*.md"`
        : `Grep with pattern="<search term>" path="${memoryDir}" glob="*.md"`;

    const transcriptSearchCmd = isTerminalMode
        ? `grep -rn "<search term>" ${transcriptDir}/ --include="*.jsonl"`
        : `Grep with pattern="<search term>" path="${transcriptDir}/" glob="*.jsonl"`;

    return [
        "## Searching past context",
        "",
        "When looking for past context:",
        "1. Search topic files in your memory directory:",
        "```",
        topicSearchCmd,
        "```",
        "2. Session transcript logs (last resort — large files, slow):",
        "```",
        transcriptSearchCmd,
        "```",
        "Use narrow search terms (error messages, file paths, function names) rather than broad keywords.",
        ""
    ];
}

// Mapping: Dt → buildSearchContextSection, w8 → getFeatureFlag, mj → getTranscriptBasePath, n$ → isTerminalSession

---

## 5. Telemetry Tracking

### 5.1 Memory Statistics

**Function**: `recordMemoryDirLoadMetrics()` (`DF6`, chunks.84.mjs:273-288)

// ORIGINAL (for source lookup):
function DF6(A, q) {
    $1().readdir(A).then((Y) => {
        let z = 0, _ = 0;
        for (let w of Y)
            if (w.isFile()) z++;
            else if (w.isDirectory()) _++;
        d("tengu_memdir_loaded", { ...q, total_file_count: z, total_subdir_count: _ })
    }, () => { d("tengu_memdir_loaded", q) })
}

// READABLE (for understanding):
function recordMemoryDirLoadMetrics(memoryDir, metadata) {
    getFileSystem().readdir(memoryDir).then((entries) => {
        let fileCount = 0, subdirCount = 0;
        for (let entry of entries) {
            if (entry.isFile()) fileCount++;
            else if (entry.isDirectory()) subdirCount++;
        }
        recordTelemetry("tengu_memdir_loaded", {
            ...metadata,
            total_file_count: fileCount,
            total_subdir_count: subdirCount
        });
    }, () => {
        // If readdir fails, still log basic metadata
        recordTelemetry("tengu_memdir_loaded", metadata);
    });
}

// Mapping: DF6 → recordMemoryDirLoadMetrics, $1 → getFileSystem, d → recordTelemetry

**Tracked metrics**:
```javascript
{
    content_length: number,     // Bytes in MEMORY.md
    line_count: number,         // Total lines (even if truncated)
    was_truncated: boolean,     // True if > 200 lines
    memory_type: "auto" | "agent" | "team",  // Memory type
    total_file_count: number,   // Files in directory
    total_subdir_count: number  // Subdirectories
}
```

**Use cases**:
- Monitor memory file growth
- Alert on excessive truncation
- Compare auto vs agent memory usage
- Debug memory loading issues

---

## 6. Performance Characteristics

### 6.1 Loading Latency

| Operation | Complexity | Time (Estimate) |
|-----------|------------|-----------------|
| Directory check | O(1) | <1ms |
| Directory creation | O(1) | 1-5ms |
| File read (200 lines) | O(N) | 1-5ms |
| Line split | O(N) | <1ms |
| Truncation check | O(1) | <1ms |
| String join | O(N) | <1ms |
| **Total** | **O(N)** | **3-15ms** |

**Scalability**:
- **200-line limit**: Ensures predictable performance
- **No caching**: Slight overhead, but always fresh
- **Negligible impact**: <15ms per turn

---

### 6.2 Disk I/O Optimization

**Synchronous read** (chunks.84.mjs:297-300):
```javascript
content = fs.readFileSync(memoryFilePath, { encoding: "utf-8" });
```

**Why synchronous**:
- **Simplicity**: No async/await complexity in prompt building
- **Fast enough**: Sub-5ms for typical files
- **Blocking acceptable**: Happens before LLM API call (not user-facing latency)

**Note**: The entry point `ID1` is async, but the actual file read is sync within `Q14`.

---

## 7. Error Handling

### 7.1 File Not Found

```javascript
try {
    content = fs.readFileSync(memoryFilePath, { encoding: "utf-8" });
} catch {
    // Silent catch - defaults to empty string
}
```

**Behavior**:
- **No error thrown**: System continues normally
- **Empty content**: Shows "Your MEMORY.md is currently empty" message
- **Directory creation**: Attempted on next turn

---

### 7.2 Permission Errors

**Same silent catch** - treats as empty file

**Effect**:
- **Graceful degradation**: Agent continues without memory
- **User notification**: Via empty message (user may realize file inaccessible)
- **No crash**: System remains stable

---

## 8. File-Based Memory Prompt Builders

### 8.1 buildMemoryIndex (U14) - Index-Only Prompt

**What it does**: Generates a prompt for file-based memory format WITHOUT reading MEMORY.md. Used when `tengu_swinburne_dune` flag is enabled.

// ============================================
// buildMemoryIndex - File-based memory prompt (no file read)
// Location: chunks.84.mjs:324-327
// ============================================

// ORIGINAL (for source lookup):
function U14(A, q, K) {
    let Y = [`# ${A}`, "", `You have a persistent, file-based memory system at \`${q}\`. ${Uf8}`, "",
            "You should build up this memory system over time...",
            "If the user explicitly asks you to remember something, save it immediately...",
            ...RD1, ..._36, "",
            "## How to save memories", "",
            "Saving a memory is a two-step process:", "",
            "**Step 1** — write the memory to its own file (e.g., `user_role.md`, `feedback_testing.md`) using this frontmatter format:",
            "", ...w36, "",
            `**Step 2** — add a pointer to that file in \`${o2}\`...`,
            `- \`${o2}\` is always loaded into your conversation context — lines after ${uj} will be truncated...`,
            ...K ?? [], ""];
    return Y.push(...Dt(q)), Y
}

// READABLE (for understanding):
function buildMemoryIndex(displayName, memoryDir, extraGuidelines) {
    const promptLines = [
        `# ${displayName}`,
        "",
        `You have a persistent, file-based memory system at \`${memoryDir}\`. Both directories already exist.`,
        "",
        "You should build up this memory system over time...",
        "",
        "If the user explicitly asks you to remember something, save it immediately...",
        "",
        ...SCOPE_TYPE_DEFINITIONS,    // RD1 - scope types
        ...MEMORY_TYPE_DEFINITIONS,     // _36 - memory types
        "",
        "## How to save memories",
        "",
        "Saving a memory is a two-step process:",
        "",
        "**Step 1** — write the memory to its own file using frontmatter format:",
        // w36 - frontmatter template with name, description fields
        "",
        "**Step 2** — add a pointer to that file in MEMORY.md",
        "- MEMORY.md is always loaded (200-line limit)",
        ...extraGuidelines ?? []
    ];

    promptLines.push(...buildSearchContextSection(memoryDir));
    return promptLines;  // Returns array, NOT joined string
}

// Mapping:
// U14 → buildMemoryIndex
// A → displayName
// q → memoryDir
// K → extraGuidelines
// RD1 → SCOPE_TYPE_DEFINITIONS
// _36 → MEMORY_TYPE_DEFINITIONS
// w36 → FRONTMATTER_TEMPLATE
// o2 → "MEMORY.md"
// uj → 200
// Dt → buildSearchContextSection

**Key difference from Q14 (buildMemoryPrompt)**:
- `U14` does NOT read MEMORY.md from disk
- `U14` returns an array of lines, NOT a joined string
- `U14` uses frontmatter format instructions (RD1, _36, w36)
- `U14` is used for file-based format (`tengu_swinburne_dune` flag)

---

### 8.2 buildAgentMemoryPrompt (d14) - File-Based WITH File Read

**What it does**: Combines file-based format with actual MEMORY.md reading. Used for agent memory.

// ============================================
// buildAgentMemoryPrompt - File-based prompt WITH file reading
// Location: chunks.84.mjs:333-365
// ============================================

// ORIGINAL (for source lookup):
function d14(A) {
    let { displayName: q, memoryDir: K, extraGuidelines: Y } = A,
        z = $1(), _ = K + o2, w = "";
    try { w = z.readFileSync(_, { encoding: "utf-8" }) } catch {}
    let O = U14(q, K, Y);  // Build base prompt from U14
    if (w.trim()) {
        let $ = w.trim().split("\n"),
            H = $.length > uj,
            j = q === p14 ? "auto" : "agent";
        DF6(K, { content_length: w.length, line_count: $.length, was_truncated: H, memory_type: j });
        let J = w.trim();
        if (H) J = $.slice(0, uj).join("\n") + "\n\n> WARNING: ${o2} is ${$.length} lines...";
        O.push(`## ${o2}`, "", J)
    } else O.push(`## ${o2}`, "", `Your ${o2} is currently empty. When you save new memories, they will appear here.`);
    return O.join("\n")
}

// READABLE (for understanding):
function buildAgentMemoryPrompt({ displayName, memoryDir, extraGuidelines }) {
    const fs = getFileSystem();
    const memoryFilePath = memoryDir + "MEMORY.md";

    // Step 1: Read MEMORY.md (silent fail if doesn't exist)
    let content = "";
    try {
        content = fs.readFileSync(memoryFilePath, { encoding: "utf-8" });
    } catch {}

    // Step 2: Build base prompt using U14 (file-based format)
    const promptLines = buildMemoryIndex(displayName, memoryDir, extraGuidelines);

    // Step 3: Add MEMORY.md content if exists
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

        // Truncate if needed
        let displayContent = content.trim();
        if (wasTruncated) {
            displayContent = lines.slice(0, 200).join("\n") +
                "\n\n> WARNING: MEMORY.md is " + lines.length + " lines (limit: 200)...";
        }

        promptLines.push("## MEMORY.md", "", displayContent);
    } else {
        promptLines.push("## MEMORY.md", "",
            "Your MEMORY.md is currently empty. When you save new memories, they will appear here.");
    }

    // Step 4: Return joined string
    return promptLines.join("\n");
}

// Mapping:
// d14 → buildAgentMemoryPrompt
// U14 → buildMemoryIndex
// $1 → getFileSystem
// DF6 → recordMemoryDirLoadMetrics
// o2 → "MEMORY.md"
// uj → 200
// p14 → "auto memory"

**Key difference from U14**:
- `d14` DOES read MEMORY.md from disk
- `d14` returns a joined string, NOT an array
- `d14` calls `U14` first to get the base prompt, then appends content

**When to use each**:
- `U14` (buildMemoryIndex): When you want file-based format WITHOUT reading the file
- `d14` (buildAgentMemoryPrompt): When you want file-based format WITH reading the file
- `Q14` (buildMemoryPrompt): Standard format WITH reading the file (non-file-based)

---

## Summary

The memory loading mechanism is **simple, robust, and predictable**:

1. **Async entry point**: `ID1` (getAutoMemory) handles multiple memory modes
2. **Synchronous file read**: Fast enough for typical use
3. **Hard 200-line truncation**: Predictable performance and context usage
4. **Silent error handling**: Graceful degradation on failures
5. **Clear warnings**: Users notified when truncation occurs
6. **Telemetry aware**: Tracks usage patterns for optimization
7. **Dynamic every turn**: Always fresh from disk
8. **Feature flag driven**: Different formats for different use cases

**Key trade-off**: Sacrifices caching optimization for simplicity and freshness, betting that sub-15ms disk read is acceptable overhead.