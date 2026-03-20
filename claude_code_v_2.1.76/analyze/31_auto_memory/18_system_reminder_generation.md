# System Reminder Generation - Prompt Injection Mechanism

## Overview

This document provides detailed analysis of how MEMORY.md content is injected into the system prompt as a dynamic variable, with warnings and guidelines. The system prompt builder recomputes the memory section on every turn by reading fresh content from disk, ensuring agents always see the latest memory state.

**Key insight**: The "auto memory" section is a **dynamic variable** that is evaluated fresh on each turn, unlike static system prompt sections that are defined once at startup.

**Version**: Claude Code v2.1.76

---

## Dynamic Variable Registration

### Registration Point

**Location**: System prompt builder initialization

Memory is registered as a **dynamic variable** in system prompt:

```javascript
registerDynamicVariable(
    "auto_memory",                              // Variable name
    () => getAutoMemory(),                      // Evaluator function (ID1 - async)
    "MEMORY.md is read from disk each turn"     // Description for debugging
);
```

**How it works:**
1. **Startup**: `registerDynamicVariable()` is called once when system initializes
2. **Every turn**: System prompt builder invokes all dynamic variable evaluators
3. **Fresh read**: `getAutoMemory()` (`ID1`) reads MEMORY.md from disk (not cached)
4. **Concatenation**: Result is inserted into system prompt at "auto_memory" placeholder
5. **LLM receives**: Full system prompt with latest memory content

**Why dynamic?**
- **Real-time updates**: Agents see changes immediately after Write/Edit tool calls
- **No restart needed**: Memory updates don't require restarting Claude Code
- **Consistency**: All turns in a session see the exact same memory state at that point in time
- **Hot-reload semantics (v2.1.76)**: Because the file is read fresh every turn via `fs.readFileSync()` with no caching, external file edits (user manually editing MEMORY.md outside Claude Code) become visible at the next agent turn boundary

**Alternative approaches** (not implemented):
- **Static loading**: Read MEMORY.md once at startup (would miss updates within session)
- **Cached with invalidation**: Cache content, invalidate on Write/Edit (complex, fragile)
- **Polling**: Check file modification time, reload if changed (overhead without benefit given turn-based reads)

---

## Hot-Reload on File Changes (v2.1.76)

### Mechanism

In v2.1.76, the turn-based fresh-read mechanism provides effective hot-reload for MEMORY.md content:

- **Implementation**: Every turn calls `fs.readFileSync()` directly on the memory file path
- **No cache layer**: There is no in-memory cache between turns; each call hits the filesystem directly
- **External edits visible**: If the user edits MEMORY.md using an external editor, the new content is picked up at the start of the next agent turn
- **Within-turn writes**: If an agent writes to MEMORY.md during Turn N using the Write or Edit tool, the updated content is loaded at the start of Turn N+1

### Constraint

Hot-reload only applies at turn boundaries. Changes made mid-turn (while the LLM is processing) are not visible until the following turn. This is by design — the system prompt is assembled once per turn before the LLM call.

### Practical Impact

```
User edits MEMORY.md externally (e.g., deletes outdated entries)
  ↓
User sends next message to agent
  ↓
Turn N+1: getAutoMemory() calls fs.readFileSync() → reads updated content
  ↓
Agent receives system prompt with updated memory (no restart needed)
```

This means users can freely edit their memory files between turns and the agent will always see the current state.

---

## Prompt Building Flow Diagram

### Complete Turn-by-Turn Process

