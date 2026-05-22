# Changelog Analysis — Claude Code v2.1.113 → v2.1.142

This document is the **long-form narrative** for the v2.1.113 → v2.1.142 window. It complements:

- [`changelog_to_code_map.md`](changelog_to_code_map.md) — per-bullet code-traceability table
- The four `symbol_index_*.md` files — [core execution](symbol_index_core_execution.md), [core features](symbol_index_core_features.md), [platform infra](symbol_index_infra_platform.md), [integration infra](symbol_index_infra_integration.md)
- [`file_index.md`](file_index.md) — extracted-file inventory

The window spans 30 version numbers but **23 published releases** (v2.1.113, v2.1.114, v2.1.116–v2.1.123, v2.1.126, v2.1.128, v2.1.129, v2.1.131–v2.1.133, v2.1.136–v2.1.142). The seven skipped numbers (v2.1.115, .124, .125, .127, .130, .134, .135) were never published; v2.1.138 shipped as "internal fixes" only; v2.1.137 was VS Code-extension only.

---

## 1. Release Cadence

| Version | Items | Theme |
|---------|------:|-------|
| v2.1.113 | ~30 | Native binary cutover, sandbox denied-domains, wrapper-aware Bash deny, multi-line bash spoofing |
| v2.1.114 | 1 | Crash hotfix (permission dialog with teammate request) |
| v2.1.116 | ~28 | /resume perf on large sessions, thinking spinner inline-progressive, embedded bfs/ugrep prep |
| v2.1.117 | ~30 | Pro/Max default `high`, Glob/Grep → bfs/ugrep, Opus 4.7 1M context fix |
| v2.1.118 | ~30 | Vim visual mode, `/cost`+`/stats` → `/usage`, custom themes, MCP hook type, DISABLE_UPDATES |
| v2.1.119 | ~45 | `/config` persistence, OTel `tool_use_id`, PowerShell auto-approve, `prUrlTemplate` |
| v2.1.120 | ~25 | `claude ultrareview` CLI, `${CLAUDE_EFFORT}` in skills, `AI_AGENT` env, native bfs/ugrep |
| v2.1.121 | ~30 | `alwaysLoad` MCP, `claude plugin prune`, themes/dictation, X.509 WIF, multi-GB memory leaks |
| v2.1.122 | ~22 | Bedrock service tier, Vertex/Bedrock 400 cleanups, PR-URL `/resume`, OTel `@`-mention |
| v2.1.123 | 1 | Auth 401 retry-loop hotfix |
| v2.1.126 | ~25 | Gateway `/v1/models`, `claude project purge`, OAuth code paste, `invocation_trigger` OTel |
| v2.1.128 | ~30 | `/mcp` tool counts, OTEL_* not inherited, EnterWorktree HEAD branch, MCP reserved name |
| v2.1.129 | ~26 | `--plugin-url`, FORCE_SYNC_OUTPUT, PACKAGE_MANAGER_AUTO_UPDATE, plugin themes/monitors → experimental |
| v2.1.131 | 2 | VS Code Windows hotfix, Mantle `x-api-key` |
| v2.1.132 | ~25 | DISABLE_ALTERNATE_SCREEN, SESSION_ID, native graceful shutdown, MCP stdio non-protocol guard |
| v2.1.133 | ~14 | `worktree.baseRef`, `sandbox.bwrapPath/socatPath`, `parentSettingsBehavior`, `effort.level` hook field |
| v2.1.136 | ~30 | autoMode.hard_deny, CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL, plan-mode + Edit-allow fix |
| v2.1.137 | 1 | VS Code Windows activation |
| v2.1.138 | "Internal fixes" | (no public changelog items) |
| v2.1.139 | ~40 | **claude agents (Research Preview), /goal, /scroll-speed, hook args/continueOnBlock, agent-id headers** |
| v2.1.140 | ~12 | Agent subagent_type case-insensitive, /goal hooks-disabled error, agent palette |
| v2.1.141 | ~50 | terminalSequence hook field, ANTHROPIC_WORKSPACE_ID, `claude agents --cwd`, /feedback recent-sessions |
| v2.1.142 | ~22 | **`claude agents` dispatch flags, Fast Mode → Opus 4.7, /claude-api, /routines, clock-jump daemon** |

Average cadence is roughly bi-weekly. The window's center of gravity is **v2.1.139** — the largest single release in the window, introducing both `claude agents` and `/goal` and adding the agent-id telemetry headers that wire subagents into OTel.

---

## 2. The Native Binary Transition (v2.1.113)

**What changed:** The CLI no longer ships as bundled JavaScript loaded via `node`. Instead, the npm package is a thin launcher that spawns a platform-specific native binary published as an optional dependency (`@anthropic/claude-code-linux-x64`, `-darwin-arm64`, etc.).

**How it works:**

1. `claude` (the npm entry) probes for the matching platform's optional dep.
2. The native binary is a Bun-compiled bundle — Bun's `--compile` mode emits a self-extracting executable with the bundled bytecode in a `__BUN` section.
3. claude-code-bomb's extraction process uses Bun's section parser to re-emit a pretty-printed bundle (`cli_inner_pretty.js`).

**Why this approach:**

- **Cold start latency** — node CLI startup with a huge bundle was slow; native binary avoids the JS engine cold-start.
- **Background daemon viability** — `claude agents` needs a long-running daemon process. node CLIs don't have a clean idiom for "spawn a daemon that survives the spawning shell" on every platform. Bun's binary owns its lifecycle.
- **Distribution efficiency** — single-file binary is easier to ship in environments without a node ecosystem (Homebrew, WinGet, direct downloads).
- **Memory** — Bun's runtime is ~10× more memory-efficient than node for this workload class, which matters for long-running sessions.

**Trade-offs:**

- Bun has its own quirks (NO_PROXY support v2.1.117 fix), and macOS keychain locking differs from node's path.
- npm-installed builds still work (Windows + non-native deps), so users on locked-down systems aren't blocked.
- The transition created a string of platform-edge-case bugs across v2.1.116, .117, .121, .131, .132, .137 — most of them are downstream of the cutover.

**Key insight:** The native binary is not a UX feature in itself; it is the **substrate** that makes `claude agents` and the long-running daemon possible. Every release after v2.1.113 is reading from that new substrate.

---

## 3. claude agents — Background Sessions, Daemon, Dashboard

**What it does:** `claude agents` is a single list of every Claude Code session you have running (locally backgrounded via `&`, blocked-on-you, completed, or stale). It launched in v2.1.139 as a Research Preview and was rapidly hardened.

The architecture is **daemon + dashboard + dispatcher**:

1. **Daemon** (`claude daemon` subcommands): a background process that owns the sessions. Implemented in the native binary (see §2). The daemon survives terminal close, holds session state across reboots when configured, and exposes a control surface via per-OS sockets/pipes.
2. **Dashboard**: the React component `EQ4` (in `cli_unpack_pretty/decls/functions/EQ4.js`) renders the agent list with filters (cwd, status), allows attaching with the right arrow key, dispatches new sessions inline.
3. **Dispatcher**: the code path that constructs the args for a new session. By v2.1.142 it accepts `--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`, `--permission-mode`, `--model`, `--effort`, `--dangerously-skip-permissions` — basically every flag the user would normally pass to `claude` to scope the session.

### How v2.1.142 Hardened the Daemon

This is the deepest single area in the v2.1.142 changelog. Four daemon-level fixes:

```
- Fixed background sessions disappearing and daemon reconnect failing after
  macOS sleep/wake — the daemon now detects clock jumps instead of treating
  them as elapsed idle time
- Fixed daemon not exiting cleanly after the binary is upgraded (e.g.
  `brew upgrade`), causing dispatched agents to crash-loop on the deleted path
- Fixed background sessions not recognizing pre-existing git worktrees,
  blocking Edit while EnterWorktree refused to create a duplicate
- Fixed `claude --bg --dangerously-skip-permissions` not persisting across
  retire/wake
```

**Clock-jump detection** is the most architecturally interesting. The naive idle-timeout implementation reads `Date.now()` and compares to `lastActivity`. After macOS sleep/wake, that delta is huge (the sleep duration), but the actual elapsed user activity is zero. The fix is to use a **monotonic clock** (or a periodic heartbeat) for idle-time accounting, falling back to wall-clock only for actual timestamps.

**Brew-upgrade crash-loop**: Homebrew's upgrade-in-place replaces the binary file on disk while the daemon process still holds the open file descriptor. The daemon doesn't immediately die — but any restart attempt finds the binary at a different path (since the package manager moved it). The fix is to make the daemon detect this case (e.g. via inode/path stat) and exit cleanly before the next dispatch.

**Pre-existing worktree recognition**: Without this, `claude agents` dispatching into a worktree directory would get into a state where:
- The session is launched inside a git worktree.
- The implementation tried to "create" the worktree via `EnterWorktree` and got "already exists."
- Edit operations were rejected as "the cwd isn't a known worktree."

The fix teaches the dispatcher to recognize a pre-existing worktree (via `git rev-parse --show-toplevel` + worktree-list cross-reference) and skip the EnterWorktree step.

**Persisting `--dangerously-skip-permissions`**: When a `claude --bg --dangerously-skip-permissions` session is retired (auto-idle-exit) and then resumed, the permission mode was reset to default. The fix persists the mode in the per-session state file.

### Other Hardenings (v2.1.140–v2.1.142)

- **Empty placeholder cleanup** (v2.1.141): Pressing `←` from a fresh REPL was leaving stub session entries; now they're hidden.
- **5-min idle retire** (v2.1.141): Bare `←` background sessions auto-retire after 5 minutes idle.
- **`$EDITOR`/`$VISUAL` for "v to open in editor"** (v2.1.142): Was using daemon's default editor.
- **Network-drive Windows deadlock** (v2.1.142): startup-phase Ctrl+C now works.
- **Chrome shim disabled while attached** (v2.1.142): Background workers use a headless browser shim for `WebFetch` etc.; when the user attaches and clicks a link, the shim mode shouldn't apply.

### Disabling claude agents

`CLAUDE_CODE_DISABLE_AGENT_VIEW=1` (managed-settings tier) disables agent view, the daemon, `--bg`, `/background`. Useful for corporate deployments that don't want long-running sessions.

### 3.1 Deep Analysis: Dispatcher Flag Plumbing (`parseAgentsDispatchFlags`, v2.1.142)

**What it does:** When the user runs `claude agents --add-dir /foo --settings ./s.json --mcp-config ./m.json [...]`, the dispatcher needs to strip out the `agents` positional + any flags meant for the *dashboard* (`--cwd`) and pass everything else to the spawned per-session `claude` invocation. `parseAgentsDispatchFlags` (`Go6` at `cli_inner_pretty.js:65-103`) is the pre-parser that splits CLI argv into those two buckets without invoking the full argparser.

**How it works:**

