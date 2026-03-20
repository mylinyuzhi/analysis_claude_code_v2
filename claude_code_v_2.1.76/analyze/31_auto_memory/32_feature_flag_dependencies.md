# Auto Memory Feature Flag Dependencies

## Overview

Auto Memory behavior is controlled by multiple feature flags that determine prompt format, memory mode, and functionality. This document analyzes the feature flag decision matrix and their interactions.

**Key insight**: Feature flags create a combinatorial explosion of behaviors. Understanding the decision tree is critical for debugging memory-related issues.

**Version**: Claude Code v2.1.76

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions:
- `getAutoMemory` (`ID1`) - Main entry point with flag checks
- `getFeatureFlag` (`w8`) - Flag evaluation function
- `isAutoMemoryEnabled` (`Z3`) - Enable/disable check
- `isTeamMemoryEnabled` (`SD1`) - Team memory check

---

## 1. Feature Flag Overview

### 1.1 Flags Affecting Auto Memory

| Flag Name | Purpose | Default | Affects |
|-----------|---------|---------|---------|
| `tengu_swinburne_dune` | File-based memory format | `false` | Prompt format |
| `tengu_passport_quail` | Background agent memory mode | `false` | Write permissions |
| `tengu_herring_clock` | Team memory support | `false` | Dual memory |
| `tengu_moth_copse` | Relevant memories search | `false` | Semantic retrieval |
| `tengu_coral_fern` | Search context section | `false` | Search guidance |

### 1.2 Flag Check Pattern

Feature flags are checked using the `w8` (getFeatureFlag) function:

```javascript
// ============================================
// Feature Flag Check Pattern
// Location: Throughout chunks.84.mjs, chunks.147.mjs, chunks.146.mjs
// ============================================

// ORIGINAL (for source lookup):
let q = w8("tengu_swinburne_dune", !1);

// READABLE (for understanding):
const useFileBasedFormat = getFeatureFlag("tengu_swinburne_dune", false);
```

**Pattern**: `w8(flagName, defaultValue)`

---

## 2. Decision Tree Analysis

### 2.1 Main Entry Point Decision Tree

```javascript
// ============================================
// getAutoMemory - Main decision tree
// Location: chunks.84.mjs:382-411
// ============================================

// READABLE (for understanding):
async function getAutoMemory() {
    const isEnabled = isAutoMemoryEnabled();
    const useFileBasedFormat = getFeatureFlag("tengu_swinburne_dune", false);
    const isBackgroundAgent = getFeatureFlag("tengu_passport_quail", false);
    const hasTeamMemory = isTeamMemoryEnabled();  // SD1

    // Decision Tree:
    // 1. Team Memory Branch
    if (hasTeamMemory) {
        const userDir = getAutoMemoryDirectory();
        const teamDir = getTeamMemoryPath();

        await ensureMemoryDirExists(teamDir);
        recordMemoryDirLoadMetrics(userDir, { memory_type: "auto" });
        recordMemoryDirLoadMetrics(teamDir, { memory_type: "team" });

        // 1a. Background Agent + Team Memory
        if (isBackgroundAgent) {
            return buildExtractModeTypedCombinedPrompt();  // bv9
        }

        // 1b. File-Based + Team Memory
        if (useFileBasedFormat) {
            return buildTypedCombinedMemoryPrompt();
        }

        // 1c. Standard + Team Memory
        return buildCombinedMemoryPrompt();
    }

    // 2. Single Memory Branch
    if (isEnabled) {
        const memoryDir = getAutoMemoryDirectory();
        await ensureMemoryDirExists(memoryDir);
        recordMemoryDirLoadMetrics(memoryDir, { memory_type: "auto" });

        // 2a. Background Agent Mode
        if (isBackgroundAgent) {
            return buildBackgroundAgentMemoryPrompt("auto memory", memoryDir);  // xv9
        }

        // 2b. File-Based Format
        if (useFileBasedFormat) {
            return buildMemoryIndex("auto memory", memoryDir);  // U14
        }

        // 2c. Standard Format
        return buildAutoMemoryPromptSimple();  // uv9
    }

    // 3. Disabled Branch
    recordTelemetry("tengu_memdir_disabled", { ... });
    return null;
}
```

### 2.2 Visual Decision Tree

