# Tool: ExitWorktree — Leave the Worktree Session

> **Identity:** wire-name `ExitWorktree`, userFacingName `"Cleaning up worktree"` or `"Exiting worktree"` (depends on action), `isDestructive` (when `action: "remove"`), `shouldDefer: true`, `maxResultSizeChars: 100_000`.
> **Source:** `cli_inner_pretty.js:384150-384307` (declaration), `assets/tools/ExitWorktree.md` (tool def).

ExitWorktree leaves an active worktree session created (or entered) by EnterWorktree. The session's working directory is restored to its pre-worktree cwd, and (depending on the `action` parameter) the worktree is either preserved or destroyed.

This is one of the most safety-critical tools — the `remove` path can destroy uncommitted work. The v2.1.136 fix added the uncommitted-file warning that this doc covers in detail.

---

## Overview

Operates on session-scoped worktrees only. Tools created via `git worktree add` outside the session are off-limits — calling ExitWorktree when not in a session is a **no-op with a clear error message**, not a failure.

Two outcomes via the `action` param:
- `"keep"`: leave the worktree on disk. The session's cwd reverts. Useful when work-in-progress should survive.
- `"remove"`: delete the worktree directory and branch. Requires `discard_changes: true` if the worktree has uncommitted changes or unmerged commits — this is the v2.1.136 safety check.

---

## Input Schema (`he_`)

```javascript
// ============================================
// exitWorktreeInputSchema - {action, discard_changes?}
// Location: cli_inner_pretty.js:384167-384178 (he_)
// ============================================

// ORIGINAL (for source lookup):
he_ = yH(() =>
  y.strictObject({
    action: y.enum(["keep", "remove"]).describe('"keep" leaves the worktree and branch on disk; "remove" deletes both.'),
    discard_changes: y.boolean().optional().describe('Required true when action is "remove" and the worktree has uncommitted files or unmerged commits. The tool will refuse and list them otherwise.'),
  }),
);

// READABLE (for understanding):
exitWorktreeInputSchema = lazy(() =>
  z.strictObject({
    action: z.enum(["keep", "remove"]).describe("keep or remove worktree"),
    discard_changes: z.boolean().optional().describe("Acknowledge data loss for remove action"),
  }),
);

// Mapping: he_→exitWorktreeInputSchema
```

**Why explicit `discard_changes` rather than `force`:** The verb `discard_changes` describes what the flag *does* (lose uncommitted work), not what bypass it provides (skip safety check). The wording is more honest about consequences. If the model defaults to `force: true` "to make it work," it would silently destroy data. `discard_changes: true` reads as a deliberate acknowledgment.

**Why `discard_changes` is `optional` rather than `default: false`:** Defaulting to false would silently apply on every call. By making it optional, the schema makes the field's *presence* a deliberate signal. The validation logic treats undefined as "not set" and requires explicit `true` to discard.

---

## Output Schema (`Ie_`)

```javascript
// ============================================
// exitWorktreeOutputSchema - Action result with discarded counts
// Location: cli_inner_pretty.js:384180-384191 (Ie_)
// ============================================

// ORIGINAL (for source lookup):
Ie_ = yH(() => y.object({
  action: y.enum(["keep", "remove"]),
  originalCwd: y.string(),
  worktreePath: y.string(),
  worktreeBranch: y.string().optional(),
  tmuxSessionName: y.string().optional(),
  discardedFiles: y.number().optional(),
  discardedCommits: y.number().optional(),
  message: y.string(),
}));

// READABLE (for understanding):
exitWorktreeOutputSchema = lazy(() =>
  z.object({
    action: z.enum(["keep", "remove"]),
    originalCwd: z.string(),
    worktreePath: z.string(),
    worktreeBranch: z.string().optional(),
    tmuxSessionName: z.string().optional(),
    discardedFiles: z.number().optional(),
    discardedCommits: z.number().optional(),
    message: z.string(),
  }),
);

// Mapping: Ie_→exitWorktreeOutputSchema
```

