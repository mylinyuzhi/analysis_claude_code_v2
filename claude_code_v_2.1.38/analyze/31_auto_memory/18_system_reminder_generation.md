# System Reminder Generation - Prompt Injection Mechanism

## Overview

This document provides detailed analysis of how MEMORY.md content is injected into the system prompt as a dynamic variable, with warnings and guidelines. The system prompt builder recomputes the memory section on every turn by reading fresh content from disk, ensuring agents always see the latest memory state.

**Key insight**: The "auto memory" section is a **dynamic variable** that is evaluated fresh on each turn, unlike static system prompt sections that are defined once at startup.

---

## Dynamic Variable Registration

### Registration Point

**Location**: chunks.169.mjs:246

```javascript
// ============================================
// Auto Memory Dynamic Variable Registration
// Location: chunks.169.mjs:246
// ============================================

// ORIGINAL (for source lookup):
wc("auto_memory", () => F0A(), "MEMORY.md is read from disk each turn");

// READABLE (for understanding):
registerDynamicVariable(
  "auto_memory",                              // Variable name
  () => getMemoryContext(),                   // Evaluator function (called each turn)
  "MEMORY.md is read from disk each turn"     // Description for debugging
);

// Mapping: wc→registerDynamicVariable, F0A→getMemoryContext
```

**How it works:**
1. **Startup**: `registerDynamicVariable()` is called once when system initializes
2. **Every turn**: System prompt builder invokes all dynamic variable evaluators
3. **Fresh read**: `getMemoryContext()` reads MEMORY.md from disk (not cached)
4. **Concatenation**: Result is inserted into system prompt at "auto_memory" placeholder
5. **LLM receives**: Full system prompt with latest memory content

**Why dynamic?**
- **Real-time updates**: Agents see changes immediately after Write/Edit tool calls
- **No restart needed**: Memory updates don't require restarting Claude Code
- **Consistency**: All turns in a session see the exact same memory state at that point in time

**Alternative approaches** (not implemented):
- **Static loading**: Read MEMORY.md once at startup (would miss updates)
- **Cached with invalidation**: Cache content, invalidate on Write/Edit (complex)
- **Polling**: Check file modification time, reload if changed (overhead)

---

## Prompt Building Flow Diagram

### Complete Turn-by-Turn Process

```
┌─────────────────────────────────────────────────────────────┐
│ Turn N Starts: User sends message                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ System Prompt Builder: Construct full prompt                │
│   Static sections:                                           │
│   - Agent role and capabilities                             │
│   - Tool descriptions                                        │
│   - Working directory context                               │
│   - Code indexing rules                                     │
│   Dynamic variables (evaluated fresh each turn):            │
│   - auto_memory ← INVOKES getMemoryContext()                │
│   - git_status ← INVOKES getGitStatus()                     │
│   - recent_errors ← INVOKES getRecentErrors()               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ getMemoryContext() Execution Flow                           │
│                                                              │
│ Step 1: Check if auto memory enabled                        │
│   if (!isAutoMemoryEnabled()) {                             │
│     return null; // No memory section in prompt             │
│   }                                                          │
│                                                              │
│ Step 2: Call buildMemoryPrompt()                            │
│   return buildMemoryPrompt();                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ buildMemoryPrompt() Constructs Memory Section               │
│                                                              │
│ Part 1: Header (6 lines)                                    │
│   # auto memory                                              │
│                                                              │
│   You have a persistent auto memory directory at            │
│   `/Users/username/.claude/projects/abc123/memory/`.        │
│                                                              │
│ Part 2: Introduction (4 lines)                              │
│   Its contents persist across conversations.                │
│                                                              │
│   As you work, consult your memory files to build on        │
│   previous experience. When you encounter a mistake that    │
│   seems like it could be common, check your auto memory...  │
│                                                              │
│ Part 3: Guidelines (22 lines)                               │
│   Guidelines:                                                │
│   - `MEMORY.md` is always loaded into your system prompt... │
│   - Create separate topic files (e.g., `debugging.md`,...   │
│   ...                                                        │
│                                                              │
│ Part 4: What to Save / Not Save (8 lines)                   │
│   What to save:                                              │
│   - Stable patterns and conventions...                      │
│   ...                                                        │
│   What NOT to save:                                          │
│   - Session-specific context...                             │
│   ...                                                        │
│                                                              │
│ Part 5: Explicit User Requests (4 lines)                    │
│   Explicit user requests:                                    │
│   - When the user asks you to remember something...         │
│   ...                                                        │
│                                                              │
│ Part 6: MEMORY.md Content Section (2 lines + content)       │
│   ## MEMORY.md                                               │
│                                                              │
│   [ACTUAL FILE CONTENT OR EMPTY STATE MESSAGE]              │
│   ↓ Either:                                                  │
│   A) File content (if exists, <= 200 lines)                 │
│   B) File content (first 200 lines) + warning               │
│   C) Empty state message (if file doesn't exist/read error) │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Full System Prompt Assembled                                │
│   [Static sections]                                          │
│   ...                                                        │
│   [auto_memory dynamic variable content]                    │
│   ...                                                        │
│   [Other dynamic variables]                                  │
│   ...                                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Send to LLM API                                              │
│   POST /v1/messages                                          │
│   {                                                          │
│     "system": "[FULL SYSTEM PROMPT]",                       │
│     "messages": [...conversation history...],               │
│     ...                                                      │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ LLM Response: Agent acts with memory context                │
└─────────────────────────────────────────────────────────────┘
```