```
                              Start
                                │
                                ▼
                    ┌───────────────────────┐
                    │ isTeamMemoryEnabled()? │
                    └───────────┬───────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │ YES                               │ NO
              ▼                                   ▼
    ┌─────────────────────┐             ┌─────────────────────┐
    │ tengu_passport_quail│             │ isAutoMemoryEnabled?│
    └──────────┬──────────┘             └──────────┬──────────┘
               │                                   │
         ┌─────┴─────┐                   ┌─────────┴─────────┐
         │YES        │NO                │YES                 │NO
         ▼           ▼                  ▼                    ▼
    ┌─────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────┐
    │ bv9     │ │tengu_swinburne_ │ │tengu_passport_  │ │ null    │
    │(Extract │ │dune?            │ │quail?           │ │(disabled)│
    │Mode)    │ └────────┬────────┘ └────────┬────────┘ └─────────┘
    └─────────┘          │                   │
                   ┌─────┴─────┐        ┌─────┴─────┐
                   │YES        │NO      │YES        │NO
                   ▼           ▼        ▼           ▼
              ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
              │Typed    │ │Combined │ │xv9      │ │tengu_   │
              │Combined │ │Prompt   │ │(BG Agent│ │swinburne│
              │(File)   │ │(Default)│ │Mode)    │ │_dune?   │
              └─────────┘ └─────────┘ └─────────┘ └────┬────┘
                                                          │
                                                    ┌─────┴─────┐
                                                    │YES        │NO
                                                    ▼           ▼
                                               ┌─────────┐ ┌─────────┐
                                               │U14      │ │uv9      │
                                               │(File    │ │(Simple  │
                                               │Based)   │ │Default) │
                                               └─────────┘ └─────────┘
```

---

## 3. Flag Details

### 3.1 tengu_swinburne_dune - File-Based Memory Format

**Purpose**: Switch from standard prompt format to file-based format with frontmatter support.

**Default**: `false`

**Behavior when `true`**:
- Uses `buildMemoryIndex` (`U14`) instead of `buildAutoMemoryPromptSimple` (`uv9`)
- Prompts include frontmatter format instructions
- Memory types (user, feedback, project, reference) are defined
- Two-step save process: write file → add pointer in MEMORY.md

**Code Path**:
```javascript
// Single memory mode
if (useFileBasedFormat) {
    return buildMemoryIndex("auto memory", memoryDir);  // U14
}

// Team memory mode
if (useFileBasedFormat) {
    return buildTypedCombinedMemoryPrompt();
}
```

**Prompt differences**:
| Aspect | Standard (false) | File-Based (true) |
|--------|------------------|-------------------|
| MEMORY.md role | Content file | Index file |
| Save process | Direct write | Two-step (file + pointer) |
| Frontmatter | Not used | Required (name, description, type) |
| Type guidance | None | Memory type definitions included |

### 3.2 tengu_passport_quail - Background Agent Memory Mode

**Purpose**: Enable restricted memory mode for background agents.

**Default**: `false`

**Behavior when `true`**:
- Main agent receives prompt: "You should not write to memory files yourself"
- Extraction subagent spawned after completion
- Subagent has elevated write permissions

**Code Path**:
```javascript
// Single memory mode
if (isBackgroundAgent) {
    return buildBackgroundAgentMemoryPrompt("auto memory", memoryDir);  // xv9
}

// Team memory mode
if (isBackgroundAgent) {
    return buildExtractModeTypedCombinedPrompt();  // bv9
}
```

**Prompt content** (xv9):
```markdown
# auto memory

You have a auto memory directory at `...`.

**You should not write to memory files yourself.**
Instead, focus on the task at hand. A memory extraction subagent will
analyze your conversation afterward and update memory files as needed.
```

**Integration**: Cross-reference with [26_memory_extraction_mechanism.md](./26_memory_extraction_mechanism.md)

### 3.3 tengu_herring_clock - Team Memory Support

**Purpose**: Enable dual memory system (user + team).

**Default**: `false`

**Behavior when `true`**:
- Both user and team memory directories are created/loaded
- Telemetry recorded for both directories
- Prompt includes both memory sections

**Code Path**:
```javascript
// Checked via isTeamMemoryEnabled() (SD1)
if (isTeamMemoryEnabled()) {
    const userDir = getAutoMemoryDirectory();
    const teamDir = getTeamMemoryPath();

    await ensureMemoryDirExists(teamDir);

    // Record metrics for both
    recordMemoryDirLoadMetrics(userDir, { memory_type: "auto" });
    recordMemoryDirLoadMetrics(teamDir, { memory_type: "team" });

    // Return combined prompt
    return buildCombinedMemoryPrompt();
}
```

**Directory structure**:
```
~/.claude/projects/{hash}/memory/     ← User memory
/shared/team/memory/                   ← Team memory (configurable)
```

**Integration**: Cross-reference with [24_team_memory_system.md](./24_team_memory_system.md)

### 3.4 tengu_moth_copse - Relevant Memories Search

**Purpose**: Enable semantic memory search for relevant memories.

**Default**: `false`

**Behavior when `true`**:
- `produceRelevantMemories` (`buY`) is called for each user message
- LLM-based semantic matching to find relevant topic files
- 5-second timeout for search operation
- Maximum 5 memories returned

**Code Path**:
```javascript
// Location: chunks.147.mjs:592-601
function getRelevantMemoriesTrigger(messages, context) {
    if (!isAutoMemoryEnabled()) return undefined;
    if (!getFeatureFlag("tengu_moth_copse", false)) return undefined;

    // ... extract last user message ...

    return produceRelevantMemories(searchText, activeAgents, readFileState, toolContext);
}
```

**Integration**: Cross-reference with [29_semantic_memory_search.md](./29_semantic_memory_search.md)

