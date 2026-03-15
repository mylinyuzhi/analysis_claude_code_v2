# Worktree Tools - Deep Analysis (Claude Code 2.1.76)

> Complete analysis of worktree tools: EnterWorktree and ExitWorktree.
> **NEW in v2.1.72** - Isolated worktree sessions for parallel development.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks section for WorktreeCreate/WorktreeRemove)

Key functions in this document:
- `EnterWorktreeTool` (g8q) - Create isolated worktree - chunks.144.mjs:1783
- `ExitWorktreeTool` - Exit worktree session - chunks.144.mjs
- `TOOL_NAME_ENTER_WORKTREE` (sP1) - Constant "EnterWorktree" - chunks.91.mjs:180
- `TOOL_NAME_EXIT_WORKTREE` (tP1) - Constant "ExitWorktree" - chunks.91.mjs:182
- `getEnterWorktreePrompt` (h8q) - Tool prompt generator - chunks.144.mjs:1662

---

## Architecture Overview

```
Worktree Flow
│
├── EnterWorktree
│   └── Create isolated environment
│       ├── Git repository: Create git worktree in .claude/worktrees/
│       ├── Non-git: Delegate to WorktreeCreate hooks
│       ├── Switch session working directory
│       └── Return worktree path and branch
│
├── Work Session
│   ├── Independent file modifications
│   ├── Separate git operations
│   └── No interference with main worktree
│
└── ExitWorktree
    └── Leave worktree session
        ├── action: "keep" - Preserve worktree
        └── action: "remove" - Delete worktree
            ├── Git: git worktree remove
            └── Non-git: WorktreeRemove hooks
```

---

## 1. EnterWorktree Tool

### Overview

**What it does:** Creates an isolated git worktree and switches the current session into it. This allows parallel development without affecting the main working directory.

**How it works:**
1. Validates not already in a worktree (prevents nested worktrees)
2. Checks for git repository or WorktreeCreate hooks
3. Creates new worktree in `.claude/worktrees/` with new branch
4. Switches session working directory to worktree
5. Returns worktree path and branch name

### When to Use

**Trigger conditions (from prompt):**
- User explicitly says "worktree" (e.g., "start a worktree", "work in a worktree", "create a worktree", "use a worktree")

**When NOT to use:**
- User asks to create a branch, switch branches, or work on a different branch - use git commands instead
- User asks to fix a bug or work on a feature - use normal git workflow unless they specifically mention worktrees
- Never use this tool unless the user explicitly mentions "worktree"

### Requirements

- Must be in a git repository, OR have WorktreeCreate/WorktreeRemove hooks configured in settings.json
- Must not already be in a worktree

### Implementation

```javascript
// ============================================
// EnterWorktreeTool - Create isolated worktree
// Location: chunks.144.mjs:1783-1850
// ============================================

// ORIGINAL (for source lookup):
g8q = {
    name: sP1,  // "EnterWorktree"
    searchHint: "create an isolated git worktree and switch into it",
    maxResultSizeChars: 1e5,
    async description() {
        return "Creates an isolated worktree (via git or configured hooks) and switches the session into it"
    },
    async prompt() {
        return h8q()  // Returns detailed usage instructions
    },
    get inputSchema() {
        return CIY()  // Zod schema: { name?: string }
    },
    get outputSchema() {
        return IIY()  // Zod schema: { worktreePath: string, worktreeBranch?: string, message: string }
    },
    // ... additional implementation
}

// Mapping: g8q→EnterWorktreeTool, sP1→TOOL_NAME_ENTER_WORKTREE, h8q→getEnterWorktreePrompt
```

### Input Schema

```javascript
// ============================================
// enterWorktreeInputSchema - Input validation
// Location: chunks.144.mjs:1777
// ============================================

// ORIGINAL (for source lookup):
CIY = F6(() => C.strictObject({
    name: C.string().optional().describe("Optional name for the worktree. A random name is generated if not provided.")
}))

// READABLE (for understanding):
const enterWorktreeInputSchema = z.strictObject({
    name: z.string().optional().describe("Optional name for the worktree. A random name is generated if not provided.")
});

// Mapping: CIY→enterWorktreeInputSchema
```

### Output Schema

