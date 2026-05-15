# Worktree Isolation — v2.1.142

## TL;DR

A teammate or subagent with `isolation: "worktree"` runs in its own git worktree under `.claude/worktrees/`. This isolates its filesystem changes from the parent session, other teammates, and the user's working copy. The flag is honored in three execution surfaces:

1. **The `EnterWorktree` tool** — explicitly switches the current session into a worktree, either creating one or (v2.1.105+) attaching to a *pre-existing* one via the `path` parameter.
2. **The subagent dispatch path** — agents whose definition declares `isolation: "worktree"` are auto-routed into a worktree before their first turn.
3. **The bg worker** — when dispatched with worktree isolation, the daemon sets `CLAUDE_BG_ISOLATION=worktree` in the env so the worker boots into a worktree.

v2.1.142 carries three relevant fixes:
- **Pre-existing worktree recognition**: background sessions now accept that `EnterWorktree` may attach to a worktree created by an external `git worktree add` rather than refusing as a duplicate (changelog: "Fixed background sessions not recognizing pre-existing git worktrees, blocking Edit while EnterWorktree refused to create a duplicate").
- **Untracked-file detection in stale-worktree cleanup**: `cleanupStaleAgentWorktrees` now refuses to clean a worktree that has any untracked files (previously it considered uncommitted edits but missed pristine untracked files).
- **`--add-dir` inheritance for dispatched workers**: the `--add-dir` flag is in the dispatch-extras bag (unit 08) and propagates from the agent-view dispatcher to every spawned worker.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agent_team_arch.md](../00_overview/symbol_additions_v2_1_142_agent_team_arch.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)

Key functions in this document:
- `enterExistingWorktreeForSession` (`DE6`) — v2.1.105 attach-to-existing worktree path (cli_inner_pretty.js:523107)
- `createOrAttachWorktreeForSession` (`eJ$`) — main entry that branches on hook-based vs git-worktree (cli_inner_pretty.js:523392+)
- `cleanupStaleAgentWorktrees` (`yQ6`) — stale-worktree sweeper, v2.1.142 untracked-file detection (cli_inner_pretty.js:523310-523355)
- `exitWorktreeAndKeep` (`FkH`) — `keep` action: chdir back to original, leave worktree intact
- `exitWorktreeAndRemove` (`CiH`) — `remove` action: rm worktree + delete branch
- `EnterWorktreeTool` (`qn7`) — the tool definition itself (cli_inner_pretty.js:384003-384062)
- `EnterWorktreeName` (`kFH`) — the string `"EnterWorktree"`
- `buildBgWorkerEnv` — env-builder that sets `CLAUDE_BG_ISOLATION=worktree`
- Constants: `du5` (stale-worktree-name regex array), session-state keys for current-worktree context

---

## What `isolation: "worktree"` Means

A subagent's frontmatter can declare:

```yaml
---
name: review-pr
isolation: worktree
---
```

When dispatched, the agent loop checks `agentDefinition.isolation === "worktree"` and forces creation of a new worktree (or attachment to an existing one) before the agent's first tool call. This is wired in the subagent-context builder around `cli_inner_pretty.js:231221`:

```javascript
let C = O.isolation === "worktree" ? "worktree" : void 0,
```

This `C` variable is the *requested isolation kind*; downstream code uses it to drive the env-builder for bg workers and the auto-worktree-creation path for in-process subagents.

### Scope: What's Isolated

A worktree gives the agent:

| Concern | Isolated? | Notes |
|---------|-----------|-------|
| **CWD** | yes | `process.chdir($.worktreePath)` after creation |
| **Git branch** | yes | Auto-created or attached-to branch |
| **File writes** | yes | Edits happen in worktree; main copy untouched |
| **`Bash` cwd** | yes | Bash tool runs in worktree |
| **`Read`/`Grep` cwd** | yes | Within worktree |
| **Env vars** | partial | `CLAUDE_BG_ISOLATION=worktree` set for bg; other env inherits |
| **Process** | no | Same Node.js process (in-process) or same child (bg) |
| **MCP server connections** | no | Shared across worktree boundary |
| **Permission rules** | no | Shared |
| **Mailbox** | no | Worktree teammates write to the same `~/.claude/{team}/inboxes/` |
| **Tasks file** | no | Same `~/.claude/{team}/tasks.json` |

The intent: provide *filesystem* isolation so the agent's edits don't interfere with the user's WIP or with parallel teammates. It is **not** a security boundary — same user, same process, same Claude trust scope.

---

## EnterWorktree Tool

