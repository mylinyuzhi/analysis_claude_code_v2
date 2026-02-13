# Topic File Templates - Reusable Memory Organization Patterns

> **Module**: Auto Memory - Topic File Structures
> **Version**: Claude Code 2.1.38

---

## Table of Contents

1. [Overview](#1-overview)
2. [Template 1: Debugging Guide](#2-template-1-debugging-guide)
3. [Template 2: Code Patterns](#3-template-2-code-patterns)
4. [Template 3: Architecture Decisions](#4-template-3-architecture-decisions)
5. [Template 4: Testing Strategies](#5-template-4-testing-strategies)
6. [Template 5: Deployment Checklist](#6-template-5-deployment-checklist)
7. [Template 6: Performance Notes](#7-template-6-performance-notes)
8. [Customization Guidelines](#8-customization-guidelines)
9. [Related Documents](#9-related-documents)

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

**Related**: See [tsconfig-setup.md](tsconfig-setup.md) for full TypeScript configuration

---

### Vite build fails with "out of memory"

**Symptom**: `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`

**Cause**: Large dependency tree exceeds default Node.js heap size

**Solution**:
1. Increase heap size in `package.json`:
   ```json
   {
     "scripts": {
       "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
     }
   }
   ```
2. Run build: `npm run build`

**Prevention**: Monitor bundle size, use dynamic imports for code splitting

## Runtime Errors

### React hydration mismatch

**Symptom**: Warning in console: "Text content does not match server-rendered HTML"

**Cause**: Client-rendered output differs from server-rendered HTML (SSR)

**Common causes**:
- Using `Date.now()` or `Math.random()` directly in render
- Browser-only APIs (`window`, `localStorage`) accessed during SSR
- Mismatched whitespace or formatting

**Solution**:
```jsx
// ❌ Bad: Different on server/client
function Component() {
  return <div>{Date.now()}</div>;
}

// ✅ Good: Move to useEffect
function Component() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
  }, []);
  return <div>{now || "Loading..."}</div>;
}

// ✅ Alternative: Suppress warning (use sparingly)
function Component() {
  return <div suppressHydrationWarning>{Date.now()}</div>;
}
```

**Prevention**: Check for `typeof window !== 'undefined'` before using browser APIs

## Test Failures

### CI tests fail, pass locally

**Symptom**: All tests pass on laptop but fail in GitHub Actions

**Diagnosis**:
1. Check CI logs for error messages
2. Compare Node versions: `node --version` (local) vs CI config
3. Check environment variables: Are secrets configured in CI?
4. Look for timing issues: Race conditions, fixed delays

**Common solutions**:

**Env vars missing**:
```yaml
# .github/workflows/test.yml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}
```

**Timing issues**:
```javascript
// ❌ Bad: Fixed delay
await new Promise(resolve => setTimeout(resolve, 1000));

// ✅ Good: Wait for condition
await waitFor(() => expect(element).toBeVisible());
```

**Database not seeded**:
```yaml
# .github/workflows/test.yml
- name: Run tests
  run: |
    npm run db:seed
    npm test
```
```

### Template Sections Explained

**Symptom**: What the user observes (error message, behavior)

**Cause**: Why it happens (root cause, not just symptoms)

**Solution**: Step-by-step fix with exact commands/code

**Prevention**: (Optional) How to avoid issue in future

**Related**: Links to other relevant docs/sections

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
import { useState, useEffect } from 'react';

interface Props {
  userId: string;
  onUpdate: (data: User) => void;
}

export function UserProfile({ userId, onUpdate }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const data = await fetchUser(userId);
      setUser(data);
      setLoading(false);
    }
    loadUser();
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <NotFound />;

  return <div>{/* user UI */}</div>;
}
```

**Why**: Hooks provide cleaner syntax and better composition than class components

**Alternatives**: Class components (legacy, don't use for new code)

**Don't**:
- ❌ Mix class and functional components in same file
- ❌ Use `any` type for props
- ❌ Forget to memoize expensive computations (use `useMemo`)

### Props naming: event handlers

**Convention**: Prefix with `on`, use present tense verb

**Implementation**:
```typescript
// ✅ Good
<Button onClick={handleClick} onSubmit={handleSubmit} onChange={handleChange} />

// ❌ Bad
<Button click={...} submitted={...} changing={...} />
```

**Why**: Consistent with React ecosystem conventions

## State Management

### Local state vs context

**When to use local state**:
- Component-specific data (form input values)
- Data not needed by siblings or ancestors
- Short-lived data (UI toggles)

**When to use context**:
- Data needed by many components (user auth, theme)
- Deeply nested components (prop drilling problem)
- Global app state (current project, settings)

**Implementation**:
```typescript
// Local state
function Form() {
  const [email, setEmail] = useState('');
  return <input value={email} onChange={(e) => setEmail(e.target.value)} />;
}

// Context
const UserContext = createContext<User | null>(null);

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

// Usage
function ProfileButton() {
  const user = useContext(UserContext);
  return <button>{user?.name}</button>;
}
```

**Don't**:
- ❌ Use context for frequently changing values (causes re-renders)
- ❌ Create context for every shared value (prop drilling isn't always bad)
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
- ✅ Positive: Benefits gained
- ⚠️ Neutral: Tradeoffs accepted
- ❌ Negative: Drawbacks acknowledged

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

> Record of major technical decisions for MyApp

## Use GraphQL instead of REST for API

**Date**: 2024-02-15

**Status**: Accepted

**Context**: Frontend needs flexible data fetching for complex UIs. REST endpoints require multiple requests for related data (N+1 problem). API consumers have varying data needs (mobile app needs less data than web).

**Decision**: Implement GraphQL API using Apollo Server, with Prisma for database access.

**Rationale**:
- Single request for complex data relationships
- Frontend can specify exactly what fields it needs (reduces over-fetching)
- Strong typing with schema validation
- Built-in introspection and documentation

**Consequences**:
- ✅ Positive:
  - Faster mobile app (less data transfer)
  - No need for custom REST endpoints for every UI view
  - TypeScript types auto-generated from schema
- ⚠️ Neutral:
  - Team needs to learn GraphQL (1-2 week ramp-up)
  - Different caching strategy than REST
- ❌ Negative:
  - More complex setup than simple REST
  - Harder to cache at CDN level (POST requests)
  - Potential for expensive queries if not limited

**Alternatives considered**:
- REST with JSON:API: Rejected due to rigid structure, no query flexibility
- gRPC: Rejected due to limited browser support, overkill for our use case
- tRPC: Rejected due to TypeScript-only (want mobile app in Swift eventually)

---

## Use PostgreSQL with Prisma ORM

**Date**: 2024-02-10

**Status**: Accepted

**Context**: Need relational database for user data, transactions, and relationships. Team familiar with SQL. Want type-safe database access.

**Decision**: PostgreSQL for database, Prisma for ORM.

**Rationale**:
- PostgreSQL: ACID transactions, mature, great JSON support for flexible fields
- Prisma: Type-safe queries, migration management, GraphQL integration

**Consequences**:
- ✅ Positive:
  - Type safety catches bugs at compile time
  - Easy migrations with `prisma migrate`
  - Excellent developer experience
- ⚠️ Neutral:
  - Learn Prisma query syntax (different from raw SQL)
- ❌ Negative:
  - Harder to scale horizontally than NoSQL (acceptable for our size)
  - Migration rollbacks require manual scripts

**Alternatives considered**:
- MongoDB: Rejected due to need for transactions and relational data
- MySQL: Rejected due to weaker JSON support, less feature-rich than Postgres
- Raw SQL: Rejected due to lack of type safety, manual migration management
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

**Patterns**:
- {Pattern 1}
- {Pattern 2}

## Integration Tests

**Purpose**: Test interaction between modules

**Examples**:
```{language}
// Test example
```

## E2E Tests

**Purpose**: Test full user flows

**Tools**: {Playwright, Cypress, etc.}

**Patterns**:
```{language}
// E2E example
```

## Flaky Test Handling

**Strategy**: How to deal with flaky tests

**Common causes**:
- Cause 1 → Fix 1
- Cause 2 → Fix 2
```

### Example: testing.md

```markdown
# Testing Strategies

> Testing conventions for MyApp

## Unit Tests

**Location**: `src/**/__tests__/*.test.ts` (co-located with source)

**Framework**: Vitest (faster than Jest, compatible API)

**Coverage target**: 80% for critical paths (auth, payments), 60% overall

**Patterns**:

### Component tests
```typescript
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('displays user name', () => {
    const user = { id: '1', name: 'Alice' };
    render(<UserProfile user={user} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<UserProfile user={null} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

### API handler tests
```typescript
import { POST as createUser } from './api/users/route';

describe('POST /api/users', () => {
  it('creates user with valid data', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' })
    });
    const res = await createUser(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.user.name).toBe('Alice');
  });
});
```

## Integration Tests

**Purpose**: Test API + database interactions, without UI

**Setup**: Use separate test database, seed before each test

```typescript
import { prisma } from '@/lib/prisma';

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`;
  await prisma.user.create({ data: { name: 'Test User' } });
});

it('fetches users from database', async () => {
  const users = await getUsers();
  expect(users).toHaveLength(1);
  expect(users[0].name).toBe('Test User');
});
```

## E2E Tests

**Purpose**: Test full user flows in browser

**Tools**: Playwright (faster than Cypress, better TypeScript support)

**Location**: `e2e/**/*.spec.ts`

**Patterns**:

### Login flow
```typescript
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Login');
  await page.fill('input[name=email]', 'alice@example.com');
  await page.fill('input[name=password]', 'password123');
  await page.click('button[type=submit]');
  await expect(page.locator('text=Welcome, Alice')).toBeVisible();
});
```

### Page Object pattern
```typescript
class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.fill('input[name=email]', email);
    await this.page.fill('input[name=password]', password);
    await this.page.click('button[type=submit]');
  }
}

test('login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('alice@example.com', 'password123');
  await expect(page.locator('text=Welcome')).toBeVisible();
});
```

## Flaky Test Handling

**Strategy**: Fix root cause, don't just retry

**Common causes**:

### Race conditions
**Symptom**: Test sometimes fails, sometimes passes
**Fix**: Use `waitFor` instead of fixed delays
```typescript
// ❌ Bad
await new Promise(r => setTimeout(r, 1000));
expect(element).toBeVisible();

// ✅ Good
await waitFor(() => expect(element).toBeVisible());
```

### Incomplete cleanup
**Symptom**: Test fails when run after another test
**Fix**: Ensure `afterEach` cleans up properly
```typescript
afterEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`;
});
```

### CI environment differences
**Symptom**: Test passes locally, fails in CI
**Fix**: Check Node versions, env vars, database seed
```yaml
# .github/workflows/test.yml
- name: Setup
  run: |
    npm ci
    npm run db:seed
    npm test
```

**Known flaky tests**: (Add to `jest.config.js` retry list)
- `api/webhook.test.ts` - External API sometimes slow (retries: 3)
```

---

## 6. Template 5: Deployment Checklist

### Purpose

Step-by-step deployment procedure with verification steps.

### File Structure

```markdown
# Deployment Checklist

> Deployment procedure for {Project Name}

## Pre-Deployment

- [ ] Run full test suite locally
- [ ] Check for uncommitted changes
- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Create release branch/tag

## Deployment Steps

### {Environment} ({e.g., Staging})

1. [ ] Step 1
2. [ ] Step 2
3. [ ] Verification step

### {Environment} ({e.g., Production})

1. [ ] Step 1
2. [ ] Step 2
3. [ ] Verification step

## Post-Deployment

- [ ] Smoke tests
- [ ] Monitor logs for errors
- [ ] Verify key metrics
- [ ] Update deployment log

## Rollback Procedure

If issues arise:
1. Step to rollback
2. Verification
3. Root cause investigation
```

### Example: deployment.md

```markdown
# Deployment Checklist

> Deployment procedure for MyApp

## Pre-Deployment

- [ ] Run full test suite: `npm test`
- [ ] Check for uncommitted changes: `git status` (should be clean)
- [ ] Update version in `package.json`: `npm version patch` (or minor/major)
- [ ] Update `CHANGELOG.md` with new features/fixes
- [ ] Create release tag: `git tag v1.2.3 && git push --tags`

## Deployment Steps

### Staging

1. [ ] Merge to `develop` branch: `git checkout develop && git merge feature-branch`
2. [ ] Push to GitHub: `git push origin develop`
3. [ ] Wait for CI to pass (check GitHub Actions)
4. [ ] Deploy to staging: `npm run deploy:staging`
5. [ ] Verify deployment:
   - [ ] Visit https://staging.myapp.com
   - [ ] Check version number in footer: Should show `v1.2.3`
   - [ ] Test critical flows: login, create item, payment
6. [ ] Run E2E tests against staging: `npm run test:e2e:staging`

### Production

1. [ ] Create pull request: `develop` → `main`
2. [ ] Get approval from team lead
3. [ ] Merge to `main`
4. [ ] Tag release: `git tag v1.2.3`
5. [ ] Push tag: `git push origin v1.2.3`
6. [ ] Deploy to production: `npm run deploy:production`
   - Triggers: GitHub Actions workflow
   - Duration: ~5 minutes
7. [ ] Verify deployment:
   - [ ] Visit https://myapp.com
   - [ ] Check version: `v1.2.3` in footer
   - [ ] Smoke test:
     - [ ] Homepage loads
     - [ ] Login works
     - [ ] API health check: https://myapp.com/api/health
8. [ ] Monitor for 15 minutes:
   - [ ] Check error logs: CloudWatch dashboard
   - [ ] Check metrics: Response times, error rates
   - [ ] Verify no spike in errors

## Post-Deployment

- [ ] Announce in team Slack: "🚀 v1.2.3 deployed to production"
- [ ] Update deployment log: `deployments.md`
- [ ] Monitor error tracking (Sentry) for 24 hours
- [ ] If issues found: Follow rollback procedure

## Rollback Procedure

**When to rollback**: Critical bug, error rate >5%, data corruption

**Steps**:
1. Identify last good version: Check `git tag` for previous tag
2. Rollback to previous tag: `npm run deploy:production -- --tag v1.2.2`
3. Verify rollback: Check version number, test critical flows
4. Notify team: "⚠️ Rolled back to v1.2.2 due to {issue}"
5. Create incident report: Document what went wrong
6. Fix forward: Create hotfix branch from `main`, fix issue, redeploy

**Rollback time**: Target <10 minutes from detection to rollback complete
```

---

## 7. Template 6: Performance Notes

### Purpose

Document performance optimizations, profiling results, and benchmarks.

### File Structure

```markdown
# Performance Notes

> Performance optimizations for {Project Name}

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

**Code**:
```{language}
// Before
// ... slow code

// After
// ... optimized code
```

**Tradeoffs**: What we sacrificed (if any)
```

### Example: performance.md

```markdown
# Performance Notes

> Performance optimizations for MyApp

## Baseline Metrics

**Measured**: 2024-03-01

**Environment**: Production

- Homepage load: 2.5s (p95)
- API response time: 450ms (p95)
- Database query time: 120ms (avg)
- Bundle size: 1.8MB (gzipped)

## Optimizations

### Database query optimization

**Problem**: User profile page took 3 seconds to load due to N+1 queries

**Diagnosis**:
- Used Prisma query logging: `prisma.$on('query', log)`
- Found 50+ separate queries to fetch user posts + authors

**Solution**: Use `include` to fetch related data in single query
```typescript
// Before (N+1 queries)
const user = await prisma.user.findUnique({ where: { id } });
const posts = await prisma.post.findMany({ where: { authorId: id } });
// Then for each post:
//   const author = await prisma.user.findUnique({ where: { id: post.authorId } });

// After (1 query)
const user = await prisma.user.findUnique({
  where: { id },
  include: {
    posts: {
      include: {
        author: true
      }
    }
  }
});
```

**Result**: 3000ms → 250ms (12x faster)

**Tradeoffs**: None, pure win

---

### React component memoization

**Problem**: Expensive table re-renders on every parent state change

**Diagnosis**:
- Used React DevTools Profiler
- Found Table component rendering 500+ rows on every keystroke in search box

**Solution**: Memoize table component with `React.memo`
```typescript
// Before
export function DataTable({ data, onSort }: Props) {
  return <table>{/* 500 rows */}</table>;
}

// After
export const DataTable = React.memo(({ data, onSort }: Props) => {
  return <table>{/* 500 rows */}</table>;
}, (prevProps, nextProps) => {
  // Only re-render if data or onSort changed
  return prevProps.data === nextProps.data && prevProps.onSort === nextProps.onSort;
});
```

**Result**: Typing in search box: 200ms delay → 16ms (smooth 60fps)

**Tradeoffs**: Slight increase in memory usage (memo cache)

---

### Bundle size reduction

**Problem**: Initial page load slow due to large JavaScript bundle

**Diagnosis**:
- Used `webpack-bundle-analyzer`
- Found Lodash entire library included (500KB) despite using only 3 functions

**Solution**: Import specific Lodash functions
```typescript
// Before
import _ from 'lodash';
_.debounce(...);
_.throttle(...);

// After
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
```

**Result**: Bundle size: 1.8MB → 1.3MB (28% reduction), load time: 2.5s → 1.8s

**Tradeoffs**: More verbose imports, but worth it for bundle size savings
```

---

## 8. Customization Guidelines

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

## 9. Related Documents

> Cross-references:
> - [usage_patterns.md](./usage_patterns.md) - When to create topic files, MEMORY.md organization
> - [memory_maintenance.md](./memory_maintenance.md) - Refactoring existing content to topic files
> - [architecture.md](./architecture.md) - Auto memory system architecture
