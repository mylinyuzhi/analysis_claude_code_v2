# Auto Memory Usage Patterns - Best Practices and Common Mistakes

> **Module**: Auto Memory - Usage Guidelines
> **Source**: `chunks.87.mjs` (lines 2257-2296), System prompt guidelines
> **Version**: Claude Code 2.1.38

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

**✅ GOOD: Concise entries with links**

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

**❌ BAD: Verbose entries without structure**

```markdown
# Project Memory

I noticed that the API is using GraphQL. The user mentioned this several times and it seems
like the right choice for this project. GraphQL allows for flexible queries and reduces
over-fetching compared to REST. The schema is defined in schema.graphql and the resolvers
are in src/resolvers/. We're using Apollo Server v3 with Express middleware. The GraphQL
endpoint is at /graphql and accepts POST requests with query and variables in the body.
Authentication is handled via JWT tokens passed in the Authorization header...

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

### Sections to Include

**Standard sections** (customize as needed):
- **Architecture Decisions** - High-level tech choices
- **Common Issues** - Recurring problems and their solutions
- **User Preferences** - Workflow and style preferences
- **Key File Paths** - Important directories and configs
- **Project Conventions** - Naming, formatting, patterns

---

## 3. Topic File Organization

### By Domain (Recommended)

Organize topic files by functional area:

```
memory/
├── MEMORY.md           # Index (< 200 lines)
├── architecture.md     # High-level architecture decisions
├── debugging.md        # Troubleshooting guides
├── patterns.md         # Code patterns and conventions
├── testing.md          # Testing strategies
└── deployment.md       # Deployment procedures
```

**Example: debugging.md structure**

```markdown
# Debugging Guide

## Build Errors

### ENOENT: no such file or directory

**Symptom**: Build fails with "ENOENT: no such file or directory, open '/path/to/file'"

**Cause**: Missing generated files or incorrect working directory

**Solution**:
1. Run `bun run codegen` to regenerate files
2. Check that `cwd` is project root
3. Verify `.env` file exists with required vars

### Module not found

**Symptom**: `Error: Cannot find module '@/components/Button'`

**Cause**: TypeScript path mapping not configured

**Solution**: Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Test Failures

### CI Flakiness

**Symptom**: Tests pass locally but fail in CI intermittently

**Root causes**:
- Race conditions in async tests
- Missing test data setup
- Timing-dependent assertions

**Fixes**:
- Use `waitFor` instead of fixed delays
- Reset database between test suites
- Add retries for known-flaky tests
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

### By Problem Type

For projects with recurring issues:

```
memory/
├── MEMORY.md
├── common_errors.md       # Known errors and fixes
├── performance_notes.md   # Performance optimization notes
├── security_checklist.md  # Security review checklist
└── migration_guide.md     # Version upgrade notes
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

→ **Write to patterns.md**:
```markdown
## API Handler Patterns

### Error Response Format
All API errors use this structure:
```typescript
{
  error: {
    code: "ERROR_CODE",
    message: "Human-readable message",
    details?: Record<string, unknown>
  }
}
```
```

### Content to Save

**Architecture decisions**
```markdown
## Architecture Decisions

### Database Choice: PostgreSQL over MongoDB
**Context**: Need complex queries with joins, ACID transactions
**Decision**: PostgreSQL with Prisma ORM
**Date**: 2024-03-15
**Consequences**: Strong consistency, harder to scale horizontally
```

**User workflow preferences**
```markdown
## User Preferences

### Git Workflow
- Always create feature branches (never commit directly to main)
- Squash commits before merging
- Use conventional commit messages (feat:, fix:, docs:)
```

**Recurring solutions**
```markdown
## Common Fixes