The user (or model) explicitly transitions into a worktree by invoking `EnterWorktree`:

```javascript
// EnterWorktree input schema:
{
  name: y.string().optional().describe("Name for the new worktree branch (auto-generated if omitted)"),
  path: y.string().optional().describe(
    "Path to an existing worktree of the current repository to switch into instead of creating a new one. " +
    "Must appear in `git worktree list` for the current repo. Mutually exclusive with `name`.",
  ),
}.refine(H => !(H.name && H.path), { message: "Provide at most one of `name` or `path`, not both." })
```

Two paths through the tool:

### Path A: Create New Worktree (`name` provided or both omitted)

`createOrAttachWorktreeForSession` (`eJ$`):
1. Sanitize the name (or generate one via `PDH()` if absent).
2. If a `WorktreeCreate` hook is configured, delegate to it; otherwise run `git worktree add`.
3. Chdir into the new worktree path.
4. Clear CWD-dependent caches (system prompt sections, memory files, plans directory).
5. Record the session-state context: `{worktreePath, worktreeBranch, originalCwd, hookBased, sessionId}`.
6. Emit `tengu_worktree_created` telemetry.

### Path B: Attach to Existing Worktree (`path` provided)

`enterExistingWorktreeForSession` (`DE6`), v2.1.105 introduction:

```javascript
// ============================================
// enterExistingWorktreeForSession - Attach to a worktree we did NOT create
// Location: cli_inner_pretty.js:523107-523145
// ============================================

// ORIGINAL (for source lookup):
async function DE6(H, $) {
  let q = I$(), K = BY(q);
  if (!K) throw Error("Cannot enter an existing worktree: the current directory is not in a git repository.");
  let _, A, z;
  try {
    ((_ = await eY.realpath(ZM.resolve(q, $))), (A = await eY.realpath(K)), (z = await eY.realpath(q)));
  } catch (M) { throw Error(`Cannot enter worktree: ${$}: ${ZH(M)}`); }
  if (_ === A) throw Error(`Cannot enter worktree: ${$} is the main working tree, not a linked worktree.`);
  if (_ === z) throw Error(`Cannot enter worktree: ${$} is the current working directory.`);
  let Y = await NP8(K), f;
  for (let M of Y)
    try {
      if ((await eY.realpath(M.worktreePath)) === _) { f = M; break; }
    } catch {}
  if (!f) throw Error(`Cannot enter worktree: ${$} is not a registered worktree of ${K}. Run 'git -C ${K} worktree list' to see registered worktrees.`);
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
async function enterExistingWorktreeForSession(sessionId, targetPath) {
  const currentCwd = currentWorkingDirectory();
  const gitRoot = findGitRoot(currentCwd);
  if (!gitRoot) {
    throw new Error("Cannot enter an existing worktree: the current directory is not in a git repository.");
  }

  // Resolve all three paths via realpath so symlinks don't fool us.
  let resolvedTarget, resolvedRoot, resolvedCwd;
  try {
    resolvedTarget = await fs.realpath(pathResolve(currentCwd, targetPath));
    resolvedRoot   = await fs.realpath(gitRoot);
    resolvedCwd    = await fs.realpath(currentCwd);
  } catch (e) {
    throw new Error(`Cannot enter worktree: ${targetPath}: ${describeErr(e)}`);
  }

  // Sanity guards.
  if (resolvedTarget === resolvedRoot) {
    throw new Error(`Cannot enter worktree: ${targetPath} is the main working tree, not a linked worktree.`);
  }
  if (resolvedTarget === resolvedCwd) {
    throw new Error(`Cannot enter worktree: ${targetPath} is the current working directory.`);
  }

  // Verify it's actually registered as a worktree of this repo.
  const registeredWorktrees = await listWorktrees(gitRoot);
  let matched;
  for (const w of registeredWorktrees) {
    try {
      if ((await fs.realpath(w.worktreePath)) === resolvedTarget) {
        matched = w;
        break;
      }
    } catch { /* ignore unreachable worktree entries */ }
  }
  if (!matched) {
    throw new Error(
      `Cannot enter worktree: ${targetPath} is not a registered worktree of ${gitRoot}. ` +
      `Run 'git -C ${gitRoot} worktree list' to see registered worktrees.`,
    );
  }

  const context = {
    originalCwd: currentCwd,
    worktreePath: resolvedTarget,
    worktreeName: basename(resolvedTarget),
    worktreeBranch: matched.worktreeBranch,
    sessionId,
    enteredExisting: true,        // ← critical flag; affects cleanup behavior
  };
  setSessionWorktreeContext(context);
  return context;
}

// Mapping: DE6→enterExistingWorktreeForSession, H→sessionId, $→targetPath,
//          I$→currentWorkingDirectory, BY→findGitRoot, eY→fs, NP8→listWorktrees, $JH→setSessionWorktreeContext
```