The output includes counts of what was discarded — useful for the model to confirm the destruction was as expected ("I removed the worktree with 3 uncommitted files; that matches what I expected").

---

## validateInput — The Safety Gate

This is the most complex validateInput in the tool suite. It runs five checks:

```javascript
// ============================================
// validateExitWorktree - The big safety gate
// Location: cli_inner_pretty.js:384218-384260 (in Mn7.validateInput)
// ============================================

// ORIGINAL (for source lookup):
async validateInput(H) {
  if (xRH()) return { result: !1, message: "ExitWorktree cannot be called from a subagent ...", errorCode: 5 };
  let $ = oz();
  if (!$) return { result: !1, message: "No-op: there is no active EnterWorktree session ...", errorCode: 1 };
  if (H.action === "remove" && $.enteredExisting)
    return { result: !1, message: `This session entered an existing worktree ...`, errorCode: 4 };
  if (H.action === "remove" && !H.discard_changes) {
    let q = await fn7($.worktreePath, $.originalHeadCommit);
    if (q === null) return { result: !1, message: `Could not verify worktree state ...`, errorCode: 3 };
    let { changedFiles: K, commits: _ } = q;
    if (K > 0 || _ > 0) {
      let A = [];
      if (K > 0) A.push(`${K} uncommitted ${K === 1 ? "file" : "files"}`);
      if (_ > 0) A.push(`${_} ${_ === 1 ? "commit" : "commits"} on ${$.worktreeBranch ?? "the worktree branch"}`);
      return { result: !1, message: `Worktree has ${A.join(" and ")}. Removing will discard this work permanently. ...`, errorCode: 2 };
    }
  }
  return { result: !0 };
}

// READABLE (for understanding):
async function validateExitWorktree({ action, discard_changes }) {
  // Check 1: Subagent context block
  if (hasCwdOverrideInSubagent()) {
    return {
      result: false,
      message: 'ExitWorktree cannot be called from a subagent with a cwd override (isolation: "worktree" or explicit cwd) — it would mutate the parent session\'s process-wide working directory. This agent is already isolated; use Bash with `cd` for directory changes within it.',
      errorCode: 5,
    };
  }

  // Check 2: No active worktree session — no-op error
  const session = getActiveWorktreeSession();
  if (!session) {
    return {
      result: false,
      message: "No-op: there is no active EnterWorktree session to exit. This tool only operates on worktrees created by EnterWorktree in the current session — it will not touch worktrees created manually or in a previous session. No filesystem changes were made.",
      errorCode: 1,
    };
  }

  // Check 3: Can't remove an existing-entry worktree
  if (action === "remove" && session.enteredExisting) {
    return {
      result: false,
      message: `This session entered an existing worktree (${session.worktreePath}); it was not created by EnterWorktree, so this tool will not remove it. Use action: "keep" to return to ${session.originalCwd}, then remove the worktree manually with \`git worktree remove\` if desired.`,
      errorCode: 4,
    };
  }

  // Check 4-5: Uncommitted-change detection (v2.1.136)
  if (action === "remove" && !discard_changes) {
    const status = await detectWorktreeChanges(session.worktreePath, session.originalHeadCommit);
    if (status === null) {
      return {
        result: false,
        message: `Could not verify worktree state at ${session.worktreePath}. Refusing to remove without explicit confirmation. Re-invoke with discard_changes: true to proceed — or use action: "keep" to preserve the worktree.`,
        errorCode: 3,
      };
    }
    const { changedFiles, commits } = status;
    if (changedFiles > 0 || commits > 0) {
      const parts = [];
      if (changedFiles > 0) parts.push(`${changedFiles} uncommitted ${changedFiles === 1 ? "file" : "files"}`);
      if (commits > 0) parts.push(`${commits} ${commits === 1 ? "commit" : "commits"} on ${session.worktreeBranch ?? "the worktree branch"}`);
      return {
        result: false,
        message: `Worktree has ${parts.join(" and ")}. Removing will discard this work permanently. Confirm with the user, then re-invoke with discard_changes: true — or use action: "keep" to preserve the worktree.`,
        errorCode: 2,
      };
    }
  }
  return { result: true };
}

