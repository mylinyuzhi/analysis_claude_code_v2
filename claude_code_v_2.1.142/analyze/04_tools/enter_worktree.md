# Tool: EnterWorktree — Create or Enter a Git Worktree

> **Identity:** wire-name `EnterWorktree`, userFacingName `"Entering worktree"` or `"Creating worktree"` (depends on whether `path` is set), `shouldDefer: true`, `maxResultSizeChars: 100_000`.
> **Source:** `cli_inner_pretty.js:383946-384063` (declaration), `assets/tools/EnterWorktree.md` (tool def).

EnterWorktree creates an isolated git worktree (or enters an existing one) and switches the current session into it. The session's working directory, plan files, system prompt cache, and (optionally) tmux pane are all redirected to the worktree.

This is one of the most consequential tools in the suite — it process-globally changes the session's `cwd`, affecting all subsequent tool calls until ExitWorktree.

---

## Overview

Three operational modes:

1. **New worktree (no params)**: Generate a random branch name, create at `.claude/worktrees/<random>`.
2. **Named new worktree (`name` param)**: Create at `.claude/worktrees/<name>` on branch `<name>`.
3. **Enter existing worktree (`path` param, v2.1.105)**: Switch into a worktree that already exists (created via `git worktree add` externally, or by another tool). The path must be in `git worktree list`.

The base branch for new worktrees is governed by the `worktree.baseRef` setting (v2.1.133):
- `"fresh"` (default): branch from `origin/<default-branch>` — a clean tip from upstream.
- `"head"`: branch from current HEAD — includes any uncommitted committed work.

Outside a git repository, the tool delegates to `WorktreeCreate`/`WorktreeRemove` hooks for VCS-agnostic isolation. If the hooks aren't configured, the call fails.

---

## Input Schema (`Ee_`)

```javascript
// ============================================
// enterWorktreeInputSchema - Mutually exclusive name/path with name validation
// Location: cli_inner_pretty.js:383963-383987 (Ee_)
// ============================================

// ORIGINAL (for source lookup):
Ee_ = yH(() =>
  y.strictObject({
    name: y.string()
      .superRefine((H, $) => {
        try { SiH(H); }
        catch (q) { $.addIssue({ code: "custom", message: ZH(q) }); }
      })
      .optional()
      .describe('Optional name for a new worktree. Each "/"-separated segment may contain only letters, digits, dots, underscores, and dashes; max 64 chars total. ...'),
    path: y.string().optional().describe("Path to an existing worktree of the current repository to switch into instead of creating a new one. ..."),
  }).refine((H) => !(H.name && H.path), { message: "Provide at most one of `name` or `path`, not both." }),
);

// READABLE (for understanding):
enterWorktreeInputSchema = lazy(() =>
  z.strictObject({
    name: z.string()
      .superRefine((value, ctx) => {
        try {
          validateWorktreeSlug(value);  // letters/digits/dots/underscores/dashes; segments by /; max 64 chars
        } catch (err) {
          ctx.addIssue({ code: "custom", message: extractErrorMessage(err) });
        }
      })
      .optional()
      .describe("Optional name for a new worktree (slug validation)"),
    path: z.string().optional().describe("Path to existing worktree"),
  }).refine(
    (input) => !(input.name && input.path),
    { message: "Provide at most one of `name` or `path`, not both." },
  ),
);

// Mapping: Ee_→enterWorktreeInputSchema, SiH→validateWorktreeSlug, yH→lazy, y→z, ZH→extractErrorMessage
```

### Name Validation (`SiH`)

The slug validator enforces:
- Each `/`-separated segment may contain only letters, digits, dots, underscores, and dashes.
- Total length max 64 chars.
- Empty segments rejected.

**Why these restrictions:** The worktree name becomes both a directory name (`.claude/worktrees/<name>`) and a git branch name. Both have implicit constraints — branch names with spaces or special chars break `git checkout`, paths with `..` could escape `.claude/worktrees/`. The slug schema is the union of both safe-name policies.

**Why `/`-segments allowed:** Branch names like `feature/auth` are common. The validator accepts `/` as a separator and validates each segment independently. The path `.claude/worktrees/feature/auth/` is the resulting filesystem layout.

### Mutex (`name` vs `path`)

The `refine` callback rejects calls that pass both. Conceptually:
- `name` → create new worktree with this name
- `path` → enter existing worktree at this path

These are different operations; allowing both would force a precedence rule that the model would likely misunderstand. Rejecting the combo at validation time forces a clean choice.

If neither is provided, a random name is generated.

---

## validateInput

