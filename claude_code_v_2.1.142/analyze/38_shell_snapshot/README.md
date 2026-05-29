# Shell Snapshot Module (38_shell_snapshot) — v2.1.142

> Captures the user's interactive shell environment (functions, aliases, shell options, PATH) into a static `.sh` file at session start, then sources it before every Bash tool command. v2.1.142 makes embedded `bfs`/`ugrep` the default on macOS/Linux native builds, adds retention sweeps for snapshot files, falls back to system tools when the running claude binary is deleted, and propagates `CLAUDE_CODE_SESSION_ID` into the Bash tool subprocess env.

---

## Why Shell Snapshots Exist

Every Bash tool invocation spawns a brand-new shell. Without a snapshot, each command would either run in a bare environment missing the user's aliases/functions/PATH, or pay 200–500 ms per call to re-source `.bashrc`/`.zshrc`. Claude Code chooses a third option: run the user's shell config **once** at session start, freeze the resulting state into a snapshot file, then `source` that lightweight file before each command.

When the snapshot is present, the shell is spawned with `-c` (no `-l`) — the snapshot already contains everything a login shell would set up.

---

## Module Scope (this directory)

This document set covers only the **snapshot creation half** of the shell pipeline:

- Detecting the shell's config file (`.bashrc` / `.zshrc` / `.profile`)
- Generating the script that captures functions, options, aliases
- Injecting Claude Code's own overrides (rg fallback, find/grep shadows, bq shadow, PATH export)
- Executing the script with `execFile` and verifying the result
- Registering the cleanup hook
- **NEW for v2.1.142:** Retention sweep across snapshot files (v2.1.117), embedded-search-tool surfacing (v2.1.117), env propagation of `CLAUDE_CODE_SESSION_ID` (v2.1.132)

The **consumer side** — how the snapshot is sourced into the Bash tool's command string, CWD tracking, process lifecycle, and command-wrapping logic — lives in [command_assembly.md](./command_assembly.md), [bash_tool_integration.md](./bash_tool_integration.md), and [env_snapshot.md](./env_snapshot.md).

---

## Documents in This Module

| Document | Purpose |
|----------|---------|
| [implementation.md](./implementation.md) | End-to-end snapshot lifecycle: when triggered, what is captured, how it lands in the Bash tool spawn |
| [snapshot_creation.md](./snapshot_creation.md) | Deep deobfuscation of `createAndSaveSnapshot` (`ip7`) and `getSnapshotScript` (`Oi_`) — orchestration, telemetry, failure modes |
| [config_file_detection.md](./config_file_detection.md) | `getConfigFile` (`Sv6`), `getUserSnapshotContent` (`Yi_`), `getClaudeCodeSnapshotContent` (`fi_`) — shell-specific config mapping and content generation |
| [shell_integrations.md](./shell_integrations.md) | Overview of the three rg/find/grep integrations: why argv0 dispatch, build-time vs run-time control flow, composition order in the snapshot |
| [argv0_dispatch.md](./argv0_dispatch.md) | Deep dive on `createArgv0ShellFunction` (`Iv6`) — the four shell branches, the new **deny-pattern** dispatcher, and the v2.1.112→v2.1.142 path-resolution refactor (baked install path replaces `command -v claude`) |
| [ripgrep_integration.md](./ripgrep_integration.md) | `createRipgrepShellIntegration` (`Ki_`) — alias vs function form, `ripgrepCommand` 3-mode resolution, why rg is opt-in |
| [find_grep_integration.md](./find_grep_integration.md) | `createFindGrepShellIntegration` (`Ai_`) — every prepended flag explained, Oniguruma alternation gotcha, the **new ugrep-deny-pattern allowlist** that hands flags like `--filter` back to system grep |
| [env_snapshot.md](./env_snapshot.md) | `subprocessEnv` (`XI`) and provider overrides — including v2.1.128 OTEL strip, v2.1.132 `CLAUDE_CODE_SESSION_ID` injection, and the background-session env scrub list |
| [command_assembly.md](./command_assembly.md) | How the snapshot is sourced at command execution time; NUL substitution, pipe safety, eval wrapping, session-env hooks, extglob disable |
| [bash_tool_integration.md](./bash_tool_integration.md) | Integration with Bash tool's command builder `$U7` (createBashShellProvider) and `tY8` (exec) |
| [cross_validation.md](./cross_validation.md) | v2.1.88 source ↔ v2.1.142 obfuscated cross-reference and v2.1.112→v2.1.142 delta (symbol-by-symbol audit) |
| [version_diff_2_1_88_to_2_1_142.md](./version_diff_2_1_88_to_2_1_142.md) | Compact behavioural diff: the 11 architectural shifts between the v2.1.88 readable source and the v2.1.142 obfuscated bundle, plus the 13 load-bearing invariants that didn't change |
| [retention_cleanup.md](./retention_cleanup.md) | **NEW for v2.1.142**: v2.1.117 `cleanupPeriodDays` sweep extension to `shell-snapshots/`, with the `al5` flow and the shared `Rr` directory walker |
| [embedded_search_tools.md](./embedded_search_tools.md) | **NEW for v2.1.142**: v2.1.117 embedded `bfs`/`ugrep` replacing `Glob`/`Grep` on native macOS/Linux builds; v2.1.121 fallback when running binary is deleted mid-session |
| [ui_and_observability.md](./ui_and_observability.md) | The (minimal) user-visible UI surface — only the `claude project purge` warning — plus the full operator-facing observability matrix: debug log, OTEL spans, Tengu events, and what is *not* surfaced (Doctor / status line / banners) |

