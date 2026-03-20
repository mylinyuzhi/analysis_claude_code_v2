# Team Memory System Analysis

## Overview

The Team Memory system extends Auto Memory to support collaborative knowledge sharing across team members. It provides a dual-memory architecture with separate user (private) and team (shared) memory directories.

**Key insight**: Team memory enables knowledge sharing across team members working in the same project, while user memory remains private to each individual.

**Version**: Claude Code v2.1.76

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions:
- `isTeamMemoryEnabled` (`SD1`) - Check if team memory is active (chunks.84.mjs:139)
- `getTeamMemoryDirectory` (`Lk`) - Get team memory path (chunks.84.mjs:144)
- `getTeamMemoryMdPath` (`hv9`) - Get team MEMORY.md path (chunks.84.mjs:148)
- `isTeamMemoryPath` (`m14`) - Validate team memory path (chunks.84.mjs:184)
- `shouldBypassPermissionsForTeamMemory` (`JF6`) - Permission bypass (chunks.84.mjs:211)
- `buildCombinedMemoryPrompt` (`Cv9`) - Build dual memory prompt (chunks.84.mjs:230)
- `buildTypedCombinedMemoryPrompt` (`Iv9`) - File-based format (chunks.84.mjs:237)

---

## 1. Architecture Overview

### 1.1 Dual Memory System

```
┌─────────────────────────────────────────────────────────────┐
│                DUAL MEMORY ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                │
│  │ User Memory  │         │ Team Memory  │                │
│  │ (private)    │         │ (shared)     │                │
│  └──────┬───────┘         └──────┬───────┘                │
│         │                        │                         │
│         │ ~/.claude/projects/    │ same path + /team/      │
│         │ {hash}/memory/         │                         │
│         │                        │                         │
│         ▼                        ▼                         │
│  ┌──────────────┐         ┌──────────────┐                │
│  │ MEMORY.md    │         │ MEMORY.md    │                │
│  │ (private)    │         │ (shared)     │                │
│  └──────────────┘         └──────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Design Principles**:
1. **User memory**: Private to individual user, stores personal preferences
2. **Team memory**: Shared across all team members in same project
3. **Scope isolation**: Different data types go to appropriate memory
4. **Permission bypass**: Both directories allow write without prompts

---

## 2. Team Memory Enablement

### 2.1 Enable Check

// ============================================
// isTeamMemoryEnabled - Check if team memory is active
// Location: chunks.84.mjs:139-142
// ============================================

// ORIGINAL (for source lookup):
function SD1() {
    if (!Z3()) return !1;
    return w8("tengu_herring_clock", !1)
}

// READABLE (for understanding):
function isTeamMemoryEnabled() {
    // Team memory requires auto memory to be enabled
    if (!isAutoMemoryEnabled()) return false;

    // Check feature flag for team memory
    return getFeatureFlag("tengu_herring_clock", false);
}

// Mapping: SD1 → isTeamMemoryEnabled, Z3 → isAutoMemoryEnabled, w8 → getFeatureFlag

**Prerequisites**:
1. Auto memory must be enabled (`Z3()` returns true)
2. Feature flag `tengu_herring_clock` must be set

---

## 3. Directory Resolution

### 3.1 Team Memory Directory

// ============================================
// getTeamMemoryDirectory - Get team memory path
// Location: chunks.84.mjs:144-146
// ============================================

// ORIGINAL (for source lookup):
function Lk() {
    return (hD1(uH(), "team") + gf8).normalize("NFC")
}

// READABLE (for understanding):
function getTeamMemoryDirectory() {
    const userMemoryDir = getAutoMemoryDirectory();  // e.g., ~/.claude/projects/{hash}/memory/
    return joinPath(userMemoryDir, "team") + "/";     // e.g., ~/.claude/projects/{hash}/memory/team/
}

// Mapping: Lk → getTeamMemoryDirectory, hD1 → joinPath, uH → getAutoMemoryDirectory, gf8 → pathSeparator

**Path construction**:
```
User memory:  ~/.claude/projects/{hash}/memory/
Team memory:  ~/.claude/projects/{hash}/memory/team/
```

### 3.2 Team Memory Entry Point

// ============================================
// getTeamMemoryMdPath - Get team MEMORY.md path
// Location: chunks.84.mjs:148-150
// ============================================

// ORIGINAL (for source lookup):
function hv9() {
    return hD1(uH(), "team", "MEMORY.md")
}

// READABLE (for understanding):
function getTeamMemoryMdPath() {
    return joinPath(getAutoMemoryDirectory(), "team", "MEMORY.md");
}

// Mapping: hv9 → getTeamMemoryMdPath, hD1 → joinPath, uH → getAutoMemoryDirectory

---

## 4. Path Validation

### 4.1 Team Memory Path Check

// ============================================
// isTeamMemoryPath - Check if path is in team memory directory
// Location: chunks.84.mjs:184-188
// ============================================

// ORIGINAL (for source lookup):
function m14(A) {
    let q = Sz8(A),
        K = Lk();
    return q.startsWith(K)
}

// READABLE (for understanding):
function isTeamMemoryPath(filePath) {
    const normalizedPath = normalizePath(filePath);
    const teamMemoryDir = getTeamMemoryDirectory();
    return normalizedPath.startsWith(teamMemoryDir);
}

// Mapping: m14 → isTeamMemoryPath, Sz8 → normalizePath, Lk → getTeamMemoryDirectory

### 4.2 Permission Bypass

// ============================================
// shouldBypassPermissionsForTeamMemory - Team memory permission bypass
// Location: chunks.84.mjs:211-213
// ============================================

// ORIGINAL (for source lookup):
function JF6(A) {
    return SD1() && m14(A)
}

// READABLE (for understanding):
function shouldBypassPermissionsForTeamMemory(filePath) {
    return isTeamMemoryEnabled() && isTeamMemoryPath(filePath);
}

// Mapping: JF6 → shouldBypassPermissionsForTeamMemory, SD1 → isTeamMemoryEnabled, m14 → isTeamMemoryPath

---

## 5. Qf8 (B14) Combined Prompt Module

The Qf8 module (stored in the B14 object) contains three prompt builders for dual memory (user + team) configurations. These are called from `getAutoMemory` (`ID1`) when team memory is enabled.

### 5.1 Module Structure

```javascript
// Location: chunks.84.mjs:440
Qf8 = (g14(), k4(B14))