1. Walks argv left-to-right with a manual cursor `z`. This is deliberately *not* commander/yargs — a full parser would error on unknown flags.
2. Consumes the literal `agents` token once (sets `hasAgentsPositional=true`); subsequent tokens are flags or values.
3. Recognizes five "dispatch-only" flag names (`--cwd`, `--settings`, `--add-dir`, `--plugin-dir`, `--mcp-config`) plus the boolean `--strict-mcp-config`. Each has a handler in object `A` that mutates either `q` (the dashboard's cwd filter) or `K` (the dispatched-session config).
4. Two value forms supported: `--flag=value` (handler called with `Y.slice(f+1)`) and `--flag value` (handler called with `H[++z]`). If the flag has no following value, it's pushed to `rest` for downstream argv processing.
5. Unknown args/flags are appended to `rest` verbatim — including `claude` (the binary name) and anything the dispatched session will re-parse with the full argparser.

**Why this approach:**

- **No central source of truth coupling**: the actual `claude` argparser is enormous and lives elsewhere. Forking it for the agents wrapper would have created a drift bug magnet (a new flag added to the main parser silently wouldn't propagate). The shim only knows about the *dispatch-only* flags and otherwise pretends everything else is opaque.
- **List-valued flags pre-aggregated** (`addDir: []`, `pluginDir: []`, `mcpConfig: []`): the dispatcher needs the list to be a JS array for the spawn call, not a serialized argv. Pre-aggregating in the shim lets the daemon's HTTP/IPC layer marshal the dispatch-config without re-parsing.
- **Alternative considered**: pass the entire argv through unchanged and let the spawned session figure out which flags affected the daemon (e.g. `--cwd` would mean "set my cwd"). Rejected because `--cwd` for `claude agents` means "filter the dashboard," not "set the session's cwd" — semantic overload.

**Key insight:** `parseAgentsDispatchFlags` is a **flag classifier**, not an argparser. It deliberately doesn't validate values, doesn't know defaults, and silently passes through everything it doesn't recognize. This is what lets new flags get added to `claude` proper (in subsequent releases) without touching the agents dispatcher.

**Code excerpt (dual-version):**

```javascript
// ============================================
// parseAgentsDispatchFlags - Splits argv into dashboard-cwd, dispatched-session config, and pass-through rest
// Location: cli_inner_pretty.js:65-103
// ============================================

// ORIGINAL (for source lookup):
function Go6(H) {
  let $ = !1, q, K = { addDir: [], pluginDir: [], settings: void 0, mcpConfig: [], strictMcpConfig: !1 }, _ = [];
  let A = { "--cwd": (z) => { q = z; }, "--settings": (z) => { K.settings = z; },
    "--add-dir": (z) => K.addDir.push(z), "--plugin-dir": (z) => K.pluginDir.push(z),
    "--mcp-config": (z) => K.mcpConfig.push(z) };
  for (let z = 0; z < H.length; z++) {
    let Y = H[z];
    if (Y === "agents" && !$) { $ = !0; continue; }
    if (Y === "--strict-mcp-config") { K.strictMcpConfig = !0; continue; }
    let f = Y.indexOf("="), O = f === -1 ? Y : Y.slice(0, f), M = Object.hasOwn(A, O) ? A[O] : void 0;
    if (M) { if (f !== -1) M(Y.slice(f + 1)); else if (z + 1 < H.length) M(H[++z]); else _.push(Y); continue; }
    _.push(Y);
  }
  return { hasAgentsPositional: $, cwdFilter: q, config: K, rest: _ };
}

// READABLE (for understanding):
function parseAgentsDispatchFlags(argv) {
  let hasAgentsPositional = false;
  let cwdFilter;
  const config = { addDir: [], pluginDir: [], settings: undefined, mcpConfig: [], strictMcpConfig: false };
  const rest = [];
  const handlers = {
    "--cwd":         (v) => { cwdFilter = v; },
    "--settings":    (v) => { config.settings = v; },
    "--add-dir":     (v) => config.addDir.push(v),
    "--plugin-dir":  (v) => config.pluginDir.push(v),
    "--mcp-config":  (v) => config.mcpConfig.push(v),
  };
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (tok === "agents" && !hasAgentsPositional) { hasAgentsPositional = true; continue; }
    if (tok === "--strict-mcp-config")          { config.strictMcpConfig = true; continue; }
    const eqIdx = tok.indexOf("=");
    const flagName = eqIdx === -1 ? tok : tok.slice(0, eqIdx);
    const handler = Object.hasOwn(handlers, flagName) ? handlers[flagName] : undefined;
    if (handler) {
      if (eqIdx !== -1)            handler(tok.slice(eqIdx + 1));     // --flag=value
      else if (i + 1 < argv.length) handler(argv[++i]);                // --flag value
      else                         rest.push(tok);                     // dangling flag
      continue;
    }
    rest.push(tok);
  }
  return { hasAgentsPositional, cwdFilter, config, rest };
}

// Mapping: Go6→parseAgentsDispatchFlags, H→argv, $→hasAgentsPositional, q→cwdFilter, K→config, _→rest, A→handlers, z→i (loop), Y→tok, f→eqIdx, O→flagName, M→handler
```

### 3.2 Deep Analysis: Pre-existing Worktree Recognition (`enterExistingWorktree`, v2.1.142)

**What it does:** When `claude agents` dispatches into a directory that is already a registered git worktree, the runtime needs to mark the session as "I'm in a worktree" *without* trying to create a new one. Before v2.1.142, the dispatcher always called the EnterWorktree creation path, which would fail with "already exists" — and downstream Edit refused because the cwd wasn't in the session's known-worktree set.

**How it works:**

1. Resolve the user-supplied path: `realpath(resolve(cwd, target))` produces `_` (the canonical target). Also realpath the git-repo root `K` (the value of `git rev-parse --show-toplevel`) as `A`, and the current cwd `q` as `z`.
2. Refuse two failure modes before any I/O:
   - `_ === A` → "this is the main working tree, not a linked worktree." A registered worktree is by definition *not* the repo root.
   - `_ === z` → "this is the current working directory" — same-cwd EnterWorktree is a no-op the caller didn't mean.
3. Cross-reference against `git worktree list` (via `NP8(K)`): iterate every registered worktree's `worktreePath`, realpath each, look for one whose canonical path equals `_`. If found, capture its branch via `worktreeBranch` to keep transcript metadata accurate.
4. If no registered worktree matches, throw a self-describing error including `git -C ${repoRoot} worktree list` as the troubleshooting command — useful in opaque container environments.
5. On success, write a session-state record with `enteredExisting: true`. Downstream code branches on this flag to skip "create the worktree."

**Why this approach:**

- **Cross-platform symlink robustness**: macOS frequently realpaths `/var` → `/private/var`, WSL has its own mount-point quirks, network drives may resolve differently each launch. Comparing un-realpath'd strings would fail intermittently. Three independent `realpath` calls (target, repo root, cwd) protect against three independent causes of false negatives.
- **Branch capture cost vs benefit**: parsing `git worktree list` is two-extra-syscalls per worktree, but the alternative (looking up the worktree's branch lazily later) breaks transcript metadata if HEAD is detached. The eager fetch makes downstream code branch-free.
- **Alternative considered**: try to call `EnterWorktree`'s create path and recover from "already exists" by detecting that case. Rejected because the error message from git is locale-dependent and the create path has side effects (registering a worktree-root file) that don't roll back cleanly.

**Key insight:** The function's job isn't to *enter* a worktree — it's to **prove the cwd is already a worktree** so the dispatcher can skip creation. The `enteredExisting: true` flag in the returned record is the entire point; everything else (path, branch, name) is just metadata reconstruction so downstream code can pretend the worktree was created normally.

**Code excerpt (dual-version):**

```javascript
// ============================================
// enterExistingWorktree - Recognize a pre-existing registered worktree at the target path
// Location: cli_inner_pretty.js:523107-523141
// ============================================

// ORIGINAL (for source lookup):
async function DE6(H, $) {
  let q = I$(), K = BY(q);
  if (!K) throw Error("Cannot enter an existing worktree: the current directory is not in a git repository.");
  let _, A, z;
  try { _ = await eY.realpath(ZM.resolve(q, $)); A = await eY.realpath(K); z = await eY.realpath(q); }
  catch (M) { throw Error(`Cannot enter worktree: ${$}: ${ZH(M)}`); }
  if (_ === A) throw Error(`Cannot enter worktree: ${$} is the main working tree, not a linked worktree.`);
  if (_ === z) throw Error(`Cannot enter worktree: ${$} is the current working directory.`);
  let Y = await NP8(K), f;
  for (let M of Y) try { if ((await eY.realpath(M.worktreePath)) === _) { f = M; break; } } catch {}
  if (!f) throw Error(`Cannot enter worktree: ${$} is not a registered worktree of ${K}. Run 'git -C ${K} worktree list' to see registered worktrees.`);
  let O = { originalCwd: q, worktreePath: _, worktreeName: ZM.basename(_), worktreeBranch: f.worktreeBranch, sessionId: H, enteredExisting: !0 };
  return ($JH(O), O);
}

// READABLE (for understanding):
async function enterExistingWorktree(sessionId, targetPath) {
  const cwd = getCwd();
  const repoRoot = getGitRepoRoot(cwd);
  if (!repoRoot) throw new Error("Cannot enter an existing worktree: the current directory is not in a git repository.");
  let canonicalTarget, canonicalRoot, canonicalCwd;
  try {
    canonicalTarget = await fs.realpath(path.resolve(cwd, targetPath));
    canonicalRoot   = await fs.realpath(repoRoot);
    canonicalCwd    = await fs.realpath(cwd);
  } catch (err) {
    throw new Error(`Cannot enter worktree: ${targetPath}: ${stringifyError(err)}`);
  }
  if (canonicalTarget === canonicalRoot) throw new Error(`Cannot enter worktree: ${targetPath} is the main working tree, not a linked worktree.`);
  if (canonicalTarget === canonicalCwd)  throw new Error(`Cannot enter worktree: ${targetPath} is the current working directory.`);
  const worktrees = await listGitWorktrees(repoRoot);
  let matched;
  for (const wt of worktrees) {
    try { if ((await fs.realpath(wt.worktreePath)) === canonicalTarget) { matched = wt; break; } } catch {}
  }
  if (!matched) {
    throw new Error(`Cannot enter worktree: ${targetPath} is not a registered worktree of ${repoRoot}. Run 'git -C ${repoRoot} worktree list' to see registered worktrees.`);
  }
  const record = {
    originalCwd: cwd, worktreePath: canonicalTarget, worktreeName: path.basename(canonicalTarget),
    worktreeBranch: matched.worktreeBranch, sessionId, enteredExisting: true
  };
  persistWorktreeSessionState(record);
  return record;
}

// Mapping: DE6→enterExistingWorktree, H→sessionId, $→targetPath, q→cwd, K→repoRoot, _→canonicalTarget, A→canonicalRoot, z→canonicalCwd, Y→worktrees, f→matched, O→record, NP8→listGitWorktrees, $JH→persistWorktreeSessionState
```

---

## 4. /goal — Stop Hook as Loop

**What it does:** `/goal <condition>` sets a session-scoped Stop hook that blocks Claude from finishing its turn until the condition is met. It auto-clears on success; you can clear it early with `/goal clear`.

**How it works** (inferred from `cli_inner_pretty.js:486759` prompt + `active_goal` event traces):

1. User types `/goal <condition>`.
2. The slash command (`T6A`) installs a synthetic session-scoped Stop hook that returns `{decision: "block", systemMessage: "Goal not yet met: <condition>"}` until the condition is satisfied.
3. Each turn after the model's response, the hook re-evaluates by inspecting the transcript. The "Briefly acknowledge the goal, then immediately start (or continue) working toward it — treat the condition itself as your directive" wording trains the model to make progress.
4. The UI overlay (`Xk4`, `cli_unpack_pretty/decls/functions/Xk4.js`) shows live elapsed time, turn count, and total tokens consumed. It uses an `active_goal` event type to push updates from the runtime to the UI.
5. When the condition is satisfied (auto-detected or `/goal clear`), the hook is removed and the overlay disappears.

**Why this approach:**

The naïve alternative would be a new "keep going" loop primitive in the agent loop. The implementation instead **composes existing pieces**:

- The Stop hook event was already wired (v2.1.88 baseline) — only the dispatch mechanism needed a new condition.
- The transcript-streaming UI was already wired (v2.1.88 baseline) — only a new overlay type needed to be added.
- Setting the condition via slash command and clearing it with `/goal clear` reuses the slash-command infrastructure.

This composition makes the feature available across all session modes (interactive, `-p`, Remote Control) for free.

**Key insight:** Treating the **condition itself** as the agent's directive (rather than a side-condition layered on top of another directive) is the prompt-engineering trick that makes the agent keep working. The hook prompt explicitly says: "treat the condition itself as your directive and do not pause to ask the user what to do."

**Edge cases hardened in v2.1.140:**

- `disableAllHooks` or `allowManagedHooksOnly` previously caused a silent hang (the Stop hook was never installed, so the agent kept stopping but no progress was visible). Now `/goal` shows a clear "use a command-type hook instead" error.

**Trusted-workspaces gate** (`ov5`): `/goal` only runs in trusted workspaces — restart and accept the trust dialog to enable.

### 4.1 Deep Analysis: Stop-Hook Reuse + Trust Gate Composition (v2.1.139)

**What it does:** `/goal <condition>` reuses the existing **Stop hook** event (originally designed for "block the agent from terminating until X") to implement a session-scoped "keep going" loop, gated by the *trusted workspaces* policy. No new event type, no new loop primitive — only string constants and an overlay React component were added.

**How it works:**

1. **Slash command entry**: `T6A` (the `/goal` slash-command definition object, `name: "goal"`) routes the user's command line to a handler.
2. **Trust gate** (`ov5` at `cli_inner_pretty.js:486760`): before anything else, the handler checks `isTrustedWorkspace()`. If not trusted, it emits the literal `"/goal is only available in trusted workspaces. Restart, accept the trust dialog, and try again."` — refusing to install a hook that would otherwise let the agent take actions without re-prompting.
3. **Hooks-enabled gate** (`av5`): if `disableAllHooks` or `allowManagedHooksOnly` is in effect, the handler refuses with `"/goal can't run while hooks are disabled..."`. This was hardened in v2.1.140 — earlier it would install the hook silently and the agent would just stop without explanation.
4. **Hook installation**: install a Stop hook into the session-scoped hook table whose pre-prompt is `FX8(condition)` — a template that formats the user's condition into a system-message-style directive. The hook's `decision` is `"block"`, with the directive in `systemMessage` so the model sees it on the *next* turn.
5. **Hook prompt** (`FX8` at the `var rP4` block, before `ov5`): the literal string injected into the model context is:
   > *"A session-scoped Stop hook is now active with condition: '<X>'. Briefly acknowledge the goal, then immediately start (or continue) working toward it — treat the condition itself as your directive and do not pause to ask the user what to do. The hook will block stopping until the condition holds. It auto-clears once the condition is met — do not tell the user to run `/goal clear` after success; that's only for clearing a goal early."*
6. **UI overlay** (`Xk4`, `GoalOverlayPanel`): a React component subscribes to the `active_goal` event stream from the runtime and renders elapsed time / turn count / token cost in a persistent banner.
7. **Auto-clear**: when the agent emits a "completion" signal (or the model itself decides the condition is met), the hook is removed. `/goal clear` is the manual escape hatch.

**Why this approach:**

- **No agent-loop changes**: a "keep going until X" loop primitive in the agent would have required threading a new termination check through every exit path in the loop. By reusing Stop hooks, the agent loop's existing "should I stop?" check already runs the condition.
- **Trust gate placement**: putting the trust check at the slash command (before hook install) means an untrusted workspace can never get into a state where the agent is silently progressing through tasks. Compare to checking at hook *execution* — the user would see a hook install, then later see "hook refused" and have to debug. The string at `:486760` is deliberately actionable: "Restart, accept the trust dialog, and try again."
- **String-template prompt over JSON schema**: the hook's "directive" reaches the model as a system message, not a tool-call result. The phrasing "treat the condition itself as your directive" is prompt-engineering specifically aimed at the model's training to favor direct instructions over conditional checks — without it, the model would politely ask "what should I do?" every turn.
- **Alternative considered**: a new `LoopUntil` tool that the model would call iteratively. Rejected because the model would have to *choose* to keep calling it; the hook-based approach makes "keep going" the default and "stop" the exception.

**Key insight:** `/goal` exists because the Stop hook event was *already* the perfect substrate. The team's add is purely composition: trust-gate (`ov5`) + hook-prompt template (`FX8`) + overlay (`Xk4`). The agent-loop code path is unchanged. This is why `/goal` automatically works inside `-p`, Remote Control, and `claude agents` dispatched sessions — all of those already honor session-scoped Stop hooks.

**Code excerpt (dual-version):**

```javascript
// ============================================
// GOAL_HOOK_DIRECTIVE_TEMPLATE - Stop-hook system-message template installed by /goal
// Location: cli_inner_pretty.js:~486755 (FX8 prompt builder, ov5 trust gate at :486760)
// ============================================

// ORIGINAL (for source lookup):
var rP4, RaH = 4000, rv5,
  FX8 = (H) => `A session-scoped Stop hook is now active with condition: "${H}". Briefly acknowledge the goal, then immediately start (or continue) working toward it — treat the condition itself as your directive and do not pause to ask the user what to do. The hook will block stopping until the condition holds. It auto-clears once the condition is met — do not tell the user to run \`/goal clear\` after success; that's only for clearing a goal early.`,
  ov5 = "/goal is only available in trusted workspaces. Restart, accept the trust dialog, and try again.",
  av5 = "/goal can't run while hooks are disabled (disableAllHooks or allowManagedHooksOnly is set in settings or by policy).";

// READABLE (for understanding):
const buildGoalHookSystemMessage = (condition) =>
  `A session-scoped Stop hook is now active with condition: "${condition}". ` +
  `Briefly acknowledge the goal, then immediately start (or continue) working toward it — ` +
  `treat the condition itself as your directive and do not pause to ask the user what to do. ` +
  `The hook will block stopping until the condition holds. ` +
  `It auto-clears once the condition is met — do not tell the user to run \`/goal clear\` after success; ` +
  `that's only for clearing a goal early.`;

const GOAL_TRUST_GATE_MSG =
  "/goal is only available in trusted workspaces. Restart, accept the trust dialog, and try again.";

const GOAL_HOOKS_DISABLED_MSG =
  "/goal can't run while hooks are disabled (disableAllHooks or allowManagedHooksOnly is set in settings or by policy).";

// Mapping: FX8→buildGoalHookSystemMessage, ov5→GOAL_TRUST_GATE_MSG, av5→GOAL_HOOKS_DISABLED_MSG, H→condition
```

---

## 5. /claude-api Skill (v2.1.142)

**What it does:** `/claude-api` is a model-invocable skill that walks the agent (and indirectly the user) through building LLM-powered apps using the Anthropic SDK. It's Claude-only — explicitly refuses to mix with OpenAI/etc.

**How it works:**

The skill body is at `cli_inner_pretty.js:593195` (identifier `ks4`) and is one of the largest skill prompts in the build. Key sections:

1. **Before you start**: scan target file for non-Anthropic provider markers (`import openai`, `gpt-4`, etc.) — if found, refuse and ask which direction to take.
2. **Output requirement**: use the official Anthropic SDK; raw HTTP only when explicitly requested.
3. **Never mix**: don't reach for `requests`/`fetch` in Python/TS just because it's lighter.
4. **Function/class names must come from explicit documentation** — either the `{lang}/` files in this skill or official SDK docs. Don't guess.

The skill body has language-specific subfolders (`python/`, `typescript/`, `java/`, etc.) and a `shared/live` directory with live documentation pointers.

**Why this approach:** The skill is a **prompt-engineering wedge against drift**. Without it, the model on a Python codebase might write OpenAI-shaped code even when the user wants Claude (since training data has more openai-pattern examples). The skill body's first paragraph aggressively redirects to Anthropic patterns.

**Trade-off:** The skill is huge. Loading it consumes context budget. The skill registry surfaces it conditionally — only when the model self-classifies the task as "build Claude-API code."

---

## 6. /routines Slash Command (v2.1.142)

**What it does:** `/routines` is the user-facing surface for managing **scheduled remote Claude Code agents** (cloud-side recurring routines, e.g. "every weekday at 9 AM, run this prompt"). It complements the local-only `CronCreate`/`CronDelete`/`CronList` tools.

**Architecture:**

- **Local**: `CronCreate` writes to `.claude/scheduled_tasks.json` or fires prompts within the current session.
- **Remote**: `/routines` calls the `claude.ai/code/routines` CCR API. Auth is in-process (`KK().CLAUDE_AI_ORIGIN`).

**Reference strings** (in `cli_inner_pretty.js`):

- Line 385268: "Manage scheduled remote Claude Code agents (routines) via the claude.ai CCR API. Auth is handled in-process — the token never reaches the shell."
- Line 385324: `${KK().CLAUDE_AI_ORIGIN}/code/routines/${H.id}` (manage-URL builder)
- Line 385377: `searchHint: "manage scheduled remote agent routines"`

**Why split local vs remote:** Local scheduled tasks are fast, cheap, and offline. Remote routines need cloud infrastructure (always-on scheduler, retry, alerting). Users want both — local for "every commit, lint this" and remote for "every day at 9 AM, summarize PR queue."

---

## 7. Fast Mode Default: Opus 4.6 → 4.7 (v2.1.142)

```
Fast mode now uses Opus 4.7 by default (previously Opus 4.6). Set
CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1 to pin fast mode to Opus 4.6
```

**What it does:** Fast Mode is a UI mode that biases the agent toward shorter, less-thinking responses. Previously it pinned Opus 4.6 (the older flagship); now it pins 4.7.

**Why this matters:**

- Opus 4.7 is more expensive per token. Fast mode users implicitly opt into higher cost.
- 4.7 is also "smarter" — fast-mode tasks complete in fewer turns, partially offsetting the per-token cost.
- The override env var (`CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1`) is targeted at users who specifically liked 4.6's pacing.

**Pattern observed across the window:** every few releases, default-model decisions shift in favor of newer/more capable models. The v2.1.117 change (Pro/Max default effort to `high` on Opus 4.6 and Sonnet 4.6) is a parallel example. The team treats default settings as a policy lever — they shift when telemetry shows the newer choice is dominating user-chosen behavior anyway.

---

## 8. Permissions Hardening — A Continuing Arc

Each release in this window closes a specific class of permission bypass or smooths the auto-mode/permission UX. Notable passes:

### v2.1.113 — Bash classifier and dangerous-path
- Bash deny rules now match commands wrapped in `env`/`sudo`/`watch`/`ionice`/`setsid` and similar exec wrappers.
- `Bash(find:*)` allow rules no longer auto-approve `find -exec`/`-delete`.
- macOS `/private/{etc,var,tmp,home}` paths treated as dangerous removal targets under `Bash(rm:*)`.
- Multi-line bash commands whose first line is a comment now show the full command in the transcript (closing a UI-spoofing vector — previously you could hide `rm -rf /` behind a fake "Hello world" comment).
- Bash `dangerouslyDisableSandbox` no longer runs without a permission prompt.

### v2.1.116 — Sandbox dangerous-path
- Sandbox auto-allow no longer bypasses the dangerous-path safety check for `rm`/`rmdir` targeting `/`, `$HOME`, or other critical paths.

### v2.1.118 — Auto-mode UX
- `$defaults` allow/soft_deny/environment merge instead of replacing built-in lists.
- "Don't ask again" on auto-mode opt-in.

### v2.1.126 — Catastrophic-removal safety net
- `--dangerously-skip-permissions` now bypasses prompts for writes to `.claude/`, `.git/`, `.vscode/`, shell config — but catastrophic removal commands (e.g. `rm -rf $HOME`) still prompt.
- Security fix: `allowManagedDomainsOnly` / `allowManagedReadPathsOnly` no longer ignored when a higher-priority managed-settings source lacked a `sandbox` block.

### v2.1.133 — Edit/Write allow rules and managed-settings merge
- `Edit`/`Write` allow rules scoped to drive root (`C:\`) or POSIX `/` no longer match incorrectly.
- `parentSettingsBehavior` admin key (`'first-wins' | 'merge'`) to let admins opt SDK `managedSettings` into the policy merge.

### v2.1.136 — Plan-mode + Edit-allow
- Plan mode now blocks file writes even when a matching `Edit(...)` allow rule exists (was a regression).
- Auto-mode `hard_deny` for unconditional blocks regardless of user intent or allow exceptions.

### v2.1.139 — Skill wildcard, autoAllowBashIfSandboxed
- `Skill(name *)` permission rules now work as a prefix match (matching `Bash(ls *)` behavior).
- `autoAllowBashIfSandboxed` honors shell expansions (`$VAR`, `$(cmd)`).

### v2.1.141 — Auto-dismiss and "Allowed by ..." dedup
- Switching permission mode while a tool-permission prompt is open auto-dismisses the prompt when the new setting permits.
- "Allowed by PermissionRequest hook" no longer repeats once per tool call under a collapsed read/search group.

**Pattern:** Each release closes ~3–8 specific bypass classes or polishes a specific UX corner. The cumulative effect across the window is a much-hardened permission system. The team appears to use **internal red-team testing + user reports** to identify new classes; once one is identified, several adjacent ones are usually closed in the same release.

---

## 9. MCP — Token Refresh, SSE Frame Caps, and Memory Bounds

MCP is the area with the most fixes across this window. Themes:

### Token-refresh races

A long arc of OAuth refresh fixes:

- v2.1.118: Concurrent refresh keychain race, `expires_in`-less token (hourly re-auth), step-up scope, `redirectUri` support, `mcp_authenticate` Microsoft 365 duplicate `prompt`.
- v2.1.121: Bash tool became permanently unusable when starting cwd was deleted (the native process holds the cwd handle).
- v2.1.136: OAuth refresh tokens lost on concurrent multi-server refresh.
- v2.1.141: Remote Control 401 on token rotation.

The recurring root cause is **cross-process and cross-server locking**: multiple sessions refreshing the same token concurrently, multiple MCP servers refreshing in parallel during startup. By v2.1.136 the team had a working cross-process lock.

### Frame caps and memory bounds

- v2.1.132: stdio MCP servers writing non-protocol data to stdout (10GB+ RSS).
- v2.1.139: HTTP/SSE MCP servers streaming non-protocol data — response bodies capped at 16 MB per SSE frame.
- v2.1.142: `MCP_TOOL_TIMEOUT` now actually raises per-request fetch timeout (was capped at 60s regardless of config).

These are all "third-party server misbehavior shouldn't crash Claude" fixes. The 16 MB cap is a generous-but-bounded number.

### Reserved names and config

- v2.1.128: `workspace` is reserved (existing servers with that name are skipped with a warning).
- v2.1.121: `alwaysLoad: true` — all tools from that server skip tool-search deferral.

### 9.1 Deep Analysis: MCP_TOOL_TIMEOUT — The Two-Reader Bug Fix (v2.1.142)

**What it does:** `MCP_TOOL_TIMEOUT` (in milliseconds) is the user-facing env var for "how long a single MCP tool call may run before we abort." In v2.1.142 the team added a **second** reader of this env var because the old design had **two unrelated timeouts** layered on top of each other — and only one of them was reading the env var. The lower one (the per-request fetch timeout) was hardcoded at 60s.

**The pre-fix state:**

- `getToolTimeoutMs` (`r15`, `cli_inner_pretty.js:413221-413224`) read `MCP_TOOL_TIMEOUT` and capped at `B$4 = 2147483647` (Int32 max ≈ 24 days). This controlled the **outer envelope** — the maximum time `MCPClient.callTool` would wait for a JSON-RPC reply. Default: `i15 = 1e8` ms (~27.8 hours, "effectively infinite," matching the v2.1.88 comment).
- For HTTP/SSE servers, the actual `fetch()` call had its **own** `AbortController` whose timer was `C$4 = 60000` (60 seconds), **never reading the env var**. The `OS6` HTTP middleware (`cli_inner_pretty.js:413356-413365`) spun up `setTimeout(...abort..., U$4(), ...)` — and the original `U$4` was just `() => C$4`.

The bug: a user setting `MCP_TOOL_TIMEOUT=600000` to allow a 10-minute tool call would see the outer envelope wait 10 minutes — but the inner `fetch` aborts at 60s with a `TimeoutError`. The outer envelope sees the abort, propagates it as "tool failed," and the user gets a 60-second-capped failure that contradicts their config.

**The fix (`U$4` at `cli_inner_pretty.js:413346-413349`):**

```javascript
function U$4() {
  let H = parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10);
  return H > 0 ? Math.min(Math.max(H, C$4), B$4) : C$4;
}
```

The new `U$4` (`getRequestFetchTimeoutMs`) reads the same env var with **different clamping semantics** than `r15`:

- **Minimum floor `C$4 = 60000` ms** — never let a user *lower* the fetch timeout below 60s. This protects MCP servers from being aborted while still doing legitimate setup work (TLS handshake, OAuth refresh).
- **Maximum ceiling `B$4 = 2147483647`** — same as `r15`, the Int32 max.
- **Default `C$4 = 60000`** — unchanged from the buggy version when env var is unset.

`r15` keeps different semantics: it caps to Int32 max and defaults to `i15 = 1e8` (much longer default, no floor). This is because the envelope timeout governs *any* JSON-RPC reply on *any* transport (stdio, HTTP, SSE), while the fetch timeout only governs the HTTP/SSE wire-level connection.

**How it works:**

1. User sets `MCP_TOOL_TIMEOUT=600000` (10 min).
2. `r15()` returns `min(600000, 2147483647) = 600000` ms → outer envelope waits up to 10 minutes for JSON-RPC reply.
3. `U$4()` returns `min(max(600000, 60000), 2147483647) = 600000` ms → fetch's AbortController fires after 10 minutes too.
4. Both timers now agree; the tool call may legitimately run for up to ~10 minutes.

Edge cases:
- `MCP_TOOL_TIMEOUT=30000` (30s, below floor): `U$4` returns `max(30000, 60000) = 60000` ms — the fetch still gives 60s even though the user requested 30. (Matches the "60s floor" intent.)
- `MCP_TOOL_TIMEOUT=` (empty) or unset: `parseInt("", 10) = NaN`, which is not `> 0`, so `U$4` returns the default `C$4 = 60000`. Same default as before.

**Why this approach:**

- **Two readers, two policies**: rather than one `getMcpToolTimeoutMs()` shared between envelope and fetch, the team kept them separate because envelope and fetch have *different* sensible defaults and *different* floor/ceiling semantics. A single reader would have forced a compromise — either no floor (breaks setup-time aborts) or a floor on the envelope timeout (breaks legitimate long-running tool calls on stdio servers that don't need a fetch timer at all).
- **Backwards compat default**: `C$4` (60s) is the *unset* default. Users who never set `MCP_TOOL_TIMEOUT` see the exact same behaviour as before.
- **Alternative considered**: reuse `r15` for both. Rejected because that would let users disable the 60s floor by leaving env unset (since `r15`'s default `i15 = 1e8` would propagate to fetch, and a runaway server with no JSON-RPC reply would hold an HTTP connection for 27 hours).

**Key insight:** This bug existed because the original `getMcpToolTimeoutMs` (v2.1.88 single-reader at `client.ts:222-229`) was written before HTTP/SSE MCP support added a *second* layer of timing. When that layer was added, the new `OS6` middleware needed a timeout — and the author hardcoded 60s because "that's what fetch does" without realizing the env var existed at a higher level. The fix is the rarest kind of timeout fix: it makes the system **respect a config knob the user already had** rather than adding a new one.

**Code excerpt (dual-version):**

```javascript
// ============================================
// getRequestFetchTimeoutMs - Per-fetch timeout for HTTP/SSE MCP transports (NEW v2.1.142)
// Location: cli_inner_pretty.js:413346-413349 (U$4); pair with r15 at 413221-413224
// ============================================

// ORIGINAL (for source lookup):
function r15() {
  let H = parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10);
  return H > 0 ? Math.min(H, B$4) : i15;
}
function U$4() {
  let H = parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10);
  return H > 0 ? Math.min(Math.max(H, C$4), B$4) : C$4;
}
// Constants (cli_inner_pretty.js:414052-414062):
// i15 = 1e8,            // default envelope timeout (~27.8 hours)
// B$4 = 2147483647,     // shared Int32-max ceiling
// C$4 = 60000,          // default + floor for fetch timeout (60s)

