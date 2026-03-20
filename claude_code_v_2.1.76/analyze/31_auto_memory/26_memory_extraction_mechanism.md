# Memory Extraction Mechanism Analysis

## Overview

Memory extraction is the process by which Claude Code automatically saves knowledge from conversations to persistent memory files. When the `tengu_passport_quail` feature flag is enabled (background agent mode), a dedicated extraction subagent analyzes recent messages and updates memory files on behalf of the main agent.

**Key insight**: The extraction subagent operates with elevated permissions—it can write to memory files even when the main agent is restricted, ensuring memories are captured without the main agent needing to manage the write operations.

**Version**: Claude Code v2.1.76

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `buildExtractionSubagentPrompt` (`sE1`) - Constructs the subagent role instruction
- `buildStandardExtractionPrompt` (`DKq`) - Standard memory extraction format
- `buildFileBasedExtractionPrompt` (`XKq`) - File-based format extraction
- `buildTeamExtractionPrompt` (`PKq`) - Team memory extraction
- `buildTeamFileBasedExtractionPrompt` (`WKq`) - Team + file-based extraction

---

## 1. Architecture Overview

### 1.1 Extraction Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MEMORY EXTRACTION ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Main Conversation                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ User Message → Agent Response → Tool Calls → ...             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              │ Conversation progresses              │
│                              ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Extraction Trigger Point                                      │  │
│  │ - End of conversation, or                                     │  │
│  │ - Periodic checkpoint, or                                     │  │
│  │ - Background agent completion                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Extraction Prompt Selection (chunks.148.mjs:530-532)         │  │
│  │                                                               │  │
│  │   isTeamMemoryEnabled? ──┬── YES ──► PKq or WKq              │  │
│  │                          │                                      │
│  │                          └── NO  ──► DKq or XKq              │  │
│  │                                                               │  │
│  │   tengu_swinburne_dune?  ──┬── YES ──► file-based (XKq/WKq) │  │
│  │                            │                                    │
│  │                            └── NO  ──► standard (DKq/PKq)    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Extraction Subagent (sE1 prompt)                              │  │
│  │ - Receives last ~N messages                                   │  │
│  │ - Has permission to write memory files                        │  │
│  │ - Analyzes conversation for patterns, preferences, insights   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Memory File Updates                                           │  │
│  │ - MEMORY.md index updated                                     │  │
│  │ - Topic files created/updated                                 │  │
│  │ - Staleness timestamps set                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Extraction Subagent Prompt

### 2.1 Role Instruction

The extraction subagent receives a special instruction that overrides the main agent's memory restrictions:

// ============================================
// buildExtractionSubagentPrompt - Constructs the subagent role instruction
// Location: chunks.148.mjs:393-395
// ============================================

// ORIGINAL (for source lookup):
function sE1(A) {
    return `You are now acting as the memory extraction subagent. Any prior instruction to not write memory files applies to the main conversation — in this role, writing is your job. Analyze the most recent ~${A} messages above and use them to update your persistent memory systems.`
}

// READABLE (for understanding):
function buildExtractionSubagentPrompt(messageCount) {
    return `You are now acting as the memory extraction subagent. Any prior instruction to not write memory files applies to the main conversation — in this role, writing is your job. Analyze the most recent ~${messageCount} messages above and use them to update your persistent memory systems.`;
}

// Mapping: sE1 → buildExtractionSubagentPrompt, A → messageCount

**Critical instruction**: "Any prior instruction to not write memory files applies to the main conversation — in this role, writing is your job."

**Why this matters**:
- Background agents are told "You should not write to memory files yourself"
- The extraction subagent explicitly receives permission to write
- This enables safe memory capture without write conflicts

---

## 3. Extraction Prompt Variants

### 3.1 Standard Extraction Prompt (DKq)

Used when:
- Single memory mode (no team memory)
- Standard format (not file-based)

// ============================================
// buildStandardExtractionPrompt - Standard memory extraction format
// Location: chunks.148.mjs:397-400
// ============================================

