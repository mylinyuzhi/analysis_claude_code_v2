# Subagent Worktree-Isolation Guard and the PTY-Host Orphan Watchdog (2.1.156 fixes)

## TL;DR

Two **independent** process-safety fixes shipped for background agents in v2.1.156. They share nothing except the `--bg` lineage, so this doc treats them as two halves.

1. **Subagent worktree-isolation guard** — `esH` (`esH`, cli_inner_pretty.js:346660-346684) is a path-block predicate that every file write/edit runs before touching disk. It exists to stop a background (`--bg`) session from scribbling on the user's *shared working checkout* before the session has carved out its own git worktree. v2.1.156 closes a hole: **subagents spawned inside a bg session were bypassing the guard** because the guard keyed off the bg session's resolved cwd (`C$`) but subagents run with a *different* cwd resolution (`f6`). The fix adds an explicit `$.agentId` branch (346675, 346679-346680) that (a) resolves the path base with `f6()` (the original/parent cwd) instead of `C$()`, and (b) emits a subagent-specific error telling the model to re-spawn with `isolation: "worktree"` or have the parent enter a worktree first. The isolation policy is resolved by `Eu6` (`Eu6`, cli_inner_pretty.js:346655-346659): env `CLAUDE_BG_ISOLATION` (`worktree`/`none`) wins, otherwise `settings.worktree.bgIsolation`. Setting `bgIsolation: "none"` is the documented escape hatch (346674).

2. **PTY-host orphan watchdog** — `jPz` / `runPtyHost` (`jPz`, cli_inner_pretty.js:559067-559275) is the `claude --bg-pty-host` subprocess that owns a `Bun.Terminal` and the real REPL child. v2.1.156 adds a `setInterval` watchdog (559217-559241) that captures the original parent pid `w = process.ppid` at startup (559088) and, every `CLAUDE_PTY_ORPHAN_CHECK_MS` (default 2000ms, 559218), checks whether it has been re-parented (the daemon died → `process.ppid !== w`) **and** has zero connected clients. After 30 consecutive such ticks (~60s, 559219/559226) it `SIGTERM`s then (5s later) `SIGKILL`s the REPL child, records `ptyhost_orphan_watchdog` as the job exit-cause (559229), and lets the host fall through to exit. This fixes orphaned `claude --bg-pty-host` processes pegging a CPU at 100% after the daemon exits on macOS. The same region also covers the macOS TCC-disclaim re-spawn (`a69`, 559016-559057 + `OPz`, 558989-559015) and process-group signal forwarding (559137, 559194, 559242-559255).

**Confidence: high.** Both features are **NEW post-2.1.88** — there is no pty-host and no worktree-isolation guard in the 2.1.88 readable tree. The `CLAUDE_CODE_SESSION_KIND` concept *does* exist in 2.1.88 (`src/utils/concurrentSessions.ts:31-37`), so the `"bg"` gate has a precursor even though the guard built on top of it does not.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions / constants in this document:
- `worktreeIsolationGuard` (`esH`) — path-block predicate run before writes (cli_inner_pretty.js:346660-346684)
- `resolveBgIsolation` (`Eu6`) — env-then-settings bg-isolation policy resolver (cli_inner_pretty.js:346655-346659)
- `getOriginalCwd` (`f6`) — original/parent cwd, ignores AsyncLocalStorage override (cli_inner_pretty.js:2386-2388)
- `getSessionCwd` (`C$`) — session cwd (`jU$`) with `f6` fallback (cli_inner_pretty.js:42238-42244)
- `getStoreOrGlobalCwd` (`jU$`) — AsyncLocalStorage cwd or global cwd `vn` (cli_inner_pretty.js:42235-42237)
- `getActiveWorktreeSession` (`sY`) — returns the active bg worktree session record `mL$` (cli_inner_pretty.js:239369-239371)
- `getWorktreeCreateHook` (`m9H`) — true when a `WorktreeCreate` hook is configured (cli_inner_pretty.js:143815-143822)
- `isPathTrackedDirty` (`T_$`) — path is git-tracked and modified-vs-HEAD (cli_inner_pretty.js:46920-46923)
- `gitTrackedSha` (`y1`) — cached git-blob-sha lookup via `oq1` (cli_inner_pretty.js:46913-46918, 47419)
- `getMergedSettings` (`i6`) — merged settings object (cli_inner_pretty.js:53374-53376)
- `ENTER_WORKTREE_TOOL_NAME` (`n1H` = "EnterWorktree") — tool name referenced in the guard message (cli_inner_pretty.js:216098)
- `runPtyHost` (`jPz`) — `--bg-pty-host` entry point (cli_inner_pretty.js:559067-559275)
- `tccDisclaimRespawn` (`a69`) — macOS responsibility-disclaim re-spawn (cli_inner_pretty.js:559016-559057)
- `ensureAppBundleExec` (`OPz`) — materializes a `ClaudeCode.app` exec for TCC identity (cli_inner_pretty.js:558989-559015)
- `recordJobExitCause` (`nJ`) — writes the `exit-cause` (`VMq`) marker file in `CLAUDE_JOB_DIR` (cli_inner_pretty.js:9546-9551, 9564)
- `writePtyLog` (`$q9`) — appends a timestamped line to the pty-host log (cli_inner_pretty.js:559334-559343)
- `failPtyHost` (`wh$`) — log + `process.exit(1)` (cli_inner_pretty.js:559345-559348)
- Constants: `CLAUDE_PTY_ORPHAN_CHECK_MS` default `2000` (559218), orphan-tick threshold `30` (559219), `EqH = 1e4` resize cap (457477), `MPz = 1048576` client backpressure cap (559354)