// B14 is defined at chunks.84.mjs:228 as an empty object that gets populated
// by the g14() initialization function
B14 = {}

// g14() initializes B14 with Cv9, Iv9, bv9 functions
g14 = E(() => {
    mH();
    Rk();
    k06();
    jF6()
})
```

### 5.2 Function Overview

| Function | Symbol | Location | Use Case |
|----------|--------|----------|----------|
| buildCombinedMemoryPrompt | `Cv9` | chunks.84.mjs:230 | Default dual memory prompt |
| buildTypedCombinedMemoryPrompt | `Iv9` | chunks.84.mjs:237 | File-based format (tengu_swinburne_dune flag) |
| buildExtractModeTypedCombinedPrompt | `bv9` | chunks.84.mjs:244 | Background agent mode (tengu_passport_quail flag) |

### 5.3 Selection Logic in getAutoMemory

```javascript
// Location: chunks.84.mjs:385-394
if (isTeamMemoryEnabled()) {
    const userMemoryDir = getAutoMemoryDirectory();
    const teamMemoryDir = getTeamMemoryPath();

    // Ensure directories exist
    await ensureMemoryDirExists(teamMemoryDir);
    recordMemoryDirLoadMetrics(userMemoryDir, { memory_type: "auto" });
    recordMemoryDirLoadMetrics(teamMemoryDir, { memory_type: "team" });

    // Select prompt based on feature flags
    if (getFeatureFlag("tengu_passport_quail", false)) {
        return Qf8.buildExtractModeTypedCombinedPrompt();  // bv9
    }
    if (getFeatureFlag("tengu_swinburne_dune", false)) {
        return Qf8.buildTypedCombinedMemoryPrompt();       // Iv9
    }
    return Qf8.buildCombinedMemoryPrompt();                // Cv9
}
```

### 5.4 buildExtractModeTypedCombinedPrompt (bv9)

**Purpose**: Used for background agents when team memory is enabled. Instructs the agent that a background agent will handle memory writes automatically.

**Key difference from other prompts**:
```javascript
// Location: chunks.84.mjs:244-251
function bv9() {
    const userMemoryDir = getAutoMemoryDirectory();
    const teamMemoryDir = getTeamMemoryDirectory();

    return [
        "# Memory",
        "",
        `You have a persistent, file-based memory system with two directories:`,
        `- private directory at \`${userMemoryDir}\``,
        `- shared team directory at \`${teamMemoryDir}\`.`,
        "",
        `Each directory has a \`MEMORY.md\` index of memory files...`,
        "",
        // KEY DIFFERENCE: Background agent handles writes
        "A background agent automatically extracts and saves memories from this conversation.",
        "If the user asks you to remember or forget something, acknowledge it — the save happens automatically.",
        "You should not write to memory files yourself.",
        "",
        ...buildSearchContextSection(userMemoryDir)
    ].join("\n");
}
```

### 5.5 Common Elements

All three functions share:
1. **Dual directory paths**: User memory + Team memory paths
2. **buildSearchContextSection (Dt)**: Adds search guidance for finding past context
3. **Scope guidance**: Instructions on what goes in user vs team memory
4. **Memory type definitions**: Uses `LD1` (team scope types) or `RD1` (simple types)

---

## 6. Dual Memory Prompt Building

### 6.1 Combined Prompt (Default)

// ============================================
// buildCombinedMemoryPrompt - Build prompt with user + team memory
// Location: chunks.84.mjs:230-235
// ============================================

// ORIGINAL (for source lookup):
function Cv9() {
    let A = uH(),
        q = Lk();
    return ["# Memory", "", `You have two persistent memory systems. ${pf8}`, "",
            `1. **User memory** at \`${A}\` — private between you and the user...`,
            `2. **Team memory** at \`${q}\` — shared with all users...`,
            ...].join("\n")
}