// READABLE (for understanding):
const MCP_TOOL_TIMEOUT_DEFAULT_MS = 1e8;            // ~27.8h envelope default (i15)
const MCP_TIMEOUT_INT32_MAX = 2147483647;           // shared ceiling (B$4)
const MCP_FETCH_TIMEOUT_FLOOR_MS = 60000;           // fetch default + minimum floor (C$4)

function getToolTimeoutMs() {                       // r15 — envelope (any transport)
  const parsed = parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10);
  return parsed > 0
    ? Math.min(parsed, MCP_TIMEOUT_INT32_MAX)
    : MCP_TOOL_TIMEOUT_DEFAULT_MS;
}

function getRequestFetchTimeoutMs() {               // U$4 — HTTP/SSE fetch AbortController
  const parsed = parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10);
  return parsed > 0
    ? Math.min(Math.max(parsed, MCP_FETCH_TIMEOUT_FLOOR_MS), MCP_TIMEOUT_INT32_MAX)
    : MCP_FETCH_TIMEOUT_FLOOR_MS;
}

// Mapping: r15→getToolTimeoutMs, U$4→getRequestFetchTimeoutMs, i15→MCP_TOOL_TIMEOUT_DEFAULT_MS, B$4→MCP_TIMEOUT_INT32_MAX, C$4→MCP_FETCH_TIMEOUT_FLOOR_MS, H→parsed
```

---

## 10. Compaction Improvements

The compaction subsystem matured further in this window after its v2.1.105 PreCompact-blocking landing:

- v2.1.119: Skills invoked before auto-compaction were being re-executed against the next user message (fix: invoked-skills carryover deduplication).
- v2.1.128: 1M-context-window models with smaller autocompact window falsely "Prompt is too long" (fix: don't trigger autocompact-block on this case).
- v2.1.129: Cache-miss warning appearing spuriously after `/clear` or compaction when changing `/effort` or `/model` (fix: suppress the warning when the cache was deliberately reset).
- v2.1.139: Compaction prompt now asks the model to preserve sensitive user instructions.
- v2.1.141: "Summarize up to here" option in Rewind menu (compress earlier context while keeping recent turns).
- v2.1.142: Reactive compaction first-summarize attempt seeds from the original request's overflow size (avoiding a wasted near-full-context retry).

The v2.1.142 change is subtle but important. Previously: if a request overflows the context, the compaction kicks in *after* the API returns "too long," does a full summarize, then retries. The summarize was started fresh — it didn't know **how much** to remove. So the retry could still be near-full and overflow again. The fix gives the summarize the original overflow size as a budget input, so the first summarize is aggressive enough to fit on the retry.

### 10.1 Deep Analysis: Reactive Compact Seeding from Overflow Size (v2.1.142)

**What it does:** Before v2.1.142, reactive compaction (`iterateReactiveSummarize` / `uq8`) always *started* by trying to preserve exactly `A - 1` of `A` total message groups (i.e. summarize only the oldest one). If that retry still overflowed, the loop incremented and tried to summarize 2 groups, then 3, etc. — quadratic blowup in the worst case. v2.1.142 adds an `initialTokenGap` seed: when reactive compact is triggered, the caller already *knows* how many tokens over-budget the request was. That gap is passed in, and the loop uses it to compute a smarter starting `Y` (groups-to-preserve) so the first summarize attempt has a realistic shot at fitting.

**Why "reactive" vs "proactive":**

- **Proactive** (`autoCompactDispatcher` / `sI2`): checks token count *before* sending the next request and compacts if usage exceeds a configurable threshold (usually ~80% of context window). Triggered by `currentTokens > limit * 0.8`. Catches almost all overflows.
- **Reactive** (`reactiveCompactDispatcher` / `Y97`, `runReactiveCompact` / `Ej6`): triggered *only* when the API itself returns a "prompt is too long" error despite the proactive path's check. This happens when token-estimation diverges from actual server-side count — e.g. tool-result payload size estimates are off, or attached files compress differently than expected.

Reactive is the safety net; proactive is the primary. But reactive has to work — if it fails, the user is stuck.

**How the seeding works (`uq8` at `cli_inner_pretty.js:243253-243336`):**

1. **Group the messages**: `hQH(K)` partitions filtered messages (no `progress` entries) into "groups" — message clusters that should be kept atomic during summarization (e.g. an assistant turn + its tool_results stay together). Let `A = groups.length`.
2. **Bail if `A < 2`**: nothing to compact (can't both keep at least one and summarize at least one if there's only one group).
3. **Seed `Y` (groups-to-preserve)**: default `Y = 1` (try to keep only the most recent group, summarize everything else). **If `initialTokenGap` is set** and `A > 3`, compute the per-group token sizes `M[i] = KV(groups[i])`, then:
   - Compute the "shortfall" `D = initialTokenGap - M[A-1]`: how many tokens we'd still need to free even after dropping all of the oldest group.
   - Call `B47(M, A-1, D)` to walk backwards from the most-recent group, accumulating per-group token sizes until the cumulative sum reaches `D`. The number of groups it took is the *additional* seed step. (Edge case: if it takes more than `A-1` groups, halve `A` instead — never preserve less than ~50% of groups in one shot.)
   - Set `Y = 1 + step` so the first attempt drops *more* of the oldest groups.
4. **Loop** until success or `Y >= A`:
   - Attempt to summarize the oldest `A - Y` groups via `summarizeReactiveAttempt` / `X3_`, preserving the newest `Y` groups verbatim.
   - On `prompt_too_long`, learn from the API's reported `tokenGap` (size of remaining overflow) and compute next step via `L3_(tokenGap, M, D)` — "gap_guided" mode if the gap is parseable, else "gap_unparseable" mode (step=1, slow fallback).
5. **Telemetry**: each attempt emits `tengu_reactive_compact_attempt` with `stepMode`, `stepSize`, `tokenGap`. Visible in the OTel pipeline, lets the team measure how often seeding wins on attempt 1.

**Why this approach:**

- **First-attempt success matters disproportionately**: every wasted reactive-compact attempt costs a full summarization call (which is itself a Sonnet/Opus inference). Reducing average attempts from ~2.5 to ~1.1 cuts compaction wall-time and cost ~50%.
- **Seed only when gap is known**: the `initialTokenGap` arg is optional — if the caller doesn't have a gap estimate (e.g. abort happened before the API responded), the loop falls back to the old "start at 1, grow on failure" behavior. No correctness regression for the no-info case.
- **The `A > 3` guard**: seeding is only worthwhile when there are enough groups for the math to matter. With 3 or fewer groups, just doing the naive "preserve 1" attempt is fine.
- **Gap parseability** (`L3_`'s two modes): the API's "prompt too long" error message sometimes includes the exact overflow size, sometimes doesn't. The "gap_guided" branch uses the number when present; "gap_unparseable" falls back to step=1 increments. This is defensive against API error-format changes.

**Key insight:** The clever part is treating the API's "prompt too long" response not as a binary "retry" signal but as a **negative gradient**: each failure tells you the magnitude of the remaining shortfall, so each subsequent attempt's seed can be sharper. The first attempt is the most valuable to get right (saves a full summarize call), and the `initialTokenGap` from `Y97` makes that first attempt informed instead of blind.

**Code excerpt (dual-version):**

```javascript
// ============================================
// iterateReactiveSummarize - Seeded reactive-compaction loop with token-gap-guided steps
// Location: cli_inner_pretty.js:243253-243336 (uq8); seed-step computed by B47/L3_
// ============================================

