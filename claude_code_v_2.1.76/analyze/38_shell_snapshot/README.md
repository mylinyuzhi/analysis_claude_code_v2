# Shell Snapshot Module (38_shell_snapshot)

> Shell environment snapshotting, CWD tracking, command assembly, process lifecycle management, and background task handling for Claude Code v2.1.76

---

## Module Overview

The Shell Snapshot module governs how Claude Code captures the user's shell environment at session start, tracks the working directory across command executions, assembles the final command string that the shell process runs, and manages the lifecycle of spawned shell processes including timeout and backgrounding.

### Core Responsibilities

1. **Shell Environment Snapshotting**: Captures functions, aliases, shell options, and exports from the user's bash/zsh configuration into a reusable snapshot file
2. **CWD Tracking**: Maintains a global current working directory that persists across individual command executions, using a file-based handoff mechanism
3. **Command Assembly**: Combines snapshot sourcing, session environment scripts, extglob disabling, eval-wrapped user commands, and CWD file writes into a single shell invocation string
4. **Process Lifecycle Management**: Handles shell process spawning, timeout detection, abort signal handling, backgrounding, and result collection via the ProcessHandler state machine
5. **Shell Executor Creation**: Builds the executor object (`createBashExecutor`) that provides `buildExecCommand`, `getSpawnArgs`, and `getEnvironmentOverrides` methods used by the main `executeShellCommand` function

---

## Documents in This Module

| Document | Description | Size |
|----------|-------------|------|
| [implementation.md](./implementation.md) | Complete snapshot implementation with source analysis: snapshot script generation for bash/zsh/sh, function capture with base64 encoding, alias extraction, option dumping, rg/find/grep tool injection | TBD |
| [cwd_tracking.md](./cwd_tracking.md) | CWD tracking mechanism: global state in `v1.cwd`, file-based CWD handoff via `pwd -P >| cwdFile`, AsyncLocalStorage per-subagent CWD, setCwd validation | TBD |
| [command_assembly.md](./command_assembly.md) | Command assembly flow: the five-stage pipeline from user command to final shell string, eval wrapping strategies, stdin redirection (`< /dev/null`), pipe-aware injection, extglob disabling | TBD |
| [background_tasks.md](./background_tasks.md) | Background task management: ProcessHandler state machine (running/backgrounded/completed/killed), TaskOutput spill-to-disk, StreamHandler stdout/stderr piping, timeout callback | TBD |
| [cross_comparison.md](./cross_comparison.md) | Three-way comparison: Claude Code (JS) vs cocode-rs (Rust) vs codex-rs (Rust) approaches to shell snapshotting, CWD tracking, and process management | TBD |

---

## Quick Reference

### Key Entry Points

| Function | Symbol | Location | Purpose |
|----------|--------|----------|---------|
| `executeShellCommand` | HP1 | chunks.89.mjs:1485 | Main entry: assembles command, spawns process, reads CWD file after exit |
| `createBashExecutor` | o54 | chunks.89.mjs:1309 | Builds executor object with `buildExecCommand`, `getSpawnArgs`, `getEnvironmentOverrides` |
| `createSnapshot` | RN8 | chunks.89.mjs:1180 | Async: runs snapshot generation script, returns path to snapshot `.sh` file |
| `generateSnapshotScript` | Ix9 | chunks.89.mjs:1145 | Generates the full shell script that sources user config and writes the snapshot file |
| `generateSnapshotContent` | Sx9 | chunks.89.mjs:1048 | Generates the functions/options/aliases capture portion of the snapshot script |
| `generateToolInjections` | Cx9 | chunks.89.mjs:1101 | Generates rg fallback, find/grep shadow functions, PATH export for the snapshot |
| `getShellConfigPath` | LN8 | chunks.89.mjs:1043 | Maps shell path to config file: `.zshrc`, `.bashrc`, or `.profile` |
| `getExtglobDisableCommand` | mx9 | chunks.89.mjs:1302 | Returns shell-specific extglob/extended-glob disable command |
| `setCwd` | VO | chunks.89.mjs:1586 | Updates global CWD after reading `pwd -P` output from CWD file |
| `setCwdState` | Xt6 | chunks.1.mjs:2374 | Sets `v1.cwd` (NFC-normalized) |
| `getCwdState` | OS | chunks.1.mjs:2370 | Returns `v1.cwd` |
| `getCwdForExecution` | k81 | chunks.14.mjs:508 | Returns AsyncLocalStorage CWD or falls back to global `OS()` |
| `createProcessHandler` | H91 | chunks.42.mjs:292 | Factory for ProcessHandler (wraps child process with timeout/abort/background) |
| `ProcessHandler` | j38 | chunks.42.mjs:195 | State machine: running -> backgrounded/completed/killed |
| `StreamHandler` | H38 | chunks.42.mjs:175 | Pipes child stdout/stderr into TaskOutput |
| `TaskOutput` | kw | chunks.42.mjs:8 | Manages process output: in-memory buffer, spill-to-disk, progress polling |
| `getSessionEnvironment` | F97 | chunks.42.mjs:612 | Loads session env scripts from `CLAUDE_ENV_FILE` and hook files |
| `wrapShellPrefix` | M91 | chunks.42.mjs:583 | Applies `CLAUDE_CODE_SHELL_PREFIX` wrapper (e.g., `nix-shell -c`) |

