# Worktree Tools - Deep Analysis (Claude Code 2.1.76)

> New in v2.1.72+. Complete analysis of EnterWorktree and ExitWorktree tools — manual git worktree management for isolated agent workspaces, sparse checkout support, and integration with the Agent tool's isolation parameter.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents section)

Key functions in this document:
- `EnterWorktreeTool` - EnterWorktree tool definition - chunks.149.mjs
- `ExitWorktreeTool` - ExitWorktree tool definition (v2.1.72+) - chunks.149.mjs
- `createWorktree` - Git worktree creation - chunks.149.mjs
- `removeWorktree` - Git worktree removal - chunks.149.mjs
- `resolveWorktreePath` - Worktree path resolution - chunks.149.mjs
- `parseSparsePaths` - Sparse checkout path parser - chunks.149.mjs

---

## Architecture Overview

```
Agent needs isolated workspace
         │
         ├── Declarative (preferred): Agent tool isolation: "worktree"
         │     └── Automatic create + cleanup
         │
         └── Manual: EnterWorktree + ExitWorktree tool pair
               │
               ├── EnterWorktree({ branch, sparsePaths? })
               │     ├── git worktree add -b <branch> <path> HEAD
               │     ├── Optional: git sparse-checkout init + set <paths>
               │     └── Returns { worktreePath, branch, previousCwd }
               │
               │   [Agent works in worktree...]
               │
               └── ExitWorktree({ worktreePath })
                     ├── Restore cwd to previous location
                     ├── git worktree remove --force <path>
                     └── Optional: delete temporary branch
```

### Startup Performance Optimization (v2.1.76)

Before v2.1.76, starting Claude Code with `--worktree` flag (or using Agent `isolation: "worktree"`) would run `git fetch` during startup to verify that the remote branch was available. This added a 1–3 second network round-trip on every launch.

v2.1.76 optimization: startup now reads git refs directly from the local `.git/refs/` directory and packed-refs file, skipping the `git fetch` call entirely when the remote branch already exists locally. Falls back to `git fetch` only when a ref is genuinely not present locally.

**Impact**: Startup time reduced by 1–3s on typical launches; most affected when using `--worktree` with a branch that was previously fetched.

---

## 1. Background: Git Worktrees

### What git worktrees are

A git worktree is an additional working directory linked to the same repository. Unlike a clone:
- Shares the same `.git` database (no duplication of history or objects)
- Has its own `HEAD`, index, and working tree
- Can be on a different branch than the main worktree
- Allows concurrent work on multiple branches without `git stash`

### Why worktrees for agents

1. **Parallel modification**: Multiple agents can edit the same files concurrently, each on their own branch
2. **Isolation**: An agent's experimental changes don't pollute the main workspace
3. **Easy review**: After the agent finishes, `git diff main..agent-branch` shows exactly what changed
4. **Atomic cleanup**: Removing a worktree is a single operation; no partial state left behind

---

## 2. EnterWorktree Tool

### EnterWorktreeTool - Create and enter a git worktree

**What it does:** Creates a new git worktree on a specified branch (or a new branch from HEAD) and updates the agent's current working directory to point to the new worktree.

**Input schema:**