```
Turn N Starts: User sends message
                    |
System Prompt Builder: Construct full prompt
   Static sections:
   - Agent role and capabilities
   - Tool descriptions
   - Working directory context
   - Code indexing rules
   Dynamic variables (evaluated fresh each turn):
   - auto_memory  <-- INVOKES getAutoMemory() (ID1)
   - git_status   <-- INVOKES getGitStatus()
   - recent_errors<-- INVOKES getRecentErrors()
                    |
getAutoMemory() Execution Flow
   Step 1: Check if auto memory enabled
      if (!isAutoMemoryEnabled()) {
        return null; // No memory section in prompt
      }
   Step 2: Check feature flags for format
      - tengu_passport_quail: Background agent mode
      - tengu_swinburne_dune: File-based format
   Step 3: Ensure directory exists
      await ensureMemoryDirExists(memoryDir);
   Step 4: Record telemetry
      recordMemoryDirLoadMetrics(memoryDir, {...});
   Step 5: Return appropriate prompt format
      - Simple format (uv9)
      - File-based format (U14)
      - Background agent format (xv9)
                    |
Full System Prompt Assembled
   [Static sections]
   [auto_memory dynamic variable content]
   [Other dynamic variables]
                    |
Send to LLM API
   POST /v1/messages
   {
     "system": "[FULL SYSTEM PROMPT]",
     "messages": [...conversation history...],
     ...
   }
                    |
LLM Response: Agent acts with memory context
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

---

## System Prompt Template Structure

### Complete Template Breakdown

The `buildMemoryPrompt` (`Q14`) function constructs the memory section:

**Template Sections**:

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
**Maximum total**: ~235 lines (30 static + 200 content + 5 warning)

---

## Truncation Warning Format

### Warning Trigger Condition

```javascript
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

**Placement**: Appended after the 200th line of content, making the warning visible to the agent in context.

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

---

## Code Analysis: getAutoMemory Entry Point

// ============================================
// getAutoMemory - Main async entry point for memory prompt injection
// Location: chunks.84.mjs:382-411
// ============================================

// ORIGINAL (for source lookup):
async function ID1() {
    let A = Z3(),
        q = w8("tengu_swinburne_dune", !1);
    if (F14.isTeamMemoryEnabled()) {
        let K = uH(),
            Y = F14.getTeamMemPath();
        if (await CD1(Y), DF6(K, { memory_type: "auto" }), DF6(Y, { memory_type: "team" }),
            w8("tengu_passport_quail", !1)) return Qf8.buildExtractModeTypedCombinedPrompt();
        if (q) return Qf8.buildTypedCombinedMemoryPrompt();
        return Qf8.buildCombinedMemoryPrompt()
    }
    if (A) {
        let K = uH();
        if (await CD1(K), DF6(K, { memory_type: "auto" }), w8("tengu_passport_quail", !1))
            return xv9("auto memory", K).join("\n");
        if (q) return U14("auto memory", K).join("\n");
        return uv9()
    }
    if (d("tengu_memdir_disabled", {
        disabled_by_env_var: t6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
        disabled_by_setting: !t6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) && mA().autoMemoryEnabled === !1
    }), w8("tengu_herring_clock", !1)) d("tengu_team_memdir_disabled", {});
    return null
}

// Mapping: ID1 → getAutoMemory, Z3 → isAutoMemoryEnabled, uH → getAutoMemoryDirectory,
//          CD1 → ensureMemoryDirExists, DF6 → recordMemoryDirLoadMetrics, uv9 → buildAutoMemoryPromptSimple,
//          U14 → buildMemoryIndex, xv9 → buildBackgroundAgentMemoryPrompt

---

## Verification Steps

### Test 1: Verify Fresh Read on Each Turn

**Objective**: Confirm MEMORY.md is read from disk each turn, not cached

