# Auto Memory Cross-Module Integration

## Overview

Auto Memory integrates with multiple Claude Code modules to provide persistent knowledge across sessions. This document analyzes the integration points and data flows between memory and other systems.

**Key insight**: Memory is not isolated—it participates in a rich ecosystem of dynamic variable injection, permission handling, agent coordination, and remote synchronization.

**Version**: Claude Code v2.1.76

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key integration functions:
- `getAutoMemory` (`ID1`) - Async entry point for memory loading
- `normalizeAttachmentForAPI` (`Ui8`) - Attachment normalization
- `produceRelevantMemories` (`buY`) - Semantic memory producer
- `buildStalenessWarning` (`Cz8`) - Staleness detection
- `isAutoMemoryPath` (`Da`) - Path validation for permissions

---

## 1. Integration with System Reminder (04_system_reminder)

### 1.1 Dynamic Variable Registration

Auto memory is registered as a **dynamic variable** in the system prompt builder:

**Registration Location**: chunks.169.mjs:231, 246

```javascript
// ============================================
// Dynamic Variable Registration
// Location: chunks.169.mjs:231
// ============================================

// ORIGINAL (for source lookup):
registerDynamicVariable("auto_memory",
    () => ID1(),  // Calls getAutoMemory()
    "MEMORY.md is read from disk each turn and can be edited by the model"
);

// READABLE (for understanding):
registerDynamicVariable("auto_memory",
    () => getAutoMemory(),
    "MEMORY.md is read from disk each turn and can be edited by the model"
);
```

**How it works**:
1. System prompt builder evaluates dynamic variables before each API call
2. `getAutoMemory()` (`ID1`) is called asynchronously
3. Result is injected into system prompt as `${auto_memory}` placeholder
4. Memory content is **always fresh** (read from disk each turn)

### 1.2 Attachment Types

Memory produces two attachment types that are normalized by the system reminder module:

#### relevant_memories Type

**Producer**: `buY` (produceRelevantMemories)
**Location**: chunks.147.mjs:552

```javascript
// ============================================
// relevant_memories Attachment Production
// Location: chunks.147.mjs:552-590
// ============================================

// READABLE (for understanding):
async function produceRelevantMemories(searchText, activeAgents, readFileState, toolContext) {
    // 5-second timeout
    const timeoutSignal = AbortSignal.timeout(5000);

    // Determine memory directories to search
    const memoryDirs = extractAgentReferences(searchText).length > 0
        ? getAgentMemoryDirs(searchText, activeAgents)
        : [getAutoMemoryDirectory()];

    // Search for relevant files
    const searchResults = await searchMemoryFiles(searchText, memoryDirs, timeoutSignal, toolContext);

    // Filter and limit to 5 results
    const uniqueResults = searchResults
        .filter(r => !readFileState.has(r.path))
        .slice(0, 5);

    // Read file contents with staleness metadata
    const memories = await readFilesWithTruncation(uniqueResults, timeoutSignal);

    return [{
        type: "relevant_memories",
        memories: memories  // [{ path, content, mtimeMs }, ...]
    }];
}
```

**Normalization Flow**:
```
produceRelevantMemories (buY)
        │
        ├── Return: { type: "relevant_memories", memories: [...] }
        │
        ▼
normalizeAttachmentForAPI (Ui8) - chunks.174.mjs:172-184
        │
        ├── For each memory:
        │   ├── buildStalenessWarning (Cz8)
        │   ├── formatRelativeTime (cJ7)
        │   └── createUserMessage (p1) with isMeta: true
        │
        ▼
wrapWithSystemReminderTags (b5)
        │
        ▼
Output: <system-reminder>Memory (saved today): ...</system-reminder>
```

#### nested_memory Type

**Producer**: `IuY` (produceNestedMemoryAttachment)
**Location**: chunks.147.mjs:541

```javascript
// ============================================
// nested_memory Attachment Production
// Location: chunks.147.mjs:541-549
// ============================================

// READABLE (for understanding):
async function produceNestedMemoryAttachment(sessionContext) {
    if (!sessionContext.nestedMemoryAttachmentTriggers?.size) {
        return [];
    }

    const attachments = [];
    for (const triggerPath of sessionContext.nestedMemoryAttachmentTriggers) {
        const memoryFiles = collectNestedMemoryFiles(triggerPath, sessionContext);
        attachments.push(...memoryFiles);
    }

    sessionContext.nestedMemoryAttachmentTriggers.clear();
    return attachments;
}
```