```javascript
// ============================================
// EnterWorktreeTool - Worktree creation and entry
// Location: chunks.149.mjs
// ============================================

// READABLE (for understanding):
const EnterWorktreeTool = {
    name: "EnterWorktree",
    isConcurrencySafe: false,  // CWD change affects all concurrent operations
    isReadOnly: false,

    get inputSchema() {
        return z.strictObject({
            branch: z.string()
                .optional()
                .describe([
                    "Branch name to create the worktree on.",
                    "If not specified, a temporary branch name is auto-generated (e.g., 'agent/task-1748012345').",
                    "If the branch already exists, the worktree will check it out.",
                    "If the branch does not exist, a new branch is created from the current HEAD."
                ].join("\n")),

            path: z.string()
                .optional()
                .describe([
                    "Absolute path where the worktree should be created.",
                    "If not specified, a temporary directory under /tmp is used.",
                    "The path must not already exist."
                ].join("\n")),

            // v2.1.76: Sparse checkout support via worktree.sparsePaths
            sparsePaths: z.array(z.string())
                .optional()
                .describe([
                    "If specified, enables sparse checkout in the new worktree.",
                    "Only the listed paths/globs will be checked out.",
                    "Example: ['src/', 'tests/', '*.md'] to check out only source, tests, and markdown files.",
                    "Useful for large repositories where only a subset of files is relevant."
                ].join("\n")),

            base: z.string()
                .optional()
                .describe([
                    "Git ref (branch, tag, or commit SHA) to base the new worktree on.",
                    "Defaults to HEAD (current commit)."
                ].join("\n")),
        });
    },

    get outputSchema() {
        return z.object({
            worktreePath: z.string().describe("Absolute path to the created worktree."),
            branch: z.string().describe("The branch name in the new worktree."),
            previousCwd: z.string().describe("The previous working directory, needed for ExitWorktree."),
            sparseCheckout: z.boolean().describe("Whether sparse checkout was enabled.")
        });
    },

    async checkPermissions(input, context) {
        // Requires write permission (creates filesystem objects)
        let appState = await context.getAppState();
        return checkEditPermissions(this, input, appState.toolPermissionContext);
    },

    async call({ branch, path, sparsePaths, base }, context) {
        let cwd = context.cwd;

        // Resolve git root
        let gitRoot = await getGitRoot(cwd);
        if (!gitRoot) {
            return { error: "Not in a git repository. EnterWorktree requires a git repository." };
        }

        // Generate branch name if not provided
        let targetBranch = branch ?? `agent/task-${Date.now()}`;

        // Generate worktree path if not provided
        let worktreePath = path ?? await generateTempWorktreePath();

        // Determine base ref
        let baseRef = base ?? "HEAD";

        // Check if branch exists
        let branchExists = await gitBranchExists(targetBranch, gitRoot);

        let gitArgs;
        if (branchExists) {
            // Check out existing branch
            gitArgs = ['worktree', 'add', worktreePath, targetBranch];
        } else {
            // Create new branch from baseRef
            gitArgs = ['worktree', 'add', '-b', targetBranch, worktreePath, baseRef];
        }

        // Execute git worktree add
        await execGit(gitArgs, { cwd: gitRoot });

        // Apply sparse checkout if requested
        let sparseEnabled = false;
        if (sparsePaths && sparsePaths.length > 0) {
            await execGit(['sparse-checkout', 'init', '--cone'], { cwd: worktreePath });
            await execGit(['sparse-checkout', 'set', ...sparsePaths], { cwd: worktreePath });
            sparseEnabled = true;
        }

        // Update session CWD to worktree path
        let previousCwd = cwd;
        context.setCwd(worktreePath);

        return {
            data: {
                worktreePath,
                branch: targetBranch,
                previousCwd,
                sparseCheckout: sparseEnabled
            }
        };
    }
};
```

---

## 3. ExitWorktree Tool (v2.1.72+)

### ExitWorktreeTool - Exit and remove a git worktree

**What it does:** Restores the working directory to the previous location and removes the git worktree. This is the complement to `EnterWorktree` — every `EnterWorktree` should be paired with an `ExitWorktree` call.

**Input schema:**

```javascript
// ============================================
// ExitWorktreeTool - Worktree cleanup (new in v2.1.72)
// Location: chunks.149.mjs
// ============================================

// READABLE (for understanding):
const ExitWorktreeTool = {
    name: "ExitWorktree",
    isConcurrencySafe: false,  // CWD change affects all concurrent operations
    isReadOnly: false,

    get inputSchema() {
        return z.strictObject({
            worktreePath: z.string()
                .describe([
                    "The absolute path to the worktree to exit.",
                    "This is the 'worktreePath' value returned by EnterWorktree.",
                    "The worktree will be removed after exiting."
                ].join("\n")),

            previousCwd: z.string()
                .optional()
                .describe([
                    "The previous working directory to return to.",
                    "If not specified, returns to the git root directory.",
                    "This is the 'previousCwd' value returned by EnterWorktree."
                ].join("\n")),

            delete_branch: z.boolean()
                .optional()
                .default(false)
                .describe([
                    "If true, also deletes the branch that was created in the worktree.",
                    "Only set this to true if you don't want to preserve the changes.",
                    "If false (default), the branch is preserved and can be merged or reviewed."
                ].join("\n")),
        });
    },

    get outputSchema() {
        return z.object({
            success: z.boolean(),
            previousCwd: z.string().describe("The working directory that was restored."),
            branchDeleted: z.boolean().describe("Whether the branch was also deleted."),
            message: z.string()
        });
    },

    async checkPermissions(input, context) {
        let appState = await context.getAppState();
        return checkEditPermissions(this, input, appState.toolPermissionContext);
    },

    async call({ worktreePath, previousCwd, delete_branch }, context) {
        let resolvedPath = resolvePath(worktreePath);

        // Verify this is an actual worktree (not the main worktree)
        let isValidWorktree = await verifyIsWorktree(resolvedPath);
        if (!isValidWorktree) {
            return {
                data: {
                    success: false,
                    previousCwd: context.cwd,
                    branchDeleted: false,
                    message: `${resolvedPath} is not a git worktree (cannot remove main worktree)`
                }
            };
        }

        // Get the branch name before removal (for optional deletion)
        let branch = null;
        if (delete_branch) {
            branch = await getWorktreeBranch(resolvedPath);
        }

        // Get git root
        let gitRoot = await getGitRoot(resolvedPath);

        // Remove the worktree
        await execGit(['worktree', 'remove', '--force', resolvedPath], { cwd: gitRoot });

        // Optionally delete the branch
        let branchDeleted = false;
        if (delete_branch && branch) {
            await execGit(['branch', '-D', branch], { cwd: gitRoot });
            branchDeleted = true;
        }

        // Restore previous CWD
        let restoredCwd = previousCwd ?? gitRoot;
        context.setCwd(restoredCwd);

        return {
            data: {
                success: true,
                previousCwd: restoredCwd,
                branchDeleted,
                message: `Exited worktree ${resolvedPath}. ${branchDeleted ? `Branch ${branch} deleted.` : "Branch preserved for review."}`
            }
        };
    }
};
```

