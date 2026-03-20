# Memory Extraction Prompts Analysis

## Overview

Memory extraction prompts are used by the memory extraction subagent to guide how memories should be saved. These prompts are used when the `tengu_passport_quail` feature flag is enabled (background agent memory mode).

**Version**: Claude Code v2.1.76

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions:
- `sE1` - buildExtractionSubagentPrompt @ chunks.148.mjs:393
- `DKq` - buildStandardExtractionPrompt @ chunks.148.mjs:397
- `XKq` - buildFileBasedExtractionPrompt @ chunks.148.mjs:402
- `PKq` - buildTeamExtractionPrompt @ chunks.148.mjs:407
- `WKq` - buildTeamFileBasedExtractionPrompt @ chunks.148.mjs:412

Key constants:
- `RD1` - SCOPE_TYPE_DEFINITIONS @ chunks.84.mjs:104
- `LD1` - TEAM_SCOPE_DEFINITIONS @ chunks.84.mjs:104
- `_36` - MEMORY_DONT_SAVE_SECTION @ chunks.84.mjs:104
- `w36` - FRONTMATTER_TEMPLATE @ chunks.84.mjs:104

---

## 1. Prompt Selection Matrix

### 1.1 Decision Tree

```
                isTeamMemoryEnabled()?
                        │
            ┌───────────┴───────────┐
            │ YES                    │ NO
            ▼                        ▼
    tengu_swinburne_dune?     tengu_swinburne_dune?
            │                         │
     ┌──────┴──────┐           ┌──────┴──────┐
     │YES          │NO         │YES          │NO
     ▼             ▼           ▼             ▼
  ┌──────┐     ┌──────┐    ┌──────┐     ┌──────┐
  │ WKq  │     │ PKq  │    │ XKq  │     │ DKq  │
  │Team+ │     │Team  │    │File- │     │Standard
  │File  │     │Standard   │Based │     │Format
  └──────┘     └──────┘    └──────┘     └──────┘
```

### 1.2 Prompt Characteristics

| Prompt | Team Support | File-Based | Frontmatter | Key Difference |
|--------|-------------|------------|-------------|----------------|
| `DKq` | No | No | No | Standard simple format |
| `XKq` | No | Yes | Yes (`w36`) | Two-step save process |
| `PKq` | Yes | No | No | User vs team guidance |
| `WKq` | Yes | Yes | Yes (`w36`) | Combined: team + frontmatter |

---

## 2. Base Subagent Prompt (sE1)

### 2.1 Implementation

// ============================================
// sE1 - Build memory extraction subagent base prompt
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

**Key insight**: This prompt overrides any prior "don't write memory" instructions, specifically enabling the subagent to write to memory files.

---

## 3. Standard Extraction Prompt (DKq)

### 3.1 Full Implementation

// ============================================
// DKq - Standard extraction prompt for single memory mode
// Location: chunks.148.mjs:397-400
// ============================================