```javascript
// ============================================
// validateEnterWorktree - Context preconditions
// Location: cli_inner_pretty.js:384014-384027 (in qn7.validateInput)
// ============================================

// ORIGINAL (for source lookup):
async validateInput() {
  if (xRH()) return { result: !1, message: `EnterWorktree cannot be called from a subagent with a cwd override ...`, errorCode: 1 };
  if (oz()) return { result: !1, message: "Already in a worktree session. ...", errorCode: 2 };
  return { result: !0 };
}

// READABLE (for understanding):
async function validateEnterWorktree() {
  // Block 1: Reject if running in subagent with cwd override
  if (hasCwdOverrideInSubagent()) {
    return {
      result: false,
      message: 'EnterWorktree cannot be called from a subagent with a cwd override (isolation: "worktree" or explicit cwd) — it would mutate the parent session\'s process-wide working directory. This agent is already isolated in its own working copy.',
      errorCode: 1,
    };
  }
  // Block 2: Reject if already in a worktree session
  if (isInWorktreeSession()) {
    return {
      result: false,
      message: "Already in a worktree session. Use ExitWorktree to leave it before entering another.",
      errorCode: 2,
    };
  }
  return { result: true };
}

// Mapping: xRH→hasCwdOverrideInSubagent, oz→isInWorktreeSession
```

### Why Block in Subagents (`xRH`)

A subagent invoked with `isolation: "worktree"` is *already* in a worktree (created by the Agent tool). If that subagent calls EnterWorktree, the behavior would be either:
- Reject — current behavior. The subagent's filesystem is isolated; another worktree is wasted overhead.
- Allow — would `process.chdir` the parent's process state. The parent's session would mysteriously switch directories when the subagent finishes — a confusing bug.

Rejecting at validation time is the safer choice. The error message tells the subagent it's already isolated, so no further action is needed.

### Why Block Re-Entry (`oz`)

Worktrees are session-scoped. A second EnterWorktree without an intervening ExitWorktree would orphan the first worktree (losing the original-cwd revert state). The error forces the model to ExitWorktree first.

---

## call() — The Switch

```javascript
// ============================================
// callEnterWorktree - Create or enter, switch cwd, refresh session state
// Location: cli_inner_pretty.js:384031-384058 (in qn7.call)
// ============================================

// ORIGINAL (for source lookup):
async call(H) {
  if (oz()) throw Error("Already in a worktree session");
  let $;
  if (H.path) $ = await DE6(v$(), H.path);
  else {
    let _ = BY(I$());
    if (_ && _ !== I$()) (process.chdir(_), KD(_));
    $ = await DL$(v$(), H.name ?? PDH(), void 0);
  }
  (process.chdir($.worktreePath),
    KD($.worktreePath),
    RN(I$()),
    Ib($),
    we(),
    G0(),
    SO.cache.clear?.(),
    CV()?.refreshGitBranch?.(),
    d(H.path ? "tengu_worktree_entered_existing" : "tengu_worktree_created", { mid_session: !0 }));
  let q = $.worktreeBranch ? ` on branch ${$.worktreeBranch}` : "",
    K = H.path ? "Entered" : "Created";
  return {
    data: {
      worktreePath: $.worktreePath,
      worktreeBranch: $.worktreeBranch,
      message: `${K} worktree at ${$.worktreePath}${q}. The session is now working in the worktree. Use ExitWorktree to leave mid-session, or exit the session to be prompted.`,
    },
  };
}

// READABLE (for understanding):
async function callEnterWorktree({ name, path: existingPath }) {
  if (isInWorktreeSession()) throw new Error("Already in a worktree session");
  let worktreeInfo;

  // Branch A: Enter existing worktree
  if (existingPath) {
    worktreeInfo = await enterExistingWorktree(getSessionId(), existingPath);
  }
  // Branch B: Create new worktree
  else {
    // If the current directory is inside the repo's worktree but not at the root, normalize to root
    const repoRoot = getRepoRoot(getCwd());
    if (repoRoot && repoRoot !== getCwd()) {
      process.chdir(repoRoot);
      updateCwd(repoRoot);
    }
    worktreeInfo = await createNewWorktree(
      getSessionId(),
      name ?? generateRandomWorktreeName(),
      undefined,  // baseRef defaults from settings
    );
  }

  // Switch process cwd and update all caches
  process.chdir(worktreeInfo.worktreePath);
  updateCwd(worktreeInfo.worktreePath);
  registerWorktreeOldCwd(getCwd());
  saveWorktreeSession(worktreeInfo);
  resetMemoryCache();
  resetPlansDirCache();
  clearReadCache();
  refreshGitBranchInUI();
  logEvent(
    existingPath ? "tengu_worktree_entered_existing" : "tengu_worktree_created",
    { mid_session: true },
  );

  const branchSuffix = worktreeInfo.worktreeBranch ? ` on branch ${worktreeInfo.worktreeBranch}` : "";
  const verb = existingPath ? "Entered" : "Created";
  return {
    data: {
      worktreePath: worktreeInfo.worktreePath,
      worktreeBranch: worktreeInfo.worktreeBranch,
      message: `${verb} worktree at ${worktreeInfo.worktreePath}${branchSuffix}. ...`,
    },
  };
}

// Mapping: H→input, oz→isInWorktreeSession, $→worktreeInfo, DE6→enterExistingWorktree,
//          DL$→createNewWorktree, BY→getRepoRoot, I$→getCwd, KD→updateCwd, RN→registerWorktreeOldCwd,
//          Ib→saveWorktreeSession, we→resetMemoryCache, G0→resetPlansDirCache, SO.cache.clear→clearReadCache,
//          CV→getActiveSession, PDH→generateRandomWorktreeName, v$→getSessionId, d→logEvent
```

