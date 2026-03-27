# Plan File Format (Claude Code 2.1.76)

> Complete specification of the plan file structure, location, and usage.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Plan Mode section

Key functions:
- `getPlanFileSlug` (Rj1) - chunks.88.mjs:78
- `registerPlanFileSlug` (n0A) - chunks.88.mjs:94
- `clearPlanFileSlug` (dU7) - chunks.88.mjs:98

---

## Overview

The plan file is a Markdown document that stores the implementation plan created during plan mode. It is written by the agent and approved by the user before implementation begins.

---

## File Location

### Path Pattern

```
~/.claude_api/plans/<session-slug>.md
```

### Slug Generation

The slug is derived from the task description:

```javascript
// ============================================
// getPlanFileSlug - Generate slug from task description
// Location: chunks.88.mjs:78-92
// ============================================

function getPlanFileSlug(description) {
  // Convert to lowercase
  // Replace non-alphanumeric with hyphens
  // Remove consecutive hyphens
  // Truncate to 50 chars
  return description
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

// Examples:
// "Fix authentication bug" → "fix-authentication-bug"
// "Implement dark mode support" → "implement-dark-mode-support"
// "Refactor database schema to support multi-tenancy" → "refactor-database-schema-to-support-multi-tenan"
```

### Full Path

```javascript
function getPlanFilePath(slug) {
  return path.join(
    os.homedir(),
    ".claude_api",
    "plans",
    `${slug}.md`
  );
}
```

---

## File Structure

### Required Sections

```markdown
# Plan: <Task Description>

## Context
<Why this change is being made — the problem or need it addresses>

## Implementation Plan
1. <Step 1>
2. <Step 2>
3. <Step 3>
...

## Files to Modify
- `<path/to/file1>` - <Brief description of changes>
- `<path/to/file2>` - <Brief description of changes>

## Verification
<How to test the changes end-to-end>
```

### Example Plan File

```markdown
# Plan: Add User Authentication

## Context
The application currently has no user authentication. Users cannot log in, and all data is publicly accessible. This poses security and privacy concerns. We need to implement OAuth2 authentication with Google and GitHub providers to allow secure user access.

## Implementation Plan
1. Install authentication dependencies (passport, passport-oauth2)
2. Create User model with OAuth profile fields
3. Implement OAuth routes for Google provider
4. Implement OAuth routes for GitHub provider
5. Add authentication middleware for protected routes
6. Update frontend to show login/logout buttons
7. Add session management with secure cookies

## Files to Modify
- `src/models/User.ts` - Add User model with OAuth fields
- `src/routes/auth.ts` - New file for OAuth routes
- `src/middleware/auth.ts` - Authentication middleware
- `src/frontend/components/Header.tsx` - Login/logout buttons
- `src/config/session.ts` - Session configuration

## Verification
1. Run `npm test` to ensure existing tests pass
2. Test Google OAuth flow manually
3. Test GitHub OAuth flow manually
4. Verify protected routes return 401 without auth
5. Verify logout clears session
```

---

## Plan Writing

### Who Can Write

- In plan mode, the agent can write to the plan file path
- Write/Edit tools are filtered to only allow writes to the plan file

### Writing Process

```javascript
// Agent uses Write tool to create plan
await writeFile(planFilePath, planContent);

// Or Edit tool to update plan
await editFile(planFilePath, {
  old_string: "## Implementation Plan\n1. Old step",
  new_string: "## Implementation Plan\n1. New step\n2. Another step"
});
```

### Plan Mode Tool Filtering

```javascript
// In tool execution pipeline
if (mode === "plan") {
  if (toolName === "Write" || toolName === "Edit") {
    // Only allow writes to plan file
    if (!input.file_path.includes(planFilePath)) {
      return {
        error: "In plan mode, you can only write to the plan file"
      };
    }
  }
}
```

---

## Plan Reading

### By Agent

The agent reads the plan file at the start of each turn in plan mode:

```javascript
// Plan mode attachment includes plan file content
const planContent = await readFile(planFilePath, "utf-8");
```

### By User

The user can view the plan file:
1. Directly from the file system
2. Via the UI during plan approval
3. After implementation for reference

---

## Plan Approval

### User Approval Dialog

When ExitPlanMode is triggered:

```
┌─────────────────────────────────────────────────────────────┐
│ Ready to code?                                              │
│                                                              │
│ The plan includes:                                          │
│ • 7 implementation steps                                    │
│ • 5 files to modify                                         │
│                                                              │
│ ┌─────────────────┐ ┌─────────────────┐                     │
│ │ Let's implement │ │ Refine plan     │                     │
│ └─────────────────┘ └─────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

### Swarm Approval

For teammates, the plan is sent to team-lead for approval:

```javascript
// Plan approval request message
{
  type: "plan_approval_request",
  planContent: "...",  // Full plan file content
  planFilePath: "~/.claude_api/plans/add-user-authentication.md",
  fromAgent: "developer-teammate"
}
```

---

## Plan Preservation

### During Compaction

The plan file is preserved during context compaction:

```javascript
// Compaction preserves plan state
const preservedState = {
  planFilePath,
  planContent: await readFile(planFilePath),
  planApproved: hasExitedPlanMode
};

// After compaction, restore plan context
if (preservedState.planFilePath) {
  // Re-inject plan as state-preservation attachment
  yield createPlanPreservationAttachment(preservedState);
}
```

### State Preservation Attachment

```javascript
{
  type: "state_preservation",
  category: "plan",
  planFilePath: "~/.claude_api/plans/add-user-authentication.md",
  planContent: "...",
  planApproved: false
}
```

---

## Plan Lifecycle

### Creation

```
User enters plan mode
  │
  ├─→ /plan <description>
  │
  ├─→ Slug generated from description
  │
  └─→ Plan file created at ~/.claude_api/plans/<slug>.md
```

### Modification

```
Agent in plan mode
  │
  ├─→ Explores codebase (read-only)
  ├─→ Asks clarifying questions
  ├─→ Writes plan to plan file
  │     └─→ Edit tool only allows writes to plan file path
  │
  └─→ Updates plan as understanding develops
```

### Approval

```
Agent calls ExitPlanMode
  │
  ├─→ User approval dialog shown
  │     ├─→ "Let's implement" → Exit plan mode
  │     └─→ "Refine plan" → Stay in plan mode
  │
  └─→ Plan file preserved for reference during implementation
```

### Reference

```
During implementation
  │
  ├─→ Agent can read plan file
  ├─→ Plan steps guide implementation
  │
  └─→ Plan file remains for user reference
```

---

## File Management

### Cleanup

Plan files are not automatically deleted. Users can:
1. Delete manually from file system
2. Use a cleanup command (if available)

### Multiple Plans

Each session has its own plan file:
- Different sessions = different slugs
- Old plans persist for reference
- No overwriting of existing plans

---

## Quick Reference

### Path Components

| Component | Value |
|-----------|-------|
| Base directory | `~/.claude_api/plans/` |
| Filename | `<slug>.md` |
| Slug length | Max 50 characters |
| Encoding | UTF-8 |

### Sections

| Section | Required | Purpose |
|---------|----------|---------|
| Title | Yes | Task description |
| Context | Yes | Why this change |
| Implementation Plan | Yes | Step-by-step approach |
| Files to Modify | Yes | Affected files |
| Verification | Yes | Testing approach |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Swarm plan approval |
| 2.1.72 | /plan command with description |
| 2.1.0 | Initial plan file format |