### Turn-by-Turn Example

**Turn 1**: User says "Remember we use TypeScript"
```
System Prompt:
  # auto memory
  ...
  ## MEMORY.md
  Your MEMORY.md is currently empty...

Agent Response:
  I'll save that to memory.
  [Calls Write tool to create MEMORY.md with "# Project Conventions\n\n- TypeScript..."]
```

**Turn 2**: User says "What language do we use?"
```
System Prompt (regenerated, fresh read):
  # auto memory
  ...
  ## MEMORY.md
  # Project Conventions

  - TypeScript for all new files

Agent Response:
  According to my memory, we use TypeScript for all new files.
```

**Turn 3**: Agent updates memory (adds another convention)
```
Agent Action:
  [Calls Edit tool to append "- React functional components preferred"]
```

**Turn 4**: User asks "What are our conventions?"
```
System Prompt (regenerated, fresh read):
  # auto memory
  ...
  ## MEMORY.md
  # Project Conventions

  - TypeScript for all new files
  - React functional components preferred

Agent Response:
  Our conventions are:
  1. TypeScript for all new files
  2. React functional components preferred
```

---

## System Prompt Template Structure

### Complete Template Breakdown

```javascript
// ============================================
// buildMemoryPrompt - Constructs full auto memory section
// Location: chunks.87.mjs:2257-2297
// ============================================

// READABLE (for understanding):
function buildMemoryPrompt() {
  const memoryDirectory = getAutoMemoryDirectory();
  const memoryFilePath = path.join(memoryDirectory, "MEMORY.md");

  // === Part 1: Header ===
  let promptSection = `# auto memory\n\n`;

  // === Part 2: Directory Info ===
  promptSection += `You have a persistent auto memory directory at \`${memoryDirectory}\`.\n\n`;

  // === Part 3: Introduction ===
  promptSection += `Its contents persist across conversations.\n\n`;
  promptSection += `As you work, consult your memory files to build on previous experience. When you encounter a mistake that seems like it could be common, check your auto memory for relevant notes — and if nothing is written yet, record what you learned.\n\n`;

  // === Part 4: Guidelines ===
  promptSection += `Guidelines:\n`;
  promptSection += `- \`MEMORY.md\` is always loaded into your system prompt — lines after 200 will be truncated, so keep it concise\n`;
  promptSection += `- Create separate topic files (e.g., \`debugging.md\`, \`patterns.md\`) for detailed notes and link to them from MEMORY.md\n`;
  promptSection += `- Update or remove memories that turn out to be wrong or outdated\n`;
  promptSection += `- Organize memory semantically by topic, not chronologically\n`;
  promptSection += `- Use the Write and Edit tools to update your memory files\n\n`;

  // === Part 5: What to Save ===
  promptSection += `What to save:\n`;
  promptSection += `- Stable patterns and conventions confirmed across multiple interactions\n`;
  promptSection += `- Key architectural decisions, important file paths, and project structure\n`;
  promptSection += `- User preferences for workflow, tools, and communication style\n`;
  promptSection += `- Solutions to recurring problems and debugging insights\n\n`;

  // === Part 6: What NOT to Save ===
  promptSection += `What NOT to save:\n`;
  promptSection += `- Session-specific context (current task details, in-progress work, temporary state)\n`;
  promptSection += `- Information that might be incomplete — verify against project docs before writing\n`;
  promptSection += `- Anything that duplicates or contradicts existing CLAUDE.md instructions\n`;
  promptSection += `- Speculative or unverified conclusions from reading a single file\n\n`;

  // === Part 7: Explicit User Requests ===
  promptSection += `Explicit user requests:\n`;
  promptSection += `- When the user asks you to remember something across sessions (e.g., "always use bun", "never auto-commit"), save it — no need to wait for multiple interactions\n`;
  promptSection += `- When the user asks to forget or stop remembering something, find and remove the relevant entries from your memory files\n\n`;

  // === Part 8: MEMORY.md Content ===
  promptSection += `## MEMORY.md\n\n`;

  try {
    // Read and normalize file content
    const content = fs.readFileSync(memoryFilePath, "utf8").normalize("NFC");
    const lines = content.split("\n");
    const MEMORY_MAX_LINES = 200;

    if (lines.length > MEMORY_MAX_LINES) {
      // Truncation case
      const truncatedContent = lines.slice(0, MEMORY_MAX_LINES).join("\n");
      const warningMessage = `\n\n> WARNING: MEMORY.md is ${lines.length} lines (limit: ${MEMORY_MAX_LINES}).\n  Only the first ${MEMORY_MAX_LINES} lines were loaded.\n  Move detailed content into separate topic files and keep MEMORY.md as a concise index.`;

      promptSection += truncatedContent + warningMessage;

    } else {
      // Normal case
      promptSection += content;
    }

  } catch (error) {
    // File read error case
    const emptyStateMessage = `Your MEMORY.md is currently empty. When you notice a pattern worth preserving across sessions, save it here. Anything in MEMORY.md will be included in your system prompt next time.`;
    promptSection += emptyStateMessage;
  }

  return promptSection;
}
```

### Template Sections Explained

| Section | Line Count | Purpose | Dynamic? |
|---------|------------|---------|----------|
| **Header** | 1 | Markdown heading for memory section | Static |
| **Directory Info** | 2 | Shows path to memory directory | Semi-dynamic (path varies by project) |
| **Introduction** | 4 | Explains memory purpose and when to use | Static |
| **Guidelines** | 6 | How to organize and maintain memory | Static |
| **What to Save** | 5 | Criteria for writing to memory | Static |
| **What NOT to Save** | 5 | Anti-patterns to avoid | Static |
| **Explicit Requests** | 3 | How to handle user "remember" commands | Static |
| **MEMORY.md Content** | 1 + variable | Actual file content or empty state | **Fully dynamic** |
| **Truncation Warning** | 4 (conditional) | Appears if file > 200 lines | **Conditional dynamic** |

**Total static overhead**: ~30 lines (always present)
**Variable content**: Up to 200 lines (file content)
**Maximum total**: ~234 lines (30 static + 200 content + 4 warning)

---

## Truncation Warning Format

### Warning Trigger Condition

```javascript
// Condition: File has more than 200 lines
if (lines.length > MEMORY_MAX_LINES) {
  // Trigger truncation and warning
}
```

### Warning Message Template

```markdown
> WARNING: MEMORY.md is {N} lines (limit: 200).
  Only the first 200 lines were loaded.
  Move detailed content into separate topic files and keep MEMORY.md as a concise index.