// ORIGINAL (for source lookup):
function B47(H, $, q) {
  let K = 0, _ = 0;
  for (let A = $ - 1; A >= 0; A--) if (((K += H[A]), _++, K >= q)) break;
  if (_ >= $ - 1) return Math.max(1, Math.floor($ / 2));
  return _;
}
function L3_(H, $, q) {
  if (H === void 0) return { mode: "gap_unparseable", step: 1 };
  return { mode: "gap_guided", step: B47($, q, H) };
}
async function uq8(H, $, q) {
  let K = X3(H).filter((D) => D.type !== "progress"), _ = hQH(K), A = _.length;
  if (A < 2) return { ok: !1, reason: "too_few_groups", attempts: 0, totalGroups: A };
  let z = $.toolUseContext.abortController.signal, Y = 1, f = 0, O = void 0, M, w = !1;
  if (q?.initialTokenGap !== void 0 && A > 3) {
    M = _.map((j) => KV(j));
    let D = q.initialTokenGap - (M[A - 1] ?? 0);
    if (D > 0) { let j = B47(M, A - 1, D); ((Y = 1 + j), (O = { mode: "seeded", step: j, tokenGap: q.initialTokenGap })); }
  }
  while (Y < A) { /* … attempt, learn, advance … */ }
  return { ok: !1, reason: "exhausted", attempts: f, totalGroups: A };
}

