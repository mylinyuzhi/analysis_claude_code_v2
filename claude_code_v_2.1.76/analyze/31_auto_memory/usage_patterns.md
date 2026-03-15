# Auto Memory Usage Patterns - Best Practices and Common Mistakes

> **Module**: Auto Memory - Usage Guidelines
> **Source**: `chunks.87.mjs` (lines 2257-2296), System prompt guidelines
> **Version**: Claude Code v2.1.76

---

## Table of Contents

1. [Overview](#1-overview)
2. [MEMORY.md Best Practices](#2-memorymd-best-practices)
3. [Topic File Organization](#3-topic-file-organization)
4. [When to Write Memory](#4-when-to-write-memory)
5. [When NOT to Write Memory](#5-when-not-to-write-memory)
6. [Memory Evolution Stages](#6-memory-evolution-stages)
7. [Common Mistakes](#7-common-mistakes)
8. [Examples: Good vs Bad](#8-examples-good-vs-bad)
9. [Related Symbols](#9-related-symbols)

---

## 1. Overview

The Auto Memory system allows Claude Code to accumulate knowledge across sessions, but effective use requires understanding the difference between an **index** (what belongs in MEMORY.md) and **detailed storage** (what belongs in topic files).

### Core Principles

**MEMORY.md is an index, not a database**
- Keep entries concise (1-2 lines each)
- Link to topic files for details
- Stay under 200 lines total

**Topic files are for deep dives**
- Store detailed notes, code examples, troubleshooting steps
- Organize by domain or technology
- No size limit (but stay reasonable - under 500 lines per file)

**Write when patterns emerge, not speculatively**
- Confirm patterns across 2+ interactions before writing
- Wait for user confirmation before recording preferences
- Update existing entries rather than adding duplicates

---

## 2. MEMORY.md Best Practices

### Index-Style Organization

**GOOD: Concise entries with links**

```markdown
# Project Memory

## Architecture Decisions
- API uses GraphQL over REST ([architecture.md](architecture.md))
- Frontend: React with Vite ([frontend_setup.md](frontend_setup.md))
- Database: PostgreSQL with Prisma ORM

## Common Issues
- Build fails with ENOENT? → [debugging.md#build-errors](debugging.md#build-errors)
- Test flakiness in CI → [testing_strategies.md#ci-fixes](testing_strategies.md#ci-fixes)

## User Preferences
- Always use `bun` instead of `npm`
- Never auto-commit without explicit user approval
- Prefer verbose logging during development
```

**BAD: Verbose entries without structure**

```markdown
# Project Memory

I noticed that the API is using GraphQL. The user mentioned this several times and it seems
like the right choice for this project. GraphQL allows for flexible queries and reduces
over-fetching compared to REST. The schema is defined in schema.graphql and the resolvers
are in src/resolvers/. We're using Apollo Server v3 with Express middleware...

[This continues for 150 lines, filling up MEMORY.md with details that should be in topic files]
```

### Link Format

Use relative paths and optional anchor links:

```markdown
## Performance Notes
- Database query optimization → [performance.md#database](performance.md#database)
- React rendering patterns → [frontend_patterns.md#rendering](frontend_patterns.md#rendering)

## Debugging Checklist
See [debugging.md](debugging.md) for full checklist.
```

### Standard Sections

- **Architecture Decisions** - High-level tech choices
- **Common Issues** - Recurring problems and their solutions
- **User Preferences** - Workflow and style preferences
- **Key File Paths** - Important directories and configs
- **Project Conventions** - Naming, formatting, patterns

---

## 3. Topic File Organization

### By Domain (Recommended)

```
memory/
├── MEMORY.md           # Index (< 200 lines)
├── architecture.md     # High-level architecture decisions
├── debugging.md        # Troubleshooting guides
├── patterns.md         # Code patterns and conventions
├── testing.md          # Testing strategies
└── deployment.md       # Deployment procedures
```

### By Technology

For projects with multiple tech stacks:

```
memory/
├── MEMORY.md
├── react_patterns.md      # React-specific patterns
├── prisma_schema.md       # Database schema notes
├── graphql_resolvers.md   # GraphQL patterns
└── aws_deployment.md      # AWS-specific config
```

### Variable Support in Topic Files (v2.1.76)

Topic files created by skills can use `${CLAUDE_SKILL_DIR}` to reference their installation:

```markdown
# Skill Quick Reference

## Commands Available
See ${CLAUDE_SKILL_DIR}/README.md for documentation.

## Templates
Templates at: ${CLAUDE_SKILL_DIR}/templates/
```

---

## 4. When to Write Memory

### Trigger Conditions

**1. User explicitly requests it**

User says: *"Remember to always use bun instead of npm"*

→ **Immediate write to MEMORY.md**:
```markdown
## User Preferences
- Always use `bun` instead of `npm`
```

**2. Pattern confirmed across 2+ interactions**

First interaction: User fixes React key warning
Second interaction: Same warning appears, user mentions it again

→ **Write to patterns.md**:
```markdown
## React Patterns

### Always provide keys for list items
When mapping arrays to components, include a unique `key` prop:
```jsx
{items.map(item => <Item key={item.id} {...item} />)}
```
Without keys, React warns and performance degrades.
```

**3. Error solved that may recur**

User hits `ENOENT` error, spends 10 minutes debugging, finds solution

→ **Write to debugging.md** (see examples above)

**4. Project conventions established**

After 3-4 files following a pattern (e.g., all API handlers use same error format)

→ **Write to patterns.md**

### Content to Save

**Architecture decisions**
```markdown
## Architecture Decisions

### Database Choice: PostgreSQL over MongoDB
**Context**: Need complex queries with joins, ACID transactions
**Decision**: PostgreSQL with Prisma ORM
**Date**: 2026-03-15
```

**User workflow preferences**
```markdown
## User Preferences

### Git Workflow
- Always create feature branches (never commit directly to main)
- Squash commits before merging
- Use conventional commit messages (feat:, fix:, docs:)
```

---

## 5. When NOT to Write Memory

### Anti-Patterns

**Session-specific details**

BAD:
```markdown
## Current Work
- User asked me to implement login page
- I created LoginForm.tsx in src/components/auth/
- Need to add password validation next
```

**Why bad**: This is session state, not persistent knowledge. Will be stale next session.

**Speculative conclusions from one file**

BAD:
```markdown
## API Architecture
Based on reading src/api/users.ts, the API uses RESTful patterns with Express.
```

**Why bad**: Conclusion based on one file. May not apply to entire codebase.

**Better**: After reading 5+ API files and confirming pattern:
```markdown
## API Architecture
API uses Express with RESTful patterns. All routes use `authenticate` middleware and return JSON.
See [api_patterns.md](api_patterns.md) for details.
```

**Duplicates of CLAUDE.md**

BAD:
```markdown
## Output Requirements
- Language: English only
```

**Why bad**: CLAUDE.md already contains project instructions. Memory is for *learned* patterns, not duplicating existing rules.

**Incomplete information**

BAD:
```markdown
## Database Schema
User table has: id, name, email, maybe password? Not sure about the other fields.
```

**Why bad**: Incomplete/uncertain information is worse than no information.

---

## 6. Memory Evolution Stages

### Stage 1: Empty (New Project)

```markdown
# MEMORY.md

Your MEMORY.md is currently empty. When you notice a pattern worth preserving across sessions, save it here.
```

**What to do**: Wait for patterns to emerge naturally through user interactions.

### Stage 2: Initial Entries (After 2-3 Sessions)

```markdown
# MEMORY.md

## User Preferences
- Always use `bun` for package management
- Prefer functional components over class components (React)

## Key Paths
- API handlers: `src/api/handlers/`
- React components: `src/components/`
- Tests: `__tests__/`

## Common Commands
- Start dev server: `bun run dev`
- Run tests: `bun test`
```

**Characteristics**:
- 10-20 lines total
- Basic preferences and paths
- No topic files yet

### Stage 3: Mature with Topic Files (After 10+ Sessions)

```markdown
# MEMORY.md

## Architecture
- Frontend: React + Vite + TypeScript
- Backend: Express + GraphQL + Prisma
- Database: PostgreSQL
- Full architecture: [architecture.md](architecture.md)

## Common Issues
- Build errors → [debugging.md#build-errors](debugging.md#build-errors)
- Test flakiness → [testing.md#ci-flakiness](testing.md#ci-flakiness)

## User Preferences
- Package manager: `bun` (never npm)
- Git workflow: feature branches + squash merge
- Testing: write tests before implementation (TDD)
```

**Characteristics**:
- 30-60 lines in MEMORY.md (well under 200 limit)
- Links to 4-6 topic files
- Clear sections with consistent structure
- Actionable links (not just references)

---

## 7. Common Mistakes

### Mistake 1: Over-Writing (Recording Everything)

**Symptom**: MEMORY.md reaches 200 lines within 2-3 sessions

**How to avoid**:
- Ask yourself: "Will this information be useful in 2 weeks?"
- Focus on patterns, not one-off facts
- Use topic files for details

### Mistake 2: Under-Writing (Not Recording Anything)

**Symptom**: MEMORY.md stays empty for 20+ sessions despite recurring issues

**How to avoid**:
- Proactively suggest writing when user solves same problem twice
- Write after confirming patterns
- Ask user: "Should I add this to memory for next time?"

### Mistake 3: Conflicting Entries

**Symptom**: MEMORY.md contains contradictory information

**Example**:
```markdown
## User Preferences
- Use npm for package management
- Always use bun instead of npm  ← CONFLICT
```

**How to avoid**:
- Always read MEMORY.md before writing
- Update existing entries rather than adding new ones
- Remove outdated entries

### Mistake 4: Not Using Topic Files

**Symptom**: MEMORY.md hits 200 lines and gets truncated

**Warning message** (auto-generated when truncated):
```
> WARNING: MEMORY.md is 250 lines (limit: 200). Only the first 200 lines were loaded.
```

**How to fix**:
1. Identify sections with >15 lines of detail
2. Extract to topic files (e.g., `debugging.md`, `patterns.md`)
3. Replace with 1-line link in MEMORY.md

### Mistake 5: Ignoring Staleness Signals (v2.1.76)

**New in v2.1.76**: The prompt header now shows `Last updated: {timestamp}`. If this is very old, memory may be stale.

**Symptom**: Memory shows packages/tools that have since been replaced

**How to avoid**:
- When the timestamp is months old, do a quick review before trusting memory
- When making major project changes, update memory files immediately

---

## 8. Examples: Good vs Bad

### Example 1: API Patterns

**BAD: Verbose, unstructured**
```markdown
I noticed the API uses Express. Looking at the code, each route is in a separate file in
src/api/. They all export a function that takes req and res. Most of them validate the
input using Joi schemas...
```

**GOOD: Concise with link**
```markdown
## API Architecture
Express REST API with route-per-file pattern. See [api_patterns.md](api_patterns.md)
```

### Example 2: User Preferences

**BAD: Implicit preferences**
```markdown
## Notes
User seems to prefer functional components. They also like TypeScript strict mode.
Maybe they want all new files to use these patterns?
```

**GOOD: Explicit confirmed preferences**
```markdown
## User Preferences
- React: Always use functional components (no class components)
- TypeScript: Enable `strict: true` in all tsconfig files
- Git commits: Use conventional commit format (feat:, fix:, docs:)
```

---

## 9. Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:

- `buildMemoryPrompt` (m0A) - Constructs memory section with guidelines and truncation warning
- `getMemoryContext` (F0A) - Reads MEMORY.md and prepares for system prompt injection
- `MEMORY_MD_FILENAME` (Ua / pN9) - Constant "MEMORY.md"
- `MEMORY_MAX_LINES` (Qu1) - Constant 200 (truncation limit)

Cross-references:

- [architecture.md](./architecture.md) - Auto memory system architecture
- [loading_mechanism.md](./loading_mechanism.md) - How MEMORY.md is loaded into system prompt
- [memory_logic.md](./memory_logic.md) - Truncation logic details