// ORIGINAL (for source lookup):
function DKq(A) {
    return [sE1(A), "", "## You MUST save memories when:", "- You encounter information that might be useful in future conversations. Whenever you find new information, think to yourself whether it would be helpful to have if you started a new conversation tomorrow. If the answer is yes, save it immediately before continuing work on the task.", `- When the user describes what they are working on, their goals, or the broader context of their project (e.g., "I'm building...", "we're migrating to...", "the goal is..."), save this so you can reference it in future sessions.`, "- When in doubt about whether something is worth saving, save it — it is better to prune and curate memories later than it is to fail to remember and have users correct you later.", "", "## What to save in memories:", "- Reusable patterns and conventions within the project that are not otherwise documented in the CLAUDE.md files", "- Project or goal information that might help you understand the intent of future work", "- Architectural decisions, important file paths, and project structure", "- User preferences for workflow, tools, or communication style. Especially if the user corrects or guides you during the conversation.", "- Solutions to problems that are likely to recur or insights that may help you with future debugging.", "- Any information the user explicitly has asked you to remember for later.", "", "## What not to save in memories:", "- Ephemeral task details: information that is only relevant to the current task at hand like in-progress work or temporary state", "- Information that duplicates or contradicts existing CLAUDE.md instructions.", "", "## Explicit user requests:", '- If a user explicitly asks you to remember a piece of information, you MUST save it immediately. Messages like this will often begin with "never...", "always...", "next time...", "remember..." etc.', "- If a user explicitly asks you to forget or stop remembering information, you MUST find and remove the relevant entry from the appropriate memory.", "", "## How to save memories:", "- Organize memory semantically by topic, not chronologically", "- Use the Write and Edit tools to update your memory files", "- `MEMORY.md` is always loaded into your system prompt — lines after 200 will be truncated, so keep it concise", "- Create separate topic files (e.g., `debugging.md`, `patterns.md`) for detailed notes and link to them from MEMORY.md", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."].join("\n")
}

// Mapping: DKq → buildStandardExtractionPrompt, A → messageCount, sE1 → buildExtractionSubagentPrompt

### 3.2 Prompt Structure Analysis

**Section breakdown:**

| Section | Purpose | Key Points |
|---------|---------|------------|
| **You MUST save** | When to save | User goals, project context, doubt → save |
| **What to save** | Content categories | Patterns, goals, architecture, preferences, solutions |
| **What not to save** | Anti-patterns | Ephemeral details, duplicates |
| **Explicit requests** | User-triggered saves | "remember", "always", "never" patterns |
| **How to save** | Process guidance | Semantic organization, 200-line limit, topic files |

---

## 4. File-Based Extraction Prompt (XKq)

### 4.1 Full Implementation

// ============================================
// XKq - File-based extraction prompt with frontmatter
// Location: chunks.148.mjs:402-405
// ============================================

// ORIGINAL (for source lookup):
function XKq(A) {
    return [sE1(A), "", "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.", "", ...RD1, ..._36, "", "## How to save memories", "", "Saving a memory is a two-step process:", "", "**Step 1** — write the memory to its own file (e.g., `user_role.md`, `feedback_testing.md`) using this frontmatter format:", "", ...w36, "", "**Step 2** — add a pointer to that file in `MEMORY.md`. `MEMORY.md` is an index, not a memory — it should contain only links to memory files with brief descriptions. It has no frontmatter. Never write memory content directly into `MEMORY.md`.", "", "- `MEMORY.md` is always loaded into your system prompt — lines after 200 will be truncated, so keep the index concise", "- Organize memory semantically by topic, not chronologically", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."].join("\n")
}

// READABLE (for understanding):
function buildFileBasedExtractionPrompt(messageCount) {
    return [
        buildExtractionSubagentPrompt(messageCount),
        "",
        "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.",
        "",
        ...SCOPE_TYPE_DEFINITIONS,  // RD1 - memory types for single-scope
        ...MEMORY_DONT_SAVE_SECTION, // _36 - what NOT to save
        "",
        "## How to save memories",
        "",
        "Saving a memory is a two-step process:",
        "",
        "**Step 1** — write the memory to its own file (e.g., `user_role.md`, `feedback_testing.md`) using this frontmatter format:",
        "",
        ...FRONTMATTER_TEMPLATE,  // w36
        "",
        "**Step 2** — add a pointer to that file in `MEMORY.md`. `MEMORY.md` is an index, not a memory — it should contain only links to memory files with brief descriptions. It has no frontmatter. Never write memory content directly into `MEMORY.md`.",
        "",
        "- `MEMORY.md` is always loaded into your system prompt — lines after 200 will be truncated, so keep the index concise",
        "- Organize memory semantically by topic, not chronologically",
        "- Update or remove memories that turn out to be wrong or outdated",
        "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."
    ].join("\n");
}

// Mapping: XKq → buildFileBasedExtractionPrompt, A → messageCount, RD1 → SCOPE_TYPE_DEFINITIONS, _36 → MEMORY_DONT_SAVE_SECTION, w36 → FRONTMATTER_TEMPLATE

### 4.2 Two-Step Save Process

**Step 1: Create memory file with frontmatter**
```markdown
---
name: user-coding-preferences
description: User's preferred coding style and conventions
type: user
---

# Coding Preferences

- Use TypeScript for all new files
- Prefer functional components over class components
```

**Step 2: Add pointer to MEMORY.md**
```markdown
# Memory Index

- [Coding Preferences](./user_role.md) - User's preferred coding style
- [Debugging Patterns](./debugging.md) - Common debugging approaches
```

---

## 5. Team Extraction Prompt (PKq)

### 5.1 Full Implementation

// ============================================
// PKq - Team extraction prompt with user/team memory selection
// Location: chunks.148.mjs:407-410
// ============================================

// ORIGINAL (for source lookup):
function PKq(A) {
    return [sE1(A), "", "## You MUST save memories when:", "- You encounter information that might be useful in future conversations. Whenever you find new information, think to yourself whether it would be helpful to have if you started a new conversation tomorrow. If the answer is yes, save it immediately before continuing work on the task.", `- When the user describes what they are working on, their goals, or the broader context of their project (e.g., "I'm building...", "we're migrating to...", "the goal is..."), save this so you can reference it in future sessions.`, "- When in doubt about whether something is worth saving, save it — it is better to prune and curate memories later than it is to fail to remember and have users correct you later.", "", "## What to save in user memory (private):", "- User preferences for workflow, tools, or communication style. Especially if the user corrects or guides you during the conversation.", "- Information that might help you understand the user's personal projects and goals.", "- Solutions to problems you have encountered with the current user that are unlikely to recur for other users.", "- Any information the user has explicitly asked you to remember.", "", "## What to save in team memory (shared):", "- Reusable patterns and conventions within the project that are not otherwise documented in the CLAUDE.md files.", "- Project or goal information that might help you understand the intent of future and ongoing work within the user's organization.", "- Architectural decisions, important file paths, and project structure.", "- Solutions to problems that are likely to recur across users or conversations.", "- Insights that may help you with future debugging conversations with all users that might contribute to this project.", "- Any information the user explicitly has asked you to remember for the team or commit to team memory.", "", "## What not to save:", "- You MUST avoid saving sensitive data within shared team memories. For example, never save API keys or user credentials.", "- Ephemeral task details: information that is only relevant to the current task at hand like in-progress work or temporary state.", "- User-specific preferences in team memory: Not all new information will be useful to all members of the user's organization. For example, one user might prefer a functional programming style and another might prefer OOP. If you determine that a memory is user-specific, save it to user memory instead.", "- Information that duplicates or contradicts existing CLAUDE.md instructions.", "", "## Choosing between user memory and team memory:", '- If the user explicitly says "remember" or "save", use user memory.', '- If the user explicitly says "remember for the team" or "save to team memory", use team memory.', "- If the information is about personal preferences, style, or workflow specific to this user, use user memory.", "- If the information is about project conventions, architecture, or shared knowledge, use team memory.", "- If unclear, ask which memory to use.", "", "## Explicit user requests:", '- If a user explicitly asks you to remember a piece of information, you MUST save it immediately. Messages like this will often begin with "never...", "always...", "next time...", "remember..." etc.', "- If a user explicitly asks you to forget or stop remembering information, you MUST find and remove the relevant entry from the appropriate memory.", "", "## How to save memories:", "- Organize memory semantically by topic, not chronologically", "- Use the Write and Edit tools to update your memory files", "- `MEMORY.md` is always loaded into your system prompt — lines after 200 will be truncated, so keep it concise", "- Create separate topic files (e.g., `debugging.md`, `patterns.md`) for detailed notes and link to them from MEMORY.md", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."].join("\n")
}

// Mapping: PKq → buildTeamExtractionPrompt, A → messageCount

### 5.2 User vs Team Memory Decision Matrix

**Save to USER memory (private):**
| Trigger | Example |
|---------|---------|
| User preferences | "I prefer functional style" |
| Personal projects | "My side project uses..." |
| User-specific solutions | "This user's environment has..." |
| Explicit "remember" | "Remember that I use vim" |

**Save to TEAM memory (shared):**
| Trigger | Example |
|---------|---------|
| Project conventions | "We use TypeScript for all new files" |
| Architecture decisions | "The auth system uses JWT" |
| Cross-user solutions | "The database migration issue was..." |
| Explicit "for team" | "Remember for the team that..." |

**Decision keywords:**
- "remember" / "save" → User memory
- "remember for the team" / "save to team memory" → Team memory

---

## 6. Team File-Based Extraction Prompt (WKq)

### 6.1 Full Implementation

// ============================================
// WKq - Team extraction prompt with file-based format
// Location: chunks.148.mjs:412-415
// ============================================

// ORIGINAL (for source lookup):
function WKq(A) {
    return [sE1(A), "", "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.", "", ...LD1, ..._36, "- You MUST avoid saving sensitive data within shared team memories. For example, never save API keys or user credentials.", "", "## How to save memories", "", "Saving a memory is a two-step process:", "", "**Step 1** — write the memory to its own file in the chosen directory (private or team, per the type's scope guidance) using this frontmatter format:", "", ...w36, "", "**Step 2** — add a pointer to that file in the same directory's `MEMORY.md`. Each directory (private and team) has its own `MEMORY.md` index — these contain only links to memory files with brief descriptions. They have no frontmatter. Never write memory content directly into a `MEMORY.md`.", "", "- Both `MEMORY.md` indexes are loaded into your system prompt — lines after 200 will be truncated, so keep them concise", "- Organize memory semantically by topic, not chronologically", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."].join("\n")
}

// READABLE (for understanding):
function buildTeamFileBasedExtractionPrompt(messageCount) {
    return [
        buildExtractionSubagentPrompt(messageCount),
        "",
        "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.",
        "",
        ...TEAM_SCOPE_DEFINITIONS,  // LD1 - memory types with team guidance
        ...MEMORY_DONT_SAVE_SECTION, // _36 - what NOT to save
        "- You MUST avoid saving sensitive data within shared team memories. For example, never save API keys or user credentials.",
        "",
        "## How to save memories",
        "",
        "Saving a memory is a two-step process:",
        "",
        "**Step 1** — write the memory to its own file in the chosen directory (private or team, per the type's scope guidance) using this frontmatter format:",
        "",
        ...FRONTMATTER_TEMPLATE,  // w36
        "",
        "**Step 2** — add a pointer to that file in the same directory's `MEMORY.md`. Each directory (private and team) has its own `MEMORY.md` index — these contain only links to memory files with brief descriptions. They have no frontmatter. Never write memory content directly into a `MEMORY.md`.",
        "",
        "- Both `MEMORY.md` indexes are loaded into your system prompt — lines after 200 will be truncated, so keep them concise",
        "- Organize memory semantically by topic, not chronologically",
        "- Update or remove memories that turn out to be wrong or outdated",
        "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."
    ].join("\n");
}

// Mapping: WKq → buildTeamFileBasedExtractionPrompt, A → messageCount, LD1 → TEAM_SCOPE_DEFINITIONS, _36 → MEMORY_DONT_SAVE_SECTION, w36 → FRONTMATTER_TEMPLATE

### 6.2 Key Differences from PKq

| Aspect | PKq (Team Standard) | WKq (Team File-Based) |
|--------|---------------------|----------------------|
| Save format | Direct to MEMORY.md | Two-step with frontmatter |
| MEMORY.md role | Content container | Index only |
| Frontmatter | No | Yes (`w36`) |
| Directory guidance | Implicit | Explicit (private/team) |

---

## 7. Supporting Constants

### 7.1 Memory Type Names (h14)

// ============================================
// h14 - Memory type names array
// Location: chunks.84.mjs:103
// ============================================

h14 = ["user", "feedback", "project", "reference"]

### 7.2 SCOPE_TYPE_DEFINITIONS (RD1)

The `RD1` constant contains detailed type definitions for single-scope memory:

**Types defined:**
- `user` - User profile, preferences, knowledge
- `feedback` - Corrections and guidance from user
- `project` - Ongoing work, goals, initiatives
- `reference` - External system pointers

**Each type includes:**
- `<name>` - Type identifier
- `<description>` - What to store
- `<when_to_save>` - Trigger conditions
- `<how_to_use>` - Usage guidance
- `<examples>` - Sample interactions

### 7.3 TEAM_SCOPE_DEFINITIONS (LD1)

The `LD1` constant extends `RD1` with scope guidance:

**Additional fields:**
- `<scope>` - `private`, `team`, or guidance for choosing

**Key difference:**
- `user` type → `<scope>always private</scope>`
- `feedback` type → `<scope>default to private. Save as team only when...</scope>`
- `project` type → `<scope>private or team, but strongly bias toward team</scope>`
- `reference` type → `<scope>usually team</scope>`

### 7.4 MEMORY_DONT_SAVE_SECTION (_36)

// ============================================
// _36 - What NOT to save in memory
// Location: chunks.84.mjs:104
// ============================================

_36 = [
    "## What NOT to save in memory",
    "",
    "- Code patterns, conventions, architecture, file paths, or project structure — these can be derived by reading the current project state.",
    "- Git history, recent changes, or who-changed-what — `git log` / `git blame` are authoritative.",
    "- Debugging solutions or fix recipes — the fix is in the code; the commit message has the context.",
    "- Anything already documented in CLAUDE.md files.",
    "- Ephemeral task details: in-progress work, temporary state, current conversation context."
]

### 7.5 FRONTMATTER_TEMPLATE (w36)

// ============================================
// w36 - Frontmatter template for memory files
// Location: chunks.84.mjs:104
// ============================================

w36 = [
    "```markdown",
    "---",
    "name: {{memory name}}",
    "description: {{one-line description — used to decide relevance in future conversations, so be specific}}",
    `type: {{${h14.join(", ")}}}`,  // "type: {{user, feedback, project, reference}}"
    "---",
    "",
    "{{memory content — for feedback/project types, structure as: rule/fact, then **Why:** and **How to apply:** lines}}",
    "```"
]

---

## 8. Usage Patterns

### 8.1 When Each Prompt Is Used

| Scenario | Flag Configuration | Prompt |
|----------|-------------------|--------|
| Simple memory, single user | Default | `DKq` |
| File-based, single user | `tengu_swinburne_dune=true` | `XKq` |
| Team memory, simple | `tengu_herring_clock=true` | `PKq` |
| Team memory, file-based | Both flags | `WKq` |

### 8.2 Common Patterns Across All Prompts

**Universal principles:**
1. **When in doubt, save** - Better to prune later than forget
2. **Organize semantically** - Not chronologically
3. **200-line limit** - Keep MEMORY.md concise
4. **Use topic files** - Link from index, store details separately
5. **No duplicates** - Check before creating new

**Explicit user request handling:**
- "remember" → Save immediately
- "forget" → Find and remove
- Keywords: "never...", "always...", "next time..."

---

## Summary

Memory extraction prompts provide:

1. **Four variants** for different memory configurations
2. **Team-aware guidance** for user vs team memory selection
3. **File-based format** with frontmatter for structured storage
4. **Consistent principles** across all variants
5. **Clear decision rules** for what to save/not save

**Key architectural insight**: The extraction prompt system adapts to the memory configuration (single vs dual, simple vs file-based) while maintaining consistent save principles. The two-step save process in file-based modes (frontmatter file + index pointer) enables structured, searchable memory with rich metadata.