**Used by**: @include system for CLAUDE.md memory file references

### 1.3 Staleness Integration

Staleness detection is integrated into the normalization process:

```javascript
// ============================================
// Staleness Detection in Normalization
// Location: chunks.174.mjs:172-184
// ============================================

// ORIGINAL (for source lookup):
case "relevant_memories":
    return b5(A.memories.map((K) => {
        let Y = Cz8(K.mtimeMs),
            z = Y ? `${Y}\n\nMemory: ${K.path}:` : `Memory (saved ${cJ7(K.mtimeMs)}): ${K.path}:`;
        return p1({
            content: `${z}\n\n${K.content}`,
            isMeta: !0
        })
    }));

// READABLE (for understanding):
case "relevant_memories":
    return wrapWithSystemReminderTags(
        attachment.memories.map((memory) => {
            // Check staleness
            const stalenessWarning = buildStalenessWarning(memory.mtimeMs);

            // Format header based on freshness
            const header = stalenessWarning
                ? `${stalenessWarning}\n\nMemory: ${memory.path}:`
                : `Memory (saved ${formatRelativeTime(memory.mtimeMs)}): ${memory.path}:`;

            return createUserMessage({
                content: `${header}\n\n${memory.content}`,
                isMeta: true
            });
        })
    );
```

**Output Examples**:

Fresh memory (< 1 day):
```xml
<system-reminder>
Memory (saved today): /path/to/debugging.md:

# Debugging Notes
...
</system-reminder>
```

Stale memory (> 1 day):
```xml
<system-reminder>
This memory is 5 days old. Memories are point-in-time observations, not live state — claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact.

Memory: /path/to/patterns.md:

# Project Patterns
...
</system-reminder>
```

---

## 2. Integration with Background Agents (26_background_agents)

### 2.1 Feature Flag: tengu_passport_quail

When `tengu_passport_quail` is enabled, background agents operate in a restricted memory mode:

**Behavior**:
1. Main agent cannot write to memory files directly
2. Extraction subagent spawned after completion
3. Subagent has write permission via special prompt instruction

**Code Path**:
```javascript
// ============================================
// Background Agent Memory Mode Detection
// Location: chunks.84.mjs:382-411
// ============================================

// ORIGINAL (for source lookup):
async function ID1() {
    // ... team memory checks ...

    if (A) {  // isAutoMemoryEnabled()
        let K = uH();
        if (await CD1(K), DF6(K, { memory_type: "auto" }),
            w8("tengu_passport_quail", !1))  // Background agent mode?
            return xv9("auto memory", K).join("\n");  // Restricted prompt
        // ... normal mode ...
    }
}

// READABLE (for understanding):
async function getAutoMemory() {
    if (isAutoMemoryEnabled()) {
        const memoryDir = getAutoMemoryDirectory();
        await ensureMemoryDirExists(memoryDir);
        recordMemoryDirLoadMetrics(memoryDir, { memory_type: "auto" });

        // Background agent mode?
        if (getFeatureFlag("tengu_passport_quail", false)) {
            return buildBackgroundAgentMemoryPrompt("auto memory", memoryDir);
        }

        // Normal mode...
    }
}
```

### 2.2 Background Agent Memory Prompt

The `buildBackgroundAgentMemoryPrompt` (`xv9`) function generates a restricted prompt:

```javascript
// ============================================
// buildBackgroundAgentMemoryPrompt - Restricted memory prompt for background agents
// Location: chunks.84.mjs:329-331
// ============================================

// READABLE (for understanding):
function buildBackgroundAgentMemoryPrompt(displayName, memoryDir) {
    return [
        `# ${displayName}`,
        "",
        `You have a ${displayName} directory at \`${memoryDir}\`.`,
        "",
        "**You should not write to memory files yourself.**",
        "Instead, focus on the task at hand. A memory extraction subagent will analyze your conversation afterward and update memory files as needed."
    ];
}
```

**Key restriction**: Background agents are explicitly told not to write to memory files.

### 2.3 Extraction Subagent

After a background agent completes, an extraction subagent is spawned with elevated permissions:

**Extraction Prompts**:
- `DKq` - Standard extraction
- `XKq` - File-based extraction
- `PKq` - Team extraction
- `WKq` - Team file-based extraction

**Permission Override**:
```javascript
// ============================================
// Extraction Subagent Permission Handler
// Location: chunks.148.mjs:462-476
// ============================================