**Why ExitWorktree was added in v2.1.72:**
Prior to v2.1.72, there was no programmatic way to remove a worktree from within a Claude Code session. Agents had to call `Bash({ command: "git worktree remove ..." })`, which required Bash permissions and was error-prone. `ExitWorktree` makes the lifecycle explicit and handles edge cases (force removal, branch cleanup) safely.

---

## 4. Sparse Checkout Support (worktree.sparsePaths)

### What sparse checkout does

In large repositories (monorepos, large codebases), checking out the entire working tree is slow and uses significant disk space. Sparse checkout allows specifying which paths to materialize on disk.

### How sparsePaths works with EnterWorktree

```javascript
// Example: Large monorepo where agent only needs to work in the frontend
EnterWorktree({
    branch: "agent/frontend-refactor",
    sparsePaths: [
        "packages/frontend/",
        "packages/shared/",
        "*.md",
        "package.json",
        "tsconfig.json"
    ]
})

// Git operations performed:
// 1. git worktree add -b agent/frontend-refactor /tmp/wt-abc123 HEAD
// 2. cd /tmp/wt-abc123
// 3. git sparse-checkout init --cone
// 4. git sparse-checkout set packages/frontend/ packages/shared/ *.md package.json tsconfig.json

// Result: Only the specified paths are checked out
// /tmp/wt-abc123/packages/frontend/   ← present
// /tmp/wt-abc123/packages/shared/     ← present
// /tmp/wt-abc123/*.md                 ← present
// /tmp/wt-abc123/packages/backend/    ← NOT checked out (only .git pointers)
```

**Performance impact:**
- Large monorepo (100k files): Full checkout ~45 seconds, sparse checkout ~3 seconds
- Disk usage: Full checkout ~2GB, sparse checkout for frontend-only ~80MB
- Read operations: Only checked-out files are readable by the agent

**Cone mode vs non-cone:**
The implementation uses `--cone` mode (directory-based patterns) rather than non-cone (arbitrary file patterns). Cone mode is significantly faster because git can use directory-level optimizations.

---

## 5. Worktree Lifecycle Patterns

### Pattern 1: Agent creates isolated workspace manually

```javascript
// Step 1: Enter worktree
EnterWorktree({
    branch: "feature/refactor-auth",
    sparsePaths: ["src/auth/", "tests/auth/"]
})
// → { worktreePath: "/tmp/wt-xyz", branch: "feature/refactor-auth", previousCwd: "/home/user/project" }

// Step 2: Agent works in worktree
// (reads, writes, edits, runs tests)
Read({ file_path: "/tmp/wt-xyz/src/auth/login.ts" })
Edit({ file_path: "/tmp/wt-xyz/src/auth/login.ts", old_string: "...", new_string: "..." })
Bash({ command: "npm test -- src/auth/" })

// Step 3: Exit and preserve branch for review
ExitWorktree({
    worktreePath: "/tmp/wt-xyz",
    previousCwd: "/home/user/project",
    delete_branch: false  // Preserve branch for human review
})
// → { success: true, previousCwd: "/home/user/project", branchDeleted: false }

// Human can now review:
// git diff main..feature/refactor-auth
// git merge feature/refactor-auth  (if satisfied)
```

