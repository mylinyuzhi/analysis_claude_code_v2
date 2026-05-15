# Shell Snapshot Module (38_shell_snapshot) — v2.1.112

> Captures the user's interactive shell environment (functions, aliases, shell options, PATH) into a static `.sh` file at session start, then sources it before every Bash tool command. Trades a single 10-second startup cost for sub-millisecond per-command environment restoration.

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

The **consumer side** — how the snapshot is sourced into the Bash tool's command string, CWD tracking, process lifecycle, and command-wrapping logic — lives in other modules (see Integration table below).

---

## Documents in This Module

| Document | Purpose |
|----------|---------|
| [implementation.md](./implementation.md) | End-to-end snapshot lifecycle: when triggered, what is captured, how it lands in the Bash tool spawn |
| [snapshot_creation.md](./snapshot_creation.md) | Deep deobfuscation of `createAndSaveSnapshot` (UPK) and `getSnapshotScript` (KzY) — orchestration, telemetry, failure modes |
| [config_file_detection.md](./config_file_detection.md) | `getConfigFile` (Q47), `getUserSnapshotContent` (e_Y), `getClaudeCodeSnapshotContent` (qzY) — shell-specific config mapping and content generation |
| [shell_integrations.md](./shell_integrations.md) | Overview of the three rg/find/grep integrations: why argv0 dispatch, build-time vs run-time control flow, composition order in the snapshot |
| [argv0_dispatch.md](./argv0_dispatch.md) | Deep dive on `createArgv0ShellFunction` (U47) — the four shell branches, why each exists, the v2.1.88→v2.1.112 path-resolution refactor |
| [ripgrep_integration.md](./ripgrep_integration.md) | `createRipgrepShellIntegration` (o_Y) — alias vs function form, `ripgrepCommand` 3-mode resolution, why rg is opt-in |
| [find_grep_integration.md](./find_grep_integration.md) | `createFindGrepShellIntegration` (s_Y) — every prepended flag explained, Oniguruma alternation gotcha, what's deliberately omitted |

Plus shared symbol additions: [../00_overview/symbol_additions_unit_06.md](../00_overview/symbol_additions_unit_06.md), [../00_overview/symbol_additions_unit_07.md](../00_overview/symbol_additions_unit_07.md)

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                          Session Start                                │
│                                                                       │
│  detectShell()  ─────────────►  createBashExecutor (iPK)              │
│                                          │                             │
│                                          ├──► createAndSaveSnapshot   │
│                                          │    (UPK)                    │
│                                          │       │                     │
│                                          │       ▼                     │
│                                          │  getConfigFile (Q47)        │
│                                          │  pathExists check (a3)      │
│                                          │  mkdir -p shell-snapshots   │
│                                          │  getSnapshotScript (KzY)    │
│                                          │       │                     │
│                                          │       ├─ getUserSnapshotCon │
│                                          │       │  tent (e_Y)         │
│                                          │       └─ getClaudeCodeSnap  │
│                                          │          shotContent (qzY)  │
│                                          │       │                     │
│                                          │       ▼                     │
│                                          │  execFile(shell,            │
│                                          │   ["-c","-l", script],     │
│                                          │   timeout: 10s)             │
│                                          │       │                     │
│                                          │       ├─ ok → stat verify   │
│                                          │       │     register E4    │
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
```

The snapshot creation happens **asynchronously** and **in parallel** with other startup work. `createBashExecutor` (iPK) kicks off `UPK` as a non-awaited Promise and only awaits it inside `buildExecCommand` on the first command. If the snapshot fails or never produces a file, the executor degrades gracefully: it falls back to spawning with `-l` (login shell), accepting the per-command cost.

---

## Key Entry Points

| Function | Symbol | Location | Purpose |
|----------|--------|----------|---------|
| `createAndSaveSnapshot` | `UPK` | chunks.144.mjs:1994 | Orchestrator: shell-type detection → script gen → execFile → verify → cleanup register |
| `getSnapshotScript` | `KzY` | chunks.144.mjs:1957 | Assembles the full `bash -c -l <script>` body that produces the snapshot |
| `getUserSnapshotContent` | `e_Y` | chunks.144.mjs:1845 | Generates functions+options+aliases capture (bash vs zsh branches) |
| `getClaudeCodeSnapshotContent` | `qzY` | chunks.144.mjs:1898 | Generates rg fallback, find/grep shadows, bq shadow, PATH export |
| `getConfigFile` | `Q47` | chunks.144.mjs:1840 | Maps shell path to `~/.zshrc` / `~/.bashrc` / `~/.profile` |
| `createArgv0ShellFunction` | `U47` | chunks.144.mjs:1810 | Cross-shell function that dispatches via ARGV0/exec-a to a binary (NEW: now looks up the binary via `CLAUDE_CODE_EXECPATH`) |
| `createRipgrepShellIntegration` | `o_Y` | chunks.144.mjs:1816 | Returns `{type: "function"\|"alias", snippet}` for the rg fallback |
| `createFindGrepShellIntegration` | `s_Y` | chunks.144.mjs:1830 | Returns combined `unalias find/grep + bfs/ugrep functions` snippet, or null |
| `createBashExecutor` | `iPK` | chunks.144.mjs:2147 | Builds executor object; kicks off snapshot promise; awaits in `buildExecCommand` |

### Constants

| Symbol | Value | Purpose |
|--------|-------|---------|
| `g47` | `1e4` (10,000 ms) | `SNAPSHOT_CREATION_TIMEOUT` for the execFile call |
| `p47` | `"\\"` | Backslash literal for base64-eval template string assembly |
| `d47` | `"CLAUDE_CODE_EXECPATH"` | Env var name holding the path to the bun-self binary that ships embedded `rg`/`bfs`/`ugrep` (NEW in this version family) |
| `a_Y` | `[".git",".svn",".hg",".bzr",".jj",".sl"]` | VCS dirs excluded from the `grep` shadow's `--exclude-dir` |

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

# Shadow find/grep with embedded bfs/ugrep (ant-native only)
unalias find 2>/dev/null || true
unalias grep 2>/dev/null || true
function find { ... ARGV0=bfs "$_cc_bin" -regextype findutils-default "$@" ... }
function grep { ... ARGV0=ugrep "$_cc_bin" -G --ignore-files --hidden -I --exclude-dir=.git ... "$@" ... }

# Add PATH to the file (heredoc with random delimiter)
cat >> "$SNAPSHOT_FILE" << 'PATH_END_<random16>'
export PATH='/usr/bin:/usr/local/bin:...'
PATH_END_<random16>
```

