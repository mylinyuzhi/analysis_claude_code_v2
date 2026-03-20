# Auto Memory Architecture

## Overview

Auto Memory provides Claude Code with persistent, cross-session knowledge storage. It uses a structured markdown file (`MEMORY.md`) that is automatically injected into the system prompt at the beginning of each turn. This allows the model to "remember" user preferences, project patterns, and debugging insights across restarts.

## Key Components

### Persistent Storage

Memory is stored in three distinct scopes:

1. **User Scope**: `~/.claude/agent-memory/` - Shared across all projects.
2. **Project Scope**: `.claude/agent-memory/` - Specific to the current project, meant to be committed to version control.
3. **Local Project Scope**: `.claude/agent-memory-local/` - Project-specific but excluded from version control (machine-local patterns).

### The MEMORY.md File

- **Filename**: `MEMORY.md` (`o2` / `BG3`)
- **Limit**: 200 lines (`uj`). Content beyond this is truncated.
- **Role**: Serves as a concise index and "active" memory. Detailed notes should be moved to "topic files" (e.g., `debugging.md`, `patterns.md`).
- **Freshness**: Last-modified timestamp tracked and surfaced in system prompt (v2.1.76).

### Integration Flow

The system registers `auto_memory` as a dynamic instruction provider. Each turn, the following happens:

1. **Detection**: The system checks if auto-memory is enabled (`Z3`).
2. **Loading**: `getAutoMemory` (`ID1`) reads `MEMORY.md` from disk.
3. **Truncation**: If the file exceeds 200 lines, it is truncated with a warning message (`Q14`).
4. **Injection**: The content is wrapped in XML-like instructions and added to the system prompt.

### Custom Memory Directory (v2.1.59)

Users can specify `autoMemoryDirectory` in settings to override the default project-hash path. This enables:
- Shared team memory at a fixed path
- Cross-project memory consolidation
- Integration with custom directory structures

## Implementation Details

### [Algorithm] Memory Truncation & Loading

**What it does**: Reads the memory file and ensures it doesn't overwhelm the context window.

**How it works**:
1. Locates the correct memory directory based on scope (`uH`).
2. Checks `autoMemoryDirectory` setting for custom override (v2.1.59).
3. Reads the full content of `MEMORY.md`.
4. Reads file stat for last-modified timestamp (v2.1.76).
5. Splits by line breaks.
6. If lines > 200:
   - Takes only the first 200 lines.
   - Appends a warning: "> WARNING: MEMORY.md is [N] lines... Move detailed content into separate topic files."
7. If file is empty:
   - Appends a hint: "Your MEMORY.md is currently empty... save a pattern here."

**Why this approach**:
By hard-limiting the lines, the system ensures that "memory" doesn't consume the entire prompt budget. Encouraging "topic files" shifts the burden of retrieval to searching (via `Grep`) rather than constant context injection.

### [Decision] Topic Files for Depth

**Why this approach**:
LLMs have finite context. By using `MEMORY.md` as an index and `topic files` for detail, the agent can maintain a high-level map of its knowledge while only "recalling" (reading) the details when a specific topic becomes relevant.

## Code Snippets

// ============================================
// buildMemoryPrompt - Builds the string to be injected into the system prompt
// Location: chunks.84.mjs:290-322
// ============================================

// ORIGINAL (for source lookup):
function Q14(A) {
    let { displayName: q, memoryDir: K, extraGuidelines: Y } = A, z = $1(), _ = K + o2, w = "";
    try { z.mkdirSync(K) } catch {}
    try { w = z.readFileSync(_, { encoding: "utf-8" }) } catch {}
    let O = [`# ${q}`, "", `You have a persistent ${q} directory at \`${K}\`...`, ...];
    if (w.trim()) {
        let $ = w.trim().split("\n"), H = $.length > uj;
        let J = w.trim();
        if (H) J = $.slice(0, uj).join("\n") + "\n\n> WARNING: " + o2 + " is " + $.length + " lines...";
        O.push("## " + o2, "", J)
    }
    return O.join("\n")
}

// READABLE (for understanding):
function buildMemoryPrompt(params) {
    const { displayName, memoryDir, extraGuidelines } = params;
    const fs = getFileSystem();
    const memoryFilePath = memoryDir + MEMORY_MD_FILENAME;

    ensureDirExists(memoryDir);
    let content = "";
    try {
        content = fs.readFileSync(memoryFilePath, "utf-8");
    } catch {}

    let promptLines = [
        `# ${displayName}`,
        `You have a persistent memory directory at \`${memoryDir}\`.`,
        ...INSTRUCTIONS
    ];

    if (content.trim()) {
        const lines = content.trim().split("\n");
        const isTooLong = lines.length > MEMORY_MAX_LINES;
        let displayedContent = content.trim();

        if (isTooLong) {
            displayedContent = lines.slice(0, MEMORY_MAX_LINES).join("\n") +
                `\n\n> WARNING: MEMORY.md is too long (${lines.length} lines). Truncated to ${MEMORY_MAX_LINES}.`;
        }
        promptLines.push(`## ${MEMORY_MD_FILENAME}`, "", displayedContent);
    }
    return promptLines.join("\n");
}

// Mapping: Q14→buildMemoryPrompt, A→params, q→displayName, K→memoryDir, o2→MEMORY_MD_FILENAME, uj→MEMORY_MAX_LINES

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions:
- `getAutoMemory` (`ID1`) - Async entry point for the memory system.
- `buildMemoryPrompt` (`Q14`) - Core logic for file reading and truncation.
- `MEMORY_MD_FILENAME` (`o2` / `BG3`) - "MEMORY.md".
- `MEMORY_MAX_LINES` (`uj`) - 200.

## Location References

- `chunks.84.mjs:415` - Constant definitions.
- `chunks.84.mjs:290` - `Q14` implementation.
- `chunks.169.mjs:231` - Registration in the dynamic prompt list.

## Changelog References

- **v2.1.32**: Initial implementation
- **v2.1.33**: Topic files, remote memory, frontmatter support
- **v2.1.59**: `autoMemoryDirectory` setting for custom paths
- **v2.1.76**: Last-modified timestamp tracking in prompt header