```

**Placeholder substitution**:
- `{N}` → Actual line count (e.g., 250)

### Warning Placement

```
[Lines 1-200 of MEMORY.md]


> WARNING: MEMORY.md is 250 lines (limit: 200).
  Only the first 200 lines were loaded.
  Move detailed content into separate topic files and keep MEMORY.md as a concise index.
```

**Why append warning?**
- **Visibility**: Agent sees warning in context, right after content
- **Actionability**: Warning includes specific guidance on how to fix
- **No blocking**: Agent can still use first 200 lines while fixing the issue

---

## Empty State Message

### Trigger Conditions

1. **File doesn't exist**: First run, `fs.readFileSync()` throws ENOENT
2. **Read permission denied**: `fs.readFileSync()` throws EACCES
3. **File is a directory**: `fs.readFileSync()` throws EISDIR
4. **I/O error**: `fs.readFileSync()` throws EIO

### Empty State Message Content

```markdown
Your MEMORY.md is currently empty. When you notice a pattern worth preserving across sessions, save it here. Anything in MEMORY.md will be included in your system prompt next time.
```

**Purpose**:
- **Guidance**: Explains when to write to memory
- **Non-blocking**: Agent can continue without memory
- **Educational**: Teaches agent the memory system's purpose

**Alternative approaches** (not implemented):
- **No message**: Agent doesn't know about memory system
- **Error message**: "File not found" would be confusing
- **Placeholder content**: Pre-fill with template (would clutter system prompt)

---

## Code Analysis: getMemoryContext Entry Point

```javascript
// ============================================
// getMemoryContext - Main entry point for memory prompt injection
// Location: chunks.87.mjs:2290-2297
// ============================================

