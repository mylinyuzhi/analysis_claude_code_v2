# Error Handling and Recovery Mechanisms

## Overview

This document provides comprehensive documentation of all error paths, edge cases, and recovery mechanisms in the auto memory system. The implementation follows a **fail-safe** philosophy: errors are caught silently and the system continues with degraded functionality rather than crashing.

**Key insight**: The dual file size limit system (200-line hard limit + 40000-character soft limit) serves different purposes: line limit protects LLM context window, character limit protects TUI performance.

---

## Dual File Size Limits

### Overview

Auto memory enforces **two independent size limits** with different enforcement strategies:

| Limit Type | Value | Constant | Location | Enforcement | User Impact |
|------------|-------|----------|----------|-------------|-------------|
| **Line limit** | 200 lines | `Qu1` | chunks.87.mjs:2312 | **Hard truncation** | Content cut in system prompt, warning appended |
| **Character limit** | 40000 chars | `Cp` | chunks.88.mjs:2530 | **Soft warning** | TUI banner displayed, no truncation |

**Why two limits?**

1. **Line limit (200 lines)**:
   - **Purpose**: Protect LLM context window from excessive memory content
   - **Rationale**: System prompt has limited space (typically 32K-100K tokens depending on model)
   - **Enforcement**: Automatic truncation on every turn
   - **User control**: Must manually refactor MEMORY.md to fix

2. **Character limit (40000 chars)**:
   - **Purpose**: Warn about TUI rendering performance degradation
   - **Rationale**: Large text files cause slow rendering in terminal UI
   - **Enforcement**: Warning banner only, no automatic action
   - **User control**: Informational, optional to fix

### Limit Interactions

```
File size: 150 lines, 5000 chars   → ✅ No warnings, full content loaded
File size: 250 lines, 30000 chars  → ⚠️ Line warning, truncated to 200 lines
File size: 180 lines, 50000 chars  → ⚠️ Character warning, full content loaded
File size: 300 lines, 60000 chars  → ⚠️ Both warnings, truncated + TUI banner
```

**Key insight**: The limits are independent - you can trigger one, both, or neither depending on content structure.

---

## Error Scenario 1: MEMORY.md Exceeds 200 Lines

### Detection

```javascript
// ============================================
// Line Limit Detection
// Location: chunks.87.mjs:2280
// ============================================

// ORIGINAL (for source lookup):
const lines = content.split("\n");
const Qu1 = 200; // MEMORY_MAX_LINES
if (lines.length > Qu1) {
  // Truncation logic...
}

// READABLE (for understanding):
const lines = content.split("\n");
const MEMORY_MAX_LINES = 200;

if (lines.length > MEMORY_MAX_LINES) {
  // File exceeds line limit, trigger truncation
  const truncatedLines = lines.slice(0, MEMORY_MAX_LINES);
  const warning = buildTruncationWarning(lines.length);
  return truncatedLines.join("\n") + "\n\n" + warning;
}

// Mapping: Qu1→MEMORY_MAX_LINES
```

### Recovery: Automatic Truncation + Warning

**Truncation algorithm**:
1. Split content into lines using `"\n"` delimiter
2. Count total lines
3. If count > 200:
   - Slice array to first 200 lines: `lines.slice(0, 200)`
   - Append warning message to truncated content
   - Return combined result

**Warning format**:
```markdown
> WARNING: MEMORY.md is 250 lines (limit: 200).
  Only the first 200 lines were loaded.
  Move detailed content into separate topic files and keep MEMORY.md as a concise index.
```

### Code Analysis