---

# Part 1 — Subagent Worktree-Isolation Guard (`esH`)

## Background: why a background session must not write to the shared checkout

A `claude --bg` session runs detached, typically while the user keeps working in the foreground REPL on the **same git checkout**. If the bg agent edits files directly in that shared checkout, the user's uncommitted work and the agent's work collide — the user sees mysterious diffs appear under their feet, and a `git reset` by either side can destroy the other's changes.

The intended model is: a bg session that wants to write **first enters a git worktree** (`EnterWorktree`, `n1H`, cli_inner_pretty.js:216098) — a sibling checkout sharing the same `.git` — and all its edits land there. The shared checkout stays pristine. The guard `esH` is the enforcement point: it is consulted by the write-class tools (`validateInput`) before any byte hits disk, and it returns a non-null **error string** to block the write, or `null` to allow it.

`esH` is called from at least three write paths:
- the Write tool's `validateInput` — `esH(K, q)` (cli_inner_pretty.js:348064)
- a second edit tool path — `esH(z, _)` (cli_inner_pretty.js:348467)
- a further write/edit path — `esH(A, $)` (cli_inner_pretty.js:434361)

In each, the first arg is the resolved absolute target path and the second is the tool-call **context** carrying `agentWorktree` and `agentId`.

## The guard, verbatim

```javascript
// ============================================
// worktreeIsolationGuard - Blocks writes to the shared checkout before a bg session isolates
// Location: cli_inner_pretty.js:346660-346684
// ============================================

// ORIGINAL (for source lookup):
function esH(H, $) {
  {
    if ($.agentWorktree) {
      let _ = f6();
      return H.startsWith(_ + tsH.sep) && !H.startsWith($.agentWorktree + tsH.sep)
        ? `This agent is isolated in the worktree ${$.agentWorktree}. Edit the worktree copy of this file instead of the shared-checkout path.`
        : null;
    }
    if (process.env.CLAUDE_CODE_SESSION_KIND !== "bg") return null;
    let q = sY();
    if (q)
      return H.startsWith(q.originalCwd + tsH.sep) && !H.startsWith(q.worktreePath + tsH.sep)
        ? `This session is now isolated in ${q.worktreePath}. Edit the worktree copy of this file instead of the shared-checkout path.`
        : null;
    if (Eu6() === "none") return null;
    let K = $.agentId ? f6() : C$();
    if (!H.startsWith(K + tsH.sep)) return null;
    if (!y1(K) && !m9H()) return null;
    if (T_$(K)) return null;
    if ($.agentId)
      return `This subagent's parent bg session hasn't isolated yet, so writes to the shared checkout are blocked. Re-spawn this agent with \`isolation: "worktree"\`, or have the parent call ${n1H} before spawning. (To disable this guard for this repo, set \`"worktree": {"bgIsolation": "none"}\` in .claude/settings.json.)`;
    return `This background session hasn't isolated its changes yet. Call ${n1H} first so edits land in a worktree instead of the shared checkout, then retry this edit using the worktree path. (To disable this guard for this repo, set \`"worktree": {"bgIsolation": "none"}\` in .claude/settings.json.)`;
  }
  return null;
}

// READABLE (for understanding):
function worktreeIsolationGuard(targetPath, ctx) {
  // --- Branch A: agent already isolated in a worktree ---
  if (ctx.agentWorktree) {
    const originalCwd = getOriginalCwd();                 // f6()
    // Block iff the path lives under the original checkout but NOT under the agent's worktree.
    if (
      targetPath.startsWith(originalCwd + path.sep) &&
      !targetPath.startsWith(ctx.agentWorktree + path.sep)
    ) {
      return `This agent is isolated in the worktree ${ctx.agentWorktree}. ` +
             `Edit the worktree copy of this file instead of the shared-checkout path.`;
    }
    return null;
  }

  // --- Only background sessions are gated past this point ---
  if (process.env.CLAUDE_CODE_SESSION_KIND !== "bg") return null;

  // --- Branch B: this bg session has already entered a worktree ---
  const wtSession = getActiveWorktreeSession();           // sY() -> mL$
  if (wtSession) {
    if (
      targetPath.startsWith(wtSession.originalCwd + path.sep) &&
      !targetPath.startsWith(wtSession.worktreePath + path.sep)
    ) {
      return `This session is now isolated in ${wtSession.worktreePath}. ` +
             `Edit the worktree copy of this file instead of the shared-checkout path.`;
    }
    return null;
  }

  // --- Escape hatch ---
  if (resolveBgIsolation() === "none") return null;       // Eu6()

  // --- NOT yet isolated. Decide the protected base. ---
  const protectedBase = ctx.agentId ? getOriginalCwd()    // f6()  <- subagent
                                     : getSessionCwd();    // C$()  <- main bg session
  if (!targetPath.startsWith(protectedBase + path.sep)) return null;   // outside repo: allow

  // Only guard real git checkouts (or where a WorktreeCreate hook makes one possible).
  if (!gitTrackedSha(protectedBase) && !getWorktreeCreateHook()) return null;

  // If the base is git-tracked AND dirty-vs-HEAD, the user has already "claimed" it — allow.
  if (isPathTrackedDirty(protectedBase)) return null;

  // --- Block. Two messages: subagent-specific (NEW in 2.1.156) vs main bg session. ---
  if (ctx.agentId) {
    return `This subagent's parent bg session hasn't isolated yet, so writes to the shared ` +
           `checkout are blocked. Re-spawn this agent with \`isolation: "worktree"\`, or have ` +
           `the parent call ${ENTER_WORKTREE_TOOL_NAME} before spawning. (To disable this guard ` +
           `for this repo, set \`"worktree": {"bgIsolation": "none"}\` in .claude/settings.json.)`;
  }
  return `This background session hasn't isolated its changes yet. Call ${ENTER_WORKTREE_TOOL_NAME} ` +
         `first so edits land in a worktree instead of the shared checkout, then retry this edit ` +
         `using the worktree path. (To disable this guard for this repo, set ` +
         `\`"worktree": {"bgIsolation": "none"}\` in .claude/settings.json.)`;
}

