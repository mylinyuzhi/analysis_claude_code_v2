# Auto Memory (MEMORY.md) Logic Analysis

## Module Overview

The Auto Memory system provides Claude Code with persistent knowledge across sessions. It revolves around a special file, `MEMORY.md`, which is automatically managed and injected into the system prompt.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions and constants in this document:
- `MEMORY_MD_FILENAME` (pN9 / Ua) - The filename "MEMORY.md"
- `MEMORY_MAX_LINES` (Qu1) - The 200-line hard limit for prompt injection
- `getMemoryContext` (F0A) - Function that reads and prepares memory content
- `buildMemoryPrompt` (m0A) - Function that constructs the memory section of the system prompt

## Memory Lifecycle

1. **Storage**: Memory files are stored in a persistent directory (e.g., `~/.claude/memory/`).
2. **Reading**: At the start of every turn, the system calls `getMemoryContext`.
3. **Truncation**: If `MEMORY.md` exceeds 200 lines, only the first 200 are kept.
4. **Injection**: The content is wrapped in a `<memory>` tag and added to the system prompt.
5. **Modification**: The agent uses standard `Write` or `Edit` tools to update `MEMORY.md` as it learns new patterns or user preferences.

## Truncation and Warning Logic

**What it does:** Prevents the system prompt from being overwhelmed by a massive memory file, while encouraging the agent to use a modular "Topic" approach.

**How it works:**
1. Loads all lines from `MEMORY.md`.
2. Checks if `lineCount > 200`.
3. If yes, slices the array to `[0, 200]`.
4. Appends a warning message to the injected prompt explaining that content was truncated.

```javascript
// ============================================
// buildMemoryPrompt - Logic for prompt construction and truncation
// Location: chunks.87.mjs:2272-2295
// ============================================

// ORIGINAL (for source lookup):
let $ = [`# ${q}`, "", `You have a persistent ${q} directory at \`${K}\`...`, ...];
let O = await loadMemoryLines(Ua);
let _ = O.length > Qu1;
let X = O.join("\n");
if (_) {
    X = O.slice(0, Qu1).join("\n");
    X += `\n\n> WARNING: ${Ua} is ${O.length} lines (limit: ${Qu1}). Only the first ${Qu1} lines were loaded...`;
}

// READABLE (for understanding):
async function buildMemoryPrompt(memoryDir, memoryTitle) {
    const memoryFilePath = "MEMORY.md";
    const MAX_LINES = 200;
    
    let instructions = [
        `# ${memoryTitle}`,
        `You have a persistent memory directory at \`${memoryDir}\`...`,
        "Guidelines:",
        `- \`${memoryFilePath}\` is always loaded... lines after ${MAX_LINES} will be truncated`,
        "- Create separate topic files (e.g., debugging.md) for detailed notes..."
    ];

    let lines = await readLines(memoryFilePath);
    let isTruncated = lines.length > MAX_LINES;
    let content = lines.join("\n");

    if (isTruncated) {
        content = lines.slice(0, MAX_LINES).join("\n");
        content += `\n\n> WARNING: ${memoryFilePath} is ${lines.length} lines (limit: ${MAX_LINES}). ` +
                   `Only the first ${MAX_LINES} lines were loaded. Move detailed content into ` +
                   `separate topic files and keep ${memoryFilePath} as a concise index.`;
    }

    return { instructions, content };
}

// Mapping: Qu1→MAX_LINES, Ua→memoryFilePath, O→lines, _→isTruncated, X→content
```

## Strategy: Indexing vs. Storage

The system explicitly instructs the agent:
- **`MEMORY.md`** should be a **concise index** of high-level patterns and links.
- **Topic Files** (e.g., `patterns.md`, `user_preferences.md`) should store the **detailed content**.
- This ensures that the core context window is used efficiently while still allowing the agent to "Read" deeper context when needed via the `Read` tool on specific topic files.

**Key insight:** The 200-line limit is a deliberate design choice to prevent "memory bloat" and force the model to organize its long-term knowledge hierarchically.