### Shell Execution Flow

```
Bash tool call (user command string)
     │
     ▼
┌──────────────────────────────────────┐
│ executeShellCommand (HP1)            │
│                                      │
│ 1. Get/create executor via           │
│    createBashExecutor (o54)          │
│ 2. Validate CWD exists (k81)        │
│    → recover to project root if not  │
│ 3. Build exec command                │
│ 4. Optional sandbox wrapping         │
│ 5. Spawn shell process               │
│ 6. Create ProcessHandler (H91)       │
│ 7. On exit: read CWD file → setCwd  │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ buildExecCommand (on executor)       │
│                                      │
│ Step 1: source snapshot.sh           │
│ Step 2: source session env scripts   │
│ Step 3: shopt -u extglob            │
│ Step 4: eval <quoted-command>        │
│ Step 5: pwd -P >| cwdFile           │
│                                      │
│ Joined with " && "                   │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Shell Process Lifecycle              │
│                                      │
│ spawn(shell, ["-c", command])        │
│   or ["-c", "-l", command]           │
│   (login flag skipped if snapshot    │
│    exists — snapshot already has      │
│    user's env)                        │
│                                      │
│ ProcessHandler states:               │
│   running → timeout callback         │
│          → backgrounded (spill disk) │
│          → completed (read output)   │
│          → killed (SIGKILL)          │
└──────────────────────────────────────┘
```

### Snapshot Creation Flow

```
Session start
     │
     ▼
┌──────────────────────────────────────┐
│ createSnapshot (RN8)                 │
│                                      │
│ 1. Detect shell type (zsh/bash/sh)   │
│ 2. Find config: LN8 → ~/.zshrc etc. │
│ 3. Check if config file exists       │
│ 4. Generate unique snapshot path:    │
│    ~/.claude/shell-snapshots/        │
│    snapshot-{shell}-{ts}-{rand}.sh   │
│ 5. Generate snapshot script (Ix9)    │
│ 6. Execute: shell -c -l <script>    │
│    env: GIT_EDITOR=true              │
│         CLAUDECODE=1                 │
│    timeout: 10s (p54)               │
│ 7. Verify file created & non-empty   │
│ 8. Register cleanup callback (E4)    │
│ 9. Return snapshot path              │
└──────────────────────────────────────┘
```

### Snapshot File Structure

```bash
# Snapshot file
# Unset all aliases to avoid conflicts with functions
unalias -a 2>/dev/null || true

# Functions (bash: base64-encoded eval; zsh: direct typeset -f)
eval "$(echo '<base64>' | base64 -d)" > /dev/null 2>&1
# ... per non-completion function

# Shell Options (bash: shopt -p; zsh: setopt)
shopt -s expand_aliases
shopt -p ...  # or: setopt ...

# Aliases (filtered: no winpty on Windows)
alias -- name='value'

# Check for rg availability
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  # rg function or alias fallback
fi

# Shadow find/grep with embedded bfs/ugrep (ant-native only)
function find { ... }
function grep { ... }

# PATH export
export PATH="/usr/bin:/usr/local/bin:..."
```