// Mapping: esH→worktreeIsolationGuard, H→targetPath, $→ctx, _→originalCwd, q→wtSession,
//          K→protectedBase, tsH→path, f6→getOriginalCwd, C$→getSessionCwd,
//          sY→getActiveWorktreeSession, Eu6→resolveBgIsolation, y1→gitTrackedSha,
//          m9H→getWorktreeCreateHook, T_$→isPathTrackedDirty, n1H→ENTER_WORKTREE_TOOL_NAME
```

## How it works (step-by-step)

The guard is a 4-stage ladder. Each `return null` is "allow this write"; each non-null string is "block + explain".

```
                          esH(targetPath, ctx)
                                  │
       ┌──────────────────────────┴───────────────────────────┐
       │ Branch A: ctx.agentWorktree set?  (agent IS isolated) │
       └──────────────────────────┬───────────────────────────┘
                  yes              │              no
       ┌─────────────────────────┐│
       │ path under originalCwd  ││
       │ but NOT under worktree? ││
       │   yes → BLOCK (msg-A)   ││
       │   no  → allow (null)    ││
       └─────────────────────────┘│
                                   ▼
              CLAUDE_CODE_SESSION_KIND === "bg" ?  ── no ──▶ allow (null)
                                   │ yes
       ┌───────────────────────────┴────────────────────────────┐
       │ Branch B: sY() active worktree session?                 │
       │   under originalCwd & not under worktreePath → BLOCK    │
       │   else → allow (null)                                   │
       └───────────────────────────┬────────────────────────────┘
                                   │ no active worktree session
              resolveBgIsolation() === "none" ?  ── yes ──▶ allow (null)  (escape hatch)
                                   │ no
       ┌───────────────────────────┴────────────────────────────┐
       │ protectedBase = ctx.agentId ? f6() : C$()               │  ◀── 2.1.156 KEY LINE
       │ path not under protectedBase?            → allow (null) │
       │ base not git-tracked & no WorktreeCreate → allow (null) │
       │ base git-tracked AND dirty-vs-HEAD       → allow (null) │
       │ else → BLOCK:                                           │
       │   ctx.agentId ? subagent-msg : main-bg-msg             │  ◀── 2.1.156 NEW msg
       └─────────────────────────────────────────────────────────┘