The heredoc with a randomized delimiter (`PATH_END_<16 random chars>`) is new in this version — prevents collisions if the user's PATH happened to contain literal `PATH_END` as a substring.

---

## Integration with Other Modules

| Module | Integration Point |
|--------|-------------------|
| Bash tool (chunks.149/151) | Calls `iPK` (createBashExecutor) which provides the snapshot-aware command assembler |
| Shell parser (29_shell_parser) | Validates user commands before they reach the snapshot-sourced shell |
| Sandbox (18_sandbox) | Snapshot path is still sourced inside sandboxed shells; `TMPDIR`/`TMPPREFIX` are overridden |
| Plugin system | `RG4()` discovers plugin `bin` directories and prepends them to the snapshot's exported PATH (NEW) |
| Ripgrep (`wj6`/`ts6`) | Provides `{rgPath, rgArgs, argv0}` consumed by `o_Y` for the rg fallback |
| Embedded tools (`$H()`) | `s_Y` checks this gate before emitting bfs/ugrep shadow functions |

---

## Key v2.1.112 Changes vs v2.1.88 / v2.1.76

Five differences worth flagging at this level (full detail in [snapshot_creation.md](./snapshot_creation.md) and [config_file_detection.md](./config_file_detection.md)):

1. **`createArgv0ShellFunction` (U47) now derives the binary at function-call time, not at snapshot-generation time.** In v2.1.88 the binary path was baked into the generated `function rg { ... }` body. In v2.1.112 each generated function reads `$CLAUDE_CODE_EXECPATH` (constant `d47`) and falls back to `command -v claude`, with a `command rg "$@"` last-resort. This means the snapshot file is portable across binary upgrades — moving the claude binary doesn't invalidate snapshots.

2. **Plugin bin paths injected into PATH.** `getClaudeCodeSnapshotContent` (qzY) now calls `await RG4()` to fetch enabled-plugin `bin/` directories and prepends them to the snapshot's exported PATH (after filtering shell-metacharacter-bearing entries on POSIX).

3. **Randomized heredoc delimiter for PATH.** Instead of `echo "export PATH=..." >>`, qzY now writes via `cat << 'PATH_END_<random16>'`. This avoids quoting nightmares when the PATH contains single quotes.

4. **`bq` shadow stub.** A `t_Y` function returns `null` here but is hooked into `qzY` — placeholder for a future Google Cloud `bq` (BigQuery) wrapper that would label query jobs with `source=claude_code`. Currently unused but the integration point is wired.

5. **`source <snapshot> 2>/dev/null || true`** instead of `source <snapshot>` in `buildExecCommand`. Failures sourcing the snapshot no longer break the command chain (e.g., if the snapshot was deleted mid-session).

Also: VCS exclusions for `grep` shadow expanded from `[".git",".svn",".hg",".bzr"]` to also include `".jj"` (Jujutsu) and `".sl"` (Sapling).

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_06.md](../00_overview/symbol_additions_unit_06.md) — this module's additions
> - [symbol_index.md](../00_overview/symbol_index.md) — main v2.1.88→v2.1.112 index

Key functions in this document:
- `createAndSaveSnapshot` (UPK) — top-level orchestrator
- `getSnapshotScript` (KzY) — script-body assembler
- `getUserSnapshotContent` (e_Y) — captures user functions/options/aliases
- `getClaudeCodeSnapshotContent` (qzY) — injects rg/find/grep/bq/PATH
- `getConfigFile` (Q47) — shell-path → config-path mapping
- `createArgv0ShellFunction` (U47) — argv[0]-dispatch shell function generator
- `createRipgrepShellIntegration` (o_Y) — rg fallback snippet builder
- `createFindGrepShellIntegration` (s_Y) — bfs/ugrep shadow builder
- `createBashExecutor` (iPK) — consumer of the snapshot promise
