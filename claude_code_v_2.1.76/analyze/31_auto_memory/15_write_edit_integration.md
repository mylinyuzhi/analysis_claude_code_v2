# Write/Edit Tool Integration Flow

## Overview

This document provides an in-depth analysis of how Write and Edit tools modify MEMORY.md files, with complete permission flow documentation. Auto memory paths bypass the standard permission system, allowing agents to update memory files without user prompts.

**Key insight**: Auto memory files are treated as a special privileged category in the permission system, similar to how the codebase allows direct file access within the project directory.

**Version**: Claude Code v2.1.76

---

## Permission Validation Flow

### Entry Points

When an agent invokes the Write or Edit tool with a file path, the permission validator intercepts the call before execution:

```
Agent → Write/Edit tool call
  ↓
Permission Validator
  ↓
Auto Memory Path Check (isAutoMemoryPath)
  ↓
Decision: "allow" or "prompt user"
  ↓
File System Operation
```

### Auto Memory Path Detection Algorithm

The validator uses a normalized path prefix matching strategy:

// ============================================
// isAutoMemoryPath - Validates if path is in auto memory directory
// Location: chunks.50.mjs:2451-2452
// ============================================

// ORIGINAL (for source lookup):
function Da(A) {
    return Sz8(A).startsWith(uH())
}

// READABLE (for understanding):
function isAutoMemoryPath(filePath) {
    return normalizePath(filePath).startsWith(getAutoMemoryDirectory());
}

// Mapping: Da → isAutoMemoryPath, Sz8 → normalizePath, uH → getAutoMemoryDirectory

**How it works:**
1. `filePath` is passed to the validator
2. Path is normalized via `Sz8` (resolves `~`, `.`, `..`, trailing slashes)
3. Normalized path is compared to auto memory directory using string prefix matching
4. Returns `true` if path is within auto memory directory, `false` otherwise

**Why this approach:**
- **Prefix matching** ensures subdirectories are also allowed (topic files like `debugging.md`)
- **Path normalization** prevents bypass attacks using relative paths or symbolic links
- **Centralized check** (`getAutoMemoryDirectory()`) ensures consistency across all validators
- **Custom directory support** (v2.1.59): Works with `autoMemoryDirectory` setting because `uH()` resolves the correct path

---

### Team Memory Path Detection

// ============================================
// isTeamMemoryPath - Validates if path is in team memory directory
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

---

## Complete Write Operation Flow

### Detailed Step-by-Step Process

```
1. User Request: "Remember we use TypeScript for all new files"
   ↓
2. Agent Formulates Write Tool Call
   tool: "Write"
   file_path: "~/.claude/projects/X/memory/MEMORY.md"
   content: "# Project Conventions\n\n- TypeScript..."
   ↓
3. Permission Validator Intercepts
   if (isAutoMemoryPath(file_path)) { return { decision: "allow" }; }
   ↓
4. Auto Memory Path Check
   normalizedPath → "/Users/user/.claude/projects/X/memory/MEMORY.md"
   memoryDir     → "/Users/user/.claude/projects/X/memory/"
   startsWith    → true
   ↓
5. Permission Decision: ALLOW (no user prompt)
   ↓
6. File System Operation
   fs.writeFileSync(file_path, content, "utf8")
   ↓
7. Next Turn: Fresh Content Loaded
   getAutoMemory() reads updated file
   New content appears in LLM context
```

### Permission Decision Logic

```javascript
// ============================================
// Write Tool Permission Validator
// Location: Permission validation logic
// ============================================

// READABLE (for understanding):
function validateWritePermission(toolCall) {
    if (isAutoMemoryPath(toolCall.file_path)) {
        return {
            decision: "allow",
            reason: "auto memory files are allowed"
        };
    }
    if (isTeamMemoryPath(toolCall.file_path) && shouldBypassTeamMemoryPermissions()) {
        return {
            decision: "allow",
            reason: "team memory files are allowed"
        };
    }
    // Check other whitelist categories...
}
```