```

**Stage 1 — already-isolated agent (Branch A, 346662-346667).** If the calling context carries `agentWorktree` (the agent was spawned with `isolation: "worktree"` and its worktree path is recorded on the context), the only thing left to police is *misrouted* writes: a path that is inside the original checkout (`f6() + sep`) but **not** inside the agent's own worktree. That is almost always the model accidentally using a shared-checkout absolute path instead of the worktree copy. The fix here is purely a path-prefix comparison, and crucially it resolves the original base via `getOriginalCwd` (`f6`, cli_inner_pretty.js:2386-2388) which returns `nk()?.originalCwd ?? d$.originalCwd` — i.e. the *true* launch cwd, not any AsyncLocalStorage-scoped override.

**Stage 2 — session-kind gate (346668).** `if (process.env.CLAUDE_CODE_SESSION_KIND !== "bg") return null;`. Everything below this line only applies to background sessions. A foreground REPL editing its own checkout is never blocked — that is exactly what the user wants. This is the same `CLAUDE_CODE_SESSION_KIND === "bg"` discriminator that 2.1.88 already used in `src/utils/concurrentSessions.ts:31-37`.

**Stage 3 — already-entered-worktree session (Branch B, 346669-346673).** `sY()` (`getActiveWorktreeSession`, cli_inner_pretty.js:239369-239371) returns the module-global `mL$` worktree-session record (set by `BL$`). If the bg session *has* already entered a worktree, the record carries `{originalCwd, worktreePath}`, and the guard again only blocks the misrouted-path case (under `originalCwd`, not under `worktreePath`). Otherwise it allows. This mirrors Branch A but for the main session rather than a subagent.

**Stage 4 — not-yet-isolated (346674-346681).** This is the heart of the guard and where the 2.1.156 fix lives.

1. **Escape hatch first (346674):** `if (Eu6() === "none") return null;` — if the repo opted out, never block.
2. **Pick the protected base (346675):** `let K = $.agentId ? f6() : C$();`
   - For the **main bg session** (`agentId` falsy): `C$()` (`getSessionCwd`, cli_inner_pretty.js:42238-42244) → tries `jU$()` (AsyncLocalStorage store cwd or global `vn()`), falling back to `f6()` on throw. This is the "wherever the session currently thinks it is" cwd.
   - For a **subagent** (`agentId` set): `f6()` (`getOriginalCwd`, the launch cwd). **This is the fix.** See "The 2.1.156 fix" below.
3. **Outside-repo allow (346676):** if the target is not under the protected base, it cannot be a shared-checkout write — allow.
4. **Only guard real checkouts (346677):** `if (!y1(K) && !m9H()) return null;` — `gitTrackedSha` (`y1`, cli_inner_pretty.js:46913-46918) returns a cached git-blob sha for the base (non-null ⇒ it is inside a git repo). If the base is not git-tracked **and** there is no `WorktreeCreate` hook (`m9H`, cli_inner_pretty.js:143815-143822) that could create one, there is nothing to isolate into — allow.
5. **Dirty-base allow (346678):** `if (T_$(K)) return null;` — `isPathTrackedDirty` (`T_$`, cli_inner_pretty.js:46920-46923) is true when the base path is git-tracked **and** its current content differs from HEAD (`y1(H) !== null && M3(H) !== y1(H)`). If the working tree is already dirty, the user has effectively claimed it / is mid-edit, so forcing isolation would be more disruptive than helpful — allow.
6. **Block with the right message (346679-346681):** if we reach here, this is a clean, git-tracked, not-yet-isolated bg write. Block it. **Subagents** (`agentId` set) get the new message instructing re-spawn with `isolation: "worktree"` or a parent `EnterWorktree` call; the **main session** gets the original "call `EnterWorktree` first" message. Both name the `bgIsolation: "none"` settings escape hatch.

## The 2.1.156 fix: the `$.agentId` branch

Before 2.1.156, Stage 4 unconditionally used the session cwd (`C$()`) as the protected base and emitted a single session-oriented message. The hole: a **subagent** spawned inside a bg session does **not** share the session's cwd resolution. Subagents run their tool calls under an AsyncLocalStorage scope whose `cwd` can differ, so `C$()` (which prefers `jU$()` → the store's cwd) returned the subagent's own scoped cwd, not the parent bg session's shared-checkout cwd. The result: `targetPath.startsWith(K + sep)` was **false** for shared-checkout writes routed through a subagent, so Stage 4 fell through to `return null` and the write was **allowed**. Subagents in background sessions thereby bypassed the worktree-isolation guard and wrote straight into the shared checkout — the exact bug the changelog calls out ("subagents in bg bypassing worktree-isolation guard").

The fix is two coordinated lines:

```javascript
// ============================================
// worktreeIsolationGuard: subagent cwd-base + message (2.1.156 fix)
// Location: cli_inner_pretty.js:346675, 346679-346680
// ============================================

// ORIGINAL (for source lookup):
let K = $.agentId ? f6() : C$();
// ...
if ($.agentId)
  return `This subagent's parent bg session hasn't isolated yet, so writes to the shared checkout are blocked. Re-spawn this agent with \`isolation: "worktree"\`, or have the parent call ${n1H} before spawning. (To disable this guard for this repo, set \`"worktree": {"bgIsolation": "none"}\` in .claude/settings.json.)`;

// READABLE (for understanding):
// Subagents resolve the protected base from the LAUNCH cwd (f6), not the
// AsyncLocalStorage-scoped session cwd (C$). f6() reflects the parent bg
// session's shared checkout, so startsWith() now correctly matches the
// subagent's attempted shared-checkout writes.
const protectedBase = ctx.agentId ? getOriginalCwd()  // f6() — parent bg launch cwd
                                  : getSessionCwd();   // C$() — main session cwd
// ...
if (ctx.agentId) {
  return "This subagent's parent bg session hasn't isolated yet, so writes to the shared " +
         "checkout are blocked. Re-spawn this agent with `isolation: \"worktree\"`, or have " +
         `the parent call ${ENTER_WORKTREE_TOOL_NAME} before spawning. ` +
         "(To disable this guard for this repo, set `\"worktree\": {\"bgIsolation\": \"none\"}` " +
         "in .claude/settings.json.)";
}

// Mapping: $.agentId→ctx.agentId, K→protectedBase, f6→getOriginalCwd, C$→getSessionCwd,
//          n1H→ENTER_WORKTREE_TOOL_NAME
```

### `f6` vs `C$`: why the cwd choice matters

- `getOriginalCwd` (`f6`, cli_inner_pretty.js:2386-2388): `return nk()?.originalCwd ?? d$.originalCwd;` — the **launch-time** original cwd, independent of any per-call AsyncLocalStorage scope. For a bg session this is the shared checkout the session was launched in.
- `getSessionCwd` (`C$`, cli_inner_pretty.js:42238-42244): `try { return jU$(); } catch { return f6(); }`, where `jU$` (cli_inner_pretty.js:42235-42237) is `MU$.getStore()?.cwd ?? vn()` — i.e. the **current AsyncLocalStorage store's** cwd first, the global cwd (`vn`) second.

For the **main** bg session, both typically agree, and `C$()` is the natural "where the session is now" choice (it also tracks an explicit `cd` the session may have done). For a **subagent**, tool calls execute inside a child AsyncLocalStorage scope; `C$()`/`jU$()` would return the subagent's *scoped* cwd, which may not be a prefix of the shared checkout, so the prefix test silently failed open. By selecting `f6()` for `agentId` contexts, the guard pins the protected base to the parent bg session's real launch checkout, so `targetPath.startsWith(protectedBase + sep)` reliably catches shared-checkout writes regardless of the subagent's scoped cwd.

**Key insight:** the bug was not in the *intent* of the guard but in *which cwd it measured against*. AsyncLocalStorage scoping made `C$()` lie about a subagent's effective root. The one-token branch `$.agentId ? f6() : C$()` is the entire structural fix; the new subagent message is just operator-facing guidance (re-spawn isolated, or parent-`EnterWorktree`, or opt out).

## `Eu6` — the isolation-policy resolver and the escape hatch

```javascript
// ============================================
// resolveBgIsolation - env-then-settings bg worktree-isolation policy
// Location: cli_inner_pretty.js:346655-346659
// ============================================