---

## Source Files

| File | Content |
|------|---------|
| `chunks.89.mjs` (lines ~1043-1600) | Snapshot generation (Ix9, Sx9, Cx9, LN8), executor creation (o54), shell command execution (HP1), CWD management (VO), extglob handling (mx9), command quoting (I54, B54, x54, b54), shell detection (sx9), PowerShell executor (s54) |
| `chunks.42.mjs` (lines ~1-350, ~583-651) | TaskOutput class (kw), StreamHandler (H38), ProcessHandler (j38), createProcessHandler (H91), DeadProcessHandler (k97, J38) (lines 1-350); session environment (F97, m97) (lines ~596-651), shell prefix wrapping (M91) (line ~583) |
| `chunks.1.mjs` (lines ~2370-2376) | Global CWD state: `v1.cwd`, `setCwdState` (Xt6), `getCwdState` (OS) |
| `chunks.14.mjs` (line ~508) | `getCwdForExecution` (k81): AsyncLocalStorage-aware CWD getter for subagent isolation |
| `chunks.177.mjs` (line ~551) | `getTmpDirPrefix` (IN8): platform-specific tmpdir naming (`claude-{uid}` on Unix, `claude` on Windows) |

---

## Symbol Index Reference

### Snapshot Generation

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| Ix9 | generateSnapshotScript | chunks.89.mjs:1145 | Full snapshot script: sources config, writes snapshot file, validates |
| Sx9 | generateSnapshotContent | chunks.89.mjs:1048 | Functions + options + aliases capture (bash vs zsh branches) |
| Cx9 | generateToolInjections | chunks.89.mjs:1101 | rg fallback, find/grep shadows, PATH export |
| RN8 | createSnapshot | chunks.89.mjs:1180 | Async: executes snapshot script, returns file path |
| LN8 | getShellConfigPath | chunks.89.mjs:1043 | Shell path -> config file mapping |
| Lx9 | getRipgrepInfo | chunks.89.mjs:1022 | rg path/args/argv0 for snapshot injection |
| hx9 | getFindGrepShadow | chunks.89.mjs:1036 | find/grep shadow functions using bfs/ugrep |
| yN8 | createArgv0Function | chunks.89.mjs:1015 | Generates shell function with ARGV0/exec-a dispatch |
| kN8 | BACKSLASH_ESCAPE | chunks.89.mjs:1174 | Constant: `"\\"` for base64 eval quoting |
| p54 | SNAPSHOT_TIMEOUT | chunks.89.mjs:1176 | 10000ms (10 seconds) |

### Executor & Command Assembly

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| o54 | createBashExecutor | chunks.89.mjs:1309 | Builds executor with buildExecCommand, getSpawnArgs, getEnvironmentOverrides |
| HP1 | executeShellCommand | chunks.89.mjs:1485 | Main execution: command assembly → spawn → CWD update |
| mx9 | getExtglobDisableCommand | chunks.89.mjs:1302 | Shell-specific extglob/extended-glob disable |
| I54 | quoteForEval | chunks.89.mjs:883 | Quote command for `eval`, with optional `< /dev/null` |
| B54 | quoteForPipedEval | chunks.89.mjs:914 | Quote piped commands: tokenize, insert `< /dev/null` before first pipe |
| b54 | shouldAppendDevNull | chunks.89.mjs:897 | Decision: append `< /dev/null` (false for heredocs, existing redirections) |
| x54 | replaceNulRedirects | chunks.89.mjs:903 | Replace `NUL` (Windows) with `/dev/null` in redirections |
| NN8 | hasHeredoc | chunks.89.mjs:872 | Detect heredoc syntax in command |
| Wx9 | hasMultilineQuotes | chunks.89.mjs:877 | Detect multiline quoted strings |
| jW6 | singleQuoteAndRedirect | chunks.89.mjs:996 | Fallback: single-quote entire command + `< /dev/null` |
| g54 | singleQuote | chunks.89.mjs:999 | Single-quote with escape |
| Vx9 | stripLineContinuations | chunks.89.mjs:1003 | Remove `\<newline>` continuation patterns |
| M91 | wrapShellPrefix | chunks.42.mjs:583 | Applies CLAUDE_CODE_SHELL_PREFIX wrapper |
| F97 | getSessionEnvironment | chunks.42.mjs:612 | Loads session env from CLAUDE_ENV_FILE + hook scripts |
| s54 | createPowerShellExecutor | chunks.89.mjs:1390 | PowerShell executor (Windows) |