// READABLE (for understanding):
async function extractionPermissionHandler(toolName, input) {
    // Allow ListTool for memory directory
    if (toolName === "ListTool") return { behavior: "allow" };

    // Allow Write/Edit within memory directory
    if ((toolName === "WriteTool" || toolName === "EditTool") && "file_path" in input) {
        if (typeof input.file_path === "string" && isAutoMemoryPath(input.file_path)) {
            return { behavior: "allow" };
        }
    }

    // Deny all other tools
    return {
        behavior: "deny",
        message: "only ListTool, WriteTool, and EditTool within memory directory are allowed"
    };
}
```

**Cross-reference**: [26_memory_extraction_mechanism.md](./26_memory_extraction_mechanism.md)

---

## 2.5 Normalization Code Path (Detailed)

### 2.5.1 Attachment Producer Registration

Memory attachments are produced by attachment triggers registered in the session context:

```javascript
// ============================================
// Attachment Producer Registration
// Location: chunks.147.mjs:592-601 (getRelevantMemoriesTrigger)
// ============================================

// The trigger is registered as an attachment producer:
// - Called during attachment assembly phase
// - Produces relevant_memories attachment type
// - 5-second timeout for entire operation

// ORIGINAL (for source lookup):
function zqq(A, q) {
    if (!Z3() || !w8("tengu_moth_copse", !1)) return;
    let K = A.findLast((z) => z.type === "user" && !z.isMeta);
    if (!K) return;
    let Y = Fg(K);
    if (!Y || !/\s/.test(Y.trim())) return;
    return buY(Y, q.options.agentDefinitions.activeAgents, q.readFileState, uuY(A, K))
        .catch((z) => { return _6(z), [] })
}

// READABLE (for understanding):
function getRelevantMemoriesTrigger(messages, context) {
    // Prerequisite checks
    if (!isAutoMemoryEnabled()) return undefined;
    if (!getFeatureFlag("tengu_moth_copse", false)) return undefined;

    // Find last non-meta user message
    const lastUserMessage = messages.findLast(
        (msg) => msg.type === "user" && !msg.isMeta
    );
    if (!lastUserMessage) return undefined;

    // Extract text and validate (must have whitespace = multi-word)
    const textContent = extractTextContent(lastUserMessage);
    if (!textContent || !/\s/.test(textContent.trim())) return undefined;

    // Produce relevant memories with error handling
    return produceRelevantMemories(
        textContent,
        context.options.agentDefinitions.activeAgents,
        context.readFileState,
        getRecentToolContext(messages, lastUserMessage)
    ).catch((error) => {
        logError(error);
        return [];  // Graceful degradation
    });
}

// Mapping:
// zqq → getRelevantMemoriesTrigger
// Z3 → isAutoMemoryEnabled
// w8 → getFeatureFlag
// Fg → extractTextContent
// buY → produceRelevantMemories
// uuY → getRecentToolContext
// _6 → logError
```

### 2.5.2 Normalization Flow (chunks.174.mjs)

The `normalizeAttachmentForAPI` (`Ui8`) function handles memory attachment normalization:

```javascript
// ============================================
// normalizeAttachmentForAPI - Memory cases
// Location: chunks.174.mjs:3-469
// ============================================

// ORIGINAL (for source lookup) - relevant_memories case:
case "relevant_memories":
    return b5(A.memories.map((K) => {
        let Y = Cz8(K.mtimeMs),
            z = Y ? `${Y}\n\nMemory: ${K.path}:` : `Memory (saved ${cJ7(K.mtimeMs)}): ${K.path}:`;
        return p1({
            content: `${z}\n\n${K.content}`,
            isMeta: !0
        })
    }));

// ORIGINAL (for source lookup) - nested_memory case:
case "nested_memory":
    return b5([p1({
        content: `Memory: ${A.path}:\n\n${A.content}`,
        isMeta: !0
    })]);

