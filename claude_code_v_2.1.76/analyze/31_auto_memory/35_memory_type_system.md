# Memory Type System Analysis

## Overview

The Auto Memory system includes a sophisticated type system for organizing and categorizing memory files. This document analyzes the type definitions, scope concepts, and frontmatter templates that enable structured memory organization.

**Version**: Claude Code v2.1.76

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key symbols:
- `MEMORY_TYPE_NAMES` (`h14`) - Array of type names (chunks.84.mjs:103)
- `SCOPE_TYPE_DEFINITIONS` (`RD1`) - Single-scope types (chunks.84.mjs:104)
- `TEAM_SCOPE_DEFINITIONS` (`LD1`) - Team-scope types (chunks.84.mjs:104)
- `MEMORY_DONT_SAVE_SECTION` (`_36`) - What NOT to save (chunks.84.mjs:104)
- `FRONTMATTER_TEMPLATE` (`w36`) - Template for memory files (chunks.84.mjs:104)

---

## 1. Memory Type Definitions

### 1.1 Type Names (h14)

// ============================================
// h14 - Memory type names array
// Location: chunks.84.mjs:103
// ============================================

// ORIGINAL (for source lookup):
h14 = ["user", "feedback", "project", "reference"]

// READABLE (for understanding):
const MEMORY_TYPE_NAMES = ["user", "feedback", "project", "reference"];

// Mapping: h14 → MEMORY_TYPE_NAMES

**Type Definitions:**

| Type | Purpose | Example Content |
|------|---------|-----------------|
| `user` | User preferences and personal patterns | Preferred coding style, communication preferences |
| `feedback` | Lessons learned from interactions | What worked well, what didn't work |
| `project` | Project-specific knowledge | Architecture decisions, file paths, conventions |
| `reference` | Reference material | API documentation, cheat sheets, tutorials |

### 1.2 Single-Scope Type Definitions (RD1)

// ============================================
// RD1 - Memory type definitions for single-scope memory
// Location: chunks.84.mjs:104
// ============================================

// READABLE (for understanding):
const SCOPE_TYPE_DEFINITIONS = `
## Memory types

Each memory file should have a \`type\` in its frontmatter, to indicate what kind of information it contains:

- \`user\` — User preferences and patterns, for how you should work with this user.
- \`feedback\` — Lessons learned from interactions, good or bad.
- \`project\` — Project-specific knowledge, conventions, and context.
- \`reference\` — Reference material that you might want to look up.
`;

### 1.3 Team-Scope Type Definitions (LD1)

// ============================================
// LD1 - Memory type definitions for team-scope memory
// Location: chunks.84.mjs:104
// ============================================

// READABLE (for understanding):
const TEAM_SCOPE_DEFINITIONS = `
## Memory types

Each memory file should have a \`type\` in its frontmatter, to indicate what kind of information it contains:

- \`user\` — User preferences (private, not shared with team)
- \`feedback\` — Lessons learned from interactions
- \`project\` — Project knowledge (shared with team)
- \`reference\` — Reference material

For each type, choose whether to save in user memory (private) or team memory (shared):
- User preferences → user memory (private)
- Project conventions → team memory (shared)
`;

**Key difference**: Team-scope definitions include guidance for choosing between user memory (private) and team memory (shared).

---

## 2. Frontmatter Template System

### 2.1 Standard Frontmatter Template (w36)

// ============================================
// w36 - Frontmatter template for memory files
// Location: chunks.84.mjs:104
// ============================================

// READABLE (for understanding):
const FRONTMATTER_TEMPLATE = `
---
name: descriptive-name
description: A brief description of what this memory contains
type: user | feedback | project | reference
---

# Memory Content

Your memory content goes here...
`;

**Frontmatter Fields:**

| Field | Required | Purpose | Example |
|-------|----------|---------|---------|
| `name` | Yes | Unique identifier | `user-coding-preferences` |
| `description` | Yes | Brief summary for LLM selection | "User's preferred coding style and conventions" |
| `type` | Yes | Category from defined types | `user`, `feedback`, `project`, `reference` |
| `paths` | No | Scope to specific directories | `["./src/**", "./lib/**"]` |