// ORIGINAL (for source lookup):
function Eu6() {
  let H = process.env.CLAUDE_BG_ISOLATION;
  if (H === "worktree" || H === "none") return H;
  return i6().worktree?.bgIsolation;
}

// READABLE (for understanding):
function resolveBgIsolation() {
  const env = process.env.CLAUDE_BG_ISOLATION;     // wins if it is a recognized value
  if (env === "worktree" || env === "none") return env;
  return getMergedSettings().worktree?.bgIsolation; // else fall back to settings.json
}

// Mapping: Eu6→resolveBgIsolation, H→env, i6→getMergedSettings
```

Resolution order:
1. `CLAUDE_BG_ISOLATION` env var, but only if it is exactly `"worktree"` or `"none"` (any other value is ignored and falls through).
2. `settings.worktree.bgIsolation` from the merged settings object (`i6`, `getMergedSettings`, cli_inner_pretty.js:53374-53376 → `GB().settings`).

The guard consults `Eu6()` at Stage 4 only (346674): `if (Eu6() === "none") return null;`. So the escape hatch is `"worktree": {"bgIsolation": "none"}` in `.claude/settings.json` (named in both block messages) or `CLAUDE_BG_ISOLATION=none`. Note the escape hatch is checked **after** Branches A and B — i.e. an *already-isolated* agent/session still gets its misrouted-path protection; `none` only disables the *forced-isolation* block for not-yet-isolated sessions.

### Where `CLAUDE_BG_ISOLATION` is propagated

This env var is not just read here — it is *set* on the spawned bg worker so the worker process inherits the policy:
- The dispatch path writes `...(V && { CLAUDE_BG_ISOLATION: V })` into the worker env (cli_inner_pretty.js:541890), where `V` derives from the dispatch's `isolation` decision.
- The worker launch env sets `if (H.isolation === "worktree") _.CLAUDE_BG_ISOLATION = "worktree";` (cli_inner_pretty.js:559895), alongside `CLAUDE_CODE_SESSION_KIND: "bg"` (559883). So a worker launched isolated carries both the `"bg"` session-kind and the `"worktree"` isolation policy, and the guard inside that worker sees them.

## Cross-validation (Part 1)

**Confidence: high, NEW post-2.1.88.** The 2.1.88 tree (`/lyz/codespace/3rd/claude-code/src`) has **no** `bgIsolation`, `agentWorktree`, `CLAUDE_BG_ISOLATION`, or `esH`-equivalent path guard (grep for those terms returns nothing). The only shared precursor is the `CLAUDE_CODE_SESSION_KIND === "bg"` discriminator in `src/utils/concurrentSessions.ts:31-37` (`envSessionKind()`), which establishes the bg-session identity the guard gates on but performs no path policing. The worktree-isolation guard, the subagent branch, and `Eu6` are all introduced after 2.1.88; the subagent `$.agentId` branch and its message are specifically the 2.1.156 delta.

---

# Part 2 — PTY-Host Orphan Watchdog (`jPz` / `runPtyHost`)

## What `--bg-pty-host` is

A background `claude` worker does not draw directly to a terminal — there is no attached TTY. To still give the worker REPL a real PTY (so TUI rendering, line editing, and signal semantics work), the daemon spawns a tiny **pty-host** subprocess: `claude --bg-pty-host <sock> <cols> <rows> -- <file> [args...]` (argv shape declared at cli_inner_pretty.js:559071; spawned at 559855 and 646857). The pty-host:
- creates a `Bun.Terminal` (559107-559115) and `Bun.spawn`s the actual REPL child attached to it (559116-559122),
- exposes a unix-domain socket (`t69.createServer`, 559161) that *clients* (the foreground viewer, the daemon) connect to in order to stream terminal output and inject input,
- forwards control messages (`resize`, `kill`) and signals to the REPL child's process group.

Entry point: `runPtyHost` (`jPz`, cli_inner_pretty.js:559067-559275), routed from argv at 649729 (`if (H[0] === "--bg-pty-host")`).

## The orphan problem (macOS)

The pty-host's parent is the daemon. If the **daemon exits** (crash, upgrade self-restart, OS kill) while the pty-host is still running, the pty-host is re-parented to `init`/`launchd` (its `process.ppid` changes). On macOS in particular the orphaned `claude --bg-pty-host` could then sit spinning a CPU at 100% indefinitely (no client, no parent telling it to stop, REPL child still alive) — the bug the 2.1.156 changelog calls "orphaned `claude --bg-pty-host` at 100% CPU after the daemon exits."

## The watchdog, verbatim

```javascript
// ============================================
// runPtyHost: orphan watchdog - kill the REPL child if re-parented & clientless
// Location: cli_inner_pretty.js:559088, 559217-559241
// ============================================

