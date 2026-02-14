# Auto Memory Loading Mechanism

## Module Overview

This document analyzes the detailed loading, truncation, and formatting mechanisms for MEMORY.md and topic files.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Auto memory symbols

Key functions:
- `buildMemoryPrompt` (m0A) - Core loading and formatting logic
- `MEMORY_MAX_LINES` (Qu1) - 200-line limit constant
- `MEMORY_MD_FILENAME` (Ua, pN9) - "MEMORY.md" constant

## Related Documentation (Phase 4)

> For in-depth technical analysis:
> - [18_system_reminder_generation.md](./18_system_reminder_generation.md) - Dynamic variable registration, complete prompt building flow
> - [16_error_handling_recovery.md](./16_error_handling_recovery.md) - Error scenarios, dual limits, recovery mechanisms
> - [19_telemetry_monitoring.md](./19_telemetry_monitoring.md) - `tengu_memdir_loaded` event (tracked during loading)

---

## 1. MEMORY.md Loading Algorithm

### 1.1 Complete Loading Flow

// ============================================
// buildMemoryPrompt - Load MEMORY.md and build system prompt section
// Location: chunks.87.mjs:2257-2296
// ============================================

// ORIGINAL (for source lookup):
function m0A(A) {
    let { displayName: q, memoryDir: K, extraGuidelines: Y } = A, z = b1(), w = K + Ua;
    try {
        z.mkdirSync(K)
    } catch {}
    let H = "";
    try {
        H = z.readFileSync(w, { encoding: "utf-8" })
    } catch {}
    let $ = [`# ${q}`, "", `You have a persistent ${q} directory at \`${K}\`...`, "", "Guidelines:", ...];
    if (H.trim()) {
        let O = H.trim().split(`\n`),
            _ = O.length > Qu1,
            J = q === dN9 ? "auto" : "agent";
        cN9(K, { content_length: H.length, line_count: O.length, was_truncated: _, memory_type: J });
        let X = H.trim();
        if (_) X = O.slice(0, Qu1).join(`\n`) + `\n\n> WARNING: ${Ua} is ${O.length} lines...`;
        $.push(`## ${Ua}`, "", X)
    } else $.push(`## ${Ua}`, "", `Your ${Ua} is currently empty...`);
    return $.join(`\n`)
}