// Mapping: oz→getActiveWorktreeSession, fn7→detectWorktreeChanges, $→session, K/_→changedFiles/commits,
//          xRH→hasCwdOverrideInSubagent
```

### Check 1: Subagent Block (errorCode 5)

Same reasoning as EnterWorktree: subagents have their own working directory and should not mutate the parent's. The error is hard — there's no "force" override. The subagent already has Bash with `cd` for in-process directory changes.

### Check 2: No Active Session (errorCode 1)

If there's no active worktree session (the model is just confused), the tool returns a **no-op error**, not a real error. The message emphasizes:

- No filesystem changes were made.
- This tool's scope is strictly EnterWorktree sessions in the current process.
- Manually created `git worktree add` worktrees are not its concern.

**Why no-op instead of error:** Errors propagate and cost tokens. The model occasionally hallucinates being in a worktree when it isn't. A clear no-op message lets the model recover gracefully without abort.

### Check 3: Existing Worktree Remove Block (errorCode 4)

A worktree entered via `path` parameter (`enteredExisting: true`) cannot be removed by ExitWorktree. The reasoning:

- The worktree existed before the session — someone else may need it.
- The session didn't create the worktree; it can only own its own creations.
- Allowing remove would let one session destroy work from another session/user.

The error message offers a clear path: use `action: "keep"` to return to original cwd, then `git worktree remove` manually if you really want to nuke it.

### Check 4-5: Uncommitted Change Detection (errorCode 2 / 3, v2.1.136)

The flagship safety check. When `action: "remove"` and `discard_changes` is false-y, the tool runs `detectWorktreeChanges` (`fn7`) which performs two git operations:

```javascript
// ============================================
// detectWorktreeChanges - Count uncommitted files and unmerged commits
// Location: cli_inner_pretty.js:384132-384145 (fn7)
// ============================================

// ORIGINAL (for source lookup):
async function fn7(H, $) {
  let q = await X8("git", ["-C", H, "status", "--porcelain"]);
  if (q.code !== 0) return null;
  let K = H6(q.stdout.split("\n"), (z) => z.trim() !== "");
  if (!$) return null;
  let _ = await X8("git", ["-C", H, "rev-list", "--count", `${$}..HEAD`]);
  if (_.code !== 0) return null;
  let A = parseInt(_.stdout.trim(), 10) || 0;
  return { changedFiles: K, commits: A };
}

// READABLE (for understanding):
async function detectWorktreeChanges(worktreePath, originalHeadCommit) {
  // Count uncommitted files (working tree + index)
  const statusResult = await runShell("git", ["-C", worktreePath, "status", "--porcelain"]);
  if (statusResult.code !== 0) return null;
  const changedFiles = countNonEmptyLines(statusResult.stdout.split("\n"));

  // Count commits on this worktree branch not in the original ref
  if (!originalHeadCommit) return null;
  const revListResult = await runShell("git", ["-C", worktreePath, "rev-list", "--count", `${originalHeadCommit}..HEAD`]);
  if (revListResult.code !== 0) return null;
  const commits = parseInt(revListResult.stdout.trim(), 10) || 0;

  return { changedFiles, commits };
}

