# `--cwd` Directory Filter — v2.1.141

## TL;DR

`claude agents --cwd <path>` filters the displayed session list to those whose **spawn-origin directory** is under `<path>`. The matcher (`jobMatchesCwd` aka `HG8`) does a `path.relative + isAbsolute` check on each job's persistent `state.cwd`, with a special-case unwrap of `<repo>/.claude/worktrees/X/...` back to `<repo>` — so a session running in a worktree of a repo is matched by the repo's path, not just the worktree's full path.

This affects only the dashboard's filtered display. Job state, dispatch, and adopt logic are unchanged.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md)

Key functions:
- `jobMatchesCwd` (`HG8`) — Path-containment predicate (cli_inner_pretty.js:565822-565825)
- `spawnOriginDir` (`e0$`) — Collapses worktree subpath back to repo (cli_inner_pretty.js:566055-566059)
- `enclosingRepoOrSpawnOrigin` (`En6`) — Used as the default `cwd` argument label (cli_inner_pretty.js:566060-566063)

---

## The Matcher

```javascript
// ============================================
// spawnOriginDir - The "where did this session come from" projection
// Location: cli_inner_pretty.js:566055-566059
// ============================================

// ORIGINAL (for source lookup):
function e0$(H) {
  if (H.originCwd) return H.originCwd;
  let $ = H.cwd.match(/^(.+?)[/\\]\.claude[/\\]worktrees[/\\]/);
  return $ ? $[1] : H.cwd;
}

// READABLE (for understanding):
function spawnOriginDir(jobState) {
  // 1. Explicit override — written when the session was dispatched
  if (jobState.originCwd) return jobState.originCwd;
  // 2. Auto-detect worktree pattern: <repo>/.claude/worktrees/<name>/...
  const m = jobState.cwd.match(/^(.+?)[/\\]\.claude[/\\]worktrees[/\\]/);
  if (m) return m[1];        // recover <repo>
  // 3. Otherwise the cwd is the origin
  return jobState.cwd;
}

// Mapping: e0$→spawnOriginDir, H→jobState, $→m
```

```javascript
// ============================================
// jobMatchesCwd - True iff job's spawn-origin is inside the filter dir
// Location: cli_inner_pretty.js:565822-565825
// ============================================

// ORIGINAL (for source lookup):
function HG8(H, $) {
  let q = xr.relative($, e0$(H));
  return q.split(/[/\\]/, 1)[0] !== ".." && !xr.isAbsolute(q);
}

// READABLE (for understanding):
function jobMatchesCwd(jobState, filterPath) {
  const rel = path.relative(filterPath, spawnOriginDir(jobState));
  // path.relative returns:
  //   "" if equal
  //   "subdir/file" if filterPath contains spawnOrigin
  //   "../..." if filterPath is sibling/ancestor's-sibling
  //   absolute path on Windows when different drive
  return rel.split(/[/\\]/, 1)[0] !== ".." && !path.isAbsolute(rel);
}

// Mapping: HG8→jobMatchesCwd, H→jobState, $→filterPath, q→rel,
//          xr→path, e0$→spawnOriginDir
```

### How the Check Works

`path.relative(from, to)` computes the relative path from `from` to `to`. The result tells us where `to` sits relative to `from`:

| Case | `path.relative(from, to)` | Match? |
|------|---------------------------|--------|
| `from = "/a/b"`, `to = "/a/b"` | `""` | yes (zero parents) |
| `from = "/a/b"`, `to = "/a/b/c/d"` | `"c/d"` | yes |
| `from = "/a/b"`, `to = "/a/c"` | `"../c"` | no (parent path → ..) |
| `from = "/a/b"`, `to = "/c"` | `"../../c"` | no |
| `from = "C:\\a"`, `to = "D:\\b"` (Windows) | `"D:\\b"` (absolute) | no |