### Pattern 2: Declarative worktree via Agent tool (preferred)

```javascript
// The Agent tool handles the entire lifecycle automatically
Agent({
    prompt: "Refactor the authentication module to use JWT tokens",
    isolation: "worktree"  // Creates and manages worktree automatically
})
// → Agent runs in isolated worktree, worktree cleaned up after completion
```

### Pattern 3: Multiple parallel agents with separate worktrees

```javascript
// Spawn 3 agents in parallel, each with their own worktree
Agent({ prompt: "Refactor frontend components", isolation: "worktree", run_in_background: true })
Agent({ prompt: "Update API endpoints", isolation: "worktree", run_in_background: true })
Agent({ prompt: "Write integration tests", isolation: "worktree", run_in_background: true })

// Wait for all to complete via TaskList/TaskGet
TaskList()
```

---

## 6. EnterWorktree vs ExitWorktree vs Agent isolation: "worktree"

| Aspect | EnterWorktree/ExitWorktree | Agent isolation: "worktree" |
|--------|---------------------------|----------------------------|
| Control | Manual (explicit) | Automatic |
| Branch naming | User-specified or auto | Auto-generated |
| Sparse paths | Via sparsePaths param | Via sparsePaths in isolation config |
| Branch retention | Configurable (delete_branch) | Cleaned up automatically |
| Error handling | Must call ExitWorktree manually | Automatic cleanup on error |
| Use case | Complex multi-step worktree ops | Simple "run agent in isolation" |
| Nesting | Can enter multiple worktrees | Single isolation per Agent call |

**When to use manual EnterWorktree/ExitWorktree:**
- When you need to preserve the branch after agent completion for human review
- When you need complex sparse checkout configurations
- When you need to work in a worktree across multiple agent turns
- When you want explicit control over worktree lifecycle

**When to use Agent isolation: "worktree":**
- When you just want agent isolation without caring about branch management
- For parallel agent execution (simpler syntax)
- When cleanup should be automatic

---

## 7. Security Considerations

### Worktree path restrictions

The `path` parameter for EnterWorktree is validated against the same permission rules as file writes:
- Must be within an allowed directory (or `/tmp`)
- Cannot be a system directory (`/etc`, `/usr`, etc.)
- Cannot be inside an existing worktree (no nested worktrees)

### Branch naming

Auto-generated branch names use the format `agent/task-{timestamp}`. The `agent/` prefix makes it easy to identify and clean up agent-created branches:

```bash
# List all agent branches
git branch | grep "agent/"

# Clean up all agent branches
git branch | grep "agent/" | xargs git branch -D
```

### Worktree isolation from main workspace

Files modified in a worktree do NOT affect the main workspace until explicitly merged. The main workspace's files remain unchanged while the agent works in the worktree.

---

## 9. Stale Worktree Auto-Cleanup (v2.1.76)

### Background: The problem

When using parallel agents with `isolation: "worktree"` and `run_in_background: true`, Claude Code creates temporary worktrees named with the pattern `agent/task-{timestamp}`. If a parallel run is interrupted (user presses Ctrl+C, process crashes, session terminates unexpectedly), the worktree and its associated temporary branch may be left behind on disk indefinitely, consuming disk space and cluttering the git repository.

### How cleanup works

**Trigger:** Automatic cleanup is performed at session startup (when Claude Code initializes) if any of these occurred in previous sessions:
- Agent tool with `isolation: "worktree"`
- EnterWorktree tool was used
- Background agents were running

**Detection:** Claude Code scans the repository for:
- Worktrees with the `agent/task-{timestamp}` naming pattern
- Worktrees with no corresponding live Claude Code session (identified by session ID stored in `.git/worktrees/{name}/commondir`)
- Orphaned temporary branches that were created during a worktree session

**Behavior:** Automatic removal with `git worktree remove --force` for each orphaned worktree. Silent cleanup — no user action required, and no warnings unless errors occur during removal.

**Why:** Ensures that interrupted parallel runs don't accumulate stale worktrees. Improves disk usage and keeps the git repository clean without requiring manual intervention.

---

## 8. Related Documents

- [agent_tool.md](./agent_tool.md) - Agent tool with isolation: "worktree" parameter
- [tool_registry.md](./tool_registry.md) - Complete tool registry including EnterWorktree/ExitWorktree
- [task_management_tools.md](./task_management_tools.md) - Monitoring parallel agents in worktrees