---

## Edit Tool Integration

The Edit tool follows the same permission flow as Write:

**Why Edit and Write share the validator:**
- Both tools modify file system state
- Same security considerations apply
- Reduces code duplication and maintenance burden

---

## Team Memory Permission Bypass

// ============================================
// shouldBypassPermissionsForTeamMemory - Team memory permission check
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

## Concurrent Access Analysis

### Potential Race Conditions

When multiple agents write to the same memory file simultaneously:

**Scenario: Two agents updating MEMORY.md at the same time**

```
T0: MEMORY.md = "Entry A"
T1: Agent 1 reads file (content = "Entry A")
T2: Agent 2 reads file (content = "Entry A")
T3: Agent 1 writes: "Entry A\nEntry B"
T4: Agent 2 writes: "Entry A\nEntry C"
T5: Result: "Entry A\nEntry C" (Entry B lost!)
```

**Current behavior**: No file locking — last write wins

**Why no locking**:
- Simplicity: Locking adds significant complexity
- Rarity: Multi-agent concurrent writes are uncommon
- Mitigation: Topic file separation (agents write different files)

### Mitigation Strategies

**1. Topic file separation (recommended)**
```
Agent 1 → writes to: debugging.md
Agent 2 → writes to: architecture.md
Result: No conflict (different files)
```

**2. Edit tool for incremental updates**
```javascript
// Edit tool adds/modifies specific lines rather than full overwrite
await Edit({
    file_path: "~/.claude/projects/X/memory/MEMORY.md",
    old_string: "## Tools\n",
    new_string: "## Tools\n- TypeScript: Always use strict mode\n"
});
// Only changes specific lines — smaller conflict window
```

---

## Verification Tests

### Test 1: Memory file write allowed without prompt

```bash
# Setup: Enable auto memory
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=0

# Action: Write to memory file
claude --prompt "Update MEMORY.md to add: always use bun instead of npm"

# Expected: Write proceeds without permission dialog
# Verify: cat ~/.claude/projects/{hash}/memory/MEMORY.md
```

### Test 2: Non-memory file write still prompts

```bash
# Action: Write to project file (not in memory dir)
claude --prompt "Create a new file /tmp/test.txt with content 'hello'"

# Expected: Permission dialog appears for /tmp/test.txt
# (Not in auto memory directory)
```

### Test 3: Topic file write allowed

```bash
# Action: Create topic file in memory directory
claude --prompt "Create debugging.md in your memory directory with build error solutions"

# Expected: Write proceeds without prompt (topic file is in memory dir)
# Verify: ls ~/.claude/projects/{hash}/memory/
```

### Test 4: Team memory path validation

```javascript
// Verify team memory path detection
const teamPath = getTeamMemoryDirectory(); // Lk()
const testPath = teamPath + "MEMORY.md";

console.log(isTeamMemoryPath(testPath)); // Should be true
console.log(isAutoMemoryPath(testPath)); // Should be false (different directory)
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `isAutoMemoryPath` (`Da`) - Check if path is within auto memory directory (chunks.50.mjs:2451)
- `isTeamMemoryPath` (`m14`) - Check if path is within team memory directory (chunks.84.mjs:184)
- `normalizePath` (`Sz8`) - Normalize file path for comparison
- `getAutoMemoryDirectory` (`uH`) - Get auto memory directory path (chunks.50.mjs:2468)
- `getTeamMemoryDirectory` (`Lk`) - Get team memory directory path (chunks.84.mjs:144)
- `shouldBypassPermissionsForTeamMemory` (`JF6`) - Team memory permission bypass check

Cross-references:
- [architecture.md](./architecture.md) - Auto memory system architecture
- [16_error_handling_recovery.md](./16_error_handling_recovery.md) - Error handling for write operations