### Why Normalize to Repo Root Before Creating

If the user is in a subdirectory of the repo (e.g., `src/components/`) and calls EnterWorktree without `path`, the new worktree should be created relative to the *repo root*, not the current subdirectory. The lines:

```javascript
const repoRoot = getRepoRoot(getCwd());
if (repoRoot && repoRoot !== getCwd()) {
  process.chdir(repoRoot);
  updateCwd(repoRoot);
}
```

normalize to root first. Then `.claude/worktrees/<name>` is at the right location.

**Why this matters:** Worktrees registered with `git worktree add` are scoped to the main repository. Creating them from a subdirectory works in most cases but can confuse git tooling in edge cases (worktree path stored as relative). Normalizing to root is the canonical pattern.

### Cache Invalidations on Switch

After the `process.chdir(worktreePath)`, the session's caches need refreshing:

| Cache | Why |
|-------|-----|
| Memory cache (`we`) | The new cwd has its own `CLAUDE.md`/memory files — must re-read from this location. |
| Plans dir cache (`G0`) | Per-session plans live under `.claude/plans/`, which is now in the worktree. |
| Read cache (`SO.cache.clear`) | The Read tool caches file content by absolute path — but `path.resolve(".")` resolves differently after chdir. Invalidate to force re-read. |
| Git branch (`refreshGitBranch`) | UI shows the current branch; the worktree's branch differs from the original. |

**Why `RN(I$())` (`registerWorktreeOldCwd(getCwd())`):** Saves the *pre-chdir* cwd so ExitWorktree can restore it. The capture happens before the next `process.chdir`.

---

## Existing-Worktree Path (`DE6`, v2.1.105 → v2.1.142)

The `path` parameter was added in v2.1.105 and refined in v2.1.142 to fix the "background sessions not recognizing pre-existing git worktrees" bug. The handler:

```javascript
// ============================================
// enterExistingWorktree - Switch into existing worktree, validating registration
// Location: cli_inner_pretty.js:523107-523141 (DE6)
// ============================================

// ORIGINAL (for source lookup):
async function DE6(H, $) {
  let q = I$(), K = BY(q);
  if (!K) throw Error("Cannot enter an existing worktree: the current directory is not in a git repository.");
  let _, A, z;
  try {
    _ = await eY.realpath(ZM.resolve(q, $));
    A = await eY.realpath(K);
    z = await eY.realpath(q);
  } catch (M) {
    throw Error(`Cannot enter worktree: ${$}: ${ZH(M)}`);
  }
  if (_ === A) throw Error(`Cannot enter worktree: ${$} is the main working tree, not a linked worktree.`);
  if (_ === z) throw Error(`Cannot enter worktree: ${$} is the current working directory.`);
  let Y = await NP8(K), f;
  for (let M of Y)
    try { if ((await eY.realpath(M.worktreePath)) === _) { f = M; break; } } catch {}
  if (!f)
    throw Error(`Cannot enter worktree: ${$} is not a registered worktree of ${K}. Run 'git -C ${K} worktree list' to see registered worktrees.`);
  let O = {
    originalCwd: q,
    worktreePath: _,
    worktreeName: ZM.basename(_),
    worktreeBranch: f.worktreeBranch,
    sessionId: H,
    enteredExisting: !0,
  };
  return ($JH(O), O);
}

// READABLE (for understanding):
async function enterExistingWorktree(sessionId, requestedPath) {
  const currentCwd = getCwd();
  const repoRoot = getRepoRoot(currentCwd);
  if (!repoRoot) {
    throw new Error("Cannot enter an existing worktree: the current directory is not in a git repository.");
  }

  // Resolve to canonical paths (follow symlinks, normalize separators)
  let resolvedTarget, resolvedRepoRoot, resolvedCurrent;
  try {
    resolvedTarget = await fs.realpath(path.resolve(currentCwd, requestedPath));
    resolvedRepoRoot = await fs.realpath(repoRoot);
    resolvedCurrent = await fs.realpath(currentCwd);
  } catch (err) {
    throw new Error(`Cannot enter worktree: ${requestedPath}: ${extractErrorMessage(err)}`);
  }

  // Sanity checks
  if (resolvedTarget === resolvedRepoRoot) {
    throw new Error(`Cannot enter worktree: ${requestedPath} is the main working tree, not a linked worktree.`);
  }
  if (resolvedTarget === resolvedCurrent) {
    throw new Error(`Cannot enter worktree: ${requestedPath} is the current working directory.`);
  }

  // Verify the path is registered in git worktree list
  const registeredWorktrees = await listRepoWorktrees(repoRoot);
  let matchedEntry;
  for (const entry of registeredWorktrees) {
    try {
      if ((await fs.realpath(entry.worktreePath)) === resolvedTarget) {
        matchedEntry = entry;
        break;
      }
    } catch {
      // Skip unreachable worktrees
    }
  }
  if (!matchedEntry) {
    throw new Error(`Cannot enter worktree: ${requestedPath} is not a registered worktree of ${repoRoot}. Run 'git -C ${repoRoot} worktree list' to see registered worktrees.`);
  }

  // Build session state and persist
  const sessionInfo = {
    originalCwd: currentCwd,
    worktreePath: resolvedTarget,
    worktreeName: path.basename(resolvedTarget),
    worktreeBranch: matchedEntry.worktreeBranch,
    sessionId,
    enteredExisting: true,  // <-- distinguishes from "created"
  };
  saveWorktreeSession(sessionInfo);
  return sessionInfo;
}

// Mapping: DE6→enterExistingWorktree, H→sessionId, $→requestedPath, q→currentCwd, K→repoRoot,
//          _→resolvedTarget, A→resolvedRepoRoot, z→resolvedCurrent, Y→registeredWorktrees,
//          f→matchedEntry, M→entry, NP8→listRepoWorktrees, $JH→saveWorktreeSession, BY→getRepoRoot,
//          ZM→path, eY→fs, O→sessionInfo
```

### Why `realpath` Everywhere

Git allows worktrees to be symlinks. The user might have `./my-worktree` as a symlink to `/var/scratch/my-worktree-real`. Comparing the input path against `git worktree list` output would fail if one is the symlink and the other is the target.

`fs.realpath` resolves all symlinks to the canonical absolute path. All three paths (input, repo root, current cwd) are canonicalized before comparison, so symlinks don't cause false negatives.

### Why the Two Self-Match Rejections