### 2.2 Extended Frontmatter Fields

Additional fields supported but not required:

| Field | Purpose | Example |
|-------|---------|---------|
| `scope` | Visibility scope | `user`, `team` |
| `priority` | Importance hint | `high`, `medium`, `low` |
| `created` | Creation timestamp | `2024-01-15` |
| `updated` | Last update timestamp | `2024-01-20` |

---

## 3. Memory Content Guidelines

### 3.1 What NOT to Save (_36)

// ============================================
// _36 - What NOT to save in memory
// Location: chunks.84.mjs:104
// ============================================

// READABLE (for understanding):
const MEMORY_DONT_SAVE_SECTION = `
## What NOT to save in memories

- Ephemeral task details: information that is only relevant to the current task, such as "I'm currently implementing X" or "The bug is on line 42".
- Information that duplicates or contradicts existing CLAUDE.md instructions.
- Speculative or unverified conclusions from reading a single file.
- Session-specific context: current task details, in-progress work, temporary state.
- Sensitive data: API keys, passwords, personal information (especially in team memory).
`;

**Anti-patterns to avoid:**

1. **Current state**: "I am working on the login feature"
   - ❌ Too session-specific
   - ✅ Instead: "Login flow uses JWT with 24-hour expiry"

2. **Duplicate information**: Repeating what's in CLAUDE.md
   - ❌ Creates confusion if they diverge
   - ✅ Reference CLAUDE.md instead

3. **Speculation**: "This might be a bug"
   - ❌ Not verified
   - ✅ Wait until confirmed, then save the insight

---

## 4. Type Selection Algorithm

### 4.1 Type Selection Decision Tree

```
User provides information
        │
        ▼
┌───────────────────────────────┐
│ Is it about user preferences? │
│ (coding style, communication) │
└───────────────┬───────────────┘
                │
        ┌───────┴───────┐
        │ YES           │ NO
        ▼               ▼
    ┌───────┐   ┌───────────────────┐
    │ user  │   │ Is it a lesson    │
    └───────┘   │ learned/feedback? │
                └─────────┬─────────┘
                          │
                  ┌───────┴───────┐
                  │ YES           │ NO
                  ▼               ▼
              ┌─────────┐   ┌────────────────────┐
              │ feedback│   │ Is it project      │
              └─────────┘   │ specific knowledge?│
                            └──────────┬─────────┘
                                       │
                               ┌───────┴───────┐
                               │ YES           │ NO
                               ▼               ▼
                           ┌─────────┐   ┌───────────┐
                           │ project │   │ reference │
                           └─────────┘   └───────────┘
```

### 4.2 Type Characteristics

| Type | Persistence | Scope | Examples |
|------|-------------|-------|----------|
| `user` | Long-term | User-specific | Coding preferences, communication style |
| `feedback` | Medium-term | Context-specific | What worked, what didn't |
| `project` | Long-term | Project-specific | Architecture, conventions |
| `reference` | Long-term | General | API docs, cheat sheets |

---

## 5. Team vs User Memory Selection

### 5.1 Decision Matrix

When team memory is enabled (`tengu_herring_clock`), the extraction prompt includes guidance for choosing between user and team memory:

**Save to USER memory (private):**
- User preferences for workflow, tools, communication style
- Personal project context
- Information about specific user needs
- Anything marked "remember" without "for team"

**Save to TEAM memory (shared):**
- Reusable patterns and conventions
- Project architecture decisions
- Solutions to recurring problems
- Information explicitly marked "remember for the team"

### 5.2 Privacy Considerations

**Critical rule**: Never save sensitive data in team memory.

This is enforced in the extraction prompt:

```
You MUST avoid saving sensitive data within shared team memories:
- API keys, tokens, credentials
- Personal identification information
- Private user preferences
- Confidential business logic
```

---

## 6. Integration with Memory Extraction

### 6.1 Type in Extraction Prompts

All four extraction prompt variants include type definitions:

**DKq (Standard)**: Uses `RD1` (SCOPE_TYPE_DEFINITIONS)
**XKq (File-Based)**: Uses `RD1` + `w36` template
**PKq (Team)**: Uses `LD1` (TEAM_SCOPE_DEFINITIONS)
**WKq (Team + File)**: Uses `LD1` + `w36` template