// ORIGINAL (for source lookup):
function DKq(A) {
    return [sE1(A), "", "## You MUST save memories when:", "- You encounter information that might be useful in future conversations...", "- When the user describes what they are working on...", "- When in doubt about whether something is worth saving, save it...", "", "## What to save in memories:", "- Reusable patterns and conventions within the project...", "- Project or goal information...", "- Architectural decisions, important file paths...", "- User preferences for workflow, tools, or communication style...", "- Solutions to problems that are likely to recur...", "- Any information the user explicitly has asked you to remember...", "", "## What not to save in memories:", "- Ephemeral task details: information that is only relevant to the current task...", "- Information that duplicates or contradicts existing CLAUDE.md instructions...", "", "## Explicit user requests:", '- If a user explicitly asks you to remember a piece of information, you MUST save it immediately...', "- If a user explicitly asks you to forget or stop remembering information...", "", "## How to save memories:", "- Organize memory semantically by topic, not chronologically", "- Use the Write and Edit tools to update your memory files", "- `MEMORY.md` is always loaded into your system prompt — lines after 200 will be truncated...", "- Create separate topic files (e.g., `debugging.md`, `patterns.md`)...", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories..."].join("\n")
}

// READABLE (for understanding):
function buildStandardExtractionPrompt(messageCount) {
    return [
        buildExtractionSubagentPrompt(messageCount),
        "",
        "## You MUST save memories when:",
        "- You encounter information that might be useful in future conversations...",
        "- When the user describes what they are working on...",
        "- When in doubt about whether something is worth saving, save it...",
        "",
        "## What to save in memories:",
        "- Reusable patterns and conventions within the project",
        "- Project or goal information that might help understand future work",
        "- Architectural decisions, important file paths, and project structure",
        "- User preferences for workflow, tools, or communication style",
        "- Solutions to problems that are likely to recur",
        "- Any information the user explicitly has asked you to remember",
        "",
        "## What not to save in memories:",
        "- Ephemeral task details (current task, in-progress work)",
        "- Information that duplicates or contradicts existing CLAUDE.md",
        "",
        "## Explicit user requests:",
        '- If a user explicitly asks you to remember, you MUST save it immediately',
        "- If a user asks you to forget, find and remove the relevant entry",
        "",
        "## How to save memories:",
        "- Organize memory semantically by topic, not chronologically",
        "- Use the Write and Edit tools to update your memory files",
        "- MEMORY.md has a 200-line limit, keep it concise",
        "- Create separate topic files for detailed notes",
        "- Update or remove memories that turn out to be wrong",
        "- Do not write duplicate memories"
    ].join("\n");
}

// Mapping: DKq → buildStandardExtractionPrompt, sE1 → buildExtractionSubagentPrompt

---

### 3.2 File-Based Extraction Prompt (XKq)

Used when:
- Single memory mode (no team memory)
- File-based format (`tengu_swinburne_dune` flag enabled)

// ============================================
// buildFileBasedExtractionPrompt - File-based format extraction
// Location: chunks.148.mjs:402-405
// ============================================

// ORIGINAL (for source lookup):
function XKq(A) {
    return [sE1(A), "", "If the user explicitly asks you to remember something, save it immediately...", "", ...RD1, ..._36, "", "## How to save memories", "", "Saving a memory is a two-step process:", "", "**Step 1** — write the memory to its own file (e.g., `user_role.md`, `feedback_testing.md`) using this frontmatter format:", "", ...w36, "", "**Step 2** — add a pointer to that file in `MEMORY.md`...", "", "- `MEMORY.md` is always loaded into your system prompt — lines after 200 will be truncated...", "- Organize memory semantically by topic, not chronologically...", "- Update or remove memories that turn out to be wrong or outdated...", "- Do not write duplicate memories..."].join("\n")
}

// READABLE (for understanding):
function buildFileBasedExtractionPrompt(messageCount) {
    return [
        buildExtractionSubagentPrompt(messageCount),
        "",
        "If the user explicitly asks you to remember something, save it immediately...",
        "",
        ...SCOPE_TYPE_DEFINITIONS,  // RD1 - scope types
        ...MEMORY_TYPE_DEFINITIONS,  // _36 - memory types
        "",
        "## How to save memories",
        "",
        "Saving a memory is a two-step process:",
        "",
        "**Step 1** — write the memory to its own file using frontmatter format:",
        // w36 - frontmatter template
        "",
        "**Step 2** — add a pointer to that file in MEMORY.md",
        "",
        "- MEMORY.md is always loaded (200-line limit)",
        "- Organize memory semantically by topic",
        "- Update or remove outdated memories",
        "- Do not write duplicate memories"
    ].join("\n");
}

// Mapping: XKq → buildFileBasedExtractionPrompt, RD1 → SCOPE_TYPE_DEFINITIONS, _36 → MEMORY_TYPE_DEFINITIONS, w36 → FRONTMATTER_TEMPLATE

**Key difference from standard**: Requires frontmatter format with name, description, type fields.

---

### 3.3 Team Memory Extraction Prompt (PKq)

Used when:
- Team memory enabled (`tengu_herring_clock` flag)
- Standard format (not file-based)

// ============================================
// buildTeamExtractionPrompt - Team memory extraction format
// Location: chunks.148.mjs:407-410
// ============================================

// ORIGINAL (for source lookup):
function PKq(A) {
    return [sE1(A), "", "## You MUST save memories when:", "...", "", "## What to save in user memory (private):", "- User preferences for workflow, tools, or communication style...", "- Information that might help you understand the user's personal projects...", "- Solutions to problems you have encountered with the current user...", "- Any information the user has explicitly asked you to remember.", "", "## What to save in team memory (shared):", "- Reusable patterns and conventions within the project...", "- Project or goal information that might help you understand the intent of future work...", "- Architectural decisions, important file paths, and project structure.", "- Solutions to problems that are likely to recur across users or conversations.", "- Insights that may help you with future debugging conversations...", "- Any information the user explicitly has asked you to remember for the team...", "", "## What not to save:", "- You MUST avoid saving sensitive data within shared team memories...", "- Ephemeral task details...", "- User-specific preferences in team memory...", "", "## Choosing between user memory and team memory:", '- If the user explicitly says "remember" or "save", use user memory.', '- If the user explicitly says "remember for the team", use team memory.', "- If the information is about personal preferences, use user memory.", "- If the information is about project conventions, use team memory.", "- If unclear, ask which memory to use.", "", "## Explicit user requests:", "...", "", "## How to save memories:", "..."].join("\n")
}

// READABLE (for understanding):
function buildTeamExtractionPrompt(messageCount) {
    return [
        buildExtractionSubagentPrompt(messageCount),
        "",
        "## You MUST save memories when:",
        "...",
        "",
        "## What to save in user memory (private):",
        "- User preferences for workflow, tools, or communication style",
        "- Information that might help understand the user's personal projects",
        "- Solutions to problems encountered with the current user",
        "- Any information the user has explicitly asked you to remember",
        "",
        "## What to save in team memory (shared):",
        "- Reusable patterns and conventions within the project",
        "- Project or goal information for future work understanding",
        "- Architectural decisions, important file paths, project structure",
        "- Solutions to problems likely to recur across users/conversations",
        "- Insights for future debugging with all project contributors",
        "- Any information explicitly requested for team memory",
        "",
        "## What not to save:",
        "- You MUST avoid saving sensitive data in shared team memories",
        "- Ephemeral task details",
        "- User-specific preferences in team memory",
        "",
        "## Choosing between user memory and team memory:",
        '- If user says "remember" or "save", use user memory',
        '- If user says "remember for the team", use team memory',
        "- Personal preferences → user memory",
        "- Project conventions, architecture → team memory",
        "- If unclear, ask which memory to use",
        "",
        "## How to save memories:",
        "..."
    ].join("\n");
}

// Mapping: PKq → buildTeamExtractionPrompt

**Key difference**: Includes guidance for choosing between user memory (private) and team memory (shared).

---

### 3.4 Team File-Based Extraction Prompt (WKq)

Used when:
- Team memory enabled
- File-based format

// ============================================
// buildTeamFileBasedExtractionPrompt - Team + file-based extraction
// Location: chunks.148.mjs:412-415
// ============================================

// ORIGINAL (for source lookup):
function WKq(A) {
    return [sE1(A), "", "If the user explicitly asks you to remember something, save it immediately...", "", ...LD1, ..._36, "- You MUST avoid saving sensitive data within shared team memories...", "", "## How to save memories", "", "Saving a memory is a two-step process:", "", "**Step 1** — write the memory to its own file in the chosen directory (private or team, per the type's scope guidance) using this frontmatter format:", "", ...w36, "", "**Step 2** — add a pointer to that file in the same directory's `MEMORY.md`...", "", "- Both `MEMORY.md` indexes are loaded into your system prompt — lines after 200 will be truncated...", "- Organize memory semantically by topic, not chronologically...", "- Update or remove memories that turn out to be wrong or outdated...", "- Do not write duplicate memories..."].join("\n")
}

// READABLE (for understanding):
function buildTeamFileBasedExtractionPrompt(messageCount) {
    return [
        buildExtractionSubagentPrompt(messageCount),
        "",
        "If the user explicitly asks you to remember something, save it immediately...",
        "",
        ...TEAM_SCOPE_DEFINITIONS,  // LD1
        ...MEMORY_TYPE_DEFINITIONS,  // _36
        "- You MUST avoid saving sensitive data within shared team memories",
        "",
        "## How to save memories",
        "",
        "Saving a memory is a two-step process:",
        "",
        "**Step 1** — write to file in chosen directory (private or team)",
        // w36 - frontmatter template
        "",
        "**Step 2** — add pointer to same directory's MEMORY.md",
        "",
        "- Both MEMORY.md indexes are loaded (200-line limit)",
        "- Organize semantically by topic",
        "- Update or remove outdated memories",
        "- Do not write duplicate memories"
    ].join("\n");
}

// Mapping: WKq → buildTeamFileBasedExtractionPrompt, LD1 → TEAM_SCOPE_DEFINITIONS

**Key difference**: Combines team memory scope guidance with file-based frontmatter format.

---

## 4. Prompt Selection Algorithm

### 4.1 Decision Matrix

The extraction prompt is selected based on two feature flags:

```javascript
// chunks.148.mjs:530-532
const hasTeamMemory = isTeamMemoryEnabled();  // SD1 / F14.isTeamMemoryEnabled()
const useFileBased = getFeatureFlag("tengu_swinburne_dune", false);  // w8()

const extractionPrompt = hasTeamMemory
    ? (useFileBased
        ? buildTeamFileBasedExtractionPrompt(messageCount)  // WKq
        : buildTeamExtractionPrompt(messageCount))          // PKq
    : (useFileBased
        ? buildFileBasedExtractionPrompt(messageCount)      // XKq
        : buildStandardExtractionPrompt(messageCount));     // DKq
```

### 4.2 Decision Tree

```
                    Start
                      │
                      ▼
        ┌─────────────────────────────┐
        │ isTeamMemoryEnabled()?      │
        └─────────────┬───────────────┘
                      │
         ┌────────────┴────────────┐
         │ YES                     │ NO
         ▼                         ▼
┌─────────────────────┐   ┌─────────────────────┐
│ tengu_swinburne_dune?│   │ tengu_swinburne_dune?│
└──────────┬──────────┘   └──────────┬──────────┘
           │                         │
    ┌──────┴──────┐           ┌──────┴──────┐
    │YES          │NO         │YES          │NO
    ▼             ▼           ▼             ▼
┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐
│ WKq   │   │ PKq   │   │ XKq   │   │ DKq   │
│Team + │   │Team   │   │File-  │   │Standard│
│File   │   │Standard│   │Based  │   │Format │
└───────┘   └───────┘   └───────┘   └───────┘
```

---

## 5. Integration with Background Agents

### 5.1 The `tengu_passport_quail` Flag

When this flag is set:
1. Main agent receives `buildBackgroundAgentMemoryPrompt` (`xv9`)
2. Main agent is told: "You should not write to memory files yourself"
3. Extraction subagent is spawned after main agent completes
4. Extraction subagent uses one of the four extraction prompts (DKq, XKq, PKq, WKq)

### 5.2 Write Permission Flow

```
Background Agent Mode (tengu_passport_quail = true)
                    │
                    ▼
    ┌───────────────────────────────────┐
    │ Main Agent Runs                   │
    │ - Restricted from writing memory  │
    │ - Focuses on task at hand         │
    │ - Acknowledges memory requests    │
    └───────────────┬───────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────┐
    │ Main Agent Completes              │
    │ - Extraction subagent spawned     │
    │ - Receives last N messages        │
    └───────────────┬───────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────┐
    │ Extraction Subagent Runs          │
    │ - sE1 prompt grants write access  │
    │ - Analyzes conversation           │
    │ - Writes to memory files          │
    └───────────────────────────────────┘
```

---

## 6. Algorithm: What to Extract

### 6.1 Extraction Priority

The extraction prompts instruct the subagent to prioritize:

**MUST save (highest priority)**:
1. Explicit user requests ("remember X")
2. Patterns confirmed across multiple interactions
3. User preferences (workflow, tools, communication style)
4. Architectural decisions and important file paths
5. Solutions to recurring problems

**Consider saving (medium priority)**:
1. Project goals and context
2. Debugging insights
3. Non-obvious conventions

**Do NOT save (skip)**:
1. Session-specific state
2. Information that duplicates CLAUDE.md
3. Sensitive data (especially in team memory)
4. Speculative conclusions from single file reads

### 6.2 Deduplication Strategy

The prompts instruct:
> "Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."

**Implementation approach**:
1. Read existing MEMORY.md and topic files
2. Search for similar content or overlapping topics
3. If found: Update existing entry with Edit tool
4. If not found: Create new file with Write tool

---

## 7. Error Handling

### 7.1 Permission Errors

The extraction subagent has special permission handling:

```javascript
// chunks.148.mjs:462-476
// Permission bypass for extraction subagent
async function extractionPermissionHandler(toolName, input) {
    // Allow ListTool for memory directory
    if (toolName === s7) return { behavior: "allow" };

    // Allow Write/Edit within memory directory
    if ((toolName === R4 || toolName === _K) && "file_path" in input) {
        if (typeof input.file_path === "string" && isAutoMemoryPath(input.file_path)) {
            return { behavior: "allow" };
        }
    }

    // Deny all other tools
    return {
        behavior: "deny",
        message: `only ${s7}, ${R4}, and ${_K} within memory directory are allowed`
    };
}
```

// Mapping: s7 → ListTool, R4 → WriteTool, _K → EditTool

### 7.2 Extraction Failures

If extraction fails:
- Main conversation is not affected
- No memory updates occur
- Next extraction will attempt again
- No user notification (silent failure)

---

## 8. Telemetry Events

### 8.1 Memory Extraction Tracking

The extraction process logs telemetry for analytics:

| Event | Trigger | Data |
|-------|---------|------|
| `tengu_memdir_loaded` | Memory directory scanned | file_count, subdir_count, memory_type |
| `tengu_auto_memory_toggled` | User toggles setting | enabled: boolean |

---

## 9. Summary

The memory extraction mechanism provides:

1. **Four prompt variants** - Standard, File-based, Team, Team+File-based
2. **Permission elevation** - Extraction subagent can write when main agent cannot
3. **Feature flag control** - `tengu_swinburne_dune` and `tengu_herring_clock`
4. **Background agent integration** - `tengu_passport_quail` enables extraction mode
5. **Two-step saving** - Frontmatter file + MEMORY.md pointer (file-based formats)
6. **Scope separation** - User memory vs team memory with clear guidance
7. **Deduplication** - Update existing memories rather than create duplicates

**Key architectural insight**: By separating the extraction concern from the main agent, the system enables safe parallel agent execution while ensuring knowledge accumulation across sessions. The extraction subagent acts as a privileged writer that can update memory files even when the main agent is restricted.

---

## Related Documentation

- [25_background_agent_memory.md](./25_background_agent_memory.md) - Background agent memory mode
- [24_team_memory_system.md](./24_team_memory_system.md) - Team memory architecture
- [18_system_reminder_generation.md](./18_system_reminder_generation.md) - Dynamic variable registration
- [15_write_edit_integration.md](./15_write_edit_integration.md) - Permission flow