Plus shared symbol additions: [../00_overview/symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md)

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                          Session Start                                │
│                                                                       │
│  detectShell()  ─────────────►  createBashShellProvider ($U7)        │
│                                          │                             │
│                                          ├──► createAndSaveSnapshot   │
│                                          │    (ip7)                    │
│                                          │       │                     │
│                                          │       ▼                     │
│                                          │  getConfigFile (Sv6)        │
│                                          │  pathExists check (H_)      │
│                                          │  mkdir -p shell-snapshots   │
│                                          │  getSnapshotScript (Oi_)    │
│                                          │       │                     │
│                                          │       ├─ getUserSnapshotCon │
│                                          │       │  tent (Yi_)         │
│                                          │       └─ getClaudeCodeSnap  │
│                                          │          shotContent (fi_)  │
│                                          │       │                     │
│                                          │       ▼                     │
│                                          │  execFile(shell,            │
│                                          │   ["-c","-l", script],     │
│                                          │   timeout: 10s)             │
│                                          │       │                     │
│                                          │       ├─ ok → stat verify   │
│                                          │       │     register CK    │
│                                          │       │     cleanup, resolve│
│                                          │       │     path            │
│                                          │       └─ err → telemetry,   │
│                                          │            resolve(undef)   │
│                                          │                              │
│                                          ▼                              │
│  Executor object cached  ────►  buildExecCommand awaits snapshotPromise │
└──────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  Each Bash Tool Call (later)                          │
│                                                                       │
│  buildExecCommand assembles:                                          │
│      source <snapshot> 2>/dev/null || true                            │
│      && <session-env hooks>                                           │
│      && [export BUN_OPTIONS=...]  (if CLAUDE_CODE_REMOTE)             │
│      && shopt -u extglob 2>/dev/null || true                          │
│      && eval '<wrapped-user-command>'                                 │
│      && pwd -P >| <cwdFile>                                           │
└──────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────┐
│              Session shutdown OR daily retention sweep                │
│                                                                       │
│  registerCleanup callback fires:                                      │
│      unlink(snapshotPath)                                             │
│                                                                       │
│  AND: cleanupPeriodDays sweep (NEW in v2.1.117):                     │
│      al5() → Rr(~/.claude/shell-snapshots/, ".sh")                    │
│      Deletes stale snapshot-*.sh files older than N days              │
└──────────────────────────────────────────────────────────────────────┘
```

The snapshot creation happens **asynchronously** and **in parallel** with other startup work. `createBashShellProvider` (`$U7`) kicks off `ip7` as a non-awaited Promise and only awaits it inside `buildExecCommand` on the first command. If the snapshot fails or never produces a file, the executor degrades gracefully: it falls back to spawning with `-l` (login shell), accepting the per-command cost.

---

## Key Entry Points

Key functions in this module:

- `createAndSaveSnapshot` (`ip7`) — Orchestrator: shell-type detection → script gen → execFile → verify → cleanup register
- `getSnapshotScript` (`Oi_`) — Assembles the full `bash -c -l <script>` body that produces the snapshot
- `getUserSnapshotContent` (`Yi_`) — Generates functions+options+aliases capture (bash vs zsh branches)
- `getClaudeCodeSnapshotContent` (`fi_`) — Generates rg fallback, find/grep shadows, bq shadow, PATH export
- `getConfigFile` (`Sv6`) — Maps shell path to `~/.zshrc` / `~/.bashrc` / `~/.profile`
- `createArgv0ShellFunction` (`Iv6`) — Cross-shell function that dispatches via ARGV0/exec-a to a binary
- `createRipgrepShellIntegration` (`Ki_`) — Returns `{type: "function"|"alias", snippet}` for the rg fallback
- `createFindGrepShellIntegration` (`Ai_`) — Returns combined `unalias find/grep + bfs/ugrep functions` snippet, or null
- `createBigQueryShellIntegration` (`zi_`) — Forward-compat hook for BigQuery wrapper; returns null
- `createBashShellProvider` (`$U7`) — Builds executor object; kicks off snapshot promise; awaits in `buildExecCommand`
- `hasEmbeddedSearchTools` (`dM`) — Gate that controls whether find/grep shadows are emitted
- `getPluginBinPaths` (`bM6`) — Returns enabled-plugin `bin/` directories for the PATH export
- `getInstallBinDir` (`ne`) — Returns `~/.local/bin` (baked into argv0 functions)
- `cleanupShellSnapshots` (`al5`) — Retention sweep removing stale `.sh` files

### Constants

- `SNAPSHOT_CREATION_TIMEOUT` (`hv6`) — `1e4` (10,000 ms) for the execFile call
- `LITERAL_BACKSLASH` (`yv6`) — `"\\"` for base64-eval template string assembly
- `CLAUDE_CODE_EXECPATH_ENV` (`Rv6`) — `"CLAUDE_CODE_EXECPATH"` env var name
- `VCS_DIRECTORIES_TO_EXCLUDE` (`_i_`) — `[".git",".svn",".hg",".bzr",".jj",".sl"]` for the `grep` shadow's `--exclude-dir`
- `DEFAULT_CLEANUP_DAYS` (`ml5`) — `30` days for retention sweep

---

## Snapshot File Structure

A typical generated snapshot file looks like:

```bash
# Snapshot file
# Unset all aliases to avoid conflicts with functions
unalias -a 2>/dev/null || true