// ORIGINAL (for source lookup):
function F0A() {
  if (!y2()) {
    return null;
  }
  return m0A();
}

// READABLE (for understanding):
function getMemoryContext() {
  // Check if auto memory is enabled (priority chain)
  if (!isAutoMemoryEnabled()) {
    // Memory disabled, return null (no section in system prompt)
    return null;
  }

  // Memory enabled, build and return prompt section
  return buildMemoryPrompt();
}

// Mapping: F0A→getMemoryContext, y2→isAutoMemoryEnabled, m0A→buildMemoryPrompt
```

**Control flow**:
```
getMemoryContext() called by system prompt builder
  ↓
Check: isAutoMemoryEnabled()?
  ├─ No → return null (no memory section)
  └─ Yes → continue
        ↓
        buildMemoryPrompt()
          ↓
          return full memory section
```

---

## Verification Steps

### Test 1: Verify Fresh Read on Each Turn

**Objective**: Confirm MEMORY.md is read from disk each turn, not cached

**Steps**:
1. Start conversation
2. Ask agent: "What's in your MEMORY.md?"
3. Agent response: "Empty" (assuming file doesn't exist)
4. **In another terminal**: Create MEMORY.md with "# Test Content"
5. **Without restarting Claude Code**, send next message: "What's in your MEMORY.md now?"
6. **Expected**: Agent sees "# Test Content" (fresh read detected change)

**Command**:
```bash
# In another terminal while conversation is running
echo "# Test Content" > ~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md
```

---

### Test 2: Verify Truncation Warning Appears

**Objective**: Confirm warning is injected when file exceeds 200 lines

**Setup**:
```bash
MEMORY_PATH=~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md
printf '# Line %d\n' {1..250} > "$MEMORY_PATH"
```

**Steps**:
1. Start conversation
2. Ask agent: "Do you see any warnings in your memory?"
3. **Expected**: Agent quotes the truncation warning verbatim

**Agent response should include**:
```
> WARNING: MEMORY.md is 250 lines (limit: 200).
  Only the first 200 lines were loaded.
