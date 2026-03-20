# Background Agent Memory Mode Analysis

## Overview

Background agents operate with a simplified memory mode that restricts direct memory writing while enabling automatic memory extraction. This document analyzes the `tengu_passport_quail` feature flag and the `xv9` function that builds memory prompts for background agents.

**Key insight**: Background agents see a read-only view of memory and rely on a separate extraction subagent to save memories on their behalf.

**Version**: Claude Code v2.1.76

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions:
- `buildBackgroundAgentMemoryPrompt` (`xv9`) - Background agent memory prompt (chunks.84.mjs:329)
- `buildExtractModeTypedCombinedPrompt` (`bv9`) - Extraction mode combined prompt (chunks.84.mjs:244)
- `getAutoMemory` (`ID1`) - Main entry point that checks `tengu_passport_quail` flag

---

## 1. Feature Flag Control

### 1.1 The `tengu_passport_quail` Flag

The background agent memory mode is controlled by the `tengu_passport_quail` feature flag:

```javascript
// In getAutoMemory (ID1), chunks.84.mjs:385-394
if (getFeatureFlag("tengu_passport_quail", false)) {
    // Use background agent memory prompt (xv9)
    return buildBackgroundAgentMemoryPrompt("auto memory", memoryDir);
}
```

**When set to `true`**:
- Background agents see simplified memory prompt
- Agent is told memory is extracted automatically
- Agent should NOT write to memory files directly
- A separate extraction subagent handles memory saving

**When set to `false`** (default):
- Standard memory prompt with full write access
- Agent can freely write to MEMORY.md and topic files

---

## 2. Background Agent Memory Prompt

### 2.1 Prompt Builder

// ============================================
// buildBackgroundAgentMemoryPrompt - Memory prompt for background agents
// Location: chunks.84.mjs:329-331
// ============================================

// ORIGINAL (for source lookup):
function xv9(A, q) {
    return [`# ${A}`, "", `You have a persistent, file-based memory system at \`${q}\`.`, "",
            `\`${o2}\` is an index of memory files, loaded into your conversation context (first ${uj} lines). Use it to find relevant notes from prior sessions.`,
            "",
            "A background agent automatically extracts and saves memories from this conversation.",
            "If the user asks you to remember or forget something, acknowledge it — the save happens automatically.",
            "You should not write to memory files yourself.",
            "",
            "## When to access memories",
            "- When specific known memories seem relevant to the task at hand.",
            "- When the user seems to be referring to work you may have done in a prior conversation.",
            "- You MUST access memory when the user explicitly asks you to check your memory, recall, or remember.",
            "",
            ...Dt(q)]
}

// READABLE (for understanding):
function buildBackgroundAgentMemoryPrompt(displayName, memoryDir) {
    return [
        `# ${displayName}`,
        "",
        `You have a persistent, file-based memory system at \`${memoryDir}\`.`,
        "",
        "`MEMORY.md` is an index of memory files, loaded into your conversation context (first 200 lines). Use it to find relevant notes from prior sessions.",
        "",
        "A background agent automatically extracts and saves memories from this conversation.",
        "If the user asks you to remember or forget something, acknowledge it — the save happens automatically.",
        "You should not write to memory files yourself.",
        "",
        "## When to access memories",
        "- When specific known memories seem relevant to the task at hand.",
        "- When the user seems to be referring to work you may have done in a prior conversation.",
        "- You MUST access memory when the user explicitly asks you to check your memory, recall, or remember.",
        "",
        ...buildSearchContextSection(memoryDir)
    ];
}

// Mapping: xv9 → buildBackgroundAgentMemoryPrompt, o2 → "MEMORY.md", uj → 200, Dt → buildSearchContextSection

### 2.2 Key Differences from Standard Prompt

| Aspect | Standard Prompt | Background Agent Prompt |
|--------|-----------------|------------------------|
| **Write access** | "Use the Write and Edit tools to update your memory files" | "You should not write to memory files yourself" |
| **Memory saving** | Agent saves directly | "A background agent automatically extracts and saves memories" |
| **User requests** | Agent must save when asked | "acknowledge it — the save happens automatically" |
| **Guidelines** | Full what-to-save/what-not-to-save | Simplified when-to-access section |

---

## 3. Memory Extraction Subagent

### 3.1 How Extraction Works

When the `tengu_passport_quail` flag is set, a background process extracts memories:

// ============================================
// Memory extraction prompt selection
// Location: chunks.148.mjs:530-532
// ============================================

// ORIGINAL (for source lookup):
let M = pmY.isTeamMemoryEnabled(),
    D = w8("tengu_swinburne_dune", !1),
    X = M ? (D ? WKq : PKq)(J) : (D ? XKq : DKq)(J);

// READABLE (for understanding):
const hasTeamMemory = isTeamMemoryEnabled();
const useFileBasedFormat = getFeatureFlag("tengu_swinburne_dune", false);

// Select appropriate extraction prompt based on memory configuration
const extractionPrompt = hasTeamMemory
    ? (useFileBasedFormat
        ? buildTeamFileBasedExtractionPrompt(messageCount)  // WKq
        : buildTeamExtractionPrompt(messageCount))          // PKq
    : (useFileBasedFormat
        ? buildFileBasedExtractionPrompt(messageCount)      // XKq
        : buildExtractionPrompt(messageCount));             // DKq

### 3.2 Extraction Prompt Content

The extraction subagent is told:

```javascript
// chunks.148.mjs:394
function sE1(A) {
    return `You are now acting as the memory extraction subagent. Any prior instruction to not write memory files applies to the main conversation — in this role, writing is your job. Analyze the most recent ~${A} messages above and use them to update your persistent memory systems.`;
}
```