#### Why the `enteredExisting: true` Flag Matters

The flag tells `ExitWorktree` *not* to remove the worktree on exit, because the session didn't create it:

```javascript
// From CiH (exitWorktreeAndRemove):
if (H.enteredExisting) {
  $JH(null);             // clear the session worktree context
  return;                // but DON'T `git worktree remove`
}
```

This is the v2.1.105 contract: `EnterWorktree --path` is read-only with respect to the worktree's lifecycle. The user (or external tooling like the agent-coordinator scripts mentioned in `~/.claude/worktrees/` of this very repo) is responsible for cleanup.

### v2.1.142 Fix: Pre-Existing Worktree Recognition

The v2.1.142 changelog item *"Fixed background sessions not recognizing pre-existing git worktrees, blocking Edit while EnterWorktree refused to create a duplicate"* corresponds to making the bg-worker startup code call `enterExistingWorktreeForSession` rather than always creating a new one.

Before the fix: a bg worker with cwd already inside `.claude/worktrees/foo` would *also* try to `git worktree add foo-2`, fail because `foo` already exists, fall back to creating `foo-2`, then refuse to Edit because two worktree contexts collided.

After the fix: the bg worker's startup code first checks if `cwd` is *itself* a registered worktree. If yes, it attaches via `enterExistingWorktreeForSession`. If no, it creates one as before.

The detection is straightforward: walk `git worktree list` (via `NP8 / listWorktrees`), match `realpath(cwd)` against each entry. If found, use the `entered-existing` path.

---

## Stale-Worktree Cleanup

`cleanupStaleAgentWorktrees` (`yQ6`) periodically sweeps `.claude/worktrees/` and removes worktrees that are:
1. Older than a threshold (the `H.getTime()` argument).
2. NOT the currently-active worktree for any live session.
3. Have no uncommitted changes (`git status --porcelain` returns empty).
4. **NEW in v2.1.142**: have no untracked files (also covered by the porcelain check).
5. Have either no unique commits OR have only commits that have been squash-merged into the default branch.

