# Memory Maintenance - Keeping Memory Clean and Organized

> **Module**: Auto Memory - Maintenance Workflows
> **Source**: `chunks.87.mjs` (lines 2277-2292) - Truncation warning system
> **Version**: Claude Code v2.1.76

---

## Table of Contents

1. [Overview](#1-overview)
2. [Responding to Truncation Warnings](#2-responding-to-truncation-warnings)
3. [Deduplication Strategies](#3-deduplication-strategies)
4. [Outdated Entry Cleanup](#4-outdated-entry-cleanup)
5. [Conflict Resolution](#5-conflict-resolution)
6. [Topic File Refactoring](#6-topic-file-refactoring)
7. [Freshness-Based Maintenance (v2.1.76)](#7-freshness-based-maintenance-v2176)
8. [Manual Maintenance Checklist](#8-manual-maintenance-checklist)
9. [Automated Maintenance (Future)](#9-automated-maintenance-future)
10. [Related Documents](#10-related-documents)

---

## 1. Overview

Memory requires periodic maintenance to stay useful. Over time, MEMORY.md accumulates entries that become outdated, duplicated, or overly verbose. Maintenance ensures memory stays under the 200-line limit and remains actionable.

### Maintenance Triggers

**Automatic trigger**: Truncation warning appears in system prompt
```
> WARNING: MEMORY.md is 250 lines (limit: 200). Only the first 200 lines were loaded.
> Move detailed content into separate topic files and keep MEMORY.md as a concise index.
```

**Freshness trigger** (v2.1.76): Last-modified timestamp visible in prompt header
```
> Last updated: 2025-11-01T09:22:15.000Z  (old)
→ Agent may suggest reviewing/updating memory
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

## Architecture
Full architecture decisions documented in [architecture.md](architecture.md)

Key decisions:
- Database: PostgreSQL with Prisma
- API: GraphQL (Apollo Server)
- Frontend: React + Vite + TypeScript

## User Preferences
- Package manager: `bun` (never npm)
- Git workflow: feature branches + squash merge
```

**Result**: 250 lines → 60 lines, all content preserved in topic files

---

## 3. Deduplication Strategies

### Identifying Duplicates

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
## Module Resolution Issues

**Applies to**: Build errors, runtime errors, test imports

[Single unified solution]
```

### Deduplication Workflow

**Step 1: Find duplicates** - Read all memory files, note repeated information

**Step 2: Choose canonical location**
- Detailed solutions → topic files (debugging.md, architecture.md)
- Quick references → MEMORY.md
- If same detail in multiple topic files → create new shared section

**Step 3: Consolidate** - Merge duplicate entries, keep most complete/recent version

**Step 4: Update links** - Ensure MEMORY.md links point to consolidated location

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
```
memory/
├── MEMORY.md
├── debugging.md
├── architecture.md
└── archived/
    └── webpack-migration.md
```

**Strategy 3: Update in place** (For evolving information)

```markdown
## API Endpoint
API at https://api.myapp.com (production) or http://localhost:3000/api (local)

**Updated**: 2026-03-15 - Added production URL after deployment
```

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
```

### Resolution Strategies

**Strategy 1: Keep most recent** (For preferences that evolved)

```markdown
## Package Manager
- Package manager: `bun` (switched from npm in March 2024)
```

**Strategy 2: Merge compatible info** (For complementary details)

```markdown
## API Error Handling
Return { error: string } with appropriate HTTP status codes:
- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing/invalid auth
- 500 Server Error: Unexpected failures
```

**Strategy 3: Preserve both with context** (For situation-dependent choices)

```markdown
## State Management
- **Global app state** (auth, theme): React Context
- **Complex data** (normalized, time-travel): Redux
- **Local component state**: useState
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
## Build Errors [30 lines]
## Runtime Errors [40 lines]
## Database Issues [35 lines]
## Test Failures [40 lines]

# AFTER: Split into focused files
# debugging_build.md (30 lines)
# debugging_runtime.md (40 lines)
# debugging_database.md (35 lines)
# debugging_tests.md (40 lines)

# MEMORY.md updated with new links
## Debugging
- Build → [debugging_build.md](debugging_build.md)
- Runtime → [debugging_runtime.md](debugging_runtime.md)
- Database → [debugging_database.md](debugging_database.md)
```

**Strategy 2: Create hierarchy**

```
memory/
├── MEMORY.md
├── patterns/
│   ├── README.md  (index of patterns)
│   ├── react_patterns.md
│   ├── api_patterns.md
│   └── database_patterns.md
└── debugging.md
```

---

## 7. Freshness-Based Maintenance (v2.1.76)

### Using Timestamps to Guide Maintenance

In v2.1.76, the memory prompt header includes a `Last updated` timestamp. Agents and users can use this to decide when maintenance is needed:

**Freshness indicators**:
```
> Last updated: 2026-03-14T10:30:00.000Z  → Current (today)
> Last updated: 2026-02-01T08:15:00.000Z  → Slightly old (6 weeks)
> Last updated: 2025-09-15T12:00:00.000Z  → Stale (6 months old)
```

**Agent behavior based on freshness**:

1. **Current (< 1 week)**: Trust memory, no maintenance needed
2. **Recent (1-4 weeks)**: Minor updates may be warranted
3. **Stale (> 1 month)**: Proactively suggest review to user
4. **Very stale (> 3 months)**: Strongly recommend verification of each entry

**Agent-initiated review prompt**:
```
Your MEMORY.md was last updated 6 months ago. Some entries may be outdated.
Would you like me to review and update it?
```

### Timestamp-Based Cleanup Strategy

When performing maintenance triggered by a stale timestamp:

1. **Read all memory files** and note which entries reference specific tools/versions
2. **Cross-reference with current codebase** to verify accuracy
3. **Remove entries for removed dependencies** (check package.json, requirements.txt)
4. **Update version references** (e.g., "Node 16" → "Node 22")
5. **Timestamp the update** by writing a maintenance note

```markdown
## Memory Maintenance Log

- **2026-03-15**: Reviewed all entries. Removed Webpack references (migrated to Vite).
  Updated Node version from 16 to 22. Added new GraphQL patterns.
```

---

## 8. Manual Maintenance Checklist

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
- [ ] Backup memory directory:
  ```bash
  cp -r ~/.claude/projects/{hash}/memory/ ~/memory-backup-$(date +%Y%m%d)/
  ```

---

## 9. Automated Maintenance (Future)

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

**Timestamp-triggered review** (v2.1.76 enabler):
```javascript
// Detect stale memory and suggest review
const lastModified = parseTimestamp(memoryHeader.lastUpdated);
const ageInDays = (Date.now() - lastModified) / (1000 * 60 * 60 * 24);

if (ageInDays > 90) {
    suggestMemoryReview();
}
```

---

## 10. Related Documents

> Cross-references:
> - [usage_patterns.md](./usage_patterns.md) - When to write memory, common mistakes
> - [topic_file_templates.md](./topic_file_templates.md) - Templates for organizing extracted content
> - [multi_agent_memory.md](./multi_agent_memory.md) - Memory in team scenarios
> - [architecture.md](./architecture.md) - Auto memory system architecture