// READABLE (for understanding):
case "relevant_memories":
    return wrapWithSystemReminderTags(
        attachment.memories.map((memory) => {
            // Step 1: Check staleness (> 1 day old)
            const stalenessWarning = buildStalenessWarning(memory.mtimeMs);

            // Step 2: Format header with or without warning
            const header = stalenessWarning
                ? `${stalenessWarning}\n\nMemory: ${memory.path}:`
                : `Memory (saved ${formatRelativeTime(memory.mtimeMs)}): ${memory.path}:`;

            // Step 3: Create meta message
            return createUserMessage({
                content: `${header}\n\n${memory.content}`,
                isMeta: true  // Hidden from user UI
            });
        })
    );

case "nested_memory":
    return wrapWithSystemReminderTags([
        createUserMessage({
            content: `Memory: ${attachment.path}:\n\n${attachment.content}`,
            isMeta: true
        })
    ]);

// Mapping:
// b5 → wrapWithSystemReminderTags
// Cz8 → buildStalenessWarning
// cJ7 → formatRelativeTime
// p1 → createUserMessage
// A → attachment
// K → memory
```

### 2.5.3 XML Wrapping (b5)

```javascript
// ============================================
// wrapWithSystemReminderTags - XML wrapper
// Location: chunks.173.mjs:2496-2523
// ============================================

// READABLE (for understanding):
function wrapWithSystemReminderTags(messages) {
    if (!messages || messages.length === 0) return [];

    return messages.map((message) => {
        if (message.content && typeof message.content === "string") {
            return {
                ...message,
                content: `<system-reminder>\n${message.content}\n</system-reminder>`
            };
        }
        return message;
    });
}
```

### 2.5.4 createUserMessage Helper (p1)

**Location**: chunks.173.mjs:1378-1412

```javascript
// ============================================
// createUserMessage - Create user-role message with metadata
// Location: chunks.173.mjs:1378-1412
// ============================================

// ORIGINAL (for source lookup):
function p1({
    content: A,
    isMeta: q = !1,
    ...K
}) {
    return {
        role: "user",
        content: A,
        isMeta: q,
        ...K
    }
}

// READABLE (for understanding):
function createUserMessage({
    content,
    isMeta = false,
    ...otherFields
}) {
    return {
        role: "user",
        content: content,
        isMeta: isMeta,  // Hidden from user UI when true
        ...otherFields
    };
}

// Mapping: p1 → createUserMessage
```

**Key field: isMeta**:
- When `true`: Message is hidden from user in chat UI
- When `true`: Message has special retention rules during compaction
- Used for all system reminder messages

### 2.5.5 Complete End-to-End Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│            COMPLETE MEMORY → SYSTEM REMINDER FLOW                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. User sends message                                              │
│     │                                                               │
│     ▼                                                               │
│  2. Attachment assembly phase                                       │
│     │                                                               │
│     ├── getRelevantMemoriesTrigger (zqq)                           │
│     │   ├── Check: isAutoMemoryEnabled() (Z3)                      │
│     │   ├── Check: tengu_moth_copse feature flag                   │
│     │   ├── Extract last user message text                         │
│     │   └── Call produceRelevantMemories (buY)                     │
│     │                                                               │
│     ├── produceRelevantMemories (buY)                              │
│     │   ├── 5-second timeout (AbortSignal.timeout(5000))           │
│     │   ├── searchMemoryFiles (a4q) - Semantic search              │
│     │   ├── readFileWithLimit (h36) - 200 line truncation          │
│     │   └── Return: { type: "relevant_memories", memories: [...] } │
│     │                                                               │
│     ▼                                                               │
│  3. Attachment normalization                                        │
│     │                                                               │
│     ├── normalizeAttachmentForAPI (Ui8)                            │
│     │   ├── Switch on attachment.type                              │
│     │   └── case "relevant_memories":                              │
│     │       ├── For each memory:                                   │
│     │       │   ├── buildStalenessWarning (Cz8) - Check age        │
│     │       │   ├── formatRelativeTime (cJ7) - "today"/"N days ago"│
│     │       │   └── createUserMessage (p1) - isMeta: true          │
│     │       └── wrapWithSystemReminderTags (b5) - XML wrapper      │
│     │                                                               │
│     ▼                                                               │
│  4. API message preparation                                         │
│     │                                                               │
│     └── [{                                                          │
│           role: "user",                                             │
│           content: "<system-reminder>\nMemory (saved today):...\n</system-reminder>",
│           isMeta: true                                              │
│         }]                                                          │
│                                                                     │
│  5. Sent to LLM API                                                 │
│     │                                                               │
│     └── LLM receives memory context as system reminder              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Timing Budget**:
| Phase | Timeout | Notes |
|-------|---------|-------|
| produceRelevantMemories | 5 seconds | AbortSignal.timeout(5000) |
| searchMemoryFiles | Inherited | Part of produceRelevantMemories |
| LLM selection (selectMemoriesWithLLM) | ~1-2s | Fast model, 256 tokens |
| File reading | ~500ms | Parallel reads, max 5 files |
| Normalization | <10ms | Synchronous in-memory operations |

---

## 3. Integration with Task System (13_task_system)

### 3.1 Memory vs Task Decision Guidance

The memory system includes prompt guidance for choosing between memory and tasks:

**Prompt Content** (included in memory prompts):
```markdown
When to use or update a plan instead of memory:
 - If you are about to start a non-trivial implementation task,
   use a Plan rather than saving to memory.