# Functions (bash: base64-encoded eval; zsh: direct typeset -f)
eval "$(echo '<base64>' | base64 -d)" > /dev/null 2>&1
# ... per non-completion function

# Shell Options
shopt -s expand_aliases
shopt -p ...                     # bash
# or  setopt ...                 # zsh
set -o emacs                     # bash POSIX flags

# Aliases (filtered: no winpty wrappers on Windows)
alias -- ll='ls -la'
alias -- gs='git status'

# Check for rg availability
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  function rg { ... ARGV0=rg "$_cc_bin" "$@" ... }
fi

# Shadow find/grep with embedded bfs/ugrep
unalias find 2>/dev/null || true
unalias grep 2>/dev/null || true
function find { ... ARGV0=bfs "$_cc_bin" -regextype findutils-default "$@" ... }
function grep {
  # NEW in v2.1.142: deny patterns delegate ugrep-only flags to system grep
  local _cc_a
  for _cc_a in "$@"; do
    case "$_cc_a" in -*-filter*|-*-pager*|-*-view*|-*-format-open*|-*-config*|---*|-@*|-*-save-config*) command grep "$@"; return ;; esac
  done
  ... ARGV0=ugrep "$_cc_bin" -G --ignore-files --hidden -I --exclude-dir=.git ... "$@" ...
}