// ORIGINAL (for source lookup):
let w = process.ppid,
  D = 0,
// ... (server setup) ...
let v;
if (n$() !== "windows") {
  let h = Number(process.env.CLAUDE_PTY_ORPHAN_CHECK_MS) || 2000,
    I = 30;
  ((v = setInterval(() => {
    if (M) return;
    if (process.ppid === w || O.size > 0) {
      D = 0;
      return;
    }
    if (++D < 30) return;
    (clearInterval(v),
      $q9(q, `orphan watchdog: ppid ${w}→${process.ppid}, no client for ${30 * h}ms`),
      nJ("ptyhost_orphan_watchdog"));
    try {
      Z.kill("SIGTERM");
    } catch {}
    setTimeout(() => {
      if (!M)
        try {
          Z.kill("SIGKILL");
        } catch {}
    }, 5000).unref();
  }, h)),
    v.unref());
}

// READABLE (for understanding):
const originalPpid = process.ppid;   // w — captured at host startup
let orphanTicks = 0;                 // D — consecutive orphan+clientless ticks

let watchdog;
if (platform() !== "windows") {
  const checkMs = Number(process.env.CLAUDE_PTY_ORPHAN_CHECK_MS) || 2000;
  const TICK_THRESHOLD = 30;         // I (note: literal 30 reused below)

  watchdog = setInterval(() => {
    if (childExited) return;                       // M — REPL child already gone

    // Healthy if still under the original parent OR any client is connected.
    if (process.ppid === originalPpid || clients.size > 0) {
      orphanTicks = 0;
      return;
    }

    // Re-parented AND no clients: count the orphan tick.
    if (++orphanTicks < 30) return;                // need 30 consecutive ticks (~60s)

    clearInterval(watchdog);
    writePtyLog(sock, `orphan watchdog: ppid ${originalPpid}→${process.ppid}, ` +
                      `no client for ${30 * checkMs}ms`);
    recordJobExitCause("ptyhost_orphan_watchdog"); // nJ -> exit-cause marker file

    try { replChild.kill("SIGTERM"); } catch {}
    setTimeout(() => {
      if (!childExited) {
        try { replChild.kill("SIGKILL"); } catch {}
      }
    }, 5000).unref();
  }, checkMs);
  watchdog.unref();
}

// Mapping: w→originalPpid, D→orphanTicks, M→childExited, O→clients, Z→replChild,
//          q→sock, v→watchdog, h→checkMs, $q9→writePtyLog, nJ→recordJobExitCause
```

## How it works (step-by-step)

1. **Capture the original parent at startup (559088):** `let w = process.ppid` — recorded once, before any work. `w` is the daemon's pid.
2. **Only on non-Windows (559217):** the watchdog is gated `n$() !== "windows"` because the re-parenting / process-group model it relies on is POSIX.
3. **Tick interval (559218):** `CLAUDE_PTY_ORPHAN_CHECK_MS` env var, defaulting to `2000` ms.
4. **Per tick (559220-559239):**
   - If the REPL child already exited (`M`, the `childExited` flag set at 559260), do nothing — the host is already winding down.
   - **Health check (559222):** `if (process.ppid === w || O.size > 0)` — if the host is still parented by the original daemon **or** has at least one connected client (`O` is the live client `Set`), it is healthy; reset `D = 0` and return. This is the crucial AND-of-negations: an orphaned-but-still-watched host is *not* killed, and a re-parented host with a viewer attached is *not* killed. Only a host that is **both** re-parented **and** clientless is suspect.
   - **Debounce (559226):** `if (++D < 30) return;` — require **30 consecutive** suspect ticks before acting. At the default 2000ms that is ~60s of sustained orphan-with-no-client. The debounce avoids killing during a transient daemon hiccup or a brief client reconnect gap.
   - **Fire (559227-559238):** clear the interval, append a diagnostic line to the pty-host log via `writePtyLog` (`$q9`, 559334-559343), record the job exit-cause as `"ptyhost_orphan_watchdog"` via `recordJobExitCause` (`nJ`, 559229), then `SIGTERM` the REPL child and schedule a `SIGKILL` 5s later if it has not exited. The 5s `SIGTERM`→`SIGKILL` grace mirrors the explicit `kill` control handler (559147-559153).
5. **`unref()` (559240):** the interval is `unref`'d so it never by itself keeps the event loop alive — the host can still exit naturally when the child exits.
6. **Teardown (559260):** when the REPL child exits normally, `if (((M = !0), v)) clearInterval(v);` tears the watchdog down.

```
 host start: w = process.ppid (= daemon pid)
        │
        ▼  every CLAUDE_PTY_ORPHAN_CHECK_MS (2000ms)
   ┌─────────────────────────────────────────────┐
   │ childExited?  ── yes ──▶ (do nothing)        │
   │   no                                         │
   │ ppid == w  OR  clients > 0 ?                 │
   │   yes ──▶ D = 0  (healthy)                   │
   │   no  ──▶ D++                                │
   │            D < 30 ? ── yes ──▶ wait          │
   │            D >= 30 (≈60s) ──▶ ORPHAN         │
   │              • writePtyLog(...)              │
   │              • nJ("ptyhost_orphan_watchdog") │  → exit-cause marker
   │              • SIGTERM child                 │
   │              • +5s: SIGKILL child            │
   └─────────────────────────────────────────────┘