```javascript
// ============================================
// buildMemoryPrompt - Constructs system prompt section with truncation
// Location: chunks.87.mjs:2257-2297
// ============================================

// ORIGINAL (for source lookup):
function m0A() {
  try {
    const content = fs.readFileSync(memoryPath, "utf8").normalize("NFC");
    const lines = content.split("\n");

    if (lines.length > Qu1) {
      const truncated = lines.slice(0, Qu1).join("\n");
      const warning = `\n\n> WARNING: MEMORY.md is ${lines.length} lines (limit: ${Qu1}).\n  Only the first ${Qu1} lines were loaded.\n  Move detailed content into separate topic files and keep MEMORY.md as a concise index.`;
      return header + truncated + warning;
    }

    return header + content;
  } catch (error) {
    return header + emptyStateMessage;
  }
}

// READABLE (for understanding):
function buildMemoryPrompt() {
  try {
    // Read and normalize Unicode representation
    const content = fs.readFileSync(memoryFilePath, "utf8").normalize("NFC");
    const lines = content.split("\n");
    const MEMORY_MAX_LINES = 200;

    // Check if file exceeds line limit
    if (lines.length > MEMORY_MAX_LINES) {
      // Truncate to first 200 lines
      const truncatedContent = lines.slice(0, MEMORY_MAX_LINES).join("\n");

      // Build warning message
      const warningMessage = `\n\n> WARNING: MEMORY.md is ${lines.length} lines (limit: ${MEMORY_MAX_LINES}).
  Only the first ${MEMORY_MAX_LINES} lines were loaded.
  Move detailed content into separate topic files and keep MEMORY.md as a concise index.`;

      // Return truncated content with warning
      return memoryPromptHeader + truncatedContent + warningMessage;
    }

    // File within limits, return full content
    return memoryPromptHeader + content;

  } catch (error) {
    // File read failed, return empty state message
    return memoryPromptHeader + emptyStateMessage;
  }
}

// Mapping: m0A→buildMemoryPrompt, Qu1→MEMORY_MAX_LINES
```

### User Impact

**What the agent sees**:
```markdown
# auto memory

You have a persistent auto memory directory at `/Users/username/.claude/projects/abc123/memory/`.

...guidelines...

## MEMORY.md

# Project Conventions

- Use TypeScript for all files
- Follow React functional component patterns
...
[197 more lines]
...

> WARNING: MEMORY.md is 250 lines (limit: 200).
  Only the first 200 lines were loaded.
  Move detailed content into separate topic files and keep MEMORY.md as a concise index.
```

**What the agent should do**:
1. Recognize the warning in system prompt
2. Use Write tool to create topic files (e.g., `typescript.md`, `react.md`)
3. Use Edit tool to update MEMORY.md to link to topic files
4. Reduce MEMORY.md to < 200 lines

**Example agent response**:
> "I notice your MEMORY.md has exceeded the 200-line limit. I'll refactor it by:
> 1. Creating separate topic files for detailed content
> 2. Updating MEMORY.md to be a concise index with links
>
> This will ensure all content is preserved while staying within limits."

---

## Error Scenario 2: MEMORY.md Exceeds 40000 Characters

### Detection

```javascript
// ============================================
// getLargeMemoryFiles - Scans for oversized memory files
// Location: chunks.88.mjs:2439-2441
// ============================================

// ORIGINAL (for source lookup):
const Cp = 40000; // MEMORY_FILE_SIZE_WARNING_THRESHOLD

function DK1() {
  return I_().filter(f => f.content.length > Cp);
}

// READABLE (for understanding):
const MEMORY_FILE_SIZE_WARNING_THRESHOLD = 40000;

function getLargeMemoryFiles() {
  // Get all memory files (MEMORY.md + topic files)
  const allMemoryFiles = getAllMemoryFiles();

  // Filter for files exceeding character threshold
  return allMemoryFiles.filter(file =>
    file.content.length > MEMORY_FILE_SIZE_WARNING_THRESHOLD
  );
}

// Mapping: DK1→getLargeMemoryFiles, I_→getAllMemoryFiles, Cp→MEMORY_FILE_SIZE_WARNING_THRESHOLD
```

### Recovery: TUI Warning Banner (No Auto-Fix)

**Warning trigger**: TUI startup or /memory command

**Warning location**: chunks.160.mjs:1988-2008

**Warning banner format**:
```
⚠️  Large memory files detected:
   - MEMORY.md (50000 characters, recommended: < 40000)

   Large files may impact TUI rendering performance.
   Consider splitting into smaller topic files.
```

### Code Analysis