### 6.2 Extraction Prompt Assembly

// ============================================
// Extraction prompt assembly with type definitions
// Location: chunks.148.mjs:397-415
// ============================================

// READABLE (for understanding):
function buildFileBasedExtractionPrompt(messageCount) {
    return [
        buildExtractionSubagentPrompt(messageCount),
        "",
        "If the user explicitly asks you to remember something, save it immediately...",
        "",
        ...SCOPE_TYPE_DEFINITIONS,  // RD1 - type definitions
        ...MEMORY_DONT_SAVE_SECTION,  // _36 - what not to save
        "",
        "## How to save memories",
        "",
        "Saving a memory is a two-step process:",
        "",
        "**Step 1** — write to file using frontmatter format:",
        ...FRONTMATTER_TEMPLATE,  // w36
        "",
        "**Step 2** — add pointer to MEMORY.md",
        // ...
    ].join("\n");
}

---

## 7. Semantic Search Integration

### 7.1 Type in Search Results

When `selectMemoriesWithLLM` (`quY`) formats memory files for LLM selection, the type is included as a prefix:

```javascript
const fileList = memoryFiles.map((file) => {
    const typePrefix = file.type ? `[${file.type}] ` : "";
    return `- ${typePrefix}${file.filename} (${timestamp}): ${file.description}`;
}).join("\n");
```

**Example output:**
```
- [user] coding-style.md (2024-01-15T10:30:00Z): User's preferred coding style
- [project] architecture.md (2024-01-14T09:15:00Z): Project architecture decisions
- [reference] api-cheatsheet.md (2024-01-10T14:20:00Z): Quick API reference
```

### 7.2 Type-Aware Selection

The LLM can use type information to make better selection decisions:
- User preferences → relevant for personalization questions
- Project knowledge → relevant for implementation questions
- Reference material → relevant for "how do I" questions

---

## 8. Usage Examples

### 8.1 Creating a User Preference Memory

```markdown
---
name: user-coding-preferences
description: User's preferred coding style and conventions
type: user
---

# Coding Preferences

## Style
- Use TypeScript for all new files
- Prefer functional components over class components
- Use async/await instead of .then() chains

## Naming
- Use camelCase for variables and functions
- Use PascalCase for components and types
- Prefix interfaces with 'I' (e.g., IUserService)
```

### 8.2 Creating a Project Memory

```markdown
---
name: project-architecture
description: Key architectural decisions and patterns
type: project
paths:
  - ./src/**
  - ./lib/**
---

# Architecture Overview

## Directory Structure
- `/src/components` - React components
- `/src/services` - API service layer
- `/src/utils` - Shared utilities

## Key Patterns
- Repository pattern for data access
- Dependency injection via Inversify
- Event-driven communication between modules
```

### 8.3 Creating a Reference Memory

```markdown
---
name: api-reference
description: Quick reference for internal API endpoints
type: reference
---

# API Reference

## Authentication
POST /auth/login
- Body: { email, password }
- Returns: { token, expiresAt }

## Users
GET /users/:id
- Headers: Authorization: Bearer <token>
- Returns: { id, name, email }
```

---

## Summary

The Memory Type System provides:

1. **Four type categories**: user, feedback, project, reference
2. **Structured frontmatter**: name, description, type, paths
3. **Team vs user scope**: Privacy-aware memory selection
4. **Content guidelines**: Clear rules for what NOT to save
5. **Semantic integration**: Type-aware memory selection

**Key architectural insight**: The type system enables organized, searchable memory that helps the LLM find relevant context quickly. By categorizing memories and providing clear guidelines, the system prevents memory bloat and ensures information is stored in the right place.

---

## Related Documentation

- [26_memory_extraction_mechanism.md](./26_memory_extraction_mechanism.md) - Extraction prompts
- [29_semantic_memory_search.md](./29_semantic_memory_search.md) - Type in search
- [32_feature_flag_dependencies.md](./32_feature_flag_dependencies.md) - Team memory flags
- [topic_file_templates.md](./topic_file_templates.md) - File templates