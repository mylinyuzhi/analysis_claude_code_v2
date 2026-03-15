# Memory Maintenance - Keeping Memory Clean and Organized

> **Module**: Auto Memory - Maintenance Workflows
> **Source**: `chunks.87.mjs` (lines 2277-2292) - Truncation warning system
> **Version**: Claude Code 2.1.38

---

## Table of Contents

1. [Overview](#1-overview)
2. [Responding to Truncation Warnings](#2-responding-to-truncation-warnings)
3. [Deduplication Strategies](#3-deduplication-strategies)
4. [Outdated Entry Cleanup](#4-outdated-entry-cleanup)
5. [Conflict Resolution](#5-conflict-resolution)
6. [Topic File Refactoring](#6-topic-file-refactoring)
7. [Manual Maintenance Checklist](#7-manual-maintenance-checklist)
8. [Automated Maintenance (Future)](#8-automated-maintenance-future)
9. [Related Documents](#9-related-documents)

---

## 1. Overview

Memory requires periodic maintenance to stay useful. Over time, MEMORY.md accumulates entries that become outdated, duplicated, or overly verbose. Maintenance ensures memory stays under the 200-line limit and remains actionable.

### Maintenance Triggers

**Automatic trigger**: Truncation warning appears in system prompt
```
> WARNING: MEMORY.md is 250 lines (limit: 200). Only the first 200 lines were loaded.
> Move detailed content into separate topic files and keep MEMORY.md as a concise index.
```

**Manual triggers**:
- Regular schedule (weekly/monthly review)
- After major project changes (architecture refactor, tech stack change)
- When finding duplicate or conflicting entries
- Before sharing project with new team members

### Maintenance Philosophy

**Progressive enhancement**: Start small (MEMORY.md only), expand to topic files as needed

**Ruthless pruning**: Delete outdated info rather than archiving indefinitely

**Index over detail**: MEMORY.md should fit on one screen (200 lines ≈ 40 entries)

---

## 2. Responding to Truncation Warnings

### Truncation Warning System

When MEMORY.md exceeds 200 lines, the system automatically truncates and adds a warning:

```javascript
// From chunks.87.mjs:2277-2292
if (lineCount > 200) {
    content = lines.slice(0, 200).join("\n");
    content += `\n\n> WARNING: MEMORY.md is ${lineCount} lines (limit: 200). ` +
               `Only the first 200 lines were loaded. Move detailed content into ` +
               `separate topic files and keep MEMORY.md as a concise index.`;
}
```

**What this means**:
- Only first 200 lines are loaded into system prompt
- Lines 201+ are lost (not visible to agent)
- Warning appears at end of loaded content

### Response Workflow

**Step 1: Read full MEMORY.md**

```bash
# Check current line count
wc -l ~/.claude/projects/{project-hash}/memory/MEMORY.md

# Expected output: 250 MEMORY.md (example)
```

**Step 2: Identify verbose sections**

Look for sections with >15 lines that could be extracted:
```markdown
## Common Issues   ← 45 lines of detailed error descriptions
## Architecture    ← 30 lines of detailed decisions
## User Preferences ← 10 lines (OK, keep in MEMORY.md)
```

**Step 3: Extract to topic files**

Create topic files for verbose sections:

```bash
# Create debugging.md for "Common Issues"
# Create architecture.md for "Architecture"
```

**Step 4: Replace with concise links in MEMORY.md**

```markdown
# MEMORY.md

## Common Issues
- Build errors → [debugging.md#build-errors](debugging.md#build-errors)
- Test failures → [debugging.md#test-failures](debugging.md#test-failures)
- Runtime issues → [debugging.md#runtime](debugging.md#runtime)

## Architecture
Full architecture decisions documented in [architecture.md](architecture.md)

Key decisions:
- Database: PostgreSQL with Prisma
- API: GraphQL (Apollo Server)
- Frontend: React + Vite + TypeScript

## User Preferences
- Package manager: `bun` (never npm)
- Git workflow: feature branches + squash merge
- Testing: TDD approach, write tests first
```

**Result**: 250 lines → 60 lines, all content preserved in topic files

### Example: Full Refactor

**Before** (250 lines, truncated at 200):

```markdown
# MEMORY.md

## Common Issues

### Build Error: ENOENT module not found

**Symptom**: Build fails with "ENOENT: cannot find module '@/components/Button'"

**Cause**: TypeScript path aliases not configured in tsconfig.json

**Solution**:
1. Open tsconfig.json
2. Add to compilerOptions:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": { "@/*": ["./src/*"] }
     }
   }
   ```
3. Restart TS server

**Prevention**: Always configure path aliases when creating new project

[... 40 more lines of detailed error solutions ...]

### Runtime Error: Hydration mismatch

[... 30 lines ...]

### Test Failure: CI passes locally, fails in GitHub Actions

[... 25 lines ...]

## Architecture Decisions

### Use GraphQL instead of REST

**Date**: 2024-02-15

**Context**: Frontend needs flexible data fetching...

[... 80 more lines of architecture decisions ...]

## User Preferences

- Use bun for package management
- Prefer functional components
- Always write tests before implementation

[End of 200-line limit - rest truncated]
```

**After** (55 lines, fully loaded):

```markdown
# MEMORY.md

## Common Issues

For detailed troubleshooting, see [debugging.md](debugging.md)

Quick reference:
- Build errors (ENOENT, out of memory) → [debugging.md#build-errors](debugging.md#build-errors)
- Runtime errors (hydration, API failures) → [debugging.md#runtime-errors](debugging.md#runtime-errors)
- Test failures (CI vs local, flaky tests) → [debugging.md#test-failures](debugging.md#test-failures)

## Architecture

Full decisions documented in [architecture.md](architecture.md)

Key choices:
- Database: PostgreSQL + Prisma ORM
- API: GraphQL (Apollo Server)
- Frontend: React + Vite + TypeScript
- Testing: Vitest (unit), Playwright (E2E)

Rationale summaries:
- GraphQL: Flexible queries, single endpoint, type safety
- Prisma: Type-safe DB access, migration management
- Vitest: Faster than Jest, compatible API

## User Preferences

- Package manager: `bun` (never `npm` or `yarn`)
- Git workflow: Feature branches → PR → squash merge to main
- Commit style: Conventional commits (feat:, fix:, docs:)
- Testing: TDD approach - write tests before implementation
- Code style: Follow existing patterns, no premature abstraction

## Project Structure

```
src/
├── api/          # GraphQL resolvers
├── components/   # React components
├── lib/          # Utilities
└── prisma/       # Database schema
```

See [architecture.md#file-structure](architecture.md#file-structure) for details.

## Key Commands

- Start dev: `bun run dev`
- Run tests: `bun test`
- Build: `bun run build`
- Database migrate: `bun run db:migrate`
- Generate types: `bun run codegen`

Full command reference: [commands.md](commands.md)
```

**Topic files created**:
- `debugging.md` (150 lines) - All error solutions moved here
- `architecture.md` (120 lines) - Full architecture decisions with rationale
- `commands.md` (40 lines) - Complete command reference

**Result**: 55 lines in MEMORY.md, 310 lines total across all files (fully accessible)

---

## 3. Deduplication Strategies

### Identifying Duplicates

**Grep for similar entries**:

```bash
cd ~/.claude/projects/{hash}/memory/

# Search for duplicate "database" mentions
grep -n "database" MEMORY.md architecture.md

# Search for duplicate error solutions
grep -n "ENOENT" MEMORY.md debugging.md
```

**Common duplication patterns**:

**Pattern 1: Same info in MEMORY.md and topic file**
```markdown
# MEMORY.md
## Database
We use PostgreSQL with Prisma ORM. Schema in prisma/schema.prisma.

# architecture.md
## Database Choice
We use PostgreSQL with Prisma ORM. Schema located at prisma/schema.prisma.
```

**Fix**: Keep only in topic file, link from MEMORY.md
```markdown
# MEMORY.md
## Database
PostgreSQL + Prisma. See [architecture.md#database](architecture.md#database)
```

**Pattern 2: Repeated solutions for same error**
```markdown
# debugging.md
## Build Errors
### ENOENT: module not found
[Solution A]

## Runtime Errors
### Module resolution issues
[Same solution again]
```

**Fix**: Consolidate to single authoritative section
```markdown
# debugging.md
## Module Resolution Issues

### ENOENT: module not found

**Applies to**: Build errors, runtime errors, test imports

[Single unified solution]
```

### Deduplication Workflow

**Step 1: Find duplicates**

Read all memory files, note repeated information

**Step 2: Choose canonical location**

- Detailed solutions → topic files (debugging.md, architecture.md)
- Quick references → MEMORY.md
- If same detail in multiple topic files → create new shared section

**Step 3: Consolidate**

Merge duplicate entries, keep most complete/recent version

**Step 4: Update links**

Ensure MEMORY.md links point to consolidated location

### Example: Consolidating Database Info

**Before** (duplicated across 3 files):

```markdown
# MEMORY.md (15 lines)
## Database
We use PostgreSQL version 14 with Prisma ORM version 5.
Schema is in prisma/schema.prisma.
Migrations in prisma/migrations/.
To run migrations: bun run db:migrate
To seed: bun run db:seed
Connection string in .env as DATABASE_URL.

# architecture.md (20 lines)
## Database Decision
Decision: PostgreSQL 14 with Prisma 5
Rationale: Need ACID transactions, complex queries, type safety
Schema location: prisma/schema.prisma
Migration commands: bun run db:migrate, bun run db:rollback

# commands.md (10 lines)
## Database Commands
- Migrate: bun run db:migrate
- Rollback: bun run db:rollback
- Seed: bun run db:seed
- Studio: bun run db:studio
```

**After** (consolidated):

```markdown
# MEMORY.md (3 lines)
## Database
PostgreSQL + Prisma. See [architecture.md#database](architecture.md#database) for decisions.
Commands: [commands.md#database](commands.md#database)

# architecture.md (25 lines - single source of truth for decisions)
## Database Decision

**Choice**: PostgreSQL 14 with Prisma ORM 5

**Rationale**:
- ACID transactions for payments
- Complex relational queries (user ↔ posts ↔ comments)
- Prisma provides type-safe queries and migrations

**Schema**: `prisma/schema.prisma`

**Key models**: User, Post, Comment, Session

For commands, see [commands.md#database](commands.md#database)

# commands.md (12 lines - single source of truth for commands)
## Database Commands

- **Migrate**: `bun run db:migrate` - Apply pending migrations
- **Rollback**: `bun run db:rollback` - Undo last migration
- **Seed**: `bun run db:seed` - Populate with test data
- **Studio**: `bun run db:studio` - Open Prisma Studio UI
- **Generate**: `bun run db:generate` - Regenerate Prisma client

**Note**: Always run `db:generate` after schema changes.
```

---

## 4. Outdated Entry Cleanup

### Detecting Outdated Entries

**Indicators of outdated content**:
- References to removed dependencies (e.g., "Use Webpack" after switching to Vite)
- Solutions for errors that no longer occur
- Architecture decisions that were reversed
- Commands that no longer exist

**Verification methods**:

```bash
# Check if dependency still exists
grep "webpack" package.json  # Returns nothing → outdated

# Check if file path still valid
ls src/components/old-component.tsx  # File not found → outdated

# Check if command still works
bun run old-command  # Script not found → outdated
```

### Cleanup Strategies

**Strategy 1: Delete completely** (Recommended for most cases)

If information is no longer relevant and unlikely to be needed:
```markdown
# MEMORY.md - BEFORE
## Build Process
We use Webpack for bundling. Config in webpack.config.js.

# MEMORY.md - AFTER
[Entry removed - we now use Vite]
```

**Strategy 2: Archive** (For historical context)

If information may be useful for understanding past decisions:
```markdown
# architecture.md - BEFORE
## Bundler Choice: Webpack
[Outdated decision from 2020]

# architecture.md - AFTER
## Bundler Choice: Vite (Current)
[Current decision]

**Previous**: Used Webpack (2020-2023). Migrated to Vite in v2.0 for faster builds.
See [archived/webpack-migration.md](archived/webpack-migration.md) for migration notes.
```

Create `archived/` subdirectory for historical content:
```
memory/
├── MEMORY.md
├── debugging.md
├── architecture.md
└── archived/
    └── webpack-migration.md
```

**Strategy 3: Update in place** (For evolving information)

If core concept remains but details changed:
```markdown
# MEMORY.md - BEFORE
## API Endpoint
API at http://localhost:3000/api

# MEMORY.md - AFTER
## API Endpoint
API at https://api.myapp.com (production) or http://localhost:3000/api (local)

**Updated**: 2024-03-15 - Added production URL after deployment
```

### Cleanup Workflow

**Step 1: Review memory files monthly**

Set calendar reminder: "Review memory files" (monthly)

**Step 2: Check each entry for relevance**

Ask: "Is this still true? Would I reference this today?"

**Step 3: Test solutions**

For error solutions, verify they still work:
```bash
# Try the documented solution
# If it works → keep
# If it fails or is unnecessary → update or remove
```

**Step 4: Remove or archive**

Delete obsolete entries, archive if historical value

**Step 5: Update timestamps**

Add "Last verified: YYYY-MM-DD" to important entries

---

## 5. Conflict Resolution

### Detecting Conflicts

**Conflicting entries** occur when:
- Different solutions for same problem
- Contradictory user preferences
- Outdated info conflicts with current practice

**Example conflicts**:

```markdown
# MEMORY.md
## Package Manager
- Use npm for package management   ← Added in January
- Always use bun instead of npm    ← Added in March (CONFLICT!)

## Testing Strategy
- Write tests after implementation  ← Old preference
- TDD: write tests first           ← New preference (CONFLICT!)
```

### Resolution Strategies

**Strategy 1: Keep most recent** (For preferences that evolved)

```markdown
# BEFORE
## Package Manager
- Use npm for package management
- Always use bun instead of npm

# AFTER
## Package Manager
- Package manager: `bun` (switched from npm in March 2024)
```

**Strategy 2: Merge compatible info** (For complementary details)

```markdown
# BEFORE
## API Error Handling
- Return { error: string } for errors
- Use HTTP status codes properly

# AFTER
## API Error Handling
Return { error: string } with appropriate HTTP status codes:
- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing/invalid auth
- 500 Server Error: Unexpected failures
```

**Strategy 3: Preserve both with context** (For situation-dependent choices)

```markdown
# BEFORE (contradictory)
## State Management
- Use Redux for state
- Use React Context for state

# AFTER (clarified)
## State Management
- **Global app state** (auth, theme): React Context
- **Complex data** (normalized, time-travel): Redux
- **Local component state**: useState

**Decision**: Use simplest solution for the use case. Context for most cases, Redux only if needed.
```

### Conflict Resolution Workflow

**Step 1: Identify conflicting entries**

Read memory files, flag contradictions

**Step 2: Determine which is current**

- Check git history: Which entry is newer?
- Verify in code: Which approach is actually used?
- Ask user if uncertain

**Step 3: Resolve**

- Delete outdated entry, OR
- Merge compatible info, OR
- Clarify with context

**Step 4: Document resolution**

Add note explaining why conflict occurred:
```markdown
## Testing Strategy
- **Current**: TDD - write tests before implementation
- **Previous**: Wrote tests after (changed to TDD in Feb 2024 after team discussion)
```

---

## 6. Topic File Refactoring

### When to Refactor

**Trigger 1**: Topic file exceeds 150 lines

**Trigger 2**: Topic file covers multiple distinct themes

**Trigger 3**: Navigating topic file becomes difficult

### Refactoring Strategies

**Strategy 1: Split by theme**

```markdown
# BEFORE: debugging.md (200 lines, mixed themes)
## Build Errors
[30 lines]
## Runtime Errors
[40 lines]
## Database Issues
[35 lines]
## Test Failures
[40 lines]
## Performance Problems
[35 lines]
## Deployment Issues
[20 lines]

# AFTER: Split into focused files
# debugging_build.md (30 lines) - Build errors only
# debugging_runtime.md (40 lines) - Runtime errors only
# debugging_database.md (35 lines) - Database issues
# debugging_tests.md (40 lines) - Test failures
# performance.md (35 lines) - Performance problems
# deployment.md (20 lines) - Deployment issues

# MEMORY.md updated with new links
## Debugging
- Build errors → [debugging_build.md](debugging_build.md)
- Runtime errors → [debugging_runtime.md](debugging_runtime.md)
- Database issues → [debugging_database.md](debugging_database.md)
- Test failures → [debugging_tests.md](debugging_tests.md)
- Performance → [performance.md](performance.md)
- Deployment → [deployment.md](deployment.md)
```

**Strategy 2: Extract growing sections**

```markdown
# BEFORE: architecture.md (180 lines)
## Database Decision (25 lines)
## API Design (30 lines)
## Frontend Architecture (35 lines)
## Authentication (40 lines)  ← Growing, extract
## Deployment Strategy (50 lines)  ← Growing, extract

# AFTER: Extract large sections
# architecture.md (60 lines) - High-level overview + links
# auth_architecture.md (45 lines) - Auth details extracted
# deployment_architecture.md (55 lines) - Deployment details extracted

# architecture.md now:
## Architecture Overview

High-level decisions:
- Database: PostgreSQL + Prisma
- API: GraphQL (Apollo)
- Frontend: React + Vite
- Authentication: [auth_architecture.md](auth_architecture.md)
- Deployment: [deployment_architecture.md](deployment_architecture.md)
```

**Strategy 3: Create hierarchy**

```markdown
# BEFORE: Flat structure
memory/
├── MEMORY.md
├── patterns.md (150 lines, too broad)
└── debugging.md

# AFTER: Hierarchical structure
memory/
├── MEMORY.md
├── patterns/
│   ├── README.md (index of patterns)
│   ├── react_patterns.md
│   ├── api_patterns.md
│   └── database_patterns.md
└── debugging.md

# MEMORY.md updated
## Code Patterns
See [patterns/README.md](patterns/README.md) for full pattern library.

Quick links:
- React → [patterns/react_patterns.md](patterns/react_patterns.md)
- API → [patterns/api_patterns.md](patterns/api_patterns.md)
- Database → [patterns/database_patterns.md](patterns/database_patterns.md)
```

---

## 7. Manual Maintenance Checklist

### Weekly Quick Check (5 minutes)

- [ ] Check MEMORY.md line count: `wc -l MEMORY.md`
  - [ ] If >180 lines: Flag for refactoring
- [ ] Scan for obvious duplicates (same entry repeated)
- [ ] Check for obsolete references (old dependency names, removed files)

### Monthly Deep Clean (30 minutes)

- [ ] Read entire MEMORY.md top to bottom
- [ ] Verify each entry is still accurate:
  - [ ] Test solutions still work
  - [ ] Commands still valid
  - [ ] File paths still exist
  - [ ] Preferences still current
- [ ] Check for conflicts (contradictory entries)
- [ ] Review all topic files:
  - [ ] Any exceeding 150 lines? → Split or prune
  - [ ] Duplicate content across files? → Consolidate
  - [ ] Outdated sections? → Update or remove
- [ ] Update timestamps on critical entries
- [ ] Verify all links work (no broken references)

### Quarterly Audit (1-2 hours)

- [ ] Review memory against actual codebase:
  - [ ] Do documented patterns match current code?
  - [ ] Are architecture decisions still valid?
  - [ ] Have preferences evolved?
- [ ] Interview yourself:
  - [ ] What did I reference this quarter?
  - [ ] What was missing when I needed it?
  - [ ] What was outdated or confusing?
- [ ] Major refactoring if needed:
  - [ ] Reorganize topic files by new themes
  - [ ] Archive obsolete content
  - [ ] Create new topic files for emerging patterns
- [ ] Backup memory directory:
  ```bash
  cp -r ~/.claude/projects/{hash}/memory/ ~/memory-backup-$(date +%Y%m%d)/
  ```

### Annual Review (2-4 hours)

- [ ] Full memory overhaul:
  - [ ] Delete all obsolete content
  - [ ] Consolidate all duplicates
  - [ ] Refactor topic files for clarity
  - [ ] Verify every solution and command
- [ ] Compare to project evolution:
  - [ ] Major architecture changes reflected?
  - [ ] Tech stack updates documented?
  - [ ] Team preferences current?
- [ ] Optimize for new patterns:
  - [ ] Identify recurring themes from past year
  - [ ] Create new topic files for new domains
  - [ ] Update templates if needed
- [ ] Document maintenance history:
  - [ ] Create `memory/maintenance_log.md`
  - [ ] Note: Date, changes made, rationale

---

## 8. Automated Maintenance (Future)

### Potential Automation

**Auto-detect duplicates**:
```bash
# Script to find similar entries
rg "database" memory/ --json | jq '.data.lines.text' | sort | uniq -c | sort -rn
```

**Auto-verify commands**:
```bash
# Test all documented commands still work
grep -E "^\- \`.*\`" MEMORY.md | while read cmd; do
  # Extract command, try running
  # Report failures
done
```

**Auto-archive old content**:
```javascript
// Mark entries with timestamps, archive if >1 year old and not referenced
const entries = parseMemoryFile('MEMORY.md');
const oldEntries = entries.filter(e =>
  e.lastVerified && Date.now() - e.lastVerified > 365 * 24 * 60 * 60 * 1000
);
// Move to archived/
```

**Link checker**:
```bash
# Find broken links in memory files
find memory/ -name "*.md" -exec \
  grep -oE '\[.*\]\(.*\.md[^\)]*\)' {} \; | \
  # Check if linked file exists
```

---

## 9. Related Documents

> Cross-references:
> - [usage_patterns.md](./usage_patterns.md) - When to write memory, common mistakes
> - [topic_file_templates.md](./topic_file_templates.md) - Templates for organizing extracted content
> - [multi_agent_memory.md](./multi_agent_memory.md) - Memory in team scenarios
> - [architecture.md](./architecture.md) - Auto memory system architecture