// READABLE (for understanding):
function stepFromTokenSum(perGroupTokens, lastIdx, shortfall) {
  let sum = 0, step = 0;
  for (let i = lastIdx - 1; i >= 0; i--) {
    sum += perGroupTokens[i]; step++;
    if (sum >= shortfall) break;
  }
  // If we'd have to summarize nearly everything, take a big bite instead of inching.
  if (step >= lastIdx - 1) return Math.max(1, Math.floor(lastIdx / 2));
  return step;
}

function chooseNextStep(reportedTokenGap, perGroupTokens, lastIdx) {
  if (reportedTokenGap === undefined) return { mode: "gap_unparseable", step: 1 };
  return { mode: "gap_guided", step: stepFromTokenSum(perGroupTokens, lastIdx, reportedTokenGap) };
}

async function iterateReactiveSummarize(messages, params, opts) {
  const filtered = stripProgress(messages);
  const groups = groupMessagesAtomically(filtered);
  const total = groups.length;
  if (total < 2) return { ok: false, reason: "too_few_groups", attempts: 0, totalGroups: total };

  const abortSignal = params.toolUseContext.abortController.signal;
  let groupsToPreserve = 1;
  let attempts = 0;
  let stepInfo = undefined;
  let perGroupTokens;
  let mediaStripped = false;

  // NEW v2.1.142: seed groupsToPreserve from the original overflow size.
  if (opts?.initialTokenGap !== undefined && total > 3) {
    perGroupTokens = groups.map(countTokens);
    const shortfall = opts.initialTokenGap - (perGroupTokens[total - 1] ?? 0);
    if (shortfall > 0) {
      const step = stepFromTokenSum(perGroupTokens, total - 1, shortfall);
      groupsToPreserve = 1 + step;
      stepInfo = { mode: "seeded", step, tokenGap: opts.initialTokenGap };
    }
  }
  // …loop: try summarize, on prompt_too_long advance by chooseNextStep(reportedGap)…
}