**Key instruction**: The extraction subagent has permission to write memory files even though the main agent does not.

---

## 4. Dual Memory with Extraction Mode

### 4.1 Combined Prompt for Team + Extraction

// ============================================
// buildExtractModeTypedCombinedPrompt - Team memory with extraction mode
// Location: chunks.84.mjs:244-251
// ============================================

// ORIGINAL (for source lookup):
function bv9() {
    {
        let A = uH(),
            q = Lk();
        return ["# Memory", "", `You have a persistent, file-based memory system with two directories: a private directory at \`${A}\` and a shared team directory at \`${q}\`.`, "",
                `Each directory has a \`${o2}\` index of memory files, loaded into your conversation context (first ${uj} lines). Use these indexes to find relevant notes from prior sessions.`,
                "",
                "A background agent automatically extracts and saves memories from this conversation. If the user asks you to remember or forget something, acknowledge it — the save happens automatically. You should not write to memory files yourself.",
                "",
                "## Memory scope", "",
                "There are two scope levels:", "",
                `- private: memories that are private between you and the current user. They persist across conversations with only this specific user and are stored at the root \`${A}\`.`,
                `- team: memories that are shared with and contributed by all of the users who work within this project directory. Team memories are synced at the beginning of every session and they are stored at \`${q}\`.`,
                "",
                "## When to access memories",
                "- When specific known memories (personal or team) seem relevant to the task at hand.",
                "- When the user seems to be referring to work you may have done in a prior conversation with them or other users in their organization.",
                "- You MUST access memory when the user explicitly asks you to check memory, recall, or remember.",
                "",
                ...Dt(A)].join("\n")
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
        `- shared team directory at \`${teamMemoryDir}\`.`,
        "",
        "Each directory has a `MEMORY.md` index... (first 200 lines).",
        "",
        "A background agent automatically extracts and saves memories from this conversation.",
        "If the user asks you to remember or forget something, acknowledge it — the save happens automatically.",
        "You should not write to memory files yourself.",
        "",
        "## Memory scope",
        "- private: memories stored at root user memory directory",
        "- team: memories shared across all users in the project",
        "",
        "## When to access memories",
        "- When memories seem relevant to the task at hand.",
        "- When the user refers to prior work.",
        "- You MUST access memory when explicitly asked.",
        "",
        ...buildSearchContextSection(userMemoryDir)
    ].join("\n");
}

// Mapping: bv9 → buildExtractModeTypedCombinedPrompt, uH → getAutoMemoryDirectory, Lk → getTeamMemoryDirectory

---

## 5. Write Restriction Enforcement

### 5.1 How Writes Are Blocked

Even though the background agent prompt says "You should not write to memory files yourself", the system enforces this through the permission system for background agents.

The key is that background agents run with restricted tool access, and the extraction subagent runs separately with write permissions.

### 5.2 Extraction Subagent Permission

The extraction subagent receives special instructions:

```javascript
// chunks.148.mjs:394
"You are now acting as the memory extraction subagent. Any prior instruction to not write memory files applies to the main conversation — in this role, writing is your job."
```

This allows the extraction subagent to write to memory files even when the main agent cannot.

---

## 6. Decision Flow

### 6.1 Memory Mode Selection in getAutoMemory

```
getAutoMemory() is called
  |
  +-> isAutoMemoryEnabled()?
  |   +-> NO -> Return null (no memory)
  |   +-> YES -> Continue
  |
  +-> isTeamMemoryEnabled()?
  |   +-> YES -> Dual memory mode
  |   |   |
  |   |   +-> tengu_passport_quail?
  |   |   |   +-> YES -> buildExtractModeTypedCombinedPrompt()
  |   |   |   +-> NO -> Check tengu_swinburne_dune
  |   |   |       +-> YES -> buildTypedCombinedMemoryPrompt()
  |   |   |       +-> NO -> buildCombinedMemoryPrompt()
  |   |
  |   +-> NO -> Single memory mode
  |       |
  |       +-> tengu_passport_quail?
  |       |   +-> YES -> buildBackgroundAgentMemoryPrompt()
  |       |   +-> NO -> Check tengu_swinburne_dune
  |       |       +-> YES -> buildMemoryIndex()
  |       |       +-> NO -> buildAutoMemoryPromptSimple()
```

---

## 7. Use Cases

### 7.1 When Background Agent Memory Mode Is Used

| Scenario | Reason |
|----------|--------|
| **Background agent execution** | Agent shouldn't write while running in background |
| **Parallel agent teams** | Prevent concurrent write conflicts |
| **Unattended operations** | Extraction happens after main task completes |
| **CI/CD workflows** | Agent runs task, extraction saves learnings |

### 7.2 Benefits

1. **Write conflict prevention**: Multiple agents can't overwrite each other's memory
2. **Consistent extraction**: Single extraction subagent ensures quality
3. **Simplified agent context**: Background agent focuses on task, not memory management
4. **Post-hoc organization**: Extraction can reorganize and deduplicate memories

---

## 8. Summary

The Background Agent Memory mode provides:

1. **Simplified memory prompt**: "You should not write to memory files yourself"
2. **Automatic extraction**: Separate subagent handles memory saving
3. **Feature flag control**: `tengu_passport_quail` enables this mode
4. **Dual memory support**: Works with team memory when enabled
5. **Write conflict prevention**: Background agents can't directly modify memory
6. **Post-task extraction**: Memories saved after main agent completes

**Key architectural insight**: By separating the memory extraction concern from the main agent, the system enables safe parallel agent execution while still accumulating knowledge across sessions.