1. Start conversation
2. Ask agent: "What's in your MEMORY.md?"
3. Agent response: "Empty" (assuming file doesn't exist)
4. **In another terminal**: Create MEMORY.md with "# Test Content"
5. **Without restarting Claude Code**, send next message
6. **Expected**: Agent sees "# Test Content" (fresh read detected change)

```bash
# In another terminal while conversation is running
echo "# Test Content" > ~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md
```

### Test 2: Verify Memory Disabled Returns Null

```bash
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
```

1. Start conversation
2. Ask agent: "Do you have an 'auto memory' section in your system prompt?"
3. **Expected**: Agent confirms no such section exists

---

## Memory Attachment Types

In addition to the primary `auto_memory` dynamic variable, the system provides two attachment types that inject memory content into the conversation context as system reminders.

### nested_memory Attachment Type

**Purpose**: Load individual memory files that are referenced by the agent's memory directory.

**Trigger**: When `nestedMemoryAttachmentTriggers` set contains file paths (typically from CLAUDE.md includes or @-mentions).

#### Producer Function

// ============================================
// produceNestedMemoryAttachment - Producer for nested memory files
// Location: chunks.147.mjs:541-550
// ============================================

// ORIGINAL (for source lookup):
async function IuY(A) {
    if (!A.nestedMemoryAttachmentTriggers || A.nestedMemoryAttachmentTriggers.size === 0) return [];
    let q = A.getAppState(), K = [];
    for (let Y of A.nestedMemoryAttachmentTriggers) {
        let z = Yqq(Y, A, q);
        K.push(...z)
    }
    return K
}

// READABLE (for understanding):
async function produceNestedMemoryAttachment(context) {
    if (!context.nestedMemoryAttachmentTriggers?.size) return [];

    const appState = context.getAppState();
    const attachments = [];

    for (const triggerPath of context.nestedMemoryAttachmentTriggers) {
        const memoryFiles = collectNestedMemoryFiles(triggerPath, context, appState);
        attachments.push(...memoryFiles);
    }

    return attachments;
}

// Mapping: IuY → produceNestedMemoryAttachment, Yqq → collectNestedMemoryFiles

#### Normalization Function

// ============================================
// nested_memory normalization - Converts attachment to system reminder message
// Location: chunks.174.mjs:165-171
// ============================================

// ORIGINAL (for source lookup):
case "nested_memory":
    return b5([p1({
        content: `Contents of ${A.content.path}:

${A.content.content}`,
        isMeta: !0
    })]);

// READABLE (for understanding):
case "nested_memory":
    return wrapWithSystemReminderTags([createUserMessage({
        content: `Contents of ${attachment.content.path}:\n\n${attachment.content.content}`,
        isMeta: true
    })]);

// Mapping: b5 → wrapWithSystemReminderTags, p1 → createUserMessage, A → attachment

**Attachment Structure**:
```typescript
{
    type: "nested_memory",
    path: string,          // Full file path
    content: MemoryFile,   // File content object
    displayPath: string    // Relative path for display
}
```

**How normalization works:**
1. Extract `path` and `content` from attachment's `content` property
2. Format as markdown with "Contents of {path}:" header
3. Wrap in `createUserMessage()` with `isMeta: true` flag
4. Wrap result in `<system-reminder>` XML tags via `b5()`

**Why this format:**
- **Clear attribution**: Path shows exactly which memory file this is
- **Inline visibility**: Content appears directly in conversation context
- **Meta-flagged**: Hidden from UI, visible only to LLM

---

### relevant_memories Attachment Type

**Purpose**: Load recently-accessed or relevant memory files with staleness information.

**Trigger**: When `tengu_moth_copse` feature flag is enabled and user message contains relevant keywords.

**Key insight**: This attachment type includes last-modified timestamps, enabling staleness warnings via `Cz8` (buildStalenessWarning).

#### Staleness Detection Functions

// ============================================
// buildStalenessWarning - Generate staleness warning for old memories
// formatRelativeTime - Convert timestamp to human-readable relative time
// Location: chunks.50.mjs:2480-2491
// ============================================

// ORIGINAL (for source lookup):
function cJ7(A) {
    let q = dJ7(A);
    if (q === 0) return "today";
    if (q === 1) return "yesterday";
    return `${q} days ago`
}

function Cz8(A) {
    let q = dJ7(A);
    if (q <= 1) return "";
    return `This memory is ${q} days old. ` + "Memories are point-in-time observations, not live state — " + "claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact."
}

// READABLE (for understanding):
function formatRelativeTime(timestampMs) {
    const daysSince = getDaysSinceTimestamp(timestampMs);
    if (daysSince === 0) return "today";
    if (daysSince === 1) return "yesterday";
    return `${daysSince} days ago`;
}

function buildStalenessWarning(timestampMs) {
    const daysSince = getDaysSinceTimestamp(timestampMs);
    if (daysSince <= 1) return "";  // No warning for recent memories
    return `This memory is ${daysSince} days old. ` +
           "Memories are point-in-time observations, not live state — " +
           "claims about code behavior or file:line citations may be outdated. " +
           "Verify against current code before asserting as fact.";
}

// Mapping: cJ7 → formatRelativeTime, Cz8 → buildStalenessWarning, dJ7 → getDaysSinceTimestamp

**Staleness Logic:**
| Days Since Modification | formatRelativeTime Output | buildStalenessWarning Output |
|------------------------|---------------------------|------------------------------|
| 0 | "today" | "" (no warning) |
| 1 | "yesterday" | "" (no warning) |
| 2+ | "N days ago" | Full warning message |

**Why no warning for ≤1 day:**
- Recent memories (< 48 hours) are likely still accurate
- Avoids cluttering prompt with unnecessary warnings
- Balances caution with usability

#### Normalization Function

// ============================================
// relevant_memories normalization - Converts attachment to system reminder messages
// Location: chunks.174.mjs:172-184
// ============================================

// ORIGINAL (for source lookup):
case "relevant_memories":
    return b5(A.memories.map((K) => {
        let Y = Cz8(K.mtimeMs),
            z = Y ? `${Y}

Memory: ${K.path}:` : `Memory (saved ${cJ7(K.mtimeMs)}): ${K.path}:`;
        return p1({
            content: `${z}

${K.content}`,
            isMeta: !0
        })
    }));

// READABLE (for understanding):
case "relevant_memories":
    return wrapWithSystemReminderTags(attachment.memories.map((memory) => {
        // Get staleness warning if memory is old
        const stalenessWarning = buildStalenessWarning(memory.mtimeMs);  // Cz8

        // Build header with or without warning
        const header = stalenessWarning
            ? `${stalenessWarning}\n\nMemory: ${memory.path}:`
            : `Memory (saved ${formatRelativeTime(memory.mtimeMs)}): ${memory.path}:`;

        return createUserMessage({
            content: `${header}\n\n${memory.content}`,
            isMeta: true
        });
    }));

// Mapping: b5 → wrapWithSystemReminderTags, p1 → createUserMessage, A → attachment,
//          K → memory, Y → stalenessWarning, z → header, Cz8 → buildStalenessWarning,
//          cJ7 → formatRelativeTime

**How normalization works:**
1. Iterate over each memory in `attachment.memories` array
2. For each memory, check staleness using `buildStalenessWarning()`
3. If stale (>1 day): Include warning + "Memory: {path}:"
4. If fresh (≤1 day): Include "Memory (saved {relativeTime}): {path}:"
5. Combine header with content and wrap in system reminder tags

**Example Output**:
```
Memory (saved yesterday): /path/to/debugging.md:

# Debugging Notes

- Always check logs first
...

Memory: /path/to/patterns.md:

This memory is 5 days old. Memories are point-in-time observations, not live state — claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact.

# Project Patterns

...
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `getAutoMemory` (`ID1`) - Main async entry point for memory prompt injection
- `buildMemoryPrompt` (`Q14`) - Constructs full memory section with file content
- `buildAutoMemoryPromptSimple` (`uv9`) - Simple prompt without file reading
- `buildMemoryIndex` (`U14`) - Index-style prompt for file-based format
- `buildBackgroundAgentMemoryPrompt` (`xv9`) - Background agent memory prompt
- `isAutoMemoryEnabled` (`Z3`) - Feature enable check
- `produceNestedMemoryAttachment` (`IuY`) - nested_memory attachment producer
- `collectNestedMemoryFiles` (`Yqq`) - Collect memory files from trigger path
- `buildStalenessWarning` (`Cz8`) - Staleness warning builder (chunks.50.mjs:2487-2491)
- `formatRelativeTime` (`cJ7`) - Relative time formatter (chunks.50.mjs:2480-2485)
- `getDaysSinceTimestamp` (`dJ7`) - Days since timestamp calculator
- `wrapWithSystemReminderTags` (`b5`) - XML wrapper for system reminders
- `createUserMessage` (`p1`) - Message factory with isMeta flag

---

## Key Takeaways

1. **Dynamic variable system**: Memory content is read fresh on every turn
2. **Multi-part template**: ~30 lines of static guidelines + up to 200 lines of content
3. **Automatic truncation**: Content > 200 lines is cut, warning appended
4. **Empty state guidance**: Missing file shows helpful message, not error
5. **Telemetry tracking**: Every memory load is logged for analytics
6. **Feature flag driven**: Different formats based on `tengu_passport_quail` and `tengu_swinburne_dune` flags

**Design rationale**:
- Fresh content: Dynamic variables ensure real-time updates
- Comprehensive guidelines: Static sections educate agent on memory usage
- Fail-safe: Missing file doesn't crash, shows guidance instead
- Observable: Telemetry provides usage insights
- I/O overhead: Reading file on every turn (minimal for typical file sizes)

**Trade-offs**:
- **Fresh vs Cached**: Always read from disk (slight performance cost for consistency benefit)
- **Static guidelines overhead**: ~30 lines every turn (worth it for agent education)
- **No version control**: Changes are immediate, no rollback mechanism (simplicity over auditability)