```javascript
// ============================================
// cleanupStaleAgentWorktrees - Sweep stale worktrees (v2.1.142 with untracked-file detection)
// Location: cli_inner_pretty.js:523310-523355
// ============================================

// ORIGINAL (for source lookup):
async function yQ6(H) {
  let $ = BY(I$());
  if (!$) return 0;
  let q = GQ6($), K;
  try { K = await eY.readdir(q); } catch { return 0; }
  let _ = H.getTime(), A = oz()?.worktreePath, z = await lu5($), Y = 0;
  for (let f of K) {
    if (!du5.some((j) => j.test(f))) continue;
    let O = ZM.join(q, f);
    if (A === O) continue;
    let M; try { M = (await eY.stat(O)).mtimeMs; } catch { continue; }
    if (M >= _) continue;
    let [w, D] = await Promise.all([
      O6(u6(), ["--no-optional-locks", "status", "--porcelain"], { cwd: O }),
      O6(u6(), ["rev-list", "--max-count=1", "HEAD", "--not", "--remotes"], { cwd: O }),
    ]);
    if (w.code !== 0 || w.stdout.trim().length > 0) continue;
    if (D.code !== 0) continue;
    if (D.stdout.trim().length > 0) {
      let [j, J] = await Promise.all([O6(u6(), ["rev-parse", "HEAD"], { cwd: O }), jh4(O)]);
      if (!(j.code === 0 && J !== null && j.stdout.trim() === J) && (z === null || !(await cu5(O, z)))) continue;
    }
    if (await nwH(O, eEH(f), $, !1, "stale_cleanup")) Y++;
  }
  if (Y > 0) (await O6(u6(), ["worktree", "prune"], { cwd: $ }), N(`cleanupStaleAgentWorktrees: removed ${Y} stale worktree(s)`));
  return Y;
}

// READABLE (for understanding):
async function cleanupStaleAgentWorktrees(thresholdDate) {
  const gitRoot = findGitRoot(currentWorkingDirectory());
  if (!gitRoot) return 0;
  const worktreesDir = computeAgentWorktreesDir(gitRoot);
  let entries;
  try {
    entries = await fs.readdir(worktreesDir);
  } catch {
    return 0;
  }
  const thresholdMs = thresholdDate.getTime();
  const activeWorktreePath = getCurrentSessionWorktreeContext()?.worktreePath;
  const defaultBranch = await resolveOriginDefaultBranch(gitRoot);  // origin/HEAD or origin/main fallback
  let cleaned = 0;

  for (const entryName of entries) {
    if (!STALE_WORKTREE_NAME_REGEX_LIST.some((rx) => rx.test(entryName))) continue;
    const worktreePath = pathJoin(worktreesDir, entryName);
    if (activeWorktreePath === worktreePath) continue;
    let mtimeMs;
    try {
      mtimeMs = (await fs.stat(worktreePath)).mtimeMs;
    } catch {
      continue;
    }
    if (mtimeMs >= thresholdMs) continue;          // too recent — keep

    // Run two git checks in parallel.
    const [statusResult, revListResult] = await Promise.all([
      runGit(["--no-optional-locks", "status", "--porcelain"], { cwd: worktreePath }),
      runGit(["rev-list", "--max-count=1", "HEAD", "--not", "--remotes"], { cwd: worktreePath }),
    ]);

    // (v2.1.142) `status --porcelain` includes untracked files unless we passed `-uno`.
    // We DID NOT pass -uno, so untracked files count as "dirty" and we skip cleanup.
    if (statusResult.code !== 0 || statusResult.stdout.trim().length > 0) continue;

    // Check if there are local commits unknown to any remote.
    if (revListResult.code !== 0) continue;
    if (revListResult.stdout.trim().length > 0) {
      // There ARE local-only commits. Check if HEAD is squash-merged into default branch.
      const [headRevResult, squashMergedRev] = await Promise.all([
        runGit(["rev-parse", "HEAD"], { cwd: worktreePath }),
        findSquashMergedRevision(worktreePath),
      ]);
      const headIsSquashMergedBase = headRevResult.code === 0
        && squashMergedRev !== null
        && headRevResult.stdout.trim() === squashMergedRev;
      if (!headIsSquashMergedBase
          && (defaultBranch === null || !(await isHeadSquashMergedInto(worktreePath, defaultBranch)))) {
        continue;     // local commits not yet upstreamed AND not squash-merged — keep
      }
    }

    // All checks pass — remove the worktree.
    if (await removeAgentWorktree(worktreePath, derivedBranchName(entryName), gitRoot, false, "stale_cleanup")) {
      cleaned++;
    }
  }
  if (cleaned > 0) {
    await runGit(["worktree", "prune"], { cwd: gitRoot });
    log(`cleanupStaleAgentWorktrees: removed ${cleaned} stale worktree(s)`);
  }
  return cleaned;
}

// Mapping: yQ6→cleanupStaleAgentWorktrees, H→thresholdDate, BY→findGitRoot, I$→currentWorkingDirectory,
//          GQ6→computeAgentWorktreesDir, eY→fs, oz→getCurrentSessionWorktreeContext,
//          lu5→resolveOriginDefaultBranch, du5→STALE_WORKTREE_NAME_REGEX_LIST,
//          O6→runGit, u6→gitExecutable, jh4→findSquashMergedRevision, cu5→isHeadSquashMergedInto,
//          nwH→removeAgentWorktree, eEH→derivedBranchName
```

### Why `status --porcelain` Catches Untracked Files

By default, `git status --porcelain` prints lines for *every* working-tree change, including untracked files (with a `??` prefix). The v2.1.142 fix is that we accept any non-empty stdout as "dirty" — previously the code might have been stricter (e.g., counting only `[MADRCU]` prefixes), missing pristine untracked files like generated artifacts the user wanted to preserve.

The change to "all porcelain output blocks cleanup" was added to the v2.1.142 stale-cleanup logic specifically to fix:
- Build artifacts in a worktree (e.g., `dist/`, `target/`)
- Auto-generated files (typegen output, cached test snapshots)
- Files the user manually copied in for ad-hoc tasks

### Squash-Merge Detection

If there are local commits, the cleanup walks two paths:
1. **HEAD == squash-merge revision marker** — recorded in worktree metadata when an `agent-coordinator` script squash-merges and stores the resulting upstream commit.
2. **HEAD is squash-merged into origin's default branch** — detected by `cu5(worktree, defaultBranch)`.

Both are "the work was merged upstream" signals; either is sufficient to remove the local worktree. This is the v2.1.105 squash-merged cleanup mentioned in the changelog.

### Stale Worktree Name Regex