// Mapping: B47→stepFromTokenSum, L3_→chooseNextStep, uq8→iterateReactiveSummarize, H→messages|perGroupTokens|reportedTokenGap (context-dependent), $→params|lastIdx, q→opts|shortfall, K→filtered, _→groups, A→total, Y→groupsToPreserve, f→attempts, O→stepInfo, M→perGroupTokens, w→mediaStripped, D→shortfall (in uq8)
```

---

## 10b. Prompt Cache — TTL Ordering, 1-Hour Cache, and Subagent Coverage

The prompt cache subsystem (introduced earlier with `ENABLE_PROMPT_CACHING_1H` in v2.1.108) kept stabilizing in this window:

- v2.1.116: An intermittent API 400 error related to cache control TTL ordering when a parallel request completed during request setup. The cache-control entries on the message blocks have to be in a specific order; the race fix is deterministic ordering.
- v2.1.117: Opus 4.7 sessions falsely autocompacting too early — the implementation was computing the context window against 200K (Opus 4.6 default) instead of Opus 4.7's native 1M. This also affected cache-block sizing.
- v2.1.128: Sub-agent progress summaries were missing the prompt cache, causing ~3× `cache_creation` token cost. Fix: cache the summary prompt prefix.
- v2.1.129: 1-hour prompt cache TTL was being silently downgraded to 5 minutes. The downgrade was triggered by a mistakenly-broad gate in the cache-TTL resolver.
- v2.1.129: Spurious cache-miss warning after `/clear` or compaction when changing `/effort` or `/model`. Cache was deliberately reset; warning should be suppressed.
- v2.1.132: Bedrock and Vertex 400 errors when `ENABLE_PROMPT_CACHING_1H` is set. The 1-hour beta header isn't supported by all providers; the fix gates the header per-provider.

The recurring theme: the prompt cache pays for itself across long sessions but is fragile to small inconsistencies in request shape. Each fix in this window closes a class of "cache silently doesn't work" bug — which is much worse than visible cache failures because token cost balloons without user-visible signal.

---

## 11. Thinking — Spinner, Indicator, Bedrock Quirks

The thinking subsystem changes are mostly UX:

- v2.1.116: Thinking spinner inline-progressive ("still thinking", "thinking more", "almost done thinking"), replacing the separate hint row.
- v2.1.117: Opus 4.7 sessions falsely computing against 200K instead of 1M context; thinking.type.enabled 400 on Bedrock IP ARN with Opus 4.7 + thinking disabled.
- v2.1.136: Redacted thinking block after tool call: API 400 fix (model emits a redacted thinking block; previously the request layer included it in the next turn's request body, which the API rejected).
- v2.1.141: 10-sec amber spinner warmup ("the spinner now warms to amber after 10 seconds to signal Claude is still working").

---

## 12. UI / TUI / Renderer

Across this window, the UI churn is enormous. The dominant themes:

### Fullscreen / alt-screen renderer stability

- v2.1.116: Scrollback duplication in inline mode on resize/dialog-dismiss.
- v2.1.121: Scrolling up no longer snaps back to bottom every time a tool finishes; dialogs that overflow are scrollable.
- v2.1.132: `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1` to keep the conversation in native scrollback; mouse-wheel scrolling fixed in Cursor and VS Code 1.92–1.104; JetBrains 2025.2 scroll-wheel fixes.

### Custom themes (v2.1.118)

- `/theme` now supports creating and switching between named custom themes.
- JSON files in `~/.claude/themes/` can be hand-edited.
- Plugins ship themes via a `themes/` directory (later moved to `experimental:` in v2.1.129).

### Spinner verbs and tips

- v2.1.120: spinner tips hidden when the relevant feature already exists (don't recommend "install the desktop app" if it's installed).
- v2.1.122: `spinnerTipsOverride.excludeDefault` for time-based tips.
- v2.1.141: 10-sec amber warmup; spinner verbs honored in turn-completion.

### Internationalization

- v2.1.116: Devanagari and other Indic scripts.
- v2.1.121: Multiple unicode/grapheme fixes across Cmd+Left/Right, Ctrl+E/A/K/U/arrow.
- v2.1.139: Border-embedded text overflow on CJK/emoji; fuzzy-match emoji splitting.

---

## 13. Hooks — Platform Expansion

The hook system kept expanding:

- v2.1.118: `type: "mcp_tool"` (hooks can invoke MCP tools directly).
- v2.1.119: `duration_ms` in PostToolUse/PostToolUseFailure (tool execution time minus permission prompts and PreToolUse hooks).
- v2.1.119: Status-line stdin includes `effort.level` and `thinking.enabled`.
- v2.1.121: `hookSpecificOutput.updatedToolOutput` for **all tools** (was MCP-only).
- v2.1.133: `effort.level` JSON input field + `$CLAUDE_EFFORT` env var; Bash tool commands can read `$CLAUDE_EFFORT`.
- v2.1.139: `args: string[]` exec form (spawns command directly without shell, so path placeholders don't need quoting); `continueOnBlock` config for PostToolUse (set true to feed the hook's rejection reason back to Claude and continue).
- v2.1.139: Hooks now run **without terminal access** (prevents corruption of on-screen interactive prompts).
- v2.1.141: `terminalSequence` field (hooks emit desktop notifications, window titles, bells without a controlling terminal).
- v2.1.142: Hook configuration error for prompt/agent hooks misconfigured on SessionStart/Setup/SubagentStart — now shows clear "use a command-type hook instead" error.

Pattern: each hook event widens its return-value surface; each input gets a new field; each constraint that bites users gets a clear error message instead of silent failure.

### 13.1 Deep Analysis: terminalSequence Hook Field with OSC Allowlist (v2.1.141)

**What it does:** Adds a string field `terminalSequence` to every hook's JSON response. The string is interpreted as a terminal escape sequence — typically an OSC (Operating System Command) for desktop notifications (OSC 9 / OSC 777), window-title changes (OSC 0/1/2), tab-icon updates (OSC 99), or a literal BEL. The runtime parses the sequence, validates each OSC's `ps` number against a small allowlist, drops anything that doesn't match, and emits the survivors to the terminal at the appropriate moment.

**The security problem:** Hooks run with the user's shell privileges. If a malicious hook (e.g. one pulled in from a third-party plugin) could write arbitrary terminal escape sequences, it could:
- Move the cursor and overwrite preceding text ("hiding" something the user already saw)
- Inject text into the *input* stream via terminal-response queries (some terminals respond to DA/DCS queries with text that gets parsed by the next command)
- Change the terminal title to spoof which application the user is interacting with
- Write to the clipboard via OSC 52 (a real attack vector — `OSC 52 ; c ; <base64-payload>` writes to clipboard)
- Trigger arbitrary actions via OSC 8 (hyperlinks) with hostile URIs

The naive solution would be "let hooks emit any escape sequence." That would be a security disaster. The v2.1.141 solution is a **strict allowlist**.

**How it works:**

1. **Schema** (`cli_inner_pretty.js:238108-238114` and `:519030`): `terminalSequence: y.string().optional().describe("A terminal escape sequence (e.g. OSC 9 / OSC 777 desktop-notification) for Claude Code to emit on your behalf. Only notification/title OSCs (0, 1, 2, 9, 99, 777) and BEL are permitted; anything else is dropped.")`. The schema description tells the hook author the allowlist upfront.
2. **Hook output handling** (`TW8` / `applyHookJSONOutput` at `cli_inner_pretty.js:520641-520648`): when a hook returns a JSON response with `terminalSequence`, the runtime calls `Lm6(H.terminalSequence)` (the sanitizer). If it returns non-null, the sanitized result is attached to `M.terminalSequence`. If null, a warning is logged:
   > `Hook ${q} (${_}) returned a terminalSequence that was rejected by the allowlist (only OSC 0/1/2/9/99/777 and BEL are permitted)`
3. **Sanitizer** (`Lm6` at `cli_inner_pretty.js:467431-467435`): parses the input string into OSC/BEL tokens via `XZ5`, then maps each token: `bel` tokens become the literal BEL byte (`BT`); OSC tokens are re-emitted via `EZ(pj(q.ps, q.payload))` (reformatting the OSC sequence). If `XZ5` returns null (parse failure or any token outside the allowlist), the whole sequence is rejected.
4. **OSC allowlist** (`DZ5 = new Set([0, 1, 2, 9, 99, 777])` at `cli_inner_pretty.js:467457`): only these `ps` numbers are recognized as valid OSCs. Notably absent: OSC 8 (hyperlinks), OSC 52 (clipboard write), OSC 11/12 (color queries), all CSI/DEC private modes (cursor moves, screen clears).
5. **Dispatcher** (`Pm6` at `:467447`): pushes the sanitized sequence onto a stack of "pending terminal writes" (`F2$`). The top of the stack is called when the runtime is about to render — so the sequence emits at a *safe time* (not mid-render), preventing mid-rendering corruption.

**Why this approach:**

- **Allowlist over blocklist**: blocklists in escape-sequence land are catastrophic. Terminals have hundreds of escape sequences, new ones get added every year, and silently allowing an unknown sequence to slip through could enable a new attack class. An allowlist of 6 OSCs + BEL is provably bounded.
- **Six OSCs chosen for utility, not capability**:
  - **0/1/2**: window title (icon name, icon title, window title) — useful for "Claude is working in <project>" tab labels
  - **9**: iTerm2/macOS native notification
  - **99**: kitty desktop notification
  - **777**: cross-terminal desktop notification (used by rxvt, urxvt, Windows Terminal)
  All seven (with BEL) are **passive notification** mechanisms. None of them inject text or change terminal state in a way that affects future input.
- **Per-hook isolation**: each hook's `terminalSequence` is sanitized independently. A malicious hook can't smuggle bad sequences through a benign hook's output channel.
- **Sanitize-then-reformat (not pass-through)**: the sanitizer doesn't just *filter* — it parses and re-emits. This means an attacker can't sneak through unusual encodings (e.g. ST-terminated vs BEL-terminated OSCs, multi-byte payloads with embedded ESC). The output is always in the runtime's canonical OSC form.
- **Alternative considered**: pass the string through verbatim and let the terminal interpret it. Rejected for the reasons above. Even a single carelessly-allowed CSI sequence could overwrite preceding chat output.

**Key insight:** This is a **capability-narrowing** hook field, not a capability-adding one. The naive read of "hooks can now emit terminal sequences" sounds like an expansion of hook power; in fact, the design is the *minimum possible expansion* — exactly the six OSCs needed for the legitimate use case (desktop notifications, window titles, bells) and **nothing else**. The sanitizer's parse-and-reformat (rather than pass-through) is the architectural lever that makes this safe.

**Code excerpt (dual-version):**

```javascript
// ============================================
// sanitizeTerminalSequence - Parse, validate against OSC allowlist, re-emit canonical form
// Location: cli_inner_pretty.js:467431-467457 (sanitizer + allowlist); :520641-520648 (dispatch)
// ============================================

// ORIGINAL (for source lookup):
function Lm6(H) {
  let $ = XZ5(H);
  if ($ === null) return null;
  return $.map((q) => (q.kind === "bel" ? BT : EZ(pj(q.ps, q.payload)))).join("");
}
// …
var DZ5, jZ5 = 4096, F2$;
var Wm6 = T(() => { TKH(); cM(); DZ5 = new Set([0, 1, 2, 9, 99, 777]); F2$ = []; });
// Dispatch (TW8 / applyHookJSONOutput at :520641):
if (H.terminalSequence) {
  let D = Lm6(H.terminalSequence);
  if (D !== null) M.terminalSequence = D;
  else
    N(`Hook ${q} (${_}) returned a terminalSequence that was rejected by the allowlist (only OSC 0/1/2/9/99/777 and BEL are permitted)`);
}

// READABLE (for understanding):
const TERMINAL_SEQUENCE_OSC_ALLOWLIST = new Set([
  0,    // OSC 0  — icon name + window title (legacy combined)
  1,    // OSC 1  — icon name only
  2,    // OSC 2  — window title only
  9,    // OSC 9  — iTerm2 / macOS desktop notification
  99,   // OSC 99 — kitty desktop notification
  777,  // OSC 777 — rxvt / cross-terminal desktop notification
]);

const TERMINAL_SEQUENCE_MAX_LEN = 4096;                      // jZ5
const pendingTerminalWrites = [];                             // F2$

function sanitizeTerminalSequence(input) {                    // Lm6
  // parseTerminalSequenceTokens returns null if any token is outside
  // the OSC allowlist or BEL — partial acceptance is not allowed.
  const tokens = parseTerminalSequenceTokens(input);           // XZ5
  if (tokens === null) return null;
  return tokens
    .map((tok) =>
      tok.kind === "bel"
        ? BEL_BYTE                                              // BT
        : encodeAsOscSequence(formatOsc(tok.ps, tok.payload))   // EZ(pj(...))
    )
    .join("");
}