// Mapping: fn7→detectWorktreeChanges, H→worktreePath, $→originalHeadCommit, q→statusResult,
//          K→changedFiles, _→revListResult, A→commits, X8→runShell, H6→countNonEmptyLines
```

**Two separate measurements:**

1. **Uncommitted files**: `git status --porcelain` lists every modified, untracked, staged, or unmerged file. Counting non-empty lines = count of files in any non-clean state.

2. **Unmerged commits**: `git rev-list --count <originalRef>..HEAD` counts commits made in this worktree on top of `originalRef` (the commit the worktree branched from). These commits are unique to the worktree branch and would be lost on remove.

**Why both:** A worktree might have:
- Pure uncommitted work (no new commits, just changes): files > 0, commits = 0.
- Pure committed work (clean working tree but new commits): files = 0, commits > 0.
- Both.

Reporting both makes the error message accurate ("3 uncommitted files and 2 commits on feature/foo").

**Why `return null` on git failures:** A failed `git status` (e.g., worktree corrupted) doesn't necessarily mean "no changes." It means "we don't know." The tool then errors with code 3, asking the model to confirm via `discard_changes: true`. This is fail-safe: unknown state → refuse to destroy.

**Why `parseInt(... ) || 0`:** Defensive parsing. If `git rev-list --count` returned an empty string or non-numeric, the fallback is 0 (assume no commits). This avoids NaN propagating into the user-facing message.

### Why v2.1.136 added this check

Pre-v2.1.136, ExitWorktree with `action: "remove"` would unconditionally destroy. The model would call this proactively at session end, and if there was uncommitted work in the worktree (e.g., changes that the model thought were in the main repo but were actually in a worktree it forgot it created), the work would be silently lost.

The fix forces the model to **opt in** to destruction. The first call fails with errorcode 2 and an explicit list of what would be lost. The model is then expected to:

1. Tell the user about the changes.
2. Wait for confirmation.
3. Re-invoke with `discard_changes: true`.

The prompt explicitly instructs: *"If the tool returns an error listing changes, confirm with the user before re-invoking with `discard_changes: true`."*

---

## call() — Restore cwd and Maybe Destroy

```javascript
// ============================================
// callExitWorktree - Restore cwd, optionally tear down worktree and tmux
// Location: cli_inner_pretty.js:384264-384302 (in Mn7.call)
// ============================================

// ORIGINAL (for source lookup):
async call(H) {
  let $ = oz();
  if (!$) throw Error("Not in a worktree session");
  let { originalCwd: q, worktreePath: K, worktreeBranch: _, tmuxSessionName: A, originalHeadCommit: z } = $,
    Y = R9() === $6(),
    { changedFiles: f, commits: O } = (await fn7(K, z)) ?? { changedFiles: 0, commits: 0 };
  if (H.action === "keep") {
    (await FkH(), On7(q, Y), d("tengu_worktree_kept", { mid_session: !0, commits: O, changed_files: f }));
    let D = A ? ` Tmux session ${A} is still running; reattach with: tmux attach -t ${A}` : "";
    return { data: { action: "keep", originalCwd: q, worktreePath: K, worktreeBranch: _, tmuxSessionName: A, message: `Exited worktree. Your work is preserved at ${K}${_ ? ` on branch ${_}` : ""}. Session is now back in ${q}.${D}` } };
  }
  if (A) await RiH(A);
  (await CiH(), On7(q, Y), d("tengu_worktree_removed", { source: "exit_tool", mid_session: !0, commits: O, changed_files: f }));
  /* compose discarded message; return remove result */
  return { data: { action: "remove", originalCwd: q, worktreePath: K, worktreeBranch: _, discardedFiles: f, discardedCommits: O, message: `Exited and removed worktree at ${K}. ...` } };
}

