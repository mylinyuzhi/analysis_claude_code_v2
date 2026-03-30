# Auto Memory: Extraction Prompts Full Content Analysis

## Overview

This document provides the complete verbatim content of all four extraction prompt variants (DKq, XKq, PKq, WKq) plus the subagent intro (sE1), cross-validated from `chunks.148.mjs:375846-375870`.

These prompts are injected when the agent acts as an extraction subagent after a background agent session completes.

**Version**: Claude Code v2.1.76
**Verified**: 2026-03-29

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key symbols:
- `sE1` (`buildExtractionSubagentPrompt`) - Shared intro for all extraction prompts (chunks.148.mjs:375846)
- `DKq` (`buildStandardExtractionPrompt`) - Single memory, simple format (chunks.148.mjs:375850)
- `XKq` (`buildFileBasedExtractionPrompt`) - Single memory, file-based format (chunks.148.mjs:375855)
- `PKq` (`buildTeamExtractionPrompt`) - Team memory, simple format (chunks.148.mjs:375860)
- `WKq` (`buildTeamFileBasedExtractionPrompt`) - Team memory, file-based format (chunks.148.mjs:375865)

---

## 1. Shared Subagent Introduction (`sE1`)

```javascript
// ============================================
// buildExtractionSubagentPrompt - Shared intro for extraction subagent role
// Location: chunks.148.mjs:375846
// ============================================

// ORIGINAL (for source lookup):
function sE1(A) {
    return `You are now acting as the memory extraction subagent. Any prior instruction to not write memory files applies to the main conversation — in this role, writing is your job. Analyze the most recent ~${A} messages above and use them to update your persistent memory systems.`
}

// READABLE: takes message count parameter
function buildExtractionSubagentPrompt(messageCount) {
    return `You are now acting as the memory extraction subagent. Any prior instruction to not write memory files applies to the main conversation — in this role, writing is your job. Analyze the most recent ~${messageCount} messages above and use them to update your persistent memory systems.`
}
```

**Critical design decision in `sE1`:** The phrase "Any prior instruction to not write memory files applies to the main conversation" explicitly overrides the read-only memory instruction from `xv9()` (`buildBackgroundAgentMemoryPrompt`). Background agents get `xv9` which says "you should not write to memory files yourself" — the extraction subagent's intro explicitly countermands that restriction.

---

## 2. Standard Extraction Prompt (`DKq`)

Used when: `tengu_passport_quail=true`, single memory, `tengu_swinburne_dune=false`

```javascript
// ============================================
// buildStandardExtractionPrompt - Single memory, simple format extraction
// Location: chunks.148.mjs:375850
// ============================================

function DKq(A) {
    return [
        sE1(A),
        "",
        "## You MUST save memories when:",
        "- You encounter information that might be useful in future conversations. Whenever you find new information, think to yourself whether it would be helpful to have if you started a new conversation tomorrow. If the answer is yes, save it immediately before continuing work on the task.",
        "- When the user describes what they are working on, their goals, or the broader context of their project (e.g., \"I'm building...\", \"we're migrating to...\", \"the goal is...\"), save this so you can reference it in future sessions.",
        "- When in doubt about whether something is worth saving, save it — it is better to prune and curate memories later than it is to fail to remember and have users correct you later.",
        "",
        "## What to save in memories:",
        "- Reusable patterns and conventions within the project that are not otherwise documented in the CLAUDE.md files",
        "- Project or goal information that might help you understand the intent of future work",
        "- Architectural decisions, important file paths, and project structure",
        "- User preferences for workflow, tools, or communication style. Especially if the user corrects or guides you during the conversation.",
        "- Solutions to problems that are likely to recur or insights that may help you with future debugging.",
        "- Any information the user explicitly has asked you to remember for later.",
        "",
        "## What not to save in memories:",
        "- Ephemeral task details: information that is only relevant to the current task at hand like in-progress work or temporary state",
        "- Information that duplicates or contradicts existing CLAUDE.md instructions.",
        "",
        "## Explicit user requests:",
        "- If a user explicitly asks you to remember a piece of information, you MUST save it immediately. Messages like this will often begin with \"never...\", \"always...\", \"next time...\", \"remember...\" etc.",
        "- If a user explicitly asks you to forget or stop remembering information, you MUST find and remove the relevant entry from the appropriate memory.",
        "",
        "## How to save memories:",
        "- Organize memory semantically by topic, not chronologically",
        "- Use the Write and Edit tools to update your memory files",
        "- `MEMORY.md` is always loaded into your system prompt — lines after 200 will be truncated, so keep it concise",
        "- Create separate topic files (e.g., `debugging.md`, `patterns.md`) for detailed notes and link to them from MEMORY.md",
        "- Update or remove memories that turn out to be wrong or outdated",
        "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."
    ].join("\n")
}
```