When to use or update tasks instead of memory:
 - When you need to break work into discrete steps or track progress,
   use tasks instead of saving to memory.
```

### 3.2 Decision Matrix

| Scenario | Use Memory | Use Tasks |
|----------|------------|-----------|
| Cross-session knowledge | ✓ | |
| User preferences | ✓ | |
| Project patterns | ✓ | |
| Architectural decisions | ✓ | |
| Session-specific tracking | | ✓ |
| Step-by-step progress | | ✓ |
| Temporary state | | ✓ |
| Work breakdown | | ✓ |

### 3.3 Complementary Usage

Memory and tasks work together:

1. **Memory stores patterns** → Agent uses patterns to create better task lists
2. **Tasks track current work** → Completed tasks may generate new memories
3. **Memory provides context** → Task descriptions can reference memory content

**Cross-reference**: [../13_task_system/](../13_task_system/)

---

## 4. Integration with MCP Protocol (06_mcp)

### 4.1 Remote Memory Directory

MCP enables remote memory synchronization via environment variable:

**Environment Variable**: `CLAUDE_CODE_REMOTE_MEMORY_DIR`

**Implementation**:
```javascript
// ============================================
// getHomeDirectory - Remote memory support
// Location: chunks.50.mjs:2411-2414
// ============================================

// ORIGINAL (for source lookup):
function Ma() {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    return c8()
}

// READABLE (for understanding):
function getHomeDirectory() {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    }
    return getLocalHomeDirectory();  // ~/.claude/
}
```

### 4.2 Use Cases

| Use Case | Configuration | Benefit |
|----------|---------------|---------|
| Shared team memory | NFS mount at `CLAUDE_CODE_REMOTE_MEMORY_DIR` | All team members share same memory |
| SSH session persistence | SSHFS mount | Memory persists across SSH sessions |
| Cloud agent sync | Network storage | Multiple cloud agents share knowledge |
| CI/CD knowledge | Shared volume | Build agents accumulate insights |

### 4.3 Path Resolution

```
Remote Memory Path Resolution:

CLAUDE_CODE_REMOTE_MEMORY_DIR=/shared/claude-memory
        │
        ▼
getHomeDirectory() → /shared/claude-memory
        │
        ▼
getAutoMemoryDirectory() → /shared/claude-memory/projects/{hash}/memory/
```

**Cross-reference**: [remote_memory_sync.md](./remote_memory_sync.md)

---

## 5. Integration with Plan Mode (12_plan_mode)

### 5.1 Memory as Context

Memory content is loaded before plan creation:

```
Turn Start
    │
    ▼
System Prompt Build
    │
    ├── Load dynamic variables
    │   └── getAutoMemory() → Memory content
    │
    ▼
Agent receives memory context
    │
    ▼
Agent creates plan (if needed)
    │
    └── Can reference past patterns from memory
```

### 5.2 Plan vs Memory Decision

The memory prompt includes guidance:

```markdown
When to use or update a plan instead of memory:
 - If you are about to start a non-trivial implementation task,
   use a Plan rather than saving to memory.