```javascript
// ============================================
// TUI Warning Banner Renderer
// Location: chunks.160.mjs:1988-2008
// ============================================

// READABLE (for understanding):
function renderMemoryWarnings() {
  const largeFiles = getLargeMemoryFiles();

  if (largeFiles.length === 0) {
    return null; // No warning needed
  }

  // Build warning message
  const fileList = largeFiles.map(file =>
    `   - ${file.name} (${file.content.length} characters, recommended: < ${MEMORY_FILE_SIZE_WARNING_THRESHOLD})`
  ).join("\n");

  return `⚠️  Large memory files detected:
${fileList}

Large files may impact TUI rendering performance.
Consider splitting into smaller topic files.`;
}
```

### User Impact

**TUI display**:
- Warning banner appears at top of memory editor modal
- User can still edit files (no blocking)
- Warning persists until files are reduced below threshold

**User actions**:
1. Press `/memory` to open editor
2. See warning banner
3. Manually split large file into smaller topic files
4. Save changes
5. Warning disappears on next TUI load

**No automatic recovery**: User must take manual action (by design)

**Why no auto-fix?**
- Character limit is **soft warning** (informational)
- TUI performance impact varies by terminal and system
- User may have legitimate reasons for large files
- Automatic splitting could break content structure

---

## Error Scenario 3: Directory Creation Fails

### Detection

```javascript
// ============================================
// Directory Creation with Silent Error Handling
// Location: chunks.87.mjs:2263-2265
// ============================================

// ORIGINAL (for source lookup):
try {
  fs.mkdirSync(memoryDir, { recursive: true });
} catch {
  // Silent failure - directory may already exist
}

// READABLE (for understanding):
try {
  // Attempt to create memory directory with recursive flag
  // recursive: true creates parent directories if needed
  fs.mkdirSync(memoryDirectory, { recursive: true });
} catch (error) {
  // Silently ignore errors
  // Common cases:
  //   - Directory already exists (EEXIST) → Safe to ignore
  //   - Permission denied (EACCES) → Will fail on file read
  //   - Disk full (ENOSPC) → Will fail on file write
}
```

### Recovery: Silent Failure (Optimistic Approach)

**Recovery strategy**: Assume directory exists, continue to file read

**Behavior by error type**:

| Error Type | POSIX Code | Behavior | Impact |
|------------|------------|----------|--------|
| Directory exists | EEXIST | Silent ignore | ✅ Normal - continue |
| Permission denied | EACCES | Silent ignore | ⚠️ File read will fail later |
| Disk full | ENOSPC | Silent ignore | ⚠️ File write will fail later |
| Path is a file | ENOTDIR | Silent ignore | ⚠️ File read will fail later |

**Why silent failure?**
- **Idempotent operation**: `mkdir -p` semantics (create if not exists)
- **Common case**: Directory usually exists after first run
- **Deferred error handling**: Actual problems surface during file I/O
- **Simplicity**: Avoids branching logic for edge cases

**Risk assessment**:
- 🟢 Low risk: Most errors (EEXIST) are harmless
- 🟡 Medium risk: Permission errors surface as empty state (see Scenario 4)
- 🔴 No risk of crash: catch block prevents exception propagation

### User Impact

**Normal case** (directory exists):
- No user-visible impact
- System prompt loads normally

**Error case** (permission denied):
- Directory creation fails silently
- File read attempt fails (caught in Scenario 4)
- Empty state message shown
- User sees: "Your MEMORY.md is currently empty..."

**Diagnostic approach**:
```bash
# Check if memory directory exists
ls -la ~/.claude/projects/*/memory/

# Check directory permissions
ls -lad ~/.claude/projects/*/memory/

# Attempt manual creation
mkdir -p ~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/
```

---

## Error Scenario 4: File Read Fails

### Detection

```javascript
// ============================================
// File Read with Error Handling
// Location: chunks.87.mjs:2267-2271
// ============================================

// ORIGINAL (for source lookup):
try {
  const content = fs.readFileSync(memoryPath, "utf8");
  // ... process content
} catch (error) {
  return header + emptyStateMessage;
}

// READABLE (for understanding):
try {
  // Attempt to read MEMORY.md file
  const content = fs.readFileSync(memoryFilePath, "utf8");

  // Process content (truncation, normalization, etc.)
  // ...

} catch (error) {
  // File read failed - return empty state message
  // Common causes:
  //   - File doesn't exist (ENOENT)
  //   - Permission denied (EACCES)
  //   - File is a directory (EISDIR)
  //   - Disk I/O error (EIO)

  return memoryPromptHeader + emptyStateMessage;
}
```