### CWD Tracking

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| VO | setCwd | chunks.89.mjs:1586 | Validate path, resolve symlinks, call setCwdState |
| Xt6 | setCwdState | chunks.1.mjs:2374 | Set `v1.cwd` (NFC-normalized) |
| OS | getCwdState | chunks.1.mjs:2370 | Return `v1.cwd` |
| k81 | getCwdForExecution | chunks.14.mjs:508 | AsyncLocalStorage CWD or global fallback |
| ax9 | DEFAULT_TIMEOUT | chunks.89.mjs:1598 | 1800000ms (30 minutes) default command timeout |

### Process Lifecycle

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| j38 | ProcessHandler | chunks.42.mjs:195 | State machine: running/backgrounded/completed/killed |
| H91 | createProcessHandler | chunks.42.mjs:292 | Factory wrapping child process with timeout/abort/background |
| H38 | StreamHandler | chunks.42.mjs:175 | Pipes child stdout/stderr data events into TaskOutput |
| kw | TaskOutput | chunks.42.mjs:8 | Output buffer: in-memory → spill-to-disk → progress polling |
| k97 | DeadProcessHandler | chunks.42.mjs:296 | Immediate-resolve handler for aborted/failed commands |
| J38 | createDeadHandler | chunks.42.mjs:316 | Factory for DeadProcessHandler |
| E97 | createPreSpawnError | chunks.42.mjs:323 | Returns error result without spawning a process |
| v97 | SIGKILL_EXIT_CODE | chunks.42.mjs:345 | 137 (128 + SIGKILL=9) |
| N97 | TIMEOUT_EXIT_CODE | chunks.42.mjs:347 | 143 (128 + SIGTERM=15) |

### Shell Detection

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| sx9 | findShell | chunks.89.mjs:1451 | Priority-ordered shell detection: CLAUDE_CODE_SHELL, $SHELL, which zsh/bash, well-known paths |
| CN8 | isShellExecutable | chunks.89.mjs:1436 | Verify shell is executable (access check + `--version` fallback) |
| tx9 | getShellExecutor | chunks.89.mjs:1478 | Lazily-initialized singleton: findShell → createBashExecutor |

### Environment Management

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| d54 | getEnvironmentOverrideMap | chunks.89.mjs:1272 | Returns Map of additional env vars |
| c54 | clearEnvironmentOverrideMap | chunks.89.mjs:1276 | Clears the override map |
| n54 | getTmuxInfo | chunks.89.mjs:1286 | Returns TMUX variable value if available |

---

## Integration with Other Modules

| Module | Integration Point |
|--------|-------------------|
| [05_tools](../05_tools/) | Bash tool (`bash_tool.md`) calls `executeShellCommand` (HP1) as its core execution path |
| [08_subagent](../08_subagent/) | Subagents use `fork_for_subagent` pattern with isolated CWD via AsyncLocalStorage (`k81`) |
| [15_state_management](../15_state_management/) | Global `v1.cwd` is the authoritative CWD state; `setCwdState`/`getCwdState` are the read/write interface |
| [18_sandbox](../18_sandbox/) | When sandboxed, `HP1` calls `vA.wrapWithSandbox()` to wrap the assembled command and creates a per-command tmpdir for CWD file isolation |
| [26_background_agents](../26_background_agents/) | ProcessHandler's `background()` method enables the timeout-to-background transition; TaskOutput's `spillToDisk()` persists output for later reads |
| [29_shell_parser](../29_shell_parser/) | Shell parser validates the user command before it reaches `executeShellCommand`; the security pipeline runs before command assembly |