// At dispatch time (applyHookJSONOutput):
function applyTerminalSequenceFromHook(hookResponse, hookName, hookSourceFile, outAcc) {
  if (!hookResponse.terminalSequence) return;
  const sanitized = sanitizeTerminalSequence(hookResponse.terminalSequence);
  if (sanitized !== null) {
    outAcc.terminalSequence = sanitized;
  } else {
    log(
      `Hook ${hookName} (${hookSourceFile}) returned a terminalSequence ` +
      `that was rejected by the allowlist ` +
      `(only OSC 0/1/2/9/99/777 and BEL are permitted)`,
    );
  }
}

// Mapping: Lm6→sanitizeTerminalSequence, XZ5→parseTerminalSequenceTokens, DZ5→TERMINAL_SEQUENCE_OSC_ALLOWLIST, jZ5→TERMINAL_SEQUENCE_MAX_LEN, F2$→pendingTerminalWrites, BT→BEL_BYTE, EZ→encodeAsOscSequence, pj→formatOsc, TW8→applyHookJSONOutput (excerpt: applyTerminalSequenceFromHook), H→hookResponse|input|tokens (context-dependent), q→hookName, _→hookSourceFile, M→outAcc
```

---

## 14. Telemetry / OTel — Subagent IDs, Subprocess Isolation

The OTel surface kept expanding:

- v2.1.117: `cost.usage`, `token.usage`, `api_request`, `api_error` include `effort` attribute. `user_prompt` events include `command_name` and `command_source`. Custom/MCP command names redacted unless `OTEL_LOG_TOOL_DETAILS=1`.
- v2.1.119: `tool_result` and `tool_decision` include `tool_use_id`; `tool_result` includes `tool_input_size_bytes`.
- v2.1.121: `stop_reason`, `gen_ai.response.finish_reasons`, `user_system_prompt` (gated behind `OTEL_LOG_USER_PROMPTS`) to LLM request spans.
- v2.1.122: Numeric attributes on `api_request`/`api_error` emitted as numbers, not strings; `claude_code.at_mention` log event.
- v2.1.126: `invocation_trigger` attribute (`"user-slash"`, `"claude-proactive"`, `"nested-skill"`) on `claude_code.skill_activated`.
- v2.1.128: Subprocesses (Bash, hooks, MCP, LSP) no longer inherit `OTEL_*` environment variables — OTEL-instrumented apps run via Bash no longer pick up CLI's OTLP endpoint.
- v2.1.129: `claude_code.pull_request.count` counts MCP-tool-created PRs/MRs.
- v2.1.136: `CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL` for enterprises capturing responses through OTel.
- v2.1.139: `x-claude-code-agent-id`/`parent-agent-id` headers on subagent API requests; `agent_id`/`parent_agent_id` OTel span attributes.
- v2.1.141: Early OTel spans dropped in SDK/headless with beta tracing — fixed.

The subagent-id headers in v2.1.139 are the most architecturally significant — they enable **distributed tracing across subagent spawn**, so a parent's trace context includes the children's spans.

### 14.1 Deep Analysis: Agent-ID Header Propagation via AsyncLocalStorage (v2.1.139)

**What it does:** Every Anthropic API request originating from a subagent carries two new HTTP headers — `x-claude-code-agent-id` and `x-claude-code-parent-agent-id` — that thread the calling agent's identity through to the API gateway, which then re-emits them as OTel span attributes (`agent_id` / `parent_agent_id`) and audit-log fields. Because Claude Code spawns subagents as **in-process async tasks** (not subprocesses), the propagation mechanism uses Node's `AsyncLocalStorage` — the same primitive node's HTTP server uses to thread request context through middleware.

**The two stores (cli_inner_pretty.js:97615-97774):**

- `agentContextStore` (`Atq`) — one entry per currently-executing agent. Stores `{ agentId, parentAgentId, agentType: "subagent" | …, subagentName, isBuiltIn, invokingRequestId, invocationKind, invocationEmitted }`. Read via `getAgentContext` (`RD`), set via `runWithAgentContext` (`RU`).
- `teammateContextStore` (`Ei8`) — separate store for the parent → child *team* context (used when one agent's subagent is itself running as a "teammate" inside another agent's process). Read via `getTeammateContext` (`BW`), set via `runWithTeammateContext` (`sU$`), tested via `isInProcessTeammate` (`DZ`).

Both are `new AsyncLocalStorage()` instances created lazily on first import. The `_tq`/`jtq` async_hooks bindings are the underlying mechanism.

**How it works:**

1. **Spawn**: when the agent loop dispatches a subagent task, it computes `{ agentId, parentAgentId }` (UUIDs) and wraps the subagent's async body in `runWithAgentContext(ctx, async () => { ... })`. Node's AsyncLocalStorage tags every async continuation chained from that closure with `ctx`.
2. **API request**: the request builder at `cli_inner_pretty.js:128057-128062` reads `f = RD()` (the active agent context). If `f.agentId` is set, the header `"x-claude-code-agent-id": f.agentId` is added to the outgoing `Headers` object; same for `parentAgentId`.
3. **Header pass-through**: the Anthropic SDK doesn't strip unknown `x-claude-*` headers — they're passed through to the API gateway.
4. **OTel propagation**: at the gateway, `agent_id` and `parent_agent_id` become span attributes on the request span. A subagent's span thus *parents* under its dispatcher's span via the standard W3C traceparent header (which is added separately) plus these app-level identifiers for non-trace tooling.
5. **Cleanup**: when `runWithAgentContext` returns, the store entry is freed by AsyncLocalStorage — no manual cleanup needed.

**Cross-process implications:**

- The `AsyncLocalStorage` approach **only works within a single Node process**. Subagents spawned as separate Node processes (e.g. via `child_process.spawn` for `claude` CLI calls) don't inherit the store.
- For those, the dispatcher *exports* the agent context into env vars (or argv) which the spawned process imports back into its own `Atq` at startup. The headers travel the same way once re-imported.
- The `Ei8` (teammate) store specifically handles the "in-process teammate" case (note `isInProcess: !0` on the teammate context object) — useful when one agent invokes another agent's tool path without a subprocess.

**Why this approach:**

- **AsyncLocalStorage over explicit threading**: explicit threading would require passing `agentContext` through every async function signature — every tool call, every middleware, every API client call. That's hundreds of touch points. AsyncLocalStorage lets it ride invisibly with the async stack.
- **Two stores not one**: the agent context (`Atq`) and teammate context (`Ei8`) are *not* the same. An agent has one agentId; a teammate relationship is a (parent agent, child agent) pair that may persist across multiple `runWithAgentContext` boundaries. Keeping them separate lets the propagator emit both `x-claude-code-agent-id` (current agent's identity) and `x-claude-code-parent-agent-id` (caller's identity) independently.
- **Header-based over body-based**: putting the IDs in headers (not request body) means non-Anthropic LLM providers (Bedrock, Vertex) automatically strip them — no leakage of internal IDs to third parties. Anthropic's API explicitly forwards them.
- **Alternative considered**: a global mutable `currentAgent` variable. Rejected because subagent tasks run concurrently; a single mutable global would race.

**Key insight:** The `Atq` and `Ei8` stores are how a subagent's **identity travels invisibly with the async execution chain**, so the request builder at the very bottom of the stack can stamp the headers without anyone above it knowing about the propagation. This is the same pattern as W3C trace-context propagation in distributed tracing, but adapted for a single-process async agent runtime — and it's the reason a subagent's API calls show up correctly attributed in OTel without the agent loop having to thread context through every callsite.

**Code excerpt (dual-version):**

```javascript
// ============================================
// agentContextStore + propagateAgentIdHeaders - AsyncLocalStorage-based agent identity threading
// Location: cli_inner_pretty.js:97615-97774 (stores); :128057-128062 (header injection)
// ============================================

// ORIGINAL (for source lookup):
function RD()       { return Atq.getStore(); }
function RU(H, $)   { return Atq.run(H, $); }
function BW()       { return Ei8.getStore(); }
function sU$(H, $)  { return Ei8.run(H, $); }
function DZ()       { return Ei8.getStore() !== void 0; }
var _tq, Atq;
var yR = T(() => { _tq = require("async_hooks"); Atq = new _tq.AsyncLocalStorage(); });
var jtq, Ei8;
var ST = T(() => { jtq = require("async_hooks"); Ei8 = new jtq.AsyncLocalStorage(); });
// …elsewhere (cli_inner_pretty.js:128057-128062), the request builder reads RD() and stamps:
//   f = RD(),
//   w = { /* …other headers… */
//     ...(f?.agentId       && { "x-claude-code-agent-id":         f.agentId }),
//     ...(f?.parentAgentId && { "x-claude-code-parent-agent-id":  f.parentAgentId }) };

// READABLE (for understanding):
const asyncHooks = require("async_hooks");
const agentContextStore    = new asyncHooks.AsyncLocalStorage(); // Atq
const teammateContextStore = new asyncHooks.AsyncLocalStorage(); // Ei8

function getAgentContext()                 { return agentContextStore.getStore(); }                    // RD
function runWithAgentContext(ctx, fn)      { return agentContextStore.run(ctx, fn); }                  // RU
function getTeammateContext()              { return teammateContextStore.getStore(); }                 // BW
function runWithTeammateContext(ctx, fn)   { return teammateContextStore.run(ctx, fn); }               // sU$
function isInProcessTeammate()             { return teammateContextStore.getStore() !== undefined; }   // DZ

// Header injection at the very bottom of the API request stack:
function injectAgentIdHeaders(baseHeaders) {
  const agent = getAgentContext();
  return {
    ...baseHeaders,
    ...(agent?.agentId       && { "x-claude-code-agent-id":         agent.agentId }),
    ...(agent?.parentAgentId && { "x-claude-code-parent-agent-id":  agent.parentAgentId }),
  };
}