**Analysis of DKq design:**

- **Aggressive save policy**: "When in doubt, save it" — prioritizes recall over cleanliness
- **Explicit trigger phrases**: Guides detection of "remember..." style requests
- **Topic file pattern enforced**: Instructs creating separate files, linking from MEMORY.md
- **Anti-duplication**: Explicitly instructs checking before writing new entries

---

## 3. File-Based Extraction Prompt (`XKq`)

Used when: `tengu_passport_quail=true`, single memory, `tengu_swinburne_dune=true` (file-based format)

```javascript
// ============================================
// buildFileBasedExtractionPrompt - Single memory, file-based format
// Location: chunks.148.mjs:375855
// ============================================

function XKq(A) {
    return [
        sE1(A),
        "",
        "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.",
        "",
        ...RD1,    // Memory type definitions (user, feedback, project, reference)
        ..._36,    // What NOT to save section
        "",
        "## How to save memories",
        "",
        "Saving a memory is a two-step process:",
        "",
        "**Step 1** — write the memory to its own file (e.g., `user_role.md`, `feedback_testing.md`) using this frontmatter format:",
        "",
        ...w36,    // Frontmatter template (name, description, type fields)
        "",
        "**Step 2** — add a pointer to that file in `MEMORY.md`. `MEMORY.md` is an index, not a memory — it should contain only links to memory files with brief descriptions. It has no frontmatter. Never write memory content directly into `MEMORY.md`.",
        "",
        "- `MEMORY.md` is always loaded into your system prompt — lines after 200 will be truncated, so keep the index concise",
        "- Organize memory semantically by topic, not chronologically",
        "- Update or remove memories that turn out to be wrong or outdated",
        "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."
    ].join("\n")
}
```

**Key difference from DKq:** `XKq` uses the typed memory system (with `RD1` = memory type definitions — user, feedback, project, reference). It enforces a **two-step save process**: individual file with frontmatter + index entry in MEMORY.md. This is the file-based format enabled by `tengu_swinburne_dune`.

---

## 4. Team Extraction Prompt (`PKq`)

Used when: `tengu_passport_quail=true`, team memory enabled (`tengu_herring_clock=true`), simple format