### Docker build failing with cache issues
Run: `docker build --no-cache -t app:latest .`
```

---

## 5. When NOT to Write Memory

### Anti-Patterns

**❌ Session-specific details**

BAD:
```markdown
## Current Work
- User asked me to implement login page
- I created LoginForm.tsx in src/components/auth/
- Tests are in __tests__/LoginForm.test.tsx
- Need to add password validation next
```

**Why bad**: This is session state, not persistent knowledge. Will be stale next session.

**✅ BETTER**: Don't write anything unless a reusable pattern emerges

---

**❌ Speculative conclusions from one file**

BAD:
```markdown
## API Architecture
Based on reading src/api/users.ts, the API uses RESTful patterns with Express.
All routes return JSON and use middleware for auth.
```

**Why bad**: Conclusion based on one file. May not apply to entire codebase.

**✅ BETTER**: After reading 5+ API files and confirming pattern:
```markdown
## API Architecture
API uses Express with RESTful patterns. All routes use `authenticate` middleware and return JSON.
See [api_patterns.md](api_patterns.md) for details.
```

---

**❌ Duplicates of CLAUDE.md**

BAD:
```markdown
## Output Requirements
- Language: English only
- Use clear variable names
- Follow existing code style
```

**Why bad**: CLAUDE.md already contains project instructions. Memory is for *learned* patterns, not duplicating existing rules.

**✅ BETTER**: Only add if it's a project-specific extension:
```markdown
## Project Conventions
- Variable names use `camelCase` (not snake_case) - extends CLAUDE.md style guide
- Exception: Database column names use `snake_case` to match Postgres conventions
```

---

**❌ Incomplete information**

BAD:
```markdown
## Database Schema
User table has: id, name, email, maybe password? Not sure about the other fields.
```

**Why bad**: Incomplete/uncertain information is worse than no information.

**✅ BETTER**: Wait until you've read the schema file, then write:
```markdown
## Database Schema
User table: id (uuid), name (text), email (text unique), password_hash (text), created_at (timestamp)
See [prisma_schema.md](prisma_schema.md) for full schema.
```

---

**❌ Temporary workarounds**

BAD:
```markdown
## Current Issues
Tests are failing due to missing env vars. Using dummy values for now.
```

**Why bad**: Temporary state that will be fixed soon. Not persistent knowledge.

**✅ BETTER**: After fixing, write:
```markdown
## Testing Setup
Tests require env vars: `DATABASE_URL`, `API_KEY`, `JWT_SECRET`
Create `.env.test` with these values. See [testing.md#setup](testing.md#setup)
```

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
- Build: `bun run build`
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
- GraphQL schema changes → [graphql_patterns.md#schema-updates](graphql_patterns.md#schema-updates)

## User Preferences
- Package manager: `bun` (never npm)
- Git workflow: feature branches + squash merge
- Commit style: conventional commits (feat:, fix:)
- Testing: write tests before implementation (TDD)

## Project Conventions
- API error format: [api_patterns.md#errors](api_patterns.md#errors)
- Component structure: [react_patterns.md#component-structure](react_patterns.md#component-structure)
- Database migrations: [prisma_schema.md#migrations](prisma_schema.md#migrations)

## Key Files
- GraphQL schema: `src/schema/schema.graphql`
- Prisma schema: `prisma/schema.prisma`
- API entry: `src/api/index.ts`
- Frontend entry: `src/main.tsx`
```

**Characteristics**:
- 30-60 lines in MEMORY.md (well under 200 limit)
- Links to 4-6 topic files
- Clear sections with consistent structure
- Actionable links (not just references)

**Topic files**:
- `debugging.md` (80 lines) - Troubleshooting guides
- `testing.md` (60 lines) - Testing strategies
- `api_patterns.md` (100 lines) - API conventions
- `react_patterns.md` (90 lines) - React best practices
- `graphql_patterns.md` (70 lines) - GraphQL patterns
- `architecture.md` (120 lines) - Architecture decisions

---

## 7. Common Mistakes

### Mistake 1: Over-Writing (Recording Everything)

**Symptom**: MEMORY.md reaches 200 lines within 2-3 sessions

**Why it happens**: Agent wants to be thorough and records every detail

**How to avoid**:
- Ask yourself: "Will this information be useful in 2 weeks?"
- Focus on patterns, not one-off facts
- Use topic files for details

**Example of over-writing**:
```markdown
# Bad: Too much detail in MEMORY.md

## Session 2024-03-15
User asked me to create a button component. I created Button.tsx with these props:
- label (string) - The button text
- onClick (function) - Click handler
- variant ("primary" | "secondary") - Visual style
- disabled (boolean) - Whether button is disabled

The component uses Tailwind CSS classes. Primary buttons are blue, secondary are gray.
I also created Button.test.tsx with 5 test cases...
```

**Better approach**: Only write if pattern emerges across multiple components.

### Mistake 2: Under-Writing (Not Recording Anything)

**Symptom**: MEMORY.md stays empty for 20+ sessions despite recurring issues

**Why it happens**: Agent waits for explicit "remember this" command

**How to avoid**:
- Proactively suggest writing when user solves same problem twice
- Write after confirming patterns
- Ask user: "Should I add this to memory for next time?"

**Example of when to write**:
```
Session 1: User fixes "module not found" by adding to tsconfig paths
Session 2: Same error, user says "oh right, the paths thing again"

→ Agent should write to debugging.md:
```markdown
### Module Not Found Error
**Fix**: Add path mappings to `tsconfig.json` `compilerOptions.paths`
```

### Mistake 3: Conflicting Entries

**Symptom**: MEMORY.md contains contradictory information

**Example**:
```markdown
## User Preferences
- Use npm for package management
- Always use bun instead of npm  ← CONFLICT
```

**How it happens**:
- User preference changed over time
- Agent added new entry without checking existing

**How to avoid**:
- Always read MEMORY.md before writing
- Update existing entries rather than adding new ones
- Remove outdated entries

**Fix**:
```markdown
## User Preferences
- Package manager: `bun` (switched from npm as of 2024-03-15)
```

### Mistake 4: Not Using Topic Files

**Symptom**: MEMORY.md hits 200 lines and gets truncated

**Why it happens**: Agent puts everything in MEMORY.md instead of extracting to topic files

**Warning message** (auto-generated when truncated):
```
> WARNING: MEMORY.md is 250 lines (limit: 200). Only the first 200 lines were loaded.
> Move detailed content into separate topic files and keep MEMORY.md as a concise index.
```

**How to fix**:
1. Identify sections with >15 lines of detail
2. Extract to topic files (e.g., `debugging.md`, `patterns.md`)
3. Replace with 1-line link in MEMORY.md

**Example refactoring**:

**Before (180 lines in MEMORY.md)**:
```markdown
## Debugging React Issues

### Hydration Mismatch
This happens when server-rendered HTML doesn't match client-rendered output.
Common causes:
1. Using Date.now() or Math.random() in render
2. Browser-only APIs (localStorage, window) in SSR
3. Mismatched whitespace

To fix:
- Move dynamic values to useEffect
- Use suppressHydrationWarning for intentional mismatches
- Check for typeof window !== 'undefined' before using browser APIs

Example:
```jsx
// Bad
function Component() {
  return <div>{Date.now()}</div>  // Different on server/client
}

// Good
function Component() {
  const [now, setNow] = useState(null);
  useEffect(() => { setNow(Date.now()) }, []);
  return <div>{now}</div>
}
```

[... 150 more lines of React debugging ...]
```

**After (40 lines in MEMORY.md + 160 lines in react_debugging.md)**:

```markdown
# MEMORY.md

## Debugging
- React issues → [react_debugging.md](react_debugging.md)
  - Hydration mismatches
  - useState/useEffect patterns
  - Performance optimization
```

```markdown
# react_debugging.md

# React Debugging Guide

## Hydration Mismatch
[Full content from above - 80 lines]

## useState Patterns
[Additional patterns - 80 lines]
```

### Mistake 5: Session Transcripts in Memory

**Bad practice**: Copying conversation logs into memory

```markdown
## Session 2024-03-15

User: Can you fix the login bug?
Assistant: Sure, I'll check the LoginForm component.
[reads LoginForm.tsx]
Assistant: I found the issue - missing validation on the password field.
User: Great, can you add that?
[writes code]
```

**Why bad**: This is session-specific, not reusable knowledge

**Better**: Extract the pattern:
```markdown
## Common Issues
- Login form missing password validation → added length check (min 8 chars)
```

---

## 8. Examples: Good vs Bad

### Example 1: API Patterns

**❌ BAD: Verbose, unstructured**
```markdown
I noticed the API uses Express. Looking at the code, each route is in a separate file in
src/api/. They all export a function that takes req and res. Most of them validate the
input using Joi schemas. Errors are caught by a try-catch and returned as JSON with a
status code. The user mentioned they prefer this pattern over throwing errors...
```

**✅ GOOD: Concise with link**
```markdown
## API Architecture
Express REST API with route-per-file pattern. See [api_patterns.md](api_patterns.md)
```

**api_patterns.md**:
```markdown
# API Patterns

## Route Structure
Each route in separate file: `src/api/routes/{entity}.ts`

### Template
```typescript
import { Request, Response } from 'express';
import Joi from 'joi';

const schema = Joi.object({ /* validation */ });

export async function handler(req: Request, res: Response) {
  try {
    const data = await schema.validateAsync(req.body);
    const result = await service.process(data);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
```

## Error Handling
Never throw errors - always catch and return JSON with appropriate status code.
```

### Example 2: Debugging Steps

**❌ BAD: In MEMORY.md**
```markdown
## Fixing Test Failures

When tests fail in CI but pass locally:
1. Check if it's a timing issue
2. Look for race conditions in async code
3. Verify test data is properly seeded
4. Check if tests clean up after themselves
5. Try adding waitFor instead of fixed delays
6. Check env vars are set in CI
7. Look at CI logs for differences
8. Try running tests in --verbose mode
9. Check if it's a flaky test
10. Add retries for flaky tests
[... 30 more lines ...]
```

**✅ GOOD: Link from MEMORY.md**
```markdown
## Debugging
- CI test failures → [testing.md#ci-debugging](testing.md#ci-debugging)
```

**testing.md**:
```markdown
# Testing Guide

## CI Debugging

### Tests Pass Locally But Fail in CI

**Quick checklist**:
1. ✅ Env vars set in CI? (Check `.github/workflows/` or CI config)
2. ✅ Database seeded? (Run seed script in CI setup)
3. ✅ Timing issues? (Replace `setTimeout` with `waitFor`)
4. ✅ Race conditions? (Add proper cleanup in `afterEach`)

**Common causes**:
- **Different Node version**: CI uses older Node → add `engines` field to package.json
- **Missing env vars**: Copy `.env.example` to CI secrets
- **Flaky tests**: Known flaky → add to retry list in jest.config.js
```

### Example 3: User Preferences

**❌ BAD: Implicit preferences**
```markdown
## Notes
User seems to prefer functional components. They also like TypeScript strict mode.
Maybe they want all new files to use these patterns?
```

**✅ GOOD: Explicit confirmed preferences**
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