```

**Why `nJ` and not generic telemetry:** `recordJobExitCause` (`nJ`, cli_inner_pretty.js:9546-9551) writes its argument as the **`exit-cause`** marker file (`VMq = "exit-cause"`, 9564) inside `CLAUDE_JOB_DIR`. So `nJ("ptyhost_orphan_watchdog")` is not a metrics ping — it stamps the job's recorded exit reason so the supervising daemon / fleet view can later report *why* the worker ended ("orphan watchdog"). This is the same job-dir marker mechanism used elsewhere to attribute exit causes.

**Key insight:** the watchdog is deliberately conservative. It needs **two** simultaneous failure signals (re-parented **and** clientless) sustained for ~60s before it acts, then it escalates `SIGTERM`→`SIGKILL`. This avoids killing a healthy-but-briefly-detached host while guaranteeing a truly orphaned spinner is reaped within roughly a minute. The interval is `unref`'d so it is pure insurance — it never delays a clean exit.

## macOS TCC-disclaim spawn

Before the watchdog even starts, `runPtyHost` may re-spawn itself once to shed inherited macOS **TCC** (Transparency, Consent & Control) "responsibility". The very first thing it does is `if (!H.includes("--bg-spare", $ + 1)) await a69();` (559069), calling `tccDisclaimRespawn` (`a69`, 559016-559057).

```javascript
// ============================================
// tccDisclaimRespawn - re-spawn under responsibility-disclaim on macOS (once)
// Location: cli_inner_pretty.js:559016-559057
// ============================================

// ORIGINAL (for source lookup):
async function a69() {
  if (n$() !== "macos") return;
  if (process.env.CLAUDE_BG_TCC_DISCLAIMED) {
    delete process.env.CLAUDE_BG_TCC_DISCLAIMED;
    return;
  }
  let H = (await OPz()) ?? process.execPath;
  try {
    let $ = require("bun:ffi"),
      { symbols: q } = $.dlopen("/usr/lib/libSystem.B.dylib", {
        posix_spawnattr_init: { args: ["ptr"], returns: "int" },
        posix_spawnattr_setflags: { args: ["ptr", "i16"], returns: "int" },
        posix_spawnattr_destroy: { args: ["ptr"], returns: "int" },
        responsibility_spawnattrs_setdisclaim: { args: ["ptr", "int"], returns: "int" },
        posix_spawn: { args: ["ptr", "ptr", "ptr", "ptr", "ptr", "ptr"], returns: "int" },
      }),
      K = new BigUint64Array(1);
    if (q.posix_spawnattr_init(K) !== 0) return;
    try {
      if (q.posix_spawnattr_setflags(K, 64) !== 0 || q.responsibility_spawnattrs_setdisclaim(K, 1) !== 0) return;
      // ... build argv/env, set CLAUDE_BG_TCC_DISCLAIMED=1 ...
      q.posix_spawn(null, O, null, K, M, j);
    } finally {
      q.posix_spawnattr_destroy(K);
    }
  } catch {}
}

// READABLE (for understanding):
async function tccDisclaimRespawn() {
  if (platform() !== "macos") return;                 // POSIX-disclaim is macOS-only
  if (process.env.CLAUDE_BG_TCC_DISCLAIMED) {          // already the re-spawned copy
    delete process.env.CLAUDE_BG_TCC_DISCLAIMED;
    return;                                            // continue as the disclaimed process
  }
  const exe = (await ensureAppBundleExec()) ?? process.execPath;  // OPz() app-bundle exec
  try {
    const ffi = require("bun:ffi");
    const sym = ffi.dlopen("/usr/lib/libSystem.B.dylib", { /* posix_spawn* + disclaim */ });
    const attr = new BigUint64Array(1);
    if (sym.posix_spawnattr_init(attr) !== 0) return;
    try {
      // POSIX_SPAWN_SETEXEC (64): replace this image; setdisclaim(1): drop TCC responsibility.
      if (sym.posix_spawnattr_setflags(attr, 64) !== 0 ||
          sym.responsibility_spawnattrs_setdisclaim(attr, 1) !== 0) return;
      // re-exec self with CLAUDE_BG_TCC_DISCLAIMED=1 so the child early-returns above.
      sym.posix_spawn(null, exePathBuf, null, attr, argvArray, envArray);
    } finally {
      sym.posix_spawnattr_destroy(attr);
    }
  } catch {}
}