The check `rel.split(/[/\\]/, 1)[0] !== ".."` filters out anything starting with `".."`. The check `!path.isAbsolute(rel)` filters out the cross-drive Windows case.

Together they implement "is `to` lexically inside `from`?" — a fast, no-IO containment check.

### Why Not Just `to.startsWith(from)`?

`startsWith` doesn't handle:
- Trailing separators: `/a/b` should match `/a/b/c` but also `/a/b`. `startsWith("/a/b")` matches both `/a/b/c` and the false positive `/a/bx`.
- Normalization: `"/a//b/"` vs `"/a/b"`. `path.relative` normalizes; `startsWith` doesn't.

`path.relative + isAbsolute + ".." check` is the canonical "is X inside Y" idiom for Node.

---

## Why The Worktree Unwrap?

Consider a typical dev setup:
- Main repo at `/Users/me/repo`
- Worktree created by Claude at `/Users/me/repo/.claude/worktrees/feature-x`
- A bg session running in `/Users/me/repo/.claude/worktrees/feature-x` (where `cwd` was set during worktree dispatch)

The user types `claude agents --cwd /Users/me/repo` to see all sessions associated with this repo. They *want* the worktree session to appear in the list, because it logically belongs to this repo.

Without the unwrap, `path.relative("/Users/me/repo", "/Users/me/repo/.claude/worktrees/feature-x")` returns `".claude/worktrees/feature-x"`, which doesn't start with `..`, so the match would succeed. But the unwrap is still essential for a different reason: **summary/grouping logic** in the dashboard:

```javascript
// cli_inner_pretty.js:567147
let c = JK([...(M ?? []), ...j].map((L$) => e0$(L$.state)))
          .sort().join("\x00"),
```

Here, `e0$` (`spawnOriginDir`) is mapped over every job to build a *unique-cwd index* for grouping. If two jobs are in different worktrees of the same repo, they should be grouped under the same repo. Without unwrap, they'd appear as separate entries in the dashboard's "cwd" group.

The unwrap also makes the `cwd` chip in the dashboard show `repo`, not `repo/.claude/worktrees/feature-x` — a much more useful label.

### The Pattern Match Edge Case

The regex is `/^(.+?)[/\\]\.claude[/\\]worktrees[/\\]/`. Non-greedy `(.+?)` means "shortest prefix ending in a separator, immediately followed by `.claude/worktrees/`". This handles:

- macOS: `/Users/me/repo/.claude/worktrees/X` → `/Users/me/repo`
- Linux: `/home/me/repo/.claude/worktrees/X` → `/home/me/repo`
- Windows: `C:\\Users\\me\\repo\\.claude\\worktrees\\X` → `C:\\Users\\me\\repo`

Edge case: a directory literally named `.claude` containing a sub-`worktrees` directory **not** under git would still unwrap. E.g., `/random/.claude/worktrees/X` → `/random`. This is fine: the unwrap is just for cwd-display purposes; even if "random" isn't a git repo, the user typed it as their cwd, so the unwrap aligns the display with their mental model.

The fallback `originCwd` is used preferentially because it's *the* canonical anchor — written explicitly when the session is dispatched with `--worktree` knowledge. The regex is just for older sessions or sessions dispatched without explicit `originCwd`.

---

## How `--cwd` Reaches the Filter

```javascript
// Excerpt from mountFleetView (ao5), cli_inner_pretty.js:569093
let _ = $?.cwdFilter ? await R3(xr.resolve($.cwdFilter)) : void 0,
```

The CLI value is `path.resolve`d (to absolute) then `R3` (`realpath`) is applied. Resolving + realpath-ing means:
- `~/repo` → `/Users/me/repo`
- `../sibling` → `/parent/sibling`
- A symlinked path → the canonical real path

This normalization happens **once**, before any job comparison. Each job's `spawnOrigin` is compared against the realpath'd filter.

```javascript
// FleetViewDashboard internal:
let B = Y && !HG8({ cwd: C }, Y) ? Y : C,
```

