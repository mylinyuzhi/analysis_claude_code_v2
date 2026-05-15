# Pre-existing Worktree Recognition — v2.1.142

## TL;DR

Before v2.1.142, a background session started in a path that *was already a registered git worktree* of its parent repository would get stuck: the session needed to call `EnterWorktree` to attach to it, but `EnterWorktree` refused to create a duplicate worktree. The fix recognizes pre-existing worktrees in `DE6.enterExistingWorktree` by parsing `git worktree list --porcelain` and matching by `realpath`. The recognition sets `enteredExisting: true` on the worktree context, which `CiH.cleanupWorktreeOrPreserveExisting` then uses to **skip** cleanup at session end (the worktree was pre-existing — it shouldn't be removed).

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md)

Key functions:
- `enterExistingWorktree` (`DE6`) — Recognize-and-attach (cli_inner_pretty.js:523107-523141)
- `gitWorktreeListPorcelain` (`NP8`) — Parse `git worktree list --porcelain` (cli_inner_pretty.js:523088-523106)
- `keepWorktreeAtSessionEnd` (`FkH`) — Explicit "keep this worktree" path (cli_inner_pretty.js:523142-523154)
- `cleanupWorktreeOrPreserveExisting` (`CiH`) — Cleanup that respects `enteredExisting` (cli_inner_pretty.js:523155-523197)
- `createAgentWorktree` (`eJ$`) — Auto-resume path: `VQ6` returns `{existed: true}` to skip creation (cli_inner_pretty.js:523198-…)
- Schema field: `enteredExisting: boolean` on the persisted worktree context.

---

## The Bug

In v2.1.140-141, the following sequence broke:

1. User starts a foreground `claude` session in `/repo/worktrees/feature-x` (which is `git worktree add /repo/worktrees/feature-x` on `/repo`).
2. User dispatches a background session (`claude --bg` or via agent view) with worktree isolation.
3. The bg worker tries to call `EnterWorktree`, intending to take ownership of `/repo/worktrees/feature-x` (its current cwd).
4. `EnterWorktree` invokes `eJ$.createAgentWorktree` → calls `VQ6` → `git worktree add` returns an error because the directory **already exists** as a registered worktree.
5. The worker raises `Error("Cannot create agent worktree: …")` — `Edit` and other tools that depend on worktree resolution fail because the worktree context is never installed.
6. The session is locked in a state where it can read files but can't edit them.

## The Fix — Recognize-Then-Adopt

`DE6.enterExistingWorktree` is the new dedicated entry point for the "I'm already in a worktree" case. It builds a worktree context **without** calling `git worktree add`. The session adopts the existing worktree.

```javascript
// ============================================
// enterExistingWorktree - Adopt a pre-existing worktree by realpath match
// Location: cli_inner_pretty.js:523107-523141
// ============================================

// ORIGINAL (for source lookup):
async function DE6(H, $) {
  let q = I$(),
    K = BY(q);
  if (!K) throw Error("Cannot enter an existing worktree: the current directory is not in a git repository.");
  let _, A, z;
  try {
    ((_ = await eY.realpath(ZM.resolve(q, $))), (A = await eY.realpath(K)), (z = await eY.realpath(q)));
  } catch (M) {
    throw Error(`Cannot enter worktree: ${$}: ${ZH(M)}`);
  }
  if (_ === A) throw Error(`Cannot enter worktree: ${$} is the main working tree, not a linked worktree.`);
  if (_ === z) throw Error(`Cannot enter worktree: ${$} is the current working directory.`);
  let Y = await NP8(K), f;
  for (let M of Y)
    try {
      if ((await eY.realpath(M.worktreePath)) === _) { f = M; break; }
    } catch {}
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
  const cwd = getCwd();
  const gitRoot = findGitRoot(cwd);
  if (!gitRoot)
    throw Error("Cannot enter an existing worktree: the current directory is not in a git repository.");

  let targetRealpath, gitRootRealpath, cwdRealpath;
  try {
    targetRealpath  = await fsPromises.realpath(path.resolve(cwd, requestedPath));
    gitRootRealpath = await fsPromises.realpath(gitRoot);
    cwdRealpath     = await fsPromises.realpath(cwd);
  } catch (err) {
    throw Error(`Cannot enter worktree: ${requestedPath}: ${formatErr(err)}`);
  }
  if (targetRealpath === gitRootRealpath)
    throw Error(`Cannot enter worktree: ${requestedPath} is the main working tree, not a linked worktree.`);
  if (targetRealpath === cwdRealpath)
    throw Error(`Cannot enter worktree: ${requestedPath} is the current working directory.`);

  const worktrees = await gitWorktreeListPorcelain(gitRoot);
  let matched;
  for (const wt of worktrees)
    try {
      if ((await fsPromises.realpath(wt.worktreePath)) === targetRealpath) { matched = wt; break; }
    } catch {}
  if (!matched)
    throw Error(`Cannot enter worktree: ${requestedPath} is not a registered worktree of ${gitRoot}. Run 'git -C ${gitRoot} worktree list' to see registered worktrees.`);

  const context = {
    originalCwd: cwd,
    worktreePath: targetRealpath,
    worktreeName: path.basename(targetRealpath),
    worktreeBranch: matched.worktreeBranch,
    sessionId,
    enteredExisting: true,        // ← v2.1.142 marker
  };
  setCurrentWorktreeContext(context);
  return context;
}

// Mapping: DE6→enterExistingWorktree, H→sessionId, $→requestedPath, q→cwd,
//          K→gitRoot, _→targetRealpath, A→gitRootRealpath, z→cwdRealpath,
//          Y→worktrees, f→matched, M→wt, O→context,
//          I$→getCwd, BY→findGitRoot, eY→fsPromises, ZM→path, ZH→formatErr,
//          NP8→gitWorktreeListPorcelain, $JH→setCurrentWorktreeContext
```