// READABLE (for understanding):
async function callExitWorktree({ action }) {
  const session = getActiveWorktreeSession();
  if (!session) throw new Error("Not in a worktree session");
  const { originalCwd, worktreePath, worktreeBranch, tmuxSessionName, originalHeadCommit } = session;
  const wasInWorktreeAtCallTime = getCwd() === getCurrentSessionWorktreePath();

  // Detect what we're about to lose (for telemetry / message even on `keep`)
  const { changedFiles, commits } = (await detectWorktreeChanges(worktreePath, originalHeadCommit)) ?? { changedFiles: 0, commits: 0 };

  // Branch A: Keep — leave worktree alone, restore cwd
  if (action === "keep") {
    await keepWorktreeAndExit();              // FkH: closes session, marks worktree retained
    restoreCwdAndCaches(originalCwd, wasInWorktreeAtCallTime);
    logEvent("tengu_worktree_kept", { mid_session: true, commits, changed_files: changedFiles });
    const tmuxNotice = tmuxSessionName ? ` Tmux session ${tmuxSessionName} is still running; reattach with: tmux attach -t ${tmuxSessionName}` : "";
    return {
      data: {
        action: "keep", originalCwd, worktreePath, worktreeBranch, tmuxSessionName,
        message: `Exited worktree. Your work is preserved at ${worktreePath}${worktreeBranch ? ` on branch ${worktreeBranch}` : ""}. Session is now back in ${originalCwd}.${tmuxNotice}`,
      },
    };
  }

  // Branch B: Remove — kill tmux, delete worktree, restore cwd
  if (tmuxSessionName) await killTmuxSession(tmuxSessionName);
  await deleteWorktreeAndExit();              // CiH: git worktree remove, fs cleanup
  restoreCwdAndCaches(originalCwd, wasInWorktreeAtCallTime);
  logEvent("tengu_worktree_removed", { source: "exit_tool", mid_session: true, commits, changed_files: changedFiles });

  const lostParts = [];
  if (commits > 0) lostParts.push(`${commits} ${commits === 1 ? "commit" : "commits"}`);
  if (changedFiles > 0) lostParts.push(`${changedFiles} uncommitted ${changedFiles === 1 ? "file" : "files"}`);
  const lostNote = lostParts.length > 0 ? ` Discarded ${lostParts.join(" and ")}.` : "";

  return {
    data: {
      action: "remove", originalCwd, worktreePath, worktreeBranch, discardedFiles: changedFiles, discardedCommits: commits,
      message: `Exited and removed worktree at ${worktreePath}.${lostNote} Session is now back in ${originalCwd}.`,
    },
  };
}