```javascript
// ============================================
// buildTeamExtractionPrompt - Team memory, simple format
// Location: chunks.148.mjs:375860
// ============================================

function PKq(A) {
    return [
        sE1(A),
        "",
        "## You MUST save memories when:",
        // ... [same as DKq trigger conditions] ...
        "",
        "## What to save in user memory (private):",
        "- User preferences for workflow, tools, or communication style.",
        "- Information about the user's personal projects and goals.",
        "- Solutions to problems you have encountered with the current user that are unlikely to recur for other users.",
        "- Any information the user has explicitly asked you to remember.",
        "",
        "## What to save in team memory (shared):",
        "- Reusable patterns and conventions within the project not otherwise documented in CLAUDE.md files.",
        "- Project or goal information for ongoing work within the user's organization.",
        "- Architectural decisions, important file paths, and project structure.",
        "- Solutions to problems likely to recur across users or conversations.",
        "- Insights for future debugging conversations with all users.",
        "- Any information the user explicitly asked to remember for the team.",
        "",
        "## What not to save:",
        "- You MUST avoid saving sensitive data within shared team memories. For example, never save API keys or user credentials.",
        "- Ephemeral task details only relevant to the current task.",
        "- User-specific preferences in team memory: save to user memory instead.",
        "- Information duplicating or contradicting existing CLAUDE.md instructions.",
        "",
        "## Choosing between user memory and team memory:",
        "- If the user explicitly says \"remember\" or \"save\", use user memory.",
        "- If the user explicitly says \"remember for the team\" or \"save to team memory\", use team memory.",
        "- If about personal preferences, style, workflow — use user memory.",
        "- If about project conventions, architecture, shared knowledge — use team memory.",
        "- If unclear, ask which memory to use.",
        "",
        "## Explicit user requests:",
        // ... [same explicit request handling as DKq] ...
        "",
        "## How to save memories:",
        // ... [same MEMORY.md pattern guidance] ...
    ].join("\n")
}
```

**Key differences in PKq vs DKq:**
1. **Two-memory awareness**: Distinguishes user memory (private) vs team memory (shared)
2. **Security constraint**: "MUST avoid saving sensitive data within shared team memories" — explicit prohibition on API keys, credentials
3. **Routing guidance**: Provides decision rules for which memory to use
4. **Ambiguity resolution**: Instructs to ask if routing is unclear

---

## 5. Team File-Based Extraction Prompt (`WKq`)

Used when: `tengu_passport_quail=true`, team memory enabled, `tengu_swinburne_dune=true` (file-based format)

```javascript
// ============================================
// buildTeamFileBasedExtractionPrompt - Team memory, typed file-based format
// Location: chunks.148.mjs:375865
// ============================================

function WKq(A) {
    return [
        sE1(A),
        "",
        "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.",
        "",
        ...LD1,   // TEAM memory type definitions (with private/team scope guidance)
        ..._36,   // What NOT to save section
        "- You MUST avoid saving sensitive data within shared team memories. For example, never save API keys or user credentials.",
        "",
        "## How to save memories",
        "",
        "Saving a memory is a two-step process:",
        "",
        "**Step 1** — write the memory to its own file in the chosen directory (private or team, per the type's scope guidance) using this frontmatter format:",
        "",
        ...w36,   // Frontmatter template
        "",
        "**Step 2** — add a pointer to that file in the same directory's `MEMORY.md`. Each directory (private and team) has its own `MEMORY.md` index — these contain only links to memory files with brief descriptions. They have no frontmatter. Never write memory content directly into a `MEMORY.md`.",
        "",
        "- Both `MEMORY.md` indexes are loaded into your system prompt — lines after 200 will be truncated, so keep them concise",
        "- Organize memory semantically by topic, not chronologically",
        "- Update or remove memories that turn out to be wrong or outdated",
        "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."
    ].join("\n")
}
```

**Key difference: `LD1` vs `RD1`:**
- `RD1` (used by `XKq`): Single-scope memory type definitions — simpler, no team distinction
- `LD1` (used by `WKq`): Team-scope memory type definitions — each type has `scope: private | team` guidance, teaching the agent where each memory TYPE belongs

This is the most complex extraction mode: typed memory with team/private routing.

---

## 6. Extraction Prompt Selection Matrix

```
tengu_passport_quail=true (background agent mode)?
│
├── YES: Extraction subagent needed
│   │
│   ├─ isTeamMemoryEnabled() (tengu_herring_clock)?
│   │   │
│   │   ├── YES (team + user memory):
│   │   │   ├─ tengu_swinburne_dune? → WKq() (team, typed file-based)
│   │   │   └─ default             → PKq() (team, simple)
│   │   │
│   │   └── NO (single user memory):
│   │       ├─ tengu_swinburne_dune? → XKq() (single, typed file-based)
│   │       └─ default             → DKq() (single, simple)
│   │
│   └── (extraction prompt passed to subagent with ~N recent messages)
│
└── NO: Main agent can write memory directly (no extraction subagent)
```