// Mapping: Atq→agentContextStore, Ei8→teammateContextStore, RD→getAgentContext, RU→runWithAgentContext, BW→getTeammateContext, sU$→runWithTeammateContext, DZ→isInProcessTeammate, _tq|jtq→asyncHooks, H→ctx, $→fn, f→agent
```

---

## 14a. Sandbox Path Customization — bwrapPath / socatPath (v2.1.133)

**What changed:** v2.1.133 added two managed-settings keys under `sandbox`: `bwrapPath` (absolute path to the `bwrap` bubblewrap binary) and `socatPath` (absolute path to the `socat` binary used for the sandbox's network proxy). Both are **admin-only** — they're read from the managed-settings tier and ignored from user or project settings.

### 14a.1 Deep Analysis: Why Custom Binary Paths Were Needed

**What it does:** On Linux/WSL, Claude Code uses `bubblewrap` for subprocess sandboxing (env scrubbing, network namespace isolation) and `socat` to proxy network traffic from inside the sandbox out to the real network. Before v2.1.133, both binary paths were resolved purely via `$PATH`. Corporate-Linux environments frequently fail one or both of:

1. **Renamed binaries**: some enterprise Linux distributions rename binaries to non-standard names (`bubblewrap` → `corp-bwrap`, `socat` → `socat2`) due to internal repackaging.
2. **PATH-stripping**: SSH/cron environments may not have `/usr/bin` or `/usr/local/bin` in `$PATH`. The CLI's PATH-fixup logic in `cli_inner_pretty.js:197395` adds known-good directories back, but it can't guess at non-standard install locations.
3. **Pinned versions**: shops that require a specific bubblewrap version may install it at `/opt/security/bin/bwrap-1.2.0` and refuse to symlink it into PATH.

The two settings let the admin point at the right binaries explicitly, while remaining opt-in (default: PATH-based resolution).

**How it works (validation pipeline):**

1. **Schema validation** at `cli_inner_pretty.js:48374-48388`: each path goes through `y.preprocess((H) => (typeof H === "string" && hu8.isAbsolute(H) ? H : void 0), y.string())`. The preprocess gate **rejects any non-absolute path** by mapping it to `undefined`. This is enforced at parse-time, before the path ever reaches the sandbox.
2. **Admin-only resolution** at `cli_inner_pretty.js:197238-197247`: `getBwrapPath` (`tz$`) and `getSocatPath` (`MgK`) walk only the *managed-settings* tier (`WPH()`) and return the first non-null value:
   ```javascript
   function tz$() { return WPH().map((H) => H.sandbox?.bwrapPath).find((H) => H != null); }
   ```
   `WPH()` returns the managed-settings sources (host-managed, org-managed, etc.). User and project settings are *not* walked — so a user cannot point the sandbox at a custom binary they planted (which would defeat the security boundary).
3. **Executability check** at `cli_inner_pretty.js:197395-197404`: after resolving, `Qt$()` (which calls `Fx(path)` to test) attempts to verify the binary is executable. If the admin set the path but the file isn't executable:
   > `sandbox.bwrapPath is set to ${path} but it is not an executable file. Fix the path in managed settings, or set CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0 to disable (loses subprocess isolation).`

   The error gives the user the override env var `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0` as an explicit, opt-in escape hatch — making it clear that disabling the sandbox is the alternative.
4. **Fallback to PATH**: if no managed setting is present, `Qt$()` falls back to `Fx("bwrap")` — the original PATH-based behavior. Backwards-compatible.

**Why this approach:**

- **Absolute paths only**: the schema-preprocess gate that turns non-absolute paths into `undefined` is a security invariant. A relative path like `./bwrap` would be resolved relative to the daemon's cwd — which an attacker could potentially influence. Refusing relative paths means there's no "trick the path resolver" attack surface.
- **Managed-settings only**: putting the setting in the admin tier (not user/project) is the entire point of the feature — it's about *admins* controlling the binary path for compliance/policy. A user-tier setting would let a malicious user point Claude at a `bwrap` shim that does nothing, bypassing the sandbox.
- **Executable check with named override**: the error message explicitly names `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0` as the escape hatch. This is opt-in degradation: the admin who set the bad path now knows both how to fix it *and* what they lose if they disable sandboxing. Compare to a silent fallback (which would silently disable the sandbox) — much worse from a security-posture standpoint.
- **Alternative considered**: a single `sandbox.binaries.{bwrap,socat}` nested object. Rejected because the two settings have independent lifecycles (some corp distros rename bubblewrap but not socat). Flat keys are more discoverable in `claude doctor` output.

**Key insight:** The feature is two settings, but the security model is what makes it correct: **(1) admin tier only, (2) absolute path enforced at schema time, (3) executability validated with a named escape hatch.** Each of those is independent of the other; remove any one and the feature becomes either useless (no admin gate → user-controlled binary) or dangerous (no abs-path check → relative-path injection) or opaque (no exec check → silent sandbox failure).

**Code excerpt (dual-version):**

```javascript
// ============================================
// sandbox.bwrapPath/socatPath schema + resolver - Admin-only sandbox binary paths
// Location: cli_inner_pretty.js:48374-48388 (schema), :197238-197247 (resolver), :197395-197404 (validation)
// ============================================

// ORIGINAL (for source lookup):
bwrapPath: y
  .preprocess((H) => (typeof H === "string" && hu8.isAbsolute(H) ? H : void 0), y.string())
  .optional()
  .catch(void 0)
  .describe("Linux/WSL only: Absolute path to the bwrap (bubblewrap) binary. Overrides auto-detection via PATH. Only honored from admin-controlled managed settings."),
socatPath: y
  .preprocess((H) => (typeof H === "string" && hu8.isAbsolute(H) ? H : void 0), y.string())
  .optional()
  .catch(void 0)
  .describe("Linux/WSL only: Absolute path to the socat binary used for the sandbox network proxy. Overrides auto-detection via PATH. Only honored from admin-controlled managed settings."),
// …
function tz$() { return WPH().map((H) => H.sandbox?.bwrapPath).find((H) => H != null); }
function MgK() { return WPH().map((H) => H.sandbox?.socatPath).find((H) => H != null); }
function Qt$() { let H = tz$(); if (H) return Fx(H); return Fx("bwrap"); }

// READABLE (for understanding):
const sandboxBwrapPathField = z
  .preprocess(
    (val) => (typeof val === "string" && path.isAbsolute(val) ? val : undefined),
    z.string(),
  )
  .optional()
  .catch(undefined)
  .describe(
    "Linux/WSL only: Absolute path to the bwrap (bubblewrap) binary. " +
    "Overrides auto-detection via PATH. " +
    "Only honored from admin-controlled managed settings.",
  );

function getBwrapPath() {                                                 // tz$
  return getManagedSettingsLayers()
    .map((layer) => layer.sandbox?.bwrapPath)
    .find((v) => v != null);
}

function getSocatPath() {                                                 // MgK
  return getManagedSettingsLayers()
    .map((layer) => layer.sandbox?.socatPath)
    .find((v) => v != null);
}

function resolveBwrapExecutable() {                                        // Qt$
  const customPath = getBwrapPath();
  if (customPath) return findExecutable(customPath);                       // Fx(path) → null if not executable
  return findExecutable("bwrap");
}

// When resolution fails after a custom path was set, the caller throws:
//   `sandbox.bwrapPath is set to ${customPath} but it is not an executable file.
//    Fix the path in managed settings, or set CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0
//    to disable (loses subprocess isolation).`

// Mapping: tz$→getBwrapPath, MgK→getSocatPath, Qt$→resolveBwrapExecutable, WPH→getManagedSettingsLayers, Fx→findExecutable, H→val|customPath|layer (context-dependent), hu8→path
```

---

## 15. Settings Schema Evolution

New settings added in this window:

| Setting | Version | Purpose |
|---------|---------|---------|
| `sandbox.network.deniedDomains` | v2.1.113 | Block specific domains even when broader allowedDomains wildcard would permit |
| `prUrlTemplate` | v2.1.119 | Custom code-review URL for footer PR badge |
| `worktree.baseRef` | v2.1.133 | `fresh` | `head` — branch from origin/<default> or local HEAD |
| `sandbox.bwrapPath`, `sandbox.socatPath` | v2.1.133 | Custom bubblewrap/socat binaries (Linux/WSL) |
| `parentSettingsBehavior` | v2.1.133 | `first-wins` | `merge` for SDK managedSettings tier |
| `autoMode.hard_deny` | v2.1.136 | Auto-mode classifier unconditional blocks |
| `tui` (preserved) | (v2.1.110) | Renderer mode |
| `effort.level` (in hook input) | v2.1.133 | Active effort level |
| `wslInheritsWindowsSettings` | v2.1.118 | WSL inherits Windows-side managed settings |

---

## 16. Environment Variables Added

| Env Var | Version | Purpose |
|---------|---------|---------|
| `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` | v2.1.142 | Pin Fast Mode to Opus 4.6 |
| `ANTHROPIC_WORKSPACE_ID` | v2.1.141 | Workload Identity Federation scoping |
| `CLAUDE_CODE_PLUGIN_PREFER_HTTPS` | v2.1.141 | Clone GitHub plugin sources over HTTPS |
| `CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL` | v2.1.136 | Re-enable feedback survey for OTel-capturing enterprises |
| `CLAUDE_CODE_SESSION_ID` | v2.1.132 | Available in Bash tool subprocess env |
| `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN` | v2.1.132 | Keep conversation in native scrollback |
| `CLAUDE_CODE_FORCE_SYNC_OUTPUT` | v2.1.129 | Force-enable synchronized output |
| `CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE` | v2.1.129 | Homebrew/WinGet background upgrade |
| `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY` | v2.1.129 | Opt in to gateway `/v1/models` |
| `ANTHROPIC_BEDROCK_SERVICE_TIER` | v2.1.122 | `default`/`flex`/`priority` |
| `DISABLE_UPDATES` | v2.1.118 | Stricter than `DISABLE_AUTOUPDATER` — blocks `claude update` too |
| `CLAUDE_CODE_HIDE_CWD` | v2.1.119 | Hide working directory in startup logo |
| `CLAUDE_CODE_FORK_SUBAGENT` (existing) | v2.1.117 | Now works in non-interactive |

---

## 17. The "Big Three" Architectural Changes

If you only remember three things about v2.1.113 → v2.1.142:

### A. Native Binary Cutover (v2.1.113)
The CLI now ships as a per-platform Bun-compiled binary instead of bundled JavaScript. This is the substrate for everything else (daemon, agents view, faster cold start).

### B. claude agents (v2.1.139–.142)
Background sessions, the daemon, the dashboard, and dispatcher flags. A new product surface on top of the native binary.

### C. /goal Stop Hook (v2.1.139)
A composition of existing Stop hook + UI overlay primitives that lets users say "keep going until X" and have the agent treat that condition as its directive. Composes cleanly with `-p`, Remote Control, and `claude agents` dispatch.

---

## 18. Cross-Validation Notes

Items that needed verification against source:

| Claim | Verification | Finding |
|-------|--------------|---------|
| Tool factory rename `Y9` → `XK` | extraction notes + cli_inner_pretty.js grep | Confirmed — affects tools_index extraction |
| SendUserFile tool added | `decls/vars/NH8.js` = `"SendUserFile"` | Confirmed — wired via `wi7` module namespace |
| Fast mode default Opus 4.7 | `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` at line 96906 | Confirmed |
| /goal command exists with name "goal" | line 507852–7860: `name: "goal"` slash-command def | Confirmed — see also `T6A` |
| /claude-api skill body in source | `cli_inner_pretty.js:593195` ks4 string | Confirmed |
| /routines manages claude.ai/code/routines | `cli_inner_pretty.js:385324` URL builder | Confirmed |

---

## 19. Where to Look for Specifics

- [`changelog_to_code_map.md`](changelog_to_code_map.md) — per-bullet → decl mapping
- [`file_index.md`](file_index.md) — extracted-file inventory
- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, LLM API, Tools, Agents, Subagent, State
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Plan, Background Agents, /goal, Compact, Hooks, Skills, Thinking, Steering, CLI
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands
- Per-unit symbol additions (transitional) — `symbol_additions_v2_1_142_*.md`
- Per-unit cross-validation reports — `cross_validation_report_*.md`
- `../../claude_code_v_2.1.112/analyze/` — the prior window (v2.1.88 → v2.1.112)