### 3.5 tengu_coral_fern - Search Context Section

**Purpose**: Include search guidance in memory prompts.

**Default**: `false`

**Behavior when `true`**:
- `buildSearchContextSection` (`Dt`) adds search guidance
- Includes commands for searching memory files and session logs
- Terminal vs tool mode detection

**Code Path**:
```javascript
// Location: chunks.84.mjs:373-380
function buildSearchContextSection(memoryDir) {
    if (!getFeatureFlag("tengu_coral_fern", false)) return [];

    const transcriptDir = getTranscriptBasePath();
    const isTerminalMode = isTerminalSession();

    // Build search commands based on mode
    return [
        "## Searching past context",
        "",
        "When looking for past context:",
        "1. Search topic files in your memory directory:",
        "```",
        searchCommand,
        "```",
        // ...
    ];
}
```

**Prompt addition**:
```markdown
## Searching past context

When looking for past context:
1. Search topic files in your memory directory:
   ```
   Grep with pattern="<search term>" path="..." glob="*.md"
   ```
2. Session transcript logs (last resort — large files, slow):
   ```
   Grep with pattern="<search term>" path="..." glob="*.jsonl"
   ```
```

---

## 4. Flag Combinations Matrix

### 4.1 Prompt Format Combinations

| swinburne_dune | passport_quail | herring_clock | Result |
|----------------|----------------|---------------|--------|
| false | false | false | Standard simple prompt (uv9) |
| true | false | false | File-based prompt (U14) |
| false | true | false | Background agent prompt (xv9) |
| true | true | false | Background agent + file-based |
| false | false | true | Combined team prompt |
| true | false | true | Typed combined prompt |
| false | true | true | Extract mode team prompt (bv9) |
| true | true | true | Extract mode typed combined |

### 4.2 Function Selection by Combination

```javascript
// Pseudocode for function selection
function selectMemoryPromptFunction(flags) {
    const { swinburne_dune, passport_quail, herring_clock } = flags;

    if (herring_clock) {
        // Team memory mode
        if (passport_quail) {
            return buildExtractModeTypedCombinedPrompt;  // bv9
        }
        if (swinburne_dune) {
            return buildTypedCombinedMemoryPrompt;
        }
        return buildCombinedMemoryPrompt;
    }

    // Single memory mode
    if (passport_quail) {
        return buildBackgroundAgentMemoryPrompt;  // xv9
    }
    if (swinburne_dune) {
        return buildMemoryIndex;  // U14
    }
    return buildAutoMemoryPromptSimple;  // uv9
}
```

---

## 5. Default Behavior

### 5.1 Default Flag Values

All memory-related feature flags default to `false`:

```javascript
// Default behavior: Standard simple prompt
const defaultFlags = {
    tengu_swinburne_dune: false,   // Standard format
    tengu_passport_quail: false,   // Normal write permissions
    tengu_herring_clock: false,    // Single memory
    tengu_moth_copse: false,       // No semantic search
    tengu_coral_fern: false        // No search guidance
};
```

### 5.2 Default Memory Path

With all flags at default:
- Memory directory: `~/.claude/projects/{cwd-hash}/memory/`
- Prompt function: `buildAutoMemoryPromptSimple` (`uv9`)
- Write permissions: Normal (agent can write freely)
- Search: Manual via Read/Grep tools

---

## 6. Troubleshooting

### 6.1 Memory Not Loading

**Symptoms**: No memory content in system prompt

**Debug Steps**:
1. Check `isAutoMemoryEnabled()` (`Z3`) result
2. Check environment variable `CLAUDE_CODE_DISABLE_AUTO_MEMORY`
3. Check user setting `autoMemoryEnabled`
4. Verify memory directory exists

### 6.2 Wrong Prompt Format

**Symptoms**: Memory prompt doesn't match expected format

**Debug Steps**:
1. Check `tengu_swinburne_dune` flag value
2. Check `tengu_passport_quail` flag value
3. Check `isTeamMemoryEnabled()` result
4. Review combination matrix above

### 6.3 Relevant Memories Not Appearing

**Symptoms**: No relevant memories attachment despite having topic files

**Debug Steps**:
1. Check `tengu_moth_copse` flag is `true`
2. Verify 5-second timeout isn't being exceeded
3. Check user message has multiple words (required trigger)
4. Verify topic files exist in memory directory (not just MEMORY.md)

---

## Summary

Auto Memory feature flags control:

| Flag | Primary Effect | Secondary Effects |
|------|---------------|-------------------|
| `tengu_swinburne_dune` | Prompt format (file-based vs standard) | Two-step save process |
| `tengu_passport_quail` | Write restrictions | Extraction subagent spawn |
| `tengu_herring_clock` | Dual memory (user + team) | Combined prompts |
| `tengu_moth_copse` | Semantic memory search | Relevant memories attachment |
| `tengu_coral_fern` | Search guidance section | Grep command examples |

**Key insight**: Understanding the feature flag matrix is essential for debugging memory behavior. The combination of flags creates 8+ distinct memory modes, each with different prompt formats and functionality.