```

**Complementary usage**:
1. Memory stores **why** (architectural decisions)
2. Plan stores **how** (implementation steps)
3. After plan execution, new patterns saved to memory

**Cross-reference**: [../12_plan_mode/](../12_plan_mode/)

---

## 6. Integration with Permission System (18_sandbox)

### 6.1 Memory Path Whitelisting

Memory files are automatically whitelisted for write operations:

```javascript
// ============================================
// isAutoMemoryPath - Check if path is within memory directory
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
```

**Effect**: Agent can freely update MEMORY.md and topic files without permission prompts.

### 6.2 Team Memory Permission Bypass

Team memory has additional permission handling:

```javascript
// ============================================
// shouldBypassPermissionsForTeamMemory
// Location: chunks.84.mjs:211
// ============================================

// READABLE (for understanding):
function shouldBypassPermissionsForTeamMemory(filePath) {
    return isTeamMemoryEnabled() && isTeamMemoryPath(filePath);
}
```

**Cross-reference**: [15_write_edit_integration.md](./15_write_edit_integration.md)

---

## 7. Integration with Telemetry (17_telemetry)

### 7.1 Telemetry Events

Memory system tracks usage via telemetry:

| Event | Trigger | Data |
|-------|---------|------|
| `tengu_memdir_loaded` | Memory directory scanned | `file_count`, `subdir_count`, `memory_type` |
| `tengu_memdir_disabled` | Memory disabled | `disabled_by_env_var`, `disabled_by_setting` |
| `tengu_team_memdir_disabled` | Team memory disabled | `{}` |

### 7.2 Implementation

```javascript
// ============================================
// recordMemoryDirLoadMetrics - Telemetry recording
// Location: chunks.84.mjs:273-288
// ============================================

// ORIGINAL (for source lookup):
function DF6(A, q) {
    $1().readdir(A).then((Y) => {
        let z = 0, _ = 0;
        for (let w of Y)
            if (w.isFile()) z++;
            else if (w.isDirectory()) _++;
        d("tengu_memdir_loaded", { ...q, total_file_count: z, total_subdir_count: _ })
    }, () => { d("tengu_memdir_loaded", q) })
}

// READABLE (for understanding):
function recordMemoryDirLoadMetrics(memoryDir, metadata) {
    getFileSystem().readdir(memoryDir).then((entries) => {
        let fileCount = 0, subdirCount = 0;
        for (let entry of entries) {
            if (entry.isFile()) fileCount++;
            else if (entry.isDirectory()) subdirCount++;
        }
        recordTelemetry("tengu_memdir_loaded", {
            ...metadata,
            total_file_count: fileCount,
            total_subdir_count: subdirCount
        });
    }, () => {
        recordTelemetry("tengu_memdir_loaded", metadata);
    });
}
```

**Cross-reference**: [19_telemetry_monitoring.md](./19_telemetry_monitoring.md)

---

## 8. Integration with Compact System (07_compact)

### 8.1 Memory Preservation During Compaction

When conversation history is compacted, memory content is handled specially:

**Memory File Retention:**
- Memory files (`MEMORY.md`, topic files) are NOT affected by compaction
- They persist on disk independently of conversation history
- After compaction, memory is re-loaded fresh from disk

**Compaction Trigger vs Memory:**
```
Conversation History                    Memory Files
        │                                    │
        ▼                                    ▼
Token count exceeds threshold         Always on disk
        │                                    │
        ▼                                    │
Compact operation triggered            Not affected
        │                                    │
        ├── Remove old messages              │
        ├── Keep system reminders            │
        └── Preserve tool results            │
                                             │
        Next turn:                           │
        └── Memory re-loaded ◄───────────────┘
```

### 8.2 Memory as Compaction Survivor

Memory provides context continuity across compactions:

```markdown
Before compaction:
- Conversation: 100K tokens + Memory content

After compaction:
- Conversation: 20K tokens (summarized) + Memory content (re-loaded fresh)