// READABLE (for understanding):
function buildCombinedMemoryPrompt() {
    const userMemoryDir = getAutoMemoryDirectory();
    const teamMemoryDir = getTeamMemoryDirectory();

    return [
        "# Memory",
        "",
        `You have two persistent memory systems. Both directories already exist...`,
        "",
        `1. **User memory** at \`${userMemoryDir}\` — private between you and the user, persists across your conversations`,
        `2. **Team memory** at \`${teamMemoryDir}\` — shared with all users in the same organization, automatically synced across conversations`,
        "",
        "Use these directories to build knowledge over multiple conversations...",
        "",
        "## You MUST access memories when:",
        "- Specific known memories (personal or team) seem relevant to the task at hand.",
        "- The user seems to be referring to work you may have done in a prior conversation...",
        "",
        "## You MUST save memories when:",
        "- You encounter information that might be useful in future conversations.",
        "- If a user explicitly asks you to remember a piece of information...",
        "",
        ...buildSearchContextSection(userMemoryDir)
    ].join("\n");
}

// Mapping: Cv9 → buildCombinedMemoryPrompt, uH → getAutoMemoryDirectory, Lk → getTeamMemoryDirectory

### 6.2 File-Based Format

// ============================================
// buildTypedCombinedMemoryPrompt - File-based dual memory prompt
// Location: chunks.84.mjs:237-242
// ============================================

// READABLE (for understanding):
function buildTypedCombinedMemoryPrompt() {
    const userMemoryDir = getAutoMemoryDirectory();
    const teamMemoryDir = getTeamMemoryDirectory();

    return [
        "# Memory",
        "",
        `You have a persistent, file-based memory system with two directories:`,
        `- private directory at \`${userMemoryDir}\``,
        `- shared team directory at \`${teamMemoryDir}\`.`,
        "",
        "You should build up this memory system over time...",
        "",
        "## Memory scope",
        "",
        "There are two scope levels:",
        `- private: memories that are private between you and the current user.`,
        `- team: memories that are shared with and contributed by all users.`,
        "",
        ...buildSearchContextSection(userMemoryDir)
    ].join("\n");
}

// Mapping: Iv9 → buildTypedCombinedMemoryPrompt

---

## 7. Memory Extraction for Team Memory

When team memory is enabled, the memory extraction subagent uses different prompts:

// ============================================
// Memory extraction with team memory
// Location: chunks.148.mjs:530-532
// ============================================

// ORIGINAL (for source lookup):
let M = pmY.isTeamMemoryEnabled(),
    D = w8("tengu_swinburne_dune", !1),
    X = M ? (D ? WKq : PKq)(J) : (D ? XKq : DKq)(J);

// READABLE (for understanding):
const hasTeamMemory = isTeamMemoryEnabled();
const useFileBased = getFeatureFlag("tengu_swinburne_dune", false);

const extractionPrompt = hasTeamMemory
    ? (useFileBased ? buildTeamFileBasedExtractionPrompt : buildTeamExtractionPrompt)(messageCount)
    : (useFileBased ? buildFileBasedExtractionPrompt : buildExtractionPrompt)(messageCount);

---

## 8. Use Cases

### 8.1 When to Use Team Memory

| Use Case | Description | Memory Type |
|----------|-------------|-------------|
| **Project conventions** | Coding standards, linting rules | Team |
| **Architecture decisions** | Why certain choices were made | Team |
| **Debugging solutions** | Recurring issues and fixes | Team |
| **User preferences** | Personal workflow preferences | User |
| **Session context** | Temporary work in progress | Neither (don't save) |

### 8.2 Memory Scope Selection

The prompt instructs the agent:

```
## Choosing between user memory and team memory:
- If the user explicitly says "remember" or "save", use user memory.
- If the user explicitly says "remember for the team", use team memory.
- If the information is about personal preferences, use user memory.
- If the information is about project conventions, use team memory.
- If unclear, ask which memory to use.
```

---

## 9. TUI Integration

When team memory is enabled, the TUI shows both memory folders:

// ============================================
// TUI memory options
// Location: chunks.153.mjs:683-692
// ============================================

// READABLE (for understanding):
if (isTeamMemoryEnabled()) {
    memoryOptions.push({
        label: "Open team memory folder",
        value: `vscode://file${getTeamMemoryDirectory()}`,
        description: ""
    });
}

---

## 10. Summary

The Team Memory system provides:

1. **Dual memory architecture**: User (private) + Team (shared) directories
2. **Feature flag control**: `tengu_herring_clock` enables team memory
3. **Path-based isolation**: Team memory under `{userMemory}/team/`
4. **Permission bypass**: Both memory types allow unrestricted writes
5. **Unified prompt**: Combined prompt shows both memory systems
6. **Extraction support**: Memory extraction agent handles both types
7. **TUI integration**: Both folders visible in memory modal

**Key architectural insight**: Team memory extends the user memory system with a sibling directory structure, enabling collaborative knowledge sharing while maintaining individual privacy.