- **`resolvedTarget === resolvedRepoRoot`**: Trying to "enter" the main working tree as a worktree. This is meaningless — the main working tree is not a linked worktree. Reject with a clear message.
- **`resolvedTarget === resolvedCurrent`**: Trying to enter the current cwd. The implicit operation is a no-op (we're already there), but the system would still create a session record and start tracking — which would break ExitWorktree later. Reject to keep state clean.

### `enteredExisting: true` — The Key Distinction

The session info has a critical flag: `enteredExisting`. Set to `true` for path-based entries, `false` (default) for newly-created worktrees.

This flag controls ExitWorktree behavior:
- **Created worktrees**: ExitWorktree can `remove` them — the tool created them, it can clean up.
- **Existing worktrees**: ExitWorktree refuses to `remove` them. They predate the session; another agent or user may need them. Only `keep` is valid for existing worktrees.

**v2.1.142 bug fix:** Pre-v2.1.142, background sessions had a bug where they could not recognize a pre-existing git worktree:

> Fixed background sessions not recognizing pre-existing git worktrees, blocking Edit while EnterWorktree refused to create a duplicate

The scenario: a background session is launched in directory `D`, which is itself a git worktree of repo `R` (not the main working tree). The session tries to do Edit work, but the permission system blocks because the cwd is detected as a worktree without a session record. Calling EnterWorktree would refuse to create a duplicate at `D` (already a worktree). Stuck.

The v2.1.142 fix: the daemon now detects this scenario at session start and automatically calls `enterExistingWorktree(sessionId, currentCwd)` to register the existing worktree as the session's active worktree. The Edit unblocks; ExitWorktree (if called) will only `keep` since it's a pre-existing worktree.

---

## Render Methods

```javascript
renderToolUseMessage: el7,        // Shows worktree name or path
renderToolResultMessage: Hn7,    // Banner: "Switched to worktree on branch <branch>"
```

The `Hn7` result renderer produces an Ink JSX element:
```
┌─────────────────────────────────────────┐
│ Switched to worktree on branch foo/bar  │
│ /path/to/.claude/worktrees/foo/bar      │
└─────────────────────────────────────────┘
```

The path is rendered dimColor — secondary information. The branch name is bolded.

---

## userFacingName

```javascript
userFacingName(H) {
  return H?.path ? "Entering worktree" : "Creating worktree";
}
```

The verb adapts to which operation is happening. "Creating" for new worktrees, "Entering" for existing-path entries. This is the only tool in the suite where `userFacingName` is param-dependent.

---

## Key Insights

- **Process-global chdir is the side effect**: After EnterWorktree, `process.cwd()` is the worktree path. Every subsequent tool call in this session sees this cwd. Parallel tools running in the same process must coordinate (they do — Node.js is single-threaded for cwd access).

- **`worktree.baseRef` is implicit, not in the tool schema**: The setting governs default branch base for newly created worktrees. The model can't override per-call — that would tempt models to mis-set base refs.

- **`enteredExisting: true` is a one-way ratchet**: Once set, ExitWorktree can only `keep`. There's no API to "promote" an entered worktree to a created one (which would let it be removed).

- **Symlink resolution prevents false negatives**: Without `realpath`, a user with symlinked worktrees would see "not a registered worktree" errors. The canonicalization step ensures symlinks work correctly.

- **The v2.1.142 background-session fix is in the daemon, not the tool**: The tool itself didn't change — what changed is who calls it. The daemon now detects pre-existing worktrees at session-start and auto-registers them. The tool just receives the call.

- **Tool's prompt explicitly limits invocation**: The model is told only to call this tool when the user mentions "worktree" or when CLAUDE.md/memory directs it. Calling proactively (without instruction) is forbidden. This is to prevent the model from creating worktrees the user didn't request, which would accumulate cruft.

---

## v2.1.112 → v2.1.142 Deltas

| Version | Change |
|---------|--------|
| v2.1.105 | `path` parameter added — switch into existing worktree without creating. |
| v2.1.117 | `enteredExisting` flag to distinguish created vs entered. |
| v2.1.121 | `WorktreeCreate`/`WorktreeRemove` hook delegation for non-git VCS. |
| v2.1.125 | Symlink resolution via `realpath` on all three comparison paths. |
| v2.1.133 | `worktree.baseRef` setting (`fresh`/`head`) controls default branch base. |
| v2.1.136 | Per-segment slug validation (each `/`-separated segment validated). |
| v2.1.140 | Telemetry distinguishes `tengu_worktree_created` vs `tengu_worktree_entered_existing`. |
| v2.1.142 | Background-session auto-recognition of pre-existing worktrees (daemon-side fix). EnterWorktree's `validateInput` reorders the subagent check before the in-worktree check for cleaner error messages. |

---

## Related Documents

- [exit_worktree.md](exit_worktree.md) — the companion tool for leaving worktrees

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_meta.md](../00_overview/symbol_additions_v2_1_142_tools_meta.md) - v2.1.142 plan/worktree additions

Key functions in this document:
- `enterWorktreeInputSchema` (Ee_) - {name?, path?} mutex
- `enterWorktreeOutputSchema` (ye_) - {worktreePath, worktreeBranch?, message}
- `enterWorktreeTool` (qn7) - Tool definition
- `validateWorktreeSlug` (SiH) - Name slug validation
- `enterExistingWorktree` (DE6) - v2.1.105 existing-path path handler
- `createNewWorktree` (DL$) - New worktree creator
- `generateRandomWorktreeName` (PDH) - Random slug generator
- `listRepoWorktrees` (NP8) - Reads `git worktree list`
- `isInWorktreeSession` (oz) - Active session check
- `hasCwdOverrideInSubagent` (xRH) - Subagent-context check
- `getRepoRoot` (BY) - Walks up to `.git`
- `saveWorktreeSession` ($JH) - Session record persistence
- `ENTER_WORKTREE_TOOL_NAME` (kFH) - "EnterWorktree"