This is the dashboard's "fallback origin label" logic. `Y` is the cwd filter, `C` is the dashboard's own cwd (the user's terminal cwd). If a filter is set and the dashboard's own cwd doesn't match it (the user is browsing from outside the filter), use the filter as the label. Otherwise use the dashboard's own cwd. This is a UI niceness — the "you're seeing sessions filtered to <foo>" label always shows the most informative path.

---

## Applied At Two Layers

1. **Job list filter** (most prominent):
   ```javascript
   // FleetViewDashboard, line 567356, 567721 approximately
   Oj = (L$) => !Y || HG8(L$.state, Y),
   Av = Y ? TD.filter((L$) => HG8(L$.state, Y)) : TD,
   ```
   The dashboard's main list scan applies `HG8` to filter. If `Y` (cwdFilter) is undefined, all jobs are shown. If set, only matching jobs are shown.

2. **Dispatch input default cwd**:
   - When the user types a task and dispatches, the dispatcher uses the *current* cwd by default. The `--cwd` filter does **not** force-dispatch into the filter dir; it only affects what's displayed.

This separation is deliberate: filtering ≠ scoping. The user can browse sessions from one cwd while dispatching from another.

---

## Why a Filter and Not a Subdirectory Scan?

The naive design would have been: `claude agents` only finds sessions whose `cwd` is inside the *current* terminal cwd. That's both more restrictive and less useful:

- **Restrictive**: a user often runs `claude agents` from `~/` or `/` to get a system-wide overview.
- **Less useful**: there's no `--cwd` opt-in semantics; you'd always be filtering implicitly.

The explicit `--cwd <path>` flag is opt-in filtering. By default (`--cwd` absent), the dashboard shows **all** sessions on the machine. With `--cwd`, the user is saying "I only want to see sessions related to this project right now."

---

## Edge Cases

### `--cwd` on a nonexistent path

`R3` (realpath) throws ENOENT. The action handler doesn't catch it explicitly — the error bubbles up and the agent view fails to mount. The user sees a generic error. *This is a usability gap* — a more user-friendly path would be: detect ENOENT, fall back to showing all sessions with a banner like `--cwd path does not exist; showing all sessions`. But the current code lets the error surface; users learn to verify the path.

### `--cwd` on a file (not a directory)

`R3` works on files too (returns the canonical realpath). `jobMatchesCwd` then computes `path.relative(file, jobOrigin)` — which works syntactically but means no job will ever match (a job's `cwd` is always a directory, never a file). The user gets an empty list. Again, no friendly error; just empty.

### Different drives on Windows

`path.relative` returns an absolute path when source and target are on different drives (e.g., `C:` and `D:`). The `!path.isAbsolute(rel)` check correctly rejects these. A user filtering with `--cwd D:\proj` would never see C:-drive sessions.

### Symlinked filter path vs symlinked job cwd

Both get realpath'd before comparison: the filter via `R3`, the job's `cwd` only if `originCwd` is unset and the worktree-regex matches. If `originCwd` is set, it's used verbatim — which can lead to misses if `originCwd` itself wasn't realpath'd when it was written. The current code accepts this; in practice `originCwd` is set from `I$()` which itself is realpath-resolved during process startup.

---

## Validation

| Claim | Source |
|-------|--------|
| `HG8` uses `path.relative + isAbsolute + ".." check` | cli_inner_pretty.js:565822-565825 |
| Filter is applied to `spawnOrigin(state)`, not raw `state.cwd` | cli_inner_pretty.js:565823 |
| Spawn origin unwraps `.claude/worktrees/X/...` to repo root | cli_inner_pretty.js:566055-566059 |
| `--cwd` is realpath-resolved at mount time | cli_inner_pretty.js:569093 |
| Filter applied in dashboard via `Oj = (j) => !cwd || HG8(...)` | cli_inner_pretty.js:567356 |
