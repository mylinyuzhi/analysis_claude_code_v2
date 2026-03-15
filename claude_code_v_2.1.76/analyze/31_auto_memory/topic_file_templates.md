# Topic File Templates - Reusable Memory Organization Patterns

> **Module**: Auto Memory - Topic File Structures
> **Version**: Claude Code v2.1.76

---

## Table of Contents

1. [Overview](#1-overview)
2. [Template 1: Debugging Guide](#2-template-1-debugging-guide)
3. [Template 2: Code Patterns](#3-template-2-code-patterns)
4. [Template 3: Architecture Decisions](#4-template-3-architecture-decisions)
5. [Template 4: Testing Strategies](#5-template-4-testing-strategies)
6. [Template 5: Deployment Checklist](#6-template-5-deployment-checklist)
7. [Template 6: Performance Notes](#7-template-6-performance-notes)
8. [Variable Support in Templates](#8-variable-support-in-templates)
9. [Customization Guidelines](#9-customization-guidelines)
10. [Related Documents](#10-related-documents)

---

## 1. Overview

Topic files are detailed knowledge stores linked from MEMORY.md. Templates provide consistent structure for common knowledge categories, making memory easier to navigate and maintain.

### When to Use Templates

**Use templates when**:
- Starting a new topic file (provides structure)
- Organizing existing scattered notes
- Establishing team conventions (standardized format)

**Don't rigidly follow templates when**:
- Project has unique needs (customize freely)
- Existing format works well (don't force change)
- Content doesn't fit template structure

### Template Philosophy

**Consistency**: Same structure across topic files makes knowledge predictable

**Flexibility**: Templates are starting points, not rules

**Actionability**: Focus on solutions, not just descriptions

### New in v2.1.76: Variable Support

Topic files now support `${CLAUDE_SKILL_DIR}` variable substitution. This enables skill-aware templates that reference their own installation directory:

```markdown
# Skill Documentation

## Commands
See ${CLAUDE_SKILL_DIR}/commands.md for the full command list.

## Configuration
Default config at ${CLAUDE_SKILL_DIR}/config/defaults.json
```

When a skill's memory is loaded, `${CLAUDE_SKILL_DIR}` is automatically expanded to the actual skill directory path, making templates portable.

---

## 2. Template 1: Debugging Guide

### Purpose

Capture recurring issues, symptoms, root causes, and solutions. Acts as troubleshooting reference.

### File Structure

```markdown
# Debugging Guide

> Common issues and solutions for {Project Name}

## Build Errors

### {Error Name or Symptom}

**Symptom**: Brief description of what user sees

**Cause**: Root cause explanation

**Solution**:
1. Step-by-step fix
2. Include exact commands
3. Verification step

**Prevention**: How to avoid in future (optional)

**Related**: Links to other sections or docs

---

### {Another Error}

[Repeat structure]

## Runtime Errors

### {Error Category}

[Same structure as above]

## Test Failures

### {Test Scenario}

[Same structure as above]

## Performance Issues

### {Performance Problem}

**Symptom**: What's slow
**Diagnosis**: How to measure/profile
**Fix**: Optimization approach
**Result**: Performance improvement (e.g., "2s → 200ms")
```

### Example: debugging.md

```markdown
# Debugging Guide

> Common issues and solutions for MyApp

## Build Errors

### ENOENT: Cannot find module '@/components/Button'

**Symptom**: Build fails with `Error: Cannot find module '@/components/Button'`

**Cause**: TypeScript path aliases not configured in tsconfig.json

**Solution**:
1. Open `tsconfig.json`
2. Add to `compilerOptions`:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```
3. Restart TypeScript server: `Cmd+Shift+P` → "TypeScript: Restart TS Server"
4. Verify: Build should now succeed

**Prevention**: Always configure path aliases when creating new project

## Runtime Errors

### React hydration mismatch

**Symptom**: Warning in console: "Text content does not match server-rendered HTML"

**Cause**: Client-rendered output differs from server-rendered HTML (SSR)

**Solution**:
```jsx
// Good: Move to useEffect
function Component() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
  }, []);
  return <div>{now || "Loading..."}</div>;
}
```

## Test Failures

### CI tests fail, pass locally

**Diagnosis**:
1. Check CI logs for error messages
2. Compare Node versions: `node --version` (local) vs CI config
3. Check environment variables: Are secrets configured in CI?

**Common solutions**:

**Env vars missing**:
```yaml
# .github/workflows/test.yml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

**Timing issues**:
```javascript
// Good: Wait for condition
await waitFor(() => expect(element).toBeVisible());
```
```

---

## 3. Template 2: Code Patterns

### Purpose

Document coding conventions, design patterns, and best practices specific to the project.

### File Structure

```markdown
# Code Patterns

> Coding conventions and patterns for {Project Name}

## {Pattern Category}

### {Pattern Name}

**When to use**: Scenarios where this pattern applies

**Implementation**:
```{language}
// Code example with comments
```

**Why**: Rationale for this approach

**Alternatives**: Other approaches considered and why this is preferred

**Don't**: Common mistakes to avoid

---

## {Another Category}

[Repeat structure]
```

### Example: react_patterns.md

```markdown
# React Patterns

> React conventions for MyApp

## Component Structure

### Functional components with hooks

**When to use**: All new components (no class components)

**Implementation**:
```typescript
export function UserProfile({ userId, onUpdate }: Props) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const data = await fetchUser(userId);
      setUser(data);
    }
    loadUser();
  }, [userId]);

  if (!user) return <NotFound />;
  return <div>{/* user UI */}</div>;
}
```

**Don't**:
- Mix class and functional components in same file
- Use `any` type for props
- Forget to memoize expensive computations

## State Management

### Local state vs context

**When to use local state**:
- Component-specific data (form input values)
- Short-lived data (UI toggles)

**When to use context**:
- Data needed by many components (user auth, theme)
- Global app state (current project, settings)
```

---

## 4. Template 3: Architecture Decisions

### Purpose

Record major architectural choices with context, rationale, and consequences (inspired by Architecture Decision Records).

### File Structure

```markdown
# Architecture Decisions

> Record of major technical decisions for {Project Name}

## {Decision Title}

**Date**: YYYY-MM-DD

**Status**: Accepted | Rejected | Superseded

**Context**: What is the issue we're facing?

**Decision**: What did we decide?

**Rationale**: Why this choice?

**Consequences**:
- Positive: Benefits gained
- Neutral: Tradeoffs accepted
- Negative: Drawbacks acknowledged

**Alternatives considered**:
- Option A: Why rejected
- Option B: Why rejected

---

## {Next Decision}

[Repeat structure]
```

### Example: architecture.md

```markdown
# Architecture Decisions

## Use GraphQL instead of REST for API

**Date**: 2024-02-15

**Status**: Accepted

**Decision**: Implement GraphQL API using Apollo Server, with Prisma for database access.

**Rationale**:
- Single request for complex data relationships
- Frontend can specify exactly what fields it needs
- Strong typing with schema validation

**Consequences**:
- Positive: Faster mobile app (less data transfer), TypeScript types auto-generated
- Neutral: Team needs to learn GraphQL (1-2 week ramp-up)
- Negative: More complex setup than simple REST

**Alternatives considered**:
- REST with JSON:API: Rejected due to rigid structure, no query flexibility
- gRPC: Rejected due to limited browser support
```

---

## 5. Template 4: Testing Strategies

### Purpose

Document testing approaches, patterns, and conventions specific to the project.

### File Structure

```markdown
# Testing Strategies

> Testing conventions for {Project Name}

## Unit Tests

**Location**: `__tests__/` co-located with source files
**Framework**: {Jest, Vitest, etc.}
**Coverage target**: {X%}

## Integration Tests

**Purpose**: Test interaction between modules

## E2E Tests

**Purpose**: Test full user flows
**Tools**: {Playwright, Cypress, etc.}

## Flaky Test Handling

**Strategy**: How to deal with flaky tests
```

### Example: testing.md

```markdown
# Testing Strategies

## Unit Tests

**Framework**: Vitest (faster than Jest, compatible API)
**Coverage target**: 80% for critical paths, 60% overall

```typescript
describe('UserProfile', () => {
  it('displays user name', () => {
    const user = { id: '1', name: 'Alice' };
    render(<UserProfile user={user} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});
```

## Flaky Test Handling

**Strategy**: Fix root cause, don't just retry

### Race conditions
**Fix**: Use `waitFor` instead of fixed delays
```typescript
// Good
await waitFor(() => expect(element).toBeVisible());
```
```

---

## 6. Template 5: Deployment Checklist

### Purpose

Step-by-step deployment procedure with verification steps.

### File Structure

```markdown
# Deployment Checklist

## Pre-Deployment

- [ ] Run full test suite locally
- [ ] Check for uncommitted changes
- [ ] Update version in package.json
- [ ] Update CHANGELOG.md

## Deployment Steps

### {Environment}

1. [ ] Step 1
2. [ ] Step 2
3. [ ] Verification step

## Post-Deployment

- [ ] Smoke tests
- [ ] Monitor logs for errors

## Rollback Procedure

If issues arise:
1. Step to rollback
2. Verification
```

---

## 7. Template 6: Performance Notes

### Purpose

Document performance optimizations, profiling results, and benchmarks.

### File Structure

```markdown
# Performance Notes

## Baseline Metrics

**Measured**: YYYY-MM-DD
**Environment**: {Production, Staging, Local}

- Metric 1: Value
- Metric 2: Value

## Optimizations

### {Optimization Name}

**Problem**: What was slow
**Diagnosis**: How we identified the bottleneck
**Solution**: What we changed
**Result**: Before → After metrics
**Tradeoffs**: What we sacrificed (if any)
```

### Example: performance.md

```markdown
# Performance Notes

## Baseline Metrics

**Measured**: 2024-03-01

- Homepage load: 2.5s (p95)
- API response time: 450ms (p95)
- Bundle size: 1.8MB (gzipped)

## Optimizations

### Database query optimization

**Problem**: User profile page took 3 seconds (N+1 queries)

**Solution**: Use `include` to fetch related data in single query
```typescript
// After (1 query)
const user = await prisma.user.findUnique({
  where: { id },
  include: { posts: { include: { author: true } } }
});
```

**Result**: 3000ms → 250ms (12x faster)

### Bundle size reduction

**Problem**: Lodash entire library included (500KB)

**Solution**: Import specific functions
```typescript
import debounce from 'lodash/debounce';  // Instead of import _ from 'lodash'
```

**Result**: 1.8MB → 1.3MB (28% reduction)
```

---

## 8. Variable Support in Templates

### 8.1 ${CLAUDE_SKILL_DIR} Variable (v2.1.76)

When creating memory templates for skills, use `${CLAUDE_SKILL_DIR}` to reference the skill's installation directory:

```markdown
# {Skill Name} Memory

## Quick Reference

Full documentation: ${CLAUDE_SKILL_DIR}/README.md

## Configuration

Default settings: ${CLAUDE_SKILL_DIR}/config/defaults.json

Edit settings: ${CLAUDE_SKILL_DIR}/config/user.json

## Commands

Run `${CLAUDE_SKILL_DIR}/scripts/setup.sh` to initialize
```

**How it works**:
1. Claude Code scans topic file content at load time
2. Replaces `${CLAUDE_SKILL_DIR}` with the actual skill installation path
3. Agent sees fully resolved paths, no variable expansion needed

**Use case**: Skill developers can ship memory templates that work regardless of where the skill is installed.

**Template file naming convention**:
```
skill-memory-template.md  → Bundled with skill
MEMORY.md                 → Instantiated at user's memory directory
```

---

## 9. Customization Guidelines

### Adapting Templates

**Keep what works**:
- Consistent section headers (makes navigation predictable)
- "Symptom → Cause → Solution" structure (actionable)

**Change what doesn't**:
- Remove sections not relevant to your project
- Add project-specific sections (e.g., "Security Considerations" for finance app)
- Adjust language (formal vs casual based on team culture)

### Project-Specific Templates

**Create custom templates for**:
- Domain-specific knowledge (e.g., `ml_models.md` for AI projects)
- Team-specific workflows (e.g., `on_call_runbook.md`)
- Integration-specific patterns (e.g., `stripe_integration.md`)

**Template creation process**:
1. Identify recurring knowledge category
2. Document 2-3 examples in that category
3. Extract common structure
4. Formalize as template

---

## 10. Related Documents

> Cross-references:
> - [usage_patterns.md](./usage_patterns.md) - When to create topic files, MEMORY.md organization
> - [memory_maintenance.md](./memory_maintenance.md) - Refactoring existing content to topic files
> - [architecture.md](./architecture.md) - Auto memory system architecture