`du5` is an array of regexes matching the *worktree directory name* (not the full path). Only matching directories are considered for cleanup. This prevents accidental removal of manually-created worktrees the user keeps under `.claude/worktrees/` for their own reasons. The regexes match the patterns Claude Code uses when generating worktree names (e.g., `agent-<hex>`, hash-derived names).

---

## Bg Worker Worktree Routing

For bg workers, worktree isolation is communicated by env var:

```javascript
// Excerpt from worker env-builder around cli_inner_pretty.js:527744:
if (H.isolation === "worktree") _.CLAUDE_BG_ISOLATION = "worktree";
```

The worker's startup reads this env var; if set, it auto-runs `EnterWorktree` (or `enterExistingWorktreeForSession` for the v2.1.142 fix) as its first action. This is documented in the subagent system prompt:

> If isolation: worktree is set, call the EnterWorktree tool as your first action — before reading files or running commands — unless your cwd is already under .claude/worktrees/.

The "cwd already under .claude/worktrees/" branch is exactly where the v2.1.142 pre-existing-worktree fix kicks in: if `cwd` is *already* a worktree, the worker recognizes it as such instead of trying to create a duplicate.

---

## `--add-dir` Inheritance

`--add-dir` is a v2.1.142 flag (newly accepted on `claude agents`) that adds additional directories to the worker's filesystem trust boundary. Each `--add-dir <path>` makes that path part of the worker's allowed-write set even though it's outside the cwd or worktree.

Inheritance flow (see unit 08's `v2_1_142_dispatch_flags.md`):

```
claude agents --add-dir /shared/configs
  ↓ Go6 (parseAgentsDispatchFlags) extracts the flag
  ↓ yV$ (resolveDispatchExtraArgs) runs path.resolve("/shared/configs")
  ↓ MN4 (setDispatchExtraArgsForSession) stashes in module-global OG$
  ↓ jN4/yP8 (claimSpareOrColdDispatch / coldDispatchFromTemplate) reads OG$
  ↓ argv = [...OG$, ...] → each spawned worker sees --add-dir /shared/configs
  ↓ Worker's bootstrap calls lA6($) and omK("--add-dir", $)
  ↓ Worker's trust boundary now includes /shared/configs
```

The flag is inherited *implicitly* by every task dispatched from the agent-view session — the user doesn't need to repeat it per task. This is the rationale for the module-global `OG$` storage: dispatching from agent view is a multi-task interaction, and re-typing the flags for each task would be tedious.

### Worktree + --add-dir Interaction

When both are in play (e.g., `claude agents --add-dir /shared` dispatching a worktree-isolated subagent):
- The worktree is created at `.claude/worktrees/foo`.
- The worker's cwd is `.claude/worktrees/foo`.
- The worker's trust boundary includes the worktree path *and* `/shared/configs`.
- Edits in `/shared/configs` are allowed but happen *outside* the worktree (changes are visible to the user immediately, not gated on `git merge`).
- Edits inside the worktree are isolated as usual.

This matches users' typical workflow: keep volatile work-in-progress isolated in the worktree, but allow read+write access to shared config or vendored libraries that the agent needs to consult but shouldn't be sequestered.

---

## ExitWorktree Semantics

`ExitWorktree` has two actions:

| Action | Behavior |
|--------|----------|
| `keep` | Chdir back to `originalCwd`, leave worktree on disk and branch intact, log the path so the user can resume manually. |
| `remove` | Chdir back to `originalCwd`, attempt `git worktree remove --force`, then `rm -rf` residual, then `git branch -D` the branch. |

If `enteredExisting === true` (Path B above), `remove` is a no-op for the worktree itself — only the session-context is cleared. The session is responsible for not destroying worktrees it didn't create.

### Discard-Changes Gate

`remove` will *refuse* if the worktree has uncommitted changes or unique commits, **unless** the model passes `discard_changes: true`. This is the same dirtiness check used by stale-cleanup, applied at session-exit time.

---

## See Also

- [coordinator_process_model.md](./coordinator_process_model.md) — Daemon environment for bg workers (where `CLAUDE_BG_ISOLATION` is set)
- [tool_inheritance.md](./tool_inheritance.md) — What tools survive into a worktree-isolated subagent
- [permission_inheritance.md](./permission_inheritance.md) — Why worktree isolation is orthogonal to permission mode
- v2.1.142 unit 08 worktree: `v2_1_142_dispatch_flags.md` for `--add-dir` plumbing
- v2.1.112 baseline: this file is new in the v2.1.142 augment; v2.1.112 covered worktrees in the `EnterWorktree` tool docs only
