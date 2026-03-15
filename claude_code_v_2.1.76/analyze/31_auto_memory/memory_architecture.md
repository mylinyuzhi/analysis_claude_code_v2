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

- **Filename**: `MEMORY.md` (`pN9` / `Ua`)
- **Limit**: 200 lines (`Qu1`). Content beyond this is truncated.
- **Role**: Serves as a concise index and "active" memory. Detailed notes should be moved to "topic files" (e.g., `debugging.md`, `patterns.md`).

### Integration Flow

The system registers `auto_memory` as a dynamic instruction provider. Each turn, the following happens:

1. **Detection**: The system checks if auto-memory is enabled (`y2`).
2. **Loading**: `getMemoryContext` (`F0A`) reads `MEMORY.md` from disk.
3. **Truncation**: If the file exceeds 200 lines, it is truncated with a warning message (`m0A`).
4. **Injection**: The content is wrapped in XML-like instructions and added to the system prompt.

## Implementation Details

### [Algorithm] Memory Truncation & Loading

**What it does**: Reads the memory file and ensures it doesn't overwhelm the context window.

**How it works**:
1. Locates the correct memory directory based on scope (`mu1`).
2. Reads the full content of `MEMORY.md`.
3. Splits by line breaks.
4. If lines > 200:
   - Takes only the first 200 lines.
   - Appends a warning: "> WARNING: MEMORY.md is [N] lines... Move detailed content into separate topic files."
5. If file is empty:
   - Appends a hint: "Your MEMORY.md is currently empty... save a pattern here."

**Why this approach**:
By hard-limiting the lines, the system ensures that "memory" doesn't consume the entire prompt budget. Encouraging "topic files" shifts the burden of retrieval to searching (via `Grep`) rather than constant context injection.

### [Decision] Topic Files for Depth

**Why this approach**:
LLMs have finite context. By using `MEMORY.md` as an index and `topic files` for detail, the agent can maintain a high-level map of its knowledge while only "recalling" (reading) the details when a specific topic becomes relevant.

## Code Snippets

// ============================================
// buildMemoryPrompt - Builds the string to be injected into the system prompt
// Location: chunks.87.mjs:2257-2297
// ============================================

// ORIGINAL (for source lookup):
function m0A(A) {
    let { displayName: q, memoryDir: K, extraGuidelines: Y } = A, z = b1(), w = K + Ua;
    try { z.mkdirSync(K) } catch {}
    let H = "";
    try { H = z.readFileSync(w, { encoding: "utf-8" }) } catch {}
    let $ = [`# ${q}`, "", `You have a persistent ${q} directory at \`${K}\`...`, ...];
    if (H.trim()) {
        let O = H.trim().split("\n"), _ = O.length > Qu1;
        let X = H.trim();
        if (_) X = O.slice(0, Qu1).join("\n") + "\n\n> WARNING: " + Ua + " is " + O.length + " lines...";
        $.push("## " + Ua, "", X)
    }
    return $.join("\n")
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

// Mapping: m0A→buildMemoryPrompt, A→params, q→displayName, K→memoryDir, Ua→MEMORY_MD_FILENAME, Qu1→MEMORY_MAX_LINES

## Related Symbols

- `getMemoryContext` (`F0A`) - Entry point for the memory system.
- `buildMemoryPrompt` (`m0A`) - Core logic for file reading and truncation.
- `MEMORY_MD_FILENAME` (`pN9` / `Ua`) - "MEMORY.md".
- `MEMORY_MAX_LINES` (`Qu1`) - 200.

## Location References

- `chunks.87.mjs:2229` - Constant definitions.
- `chunks.87.mjs:2257` - `m0A` implementation.
- `chunks.169.mjs:231` - Registration in the dynamic prompt list.