### Recovery: Return Empty State Message

**Empty state message format**:
```markdown
## MEMORY.md

Your MEMORY.md is currently empty. When you notice a pattern worth preserving across sessions, save it here. Anything in MEMORY.md will be included in your system prompt next time.
```

**Behavior by error type**:

| Error Type | POSIX Code | Cause | User Sees |
|------------|------------|-------|-----------|
| File not found | ENOENT | First run, file not created yet | Empty state message |
| Permission denied | EACCES | File permissions too restrictive | Empty state message |
| Is a directory | EISDIR | MEMORY.md is a directory, not a file | Empty state message |
| I/O error | EIO | Disk failure, network timeout | Empty state message |

**Why return empty state?**
- **Fail-safe design**: System continues functioning even without memory
- **User-friendly**: Empty state provides guidance on how to use feature
- **No data loss risk**: Original file (if exists) is not modified
- **Idempotent**: Repeated failures don't accumulate errors

### User Impact

**First run** (file doesn't exist):
- Empty state message guides user on how to populate MEMORY.md
- Agent learns when to write to memory

**Permission error**:
- User sees empty state message
- Agent doesn't have context from previous sessions
- User must fix file permissions manually

**Diagnostic approach**:
```bash
# Check if file exists
ls -la ~/.claude/projects/*/memory/MEMORY.md

# Check file permissions
stat ~/.claude/projects/*/memory/MEMORY.md

# Fix permissions if needed
chmod 644 ~/.claude/projects/*/memory/MEMORY.md
```

---

## Error Scenario 5: Unicode Normalization

### Detection

```javascript
// ============================================
// Unicode Normalization
// Location: chunks.87.mjs:2286
// ============================================

// ORIGINAL (for source lookup):
const content = fs.readFileSync(memoryPath, "utf8").normalize("NFC");

// READABLE (for understanding):
// Read file and normalize Unicode representation to NFC form
const content = fs.readFileSync(memoryFilePath, "utf8").normalize("NFC");
```

### Why Normalization is Needed

**Unicode normalization forms**:

| Form | Name | Description | Example |
|------|------|-------------|---------|
| NFC | Canonical Composition | Characters composed into single codepoints | `é` = U+00E9 |
| NFD | Canonical Decomposition | Characters decomposed into base + combining | `é` = U+0065 U+0301 |
| NFKC | Compatibility Composition | Compatible characters composed | `ﬁ` → `fi` |
| NFKD | Compatibility Decomposition | Compatible characters decomposed | `ﬁ` → `f` + `i` |

**Why NFC is chosen**:
- **Canonical composition** preserves visual appearance
- **Compatibility** with most text editors and terminals
- **Consistency** across different input methods (macOS vs Linux)

**Problem without normalization**:
```javascript
// macOS file system may store: "café" as "cafe\u0301" (NFD)
// Linux file system may store: "café" as "caf\u00E9" (NFC)

// String comparison without normalization:
"café" (NFC) === "café" (NFD)  // false! Different byte sequences

// String comparison with normalization:
"café".normalize("NFC") === "café".normalize("NFC")  // true! Same canonical form
```

### Recovery: Automatic Normalization (Always Applied)

**No error path**: Normalization is a transformation, not a validation

**User impact**:
- Invisible to user
- Ensures consistent behavior across platforms
- Prevents string matching bugs in agent logic

---

## Error Flow Diagram

### Complete Error Handling Sequence

```
┌─────────────────────────────────────────────────────────────┐
│ Turn Start: System Prompt Builder Invokes getMemoryContext()│
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Check if Auto Memory Enabled                        │
│   if (!isAutoMemoryEnabled()) {                             │
│     return null; // No memory content in prompt             │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Get Memory Directory Path                           │
│   memoryDir = getAutoMemoryDirectory();                     │
│   // e.g., ~/.claude/projects/abc123/memory/                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Attempt Directory Creation                          │
│   try {                                                      │
│     fs.mkdirSync(memoryDir, { recursive: true });           │
│   } catch {                                                  │
│     // Silent failure - optimistic approach                 │
│   }                                                          │
│   ↓ Continue regardless of result                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Attempt File Read                                   │
│   try {                                                      │
│     content = fs.readFileSync(memoryPath, "utf8");          │
│   } catch (error) {                                          │
│     // File not found, permission denied, etc.              │
│     return emptyStateMessage; ───────────────────┐          │
│   }                                              │          │
└──────────────────────────────────────────────────┼──────────┘
                            ↓                      ↓
                         Success            ┌──────────────────┐
                            ↓               │ Empty State Path │
┌─────────────────────────────────────────┐│                  │
│ Step 5: Normalize Unicode               ││ Agent sees:      │
│   content = content.normalize("NFC");   ││ "Your MEMORY.md  │
└─────────────────────────────────────────┘│  is currently    │
                            ↓               │  empty..."       │
┌─────────────────────────────────────────┐│                  │
│ Step 6: Check Line Count                ││ → Continues      │
│   lines = content.split("\n");          ││   normally       │
│   if (lines.length > 200) {             │└──────────────────┘
│     content = truncate(lines);          │
│     content += warningMessage; ─────────┼──────┐
│   }                                     │      │
└─────────────────────────────────────────┘      │
                            ↓                    ↓
                        Success          ┌───────────────────┐
                            ↓            │ Truncation Path   │
┌─────────────────────────────────────┐ │                   │
│ Step 7: Build Full Prompt Section  │ │ Agent sees:       │
│   return header + content;          │ │ - First 200 lines │
└─────────────────────────────────────┘ │ - Warning message │
                            ↓            │                   │
┌─────────────────────────────────────┐ │ → Agent should    │
│ Step 8: Inject into System Prompt  │ │   refactor file   │
└─────────────────────────────────────┘ └───────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Turn Proceeds: Agent Receives Memory Context                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Verification Tests

### Test 1: Exceed 200 Lines

**Objective**: Verify automatic truncation and warning message

**Setup**:
```bash
# Generate 250-line file
MEMORY_PATH=~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md
printf '# Line %d\n' {1..250} > "$MEMORY_PATH"
```

**Execute**:
1. Start conversation
2. Ask agent: "What's in your MEMORY.md?"
3. Agent should see truncation warning in system prompt

**Expected output**:
```
I see my MEMORY.md has 250 lines, but only the first 200 were loaded. There's a warning:

> WARNING: MEMORY.md is 250 lines (limit: 200).
  Only the first 200 lines were loaded.
  Move detailed content into separate topic files...
```

**Verify**:
```bash
# Original file still has 250 lines (not modified)
wc -l "$MEMORY_PATH"
# Output: 250
```

---

### Test 2: Exceed 40000 Characters

**Objective**: Verify TUI warning banner appears

**Setup**:
```bash
# Generate ~50KB file (50000 characters)
MEMORY_PATH=~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md
yes "This is a long line with lots of text that repeats many times to inflate file size." | head -500 > "$MEMORY_PATH"
```

**Execute**:
1. Launch Claude Code TUI
2. Press `/memory` to open memory editor
3. Check for warning banner at top

**Expected display**:
```
⚠️  Large memory files detected:
   - MEMORY.md (50000 characters, recommended: < 40000)

   Large files may impact TUI rendering performance.
   Consider splitting into smaller topic files.

[... file selector ...]
```

**Verify**:
```bash
# Check file size
wc -c "$MEMORY_PATH"
# Output: ~50000
```

---

### Test 3: Directory Permission Denied

**Objective**: Verify graceful degradation when directory can't be created

**Setup**:
```bash
# Make projects directory read-only
chmod 555 ~/.claude/projects/
```

**Execute**:
1. Start new conversation
2. Agent attempts to load memory
3. Directory creation fails silently
4. File read fails (directory doesn't exist)
5. Empty state message returned

**Expected output**:
```
Your MEMORY.md is currently empty. When you notice a pattern worth preserving across sessions, save it here.
```

**Verify**:
```bash
# Directory not created
ls ~/.claude/projects/*/memory/
# Output: No such file or directory

# Restore permissions
chmod 755 ~/.claude/projects/
```

---

### Test 4: MEMORY.md is a Directory

**Objective**: Verify error handling when file is actually a directory

**Setup**:
```bash
# Create directory instead of file
MEMORY_PATH=~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md
mkdir -p "$MEMORY_PATH"
```

**Execute**:
1. Start conversation
2. Agent attempts to read "file"
3. fs.readFileSync() throws EISDIR error
4. Catch block returns empty state message

**Expected output**:
```
Your MEMORY.md is currently empty...
```

**Verify**:
```bash
# Confirm it's a directory
file "$MEMORY_PATH"
# Output: directory

# Cleanup
rm -rf "$MEMORY_PATH"
```

---

### Test 5: Unicode Normalization

**Objective**: Verify NFC normalization prevents string matching bugs

**Setup**:
```bash
MEMORY_PATH=~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md

# Create file with NFD-normalized content (decomposed)
printf '# Café\n\nThis file uses decomposed Unicode (NFD).' > "$MEMORY_PATH"

# macOS file system stores "é" as "e" + combining acute accent
```

**Execute**:
1. Start conversation
2. Content is read and normalized to NFC
3. Agent searches for "Café" (NFC form)
4. String match succeeds (both normalized to NFC)

**Expected**: No errors, consistent string matching

**Verify**:
```bash
# Check Unicode form in file (may vary by OS)
xxd "$MEMORY_PATH" | grep -A1 "Caf"
```

---

### Test 6: Empty File (0 bytes)

**Objective**: Verify empty file is handled gracefully

**Setup**:
```bash
MEMORY_PATH=~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md
touch "$MEMORY_PATH"  # Create empty file
```

**Execute**:
1. Start conversation
2. File reads successfully (0 bytes)
3. Content is empty string
4. Lines array is [""] (single empty line)
5. Lines count is 1 (within 200 limit)
6. No truncation, no warning

**Expected**: Agent sees empty content, no error messages

**Verify**:
```bash
wc -l "$MEMORY_PATH"
# Output: 0
```

---

### Test 7: Both Limits Exceeded

**Objective**: Verify behavior when both limits are exceeded simultaneously

**Setup**:
```bash
MEMORY_PATH=~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md

# Generate 300 lines, each 200 characters (60KB total)
for i in {1..300}; do
  printf "# Line %d: %s\n" "$i" "$(yes "x" | head -180 | tr -d '\n')"
done > "$MEMORY_PATH"
```

**Execute**:
1. Start conversation → Line warning appears in system prompt
2. Press `/memory` → Character warning appears in TUI

**Expected**:
- System prompt: Truncation warning (200 lines)
- TUI: Large file warning (60000 chars)

**Verify**:
```bash
wc -l "$MEMORY_PATH"  # 300 lines
wc -c "$MEMORY_PATH"  # ~60000 characters
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `buildMemoryPrompt` (m0A) - Constructs system prompt with truncation logic
- `getLargeMemoryFiles` (DK1) - Scans for oversized files
- `MEMORY_MAX_LINES` (Qu1) - 200-line limit constant
- `MEMORY_FILE_SIZE_WARNING_THRESHOLD` (Cp) - 40000-character limit constant

---

## Key Takeaways

1. **Dual limits serve different purposes**: Line limit protects LLM context, character limit protects TUI performance
2. **Error handling is fail-safe**: All errors caught, system continues with degraded functionality
3. **Silent failures are intentional**: Optimistic approach reduces complexity
4. **User must fix large files manually**: No automatic refactoring (by design)
5. **Unicode normalization is always applied**: Prevents cross-platform string matching bugs

**Design rationale**:
- ✅ **Robust**: No crashes, always returns valid prompt content
- ✅ **User-friendly**: Clear warnings guide user to fix issues
- ✅ **Simple**: Minimal error handling code, no complex recovery logic
- ⚠️ **Limited diagnostics**: Silent failures may hide underlying problems
- ⚠️ **No auto-fix**: User must manually resolve large file warnings

**Trade-offs**:
- **Simplicity vs Diagnostics**: Silent failures simplify code but hide root causes
- **Performance vs Automation**: Manual large file fixes ensure user control
- **Consistency vs Flexibility**: NFC normalization enforces standard but may alter user input