---

## 7. The `sE1` Permission Override: Why It Matters

The subagent intro has a critical permission override that deserves deeper analysis:

```
Main agent receives (from xv9):
  "A background agent automatically extracts and saves memories from this conversation.
   If the user asks you to remember or forget something, acknowledge it — the save
   happens automatically. You should not write to memory files yourself."

Extraction subagent receives (from sE1):
  "You are now acting as the memory extraction subagent. Any prior instruction to
   not write memory files applies to the main conversation — in this role, writing
   is your job."
```

**How this works:**
1. Main background agent: has MEMORY.md in context (via `xv9`), but told NOT to write
2. Background agent finishes its task
3. System injects `sE1(N)` + one of `DKq/XKq/PKq/WKq` into the conversation
4. The agent then re-reads the conversation and extracts memories
5. The `sE1` override explicitly grants write permission for this extraction phase

**Why separate subagent instead of inline writing?**
- **Context window**: Background agents may use most of the context window for task execution. Extraction subagent starts fresh with just the conversation history
- **Focus**: Extraction requires reviewing the full conversation, which is better done as a dedicated pass
- **Permission clarity**: Explicit role switch prevents main agent from writing memory prematurely during task execution

---

## 8. Constants Injected into Extraction Prompts

The prompts reference three shared constant arrays:

### `RD1` — Single-Scope Memory Type Definitions
```
## Types of memory

There are several discrete types of memory that you can store in your memory system:

<types>
  <type>user — Contains info about user's role, goals, responsibilities, knowledge</type>
  <type>feedback — Guidance the user has given you about how to approach work</type>
  <type>project — Information about ongoing work, goals, bugs, incidents</type>
  <type>reference — Pointers to where information can be found in external systems</type>
</types>
```

### `LD1` — Team-Scope Memory Type Definitions (used in WKq)
Same type definitions as `RD1` but each type includes `<scope>` guidance indicating whether it belongs in private vs team memory directory.

### `_36` — What NOT to Save in Memory
```
## What NOT to save in memory

- Code patterns, conventions, architecture, file paths, or project structure
  — these can be derived by reading the current project state.
- Git history, recent changes, or who-changed-what — git log/git blame are authoritative.
- Debugging solutions or fix recipes — the fix is in the code; the commit message has the context.
- Anything already documented in CLAUDE.md files.
- Ephemeral task details: in-progress work, temporary state, current conversation context.
```

### `w36` — Frontmatter Template
```markdown
---
name: {{memory name}}
description: {{one-line description — used to decide relevance in future conversations, so be specific}}
type: {{user, feedback, project, reference}}
---

{{memory content — for feedback/project types, structure as: rule/fact, then **Why:** and **How to apply:** lines}}
```

---

## Summary: Extraction Prompt Architecture

The four extraction prompts form a 2×2 matrix:

| | Simple Format | File-Based Format (`tengu_swinburne_dune`) |
|---|---|---|
| **Single memory** | `DKq` — aggressive save, pattern guidance | `XKq` — typed, two-step file+index |
| **Team memory** | `PKq` — routing, security, team vs user | `WKq` — typed, team routing, security |

All share:
- The `sE1` role override (write permission grant)
- The `_36` "what NOT to save" guidance
- MEMORY.md index pattern (concise, 200-line limit)
- Deduplication instructions

The progression from `DKq` (simplest) to `WKq` (most complex):
- `DKq`: Just save important things
- `XKq`: Save with typed frontmatter, two-step process
- `PKq`: Route to correct memory (user vs team)
- `WKq`: Route + typed frontmatter + two directories