```

---

### Test 3: Verify Empty State Message

**Objective**: Confirm empty state message appears when file doesn't exist

**Setup**:
```bash
# Ensure MEMORY.md doesn't exist
rm -f ~/.claude/projects/*/memory/MEMORY.md
```

**Steps**:
1. Start conversation
2. Ask agent: "Show me the exact text of your MEMORY.md section in the system prompt"
3. **Expected**: Agent quotes empty state message

**Agent response should include**:
```
Your MEMORY.md is currently empty. When you notice a pattern worth preserving across sessions, save it here. Anything in MEMORY.md will be included in your system prompt next time.
```

---

### Test 4: Verify Memory Disabled Returns Null

**Objective**: Confirm no memory section when auto memory is disabled

**Setup**:
```bash
# Disable auto memory
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
```

**Steps**:
1. Start conversation with env var set
2. Ask agent: "Do you have an 'auto memory' section in your system prompt?"
3. **Expected**: Agent confirms no such section exists

**Agent response**:
```
No, I don't see an "auto memory" section in my system prompt.
```

---

### Test 5: Verify Guidelines Section Content

**Objective**: Confirm static guidelines are present in every prompt

**Steps**:
1. Start conversation with auto memory enabled
2. Ask agent: "What are the guidelines for organizing my MEMORY.md?"
3. **Expected**: Agent quotes guidelines from system prompt

**Agent response should include**:
- Keep MEMORY.md concise (<200 lines)
- Create separate topic files
- Organize semantically, not chronologically
- Use Write and Edit tools to update

---

## Telemetry Integration

### Telemetry Event: `tengu_memdir_loaded`

**Trigger**: After MEMORY.md read completes (in `buildMemoryPrompt()`)

**Payload**:
```javascript
{
  content_length: number,      // Character count
  line_count: number,          // Line count
  was_truncated: boolean,      // true if > 200 lines
  memory_type: "auto",         // Always "auto" for this event
  total_file_count: number,    // Files in memory directory
  total_subdir_count: number   // Subdirectories in memory directory
}
```

**Location**: chunks.87.mjs:2282-2287

**Why this matters**:
- **Usage tracking**: How many projects use auto memory
- **Size monitoring**: Detect oversized files across user base
- **Truncation rate**: How often users exceed 200-line limit
- **Directory structure**: How users organize topic files

See [19_telemetry_monitoring.md](./19_telemetry_monitoring.md) for full telemetry analysis.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `getMemoryContext` (F0A) - Main entry point for memory prompt injection
- `buildMemoryPrompt` (m0A) - Constructs full auto memory section
- `isAutoMemoryEnabled` (y2) - Feature enable check
- `registerDynamicVariable` (wc) - Registers dynamic system prompt variable

---

## Key Takeaways

1. **Dynamic variable system**: Memory content is read fresh on every turn
2. **Multi-part template**: 30 lines of static guidelines + up to 200 lines of content
3. **Automatic truncation**: Content > 200 lines is cut, warning appended
4. **Empty state guidance**: Missing file shows helpful message, not error
5. **Telemetry tracking**: Every memory load is logged for analytics

**Design rationale**:
- ✅ **Fresh content**: Dynamic variables ensure real-time updates
- ✅ **Comprehensive guidelines**: Static sections educate agent on memory usage
- ✅ **Fail-safe**: Missing file doesn't crash, shows guidance instead
- ✅ **Observable**: Telemetry provides usage insights
- ⚠️ **I/O overhead**: Reading file on every turn (minimal for typical file sizes)

**Trade-offs**:
- **Fresh vs Cached**: Always read from disk (slight performance cost for consistency benefit)
- **Static guidelines overhead**: ~30 lines every turn (worth it for agent education)
- **No version control**: Changes are immediate, no rollback mechanism (simplicity over auditability)