// Mapping: oz→getActiveWorktreeSession, fn7→detectWorktreeChanges, FkH→keepWorktreeAndExit,
//          CiH→deleteWorktreeAndExit, On7→restoreCwdAndCaches, RiH→killTmuxSession, d→logEvent
```

### Why Detect Changes Even on `keep`

The `keep` branch also calls `detectWorktreeChanges` — but only for telemetry, not for blocking. The counts go into the analytics event so we can see "users with keep + changes = X" trends.

The user-facing message on keep is informational only:
> Your work is preserved at /path/.claude/worktrees/foo on branch foo. Session is now back in /original.

(No "X files preserved" — that would be redundant; the user knows their work is in the worktree.)

### `restoreCwdAndCaches` (`On7`)

```javascript
function On7(H, $) {
  if ((KD(H), RN(H), $)) (k8H(H), eOH());  // additional caches if was-in-worktree-at-call-time
  (Ib(null), we(), G0(), SO.cache.clear?.(), CV()?.refreshGitBranch?.());
}
```

The function:
1. `process.chdir(originalCwd)` + update internal cwd cache.
2. If we were *actually* in the worktree path at call time (not in a subdirectory), also reset the read cache and recent-files history.
3. Clear the session's worktree state (`Ib(null)`).
4. Invalidate all caches (memory, plans, read, git branch).

**Why the `$` (`wasInWorktreeAtCallTime`) conditional:** If the user navigated out of the worktree mid-session (e.g., did `Bash(cd /tmp)` before calling ExitWorktree), some caches don't need clearing — they were already pointing elsewhere. The conditional avoids unnecessary work.

### Tmux Cleanup on Remove

```javascript
if (tmuxSessionName) await killTmuxSession(tmuxSessionName);
```

If the EnterWorktree session attached a tmux session for split-pane work, `action: "remove"` kills the tmux session. On `keep`, the tmux session is left alive (the message tells the user the name to reattach).

This distinguishes worktrees from regular subagent sessions — worktrees may have an external tmux companion that the user is interacting with directly.

---

## Render Methods

```javascript
renderToolUseMessage: An7,        // Returns "" — no inline header
renderToolResultMessage: zn7,    // Banner: "Kept/Removed worktree (branch foo)"
```

The result renderer:
```
┌────────────────────────────────────────┐
│ Kept worktree (branch foo)             │
│ Returned to /original/cwd              │
└────────────────────────────────────────┘
```

For removal, "Removed worktree" instead of "Kept worktree". The path shown is the *destination* (original cwd), not the worktree being removed.

---

## userFacingName

```javascript
userFacingName(H) {
  return H?.action === "remove" ? "Cleaning up worktree" : "Exiting worktree";
}
```

Different verb per action. "Cleaning up" implies destruction; "Exiting" implies preservation.

---

## Key Insights

- **The destruction safety is by validation, not by call**: All the "did you really mean this?" logic is in `validateInput`. By the time `call()` runs, the green light is already given. This separation makes the safety check testable independently.

- **No-op error for missing session is by design**: A hallucinated ExitWorktree shouldn't crash; it should clearly say "nothing to do." This is friendlier than a hard error frame.

- **`enteredExisting` is the one-way ratchet**: Once a session entered an existing worktree, it can never `remove` that worktree. Other sessions/users might depend on it. The error message explicitly tells the model to use `git worktree remove` manually if necessary — pushing the responsibility off the tool.

- **Uncommitted commits are the trickier hazard**: Files in `git status` are obvious. But unmerged commits look like "completed work" to most users — they don't realize that removing the worktree also removes the *branch*. The commit count in the error message is meant to surface this hazard.

- **`isDestructive` is action-dependent**: `isDestructive(H) { return H.action === "remove"; }`. This flag tells the UI to apply a "destructive action" visual style (red button, confirmation prompt) only for remove. Keep is benign.

- **Tmux cleanup is per-action**: tmux sessions get killed on remove, preserved on keep. The user is given the tmux name in the keep message so they can manually attach.

---

## v2.1.112 → v2.1.142 Deltas

| Version | Change |
|---------|--------|
| v2.1.114 | Tmux session cleanup integrated (kill on remove, preserve on keep). |
| v2.1.117 | `enteredExisting` block prevents removal of pre-existing worktrees. |
| v2.1.121 | Subagent context error path added. |
| v2.1.125 | `discardedFiles` / `discardedCommits` counts in result. |
| v2.1.129 | Telemetry on keep (was previously only on remove). |
| v2.1.133 | `worktree.baseRef` interaction: commits counted against the configured base. |
| v2.1.136 | **Uncommitted-file warning** — `discard_changes: true` required for destructive removal of worktrees with uncommitted work or unmerged commits. |
| v2.1.140 | `git status --porcelain` parsing more robust to mid-stream failures. |
| v2.1.142 | No changes to ExitWorktree itself. (Background session worktree recognition is handled in EnterWorktree.) |

---

## Related Documents

- [enter_worktree.md](enter_worktree.md) — the companion tool for entering worktrees

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_meta.md](../00_overview/symbol_additions_v2_1_142_tools_meta.md) - v2.1.142 plan/worktree additions

Key functions in this document:
- `exitWorktreeInputSchema` (he_) - {action, discard_changes?}
- `exitWorktreeOutputSchema` (Ie_) - {action, paths, counts, message}
- `exitWorktreeTool` (Mn7) - Tool definition
- `detectWorktreeChanges` (fn7) - v2.1.136 git status + rev-list helper
- `restoreCwdAndCaches` (On7) - Process state restoration
- `keepWorktreeAndExit` (FkH) - keep handler
- `deleteWorktreeAndExit` (CiH) - remove handler
- `killTmuxSession` (RiH) - Tmux cleanup
- `getActiveWorktreeSession` (oz) - Session state accessor
- `EXIT_WORKTREE_TOOL_NAME` (yH8) - "ExitWorktree"