Memory content survives compaction because:
1. Stored on disk, not in conversation history
2. Re-loaded on every turn via dynamic variable
3. Independent of conversation context window
```

**Key insight**: Memory is the "external brain" that survives compaction, ensuring critical patterns and user preferences persist even when conversation details are lost.

---

## 9. Detailed Telemetry Events

### 9.1 Memory Telemetry Schema

**Event: `tengu_memdir_loaded`**

```javascript
{
    memory_type: "auto" | "agent" | "team",
    content_length: number,      // File size in bytes
    line_count: number,          // Total lines (even if truncated)
    was_truncated: boolean,      // True if > 200 lines
    total_file_count: number,    // Files in memory directory
    total_subdir_count: number   // Subdirectories
}
```

**Event: `tengu_memdir_disabled`**

```javascript
{
    disabled_by_env_var: boolean,     // CLAUDE_CODE_DISABLE_AUTO_MEMORY set
    disabled_by_setting: boolean      // autoMemoryEnabled = false in settings
}
```

**Event: `tengu_team_memdir_disabled`**

```javascript
{}  // Empty payload - just tracks occurrence
```

**Event: `tengu_claude_md_permission_error`**

```javascript
{
    is_access_error: 1,
    has_home_dir: 0 | 1  // Whether path includes home directory
}
```

### 9.2 Telemetry Flow

```
getAutoMemory() called
        │
        ├── If disabled:
        │   └── d("tengu_memdir_disabled", { disabled_by_env_var, disabled_by_setting })
        │
        ├── If enabled:
        │   └── DF6(memoryDir, { memory_type, content_length, line_count, was_truncated })
        │       │
        │       └── getFileSystem().readdir(memoryDir)
        │               │
        │               ├── Success:
        │               │   └── d("tengu_memdir_loaded", { ...metrics, file_count, subdir_count })
        │               │
        │               └── Failure:
        │                   └── d("tengu_memdir_loaded", { ...metrics })
        │
        └── If team memory enabled + team disabled:
            └── d("tengu_team_memdir_disabled", {})
```

---

## 10. Integration Summary Matrix

### 10.1 Complete Integration Table

| Module | Integration Type | Functions | Data Flow |
|--------|-----------------|-----------|-----------|
| **System Reminder** | Dynamic Variable | `ID1`, `Ui8`, `b5` | Memory → Dynamic var → System prompt |
| **Background Agents** | Feature Flag | `xv9`, `bv9` | Flag → Restricted prompt → Extraction subagent |
| **Task System** | Prompt Guidance | Content only | Memory prompt includes task guidance |
| **Plan Mode** | Context Loading | `ID1` | Memory loaded before plan creation |
| **MCP** | Remote Directory | `Ma` | Env var → Directory path override |
| **Permissions** | Path Whitelist | `Da`, `JF6` | Path check → Allow write without prompt |
| **Telemetry** | Event Tracking | `DF6`, `d` | Metrics → Analytics |
| **Compact** | Preservation | None (architectural) | Memory on disk survives compaction |
| **TUI** | Settings UI | `toY`, `TA` | Modal → Settings → Memory toggle |

### 10.2 Cross-Module Function Reference

| Function | Primary Module | Used By |
|----------|---------------|---------|
| `getAutoMemory` (ID1) | Auto Memory | System Reminder (dynamic var) |
| `isAutoMemoryPath` (Da) | Auto Memory | Permissions (whitelist) |
| `produceRelevantMemories` (buY) | Auto Memory | Attachment system |
| `normalizeAttachmentForAPI` (Ui8) | System Reminder | Memory attachments |
| `wrapWithSystemReminderTags` (b5) | System Reminder | All memory reminders |
| `getHomeDirectory` (Ma) | Auto Memory | MCP (remote memory) |

---

## Summary

Auto Memory integrates with multiple Claude Code systems:

| Module | Integration Point | Key Function |
|--------|-------------------|--------------|
| System Reminder | Dynamic variable `auto_memory` | `ID1` (getAutoMemory) |
| System Reminder | Attachment normalization | `Ui8` (normalizeAttachmentForAPI) |
| Background Agents | `tengu_passport_quail` flag | `xv9` (buildBackgroundAgentMemoryPrompt) |
| Task System | Decision guidance | Prompt content |
| MCP | Remote memory directory | `Ma` (getHomeDirectory) |
| Plan Mode | Context loading | System prompt injection |
| Permissions | Path whitelisting | `Da` (isAutoMemoryPath) |
| Telemetry | Usage tracking | `DF6` (recordMemoryDirLoadMetrics) |
| Compact | Context preservation | Architectural (disk storage) |

**Key architectural insight**: Memory is deeply integrated into Claude Code's execution pipeline, from system prompt building to permission handling to telemetry tracking. This integration ensures memory is always fresh, always accessible, and always tracked. Memory serves as the "external brain" that survives conversation compaction, ensuring critical context persists across sessions.