```javascript
// ============================================
// enterWorktreeOutputSchema - Response format
// Location: chunks.144.mjs:1779
// ============================================

// ORIGINAL (for source lookup):
IIY = F6(() => C.object({
    worktreePath: C.string(),
    worktreeBranch: C.string().optional(),
    message: C.string()
}))

// READABLE (for understanding):
const enterWorktreeOutputSchema = z.object({
    worktreePath: z.string(),
    worktreeBranch: z.string().optional(),
    message: z.string()
});

// Mapping: IIY→enterWorktreeOutputSchema
```

---

## 2. ExitWorktree Tool

### Overview

**What it does:** Exits the current worktree session and returns to the original working directory. Can optionally remove the worktree.

**How it works:**
1. Validates currently in a worktree
2. Processes action parameter ("keep" or "remove")
3. If removing:
   - Git: Executes `git worktree remove`
   - Non-git: Calls WorktreeRemove hooks
4. Restores session working directory to original

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| action | "keep" \| "remove" | Yes | Whether to preserve or delete the worktree |
| discard_changes | boolean | No | Required when removing a worktree with uncommitted changes |

### Behavior

**action: "keep"**
- Leaves the worktree directory and branch intact on disk
- User can return to it later
- Branch can be used for future work

**action: "remove"**
- Deletes the worktree directory
- Removes the branch association
- For git: runs `git worktree remove`
- For non-git: calls WorktreeRemove hooks

---

## 3. Worktree Hook Integration

### WorktreeCreate Hook

**Purpose:** Enable VCS-agnostic worktree isolation for non-git repositories.

**Trigger:** When EnterWorktree is called outside a git repository.

**Hook Input:**
```json
{
  "hook_event_name": "WorktreeCreate",
  "name": "<suggested worktree slug>"
}
```

**Expected Output:**
- Exit code 0: Success, stdout should contain absolute path to created worktree
- Other exit codes: Failure

**Configuration:**
```json
{
  "hooks": {
    "WorktreeCreate": [
      {
        "command": "/path/to/create-worktree.sh"
      }
    ]
  }
}
```

### WorktreeRemove Hook

**Purpose:** Clean up worktree resources for non-git VCS systems.

**Trigger:** When ExitWorktree is called with `action: "remove"`.

**Hook Input:**
```json
{
  "hook_event_name": "WorktreeRemove",
  "worktree_path": "<absolute path to worktree>"
}
```

**Expected Output:**
- Exit code 0: Success
- Other exit codes: Failure (logged as warning, session continues)

---

## 4. Key Implementation Details

### Git Worktree Storage Location

Worktrees are created in: `.claude/worktrees/<name>/`

### Branch Naming

- New branch is created based on HEAD
- Branch name matches worktree name
- Random name generated if not provided

### Session State Changes

When entering a worktree:
- `cwd` is updated to worktree path
- Session context tracks worktree state
- On session exit, user is prompted to keep or remove

### Error Handling

| Error | Cause |
|-------|-------|
| "Cannot create a worktree: not in a git repository..." | No git repo and no WorktreeCreate hooks configured |
| "Cannot create agent worktree..." | Same as above, in agent context |
| "WorktreeCreate hook failed" | Hook returned non-zero exit code |

---

## 5. Use Cases

### Parallel Feature Development
```
Main session: Working on feature-A
EnterWorktree(name="feature-B")
→ Creates isolated environment for feature-B
→ No conflicts with feature-A changes
ExitWorktree(action="keep")
→ Return to main, feature-B worktree preserved
```

### Bug Fix Isolation
```
EnterWorktree(name="hotfix-123")
→ Isolated environment for hotfix
→ Can test without affecting main
ExitWorktree(action="remove")
→ Clean up after fix is merged
```

### Non-Git VCS Integration
```
settings.json:
{
  "hooks": {
    "WorktreeCreate": [{ "command": "p4-create-client.sh" }],
    "WorktreeRemove": [{ "command": "p4-remove-client.sh" }]
  }
}

EnterWorktree() → Triggers WorktreeCreate hook
ExitWorktree(action="remove") → Triggers WorktreeRemove hook
```

---

## Summary

The worktree tools enable:

1. **Isolated Development**: Separate working directories for parallel work
2. **VCS Agnostic**: Git worktrees OR custom hooks for other VCS
3. **Session Integration**: Seamless working directory switching
4. **Flexible Cleanup**: Keep for later or remove when done

**Key Design Decisions:**
- Only triggers on explicit "worktree" keyword to avoid confusion with git branching
- Requires git OR hooks to prevent usage errors
- Hook system enables extensibility beyond git