### What Each Check Does

1. **`if (!gitRoot)`** — guard against using this outside a git repo. The error message is specific to the *enter-existing* operation.
2. **Resolve all three paths via `realpath`**: target, git root, cwd. Without this, a worktree at `/repo/wt/feature` (where `/repo` is a symlink) wouldn't match because the user might have typed a non-symlinked path.
3. **`if (target === gitRoot)`** — refuse to "enter" the main working tree as if it were a linked worktree. The semantics don't fit: there's no separate branch, no separate index.
4. **`if (target === cwd)`** — refuse a self-no-op. The session is already there; nothing to enter.
5. **List worktrees via `git worktree list --porcelain`** — the canonical way to enumerate registered worktrees.
6. **realpath-match each entry against `target`** — the porcelain output may contain symlinks; we already resolved them; resolve theirs too.
7. **Build the context** with `enteredExisting: true` and install it.

### Why `worktree list --porcelain` and not just `git worktree list`?

The porcelain format is *stable* and machine-readable:
```
worktree /Users/me/repo
HEAD abc123...
branch refs/heads/main

worktree /Users/me/repo/worktrees/feature-x
HEAD def456...
branch refs/heads/feature-x
```

The default format adds branch/HEAD info inline, but the columns can shift if git decides to add new annotations. Porcelain output is a contract.