---

## Key Design Decisions

### Why Snapshot Instead of Login Shell

Every command execution could run `shell -c -l <command>` to get the user's full environment. However, this is slow (sourcing `.zshrc`/`.bashrc` on every call). The snapshot approach captures the environment once at session start and replays it via `source snapshot.sh` on each command, which is significantly faster. The login flag (`-l`) is explicitly skipped when a snapshot exists.

### Why Base64-Encode Functions (Bash)

Bash function definitions can contain any characters, including single quotes, double quotes, backslashes, and newlines. Base64 encoding ensures safe transport into the snapshot file without escaping issues. Zsh uses direct `typeset -f` output instead because its quoting rules handle these cases more reliably.

### Why `unalias -a` at Snapshot Start

Aliases get "frozen" inside function definitions at definition time in bash. If a function calls `ls` and there's an `alias ls='ls --color'`, the alias expansion happens at definition time, not invocation time. By clearing all aliases first and then re-defining them after functions, the snapshot avoids unexpected alias-in-function conflicts.

### Why `< /dev/null` on Commands

Claude Code appends `< /dev/null` to most commands to prevent them from reading from stdin, which would block indefinitely in a non-interactive context. This is skipped for heredoc commands (which need stdin) and commands that already have explicit input redirections.

### Why eval Wrapping

The user's command is wrapped in `eval <quoted-string>` rather than passed directly. This allows the shell to interpret the command string with proper expansion while keeping the outer command assembly clean. The quoting strategy varies by command complexity: simple commands use single-quoting with `< /dev/null`, piped commands get tokenized to insert `< /dev/null` before the first pipe segment, and complex commands (backticks, `$()`, loops) fall back to full single-quoting.

### File-Based CWD Handoff

Rather than parsing `pwd` output from stdout (which would mix with command output), the command writes `pwd -P >| cwdFile` to a temporary file. After the process exits, `executeShellCommand` reads this file to update the global CWD. The `>|` operator (clobber) is used to overwrite even with `noclobber` set.

### ProcessHandler State Machine

The ProcessHandler manages four states:
- **running**: Process is active, abort listener and timeout timer are registered
- **backgrounded**: Process continues but is detached from the main result flow; output spills to disk
- **completed**: Process exited normally; stdout/stderr collected
- **killed**: Process was forcefully terminated via SIGKILL

The timeout callback (`setTimeout`) fires after the configured duration and either backgrounds the process (if `shouldAutoBackground` is true) or kills it.

---

## Constants

| Symbol | Value | Purpose |
|--------|-------|---------|
| `p54` (SNAPSHOT_TIMEOUT) | 10,000 ms | Maximum time to create a shell snapshot |
| `ax9` (DEFAULT_TIMEOUT) | 1,800,000 ms (30 min) | Default command execution timeout |
| `v97` (SIGKILL_EXIT_CODE) | 137 | Exit code for killed processes (128 + 9) |
| `N97` (TIMEOUT_EXIT_CODE) | 143 | Exit code for timed-out processes (128 + 15) |
| `Rx9` (VCS_DIRS) | `[".git", ".svn", ".hg", ".bzr"]` | VCS directories excluded from grep shadow's `--exclude-dir` |

---

## Related Documents

- [Bash Tool Analysis](../05_tools/bash_tool.md) - How the Bash tool invokes shell execution
- [Sandbox Overview](../18_sandbox/overview.md) - Sandbox wrapping of shell commands
- [Background Agents Implementation](../26_background_agents/implementation.md) - Background task architecture
- [State Management](../15_state_management/) - Global state including CWD
- [Shell Parser](../29_shell_parser/) - Security validation before command execution
- [Symbol Index - Core Execution](../00_overview/symbol_index_core_execution.md) - Full symbol mappings