// Mapping: a69→tccDisclaimRespawn, OPz→ensureAppBundleExec, n$→platform,
//          posix_spawnattr_setflags(…,64)→POSIX_SPAWN_SETEXEC, setdisclaim(…,1)→drop TCC responsibility
```

**How it works:**
- **macOS-only (559017):** other platforms return immediately.
- **Idempotency guard (559018-559021):** if `CLAUDE_BG_TCC_DISCLAIMED` is already set, this *is* the re-spawned image — delete the flag and proceed normally. This prevents an infinite re-spawn loop.
- **Identity exec (559022 → `OPz`, 558989-559015):** `ensureAppBundleExec` materializes a `ClaudeCode.app/Contents/MacOS/claude` hardlink to the current binary plus an `Info.plist` (CFBundleIdentifier `com.anthropic.claude-code`, `LSUIElement` true, microphone usage string). Spawning *through the app bundle* gives the process a stable bundle identity for TCC prompts (microphone / accessibility) instead of an anonymous binary path. Falls back to `process.execPath` if the bundle can't be created.
- **FFI disclaim (559024-559053):** via `bun:ffi` it opens `libSystem.B.dylib`, sets `POSIX_SPAWN_SETEXEC` (flag `64`, replace-current-image) and `responsibility_spawnattrs_setdisclaim(attr, 1)`, then `posix_spawn`s itself with the same argv (rebuilt at 559045-559047, honoring `UY()` single-exe vs `argv[1]` script form) and the env augmented with `CLAUDE_BG_TCC_DISCLAIMED=1` (559049).

**Why:** `responsibility_spawnattrs_setdisclaim` tells macOS the new process is **responsible for its own TCC decisions** rather than inheriting the parent (daemon / terminal) app's responsibility. Without this, a bg pty-host could trigger or be governed by the wrong app's TCC grants. Combined with the `ClaudeCode.app` bundle identity, this gives the background pipeline a clean, self-consistent macOS privacy identity. The `--bg-spare` skip (559069) avoids paying this cost for pre-warmed spare hosts that have not yet been assigned real work.

## Process-group signal forwarding

The pty-host owns the REPL child's process group and forwards signals both ways:

- **Resize (559131-559140):** on a `resize` control message it clamps cols/rows to `EqH = 1e4` (457477), calls `P.resize(...)` on the `Bun.Terminal`, and (non-Windows) sends `SIGWINCH` to the whole group via `process.kill(-process.pid, "SIGWINCH")` (559137) so the child sees the window change.
- **Input-derived signals (559189-559200):** in exec mode (`CLAUDE_PTY_HOST_EXEC === "1"`, `Y`), raw input containing `0x03`/`0x1C` is translated to `SIGINT`/`SIGQUIT` and delivered to the group `process.kill(-process.pid, b)` (559194); `J` records the in-flight signal so the host's own handlers don't double-deliver it (559197-559198, 559244, 559251).
- **Host-received signals (559242-559255):** `for (let h of ["SIGTERM","SIGINT","SIGHUP"])` forwards each to the child (`SIGHUP` mapped to `SIGTERM`), skipping any signal already in flight from the input path (the `J === h` guard). In exec mode, `SIGQUIT` is also forwarded (559249-559255).
- **Kill control + exit teardown (559142-559158, 559261-559266):** the explicit `kill` control uses the same `SIGTERM`→(5s)→`SIGKILL` escalation as the watchdog; on natural child exit in exec mode the host sends `SIGHUP` to the group (559262-559265) to reap any stragglers.

Negative-pid `process.kill(-process.pid, ...)` targets the **process group**, ensuring grandchildren (e.g. a shell launched by the REPL) receive the signal too — important for the `--exec` shell sessions.

## Cross-validation (Part 2)

**Confidence: high, NEW post-2.1.88.** There is no pty-host whatsoever in the 2.1.88 readable tree (`/lyz/codespace/3rd/claude-code/src`): grep for `bg-pty-host`, `pty-host`, `runPtyHost`, `ORPHAN_CHECK`, `setdisclaim`, `TCC_DISCLAIM` returns nothing. The entire `--bg-pty-host` subprocess, the `Bun.Terminal`-based PTY, the macOS TCC-disclaim/app-bundle dance, and the orphan watchdog are post-2.1.88 additions. The orphan watchdog specifically (the `setInterval` at 559220, the `w = process.ppid` capture at 559088, and the `ptyhost_orphan_watchdog` exit-cause at 559229) is the 2.1.156 reliability delta.

---

## Summary

| Fix | Mechanism | Anchor |
|-----|-----------|--------|
| Subagents in bg bypassing worktree isolation | `esH` Stage 4 picks `f6()` (launch cwd) instead of `C$()` (scoped session cwd) when `$.agentId` is set, plus a subagent-specific block message | cli_inner_pretty.js:346675, 346679-346680 |
| Forced-isolation opt-out | `Eu6()` → `CLAUDE_BG_ISOLATION` env then `settings.worktree.bgIsolation`; `"none"` allows | cli_inner_pretty.js:346655-346659, 346674 |
| Orphaned `--bg-pty-host` at 100% CPU after daemon exit | `setInterval` watchdog: re-parented (`ppid !== w`) AND clientless for 30 ticks (~60s) → SIGTERM/SIGKILL child, stamp `ptyhost_orphan_watchdog` exit-cause | cli_inner_pretty.js:559088, 559217-559241, 559229 |
| macOS TCC self-consistency | `a69` re-execs once with `responsibility_spawnattrs_setdisclaim` + `ClaudeCode.app` bundle identity (`OPz`) | cli_inner_pretty.js:558989-559057 |

Both fixes follow the same design philosophy seen across the 2.1.156 background-agent hardening: pick the **correct measurement** (the right cwd; the right pair of failure signals), **debounce** before acting (the dirty-base allow; the 30-tick threshold), and **stamp an attributable cause** (`tengu_subagent_md_report_blocked`-style block reasons; the `exit-cause` marker) so the failure mode is observable rather than silent.