```javascript
// gitWorktreeListPorcelain (NP8) cli_inner_pretty.js:523088-523106
async function gitWorktreeListPorcelain(gitRoot) {
  const { code, stdout, stderr, error } =
    await exec(gitBin(), ["-C", gitRoot, "worktree", "list", "--porcelain"], { timeout: 10000 });
  if (code !== 0)
    throw Error(`\`git -C ${gitRoot} worktree list\` failed: ${stderr.trim() || formatErr(error) || `exit ${code}`}`);
  const result = [];
  let current = null;
  for (const line of stdout.split("\n"))
    if (line.startsWith("worktree ")) {
      if (current) result.push(current);
      current = { worktreePath: line.slice(9) };
    } else if (line.startsWith("branch ") && current) {
      current.worktreeBranch = line.slice(7).replace(/^refs\/heads\//, "");
    }
  if (current) result.push(current);
  return result;
}
```

The parser is line-oriented, accepts only `worktree` and `branch` lines (ignores `HEAD`, `bare`, `detached`, `locked` — irrelevant for matching), and accumulates entries into a list.

---

## Cleanup-Path Asymmetry

`enteredExisting: true` is the marker. When the session ends, `CiH.cleanupWorktreeOrPreserveExisting` reads the flag and **skips** removal:

```javascript
// cli_inner_pretty.js:523155-523197
async function CiH() {
  let H = oz();             // getCurrentWorktreeContext
  if (!H) return;
  try {
    let { worktreePath: $, originalCwd: q, worktreeBranch: K, hookBased: _ } = H;
    if ((process.chdir(q), H.enteredExisting)) {
      $JH(null);            // clear the worktree context state, but…
      return;               // …skip git worktree remove + branch cleanup
    }
    // …(otherwise: remove the worktree directory, delete the branch, unlock, etc.)
  } catch ($) { N(`Error cleaning up worktree: ${$}`, { level: "error" }); }
}
```

The cwd is restored to the original (line `process.chdir(q)`), but the directory is **not** removed and the branch is **not** deleted. This is exactly the right behavior: the worktree existed before the session, the user presumably wants to keep it.

`FkH.keepWorktreeAtSessionEnd` is a related but distinct path — it's used when the user explicitly asks to keep a worktree (originally created by Claude). The asymmetry:

- `enteredExisting=true` (came in pre-existing): **automatic** preserve via `CiH`.
- `enteredExisting=false` + explicit `--keep-worktree`: **user-elected** preserve via `FkH`.
- `enteredExisting=false` (default): **destroy on exit** via `CiH`.

---

## Auto-resume in `createAgentWorktree`

There's a parallel mechanism inside `eJ$.createAgentWorktree`: when the user is dispatching via `claude --bg --worktree`, the dispatcher calls `VQ6` to **either** create a new worktree **or** resume an existing matching one. `VQ6` returns `{ ..., existed: true }` when it found a match. The caller branches:

```javascript
// cli_inner_pretty.js:523216-523218
let { worktreePath: K, worktreeBranch: _, headCommit: A, existed: z } = await VQ6(q, H, $);
if (!z) {
  (N(`Created agent worktree at: ${K} on branch: ${_}`), await vQ6(q, K));
  // ... also: git worktree lock for the new worktree
}
```

When `existed: true`, the lock step is skipped (don't trample an existing lock owner), the "created" log message is replaced with `"Resuming existing worktree at: …"` (line 523071 in the resume codepath), and the `creationDurationMs` field is omitted.

This *complements* `DE6`: `eJ$` is for "I'm about to create a worktree, oh wait, it already exists, so resume it"; `DE6` is for "I'm in an existing worktree, recognize it without trying to create."

---

## Why Two Paths and Not One?

It's tempting to unify `DE6` and the `existed:true` branch of `eJ$`. They both adopt a pre-existing worktree. But they enter from semantically different invocations:

- **`DE6`**: User opened `claude` directly in a worktree directory (cwd is already there). No new git operations needed.
- **`eJ$`**: User invoked the `EnterWorktree` tool with a name like `feature-x`, expecting to *enter* a worktree. `eJ$` does the path resolution (`<gitroot>/.claude/worktrees/feature-x` by default), and *might* find one already there.

The signal `enteredExisting: true` is set by both paths but flows through different code:
- In `DE6`: explicit.
- In `eJ$`: implicit via the `existed: true` branch that also sets context to `enteredExisting`. (Look at the `CiH` line `if (H.enteredExisting)` — that's how `eJ$.existed:true` and `DE6` both reach the same skip-cleanup behavior.)

The duplication is justified: each entry point has very different prerequisites (one requires no args, the other requires a name). Trying to fold them into a single function would conflate two distinct user intents.

---

## Edge Cases

### Symlinked worktrees

`realpath` is applied to *both* sides of every comparison (target and each registered worktree). This handles macOS's `/var → /private/var` indirection, user-symlinked workspace directories, and `realpath`-following.

### Locked worktrees

`git worktree list --porcelain` includes `locked <reason>` lines for locked worktrees. The parser ignores `locked` lines (doesn't matter — the `worktreePath` line still appears). Entering an existing worktree doesn't disturb a lock; the worktree is left in whatever lock state it was.

### Detached HEAD

Worktrees in detached-HEAD state have no `branch refs/heads/...` line. The parser's `current.worktreeBranch` stays undefined. The `enterExistingWorktree` succeeds; `worktreeBranch` is just undefined in the context. This is fine for the bg worker — it doesn't use `worktreeBranch` for anything operational, only for display.

### Bare repositories

`git -C <bare> worktree list --porcelain` lists the bare repo as `bare` instead of `worktree`. The parser only matches `worktree` lines, so the bare repo doesn't appear in `worktrees`. Attempting to enter the bare repo as a worktree would fail with `"Cannot enter worktree: <path> is not a registered worktree"` — correct, because it isn't.

### The not-a-git-repo case

If the caller's cwd isn't in a git repo, `BY(cwd)` returns null, and we error out with a specific message. This is distinct from the `eJ$` path's "Cannot create agent worktree" message, so users see what they actually did wrong.

---

## Validation

| Claim | Source |
|-------|--------|
| `DE6.enterExistingWorktree` parses `git worktree list --porcelain` and sets `enteredExisting: true` | cli_inner_pretty.js:523107-523141 |
| `enteredExisting: true` is the flag set in `DE6` | cli_inner_pretty.js:523138 |
| `CiH.cleanupWorktreeOrPreserveExisting` skips removal when `enteredExisting=true` | cli_inner_pretty.js:523160-523163 |
| `eJ$` has its own `existed: true` branch for resume during creation | cli_inner_pretty.js:523071, 523217 |
| Worktree action `remove` is blocked when `enteredExisting=true` | cli_inner_pretty.js:234443, 234446, 384234 |