// READABLE (for understanding):
function buildMemoryPrompt({ displayName, memoryDir, extraGuidelines }) {
    const fs = getFileSystem();
    const memoryFilePath = memoryDir + "MEMORY.md";

    // STEP 1: Ensure directory exists
    try {
        fs.mkdirSync(memoryDir);
    } catch {}  // Ignore if already exists

    // STEP 2: Read file content
    let content = "";
    try {
        content = fs.readFileSync(memoryFilePath, { encoding: "utf-8" });
    } catch {}  // Empty if file doesn't exist

    // STEP 3: Build instructions header
    let promptLines = [
        `# ${displayName}`,
        "",
        `You have a persistent ${displayName} directory at \`${memoryDir}\`. Its contents persist across conversations.`,
        "",
        "As you work, consult your memory files to build on previous experience...",
        "",
        "Guidelines:",
        `- \`MEMORY.md\` is always loaded — lines after 200 will be truncated`,
        "- Create separate topic files for detailed notes",
        "- Update or remove memories that turn out wrong",
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
        recordMemoryStats(memoryDir, {
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

        promptLines.push(`## MEMORY.md`, "", displayContent);
    } else {
        // STEP 6: Empty file handling
        promptLines.push(
            `## MEMORY.md`,
            "",
            `Your MEMORY.md is currently empty. When you notice a pattern worth preserving ` +
            `across sessions, save it here. Anything in MEMORY.md will be included in your ` +
            `system prompt next time.`
        );
    }

    return promptLines.join("\n");
}

// Mapping:
// m0A → buildMemoryPrompt
// Ua → "MEMORY.md"
// Qu1 → 200
// dN9 → "auto memory"
// cN9 → recordMemoryStats

**Algorithm steps**:

**Phase 1 - Setup** (lines 2257-2264):
1. Extract parameters: `displayName`, `memoryDir`, `extraGuidelines`
2. Get filesystem interface
3. Build memory file path: `{memoryDir}/MEMORY.md`
4. Create directory if missing (silent fail if exists)

**Phase 2 - Read** (lines 2265-2268):
1. Try to read file with UTF-8 encoding
2. Catch any errors (file not found, permissions, etc.)
3. Default to empty string if read fails

**Phase 3 - Format Header** (lines 2269-2275):
1. Build instruction header with display name
2. Add directory path explanation
3. Include usage guidelines
4. Append any extra scope-specific guidelines

**Phase 4 - Content Processing** (lines 2276-2293):
1. If content exists:
   - Split into lines array
   - Check if exceeds 200 lines
   - Record telemetry (length, line count, truncation status)
   - If truncated:
     * Keep only first 200 lines
     * Append warning message with actual line count
   - If not truncated: use full content
2. If content empty:
   - Show helpful "getting started" message
   - Explain MEMORY.md purpose

**Phase 5 - Return** (line 2296):
1. Join all prompt lines with newlines
2. Return as single string for system prompt injection

---

### 1.2 Truncation Warning Format

**Exact warning text** (chunks.87.mjs:2291-2292):

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

## 2. Empty MEMORY.md Handling

**Default message** (chunks.87.mjs:2294):

```
Your MEMORY.md is currently empty. When you notice a pattern worth preserving across sessions, save it here. Anything in MEMORY.md will be included in your system prompt next time.
```

**Purpose**:
- **Onboarding**: Explains what MEMORY.md is for
- **Call to action**: Encourages agent to start saving patterns
- **Immediate feedback**: Shows memory system is active (just empty)

---

## 3. Topic File Loading

### 3.1 Discovery Mechanism

**Topic files are NOT auto-loaded**. Discovery happens via:

1. **Manual linking from MEMORY.md**:
```markdown
## Debugging Patterns

See [debugging.md](./debugging.md) for detailed troubleshooting notes.
```

2. **Grep search** (chunks.87.mjs:2346-2357):
```
When looking for past context:
1. Search topic files in your memory directory:
   Grep with pattern="<term>" path="{memoryDir}" glob="*.md"
```

3. **Direct Read tool usage**:
```javascript
await Read({ file_path: "~/.claude/agent-memory/myagent/debugging.md" });
```

---

### 3.2 Topic File Guidelines (Injected in System Prompt)

**From chunks.87.mjs:2272-2275**:

```
- Create separate topic files (e.g., `debugging.md`, `patterns.md`) for detailed notes and link to them from MEMORY.md
- Organize memory semantically by topic, not chronologically
```

**Recommended structure**:
```
MEMORY.md (index):
  - High-level summaries
  - Links to topic files
  - Quick reference patterns

debugging.md (topic file):
  - Detailed troubleshooting steps
  - Error message catalog
  - Solution examples

patterns.md (topic file):
  - Code patterns with examples
  - Architecture decisions
  - Best practices
```

---

## 4. System Prompt Format

### 4.1 Final Injected Format

```markdown
# auto memory

You have a persistent auto memory directory at `~/.claude/projects/myproject/memory/`. Its contents persist across conversations.

As you work, consult your memory files to build on previous experience. When you encounter a mistake that seems like it could be common, check your auto memory for relevant notes — and if nothing is written yet, record what you learned.

Guidelines:
- `MEMORY.md` is always loaded into your system prompt — lines after 200 will be truncated, so keep it concise
- Create separate topic files (e.g., `debugging.md`, `patterns.md`) for detailed notes and link to them from MEMORY.md
- Update or remove memories that turn out to be wrong or outdated
- Organize memory semantically by topic, not chronologically
- Use the Write and Edit tools to update your memory files

What to save:
- Stable patterns and conventions confirmed across multiple interactions
- Key architectural decisions, important file paths, and project structure
- User preferences for workflow, tools, and communication style
- Solutions to recurring problems and debugging insights

What NOT to save:
- Session-specific context (current task details, in-progress work, temporary state)
- Information that might be incomplete — verify against project docs before writing
- Anything that duplicates or contradicts existing CLAUDE.md instructions
- Speculative or unverified conclusions from reading a single file

Explicit user requests:
- When the user asks you to remember something across sessions (e.g., "always use bun", "never auto-commit"), save it — no need to wait for multiple interactions
- When the user asks to forget or stop remembering something, find and remove the relevant entries from your memory files

## MEMORY.md

[Content here or "Your MEMORY.md is currently empty..." message]
```

---

## 5. Telemetry Tracking

### 5.1 Memory Statistics

**Function**: `recordMemoryStats()` (cN9, chunks.87.mjs:2282-2287)

**Tracked metrics**:
```javascript
{
    content_length: number,     // Bytes in MEMORY.md
    line_count: number,         // Total lines (even if truncated)
    was_truncated: boolean,     // True if > 200 lines
    memory_type: "auto" | "agent"  // Auto memory vs agent-specific
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
| File read (200 lines) | O(N) | 1-5ms |
| Line split | O(N) | <1ms |
| Truncation check | O(1) | <1ms |
| String join | O(N) | <1ms |
| **Total** | **O(N)** | **2-10ms** |

**Scalability**:
- **200-line limit**: Ensures predictable performance
- **No caching**: Slight overhead, but always fresh
- **Negligible impact**: <10ms per turn

---

### 6.2 Disk I/O Optimization

**Synchronous read** (chunks.87.mjs:2267):
```javascript
content = fs.readFileSync(memoryFilePath, { encoding: "utf-8" });
```

**Why synchronous**:
- **Simplicity**: No async/await complexity in prompt building
- **Fast enough**: Sub-10ms for typical files
- **Blocking acceptable**: Happens before LLM API call (not user-facing latency)

**Alternative considered**: Asynchronous read with caching
- **Rejected**: Adds complexity for minimal gain

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
- **Directory creation**: Attempted on next write

---

### 7.2 Permission Errors

**Same silent catch** - treats as empty file

**Effect**:
- **Graceful degradation**: Agent continues without memory
- **User notification**: Via empty message (user may realize file inaccessible)
- **No crash**: System remains stable

---

## Summary

The memory loading mechanism is **simple, robust, and predictable**:

1. **Synchronous file read**: Fast enough for typical use
2. **Hard 200-line truncation**: Predictable performance and context usage
3. **Silent error handling**: Graceful degradation on failures
4. **Clear warnings**: Users notified when truncation occurs
5. **Telemetry aware**: Tracks usage patterns for optimization
6. **Dynamic every turn**: Always fresh from disk

**Key trade-off**: Sacrifices caching optimization for simplicity and freshness, betting that sub-10ms disk read is acceptable overhead.