# Add PATH to the file (heredoc with random delimiter)
cat >> "$SNAPSHOT_FILE" << 'PATH_END_<random16>'
export PATH='/usr/bin:/usr/local/bin:...'
PATH_END_<random16>
```

---

## Integration with Other Modules

| Module | Integration Point |
|--------|-------------------|
| Bash tool (`tY8` in cli_inner_pretty.js:518960) | Calls `$U7` (createBashShellProvider) which provides the snapshot-aware command assembler |
| Shell parser (29_shell_parser) | Validates user commands before they reach the snapshot-sourced shell |
| Sandbox (18_sandbox) | Snapshot path is still sourced inside sandboxed shells; `TMPDIR`/`TMPPREFIX` are overridden |
| Plugin system | `bM6()` discovers plugin `bin` directories and prepends them to the snapshot's exported PATH |
| Ripgrep (`aGH`/`$Y$`) | Provides `{rgPath, rgArgs, argv0}` consumed by `Ki_` for the rg fallback |
| Embedded tools (`dM()`) | `Ai_` checks this gate before emitting bfs/ugrep shadow functions |
| Retention sweep (`aB4`) | Periodically calls `al5()` to delete stale `.sh` snapshot files older than `cleanupPeriodDays` |
| Session ID (`v$`) | Injected as `CLAUDE_CODE_SESSION_ID` into every Bash tool subprocess env (v2.1.132) |
| CLI `claude project purge` (`dqA`) | Emits the only end-user-visible reference to `shell-snapshots/` — a yellow stderr warning explaining the directory is per-session and won't be purged (see [ui_and_observability.md](./ui_and_observability.md)) |

---

## Key v2.1.112 → v2.1.142 Changes

Six differences worth flagging at this level (full detail in dedicated docs):

1. **Baked-in install path replaces `command -v claude`** (`Iv6` in v2.1.142). v2.1.112's argv0 function looked up `claude` on PATH as the second fallback. v2.1.142 bakes `${HOME}/.local/bin/claude` directly into the function body. After v2.1.113's "native binary via per-platform optional dependency" change, the canonical install location is known and reliable. The system-fallback (`command find "$@"`) becomes the third tier — see [argv0_dispatch.md](./argv0_dispatch.md) Section 6.

2. **Deny-pattern dispatch for ugrep** (`Ai_` in v2.1.142). The new 4th argument to `Iv6` lists glob patterns; if any user argument matches, the wrapper falls through to system `grep` instead of routing to ugrep. Patterns are: `-*-filter*`, `-*-pager*`, `-*-view*`, `-*-format-open*`, `-*-config*`, `---*`, `-@*`, `-*-save-config*`. These are ugrep-specific flags that don't make sense to route through the wrapper — letting them go to GNU grep avoids confusion. See [find_grep_integration.md](./find_grep_integration.md).

3. **`hasEmbeddedSearchTools` (`dM`) is now unconditionally true on non-SDK builds.** v2.1.112 gated this on `EMBEDDED_SEARCH_TOOLS=1` env var. v2.1.142 removes the env-var gate entirely: native builds always have embedded `bfs`/`ugrep`. This matches the v2.1.117 changelog item: "Native builds on macOS and Linux: the Glob and Grep tools are replaced by embedded bfs and ugrep available through the Bash tool". See [embedded_search_tools.md](./embedded_search_tools.md).

4. **Retention sweep for `shell-snapshots/`** (v2.1.117). The shared `cleanupPeriodDays` sweep now removes stale `*.sh` files from `~/.claude/shell-snapshots/` via `al5() → Rr(...)`. Snapshots from sessions that crashed without firing graceful-shutdown cleanup are no longer leaked indefinitely. See [retention_cleanup.md](./retention_cleanup.md).

5. **`CLAUDE_CODE_SESSION_ID` env var in Bash tool subprocess** (v2.1.132). Every Bash tool spawn now sets `CLAUDE_CODE_SESSION_ID` to the current session UUID, matching what hooks receive. This lets scripts inside Bash tool commands correlate themselves with the session. See [env_snapshot.md](./env_snapshot.md).

6. **`createBigQueryShellIntegration` (`zi_`) explicitly returns null.** v2.1.112 had this as a wired stub; v2.1.142 keeps it as `function zi_() { return null; }`. The `BQ_FUNC_END` heredoc code path remains in `fi_` (`getClaudeCodeSnapshotContent`) for forward compatibility, but is never emitted. See [shell_integrations.md](./shell_integrations.md).

Additional v2.1.128/v2.1.132 changes affecting Bash tool env:
- `OTEL_*` env vars are now always stripped from subprocess env (v2.1.128 — prevents OTEL-instrumented apps from inheriting Claude Code's OTLP endpoint).
- New background-session env keys (`CLAUDE_CODE_SESSION_KIND`, `CLAUDE_BG_SOURCE`, `CLAUDE_BG_ISOLATION`, `CLAUDE_BG_BACKEND`, `CLAUDE_CODE_SESSION_NAME`, `CLAUDE_BG_AUTH_SNAPSHOT_PATH`, `CLAUDE_CODE_SUBSCRIPTION_TYPE`, `CLAUDE_CODE_RATE_LIMIT_TIER`, `CLAUDE_CODE_RESUME_INTERRUPTED_TURN`) are scrubbed before spawn so child processes don't pick up parent's background-session orchestration state.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md) — this module's additions

Key functions in this document (full list above):
- `createAndSaveSnapshot` (`ip7`) — top-level orchestrator
- `getSnapshotScript` (`Oi_`) — script-body assembler
- `getUserSnapshotContent` (`Yi_`) — captures user functions/options/aliases
- `getClaudeCodeSnapshotContent` (`fi_`) — injects rg/find/grep/bq/PATH
- `getConfigFile` (`Sv6`) — shell-path → config-path mapping
- `createArgv0ShellFunction` (`Iv6`) — argv[0]-dispatch shell function generator
- `createRipgrepShellIntegration` (`Ki_`) — rg fallback snippet builder
- `createFindGrepShellIntegration` (`Ai_`) — bfs/ugrep shadow builder
- `createBigQueryShellIntegration` (`zi_`) — placeholder, always null
- `hasEmbeddedSearchTools` (`dM`) — non-SDK gate (now unconditional)
- `createBashShellProvider` (`$U7`) — consumer of the snapshot promise
- `cleanupShellSnapshots` (`al5`) — retention sweep
